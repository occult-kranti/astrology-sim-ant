// Independent expectations, public-boundary attacks and canonical composition checks.
// This verifies software semantics, not historical truth or predictive validity.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { normalizeCalendarTimelineRequest, buildCalendarTimelineGrid, buildCalendarTimelineFrame, exportCalendarTimelineJSON, exportCalendarTimelineCSV } from '../../assets/js/core/calendar-timeline.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { buildSkySnapshot } from '../../assets/js/core/sky-dynamics.js';
import { castChart, houseOf, norm360 } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { TIMELINE_STUDY_TASKS, buildTimelineStudyTasks } from '../../assets/js/core/data/timeline-study-tasks.js';
import { runCalendarTimelineFrame, calendarTimelineFrameInputSchema } from '../../mcp/calendar-timeline-adapters.mjs';
import { TOOLS, callTool } from '../../mcp/toolkit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourcePaths = ['assets/js/core/calendar-timeline.js', 'assets/js/core/calendar-observatory.js', 'assets/js/core/calendar-atlas.js', 'assets/js/core/sky-dynamics.js', 'assets/js/core/time.js', 'assets/js/core/astro.js', 'assets/js/core/vedic.js', 'assets/js/core/horizon-ranking.js', 'assets/js/core/data/timeline-study-tasks.js', 'mcp/calendar-timeline-adapters.mjs', 'mcp/toolkit.mjs', 'scripts/tests/calendar-timeline-independent.mjs'];
const fingerprints = async () => Object.fromEntries(await Promise.all(sourcePaths.map(async p => [p, sha(await readFile(resolve(root, p)))])));
const base = { startDate: '2026-10-30', endDate: '2026-11-01', time: '12:00', timeZone: 'Europe/London', lat: 51.5, lon: -.12, system: 'regiomontanus', disambiguation: 'reject', includeGuidance: false };
const request = (startDate, endDate = startDate, extra = {}) => ({ ...base, startDate, endDate, ...extra });
const calendarIds = ['gregory', 'julian', 'hebrew', 'islamic-civil', 'islamic-umalqura', 'chinese', 'buddhist', 'indian', 'persian', 'coptic', 'ethiopic', 'japanese', 'roc'];
const bodyIds = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
function csv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c; }
    else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  assert.equal(quoted, false); assert.equal(row.length, 0);
  const head = rows.shift();
  return rows.map(row => { assert.equal(row.length, head.length); return Object.fromEntries(head.map((key, i) => [key, row[i]])); });
}
export async function run() {
  const receipt = { schemaVersion: 1, kind: 'independent-calendar-timeline-semantics', startedAt: new Date().toISOString(), runtime: process.versions, sourceBefore: await fingerprints(), checks: [] };
  const test = async (label, fn) => { try { await fn(); receipt.checks.push({ label, pass: true }); } catch (error) { receipt.checks.push({ label, pass: false, message: error.message }); } };
  for (const [start, end, expected] of [
    ['1900-01-01', '1900-01-01', ['1900-01-01']], ['2100-12-31', '2100-12-31', ['2100-12-31']],
    ['2028-02-28', '2028-03-01', ['2028-02-28', '2028-02-29', '2028-03-01']], ['2100-02-28', '2100-03-01', ['2100-02-28', '2100-03-01']],
  ]) await test('Independent inclusive civil dates ' + start + ' to ' + end, () => { const g = buildCalendarTimelineGrid(request(start, end, { timeZone: 'UTC' })); assert.deepEqual(g.slots.map(s => s.localDate), expected); assert.equal(g.counts.total, expected.length); assert.ok(g.slots.every((s, i) => s.index === i && s.selectedDateISO === expected[i] + 'T12:00:00.000Z')); });
  await test('Exactly3660inclusive dates accepted;3661 rejected', () => { const g = buildCalendarTimelineGrid(request('2020-01-01', '2030-01-07', { timeZone: 'UTC' })); assert.equal(g.slots.length, 3660); assert.equal(g.slots.at(-1).localDate, '2030-01-07'); assert.throws(() => buildCalendarTimelineGrid(request('2020-01-01', '2030-01-08'))); });
  const ny = { timeZone: 'America/New_York', lat: 40.7128, lon: -74.006 };
  for (const [day, clock, extra, status, code] of [
    ['2026-03-08', '02:30', ny, 'unavailable', 'NONEXISTENT_TIME'], ['2026-11-01', '01:30', ny, 'ambiguous', 'AMBIGUOUS_TIME'],
    ['2011-12-30', '12:00', { timeZone: 'Pacific/Apia', lat: -13.8333, lon: -171.75 }, 'unavailable', 'NONEXISTENT_DATE'],
    ['1900-01-01', '00:00', { timeZone: 'Pacific/Auckland' }, 'unavailable', 'UTC_RANGE'], ['2100-12-31', '23:59', { timeZone: 'Pacific/Honolulu' }, 'unavailable', 'UTC_RANGE'],
  ]) await test('Unresolved clock is retained without a fabricated chart ' + day + ' ' + clock + ' ' + extra.timeZone, () => { const r = request(day, day, { ...extra, time: clock, includeGuidance: true }), g = buildCalendarTimelineGrid(r), f = buildCalendarTimelineFrame(r, 0); assert.equal(g.slots.length, 1); assert.equal(f.status, status); assert.equal(f.slot.code, code); assert.deepEqual(f.slot, g.slots[0]); for (const key of ['context', 'comparison', 'atlas', 'sky', 'charts', 'guidance']) assert.equal(f[key], null); assert.ok(f.purposes.every(p => !p.rankable && p.score === null)); });
  for (const [disambiguation, expected] of [['earlier', '2026-11-01T05:30:00.000Z'], ['later', '2026-11-01T06:30:00.000Z']]) await test('Independent repeated-clock occurrence ' + disambiguation, () => { const s = buildCalendarTimelineGrid(request('2026-11-01', '2026-11-01', { ...ny, time: '01:30', disambiguation })).slots[0]; assert.equal(s.selectedDateISO, expected); assert.deepEqual(s.candidates.map(c => c.dateISO), ['2026-11-01T05:30:00.000Z', '2026-11-01T06:30:00.000Z']); assert.equal(s.repeatedClock, true); });
  for (const [a, b, hours] of [['2026-03-07', '2026-03-08', 23], ['2026-10-31', '2026-11-01', 25]]) await test('Local noon daily grid has ' + hours + ' elapsed hours', () => { const g = buildCalendarTimelineGrid(request(a, b, ny)); assert.equal((Date.parse(g.slots[1].selectedDateISO) - Date.parse(g.slots[0].selectedDateISO)) / 3600000, hours); assert.equal(g.sampling.fixedElapsedUTCStep, false); });
  for (const system of ['regiomontanus', 'placidus', 'whole', 'equal']) {
    const r = { ...base, system, includeCatalogStars: true }, f = buildCalendarTimelineFrame(r, 1), input = { dateISO: '2026-10-31T12:00:00.000Z', timeZone: base.timeZone, lat: base.lat, lon: base.lon, system }, chart = castChart(new Date(input.dateISO), input.lat, input.lon, system), vedic = castVedic({ ...chart, timeZone: input.timeZone }, { currentDate: new Date(input.dateISO) });
    await test(system + ' comparison and sky equal canonical independent public calls', () => { assert.deepEqual(f.comparison, compareMoment(input)); assert.deepEqual(f.sky, buildSkySnapshot(input, { includeCatalogStars: true })); assert.deepEqual(f.comparison.calendars.map(c => c.id), calendarIds); assert.deepEqual(f.sky.bodies.map(b => b.id), bodyIds); assert.equal(f.sky.catalogStars.length, 20); });
    await test(system + ' all contexts share exactly one selected instant and observer', () => { for (const c of [f.context, f.comparison.context, f.atlas.context, f.sky.context]) { assert.equal(c.dateISO, input.dateISO); assert.equal(c.timeZone, input.timeZone); assert.equal(c.lat, input.lat); assert.equal(c.lon, input.lon); } assert.equal(f.sampleScope.instantISO, input.dateISO); assert.equal(f.sampleScope.wholeDayValidity, false); assert.equal(f.sampleScope.eventOutcomePrediction, false); });
    await test(system + ' all twelve tropical cusps and ten placements use actual canonical geometry', () => { assert.equal(f.charts.tropical.requestedSystem, system); assert.equal(f.charts.tropical.actualSystem, chart.system); assert.deepEqual(f.charts.tropical.cusps, chart.cusps.slice(1)); for (const [i, p] of f.charts.tropical.placements.entries()) { assert.equal(p.longitude, f.sky.bodies[i].longitude); assert.equal(p.house, houseOf(p.longitude, chart.cusps)); } });
    await test(system + ' full nine-graha Vedic chart and twelve cusps retain one sidereal offset', () => { assert.deepEqual(f.charts.vedic.planets.map(p => p.id), Object.keys(vedic.grahas)); for (const p of f.charts.vedic.planets) { assert.equal(p.longitude, vedic.grahas[p.id].lon); assert.equal(p.house, vedic.grahas[p.id].house); } assert.deepEqual(f.charts.vedic.cusps, Array.from({ length: 12 }, (_, i) => norm360(vedic.lagna.rashiIndex * 30 + i * 30))); });
    await test(system + ' strict adapter returns complete selected canonical frame', () => { const response = runCalendarTimelineFrame({ ...r, index: 1 }), { mcpDisclosure, adapterLimits, ...actual } = response; assert.deepEqual(actual, JSON.parse(JSON.stringify(f))); assert.equal(mcpDisclosure.storedRecordsRead, false); assert.equal(mcpDisclosure.modelUsed, false); assert.equal(adapterLimits.framesPerCall, 1); });
  }
  await test('Observer edit preserves geocentric longitudes but changes houses and topocentric horizon', () => { const a = buildCalendarTimelineFrame(base, 0), b = buildCalendarTimelineFrame({ ...base, lat: -33.86, lon: 151.21 }, 0); assert.deepEqual(a.sky.bodies.map(x => x.longitude), b.sky.bodies.map(x => x.longitude)); assert.notDeepEqual(a.charts.tropical.cusps, b.charts.tropical.cusps); assert.notDeepEqual(a.sky.bodies.map(x => x.horizon), b.sky.bodies.map(x => x.horizon)); });
  await test('Core JSON export recomputes complete frame', () => assert.deepEqual(JSON.parse(exportCalendarTimelineJSON(base, 1)), buildCalendarTimelineFrame(base, 1)));
  await test('Independent CSV parsing retains all calendar/body/cusp/graha/source values at full precision', () => { const f = buildCalendarTimelineFrame(base, 1), rows = csv(exportCalendarTimelineCSV(base, 1)); assert.ok(rows.every(r => r.instantUTC === f.slot.selectedDateISO && r.localDate === f.slot.localDate && r.localTime === f.slot.localTime)); for (const [type, expected] of [['civil-calendar', 13], ['sky-body', 10], ['tropical-house', 12], ['vedic-graha', 9]]) assert.equal(rows.filter(r => r.recordType === type).length, expected); for (const p of f.sky.bodies) { const r = rows.find(r => r.recordType === 'sky-body' && r.id === p.id); assert.equal(r.longitude, String(p.longitude)); assert.equal(r.latitude, String(p.latitude)); } for (const [i, value] of f.charts.tropical.cusps.entries()) assert.equal(rows.find(r => r.recordType === 'tropical-house' && r.id === String(i + 1)).longitude, String(value)); for (const s of f.sources) assert.deepEqual(JSON.parse(rows.find(r => r.recordType === 'source' && r.id === s.id).value), s); });
  await test('Exactly five peaceful task cards with dedicated missing methods explicit', () => { assert.deepEqual(TIMELINE_STUDY_TASKS.map(x => x.id), ['begin', 'finish', 'study', 'dialogue', 'ceremony']); const tasks = buildTimelineStudyTasks([], { includeGuidance: false }); assert.ok(tasks.slice(0, 3).every(x => x.status === 'unavailable' && x.score === null)); assert.ok(tasks.slice(3).every(x => x.status === 'unimplemented' && x.profileId === null && x.result === null && x.score === null)); });
  for (const includeGuidance of [true, false]) await test('Frame study tasks and source closure with guidance ' + includeGuidance, () => {
    const f = buildCalendarTimelineFrame({ ...base, includeGuidance }, 0), ids = new Set(f.sources.map(s => s.id));
    assert.equal(ids.size, f.sources.length); assert.deepEqual(f.studyTasks, buildTimelineStudyTasks(f.purposes, { includeGuidance }));
    const walk = x => { if (!x || typeof x !== 'object') return; for (const [key, value] of Object.entries(x)) { if (key === 'sourceIds') { assert.ok(Array.isArray(value)); for (const id of value) assert.ok(ids.has(id), 'Unresolved source ' + id); } walk(value); } }; walk(f);
    for (const t of f.studyTasks.slice(3)) assert.ok(t.status === 'unimplemented' && t.result === null && t.score === null);
    if (includeGuidance) { const [begin, finish, study] = f.studyTasks; assert.equal(begin.profileId, 'western-increase-study'); assert.equal(finish.profileId, 'western-decrease-study'); assert.equal(study.profileId, 'mercury-hour-study'); assert.equal(begin.result.scoreDenominator, 10); assert.equal(finish.result.scoreDenominator, 10); assert.equal(study.result.scoreDenominator, 1); for (const p of f.purposes) assert.ok(p.dependencyGroups.every(g => g.independentEvidence === false)); }
  });
  const validAdapter = { ...base, index: 0 };
  const attacks = [null, [], {}, { ...base, startDate: '1899-12-31' }, { ...base, endDate: '2101-01-01' }, { ...base, startDate: '2027-02-29' }, { ...base, endDate: '2026-10-29' }, { ...base, time: '24:00' }, { ...base, time: null }, { ...base, lat: '51.5' }, { ...base, lat: 90 }, { ...base, lon: Infinity }, { ...base, timeZone: 'No/Such_Zone' }, { ...base, system: 'koch' }, { ...base, includeGuidance: 'true' }, { ...base, includeCatalogStars: null }, { ...base, objective: 'military operation' }, { ...base, startDate: '2030-01-01', endDate: '2030-01-03', militaryObjective: 'operation timing' }, { ...base, submittedChart: {} }, { ...base, privateNotes: 'PRIVATE' }, { ...base, [Symbol('objective')]: 'operation' }, Object.create(base)];
  const hidden = { ...base }; Object.defineProperty(hidden, 'includeGuidance', { value: false, enumerable: false }); attacks.push(hidden);
  let getterCalls = 0; const accessor = { ...base }; Object.defineProperty(accessor, 'lat', { get() { getterCalls++; return 51.5; }, enumerable: true }); attacks.push(accessor);
  for (const [i, args] of attacks.entries()) {
    await test('Core rejects malformed or undeclared request ' + i, () => assert.throws(() => normalizeCalendarTimelineRequest(args)));
    await test('Adapter rejects malformed or undeclared request ' + i, () => { const target = args && typeof args === 'object' && !Array.isArray(args) ? Object.defineProperties(Object.create(Object.getPrototypeOf(args)), { ...Object.getOwnPropertyDescriptors(args), index: { value: 0, enumerable: true, configurable: true } }) : args; assert.throws(() => runCalendarTimelineFrame(target)); });
  }
  await test('Accessor rejection occurs before invoking caller code', () => assert.equal(getterCalls, 0));
  for (const index of [-1, 3, 1.2, '1', null, undefined, NaN, Infinity]) for (const [label, fn] of [['core', () => buildCalendarTimelineFrame(base, index)], ['adapter', () => runCalendarTimelineFrame({ ...validAdapter, index })]]) await test(label + ' rejects invalid selected index ' + String(index), () => assert.throws(fn));
  await test('Ordinary null-prototype request remains supported', () => assert.deepEqual(normalizeCalendarTimelineRequest(Object.assign(Object.create(null), base)), normalizeCalendarTimelineRequest(base)));
  await test('MCP schema declares integer index and rejects unknown properties', () => { assert.equal(calendarTimelineFrameInputSchema.additionalProperties, false); assert.equal(calendarTimelineFrameInputSchema.properties.index.type, 'integer'); assert.ok(calendarTimelineFrameInputSchema.required.includes('disambiguation')); });
  await test('Toolkit registers exactly one selected-frame tool and returns canonical adapter output', () => { assert.equal(TOOLS.filter(t => t.name === 'workbench_calendar_timeline_frame').length, 1); assert.deepEqual(callTool('workbench_calendar_timeline_frame', validAdapter).data, runCalendarTimelineFrame(validAdapter)); });
  receipt.sourceAfter = await fingerprints();
  await test('Scientific sources and independent driver remained unchanged', () => assert.deepEqual(receipt.sourceAfter, receipt.sourceBefore));
  receipt.completedAt = new Date().toISOString(); receipt.count = receipt.checks.length; receipt.failures = receipt.checks.filter(c => !c.pass).map(c => c.label + ': ' + c.message); receipt.pass = receipt.failures.length === 0;
  receipt.acceptanceEligible = receipt.pass && process.env.TIMELINE_ALLOW_EDITS !== '1';
  if (process.env.TIMELINE_SEMANTIC_RECEIPT) { const path = resolve(process.env.TIMELINE_SEMANTIC_RECEIPT); await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(receipt, null, 2) + '\n'); }
  return receipt;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) { const result = await run(); console.log(JSON.stringify({ pass: result.pass, count: result.count, failures: result.failures }, null, 2)); if (!result.pass) process.exitCode = 1; }
