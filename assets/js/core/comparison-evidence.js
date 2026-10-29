// Explain dependencies between existing calculations. No new ephemeris,
// correlation coefficient, outcome score, source transmission or observance rule.
import { compareMoment } from './calendar-observatory.js';
import { lahiriAyanamsa, NAKSHATRA_ARC } from './data/vedic-data.js';

export const COMPARISON_EVIDENCE_VERSION = 1;
const norm = value => ((value % 360) + 360) % 360;
const circularResidual = (actual, expected) => ((actual - expected + 540) % 360) - 180;
const copy = value => JSON.parse(JSON.stringify(value));
export const COMPARISON_EVIDENCE_SOURCES = [
  { id:'CE-ASTRONOMY', title:'Astronomy Engine and the existing geocentric chart implementation', url:'assets/js/core/astro.js', section:'castChart(): Sun/Moon apparent tropical ecliptic longitudes', edition:'Vendored Astronomy Engine; project source implementation', readingStatus:'Canonical implementation inspected; an algebraic match is not an independent ephemeris validation.' },
  { id:'CE-VEDIC', title:'Existing sidereal frame and Pañcāṅga implementation', url:'assets/js/core/vedic.js', section:'panchanga() and castVedic()', edition:'Current project study implementation', readingStatus:'Canonical formulas inspected; this is implementation evidence, not a newly verified Sanskrit passage.' },
  { id:'CE-AYANAMSHA', title:'Linear Lahiri estimate and its limitations', url:'assets/js/core/data/vedic-data.js', section:'lahiriAyanamsa(), toSidereal(), PANCHANGA_SOURCE', edition:'J2000-anchored linear project model', readingStatus:'Full numeric helper inspected. Not exact JHora/Swiss Ephemeris equivalence or a new broad-range accuracy guarantee.' },
  { id:'CE-AGRIPPA', title:'Agrippa, Three Books of Occult Philosophy', url:'https://esotericarchives.com/agrippa/agripp2c.htm#chap34', section:'Book II, chapter 34: temporal and ascensional hour conventions', edition:'1651 English “J.F.” translation; Joseph H. Peterson digital edition', readingStatus:'Chapter 34 read for the two reported conventions; temporal division is implemented, ascensional alternative is not. Translator identity remains disputed; no full-book reading claimed.' },
  { id:'CE-LILLY', title:'Lilly, Christian Astrology', url:'https://en.wikisource.org/wiki/Christian_Astrology', section:'Title page; To the Reader; Book I, erecting a figure, pp. 32–33', edition:'1659 second edition, John Macock; Wikisource OCR transcription', readingStatus:'Selected passages read in this round. The page flags unproofread OCR; its title says second edition despite a misleading “First published” metadata line. No scan collation or fresh numerical-threshold verification claimed.' },
  { id:'CE-CIVIL', title:'Named civil calendars and boundaries', url:'docs/2026-10-calendar-methods.md', section:'Explicit instant/zone, Intl calendars, religious-day limitations', edition:'Project method and validation ledger', readingStatus:'Method documentation and canonical implementation inspected; calendar-family fixture status stays on each date row.' },
  { id:'CE-ICU', title:'ICU calendar services', url:'https://unicode-org.github.io/icu/userguide/datetime/calendar/', section:'Calendar concepts and calendar/time-zone services', edition:'Unicode ICU online user guide', readingStatus:'Selected calendar-service documentation inspected; runtime support is distinct from religious or cultural authority.' },
  { id:'CE-MUHURTA', title:'Inherited Muhūrta quality classifications', url:'assets/js/core/data/muhurta-data.js', section:'TITHI_SCREEN, YOGA_SCREEN, KARANA_SCREEN, NAKSHATRA_CLASSES', edition:'Existing modern secondary-source summaries', readingStatus:'Rule data and citation flags inspected; primary-passage collation remains pending. Opening-portion rules remain unresolved.' },
  { id:'CE-PRAYER', title:'Named prayer calculation parameters', url:'assets/vendor/adhan/PROVENANCE.md', section:'Vendored Adhan snapshot and adaptation provenance', edition:'Adhan 4.4.6 snapshot with retained license', readingStatus:'Implementation/provenance evidence; no community timetable or religious ruling is inferred.' },
];

/** Pure geometry of the existing lunar partitions; divisions use ordinary
 * JavaScript floating-point arithmetic, with no boundary tolerance snapping.
 * Exposed for regression checks at wraps, not as a replacement ephemeris.
 */
export function explainLunarPartitions(sunLongitude, moonLongitude, ayanamshaDegrees) {
  if (![sunLongitude, moonLongitude, ayanamshaDegrees].every(Number.isFinite)) throw new TypeError('Supply three finite angular quantities.');
  const sun = norm(sunLongitude), moon = norm(moonLongitude), elongation = norm(moon - sun);
  const siderealSun = norm(sun - ayanamshaDegrees), siderealMoon = norm(moon - ayanamshaDegrees);
  const siderealElongation = norm(siderealMoon - siderealSun), phaseIndex = Math.floor((elongation + 22.5) / 45) % 8;
  const tithi = Math.floor(elongation / 12) + 1, halfTithi = Math.floor(elongation / 6) + 1;
  const nakshatra = Math.floor(siderealMoon / NAKSHATRA_ARC) + 1;
  const yogaAngle = norm(siderealMoon + siderealSun), yoga = Math.floor(yogaAngle / NAKSHATRA_ARC) + 1;
  return { sunLongitude:sun, moonLongitude:moon, elongationDegrees:elongation, siderealSunLongitude:siderealSun, siderealMoonLongitude:siderealMoon,
    siderealElongationDegrees:siderealElongation, frameCancellationResidualDegrees:circularResidual(siderealElongation, elongation),
    phase:{ index:phaseIndex, widthDegrees:45, centerDegrees:phaseIndex * 45, lowerDegrees:norm(phaseIndex * 45 - 22.5), upperDegrees:norm(phaseIndex * 45 + 22.5) },
    tithi:{ number:tithi, widthDegrees:12, lowerDegrees:(tithi - 1) * 12, upperDegrees:tithi * 12 },
    karana:{ halfTithiNumber:halfTithi, widthDegrees:6, lowerDegrees:(halfTithi - 1) * 6, upperDegrees:halfTithi * 6 },
    nakshatra:{ number:nakshatra, widthDegrees:NAKSHATRA_ARC, lowerDegrees:(nakshatra - 1) * NAKSHATRA_ARC, upperDegrees:nakshatra * NAKSHATRA_ARC },
    yoga:{ number:yoga, angleDegrees:yogaAngle, widthDegrees:NAKSHATRA_ARC },
  };
}

/** Rebuild from the exact input contract, never trust a caller's edited output
 * labels/positions. It is an internal-consistency explanation, not independent
 * source agreement, an empirical correlation, or validation of interpretation.
 */
export function buildComparisonEvidence(inputOrComparison) {
  const comparison = compareMoment(inputOrComparison?.context || inputOrComparison), c = comparison.context;
  const aya = lahiriAyanamsa(new Date(c.dateISO)), a = comparison.astronomy, p = comparison.vedic.panchanga;
  const lunar = explainLunarPartitions(a.sunLongitude, a.moonLongitude, aya);
  const frames = ['sun', 'moon'].map(id => {
    const tropical = comparison.western[id], sidereal = comparison.vedic[id], expected = norm(tropical.longitude - aya);
    return { id, body:id === 'sun' ? 'Sun' : 'Moon', tropicalLongitudeDegrees:tropical.longitude, tropicalSign:tropical.sign,
      siderealLongitudeDegrees:sidereal.longitude, siderealSign:sidereal.sign, ayanamshaDegrees:aya,
      expectedSiderealLongitudeDegrees:expected, circularResidualDegrees:circularResidual(sidereal.longitude, expected),
      sourceIds:['CE-ASTRONOMY','CE-AYANAMSHA'], scope:'Internal frame-transform consistency; no independent ephemeris or predictive validation.' };
  });
  const quantities = [
    { id:'phase', label:'Broad lunar phase', value:a.phaseLabel, input:'Moon minus Sun longitude', inputs:['sun','moon'], formula:'floor((Δ + 22.5°) / 45°) mod 8', angleDegrees:lunar.elongationDegrees,
      band:lunar.phase, sourceIds:['CE-ASTRONOMY','CE-VEDIC'], distinction:'Eight centered 45° sectors. This is not an exact new/full/quarter phase-event search or the physical illumination fraction.' },
    { id:'tithi', label:'Tithi', value:`${p.tithi.num} · ${p.tithi.name}`, input:'The same Moon minus Sun longitude', inputs:['sun','moon'], formula:'floor(Δ / 12°) + 1', angleDegrees:lunar.elongationDegrees,
      band:lunar.tithi, matchesCanonical:lunar.tithi.number === p.tithi.num, sourceIds:['CE-VEDIC','CE-AYANAMSHA'], distinction:'Thirty 12° intervals. Subtracting the same ayanāṁśa from both bodies cancels in their difference; no independent confirmation is added.' },
    { id:'karana', label:'Karaṇa half-tithi', value:`${p.karana.num} · ${p.karana.name}`, input:'The same Moon minus Sun longitude', inputs:['sun','moon'], formula:'floor(Δ / 6°) + 1, then the named inherited sequence', angleDegrees:lunar.elongationDegrees,
      band:lunar.karana, matchesCanonical:lunar.karana.halfTithiNumber === p.karana.num, sourceIds:['CE-VEDIC'], distinction:'Sixty 6° half-tithi slots. The sequence contains recurring names, so the displayed slot is not a count of sixty unique karaṇa names.' },
    { id:'nakshatra', label:'Nakṣatra', value:`${p.nakshatra.num} · ${p.nakshatra.name}`, input:'Sidereal Moon longitude alone', inputs:['moon','ayanamsha'], formula:'floor(sidereal Moon / (360° / 27)) + 1', angleDegrees:lunar.siderealMoonLongitude,
      band:lunar.nakshatra, matchesCanonical:lunar.nakshatra.number === p.nakshatra.num, sourceIds:['CE-VEDIC','CE-AYANAMSHA'], distinction:'Unlike tithi, this uses a reference-frame origin. A changed ayanāṁśa can change the mansion near a boundary; no individual fixed star is measured by this equal-arc partition.' },
    { id:'yoga', label:'Nitya yoga', value:`${p.yoga.num} · ${p.yoga.name}`, input:'Sidereal Moon plus sidereal Sun longitude', inputs:['sun','moon','ayanamsha'], formula:'floor(norm(sidereal Moon + sidereal Sun) / (360° / 27)) + 1', angleDegrees:lunar.yoga.angleDegrees,
      band:lunar.yoga, matchesCanonical:lunar.yoga.number === p.yoga.num, sourceIds:['CE-VEDIC','CE-AYANAMSHA','CE-MUHURTA'], distinction:'This is an angular sum, not elongation. Its ayanāṁśa contribution is doubled; sharing Sun/Moon inputs does not make its meaning or boundaries identical to tithi.' },
  ];
  const nodes = [
    {id:'sun',label:'Tropical Sun',value:a.sunLongitude,unit:'degrees'}, {id:'moon',label:'Tropical Moon',value:a.moonLongitude,unit:'degrees'},
    {id:'ayanamsha',label:'Linear Lahiri estimate',value:aya,unit:'degrees'}, {id:'elongation',label:'Moon − Sun',value:lunar.elongationDegrees,unit:'degrees'},
    ...quantities.map(q=>({id:q.id,label:q.label,value:q.value})),
    {id:'instant-zone',label:'UTC instant + IANA zone',value:`${c.dateISO} · ${c.timeZone}`},
    {id:'civil',label:'Civil calendar displays',value:comparison.calendars.filter(row=>row.status==='available').length,unit:'available named rows'},
    {id:'horizon',label:'Observer + solar horizon',value:`${c.lat}°, ${c.lon}°`},
    {id:'hours',label:'Temporal planetary hour',value:comparison.planetaryHours.ruler || 'Unavailable'},
    {id:'vara',label:'Sunrise-bounded vāra',value:p.vara.lord || 'Unavailable'},
    {id:'prayer-method',label:'Selected prayer method',value:c.prayerMethod},
    {id:'prayer',label:'Prayer timetable',value:comparison.prayer.status},
  ];
  const edges = [
    ...['sun','moon'].map(from=>({from,to:'elongation',kind:'calculated-input'})),
    ...['phase','tithi','karana'].map(to=>({from:'elongation',to,kind:'shared-derivation'})),
    ...['moon','ayanamsha'].map(from=>({from,to:'nakshatra',kind:'calculated-input'})),
    ...['sun','moon','ayanamsha'].map(from=>({from,to:'yoga',kind:'calculated-input'})),
    {from:'instant-zone',to:'civil',kind:'civil-convention'},
    ...['hours','vara'].flatMap(to=>[{from:'horizon',to,kind:'local-boundary'},{from:'instant-zone',to,kind:'weekday-convention'}]),
    ...['horizon','instant-zone','prayer-method'].map(from=>({from,to:'prayer',kind:'method-dependent-schedule'})),
  ];
  return { schemaVersion:COMPARISON_EVIDENCE_VERSION, kind:'calculation-dependency-explanation', context:copy(c), frames,
    linearAyanamshaDegrees:aya, displayedAyanamshaDegrees:comparison.vedic.ayanamsha.degrees,
    displayPrecisionNote:'The comparison rounds its displayed ayanāṁśa to four decimals. Residuals here use the canonical full-precision linear helper, not that rounded display.',
    sharedLunarGeometry:lunar,
    lunarBoundaryPrecisionNote:'Printed angles and interval endpoints are rounded. The canonical JavaScript divisions use unrounded floating-point values; at machine-precision boundaries their index can differ from an ideal exact-angle calculation. Rounded equality does not establish an exact limb transition or its time.',
    quantities, graph:{nodes,edges},
    boundaries:[
      {id:'civil',label:'Civil date labels',uses:'Instant + IANA zone + named calendar/runtime rules',doesNotUse:'No observer latitude/longitude or auspiciousness rule',boundary:'Civil midnight in the selected zone',value:c.localDate,sourceIds:['CE-CIVIL','CE-ICU'],status:'available'},
      {id:'hours',label:'Planetary day and hour',uses:'Instant + observer latitude/longitude + sunrise-day convention in the selected zone',doesNotUse:'No fixed 60-minute planetary hour or ascensional-hour calculation',boundary:'Twelve daylight and twelve night divisions',value:comparison.planetaryHours.ruler || comparison.planetaryHours.reason,status:comparison.planetaryHours.status,sourceIds:['CE-AGRIPPA','CE-ASTRONOMY']},
      {id:'vara',label:'Pañcāṅga vāra',uses:'Sunrise-bounded day in the supplied civil zone',doesNotUse:'Not automatically the civil weekday before sunrise',boundary:'Sunrise; unavailable if the required day cannot be established',value:p.vara.name,status:p.vara.lord ? 'available' : 'unavailable',sourceIds:['CE-VEDIC','CE-CIVIL']},
      {id:'prayer',label:'Prayer timetable',uses:'Civil date + observer + named method, Asr and high-latitude conventions',doesNotUse:'Not a lunar-sighting calendar or an auspiciousness score',boundary:'Method-dependent solar event/twilight schedules',value:`${comparison.prayer.method} · ${comparison.prayer.status}`,status:comparison.prayer.status,sourceIds:['CE-PRAYER','CE-CIVIL']},
    ],
    sourceDifferences:[
      {id:'agrippa-hours',title:'One author can report competing timing methods',text:'Agrippa II.34 describes ordinary twelvefold day/night divisions and also reports an ascensional alternative. This site calculates the temporal division only; a common planetary label does not establish that both methods were run.',sourceIds:['CE-AGRIPPA']},
      {id:'book-purpose',title:'The books ask different questions of a calculated sky',text:'Lilly’s title and opening instructions distinguish learning to erect a figure, judging questions and judging nativities. Agrippa II.34 discusses celestial opportunity and planetary-hour conventions. Reusing a position does not supply Lilly’s missing question or birth inputs, or authenticate an Agrippan operation. This is a comparison of stated purposes, not a claim of historical transmission.',sourceIds:['CE-LILLY','CE-AGRIPPA']},
      {id:'quantity-vs-interpretation',title:'A shared quantity does not transfer a meaning',text:'Phase, tithi and karaṇa share elongation, while their labels and inherited quality rules serve different conventions. Muhūrta primary-passage verification remains pending; an unresolved opening-portion yoga rule stays unresolved.',sourceIds:['CE-VEDIC','CE-MUHURTA']},
    ], sources:copy(COMPARISON_EVIDENCE_SOURCES),
    limitations:[
      'These are dependencies and internal consistency checks, not an empirical correlation study, independent cross-source confirmation, or evidence of predictive efficacy.',
      'No consensus, probability, reliability or good/bad score combines unlike calendar, planetary-hour, prayer or symbolic quantities.',
      'Matching names or shared inputs do not establish historical transmission, equivalent cultural meaning or a new reading of an unexamined primary book.',
      'Geocentric quantities are observer-independent here. Houses, topocentric observations and fixed-star alignments are outside this component.',
      'Religious sunset/sunrise dates, observed crescents, regional festivals and exact limb end-times are not inferred from civil displays or sampled quantities.',
    ] };
}
