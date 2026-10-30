import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {SKY_BODIES,SKY_LIMITS,buildSkySnapshot,buildSkyTimelineSync,buildSkyTimeline,normalizeSkyTimelineRequest} from '../../assets/js/core/sky-dynamics.js';
import {createSkyTimelineWorkerController} from '../../assets/js/workers/sky-timeline-worker.js';
import {bodyPosition} from '../../assets/js/core/astro.js';
import {BRIGHT_STARS,BRIGHT_STAR_PROVENANCE} from '../../assets/js/core/data/bright-star-catalog.js';

const fixture=name=>JSON.parse(readFileSync(new URL(`./fixtures/${name}`,import.meta.url)));
const delta=(a,b)=>Math.abs(((a-b+540)%360)-180);
export async function run(){
 let count=0;const failures=[],ok=(condition,label)=>{count++;if(!condition)failures.push(label);};
 const throws=(fn,label)=>{try{fn();ok(false,label);}catch{ok(true,label);}};
 const input={dateISO:'2026-10-30T00:00:00Z',timeZone:'Europe/London',lat:51.5,lon:-.13};
 const sky=buildSkySnapshot(input);
 ok(sky.bodies.length===10&&SKY_BODIES.length===10,'All ten geocentric supported bodies, including outer planets and dwarf Pluto');
 ok(sky.bodies.find(b=>b.id==='Pluto').classification==='dwarf planet'&&sky.bodies.find(b=>b.id==='Moon').classification==='natural satellite','Astronomical classifications are explicit');
 ok(sky.bodies.every(b=>Number.isFinite(b.longitude)&&b.longitude>=0&&b.longitude<360&&Number.isFinite(b.latitude)&&Math.abs(b.latitude)<=90&&b.distanceAU>0&&Number.isFinite(b.speedDegreesPerDay)),'All angular, distance and motion outputs finite and bounded');
 ok(sky.bodies.every(b=>b.sign.index===Math.floor(b.longitude/30)&&b.sign.degInSign>=0&&b.sign.degInSign<30),'Zodiac partitions wrap within each30degree sign');
 ok(sky.bodies.every(b=>b.horizon.refraction==='none'&&b.horizon.altitude>=-90&&b.horizon.altitude<=90&&b.horizon.azimuth>=0&&b.horizon.azimuth<360),'Observer horizon is bounded and unrefracted');
 for(const id of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn']){const old=bodyPosition(id,new Date(input.dateISO)),p=sky.bodies.find(b=>b.id===id);ok(delta(old.lon,p.longitude)<1e-11&&Math.abs(old.lat-p.latitude)<1e-11&&Math.abs(old.speed-p.speedDegreesPerDay)<1e-11,`${id}: exact existing canonical apparent-position parity`);}
 for(const f of fixture('sky-horizons-angles.json').fixtures){const s=buildSkySnapshot({...input,dateISO:f.dateISO},{bodyIds:[f.body],includeCatalogStars:false}).bodies[0];ok(delta(s.longitude,f.longitude)<1/60&&Math.abs(s.latitude-f.latitude)<1/60,`Fresh independent JPL ecliptic-of-date spot check ${f.body} ${f.dateISO} within1arcmin`);}
 for(const f of fixture('sky-horizons-vectors.json').fixtures){const s=sky.heliocentric.bodies.find(b=>b.id===f.body),residual=Math.hypot(s.x-f.x,s.y-f.y,s.z-f.z),dot=(s.x*f.x+s.y*f.y+s.z*f.z)/(s.distanceAU*Math.hypot(f.x,f.y,f.z)),angle=Math.acos(Math.max(-1,Math.min(1,dot)))*180/Math.PI;ok(residual<.003&&angle<1/60,`Fresh JPL geometric heliocentric ${f.body} within0.003AU and1arcmin (selected fixture only)`);}
 const sun=sky.heliocentric.bodies.find(b=>b.id==='Sun'),earth=sky.heliocentric.bodies.find(b=>b.id==='Earth');
 ok(sun.x===0&&sun.y===0&&sun.z===0&&sun.distanceAU===0&&earth.distanceAU>.98&&earth.distanceAU<1.02,'Heliocentric Sun origin and physical Earth distance');
 ok(sky.heliocentric.bodies.every(b=>Math.abs(b.distanceAU-Math.hypot(b.x,b.y,b.z))<1e-12)&&sky.heliocentric.frame!==sky.bodies[0].frame,'Physical vector lengths retained and frames distinct');
 ok(sky.heliocentric.bodies.length===11&&!sky.heliocentric.bodies.some(b=>b.id.startsWith('HIP')),'Star directions are not placed into the orbital vector model');
 ok(sky.aspects.every(a=>a.orb<=sky.aspectOrb&&a.allowedOrb===3&&['conjunction','sextile','square','trine','opposition'].includes(a.type)),'Geometric aspects obey declared uniform orb');
 ok(buildSkySnapshot(input,{aspectOrb:0}).aspects.length<=sky.aspects.length,'Zero-orb calculation does not fabricate contacts');
 ok(sky.fixedStars.length===0&&sky.catalogStars.length===20,'Historical longitude-only markers opt-in;20physical-catalogue directions default');
 const historical=buildSkySnapshot(input,{includeStars:true});
 ok(historical.fixedStars.length===15&&historical.fixedStars.every(s=>s.latitude===null&&s.distanceAU===null&&!s.modern),'Historical15 lackinventedstellar latitude or distance');
 ok(buildSkySnapshot(input,{includeStars:true,includeModernStars:true}).fixedStars.length===16,'Optional modernFomalhaut is a separate flagged historical-table variant');
 ok(historical.fixedStars.find(s=>s.name==='Sirius').sourceNote.includes('II.31')&&historical.fixedStars.find(s=>s.name==='Sirius').sourceNote.includes('unverified'),'Sirius primarynatureand unverifiedalternative retained');
 ok(BRIGHT_STAR_PROVENANCE.license==='CC BY-SA 4.0'&&BRIGHT_STAR_PROVENANCE.commit.length===40&&BRIGHT_STARS.every(s=>s.dist>0&&s.dist<100000),'Pinned licensed bright-star extract has no distance sentinel');
 ok(sky.catalogStars.every(s=>Number.isFinite(s.latitude)&&s.longitude>=0&&s.longitude<360&&s.distanceParsecs>0&&Math.abs(Math.hypot(...Object.values(s.equatorialJ2000.unitDirection))-1)<1e-12),'Propagated stellar directions finite and normalized');
 for(const f of fixture('sky-stars-erfa.json').fixtures){const s=buildSkySnapshot({...input,dateISO:f.dateISO},{bodyIds:['Sun']}).catalogStars.find(s=>s.name===f.name).equatorialJ2000;const arcsec=Math.hypot(delta(s.rightAscensionHours*15,f.rightAscensionHours*15)*Math.cos(f.declination*Math.PI/180),s.declination-f.declination)*3600;ok(arcsec<1,`IndependentERFA sphericalpropagation vsHYG Cartesian ${f.name} ${f.dateISO} within1arcsec (samecatalogue)`);}
 const later=buildSkySnapshot({...input,dateISO:'2050-10-30T00:00:00Z'},{includeStars:true});
 ok(later.catalogStars.find(s=>s.name==='Arcturus').equatorialJ2000.declination!==sky.catalogStars.find(s=>s.name==='Arcturus').equatorialJ2000.declination,'Highproper-motion stellar direction changes withcastdate');
 ok(later.fixedStars[0].longitude>historical.fixedStars[0].longitude,'Historical marker precession remains date-dependent');
 const sources=new Set(sky.sources.map(s=>s.id));ok(sky.catalogStars.every(s=>s.sourceIds.every(id=>sources.has(id))),'Modernstellar sources resolve');
 const shifted=buildSkySnapshot({...input,dateISO:'2026-10-30T05:30:00+05:30'});ok(JSON.stringify(shifted)===JSON.stringify(sky),'Equivalent offsetinstant gives same normalizedcast');
 const otherObserver=buildSkySnapshot({...input,timeZone:'Asia/Tokyo',lat:35.68,lon:139.76});ok(otherObserver.bodies.every((b,i)=>b.longitude===sky.bodies[i].longitude)&&otherObserver.bodies[0].horizon.altitude!==sky.bodies[0].horizon.altitude,'Geocentricsky independentofobserver whilehorizon changes');
 const pole=buildSkySnapshot({...input,lat:90});ok(pole.bodies.every(b=>Number.isFinite(b.horizon.altitude)),'Astronomicalhorizon can calculatepolewithoutfabricatinghouses');
 for(const patch of [{dateISO:'1899-12-31T23:59:59Z'},{dateISO:'2101-01-01T00:00:00Z'},{dateISO:'2026-10-30T00:00'},{dateISO:'2026-02-30T00:00:00Z'},{lat:NaN},{lon:181},{timeZone:'Made/Up'},{timeKnown:false}])throws(()=>buildSkySnapshot({...input,...patch}),'Reject invalidoruncertaincast '+JSON.stringify(patch));
 throws(()=>buildSkySnapshot({...input,dateISO:'2100-12-31T23:00:00Z',timeZone:'Pacific/Kiritimati'}),'Rejectobservercivil2101 forcanonicalcastboundary');
 for(const options of [{bodyIds:['Earth']},{bodyIds:null},{bodyIds:['Sun','Sun']},{includeStars:'true'},{includeCatalogStars:1},{aspectOrb:Infinity},{aspectOrb:-1},{aspectOrb:null}])throws(()=>buildSkySnapshot(input,options),'Reject malformedskyoptions '+JSON.stringify(options));
 const req={centerISO:input.dateISO,timeZone:'Europe/London'},normalized=normalizeSkyTimelineRequest(req),timeline=buildSkyTimelineSync(req);
 ok(normalized.startISO==='2021-10-30T00:00:00.000Z'&&normalized.endISO==='2031-10-30T00:00:00.000Z','Defaultwindow dynamicallycenters±5calendaryears');
 ok(timeline.samples.length===262&&timeline.samples[0].dateISO===normalized.startISO&&timeline.samples.at(-1).dateISO===normalized.endISO,'UTCsamplegridincludesbothendpointsandshortfinalstep');
 ok(timeline.events.length>500&&timeline.events.every(e=>e.dateISO>=normalized.startISO&&e.dateISO<=normalized.endISO),'Solvedquartereventsboundedtoscanrange');
 ok(timeline.events.every((e,i)=>!i||e.dateISO>=timeline.events[i-1].dateISO),'Solar/lunareventsmergechronologically');
 ok(timeline.sampling.warnings.some(s=>s.includes('aliases'))&&!timeline.sampling.continuousTrajectory&&!timeline.sampling.allTransitionsDetected,'CoarseMoonaliasingandnonexhaustivetransitions visible');
 ok(timeline.samples.every(s=>s.positions.length===10&&s.positions.every(p=>p.frame==='geocentric apparent true ecliptic/equinox of date')),'Everytimesamplepreservespositionframeandselectedbodies');
 ok(JSON.stringify(timeline).length<1500000,'Default10yeartimelinefits1.5MBservicebudget');
 const short={startISO:'2026-03-28T12:00:00Z',endISO:'2026-03-30T12:00:00Z',timeZone:'Europe/London',stepHours:24,bodyIds:['Sun','Moon'],includeEvents:false};
 const sync=buildSkyTimelineSync(short),asyncResult=await buildSkyTimeline(short,{yieldControl:()=>Promise.resolve()});
 ok(JSON.stringify(sync)===JSON.stringify(asyncResult).replace('"maxSamples":4096','"maxSamples":512'),'Asyncandsyncuseidenticalcalculationplan;onlydefaultcapdiffers');
 ok(sync.samples.map(s=>s.localTime).join(',')==='12:00:00,13:00:00,13:00:00','UTCgridretainsexplicitDSTshift inlocalclocklabels');
 const hourly=buildSkyTimelineSync({...short,stepHours:1});ok(hourly.samples.length===49&&!hourly.sampling.warnings.length,'Hourlyzoomcalculates49boundedpointswithoutcoarseMoonwarning');
 const clamped=normalizeSkyTimelineRequest({...req,centerISO:'1900-06-01T00:00:00Z'});ok(clamped.clippedToSupportedRange&&clamped.startISO==='1900-01-01T00:00:00.000Z','Centeredloweredgeclippingexplicit');
 const upper=normalizeSkyTimelineRequest({...req,centerISO:'2100-06-01T00:00:00Z'});ok(upper.clippedToSupportedRange&&upper.endISO==='2100-12-31T23:59:59.999Z','Centeredupperedgeclippingexplicit');
 const leap=normalizeSkyTimelineRequest({...req,centerISO:'2024-02-29T12:00:00Z',yearsBefore:1,yearsAfter:1});ok(leap.startISO.startsWith('2023-02-28')&&leap.endISO.startsWith('2025-02-28'),'LeapdaycenterclampsanniversariestoFeb28');
 for(const patch of [{stepDays:'14'},{stepHours:'24'},{stepHours:null},{yearsBefore:null},{bodyIds:null},{stepDays:0},{stepDays:Infinity},{stepDays:1,stepHours:24},{stepHours:1},{yearsBefore:6},{yearsAfter:.5},{startISO:'2026-01-01T00:00:00Z'},{startISO:'2020-01-01T00:00:00Z',endISO:'2031-01-01T00:00:00Z'},{startISO:'2026-01-01T00:00:00Z',endISO:'2026-01-01T00:00:00Z'},{bodyIds:[]},{includeEvents:1}])throws(()=>normalizeSkyTimelineRequest({...req,...patch}),'Rejectmalformed/oversizetimeline '+JSON.stringify(patch));
 throws(()=>buildSkyTimelineSync({...req,stepDays:1}),'Syncservicecaprejectsdaily10yearwindow');
 const solar=timeline.events.find(e=>e.kind==='solar-quarter'&&e.label==='March equinox'&&e.dateISO.startsWith('2026'));
 ok(Math.abs(Date.parse(solar.dateISO)-Date.parse('2026-03-20T14:46:00Z'))<120000,'Inherited independentlypublishedCWA2026equinoxfixture within2minutes');
 let progress=0,cancel=false;try{await buildSkyTimeline(req,{onProgress:()=>{progress++;cancel=true;},shouldCancel:()=>cancel,yieldControl:()=>Promise.resolve()});ok(false,'Cancellationinterruptstimeline');}catch(e){ok(e.code==='CANCELLED'&&progress===1,'Cancellationinterruptsbeforecomputingnextchunk');}
 const eventWindow={startISO:'2026-01-01T00:00:00Z',endISO:'2026-12-31T00:00:00Z',timeZone:'UTC',stepDays:30};
 for(const maxEvents of [1,4,10])throws(()=>buildSkyTimelineSync(eventWindow,{maxEvents}),`Event cap ${maxEvents} fails explicitly rather than truncating silently`);
 for(const stage of ['samples','solar-events','lunar-events']){let cancelled=false,seenStage=null;try{await buildSkyTimeline(eventWindow,{onProgress:p=>{seenStage=p.stage;if(p.stage===stage)cancelled=true;},shouldCancel:()=>cancelled,yieldControl:()=>Promise.resolve()});ok(false,`Cancellation in ${stage}`);}catch(e){ok(e.code==='CANCELLED'&&seenStage===stage,`Cancellation checkpoints work in ${stage}`);}}
 const messages=[],controller=createSkyTimelineWorkerController(m=>messages.push(m));const job=controller.handleMessage({type:'start',jobId:'first',request:req});await controller.handleMessage({type:'start',jobId:'second',request:short});await controller.handleMessage({type:'cancel',jobId:'first'});await job;
 ok(messages.some(m=>m.jobId==='second'&&m.error?.code==='BUSY')&&messages.some(m=>m.jobId==='first'&&m.type==='cancelled')&&!messages.some(m=>m.type==='result'),'Workerbusyandcancelpreservejobidentitywithoutstalefinalresult');
 await controller.handleMessage({type:'start',jobId:'next',request:short});ok(messages.some(m=>m.jobId==='next'&&m.type==='result')&&controller.activeJobId===null,'Cancelledworkerrecoversfornewjob');
 await controller.handleMessage({type:'cancel',jobId:'missing'});await controller.handleMessage({type:'start',jobId:'<invalid>',request:short});ok(messages.some(m=>m.error?.code==='NO_ACTIVE_JOB')&&messages.some(m=>m.jobId===null&&m.type==='error'),'Invalidandstalejobmessagesrejected');
 const shutdownMessages=[],shutdown=createSkyTimelineWorkerController(m=>shutdownMessages.push(m)),shutdownJob=shutdown.handleMessage({type:'start',jobId:'shutdown',request:req});shutdown.cancelAll();await shutdownJob;ok(shutdown.activeJobId===null&&shutdownMessages.some(m=>m.type==='cancelled')&&!shutdownMessages.some(m=>m.type==='result'),'Worker shutdown cancels active calculation and clears its token');
 const saveTZ=process.env.TZ;try{process.env.TZ='Pacific/Honolulu';const first=JSON.stringify(buildSkySnapshot(input));process.env.TZ='Asia/Tokyo';ok(first===JSON.stringify(buildSkySnapshot(input)),'Hosttimezonecannotchangeexplicitcast');}finally{if(saveTZ===undefined)delete process.env.TZ;else process.env.TZ=saveTZ;}
 ok(SKY_LIMITS.maxSamples===4096&&SKY_LIMITS.maxEvents===1024,'Explicitworklimitsretained');
 return{pass:!failures.length,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(`${r.pass?'PASS':'FAIL'} sky dynamics: ${r.count} checks`);r.failures.forEach(f=>console.error(f));process.exitCode=r.pass?0:1;}
