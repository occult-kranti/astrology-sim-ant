// Source-bound historical arithmetic and explicitly assumed modern samples.
// No prophecy clock, outcome score, storage, network or current-clock reads.
import { NEWTON_CHRONOLOGY_SOURCES, NEWTON_CHRONOLOGY_SCENARIOS, NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS, NEWTON_CHRONOLOGY_LIMITS } from './data/newton-chronology-sources.js';
import { normalizeCalendarTimelineRequest, buildCalendarTimelineGrid, buildCalendarTimelineFrame } from './calendar-timeline.js';
import { compareMoment, OBSERVATORY_SOURCES } from './calendar-observatory.js';
import { ATLAS_SOURCES, ATLAS_VARIANTS } from './calendar-atlas.js';
import { buildSkyTimelineSync } from './sky-dynamics.js';
import { startOfZonedDay } from './time.js';
import { easter } from './cultural-calendars.js';
import { isoDate } from './calendar.js';
import { signOf } from './astro.js';

export const NEWTON_ENGINE_VERSION = 1;
export const NEWTON_ENGINE_LIMITS = Object.freeze({ minimumArithmeticCEYear: 1, maximumArithmeticCEYear: 9999, minimumExplorationYear: 1900, maximumExplorationYear: 2100, maximumSurveyDays: 366 });
const ENGINE_SOURCES = [
  { id: 'NC-METHODS', title: 'Newton chronology: arithmetic, calendar assumptions and inference limits', url: 'docs/2026-10-newton-chronology-methods.md', source: 'Project-authored Newton chronology method and inference limits, October 2026.', claimType: 'project-method', readingStatus: 'Modern implementation and method explanation; not a newly discovered Newton or Tesla calculation.' },
  { id: 'NC-CIVIL', title: 'Canonical calendar and local-clock boundary implementations', url: 'assets/js/core/calendar.js', source: 'Project calendar arithmetic and IANA local-clock boundary implementations, assets/js/core/calendar.js and assets/js/core/time.js; reused with inherited validation limits, October 2026.', claimType: 'calculated-civil-convention', readingStatus: 'Existing calendar arithmetic and local-time engines reused with their original qualifications.' },
];
const LIMITATIONS = [
  'Historical theological chronology, integer arithmetic, astronomical calculation and civil-calendar conversion are different claim types. Arithmetic agreement does not establish a religious or historical outcome.',
  'Newton supplies no exact day or clock for the conditional 2060 bound. Every modern exploration date, time, observer and zone is an explicitly selected study assumption, not a recovered prophecy instant.',
  'A symbolic 360-day year and day-to-year interpretation are theological conventions, not an equality between 1260 elapsed solar days and 1260 physical years.',
  'Calendars label a supplied instant. Agreement among those labels cannot identify a belief, establish a cause or independently corroborate the premise that selected the year.',
  'Daily survey rows are point samples. Label/sign changes are first observed changes between samples, not exact transition searches or full-day qualities.',
  'Only two named Easter/Pascha computus projections are supplied as observance examples. No published 2060 community schedule, complete holiday calendar, exact ritual start or religious authority is inferred.',
  'Future IANA offsets follow this runtime’s present time-zone rules; later legislation can change local clocks. Canonical astronomy approximates UTC and UT1 and uses its inherited TT/ΔT model. Solver digits do not establish exact future observational timing.',
];
const FRAME_KEYS = ['date', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation', 'includeCatalogStars'];
const SURVEY_KEYS = ['year', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation'];
const CALENDAR_IDS = ['gregory', 'julian', 'hebrew', 'islamic-civil', 'islamic-umalqura', 'chinese', 'buddhist', 'indian', 'persian', 'coptic', 'ethiopic', 'japanese', 'roc'];
const copy = value => JSON.parse(JSON.stringify(value));
const mergedSources = (...lists) => copy([...new Map(lists.flat().map(source => [source.id, source])).values()]);
function fields(raw, allowed, label) {
  if (!raw || typeof raw !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(raw))) throw new TypeError(label + ' must be a plain object.');
  if (Reflect.ownKeys(raw).some(key => !allowed.includes(key))) throw new RangeError('Unknown ' + label + ' field.');
  const result = Object.create(null);
  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(raw))) {
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError(label + ' fields must be ordinary enumerable data properties.');
    result[key] = descriptor.value;
  }
  return result;
}
function integer(value, min, max, label) { if (!Number.isInteger(value) || value < min || value > max) throw new RangeError(label + ` must be an integer from ${min} through ${max}.`); return value; }
function scenarioIds(value, allowed) {
  if (value === undefined) return [...allowed];
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) throw new TypeError('Scenario identifiers must be an ordinary JSON array.');
  const descriptors = Object.getOwnPropertyDescriptors(value), length = descriptors.length.value;
  integer(length, 1, allowed.length, 'Scenario selection length');
  if (Reflect.ownKeys(value).some(key => key !== 'length' && (typeof key !== 'string' || !/^(0|[1-9]\d*)$/.test(key) || Number(key) >= length))) throw new TypeError('Scenario identifier arrays cannot carry undeclared properties.');
  const result = [];
  for (let index = 0; index < length; index++) { const d = descriptors[index]; if (!d || !d.enumerable || !Object.hasOwn(d, 'value') || typeof d.value !== 'string' || !allowed.includes(d.value)) throw new TypeError('Scenario identifiers must be known ordinary string values.'); result.push(d.value); }
  if (new Set(result).size !== result.length) throw new RangeError('Choose each sourced scenario only once.');
  return result;
}
function assumedRequest(raw, survey = false) {
  const r = fields(raw, survey ? SURVEY_KEYS : FRAME_KEYS, survey ? 'year survey' : 'exploration');
  if (!['reject', 'earlier', 'later'].includes(r.disambiguation)) throw new RangeError('Supply an explicit reject, earlier or later repeated-clock policy.');
  let startDate, endDate;
  if (survey) { const year = integer(r.year, 1900, 2100, 'Survey year'); startDate = `${year}-01-01`; endDate = `${year}-12-31`; }
  else { if (typeof r.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) throw new TypeError('Select an explicit Gregorian exploration date; Newton did not supply a day.'); startDate = r.date; endDate = r.date; }
  const request = normalizeCalendarTimelineRequest({ startDate, endDate, time: r.time, timeZone: r.timeZone, lat: r.lat, lon: r.lon, system: r.system, disambiguation: r.disambiguation, includeCatalogStars: survey ? false : r.includeCatalogStars, includeGuidance: false });
  return { request, publicRequest: { ...(survey ? { year: r.year } : { date: r.date }), time: request.time, timeZone: request.timeZone, lat: request.lat, lon: request.lon, system: request.system, disambiguation: request.disambiguation, ...(!survey ? { includeCatalogStars: request.includeCatalogStars } : {}) } };
}
function assumption(request) {
  return { kind: 'explicit-modern-exploration-assumption', selectedDate: request.date ?? null, selectedYear: request.year ?? Number(request.date.slice(0, 4)), selectedLocalTime: request.time, observer: { lat: request.lat, lon: request.lon, timeZone: request.timeZone },
    newtonSuppliedDay: false, newtonSuppliedClock: false, historicalEventInstant: false, datePrecision: request.year === undefined ? 'user-selected-day' : 'user-selected-year-daily-samples', eventOutcomePrediction: false,
    label: request.year === undefined ? 'Explicitly assumed study date and local clock; not a date or instant supplied by Newton.' : 'Explicitly selected study year sampled on every civil date at the assumed local clock; no day or instant is supplied by Newton.' };
}
function scenarioCalculation(scenario) {
  const anchor = integer(scenario.anchor?.year, 1, 9999, 'Sourced CE anchor year'), period = integer(scenario.periodYears, 1, 9999, 'Sourced interpreted period in years');
  const calculated = integer(anchor + period, 1, 9999, 'Calculated terminal CE year');
  const reported = integer(scenario.resultYear, 1, 9999, 'Reported terminal CE year');
  if (!['not-before', 'not-after', 'conditional-year'].includes(scenario.bound)) throw new RangeError('The sourced scenario needs an explicit directional or conditional bound.');
  const steps = [];
  if (period === 1260) {
    steps.push({ id: 'symbolic-months', expression: '42 × 30 = 1260', operands: [42, 30], result: 1260, inputUnits: ['symbolic months', 'symbolic days per month'], outputUnit: 'symbolic days', claimType: 'historical-interpretive-convention' });
    steps.push({ id: 'equivalent-symbolic-years', expression: '3.5 × 360 = 1260', operands: [3.5, 360], result: 1260, inputUnits: ['symbolic years', 'symbolic days per year'], outputUnit: 'symbolic days', claimType: 'equivalent-modern-arithmetic-display', note: 'Equivalent representation of the stated symbolic calendar, not an astronomical solar-year measurement.' });
  }
  steps.push({ id: 'day-year-interpretation', expression: `${period} symbolic days → ${period} interpreted years`, input: period, inputUnit: 'symbolic days', result: period, outputUnit: 'interpreted years', claimType: 'theological-interpretive-premise', physicalUnitConversion: false });
  steps.push({ id: 'anchor-addition', expression: `${anchor} + ${period} = ${calculated}`, operands: [anchor, period], result: calculated, outputUnit: 'CE year number', claimType: 'conditional-integer-arithmetic' });
  return { ...copy(scenario), derivation: { steps, computedYear: calculated, sourceYear: reported, arithmeticAgreement: calculated === reported, differenceYears: calculated - reported, sourceExpression: scenario.arithmetic?.expression ?? null, yearNumbering: 'Positive CE year labels only; no year zero or inferred BCE anchor.' },
    interval: { precision: 'year-bound', lowerInclusiveCEYear: scenario.bound === 'not-before' ? reported : null, upperInclusiveCEYear: scenario.bound === 'not-after' ? reported : null, conditionalCEYear: scenario.bound === 'conditional-year' ? reported : null, exactDate: null, exactInstantUTC: null },
    explorationSupport: { resultYearWithinCanonicalRange: reported >= 1900 && reported <= 2100, minimumYear: 1900, maximumYear: 2100, automaticallySelectedDate: null },
    sensitivity: [-1, 0, 1].filter(delta => anchor + delta >= 1 && anchor + delta + period <= 9999).map(delta => ({ anchorShiftYears: delta, assumedAnchorCEYear: anchor + delta, calculatedCEYear: calculated + delta, historicalClaim: delta === 0, scope: delta === 0 ? 'Sourced conditional arithmetic' : 'Modern sensitivity probe, not an alternative anchor asserted by Newton' })),
  };
}

/** Only source-verified machine scenarios are calculated. Textual variants stay textual. */
export function buildNewtonChronology(raw = {}) {
  const r = fields(raw, ['scenarioIds'], 'chronology selection');
  const allIds = NEWTON_CHRONOLOGY_SCENARIOS.map(s => s.id), ids = scenarioIds(r.scenarioIds, allIds);
  const scenarios = NEWTON_CHRONOLOGY_SCENARIOS.filter(s => ids.includes(s.id)).map(scenarioCalculation);
  return { schemaVersion: NEWTON_ENGINE_VERSION, kind: 'source-bound-newton-chronology', scenarios, textualVariants: copy(NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS), sourceCoverage: copy(NEWTON_CHRONOLOGY_LIMITS),
    method: 'Reproduce conditional positive-CE year arithmetic while retaining direction, source wording, unresolved textual variants and interpretive units.',
    identifiability: { kind: 'modern-method-check', observed: 'Civil date labels and astronomical positions at a supplied instant', latentClaim: 'Whether a theological or eschatological interpretation is true', identifiableFromCalendarLabels: false,
      nullControl: 'Hold the instant, zone and calendar method fixed while changing the belief attributed to that instant. The calculated labels do not change because belief is not an input to the converter.',
      sensitivityControl: 'Shift a chosen anchor by one year: the conditional arithmetic endpoint shifts by one year. This exposes dependence on the anchor; it does not validate either anchor.',
      missingTest: 'A specific observable event, independently fixed success/failure criteria and evidence outside the date-selection process would be needed to test an outcome claim.',
      attribution: 'Modern inference and falsifier exercise inspired by explicit-assumption testing; no Tesla occult-physics law or Newton experimental validation is asserted.', sourceIds: ['NC-METHODS'] },
    sources: mergedSources(NEWTON_CHRONOLOGY_SOURCES, ENGINE_SOURCES), limitations: [...LIMITATIONS],
  };
}
function projectedEaster(year) {
  return ['gregorian', 'julian'].map(method => {
    const result = easter(year, method), date = isoDate(result.gregorian.y, result.gregorian.m, result.gregorian.d);
    return { id: `newton-${year}-${method}-computus`, date, title: method === 'gregorian' ? 'Easter — Gregorian computus projection' : 'Pascha — Julian computus projection', status: 'calculated-convention', kind: 'projected-observance-example',
      method: `Canonical ${method} ecclesiastical computus, displayed on the Gregorian civil calendar.`, nativeDate: copy(result.native), nativeCalendar: method, referenceYear: year,
      publishedCommunitySchedule: false, boundary: 'date-only; no local ceremony or ritual start calculated', exactStartUTC: null, exactEndUTC: null, sourceIds: ['ATLAS-COMPUTUS', 'OBS-CALENDAR'],
      limitations: ['Named computus example; selected inherited fixtures do not verify a published schedule for this future year.', 'No claim that every Christian community follows this convention. No wider feast calendar is extrapolated.'] };
  });
}
function observanceCoverage(year) { return { year, implemented: ['Gregorian Easter computus projection', 'Julian Pascha computus projection'], publishedSchedules: 'unavailable-for-this-study', otherReligiousObservances: 'unavailable',
  reason: 'The existing source-verified observance catalogue is bounded to 2026–2031 and is not extrapolated here. Calendar month transitions are labels, not religious holidays.', sourceIds: ['NC-METHODS'] }; }
function referencedSources(value, sources) {
  const ids = new Set();
  const walk = object => { if (!object || typeof object !== 'object') return; if (Array.isArray(object.sourceIds)) object.sourceIds.forEach(id => ids.add(id)); for (const [key, child] of Object.entries(object)) if (key !== 'sources') walk(child); };
  walk(value); return mergedSources(sources).filter(source => ids.has(source.id));
}

/** A modern sample remains separate from historical conditional-year arithmetic. */
export function buildNewtonExplorationFrame(raw) {
  const { request, publicRequest } = assumedRequest(raw), canonical = buildCalendarTimelineFrame(request, 0);
  const { guidance, guidanceStatus, purposes, studyTasks, ...frame } = canonical;
  const year = Number(publicRequest.date.slice(0, 4));
  const result = { ...frame, kind: 'newton-assumed-calendar-sky-frame', explorationRequest: publicRequest, assumption: assumption(publicRequest),
    projectedObservances: projectedEaster(year), observanceCoverage: observanceCoverage(year),
    scope: { calendarRows: frame.comparison?.calendars.length ?? 0, geocentricBodies: frame.sky?.bodies.length ?? 0, historicalYearClaimApplied: false, outcomeScoreCalculated: false },
    limitations: [...LIMITATIONS, ...frame.limitations],
  };
  result.sources = referencedSources(result, mergedSources(frame.sources, ENGINE_SOURCES, ATLAS_SOURCES, OBSERVATORY_SOURCES));
  return result;
}

const calendarFields = row => row.parts.filter(p => ['era', 'year', 'relatedYear', 'yearName', 'month'].includes(p.type)).map(p => ({ type: p.type, value: p.value }));
function actualYearBoundary(year, timeZone) {
  // Like the canonical civil-day boundary helper, allow a bounded date-line
  // skip. Missing dates contribute no instants, but remain in the survey grid.
  for (let day = 1; day <= 3; day++) {
    try { return +startOfZonedDay(`${year}-01-${String(day).padStart(2, '0')}`, timeZone); }
    catch (error) { if (error.code !== 'NONEXISTENT_DATE') throw error; }
  }
  throw new RangeError('Could not establish the first actual civil-day boundary of the selected year.');
}
function fullYearAstronomy(year, timeZone) {
  const requestedStart = actualYearBoundary(year, timeZone), requestedEnd = actualYearBoundary(year + 1, timeZone) - 1;
  const start = Math.max(requestedStart, Date.parse('1900-01-01T00:00:00Z')), end = Math.min(requestedEnd, Date.parse('2100-12-31T23:59:59.999Z'));
  const timeline = buildSkyTimelineSync({ startISO: new Date(start).toISOString(), endISO: new Date(end).toISOString(), timeZone, bodyIds: ['Sun', 'Moon'], stepDays: 365, includeEvents: true }, { maxSamples: 3, maxEvents: 80 });
  return { status: 'available', startISO: timeline.request.startISO, endISO: timeline.request.endISO, requestedStartISO: new Date(requestedStart).toISOString(), requestedEndISO: new Date(requestedEnd).toISOString(), clippedToSupportedUTC: start !== requestedStart || end !== requestedEnd,
    events: timeline.events, eventTypes: timeline.sampling.eventTypes, timing: timeline.sampling.eventTiming, sourceIds: ['SKY-ASTRONOMY', 'SKY-HORIZONS'], limitations: timeline.limitations, sources: timeline.sources };
}

/** Browser-worker survey: all civil dates, all calendar slots, no result ranking. */
export function buildNewtonYearSurvey(raw) {
  const { request, publicRequest } = assumedRequest(raw, true), grid = buildCalendarTimelineGrid(request), rows = [], calendarChanges = [], signChanges = [], previous = new Map(), coverage = new Map();
  let priorSigns = null, canonicalSources = [];
  for (const slot of grid.slots) {
    if (slot.status !== 'available') {
      const calendars = CALENDAR_IDS.map(id => ({ id, label: ATLAS_VARIANTS.find(v => v.calendarId === id).label, status: 'unavailable', text: slot.reason, parts: [], boundary: 'civil-midnight', sourceIds: ['OBS-CALENDAR'], validation: 'Not calculated: selected local sample clock is unresolved or outside supported UTC coverage.' }));
      rows.push({ index: slot.index, date: slot.localDate, status: slot.status, code: slot.code, reason: slot.reason, dateISO: slot.selectedDateISO, slot: copy(slot), calendars, astronomy: null, signs: null });
      continue;
    }
    const comparison = compareMoment({ dateISO: slot.selectedDateISO, lat: request.lat, lon: request.lon, timeZone: request.timeZone, system: request.system, prayerMethod: request.prayerMethod, asr: request.asr, highLatitude: request.highLatitude });
    if (!canonicalSources.length) canonicalSources = comparison.sources;
    const calendars = comparison.calendars.map(c => ({ id: c.id, label: c.label, status: c.status, text: c.text, parts: copy(c.parts), boundary: c.boundary, sourceIds: [...c.sourceIds], validation: c.validation }));
    const a = comparison.astronomy, signs = { tropicalSun: signOf(a.sunLongitude), tropicalMoon: signOf(a.moonLongitude), siderealSun: { longitude: comparison.vedic.sun.longitude, sign: comparison.vedic.sun.sign }, siderealMoon: { longitude: comparison.vedic.moon.longitude, sign: comparison.vedic.moon.sign } };
    rows.push({ index: slot.index, date: slot.localDate, status: 'available', code: null, reason: null, dateISO: slot.selectedDateISO, slot: copy(slot), calendars,
      astronomy: { sunLongitude: a.sunLongitude, moonLongitude: a.moonLongitude, moonSunElongation: a.moonSunElongation, moonIlluminatedFraction: a.moonIlluminatedFraction, phaseLabel: a.phaseLabel, julianDayUTC: a.julianDayUTC, sourceIds: a.sourceIds }, signs,
      panchanga: copy(comparison.vedic.panchanga), ayanamsha: copy(comparison.vedic.ayanamsha) });
    for (const c of calendars) {
      if (!coverage.has(c.id)) coverage.set(c.id, { calendarId: c.id, label: c.label, availableSamples: 0, unavailableSamples: 0, labels: new Set(), periods: new Map(), initialFields: null, initialDate: null, transitionCount: 0 });
      const stats = coverage.get(c.id);
      if (c.status !== 'available') { stats.unavailableSamples++; continue; }
      stats.availableSamples++; stats.labels.add(c.text);
      const currentFields = calendarFields(c), signature = JSON.stringify(currentFields), earlier = previous.get(c.id);
      if (!stats.initialFields) { stats.initialFields = copy(currentFields); stats.initialDate = slot.localDate; }
      if (!stats.periods.has(signature)) stats.periods.set(signature, { fields: copy(currentFields), firstDate: slot.localDate, lastDate: slot.localDate, firstIndex: slot.index, lastIndex: slot.index, observedSamples: 0 });
      const period = stats.periods.get(signature); period.lastDate = slot.localDate; period.lastIndex = slot.index; period.observedSamples++;
      if (earlier && earlier.signature !== signature) { calendarChanges.push({ calendarId: c.id, date: slot.localDate, index: slot.index, previousDate: earlier.date, previousIndex: earlier.index, previousFields: earlier.fields, currentFields: copy(currentFields), continuousPreviousSample: earlier.index === slot.index - 1, precision: 'first-observed-daily-sample', religiousObservance: false }); stats.transitionCount++; }
      previous.set(c.id, { signature, fields: copy(currentFields), date: slot.localDate, index: slot.index });
    }
    const names = { tropicalSun: signs.tropicalSun.name, tropicalMoon: signs.tropicalMoon.name, siderealSun: signs.siderealSun.sign, siderealMoon: signs.siderealMoon.sign };
    if (priorSigns) for (const [bodyFrame, value] of Object.entries(names)) if (priorSigns.names[bodyFrame] !== value) signChanges.push({ bodyFrame, date: slot.localDate, index: slot.index, previousDate: priorSigns.date, previousSign: priorSigns.names[bodyFrame], currentSign: value, continuousPreviousSample: priorSigns.index === slot.index - 1, precision: 'first-observed-daily-sample; not an ingress instant' });
    priorSigns = { names, date: slot.localDate, index: slot.index };
  }
  const unavailableClocks = rows.filter(r => r.status !== 'available').length;
  const surveyCoverage = [...coverage.values()].map(({ labels, periods, ...c }) => ({ ...c, unavailableSamples: c.unavailableSamples + unavailableClocks, uniqueDateLabelsCount: labels.size, uniqueMonthYearLabels: [...periods.values()] }));
  const astronomicalEvents = fullYearAstronomy(publicRequest.year, request.timeZone);
  const result = { schemaVersion: NEWTON_ENGINE_VERSION, kind: 'newton-assumed-year-calendar-survey', request: publicRequest, assumption: assumption(publicRequest), rows, calendarChanges, signChanges, coverage: surveyCoverage,
    counts: { totalDates: rows.length, availableSamples: rows.length - unavailableClocks, unavailableSamples: unavailableClocks, calendarSlots: rows.length * 13, calculatedCalendarRows: (rows.length - unavailableClocks) * 13, availableCalendarRows: rows.reduce((sum, row) => sum + row.calendars.filter(c => c.status === 'available').length, 0), calendarChanges: calendarChanges.length, signChanges: signChanges.length, truncated: false },
    astronomicalEvents, projectedObservances: projectedEaster(publicRequest.year), observanceCoverage: observanceCoverage(publicRequest.year),
    sampling: { grid: 'Every Gregorian civil date in the requested observer year, at the explicitly chosen local clock.', leapYear: rows.length === 366, fixedElapsedUTCStep: false, exactSignTransitionsSearched: false, exactCalendarMonthBoundariesSearched: false, calendarChangesAreObservances: false, outcomeScoreCalculated: false },
    sources: mergedSources(canonicalSources, astronomicalEvents.sources, ENGINE_SOURCES, ATLAS_SOURCES), limitations: [...LIMITATIONS],
  };
  result.sources = referencedSources(result, result.sources);
  return result;
}

export function exportNewtonExplorationJSON(raw) { return JSON.stringify(buildNewtonExplorationFrame(raw), null, 2) + '\n'; }
export function exportNewtonYearSurveyJSON(raw) { return JSON.stringify(buildNewtonYearSurvey(raw), null, 2) + '\n'; }
function csvCell(value) { let s = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value); if (typeof value !== 'number' && (/^\s*[=+@-]/.test(s) || /^[\t\r\n]/.test(s))) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
const csv = rows => rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
/** Serialization only: emit an already calculated frame without recomputing or
 * authenticating it. Use exportNewtonExplorationCSV for strict raw requests. */
export function serializeNewtonExplorationCSV(frame) {
  const rows = [['recordType', 'date', 'dateISO', 'timeZone', 'id', 'status', 'value', 'sourceIds', 'scope']];
  const add = (kind, id, status, value, sourceIds = [], scope = '') => rows.push([kind, frame.explorationRequest.date, frame.slot.selectedDateISO, frame.explorationRequest.timeZone, id, status, value, sourceIds, scope]);
  add('assumed-sample', 'sample', frame.status, frame.assumption, ['NC-METHODS'], frame.slot.reason);
  add('calculation-context', 'context', frame.status, frame.explorationRequest, [], 'Explicit user-selected date, local clock, observer and house convention.');
  for (const row of frame.comparison?.calendars || []) add('civil-calendar', row.id, row.status, { text: row.text, parts: row.parts }, row.sourceIds, row.limitations);
  for (const body of frame.sky?.bodies || []) add('sky-body', body.id, 'available', body, ['SKY-ASTRONOMY'], body.frame);
  if (frame.charts) for (const [kind, chart] of Object.entries(frame.charts)) add('chart', kind, chart.status, chart, chart.sourceIds, chart.limitations);
  for (const row of frame.projectedObservances) add('computus-projection', row.id, row.status, row, row.sourceIds, row.limitations);
  for (const source of frame.sources) add('source', source.id, 'source-record', source);
  add('limits', 'limits', 'qualified', frame.limitations);
  return csv(rows);
}
export function exportNewtonExplorationCSV(raw) { return serializeNewtonExplorationCSV(buildNewtonExplorationFrame(raw)); }
export function exportNewtonYearSurveyCSV(raw) {
  const survey = buildNewtonYearSurvey(raw), rows = [['recordType', 'date', 'dateISO', 'timeZone', 'index', 'id', 'status', 'value', 'scope']];
  for (const row of survey.rows) {
    rows.push(['sample', row.date, row.dateISO, survey.request.timeZone, row.index, '', row.status, { astronomy: row.astronomy, signs: row.signs, reason: row.reason, code: row.code }, survey.assumption.label]);
    for (const c of row.calendars) rows.push(['civil-calendar', row.date, row.dateISO, survey.request.timeZone, row.index, c.id, c.status, { text: c.text, parts: c.parts }, c.validation]);
  }
  for (const event of survey.astronomicalEvents.events) rows.push(['solved-astronomical-event', event.localDate, event.dateISO, survey.request.timeZone, '', event.kind, 'calculated', event, survey.astronomicalEvents.timing]);
  for (const event of survey.projectedObservances) rows.push(['computus-projection', event.date, '', survey.request.timeZone, '', event.id, event.status, event, event.limitations]);
  for (const source of survey.sources) rows.push(['source', '', '', '', '', source.id, 'source-record', source, 'Inherited reading and validation qualifications retained.']);
  return csv(rows);
}
