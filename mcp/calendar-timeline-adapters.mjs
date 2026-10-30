// One selected frame, recomputed from a strict explicit civil-date request.
// No caller-supplied chart, private context, free-form objective or saved record.
import { buildCalendarTimelineFrame } from '../assets/js/core/calendar-timeline.js';
import { HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';
import { PRAYER_METHODS } from '../assets/js/core/cultural-calendars.js';

const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
export const CALENDAR_TIMELINE_MCP_LIMITS = freeze({ minDate: '1900-01-01', maxDate: '2100-12-31', maxGridDates: 3660, framesPerCall: 1, outputBytes: 1300000 });
const object = (properties, required) => ({ type: 'object', properties, required, additionalProperties: false });
const text = (minLength, maxLength, description, pattern) => ({ type: 'string', minLength, maxLength, description, ...(pattern ? { pattern } : {}) });
const choice = values => ({ type: 'string', enum: [...values] });
const number = (minimum, maximum, type = 'number') => ({ type, minimum, maximum });
const date = text(10, 10, 'Explicit YYYY-MM-DD civil date, 1900-01-01 through 2100-12-31 inclusive. Both the selected local date and its UTC instant must be supported.', '^(?:19[0-9]{2}|20[0-9]{2}|2100)-[0-9]{2}-[0-9]{2}$');

export const calendarTimelineFrameInputSchema = freeze(object({
  startDate: date,
  endDate: date,
  time: text(5, 8, 'Explicit local sample clock HH:mm or HH:mm:ss, repeated on each date. This is a sampled instant, not a whole-day assessment.', '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$'),
  timeZone: text(1, 100, 'Explicit supported IANA time zone. Geographic correspondence to coordinates is not independently established.'),
  lat: number(-90, 90),
  lon: number(-180, 180),
  system: choice(HOUSE_SYSTEMS),
  disambiguation: choice(['reject', 'earlier', 'later']),
  index: number(0, CALENDAR_TIMELINE_MCP_LIMITS.maxGridDates - 1, 'integer'),
  includeCatalogStars: { type: 'boolean', description: 'Optional modern catalogue stars; defaults to false. Historical fixed-star task scores are not calculated.' },
  includeGuidance: { type: 'boolean', description: 'Optional source-qualified guidance and editorial study profiles; defaults to true. Dialogue and ceremony timing remain unimplemented.' },
  prayerMethod: choice(PRAYER_METHODS.map(row => row[0])),
  asr: choice(['Shafi', 'Hanafi']),
  highLatitude: choice(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']),
}, ['startDate', 'endDate', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation', 'index']));

function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(path + ' must be a plain JSON object.');
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string' || !Object.hasOwn(schema.properties, key)) throw new TypeError('Unknown ' + path + ' field.');
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError(path + ' must contain only ordinary JSON fields.');
    }
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError('Missing ' + path + '.' + key + '.');
    for (const [key, item] of Object.entries(value)) validate(schema.properties[key], item, path + '.' + key);
    return;
  }
  if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(path + ' must be ' + schema.type + '.');
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError(path + ' is not an allowed choice.');
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(path + ' is outside its supported range.');
  if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 2000) || schema.pattern && !new RegExp(schema.pattern).test(value))) throw new RangeError(path + ' has an invalid format or length.');
}

const disclosure = freeze({
  explicitObserverIncluded: true, birthIncluded: false, storedRecordsRead: false, modelUsed: false, remoteCalendarConnected: false,
  note: 'Explicit inputs and the complete selected frame are returned to this MCP client. No browser record, account calendar, private question, country objective, provider credential or model request is read.',
});
function finish(result) {
  const serialized = JSON.stringify(result);
  if (new TextEncoder().encode(serialized).length > CALENDAR_TIMELINE_MCP_LIMITS.outputBytes) throw new RangeError('Calendar timeline response exceeds 1.3 MB. Disable optional catalogue stars or guidance; no records were silently truncated.');
  return JSON.parse(serialized);
}

export function runCalendarTimelineFrame(args) {
  validate(calendarTimelineFrameInputSchema, args);
  const { index, ...request } = args;
  const result = buildCalendarTimelineFrame(request, index);
  return finish({ ...result, mcpDisclosure: disclosure, adapterLimits: CALENDAR_TIMELINE_MCP_LIMITS });
}

export const calendarTimelineMetadata = freeze({
  kind: 'calendar-timeline', sampling: 'One explicit local clock on every inclusive civil date; daily grid only.',
  limits: CALENDAR_TIMELINE_MCP_LIMITS,
  foldPolicy: 'reject preserves an ambiguous slot; earlier/later selects one candidate while retaining both UTC alternatives. Gaps and skipped civil dates remain unavailable.',
  calculation: 'The selected index is recomputed by the canonical frame engine. The remaining date grid is not an outcome search or a batch of calculated charts.',
  sourceScope: 'Existing selected-passage source records and existing editorial profiles are reused with their reading-depth and missingness limits. No new source reading is claimed by the adapter.',
  taskScope: 'Beginning, completion and study expose named editorial profiles. Dialogue and ceremony have no dedicated implemented timing method or score.',
});

export const CALENDAR_TIMELINE_MCP_TOOLS = freeze([{
  name: 'workbench_calendar_timeline_frame',
  description: 'Recompute one selected date-slider frame from a complete inclusive daily civil-date grid of at most 3660 dates within 1900–2100. Require an explicit local clock, observer, IANA zone, house system, fold policy and zero-based index. Return the canonical synchronized calendar/chart/sky fields and optional source-qualified guidance, including missing or ambiguous clocks. Optional catalogue stars default off and guidance defaults on. Study indices are modern editorial comparisons, not outcome predictions; dialogue and ceremony methods remain unimplemented. No free-form objectives, military planning, country or birth context is accepted. Return a complete bounded frame or a clear error; never silently truncate.',
  inputSchema: calendarTimelineFrameInputSchema,
  calculate: runCalendarTimelineFrame,
}]);

export const CALENDAR_TIMELINE_MCP_COVERAGE = freeze({
  'calendar-timeline': {
    mcpTools: CALENDAR_TIMELINE_MCP_TOOLS.map(row => row.name),
    outputPaths: ['data.slot', 'data.context', 'data.comparison', 'data.atlas', 'data.sky', 'data.charts', 'data.guidance', 'data.purposes', 'data.studyTasks'],
    scope: 'One complete selected frame from an explicit daily grid, with unresolved-clock missingness and independently stated source/implementation limits. No batch outcome forecast, event prediction or private context.',
  },
});
