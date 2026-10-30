// Focused official-SDK HTTP-handler and child-process stdio integration.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { HORIZON_MCP_TOOLS } from '../mcp/horizon-adapters.mjs';
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'horizon-protocol-review', version: '1.0.0' } } };
const observerCase = { id: 'london', lat: 51.5, lon: 0, timeZone: 'Europe/London', sampleTime: '12:00' }, purposeIds = ['western-increase-study', 'jyotisha-classification-study'];
const scan = { startDate: '2026-10-30', endDate: '2026-10-31', cases: [observerCase], purposeIds };
const day = { date: '2026-11-06', observerCase, purposeIds: ['jyotisha-classification-study'] };
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks++; };
async function exercise(rpc) {
  const initialized = await rpc(init); ok(initialized.result.serverInfo.name === 'astrologers-workbench', 'Initialized actual Workbench SDK server');
  const listed = (await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })).result.tools;
  for (const tool of HORIZON_MCP_TOOLS) {
    const actual = listed.find(t => t.name === tool.name); ok(actual, 'Horizon tool is listed');
    assert.deepEqual(actual.inputSchema, tool.inputSchema); checks++;
    ok(actual.annotations.readOnlyHint === true, 'Read-only annotation retained');
  }
  for (const [id, name, args] of [[3, 'workbench_horizon_scan', scan], [4, 'workbench_horizon_day', day]]) {
    const response = await rpc({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
    ok(!response.error && !response.result?.isError, 'Asynchronous horizon tool call succeeded');
    const data = response.result.structuredContent; ok(data.tool === name, 'Named result envelope retained');
    assert.deepEqual(JSON.parse(response.result.content.find(c => c.type === 'text').text), data); checks++;
    if (name.endsWith('_scan')) {
      ok(data.data.counts.processedSamples === 2 && data.data.cases[0].rows.length === 2, 'Resolved complete rows, not a serialized Promise');
      ok(data.data.counts.truncated === false, 'No silent truncation');
    } else {
      ok(data.data.detail.purposes[0].score === null && data.data.detail.purposes[0].observed === 3, 'Unresolved rule missingness survives protocol');
    }
  }
  const invalid = await rpc({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'workbench_horizon_scan', arguments: { ...scan, birth: {} } } });
  ok(invalid.error || invalid.result?.isError, 'Strict transport allowlist rejects private extra context');
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
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Horizon stdio response timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(send); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ pass: true, checks, transports: ['official-SDK HTTP handler', 'actual child-process stdio'], liveProviderUsed: false, hostedDeploymentVerified: false }));
