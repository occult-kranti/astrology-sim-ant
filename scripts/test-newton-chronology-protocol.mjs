// Actual official-SDK HTTP-handler and spawned stdio Newton chronology contracts.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { NEWTON_CHRONOLOGY_MCP_TOOL } from '../mcp/newton-chronology-adapters.mjs';
const tool = NEWTON_CHRONOLOGY_MCP_TOOL, name = tool.name;
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'newton-chronology-protocol-review', version: '1.0.0' } } };
const ordinary={date:'2060-01-01',time:'12:00',timeZone:'UTC',lat:51.5074,lon:-.1278,system:'regiomontanus',disambiguation:'reject'};
let checks=0;
const ok=(condition,label)=>{assert.ok(condition,label);checks++;};
async function exercise(rpc){
 const initialized=await rpc(init);ok(initialized.result.serverInfo.name==='astrologers-workbench','Actual Workbench SDK initialization');
 const list=(await rpc({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})).result.tools,actual=list.find(t=>t.name===name);ok(actual,'Newton chronology tool listed');assert.deepEqual(actual.inputSchema,tool.inputSchema);checks++;ok(actual.annotations.readOnlyHint===true,'Read-only annotation retained');
 let id=3;
 for(const args of [ordinary,{...ordinary,date:'2060-02-29',includeCatalogStars:true},{...ordinary,date:'2026-03-08',time:'02:30',timeZone:'America/New_York'},{...ordinary,date:'2026-11-01',time:'01:30',timeZone:'America/New_York',disambiguation:'later'}]){
  const response=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});ok(!response.error&&!response.result?.isError,'Complete chronology call resolves over actual transport');
  const envelope=response.result.structuredContent;ok(envelope.tool===name,'Named envelope retained');assert.deepEqual(JSON.parse(response.result.content.find(c=>c.type==='text').text),envelope);checks++;
  assert.deepEqual(envelope.data,tool.calculate(args));checks++;
  ok(envelope.data.chronology&&envelope.data.frame&&envelope.data.disclosure.chosenDayIsPropheticDate===false,'Documented chronology and explicitly chosen study frame remain separate');
 }
 for(const args of [{...ordinary,objective:'military timing'},{...ordinary,country:'usa'},{...ordinary,birth:{}},{...ordinary,belief:'inferred'},{...ordinary,date:'2060-02-30'},{...ordinary,date:'2101-01-01'},{...ordinary,includeCatalogStars:'true'},Object.fromEntries(Object.entries(ordinary).filter(([k])=>k!=='time'))]){
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
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Newton chronology stdio response timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(send); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ pass: true, checks, transports: ['official-SDK HTTP handler', 'actual child-process stdio'], liveProviderUsed: false, hostedDeploymentVerified: false }));
