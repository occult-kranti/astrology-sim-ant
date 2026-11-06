// Reproducible public illustration, fixed before its results were inspected.
// It is not an outcome-labelled study or a search for auspicious/dangerous dates.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { buildTimelineSearch, serializeTimelineSearchJSON } from '../assets/js/core/timeline-search.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const position=process.argv.indexOf('--out');
if(position<0||!process.argv[position+1])throw Error('Supply --out /a/fresh/artifact/directory.');
const out=resolve(process.argv[position+1]);
if(existsSync(out))throw Error('Choose a fresh directory; earlier receipts are retained.');
mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const request={
  timeline:{startDate:'2026-11-06',endDate:'2029-11-05',time:'12:00',timeZone:'UTC',lat:51.4779,lon:0,system:'whole',disambiguation:'reject'},
  criteria:[{kind:'lunar',field:'tithi',values:[1,15,16,30]},{kind:'lunar',field:'nakshatra',values:[1,10,19]},{kind:'weekday',values:[1,3,5]}],
  map:{mode:'transit',maxDistanceKm:300,minimumLines:1}, mode:'optimized'
};
function graph(entry,seen=new Map()){
  const path=resolve(entry);if(seen.has(path))return seen;
  const content=readFileSync(path,'utf8');seen.set(path,sha(content));
  for(const match of content.matchAll(/(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g)){
    if(match[1].startsWith('.'))graph(resolve(dirname(path),match[1]),seen);
  }
  return seen;
}
const sources=()=>Object.fromEntries([...graph(resolve(root,'assets/js/core/timeline-search.js'))].sort().map(([p,h])=>[p.slice(root.length+1),h]));
const before=sources(),startedAt=new Date().toISOString();
const freeze={schemaVersion:1,startedAt,request,requestSHA256:sha(JSON.stringify(request)),sourceHashes:before,
  selection:'Arbitrary illustrative conditions fixed before this run; no claim of privileged dates, preregistered scientific validation or outcome calibration.',
  referencePopulation:'Every available noon UTC sample at Greenwich in the declared three-year window.',outcomeLabels:false};
writeFileSync(resolve(out,'request-freeze.json'),JSON.stringify(freeze,null,2)+'\n');
let bucket=-1;
const result=await buildTimelineSearch(request,{onProgress:p=>{const n=Math.floor(p.processed/256);if(n!==bucket){bucket=n;console.log(JSON.stringify({phase:p.phase,processed:p.processed,total:p.total}));}}});
const canonical=JSON.stringify(({stats,request,...rest})=>rest);
const semantic=r=>{const{stats,request,...rest}=r;return JSON.stringify({...rest,request:{...request,mode:'compared-separately'}});};
const expected=sha(semantic(result));
const brute=await buildTimelineSearch({...request,mode:'brute'});
if(sha(semantic(brute))!==expected)throw Error('Complete optimized/brute ledger differs.');
const after=sources();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Calculation source changed during the study.');
const data=Buffer.from(serializeTimelineSearchJSON(result)),compressed=gzipSync(data,{level:6});
writeFileSync(resolve(out,'complete-ledger.json.gz'),compressed);
const receipt={schemaVersion:1,kind:'public-three-year-calendar-map-illustration',startedAt,completedAt:new Date().toISOString(),request:result.request,
  counts:result.counts,calendarRows:result.rows.reduce((n,r)=>n+r.calendars.length,0),mapDistances:result.rows.reduce((n,r)=>n+(r.map?.distances.length??0),0),
  optimizedStats:result.stats,bruteStats:brute.stats,completeSemanticParity:true,semanticSHA256:expected,sourceStable:true,sourceHashes:after,runtime:result.runtime,
  statistics:result.statistics,matchedDates:result.rows.filter(r=>r.matched).map(r=>({date:r.date,sampleUTC:r.sampleUTC,conditions:r.criteriaResults,mapNearCount:r.map.selectedNearCount,closestSelectedDistanceKm:r.map.closestSelectedDistanceKm})),
  ledger:{file:'complete-ledger.json.gz',uncompressedBytes:data.length,uncompressedSHA256:sha(data),bytes:compressed.length,sha256:sha(compressed)},
  scope:'Finite daily-grid illustration. Correlations and phase-reference fractions concern calculated series, not the probability of life or geopolitical events. Criteria were not selected using these results. Runtime comparison is observational, with different warm-cache states and extra brute guidance work; not an isolated performance experiment.',
  processMemory:process.memoryUsage()};
writeFileSync(resolve(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({complete:true,counts:receipt.counts,calendarRows:receipt.calendarRows,mapDistances:receipt.mapDistances,completeSemanticParity:true,ledger:receipt.ledger,output:out}));
