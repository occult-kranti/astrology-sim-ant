#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {buildWorkbenchModelMessages,workbenchPromptProfile} from '../model-prompt.mjs';
const [casesPath,profile,output,split='development',selection='D05,D09,D07,D10']=process.argv.slice(2);
if(!casesPath||!profile||!output)throw Error('Use cases.json profile output-directory [split] [comma-separated-IDs or all].');
const source=await readFile(casesPath,'utf8'),dataset=JSON.parse(source),wanted=selection==='all'?null:new Set(selection.split(','));
const rows=Array.isArray(dataset)?dataset:dataset[split];if(!Array.isArray(rows))throw Error('Dataset split not present');
const selected=rows.filter(r=>!wanted||wanted.has(r.id));if(wanted&&selected.length!==wanted.size)throw Error('Expected every requested evaluation ID');
const promptSource=await readFile(new URL('../model-prompt.mjs',import.meta.url),'utf8');
const sha=text=>createHash('sha256').update(text).digest('hex');
const requests=selected.map(row=>({id:row.id,split,group:row.group,messages:buildWorkbenchModelMessages({question:row.question,context:row.context??null},{citations:row.evidence.map(e=>({id:e.id})),context:row.evidence.map(e=>`[${e.id}]\n${e.text}`).join('\n\n')},{profile})}));
await mkdir(output,{recursive:true});
await writeFile(resolve(output,'requests.json'),JSON.stringify(requests,null,2)+'\n',{flag:'wx'});
await writeFile(resolve(output,'cases.snapshot.json'),JSON.stringify(selected,null,2)+'\n',{flag:'wx'});
await writeFile(resolve(output,'model-prompt.snapshot.txt'),promptSource,{flag:'wx'});
await writeFile(resolve(output,'freeze.json'),JSON.stringify({kind:'immutable-evaluation-request-freeze',profile:workbenchPromptProfile(profile),caseIds:requests.map(r=>r.id),split,casesSHA256:sha(source),promptSourceSHA256:sha(promptSource),requestsSHA256:sha(JSON.stringify(requests,null,2)+'\n'),scope:'Explicit fixed reference packets. Retrieval quality is evaluated separately; no live retrieval mutation inside these comparisons.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({frozen:requests.length,profile,output}));
