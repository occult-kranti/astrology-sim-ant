import { pathToFileURL } from 'node:url';
import { STUDY_MCP_TOOLS, STUDY_MCP_COVERAGE } from '../../mcp/study-adapters.mjs';
import { castChart } from '../../assets/js/core/astro.js';
import { starsInAspect, behenianLongitude, BEHENIAN_STARS } from '../../assets/js/core/data/behenian-stars.js';
import { natalTopicReading } from '../../assets/js/core/natal-topics.js';
import { castVedic, compoundRelations, grahaDrishti, combustion } from '../../assets/js/core/vedic.js';
import { chartFromPositions } from '../../assets/js/core/chart-from-positions.js';
import { WORKED_CHARTS } from '../../assets/js/core/data/worked-charts.js';

export async function run() {
  let count = 0; const failures = [];
  const ok = (test, label) => { count++; if (!test) failures.push(label); };
  const eq = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  const throws = (fn,label) => {try{fn();ok(false,label);}catch{ok(true,label);}};
  const tool = name => STUDY_MCP_TOOLS.find(x => x.name === name);
  const call = (name,args) => tool(name).calculate(args);
  const input = {dateISO:'2026-10-30T12:00:00Z',lat:51.5,lon:-.12,timeZone:'Europe/London'};
  const momentTools = ['workbench_behenian_stars','workbench_natal_topics','workbench_vedic_graha_bala'];
  ok(STUDY_MCP_TOOLS.length === 4 && new Set(STUDY_MCP_TOOLS.map(x=>x.name)).size === 4 && STUDY_MCP_TOOLS.every(x=>x.inputSchema.additionalProperties === false), 'Four fixed closed-schema study adapters');
  ok(Object.keys(STUDY_MCP_COVERAGE).length === 4 && Object.values(STUDY_MCP_COVERAGE).every(c=>c.mcpTools.length === 1 && tool(c.mcpTools[0]) && c.outputPaths.length && c.scope), 'All four coverage mappings reference actual adapters and documented paths');
  for (const name of momentTools) {
    const r = call(name,input);
    ok(r.context.dateISO === '2026-10-30T12:00:00.000Z' && r.context.localDate === '2026-10-30' && r.context.timeZone === 'Europe/London',name+' preserves normalized instant and explicit zone');
    ok(r.source && r.sourceStatus.includes('no new') && r.limitations.some(x=>x.includes('not predictions')) && JSON.stringify(r).length < 300000,name+' bounds and qualifies its output');
    for (const patch of [{chart:{planets:{Sun:{lon:0}}}},{reading:{grahas:{}}},{birth:{dateISO:input.dateISO}},{note:'PRIVATE NOTE'},{dateISO:'2026-10-30T12:00:00'},{dateISO:'1899-12-31T12:00:00Z'},{dateISO:'2101-01-01T00:00:00Z'},{lat:90},{lat:-90},{lat:NaN},{lon:Infinity},{lat:'51.5'},{timeZone:'Mars/Olympus'}]) throws(()=>call(name,{...input,...patch}),name+' rejects invalid or fabricated input '+JSON.stringify(patch));
    const noZone = {...input};delete noZone.timeZone;throws(()=>call(name,noZone),name+' requires explicit IANA zone');
    throws(()=>call(name,Object.assign(Object.create({private:true}),input)),name+' rejects custom-prototype objects');
    throws(()=>call(name,{...input,dateISO:'1900-01-01T00:00:00Z',timeZone:'Pacific/Honolulu'}),name+' rejects an out-of-range observer civil year');
  }
  const chart = {...castChart(new Date(input.dateISO),input.lat,input.lon),timeZone:input.timeZone};
  const star = call('workbench_behenian_stars',input);
  ok(eq(star.result,starsInAspect(chart,6)),'Star adapter result exactly matches canonical helper');
  ok(star.methods.starCount === 15 && star.result.every(h=>h.star !== 'Fomalhaut') && !star.starSources.some(s=>s.name === 'Fomalhaut'),'Fifteen historical stars exclude modern Fomalhaut');
  ok(star.methods.bodiesChecked.includes('NorthNode') && star.methods.bodiesChecked.includes('SouthNode') && star.methods.bodiesChecked.includes('Fortune') && star.methods.pointConvention.includes('derived'),'Canonical nodes and Fortune are identified as chart points, not physical planets');
  ok(star.result.every(h=>Math.abs(h.lon-behenianLongitude(h.star,chart.date)) < 1e-12 && h.sep <= 6),'Every returned star longitude and orb uses the named date and canonical linear model');
  ok(star.methods.epochInterpolation.includes('month boundaries') && star.methods.measuredQuantity.includes('not great-circle') && star.modelLimitations.some(x=>x.includes('not equivalent')),'Longitude-only and month-step/proper-motion limitations remain explicit');
  ok(star.starSources.every(s=>s.natureClaimType === 'historical-symbolic-attribution' && s.catalogueEpoch === 2020 && s.readingStatus.includes('Inherited')) && star.checkedSourceNote.includes('Agrippa II.31'),'Stellar nature provenance and checked Sirius attribution do not imply physical influence');
  for(const orb of [0,.1,10])ok(eq(call('workbench_behenian_stars',{...input,orb}).result,starsInAspect(chart,orb)),`Bounded explicit orb${orb} uses canonical helper`);
  for(const orb of [-.1,10.1,'6',NaN])throws(()=>call('workbench_behenian_stars',{...input,orb}),'Reject unbounded/coerced star orb');
  const old = {...input,dateISO:'1900-06-01T12:00:00Z'},future = {...input,dateISO:'2100-06-01T12:00:00Z'};
  ok(call('workbench_behenian_stars',old).context.dateISO.startsWith('1900') && call('workbench_behenian_stars',future).context.dateISO.startsWith('2100'),'Supported endpoint years compute dynamically');
  const natal = call('workbench_natal_topics',input);
  ok(eq(natal.result,natalTopicReading(chart)) && natal.result.topics.length === 12,'All twelve natal topics match the canonical engine');
  ok(natal.methods.legacyFixedStarTableEpoch === 1647 && natal.methods.accidentalDignityConvention.includes('angular-only') && natal.modelLimitations.some(x=>x.includes('not a current-epoch')),'Legacy fixed-star and solar conventions are not silently promoted to current source rules');
  const polar = {...input,lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo',system:'placidus'};
  for(const name of momentTools.slice(0,2)){
    const r=call(name,polar);
    ok(r.context.requestedHouseSystem === 'placidus' && r.context.actualHouseSystem === 'regiomontanus' && r.context.houseWarning,name+' retains explicit polar house fallback');
  }
  const wholeChart = {...castChart(new Date(input.dateISO),input.lat,input.lon,'whole'),timeZone:input.timeZone},vedic = castVedic(wholeChart,{currentDate:wholeChart.date});
  const bala=call('workbench_vedic_graha_bala',input);
  ok(eq(bala.result.compoundRelations,compoundRelations(vedic)) && eq(bala.result.grahaDrishti,grahaDrishti(vedic)) && eq(bala.result.combustion,combustion(vedic)),'All three actual graha-bala views match canonical computation');
  ok(bala.context.actualHouseSystem === 'whole' && bala.methods.ayanamshaDegrees === vedic.ayanamsa && bala.methods.referenceDateISO === input.dateISO.replace('Z','.000Z'),'Vedic model, house convention and explicit reference date are disclosed');
  ok(Object.entries(bala.calculatedGrahas).every(([name,g])=>g.longitudeDegrees === vedic.grahas[name].lon && g.rashiIndex === vedic.grahas[name].rashiIndex),'Computed graha inputs accompany the interpretation matrices');
  ok(bala.result.grahaDrishti.modes.includes('whole-sign') && bala.result.grahaDrishti.modes.includes('sphuta') && bala.result.combustion.contested && bala.modelLimitations.some(x=>x.includes('six-component')),'Competing dṛṣṭi modes and combustion caveats remain separate from a full ṣaḍbala claim');
  throws(()=>call('workbench_vedic_graha_bala',{...input,system:'placidus'}),'Vedic adapter does not accept an ignored house-system option');
  for(const record of WORKED_CHARTS){
    const r=call('workbench_printed_chart',{key:record.key}),expected=chartFromPositions(record.figure);
    ok(eq(r.result,expected),record.key+' replay matches the actual canonical printed-position helper');
    ok(r.status === 'reconstructed' && r.context.dateISO === null && r.result.date === null && !r.methods.modernEphemerisRecalculated,record.key+' is not relabelled as a modern astronomical cast');
    ok(r.methods.cuspApprox === true && r.methods.actualCuspConvention.includes('Equal houses') && r.methods.motionConvention.includes('mean daily'),record.key+' retains actual equal-cusp and mean-motion limitations');
    ok(r.sourceRecord.caveats === record.caveats && r.source === record.sources && r.sourceRecord.completeness === record.completeness,record.key+' retains inherited source discrepancies and completeness label');
  }
  for(const args of [{key:'unknown'}, {key:'../../secret'}, {key:'stolen-fish',spec:{asc:0}}, {key:'stolen-fish',dateISO:input.dateISO}, {key:'stolen-fish',planets:[]}, {key:'stolen-fish',system:'whole'}, {}, null])throws(()=>call('workbench_printed_chart',args),'Printed replay rejects arbitrary rows or undeclared reinterpretation inputs');
  const mutable=call('workbench_printed_chart',{key:'stolen-fish'});mutable.result.planets.Sun.lon=123;mutable.sourceRecord.caveats='ERASED';
  ok(call('workbench_printed_chart',{key:'stolen-fish'}).result.planets.Sun.lon !== 123 && WORKED_CHARTS[0].caveats !== 'ERASED','Returned printed data cannot mutate canonical records');
  for(const [id,coverage]of Object.entries(STUDY_MCP_COVERAGE)){
    const r=call(coverage.mcpTools[0],id==='chart-from-positions'?{key:'stolen-fish'}:input);
    ok(coverage.outputPaths.every(path=>path.split('.').reduce((v,k)=>v?.[k],r)!==undefined),id+' coverage paths resolve in actual results');
  }
  const oldRandom=Math.random,oldNow=Date.now;
  try{Math.random=()=>{throw new Error('Unexpected random draw');};Date.now=()=>{throw new Error('Unexpected current time');};for(const name of momentTools)call(name,input);call('workbench_printed_chart',{key:'dog'});ok(true,'All four adapters avoid random/current-clock generation');}
  catch(e){ok(false,e.message);}finally{Math.random=oldRandom;Date.now=oldNow;}
  const savedTZ=process.env.TZ;
  try{process.env.TZ='Pacific/Honolulu';const a=JSON.stringify(momentTools.map(name=>call(name,input)));process.env.TZ='Asia/Tokyo';ok(a===JSON.stringify(momentTools.map(name=>call(name,input))),'All three moment adapters are host-zone independent');}
  finally{if(savedTZ===undefined)delete process.env.TZ;else process.env.TZ=savedTZ;}
  return {pass:!failures.length,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(`${r.pass?'PASS':'FAIL'} study MCP adapters: ${r.count} checks`);r.failures.forEach(x=>console.error(x));process.exitCode=r.pass?0:1;}
