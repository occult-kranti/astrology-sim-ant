// Read-only, bounded adapters over the canonical sampled-date search.
// Typed filter arrays avoid an untyped string/number union in the MCP schema.
import { normalizeTimelineSearchRequest, buildTimelineSearch, buildTimelineSearchDate } from '../assets/js/core/timeline-search.js';
import { SEARCH_CRITERIA_CATALOG } from '../assets/js/core/calendar-search.js';
import { ASTROCARTOGRAPHY_BODY_IDS, ASTROCARTOGRAPHY_ANGLE_IDS } from '../assets/js/core/astrocartography.js';
import { HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';
import { PRAYER_METHODS } from '../assets/js/core/cultural-calendars.js';
import { validateWorkbenchContract } from './workbench-rag-adapters.mjs';

const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const text = (maxLength, minLength = 1) => ({ type: 'string', minLength, maxLength });
const choice = values => ({ type: 'string', enum: [...values] });
const number = (minimum, maximum, integer = false) => ({ type: integer ? 'integer' : 'number', minimum, maximum });
const list = (items, maxItems, minItems = 0, uniqueItems = false) => ({ type: 'array', items, minItems, maxItems, ...(uniqueItems ? { uniqueItems } : {}) });
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

export const TIMELINE_SEARCH_MCP_LIMITS = freeze({ scanDates: 366, selectedDateGridDates: 3660, criteria: 8, summaryMatches: 12, outputBytes: 131072 });
export const timelineSearchTimelineSchema = freeze(object({
  startDate: text(10, 10), endDate: text(10, 10), time: text(8, 5), timeZone: text(120),
  lat: number(-90, 90), lon: number(-180, 180), system: choice(HOUSE_SYSTEMS),
  disambiguation: choice(['reject', 'earlier', 'later']),
  includeCatalogStars: { type: 'boolean' }, includeGuidance: { type: 'boolean' },
  prayerMethod: choice(PRAYER_METHODS.map(row => row[0])), asr: choice(['Shafi', 'Hanafi']),
  highLatitude: choice(['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle']),
}, ['startDate', 'endDate', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation']));

export const timelineSearchMapSchema = freeze(object({
  mode: choice(['none', 'transit', 'fixed']), fixedInstantISO: text(40, 20),
  bodyIds: list(choice(ASTROCARTOGRAPHY_BODY_IDS), 10, 1, true),
  angleIds: list(choice(ASTROCARTOGRAPHY_ANGLE_IDS), 4, 1, true),
  maxDistanceKm: number(1, 3000), minimumLines: number(1, 40, true),
}, ['mode']));

export const timelineSearchRequestSchema = freeze(object({
  timeline: timelineSearchTimelineSchema,
  calendarIds: list(choice(SEARCH_CRITERIA_CATALOG.calendars.map(row => row.id)), 13, 1, true),
  weekdays: list(number(0, 6, true), 7, 1, true),
  lunarFilters: list(object({ field: choice(SEARCH_CRITERIA_CATALOG.lunar.map(row => row.field)), values: list(number(0, 60, true), 60, 1, true) }, ['field', 'values']), 8),
  calendarFilters: list(object({ calendar: choice(SEARCH_CRITERIA_CATALOG.calendars.map(row => row.id)), field: choice(SEARCH_CRITERIA_CATALOG.calendarFields), values: list(text(120), 60, 1, true) }, ['calendar', 'field', 'values']), 8),
  ruleFilters: list(object({ ruleId: choice(SEARCH_CRITERIA_CATALOG.rules.map(row => row.ruleId)), classifications: list(choice(SEARCH_CRITERIA_CATALOG.classifications), 4, 1, true) }, ['ruleId', 'classifications']), 8),
  map: timelineSearchMapSchema, mode: choice(['optimized', 'brute']),
}, ['timeline']));
export const timelineSearchSchema = freeze(object({ request: timelineSearchRequestSchema }, ['request']));
export const timelineSearchDateSchema = freeze(object({ request: timelineSearchRequestSchema, index: number(0, 3659, true) }, ['request', 'index']));

const disclosure = freeze({
  readOnly: true, networkUsed: false, modelUsed: false, privateRecordsRead: false,
  browserActionExecuted: false, browserBookmarksRead: false,
  note: 'Only explicitly supplied study inputs are read and returned to this MCP client. No saved chart, bookmark, model, remote calendar or account is accessed. Sampled coincidences and circular-phase reference tails are not probabilities of real-world outcomes.',
});

function normalizeTypedRequest(raw) {
  const { weekdays, lunarFilters, calendarFilters, ruleFilters, ...rest } = raw;
  const criteria = [
    ...(weekdays ? [{ kind: 'weekday', values: weekdays }] : []),
    ...(lunarFilters || []).map(row => ({ kind: 'lunar', ...row })),
    ...(calendarFilters || []).map(row => ({ kind: 'calendar', ...row })),
    ...(ruleFilters || []).map(row => ({ kind: 'rule', ...row })),
  ];
  if (criteria.length > TIMELINE_SEARCH_MCP_LIMITS.criteria) throw new RangeError('Select at most eight criteria across all typed filter arrays and weekdays.');
  return normalizeTimelineSearchRequest({ ...rest, criteria });
}
function datesIn(request) { return 1 + Math.round((Date.parse(request.timeline.endDate + 'T00:00:00Z') - Date.parse(request.timeline.startDate + 'T00:00:00Z')) / 86400000); }
function sourceSummary(sources) {
  return sources.map(source => ({
    id: source.id, title: source.title, url: source.url ?? null,
    locator: source.locator ?? source.section ?? null,
    readingDepth: source.readingDepth ?? source.status ?? 'Inherited source record; consult its linked method ledger.',
    rightsScope: source.rightsScope ?? source.rights ?? null,
  }));
}
function mapSummary(map) {
  if (map == null) return null;
  return { mode: map.mode, geometryInstantISO: map.geometryInstantISO, selectedNearCount: map.selectedNearCount,
    closestSelectedDistanceKm: map.closestSelectedDistanceKm, matched: map.matched, available: map.available };
}
function selectedRow(row) {
  return { index: row.index, date: row.date, status: row.status, sampleUTC: row.sampleUTC,
    matched: row.matched, fullyObserved: row.fullyObserved, criteriaResults: row.criteriaResults, map: mapSummary(row.map) };
}
function finish(value) {
  const result = { ...value, mcpDisclosure: disclosure, adapterLimits: TIMELINE_SEARCH_MCP_LIMITS };
  const encoded = JSON.stringify(result);
  if (new TextEncoder().encode(encoded).length > TIMELINE_SEARCH_MCP_LIMITS.outputBytes) {
    throw new RangeError('Timeline-search response exceeds 128 KiB. Narrow the supplied criteria; no calculated statistics or denominators were silently removed.');
  }
  return JSON.parse(encoded);
}

export async function runTimelineSearch(args) {
  validateWorkbenchContract(timelineSearchSchema, args);
  const request = normalizeTypedRequest(args.request);
  if (datesIn(request) > TIMELINE_SEARCH_MCP_LIMITS.scanDates) throw new RangeError('MCP timeline scans allow at most 366 inclusive dates; the local browser has its separately declared 3660-date bound.');
  const result = await buildTimelineSearch(request);
  const matched = result.rows.filter(row => row.fullyObserved && row.matched);
  const ordered = [...matched].sort((a, b) =>
    (b.map?.selectedNearCount ?? 0) - (a.map?.selectedNearCount ?? 0) ||
    (a.map?.closestSelectedDistanceKm ?? Infinity) - (b.map?.closestSelectedDistanceKm ?? Infinity) || a.index - b.index);
  const missingness = { totalDates: result.rows.length, fullyObservedDates: result.rows.filter(row => row.fullyObserved).length,
    fullyObservedScope: 'Availability of the requested match criteria and selected map conditions, not independent verification of every calendar method.',
    statusCounts: Object.fromEntries([...new Set(result.rows.map(row => row.status))].map(status => [status, result.rows.filter(row => row.status === status).length])),
    calendarAvailability: result.request.calendarIds.map(id => {
      const rows = result.rows.map(row => row.calendars.find(calendar => calendar.id === id));
      return { id, totalDates: rows.length, availableDates: rows.filter(row => row?.status === 'available').length,
        statusCounts: Object.fromEntries([...new Set(rows.map(row => row?.status ?? 'missing'))].map(status => [status, rows.filter(row => (row?.status ?? 'missing') === status).length])) };
    }),
    incompleteDates: result.rows.filter(row => !row.fullyObserved).map(row => ({ index: row.index, date: row.date, status: row.status, clockCode: row.slot?.code ?? null })) };
  return finish({ schemaVersion: result.schemaVersion, kind: 'timeline-search-mcp-summary', request: result.request,
    counts: result.counts, missingness, sampling: result.sampling, runtime: result.runtime, statistics: result.statistics, mapMethod: result.mapMethod,
    selectedMatches: ordered.slice(0, TIMELINE_SEARCH_MCP_LIMITS.summaryMatches).map(selectedRow),
    scope: { allDatesCalculated: true, completeStatisticsIncluded: true, matchedDates: matched.length,
      selectedMatchLimit: TIMELINE_SEARCH_MCP_LIMITS.summaryMatches, omittedMatchedDates: Math.max(0, matched.length - TIMELINE_SEARCH_MCP_LIMITS.summaryMatches),
      selectionOrder: 'Fully observed matched samples: selected near-line count descending, closest selected-line distance ascending, then chronological index. With map disabled, chronological order. This order is not an outcome ranking.',
      omissions: ['Full daily rows and raw series arrays', 'Per-date forty-line distance arrays and map polylines', 'Source metadata beyond identifier, title, URL, locator, reading depth and rights'],
      singleDateTool: 'Use workbench_timeline_search_date with the same typed request and index to recompute one complete date; it cannot recover full-range statistics by itself.' },
    sources: sourceSummary(result.sources), limitations: result.limitations });
}

export function runTimelineSearchDate(args) {
  validateWorkbenchContract(timelineSearchDateSchema, args);
  const request = normalizeTypedRequest(args.request);
  const result = buildTimelineSearchDate(request, args.index);
  return finish({ ...result, sources: sourceSummary(result.sources), scope: {
    selectedIndex: args.index, totalGridDates: datesIn(request), selectedDateCalculated: true, fullDateRangeScanned: false,
    scanStatisticsIncluded: false, allFortyLineDistancesIncludedWhenMapAvailable: true,
    omissions: ['Full-range scan statistics, correlations and reference-tail probabilities', 'Map display polylines', 'Additional source bibliography fields'],
    note: 'This is one fresh selected-clock calculation. It does not claim the date has a rare rank, a full-day crossing, or any measured outcome probability.',
  } });
}

export const TIMELINE_SEARCH_MCP_TOOLS = freeze([
  { name: 'workbench_timeline_search',
    description: 'Scan at most 366 explicit local-clock civil dates with up to eight typed calendar/lunar/weekday/rule filters and an optional changing event map or fixed known-instant map. Return complete search denominators and skeptical statistics, declared top-twelve matched samples, source limits and missingness. Conditional circular-phase reference tails require complete regularly spaced UTC samples and retain the full multiplicity family. No event probabilities, personal outcome forecasts, saved records, model calls, browser actions or silent statistical truncation. Typed filters normalize to the canonical request.',
    inputSchema: timelineSearchSchema, calculate: runTimelineSearch },
  { name: 'workbench_timeline_search_date',
    description: 'Recompute one selected index from an explicit timeline-search grid of at most 3660 civil dates. Preserve missing/gap/fold states and return the selected sample’s calendar/rule facts and all forty map-line distances when available. A fixed known-instant map stays fixed; a transit map uses the selected sample UTC. Does not scan other dates or supply full-window statistical rarity. Typed filters accept at most eight criteria. No saved chart, bookmark, model, account or browser execution.',
    inputSchema: timelineSearchDateSchema, calculate: runTimelineSearchDate },
]);
export const TIMELINE_SEARCH_MCP_COVERAGE = freeze({
  'timeline-search': { mcpTools: TIMELINE_SEARCH_MCP_TOOLS.map(tool => tool.name),
    outputPaths: ['data.request', 'data.counts', 'data.missingness', 'data.statistics', 'data.selectedMatches', 'data.row', 'data.sources', 'data.limitations', 'data.scope'],
    scope: 'Explicit sampled-date searches with a 366-date MCP scan bound or one freshly calculated selected date from a 3660-date local grid. Complete statistical denominators and declared summary omissions; no outcome-risk estimate or browser state.' },
});
