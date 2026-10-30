// Source-labelled symbolic study guidance. No universal day score, event forecast,
// network, storage, random values, current clock, or fixed-star alignment.
import { compareMoment } from './calendar-observatory.js';
import { castChart, norm360 } from './astro.js';
import { accidentalDignity } from './dignities.js';
import { moonInViaCombusta } from './considerations.js';
import { aspectBetween } from './aspects.js';
import { SOLAR, ORBS } from './data/dignities-data.js';
import { YOGA_SCREEN, KARANA_SCREEN, NAKSHATRA_CLASSES } from './data/muhurta-data.js';
import { zonedCivilDay, zonedTimeCandidates, civilFields } from './time.js';

export const DAY_GUIDANCE_SCHEMA_VERSION = 1;
export const DAY_GUIDANCE_SOURCES = [
  { id: 'DG-AGRIPPA-29', title: 'Agrippa, Three Books of Occult Philosophy, II.29', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', locator: 'Positions, motions, aspects, signs/degrees, observer latitude and Moon/day/hour conditions', status: 'Selected primary chapter read in the 1651 English digital edition; it does not verify the exact Lilly thresholds used below' },
  { id: 'DG-LILLY', title: 'Lilly, Christian Astrology (1647), Books I–II', url: 'https://en.wikisource.org/wiki/Christian_Astrology', locator: 'Project transcriptions of dignity, solar proximity and Moon cautions; Wikisource is the 1659 second edition', implementation: 'assets/js/core/cautions.js', status: 'Inherited project transcription; fresh Lilly primary-passage verification pending after source access failures; numerical thresholds and interpretive qualifications shown per rule' },
  { id: 'DG-SOLAR', title: 'Lilly solar-proximity thresholds in the existing dignity table', url: 'assets/js/core/data/dignities-data.js', locator: 'SOLAR: cazimi 17/60°, combustion 8.5°, beams 17°; source comments cite CA pp.113–114', status: 'Existing sourced numerical table; not a new primary-text collation' },
  { id: 'DG-ASPECTS', title: 'Lilly planetary orbs and applying-aspect implementation', url: 'assets/js/core/aspects.js', locator: 'aspectBetween(); primary planetary half-orbs; 0.05-day linear-motion test', status: 'Calculated geometry plus historical orb convention; applying is an approximation, not a solved future event' },
  { id: 'DG-PHASE', title: 'Project Moon phase and speed rules', url: 'assets/js/core/cautions.js', locator: 'moonCautions(): waxing elongation <180°; slow <12°/day; reference mean 13.176°/day', status: 'Existing electional study heuristic; the 12° and 13.176° thresholds are not presented as newly verified exact quotations from Lilly' },
  { id: 'DG-MUHURTA', title: 'Inherited Pañcāṅga classification tables', url: 'assets/js/core/data/muhurta-data.js', locator: 'TITHI_SCREEN; YOGA_SCREEN; KARANA_SCREEN; NAKSHATRA_CLASSES, with original citation-health and variant notes', status: 'Modern secondary transcriptions; primary-passage verification pending; no empirical outcome validation' },
  { id: 'DG-HOURS', title: 'Agrippa, Three Books of Occult Philosophy, II.34', url: 'https://esotericarchives.com/agrippa/agripp2c.htm', locator: 'Twelve daylight and twelve night divisions; competing ascension convention remains separate', implementation: 'assets/js/core/planetary-hours.js', status: 'Historical temporal-hour convention, not evidence of a favorable outcome' },
  { id: 'DG-CALENDARS', title: 'Calendar comparison methods and boundaries', url: 'docs/2026-10-calendar-methods.md', locator: 'Civil-midnight date displays; not religious observance or auspiciousness decisions', status: 'Method documentation' },
  { id: 'DG-TIME', title: 'Explicit IANA local-clock and civil-day handling', url: 'assets/js/core/time.js', locator: 'zonedCivilDay(); zonedTimeCandidates(); supplied runtime time-zone database', status: 'Computational method; hourly samples are not exact astrological transition searches' },
];
const LIMITS = [
  'Favorable, caution and neutral describe named traditional rule classes for the sampled instant, not a prediction, personal judgment, or a verdict on the entire civil day.',
  'Optional actions are modern editorial reflection exercises. They are not quotations from a historical book or required activities.',
  'Separate testimonies can disagree; there is no universal score, vote, confidence percentage, or cancellation of cautions by favorable rules.',
  'Civil-calendar date names do not imply good or bad days. Religious observances, personal birth data, fixed-star positions, and horary questions are not inferred.',
  'The selected subset omits the legacy aggregate chart-health score, question-specific early/late Ascendant and radicality rules, void-of-course approximations, house-based judgments, and unprecessed historical fixed-star tables.',
];
const HOUR_THEMES = {
  Sun: ['purpose', 'Write one clear intention for a small creative task.'],
  Moon: ['change', 'Record one change you notice in your surroundings.'],
  Mercury: ['language', 'Proofread a short note, or learn one unfamiliar word.'],
  Venus: ['art and connection', 'Make a small sketch, or listen closely to a piece of music.'],
  Mars: ['effort', 'Choose one short, manageable tidying task and finish it.'],
  Jupiter: ['learning', 'Read one page and write a question it raises.'],
  Saturn: ['structure', 'Review one routine and note a manageable improvement.'],
};
const sourceCopy = () => JSON.parse(JSON.stringify(DAY_GUIDANCE_SOURCES));
const separation = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const planetData = (chart, names) => names.map(name => ({ name, longitudeDegrees: chart.planets[name].lon, latitudeDegrees: chart.planets[name].lat, speedDegreesPerDay: chart.planets[name].speed, frame: 'geocentric apparent tropical ecliptic of date' }));
const classificationOf = verdict => /favou?rable/i.test(verdict || '') ? 'favorable' : verdict === 'avoid' ? 'caution' : 'neutral';
function item(id, classification, title, reading, action, computed, thresholds, sourceIds, more = {}) {
  return { id, classification, kind: 'traditional-classification', title, reading,
    optionalAction: { text: action, status: 'Optional modern editorial reflection; no outcome promise' },
    rule: { id, algorithm: more.algorithm || title }, computed, thresholds, sourceIds,
    scope: 'sampled-instant', wholeDayValidity: false, fixedStarsUsed: false, housesUsed: false,
    sourceStatus: more.sourceStatus || 'Inherited source-labelled study rule; no demonstrated predictive validity',
    limitations: [], ...more };
}
function lunarRules(comparison, chart) {
  const sun = chart.planets.Sun, moon = chart.planets.Moon;
  const elongation = norm360(moon.lon - sun.lon), waxing = elongation < 180, speed = Math.abs(moon.speed);
  const solarDistance = separation(moon.lon, sun.lon);
  // Reuse the existing dignity classification, selecting only its solar row.
  // Its house and fixed-star rows are deliberately excluded from this guide.
  const solarRow = accidentalDignity('Moon', chart).rows.find(row => /Cazimi|Combust|Under the Sun|Free from combustion/.test(row.kind));
  const solarKey = solarDistance <= SOLAR.cazimi ? 'cazimi' : solarDistance <= SOLAR.combust ? 'combust' : solarDistance <= SOLAR.underBeams ? 'beams' : 'free';
  const solarClass = solarKey === 'combust' || solarKey === 'beams' ? 'caution' : 'favorable';
  const via = moonInViaCombusta(chart);
  const rules = [
    item('DG-W-LIGHT', waxing ? 'favorable' : 'neutral', waxing ? 'Waxing Moon · increase convention' : 'Waning Moon · decrease convention',
      waxing ? 'The inherited electional convention associates increasing light with beginnings and growth.' : 'The inherited convention associates decreasing light with completion and release; it is not a universal bad-day label.',
      waxing ? 'Draft the first sentence or first sketch of a small project.' : 'Choose one unfinished note to summarize, or remove one unnecessary item from a draft.',
      { planets: planetData(chart, ['Sun', 'Moon']), elongationDegrees: elongation, waxing }, { waxing: '0° ≤ Moon−Sun elongation <180°; waning 180°–360°' }, ['DG-PHASE'],
      { algorithm: 'Classify Moon−Sun ecliptic elongation at 180°; increase/decrease is purpose-dependent', limitations: ['For a decrease-oriented symbolic study, waning can be preferred. This label does not claim one phase is best for every activity.'] }),
    item('DG-W-SPEED', speed >= 13.176 ? 'favorable' : speed < 12 ? 'caution' : 'neutral', 'Moon speed · inherited study threshold',
      speed >= 13.176 ? 'The Moon is at or above this implementation’s mean-speed reference, traditionally read as swiftness.' : speed < 12 ? 'The Moon is below the implementation’s slow-motion threshold, traditionally read as a caution.' : 'The Moon lies between the implementation’s slow threshold and mean-speed reference; this rule stays neutral.',
      speed >= 13.176 ? 'Try a five-minute learning exercise and record what you completed.' : 'Break one low-stakes task into a smaller step and note how it feels to work at that pace.',
      { planets: planetData(chart, ['Moon']), absoluteSpeedDegreesPerDay: speed }, { slowBelowDegreesPerDay: 12, referenceMeanDegreesPerDay: 13.176, favorableAtOrAboveMean: true }, ['DG-PHASE'],
      { algorithm: 'Use absolute apparent geocentric daily speed; <12 caution, [12,13.176) neutral, ≥13.176 favorable', limitations: ['These are the existing project’s numerical study thresholds, not a newly verified verbatim historical boundary. No task duration or outcome is predicted.'] }),
    item('DG-W-SOLAR', solarClass, 'Moon and Sun · solar-proximity convention',
      `The existing dignity engine classifies the Moon as “${solarRow?.kind || solarKey}”. This is a symbolic dignity category based on angular separation.`,
      solarClass === 'caution' ? 'Write a question you would like to clarify before starting a creative exercise.' : 'Make a small drawing that contrasts light and shadow, and note the category used here.',
      { planets: planetData(chart, ['Sun', 'Moon']), separationDegrees: solarDistance, selectedCategory: solarKey, inheritedRow: solarRow?.kind || null }, { cazimiMaxDegrees: SOLAR.cazimi, combustMaxDegrees: SOLAR.combust, underBeamsMaxDegrees: SOLAR.underBeams, matching: 'first matching inclusive upper bound' }, ['DG-SOLAR', 'DG-LILLY', 'DG-AGRIPPA-29'],
      { algorithm: 'Reuse accidentalDignity solar row only; ignore its house, fixed-star, and aggregate-score rows', limitations: ['Cazimi can be favorable in this Lilly dignity table, while Agrippa II.29 broadly warns about conjunction with the Sun and a new/dark Moon is cautioned by another electional rule. These are distinct source conventions; the guide does not resolve the disagreement.'] }),
    item('DG-W-VIA', via ? 'caution' : 'neutral', 'Moon · Via Combusta convention',
      via ? 'The Moon lies in the selected 15° Libra–15° Scorpio band, a caution in this Lilly study convention.' : 'The Moon lies outside this convention’s Via Combusta band. Absence of this one caution is not a favorable verdict.',
      via ? 'Compare two accounts of the “burning way” and note where their boundaries or exceptions differ.' : 'Record the Moon’s degree alongside the named convention, without adding an all-clear judgment.',
      { planets: planetData(chart, ['Moon']), inSelectedBand: via }, { inclusiveLowerLongitudeDegrees: 195, inclusiveUpperLongitudeDegrees: 225 }, ['DG-LILLY'],
      { algorithm: 'Reuse moonInViaCombusta(), inclusive tropical [195°,225°]', limitations: ['This is the simple caution-module convention. The separate election engine offers configurable bounds and a dated Spica exception; that alternative is not applied here. No fixed star is calculated or used.'] }),
  ];
  for (const name of ['Mars', 'Saturn']) {
    const aspect = aspectBetween('Moon', moon, name, chart.planets[name]);
    const hardApplying = !!aspect && aspect.applying && ['Conjunction', 'Square', 'Opposition'].includes(aspect.aspect);
    rules.push(item(`DG-W-APPLY-${name.toUpperCase()}`, hardApplying ? 'caution' : 'neutral', `Moon–${name} · applying-aspect rule`,
      aspect ? `${aspect.applying ? 'Applying' : 'Separating'} ${aspect.aspect.toLowerCase()}, ${aspect.orb.toFixed(3)}° from exact within a ${aspect.allowance.toFixed(2)}° allowance.${hardApplying ? ' The inherited Moon caution rule flags this applying hard aspect.' : ' This does not meet the selected applying-hard-aspect caution.'}` : 'No Ptolemaic aspect is within the selected planetary half-orb allowance; this rule stays neutral.',
      hardApplying ? 'Make a short list of two competing approaches to a creative problem before choosing one.' : 'Compare the angular distance with the stated orb allowance and record the result.',
      { planets: planetData(chart, ['Moon', name]), separationDegrees: separation(moon.lon, chart.planets[name].lon), aspect: aspect ? { ...aspect } : null },
      { moonFullOrbDegrees: ORBS.Moon, otherPlanetFullOrbDegrees: ORBS[name], allowanceDegrees: (ORBS.Moon + ORBS[name]) / 2, hardAspectAnglesDegrees: [0, 90, 180], applyingLookAheadDays: .05 }, ['DG-ASPECTS', 'DG-LILLY'],
      { algorithm: 'Reuse aspectBetween(); caution only if in-orb AND applying AND conjunction/square/opposition to Mars or Saturn', limitations: ['Applying uses a 0.05-day linear-motion comparison, not a numerical search for exact perfection. No precise future aspect time is supplied.'] }));
  }
  return rules;
}

function vedicRules(comparison, chart) {
  const screens = comparison.vedic.traditionalScreens, p = comparison.vedic.panchanga;
  const actions = {
    tithi: { favorable: 'Write a small intention associated with this class; keep your ordinary plans independent of the label.', caution: 'Use a five-minute journal entry to identify one thing you could simplify.', neutral: 'Describe what this tithi class means in the cited source.' },
    yoga: { caution: 'Compare the cited variant with its timing requirement before interpreting it.', neutral: 'Write one sentence distinguishing this yoga name from a personal prediction.', unavailable: 'Read the opening-portion rule and list the missing start/end times instead of inventing a safe interval.' },
    karana: { caution: 'Choose a harmless editing or organizing exercise and note why the source calls this class cautious.', neutral: 'Trace the six-degree half-tithi interval in a diagram.' },
    nakshatra: { favorable: 'Try a short art, reading, or learning exercise; compare its theme with the cited class.', caution: 'Explore the class through a drawing or journal note rather than reproducing harsh ritual uses.', neutral: 'Pick an ordinary low-stakes task and compare its description with the mixed class.' },
  };
  return Object.entries(screens.limbs).map(([key, screen]) => {
    const unresolved = screen.applicability === 'timing-unresolved';
    const classification = unresolved ? 'unavailable' : classificationOf(screen.ruleVerdict);
    const yogaRule = key === 'yoga' ? YOGA_SCREEN.avoid.find(rule => rule.num === p.yoga.num) : null;
    const number = key === 'tithi' ? p.tithi.num : key === 'yoga' ? p.yoga.num : key === 'karana' ? p.karana.num : p.nakshatra.num;
    const thresholds = key === 'tithi' ? { elongationIntervalDegrees: 12, tithiNumber: number, withinPaksha: ((number - 1) % 15) + 1, classIndex: (((number - 1) % 15) % 5), newMoonOverride: number === 30 }
      : key === 'yoga' ? { yogaNumber: number, siderealSunPlusMoonIntervalDegrees: 360 / 27, ruleScope: yogaRule?.scope || 'not-in-avoid-list', openingGhatis: yogaRule?.ghatis ?? null, minutesPerGhati: 24, openingTimingComputed: false }
        : key === 'karana' ? { halfTithiNumber: number, elongationIntervalDegrees: 6, selectedAvoidName: KARANA_SCREEN.avoid.name, avoidedSlots: [...KARANA_SCREEN.structure.vishtiSlots] }
          : { nakshatraNumber: number, siderealMoonIntervalDegrees: 360 / 27, selectedClassKey: NAKSHATRA_CLASSES.find(c => c.members.some(m => m.num === number))?.key || null };
    return item(`DG-J-${key.toUpperCase()}`, classification, `${screen.limb} · ${screen.class}`,
      unresolved ? 'The source’s opening-portion rule cannot be classified at this instant because limb start/end times have not been computed.' : `${screen.value}. The inherited table describes this as “${screen.ruleVerdict}”: ${screen.detail}`,
      actions[key][classification] || actions[key].neutral || 'Write a source-linked note about this classification.',
      { planets: planetData(chart, ['Sun', 'Moon']), siderealSunLongitudeDegrees: comparison.vedic.sun.longitude, siderealMoonLongitudeDegrees: comparison.vedic.moon.longitude, linearLahiriAyanamshaDegrees: comparison.vedic.ayanamsha.degrees, limbNumber: number, limbValue: screen.value, historicalRuleVerdict: screen.ruleVerdict, applicability: screen.applicability, applicableAtInstant: null }, thresholds,
      ['DG-MUHURTA'], { algorithm: key === 'tithi' ? 'Reuse inherited Pañcāṅga screen: fivefold class within each paksha, with tithi-30 override' : `Reuse inherited ${screen.limb} classification; preserve source variants and unresolved timing`,
        sourceStatus: screen.sourceStatus, sourceCitation: screen.cite, historicalRuleVerdict: screen.ruleVerdict,
        applicability: unresolved ? 'timing-unresolved' : 'symbolic-classification-only',
        limitations: [screen.applicabilityReason, 'Primary-passage verification is pending; the label is an inherited modern secondary-source classification.', ...(unresolved ? ['No active avoidance rule or safe interval is inferred from the untimed opening portion.'] : [])] });
  });
}

/** A compact, explainable symbolic guide for one selected sample, not all day. */
export function buildDayGuidance(inputOrComparison) {
  const input = inputOrComparison?.context || inputOrComparison;
  const comparison = compareMoment(input);
  const c = comparison.context, date = new Date(c.dateISO);
  const chart = { ...castChart(date, c.lat, c.lon, c.system), timeZone: c.timeZone };
  const western = lunarRules(comparison, chart), vedic = vedicRules(comparison, chart);
  const h = comparison.planetaryHours;
  const theme = HOUR_THEMES[h.ruler];
  const hour = item('DG-H-TEMPORAL', h.status === 'available' ? 'neutral' : 'unavailable', 'Planetary hour · a theme, not a good/bad ranking',
    h.status === 'available' ? `The current temporal hour belongs to ${h.ruler}; the sunrise day belongs to ${h.dayRuler}. The editorial reflection theme is ${theme?.[0] || 'source study'}.` : h.reason,
    theme?.[1] || 'Inspect the missing sunrise/sunset boundary rather than substituting another place or an invented ruler.',
    h.status === 'available' ? { ruler: h.ruler, dayRuler: h.dayRuler, temporalHourNumber: h.hourNumber, startISO: h.currentStartISO, endISO: h.currentEndISO, sunriseISO: h.sunrise, sunsetISO: h.sunset, nextSunriseISO: h.nextSunrise } : { available: false },
    { daylightDivisions: 12, nightDivisions: 12, sequence: ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'] }, ['DG-HOURS'],
    { algorithm: 'Reuse sunrise-bounded planetaryHour through compareMoment; no planet is assigned a universal favorable-hour rank', limitations: ['The action theme is a modern editorial association. No ritual efficacy, personal success, or whole-day quality is inferred.'] });
  const traditions = [
    { id: 'western-lilly', label: 'Western · Lilly study conventions', items: western },
    { id: 'jyotisha-muhurta', label: 'Jyotiṣa · inherited Muhūrta classifications', items: vedic },
    { id: 'temporal-hours', label: 'Planetary hours · temporal-hour convention', items: [hour] },
  ];
  const tensions = traditions.flatMap(tradition => {
    const favorable = tradition.items.filter(r => r.classification === 'favorable'), caution = tradition.items.filter(r => r.classification === 'caution');
    return favorable.length && caution.length ? [{ id: `DG-TENSION-${tradition.id}`, traditionId: tradition.id, kind: 'coexisting-testimonies', itemIds: [...favorable, ...caution].map(r => r.id), text: `Favorable and caution classes coexist within ${tradition.label}. They concern different rules and purposes; they are shown together without a net score or an outcome prediction.` }] : [];
  });
  if (western.find(rule => rule.id === 'DG-W-SOLAR')?.computed.selectedCategory === 'cazimi') tensions.push({ id: 'DG-TENSION-CAZIMI-SOURCES', traditionId: 'western-lilly', kind: 'source-convention-difference', itemIds: ['DG-W-SOLAR'], sourceIds: ['DG-LILLY', 'DG-AGRIPPA-29'], text: 'This sample meets the inherited Lilly cazimi exception, a favorable dignity class. Agrippa II.29 gives a broad warning about conjunction with the Sun without stating that numerical exception. The two source statements remain distinct; one is not silently substituted for the other.' });
  return { schemaVersion: DAY_GUIDANCE_SCHEMA_VERSION, context: { ...c },
    sampleScope: { instantISO: c.dateISO, localDate: c.localDate, localTime: c.localTime, wholeDayValidity: false, label: `Selected sample: ${c.localDate} ${c.localTime} (${c.timeZone})` },
    traditions, tensions, sharedMeasurements: { planets: planetData(chart, ['Sun', 'Moon', 'Mars', 'Saturn']), moonSunElongationDegrees: comparison.astronomy.moonSunElongation, fixedStarsUsed: [], housesUsed: false },
    civilCalendarPolicy: 'Civil-calendar labels are informational and supply no auspiciousness, recommendation, or quality classification.',
    sources: sourceCopy(), limitations: [...LIMITS] };
}

function clockParts(instant, zone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(instant).map(p => [p.type, p.value]));
  const nominal = new Date(0); nominal.setUTCFullYear(+p.year, +p.month - 1, +p.day); nominal.setUTCHours(+p.hour, +p.minute, +p.second, 0);
  const offsetSeconds = (nominal.getTime() - Math.floor(instant.getTime() / 1000) * 1000) / 1000;
  const sign = offsetSeconds < 0 ? '−' : '+', abs = Math.abs(offsetSeconds), hh = String(Math.floor(abs / 3600)).padStart(2, '0'), mm = String(Math.floor(abs / 60) % 60).padStart(2, '0');
  return { date: `${p.year}-${p.month}-${p.day}`, clock: `${p.hour}:${p.minute}:${p.second}`, offsetSeconds, offsetLabel: `UTC${sign}${hh}:${mm}${abs % 60 ? ':' + String(abs % 60).padStart(2, '0') : ''}` };
}

/** Real local-day segments. Clock-hour candidates plus actual offset changes
 * partition the UTC interval, retaining folds, gaps, and partial-hour shifts.
 * Each segment is classified at its START only; no event persistence is assumed.
 */
export function buildHourlyGuidance(input) {
  const comparison = compareMoment(input?.context || input), c = comparison.context;
  const date = input.date ?? c.localDate; civilFields(date, '00:00');
  if (+date.slice(0, 4) < 1900 || +date.slice(0, 4) > 2100) throw new RangeError('Hourly guidance supports local civil years 1900–2100.');
  const day = zonedCivilDay(date, c.timeZone), begin = day.start.getTime(), end = day.end.getTime();
  if (end - begin > 48 * 3600000) throw new RangeError('This civil-day interval is outside the bounded hourly guide.');
  const boundaries = new Set([begin, end]), clockSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    const clock = `${String(hour).padStart(2, '0')}:00`, candidates = zonedTimeCandidates(date, clock, c.timeZone);
    const values = candidates.filter(at => at.getTime() >= begin && at.getTime() < end);
    clockSlots.push({ localClock: clock, status: values.length ? 'available' : 'unavailable', occurrences: values.map((at, index) => ({ dateISO: at.toISOString(), occurrence: values.length > 1 ? index + 1 : null, ...clockParts(at, c.timeZone) })) });
    values.forEach(at => boundaries.add(at.getTime()));
  }
  // Include half-hour/political transition instants, not just full clock hours.
  // Search at 30-minute probes then bisect an offset change to one second.
  let probe = begin, offset = clockParts(new Date(begin), c.timeZone).offsetSeconds;
  while (probe < end - 1000) {
    const next = Math.min(probe + 30 * 60000, end - 1000), nextOffset = clockParts(new Date(next), c.timeZone).offsetSeconds;
    if (nextOffset !== offset) {
      let lo = Math.floor(probe / 1000), hi = Math.ceil(next / 1000);
      while (hi - lo > 1) { const mid = Math.floor((lo + hi) / 2); if (clockParts(new Date(mid * 1000), c.timeZone).offsetSeconds === offset) lo = mid; else hi = mid; }
      boundaries.add(hi * 1000);
    }
    if (next <= probe) break;
    probe = next; offset = nextOffset;
  }
  const sorted = [...boundaries].sort((a, b) => a - b);
  if (sorted.length > 53) throw new RangeError('This date exceeds the 52-segment hourly calculation bound.');
  const rows = [];
  for (let index = 0; index < sorted.length - 1; index++) {
    const startISO = new Date(sorted[index]).toISOString(), endISO = new Date(sorted[index + 1]).toISOString();
    const local = clockParts(new Date(startISO), c.timeZone), endLocal = clockParts(new Date(endISO), c.timeZone);
    const repeated = zonedTimeCandidates(local.date, local.clock, c.timeZone);
    const occurrence = repeated.length > 1 ? repeated.findIndex(at => at.toISOString() === startISO) + 1 : null;
    let guidance = null, status = 'available', reason = null;
    try { guidance = buildDayGuidance({ ...c, dateISO: startISO }); }
    catch (error) { status = 'unavailable'; reason = error.message; }
    rows.push({ index, startISO, endISO, durationMinutes: (sorted[index + 1] - sorted[index]) / 60000, localDate: local.date, localClock: local.clock, localEndDate: endLocal.date, localEndClock: endLocal.clock, endOffsetLabel: endLocal.offsetLabel, endOffsetSeconds: endLocal.offsetSeconds, offsetLabel: local.offsetLabel, offsetSeconds: local.offsetSeconds, occurrence, repeatedClock: repeated.length > 1, status, reason, guidance });
  }
  return { schemaVersion: DAY_GUIDANCE_SCHEMA_VERSION, date, timeZone: c.timeZone, startISO: day.start.toISOString(), endISO: day.end.toISOString(), actualDayHours: (end - begin) / 3600000, context: { ...c }, rows, clockSlots,
    sampleScope: 'Start-of-segment samples only. Intervals partition the real local civil day; traditional qualities may change inside a segment. No exact tithi, aspect, or ingress transitions are searched.',
    limitations: ['Repeated clock hours retain their UTC offsets and first/second occurrence. Missing clock hours remain explicitly unavailable in the clock-slot list.', 'Partial-hour offset transitions split segments. Runtime time-zone data and a 30-minute offset probe with one-second bisection determine boundaries.', ...LIMITS] };
}

/** Civil calendar drilldown metadata: explanations, never invented fortunes. */
export function explainCalendarChoice(id, inputOrComparison) {
  const comparison = compareMoment(inputOrComparison?.context || inputOrComparison), row = comparison.calendars.find(r => r.id === id);
  if (!row) throw new RangeError('Choose a calendar present in the comparison.');
  return { id: row.id, label: row.label, text: row.text, status: row.status, classification: 'unavailable',
    reason: 'This civil calendar labels the date. It does not supply an implemented favorable/caution reading or a complete community observance decision.',
    moment: comparison.context.dateISO, timeZone: comparison.context.timeZone, boundary: row.boundary, method: row.method, validation: row.validation, limitations: [...row.limitations], sourceIds: row.sourceIds,
    comparisonPrompts: ['Which epoch, solar/lunar rule, or era label produces this date?', 'Does the tradition use a different religious day boundary from the civil-midnight display?', 'Which named community authority or source would be needed before adding observances or interpretations?'] };
}
