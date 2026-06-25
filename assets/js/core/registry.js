// ============================================================================
//  registry.js — the CAPABILITY CATALOG. A machine-readable manifest of every
//  thing the engine computes: one entry per capability, naming the module &
//  export that produces it, what it computes, its input/output shape, the
//  Lilly/Picatrix citation, the page(s) that surface it, the "how it's
//  calculated" anchor, and the glossary terms it touches.
//
//  It is the index that lets a person — or a local LLM — DISCOVER and USE every
//  function and datum the project calculates. It drives:
//    • the Reference index on pages/workbench.html (human-facing),
//    • core/llm-context.js `buildToolSchema()` (the model's callable tools).
//
//  PURE DATA + tiny helpers — no engine imports, so it stays a light catalog.
//  An anti-drift test in scripts/engine-test.mjs asserts that every `exportName`
//  really exists, every `module`/`pages` path resolves, every `howItWorks`
//  anchor id is present, every `glossaryTerms` string is a real GLOSSARY term,
//  and that OP_KEYS matches election.js — so this file can never silently drift
//  from the code.
// ============================================================================

// The election aim keys (mirrors election.js OPERATIONS[].key; the test asserts
// they stay in sync). Kept here so the catalog imports nothing from the engine.
export const OP_KEYS = ['love', 'wealth', 'honour', 'knowledge', 'journey', 'victory',
  'healing', 'protection', 'binding', 'banishing', 'endings'];

const PLANET_ENUM = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const HIW = a => `pages/how-it-works.html#hiw-${a}`;

// ---------------------------------------------------------------------------
//  The catalogue. `callable: true` marks a capability the LLM may invoke as a
//  tool; its `inputs` double as the tool's parameter schema.
// ---------------------------------------------------------------------------
export const REGISTRY = [
  {
    id: 'positions', title: 'Cast the figure (positions, angles, houses)',
    module: 'assets/js/core/astro.js', exportName: 'castChart',
    exports: ['signOf', 'formatLon', 'houses', 'partOfFortune', 'antiscion'],
    computes: 'Geocentric apparent ecliptic longitudes of the 7 planets + nodes, the Ascendant/MC and the (Regiomontanus) house cusps, day/night sect, and the Part of Fortune, for a moment & place.',
    inputs: [
      { name: 'date', type: 'string', desc: 'ISO datetime (UTC)', required: true },
      { name: 'lat', type: 'number', desc: 'latitude °', required: true },
      { name: 'lon', type: 'number', desc: 'longitude °', required: true },
      { name: 'system', type: 'enum', values: ['regiomontanus', 'placidus', 'whole', 'equal'], desc: 'house system' },
    ],
    outputShape: '{ asc, mc, cusps[1..12], isDay, planets:{name:{lon,house,speed,retrograde}} }',
    callable: true,
    book: 'Book I', chapter: 'CA Bk I — erecting the figure',
    citation: 'Lilly, Christian Astrology Bk I; positions from astronomy-engine (~1 arc-minute).',
    pages: ['pages/workbench.html', 'pages/book1/master.html'], howItWorks: 'pages/how-it-works.html',
    glossaryTerms: ['Ascendant', 'Midheaven (Medium Coeli, MC)', 'Regiomontanus'],
  },
  {
    id: 'essential-dignity', title: 'Essential dignity',
    module: 'assets/js/core/dignities.js', exportName: 'essentialDignity',
    computes: 'A planet’s strength by sign & degree — domicile (+5), exaltation (+4), triplicity (+3), term (+2), face (+1), detriment (−5), fall (−4) or peregrine (−5) — and the net ledger.',
    inputs: [
      { name: 'planet', type: 'enum', values: PLANET_ENUM, required: true },
      { name: 'lon', type: 'number', desc: 'ecliptic longitude 0–360', required: true },
      { name: 'isDay', type: 'boolean', desc: 'day chart?', required: true },
    ],
    outputShape: '{ rows:[{kind,score}], total, peregrine, dispositor }',
    callable: true,
    book: 'Book I', chapter: 'CA Bk I, pp.101-116',
    citation: 'Lilly, Christian Astrology Bk I — essential dignity & debility.',
    pages: ['pages/book1/dignities.html', 'pages/workbench.html'], howItWorks: HIW('dignity'),
    glossaryTerms: ['Essential Dignity', 'Domicile (House)', 'Exaltation', 'Triplicity', 'Term (Bound)', 'Face (Decan)', 'Detriment', 'Fall', 'Peregrine', 'Dispositor'],
  },
  {
    id: 'accidental-dignity', title: 'Accidental dignity',
    module: 'assets/js/core/dignities.js', exportName: 'accidentalDignity',
    computes: 'A planet’s strength of situation — house placement, direct/retrograde & speed, freedom from the Sun (combust/cazimi/under-beams), and fixed-star contacts.',
    inputs: [
      { name: 'planet', type: 'enum', values: PLANET_ENUM, required: true },
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
    ],
    outputShape: '{ rows:[{kind,score}], total }',
    callable: false,
    book: 'Book I', chapter: 'CA Bk I — accidental fortitudes',
    citation: 'Lilly, Christian Astrology Bk I — accidental dignity & debility.',
    pages: ['pages/book1/dignities.html', 'pages/workbench.html'], howItWorks: HIW('accidental'),
    glossaryTerms: ['Accidental Dignity', 'Retrograde', 'Combust', 'Cazimi', 'Under the Sunbeams', 'Besieged'],
  },
  {
    id: 'almuten', title: 'Almuten of a degree',
    module: 'assets/js/core/dignities.js', exportName: 'almuten',
    computes: 'The planet with the most essential dignity at a longitude — the “victor” of that degree (e.g. the almuten of the Ascendant).',
    inputs: [
      { name: 'lon', type: 'number', desc: 'ecliptic longitude 0–360', required: true },
      { name: 'isDay', type: 'boolean', required: true },
    ],
    outputShape: '{ planet, score, all:{planet:score} }',
    callable: true,
    book: 'Book I', chapter: 'CA Bk I — the almuten',
    citation: 'Lilly, Christian Astrology Bk I — the almuten (lord) of a degree.',
    pages: ['pages/book1/dignities.html'], howItWorks: HIW('dignity'),
    glossaryTerms: ['Almuten'],
  },
  {
    id: 'chart-health', title: 'Chart health (cautions & verdict)',
    module: 'assets/js/core/cautions.js', exportName: 'chartCautions',
    computes: 'The consolidated chart-health engine: the considerations before judgement + the Moon’s condition + each planet’s afflictions, reduced to severity advisories and a green/amber/red verdict.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'hourRuler', type: 'enum', values: PLANET_ENUM, desc: 'the planetary-hour ruler' },
    ],
    outputShape: '{ verdict, label, lordAsc, global:[{severity,text}], planets:{}, counts:{} }',
    callable: false,
    book: 'Book II', chapter: 'CA Bk II — considerations before judgement',
    citation: 'Lilly, Christian Astrology Bk II — the considerations before judgement & the Moon’s condition.',
    pages: ['pages/workbench.html', 'pages/now.html'], howItWorks: HIW('accidental'),
    glossaryTerms: ['Verdict (green / amber / red)', 'Considerations before Judgement', 'Void of Course', 'Via Combusta'],
  },
  {
    id: 'aspects', title: 'Aspects, orbs & reception',
    module: 'assets/js/core/aspects.js', exportName: 'allAspects',
    exports: ['aspectBetween', 'mutualReception'],
    computes: 'The Ptolemaic aspects (conjunction/sextile/square/trine/opposition) among the bodies, using Lilly’s planet-based orbs & moieties, with applying/separating and mutual reception.',
    inputs: [
      { name: 'bodies', type: 'object', desc: '{name:{lon,speed}}', required: true },
    ],
    outputShape: '[{from,to,aspect,glyph,nature,angle,orb,applying,separating,partile}]',
    callable: false,
    book: 'Book I', chapter: 'CA Bk I — aspects & orbs',
    citation: 'Lilly, Christian Astrology Bk I — the aspects, orbs, moieties; reception.',
    pages: ['pages/book1/master.html', 'pages/book2/horary.html'], howItWorks: HIW('aspects'),
    glossaryTerms: ['Aspect', 'Orb', 'Moiety', 'Partile / Platic', 'Applying / Separating', 'Reception'],
  },
  {
    id: 'part-of-fortune', title: 'Part of Fortune & the Lots',
    module: 'assets/js/core/astro.js', exportName: 'partOfFortune',
    exports: ['lot', 'antiscion', 'contraAntiscion'],
    computes: 'The Part of Fortune (Asc + Moon − Sun; sect-aware option) and the generalized Arabic Part / Lot = Asc + B − C; plus antiscia (reflections across the solstitial axis).',
    inputs: [
      { name: 'asc', type: 'number', required: true },
      { name: 'sunLon', type: 'number', required: true },
      { name: 'moonLon', type: 'number', required: true },
    ],
    outputShape: 'number (ecliptic longitude)',
    callable: false,
    book: 'Book I', chapter: 'CA Bk I — the Part of Fortune',
    citation: 'Lilly, Christian Astrology Bk I — the Part of Fortune; the Arabic Parts.',
    pages: ['pages/book1/master.html', 'pages/workbench.html'], howItWorks: HIW('fortune'),
    glossaryTerms: ['Part of Fortune (⊕)', 'Antiscion'],
  },
  {
    id: 'planetary-hours', title: 'Planetary day & hour',
    module: 'assets/js/core/planetary-hours.js', exportName: 'planetaryHour',
    exports: ['dayRuler', 'hoursTable'],
    computes: 'The ruler of the planetary day & of the current unequal hour (Chaldean order, beginning at sunrise with the lord of the weekday) for a moment & place.',
    inputs: [
      { name: 'date', type: 'string', desc: 'ISO datetime (UTC)', required: true },
      { name: 'lat', type: 'number', required: true },
      { name: 'lon', type: 'number', required: true },
    ],
    outputShape: '{ ruler, dayRuler, hourNumber, isNight, hourLengthMinutes }',
    callable: true,
    book: 'Book I', chapter: 'CA Bk I — the planetary hours',
    citation: 'Lilly, Christian Astrology Bk I / Picatrix III.7 — the planetary hours.',
    pages: ['pages/book1/planetary-hours.html', 'pages/now.html'], howItWorks: HIW('hours'),
    glossaryTerms: ['Planetary Hours', 'Chaldean Order'],
  },
  {
    id: 'moon-condition', title: 'The Moon’s condition',
    module: 'assets/js/core/election.js', exportName: 'moonPhase',
    exports: ['moonDispositor', 'isViaCombusta'],
    computes: 'The Moon’s phase (waxing/waning), her dispositor and its strength, whether she is void of course or in the Via Combusta (with the Spica exception).',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
    ],
    outputShape: '{ elongation, waxing, label } / { planet, essential, accidental }',
    callable: false,
    book: 'Book II', chapter: 'CA Bk II — the Moon weighed above all',
    citation: 'Lilly, Christian Astrology Bk II — the Moon’s condition (void of course, via combusta, phase, speed).',
    pages: ['pages/now.html', 'pages/picatrix/election.html'], howItWorks: HIW('moon'),
    glossaryTerms: ['Void of Course', 'Via Combusta', 'Dispositor'],
  },
  {
    id: 'perfection', title: 'Modes of perfection & timing',
    module: 'assets/js/core/perfection.js', exportName: 'modesOfPerfection',
    exports: ['timeToPerfection', 'houseType'],
    computes: 'How a horary matter is brought to pass — direct aspect, translation/collection of light, prohibition, refranation, reception — and an estimate of the timing.',
    inputs: [
      { name: 'chart', type: 'object', required: true },
      { name: 'A', type: 'enum', values: PLANET_ENUM, desc: 'querent significator', required: true },
      { name: 'B', type: 'enum', values: PLANET_ENUM, desc: 'quesited significator', required: true },
    ],
    outputShape: '{ direct, translation, collection, prohibition, refranation, reception }',
    callable: false,
    book: 'Book II', chapter: 'CA Bk II — the modes of perfection',
    citation: 'Lilly, Christian Astrology Bk II — perfection (direct/translation/collection/prohibition/refranation) & timing.',
    pages: ['pages/book2/horary.html'], howItWorks: HIW('aspects'),
    glossaryTerms: ['Perfection', 'Translation of Light', 'Collection of Light', 'Prohibition', 'Refranation'],
  },
  {
    id: 'profections', title: 'Annual profection & Lord of the Year',
    module: 'assets/js/core/profections.js', exportName: 'annualProfection',
    exports: ['lordOfYear', 'monthlyProfection'],
    computes: 'The annual profection (a ℤ/12 advance of the Ascendant by age), the activated house, and the Lord of the Year (the annual time-lord) with its natal condition.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result', required: true },
      { name: 'age', type: 'number', desc: 'completed years', required: true },
    ],
    outputShape: '{ age, profectedSign, activatedHouse, lordOfYear, lordCondition }',
    callable: true,
    book: 'Book III', chapter: 'CA Bk III — profections',
    citation: 'Lilly, Christian Astrology Bk III — annual profection & the Lord of the Year.',
    pages: ['pages/book3/master.html', 'pages/trajectory.html'], howItWorks: HIW('profections'),
    glossaryTerms: ['Lord of the Geniture'],
  },
  {
    id: 'directions', title: 'Primary directions (Naibod)',
    module: 'assets/js/core/directions.js', exportName: 'directionsToAngles',
    exports: ['arcToYears', 'directInZodiac'],
    computes: 'In-zodiac primary directions of the planets to the angles, with the arc converted to years by the Naibod key (≈0.9856°/yr). A documented simplification of Placidian mundane directions.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result', required: true },
      { name: 'maxYears', type: 'number', desc: 'horizon in years' },
    ],
    outputShape: '[{ promissor, significator, arc, years }]',
    callable: false,
    book: 'Book III', chapter: 'CA Bk III — primary directions',
    citation: 'Lilly, Christian Astrology Bk III — primary directions (Naibod key; simplified, flagged).',
    pages: ['pages/book3/master.html', 'pages/trajectory.html'], howItWorks: HIW('directions'),
    glossaryTerms: ['Lord of the Geniture'],
  },
  {
    id: 'solar-return', title: 'Solar return (revolution)',
    module: 'assets/js/core/solar-return.js', exportName: 'solarReturn',
    exports: ['solarReturnInstant'],
    computes: 'The instant the Sun returns to its natal longitude in a given year, and the chart cast for that moment — the figure of the year.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result', required: true },
      { name: 'year', type: 'number', required: true },
    ],
    outputShape: '{ instant, chart, natalSunLon }',
    callable: false,
    book: 'Book III', chapter: 'CA Bk III — the Solar Revolution',
    citation: 'Lilly, Christian Astrology Bk III — the Solar Revolution (annual return).',
    pages: ['pages/book3/master.html', 'pages/trajectory.html'], howItWorks: HIW('solar'),
    glossaryTerms: ['Temperament'],
  },
  {
    id: 'hyleg', title: 'Hyleg & Alcocoden (length of life)',
    module: 'assets/js/core/hyleg.js', exportName: 'hyleg',
    exports: ['alcocoden', 'HYLEGIACAL_HOUSES', 'PLANETARY_YEARS'],
    computes: 'The hyleg (giver of life) and alcocoden (giver of years) and the planetary-years length-of-life estimate. A contested technique, fully flagged with its assumptions.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result', required: true },
    ],
    outputShape: '{ hyleg, candidatesExamined, reason, assumptions } / { alcocoden, years }',
    callable: false,
    book: 'Book III', chapter: 'CA Bk III — length of life',
    citation: 'Lilly, Christian Astrology Bk III — Hyleg & Alcocoden (contested; cf. Ptolemy Tetrabiblos III).',
    pages: ['pages/book3/master.html'], howItWorks: HIW('hyleg'),
    glossaryTerms: ['Hyleg (Apheta)', 'Alcocoden'],
  },
  {
    id: 'life-trajectory', title: 'Life trajectory (the whole arc)',
    module: 'assets/js/core/trajectory.js', exportName: 'lifeTrajectory',
    exports: ['ageBetween'],
    computes: 'One composed natal reading across a life: natal signatures, the year-by-year profection timeline & Lord of the Year, primary directions, the solar return, and a personalised Picatrix overlay.',
    inputs: [
      { name: 'birthChart', type: 'object', desc: 'a natal castChart result', required: true },
      { name: 'currentDate', type: 'string', desc: 'ISO datetime (UTC)' },
    ],
    outputShape: '{ natal, timeline[], directions[], currentYear, picatrix, citations }',
    callable: true,
    book: 'Book III + Picatrix', chapter: 'CA Bk III + Picatrix overlay',
    citation: 'Lilly, Christian Astrology Bk III + the Picatrix — the composed life trajectory.',
    pages: ['pages/trajectory.html'], howItWorks: HIW('trajectory'),
    glossaryTerms: ['Lord of the Geniture', 'Temperament'],
  },
  {
    id: 'lunar-mansions', title: 'The 28 Mansions of the Moon',
    module: 'assets/js/core/data/lunar-mansions.js', exportName: 'mansionOf',
    exports: ['LUNAR_MANSIONS', 'MANSION_ARC'],
    computes: 'The Moon’s mansion (one of 28 equal 12.857° divisions of her path) and its traditional magical use, for a longitude.',
    inputs: [
      { name: 'lon', type: 'number', desc: 'the Moon’s ecliptic longitude', required: true },
    ],
    outputShape: '{ num, name, start, end, use, source }',
    callable: true,
    book: 'Picatrix I', chapter: 'Picatrix I.4 — the lunar mansions',
    citation: 'The Picatrix Bk I / Agrippa II.33 — the 28 mansions & their uses.',
    pages: ['pages/picatrix/mansions.html'], howItWorks: HIW('mansions'),
    glossaryTerms: ['Lunar Mansions'],
  },
  {
    id: 'decan-faces', title: 'The 36 decan faces',
    module: 'assets/js/core/data/decan-faces.js', exportName: 'faceOf',
    exports: ['DECAN_FACES'],
    computes: 'The decan face (one of 36 ten-degree thirds of the signs), its Chaldean ruler and its talismanic image, for a longitude.',
    inputs: [
      { name: 'lon', type: 'number', desc: 'ecliptic longitude', required: true },
    ],
    outputShape: '{ signIndex, decan, ruler, image, source }',
    callable: true,
    book: 'Picatrix II', chapter: 'Picatrix II.11 / Agrippa II.37 — the faces',
    citation: 'The Picatrix Bk II / Agrippa II.37 — the 36 decan faces & images.',
    pages: ['pages/picatrix/faces.html'], howItWorks: HIW('faces'),
    glossaryTerms: ['Face (Decan)', 'Chaldean Order'],
  },
  {
    id: 'behenian-stars', title: 'The 15 Behenian fixed stars',
    module: 'assets/js/core/data/behenian-stars.js', exportName: 'starsInAspect',
    exports: ['behenianLongitude', 'BEHENIAN_STARS'],
    computes: 'Which of the 15 Behenian fixed stars are conjunct a chart’s planets, with each star’s longitude precessed live (~50.29″/yr) to the chart’s date.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'orb', type: 'number', desc: 'orb in degrees (default 6)' },
    ],
    outputShape: '[{ star, planet, sep }]',
    callable: false,
    book: 'Picatrix II', chapter: 'Picatrix II / Agrippa II — the Behenian stars',
    citation: 'Agrippa, Three Books II — the 15 Behenian fixed stars (longitudes precessed live).',
    pages: ['pages/picatrix/stars.html'], howItWorks: HIW('behenian'),
    glossaryTerms: ['Antiscion'],
  },
  {
    id: 'election', title: 'Election — is this moment fit?',
    module: 'assets/js/core/election.js', exportName: 'electionScore',
    exports: ['rankNow', 'findNextElection', 'nextAuspiciousTime', 'OPERATIONS'],
    computes: 'For a chosen aim, every testimony the tradition weighs (the planetary hour, the ruler’s dignity & affliction, the Moon’s phase/condition/mansion/dispositor, malefics on angles, fixed-star contacts) reduced to a cited green/amber/red verdict. rankNow scores all aims; findNextElection scans forward for windows.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'operationKey', type: 'enum', values: OP_KEYS, desc: 'the aim', required: true },
    ],
    outputShape: '{ verdict, score, gating[], ruler, hour, moon, reasons:[{severity,text,cite}] }',
    callable: true,
    book: 'Picatrix III + CA Bk I/II', chapter: 'the Lilly ↔ Picatrix bridge',
    citation: 'The Picatrix Bk III / Agrippa II + Lilly Bk I/II — election (ranks, never demands perfection).',
    pages: ['pages/picatrix/election.html', 'pages/now.html'], howItWorks: HIW('election'),
    glossaryTerms: ['Verdict (green / amber / red)', 'Via Combusta', 'Void of Course'],
  },
  {
    id: 'talisman', title: 'Talisman recipe',
    module: 'assets/js/core/talisman.js', exportName: 'talismanRecipe',
    exports: ['allRecipes', 'TALISMAN_DISCLAIMER'],
    computes: 'For an aim & moment, the full historical talisman “recipe”: the election verdict, the ruling planet’s correspondences (suffumigation, colour, metal, stone, spirit-names), the Moon’s mansion, the decan face & image, any fixed-star contact, the design, and numbered cited steps. Historical practice — described, never prescribed.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'operationKey', type: 'enum', values: OP_KEYS, desc: 'the aim', required: true },
    ],
    outputShape: '{ aim, planet, when, verdict, materials, moon, design, steps:[{text,cite}], citations, disclaimer }',
    callable: true,
    book: 'Picatrix II–III', chapter: 'Picatrix II–III / Agrippa II',
    citation: 'The Picatrix Bk II–III / Agrippa II — the talisman recipe (historical, described not prescribed).',
    pages: ['pages/picatrix/talisman.html'], howItWorks: HIW('talisman'),
    glossaryTerms: ['Lunar Mansions', 'Face (Decan)', 'Planetary Hours'],
  },
  {
    id: 'full-reading', title: 'The unified reading (everything at once)',
    module: 'assets/js/core/reading.js', exportName: 'fullReading',
    exports: ['HONEST_FRAMING'],
    computes: 'The UNION of everything the engine computes for one moment (+ optional birth radix & horary house): positions, the dignity ledger, aspects & reception, lots & antiscia, chart health, horary perfection, the election layer, the talisman, and the life trajectory — one serializable object.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'opts', type: 'object', desc: '{ operationKey?, quesitedHouse?, birth? }' },
    ],
    outputShape: '{ meta, moment, dignities, aspects, lots, cautions, horary, election, talisman, natal, vedic, citations }',
    callable: false,
    book: 'all', chapter: 'the unified spine',
    citation: 'Composes Lilly Bk I–III and the Picatrix into one reading; every block carries its own citations.',
    pages: ['pages/workbench.html'], howItWorks: 'pages/how-it-works.html',
    glossaryTerms: [],
  },
  {
    id: 'vedic', title: 'Vedic (Jyotiṣa) reading — Jagannath Hora',
    module: 'assets/js/core/vedic.js', exportName: 'castVedic',
    exports: ['castVedic'],
    computes: 'A SEPARATE system: the sidereal (Lahiri) chart — Lagna & nine grahas with nakṣatra+pada, whole-sign houses, Parāśarī dignity, the Pañcāṅga, the Vimśottarī daśā, the divisional charts (vargas D1–D60), the Aṣṭakavarga (SAV=337) and the FULL six-fold Ṣaḍbala, plus the traditional daily (vāra) & birth-keyed devotional practice (mantra/yoga/yantra — described, not prescribed). Modelled on Jagannath Hora; shown side by side with the Western chart.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result (tropical)', required: true },
      { name: 'opts', type: 'object', desc: '{ currentDate? } for the running daśā & daily practice' },
    ],
    outputShape: '{ ayanamsa, lagna, grahas, panchanga, vimshottari, vargas, ashtakavarga, shadbala, yogas, practice }',
    callable: false,
    book: 'Vedic (Jyotiṣa)', chapter: 'Parāśara BPHS / Jagannath Hora',
    citation: 'Parāśara, Bṛhat Parāśara Horā Śāstra; P.V.R. Narasimha Rao, Vedic Astrology (Jagannath Hora).',
    pages: ['pages/vedic/index.html'], howItWorks: 'pages/vedic/index.html',
    glossaryTerms: ['Sidereal Zodiac', 'Ayanāṁśa', 'Lagna', 'Graha', 'Nakṣatra', 'Vimśottarī Daśā', 'Pañcāṅga', 'Varga', 'Navāṁśa', 'Aṣṭakavarga', 'Ṣaḍbala', 'Bhāva', 'Kāraka', 'Bīja Mantra', 'Yantra'],
  },
  {
    id: 'picatrix-prayers', title: 'Picatrix prayers, spirits & the Perfect Nature (Bk III–IV)',
    module: 'assets/js/core/data/picatrix-prayers.js', exportName: 'prayerFor',
    exports: ['prayerFor'],
    computes: 'Reference: the Picatrix Book III/IV historical material — the seven planetary prayers (III.7), the directional planetary spirits of the Liber Antimaquis (III.9), the Perfect Nature (III.6) and a Book IV summary. The ruling planet of an election/talisman links to its prayer; the assistant can recite/explain it via the picatrixPrayer tool. Historical text, described — never prescribed.',
    inputs: [{ name: 'planet', type: 'string', desc: 'one of the 7 planets', required: true }],
    outputShape: '{ prayerExcerpt, address, names, prayerAngel, spirit, citation, flag? }',
    callable: false,
    book: 'Picatrix', chapter: 'Bk III.6–III.9 & Bk IV',
    citation: 'Picatrix (Ghāyat al-Ḥakīm) III.6–9 & IV; Greer–Warnock translation, cross-checked Attrell–Porreca & Atallah/Kiesel.',
    pages: ['pages/picatrix/prayers.html'], howItWorks: 'pages/picatrix/prayers.html',
    glossaryTerms: ['Planetary Prayer (Picatrix)', 'Planetary Spirits (Picatrix)', 'Perfect Nature'],
  },
];

// --- helpers ---------------------------------------------------------------
export const byId = id => REGISTRY.find(e => e.id === id);
export const byBook = book => REGISTRY.filter(e => e.book === book);
export const forPage = page => REGISTRY.filter(e => (e.pages || []).includes(page));
export const callableEntries = () => REGISTRY.filter(e => e.callable);

// A flat list of every {module, exportName} the catalog asserts exists — used
// by the anti-drift test to dynamic-import and verify each one.
export function allExports() {
  const out = [];
  for (const e of REGISTRY) {
    out.push({ module: e.module, exportName: e.exportName, id: e.id });
    for (const ex of (e.exports || [])) out.push({ module: e.module, exportName: ex, id: e.id });
  }
  return out;
}

// Map an input descriptor to a JSON-schema property.
function inputToProp(inp) {
  const t = inp.type === 'enum' ? 'string' : inp.type;
  const p = { type: t === 'object' ? 'object' : t };
  if (inp.values) p.enum = inp.values;
  if (inp.desc) p.description = inp.desc;
  return p;
}

// The callable capabilities as an OpenAI/Ollama-style tool/function schema, for
// the local LLM. `runTool` in core/llm-context.js dispatches these names.
export function toToolSchema() {
  return callableEntries().map(e => {
    const properties = {}, required = [];
    for (const inp of e.inputs) {
      properties[inp.name] = inputToProp(inp);
      if (inp.required) required.push(inp.name);
    }
    return {
      type: 'function',
      function: {
        name: e.exportName,
        description: `${e.title} — ${e.computes}`,
        parameters: { type: 'object', properties, required },
      },
    };
  });
}
