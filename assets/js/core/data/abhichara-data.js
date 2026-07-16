// ============================================================================
//  abhichara-data.js — the cited data for the INDIAN RITUAL-MAGIC wing:
//  abhicāra and the tantric ṣaṭkarman ("the six acts"). This is a catalogue of
//  what the TEXTS CLAIM, presented at the level academic scholarship presents
//  it (Goudriaan, Bühnemann, White, Bloomfield/Whitney, Ullrey) — religious
//  history and belief-system analysis.
//
//  LOCKED HONEST FRAMING: these are historical/religious symbolic systems with
//  NO demonstrated validity. Everything is DESCRIBED, NEVER PRESCRIBED. The
//  māraṇa-class ("slaying") material states only what the texts CLAIM, as
//  history — there are NO operational instructions here: no dosages, no
//  step-by-step rites, no "how to harm". The correspondence tables are
//  catalogued data, exactly like the Picatrix pages elsewhere on this site.
//
//  PROVENANCE DISCIPLINE (project policy): every record carries a `.cite`;
//  genuinely contested values carry BOTH positions and are never silently
//  resolved (⚑). The verified rows below were adversarially re-verified against
//  primary/scholarly sources in full text (Whitney-Lanman HOS 7-8 1905;
//  Bloomfield SBE 42 1897; Caland, Altindisches Zauberritual 1900; Ullrey's
//  UCSB dissertation; Bühnemann's chapter in Tantra in Practice), 2026-07-16.
//
//  FORMER DATA GAP, now CLOSED: the per-act DIRECTION (dik) + presiding DEITY
//  rows (§6, DIRECTIONS_DEITIES) were promoted from candidates to VERIFIED on
//  2026-07-16 after an accuracy-check pass confirmed every row against two
//  independent full-text sources (Bühnemann Tables 26.1-26.2 + Ullrey's
//  Uḍḍīśatantra 1.13-15 translation). See that record's .cite / .sources.
// ============================================================================

// --- shared citation strings -------------------------------------------------
export const BUHNEMANN =
  'Bühnemann, "The Six Rites of Magic", in D.G. White (ed.), Tantra in Practice ' +
  '(Princeton UP 2000), pp. 447-462.';
export const ULLREY =
  'M. Ullrey, "Grim Grimoires: Pragmatic Ritual in the Magic Tantras" (PhD diss., ' +
  'UC Santa Barbara 2016; eScholarship qt4vt6f325).';
export const GOUDRIAAN =
  'Goudriaan, Māyā Divine and Human (Motilal Banarsidass 1978).';
export const WHITNEY =
  'Whitney & Lanman, Atharva-Veda Saṃhitā (Harvard Oriental Series 7-8, 1905; public domain).';
export const BLOOMFIELD =
  'Bloomfield, Hymns of the Atharva-Veda (Sacred Books of the East 42, 1897; public domain).';
export const CALAND =
  'Caland, Altindisches Zauberritual (1900; trans. of Kauśika Sūtra 7-52).';

// ---------------------------------------------------------------------------
//  1. THE SIX ACTS — the canonical ṣaṭkarmāṇi ("six acts / six results").
//     Standard order per Mahīdhara's Mantramahodadhi (MMU 25): appeasement,
//     subjugation, immobilization, enmity, eradication, liquidation. Only
//     śānti (with its sub-aims rakṣā/puṣṭi) is benign; the rest are effectively
//     abhicāra (hostile sorcery). Definitions are Bühnemann's translation of
//     MMU 25.1-3 (verified verbatim, archive.org bk1306 p. 454).
// ---------------------------------------------------------------------------
const SIX_CITE =
  BUHNEMANN + ' pp. 448, 454 (MMU 25.1-3); ' + ULLREY + ' pp. 133-135, 147.';

export const SHATKARMAN = [
  {
    key: 'santi', sanskrit: 'शान्ति', translit: 'śānti / śāntika',
    gloss: 'pacification, appeasement',
    definition: 'Quelling — Bühnemann renders MMU’s definition "the destruction of diseases"; the appeasement of illness, planetary evil and hostile sorcery. It carries the two benign sub-aims rakṣā (protection) and puṣṭi (prosperity / increase).',
    cls: 'benign',
    clsNote: 'The one wholly benign act (with pauṣṭika prosperity-rites); the classical texts group it with the hostile five only formally, as one of the "six".',
    cite: SIX_CITE,
  },
  {
    key: 'vasya', sanskrit: 'वशीकरण', translit: 'vaśīkaraṇa / vaśya',
    gloss: 'subjugation, bringing-under-the-will',
    definition: 'Bringing a person, animal or deity under one’s control. Bühnemann’s MMU gloss is stark: "the state of one who executes a command… especially seducing a woman against her will" — the erotic-domination sense is explicit in the text.',
    cls: 'hostile',
    clsNote: 'Abhicāra-adjacent: coercive, and singled out by the sources as the one act performed with the LEFT (vāma) hand (per the Bhairavapadmāvatīkalpa commentary).',
    cite: SIX_CITE,
  },
  {
    key: 'stambhana', sanskrit: 'स्तम्भन', translit: 'stambhana',
    gloss: 'immobilization, paralysis, arrest',
    definition: 'Bühnemann’s MMU gloss: "the obstructing of an activity." To paralyse or arrest — armies, weapons, speech, water, bodily functions, a rival’s mind.',
    cls: 'hostile', clsNote: 'A hostile act; grouped with māraṇa by Bühnemann as suited to the dark (kṛṣṇa) half of the lunar month.',
    cite: SIX_CITE,
  },
  {
    key: 'vidvesana', sanskrit: 'विद्वेषण', translit: 'vidveṣaṇa / vidveṣa',
    gloss: 'causing discord, sowing enmity',
    definition: 'Bühnemann’s MMU gloss: "dislike between two affectionate people." To break alliances and sow enmity between allies, friends or spouses (prīti-nāśana, "destruction of affection").',
    cls: 'hostile', clsNote: 'Hostile sorcery.',
    cite: SIX_CITE,
  },
  {
    key: 'uccatana', sanskrit: 'उच्चाटन', translit: 'uccāṭana',
    gloss: 'eradication, driving-away',
    definition: 'Bühnemann’s MMU gloss: "deprivation from a place." To force a target out of home, family, office or kingdom — to make them wander.',
    cls: 'hostile', clsNote: 'Hostile sorcery.',
    cite: SIX_CITE,
  },
  {
    key: 'marana', sanskrit: 'मारण', translit: 'māraṇa',
    gloss: 'slaying (rendered "liquidation")',
    definition: 'Bühnemann’s MMU gloss: "the taking of life." Goudriaan and Bühnemann render it "liquidation"; Ullrey keeps "murder" — a live scholarly dispute (⚑). This entry records ONLY what the texts CLAIM and their symbolic correspondences, presented as religious history — never any procedure that could function as an instruction.',
    cls: 'marana',
    clsNote: 'The māraṇa-class act. Bühnemann: "a rite such as liquidation should be mainly connected with the dark half" of the lunar month — "a dark rite during dark nights." Handled here strictly as a textual claim.',
    contested: {
      flag: 'Translation disputed:',
      positions: [
        { source: 'Bühnemann / Goudriaan', value: '"liquidation"' },
        { source: 'Ullrey', value: '"murder"' },
      ],
    },
    cite: SIX_CITE,
  },
];

// ---------------------------------------------------------------------------
//  2. LIST VARIANTS — the count is always called "six" but the actual lists
//     differ text to text. Systematic, and never silently resolved.
// ---------------------------------------------------------------------------
export const LIST_VARIANTS = [
  {
    label: 'The canonical six (Mahīdhara, MMU 25)',
    items: ['śānti', 'vaśīkaraṇa', 'stambhana', 'vidveṣaṇa', 'uccāṭana', 'māraṇa'],
    note: 'The standard order: appeasement, subjugation, immobilization, enmity, eradication, liquidation. This is the list the timing screen uses.',
    cite: BUHNEMANN + ' p. 454 (MMU 25).',
  },
  {
    label: 'Sivadatta’s Uḍḍīśatantra — index verse (six) vs body (seven)',
    items: ['śānti', 'vaśya', 'stambhana', 'vidveṣa', 'uccāṭana', 'māraṇa'],
    bodyItems: ['māraṇa', 'mohana', 'stambhana', 'vidveṣaṇa', 'uccāṭana', 'vaśīkaraṇa', 'ākarṣaṇa'],
    note: 'The index verse (U 1.16, "śāntivaśyastambhāni vidveṣoccāṭane tathā / māraṇāntāni ṣaṭsanti ṣaṭkarmāṇi") lists SIX, but the text body then treats SEVEN in a different order — with killing FIRST and śānti absent (māraṇa, mohana "bewildering", stambhana, vidveṣaṇa, uccāṭana, vaśīkaraṇa, ākarṣaṇa "attraction"). "Index verses differing from the actual contents is common, if not universal, in the magic tantras" (Ullrey p. 146).',
    cite: ULLREY + ' pp. 146-147 nn. 22, 98.',
  },
  {
    label: 'The eight-fold set (Tripathī’s Uḍḍīśatantra body)',
    items: ['pacification', 'subjugation', 'immobilization', 'mohana (bewildering)', 'dissent', 'eradication', 'ākarṣaṇa (attraction)', 'murder'],
    note: 'The six + ākarṣaṇa (attraction/summoning) + mohana (deluding/bewildering). Tripathī’s introduction still calls the group ṣaṭkarmāṇi ("six") and writes a six-item index verse.',
    cite: ULLREY + ' p. 183 n. 95.',
  },
  {
    label: 'The Tantrasārasaṃgraha seven-fold abhicāra set',
    items: ['stambha', 'vidveṣa', 'uccāṭa', 'māraṇa', 'bhrānti / bhrama (confusion, madness)', 'utsādana (destruction)', 'roga / vyādhi (illness, esp. fever)'],
    note: 'A HOSTILE-ONLY list (cf. Agni-Purāṇa 306.1 and the Mantrapāda). CORRECTION applied: the "destruction" term is utsādana (not vidhvaṃsana), and the list includes bhrānti; it is not "the six + two".',
    cite: 'wisdomlib.org, "abhicāra" (Tantrasārasaṃgraha list, cf. Agni-Purāṇa 306.1).',
  },
];

// ---------------------------------------------------------------------------
//  3. THE APPARATUS SCHEMA — Mahīdhara’s "nineteen items" (MMU 25.4-5): the
//     variables a practitioner is told to match to the rite. This 19-slot table
//     IS the classical framework the timing screen samples from (it computes
//     only the calendar/direction slots: season, day, fortnight, direction).
// ---------------------------------------------------------------------------
export const APPARATUS_SCHEMA = {
  cite: BUHNEMANN + ' pp. 448, 454-455 (MMU 25.4-5, "nineteen items"; explained in vv. 6-65ab); ' + ULLREY + ' pp. 135-136.',
  note: '"Nineteen items" is Bühnemann’s bracketed phrase — the Sanskrit lists the variables without a numeral term. Bühnemann’s translation reads "the rising of the element" (singular).',
  items: [
    { n: 1, sanskrit: 'देवता', translit: 'devatā', gloss: 'the presiding deity of the rite' },
    { n: 2, sanskrit: 'वर्ण', translit: 'varṇa (devatā)', gloss: 'the deity’s colour' },
    { n: 3, sanskrit: 'ऋतु', translit: 'ṛtu', gloss: 'the season' },
    { n: 4, sanskrit: 'दिक्', translit: 'dik', gloss: 'the direction faced' },
    { n: 5, sanskrit: 'वार', translit: 'vāra / dina', gloss: 'the day (weekday)' },
    { n: 6, sanskrit: 'आसन', translit: 'āsana', gloss: 'the posture / seat (and its mat)' },
    { n: 7, sanskrit: 'ग्रन्थन', translit: 'granthana &c.', gloss: 'the arrangement of the mantra-syllables' },
    { n: 8, sanskrit: 'यन्त्र', translit: 'yantra / maṇḍala', gloss: 'the symbolic shape' },
    { n: 9, sanskrit: 'मुद्रा', translit: 'mudrā', gloss: 'the hand-gesture' },
    { n: 10, sanskrit: 'बीज', translit: 'bīja / varṇa', gloss: 'the seed-syllables / letters' },
    { n: 11, sanskrit: 'तत्त्व', translit: 'tattva', gloss: 'the rise of the element (svarodaya)' },
    { n: 12, sanskrit: 'समिध्', translit: 'samidh', gloss: 'the fire-sticks (fuel wood)' },
    { n: 13, sanskrit: 'माला', translit: 'mālā', gloss: 'the rosary (bead material)' },
    { n: 14, sanskrit: 'अग्नि', translit: 'agni / vahni', gloss: 'the fire' },
    { n: 15, sanskrit: 'लेखनद्रव्य', translit: 'lekhana-dravya', gloss: 'the material for writing' },
    { n: 16, sanskrit: 'कुण्ड', translit: 'kuṇḍa', gloss: 'the fire-pit' },
    { n: 17, sanskrit: 'स्रुव', translit: 'sruva', gloss: 'the small wooden ladle' },
    { n: 18, sanskrit: 'स्रुच्', translit: 'sruc', gloss: 'the large ladle' },
    { n: 19, sanskrit: 'लेखनी', translit: 'lekhanī', gloss: 'the stylus' },
  ],
};

// ---------------------------------------------------------------------------
//  4. THE ṚTU FRAMEWORK — the calendar season (each ṛtu = two solar months).
//     CONVENTION (documented): the six ṛtus each span two solar months (rāśis);
//     the Sun’s SIDEREAL rāśi (Lahiri ayanāṁśa, from castVedic) fixes the
//     season. This site uses the common pañcāṅga solar-ṛtu pairing that begins
//     Vasanta at Mīna–Meṣa (Pisces–Aries). A second common convention pairs
//     each ṛtu one sign later (Vasanta = Meṣa–Vṛṣabha …); the two disagree at
//     every rāśi boundary — flagged, never resolved.
// ---------------------------------------------------------------------------
export const RITU_SOURCE =
  'Solar-ṛtu convention: each ṛtu = two solar months (rāśis); season fixed by the Sun’s sidereal ' +
  'rāśi (Lahiri, via castVedic). Pairing used here begins Vasanta at Mīna–Meṣa (cf. Sūrya-Siddhānta 14.10; ' +
  'drikpanchang solar-ṛtu). A second convention starts Vasanta at Meṣa–Vṛṣabha — the two disagree at every ' +
  'rāśi boundary (⚑ contested, not resolved).';

export const RITU = [
  { key: 'vasanta', sanskrit: 'वसन्त', translit: 'vasanta', gloss: 'spring', rashis: ['Mīna', 'Meṣa'], act: 'vasya' },
  { key: 'grisma', sanskrit: 'ग्रीष्म', translit: 'grīṣma', gloss: 'summer', rashis: ['Vṛṣabha', 'Mithuna'], act: 'vidvesana' },
  { key: 'varsa', sanskrit: 'वर्षा', translit: 'varṣā / prāvṛṭ', gloss: 'the rains, monsoon', rashis: ['Karka', 'Siṃha'], act: 'uccatana' },
  { key: 'sarad', sanskrit: 'शरद्', translit: 'śarad', gloss: 'autumn', rashis: ['Kanyā', 'Tulā'], act: 'marana' },
  { key: 'hemanta', sanskrit: 'हेमन्त', translit: 'hemanta', gloss: 'winter, the cold', rashis: ['Vṛścika', 'Dhanu'], act: 'santi' },
  { key: 'sisira', sanskrit: 'शिशिर', translit: 'śiśira', gloss: 'the cool season, late winter', rashis: ['Makara', 'Kumbha'], act: 'stambhana' },
];

// rāśi index (0=Meṣa … 11=Mīna) → ṛtu key (the Vasanta-at-Mīna convention)
export const RITU_BY_RASHI = [
  'vasanta',  // 0 Meṣa
  'grisma',   // 1 Vṛṣabha
  'grisma',   // 2 Mithuna
  'varsa',    // 3 Karka
  'varsa',    // 4 Siṃha
  'sarad',    // 5 Kanyā
  'sarad',    // 6 Tulā
  'hemanta',  // 7 Vṛścika
  'hemanta',  // 8 Dhanu
  'sisira',   // 9 Makara
  'sisira',   // 10 Kumbha
  'vasanta',  // 11 Mīna
];

// ---------------------------------------------------------------------------
//  5. CORRESPONDENCES — the verified tables, one field at a time.
// ---------------------------------------------------------------------------

// season → act (Table C). VERIFIED: Uḍḍīśatantra 1.16-17 AND, independently,
// Mantramahodadhi 25.7cd-9ab — a genuine cross-text agreement.
const SEASON_ACT = { hemanta: 'santi', vasanta: 'vasya', sisira: 'stambhana', grisma: 'vidvesana', varsa: 'uccatana', sarad: 'marana' };

// The ghaṭikā-cycle (scheme A): from sunrise, the day-night cycle is divided
// into blocks of TEN ghaṭikās (24-min units) = six 4-hour season-blocks, which
// cycle the six seasons in order spring→summer→rains→fall→cold→cool.
// (CORRECTION applied: ten ghaṭikās PER season-block, not "six ghaṭikā-units".)
export const GHATIKA_CYCLE = {
  order: ['vasanta', 'grisma', 'varsa', 'sarad', 'hemanta', 'sisira'],
  unitMinutes: 24,          // one ghaṭikā
  ghatikasPerBlock: 10,     // ten ghaṭikās = 240 min = 4 hours
  seasonAct: SEASON_ACT,
  cite: 'Uḍḍīśatantra 1.16-17 ("sūryodayāt samārabhya ghaṭikādaśakaṃ kramāt … hemantaḥ śāntake prokto vasanto vaśyakarmaṇi / śiśiraḥ stambhane jñeyo grīṣme vidveṣa īritaḥ / prāvṛḍuccāṭane jñeyā śaranmāraṇakarmaṇi"), ' + ULLREY + ' pp. 161-162 n. 36; cross-confirmed at ' + BUHNEMANN + ' pp. 449, 455 (MMU 25).',
};

// The day-part schemes (scheme B). Two variants — flagged, never merged.
// (CORRECTION applied: the six-part day scheme with the left-hand rule is the
// Bhairavapadmāvatīkalpa (BPK 3.6-7 + Bandhuṣeṇa comm.), NOT the Uḍḍīśatantra.
// The Uḍḍīśatantra’s own internal conflict is the four-part U 1.28.)
export const DAY_PARTS = {
  // BPK 3.6-7: six day-parts, in clock order from sunrise, each paired with a
  // season and an act. Its own season pairings differ from Table C.
  bpk: {
    label: 'Bhairavapadmāvatīkalpa 3.6-7 (+ Bandhuṣeṇa commentary)',
    parts: [
      { key: 'purvahna', translit: 'pūrvāhṇa', gloss: 'forenoon', arc: 'day-1st-third', season: 'vasanta', acts: ['vasya', 'akarsana', 'stambhana'] },
      { key: 'madhyahna', translit: 'madhyāhna', gloss: 'midday', arc: 'day-2nd-third', season: 'grisma', acts: ['vidvesana'] },
      { key: 'parahna', translit: 'parāhṇa', gloss: 'afternoon', arc: 'day-3rd-third', season: 'varsa', acts: ['uccatana'] },
      { key: 'sandhya', translit: 'sandhyā', gloss: 'twilight (dusk)', arc: 'night-1st-third', season: 'sarad', acts: ['nisedha'] },
      { key: 'ardharatra', translit: 'ardharātra', gloss: 'midnight', arc: 'night-2nd-third', season: 'hemanta', acts: ['santi'] },
      { key: 'prabhata', translit: 'prabhāta', gloss: 'dawn', arc: 'night-3rd-third', season: 'sisira', acts: ['paustika'] },
    ],
    cite: ULLREY + ' pp. 160-161 nn. 36-37 (BPK 3.6-7, "pūrvāhṇe vaśyakarmāṇi … / śāntikarmārdharātre ca prabhāte pauṣṭikaṃ tathā").',
  },
  // U 1.28: the true intra-Uḍḍīśatantra conflict — only FOUR day-times, with
  // MURDER at twilight (not autumn / the dark fortnight of U 1.17).
  u128: {
    label: 'Uḍḍīśatantra 1.28 (the intra-corpus variant)',
    parts: [
      { key: 'purve-ahni', translit: 'pūrve’hni', gloss: 'forenoon', acts: ['vasya'] },
      { key: 'madhyahna', translit: 'madhyāhna', gloss: 'midday', acts: ['vidvesana', 'uccatana'] },
      { key: 'dinasyante', translit: 'dinasyānte', gloss: 'day’s end', acts: ['santi', 'pusti'] },
      { key: 'sandhya', translit: 'sandhyākāla', gloss: 'twilight', acts: ['marana'] },
    ],
    cite: ULLREY + ' p. 161 n. 35 (U 1.28, "vaśyaṃ pūrve ’hni madhyāhne vidveṣoccāṭane tathā / śāntipuṣṭī dinasyānte sandhyākāleṣu māraṇam").',
  },
  // the two schemes disagree; U 1.17 disagrees with both.
  conflict: true,
  conflictNote: 'The texts disagree with themselves and each other on WHEN. Uḍḍīśatantra 1.17 puts māraṇa in autumn (śarad) and the dark fortnight; Uḍḍīśatantra 1.28 puts murder at TWILIGHT; the Bhairavapadmāvatīkalpa 3.6-7 puts śānti at MIDNIGHT (where U 1.17’s cycle would place māraṇa). Presented side by side as the tradition’s own contradiction — never resolved.',
};

export const CORRESPONDENCES = {
  seasons: {
    schemeA: {
      label: 'Season of the act (Uḍḍīśatantra 1.16-17; MMU 25)',
      map: SEASON_ACT,
      cite: GHATIKA_CYCLE.cite,
    },
    schemeB: DAY_PARTS,
    conflict: true,
    cites: [GHATIKA_CYCLE.cite, DAY_PARTS.bpk.cite, DAY_PARTS.u128.cite],
  },

  // Colour of the act (mat/deity colour). CORRECTION: the source is BPK 3.9 +
  // Bandhuṣeṇa’s commentary (NOT an "Uḍḍīśatantra commentary"); ākṛṣṭi’s
  // colour is udayārka ("rising-sun"), not gold/pīta. A DIFFERENT MMU 25 goddess
  // colour-scheme is flagged below (contested), not merged.
  colors: {
    byAct: {
      santi: 'white (śaśadhara / candrakānta, moon-white) — śānti & pauṣṭi',
      vasya: 'red (rakta, the japā flower)',
      akarsana: 'udayārka — the rising-sun / dawn colour',
      stambhana: 'yellow (haridrā, turmeric)',
      vidvesana: 'smoke-grey (dhūma)',
      uccatana: 'smoke-grey (dhūma)',
      marana: 'black (asita) — the niṣedha / māraṇa class',
    },
    root: '"daṇḍasvastikapaṅkajakukkuṭakuliśoccabhadrapīṭhāni / udayārka-rakta-śaśadhara-dhūma-haridrā-asitāḥ varṇāḥ" (BPK 3.9)',
    contested: {
      flag: 'A rival colour-scheme in the Mantramahodadhi (goddess-tied), not merged:',
      positions: [
        { source: 'BPK 3.9 + comm.', value: 'white · red · (dawn) · yellow · smoke-grey · smoke-grey · black' },
        { source: 'MMU 25.6-7ab (Bühnemann Table 26.1)', value: 'śānti white, vaśya red, stambhana yellow, vidveṣa variegated (citra), uccāṭana dark, māraṇa gray' },
      ],
    },
    cite: ULLREY + ' pp. 166, 374 nn. 51-52, 168 (BPK 3.9 + Bandhuṣeṇa comm.); ' + BUHNEMANN + ' p. 448 (MMU 25, Table 26.1).',
  },

  // The mat-symbols (āsana marks) — TWO text traditions, kept separate.
  mats: {
    uddisha: {
      label: 'Uḍḍīśatantra 1.70-72 (āsana marks)',
      byAct: {
        santi: 'svastika',
        pusti: 'lotus (padma)',
        akarsana: 'rooster / wild-cock (kukkuṭa)',
        vidvesana: 'rooster / wild-cock (kukkuṭa)',
        uccatana: 'half-svastika (ardha-svastika)',
        stambhana: 'no mark (vikaṭa)',
        marana: 'no mark (vikaṭa)',
        vasya: 'lamp (bhadrāsana, the "shining lamp")',
      },
      variant: 'U 1.73-74 gives a separate ANIMAL-HIDE mat set: sheep→vaśya, tiger→ākṛṣṭi, buffalo→uccāṭana, horse→vidveṣa, buffalo-leather→māraṇa, elephant→mokṣa, red wool→all — a further variant, flagged.',
      cite: ULLREY + ' pp. 165-166 n. 48 (U 1.70-74).',
    },
    bhairavapadmavati: {
      label: 'Bhairavapadmāvatīkalpa 3.9 (+ Bandhuṣeṇa comm.)',
      byAct: {
        akarsana: 'staff (daṇḍa)',
        vasya: 'svastika',
        santi: 'lotus (paṅkaja) — śānti & puṣṭi',
        pusti: 'lotus (paṅkaja)',
        vidvesana: 'wild-cock (kukkuṭa)',
        uccatana: 'wild-cock (kukkuṭa)',
        stambhana: 'axe / thunderbolt (kuliśa, vajrāsana)',
        nisedha: 'bright bhadra-pīṭha lamp (ucca-bhadra-pīṭha)',
      },
      cite: ULLREY + ' p. 166 nn. 51-53 (BPK 3.9 + comm.).',
    },
  },

  // The gesture (mudrā) shapes — Uḍḍīśatantra 1.75, in śānti→māraṇa order.
  mudras: {
    label: 'Uḍḍīśatantra 1.75 (ṣaṇ-mudrāḥ, in śānti→māraṇa order)',
    byAct: {
      santi: 'lotus (padma) — "tranquilizing"',
      vasya: 'noose (pāśa) — "subjugating"',
      stambhana: 'club (gadā) — "immobilizing"',
      vidvesana: 'pestle (musala) — "dissent"',
      uccatana: 'arrowhead / lightning-bolt (aśani, vajra) — "eradication"',
      marana: 'sword (khaḍga) — "murder"',
    },
    variant: 'The BPK’s parallel mudrā set (hook, lotus, blossom, sprout, conch, vajra — BPK 3.8) differs and is NOT merged here.',
    cite: ULLREY + ' pp. 166-167 n. 49 (U 1.75, "padmapāśagadāhvayāḥ / musalāśanikhaḍgākhyāḥ").',
  },

  // The rosary (mālā) bead materials — Uḍḍīśatantra 1.103-107.
  rosaries: {
    label: 'Uḍḍīśatantra 1.103-107 (bead material)',
    byAct: {
      vasya: 'coral (pravāla) or diamond (vajra-maṇi)',
      pusti: 'coral (pravāla) or diamond',
      akarsana: 'elephant-tooth (matta-ibha-danta)',
      vidvesana: 'horse-tooth (turaga-daśana), strung on a thread of the victim’s hair',
      uccatana: 'horse-tooth (turaga-daśana), strung on a thread of the victim’s hair',
      marana: 'ass-tooth (gardabha) — or a dead man’s tooth from an empty battlefield',
    },
    other: [
      { for: 'dharma / kāma / artha', bead: 'shell (śaṅkha)' },
      { for: 'all kāma & artha', bead: 'lotus-seed (padma-bīja)' },
      { for: 'all results', bead: 'rudrākṣa' },
      { for: 'learning (sārasvata)', bead: 'crystal / pearl / rudrākṣa / coral / putrajīvan' },
    ],
    cite: ULLREY + ' pp. 162-163 n. 38 (U 1.103-107).',
  },

  // The finger-combinations — Uḍḍīśatantra 1.112-113.
  fingers: {
    label: 'Uḍḍīśatantra 1.112-113 (thumb + finger)',
    byAct: {
      santi: 'thumb-tip (vṛddhāṅgra) — with stambhana & vaśya',
      pusti: 'thumb-tip (vṛddhāṅgra)',
      stambhana: 'thumb-tip (vṛddhāṅgra)',
      vasya: 'thumb-tip (vṛddhāṅgra)',
      akarsana: 'thumb + ring finger (aṅguṣṭha + anāmikā)',
      vidvesana: 'thumb + index (aṅguṣṭha + tarjanī)',
      uccatana: 'thumb + index (aṅguṣṭha + tarjanī)',
      marana: 'thumb + little finger (aṅguṣṭha + kaniṣṭhā)',
    },
    cite: ULLREY + ' pp. 162-163 n. 40 (U 1.112-113).',
  },

  // The hand rule — BPK 3.7 + commentary. Kept with its caveat.
  handRule: {
    rule: 'All acts use the RIGHT hand except vaśya (subjugation), which uses the LEFT.',
    caveat: 'The rule as usually stated depends on the commentary’s inverted gloss: the root verse says the other acts use the "savya" hand (savya normally = LEFT), but Bandhuṣeṇa’s commentary glosses savya as dakṣiṇa ("right") and assigns vaśya to the vāma (left) hand.',
    root: '"vaśyaṃ muktvānyakarmāṇi savyahastena yojayet" (BPK); comm. "‘savyahastena’ dakṣiṇahastena … vaśyakarmaiva vāmahastena yojayed ity arthaḥ"',
    cite: ULLREY + ' p. 161 nn. 36-37 (BPK 3.7 + Bandhuṣeṇa comm.).',
  },

  // The lunar fortnight (paksha).
  fortnight: {
    rule: 'māraṇa (with stambhana) belongs to the DARK (kṛṣṇa) half of the lunar month — "a rite such as liquidation should be mainly connected with the dark half" (Bühnemann): a dark rite during dark nights, on the 8th/14th of the dark fortnight and the new moon. The benign śānti/pauṣṭika rites take the bright (śukla) half.',
    darkActs: ['marana', 'stambhana'],
    brightActs: ['santi'],
    note: 'Cow-hide mats are prescribed for the benign appeasement rites (MMU Table 26.4).',
    cite: BUHNEMANN + ' p. 449 (MMU 25, Tables 26.3-26.4); ' + ULLREY + ' p. 135.',
  },
};

// ---------------------------------------------------------------------------
//  6. DIRECTIONS & PRESIDING DEITIES — PROMOTED TO VERIFIED (2026-07-16).
//     Formerly the one open data gap (candidates only). An accuracy-check pass
//     confirmed EVERY row — both act→direction AND act→deity — verbatim against
//     TWO INDEPENDENT authoritative FULL-TEXT sources:
//       (1) Bühnemann, "The Six Rites of Magic", Tantra in Practice pp. 448-449,
//           Table 26.1 (Rites by Goddess & Colour) + Table 26.2 (Rites by Season
//           & Direction) — the Mantramahodadhi 25 scheme; with the explicit prose
//           "Omitting south and west, the two remaining cardinal and the four
//           intermediate directions are of significance" (p. 449);
//       (2) Ullrey, Grim Grimoires — an INDEPENDENT translation of a DIFFERENT
//           base text, the Uḍḍīśatantra 1.13-15 (diss. appendix pp. 649-650),
//           giving the identical act→direction and act→deity mapping.
//     The colour + season columns were confirmed in the same Bühnemann tables as
//     a bonus. Shape kept backward-compatible: `candidates` is retained unchanged;
//     `value` now carries the verified rows and `verified:true` is set.
// ---------------------------------------------------------------------------
const DIR_DEI_ROWS = [
  { act: 'santi', deity: 'Rati', direction: 'northeast', color: 'white', season: 'hemanta (winter)', verified: true },
  { act: 'vasya', deity: 'Vāṇī (Sarasvatī)', direction: 'north', color: 'red', season: 'vasanta (spring)', verified: true },
  { act: 'stambhana', deity: 'Ramā', direction: 'east', color: 'yellow', season: 'śiśira (cool)', verified: true },
  { act: 'vidvesana', deity: 'Jyeṣṭhā', direction: 'southwest', color: 'variegated (citra)', season: 'grīṣma (summer)', verified: true },
  { act: 'uccatana', deity: 'Durgā', direction: 'northwest', color: 'dark', season: 'varṣā (rains)', verified: true },
  { act: 'marana', deity: 'Kālī', direction: 'southeast', color: 'gray', season: 'śarad (autumn)', verified: true },
];

export const DIRECTIONS_DEITIES = {
  verified: true,
  status: 'verified — every row (act→direction AND act→deity) confirmed verbatim against two independent authoritative full-text sources (2026-07-16): Bühnemann, Tantra in Practice pp. 448-449 (MMU 25, Tables 26.1-26.2), AND Ullrey\'s translation of the Uḍḍīśatantra 1.13-15 (a different base text). See .cite / .sources.',
  value: DIR_DEI_ROWS,
  note: 'The per-act direction (dik) and presiding-deity rows of the Mantramahodadhi 25 / Śāradātilaka 23 six-rites chart. In the six-direction scheme SOUTH and WEST are omitted — "the two remaining cardinal and the four intermediate directions are of significance" (Bühnemann p. 449); the Uḍḍīśatantra 1.15 Sanskrit names only five (NE, N, SW, NW, SE) and its Hindi commentary supplies the sixth (East). This is the direction the practitioner FACES during the rite (MMU 25.9cd-10ab / U 1.15); it is DISTINCT from the FIRE-PIT orientation (MMU 25.60-61ab / U 1.82-83, 1.118), which Bühnemann notes differs for two rites (appeasement and liquidation). The deity-colour pairing is the MMU 25 goddess scheme, matching the contested MMU colours recorded under CORRESPONDENCES.colors above (do not merge with the BPK colours).',
  sources: [
    { source: 'Bühnemann, Tantra in Practice pp. 448-449 (MMU 25.6-10ab; Table 26.1 goddess+colour, Table 26.2 season+direction)', agrees: true },
    { source: 'Ullrey, Grim Grimoires — Uḍḍīśatantra 1.13-15 (diss. appendix pp. 649-650)', agrees: true },
  ],
  // `candidates` retained verbatim for backward-compatibility (== the promoted rows).
  candidates: [
    { act: 'santi', deity: 'Rati', direction: 'northeast', color: 'white', season: 'hemanta (winter)' },
    { act: 'vasya', deity: 'Vāṇī (Sarasvatī)', direction: 'north', color: 'red', season: 'vasanta (spring)' },
    { act: 'stambhana', deity: 'Ramā', direction: 'east', color: 'yellow', season: 'śiśira (cool)' },
    { act: 'vidvesana', deity: 'Jyeṣṭhā', direction: 'southwest', color: 'variegated (citra)', season: 'grīṣma (summer)' },
    { act: 'uccatana', deity: 'Durgā', direction: 'northwest', color: 'dark', season: 'varṣā (rains)' },
    { act: 'marana', deity: 'Kālī', direction: 'southeast', color: 'gray', season: 'śarad (autumn)' },
  ],
  cite: BUHNEMANN + ' pp. 448-449 (MMU 25.6-10ab, Tables 26.1 & 26.2; "Omitting south and west, the two remaining cardinal and the four intermediate directions are of significance", p. 449); cross-confirmed by ' + ULLREY + ' Uḍḍīśatantra 1.13-15 — a DIFFERENT base text (deities rati/vāṇī/ramā/jyeṣṭhā/durgā/kālī at 1.14; directions śānti-NE, vaśya-N, stambhana-E, vidveṣaṇa-SW, uccāṭana-NW, māraṇa-SE at 1.15 + commentary). Both independent sources give the identical act→direction and act→deity mapping; five of the six goddess-names are verbatim-identical, and Bühnemann\'s Table 26.1 confirms the vaśya goddess as Vāṇī/Sarasvatī. Verified verbatim 2026-07-16.',
};

// ---------------------------------------------------------------------------
//  7. THE ETHICAL FRAME the tradition itself applied — presented on both sides.
// ---------------------------------------------------------------------------
export const ETHICS = [
  {
    key: 'kamya',
    heading: 'The ṣaṭkarman are kāmya (optional, desire-driven) rites',
    body: 'In the nitya / naimittika / kāmya schema, only one already qualified in the daily (nitya) and occasional (naimittika) pūjā is eligible to perform the kāmya rites — and the ṣaṭkarman are kāmya. They are optional and desire-oriented, not obligatory worship; the tradition gates who may attempt them at all.',
    cite: 'Gupta, in Hindu Tantrism (Brill 1979) pp. 124-126, via ' + ULLREY + ' pp. 139-140.',
  },
  {
    key: 'expiation',
    heading: 'A built-in expiation (prāyaścitta) layer',
    body: 'Mahīdhara says he described the desire-oriented rites "only for the sake of persons who are attracted to sense pleasures" (MMU 25.72-76ab), and that feeding brahmans after the fire-ritual "destroy[s] the sin that accrues from the performance of destructive magic" (MMU 25.49cd-55ab). CORRECTION: the often-repeated "kill only the wicked, not from jealousy" regulation is reported by Ullrey as UNCITED in the tradition itself and is not in Bühnemann’s chapter — it would need Goudriaan in print to verify; treated here as reported-by-Ullrey, uncertain.',
    cite: BUHNEMANN + ' pp. 452-453 (MMU 25.49-55, 72-76); ' + ULLREY + ' p. 135 n. 53.',
  },
  {
    key: 'vedic-prayascitta',
    heading: 'The Vedic post-abhicāra purification',
    body: 'The oldest layer already carries an expiation: the practitioner washes and rubs the whole body while reciting Atharvaveda 16.2 (Kauśika Sūtra 49.27, the closing sūtra of the witchcraft section 47.1-49.27) "for removing all sins committed during the performance of the ritual, and for securing peace" — though Whitney frames AV 16 rather as duḥsvapnanāśana, evil-dream-dispelling.',
    cite: CALAND + ' p. 173 (Kauś. 49.27); ' + WHITNEY + ' vol. 2 (AV 16.2).',
  },
  {
    key: 'caveat',
    heading: 'The honest caveat (Ullrey’s critique)',
    body: 'The ethical frame is real but PARTIAL. The Uḍḍīśa corpus rarely regulates itself outside the commentaries; and some rites state the motive nakedly — the desire to usurp a victim’s wife, children and wealth. The restraints belong mostly to the systematizing commentators, not to the grimoire body.',
    cite: ULLREY + ' p. 135 n. 53.',
  },
];

// ---------------------------------------------------------------------------
//  8. THE ATHARVAN LAYER — the abhicāra hymn corpus and its counter-charms,
//     with public-domain (Bloomfield / Whitney) references and the Kauśika
//     Sūtra ritual applications. Short PD titles/notes quoted where verified.
//     A NUMBERING note: Book-7 rows use Whitney/Bloomfield numbering (the
//     vulgate renumbers); "AV 7.72" as sometimes printed matches nothing.
// ---------------------------------------------------------------------------
export const ATHARVAN = {
  hostile: [
    { ref: 'AV 3.6', purpose: 'aśvattha-amulet to destroy an enemy', ks: 'Kauś. 48.3-6', pdQuote: '"Against enemies: with açvattha" (Whitney)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 48.3-6).' },
    { ref: 'AV 4.16', purpose: 'Varuṇa’s fetters bind foes; used against "an enemy who comes cursing"', ks: 'Kauś. 48.7', pdQuote: '"The power of the gods" (Whitney) / "Prayer to Varuṇa…" (SBE 42)', cite: WHITNEY + '; ' + BLOOMFIELD + '; ' + CALAND + ' (Kauś. 48.7).' },
    { ref: 'AV 5.3', purpose: 'destroy an enemy by witchcraft', ks: 'Kauś. 49.15', pdQuote: 'note "in a witchcraft process (49.15) against an enemy" (Whitney)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 49.15).' },
    { ref: 'AV 6.54 + 7.70', purpose: 'frustrate / spoil a rival’s sacrifice and glory (perdition, nirṛti, invoked)', ks: 'Kauś. 48.27-28', pdQuote: '"to spoil an enemy’s sacred rites" (Whitney, on 7.70)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 48.27-28). CORRECTION: 48.27 for the assignment, 48.28 continues.' },
    { ref: 'AV 6.75', purpose: 'expel / eject a rival (nairbādhya)', ks: 'Kauś. 47.10', pdQuote: '"To eject a rival" (Whitney)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 47.10).' },
    { ref: 'AV 6.133-135', purpose: 'empower the sorcerer’s girdle/kṛtyā; smite; crush an enemy', ks: 'Kauś. 47.13-20', pdQuote: '"To crush an enemy with a thunderbolt" (Whitney, 6.134)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 47.13-20). CORRECTION: girdle-rite begins 47.13; the "slay a rival king" gloss is an embellishment — Whitney’s title is simply "To crush an enemy".' },
    { ref: 'AV 6.138', purpose: 'render a man impotent', ks: 'Kauś. 48.32', pdQuote: '"To make a certain man impotent" (Whitney)', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 48.32).' },
    { ref: 'AV 7.31 (+7.34, 7.108)', purpose: 'witchcraft against enemies, laying on fuel from a lightning-struck tree', ks: 'Kauś. 48.37', pdQuote: '"To Indra: for aid" (Whitney 31(32))', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 48.37). NUMBERING: Whitney/Bloomfield scheme (vulgate renumbers to 7.32 etc.).' },
    { ref: 'AV 7.95', purpose: 'a binding spell (tying up a striped frog)', ks: 'Kauś. 48.40', pdQuote: '"A spell against some one" (Whitney 95(100))', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 48.40).' },
    { ref: 'AV 8.4 (= RV 7.104)', purpose: 'Indra-Soma destroy sorcerers and demons', ks: 'Anukr. "Cātana" — NO direct Kauśika prescription (Whitney)', pdQuote: '"Against sorcerers and demons: to Indra and Soma" (Whitney)', cite: WHITNEY + ' vol. 2. CORRECTION: 8.4 has no direct Kauś. use; the cātana KS 8.25 covers 8.3, 1.7-1.8.' },
    { ref: 'AV 16.2', purpose: 'remove the SIN of the abhicāra rite (prāyaścitta) — wash & rub the whole body', ks: 'Kauś. 49.27', pdQuote: 'paryāya labelled duḥsvapnanāśana, "evil-dream-dispelling" (Whitney)', cite: WHITNEY + ' vol. 2; ' + CALAND + ' p. 173 (Kauś. 49.27).' },
  ],
  counter: [
    { ref: 'AV 1.7, 1.8', purpose: 'Agni exposes and burns the yātudhāna sorcerers', ks: 'cātana-gaṇa, Kauś. 8.25', pdQuote: '"To Agni: for the discovery of sorcerers" (Whitney)', cite: WHITNEY + '.' },
    { ref: 'AV 1.16', purpose: 'lead-powder amulet against enemies', ks: 'Kauś. 47.23 (Caland: 47.28a — ⚑ edition-dependent)', pdQuote: '', cite: BLOOMFIELD + '; ' + CALAND + '.' },
    { ref: 'AV 2.11', purpose: 'counteract witchcraft with an amulet (first of the kṛtyāpratiharaṇa gaṇa)', ks: 'Kauś. 39.7', pdQuote: '"To counteract witchcraft: with an amulet" (Whitney)', cite: WHITNEY + '.' },
    { ref: 'AV 4.17, 4.18, 4.19', purpose: 'the apāmārga (Achyranthes aspera) charm — turn sorcery back on its maker', ks: '—', pdQuote: '"Charm with the apāmārga-plant, against sorcery, demons, and enemies" (SBE 42)', cite: BLOOMFIELD + '.' },
    { ref: 'AV 4.20', purpose: 'a herb (sadampuṣpā) amulet exposes hidden wizards', ks: 'cātana-gaṇa', pdQuote: '"To discover sorcerers: with an herb" (Whitney)', cite: WHITNEY + '.' },
    { ref: 'AV 5.14, 5.31, 10.1', purpose: 'send the kṛtyā (the fashioned spell / figure) back to its sender', ks: '—', pdQuote: '"Against witchcraft and its practisers" (Whitney, 10.1)', cite: WHITNEY + '; ' + BLOOMFIELD + ' ("Charm to repel sorceries or spells").' },
    { ref: 'AV 6.32', purpose: 'destroy the sorcerers by fire', ks: 'Kauś. 31.3', pdQuote: '', cite: WHITNEY + '; ' + CALAND + ' (Kauś. 31.3).' },
    { ref: 'AV 8.3', purpose: 'Agni slays the shape-shifting demons', ks: 'cātana-gaṇa, Kauś. 8.25', pdQuote: '', cite: WHITNEY + '.' },
    { ref: 'AV 8.5', purpose: 'the sraktya (srāktya) talisman against witchcraft', ks: '—', pdQuote: '', cite: WHITNEY + '.' },
    { ref: 'AV 11.9 (Arbudi), 11.10 (Triṣandhi)', purpose: 'rout an enemy army in battle', ks: '—', pdQuote: '"Prayer to Arbudi… / to Trishaṃdhi for help in battle" (SBE 42)', cite: BLOOMFIELD + '; ' + WHITNEY + '.' },
  ],
  note: 'The Vedic→tantric continuity: the Atharvan abhicāra hymns and their Kauśika Sūtra applications are the oldest stratum the later ṣaṭkarman systematized. Counter-sorcery (kṛtyāpratiharaṇa / pratyabhicāra) and the cātana ("expelling") charms are the defensive half of the same corpus.',
  cite: WHITNEY + ' ' + BLOOMFIELD + ' ' + CALAND + ' wisdomlib doc1888362/doc1888363.',
};

// ---------------------------------------------------------------------------
//  9. THE TEXTS — the dated chain, editions, and attribution flags.
// ---------------------------------------------------------------------------
export const TEXTS = [
  {
    title: 'Atharvaveda (Śaunaka Saṃhitā)', date: 'c. 1200-1000 BCE',
    locus: 'the abhicāra hymn corpus; 11.9-10 battle charms',
    edition: 'Bloomfield, SBE 42 (1897, PD); Whitney-Lanman, HOS 7-8 (1905, PD)',
    note: 'The oldest layer. Date is the standard consensus range (Witzel et al.).',
    cite: BLOOMFIELD + '; ' + WHITNEY + '.',
  },
  {
    title: 'Kauśika Sūtra', date: 'Vedic ritual-application manual',
    locus: 'the ābhicārika-gaṇa and cātana-gaṇa (ritual application of the AV hymns)',
    edition: 'ed. Bloomfield, JAOS 14 (1890); applications trans. Caland (1900)',
    note: 'The manual that tells you which hymn is used in which rite.',
    cite: 'Bloomfield, Kauśika Sūtra (JAOS 14, 1890); ' + CALAND + '.',
  },
  {
    title: 'Prapañcasāra (attrib. Śaṅkara)', date: 'c. 10th-11th c.',
    locus: 'six-rites parallel at 446-452',
    edition: 'traditional Śaṅkara attribution — Bühnemann calls the text "anonymous"',
    note: 'Attribution FLAGGED as traditional, not established.',
    cite: BUHNEMANN + ' p. 447; ' + ULLREY + ' p. 133.',
  },
  {
    title: 'Śāradātilaka of Lakṣmaṇadeśika', date: 'c. 10th-11th c. (Sanderson argues later)',
    locus: 'six rites at 23.121-145 (~3,500 stanzas)',
    edition: 'Board of Scholars ed.',
    note: 'A well-known tantric compendium; dating disputed.',
    cite: BUHNEMANN + ' p. 447; ' + ULLREY + ' p. 133.',
  },
  {
    title: 'Mantramahodadhi of Mahīdhara', date: '1588 CE, Varanasi',
    locus: 'six rites in ch. 25 — the FINAL chapter, 132 verses (with the "nineteen items")',
    edition: 'Satguru / Board of Scholars, Delhi 1981 (NO critical edition); Bühnemann’s ed. of ch. 25 = appendix 2 of Iconography of Hindu Tantric Deities vol. 1 (Groningen: Egbert Forsten, 2000)',
    note: 'With Mahīdhara’s own Nauka ("Boat") commentary — for crossing the "Great Ocean of Mantras". The systematizing source for the timing screen.',
    cite: BUHNEMANN + ' p. 447.',
  },
  {
    title: 'Uḍḍīśatantra', date: 'late / post-medieval; multiple recensions',
    locus: 'the opening systematic section (seasons, colours, mudrās, rosaries, fingers)',
    edition: 'Tripathī (Kalyāṇ 1965); Sivadatta (Vārāṇasī 1998); Śrīvāstava Hindi ed. (Manoj Publications 2007)',
    note: 'Attributed pseudepigraphically to Rāvaṇa via a Śiva-revelation frame — the attribution is LEGENDARY, not historical.',
    cite: ULLREY + ' pp. 155-159, 185, 207-208.',
  },
  {
    title: 'Uḍḍāmareśvaratantra', date: 'medieval',
    locus: 'the ṣaṭkarman',
    edition: 'Zadoo ed. (Kashmir Series of Texts and Studies)',
    note: '',
    cite: ULLREY + ' (Zadoo ed., KSTS).',
  },
  {
    title: 'Bhairavapadmāvatīkalpa of Malliṣeṇa', date: 'c. 10th-11th c., Karnataka',
    locus: 'the ṣaṭkarman (the day-part, colour, mat & hand-rule tables)',
    edition: 'ed. princeps Jhavery 1944 (Ahmedabad: Sarabhai Manilal Nawab), with Bandhuṣeṇa’s commentary',
    note: 'A Digambara Jain tantra. No epigraphical evidence for Malliṣeṇa or Bandhuṣeṇa; dating rests on Jhavery.',
    cite: ULLREY + ' pp. 375-376 (Jhavery 1944).',
  },
  {
    title: 'Bhūtaḍāmaratantra', date: 'early',
    locus: 'conjuring (feeds the Uḍḍīśa corpus)',
    edition: '—',
    note: 'A Buddhist conjuring source feeding the later Uḍḍīśa material.',
    cite: ULLREY + ' pp. 133-134.',
  },
];

export const SCHOLARSHIP = [
  { author: 'Goudriaan', work: 'Māyā Divine and Human (Motilal Banarsidass 1978)', note: 'The ṣaṭkarman chapter; the standard treatment.' },
  { author: 'Bühnemann', work: '"The Six Rites of Magic", in White (ed.), Tantra in Practice (Princeton UP 2000, pp. 447-462); Iconography of Hindu Tantric Deities (Groningen 2000)', note: 'The MMU 25 apparatus and its tables.' },
  { author: 'Türstig', work: '"The Indian Sorcery Called Abhicāra" (WZKS 29 (1985): 69-117 — ⚑ volume no. flagged; an OCR showed "24")', note: 'The direction/deity chart source to cross-check.' },
  { author: 'White', work: 'Kiss of the Yoginī; Sinister Yogis', note: 'The wider tantric-magic context.' },
  { author: 'Ullrey', work: 'Grim Grimoires: Pragmatic Ritual in the Magic Tantras (UCSB diss. 2016; eScholarship qt4vt6f325)', note: 'Every Uḍḍīśatantra / BPK quote here traces through it.' },
  { author: 'Bloomfield / Whitney-Lanman', work: 'SBE 42 (1897); HOS 7-8 (1905) — both public domain', note: 'The Atharvaveda translations quoted.' },
];

// ---------------------------------------------------------------------------
//  10. The framing strings used across the wing.
// ---------------------------------------------------------------------------
export const FRAMING = {
  label:
    'Abhicāra is the tantric tradition’s own word for hostile ritual; "black magic" is a colonial-era and ' +
    'modern-popular gloss, not the texts’ own category. This wing presents the material exactly as academic ' +
    'scholarship does — as religious history and belief-system analysis. Nothing here has any demonstrated ' +
    'validity, and nothing here is an instruction: the māraṇa-class material states only what the TEXTS CLAIM.',
  care:
    'This page exists to explain a historical belief-system. It describes; it never prescribes. There are no ' +
    'dosages, no step-by-step rites and no "how to harm" anywhere in this wing — only the catalogued ' +
    'correspondence data that Princeton UP and Motilal Banarsidass themselves print, and the calendar ' +
    'arithmetic of when the tradition said each act "belonged". Reading it, or computing the screen, does ' +
    'nothing in the world.',
};
