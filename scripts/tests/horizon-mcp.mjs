import assert from 'node:assert/strict';
import { HORIZON_MCP_TOOLS, HORIZON_MCP_LIMITS } from '../../mcp/horizon-adapters.mjs';
import { buildEventHorizon, getHorizonDayDetail, getHorizonHourlyDetail } from '../../assets/js/core/event-horizon.js';
import { HORIZON_PURPOSES } from '../../assets/js/core/horizon-ranking.js';
import { callTool, TOOLS } from '../../mcp/toolkit.mjs';
const observerCase = { id: 'london', lat: 51.5, lon: 0, timeZone: 'Europe/London', sampleTime: '12:00' };
const purposeIds = HORIZON_PURPOSES.map(p => p.id);
const scanArgs = { startDate: '2026-10-30', endDate: '2026-11-02', cases: [observerCase], purposeIds };
const dayArgs = { date: '2026-10-30', observerCase, purposeIds: [purposeIds[0]] };
const scan = args => HORIZON_MCP_TOOLS[0].calculate(args), day = args => HORIZON_MCP_TOOLS[1].calculate(args);
const clone = x => JSON.parse(JSON.stringify(x));
const semantic = x => { const c = clone(x); delete c.stats; delete c.provenance; delete c.mcpDisclosure; delete c.adapterLimits; return c; };
export async function run() {
  let passed = 0; const failures = [];
  const test = async (name, fn) => { try { await fn(); passed++; } catch (e) { failures.push(name + ': ' + e.message); } };
  await test('Scan resolves real asynchronous rows equal to the canonical complete window', async () => {
    const pending = scan(scanArgs); assert.equal(typeof pending.then, 'function'); const actual = await pending;
    const expected = await buildEventHorizon({ ...scanArgs, includeAstronomy: false, includeObservances: true });
    assert.deepEqual(semantic(actual), semantic(expected)); assert.equal(actual.counts.processedSamples, 4); assert.equal(actual.counts.profileResults, 16); assert.equal(actual.counts.truncated, false);
    assert.equal(actual.cases[0].rows.at(-1).date, '2026-11-02'); assert.equal(actual.mcpDisclosure.birthIncluded, false); assert.equal(actual.mcpDisclosure.modelUsed, false);
  });
  await test('Day detail recomputes requested profiles and exact canonical hourly evidence', async () => {
    const actual = await day({ ...dayArgs, includeHourly: true });
    const ledger = await buildEventHorizon({ startDate: dayArgs.date, endDate: dayArgs.date, cases: [observerCase], purposeIds: dayArgs.purposeIds, mode: 'optimized', includeAstronomy: false, includeObservances: true });
    const detail = getHorizonDayDetail(ledger, observerCase.id, dayArgs.date); detail.purposes = detail.purposes.filter(p => dayArgs.purposeIds.includes(p.id));
    assert.deepEqual(actual.detail, detail); assert.deepEqual(actual.hourly, getHorizonHourlyDetail(ledger, observerCase.id, dayArgs.date));
    assert.equal(actual.hourly.actualDayHours, 24); assert.deepEqual(actual.detail.purposes.map(p => p.id), dayArgs.purposeIds);
    assert.ok(new TextEncoder().encode(JSON.stringify(actual)).length < HORIZON_MCP_LIMITS.outputBytes);
  });
  await test('DST fold rejection and explicit choice preserve missingness rather than inventing a time', async () => {
    const c = { ...observerCase, id: 'new-york', lat: 40.7128, lon: -74.006, timeZone: 'America/New_York', sampleTime: '01:30' };
    const missing = await day({ ...dayArgs, date: '2026-11-01', observerCase: c });
    assert.equal(missing.detail.row.status, 'unavailable'); assert.equal(missing.detail.row.sampleUTC, null);
    assert.ok(missing.detail.row.purposeResults.every(p => !p.rankable && p.score === null));
    const early = await day({ ...dayArgs, date: '2026-11-01', observerCase: { ...c, disambiguation: 'earlier' } }), late = await day({ ...dayArgs, date: '2026-11-01', observerCase: { ...c, disambiguation: 'later' } });
    assert.equal(Date.parse(late.detail.row.sampleUTC) - Date.parse(early.detail.row.sampleUTC), 3600000);
  });
  await test('Known opening-yoga missingness survives the public adapter', async () => {
    const r = await day({ ...dayArgs, date: '2026-11-06', purposeIds: ['jyotisha-classification-study'] });
    assert.equal(r.detail.purposes[0].score, null); assert.equal(r.detail.purposes[0].observed, 3); assert.equal(r.detail.purposes[0].scoreDenominator, 6);
  });
  await test('Twenty-five-hour detail fits the bound and explicit astronomy adds actual solver events', async () => {
    const ny = { id: 'new-york', lat: 40.7128, lon: -74.006, timeZone: 'America/New_York', sampleTime: '12:00' };
    const full = await day({ date: '2026-11-01', observerCase: ny, purposeIds, includeHourly: true });
    assert.equal(full.hourly.actualDayHours, 25); assert.equal(full.hourly.rows.length, 25);
    assert.ok(new TextEncoder().encode(JSON.stringify(full)).length < HORIZON_MCP_LIMITS.outputBytes);
    const eclipse = await day({ ...dayArgs, date: '2026-08-12', includeAstronomy: true });
    assert.ok(eclipse.detail.events.astronomy.some(event => event.kind === 'solar-eclipse' && event.startUTC.startsWith('2026-08-12')));
    assert.ok(eclipse.counts.eventCount > 0); assert.equal(eclipse.request.includeAstronomy, true);
  });
  await test('Exactly 31 dates and two cases complete without a hidden top-result cap', async () => {
    const r = await scan({ ...scanArgs, startDate: '2026-10-01', endDate: '2026-10-31', cases: [observerCase, { ...observerCase, id: 'delhi', lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata' }], includeObservances: false });
    assert.equal(r.counts.processedSamples, 62); assert.equal(r.counts.profileResults, 248); assert.equal(r.counts.calendarRows, 806); assert.equal(r.counts.truncated, false);
    assert.ok(r.cases.every(c => c.rows.length === 31));
  });
  await test('Thirty-two dates, excess cases and unsupported horizon endpoints are rejected', async () => {
    for (const args of [{ ...scanArgs, startDate: '2026-10-01', endDate: '2026-11-01' }, { ...scanArgs, cases: [observerCase, { ...observerCase, id: 'b' }, { ...observerCase, id: 'c' }] }, { ...scanArgs, endDate: '2031-01-02' }, { ...scanArgs, startDate: '2025-12-31' }, { ...scanArgs, startDate: '2026-02-30' }]) await assert.rejects(async () => scan(args));
  });
  await test('Schemas reject private/imported context, unknown keys, coercion and absent clocks', async () => {
    for (const args of [{ ...scanArgs, birth: {} }, { ...scanArgs, ledger: {} }, { ...scanArgs, question: 'private' }, { ...scanArgs, includeAstronomy: 'false' }, { ...scanArgs, cases: [{ ...observerCase, birth: {} }] }, { ...scanArgs, cases: [{ ...observerCase, lat: NaN }] }, { ...scanArgs, cases: [{ ...observerCase, lat: '51.5' }] }, { ...scanArgs, cases: [{ ...observerCase, timeZone: 'Unknown/Zone' }] }, { ...scanArgs, cases: [{ ...observerCase, lat: 90 }] }, { ...scanArgs, cases: [{ id: 'london', lat: 51.5, lon: 0, timeZone: 'Europe/London' }] }]) await assert.rejects(async () => scan(args));
    await assert.rejects(async () => day({ ...dayArgs, includeHourly: 'yes' }));
    await assert.rejects(async () => day({ ...dayArgs, comparison: {} }));
  });
  await test('Sparse or duplicate selections cannot change the effective sampling contract', async () => {
    const sparse = new Array(2); sparse[0] = observerCase;
    for (const args of [{ ...scanArgs, cases: sparse }, { ...scanArgs, cases: [observerCase, observerCase] }, { ...scanArgs, purposeIds: [purposeIds[0], purposeIds[0]] }, { ...scanArgs, purposeIds: [] }, { ...scanArgs, purposeIds: ['universal-luck'] }]) await assert.rejects(async () => scan(args));
  });
  await test('No provider, network, saved context or implicit current moment is required', async () => {
    const original = globalThis.fetch; globalThis.fetch = () => { throw new Error('Unexpected network'); };
    try { const r = await day(dayArgs); assert.equal(r.hourly, null); assert.equal(r.request.includeAstronomy, false); assert.equal(r.mcpDisclosure.storedRecordsRead, false); } finally { globalThis.fetch = original; }
    await assert.rejects(async () => scan({ ...scanArgs, startDate: undefined }));
  });
  await test('Integrated toolkit exposes both allowlisted schemas and awaits their actual envelopes', async () => {
    for (const tool of HORIZON_MCP_TOOLS) assert.deepEqual(TOOLS.find(t => t.name === tool.name).inputSchema, tool.inputSchema);
    const pending = callTool('workbench_horizon_scan', { ...scanArgs, endDate: scanArgs.startDate });
    assert.equal(typeof pending.then, 'function'); const result = await pending;
    assert.equal(result.tool, 'workbench_horizon_scan'); assert.equal(result.data.counts.processedSamples, 1);
    const detail = await callTool('workbench_horizon_day', dayArgs);
    assert.equal(detail.data.kind, 'event-horizon-day'); assert.equal(detail.data.detail.row.date, dayArgs.date);
    assert.throws(() => callTool('workbench_horizon_scan', { ...scanArgs, maxResults: 1 }));
  });
  return { pass: failures.length === 0, passed, failures };
}
if (process.argv[1]?.endsWith('horizon-mcp.mjs')) { const result = await run(); console.log(result); if (!result.pass) process.exitCode = 1; }
