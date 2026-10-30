// Fixed adapters for existing study engines. Caller-supplied chart objects and
// arbitrary printed-position rows are deliberately outside this remote contract.
import { REGISTRY } from '../assets/js/core/registry.js';
import { castChart } from '../assets/js/core/astro.js';
import { parseExplicitInstant, HOUSE_SYSTEMS } from '../assets/js/core/instant-boundary.js';
import { validateLocation, validateZone } from '../assets/js/core/cultural-calendars.js';
import { starsInAspect, BEHENIAN_STARS, BEHENIAN_EPOCH, PRECESSION_DEG_PER_YEAR } from '../assets/js/core/data/behenian-stars.js';
import { natalTopicReading } from '../assets/js/core/natal-topics.js';
import { castVedic, compoundRelations, grahaDrishti, combustion } from '../assets/js/core/vedic.js';
import { chartFromPositions } from '../assets/js/core/chart-from-positions.js';
import { WORKED_CHARTS } from '../assets/js/core/data/worked-charts.js';

const number = (minimum, maximum) => ({ type: 'number', minimum, maximum });
const enumeration = values => ({ type: 'string', enum: [...values] });
const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const momentProperties = {
  dateISO: { type: 'string', minLength: 20, maxLength: 40, description: 'Explicit ISO date and time with Z or UTC offset; UTC and selected-zone civil year 1900–2100.' },
  lat: number(-90, 90), lon: number(-180, 180), timeZone: { type: 'string', minLength: 1, maxLength: 120 },
};
const MOMENT_KEYS = ['dateISO', 'lat', 'lon', 'timeZone'];
const withHouses = { ...momentProperties, system: enumeration(HOUSE_SYSTEMS) };
const LIMITS = [
  'Historical symbolic classifications are study material, not predictions, medical or psychological assessment, outcome probabilities, or recommendations.',
  'Source records are inherited from the canonical modules. This remote adapter does not establish a new full-text collation, community authority, or predictive validation.',
  'Only explicitly supplied arguments are used; no saved birth, question, browser record, provider key or current clock is read. MCP clients can retain supplied inputs.',
];

function validate(schema, value, path = 'arguments') {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(`${path} must be a plain JSON object.`);
    for (const key of Reflect.ownKeys(value)) if (typeof key !== 'string' || !Object.hasOwn(schema.properties, key)) throw new TypeError(`Unknown ${path} field.`);
    for (const key of schema.required) if (!Object.hasOwn(value, key)) throw new TypeError(`Missing ${path}.${key}.`);
    for (const [key, item] of Object.entries(value)) validate(schema.properties[key], item, `${path}.${key}`);
    return;
  }
  if (typeof value !== schema.type) throw new TypeError(`${path} must be ${schema.type}.`);
  if (schema.enum && !schema.enum.includes(value)) throw new RangeError(`${path} is not an allowed choice.`);
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) throw new RangeError(`${path} is outside the bounded range.`);
  if (typeof value === 'string' && (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? 200))) throw new RangeError(`${path} has an invalid text length.`);
}

function explicitChart(args, forcedSystem = null) {
  const date = parseExplicitInstant(args.dateISO), year = date.getUTCFullYear();
  if (year < 1900 || year > 2100) throw new RangeError('These study adapters support UTC years 1900–2100.');
  validateLocation(args.lat, args.lon);
  if (Math.abs(args.lat) === 90) throw new RangeError('Chart angles are undefined at an exact geographic pole.');
  const timeZone = validateZone(args.timeZone), local = Object.fromEntries(new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(p => [p.type, p.value]));
  if (+local.year < 1900 || +local.year > 2100) throw new RangeError('The observer-zone civil year must also be 1900–2100.');
  const requestedSystem = forcedSystem || args.system || 'regiomontanus';
  const chart = { ...castChart(date, args.lat, args.lon, requestedSystem), timeZone };
  return { chart, context: { dateISO: date.toISOString(), lat: args.lat, lon: args.lon, timeZone, localDate: `${local.year}-${local.month}-${local.day}`, localTime: `${local.hour}:${local.minute}:${local.second}`, requestedHouseSystem: requestedSystem, actualHouseSystem: chart.system, houseWarning: chart.houseWarning || null, timeKnown: true,
    clockConvention: 'The explicit ISO offset/Z fixes the instant; the supplied IANA zone labels civil time. Coordinate-to-zone geography is not inferred or verified.' } };
}

function response(id, context, result, methods, extra = {}) {
  const entry = REGISTRY.find(x => x.id === id);
  if (!entry) throw new Error('Missing fixed study capability.');
  return { capabilityId: id, status: 'calculated', context, result, methods, source: entry.citation, sourceStatus: 'Inherited canonical implementation and source records; no new historical or predictive validation.', limitations: [...LIMITS], ...extra };
}
function define(name, description, inputSchema, calculate) {
  return { name, description, inputSchema, calculate: args => {
    validate(inputSchema, args);
    const result = calculate(args), text = JSON.stringify(result);
    if (new TextEncoder().encode(text).length > 300000) throw new RangeError('Study result exceeds the 300 KB bound.');
    return JSON.parse(text); // immutable-by-copy source rows, JSON-safe transport
  } };
}

export const STUDY_MCP_TOOLS = [
  define('workbench_behenian_stars', 'Calculate canonical conjunction-by-longitude matches between the 15 historical Behenian stars and a freshly cast chart, with a bounded orb. Preserves the inherited approximate 2020 longitude catalogue and linear precession, not full 3D separation or proper motion. Symbolic star natures retain source variants; optional modern Fomalhaut is excluded.',
    object({ ...withHouses, orb: number(0, 10) }, MOMENT_KEYS), args => {
      const { chart, context } = explicitChart(args), orb = args.orb ?? 6, hits = starsInAspect(chart, orb), used = new Set(hits.map(x => x.star));
      const starSources = BEHENIAN_STARS.filter(s => !s.modern && used.has(s.name)).map(s => ({ name: s.name, nature: s.nature, natureAlt: s.natureAlt || null, source: s.source, sourceNote: s.sourceNote || null, catalogueLongitudeDegrees: s.lon2020, catalogueEpoch: BEHENIAN_EPOCH, natureClaimType: 'historical-symbolic-attribution', readingStatus: 'Inherited catalogue; not a new verification of every stellar nature' }));
      return response('behenian-stars', context, hits,
        { orbDegrees: orb, measuredQuantity: 'Smallest circular difference in ecliptic longitude; ignores ecliptic latitude and is not great-circle sky separation.', starCount: BEHENIAN_STARS.filter(s => !s.modern).length, catalogueEpoch: BEHENIAN_EPOCH, precessionDegreesPerYear: PRECESSION_DEG_PER_YEAR, epochInterpolation: 'UTC year + UTC month/12; the canonical helper changes at month boundaries and omits proper motion.', bodiesChecked: Object.keys(chart.planets), pointConvention: 'Canonical chart includes the seven traditional planets, mean lunar nodes and derived Part of Fortune; these points are explicitly retained in matches.' },
        { starSources, modelLimitations: ['Rounded approximate 2020 source longitudes with a single linear precession rate; not equivalent to modern star catalogue propagation.', 'This preserves the Behenian helper used by the existing calculator; it is separate from the new sky explorer’s astrometric stellar layer.', 'Historical planetary natures do not describe physical stellar composition or establish an effect on people.'], checkedSourceNote: 'Separately inspected Agrippa II.31 calls the greater Dog star Venereal; the old skill example attributing Jupiter/Mars to Agrippa was corrected. Other catalogue attributions retain their inherited verification status.' });
    }),
  define('workbench_natal_topics', 'Run the existing twelve-topic Lilly Book III study ledger on a freshly calculated explicit-time chart. Requires a known instant and observer; it does not infer a birth. Retains actual house fallback and legacy dignity conventions, including the unprecessed 1647 fixed-star table. Health, death and other historical topic labels are not personal predictions or assessments.',
    object(withHouses, MOMENT_KEYS), args => {
      const { chart, context } = explicitChart(args);
      return response('natal-topics', context, natalTopicReading(chart),
        { topicCount: 12, inputScope: 'Explicit chart moment; it represents a nativity only if the caller intentionally supplies known birth data.', houseConvention: chart.system, legacyFixedStarTableEpoch: 1647, accidentalDignityConvention: 'Existing accidentalDignity: historical 1647 Regulus/Spica/Algol longitudes and legacy angular-only solar proximity are retained.', interpretation: 'Inherited crude favorable/mixed/afflicted testimony classification; no clinical, lifespan, fertility, wealth or relationship inference.' },
        { modelLimitations: ['The topic engine’s fixed-star dignity rows are not a current-epoch star calculation. Use the separate star tools for their explicitly named current-epoch models.', 'A missing or uncertain birth time cannot be filled with noon or another invented clock; this adapter accepts exact instants only.'] });
    }),
  define('workbench_vedic_graha_bala', 'Calculate the actual compound-friendship matrix, whole-sign and degree-graded planetary aspect grid, and contested combustion arcs from a freshly computed canonical sidereal reading. Explicit moment/observer, linear Lahiri estimate, whole-sign houses and mean nodes. These are the three existing graha-bala views, not a new full strength model or personal prediction.',
    object(momentProperties, MOMENT_KEYS), args => {
      const { chart, context } = explicitChart(args, 'whole'), reading = castVedic(chart, { currentDate: chart.date });
      return response('vedic-graha-bala', context,
        { compoundRelations: compoundRelations(reading), grahaDrishti: grahaDrishti(reading), combustion: combustion(reading) },
        { ayanamsha: 'Canonical linear Lahiri estimate; not exact JHora equivalence.', ayanamshaDegrees: reading.ayanamsa, houseConvention: 'Sidereal whole-sign', nodes: 'Mean lunar nodes', surfaces: ['pañcadhā maitrī', 'whole-sign and sphuṭa dṛṣṭi', 'asta combustion'], referenceDateISO: context.dateISO },
        { calculatedGrahas: Object.fromEntries(Object.entries(reading.grahas).map(([name,g]) => [name, { longitudeDegrees: g.lon, rashiIndex: g.rashiIndex, rashi: g.rashi, retrograde: g.retrograde }])), modelLimitations: ['Whole-sign versus degree-graded dṛṣṭi and nodal aspects are contested and retain the canonical notes.', 'Retrograde Mercury/Venus combustion arcs retain their contested source variants.', 'These exposed views do not recompute or independently validate the project’s approximate six-component ṣaḍbala model.'] });
    }),
  define('workbench_printed_chart', 'Replay one of the four existing Lilly worked-chart records through chartFromPositions. Only an explicit existing record key is accepted; no arbitrary chart, dates or position rows. Returns inherited position provenance, equal-cusp fallback and mean-motion limitations. This is a historical reconstruction, not a new astronomical cast or independently verified historical outcome.',
    object({ key: enumeration(WORKED_CHARTS.map(x => x.key)) }, ['key']), args => {
      const record = WORKED_CHARTS.find(x => x.key === args.key), chart = chartFromPositions(record.figure);
      return response('chart-from-positions', { recordKey: record.key, inputProvenance: 'Explicit selection of an existing project worked-chart record; no caller-supplied chart rows.', dateISO: null }, chart,
        { positionProvenance: 'Inherited transcribed/partly reconstructed catalogue positions; inspect the record caveats for uncertain or recomputed details.', actualCuspConvention: chart.cuspApprox ? 'Equal houses from the record’s Ascendant; printed per-planet house assignments retained' : 'Full supplied printed cusp set', engineSystemLabel: chart.system, cuspApprox: chart.cuspApprox, motionConvention: 'Canonical mean daily motions signed by the record’s retrograde flags; not solved historical instantaneous speeds.', modernEphemerisRecalculated: false },
        { status: 'reconstructed', source: record.sources, sourceRecord: { key: record.key, title: record.title, dateNote: record.dateNote, place: record.place, completeness: record.completeness, sources: record.sources, caveats: record.caveats }, modelLimitations: ['The engine’s printed-system label does not override the explicit equal-cusp approximation.', 'The record’s date note is not silently converted into an exact UTC moment.', 'Reported outcomes and printed/recomputed position differences are source assertions, not independent proof of prediction.'] });
    }),
];

export const STUDY_MCP_COVERAGE = Object.freeze(Object.fromEntries([
  ['behenian-stars', 'workbench_behenian_stars', ['result', 'starSources', 'methods'], 'Fresh explicit chart; 15 historical stars, longitude-only orb 0–10°, inherited monthly linear precession; mean nodes/Fortune identified as chart points.'],
  ['natal-topics', 'workbench_natal_topics', ['result.topics', 'result.caveat', 'methods'], 'Twelve-topic canonical ledger at a known moment; house fallback and legacy 1647 fixed-star dignity table disclosed.'],
  ['vedic-graha-bala', 'workbench_vedic_graha_bala', ['result.compoundRelations', 'result.grahaDrishti', 'result.combustion', 'calculatedGrahas'], 'Actual three exposed canonical views from a recomputed Lahiri/whole-sign/mean-node reading; contested arcs/aspects preserved.'],
  ['chart-from-positions', 'workbench_printed_chart', ['result', 'sourceRecord', 'methods.cuspApprox'], 'Only four existing WORKED_CHARTS keys; historical reconstruction with record caveats, equal-cusp/mean-motion limits and no invented UTC date.'],
].map(([id, name, outputPaths, scope]) => [id, { mcpTools: [name], outputPaths, scope }])));
