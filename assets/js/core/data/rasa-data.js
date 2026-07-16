// ============================================================================
//  rasa-data.js — the INDIAN ALCHEMY (rasaśāstra) & YANTRA-MATHEMATICS data.
//
//  Two threads live here, cited per record:
//   1. RASAŚĀSTRA — the dated textual chain (with the Wujastyk "alchemical
//      ghost" dispute and the contested datings kept in-data, never resolved),
//      the canonical 18 saṃskāras of mercury, and the rasaśālā apparatus
//      (yantras) of the Rasaratnasamuccaya. This is HISTORY OF CHEMISTRY /
//      HISTORY OF RELIGION, described — NEVER prescribed. Mercury, lead and
//      arsenic compounds are genuinely TOXIC: the named steps are the
//      historical record, not a procedure, and carry no dosages by design.
//   2. YANTRA-MATHEMATICS — the CALCULABLE layer: the nine navagraha 3×3
//      squares (flagged as the MODERN printed tradition, with the dated
//      classical anchors kept separate), the kaṭapayādi letter-numeration, and
//      the Sarvatobhadra Chakra construction. The arithmetic is provable and
//      the engine-test proves it; the provenance is flagged honestly.
//
//  PURE DATA + provenance per record. Every record carries `.cite`.
//  Sources: P.C. Ray, A History of Hindu Chemistry vol.1 (1902) & vol.2 (1909);
//  D. White, The Alchemical Body (U. Chicago 1996); D. Wujastyk, "An Alchemical
//  Ghost" Ambix 31.2 (1984) 70-83; G. Meulenbeld, A History of Indian Medical
//  Literature; G.P.H. Styan, "Yantra magic squares…" (McGill, 2012); T. Hayashi,
//  "Magic Squares in Indian Mathematics". Every value in the CALCULABLE layer was
//  recomputed in an adversarial verification pass (17 verdicts, 0 refuted).
// ============================================================================

// ---------------------------------------------------------------------------
//  Locked framing + the toxicity warning (surfaced FIRST on the page).
// ---------------------------------------------------------------------------
export const RASA_CAVEAT =
  'Rasaśāstra is the medieval Indian alchemy of mercury (pārada). Its two claimed goals — lohavedha '
  + '(turning base metal to gold) and dehavedha (perfecting the body toward immortality) — have no demonstrated '
  + 'validity of any kind. What survives is a real history of chemistry (mercury–sulphur–mica processing, first '
  + 'set out in modern terms by P.C. Ray) and of religion (White). It is described here for study, never prescribed.';

export const RASA_TOXICITY =
  'TOXICITY — please read first. The substances named on this page — mercury and its compounds (HgS, mercury '
  + 'chloride), lead, arsenic, orpiment/realgar, and their calcined "bhasmas" — are POISONS. Mercury compounds '
  + 'are neurotoxic and nephrotoxic; there is no safe home preparation. Everything below is the HISTORICAL RECORD '
  + 'of what the texts describe, presented as history of chemistry only. It is NOT instructions: no dosages, no '
  + '"how to prepare", no medical use is given or implied. Do not attempt any of it.';

const RAY = 'P.C. Ray, A History of Hindu Chemistry, vol.1 (1902) & vol.2 (1909), Bengal Chemical & Pharmaceutical Works, Calcutta.';
const WHITE = 'D.G. White, The Alchemical Body: Siddha Traditions in Medieval India (U. Chicago Press, 1996).';
const WUJASTYK = 'D. Wujastyk, "An Alchemical Ghost: The Rasaratnākara by Nāgārjuna", Ambix 31.2 (1984) 70–83 (DOI 10.1179/amb.1984.31.2.70); wujastyk.github.io/Rasendramangala/.';
const RRS_REVIEW = '"Critical Review of Rasaratna Samuccaya", PMC5255965 (chapter-by-chapter contents); en.wikipedia.org/wiki/Rasaratna_Samuchaya.';

// ---------------------------------------------------------------------------
//  TEXTS — the dated chain of rasaśāstra, with the disputes kept visible.
//  Ordered by (contested) date. Each record flags what is contested and cites.
// ---------------------------------------------------------------------------
export const TEXTS = [
  {
    title: 'Rasahṛdayatantra',
    author: 'Govinda (Govindabhagavatpāda)',
    date: 'c. 10th–11th c.',
    role: 'The first work of the rasaśāstra genre; 19 chapters, sets out the 18 means of processing mercury.',
    contested: null,
    cite: 'wisdomlib.org (Rasahṛdayatantra, "a 10th-century alchemical work by Govinda … the first work of the genre"); ' + WHITE,
  },
  {
    title: 'Rasendramaṅgala',
    author: 'Nāgārjuna Siddha',
    date: 'c. 10th–11th c.',
    role: 'A genuine early alchemical work of the Siddha Nāgārjuna — distinct from the "Rasaratnākara" long misattributed to him.',
    contested: {
      flag: 'The "Rasaratnākara by Nāgārjuna" is a literary GHOST (Wujastyk 1984).',
      detail: 'P.C. Ray was misled by a Raghunātha Temple Library (Jammu) manuscript that interleaved the folios of TWO works. '
        + 'The real texts are the Rasendramaṅgala (Nāgārjuna Siddha) and the Rasaratnākara (Nityanātha Siddha, 13th c.). '
        + 'Any "Nāgārjuna Rasaratnākara" attribution must be flagged as disputed.',
    },
    cite: WUJASTYK,
  },
  {
    title: 'Rasārṇava',
    author: 'Anonymous tantra (a Bhairava–Devī dialogue)',
    date: 'c. 11th c. (White) — some Indian scholarship claims 8th c.',
    role: 'The tantric core; source of the governing aphorism "yathā lohe tathā dehe kartavyaḥ sūtakaḥ sadā" ("as in metal, so in the body").',
    contested: {
      flag: 'Dating CONTESTED: 8th c. vs 11th c.',
      detail: 'White and wisdomlib date it to the 11th c.; the PMC review of the RRS dates the Rasārṇava to "8th Cent. C.E." Both positions are kept; the site does not resolve them.',
    },
    cite: WHITE + ' ' + RRS_REVIEW + ' (aphorism: wisdomlib "The Philosophy of Mercury").',
  },
  {
    title: 'Rasendracūḍāmaṇi',
    author: 'Somadeva',
    date: 'c. 12th c.',
    role: 'A widely-cited synthesis of the mercurial operations, between the Rasārṇava and the Rasaratnākara.',
    contested: null,
    cite: 'wisdomlib.org / en.wikipedia.org (Rasahṛdayatantra "influenced … the 12th-century Rasendracūḍāmaṇi by Somadeva").',
  },
  {
    title: 'Rasaratnākara',
    author: 'Nityanātha Siddha',
    date: 'c. 13th c.',
    role: 'The genuine Rasaratnākara — NOT the "ghost" attributed to Nāgārjuna (see Rasendramaṅgala above).',
    contested: {
      flag: 'Frequently mis-attributed to Nāgārjuna.',
      detail: 'Per Wujastyk 1984 the Nāgārjuna attribution is an artefact of P.C. Ray\'s mixed Jammu manuscript. This is Nityanātha\'s.',
    },
    cite: WUJASTYK,
  },
  {
    title: 'Rasaratnasamuccaya (RRS)',
    author: 'Vāgbhaṭa, son of Siṃhagupta',
    date: 'c. 1250–1300 CE (internal evidence) — claims range to the 16th c.',
    role: 'The great compendium: the 18 saṃskāras (detailed in ch. 11, enumerated among the ch. 8 terminology), the rasaśālā apparatus (ch. 9), the crucibles (ch. 10). Cites Siṅghaṇa\'s formula (1200–1247) and references the Rasārṇava and Rasendramaṅgala.',
    contested: {
      flag: 'Dating CONTESTED: c. 1250–1300 vs up to 16th c.; authorship debated.',
      detail: 'The PMC critical review fixes composition "after 12th cent. C.E.", "period … 1250 to 13th Century"; other claims run later. Kept as a range, unresolved.',
    },
    cite: RRS_REVIEW + ' ' + WHITE,
  },
];
export const TEXTS_NOTE =
  'The Nāgārjuna of alchemy is a Siddha figure, not the 2nd-c. Madhyamaka philosopher; and the famous '
  + '"Rasaratnākara of Nāgārjuna" is a ghost created by a manuscript mix-up (Wujastyk 1984). Both are flagged in-data.';

// ---------------------------------------------------------------------------
//  What the tradition claimed vs what it chemically was.
// ---------------------------------------------------------------------------
export const CLAIMS = {
  aphorism: { iast: 'yathā lohe tathā dehe kartavyaḥ sūtakaḥ sadā', gloss: '"As one does with metal, so one should always do with the body" — the Rasārṇava\'s programme.', cite: 'Rasārṇava; wisdomlib "The Philosophy of Mercury"; ' + WHITE },
  vedha: [
    { name: 'Lohavedha', gloss: 'Transmutation — "piercing" a base metal so it becomes silver or gold. Saṃskāra 17.', cite: WHITE },
    { name: 'Dehavedha (śarīrayoga)', gloss: 'Trans-substantiation of the body toward jīvanmukti / immortality — the ingestion goal. Saṃskāra 18.', cite: WHITE },
  ],
  chemistry:
    'Chemically the operations were mercury–sulphur–mica processing: kajjalī (black HgS by trituration), rasasindūra '
    + '(red HgS by sublimation), distillation, sublimation, calcination (bhasma) and fixation — first documented in '
    + 'modern chemical terms by P.C. Ray (1902/09). None of it makes gold or immortality; the chemistry is real, the claims are not.',
  chemistryCite: RAY + ' ' + WHITE,
};

// ---------------------------------------------------------------------------
//  SAMSKARAS — the canonical 18 processings of mercury. 1–8 = aṣṭasaṃskāra
//  (sufficient to make mercury fit for medicine); 9–18 push toward vedha.
//  Source: Rasahṛdayatantra (primary); RRS ch. 11 (detailed; enumerated among
//  the ch. 8 paribhāṣā terms — NOT ch. 8 in detail, per the PMC review); White 1996.
//  HISTORICAL RECORD ONLY — no dosage, no method, no medical claim.
// ---------------------------------------------------------------------------
const SAMSKARA_CITE = 'Rasahṛdayatantra; Rasaratnasamuccaya ch. 11 (detailed processing; enumerated among the ch. 8 paribhāṣās). ' + WHITE + ' IJRAP 8(4) 2017 (ijrap.net) & easyayurveda.com/ashta-samskara-parada/.';
export const SAMSKARAS = [
  { n: 1,  iast: 'Svedana',      en: '"Sweating"', fn: 'Steaming mercury with herb/acid media (a dolāyantra) to loosen surface impurities.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 2,  iast: 'Mardana',      en: 'Trituration', fn: 'Grinding with plant juices in a khalva mortar to rub out impurities.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 3,  iast: 'Mūrcchana',    en: '"Swooning"', fn: 'Grinding until mercury loses form and lustre, destroying its innate doṣas.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 4,  iast: 'Utthāpana',    en: '"Resurrection"', fn: 'Recovering the swooned mercury to its native fluid state (washing/heating).', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 5,  iast: 'Pātana',       en: 'Sublimation / distillation', fn: 'In three modes — ūrdhva (up), adhaḥ (down), tiryak (lateral) — stripping metallic impurities.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 6,  iast: 'Rodhana',      en: '"Awakening" (Bodhana)', fn: 'Confining mercury in saline water to restore potency lost in processing.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 7,  iast: 'Niyāmana',     en: '"Restraining"', fn: 'Gentle steaming to regulate the awakened mercury\'s mobility.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 8,  iast: 'Dīpana',       en: '"Kindling" (Sandīpana)', fn: 'Stimulating mercury\'s "appetite" to consume other substances.', group: 'aṣṭa', cite: SAMSKARA_CITE },
  { n: 9,  iast: 'Gagana-grāsa', en: 'Mica-feeding (Abhraka-bhakṣaṇa)', fn: 'Feeding mercury its first measured mouthful of mica (gagana = abhraka) essence.', group: 'jāraṇa', cite: SAMSKARA_CITE },
  { n: 10, iast: 'Cāraṇa',       en: '"Grazing"', fn: 'Digestion of the swallowed mica/metal in hot sour media.', group: 'jāraṇa', cite: SAMSKARA_CITE },
  { n: 11, iast: 'Garbhadruti',  en: 'Internal liquefaction', fn: 'The consumed substance liquefies INSIDE the mercury.', group: 'jāraṇa', cite: SAMSKARA_CITE },
  { n: 12, iast: 'Bāhyadruti',   en: 'External liquefaction', fn: 'Essences liquefied OUTSIDE mercury for absorption.', group: 'jāraṇa', cite: SAMSKARA_CITE },
  { n: 13, iast: 'Jāraṇa',       en: 'Assimilation', fn: 'Complete assimilation of the grāsa so mercury keeps its own nature (no weight gain).', group: 'jāraṇa', cite: SAMSKARA_CITE },
  { n: 14, iast: 'Rañjana',      en: '"Colouring"', fn: 'Tinting mercury with gold/silver/copper/sulphur so it gains transmuting colour.', group: 'vedha', cite: SAMSKARA_CITE },
  { n: 15, iast: 'Sāraṇa',       en: '"Flowing"', fn: 'Potentiating with oils to multiply transmuting power.', group: 'vedha', cite: SAMSKARA_CITE },
  { n: 16, iast: 'Krāmaṇa',      en: '"Stepping over"', fn: 'Enabling mercury to penetrate and pervade other bodies.', group: 'vedha', cite: SAMSKARA_CITE },
  { n: 17, iast: 'Vedha(na)',    en: 'TRANSMUTATION (lohavedha)', fn: 'The claimed act: "pierced" base metal turns to silver or gold.', group: 'vedha', cite: SAMSKARA_CITE },
  { n: 18, iast: 'Śarīrayoga',   en: 'Bodily application (Bhakṣaṇa, dehavedha)', fn: 'Ingesting the "perfected" mercury for body-perfection / the immortality claim.', group: 'vedha', cite: SAMSKARA_CITE },
];
export const SAMSKARAS_NOTE =
  'The first EIGHT are the aṣṭasaṃskāra — "sufficient to make mercury eligible for medicine". The tradition itself '
  + 'records variant counts ("some say nineteen, some hold these are eight"), consistent with the site\'s contested-values '
  + 'policy. Nos. 9–13 are the jāraṇa (mica/metal "digestion") group; 14–18 push toward vedha. HISTORICAL RECORD ONLY.';

// ---------------------------------------------------------------------------
//  APPARATUS — the rasaśālā yantras of the Rasaratnasamuccaya ch. 9 ("Yantra"),
//  with verse references. The chapter describes ~31 instruments in all.
//  Every reference re-checked against easyayurveda.com/yantra-rasashastra/.
// ---------------------------------------------------------------------------
const YANTRA_CITE = 'Rasaratnasamuccaya ch. 9 ("Yantra"), verse refs via easyayurveda.com/yantra-rasashastra/ and wisdomlib doc239499; PMC5255965 ("ch. 9 … 31 different instruments"). ' + RAY + ' (apparatus plates).';
export const APPARATUS = [
  { name: 'Dolāyantra',         ref: 'RRS 9.3–4',   fn: 'Substance in a pouch swung from a rod inside a half-filled pot — steaming/decoction.', cite: YANTRA_CITE },
  { name: 'Svedanīyantra',      ref: 'RRS 9.5',     fn: 'Pot with a cloth-bound mouth — steam processing.', cite: YANTRA_CITE },
  { name: 'Ūrdhvapātana-yantra', ref: 'RRS 9.6–8',  fn: 'Upward sublimation with a cooled condensation chamber.', cite: YANTRA_CITE },
  { name: 'Adhaḥpātana-yantra',  ref: 'RRS 9.9',     fn: 'Downward distillation onto a coated lower vessel.', cite: YANTRA_CITE },
  { name: 'Tiryakpātana-yantra', ref: 'RRS 9.10–12', fn: 'Lateral distillation through a tube (a retort).', cite: YANTRA_CITE },
  { name: 'Kacchapayantra',     ref: 'RRS 9.13–15', fn: '"Tortoise" water-bath — a floating dish for mercury–sulphur work.', cite: YANTRA_CITE },
  { name: 'Vidyādharayantra',   ref: 'RRS 9.24–25', fn: 'Two-pot stack — extracting mercury from hiṅgula (cinnabar).', cite: YANTRA_CITE },
  { name: 'Vālukāyantra',       ref: 'RRS 9.33–36', fn: 'Sand bath heating a sealed glass/crucible.', cite: YANTRA_CITE },
  { name: 'Puṭayantra',         ref: 'RRS 9.42',    fn: 'Sealed pot for incineration (bhasma) grades.', cite: YANTRA_CITE },
  { name: 'Pālikāyantra',       ref: 'RRS 9.50',    fn: 'Iron vessel with a rod — liquefying kajjalī.', cite: YANTRA_CITE },
  { name: 'Ḍamaruyantra',       ref: 'RRS 9.57',    fn: 'Two pots mouth-to-mouth like a ḍamaru drum — sublimation of volatiles.', cite: YANTRA_CITE },
  { name: 'Sthālīyantra',       ref: 'RRS 9.66',    fn: 'A single sealed vessel for heating metallics.', cite: YANTRA_CITE },
  { name: 'Bhūdharayantra',     ref: 'RRS ch. 9 / Rasataraṅgiṇī', fn: 'Apparatus buried in an earth/sand pit over heat.', cite: YANTRA_CITE },
  { name: 'Pātālayantra',       ref: 'Rasataraṅgiṇī 4.47–52', fn: 'Buried two-pot pit for destructive distillation of oils ("under the pātāla/earth").', cite: 'Rasataraṅgiṇī 4.47–52 (adhyāya 4); yantra reviews & JAIMS Gandhak Taila paper. ' + RAY },
  { name: 'Khalva / Ulūkhala',  ref: 'traditional', fn: 'Mortar-and-pestle grinding; with the mūṣās (crucibles, RRS ch. 10) and the puṭa fire-grades.', cite: YANTRA_CITE },
];

// ===========================================================================
//  YANTRA-MATHEMATICS — the calculable layer.
// ===========================================================================

// ---------------------------------------------------------------------------
//  NAVAGRAHA_YANTRAS — the nine planet-yantra 3×3 squares. Lk = L1 + (k−1)·J,
//  L1 = the double-flipped Luoshu [6,1,8 / 7,5,3 / 2,9,4]; magic constants
//  15…39 step 3; per-square totals 45…117 step 9; grand total 729 = 9³.
//
//  PROVENANCE (flagged): this specific offset set is the MODERN PRINTED
//  ("bazaar"/Vaidika-plate) tradition. Styan's 2012 survey found no other set
//  depicted, and it is NOT traceable to a dated classical text. It is the
//  dominant — but not the sole — modern printing: some vendors even sell the
//  WESTERN Agrippa kameas as graha yantras. The dated classical anchors live in
//  CLASSICAL_SQUARES below, kept separate on purpose.
// ---------------------------------------------------------------------------
const NAVAGRAHA_PROVENANCE = 'MODERN PRINTED yantra tradition (bazaar / Vaidika plate); no dated classical source. Styan 2012 is a survey of printed yantras, not an edition.';
const NAVAGRAHA_CITE = 'G.P.H. Styan (McGill), "An introduction to Yantra magic squares and Agrippa-type magic matrices" (Jan 2012), math.mcgill.ca/styan/Beamer1-18jan12-opt.pdf — grids at slides B1-11/B1-12, composites at B1-05/B1-14 (corrected; NOT B1-28, which shows Agrippa\'s Mars and Cardano\'s Venus). Constants cross-checked at jain108academy.com/the-9-planets-the-navagraha/. Base 15-square attested as the "Pañcadaśī yantra" (webastrologers.com).';
export const NAVAGRAHA_YANTRAS = [
  { order: 1, graha: 'Sūrya',   en: 'Sun',     grid: [[6, 1, 8], [7, 5, 3], [2, 9, 4]],       constant: 15, total: 45,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 2, graha: 'Candra',  en: 'Moon',    grid: [[7, 2, 9], [8, 6, 4], [3, 10, 5]],      constant: 18, total: 54,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 3, graha: 'Maṅgala', en: 'Mars',    grid: [[8, 3, 10], [9, 7, 5], [4, 11, 6]],     constant: 21, total: 63,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 4, graha: 'Budha',   en: 'Mercury', grid: [[9, 4, 11], [10, 8, 6], [5, 12, 7]],    constant: 24, total: 72,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 5, graha: 'Guru',    en: 'Jupiter', grid: [[10, 5, 12], [11, 9, 7], [6, 13, 8]],   constant: 27, total: 81,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 6, graha: 'Śukra',   en: 'Venus',   grid: [[11, 6, 13], [12, 10, 8], [7, 14, 9]],  constant: 30, total: 90,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 7, graha: 'Śani',    en: 'Saturn',  grid: [[12, 7, 14], [13, 11, 9], [8, 15, 10]], constant: 33, total: 99,  provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 8, graha: 'Rāhu',    en: 'Rahu',    grid: [[13, 8, 15], [14, 12, 10], [9, 16, 11]], constant: 36, total: 108, provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
  { order: 9, graha: 'Ketu',    en: 'Ketu',    grid: [[14, 9, 16], [15, 13, 11], [10, 17, 12]], constant: 39, total: 117, provenance: NAVAGRAHA_PROVENANCE, cite: NAVAGRAHA_CITE },
];
export const NAVAGRAHA_GRANDTOTAL = 729;
export const NAVAGRAHA_NOTE =
  'The Vedic order runs ASCENDING — Sūrya takes the 3×3 with constant 15, up to Ketu at 39 — the OPPOSITE mapping '
  + 'philosophy to Agrippa\'s kameas, where SATURN gets the 3×3 (constant 15) and the Moon the 9×9. Same base square, '
  + 'reversed planetary logic. The set is the modern printed tradition (flagged); the classical 3×3-for-navagraha idea '
  + 'is older (Gargasaṃhitā), but this particular nine-square offset set is not classically dated.';

// ---------------------------------------------------------------------------
//  CLASSICAL_SQUARES — the DATED, cited Indian magic squares (kept separate
//  from the bazaar navagraha set). `grid: null` where the source gives no
//  explicit cell arrangement (recorded honestly rather than fabricated).
// ---------------------------------------------------------------------------
export const CLASSICAL_SQUARES = [
  {
    key: 'varahamihira',
    name: 'Varāhamihira\'s perfume square ("sarvatobhadra")',
    grid: [[2, 3, 5, 8], [5, 8, 2, 3], [4, 1, 7, 6], [7, 6, 4, 1]],
    order: 4, constant: 18,
    date: 'c. 550 CE',
    properties: 'Pandiagonal: every row, column, both diagonals AND all broken diagonals sum to 18. Each of 1..8 is used twice (total 72). The oldest datable 4th-order magic square; Varāhamihira himself calls the device "sarvatobhadra".',
    provenance: 'CLASSICAL, dated text.',
    contested: { flag: 'Chapter number is edition-dependent.', detail: 'Bṛhatsaṃhitā ch. 77 in the Iyer/wisdomlib numbering (Gandhayukti / perfumes); ch. 76, vv. 23–26 in Hayashi. Kept as "ch. 77 (76 in some editions; vv. 23–26)".' },
    cite: 'Varāhamihira, Bṛhatsaṃhitā ch. 77 (76 in some editions; vv. 23–26), c. 550 CE; T. Hayashi, "Varāhamihira\'s Pandiagonal Magic Square of the Order Four", Historia Mathematica 14 (1987); en.wikipedia.org/wiki/Magic_square (India section).',
  },
  {
    key: 'chautisa',
    name: 'Khajuraho Chautisa yantra',
    grid: [[7, 12, 1, 14], [2, 13, 8, 11], [16, 3, 10, 5], [9, 6, 15, 4]],
    order: 4, constant: 34,
    date: '10th–12th c. (contested)',
    mostPerfect: true,
    properties: 'A MOST-PERFECT pandiagonal magic square (uses 1..16 once each): every row, column, both diagonals, all broken diagonals, all sixteen wrapping 2×2 blocks, and the corner quads of every 3×3 and of the 4×4 sum to 34. (Formally: every diagonal pair two apart sums to 17.) Among the oldest known.',
    provenance: 'CLASSICAL, dated inscription.',
    contested: { flag: 'Date range 10th–12th c.', detail: 'The Pārśvanātha Jain temple, Khajuraho, was built c. 950–970 CE (Chandela king Dhaṅga); the square is on the entrance lintel, but the inscription is dated to the 12th c. by some scholarship. The honest range is 10th–12th c.' },
    cite: 'Pārśvanātha Jain temple inscription, Khajuraho; en.wikipedia.org/wiki/Magic_square ("Chautisa Yantra … most-perfect magic square") & en.wikipedia.org/wiki/Parshvanatha_temple,_Khajuraho.',
  },
  {
    key: 'nagarjuniya',
    name: 'Nāgārjunīya square',
    grid: null,
    order: 4, constant: 100,
    date: 'c. 10th c.',
    properties: 'A 4×4 square summing to 100, built by Nāgārjuna\'s "primary skeleton square" construction method (Kakṣapuṭa). The source gives the METHOD and the constant (100), not a single canonical cell arrangement — so no grid is asserted here.',
    provenance: 'CLASSICAL, dated text (method).',
    contested: null,
    cite: 'Kakṣapuṭa attrib. Nāgārjuna, c. 10th c.; en.wikipedia.org/wiki/Magic_square (India section, citing Hayashi — "method of constructing a 4×4 magic square using a primary skeleton square … Nāgārjunīya square sums to 100").',
  },
  {
    key: 'gargasamhita',
    name: 'Gargasaṃhitā 3×3 (navagraha pacification)',
    grid: null,
    order: 3, constant: 15,
    date: 'passage not before 400 CE',
    properties: 'The 3×3 (Lo Shu-type) magic square first appears in India in the Gargasaṃhitā, recommended to pacify the nine planets (navagraha). The oldest version of the text is c. 100 CE, but the planet passage cannot predate 400 CE (Hayashi). No single inscribed cell arrangement is asserted here — the classical anchor is the IDEA of a 3×3-for-navagraha, of which the bazaar nine-square set above is a much later elaboration.',
    provenance: 'CLASSICAL, dated passage.',
    contested: null,
    cite: 'Gargasaṃhitā (Garga); en.wikipedia.org/wiki/Magic_square (India section, citing T. Hayashi, "Magic Squares in Indian Mathematics").',
  },
];

// ---------------------------------------------------------------------------
//  KATAPAYADI — the consonant→digit letter-numeration. `map` is the working
//  IAST consonant→value table used by the decoder; `table` is the human
//  display; `examples` are the verified test vectors.
//  Rules: a consonant counts only WITH an attached vowel; in a conjunct only
//  the LAST consonant counts; vowelless consonants are ignored; standalone
//  vowels count as 0; digits are read RIGHT-TO-LEFT ("aṅkānāṃ vāmato gatiḥ").
// ---------------------------------------------------------------------------
export const KATAPAYADI = {
  // IAST consonant → digit. (ña, na and standalone vowels = 0.)
  map: {
    k: 1, kh: 2, g: 3, gh: 4, 'ṅ': 5,
    c: 6, ch: 7, j: 8, jh: 9, 'ñ': 0,
    'ṭ': 1, 'ṭh': 2, 'ḍ': 3, 'ḍh': 4, 'ṇ': 5,
    t: 6, th: 7, d: 8, dh: 9, n: 0,
    p: 1, ph: 2, b: 3, bh: 4, m: 5,
    y: 1, r: 2, l: 3, v: 4, 'ś': 5, 'ṣ': 6, s: 7, h: 8,
  },
  // multi-char consonants must be matched before single chars (longest-first)
  consonantsByLength: ['kh', 'gh', 'ch', 'jh', 'ṭh', 'ḍh', 'th', 'dh', 'ph', 'bh',
    'ṅ', 'ñ', 'ṇ', 'ṭ', 'ḍ', 'ś', 'ṣ',
    'k', 'g', 'c', 'j', 't', 'd', 'n', 'p', 'b', 'm', 'y', 'r', 'l', 'v', 's', 'h'],
  vowels: ['ai', 'au', 'ā', 'ī', 'ū', 'ṝ', 'ḹ', 'a', 'i', 'u', 'ṛ', 'ḷ', 'e', 'o'],
  ignore: ['ṃ', 'ḥ', ' ', '-', '’', "'"], // anusvāra & visarga are non-numeric marks here
  table: [
    { digit: 1, syllables: ['ka', 'ṭa', 'pa', 'ya'] },
    { digit: 2, syllables: ['kha', 'ṭha', 'pha', 'ra'] },
    { digit: 3, syllables: ['ga', 'ḍa', 'ba', 'la'] },
    { digit: 4, syllables: ['gha', 'ḍha', 'bha', 'va'] },
    { digit: 5, syllables: ['ṅa', 'ṇa', 'ma', 'śa'] },
    { digit: 6, syllables: ['ca', 'ta', 'ṣa'] },
    { digit: 7, syllables: ['cha', 'tha', 'sa'] },
    { digit: 8, syllables: ['ja', 'da', 'ha'] },
    { digit: 9, syllables: ['jha', 'dha'] },
    { digit: 0, syllables: ['ña', 'na', '(standalone vowels)'] },
  ],
  rules: [
    'A consonant takes its value only with a vowel attached; a vowelless consonant is ignored.',
    'In a conjunct cluster, only the LAST consonant counts (in "kya" only ya = 1).',
    'Standalone vowels (a vowel with no preceding consonant) count as 0.',
    'The digits are read RIGHT-TO-LEFT — "aṅkānāṃ vāmato gatiḥ" ("of digits, the motion is leftward").',
    'Anusvāra (ṃ) and visarga (ḥ) are non-numeric marks here.',
  ],
  examples: [
    { input: 'dhīra', value: '29', gloss: 'Melakartā rāga Dhīraśaṅkarābharaṇam — its katapayādi prefix "dhī-ra": dhī=9, ra=2 → read leftward → 29. (Melakartā decoding uses only the first two syllables.)' },
    { input: 'meca', value: '65', gloss: 'Melakartā rāga Mechakalyāṇī — prefix "me-ca": me=5, ca=6 → read leftward → 65.' },
    { input: 'bhadrāmbudhisiddhajanmagaṇitaśraddhāsmayadbhūpagīḥ', value: '314159265358979324', gloss: 'The classic π verse: bha-dra-mbu-dhi-si-ddha-ja-nma-ga-ṇi-ta-śra-ddha-sma-ya-[d]-bhu-pa-gīḥ → 18 digits = π × 10¹⁷ rounded (π/10 to 17 decimal places).' },
  ],
  earliestUse: 'Haridatta, Grahacāraṇibandhana, 683 CE (the Kerala vākya tradition) — the historical bridge to the KP/vākya material.',
  definingVerse: 'Sadratnamālā of Śaṅkaravarman (1819): "nañāvacaśca śūnyāni saṅkhyāḥ kaṭapayādayaḥ …".',
  cite: 'en.wikipedia.org/wiki/Katapayadi_system (full table, rules, Sadratnamālā verse, Haridatta 683 CE); melakartā decodings at nallamadras.com; handwiki.org/wiki/Katapayadi_system. π-verse recomputed syllable-by-syllable (adversarial verification).',
};

// ---------------------------------------------------------------------------
//  SARVATOBHADRA — the 9×9 (81-cell) Chakra construction rules + vedha rules.
//  yantra.js buildSarvatobhadra() consumes this to place all 81 cells.
//  Geometry: rows top→bottom (row 0 = North), cols left→right; NE = Īśāna
//  corner = (row 0, col 8); counting starts there, clockwise. 16 vowels sit on
//  the two main diagonals; center (4,4) = Pūrṇā + Saturday.
//  RING-2 CONSONANT CELLS ARE FLAGGED (single OCR-degraded source).
// ---------------------------------------------------------------------------
export const SARVATOBHADRA = {
  size: 9,
  // 16 vowels in corner order, four per ring (NE, SE, SW, NW):
  vowelRings: [
    { ring: 1, NE: 'a', SE: 'ā', SW: 'i', NW: 'ī' },
    { ring: 2, NE: 'u', SE: 'ū', SW: 'ṛ', NW: 'ṝ' },
    { ring: 3, NE: 'ḷ', SE: 'ḹ', SW: 'e', NW: 'ai' },
    { ring: 4, NE: 'o', SE: 'au', SW: 'aṃ', NW: 'aḥ' },
  ],
  // Ring 1: the 28 nakṣatras, 7 per side, in reading order. `num` is the
  // standard 1..27 index (nakshatraOf gives this); Abhijit is the 28th,
  // ceremonial, inserted between U.Āṣāḍhā and Śravaṇa (num:28, isAbhijit).
  nakshatraSides: {
    // top row (North), left→right:
    north: [
      { num: 23, name: 'Dhaniṣṭhā' }, { num: 24, name: 'Śatabhiṣā' }, { num: 25, name: 'P.Bhādrapadā' },
      { num: 26, name: 'U.Bhādrapadā' }, { num: 27, name: 'Revatī' }, { num: 1, name: 'Aśvinī' }, { num: 2, name: 'Bharaṇī' },
    ],
    // right col (East), top→bottom:
    east: [
      { num: 3, name: 'Kṛttikā' }, { num: 4, name: 'Rohiṇī' }, { num: 5, name: 'Mṛgaśiras' },
      { num: 6, name: 'Ārdrā' }, { num: 7, name: 'Punarvasu' }, { num: 8, name: 'Puṣya' }, { num: 9, name: 'Āśleṣā' },
    ],
    // bottom row (South), right→left:
    south: [
      { num: 10, name: 'Maghā' }, { num: 11, name: 'P.Phalgunī' }, { num: 12, name: 'U.Phalgunī' },
      { num: 13, name: 'Hasta' }, { num: 14, name: 'Citrā' }, { num: 15, name: 'Svātī' }, { num: 16, name: 'Viśākhā' },
    ],
    // left col (West), bottom→top:
    west: [
      { num: 17, name: 'Anurādhā' }, { num: 18, name: 'Jyeṣṭhā' }, { num: 19, name: 'Mūla' },
      { num: 20, name: 'P.Āṣāḍhā' }, { num: 21, name: 'U.Āṣāḍhā' }, { num: 28, name: 'Abhijit', isAbhijit: true }, { num: 22, name: 'Śravaṇa' },
    ],
  },
  // Ring 2: 20 consonants, 5 per side, in reading order. FLAGGED — see
  // accuracyFlags.ring2. The source prints an impossible vowel 'a' as the
  // first east cell (OCR damage); kept verbatim as reported, flagged.
  consonantSides: {
    east:  ['(a?)', 'va', 'ka', 'ha', 'ḍa'],
    south: ['ma', 'ṭa', 'pa', 'ra', 'ta'],
    west:  ['na', 'ya', 'bha', 'ja', 'kha'],
    north: ['ga', 'sa', 'da', 'ca', 'la'],
  },
  // Ring 3: 12 rāśis, 3 per side, clockwise (zodiac continuous, Aries adjacent to NE):
  rashiSides: {
    north: ['Aquarius', 'Pisces', 'Aries'],
    east:  ['Taurus', 'Gemini', 'Cancer'],
    south: ['Leo', 'Virgo', 'Libra'],
    west:  ['Scorpio', 'Sagittarius', 'Capricorn'],
  },
  // Ring 4: the four tithi-group + weekday cells (one per side); center is Pūrṇā + Saturday.
  ring4Sides: {
    east:  { tithiGroup: 'Nandā', weekdays: ['Sun', 'Tue'] },
    south: { tithiGroup: 'Bhadrā', weekdays: ['Mon', 'Wed'] },
    west:  { tithiGroup: 'Jayā', weekdays: ['Thu'] },
    north: { tithiGroup: 'Riktā', weekdays: ['Fri'] },
  },
  center: { tithiGroup: 'Pūrṇā', weekdays: ['Sat'] },
  // tithi pentads (which lunar days fall in each group). Partition 1..30 exactly.
  tithiGroups: [
    { name: 'Nandā', tithis: [1, 6, 11, 16, 21, 26] },
    { name: 'Bhadrā', tithis: [2, 7, 12, 17, 22, 27] },
    { name: 'Jayā', tithis: [3, 8, 13, 18, 23, 28] },
    { name: 'Riktā', tithis: [4, 9, 14, 19, 24, 29] },
    { name: 'Pūrṇā', tithis: [5, 10, 15, 20, 25, 30] },
  ],
  // paired vowels share vedha (a↔ā, i↔ī, u↔ū, …):
  vowelPairs: [['a', 'ā'], ['i', 'ī'], ['u', 'ū'], ['ṛ', 'ṝ'], ['ḷ', 'ḹ'], ['e', 'ai'], ['o', 'au'], ['aṃ', 'aḥ']],
  counts: { vowels: 16, consonants: 20, nakshatras: 28, rashis: 12, tithiVara: 5, total: 81 },
  vedha: {
    summary:
      'A planet occupying a border nakṣatra "pierces" (vedha) along three lines: sammukha/front (straight across '
      + 'the grid, through the centre) and the two diagonals. Which diagonal acts depends on motion — direct/fast → '
      + 'the forward (zodiacal) diagonal, retrograde → the hind diagonal. Vowel vedha propagates to the paired vowel '
      + '(a↔ā, i↔ī …). Malefic vedha = obstruction, benefic = support.',
    luminariesNodes: {
      flag: 'CONTESTED — recorded unresolved.',
      traditionA: 'One tradition: the Sun, Moon, Rāhu and Ketu always cast ALL THREE lines.',
      traditionB: 'Another (varahamihira.blogspot): for the luminaries fore-vedha is always effective and rear-vedha never (they never retrograde); for Rāhu/Ketu hind-vedha is always effective and fore never (always retrograde).',
    },
    strengthWeights: 'One tradition weights the piercing planet: exalted ×3, retrograde ×2, debilitated ×½.',
    cumulative: 'Cumulative vedhas on a natal point (Mansāgarī tradition): 1 = conflict, 2 = loss of wealth, 3 = defeat/failure, 4 = death.',
    sourceDispute: {
      flag: 'Primary source CONTESTED — both recorded, unresolved.',
      positions: [
        'Narapatijayacaryā-svarodaya of Narapati, composed at Anahilapaṭṭana under Chaulukya Ajayapāla (r. 1174–1177) = V.S. 1232 ≈ 1176 CE. (Some catalogues misprint "AD 1232", a Saṃvat/CE confusion.)',
        'Wikipedia/HandWiki instead name the Brahmayāmala as the main source; construction via Gopesh Kumar Ojha\'s Phaladīpikā commentary; vedha effects via the Mansāgarī of Janardan Harji.',
      ],
    },
    cite: 'modernastro.com/astrology/vedic/sarvatobhadra (Narapatijayacaryā; motion-dependent diagonals); varahamihira.blogspot.com/2008/07/sarvatobhadra-chakra.html (fore/hind/across vedha, strength weights); en.wikipedia.org/wiki/Sarvatobhadra_Chakra + handwiki.org (Brahmayāmala, Mansāgarī, vowel-pair vedha, 1–4 vedha effects).',
  },
  accuracyFlags: {
    ring2: 'RING-2 CONSONANT CELLS ARE FLAGGED. The letter-per-cell assignment rests on a single OCR-degraded web '
      + 'source that even prints the impossible vowel "a" as the first east-side "consonant". It NEEDS an accuracy-check '
      + 'against a printed plate (Ojha\'s Phaladīpikā commentary, or V.P. Goel\'s "Sarvato Bhadra Chakra") before it can '
      + 'be trusted cell-for-cell. The 20 consonants are placed here as reported, flagged, for completeness only.',
    weekdayTithi: 'The ring-4 weekday↔tithi-group pairing is attested by one modern site among the sources checked; it '
      + 'also needs a plate-check. Kept as reported, flagged.',
  },
  cite: 'sarvatobhadrachakra.com/introduction-of-sarvatobhadra-chakra/ (ring-by-ring); saravali.github.io/astrology/sbc_basics.html (Aśvinī 6th in the upper row, clockwise, Abhijit between U.Āṣāḍhā & Śravaṇa); en.wikipedia.org/wiki/Sarvatobhadra_Chakra (81 vargas, NE Īśāna start, tithi pentads). Ring-2 consonants FLAGGED (single source).',
};

// convenience: every top-level dataset, for the "every record has .cite" audit.
export const RASA_DATASETS = { TEXTS, SAMSKARAS, APPARATUS, NAVAGRAHA_YANTRAS, CLASSICAL_SQUARES };
