// Calculated sky geometry and bounded sampled timelines. Pure: explicit inputs,
// no clock, network, storage or DOM. The traditional chart engine is unchanged.
import * as A from '../lib/astronomy.js';
import { norm360, signOf } from './astro.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { validateLocation, validateZone } from './cultural-calendars.js';
import { BEHENIAN_STARS, behenianLongitude, BEHENIAN_EPOCH, PRECESSION_DEG_PER_YEAR } from './data/behenian-stars.js';
import { BRIGHT_STARS, BRIGHT_STAR_PROVENANCE } from './data/bright-star-catalog.js';

const DAY = 86400000;
const MIN = Date.parse('1900-01-01T00:00:00Z');
const MAX = Date.parse('2100-12-31T23:59:59.999Z');
const GEO_FRAME = 'geocentric apparent true ecliptic/equinox of date';
const HELIO_FRAME = 'heliocentric geometric J2000 mean ecliptic';
export const SKY_BODIES = Object.freeze([
  {id:'Sun',name:'Sun',glyph:'☉',classification:'star'},
  {id:'Moon',name:'Moon',glyph:'☽',classification:'natural satellite'},
  {id:'Mercury',name:'Mercury',glyph:'☿',classification:'planet'},
  {id:'Venus',name:'Venus',glyph:'♀',classification:'planet'},
  {id:'Mars',name:'Mars',glyph:'♂',classification:'planet'},
  {id:'Jupiter',name:'Jupiter',glyph:'♃',classification:'planet'},
  {id:'Saturn',name:'Saturn',glyph:'♄',classification:'planet'},
  {id:'Uranus',name:'Uranus',glyph:'♅',classification:'planet'},
  {id:'Neptune',name:'Neptune',glyph:'♆',classification:'planet'},
  {id:'Pluto',name:'Pluto',glyph:'♇',classification:'dwarf planet'},
].map(Object.freeze));
export const SKY_LIMITS = Object.freeze({minYear:1900,maxYear:2100,maxSpanDays:3660,maxSamples:4096,maxSyncSamples:512,maxEvents:1024,minStepHours:1,maxStepHours:8760});
export const SKY_SOURCES = Object.freeze([
  {id:'SKY-ASTRONOMY',title:'Astronomy Engine: GeoVector, coordinate rotations, HelioVector, lunar quarters and Seasons',url:'https://github.com/cosinekitty/astronomy/tree/master/source/js',claimType:'calculated-astronomy',readingDepth:'Selected API documentation and the bundled implementation inspected; not a new independent ephemeris.'},
  {id:'SKY-HORIZONS',title:'NASA JPL Horizons observer tables, quantity 31',url:'https://ssd.jpl.nasa.gov/horizons/manual.html',claimType:'technical-reference',readingDepth:'Selected output definitions and thirteen retrieved target/date fixtures; these spot checks do not validate the complete 1900–2100 interval.'},
  {id:'SKY-BEHENIAN',title:'Inherited Behenian catalogue and approximate longitude precession',url:'assets/js/core/data/behenian-stars.js',claimType:'inherited-approximation',readingDepth:'Existing 2020 longitude table and its source qualifications inspected. No new astrometric catalogue or proper-motion solution.'},
  {id:'SKY-AGRIPPA',title:'Agrippa, Three Books of Occult Philosophy II.47, fifteen fixed stars',url:'https://esotericarchives.com/agrippa/agripp2d.htm',claimType:'historical-source',readingDepth:'Selected II.47 section inspected for the historical stellar grouping, not an astronomical position reference or a complete-book reading.'},
  {id:'SKY-HYG',title:'HYG 4.1: selected twenty-star extract, J2000 positions and Cartesian velocities',url:BRIGHT_STAR_PROVENANCE.sourceURL,claimType:'astronomical-catalogue',readingDepth:'Pinned source CSV, field definitions and CC BY-SA 4.0 license inspected. Twenty selected records; no all-sky or complete magnitude-limited coverage.',license:BRIGHT_STAR_PROVENANCE.license,attribution:BRIGHT_STAR_PROVENANCE.author},
  {id:'SKY-AGRIPPA-NATURES',title:'Agrippa, Three Books II.31, fifteen stars and their natures',url:'https://esotericarchives.com/agrippa/agripp2c.htm#chap31',claimType:'historical-source',readingDepth:'Selected chapter passage checked: the greater Dog-star is called Venereal. Historical longitude is not used as a modern ephemeris.'},
]);
const LIMITATIONS = [
  'Sky positions are calculations, not a validated prediction of personal or historical outcomes. Equal 30° zodiac signs are not IAU constellation boundaries.',
  'Apparent geocentric angles and geometric heliocentric vectors use different origins, epochs and light-time conventions. Do not put them on one angular scale without a labelled transform.',
  'The bundled Astronomy Engine has an upstream design target near one arcminute, with epoch/body/model qualifications. Numerical digits are not a claim of observational precision.',
  'Fixed-star markers are a bounded inherited longitude-only study catalogue, using approximate 2020 positions and linear precession. They have no latitude, distance, proper motion, 3D location or topocentric visibility here.',
  'The separate twenty-star HYG layer linearly propagates catalogue space motion in J2000 axes, then rotates to true ecliptic of date. It omits annual parallax, annual aberration, gravitational light deflection, binary orbital motion and new measurement uncertainties; geometric stellar angles are not apparent planet angles.',
  'An apparent retrograde speed is a geocentric projection effect; planets do not reverse their physical orbit. Aspect contacts use the declared geometric orb, not Lilly’s planet-specific moieties.',
];
const copy = x => JSON.parse(JSON.stringify(x));
const signed = x => norm360(x + 180) - 180;
function record(x,label){if(!x||typeof x!=='object'||Array.isArray(x))throw new RangeError(`${label} must be an object.`);return x;}
function finite(x,min,max,label){if(typeof x!=='number'||!Number.isFinite(x)||x<min||x>max)throw new RangeError(`${label} must be between ${min} and ${max}.`);return x;}
function bool(x,fallback,label){if(x===undefined)return fallback;if(typeof x!=='boolean')throw new RangeError(`${label} must be true or false.`);return x;}
function instant(value){const date=parseExplicitInstant(value);if(+date<MIN||+date>MAX)throw new RangeError('Sky calculations support UTC years 1900–2100.');return date;}
function bodyIds(value){const ids=value===undefined?SKY_BODIES.map(b=>b.id):value;if(!Array.isArray(ids)||!ids.length||ids.length>10||new Set(ids).size!==ids.length||ids.some(id=>!SKY_BODIES.some(b=>b.id===id)))throw new RangeError('Select one to ten distinct supported geocentric bodies.');return [...ids];}
function localFormatter(zone){return new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});}
function localAt(date,formatter){const p=Object.fromEntries(formatter.formatToParts(date).map(p=>[p.type,p.value]));return{localDate:`${p.year}-${p.month}-${p.day}`,localTime:`${p.hour}:${p.minute}:${p.second}`};}
function position(id,date,rotation=A.Rotation_EQJ_ECT(date)){
  const v=A.RotateVector(rotation,A.GeoVector(A.Body[id],date,true)),s=A.SphereFromVector(v);
  return{id,longitude:norm360(s.lon),latitude:s.lat,distanceAU:Math.hypot(v.x,v.y,v.z),frame:GEO_FRAME};
}
function velocity(id,date){const before=position(id,new Date(+date-DAY/4)),after=position(id,new Date(+date+DAY/4));return signed(after.longitude-before.longitude)/.5;}

function catalogStarsAt(date,rotation){
  // Use upstream Cartesian velocities instead of guessing whether pmra means
  // alpha-dot or alpha-dot*cos(delta). HYG explicitly supplies pc/year vectors.
  const years=A.MakeTime(date).tt/365.25;
  return BRIGHT_STARS.map(star=>{
    if(!(star.dist>0&&star.dist<100000)||!['x','y','z','vx','vy','vz'].every(k=>Number.isFinite(star[k])))throw new RangeError('Unsupported or incomplete stellar distance/velocity.');
    const x=star.x+star.vx*years,y=star.y+star.vy*years,z=star.z+star.vz*years,distanceParsecs=Math.hypot(x,y,z);
    const vector=new A.Vector(x/distanceParsecs,y/distanceParsecs,z/distanceParsecs,A.MakeTime(date)),ecl=A.SphereFromVector(A.RotateVector(rotation,vector));
    return{id:star.id,name:star.name,hipparcosId:star.hipparcosId,magnitude:star.mag,constellationAbbreviation:star.constellationAbbreviation,longitude:norm360(ecl.lon),latitude:ecl.lat,sign:signOf(ecl.lon),distanceParsecs,frame:'geometric stellar direction in true ecliptic/equinox of date',equatorialJ2000:{rightAscensionHours:norm360(Math.atan2(y,x)*180/Math.PI)/15,declination:Math.atan2(z,Math.hypot(x,y))*180/Math.PI,unitDirection:{x:x/distanceParsecs,y:y/distanceParsecs,z:z/distanceParsecs}},epoch:'J2000.0 catalogue propagated by Cartesian space motion',yearsSinceEpoch:years,method:'HYG J2000 position + Cartesian velocity × elapsed Julian years in TT, then Astronomy Engine EQJ→ECT rotation',precision:'Catalogue rounding and space-motion approximation; no annual aberration/parallax, binary orbit or new uncertainty estimate',sourceIds:['SKY-HYG','SKY-ASTRONOMY']};
  });
}

export function buildSkySnapshot(input,options={}){
  record(input,'Sky input');record(options,'Sky options');if(input.timeKnown===false)throw new RangeError('An exact sky cast needs a known instant; use the separate unknown-birth-time interval tool.');
  const date=instant(input.dateISO),timeZone=validateZone(input.timeZone);validateLocation(input.lat,input.lon);
  const local=localAt(date,localFormatter(timeZone));if(+local.localDate.slice(0,4)<1900||+local.localDate.slice(0,4)>2100)throw new RangeError('The observer-zone sky cast must also fall within 1900–2100.');
  const ids=bodyIds(options.bodyIds),includeStars=bool(options.includeStars,false,'includeStars'),includeModernStars=bool(options.includeModernStars,false,'includeModernStars'),includeCatalogStars=bool(options.includeCatalogStars,true,'includeCatalogStars'),orb=finite(options.aspectOrb===undefined?3:options.aspectOrb,0,10,'Aspect orb');
  const observer=new A.Observer(input.lat,input.lon,0),rotation=A.Rotation_EQJ_ECT(date),formatter=localFormatter(timeZone);
  const bodies=ids.map(id=>{const p=position(id,date,rotation),speed=velocity(id,date),eq=A.Equator(A.Body[id],date,observer,true,true),h=A.Horizon(date,observer,eq.ra,eq.dec);return{...SKY_BODIES.find(b=>b.id===id),...p,sign:signOf(p.longitude),speedDegreesPerDay:speed,retrograde:speed<0,motionMethod:'Central angular difference across ±6 hours; degrees per day',horizon:{altitude:h.altitude,azimuth:h.azimuth,frame:'topocentric equator/equinox of date to local horizon',refraction:'none',observerHeightMeters:0,visibilityNote:'Geometric altitude alone does not establish visibility; daylight, terrain, weather and extinction are not modeled.'}};});
  const aspects=[];
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
    const a=bodies[i],b=bodies[j],delta=signed(b.longitude-a.longitude),separation=Math.abs(delta),rate=Math.sign(delta)*(b.speedDegreesPerDay-a.speedDegreesPerDay);
    for(const [type,angle] of [['conjunction',0],['sextile',60],['square',90],['trine',120],['opposition',180]])if(Math.abs(separation-angle)<=orb){const residual=separation-angle;aspects.push({bodyA:a.id,bodyB:b.id,type,angle,separation,orb:Math.abs(residual),allowedOrb:orb,applying:Math.abs(residual)<1e-9?null:residual*rate<0,frame:GEO_FRAME,method:'Longitude separation with a user-selected uniform orb; not a full historical judgment'});}
  }
  const fixedStars=includeStars?BEHENIAN_STARS.filter(s=>includeModernStars||!s.modern).map(s=>({name:s.name,longitude:behenianLongitude(s.name,date),sign:signOf(behenianLongitude(s.name,date)),latitude:null,distanceAU:null,modern:s.modern,nature:s.nature,natureAlt:s.natureAlt??null,sourceNote:s.name==='Sirius'?'Agrippa II.31 calls the greater Dog-star Venereal. The inherited Jupiter + Mars alternative attribution remains unverified here.':s.sourceNote??null,frame:'approximate tropical ecliptic longitude of date only',precision:'Inherited rounded ~2020 longitude + linear 50.29 arcsec/year precession; no proper motion or astrometric uncertainty estimate',catalogueEpoch:BEHENIAN_EPOCH,precessionDegreesPerYear:PRECESSION_DEG_PER_YEAR,sourceIds:['SKY-BEHENIAN','SKY-AGRIPPA','SKY-AGRIPPA-NATURES']})):[];
  const helioIds=['Sun','Earth',...ids.filter(id=>id!=='Sun')],helioRotation=A.Rotation_EQJ_ECL();
  const heliocentric={frame:HELIO_FRAME,units:'AU',lightTimeCorrection:false,aberrationCorrection:false,bodyRadiusScale:'not supplied; any visible symbol sizes are illustrative',bodies:helioIds.map(id=>{const v=A.RotateVector(helioRotation,A.HelioVector(A.Body[id],date));return{id,x:v.x,y:v.y,z:v.z,distanceAU:Math.hypot(v.x,v.y,v.z),frame:HELIO_FRAME};}),projectionNote:'These are physical position vectors at the chosen instant, not an N-body simulation or circular orbit fit. Preserve an explicit linear-AU or compressed visual scale label.'};
  return{schemaVersion:1,kind:'calculated-sky-snapshot',context:{dateISO:date.toISOString(),timeZone,lat:input.lat,lon:input.lon,...localAt(date,formatter)},bodies,catalogStars:includeCatalogStars?catalogStarsAt(date,rotation):[],catalogue:includeCatalogStars?copy(BRIGHT_STAR_PROVENANCE):null,fixedStars,aspects,aspectOrb:orb,heliocentric,sources:copy(SKY_SOURCES),limitations:[...LIMITATIONS]};
}

function yearShift(date,years){const d=new Date(+date),month=d.getUTCMonth();d.setUTCFullYear(d.getUTCFullYear()+years);if(d.getUTCMonth()!==month)d.setUTCDate(0);return d;}
export function normalizeSkyTimelineRequest(raw,{maxSamples=SKY_LIMITS.maxSamples,maxEvents=SKY_LIMITS.maxEvents}={}){
  record(raw,'Timeline request');finite(maxSamples,2,SKY_LIMITS.maxSamples,'Maximum samples');finite(maxEvents,1,SKY_LIMITS.maxEvents,'Maximum events');if(!Number.isInteger(maxSamples)||!Number.isInteger(maxEvents))throw new RangeError('Work caps must be integers.');
  const timeZone=validateZone(raw.timeZone),ids=bodyIds(raw.bodyIds),includeEvents=bool(raw.includeEvents,true,'includeEvents');
  let start,end,center=null,requestedStart,requestedEnd;
  const explicit=raw.startISO!==undefined||raw.endISO!==undefined;
  if(explicit){start=instant(raw.startISO);end=instant(raw.endISO);requestedStart=start.toISOString();requestedEnd=end.toISOString();if(raw.centerISO!==undefined)center=instant(raw.centerISO);}
  else{center=instant(raw.centerISO);const before=finite(raw.yearsBefore===undefined?5:raw.yearsBefore,0,5,'Years before'),after=finite(raw.yearsAfter===undefined?5:raw.yearsAfter,0,5,'Years after');if(!Number.isInteger(before)||!Number.isInteger(after))throw new RangeError('Year windows must be whole calendar years.');const a=yearShift(center,-before),b=yearShift(center,after);requestedStart=a.toISOString();requestedEnd=b.toISOString();start=new Date(Math.max(MIN,+a));end=new Date(Math.min(MAX,+b));}
  if(+end<=+start)throw new RangeError('Timeline end must be later than its start.');const spanDays=(end-start)/DAY;if(spanDays>SKY_LIMITS.maxSpanDays)throw new RangeError(`Timeline windows are limited to ${SKY_LIMITS.maxSpanDays} elapsed days.`);
  if(raw.stepDays!==undefined&&raw.stepHours!==undefined)throw new RangeError('Choose stepDays or stepHours, not both.');if(raw.stepDays!==undefined)finite(raw.stepDays,SKY_LIMITS.minStepHours/24,SKY_LIMITS.maxStepHours/24,'Sample interval in days');if(raw.stepHours!==undefined)finite(raw.stepHours,SKY_LIMITS.minStepHours,SKY_LIMITS.maxStepHours,'Sample interval in hours');const stepHours=finite(raw.stepHours??(raw.stepDays??14)*24,SKY_LIMITS.minStepHours,SKY_LIMITS.maxStepHours,'Sample interval in hours');
  const sampleCount=Math.ceil((end-start)/(stepHours*3600000))+1;if(sampleCount>maxSamples)throw new RangeError(`This interval needs ${sampleCount} samples; maximum ${maxSamples}. Narrow the range or increase the sample interval.`);
  return{startISO:start.toISOString(),endISO:end.toISOString(),centerISO:center?.toISOString()??null,timeZone,bodyIds:ids,includeEvents,stepHours,sampleCount,maxSamples,maxEvents,spanDays,requestedStartISO:requestedStart,requestedEndISO:requestedEnd,clippedToSupportedRange:requestedStart!==start.toISOString()||requestedEnd!==end.toISOString(),grid:'Fixed elapsed UTC hours, including both endpoints; final interval may be shorter. Local clock labels can shift with daylight saving.'};
}

function* timelineSteps(raw,limits){
  const request=normalizeSkyTimelineRequest(raw,limits),start=Date.parse(request.startISO),end=Date.parse(request.endISO),formatter=localFormatter(request.timeZone),samples=[],events=[];
  yield{stage:'samples',processed:0,total:request.sampleCount};
  for(let i=0;i<request.sampleCount;i++){
    const date=new Date(Math.min(end,start+i*request.stepHours*3600000)),rotation=A.Rotation_EQJ_ECT(date),positions=request.bodyIds.map(id=>{const p=position(id,date,rotation);return{...p,signIndex:Math.floor(p.longitude/30)};});samples.push({dateISO:date.toISOString(),...localAt(date,formatter),positions});
    if((i+1)%8===0||i===request.sampleCount-1)yield{stage:'samples',processed:i+1,total:request.sampleCount};
  }
  const pushEvent=(date,rest)=>{if(+date<start||+date>end)return;if(events.length>=request.maxEvents)throw new RangeError(`Timeline events exceed the declared ${request.maxEvents} event cap.`);events.push({dateISO:date.toISOString(),...localAt(date,formatter),...rest});};
  if(request.includeEvents){
    const seasons=[['mar_equinox','March equinox',0],['jun_solstice','June solstice',90],['sep_equinox','September equinox',180],['dec_solstice','December solstice',270]];
    for(let year=new Date(start).getUTCFullYear();year<=new Date(end).getUTCFullYear();year++){
      const result=A.Seasons(year);for(const [key,label,angle] of seasons)pushEvent(result[key].date,{kind:'solar-quarter',label,angle,definition:'Sun’s apparent geocentric ecliptic longitude',method:'Astronomy Engine Seasons numerical search',frame:GEO_FRAME});yield{stage:'solar-events',processed:events.length,total:null};
    }
    const phases=['New Moon','First quarter','Full Moon','Last quarter'];let quarter=A.SearchMoonQuarter(new Date(start-1000)),iterations=0;
    while(+quarter.time.date<=end){pushEvent(quarter.time.date,{kind:'lunar-quarter',label:phases[quarter.quarter],angle:quarter.quarter*90,definition:'Moon–Sun geocentric ecliptic longitude difference; phase does not assert an eclipse',method:'Astronomy Engine SearchMoonQuarter / NextMoonQuarter',frame:GEO_FRAME});quarter=A.NextMoonQuarter(quarter);iterations++;if(iterations%8===0)yield{stage:'lunar-events',processed:events.length,total:null};if(iterations>SKY_LIMITS.maxEvents)throw new RangeError('Lunar event iteration limit exceeded.');}
  }
  events.sort((a,b)=>a.dateISO.localeCompare(b.dateISO)||a.kind.localeCompare(b.kind));
  const warnings=[];
  if(request.bodyIds.includes('Moon')&&request.stepHours>24)warnings.push('The Moon moves rapidly: this coarse grid aliases its path and can skip multiple signs or a whole revolution. Use one-day/hourly samples in a shorter window; only the separately solved lunar-quarter markers are event times.');
  if(request.clippedToSupportedRange)warnings.push('The requested centered window reaches beyond 1900–2100 and has been explicitly clipped to the supported UTC range.');
  return{schemaVersion:1,kind:'calculated-sky-timeline',request,samples,events,counts:{samples:samples.length,events:events.length,positionCalculations:samples.length*request.bodyIds.length},sampling:{continuousTrajectory:false,allTransitionsDetected:false,eventTypes:request.includeEvents?['solar-quarter','lunar-quarter']:[],eventTiming:'Numerically solved astronomical phase/season instants, separate from sampled points; model precision is not exact observational truth.',warnings},sources:copy(SKY_SOURCES).filter(s=>['SKY-ASTRONOMY','SKY-HORIZONS'].includes(s.id)),limitations:[...LIMITATIONS,'Timeline points are independently computed on the declared UTC grid, not hardcoded year tables. Connecting coarse samples does not recover intervening loops, stations, conjunctions or sign crossings.','Events are limited to solved solar and lunar quarters. Planetary ingresses, stations, eclipses and every possible aspect are not exhaustively searched.','UTC and UT1 are approximated as equivalent by the bundled engine; historical/future time-zone and Delta-T conventions limit precision.']};
}
export function buildSkyTimelineSync(request,limits={}){const it=timelineSteps(request,{maxSamples:SKY_LIMITS.maxSyncSamples,...limits});let step;do{step=it.next();}while(!step.done);return step.value;}
function cancelled(){const e=new Error('Sky timeline cancelled.');e.code='CANCELLED';return e;}
export async function buildSkyTimeline(request,hooks={}){
  const it=timelineSteps(request,{maxSamples:hooks.maxSamples??SKY_LIMITS.maxSamples,maxEvents:hooks.maxEvents??SKY_LIMITS.maxEvents});
  while(true){if(hooks.shouldCancel?.())throw cancelled();const step=it.next();if(step.done){if(hooks.shouldCancel?.())throw cancelled();return step.value;}hooks.onProgress?.(step.value);await(hooks.yieldControl?hooks.yieldControl():new Promise(resolve=>setTimeout(resolve,0)));}
}
