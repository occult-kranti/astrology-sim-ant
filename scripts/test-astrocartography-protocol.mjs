// Actual official-SDK HTTP and spawned stdio integration. Public synthetic
// inputs only; no model inference, account connection or external network.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { ASTROCARTOGRAPHY_MCP_TOOLS, ASTROCARTOGRAPHY_MCP_MAX_BYTES } from '../mcp/astrocartography-adapters.mjs';
import { ASTROCARTOGRAPHY_CITIES as CITIES } from '../assets/js/core/data/astrocartography-data.js';

const profile = { name: 'Public Greenwich reference', localDate: '2024-03-20', localTime: '03:06:00', timeZone: 'Etc/UTC', lat: 51.4779, lon: 0, disambiguation: 'reject' };
const inputs = { profile, bodyIds: ['Sun', 'Moon', 'Venus'], angleIds: ['ASC', 'DSC', 'MC', 'IC'], purpose: 'overview', radiusKm: 500, system: 'regiomontanus', cityIds: CITIES.slice(0, 2).map(row => row.id) };
const place = { name: 'Public equatorial reference', lat: 0, lon: 0, timeZone: 'Etc/UTC' };
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'astrocartography-protocol-review', version: '1.0.0' } } };
let checks = 0;
const ok = (condition, label) => { assert.ok(condition, label); checks++; };
const eq = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const rejects = (fn, label) => { assert.throws(fn, undefined, label); checks++; };

// Direct JavaScript callers must not invoke accessors/iterators before rejection.
let sideEffects = 0;
const accessorArray = ['Sun']; Object.defineProperty(accessorArray, '0', { get() { sideEffects++; return 'Sun'; }, enumerable: true });
const iteratorArray = ['Sun']; iteratorArray[Symbol.iterator] = function* () { sideEffects++; yield 'Sun'; };
for (const bodyIds of [accessorArray, iteratorArray, Array(1), Object.assign(['Sun'], { extra: true })]) {
  rejects(() => ASTROCARTOGRAPHY_MCP_TOOLS[0].calculate({ inputs: { ...inputs, bodyIds } }), 'Non-JSON array rejected');
}
const getterProfile = { ...profile }; Object.defineProperty(getterProfile, 'lat', { get() { sideEffects++; return 0; }, enumerable: true });
rejects(() => ASTROCARTOGRAPHY_MCP_TOOLS[0].calculate({ inputs: { ...inputs, profile: getterProfile } }), 'Getter profile rejected');
eq(sideEffects, 0, 'Schema validation never executes supplied getters or iterators');
for (const invalid of [Infinity, -Infinity, NaN]) rejects(() => ASTROCARTOGRAPHY_MCP_TOOLS[0].calculate({ inputs: { ...inputs, radiusKm: invalid } }), 'Nonfinite radius rejected');

async function exercise(rpc) {
  eq((await rpc(init)).result.serverInfo.name, 'astrologers-workbench');
  const listed = (await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })).result.tools;
  for (const tool of ASTROCARTOGRAPHY_MCP_TOOLS) {
    const record = listed.find(row => row.name === tool.name);
    ok(record, `${tool.name} is registered`); eq(record.inputSchema, tool.inputSchema, 'Exact advertised schema');
    eq(record.annotations.readOnlyHint, true, 'Read-only annotation');
  }
  let id = 3;
  const good = [
    ['workbench_astrocartography', { inputs }],
    ['workbench_astrocartography', { inputs: { profile } }],
    ['workbench_astrocartography', { inputs: { ...inputs, cityIds: [] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, bodyIds: ['Sun'], angleIds: ['MC', 'IC'], radiusKm: 1 } }],
    ['workbench_astrocartography', { inputs: { ...inputs, purpose: 'study', radiusKm: 3000, profile: { ...profile, localDate: '2024-11-03', localTime: '01:30:00', timeZone: 'America/New_York', lat: 40.7128, lon: -74.006, disambiguation: 'earlier' } } }],
    ['workbench_astrocartography_place', { inputs, place }],
    ['workbench_astrocartography_place', { inputs, place: { ...place, name: 'Public dateline reference', lon: 180, timeZone: 'Pacific/Tarawa' } }],
    ['workbench_astrocartography_place', { inputs, place: { name: 'North pole boundary study', lat: 90, lon: 0, timeZone: 'Etc/UTC' } }],
    ['workbench_astrocartography_place', { inputs: { ...inputs, system: 'whole' }, place: { name: 'Public Sydney reference', lat: -33.8688, lon: 151.2093, timeZone: 'Australia/Sydney' } }]
  ];
  for (const [name, args] of good) {
    const response = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
    ok(!response.error && !response.result?.isError, `${name} succeeds: ${JSON.stringify(response.error || response.result?.content)}`);
    const envelope = response.result.structuredContent, data = envelope.data;
    eq(envelope.tool, name, 'Tool identity is preserved');
    eq(JSON.parse(response.result.content.find(row => row.type === 'text').text), envelope, 'Text and structured payloads match');
    eq(data, ASTROCARTOGRAPHY_MCP_TOOLS.find(tool => tool.name === name).calculate(args), 'Transport result matches canonical bounded adapter');
    ok(Buffer.byteLength(JSON.stringify(data)) <= ASTROCARTOGRAPHY_MCP_MAX_BYTES, 'Payload stays within declared 32 KiB');
    eq(data.mcpDisclosure.readOnly, true);
    for (const field of ['networkUsed', 'modelUsed', 'privateRecordsRead', 'browserActionExecuted', 'fullMapGeometryIncluded']) eq(data.mcpDisclosure[field], false, `${field} remains false`);
    ok(!Object.hasOwn(data, 'lines') && !Object.hasOwn(data, 'geometry') && !Object.hasOwn(data, 'polylines'), 'Global line geometry is not exposed');
    ok(Array.isArray(data.sources) && data.sources.length > 0, 'Source metadata remains in summary');
    ok(Array.isArray(data.limitations) && data.limitations.length > 0, 'Method limitations remain in summary');
    if (args.place?.lat === 90) {
      eq(data.relocation.status, 'unavailable', 'Polar relocated chart is explicitly unavailable');
      eq(data.relocatedChart, null, 'No polar houses are invented');
      ok(data.distances.every(row => Number.isFinite(row.distanceKm)), 'Spherical line distances remain explicit at the pole');
    }
  }
  const withoutTime = { ...profile }; delete withoutTime.localTime;
  const invalid = [
    ['workbench_astrocartography', {}],
    ['workbench_astrocartography', { inputs, url: 'https://example.invalid' }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: withoutTime } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, dateISO: '2024-01-01T00:00:00Z' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, timeKnown: false } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, localDate: '2024-02-30' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, localDate: '1899-12-31' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, localDate: '2101-01-01' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, timeZone: 'Invalid/Zone' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, localDate: '2024-03-10', localTime: '02:30:00', timeZone: 'America/New_York' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, profile: { ...profile, localDate: '2024-11-03', localTime: '01:30:00', timeZone: 'America/New_York' } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, bodyIds: ['Earth'] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, bodyIds: [] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, bodyIds: ['Sun', 'Sun'] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, angleIds: ['ASC', 'ASC'] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, angleIds: ['invented'] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, cityIds: Array(41).fill(CITIES[0].id) } }],
    ['workbench_astrocartography', { inputs: { ...inputs, cityIds: ['private-location'] } }],
    ['workbench_astrocartography', { inputs: { ...inputs, radiusKm: 0 } }],
    ['workbench_astrocartography', { inputs: { ...inputs, radiusKm: 3001 } }],
    ['workbench_astrocartography', { inputs: { ...inputs, purpose: 'guaranteed-success' } }],
    ['workbench_astrocartography', { inputs: { ...inputs, system: 'invented' } }],
    ['workbench_astrocartography', { inputs: { ...inputs, bodyPositions: { Sun: { longitude: 0 } } } }],
    ['workbench_astrocartography', { inputs: { ...inputs, includeGeometry: true } }],
    ['workbench_astrocartography_place', { inputs }],
    ['workbench_astrocartography_place', { inputs, place: { ...place, lat: 91 } }],
    ['workbench_astrocartography_place', { inputs, place: { ...place, lon: -181 } }],
    ['workbench_astrocartography_place', { inputs, place: { ...place, timeZone: 'Invalid/Zone' } }],
    ['workbench_astrocartography_place', { inputs, place: { ...place, chart: { forged: true } } }],
    ['workbench_astrocartography_place', { inputs, place, action: { type: 'save_profile' } }]
  ];
  for (const [name, args] of invalid) {
    const result = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
    ok(Boolean(result.error || result.result?.isError), `Invalid or forged input rejected for ${name}`);
  }
}

const handler = createHttpHandler();
try {
  await exercise(async body => {
    const response = await handler.fetch(new Request('http://127.0.0.1:3001/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' }, body: JSON.stringify(body) }));
    eq(response.status, 200, 'MCP HTTP transport status');
    const text = await response.text();
    return response.headers.get('content-type')?.includes('text/event-stream') ? JSON.parse(text.split('\n').filter(line => line.startsWith('data: ')).map(line => line.slice(6)).join('\n')) : JSON.parse(text);
  });
} finally { await handler.close(); }

const child = spawn(process.execPath, [fileURLToPath(new URL('../mcp/stdio.mjs', import.meta.url))], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = '', stderr = '';
const pending = new Map();
child.stderr.on('data', data => { stderr = (stderr + data).slice(-65536); });
child.stdout.on('data', data => {
  buffer += data;
  while (buffer.includes('\n')) {
    const end = buffer.indexOf('\n'), line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
    if (!line.trim()) continue;
    try { const message = JSON.parse(line); pending.get(message.id)?.resolve(message); pending.delete(message.id); }
    catch (error) { for (const request of pending.values()) request.reject(error); }
  }
});
child.on('error', error => { for (const request of pending.values()) request.reject(error); });
child.on('exit', code => { for (const request of pending.values()) request.reject(new Error(`Astrocartography stdio exited ${code}: ${stderr}`)); });
const rpc = body => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Astrocartography stdio timed out')); }, 20000);
  pending.set(body.id, {
    resolve(value) { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); },
    reject(error) { clearTimeout(timer); reject(error); }
  });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(rpc); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ status: 'PASS', checks, tools: ASTROCARTOGRAPHY_MCP_TOOLS.map(tool => tool.name), transports: ['official-SDK HTTP handler', 'spawned child-process stdio'], liveModelUsed: false, hostedDeploymentVerified: false }, null, 2));
