// Pure allowlisted calculations. No filesystem, account, clock, network or storage access.
import { compareMoment, buildCalendarOutlook } from '../assets/js/core/calendar-observatory.js';
import { buildDayGuidance } from '../assets/js/core/day-guidance.js';
import { exportCalendarAtlas, ATLAS_FAMILIES, ATLAS_VARIANTS } from '../assets/js/core/calendar-atlas.js';
import { calculateContext, normalizeCalculationInput, parseExplicitInstant } from '../assets/js/core/calculation-context.js';
import { createSymbolResult, SYMBOL_METHODS } from '../assets/js/core/symbols.js';
import { renderSymbolSVG } from '../assets/js/core/viz/symbol-svg.js';
import { normalizeSigilText } from '../assets/js/core/kamea.js';
import { gematria } from '../assets/js/core/kabbalah.js';
import { katapayadiDecode } from '../assets/js/core/yantra.js';
import { REGISTRY } from '../assets/js/core/registry.js';
import { getToolGuide } from '../assets/js/core/tool-guide.js';
import { REGISTRY_MCP_TOOLS } from './registry-adapters.mjs';
import { EXTENDED_MCP_TOOLS } from './extended-adapters.mjs';
import { HORIZON_MCP_TOOLS } from './horizon-adapters.mjs';
import { COUNTRY_HISTORY_MCP_TOOL } from './country-history-adapters.mjs';
import { buildSkySnapshot, buildSkyTimelineSync, SKY_BODIES } from '../assets/js/core/sky-dynamics.js';
import { buildCalendarAlignment } from '../assets/js/core/calendar-alignment.js';
import { buildSkyInterpretation, SKY_READING_LENSES } from '../assets/js/core/sky-interpretation.js';
import { retrieveSkySources } from '../assets/js/core/sky-source-retrieval.js';
import { findNextElection, OPERATIONS } from '../assets/js/core/election.js';
import { CALENDARS, PRAYER_METHODS, calendarAtInstant, civilToJD, fromJD, easter, qibla, prayerTimes } from '../assets/js/core/cultural-calendars.js';

const string = (maxLength = 120) => ({ type: 'string', maxLength });
const enumeration = values => ({ type: 'string', enum: values });
const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const integer = (minimum, maximum) => ({ ...number(minimum, maximum), type: 'integer' });
const bool = { type: 'boolean' };
const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const list = (items,maxItems,minItems=0) => ({type:'array',items,maxItems,minItems,uniqueItems:true});
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
  comparison: 'One explicit UTC instant, IANA zone and observer across independently named calendar and zodiac conventions. Civil calendar rows are not religious observance decisions; differences are not scored as agreement or predictive reliability.',
  calibration: 'Validate UTC instant, observer location and explicit conventions; never alter positions to match an interpretation.',
  limits: { inputBytes: 65536, outputBytes: 1500000, scanSamples: 256, scanHours: 168, textCodePoints: 256, outlookDays: 14 },
  privacy: 'No account, tracking, saved records or outbound requests. Only explicitly supplied tool arguments are calculated; MCP client/provider may retain their conversation.',
  sources: ['https://github.com/cosinekitty/astronomy', 'https://www.esotericarchives.com/agrippa/agripp2b.htm', 'https://github.com/batoulapps/adhan-js', 'https://github.com/occult-kranti/astrology-sim-ant/tree/main/docs'],
});
const define = (name, description, inputSchema, calculate) => ({ name, description, inputSchema, calculate });
export const TOOLS = [
  ...REGISTRY_MCP_TOOLS,
  ...EXTENDED_MCP_TOOLS,
  ...HORIZON_MCP_TOOLS,
  COUNTRY_HISTORY_MCP_TOOL,
  define('workbench_tool_guide', 'Explain a named calculator or reference capability: required inputs, source locators, output, local route and actual MCP/browser support. This is a guide, not a calculated chart or proof that the hosted service is current.', object({ capabilityId: enumeration(REGISTRY.map(row => row.id)), query: string(240), pagePath: string(300) }), args => getToolGuide(args)),
  define('workbench_sky_snapshot', 'Calculate Sun, Moon and all eight planet/dwarf-planet targets, tropical signs, apparent motion, uniform-orb aspects, optional bounded stellar layers and heliocentric J2000 vectors. Explicit observer supplied; 1900–2100. Projection, star catalogue and horizon limitations travel with the data; no inferred birth or interpretation.', object({dateISO:instant,...location,timeZone:string(),bodyIds:list(enumeration(SKY_BODIES.map(b=>b.id)),10,1),includeStars:bool,includeModernStars:bool,includeCatalogStars:bool,aspectOrb:number(0,10)},['dateISO','lat','lon','timeZone']), args=>{const {bodyIds,includeStars,includeModernStars,includeCatalogStars,aspectOrb,...input}=args;return buildSkySnapshot(input,{bodyIds,includeStars,includeModernStars,includeCatalogStars,aspectOrb});}),
  define('workbench_sky_timeline', 'Calculate a bounded geocentric timeline, not a fixed year table: at most 512 samples, 1024 exact solar/lunar quarter events and 3660 elapsed days. Use an explicit interval or a center with up to five years either side. Sampled paths can miss fast events; UTC grid and local clock labels are distinct. No observer or birth data.',object({centerISO:instant,startISO:instant,endISO:instant,yearsBefore:integer(0,5),yearsAfter:integer(0,5),stepDays:number(1/24,365),stepHours:number(1,8760),timeZone:string(),bodyIds:list(enumeration(SKY_BODIES.map(b=>b.id)),10,1),includeEvents:bool},['timeZone']),args=>buildSkyTimelineSync(args,{maxSamples:512,maxEvents:1024})),
  define('workbench_calendar_alignment', 'Align selected calendar/chart variants at the same UTC instant or intentionally compare the same wall clock in another IANA zone. Explicitly report mismatches, DST gaps/folds, shared inputs and unavailable methods. Does not verify that coordinates geographically belong to a zone, connect external calendars or measure outcome agreement.',object({dateISO:instant,...location,timeZone:string(),system:moment.system,prayerMethod:enumeration(PRAYER_METHODS.map(m=>m[0])),asr:enumeration(['Shafi','Hanafi']),highLatitude:enumeration(['MiddleOfTheNight','SeventhOfTheNight','TwilightAngle']),familyIds:list(enumeration(ATLAS_FAMILIES.map(x=>x.id)),7,1),variantIds:list(enumeration(ATLAS_VARIANTS.map(x=>x.id)),32,1),comparisonTimeZone:string(),clockMode:enumeration(['same-instant','same-local-clock']),disambiguation:enumeration(['reject','earlier','later'])},['dateISO','lat','lon','timeZone']),args=>{const {familyIds,variantIds,comparisonTimeZone,clockMode,disambiguation,...input}=args;return buildCalendarAlignment(input,{familyIds,variantIds,comparisonTimeZone,clockMode,disambiguation});}),
  define('workbench_sky_interpretation', 'Recompute a moment and explain selected Lilly, Agrippa and Jyotisha rules with exact measured inputs, source locators, source differences and unavailable scope. Outer planets receive no invented classical rules. Modern reflection purposes are labelled; these are not personal forecasts. Set includeObserver false to omit observer-dependent rule evidence.',object({dateISO:instant,...location,timeZone:string(),system:moment.system,lensIds:list(enumeration(SKY_READING_LENSES.map(x=>x.id)),3,1),planet:enumeration(SKY_BODIES.map(x=>x.id)),purpose:enumeration(['study','begin','complete']),includeObserver:bool},['dateISO','lat','lon','timeZone']),args=>{const{lensIds,planet,purpose,includeObserver,...input}=args;return buildSkyInterpretation(input,{lensIds,planet,purpose,includeObserver});}),
  define('workbench_source_search', 'Search the local selected-source paraphrase corpus with deterministic lexical retrieval. Returns source, edition, locator, rights, reading depth and relevance terms. No full-book corpus, trained model, embeddings, web search or proof of historical interpretation.',object({query:string(1000),limit:integer(1,8),lensIds:list(enumeration(['lilly','agrippa','jyotisha','astronomy']),4)},['query']),args=>{const{query,...options}=args;return retrieveSkySources(query,options);}),
  define('workbench_catalogue', 'Search existing study capabilities and direct tool links; catalogue presence does not mean an MCP calculation is implemented.', object({ query: string(160) }), args => {
    const q = (args.query || '').toLowerCase();
    return { mcpTools: TOOLS.map(t => t.name), capabilities: REGISTRY.filter(r => `${r.title} ${r.computes} ${r.book}`.toLowerCase().includes(q)).map(r => ({ id: r.id, title: r.title, computes: r.computes, citation: r.citation, pages: r.pages.map(p => new URL(p, 'https://occult-kranti.github.io/astrology-sim-ant/').href) })) };
  }),
  define('workbench_chart', 'Compute explicit-time Western chart, planetary hour and optional Vedic chart through the same context as the Studio. Unknown birth time requires date-only Nativity, not guessed houses.', object({ ...moment, birth: object(moment, ['dateISO', 'lat', 'lon']), referenceDateISO: instant, includeVedic: bool, sectAwareFortune: bool }, ['dateISO', 'lat', 'lon']), args => calculateContext({ ...args, includeReading: false })),
  define('workbench_full_reading', 'Compute the canonical composed reading: explicit moment, dignity ledger, aspects, cautions, lots, lunar condition and selected traditional interpretation. Optional exact birth enables its documented natal subset. Returns actual requested/used house conventions and limitations; no inference of missing birth time or empirical predictions.',object({...moment,birth:object(moment,['dateISO','lat','lon']),referenceDateISO:instant,includeVedic:bool,sectAwareFortune:bool,operationKey:enumeration(OPERATIONS.map(x=>x.key)),quesitedHouse:integer(1,12)},['dateISO','lat','lon']),args=>{
    if(args.birth&&parseExplicitInstant(args.referenceDateISO??args.dateISO)<parseExplicitInstant(args.birth.dateISO))throw new RangeError('Personal evaluation cannot precede the supplied birth instant.');
    return calculateContext({...args,includeReading:true});
  }),
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
  define('workbench_compare_moment', 'Compare one explicit instant and observer across supported civil calendars, tropical and approximate Lahiri sidereal conventions, planetary hours and method-labelled prayer times. Does not predict outcomes or determine religious observances.', object({ dateISO: instant, ...location, timeZone: string(), system: moment.system, prayerMethod: enumeration(PRAYER_METHODS.map(m => m[0])), asr: enumeration(['Shafi', 'Hanafi']), highLatitude: enumeration(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']) }, ['dateISO', 'lat', 'lon', 'timeZone']), args => compareMoment(args)),
  define('workbench_calendar_outlook', 'Compute 1–14 bounded daily calendar/sky study snapshots in an explicit IANA zone. Local civil dates retain DST semantics; sampled labels are not exact transition times or validated forecasts.', object({ dateISO: instant, ...location, timeZone: string(), system: moment.system, prayerMethod: enumeration(PRAYER_METHODS.map(m => m[0])), asr: enumeration(['Shafi', 'Hanafi']), highLatitude: enumeration(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']), startDate: string(10), days: integer(1, 14), sampleTime: string(5) }, ['dateISO', 'lat', 'lon', 'timeZone']), args => buildCalendarOutlook(args)),
  define('workbench_explain_guidance', 'Explain historical rule classes at one explicit UTC instant and supplied observer. Returns calculated planetary inputs, thresholds, source status, coexisting testimonies and optional modern reflection actions. Includes the supplied location and temporal-hour context; no stored data, external model, whole-day verdict or outcome prediction.', object({ dateISO: instant, ...location, timeZone: string(), system: moment.system }, ['dateISO', 'lat', 'lon', 'timeZone']), args => buildDayGuidance(args)),
  define('workbench_calendar_atlas', 'Compare named calendar and chart variants at one explicit instant and observer. Select one family, one variant or all catalogued methods; unavailable variants retain their source limitations. Returns supplied observer context, never saved birth data, personal predictions or a claim of complete cultural coverage.', object({ dateISO: instant, ...location, timeZone: string(), system: moment.system, prayerMethod: enumeration(PRAYER_METHODS.map(m => m[0])), asr: enumeration(['Shafi', 'Hanafi']), highLatitude: enumeration(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']), family: enumeration(ATLAS_FAMILIES.map(row => row.id)), variant: enumeration(ATLAS_VARIANTS.map(row => row.id)) }, ['dateISO', 'lat', 'lon', 'timeZone']), args => {
    const { family, variant, ...input } = args;
    return exportCalendarAtlas(input, { ...(family ? { familyIds: [family] } : {}), ...(variant ? { variantIds: [variant] } : {}) });
  }),
  define('workbench_julian_day', 'Convert validated Gregorian or Julian civil date to astronomical Julian Day and both civil calendars (years 1–9999).', object({ date: string(10), calendar: enumeration(['gregorian', 'julian']), utcHours: number(0, 23.999999) }, ['date']), args => fromJD(civilToJD(args.date, args.calendar, args.utcHours))),
  define('workbench_easter', 'Ecclesiastical Easter using explicitly selected Gregorian or Julian computus; not an observed lunar date.', object({ year: integer(1583, 4099), method: enumeration(['gregorian', 'julian']) }, ['year']), args => easter(args.year, args.method)),
  define('workbench_qibla', 'Initial great-circle bearing toward the Kaaba, degrees clockwise from true north; singular positions reported by the engine.', object(location, ['lat', 'lon']), args => ({ ...qibla(args.lat, args.lon), convention: 'True-north initial great-circle bearing; not a calibrated phone compass.' })),
  define('workbench_prayer_times', 'Adhan deterministic prayer times with explicit civil date, IANA zone, method, Asr and high-latitude convention. Polar unresolved results remain unavailable.', object({ date: string(10), latitude: location.lat, longitude: location.lon, timeZone: string(), method: enumeration(PRAYER_METHODS.map(m => m[0])), asr: enumeration(['Shafi', 'Hanafi']), highLatitude: enumeration(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']), ishaAdjustment: integer(-120, 120) }, ['date', 'latitude', 'longitude', 'timeZone']), args => prayerTimes(args)),
  define('workbench_election', 'Bounded historical election scoring, not a prediction or advice. Up to 168 hours and 256 samples; returns ranked windows and source conventions.', object({ ...moment, operationKey: enumeration(OPERATIONS.map(o => o.key)), hoursAhead: number(0, 168), stepMinutes: number(1, 1440) }, ['dateISO', 'lat', 'lon', 'operationKey']), args => {
    const inputs = normalizeCalculationInput({ ...args, includeReading: false, includeVedic: false });
    const start = parseExplicitInstant(inputs.dateISO), hoursAhead = args.hoursAhead ?? 72, stepMinutes = args.stepMinutes ?? 30;
    if (Math.floor(hoursAhead * 60 / stepMinutes) + 1 > METHODS.limits.scanSamples) throw new RangeError('MCP election scans allow 256 samples; shorten the horizon or increase stepMinutes.');
    parseExplicitInstant(new Date(start.getTime() + hoursAhead * 3600000).toISOString());
    return { inputs, windows: findNextElection(args.operationKey, start, inputs.lat, inputs.lon, { hoursAhead, stepMinutes, system: inputs.system, timeZone: inputs.timeZone, utcOffset: inputs.utcOffset }), convention: 'Existing editorial Lilly/Picatrix scoring; local sunrise-bounded planetary day; not outcome probabilities.' };
  }),
];

// This deliberately supports only the finite schema vocabulary above. Reject unknown keys, non-finite values and type coercion.
export function validateArguments(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`${path} must be a JSON object.`);
    for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties, key)) throw new TypeError(`Unknown ${path}.${key}.`);
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError(`Missing ${path}.${key}.`);
    for (const [key, val] of Object.entries(value)) validateArguments(schema.properties[key], val, `${path}.${key}`);
    return;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value) || value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? 64)) throw new TypeError(`${path} has an invalid array length.`);
    if (schema.uniqueItems && new Set(value).size !== value.length) throw new RangeError(`${path} entries must be distinct.`);
    for(let index=0;index<value.length;index++){if(!Object.hasOwn(value,index))throw new TypeError(`${path} must not contain empty entries.`);validateArguments(schema.items,value[index],`${path}[${index}]`);}return;
  }
  if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(`${path} must be ${schema.type}.`);
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError(`Unsupported ${path}.`);
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(`${path} is outside the supported range.`);
  if (typeof value === 'string' && (value.length > (schema.maxLength ?? 2000) || value.length < (schema.minLength ?? 0))) throw new RangeError(`${path} is outside the supported text length.`);
}
export function callTool(name, args = {}) {
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new RangeError('Unknown Workbench tool.');
  validateArguments(tool.inputSchema, args);
  const data = tool.calculate(args);
  const finish=data=>{
    const result = { tool: name, schemaVersion: 1, data, context: 'Astronomical quantities and traditional symbolic interpretations are distinct; no guaranteed personal outcomes.' };
    if (new TextEncoder().encode(JSON.stringify(result)).length > METHODS.limits.outputBytes) throw new RangeError('Result exceeds the bounded response size. Narrow the request.');
    return result;
  };
  // Preserve synchronous callers for existing pure tools; bounded async search
  // adapters resolve through the same final output/size boundary.
  return data&&typeof data.then==='function'?Promise.resolve(data).then(finish):finish(data);
}
