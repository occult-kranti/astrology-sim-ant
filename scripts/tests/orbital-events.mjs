import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import * as A from '../../assets/js/lib/astronomy.js';
import {buildSkySnapshot} from '../../assets/js/core/sky-dynamics.js';
import {buildOrbitalGeometry,buildOrbitalEvents,ORBITAL_BODY_IDS,ORBITAL_LIMITS} from '../../assets/js/core/orbital-events.js';

const immediate={yieldControl:()=>Promise.resolve()},DAY=86400000;
export async function run(){
  let count=0;const failures=[],ok=(v,label)=>{count++;if(!v)failures.push(label);};
  const rejects=async(fn,label)=>{try{await fn();ok(false,label);}catch{ok(true,label);}};
  const dateISO='2027-01-01T00:00:00Z',date=new Date(dateISO),pair={dateISO,bodyA:'Venus',bodyB:'Mars'},g=buildOrbitalGeometry(pair);
  const snapshot=buildSkySnapshot({dateISO,timeZone:'UTC',lat:0,lon:0},{includeCatalogStars:false});
  ok(g.origin==='Earth'&&g.frame.includes('geocentric apparent'),'Default frame is explicit apparent Earth-view');
  for(const p of g.bodies){
    const held=snapshot.bodies.find(b=>b.id===p.id);ok(Math.abs(held.longitude-p.longitude)<1e-10&&Math.abs(held.latitude-p.latitude)<1e-10&&Math.abs(held.distanceAU-p.distanceAU)<1e-10,'Earth-view coordinates reuse canonical sky convention '+p.id);
  }
  ok(Math.abs(g.true3DAngleDegrees-A.AngleBetween(A.GeoVector(A.Body.Venus,date,true),A.GeoVector(A.Body.Mars,date,true)))<1e-10,'3D angle agrees with upstream vector-angle calculation before coordinate rotation');
  ok(Math.abs(g.longitudeSeparationDegrees-g.true3DAngleDegrees)>.1,'Longitude separation retains latitude-dependent difference from actual sky angle');
  ok(g.pairAspect.type==='sextile'&&!g.pairAspect.withinOrb&&g.pairAspect.allowedOrb===3,'Nearest aspect is not reported within orb when too far away');
  ok(g.earthView.available&&g.sunView.available&&g.sunView.frame.includes('J2000'),'Both comparison frames are available and independently labelled');
  ok(Math.abs(g.earthView.true3DAngleDegrees-g.sunView.true3DAngleDegrees)>1,'Earth and Sun frame angles are calculated separately');
  ok(g.sourceIds.every(id=>g.sources.some(s=>s.id===id))&&g.limitations.some(x=>x.includes('light-time')),'Geometry has resolved source IDs and correction-frame disclosure');
  const gs=buildOrbitalGeometry({...pair,origin:'Sun'});
  for(const p of gs.bodies){const expected=snapshot.heliocentric.bodies.find(x=>x.id===p.id);ok(['x','y','z'].every(k=>Math.abs(expected[k]-p[k])<1e-12),'Sun-view matches canonical geometric AU vector '+p.id);}
  ok(Math.abs(gs.true3DAngleDegrees-A.AngleBetween(A.HelioVector(A.Body.Venus,date),A.HelioVector(A.Body.Mars,date)))<1e-10,'Sun frame 3D angle matches upstream vectors');
  const triangle=buildOrbitalGeometry({dateISO,bodyA:'Earth',bodyB:'Mars',origin:'Sun'});
  ok(!triangle.earthView.available&&triangle.earthView.reason.includes('origin'),'Earth is explicitly unavailable as its own observed direction');
  ok(triangle.sunView.available&&triangle.heliocentricTriangle.target==='Mars','Earth-inclusive Sun-view triangle is supported');
  const tr=triangle.heliocentricTriangle;ok(Math.abs(tr.angleAtSun+tr.angleAtEarth+tr.angleAtTarget-180)<1e-9,'Simultaneous Sun–Earth–Mars triangle angles sum to 180 degrees');
  ok(tr.frame.includes('geometric')&&tr.convention.includes('without light-time'),'Physical triangle is not labelled apparent sky');
  const sunPair=buildOrbitalGeometry({dateISO,bodyA:'Sun',bodyB:'Moon',origin:'Earth'});ok(sunPair.earthView.available&&!sunPair.sunView.available,'Sun has a sky direction but no heliocentric direction');
  ok(ORBITAL_BODY_IDS.length===11&&ORBITAL_BODY_IDS.includes('Earth')&&ORBITAL_LIMITS.maxSpanDays===366,'Complete declared supported set and finite window cap');
  ok(JSON.stringify(buildOrbitalGeometry({...pair,dateISO:'2027-01-01T05:30:00+05:30'}))===JSON.stringify(g),'Equivalent timestamp offsets produce identical geometry');
  ok(buildOrbitalGeometry({...pair,bodyA:'Mars',bodyB:'Venus'}).true3DAngleDegrees===g.true3DAngleDegrees,'Pair separation symmetric under endpoint swap');
  const input={startISO:'2027-01-01T00:00:00Z',endISO:'2028-01-01T00:00:00Z',bodyA:'Venus',bodyB:'Mars',origin:'Earth'},progress=[];
  const full=await buildOrbitalEvents(input,{...immediate,onProgress:p=>progress.push(p)});
  ok(full.stats.completeRequestedRange&&full.stats.searchedIntervals===1460,'Every globally anchored six-hour interval in the year is searched');
  ok(full.events.length===full.stats.events&&full.events.length>60&&full.events.length<ORBITAL_LIMITS.maxEvents,'Complete bounded event result is returned');
  ok(new Set(full.events.map(e=>e.id)).size===full.events.length,'Event IDs are unique');
  ok(full.events.every((e,i)=>!i||e.dateISO>=full.events[i-1].dateISO),'Events ordered chronologically');
  ok(full.events.every(e=>Date.parse(e.dateISO)>=Date.parse(input.startISO)&&Date.parse(e.dateISO)<Date.parse(input.endISO)),'Every event belongs to start-inclusive/end-exclusive range');
  ok(full.events.every(e=>e.sourceIds.length&&e.sourceIds.every(id=>e.sources.some(s=>s.id===id))&&e.precision.includes('model-dependent')),'Each event has resolvable sources and qualified numerical precision');
  ok(['lunar-quarters','solar-quarters','solar-eclipses','lunar-eclipses','pair-aspects'].every(stage=>progress.some(p=>p.stage===stage)),'Progress covers all native searches and pair brackets');
  ok(progress.at(-1).processed===progress.at(-1).total,'Progress completes final pair interval');
  const fixtures=JSON.parse(readFileSync(new URL('./fixtures/horizon-astronomy.json',import.meta.url))),eclipses=full.events.filter(e=>e.kind.endsWith('-eclipse'));
  const expected=fixtures.eclipses.filter(e=>e.expectedUT.startsWith('2027'));
  ok(eclipses.length===5&&expected.length===5,'All five inherited 2027 NASA catalogue eclipse fixtures present');
  for(const f of expected){const e=eclipses.find(e=>e.kind===f.family+'-eclipse'&&e.dateISO.slice(0,10)===f.expectedUT.slice(0,10));ok(e?.details.eclipseType===f.eclipseType&&Math.abs(Date.parse(e.dateISO)-Date.parse(f.expectedUT))<f.toleranceSeconds*1000,`Inherited NASA ${f.family} ${f.expectedUT}: type and TD-minus-deltaT peak within ${f.toleranceSeconds}s`);}
  ok(eclipses.every(e=>e.details.scope==='global'&&e.details.localVisibility===null&&e.limitations.some(x=>x.includes('visibility'))),'Global eclipses never imply observer visibility');
  const fresh=JSON.parse(readFileSync(new URL('./fixtures/orbital-events.json',import.meta.url))).solarEclipse2024;
  const april=await buildOrbitalEvents({startISO:'2024-04-08T00:00:00Z',endISO:'2024-04-09T00:00:00Z',bodyA:'Sun',bodyB:'Moon',origin:'Earth'},immediate),total=april.events.find(e=>e.kind==='solar-eclipse');
  ok(total?.details.eclipseType===fresh.eclipseType&&Math.abs(Date.parse(total.dateISO)-Date.parse(fresh.expectedUTApprox))<fresh.toleranceSeconds*1000,'Fresh NASA 2024-04-08 total eclipse agrees within 60s with TD minus published rounded delta-T UT approximation');
  ok(Date.parse(fresh.catalogueTD)-fresh.deltaTSeconds*1000===Date.parse(fresh.expectedUTApprox),'Fresh NASA TD-to-UT fixture arithmetic is explicit');
  ok(total.details.localVisibility===null&&total.details.scope==='global','April 2024 global maximum does not imply selected-place visibility');

  ok(full.events.filter(e=>e.kind==='lunar-quarter').length>=48&&full.events.filter(e=>e.kind==='solar-quarter').length===4,'Native lunar phases and four solar quarters are enumerated');
  const contacts=full.events.filter(e=>e.kind==='pair-aspect');
  ok(contacts.length>0&&contacts.every(e=>e.bodyIds.join('/')==='Venus/Mars'&&e.details.origin==='Earth'&&e.details.frame.includes('apparent')),'Only selected pair contacts use requested Earth-view frame');
  ok(contacts.every(e=>e.details.residualDegrees<.001&&Number.isFinite(e.details.true3DAngleDegrees)),'Every pair contact has a refined small residual and actual 3D separation');
  for(const e of contacts.slice(0,3)){const at=buildOrbitalGeometry({...pair,dateISO:e.dateISO});ok(Math.abs(at.true3DAngleDegrees-e.details.true3DAngleDegrees)<1e-10&&Math.abs(at.longitudeSeparationDegrees-e.details.longitudeSeparationDegrees)<1e-10,'Event geometry is reproducible through public geometry API '+e.dateISO);}
  ok(!JSON.stringify(full).includes('auspicious')&&!full.events.some(e=>'score'in e),'Astronomical events carry no fabricated auspiciousness or outcome score');
  const first=contacts[0],t=Date.parse(first.dateISO),sub={...input,startISO:new Date(t-DAY).toISOString(),endISO:new Date(t+DAY).toISOString()},short=await buildOrbitalEvents(sub,immediate);
  const selected=full.events.filter(e=>e.dateISO>=short.request.startISO&&e.dateISO<short.request.endISO);ok(JSON.stringify(short.events)===JSON.stringify(selected),'Subwindow reproduces full-window events on anchored brackets');
  const ending=await buildOrbitalEvents({...input,startISO:new Date(t-3600000).toISOString(),endISO:first.dateISO},immediate),starting=await buildOrbitalEvents({...input,startISO:first.dateISO,endISO:new Date(t+3600000).toISOString()},immediate);
  ok(!ending.events.some(e=>e.id===first.id)&&starting.events.some(e=>e.id===first.id),'A root belongs only to its start-inclusive adjacent partition');
  const helio=await buildOrbitalEvents({...input,bodyA:'Earth',bodyB:'Mars',origin:'Sun'},immediate),hc=helio.events.filter(e=>e.kind==='pair-aspect');
  ok(hc.length>0&&hc.every(e=>e.details.origin==='Sun'&&e.details.frame.includes('heliocentric geometric')&&e.bodyIds.includes('Earth')),'Earth-inclusive pair events are truly heliocentric');
  ok(JSON.stringify(helio.events.filter(e=>e.kind.endsWith('-eclipse')))===JSON.stringify(eclipses),'Global eclipse sequence is independent of selected pair/origin');
  const edge=await buildOrbitalEvents({startISO:'2100-12-31T23:00:00Z',endISO:'2101-01-01T00:00:00Z',bodyA:'Sun',bodyB:'Moon'},immediate);ok(edge.stats.completeRequestedRange&&edge.events.every(e=>e.dateISO.startsWith('2100')),'Exclusive 2101 boundary supports final hour without out-of-range output');
  for(const bad of [null,[],{}, {...pair,dateISO:'2027-01-01'}, {...pair,dateISO:'2027-02-30T00:00:00Z'}, {...pair,dateISO:'1899-12-31T23:59:59Z'}, {...pair,dateISO:'2101-01-01T00:00:00Z'}, {...pair,bodyA:'Earth'}, {...pair,origin:'Sun',bodyA:'Sun'}, {...pair,origin:'Moon'}, {...pair,bodyA:'Mars'}, {...pair,bodyA:'Eris'}, {...pair,aspectOrb:-1}, {...pair,aspectOrb:'3'}, {...pair,aspectOrb:Infinity}])await rejects(()=>buildOrbitalGeometry(bad),'Reject invalid geometry '+JSON.stringify(bad));
  for(const bad of [null,[],{}, {...input,startISO:'2027-01-01'}, {...input,endISO:input.startISO}, {...input,endISO:'2029-01-01T00:00:00Z'}, {...input,bodyA:'Earth'}, {...input,startUTC:input.startISO}, {...input,endISO:'2101-01-01T00:00:01Z'}])await rejects(()=>buildOrbitalEvents(bad,immediate),'Reject invalid search '+JSON.stringify(bad));
  for(const bad of [null,[],{shouldCancel:1},{onProgress:'x'},{yieldControl:true},{signal:{}}])await rejects(()=>buildOrbitalEvents(input,bad),'Reject malformed hooks '+JSON.stringify(bad));
  for(const stage of ['lunar-quarters','solar-quarters','solar-eclipses','lunar-eclipses','pair-aspects']){let stop=false,error;try{await buildOrbitalEvents(input,{...immediate,shouldCancel:()=>stop,onProgress:p=>{if(p.stage===stage)stop=true;}});}catch(e){error=e;}ok(error?.code==='CANCELLED'&&error?.name==='AbortError','Cancellation exits '+stage+' without partial result');}
  const controller=new AbortController();controller.abort();await rejects(()=>buildOrbitalEvents(input,{signal:controller.signal}),'Pre-aborted signal exits before calculation');
  const recovery=await buildOrbitalEvents(sub,immediate);ok(JSON.stringify(recovery)===JSON.stringify(short),'A cancelled search leaves no shared state in next call');
  return{count,failures,telemetry:{yearEvents:full.events.length,pairContacts:contacts.length,eclipses:eclipses.length,positionCalculations:full.stats.positionCalculations,heliocentricContacts:hc.length}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(JSON.stringify(r,null,2));if(r.failures.length)process.exitCode=1;}
