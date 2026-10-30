import assert from 'node:assert/strict';
import worldDataset from '../../assets/data/world-events.json' with { type: 'json' };
import { OBSERVATORY_MCP_TOOLS } from '../../mcp/observatory-adapters.mjs';
import { searchCalendarDates } from '../../assets/js/core/calendar-search.js';
import { createSigilDesign, makeSigilRecipe, reproduceSigilRecipe } from '../../assets/js/core/sigil-design.js';
import { worldEventsWindow, worldEventsFreshness } from '../../assets/js/core/world-events.js';
import { callTool, TOOLS } from '../../mcp/toolkit.mjs';

const run = (name, args) => OBSERVATORY_MCP_TOOLS.find(tool => tool.name === name).calculate(args);
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const rejects = async (name, args, label) => { await assert.rejects(async () => run(name, args), undefined, label); checks++; };
const observer = { lat: 51.5074, lon: -.1278, timeZone: 'Europe/London' };
const moment = { dateISO: '2026-10-30T12:00:00Z', ...observer };
const searchName = 'workbench_calendar_search', sigilName = 'workbench_sigil_design', eventsName = 'workbench_world_events';
const request = { startDate: '2026-10-26', endDate: '2026-11-01', sampleTime: '12:00', observer, weekdays: [1, 5] };
const optimized = await run(searchName, request), brute = await run(searchName, { ...request, mode: 'brute' });
equal(optimized.result.hits, brute.result.hits, 'Both strategies retain identical canonical matching samples.');
equal(optimized.result.hits.map(row => row.date), ['2026-10-26', '2026-10-30'], 'Civil weekday filter resolves actual requested dates.');
const direct = await searchCalendarDates({ ...request, criteria: [{ kind: 'weekday', values: [1, 5] }], maxDays: 31, maxResults: 31 });
equal(optimized.result.hits, direct.hits, 'Adapter preserves canonical sample contents, not just counts.');
equal(optimized.result.request, direct.request, 'Normalized request exposes actual conventions and caps.');
check(optimized.result.sources.length > 0 && optimized.result.limitations.length > 0, 'Search sources and inference limits survive serialization.');
const folded = await run(searchName, { startDate: '2026-11-01', endDate: '2026-11-01', sampleTime: '01:30', observer: { lat: 40.7, lon: -74, timeZone: 'America/New_York' } });
equal(folded.result.counts.unavailableSamples, 1, 'Repeated civil sample remains unavailable, not guessed.');
equal(folded.result.unavailable[0].code, 'AMBIGUOUS_TIME', 'Fold reason remains available to the client.');
const gapped = await run(searchName, { startDate: '2026-03-08', endDate: '2026-03-08', sampleTime: '02:30', observer: { lat: 40.7, lon: -74, timeZone: 'America/New_York' } });
equal(gapped.result.counts.unavailableSamples, 1, 'A nonexistent local sample is not shifted silently.');
const { weekdays, ...unfiltered } = request;
const ranked = await run(searchName, { ...unfiltered, order: 'concurrence', concurrence: { traditionId: 'western-lilly', classification: 'favorable', minimum: 1 }, maxResults: 1 });
const fullRanked = await run(searchName, { ...unfiltered, order: 'concurrence', concurrence: { traditionId: 'western-lilly', classification: 'favorable', minimum: 1 }, maxResults: 31 });
equal(ranked.result.hits, fullRanked.result.hits.slice(0, 1), 'Returned cap retains the full-window best sample.');
equal(ranked.result.counts.processed, 7, 'Ranking scans the declared complete window before capping.');
for (const [patch, label] of [
  [{ endDate: '2026-11-27' }, 'reject remote scan beyond 31 days'],
  [{ startDate: '2026-02-30' }, 'reject invalid civil date'],
  [{ sampleTime: '25:00' }, 'reject invalid sample clock'],
  [{ weekdays: ['1'] }, 'reject numeric string coercion'],
  [{ weekdays: undefined }, 'reject explicit undefined as non-JSON input'],
  [{ lunarFilters: [{ field: 'tithi', values: [0] }] }, 'preserve field-specific lunar range'],
  [{ calendarFilters: [{ calendar: 'chinese', field: 'year', values: ['2026'] }] }, 'reject unsupported Chinese generic year'],
  [{ lunarFilters: [{ field: 'tithi', values: [1] }, { field: 'tithi', values: [2] }] }, 'reject duplicate criterion identity'],
  [{ observer: { ...observer, lat: 90 } }, 'reject unsupported pole for full comparison'],
  [{ observer: { ...observer, timeZone: 'Invented/Zone' } }, 'reject invalid IANA zone'],
  [{ observer: { ...observer, birth: 'secret' } }, 'reject nested private data'],
  [{ maxDays: 73414 }, 'reject caller expansion of remote bound'],
  [{ maxResults: 32 }, 'reject output cap expansion'],
]) await rejects(searchName, { ...request, ...patch }, label);

for (const mode of ['intention', 'planetary', 'mandala']) {
  const args = { mode, seed: 42, text: 'DeliberatePrivateIntention', moment };
  const actual = run(sigilName, args), canonical = createSigilDesign(args);
  equal(actual.svg, canonical.svg, `${mode} uses the canonical drawing engine.`);
  equal(actual.recipe, makeSigilRecipe(canonical), `${mode} retains the canonical default recipe.`);
  equal(reproduceSigilRecipe(actual.recipe), actual.svg, `${mode} SVG is reproducible from exported geometry.`);
  check(!actual.recipe.privateInputs && !actual.studyContext, `${mode} omits original text and observer context by default.`);
  check(!JSON.stringify(actual).includes(args.text), `${mode} does not echo the original private text.`);
  equal(run(sigilName, args).svg, actual.svg, `${mode} is deterministic for explicit arguments.`);
}
const privateDesign = run(sigilName, { mode: 'mandala', seed: 42, moment, includeStudyContext: true });
equal(privateDesign.studyContext.inputs.moment.lat, observer.lat, 'Explicit context export includes the actual supplied observer.');
check(privateDesign.disclosures.studyContextIncluded, 'Context disclosure matches the included output.');
check(run(sigilName, { mode: 'mandala', seed: 43, moment }).svg !== privateDesign.svg, 'Different explicit seed changes geometry.');
for (const [patch, label] of [
  [{ seed: '42' }, 'reject seed coercion'], [{ seed: -1 }, 'reject negative seed'],
  [{ mode: 'mandala', symmetry: 1000 }, 'bound geometry workload'],
  [{ moment: { ...moment, birthContext: {} } }, 'reject private nested record'],
  [{ moment: { ...moment, dateISO: '2026-10-30T12:00:00' } }, 'require explicit instant offset'],
  [{ includeStudyContext: 'yes' }, 'require actual disclosure boolean'],
]) await rejects(sigilName, { mode: 'mandala', seed: 42, moment, ...patch }, label);
await rejects(sigilName, { mode: 'mandala', moment }, 'Require explicit reproducibility seed.');

const agendaArgs = { referenceDate: '2026-10-30', months: 2, assessedAt: '2026-11-30T12:00:00Z' };
const agenda = run(eventsName, agendaArgs);
equal(agenda.window, worldEventsWindow(worldDataset, { referenceDate: agendaArgs.referenceDate, months: 2 }), 'Agenda is the canonical public-date snapshot.');
equal(agenda.freshness, worldEventsFreshness(worldDataset, agendaArgs.assessedAt), 'Freshness uses the explicit assessment clock.');
equal(agenda.freshness.status, 'review-overdue', 'Historical snapshot is not mislabeled live.');
check(agenda.window.occurrences.every(row => row.precision === 'date-only' && row.sources.length), 'Dates retain source records and no invented event clocks.');
check(agenda.window.coverage.some(row => row.status === 'not-reviewed-in-this-pass'), 'Coverage gaps survive transport.');
equal(run(eventsName, { referenceDate: '2026-10-30' }).freshness, null, 'No host-clock freshness estimate is fabricated.');
const originalTitle = agenda.window.occurrences[0].title;
agenda.window.occurrences[0].title = 'mutation sentinel';
equal(run(eventsName, agendaArgs).window.occurrences[0].title, originalTitle, 'Caller mutation cannot poison the source dataset.');
for (const [patch, label] of [
  [{ country: 'invented' }, 'reject unknown country filter'],
  [{ referenceDate: '2100-12-31' }, 'reject window crossing supported year bound'],
  [{ months: 7 }, 'reject unbounded agenda expansion'],
  [{ assessedAt: '2026-11-30T12:00:00' }, 'require explicit freshness UTC timestamp'],
  [{ includeProvisional: 'true' }, 'reject provisional flag coercion'],
  [{ dataset: { events: [] } }, 'reject injected event dataset'],
]) await rejects(eventsName, { ...agendaArgs, ...patch }, label);
for (const name of [searchName, sigilName, eventsName]) check(TOOLS.some(tool => tool.name === name), `${name} is in the real MCP allowlist.`);
const asynchronous = callTool(searchName, request);
check(typeof asynchronous?.then === 'function', 'Canonical asynchronous search retains its asynchronous result boundary.');
const serialized = await asynchronous;
equal(serialized.data.result.hits, optimized.result.hits, 'MCP wrapper awaits actual samples rather than serializing a Promise.');
check(serialized.tool === searchName && serialized.schemaVersion === 1, 'Asynchronous result retains the standard MCP envelope.');
const synchronous = callTool(sigilName, { mode: 'mandala', seed: 42, moment });
check(typeof synchronous?.then !== 'function', 'Existing synchronous tool behavior stays synchronous.');
equal(synchronous.data.svg, privateDesign.svg, 'MCP drawing output retains canonical geometry.');
equal(callTool(eventsName, agendaArgs).data.window.occurrences[0].title, originalTitle, 'Agenda is available through the same real toolkit.');
assert.throws(() => callTool(searchName, { ...request, observer: { ...observer, birth: 'not allowed' } })); checks++;
console.log(`observatory MCP adapters: ${checks} checks passed`);
