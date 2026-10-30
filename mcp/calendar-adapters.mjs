// Explicit remote contracts for eight existing Jyotisha/calendar calculators.
// No chart objects, saved records, automatic current time or provider calls.
import { REGISTRY } from '../assets/js/core/registry.js';
import { parseExplicitInstant } from '../assets/js/core/instant-boundary.js';
import { validateLocation, validateZone } from '../assets/js/core/cultural-calendars.js';
import { castChart } from '../assets/js/core/astro.js';
import { castVedic } from '../assets/js/core/vedic.js';
import { buildSubLordTable, subLordOf, kpForNumber, kpSignificators, KP_FLAGS } from '../assets/js/core/kp.js';
import { prasnaJudgement } from '../assets/js/core/prasna.js';
import { ARUDHA_DIRECTIONS } from '../assets/js/core/data/prasna-data.js';
import { muhurtaReport, scanDay } from '../assets/js/core/muhurta.js';
import { shatkarmanScreen } from '../assets/js/core/abhichara.js';
import { SHATKARMAN } from '../assets/js/core/data/abhichara-data.js';
import { varshaphala } from '../assets/js/core/tajika.js';
import { tithiPravesha, monthlyPravesha } from '../assets/js/core/tithi-pravesha.js';
import { ashtakuta, porutham10 } from '../assets/js/core/kuta.js';
import { scanMoments, DEFAULT_OPERATION_KEY } from '../assets/js/core/moments.js';
import { OPERATIONS } from '../assets/js/core/election.js';

const copy = value => JSON.parse(JSON.stringify(value));
const text = maxLength => ({ type:'string', maxLength });
const enumeration = values => ({ type:'string', enum:values });
const number = (minimum, maximum) => ({ type:'number', minimum, maximum });
const integer = (minimum, maximum) => ({ type:'integer', minimum, maximum });
const object = (properties, required = []) => ({ type:'object', properties, required, additionalProperties:false });
const instant = { ...text(40), description:'Explicit ISO date-time with Z or offset; selected UTC and civil years 1900–2100. Unknown time is not inferred.' };
const observer = { dateISO:instant, lat:number(-90,90), lon:number(-180,180), timeZone:{...text(120),minLength:1} };
const OBSERVER_KEYS = ['dateISO','lat','lon','timeZone'];
const LMT_NOTE = 'This inherited calculator uses longitude/15 local-mean-solar weekday conventions. The supplied IANA zone labels the context only; it does not override the calculator’s timing convention. Near the date line it may differ from the civil-zone weekday.';
const BASE_LIMITS = [
  'These are named historical or modern-lineage calculations, not validated predictions, recommendations or proof of cultural authority.',
  'Sources and disputed conventions are inherited from the cited canonical modules; this adapter does not claim a new primary-text collation.',
  'Only explicit request inputs are used. Birth or question inputs sent by the caller may be retained by their MCP client/provider; no browser records are read.',
];

function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw new TypeError(path+' must be a JSON object.');
    for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties,key)) throw new TypeError('Unknown '+path+'.'+key+'.');
    for (const key of schema.required) if (!Object.hasOwn(value,key)) throw new TypeError('Missing '+path+'.'+key+'.');
    for (const [key,item] of Object.entries(value)) validate(schema.properties[key],item,path+'.'+key);
    return;
  }
  if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(path+' has the wrong type.');
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError('Unsupported '+path+'.');
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(path+' is outside the supported range.');
  if (typeof value === 'string' && (value.length > (schema.maxLength ?? 2000) || value.length < (schema.minLength ?? 0))) throw new RangeError(path+' is outside the supported text length.');
}

function moment(args) {
  for (const key of OBSERVER_KEYS) if (args[key] === undefined) throw new TypeError('Supply '+key+' explicitly.');
  const date = parseExplicitInstant(args.dateISO), year = date.getUTCFullYear();
  if (year < 1900 || year > 2100) throw new RangeError('These calendar adapters support UTC years 1900–2100.');
  validateLocation(args.lat,args.lon); const timeZone = validateZone(args.timeZone);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
  if (+parts.year < 1900 || +parts.year > 2100) throw new RangeError('The selected-zone civil year must also be 1900–2100.');
  return { dateISO:date.toISOString(), lat:args.lat, lon:args.lon, timeZone, localDate:`${parts.year}-${parts.month}-${parts.day}`, localTime:`${parts.hour}:${parts.minute}:${parts.second}` };
}

function chartFor(context) {
  if (Math.abs(context.lat) === 90) throw new RangeError('Chart angles are undefined at an exact geographic pole; use a nonpolar observer.');
  return { ...castChart(new Date(context.dateISO),context.lat,context.lon,'whole'), timeZone:context.timeZone };
}
const vedicFor = context => castVedic(chartFor(context),{currentDate:new Date(context.dateISO)});
function needOnly(args, allowed, required) {
  for (const key of Object.keys(args)) if (!allowed.includes(key)) throw new RangeError(key+' is not used by this selected mode.');
  for (const key of required) if (args[key] === undefined) throw new TypeError('Supply '+key+' for this selected mode.');
}
function annualYear(birth, year) {
  const birthYear = new Date(birth.dateISO).getUTCFullYear();
  if (year < 1901 || year > 2099 || year <= birthYear || year > birthYear + 150) throw new RangeError('Choose a return year 1901–2099, after the birth year and within 150 years. The outer years reserve the solver’s cross-year search buffer.');
}
function response(id, context, result, methods = {}, extra = {}) {
  const entry = REGISTRY.find(row=>row.id===id);
  return { capabilityId:id, status:result?.error ? 'unavailable' : 'calculated', context, result, methods,
    source:entry.citation, sourceStatus:'Inherited canonical implementation and source records; no new historical or predictive validation.',
    limitations:BASE_LIMITS.slice(), ...extra };
}
function define(name,id,description,inputSchema,calculate) {
  return { name,description,inputSchema,calculate:args=>{
    validate(inputSchema,args); const value=calculate(args), serialized=JSON.stringify(value);
    if (new TextEncoder().encode(serialized).length > 1200000) throw new RangeError('Calendar result exceeds the 1.2 MB response bound; narrow the request.');
    // JSON clone prevents a client mutating the canonical memoized KP table and
    // makes dates explicit ISO strings across HTTP/stdio rather than live Dates.
    return JSON.parse(serialized);
  } };
}

export const CALENDAR_MCP_TOOLS = [
  define('workbench_kp','kp-sublords','Inspect the exact 249-row KP subdivision table, a supplied sidereal longitude, an explicit horary number or freshly computed chart significators. The chart uses the existing Lahiri/whole-sign/mean-node approximation, not full KP Placidus/true-node equivalence. No chart or number is inferred.',
    object({mode:enumeration(['table','longitude','horary-number','chart']),siderealLongitude:number(0,360),horaryNumber:integer(1,249),...observer},['mode']),args=>{
      let context={},result;
      if(args.mode==='table'){needOnly(args,['mode'],['mode']);result={table:buildSubLordTable(),flags:KP_FLAGS};}
      if(args.mode==='longitude'){needOnly(args,['mode','siderealLongitude'],['siderealLongitude']);context={siderealLongitude:args.siderealLongitude,inputProvenance:'Caller-supplied angular coordinate; not an independently computed chart.'};result=subLordOf(args.siderealLongitude);}
      if(args.mode==='horary-number'){needOnly(args,['mode','horaryNumber'],['horaryNumber']);context={horaryNumber:args.horaryNumber,inputProvenance:'Explicit caller-selected number; no random or model-selected number.'};result=kpForNumber(args.horaryNumber);}
      if(args.mode==='chart'){needOnly(args,['mode',...OBSERVER_KEYS],OBSERVER_KEYS);context=moment(args);result=kpSignificators(vedicFor(context));}
      return response('kp-sublords',context,result,{mode:args.mode,ayanamsha:'Canonical linear Lahiri estimate for computed charts; the abstract table is frame-partition arithmetic.',houseConvention:'Whole-sign approximation in chart mode; not KP Placidus cusps.'});
    }),
  define('workbench_prasna','prasna','Calculate the existing source-labelled Praśna rule ledger from an explicit moment and whole-sign sidereal chart. Optional horary number/direction must be supplied. Counts are historical testimonies, never an answer, probability or real-world recommendation.',
    object({...observer,quesitedHouse:integer(1,12),kpNumber:integer(1,249),direction:enumeration(Object.keys(ARUDHA_DIRECTIONS)),question:text(1000)},OBSERVER_KEYS),args=>{
      const context=moment(args),result=prasnaJudgement(vedicFor(context),{quesitedHouse:args.quesitedHouse??7,kpNumber:args.kpNumber,direction:args.direction,question:args.question??''});
      return response('prasna',context,result,{houseConvention:'Sidereal whole-sign; explicit KP number can override the lagna using the canonical sub-arc-start convention.',ayanamsha:'Linear Lahiri estimate; mean nodes',quesitedHouse:args.quesitedHouse??7,referenceDateISO:context.dateISO});
    }),
  define('workbench_muhurta','muhurta','Calculate the complete inherited 30-slot Muhūrta day, avoided-kāla tables, instantaneous Pañcāṅga screens and optional overlap timeline. Uses the existing local-mean-solar weekday; IANA zone is display context only. Unresolved opening-portion rules are not safe/unsafe interval predictions.',
    object({...observer,includeTimeline:{type:'boolean'}},OBSERVER_KEYS),args=>{
      const context=moment(args),result=muhurtaReport(new Date(context.dateISO),context.lat,context.lon);
      const out=response('muhurta',context,{report:result,...(args.includeTimeline?{timeline:scanDay(new Date(context.dateISO),context.lat,context.lon)}:{})},
        {clockConvention:LMT_NOTE,includeTimeline:args.includeTimeline===true,openingPortionRules:'Some inherited yoga screens concern opening portions; no limb-boundary time is calculated, so applicability at this instant is unresolved.'},
        {status:result.error?'unavailable':'calculated',...(result.error?{unavailableReason:result.error}:{})});
      out.limitations.push(LMT_NOTE,'Legacy civilUTCVara/differsFromCivilUTC labels predate a canonical Vedic change: their values now come from the same no-IANA, mean-solar sunrise-day convention, not an independent UTC weekday. Do not interpret those legacy field names as a UTC comparison.');
      return out;
    }),
  define('workbench_shatkarman','shatkarman','Read the existing Ṣaṭkarman historical timing/correspondence record for one explicitly selected act and moment. Read-only cultural description; no instructions, ritual execution, efficacy claim or recommendation. Conflicting timing schemes remain visible and polar intervals unavailable.',
    object({...observer,act:enumeration(SHATKARMAN.map(act=>act.key))},[...OBSERVER_KEYS,'act']),args=>{
      const context=moment(args),result=shatkarmanScreen(new Date(context.dateISO),context.lat,context.lon,args.act);
      return response('shatkarman',context,result,{clockConvention:LMT_NOTE,voice:'Historical descriptions only; not a request to perform an act or a recommendation.'},{...(result.error?{unavailableReason:result.error}:{})});
    }),
  define('workbench_tajika','tajika-varshaphala','Calculate the existing Tājika sidereal solar return, annual chart, munthā, year-lord dispute, aspects, yogas and sahams from an explicit known birth instant. Target 1901–2099 after birth year, at most 150 years; optional explicit relocated observer. No unknown birth time or pre-birth return is inferred.',
    object({birth:object(observer,OBSERVER_KEYS),targetYear:integer(1901,2099),annualObserver:object({lat:observer.lat,lon:observer.lon,timeZone:observer.timeZone},['lat','lon','timeZone'])},['birth','targetYear']),args=>{
      const birth=moment(args.birth);annualYear(birth,args.targetYear);
      const target=args.annualObserver?{lat:args.annualObserver.lat,lon:args.annualObserver.lon,timeZone:validateZone(args.annualObserver.timeZone)}:{lat:birth.lat,lon:birth.lon,timeZone:birth.timeZone};validateLocation(target.lat,target.lon);
      if(Math.abs(target.lat)===90)throw new RangeError('Annual chart angles are undefined at an exact pole.');
      const result=varshaphala(chartFor(birth),args.targetYear,{lat:target.lat,lon:target.lon});
      const returned=moment({...target,dateISO:result.varshaPravesha.instantISO});
      return response('tajika-varshaphala',{birth,annual:returned,targetYear:args.targetYear},result,{ayanamsha:'Canonical linear Lahiri study model, not Balabhadra’s historical constants',houseConvention:'Sidereal whole-sign',relocation:args.annualObserver?'Explicit annual observer':'Birthplace',clockConvention:'Zone labels the output; the inherited return solver and whole-sign geometry use absolute instants. Internal tradition-specific clock limitations remain unchanged.'});
    }),
  define('workbench_tithi_pravesha','tithi-pravesha','Compute an annual solar/soli-lunar tithi return or 1–12 monthly returns from an explicit known birth. Preserve all annual candidates and ambiguity. Modern Rath/Rao lineage, not a classical BPHS rule. Annual target 1901–2099 after birth year; same birthplace. Internal weekday is UTC and hora uses mean-solar convention, explicitly distinct from civil-zone labels.',
    object({birth:object(observer,OBSERVER_KEYS),mode:enumeration(['annual','monthly']),targetYear:integer(1901,2099),monthRule:enumeration(['solar','soliLunar']),fromISO:instant,months:integer(1,12)},['birth','mode']),args=>{
      const birth=moment(args.birth),chart=chartFor(birth);let result;
      if(args.mode==='annual'){
        needOnly(args,['birth','mode','targetYear','monthRule'],['targetYear']);annualYear(birth,args.targetYear);
        result=tithiPravesha(chart,args.targetYear,{monthRule:args.monthRule??'solar'});
        moment({...birth,dateISO:result.match.instantISO});
      }else{
        needOnly(args,['birth','mode','fromISO','months'],['fromISO']);
        const from=parseExplicitInstant(args.fromISO),months=args.months??12;
        if(from<new Date(birth.dateISO))throw new RangeError('Monthly return search cannot begin before birth.');
        moment({...birth,dateISO:from.toISOString()});
        const end=new Date(from.getTime()+(months+1)*30.6*86400000);moment({...birth,dateISO:end.toISOString()});
        result=monthlyPravesha(chart,from,months);
      }
      const partial=result.ambiguity?.flag===true||(args.mode==='monthly'&&result.count!==(args.months??12));
      return response('tithi-pravesha',{birth,...(args.mode==='annual'?{targetYear:args.targetYear}:{fromISO:parseExplicitInstant(args.fromISO).toISOString()})},result,
        {mode:args.mode,monthRule:args.mode==='annual'?args.monthRule??'solar':'solar',houseConvention:'Whole-sign at birthplace',clockConvention:'Canonical annual weekdayLord is UTC civil weekday (not sunrise vāra); hora and internal Pañcāṅga use no-IANA mean-solar conventions. Supplied zone is birth/output context only.',searchWindow:'Monthly search includes the canonical (months+1)×30.6-day buffer; only requested returns are emitted.'},
        {status:partial?'partial':'calculated',...(partial?{unresolvedReason:result.ambiguity?.reason??'Fewer return events were found than requested.'}:{})});
    }),
  define('workbench_kuta','kuta-matching','Calculate the named aṣṭakūṭa and/or ten-porutham historical tables from two explicitly known birth instants and canonical sidereal Moons. Preserve source-specific groom/bride orientation and contested variants. Scores are not relationship compatibility, personal value or advice; missing Sagittarius-table completion stays unavailable.',
    object({groom:object(observer,OBSERVER_KEYS),bride:object(observer,OBSERVER_KEYS),method:enumeration(['ashtakuta','porutham10','both']),variantSet:enumeration(['saravali','common']),vashyaSagCompletion:{type:'boolean'}},['groom','bride']),args=>{
      const groom=moment(args.groom),bride=moment(args.bride),groomMoon=vedicFor(groom).grahas.Moon.lon,brideMoon=vedicFor(bride).grahas.Moon.lon;
      const method=args.method??'both';if(method==='porutham10'&&args.variantSet!==undefined)throw new RangeError('variantSet applies to aṣṭakūṭa only; omit it for porutham10.');
      const opts={variantSet:args.variantSet??'saravali',vashyaSagCompletion:args.vashyaSagCompletion??true},result={},unavailable=[];
      for(const [key,fn] of [['ashtakuta',ashtakuta],['porutham10',porutham10]])if(method==='both'||method===key){
        try{result[key]=fn(groomMoon,brideMoon,opts);}catch(error){if(!error.message.includes('Sagittarius Moon is unclassifiable'))throw error;result[key]=null;unavailable.push({method:key,reason:error.message});}
      }
      const calculated=Object.values(result).filter(Boolean).length;
      return response('kuta-matching',{groom,bride,computedSiderealMoon:{groom:groomMoon,bride:brideMoon}},result,
        {method,ayanamsha:'Canonical linear Lahiri estimate',orientation:'Historical table roles: groom and bride. Swapping roles can change asymmetric entries; no gender or relationship judgment is inferred.',...(method!=='porutham10'?{variantSet:opts.variantSet}:{}),vashyaSagCompletion:opts.vashyaSagCompletion},
        {status:unavailable.length?(calculated?'partial':'unavailable'):'calculated',unavailable});
    }),
  define('workbench_moments','moments','Scan the existing separate Western election, planetary-hour, Muhūrta and Pañcāṅga columns on an explicit finite UTC grid. At most 168 hours / 256 samples; the step must divide the horizon exactly. No combined agreement score or safe-time inference. Legacy mean-solar timing convention remains disclosed; IANA zone labels context only.',
    object({fromISO:instant,lat:observer.lat,lon:observer.lon,timeZone:observer.timeZone,hoursAhead:number(1/60,168),stepMinutes:integer(1,1440),operationKey:enumeration(OPERATIONS.map(row=>row.key))},['fromISO','lat','lon','timeZone','hoursAhead']),args=>{
      const context=moment({...args,dateISO:args.fromISO}),step=args.stepMinutes??30,ratio=args.hoursAhead*60/step;
      if(Math.abs(ratio-Math.round(ratio))>1e-9)throw new RangeError('stepMinutes must divide the requested horizon exactly; no rounded endpoint is inferred.');
      const samples=Math.round(ratio)+1;if(samples<2||samples>256)throw new RangeError('Moment scans support 2–256 samples; shorten the horizon or increase the step.');
      const end=new Date(Date.parse(context.dateISO)+args.hoursAhead*3600000);moment({...context,dateISO:end.toISOString()});
      if(Math.abs(context.lat)===90)throw new RangeError('Moment-scan chart angles are undefined at an exact pole.');
      const result=scanMoments(new Date(context.dateISO),args.hoursAhead,context.lat,context.lon,{stepMinutes:step,operationKey:args.operationKey??DEFAULT_OPERATION_KEY});
      const unavailableSamples=result.rows.filter(row=>!row.hour||!row.muhurta).length;
      return response('moments',{...context,requestedEndISO:end.toISOString()},result,{clockConvention:LMT_NOTE,stepMinutes:step,samples,operationKey:args.operationKey??DEFAULT_OPERATION_KEY,sampling:'Inclusive exact UTC grid; extrema and transitions between samples are not searched.',unresolvedRules:'Legacy yoga screen labels can include opening-portion avoid rules; applicability is not resolved without limb boundaries.'},
        {status:unavailableSamples?'partial':'calculated',unavailableSamples});
    }),
];

export const CALENDAR_MCP_COVERAGE = Object.freeze(Object.fromEntries([
  ['kp-sublords','workbench_kp',['result.table','result.starLord','result.subLord','result.entry','result.cusps','result.planets'],'Explicit table/longitude/number/chart modes; inherited KP approximation flags.'],
  ['prasna','workbench_prasna',['result.testimonies','result.counts','result.editionFlags','result.outOfScope'],'Known moment, explicit question house and optional selected KP number/direction; no actual outcome answer.'],
  ['muhurta','workbench_muhurta',['result.report','result.timeline'],'Complete existing mean-solar sunrise-day report and optional overlap timeline; opening-portion applicability unresolved.'],
  ['shatkarman','workbench_shatkarman',['result.currentMoment','result.matches','result.conflictNote'],'Historical correspondence/timing description, no operational instructions or recommendation.'],
  ['tajika-varshaphala','workbench_tajika',['result.varshaPravesha','result.annual','result.muntha','result.varsheshvara','result.aspects','result.yogas','result.sahams'],'Known birth; year 1901–2099 after birth year and within 150 years; explicit annual place.'],
  ['tithi-pravesha','workbench_tithi_pravesha',['result.candidates','result.match','result.ambiguity','result.praveshas'],'Annual solar/soli-lunar modes and 1–12 monthly solar returns; inherited UTC/mean-solar weekday limits.'],
  ['kuta-matching','workbench_kuta',['result.ashtakuta','result.porutham10','unavailable'],'Explicit known births, canonical Moons, named table variants; no relationship advice.'],
  ['moments','workbench_moments',['result.rows','result.meta','unavailableSamples'],'At most 168 hours / 256 samples on an exactly divisible grid; separate historical columns.'],
].map(([id,name,outputPaths,scope])=>[id,{mcpTools:[name],outputPaths,scope}])));
