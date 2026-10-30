import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { exportSkyReferenceCorpus } from '../assets/js/core/sky-source-retrieval.js';
const corpus=exportSkyReferenceCorpus(),check=process.argv.includes('--check'),root=new URL('../research/sky-reference/',import.meta.url);
const hash=text=>createHash('sha256').update(text).digest('hex');
const chunks=corpus.chunks.map(chunk=>({...chunk,source:corpus.sources.find(s=>s.id===chunk.sourceId),textSHA256:hash(chunk.text)}));
const jsonl=chunks.map(chunk=>JSON.stringify(chunk)).join('\n')+'\n';
const manifest=JSON.stringify({schemaVersion:1,kind:corpus.kind,method:corpus.method,trainingStatus:corpus.trainingStatus,chunkCount:chunks.length,sourceCount:corpus.sources.length,jsonlSHA256:hash(jsonl),chunkIDs:chunks.map(x=>x.id)},null,2)+'\n';
const outputs=new Map([['chunks.jsonl',jsonl],['manifest.json',manifest]]);
if(!check)mkdirSync(root,{recursive:true});
for(const[name,bytes]of outputs){const path=new URL(name,root);if(check){if(readFileSync(path,'utf8')!==bytes)throw new Error(`Stale reference artifact: ${name}`);}else writeFileSync(path,bytes);}
console.log(JSON.stringify({mode:check?'check':'generate',chunks:chunks.length,sources:corpus.sources.length,jsonlSHA256:hash(jsonl),trainingPerformed:false}));
