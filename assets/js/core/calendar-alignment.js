// One angular reference, several named conventions. Recompute from explicit
// inputs; never infer a cultural date's position on a zodiac or outcome score.
import { buildCalendarAtlas } from './calendar-atlas.js';
import { validateZone } from './cultural-calendars.js';
import { resolveZonedTime } from './time.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { lahiriAyanamsa, RASHIS, NAKSHATRAS, NAKSHATRA_ARC } from './data/vedic-data.js';

export const CALENDAR_ALIGNMENT_VERSION = 1;
const norm = value => ((value % 360) + 360) % 360;
const copy = value => JSON.parse(JSON.stringify(value));
const INPUT_KEYS = ['dateISO', 'lat', 'lon', 'timeZone', 'system', 'prayerMethod', 'asr', 'highLatitude', 'timeKnown'];
const OPTION_KEYS = ['familyIds', 'variantIds', 'comparisonTimeZone', 'clockMode', 'disambiguation'];
const PRIVATE_KEYS = ['birth', 'birthDate', 'birthDateISO', 'birthTime', 'birthContext', 'personal', 'savedRecords'];
const SOURCES = [
  { id:'ALIGN-TEMPORAL', title:'Temporal: Time Zones and Resolving Ambiguity', url:'https://tc39.es/proposal-temporal/docs/timezone.html', section:'Clock time versus exact time; ambiguity due to offset changes; disambiguation examples', readingDepth:'Selected explanatory sections read 2026-10-30. Existing project Intl resolver is reused; Temporal is not a new runtime dependency.', sha256:'4241bd4bbc20c9d8c2a4581c7b98e8c6d51c4b5393a986bbb145def2aea5aba1' },
  { id:'ALIGN-ICU', title:'ICU Calendar user guide', url:'https://unicode-org.github.io/icu/userguide/datetime/calendar/', section:'Representation and Conversion; Ambiguous Wall Clock Time Resolution', readingDepth:'Selected sections read 2026-10-30. UTC values are calendar-independent; field values depend on calendar and time-zone context. Project policy rejects gaps instead of adopting ICU Calendar defaults.', sha256:'79f4798a1cfd5e6484a598d8aa43243a53ca855b60f9c334080e35f7c1788293' },
  { id:'ALIGN-RFC5545', title:'Internet Calendaring and Scheduling Core Object Specification', url:'https://www.rfc-editor.org/rfc/rfc5545', section:'3.1 content lines; 3.3.5 DATE-TIME; 3.3.11 TEXT; 3.6.1 VEVENT; 3.8.4.7 UID; 3.8.7.2 DTSTAMP', readingDepth:'Named sections read 2026-10-30. Export is a local UTC study event, not a subscription or connected provider.', sha256:'c256f809479d98aa23d71bbd1658b3800ea9f13f41ca56e59c8d2de1b31cbfcb' },
];

function optionsFor(options, allowed = OPTION_KEYS) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Alignment options must be an object.');
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new RangeError('Unknown alignment option.');
  const clockMode = options.clockMode ?? 'same-instant';
  const disambiguation = options.disambiguation ?? 'reject';
  if (!['same-instant', 'same-local-clock'].includes(clockMode)) throw new RangeError('Choose same-instant or same-local-clock alignment.');
  if (!['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose reject, earlier, or later for repeated clock times.');
  return { ...options, clockMode, disambiguation };
}

function safeInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('An explicit moment and observer are required.');
  if (PRIVATE_KEYS.some(key => Object.hasOwn(input, key))) throw new RangeError('Calendar alignment accepts a study moment, not a birth record or saved personal context.');
  return Object.fromEntries(INPUT_KEYS.filter(key => Object.hasOwn(input, key)).map(key => [key, input[key]]));
}

function selection(options) {
  return Object.fromEntries(['familyIds', 'variantIds'].filter(key => options[key] !== undefined).map(key => [key, options[key]]));
}

function clock(context) {
  const date = new Date(context.dateISO), milliseconds = date.getUTCMilliseconds();
  const nominal = new Date(context.localDate + 'T' + context.localTime + 'Z');
  return { instantUTC:context.dateISO, timeZone:context.timeZone, localDate:context.localDate,
    localTime:context.localTime + (milliseconds ? '.' + String(milliseconds).padStart(3, '0') : ''),
    offsetSeconds:(nominal.getTime() - date.getTime() + milliseconds) / 1000 };
}

function rowLegend(row) {
  return Object.fromEntries(['id', 'label', 'familyId', 'status', 'kind', 'summary', 'boundary', 'method', 'validation', 'sourceIds', 'limitations'].map(key => [key, copy(row[key])]));
}

function ringsFor(atlas) {
  const { comparison, rows, context } = atlas, selected = new Set(rows.map(row => row.id));
  const aya = lahiriAyanamsa(new Date(context.dateISO)), rings = [];
  const markers = (offset = 0) => comparison.western.planets.map(planet => ({ id:planet.id, label:planet.label,
    longitudeDegrees:planet.longitude, coordinateLongitudeDegrees:norm(planet.longitude - offset) }));
  const equalSectors = (items, width, zero) => items.map((item, index) => ({ id:String(index + 1), label:item,
    startDegrees:norm(zero + index * width), endDegrees:norm(zero + (index + 1) * width), widthDegrees:width }));
  const houses = rows.filter(row => row.houseSystem && row.result);
  if (houses.length) rings.push({ id:'tropical-zodiac', label:'Tropical zodiac', frame:'apparent-geocentric-ecliptic-of-date', zeroTropicalDegrees:0,
    variantIds:houses.map(row => row.id), sourceIds:['OBS-ASTRONOMY','OBS-WESTERN'], sectors:equalSectors(RASHIS.map(sign => sign.name), 30, 0), markers:markers(),
    limitations:['Twelve equal zodiac signs; these are not the unequal IAU constellation boundaries.'] });
  if (selected.has('vedic-solar') || selected.has('vedic-lunar')) rings.push({ id:'sidereal-zodiac', label:'Sidereal zodiac · linear Lahiri', frame:'linear-Lahiri-sidereal', zeroTropicalDegrees:aya,
    variantIds:['vedic-solar','vedic-lunar'].filter(id => selected.has(id)), sourceIds:['OBS-VEDIC','OBS-ASTRONOMY'], sectors:equalSectors(RASHIS.map(sign => sign.sanskrit + ' · ' + sign.name), 30, aya), markers:markers(aya),
    limitations:['Linear Lahiri study approximation, not exact JHora equivalence. Markers remain at the same physical tropical longitude; only coordinate labels and sector origin change.'] });
  if (selected.has('vedic-lunar')) rings.push({ id:'nakshatra', label:'27 equal-arc nakṣatras', frame:'linear-Lahiri-sidereal', zeroTropicalDegrees:aya,
    variantIds:['vedic-lunar'], sourceIds:['OBS-VEDIC','OBS-ASTRONOMY'], sectors:equalSectors(NAKSHATRAS.map(item => item.sanskrit), NAKSHATRA_ARC, aya), markers:markers(aya).filter(item => item.id === 'Moon'),
    limitations:['These equal angular partitions are not measured fixed-star positions or a complete regional lunar calendar.'] });
  const terms = rows.find(row => row.id === 'chinese-solar-terms');
  if (terms?.result?.events) rings.push({ id:'solar-terms', label:'24 solar-term longitude marks', frame:'apparent-geocentric-ecliptic-of-date', zeroTropicalDegrees:0,
    variantIds:['chinese-solar-terms'], sourceIds:copy(terms.sourceIds), sectors:[], markers:terms.result.events.map(event => ({ id:String(event.longitudeDegrees), label:event.chineseName + ' · ' + event.name,
      longitudeDegrees:event.longitudeDegrees, coordinateLongitudeDegrees:event.longitudeDegrees, instantUTC:event.instantUTC })),
    limitations:['Marks are the Sun’s annual target longitudes, not 24 bodies simultaneously in the sky. They do not calculate Four Pillars.'] });
  for (const row of houses) {
    const cusps = row.result.cusps;
    rings.push({ id:row.id, label:row.label + (row.status === 'partial' ? ' · fallback ' + row.result.actualSystem : ''), frame:'observer-house-cusps-in-tropical-ecliptic', zeroTropicalDegrees:0,
      variantIds:[row.id], status:row.status, sourceIds:copy(row.sourceIds), sectors:cusps.map((start, index) => ({ id:String(index + 1), label:'House ' + (index + 1), startDegrees:start,
        endDegrees:cusps[(index + 1) % 12], widthDegrees:norm(cusps[(index + 1) % 12] - start) })), markers:[],
      limitations:[...row.limitations, 'House boundaries depend on observer and time. A shared cusp or sign does not imply a shared interpretation.'] });
  }
  return rings;
}

function comparisonValue(row) {
  if (!row || row.status === 'unavailable') return null;
  if (row.calendarId) return row.result.parts.filter(part => part.type !== 'literal');
  if (row.id === 'chinese-solar-terms') return { events:row.result.events.map(event => ({ longitude:event.longitudeDegrees, instant:event.instantUTC })), next:row.result.nextEvent?.instantUTC ?? null };
  return row.result;
}

function differencesFor(base, other) {
  return base.rows.map(row => {
    const alternate = other?.rows.find(item => item.id === row.id), left = comparisonValue(row), right = comparisonValue(alternate);
    const relationship = left === null || right === null ? 'unavailable' : JSON.stringify(left) === JSON.stringify(right) ? 'equal-output' : 'different-output';
    const kind = row.calendarId ? 'civil-label' : row.houseSystem ? 'house-convention' : row.id === 'chinese-solar-terms' ? 'astronomical-events' : 'named-method-output';
    return { id:row.id, label:row.label, kind, relationship, baseValue:row.summary, comparisonValue:alternate?.summary ?? null,
      explanation:relationship === 'unavailable' ? 'One or both outputs are unavailable or the alternate clock has not been resolved; no comparison verdict is inferred.'
        : row.calendarId ? 'Civil fields name a date under a calendar and time-zone convention. Equal or different date names do not establish agreement or disagreement about outcomes.'
          : 'Comparison of this named method’s computed output only. Shared astronomical inputs and matching labels are not independent support for an interpretation.',
      sourceIds:copy(row.sourceIds), baseStatus:row.status, comparisonStatus:alternate?.status ?? 'unresolved' };
  });
}

/** Selected overlays and explicit clock alignment. Same-local-clock preserves
 * the base wall fields in another zone, which usually changes the UTC instant.
 * An unresolved fold/gap leaves the base valid and alternate output absent.
 */
export function buildCalendarAlignment(input, options = {}) {
  const opts = optionsFor(options), canonical = safeInput(input), selected = selection(opts);
  const base = buildCalendarAtlas(canonical, selected), targetZone = validateZone(opts.comparisonTimeZone ?? base.context.timeZone);
  const baseClock = clock(base.context), candidatesUTC = [];
  let alternate = null, reason = null, ambiguous = false, code = null;
  let targetISO = base.context.dateISO;
  if (opts.clockMode === 'same-local-clock') {
    try {
      const resolved = resolveZonedTime(base.context.localDate, base.context.localTime, targetZone, { disambiguation:opts.disambiguation });
      const milliseconds = new Date(base.context.dateISO).getUTCMilliseconds();
      candidatesUTC.push(...resolved.candidates.map(date => new Date(date.getTime() + milliseconds).toISOString()));
      ambiguous = resolved.ambiguous;
      targetISO = new Date(resolved.instant.getTime() + milliseconds).toISOString();
    } catch (error) {
      if (!['NONEXISTENT_TIME','AMBIGUOUS_TIME'].includes(error.code)) throw error;
      code = error.code; ambiguous = code === 'AMBIGUOUS_TIME';
      reason = ambiguous ? 'This clock time occurs twice in the comparison zone. Choose earlier or later; no occurrence has been inferred.'
        : 'This clock time does not exist in the comparison zone. Change the time or use same-instant alignment; no automatic shift was applied.';
      const milliseconds = new Date(base.context.dateISO).getUTCMilliseconds();
      candidatesUTC.push(...(error.candidates || []).map(date => new Date(date.getTime() + milliseconds).toISOString()));
    }
  }
  if (!reason) {
    try { alternate = targetISO === base.context.dateISO && targetZone === base.context.timeZone ? base : buildCalendarAtlas({ ...canonical, dateISO:targetISO, timeZone:targetZone }, selected); }
    catch (error) { reason = 'Comparison unavailable: ' + error.message; code = 'COMPARISON_UNAVAILABLE'; }
  }
  const alternateClock = alternate ? clock(alternate.context) : null;
  const sameInstant = alternateClock ? baseClock.instantUTC === alternateClock.instantUTC : null;
  const sameLocalClock = alternateClock ? baseClock.localDate === alternateClock.localDate && baseClock.localTime === alternateClock.localTime : null;
  const synchronization = { status:alternate ? sameInstant ? 'aligned' : 'different-instant' : 'unresolved', clockMode:opts.clockMode,
    sameInstant, sameLocalClock, sameZone:base.context.timeZone === targetZone,
    elapsedSeconds:alternate ? (Date.parse(alternateClock.instantUTC) - Date.parse(baseClock.instantUTC)) / 1000 : null,
    base:baseClock, comparison:alternateClock, comparisonTimeZone:targetZone, disambiguation:opts.disambiguation, ambiguous, candidatesUTC, code, reason,
    geographicZoneMatch:'not-verified', geographicZoneExplanation:'Clock conversion is verified against runtime IANA data. No time-zone polygon database verifies that these coordinates belong to that zone. Coordinates stay fixed in this clock comparison.',
    providerSync:'not-connected', providerExplanation:'These calculations align inside this page. Downloading an iCalendar file is a manual import, not a connected or automatically updating calendar subscription.' };
  const rings = ringsFor(base), legend = base.rows.map(rowLegend), differences = differencesFor(base, alternate);
  const sourceIds = new Set([...rings.flatMap(ring => ring.sourceIds), ...legend.flatMap(row => row.sourceIds), 'ALIGN-TEMPORAL', 'ALIGN-ICU', 'ALIGN-RFC5545']);
  return { schemaVersion:CALENDAR_ALIGNMENT_VERSION, kind:'selected-calendar-alignment', context:copy(base.context), selection:copy(base.selection),
    rings, legend, synchronization, differences, sources:[...base.sources, ...SOURCES].filter(source => sourceIds.has(source.id)),
    limitations:[
      'Only angular methods are drawn as rings. Civil calendar labels, religious observances, computus and temporal hours remain labelled method rows; they are not placed at invented zodiac angles.',
      'Ring radii are layout choices, not orbital distances. Every angular mark uses a stated frame and the common tropical ecliptic reference.',
      'A different time zone can change a civil date without changing the shared sky. Keeping the same wall-clock fields in a different zone usually changes the instant and the sky.',
      'All date labels retain existing validation limits and civil-midnight boundaries. Religious sunset dates, regional festivals and observed-crescent decisions remain unavailable where not implemented.',
      'Clock rules come from runtime IANA/ICU data and can change for future dates. Matching zone names or UTC offsets does not verify geographic location.',
      'Differences describe calculations and named conventions, not correlations with outcomes or objectively favorable or unfavorable future dates.',
    ] };
}

const escapeText = value => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
function foldLine(line) {
  const encoder = new TextEncoder(), lines = []; let current = '', bytes = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (bytes + length > 75) { lines.push(current); current = ' '; bytes = 1; }
    current += char; bytes += length;
  }
  lines.push(current); return lines.join('\r\n');
}
const icalDate = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

/** Manual import of one exact study instant. No recurrence, reminders, account,
 * network write or inferred event duration. An explicit generatedAtISO supplies
 * DTSTAMP; second-resolution ICS truncation is disclosed in the description.
 */
export function exportCalendarAlignmentICS(input, options = {}) {
  optionsFor(options, ['familyIds','variantIds','includeContext','generatedAtISO']);
  if (options.includeContext !== undefined && typeof options.includeContext !== 'boolean') throw new TypeError('includeContext must be a boolean.');
  if (typeof options.generatedAtISO !== 'string') throw new RangeError('Supply generatedAtISO explicitly for the calendar file creation time.');
  const generated = parseExplicitInstant(options.generatedAtISO);
  if (generated.getUTCFullYear() < 1) throw new RangeError('iCalendar creation time requires a positive four-digit calendar year.');
  const alignment = buildCalendarAlignment(input, selection(options));
  const context = alignment.context, at = new Date(context.dateISO), include = options.includeContext === true;
  const description = [
    'Calendar study moment. Manual import only; not a calendar subscription or an outcome prediction.',
    'Original selected instant: ' + context.dateISO + '. iCalendar date-times are exported at whole-second precision.',
    'Selected methods: ' + alignment.legend.map(row => row.label).join('; '),
    ...(include ? ['Observer zone: ' + context.timeZone + '. Coordinates: ' + context.lat + ', ' + context.lon + '.',
      ...alignment.legend.map(row => row.label + ': ' + row.summary + ' [' + row.status + '; ' + row.boundary + ']')]
      : ['Observer coordinates, time zone, local date labels, personal birth data and private notes are omitted.']),
  ].join('\n');
  // Identity includes the full disclosed context rather than a short hash that
  // could collide or merge different observers. No observer input enters a
  // default public UID. Percent-encoding keeps the value on one content line.
  const uidSeed = [context.dateISO, generated.toISOString(), alignment.selection.variantIds.join(','), include,
    ...(include ? [context.lat,context.lon,context.timeZone,context.system,context.prayerMethod,context.asr,context.highLatitude] : [])].join('|');
  const uid = 'astrology-sim-ant-' + encodeURIComponent(uidSeed) + '@occult-kranti.github.io';
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Astrologers Workbench//Calendar Alignment 1//EN','CALSCALE:GREGORIAN',
    'BEGIN:VEVENT','UID:' + uid,'DTSTAMP:' + icalDate(generated),'DTSTART:' + icalDate(at),
    'SUMMARY:Calendar study moment','DESCRIPTION:' + escapeText(description),'TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR'];
  return { text:lines.map(foldLine).join('\r\n') + '\r\n', filename:'calendar-study-' + context.dateISO.slice(0,10) + '.ics',
    disclosure:{ includeContext:include, providerSync:'manual-import-only', privateBirthIncluded:false, coordinatesIncluded:include, timeZoneIncluded:include,
      precision:'Whole-second UTC DATE-TIME; original milliseconds retained in the description.', duration:'Zero-duration study marker; no astronomical or civil-day duration is inferred.' } };
}
