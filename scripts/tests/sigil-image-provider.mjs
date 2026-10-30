// Fake-transport adapter tests. No external inference, key access or paid call.
import assert from 'node:assert/strict';
import { createSigilImageProvider } from '../../mcp/sigil-image-provider.mjs';
export async function run() {
 const failures=[];let passed=0;
 const test=async(name,fn)=>{try{await fn();passed++;}catch(e){failures.push(`${name}: ${e.message}`);}};
 const token='test-only-access-token-with-at-least-32-characters',key='FAKE-TEST-API-KEY';
 const config={apiKey:key,accessToken:token,model:'configured-image-model',hostname:'art.example.org'};
 const request=(body={prompt:'A quiet modern geometric illustration'},extra={})=>new Request(extra.url||'https://art.example.org/api/sigil-image',{method:extra.method||'POST',headers:{'content-type':'application/json',authorization:`Bearer ${token}`,...extra.headers},body:extra.method==='GET'?undefined:JSON.stringify(body),signal:extra.signal});
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lTkAAAAASUVORK5CYII=';
 await test('server-only configuration is required',async()=>{for(const c of [{},{...config,apiKey:''},{...config,accessToken:'short'},{...config,model:'bad/model'},{...config,hostname:'https://bad.example'}])assert.throws(()=>createSigilImageProvider(c));});
 await test('host,origin,auth,method and body guards make no provider calls',async()=>{
  let calls=0;const handler=createSigilImageProvider({...config,fetchImpl:async()=>{calls++;throw Error('unexpected');}});
  for(const [extra,status]of[[{url:'http://art.example.org/api/sigil-image'},403],[{url:'https://evil.example/api/sigil-image'},403],[{url:'https://art.example.org/api/sigil-image?key=bad'},403],[{headers:{origin:'https://evil.example'}},403],[{headers:{authorization:'Bearer wrong'}},401],[{method:'GET'},405],[{headers:{'content-type':'text/plain'}},415],[{headers:{'content-type':'application/jsonx'}},415],[{headers:{'content-length':'70000'}},413]])assert.equal((await handler.fetch(request({},extra))).status,status);
  for(const body of [{prompt:'',model:'injected'},{prompt:'a'.repeat(12001)},[],{}])assert.equal((await handler.fetch(request(body))).status,400);
  assert.equal(calls,0);
 });
 await test('exact fixed provider request returns only bounded illustration data',async()=>{
  const calls=[];const handler=createSigilImageProvider({...config,fetchImpl:async(url,opts)=>{calls.push({url,opts});return new Response(JSON.stringify({data:[{b64_json:png}]}));}});
  const response=await handler.fetch(request()),result=await response.json();assert.equal(response.status,200);assert.equal(calls[0].url,'https://api.openai.com/v1/images/generations');assert.equal(calls[0].opts.redirect,'error');assert.equal(calls[0].opts.headers.authorization,`Bearer ${key}`);
  assert.deepEqual(JSON.parse(calls[0].opts.body),{model:config.model,prompt:'A quiet modern geometric illustration',n:1,size:'1024x1024',quality:'low',output_format:'png'});
  assert.equal(result.image.base64,png);assert.equal(result.kind,'provider-rendered-illustration');assert.ok(!JSON.stringify(result).includes(key));assert.equal(response.headers.get('cache-control'),'no-store');assert.equal(response.headers.get('access-control-allow-origin'),null);
 });
 await test('provider errors and malformed outputs never echo upstream secrets',async()=>{
  for(const fake of [()=>new Response('UPSTREAM-SECRET',{status:401}),()=>new Response(JSON.stringify({data:[{url:'https://untrusted.example/file'}]})),()=>new Response(JSON.stringify({data:[{b64_json:'<script>'}]})),()=>{throw Error('UPSTREAM-SECRET');}]){
   const handler=createSigilImageProvider({...config,fetchImpl:async()=>fake()});const response=await handler.fetch(request());assert.equal(response.status,502);assert.ok(!(await response.text()).includes('UPSTREAM-SECRET'));
  }
 });
 await test('one in-flight request and four-per-minute cap bound spend',async()=>{
  let finish;const handler=createSigilImageProvider({...config,fetchImpl:()=>new Promise(resolve=>{finish=()=>resolve(new Response(JSON.stringify({data:[{b64_json:png}]})));})});
  const pending=handler.fetch(request());await new Promise(r=>setTimeout(r,0));assert.equal((await handler.fetch(request())).status,429);finish();assert.equal((await pending).status,200);
  const limited=createSigilImageProvider({...config,now:()=>1000,fetchImpl:async()=>new Response(JSON.stringify({data:[{b64_json:png}]}))});
  for(let i=0;i<4;i++)assert.equal((await limited.fetch(request())).status,200);assert.equal((await limited.fetch(request())).status,429);
 });
 await test('client cancellation propagates to the fake provider',async()=>{
  let started=false;const handler=createSigilImageProvider({...config,fetchImpl:async(_url,options)=>new Promise((_resolve,reject)=>{started=true;options.signal.addEventListener('abort',()=>reject(Error('cancelled')),{once:true});})});
  const controller=new AbortController(),pending=handler.fetch(request(undefined,{signal:controller.signal}));await new Promise(r=>setTimeout(r,0));assert.equal(started,true);controller.abort();assert.equal((await pending).status,408);
 });
 return {pass:!failures.length,passed,failures,inference:'Fake transport only; no model called'};
}
if(process.argv[1]?.endsWith('sigil-image-provider.mjs')){const r=await run();console.log(r);if(!r.pass)process.exitCode=1;}
