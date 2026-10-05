// Pure allowlisted calculations. No filesystem, account, clock, network or storage access.
import { calculateContext, parseExplicitInstant } from '../assets/js/core/calculation-context.js';
import { createSymbolResult, SYMBOL_METHODS } from '../assets/js/core/symbols.js';
import { renderSymbolSVG } from '../assets/js/core/viz/symbol-svg.js';
import { normalizeSigilText } from '../assets/js/core/kamea.js';
import { gematria } from '../assets/js/core/kabbalah.js';
import { katapayadiDecode } from '../assets/js/core/yantra.js';
import { REGISTRY } from '../assets/js/core/registry.js';
import { findNextElection, OPERATIONS } from '../assets/js/core/election.js';
import { CALENDARS, PRAYER_METHODS, calendarAtInstant, civilToJD, fromJD, easter, qibla, prayerTimes } from '../assets/js/core/cultural-calendars.js';

const string = (maxLength = 120) => ({ type: 'string', maxLength });
const enumeration = values => ({ type: 'string', enum: values });
const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const integer = (minimum, maximum) => ({ ...number(minimum, maximum), type: 'integer' });
const bool = { type: 'boolean' };
const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const instant = { ...string(40), description: 'Explicit ISO datetime including Z or ±HH:MM; no implicit local times.' };
const location = { lat: number(-90, 90), lon: number(-180, 180) };
const moment = { dateISO: instant, ...location, system: enumeration(['regiomontanus', 'placidus', 'whole', 'equal']), timeZone: string(), utcOffset: number(-24, 24), disambiguation: enumeration(['reject', 'earlier', 'later']) };
export const METHODS = Object.freeze({
  schemaVersion: 1,
  scope: 'Study calculations, sourced historical rules and reproducible symbolic geometry; no claims of efficacy or universal religious authority.',
  astronomy: 'Vendored Astronomy Engine; apparent geocentric ecliptic-of-date coordinates. Modern independent fixtures are in scripts/tests/2026-10-calculations.mjs. Not blanket accuracy for antiquity.',
  western: 'Tropical; Regiomontanus, Placidus, whole-sign or equal houses; polar fallback disclosed in result. Exact time required.',
  vedic: 'Separate sidereal whole-sign chart, linear Lahiri estimate and mean nodes. Approximated strength components disclosed; not JHora equivalence.',
  symbolic: SYMBOL_METHODS,
  calendars: CALENDARS,
  calibration: 'Validate UTC instant, observer location and explicit conventions; never alter positions to match an interpretation.',
  limits: { inputBytes: 65536, outputBytes: 1500000, scanSamples: 256, scanHours: 168, textCodePoints: 256 },
  privacy: 'No account, tracking, saved records or outbound requests. Only explicitly supplied tool arguments are calculated; MCP client/provider may retain their conversation.',
  sources: ['https://github.com/cosinekitty/astronomy', 'https://www.esotericarchives.com/agrippa/agripp2b.htm', 'https://github.com/batoulapps/adhan-js', 'https://github.com/occult-kranti/astrology-sim-ant/tree/main/docs'],
});
const define = (name, description, inputSchema, calculate) => ({ name, description, inputSchema, calculate });
export const TOOLS = [
  define('workbench_catalogue', 'Search existing study capabilities and direct tool links; catalogue presence does not mean an MCP calculation is implemented.', object({ query: string(160) }), args => {
    const q = (args.query || '').toLowerCase();
    return { mcpTools: TOOLS.map(t => t.name), capabilities: REGISTRY.filter(r => `${r.title} ${r.computes} ${r.book}`.toLowerCase().includes(q)).map(r => ({ id: r.id, title: r.title, computes: r.computes, citation: r.citation, pages: r.pages.map(p => new URL(p, 'https://occult-kranti.github.io/astrology-sim-ant/').href) })) };
  }),
  define('workbench_chart', 'Compute explicit-time Western chart, planetary hour and optional Vedic chart through the same context as the Studio. Unknown birth time requires date-only Nativity, not guessed houses.', object({ ...moment, birth: object(moment, ['dateISO', 'lat', 'lon']), referenceDateISO: instant, includeVedic: bool, sectAwareFortune: bool }, ['dateISO', 'lat', 'lon']), args => calculateContext({ ...args, includeReading: false })),
  define('workbench_symbol', 'Generate a validated planetary kamea/name trace or sourced navagraha square with standalone SVG, accessible text, exact inputs and method provenance.', object({ kind: enumeration(['kamea', 'yantra']), planet: enumeration(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu']), text: string(512), method: enumeration(['latin', 'aiq', 'hebrew-standard', 'hebrew-gadol', 'navagraha']), size: integer(240, 1200), traceStep: integer(0, 256) }), args => {
    const { size, traceStep, ...input } = args;
    const result = createSymbolResult(input);
    return { ...result, presentation: renderSymbolSVG(result, { size: size ?? 480, traceStep }) };
  }),
  define('workbench_gematria', 'Hebrew standard or final-form mispar gadol letter arithmetic. Unsupported alphabets are rejected; no inferred spiritual outcome.', object({ text: string(512), method: enumeration(['standard', 'gadol']) }, ['text']), args => {
    if (Array.from(args.text).length > 256) throw new RangeError('Use at most 256 characters.');
    const normalization = normalizeSigilText(args.text, 'hebrew');
    if (!normalization.normalized) throw new RangeError('Enter Hebrew letters.');
    return { ...gematria(normalization.normalized, { method: args.method }), normalization, units: 'dimensionless letter values', source: 'Existing cited Hebrew letter table in core/data/kabbalah-data.js' };
  }),
  define('workbench_katapayadi', 'Decode Sanskrit consonant numerals with the existing NFC-normalized IAST table and right-to-left digit convention; output states ignored characters.', object({ text: string(256) }, ['text']), args => {
    if (!args.text.trim() || /[^a-zāīūṛṝḷḹṅñṭḍṇśṣṃṁḥ\s.,;:!?()’'\-]/iu.test(args.text.normalize('NFC'))) throw new RangeError('Use Sanskrit IAST transliteration; unsupported characters cannot be decoded.');
    const result = katapayadiDecode(args.text);
    if (!result.digits.length) throw new RangeError('No complete numeral syllable was found.');
    return { ...result, method: 'Existing katapayadi table; input NFC normalization; inspect consonant trace and ignored characters.' };
  }),
  define('workbench_calendar', 'Convert an explicit instant to a selected civil calendar. Midnight boundary is disclosed; not religious observance determination. ICU data varies by runtime.', object({ dateISO: instant, calendar: enumeration(CALENDARS.map(c => c.id)), timeZone: string() }, ['dateISO', 'calendar']), args => ({ ...calendarAtInstant(parseExplicitInstant(args.dateISO), args.calendar, args.timeZone || 'UTC'), method: CALENDARS.find(c => c.id === args.calendar) })),
  define('workbench_julian_day', 'Convert validated Gregorian or Julian civil date to astronomical Julian Day and both civil calendars (years 1–9999).', object({ date: string(10), calendar: enumeration(['gregorian', 'julian']), utcHours: number(0, 23.999999) }, ['date']), args => fromJD(civilToJD(args.date, args.calendar, args.utcHours))),
  define('workbench_easter', 'Ecclesiastical Easter using explicitly selected Gregorian or Julian computus; not an observed lunar date.', object({ year: integer(1583, 4099), method: enumeration(['gregorian', 'julian']) }, ['year']), args => easter(args.year, args.method)),
  define('workbench_qibla', 'Initial great-circle bearing toward the Kaaba, degrees clockwise from true north; singular positions reported by the engine.', object(location, ['lat', 'lon']), args => ({ ...qibla(args.lat, args.lon), convention: 'True-north initial great-circle bearing; not a calibrated phone compass.' })),
  define('workbench_prayer_times', 'Adhan deterministic prayer times with explicit civil date, IANA zone, method, Asr and high-latitude convention. Polar unresolved results remain unavailable.', object({ date: string(10), latitude: location.lat, longitude: location.lon, timeZone: string(), method: enumeration(PRAYER_METHODS.map(m => m[0])), asr: enumeration(['Shafi', 'Hanafi']), highLatitude: enumeration(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']), ishaAdjustment: integer(-120, 120) }, ['date', 'latitude', 'longitude', 'timeZone']), args => prayerTimes(args)),
  define('workbench_election', 'Bounded historical election scoring, not a prediction or advice. Up to 168 hours and 256 samples; returns ranked windows and source conventions.', object({ ...moment, operationKey: enumeration(OPERATIONS.map(o => o.key)), hoursAhead: number(0, 168), stepMinutes: number(1, 1440) }, ['dateISO', 'lat', 'lon', 'operationKey']), args => {
    const start = parseExplicitInstant(args.dateISO), hoursAhead = args.hoursAhead ?? 72, stepMinutes = args.stepMinutes ?? 30;
    if (Math.floor(hoursAhead * 60 / stepMinutes) + 1 > METHODS.limits.scanSamples) throw new RangeError('MCP election scans allow 256 samples; shorten the horizon or increase stepMinutes.');
    parseExplicitInstant(new Date(start.getTime() + hoursAhead * 3600000).toISOString());
    return { windows: findNextElection(args.operationKey, start, args.lat, args.lon, { hoursAhead, stepMinutes, system: args.system ?? 'regiomontanus', timeZone: args.timeZone, utcOffset: args.utcOffset }), convention: 'Existing editorial Lilly/Picatrix scoring; local sunrise-bounded planetary day; not outcome probabilities.' };
  }),
];

// This deliberately supports only the finite schema vocabulary above. Reject unknown keys, non-finite values and type coercion.
export function validateArguments(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${path} must be an object.`);
    for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties, key)) throw new TypeError(`Unknown ${path}.${key}.`);
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError(`Missing ${path}.${key}.`);
    for (const [key, val] of Object.entries(value)) validateArguments(schema.properties[key], val, `${path}.${key}`);
    return;
  }
  if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(`${path} must be ${schema.type}.`);
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError(`Unsupported ${path}.`);
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(`${path} is outside the supported range.`);
  if (typeof value === 'string' && value.length > schema.maxLength) throw new RangeError(`${path} is too long.`);
}
export function callTool(name, args = {}) {
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new RangeError('Unknown Workbench tool.');
  validateArguments(tool.inputSchema, args);
  const data = tool.calculate(args);
  const result = { tool: name, schemaVersion: 1, data, context: 'Astronomical quantities and traditional symbolic interpretations are distinct; no guaranteed personal outcomes.' };
  if (new TextEncoder().encode(JSON.stringify(result)).length > METHODS.limits.outputBytes) throw new RangeError('Result exceeds the bounded response size. Narrow the request.');
  return result;
}
