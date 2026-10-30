// Read-only source catalogue and one explicitly assumed study frame.
import { buildEschatologyAtlas, buildEschatologyAtlasFrame, ESCHATOLOGY_ATLAS_FILTERS, ESCHATOLOGY_DATE_ROLES, ESCHATOLOGY_FRAME_SELECTIONS } from '../assets/js/core/eschatology-atlas.js';

const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const choice = values => ({ type: 'string', enum: [...values] });
const text = (minLength, maxLength, description) => ({ type: 'string', minLength, maxLength, description });
const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
export const eschatologyAtlasInputSchema = freeze(object({
  familyId: choice(ESCHATOLOGY_ATLAS_FILTERS.familyIds),
  claimKind: choice(ESCHATOLOGY_ATLAS_FILTERS.claimKinds),
  dateRole: choice(ESCHATOLOGY_DATE_ROLES),
  datedOnly: { type: 'boolean', description: 'Retain known partial dates as partial; this filter does not make them exact days.' },
}));
export const eschatologyFrameInputSchema = freeze(object({
  claimId: text(1, 160, 'An exact curated claim ID returned by workbench_eschatology_atlas.'),
  dateRole: choice(ESCHATOLOGY_DATE_ROLES),
  selection: choice(ESCHATOLOGY_FRAME_SELECTIONS),
  date: { ...text(10, 10, 'Required only for study-date: an explicitly chosen Gregorian day, independent of claim authenticity. Omit for source-date.'), pattern: '^(?:19[0-9]{2}|20[0-9]{2}|2100)-[0-9]{2}-[0-9]{2}$' },
  time: { ...text(5, 8, 'Explicit assumed local clock, HH:mm or HH:mm:ss.'), pattern: '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$' },
  timeZone: text(1, 100, 'Explicit IANA time zone. Future and historical legal-clock correctness is not established by the runtime.'),
  lat: { type: 'number', minimum: -90, maximum: 90 },
  lon: { type: 'number', minimum: -180, maximum: 180 },
  system: choice(['regiomontanus', 'placidus', 'whole', 'equal']),
  disambiguation: choice(['reject', 'earlier', 'later']),
  includeCatalogStars: { type: 'boolean' },
}, ['claimId', 'dateRole', 'selection', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation']));

function validate(schema, args) {
  if (!args || typeof args !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(args))) throw new TypeError('Arguments must be a plain JSON object.');
  for (const key of Reflect.ownKeys(args)) {
    if (typeof key !== 'string' || !Object.hasOwn(schema.properties, key)) throw new TypeError('Unknown argument.');
    const d = Object.getOwnPropertyDescriptor(args, key);
    if (!d.enumerable || !Object.hasOwn(d, 'value')) throw new TypeError('Only ordinary enumerable data fields are accepted.');
  }
  for (const key of schema.required) if (!Object.hasOwn(args, key)) throw new TypeError('Missing ' + key + '.');
  for (const [key, value] of Object.entries(args)) {
    const s = schema.properties[key];
    if (typeof value !== s.type) throw new TypeError('Invalid type for ' + key + '.');
    if (s.enum && !s.enum.includes(value)) throw new RangeError('Unknown ' + key + '.');
    if (typeof value === 'number' && (!Number.isFinite(value) || value < s.minimum || value > s.maximum)) throw new RangeError(key + ' is out of range.');
    if (typeof value === 'string' && (value.length < (s.minLength ?? 0) || value.length > (s.maxLength ?? 200) || s.pattern && !new RegExp(s.pattern).test(value))) throw new RangeError('Invalid ' + key + '.');
  }
}
const disclosure = freeze({ sourceImplementationOnly: true, hostedDeploymentVerified: false, modelUsed: false, storedRecordsRead: false,
  scope: 'Source assessment, typed catalogue relationships and explicit study calculations. No graph-derived affiliation, prophetic probability, government belief attribution or future military timing.' });
function finish(result) {
  const bytes = JSON.stringify({ ...result, mcpDisclosure: disclosure });
  if (new TextEncoder().encode(bytes).length > 1400000) throw new RangeError('Complete response exceeds 1.4 MB; narrow the catalogue filters. No rows were silently omitted.');
  return JSON.parse(bytes);
}
export function runEschatologyAtlas(args) { validate(eschatologyAtlasInputSchema, args); return finish(buildEschatologyAtlas(args)); }
export function runEschatologyFrame(args) { validate(eschatologyFrameInputSchema, args); return finish(buildEschatologyAtlasFrame(args)); }
export const ESCHATOLOGY_ATLAS_MCP_TOOLS = freeze([
  { name: 'workbench_eschatology_atlas', description: 'Inspect a curated source/claim catalogue with typed graph relationships and separate claimed-document, statement, publication, transmission, target and historical-context dates. Preserve unknowns, partial dates, allegation status and source dependence. Graph layout and catalogue links do not establish affiliation, secret coordination or causation.', inputSchema: eschatologyAtlasInputSchema, calculate: runEschatologyAtlas },
  { name: 'workbench_eschatology_frame', description: 'Inspect one curated date role or an explicit user-chosen study day. Require an assumed clock, observer, IANA zone, house system and DST policy. Eligible source days and explicit study days reuse canonical astronomy, thirteen civil conventions and three named Moon-reading lenses for study. Partial, alleged, unsupported or undated source roles retain source-only states. A calculated chart does not authenticate a document or date a prophecy. No outcome score or country objective.', inputSchema: eschatologyFrameInputSchema, calculate: runEschatologyFrame },
]);
export const ESCHATOLOGY_ATLAS_MCP_COVERAGE = freeze({ 'eschatology-atlas': {
  mcpTools: ESCHATOLOGY_ATLAS_MCP_TOOLS.map(t => t.name), outputPaths: ['data.claims', 'data.timeline', 'data.graph', 'data.selection', 'data.frame', 'data.readings', 'data.sources'],
  scope: 'The catalogue tool returns source records and typed relationships. The frame tool returns one explicitly assumed sample or a source-only state. No inferred prophetic day, hidden belief or outcome score.',
} });
