// Actual official-SDK HTTP and child-process stdio. These public synthetic
// requests do not use a model, saved browser profile, account or live network.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { TIMELINE_SEARCH_MCP_TOOLS, TIMELINE_SEARCH_MCP_LIMITS, runTimelineSearch, runTimelineSearchDate } from '../mcp/timeline-search-adapters.mjs';
import { buildTimelineSearch } from '../assets/js/core/timeline-search.js';

const sourceFiles = ['scripts/test-timeline-search-protocol.mjs', 'mcp/timeline-search-adapters.mjs', 'mcp/toolkit.mjs',
  'assets/js/core/timeline-search.js', 'assets/js/core/timeline-statistics.js', 'assets/js/core/calendar-search.js',
  'assets/js/core/astrocartography.js', 'assets/js/core/cultural-calendars.js'];
const sourceManifest = () => Object.fromEntries(sourceFiles.map(path => [path, createHash('sha256').update(readFileSync(new URL('../' + path, import.meta.url))).digest('hex')]));
const before = sourceManifest();

const timeline = { startDate: '2026-11-05', endDate: '2026-11-24', time: '12:00', timeZone: 'UTC', lat: 51.5, lon: 0, system: 'regiomontanus', disambiguation: 'reject' };
const plainRequest = { timeline, map: { mode: 'none' } };
const mappedRequest = { timeline: { ...timeline, endDate: '2026-11-12' }, lunarFilters: [{ field: 'tithi', values: [1, 15, 30] }], map: { mode: 'transit', bodyIds: ['Sun', 'Moon'], angleIds: ['ASC', 'DSC'], maxDistanceKm: 500, minimumLines: 1 } };
const fixedRequest = { ...mappedRequest, timeline: { ...timeline, endDate: '2026-11-07' }, map: { mode: 'fixed', fixedInstantISO: '2024-03-20T03:06:00Z' } };
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'timeline-search-protocol-review', version: '1.0.0' } } };
let checks = 0;
const ok = (condition, label) => { assert.ok(condition, label); checks++; };
const eq = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const rejects = async (fn, label) => { await assert.rejects(async () => fn(), undefined, label); checks++; };

// The adapter's own boundary rejects JavaScript accessors/iterators without
// invoking them. JSON wire clients cannot send those JavaScript constructs.
let sideEffects = 0;
const accessorTimeline = { ...timeline }; Object.defineProperty(accessorTimeline, 'lat', { get() { sideEffects++; return 0; }, enumerable: true });
const hiddenTimeline = { ...timeline }; Object.defineProperty(hiddenTimeline, 'lat', { value: 0, enumerable: false });
const accessorArray = ['Sun']; Object.defineProperty(accessorArray, '0', { get() { sideEffects++; return 'Sun'; }, enumerable: true });
const iteratorArray = ['Sun']; iteratorArray[Symbol.iterator] = function* () { sideEffects++; yield 'Sun'; };
for (const request of [
  { ...plainRequest, timeline: accessorTimeline }, { ...plainRequest, timeline: hiddenTimeline },
  ...[accessorArray, iteratorArray, Array(1), Object.assign(['Sun'], { extra: true })].map(bodyIds => ({ ...plainRequest, map: { mode: 'transit', bodyIds } })),
]) await rejects(() => runTimelineSearch({ request }), 'Non-JSON direct adapter value rejected');
eq(sideEffects, 0, 'Rejected getters and iterators never execute');
for (const value of [NaN, Infinity, -Infinity]) await rejects(() => runTimelineSearch({ request: { ...plainRequest, timeline: { ...timeline, lat: value } } }), 'Nonfinite direct numeric input rejected');

const full = await runTimelineSearch({ request: plainRequest });
eq(full.counts.total, 20, 'Summary denominator covers the full window');
eq(full.counts.processed, 20, 'All requested dates calculated');
eq(full.selectedMatches.length, 12, 'Declared match display cap');
eq(full.scope.omittedMatchedDates, 8, 'Undisplayed matches explicitly counted');
eq(full.selectedMatches.map(row => row.index), Array.from({ length: 12 }, (_, i) => i), 'Map-disabled display is chronological');
ok(!Object.hasOwn(full, 'rows') && !Object.hasOwn(full, 'series'), 'Full row/raw-series omissions are explicit');
eq(full.missingness.calendarAvailability.length, 13, 'Every selected civil calendar has an availability denominator');
ok(full.missingness.calendarAvailability.every(row => row.totalDates === 20 && Object.values(row.statusCounts).reduce((a, b) => a + b, 0) === 20), 'Calendar missingness totals cover every date');
const canonical = await buildTimelineSearch(full.request);
eq(full.statistics, JSON.parse(JSON.stringify(canonical.statistics)), 'No statistics or full-family denominator lost in JSON projection');
eq(full.counts, canonical.counts, 'Canonical calculation counts preserved');

const maxRequest = { timeline: { ...timeline, startDate: '2024-01-01', endDate: '2024-12-31' }, weekdays: [1, 2, 3, 4, 5],
  lunarFilters: [{ field: 'tithi', values: [1, 15, 30] }, { field: 'phaseIndex', values: [0, 2, 4, 6] }, { field: 'karana', values: [1, 2, 59, 60] }, { field: 'nakshatra', values: [1, 5, 10, 15, 20, 25] }, { field: 'yoga', values: [1, 5, 10, 15, 20, 25] }],
  calendarFilters: [{ calendar: 'gregory', field: 'day', values: ['1', '15'] }, { calendar: 'hebrew', field: 'day', values: ['1', '15'] }], map: { mode: 'transit' } };
const maximal = await runTimelineSearch({ request: maxRequest });
eq(maximal.counts.total, 366, 'Inclusive leap-year MCP maximum is supported');
eq(maximal.statistics.series.length, 10, 'Eight criteria plus two map aggregates retained');
eq(maximal.statistics.family.plannedPairs, 45, 'All forty-five declared pairs remain in correction family');
eq(maximal.statistics.pairs.length, 45, 'All pair records, including unavailable pairs, retained');
ok(Buffer.byteLength(JSON.stringify(maximal)) <= TIMELINE_SEARCH_MCP_LIMITS.outputBytes, 'Maximal ordinary request fits the declared output bound');

// Verbose alternative values must fail the canonical request-memory bound;
// they cannot expand into repeated per-date data. These are public test strings.
const largeTimeline = { ...timeline, startDate: '2024-01-20', endDate: '2024-01-31' };
const publicFields = runTimelineSearchDate({ request: { timeline: largeTimeline, map: { mode: 'none' } }, index: 0 }).row.calendars;
const oversizedRequest = { timeline: largeTimeline, map: { mode: 'none' }, calendarFilters:
  [['gregory', 'year'], ['julian', 'year'], ['buddhist', 'year'], ['buddhist', 'era'], ['roc', 'year'], ['roc', 'era'], ['japanese', 'year'], ['japanese', 'era']].map(([calendar, field]) => ({ calendar, field,
    values: [publicFields.find(row => row.id === calendar).parts.find(part => part.type === field).value, ...Array.from({ length: 59 }, (_, i) => String(i).padStart(3, '0') + 'x'.repeat(117))] })) };
ok(Buffer.byteLength(JSON.stringify({ request: oversizedRequest })) < 65536, 'Oversized-result fixture itself fits the HTTP request bound');
await assert.rejects(() => runTimelineSearch({ request: oversizedRequest }), /16 KiB/, 'Oversized definitions fail the canonical memory bound'); checks++;
const ascending = n => Array.from({ length: n }, (_, i) => i + 1);
const verboseDays = n => [...ascending(n).map(String), ...Array.from({ length: 60 - n }, (_, i) => String(i).padStart(3, '0') + 'x'.repeat(117))];
// This valid request stays below the canonical input cap but its complete
// statistical projection is deliberately too large. No result is truncated.
const oversizedOutputRequest = { ...maxRequest, weekdays: [1, 2, 3, 4, 5, 6],
  lunarFilters: [{ field: 'tithi', values: ascending(29) }, { field: 'phaseIndex', values: [0, 1, 2, 3, 4, 5, 6] }, { field: 'karana', values: ascending(59) }, { field: 'nakshatra', values: ascending(26) }, { field: 'yoga', values: ascending(26) }],
  calendarFilters: [{ calendar: 'gregory', field: 'day', values: verboseDays(30) }, { calendar: 'hebrew', field: 'day', values: verboseDays(29) }],
  map: { mode: 'transit', maxDistanceKm: 3000 } };
await assert.rejects(() => runTimelineSearch({ request: oversizedOutputRequest }), /128 KiB/, 'Oversized output fails with its declared bound'); checks++;

const priorFetch = globalThis.fetch; let outboundCalls = 0;
globalThis.fetch = async () => { outboundCalls++; throw new Error('Unexpected outbound request'); };
try {
  await runTimelineSearch({ request: { ...mappedRequest, timeline: { ...timeline, endDate: timeline.startDate } } });
  runTimelineSearchDate({ request: mappedRequest, index: 0 });
} finally { globalThis.fetch = priorFetch; }
eq(outboundCalls, 0, 'Canonical scan and date adapters issue no fetch requests');

async function exercise(rpc) {
  eq((await rpc(init)).result.serverInfo.name, 'astrologers-workbench', 'Official SDK server initialized');
  const listed = (await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })).result.tools;
  for (const tool of TIMELINE_SEARCH_MCP_TOOLS) {
    const row = listed.find(row => row.name === tool.name);
    ok(row, `${tool.name} registered`); eq(row.inputSchema, tool.inputSchema, 'Advertised schema matches source');
    eq(row.annotations.readOnlyHint, true, 'Read-only annotation'); eq(row.annotations.openWorldHint, false, 'No open-world side effects');
  }
  let id = 3;
  const good = [
    ['workbench_timeline_search', { request: plainRequest }],
    ['workbench_timeline_search', { request: mappedRequest }],
    ['workbench_timeline_search', { request: fixedRequest }],
    ['workbench_timeline_search', { request: { ...plainRequest, timeline: { ...timeline, startDate: '2026-03-07', endDate: '2026-03-09', time: '02:30', timeZone: 'America/New_York' } } }],
    ['workbench_timeline_search', { request: { ...plainRequest, timeline: { ...timeline, startDate: '2026-10-31', endDate: '2026-11-02', time: '01:30', timeZone: 'America/New_York' } } }],
    ['workbench_timeline_search_date', { request: mappedRequest, index: 3 }],
    ['workbench_timeline_search_date', { request: fixedRequest, index: 2 }],
    ['workbench_timeline_search_date', { request: { ...plainRequest, timeline: { ...timeline, startDate: '2011-12-29', endDate: '2011-12-31', timeZone: 'Pacific/Apia' } }, index: 1 }],
    ['workbench_timeline_search_date', { request: { ...plainRequest, timeline: { ...timeline, startDate: '2026-11-01', endDate: '2026-11-01', time: '01:30', timeZone: 'America/New_York', disambiguation: 'later' } }, index: 0 }],
    ['workbench_timeline_search_date', { request: { ...plainRequest, timeline: { ...timeline, startDate: '2020-01-01', endDate: '2029-12-31' } }, index: 3652 }],
  ];
  for (const [name, args] of good) {
    const response = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
    ok(!response.error && !response.result?.isError, `${name} succeeds: ${JSON.stringify(response.error || response.result?.content)}`);
    const envelope = response.result.structuredContent, data = envelope.data;
    eq(envelope.tool, name, 'Tool identity retained');
    eq(JSON.parse(response.result.content.find(row => row.type === 'text').text), envelope, 'Text and structured payloads match');
    const expected = await TIMELINE_SEARCH_MCP_TOOLS.find(tool => tool.name === name).calculate(args);
    eq(data, expected, 'Transport preserves the deterministic canonical adapter result');
    ok(Buffer.byteLength(JSON.stringify(data)) <= TIMELINE_SEARCH_MCP_LIMITS.outputBytes, 'Response within128KiB');
    eq(data.mcpDisclosure.readOnly, true, 'Read-only data disclosure');
    for (const field of ['networkUsed', 'modelUsed', 'privateRecordsRead', 'browserActionExecuted', 'browserBookmarksRead']) eq(data.mcpDisclosure[field], false, `${field} remains false`);
    ok(data.sources.length > 0 && data.limitations.length > 0, 'Sources and calculation limits retained');
    eq(data.request.timeline.disambiguation, args.request.timeline.disambiguation, 'Explicit clock ambiguity policy retained');
    if (name === 'workbench_timeline_search') {
      eq(data.scope.allDatesCalculated, true, 'Complete requested scan disclosed');
      eq(data.counts.total, data.missingness.totalDates, 'Denominators agree');
      eq(data.statistics.method.outcomeProbabilityAvailable, false, 'No outcome probability supplied');
      if (args.request.timeline.timeZone === 'America/New_York') {
        eq(data.missingness.incompleteDates.length, 1, 'Gap/fold date remains in missingness');
        ok(data.statistics.grid.status !== 'eligible', 'Incomplete grid cannot claim phase-reference eligibility');
      }
    } else {
      eq(data.scope.fullDateRangeScanned, false, 'Selected-date tool does not claim a full scan');
      eq(data.scope.scanStatisticsIncluded, false, 'One date has no inherited rarity or correlation');
      eq(data.stats.processed, 1, 'Only one selected clock calculated');
      eq(data.row.index, args.index, 'Original range index preserved');
      if (args.request.map?.mode !== 'none' && data.row.map?.available) eq(data.row.map.distances.length, 40, 'All forty distances retained regardless matching filters');
      if (args.request.timeline.timeZone === 'Pacific/Apia') { eq(data.row.slot.code, 'NONEXISTENT_DATE', 'Skipped civil date retained'); eq(data.row.sampleUTC, null, 'Skipped date does not acquire a substitute instant'); }
      if (args.request.timeline.disambiguation === 'later') eq(data.row.sampleUTC, '2026-11-01T06:30:00.000Z', 'Later repeated clock resolves correctly');
    }
  }
  const noTime = { ...timeline }; delete noTime.time;
  const noFoldPolicy = { ...timeline }; delete noFoldPolicy.disambiguation;
  const invalid = [
    ['workbench_timeline_search', {}],
    ['workbench_timeline_search', { request: plainRequest, url: 'https://example.invalid' }],
    ['workbench_timeline_search', { request: { ...plainRequest, criteria: [] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, privateProfile: {} } }],
    ...[
      noTime, noFoldPolicy, { ...timeline, startDate: '2024-02-30' }, { ...timeline, startDate: '1899-12-31' },
      { ...timeline, endDate: '2101-01-01' }, { ...timeline, endDate: '2026-11-04' },
      { ...timeline, startDate: '2024-01-01', endDate: '2025-01-01' },
      { ...timeline, timeZone: 'Invalid/Zone' }, { ...timeline, lat: 90 }, { ...timeline, lat: '51.5' },
      { ...timeline, time: '25:00' }, { ...timeline, bodyPositions: { Sun: 0 } },
    ].map(value => ['workbench_timeline_search', { request: { ...plainRequest, timeline: value } }]),
    ['workbench_timeline_search', { request: { ...plainRequest, weekdays: [] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, weekdays: [1, 1] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, weekdays: [7] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, lunarFilters: [{ field: 'tithi', values: ['1'] }] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, lunarFilters: [{ field: 'tithi', values: [0] }] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, lunarFilters: [{ field: 'tithi', values: [1] }, { field: 'tithi', values: [15] }] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, calendarIds: ['julian'], calendarFilters: [{ calendar: 'gregory', field: 'day', values: ['1'] }] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, calendarFilters: [{ calendar: 'chinese', field: 'year', values: ['2026'] }] } }],
    ['workbench_timeline_search', { request: { ...plainRequest, ruleFilters: [{ ruleId: 'invented', classifications: ['favorable'] }] } }],
    ['workbench_timeline_search', { request: { ...maxRequest, ruleFilters: [{ ruleId: 'DG-W-LIGHT', classifications: ['favorable'] }] } }],
    ['workbench_timeline_search', { request: oversizedRequest }],
    ['workbench_timeline_search', { request: oversizedOutputRequest }],
    ...[
      { mode: 'fixed' }, { mode: 'fixed', fixedInstantISO: '2024-01-01T12:00:00' },
      { mode: 'transit', fixedInstantISO: '2024-01-01T12:00:00Z' }, { mode: 'none', maxDistanceKm: 500 },
      { mode: 'transit', bodyIds: ['Earth'] }, { mode: 'transit', bodyIds: [] },
      { mode: 'transit', bodyIds: ['Sun', 'Sun'] }, { mode: 'transit', angleIds: ['ZENITH'] },
      { mode: 'transit', maxDistanceKm: 0 }, { mode: 'transit', maxDistanceKm: 3001 },
      { mode: 'transit', bodyIds: ['Sun'], angleIds: ['MC'], minimumLines: 2 },
      { mode: 'transit', distances: [{ bodyId: 'Sun', distanceKm: 0 }] },
    ].map(map => ['workbench_timeline_search', { request: { ...plainRequest, map } }]),
    ['workbench_timeline_search_date', { request: plainRequest }],
    ['workbench_timeline_search_date', { request: plainRequest, index: -1 }],
    ['workbench_timeline_search_date', { request: plainRequest, index: 20 }],
    ['workbench_timeline_search_date', { request: plainRequest, index: 0, row: { forged: true } }],
  ];
  for (const [name, args] of invalid) {
    const response = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
    ok(Boolean(response.error || response.result?.isError), `Invalid/forged input rejected by ${name}: ${JSON.stringify(args)}`);
  }
}

const handler = createHttpHandler();
try {
  await exercise(async body => {
    const response = await handler.fetch(new Request('http://127.0.0.1:3001/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' }, body: JSON.stringify(body) }));
    eq(response.status, 200, 'MCP HTTP status');
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
child.on('exit', code => { for (const request of pending.values()) request.reject(new Error(`Timeline-search stdio exited ${code}: ${stderr}`)); });
const rpc = body => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Timeline-search stdio timed out')); }, 30000);
  pending.set(body.id, {
    resolve(value) { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); },
    reject(error) { clearTimeout(timer); reject(error); },
  });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(rpc); } finally { child.stdin.end(); child.kill('SIGTERM'); }
eq(sourceManifest(), before, 'Both transports tested unchanged source files');
console.log(JSON.stringify({ status: 'PASS', checks, tools: TIMELINE_SEARCH_MCP_TOOLS.map(tool => tool.name),
  maximalSummaryBytes: Buffer.byteLength(JSON.stringify(maximal)), transports: ['official-SDK HTTP handler', 'spawned child-process stdio'],
  sourceManifest: before, liveModelUsed: false, hostedDeploymentVerified: false }, null, 2));
