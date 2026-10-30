// Explicit deterministic inputs only. No random draws, saved records, network,
// arbitrary imports, user-supplied charts, questions, or inferred birth details.
import { castFromTallies, geomanticJudgement, geomancyHouses } from '../assets/js/core/geomancy.js';
import { tarotReading, SPREADS } from '../assets/js/core/tarot.js';
import { DECK_IDS } from '../assets/js/core/data/tarot-deck.js';
import { linesFromThrows, castReading } from '../assets/js/core/iching.js';
import { castFromDraws, CASTING_METHODS } from '../assets/js/core/runes.js';
import { jungianReading, crossAspects, jungAspectHits, aeonClock, JUNG_EXPERIMENT } from '../assets/js/core/jung.js';
import { castChart } from '../assets/js/core/astro.js';
import { parseExplicitInstant, HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';
import { validateZone } from '../assets/js/core/cultural-calendars.js';
import { REGISTRY } from '../assets/js/core/registry.js';
import { prayerFor, PICATRIX_PRAYERS_FRAMING, PICATRIX_PRAYERS_SOURCE } from '../assets/js/core/data/picatrix-prayers.js';
import { mansionImage, MANSION_IMAGES_SOURCE } from '../assets/js/core/data/mansion-images.js';
import { planetImage, PLANET_IMAGES_SOURCE } from '../assets/js/core/data/planet-images.js';
import { WORKED_CHARTS } from '../assets/js/core/data/worked-charts.js';

const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const integer = (minimum, maximum) => ({ type: 'integer', minimum, maximum });
const enumeration = values => ({ type: 'string', enum: [...values] });
const array = (items, minItems, maxItems, uniqueItems = false) => ({ type: 'array', items, minItems, maxItems, uniqueItems });
const bool = { type: 'boolean' };
const instant = { type: 'string', minLength: 20, maxLength: 40, description: 'Explicit ISO datetime with Z or UTC offset, never an implicit local clock.' };
const momentProperties = { dateISO: instant, lat: number(-90, 90), lon: number(-180, 180), system: enumeration(HOUSE_SYSTEMS), timeZone: { type: 'string', minLength: 1, maxLength: 120 } };
const momentSchema = object(momentProperties, ['dateISO', 'lat', 'lon']);
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const lookupCapabilities = ['picatrix-prayers', 'mansion-images', 'planet-images', 'worked-charts'];
const lookupIds = [...planets, ...Array.from({ length: 28 }, (_, i) => String(i + 1)), ...WORKED_CHARTS.map(x => x.key)];
const copy = value => JSON.parse(JSON.stringify(value));

// Toolkit validates these schemas too. Local validation protects direct adapter
// calls and rejects coercions tolerated by several older in-browser helpers.
function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`${path} must be a plain JSON object.`);
    for (const key of Reflect.ownKeys(value)) if (typeof key !== 'string' || !Object.hasOwn(schema.properties, key)) throw new TypeError(`Unknown ${path} field.`);
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError(`Missing ${path}.${key}.`);
    for (const [key, item] of Object.entries(value)) validate(schema.properties[key], item, `${path}.${key}`);
    return;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value) || value.length < schema.minItems || value.length > schema.maxItems) throw new RangeError(`${path} has the wrong number of items.`);
    // Indexed validation rejects sparse arrays as well as malformed elements.
    for (let i = 0; i < value.length; i++) validate(schema.items, value[i], `${path}[${i}]`);
    if (schema.uniqueItems && new Set(value.map(x => JSON.stringify(x))).size !== value.length) throw new RangeError(`${path} items must be distinct.`);
    return;
  }
  if (schema.type === 'integer' ? !Number.isInteger(value) : typeof value !== schema.type) throw new TypeError(`${path} must be ${schema.type}.`);
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(`${path} is outside the bounded range.`);
  if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 200))) throw new RangeError(`${path} has an invalid text length.`);
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError(`${path} is not an allowed choice.`);
}

function frame(capabilityId, inputs, result, extra = {}) {
  const entry = REGISTRY.find(x => x.id === capabilityId);
  if (!entry) throw new Error('Missing fixed oracle capability.');
  return { capabilityId, inputs: copy(inputs), result: copy(result), source: entry.citation,
    sourceStatus: 'Inherited source-labelled browser implementation; this adapter is not a new primary-source collation or predictive validation.',
    method: 'Same deterministic browser core with explicit supplied inputs. No draw, question, birth record or interpretation is invented.',
    limitations: ['Traditional or symbolic meanings are study material, not a forecast, outcome probability or diagnosis.', 'MCP clients can retain explicitly supplied inputs; the adapter reads no saved browser data.'], ...extra };
}

function define(name, description, inputSchema, calculate) {
  return Object.freeze({ name, description, inputSchema, calculate: args => { validate(inputSchema, args); return calculate(args); } });
}

function chartFromMoment(input) {
  const date = parseExplicitInstant(input.dateISO), system = input.system ?? 'regiomontanus';
  const timeZone = input.timeZone === undefined ? null : validateZone(input.timeZone);
  const chart = castChart(date, input.lat, input.lon, system);
  return { chart, context: { dateISO: date.toISOString(), lat: input.lat, lon: input.lon, timeZone, requestedHouseSystem: system, actualHouseSystem: chart.system, houseWarning: chart.houseWarning || null,
    timeKnown: true, clockConvention: 'The ISO offset/Z supplies the instant. A supplied IANA zone is display context, not a guessed coordinate-to-zone match.' } };
}

export const ORACLE_MCP_TOOLS = Object.freeze([
  define('workbench_geomancy', 'Reproduce a geomantic shield and inherited house judgment from exactly sixteen caller-supplied positive tally counts. Never draws or invents marks. Explicit topic house; optional querent house. Historical symbolic judgment is not an outcome prediction.',
    object({ tallies: array(integer(1, 1000000), 16, 16), quesitedHouse: integer(1, 12), querentHouse: integer(1, 12) }, ['tallies', 'quesitedHouse']), args => {
      const shield = castFromTallies(args.tallies), querentHouse = args.querentHouse ?? 1;
      return frame('geomancy', { tallies: args.tallies, quesitedHouse: args.quesitedHouse, querentHouse }, { shield, houses: geomancyHouses(shield), judgement: geomanticJudgement(shield, args.quesitedHouse, { querentHouse }) }, { randomDrawPerformed: false, inputOrder: 'Four Mothers, each with four top-to-bottom line tallies; odd → one point, even → two points.' });
    }),
  define('workbench_tarot', 'Read an explicitly supplied named Tarot spread through the existing deck and elemental-dignity engine. Cards must be distinct and exactly match the selected spread count; each reversal must be a boolean. No shuffle or random card selection. Future/outcome position names describe the inherited symbolic spread, not validated future events.',
    object({ spreadKey: enumeration(Object.keys(SPREADS)), draws: array(object({ id: enumeration(DECK_IDS), reversed: bool }, ['id', 'reversed']), 1, 10) }, ['spreadKey', 'draws']), args => {
      if (args.draws.length !== SPREADS[args.spreadKey].count) throw new RangeError('Card count must match the selected spread.');
      if (new Set(args.draws.map(x => x.id)).size !== args.draws.length) throw new RangeError('The supplied Tarot draw must contain distinct cards.');
      return frame('tarot', args, tarotReading(args.spreadKey, args.draws), { randomDrawPerformed: false, reversalConvention: 'The Celtic Cross crossing position is read upright by the canonical engine even when its supplied reversal is true; input and applied orientation remain visible.' });
    }),
  define('workbench_iching', 'Reproduce a Yijing reading from exactly six caller-supplied three-coin line values, ordered bottom to top: 6 old yin, 7 young yang, 8 young yin, 9 old yang. Calculates primary, changing, nuclear and relating hexagrams. Does not toss coins; received symbolic meanings are not predictions.',
    object({ throws: array(integer(6, 9), 6, 6) }, ['throws']), args => {
      const { lines, changing } = linesFromThrows(args.throws);
      return frame('iching', args, castReading(lines, changing), { randomDrawPerformed: false, inputOrder: 'Bottom-to-top lines; 6/9 change, 7/8 remain stable.' });
    }),
  define('workbench_runes', 'Read explicit distinct Elder Futhark stave indices (0–23) in the selected one- or three-draw method. Never chooses staves or adds a blank rune. Preserves medieval poem material, modern meaning labels and the disputed Tacitus connection.',
    object({ indices: array(integer(0, 23), 1, 3, true), methodId: enumeration(CASTING_METHODS.map(x => x.id)) }, ['indices', 'methodId']), args => frame('runes', args, castFromDraws(args.indices, args.methodId), { randomDrawPerformed: false })),
  define('workbench_jung', 'Compute the inherited Jung/post-Jungian symbolic reading from an explicit moment and a freshly calculated chart. Optional explicit partner moment adds conjunction/opposition synastry; optional aeon clock retains its equal-sign/Lahiri and competing-date qualifications. No supplied charts, psychological diagnosis, inferred birth data or random marriage experiment.',
    object({ ...momentProperties, partner: momentSchema, synastryOrb: number(0, 15), includeAeonClock: bool }, ['dateISO', 'lat', 'lon']), args => {
      if (args.synastryOrb !== undefined && args.partner === undefined) throw new RangeError('A synastry orb requires an explicit partner moment.');
      const primaryInput = Object.fromEntries(Object.keys(momentProperties).filter(key => args[key] !== undefined).map(key => [key, args[key]]));
      const primary = chartFromMoment(primaryInput), result = { reading: jungianReading(primary.chart) };
      const contexts = { primary: primary.context };
      if (args.partner) {
        const partner = chartFromMoment(args.partner), orb = args.synastryOrb ?? JUNG_EXPERIMENT.orb;
        contexts.partner = partner.context;
        result.synastry = { orbDegrees: orb, crossAspects: crossAspects(primary.chart, partner.chart, { orb }), historicalAspectDisplay: jungAspectHits(primary.chart, partner.chart, { orb }), sense: 'Historical aspect display reports the closest of either direction; it is not the directional statistic of Jung’s original experiment.', outcomeProbability: null };
      }
      if (args.includeAeonClock) result.aeonClock = aeonClock(primary.chart.date);
      return frame('jung', { ...primaryInput, ...(args.partner ? { partner: args.partner, synastryOrb: args.synastryOrb ?? JUNG_EXPERIMENT.orb } : {}), includeAeonClock: args.includeAeonClock ?? false }, result,
        { calculationContext: contexts, randomDrawPerformed: false, unavailableOperations: ['Random marriage-experiment simulation; use the separate browser experiment with its disclosed random source.'], interpretationScope: 'Named historical and post-Jungian symbolic mappings; not a psychometric test, assessment of a person, compatibility probability or exact Age-of-Aquarius forecast.' });
    }),
  define('workbench_source_lookup', 'Return one existing source-labelled catalogue record by its exact capability and key: picatrix-prayers or planet-images use a traditional planet name; mansion-images uses a string number 1–28; worked-charts uses stolen-fish, ship-at-sea, marriage or dog. Static historical study lookup, not a newly calculated election, ritual instruction or verified outcome.',
    object({ capabilityId: enumeration(lookupCapabilities), id: enumeration(lookupIds) }, ['capabilityId', 'id']), args => {
      let result, source, interpretationScope;
      if (['picatrix-prayers', 'planet-images'].includes(args.capabilityId)) {
        if (!planets.includes(args.id)) throw new RangeError('This source catalogue requires a traditional planet name.');
        result = args.capabilityId === 'picatrix-prayers' ? prayerFor(args.id) : planetImage(args.id);
        source = args.capabilityId === 'picatrix-prayers' ? PICATRIX_PRAYERS_SOURCE : PLANET_IMAGES_SOURCE;
        interpretationScope = args.capabilityId === 'picatrix-prayers' ? PICATRIX_PRAYERS_FRAMING : 'Historical image and claimed purpose, with the original material/variant qualifications retained; not a recommendation or construction recipe.';
      } else if (args.capabilityId === 'mansion-images') {
        if (!/^(?:[1-9]|1\d|2[0-8])$/.test(args.id)) throw new RangeError('Mansion image lookup requires a string integer 1–28.');
        result = mansionImage(Number(args.id)); source = MANSION_IMAGES_SOURCE;
        interpretationScope = 'Historical image description and claimed purpose. Material and source-variant cautions remain attached; no efficacy or recommendation is inferred.';
      } else {
        result = WORKED_CHARTS.find(x => x.key === args.id);
        if (!result) throw new RangeError('Unknown worked-chart key.');
        source = result.sources;
        interpretationScope = 'Inherited historical worked-chart record. Printed/recomputed position discrepancies and retrospective reported outcomes remain qualified; this lookup does not recompute a chart or independently verify the historical outcome.';
      }
      if (!result) throw new RangeError('Requested source record is unavailable.');
      return frame(args.capabilityId, args, result, { source, staticLookup: true, interpretationScope });
    }),
]);
