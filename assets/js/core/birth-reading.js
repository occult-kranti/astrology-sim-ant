// A private, deterministic reading assembled from the Workbench's canonical
// calculators. No stored profiles, clocks, network calls, model calls or fate scores.
import { castChart, signOf, formatLon, norm360 } from './astro.js';
import { normalizeBirthContext, buildPersonalCalendar } from './personal-calendar.js';
import { resolveZonedTime } from './time.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { buildCalendarAtlas } from './calendar-atlas.js';
import { castVedic } from './vedic.js';
import { lahiriAyanamsa, VARGA_LIST, RASHIS } from './data/vedic-data.js';
import { DOMICILE } from './data/dignities-data.js';
import { essentialDignity, accidentalDignity } from './dignities.js';
import { allAspects } from './aspects.js';
import { annualProfection } from './profections.js';
import { currentTransits, transitTimeline } from './transits.js';
import { solarReturnInstant } from './solar-return.js';
import { BIRTH_READING_SOURCES, BIRTH_LIFE_DOMAINS, BIRTH_COMPARISON_PRINCIPLES, BIRTH_METHOD_COMPARISONS } from './data/birth-reading-sources.js';

const DAY = 86400000;
const SEVEN = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const THEMES = {
  Sun: 'direction, visibility and a sense of authorship', Moon: 'habits, responsiveness and belonging',
  Mercury: 'reasoning, language, learning and exchange', Venus: 'affection, aesthetic judgment and cooperation',
  Mars: 'initiative, boundaries, effort and conflict', Jupiter: 'meaning, mentorship and expansion',
  Saturn: 'responsibility, limits, endurance and structure', Rahu: 'appetite, novelty and unsettled attachments',
  Ketu: 'separation, simplification and detachment',
};
const plain = value => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const json = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const difference = (a, b) => norm360(a - b + 180) - 180;
const domain = n => BIRTH_LIFE_DOMAINS.find(d => d.house === n);
const point = lon => ({ longitudeDegrees: lon, sign: signOf(lon).name, degreeInSign: signOf(lon).degInSign, label: formatLon(lon, true) });
const phase = (start, end, at) => end <= at ? 'past' : start > at ? 'future' : 'current';
const condition = (chart, name) => ({ essential: essentialDignity(name, chart.planets[name].lon, chart.isDay), accidental: accidentalDignity(name, chart) });
function anniversary(birth, age) {
  const year = Number(birth.date.slice(0, 4)) + age;
  let monthDay = birth.date.slice(5);
  // Explicit civil-anniversary convention, not an astronomical return.
  if (monthDay === '02-29' && new Date(Date.UTC(year, 1, 29)).getUTCMonth() !== 1) monthDay = '02-28';
  return resolveZonedTime(`${year}-${monthDay}`, birth.time, birth.timeZone, { disambiguation: birth.disambiguation }).instant;
}
function chartFor(date, birth, system = 'regiomontanus') {
  return { ...castChart(date, birth.lat, birth.lon, system), timeZone: birth.timeZone };
}
function chartFrames(chart, whole, vedic) {
  const tropical = c => ({ ...c, planets: Object.fromEntries(Object.entries(c.planets).filter(([name]) => name !== 'Fortune')), frame: 'Apparent geocentric tropical ecliptic of date', lotScope: 'Fortune omitted: the inherited raw chart uses a non-sect-reversed formula.' });
  const ay = lahiriAyanamsa(chart.date), asc = vedic.lagna.lon, cuspStart = Math.floor(asc / 30) * 30;
  const sidereal = { ...tropical(chart), system: 'whole', requestedSystem: 'whole', houseWarning: null,
    asc, desc: norm360(asc + 180), mc: norm360(chart.mc - ay), ic: norm360(chart.mc + 180 - ay),
    cusps: [null, ...Array.from({ length: 12 }, (_, i) => norm360(cuspStart + i * 30))],
    frame: 'Linear-Lahiri sidereal ecliptic of date; whole-sign houses; mean nodes', ayanamshaDegrees: ay,
    planets: Object.fromEntries([...SEVEN, 'NorthNode', 'SouthNode'].map(name => {
      const g = vedic.grahas[name === 'NorthNode' ? 'Rahu' : name === 'SouthNode' ? 'Ketu' : name];
      return [name, { ...chart.planets[name], lon: g.lon, house: g.house }];
    })) };
  return { tropicalRegiomontanus: tropical(chart), tropicalWhole: tropical(whole), siderealWhole: sidereal };
}
function westernReading(chart, whole) {
  const planets = SEVEN.map(name => {
    const p = chart.planets[name], s = signOf(p.lon), ruler = DOMICILE[s.index], d = condition(chart, name);
    const house = domain(p.house), rulerHouse = domain(chart.planets[ruler].house);
    return { name, ...point(p.lon), house: p.house, wholeSignHouse: whole.planets[name].house,
      retrograde: p.retrograde, speedDegreesPerDay: p.speed, signRuler: ruler, dignity: d,
      observation: `${name} at ${formatLon(p.lon, true)}, Regiomontanus house ${p.house}; ${p.retrograde ? 'retrograde' : 'direct'}. Whole-sign house ${whole.planets[name].house}.`,
      rule: `The traditional domicile table gives ${s.name} to ${ruler}. Read the planet's symbolism, its house topic and its ruler together. Essential dignity uses sign/degree and ${chart.isDay ? 'day' : 'night'} sect; accidental dignity uses this house convention.`,
      interpretation: `Read symbolically, ${name} brings ${THEMES[name]} into ${house.title.toLowerCase()}. Its sign ruler ${ruler} occupies house ${chart.planets[ruler].house}, linking that inquiry to ${rulerHouse.title.toLowerCase()}. The dignity ledger (${d.essential.total} essential; ${d.accidental.total} accidental) describes this historical rule set's conditions, not your ability or a probability of success.`,
      prompt: house.prompt, sourceIds: ['BIRTH-LILLY'] };
  });
  const houses = Array.from({ length: 12 }, (_, i) => {
    const house = i + 1, d = domain(house), cusp = chart.cusps[house], sign = signOf(cusp), ruler = DOMICILE[sign.index], lord = chart.planets[ruler];
    const occupants = SEVEN.filter(n => chart.planets[n].house === house), wholeSignOccupants = SEVEN.filter(n => whole.planets[n].house === house);
    return { house, title: d.title, ...point(cusp), ruler, rulerHouse: lord.house, occupants, wholeSignOccupants,
      observation: `House ${house} begins at ${formatLon(cusp, true)}. Its ruler ${ruler} is at ${formatLon(lord.lon, true)} in house ${lord.house}. Classical occupants: ${occupants.join(', ') || 'none'}.`,
      rule: d.rule,
      interpretation: `The house-lord link connects ${d.title.toLowerCase()} with ${domain(lord.house).title.toLowerCase()} through ${ruler}'s symbolism of ${THEMES[ruler]}. ${occupants.length ? `${occupants.join(' and ')} add their own themes to this domain.` : 'An empty house is still read through its ruler; it does not mean the topic is absent from your life.'} ${occupants.join('|') !== wholeSignOccupants.join('|') ? `Whole-sign occupants are ${wholeSignOccupants.join(', ') || 'none'}; this change comes from house geometry, so conclusions that depend on occupancy are method-sensitive.` : 'The seven classical occupants agree in the two displayed house systems for this house; that is geometric agreement, not independent evidence of a life outcome.'}`,
      prompt: d.prompt, sourceIds: d.sourceIds };
  });
  const aspects = allAspects(Object.fromEntries(SEVEN.map(n => [n, chart.planets[n]]))).sort((a, b) => a.orb - b.orb).map(a => ({ ...a,
    observation: `${a.from} ${a.aspect.toLowerCase()} ${a.to}; ${a.orb.toFixed(3)}° from exact, ${a.applying ? 'applying' : 'separating'} under the local speed test.`,
    rule: `Exact angle ${a.angle}°; admitted by Lilly-style planetary moieties totalling ${a.allowance}°.`,
    interpretation: `${THEMES[a.from]} meet ${THEMES[a.to]}. ${['Square', 'Opposition'].includes(a.aspect) ? 'The tradition uses this configuration to explore tensions and competing needs; the constructive question is how to negotiate them.' : a.aspect === 'Conjunction' ? 'The tradition treats these themes as closely entangled; their expression depends on both planets and their rulers.' : 'The tradition uses this configuration to discuss cooperation and available channels of expression.'} The geometry cannot establish an event in your biography.`, sourceIds: ['BIRTH-LILLY'] }));
  return { frame: 'Apparent geocentric tropical ecliptic of date', requestedHouseSystem: 'regiomontanus', houseSystem: chart.system, houseWarning: chart.houseWarning,
    ascendant: point(chart.asc), midheaven: point(chart.mc), sect: chart.isDay ? 'day' : 'night', sunAltitudeDegrees: chart.sunAltitude, sectMethod: chart.sectMethod,
    wholeSignCusps: whole.cusps.slice(1).map(point), planets, houses, aspects,
    nodes: ['NorthNode', 'SouthNode'].map(name => ({ name, ...point(chart.planets[name].lon), house: chart.planets[name].house, method: 'Mean lunar node, not a physical planet' })) };
}
function sensitivity(instant, birth, chart) {
  return { method: 'Recalculate scenarios at −15, −5, 0, +5 and +15 recorded minutes. These are sensitivity scenarios, not an asserted uncertainty interval or rectified birth time.',
    sourceIds: ['BIRTH-ASTRONOMY', 'BIRTH-TIME'], rows: [-15, -5, 0, 5, 15].map(minutes => {
      const at = new Date(instant.getTime() + minutes * 60000), c = minutes === 0 ? chart : chartFor(at, birth), sidAsc = norm360(c.asc - lahiriAyanamsa(at));
      return { offsetMinutes: minutes, instantUTC: at.toISOString(), ascendant: point(c.asc), siderealAscendant: point(sidAsc),
        houses: Object.fromEntries(SEVEN.map(n => [n, c.planets[n].house])), sunSign: signOf(c.planets.Sun.lon).name, moonSign: signOf(c.planets.Moon.lon).name };
    }) };
}

export function buildBirthReading(input) {
  if (!plain(input) || Object.keys(input).some(k => !['birth', 'asOf', 'futureYears'].includes(k))) throw new TypeError('Use birth, asOf and futureYears only.');
  const birth = normalizeBirthContext(input.birth);
  if (!birth.timeKnown) throw new RangeError('This detailed chart requires a recorded birth time; use the Personal calendar interval tool for an unknown time.');
  const asOf = parseExplicitInstant(input.asOf), futureYears = input.futureYears ?? 3;
  if (!Number.isInteger(futureYears) || futureYears < 0 || futureYears > 5) throw new RangeError('Choose an integer future span from 0 through 5 years.');
  const resolved = resolveZonedTime(birth.date, birth.time, birth.timeZone, { disambiguation: birth.disambiguation }), instant = resolved.instant;
  const futureEnd = new Date(asOf); futureEnd.setUTCFullYear(futureEnd.getUTCFullYear() + futureYears);
  if (asOf < instant || asOf.getUTCFullYear() > 2100 || futureEnd.getUTCFullYear() > 2100) throw new RangeError('The reading date must follow birth and the entire study window must remain through 2100.');
  const chart = chartFor(instant, birth), whole = chartFor(instant, birth, 'whole'), western = westernReading(chart, whole), v = castVedic(chart, { currentDate: asOf });
  const atlas = buildCalendarAtlas({ dateISO: instant.toISOString(), lat: birth.lat, lon: birth.lon, timeZone: birth.timeZone, system: 'regiomontanus' });
  const personal = buildPersonalCalendar({ birth, selectedInstant: asOf.toISOString(), includeReturns: true });
  const annual = [];
  for (let age = 0; age <= futureEnd.getUTCFullYear() - Number(birth.date.slice(0, 4)); age++) {
    const start = anniversary(birth, age); if (start > futureEnd) break;
    const end = anniversary(birth, age + 1), p = annualProfection(chart, age), d = domain(p.activatedHouse);
    annual.push({ age, startUTC: start.toISOString(), endUTC: end.toISOString(), phase: phase(start, end, asOf), ...p,
      title: `${d.title} · ${p.lordOfYear} year`,
      interpretation: `At completed civil age ${age}, the annual profection advances ${age % 12} signs from the natal Ascendant and highlights house ${p.activatedHouse} (${d.title.toLowerCase()}). ${p.lordOfYear} is the sign's domicile ruler. Use this as a retrospective or planning prompt: ${d.prompt}`,
      sourceIds: ['BIRTH-PROFECTION'] });
  }
  const periods = v.vimshottari.maha.filter(p => p.start <= futureEnd).map(p => ({ lord: p.lord, startUTC: p.start.toISOString(), endUTC: p.end.toISOString(), phase: phase(p.start, p.end, asOf),
    interpretation: `The inherited Vimśottarī model assigns this span to ${p.lord}, whose symbolic topics include ${THEMES[p.lord]}. The dates result from the natal Moon's nakṣatra balance and a 365.2425-day model year. They do not establish what happened or will happen.`, sourceIds: ['BIRTH-VEDIC'] }));
  const antardashas = [];
  for (const maha of v.vimshottari.maha.filter(p => p.start <= futureEnd)) {
    const probe = new Date(Math.max(instant.getTime(), maha.start.getTime()) + 1), periodReading = castVedic(chart, { currentDate: probe });
    for (const a of periodReading.vimshottari.antardashas) {
      if (a.end <= instant || a.start > futureEnd) continue;
      const clipped = new Date(Math.max(instant.getTime(), a.start.getTime()));
      antardashas.push({ mahaLord: maha.lord, lord: a.lord, startUTC: clipped.toISOString(), theoreticalStartUTC: a.start.toISOString(), endUTC: a.end.toISOString(), clippedAtBirth: a.start < instant,
        phase: phase(clipped, a.end, asOf), interpretation: `${a.lord}'s themes (${THEMES[a.lord]}) are read within the ${maha.lord} period. This is a modelled symbolic period, not a verified personal event.`, sourceIds: ['BIRTH-VEDIC'] });
    }
  }
  const currentMaha = periods.find(p => p.phase === 'current') ?? null, currentAntar = antardashas.find(p => p.phase === 'current') ?? null;
  const returns = [];
  for (let year = asOf.getUTCFullYear(); year <= futureEnd.getUTCFullYear(); year++) {
    const at = solarReturnInstant(chart.planets.Sun.lon, year);
    if (at > asOf && at <= futureEnd) returns.push({ kind: 'solar-return', instantUTC: at.toISOString(), title: 'Tropical solar return', targetLongitudeDegrees: chart.planets.Sun.lon,
      interpretation: 'The Sun returns to its natal tropical longitude. A useful annual reflection marker; a full revolution judgment would also require its own chart and declared location.', sourceIds: ['BIRTH-ASTRONOMY', 'BIRTH-LILLY'] });
  }
  if (personal.returns.lunar.status === 'calculated' && new Date(personal.returns.lunar.instantUTC) <= futureEnd) returns.push({ ...personal.returns.lunar, kind: 'lunar-return', title: 'Next tropical lunar-longitude return', interpretation: 'The Moon returns to its natal tropical longitude; this is not the same as a repeat of the birth Moon phase.', sourceIds: ['BIRTH-ASTRONOMY'] });
  returns.sort((a, b) => a.instantUTC.localeCompare(b.instantUTC));
  const transits = [], transitWindows = [];
  // Keep the canonical solver's 731-day contract. Adjacent inclusive windows
  // are deduplicated by physical event identity; no invented ±orb hit times.
  for (let start = asOf.getTime(); start < futureEnd.getTime();) {
    const end = Math.min(start + 700 * DAY, futureEnd.getTime()), result = transitTimeline(chart, new Date(start), new Date(end), { bodies: ['Jupiter', 'Saturn'], natalPoints: ['Sun', 'Moon', 'Ascendant', 'Midheaven'], aspects: [0, 60, 90, 120, 180], profection: false });
    transitWindows.push(result.window);
    for (const e of result.events) if (!transits.some(a => a.exactISO === e.exactISO && a.transitingBody === e.transitingBody && a.natalPoint === e.natalPoint && a.angle === e.angle)) transits.push({ ...json(e),
      passNote: e.passCount === 1 ? `single pass (${e.motion})` : `pass ${e.passIndex} of ${e.passCount} (${e.motion})`,
      passScope: 'Pass numbering is local to the solver window; window boundaries can omit earlier or later crossings.',
      interpretation: `${e.transitingBody}'s symbolism of ${THEMES[e.transitingBody]} is compared with natal ${e.natalPoint}. ${['Square', 'Opposition'].includes(e.aspect) ? 'The traditional reading invites attention to competing commitments and how to adapt.' : 'The traditional reading invites reflection on how these themes might be expressed together.'} This is a calculated angular crossing, not a forecast of a specific event.`, sourceIds: ['BIRTH-TRANSITS', 'BIRTH-ASTRONOMY'] });
    start = end;
  }
  const nowTransits = currentTransits(chart, asOf, { profection: false });
  const currentYear = annual.find(a => a.phase === 'current');
  const grahas = Object.entries(v.grahas).map(([name, g]) => ({ name, ...json(g), longitudeDegrees: g.lon,
    dignity: { ...g.dignity, ...(['Rahu', 'Ketu'].includes(name) ? { qualification: 'Selected inherited node-dignity table; exaltation, debilitation and rulership for lunar nodes are disputed across Jyotiṣa schools.' } : {}) },
    observation: `${name}: ${g.label}, whole-sign house ${g.house}, ${g.nakshatra.name} pāda ${g.nakshatra.pada}; ${g.dignity.state.toLowerCase()}${['Rahu', 'Ketu'].includes(name) ? ' in the selected node-dignity variant (not a universal rule)' : ''}.`,
    rule: 'Subtract the full-precision linear Lahiri estimate once; apply the inherited rāśi, nakṣatra, dignity and whole-sign house tables.',
    interpretation: `The supported Jyotiṣa model relates ${THEMES[name]} to ${domain(g.house).title.toLowerCase()}. Its ${g.rashi} placement is described as ${g.dignity.state.toLowerCase()} by this dignity table.${['Rahu', 'Ketu'].includes(name) ? ' Lunar-node dignity and rulership are contested; this selected variant does not represent all schools.' : ''} This is a symbolic vocabulary and a convention-dependent calculation, not a fact about your character or future.`, sourceIds: ['BIRTH-VEDIC'] }));
  const timingScenarios = sensitivity(instant, birth, chart), risingSigns = [...new Set(timingScenarios.rows.map(r => r.siderealAscendant.sign))];
  const steps = [
    { title: '1 · Resolve the recorded clock', observation: `${birth.date} ${birth.time} in ${birth.timeZone} resolves to ${instant.toISOString()} (UTC offset ${resolved.offsetHours} hours).`, rule: 'Resolve the IANA civil clock before casting; reject nonexistent times and require a choice for repeated times.', interpretation: 'Every chart below is tied to this one instant and the supplied coordinates. The record itself has not been independently verified.', sourceIds: ['BIRTH-TIME'] },
    { title: '2 · Locate the sky and horizon', observation: `Ascendant ${western.ascendant.label}; Midheaven ${western.midheaven.label}; solar altitude ${chart.sunAltitude.toFixed(3)}°: ${western.sect} sect.`, rule: 'Angles use the observer and sidereal time; sect uses the geometric solar center above or below the horizon.', interpretation: 'Changing the birth clock primarily changes the horizon and houses. Check the timing scenarios before relying on a house-based interpretation.', sourceIds: ['BIRTH-ASTRONOMY', 'BIRTH-LILLY'] },
    { title: '3 · Read the tropical chart', observation: `Sun ${western.planets[0].label}; Moon ${western.planets[1].label}. ${western.aspects.length} classical aspect contacts pass the selected moiety rules.`, rule: 'Read planets, rulers, houses, sect, essential dignity and aspects together. A Sun sign alone is only one placement.', interpretation: 'The sections below provide the underlying testimonies and reflection prompts rather than merging them into a single destiny score.', sourceIds: ['BIRTH-LILLY', 'BIRTH-PTOLEMY'] },
    { title: '4 · Change the zodiac frame explicitly', observation: `Linear Lahiri estimate ${lahiriAyanamsa(instant).toFixed(6)}°; sidereal Lagna ${v.lagna.label}; Moon ${v.grahas.Moon.label}.`, rule: 'Sidereal longitude = tropical longitude − ayanāṁśa, reduced to 0–360°. Jyotiṣa here uses whole-sign houses and mean nodes.', interpretation: 'A different Sun or Moon sign is an expected change of reference frame. It is not an error or a second independent observation of the sky.', sourceIds: ['BIRTH-VEDIC', 'BIRTH-ASTRONOMY'] },
    { title: '5 · Compare date systems and boundaries', observation: `${atlas.rows.length} named calendar/variant rows; ${atlas.rows.filter(r => r.status === 'unavailable').length} explicitly unavailable.`, rule: 'Retain each calendar’s boundary and implementation status. Civil midnight, sunrise, sunset and observed-crescent conventions differ.', interpretation: 'A date conversion supplies a date label. It does not, by itself, supply a natal personality reading or religiously authorized recommendation.', sourceIds: ['ATLAS-METHODS', 'BIRTH-TIME'] },
    { title: '6 · Build a time study', observation: `${annual.length} civil-age profection spans, ${periods.length} major daśā spans, ${transits.length} Jupiter/Saturn exact contacts in the bounded future window.`, rule: 'Keep civil anniversaries, inherited symbolic periods and solved angular crossings separate.', interpretation: 'Past entries are prompts for comparison with your records, not claims about your biography. Future entries are study dates and themes, not event probabilities.', sourceIds: ['BIRTH-PROFECTION', 'BIRTH-VEDIC', 'BIRTH-TRANSITS'] },
  ];
  const summary = [
    { title: 'Tropical anchors', text: `${western.ascendant.sign} rising, ${western.planets[0].sign} Sun and ${western.planets[1].sign} Moon in a ${western.sect} chart. The Ascendant ruler ${DOMICILE[signOf(chart.asc).index]} occupies house ${chart.planets[DOMICILE[signOf(chart.asc).index]].house}; its condition provides a starting point for the traditional reading.`, sourceIds: ['BIRTH-LILLY'] },
    { title: 'Sidereal anchors', text: `${v.lagna.rashi} Lagna; ${v.grahas.Sun.rashi} Sun; ${v.grahas.Moon.rashi} Moon in ${v.grahas.Moon.nakshatra.name}, pāda ${v.grahas.Moon.nakshatra.pada}. These follow the documented linear Lahiri convention.`, sourceIds: ['BIRTH-VEDIC'] },
    { title: 'Current symbolic periods', text: `${currentYear ? `Completed civil age ${currentYear.age}: house ${currentYear.activatedHouse} profection, ${currentYear.lordOfYear} year. ` : ''}${currentMaha ? `Vimśottarī ${currentMaha.lord} major period${currentAntar ? ` / ${currentAntar.lord} subperiod` : ''}.` : 'The selected date lies outside the inherited Vimśottarī timeline.'} These are different traditional clocks; agreement between their labels would not prove a future outcome.`, sourceIds: ['BIRTH-PROFECTION', 'BIRTH-VEDIC'] },
    { title: 'Recorded-time sensitivity', text: risingSigns.length > 1 ? `The sidereal rising sign changes across the five timing scenarios (${risingSigns.join(' / ')}). ${timingScenarios.rows.map(r => `${r.offsetMinutes > 0 ? '+' : ''}${r.offsetMinutes} min: ${r.siderealAscendant.label}`).join('; ')}. A difference of a few recorded minutes can therefore change whole-sign houses and their interpretations. These are scenarios to inspect, not an asserted error in your record or a rectified birth time.` : `The sidereal rising sign remains ${risingSigns[0]} across the five −15 to +15 minute scenarios. Degrees and some house placements can still move; stability in these samples does not validate the recorded time.`, sourceIds: ['BIRTH-ASTRONOMY', 'BIRTH-TIME', 'BIRTH-VEDIC'] },
  ];
  const sources = [...new Map([...BIRTH_READING_SOURCES, ...atlas.sources].map(s => [s.id, s])).values()];
  return freeze(json({ schemaVersion: 1, kind: 'private-birth-reading', birth, context: { instantUTC: instant.toISOString(), timeZone: birth.timeZone, latitude: birth.lat, longitude: birth.lon, offsetHours: resolved.offsetHours, asOf: asOf.toISOString(), futureEnd: futureEnd.toISOString(), futureYears, timeCertainty: 'User-supplied recorded time; not rectified or independently verified' }, summary, steps, western, charts: chartFrames(chart, whole, v),
    vedic: { frame: 'Linear-Lahiri sidereal; whole-sign houses; mean nodes', ayanamshaDegrees: lahiriAyanamsa(instant), lagna: v.lagna, grahas, panchanga: v.panchanga,
      vargas: VARGA_LIST.map(m => ({ ...m, placements: Object.fromEntries(Object.entries(v.vargas[m.key]).map(([body, index]) => [body, { signIndex: index, sign: RASHIS[index].name }])) })),
      shadbala: v.shadbala, ashtakavarga: v.ashtakavarga, yogas: v.yogas.map(y => ({ name: y.name, present: y.present, rule: y.detail, claimType: 'Inherited traditional pattern, including unimplemented cancellation/qualification possibilities; no guaranteed result' })),
      dasha: { balanceYears: v.vimshottari.balanceYears, birthNakshatra: v.vimshottari.nakshatra, periods, current: currentMaha, currentAntar, antardashas, convention: 'Inherited Vimśottarī uses a 365.2425-day solar model year. Rao’s cited textbook §16.2 contrasts this with a 360-day sāvana year and prefers 360 days there; these dates therefore do not reproduce that book’s preferred year convention. Spans start at birth; a period may continue beyond the displayed horizon.' }, notes: v.notes + ' Lunar-node dignity is a selected contested table, not a universal Jyotiṣa rule.' },
    calendars: { rows: atlas.rows, families: atlas.families.map(({ rows, ...f }) => f), sources: atlas.sources, limitations: atlas.limitations },
    comparison: BIRTH_COMPARISON_PRINCIPLES, methodComparisons: BIRTH_METHOD_COMPARISONS, sensitivity: timingScenarios,
    timeline: { asOf: asOf.toISOString(), futureEnd: futureEnd.toISOString(), annual, returns, currentTransits: nowTransits.contacts, transits, transitWindows,
      methods: { annual: 'Civil birthday and recorded time in birth IANA zone; February 29 uses February 28 in non-leap years. This is not a solar-return boundary. Profection = completed civil age modulo 12.', transits: 'Canonical geocentric tropical solver; Jupiter/Saturn to natal Sun, Moon, Ascendant and Midheaven, aspects 0/60/90/120/180°. Inclusive adjacent windows ≤700 days; duplicate exact identities removed. This is a selected catalogue, not all transits. No approximate-year profection overlay is attached.', returns: 'Solar returns strictly after the reading instant through the future horizon; one next lunar-longitude return if it falls inside the same range. Solver digits do not imply equivalent physical accuracy.' } }, sources,
    limitations: ['Astronomy and calendar arithmetic can be calculated; astrology has no demonstrated predictive validity. This report cannot establish your past events or predict everything about your future.', 'No verified biographical events were supplied. Retrospective themes must be checked against independently dated records, including counterexamples.', 'A calendar is not automatically a natal divination system. Unavailable schools remain unavailable; no BaZi, Kabbalistic destiny, ancient Egyptian natal or Mayan conversion is invented.', 'These readings cover the seven classical planets, mean nodes, selected Vedic methods and the named Atlas catalogue; they are not every possible chart or book.', 'Vargas and house interpretations can be sensitive to minutes of birth time. The supplied precision is not an accuracy certificate.', v.notes, v.shadbala.note, 'Dignity, yoga and strength scores describe inherited rules; they are not probabilities or measures of personal worth. No medical diagnosis, lifespan, fertility, violence or financial outcome is inferred.', 'Sources retain their actual reading depth and edition caveats. A source list does not mean every book was read in full.'] }));
}
