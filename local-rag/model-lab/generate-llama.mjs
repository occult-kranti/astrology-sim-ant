#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const [configPath]=process.argv.slice(2);if(!configPath)throw Error('Use configuration.json');
const configText=await readFile(configPath,'utf8'),config=JSON.parse(configText),source=await readFile(config.requestsJSON,'utf8'),jobs=JSON.parse(source),results=[];
const base=new URL(config.baseURL);if(base.protocol!=='http:'||base.hostname!=='127.0.0.1')throw Error('Evaluation allows explicit local HTTP provider only');
const sha=x=>createHash('sha256').update(x).digest('hex');
const health=await fetch(new URL('models',base));const listing=await health.json();if(!health.ok||!listing.data?.some(x=>x.id===config.model))throw Error('Configured model is not ready');
for(const job of jobs){
 const start=performance.now();const response=await fetch(new URL('chat/completions',base),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:config.model,messages:job.messages,temperature:config.temperature??0,max_tokens:config.maxNewTokens??512,stream:false,seed:20261104,response_format:{type:'json_object'},chat_template_kwargs:{enable_thinking:false}}),signal:AbortSignal.timeout(120000)});
 const raw=await response.json();if(!response.ok)throw Error('Model returned HTTP'+response.status);
 results.push({id:job.id,split:job.split,requestSHA256:sha(JSON.stringify(job)),seconds:Math.round(performance.now()-start)/1000,text:raw.choices?.[0]?.message?.content??'',model:raw.model,usage:raw.usage,finishReason:raw.choices?.[0]?.finish_reason,maxNewTokensReached:raw.choices?.[0]?.finish_reason==='length'});
 await writeFile(config.output,JSON.stringify({kind:'actual-llama-cpu-model-generation',config,configSHA256:sha(configText),requestsSHA256:sha(source),results,scope:'Raw development or heldout responses; judge dimensions separately and retain failures.'},null,2)+'\n');
 console.log(JSON.stringify({id:job.id,seconds:results.at(-1).seconds,output:config.output}));
}
