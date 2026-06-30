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
  {
    id: 'mansion-images', title: 'Lunar-mansion talismanic images',
    module: 'assets/js/core/data/mansion-images.js', exportName: 'mansionImage',
    exports: ['mansionImage'],
    computes: 'Reference: the talismanic IMAGE the tradition assigns to each of the 28 lunar mansions (the figure, purpose & material). Surfaced by the Moon’s mansion in the Master Tool’s Picatrix correspondences and on the Mansions page. Historical text only; flagged materials are HISTORICAL-ONLY.',
    inputs: [{ name: 'num', type: 'number', desc: 'mansion number 1–28', required: true }],
    outputShape: '{ num, name, image, purpose, material, citation, note }',
    callable: false,
    book: 'Picatrix', chapter: 'Agrippa II.46 / Picatrix IV.9',
    citation: 'Agrippa, Three Books II.46 (images of the mansions) + Picatrix IV.9, Greer–Warnock.',
    pages: ['pages/picatrix/mansions.html'], howItWorks: 'pages/basics.html#picatrix',
    glossaryTerms: ['Lunar Mansions'],
  },
  {
    id: 'planet-images', title: 'Planetary talismanic images',
    module: 'assets/js/core/data/planet-images.js', exportName: 'planetImage',
    exports: ['planetImage'],
    computes: 'Reference: the talismanic IMAGE the tradition assigns to each of the seven planets (the figure, purpose & material). Surfaced for the ruling planet in the Master Tool’s talisman panel. Historical text only.',
    inputs: [{ name: 'planet', type: 'string', desc: 'one of the 7 planets', required: true }],
    outputShape: '{ image, purpose, material, citation }',
    callable: false,
    book: 'Picatrix', chapter: 'Agrippa II.38–44 / Picatrix II.10 & III',
    citation: 'Agrippa, Three Books II.38–44 (images of the planets) + Picatrix II.10 & III, Greer–Warnock.',
    pages: ['pages/picatrix/correspondences.html'], howItWorks: 'pages/basics.html#picatrix',
    glossaryTerms: ['Planetary Prayer (Picatrix)'],
  },
  {
    id: 'horary-judgement', title: 'House-by-house horary judgement',
    module: 'assets/js/core/horary-judge.js', exportName: 'horaryJudgement',
    exports: ['HORARY_TOPICS'],
    computes: 'For the house a question falls under, identifies the querent & quesited significators and their condition, runs the modes of perfection, reads the Moon as co-significator, brings in the topic’s natural significator, and reduces it to an affirmed / qualified / denied tone with the cited Book II rule (sickness/death/prison read in the inverted sense, contests by the stronger significator).',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'quesitedHouse', type: 'number', desc: 'house 1–12 of the matter', required: true },
    ],
    outputShape: '{ querent, quesited, sharedSignificator, moon, perfection, reception, naturalSignificators, tone, toneText, note, lines }',
    callable: false,
    book: 'Book II', chapter: 'CA Bk II — judged house by house',
    citation: 'Lilly, Christian Astrology Bk II — the house-by-house judgement of a question.',
    pages: ['pages/book2/houses.html', 'pages/book2/examples.html'], howItWorks: HIW('aspects'),
    glossaryTerms: ['Significator', 'Perfection', 'Translation of Light', 'Collection of Light', 'Reception'],
  },
  {
    id: 'worked-charts', title: 'Lilly’s worked charts, read live',
    module: 'assets/js/core/data/worked-charts.js', exportName: 'WORKED_CHARTS',
    computes: 'Lilly’s OWN horary charts (the stolen fish, the ship at sea, the marriage, the lost dog) with their PRINTED positions, fed via chartFromPositions into the engine so the wheel, dignities and house-by-house judgement run beside Lilly’s words and the recorded outcome. Sourced from the 1647 woodcuts with explicit confidence/caveats.',
    inputs: [],
    outputShape: '[{ key, title, figure:{asc,mc,planets[]}, querentHouse, quesitedHouse, question, reasoning, verdict, outcome, sources, caveats }]',
    callable: false,
    book: 'Book II', chapter: 'CA Bk II — the case studies',
    citation: 'Lilly, Christian Astrology Bk II (1647), read from the Internet Archive scans; Frawley, Houlding, Louis.',
    pages: ['pages/book2/examples.html'], howItWorks: HIW('aspects'),
    glossaryTerms: ['Perfection'],
  },
  {
    id: 'chart-from-positions', title: 'Build a chart from printed positions',
    module: 'assets/js/core/chart-from-positions.js', exportName: 'chartFromPositions',
    exports: ['lonFromSignDeg', 'lonFromLabel'],
    computes: 'Builds a castChart-shaped object from a set of PRINTED positions (sign + degree, retrograde, house) rather than from a date & place — so a historical figure (e.g. Lilly’s woodcuts) can be read by the same engine without importing its ephemeris/calendar error. Equal houses from the printed Ascendant unless full cusps are supplied; honest flags returned.',
    inputs: [
      { name: 'spec', type: 'object', desc: '{ asc, mc?, planets:[{name,sign,degree,minute?,retrograde?,house?}], cusps?, isDay? }', required: true },
    ],
    outputShape: '{ asc, mc, cusps, planets, isDay, reconstructed, cuspApprox }',
    callable: false,
    book: 'Book II', chapter: 'reading a printed figure',
    citation: 'A study helper; the figures it reads are cited to their source.',
    pages: ['pages/book2/examples.html'], howItWorks: HIW('aspects'),
    glossaryTerms: [],
  },
  {
    id: 'natal-topics', title: 'Nativity, house by house (Book III topics)',
    module: 'assets/js/core/natal-topics.js', exportName: 'natalTopicReading',
    exports: ['NATAL_TOPICS'],
    computes: 'Reads each of the twelve Book III topics (life & temperament, wealth, siblings, parents & land, children, sickness & servants, marriage, death, religion & travel, honour & profession, friends, enemies) from three testimonies — the house lord’s condition, the natural significator, and the planets in the house — into a favourable / mixed / afflicted tone with the cited rule.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result', required: true },
    ],
    outputShape: '{ topics:[{house,label,tone,lines,cite}], caveat, citation }',
    callable: false,
    book: 'Book III', chapter: 'CA Bk III — the judgement of nativities',
    citation: 'Lilly, Christian Astrology Bk III — the nativity judged house by house.',
    pages: ['pages/book3/master.html'], howItWorks: 'pages/book3/master.html',
    glossaryTerms: ['Lord of the Geniture'],
  },
  {
    id: 'rectification', title: 'Rectification — Animodar & Trutine of Hermes (contested)',
    module: 'assets/js/core/rectification.js', exportName: 'rectify',
    exports: ['animodar', 'trutineOfHermes'],
    computes: 'Two classical, CONTESTED birth-time corrections: Ptolemy’s Animodar (correct an angle’s degree by the almuten of the pre-natal New/Full Moon, then find the clock time that puts it there) and the Trutine of Hermes (check the birth Ascendant against the Moon at an estimated conception, birth − 273 days). Every assumption is returned; no demonstrated validity.',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a natal castChart result (dated & located)', required: true },
    ],
    outputShape: '{ animodar:{ok,syzygy,almuten,correctedAngle,suggestedTime,deltaMinutes,assumptions}, trutine:{ok,agreementDegrees,verdict,assumptions} }',
    callable: false,
    book: 'Book III', chapter: 'CA Bk III — rectification of the figure',
    citation: 'Ptolemy, Tetrabiblos III.2 (Animodar); the Trutina Hermetis; Lilly, Christian Astrology Bk III.',
    pages: ['pages/book3/master.html'], howItWorks: HIW('hyleg'),
    glossaryTerms: ['Rectification', 'Animodar', 'Trutine of Hermes', 'Hyleg (Apheta)', 'Almuten'],
  },
  {
    id: 'lots', title: 'The Hermetic Lots (Arabic Parts)',
    module: 'assets/js/core/lots.js', exportName: 'computeLots',
    exports: ['LOTS', 'lotsByKey'],
    computes: 'The seven Hermetic Lots of the planets (Fortune, Spirit, Eros, Necessity, Courage, Victory, Nemesis — Paulus Alexandrinus) plus the natal topic Lots (Marriage, Children, Father, Mother), each the affine point Asc + A − B, with a sect-aware toggle (Lilly’s both-sects ⊕ by default, Ptolemaic night-reversal when on).',
    inputs: [
      { name: 'chart', type: 'object', desc: 'a castChart result', required: true },
      { name: 'opts', type: 'object', desc: '{ sectAware?: boolean }' },
    ],
    outputShape: '{ sectAware, lots:[{ key, name, planet, lon, label, formula, topic, house }], citation }',
    callable: false,
    book: 'Book I', chapter: 'CA Bk I — the Arabic Parts; Paulus Alexandrinus ch.23',
    citation: 'Paulus Alexandrinus, Introduction ch.23; al-Bīrūnī §476 — the seven Hermetic Lots (formulas vary by author; Paulus shown).',
    pages: ['pages/workbench.html'], howItWorks: HIW('fortune'),
    glossaryTerms: ['Lot / Arabic Part', 'Part of Fortune (⊕)', 'Lot of Spirit', 'Lot of Eros'],
  },
  {
    id: 'personalization', title: 'Tuned to the native (Picatrix III.5–6)',
    module: 'assets/js/core/personalization.js', exportName: 'personalize',
    exports: ['almutenFiguris', 'rulingPlanets', 'PERFECT_NATURE_NAMES'],
    computes: 'How a nativity TUNES Picatrix magic: the almuten figuris (the planet of the Perfect Nature) over the five hylegiacal places, the native’s ruling planets, and a per-aim radix-harmony fit — “suits you” when the aim’s ruling planet is one of yours / a dignified friend, “caution” when it is an afflicted malefic or afflicts your Ascendant lord.',
    inputs: [
      { name: 'birthChart', type: 'object', desc: 'a natal castChart result', required: true },
    ],
    outputShape: '{ almutenFiguris, rulingPlanets, perfectNature, aims:[{ key, label, ruler, fit, reason }] }',
    callable: false,
    book: 'Picatrix III', chapter: 'Picatrix III.5–6 — the dispositor of the nativity & the Perfect Nature',
    citation: 'Picatrix (Ghāyat al-Ḥakīm) III.5 (work the dispositor/almuten of your nativity) & III.6 (the Perfect Nature); almuten figuris after Ibn Ezra / Zoller–Warnock.',
    pages: ['pages/workbench.html'], howItWorks: HIW('dignity'),
    glossaryTerms: ['Almuten Figuris', 'Perfect Nature', 'Sect Light'],
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
