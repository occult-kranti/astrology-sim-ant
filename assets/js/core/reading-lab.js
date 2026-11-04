// Pure, bounded comparison of named calculations and source-worked examples.
// No clock, storage, network, outcomes score, or inferred birth time.
import { civilFields, resolveZonedTime, startOfZonedDay, zonedCivilDay } from './time.js';
import { parseExplicitInstant, HOUSE_SYSTEMS } from './instant-boundary.js';
import { validateZone, validateLocation, calendarAtInstant, calendarSupported, easter } from './cultural-calendars.js';
import { gregorianToJDN, isoDate } from './calendar.js';
import { castChart, signOf, norm360 } from './astro.js';
import { castVedic, panchangaFromLongitudes } from './vedic.js';
import { jungianReading } from './jung.js';
import { essentialDignity } from './dignities.js';
import { allAspects } from './aspects.js';
import { chartFromPositions } from './chart-from-positions.js';
import { compareLillySolarConventions } from './sky-interpretation.js';
import { WORKED_CHARTS } from './data/worked-charts.js';
import { READING_CASES } from './data/reading-cases.js';

const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const CLASSICAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
export const READING_FRAMEWORKS = freeze([
  { id: 'egyptian', label: 'Egyptian / Coptic study', kind: 'calendar', implemented: 'partial', method: 'Coptic civil conversion; ancient Egyptian calendars remain source study', limits: ['Coptic dates are not ancient Egyptian horoscopes. No ancient civil epoch or lunar reconstruction is selected.'] },
  { id: 'mayan', label: 'Maya calendar arithmetic', kind: 'calendar', implemented: 'calculated', method: 'Long Count, Tzolk’in and Haab’; GMT correlation 584283; selected civil date', limits: ['Civil midnight is this study’s display boundary, not a universal ancient or present-day Maya ritual rule. No personality horoscope or apocalypse prediction.', 'Day and month names use selected transliterations; spellings and community naming conventions differ. The independent worked fixture covers its listed fields, not every historical date or community practice.'] },
  { id: 'dee', label: 'John Dee / textual method', kind: 'textual', implemented: 'textual-only', method: 'Source passage and symbolic-method comparison', limits: ['No universal Dee natal or predictive calendar algorithm is implemented.'] },
  { id: 'lilly', label: 'Historical Western / Christian calendars', kind: 'astrology-and-computus', implemented: 'partial', method: 'Tropical chart with named houses; Christian Gregorian/Julian computus is a separate method', limits: ['Lilly’s title is historical, not authority for all Christian beliefs. A moment chart is neither a birth chart nor a complete horary judgment.'] },
  { id: 'vedic', label: 'Jyotiṣa / Vedic study', kind: 'astrology', implemented: 'partial', method: 'Linear Lahiri approximation, whole-sign houses and canonical instantaneous pañcāṅga', limits: ['Regional festivals and month conventions are unimplemented; no personal daśā or remedy is inferred from a study moment.'] },
  { id: 'chinese', label: 'Chinese civil calendar', kind: 'calendar', implemented: 'partial', method: 'Named Intl Chinese civil calendar with leap-month label', limits: ['A civil conversion is not BaZi, Zi Wei Dou Shu, a Tong Shu election, or all Chinese traditions.'] },
  { id: 'hebrew', label: 'Hebrew civil calendar', kind: 'calendar', implemented: 'partial', method: 'Named Intl Hebrew date with selected-zone civil-midnight boundary', limits: ['Sunset religious dates, Israel/diaspora observance policies and Kabbalistic prescriptions are not computed.'] },
  { id: 'jung', label: 'Jung / symbolic reflection', kind: 'reflection', implemented: 'reflection', method: 'Textual reflection; optional explicitly post-Jungian elemental tally', limits: ['The element-to-function mapping is largely post-Jungian. It does not diagnose personality, mental health or unconscious contents.'] },
  { id: 'plato', label: 'Plato / philosophical reflection', kind: 'reflection', implemented: 'textual-only', method: 'Source passages on choice and daimon as philosophical study', limits: ['No numerical Platonic natal calendar or proof of a personal supernatural entity is inferred.'] },
]);
const IDS = READING_FRAMEWORKS.map(row => row.id);
export const READING_PURPOSES = freeze(['study', 'planning', 'work', 'relationships', 'reflection']);
const LIMITS = [
  'Calculable dates and chart geometry can be checked against references; symbolic interpretations and life outcomes cannot be validated by a field match.',
  'Shared sky inputs are mathematical dependencies, not independent corroboration. Unlike methods are not combined into a universal good/bad score.',
  'Astrology has no demonstrated predictive validity. Conditional examples invite ordinary observation and reflection, not predictions or consequential prescriptions.',
  'Public examples are source-worked or arithmetic teaching cases. No private birth profile is bundled or inferred.',
];
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
function objectKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`${label} must be a plain object.`);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string' || !allowed.includes(key) || !own(Object.getOwnPropertyDescriptor(value, key), 'value')) throw new TypeError(`Unknown or non-data ${label} field: ${String(key)}.`);
  }
}
function selectedFrameworks(value) {
  if (value === undefined) return [...IDS];
  if (!denseDataArray(value, 1, IDS.length) || value.some(id => !IDS.includes(id)) || new Set(value).size !== value.length) throw new RangeError('Select 1–9 distinct supported framework IDs.');
  return [...value];
}
function denseDataArray(value, min, max) {
  return Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype && value.length >= min && value.length <= max && Reflect.ownKeys(value).length === value.length + 1 && Array.from({ length: value.length }, (_, index) => Object.getOwnPropertyDescriptor(value, String(index))).every(d => d && own(d, 'value'));
}

/** Strict request boundary. Case IDs and source longitude examples belong to
 * evaluateReadingCase, never to caller-supplied calculated facts. */
export function normalizeReadingLabInputs(input) {
  objectKeys(input, ['dateISO', 'instantISO', 'time', 'timeZone', 'lat', 'lon', 'disambiguation', 'system', 'frameworks', 'purpose'], 'reading input');
  const timeZone = validateZone(input.timeZone);
  const frameworks = selectedFrameworks(input.frameworks);
  const system = input.system ?? 'regiomontanus', disambiguation = input.disambiguation ?? 'reject', purpose = input.purpose ?? 'study';
  if (!HOUSE_SYSTEMS.includes(system)) throw new RangeError('Choose a supported house system.');
  if (!['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose reject, earlier or later for repeated local clocks.');
  if (!READING_PURPOSES.includes(purpose)) throw new RangeError('Choose a supported study purpose.');
  if (own(input, 'lat') !== own(input, 'lon')) throw new RangeError('Provide both latitude and longitude, or omit both.');
  if (own(input, 'lat')) validateLocation(input.lat, input.lon);
  const out = { timeZone, system, disambiguation, frameworks, purpose };
  if (own(input, 'lat')) Object.assign(out, { lat: input.lat, lon: input.lon });
  if (own(input, 'instantISO')) {
    if (own(input, 'dateISO') || own(input, 'time')) throw new RangeError('Supply an exact instant or a local date/clock, not both.');
    const date = parseExplicitInstant(input.instantISO);
    out.instantISO = date.toISOString();
    const y = date.getUTCFullYear(), localY = Number(new Intl.DateTimeFormat('en', { timeZone, year: 'numeric' }).format(date));
    if (y < 1900 || y > 2100 || localY < 1900 || localY > 2100) throw new RangeError('Exact reading moments support UTC and local years 1900–2100.');
  } else {
    if (typeof input.dateISO !== 'string' || !/^(?:\d{4}|[+-]\d{6})-\d{2}-\d{2}$/.test(input.dateISO) || input.dateISO.startsWith('-000000')) throw new RangeError('Use a valid ISO Gregorian civil date; BCE uses astronomical signed years.');
    const fields = civilFields(input.dateISO, input.time ?? '00:00');
    out.dateISO = input.dateISO;
    const mayaOnly = frameworks.length === 1 && frameworks[0] === 'mayan' && !own(input, 'time');
    if (mayaOnly) {
      const jdn = gregorianToJDN(fields.year, fields.month, fields.day);
      if (jdn < 584283 || fields.year > 9999) throw new RangeError('Isolated Maya arithmetic supports the GMT epoch −003113-08-11 through 9999-12-31.');
    } else if (fields.year < 1900 || fields.year > 2100) throw new RangeError('Common-frame readings support civil years 1900–2100. Select Maya alone without a clock for its separate epoch arithmetic.');
    if (own(input, 'time')) {
      if (typeof input.time !== 'string' || !/^\d{2}:\d{2}(?::\d{2})?$/.test(input.time)) throw new RangeError('Use an explicit HH:mm or HH:mm:ss clock, or omit it for date-only study.');
      const resolved = resolveZonedTime(input.dateISO, input.time, timeZone, { disambiguation });
      if (resolved.instant.getUTCFullYear() < 1900 || resolved.instant.getUTCFullYear() > 2100) throw new RangeError('The resolved UTC instant must lie within 1900–2100.');
      out.time = input.time;
    } else if (fields.year >= 1900 && fields.year <= 2100) startOfZonedDay(input.dateISO, timeZone); // rejects skipped civil dates
  }
  return out;
}

const TZOLKIN = ['Imix', 'Ik’', 'Ak’bal', 'K’an', 'Chikchan', 'Kimi', 'Manik’', 'Lamat', 'Muluk', 'Ok', 'Chuwen', 'Eb’', 'B’en', 'Ix', 'Men', 'K’ib’', 'Kab’an', 'Etz’nab’', 'Kawak', 'Ajaw'];
const HAAB = ['Pop', 'Wo’', 'Sip', 'Sotz’', 'Sek', 'Xul', 'Yaxk’in', 'Mol', 'Ch’en', 'Yax', 'Sak’', 'Keh', 'Mak', 'K’ank’in', 'Muwan', 'Pax', 'K’ayab', 'Kumk’u', 'Wayeb’'];
/** GMT 584283 is the integer JDN of the epoch's civil day. JDN's astronomical
 * noon convention is not treated as a Maya ritual midnight. */
export function calculateMayaDate(dateISO) {
  if (typeof dateISO !== 'string' || !/^(?:\d{4}|[+-]\d{6})-\d{2}-\d{2}$/.test(dateISO) || dateISO.startsWith('-000000')) throw new RangeError('Use an ISO Gregorian civil date with astronomical year numbering.');
  const f = civilFields(dateISO), jdn = gregorianToJDN(f.year, f.month, f.day), days = jdn - 584283;
  if (days < 0 || f.year > 9999) throw new RangeError('Maya arithmetic supports GMT epoch −003113-08-11 through 9999-12-31.');
  let remainder = days;
  const units = [144000, 7200, 360, 20, 1].map(unit => { const n = Math.floor(remainder / unit); remainder %= unit; return n; });
  const haabIndex = (days + 348) % 365;
  return { dateISO, jdn, correlation: 584283, correlationName: 'GMT (Goodman–Martínez–Thompson), selected 584283 variant', daysSinceEpoch: days,
    longCount: units.join('.'), units: { baktun: units[0], katun: units[1], tun: units[2], uinal: units[3], kin: units[4] },
    tzolkin: { number: (days + 3) % 13 + 1, name: TZOLKIN[(days + 19) % 20] },
    haab: { day: haabIndex % 20, month: HAAB[Math.floor(haabIndex / 20)], monthIndex: Math.floor(haabIndex / 20) },
    boundary: 'Selected proleptic Gregorian civil date; study convention civil midnight; not a universal Maya ritual boundary',
    epoch: { dateISO: '-003113-08-11', astronomicalYear: -3113, historicalYear: '3114 BCE', longCount: '0.0.0.0.0', tzolkin: '4 Ajaw', haab: '8 Kumk’u' } };
}

function contextOf(input) {
  let instant = null, ambiguous = false, offsetHours = null;
  if (input.instantISO) instant = new Date(input.instantISO);
  else if (input.time) { const r = resolveZonedTime(input.dateISO, input.time, input.timeZone, input); instant = r.instant; ambiguous = r.ambiguous; offsetHours = r.offsetHours; }
  const parts = instant ? Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: input.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(instant).map(p => [p.type, p.value])) : null;
  return { dateISO: parts ? `${parts.year}-${parts.month}-${parts.day}` : input.dateISO, instantISO: instant?.toISOString() ?? null, time: parts ? `${parts.hour}:${parts.minute}:${parts.second}` : null, timeKnown: !!instant, timeZone: input.timeZone, lat: input.lat ?? null, lon: input.lon ?? null, system: input.system, disambiguation: input.disambiguation, ambiguous, offsetHours, purpose: input.purpose,
    inputKind: instant ? 'explicit-moment-study' : 'date-only-study', calendarBoundary: 'selected-zone civil midnight', conversionAnchor: !instant ? 'An instant inside the actual civil date and supported UTC range, used only to request runtime date labels; never a birth clock or chart instant.' : null };
}
function dateLabelAnchor(dateISO, zone) {
  const day = zonedCivilDay(dateISO, zone), low = Math.max(+day.start, Date.UTC(1900, 0, 1)), high = Math.min(+day.end, Date.UTC(2101, 0, 1));
  if (high <= low) throw new RangeError('No supported UTC instant falls within this civil date.');
  return new Date(Math.floor((low + high) / 2));
}
function calendarFacts(date, calendar, timeZone) {
  if (!calendarSupported(calendar)) return { status: 'unavailable', reason: `This runtime does not support ${calendar}.` };
  const result = calendar === 'coptic' ? (() => { const fmt = new Intl.DateTimeFormat('en', { calendar, timeZone, year: 'numeric', month: 'long', day: 'numeric', era: 'short' }); return { supported: true, text: fmt.format(date), parts: fmt.formatToParts(date) }; })() : calendarAtInstant(date, calendar, timeZone);
  if (!result.supported) return { status: 'unavailable', reason: result.text };
  const p = Object.fromEntries(result.parts.map(part => [part.type, part.value]));
  const numericParts = Object.fromEntries(new Intl.DateTimeFormat('en', { calendar, timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date).map(part => [part.type, part.value]));
  const numericMonth = /^(\d+)(bis)?$/.exec(numericParts.month ?? '');
  return { status: 'available', text: result.text, year: p.year ? Number(p.year) : null, month: calendar === 'hebrew' ? p.month : numericMonth ? Number(numericMonth[1]) : null, monthLabel: p.month, day: Number(p.day), relatedYear: p.relatedYear ? Number(p.relatedYear) : null, yearName: p.yearName ?? null, era: p.era ?? null, isLeapMonth: calendar === 'chinese' ? (numericMonth ? !!numericMonth[2] : null) : null, parts: result.parts, boundary: 'civil-midnight', runtime: 'Intl/ICU; selected fixtures do not prove whole-range or observance authority' };
}
function familySources(id) { return [...new Set(READING_CASES.filter(row => row.traditionId === id).flatMap(row => row.sourceIds))]; }
function blankFramework(id) { const def = READING_FRAMEWORKS.find(row => row.id === id); return { ...clone(def), status: ['textual', 'reflection'].includes(def.kind) ? 'textual-only' : 'unavailable', facts: {}, readings: [], sourceIds: familySources(id), limitations: [...def.limits] }; }
function bodyFacts(chart) {
  return Object.fromEntries(CLASSICAL.map(name => { const p = chart.planets[name], sign = signOf(p.lon); return [name, { longitude: p.lon, sign: sign.name, degree: sign.degInSign, house: p.house, retrograde: !!p.retrograde, dignity: essentialDignity(name, p.lon, chart.isDay).rows }]; }));
}
function attachSourceReadings(row, purpose) {
  const examples = READING_CASES.filter(c => c.traditionId === row.id && c.interpretation);
  // Text/source examples remain visible even when no chart is computable, but
  // never pretend the example's condition matched the user's selected moment.
  row.readings = examples.slice(0, 2).map(c => ({ ...clone(c.interpretation), sourceIds: [...c.sourceIds], sourceCaseId: c.id,
    status: ['dee', 'jung', 'plato'].includes(row.id) ? 'reflection' : 'source-method-example',
    condition: c.interpretation.condition ?? 'A public source-method example; not automatically triggered by this selected date.',
    selectedPurpose: purpose, applicability: 'Source explanation only; assess any stated condition separately. Observing usefulness does not establish a cosmic cause.' }));
}

export function calculateReadingLab(rawInput) {
  const inputs = normalizeReadingLabInputs(rawInput), context = contextOf(inputs), frameworks = Object.fromEntries(inputs.frameworks.map(id => [id, blankFramework(id)])), warnings = [];
  const f = civilFields(context.dateISO), modern = f.year >= 1900 && f.year <= 2100;
  if (!modern) warnings.push('Isolated Maya arithmetic uses the supplied proleptic Gregorian civil date. No historical IANA clock, observer chart or ancient ritual-day boundary is reconstructed.');
  const date = context.instantISO ? new Date(context.instantISO) : modern ? dateLabelAnchor(context.dateISO, context.timeZone) : null;
  if (frameworks.mayan) Object.assign(frameworks.mayan, { status: 'available', facts: calculateMayaDate(context.dateISO) });
  for (const [id, calendar] of [['egyptian', 'coptic'], ['chinese', 'chinese'], ['hebrew', 'hebrew']]) if (frameworks[id] && date) {
    const facts = calendarFacts(date, calendar, context.timeZone);
    Object.assign(frameworks[id], { status: facts.status === 'available' ? 'partial' : 'unavailable', facts: id === 'egyptian' ? { coptic: facts, ancientCivil: { status: 'unimplemented' }, ancientLunar: { status: 'unimplemented' } } : facts });
  }
  if (frameworks.lilly) {
    const gregorian = easter(f.year, 'gregorian'), julian = easter(f.year, 'julian');
    const g = gregorian.gregorian, j = julian.gregorian;
    frameworks.lilly.facts.computus = { gregorianEaster: isoDate(g.y, g.m, g.d), julianEasterGregorian: isoDate(j.y, j.m, j.d), method: 'Separate ecclesiastical computus algorithms; Julian result converted to Gregorian display. Not a forecast or a statement for every Christian community.' };
    frameworks.lilly.status = 'partial';
  }
  const chartRequested = ['lilly', 'vedic', 'jung'].some(id => frameworks[id]);
  let chart = null;
  const chartReason = !context.timeKnown ? 'Date-only input: no clock, ascendant, houses or instant pañcāṅga is inferred.' : context.lat === null ? 'Coordinates were not supplied: no located chart or houses are inferred.' : Math.abs(context.lat) === 90 ? 'Ascendant and ordinary houses are undefined at the geographic poles.' : null;
  if (chartRequested && !chartReason) chart = { ...castChart(date, context.lat, context.lon, context.system), timeZone: context.timeZone };
  if (chartReason) for (const id of ['lilly', 'vedic', 'jung']) if (frameworks[id]) frameworks[id].limitations.push(chartReason);
  if (chart?.houseWarning) warnings.push(chart.houseWarning);
  if (chart && frameworks.lilly) {
    frameworks.lilly.status = 'available';
    Object.assign(frameworks.lilly.facts, { chart: { ascendant: chart.asc, midheaven: chart.mc, houses: chart.cusps.slice(1), requestedSystem: context.system, actualSystem: chart.system, houseWarning: chart.houseWarning, isDay: chart.isDay, sectMethod: chart.sectMethod, planets: bodyFacts(chart), dignityMethod: 'Lilly essential-dignity ledger; conventional points are not outcome probabilities or a day rating', aspects: allAspects(Object.fromEntries(CLASSICAL.map(name => [name, chart.planets[name]]))).map(({from,to,aspect,orb,allowance}) => ({from,to,aspect,orb,allowance})), aspectMethod: 'Lilly planetary moieties; geometric proximity only; no inferred event outcome' } });
  }
  if (chart && frameworks.vedic) {
    const v = castVedic(chart, { currentDate: date });
    Object.assign(frameworks.vedic, { status: 'available', facts: { ayanamsha: v.ayanamsa, ayanamshaMethod: 'Linear Lahiri approximation, not exact JHora parity', sunLongitude: v.grahas.Sun.lon, moonLongitude: v.grahas.Moon.lon, elongationDegrees: norm360(chart.planets.Moon.lon - chart.planets.Sun.lon), tithiNumber: v.panchanga.tithi.num, tithiName: v.panchanga.tithi.name, lagna: v.lagna, panchanga: v.panchanga, houseSystem: 'whole' } });
  }
  if (chart && frameworks.jung) {
    const j = jungianReading(chart);
    Object.assign(frameworks.jung, { status: 'reflection', facts: { elementTally: j.elements.tally, tallyMethod: 'Modern post-Jungian teaching convention: Sun/Moon weight 2, five other classical planets weight 1, Ascendant weight 1; total 10', sunMoonAspect: j.coniunctio.aspect, sunMoonOrb: j.coniunctio.orb }, limitations: [...frameworks.jung.limitations, 'No dominant/inferior psychological diagnosis is computed; chart-derived element counts are not measured psychological traits.'] });
  }
  for (const row of Object.values(frameworks)) attachSourceReadings(row, inputs.purpose);
  return { schemaVersion: 1, kind: 'reading-lab', inputs, context, frameworks, warnings, limits: [...LIMITS] };
}

function fieldAt(value, path) {
  if (typeof path !== 'string' || path.length > 180 || !/^[a-zA-Z][\w-]*(?:\.[a-zA-Z0-9][\w-]*)*$/.test(path) || path.split('.').some(k => ['__proto__', 'prototype', 'constructor'].includes(k))) throw new RangeError('Expected fields must be bounded safe own-property paths.');
  return path.split('.').reduce((at, key) => at && typeof at === 'object' && own(at, key) ? at[key] : undefined, value);
}
function sourceCaseResult(c) {
  if (c.input?.workedChartKey) {
    const worked = WORKED_CHARTS.find(row => row.key === c.input.workedChartKey);
    if (!worked) throw new RangeError('Unknown public printed chart.');
    const chart = chartFromPositions(worked.figure), row = blankFramework('lilly');
    const partial = worked.verification?.status === 'partial-source-check';
    row.status = partial ? 'partial-source-reconstruction' : 'source-reconstruction';
    const positions = bodyFacts(chart);
    if (partial) for (const [name, position] of Object.entries(positions)) {
      delete position.house; delete position.dignity; delete position.retrograde;
      position.longitudeVerification = worked.verification.verifiedPlanetLongitudes.includes(name) ? 'printed-field-checked' : 'inherited-unverified';
    }
    row.facts = { chart: { ...(partial ? { verification: clone(worked.verification), withheld: ['Ascendant', 'Midheaven', 'houses', 'sect-dependent dignity', 'motion flags', 'automated judgment'] } : { ascendant: chart.asc, midheaven: chart.mc, cuspApproximation: chart.cuspApprox, houseMethod: 'Printed planet houses retained; missing cusp ring reconstructed as equal houses', speedMethod: 'Canonical mean daily motion when absent from source; no applying/separating verification' }), planets: positions } };
    if (worked.caveats) row.limitations.push(worked.caveats);
    row.limitations.push(c.evaluability.reason, ...(c.interpretation?.limits ?? []));
    return { schemaVersion: 1, kind: 'source-worked-chart', context: { inputKind: 'printed-figure', workedChartKey: worked.key, timeKnown: false, dateNote: worked.dateNote }, frameworks: { lilly: row }, warnings: partial ? [worked.verification.note] : [], limits: [...LIMITS] };
  }
  if (own(c.input ?? {}, 'planetLongitude')) {
    if (c.traditionId !== 'lilly' || ![c.input.planetLongitude, c.input.sunLongitude].every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n < 360)) throw new RangeError('Use registered Lilly source longitudes in [0, 360).');
    const row = blankFramework('lilly'); row.status = 'source-rule-example';
    row.facts = { solarProximity: compareLillySolarConventions(c.input.planetLongitude, c.input.sunLongitude) };
    return { schemaVersion: 1, kind: 'source-solar-example', context: { inputKind: 'source-longitudes', timeKnown: false, frame: 'Printed same-sign positions; no observer, natal clock, or full chart is inferred' }, frameworks: { lilly: row }, limits: [...LIMITS] };
  }
  if (own(c.input ?? {}, 'sunLongitude')) {
    const p = panchangaFromLongitudes(c.input.sunLongitude, c.input.moonLongitude), row = blankFramework('vedic');
    row.status = 'arithmetic-example'; row.facts = { sunLongitude: c.input.sunLongitude, moonLongitude: c.input.moonLongitude, elongationDegrees: norm360(c.input.moonLongitude - c.input.sunLongitude), tithiNumber: p.tithi.num, tithiName: p.tithi.name, panchanga: p };
    return { schemaVersion: 1, kind: 'source-longitude-example', context: { inputKind: 'source-longitudes', timeKnown: false, frame: c.input.frame ?? 'Same declared sidereal frame; no observer or clock' }, frameworks: { vedic: row }, limits: [...LIMITS] };
  }
  if (!c.input?.dateISO && !c.input?.instantISO) return { schemaVersion: 1, kind: 'source-textual-method', context: { inputKind: 'source-text', timeKnown: false }, frameworks: { [c.traditionId]: blankFramework(c.traditionId) }, limits: [...LIMITS] };
  return calculateReadingLab({ ...c.input, frameworks: [c.traditionId] });
}
/** Only registered, authored public cases are executable; arbitrary expected
 * values cannot masquerade as independent reference fixtures. */
function registeredCaseId(caseOrId) {
  const descriptor = caseOrId && typeof caseOrId === 'object' ? Object.getOwnPropertyDescriptor(caseOrId, 'id') : null;
  const id = typeof caseOrId === 'string' ? caseOrId : descriptor && own(descriptor, 'value') ? descriptor.value : null;
  if (typeof id !== 'string' || !READING_CASES.some(row => row.id === id)) throw new RangeError('Choose a registered public reading case.');
  return id;
}
export function evaluateReadingCase(caseOrId) {
  const id = registeredCaseId(caseOrId);
  const c = READING_CASES.find(row => row.id === id);
  if (!c) throw new RangeError('Choose a registered public reading case.');
  const result = sourceCaseResult(c);
  const checks = (c.expected ?? []).map(expected => {
    const actual = fieldAt(result, expected.field), tolerance = expected.tolerance ?? 0;
    if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance < 0) throw new RangeError('Reference tolerances must be nonnegative finite numbers.');
    const match = typeof expected.value === 'number' ? typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - expected.value) <= tolerance : JSON.stringify(actual) === JSON.stringify(expected.value);
    return { ...clone(expected), actual: actual ?? null, tolerance, match, missing: actual === undefined };
  });
  const total = checks.length, matched = checks.filter(row => row.match).length;
  return { caseId: c.id, title: c.title, traditionId: c.traditionId, methodId: c.methodId ?? null, sourceIds: [...c.sourceIds], status: total ? matched === total ? 'reference-fields-match' : 'reference-mismatch' : 'not-numerically-evaluable', checks, matched, total, evaluability: clone(c.evaluability), interpretation: clone(c.interpretation ?? {}), outcomeEvaluable: false, result };
}
export function compareReadingCases(casesOrIds = READING_CASES.map(c => c.id)) {
  if (!denseDataArray(casesOrIds, 1, 24)) throw new RangeError('Compare 1–24 distinct registered public cases.');
  const ids = casesOrIds.map(registeredCaseId);
  if (new Set(ids).size !== ids.length) throw new RangeError('Compare distinct source cases; duplicate IDs would double-count reference fields.');
  const rows = ids.map(evaluateReadingCase);
  return { schemaVersion: 1, kind: 'reading-case-comparison', rows, totalCases: rows.length, casesWithReferenceFields: rows.filter(row => row.total > 0).length, referenceFields: rows.reduce((n, row) => n + row.total, 0), matchedFields: rows.reduce((n, row) => n + row.matched, 0), outcomeEvaluable: false, limits: [...LIMITS, 'Counts describe source-field checks only, not predictive accuracy or full tradition coverage.'] };
}

const brief = (value, max = 320) => typeof value === 'string' ? value.length > max ? `${value.slice(0, max - 1)}…` : value : '';
function compactInterpretation(i) {
  return { rule: brief(i.rule, 440), sourceLocator: brief(i.sourceLocator, 180), applicationBasis: brief(i.applicationBasis, 260),
    scenarios: (i.scenarios ?? []).slice(0, 1).map(v => brief(v, 240)), questions: (i.questions ?? []).slice(0, 1).map(v => brief(v, 180)), actions: (i.actions ?? []).slice(0, 1).map(v => brief(v, 180)), limits: (i.limits ?? []).slice(0, 1).map(v => brief(v, 240)),
    ...(i.sourceIds ? { sourceIds: [...i.sourceIds], sourceCaseId: i.sourceCaseId, status: i.status, applicability: brief(i.applicability, 200) } : {}) };
}
function compactResult(result) {
  const out = clone(result);
  for (const row of Object.values(out.frameworks)) {
    row.readings = row.readings.slice(0, 1).map(compactInterpretation);
    delete row.limits; // The same framework limits are retained in limitations.
  }
  out.exportScope = 'All calculated facts retained. One shortened source-method example per family; full source cases and ledger remain available in Reading Lab.';
  return out;
}
function boundedExport(value) {
  // Fail explicitly if future authored source expansion breaks the context
  // budget; never silently cut numerical facts or current limitations.
  if (new TextEncoder().encode(JSON.stringify(value)).length > 25000) throw new RangeError('This reading exceeds the compact export budget; select fewer frameworks.');
  return value;
}
/** Recompute rather than accepting a caller-supplied report. These bounded
 * exports are suitable for an explicitly approved AI context or read-only MCP. */
export function exportReadingLab(input) { return boundedExport(compactResult(calculateReadingLab(input))); }
export function exportReadingCase(id) {
  const result = evaluateReadingCase(id);
  return boundedExport({ ...result, interpretation: compactInterpretation(result.interpretation), result: compactResult(result.result) });
}
