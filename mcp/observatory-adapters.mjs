// Explicit, bounded adapters for the existing observatory engines. These do not
// read a host clock, browser records, caller-supplied calculated rows or a URL.
import worldDataset from '../assets/data/world-events.json' with { type: 'json' };
import { searchCalendarDates, normalizeCalendarSearchRequest, SEARCH_CRITERIA_CATALOG } from '../assets/js/core/calendar-search.js';
import { createSigilDesign, makeSigilRecipe, SIGIL_MODES, SIGIL_PLANETS, SIGIL_PALETTES, SIGIL_CALENDARS } from '../assets/js/core/sigil-design.js';
import { SYMBOL_METHODS } from '../assets/js/core/symbols.js';
import { STUDY_LENSES } from '../assets/js/core/data/study-lenses.js';
import { worldEventsWindow, worldEventsFreshness } from '../assets/js/core/world-events.js';
import { PRAYER_METHODS } from '../assets/js/core/cultural-calendars.js';
import { HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';

const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const string = (maxLength, minLength = 1) => ({ type: 'string', minLength, maxLength });
const choice = values => ({ type: 'string', enum: values });
const number = (minimum, maximum, type = 'number') => ({ type, minimum, maximum });
const list = (items, maxItems, minItems = 1) => ({ type: 'array', items, minItems, maxItems });
const bool = { type: 'boolean' };
const clone = value => JSON.parse(JSON.stringify(value));
const moment = object({ dateISO: string(50), lat: number(-90, 90), lon: number(-180, 180), timeZone: string(100), system: choice(HOUSE_SYSTEMS) }, ['dateISO', 'lat', 'lon', 'timeZone']);
const observer = object({ lat: number(-90, 90), lon: number(-180, 180), timeZone: string(100), system: choice(HOUSE_SYSTEMS), prayerMethod: choice(PRAYER_METHODS.map(row => row[0])), asr: choice(['Shafi', 'Hanafi']), highLatitude: choice(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']) }, ['lat', 'lon', 'timeZone']);

// Also validate direct adapter calls. The transport validates the same finite
// schema independently; unknown fields and coercion are never forwarded.
function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`${path} must be a JSON object.`);
    for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties, key)) throw new TypeError(`Unknown ${path}.${key}.`);
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError(`Missing ${path}.${key}.`);
    for (const [key, item] of Object.entries(value)) validate(schema.properties[key], item, `${path}.${key}`);
  } else if (schema.type === 'array') {
    if (!Array.isArray(value) || value.length < schema.minItems || value.length > schema.maxItems) throw new RangeError(`${path} has an invalid array length.`);
    for (let index = 0; index < value.length; index++) {
      if (!Object.hasOwn(value, index)) throw new TypeError(`${path} must not contain empty entries.`);
      validate(schema.items, value[index], `${path}[${index}]`);
    }
  } else {
    if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(`${path} must be ${schema.type}.`);
    if (schema.enum && !schema.enum.includes(value)) throw new RangeError(`Unsupported ${path}.`);
    if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(`${path} is outside its supported range.`);
    if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 2000))) throw new RangeError(`${path} has an invalid text length.`);
  }
}
const tool = (name, description, inputSchema, calculate) => ({ name, description, inputSchema, calculate(args) { validate(inputSchema, args); return calculate(args); } });

const searchSchema = object({
  startDate: string(10, 10), endDate: string(10, 10), sampleTime: string(8, 5), observer,
  weekdays: list(number(0, 6, 'integer'), 7),
  lunarFilters: list(object({ field: choice(SEARCH_CRITERIA_CATALOG.lunar.map(row => row.field)), values: list(number(0, 60, 'integer'), 60) }, ['field', 'values']), 5),
  calendarFilters: list(object({ calendar: choice(SEARCH_CRITERIA_CATALOG.calendars.map(row => row.id)), field: choice(SEARCH_CRITERIA_CATALOG.calendarFields), values: list(string(120), 60) }, ['calendar', 'field', 'values']), 16),
  ruleFilters: list(object({ ruleId: choice(SEARCH_CRITERIA_CATALOG.rules.map(row => row.ruleId)), classifications: list(choice(SEARCH_CRITERIA_CATALOG.classifications), 4) }, ['ruleId', 'classifications']), 11),
  concurrence: object({ traditionId: choice(SEARCH_CRITERIA_CATALOG.traditions.map(row => row.id)), classification: choice(['favorable', 'caution']), minimum: number(1, 6, 'integer') }, ['traditionId', 'classification', 'minimum']),
  order: choice(['chronological', 'concurrence']), mode: choice(['optimized', 'brute']), maxResults: number(1, 31, 'integer'),
}, ['startDate', 'endDate', 'sampleTime', 'observer']);

const designSchema = object({
  mode: choice(SIGIL_MODES), text: string(160, 0), planet: choice(SIGIL_PLANETS), method: choice(SYMBOL_METHODS.kamea.map(row => row.id)),
  seed: number(0, 4294967295, 'integer'), symmetry: number(3, 24, 'integer'), rings: number(1, 6, 'integer'), rotation: number(0, 359), stroke: number(.5, 7),
  palette: choice(Object.keys(SIGIL_PALETTES)), showGrid: bool, moment, book: choice(STUDY_LENSES.map(row => row.id)), calendar: choice(SIGIL_CALENDARS), includeStudyContext: bool,
}, ['mode', 'seed', 'moment']);

export const OBSERVATORY_MCP_TOOLS = [
  tool('workbench_calendar_search', 'Search up to 31 civil dates using the existing brute-force or optimized calendar engine. Explicit local sample clock and observer required. Filters are ANDed; values within each filter are ORed. Missing/fold/gap samples and rule-count limits remain visible. Rankings describe named historical rules, not event predictions.', searchSchema, async args => {
    const criteria = [
      ...(args.weekdays ? [{ kind: 'weekday', values: args.weekdays }] : []),
      ...(args.lunarFilters || []).map(row => ({ kind: 'lunar', ...row })),
      ...(args.calendarFilters || []).map(row => ({ kind: 'calendar', ...row })),
      ...(args.ruleFilters || []).map(row => ({ kind: 'rule', ...row })),
    ];
    const request = normalizeCalendarSearchRequest({ startDate: args.startDate, endDate: args.endDate, sampleTime: args.sampleTime, observer: args.observer, criteria, ...(args.concurrence ? { concurrence: args.concurrence } : {}), order: args.order ?? 'chronological', maxDays: 31, maxResults: args.maxResults ?? 31 });
    const result = await searchCalendarDates(request, { mode: args.mode ?? 'optimized' });
    return { capabilityId: 'calendar-search', result, scope: 'Daily sampled search only; browser event/control studies and larger scans remain separate workflows.', limits: { maxDays: 31, maxResults: 31, criteria: 16 }, method: 'Canonical calendar-search.js; the response preserves its normalized request, missingness, method counts and sources.' };
  }),
  tool('workbench_sigil_design', 'Create a deterministic intention sigil, planetary square trace or geometric mandala with an explicit seed and study moment. Returns SVG and a reproducible recipe. Text and observer are omitted from the default recipe; geometry can still encode text. Optional study context echoes the explicitly supplied inputs. Procedural art, not model-generated imagery or a historical-authenticity claim.', designSchema, args => {
    const { includeStudyContext = false, ...input } = args;
    const design = createSigilDesign(input);
    const result = { capabilityId: 'sigil-design', title: design.title, method: design.method, svg: design.svg, recipe: makeSigilRecipe(design), sources: design.sources, disclosures: { procedural: true, modelCalled: false, textAndObserverInRecipe: false, studyContextIncluded: includeStudyContext, geometryMayEncodeText: true }, limitations: ['No saved notes, birth inputs or browser keys are read. The MCP client receives and may retain the arguments explicitly supplied to this tool.', 'This generates a drawing, not proof of efficacy or a tradition-specific initiation.'] };
    if (includeStudyContext) result.studyContext = { inputs: design.inputs, studySetup: design.studySetup };
    return result;
  }),
  tool('workbench_world_events', 'Read the curated public-date snapshot in an explicit one-to-six-calendar-month window. Sources, date-only precision, coverage gaps and source-review timestamps are retained. This does not crawl current events or forecast outcomes. Optional assessedAt is an explicit freshness comparison clock.', object({ referenceDate: string(10, 10), months: number(1, 6, 'integer'), country: choice(['all', ...worldDataset.coverage.map(row => row.id)]), category: choice(['all', 'election', 'international-day', 'campaign']), includeProvisional: bool, assessedAt: string(32, 20) }, ['referenceDate']), args => {
    const dataset = clone(worldDataset);
    return { capabilityId: 'world-events', window: worldEventsWindow(dataset, { referenceDate: args.referenceDate, months: args.months ?? 2, country: args.country ?? 'all', category: args.category ?? 'all', includeProvisional: args.includeProvisional ?? false }), freshness: args.assessedAt ? worldEventsFreshness(dataset, args.assessedAt) : null, sourceSnapshot: { reviewedAt: dataset.reviewedAt, method: dataset.method, sourceRequestCount: dataset.sourceRequestCount }, scope: 'Curated date-only agenda. No event clock, paired study, live-source refresh or prediction is inferred; use the dedicated study workflow with an explicitly acknowledged sample for interpretation.' };
  }),
];
