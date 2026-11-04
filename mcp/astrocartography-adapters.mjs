// Canonical, bounded astrocartography summaries. No saved profiles, provider
// calls, geometry upload, browser control or automatic relocation action.
import { exportAstrocartography, exportAstrocartographyPlace, ASTROCARTOGRAPHY_BODY_IDS, ASTROCARTOGRAPHY_ANGLE_IDS } from '../assets/js/core/astrocartography.js';
import { ASTROCARTOGRAPHY_CITIES, ASTROCARTOGRAPHY_PURPOSES } from '../assets/js/core/data/astrocartography-data.js';
import { validateWorkbenchContract } from './workbench-rag-adapters.mjs';

const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const text = (maxLength, minLength = 1) => ({ type: 'string', minLength, maxLength });
const choice = values => ({ type: 'string', enum: [...values] });
const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const list = (items, maxItems, minItems = 1) => ({ type: 'array', items, minItems, maxItems, uniqueItems: true });

export const astrocartographyProfileSchema = object({
  name: text(100), localDate: text(10), localTime: text(8), timeZone: text(120),
  lat: number(-90, 90), lon: number(-180, 180), disambiguation: choice(['reject', 'earlier', 'later'])
}, ['name', 'localDate', 'localTime', 'timeZone', 'lat', 'lon', 'disambiguation']);

export const astrocartographyInputSchema = object({
  profile: astrocartographyProfileSchema,
  bodyIds: list(choice(ASTROCARTOGRAPHY_BODY_IDS), 10),
  angleIds: list(choice(ASTROCARTOGRAPHY_ANGLE_IDS), 4),
  purpose: choice(ASTROCARTOGRAPHY_PURPOSES.map(row => row.id)), radiusKm: number(1, 3000),
  system: choice(['regiomontanus', 'placidus', 'whole', 'equal']),
  cityIds: list(choice(ASTROCARTOGRAPHY_CITIES.map(row => row.id)), 40, 0)
}, ['profile']);

export const astrocartographyPlaceInputSchema = object({
  name: text(100), lat: number(-90, 90), lon: number(-180, 180), timeZone: text(120)
}, ['name', 'lat', 'lon', 'timeZone']);
export const astrocartographySchema = object({ inputs: astrocartographyInputSchema }, ['inputs']);
export const astrocartographyPlaceSchema = object({ inputs: astrocartographyInputSchema, place: astrocartographyPlaceInputSchema }, ['inputs', 'place']);
export const ASTROCARTOGRAPHY_MCP_MAX_BYTES = 32768;

const disclosure = Object.freeze({
  readOnly: true, networkUsed: false, modelUsed: false, privateRecordsRead: false,
  browserActionExecuted: false, fullMapGeometryIncluded: false,
  note: 'Only explicitly supplied inputs are read; they and the calculated summaries are visible to this MCP client. No saved birth library is accessed. Symbolic weights and line proximity do not establish outcomes or recommend a relocation.'
});
function finish(value) {
  const data = { ...value, mcpDisclosure: disclosure };
  if (new TextEncoder().encode(JSON.stringify(data)).length > ASTROCARTOGRAPHY_MCP_MAX_BYTES) {
    throw new RangeError('Astrocartography summary exceeds 32 KiB. Select fewer bodies or cities; no calculated fields were silently removed.');
  }
  return data;
}

export function runAstrocartography(args) {
  validateWorkbenchContract(astrocartographySchema, args);
  return finish(exportAstrocartography(args.inputs));
}
export function runAstrocartographyPlace(args) {
  validateWorkbenchContract(astrocartographyPlaceSchema, args);
  return finish(exportAstrocartographyPlace(args.inputs, args.place));
}

export const ASTROCARTOGRAPHY_MCP_TOOLS = Object.freeze([
  {
    name: 'workbench_astrocartography',
    description: 'Recompute a bounded astrocartography summary for an explicit recorded birth clock, IANA zone, observer and repeat-clock policy in 1900–2100. Selected Sun–Pluto ASC/DSC/MC/IC lines, crossings and public-city rankings retain their astronomical conventions, source limits and editorial scoring labels. Returns summary counts and selected facts, not global polylines or an outcome forecast. No saved profiles, network requests, model calls or browser actions.',
    inputSchema: astrocartographySchema, calculate: runAstrocartography
  },
  {
    name: 'workbench_astrocartography_place',
    description: 'Inspect one explicitly supplied location against a recomputed astrocartography study and a canonical relocated chart at the original UTC instant. Returns a bounded source-qualified summary of proximity, selected relocated facts, requested/actual house conventions and limitations. Place timezone changes display, never the original instant. No private record lookup, invented birth clock, full map geometry, universal good/bad score or automatic relocation recommendation.',
    inputSchema: astrocartographyPlaceSchema, calculate: runAstrocartographyPlace
  }
]);
export const ASTROCARTOGRAPHY_MCP_COVERAGE = Object.freeze({
  astrocartography: {
    mcpTools: ['workbench_astrocartography', 'workbench_astrocartography_place'],
    outputPaths: ['data.context', 'data.bodies', 'data.lineSummaries', 'data.crossings', 'data.cityRankings', 'data.distances', 'data.relocation', 'data.calendarFacts', 'data.sources', 'data.limitations'],
    scope: 'Explicit birth inputs and optional explicit place, recomputed by the canonical engine. Bounded summaries exclude global map geometry. Editorial symbolic rankings are not empirical outcome predictions; no browser state, saved profiles or model invocation.'
  }
});
