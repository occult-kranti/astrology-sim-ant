// Stateless, source-qualified chronology and one explicitly chosen study instant.
import { buildNewtonChronology, buildNewtonExplorationFrame } from '../assets/js/core/newton-chronology.js';

const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
const choice = values => ({ type: 'string', enum: values });
export const newtonChronologyInputSchema = freeze({
  type: 'object', additionalProperties: false,
  properties: {
    date: { type: 'string', pattern: '^(?:19[0-9]{2}|20[0-9]{2}|2100)-[0-9]{2}-[0-9]{2}$', minLength: 10, maxLength: 10, description: 'An explicitly chosen civil study date, not a date Newton supplied. Canonical range 1900–2100.' },
    time: { type: 'string', pattern: '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$', minLength: 5, maxLength: 8 },
    timeZone: { type: 'string', minLength: 1, maxLength: 100, description: 'Explicit IANA time zone; future legal rules are projections of the runtime database.' },
    lat: { type: 'number', minimum: -90, maximum: 90 },
    lon: { type: 'number', minimum: -180, maximum: 180 },
    system: choice(['regiomontanus', 'placidus', 'whole', 'equal']),
    disambiguation: choice(['reject', 'earlier', 'later']),
    includeCatalogStars: { type: 'boolean' },
  },
  required: ['date', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation'],
});

function validate(args) {
  if (!args || typeof args !== 'object' || Array.isArray(args) || ![Object.prototype, null].includes(Object.getPrototypeOf(args))) throw new TypeError('Arguments must be a plain JSON object.');
  for (const key of Reflect.ownKeys(args)) {
    if (typeof key !== 'string' || !Object.hasOwn(newtonChronologyInputSchema.properties, key)) throw new TypeError('Unknown Newton chronology argument.');
    const descriptor = Object.getOwnPropertyDescriptor(args, key);
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError('Arguments must have ordinary enumerable data fields.');
  }
  for (const key of newtonChronologyInputSchema.required) if (!Object.hasOwn(args, key)) throw new TypeError('Missing ' + key + '.');
  for (const [key, value] of Object.entries(args)) {
    const schema = newtonChronologyInputSchema.properties[key];
    if (typeof value !== schema.type) throw new TypeError(key + ' must be ' + schema.type + '.');
    if (schema.enum && !schema.enum.includes(value)) throw new RangeError('Unsupported ' + key + '.');
    if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(key + ' is out of range.');
    if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 100) || schema.pattern && !new RegExp(schema.pattern).test(value))) throw new RangeError(key + ' has an invalid format.');
  }
}

export function runNewtonChronology(args) {
  validate(args);
  const result = {
    chronology: buildNewtonChronology(),
    frame: buildNewtonExplorationFrame(args),
    disclosure: {
      claim: 'Documented conditional chronology plus a separate canonical study frame. Numerical reproduction does not establish prophecy, astrology or state beliefs.',
      chosenDayIsPropheticDate: false, storedRecordsRead: false, modelUsed: false,
      hostedDeploymentVerified: false, observerExplicitlySupplied: true,
      scope: 'No country attribution, outcomes, objectives, scores or future military timing. The complete-year browser survey is not executed by this bounded adapter.',
    },
  };
  const bytes = JSON.stringify(result);
  if (new TextEncoder().encode(bytes).length > 1400000) throw new RangeError('Complete response exceeds the 1.4 MB bound; no content was silently truncated.');
  return JSON.parse(bytes);
}

export const NEWTON_CHRONOLOGY_MCP_TOOL = freeze({
  name: 'workbench_newton_chronology',
  description: 'Reconstruct the selected-source Newton chronology branches and calculate one separately chosen study date through the canonical calendars and astronomy. Requires an explicit clock, observer, IANA zone, house convention and DST policy. Retains conditional bounds, unresolved manuscript text, unknown prophetic day and missing clocks. No outcome score, national belief inference, country objective or batch attack timing. Source implementation does not establish hosted availability.',
  inputSchema: newtonChronologyInputSchema,
  calculate: runNewtonChronology,
});
export const NEWTON_CHRONOLOGY_MCP_COVERAGE = freeze({
  'newton-chronology': {
    mcpTools: [NEWTON_CHRONOLOGY_MCP_TOOL.name],
    outputPaths: ['data.chronology', 'data.frame', 'data.disclosure'],
    scope: 'Documented chronology and one explicit study frame. The full-year survey is a local browser operation. No score or inferred prophetic day; source variants and unknowns are preserved.',
  },
});
