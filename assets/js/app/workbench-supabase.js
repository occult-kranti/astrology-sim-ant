// Optional public-source RPC client. Configuration exists only in the caller's
// memory; importing this module performs no I/O and creates no persisted state.
const MAX_RESPONSE_BYTES=1_000_000;
const CATEGORIES=/^[a-z][a-z0-9-]{0,79}$/;
const RELATIVE_SOURCE=/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+(?:#[A-Za-z0-9_.:-]+)?$/;
function validSourceURL(value){
  if(RELATIVE_SOURCE.test(value)&&!value.split('#')[0].split('/').includes('..'))return true;
  try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password;}catch{return false;}
}
function text(value,label,max,{empty=false}={}){
  if(typeof value!=='string'||value.length>max||(!empty&&!value.trim())||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(value))throw new TypeError(`${label} is invalid.`);
  return value;
}
function publicKey(value){
  const key=text(value,'Supabase publishable key',4096).trim();
  if(/^sb_publishable_[A-Za-z0-9_-]{8,}$/.test(key))return key;
  if(key.split('.').length===3){
    try{
      const part=key.split('.')[1].replaceAll('-','+').replaceAll('_','/');
      const payload=JSON.parse(atob(part));
      if(payload.role==='anon'&&/^[A-Za-z0-9_.-]+$/.test(key))return key;
    }catch{}
  }
  throw new TypeError('Use a Supabase publishable key or legacy anon key. Secret and service-role keys are not accepted in the browser.');
}
export function normalizeWorkbenchSupabase(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Supply the Supabase project URL and publishable key.');
  const url=new URL(text(input.url,'Supabase URL',2048).trim());
  const loopback=url.hostname==='localhost'||url.hostname==='[::1]'||/^127(?:\.[0-9]{1,3}){3}$/.test(url.hostname);
  if(!(url.protocol==='https:'||url.protocol==='http:'&&loopback)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new TypeError('Use an HTTPS Supabase project base URL, or HTTP on localhost, without a path, credentials, query or fragment.');
  return Object.freeze({url:url.origin+'/',rpcURL:new URL('rest/v1/rpc/search_workbench_reference',url).href,publishableKey:publicKey(input.publishableKey)});
}
function normalizedRow(row,index){
  if(!row||typeof row!=='object'||Array.isArray(row))throw new Error(`Source row ${index+1} is malformed.`);
  const fields={id:['id',120],sourceId:['source_id',160],title:['title',500],text:['body',12000],category:['category',80],file:['file_path',2000],locator:['locator',2000],url:['url',2000],readingDepth:['reading_depth',3000],rightsScope:['rights_scope',3000],sourceReadingDepth:['source_reading_depth',3000],sourceFileSHA256:['source_file_sha256',64],textSHA256:['content_sha256',64]};
  const result={};for(const[target,[source,max]]of Object.entries(fields))result[target]=text(row[source],`Source ${target}`,max,{empty:target==='locator'});
  if(!validSourceURL(result.url)||!CATEGORIES.test(result.category)||!/^[0-9a-f]{64}$/.test(result.textSHA256)||!/^[0-9a-f]{64}$/.test(result.sourceFileSHA256)||!Array.isArray(row.tags)||row.tags.length>32||row.tags.some(tag=>typeof tag!=='string'||!tag||tag.length>120)||typeof row.rank!=='number'||!Number.isFinite(row.rank)||row.rank<0)throw new Error(`Source row ${index+1} has invalid provenance or ranking fields.`);
  result.tags=[...row.tags];result.score=row.rank;result.retrievalMethod='postgres-english-simple-fts';
  return result;
}
async function responseJSON(response){
  if(Number(response.headers?.get('content-length'))>MAX_RESPONSE_BYTES)throw new Error('Supabase source response exceeds the size limit.');
  let raw='';
  if(response.body?.getReader){
    const reader=response.body.getReader(),decoder=new TextDecoder();let size=0;
    try{while(true){const{value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_RESPONSE_BYTES){await reader.cancel();throw new Error('Supabase source response exceeds the size limit.');}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();}
    finally{reader.releaseLock();}
  }else{raw=await response.text();if(new TextEncoder().encode(raw).length>MAX_RESPONSE_BYTES)throw new Error('Supabase source response exceeds the size limit.');}
  try{return JSON.parse(raw);}catch{throw new Error('Supabase returned malformed source JSON.');}
}
/** Explicitly sends query text only. The caller must disclose the destination and
 * obtain the user's deliberate send action. No chart/profile/chat history is read. */
export async function searchWorkbenchSupabase(input,query,{limit=6,category=null,signal,fetchImpl=globalThis.fetch,timeoutMs=15000}={}){
  const config=normalizeWorkbenchSupabase(input);
  text(query,'Source query',1000,{empty:true});
  if(!Number.isInteger(limit)||limit<1||limit>12)throw new TypeError('Retrieve 1 to 12 chunks.');
  if(category!==null&&(typeof category!=='string'||!CATEGORIES.test(category)))throw new TypeError('Category must be a short lowercase identifier.');
  if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)throw new TypeError('Timeout must be 1 to 60000 milliseconds.');
  if(typeof fetchImpl!=='function')throw new TypeError('Browser fetch is unavailable.');
  if(signal?.aborted)throw new DOMException('Source search cancelled.','AbortError');
  const base={method:'postgres-english-simple-fts',destination:config.url,query,category};
  if(!query.trim())return{...base,rows:[],emptyQuery:true};
  const controller=new AbortController();
  const cancel=()=>controller.abort(signal?.reason);
  signal?.addEventListener('abort',cancel,{once:true});
  const timer=setTimeout(()=>controller.abort(new DOMException('Source search timed out.','TimeoutError')),timeoutMs);
  try{
    const response=await fetchImpl(config.rpcURL,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json',apikey:config.publishableKey,...(config.publishableKey.startsWith('sb_publishable_')?{}:{Authorization:`Bearer ${config.publishableKey}`})},body:JSON.stringify({query_text:query,match_count:limit,category_filter:category}),signal:controller.signal});
    if(controller.signal.aborted)throw controller.signal.reason||new DOMException('Source search cancelled.','AbortError');
    if(!response.ok)throw new Error(`Supabase source search failed (HTTP ${response.status}). Check the project URL, publishable key, migration and access policy.`);
    const data=await responseJSON(response);
    if(!Array.isArray(data)||data.length>limit)throw new Error('Supabase returned an invalid or excessive source result set.');
    const rows=data.map(normalizedRow);
    if(!globalThis.crypto?.subtle)throw new Error('Secure-context hashing is required to verify retrieved source content.');
    for(const row of rows){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(row.text))),byte=>byte.toString(16).padStart(2,'0')).join('');if(hash!==row.textSHA256)throw new Error('Supabase source content does not match its declared hash. Rebuild and reseed the public corpus.');}
    if(controller.signal.aborted)throw controller.signal.reason||new DOMException('Source search cancelled.','AbortError');
    if(new Set(rows.map(row=>row.id)).size!==rows.length)throw new Error('Supabase returned duplicate source IDs.');
    return{...base,rows};
  }finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel);}
}
