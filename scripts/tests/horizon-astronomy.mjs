import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import * as A from '../../assets/js/lib/astronomy.js';
import {buildHorizonAstronomy,HORIZON_ASTRONOMY_LIMITS} from '../../assets/js/core/horizon-astronomy.js';

const fixtures=JSON.parse(readFileSync(new URL('./fixtures/horizon-astronomy.json',import.meta.url)));
const DAY=86400000,delta=(a,b)=>((a-b+540)%360)-180;
function point(body,ms){const date=new Date(ms),v=A.GeoVector(A.Body[body],date,true),s=A.SphereFromVector(A.RotateVector(A.Rotation_EQJ_ECT(date),v));return{longitude:s.lon,latitude:s.lat,v};}
const immediate={yieldControl:()=>Promise.resolve()};
const fullInput={startUTC:'2026-10-29T18:30:00Z',endUTC:'2031-01-02T05:00:00Z'};

export async function run(){
  let count=0;const failures=[],ok=(condition,label)=>{count++;if(!condition)failures.push(label);};
  const rejects=async(fn,label)=>{try{await fn();ok(false,label);}catch{ok(true,label);}};
  const t=performance.now(),progress=[];
  const full=await buildHorizonAstronomy(fullInput,{...immediate,onProgress:p=>progress.push(p)}),elapsedMs=performance.now()-t;
  ok(full.range.startUTC==='2026-10-29T18:30:00.000Z'&&full.range.endUTC==='2031-01-02T05:00:00.000Z','Full union of London/Delhi/New York civil dates is covered without clipping');
  ok(full.stats.completeRequestedRange&&full.stats.scannedIntervals===6102,'All globally anchored six-hour brackets, including both partial boundary intervals, are searched');
  ok(full.stats.events===full.events.length&&full.events.length>5000,'All event rows returned with exact count; no display cap or truncated array');
  ok(full.stats.positionCalculations<HORIZON_ASTRONOMY_LIMITS.maxPositionCalculations,'Declared finite work bound is respected on full horizon');
  ok(new Set(full.events.map(e=>e.id)).size===full.events.length,'Event identifiers are unique');
  ok(full.events.every((e,i)=>!i||e.startUTC>=full.events[i-1].startUTC),'Stable chronological ordering');
  ok(full.events.every(e=>Date.parse(e.startUTC)>=Date.parse(fullInput.startUTC)&&Date.parse(e.startUTC)<Date.parse(fullInput.endUTC)),'Every returned root obeys start-inclusive/end-exclusive interval');
  const sourceIds=new Set(full.sources.map(x=>x.id));
  ok(full.events.every(e=>e.sourceIds.length&&e.sourceIds.every(x=>sourceIds.has(x))&&e.method&&e.precision==='computed-instant'&&Array.isArray(e.limits)),'Every event carries valid source, method and precision disclosure');
  ok(progress.some(p=>p.stage==='lunar-phases')&&progress.some(p=>p.stage==='solar-eclipses')&&progress.at(-1).processed===progress.at(-1).total,'Progress spans native solvers and completes all crossing brackets');
  const eclipses=full.events.filter(e=>e.kind.endsWith('-eclipse'));
  ok(eclipses.length===20&&fixtures.eclipses.length===20,'Complete NASA horizon catalogue has ten solar and ten lunar eclipses, including shallow penumbral case');
  for(const f of fixtures.eclipses){
    const e=eclipses.find(e=>e.kind===f.family+'-eclipse'&&e.startUTC.slice(0,10)===f.expectedUT.slice(0,10));
    ok(e?.details.eclipseType===f.eclipseType&&Math.abs(Date.parse(e.startUTC)-Date.parse(f.expectedUT))<=f.toleranceSeconds*1000,`NASA ${f.family} ${f.expectedUT}: classification and TD-minus-published-deltaT peak within ${f.toleranceSeconds}s`);
  }
  ok(eclipses.every(e=>e.details.scope==='global'&&e.details.localVisibility===null),'No global eclipse is promoted to local visibility');
  for(const f of fixtures.phases){const e=full.events.find(e=>e.kind==='lunar-phase'&&e.details.phase===f.phase&&e.startUTC.slice(0,10)===f.expectedUT.slice(0,10));ok(e&&Math.abs(Date.parse(e.startUTC)-Date.parse(f.expectedUT))<f.toleranceSeconds*1000,`NASA UT rounded-minute phase ${f.expectedUT}`);}
  for(const f of fixtures.solarQuarterDates){const e=full.events.find(e=>e.kind==='solar-quarter'&&e.title===f.title&&e.startUTC.startsWith('2027'));const civil=e&&new Intl.DateTimeFormat('en-CA',{timeZone:f.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(e.startUTC));ok(civil===f.date,`Independent issuing authority HKO ${f.title} civil date ${f.date}, not second precision`);}
  for(const f of fixtures.jpl){const p=point(f.body,Date.parse(f.dateUTC));ok(Math.abs(delta(p.longitude,f.longitude))<f.toleranceDegrees&&Math.abs(p.latitude-f.latitude)<f.toleranceDegrees,`Fresh JPL apparent-angle spot fixture ${f.body} ${f.dateUTC}`);}
  const marsRows=fixtures.jpl.filter(x=>x.body==='Mars');
  ok(marsRows[1].longitude>marsRows[0].longitude&&marsRows[1].longitude>marsRows[2].longitude,'Independent JPL samples bracket a Mars longitude maximum at the selected retrograde station');
  const moonIngress=full.events.find(e=>e.kind==='zodiac-ingress'&&e.bodies[0]==='Moon'&&e.startUTC.startsWith('2026-10-30'));
  const moonJPL=fixtures.jpl.find(x=>x.body==='Moon');ok(Math.abs(moonJPL.longitude-moonIngress.details.boundaryLongitude)<1/60,'Independent JPL Moon longitude lies within one arcminute of calculated ingress boundary');
  const pairs=full.coverage.find(x=>x.kind==='ecliptic-aspect').pairs;
  ok(pairs.length===45&&full.stats.searchedAspectPairs===45&&pairs.reduce((n,p)=>n+p.count,0)===full.stats.eventsByKind['ecliptic-aspect'],'All 45 unordered pairs have explicit searched counts, including zero-event pairs and Moon–planet pairs');
  ok(full.events.some(e=>e.kind==='ecliptic-aspect'&&e.bodies.includes('Moon')&&e.bodies.includes('Pluto')),'Moon–outer-planet contacts are present');
  ok(full.events.some(e=>e.kind==='ecliptic-aspect'&&e.details.targetDirectedLongitude===300)&&full.events.some(e=>e.kind==='ecliptic-aspect'&&e.details.targetDirectedLongitude===240),'Complementary directed angles preserve both sides of sextiles and trines');
  const sunMercury=full.events.find(e=>e.kind==='ecliptic-aspect'&&e.bodies.join('/')==='Sun/Mercury'&&e.details.aspect==='conjunction'&&e.startUTC.startsWith('2027-01-01'));
  ok(sunMercury.details.angularSeparationDegrees>1&&sunMercury.details.residualDegrees<.001,'Longitude conjunction retains nonzero true-sky angular separation');
  ok(full.events.filter(e=>e.kind==='ecliptic-aspect'&&e.bodies.join('/')==='Sun/Moon').every(e=>e.dependencyGroups.includes('solar-lunar-geometry')&&e.limits.some(s=>s.includes('independent'))),'Sun–Moon aspect/phase dependency is explicit');
  ok(full.events.filter(e=>e.kind==='lunar-phase').every(e=>e.dependencyGroups.includes('solar-lunar-geometry')),'Lunar phase geometry shares named dependency group with overlapping contacts');
  ok(full.events.filter(e=>e.kind==='lunar-phase').every(e=>e.details.frame.includes('no aberration'))&&sunMercury.details.frame.includes('apparent'),'Native phase and apparent aspect aberration conventions remain distinct');
  const residualEvents=full.events.filter(e=>['zodiac-ingress','ecliptic-aspect'].includes(e.kind));
  ok(residualEvents.every(e=>e.details.residualDegrees<.001),'All bracket-refined longitude roots retain small angular residuals');
  const stations=full.events.filter(e=>e.kind==='planetary-station');
  ok(stations.length>60&&stations.every(e=>Math.abs(e.details.speedDegreesPerDay)<.00001),'Every station has a near-zero central ±6h longitude rate');
  for(const e of stations.filter((_,i)=>i%8===0)){
    const t=Date.parse(e.startUTC),speed=ms=>delta(point(e.bodies[0],ms+DAY/4).longitude,point(e.bodies[0],ms-DAY/4).longitude)/.5;
    ok(e.details.motionAfter==='retrograde'?speed(t-3600000)>0&&speed(t+3600000)<0:speed(t-3600000)<0&&speed(t+3600000)>0,`${e.bodies[0]} ${e.startUTC}: sampled root changes to declared motion`);
  }
  ok(full.coverage.filter(x=>x.status==='bounded-crossing-search').every(x=>x.rangeCovered&&x.exhaustive===false&&x.scanStepHours===6),'Bounded-crossing completeness and tangency limitation remain distinct');
  ok(full.coverage.find(x=>x.status==='not-searched').categories.includes('perihelia/aphelia'),'Unavailable apsides and other categories are enumerated');
  const shortInput={startUTC:'2027-01-01T06:31:00Z',endUTC:'2027-01-03T13:17:00Z'};
  const short=await buildHorizonAstronomy(shortInput,immediate),expected=full.events.filter(e=>e.startUTC>=short.range.startUTC&&e.startUTC<short.range.endUTC);
  ok(JSON.stringify(short.events)===JSON.stringify(expected),'Subwindow roots match full-window output on anchored brackets');
  const same=await buildHorizonAstronomy({startUTC:'2027-01-01T12:01:00+05:30',endUTC:'2027-01-03T18:47:00+05:30'},immediate);
  ok(JSON.stringify(same)===JSON.stringify(short),'Equivalent explicit UTC offsets normalize deterministically');
  const event=short.events.find(e=>e.kind==='ecliptic-aspect'),stamp=Date.parse(event.startUTC);
  const ending=await buildHorizonAstronomy({startUTC:new Date(stamp-3600000).toISOString(),endUTC:event.startUTC},immediate);
  const starting=await buildHorizonAstronomy({startUTC:event.startUTC,endUTC:new Date(stamp+3600000).toISOString()},immediate);
  ok(!ending.events.some(x=>x.id===event.id)&&starting.events.some(x=>x.id===event.id),'Exact emitted root belongs only to the start-inclusive partition');
  for(const input of [null,[],{}, {...shortInput,lat:1},{startUTC:'2027-01-01',endUTC:'2027-01-02T00:00:00Z'},{startUTC:'2027-02-30T00:00:00Z',endUTC:'2027-03-02T00:00:00Z'},{startUTC:0,endUTC:'2027-01-02T00:00:00Z'},{startUTC:shortInput.endUTC,endUTC:shortInput.startUTC},{startUTC:shortInput.startUTC,endUTC:shortInput.startUTC},{startUTC:'1899-12-31T23:59:59Z',endUTC:'1900-01-01T01:00:00Z'},{startUTC:'2100-12-31T23:59:59Z',endUTC:'2101-01-01T00:00:01Z'},{startUTC:'2020-01-01T00:00:00Z',endUTC:'2026-01-01T00:00:00Z'}])await rejects(()=>buildHorizonAstronomy(input,immediate),'Reject malformed/out-of-range/oversize input '+JSON.stringify(input));
  for(const hooks of [null,[],{shouldCancel:1},{onProgress:'x'},{yieldControl:true}])await rejects(()=>buildHorizonAstronomy(shortInput,hooks),'Reject malformed callback contract');
  for(const stage of ['lunar-phases','solar-quarters','solar-eclipses','lunar-eclipses','longitude-crossings']){
    let stop=false,yielded=0,error;
    try{await buildHorizonAstronomy(fullInput,{shouldCancel:()=>stop,onProgress:p=>{if(p.stage===stage)stop=true;},yieldControl:()=>{yielded++;return Promise.resolve();}});}catch(e){error=e;}
    ok(error?.code==='CANCELLED'&&yielded>0,`Cancellation cooperatively exits ${stage} without a partial result`);
  }
  const controller=new AbortController();controller.abort();await rejects(()=>buildHorizonAstronomy(shortInput,{signal:controller.signal}),'Pre-aborted signal stops before computation');
  const recovered=await buildHorizonAstronomy(shortInput,immediate);ok(JSON.stringify(recovered)===JSON.stringify(short),'Fresh call recovers after cancellation; no shared job state');
  const telemetry={node:process.version,input:fullInput,elapsedMs,serializedBytes:Buffer.byteLength(JSON.stringify(full)),stats:full.stats,checks:count,failures};
  if(process.env.HORIZON_ASTRONOMY_RECEIPT)writeFileSync(process.env.HORIZON_ASTRONOMY_RECEIPT,JSON.stringify(telemetry,null,2)+'\n');
  return{count,failures,telemetry};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=await run();console.log(JSON.stringify(result,null,2));if(result.failures.length)process.exitCode=1;}
