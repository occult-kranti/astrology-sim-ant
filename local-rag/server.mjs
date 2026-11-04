#!/usr/bin/env node
// Optional stateless localhost bridge. It retrieves public sources and recomputes
// explicitly disclosed inputs. Generated action proposals are validated, never run.
import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildWorkbenchEvidence,WORKBENCH_RAG_MANIFEST} from '../assets/js/core/workbench-rag.js';
import {buildDesktopStudy} from '../assets/js/core/desktop-workbench.js';
import {normalizeWorkbenchInputs,normalizeWorkbenchActions} from '../assets/js/core/workbench-chat-actions.js';
import {exportReadingLab,exportReadingCase} from '../assets/js/core/reading-lab.js';
import {buildWorkbenchModelMessages,workbenchPromptProfile} from './model-prompt.mjs';
import {providerFetch} from './provider-http.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const PROVIDERS=['local','openai','chatgpt'];
const MAX_REQUEST=65536,MAX_PROVIDER=1048576,MAX_CONTEXT=32768,MAX_MODEL_PAYLOAD=98304;
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'};
const plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const error=(status,code,message)=>Object.assign(new Error(message),{status,code});
const rejectUnknown=(value,keys,label)=>{if(!plain(value)||Object.keys(value).some(k=>!keys.includes(k)))throw error(400,'INVALID_REQUEST',`${label} has unsupported fields.`);};
function number(value,fallback,min,max){const n=value===undefined?fallback:Number(value);if(!Number.isInteger(n)||n<min||n>max)throw new TypeError('Invalid bounded server configuration.');return n;}
export function loadConfig(env=process.env){
 const port=number(env.RAG_PORT,8844,1024,65535);
 const profile=workbenchPromptProfile(env.RAG_PROMPT_PROFILE||'scenario-v3');
 const localBase=new URL(env.RAG_LOCAL_BASE_URL||'http://127.0.0.1:8845/v1/');
 if(!['http:','https:'].includes(localBase.protocol)||!['localhost','127.0.0.1','[::1]'].includes(localBase.hostname)||localBase.username||localBase.password||localBase.search||localBase.hash||!/^\/v1\/?$/.test(localBase.pathname))throw new TypeError('RAG_LOCAL_BASE_URL must be a loopback /v1 URL without credentials.');
 if(!localBase.pathname.endsWith('/'))localBase.pathname+='/';
 const localModel=env.RAG_LOCAL_MODEL||'workbench-qwen3-4b-q4';
 const defaultPinnedLocal=localModel==='workbench-qwen3-4b-q4'&&localBase.href==='http://127.0.0.1:8845/v1/';
 const localContextPreflight=env.LOCAL_CONTEXT_PREFLIGHT??(defaultPinnedLocal?'llama.cpp':'off');
 if(!['llama.cpp','off'].includes(localContextPreflight))throw new TypeError('LOCAL_CONTEXT_PREFLIGHT must be llama.cpp or off.');
 const localContextLimit=number(env.LOCAL_CONTEXT_LIMIT,8192,1024,131072);
 const origins=new Set([`http://127.0.0.1:${port}`,`http://localhost:${port}`,'http://127.0.0.1:8003','http://localhost:8003','https://occult-kranti.github.io']);
 for(const raw of (env.RAG_ALLOWED_ORIGINS||'').split(',').map(v=>v.trim()).filter(Boolean)){const u=new URL(raw);if(!['http:','https:'].includes(u.protocol)||u.origin!==raw)throw new TypeError('Allowed origins must be exact HTTP(S) origins without paths.');origins.add(raw);}
 if(env.RAG_ALLOW_FILE_ORIGIN==='1')origins.add('null');
 return{host:'127.0.0.1',port,origins,localBase:localBase.href,localEnabled:env.RAG_LOCAL_ENABLED!=='0',localModel,localContextPreflight,localContextLimit,openaiKey:env.OPENAI_API_KEY||'',openaiModel:env.OPENAI_MODEL||'',chatgptModel:env.CHATGPT_MODEL||'',timeoutMs:number(env.RAG_TIMEOUT_MS,110000,1000,120000),maxConcurrent:number(env.RAG_MAX_CONCURRENT,1,1,4),maxTokens:number(env.RAG_MAX_TOKENS,Math.min(profile.maxTokens,512),64,1500),promptProfile:profile.id,temperature:profile.temperature,retrievalLimit:profile.retrievalLimit,retrievalTokens:profile.retrievalTokens,staticRoot:ROOT};
}
function json(res,status,payload){if(res.destroyed||res.writableEnded)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload));}
async function readRequest(req){let total=0;const chunks=[];for await(const chunk of req){total+=chunk.length;if(total>MAX_REQUEST)throw error(413,'REQUEST_TOO_LARGE','Request exceeds 64 KiB.');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw error(400,'INVALID_JSON','Send one valid JSON request.');}}
async function readBounded(response,max=MAX_PROVIDER){let size=0;const chunks=[];for await(const chunk of response.body||[]){size+=chunk.length;if(size>max){await response.body?.cancel?.().catch(()=>{});throw error(502,'PROVIDER_RESPONSE_TOO_LARGE','The provider response exceeded its limit.');}chunks.push(Buffer.from(chunk));}return Buffer.concat(chunks).toString('utf8');}
function normalizeRequest(raw){
 rejectUnknown(raw,['question','provider','context','requestId'],'Request');
 if(typeof raw.question!=='string'||!raw.question.trim()||raw.question.length>3000)throw error(400,'INVALID_QUESTION','Ask a question of 1–3,000 characters.');
 const provider=raw.provider||'local';if(!PROVIDERS.includes(provider))throw error(400,'INVALID_PROVIDER','Choose local, openai or chatgpt.');
 const requestId=raw.requestId??null;if(requestId!==null&&(typeof requestId!=='string'||requestId.length>100||/[\u0000-\u001f]/.test(requestId)))throw error(400,'INVALID_REQUEST_ID','Use a short request identifier.');
 let context=null;
 if(raw.context!==undefined&&raw.context!==null){
  if(plain(raw.context)&&Object.hasOwn(raw.context,'reading')){
   rejectUnknown(raw.context,['reading'],'Reading context');
   try{
    const reading=raw.context.reading;
    if(plain(reading)&&Object.hasOwn(reading,'caseId')){rejectUnknown(reading,['caseId'],'Public reading case');context={reading:exportReadingCase(reading.caseId)};}
    else context={reading:exportReadingLab(reading)};
   }catch(e){throw error(400,'INVALID_READING_CONTEXT',e.message);}
  }else{
  rejectUnknown(raw.context,['inputs','selection'],'Chart context');
  let inputs;try{inputs=normalizeWorkbenchInputs(raw.context.inputs);}catch(e){throw error(400,'INVALID_CHART_CONTEXT',e.message);}
  let study;try{study=buildDesktopStudy(inputs);}catch(e){throw error(400,'INVALID_CHART_CONTEXT',e.message);}
  let selection=null;
  if(raw.context.selection!==undefined){rejectUnknown(raw.context.selection,['body','frame'],'Selection');const frame=raw.context.selection.frame||'primary';if(!['primary','secondary'].includes(frame)||!study[frame]?.bodies.some(b=>b.id===raw.context.selection.body))throw error(400,'INVALID_SELECTION','Choose a body in an available chart.');selection={body:raw.context.selection.body,frame};}
  context={inputs:study.inputs,selection,frames:['primary','secondary'].filter(k=>study[k]).map(k=>({frame:k,utc:study[k].dateISO,actualSystem:study[k].actualSystem,requestedSystem:study[k].requestedSystem,warnings:study[k].warnings,bodies:study[k].bodies.map(b=>({body:b.id,longitude:b.lon,position:b.label,house:b.house,motion:b.retrograde?'retrograde':'direct'})),cusps:study[k].houses.map(h=>({house:h.house,label:h.label}))}))};
  }
  if(Buffer.byteLength(JSON.stringify(context),'utf8')>MAX_CONTEXT)throw error(400,'CONTEXT_TOO_LARGE','The canonical study context exceeds 32 KiB. Select fewer frameworks; calculated facts are never silently removed.');
 }
 return{question:raw.question.trim(),provider,requestId,context};
}
function outputText(response){if(typeof response?.output_text==='string')return response.output_text;return(response?.output||[]).filter(v=>v.type==='message').flatMap(v=>v.content||[]).filter(v=>v.type==='output_text').map(v=>v.text||'').join('\n');}
export function parseCompletedResponseSSE(text){
 let completed=null;
 for(const block of text.split(/\r?\n\r?\n/)){
  const data=block.split(/\r?\n/).filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart()).join('\n');if(!data||data==='[DONE]')continue;
  let event;try{event=JSON.parse(data);}catch{throw error(502,'INVALID_PROVIDER_STREAM','The provider returned malformed stream data.');}
  if(['error','response.failed','response.incomplete'].includes(event.type))throw error(502,'PROVIDER_INCOMPLETE','The provider did not complete this response. Retry or inspect the connected account limits.');
  if(event.type==='response.completed'){if(event.response?.status&&event.response.status!=='completed')throw error(502,'PROVIDER_INCOMPLETE','The provider response was not completed.');completed=event.response;}
 }
 if(!completed)throw error(502,'PROVIDER_INCOMPLETE','The provider stream ended without response.completed.');
 return completed;
}
export function auditModelReply(text,evidence){
 if(typeof text!=='string'||!text.trim())throw error(502,'EMPTY_MODEL_REPLY','The model returned no answer.');
 const cleaned=text.replace(/<think>[\s\S]*?<\/think>/gi,'').trim();
 let raw,structured=true;
 try{raw=JSON.parse(cleaned.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{structured=false;raw={answer:cleaned,citations:[],actions:[]};}
 if(!plain(raw)||typeof raw.answer!=='string'||!raw.answer.trim()||raw.answer.length>16000)throw error(502,'INVALID_MODEL_REPLY','The model did not return a bounded text answer.');
 const claimed=Array.isArray(raw.citations)?raw.citations.filter(v=>typeof v==='string').slice(0,32):[];
 const allowed=new Map(evidence.citations.map(v=>[v.id,v]));
 const valid=[...new Set(claimed.filter(id=>allowed.has(id)))],unknown=[...new Set(claimed.filter(id=>!allowed.has(id)))];
 const inline=[...raw.answer.matchAll(/\[([^\]\n]{1,100})\]/g)].map(m=>m[1]);
 for(const id of inline)if(/^(?:WRAG-[a-zA-Z0-9_-]+|rl-[a-z0-9_-]+|[A-Z][A-Z0-9._:-]{2,99})$/.test(id)&&!allowed.has(id)&&!unknown.includes(id))unknown.push(id);
 for(const id of inline)if(allowed.has(id)&&!valid.includes(id))valid.push(id);
 const missingInline=valid.filter(id=>!inline.includes(id)),grounding=[],invalidGrounding=[];
 const supplied=Array.isArray(raw.grounding)?raw.grounding:[];
 if(raw.grounding!==undefined&&!Array.isArray(raw.grounding))invalidGrounding.push({index:null,reason:'Grounding must be an array.'});
 if(supplied.length>2)invalidGrounding.push({index:null,reason:'At most two quote-grounding items are allowed.'});
 for(const [index,item]of supplied.slice(0,2).entries()){
  let reason=null;
  if(!plain(item)||Object.keys(item).some(k=>!['sourceId','quote','claim'].includes(k))||typeof item.sourceId!=='string'||typeof item.quote!=='string'||typeof item.claim!=='string'||item.quote.length<12||item.quote.length>180||!item.claim.trim()||item.claim.length>1000)reason='Use sourceId, a 12–180 character exact quote, and a bounded claim.';
  else if(!allowed.has(item.sourceId)||!valid.includes(item.sourceId))reason='The grounding source is not both retrieved and cited in the answer.';
  else{
   // Only the selected excerpt was sent to the provider. A quotation found in
   // omitted source text must not pass merely because the full chunk has it.
   const excerpt=(evidence.rows||[]).find(row=>row.id===item.sourceId)?.excerpt;
   if(typeof excerpt!=='string'||!excerpt.includes(item.quote))reason='The quote is not an exact substring of the selected supplied excerpt.';
  }
  if(reason)invalidGrounding.push({index,sourceId:typeof item?.sourceId==='string'?item.sourceId.slice(0,120):null,reason});
  else grounding.push({sourceId:item.sourceId,quote:item.quote,claim:item.claim});
 }
 const missingGrounding=valid.filter(id=>!grounding.some(g=>g.sourceId===id));
 const draftReasons=[...(!structured?['The model reply did not follow the JSON schema.']:[]),...(unknown.length?['Some source identifiers were not retrieved.']:[]),...(missingInline.length?['Some citations lack an inline answer marker.']:[]),...(invalidGrounding.length?['Some quote-grounding items failed exact-excerpt checks.']:[]),...(missingGrounding.length?['Some cited sources have no valid exact-excerpt grounding item.']:[])];
 let actions=[],actionError=null;
 try{actions=normalizeWorkbenchActions(raw.actions??[]);}catch(e){actionError=e.message;}
 return{answer:raw.answer,draft:true,draftReasons,citations:valid.map(id=>allowed.get(id)),retrievedSources:evidence.citations,citationAudit:{structured,citedIds:claimed,validIds:valid,unknownIds:unknown,missingInlineIds:missingInline,hasCitations:valid.length>0,identifiersValid:unknown.length===0,note:'Identifier checks do not establish that a source supports every claim; inspect the cited passage.'},grounding,groundingAudit:{supplied:supplied.length,accepted:grounding.length,rejected:invalidGrounding,missingForCitationIds:missingGrounding,allSuppliedQuotesMatched:supplied.length>0&&invalidGrounding.length===0,semanticSupportValidated:false,note:'Exact substring matching against the selected excerpts only. A valid quotation does not prove the claim follows from it or validate an interpretation.'},actions,actionAudit:{accepted:actions.length,rejected:actionError!==null,error:actionError,note:'Proposals were validated but no action was executed.'}};
}
async function healthFor(config,fetchImpl,login){
 let local={enabled:config.localEnabled,ready:false,model:config.localModel,note:'Local model is disabled.'};
 if(config.localEnabled){try{const r=await fetchImpl(new URL('models',config.localBase),{signal:AbortSignal.timeout(2000),redirect:'error'});if(!r.ok)throw Error('status');const data=JSON.parse(await readBounded(r,65536));const available=(data.data||data.models||[]).map(v=>v.id||v.name||v.model);local={enabled:true,ready:available.includes(config.localModel),model:config.localModel,note:available.includes(config.localModel)?'Configured local model is reachable.':'The local server is reachable but the configured model is not listed.'};}catch{local.note='Local model is not reachable. Start the model server or check its configured name.';}}
 local.contextPreflight={mode:config.localContextPreflight,configuredWindowTokens:config.localContextLimit,ready:null,note:config.localContextPreflight==='llama.cpp'?'Each inference preflights the rendered chat template and actual tokens before generation; health has not probed those endpoints.':'Tokenizer preflight is off for this provider; byte bounds and explicit provider errors still apply.'};
 let chatgpt={configured:false,connected:false,ready:false,note:'ChatGPT connection is not configured.'};if(login)try{chatgpt={...await login.status(),model:config.chatgptModel||null,ready:false};chatgpt.ready=chatgpt.connected===true&&!!config.chatgptModel;chatgpt.modelConfigured=!!config.chatgptModel;}catch{chatgpt={...chatgpt,note:'ChatGPT connection status is unavailable.'};}
 return{schemaVersion:1,service:'astrology-workbench-local-rag',local,openai:{configured:!!(config.openaiKey&&config.openaiModel),ready:null,model:config.openaiModel||null,note:config.openaiKey&&config.openaiModel?'Credentials configured; provider connection has not been probed.':'Set OPENAI_API_KEY and OPENAI_MODEL on the server to enable this provider.'},chatgpt,prompt:{profile:config.promptProfile,temperatureForLocal:config.temperature,maxOutputTokens:config.maxTokens,contextMaxBytes:MAX_CONTEXT,providerPayloadMaxBytes:MAX_MODEL_PAYLOAD},runtime:{maxConcurrent:config.maxConcurrent,timeoutMs:config.timeoutMs},retrieval:{provider:'local-public-source-corpus',ready:true,chunkCount:WORKBENCH_RAG_MANIFEST.chunkCount,corpusSHA256:WORKBENCH_RAG_MANIFEST.corpusSHA256,limit:config.retrievalLimit,maxTokens:config.retrievalTokens},privacy:'Stateless requests; chart or reading inputs are included only when explicitly sent. No conversation or chart storage on this server.'};
}
async function localContextBudget(messages,config,fetchImpl,signal){
 if(config.localContextPreflight==='off')return{mode:'off',verified:false,contextTruncated:false,note:'No tokenizer-specific fit claim; byte bounds and provider errors apply.'};
 const invoke=async(path,payload)=>{
  let response;try{response=await fetchImpl(new URL(path,config.localBase),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal,redirect:'error'});}catch(e){if(signal.aborted)throw error(504,'PROVIDER_TIMEOUT','The context preflight was cancelled or timed out.');throw error(503,'LOCAL_CONTEXT_PREFLIGHT_UNAVAILABLE','The configured llama.cpp context preflight could not be reached. No generation was requested.');}
  if(!response.ok){await response.body?.cancel?.().catch(()=>{});throw error(503,'LOCAL_CONTEXT_PREFLIGHT_UNAVAILABLE','Configured llama.cpp preflight requires working /apply-template and /tokenize endpoints. No generation was requested.');}
  try{return JSON.parse(await readBounded(response));}catch(e){if(e.status)throw e;throw error(502,'INVALID_CONTEXT_PREFLIGHT','The local tokenizer returned invalid JSON. No generation was requested.');}
 };
 const rendered=await invoke('/apply-template',{messages,chat_template_kwargs:{enable_thinking:false},add_generation_prompt:true});
 if(typeof rendered.prompt!=='string'||Buffer.byteLength(rendered.prompt,'utf8')>MAX_MODEL_PAYLOAD)throw error(400,'MODEL_PAYLOAD_TOO_LARGE','The rendered local chat template exceeds the payload bound. Select fewer frameworks or shorten the question.');
 const result=await invoke('/tokenize',{content:rendered.prompt,add_special:false,parse_special:true});
 if(!Array.isArray(result.tokens)||result.tokens.length>MAX_MODEL_PAYLOAD||result.tokens.some(t=>!Number.isInteger(t)||t<0))throw error(502,'INVALID_CONTEXT_PREFLIGHT','The local tokenizer returned an invalid bounded token list. No generation was requested.');
 const promptTokens=result.tokens.length,safetyMarginTokens=32,requiredTokens=promptTokens+config.maxTokens+safetyMarginTokens;
 if(requiredTokens>config.localContextLimit)throw error(400,'CONTEXT_WINDOW_EXCEEDED',`The selected context needs ${promptTokens} prompt tokens + ${config.maxTokens} output tokens + ${safetyMarginTokens} boundary tokens, exceeding the configured ${config.localContextLimit}-token window. Select fewer frameworks or shorten the question. No generation was requested and no facts were removed.`);
 return{mode:'llama.cpp',verified:true,promptTokens,outputReserveTokens:config.maxTokens,safetyMarginTokens,requiredTokens,contextWindowTokens:config.localContextLimit,contextTruncated:false,note:'Actual rendered-template token count against the explicitly configured local runtime window; not an answer-quality check.'};
}
async function infer(request,evidence,config,fetchImpl,login,signal){
 const sessionRevision=()=>login?.getSessionRevision?.()??login?.sessionRevision?.();
 const authRevision=request.provider==='chatgpt'?sessionRevision():null;
 const checkSession=()=>{if(authRevision!==null&&authRevision!==undefined&&sessionRevision()!==authRevision)throw error(401,'AUTH_SESSION_ENDED','The ChatGPT session changed. This response was discarded.');};
 const messages=buildWorkbenchModelMessages(request,evidence,{profile:config.promptProfile});let url,headers={'Content-Type':'application/json'},body,model=config.localModel;
 if(request.provider==='local'){
  if(!config.localEnabled)throw error(503,'PROVIDER_DISABLED','The local model provider is disabled.');url=new URL('chat/completions',config.localBase);
  body={model,messages,stream:false,temperature:config.temperature,max_tokens:config.maxTokens,response_format:{type:'json_object'},chat_template_kwargs:{enable_thinking:false}};
 }else{
  url='https://api.openai.com/v1/responses';model=config.openaiModel;
  if(request.provider==='chatgpt'){
   if(!login)throw error(503,'CHATGPT_NOT_CONFIGURED','Sign in with ChatGPT is not configured on this server.');
   if(!config.chatgptModel)throw error(503,'CHATGPT_MODEL_REQUIRED','Set CHATGPT_MODEL to a model available to your authorized account.');
   let token;try{token=await login.getAccessToken();}catch(e){throw error(401,'CHATGPT_NOT_CONNECTED',e.message||'Authorize this local companion with ChatGPT first.');}checkSession();headers.Authorization='Bearer '+token;
   model=config.chatgptModel;
  }else{if(!config.openaiKey||!config.openaiModel)throw error(503,'OPENAI_NOT_CONFIGURED','Set OPENAI_API_KEY and OPENAI_MODEL on the server.');headers.Authorization='Bearer '+config.openaiKey;}
  body={model,store:false,input:messages.map(m=>({role:m.role==='system'?'developer':m.role,content:[{type:'input_text',text:m.content}]}))};
  if(request.provider==='chatgpt')body.stream=true;else{body.stream=false;body.max_output_tokens=config.maxTokens;}
 }
 const payload=JSON.stringify(body);if(Buffer.byteLength(payload,'utf8')>MAX_MODEL_PAYLOAD)throw error(400,'MODEL_PAYLOAD_TOO_LARGE','The calculated context and selected excerpts exceed the 96 KiB model payload bound. Select fewer frameworks or shorten the question; no facts were silently removed.');
 const contextBudget=request.provider==='local'?await localContextBudget(messages,config,fetchImpl,signal):{mode:'provider-managed',verified:false,contextTruncated:false,note:'Local byte limits apply; provider token-window errors remain explicit.'};
 checkSession();let response;try{response=await fetchImpl(url,{method:'POST',headers,body:payload,signal,redirect:'error'});}catch(e){if(signal.aborted)throw error(signal.reason?.code==='AUTH_SESSION_ENDED'?401:504,signal.reason?.code||'PROVIDER_TIMEOUT',signal.reason?.code==='AUTH_SESSION_ENDED'?'The ChatGPT session ended; this response was discarded.':'The model request was cancelled or timed out.');throw error(502,'PROVIDER_UNREACHABLE','The configured model provider could not be reached.');}
 if(!response.ok){await response.body?.cancel?.().catch(()=>{});throw error([401,403,408,429].includes(response.status)?response.status:502,'PROVIDER_HTTP_ERROR',`The provider returned HTTP ${response.status}. Check provider readiness or account limits.`);}
 const text=await readBounded(response);checkSession();
 let data;try{data=request.provider==='chatgpt'?parseCompletedResponseSSE(text):JSON.parse(text);}catch(e){if(e.status)throw e;throw error(502,'INVALID_PROVIDER_RESPONSE','The provider returned invalid JSON.');}
 if(request.provider==='local')return{text:data.choices?.[0]?.message?.content,model:data.model||model,usage:data.usage||null,contextBudget};
 if(data.status&&data.status!=='completed')throw error(502,'PROVIDER_INCOMPLETE','The provider response did not complete.');
 return{text:outputText(data),model:data.model||model,usage:data.usage||null,contextBudget};
}
async function serveStatic(req,res,pathname,root){
 let decoded;try{decoded=decodeURIComponent(pathname);}catch{throw error(400,'BAD_PATH','Invalid path.');}
 if(decoded.includes('\0')||decoded.split('/').includes('..')||decoded.includes('\\'))throw error(403,'FORBIDDEN_PATH','That path is not public.');
 const name=decoded.replace(/^\/+/, '');
 if(!/^(?:index\.html|manifest\.webmanifest|sw\.js|(?:pages|assets|docs)\/)/.test(name)||name.split('/').some(s=>s.startsWith('.'))||!MIME[extname(name)])throw error(404,'NOT_FOUND','Public file not found.');
 let file;try{file=await realpath(resolve(root,name));const info=await stat(file);if(!file.startsWith(root+sep)||!info.isFile()||info.size>25000000)throw Error('invalid');}catch{throw error(404,'NOT_FOUND','Public file not found.');}
 const bytes=await readFile(file);res.writeHead(200,{'Content-Type':MIME[extname(file)],'Content-Length':bytes.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(req.method==='HEAD'?undefined:bytes);
}
export function createRagServer({config=loadConfig(),fetchImpl=providerFetch,login=null}={}){
 let active=0;
 const server=createServer(async(req,res)=>{
  const expected=new Set([`127.0.0.1:${config.port}`,`localhost:${config.port}`]);
  // Tests using an ephemeral port may expose the actual bound loopback port.
  const actual=server.address();if(actual&&typeof actual==='object'){expected.add(`127.0.0.1:${actual.port}`);expected.add(`localhost:${actual.port}`);}
  if(!expected.has(req.headers.host)){json(res,403,{error:{code:'HOST_REJECTED',message:'Use the configured localhost address.'}});return;}
  const origin=req.headers.origin;
  if(origin&&!config.origins.has(origin)){json(res,403,{error:{code:'ORIGIN_REJECTED',message:'This origin is not allowed by the local server.'}});return;}
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, X-Workbench-Request');}
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  let controller=null,timer=null,counted=false,unsubscribe=null;
  try{
   const pathname=new URL(req.url,'http://localhost').pathname;
   if(req.method==='GET'&&pathname==='/api/chatgpt/models'){if(!login?.listModels)throw error(503,'CHATGPT_NOT_CONFIGURED','ChatGPT sign-in is not configured.');try{json(res,200,{models:await login.listModels(),selected:config.chatgptModel||null});}catch(e){throw error(401,'CHATGPT_NOT_CONNECTED',e.message||'Authorize this companion first.');}return;}
   if(login?.handleRequest&&await login.handleRequest(req,res))return;
   if(req.method==='GET'&&pathname==='/api/health'){json(res,200,await healthFor(config,fetchImpl,login));return;}
   if(req.method==='GET'&&pathname==='/'){res.writeHead(302,{Location:'/pages/desktop.html'});res.end();return;}
   if(['GET','HEAD'].includes(req.method)&&!pathname.startsWith('/api/')){await serveStatic(req,res,pathname,config.staticRoot);return;}
   if(req.method!=='POST'||pathname!=='/api/chat')throw error(404,'NOT_FOUND','Endpoint not found.');
   if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))throw error(415,'JSON_REQUIRED','Send application/json.');
   if(Number(req.headers['content-length']||0)>MAX_REQUEST)throw error(413,'REQUEST_TOO_LARGE','Request exceeds 64 KiB.');
   if(active>=config.maxConcurrent)throw error(429,'SERVER_BUSY','Another model request is running. Wait or cancel it before retrying.');
   const request=normalizeRequest(await readRequest(req));
   if(active>=config.maxConcurrent)throw error(429,'SERVER_BUSY','Another model request is running. Wait or cancel it before retrying.');
   active++;counted=true;controller=new AbortController();timer=setTimeout(()=>controller.abort(),config.timeoutMs);
   if(request.provider==='chatgpt'&&login?.subscribeSessionInvalidation)unsubscribe=login.subscribeSessionInvalidation(()=>controller.abort(Object.assign(new Error('ChatGPT session ended'),{code:'AUTH_SESSION_ENDED'})));
   req.once('aborted',()=>controller.abort());res.once('close',()=>{if(!res.writableEnded)controller.abort();});
   const start=performance.now();const evidence=buildWorkbenchEvidence(request.question.slice(0,2000),{limit:config.retrievalLimit,maxTokens:config.retrievalTokens});
   const result=await infer(request,evidence,config,fetchImpl,login,controller.signal);
   const audited=auditModelReply(result.text,evidence);
   audited.executionNotice='This response did not change any chart. Review and apply valid action proposals separately.';
   if(/\b(?:the|your) chart (?:has|have) been (?:set|changed|switched|updated|moved)\b/i.test(audited.answer))audited.answer+='\n\nCompanion correction: no chart change was applied. Any valid action is only a proposal for review.';
   json(res,200,{schemaVersion:1,...audited,provider:request.provider,model:result.model,promptProfile:config.promptProfile,usage:result.usage,contextIncluded:!!request.context,contextKind:request.context?(request.context.reading?'reading':'desktop'):null,contextBudget:result.contextBudget,requestId:request.requestId,timing:{totalMs:Math.round(performance.now()-start)},retrieval:{method:evidence.method,found:evidence.found,corpusSHA256:WORKBENCH_RAG_MANIFEST.corpusSHA256,chunkCount:WORKBENCH_RAG_MANIFEST.chunkCount,queryTruncated:request.question.length>2000},warning:'Generated draft: source identifiers, exact supplied-excerpt quotes and proposed action shapes are checked. These checks do not establish semantic support, factual correctness or predictive validity.'+(audited.draftReasons.length?' Some audit checks require review.':'')});
  }catch(e){if(controller?.signal.aborted&&!e.status)e=error(controller.signal.reason?.code==='AUTH_SESSION_ENDED'?401:504,controller.signal.reason?.code||'PROVIDER_TIMEOUT','The model request was cancelled; no answer was applied.');json(res,e.status||500,{error:{code:e.code||'SERVER_ERROR',message:e.status?e.message:'The local service could not complete this request.'}});}
  finally{if(timer)clearTimeout(timer);unsubscribe?.();if(counted)active--;}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;return server;
}
async function main(){const config=loadConfig();let login=null;try{const module=await import('./chatgpt-login.mjs');if(module.createChatGPTLogin)login=await module.createChatGPTLogin({fetchImpl:providerFetch,baseURL:`http://127.0.0.1:${config.port}`});}catch(e){if(e.code!=='ERR_MODULE_NOT_FOUND')console.error('ChatGPT sign-in adapter is unavailable; local inference remains available.');}const server=createRagServer({config,login});server.listen(config.port,config.host,()=>console.log(`Workbench RAG: http://${config.host}:${config.port}/pages/desktop.html (loopback only; no request logging)`));}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)await main();
