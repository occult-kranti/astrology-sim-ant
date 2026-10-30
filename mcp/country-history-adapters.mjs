// One bounded historical catalogue adapter. Toolkit registration is separate.
import { buildCountryHistoryStudy } from '../assets/js/core/country-history.js';
import { COUNTRY_HISTORY_RECORDS } from '../assets/js/core/data/country-history-records.js';

const RECORD_IDS = Object.freeze(COUNTRY_HISTORY_RECORDS.map(record => record.id));
const HOUSE_SYSTEMS = Object.freeze(['regiomontanus', 'placidus', 'whole', 'equal']);
const MAX_RESPONSE_BYTES = 1024 * 1024;
const inputSchema = {
  type: 'object', additionalProperties: false, required: ['recordIds'],
  properties: {
    recordIds: { type: 'array', minItems: 1, maxItems: 6, uniqueItems: true, items: { type: 'string', enum: [...RECORD_IDS] }, description: 'One to six distinct curated historical event records.' },
    houseSystem: { type: 'string', enum: [...HOUSE_SYSTEMS], description: 'Named house geometry convention for explicitly assumed historical day samples; defaults to regiomontanus.' },
    includeDaySensitivity: { type: 'boolean', description: 'Include bounded clock-sensitivity samples as assumptions, never recovered event times; defaults to false.' },
  },
};

function validate(args) {
  if (!args || typeof args !== 'object' || Array.isArray(args) || ![Object.prototype, null].includes(Object.getPrototypeOf(args))) throw new TypeError('Country history arguments must be a JSON object.');
  for (const key of Reflect.ownKeys(args)) if (!Object.hasOwn(inputSchema.properties, key)) throw new TypeError(`Unknown country history argument: ${String(key)}.`);
  if (!Object.hasOwn(args, 'recordIds') || !Array.isArray(args.recordIds) || args.recordIds.length < 1 || args.recordIds.length > 6) throw new RangeError('Select one to six curated historical record IDs.');
  for (let index = 0; index < args.recordIds.length; index++) {
    if (!Object.hasOwn(args.recordIds, index) || typeof args.recordIds[index] !== 'string' || !RECORD_IDS.includes(args.recordIds[index])) throw new RangeError('Every record ID must identify a curated historical record.');
  }
  if (new Set(args.recordIds).size !== args.recordIds.length) throw new RangeError('Historical record IDs must be distinct.');
  if (Object.hasOwn(args, 'houseSystem') && !HOUSE_SYSTEMS.includes(args.houseSystem)) throw new RangeError('Choose a supported house system.');
  if (Object.hasOwn(args, 'includeDaySensitivity') && typeof args.includeDaySensitivity !== 'boolean') throw new TypeError('includeDaySensitivity must be boolean.');
}

export const COUNTRY_HISTORY_MCP_TOOL = {
  name: 'workbench_country_history',
  description: 'Compare one to six curated historical country events through the canonical civil-calendar engine. Preserve date precision, sources, alternatives and explicit sample-clock assumptions. Optional historical day sensitivity shows house geometry under assumed clocks. No future date input, objective, country ranking or event-outcome prediction is accepted.',
  inputSchema,
  calculate(args) {
    validate(args);
    const result = buildCountryHistoryStudy({ recordIds: [...args.recordIds], houseSystem: args.houseSystem ?? 'regiomontanus', includeDaySensitivity: args.includeDaySensitivity ?? false });
    const bytes = new TextEncoder().encode(JSON.stringify(result)).byteLength;
    if (bytes > MAX_RESPONSE_BYTES) throw new RangeError('Historical study exceeds the one-mebibyte response bound. Select fewer records; no result was truncated.');
    return result;
  },
};
