import {pathToFileURL} from 'node:url';
import {CHART_MCP_TOOLS,CHART_MCP_COVERAGE} from '../../mcp/chart-adapters.mjs';
import {castChart,houses,bodyPosition} from '../../assets/js/core/astro.js';
import {transitTimeline,TRANSIT_BODIES_DEFAULT,NATAL_POINTS_DEFAULT} from '../../assets/js/core/transits.js';
import {synastryGrid} from '../../assets/js/core/synastry.js';
import {lunarReturnsBetween,planetReturns} from '../../assets/js/core/returns.js';
import {progressedPositions,ageFromDates} from '../../assets/js/core/progressions.js';
import {firdaria,currentFirdaria} from '../../assets/js/core/firdaria.js';
import {zodiacalReleasing,currentReleasing} from '../../assets/js/core/releasing.js';
import {computeLots} from '../../assets/js/core/lots.js';
import {conjunctionsBetween,meanConjunctionSeries,eclipseNear} from '../../assets/js/core/cycles.js';
import {directionsToAngles} from '../../assets/js/core/directions.js';
import {solarReturn} from '../../assets/js/core/solar-return.js';
import {rectify} from '../../assets/js/core/rectification.js';
import {lstHand,siderealTimeAtMidnight,intervalHoursOf,miniEphemeris,ramcExact,tableOfHousesDemo} from '../../assets/js/core/handcalc.js';
import {horaryJudgement} from '../../assets/js/core/horary-judge.js';
const json=v=>JSON.parse(JSON.stringify(v)),same=(a,b)=>JSON.stringify(json(a))===JSON.stringify(json(b));
const delta=(a,b)=>Math.abs(((a-b+540)%360)-180);
export async function run(){
 let count=0;const failures=[],ok=(condition,label)=>{count++;if(!condition)failures.push(label);},throws=(fn,label)=>{try{fn();ok(false,label);}catch{ok(true,label);}};
 const call=(id,args)=>CHART_MCP_TOOLS.find(t=>t.name==='workbench_'+id).calculate(args);
 const birth={dateISO:'1985-05-15T12:00:00Z',lat:51.5,lon:-.13,timeZone:'Europe/London',system:'regiomontanus'},moment={...birth,dateISO:'2026-10-30T12:00:00Z'};
 const chart=castChart(new Date(birth.dateISO),birth.lat,birth.lon,birth.system);chart.timeZone=birth.timeZone;
 const window={startISO:'2026-10-01T00:00:00Z',endISO:'2026-10-10T18:00:00Z'},start=new Date(window.startISO),end=new Date(window.endISO);
 const cases={transits:{birth,...window},synastry:{birthA:birth,birthB:{...birth,dateISO:'1990-06-20T12:00:00Z'}},returns:{birth,body:'Moon',startISO:'2026-01-01T00:00:00Z',endISO:'2027-01-01T00:00:00Z',castCharts:true},secondary_progressions:{birth,onDateISO:moment.dateISO},firdaria:{birth,onDateISO:moment.dateISO},zodiacal_releasing:{birth,onDateISO:moment.dateISO,lot:'spirit'},cycles:{startISO:'2000-01-01T00:00:00Z',endISO:'2030-01-01T00:00:00Z',includeMeanSeries:true,eclipseDateISO:'2024-04-08T12:00:00Z'},directions:{birth},solar_return:{birth,year:2026},rectification:{birth},handcalc:{moment},horary_judgement:{moment,quesitedHouse:7}};
 ok(CHART_MCP_TOOLS.length===12&&new Set(CHART_MCP_TOOLS.map(t=>t.name)).size===12,'Twelve distinct fixed chart adapter tools');
 ok(Object.keys(CHART_MCP_COVERAGE).length===12&&Object.values(CHART_MCP_COVERAGE).every(c=>c.mcpTools.every(n=>CHART_MCP_TOOLS.some(t=>t.name===n))&&c.outputPaths.length),'Capability guide maps actual tool names and output paths');
 const visitSchema=s=>s.type==='object'?s.additionalProperties===false&&Object.values(s.properties).every(visitSchema):s.type==='array'?visitSchema(s.items):true;
 const outputs={};
 for(const tool of CHART_MCP_TOOLS){const id=tool.name.slice(10),args=cases[id];ok(visitSchema(tool.inputSchema),`${id}: nested schemas reject undeclared properties`);const result=tool.calculate(args);outputs[id]=result;ok(result.capabilityId&&result.source&&result.result!==undefined&&Array.isArray(result.numericDiagnostics)&&JSON.stringify(result).length<1500000,`${id}: actual canonical output is source-qualified and below service budget`);throws(()=>tool.calculate({...args,chart:{planets:{Sun:{lon:123}}}}),`${id}: reject forged chart payload`);throws(()=>tool.calculate({}),`${id}: require explicit inputs`);}
 const transit=transitTimeline(chart,start,end,{bodies:TRANSIT_BODIES_DEFAULT,natalPoints:NATAL_POINTS_DEFAULT,aspects:[0,60,90,120,180],profection:true});ok(same(outputs.transits.result,transit),'Transits preserve full canonical output within result cap');
 const capped=call('transits',{...cases.transits,startISO:'2026-01-01T00:00:00Z',endISO:'2027-01-01T00:00:00Z',maxResults:1});ok(capped.result.events.length===1&&capped.counts.events.calculated>1&&capped.counts.events.returned===1&&capped.counts.events.truncated,'Transit cap reports computed count and explicit truncation');
 throws(()=>call('transits',{...cases.transits,bodyIds:['Moon'],endISO:'2027-01-01T00:00:00Z'}),'Moon scan cap prevents long synchronous work');
 throws(()=>call('transits',{...cases.transits,startISO:'1980-01-01T00:00:00Z'}),'Natal scan cannot precede birth');
 const B=castChart(new Date(cases.synastry.birthB.dateISO),birth.lat,birth.lon,birth.system);ok(same(outputs.synastry.result,synastryGrid(chart,B)),'Synastry grid matches canonical inter-aspects and overlays');
 const angles=call('synastry',{...cases.synastry,includeAngles:true});ok(angles.result.rows.length===11&&angles.result.cols.length===11,'Synastry angles are explicit and bounded');
 const returns=lunarReturnsBetween(chart,new Date(cases.returns.startISO),new Date(cases.returns.endISO),{castCharts:true,lat:birth.lat,lon:birth.lon,system:birth.system,includeStart:false});returns.returns.forEach(r=>r.chart.timeZone=birth.timeZone);ok(same(outputs.returns.result,returns),'Lunar returns reuse canonical finder and requested charts');
 ok(outputs.returns.returnHouseContexts.length===returns.count&&returns.returns.every(r=>delta(bodyPosition('Moon',r.instant).lon,chart.planets.Moon.lon)<.00002),'Returned lunar charts retain house context and solved target residual');
 const planetArgs={birth,body:'Saturn',startISO:'2013-01-01T00:00:00Z',endISO:'2017-01-01T00:00:00Z'};ok(same(call('returns',planetArgs).result,planetReturns(chart,'Saturn',new Date(planetArgs.startISO),new Date(planetArgs.endISO),{includeStart:false})),'Generic planetary return preserves every canonical retrograde pass');
 throws(()=>call('returns',{...planetArgs,endISO:'2030-01-01T00:00:00Z'}),'Return scan rejects more than3660days');
 throws(()=>call('returns',{birth:{...birth,dateISO:'2100-12-31T20:00:00Z',timeZone:'UTC'},body:'Moon',startISO:'2100-12-31T20:00:00Z',endISO:'2100-12-31T23:59:59Z',includeStart:true,castCharts:true,returnObserver:{lat:1.87,lon:-157.4,timeZone:'Pacific/Kiritimati'}}),'Relocated return chart refuses observer civil2101 at the supported UTC edge');
 const on=new Date(moment.dateISO),progressed=progressedPositions(chart.date,birth.lat,birth.lon,ageFromDates(chart.date,on),{system:birth.system});ok(same(outputs.secondary_progressions.result,progressed),'Secondary progression exact canonical parity');
 throws(()=>call('secondary_progressions',{birth,onDateISO:'1980-01-01T00:00:00Z'}),'Progression cannot use negative age');
 const periods=firdaria(chart.date,chart.isDay,{nightNodes:'end'}),current=currentFirdaria(periods.majors,(on-chart.date)/(365.25*86400000));ok(same(outputs.firdaria.result.periods,periods)&&same(outputs.firdaria.result.current,current),'Firdaria preserves sect, Julian-year ages and canonical periods');
 const oldBirth={...birth,dateISO:'1900-01-01T12:00:00Z'},old=call('firdaria',{birth:oldBirth,onDateISO:'1980-01-01T12:00:00Z'});ok(old.result.current.cycle===1&&Date.parse(old.result.currentDates.major.start)>Date.parse(old.result.current.major.startDate),'Repeated firdaria cycle has correctly shifted current dates');
 const nightBirth={...birth,dateISO:'1985-05-15T00:00:00Z'},nodeEnd=call('firdaria',{birth:nightBirth,onDateISO:moment.dateISO,nightNodes:'end'}),nodeAfter=call('firdaria',{birth:nightBirth,onDateISO:moment.dateISO,nightNodes:'afterMars'});ok(!same(nodeEnd.result.periods.sequence,nodeAfter.result.periods.sequence),'Night-node source variants remain distinct');
 const lots=computeLots(chart,{sectAware:true}),lot=lots.lots.find(l=>l.key==='spirit'),zr=zodiacalReleasing(Math.floor(lot.lon/30),chart.date,{maxYears:100});ok(same(outputs.zodiacal_releasing.result.periods,zr)&&same(outputs.zodiacal_releasing.result.current,currentReleasing(zr,chart.date,on)),'Releasing derives the actual sect-aware lot and canonical periods');
 throws(()=>call('zodiacal_releasing',{...cases.zodiacal_releasing,maxYears:20}),'Releasing refuses evaluation outside selected horizon');
 const nights=call('zodiacal_releasing',{...cases.zodiacal_releasing,birth:nightBirth,sectAware:true}),noSect=call('zodiacal_releasing',{...cases.zodiacal_releasing,birth:nightBirth,sectAware:false});ok(nights.result.lot.lon!==noSect.result.lot.lon,'Night-lot reversal changes the underlying releasing input');
 const cyc=cases.cycles;ok(same(outputs.cycles.result.conjunctions,conjunctionsBetween(new Date(cyc.startISO),new Date(cyc.endISO))),'Cycles retain canonical Jupiter-Saturn longitude crossings');
 ok(same(outputs.cycles.result.eclipse,eclipseNear(new Date(cyc.eclipseDateISO))),'Eclipse report preserves global/same-syzygy qualification');
 throws(()=>call('cycles',{startISO:'1900-01-01T00:00:00Z',endISO:'2001-01-01T00:00:00Z'}),'Cycles bound the maximum scan');
 throws(()=>call('cycles',{...cyc,eclipseDateISO:'2100-12-01T00:00:00Z'}),'Eclipse lookahead cannot escape adapter range');
 ok(same(outputs.directions.result,directionsToAngles(chart,{key:'naibod',maxYears:90})),'Directions exact canonical simplified-arc parity');
 const ptolemy=call('directions',{birth,key:'ptolemy',maxYears:150});ok(ptolemy.result.every(r=>r.arc===r.years),'Ptolemy time key remains explicit');
 const solar=solarReturn(chart,2026,{lat:birth.lat,lon:birth.lon,system:birth.system});solar.chart.timeZone=birth.timeZone;ok(same(outputs.solar_return.result,solar)&&outputs.solar_return.residualDegrees<.001,'Solar return matches canonical chart and retains numerical residual');
 throws(()=>call('solar_return',{birth,year:1985}),'Reject same-birth-year revolution rather than an ambiguous birth anchor');
 const relocation=call('solar_return',{birth,year:2026,returnObserver:{lat:35.68,lon:139.76,timeZone:'Asia/Tokyo',system:'whole'}});ok(relocation.result.instant===outputs.solar_return.result.instant&&relocation.result.chart.asc!==outputs.solar_return.result.chart.asc&&relocation.calculationContext.return.actualHouseSystem==='whole','Explicit return relocation changes houses, not the solar crossing');
 ok(same(outputs.rectification.result,rectify(chart)),'Rectification retains inherited assumptions and canonical diagnostics');
 throws(()=>call('rectification',{birth:oldBirth}),'Rectification refuses an out-of-range273-day lookback');
 const handChart=castChart(on,moment.lat,moment.lon,moment.system),interval=intervalHoursOf(on);ok(same(outputs.handcalc.result.hand,lstHand(on,siderealTimeAtMidnight(on),interval,moment.lon,{rate:10})),'Manual sidereal-time arithmetic reuses the canonical calculator');
 ok(same(outputs.handcalc.result.ephemeris,miniEphemeris(on,2)),'Mini-ephemeris cells are canonically generated and bounded');
 const midnight=call('handcalc',{moment:{...moment,dateISO:'2026-10-30T00:00:00Z'},ephemerisDays:1});ok(midnight.numericDiagnostics.some(d=>d.path.includes('plogInt'))&&midnight.result.interpolations.every(r=>r.plog.motionDeg===0),'Zero-interval logarithms retain explicit unavailable diagnostics and zero-motion limit');
 const polar=call('handcalc',{moment:{...moment,lat:69.65,system:'placidus'}});ok(polar.calculationContext.actualHouseSystem==='regiomontanus'&&polar.calculationContext.houseWarning&&polar.result.table.result.system==='regiomontanus'&&polar.result.table.result.requestedSystem==='placidus'&&polar.result.table.result.rowCaveat.includes('Regiomontanus'),'Actual house fallback remains explicit in chart and teaching table');
 const nearPole=call('handcalc',{moment:{...moment,lat:89.5,system:'whole'}});ok(nearPole.result.table.status==='unavailable'&&Number.isFinite(nearPole.result.exactLSTHours),'An undefined polar grid corner does not erase valid sidereal-time arithmetic');
 throws(()=>call('handcalc',{moment:{...moment,dateISO:'2100-12-31T00:00:00Z'}}),'Mini-ephemeris final midnight stays within range');
 ok(same(outputs.horary_judgement.result,horaryJudgement(handChart,7,{querentHouse:1})),'House-specific horary judgment preserves canonical perfection and topic sense');
 const affirms=call('horary_judgement',{moment,quesitedHouse:7,sense:'affirms'});ok(affirms.result.note===outputs.horary_judgement.result.note&&affirms.result.perfection,'Explicit topic sense keeps source context and calculated perfection');
 for(const patch of [{dateISO:'1985-05-15T12:00'},{dateISO:'1985-02-30T12:00:00Z'},{dateISO:'1899-12-31T23:59:59Z'},{lat:NaN},{lat:90},{timeZone:'Made/Up'},{timeZone:null},{system:'koch'},{timeKnown:false},{chart:{planets:{Sun:{lon:0}}}}])throws(()=>call('directions',{birth:{...birth,...patch}}),'Reject malformed or forged natal input '+JSON.stringify(patch));
 throws(()=>call('directions',{birth:{...birth,dateISO:'2100-12-31T23:00:00Z',timeZone:'Pacific/Kiritimati'}}),'Reject observer-zone2101 even at supported UTC2100');
 for(const [id,args]of [['transits',{...cases.transits,bodyIds:['Pluto']}],['synastry',{...cases.synastry,includeAngles:1}],['returns',{...cases.returns,body:'Moon',includeStart:'yes'}],['directions',{birth,maxYears:151}],['directions',{birth,key:'bogus'}],['zodiacal_releasing',{...cases.zodiacal_releasing,lot:'made-up'}],['handcalc',{moment,ephemerisDays:1000000}],['horary_judgement',{moment,quesitedHouse:13}]])throws(()=>call(id,args),`${id}: bounded method arguments`);
 for(const field of ['bodyIds','natalPoints','aspects'])throws(()=>call('transits',{...cases.transits,[field]:Array(1)}),`Reject sparse ${field} arrays in the direct adapter contract`);
 // R2 before/after regressions: final partial transit intervals previously vanished.
 const anchor=castChart(new Date('2025-01-01T00:00:00Z'),51.5,0),partialStart=new Date('2026-01-01T00:00:00Z'),partialEnd=new Date('2026-01-01T18:00:00Z'),transitOptions={bodies:['Sun'],natalPoints:['Sun'],aspects:[0]};
 const partial=transitTimeline(anchor,partialStart,partialEnd,transitOptions);ok(partial.events.length===1&&partial.events[0].exactISO.startsWith('2026-01-01T05:46:'),'Final partial-day solar crossing is retained');
 const day=transitTimeline(anchor,partialStart,new Date('2026-01-02T00:00:00Z'),transitOptions);ok(day.events.length===1&&partial.events[0].transitingBody===day.events[0].transitingBody&&partial.events[0].natalPoint===day.events[0].natalPoint&&Math.abs(Date.parse(partial.events[0].exactISO)-Date.parse(day.events[0].exactISO))<1000,'Divisible daily and partial-window searches recover the same crossing within solver resolution');
 const moonAnchor=castChart(new Date('2026-01-01T02:00:00Z'),51.5,0),moonPartial=transitTimeline(moonAnchor,partialStart,new Date('2026-01-01T03:00:00Z'),{bodies:['Moon'],natalPoints:['Moon'],aspects:[0],profection:false});ok(moonPartial.events.length===1&&Math.abs(Date.parse(moonPartial.events[0].exactISO)-Date.parse('2026-01-01T02:00:00Z'))<1000,'Final partial six-hour Moon crossing is retained');
 throws(()=>transitTimeline(anchor,partialStart,partialEnd,{...transitOptions,stepDays:-1}),'Non-positive transit step cannot loop indefinitely');
 throws(()=>transitTimeline(anchor,partialStart,partialEnd,{...transitOptions,stepDays:1e-8}),'Transit sampling work cap rejects unbounded fine grids');
 // R2 handcalc longitudes are equivalent modulo360; polar grid uses one system.
 const wrapDate=new Date('2000-01-01T12:00:00Z');
 for(const longitude of [-180,-170,0,170,180]){const table=tableOfHousesDemo(ramcExact(wrapDate,longitude),30,wrapDate),exact=houses(wrapDate,30,longitude,'placidus');ok(delta(table.exact.asc,exact.asc)<1e-10&&delta(table.exact.mc,exact.mc)<1e-10,`Wrapped hand-table longitude ${longitude} matches direct house calculation`);}
 for(const latitude of [-66.2,66,66.2]){const table=tableOfHousesDemo(ramcExact(wrapDate,170),latitude,wrapDate);ok(table.system==='regiomontanus'&&table.houseWarning&&table.requestedSystem==='placidus'&&table.rowCaveat.includes('All displayed table corners'),'High-latitude table chooses one coherent fallback at '+latitude);}
 const saved=process.env.TZ;try{process.env.TZ='Pacific/Honolulu';const A=call('solar_return',cases.solar_return);process.env.TZ='Asia/Tokyo';ok(same(A,call('solar_return',cases.solar_return)),'Adapter output independent of host timezone');}finally{if(saved===undefined)delete process.env.TZ;else process.env.TZ=saved;}
 return{pass:!failures.length,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=await run();console.log(`${result.pass?'PASS':'FAIL'} chart MCP: ${result.count} checks`);result.failures.forEach(f=>console.error(f));process.exitCode=result.pass?0:1;}
