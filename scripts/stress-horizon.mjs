// Full-range release stress. Writes only a compact receipt; ledgers stay in RAM.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,resolve,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildEventHorizon,benchmarkHorizonStrategies,validateHorizonLedger,rankHorizonDates,eventsForHorizonDate,getHorizonDayDetail,HORIZON_DEFAULT_REQUEST,HORIZON_CASES,HORIZON_PURPOSES,HORIZON_LIMITS} from '../assets/js/core/event-horizon.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),driver=fileURLToPath(import.meta.url);
const sha=value=>createHash('sha256').update(value).digest('hex');
const DAY=86400000;
async function pathsBelow(path){const result=[];for(const item of await readdir(path,{withFileTypes:true})){const p=resolve(path,item.name);if(item.isDirectory())result.push(...await pathsBelow(p));else if(item.name.endsWith('.js'))result.push(p);}return result;}
async function sourceBinding(){
  // A documented dependency superset, not a regex approximation of imports.
  const paths=[...await pathsBelow(resolve(root,'assets/js/core')),...await pathsBelow(resolve(root,'assets/js/lib')),resolve(root,'assets/js/workers/event-horizon-worker.js')].filter(p=>relative(root,p)!=='assets/js/core/data/horizon-preset-version.js').sort();
  return Object.fromEntries(await Promise.all(paths.map(async p=>[relative(root,p),sha(await readFile(p))])));
}
function independentDates(start,end){const dates=[];for(let time=Date.parse(start+'T12:00:00Z');time<=Date.parse(end+'T12:00:00Z');time+=DAY)dates.push(new Date(time).toISOString().slice(0,10));return dates;}
function memory(){const usage=process.memoryUsage();return{rssBytes:usage.rss,heapUsedBytes:usage.heapUsed,heapTotalBytes:usage.heapTotal,externalBytes:usage.external};}
function histogram(rows,key){const out={};for(const row of rows){const value=key(row);out[value]=(out[value]||0)+1;}return out;}

export async function reviewPolarHorizonCase(result,{caseId='max-tromso',onProgress}={}){
  const started=performance.now(),polar=result.cases.find(c=>c.id===caseId);assert.ok(polar,'Requested polar case is present.');
  const unrankable=polar.rows.filter(r=>!r.purposeResults[0].rankable),rankable=polar.rows.filter(r=>r.purposeResults[0].rankable);
  assert.ok(unrankable.length>100&&rankable.length>100);assert.ok(polar.rows.every(r=>r.status==='available'&&r.sampleUTC));assert.ok(unrankable.every(r=>r.purposeResults[0].missing.length>0));
  let inspected=0;
  for(const row of polar.rows){
    // The compact row.astronomy is the phase summary. House convention lives
    // in the canonical detailed Western chart, recomputed from the stored UTC.
    const detail=getHorizonDayDetail(result,caseId,row.date),chart=detail.comparison.western;
    assert.equal(detail.comparison.context.dateISO,row.sampleUTC);assert.equal(chart.requestedHouseSystem,'placidus');assert.equal(chart.houseSystem,'regiomontanus');assert.ok(chart.limitations.some(x=>x.includes('Placidus is unavailable above 66')));
    inspected++;if(inspected%32===0||inspected===polar.rows.length){onProgress?.({inspected,total:polar.rows.length});await new Promise(resolve=>setImmediate(resolve));}
  }
  return{rows:polar.rows.length,inspected,rankable:rankable.length,unrankable:unrankable.length,requestedHouseSystem:'placidus',actualHouseSystem:'regiomontanus',warningCheckedEveryRow:true,scope:'Canonical detail recomputed from each stored UTC sample; house conventions are not stored in the compact phase-summary field.',elapsedMs:performance.now()-started};
}

export async function runHorizonStress({output=resolve(root,'test-results/horizon-stress/receipt.json'),onProgress}={}){
  const started=performance.now(),receipt={schemaVersion:1,kind:'complete-horizon-stress',startedAt:new Date().toISOString(),runtime:{...process.versions,platform:process.platform,arch:process.arch},driverSHA256:sha(await readFile(driver)),sourceBindingScope:'All core and bundled-library JavaScript plus the event-horizon worker; dependency superset. Excludes only assets/js/core/data/horizon-preset-version.js: the concurrently generated preset-loader binding is unused by these calculation paths.',sourceBefore:await sourceBinding(),checks:[],stages:[],memory:{initial:memory(),sampledPeakRSSBytes:process.memoryUsage().rss},performanceContext:'Wall timings on this runtime; workload is not CPU-isolated. The authorized initial run may overlap preset generation. Ratios test implementation cost, not independent predictive validity.',noBrowser:true,complete:false};
  let previousProgress='';
  const sampleMemory=()=>{receipt.memory.sampledPeakRSSBytes=Math.max(receipt.memory.sampledPeakRSSBytes,process.memoryUsage().rss);};
  const progress=(stage,value)=>{
    sampleMemory();const total=value.totalSamples??0,done=value.processedSamples??0,bucket=total?Math.floor(10*done/total):0,key=`${stage}:${value.strategy??''}:${value.phase}:${bucket}`;
    if(key!==previousProgress){previousProgress=key;onProgress?.({stage,strategy:value.strategy??null,phase:value.phase,processedSamples:done,totalSamples:total,elapsedSeconds:(performance.now()-started)/1000,rssBytes:process.memoryUsage().rss});}
  };
  const hooks=stage=>({yieldControl:()=>new Promise(resolve=>setImmediate(resolve)),onProgress:value=>progress(stage,value)});
  const check=async(label,fn)=>{const start=performance.now();try{await fn();receipt.checks.push({label,pass:true,elapsedMs:performance.now()-start});}catch(error){receipt.checks.push({label,pass:false,message:error.message,elapsedMs:performance.now()-start});}};
  function ledgerSummary(result){
    return{request:result.request,counts:result.counts,stats:result.stats,serializedBytes:Buffer.byteLength(JSON.stringify(result)),caseMissingness:result.cases.map(c=>({id:c.id,total:c.rows.length,unavailable:c.rows.filter(r=>r.status!=='available').length,clockReasons:histogram(c.rows.filter(r=>r.status!=='available'),r=>r.reasonCode??r.reason),profiles:result.request.purposeIds.map(id=>({id,rankable:c.rows.filter(r=>r.purposeResults.find(p=>p.id===id)?.rankable).length,missingRuleCounts:histogram(c.rows.flatMap(r=>r.purposeResults.find(p=>p.id===id)?.missing??[]),m=>m.id)}))})),astronomy:{events:result.astronomy.events.length,stats:result.astronomy.stats,range:result.astronomy.range??null,window:result.astronomy.window},observances:{rows:result.observances.length,uniqueOriginIds:new Set(result.observances.map(x=>x.originId)).size}};
  }
  async function reviewLedger(result,label,{checkEvents=true}={}){
    const dates=independentDates(result.request.startDate,result.request.endDate),cases=result.cases.length,profiles=result.request.purposeIds.length;
    await check(`${label}: canonical structural/clock/source/accounting validator accepts`,()=>assert.equal(validateHorizonLedger(result),result));
    await check(`${label}: independent complete Gregorian grid and all calendar/profile slots`,()=>{
      for(const c of result.cases){assert.deepEqual(c.rows.map(r=>r.date),dates);assert.ok(c.rows.every(r=>r.calendars.length===13&&r.purposeResults.length===profiles));}
      assert.equal(result.counts.totalSamples,dates.length*cases);assert.equal(result.counts.processedSamples,dates.length*cases);assert.equal(result.counts.calendarRows,dates.length*cases*13);assert.equal(result.counts.profileResults,dates.length*cases*profiles);assert.equal(result.counts.truncated,false);assert.equal(result.counts.availableSamples+result.counts.unavailableSamples,result.counts.totalSamples);
    });
    for(const c of result.cases)for(const purposeId of result.request.purposeIds){
      await check(`${label}: ${c.id}/${purposeId} independent score-frequency ranks and exact ties`,()=>{
        const values=c.rows.map(r=>r.purposeResults.find(p=>p.id===purposeId)),rankable=values.filter(p=>p.rankable),denominators=new Set(rankable.map(p=>p.scoreDenominator));assert.ok(denominators.size<=1);
        const frequencies=new Map();for(const p of rankable)frequencies.set(p.scoreNumerator,(frequencies.get(p.scoreNumerator)||0)+1);
        for(const order of ['best','worst']){
          const expected=new Map();let at=1;for(const number of [...frequencies.keys()].sort((a,b)=>order==='best'?b-a:a-b)){expected.set(number,{rank:at,tieSize:frequencies.get(number)});at+=frequencies.get(number);}
          const ranked=rankHorizonDates(result,{caseId:c.id,purposeId,order});assert.equal(ranked.rows.length,rankable.length);assert.equal(ranked.rows.length+ranked.unrankableCount,c.rows.length);
          for(const row of ranked.rows){const p=row.purposeResults.find(p=>p.id===purposeId);assert.equal(row.ranking.rank,expected.get(p.scoreNumerator).rank);assert.equal(row.ranking.tieSize,expected.get(p.scoreNumerator).tieSize);}
        }
      });
    }
    if(checkEvents)for(const c of result.cases)await check(`${label}: every ${c.id} event indexed exactly once on its independent civil date`,()=>{
      const format=new Intl.DateTimeFormat('en-CA',{timeZone:c.observer.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}),expected=result.astronomy.events.filter(e=>{const date=format.format(new Date(e.startUTC));return date>=result.request.startDate&&date<=result.request.endDate;}).map(e=>e.id),actual=[];
      for(const date of dates)for(const e of eventsForHorizonDate(result,c.id,date).astronomy){assert.equal(format.format(new Date(e.startUTC)),date);actual.push(e.id);}
      assert.deepEqual(actual,expected);assert.equal(new Set(actual).size,actual.length);
    });
    sampleMemory();
  }
  try{
    let benchmark=await benchmarkHorizonStrategies(HORIZON_DEFAULT_REQUEST,hooks('default-full-benchmark'));
    await check('Default full brute/optimized semantic outputs are exactly identical',()=>assert.equal(benchmark.equivalence.identical,true));
    await check('Default full grid is exactly1525dates ×3cases ×4profiles',()=>{assert.equal(benchmark.optimized.counts.days,1525);assert.equal(benchmark.optimized.counts.cases,3);assert.equal(benchmark.optimized.request.purposeIds.length,4);assert.equal(benchmark.optimized.counts.processedSamples,4575);assert.equal(benchmark.optimized.counts.profileResults,18300);assert.equal(benchmark.optimized.counts.calendarRows,59475);});
    await check('Default full computation really performs18300brute and4575shared canonical calls',()=>{assert.equal(benchmark.brute.stats.canonicalCalls,18300);assert.equal(benchmark.optimized.stats.canonicalCalls,4575);assert.equal(benchmark.brute.stats.guidanceCalls,18300);assert.equal(benchmark.optimized.stats.guidanceCalls,4575);});
    await reviewLedger(benchmark.brute,'default brute',{checkEvents:false});
    await reviewLedger(benchmark.optimized,'default optimized');
    receipt.stages.push({id:'default-full-benchmark',equivalence:benchmark.equivalence,timing:benchmark.timing,brute:ledgerSummary(benchmark.brute),optimized:ledgerSummary(benchmark.optimized)});benchmark=null;

    const hourProfile=HORIZON_PURPOSES.find(p=>p.contributions.some(c=>c.dependencyGroup==='local-solar-hour'));
    assert.ok(hourProfile,'Expected an explicitly hour-dependent profile for polar missingness stress.');
    const maxRequest={...HORIZON_DEFAULT_REQUEST,startDate:HORIZON_LIMITS.minDate,endDate:HORIZON_LIMITS.maxDate,purposeIds:[hourProfile.id],includeAstronomy:false,includeObservances:false,cases:[
      {...HORIZON_CASES[0],id:'max-london',label:'Maximum grid · London'},
      {...HORIZON_CASES[2],id:'max-ny-gap',label:'Maximum grid · New York 02:30 gap',sampleTime:'02:30',disambiguation:'reject'},
      {...HORIZON_CASES[2],id:'max-ny-fold',label:'Maximum grid · New York 01:30 fold',sampleTime:'01:30',disambiguation:'reject'},
      {id:'max-tromso',label:'Maximum grid · Tromsø polar hours',lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo',sampleTime:'12:00',system:'placidus',disambiguation:'reject'},
    ]};
    let maximum=await buildEventHorizon(maxRequest,hooks('maximum-four-case-grid'));
    await reviewLedger(maximum,'maximum grid',{checkEvents:false});
    await check('Maximum editable grid covers both endpoints:1827dates ×4cases ×1profile',()=>{assert.equal(maximum.counts.days,1827);assert.equal(maximum.counts.cases,4);assert.equal(maximum.counts.processedSamples,7308);assert.equal(maximum.counts.calendarRows,95004);assert.equal(maximum.counts.profileResults,7308);for(const c of maximum.cases){assert.equal(c.rows[0].date,'2026-01-01');assert.equal(c.rows.at(-1).date,'2031-01-01');}});
    await check('Five annual New York gaps and folds remain missing, with no invented sample',()=>{for(const id of ['max-ny-gap','max-ny-fold']){const rows=maximum.cases.find(c=>c.id===id).rows,missing=rows.filter(r=>r.status==='unavailable');assert.equal(missing.length,5);assert.ok(missing.every(r=>r.sampleUTC===null&&r.purposeResults.every(p=>!p.rankable&&p.score===null&&p.observed===0)));}});
    await check('Polar hour missingness remains distinct from valid clock samples and real house fallback',async()=>{receipt.polarFallback=await reviewPolarHorizonCase(maximum,{onProgress:p=>progress('polar-canonical-detail',{phase:'validation',processedSamples:p.inspected,totalSamples:p.total})});});
    await check('Maximum-grid omitted event/observance layers are explicit empty layers, not partial enabled searches',()=>{assert.equal(maximum.request.includeAstronomy,false);assert.equal(maximum.request.includeObservances,false);assert.equal(maximum.counts.eventCount,0);assert.equal(maximum.counts.observanceRows,0);assert.ok(maximum.astronomy.limitations.some(x=>x.includes('disabled')));});
    receipt.stages.push({id:'maximum-four-case-grid',scope:'Full editable date/case/profile grid; astronomy and observances explicitly disabled because the complete default benchmark already exercises those layers twice.',result:ledgerSummary(maximum)});maximum=null;
    receipt.complete=true;
  }catch(error){receipt.failure={name:error.name,message:error.message,stack:error.stack};}
  receipt.sourceAfter=await sourceBinding();await check('Scientific dependency-superset hashes remain unchanged throughout full stress',()=>assert.deepEqual(receipt.sourceAfter,receipt.sourceBefore));
  sampleMemory();receipt.memory.final=memory();receipt.memory.processLifetimeMaxRSSBytes=process.resourceUsage().maxRSS*1024;receipt.elapsedMs=performance.now()-started;receipt.finishedAt=new Date().toISOString();receipt.pass=receipt.complete&&!receipt.failure&&receipt.checks.every(c=>c.pass);receipt.checkCount=receipt.checks.length;receipt.failures=receipt.checks.filter(c=>!c.pass).map(c=>({label:c.label,message:c.message}));
  await mkdir(dirname(resolve(output)),{recursive:true});await writeFile(resolve(output),JSON.stringify(receipt,null,2)+'\n');return receipt;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const args=process.argv.slice(2);let output=resolve(root,'test-results/horizon-stress/receipt.json');
  for(let i=0;i<args.length;i++){if(args[i]==='--output'&&args[i+1])output=resolve(args[++i]);else if(args[i]==='--help'){console.log('node scripts/stress-horizon.mjs [--output receipt.json]\nRuns the complete default brute/optimized horizon and maximum four-case grid. Writes a summary receipt only.');process.exit(0);}else throw new Error('Unknown or incomplete argument: '+args[i]);}
  const result=await runHorizonStress({output,onProgress:p=>console.error(JSON.stringify({progress:p}))});
  console.log(JSON.stringify({pass:result.pass,complete:result.complete,checks:result.checkCount,elapsedMs:result.elapsedMs,peakRSSBytes:result.memory.processLifetimeMaxRSSBytes,failures:result.failures,failure:result.failure??null,receipt:output},null,2));if(!result.pass)process.exitCode=1;
}
