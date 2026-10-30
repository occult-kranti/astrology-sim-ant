// A bounded astronomical event inventory, independent of calendar/purpose scores.
// Explicit instants only; no network, clock, location, personal data or DOM.
import * as A from '../lib/astronomy.js';
import {norm360, SIGNS} from './astro.js';
import {parseExplicitInstant} from './instant-boundary.js';

const DAY=86400000, STEP=DAY/4, ROOT_MS=1000;
const FRAME='geocentric apparent true ecliptic/equinox of date';
const PHASE_FRAME='geocentric true ecliptic/equinox of date; no aberration correction requested (native MoonPhase convention)';
const BODIES=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const PLANETS=BODIES.slice(2), ASPECT_BODIES=BODIES;
const ASPECTS=[[0,'conjunction'],[60,'sextile'],[90,'square'],[120,'trine'],[180,'opposition'],[240,'trine'],[270,'square'],[300,'sextile']];
const signed=x=>norm360(x+180)-180;
export const HORIZON_ASTRONOMY_LIMITS=Object.freeze({maxSpanDays:1831,scanStepHours:6,rootBracketSeconds:1,maxEvents:20000,maxPositionCalculations:1000000,minUTC:'1900-01-01T00:00:00.000Z',maxExclusiveUTC:'2101-01-01T00:00:00.000Z'});
export const HORIZON_ASTRONOMY_SOURCES=Object.freeze([
  {id:'HORIZON-ASTRONOMY-ENGINE',title:'Astronomy Engine: lunar quarters, seasons, global eclipses and apparent geocentric vectors',url:'https://github.com/cosinekitty/astronomy/tree/master/source/js',claimType:'calculated-astronomy',readingDepth:'Fresh selected API definitions and bundled implementation inspected; not an independent ephemeris.',rights:'MIT; existing bundled notice retained'},
  {id:'HORIZON-NASA-SOLAR',title:'NASA GSFC, Catalog of Solar Eclipses: 2001 to 2100',url:'https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html',claimType:'reference-fixture',readingDepth:'All ten catalogue eclipse rows in the declared 2026-10-30–2031-01-01 horizon checked; TD converted with each row’s published delta-T.',rights:'Selected factual rows and citations; no page artwork redistributed'},
  {id:'HORIZON-NASA-LUNAR',title:'NASA GSFC, Catalog of Lunar Eclipses: 2001 to 2100',url:'https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html',claimType:'reference-fixture',readingDepth:'All ten catalogue eclipse rows in the declared horizon checked, including the shallow July 2027 penumbral event; TD and delta-T kept explicit.',rights:'Selected factual rows and citations; no page artwork redistributed'},
  {id:'HORIZON-NASA-PHASES',title:'NASA GSFC, Phases of the Moon: 2001 to 2100',url:'https://eclipse.gsfc.nasa.gov/phase/phases2001.html',claimType:'reference-fixture',readingDepth:'Selected 2027 and 2030 phase rows and the Universal Time/table convention checked; not independent validation of every event.',rights:'Selected factual rows only'},
  {id:'HORIZON-HKO-2027',title:'Hong Kong Observatory, Gregorian–Lunar Calendar Conversion Table of 2027',url:'https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2027e.pdf',claimType:'reference-fixture',readingDepth:'Four solar-quarter civil dates checked in the Hong Kong UTC+8 convention; date precision does not validate event seconds.',rights:'Only four factual dates retained; PDF artwork not redistributed'},
  {id:'HORIZON-JPL-SPOTS',title:'NASA JPL Horizons, observer quantity 31',url:'https://ssd.jpl.nasa.gov/horizons/manual.html',claimType:'reference-fixture',readingDepth:'Fresh selected Mars station, Moon ingress and Sun position samples checked. The failed Mercury request is recorded separately; selected fixtures do not validate all roots.',rights:'Selected numerical output with source receipt'},
]);
const LIMITATIONS=[
  'This is a declared astronomical inventory, not every possible astrological event or a prediction of favorable, dangerous or historical outcomes.',
  'UTC is treated as UT1 by the bundled engine; future Earth rotation and delta-T estimates limit timing accuracy. A one-second numerical bracket is not one-second physical accuracy.',
  'A longitude aspect is not a closest approach on the celestial sphere. Actual angular separation at the contact is reported separately; no occultation or visual alignment is inferred.',
  'Eclipses are global events. Local visibility, weather, contact times and an observer’s obscuration are not calculated here. Hybrid solar eclipses are not a separate classification in the bundled global solver.',
  'Six-hour crossing searches cover the entire requested interval but can miss tangential contacts or two crossings within one bracket. Only the named native phase, season and eclipse searches enumerate their solver-defined sequences.',
  'Equal tropical zodiac signs are 30-degree ecliptic partitions, not IAU constellation boundaries. Apparent retrograde is a geocentric projection, not reversal of a planet’s physical orbit.',
  'Sun–Moon longitude aspects and lunar phases share solar/lunar geometry but use different aberration conventions: native phases disable aberration, while aspect positions enable it. Nearby event times are correlated, not independent corroboration or necessarily identical roots.',
  'Fixed-star contacts, true-sky closest approaches, heliocentric alignments, perihelia/aphelia, lunar apsides, nodes, meteor showers, occultations, transits, local eclipse paths and natal events are not searched.',
];

function request(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).some(k=>!['startUTC','endUTC'].includes(k)))throw new TypeError('Use only explicit startUTC and endUTC.');
  const start=+parseExplicitInstant(raw.startUTC),end=+parseExplicitInstant(raw.endUTC);
  if(start<Date.parse(HORIZON_ASTRONOMY_LIMITS.minUTC)||end>Date.parse(HORIZON_ASTRONOMY_LIMITS.maxExclusiveUTC)||end<=start)throw new RangeError('Require start < end within UTC years 1900–2100; end is exclusive.');
  if(end-start>HORIZON_ASTRONOMY_LIMITS.maxSpanDays*DAY)throw new RangeError(`Astronomical searches are limited to ${HORIZON_ASTRONOMY_LIMITS.maxSpanDays} elapsed days; no partial result is returned.`);
  return{start,end,startUTC:new Date(start).toISOString(),endUTC:new Date(end).toISOString()};
}
function aborted(){const e=new Error('Astronomical horizon search cancelled.');e.code='CANCELLED';e.name='AbortError';return e;}
function timing(method){return{kind:'numerically-computed',method,rootBracketSeconds:method==='bracket-refinement'?ROOT_MS/1000:null,physicalAccuracy:'Model-dependent; digits and numerical tolerance do not establish observational timing accuracy.'};}

function* searchSteps(raw){
  const range=request(raw),events=[],ids=new Set(),stats={positionCalculations:0,scannedIntervals:0,searchedAspectPairs:ASPECT_BODIES.length*(ASPECT_BODIES.length-1)/2,eventsByKind:{},completeRequestedRange:false};
  function position(body,ms){
    if(++stats.positionCalculations>HORIZON_ASTRONOMY_LIMITS.maxPositionCalculations)throw new RangeError('Astronomical position work limit exceeded; no partial result is returned.');
    const time=new Date(ms),v=A.GeoVector(A.Body[body],time,true),e=A.SphereFromVector(A.RotateVector(A.Rotation_EQJ_ECT(time),v));
    return{longitude:norm360(e.lon),latitude:e.lat,vector:v};
  }
  const longitude=(body,ms)=>position(body,ms).longitude;
  const speed=(body,ms)=>signed(longitude(body,ms+STEP)-longitude(body,ms-STEP))/.5;
  function push(kind,title,ms,bodies,token,method,details={},limits=[],sourceIds=['HORIZON-ASTRONOMY-ENGINE']){
    if(ms<range.start||ms>=range.end)return;
    if(!Number.isFinite(ms))throw new Error('Astronomical solver returned an invalid instant.');
    const startUTC=new Date(ms).toISOString(),id=`${kind}:${token}:${new Date(Math.round(ms/60000)*60000).toISOString().slice(0,16)}`;
    if(ids.has(id))return;
    if(events.length>=HORIZON_ASTRONOMY_LIMITS.maxEvents)throw new RangeError('Astronomical event limit exceeded; no partial result is returned.');
    const dependencyGroups=bodies.includes('Sun')&&bodies.includes('Moon')?['solar-lunar-geometry']:['geocentric-body-geometry'];
    ids.add(id);events.push({id,kind,title,startUTC,precision:'computed-instant',bodies,sourceIds,dependencyGroups,method,details,limits});
    stats.eventsByKind[kind]=(stats.eventsByKind[kind]||0)+1;
  }
  function root(fn,lo,hi,fa,fb){
    if(fa===0)return lo;if(fb===0)return hi;
    if(!Number.isFinite(fa)||!Number.isFinite(fb)||Math.sign(fa)===Math.sign(fb))throw new Error('Invalid astronomical root bracket.');
    for(let i=0;hi-lo>ROOT_MS;i++){
      if(i>40)throw new Error('Astronomical event refinement did not converge.');
      const mid=(lo+hi)/2,fm=fn(mid);if(!Number.isFinite(fm))throw new Error('Non-finite event residual.');
      if(fm===0)return mid;if(Math.sign(fm)===Math.sign(fa)){lo=mid;fa=fm;}else{hi=mid;fb=fm;}
    }
    return(lo+hi)/2;
  }
  const crosses=(a,b)=>a===0||b===0||Math.sign(a)!==Math.sign(b);
  const progress=(stage,processed,total)=>({stage,processed,total,eventCount:events.length});

  yield progress('lunar-phases',0,null);
  // Start before the boundary: a solver search begins at a phase, while eclipse
  // maximum can precede/follow that phase. Filter actual event instants later.
  let quarter=A.SearchMoonQuarter(new Date(range.start-2*DAY)),iterations=0;
  const phaseNames=['New Moon','First quarter','Full Moon','Last quarter'];
  while(+quarter.time.date<range.end){
    push('lunar-phase',phaseNames[quarter.quarter],+quarter.time.date,['Moon','Sun'],String(quarter.quarter),'Astronomy Engine SearchMoonQuarter / NextMoonQuarter',{phase:quarter.quarter,targetLongitude:quarter.quarter*90,frame:PHASE_FRAME,timing:timing('native-phase-search')},['Moon–Sun ecliptic longitude difference; phase alone does not imply an eclipse.','The native phase solver disables aberration; apparent Sun–Moon aspect contacts can have slightly different times.']);
    quarter=A.NextMoonQuarter(quarter);if(++iterations>2048)throw new Error('Lunar search iteration limit exceeded.');if(iterations%8===0)yield progress('lunar-phases',iterations,null);
  }
  yield progress('solar-quarters',0,null);
  const seasons=[['mar_equinox','March equinox',0],['jun_solstice','June solstice',90],['sep_equinox','September equinox',180],['dec_solstice','December solstice',270]];
  for(let year=new Date(range.start).getUTCFullYear();year<=new Date(range.end-1).getUTCFullYear();year++){
    const s=A.Seasons(year);for(const [key,title,angle]of seasons)push('solar-quarter',title,+s[key].date,['Sun'],String(angle),'Astronomy Engine Seasons',{targetLongitude:angle,frame:FRAME,timing:timing('native-solar-longitude-search')});
    yield progress('solar-quarters',year-new Date(range.start).getUTCFullYear()+1,new Date(range.end-1).getUTCFullYear()-new Date(range.start).getUTCFullYear()+1);
  }
  for(const type of ['solar','lunar']){
    yield progress(`${type}-eclipses`,0,null);let count=0;
    let eclipse=type==='solar'?A.SearchGlobalSolarEclipse(new Date(range.start-2*DAY)):A.SearchLunarEclipse(new Date(range.start-2*DAY));
    while(+eclipse.peak.date<range.end){
      const details={scope:'global',eclipseType:String(eclipse.kind),localVisibility:null,timing:timing('native-global-eclipse-search')};
      if(type==='solar')details.globalShadowAxisDistanceKm=eclipse.distance;
      else details.semiDurationsMinutes={penumbral:eclipse.sd_penum,partial:eclipse.sd_partial,total:eclipse.sd_total};
      push(`${type}-eclipse`,`${String(eclipse.kind)[0].toUpperCase()+String(eclipse.kind).slice(1)} ${type} eclipse · global peak`,+eclipse.peak.date,['Sun','Moon','Earth'],String(eclipse.kind),type==='solar'?'Astronomy Engine SearchGlobalSolarEclipse / NextGlobalSolarEclipse':'Astronomy Engine SearchLunarEclipse / NextLunarEclipse',details,['Global peak is not an observer’s local maximum or a visibility forecast.'],['HORIZON-ASTRONOMY-ENGINE',type==='solar'?'HORIZON-NASA-SOLAR':'HORIZON-NASA-LUNAR']);
      if(++count>64)throw new Error('Eclipse search iteration limit exceeded.');yield progress(`${type}-eclipses`,count,null);
      eclipse=type==='solar'?A.NextGlobalSolarEclipse(eclipse.peak):A.NextLunarEclipse(eclipse.peak);
    }
  }

  // Globally anchored six-hour brackets make subdivisions use identical grids.
  const gridStart=Math.floor(range.start/STEP)*STEP,gridEnd=Math.ceil(range.end/STEP)*STEP,intervalCount=(gridEnd-gridStart)/STEP;
  const positionsAt=t=>Object.fromEntries(BODIES.map(body=>[body,position(body,t)]));
  let prev=positionsAt(gridStart-STEP),left=positionsAt(gridStart),right=positionsAt(gridStart+STEP);
  yield progress('longitude-crossings',0,intervalCount);
  for(let i=0;i<intervalCount;i++){
    const lo=gridStart+i*STEP,hi=lo+STEP,next=positionsAt(hi+STEP);
    for(const body of BODIES){
      const a=left[body].longitude,b=right[body].longitude;
      for(let sign=0;sign<12;sign++){
        const boundary=sign*30,fa=signed(a-boundary),fb=signed(b-boundary);
        if(!crosses(fa,fb)||Math.abs(fb-fa)>=180)continue;
        const ms=root(t=>signed(longitude(body,t)-boundary),lo,hi,fa,fb),direction=fb>fa?'direct':'retrograde',to=direction==='direct'?sign:(sign+11)%12,from=direction==='direct'?(sign+11)%12:sign;
        push('zodiac-ingress',`${body} enters ${SIGNS[to]}${direction==='retrograde'?' · retrograde':''}`,ms,[body],`${body}:${sign}:${direction}`,'Six-hour apparent-longitude crossing brackets, refined by bisection',{fromSign:SIGNS[from],toSign:SIGNS[to],boundaryLongitude:boundary,direction,frame:FRAME,residualDegrees:Math.abs(signed(longitude(body,ms)-boundary)),timing:timing('bracket-refinement')},['Crossing of an equal tropical sign boundary, not a constellation boundary.']);
      }
      if(PLANETS.includes(body)){
        const fa=signed(right[body].longitude-prev[body].longitude)/.5,fb=signed(next[body].longitude-left[body].longitude)/.5;
        if(crosses(fa,fb)){
          const ms=root(t=>speed(body,t),lo,hi,fa,fb),motionAfter=fb<fa?'retrograde':'direct';
          push('planetary-station',`${body} stations ${motionAfter}`,ms,[body],`${body}:${motionAfter}`,'Root of central apparent-longitude speed across ±6 hours',{motionAfter,longitude:longitude(body,ms),speedDegreesPerDay:speed(body,ms),frame:FRAME,timing:timing('bracket-refinement')},['Station is defined by a finite-difference geocentric longitude rate, not physical orbital reversal.']);
        }
      }
    }
    for(let ia=0;ia<ASPECT_BODIES.length;ia++)for(let ib=ia+1;ib<ASPECT_BODIES.length;ib++){
      const bodyA=ASPECT_BODIES[ia],bodyB=ASPECT_BODIES[ib],a=norm360(left[bodyB].longitude-left[bodyA].longitude),b=norm360(right[bodyB].longitude-right[bodyA].longitude);
      for(const [target,aspect]of ASPECTS){
        const fa=signed(a-target),fb=signed(b-target);if(!crosses(fa,fb)||Math.abs(fb-fa)>=180)continue;
        const ms=root(t=>signed(longitude(bodyB,t)-longitude(bodyA,t)-target),lo,hi,fa,fb),pa=position(bodyA,ms),pb=position(bodyB,ms);
        push('ecliptic-aspect',`${bodyA}–${bodyB} ${aspect} · longitude`,ms,[bodyA,bodyB],`${bodyA}:${bodyB}:${target}`,'Six-hour apparent-longitude difference crossing brackets, refined by bisection',{aspect,targetDirectedLongitude:target,targetSeparationDegrees:Math.min(target,360-target),angularSeparationDegrees:A.AngleBetween(pa.vector,pb.vector),latitudeDifferenceDegrees:pb.latitude-pa.latitude,residualDegrees:Math.abs(signed(pb.longitude-pa.longitude-target)),frame:FRAME,timing:timing('bracket-refinement')},['True-sky angular separation is reported at the longitude contact; this is not a search for its minimum.',...(bodyA==='Sun'&&bodyB==='Moon'?['This shares solar/lunar geometry with phases, not independent evidence. Apparent aspect positions enable aberration; native phases disable it, so event times can differ.']:[])]);
      }
    }
    stats.scannedIntervals++;prev=left;left=right;right=next;
    if((i+1)%16===0||i===intervalCount-1)yield progress('longitude-crossings',i+1,intervalCount);
  }
  events.sort((a,b)=>a.startUTC.localeCompare(b.startUTC)||a.id.localeCompare(b.id));stats.completeRequestedRange=true;stats.events=events.length;
  const native=['lunar-phase','solar-quarter','solar-eclipse','lunar-eclipse'];
  const coverage=[...native.map(kind=>({kind,status:'native-sequence-search',count:stats.eventsByKind[kind]||0,rangeCovered:true,scope:'All events returned by the named bundled solver within start inclusive/end exclusive; model and classification limitations remain.'})),...['zodiac-ingress','planetary-station','ecliptic-aspect'].map(kind=>({kind,status:'bounded-crossing-search',count:stats.eventsByKind[kind]||0,rangeCovered:true,scanStepHours:6,exhaustive:false,scope:'Every six-hour bracket searched; tangencies or double crossings inside one bracket are not guaranteed.'})),{kind:'unavailable',status:'not-searched',categories:['fixed-star contacts','true-sky closest approaches','heliocentric alignments','perihelia/aphelia','lunar apsides','nodes','meteor showers','occultations','planetary transits','local eclipse paths/visibility','natal events']}];
  const aspectCoverage=coverage.find(x=>x.kind==='ecliptic-aspect');aspectCoverage.pairs=[];
  coverage.find(x=>x.kind==='zodiac-ingress').bodies=[...BODIES];
  coverage.find(x=>x.kind==='planetary-station').bodies=[...PLANETS];
  for(let i=0;i<ASPECT_BODIES.length;i++)for(let j=i+1;j<ASPECT_BODIES.length;j++){const bodies=[ASPECT_BODIES[i],ASPECT_BODIES[j]];aspectCoverage.pairs.push({bodies,count:events.filter(e=>e.kind==='ecliptic-aspect'&&e.bodies[0]===bodies[0]&&e.bodies[1]===bodies[1]).length});}
  aspectCoverage.directedTargets=ASPECTS.map(([angle,aspect])=>({angle,aspect}));
  return{schemaVersion:1,kind:'horizon-astronomy',range:{startUTC:range.startUTC,endUTC:range.endUTC,startInclusive:true,endExclusive:true},events,coverage,sources:HORIZON_ASTRONOMY_SOURCES.map(x=>({...x})),stats,limitations:[...LIMITATIONS]};
}

export async function buildHorizonAstronomy(input,hooks={}){
  if(!hooks||typeof hooks!=='object'||Array.isArray(hooks))throw new TypeError('Astronomy hooks must be an object.');
  for(const key of ['shouldCancel','isCancelled','onProgress','yieldControl'])if(hooks[key]!==undefined&&typeof hooks[key]!=='function')throw new TypeError(`${key} must be a function.`);
  const cancelled=()=>hooks.signal?.aborted||hooks.shouldCancel?.()||hooks.isCancelled?.();
  const iterator=searchSteps(input);
  while(true){
    if(cancelled())throw aborted();const step=iterator.next();
    if(step.done){if(cancelled())throw aborted();return step.value;}
    hooks.onProgress?.(step.value);
    await(hooks.yieldControl?hooks.yieldControl():new Promise(resolve=>setTimeout(resolve,0)));
  }
}
