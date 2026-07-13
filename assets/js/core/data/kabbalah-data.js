// ============================================================================
//  kabbalah-data.js — the kabbalistic TREE OF LIFE in the layout Athanasius
//  Kircher printed (Oedipus Aegyptiacus, tom. II, Rome 1652–54) and the Golden
//  Dawn adopted: the 10 SEPHIROTH (with the GD sphere-ladder and the seven
//  planetary rows that join the repo's seven kameas), the 22 PATHS with their
//  Hebrew letters and GD trump attributions (the join keys match the repo's
//  tarot deck exactly), the 22-letter HEBREW ALPHABET with standard gematria
//  values (the finals 500–900 flagged as the mispar-gadol VARIANT, never the
//  default), the Sefer Yetzirah RECENSIONS with their contested dating, the
//  planet-spread of the seven DOUBLE letters BY VERSION (the Golden Dawn's own
//  order matches NO manuscript recension — flagged, never resolved), the
//  documented DISPUTES, and the dated TRANSMISSION layering.
//
//  PURE DATA + tiny helpers — no DOM, no engine imports. Every record carries
//  its citation; every contested value is flagged in-data and NEVER resolved.
//
//  HONEST FRAMING: the Tree is a LAYERED medieval-to-modern symbolic
//  construction of NO demonstrated validity. The Sefer Yetzirah (dating
//  contested — mainstream c. 2nd–6th c. CE, proposals 2nd–9th) knows ten
//  "sefirot belimah" as abstract NUMBERS only; the named emanation scheme is
//  medieval (Bahir c. 1176, Zohar c. 1286); the first printed tree (Portae
//  Lucis, 1516) had only 17 paths; the 22-path layout here is Kircher's
//  (1652–54); the tarot–letter linkage begins with Lévi (1854–56, a DIFFERENT
//  scheme); the GD table is c. 1887–1900; Crowley edited it 1904/1944.
//  Recorded for study — described, never prescribed.
// ============================================================================

// --- shared citation strings --------------------------------------------------
const CITE_SEPHIROTH = 'Crowley, 777 (1909; rev. 1955), Key Scale rows 1–10 ("Heavens of Assiah" column); Regardie, The Golden Dawn (Llewellyn, 6th ed. 1989), Tree of Life knowledge lectures; the sphere-ladder matches Agrippa, Three Books of Occult Philosophy II.13 & III.10.';
const CITE_PATHS = 'Regardie, The Golden Dawn (Llewellyn, 6th ed. 1989), Book T & the Tree of Life lectures; Crowley, 777 (1909; rev. 1955), Key Scale rows 11–32. GD standard; letter spellings & trump ids join the repo tarot deck (data/tarot-deck.js) exactly.';
const CITE_LETTERS = 'Standard values (mispar hechrachi) per Kaplan, Sefer Yetzirah: The Book of Creation, rev. ed. (Weiser, 1997), ch. 2 commentary; finals 500–900 are the MISPAR-GADOL VARIANT, not the default (standard counting values finals as medials). GD transliteration spellings kept for the tarot-deck join.';
const CITE_KIRCHER = 'Athanasius Kircher, Oedipus Aegyptiacus, tom. II (Rome, 1652–54), the tree engraving; Regardie, The Golden Dawn (Llewellyn, 6th ed.), Tree diagrams.';

// --- layout & orientation ------------------------------------------------------
// Normalized coordinates: x 0 = viewer-LEFT (Pillar of Severity), 0.5 = Middle
// Pillar, 1 = viewer-RIGHT (Pillar of Mercy); y 0 = Kether (top) … 6 = Malkuth.
export const ORIENTATION = {
  note: 'Convention stated (it varies!): this diagram follows the Kircher engraving and the GD diagrams AS VIEWED — the Pillar of Mercy (Chokmah 2, Chesed 4, Netzach 7) on the VIEWER’S RIGHT, the Pillar of Severity (Binah 3, Geburah 5, Hod 8) on the viewer’s left. Some texts describe left/right from the Tree’s own "body" perspective, which reverses the naming.',
  cite: 'GD Flying Roll "Right and Left Pillars": "The Pillar of severity lies on the left hand side of the Tree of life as you look at it as a diagram drawn on a piece of paper, but on the right hand side of the body"; ' + CITE_KIRCHER,
};

// --- the ten sephiroth ----------------------------------------------------------
// planet / kameaPlanet: ONLY the middle seven carry a planet; the kameaPlanet
// joins core/data/kameas.js (Agrippa II.22, Saturn 3×3 … Moon 9×9) exactly.
// Kether, Chokmah and Malkuth are NOT planets — Primum Mobile / Zodiac-sphere /
// Elements-sphere; the outer-planet glosses are unsettled 20th-c. accretions,
// flagged in `variants` and in DISPUTES, never adopted.
export const SEPHIROTH = [
  {
    num: 1, key: 'kether', name: 'Kether', hebrew: 'כתר', translation: 'Crown',
    pillar: 'middle', x: 0.5, y: 0,
    sphere: 'Rashith ha-Gilgalim — the Primum Mobile (the "first swirlings")',
    planet: null, kameaPlanet: null,
    godName: 'Eheieh', archangel: 'Metatron', choir: 'Chayoth ha-Qadesh', queenColor: 'white brilliance',
    variants: 'NOT a planet. 20th-c. glosses give Kether Pluto, Neptune or Uranus in mutually contradictory schemes (e.g. Dion Fortune: Neptune) — unsettled modern accretions absent from 777 rows 1–10; flagged, never adopted.',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 2, key: 'chokmah', name: 'Chokmah', hebrew: 'חכמה', translation: 'Wisdom',
    pillar: 'mercy', x: 1, y: 1,
    sphere: 'Masloth (777 prints "Mazloth"; Agrippa Latinizes "Masloth" — both attested) — the sphere of the Zodiac / fixed stars',
    planet: null, kameaPlanet: null,
    godName: 'Yah', archangel: 'Ratziel', choir: 'Auphanim', queenColor: 'grey',
    variants: 'NOT a planet. 20th-c. glosses give Chokmah Neptune or Uranus (e.g. Dion Fortune: Uranus) — unsettled; flagged, never adopted.',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 3, key: 'binah', name: 'Binah', hebrew: 'בינה', translation: 'Understanding',
    pillar: 'severity', x: 0, y: 1,
    sphere: 'Shabbathai — the sphere of Saturn',
    planet: 'Saturn', kameaPlanet: 'Saturn',
    godName: 'YHVH Elohim', archangel: 'Tzaphqiel', choir: 'Aralim', queenColor: 'black',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 4, key: 'chesed', name: 'Chesed', also: 'Gedulah', hebrew: 'חסד', translation: 'Mercy / Love',
    pillar: 'mercy', x: 1, y: 2,
    sphere: 'Tzedek — the sphere of Jupiter',
    planet: 'Jupiter', kameaPlanet: 'Jupiter',
    godName: 'El', archangel: 'Tzadqiel', choir: 'Chashmalim', queenColor: 'blue',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 5, key: 'geburah', name: 'Geburah', also: 'Din, Pachad', hebrew: 'גבורה', translation: 'Strength / Severity',
    pillar: 'severity', x: 0, y: 2,
    sphere: 'Madim — the sphere of Mars',
    planet: 'Mars', kameaPlanet: 'Mars',
    godName: 'Elohim Gibor', archangel: 'Kamael', choir: 'Seraphim', queenColor: 'scarlet red',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 6, key: 'tiphareth', name: 'Tiphareth', hebrew: 'תפארת', translation: 'Beauty',
    pillar: 'middle', x: 0.5, y: 3,
    sphere: 'Shemesh — the sphere of the Sun',
    planet: 'Sun', kameaPlanet: 'Sun',
    godName: 'YHVH Eloah va-Daath', archangel: 'Raphael', choir: 'Malachim', queenColor: 'yellow (gold)',
    variants: 'Archangel tension, flagged: the TREE scheme (Agrippa III.10; 777) puts Raphael here (the Sun-sphere), yet PLANETARY working (Heptameron; the GD’s own planetary rituals) gives Michael to the Sun — both attested, never harmonized.',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 7, key: 'netzach', name: 'Netzach', hebrew: 'נצח', translation: 'Victory / Endurance',
    pillar: 'mercy', x: 1, y: 4,
    sphere: 'Nogah — the sphere of Venus',
    planet: 'Venus', kameaPlanet: 'Venus',
    godName: 'YHVH Tzabaoth', archangel: 'Haniel', choir: 'Elohim', queenColor: 'emerald',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 8, key: 'hod', name: 'Hod', hebrew: 'הוד', translation: 'Splendour / Glory',
    pillar: 'severity', x: 0, y: 4,
    sphere: 'Kokab — the sphere of Mercury',
    planet: 'Mercury', kameaPlanet: 'Mercury',
    godName: 'Elohim Tzabaoth', archangel: 'Michael', choir: 'Beni Elohim', queenColor: 'orange',
    variants: 'Archangel tension, flagged: the TREE scheme (Agrippa III.10; 777) puts Michael here (the Mercury-sphere), yet PLANETARY working (Heptameron; GD rituals) gives Raphael to Mercury — both attested, never harmonized.',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 9, key: 'yesod', name: 'Yesod', hebrew: 'יסוד', translation: 'Foundation',
    pillar: 'middle', x: 0.5, y: 5,
    sphere: 'Levanah — the sphere of the Moon',
    planet: 'Moon', kameaPlanet: 'Moon',
    godName: 'Shaddai El Chai', archangel: 'Gabriel', choir: 'Kerubim', queenColor: 'violet',
    cite: CITE_SEPHIROTH,
  },
  {
    num: 10, key: 'malkuth', name: 'Malkuth', hebrew: 'מלכות', translation: 'Kingdom',
    pillar: 'middle', x: 0.5, y: 6,
    sphere: 'Cholem Yesodoth — the sphere of the four ELEMENTS',
    planet: null, kameaPlanet: null,
    godName: 'Adonai ha-Aretz (Agrippa: Adonai Melekh — both attested)',
    archangel: 'Sandalphon (some sources jointly Metatron/Sandalphon)', choir: 'Ashim',
    queenColor: 'citrine / olive / russet / black, quartered',
    variants: 'NOT a planet: "Earth" here means the element-sphere, not a planetary attribution.',
    cite: CITE_SEPHIROTH,
  },
];

// Daath — NOT one of the ten. Rendered dashed, never counted.
export const DAATH = {
  key: 'daath', hebrew: 'דעת', translation: 'Knowledge', x: 0.5, y: 1.6,
  note: 'NOT a sephirah — the "hidden" quasi-sephirah at the Abyss on the middle pillar, absent from Kircher’s ten and from Agrippa. As a DIAGRAM element it first appears with Knorr von Rosenroth’s Kabbala Denudata (1677–84), between Kether and Tiphareth — after Kircher, before the GD. 20th-c. outer-planet attributions (Uranus | Pluto | Neptune, e.g. Dion Fortune: Pluto) are unsettled — flagged, never adopted.',
  cite: 'Regardie, The Golden Dawn, Tree diagrams and lectures; 777 treats Daath outside Key Scale rows 1–10; Knorr von Rosenroth, Kabbala Denudata (1677–84) for the first diagram appearance.',
};

// --- the 22 paths (11–32), GD standard ------------------------------------------
// letter.translit is the JOIN KEY to the repo tarot deck's `hebrew` field
// (spellings verified identical: Vau, Zain, Cheth, Peh, Tzaddi, Qoph, Tau).
// disputeIds reference DISPUTES below — contested rows are flagged, never fixed.
export const PATHS = [
  { num: 11, from: 1, to: 2, letter: { name: 'Aleph', char: 'א', translit: 'Aleph', value: 1 }, letterClass: 'mother', correspondence: 'Air', gdTrump: { id: 'the-fool', name: 'The Fool', number: 0 }, cite: CITE_PATHS },
  { num: 12, from: 1, to: 3, letter: { name: 'Beth', char: 'ב', translit: 'Beth', value: 2 }, letterClass: 'double', correspondence: 'Mercury', gdTrump: { id: 'the-magician', name: 'The Magician', number: 1 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 13, from: 1, to: 6, letter: { name: 'Gimel', char: 'ג', translit: 'Gimel', value: 3 }, letterClass: 'double', correspondence: 'Moon', gdTrump: { id: 'the-high-priestess', name: 'The High Priestess', number: 2 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 14, from: 2, to: 3, letter: { name: 'Daleth', char: 'ד', translit: 'Daleth', value: 4 }, letterClass: 'double', correspondence: 'Venus', gdTrump: { id: 'the-empress', name: 'The Empress', number: 3 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 15, from: 2, to: 6, letter: { name: 'Heh', char: 'ה', translit: 'Heh', value: 5 }, letterClass: 'simple', correspondence: 'Aries', gdTrump: { id: 'the-emperor', name: 'The Emperor', number: 4 }, disputeIds: ['tzaddi-heh'], cite: CITE_PATHS },
  { num: 16, from: 2, to: 4, letter: { name: 'Vau', char: 'ו', translit: 'Vau', value: 6 }, letterClass: 'simple', correspondence: 'Taurus', gdTrump: { id: 'the-hierophant', name: 'The Hierophant', number: 5 }, cite: CITE_PATHS },
  { num: 17, from: 3, to: 6, letter: { name: 'Zain', char: 'ז', translit: 'Zain', value: 7 }, letterClass: 'simple', correspondence: 'Gemini', gdTrump: { id: 'the-lovers', name: 'The Lovers', number: 6 }, cite: CITE_PATHS },
  { num: 18, from: 3, to: 5, letter: { name: 'Cheth', char: 'ח', translit: 'Cheth', value: 8 }, letterClass: 'simple', correspondence: 'Cancer', gdTrump: { id: 'the-chariot', name: 'The Chariot', number: 7 }, cite: CITE_PATHS },
  { num: 19, from: 4, to: 5, letter: { name: 'Teth', char: 'ט', translit: 'Teth', value: 9 }, letterClass: 'simple', correspondence: 'Leo', gdTrump: { id: 'strength', name: 'Strength', number: 8 }, disputeIds: ['strength-justice'], cite: CITE_PATHS },
  { num: 20, from: 4, to: 6, letter: { name: 'Yod', char: 'י', translit: 'Yod', value: 10 }, letterClass: 'simple', correspondence: 'Virgo', gdTrump: { id: 'the-hermit', name: 'The Hermit', number: 9 }, cite: CITE_PATHS },
  { num: 21, from: 4, to: 7, letter: { name: 'Kaph', char: 'כ', translit: 'Kaph', value: 20 }, letterClass: 'double', correspondence: 'Jupiter', gdTrump: { id: 'wheel-of-fortune', name: 'Wheel of Fortune', number: 10 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 22, from: 5, to: 6, letter: { name: 'Lamed', char: 'ל', translit: 'Lamed', value: 30 }, letterClass: 'simple', correspondence: 'Libra', gdTrump: { id: 'justice', name: 'Justice', number: 11 }, disputeIds: ['strength-justice'], cite: CITE_PATHS },
  { num: 23, from: 5, to: 8, letter: { name: 'Mem', char: 'מ', translit: 'Mem', value: 40 }, letterClass: 'mother', correspondence: 'Water', gdTrump: { id: 'the-hanged-man', name: 'The Hanged Man', number: 12 }, cite: CITE_PATHS },
  { num: 24, from: 6, to: 7, letter: { name: 'Nun', char: 'נ', translit: 'Nun', value: 50 }, letterClass: 'simple', correspondence: 'Scorpio', gdTrump: { id: 'death', name: 'Death', number: 13 }, cite: CITE_PATHS },
  { num: 25, from: 6, to: 9, letter: { name: 'Samekh', char: 'ס', translit: 'Samekh', value: 60 }, letterClass: 'simple', correspondence: 'Sagittarius', gdTrump: { id: 'temperance', name: 'Temperance', number: 14 }, cite: CITE_PATHS },
  { num: 26, from: 6, to: 8, letter: { name: 'Ayin', char: 'ע', translit: 'Ayin', value: 70 }, letterClass: 'simple', correspondence: 'Capricorn', gdTrump: { id: 'the-devil', name: 'The Devil', number: 15 }, cite: CITE_PATHS },
  { num: 27, from: 7, to: 8, letter: { name: 'Peh', char: 'פ', translit: 'Peh', value: 80 }, letterClass: 'double', correspondence: 'Mars', gdTrump: { id: 'the-tower', name: 'The Tower', number: 16 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 28, from: 7, to: 9, letter: { name: 'Tzaddi', char: 'צ', translit: 'Tzaddi', value: 90 }, letterClass: 'simple', correspondence: 'Aquarius', gdTrump: { id: 'the-star', name: 'The Star', number: 17 }, disputeIds: ['tzaddi-heh'], cite: CITE_PATHS },
  { num: 29, from: 7, to: 10, letter: { name: 'Qoph', char: 'ק', translit: 'Qoph', value: 100 }, letterClass: 'simple', correspondence: 'Pisces', gdTrump: { id: 'the-moon', name: 'The Moon', number: 18 }, cite: CITE_PATHS },
  { num: 30, from: 8, to: 9, letter: { name: 'Resh', char: 'ר', translit: 'Resh', value: 200 }, letterClass: 'double', correspondence: 'Sun', gdTrump: { id: 'the-sun', name: 'The Sun', number: 19 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
  { num: 31, from: 8, to: 10, letter: { name: 'Shin', char: 'ש', translit: 'Shin', value: 300 }, letterClass: 'mother', correspondence: 'Fire', correspondence2: 'Spirit (GD dual attribution, 777 row 31 bis)', gdTrump: { id: 'judgement', name: 'Judgement', number: 20 }, cite: CITE_PATHS },
  { num: 32, from: 9, to: 10, letter: { name: 'Tau', char: 'ת', translit: 'Tau', value: 400 }, letterClass: 'double', correspondence: 'Saturn', correspondence2: 'Earth (GD dual attribution, 777 row 32 bis)', gdTrump: { id: 'the-world', name: 'The World', number: 21 }, disputeIds: ['sy-double-planets'], cite: CITE_PATHS },
];

// --- the Hebrew alphabet (22 letters; 5 finals as the mispar-gadol VARIANT) -----
export const HEBREW_LETTERS = [
  { char: 'א', name: 'Aleph', translit: 'Aleph', value: 1, cite: CITE_LETTERS },
  { char: 'ב', name: 'Beth', translit: 'Beth', value: 2, cite: CITE_LETTERS },
  { char: 'ג', name: 'Gimel', translit: 'Gimel', value: 3, cite: CITE_LETTERS },
  { char: 'ד', name: 'Daleth', translit: 'Daleth', value: 4, cite: CITE_LETTERS },
  { char: 'ה', name: 'Heh', translit: 'Heh', value: 5, cite: CITE_LETTERS },
  { char: 'ו', name: 'Vau', translit: 'Vau', value: 6, cite: CITE_LETTERS },
  { char: 'ז', name: 'Zain', translit: 'Zain', value: 7, cite: CITE_LETTERS },
  { char: 'ח', name: 'Cheth', translit: 'Cheth', value: 8, cite: CITE_LETTERS },
  { char: 'ט', name: 'Teth', translit: 'Teth', value: 9, cite: CITE_LETTERS },
  { char: 'י', name: 'Yod', translit: 'Yod', value: 10, cite: CITE_LETTERS },
  { char: 'כ', name: 'Kaph', translit: 'Kaph', value: 20, finalChar: 'ך', finalValue: 500, cite: CITE_LETTERS },
  { char: 'ל', name: 'Lamed', translit: 'Lamed', value: 30, cite: CITE_LETTERS },
  { char: 'מ', name: 'Mem', translit: 'Mem', value: 40, finalChar: 'ם', finalValue: 600, cite: CITE_LETTERS },
  { char: 'נ', name: 'Nun', translit: 'Nun', value: 50, finalChar: 'ן', finalValue: 700, cite: CITE_LETTERS },
  { char: 'ס', name: 'Samekh', translit: 'Samekh', value: 60, cite: CITE_LETTERS },
  { char: 'ע', name: 'Ayin', translit: 'Ayin', value: 70, cite: CITE_LETTERS },
  { char: 'פ', name: 'Peh', translit: 'Peh', value: 80, finalChar: 'ף', finalValue: 800, cite: CITE_LETTERS },
  { char: 'צ', name: 'Tzaddi', translit: 'Tzaddi', value: 90, finalChar: 'ץ', finalValue: 900, cite: CITE_LETTERS },
  { char: 'ק', name: 'Qoph', translit: 'Qoph', value: 100, cite: CITE_LETTERS },
  { char: 'ר', name: 'Resh', translit: 'Resh', value: 200, cite: CITE_LETTERS },
  { char: 'ש', name: 'Shin', translit: 'Shin', value: 300, cite: CITE_LETTERS },
  { char: 'ת', name: 'Tau', translit: 'Tau', value: 400, cite: CITE_LETTERS },
];
export const FINALS_NOTE = 'The five final forms (ך ם ן ף ץ = 500–900) are the MISPAR-GADOL variant — standard counting (mispar hechrachi) values finals the same as medials. Flagged, never the default. Repo precedent: the Moon-kamea note (data/kameas.js) already uses final-nun-as-700 in one recorded name derivation.';

// --- the SY double-letter planet spread, BY VERSION (contested — NEVER resolved) —
export const SY_PLANET_SPREAD = {
  what: 'Which planet belongs to each of the seven DOUBLE letters? The Sefer Yetzirah recensions disagree with each other, and the Golden Dawn invented a further order that matches NO manuscript. Four attested columns, shown side by side and never resolved. The GD column is this page’s display standard ONLY because the tree shown is the GD’s — not because it is right.',
  letters: ['Beth', 'Gimel', 'Daleth', 'Kaph', 'Peh', 'Resh', 'Tau'],
  columns: [
    {
      key: 'shortLongSaadia', label: 'Short / Long / Saadia recensions',
      order: 'descending Chaldean (Saturn → Moon)',
      planets: ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'],
      note: 'All three principal recensions agree, as do the 10th–11th-c. witnesses Karr tabulates (Donnolo, Ha-Levi, Hayman MSS A & C). Saadia ch. V §5, verbatim: Beth — "formed of it: Saturn in the universe, the Sabbath in the year, and the mouth in the soul."',
      cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997), ch. 4 commentary & comparison table (appendix prints the versions; the precise chapter/page of the table needs a physical-copy check before page-level citation); Saadia recension text (Matheson Trust, Lambert/Thompson-Marson trans.), ch. V; collation at psyche.com (adapted from Kaplan).',
    },
    {
      key: 'gra', label: 'Gra version (Kaplan’s main text)',
      order: 'Moon, Mars, Sun, Venus, Mercury, Saturn, Jupiter',
      planets: ['Moon', 'Mars', 'Sun', 'Venus', 'Mercury', 'Saturn', 'Jupiter'],
      note: '18th-c. Gaon-of-Vilna redaction. Gra ch. 4, verbatim: "He made the letter Bet king over Wisdom … and with them He formed the Moon in the Universe." Kaplan describes it as influenced by the Zohar’s scheme — but see the gra-zohar dispute: the sources conflict on what the Zohar’s scheme even is.',
      cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997), Gra version ch. 4 (also on Sefaria); Karr’s Column II lists Westcott, Kalisch and M. P. Hall with this order.',
    },
    {
      key: 'zohar', label: 'Zohar (13th c.) — position UNCERTAIN',
      order: 'Moon, Mars, Sun, Saturn, Jupiter, Venus, Mercury (as tabulated at psyche.com)',
      planets: ['Moon', 'Mars', 'Sun', 'Saturn', 'Jupiter', 'Venus', 'Mercury'],
      uncertain: true,
      note: 'Genuinely conflicting sources, shown not resolved: this row (psyche.com’s tabulation) matches the Gra on only 3 of 7 letters, while Karr’s appendix files the Zohar under the CHALDEAN column. Documented as a spread, never harmonized.',
      cite: 'psyche.com/psyche/yetsira/sy_planetaryattributions.html (Zohar row); Karr, "Notes on Editions of Sefer Yetzirah in English", appendix (Zohar listed under Column I).',
    },
    {
      key: 'goldenDawn', label: 'Golden Dawn (c. 1887–1900)',
      order: 'Mercury, Moon, Venus, Jupiter, Mars, Sun, Saturn',
      planets: ['Mercury', 'Moon', 'Venus', 'Jupiter', 'Mars', 'Sun', 'Saturn'],
      matchesNoManuscript: true,
      note: 'Matches NO manuscript recension of the Sefer Yetzirah — it follows the GD’s tarot-trump sequence, not any text of SY.',
      cite: 'Regardie, The Golden Dawn (Knowledge Lectures; Book T); variance vs the manuscripts per Kaplan’s comparison table and Karr’s appendix.',
    },
  ],
  karrQuote: {
    text: 'no text of SY among those consulted agrees with column IV, the Golden Dawn scheme—not even that of Golden Dawn founder W. W. Westcott.',
    source: 'Don Karr, "Notes on Editions of Sefer Yetzirah in English" (The Matheson Trust), planetary-attribution appendix.',
  },
  cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997), ch. 4 commentary & comparison table; Don Karr, "Notes on Editions of Sefer Yetzirah in English"; Saadia recension (Matheson Trust PDF); Sefaria (Gra version ch. 4); psyche.com collation.',
};

// --- documented disputes (flags only — the site NEVER resolves them) ------------
export const DISPUTES = [
  {
    id: 'sy-double-planets',
    what: 'The double-letter planet attributions vary radically between Sefer Yetzirah recensions (Short/Long/Saadia = descending Chaldean Saturn→Moon; Gra = Moon,Mars,Sun,Venus,Mercury,Saturn,Jupiter; the Zohar row is itself uncertain), and the Golden Dawn’s order (Mercury,Moon,Venus,Jupiter,Mars,Sun,Saturn) matches NO manuscript — it follows the trump sequence. See SY_PLANET_SPREAD for the full table.',
    cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997), ch. 4 commentary & comparison table; Karr, "Notes on Editions of Sefer Yetzirah in English", appendix; psyche.com collation.',
  },
  {
    id: 'tzaddi-heh',
    what: 'Crowley’s Star/Emperor letter swap: Liber AL vel Legis I:57 ("All these old letters of my Book are aright; but [Tzaddi] is not the Star") led Crowley to give the Star to Heh and the Emperor to Tzaddi, with an Aries/Aquarius "counterchange" about Pisces explained in The Book of Thoth (1944). The GD standard (Emperor=Heh=Aries, path 15; Star=Tzaddi=Aquarius, path 28) is what this site’s tarot deck encodes — kept as display standard, with Crowley’s as a documented variant.',
    cite: 'Crowley, Liber AL vel Legis (1904) I:57 (wording per unanimous secondary quotations; primary fetches were blocked this session); Crowley, The Book of Thoth (1944); GD standard per Regardie, Book T; repo: data/tarot-deck.js keeps GD.',
  },
  {
    id: 'agrippa-division',
    what: 'Agrippa’s letter scheme is NOT the SY/GD scheme. Three Books I.74 (primary text verified) divides the alphabet with mothers = Aleph, Vau, Yod signifying "three Elements, viz. Fire, Water, and Earth" (no Air; Mem and Shin demoted to SIMPLES); only the seven doubles (Beth, Gimel, Daleth, Kaph, Peh, Resh, Tau) match. Any column labelled "Agrippa" must use HIS table. Note also: Agrippa (d. 1535) predates the Kircher tree (1652–54) and has NO tarot and NO path diagram — and the division sits in Book I ch. 74, NOT Book III as commonly assumed (Book III carries the divine-name Kabbalah via Reuchlin).',
    cite: 'Agrippa, Three Books of Occult Philosophy I.74 (1651 J.F. trans.; Wikisource & EEBO A26565 1:13.74, both fetched); early printings of the letter tables vary — cross-check Peterson’s edition before extending.',
  },
  {
    id: 'westcott-latin',
    what: 'Westcott’s Sepher Yetzirah (1887) — the Golden Dawn’s source text — was translated FROM THE LATIN versions, not from Hebrew, despite its title page. Which Latin is itself contested: Karr/Kuntz say the 1887 first edition used Pistorius & Postel, while Waite says it rests on Rittangelius (1642); Latin-dependence is unanimous.',
    cite: 'Karr, "Notes on Editions of Sefer Yetzirah in English" ("appears to have been totally dependent on a Latin version"); Waite quoted in Karr re Rittangelius; Westcott, Sepher Yetzirah (1887; 1893/1911 eds. claim collation).',
  },
  {
    id: 'outer-planets',
    what: 'Kether / Chokmah / Daath outer-planet attributions are 20th-century accretions with NO settled standard: Dion Fortune gives Neptune=Kether, Uranus=Chokmah, Pluto=Daath; other documented schemes give Uranus or Pluto to Kether and Neptune to Daath. The GD/777 canon (rows 1–10) gives only Primum Mobile / Zodiac / Elements. Flagged, never adopted. (The repo’s tarot deck handles the parallel trump case the same honest way: "Air (Uranus)", "Water (Neptune)", "Fire (Pluto)" as glossed modern additions.)',
    cite: '777 (1909/1955) rows 1–10 contain no outer planets; Dion Fortune’s scheme and contradictory later schemes documented in 20th-c. usage (Book-of-Thoth era onward); repo: data/tarot-deck.js.',
  },
  {
    id: 'gra-zohar',
    what: 'Does the Gra version follow "the Zohar’s scheme"? Kaplan says so, but the sources conflict on what the Zohar’s scheme is: psyche.com’s Zohar row (Moon,Mars,Sun,Saturn,Jupiter,Venus,Mercury) matches the Gra on only 3 of 7 letters, and Karr’s appendix files the Zohar under the Chaldean column. Attributed to Kaplan, documented as a spread, never resolved.',
    cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997); psyche.com Zohar row vs Gra row; Karr, appendix column lists.',
  },
  {
    id: 'strength-justice',
    what: 'Trump numbering variant: the GD and RWS number Strength VIII (Teth/Leo) and Justice XI (Lamed/Libra), reversing the older Marseille order (Justice 8, Strength 11). The repo deck follows GD/RWS — variant noted, encoding kept.',
    cite: 'Regardie, The Golden Dawn, Book T; Waite, Pictorial Key to the Tarot (1911); repo: data/tarot-deck.js (Strength 8, Justice 11).',
  },
  {
    id: 'michael-raphael',
    what: 'Raphael=Tiphareth (Sun-sphere) and Michael=Hod (Mercury-sphere) on the TREE (Agrippa III.10; 777), yet Michael=Sun and Raphael=Mercury in PLANETARY working (Heptameron; the GD’s own planetary rituals) — both attested, never harmonized. Peterson notes Peter of Abano’s authentic Conciliator (1303) assigns them differently again.',
    cite: 'Agrippa, Three Books III.10; 777, archangel column rows 6 & 8; pseudo-Peter de Abano, Heptameron (Sunday/Michael, Wednesday/Raphael).',
  },
  {
    id: 'levi-fool',
    what: 'The GD tarot–letter scheme is NOT the only historical one: Éliphas Lévi (Dogme et rituel de la haute magie, 1854–56) assigned letters sequentially from Magician=Aleph and placed the Fool=Shin between trumps XX and XXI, offsetting every attribution by one relative to the GD.',
    cite: 'Lévi, Dogme et rituel de la haute magie (1854–56); the GD broke with this arrangement c. 1887–1900 (Cipher Manuscripts).',
  },
  {
    id: 'tree-layouts',
    what: 'The "standard" 22-path layout is Kircher’s (1652–54). Lurianic/Gra trees route several paths differently and do NOT support the GD letter table; the first printed tree (Portae Lucis, 1516) had only 17 paths. Layout-dependence flagged: the GD letter-to-path table only works on Kircher’s diagram.',
    cite: 'Kircher, Oedipus Aegyptiacus II (1652–54); Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997) prints the Gra tree; Gikatilla, Portae Lucis (Augsburg, 1516) — 17 paths, woodcut credited to Reuchlin’s circle.',
  },
];

// --- the Sefer Yetzirah: recensions & contested dating ---------------------------
export const SY_RECENSIONS = {
  versions: [
    { key: 'short', name: 'Short recension', note: '~1,300 words; basis of the first Hebrew printing — the Mantua 1562 editio princeps, which in fact printed BOTH recensions (the short as the main text surrounded by commentaries, the long as "Mantua II").', cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997), Appendix I; Karr, "Notes on Editions of Sefer Yetzirah in English".' },
    { key: 'long', name: 'Long recension', note: '~2,500 words; contains entire paragraphs not found in the shorter version.', cite: 'Kaplan, Appendix I; Hayman, Sefer Yesira (Mohr Siebeck, 2004); Karr.' },
    { key: 'saadia', name: 'Saadia recension', note: 'Intermediate per Karr ("somewhere in between"); Wikipedia instead calls it a reorganized long version — a documented spread, footnoted not resolved. Base text of Saadia Gaon’s commentary (931 CE). A 2023 Genizah-based study argues it may preserve the OLDEST form of the text.', cite: 'Karr; Kaplan, Appendix I; "The Earliest Version of Sefer Yeṣirah", Aleph: Historical Studies in Science and Judaism 23:1–2 (2023), pp. 7–50.' },
    { key: 'gra', name: 'Gra version', note: 'Later redaction in the Gaon-of-Vilna line (18th c., refining Cordovero/Luria); the main text of Kaplan’s edition (1990; rev. 1997).', cite: 'Kaplan, Sefer Yetzirah, rev. ed. (Weiser, 1997); Karr ("ARI/GRA (Kaplan – 1990)").' },
  ],
  dating: {
    range: 'UNRESOLVED — shown as a range, never a date: proposals span the 2nd century CE (or earlier core — Kaplan argues the traditional R. Akiba-era attribution) through the 9th century (Wasserstrom’s Islamic-milieu argument); the broad mainstream is a 2nd–6th-c. CE composition/compilation; the first FIRM attestations are the 10th-century commentaries (Saadia Gaon 931 CE, Dunash ibn Tamim, Shabbetai Donnolo).',
    cite: 'Kaplan, rev. ed. (Weiser, 1997), Introduction; Karr ("most scholars agree that it was written or compiled between the second and sixth centuries"); Steven M. Wasserstrom, "Sefer Yesira and Early Islam: A Reappraisal", Journal of Jewish Thought and Philosophy 3:1 (1993); Hayman, Sefer Yesira (Mohr Siebeck, 2004).',
  },
  criticalText: {
    name: 'A. Peter Hayman, Sefer Yesira: Edition, Translation and Text-Critical Commentary (Mohr Siebeck, Texts and Studies in Ancient Judaism 104, 2004)',
    note: 'The scholarly critical text — a synoptic edition of the earliest manuscripts of all three recensions, with apparatus from nineteen manuscripts.',
    cite: 'Mohr Siebeck catalogue; WorldCat.',
  },
  belimahNote: 'The Sefer Yetzirah itself speaks of ten "sefirot belimah" as abstract NUMBERS — not the later named-emanation scheme, which is medieval Kabbalah (Bahir c. 1176; Zohar c. 1286; Gikatilla).',
  cite: 'Kaplan, rev. ed. (Weiser, 1997); Hayman (2004); Karr, "Notes on Editions of Sefer Yetzirah in English".',
};

// --- the dated transmission layering (SY → … → Crowley) --------------------------
export const TRANSMISSION = [
  { when: 'c. 2nd–6th c. CE (contested: 2nd–9th-c. proposals)', what: 'Sefer Yetzirah composed/compiled — ten "sefirot belimah" as abstract numbers, 22 letters divided 3 mothers / 7 doubles / 12 simples. No named emanations, no tree diagram, no tarot.', cite: 'Kaplan, rev. ed. (1997), Introduction; Karr; Wasserstrom (1993) for the late pole.' },
  { when: '10th c.', what: 'First firm attestations: the commentaries of Saadia Gaon (931 CE), Dunash ibn Tamim and Shabbetai Donnolo; the earliest surviving manuscripts are 10th-c. Genizah fragments.', cite: 'Kaplan; Hayman (2004); Stanford Encyclopedia of Philosophy (Saadya).' },
  { when: 'c. 1176 / c. 1286', what: 'The named-sephiroth emanation doctrine is medieval Kabbalah: the Bahir (Provence, c. 1176) and the Zohar (c. 1286, largely Moses de León).', cite: 'Kaplan, Introduction; standard datings.' },
  { when: '1516', what: 'Earliest PRINTED tree diagram — title page of Gikatilla’s Portae Lucis (Augsburg; Paulus Ricius trans.) — with only 17 paths.', cite: 'Gikatilla, Portae Lucis (1516); the 22-path form is later.' },
  { when: '1517 / 1533', what: 'Christian Kabbalah: Reuchlin, De arte cabalistica (1517), a major conduit to Agrippa, whose Three Books (complete ed. 1533) carry the 3/7/12 letter division at Book I ch. 74 — NOT Book III — with a DIFFERENT division (mothers Aleph-Vau-Yod = Fire, Water, Earth).', cite: 'Reuchlin (1517); Agrippa, Three Books I.74 (Wikisource/EEBO, verified); see dispute agrippa-division.' },
  { when: '1552', what: 'FIRST PRINTING of the Sefer Yetzirah in any language: Guillaume Postel’s Latin translation (Abrahami Patriarchae liber Iezirah, Paris) — ten years before the first Hebrew edition.', cite: 'Bonhams lot descriptions ("the first printing in any language").' },
  { when: '1562', what: 'First HEBREW edition: Mantua, printed by Jacob ben Naphtali ha-Kohen of Gazzuolo — containing BOTH recensions (short as main text, long as "Mantua II").', cite: 'Sotheby’s Important Judaica cat.; Wikipedia (editio princeps, two recensions).' },
  { when: '1587', what: 'Second Latin translation: Johannes Pistorius, in Artis Cabalisticae (Basel).', cite: 'Bonhams/Wellcome publication history.' },
  { when: '1652–54', what: 'Athanasius Kircher, Oedipus Aegyptiacus II (Rome): THE tree layout used on this page — 10 sephiroth, 22 lettered paths. Lurianic/Gra trees route paths differently and do not support the GD letter table.', cite: CITE_KIRCHER + ' See dispute tree-layouts.' },
  { when: '1677–84', what: 'Knorr von Rosenroth, Kabbala Denudata: Daath first appears as a diagram element (between Kether and Tiphareth) — after Kircher, before the GD.', cite: 'Kabbala Denudata (1677–84); see DAATH.' },
  { when: '1854–56', what: 'Éliphas Lévi, Dogme et rituel de la haute magie: the FIRST printed tarot–Hebrew-letter linkage — with a different scheme (Fool=Shin, between trumps XX and XXI).', cite: 'Lévi (1854–56); see dispute levi-fool.' },
  { when: '1887', what: 'W. Wynn Westcott’s English Sepher Yetzirah — translated FROM THE LATIN versions, not from Hebrew — becomes a Golden Dawn source text.', cite: 'Westcott (1887); Karr; see dispute westcott-latin.' },
  { when: 'c. 1887–1900', what: 'The Golden Dawn (Cipher Manuscripts, decoded by 1887) fuses SY letter-classes + Kircher tree + tarot trumps — substituting its OWN planetary order for the doubles, found in no manuscript.', cite: 'Regardie, The Golden Dawn; Karr ("not even … Westcott" agrees); see SY_PLANET_SPREAD.' },
  { when: '1904 / 1909 / 1944 / 1955', what: 'Crowley: Liber AL (1904) drives the Tzaddi/Heh swap; 777 published 1909 (anonymously); The Book of Thoth 1944; 777 revised 1955.', cite: 'Liber AL I:57; 777 (1909/1955); Book of Thoth (1944); see dispute tzaddi-heh.' },
  { when: '2023', what: 'Scholarship continues: a Genizah-based study argues the Saadia recension may preserve the oldest form of the text — the dating and textual history remain OPEN questions.', cite: '"The Earliest Version of Sefer Yeṣirah: Text, Format, Structure, and Genre", Aleph 23:1–2 (2023), pp. 7–50.' },
];

// --- verified pull-quotes ---------------------------------------------------------
// The famous Kaplan renderings (SY 1:1, 1:7, 2:4) are NOT quoted here: their
// exact wording needs a page-check against a physical copy of Kaplan (rev. ed.
// 1997) before hardcoding. These three WERE verified verbatim this project.
export const QUOTES = [
  {
    text: 'He made the letter Bet King … formed of it: Saturn in the universe, the Sabbath in the year, and the mouth in the soul.',
    source: 'Sefer Yetzirah, SAADIA recension, ch. V §5 (Lambert/Thompson-Marson trans., The Matheson Trust) — verified verbatim against the published text.',
    cite: 'Matheson Trust Saadia PDF, ch. V §5; the Chaldean column of SY_PLANET_SPREAD.',
  },
  {
    text: 'He made the letter Bet king over Wisdom … and with them He formed the Moon in the Universe.',
    source: 'Sefer Yetzirah, GRA version, ch. 4 (Sefaria text) — verified verbatim. The SAME letter, a DIFFERENT planet: the recensions genuinely disagree.',
    cite: 'Sefaria, Sefer Yetzirah Gra Version ch. 4; the Gra column of SY_PLANET_SPREAD.',
  },
  {
    text: 'no text of SY among those consulted agrees with column IV, the Golden Dawn scheme—not even that of Golden Dawn founder W. W. Westcott.',
    source: 'Don Karr, "Notes on Editions of Sefer Yetzirah in English" (The Matheson Trust), planetary-attribution appendix — verified verbatim.',
    cite: 'Karr, appendix; SY_PLANET_SPREAD.karrQuote.',
  },
];
export const KAPLAN_QUOTE_CAVEAT = 'Kaplan’s celebrated renderings (SY 1:1 "32 mystical paths of Wisdom"; 1:7 "like a flame in a burning coal"; 2:4 "231 Gates") are deliberately NOT quoted verbatim here: the exact wording awaits a page-check against a physical copy of the rev. ed. (Weiser, 1997).';

// --- tiny helpers (no DOM) --------------------------------------------------------
const SEPH_BY_NUM = new Map(SEPHIROTH.map(s => [s.num, s]));
const PATH_BY_NUM = new Map(PATHS.map(p => [p.num, p]));
const DISPUTE_BY_ID = new Map(DISPUTES.map(d => [d.id, d]));
export const sephira = num => SEPH_BY_NUM.get(num) || null;
export const path = num => PATH_BY_NUM.get(num) || null;
export const disputeById = id => DISPUTE_BY_ID.get(id) || null;
