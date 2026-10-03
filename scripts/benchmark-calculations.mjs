import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
const root = process.argv[2] || process.cwd(), count = 200;
const {castChart}=await import(pathToFileURL(root+'/assets/js/core/astro.js'));
const {castVedic}=await import(pathToFileURL(root+'/assets/js/core/vedic.js'));
const date=new Date('2026-01-01T09:00:00Z');
let chart=castChart(date,51.5074,-0.1278);
const tasks={chart:()=>castChart(date,51.5074,-0.1278),vedic:()=>castVedic(chart)};
const out={node:process.version,platform:process.platform,root,count};
for(const [name,task] of Object.entries(tasks)){for(let i=0;i<20;i++)task();let times=[];for(let r=0;r<5;r++){let t=performance.now();for(let i=0;i<count;i++)task();times.push((performance.now()-t)/count);}out[name]={median_ms:times.sort((a,b)=>a-b)[2],rounds_ms:times};}
console.log(JSON.stringify(out,null,2));
