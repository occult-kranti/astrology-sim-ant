// One explicit local-clock sample per civil date. The grid resolves clocks;
// only a selected frame invokes the existing astronomical/calendar engines.
import { civilFields, zonedTimeCandidates, startOfZonedDay } from './time.js';
import { HOUSE_SYSTEMS } from './instant-boundary.js';
import { validateLocation, validateZone, PRAYER_METHODS } from './cultural-calendars.js';
import { buildCalendarAtlas } from './calendar-atlas.js';
import { buildSkySnapshot, buildSkyTimelineSync } from './sky-dynamics.js';
import { buildDayGuidance } from './day-guidance.js';
import { HORIZON_PURPOSES, HORIZON_RANKING_SOURCES, evaluateHorizonPurposes } from './horizon-ranking.js';
import { castChart, houseOf, norm360 } from './astro.js';
import { castVedic } from './vedic.js';
import { buildTimelineStudyTasks, TIMELINE_STUDY_SOURCES } from './data/timeline-study-tasks.js';

export const CALENDAR_TIMELINE_VERSION = 1;
export const CALENDAR_TIMELINE_LIMITS = Object.freeze({ minYear: 1900, maxYear: 2100, maxDays: 3660 });
export const CALENDAR_TIMELINE_SOURCES = Object.freeze([
  Object.freeze({ id: 'CT-METHODS', title: 'Synchronized calendar timeline engine contract', url: 'docs/2026-10-calendar-timeline-engine.md', claimType: 'project-methods', readingDepth: 'Canonical implementation and existing source-qualified fixtures reused; no new historical rule, full-range astronomical validation, or outcome prediction.' }),
  Object.freeze({ id: 'CT-CLOCK', title: 'Canonical local-clock ambiguity boundary', url: 'assets/js/core/time.js', claimType: 'software-method', readingDepth: 'zonedTimeCandidates and startOfZonedDay inspected; runtime Intl time-zone data, round-trip candidate validation, explicit repeated-clock selection.' }),
]);
const DAY = 86400000;
const KEYS = ['startDate', 'endDate', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation', 'includeCatalogStars', 'includeGuidance', 'prayerMethod', 'asr', 'highLatitude'];
const LIMITATIONS = [
  'A frame describes one explicitly selected local-clock sample, not the entire civil day. Slider steps do not locate exact ingresses, stations, aspects or changes in traditional rules.',
  'Calculated astronomical positions and civil conventions are distinct from traditional rules and modern editorial study indices. Astrology has no demonstrated predictive validity.',
  'The observer is a supplied location and IANA zone, not a national birth, event timestamp, country identity or geopolitical forecast. Coordinates do not establish that the supplied zone is geographically correct.',
  'Missing clocks, repeated clocks without an explicit occurrence, unavailable polar events and unresolved rule timing remain missing. No other time, place or rule is substituted.',
  'Civil-calendar labels carry no favorable/caution score. Four named editorial profiles retain their own dependencies, denominators and missingness; they do not form a universal consensus.',
  'Each frame is freshly calculated through canonical engines. Sources retain inherited reading depth and selected-fixture qualifications; this composition does not establish full-range accuracy or community authority.',
];
const copy = value => JSON.parse(JSON.stringify(value));
const days = request => Math.round((Date.parse(request.endDate + 'T00:00:00Z') - Date.parse(request.startDate + 'T00:00:00Z')) / DAY) + 1;
function plain(value, label) {
  if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(label + ' must be a plain object.');
  return value;
}
function dateOnly(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError(label + ' must be an explicit YYYY-MM-DD date.');
  const f = civilFields(value);
  if (f.year < 1900 || f.year > 2100) throw new RangeError('Timeline civil dates must be within 1900–2100.');
  return value;
}
function choice(value, choices, label) {
  if (!choices.includes(value)) throw new RangeError('Choose a supported ' + label + '.');
  return value;
}
function boolean(value, fallback, label) {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') throw new TypeError(label + ' must be true or false.');
  return value;
}

/** Exact input types and a finite daily window; undeclared metadata is rejected. */
export function normalizeCalendarTimelineRequest(raw) {
  plain(raw, 'Timeline request');
  if (Reflect.ownKeys(raw).some(key => !KEYS.includes(key))) throw new RangeError('Unknown timeline request field.');
  const descriptors = Object.getOwnPropertyDescriptors(raw), r = Object.create(null);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError('Timeline request fields must be ordinary enumerable JSON values.');
    r[key] = descriptor.value;
  }
  const startDate = dateOnly(r.startDate, 'Start date'), endDate = dateOnly(r.endDate, 'End date');
  if (endDate < startDate) throw new RangeError('Timeline end date must not precede its start date.');
  if (days({ startDate, endDate }) > CALENDAR_TIMELINE_LIMITS.maxDays) throw new RangeError('A timeline may contain at most 3660 inclusive civil dates.');
  if (typeof r.time !== 'string') throw new TypeError('An explicit local sample clock is required.');
  civilFields(startDate, r.time);
  validateLocation(r.lat, r.lon);
  if (Math.abs(r.lat) === 90) throw new RangeError('Synchronized house charts require an observer strictly between −90° and 90° latitude.');
  return {
    startDate, endDate, time: r.time.length === 5 ? r.time + ':00' : r.time,
    timeZone: validateZone(r.timeZone), lat: r.lat, lon: r.lon,
    system: choice(r.system, HOUSE_SYSTEMS, 'house system'),
    disambiguation: choice(r.disambiguation === undefined ? 'reject' : r.disambiguation, ['reject', 'earlier', 'later'], 'repeated-clock policy'),
    includeCatalogStars: boolean(r.includeCatalogStars, false, 'includeCatalogStars'),
    includeGuidance: boolean(r.includeGuidance, true, 'includeGuidance'),
    prayerMethod: choice(r.prayerMethod === undefined ? 'MuslimWorldLeague' : r.prayerMethod, PRAYER_METHODS.map(([id]) => id), 'prayer method'),
    asr: choice(r.asr === undefined ? 'Shafi' : r.asr, ['Shafi', 'Hanafi'], 'Asr convention'),
    highLatitude: choice(r.highLatitude === undefined ? 'MiddleOfTheNight' : r.highLatitude, ['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle'], 'high-latitude prayer convention'),
  };
}

function slotAt(request, index) {
  if (!Number.isInteger(index) || index < 0 || index >= days(request)) throw new RangeError('Frame index must be an integer within the inclusive timeline grid.');
  const localDate = new Date(Date.parse(request.startDate + 'T00:00:00Z') + index * DAY).toISOString().slice(0, 10);
  const nominal = Date.parse(localDate + 'T' + request.time + 'Z');
  const instants = zonedTimeCandidates(localDate, request.time, request.timeZone);
  const candidates = instants.map((instant, i) => ({ dateISO: instant.toISOString(), offsetSeconds: (nominal - +instant) / 1000, occurrence: instants.length > 1 ? i + 1 : null, withinSupportedUTC: instant.getUTCFullYear() >= 1900 && instant.getUTCFullYear() <= 2100 }));
  const slot = { index, localDate, localTime: request.time, status: 'available', code: null, reason: null, repeatedClock: instants.length > 1, candidates, selectedDateISO: null, selectedOccurrence: null };
  if (!instants.length) {
    slot.status = 'unavailable'; slot.code = 'NONEXISTENT_TIME'; slot.reason = 'The selected local clock does not exist in this time zone on this date.';
    try { startOfZonedDay(localDate, request.timeZone); }
    catch (error) { if (error.code !== 'NONEXISTENT_DATE') throw error; slot.code = error.code; slot.reason = 'This entire civil date was skipped in the selected time zone.'; }
    return slot;
  }
  if (instants.length > 1 && request.disambiguation === 'reject') return { ...slot, status: 'ambiguous', code: 'AMBIGUOUS_TIME', reason: 'This local clock repeats. Select the earlier or later occurrence explicitly; both candidate instants are retained.' };
  const selected = candidates[request.disambiguation === 'later' ? candidates.length - 1 : 0];
  slot.selectedDateISO = selected.dateISO; slot.selectedOccurrence = selected.occurrence;
  if (!selected.withinSupportedUTC) return { ...slot, status: 'unavailable', code: 'UTC_RANGE', reason: 'The chosen local clock resolves outside supported UTC years 1900–2100. Its actual instant is retained without a substitute.' };
  return slot;
}

/** Lightweight local-civil grid. No chart, calendar, or profile is calculated. */
export function buildCalendarTimelineGrid(raw) {
  const request = normalizeCalendarTimelineRequest(raw);
  const slots = Array.from({ length: days(request) }, (_, index) => slotAt(request, index));
  return { schemaVersion: CALENDAR_TIMELINE_VERSION, kind: 'calendar-timeline-clock-grid', request, slots,
    counts: { total: slots.length, available: slots.filter(s => s.status === 'available').length, ambiguous: slots.filter(s => s.status === 'ambiguous').length, unavailable: slots.filter(s => s.status === 'unavailable').length, repeatedClocks: slots.filter(s => s.repeatedClock).length },
    sampling: { grid: 'inclusive-local-civil-dates', stepDays: 1, localClock: request.time, timeZone: request.timeZone, fixedElapsedUTCStep: false, wholeDayValidity: false },
    sources: copy(CALENDAR_TIMELINE_SOURCES), limitations: [...LIMITATIONS],
  };
}

function purposeEvidence(comparison, guidance) {
  return evaluateHorizonPurposes({ comparison, guidance }).map(result => {
    const definition = HORIZON_PURPOSES.find(p => p.id === result.id);
    return { ...result, label: definition.label, description: definition.description, method: definition.method, scoreScale: copy(definition.scoreScale) };
  });
}
function sourcesFor(...lists) { return copy([...new Map(lists.flat().map(source => [source.id, source])).values()]); }
function withStudyTasks(frame) {
  return { ...frame, studyTasks: buildTimelineStudyTasks(frame.purposes, { includeGuidance: frame.request.includeGuidance }), sources: sourcesFor(frame.sources, TIMELINE_STUDY_SOURCES) };
}
function nearbyAstronomy(input) {
  const selected = Date.parse(input.dateISO), requestedStart = selected - 16 * DAY, requestedEnd = selected + 16 * DAY;
  const start = Math.max(Date.parse('1900-01-01T00:00:00Z'), requestedStart), end = Math.min(Date.parse('2100-12-31T23:59:59.999Z'), requestedEnd);
  const timeline = buildSkyTimelineSync({ startISO: new Date(start).toISOString(), endISO: new Date(end).toISOString(), timeZone: input.timeZone, bodyIds: ['Sun', 'Moon'], stepDays: 32, includeEvents: true }, { maxSamples: 2, maxEvents: 16 });
  return { status: 'available', startISO: timeline.request.startISO, endISO: timeline.request.endISO, clippedToSupportedRange: start !== requestedStart || end !== requestedEnd,
    window: 'Sixteen elapsed days before and after the selected instant, clipped only at supported UTC year limits.',
    events: timeline.events, sourceIds: ['SKY-ASTRONOMY', 'SKY-HORIZONS'], eventTypes: timeline.sampling.eventTypes,
    method: 'Canonical Astronomy Engine solar-season and lunar-quarter numerical searches, separate from daily sample positions.',
    timing: timeline.sampling.eventTiming, limitations: timeline.limitations,
  };
}
function chartGeometry(input, comparison, atlas, sky) {
  const houseRow = atlas.rows.find(row => row.id === 'western-' + input.system);
  const house = houseRow.result, indexedCusps = [null, ...house.cusps];
  const tropical = { ...copy(house), status: houseRow.status, frame: 'geocentric apparent true ecliptic/equinox of date; tropical zodiac',
    placements: sky.bodies.map(body => ({ id: body.id, longitude: body.longitude, latitude: body.latitude, house: houseOf(body.longitude, indexedCusps) })),
    method: 'Canonical atlas selected house geometry; all ten apparent geocentric sky longitudes assigned with canonical houseOf().',
    sourceIds: [...houseRow.sourceIds], limitations: [...houseRow.limitations],
  };
  const date = new Date(input.dateISO), chart = { ...castChart(date, input.lat, input.lon, input.system), timeZone: input.timeZone };
  const vedic = castVedic(chart, { currentDate: date });
  return { tropical, vedic: {
    status: 'available', frame: 'sidereal zodiac from canonical apparent tropical positions minus the linear Lahiri estimate',
    method: comparison.vedic.method, ayanamsha: copy(comparison.vedic.ayanamsha), lagna: copy(vedic.lagna), panchanga: copy(vedic.panchanga),
    cusps: Array.from({ length: 12 }, (_, i) => norm360(vedic.lagna.rashiIndex * 30 + i * 30)),
    planets: Object.entries(vedic.grahas).map(([id, p]) => ({ id, longitude: p.lon, sign: p.rashi, signIndex: p.rashiIndex, degree: p.deg, house: p.house, retrograde: p.retrograde, nakshatra: copy(p.nakshatra) })),
    sourceIds: [...comparison.vedic.sourceIds], limitations: [...comparison.vedic.limitations, 'Nine traditional grahas include the mean lunar nodes Rāhu/Ketu; they are not the ten-body astronomical sky catalogue. Whole-sign cusps are already sidereal; do not subtract the ayanāṃśa again.'],
  } };
}

/** Re-resolve only the selected index, then recompute canonical facts. */
export function buildCalendarTimelineFrame(raw, index) {
  const request = normalizeCalendarTimelineRequest(raw), slot = slotAt(request, index);
  const base = { schemaVersion: CALENDAR_TIMELINE_VERSION, kind: 'synchronized-calendar-timeline-frame', request, slot, status: slot.status,
    sampleScope: { index, totalDates: days(request), localDate: slot.localDate, localTime: slot.localTime, timeZone: request.timeZone, instantISO: slot.selectedDateISO, wholeDayValidity: false, eventOutcomePrediction: false },
    context: null, comparison: null, atlas: null, sky: null, charts: null, guidance: null, astronomicalEvents: null,
    guidanceStatus: request.includeGuidance ? 'unavailable' : 'not-requested', purposes: [],
    sources: copy(CALENDAR_TIMELINE_SOURCES), limitations: [...LIMITATIONS],
  };
  if (slot.status !== 'available') {
    if (request.includeGuidance) { base.purposes = purposeEvidence(null, null); base.sources = sourcesFor(base.sources, HORIZON_RANKING_SOURCES); }
    return withStudyTasks(base);
  }
  const input = { dateISO: slot.selectedDateISO, lat: request.lat, lon: request.lon, timeZone: request.timeZone, system: request.system, prayerMethod: request.prayerMethod, asr: request.asr, highLatitude: request.highLatitude };
  const { comparison, ...atlas } = buildCalendarAtlas(input);
  const sky = buildSkySnapshot(input, { includeCatalogStars: request.includeCatalogStars });
  const guidance = request.includeGuidance ? buildDayGuidance(input) : null;
  return withStudyTasks({ ...base, context: copy(comparison.context), comparison, atlas, sky, charts: chartGeometry(input, comparison, atlas, sky), guidance, astronomicalEvents: nearbyAstronomy(input),
    guidanceStatus: guidance ? 'available' : 'not-requested', purposes: guidance ? purposeEvidence(comparison, guidance) : [],
    sources: sourcesFor(CALENDAR_TIMELINE_SOURCES, atlas.sources, sky.sources, guidance ? HORIZON_RANKING_SOURCES : []),
  });
}

/** Exports accept only strict request + index, never caller-supplied geometry. */
export function exportCalendarTimelineJSON(raw, index) { return JSON.stringify(buildCalendarTimelineFrame(raw, index), null, 2) + '\n'; }
function csvCell(value) {
  let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (typeof value !== 'number' && (/^\s*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function exportCalendarTimelineCSV(raw, index) {
  const frame = buildCalendarTimelineFrame(raw, index), { slot, request } = frame;
  const rows = [['recordType', 'index', 'localDate', 'localTime', 'timeZone', 'instantUTC', 'status', 'id', 'label', 'value', 'unit', 'longitude', 'latitude', 'house', 'sourceIds', 'method', 'limitations']];
  const add = (type, status, id, label, value, unit = '', longitude = '', latitude = '', house = '', sourceIds = [], method = '', limitations = []) => rows.push([type, index, slot.localDate, slot.localTime, request.timeZone, slot.selectedDateISO, status, id, label, value, unit, longitude, latitude, house, sourceIds, method, limitations]);
  add('sample', slot.status, slot.code, 'Explicit local-clock sample; not a whole-day verdict', slot.reason, '', '', '', '', ['CT-METHODS', 'CT-CLOCK'], frame.sampleScope, frame.limitations);
  add('observer', 'declared', 'observer', 'Explicit observer and calculation conventions', request);
  for (const c of slot.candidates) add('clock-candidate', c.withinSupportedUTC ? 'supported' : 'outside-UTC-range', c.occurrence, c.dateISO, c.offsetSeconds, 'UTC offset seconds', '', '', '', ['CT-CLOCK']);
  for (const c of frame.comparison?.calendars || []) add('civil-calendar', c.status, c.id, c.label, c.text, '', '', '', '', c.sourceIds, c.method, c.limitations);
  for (const b of frame.sky?.bodies || []) add('sky-body', 'available', b.id, b.name, b.speedDegreesPerDay, 'degrees per day', b.longitude, b.latitude, frame.charts.tropical.placements.find(p => p.id === b.id).house, ['SKY-ASTRONOMY'], b.frame, frame.sky.limitations);
  for (const s of frame.sky?.catalogStars || []) add('catalog-star', 'available', s.id, s.name, s.distanceParsecs, 'parsecs', s.longitude, s.latitude, '', s.sourceIds, s.method, [s.precision]);
  for (const event of frame.astronomicalEvents?.events || []) add('astronomical-event', 'calculated', event.kind, event.label, event, '', '', '', '', frame.astronomicalEvents.sourceIds, event.method, [frame.astronomicalEvents.timing]);
  for (const [i, longitude] of (frame.charts?.tropical.cusps || []).entries()) add('tropical-house', frame.charts.tropical.status, i + 1, frame.charts.tropical.actualSystem, '', '', longitude, '', i + 1, frame.charts.tropical.sourceIds, frame.charts.tropical.method, frame.charts.tropical.limitations);
  if (frame.charts?.vedic) add('vedic-reference', 'available', 'linear-lahiri', 'Sidereal reference and instantaneous Panchanga', { ayanamsha: frame.charts.vedic.ayanamsha, lagna: frame.charts.vedic.lagna, panchanga: frame.charts.vedic.panchanga }, '', '', '', '', frame.charts.vedic.sourceIds, frame.charts.vedic.method, frame.charts.vedic.limitations);
  for (const [i, longitude] of (frame.charts?.vedic.cusps || []).entries()) add('vedic-house', 'available', i + 1, 'Sidereal whole-sign house', '', '', longitude, '', i + 1, frame.charts.vedic.sourceIds, frame.charts.vedic.method, frame.charts.vedic.limitations);
  for (const p of frame.charts?.vedic.planets || []) add('vedic-graha', 'available', p.id, p.sign, p.nakshatra, '', p.longitude, '', p.house, frame.charts.vedic.sourceIds, frame.charts.vedic.method, frame.charts.vedic.limitations);
  for (const t of frame.guidance?.traditions || []) for (const r of t.items) add('traditional-rule', r.classification, r.id, r.title, r.computed, '', '', '', '', r.sourceIds, r.algorithm, r.limitations);
  for (const p of frame.purposes) add('editorial-profile', p.rankable ? 'observed' : 'unavailable', p.id, p.label, { score: p.score, numerator: p.scoreNumerator, denominator: p.scoreDenominator, missing: p.missing, dependencyGroups: p.dependencyGroups, contributions: p.contributions }, 'editorial index, not probability', '', '', '', p.sourceIds, p.method, p.limitations);
  for (const task of frame.studyTasks) add('study-task', task.status, task.id, task.label, { profileId: task.profileId, score: task.score, reason: task.reason, optionalAction: task.optionalAction }, '', '', '', '', task.sourceIds, task.method, task.limitations);
  for (const source of frame.sources) add('source', 'inherited-or-project-method', source.id, source.title, source);
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
