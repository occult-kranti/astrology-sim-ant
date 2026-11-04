import assert from 'node:assert/strict';
import {
  ASTROCARTOGRAPHY_BODY_IDS, ASTROCARTOGRAPHY_ANGLE_IDS, ASTROCARTOGRAPHY_DEMO_PROFILE,
  ASTROCARTOGRAPHY_EARTH_RADIUS_KM, normalizeAstrocartographyInputs,
  getAstrocartographyBodyPositions, lineGeometryForBody, distanceToAstrocartographyLine,
  intersectAstrocartographyLines, buildAstrocartography, inspectAstrocartographyPlace,
  exportAstrocartography, exportAstrocartographyPlace,
} from '../../assets/js/core/astrocartography.js';
import { ASTROCARTOGRAPHY_CITIES, ASTROCARTOGRAPHY_PURPOSES } from '../../assets/js/core/data/astrocartography-data.js';

let assertions=0;
const ok=(v,m)=>{assert.ok(v,m);assertions++;};
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++;};
const near=(a,b,t=1e-8,m='')=>{assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=t,`${m}: ${a} vs ${b}, tolerance ${t}`);assertions++;};
const fail=(fn,pattern)=>{assert.throws(fn,pattern);assertions++;};
const base={profile:{...ASTROCARTOGRAPHY_DEMO_PROFILE}};
const D=Math.PI/180,wrap=x=>((x+180)%360+360)%360-180;
const synthetic=(ra=0,dec=0,id='Sun',gast=0)=>lineGeometryForBody({id,raDegrees:ra,declinationDegrees:dec},gast);
const byAngle=(rows,id)=>rows.lines.find(l=>l.angle===id);
const place=(lat,lon,timeZone='UTC')=>({name:'Public geometry test',lat,lon,timeZone});
eq(ASTROCARTOGRAPHY_BODY_IDS.length,10);eq(ASTROCARTOGRAPHY_ANGLE_IDS.length,4);
eq(normalizeAstrocartographyInputs({...base,cityIds:[]}).cityIds,[]);
ok(ASTROCARTOGRAPHY_CITIES.length>0&&ASTROCARTOGRAPHY_CITIES.length<=40);
for(const bad of [null,[],{}, {...base,unknown:1},{...base,profile:{...base.profile,localTime:undefined}},
 {...base,profile:{...base.profile,name:''}},{...base,profile:{...base.profile,name:'\0bad'}},
 {...base,profile:{...base.profile,lat:NaN}},{...base,profile:{...base.profile,lat:91}},
 {...base,profile:{...base.profile,lon:181}},{...base,profile:{...base.profile,lat:'0'}},
 {...base,profile:{...base.profile,timeZone:'Mars/Olympus'}},
 {...base,profile:{...base.profile,localDate:'1900-02-29'}},{...base,profile:{...base.profile,localDate:'2100-02-29'}},
 {...base,profile:{...base.profile,localDate:'1899-12-31'}},{...base,profile:{...base.profile,localDate:'2101-01-01'}},
 {...base,profile:{...base.profile,localDate:'2024-02-30'}},{...base,profile:{...base.profile,localTime:'24:00'}},
 {...base,profile:{...base.profile,disambiguation:'compatible'}},{...base,profile:{...base.profile,timeKnown:false}},
 {...base,bodyIds:[]},{...base,bodyIds:['Earth']},{...base,bodyIds:['Sun','Sun']},{...base,angleIds:[]},
 {...base,angleIds:['asc']},{...base,angleIds:['MC','MC']},{...base,cityIds:['missing-city']},
 {...base,system:'unknown'},{...base,purpose:'war'},{...base,radiusKm:0},{...base,radiusKm:3001},
 {...base,radiusKm:NaN},{...base,radiusKm:'500'},{...base,bodyIds:new Array(1)}])fail(()=>normalizeAstrocartographyInputs(bad));
for(const key of ['name','localDate','localTime','timeZone','lat','lon','disambiguation']){const p={...base.profile};delete p[key];fail(()=>normalizeAstrocartographyInputs({profile:p}));}
let getterRan=false;
const accessor={...base};Object.defineProperty(accessor,'bodyIds',{enumerable:true,get(){getterRan=true;return['Sun'];}});fail(()=>normalizeAstrocartographyInputs(accessor));eq(getterRan,false);
const hidden={...base};Object.defineProperty(hidden,'radiusKm',{value:500});fail(()=>normalizeAstrocartographyInputs(hidden));
const arrayAccessor=[];Object.defineProperty(arrayAccessor,'0',{enumerable:true,get(){getterRan=true;return'Sun';}});fail(()=>normalizeAstrocartographyInputs({...base,bodyIds:arrayAccessor}));eq(getterRan,false);
const iterator=['Sun'];iterator[Symbol.iterator]=()=>{getterRan=true;return[][Symbol.iterator]();};fail(()=>normalizeAstrocartographyInputs({...base,bodyIds:iterator}));eq(getterRan,false);
fail(()=>normalizeAstrocartographyInputs(Object.assign(Object.create({hidden:1}),base)));
eq(normalizeAstrocartographyInputs({...base,profile:{...base.profile,localDate:'2000-02-29'}}).profile.localDate,'2000-02-29');
for(const disambiguation of ['reject','earlier','later'])fail(()=>normalizeAstrocartographyInputs({...base,profile:{...base.profile,localDate:'2024-03-10',localTime:'02:30',timeZone:'America/New_York',disambiguation}}),/does not exist/);
fail(()=>normalizeAstrocartographyInputs({...base,profile:{...base.profile,localDate:'2024-11-03',localTime:'01:30',timeZone:'America/New_York'}}),/occurs twice/);
fail(()=>normalizeAstrocartographyInputs({...base,profile:{...base.profile,localDate:'2011-12-30',timeZone:'Pacific/Apia'}}),/does not exist/);

// Independent exact geometry, including the opposite half of one great circle.
const zero=synthetic();eq(zero.lines.length,4);
for(const [a,lon]of [['MC',0],['IC',180],['ASC',-90],['DSC',90]]){
 near(distanceToAstrocartographyLine(byAngle(zero,a),place(0,lon)).distanceKm,0,1e-8);
 near(distanceToAstrocartographyLine(byAngle(zero,a),place(0,wrap(lon+180))).angularDistanceDegrees,90,1e-8);
}
near(distanceToAstrocartographyLine(byAngle(zero,'ASC'),place(0,90)).distanceKm,Math.PI/2*ASTROCARTOGRAPHY_EARTH_RADIUS_KM,1e-7);
for(const dec of [-90,90]){const r=synthetic(20,dec);eq(r.lines,[]);ok(r.warnings[0].includes('undefined'));}
fail(()=>synthetic(0,91));fail(()=>synthetic(NaN));
const thirty=synthetic(0,30),rising=byAngle(thirty,'ASC'),setting=byAngle(thirty,'DSC');
const hourAngle=Math.acos(-Math.tan(45*D)*Math.tan(30*D))/D;
near(hourAngle,125.26438968275465,1e-11);
near(distanceToAstrocartographyLine(rising,place(45,-hourAngle)).distanceKm,0,1e-8);
near(distanceToAstrocartographyLine(setting,place(45,hourAngle)).distanceKm,0,1e-8);
near(distanceToAstrocartographyLine(rising,place(60,180)).distanceKm,0,1e-8);
ok(distanceToAstrocartographyLine(rising,place(70,180)).distanceKm>1000,'Circumpolar latitude must not have a false horizon root');
const touching=intersectAstrocartographyLines(rising,byAngle(synthetic(0,10,'Moon'),'IC'));
eq(touching.points.length,1);eq(touching.points[0].kind,'grazing-boundary');near(touching.points[0].lat,60,1e-8);
const duplicate=intersectAstrocartographyLines(byAngle(zero,'MC'),byAngle(synthetic(0,10,'Moon'),'IC'));
eq(duplicate.status,'unresolved-coincident-or-near-parallel');eq(duplicate.points,[]);
eq(intersectAstrocartographyLines(byAngle(zero,'MC'),byAngle(synthetic(60,10,'Moon'),'MC')).points,[]);

// Dense display paths obey the physical plane and have no dateline jump.
// The independent altitude derivative checks ASC/DSC direction, not copied vector algebra.
let sampledPoints=0;
for(const ra of [-180,-179.999,-90,0,89.999,179.999,360])for(const dec of [-80,-30,-0.001,0,0.001,30,80]){
 const g=synthetic(ra,dec,'Sun',42);
 for(const line of g.lines)for(const segment of line.segments){
  ok(segment.length>=2);
  for(let i=0;i<segment.length;i++){
   const [lon,lat]=segment[i];sampledPoints++;ok(Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90.0000001);
   if(i)ok(Math.abs(lon-segment[i-1][0])<=180+1e-8,'Dateline must be split');
   if(Math.abs(lat)>89.99999)continue;
   const H=(42+lon-ra)*D,phi=lat*D,delta=dec*D;
   if(['ASC','DSC'].includes(line.angle)){
    const altAt=h=>Math.sin(phi)*Math.sin(delta)+Math.cos(phi)*Math.cos(delta)*Math.cos(h);
    near(altAt(H),0,1e-8,'Horizon center altitude');
    const slope=altAt(H+1e-7)-altAt(H-1e-7);
    if(Math.abs(Math.abs(lat)-(90-Math.abs(dec)))>1e-5)ok(line.angle==='ASC'?slope>0:slope<0,'Rising/setting finite-difference derivative');
   }else near(Math.abs(wrap(lon-(ra-42))),line.angle==='MC'?0:180,1e-7,'Meridian longitude');
  }
 }
}

// Exact distance must agree with a wholly separate dense arc search to its
// sampling resolution. Endpoints are essential for the opposite hemisphere.
for(const line of synthetic(143,27).lines)for(const p of [place(0,0),place(50,-170),place(-62,80),place(89,1),place(-89,-179)]){
 const actual=distanceToAstrocartographyLine(line,p);
 let sampledMin=Infinity;
 for(let i=0;i<=3600;i++){
  const t=-Math.PI/2+Math.PI*i/3600,m=line.geometry.midpoint,v=line.geometry.tangent;
  const q=m.map((x,j)=>x*Math.cos(t)+v[j]*Math.sin(t)),lat=Math.asin(q[2]),lon=Math.atan2(q[1],q[0]);
  const h=Math.sin((lat-p.lat*D)/2)**2+Math.cos(lat)*Math.cos(p.lat*D)*Math.sin((lon-p.lon*D)/2)**2;
  sampledMin=Math.min(sampledMin,2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))))/D);
 }
 ok(actual.angularDistanceDegrees<=sampledMin+1e-7);ok(sampledMin-actual.angularDistanceDegrees<0.026);
}

const snapshot=JSON.stringify(base),study=buildAstrocartography(base);eq(JSON.stringify(base),snapshot);eq(study.lines.length,40);eq(study.bodies.length,10);eq(study.context.instantISO,'2024-03-20T03:06:00.000Z');
ok(study.context.timeConvention.includes('Delta-T'));ok(study.bodies.find(b=>b.id==='Moon').positionMethod.includes('shortcut'));
for(const crossing of study.crossings){
 ok(crossing.bodyIds[0]!==crossing.bodyIds[1]);ok(Math.abs(crossing.lat)<90);
 for(const id of crossing.lineIds)near(distanceToAstrocartographyLine(study.lines.find(l=>l.id===id),crossing).distanceKm,0,1e-5);
}
const shifted=buildAstrocartography({profile:{...base.profile,localTime:'08:36',timeZone:'Asia/Kolkata',lat:-90,lon:180},system:'whole',purpose:'career',radiusKm:3000,cityIds:[]});
eq(shifted.context.instantISO,study.context.instantISO);eq(shifted.bodies,study.bodies);eq(shifted.lines,study.lines);eq(shifted.crossings,study.crossings);eq(shifted.cityRankings,[]);
const folds=['earlier','later'].map(disambiguation=>buildAstrocartography({...base,bodyIds:['Sun'],cityIds:[],profile:{...base.profile,localDate:'2024-11-03',localTime:'01:30',timeZone:'America/New_York',disambiguation}}));
eq(new Date(folds[1].context.instantISO)-new Date(folds[0].context.instantISO),3600000);ok(folds.every(f=>f.context.ambiguous));ok(folds[0].bodies[0].subpoint.lon!==folds[1].bodies[0].subpoint.lon);
for(const dateISO of ['1900-01-01T00:00:00Z','2000-02-29T12:00:00Z','2024-04-08T18:00:00Z','2030-12-31T23:59:59Z','2100-12-31T23:59:59Z']){
 const e=getAstrocartographyBodyPositions(dateISO);eq(e.bodies.length,10);ok(e.gastDegrees>=0&&e.gastDegrees<360);
 for(const b of e.bodies){ok(b.raDegrees>=0&&b.raDegrees<360);ok(Math.abs(b.declinationDegrees)<=90);ok(b.distanceAU>0);near(wrap(b.raDegrees-e.gastDegrees),b.subpoint.lon);}
}
for(const bad of ['2024-03-20','1899-12-31T23:59:59Z','2101-01-01T00:00:00Z','2024-02-30T00:00:00Z'])fail(()=>getAstrocartographyBodyPositions(bad));

// Scoring arithmetic is independently reconstructed from measured distances.
// House systems and birthplace do not enter this intentionally editorial rubric.
const selectedPlace=place(40.7128,-74.006,'America/New_York');
for(const purpose of ASTROCARTOGRAPHY_PURPOSES){
 const inspection=inspectAstrocartographyPlace({...base,purpose:purpose.id,bodyIds:['Sun','Mars','Saturn'],radiusKm:3000,cityIds:[]},selectedPlace);
 const weights=['Sun','Mars','Saturn'].map(id=>purpose.planetWeights[id]??0),den=weights.reduce((sum,x)=>sum+Math.abs(x),0);
 const numerator=['Sun','Mars','Saturn'].reduce((sum,id)=>sum+(purpose.planetWeights[id]??0)*Math.max(...inspection.distances.filter(d=>d.bodyId===id).map(d=>(purpose.angleWeights[d.angle]??0)*Math.max(0,1-d.distanceKm/3000))),0);
 near(inspection.ranking.score,den?100*numerator/den:0,1e-9);eq(inspection.ranking.denominator,den);
 eq(inspection.relocation.instantISO,study.context.instantISO);eq(inspection.relocatedStudy.primary.dateISO,study.context.instantISO);
 eq(inspection.reading.context.instantISO,study.context.instantISO);eq(Object.keys(inspection.reading.frameworks).length,9);
 ok(inspection.relocatedStudy.primary.bodies.find(b=>b.id==='Sun').dignity!==null);
}
for(const system of ['regiomontanus','placidus','whole','equal']){
 const out=inspectAstrocartographyPlace({...base,system,cityIds:[]},place(78,15,'Arctic/Longyearbyen'));
 eq(out.relocation.requestedSystem,system);eq(out.relocation.status,'available');eq(out.relocatedStudy.primary.dateISO,study.context.instantISO);
 if(system==='placidus')ok(out.relocation.houseWarning,'Polar Placidus fallback must be exposed');
}
const polar=inspectAstrocartographyPlace(base,place(90,0));eq(polar.relocation.status,'unavailable');eq(polar.ranking.status,'undefined-at-pole');eq(polar.ranking.score,null);eq(polar.ranking.contributions,[]);eq(polar.distances.length,40);ok(polar.reading!==null);eq(polar.reading.frameworks.lilly.facts.chart,undefined);
for(const p of [null,place(91,0),{...selectedPlace,timeZone:undefined},{...selectedPlace,derivedFacts:{}}])fail(()=>inspectAstrocartographyPlace(base,p));
const summary=exportAstrocartography(base),placeSummary=exportAstrocartographyPlace(base,selectedPlace);
eq(summary.scope.totalLines,40);eq(summary.scope.totalCrossings,study.crossings.length);eq(summary.scope.totalCities,study.cityRankings.length);ok(summary.scope.renderGeometryOmitted);
eq(placeSummary.distances.length,40);eq(Object.keys(placeSummary.calendarFacts).length,9);eq(placeSummary.relocatedChart.bodies.length,12);eq(placeSummary.relocatedChart.houses.length,12);
ok(placeSummary.relocatedChart.bodies.find(b=>b.id==='Sun').sourceIds.includes('DESKTOP-LILLY'));
eq(placeSummary.relocatedChart.dateISO,study.context.instantISO);ok(placeSummary.scope.fullInspectorAvailable);
for(const output of [summary,placeSummary])ok(Buffer.byteLength(JSON.stringify(output))<=24576,'Default compact export usable under24KiB');
const polarSummary=exportAstrocartographyPlace(base,place(-90,0));eq(polarSummary.ranking.score,null);eq(polarSummary.relocatedChart,null);eq(polarSummary.distances.length,40);
ok(summary.sources.every(s=>s.id&&s.locator&&s.readingDepth&&s.rightsScope));
eq(summary.scope.shownCities,6);eq(summary.scope.nearestLinesPerShownCity,1);
eq(placeSummary.scope.shownSourceCount,placeSummary.sources.length);eq(placeSummary.scope.sourceCount,placeSummary.sources.length+placeSummary.scope.omittedSourceIds.length);
ok(placeSummary.scope.omittedCalendarFields.some(s=>s.includes('Lilly')));
eq(placeSummary.calendarFacts.lilly.facts.chart.summaryRef,'relocatedChart');
// Compact transport must work for ordinary all-body defaults even with long
// UTF-8 labels, old/future calendar facts and long high-latitude fallback notes.
let exportCases=0,maxExportBytes=0;
for(const localDate of ['1900-01-01','2000-02-29','2024-03-20','2024-11-03','2030-12-31','2099-12-31','2100-12-31'])for(const [lat,lon]of [[0,0],[51.4779,0],[78,15],[89.9,-179],[90,180],[-90,-180]])for(const purpose of ASTROCARTOGRAPHY_PURPOSES){
 const input={profile:{...base.profile,name:'中'.repeat(100),localDate,localTime:'12:00'},purpose:purpose.id,system:'placidus'};
 const out=exportAstrocartographyPlace(input,{name:'界'.repeat(100),lat,lon,timeZone:'UTC'}),bytes=Buffer.byteLength(JSON.stringify(out));
 exportCases++;maxExportBytes=Math.max(maxExportBytes,bytes);ok(bytes<=24576);eq(out.distances.length,40);eq(Object.keys(out.calendarFacts).length,9);
 eq(out.context.instantISO,`${localDate}T12:00:00.000Z`);eq(out.inputs.profile.name,input.profile.name);
 if(Math.abs(lat)<90){eq(out.relocatedChart.bodies.length,12);eq(out.relocatedChart.houses.length,12);}else eq(out.relocatedChart,null);
}
console.log(`PASS astrocartography: ${assertions} checks; ${sampledPoints} display coordinates, ${exportCases} extreme compact exports (max ${maxExportBytes} bytes), 10 bodies × 4 angles, half-arc geometry, strict clocks, purpose arithmetic and relocated exports.`);
