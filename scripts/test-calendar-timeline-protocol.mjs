// Actual official-SDK HTTP-handler and spawned stdio timeline-frame contracts.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { CALENDAR_TIMELINE_MCP_TOOLS } from '../mcp/calendar-timeline-adapters.mjs';
const tool = CALENDAR_TIMELINE_MCP_TOOLS[0], name = tool.name;
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'calendar-timeline-protocol-review', version: '1.0.0' } } };
const ordinary={startDate:'2026-10-30',endDate:'2026-11-02',time:'12:00',timeZone:'Europe/London',lat:51.5074,lon:-.1278,system:'regiomontanus',disambiguation:'reject',index:1};
const ny={...ordinary,startDate:'2027-03-14',endDate:'2027-03-14',time:'02:30',timeZone:'America/New_York',lat:40.7128,lon:-74.006,index:0};
const fold={...ny,startDate:'2026-11-01',endDate:'2026-11-01',time:'01:30'};
let checks=0;
const ok=(condition,label)=>{assert.ok(condition,label);checks++;};
async function exercise(rpc){
 const initialized=await rpc(init);ok(initialized.result.serverInfo.name==='astrologers-workbench','Actual Workbench SDK initialization');
 const list=(await rpc({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})).result.tools,actual=list.find(t=>t.name===name);ok(actual,'Timeline frame tool listed');assert.deepEqual(actual.inputSchema,tool.inputSchema);checks++;ok(actual.annotations.readOnlyHint===true,'Read-only annotation retained');
 let id=3;
 for(const args of [ordinary,{...ordinary,includeCatalogStars:true,includeGuidance:false},ny,fold,{...fold,disambiguation:'later'},{...ordinary,startDate:'1900-01-01',endDate:'1900-01-01',time:'00:00',timeZone:'Asia/Tokyo',lat:35.68,lon:139.69,index:0}]){
  const response=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});ok(!response.error&&!response.result?.isError,'Complete timeline call resolves over actual transport');
  const envelope=response.result.structuredContent;ok(envelope.tool===name,'Named envelope retained');assert.deepEqual(JSON.parse(response.result.content.find(c=>c.type==='text').text),envelope);checks++;
  assert.deepEqual(envelope.data,tool.calculate(args));checks++;
  ok(envelope.data.slot.localDate>=args.startDate&&envelope.data.slot.localDate<=args.endDate,'Selected date remains within declared grid');
  if(envelope.data.status==='available')ok(envelope.data.comparison.calendars.length===13&&envelope.data.sky.bodies.length===10&&envelope.data.charts.tropical.cusps.length===12,'Available frame preserves full synchronized geometry');
  else ok(envelope.data.comparison===null&&envelope.data.sky===null&&envelope.data.slot.reason,'Unavailable clock keeps its reason without substituted chart');
 }
 for(const args of [{...ordinary,objective:'military timing'},{...ordinary,country:'usa'},{...ordinary,birth:{}},{...ordinary,privateNotes:'secret'},{...ordinary,index:-1},{...ordinary,index:4},{...ordinary,includeCatalogStars:'true'},{...ordinary,startDate:'1899-12-31'},Object.fromEntries(Object.entries(ordinary).filter(([k])=>k!=='time'))]){
  const response=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});ok(response.error||response.result?.isError,'Strict transport rejects unknown context or malformed selection');
 }
}

const handler = createHttpHandler();
try {
  await exercise(async body => {
    const response = await handler.fetch(new Request('http://127.0.0.1:3001/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' }, body: JSON.stringify(body) }));
    assert.equal(response.status, 200);
    const text = await response.text();
    return response.headers.get('content-type')?.includes('text/event-stream') ? JSON.parse(text.split('\n').filter(line => line.startsWith('data: ')).map(line => line.slice(6)).join('\n')) : JSON.parse(text);
  });
} finally { await handler.close(); }

const child = spawn(process.execPath, [fileURLToPath(new URL('../mcp/stdio.mjs', import.meta.url))], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = '', stderr = '';
const pending = new Map();
child.stderr.on('data', data => { stderr += data; });
child.stdout.on('data', data => {
  buffer += data;
  while (buffer.includes('\n')) {
    const cut = buffer.indexOf('\n'), line = buffer.slice(0, cut); buffer = buffer.slice(cut + 1); if (!line.trim()) continue;
    try { const message = JSON.parse(line); pending.get(message.id)?.resolve(message); pending.delete(message.id); }
    catch (error) { for (const request of pending.values()) request.reject(error); }
  }
});
child.on('error', error => { for (const request of pending.values()) request.reject(error); });
child.on('exit', code => { for (const request of pending.values()) request.reject(new Error('stdio exited ' + code + ': ' + stderr)); });
const send = body => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Calendar timeline stdio response timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(send); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ pass: true, checks, transports: ['official-SDK HTTP handler', 'actual child-process stdio'], liveProviderUsed: false, hostedDeploymentVerified: false }));
