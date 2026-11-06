// Complete bounded daily ledgers over canonical clock, calendar and map engines.
import { normalizeCalendarTimelineRequest, buildCalendarTimelineGrid, CALENDAR_TIMELINE_SOURCES } from './calendar-timeline.js';
import { SEARCH_CRITERIA_CATALOG, CALENDAR_SEARCH_SOURCES, normalizeCalendarSearchCriteria, buildCalendarSearchSample, evaluateCalendarSearchSample } from './calendar-search.js';
import { ATLAS_VARIANTS } from './calendar-atlas.js';
import { ASTROCARTOGRAPHY_BODY_IDS, ASTROCARTOGRAPHY_ANGLE_IDS, getAstrocartographyBodyPositions, lineGeometryForBody, distanceToAstrocartographyLine } from './astrocartography.js';
import { ASTROCARTOGRAPHY_SOURCES } from './data/astrocartography-data.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { analyzeTimelineStatistics, TIMELINE_STATISTICS_SOURCES } from './timeline-statistics.js';

export const TIMELINE_SEARCH_LIMITS = Object.freeze({ maxDays: 3660, maxCriteria: 8, minYear: 1900, maxYear: 2100, maxSeries: 10, maxCriteriaBytes:16384, maxRequestBytes:32768, maxLedgerBytes:67108864 });
export const TIMELINE_SEARCH_CALENDARS = Object.freeze(SEARCH_CRITERIA_CATALOG.calendars.map(({id}) => {
  const variant = ATLAS_VARIANTS.find(v => v.id === id);
  return Object.freeze({ id, label: variant.label, familyId: variant.familyId });
}));
const DAY = 86400000;
const copy = value => JSON.parse(JSON.stringify(value));
const now = () => globalThis.performance?.now?.() ?? Date.now();
const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;
const LIMITATIONS = [
  'One explicit observer-local clock is sampled on each civil date. Daily scans can miss short angular-line visits, transitions, extrema and multiple changes between samples. They are not continuous event searches.',
  'Calendar labels are named civil conventions, not outcome votes. Rule classifications retain their named sources and shared dependencies; astrology has no demonstrated predictive validity.',
  'A fixed map preserves one explicitly supplied instant and cannot reveal changing date-specific lines. Transit mode recalculates angular geometry at each sample. Neither mode infers a birth time, national chart, event outcome or favorable place.',
  'Map distances are shortest spherical distances to closed angular semicircles, including endpoints; grazing endpoints are not ordinary rising, setting or meridian events. All forty distances remain inspectable; selected body/angle filters affect matching and statistical series only.',
  'Civil labels use this runtime’s Intl/ICU calendar and IANA zone data, including projected future rules. Existing selected fixtures do not establish full-range accuracy or community authority. Gregorian/Julian, Hebrew civil-midnight, Chinese lunisolar, Coptic and Indian national Saka retain their distinct conventions.',
  'Map positions use the inherited true-equator/equinox-of-date astronomical engine; calendar/lunar rule facts use the inherited classical chart engine. These are distinct approximations, not independent corroboration or a claim of identical ephemerides.',
  'Complete rows, including gaps, folds and unsupported UTC boundary clocks, are retained. Missing observations remain null in statistical series and are not zero-valued nonmatches.',
  'Statistics compare selected computed series within this sampled window. Shared astronomical inputs, serial dependence, daily aliasing and post-selection can produce associations. No external event outcomes or forecast model are tested.',
  'Only requested named rules are calculated in optimized mode. Timeline chart/star/guidance display preferences are retained for selected-frame replay; they do not change selected search criteria or add stars, charts or nearby event searches to this ledger.',
  'Criteria definitions occur once in request.criteria; row criterion results reference those definitions by stable ID. The complete compact JSON ledger is capped at 64 MiB; oversized calculations fail explicitly without presenting truncated rows as a completed scan.',
];
const METHOD_SOURCE = Object.freeze({ id:'TS-METHOD',title:'Bounded timeline search composition',url:'assets/js/core/timeline-search.js',claimType:'project-methods',readingDepth:'Canonical implementation and inherited qualified sources; no new historical-source reading or outcome validation.',source:'Project-authored timeline-search.js, bounded daily composition and distance-filter contract.' });
function sources() { return copy([...new Map([...CALENDAR_TIMELINE_SOURCES,...CALENDAR_SEARCH_SOURCES,...ASTROCARTOGRAPHY_SOURCES,...TIMELINE_STATISTICS_SOURCES,METHOD_SOURCE].map(s=>[s.id,s])).values()]); }
function plain(value, keys, label, required=[]) {
  if (!value || typeof value !== 'object' || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw new TypeError(label+' must be a plain JSON object.');
  const out = Object.create(null);
  for (const key of Reflect.ownKeys(value)) {
    const d = Object.getOwnPropertyDescriptor(value,key);
    if (typeof key !== 'string' || !keys.includes(key) || !d.enumerable || !Object.hasOwn(d,'value')) throw new TypeError('Unknown, hidden or accessor '+label+' field.');
    out[key] = d.value;
  }
  for (const key of required) if (!Object.hasOwn(out,key)) throw new TypeError(label+' requires explicit '+key+'.');
  return out;
}
function array(value, max, label, min=0) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value)!==Array.prototype) throw new TypeError(label+' must be an ordinary JSON array.');
  const length = Object.getOwnPropertyDescriptor(value,'length').value;
  if (length<min || length>max || Reflect.ownKeys(value).length!==length+1) throw new RangeError('Invalid '+label+' length or fields.');
  const result=[];
  for(let i=0;i<length;i++) { const d=Object.getOwnPropertyDescriptor(value,String(i)); if(!d || !d.enumerable || !Object.hasOwn(d,'value')) throw new TypeError(label+' must have dense ordinary data entries.'); result.push(d.value); }
  return result;
}
function choices(value, allowed, label) {
  if(value===undefined) return [...allowed];
  const result=array(value,allowed.length,label,1);
  if(result.some(v=>typeof v!=='string'||!allowed.includes(v)) || new Set(result).size!==result.length) throw new RangeError('Choose distinct supported '+label+'.');
  return allowed.filter(v=>result.includes(v));
}
function criteria(value) {
  const rows=array(value===undefined?[]:value,8,'criteria');
  const safe=rows.map(raw=>{
    const c=plain(raw,['kind','ruleId','classifications','values','calendar','field'],'criterion',['kind']);
    const keys = c.kind==='rule'?['kind','ruleId','classifications']:c.kind==='weekday'?['kind','values']:c.kind==='calendar'?['kind','calendar','field','values']:c.kind==='lunar'?['kind','field','values']:null;
    if(!keys || Object.keys(c).some(k=>!keys.includes(k)) || keys.some(k=>!Object.hasOwn(c,k))) throw new RangeError('Use exactly the fields of a supported criterion.');
    const field=c.kind==='rule'?'classifications':'values';
    c[field]=array(c[field],c.kind==='rule'?4:60,'criterion values',1);
    for(const key of keys.filter(k=>k!==field)) if(typeof c[key]!=='string') throw new TypeError('Criterion identifiers must be strings.');
    if(c[field].some(v=>!['number','string'].includes(typeof v))) throw new TypeError('Criterion values must be primitive numbers or strings.');
    return c;
  });
  return normalizeCalendarSearchCriteria(safe);
}
function mapRequest(raw) {
  const m=plain(raw===undefined?{mode:'none'}:raw,['mode','fixedInstantISO','bodyIds','angleIds','maxDistanceKm','minimumLines'],'map',['mode']);
  if(!['none','transit','fixed'].includes(m.mode)) throw new RangeError('Choose none, transit or fixed map mode.');
  if(m.mode==='none') { if(Object.keys(m).length!==1) throw new RangeError('Disabled map has only its mode.'); return {mode:'none'}; }
  const bodyIds=choices(m.bodyIds,ASTROCARTOGRAPHY_BODY_IDS,'map bodies'),angleIds=choices(m.angleIds,ASTROCARTOGRAPHY_ANGLE_IDS,'map angles');
  const maxDistanceKm=m.maxDistanceKm===undefined?500:m.maxDistanceKm,minimumLines=m.minimumLines===undefined?1:m.minimumLines;
  if(typeof maxDistanceKm!=='number'||!Number.isFinite(maxDistanceKm)||maxDistanceKm<1||maxDistanceKm>3000) throw new RangeError('Map radius must be a finite number from 1 through 3000 km.');
  if(!Number.isInteger(minimumLines)||minimumLines<1||minimumLines>bodyIds.length*angleIds.length) throw new RangeError('Minimum lines must be within the selected body/angle set.');
  const result={mode:m.mode,bodyIds,angleIds,maxDistanceKm,minimumLines};
  if(m.mode==='fixed') {
    if(!Object.hasOwn(m,'fixedInstantISO') || typeof m.fixedInstantISO!=='string') throw new TypeError('Fixed geometry requires an explicit known instant.');
    const date=parseExplicitInstant(m.fixedInstantISO);
    if(date.getUTCFullYear()<1900||date.getUTCFullYear()>2100) throw new RangeError('Fixed map instant must be within UTC years 1900–2100.');
    result.fixedInstantISO=date.toISOString();
  } else if(Object.hasOwn(m,'fixedInstantISO')) throw new RangeError('Only fixed mode accepts fixedInstantISO.');
  return result;
}
export function normalizeTimelineSearchRequest(raw) {
  const r=plain(raw,['timeline','calendarIds','criteria','map','mode'],'timeline search',['timeline']);
  // Canonical timeline normalization validates every descriptor before access.
  const timeline=normalizeCalendarTimelineRequest(r.timeline);
  if(!Object.hasOwn(r.timeline,'disambiguation')) throw new TypeError('An explicit repeated-clock policy is required.');
  const calendarIds=choices(r.calendarIds,TIMELINE_SEARCH_CALENDARS.map(c=>c.id),'calendars'),selectedCriteria=criteria(r.criteria),map=mapRequest(r.map),mode=r.mode===undefined?'optimized':r.mode;
  if(!['optimized','brute'].includes(mode)) throw new RangeError('Choose optimized or brute evaluation.');
  if(selectedCriteria.some(c=>c.kind==='calendar'&&!calendarIds.includes(c.calendar))) throw new RangeError('A calendar criterion must reference a selected calendar.');
  const request={timeline,calendarIds,criteria:selectedCriteria,map,mode};
  if(bytes(selectedCriteria)>TIMELINE_SEARCH_LIMITS.maxCriteriaBytes||bytes(request)>TIMELINE_SEARCH_LIMITS.maxRequestBytes) throw new RangeError('Use at most 16 KiB of criterion definitions and 32 KiB for the normalized request.');
  return request;
}
const totalDays = request => Math.round((Date.parse(request.timeline.endDate+'T00:00:00Z')-Date.parse(request.timeline.startDate+'T00:00:00Z'))/DAY)+1;
const initialStats = () => ({calendarComparisons:0,guidanceCalls:0,mapPositionCalls:0,lineDistanceCalls:0,fixedMapCacheHits:0,processed:0,elapsedMs:0});
function mapAt(request,dateISO,stats) {
  const m=request.map,sky=getAstrocartographyBodyPositions(dateISO); stats.mapPositionCalls++;
  const geometry=sky.bodies.map(body=>lineGeometryForBody(body,sky.gastDegrees,{render:false}));
  const distances=geometry.flatMap(g=>g.lines).map(line=>{
    stats.lineDistanceCalls++;
    const {method,...distance}=distanceToAstrocartographyLine(line,request.timeline);
    return distance;
  });
  const selected=distances.filter(d=>m.bodyIds.includes(d.bodyId)&&m.angleIds.includes(d.angle));
  const available=selected.length===m.bodyIds.length*m.angleIds.length;
  const selectedNearCount=available?selected.filter(d=>d.distanceKm<=m.maxDistanceKm).length:null;
  return {mode:m.mode,geometryInstantISO:sky.dateISO,available,distances,selectedNearCount,closestSelectedDistanceKm:available?Math.min(...selected.map(d=>d.distanceKm)):null,matched:available&&selectedNearCount>=m.minimumLines,warnings:geometry.flatMap(g=>g.warnings)};
}
function compactCalendar(c) { return {id:c.id,text:c.text??'',status:c.status,parts:copy(c.parts??[]),validation:c.validation??null,boundary:c.boundary??null,reason:c.reason??null,sourceIds:copy(c.sourceIds??[])}; }
function calculateRow(request,slot,stats,fixedMap) {
  const ruleIds=request.criteria.filter(c=>c.kind==='rule').map(c=>c.ruleId);
  let sample={date:slot.localDate,status:slot.status,calendars:[],lunar:null,rules:[],ruleCounts:[]};
  if(slot.status==='available') {
    const t=request.timeline,includeRules=request.mode==='brute'||ruleIds.length>0;
    const input={dateISO:slot.selectedDateISO,lat:t.lat,lon:t.lon,timeZone:t.timeZone,system:t.system,prayerMethod:t.prayerMethod,asr:t.asr,highLatitude:t.highLatitude};
    sample=buildCalendarSearchSample(slot.localDate,input,{includeRules});
    stats.calendarComparisons+=includeRules?2:1; if(includeRules) stats.guidanceCalls++;
  }
  const evaluated=evaluateCalendarSearchSample(sample,request.criteria);
  let map=null;
  if(slot.status==='available'&&request.map.mode!=='none') {
    if(fixedMap) { map=copy(fixedMap); stats.fixedMapCacheHits++; }
    else map=mapAt(request,request.map.mode==='fixed'?request.map.fixedInstantISO:slot.selectedDateISO,stats);
  }
  return {index:slot.index,date:slot.localDate,status:slot.status,slot:copy(slot),sampleUTC:slot.status==='available'?slot.selectedDateISO:null,
    calendars:slot.status==='available'?sample.calendars.filter(c=>request.calendarIds.includes(c.id)).map(compactCalendar):request.calendarIds.map(id=>({id,text:'',status:'unavailable',parts:[],validation:null,boundary:null,reason:slot.reason,sourceIds:[]})),
    lunar:sample.lunar,astronomy:slot.status==='available'?{moonSunElongation:sample.astronomy.moonSunElongation,phaseLabel:sample.astronomy.phaseLabel,moonIlluminatedFraction:sample.astronomy.moonIlluminatedFraction??null}:null,
    rules:sample.rules.filter(r=>ruleIds.includes(r.ruleId)),criteriaResults:evaluated.criteriaResults.map(({criterion,...result})=>result),map,
    matched:evaluated.matched&&(request.map.mode==='none'||map?.matched===true),fullyObserved:evaluated.fullyObserved&&(request.map.mode==='none'||map?.available===true)};
}
function seriesFor(request,rows) {
  const series=request.criteria.map((criterion,index)=>{
    const first=rows[0].criteriaResults[index],rule=SEARCH_CRITERIA_CATALOG.rules.find(r=>r.ruleId===criterion.ruleId);
    const dependencyGroup=rule?.dependencyGroup??(criterion.kind==='lunar'?SEARCH_CRITERIA_CATALOG.lunar.find(l=>l.field===criterion.field).dependencyGroup:'civil-calendar');
    return {id:first.id,label:rule?.title??first.id,kind:'binary',dependencyGroup,values:rows.map(row=>{const c=row.criteriaResults[index];return c.available?Number(c.matched):null;})};
  });
  if(request.map.mode!=='none') {
    series.push({id:'map:near-count',label:'Selected angular lines within radius',kind:'continuous',dependencyGroup:'angular-map-geometry',values:rows.map(row=>row.map?.selectedNearCount??null)});
    series.push({id:'map:closest-distance',label:'Closest selected angular line distance (km)',kind:'continuous',dependencyGroup:'angular-map-geometry',values:rows.map(row=>row.map?.closestSelectedDistanceKm??null)});
  }
  return series;
}
function abort(hooks) { if(hooks.shouldCancel?.()||hooks.signal?.aborted) { const e=new Error('Timeline search cancelled.'); e.name='AbortError';e.code='CANCELLED';throw e; } }
async function checkpoint(hooks,progress) { abort(hooks);hooks.onProgress?.(progress);await(hooks.yieldControl?.()??new Promise(resolve=>setTimeout(resolve,0)));abort(hooks); }
function runtime() { return typeof process!=='undefined'&&process.versions?{environment:'node',node:process.versions.node,icu:process.versions.icu,tz:process.versions.tz}:{environment:'browser',calendarEngine:'This runtime’s Intl/ICU and IANA data'}; }
const mapMethod={lineCount:40,bodyCount:10,angleCount:4,displaySegmentsCalculated:false,crossingsCalculated:false,cityRankingsCalculated:false,method:'Canonical true-equator/equinox-of-date angular semicircles; shortest spherical distance including endpoints',timeConvention:'The inherited Astronomy Engine uses civil UTC as its UT proxy and estimates TT using its internal Delta-T model. No DUT1/EOP or future leap-second solution is supplied; output digits do not imply arcsecond civil-time ground-track accuracy.',lunarPosition:'The bundled Moon uses the geocentric GeoMoon shortcut before EQD precession/nutation; it does not use the other bodies’ full light-time/backdating and aberration path.',fixedMap:'One immutable source instant; date changes cannot move its lines',transitMap:'Each available explicit daily sample supplies a different geometry instant'};
export async function buildTimelineSearch(raw,hooks={}) {
  const started=now(),request=normalizeTimelineSearchRequest(raw),stats=initialStats(),total=totalDays(request);
  const counts={total,processed:0,available:0,ambiguous:0,unavailable:0,matched:0,fullyObserved:0};
  await checkpoint(hooks,{phase:'grid',...counts});
  const grid=buildCalendarTimelineGrid(request.timeline),rows=[];let rowBytes=bytes(request);
  await checkpoint(hooks,{phase:'samples',...counts});
  const fixedMap=request.map.mode==='fixed'&&request.mode==='optimized'?mapAt(request,request.map.fixedInstantISO,stats):null;
  for(const slot of grid.slots) {
    abort(hooks);
    const row=calculateRow(request,slot,stats,fixedMap);rowBytes+=bytes(row)+1;
    if(rowBytes>TIMELINE_SEARCH_LIMITS.maxLedgerBytes) throw new RangeError('The complete scan exceeds the 64 MiB ledger budget. Choose a shorter range or fewer calendars/rules; no partial result is returned.');
    rows.push(row);counts[row.status]++;counts.processed++;if(row.matched)counts.matched++;if(row.fullyObserved)counts.fullyObserved++;stats.processed++;
    if(counts.processed%8===0||counts.processed===total) await checkpoint(hooks,{phase:'samples',...counts});
  }
  const series=seriesFor(request,rows);
  const statistics=await analyzeTimelineStatistics(series,{sampleTimesISO:rows.map(r=>r.sampleUTC),signal:{get aborted(){return Boolean(hooks.shouldCancel?.()||hooks.signal?.aborted);}},onProgress:progress=>{abort(hooks);hooks.onProgress?.({phase:'statistics',...counts,statistics:progress});},yieldControl:async()=>{abort(hooks);await(hooks.yieldControl?.()??new Promise(resolve=>setTimeout(resolve,0)));abort(hooks);}});
  abort(hooks);stats.elapsedMs=now()-started;
  const result={schemaVersion:1,kind:'timeline-search-ledger',request,rows,counts,series,statistics,mapMethod:copy(mapMethod),sampling:copy(grid.sampling),runtime:runtime(),sources:sources(),limitations:[...LIMITATIONS],stats};
  if(bytes(result)>TIMELINE_SEARCH_LIMITS.maxLedgerBytes) throw new RangeError('The complete ledger with statistics exceeds 64 MiB. Choose a shorter range or fewer calendars/rules; no partial result is returned.');
  hooks.onProgress?.({phase:'complete',...counts});abort(hooks);return result;
}
/** Fresh selected-date calculation: validates the full request but resolves one
 * clock only. No full scan, statistical comparison or untrusted result replay. */
export function buildTimelineSearchDate(raw,index) {
  const request=normalizeTimelineSearchRequest(raw);
  if(!Number.isInteger(index)||index<0||index>=totalDays(request)) throw new RangeError('Select an index inside the timeline.');
  const date=new Date(Date.parse(request.timeline.startDate+'T00:00:00Z')+index*DAY).toISOString().slice(0,10);
  const slot=buildCalendarTimelineGrid({...request.timeline,startDate:date,endDate:date}).slots[0];slot.index=index;
  const stats=initialStats(),row=calculateRow(request,slot,stats,null);stats.processed=1;
  return {schemaVersion:1,kind:'timeline-search-date',request,index,row,mapMethod:copy(mapMethod),sources:sources(),limitations:[...LIMITATIONS],stats};
}
function ledger(result) { if(result?.schemaVersion!==1||result?.kind!=='timeline-search-ledger'||!Array.isArray(result.rows)||result.rows.length<1||result.rows.length>3660) throw new TypeError('Use a completed timeline search ledger.');return result; }
/** Serialization/inspection only; supplied result objects are not authenticated. */
export function getTimelineSearchDate(result,index) { ledger(result);if(!Number.isInteger(index)||index<0||index>=result.rows.length)throw new RangeError('Select an index inside the held ledger.');return copy(result.rows[index]); }
export function serializeTimelineSearchJSON(result) { ledger(result);return JSON.stringify(result)+'\n'; }
function csvCell(value) { let s=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);if(typeof value!=='number'&&/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'; }
export function serializeTimelineSearchCSV(result) {
  ledger(result);const rows=[['record','index','date','id','value'],['request','','','',result.request],['sampling','','','',result.sampling],['runtime','','','',result.runtime],['counts','','','',result.counts],['map-method','','','',result.mapMethod]];
  for(const row of result.rows) {
    const {calendars,rules,criteriaResults,map,...context}=row;rows.push(['sample',row.index,row.date,'',context]);
    for(const c of calendars)rows.push(['calendar',row.index,row.date,c.id,c]);
    for(const rule of rules)rows.push(['rule',row.index,row.date,rule.ruleId,rule]);
    for(const c of criteriaResults)rows.push(['criterion',row.index,row.date,c.id,c]);
    if(map){const {distances,...summary}=map;rows.push(['map',row.index,row.date,'',summary]);for(const d of distances)rows.push(['line-distance',row.index,row.date,d.lineId,d]);}
  }
  rows.push(['series','','','',result.series],['statistics','','','',result.statistics]);
  for(const s of result.sources)rows.push(['source','','',s.id,s]);
  for(const limit of result.limitations)rows.push(['limitation','','','',limit]);
  return rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
