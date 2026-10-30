// Fixed, stateless adapters for existing chart calculators. Every chart is
// recomputed from explicit inputs; no caller chart objects or saved records.
import {castChart,bodyPosition} from '../assets/js/core/astro.js';
import {parseExplicitInstant,HOUSE_SYSTEMS} from '../assets/js/core/instant-boundary.js';
import {validateZone,validateLocation} from '../assets/js/core/cultural-calendars.js';
import {REGISTRY} from '../assets/js/core/registry.js';
import {transitTimeline,TRANSIT_BODIES_DEFAULT,NATAL_POINTS_DEFAULT} from '../assets/js/core/transits.js';
import {synastryGrid} from '../assets/js/core/synastry.js';
import {lunarReturnsBetween,planetReturns,returnChart} from '../assets/js/core/returns.js';
import {progressedPositions} from '../assets/js/core/progressions.js';
import {firdaria,currentFirdaria,firdariaDate} from '../assets/js/core/firdaria.js';
import {zodiacalReleasing,currentReleasing} from '../assets/js/core/releasing.js';
import {computeLots} from '../assets/js/core/lots.js';
import {conjunctionsBetween,triplicityRuns,meanConjunctionSeries,eclipseNear} from '../assets/js/core/cycles.js';
import {directionsToAngles} from '../assets/js/core/directions.js';
import {solarReturn} from '../assets/js/core/solar-return.js';
import {rectify} from '../assets/js/core/rectification.js';
import {lstHand,lstExact,siderealTimeAtMidnight,intervalHoursOf,miniEphemeris,interpolateBody,ramcExact,tableOfHousesDemo,midnightUTC} from '../assets/js/core/handcalc.js';
import {horaryJudgement} from '../assets/js/core/horary-judge.js';

const DAY=86400000,MIN=Date.parse('1900-01-01T00:00:00Z'),MAX=Date.parse('2100-12-31T23:59:59.999Z');
const PLANETS=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'];
const POINTS=[...PLANETS,'NorthNode','SouthNode','Fortune','Ascendant','Midheaven','Descendant','IC'];
const str=(maxLength=120)=>({type:'string',minLength:1,maxLength});
const en=values=>({type:typeof values[0],enum:values});
const num=(minimum,maximum)=>({type:'number',minimum,maximum});
const int=(minimum,maximum)=>({...num(minimum,maximum),type:'integer'});
const bool={type:'boolean'};
const obj=(properties,required=[])=>({type:'object',properties,required,additionalProperties:false});
const arr=(values,maxItems)=>({type:'array',items:en(values),minItems:1,maxItems,uniqueItems:true});
const iso={...str(40),description:'Explicit ISO datetime with Z or numeric UTC offset. Exact time must be known; no local-time inference.'};
const observerProps={lat:num(-90,90),lon:num(-180,180),timeZone:str(128),system:en(HOUSE_SYSTEMS)};
const moment=obj({dateISO:iso,...observerProps},['dateISO','lat','lon','timeZone']);
const observer=obj(observerProps,['lat','lon','timeZone']);
const natalProps={birth:moment};
const windowProps={startISO:iso,endISO:iso};
const COMMON_LIMITS=[
 'Traditional symbolic techniques describe inherited rules, not validated predictions, relationship compatibility, a medical prognosis or recovered factual birth times.',
 'UTC inputs and astronomical casts are bounded to1900–2100; no exact birth time, location, IANA zone or current date is inferred. Coordinates and named zones are supplied independently, not geographically verified.',
 'All results reuse the existing pure calculator. Source citations and contested methods are inherited, not newly validated readings of every named book.',
 'MCP clients may retain supplied birth inputs. This stateless calculator reads no browser records and makes no network request.',
];
function validate(schema,value,path='arguments'){
 if(schema.type==='object'){
  if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw new RangeError(`${path} must be a plain object.`);
  for(const key of Object.keys(value))if(!Object.hasOwn(schema.properties,key))throw new RangeError(`${path}.${key} is not an allowed input.`);
  for(const key of schema.required)if(!Object.hasOwn(value,key))throw new RangeError(`${path}.${key} is required.`);
  for(const [key,item]of Object.entries(value))validate(schema.properties[key],item,`${path}.${key}`);
 }else if(schema.type==='array'){
  if(!Array.isArray(value)||value.length<schema.minItems||value.length>schema.maxItems||new Set(value).size!==value.length)throw new RangeError(`${path} must contain one to ${schema.maxItems} distinct entries.`);
  for(let i=0;i<value.length;i++){if(!Object.hasOwn(value,i))throw new RangeError(`${path} must be a dense array.`);validate(schema.items,value[i],`${path}[${i}]`);}
 }else if(schema.type==='string'){
  if(typeof value!=='string'||value.length<(schema.minLength??0)||value.length>(schema.maxLength??Infinity))throw new RangeError(`${path} must be a bounded string.`);
 }else if(schema.type==='boolean'){
  if(typeof value!=='boolean')throw new RangeError(`${path} must be true or false.`);
 }else if(!Number.isFinite(value)||typeof value!=='number'||(schema.type==='integer'&&!Number.isInteger(value))||value<(schema.minimum??-Infinity)||value>(schema.maximum??Infinity))throw new RangeError(`${path} must be a finite ${schema.type} in its declared range.`);
 if(schema.enum&&!schema.enum.includes(value))throw new RangeError(`${path} must be one of the named supported values.`);
}
function dated(value){const date=parseExplicitInstant(value);if(+date<MIN||+date>MAX)throw new RangeError('Chart adapters support explicit UTC instants in1900–2100.');return date;}
function zoneForDate(value,date){const timeZone=validateZone(value),localYear=Number(new Intl.DateTimeFormat('en',{timeZone,year:'numeric',calendar:'gregory'}).format(date));if(localYear<1900||localYear>2100)throw new RangeError('The observer civil year must also be in1900–2100.');return timeZone;}
function cast(input){
 const date=dated(input.dateISO),timeZone=zoneForDate(input.timeZone,date),system=input.system??'regiomontanus';validateLocation(input.lat,input.lon);
 const chart=castChart(date,input.lat,input.lon,system);chart.timeZone=timeZone;
 return{chart,context:{dateISO:date.toISOString(),lat:input.lat,lon:input.lon,timeZone,requestedHouseSystem:system,actualHouseSystem:chart.system,houseWarning:chart.houseWarning??null,sectMethod:chart.sectMethod,knownInstant:true}};
}
function range(startISO,endISO,maxDays,birth){const start=dated(startISO),end=dated(endISO),days=(end-start)/DAY;if(!(days>0&&days<=maxDays))throw new RangeError(`Supply a positive interval of at most ${maxDays} elapsed days.`);if(birth&&start<birth)throw new RangeError('The natal study interval cannot begin before birth.');return{start,end,days};}
function age(birth,on,yearDays=365.2422){const value=(on-birth)/(yearDays*DAY);if(value<0||value>150)throw new RangeError('Evaluation must be from birth through150 declared model years.');return value;}
function numericJSON(value,path,diagnostics){
 if(value instanceof Date){if(!Number.isFinite(+value))throw new RangeError(`Invalid calculated date at ${path}.`);return value.toISOString();}
 if(typeof value==='number'&&!Number.isFinite(value)){diagnostics.push({path,status:'unavailable-numeric',reason:Number.isNaN(value)?'Inherited calculation returned NaN.':'The inherited mathematical expression has an infinite value; JSON null is explicit, not a numeric result.'});return null;}
 if(Array.isArray(value))return value.map((v,i)=>numericJSON(v,`${path}[${i}]`,diagnostics));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined).map(([k,v])=>[k,numericJSON(v,`${path}.${k}`,diagnostics)]));return value;
}
function tool(capabilityId,name,description,inputSchema,calculate,outputPaths){
 const entry=REGISTRY.find(r=>r.id===capabilityId);if(!entry)throw new Error(`Unknown chart capability ${capabilityId}`);
 const definition={name,description,inputSchema,calculate:args=>{validate(inputSchema,args);const computed=calculate(args),numericDiagnostics=[];const result=numericJSON({schemaVersion:1,capabilityId,source:entry.citation,sourceStatus:'Inherited implementation and source qualification; no new historical-authority endorsement.',method:'Fixed allowlisted canonical calculator with recomputed charts and explicit inputs.',...computed,limitations:[...COMMON_LIMITS,...(computed.limitations??[])]},'result',numericDiagnostics);result.numericDiagnostics=numericDiagnostics;return result;}};
 return{capabilityId,definition,coverage:{mcpTools:[name],outputPaths,scope:description}};
}
const definitions=[
 tool('transits','workbench_transits','Find transits, stations and ingresses to a recomputed natal chart. At most730 days; a selected Moon limits the window to62 days. Returned event arrays have an explicit cap/count; results are numerical crossings, not guaranteed outcomes.',obj({...natalProps,...windowProps,bodyIds:arr(PLANETS,7),natalPoints:arr(POINTS,14),aspects:arr([0,60,90,120,180],5),profection:bool,maxResults:int(1,512)},['birth','startISO','endISO']),a=>{
  const natal=cast(a.birth),bodies=a.bodyIds??TRANSIT_BODIES_DEFAULT,w=range(a.startISO,a.endISO,bodies.includes('Moon')?62:730,natal.chart.date);age(natal.chart.date,w.end);
  const full=transitTimeline(natal.chart,w.start,w.end,{bodies,natalPoints:a.natalPoints??NATAL_POINTS_DEFAULT,aspects:a.aspects??[0,60,90,120,180],profection:a.profection??true}),cap=a.maxResults??256,result={...full},counts={};
  for(const key of ['events','stations','ingresses']){counts[key]={calculated:full[key].length,returned:Math.min(full[key].length,cap),truncated:full[key].length>cap};result[key]=full[key].slice(0,cap);}
  return{calculationContext:{birth:natal.context,startISO:w.start.toISOString(),endISO:w.end.toISOString(),stepDays:bodies.includes('Moon')?'Moon0.25; other bodies1':1,maxResults:cap},result,counts,limitations:['Array caps return the earliest chronological entries; inspect calculated/returned/truncated separately. Finite sampling and crossing-search conventions are inherited, not an exhaustive proof of every possible transit.']};
 },['result.events','result.stations','result.ingresses','result.profectionsInWindow','counts']),
 tool('synastry','workbench_synastry','Compare two explicitly supplied natal charts through Lilly-moiety inter-aspects and house overlays. Includes optional angles; no compatibility probability or inferred relationship.',obj({birthA:moment,birthB:moment,bodyIds:arr(PLANETS,7),includeAngles:bool},['birthA','birthB']),a=>{const A=cast(a.birthA),B=cast(a.birthB);return{calculationContext:{birthA:A.context,birthB:B.context},result:synastryGrid(A.chart,B.chart,{bodies:a.bodyIds??PLANETS,overlayBodies:a.bodyIds??PLANETS,includeAngles:a.includeAngles??false})};},['result.cells','result.hits','result.houseOverlay']),
 tool('returns','workbench_returns','Find lunar or planetary returns to a recomputed natal longitude in a supplied interval of at most3660 days. Exact requested return-location charts are optional; the medieval monthly-revolution dispute remains explicit.',obj({...natalProps,...windowProps,body:en(PLANETS),castCharts:bool,returnObserver:observer,includeStart:bool},['birth','startISO','endISO','body']),a=>{
  const natal=cast(a.birth),w=range(a.startISO,a.endISO,3660,natal.chart.date);age(natal.chart.date,w.end);const location=a.returnObserver??a.birth,system=location.system??a.birth.system??'regiomontanus';validateZone(location.timeZone);validateLocation(location.lat,location.lon);
  const options={lat:location.lat,lon:location.lon,system,castCharts:a.castCharts??false,includeStart:a.includeStart??false};let result;
  if(a.body==='Moon')result=lunarReturnsBetween(natal.chart,w.start,w.end,options);else{result=planetReturns(natal.chart,a.body,w.start,w.end,options);if(options.castCharts)result.passes=result.passes.map(p=>({...p,chart:returnChart(natal.chart,a.body,p.instant,options)}));}
  const rows=a.body==='Moon'?result.returns:result.passes;for(const row of rows)if(row.chart)row.chart.timeZone=zoneForDate(location.timeZone,row.instant);
  return{calculationContext:{birth:natal.context,returnObserver:{lat:location.lat,lon:location.lon,timeZone:validateZone(location.timeZone),requestedHouseSystem:system,locationSource:a.returnObserver?'explicit return observer':'explicitly supplied natal observer reused'},startISO:w.start.toISOString(),endISO:w.end.toISOString(),includeStart:options.includeStart},result,returnHouseContexts:rows.filter(r=>r.chart).map(r=>({dateISO:r.instantISO,requestedHouseSystem:system,actualHouseSystem:r.chart.system,houseWarning:r.chart.houseWarning??null})),limitations:['The search skips a return within one minute of the interval start unless includeStart is true. Solver residual tolerance is not observational or predictive accuracy.']};
 },['result.returns','result.passes','returnHouseContexts']),
 tool('secondary-progressions','workbench_secondary_progressions','Calculate the inherited day-for-a-tropical-year progression at an explicit evaluation instant, age0–150, with Naibod progressed angles. No alternative progression key is inferred.',obj({...natalProps,onDateISO:iso},['birth','onDateISO']),a=>{const natal=cast(a.birth),on=dated(a.onDateISO),years=age(natal.chart.date,on);const result=progressedPositions(natal.chart.date,natal.chart.latitude,natal.chart.longitude,years,{system:natal.context.requestedHouseSystem});dated(result.progressedDate.toISOString());return{calculationContext:{birth:natal.context,onDateISO:on.toISOString(),ageYears:years,yearDays:365.2422},result};},['result.progressedDate','result.planets','result.progressedMC','result.progressedAsc']),
 tool('firdaria','workbench_firdaria','Calculate the75-year Persian period sequence and the active major/subperiod at an explicit date. Sect is recomputed from the natal Sun’s geometric horizon; night-node order is explicit. Julian365.25-day model years, age0–150.',obj({...natalProps,onDateISO:iso,nightNodes:en(['end','afterMars'])},['birth','onDateISO']),a=>{
  const natal=cast(a.birth),on=dated(a.onDateISO),years=age(natal.chart.date,on,365.25),periods=firdaria(natal.chart.date,natal.chart.isDay,{nightNodes:a.nightNodes??'end'}),current=currentFirdaria(periods.majors,years),offset=current.cycle*75;
  const currentDates={major:current.major?{start:firdariaDate(natal.chart.date,offset+current.major.startAge),end:firdariaDate(natal.chart.date,offset+current.major.endAge)}:null,sub:current.sub?{start:firdariaDate(natal.chart.date,offset+current.sub.startAge),end:firdariaDate(natal.chart.date,offset+current.sub.endAge)}:null};
  return{calculationContext:{birth:natal.context,onDateISO:on.toISOString(),ageYears:years,yearDays:365.25},result:{periods,current,currentDates},limitations:['The canonical major/sub records retain first-cycle ages and dates; currentDates explicitly shifts them by the reported75-year cycle. Period end dates are symbolic arithmetic and may extend beyond the supported astronomical casting interval.']};
 },['result.periods','result.current','result.currentDates']),
 tool('zodiacal-releasing','workbench_zodiacal_releasing','Calculate Valens-style releasing from a recomputed Fortune or Spirit lot, with explicit sect reversal. Returns bounded L1/L2 periods and the period active at an explicit instant; max150 real Julian years,360-day distribution years.',obj({...natalProps,onDateISO:iso,lot:en(['fortune','spirit']),sectAware:bool,maxYears:int(1,150)},['birth','onDateISO','lot']),a=>{
  const natal=cast(a.birth),on=dated(a.onDateISO),years=age(natal.chart.date,on,365.25),maxYears=a.maxYears??100;if(years>=maxYears)throw new RangeError('Evaluation must lie before the chosen releasing horizon. Increase maxYears within150.');const lots=computeLots(natal.chart,{sectAware:a.sectAware??true}),lot=lots.lots.find(l=>l.key===a.lot),periods=zodiacalReleasing(Math.floor(lot.lon/30),natal.chart.date,{maxYears});return{calculationContext:{birth:natal.context,onDateISO:on.toISOString(),sectAware:a.sectAware??true,maxYears},result:{lot,lotCitation:lots.citation,periods,current:currentReleasing(periods,natal.chart.date,on)},limitations:['The canonical last L1 period is completed rather than cut at maxYears, so its endpoint may exceed the requested horizon. No astronomical positions are evaluated at symbolic future period endpoints.']};
 },['result.lot','result.periods.l1','result.current']),
 tool('cycles','workbench_cycles','Calculate Jupiter–Saturn longitude conjunctions and triplicity runs over at most100 Julian years. Optional mean doctrinal series and a separately dated global-eclipse study keep geometric, mean and historical layers distinct.',obj({...windowProps,includeMeanSeries:bool,eclipseDateISO:iso},['startISO','endISO']),a=>{
  const w=range(a.startISO,a.endISO,36525),conjunctions=conjunctionsBetween(w.start,w.end),result={conjunctions,triplicityRuns:triplicityRuns(conjunctions)};
  if(a.includeMeanSeries)result.meanSeries=meanConjunctionSeries(w.start.getUTCFullYear(),w.end.getUTCFullYear()).filter(x=>x.date>=w.start&&x.date<=w.end);
  if(a.eclipseDateISO){const d=dated(a.eclipseDateISO);if(+d<MIN+80*DAY||+d>MAX-400*DAY)throw new RangeError('Eclipse lookup needs80days before and400days after its reference inside1900–2100.');result.eclipse=eclipseNear(d);}
  return{calculationContext:{startISO:w.start.toISOString(),endISO:w.end.toISOString(),eclipseDateISO:a.eclipseDateISO?dated(a.eclipseDateISO).toISOString():null},result,limitations:['Longitude conjunction and minimum great-circle separation are different instants. The reported separation is a six-hour grid minimum around the crossing.','Eclipse classifications are global, not local visibility. A groundTruth peak may belong to a later syzygy; inspect sameSyzygy before associating it with the selected phase.','Mean conjunction series is a historical doctrinal model, not a second observational ephemeris.']};
 },['result.conjunctions','result.triplicityRuns','result.meanSeries','result.eclipse']),
 tool('directions','workbench_directions','Calculate simplified zodiacal directions to Ascendant/MC using explicit Naibod or Ptolemy key and an age horizon up to150. This is not rigorous mundane primary direction.',obj({...natalProps,key:en(['naibod','ptolemy']),maxYears:num(0,150)},['birth']),a=>{const natal=cast(a.birth),key=a.key??'naibod',maxYears=a.maxYears??90;return{calculationContext:{birth:natal.context,key,maxYears},result:directionsToAngles(natal.chart,{key,maxYears}),limitations:['Only direct ecliptic longitude arcs to the two natal angles are listed; oblique ascension, semi-arcs and rigorous mundane directions are not implemented here.']};},['result']),
 tool('solar-return','workbench_solar_return','Solve the tropical solar revolution in an explicitly selected later calendar year and cast its chart at a supplied return observer or the explicitly supplied natal place. Selectedyear must be after birthyear and within150years/1900–2100.',obj({...natalProps,year:int(1900,2100),returnObserver:observer},['birth','year']),a=>{
  const natal=cast(a.birth),birthYear=natal.chart.date.getUTCFullYear();if(a.year<=birthYear||a.year-birthYear>150)throw new RangeError('Choose a solar-return year after the birth year and no more than150 years later.');const location=a.returnObserver??a.birth,system=location.system??a.birth.system??'regiomontanus';validateLocation(location.lat,location.lon);const timeZone=validateZone(location.timeZone),result=solarReturn(natal.chart,a.year,{lat:location.lat,lon:location.lon,system}),returned=cast({dateISO:result.instant.toISOString(),lat:location.lat,lon:location.lon,timeZone,system});result.chart.timeZone=timeZone;
  return{calculationContext:{birth:natal.context,return:returned.context,year:a.year,locationSource:a.returnObserver?'explicit return observer':'explicitly supplied natal observer reused'},result,residualDegrees:Math.abs(((bodyPosition('Sun',result.instant).lon-result.natalSunLon+540)%360)-180),limitations:['Tropical natal longitude is the target; this is not a sidereal Tājika annual chart. A numerical crossing is not a validated annual forecast.']};
 },['result.instant','result.chart','residualDegrees']),
 tool('rectification','workbench_rectification','Run the contested Animodar and Trutine explanations on an already-known exact natal input. Animodar scans±4hours in one-minute increments; Trutine assumes273days gestation. Neither establishes a factual birth or conception time.',obj(natalProps,['birth']),a=>{
  const natal=cast(a.birth);if(+natal.chart.date-273*DAY<MIN||+natal.chart.date+4*3600000>MAX)throw new RangeError('Rectification needs its273-day lookback and4-hour forward sample inside1900–2100.');return{calculationContext:{birth:natal.context,animodarScanMinutes:480,animodarStepMinutes:1,trutineGestationDays:273},result:rectify(natal.chart),limitations:['The273-day conception date is the inherited historical assumption, not an inferred pregnancy fact. Suggested time is a symbolic fit, not recovered evidence of birth time.','Whole/equal natal charts use the canonical Regiomontanus angle reconstruction within these historical checks.']};
 },['result.animodar','result.trutine']),
 tool('handcalc','workbench_handcalc','Explain manual sidereal-time arithmetic, planetary interpolation and a bounded engine-generated table-of-houses demonstration for an explicit instant. Returns book/exact comparisons and unavailable table states; no printed ephemeris is fabricated.',obj({moment,rate:en([10,9.8565]),ephemerisDays:int(1,7),bodyIds:arr(PLANETS,7),tableSystem:en(HOUSE_SYSTEMS)},['moment']),a=>{
  const context=cast(a.moment),date=context.chart.date,days=a.ephemerisDays??2;if(+midnightUTC(date)+days*DAY>MAX)throw new RangeError('The mini-ephemeris needs its final midnight inside1900–2100.');const interval=intervalHoursOf(date),midnightST=siderealTimeAtMidnight(date),rate=a.rate??10,tableSystem=a.tableSystem??'placidus';let table;
  try{table={status:'available',result:tableOfHousesDemo(ramcExact(date,a.moment.lon),a.moment.lat,date,{system:tableSystem})};}catch(e){table={status:'unavailable',reason:e.message,requestedSystem:tableSystem};}
  return{calculationContext:context.context,result:{midnightSTHours:midnightST,intervalHours:interval,hand:lstHand(date,midnightST,interval,a.moment.lon,{rate}),exactLSTHours:lstExact(date,a.moment.lon),ephemeris:miniEphemeris(date,days),interpolations:(a.bodyIds??PLANETS).map(id=>interpolateBody(id,date,interval)),table},limitations:['Mini-ephemeris and house-table cells are generated by this engine, not transcribed observations or a scanned historical table.','At zero interpolation interval, proportional logarithms are infinite although the limiting motion is zero; numericDiagnostics identifies non-finite values serialized as null. A local table failure does not invalidate the separate sidereal-time arithmetic.']};
 },['result.hand','result.interpolations','result.table','numericDiagnostics']),
 tool('horary-judgement','workbench_horary_judgement','Recompute a horary chart and expose the inherited house/topic judgment, significators, modes of perfection and timing with explicit querent/quesited houses and optional topic sense. Historical attribution only, never a factual answer or prognosis.',obj({moment,quesitedHouse:int(1,12),querentHouse:int(1,12),sense:en(['affirms','contact','inverted'])},['moment','quesitedHouse']),a=>{const context=cast(a.moment);return{calculationContext:context.context,result:horaryJudgement(context.chart,a.quesitedHouse,{querentHouse:a.querentHouse??1,...(a.sense?{sense:a.sense}:{})}),limitations:['The engine’s topic-specific affirming/contact/inverted sense is retained unless explicitly selected. Timing is the historical heuristic, not an estimated probability or reliable clock prediction.']};},['result.perfection','result.querent','result.quesited','result.lines']),
];
export const CHART_MCP_TOOLS=definitions.map(d=>d.definition);
export const CHART_MCP_COVERAGE=Object.fromEntries(definitions.map(d=>[d.capabilityId,d.coverage]));
