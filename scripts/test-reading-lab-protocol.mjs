// Official MCP SDK HTTP handler + real spawned stdio process. Public fixtures
// only; no live model, browser execution, saved profile, or external network.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { READING_LAB_MCP_TOOLS } from '../mcp/reading-lab-adapters.mjs';
import { READING_CASES } from '../assets/js/core/data/reading-cases.js';
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'reading-lab-protocol-review', version: '1.0.0' } } };
const dateOnly = { dateISO: '2024-03-20', timeZone: 'UTC' };
const moment = { instantISO: '2024-03-20T03:06:00Z', timeZone: 'Europe/London', lat: 51.5074, lon: -0.1278 };
const cases = READING_CASES.map(c => c.id);
let checks = 0;
const ok = (value, label) => { checks++; assert.ok(value, label); };
const eq = (a, b, label) => { checks++; assert.deepEqual(a, b, label); };
// Direct JS callers must not invoke getters/iterators before schema rejection.
let accessorCalls=0;
const accessorArray=['mayan'];Object.defineProperty(accessorArray,'0',{get(){accessorCalls++;return 'mayan';},enumerable:true});
const iteratorArray=['mayan'];iteratorArray[Symbol.iterator]=function*(){accessorCalls++;yield 'mayan';};
for(const frameworks of [accessorArray,iteratorArray,Array(1),Object.assign(['mayan'],{extra:'x'})]){
  assert.throws(()=>READING_LAB_MCP_TOOLS[0].calculate({inputs:{...dateOnly,frameworks}}));checks++;
}
eq(accessorCalls,0,'Invalid array accessors and iterators never execute');
async function exercise(rpc) {
  eq((await rpc(init)).result.serverInfo.name, 'astrologers-workbench');
  const list = (await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })).result.tools;
  for (const tool of READING_LAB_MCP_TOOLS) {
    const listed = list.find(t => t.name === tool.name);
    ok(listed, `${tool.name} listed`); eq(listed.inputSchema, tool.inputSchema); eq(listed.annotations.readOnlyHint, true);
  }
  let id = 3;
  const good = [
    ['workbench_reading_lab', { inputs: dateOnly }],
    ['workbench_reading_lab', { inputs: moment }],
    ['workbench_reading_lab', { inputs: { dateISO: '-003113-08-11', timeZone: 'UTC', frameworks: ['mayan'] } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, frameworks: ['dee', 'plato'] } }],
    ['workbench_reading_lab', { caseId: 'lilly-dog-printed-figure' }],
    ['workbench_reading_lab', { caseId: 'lilly-cazimi-example' }],
    ['workbench_reading_lab', { caseId: 'vedic-rao-tithi-example-2' }],
    ['workbench_reading_lab', { caseId: 'dee-monas-symbolic-method' }],
    ['workbench_reading_examples', {}],
    ['workbench_reading_examples', { caseIds: ['mayan-nmai-2012-12-20', 'plato-er-choice'] }],
  ];
  for (const [name, args] of good) {
    const response = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
    ok(!response.error && !response.result?.isError, `${name} resolved: ${JSON.stringify(response.error || response.result)}`);
    const envelope = response.result.structuredContent, data = envelope.data;
    eq(envelope.tool, name); eq(JSON.parse(response.result.content.find(c => c.type === 'text').text), envelope);
    eq(data, READING_LAB_MCP_TOOLS.find(t => t.name === name).calculate(args));
    for (const field of ['networkUsed', 'modelUsed', 'privateRecordsRead', 'browserActionExecuted']) eq(data.mcpDisclosure[field], false, `${field} is false`);
    eq(data.mcpDisclosure.readOnly, true);
    if (args.inputs === dateOnly) { eq(data.context.timeKnown, false); eq(data.context.instantISO, null); eq(data.frameworks.lilly.facts.chart, undefined); eq(data.frameworks.vedic.facts.panchanga, undefined); }
    if (args.inputs === moment) { eq(data.context.instantISO, '2024-03-20T03:06:00.000Z'); eq(Object.keys(data.frameworks).length, 9); ok(Math.min(data.frameworks.lilly.facts.chart.planets.Sun.longitude, 360 - data.frameworks.lilly.facts.chart.planets.Sun.longitude) < .02); }
    if (args.inputs?.dateISO === '-003113-08-11') { eq(data.frameworks.mayan.facts.longCount, '0.0.0.0.0'); eq(data.frameworks.mayan.facts.correlation, 584283); eq(data.context.timeKnown, false); }
    if (args.inputs?.frameworks?.includes('dee')) for (const family of ['dee', 'plato']) { eq(data.frameworks[family].facts, {}); eq(data.frameworks[family].status, 'textual-only'); }
    if (args.caseId) eq(data.outcomeEvaluable, false);
    if (args.caseId === 'dee-monas-symbolic-method') { eq(data.total, 0); eq(data.status, 'not-numerically-evaluable'); }
    if (args.caseId === 'lilly-dog-printed-figure') {
      eq(data.total, 4); eq(data.matched, 4); eq(data.result.frameworks.lilly.status, 'partial-source-reconstruction');
      const chart = data.result.frameworks.lilly.facts.chart;
      eq(chart.ascendant, undefined); eq(chart.houses, undefined);
      for (const p of Object.values(chart.planets)) { eq(p.house, undefined); eq(p.dignity, undefined); eq(p.retrograde, undefined); }
    }
    if (name === 'workbench_reading_examples' && !args.caseIds) {
      eq(data.examples.map(e => e.caseId), cases); eq(data.summary.comparedFields, 24); eq(data.summary.matchedFields, 24);
      ok(data.examples.every(e => e.outcomeEvaluable === false));
      ok(data.examples.some(e => e.total === 0 && e.status === 'not-numerically-evaluable'));
      ok(data.sources.every(s => s.id && s.readingDepth && s.locator));
    }
  }
  // Legacy printed-chart MCP must apply the same partial-source boundary.
  const old = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name: 'workbench_printed_chart', arguments: { key: 'dog' } } });
  ok(!old.error && !old.result?.isError);
  const legacy = old.result.structuredContent.data;
  eq(legacy.status, 'partial-reconstructed'); eq(legacy.result.asc, undefined); eq(legacy.result.cusps, undefined);
  eq(legacy.result.planets.Sun.lon, 165.75); eq(legacy.result.planets.Sun.house, undefined); eq(legacy.sourceRecord.verification.verifiedPlanetLongitudes.length, 4);
  const bad = [
    ['workbench_reading_lab', {}],
    ['workbench_reading_lab', { inputs: dateOnly, caseId: cases[0] }],
    ['workbench_reading_lab', { caseId: 'private-birth' }],
    ['workbench_reading_lab', { inputs: dateOnly, url: 'https://example.invalid' }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, facts: { forged: 1 } } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, expected: [{ field: 'outcome', value: true }] } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, profileId: 'local-private' } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, action: { type: 'delete_library' } } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, frameworks: ['mayan', 'mayan'] } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, frameworks: ['christian'] } }],
    ['workbench_reading_lab', { inputs: { ...dateOnly, time: '24:00' } }],
    ['workbench_reading_lab', { inputs: { dateISO: '2024-03-10', time: '02:30', timeZone: 'America/New_York' } }],
    ['workbench_reading_lab', { inputs: { dateISO: '2024-11-03', time: '01:30', timeZone: 'America/New_York' } }],
    ['workbench_reading_lab', { inputs: { dateISO: '-003113-08-10', timeZone: 'UTC', frameworks: ['mayan'] } }],
    ['workbench_reading_lab', { inputs: { dateISO: '-003113-08-11', time: '12:00', timeZone: 'UTC', frameworks: ['mayan'] } }],
    ['workbench_reading_examples', { caseIds: [] }],
    ['workbench_reading_examples', { caseIds: [cases[0], cases[0]] }],
    ['workbench_reading_examples', { caseIds: ['invented'] }],
    ['workbench_reading_examples', { expected: [] }],
  ];
  for (const [name, args] of bad) { const response = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } }); ok(response.error || response.result?.isError, 'Unknown, ambiguous, unsupported or executable input rejected'); }
}
const handler = createHttpHandler();
try {
  await exercise(async body => {
    const r = await handler.fetch(new Request('http://127.0.0.1:3001/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' }, body: JSON.stringify(body) }));
    eq(r.status, 200); const value = await r.text();
    return r.headers.get('content-type')?.includes('text/event-stream') ? JSON.parse(value.split('\n').filter(l => l.startsWith('data: ')).map(l => l.slice(6)).join('\n')) : JSON.parse(value);
  });
} finally { await handler.close(); }
const child = spawn(process.execPath, [fileURLToPath(new URL('../mcp/stdio.mjs', import.meta.url))], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = '', stderr = ''; const pending = new Map();
child.stderr.on('data', d => { stderr += d; });
child.stdout.on('data', d => {
  buffer += d;
  while (buffer.includes('\n')) {
    const index = buffer.indexOf('\n'), line = buffer.slice(0, index); buffer = buffer.slice(index + 1);
    if (!line.trim()) continue;
    try { const m = JSON.parse(line); pending.get(m.id)?.resolve(m); pending.delete(m.id); }
    catch (error) { for (const p of pending.values()) p.reject(error); }
  }
});
child.on('error', error => { for (const p of pending.values()) p.reject(error); });
child.on('exit', code => { for (const p of pending.values()) p.reject(new Error(`stdio exited ${code}: ${stderr}`)); });
const rpc = body => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Reading Lab stdio timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(rpc); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ status: 'PASS', checks, tools: READING_LAB_MCP_TOOLS.map(t => t.name), transports: ['official-SDK HTTP handler', 'spawned child-process stdio'], liveModelUsed: false, hostedDeploymentVerified: false }, null, 2));
