// Bounded presentation of held calculations. No ephemeris, clock, storage or
// provider call occurs here, including during relationship selection/hover.
import { allAspects, mutualReception } from './aspects.js';
import { dignityRulersAt } from './dignities.js';
import { grahaDrishti } from './vedic.js';
import { SKY_SOURCES } from './sky-dynamics.js';
import { DAY_GUIDANCE_SOURCES } from './day-guidance.js';
import { SKY_READING_SOURCES } from './data/sky-reading-sources.js';
import { OBSERVATORY_SOURCES } from './calendar-observatory.js';
import { parseExplicitInstant } from './instant-boundary.js';

export const CHART_RELATIONSHIP_VERSION = 1;
export const CHART_RELATIONSHIP_LIMITS = Object.freeze({ bodies: 10, modelBodies: 12, vedicBodies: 9, geometricPairs: 45, relations: 180, comparisons: 100, ruleTestimonies: 1000 });
const TRADITIONAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const SKY_IDS = [...TRADITIONAL, 'Uranus', 'Neptune', 'Pluto'];
const VEDIC_IDS = [...TRADITIONAL, 'Rahu', 'Ketu'];
const ANGLES = Object.freeze({ conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 });
const CLASSIFICATIONS = ['favorable', 'caution', 'mixed', 'neutral', 'unavailable'];
const BINDING_EPSILON = 1e-7;
const KEYS = ['sky', 'comparison', 'vedicPlanets', 'vedicContext', 'reading', 'alignment', 'clockNote'];
const LIMITATIONS = Object.freeze([
  'Relationship colors identify named methods and geometry; they are not universal favorable, dangerous or predictive verdicts.',
  'These records adapt held calculations. They do not authenticate imported data, recompute an ephemeris or establish source truth.',
  'Longitude separation is not three-dimensional angular distance, an eclipse calculation, or an orbital intersection.',
  'Geocentric relationships must not be drawn as heliocentric physical alignments. Ring radii and connector lengths are layout choices.',
  'Equal calendar outputs, shared measurements and source interpretations are different comparisons; they do not produce an agreement score.',
]);
const SOURCE = Object.freeze({ id: 'REL-ADAPTER', title: 'Held chart relationship adapter', url: 'assets/js/core/chart-relationships.js', locator: 'buildChartRelationshipModel(): geometry, Lilly moieties, mutual reception and inherited whole-sign graha dṛṣṭi', readingDepth: 'Current implementation and inherited source contracts; no new primary-text collation or prediction validation.' });
const norm = n => ((n % 360) + 360) % 360;
const separation = (a, b) => Math.abs(norm(b - a + 180) - 180);
const str = (value, max = 1200) => typeof value === 'string' ? value.slice(0, max) : '';
const numberText = value => Number.isFinite(value) ? String(Number(value.toFixed(6))) + '°' : 'Not applicable';
const detail = (label, value) => ({ label, value: String(value) });
function plain(value, label) {
  if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(label + ' must be a plain object.');
  return value;
}
function bounded(value, max, label) {
  if (!Array.isArray(value) || value.length > max) throw new RangeError(label + ' must be an array of at most ' + max + ' records.');
  return value;
}
function finite(value, min, max, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new RangeError(label + ' must be a finite number from ' + min + ' to ' + max + '.');
  return value;
}
function longitude(value, label) {
  finite(value, 0, 360, label);
  if (value === 360) throw new RangeError(label + ' must be normalized below 360 degrees.');
  return value;
}
function instant(context, label) {
  plain(context, label + ' context');
  if (typeof context.dateISO !== 'string') throw new TypeError(label + ' needs an explicit dateISO.');
  return parseExplicitInstant(context.dateISO).toISOString();
}
function bind(context, skyContext, label, observer = false) {
  if (instant(context, label) !== instant(skyContext, 'Sky')) throw new RangeError(label + ' belongs to a different instant.');
  if (observer) for (const key of ['lat', 'lon', 'timeZone']) {
    if (skyContext[key] !== undefined && context[key] !== skyContext[key]) throw new RangeError(label + ' has a different or missing observer ' + key + '.');
  }
}
function ids(value) {
  return bounded(value || [], 40, 'Source identifiers').map(id => {
    if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,119}$/.test(id)) throw new TypeError('Source identifiers must be bounded public references.');
    return id;
  });
}
function sourceRecord(source) {
  plain(source, 'Source record');
  const id = ids([source.id])[0];
  let url = str(source.url, 2000);
  if (url) {
    try { const u = new URL(url, 'https://workbench.invalid/'); if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) url = ''; }
    catch { url = ''; }
  }
  return { id, title: str(source.title || source.label, 400) || id, url, locator: str(source.locator || source.section), readingDepth: str(source.readingDepth || source.status || source.type), ...(source.edition ? { edition: str(source.edition) } : {}) };
}
function phase(orb, applying, speedA, speedB) {
  if (orb === 0) return 'exact';
  if (speedA === speedB) return 'steady';
  return applying === null ? 'undetermined' : applying ? 'applying' : 'separating';
}
function phaseLabel(value) {
  return { exact: 'Exact longitude angle at supplied numerical precision', steady: 'No sampled relative longitude motion', applying: 'Applying under the stated sampled-motion approximation', separating: 'Separating under the stated sampled-motion approximation', undetermined: 'Motion state not supplied', 'not-applicable': 'Applying/separating is not defined for this relationship' }[value];
}
function method(id, label, available, reason, frame, sourceIds) { return { id, label, available, reason: available ? '' : reason, frame, sourceIds }; }
function relation(methodId, type, bodyIds, options) {
  return { id: [methodId, type, ...bodyIds].join(':'), methodId, type, bodyIds, label: '', summary: '', classification: 'neutral', separationDegrees: null, angleDegrees: null, orbDegrees: null, allowedOrbDegrees: null, phase: 'not-applicable', directed: false, sourceIds: [], details: [], limitations: [], ...options };
}
function unavailableModel(clockNote) {
  return { schemaVersion: CHART_RELATIONSHIP_VERSION, context: null, bodies: [], methods: [
    method('geometry', 'Geometric aspects', false, 'Calculate a supported explicit moment first.', 'apparent geocentric ecliptic of date', ['SKY-ASTRONOMY']),
    method('lilly', 'Lilly planetary moieties', false, 'Seven held traditional planetary positions and speeds are required.', 'apparent geocentric ecliptic of date', ['DG-ASPECTS']),
    method('reception', 'Mutual reception', false, 'Held planetary positions and an explicit matching day/night sect are required.', 'tropical zodiac dignity convention', ['SKY-LILLY-DIGNITY']),
    method('vedic', 'Jyotiṣa whole-sign dṛṣṭi', false, 'Nine held sidereal grahas with matching date provenance are required.', 'linear-Lahiri sidereal', ['OBS-VEDIC']),
  ], relations: [], calendarComparisons: [], sourceComparisons: [], ruleTestimonies: [], sources: [sourceRecord(SOURCE)], clockNote, limitations: [...LIMITATIONS] };
}

/**
 * Adapt already held canonical results. No chart is cast here. All optional
 * attachments must explicitly name the same instant. For vedicPlanets use the
 * nine frame.charts.vedic.planets records plus vedicContext: frame.context.
 * Unknown fields/prose are not copied into the model or persisted anywhere.
 */
export function buildChartRelationshipModel(input = {}) {
  plain(input, 'Relationship input');
  if (Reflect.ownKeys(input).some(key => !KEYS.includes(key))) throw new RangeError('Unknown relationship input field.');
  const { sky = null, comparison = null, vedicPlanets = null, vedicContext = null, reading = null, alignment = null } = input;
  const clockNote = str(input.clockNote, 600);
  if (sky === null) {
    if ([comparison, vedicPlanets, vedicContext, reading, alignment].some(value => value !== null)) throw new RangeError('Related data cannot be attached without its held sky frame.');
    return unavailableModel(clockNote);
  }
  plain(sky, 'Held sky'); const dateISO = instant(sky.context, 'Sky');
  for (const [label, value, observer] of [['Comparison', comparison, true], ['Reading', reading, reading?.options?.includeObserver !== false], ['Alignment', alignment, true]]) {
    if (value !== null) { plain(value, label); bind(value.context, sky.context, label, observer); }
  }
  const sourceMap = new Map([...SKY_SOURCES, ...DAY_GUIDANCE_SOURCES, ...SKY_READING_SOURCES, ...OBSERVATORY_SOURCES, SOURCE].map(s => [s.id, sourceRecord(s)]));
  for (const attachment of [sky, comparison, reading, alignment]) for (const s of bounded(attachment?.sources || [], 512, 'Held sources')) {
    const source = sourceRecord(s); if (!sourceMap.has(source.id)) sourceMap.set(source.id, source);
  }
  const byId = new Map();
  for (const raw of bounded(sky.bodies, 10, 'Held sky bodies')) {
    plain(raw, 'Held sky body');
    if (!SKY_IDS.includes(raw.id) || byId.has(raw.id)) throw new RangeError('Sky body identifiers must be unique supported bodies.');
    const lon = longitude(raw.longitude, raw.id + ' longitude'), speed = finite(raw.speedDegreesPerDay, -100, 100, raw.id + ' sampled speed');
    byId.set(raw.id, { id: raw.id, label: raw.id, tropicalLongitude: lon, siderealLongitude: null, speedDegreesPerDay: speed });
  }
  if (!byId.size) throw new RangeError('A held sky must contain at least one body.');
  const allowedOrb = finite(sky.aspectOrb, 0, 10, 'Geometric aspect orb');
  const relations = [], geometricKeys = new Set();
  for (const a of bounded(sky.aspects, 45, 'Geometric aspects')) {
    plain(a, 'Geometric aspect');
    if (!byId.has(a.bodyA) || !byId.has(a.bodyB) || a.bodyA === a.bodyB || !Object.hasOwn(ANGLES, a.type)) throw new RangeError('Aspect endpoints and type must name a supported distinct pair.');
    const bodyIds = [a.bodyA, a.bodyB].sort((x, y) => SKY_IDS.indexOf(x) - SKY_IDS.indexOf(y)), key = bodyIds.join(':') + ':' + a.type;
    if (geometricKeys.has(key)) throw new RangeError('Duplicate geometric relationship.'); geometricKeys.add(key);
    finite(a.angle, 0, 180, 'Geometric aspect angle'); finite(a.separation, 0, 180, 'Geometric separation');
    finite(a.orb, 0, 180, 'Geometric orb'); finite(a.allowedOrb, 0, 10, 'Geometric allowance');
    const A = byId.get(a.bodyA), B = byId.get(a.bodyB), distance = separation(A.tropicalLongitude, B.tropicalLongitude), error = Math.abs(distance - ANGLES[a.type]);
    for (const [field, expected] of [['angle', ANGLES[a.type]], ['separation', distance], ['orb', error], ['allowedOrb', allowedOrb]]) {
      if (typeof a[field] !== 'number' || !Number.isFinite(a[field]) || Math.abs(a[field] - expected) > BINDING_EPSILON) throw new RangeError('Geometric aspect ' + field + ' does not match its held bodies/convention.');
    }
    // The binding tolerance checks copied numbers, never widens the selected orb.
    if (a.orb > a.allowedOrb || a.orb > allowedOrb || error > allowedOrb) throw new RangeError('A geometric aspect lies outside the declared orb.');
    if (a.applying !== null && typeof a.applying !== 'boolean') throw new TypeError('Geometric applying must be boolean or null.');
    const state = phase(a.orb, a.applying, A.speedDegreesPerDay, B.speedDegreesPerDay);
    relations.push(relation('geometry', a.type, bodyIds, {
      label: bodyIds.join('–') + ' · ' + a.type, summary: `${numberText(a.separation)} longitude separation; ${numberText(a.orb)} from ${numberText(a.angle)} within a uniform ${numberText(allowedOrb)} allowance.`,
      separationDegrees: a.separation, angleDegrees: a.angle, orbDegrees: a.orb, allowedOrbDegrees: a.allowedOrb, phase: state, sourceIds: ['SKY-ASTRONOMY', 'REL-ADAPTER'],
      details: [detail('Method', 'Held sky snapshot · user-selected uniform longitude orb'), detail('Sampled motion', phaseLabel(state)), detail('Original applying flag', a.applying === null ? 'null' : a.applying), detail('Coordinate frame', 'Apparent geocentric true ecliptic/equinox of date')],
      limitations: ['A geometric aspect has no automatic favorable/caution classification. Motion is a sampled approximation, not a solved future perfection.'],
    }));
  }
  const sevenPresent = TRADITIONAL.every(id => byId.has(id)), planets = Object.fromEntries(TRADITIONAL.filter(id => byId.has(id)).map(id => [id, { lon: byId.get(id).tropicalLongitude, speed: byId.get(id).speedDegreesPerDay }]));
  if (sevenPresent) for (const a of allAspects(planets)) {
    const bodyIds = [a.from, a.to], type = a.aspect.toLowerCase(), distance = separation(planets[a.from].lon, planets[a.to].lon), state = phase(a.orb, a.applying, planets[a.from].speed, planets[a.to].speed);
    relations.push(relation('lilly', type, bodyIds, {
      label: bodyIds.join('–') + ' · ' + a.aspect, summary: `Lilly planetary moieties on held sky positions: ${numberText(a.orb)} from the ${numberText(a.angle)} angle, allowance ${numberText(a.allowance)}.`,
      separationDegrees: distance, angleDegrees: a.angle, orbDegrees: a.orb, allowedOrbDegrees: a.allowance, phase: state, sourceIds: ['DG-ASPECTS', 'SKY-LILLY-DIGNITY', 'SKY-ASTRONOMY'],
      details: [detail('Convention', 'Canonical aspectBetween/allAspects planetary half-orbs applied to held apparent sky positions and their ±6-hour sampled speeds'), detail('Motion comparison', 'Canonical 0.05-day linear look-ahead; ' + phaseLabel(state)), detail('Legacy exact flag', a.exact), detail('Legacy partile flag', a.partile)],
      limitations: ['The selected orb rule is not the uniform diagram orb. An opposition or square is not automatically an adverse outcome.', 'Legacy exact/partile flags are convention-specific; the phase label separately identifies a strict zero numerical angle error.', 'No horary question, significator or complete judgment is inferred.'],
    }));
  }
  const sectAvailable = sevenPresent && typeof comparison?.western?.isDay === 'boolean';
  if (sectAvailable) for (let i = 0; i < TRADITIONAL.length; i++) for (let j = i + 1; j < TRADITIONAL.length; j++) {
    const A = TRADITIONAL[i], B = TRADITIONAL[j], reception = mutualReception(A, planets[A].lon, B, planets[B].lon, lon => dignityRulersAt(lon, comparison.western.isDay));
    if (!reception) continue;
    relations.push(relation('reception', 'mutual-reception', [A, B], {
      label: A + '–' + B + ' · mutual reception', summary: `${A} occupies ${B}'s ${reception.byA.join(', ')}; ${B} occupies ${A}'s ${reception.byB.join(', ')}.`,
      separationDegrees: separation(planets[A].lon, planets[B].lon), sourceIds: ['SKY-LILLY-DIGNITY', 'DG-ASPECTS'],
      details: [detail(A + ' in ' + B + ' dignity', reception.byA.join(', ')), detail(B + ' in ' + A + ' dignity', reception.byB.join(', ')), detail('Sect', comparison.western.isDay ? 'Day · supplied matching observer calculation' : 'Night · supplied matching observer calculation'), detail('Convention', 'Canonical mutualReception() and dignityRulersAt() on held tropical longitudes')],
      limitations: ['Reception is a dignity relationship, not an angular aspect or a guarantee of perfection or success.'],
    }));
  }
  let vedicAvailable = false;
  if (vedicPlanets !== null) {
    if (vedicContext === null) throw new RangeError('Held Vedic planets need explicit matching vedicContext provenance.');
    bind(vedicContext, sky.context, 'Vedic');
    const grahas = Object.create(null), rows = bounded(vedicPlanets, 9, 'Vedic planets');
    if (rows.length !== 9) throw new RangeError('The inherited dṛṣṭi model requires all nine declared grahas.');
    for (const p of rows) {
      plain(p, 'Vedic planet');
      if (!VEDIC_IDS.includes(p.id) || Object.hasOwn(grahas, p.id)) throw new RangeError('Vedic grahas must be unique canonical identifiers.');
      const lon = longitude(p.longitude, p.id + ' sidereal longitude');
      if (!Number.isInteger(p.signIndex) || p.signIndex !== Math.floor(lon / 30)) throw new RangeError('Vedic sign index must agree with the supplied sidereal longitude.');
      grahas[p.id] = { lon, rashiIndex: p.signIndex };
      const body = byId.get(p.id); if (body) body.siderealLongitude = lon;
      else byId.set(p.id, { id: p.id, label: p.id, tropicalLongitude: null, siderealLongitude: lon, speedDegreesPerDay: null });
    }
    const grid = grahaDrishti(grahas); vedicAvailable = true;
    for (const A of grid.grahas) for (const B of grid.grahas) {
      const item = grid.grid[A][B]; if (!item?.full) continue;
      relations.push(relation('vedic', item.special ? 'special-drishti' : 'full-drishti', [A, B], {
        label: A + ' → ' + B + ' · ' + (item.special ? 'special dṛṣṭi' : 'seventh-sign dṛṣṭi'),
        summary: `${A} aspects the ${item.houseDist}${item.houseDist === 3 ? 'rd' : 'th'} sign from itself under the inherited whole-sign convention. Direction is ${A} → ${B}.`,
        directed: true, separationDegrees: separation(grahas[A].lon, grahas[B].lon), sourceIds: ['OBS-VEDIC', 'REL-ADAPTER'],
        details: [detail('Sign distance, inclusive', item.houseDist), detail('Whole-sign strength', item.special ? 'Full special aspect' : 'Full seventh-sign aspect'), detail('Inherited sphuṭa value', item.sphuta + ' virūpas'), detail('Convention and source qualification', grid.cite), detail('Input frame', 'Held canonical sidereal grahas; linear Lahiri study convention; mean nodes')],
        limitations: [grid.note, 'This is a directional sign relationship, not a western degree-orb aspect. Applying/separating is not inferred.', 'Rāhu/Ketu nodal aspects are contested and use the inherited whole-sign-only treatment.', 'A renderer must not draw an endpoint absent from its displayed frame; no tropical node coordinate is synthesized here.'],
      }));
    }
  } else if (vedicContext !== null) throw new RangeError('Vedic provenance without held Vedic planets is incomplete.');
  const methods = [
    method('geometry', 'Geometric aspects · uniform ' + numberText(allowedOrb), true, '', 'apparent geocentric ecliptic of date', ['SKY-ASTRONOMY']),
    method('lilly', 'Lilly moieties · held sky positions', sevenPresent, 'All seven traditional planets and sampled speeds are required. Modern outer planets and stars have no selected Lilly pair rule.', 'apparent geocentric ecliptic of date', ['DG-ASPECTS', 'SKY-LILLY-DIGNITY']),
    method('reception', 'Mutual reception · dignity rulership', sectAvailable, 'Supply seven held traditional planets and explicit matching observer day/night sect. No night default is inferred.', 'tropical zodiac dignity convention', ['SKY-LILLY-DIGNITY']),
    method('vedic', 'Jyotiṣa · directed whole-sign dṛṣṭi', vedicAvailable, 'Nine held sidereal grahas and matching date provenance are required. No Vedic pair rule is derived from a civil calendar label.', 'linear-Lahiri sidereal', ['OBS-VEDIC']),
  ];
  const calendarComparisons = bounded(alignment?.differences || [], 100, 'Calendar comparisons').map(row => {
    plain(row, 'Calendar comparison');
    if (!['equal-output', 'different-output', 'unavailable'].includes(row.relationship)) throw new RangeError('Unknown calendar comparison relationship.');
    return { id: str(row.id, 120), label: str(row.label, 300), kind: str(row.kind, 120), relationship: row.relationship, baseValue: str(row.baseValue), comparisonValue: str(row.comparisonValue), explanation: str(row.explanation, 2400), sourceIds: ids(row.sourceIds), baseStatus: str(row.baseStatus, 80), comparisonStatus: str(row.comparisonStatus, 80) };
  });
  const sourceComparisons = bounded(reading?.differences || [], 100, 'Source comparisons').map(row => ({ id: str(row.id, 120), title: str(row.title, 300), text: str(row.text, 3000), kind: str(row.kind, 120), sourceIds: ids(row.sourceIds), ruleIds: ids(row.ruleIds), ...(typeof row.differsAtThisInstant === 'boolean' ? { differsAtThisInstant: row.differsAtThisInstant } : {}) }));
  const ruleTestimonies = [];
  for (const lens of bounded(reading?.lenses || [], 10, 'Reading lenses')) for (const row of bounded(lens.rules || [], 100, 'Named rules')) {
    if (!CLASSIFICATIONS.includes(row.classification)) throw new RangeError('Unknown named-rule classification.');
    ruleTestimonies.push({ id: str(row.id, 120), lensId: str(lens.id, 120), title: str(row.title, 300), reading: str(row.reading, 3000), classification: row.classification, sourceIds: ids(row.sourceIds) });
  }
  const used = new Set(['REL-ADAPTER', ...methods.flatMap(m => m.sourceIds), ...relations.flatMap(r => r.sourceIds), ...calendarComparisons.flatMap(r => r.sourceIds), ...sourceComparisons.flatMap(r => r.sourceIds), ...ruleTestimonies.flatMap(r => r.sourceIds)]);
  const sources = [...used].map(id => sourceMap.get(id) || { id, title: id, url: '', locator: 'Held source reference; no complete source record supplied.', readingDepth: 'Unresolved source metadata in this view.' });
  if (relations.length > CHART_RELATIONSHIP_LIMITS.relations) throw new RangeError('Relationship presentation exceeds its declared bound.');
  return { schemaVersion: CHART_RELATIONSHIP_VERSION, context: { dateISO }, bodies: [...byId.values()].map(({ speedDegreesPerDay, ...body }) => body), methods, relations, calendarComparisons, sourceComparisons, ruleTestimonies, sources, clockNote, limitations: [...LIMITATIONS] };
}
