import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { CALENDAR_MCP_TOOLS, CALENDAR_MCP_COVERAGE } from '../../mcp/calendar-adapters.mjs';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { buildSubLordTable, subLordOf, kpForNumber, kpSignificators } from '../../assets/js/core/kp.js';
import { prasnaJudgement } from '../../assets/js/core/prasna.js';
import { muhurtaReport, scanDay } from '../../assets/js/core/muhurta.js';
import { shatkarmanScreen } from '../../assets/js/core/abhichara.js';
import { varshaphala } from '../../assets/js/core/tajika.js';
import { tithiPravesha, monthlyPravesha } from '../../assets/js/core/tithi-pravesha.js';
import { ashtakuta, porutham10 } from '../../assets/js/core/kuta.js';
import { scanMoments } from '../../assets/js/core/moments.js';

const json = value => JSON.parse(JSON.stringify(value));
const call = (name,args) => CALENDAR_MCP_TOOLS.find(tool=>tool.name===name).calculate(args);
const input = {dateISO:'2026-10-30T12:00:00Z',lat:28.6139,lon:77.209,timeZone:'Asia/Kolkata'};
const birth = {...input,dateISO:'1990-05-17T10:30:00Z'}, bride={...input,dateISO:'1992-09-02T12:00:00Z'};
const chart = context => ({...castChart(new Date(context.dateISO),context.lat,context.lon,'whole'),timeZone:context.timeZone});
const vedic = context => castVedic(chart(context),{currentDate:new Date(context.dateISO)});
const fixtures = {
  workbench_kp:{mode:'chart',...input}, workbench_prasna:{...input,quesitedHouse:7},
  workbench_muhurta:{...input,includeTimeline:true}, workbench_shatkarman:{...input,act:'santi'},
  workbench_tajika:{birth,targetYear:2026},workbench_tithi_pravesha:{birth,mode:'annual',targetYear:2026},
  workbench_kuta:{groom:birth,bride},workbench_moments:{fromISO:input.dateISO,lat:input.lat,lon:input.lon,timeZone:input.timeZone,hoursAhead:1,stepMinutes:30},
};

export function run() {
  let count=0;const failures=[];
  const test=(label,fn)=>{count++;try{fn();}catch(error){failures.push(label+': '+error.message);}};
  test('Fixed eight-tool coverage and strict recursive object contracts',()=>{
    assert.equal(CALENDAR_MCP_TOOLS.length,8);assert.equal(Object.keys(CALENDAR_MCP_COVERAGE).length,8);
    const scan=s=>{if(s.type==='object'){assert.equal(s.additionalProperties,false);for(const child of Object.values(s.properties))scan(child);}};
    for(const tool of CALENDAR_MCP_TOOLS){scan(tool.inputSchema);assert.ok(Object.values(CALENDAR_MCP_COVERAGE).some(row=>row.mcpTools.includes(tool.name)));}
  });
  for(const tool of CALENDAR_MCP_TOOLS){
    test(tool.name+' rejects undeclared computed/private context',()=>{
      for(const patch of [{computedChart:{}},{savedRecords:[]},{notes:'PRIVATE'},{timeKnown:false}])assert.throws(()=>call(tool.name,{...fixtures[tool.name],...patch}));
    });
    test(tool.name+' outputs JSON-safe canonical scope and source status',()=>{
      const out=call(tool.name,fixtures[tool.name]);assert.ok(out.source&&out.sourceStatus.includes('Inherited'));assert.ok(out.limitations.some(s=>s.includes('no browser records')));assert.deepEqual(out,json(out));assert.ok(Object.hasOwn(CALENDAR_MCP_COVERAGE,out.capabilityId));
    });
  }
  test('KP abstract table preserves all 249 arcs without mutable memoized sharing',()=>{
    const r=call('workbench_kp',{mode:'table'});assert.deepEqual(r.result.table,json(buildSubLordTable()));assert.equal(r.result.table.length,249);r.result.table[0].subLord='POISON';assert.notEqual(call('workbench_kp',{mode:'table'}).result.table[0].subLord,'POISON');
    assert.throws(()=>call('workbench_kp',{mode:'table',dateISO:input.dateISO}));
  });
  test('KP exact boundary, 360° wrap and explicit number modes match canonical functions',()=>{
    for(const lon of [0,360,buildSubLordTable()[75].fromDeg])assert.deepEqual(call('workbench_kp',{mode:'longitude',siderealLongitude:lon}).result,json(subLordOf(lon)));
    for(const n of [1,76,249])assert.deepEqual(call('workbench_kp',{mode:'horary-number',horaryNumber:n}).result,json(kpForNumber(n)));
    for(const args of [{mode:'longitude'},{mode:'longitude',siderealLongitude:NaN},{mode:'horary-number',horaryNumber:1.2},{mode:'horary-number',horaryNumber:250}])assert.throws(()=>call('workbench_kp',args));
  });
  test('KP chart recalculates sidereal significators and retains non-KP house/node caveats',()=>{
    const r=call('workbench_kp',fixtures.workbench_kp);assert.deepEqual(r.result,json(kpSignificators(vedic(input))));assert.ok(r.result.flags.some(s=>s.includes('PLACIDUS')));assert.ok(r.result.flags.some(s=>s.includes('MEAN node')));
  });
  test('Prasna named options and source discrepancies preserve canonical ledger',()=>{
    const opts={quesitedHouse:2,kpNumber:76,direction:'north-east',question:'A study example, not a prediction.'};
    const r=call('workbench_prasna',{...input,...opts});assert.deepEqual(r.result,json(prasnaJudgement(vedic(input),opts)));assert.equal(r.result.kpNumber,76);assert.ok(r.result.lagna.overriddenByKpNumber);assert.ok(r.result.outOfScope.length);assert.ok(r.result.editionFlags.length);
    assert.equal(call('workbench_prasna',input).result.arudha,null);assert.equal(call('workbench_prasna',input).result.quesitedHouse,7);
  });
  test('Prasna rejects coercion, invalid direction and invented birth time',()=>{
    for(const patch of [{quesitedHouse:1.1},{quesitedHouse:13},{kpNumber:0},{kpNumber:'7'},{direction:'inferred'},{question:'x'.repeat(1001)},{dateISO:'2026-10-30'},{dateISO:'2026-10-30T12:00:00'}])assert.throws(()=>call('workbench_prasna',{...input,...patch}));
  });
  test('Muhurta full report and overlap timeline equal canonical functions',()=>{
    const r=call('workbench_muhurta',fixtures.workbench_muhurta);assert.deepEqual(r.result.report,json(muhurtaReport(new Date(input.dateISO),input.lat,input.lon)));assert.deepEqual(r.result.timeline,json(scanDay(new Date(input.dateISO),input.lat,input.lon)));assert.equal(r.result.report.muhurtas.length,30);assert.ok(r.methods.clockConvention.includes('labels the context only'));assert.ok(r.methods.openingPortionRules.includes('unresolved'));
  });
  test('Muhurta zone labels do not silently replace its inherited mean-solar algorithm',()=>{
    const a=call('workbench_muhurta',{...input,lat:1.8721,lon:-157.4278,timeZone:'Pacific/Kiritimati'}),b=call('workbench_muhurta',{...input,lat:1.8721,lon:-157.4278,timeZone:'Pacific/Honolulu'});
    assert.deepEqual(a.result,b.result);assert.notEqual(a.context.localDate,b.context.localDate);assert.ok(a.limitations.some(s=>s.includes('civilUTCVara')));
  });
  test('Polar Muhurta and Shatkarman remain explicitly unavailable',()=>{
    const polar={...input,dateISO:'2026-06-21T12:00:00Z',lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo'};
    for(const [name,extra] of [['workbench_muhurta',{includeTimeline:true}],['workbench_shatkarman',{act:'santi'}]]){const r=call(name,{...polar,...extra});assert.equal(r.status,'unavailable');assert.ok(r.unavailableReason);}
    assert.equal(call('workbench_muhurta',{...polar,includeTimeline:true}).result.timeline,null);
  });
  test('Shatkarman keeps all six named records descriptive and source-qualified',()=>{
    for(const act of ['santi','vasya','stambhana','vidvesana','uccatana','marana']){const r=call('workbench_shatkarman',{...input,act});assert.deepEqual(r.result,json(shatkarmanScreen(new Date(input.dateISO),input.lat,input.lon,act)));assert.ok(r.result.caveat.includes('nothing here is an instruction'));assert.ok(r.result.conflictNote);}
    assert.throws(()=>call('workbench_shatkarman',{...input,act:'invented'}));assert.throws(()=>call('workbench_shatkarman',input));
  });
  test('Tajika canonical return retains actual instant, source disputes and relocation',()=>{
    const annualObserver={lat:51.5074,lon:-.1278,timeZone:'Europe/London'},r=call('workbench_tajika',{birth,targetYear:2026,annualObserver});
    assert.deepEqual(r.result,json(varshaphala(chart(birth),2026,{lat:annualObserver.lat,lon:annualObserver.lon})));assert.equal(r.context.annual.lat,annualObserver.lat);assert.equal(r.context.annual.dateISO,r.result.varshaPravesha.instantISO);assert.ok(r.result.varshaPravesha.siderealMatchDeg<0.001);assert.ok(r.result.varsheshvara.dispute);assert.ok(r.result.sahams.correction);
  });
  test('Return adapters reject pre-birth year, same birth year, out-of-range and excessive span',()=>{
    for(const name of ['workbench_tajika','workbench_tithi_pravesha'])for(const targetYear of [1989,1990,1900,2100,NaN])assert.throws(()=>call(name,{birth,targetYear,...(name==='workbench_tithi_pravesha'?{mode:'annual'}:{})}));
    assert.throws(()=>call('workbench_tajika',{birth:{...birth,dateISO:'1900-06-01T00:00:00Z'},targetYear:2051}));
    assert.throws(()=>call('workbench_tajika',{birth:{...birth,dateISO:'1990-05-17'},targetYear:2026}));
    assert.throws(()=>call('workbench_tajika',{birth:{...birth,notes:'private'},targetYear:2026}));
  });
  test('Annual tithi solar and soli-lunar variants preserve every canonical candidate',()=>{
    for(const monthRule of ['solar','soliLunar']){const r=call('workbench_tithi_pravesha',{birth,mode:'annual',targetYear:2026,monthRule}),canonical=tithiPravesha(chart(birth),2026,{monthRule});assert.deepEqual(r.result,json(canonical));assert.equal(r.status,canonical.ambiguity.flag?'partial':'calculated');assert.ok(r.methods.clockConvention.includes('UTC civil'));assert.ok(r.result.anchorNote.includes('NO classical BPHS'));}
  });
  test('Monthly tithi returns use explicit start, count and bounded search buffer',()=>{
    const fromISO='2026-01-01T00:00:00Z',r=call('workbench_tithi_pravesha',{birth,mode:'monthly',fromISO,months:2});
    assert.deepEqual(r.result,json(monthlyPravesha(chart(birth),new Date(fromISO),2)));assert.equal(r.result.count,2);assert.ok(r.result.praveshas.every(p=>Date.parse(p.instantISO)>=Date.parse(fromISO)));
    for(const patch of [{fromISO:'1989-01-01T00:00:00Z'},{months:13},{months:0},{monthRule:'soliLunar'},{targetYear:2026},{fromISO:'2100-12-01T00:00:00Z'}])assert.throws(()=>call('workbench_tithi_pravesha',{birth,mode:'monthly',fromISO,months:2,...patch}));
    assert.throws(()=>call('workbench_tithi_pravesha',{birth,mode:'annual',targetYear:2026,fromISO}));
  });
  test('Kuta explicit birth charts reproduce both asymmetrical historical tables',()=>{
    const opts={variantSet:'common',vashyaSagCompletion:true},r=call('workbench_kuta',{groom:birth,bride,...opts}),g=vedic(birth).grahas.Moon.lon,b=vedic(bride).grahas.Moon.lon;
    assert.deepEqual(r.result.ashtakuta,json(ashtakuta(g,b,opts)));assert.deepEqual(r.result.porutham10,json(porutham10(g,b,opts)));assert.equal(r.context.computedSiderealMoon.groom,g);assert.equal(r.context.computedSiderealMoon.bride,b);assert.ok(r.methods.orientation.includes('Swapping'));
    assert.throws(()=>call('workbench_kuta',{groom:birth,bride,method:'porutham10',variantSet:'common'}));
  });
  test('Kuta omitted Sagittarius completion produces explicit unavailability',()=>{
    let sag=null;for(let day=1;day<=28;day++){const candidate={...birth,dateISO:`2026-10-${String(day).padStart(2,'0')}T12:00:00Z`};if(vedic(candidate).grahas.Moon.rashiIndex===8){sag=candidate;break;}}
    assert.ok(sag);const r=call('workbench_kuta',{groom:sag,bride,vashyaSagCompletion:false});assert.equal(r.status,'unavailable');assert.equal(r.result.ashtakuta,null);assert.equal(r.result.porutham10,null);assert.equal(r.unavailable.length,2);assert.ok(r.unavailable.every(x=>x.reason.includes('Sagittarius')));
  });
  test('Moment grid matches canonical full output and requested exact endpoint',()=>{
    const args={...fixtures.workbench_moments,hoursAhead:2,stepMinutes:20,operationKey:'knowledge'},r=call('workbench_moments',args);
    assert.deepEqual(r.result,json(scanMoments(new Date(args.fromISO),args.hoursAhead,args.lat,args.lon,{stepMinutes:args.stepMinutes,operationKey:args.operationKey})));assert.equal(r.result.rows.length,7);assert.equal(r.methods.samples,7);assert.equal(r.result.meta.to,r.context.requestedEndISO);assert.ok(r.methods.unresolvedRules.includes('not resolved'));
  });
  test('Moment scans reject zero-default coercion, rounded overshoot and excessive samples',()=>{
    for(const patch of [{hoursAhead:0},{hoursAhead:169},{hoursAhead:1,stepMinutes:7},{hoursAhead:168,stepMinutes:30},{stepMinutes:0},{stepMinutes:1.5},{operationKey:'fictional'}])assert.throws(()=>call('workbench_moments',{...fixtures.workbench_moments,...patch}));
    const r=call('workbench_moments',{...fixtures.workbench_moments,hoursAhead:168,stepMinutes:60});assert.equal(r.methods.samples,169);assert.equal(r.result.rows.length,169);assert.equal(r.context.requestedEndISO,r.result.meta.to);
  });
  test('Polar moments preserve partial columns without inventing available hours',()=>{
    const r=call('workbench_moments',{...fixtures.workbench_moments,fromISO:'2026-06-21T12:00:00Z',lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo'});assert.equal(r.status,'partial');assert.equal(r.unavailableSamples,r.result.rows.length);assert.ok(r.result.rows.every(row=>row.hour===null&&row.muhurta===null));assert.ok(r.result.rows.every(row=>row.panchanga.tithi));
  });
  test('Selected-century and exact-pole chart boundaries fail explicitly',()=>{
    for(const patch of [{dateISO:'1899-12-31T23:59:59Z'},{dateISO:'2101-01-01T00:00:00Z'},{dateISO:'1900-01-01T00:30:00Z',timeZone:'America/Los_Angeles'},{timeZone:'Not/AZone'},{lat:NaN},{lat:91},{lat:90}])assert.throws(()=>call('workbench_prasna',{...input,...patch}));
    assert.throws(()=>call('workbench_moments',{...fixtures.workbench_moments,fromISO:'2100-12-31T23:30:00Z',timeZone:'UTC'}));
  });
  test('Explicit offset inputs preserve exact fold occurrence without inferred local birth',()=>{
    const early=call('workbench_prasna',{...input,dateISO:'2026-11-01T01:30:00-04:00',timeZone:'America/New_York'}),late=call('workbench_prasna',{...input,dateISO:'2026-11-01T01:30:00-05:00',timeZone:'America/New_York'});assert.equal(early.context.localTime,late.context.localTime);assert.equal(Date.parse(late.context.dateISO)-Date.parse(early.context.dateISO),3600000);assert.notEqual(early.result.lagna.lon,late.result.lagna.lon);
  });
  test('Adapters require no network, storage, machine clock or host zone',()=>{
    const fetch=globalThis.fetch,tz=process.env.TZ;globalThis.fetch=()=>{throw new Error('Unexpected network');};
    try{process.env.TZ='Pacific/Honolulu';const first=call('workbench_prasna',input);process.env.TZ='Asia/Tokyo';assert.deepEqual(first,call('workbench_prasna',input));for(const tool of CALENDAR_MCP_TOOLS)call(tool.name,fixtures[tool.name]);}
    finally{globalThis.fetch=fetch;if(tz===undefined)delete process.env.TZ;else process.env.TZ=tz;}
  });
  return {pass:failures.length===0,count,passed:count-failures.length,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=run();console.log(`${result.pass?'PASS':'FAIL'} calendar MCP: ${result.count} groups`);result.failures.forEach(item=>console.error(item));process.exitCode=result.pass?0:1;}
