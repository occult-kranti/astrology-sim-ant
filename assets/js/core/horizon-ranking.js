// Explicit editorial comparison profiles over supplied canonical engine records.
// This module never casts a chart, reads a clock, infers a birth, or calls a model.
import { DAY_GUIDANCE_SOURCES } from './day-guidance.js';

const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const copy = value => JSON.parse(JSON.stringify(value));
const COMMON_LIMITS = [
  'Scores are modern editorial study indices, not historical formulae, probabilities, religious efficacy, personal advice or objectively good/bad days.',
  'Only the explicit sampled instant is described. A local-noon sample does not classify the whole date; different observer-local noons are different instants.',
  'Compare scores only within the same declared profile and case. A shared numerical scale does not make different traditions or observers commensurable.',
  'Dependency groups expose repeated measurements and each declared group budget; they are accounting groups, not independent evidence. Several groups still reuse the same Moon and Sun positions.',
  'All required contributions must be observed. Missing, unavailable or unresolved rules make score null; absent data is never favorable and is never removed from the denominator.',
  'Equal exact score numerators under the same denominator are ties. Stable display order within a tie is not a stronger result.',
  'No observed religious festival, calendar label, eclipse, eschatology, birth chart, oracle draw or source-only reference contributes to these profiles.',
];

export const HORIZON_RANKING_SOURCES = freeze([
  ...copy(DAY_GUIDANCE_SOURCES),
  { id: 'HR-AGRIPPA-29', title: 'Agrippa, Three Books of Occult Philosophy, II.29', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', locator: 'Chapter XXIX, observation of celestials', edition: 'J.F. English translation, 1651; Joseph H. Peterson digital edition', rights: 'Historical translation public domain; hosted editorial matter retains its own rights', readingStatus: 'Selected complete chapter retrieved and read 30 October 2026', claim: 'The text requires several celestial conditions together; this does not authorize a sufficient single-phase election or a numerical purpose score.' },
  { id: 'HR-AGRIPPA-32', title: 'Agrippa, Three Books of Occult Philosophy, II.32', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', locator: 'Chapter XXXII, opening paragraph', edition: 'J.F. English translation, 1651; Peterson digital edition', rights: 'Historical translation public domain', readingStatus: 'Selected opening paragraph retrieved and read 30 October 2026', claim: 'The source associates the Moon with generation, increase and decrease. Completion tasks and opposite-phase preference are modern study choices, not quotations or sufficient instructions from this chapter.' },
  { id: 'HR-AGRIPPA-43', title: 'Agrippa, Three Books of Occult Philosophy, II.43', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', locator: 'Chapter XLIII, Mercury images', edition: 'J.F. English translation, 1651; Peterson digital edition', rights: 'Historical translation public domain', readingStatus: 'Selected complete chapter retrieved and read 30 October 2026', claim: 'The text reports knowledge/eloquence associations in a multi-condition image tradition, including Mercury hour and ascendant conditions. This profile uses only an explicit editorial hour match and does not implement the image or its claimed efficacy.' },
  { id: 'HR-LILLY-I', title: 'Lilly, Christian Astrology, Book I', url: 'https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf', locator: 'pp.77–78 (Mercury) and p.115 (fortitude table)', edition: '1647 work; World Astrology Network modern transcription marked copyright 2003, not a facsimile', rights: 'Historical work public domain; modern transcription carries a copyright notice. Only original paraphrases are stored; no PDF or modern editorial content redistributed.', readingStatus: 'PDF freshly retrieved; selected pages read 30 October 2026; no new full-book or facsimile collation', claim: 'Mercury is associated with learning and literate professions under stated conditions. The p.115 table distinguishes increasing/decreasing lunar light; the horizon weights are not Lilly’s table weights and completion preference is editorial.' },
  { id: 'HR-EDITORIAL', title: 'Event horizon purpose-ranking method', url: 'docs/2026-10-horizon-ranking.md', locator: 'Declared weights, dependence, complete-case rule and ties', edition: 'Repository authored method, 30 October 2026', rights: 'Original project documentation', readingStatus: 'Implemented method, not historical evidence', claim: 'Finite, transparent exploratory profiles; no validated predictive interpretation.' },
]);

const GROUPS = {
  'moon-sun-elongation': 'Shared Moon–Sun elongation',
  'moon-apparent-motion': 'Moon apparent daily motion',
  'moon-tropical-longitude': 'Moon tropical longitude band',
  'moon-planet-aspect-geometry': 'Moon–planet aspect geometry',
  'sun-moon-sidereal-sum': 'Sidereal Sun-plus-Moon longitude',
  'moon-sidereal-longitude': 'Sidereal Moon longitude',
  'local-solar-hour': 'Observer sunrise/sunset and weekday sequence',
};
const term = (ruleId, weight, dependencyGroup, mode = 'classification') => ({ id: ruleId, ruleId, weight, dependencyGroup, mode });
const western = target => [
  term('DG-W-LIGHT', 2, 'moon-sun-elongation', target),
  term('DG-W-SOLAR', 2, 'moon-sun-elongation'),
  term('DG-W-SPEED', 2, 'moon-apparent-motion'),
  term('DG-W-VIA', 2, 'moon-tropical-longitude'),
  term('DG-W-APPLY-MARS', 1, 'moon-planet-aspect-geometry'),
  term('DG-W-APPLY-SATURN', 1, 'moon-planet-aspect-geometry'),
];
const profile = (id, label, description, contributions, sourceIds, limitations = []) => ({
  id, label, description, contributions, sourceIds,
  scoreScale: { minimum: -100, maximum: 100, unit: 'editorial index points', probability: false, endpointReachability: 'A bound only; physical combinations and profile mappings need not attain both endpoints.' },
  method: '100 × sum(value × declared integer weight) / sum(all declared weights), only when every contribution is observed. Classification maps favorable:+1, neutral:0, caution:−1. Phase preference and Mercury-hour matching are explicitly separate editorial mappings.',
  tiePolicy: 'Same numerator and denominator within a profile/case form a tie; dates may provide stable display order only.',
  limitations: [...limitations, ...COMMON_LIMITS],
});
export const HORIZON_PURPOSES = freeze([
  profile('western-increase-study', 'Western increase study', 'Explore the inherited lunar study rules while preferring increasing light. This is a modern beginning/growth study prompt, not a complete historical election.', western('waxing'), ['DG-PHASE', 'DG-LILLY', 'DG-SOLAR', 'DG-ASPECTS', 'HR-AGRIPPA-29', 'HR-AGRIPPA-32', 'HR-LILLY-I', 'HR-EDITORIAL'], ['Phase preference assigns +1 to waxing and −1 to waning only for this declared comparison. Lunar speed thresholds and applying-aspect approximation retain their inherited qualifications.']),
  profile('western-decrease-study', 'Western decrease / completion study', 'Explore the same inherited lunar rules while preferring decreasing light. Completion/reduction is an editorial study theme, not a claim that Lilly calls a waning Moon favorable.', western('waning'), ['DG-PHASE', 'DG-LILLY', 'DG-SOLAR', 'DG-ASPECTS', 'HR-AGRIPPA-29', 'HR-AGRIPPA-32', 'HR-LILLY-I', 'HR-EDITORIAL'], ['Only the phase preference is reversed from the increase profile: +1 waning, −1 waxing. The original guidance classification remains visible; this does not rewrite Lilly’s dignity table.']),
  profile('jyotisha-classification-study', 'Inherited Jyotiṣa classification study', 'Compare the four implemented secondary-source Pañcāṅga quality classes as a disclosed editorial exercise. This is not a religious observance, a complete muhūrta, or a source-verified universal auspiciousness measure.', [term('DG-J-TITHI', 1, 'moon-sun-elongation'), term('DG-J-KARANA', 1, 'moon-sun-elongation'), term('DG-J-YOGA', 2, 'sun-moon-sidereal-sum'), term('DG-J-NAKSHATRA', 2, 'moon-sidereal-longitude')], ['DG-MUHURTA', 'HR-EDITORIAL'], ['Tithi and karaṇa split one group budget because both partition the same elongation. Yoga and nakṣatra are not statistically independent of that sky. Opening-portion yoga rules remain missing until their timing is resolved. Primary-passage verification of the inherited quality tables remains pending.']),
  profile('mercury-hour-study', 'Mercury-hour study match', 'Find samples whose implemented temporal-hour ruler is Mercury, for an optional source-reading/language study. Other hour rulers are not adverse.', [term('DG-H-TEMPORAL', 1, 'local-solar-hour', 'mercury-hour')], ['DG-HOURS', 'HR-AGRIPPA-43', 'HR-LILLY-I', 'HR-EDITORIAL'], ['Mercury hour maps to +1; all other known traditional rulers map to 0. No Mercury dignity, rising sign or image conditions are evaluated. This is not Agrippa’s complete procedure or evidence that learning works better then.', 'Temporal hours use twelve daylight and twelve night divisions. Agrippa II.34 also reports an alternative ascension convention that is not implemented. Polar missing boundaries are unavailable.']),
]);

const plain = x => x && typeof x === 'object' && !Array.isArray(x) && [Object.prototype, null].includes(Object.getPrototypeOf(x));
const CLASSES = { favorable: 1, neutral: 0, caution: -1 };
const RULERS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const SOURCE_IDS = new Set(HORIZON_RANKING_SOURCES.map(row => row.id));
const finite = value => typeof value === 'number' && Number.isFinite(value);
function measurementPresent(id, c) {
  if (!plain(c)) return false;
  if (id === 'DG-W-LIGHT') return typeof c.waxing === 'boolean' && finite(c.elongationDegrees) && c.elongationDegrees >= 0 && c.elongationDegrees < 360;
  if (id === 'DG-W-SPEED') return finite(c.absoluteSpeedDegreesPerDay) && c.absoluteSpeedDegreesPerDay >= 0;
  if (id === 'DG-W-SOLAR') return finite(c.separationDegrees) && ['cazimi', 'combust', 'beams', 'free'].includes(c.selectedCategory);
  if (id === 'DG-W-VIA') return typeof c.inSelectedBand === 'boolean';
  if (id.startsWith('DG-W-APPLY-')) return finite(c.separationDegrees) && Object.hasOwn(c, 'aspect') && (c.aspect === null || plain(c.aspect) && typeof c.aspect.applying === 'boolean' && finite(c.aspect.angle));
  if (id.startsWith('DG-J-')) return Number.isInteger(c.limbNumber) && c.limbNumber >= 1 && c.limbNumber <= (id === 'DG-J-KARANA' ? 60 : id === 'DG-J-TITHI' ? 30 : 27) && finite(c.siderealSunLongitudeDegrees) && finite(c.siderealMoonLongitudeDegrees) && typeof c.historicalRuleVerdict === 'string';
  if (id === 'DG-H-TEMPORAL') return RULERS.includes(c.ruler) && Number.isInteger(c.temporalHourNumber) && c.temporalHourNumber >= 1 && c.temporalHourNumber <= 24 && typeof c.startISO === 'string' && typeof c.endISO === 'string' && Date.parse(c.startISO) < Date.parse(c.endISO);
  return false;
}
function records(comparison, guidance) {
  if (!comparison || !guidance) return { byId: new Map(), context: null, unavailable: 'Canonical comparison or guidance is unavailable for this sample.' };
  if (!plain(comparison) || !plain(guidance) || !plain(comparison.context) || !plain(guidance.context)) throw new TypeError('Supply canonical comparison and guidance records, or null for an unavailable sample.');
  for (const key of ['dateISO', 'lat', 'lon', 'timeZone', 'system', 'prayerMethod', 'asr', 'highLatitude']) if (comparison.context[key] !== guidance.context[key]) throw new RangeError('Comparison and guidance contexts differ at ' + key + '.');
  if (typeof comparison.context.dateISO !== 'string' || !Number.isFinite(Date.parse(comparison.context.dateISO))) throw new TypeError('A dated comparison context is required.');
  if (!Array.isArray(guidance.traditions) || guidance.traditions.length > 12) throw new TypeError('Bounded guidance traditions are required.');
  const byId = new Map();
  for (const tradition of guidance.traditions) {
    if (!Array.isArray(tradition.items) || tradition.items.length > 64) throw new TypeError('Bounded guidance items are required.');
    for (const item of tradition.items) {
      if (!plain(item) || typeof item.id !== 'string' || byId.has(item.id)) throw new TypeError('Guidance rule identifiers must be explicit and unique.');
      byId.set(item.id, item);
    }
  }
  return { byId, context: comparison.context, unavailable: null };
}
function contribution(definition, available) {
  const item = available.byId.get(definition.ruleId);
  let reason = available.unavailable || (!item ? 'Required guidance rule is absent.' : null), value = null;
  if (!reason && (item.classification === 'unavailable' || item.applicability === 'timing-unresolved' || item.computed?.applicability === 'timing-unresolved')) reason = 'The selected rule is unavailable or its opening-portion timing is unresolved.';
  if (!reason && !Object.hasOwn(CLASSES, item.classification)) reason = 'The rule has no recognized observed classification.';
  if (!reason && !measurementPresent(definition.ruleId, item.computed)) reason = 'A required measured input for this rule is absent or invalid.';
  if (!reason && (!Array.isArray(item.sourceIds) || !item.sourceIds.length || item.sourceIds.some(id => !SOURCE_IDS.has(id)))) reason = 'A known rule source is missing.';
  if (!reason) {
    if (definition.mode === 'waxing' || definition.mode === 'waning') {
      if (typeof item.computed?.waxing !== 'boolean' || !Number.isFinite(item.computed?.elongationDegrees)) reason = 'The phase measurement is missing.';
      else value = item.computed.waxing === (definition.mode === 'waxing') ? 1 : -1;
    } else if (definition.mode === 'mercury-hour') {
      if (!RULERS.includes(item.computed?.ruler)) reason = 'No known temporal-hour ruler is available.';
      else value = item.computed.ruler === 'Mercury' ? 1 : 0;
    } else value = CLASSES[item.classification];
  }
  const observed = reason === null;
  return {
    id: definition.id, ruleId: definition.ruleId, label: item?.title || definition.ruleId,
    weight: definition.weight, dependencyGroup: definition.dependencyGroup, mapping: definition.mode,
    observed, value: observed ? value : null, weightedValue: observed ? value * definition.weight : null,
    rawClassification: item?.classification ?? null, reason,
    computed: item?.computed ? copy(item.computed) : null, thresholds: item?.thresholds ? copy(item.thresholds) : null,
    sourceIds: [...(item?.sourceIds || []), 'HR-EDITORIAL'], sourceStatus: item?.sourceStatus || 'No source-qualified rule observed.',
    limitations: [...(item?.limitations || []), 'The numerical contribution and its task relevance are editorial; the original class is retained separately.'],
  };
}

/** Internal transformation only. Public adapters must recompute these records
 * from explicit moment inputs, never accept caller-supplied trusted chart rows. */
export function evaluateHorizonPurposes(input) {
  if (!plain(input) || Object.keys(input).some(k => !['comparison', 'guidance'].includes(k))) throw new TypeError('Supply only comparison and guidance.');
  const available = records(input.comparison, input.guidance);
  return HORIZON_PURPOSES.map(purpose => {
    const contributions = purpose.contributions.map(definition => contribution(definition, available));
    const missing = contributions.filter(row => !row.observed).map(row => ({ id: row.id, reason: row.reason }));
    const observed = contributions.length - missing.length, rankable = missing.length === 0;
    const scoreDenominator = contributions.reduce((sum, row) => sum + row.weight, 0);
    const observedNumerator = contributions.reduce((sum, row) => sum + (row.weightedValue ?? 0), 0);
    const scoreNumerator = rankable ? observedNumerator : null;
    const dependencyGroups = [...new Set(contributions.map(row => row.dependencyGroup))].map(id => {
      const rows = contributions.filter(row => row.dependencyGroup === id);
      return { id, label: GROUPS[id], ruleIds: rows.map(row => row.ruleId), observed: rows.filter(row => row.observed).length, total: rows.length, weight: rows.reduce((sum, row) => sum + row.weight, 0), independentEvidence: false };
    });
    return { id: purpose.id, score: rankable ? 100 * scoreNumerator / scoreDenominator : null, scoreNumerator, scoreDenominator,
      rankable, observed, total: contributions.length, missing, contributions, dependencyGroups,
      sourceIds: [...purpose.sourceIds], scope: 'sampled-instant', wholeDayValidity: false,
      claimType: 'modern-editorial-study-ranking', limitations: [...purpose.limitations],
    };
  });
}
