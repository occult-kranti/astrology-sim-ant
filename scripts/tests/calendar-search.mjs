import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {searchCalendarDates,compareSearchStrategies,normalizeCalendarSearchCriteria,normalizeCalendarSearchRequest,normalizeSearchEvents,parseSearchEventImport,buildEventCalendarSignature,analyzeEventCalendarAssociation,SEARCH_LIMITS} from '../../assets/js/core/calendar-search.js';
import {SEARCH_EVENT_PRESETS,SEARCH_EVENT_SOURCES} from '../../assets/js/core/data/calendar-search-events.js';
import {createCalendarSearchWorkerController} from '../../assets/js/workers/calendar-search-worker.js';

export async function run(){let count=0;const failures=[];const ok=(condition,message)=>{count++;if(!condition)failures.push(message);};const equal=(a,b,message)=>{try{assert.deepEqual(a,b);ok(true,message);}catch{ok(false,message);}};const rejects=async(fn,message)=>{try{await fn();ok(false,message);}catch{ok(true,message);}};
 const observer={lat:28.6139,lon:77.209,timeZone:'Asia/Kolkata'},base={startDate:'2026-10-01',endDate:'2026-10-31',observer,criteria:[]};
 equal(normalizeCalendarSearchCriteria([{kind:'weekday',values:[4,4]}]),[{kind:'weekday',values:[4]}],'Criteria can be edited and normalized without a range or observer');
 await rejects(()=>normalizeCalendarSearchCriteria([{kind:'lunar',field:'tithi',values:[31]}]),'Independent criteria editing retains strict canonical bounds');
 const benchmark=await compareSearchStrategies({...base,criteria:[{kind:'weekday',values:[1]},{kind:'lunar',field:'tithi',values:[1,2,3,4,5,6,7,8,9,10]}]});
 ok(benchmark.equivalence.identical,'Real weekday+lunar prefilters reproduce full brute-force rows/counts/unknowns');
 ok(benchmark.optimized.stats.canonicalEvaluations<benchmark.brute.stats.canonicalEvaluations&&benchmark.optimized.stats.earlyRejected>0,'Optimized strategy actually saves canonical evaluations');
 ok(benchmark.timing.bruteMs>0&&benchmark.timing.optimizedMs>0&&Number.isFinite(benchmark.timing.speedRatio),'Timings are actual finite measurements, separate from equivalence');
 equal(benchmark.brute.counts.processed,31,'Every selected civil date is visited');
 const cases=[
  {...base,startDate:'2024-04-06',endDate:'2024-04-10',criteria:[{kind:'lunar',field:'phaseIndex',values:[0]},{kind:'lunar',field:'karana',values:[1,2,59,60]}]},
  {...base,startDate:'2026-03-18',endDate:'2026-03-22',criteria:[{kind:'lunar',field:'nakshatra',values:[1,27]},{kind:'lunar',field:'yoga',values:[1,2,26,27]}]},
  {...base,startDate:'2026-10-27',endDate:'2026-10-31',criteria:[{kind:'rule',ruleId:'DG-J-YOGA',classifications:['unavailable']}]},
  {...base,startDate:'2026-10-27',endDate:'2026-10-31',concurrence:{traditionId:'western-lilly',classification:'favorable',minimum:2}},
  {...base,startDate:'2026-10-27',endDate:'2026-10-31',concurrence:{traditionId:'jyotisha-muhurta',classification:'caution',minimum:1}},
  {...base,startDate:'2025-07-24',endDate:'2025-07-27',observer:{...observer,timeZone:'Asia/Hong_Kong'},criteria:[{kind:'calendar',calendar:'chinese',field:'month',values:['Sixth Monthbis']}]},
  {...base,startDate:'2026-10-27',endDate:'2026-10-31',criteria:[{kind:'calendar',calendar:'gregory',field:'day',values:['29']},{kind:'calendar',calendar:'julian',field:'month',values:['10']}]},
  {...base,startDate:'2026-03-07',endDate:'2026-03-09',sampleTime:'02:30',observer:{lat:40.7,lon:-74,timeZone:'America/New_York'},criteria:[{kind:'weekday',values:[1]}]},
  {...base,startDate:'2026-10-31',endDate:'2026-11-02',sampleTime:'01:30',observer:{lat:40.7,lon:-74,timeZone:'America/New_York'},criteria:[{kind:'weekday',values:[1]}]},
  {...base,startDate:'2011-12-29',endDate:'2011-12-31',observer:{lat:-13.8,lon:-171.75,timeZone:'Pacific/Apia'},criteria:[{kind:'weekday',values:[1]}]},
  {...base,startDate:'1900-01-01',endDate:'1900-01-02',sampleTime:'00:30',observer:{lat:1.87,lon:-157.4,timeZone:'Pacific/Kiritimati'},criteria:[{kind:'weekday',values:[1]}]},
  {...base,startDate:'2100-12-30',endDate:'2100-12-31',sampleTime:'23:30',observer:{lat:21.3,lon:-157.8,timeZone:'Pacific/Honolulu'},criteria:[{kind:'weekday',values:[1]}]},
  {...base,startDate:'2026-06-20',endDate:'2026-06-22',observer:{lat:89,lon:0,timeZone:'UTC'},criteria:[{kind:'rule',ruleId:'DG-H-TEMPORAL',classifications:['unavailable']}]},
 ];
 for(const request of cases){const r=await compareSearchStrategies(request);ok(r.equivalence.identical,`Equivalent boundary/unknown semantics ${request.startDate}/${request.observer.timeZone}/${request.sampleTime||'noon'}`);}
 const fold=await searchCalendarDates(cases[8]);ok(fold.counts.unavailableSamples===1&&fold.unavailable[0].code==='AMBIGUOUS_TIME','Rejected fold is recorded even when civil early filter would reject that date');
 const skipped=await searchCalendarDates(cases[9]);ok(skipped.counts.unavailableSamples===1&&skipped.unavailable[0].date==='2011-12-30','Skipped date remains a missing sample rather than silently shifting');
 const utcEdge=await searchCalendarDates(cases[11]);ok(utcEdge.counts.unavailableSamples===1&&utcEdge.unavailable[0].code==='UTC_RANGE','Local in-range date cannot produce a silent 2101 UTC sample');
 const capped=await compareSearchStrategies({...base,maxResults:2});ok(capped.equivalence.identical&&capped.optimized.counts.matched===31&&capped.optimized.hits.length===2&&capped.optimized.counts.truncated,'Return cap does not stop scanning or erase total match count');
 const rankedRequest={...base,concurrence:{traditionId:'western-lilly',classification:'favorable',minimum:1}};
 const uncapped=await searchCalendarDates({...rankedRequest,maxResults:100},{mode:'brute'}),firstOnly=await searchCalendarDates({...rankedRequest,maxResults:1}),ranked=await compareSearchStrategies({...rankedRequest,order:'concurrence',maxResults:3});
 const reference=uncapped.hits.slice().sort((a,b)=>b.ruleCounts.find(r=>r.traditionId==='western-lilly').favorable-a.ruleCounts.find(r=>r.traditionId==='western-lilly').favorable||a.date.localeCompare(b.date)).slice(0,3);
 equal(ranked.optimized.hits.map(h=>h.date),reference.map(h=>h.date),'Bounded top-K equals independently full-sorted uncapped reference, including date ties');
 ok(ranked.equivalence.identical&&ranked.equivalence.bruteCandidateCount===uncapped.counts.matched&&ranked.optimized.counts.matched===uncapped.counts.matched,'Rank ordering preserves every match identity and total beyond the retained cap');
 ok(ranked.optimized.hits[0].date>firstOnly.hits[0].date&&ranked.optimized.hits[0].rank.knownCount>firstOnly.hits[0].ruleCounts.find(r=>r.traditionId==='western-lilly').favorable,'A later higher count replaces an early first-cap result');
 ok(firstOnly.order==='chronological'&&firstOnly.hits[0].rank===null,'Chronological order remains the default without a ranking claim');
 ok(ranked.optimized.hits.every((h,i)=>h.rank.position===i+1&&h.rank.totalRules===6&&h.rank.knownCount<=h.rank.availableRules&&!('score'in h.rank)),'Rank exposes chosen tradition counts and denominators, not a combined score');
 const partialRank=await searchCalendarDates({...base,startDate:'2026-10-29',endDate:'2026-10-29',observer:{lat:89,lon:0,timeZone:'UTC'},order:'concurrence',concurrence:{traditionId:'jyotisha-muhurta',classification:'favorable',minimum:1}});
 ok(partialRank.hits.length===1&&partialRank.hits[0].rank.unavailableRules===1&&!partialRank.hits[0].rank.completeForChosenTradition&&!partialRank.hits[0].fullyObserved,'Polar sample with untimed yoga retains an explicitly partial known-count rank');
 const polarRank=await searchCalendarDates({...base,startDate:'2026-06-21',endDate:'2026-06-21',observer:{lat:89,lon:0,timeZone:'UTC'},order:'concurrence',concurrence:{traditionId:'western-lilly',classification:'favorable',minimum:1},criteria:[{kind:'rule',ruleId:'DG-H-TEMPORAL',classifications:['unavailable']}]});
 ok(polarRank.hits.length===1&&!polarRank.hits[0].fullyObserved&&polarRank.hits[0].rank.completeForChosenTradition,'Missing selected temporal hour remains distinct from completeness of the chosen Western count');
 await rejects(()=>searchCalendarDates({...base,order:'concurrence'}),'Count order requires an explicitly chosen tradition and class');
 await rejects(()=>searchCalendarDates({...base,order:'best-day'}),'Unknown implicit outcome ranking is rejected');
 for(const lat of [-90,90]){const errors=[];for(const mode of ['brute','optimized'])try{await searchCalendarDates({...base,startDate:'2026-10-29',endDate:'2026-10-29',observer:{lat,lon:0,timeZone:'UTC'},criteria:[{kind:'weekday',values:[1]}]},{mode});}catch(error){errors.push({name:error.name,message:error.message});}ok(errors.length===2&&errors[0].message===errors[1].message&&/exact geographic pole/.test(errors[0].message),'Exact pole rejected before either strategy can hide a house-engine error '+lat);}
 await rejects(()=>normalizeCalendarSearchCriteria([{kind:'calendar',calendar:'chinese',field:'year',values:['2026']}]),'Chinese related year is not silently renamed year');
 await rejects(()=>normalizeCalendarSearchCriteria([{kind:'calendar',calendar:'gregory',field:'era',values:['AD']}]),'Absent Gregorian era field rejected as unsupported');
 const related=await compareSearchStrategies({...base,startDate:'2025-07-24',endDate:'2025-07-27',criteria:[{kind:'calendar',calendar:'chinese',field:'relatedYear',values:['2025']}]});ok(related.equivalence.identical&&related.optimized.counts.matched===4,'Chinese relatedYear is explicitly searchable across its leap-month boundary');
 const OriginalDateTimeFormat=Intl.DateTimeFormat;
 try{Intl.DateTimeFormat=function(locales,options){const formatter=new OriginalDateTimeFormat(locales,options);if(options?.calendar==='hebrew'){const parts=formatter.formatToParts.bind(formatter);formatter.formatToParts=date=>parts(date).filter(p=>p.type!=='era');}return formatter;};
  const absent=await compareSearchStrategies({...base,startDate:'2026-10-28',endDate:'2026-10-30',criteria:[{kind:'weekday',values:[1]},{kind:'calendar',calendar:'hebrew',field:'era',values:['AM']}]});
  ok(absent.equivalence.identical&&absent.optimized.counts.matched===0&&absent.optimized.counts.missingCalendarFieldSamples===3&&absent.optimized.missingCalendarFields[0].missingSamples===3,'Runtime-absent fields are counted across all dates even when another early criterion rejects them');
 }finally{Intl.DateTimeFormat=OriginalDateTimeFormat;}
 const whole=normalizeCalendarSearchRequest({...base,startDate:'1900-01-01',endDate:'2100-12-31',maxDays:73414});ok(whole.maxDays===SEARCH_LIMITS.maxDays,'Explicit advanced request admits the entire supported civil range without executing it synchronously');
 for(const patch of [{startDate:'2026-02-30'},{endDate:'2026-09-01'},{maxDays:0},{maxDays:73415},{maxResults:1001},{sampleTime:'25:00'},{observer:{...observer,lat:91}},{observer:{...observer,timeZone:'Not/AZone'}},{criteria:[{kind:'lunar',field:'phaseIndex',values:[8]}]},{criteria:[{kind:'rule',ruleId:'fake',classifications:['favorable']}]},{criteria:[{kind:'calendar',calendar:'kabbalah',field:'month',values:['1']}]},{concurrence:{traditionId:'all',classification:'favorable',minimum:2}}]){
  await rejects(()=>searchCalendarDates({...base,...patch},{mode:'brute'}),'Brute rejects invalid request '+JSON.stringify(patch));await rejects(()=>searchCalendarDates({...base,...patch},{mode:'optimized'}),'Optimized rejects the same invalid request '+JSON.stringify(patch));
 }
 await rejects(()=>searchCalendarDates({...base,startDate:'1900-01-01',endDate:'2100-12-31'}),'Full range requires explicit expansion beyond default366 days');
 let stopped=false;await rejects(()=>searchCalendarDates(base,{onProgress:p=>{if(p.processed>=4)stopped=true;},shouldCancel:()=>stopped}),'Chunked search cooperatively cancels without publishing a complete result');
 const events=[{id:'a',title:'Synthetic Thursday',date:'2026-10-29'},{id:'b',title:'Synthetic Friday',date:'2026-10-30'}];
 const association=await analyzeEventCalendarAssociation({events,observer,acknowledged:true,criteria:[{kind:'weekday',values:[4]}],controlDayOffsets:[-1,1]});
 equal(association.overall.event,{total:2,observed:2,missing:0,matched:1,rate:.5},'Event denominator and one-of-two match are independently reconstructible');
 equal(association.overall.control,{total:4,observed:4,missing:0,matched:1,rate:.25},'Four shifted rows retain their actual denominator');
 equal(association.overall.proportionDifference,.25,'Effect is selected-feature frequency difference');equal(association.overall.rateRatio,2,'Frequency ratio uses observed denominators');
 ok(association.overall.offsetComparisons.find(x=>x.offsetDays===1).rateRatio===null&&association.overall.offsetComparisons.find(x=>x.offsetDays===1).ratioStatus==='undefined-zero-control-frequency','Zero baseline frequency has explicit undefined ratio, never zero/infinity disguised as evidence');
 ok(association.counts.controlDatesOverlappingEvents===2&&association.stats.cacheHits>0,'Overlapping event/control dates are disclosed and reused computationally, not independent replications');
 const duplicated=await analyzeEventCalendarAssociation({events:[events[0],{...events[0],id:'c'}],observer,acknowledged:true,criteria:[{kind:'weekday',values:[4]}],controlDayOffsets:[7]});
 ok(duplicated.counts.duplicateEventDates===1&&duplicated.counts.uniqueControlDates===1&&duplicated.overall.event.total===2,'Duplicate dates remain explicitly event-weighted with distinct unique-date denominator');
 const boundary=await analyzeEventCalendarAssociation({events:[{id:'boundary',title:'Synthetic range boundary',date:'1900-01-01'}],observer:{lat:0,lon:0,timeZone:'UTC'},acknowledged:true,criteria:[{kind:'weekday',values:[1]}],controlDayOffsets:[-1,1]});
 ok(boundary.overall.control.missing===1&&boundary.overall.control.observed===1&&boundary.overall.offsetComparisons.find(r=>r.offsetDays===-1).pairedEligible===0,'Out-of-range controls are missing, with paired offset denominator excluded');
 const missingYoga=await analyzeEventCalendarAssociation({events:[events[0]],observer,acknowledged:true,criteria:[{kind:'rule',ruleId:'DG-J-YOGA',classifications:['caution']}],controlDayOffsets:[1]});
 ok(missingYoga.features[0].event.observed===0&&missingYoga.features[0].event.missing===1&&missingYoga.features[0].event.rate===null,'Unresolved opening yoga is missing, not a known absence of caution');
 await rejects(()=>analyzeEventCalendarAssociation({events:[events[0]],observer,acknowledged:true,criteria:[{kind:'rule',ruleId:'DG-J-YOGA',classifications:['unavailable']}],controlDayOffsets:[1]}),'Association cannot treat unavailable information as an observed outcome class');
 await rejects(()=>analyzeEventCalendarAssociation({events:[events[0]],observer,acknowledged:true,criteria:[{kind:'rule',ruleId:'DG-J-YOGA',classifications:['caution','unavailable']}],controlDayOffsets:[1]}),'Mixed missing/observed association target is rejected explicitly');
 const signature=await buildEventCalendarSignature(events[0],{observer,acknowledged:true,selectedFields:['phaseIndex','tithi','nakshatra','calendar:gregory:day','rule:DG-W-LIGHT']});
 const reproduction=await searchCalendarDates({...base,startDate:events[0].date,endDate:events[0].date,criteria:signature.suggestedCriteria});ok(reproduction.counts.matched===1&&signature.sample.sampleUTC===reproduction.hits[0].sampleUTC,'Event→selected signature→calendar search reproduces the same explicit sample');
 await rejects(()=>buildEventCalendarSignature(events[0],{observer}),'No silent event timestamp from date-only record');
 await rejects(()=>analyzeEventCalendarAssociation({events,observer,acknowledged:true,criteria:[]}), 'Association cannot silently compare an empty all-matching feature set');
 await rejects(()=>analyzeEventCalendarAssociation({events,observer,acknowledged:true,criteria:[{kind:'weekday',values:[4]}],controlDayOffsets:[0]}),'Event day cannot be silently used as its own zero-shift control');
 const csv=parseSearchEventImport('id,title,date,sourceUrl\r\na,"A, quoted title",2026-10-29,https://example.org/date\r\n');ok(Array.isArray(csv)&&csv[0].title==='A, quoted title'&&csv[0].sourceStatus.includes('caller-supplied'),'CSV quotes preserve title while imported evidence stays unverified');
 await rejects(()=>parseSearchEventImport('title,date\n"A"extra,2026-10-29'),'Text after a closing CSV quote is rejected instead of silently changing a title');
 const optionalCSV=parseSearchEventImport('id,title,date,precision,sourceId\n,Example,2026-10-29,,');ok(optionalCSV[0].id==='import-1'&&optionalCSV[0].precision==='date-only'&&optionalCSV[0].sourceId===null,'Blank optional CSV cells remain omitted fields, without inventing source evidence');
 const imported=parseSearchEventImport(JSON.stringify([{...events[0],sourceStatus:'verified',fakePrediction:100}]),'json');ok(imported[0].sourceStatus.includes('caller-supplied')&&!('fakePrediction'in imported[0]),'Imported provenance claims and undeclared metadata do not become trusted outputs');
 await rejects(()=>parseSearchEventImport('title,date\n"Unclosed,2026-10-29'),'Malformed CSV rejected');await rejects(()=>parseSearchEventImport('x'.repeat(100001)),'Import size bound enforced');await rejects(()=>normalizeSearchEvents(Array.from({length:101},(_,i)=>({...events[0],id:String(i)}))),'Event row bound enforced');await rejects(()=>normalizeSearchEvents([{...events[0],sourceUrl:'javascript:alert(1)'}]),'Unsafe source scheme rejected');
 ok(SEARCH_EVENT_PRESETS.length===9&&SEARCH_EVENT_PRESETS.every(e=>e.outcomeValence===null&&e.precision==='date-only'&&SEARCH_EVENT_SOURCES.some(s=>s.id===e.sourceId)),'All nine convenience presets resolve actual date sources without outcome valence');
 let messages=[];const worker=createCalendarSearchWorkerController(m=>messages.push(m));
 await worker.handleMessage({type:'start',jobId:'ok_job',operation:'search',request:{...base,startDate:'2026-10-29',endDate:'2026-10-29'}});ok(messages.some(m=>m.type==='progress'&&m.jobId==='ok_job')&&messages.some(m=>m.type==='result'&&m.jobId==='ok_job'),'Worker result/progress retain exact job ID');
 messages=[];const pending=worker.handleMessage({type:'start',jobId:'cancel_job',operation:'search',request:base});await worker.handleMessage({type:'start',jobId:'busy_job',operation:'search',request:base});await worker.handleMessage({type:'cancel',jobId:'cancel_job'});await pending;
 ok(messages.some(m=>m.type==='error'&&m.jobId==='busy_job'&&m.error.code==='BUSY'),'Worker refuses concurrent job without replacing active input');ok(messages.some(m=>m.type==='cancelled'&&m.jobId==='cancel_job')&&!messages.some(m=>m.type==='result'&&m.jobId==='cancel_job')&&worker.activeJobId===null,'Worker cancellation suppresses success and releases active job');
 messages=[];await worker.handleMessage({type:'start',jobId:'bad_job',operation:'search',request:{...base,sampleTime:'bad'}});ok(messages.length===1&&messages[0].type==='error'&&messages[0].jobId==='bad_job','Worker errors remain attached to the submitted job');
 ok(!('pValue'in association)&&association.limitations.some(s=>/not randomized/.test(s))&&association.limitations.some(s=>/selection bias/.test(s)),'No shifted-date comparison becomes a significance test or causal forecast');
 return{pass:failures.length===0,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(`${r.pass?'PASS':'FAIL'} calendar search: ${r.count} checks`);r.failures.forEach(f=>console.error(f));process.exitCode=r.pass?0:1;}
