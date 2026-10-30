// Optional personal solar/lunar study. Pure and bounded: no clock, persistence,
// URL, account or network. Exact records and unknown-time intervals stay distinct.
import { castChart, bodyPosition, untimedPositions, norm360, signOf } from './astro.js';
import { castVedic } from './vedic.js';
import { lahiriAyanamsa, nakshatraOf } from './data/vedic-data.js';
import { civilFields, resolveZonedTime, zonedCivilDay, validLocation } from './time.js';
import { parseExplicitInstant, HOUSE_SYSTEMS } from './instant-boundary.js';
import { solarReturnInstant } from './solar-return.js';
import { Search, MakeTime } from '../lib/astronomy.js';

const DAY = 86400000;
const plain = value => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const keys = (value, allowed, name) => { if (!plain(value) || Object.keys(value).some(k => !allowed.includes(k))) throw new TypeError(`${name} contains unsupported fields.`); };
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const difference = (a, b) => norm360(a - b + 180) - 180;
const supported = date => { if (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100) throw new RangeError('Personal calendar study supports 1900–2100 in both civil and UTC dates.'); return date; };
const unavailable = reason => ({ status: 'unavailable', reason });
export const PERSONAL_SOURCES = freeze([
  { id: 'PERSONAL-ASTRONOMY', title: 'Astronomy Engine and existing chart validation', url: 'https://github.com/cosinekitty/astronomy', status: 'Calculated geocentric astronomy; existing selected fixtures, not observed positions' },
  { id: 'PERSONAL-LILLY', title: 'William Lilly, Christian Astrology', url: 'https://en.wikisource.org/wiki/Christian_Astrology', edition: '1647 inherited engine convention; distinct 1659 source-study transcription', section: 'Book I chart erection; Book III nativities and revolutions', status: 'Inherited source map and named house convention; no new passage collation or complete Lilly judgment' },
  { id: 'PERSONAL-VEDIC', title: 'Workbench Vedic calculation conventions', url: 'https://github.com/occult-kranti/astrology-sim-ant/blob/feat/mobile-calendar-observatory/docs/2026-10-calculation-methods.md', section: 'Vedic model limits', status: 'Linear Lahiri estimate, whole-sign houses and inherited Vimśottarī model; no JHora equivalence or all-school coverage' },
  { id: 'PERSONAL-TIME', title: 'Explicit local-time and civil-day boundary implementation', url: 'https://github.com/occult-kranti/astrology-sim-ant/blob/feat/mobile-calendar-observatory/assets/js/core/time.js', status: 'Intl/tzdb-dependent resolution, explicit folds, rejected gaps and skipped dates' },
]);

export function normalizeBirthContext(input) {
  keys(input, ['date', 'timeKnown', 'time', 'timeZone', 'lat', 'lon', 'disambiguation'], 'Birth input');
  if (typeof input.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new RangeError('Enter a Gregorian birth date as YYYY-MM-DD.');
  const civil = civilFields(input.date);
  if (civil.year < 1900 || civil.year > 2100) throw new RangeError('Personal calendar study supports civil birth years 1900–2100.');
  if (typeof input.timeKnown !== 'boolean') throw new TypeError('Explicitly choose whether the recorded birth time is known.');
  if (input.disambiguation != null && !['reject', 'earlier', 'later'].includes(input.disambiguation)) throw new RangeError('Choose reject, earlier or later for repeated local time.');
  if (input.lat != null || input.lon != null) validLocation(input.lat, input.lon);
  if (typeof input.timeZone !== 'string' || input.timeZone.length > 120 || !input.timeZone.trim()) throw new RangeError('Enter the IANA time zone of the birth record.');
  const timeZone = new Intl.DateTimeFormat('en', { timeZone: input.timeZone.trim() }).resolvedOptions().timeZone;
  if (!input.timeKnown) {
    if (input.time != null && input.time !== '') throw new RangeError('Remove the clock time when the birth time is unknown.');
    const interval = zonedCivilDay(input.date, timeZone);
    supported(interval.start); supported(new Date(interval.end.getTime() - 1));
    return freeze({ date: input.date, timeKnown: false, timeZone });
  }
  if (typeof input.time !== 'string') throw new RangeError('Enter the recorded local birth time.');
  civilFields(input.date, input.time);
  validLocation(input.lat, input.lon);
  if (Math.abs(input.lat) === 90) throw new RangeError('A timed chart cannot define an ascendant at an exact geographic pole.');
  const disambiguation = input.disambiguation ?? 'reject';
  const resolved = resolveZonedTime(input.date, input.time, timeZone, { disambiguation });
  supported(resolved.instant);
  return freeze({ date: input.date, timeKnown: true, time: input.time, timeZone, lat: input.lat, lon: input.lon, disambiguation });
}

function exactBody(name, longitude, house = null) {
  return { body: name, longitudeDegrees: longitude, sign: signOf(longitude).name, degreeInSign: signOf(longitude).degInSign, ...(house == null ? {} : { house }) };
}
function sampledArc(midpoint, samples) {
  const deltas = samples.map(value => difference(value, midpoint));
  const minDeltaDegrees = Math.min(...deltas), maxDeltaDegrees = Math.max(...deltas);
  return { status: 'sampled-range', representativeLongitudeDegrees: midpoint, representativeIsBirthPosition: false, minDeltaDegrees, maxDeltaDegrees, arcStartDegrees: norm360(midpoint + minDeltaDegrees), arcEndDegrees: norm360(midpoint + maxDeltaDegrees), estimatedSpanDegrees: maxDeltaDegrees - minDeltaDegrees, crossesZero: norm360(midpoint + minDeltaDegrees) > norm360(midpoint + maxDeltaDegrees), sampleCount: 25, sampleSigns: [...new Set(samples.map(value => signOf(value).name))], qualification: '25 samples estimate the interval; they are not certified extrema. The midpoint is a representative sample, not an assumed birth time.' };
}
function nextLunarReturn(target, after) {
  const start = after.getTime() + 1, end = Math.min(start + 32 * DAY, Date.UTC(2101, 0, 1) - 1);
  if (start >= end) return unavailable('No later instant remains within the supported UTC range.');
  const fn = time => difference(bodyPosition('Moon', time.date).lon, target);
  let a = MakeTime(new Date(start)), da = fn(a);
  for (let at = start + DAY / 4; at <= end + DAY / 4; at += DAY / 4) {
    const b = MakeTime(new Date(Math.min(at, end))), db = fn(b);
    // A Moon-longitude return is an ascending zero, never the ±180° wrap.
    if (da <= 0 && db >= 0 && db - da < 180) {
      const found = Search(fn, a, b, { dt_tolerance_seconds: 1, iter_limit: 60 });
      if (found && found.date > after) return { status: 'calculated', instantUTC: found.date.toISOString(), bracketStartUTC: a.date.toISOString(), bracketEndUTC: b.date.toISOString(), targetLongitudeDegrees: target, residualDegrees: fn(found), searchHorizonDays: 32, timeToleranceSeconds: 1, method: 'Next tropical geocentric Moon-longitude return after the selected instant; 6-hour brackets and the vendored Astronomy Engine ascending-zero search. Not a Moon-phase or sidereal return.' };
    }
    if (b.date.getTime() >= end) break;
    a = b; da = db;
  }
  return unavailable('No lunar-longitude return was bracketed within 32 days and the supported UTC range.');
}

export function buildPersonalCalendar(input) {
  keys(input, ['birth', 'selectedInstant', 'houseSystem', 'includeReturns'], 'Personal study');
  const birth = normalizeBirthContext(input.birth), selected = supported(parseExplicitInstant(input.selectedInstant));
  const houseSystem = input.houseSystem ?? 'regiomontanus';
  if (!HOUSE_SYSTEMS.includes(houseSystem)) throw new RangeError('Choose Regiomontanus, Placidus, whole-sign or equal houses.');
  if (input.includeReturns != null && typeof input.includeReturns !== 'boolean') throw new TypeError('Return calculations require an explicit boolean choice.');
  const current = Object.fromEntries(['Sun', 'Moon'].map(name => [name, { tropical: bodyPosition(name, selected).lon, sidereal: norm360(bodyPosition(name, selected).lon - lahiriAyanamsa(selected)) }]));
  const out = { schemaVersion: 1, kind: 'personal-calendar-study', selectedInstant: selected.toISOString(), birthInput: birth, certainty: birth.timeKnown ? 'recorded-time' : 'unknown-time-interval', methods: { western: `Geocentric tropical zodiac; requested ${houseSystem} houses. Regiomontanus is the inherited Lilly convention; alternatives are explicit modern comparison choices.`, vedic: 'Sidereal = tropical minus the documented linear Lahiri estimate; whole-sign houses and mean nodes. One supported ayanāṁśa, not every Vedic school.', comparison: 'Shortest signed current-minus-birth longitude, in degrees; coordinate difference only, not an aspect strength or outcome forecast.', returns: 'Optional tropical longitude returns; solar return in selected UTC year and next lunar return after selected instant. Sidereal returns and complete historical revolution judgments are unimplemented.' }, sources: PERSONAL_SOURCES.map(s => ({ ...s })), unavailableVariants: ['Alternative ayanāṁśas and regional Jyotiṣa school rules', 'Sidereal solar/lunar return charts and complete annual predictions', 'Lilly horary judgments inferred from a birthday'], limitations: ['Recorded time is user-supplied, not independently verified; small timing/ephemeris differences can change boundaries.', 'Astronomy and named traditional coordinate rules do not establish predictive validity.', 'No automatic storage, URL sharing or model call; birth details and derived personal readings are omitted from exports by default.'] };
  if (birth.timeKnown) {
    const resolved = resolveZonedTime(birth.date, birth.time, birth.timeZone, { disambiguation: birth.disambiguation });
    const chart = { ...castChart(resolved.instant, birth.lat, birth.lon, houseSystem), timeZone: birth.timeZone, utcOffset: resolved.offsetHours };
    const vedic = castVedic(chart, { currentDate: selected });
    out.birthContext = { instantUTC: resolved.instant.toISOString(), offsetHours: resolved.offsetHours, repeatedLocalTime: resolved.ambiguous, disambiguation: birth.disambiguation };
    out.western = { status: 'calculated', houseSystem: chart.system, requestedHouseSystem: houseSystem, houseWarning: chart.houseWarning || null, ascendantDegrees: chart.asc, midheavenDegrees: chart.mc, houseCuspsDegrees: chart.cusps.slice(1), bodies: ['Sun', 'Moon'].map(name => exactBody(name, chart.planets[name].lon, chart.planets[name].house)) };
    const period = vedic.vimshottari.maha.find(p => selected >= p.start && selected < p.end);
    const antar = period && vedic.vimshottari.antardashas.find(p => selected >= p.start && selected < p.end);
    out.vedic = { status: 'calculated', ayanamshaDegrees: lahiriAyanamsa(resolved.instant), houseSystem: 'whole-sign', ascendantDegrees: vedic.lagna.lon, bodies: ['Sun', 'Moon'].map(name => ({ ...exactBody(name, vedic.grahas[name].lon, vedic.grahas[name].house), rashi: vedic.grahas[name].rashi, nakshatra: { name: vedic.grahas[name].nakshatra.name, pada: vedic.grahas[name].nakshatra.pada } })), vimshottari: period && selected >= resolved.instant ? { status: 'traditional-calculation', mahaLord: period.lord, antarLord: antar?.lord || null, startUTC: period.start.toISOString(), endUTC: period.end.toISOString(), convention: 'Inherited Vimśottarī model, 365.2425-day year; a traditional period label, not a personal prediction.' } : unavailable('Selected instant is outside the supplied birth record’s computed Vimśottarī timeline; no first-period fallback is presented.') };
    out.offsets = ['Sun', 'Moon'].map(name => ({ body: name, status: 'calculated', tropicalDegrees: difference(current[name].tropical, chart.planets[name].lon), siderealDegrees: difference(current[name].sidereal, vedic.grahas[name].lon) }));
    out.returns = { solar: unavailable('Return search has not been requested.'), lunar: unavailable('Return search has not been requested.') };
    if (input.includeReturns === true) {
      const year = selected.getUTCFullYear(), at = solarReturnInstant(chart.planets.Sun.lon, year);
      out.returns.solar = at.getUTCFullYear() === year ? { status: 'calculated', instantUTC: at.toISOString(), year, targetLongitudeDegrees: chart.planets.Sun.lon, residualDegrees: difference(bodyPosition('Sun', at).lon, chart.planets.Sun.lon), angularToleranceDegrees: 0.0005, method: 'Existing tropical solar-return rootfinder; return in selected UTC year, which can precede the selected instant. No complete annual judgment or sidereal return is implied.' } : unavailable('The rootfinder did not return a crossing within the selected UTC year.');
      out.returns.lunar = nextLunarReturn(chart.planets.Moon.lon, selected);
    }
  } else {
    const interval = zonedCivilDay(birth.date, birth.timeZone), lastIncluded = new Date(interval.end.getTime() - 1), untimed = untimedPositions(interval.start, lastIncluded);
    const times = Array.from({ length: 25 }, (_, i) => new Date(interval.start.getTime() + (lastIncluded - interval.start) * i / 24));
    out.birthContext = { startUTC: interval.start.toISOString(), endUTCExclusive: interval.end.toISOString(), sampleEndUTC: lastIncluded.toISOString(), actualHours: (interval.end - interval.start) / 3600000, representativeUTC: untimed.representative.toISOString(), representativeIsBirthTime: false, sampling: '25 samples from the actual civil-day start through the last included millisecond; the exclusive end is never sampled. The envelope is estimated, not certified extrema.' };
    out.western = { status: 'sampled-range', bodies: ['Sun', 'Moon'].map(name => { const p = untimed.planets[name]; return { body: name, ...sampledArc(p.longitude, times.map(t => bodyPosition(name, t).lon)) }; }) };
    out.vedic = { status: 'sampled-range', bodies: ['Sun', 'Moon'].map(name => { const midpoint = norm360(untimed.planets[name].longitude - lahiriAyanamsa(untimed.representative)); const samples = times.map(t => norm360(bodyPosition(name, t).lon - lahiriAyanamsa(t))); return { body: name, ...sampledArc(midpoint, samples), sampleNakshatras: [...new Set(samples.map(value => nakshatraOf(value).name))] }; }) };
    out.offsets = ['Sun', 'Moon'].map(name => { const w = out.western.bodies.find(b => b.body === name), v = out.vedic.bodies.find(b => b.body === name); return { body: name, status: 'sampled-range', tropical: { referenceDegrees: difference(current[name].tropical, w.representativeLongitudeDegrees), minDeltaDegrees: -w.maxDeltaDegrees, maxDeltaDegrees: -w.minDeltaDegrees }, sidereal: { referenceDegrees: difference(current[name].sidereal, v.representativeLongitudeDegrees), minDeltaDegrees: -v.maxDeltaDegrees, maxDeltaDegrees: -v.minDeltaDegrees }, qualification: 'Circular offset envelope relative to a representative midpoint, not an exact natal displacement.' }; });
    out.returns = { solar: unavailable('Exact natal Sun longitude is unknown; an exact return is withheld.'), lunar: unavailable('Exact natal Moon longitude is unknown; an exact return is withheld.') };
    out.unavailablePersonal = ['Ascendant and Midheaven', 'House cusps and house placements', 'Sect and time-dependent personal interpretations', 'Vimśottarī periods', 'Exact solar/lunar return instants'];
  }
  return freeze(out);
}

export function exportPersonalCalendar(input, options = {}) {
  keys(options, ['includeBirth'], 'Personal export options');
  if (options.includeBirth != null && typeof options.includeBirth !== 'boolean') throw new TypeError('Birth disclosure must be a boolean.');
  const selected = supported(parseExplicitInstant(input?.selectedInstant));
  if (options.includeBirth === true) return freeze({ ...buildPersonalCalendar(input), disclosure: 'Birth inputs, exact observer when supplied, and derived personal readings explicitly included.' });
  return freeze({ schemaVersion: 1, kind: 'personal-calendar-methods', selectedInstant: selected.toISOString(), disclosure: 'Birth inputs and all derived personal results omitted. This is method metadata only.', sources: PERSONAL_SOURCES.map(s => ({ ...s })) });
}
