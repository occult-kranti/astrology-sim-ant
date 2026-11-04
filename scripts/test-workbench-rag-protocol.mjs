// Real official-SDK HTTP handler and spawned stdio tests for read-only RAG/chart/action tools.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { WORKBENCH_RAG_MCP_TOOLS } from '../mcp/workbench-rag-adapters.mjs';
const init={jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-11-25',capabilities:{},clientInfo:{name:'workbench-rag-protocol-review',version:'1.0.0'}}};
const profile={name:'Public Greenwich reference',localDate:'2024-03-20',localTime:'03:06',timeZone:'Europe/London',lat:51.4779,lon:0,disambiguation:'reject'};
const inputs={mode:'natal',zodiac:'tropical',system:'placidus',orb:3,primary:profile};
const comparison={...inputs,mode:'transit',secondary:{...profile,name:'Public comparison',localDate:'2025-03-20'}};
let checks=0;
const ok=(v,label)=>{checks++;assert.ok(v,label);};
const eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label);};
async function exercise(rpc){
 eq((await rpc(init)).result.serverInfo.name,'astrologers-workbench');
 const list=(await rpc({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})).result.tools;
 for(const tool of WORKBENCH_RAG_MCP_TOOLS){const listed=list.find(t=>t.name===tool.name);ok(listed,`${tool.name} listed`);eq(listed.inputSchema,tool.inputSchema);eq(listed.annotations.readOnlyHint,true);}
 let id=3;
 const good=[
  ['workbench_rag_search',{query:'whole sign houses',limit:3,maxTokens:1200}],
  ['workbench_rag_search',{query:'qxvzzw nolexicalsource999',limit:2}],
  ['workbench_desktop_chart',{inputs}],
  ['workbench_desktop_chart',{inputs:comparison}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'set_houses',system:'whole'},revision:6}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'open_tool',toolId:'vedic-index'}}],
  ['workbench_desktop_action_preview',{inputs:comparison,action:{type:'step_time',amount:1,unit:'day'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'reset_time'},reference:{primary:{...profile,localDate:'2020-01-01'}}}],
 ];
 for(const[name,args]of good){
  const response=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});
  ok(!response.error&&!response.result?.isError,`${name} resolved: ${JSON.stringify(response.error||response.result?.isError||'')}`);
  const envelope=response.result.structuredContent;
  eq(envelope.tool,name);eq(JSON.parse(response.result.content.find(c=>c.type==='text').text),envelope);
  eq(envelope.data,WORKBENCH_RAG_MCP_TOOLS.find(t=>t.name===name).calculate(args));
  eq(envelope.data.mcpDisclosure.browserActionExecuted,false);eq(envelope.data.mcpDisclosure.networkUsed,false);
  if(name==='workbench_desktop_action_preview'){eq(envelope.data.requiresConfirmation,true);ok(envelope.data.execution.includes('Preview only'));}
  if(name==='workbench_desktop_chart')eq(envelope.data.primary.bodies.length,12);
 }
 const bad=[
  ['workbench_rag_search',{query:'house',url:'https://example.com'}],
  ['workbench_rag_search',{query:'house',maxTokens:6001}],
  ['workbench_rag_search',{query:'house',limit:9}],
  ['workbench_rag_search',{query:'house',categories:['invented-category']}],
  ['workbench_desktop_chart',{inputs:{...inputs,apiKey:'never-read'}}],
  ['workbench_desktop_chart',{inputs:{...inputs,primary:{...profile,timeKnown:false}}}],
  ['workbench_desktop_chart',{inputs:{...inputs,primary:{...profile,localTime:'24:00'}}}],
  ['workbench_desktop_chart',{inputs:{...inputs,primary:{...profile,localDate:'2024-03-10',localTime:'02:30',timeZone:'America/New_York'}}}],
  ['workbench_desktop_chart',{inputs:{...inputs,mode:'synastry'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'delete_library'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'set_houses',system:'whole',url:'https://example.com'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'set_mode',mode:'transit'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'reset_time'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'set_orb',orb:3,revision:6}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'open_tool',toolId:'javascript:alert(1)'}}],
  ['workbench_desktop_action_preview',{inputs,action:{type:'set_chart',frame:'primary',profile:{localDate:'2000-01-01'}}}],
 ];
 for(const[name,args]of bad){const r=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});ok(r.error||r.result?.isError,'Strict malformed/unsafe proposal rejection');}
}
const handler=createHttpHandler();
try{await exercise(async body=>{const r=await handler.fetch(new Request('http://127.0.0.1:3001/mcp',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2025-11-25'},body:JSON.stringify(body)}));eq(r.status,200);const text=await r.text();return r.headers.get('content-type')?.includes('text/event-stream')?JSON.parse(text.split('\n').filter(l=>l.startsWith('data: ')).map(l=>l.slice(6)).join('\n')):JSON.parse(text);});}finally{await handler.close();}
const child=spawn(process.execPath,[fileURLToPath(new URL('../mcp/stdio.mjs',import.meta.url))],{stdio:['pipe','pipe','pipe']});
let buffer='',stderr='';const pending=new Map();
child.stderr.on('data',d=>{stderr+=d;});child.stdout.on('data',d=>{buffer+=d;while(buffer.includes('\n')){const index=buffer.indexOf('\n'),line=buffer.slice(0,index);buffer=buffer.slice(index+1);if(!line.trim())continue;try{const m=JSON.parse(line);pending.get(m.id)?.resolve(m);pending.delete(m.id);}catch(e){for(const p of pending.values())p.reject(e);}}});
child.on('error',e=>{for(const p of pending.values())p.reject(e);});child.on('exit',code=>{for(const p of pending.values())p.reject(new Error(`stdio exited ${code}: ${stderr}`));});
const rpc=body=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(body.id);reject(Error('Workbench RAG stdio timed out'));},15000);pending.set(body.id,{resolve:value=>{clearTimeout(timer);if(body.method==='initialize')child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');resolve(value);},reject:e=>{clearTimeout(timer);reject(e);}});child.stdin.write(JSON.stringify(body)+'\n');});
try{await exercise(rpc);}finally{child.stdin.end();child.kill('SIGTERM');}
console.log(JSON.stringify({status:'PASS',checks,tools:WORKBENCH_RAG_MCP_TOOLS.map(t=>t.name),transports:['official-SDK HTTP handler','spawned child-process stdio'],liveModelUsed:false,hostedDeploymentVerified:false},null,2));
