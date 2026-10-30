// Explain a recomputed moment through named, bounded source conventions.
// No provider calls, storage, birth inference, composite luck score or hidden prose.
import { compareMoment } from './calendar-observatory.js';
import { buildDayGuidance, DAY_GUIDANCE_SOURCES } from './day-guidance.js';
import { castChart, formatLon, signOf, norm360 } from './astro.js';
import { essentialDignity } from './dignities.js';
import { aspectBetween } from './aspects.js';
import { SOLAR } from './data/dignities-data.js';
import { SKY_READING_SOURCES, SKY_READING_CHUNKS } from './data/sky-reading-sources.js';

export { SKY_READING_SOURCES, SKY_READING_CHUNKS };
export const SKY_INTERPRETATION_SCHEMA_VERSION = 1;
export const SKY_READING_LENSES = Object.freeze([
  Object.freeze({ id: 'lilly', label: 'Lilly · dignity and testimony' }),
  Object.freeze({ id: 'agrippa', label: 'Agrippa · celestial conditions' }),
  Object.freeze({ id: 'jyotisha', label: 'Jyotiṣa · lunar partitions' }),
]);
const TRADITIONAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const HOUR_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const BODIES = [...TRADITIONAL, 'Uranus', 'Neptune', 'Pluto'];
const clone = value => JSON.parse(JSON.stringify(value));
const sep = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const LIMITATIONS = [
  'These are source-attributed study readings for one calculated instant, not validated predictions, a personal diagnosis, or a judgment of the entire day.',
  'A moment chart is not automatically a natal or horary chart. Birth data and a question-specific significator are not inferred.',
  'The seven traditional planets have selected historical rules here. Uranus, Neptune and Pluto do not acquire invented Lilly, Agrippa or classical Jyotiṣa interpretations.',
  'Fixed-star interpretations, religious observances and complete electional perfection are not calculated by this reading layer.',
  'A source paragraph, a numerical calculation, a modern reflection and an empirical outcome are different types of evidence.',
];

function optionsOf(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new RangeError('Reading options must be an object.');
  const allowed = ['lensIds', 'planet', 'purpose', 'includeObserver'];
  if (Object.keys(options).some(k => !allowed.includes(k))) throw new RangeError('Unknown sky reading option.');
  const lensIds = options.lensIds ?? SKY_READING_LENSES.map(x => x.id);
  if (!Array.isArray(lensIds) || !lensIds.length || new Set(lensIds).size !== lensIds.length || lensIds.some(id => !SKY_READING_LENSES.some(l => l.id === id))) throw new RangeError('Choose one or more distinct supported reading lenses.');
  const planet = options.planet ?? 'Moon', purpose = options.purpose ?? 'study', includeObserver = options.includeObserver ?? true;
  if (!BODIES.includes(planet)) throw new RangeError('Choose a supported sky body.');
  if (!['study', 'begin', 'complete'].includes(purpose)) throw new RangeError('Choose study, begin or complete as the reflection purpose.');
  if (typeof includeObserver !== 'boolean') throw new RangeError('includeObserver must be a boolean.');
  return { lensIds: [...lensIds], planet, purpose, includeObserver };
}

/** Two explicitly named conventions; finite angular inputs only, not a chart. */
export function compareLillySolarConventions(planetLongitude, sunLongitude) {
  if (![planetLongitude, sunLongitude].every(Number.isFinite)) throw new RangeError('Solar comparison needs finite longitudes.');
  const longitude = norm360(planetLongitude), solarLongitude = norm360(sunLongitude), separationDegrees = sep(longitude, solarLongitude);
  const sameSign = signOf(longitude).index === signOf(solarLongitude).index;
  const legacyCategory = separationDegrees <= SOLAR.cazimi ? 'cazimi' : separationDegrees <= SOLAR.combust ? 'combust' : separationDegrees <= SOLAR.underBeams ? 'under-beams' : 'free';
  const textualCategory = separationDegrees <= SOLAR.cazimi ? 'cazimi' : sameSign && separationDegrees <= SOLAR.combust ? 'combust' : separationDegrees <= SOLAR.underBeams ? 'under-beams' : 'free';
  return { longitude, sunLongitude: solarLongitude, separationDegrees, sameSign, textualCategory, legacyCategory, differs: textualCategory !== legacyCategory,
    thresholds: { cazimiMaxDegrees: SOLAR.cazimi, combustionMaxDegrees: SOLAR.combust, beamsMaxDegrees: SOLAR.underBeams, textualCombustionRequiresSameSign: true, comparison: 'First matching inclusive upper bound; source/model uncertainty is not an exact-boundary guarantee' } };
}

function rule(id, title, classification, reading, computed, sourceIds, extra = {}) {
  return { id, title, classification, reading, computed, sourceIds, thresholds: {}, limitations: [], observerDependent: false, claimType: 'named-traditional-rule', ...extra };
}
function sourceFor(id) { return SKY_READING_SOURCES.find(s => s.id === id) || DAY_GUIDANCE_SOURCES.find(s => s.id === id); }
const DIGNITY_MEANINGS = { Domicile: 'domicile (its own sign)', Exaltation: 'exaltation (a specially dignified sign)', Triplicity: 'triplicity dignity (the selected day/night ruler)', Term: 'term dignity (a bounded degree range)', Face: 'face dignity (a ten-degree division)', Detriment: 'detriment (opposite its own sign)', Fall: 'fall (opposite its exaltation)', Peregrine: 'peregrine status (no essential dignity in the selected scheme)' };
function labels(rows) { return rows.map(r => DIGNITY_MEANINGS[r.kind] || r.kind).join(', ') || 'no listed geocentric dignity or debility'; }

function hourConventions(comparison) {
  const h = comparison.planetaryHours;
  if (h.status !== 'available') return { status: 'unavailable', reason: 'The canonical enclosing sunrise interval is unavailable at this location and instant. This can occur in polar conditions or at a numerical sunrise boundary; no alternate instant or ruler is substituted.', observerDependent: true, equalHora: null, temporalHour: null, sourceIds: ['SKY-RAO-HORA', 'SKY-AGRIPPA-34'] };
  const start = Date.parse(h.sunrise), end = Date.parse(h.nextSunrise), instant = Date.parse(comparison.context.dateISO);
  if (!(end > start && instant >= start && instant < end) || !HOUR_ORDER.includes(h.dayRuler)) throw new RangeError('No valid enclosing sunrise day for the named hora comparison.');
  const partMs = (end - start) / 24, index = Math.min(23, Math.floor((instant - start) / partMs));
  const ruler = HOUR_ORDER[(HOUR_ORDER.indexOf(h.dayRuler) + index) % 7];
  return { status: 'available', observerDependent: true, sourceIds: ['SKY-RAO-HORA', 'SKY-AGRIPPA-34'], dayRuler: h.dayRuler, sunriseISO: h.sunrise, nextSunriseISO: h.nextSunrise,
    equalHora: { method: 'Rao §1.3.11: 24 equal sunrise-day divisions', ruler, number: index + 1, durationMinutes: partMs / 60000, startISO: new Date(start + index * partMs).toISOString(), endISO: new Date(start + (index + 1) * partMs).toISOString() },
    temporalHour: { method: 'Twelve daylight / twelve night divisions reported in Agrippa II.34', ruler: h.ruler, number: h.hourNumber, durationMinutes: h.hourLengthMinutes, startISO: h.currentStartISO, endISO: h.currentEndISO },
    sameRuler: ruler === h.ruler, sameHourNumber: index + 1 === h.hourNumber,
    limitations: ['Both methods reuse the same canonical sunrise data; agreement is not independent corroboration.', 'The author’s example rounds to civil hours; the calculated equal-hora interval here can differ from exactly sixty minutes.', 'The ecliptic-ascension alternative in Agrippa II.34 is not calculated.'] };
}

/** Two actual calculations sharing sunrise boundaries, with no caller-supplied rows. */
export function compareSunriseHourConventions(input) { return hourConventions(compareMoment(input)); }

function lillyRules(chart, guidance, comparison, options) {
  const { planet, includeObserver } = options, p = chart.planets[planet], rules = [];
  if (!p || !TRADITIONAL.includes(planet)) return [rule('SKY-L-UNSUPPORTED', `${planet} · no Lilly rule`, 'unavailable', `This view can display ${planet} astronomically. Lilly’s selected seven-planet rules do not supply an interpretation for it.`, { planet, interpreted: false }, ['SKY-LILLY-DIGNITY'], { claimType: 'unavailable-implementation' })];
  const dignity = essentialDignity(planet, p.lon, chart.isDay);
  const rows = includeObserver ? dignity.rows : dignity.rows.filter(r => !['Triplicity', 'Peregrine'].includes(r.kind));
  const pos = rows.some(r => r.score > 0), neg = rows.some(r => r.score < 0);
  rules.push(rule('SKY-L-DIGNITY', `${planet} · essential dignity`, pos && neg ? 'mixed' : pos ? 'favorable' : neg ? 'caution' : 'neutral',
    `${planet} at ${formatLon(p.lon)} has ${labels(rows).toLowerCase()} in the selected Lilly table. ${pos ? 'This supplies a dignity testimony within that convention.' : 'This does not supply a positive dignity testimony in the displayed subset.'}`,
    { planet, longitudeDegrees: p.lon, sign: signOf(p.lon).name, rows: rows.map(r => ({ kind: r.kind, conventionalPoints: r.score })), dispositor: dignity.dispositor,
      ...(includeObserver ? { isDay: chart.isDay, sectMethod: chart.sectMethod, sunAltitudeDegrees: chart.sunAltitude, conventionalTotal: dignity.total } : { withheld: ['day/night triplicity', 'peregrine category', 'total dependent on sect'] }) },
    ['SKY-LILLY-DIGNITY', 'SKY-ENGINE'], { observerDependent: includeObserver, limitations: ['Points are the named historical ledger, not a probability, overall day score or cross-tradition vote.', ...(includeObserver ? [] : ['Observer-dependent triplicity and the resulting peregrine/total decision are withheld.'])] }));
  if (planet !== 'Sun') {
    const solar = compareLillySolarConventions(p.lon, chart.planets.Sun.lon), category = solar.textualCategory;
    rules.push(rule('SKY-L-SOLAR', `${planet} · Sun proximity`, ['combust', 'under-beams'].includes(category) ? 'caution' : 'favorable',
      `${planet} is ${solar.separationDegrees.toFixed(3)}° from the Sun: ${category.replaceAll('-', ' ')} under the named textual rule.${solar.differs ? ` The legacy angular-only calculator instead says ${solar.legacyCategory}; the same-sign requirement explains the difference.` : ''}`,
      { planet, ...solar }, ['SKY-LILLY-SOLAR', 'SKY-LEGACY-SOLAR'], { thresholds: solar.thresholds, limitations: ['This is the same-sign reading of a selected modern transcription; it is not a silent change to the legacy dignity engine.', 'The inspected transcription’s 28° / 18° example conflicts with its stated 8°30′ rule; this comparison follows the stated rule and preserves the discrepancy.', 'Angular proximity is not evidence that an eclipse or an observable conjunction is occurring.'] }));
  }
  if (!['Sun', 'Moon'].includes(planet)) rules.push(rule('SKY-L-MOTION', `${planet} · apparent motion`, p.speed < 0 ? 'caution' : p.speed > 0 ? 'favorable' : 'neutral',
    `${planet} is ${p.speed < 0 ? 'retrograde' : p.speed > 0 ? 'direct' : 'at zero instantaneous sampled speed'} at ${p.speed.toFixed(5)}° per day in apparent geocentric longitude. Lilly’s selected table treats direct and retrograde as different testimonies.`,
    { planet, speedDegreesPerDay: p.speed, retrograde: p.speed < 0, frame: 'apparent geocentric tropical ecliptic of date', finiteDifferenceDays: .5 }, ['SKY-LILLY-MOTION', 'SKY-ENGINE'], { limitations: ['This is a central-difference speed, not a solved station time; no arbitrary station-nearness threshold is added.', 'Apparent retrograde does not reverse the heliocentric orbit.'] }));
  const aspects = TRADITIONAL.filter(name => name !== planet).map(name => {
    const a = aspectBetween(planet, p, name, chart.planets[name]);
    return a ? { otherPlanet: name, ...a } : null;
  }).filter(Boolean);
  rules.push(rule('SKY-L-ASPECTS', `${planet} · aspect testimony`, 'neutral', aspects.length ? `${aspects.length} classical aspect${aspects.length === 1 ? '' : 's'} lie within the selected planetary half-orbs. ${aspects.slice(0, 2).map(a => `${a.applying ? 'Applying' : 'Separating'} ${a.aspect.toLowerCase()} to ${a.otherPlanet}, ${a.orb.toFixed(2)}° from exact`).join('; ')}.` : 'No classical aspect lies within the selected planetary half-orb allowances.',
    { planet, longitudeDegrees: p.lon, aspects }, ['DG-ASPECTS', 'SKY-LILLY-DIGNITY'], { thresholds: { applyingLookAheadDays: .05 }, limitations: ['Applying/separating is the canonical short linear-motion comparison, not a solved future perfection.', 'A complete horary judgment requires a real question, significators, reception and other testimonies; these are not inferred.'] }));
  if (planet === 'Moon') {
    const phase = guidance.traditions.find(t => t.id === 'western-lilly').items.find(r => r.id === 'DG-W-LIGHT');
    rules.push({ ...clone(phase), id: 'SKY-L-LIGHT', observerDependent: false, claimType: 'named-traditional-rule' });
  }
  return rules;
}

function agrippaRules(chart, comparison, options) {
  const { planet, includeObserver } = options, p = chart.planets[planet];
  if (!p || !TRADITIONAL.includes(planet)) return [rule('SKY-A-UNSUPPORTED', `${planet} · no Agrippa rule`, 'unavailable', `The selected Agrippa chapters do not name ${planet} as one of their seven planetary rulers. A modern astronomical marker does not supply a historical interpretation.`, { planet, interpreted: false }, ['SKY-AGRIPPA-29'], { claimType: 'unavailable-implementation' })];
  const dignity = essentialDignity(planet, p.lon, chart.isDay);
  const rows = (includeObserver ? dignity.rows : dignity.rows.filter(r => !['Triplicity', 'Peregrine'].includes(r.kind))).map(r => ({ kind: r.kind, conventionalPoints: r.score }));
  const dignityConditionMet = rows.some(r => r.conventionalPoints > 0);
  const inspectedBodies = [...new Set([planet, 'Moon', 'Mercury'])].map(name => `${name} at ${formatLon(chart.planets[name].lon)}`);
  const inspection = inspectedBodies.length === 2 ? inspectedBodies.join(' and ') : `${inspectedBodies.slice(0, -1).join(', ')}, and ${inspectedBodies.at(-1)}`;
  const rules = [rule('SKY-A-DIGNITY', 'Agrippa · dignity condition, using Lilly’s table', 'neutral',
    `${planet} at ${formatLon(p.lon)} has ${labels(rows)} in the selected Lilly table${includeObserver ? '' : '’s observer-independent subset'}. ${dignityConditionMet ? 'This supplies one of Agrippa’s requested dignity conditions.' : 'This does not supply a positive dignity testimony in the evaluated subset.'} The remaining election conditions are separate.`,
    { selectedPlanet: { name: planet, longitudeDegrees: p.lon }, dignityRows: rows, dignityConditionMet, tableConvention: 'Existing Lilly essential-dignity table; not an independently specified Agrippa table', ...(includeObserver ? { isDay: chart.isDay, sectMethod: chart.sectMethod } : { withheld: ['triplicity', 'peregrine decision', 'sect-dependent total'] }) }, ['SKY-AGRIPPA-29', 'SKY-LILLY-DIGNITY'],
    { observerDependent: includeObserver, limitations: ['This is one condition in a source-led checklist, not a completed Agrippa election or an outcome recommendation.', 'The selected Lilly dignity table is an explicit implementation choice; II.29 does not specify all of its numerical boundaries.'] }),
    rule('SKY-A-OBSERVATION', 'Agrippa · shared planetary positions', 'neutral', `${inspection}. These are distinct calculated inputs to the source’s multi-condition approach, not several independent votes for an outcome.`,
    { selectedPlanet: { name: planet, longitudeDegrees: p.lon, speedDegreesPerDay: p.speed }, moonLongitudeDegrees: chart.planets.Moon.lon, mercuryLongitudeDegrees: chart.planets.Mercury.lon }, ['SKY-AGRIPPA-29', 'SKY-ENGINE'],
    { limitations: ['The chapter’s complete election is not implemented here. No hidden weights, favorable percentage, ritual efficacy or successful outcome is inferred.', 'Dignity tables and exact aspect allowances require their own named convention; Agrippa II.29 is not a source for every existing numerical threshold.'] })];
  if (includeObserver) {
    const h = comparison.planetaryHours, available = h.status === 'available';
    rules.push(rule('SKY-A-HOUR', 'Agrippa · planetary day and hour', available ? 'neutral' : 'unavailable', available ? `${h.ruler} rules this temporal hour; ${h.dayRuler} rules the sunrise day. ${planet === h.ruler ? `${planet} matches the hour ruler.` : `${planet} does not match the hour ruler.`} This is one reported condition, not a complete verdict.` : hourConventions(comparison).reason,
      available ? { selectedPlanet: planet, hourRuler: h.ruler, dayRuler: h.dayRuler, matchesHour: planet === h.ruler, matchesDay: planet === h.dayRuler, startISO: h.currentStartISO, endISO: h.currentEndISO, hourLengthMinutes: h.hourLengthMinutes, timeZone: comparison.context.timeZone } : { selectedPlanet: planet, available: false }, ['SKY-AGRIPPA-29', 'SKY-AGRIPPA-34'],
      { observerDependent: true, thresholds: { daylightParts: 12, nightParts: 12 }, limitations: ['The alternative ecliptic-ascension hour convention in II.34 is not calculated.', 'Day and hour agreement is not independent corroboration or evidence of a favorable outcome.'] }));
  }
  if (planet !== 'Sun') rules.push(rule('SKY-A-SOLAR', 'Agrippa · Sun conjunction language', 'neutral', `The angular separation of ${planet} and the Sun is ${sep(p.lon, chart.planets.Sun.lon).toFixed(3)}°. Agrippa’s selected chapter gives a broad conjunction warning; it supplies neither this view’s numerical orb nor Lilly’s numerical cazimi exception.`,
    { planet, separationDegrees: sep(p.lon, chart.planets.Sun.lon), numericalConjunctionThresholdSuppliedByPassage: false, outcomeClassified: false }, ['SKY-AGRIPPA-29', 'SKY-LILLY-SOLAR'], { limitations: ['No threshold is invented to turn this broad source statement into an automatic binary warning.'] }));
  return rules;
}

function jyotishaRules(comparison, guidance, options) {
  const p = comparison.vedic.panchanga;
  const rules = [
    rule('SKY-J-TITHI', 'Tithi · a lunar angle', 'neutral', `${p.tithi.name}, ${p.tithi.paksha}: tithi ${p.tithi.num} of 30. The Moon–Sun angle is ${comparison.astronomy.moonSunElongation.toFixed(3)}°, so this is a lunar interval, not a whole midnight-to-midnight day.`, { moonSunElongationDegrees: comparison.astronomy.moonSunElongation, tithiNumber: p.tithi.num, name: p.tithi.name, paksha: p.tithi.paksha }, ['SKY-RAO-PARTITIONS', 'SKY-ENGINE'], { claimType: 'calculated-convention', thresholds: { intervalDegrees: 12 }, limitations: ['An instant tithi does not determine a regional festival or its sunrise observance rule.'] }),
    rule('SKY-J-NAKSHATRA', 'Nakṣatra · a sidereal sector', 'neutral', `The Moon occupies ${p.nakshatra.name}, pāda ${p.nakshatra.pada}, in the approximate Lahiri frame. Its sidereal longitude is ${comparison.vedic.moon.longitude.toFixed(3)}°; the tropical longitude is ${comparison.astronomy.moonLongitude.toFixed(3)}°.`, { siderealMoonLongitudeDegrees: comparison.vedic.moon.longitude, tropicalMoonLongitudeDegrees: comparison.astronomy.moonLongitude, ayanamshaDegrees: comparison.vedic.ayanamsha.degrees, nakshatraNumber: p.nakshatra.num, name: p.nakshatra.name, pada: p.nakshatra.pada }, ['SKY-RAO-PARTITIONS', 'SKY-ENGINE'], { claimType: 'calculated-convention', thresholds: { sectorDegrees: 360 / 27, padaDegrees: 360 / 108 }, limitations: ['The canonical linear Lahiri estimate is approximate; it is not exact Jagannatha Hora equivalence.', 'A named equal sector is not an IAU constellation boundary or a personal birth prediction.'] }),
  ];
  if (!TRADITIONAL.includes(options.planet)) rules.push(rule('SKY-J-UNSUPPORTED', `${options.planet} · no classical rule`, 'unavailable', 'The lunar partitions above remain computable. The selected classical lens supplies no personal interpretation of this outer planet.', { planet: options.planet, interpreted: false }, ['SKY-RAO-PARTITIONS'], { claimType: 'unavailable-implementation' }));
  const traditional = guidance.traditions.find(t => t.id === 'jyotisha-muhurta');
  rules.push(...traditional.items.map(r => ({ ...clone(r), id: `SKY-${r.id}`, observerDependent: false, claimType: 'named-traditional-rule', limitations: [...r.limitations, 'The newly read Rao partition formulas do not independently verify this inherited quality classification.'] })));
  if (options.includeObserver) {
    const h = hourConventions(comparison), available = h.status === 'available';
    rules.push(rule('SKY-J-HORA', 'Rao · 24 equal sunrise-day horas', available ? 'neutral' : 'unavailable', available ? `${h.equalHora.ruler} rules hora ${h.equalHora.number} in Rao’s named equal-division convention (${h.equalHora.durationMinutes.toFixed(2)} minutes). The daylight/night method gives ${h.temporalHour.ruler} in hour ${h.temporalHour.number}.${h.sameRuler ? ' The rulers agree at this instant.' : ' The rulers differ because the day is divided differently.'}` : h.reason, h, ['SKY-RAO-HORA', 'SKY-AGRIPPA-34'], { observerDependent: true, claimType: 'calculated-convention', thresholds: { equalSunriseDayParts: 24 }, limitations: ['This is the selected author’s convention, not a universal Jyotiṣa rule or a claim of exact current JHora settings.', ...(h.limitations || [])] }));
  }
  return rules;
}

export function skyReadingWorkedExamples() {
  return [
    { id: 'SKY-EX-SECT', title: 'Lilly’s Sun in Aries: day and night', kind: 'worked-source-example', sourceIds: ['SKY-LILLY-DIGNITY'], inputs: { planet: 'Sun', longitudeDegrees: 10, syntheticDegreeWithinSourceSign: true }, result: { day: essentialDignity('Sun', 10, true), night: essentialDignity('Sun', 10, false) }, explanation: 'The cited example gives the sign rather than this exact degree. At the illustrative 10° Aries, exaltation remains while the Sun’s triplicity dignity changes with sect. These are arithmetic examples, not dated observed events.' },
    { id: 'SKY-EX-CROSS-SIGN', title: 'Why two combustion readings can disagree', kind: 'synthetic-method-example', sourceIds: ['SKY-LILLY-SOLAR', 'SKY-LEGACY-SOLAR'], inputs: { planetLongitudeDegrees: 31, sunLongitudeDegrees: 29 }, result: compareLillySolarConventions(31, 29), explanation: 'The invented 1° Taurus / 29° Aries pair is 2° apart across a sign boundary. The textual same-sign rule gives under-beams, while the legacy angular-only rule gives combustion. It is a method comparison, not a printed Lilly figure.' },
    { id: 'SKY-EX-TITHI', title: 'Rao Example 2: tithi 19', kind: 'worked-source-example', sourceIds: ['SKY-RAO-PARTITIONS'], inputs: { moonLongitudeDegrees: 84 + 12 / 60, sunLongitudeDegrees: 227 + 46 / 60 }, result: { elongationDegrees: norm360((84 + 12 / 60) - (227 + 46 / 60)), tithiNumber: Math.floor(norm360((84 + 12 / 60) - (227 + 46 / 60)) / 12) + 1 }, explanation: 'The selected textbook example gives 216°26′ elongation, tithi 19, Krishna Chaturthi. It demonstrates arithmetic, not an event prediction.' },
  ];
}

/** All displayed values are recomputed; imported prose/rows/context are ignored. */
export function buildSkyInterpretation(input, options = {}) {
  const opts = optionsOf(options), comparison = compareMoment(input), c = comparison.context;
  const chart = castChart(new Date(c.dateISO), c.lat, c.lon, c.system), guidance = buildDayGuidance(c);
  const selected = chart.planets[opts.planet], facts = [
    { id: 'SKY-F-PHASE', title: 'Moon phase', value: comparison.astronomy.phaseLabel, computed: { moonSunElongationDegrees: comparison.astronomy.moonSunElongation, illuminatedFraction: comparison.astronomy.moonIlluminatedFraction }, observerDependent: false, claimType: 'calculated-astronomy', sourceIds: ['SKY-ENGINE'] },
  ];
  if (selected && TRADITIONAL.includes(opts.planet)) facts.unshift({ id: 'SKY-F-SELECTED', title: `${opts.planet} · tropical position`, value: formatLon(selected.lon), computed: { planet: opts.planet, longitudeDegrees: selected.lon, latitudeDegrees: selected.lat, speedDegreesPerDay: selected.speed, retrograde: selected.retrograde }, observerDependent: false, claimType: 'calculated-astronomy', sourceIds: ['SKY-ENGINE'] });
  if (opts.includeObserver && selected && TRADITIONAL.includes(opts.planet)) facts.push({ id: 'SKY-F-HOUSE', title: 'Selected house convention', value: `${opts.planet} in house ${selected.house} · ${chart.system}`, computed: { planet: opts.planet, house: selected.house, requestedSystem: c.system, actualSystem: chart.system, warning: chart.houseWarning || null }, observerDependent: true, claimType: 'calculated-convention', sourceIds: ['SKY-ENGINE'] });
  const builders = { lilly: () => lillyRules(chart, guidance, comparison, opts), agrippa: () => agrippaRules(chart, comparison, opts), jyotisha: () => jyotishaRules(comparison, guidance, opts) };
  const lenses = SKY_READING_LENSES.filter(l => opts.lensIds.includes(l.id)).map(l => ({ ...l, rules: builders[l.id]() }));
  const differences = [];
  if (opts.lensIds.includes('lilly') && selected && opts.planet !== 'Sun' && TRADITIONAL.includes(opts.planet)) {
    const solar = compareLillySolarConventions(selected.lon, chart.planets.Sun.lon);
    differences.push({ id: 'SKY-D-SOLAR-METHOD', title: 'Textual and legacy solar rules', kind: 'implementation-vs-selected-text', differsAtThisInstant: solar.differs, observerDependent: false, sourceIds: ['SKY-LILLY-SOLAR', 'SKY-LEGACY-SOLAR'], ruleIds: ['SKY-L-SOLAR'], text: solar.differs ? 'Different categories arise from the same-sign requirement, not different ephemerides.' : 'The categories agree at this instant, but the same-sign and angular-only conventions remain different methods.', computed: solar });
    if (opts.lensIds.includes('agrippa')) differences.push({ id: 'SKY-D-CAZIMI', title: 'Two texts do not state the same exception', kind: 'source-scope-difference', observerDependent: false, sourceIds: ['SKY-LILLY-SOLAR', 'SKY-AGRIPPA-29'], ruleIds: ['SKY-L-SOLAR', 'SKY-A-SOLAR'], text: 'Lilly’s selected passage supplies a numerical cazimi exception; Agrippa II.29 does not. This is a source-scope difference, not an automatic contradiction or a vote.', computed: { selectedPlanet: opts.planet, cazimiUnderSelectedLillyRule: solar.textualCategory === 'cazimi' } });
  }
  if (opts.lensIds.includes('jyotisha')) differences.push({ id: 'SKY-D-FRAME', title: 'Same Moon, different zodiac origins', kind: 'coordinate-convention', observerDependent: false, sourceIds: ['SKY-RAO-PARTITIONS', 'SKY-ENGINE'], ruleIds: ['SKY-J-NAKSHATRA'], text: `Tropical Moon: ${comparison.western.moon.sign}; sidereal Moon: ${comparison.vedic.moon.sign}. The approximate Lahiri offset changes the coordinate label, not the underlying planet.`, computed: { tropicalMoonLongitudeDegrees: comparison.astronomy.moonLongitude, siderealMoonLongitudeDegrees: comparison.vedic.moon.longitude, ayanamshaDegrees: comparison.vedic.ayanamsha.degrees } });
  if (opts.includeObserver && opts.lensIds.includes('jyotisha') && opts.lensIds.includes('agrippa')) {
    const h = hourConventions(comparison);
    differences.push({ id: 'SKY-D-HOUR-CONVENTIONS', title: 'Equal sunrise-day hours versus daylight/night hours', kind: 'time-division-convention', observerDependent: true, sourceIds: ['SKY-RAO-HORA', 'SKY-AGRIPPA-34'], ruleIds: ['SKY-J-HORA', 'SKY-A-HOUR'], text: h.status === 'available' ? `Rao’s 24 equal sunrise-day divisions give ${h.equalHora.ruler}; the selected Agrippa-reported temporal method gives ${h.temporalHour.ruler}. The ${h.sameRuler ? 'matching ruler does not make the division methods identical' : 'different rulers arise from division methods, not a time-zone error'}.` : 'The needed sunrise interval is unavailable; neither convention receives an invented ruler.', computed: h });
  }
  const purpose = { study: 'Compare a displayed fact with its rule and source before forming your own interpretation.', begin: 'For an optional creative beginning, choose one small reversible step and compare how each selected lens describes the moment.', complete: 'For an optional completion exercise, summarize one unfinished note and compare the traditions without treating them as a deadline.' }[opts.purpose];
  const leading = lenses[0]?.rules.find(r => r.classification !== 'unavailable')?.reading || lenses[0]?.rules[0]?.reading || '';
  const summary = `${selected && TRADITIONAL.includes(opts.planet) ? `${opts.planet}: ${formatLon(selected.lon)}. ` : ''}${comparison.astronomy.phaseLabel}. ${leading}`;
  const used = new Set([...facts, ...lenses.flatMap(l => l.rules), ...differences].flatMap(x => x.sourceIds));
  const sources = [...used].map(id => {
    const s = sourceFor(id); if (!s) throw new Error(`Unresolved sky source: ${id}`);
    return clone(s.readingDepth ? s : { ...s, locator: s.locator || s.title, readingDepth: s.status, rights: 'Inherited project source record; follow the original source’s rights', claimType: 'inherited-source-record' });
  });
  return { schemaVersion: SKY_INTERPRETATION_SCHEMA_VERSION, context: opts.includeObserver ? { ...c } : { dateISO: c.dateISO }, options: opts, summary, facts, lenses, differences,
    sharedInputs: [{ id: 'SKY-DEPENDENCY-LUNAR', text: 'Phase, tithi and lunar rules share Sun/Moon positions; agreement is not independent evidence.', sourceIds: ['SKY-ENGINE'], observerDependent: false }],
    optionalReflection: { purpose: opts.purpose, text: purpose, claimType: 'modern-editorial-reflection', observerDependent: false }, sources,
    sourceCoverage: { selectedPassagesRead: true, selectedNewSourceIds: sources.filter(s => s.id.startsWith('SKY-') && !['SKY-ENGINE','SKY-LEGACY-SOLAR'].includes(s.id)).map(s => s.id), inheritedSourceIds: sources.filter(s => !s.id.startsWith('SKY-')).map(s => s.id), fullBooksRead: false, unimplementedHistoricalBodies: ['Uranus', 'Neptune', 'Pluto'], completeElectionJudgment: false, fixedStarInterpretation: false },
    limitations: [...LIMITATIONS, ...(!opts.includeObserver ? ['Observer location, zone, house, sect and temporal-hour output are withheld; observer-independent dignity rows remain without a total.'] : [])] };
}
