// Numerical adapter regression and bounded stress. Reuses the canonical
// ephemeris but independently checks angular/cusp/step arithmetic below.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { buildDesktopStudy, normalizeDesktopProfile, exportDesktopStudy, stepDesktopProfile, DESKTOP_HOUSES } from '../../assets/js/core/desktop-workbench.js';
import { castChart } from '../../assets/js/core/astro.js';
import { lahiriAyanamsa } from '../../assets/js/core/data/vedic-data.js';

const started = performance.now();
let checks = 0, casts = 0;
function ok(value, message) { checks++; assert.ok(value, message); }
function equal(a,b,message) { checks++; assert.deepEqual(a,b,message); }
function near(a,b,tol=1e-8,message='Numeric agreement') { ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= tol, `${message}: ${a} vs ${b}`); }
function rejects(fn, pattern) { checks++; assert.throws(fn, pattern); }
const circular = x => ((x % 360) + 360) % 360;
const sep = (a,b) => Math.min(circular(a-b), circular(b-a));
const p = { name: 'Public equinox demonstration', localDate: '2024-03-20', localTime: '03:06', timeZone: 'Europe/London', lat: 51.5074, lon: -0.1278, disambiguation: 'reject' };
function study(opts={}) { casts++; return buildDesktopStudy({primary:p,...opts}); }
const s = study();
equal(s.primary.dateISO,'2024-03-20T03:06:00.000Z','Explicit zone to UTC');
equal(s.primary.bodies.length,12,'Ten planets and two mean node points');
near(sep(s.primary.bodies[0].lon,0),0,.002,'Public 2024 equinox fixture near Aries boundary');
equal(s.primary.bodies[0].sign.name,'Pisces');
ok(s.primary.bodies[0].label.endsWith('Pisces'),'Truncation avoids contradictory sign at rounded equinox');
equal(s.primary.chart.cusps.length,13,'One-indexed twelve cusps');
ok(!('Fortune' in s.primary.chart.planets),'No unlabelled Lot convention');
const canonical = castChart(new Date(s.primary.dateISO),p.lat,p.lon,'placidus');
for (const id of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn']) near(s.primary.chart.planets[id].lon, canonical.planets[id].lon,1e-8,`${id} canonical replay`);
for (let i=1;i<=12;i++) near(s.primary.chart.cusps[i],canonical.cusps[i],1e-8,`Cusp ${i}`);
for (const a of s.primary.aspects) {
  const x=s.primary.bodies.find(b=>b.id===a.from),y=s.primary.bodies.find(b=>b.id===a.to);
  near(a.orb,Math.abs(sep(x.lon,y.lon)-a.angle),1e-8,'Independent aspect separation');
  ok(a.orb<=s.inputs.orb+1e-10,'Aspect within explicit uniform orb');
}
const node = s.primary.aspects.find(a=>a.from==='NorthNode'&&a.to==='SouthNode');
equal(node.phase,'exact'); equal(node.applying,null,'Exact node opposition has no invented phase');
const sid=study({zodiac:'lahiri',system:'whole'}), ay=lahiriAyanamsa(new Date(sid.primary.dateISO));
near(sid.primary.chart.asc,circular(canonical.asc-ay));
near(sid.primary.houses[0].lon,Math.floor(sid.primary.chart.asc/30)*30);
for(const b of sid.primary.bodies) {
 near(b.lon,circular(b.tropicalLongitude-ay));
 equal(b.house,((Math.floor(b.lon/30)-Math.floor(sid.primary.chart.asc/30)+12)%12)+1,'Independent sidereal whole-sign house');
 equal(b.dignity,null,'Do not apply Lilly dignity to the sidereal frame');
}
const cmp = study({mode:'synastry',secondary:{...p,name:'Second public sky',localDate:'2025-03-20',localTime:'09:01'}});
ok(cmp.crossAspects.length>0);
for(const a of cmp.crossAspects) {
 equal(a.applying,null); equal(a.separating,null); equal(a.phase,'not-applicable');
 near(a.orb,Math.abs(sep(cmp.primary.chart.planets[a.from].lon,cmp.secondary.chart.planets[a.to].lon)-a.angle));
}
const tr=study({mode:'transit',secondary:{...p,localDate:'2026-11-04'}});
for(const a of tr.crossAspects) {
 const x=tr.primary.chart.planets[a.from],y=tr.secondary.chart.planets[a.to];
 const now=Math.abs(sep(x.lon,y.lon)-a.angle),future=Math.abs(sep(x.lon,y.lon+y.speed*.05)-a.angle);
 equal(a.applying,now<1e-8?null:future<now,'Transit phase holds natal point fixed');
}
// Deliberately corrupt computed rows: export recomputes from whitelisted input.
const injected=structuredClone(s); injected.primary.bodies[0].lon=123; injected.inputs.primary.secret='omit-me'; injected.extra='omit-me';
const portable=exportDesktopStudy(injected);
near(portable.primary.bodies[0].lon,s.primary.bodies[0].lon);
ok(!JSON.stringify(portable).includes('omit-me'),'Unrecognized metadata never leaves export boundary');
equal(portable.primary.chart.date,s.primary.dateISO);
equal(portable.kind,'astrology-desktop-study');

const ny={...p,timeZone:'America/New_York',lat:40.7128,lon:-74.006};
rejects(()=>normalizeDesktopProfile({...ny,localDate:'2024-03-10',localTime:'02:30'}),e=>e.code==='NONEXISTENT_TIME');
rejects(()=>normalizeDesktopProfile({...ny,localDate:'2024-11-03',localTime:'01:30'}),e=>e.code==='AMBIGUOUS_TIME');
const early=normalizeDesktopProfile({...ny,localDate:'2024-11-03',localTime:'01:30',disambiguation:'earlier'}),late=normalizeDesktopProfile({...ny,localDate:'2024-11-03',localTime:'01:30',disambiguation:'later'});
equal(Date.parse(late.dateISO)-Date.parse(early.dateISO),3600000,'DST fold one hour apart');
equal(early.offsetHours,-4);equal(late.offsetHours,-5);
const intoFold=stepDesktopProfile(early,1,'hour'); equal(intoFold.dateISO,late.dateISO);equal(intoFold.disambiguation,'later');
const acrossSpring=stepDesktopProfile({...ny,localDate:'2024-03-09',localTime:'12:00'},1,'day'); equal(acrossSpring.localTime,'13:00:00','Day steps are elapsed24h, visibly not wallclock day');
const leap=stepDesktopProfile({...p,localDate:'2024-02-29',timeZone:'UTC'},1,'year');equal(leap.localDate,'2025-02-28');
const month=stepDesktopProfile({...p,localDate:'2024-01-31',timeZone:'UTC'},1,'month');equal(month.localDate,'2024-02-29');
const previous=stepDesktopProfile({...p,localDate:'2024-03-31',timeZone:'UTC'},-1,'month');equal(previous.localDate,'2024-02-29');
rejects(()=>normalizeDesktopProfile({...p,timeZone:'Not/AZone'}),RangeError);
rejects(()=>normalizeDesktopProfile({...p,localDate:'2024-02-30'}),RangeError);
rejects(()=>normalizeDesktopProfile({...p,localTime:'24:00'}),RangeError);
rejects(()=>normalizeDesktopProfile({...p,lat:90}),/poles/);
rejects(()=>normalizeDesktopProfile({...p,lat:-90}),/poles/);
rejects(()=>normalizeDesktopProfile({...p,lat:'51'}),RangeError);
rejects(()=>normalizeDesktopProfile({...p,lon:181}),RangeError);
rejects(()=>normalizeDesktopProfile({...p,timeKnown:false}),/known time/);
rejects(()=>normalizeDesktopProfile({...p,localDate:'1899-12-31'}),/1900/);
rejects(()=>normalizeDesktopProfile({...p,localDate:'2101-01-01'}),/2100/);
rejects(()=>normalizeDesktopProfile({...p,localDate:'1900-01-01',localTime:'00:00',timeZone:'Asia/Kolkata'}),/UTC years/);
rejects(()=>study({orb:'3'}),/orb/);rejects(()=>study({orb:11}),/orb/);rejects(()=>study({orb:-1}),/orb/);
rejects(()=>study({zodiac:'draconic'}),/lahiri/);rejects(()=>study({system:'koch'}),/house/);rejects(()=>study({mode:'returns'}),/synastry/);
rejects(()=>study({mode:'synastry'}),/profile/);rejects(()=>stepDesktopProfile(p,.5,'day'),/integer/);
rejects(()=>stepDesktopProfile({...p,localDate:'2100-12-31'},1,'day'),/2100/);
rejects(()=>normalizeDesktopProfile({...p,name:'x'.repeat(101)}),/100/);
rejects(()=>normalizeDesktopProfile({...p,name:'bad\nname'}),/text/);
const polar=study({primary:{...p,lat:78.22,lon:15.65,timeZone:'Arctic/Longyearbyen'},system:'placidus'});
equal(polar.primary.requestedSystem,'placidus');equal(polar.primary.actualSystem,'regiomontanus');ok(polar.primary.warnings.some(w=>w.includes('Placidus')),'Polar fallback explicit');

// A finite 144-chart stress grid: three epochs x six observers x four houses x two frames.
const locations=[{lat:0,lon:0,timeZone:'UTC'},{lat:51.5074,lon:-.1278,timeZone:'Europe/London'},{lat:40.7128,lon:-74.006,timeZone:'America/New_York'},{lat:19.076,lon:72.8777,timeZone:'Asia/Kolkata'},{lat:-33.8688,lon:151.2093,timeZone:'Australia/Sydney'},{lat:78.22,lon:15.65,timeZone:'Arctic/Longyearbyen'}];
let stress=0;
for(const localDate of ['1900-06-15','2000-06-15','2100-06-15']) for(const loc of locations) for(const system of DESKTOP_HOUSES) for(const zodiac of ['tropical','lahiri']) {
 const v=study({primary:{...p,...loc,localDate,localTime:'12:00'},system,zodiac}); stress++;
 equal(v.primary.bodies.length,12);
 for(const b of v.primary.bodies) {
  ok(Number.isFinite(b.lon)&&b.lon>=0&&b.lon<360,'Bounded longitude');
  ok(Number.isFinite(b.speed),'Finite speed');
  ok(Number.isInteger(b.house)&&b.house>=1&&b.house<=12,'Valid house');
 }
 for(const h of v.primary.houses) ok(Number.isFinite(h.lon)&&h.lon>=0&&h.lon<360,'Valid cusp');
 near(sep(v.primary.chart.planets.NorthNode.lon,v.primary.chart.planets.SouthNode.lon),180,1e-8);
}
equal(stress,144);
console.log(JSON.stringify({status:'PASS',checks,casts,stressCharts:stress,durationMs:Math.round(performance.now()-started),scope:'Canonical coordinate replay, independent angle/whole-sign/UTC-step arithmetic, input rejection and bounded stress; not independent full-range ephemeris validation.'},null,2));
