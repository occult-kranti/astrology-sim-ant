// A source-labelled comparison of one instant. Pure: no DOM, storage, network,
// current-clock reads, or probabilistic predictions. Existing engines stay canonical.
import { parseExplicitInstant, HOUSE_SYSTEMS } from './instant-boundary.js';
import { CALENDARS, PRAYER_METHODS, calendarAtInstant, calendarSupported, validateZone, validateLocation, prayerTimes, qibla } from './cultural-calendars.js';
import { gregorianToJDN, jdnToJulian, isoDate, utcDate } from './calendar.js';
import { civilFields, resolveZonedTime } from './time.js';
import { castChart, signOf, norm360 } from './astro.js';
import { castVedic } from './vedic.js';
import { planetaryHour } from './planetary-hours.js';
import { panchangaScreens } from './muhurta.js';
import { YOGA_SCREEN, MUHURTA_CLASSICAL_SOURCE } from './data/muhurta-data.js';
import { Illumination, Body } from '../lib/astronomy.js';

export const OBSERVATORY_SCHEMA_VERSION = 1;
export const OBSERVATORY_SOURCES = [
  { id: 'OBS-COMPARISON-RESEARCH', title: 'Cross-tradition research, software and source qualifications', url: 'docs/2026-10-calendar-observatory-research.md', type: 'source-review' },
  { id: 'OBS-CALENDAR', title: 'Civil date arithmetic and calendar conventions', url: 'docs/2026-10-calendar-methods.md', type: 'project-methods' },
  { id: 'OBS-ASTRONOMY', title: 'Astronomy Engine: apparent geocentric positions', url: 'https://github.com/cosinekitty/astronomy', type: 'software' },
  { id: 'OBS-WESTERN', title: 'Lilly conventions and astronomical calculation methods', url: 'docs/2026-10-calculation-methods.md', type: 'project-methods' },
  { id: 'OBS-VEDIC', title: 'Vedic study implementation and its approximations', url: 'assets/js/core/vedic.js', type: 'implementation' },
  { id: 'OBS-MUHURTA', title: 'Pañcāṅga classifications from modern secondary transcriptions; primary-passage verification pending', url: 'assets/js/core/data/muhurta-data.js', type: 'secondary-source-rule-data', primaryPassageVerification: 'pending' },
  { id: 'OBS-HOURS', title: 'Agrippa, Three Books of Occult Philosophy, II.34: competing hour conventions', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', type: 'historical-primary' },
  { id: 'OBS-ADHAN', title: 'Adhan 4.4.6 snapshot, adaptations, and retained license', url: 'assets/vendor/adhan/PROVENANCE.md', type: 'software-provenance' },
  { id: 'OBS-INTL', title: 'ECMA-402: Intl.DateTimeFormat', url: 'https://tc39.es/ecma402/#sec-intl-datetimeformat-constructor', type: 'technical-standard' },
  { id: 'OBS-ICU', title: 'ICU User Guide: calendar implementations', url: 'https://unicode-org.github.io/icu/userguide/datetime/calendar/', type: 'software-documentation' },
];

const EXTRA_CIVIL = [
  { id: 'persian', label: 'Persian civil date (runtime convention)', note: 'Runtime Persian calendar convention; astronomical and tabular variants are not interchangeable. No claim of Iranian civil-authority equinox-rule equivalence.' },
  { id: 'coptic', label: 'Coptic civil date', note: 'Runtime Coptic calendar; ecclesiastical feasts and observances are not calculated.' },
  { id: 'ethiopic', label: 'Ethiopic civil date', note: 'Runtime Ethiopic convention, not Amete Alem; local liturgical decisions and observances are not calculated.' },
  { id: 'japanese', label: 'Japanese era civil date', note: 'Gregorian-style civil month/day with Japanese era naming. Historical-era details depend on runtime data; not an independent astronomical calendar.' },
  { id: 'roc', label: 'ROC / Minguo civil date', note: 'Taiwan civil-era numbering with Gregorian-style month/day; not an independent astronomical calendar.' },
];
export const OBSERVATORY_UNIMPLEMENTED = [
  { id: 'regional-hindu', label: 'Regional Hindu lunisolar and festival calendars', reason: 'Regional month systems, sunrise rules, observance priorities, and authoritative fixtures are not implemented. Instant Pañcāṅga limbs do not supply festival dates.' },
  { id: 'tibetan', label: 'Tibetan calendars', reason: 'School-specific calculation and intercalation rules require an identified implementation and reference fixtures.' },
  { id: 'maya', label: 'Maya calendar correlations', reason: 'No selected Long Count correlation, ritual-calendar model, or culturally reviewed interpretation is implemented here.' },
  { id: 'balinese', label: 'Balinese Pawukon and Saka', reason: 'Not equivalent to the Indian national Saka calendar. Local cycle/observance rules are not implemented.' },
  { id: 'jain-sikh', label: 'Jain and Sikh community calendars', reason: 'Named community conventions and independent fixtures are required before numerical comparison.' },
  { id: 'other-traditions', label: 'Other regional, Indigenous and historical traditions', reason: 'This is an explicitly bounded catalogue, not a calculator for every culture. Unrepresented systems are not inferred from similar names or cycles.' },
];

const PHASES = ['New Moon vicinity', 'Waxing crescent', 'First-quarter vicinity', 'Waxing gibbous', 'Full Moon vicinity', 'Waning gibbous', 'Last-quarter vicinity', 'Waning crescent'];
const PUBLIC_LIMITS = [
  'Computed sky positions and civil dates are distinct from traditional symbolic interpretations. Astrology has no demonstrated predictive validity.',
  'Calendar rows use the selected zone’s civil midnight. Hebrew and Islamic religious days can begin at sunset; this comparison does not calculate their ritual-day dates or observances.',
  'A shared solar or lunar input is mathematical dependence, not independent agreement or evidence that traditions predict the same outcome.',
  'Complete comparison is bounded to UTC years 1900–2100, matching existing civil-calendar and prayer engines. Time-zone and non-Gregorian displays depend on runtime Intl/ICU data.',
  'Coordinates do not determine an IANA zone. The caller must check that the supplied location and civil zone belong together.',
];
const jsonCopy = value => JSON.parse(JSON.stringify(value));

function localFields(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', hourCycle: 'h23' });
  const p = Object.fromEntries(formatter.formatToParts(date).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}`, weekday: p.weekday, label: formatter.format(date) };
}

function normalizeInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('An explicit dated and located input is required.');
  if (input.timeKnown === false) throw new RangeError('Calendar comparison requires a known instant; do not infer a birth time.');
  const date = parseExplicitInstant(input.dateISO);
  if (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100) throw new RangeError('Complete calendar comparisons support UTC years 1900–2100.');
  validateLocation(input.lat, input.lon);
  const timeZone = validateZone(input.timeZone);
  const system = input.system ?? 'regiomontanus';
  if (!HOUSE_SYSTEMS.includes(system)) throw new RangeError('Choose a supported house system.');
  const prayerMethod = input.prayerMethod ?? 'MuslimWorldLeague', asr = input.asr ?? 'Shafi', highLatitude = input.highLatitude ?? 'MiddleOfTheNight';
  if (!PRAYER_METHODS.some(([id]) => id === prayerMethod)) throw new RangeError('Choose a supported prayer method.');
  if (!['Shafi', 'Hanafi'].includes(asr)) throw new RangeError('Choose Shafi or Hanafi Asr.');
  if (!['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle'].includes(highLatitude)) throw new RangeError('Choose a supported high-latitude prayer rule.');
  const local = localFields(date, timeZone);
  // A permitted UTC year can touch an out-of-range observer-zone civil year.
  if (+local.date.slice(0, 4) < 1900 || +local.date.slice(0, 4) > 2100) throw new RangeError('The observer-zone civil date must also be within 1900–2100.');
  return { date, dateISO: date.toISOString(), lat: input.lat, lon: input.lon, timeZone, system, prayerMethod, asr, highLatitude, localDate: local.date, localTime: local.time, localWeekday: local.weekday, localLabel: local.label };
}

function civilRows(context) {
  const { date, localDate, timeZone } = context;
  const f = civilFields(localDate), julian = jdnToJulian(gregorianToJDN(f.year, f.month, f.day));
  const base = { kind: 'calculated-civil', status: 'available', boundary: 'civil-midnight', sourceIds: ['OBS-CALENDAR'], validation: 'existing-selected-reference-fixtures' };
  const rows = [
    { ...base, id: 'gregory', label: 'Gregorian civil date', text: localDate, parts: [{ type: 'year', value: String(f.year) }, { type: 'month', value: String(f.month) }, { type: 'day', value: String(f.day) }], method: 'Proleptic Gregorian date in the selected IANA zone', limitations: ['No regional historical adoption-gap reconstruction.'] },
    { ...base, id: 'julian', label: 'Julian civil date', text: isoDate(julian.y, julian.m, julian.d), parts: [{ type: 'year', value: String(julian.y) }, { type: 'month', value: String(julian.m) }, { type: 'day', value: String(julian.d) }], method: 'Selected local Gregorian civil date → JDN → proleptic Julian', limitations: ['Not a Julian Easter or local church observance determination.'] },
  ];
  for (const record of [...CALENDARS, ...EXTRA_CIVIL]) {
    const extra = EXTRA_CIVIL.some(x => x.id === record.id);
    let result;
    if (!extra) result = calendarAtInstant(date, record.id, timeZone);
    else if (!calendarSupported(record.id)) result = { supported: false, text: 'This runtime does not support this named calendar.' };
    else {
      const fmt = new Intl.DateTimeFormat('en', { calendar: record.id, timeZone, year: 'numeric', month: 'long', day: 'numeric', era: 'short' });
      result = { supported: true, text: fmt.format(date), parts: fmt.formatToParts(date) };
    }
    rows.push({ ...base, id: record.id, label: record.label, status: result.supported ? 'available' : 'unavailable', text: result.text, parts: result.parts ?? [], method: `Intl.DateTimeFormat named calendar “${record.id}”; explicit ${timeZone}`, sourceIds: ['OBS-CALENDAR', 'OBS-INTL', 'OBS-ICU'], validation: ['hebrew', 'chinese', 'buddhist', 'indian'].includes(record.id) ? 'existing-selected-reference-fixtures; not full-range validation; runtime-dependent' : 'runtime-supported; independent display-date fixtures pending', limitations: [record.note, ...(extra ? ['This added calendar has no newly independently verified date fixtures in this release.'] : [])] });
  }
  return rows;
}

function bodySummary(planet) {
  const sign = signOf(planet.lon);
  return { longitude: planet.lon, sign: sign.name, signIndex: sign.index, degree: sign.degInSign, retrograde: !!planet.retrograde, house: planet.house ?? null };
}

function hoursSummary(date, context) {
  const hour = planetaryHour(date, context.lat, context.lon, { timeZone: context.timeZone });
  const base = { label: 'Planetary day and hour', kind: 'traditional-rule', method: 'Chaldean sequence; twelve equal daylight and twelve equal night intervals; weekday at sunrise in the explicit IANA zone', boundary: 'sunrise-to-next-sunrise', sourceIds: ['OBS-HOURS', 'OBS-WESTERN'], limitations: ['This implements sunrise/sunset division, not Agrippa’s alternative ecliptic-ascension convention. Traditional timing qualities have no demonstrated predictive validity.'] };
  if (!hour) return { ...base, status: 'unavailable', reason: 'No enclosing sunrise/sunset interval at this polar location and instant.' };
  const baseMs = hour.isNight ? hour.sunset.getTime() : hour.sunrise.getTime();
  const index = hour.isNight ? hour.hourNumber - 13 : hour.hourNumber - 1;
  const start = baseMs + index * hour.hourLengthMinutes * 60000;
  return { ...base, status: 'available', ruler: hour.ruler, dayRuler: hour.dayRuler, hourNumber: hour.hourNumber, isNight: hour.isNight, hourLengthMinutes: hour.hourLengthMinutes, weekdayMethod: hour.weekdayMethod, currentStartISO: new Date(start).toISOString(), currentEndISO: new Date(start + hour.hourLengthMinutes * 60000).toISOString(), sunrise: hour.sunrise.toISOString(), sunset: hour.sunset.toISOString(), nextSunrise: hour.nextSunrise.toISOString() };
}

// Preserve the inherited rule descriptions without turning a symbolic class or
// an untimed opening-portion rule into an active verdict at this instant.
function classifiedScreens(panchanga) {
  const inherited = panchangaScreens(panchanga);
  const yogaRule = YOGA_SCREEN.avoid.find(rule => rule.num === panchanga.yoga.num);
  const limbs = Object.fromEntries(Object.entries(inherited).map(([key, item]) => {
    const openingUnresolved = key === 'yoga' && yogaRule?.scope === 'opening';
    return [key, { ...item, kind: 'traditional-classification', ruleVerdict: item.verdict,
      verdict: null, applicableAtInstant: null,
      applicability: openingUnresolved ? 'timing-unresolved' : 'classification-only',
      applicabilityReason: openingUnresolved
        ? 'The historical rule concerns an opening portion. Limb start/end events have not been calculated, so applicability at this instant is unknown.'
        : 'This is a secondary-source symbolic classification, not an active outcome judgment or a recommendation.',
      sourceStatus: 'modern-secondary-transcription; primary-passage verification pending' }];
  }));
  return { kind: 'traditional-rule', scope: 'Secondary-source historical quality classifications, described rather than prescribed; no active outcome verdict or demonstrated predictive validity',
    limbs, sourceIds: ['OBS-MUHURTA'], sourceProvenance: { evidence: 'Modern secondary-source transcriptions and summaries', primaryPassageVerification: 'pending', note: MUHURTA_CLASSICAL_SOURCE },
    limitations: ['Opening-ghaṭī avoidance intervals are not timed because limb start/end events are not computed. Applicability at the selected instant is unresolved; do not apply an opening-portion rule to the whole day or infer an exact safe interval.',
      'All limb outputs are symbolic classifications from the inherited secondary-source rule set. Primary-passage verification is pending, and no active outcome verdict is computed.'] };
}

/** Compare all implemented conventions for exactly the same supplied instant. */
export function compareMoment(input) {
  const normalized = normalizeInput(input), { date, ...context } = normalized;
  const chart = { ...castChart(date, context.lat, context.lon, context.system), timeZone: context.timeZone };
  const vedicChart = castVedic(chart, { currentDate: date });
  const elongation = norm360(chart.planets.Moon.lon - chart.planets.Sun.lon);
  const phaseIndex = Math.floor((elongation + 22.5) / 45) % 8;
  const hour = hoursSummary(date, context);
  const western = {
    label: 'Western tropical chart', status: 'available', kind: 'traditional-rule', method: 'Geocentric tropical ecliptic-of-date positions; named house convention',
    requestedHouseSystem: context.system, houseSystem: chart.system, sun: bodySummary(chart.planets.Sun), moon: bodySummary(chart.planets.Moon), ascendant: bodySummary({ lon: chart.asc }),
    planets: Object.entries(chart.planets).filter(([id]) => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(id)).map(([id, value]) => ({ id, label: id, ...bodySummary(value) })),
    isDay: chart.isDay, sunAltitude: chart.sunAltitude, sourceIds: ['OBS-ASTRONOMY', 'OBS-WESTERN'], limitations: [chart.houseWarning, 'A moment chart is not a personal natal reading or a horary judgment. No birth record or question is inferred.'].filter(Boolean),
  };
  const vedic = {
    label: 'Jyotiṣa study chart', status: 'available', kind: 'traditional-rule', method: 'Linear Lahiri estimate; sidereal zodiac; whole-sign houses; mean lunar nodes',
    ayanamsha: { degrees: vedicChart.ayanamsa, method: 'Linear Lahiri estimate, not exact JHora equivalence' },
    sun: { longitude: vedicChart.grahas.Sun.lon, sign: vedicChart.grahas.Sun.rashi, degree: vedicChart.grahas.Sun.deg },
    moon: { longitude: vedicChart.grahas.Moon.lon, sign: vedicChart.grahas.Moon.rashi, degree: vedicChart.grahas.Moon.deg },
    lagna: vedicChart.lagna, panchanga: vedicChart.panchanga, traditionalScreens: classifiedScreens(vedicChart.panchanga), sourceIds: ['OBS-ASTRONOMY', 'OBS-VEDIC', 'OBS-MUHURTA'],
    limitations: [vedicChart.notes, 'No personal daśā, remedy prescription, regional month system, festival, or limb end-time is inferred from this moment chart. Vāra is sunrise-bounded in the supplied civil zone and can be unavailable at polar latitudes.'],
  };
  let prayer;
  const prayerBase = { label: 'Islamic prayer timetable', kind: 'calculated-schedule', method: context.prayerMethod, asr: context.asr, highLatitude: context.highLatitude, boundary: 'selected-local-civil-date', sourceIds: ['OBS-ADHAN', 'OBS-CALENDAR'], limitations: ['Method-dependent calculated timetable, not a religious ruling or observed-crescent calendar. No terrain/elevation correction. Polar events can be unavailable; unresolved events are not invented.'] };
  try {
    const result = prayerTimes({ date: context.localDate, latitude: context.lat, longitude: context.lon, timeZone: context.timeZone, method: context.prayerMethod, asr: context.asr, highLatitude: context.highLatitude });
    prayer = { ...prayerBase, status: result.complete ? 'available' : 'partial', date: context.localDate, parameters: result.parameters, times: result.times.map(t => ({ ...t, instant: t.instant?.toISOString() ?? null })), qibla: qibla(context.lat, context.lon) };
  } catch (error) { prayer = { ...prayerBase, status: 'unavailable', reason: error.message, times: [], qibla: qibla(context.lat, context.lon) }; }
  const astronomy = { label: 'Shared astronomical measurements', status: 'available', kind: 'astronomical-quantity', julianDayUTC: 2440587.5 + date.getTime() / 86400000, sunLongitude: chart.planets.Sun.lon, moonLongitude: chart.planets.Moon.lon, moonSunElongation: elongation, moonIlluminatedFraction: Illumination(Body.Moon, date).phase_fraction, phaseLabel: PHASES[phaseIndex], phaseLabelMethod: 'Eight broad 45° ecliptic-elongation sectors, not an exact phase-event search', sourceIds: ['OBS-ASTRONOMY'], limitations: ['Geocentric positions; not a camera observation. Julian day uses uniform UTC-like days, without a separate leap-second or TT conversion.'] };
  const comparisons = [
    { id: 'same-instant', label: 'One moment, different date names', relationship: 'same-input', text: `All civil rows describe ${context.dateISO} in ${context.timeZone}. A different label or year is not a contradictory prediction.`, sourceIds: ['OBS-CALENDAR', 'OBS-INTL'] },
    { id: 'zodiac-offset', label: 'Tropical and sidereal reference frames', relationship: 'different-convention', text: `The same Sun and Moon are measured from different zodiac zero points. This implementation subtracts a linear Lahiri estimate of ${vedicChart.ayanamsa.toFixed(4)}°; signs can differ without a different observed sky.`, value: vedicChart.ayanamsa, unit: 'degrees', sourceIds: ['OBS-VEDIC', 'OBS-ASTRONOMY'] },
    { id: 'lunar-dependence', label: 'Lunar phase and tithi share a measurement', relationship: 'shared-derivation', text: `Moon–Sun elongation is ${elongation.toFixed(2)}°. The tithi partitions it into 12° intervals; broad phase labels use 45° sectors. Their agreement is mathematically dependent, not independent confirmation.`, sourceIds: ['OBS-ASTRONOMY', 'OBS-VEDIC'] },
    { id: 'boundaries', label: 'Midnight, sunrise and sunset are different boundaries', relationship: 'different-boundary', text: 'Civil date rows turn at midnight; planetary day/hour and Vedic vāra use sunrise. Hebrew and Islamic religious sunset-day dates are not calculated here. A civil weekday and sunrise-day ruler can legitimately differ before sunrise.', sourceIds: ['OBS-CALENDAR', 'OBS-VEDIC', 'OBS-HOURS'] },
    { id: 'not-a-vote', label: 'Compare conventions without a consensus score', relationship: 'not-comparable', text: 'An era year, civil month, prayer time, zodiac sign and symbolic quality measure different things. They are not normalized into an auspiciousness, truth, correlation or agreement score.', sourceIds: ['OBS-CALENDAR', 'OBS-WESTERN', 'OBS-VEDIC'] },
  ];
  const studyPrompts = [
    { id: 'sky-first', label: 'Observe the shared sky', text: `Compare the measured ${PHASES[phaseIndex].toLowerCase()} and ${vedicChart.panchanga.tithi.name} tithi. Identify their shared elongation input before interpreting either.`, sourceIds: ['OBS-ASTRONOMY', 'OBS-VEDIC'] },
    { id: 'convention-first', label: 'Read each convention separately', text: `Compare tropical Moon in ${western.moon.sign} with sidereal Moon in ${vedic.moon.sign}. Record the chosen ayanāṃśa instead of treating the labels as competing measurements.`, sourceIds: ['OBS-VEDIC', 'OBS-WESTERN'] },
    { id: 'source-study', label: 'Use a source-linked study prompt', text: hour.status === 'available' ? `The computed planetary hour is ${hour.ruler}, in the sunrise day of ${hour.dayRuler}. Read Agrippa II.34 and compare the implemented temporal-hour division with the unimplemented ascension-based alternative.` : 'Planetary hours are unavailable here. Investigate the polar boundary instead of substituting a location or inventing an hour ruler.', sourceIds: ['OBS-HOURS'] },
  ];
  return { schemaVersion: OBSERVATORY_SCHEMA_VERSION, context, calendars: civilRows(normalized), astronomy, western, vedic, planetaryHours: hour, prayer, comparisons, studyPrompts, sources: jsonCopy(OBSERVATORY_SOURCES), unimplemented: jsonCopy(OBSERVATORY_UNIMPLEMENTED), limitations: [...PUBLIC_LIMITS] };
}

/** Resolve a supplied local clock with explicit DST fold handling. No guessing. */
export function observatoryInputFromLocal({ date, time = '12:00', timeZone, disambiguation = 'reject', ...input }) {
  const zone = validateZone(timeZone);
  const resolved = resolveZonedTime(date, time, zone, { disambiguation });
  return { ...input, dateISO: resolved.instant.toISOString(), timeZone: zone };
}

/** Consecutive local civil days. Same local sample clock is resolved afresh daily;
 *  fixed 24-hour UTC increments would drift across daylight-saving transitions.
 *  Skipped/gap/repeated sample clocks become explicit unavailable rows.
 */
export function buildCalendarOutlook(input) {
  const context = normalizeInput(input);
  const days = input.days ?? 14, sampleTime = input.sampleTime ?? '12:00';
  if (!Number.isInteger(days) || days < 1 || days > 14) throw new RangeError('Outlooks support 1–14 local civil days per calculation.');
  const startDate = input.startDate ?? context.localDate;
  const fields = civilFields(startDate, sampleTime);
  const disambiguation = input.disambiguation ?? 'reject';
  if (!['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose reject, earlier, or later for repeated sample times.');
  if (fields.year < 1900 || fields.year > 2100) throw new RangeError('Outlook dates must lie within 1900–2100.');
  const start = utcDate(fields.year, fields.month, fields.day, 12), rows = [];
  let previous = null;
  for (let index = 0; index < days; index++) {
    const civil = new Date(start.getTime()); civil.setUTCDate(civil.getUTCDate() + index);
    const localDate = isoDate(civil.getUTCFullYear(), civil.getUTCMonth() + 1, civil.getUTCDate());
    if (civil.getUTCFullYear() > 2100) throw new RangeError('The full outlook must end within 2100.');
    let row;
    try {
      const moment = observatoryInputFromLocal({ ...input, date: localDate, time: sampleTime, timeZone: context.timeZone, disambiguation });
      const snapshot = compareMoment(moment);
      const changes = previous ? [
        ...(snapshot.western.moon.sign !== previous.western.moon.sign ? [`Tropical Moon: ${previous.western.moon.sign} → ${snapshot.western.moon.sign}`] : []),
        ...(snapshot.vedic.panchanga.tithi.num !== previous.vedic.panchanga.tithi.num ? [`Tithi: ${previous.vedic.panchanga.tithi.num} → ${snapshot.vedic.panchanga.tithi.num}`] : []),
        ...(snapshot.vedic.panchanga.nakshatra.num !== previous.vedic.panchanga.nakshatra.num ? [`Nakṣatra: ${previous.vedic.panchanga.nakshatra.name} → ${snapshot.vedic.panchanga.nakshatra.name}`] : []),
      ] : [];
      row = { index, weekIndex: index < 7 ? 0 : 1, localDate, weekday: snapshot.context.localWeekday, dateISO: snapshot.context.dateISO, status: 'available', snapshot, highlights: [snapshot.astronomy.phaseLabel, `${snapshot.vedic.panchanga.tithi.name} · ${snapshot.vedic.panchanga.tithi.paksha}`, `Tropical Moon: ${snapshot.western.moon.sign}; sidereal Moon: ${snapshot.vedic.moon.sign}`], changesFromPreviousSample: changes };
      previous = snapshot;
    } catch (error) {
      // Invalid/skipped local sample is data, not an invented noon or shifted date.
      row = { index, weekIndex: index < 7 ? 0 : 1, localDate, status: 'unavailable', reason: error.message, code: error.code ?? 'CALCULATION_UNAVAILABLE', snapshot: null, highlights: [], changesFromPreviousSample: [] };
      previous = null;
    }
    rows.push(row);
  }
  return { schemaVersion: OBSERVATORY_SCHEMA_VERSION, context: { dateISO: context.dateISO, lat: context.lat, lon: context.lon, timeZone: context.timeZone, system: context.system, prayerMethod: context.prayerMethod, asr: context.asr, highLatitude: context.highLatitude }, startDate, days, sampleTime, disambiguation, method: 'One independent snapshot at the same local civil clock on each consecutive date; not exact transition times or whole-day predictions', weekLabels: ['First seven days', 'Following seven days'], rows, generatedFromInstant: context.dateISO, limitations: ['The two seven-day groups start at the selected date; they are not automatically Monday–Sunday calendar weeks.', 'Changes compare daily samples only. Multiple sign/tithi/nakṣatra transitions can occur between samples; no event-search completeness is implied.', 'Local-clock gaps, repeated clocks without a chosen occurrence, skipped dates, and unsupported boundary dates remain unavailable rows.', ...PUBLIC_LIMITS] };
}
