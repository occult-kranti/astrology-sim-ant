// ============================================================================
//  cycles-data.js — cited reference data for the "Cycles of History" tool:
//  Jupiter–Saturn GREAT CONJUNCTIONS (astronomy + the Abū Maʿshar doctrine)
//  and the honest ECLIPSE layer (NASA/Espenak ecliptic limits + test vectors
//  + the Babylonian divinatory context).
//
//  PURE DATA — no DOM, no network, no engine imports. Per project discipline:
//   • every record carries a `.cite`;
//   • contested or discrepant values are FLAGGED IN-RECORD, never silently
//     resolved (see ECLIPSE_LIMITS.classicalSolarDiscrepancy, BETHLEHEM
//     .spreadFlag, DOCTRINE.flags, the 1940-10-20 and 1961 vector notes);
//   • historical beliefs are recorded as beliefs (status fields) — described,
//     never endorsed. Astrology has no demonstrated predictive validity.
//
//  Reference frames (load-bearing): all conjunction longitudes here are
//  GEOCENTRIC, TROPICAL OF-DATE (true equinox of date — what the repo engine
//  computes). Wikipedia's Great-conjunction table is FIXED-EPOCH (J2000);
//  the two differ by accumulated precession ≈1.396°/century, and Wikipedia's
//  rows are MINIMUM-SEPARATION dates, which can differ by 1–2 days from the
//  longitude-crossing dates used here. All 13 GOLDEN_CONJUNCTIONS below were
//  verified with the repo's own engine to the arcminute during research.
// ============================================================================

// --- shared citation strings -------------------------------------------------

const YB_CITE =
  'Abū Maʿshar, On Historical Astrology: The Book of Religions and Dynasties (On the Great Conjunctions), '
  + 'ed./trans. K. Yamamoto & C. Burnett, 2 vols (Leiden; Boston: Brill, 2000)';

const NOLLE_CITE =
  'R. Nolle, astropro.com 3000-year geocentric Jupiter–Saturn conjunction table (tropical of-date), '
  + 'engine-verified to the arcminute; cross-checked vs Wikipedia "Great conjunction" fixed-epoch table '
  + '(the two differ by accumulated precession ≈1.396°/century; Wikipedia rows are minimum-separation '
  + 'dates, not longitude-crossing dates, and its 21-Oct-1940 longitude cell is erroneous).';

// ---------------------------------------------------------------------------
//  CYCLE_CONSTANTS — the numbers of the Jupiter–Saturn cycle, frame-tagged.
// ---------------------------------------------------------------------------
export const CYCLE_CONSTANTS = {
  // Mean synodic period of Jupiter–Saturn conjunctions.
  synodicJulianYears: 19.859,               // = 7253.45 days
  // Mean advance per conjunction — FRAME-TAGGED (do not mix the two):
  meanAdvance: {
    tropicalDeg: 242.98,                    // per conjunction, tropical frame (+2.98° past two exact trines)
    siderealDeg: 242.70,                    // same drift measured against the stars (+2.70°)
    frameNote: 'Wikipedia phrases the drift sidereally (~8° per ~60-yr return relative to the stars); '
      + 'the tropical figure 242.98° is what a tropical-zodiac timeline needs. Both are arithmetic '
      + 'consequences of the planets’ periods, checked independently during research.',
  },
  // How long the series stays in one triplicity (trigon).
  perTrigon: {
    astronomicalConjunctions: '10–12',
    astronomicalYears: 220,
    doctrinalYears: 240,                    // 12 × 20 in the mean scheme
    note: 'Astronomically ~10–12 successive conjunctions (~220 yr) per triplicity, with one-off '
      + 'reversions — e.g. the 1980–81 Libra triple inside the 1842–2000 earth run, and the 1821 '
      + 'Aries reversion after the first earth entry of 1802. Doctrinally the figure is 240 yr (12 × 20).',
  },
  // Full return of the cycle to the starting trigon.
  fullReturn: {
    medievalYears: 960,                     // 4 × 240, the medieval convention
    keplerYears: 794,
    keplerConjunctions: 40,                 // Kepler: "794 years (40 conjunctions)"
    note: 'Full return: 960 yr by medieval convention; Kepler computed 794 years (40 conjunctions). '
      + '40 × 19.859 = 794.4.',
  },
  // Triple conjunctions — a purely GEOCENTRIC phenomenon.
  triples: {
    mechanism: 'apparent retrogradation near opposition makes Jupiter pass Saturn three times '
      + '(prograde, retrograde, prograde) in geocentric longitude',
    spanMonths: '≈6–7',           // 1980-12-31→1981-07-24 ≈ 6.8 months; 1940-41 ≈ 6.3; 7 BCE ≈ 6.2
    countBetween1200and2400: 7,
    next: '2238–39',
    note: 'Triples exist only in geocentric apparent longitude; the doctrinal cycle uses MEAN conjunctions '
      + '(exactly one per 19.859 yr — never triple). Conjunction dates in right ascension differ from '
      + 'dates in ecliptic longitude by days to weeks (e.g. 1981: RA Jan 14/Feb 19/Jul 30 vs longitude '
      + 'Dec 31 1980/Mar 4/Jul 24 1981).',
  },
  // Engine-verified anchor for the doctrinal mean-conjunction overlay.
  anchor2020: {
    iso: '2020-12-21T18:26:00Z',
    y: 2020, m: 12, d: 21, hourUT: 18 + 26 / 60,
    lonDeg: 300.487,                        // 0°29′ Aquarius, tropical of-date
    note: 'The engine-verified longitude-crossing moment of the 2020 great conjunction, used as the '
      + 'anchor of the mean series.',
  },
  cite: 'Wikipedia, "Great conjunction" and "Triple conjunction" (every figure re-checked against the repo '
    + 'engine during research: synodic 7253.45 d = 19.8589 Julian yr; advance 242.98° tropical / 242.70° '
    + 'sidereal; 7 triples 1200–2400, next 2238–39; Kepler "794 years (40 conjunctions)"); '
    + 'doctrinal 240/960: ' + YB_CITE + '.',
};

// ---------------------------------------------------------------------------
//  DOCTRINE — Abū Maʿshar's three tiers of historical astrology.
//  Status: documented historical belief. No demonstrated validity.
// ---------------------------------------------------------------------------
export const DOCTRINE = {
  key: 'doctrine',
  title: 'Abū Maʿshar’s three tiers — how the conjunctions were made to periodize history',
  author: 'Abū Maʿshar al-Balkhī (787–886), Kitāb al-milal wa-d-duwal '
    + '(Latin: De magnis coniunctionibus)',
  basis: 'The doctrine is built on MEAN conjunctions computed from mean planetary motions — exactly one '
    + 'per 19.859-yr synodic period, 12 per triplicity, no triples. Observation instead gives geocentric '
    + 'conjunctions that can be single or triple. Showing both layers side by side is the point.',
  tiers: [
    {
      every: '≈20 years',
      name: 'each Jupiter–Saturn conjunction',
      signification: 'the smallest scale of the scheme — affairs of kings and dynasties within a triplicity '
        + '(the later Latin convention calls these coniunctiones minores)',
    },
    {
      every: '≈240 years (doctrinal; ~220 astronomical)',
      name: 'the shift of triplicity (trigon)',
      signification: 'religious and dynastic change — “a sect and its change in certain regions” '
        + '(Encyclopaedia Iranica); Abū Maʿshar applied it to the rise of Islam and the fortunes '
        + 'of the Abbasids',
    },
    {
      every: '≈960 years (medieval convention; Kepler computed 794)',
      name: 'the return of the cycle to the first trigon',
      signification: 'the greatest matters — PROPHETS attach to this ~millennium tier '
        + '(“a new prophet should arise in every millennium” — Encyclopaedia Iranica)',
    },
  ],
  flags: [
    'Secondary sources DISAGREE on the tier significations’ wording: Encyclopaedia Iranica ties '
      + '“a sect and its change” (milla = religion) to the 240-yr shift and prophets to the '
      + '~millennium scale, while Stockinger’s summary assigns them differently. Recorded as a live '
      + 'disagreement — cross-check against the Brill introduction before tightening the wording.',
    'The Latin tags minor / media / maxima are a LATER Latin convention; Abū Maʿshar’s own '
      + 'terms are “great / greater / greatest”, and Māshāʾallāh used a '
      + 'different lesser/middle/greater scheme.',
  ],
  status: 'documented historical belief — described, never endorsed; no demonstrated validity',
  cite: YB_CITE + '; tier significations: Encyclopaedia Iranica, “Abū Maʿšar” '
    + '(iranicaonline.org); the 20/240/960 structure also summarized (from Yamamoto & Burnett) by the '
    + 'International Society of Classical Astrologers.',
};

// ---------------------------------------------------------------------------
//  KEPLER — De Stella Nova (1606) and the fiery trigon.
// ---------------------------------------------------------------------------
export const KEPLER = {
  key: 'kepler',
  title: 'Kepler and the fiery trigon — De Stella Nova (1606)',
  work: 'Johannes Kepler, De Stella Nova in Pede Serpentarii (Prague, 1606)',
  conjunction: {
    date: '1603-12-18', lonDeg: 248.316,   // 8°19′ Sagittarius, tropical of-date, engine-verified
    place: { name: 'Prague', lat: 50.09, lon: 14.42 },
    note: 'The December 1603 conjunction in Sagittarius — the FIRST of the new fiery trigon after '
      + '~200 years of watery-trigon conjunctions (Cancer/Scorpio/Pisces). Kepler observed it 17–18 Dec; '
      + 'the engine’s longitude crossing is 1603-12-18 06:59 UT.',
  },
  claims: [
    'Chapter 7 tabulates world-historical epochs against each fiery-trigon return — Kepler reckoned '
      + 'December 1603 the SEVENTH fiery-trigon entry since Creation.',
    'The book contains the celebrated trigon diagram: successive conjunctions ~120° apart drawing an '
      + 'equilateral triangle that slowly rotates through the zodiac.',
    'The new star of October 1604 (SN 1604, “Kepler’s nova”) appeared near the '
      + 'Jupiter–Saturn–Mars grouping, prompting the book.',
  ],
  status: 'documented historical belief — the astronomy is real, the historical periodization is doctrine',
  cite: 'J. Kepler, De Stella Nova in Pede Serpentarii (Prague, 1606), ch. 7 (the trigon table and diagram); '
    + 'Linda Hall Library, “Scientist of the Day: Johannes Kepler”, '
    + 'lindahall.org/about/news/scientist-of-the-day/johannes-kepler-3/ (that -3 URL specifically — the '
    + 'undecorated /johannes-kepler/ page is a different article, on the Rudolphine Tables).',
};

// ---------------------------------------------------------------------------
//  PARIS_1348 — the medical faculty's report to Philip VI on the Black Death.
//  Documented belief; DEBUNKED cause.
// ---------------------------------------------------------------------------
export const PARIS_1348 = {
  key: 'paris1348',
  title: 'The Paris medical faculty on the Black Death (October 1348)',
  quote: 'In 1345, at one hour after noon on 20 March, there was a major conjunction of three planets in Aquarius',
  quoteNote: 'That sentence itself does not name the three planets; Saturn–Jupiter–Mars is '
    + 'established by the adjacent text (Saturn+Jupiter = mortality of races; Mars+Jupiter = pestilence '
    + 'in the air) and by the actual sky.',
  reasoning: 'The report reasons from PSEUDO-Aristotle’s De causis proprietatum elementorum (a work '
    + 'falsely attributed to Aristotle in the Middle Ages) and from Albertus Magnus — NOT from Aristotle’s '
    + 'Meteorology (Horrox’s translation notes flag the false attribution).',
  // Engine-confirmed sky at the faculty's stated hour. Dates are JULIAN calendar;
  // the app converts to proleptic Gregorian with core/calendar.js for casting.
  julianDate: { y: 1345, m: 3, d: 20, hourUT: 13 },
  enginePositions: {
    calendar: 'Julian 1345-03-20 13:00 (≈ proleptic Gregorian 1345-03-28)',
    saturn: '18°43′ Aquarius', jupiter: '18°22′ Aquarius', mars: '29°04′ Aquarius',
    exactConjunction: 'exact Jupiter–Saturn conjunction Julian 1345-03-24, at 19°01′ Aquarius',
    note: 'All three planets really were in Aquarius at the stated hour — the observation was sound; '
      + 'the causal inference was not.',
  },
  place: { name: 'Paris', lat: 48.85, lon: 2.35 },
  actualCause: 'Yersinia pestis (settled modern consensus). The conjunction happened; it did not cause the plague.',
  status: 'documented belief — debunked cause',
  cite: 'Report of the Paris Medical Faculty, October 1348, in R. Hoeniger, Der Schwarze Tod (Berlin, 1882), '
    + 'app. III, pp. 152–6, trans. at M. Carlin’s site (sites.uwm.edu/carlin/); standard English '
    + 'trans. R. Horrox, The Black Death (Manchester UP, 1994).',
};

// ---------------------------------------------------------------------------
//  BETHLEHEM — the 7 BCE triple conjunction in Pisces. Status: DISPUTED.
// ---------------------------------------------------------------------------
export const BETHLEHEM = {
  key: 'bethlehem',
  title: 'The 7 BCE triple conjunction in Pisces — the “Star of Bethlehem” candidate',
  yearAstronomical: -6,                     // astronomical year numbering: 7 BCE = −6
  // Engine-verified longitude crossings (tropical of-date). Dates are JULIAN calendar.
  passes: [
    { calendar: 'Julian', date: '7 BCE May 28', lonDeg: 350.841, position: '20°50′ Pisces', sepArcmin: 61.4 },
    { calendar: 'Julian', date: '7 BCE Oct 3', lonDeg: 347.259, position: '17°16′ Pisces', sepArcmin: 61.1, retro: true },
    { calendar: 'Julian', date: '7 BCE Dec 4', lonDeg: 345.495, position: '15°30′ Pisces', sepArcmin: 65.6 },
  ],
  spreadFlag: 'Published computations SPREAD across authors: May 27–29, Sep 29–Oct 6, Dec 1–6 '
    + '(Julian). The repo engine’s crossings (Julian May 28.4 / Oct 2.9 / Dec 4.3) sit inside every '
    + 'published window; no single day is asserted here — the spread is the honest datum.',
  separationNote: 'Minimum separation ≈1° (about twice the Moon’s apparent diameter) at every '
    + 'pass — the planets never merged into a single “star”.',
  babylonNote: 'A Babylonian almanac covering the period records the phenomena without any special interest.',
  status: 'disputed identification',
  cite: 'D. W. Hughes, “The Star of Bethlehem”, Nature 264 (1976): 513–517; separation and the '
    + 'indifferent Babylonian almanac: Wikipedia, “Star of Bethlehem”; crossings engine-verified '
    + '(tropical of-date, Julian calendar labels).',
};

// ---------------------------------------------------------------------------
//  GOLDEN_CONJUNCTIONS — the engine-verified vector table (tropical of-date).
//  Each { date (UT day of the LONGITUDE crossing), lon, label, note?, cite };
//  `retro: true` marks the middle (both-retrograde) passes of the triples.
// ---------------------------------------------------------------------------
export const GOLDEN_CONJUNCTIONS = [
  {
    date: '2020-12-21', lon: 300.487, label: 'The Great Conjunction of 2020 — 0°29′ Aquarius',
    note: 'Published minimum separation 6.1′ — the closest since 1623, and the most easily visible '
      + 'close one since 1226 (engine: 5.9′ at 18:27 UT, inside its ~1′ model tolerance).',
    cite: NOLLE_CITE + ' Min-sep 6.1′ / “closest since 1623”: Wikipedia “Great '
      + 'conjunction”; NASA, “The ‘Great’ Conjunction of Jupiter and Saturn”.',
  },
  { date: '2000-05-28', lon: 52.724, label: '2000 — 22°43′ Taurus', cite: NOLLE_CITE },
  {
    date: '1980-12-31', lon: 189.497, label: '1980–81 Libra triple, pass 1 — 9°30′ Libra',
    note: 'Jupiter prograde. Wikipedia dates this row 1 Jan 1981 (minimum-separation convention); the '
      + 'longitude crossing is Dec 31, 20:25 UT.',
    cite: NOLLE_CITE,
  },
  {
    date: '1981-03-04', lon: 188.105, retro: true,
    label: '1980–81 Libra triple, pass 2 — 8°06′ Libra, BOTH retrograde',
    cite: NOLLE_CITE,
  },
  {
    date: '1981-07-24', lon: 184.934, label: '1980–81 Libra triple, pass 3 — 4°56′ Libra',
    note: 'The Libra triple is the one-off AIR foray inside the 1842–2000 earth run.',
    cite: NOLLE_CITE,
  },
  {
    date: '1961-02-18', lon: 295.199, label: '1961 — 25°12′ Capricorn',
    note: 'Crossing 1961-02-18 23:45 UT — Feb 18 in UT; some tables (incl. Nolle) print Feb 19 '
      + '(time zones east of UT). Flagged ±1 day.',
    cite: NOLLE_CITE,
  },
  { date: '1940-08-08', lon: 44.456, label: '1940–41 Taurus triple, pass 1 — 14°27′ Taurus', cite: NOLLE_CITE },
  {
    date: '1940-10-20', lon: 42.464, retro: true,
    label: '1940–41 Taurus triple, pass 2 — 12°28′ Taurus, BOTH retrograde',
    note: 'DISCREPANCY FLAG: Wikipedia’s 21-Oct-1940 longitude cell (41.1° J2000) is erroneous — '
      + 'the correct J2000 value is ≈43.3° (42.46° of-date + 0.83° precession); the same '
      + 'row’s 74.1′ separation is engine-exact, isolating the error to that one cell.',
    cite: NOLLE_CITE,
  },
  { date: '1941-02-15', lon: 39.123, label: '1940–41 Taurus triple, pass 3 — 9°07′ Taurus', cite: NOLLE_CITE },
  { date: '1901-11-28', lon: 283.994, label: '1901 — 14°00′ Capricorn', cite: NOLLE_CITE },
  {
    date: '1842-01-26', lon: 278.901, label: '1842 — 8°54′ Capricorn',
    note: 'Start of the CONTINUOUS earth-triplicity series (1842–2000, bar the 1980–81 Libra foray). '
      + 'The first earth entry was 1802 (5°08′ Virgo), followed by a fire reversion in 1821 '
      + '(24°39′ Aries).',
    cite: NOLLE_CITE,
  },
  {
    date: '1623-07-16', lon: 126.607, label: '1623 — 6°36′ Leo',
    note: 'Published minimum separation 5.2′ (engine 5.4′) — the closest between 1226 and 2020, but '
      + 'only ~13° from the Sun, so poorly visible.',
    cite: NOLLE_CITE,
  },
  {
    date: '1603-12-18', lon: 248.316, label: '1603 — 8°19′ Sagittarius (Kepler’s conjunction)',
    note: 'First conjunction of the new fiery trigon; the subject of De Stella Nova (1606).',
    cite: NOLLE_CITE + ' Linda Hall Library, Scientist of the Day (johannes-kepler-3).',
  },
];

// ---------------------------------------------------------------------------
//  ECLIPSE_LIMITS — the node-distance ecliptic limits (all GLOBAL criteria).
//  D = angular distance of the syzygy Moon from the nearer lunar node.
// ---------------------------------------------------------------------------
export const ECLIPSE_LIMITS = {
  solar: {
    certainDeg: 15.39, impossibleDeg: 18.59,
    meaning: 'New Moon within D° of a node: a solar eclipse is visible from SOME location on Earth — '
      + 'CERTAIN below 15.39°, IMPOSSIBLE above 18.59°, uncertain between (the spread comes from '
      + 'the eccentricity of the Moon’s and the Earth’s orbits).',
    cite: 'NASA GSFC / F. Espenak, Periodicity of Solar Eclipses, eclipse.gsfc.nasa.gov/SEsaros/SEperiodicity.html',
  },
  lunarAny: {
    certainDeg: 15.3, impossibleDeg: 17.1,
    meaning: 'Full Moon within D° of a node: a lunar eclipse of ANY type (including penumbral) is '
      + 'visible from a portion of Earth — certain below 15.3°, impossible above 17.1°.',
    cite: 'NASA GSFC / F. Espenak, Periodicity of Lunar Eclipses, eclipse.gsfc.nasa.gov/LEsaros/LEperiodicity.html',
  },
  lunarUmbralClassical: {
    certainDeg: 9.5, impossibleDeg: 12.25,
    meaning: 'Classical UMBRAL lunar limits: an umbral (partial/total) lunar eclipse MUST occur below '
      + '9°30′ and CANNOT occur above 12°15′ node distance.',
    cite: 'archaeocosmology.org/eng/eclipse.htm (quoting Duffett-Smith 1988 / The Cambridge Encyclopaedia '
      + 'of Astronomy); the 12°15′ (=12.25°) major limit is corroborated by Oxford '
      + 'Reference/Britannica figures (~12°.2).',
  },
  classicalSolarDiscrepancy: {
    printed: '15°31′', plausibleIntended: '15°21′ (= 15.35°)', major: '18°31′',
    status: 'UNRESOLVED',
    flag: 'DISCREPANCY FLAG (unresolved): archaeocosmology.org prints the classical solar MINOR limit as '
      + '15°31′ (citing Duffett-Smith / Cambridge Encyclopaedia of Astronomy), but 15°21′ '
      + '(= 15.35°) is the plausible intended value — it sits just below NASA’s modern 15.39° '
      + 'lower bound — yet no reachable source prints 15°21′. BOTH values are recorded; neither is '
      + 'asserted. The paired major limit 18°31′ (= 18.52°) IS corroborated (NASA 18.59°).',
    cite: 'archaeocosmology.org/eng/eclipse.htm (printing verified verbatim); cross-check: NASA SEperiodicity '
      + '15.39°–18.59°.',
  },
  meeusPrune: {
    sinF: 0.36,
    meaning: 'Meeus’ preliminary test: at the mean syzygy compute F, the Moon’s argument of '
      + 'latitude; if |sin F| > 0.36 (≈ F more than 21.1° from the node) there is no eclipse.',
    cite: 'J. Meeus, Astronomical Algorithms, 2nd ed., ch. 54 (“Eclipses”).',
  },
  framing: 'All of these are GLOBAL criteria: they say only that an eclipse occurred, or was possible, '
    + 'SOMEWHERE ON EARTH near the syzygy. Local visibility needs Besselian elements — out of scope, and '
    + 'never claimed on this site.',
  cite: 'NASA GSFC / F. Espenak, eclipse.gsfc.nasa.gov/SEsaros/SEperiodicity.html and '
    + '/LEsaros/LEperiodicity.html; J. Meeus, Astronomical Algorithms, 2nd ed., ch. 54; classical arcminute '
    + 'values: archaeocosmology.org (flagged above).',
};

// ---------------------------------------------------------------------------
//  ECLIPSE_VECTORS — NASA-verified test vectors (9 positives + 2 negatives).
//  `date` is the UT day of the syzygy/eclipse; negatives have `negative: true`.
// ---------------------------------------------------------------------------
export const ECLIPSE_VECTORS = [
  {
    kind: 'solar', type: 'total', date: '1715-05-03', label: 'Halley’s London eclipse',
    saros: 114, gamma: 0.7112, magnitude: 1.0632,
    cite: 'NASA Five Millennium Catalog, eclipse.gsfc.nasa.gov/SEcat5/SE1701-1800.html (row 08826: '
      + 'TD 09:36:30, Saros 114, T, gamma 0.7112, mag 1.0632).',
  },
  {
    kind: 'solar', type: 'total', date: '1919-05-29', label: 'The Eddington eclipse',
    saros: 136, gamma: -0.2955, centralDuration: '6m51s',
    cite: 'NASA Five Millennium Catalog, eclipse.gsfc.nasa.gov/SEcat5/SE1901-2000.html (row 09326: '
      + 'TD 13:08:55, Saros 136, T, 06m51s).',
  },
  {
    kind: 'solar', type: 'total', date: '2017-08-21', label: 'The “Great American” eclipse',
    saros: 145, magnitude: 1.031,
    cite: 'NASA decade table, eclipse.gsfc.nasa.gov/SEdecade/SEdecade2011.html.',
  },
  {
    kind: 'solar', type: 'annular', date: '2023-10-14', magnitude: 0.952,
    cite: 'NASA decade table, eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html.',
  },
  {
    kind: 'solar', type: 'total', date: '2024-04-08', magnitude: 1.057,
    cite: 'NASA decade table, eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html.',
  },
  {
    kind: 'lunar', type: 'total', date: '2018-07-27', umbralMagnitude: 1.609,
    note: 'Umbral magnitude 1.609, total phase 01h43m per the NASA decade table (the popular “longest '
      + 'of the 21st century” tag is consistent with, but not stated on, that page).',
    cite: 'NASA lunar decade table, eclipse.gsfc.nasa.gov/LEdecade/LEdecade2011.html.',
  },
  { kind: 'lunar', type: 'total', date: '2019-01-21', cite: 'NASA lunar decade table, eclipse.gsfc.nasa.gov/LEdecade/LEdecade2011.html.' },
  { kind: 'lunar', type: 'total', date: '2022-05-16', cite: 'NASA lunar decade table, eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html.' },
  { kind: 'lunar', type: 'total', date: '2022-11-08', cite: 'NASA lunar decade table, eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html.' },
  {
    kind: 'solar', type: 'none', negative: true, date: '2023-06-18', hourUT: '≈04:37',
    nodeDistanceApproxDeg: 54,
    note: 'New moon ≈04:37 UT with node distance ≈54° — nearly three times the 18.59° '
      + 'impossibility limit. NASA confirms 2023 had exactly two solar eclipses (Apr 20 hybrid, Oct 14 '
      + 'annular), none in June.',
    cite: 'NASA decade table, eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html (complete 2023 list).',
  },
  {
    kind: 'lunar', type: 'none', negative: true, date: '2023-01-06', hourUT: '≈23:08',
    nodeDistanceApproxDeg: 65,
    note: 'Full moon ≈23:08 UT with node distance ≈65° — far above the 17.1° '
      + 'impossibility limit. NASA confirms no lunar eclipse between 2022 Nov 08 and 2023 May 05.',
    cite: 'NASA lunar decade table, eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html (complete 2022–23 list).',
  },
];

// ---------------------------------------------------------------------------
//  BABYLON — three cited records of the ORIGINAL eclipse divination, framed
//  honestly: meaning assigned by convention, no causal validity. The Babylonian
//  "eclipse possibility" logic maps onto the modern uncertain band.
// ---------------------------------------------------------------------------
export const BABYLON = [
  {
    key: 'enuma-anu-enlil',
    title: 'Enūma Anu Enlil — the lunar-eclipse omen tablets',
    text: 'Tablets 15–22 of the ~70-tablet celestial omen series Enūma Anu Enlil are devoted to '
      + 'lunar-eclipse omina, keyed to the eclipse’s date, the watch of the night, and the QUADRANT of '
      + 'the Moon’s disc darkened — each quadrant conventionally mapped to one of the four lands '
      + '(Akkad, Subartu, Elam, Amurru), so an eclipse “addressed” a specific kingdom. This is '
      + 'state divination: a meaning ASSIGNED BY CONVENTION to a real astronomical event, with no causal '
      + 'validity — celestial signs read as a script, not physics.',
    cite: 'F. Rochberg-Halton, Aspects of Babylonian Celestial Divination: The Lunar Eclipse Tablets of '
      + 'Enūma Anu Enlil (AfO Beiheft 22, 1988); F. Rochberg, The Heavenly Writing (Cambridge UP, 2004).',
  },
  {
    key: 'saros-223',
    title: 'The 223-month cycle — predicting eclipse POSSIBILITIES',
    text: 'Late Babylonian astronomers used the 223-synodic-month eclipse cycle (the modern “Saros” '
      + '— itself an 18th-century misnomer; the Babylonian texts simply count 223 months) to predict the '
      + 'dates of future eclipse POSSIBILITIES — possibility, never certainty of local visibility. Their '
      + '“possibility” logic maps directly onto the modern uncertain band between the ecliptic '
      + 'limits used by this tool.',
    cite: 'J. M. Steele, “Eclipse Prediction in Mesopotamia”, Archive for History of Exact '
      + 'Sciences 54 (2000): 421–454.',
  },
  {
    key: 'sar-puhi',
    title: 'šar pūhi — the substitute king',
    text: 'When a lunar eclipse’s configuration portended the king’s death, Neo-Assyrian courts '
      + 'enthroned a SUBSTITUTE KING (šar pūhi) to absorb the fatal omen — he wore the royal '
      + 'garments and “reigned” up to 100 days while the real king lived in seclusion as “the '
      + 'farmer”. The practice is documented in the scholars’ letters to Esarhaddon and '
      + 'Assurbanipal; Esarhaddon underwent it repeatedly. The ritual answers the OMEN, not the astronomy — '
      + 'divinatory meaning by convention, no causal validity.',
    cite: 'S. Parpola, Letters from Assyrian Scholars to the Kings Esarhaddon and Assurbanipal, Part II '
      + '(1983), excursus on the substitute king; F. Rochberg, The Heavenly Writing (Cambridge UP, 2004).',
  },
];
