// Actual official-SDK HTTP-handler and child-process stdio country-study contract.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { COUNTRY_HISTORY_MCP_TOOL } from '../mcp/country-history-adapters.mjs';
import { buildCountryHistoryStudy } from '../assets/js/core/country-history.js';
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'country-history-protocol-review', version: '1.0.0' } } };
const name = COUNTRY_HISTORY_MCP_TOOL.name;
const recordIds = ['usa-declaration-adopted-1776','india-independence-1947','iran-republic-referendum-conclusion-1979'];
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks++; };
async function exercise(rpc) {
  const initialized = await rpc(init); ok(initialized.result.serverInfo.name === 'astrologers-workbench', 'Actual Workbench SDK initialization');
  const listed = (await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })).result.tools;
  const tool = listed.find(t => t.name === name); ok(tool, 'Historical tool is listed');
  assert.deepEqual(tool.inputSchema, COUNTRY_HISTORY_MCP_TOOL.inputSchema); checks++;
  ok(tool.annotations.readOnlyHint === true, 'Read-only annotation retained');
  let id = 3;
  for (const includeDaySensitivity of [false,true]) {
    const args = {recordIds, houseSystem:'equal', includeDaySensitivity};
    const response = await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});
    ok(!response.error && !response.result?.isError, 'Historical tool call succeeds');
    const envelope = response.result.structuredContent;
    ok(envelope.tool === name, 'Named result envelope');
    assert.deepEqual(JSON.parse(response.result.content.find(c => c.type === 'text').text), envelope); checks++;
    assert.deepEqual(envelope.data, buildCountryHistoryStudy(args)); checks++;
    ok(envelope.data.records.every(r => r.record.time.localTime === null && r.record.time.status === 'date-only'), 'Unknown event clocks survive both transports');
    ok(envelope.data.records[0].civilComparison.status === 'unavailable' && envelope.data.records[0].daySensitivity.samples.length === 0, 'Unsupported US dates stay unavailable');
    ok(envelope.data.records.slice(1).every(r=>includeDaySensitivity ? r.daySensitivity.samples.length===25 && r.daySensitivity.samples.every(s=>s.assumption===true && s.cusps.length===12) : r.daySensitivity.samples.length===0), 'Optional historical geometry stays complete and explicitly assumed');
  }
  for (const args of [{recordIds,date:'2031-01-01'},{recordIds,objective:'military timing'},{recordIds,birth:{}},{recordIds:['future-2031']},{recordIds,includeDaySensitivity:'true'}]) {
    const response = await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name,arguments:args}});
    ok(response.error || response.result?.isError, 'Transport rejects unknown, future, objective or malformed context');
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
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Country history stdio response timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(send); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ pass: true, checks, transports: ['official-SDK HTTP handler', 'actual child-process stdio'], liveProviderUsed: false, hostedDeploymentVerified: false }));
