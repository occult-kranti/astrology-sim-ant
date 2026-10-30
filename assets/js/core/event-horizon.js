// Complete, explicitly sampled date ledgers. Numerical engines and source
// catalogues own their claims; this module owns the grid and result accounting.
import { compareMoment, OBSERVATORY_SOURCES } from './calendar-observatory.js';
import { buildDayGuidance, buildHourlyGuidance, DAY_GUIDANCE_SOURCES } from './day-guidance.js';
import { civilFields, resolveZonedTime, zonedCivilDay, validLocation } from './time.js';
import { validateZone } from './cultural-calendars.js';
import { HOUSE_SYSTEMS } from './instant-boundary.js';
import { buildHorizonAstronomy } from './horizon-astronomy.js';
import { observancesForDate, HORIZON_OBSERVANCE_SOURCES, HORIZON_OBSERVANCE_COVERAGE } from './horizon-observances.js';
import { HORIZON_PURPOSES, HORIZON_RANKING_SOURCES, evaluateHorizonPurposes } from './horizon-ranking.js';
import { HORIZON_TRADITIONS, HORIZON_TRADITION_SOURCES } from './data/horizon-traditions.js';
import { HORIZON_PRESET_SOURCE_SHA256, HORIZON_PRESET_METADATA_SHA256, HORIZON_PRESET_MANIFEST_SHA256 } from './data/horizon-preset-version.js';

export { HORIZON_PURPOSES, HORIZON_TRADITIONS };
const DAY = 86400000;
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const now = () => typeof performance !== 'undefined' ? performance.now() : Date.now();
export const HORIZON_CALENDAR_IDS = freeze(['gregory', 'julian', 'hebrew', 'islamic-civil', 'islamic-umalqura', 'chinese', 'buddhist', 'indian', 'persian', 'coptic', 'ethiopic', 'japanese', 'roc']);
export const HORIZON_LIMITS = freeze({ minDate: '2026-01-01', maxDate: '2031-01-01', maxDays: 1827, maxCases: 4, maxPartBytes: 32 * 1024 * 1024, maxPresetBytes: 64 * 1024 * 1024 });
export const HORIZON_CASES = freeze([
  { id: 'london', label: 'London · local noon', lat: 51.5074, lon: -0.1278, timeZone: 'Europe/London', sampleTime: '12:00', system: 'regiomontanus', disambiguation: 'reject' },
  { id: 'delhi', label: 'Delhi · local noon', lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata', sampleTime: '12:00', system: 'regiomontanus', disambiguation: 'reject' },
  { id: 'new-york', label: 'New York · local noon', lat: 40.7128, lon: -74.006, timeZone: 'America/New_York', sampleTime: '12:00', system: 'regiomontanus', disambiguation: 'reject' },
]);
export const HORIZON_DEFAULT_REQUEST = freeze({ startDate: '2026-10-30', endDate: '2031-01-01', cases: clone(HORIZON_CASES), purposeIds: HORIZON_PURPOSES.map(p => p.id), mode: 'optimized', includeAstronomy: true, includeObservances: true });
export const HORIZON_LIMITATIONS = freeze([
  'Every requested civil date has a ledger row, including missing or ambiguous clock samples. A daily sampled instant is not a classification of the entire day.',
  'Profiles are separate modern editorial study indices over named inherited rules. Higher and lower profile match are not objective good/bad dates, probabilities or forecasts.',
  'Different observer-local noons are different UTC instants. Valid IANA identifiers do not verify a geographic match between coordinates and time zone.',
  'Calendar labels, religious festivals, astronomical events and eschatological source texts do not contribute favorable/caution votes to the purpose profiles.',
  'Religious observance coverage is selected and variant-specific. Published calendars, regional authority, lunar sighting and sunset boundaries can differ from runtime civil converters.',
  'Shared lunar/solar measurements are dependencies, not independent corroboration. Equal exact profile values remain ties; their chronological display order is not a stronger result.',
  'A preset records its generating runtime and source hashes. Recomputing a selected date in another ICU/time-zone runtime can expose real calendar differences; those differences must remain visible.',
  'No birth, oracle draw, personal question or saved browser record is inferred. Those tools remain explicit, separate workflows.',
]);

function object(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be an object.`); return value; }
function keys(value, allowed, label) { const extra = Object.keys(value).filter(k => !allowed.includes(k)); if (extra.length) throw new RangeError(`${label} has unsupported fields: ${extra.join(', ')}.`); }
function dense(value, min, max, label) { if (!Array.isArray(value) || value.length < min || value.length > max || Array.from({ length: value.length }, (_, i) => i).some(i => !(i in value))) throw new RangeError(`${label} must contain ${min}–${max} explicit entries.`); return value; }
function text(value, label, max = 100) { if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new TypeError(`Supply a bounded ${label}.`); return value.trim(); }
function dateOnly(value) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('Use YYYY-MM-DD.'); civilFields(value); if (value < HORIZON_LIMITS.minDate || value > HORIZON_LIMITS.maxDate) throw new RangeError(`Horizon dates must be within ${HORIZON_LIMITS.minDate}–${HORIZON_LIMITS.maxDate}.`); return value; }
function bool(value, fallback, label) { if (value === undefined) return fallback; if (typeof value !== 'boolean') throw new TypeError(`${label} must be boolean.`); return value; }
export function horizonDates(startDate, endDate) { dateOnly(startDate); dateOnly(endDate); if (endDate < startDate) throw new RangeError('End date must not precede start date.'); const start = Date.parse(startDate + 'T12:00:00Z'), end = Date.parse(endDate + 'T12:00:00Z'), count = Math.round((end - start) / DAY) + 1; if (count > HORIZON_LIMITS.maxDays) throw new RangeError('Horizon exceeds the supported day count.'); return Array.from({ length: count }, (_, i) => new Date(start + i * DAY).toISOString().slice(0, 10)); }
function normalizeCase(raw) {
  const c = object(raw, 'Case'); keys(c, ['id', 'label', 'lat', 'lon', 'timeZone', 'sampleTime', 'system', 'disambiguation'], 'Case');
  const id = text(c.id, 'case id', 40); if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new RangeError('Case ids use lowercase letters, digits and hyphens.');
  validLocation(c.lat, c.lon); if (Math.abs(c.lat) === 90) throw new RangeError('Full moment charts require an observer strictly between the geographic poles.');
  const sampleTime = c.sampleTime ?? '12:00'; if (typeof sampleTime !== 'string' || !/^\d{2}:\d{2}(?::\d{2})?$/.test(sampleTime)) throw new RangeError('Use an explicit HH:mm or HH:mm:ss local sample clock.'); civilFields('2026-01-01', sampleTime);
  const system = c.system ?? 'regiomontanus', disambiguation = c.disambiguation ?? 'reject'; if (!HOUSE_SYSTEMS.includes(system) || !['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose a supported house method and fold policy.');
  return { id, label: text(c.label ?? id, 'case label', 100), lat: c.lat, lon: c.lon, timeZone: validateZone(c.timeZone), sampleTime, system, disambiguation };
}
export function normalizeHorizonRequest(raw) {
  const r = object(raw, 'Horizon request'); keys(r, ['startDate', 'endDate', 'cases', 'purposeIds', 'mode', 'includeAstronomy', 'includeObservances'], 'Horizon request');
  const startDate = dateOnly(r.startDate), endDate = dateOnly(r.endDate); horizonDates(startDate, endDate);
  const cases = dense(r.cases, 1, HORIZON_LIMITS.maxCases, 'Cases').map(normalizeCase); if (new Set(cases.map(c => c.id)).size !== cases.length) throw new RangeError('Case ids must be unique.');
  const purposeIds = dense(r.purposeIds ?? HORIZON_PURPOSES.map(p => p.id), 1, HORIZON_PURPOSES.length, 'Purpose profiles').map(id => { if (!HORIZON_PURPOSES.some(p => p.id === id)) throw new RangeError('Unknown purpose profile.'); return id; }); if (new Set(purposeIds).size !== purposeIds.length) throw new RangeError('Purpose profiles must be unique.');
  const mode = r.mode ?? 'optimized'; if (!['brute', 'optimized'].includes(mode)) throw new RangeError('Choose brute or optimized calculation.');
  return { startDate, endDate, cases, purposeIds, mode, includeAstronomy: bool(r.includeAstronomy, true, 'includeAstronomy'), includeObservances: bool(r.includeObservances, true, 'includeObservances') };
}
function cancelled(hooks) { if (hooks.shouldCancel?.() || hooks.isCancelled?.() || hooks.signal?.aborted) { const error = new Error('Horizon calculation cancelled.'); error.name = 'AbortError'; error.code = 'CANCELLED'; throw error; } }
async function pause(hooks) { cancelled(hooks); await (hooks.yieldControl ? hooks.yieldControl() : new Promise(resolve => setTimeout(resolve, 0))); cancelled(hooks); }
function sourcesById(sources) { const map = new Map(); for (const s of sources) if (s?.id && !map.has(s.id)) map.set(s.id, clone(s)); return [...map.values()]; }
function runtime() { return typeof process !== 'undefined' && process.versions ? { environment: 'node', node: process.versions.node, v8: process.versions.v8, icu: process.versions.icu, cldr: process.versions.cldr, tz: process.versions.tz } : { environment: 'browser', userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null, calendarEngine: 'This browser’s Intl/ICU and time-zone data' }; }
function compactPurpose(p) { return { id: p.id, score: p.score, scoreNumerator: p.scoreNumerator, scoreDenominator: p.scoreDenominator, rankable: p.rankable, observed: p.observed, total: p.total, missing: clone(p.missing ?? []), dependencyGroups: clone(p.dependencyGroups ?? []) }; }
function caseInput(c, at) { return { dateISO: at.toISOString(), lat: c.lat, lon: c.lon, timeZone: c.timeZone, system: c.system }; }
function compute(c, resolved, stats) { stats.canonicalCalls++; const comparison = compareMoment(caseInput(c, resolved.instant)); stats.guidanceCalls++; const guidance = buildDayGuidance(comparison); stats.purposeBatchEvaluations++; return { comparison, guidance, purposes: evaluateHorizonPurposes({ comparison, guidance }) }; }
function missingPurposes(ids) { return evaluateHorizonPurposes({ comparison: null, guidance: null }).filter(p => ids.includes(p.id)).map(compactPurpose); }
function compactCalendar(row) { return { id: row.id, text: row.text ?? '', status: row.status, validation: row.validation ?? null, boundary: row.boundary ?? 'civil-midnight' }; }
function sampleRow(date, c, request, stats, hooks) {
  let resolved;
  try { resolved = resolveZonedTime(date, c.sampleTime, c.timeZone, { disambiguation: c.disambiguation }); }
  catch (error) {
    return { row: { date, caseId: c.id, status: 'unavailable', sampleUTC: null, offsetSeconds: null, reason: error.message, reasonCode: error.code ?? 'CLOCK_UNAVAILABLE', calendars: HORIZON_CALENDAR_IDS.map(id => ({ id, text: '', status: 'unavailable', validation: null, boundary: 'civil-midnight' })), astronomy: null, panchanga: null, purposeResults: missingPurposes(request.purposeIds, 'Sample clock unavailable'), observanceIds: [] }, calendars: HORIZON_CALENDAR_IDS.map(id => ({ id, status: 'unavailable', parts: [] })) };
  }
  // An unresolved clock is data; an unexpected engine error is a failed run,
  // not a silently missing date that could improve the apparent ranking.
  cancelled(hooks); const first = compute(c, resolved, stats), purposeResults = [];
  for (let i = 0; i < request.purposeIds.length; i++) {
    cancelled(hooks); const computed = request.mode === 'brute' && i > 0 ? compute(c, resolved, stats) : first;
    const p = computed.purposes.find(p => p.id === request.purposeIds[i]); if (!p) throw new Error('Purpose engine omitted a requested profile.'); purposeResults.push(compactPurpose(p));
  }
  const { comparison } = first;
  if (comparison.calendars.length !== 13 || HORIZON_CALENDAR_IDS.some(id => !comparison.calendars.some(c => c.id === id))) throw new Error('Canonical calendar coverage changed; review the complete-ledger contract.');
  return { row: { date, caseId: c.id, status: 'available', sampleUTC: resolved.instant.toISOString(), offsetSeconds: resolved.offsetHours * 3600, ambiguous: resolved.ambiguous, calendars: comparison.calendars.map(compactCalendar), astronomy: clone(comparison.astronomy), panchanga: clone(comparison.vedic.panchanga), purposeResults, observanceIds: [] }, calendars: comparison.calendars };
}
export function horizonEventWindow(request) {
  const r = normalizeHorizonRequest(request), boundaries = r.cases.map(c => ({ caseId: c.id, startUTC: zonedCivilDay(r.startDate, c.timeZone).start.toISOString(), endUTC: zonedCivilDay(r.endDate, c.timeZone).end.toISOString() }));
  return { startUTC: boundaries.map(x => x.startUTC).sort()[0], endUTC: boundaries.map(x => x.endUTC).sort().at(-1), caseWindows: boundaries, convention: 'Bounding union of selected observer civil-day intervals; start inclusive, end exclusive. Display filters each event back to the selected case’s civil dates.' };
}

export async function buildEventHorizon(raw, hooks = {}) {
  const request = normalizeHorizonRequest(raw), dates = horizonDates(request.startDate, request.endDate), started = now();
  const stats = { mode: request.mode, counterScope: 'Top-level orchestration calls; canonical guidance internally recomputes comparison/chart facts.', canonicalCalls: 0, guidanceCalls: 0, purposeBatchEvaluations: 0, elapsedMs: 0, sampleMs: 0, astronomyMs: 0 };
  const counts = { days: dates.length, cases: request.cases.length, totalSamples: dates.length * request.cases.length, processedSamples: 0, availableSamples: 0, unavailableSamples: 0, calendarRows: 0, availableCalendarRows: 0, profileResults: 0, rankableProfileResults: 0, observanceRows: 0, uniqueObservances: 0, eventCount: 0, truncated: false };
  const cases = [], observances = [], progress = phase => hooks.onProgress?.({ phase, ...counts, canonicalCalls: stats.canonicalCalls });
  progress('samples');
  for (const c of request.cases) {
    const rows = [];
    for (const date of dates) {
      cancelled(hooks); const sample = sampleRow(date, c, request, stats, hooks);
      if (request.includeObservances) {
        const observations = observancesForDate({ date, calendars: sample.calendars, observer: { lat: c.lat, lon: c.lon, timeZone: c.timeZone } });
        if (!Array.isArray(observations) || observations.length > 200) throw new Error('Observance engine exceeded its per-date contract.');
        for (const o of observations) { const item = { ...clone(o), originId: o.id, id: c.id + '::' + o.id, caseId: c.id }; sample.row.observanceIds.push(item.id); observances.push(item); }
      }
      rows.push(sample.row); counts.processedSamples++; counts[sample.row.status === 'available' ? 'availableSamples' : 'unavailableSamples']++;
      counts.calendarRows += sample.row.calendars.length; counts.availableCalendarRows += sample.row.calendars.filter(x => x.status === 'available').length;
      counts.profileResults += sample.row.purposeResults.length; counts.rankableProfileResults += sample.row.purposeResults.filter(p => p.rankable).length;
      if (counts.processedSamples % 8 === 0 || counts.processedSamples === counts.totalSamples) { progress('samples'); await pause(hooks); }
    }
    cases.push({ id: c.id, label: c.label, observer: { lat: c.lat, lon: c.lon, timeZone: c.timeZone, system: c.system }, sampleTime: c.sampleTime, disambiguation: c.disambiguation, rows });
  }
  stats.sampleMs = now() - started; counts.observanceRows = observances.length; counts.uniqueObservances = new Set(observances.map(x => x.originId)).size;
  const window = horizonEventWindow(request), astronomyStarted = now();
  const astronomy = request.includeAstronomy ? await buildHorizonAstronomy({ startUTC: window.startUTC, endUTC: window.endUTC }, { ...hooks, isCancelled: () => !!(hooks.shouldCancel?.() || hooks.isCancelled?.() || hooks.signal?.aborted), onProgress: p => hooks.onProgress?.({ phase: 'astronomy', ...counts, astronomy: p }) }) : { events: [], coverage: [], sources: [], stats: {}, limitations: ['Astronomical event search was explicitly disabled.'] };
  cancelled(hooks); stats.astronomyMs = now() - astronomyStarted; counts.eventCount = astronomy.events.length; stats.elapsedMs = now() - started;
  const sources = sourcesById([...OBSERVATORY_SOURCES, ...DAY_GUIDANCE_SOURCES, ...HORIZON_RANKING_SOURCES, ...HORIZON_OBSERVANCE_SOURCES, ...HORIZON_TRADITION_SOURCES, ...astronomy.sources]);
  const result = { schemaVersion: 1, kind: 'event-horizon-ledger', request, counts, cases, observances, astronomy: { ...astronomy, window }, sources,
    coverage: { calendarIds: [...HORIZON_CALENDAR_IDS], purposes: clone(HORIZON_PURPOSES.filter(p => request.purposeIds.includes(p.id))), observances: clone(HORIZON_OBSERVANCE_COVERAGE), traditions: clone(HORIZON_TRADITIONS), astronomy: clone(astronomy.coverage) },
    limitations: [...HORIZON_LIMITATIONS], stats, provenance: { calculation: 'Locally calculated canonical engines', runtime: runtime(), generatedAt: new Date().toISOString(), privateBirthIncluded: false, modelUsed: false } };
  progress('complete'); cancelled(hooks); return result;
}

function semantic(result) { return { request: { ...result.request, mode: 'compared-separately' }, counts: result.counts, cases: result.cases, observances: result.observances, astronomy: { events: result.astronomy.events, coverage: result.astronomy.coverage, window: result.astronomy.window }, sources: result.sources, coverage: result.coverage, limitations: result.limitations }; }
export async function benchmarkHorizonStrategies(raw, hooks = {}) {
  const request = normalizeHorizonRequest(raw), start = now();
  const brute = await buildEventHorizon({ ...request, mode: 'brute' }, { ...hooks, onProgress: p => hooks.onProgress?.({ ...p, strategy: 'brute' }) });
  await pause(hooks);
  const optimized = await buildEventHorizon({ ...request, mode: 'optimized' }, { ...hooks, onProgress: p => hooks.onProgress?.({ ...p, strategy: 'optimized' }) });
  const identical = JSON.stringify(semantic(brute)) === JSON.stringify(semantic(optimized));
  return { kind: 'event-horizon-benchmark', brute, optimized, equivalence: { identical, comparedFields: ['complete requested date/case grid', 'clock missingness', 'all 13 calendar slots', 'all requested profile values and exact ties', 'all observances', 'all astronomical events and coverage', 'sources and limitations'], excludedFields: ['mode label', 'execution counters/timings', 'generation clock/runtime metadata'] }, timing: { bruteMs: brute.stats.elapsedMs, optimizedMs: optimized.stats.elapsedMs, totalMs: now() - start, speedRatio: optimized.stats.elapsedMs > 0 ? brute.stats.elapsedMs / optimized.stats.elapsedMs : null, context: 'Measured on this runtime; optimization shares canonical context across purposes. This is not independent predictive validation.' } };
}

function resultCase(result, caseId) { if (result?.kind !== 'event-horizon-ledger' || result.schemaVersion !== 1) throw new RangeError('Use a completed horizon ledger.'); const c = result.cases.find(c => c.id === caseId); if (!c) throw new RangeError('Unknown case.'); return c; }
export function rankHorizonDates(result, { caseId, purposeId, order = 'best' }) {
  const c = resultCase(result, caseId); if (!result.request.purposeIds.includes(purposeId) || !['best', 'worst'].includes(order)) throw new RangeError('Choose an included purpose and best/worst order.');
  const candidates = c.rows.map(row => ({ row, p: row.purposeResults.find(p => p.id === purposeId) })).filter(x => x.p?.rankable && Number.isFinite(x.p.score) && Number.isFinite(x.p.scoreNumerator) && Number.isFinite(x.p.scoreDenominator) && x.p.scoreDenominator > 0);
  const compare = (a, b) => a.p.scoreNumerator * b.p.scoreDenominator - b.p.scoreNumerator * a.p.scoreDenominator;
  candidates.sort((a, b) => (order === 'best' ? -1 : 1) * compare(a, b) || a.row.date.localeCompare(b.row.date));
  const rows = []; let i = 0;
  while (i < candidates.length) { let end = i + 1; while (end < candidates.length && compare(candidates[i], candidates[end]) === 0) end++; for (let j = i; j < end; j++) rows.push({ ...candidates[j].row, ranking: { rank: i + 1, tieSize: end - i, score: candidates[j].p.score, purposeId } }); i = end; }
  return { rows, unrankableCount: c.rows.length - rows.length, tiePolicy: 'Competition rank under one purpose/case; exact numerator/denominator ties share rank, then dates display chronologically. Missing profiles are unranked, not worst or best.' };
}

const indices = new WeakMap(), clockFormatters = new Map();
function localClock(instant, zone) {
  if (!clockFormatters.has(zone)) clockFormatters.set(zone, new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }));
  const parts = Object.fromEntries(clockFormatters.get(zone).formatToParts(new Date(instant)).map(p => [p.type, p.value]));
  return { localDate: `${parts.year}-${parts.month}-${parts.day}`, localTime: `${parts.hour}:${parts.minute}:${parts.second}` };
}
export function eventsForHorizonDate(result, caseId, date) {
  const c = resultCase(result, caseId); dateOnly(date); if (date < result.request.startDate || date > result.request.endDate) throw new RangeError('Date is outside this ledger.');
  let cases = indices.get(result); if (!cases) { cases = new Map(); indices.set(result, cases); }
  let index = cases.get(caseId);
  if (!index) {
    index = new Map(); const row = date => { if (!index.has(date)) index.set(date, { astronomy: [], observances: [] }); return index.get(date); };
    for (const event of result.astronomy.events) { const clock = localClock(event.startUTC, c.observer.timeZone); if (clock.localDate >= result.request.startDate && clock.localDate <= result.request.endDate) row(clock.localDate).astronomy.push({ ...event, ...clock }); }
    for (const event of result.observances) if (event.caseId === caseId) row(event.date).observances.push(event);
    cases.set(caseId, index);
  }
  return index.get(date) ?? { astronomy: [], observances: [] };
}
export function getHorizonDayDetail(result, caseId, date) {
  const c = resultCase(result, caseId), row = c.rows.find(r => r.date === date); if (!row) throw new RangeError('Date is outside this case.'); const events = eventsForHorizonDate(result, caseId, date);
  if (row.status !== 'available') return { row, comparison: null, guidance: null, purposes: [], events, observances: events.observances, runtimeDifferences: [], reason: row.reason };
  const input = { dateISO: row.sampleUTC, ...c.observer }, comparison = compareMoment(input), guidance = buildDayGuidance(comparison), purposes = evaluateHorizonPurposes({ comparison, guidance });
  const runtimeDifferences = row.calendars.flatMap(old => { const current = comparison.calendars.find(r => r.id === old.id); return current && (old.text !== current.text || old.status !== current.status) ? [{ calendarId: old.id, stored: old.text, current: current.text, storedStatus: old.status, currentStatus: current.status }] : []; });
  return { row, comparison, guidance, purposes, events, observances: events.observances, runtimeDifferences, computationScope: 'Stored public sample UTC, recomputed with this runtime; personal birth and oracle context are not supplied.' };
}
export function getHorizonHourlyDetail(result, caseId, date) { const c = resultCase(result, caseId), row = c.rows.find(r => r.date === date); if (!row) throw new RangeError('Date outside ledger.'); return buildHourlyGuidance({ date, context: { dateISO: row.sampleUTC ?? zonedCivilDay(date, c.observer.timeZone).start.toISOString(), ...c.observer } }); }

export function exportHorizonJSON(result) { resultCase(result, result?.cases?.[0]?.id); return JSON.stringify({ ...result, exportPolicy: 'Includes explicit public observer cases and sampled instants; no birth records or provider keys. This is a complete ledger, not just displayed ranking rows.' }, null, 2); }
function csvCell(value) { let s = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value); if (typeof value !== 'number' && /^[=+@\-\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
export function exportHorizonCSV(result, { caseId, purposeId }) {
  const c = resultCase(result, caseId), ranked = rankHorizonDates(result, { caseId, purposeId }), byDate = new Map(ranked.rows.map(r => [r.date, r.ranking]));
  const rows = [['date', 'case', 'timeZone', 'sampleClock', 'sampleUTC', 'sampleStatus', 'purpose', 'score', 'rank', 'tieSize', 'observed', 'total', 'missing', 'calendarDates', 'observanceIds', 'scope']];
  for (const r of c.rows) { const p = r.purposeResults.find(p => p.id === purposeId), rank = byDate.get(r.date); rows.push([r.date, c.label, c.observer.timeZone, c.sampleTime, r.sampleUTC, r.status, purposeId, p?.score, rank?.rank, rank?.tieSize, p?.observed, p?.total, p?.missing, r.calendars, r.observanceIds, 'Named editorial profile at one sampled instant; not a full-day forecast']); }
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
const icalText = text => String(text).replace(/\\/g, '\\\\').replace(/\r\n|\n|\r/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const icalDate = instant => new Date(instant).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
function foldICS(line) { const encoder = new TextEncoder(); let chunks = [], part = '', bytes = 0; for (const c of line) { const n = encoder.encode(c).length; if (bytes + n > 75) { chunks.push(part); part = ' '; bytes = 1; } part += c; bytes += n; } chunks.push(part); return chunks.join('\r\n'); }
export function exportHorizonDayICS(result, { caseId, date, generatedAt }) {
  const c = resultCase(result, caseId), row = c.rows.find(r => r.date === date); if (!row?.sampleUTC) throw new RangeError('An available sample instant is required for calendar export.');
  if (typeof generatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(generatedAt) || !Number.isFinite(Date.parse(generatedAt))) throw new RangeError('Supply an explicit generatedAt instant.');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Astrologers Workbench//Event Horizon Study//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:horizon-${caseId}-${date}-${icalDate(row.sampleUTC)}@astrology-workbench.invalid`, 'DTSTAMP:' + icalDate(generatedAt), 'DTSTART:' + icalDate(row.sampleUTC), 'SUMMARY:' + icalText(`Calendar study · ${c.label} · ${date}`), 'DESCRIPTION:' + icalText(`Public study sample at ${c.sampleTime} ${c.observer.timeZone}. This marks one calculated instant, not a religious observance boundary, a whole-day verdict or a connected calendar sync. Coordinates and birth details are omitted.`), 'END:VEVENT', 'END:VCALENDAR'];
  return lines.map(foldICS).join('\r\n') + '\r\n';
}

async function boundedPresetFetch(url, maxBytes, signal, fetchImpl) {
  const controller = new AbortController(); let overflowError = null;
  const parentAbort = () => controller.abort(signal.reason);
  if (signal?.aborted) parentAbort();
  else signal?.addEventListener('abort', parentAbort, { once: true });
  try {
    const response = await fetchImpl(url, { signal: controller.signal, cache: 'no-cache' });
    if (!response.ok) throw new Error(`Preset request failed: HTTP ${response.status}.`);
    if (Number(response.headers.get('Content-Length')) > maxBytes) throw new RangeError('Preset part exceeds the byte limit.');
    // Native consumption of the original response completes the browser transport.
    // Monitor a clone so unknown-length responses still abort on a byte overflow.
    const monitor = response.body?.getReader ? (async () => {
      const reader = response.clone().body.getReader(); let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return size;
          size += value.byteLength;
          if (size > maxBytes) {
            overflowError = new RangeError('Preset part exceeds the byte limit.');
            controller.abort(overflowError);
            throw overflowError;
          }
        }
      } finally { reader.releaseLock(); }
    })() : Promise.resolve(null);
    const [buffer] = await Promise.all([response.arrayBuffer(), monitor]);
    const bytes = new Uint8Array(buffer);
    if (bytes.length > maxBytes) throw new RangeError('Preset part exceeds the byte limit.');
    return bytes;
  } catch (error) {
    controller.abort(error);
    if (signal?.aborted) {
      const cancelled = new Error('Preset loading cancelled.'); cancelled.name = 'AbortError'; throw cancelled;
    }
    // An overflow abort can reject native consumption before the monitor's error.
    throw overflowError ?? error;
  } finally { signal?.removeEventListener('abort', parentAbort); }
}
const hex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
const digest = async bytes => hex(await crypto.subtle.digest('SHA-256', bytes));
const jsonDigest = value => digest(new TextEncoder().encode(JSON.stringify(value)));
export function validateHorizonLedger(result) {
  const reject = message => { throw new Error('Invalid horizon ledger: ' + message); };
  if (result?.kind !== 'event-horizon-ledger' || result.schemaVersion !== 1) reject('schema');
  const request = normalizeHorizonRequest(result.request), dates = horizonDates(request.startDate, request.endDate);
  if (!Array.isArray(result.cases) || result.cases.length !== request.cases.length) reject('cases');
  const sourceIds = new Set((result.sources ?? []).map(s => s.id));
  if (!sourceIds.size || sourceIds.size !== result.sources.length || sourceIds.has(undefined)) reject('source identities');
  const observedIds = new Set(), observedRows = new Map(), rowByKey = new Map();
  const counts = { days: dates.length, cases: request.cases.length, totalSamples: dates.length * request.cases.length, processedSamples: 0, availableSamples: 0, unavailableSamples: 0, calendarRows: 0, availableCalendarRows: 0, profileResults: 0, rankableProfileResults: 0, observanceRows: 0, uniqueObservances: 0, eventCount: 0, truncated: false };
  for (let ci = 0; ci < request.cases.length; ci++) {
    const wanted = request.cases[ci], c = result.cases[ci];
    if (c.id !== wanted.id || c.label !== wanted.label || c.sampleTime !== wanted.sampleTime || c.disambiguation !== wanted.disambiguation || ['lat','lon','timeZone','system'].some(k => c.observer?.[k] !== wanted[k]) || c.rows?.length !== dates.length) reject('case context or full grid');
    for (let i = 0; i < dates.length; i++) {
      const row = c.rows[i];
      if (row.date !== dates[i] || row.caseId !== c.id || !['available','unavailable'].includes(row.status)) reject('row identity');
      if (row.calendars?.length !== 13 || new Set(row.calendars.map(x => x.id)).size !== 13 || HORIZON_CALENDAR_IDS.some(id => !row.calendars.some(x => x.id === id))) reject('exact calendar identities');
      if (row.calendars.some(x => !['available','unavailable'].includes(x.status) || typeof x.text !== 'string')) reject('calendar status');
      let resolved = null; try { resolved = resolveZonedTime(row.date, c.sampleTime, c.observer.timeZone, { disambiguation: c.disambiguation }); } catch { /* retained unavailable clock */ }
      if (row.status === 'available') {
        if (!resolved || row.sampleUTC !== resolved.instant.toISOString() || row.offsetSeconds !== resolved.offsetHours * 3600 || row.ambiguous !== resolved.ambiguous) reject('sample instant and clock');
      } else if (resolved || row.sampleUTC !== null || row.offsetSeconds !== null || !row.reason || row.calendars.some(x => x.status !== 'unavailable')) reject('unavailable clock');
      if (row.purposeResults?.length !== request.purposeIds.length || new Set(row.purposeResults.map(p => p.id)).size !== request.purposeIds.length) reject('purpose identities');
      for (const id of request.purposeIds) {
        const p = row.purposeResults.find(x => x.id === id), definition = HORIZON_PURPOSES.find(x => x.id === id);
        const denominator = definition.contributions.reduce((n,c) => n + c.weight,0), total = definition.contributions.length;
        if (!p || p.scoreDenominator !== denominator || p.total !== total || !Number.isInteger(p.observed) || p.observed < 0 || p.observed > total || !Array.isArray(p.missing) || p.missing.length !== total - p.observed || new Set(p.missing.map(m => m.id)).size !== p.missing.length || p.missing.some(m => !definition.contributions.some(x => x.id === m.id) || typeof m.reason !== 'string' || !m.reason)) reject('profile completeness');
        if (typeof p.rankable !== 'boolean' || p.rankable !== (p.missing.length === 0) || (row.status === 'unavailable' && p.observed !== 0)) reject('profile rankability');
        if (p.rankable ? !Number.isInteger(p.scoreNumerator) || Math.abs(p.scoreNumerator) > denominator || !Number.isFinite(p.score) || p.score !== 100 * p.scoreNumerator / denominator : p.score !== null || p.scoreNumerator !== null) reject('profile score');
        const groups = [...new Set(definition.contributions.map(x => x.dependencyGroup))];
        if (!Array.isArray(p.dependencyGroups) || p.dependencyGroups.length !== groups.length || new Set(p.dependencyGroups.map(g => g.id)).size !== groups.length) reject('dependency groups');
        for (const id of groups) { const g = p.dependencyGroups.find(g => g.id === id), terms = definition.contributions.filter(t => t.dependencyGroup === id); if (!g || g.independentEvidence !== false || g.weight !== terms.reduce((n,t) => n + t.weight,0) || g.total !== terms.length || g.observed !== terms.filter(t => !p.missing.some(m => m.id === t.id)).length || JSON.stringify(g.ruleIds) !== JSON.stringify(terms.map(t => t.id))) reject('dependency accounting'); }
        counts.profileResults++; if (p.rankable) counts.rankableProfileResults++;
      }
      if (!Array.isArray(row.observanceIds) || new Set(row.observanceIds).size !== row.observanceIds.length) reject('observance index');
      rowByKey.set(c.id + '::' + row.date,row);
      counts.processedSamples++; counts[row.status === 'available' ? 'availableSamples' : 'unavailableSamples']++; counts.calendarRows += 13; counts.availableCalendarRows += row.calendars.filter(x => x.status === 'available').length;
    }
  }
  if (!Array.isArray(result.observances)) reject('observances');
  for (const event of result.observances) {
    const row = rowByKey.get(event.caseId + '::' + event.date);
    if (!row || !event.originId || event.id !== event.caseId + '::' + event.originId || observedIds.has(event.id) || !row.observanceIds.includes(event.id) || event.precision !== 'date-only' || !event.sourceIds?.length || event.sourceIds.some(id => !sourceIds.has(id))) reject('observance identity/source/date');
    observedIds.add(event.id); observedRows.set(event.id, row);
  }
  for (const row of rowByKey.values()) if (row.observanceIds.some(id => observedRows.get(id) !== row)) reject('unresolved or wrong-date observance');
  const astronomy = result.astronomy, window = horizonEventWindow(request), eventIds = new Set();
  if (!astronomy || JSON.stringify(astronomy.window) !== JSON.stringify(window) || !Array.isArray(astronomy.events)) reject('astronomy window');
  if (request.includeAstronomy && (astronomy.range?.startUTC !== window.startUTC || astronomy.range?.endUTC !== window.endUTC || astronomy.range?.startInclusive !== true || astronomy.range?.endExclusive !== true)) reject('astronomy declared range');
  let previous = -Infinity;
  for (const event of astronomy.events) {
    const at = Date.parse(event.startUTC);
    if (!event.id || eventIds.has(event.id) || !Number.isFinite(at) || at < Date.parse(window.startUTC) || at >= Date.parse(window.endUTC) || at < previous || event.precision !== 'computed-instant' || !event.sourceIds?.length || event.sourceIds.some(id => !sourceIds.has(id))) reject('astronomy event identity/time/source');
    previous = at; eventIds.add(event.id);
  }
  if ((!request.includeObservances && result.observances.length) || (!request.includeAstronomy && astronomy.events.length)) reject('disabled layer has records');
  counts.observanceRows = result.observances.length; counts.uniqueObservances = new Set(result.observances.map(o => o.originId)).size; counts.eventCount = astronomy.events.length;
  if (Object.keys(counts).some(k => result.counts?.[k] !== counts[k])) reject('accounting counts');
  return result;
}
export async function loadHorizonPreset({ onProgress, signal, fetchImpl = globalThis.fetch } = {}) {
  const url = new URL('../../data/horizon-2031-manifest.json', import.meta.url), bytes = await boundedPresetFetch(url, 1024 * 1024, signal, fetchImpl), manifest = JSON.parse(new TextDecoder().decode(bytes));
  if (await digest(bytes) !== HORIZON_PRESET_MANIFEST_SHA256 || manifest.sourceBinding?.sha256 !== HORIZON_PRESET_SOURCE_SHA256 || await jsonDigest(manifest.metadata) !== HORIZON_PRESET_METADATA_SHA256) throw new Error('Preset release/source binding mismatch. Reload the published release or calculate locally.');
  if (manifest.kind !== 'event-horizon-preset' || manifest.schemaVersion !== 1) throw new Error('Unsupported horizon preset manifest.');
  const request = normalizeHorizonRequest(manifest.request), dates = horizonDates(request.startDate, request.endDate);
  dense(manifest.parts, request.cases.length + 1, request.cases.length + 1, 'Preset parts');
  if (new Set(manifest.parts.map(p => p.id)).size !== manifest.parts.length || manifest.parts.reduce((n, p) => n + p.bytes, 0) > HORIZON_LIMITS.maxPresetBytes) throw new Error('Invalid preset part inventory.');
  let completed = 0;
  const loaded = await Promise.all(manifest.parts.map(async part => {
    if (!/^(?:case-[a-z0-9-]+|astronomy)$/.test(part.id) || !/^horizon-2031\/[a-z0-9-]+\.json$/.test(part.path) || !/^[a-f0-9]{64}$/.test(part.sha256) || !Number.isInteger(part.bytes) || part.bytes < 1 || part.bytes > HORIZON_LIMITS.maxPartBytes) throw new Error('Invalid preset part descriptor.');
    const payload = await boundedPresetFetch(new URL(part.path, url), part.bytes, signal, fetchImpl);
    if (payload.length !== part.bytes || hex(await crypto.subtle.digest('SHA-256', payload)) !== part.sha256) throw new Error('Preset checksum mismatch. Reload the published release or calculate locally.');
    const data = JSON.parse(new TextDecoder().decode(payload)); completed++; onProgress?.({ phase: 'preset', completed, total: manifest.parts.length, bytes: payload.length }); return { id: part.id, data };
  }));
  const cases = [], observances = [];
  for (const c of request.cases) {
    const part = loaded.find(p => p.id === 'case-' + c.id)?.data;
    if (!part || part.case?.id !== c.id || part.case.rows?.length !== dates.length || !Array.isArray(part.observances)) throw new Error('Preset case does not cover the requested grid.');
    part.case.rows.forEach((row, i) => { if (row.date !== dates[i] || row.caseId !== c.id || !['available', 'unavailable'].includes(row.status) || row.calendars?.length !== 13 || row.purposeResults?.length !== request.purposeIds.length || request.purposeIds.some(id => !row.purposeResults.some(p => p.id === id))) throw new Error('Preset daily coverage is incomplete.'); });
    cases.push(part.case); observances.push(...part.observances);
  }
  const astronomy = loaded.find(p => p.id === 'astronomy')?.data;
  if (!astronomy || !Array.isArray(astronomy.events)) throw new Error('Preset astronomy part is unavailable.');
  const result = { ...manifest.metadata, schemaVersion: 1, kind: 'event-horizon-ledger', request, cases, observances, astronomy, provenance: { ...manifest.metadata.provenance, preset: true, datasetId: manifest.datasetId, sourceBinding: manifest.sourceBinding, checksumVerified: true, manifestURL: url.href } };
  if (signal?.aborted) { const e = new Error('Preset loading cancelled.'); e.name = 'AbortError'; throw e; }
  return validateHorizonLedger(result);
}
