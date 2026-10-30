// Read-only public horizon adapters. Recompute from explicit cases and dates;
// never accept imported ledgers, precomputed charts, births or model prompts.
import { buildEventHorizon, getHorizonDayDetail, getHorizonHourlyDetail, normalizeHorizonRequest, horizonDates, HORIZON_LIMITS } from '../assets/js/core/event-horizon.js';
import { HORIZON_PURPOSES } from '../assets/js/core/horizon-ranking.js';
import { HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';

export const HORIZON_MCP_LIMITS = Object.freeze({ scanDays: 31, scanCases: 2, outputBytes: 1300000 });
const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const text = (minLength, maxLength, description) => ({ type: 'string', minLength, maxLength, ...(description ? { description } : {}) });
const choice = values => ({ type: 'string', enum: [...values] });
const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const boolean = { type: 'boolean' };
const list = (items, minItems, maxItems, uniqueItems = false) => ({ type: 'array', items, minItems, maxItems, ...(uniqueItems ? { uniqueItems: true } : {}) });
const date = text(10, 10, 'Explicit YYYY-MM-DD within ' + HORIZON_LIMITS.minDate + '–' + HORIZON_LIMITS.maxDate + '; inclusive civil-date endpoints.');
const observerCase = object({
  id: text(1, 40, 'Lowercase letter followed by lowercase letters, digits or hyphens.'), label: text(1, 100),
  lat: number(-90, 90), lon: number(-180, 180), timeZone: text(1, 100, 'Explicit IANA zone; geographic correspondence is not automatically verified.'),
  sampleTime: text(5, 8, 'Explicit HH:mm or HH:mm:ss local sample clock; no birth time is inferred.'),
  system: choice(HOUSE_SYSTEMS), disambiguation: choice(['reject', 'earlier', 'later']),
}, ['id', 'lat', 'lon', 'timeZone', 'sampleTime']);
const purposes = list(choice(HORIZON_PURPOSES.map(row => row.id)), 1, HORIZON_PURPOSES.length, true);
const scanSchema = object({ startDate: date, endDate: date, cases: list(observerCase, 1, HORIZON_MCP_LIMITS.scanCases), purposeIds: purposes, mode: choice(['optimized', 'brute']), includeAstronomy: boolean, includeObservances: boolean }, ['startDate', 'endDate', 'cases', 'purposeIds']);
const daySchema = object({ date, observerCase, purposeIds: purposes, includeHourly: boolean, includeAstronomy: boolean, includeObservances: boolean }, ['date', 'observerCase', 'purposeIds']);

function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(path + ' must be a plain JSON object.');
    for (const key of Reflect.ownKeys(value)) if (typeof key !== 'string' || !Object.hasOwn(schema.properties, key)) throw new TypeError('Unknown ' + path + ' field.');
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError('Missing ' + path + '.' + key + '.');
    for (const [key, item] of Object.entries(value)) validate(schema.properties[key], item, path + '.' + key);
  } else if (schema.type === 'array') {
    if (!Array.isArray(value) || value.length < schema.minItems || value.length > schema.maxItems) throw new RangeError(path + ' exceeds the declared array bounds.');
    if (schema.uniqueItems && new Set(value).size !== value.length) throw new RangeError(path + ' entries must be distinct.');
    for (let i = 0; i < value.length; i++) { if (!Object.hasOwn(value, i)) throw new TypeError(path + ' cannot contain empty entries.'); validate(schema.items, value[i], path + '[' + i + ']'); }
  } else {
    if (typeof value !== schema.type) throw new TypeError(path + ' must be ' + schema.type + '.');
    if (schema.enum && !schema.enum.includes(value)) throw new RangeError(path + ' is not an allowed choice.');
    if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(path + ' is outside its supported range.');
    if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 2000))) throw new RangeError(path + ' has an invalid text length.');
  }
}
function finish(result) {
  const bytes = JSON.stringify(result);
  if (new TextEncoder().encode(bytes).length > HORIZON_MCP_LIMITS.outputBytes) throw new RangeError('Horizon response exceeds 1.3 MB. Narrow the requested date range, cases or optional detail; no rows were silently truncated.');
  return JSON.parse(bytes);
}
function define(name, description, inputSchema, calculate) {
  return { name, description, inputSchema, calculate(args) { validate(inputSchema, args); return calculate(args).then(finish); } };
}
const disclosure = Object.freeze({ explicitObserverIncluded: true, birthIncluded: false, storedRecordsRead: false, modelUsed: false, remoteCalendarConnected: false, note: 'Inputs and computed public observer cases are returned to this MCP client. No browser record, provider key, model request or authenticated calendar synchronization is used.' });

export const HORIZON_MCP_TOOLS = [
  define('workbench_horizon_scan', 'Compute the complete requested horizon ledger for at most 31 inclusive civil dates and two explicit observer cases, within 2026-01-01–2031-01-01. Require local sample clocks and named editorial purpose profiles. Every date/case row remains, including missing clocks and unrankable profiles; no silent truncation. Optional astronomical root searches are off by default; selected observance projections default on. Scores are source-qualified modern study indices, never whole-day good/bad forecasts, religious consensus or probabilities.', scanSchema, async args => {
    const request = normalizeHorizonRequest({ ...args, includeAstronomy: args.includeAstronomy ?? false, includeObservances: args.includeObservances ?? true });
    if (horizonDates(request.startDate, request.endDate).length > HORIZON_MCP_LIMITS.scanDays) throw new RangeError('Remote horizon scans allow at most 31 inclusive dates. The local horizon supports its separately declared full range.');
    const result = await buildEventHorizon(request);
    return { ...result, mcpDisclosure: disclosure, adapterLimits: HORIZON_MCP_LIMITS };
  }),
  define('workbench_horizon_day', 'Recompute one explicit horizon civil date, observer case, local sample clock and selected purpose profiles. Return the canonical comparison, rule evidence, exact source limits, applicable event/observance projections and optional hourly guidance. Hourly segments sample rule evidence; they are not exact transition searches or hourly purpose rankings. Astronomy is optional and off by default. No incoming chart, ledger, birth or oracle draw is accepted.', daySchema, async args => {
    const request = normalizeHorizonRequest({ startDate: args.date, endDate: args.date, cases: [args.observerCase], purposeIds: args.purposeIds, mode: 'optimized', includeAstronomy: args.includeAstronomy ?? false, includeObservances: args.includeObservances ?? true });
    const ledger = await buildEventHorizon(request), caseId = request.cases[0].id;
    const detail = getHorizonDayDetail(ledger, caseId, args.date);
    detail.purposes = detail.purposes.filter(profile => request.purposeIds.includes(profile.id));
    const hourly = args.includeHourly ? getHorizonHourlyDetail(ledger, caseId, args.date) : null;
    return { schemaVersion: 1, kind: 'event-horizon-day', request, counts: ledger.counts, detail, hourly, sources: ledger.sources,
      limitations: [...ledger.limitations, 'Purpose detail is restricted to the explicitly requested profiles. Optional hourly guidance remains the canonical unranked segment evidence.'],
      mcpDisclosure: disclosure, adapterLimits: HORIZON_MCP_LIMITS };
  }),
];

export const HORIZON_MCP_COVERAGE = Object.freeze({
  'event-horizon': { mcpTools: HORIZON_MCP_TOOLS.map(row => row.name), outputPaths: ['data.cases', 'data.counts', 'data.detail', 'data.hourly'], scope: 'Complete remote windows are bounded to 31 inclusive dates and two cases. One-day detail recomputes canonical evidence and optional unranked hourly guidance. Explicit source/missingness limits remain; no universal luck or religious score.' },
});
