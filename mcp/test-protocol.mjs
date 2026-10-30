import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TOOLS } from './toolkit.mjs';
import { createHttpHandler } from './http-handler.mjs';
const init={jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-11-25',capabilities:{},clientInfo:{name:'workbench-release-test',version:'1.0.0'}}};
const handler=createHttpHandler();
const req=(body,options={})=>new Request(options.url||'http://127.0.0.1:3001/mcp',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json, text/event-stream','MCP-Protocol-Version':'2025-11-25',...options.headers},body:JSON.stringify(body)});
async function rpc(body){const response=await handler.fetch(req(body));assert.equal(response.status,200);const text=await response.text();
  if(response.headers.get('content-type')?.includes('text/event-stream')) return JSON.parse(text.split('\n').filter(line=>line.startsWith('data: ')).map(line=>line.slice(6)).join('\n'));
  return JSON.parse(text);}
try{
  assert.equal((await rpc(init)).result.serverInfo.name,'astrologers-workbench');
  const listed=await rpc({jsonrpc:'2.0',id:2,method:'tools/list',params:{}});
  assert.equal(listed.result.tools.length,TOOLS.length);
  assert.equal(listed.result.tools.find(t=>t.name==='workbench_explain_guidance').annotations.readOnlyHint,true);
  const calculated=await rpc({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'workbench_gematria',arguments:{text:'חי'}}});
  assert.equal(calculated.result.structuredContent.data.total,18);
  const invalid=await rpc({jsonrpc:'2.0',id:4,method:'tools/call',params:{name:'workbench_election',arguments:{dateISO:'2026-01-01T00:00Z',lat:0,lon:0,operationKey:'love',stepMinutes:0}}});
  assert.ok(invalid.error||invalid.result?.isError);
  const comparison=await rpc({jsonrpc:'2.0',id:6,method:'tools/call',params:{name:'workbench_compare_moment',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London'}}});
  assert.equal(comparison.result.structuredContent.data.context.dateISO,'2026-10-29T12:00:00.000Z');
  const outlook=await rpc({jsonrpc:'2.0',id:7,method:'tools/call',params:{name:'workbench_calendar_outlook',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London',days:2}}});
  assert.equal(outlook.result.structuredContent.data.rows.length,2);
  const tooLong=await rpc({jsonrpc:'2.0',id:8,method:'tools/call',params:{name:'workbench_calendar_outlook',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:0,lon:0,timeZone:'UTC',days:15}}});
  assert.ok(tooLong.error||tooLong.result?.isError);
  const guidance=await rpc({jsonrpc:'2.0',id:9,method:'tools/call',params:{name:'workbench_explain_guidance',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:28.61391,lon:77.20901,timeZone:'Asia/Kolkata'}}});
  const yoga=guidance.result.structuredContent.data.traditions.flatMap(t=>t.items).find(r=>r.id==='DG-J-YOGA');
  assert.equal(yoga.classification,'unavailable');assert.equal(yoga.computed.applicableAtInstant,null);
  assert.equal(yoga.thresholds.openingTimingComputed,false);
  assert.deepEqual(JSON.parse(guidance.result.content.find(c=>c.type==='text').text),guidance.result.structuredContent);
  const atlas=await rpc({jsonrpc:'2.0',id:10,method:'tools/call',params:{name:'workbench_calendar_atlas',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London',family:'chinese'}}});
  assert.equal(atlas.result.structuredContent.data.context.dateISO,'2026-10-29T12:00:00.000Z');
  assert.deepEqual(JSON.parse(atlas.result.content.find(c=>c.type==='text').text),atlas.result.structuredContent);
  assert.equal(listed.result.tools.find(t=>t.name==='workbench_calendar_atlas').annotations.readOnlyHint,true);
  const resource=await rpc({jsonrpc:'2.0',id:5,method:'resources/read',params:{uri:'workbench://methods'}});
  assert.equal(JSON.parse(resource.result.contents[0].text).limits.scanSamples,256);
  assert.equal((await handler.fetch(req(init,{url:'http://evil.example/mcp'}))).status,403);
  assert.equal((await handler.fetch(req(init,{headers:{Origin:'https://evil.example'}}))).status,403);
  assert.equal((await handler.fetch(req({text:'x'.repeat(65536)}))).status,413);
  assert.equal((await handler.fetch(req([init]))).status,400);
  let cancelled=false;
  const aborter=new AbortController();
  const pendingBody=new ReadableStream({cancel(){cancelled=true;}});
  const stalled=new Request('http://127.0.0.1:3001/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:pendingBody,duplex:'half',signal:aborter.signal});
  const aborted=handler.fetch(stalled); aborter.abort();
  assert.equal((await aborted).status,408); assert.equal(cancelled,true);
  const preAborted=new AbortController();preAborted.abort();
  assert.equal((await handler.fetch(new Request(req(init),{signal:preAborted.signal}))).status,408);
  const remote=createHttpHandler({hostname:'mcp.example.org',remote:true,token:'a'.repeat(32)});
  try{
    assert.equal((await remote.fetch(req(init,{url:'https://mcp.example.org/mcp'}))).status,401);
    assert.equal((await remote.fetch(req(init,{url:'https://mcp.example.org/mcp',headers:{Authorization:'Bearer '+'a'.repeat(32)}}))).status,200);
  }finally{await remote.close();}
  console.log('PASS HTTP initialize/list/call/resource, invalid input, host/origin/body bounds and remote authentication');
}finally{await handler.close();}
const child=spawn(process.execPath,[fileURLToPath(new URL('./stdio.mjs',import.meta.url))],{stdio:['pipe','pipe','pipe']});
let buffer='',stderr='';const pending=new Map();
child.stderr.on('data',d=>{stderr+=d;});
child.stdout.on('data',chunk=>{
  buffer+=chunk;
  while(buffer.includes('\n')){const cut=buffer.indexOf('\n');const line=buffer.slice(0,cut);buffer=buffer.slice(cut+1);if(!line.trim())continue;
    try{const message=JSON.parse(line);pending.get(message.id)?.resolve(message);pending.delete(message.id);}catch(e){for(const p of pending.values())p.reject(e);}}
});
child.on('error',error=>{for(const p of pending.values())p.reject(error);});
child.on('exit',code=>{for(const p of pending.values())p.reject(new Error(`stdio exited ${code}: ${stderr}`));});
const send=message=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('stdio response timed out')),15000);pending.set(message.id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});child.stdin.write(JSON.stringify(message)+'\n');});
try{
  assert.equal((await send(init)).result.serverInfo.name,'astrologers-workbench');
  child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
  assert.equal((await send({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})).result.tools.length,TOOLS.length);
  const result=await send({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'workbench_symbol',arguments:{kind:'yantra',planet:'Sun'}}});
  assert.match(result.result.structuredContent.data.presentation.svg,/<svg/);
  const guidance=await send({jsonrpc:'2.0',id:4,method:'tools/call',params:{name:'workbench_explain_guidance',arguments:{dateISO:'2024-04-08T18:17:00Z',lat:51.5,lon:0,timeZone:'Europe/London'}}});
  assert.ok(guidance.result.structuredContent.data.tensions.some(t=>t.id==='DG-TENSION-CAZIMI-SOURCES'&&t.sourceIds.includes('DG-AGRIPPA-29')));
  assert.deepEqual(JSON.parse(guidance.result.content.find(c=>c.type==='text').text),guidance.result.structuredContent);
  const atlas=await send({jsonrpc:'2.0',id:5,method:'tools/call',params:{name:'workbench_calendar_atlas',arguments:{dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London',variant:'gregory'}}});
  assert.equal(atlas.result.structuredContent.data.rows.length,1);
  assert.equal(atlas.result.structuredContent.data.rows[0].id,'gregory');
  assert.deepEqual(JSON.parse(atlas.result.content.find(c=>c.type==='text').text),atlas.result.structuredContent);
  console.log('PASS stdio initialize/list/call with real child-process protocol');
}finally{child.stdin.end();child.kill('SIGTERM');}
