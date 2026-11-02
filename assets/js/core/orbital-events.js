// Explicit, bounded orbital geometry and event searches. No DOM, storage,
// location inference, personal records, model providers or calendar scoring.
import * as A from '../lib/astronomy.js';
import { norm360 } from './astro.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { HORIZON_ASTRONOMY_SOURCES } from './horizon-astronomy.js';

const DAY=86400000, STEP=DAY/4, ROOT_MS=1000;
const MIN=Date.parse('1900-01-01T00:00:00Z'), MAX=Date.parse('2101-01-01T00:00:00Z');
const GEO_FRAME='geocentric apparent true ecliptic/equinox of date';
const HELIO_FRAME='heliocentric geometric J2000 mean ecliptic';
const ASPECTS=[[0,'conjunction'],[60,'sextile'],[90,'square'],[120,'trine'],[180,'opposition']];
const DIRECTED=[...ASPECTS,[240,'trine'],[270,'square'],[300,'sextile']];
const signed=x=>norm360(x+180)-180;
const copy=x=>JSON.parse(JSON.stringify(x));
export const ORBITAL_BODY_IDS=Object.freeze(['Sun','Moon','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']);
export const ORBITAL_LIMITS=Object.freeze({maxSpanDays:366,maxEvents:512,scanStepHours:6,rootBracketSeconds:1,minUTC:'1900-01-01T00:00:00.000Z',maxExclusiveUTC:'2101-01-01T00:00:00.000Z'});
export const ORBITAL_SOURCES=Object.freeze([
  Object.freeze({id:'ORBITAL-ASTRONOMY',title:'Astronomy Engine: vector angles, ecliptic rotations, phases, seasons and global eclipse searches',url:'https://github.com/cosinekitty/astronomy/tree/master/source/js',claimType:'calculated-astronomy',readingDepth:'Bundled AngleBetween, GeoVector, HelioVector and global eclipse API definitions inspected. Existing upstream model reused; no independent ephemeris or new complete-sky validation.',rights:'MIT; bundled notice retained'}),
  ...HORIZON_ASTRONOMY_SOURCES.filter(s=>['HORIZON-NASA-SOLAR','HORIZON-NASA-LUNAR'].includes(s.id)).map(s=>Object.freeze({...s,readingDepth:'Inherited selected NASA catalogue fixtures and their published TD/delta-T convention reused from the horizon tests; no new complete-catalogue reading or independent validation of 1900–2100.'})),
]);
const LIMITATIONS=[
  'Earth-view apparent directions and simultaneous geometric Sun-view positions have different origins, epochs and light-time conventions. Their angles are separately labelled; differences are not calendar mismatches.',
  'True three-dimensional angular separation is distinct from longitude separation. A longitude conjunction alone does not establish a visual close approach, occultation or eclipse.',
  'The angles are computed from the existing Astronomy Engine model. Numerical digits and one-second root brackets do not establish one-second physical accuracy; UTC is treated as UT1.',
  'Geometric alignment and global eclipses do not establish favorable, dangerous, religious or personal outcomes. Historical chart rules require their separate named source and context.',
  'A schematic or compressed orbital view is not a physical-size drawing, an N-body simulation or an observing-visibility forecast.',
];
function record(x,label){if(!x||typeof x!=='object'||Array.isArray(x))throw new TypeError(`${label} must be an object.`);return x;}
function exact(value,label='Instant'){const d=parseExplicitInstant(value);if(+d<MIN||+d>=MAX)throw new RangeError(`${label} must fall within UTC years 1900–2100.`);return d;}
function choice(input){
  const origin=input.origin??'Earth',bodyA=input.bodyA??'Venus',bodyB=input.bodyB??'Mars';
  if(!['Earth','Sun'].includes(origin))throw new RangeError('Choose Earth or Sun as the origin.');
  if(!ORBITAL_BODY_IDS.includes(bodyA)||!ORBITAL_BODY_IDS.includes(bodyB)||bodyA===bodyB)throw new RangeError('Choose two distinct supported bodies.');
  if([bodyA,bodyB].includes(origin))throw new RangeError(`The ${origin} origin cannot be a direction endpoint; choose the other view to include it.`);
  return{origin,bodyA,bodyB};
}
function aspect(separation,orb=3){
  const [angle,type]=ASPECTS.reduce((best,x)=>Math.abs(separation-x[0])<Math.abs(separation-best[0])?x:best);
  return{type,angle,target:angle,orb:Math.abs(separation-angle),allowedOrb:orb,withinOrb:Math.abs(separation-angle)<=orb,method:'Nearest major longitude aspect with an explicit uniform orb; not Lilly moieties or Vedic drishti'};
}
function vector(body,date,origin){
  const raw=origin==='Earth'?A.GeoVector(A.Body[body],date,true):A.HelioVector(A.Body[body],date);
  const v=A.RotateVector(origin==='Earth'?A.Rotation_EQJ_ECT(date):A.Rotation_EQJ_ECL(),raw),s=A.SphereFromVector(v);
  return{body,id:body,x:v.x,y:v.y,z:v.z,longitude:norm360(s.lon),latitude:s.lat,distanceAU:Math.hypot(v.x,v.y,v.z),frame:origin==='Earth'?GEO_FRAME:HELIO_FRAME};
}
function angle(a,b){const da=Math.hypot(a.x,a.y,a.z),db=Math.hypot(b.x,b.y,b.z);return da>0&&db>0?Math.acos(Math.max(-1,Math.min(1,(a.x*b.x+a.y*b.y+a.z*b.z)/(da*db))))*180/Math.PI:null;}
function subtract(a,b){return{x:a.x-b.x,y:a.y-b.y,z:a.z-b.z};}
function negative(v){return{x:-v.x,y:-v.y,z:-v.z};}
function frameGeometry(date,bodyA,bodyB,origin,orb){
  const frame=origin==='Earth'?GEO_FRAME:HELIO_FRAME;
  if([bodyA,bodyB].includes(origin))return{available:false,origin,frame,reason:`${origin} is this frame's origin and has no direction from itself.`};
  const a=vector(bodyA,date,origin),b=vector(bodyB,date,origin),separation=Math.abs(signed(b.longitude-a.longitude));
  return{available:true,origin,frame,bodies:[a,b],true3DAngleDegrees:angle(a,b),longitudeSeparationDegrees:separation,pairAspect:aspect(separation,orb),correctionConvention:origin==='Earth'?'GeoVector(body,date,true): upstream body-dependent light-time treatment with aberration requested. Moon follows the bundled GeoMoon special case; no planetary light-time/aberration correction is applied to that lunar vector.':'HelioVector: simultaneous geometric positions without light-time or aberration correction'};
}
export function buildOrbitalGeometry(input){
  record(input,'Orbital geometry input');const date=exact(input.dateISO),pair=choice(input),orb=input.aspectOrb??3;
  if(typeof orb!=='number'||!Number.isFinite(orb)||orb<0||orb>10)throw new RangeError('Aspect orb must be between zero and ten degrees.');
  const earthView=frameGeometry(date,pair.bodyA,pair.bodyB,'Earth',orb),sunView=frameGeometry(date,pair.bodyA,pair.bodyB,'Sun',orb),selected=pair.origin==='Earth'?earthView:sunView;
  let heliocentricTriangle=null;
  if([pair.bodyA,pair.bodyB].includes('Earth')&&![pair.bodyA,pair.bodyB].includes('Sun')){
    const target=pair.bodyA==='Earth'?pair.bodyB:pair.bodyA,e=vector('Earth',date,'Sun'),p=vector(target,date,'Sun');
    heliocentricTriangle={bodyIds:['Sun','Earth',target],target,frame:HELIO_FRAME,convention:'All three vertices are simultaneous geometric heliocentric positions, without light-time or aberration correction.',angleAtSun:angle(e,p),angleAtEarth:angle(negative(e),subtract(p,e)),angleAtTarget:angle(negative(p),subtract(e,p)),earthTargetDistanceAU:Math.hypot(p.x-e.x,p.y-e.y,p.z-e.z),positions:[{id:'Sun',x:0,y:0,z:0},e,p]};
  }
  return{schemaVersion:1,kind:'orbital-pair-geometry',dateISO:date.toISOString(),...pair,...selected,earthView,sunView,heliocentricTriangle,sourceIds:['ORBITAL-ASTRONOMY'],sources:copy(ORBITAL_SOURCES).filter(s=>s.id==='ORBITAL-ASTRONOMY'),limitations:[...LIMITATIONS]};
}
function normalize(raw){
  record(raw,'Orbital event request');const pair=choice(raw);
  if(raw.startISO!==undefined&&raw.startUTC!==undefined||raw.endISO!==undefined&&raw.endUTC!==undefined)throw new RangeError('Use one start and one end spelling, not duplicate aliases.');
  const start=+exact(raw.startISO??raw.startUTC,'Start'),endDate=parseExplicitInstant(raw.endISO??raw.endUTC),end=+endDate;
  if(end>MAX||end<=start)throw new RangeError('Require start < end within UTC years 1900–2100; end is exclusive.');
  if(end-start>ORBITAL_LIMITS.maxSpanDays*DAY)throw new RangeError(`Search at most ${ORBITAL_LIMITS.maxSpanDays} elapsed days at a time.`);
  return{...pair,start,end,startISO:new Date(start).toISOString(),endISO:new Date(end).toISOString(),startInclusive:true,endExclusive:true};
}
function cancelled(){const e=new Error('Orbital event search cancelled.');e.name='AbortError';e.code='CANCELLED';return e;}
function* eventSteps(raw){
  const request=normalize(raw),events=[],ids=new Set(),stats={positionCalculations:0,searchedIntervals:0,completeRequestedRange:false};
  const sourceMap=new Map(ORBITAL_SOURCES.map(s=>[s.id,s]));
  function push(kind,ms,title,bodyIds,details,summary,sourceIds=['ORBITAL-ASTRONOMY'],limits=[]){
    if(ms<request.start||ms>=request.end)return;
    const dateISO=new Date(ms).toISOString(),id=`orbital:${kind}:${details.targetDirectedLongitude??details.eclipseType??details.phase??details.targetLongitude??''}:${bodyIds.join('-')}:${Math.round(ms/1000)}`;
    if(ids.has(id))return;if(events.length>=ORBITAL_LIMITS.maxEvents)throw new RangeError('Orbital event cap exceeded; narrow the search window.');ids.add(id);
    events.push({id,kind,type:kind,dateISO,startUTC:dateISO,title,bodyIds:[...bodyIds],bodies:[...bodyIds],summary,precision:'numerically-computed instant; model-dependent physical accuracy',details,sourceIds,sources:sourceIds.map(id=>({...sourceMap.get(id)})),limitations:limits});
  }
  const progress=(stage,processed,total=null)=>({stage,processed,total,eventCount:events.length});
  yield progress('lunar-quarters',0);
  let q=A.SearchMoonQuarter(new Date(request.start-2*DAY)),count=0;
  while(+q.time.date<request.end){
    const names=['New Moon','First quarter','Full Moon','Last quarter'];
    push('lunar-quarter',+q.time.date,names[q.quarter],['Sun','Moon'],{phase:q.quarter,targetLongitude:q.quarter*90,frame:'geocentric true ecliptic of date; native MoonPhase without aberration correction',method:'Astronomy Engine SearchMoonQuarter / NextMoonQuarter'},'Solved lunar phase; a new or full Moon alone does not imply an eclipse.',undefined,['Native phase geometry is correlated with Sun–Moon aspects; it is not independent evidence.']);
    q=A.NextMoonQuarter(q);if(++count>64)throw new Error('Lunar sequence iteration cap exceeded.');if(count%4===0)yield progress('lunar-quarters',count);
  }
  yield progress('solar-quarters',0);
  for(let year=new Date(request.start).getUTCFullYear();year<=new Date(request.end-1).getUTCFullYear();year++){
    const seasons=A.Seasons(year);
    for(const [key,title,targetLongitude]of [['mar_equinox','March equinox',0],['jun_solstice','June solstice',90],['sep_equinox','September equinox',180],['dec_solstice','December solstice',270]])push('solar-quarter',+seasons[key].date,title,['Sun'],{targetLongitude,frame:GEO_FRAME,method:'Astronomy Engine Seasons'},'Solved solar-quarter longitude; season names depend on hemisphere.');
    yield progress('solar-quarters',year);
  }
  for(const type of ['solar','lunar']){
    yield progress(`${type}-eclipses`,0);count=0;
    let e=type==='solar'?A.SearchGlobalSolarEclipse(new Date(request.start-2*DAY)):A.SearchLunarEclipse(new Date(request.start-2*DAY));
    while(+e.peak.date<request.end){
      const details={scope:'global',eclipseType:String(e.kind),localVisibility:null,method:type==='solar'?'Astronomy Engine SearchGlobalSolarEclipse / NextGlobalSolarEclipse':'Astronomy Engine SearchLunarEclipse / NextLunarEclipse'};
      if(type==='solar')details.globalShadowAxisDistanceKm=e.distance;else details.semiDurationsMinutes={penumbral:e.sd_penum,partial:e.sd_partial,total:e.sd_total};
      push(`${type}-eclipse`,+e.peak.date,`${String(e.kind)[0].toUpperCase()+String(e.kind).slice(1)} ${type} eclipse · global peak`,['Sun','Earth','Moon'],details,'Global eclipse maximum; local visibility and local contact times are not calculated.',['ORBITAL-ASTRONOMY',type==='solar'?'HORIZON-NASA-SOLAR':'HORIZON-NASA-LUNAR'],['A global peak is not the selected observer’s local maximum or a visibility forecast.','The bundled global solar solver does not separately classify hybrid eclipses.']);
      if(++count>8)throw new Error('Eclipse sequence iteration cap exceeded.');yield progress(`${type}-eclipses`,count);
      e=type==='solar'?A.NextGlobalSolarEclipse(e.peak):A.NextLunarEclipse(e.peak);
    }
  }
  const position=(body,t)=>{stats.positionCalculations++;return vector(body,new Date(t),request.origin);};
  function root(fn,lo,hi,fa,fb){
    if(fa===0)return lo;if(fb===0)return hi;
    for(let i=0;hi-lo>ROOT_MS;i++){
      if(i>40)throw new Error('Pair-aspect root did not converge.');const mid=(lo+hi)/2,fm=fn(mid);
      if(fm===0)return mid;if(Math.sign(fm)===Math.sign(fa)){lo=mid;fa=fm;}else hi=mid;
    }
    return(lo+hi)/2;
  }
  // An absolute UTC grid makes a smaller requested subwindow reproduce the same
  // brackets as its parent. Dates are filtered only after numerical refinement.
  const gridStart=Math.floor(request.start/STEP)*STEP,gridEnd=Math.ceil(request.end/STEP)*STEP,total=(gridEnd-gridStart)/STEP;
  let leftA=position(request.bodyA,gridStart),leftB=position(request.bodyB,gridStart);
  yield progress('pair-aspects',0,total);
  for(let i=0;i<total;i++){
    const lo=gridStart+i*STEP,hi=lo+STEP,rightA=position(request.bodyA,hi),rightB=position(request.bodyB,hi);
    const left=norm360(leftB.longitude-leftA.longitude),right=norm360(rightB.longitude-rightA.longitude);
    for(const [target,type]of DIRECTED){
      const fa=signed(left-target),fb=signed(right-target);
      if((fa!==0&&fb!==0&&Math.sign(fa)===Math.sign(fb))||Math.abs(fb-fa)>=180)continue;
      const ms=root(t=>signed(position(request.bodyB,t).longitude-position(request.bodyA,t).longitude-target),lo,hi,fa,fb),a=position(request.bodyA,ms),b=position(request.bodyB,ms),separation=Math.abs(signed(b.longitude-a.longitude));
      push('pair-aspect',ms,`${request.bodyA}–${request.bodyB} ${type} · ${request.origin==='Earth'?'Earth-view':'Sun-view'} longitude`,[request.bodyA,request.bodyB],{origin:request.origin,frame:request.origin==='Earth'?GEO_FRAME:HELIO_FRAME,aspect:type,pairAspect:{type,angle:Math.min(target,360-target),orb:Math.abs(signed(b.longitude-a.longitude-target))},targetDirectedLongitude:target,longitudeSeparationDegrees:separation,true3DAngleDegrees:angle(a,b),residualDegrees:Math.abs(signed(b.longitude-a.longitude-target)),rootBracketSeconds:1,method:'Globally anchored six-hour longitude crossing brackets, refined by bisection'},'Longitude contact with true three-dimensional angular separation reported separately.',undefined,['Six-hour brackets can miss tangencies or two crossings inside one bracket; this is not an exhaustive closest-approach search.','This contact has no assigned favorable/caution outcome; named historical reading rules are separate.']);
    }
    stats.searchedIntervals++;leftA=rightA;leftB=rightB;if((i+1)%16===0||i===total-1)yield progress('pair-aspects',i+1,total);
  }
  events.sort((a,b)=>a.dateISO.localeCompare(b.dateISO)||a.id.localeCompare(b.id));stats.completeRequestedRange=true;
  const {start,end,...publicRequest}=request;
  return{schemaVersion:1,kind:'orbital-event-inventory',request:publicRequest,events,stats:{...stats,events:events.length},coverage:{nativeSequences:['lunar-quarter','solar-quarter','solar-eclipse','lunar-eclipse'],pairAspects:{origin:request.origin,bodyIds:[request.bodyA,request.bodyB],scanStepHours:6,rootBracketSeconds:1,exhaustive:false},unavailable:['true-sky closest-approach minima','local eclipse visibility and contacts','occultations','planetary transits across the solar disc','all possible alignments','personal outcome forecasts']},sources:copy(ORBITAL_SOURCES),limitations:[...LIMITATIONS,'The start is inclusive and end exclusive. Every six-hour bracket is searched, but tangencies or double crossings within one bracket are not guaranteed. Native phase, season and global eclipse sequences use their named solver APIs.']};
}
export async function buildOrbitalEvents(request,hooks={}){
  record(hooks,'Orbital event hooks');for(const key of ['shouldCancel','onProgress','yieldControl'])if(hooks[key]!==undefined&&typeof hooks[key]!=='function')throw new TypeError(`${key} must be a function.`);
  if(hooks.signal!==undefined&&(!hooks.signal||typeof hooks.signal.aborted!=='boolean'))throw new TypeError('signal must be an AbortSignal.');
  const isCancelled=()=>hooks.signal?.aborted||hooks.shouldCancel?.(),it=eventSteps(request);
  while(true){if(isCancelled())throw cancelled();const step=it.next();if(step.done){if(isCancelled())throw cancelled();return step.value;}hooks.onProgress?.(step.value);await(hooks.yieldControl?hooks.yieldControl():new Promise(resolve=>setTimeout(resolve,0)));}
}
