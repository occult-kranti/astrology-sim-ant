// Synthetic records only. These checks verify composition/precision and bounds;
// they do not validate astrology's interpretations or predict a person's life.
import { pathToFileURL } from 'node:url';
import { buildBirthReading } from '../../assets/js/core/birth-reading.js';
import { castChart, bodyPosition, norm360 } from '../../assets/js/core/astro.js';
import { lahiriAyanamsa } from '../../assets/js/core/data/vedic-data.js';

export async function run() {
  let count = 0; const failures = [];
  const ok = (value, label) => { count++; if (!value) failures.push(label); };
  const throws = (fn, label) => { try { fn(); ok(false, label); } catch { ok(true, label); } };
  const near = (a, b, tolerance = 1e-10) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
  const input = { birth: { date: '1990-01-15', timeKnown: true, time: '12:00', timeZone: 'Asia/Kolkata', lat: 28.6, lon: 77.2 }, asOf: '2026-11-02T06:30:00Z', futureYears: 3 };
  const original = JSON.stringify(input), r = buildBirthReading(input), instant = new Date('1990-01-15T06:30:00Z'), canonical = castChart(instant, 28.6, 77.2);
  ok(r.context.instantUTC === instant.toISOString(), 'Synthetic recorded IST clock resolves before chart casting');
  ok(JSON.stringify(input) === original, 'Builder does not mutate supplied private input');
  ok(Object.isFrozen(r) && Object.isFrozen(r.western.planets[0]) && Object.isFrozen(r.charts.siderealWhole), 'Private output and nested geometry are immutable');
  ok(r.calendars.rows.length === 32 && r.calendars.rows.filter(v => v.status === 'unavailable').length === 7, 'All32 named Atlas variants retain7 unavailable methods');
  ok(r.western.houses.length === 12 && r.western.planets.length === 7 && r.vedic.grahas.length === 9 && r.vedic.vargas.length === 14, 'Twelve houses and complete selected classical/Vedic inventories are present');
  ok(Object.keys(r.charts).length === 3, 'Three explicitly named chart frames exist');
  for (const [name, chart] of Object.entries(r.charts)) {
    ok(chart.cusps.length === 13 && Object.keys(chart.planets).length === 9 && !chart.planets.Fortune, name + ' retains twelve indexed cusps and omits the ambiguous raw Fortune');
    ok(chart.date === instant.toISOString() && chart.frame.length > 10, name + ' retains exact birth instant and declared frame');
  }
  const ay = lahiriAyanamsa(instant);
  ok(near(r.vedic.ayanamshaDegrees, ay), 'Ayanamsha remains full precision');
  ok(near(r.charts.siderealWhole.asc, norm360(canonical.asc - ay)), 'Sidereal horizon is shifted exactly once using full precision');
  for (const p of r.western.planets) {
    ok(near(p.longitudeDegrees, canonical.planets[p.name].lon), p.name + ' preserves canonical tropical longitude');
    ok(near(r.charts.siderealWhole.planets[p.name].lon, norm360(p.longitudeDegrees - ay)), p.name + ' sidereal coordinate is not reconstructed from rounded public ayanamsa');
    ok(p.observation && p.rule && p.interpretation && p.prompt && p.sourceIds.length, p.name + ' has visible fact/rule/interpretation/source distinction');
  }
  ok(r.western.houses.every(h => h.observation && h.rule && h.interpretation && h.prompt), 'Each life domain exposes its actual ruler/occupant chain and reflection prompt');
  ok(r.sensitivity.rows.length === 5 && r.sensitivity.rows.map(v => v.offsetMinutes).join(',') === '-15,-5,0,5,15', 'Recorded-time scenarios are explicit and bounded');
  ok(r.sensitivity.rows[2].instantUTC === r.context.instantUTC && near(r.sensitivity.rows[2].ascendant.longitudeDegrees, canonical.asc), 'Zero-offset sensitivity reuses exact original chart');
  ok(r.timeline.annual.find(v => v.phase === 'current').age === 36 && r.timeline.annual.find(v => v.phase === 'current').activatedHouse === 1, 'Annual profection uses completed civil age modulo12');
  ok(r.timeline.annual[0].startUTC === r.context.instantUTC, 'Retrospective period list begins at birth without invented biographical events');
  ok(r.timeline.annual.every(v => !/happened|you will|you were/.test(v.interpretation)), 'Annual prose does not fabricate past events or promise a future event');
  ok(r.vedic.dasha.current.phase === 'current' && r.vedic.dasha.currentAntar.phase === 'current', 'Major and subperiod are selected by actual containment');
  ok(r.vedic.dasha.antardashas.every(v => new Date(v.startUTC) >= instant && new Date(v.endUTC) > new Date(v.startUTC)), 'Theoretical prebirth antardasha starts are clipped and named separately');
  ok(r.timeline.transitWindows.length === 2 && r.timeline.transitWindows.every(v => v.days <= 731), 'Three-year catalogue obeys canonical solver window cap');
  ok(r.timeline.transits.length > 0 && r.timeline.transits.every(v => new Date(v.exactISO) >= new Date(input.asOf) && new Date(v.exactISO) <= new Date(r.context.futureEnd)), 'Exact contacts remain in the declared study window');
  const ids = r.timeline.transits.map(e => [e.exactISO,e.transitingBody,e.natalPoint,e.angle].join('|'));
  ok(new Set(ids).size === ids.length, 'Adjacent transit search windows cannot duplicate an exact contact');
  ok(r.timeline.transits.every(v => ['Jupiter','Saturn'].includes(v.transitingBody) && ['Sun','Moon','Ascendant','Midheaven'].includes(v.natalPoint)), 'Selected transit body/target limits are factual');
  ok(r.timeline.transits.every(v => v.profection == null), 'Approximate tropical-year activation is not mislabeled civil-age activation');
  const expectedPass = e => e.passCount === 1 ? `single pass (${e.motion})` : `pass ${e.passIndex} of ${e.passCount} (${e.motion})`;
  ok(r.timeline.transits.every(e => e.passNote === expectedPass(e) && e.motion === (e.retrograde ? 'retrograde' : 'direct')), 'Every transit pass label uses actual event motion rather than an assumed direct/retrograde sequence');
  const retro = r.timeline.transits.find(e => e.retrograde);
  const clipped = buildBirthReading({ ...input, asOf:new Date(new Date(retro.exactISO).getTime()-86400000).toISOString(), futureYears:1 });
  const firstRetro = clipped.timeline.transits.find(e => e.transitingBody === retro.transitingBody && e.natalPoint === retro.natalPoint && e.angle === retro.angle && Math.abs(new Date(e.exactISO)-new Date(retro.exactISO)) < 1000);
  ok(firstRetro?.passIndex === 1 && firstRetro.retrograde && firstRetro.passNote.endsWith('(retrograde)'), 'A window beginning during a retrograde episode correctly labels its first observed pass retrograde');
  ok(clipped.timeline.transits.every(e => e.passNote === expectedPass(e) && /local to the solver window/.test(e.passScope)), 'Truncated episodes retain truthful local numbering and actual motion in all labels');
  for (const event of r.timeline.returns.filter(e => e.kind === 'solar-return')) {
    const error = Math.abs(norm360(bodyPosition('Sun',new Date(event.instantUTC)).lon - canonical.planets.Sun.lon +180)-180);
    ok(error < .001, 'Solar-return marker has a small actual angular residual');
  }
  const sourceIds = new Set(r.sources.map(s => s.id)), missing = new Set();
  function walk(v) { if (!v || typeof v !== 'object') return; if (Array.isArray(v.sourceIds)) v.sourceIds.forEach(id => { if (!sourceIds.has(id)) missing.add(id); }); Object.values(v).forEach(walk); }
  walk(r); ok(missing.size === 0, 'All structured source references resolve: '+[...missing].join(','));
  const zero = buildBirthReading({ ...input, futureYears:0 });
  ok(zero.timeline.transits.length === 0 && zero.timeline.returns.length === 0 && zero.context.futureEnd === zero.context.asOf, 'Zero future years produces no silently expanded forecast window');
  const leap = buildBirthReading({ birth:{...input.birth,date:'2000-02-29'}, asOf:'2027-02-28T06:30:00Z',futureYears:0 });
  ok(leap.timeline.annual.find(v=>v.phase==='current').age === 27, 'Leap-day civil anniversaries use documented February28 convention');
  const after = buildBirthReading({ birth:{...input.birth,date:'1900-01-01'},asOf:'2099-01-01T00:00:00Z',futureYears:0 });
  ok(after.vedic.dasha.current === null && after.vedic.dasha.currentAntar === null, 'Beyond inherited daśā range returns unavailable instead of first-period fallback');
  for (const years of [-1,6,1.5,'3',NaN]) throws(()=>buildBirthReading({...input,futureYears:years}), 'Reject invalid future span '+String(years));
  throws(()=>buildBirthReading({...input,asOf:'2026-11-02'}),'Reject implicit-zone reading date');
  throws(()=>buildBirthReading({...input,asOf:'1980-01-01T00:00:00Z'}),'Reject reading date before birth');
  throws(()=>buildBirthReading({...input,asOf:'2100-01-01T00:00:00Z',futureYears:1}),'Reject future window beyond supported astronomy');
  throws(()=>buildBirthReading({...input,notes:'private undeclared metadata'}),'Reject undeclared request metadata');
  throws(()=>buildBirthReading({...input,birth:{...input.birth,timeKnown:false,time:''}}),'Do not fabricate timed charts for unknown birth time');
  throws(()=>buildBirthReading({...input,birth:{...input.birth,date:'2026-03-29',time:'01:30',timeZone:'Europe/London'}}),'Reject nonexistent recorded clock at DST gap');
  return { pass:failures.length===0, count, failures };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { const r=await run();console.log(JSON.stringify(r,null,2));if(r.failures.length)process.exitCode=1; }
