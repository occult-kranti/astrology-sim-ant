// Pure angular world-map geometry. No storage, network, clock or hidden profile.
import { GeoVector, RotateVector, Rotation_EQJ_EQD, EquatorFromVector, SiderealTime, Body } from '../lib/astronomy.js';
import { civilFields, resolveZonedTime } from './time.js';
import { validateLocation, validateZone } from './cultural-calendars.js';
import { parseExplicitInstant, HOUSE_SYSTEMS } from './instant-boundary.js';
import { buildDesktopStudy, exportDesktopStudy } from './desktop-workbench.js';
import { exportReadingLab } from './reading-lab.js';
import { ASTROCARTOGRAPHY_SOURCES, ASTROCARTOGRAPHY_CITIES, ASTROCARTOGRAPHY_PLANET_NOTES, ASTROCARTOGRAPHY_ANGLE_NOTES, ASTROCARTOGRAPHY_PURPOSES } from './data/astrocartography-data.js';

export const ASTROCARTOGRAPHY_BODY_IDS=Object.freeze(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']);
export const ASTROCARTOGRAPHY_ANGLE_IDS=Object.freeze(['ASC','DSC','MC','IC']);
export const ASTROCARTOGRAPHY_DEMO_PROFILE=Object.freeze({name:'Public equinox study · Greenwich',localDate:'2024-03-20',localTime:'03:06',timeZone:'UTC',lat:51.4779,lon:0,disambiguation:'reject'});
export const ASTROCARTOGRAPHY_EARTH_RADIUS_KM=6371.0088;
const DEG=Math.PI/180,EPS=1e-10,copy=v=>JSON.parse(JSON.stringify(v)),own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],scale=(v,k)=>v.map(x=>x*k),add=(a,b)=>a.map((x,i)=>x+b[i]),length=v=>Math.hypot(...v),unit=v=>scale(v,1/length(v)),clamp=x=>Math.max(-1,Math.min(1,x));
const wrap=lon=>((lon+180)%360+360)%360-180,angle=(a,b)=>Math.atan2(length(cross(a,b)),clamp(dot(a,b)));
const PROFILE_KEYS=['name','localDate','localTime','timeZone','lat','lon','disambiguation'];
const LIMITS=[
 'This is a modern astrocartography study map, not a Lilly rule, a full relocation judgment, parans, or a forecast of outcomes. Astrology has no demonstrated predictive validity.',
 'World angular lines depend on the UTC instant, not the input birthplace, house system, calendar, purpose or search radius. Selecting different bodies/angles changes the analyzed set and ranking denominator.',
 'Geocentric center horizon: altitude zero without atmospheric refraction, limb radius, terrain or topocentric parallax. These are not observed sunrise/moonrise lines; lunar parallax can be substantial.',
 'MC and IC mean upper and lower meridian transit, not zenith/nadir everywhere or guaranteed above/below-horizon visibility. Meridian sense and ordinary rising/setting become degenerate at geographic poles.',
 'True equator/equinox of date and matching GAST use bundled Astronomy Engine conventions. GeoVector(true) uses its direct GeoMoon shortcut for the Moon, rather than the other bodies’ full backdating/aberration path.',
 'Distances use a mean-radius sphere, 6371.0088 km; supplied geographic latitudes are treated as spherical coordinates. This is not an ellipsoidal surface-distance survey or topographic horizon model.',
 'Coordinates do not determine an IANA zone; the caller must check the explicit place/zone pair. Relocation preserves one UTC instant and changes only the observer.',
 'Purpose weights and a linear distance taper are an editorial comparison rubric. Scores are not measured probabilities, safety judgments, event predictions or independent evidence of efficacy.',
 'Map lines use equatorial in-mundo angularity. Relocated zodiacal house positions use ecliptic longitude; a body with ecliptic latitude need not have longitude equal to the MC cusp when its equatorial meridian line passes the observer.',
];
function object(v,keys,label,required=[]){
 if(!v||typeof v!=='object'||Array.isArray(v)||![Object.prototype,null].includes(Object.getPrototypeOf(v)))throw new TypeError(`${label} must be a plain JSON object.`);
 for(const key of Reflect.ownKeys(v)){const descriptor=Object.getOwnPropertyDescriptor(v,key);if(typeof key!=='string'||!keys.includes(key)||!own(descriptor,'value')||!descriptor.enumerable)throw new TypeError(`Unknown, hidden or non-data ${label} field.`);}
 for(const key of required)if(!own(v,key))throw new RangeError(`${label} requires explicit ${key}; no birth clock or location is inferred.`);
}
function text(v,label,max=120){if(typeof v!=='string'||!v.trim()||v.length>max||/[\u0000-\u001f\u007f]/.test(v))throw new RangeError(`Use bounded ${label} text.`);return v.trim();}
function list(v,allowed,max,label,min=1){if(v===undefined)return [...allowed];if(!Array.isArray(v)||Object.getPrototypeOf(v)!==Array.prototype||v.length<min||v.length>max||Reflect.ownKeys(v).length!==v.length+1||!Array.from({length:v.length},(_,i)=>Object.getOwnPropertyDescriptor(v,String(i))).every(d=>d&&own(d,'value')&&d.enumerable)||v.some(x=>!allowed.includes(x))||new Set(v).size!==v.length)throw new RangeError(`Choose distinct supported ${label}.`);return [...v];}
function instant(value){const date=parseExplicitInstant(value);if(date.getUTCFullYear()<1900||date.getUTCFullYear()>2100)throw new RangeError('Astrocartography supports explicit UTC years 1900–2100.');return date;}
function profileOf(raw){
 object(raw,PROFILE_KEYS,'Profile',PROFILE_KEYS);
 const p={name:text(raw.name,'profile name',100),localDate:text(raw.localDate,'civil date',10),localTime:text(raw.localTime,'clock',8),timeZone:validateZone(raw.timeZone),lat:raw.lat,lon:raw.lon,disambiguation:raw.disambiguation};
 const f=civilFields(p.localDate,p.localTime);if(!/^\d{4}-\d{2}-\d{2}$/.test(p.localDate)||f.year<1900||f.year>2100)throw new RangeError('Local profile dates must lie within 1900–2100.');
 validateLocation(p.lat,p.lon);if(!['reject','earlier','later'].includes(p.disambiguation))throw new RangeError('Choose reject, earlier or later for repeated clocks.');
 const resolved=resolveZonedTime(p.localDate,p.localTime,p.timeZone,p);instant(resolved.instant.toISOString());
 return {profile:p,resolved};
}
export function normalizeAstrocartographyInputs(raw){
 object(raw,['profile','bodyIds','angleIds','purpose','radiusKm','system','cityIds'],'Astrocartography input',['profile']);
 const {profile}=profileOf(raw.profile),bodyIds=list(raw.bodyIds,ASTROCARTOGRAPHY_BODY_IDS,10,'bodies'),angleIds=list(raw.angleIds,ASTROCARTOGRAPHY_ANGLE_IDS,4,'angles');
 const purpose=raw.purpose??'overview',radiusKm=raw.radiusKm??500,system=raw.system??'regiomontanus';
 if(!ASTROCARTOGRAPHY_PURPOSES.some(p=>p.id===purpose))throw new RangeError('Choose a registered editorial purpose.');
 if(typeof radiusKm!=='number'||!Number.isFinite(radiusKm)||radiusKm<1||radiusKm>3000)throw new RangeError('Search radius must be 1–3000 km.');
 if(!HOUSE_SYSTEMS.includes(system))throw new RangeError('Choose a supported relocated house system.');
 const cityIds=list(raw.cityIds,ASTROCARTOGRAPHY_CITIES.map(c=>c.id),40,'reference cities',0);
 return {profile,bodyIds,angleIds,purpose,radiusKm,system,cityIds};
}
export function getAstrocartographyBodyPositions(dateISO){
 const date=instant(dateISO),rotation=Rotation_EQJ_EQD(date),gastDegrees=SiderealTime(date)*15;
 const bodies=ASTROCARTOGRAPHY_BODY_IDS.map(id=>{
  const eq=EquatorFromVector(RotateVector(rotation,GeoVector(Body[id],date,true)));
  return{id,raHours:eq.ra,raDegrees:eq.ra*15,declinationDegrees:eq.dec,distanceAU:eq.dist,subpoint:{lat:eq.dec,lon:wrap(eq.ra*15-gastDegrees)},positionMethod:id==='Moon'?'Bundled GeoMoon geocentric shortcut, then precession/nutation to EQD; not the other bodies’ full light-time/aberration path':'GeoVector(true): bundled light-time/backdating and aberration, then precession/nutation to true equator/equinox of date'};
 });
 return{dateISO:date.toISOString(),gastDegrees,bodies,frame:'True equator and equinox of date; geocentric; matching Greenwich apparent sidereal time',timeConvention:'Astronomy Engine treats the numeric civil-UTC date as its UT proxy and estimates TT using its internal Delta-T model. No DUT1/EOP or future leap-second solution is supplied; numerical digits do not imply arcsecond civil-time ground-track accuracy.'};
}
function pointVector(lat,lon){return[Math.cos(lat*DEG)*Math.cos(lon*DEG),Math.cos(lat*DEG)*Math.sin(lon*DEG),Math.sin(lat*DEG)];}
function vectorPoint(v){return{lat:Math.atan2(v[2],Math.hypot(v[0],v[1]))/DEG,lon:wrap(Math.atan2(v[1],v[0])/DEG)};}
function at(geometry,theta){return add(scale(geometry.midpoint,Math.cos(theta)),scale(geometry.tangent,Math.sin(theta)));}
function renderedSegments(geometry){
 const samples=Array.from({length:91},(_,i)=>{const theta=-Math.PI/2+i*Math.PI/90;return{theta,...vectorPoint(at(geometry,theta))};});
 // The display longitude at a pole is assigned from the adjoining arc; a pole
 // itself has no unique longitude or ordinary rising/setting branch.
 if(Math.abs(samples[0].lat)>89.999999)samples[0].lon=samples[1].lon;
 if(Math.abs(samples.at(-1).lat)>89.999999)samples.at(-1).lon=samples.at(-2).lon;
 const segments=[[[samples[0].lon,samples[0].lat]]];
 for(let i=1;i<samples.length;i++){
  const previous=samples[i-1],current=samples[i];
  if(Math.abs(current.lon-previous.lon)>180){
   let theta=Math.atan2(-geometry.midpoint[1],geometry.tangent[1]);
   while(theta<previous.theta-EPS)theta+=Math.PI;while(theta>current.theta+EPS)theta-=Math.PI;
   const q=at(geometry,theta),lat=vectorPoint(q).lat,edge=previous.lon>0?180:-180;
   segments.at(-1).push([edge,lat]);segments.push([[-edge,lat]]);
  }
  segments.at(-1).push([current.lon,current.lat]);
 }
 return segments.filter(s=>s.length>1);
}
function semicircle(bodyId,angleId,normal,midpoint){
 const n=unit(normal),m=unit(midpoint),tangent=unit(cross(n,m));
 const geometry={normal:n,midpoint:m,tangent,endpoints:[scale(tangent,-1),tangent],arcRadians:Math.PI};
 return{id:`${bodyId}-${angleId}`,bodyId,angle:angleId,geometry,segments:renderedSegments(geometry),boundary:'Closed semicircle for distance measurement; endpoints may be grazing or polar degeneracies, not ordinary angle events',sampling:'91 analytic arc samples with exact dateline intersections; samples are display geometry, not the distance/crossing algorithm'};
}
/** Synthetic RA/declination inputs support independent geometry fixtures. */
export function lineGeometryForBody(body,gastDegrees){
 if(!body||!ASTROCARTOGRAPHY_BODY_IDS.includes(body.id)||![body.raDegrees,body.declinationDegrees,gastDegrees].every(Number.isFinite)||Math.abs(body.declinationDegrees)>90)throw new RangeError('Use a supported body and finite equatorial angles.');
 const lambda=wrap(body.raDegrees-gastDegrees)*DEG,delta=body.declinationDegrees*DEG,u=[Math.cos(lambda),Math.sin(lambda),0],east=[-Math.sin(lambda),Math.cos(lambda),0],sky=[Math.cos(delta)*u[0],Math.cos(delta)*u[1],Math.sin(delta)];
 const lines=[],warnings=[];
 if(Math.abs(Math.cos(delta))<EPS)warnings.push('Declination at a celestial pole: right ascension and ordinary angular-transit/rising/setting orientation are undefined; all angular lines omitted.');
 else lines.push(semicircle(body.id,'MC',east,u),semicircle(body.id,'IC',east,scale(u,-1)),semicircle(body.id,'ASC',sky,scale(east,-1)),semicircle(body.id,'DSC',sky,east));
 return{bodyId:body.id,lines,warnings,riseSetLatitudeLimit:90-Math.abs(body.declinationDegrees)};
}
function validGeometry(line){const g=line?.geometry;if(!g||![g.normal,g.midpoint,g.tangent].every(v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)&&Math.abs(length(v)-1)<1e-7)||Math.abs(dot(g.normal,g.midpoint))>1e-7||Math.abs(dot(g.normal,g.tangent))>1e-7||Math.abs(dot(g.midpoint,g.tangent))>1e-7)throw new RangeError('A valid unit-sphere semicircle geometry is required.');return g;}
export function distanceToAstrocartographyLine(line,place){
 validateLocation(place?.lat,place?.lon);const g=validGeometry(line),v=pointVector(place.lat,place.lon),projected=add(v,scale(g.normal,-dot(v,g.normal)));
 const candidates=[{q:scale(g.tangent,-1),kind:'endpoint'},{q:g.tangent,kind:'endpoint'}];
 if(length(projected)>EPS)for(const sign of [1,-1]){const q=scale(unit(projected),sign);if(dot(q,g.midpoint)>=-EPS)candidates.push({q,kind:Math.abs(dot(q,g.midpoint))<EPS?'endpoint':'interior'});}
 candidates.sort((a,b)=>angle(v,a.q)-angle(v,b.q));const closest=candidates[0],radians=angle(v,closest.q);
 return{lineId:line.id,bodyId:line.bodyId,angle:line.angle,distanceKm:radians*ASTROCARTOGRAPHY_EARTH_RADIUS_KM,angularDistanceDegrees:radians/DEG,nearestPoint:vectorPoint(closest.q),nearestKind:closest.kind,method:'Shortest spherical distance to this closed semicircle, including endpoints; not distance to its unbounded great circle'};
}
export function intersectAstrocartographyLines(a,b){
 const ga=validGeometry(a),gb=validGeometry(b),axis=cross(ga.normal,gb.normal);
 if(length(axis)<EPS)return{status:'unresolved-coincident-or-near-parallel',points:[],normalCrossProductTolerance:EPS,note:'Supporting great-circle normals coincide or are unresolved near-parallel within the stated tolerance. No isolated point is fabricated; this does not prove exact coincidence or branch overlap.'};
 const points=[],omittedPolar=[];
 for(const sign of [1,-1]){
  const q=scale(unit(axis),sign);if(dot(q,ga.midpoint)<-EPS||dot(q,gb.midpoint)<-EPS)continue;
  const p=vectorPoint(q);if(Math.abs(p.lat)>89.999999){omittedPolar.push(p);continue;}
  const boundary=Math.abs(dot(q,ga.midpoint))<1e-8||Math.abs(dot(q,gb.midpoint))<1e-8;
  points.push({...p,kind:boundary?'grazing-boundary':'angular-crossing',residualDegrees:Math.max(Math.abs(Math.asin(clamp(dot(q,ga.normal)))),Math.abs(Math.asin(clamp(dot(q,gb.normal)))))/DEG});
 }
 return{status:points.length?'isolated-crossings':'no-isolated-crossing',points,omittedPolarCount:omittedPolar.length};
}
function rankPlace(place,lines,input){
 const purpose=ASTROCARTOGRAPHY_PURPOSES.find(p=>p.id===input.purpose),distances=lines.map(line=>({...distanceToAstrocartographyLine(line,place),proximity:0}));
 for(const d of distances)d.proximity=Math.max(0,1-d.distanceKm/input.radiusKm);
 distances.sort((a,b)=>a.distanceKm-b.distanceKm||a.lineId.localeCompare(b.lineId));
 const denominator=input.bodyIds.reduce((sum,id)=>sum+Math.abs(purpose.planetWeights[id]??0),0),contributions=[];let proximitySum=0;
 for(const bodyId of input.bodyIds){
  const matches=distances.filter(d=>d.bodyId===bodyId),nearest=matches[0];proximitySum+=nearest?.proximity??0;
  const selected=[...matches].sort((a,b)=>(b.proximity*(purpose.angleWeights[b.angle]??0))-(a.proximity*(purpose.angleWeights[a.angle]??0))||a.distanceKm-b.distanceKm||a.lineId.localeCompare(b.lineId))[0];
  const planetWeight=purpose.planetWeights[bodyId]??0,angleWeight=selected?purpose.angleWeights[selected.angle]??0:0,contribution=selected?planetWeight*angleWeight*selected.proximity:0;
  contributions.push({bodyId,lineId:selected?.lineId??null,distanceKm:selected?.distanceKm??null,planetWeight,angleWeight,proximity:selected?.proximity??0,contribution,normalizedPoints:denominator?100*contribution/denominator:0});
 }
 const polar=Math.abs(place.lat)===90,score=polar?null:denominator?100*contributions.reduce((s,c)=>s+c.contribution,0)/denominator:0;
 return{status:polar?'undefined-at-pole':'available',reason:polar?'Geographic pole: meridians converge and ordinary angle sense is undefined. Distances to closed geometric arcs are retained, but no editorial score or favorable-location claim is assigned.':null,score,purposeScore:score,proximityScore:polar?null:100*proximitySum/input.bodyIds.length,purpose:input.purpose,radiusKm:input.radiusKm,denominator,contributions:polar?[]:contributions,nearestLines:distances.slice(0,5),withinRadiusLineCount:distances.filter(d=>d.distanceKm<=input.radiusKm).length,distances};
}
export function buildAstrocartography(raw){
 const inputs=normalizeAstrocartographyInputs(raw),{resolved}=profileOf(inputs.profile),sky=getAstrocartographyBodyPositions(resolved.instant.toISOString()),bodies=sky.bodies.filter(b=>inputs.bodyIds.includes(b.id));
 const geometry=bodies.map(b=>lineGeometryForBody(b,sky.gastDegrees)),lines=geometry.flatMap(g=>g.lines).filter(l=>inputs.angleIds.includes(l.angle)),crossings=[],diagnostics={omittedPolarCrossings:0,coincidentPairs:[],sameBodyPairsExcluded:true,normalCrossProductTolerance:EPS,note:'Polar omissions count candidate pairs, not unique geographic poles. coincidentPairs denotes unresolved coincident-or-near-parallel supporting circles within the numerical tolerance, not proof of exact overlap.'};
 for(let i=0;i<lines.length;i++)for(let j=i+1;j<lines.length;j++){
  const a=lines[i],b=lines[j];if(a.bodyId===b.bodyId)continue;const hit=intersectAstrocartographyLines(a,b);
  diagnostics.omittedPolarCrossings+=hit.omittedPolarCount??0;if(hit.status==='unresolved-coincident-or-near-parallel')diagnostics.coincidentPairs.push([a.id,b.id]);
  for(const [index,p]of hit.points.entries())crossings.push({id:`${a.id}__${b.id}__${index}`,lineIds:[a.id,b.id],bodyIds:[a.bodyId,b.bodyId],angles:[a.angle,b.angle],...p});
 }
 const cityRankings=ASTROCARTOGRAPHY_CITIES.filter(c=>inputs.cityIds.includes(c.id)).map(city=>{const {distances,...ranking}=rankPlace(city,lines,inputs);return{city:copy(city),...ranking};}).sort((a,b)=>b.score-a.score||b.proximityScore-a.proximityScore||a.city.id.localeCompare(b.city.id)).map((r,i)=>({...r,rank:i+1}));
 const purpose=ASTROCARTOGRAPHY_PURPOSES.find(p=>p.id===inputs.purpose);
 return{schemaVersion:1,kind:'astrocartography-study',inputs,context:{instantISO:sky.dateISO,timeKnown:true,sourceProfile:copy(inputs.profile),offsetHours:resolved.offsetHours,ambiguous:resolved.ambiguous,gastDegrees:sky.gastDegrees,frame:sky.frame,timeConvention:sky.timeConvention,birthplaceAffectsWorldLines:false},bodies,lines,crossings,crossingDiagnostics:diagnostics,cityRankings,
  scoring:{purpose:copy(purpose),formula:'Per body, select the angle with maximum angleWeight × max(0,1−distanceKm/radiusKm); multiply by signed planetWeight. Sum and divide by the fixed sum of absolute selected planet weights, then ×100. Ties choose the nearer line, then line ID.',proximityFormula:'Mean nearest-line proximity across selected bodies ×100; separate from purpose weighting.',range:[-100,100],claimType:'project-editorial-rubric',selectionEffect:'Body and angle filters change the analyzed set; body filters also change the normalization denominator. A map-view theme or house setting does not move the physical lines.'},
  sources:copy(ASTROCARTOGRAPHY_SOURCES),notes:{planets:copy(ASTROCARTOGRAPHY_PLANET_NOTES),angles:copy(ASTROCARTOGRAPHY_ANGLE_NOTES)},warnings:geometry.flatMap(g=>g.warnings),limitations:[...LIMITS]};
}
function placeOf(raw){object(raw,['name','lat','lon','timeZone'],'Place',['name','lat','lon','timeZone']);validateLocation(raw.lat,raw.lon);return{name:text(raw.name,'place name',100),lat:raw.lat,lon:raw.lon,timeZone:validateZone(raw.timeZone)};}
function relocatedProfile(dateISO,place){
 const date=instant(dateISO),p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:place.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
 const localDate=`${p.year}-${p.month}-${p.day}`,localTime=`${p.hour}:${p.minute}:${p.second}`;
 const earlier=resolveZonedTime(localDate,localTime,place.timeZone,{disambiguation:'earlier'}),disambiguation=earlier.instant.getTime()===date.getTime()?'earlier':'later';
 const profile={name:`Relocated: ${place.name}`.slice(0,100),localDate,localTime,timeZone:place.timeZone,lat:place.lat,lon:place.lon,disambiguation};
 const resolved=resolveZonedTime(localDate,localTime,place.timeZone,{disambiguation});if(+resolved.instant!==+date)throw new RangeError('The relocated clock did not preserve the input instant.');return profile;
}
export function inspectAstrocartographyPlace(raw,rawPlace){
 const study=buildAstrocartography(raw),place=placeOf(rawPlace),ranking=rankPlace(place,study.lines,study.inputs),{distances,...ranked}=ranking;
 let relocatedStudy=null,reading=null;const relocation={status:'available',reason:null,instantISO:study.context.instantISO,requestedSystem:study.inputs.system,actualSystem:null,houseWarning:null};
 try{const profile=relocatedProfile(study.context.instantISO,place);relocatedStudy=exportDesktopStudy(buildDesktopStudy({primary:profile,mode:'natal',zodiac:'tropical',system:study.inputs.system,orb:3}));relocation.actualSystem=relocatedStudy.primary.actualSystem;relocation.houseWarning=relocatedStudy.primary.chart.houseWarning??null;}
 catch(e){relocation.status='unavailable';relocation.reason=e.message;}
 try{reading=exportReadingLab({instantISO:study.context.instantISO,timeZone:place.timeZone,lat:place.lat,lon:place.lon,system:study.inputs.system});}catch(e){relocation.readingUnavailableReason=e.message;}
 return{schemaVersion:1,kind:'astrocartography-place-study',inputs:study.inputs,context:study.context,place,distances,ranking:ranked,relocation,relocatedStudy,reading,sources:[...study.sources,...(relocatedStudy?.sources??[])],limitations:[...LIMITS,'Relocated chart mode reuses the canonical natal geometry engine in the tropical zodiac to inspect this explicit instant. Essential dignity and located houses are reported separately; they never enter the proximity score. Civil calendar labels are not positive or negative votes. This does not assert that the public study moment is anyone’s birth or infer a residence recommendation.']};
}
function sourcesBrief(sources){return sources.map(({id,title,url,locator,readingDepth,rightsScope,rights})=>({id,title,url,locator:locator??null,readingDepth:readingDepth??'Inherited reference; not re-read here',rightsScope:rightsScope??rights??null}));}
const COMPACT_LIMITS=[
 'Modern astrocartography, not Lilly, parans, full relocation judgment or demonstrated predictive validity.',
 'World lines depend only on the UTC instant. Body/angle filters change the analyzed set; selected bodies change the score denominator.',
 'Geocentric center horizon: no refraction, limb radius, terrain or topocentric parallax. Not observed sunrise/moonrise.',
 'MC/IC are upper/lower meridian transits, not zenith/nadir or visibility guarantees. Pole and grazing events are degenerate.',
 'EQD and GAST use bundled Astronomy Engine time conventions; Moon uses its GeoMoon shortcut. Numerical digits are not accuracy guarantees.',
 'Mean sphere radius6371.0088km; geographic latitude is treated as spherical, not ellipsoidal or topographic.',
 'Caller checks the explicit coordinate/IANA-zone pair. Relocation preserves UTC; it does not infer a birth or residence recommendation.',
 'Purpose weights/proximity are editorial, not probabilities or safety predictions. Houses, dignity and civil calendars do not enter that score.',
 'Equatorial angular lines and ecliptic zodiacal houses are different projections; nonzero body latitude can prevent longitude/MC-cusp equality.',
];
const DISTANCE_METHOD='Shortest spherical distance to the specified closed semicircle, including its endpoints; not an infinite great-circle distance. Radius6371.0088km.';
const compactDistance=({lineId,distanceKm,angularDistanceDegrees,nearestPoint,nearestKind})=>({lineId,distanceKm,angularDistanceDegrees,nearestPoint,nearestKind});
const compactPlaceDistance=({lineId,distanceKm,nearestPoint,nearestKind})=>({lineId,distanceKm,nearestPoint,nearestKind});
const compactCity=({id,name,country,lat,lon,timeZone,sourceIds})=>({id,name,country,lat,lon,timeZone,sourceIds});
function bound(value){const bytes=new TextEncoder().encode(JSON.stringify(value)).length;if(bytes>24576)throw new RangeError(`Compact astrocartography export uses ${bytes} bytes and exceeds24KiB; choose fewer bodies, angles or cities.`);return value;}
export function exportAstrocartography(raw){
 const s=buildAstrocartography(raw);
 const shownSourceIds=['acg-frame','acg-method','acg-radius','acg-editorial','acg-geonames','acg-geonames-license','acg-lewis','acg-angles','acg-relocation'],sources=s.sources.filter(row=>shownSourceIds.includes(row.id));
 return bound({schemaVersion:1,kind:'astrocartography-summary',inputs:s.inputs,context:s.context,bodies:s.bodies,
  lineSummaries:s.lines.map(l=>({id:l.id,bodyId:l.bodyId,angle:l.angle})),crossings:s.crossings.slice(0,12),
  cityRankings:s.cityRankings.slice(0,6).map(r=>({city:compactCity(r.city),rank:r.rank,status:r.status,score:r.score,proximityScore:r.proximityScore,withinRadiusLineCount:r.withinRadiusLineCount,nearestLines:r.nearestLines.slice(0,1).map(compactDistance)})),
  distanceMethod:DISTANCE_METHOD,scoring:s.scoring,sources:sourcesBrief(sources),limitations:[...COMPACT_LIMITS],
  scope:{renderGeometryOmitted:true,totalLines:s.lines.length,totalCrossings:s.crossings.length,shownCrossings:Math.min(12,s.crossings.length),crossingOrder:'Deterministic body/angle pair order, not importance or severity',totalCities:s.cityRankings.length,shownCities:Math.min(6,s.cityRankings.length),cityOrder:'Editorial purpose score, then proximity, then stable ID',lineIdConvention:'Body-ANGLE',nearestLinesPerShownCity:1,omittedCityFields:'Extended geographic provenance and contribution ledger remain in full study',sourceLedger:'assets/js/core/data/astrocartography-data.js',sourceCount:s.sources.length,shownSourceCount:sources.length,omittedSourceIds:s.sources.filter(row=>!shownSourceIds.includes(row.id)).map(row=>row.id)},crossingDiagnostics:s.crossingDiagnostics});
}
function compactCalendarRows(reading){
 if(!reading)return null;
 return Object.fromEntries(Object.entries(reading.frameworks).map(([id,row])=>{
  const facts=copy(row.facts);
  if(id==='lilly'&&facts.chart)facts.chart={summaryRef:'relocatedChart',scope:'Full Lilly chart/aspect rows omitted. Reading Lab uses planetary moieties, separate from the desktop uniform-orb matrix; neither matrix enters location scores.'};
  delete facts.parts;if(facts.coptic)delete facts.coptic.parts;
  return[id,{kind:row.kind,status:row.status,method:row.method,facts,sourceIds:row.sourceIds,limitations:row.limitations}];
 }));
}
export function exportAstrocartographyPlace(raw,place){
 const s=inspectAstrocartographyPlace(raw,place),primary=s.relocatedStudy?.primary;
 // Only source records directly needed to interpret the compact geometry,
 // distance, score and relocated-chart fields. Other records stay in the full
 // inspector and the explicitly named public ledger, rather than being clipped.
 const shownSourceIds=['acg-frame','acg-method','acg-radius','acg-editorial','DESKTOP-HOUSES','DESKTOP-LILLY'];
 const sources=s.sources.filter(row=>shownSourceIds.includes(row.id));
 const {sourceProfile,...context}=s.context;
 return bound({schemaVersion:1,kind:'astrocartography-place-summary',inputs:s.inputs,context,place:s.place,
  distances:s.distances.map(compactPlaceDistance),distanceMethod:DISTANCE_METHOD,
  ranking:{status:s.ranking.status,reason:s.ranking.reason,score:s.ranking.score,proximityScore:s.ranking.proximityScore,denominator:s.ranking.denominator,contributions:s.ranking.contributions.map(({lineId,planetWeight,angleWeight,proximity,normalizedPoints})=>({lineId,planetWeight,angleWeight,proximity,normalizedPoints}))},relocation:s.relocation,
  relocatedChart:primary?{dateISO:primary.dateISO,zodiac:primary.zodiac,isDay:primary.chart.isDay,sectMethod:primary.chart.sectMethod,ascendant:primary.chart.asc,midheaven:primary.chart.mc,requestedSystem:primary.requestedSystem,actualSystem:primary.actualSystem,warnings:primary.warnings,
   conditionMethod:'Canonical Lilly essential-dignity ledger for seven classical planets in the tropical zodiac; none assigned to outer planets or nodes. These conventional points and house placements do not enter the editorial proximity score.',
   bodies:primary.bodies.map(({id,longitude,house,sign,retrograde,dignity,evidence})=>({id,longitude,house,sign:sign.name,retrograde,dignity,sourceIds:[...new Set(evidence.flatMap(e=>e.sourceIds))]})),houses:primary.houses.map(({house,longitude})=>({house,longitude}))}:null,
  calendarFacts:compactCalendarRows(s.reading),sources:sourcesBrief(sources),limitations:[...COMPACT_LIMITS],
  scope:{allSelectedLineDistancesRetained:true,duplicateFieldsOmitted:['context.sourceProfile equals inputs.profile','angularDistanceDegrees equals distanceKm /6371.0088 ×180/π','contribution distance equals its named line distance; raw contribution equals normalizedPoints ×denominator/100'],lineIdConvention:'Body-ANGLE',allRelocatedBodyPositionsAndCuspsRetained:!!primary,calendarNarrativesOmitted:true,omittedCalendarFields:['Duplicate Intl formatToParts arrays','Full Lilly chart and aspect rows; method labels retained'],calendarSourceLedger:'assets/js/core/data/reading-cases.js',sourceLedger:'assets/js/core/data/astrocartography-data.js',desktopSourceLedger:'assets/js/core/desktop-workbench.js',sourceCount:s.sources.length,shownSourceCount:sources.length,omittedSourceIds:s.sources.filter(row=>!shownSourceIds.includes(row.id)).map(row=>row.id),omittedDesktopFields:['aspect matrix','per-body source prose'],fullInspectorAvailable:true}});
}
