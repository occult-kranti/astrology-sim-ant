// ============================================================================
//  kuta-data.js — the cited reference tables for VEDIC MARRIAGE MATCHING:
//  the aṣṭakūṭa (36-guṇa milāpa) of the North and the ten porutham of the
//  South (Tamil) tradition. This is a DATA module only (no DOM, no astronomy);
//  the pure scorer is core/kuta.js.
//
//  SENSITIVE DOMAIN. These tables encode a cultural matching CUSTOM. Nothing
//  here measures a real relationship, and nothing here is advice: the engine
//  reports "what the tradition computes", never a recommendation about people.
//  Astrology has no demonstrated validity — described, never prescribed.
//
//  PROVENANCE: every record carries a `.cite`. The primary source is the
//  saravali.github.io koota pages (transcribed VERBATIM and re-checked against
//  the raw HTML this build cycle), with each rule corroborated by at least one
//  independent published source (prokerala, epanchang, astroved, astrolight08,
//  stevehora). CONTESTED values (genuine disagreements BETWEEN sources) are
//  flagged in-data and NEVER silently resolved — both readings are kept and the
//  UI shows the dispute. Classical anchors: the aṣṭakūṭa to the Muhūrta
//  Cintāmaṇi of Rāma Daivajña (c. 1600, vivāha-prakaraṇa; archive.org, Haridas
//  Sanskrit Series #185) with the English tables of B. V. Raman's "Muhurtha";
//  the porutham to the Tamil pañcāṅga tradition (Kālaprakāśikā is the anchor
//  commonly cited but was NOT directly verified as the source — flagged).
//
//  The graha-maitrī / rāśyādhipati kūṭas REUSE the naisargika friendship table
//  NATURAL_RELATION already in vedic-data.js (BPHS 3.55–57) — kuta.js imports it
//  directly; it is NOT duplicated here. Aṣṭakūṭa uses NATURAL (naisargika)
//  friendship only, never the compound/temporal friendship.
// ============================================================================

// The eight kūṭas, their maxima (sum = 36), and the acceptance bands.
export const ASHTAKUTA_META = {
  kutas: [
    { key: 'varna', name: 'Varṇa', max: 1 },
    { key: 'vashya', name: 'Vaśya', max: 2 },
    { key: 'tara', name: 'Tārā (Dina)', max: 3 },
    { key: 'yoni', name: 'Yoni', max: 4 },
    { key: 'grahaMaitri', name: 'Graha-maitrī', max: 5 },
    { key: 'gana', name: 'Gaṇa', max: 6 },
    { key: 'bhakuta', name: 'Bhakūṭa (Rāśi)', max: 7 },
    { key: 'nadi', name: 'Nāḍī', max: 8 },
  ],
  total: 36,
  threshold: {
    minimum: 18,
    ramanSchool: 'B. V. Raman asks 21+ AND unafflicted 7th-house lords — the kūṭa score is necessary, not sufficient.',
    bands: '18–24 acceptable · 25–32 very good · 33–36 excellent',
    bandsContested: true,
    bandsNote: 'The exact band cut-offs VARY by source and were not independently verified — treat the bands as indicative only, never as a verdict. ⚑',
  },
  classicalAnchor: 'Muhūrta Cintāmaṇi of Rāma Daivajña (c. 1600), vivāha-prakaraṇa (archive.org, Haridas Sanskrit Series #185); English tables in B. V. Raman, "Muhurtha".',
  cite: 'https://saravali.github.io/astrology/astakoota.html ; B. V. Raman, "Muhurtha".',
};

// --- 1 · VARṆA (max 1) -------------------------------------------------------
// Moon-rāśi varṇa (not nakṣatra). Brahmin > Kṣatriya > Vaiśya > Śūdra.
// CONTESTED: the Vaiśya/Śūdra rows are the air/earth SWAP between sources.
export const VARNA = {
  rule: "Groom's varṇa rank ≥ bride's → 1 point, else 0 (hierarchy Brahmin > Kṣatriya > Vaiśya > Śūdra).",
  rank: { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 },
  // variant A — saravali (Vaiśya = air, Śūdra = earth)
  bySign_variantA_saravali: {
    Cancer: 'Brahmin', Scorpio: 'Brahmin', Pisces: 'Brahmin',
    Aries: 'Kshatriya', Leo: 'Kshatriya', Sagittarius: 'Kshatriya',
    Gemini: 'Vaishya', Libra: 'Vaishya', Aquarius: 'Vaishya',
    Taurus: 'Shudra', Virgo: 'Shudra', Capricorn: 'Shudra',
  },
  // variant B — the common (AstroSage-family) table (Vaiśya = earth, Śūdra = air)
  bySign_variantB_common: {
    Cancer: 'Brahmin', Scorpio: 'Brahmin', Pisces: 'Brahmin',
    Aries: 'Kshatriya', Leo: 'Kshatriya', Sagittarius: 'Kshatriya',
    Taurus: 'Vaishya', Virgo: 'Vaishya', Capricorn: 'Vaishya',
    Gemini: 'Shudra', Libra: 'Shudra', Aquarius: 'Shudra',
  },
  contested: true,
  contestedNote: 'The Vaiśya/Śūdra assignment of the AIR signs (Gemini/Libra/Aquarius) vs the EARTH signs (Taurus/Virgo/Capricorn) is SWAPPED between saravali and the common table. The Brahmin (water) and Kṣatriya (fire) rows agree everywhere. Both variants cover the 12 signs exactly once. ⚑ Displayed, never resolved.',
  cite: 'https://saravali.github.io/astrology/koota_varna.html vs https://astrolight08.wordpress.com/2018/08/24/horoscope-match-making-ashtkoot-milan/',
};

// --- 2 · VAŚYA (max 2) -------------------------------------------------------
// The five-class (saravali) method. The grid is ASYMMETRIC; rows = BRIDE.
// saravali's own Moon-sign column OMITS Sagittarius — encoded here with a
// FLAGGED completion so a Sagittarius Moon can be scored; with the completion
// disabled the engine THROWS rather than mis-score.
export const VASHYA = {
  rule: "The bride's Moon-sign class read against the groom's class in the 0–2 grid (rows = bride ↓, cols = groom →).",
  cols: ['Chatushpada', 'Manava', 'Jalachara', 'Leo', 'Scorpio'],
  // sign → class (saravali). Capricorn is split by half; Sagittarius is ABSENT.
  classBySign_saravali: {
    Aries: 'Chatushpada', Taurus: 'Chatushpada',
    Gemini: 'Manava', Virgo: 'Manava', Libra: 'Manava', Aquarius: 'Manava',
    Cancer: 'Jalachara', Pisces: 'Jalachara',
    Leo: 'Leo', Scorpio: 'Scorpio',
    // Capricorn: see capricornSplit ; Sagittarius: see sagittariusCompletion
  },
  capricornSplit: { firstHalf: 'Chatushpada', secondHalf: 'Jalachara', note: 'saravali: Capricorn 1st half = Chatuṣpada, 2nd half = Jalachara.' },
  // FLAGGED ADDITION — saravali genuinely omits Sagittarius; this completes the
  // table from the stevehora/classical (MC-lineage) scheme so a Sag Moon scores.
  sagittariusCompletion: {
    firstHalf: 'Manava', secondHalf: 'Chatushpada',
    flag: true,
    note: '⚑ FLAGGED ADDITION (not in saravali): saravali\'s 5-class Moon-sign table omits Sagittarius entirely, so as printed a Sagittarius Moon is UNCLASSIFIABLE. Completed here from the stevehora/classical MC-lineage table: Sagittarius 1st half = Mānava, 2nd half = Catuṣpada. With this completion disabled the engine throws rather than mis-score. (That source also renames Leo "Vanacara" and Scorpio "Keeṭa"; saravali\'s own class labels — Leo, Scorpio — are kept because the grid below is saravali\'s.)',
    cite: 'https://stevehora.substack.com/p/marriage-compatibility (Chatuṣpada: … 2nd half of Dhanu; Mānava: … 1st half of Dhanu, …).',
  },
  // the 0–2 grid, rows = BRIDE, cols = groom (saravali, verbatim)
  grid_rowsBride_colsGroom: {
    Chatushpada: [2, 0, 0, 0.5, 0],
    Manava: [1, 2, 1, 0.5, 1],
    Jalachara: [0.5, 1, 2, 1, 1],
    Leo: [0, 0, 0, 2, 0],
    Scorpio: [1, 1, 1, 0, 2],
  },
  orientationFlag: 'The grid is asymmetric; the bride-rows / groom-cols orientation is saravali\'s (its table is headed with the bride down the side). ⚑ Pinned to saravali.',
  methodBNote: 'A second method circulates — per-sign vaśya LISTS of the Muhūrta-Cintāmaṇi lineage (e.g. Aries → {Leo, Scorpio}) scored 2 / 1 (one-way) / 0. It was NOT verified this build cycle and is NOT implemented; method A (the five-class grid) is the cited default. ⚑',
  classVariantNote: 'Some sources add "2nd half of Sagittarius" to Chatuṣpada and reclassify Leo as Vanacara / Scorpio as Keeṭa — a class scheme distinct from saravali\'s. ⚑',
  cite: 'https://saravali.github.io/astrology/koota_vashya.html ; classification variant: https://stevehora.substack.com/p/marriage-compatibility',
};

// --- 3 · TĀRĀ / DINA (max 3) -------------------------------------------------
export const TARA = {
  rule: 'Count nakṣatras groom → bride inclusive, divide by 9; remainder ∈ {3, 5, 7} (Vipat / Pratyari / Vadha tārās) → 0, else 1.5. Repeat bride → groom for another 1.5. Total 0 / 1.5 / 3.',
  badRemainders: [3, 5, 7],
  half: 1.5,
  taraNames: ['Janma (1)', 'Sampat (2)', 'Vipat (3)', 'Kṣema (4)', 'Pratyari (5)', 'Sādhaka (6)', 'Vadha (7)', 'Maitra (8)', 'Ati-maitra (9/0)'],
  namesNote: 'Tārā-name spellings vary trivially between editions (Pratyak/Pratyari, Mitra/Maitra) — the nine slots are the same.',
  cite: 'https://saravali.github.io/astrology/koota_dina.html',
};

// --- 4 · YONI (max 4) --------------------------------------------------------
// The 27 nakṣatras → 14 animals (male/female), then the 14×14 points matrix.
// ROWS = BRIDE (saravali's header is "Bride ↓"), COLS = groom.
export const YONI = {
  rule: "The bride's yoni-animal read against the groom's in the 0–4 matrix (rows = bride ↓, cols = groom →). 4 same · 3 friendly · 2 neutral · 1 hostile · 0 sworn enemy.",
  // animal → the nakṣatra NUMBERS that carry it (M = male star, F = female star)
  animalsByNakshatraNum: {
    Horse: { M: 1, F: 24 },      // Aśvinī / Śatabhiṣā
    Elephant: { M: 2, F: 27 },   // Bharaṇī / Revatī
    Sheep: { M: 8, F: 3 },       // Puṣya / Kṛttikā
    Serpent: { M: 4, F: 5 },     // Rohiṇī / Mṛgaśīrṣa
    Dog: { M: 19, F: 6 },        // Mūla / Ārdrā
    Cat: { M: 9, F: 7 },         // Āśleṣā / Punarvasu
    Rat: { M: 10, F: 11 },       // Maghā / Pūrva Phalgunī
    Cow: { M: 12, F: 26 },       // Uttara Phalgunī / Uttara Bhādrapadā
    Buffalo: { M: 15, F: 13 },   // Svātī / Hasta
    Tiger: { M: 16, F: 14 },     // Viśākhā / Citrā
    Deer: { M: 18, F: 17 },      // Jyeṣṭhā / Anurādhā
    Monkey: { M: 20, F: 22 },    // Pūrva Āṣāḍhā / Śravaṇa
    Mongoose: { M: 21, F: null },// Uttara Āṣāḍhā (female = Abhijit, absent from the 27)
    Lion: { M: 25, F: 23 },      // Pūrva Bhādrapadā / Dhaniṣṭhā
  },
  mongooseNote: "Mongoose's female star is Abhijit (the 28th), outside the 27-nakṣatra scheme, so Uttara Āṣāḍhā (21) carries the mongoose alone.",
  colOrder: ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'],
  // rows = BRIDE, in colOrder; each row's cells are indexed by the groom column
  matrix: {
    Horse: [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1],
    Elephant: [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
    Sheep: [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
    Serpent: [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
    Dog: [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
    Cat: [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
    Rat: [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2],
    Cow: [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
    Buffalo: [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
    Tiger: [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1],
    Deer: [1, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1],
    Monkey: [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
    Mongoose: [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
    Lion: [1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 4],
  },
  swornEnemyZeroPairs: [
    ['Horse', 'Buffalo'], ['Elephant', 'Lion'], ['Sheep', 'Monkey'],
    ['Serpent', 'Mongoose'], ['Dog', 'Deer'], ['Cat', 'Rat'], ['Cow', 'Tiger'],
  ],
  asymmetricPairs: [
    { pair: ['Horse', 'Deer'], values: 'bride Horse × groom Deer = 3, but bride Deer × groom Horse = 1' },
    { pair: ['Buffalo', 'Lion'], values: 'bride Buffalo × groom Lion = 1, but bride Lion × groom Buffalo = 2' },
  ],
  asymmetryNote: 'Exactly TWO off-diagonal pairs are asymmetric (Horse↔Deer, Buffalo↔Lion); every other pair is symmetric and all seven sworn-enemy pairs read 0 both ways. The orientation therefore matters only for those two pairs — pinned to saravali (rows = bride).',
  cite: 'https://saravali.github.io/astrology/koota_yoni.html (matrix + assignments verbatim).',
};

// --- 5 · GRAHA-MAITRĪ (max 5) ------------------------------------------------
// Uses NATURAL_RELATION from vedic-data.js (naisargika, BPHS 3.55–57) — kuta.js
// imports it directly. Points grid is CONTESTED (saravali vs common).
export const GRAHA_MAITRI = {
  rule: "The bride's and groom's Moon-sign LORDS, read by naisargika friendship (both ways) into the points grid. Same lord (or same-lord rāśis) = 5.",
  friendshipTable: 'REUSE NATURAL_RELATION in vedic-data.js (BPHS 3.55–57, naisargika only — aṣṭakūṭa ignores compound/temporal friendship).',
  grid_variantA_saravali: { bothFriends: 5, friendNeutral: 4, bothNeutral: 3, friendEnemy: 2, neutralEnemy: 1, bothEnemies: 0 },
  grid_variantB_common: { bothFriends: 5, friendNeutral: 4, bothNeutral: 3, friendEnemy: 1, neutralEnemy: 0.5, bothEnemies: 0 },
  sameLord: 5,
  sameLordNote: 'Saravali does not itself print "same lord = 5"; that cell is the standard software convention (kept, attributed to convention).',
  contested: true,
  contestedNote: 'The friend+enemy and neutral+enemy cells are CONTESTED: saravali gives 2 / 1, the common (AstroSage-family) convention gives 1 / 0.5. Both-friends (5), friend+neutral (4), both-neutral (3) and both-enemies (0) agree. ⚑ variantSet selects the grid; both are kept.',
  cite: 'https://saravali.github.io/astrology/koota_graha.html vs the common software convention (astrosage-family).',
};

// --- 6 · GAṆA (max 6) --------------------------------------------------------
// Deva / Manuṣya / Rākṣasa lists + the asymmetric grid (rows = BRIDE).
// The grid ORIENTATION and some cells are CONTESTED; saravali is the default.
export const GANA = {
  rule: "The bride's gaṇa read against the groom's in the grid (rows = bride ↓, cols = groom →). Same gaṇa = 6.",
  byNakshatraNum: {
    Deva: [1, 5, 7, 8, 13, 15, 17, 22, 27],
    Manushya: [2, 4, 6, 11, 12, 20, 21, 25, 26],
    Rakshasa: [3, 9, 10, 14, 16, 18, 19, 23, 24],
  },
  cols: ['Deva', 'Manushya', 'Rakshasa'],
  // default — saravali (rows = bride, verbatim)
  grid_rowsBride_colsGroom_saravali: {
    Deva: [6, 6, 0],
    Manushya: [5, 6, 0],
    Rakshasa: [1, 0, 6],
  },
  // the common/variant grid (Deva–Manuṣya = 5 either way, any Rākṣasa mix = 0)
  grid_rowsBride_colsGroom_common: {
    Deva: [6, 5, 0],
    Manushya: [5, 6, 0],
    Rakshasa: [0, 0, 6],
  },
  contested: true,
  contestedNote: 'The asymmetric cells are disputed and the spread is wide: saravali gives bride-Deva × groom-Manuṣya = 6 and bride-Rākṣasa × groom-Deva = 1; the astroyogi/anytimeastro family gives 5 for BOTH Deva–Manuṣya directions and 0 for any Rākṣasa mix, and some tables give 3 for Rākṣasa+Deva. ⚑ saravali is the cited default (variantSet="saravali"); the common grid is variantSet="common".',
  cite: 'https://saravali.github.io/astrology/koota_gana.html vs astroyogi/anytimeastro summaries.',
};

// --- 7 · BHAKŪṬA / RĀŚI (max 7) ----------------------------------------------
export const BHAKUTA = {
  rule: 'Mutual Moon-sign counts of 2/12 (dwirdvādaśa), 5/9 or 6/8 (ṣaḍāṣṭaka) → 0 (bhakūṭa-doṣa); all other relations (1/1, 3/11, 4/10, 7/7) → 7.',
  forbiddenPairs: [[2, 12], [5, 9], [6, 8]],
  doshaCancellation: 'The doṣa is held CANCELLED when the two rāśi lords are the same planet or naturally friendly (secondary rule, attributed to Muhūrta Cintāmaṇi commentaries).',
  pointsAfterCancellationContested: true,
  pointsNote: 'Whether the 7 points are RESTORED after cancellation is itself CONTESTED: most matching software keeps the points at 0 and lifts only the doṣa verdict, while several published guides say the points are "no longer forfeited". ⚑ This engine keeps 0 (software convention) and reports the cancellation and the dispute; it never resolves it.',
  cite: 'https://saravali.github.io/astrology/koota_rasi.html ; cancellation: jagannathhora.com/bhakoot-dosha-complete-guide.',
};

// --- 8 · NĀḌĪ (max 8) --------------------------------------------------------
export const NADI = {
  rule: 'Different nāḍī → 8; same nāḍī → 0 (nāḍī-doṣa, the heaviest single kūṭa).',
  byNakshatraNum: {
    Adi: [1, 6, 7, 12, 13, 18, 19, 24, 25],
    Madhya: [2, 5, 8, 11, 14, 17, 20, 23, 26],
    Antya: [3, 4, 9, 10, 15, 16, 21, 22, 27],
  },
  cancellationRules: [
    'same rāśi + different nakṣatra',
    'same nakṣatra + different pāda',
    'same nakṣatra + different rāśi (junction stars)',
    'same rāśi lord',
    'an exempted-nakṣatra list (see the two contested lists below)',
  ],
  // TWO exempt-star lists circulate — even within one source. DISPLAY BOTH;
  // hardcode NEITHER as truth.
  exemptListsContested: true,
  exemptList_A: [4, 6, 8, 10, 16, 22, 26, 27],   // Rohiṇī, Ārdrā, Puṣya, Maghā, Viśākhā, Śravaṇa, U.Bhādrapadā, Revatī
  exemptList_A_names: 'Rohiṇī, Ārdrā, Puṣya, Maghā, Viśākhā, Śravaṇa, Uttara Bhādrapadā, Revatī',
  exemptList_B: [6, 13, 14, 15, 16, 17, 25, 27], // Ārdrā, Hasta, Citrā, Svātī, Viśākhā, Anurādhā, P.Bhādrapadā, Revatī
  exemptList_B_names: 'Ārdrā, Hasta, Citrā, Svātī, Viśākhā, Anurādhā, Pūrva Bhādrapadā, Revatī',
  exemptNote: '⚑ The exempted-nakṣatra list genuinely VARIES between (and even within) sources — two distinct lists are recorded above. Displayed side by side, never hardcoded as truth.',
  cancellationConvention: 'In most software the doṣa is "cancelled" but the points stay 0 — both facts are displayed.',
  cite: 'https://saravali.github.io/astrology/koota_nadi.html ; cancellations: horasarvam.blogspot.com/2017/12, jagannathhora.com/nadi-dosha-complete-guide.',
};

// ============================================================================
//  THE SOUTH-INDIAN TEN PORUTHAM (Tamil tradition)
//  Pass / fail (some marginal) rather than 0–36 points; rajju and vedhā are
//  hard vetoes. The list, weights and even the count (10 vs 12) vary regionally.
// ============================================================================
export const PORUTHAM_META = {
  list: ['dina', 'gana', 'mahendra', 'striDirgha', 'yoni', 'rasi', 'rasyadhipati', 'vashya', 'rajju', 'vedha'],
  names: {
    dina: 'Dina', gana: 'Gaṇa', mahendra: 'Mahendra', striDirgha: 'Strī-dīrgha',
    yoni: 'Yoni', rasi: 'Rāśi', rasyadhipati: 'Rāśyādhipati', vashya: 'Vaśya',
    rajju: 'Rajju', vedha: 'Vedhā',
  },
  total: 10,
  classicalAnchor: 'Kālaprakāśikā (South Indian; commonly cited but NOT directly verified as the source this build cycle — ⚑) and the Tamil pañcāṅga tradition.',
  scoring: 'Count the poruthams present out of 10; a common floor is ~5, with rajju (and usually vedhā) as NON-NEGOTIABLE vetoes. The list, weights and count (10 vs 12) vary regionally — ⚑ flagged prominently.',
  cite: 'https://www.prokerala.com/astrology/porutham/10-porutham-for-marriage.htm ; astrograha.com.',
};

// DINA (Tamil) — a COUNT list, NOT the northern tārā mod-9 rule.
export const DINA_TAMIL = {
  rule: "Count the girl's star → boy's star inclusive. Auspicious counts: {2,4,8,9,11,13,15,18,20,24,26}. Same-star match approved only for {Rohiṇī, Ārdrā, Puṣya, Maghā, Hasta, Śravaṇa}. Pāda-level exceptions at counts 12/14/16. The 27th count is rejected.",
  auspiciousCounts: [2, 4, 8, 9, 11, 13, 15, 18, 20, 24, 26],
  sameStarApprovedNums: [4, 6, 8, 10, 13, 22], // Rohiṇī, Ārdrā, Puṣya, Maghā, Hasta, Śravaṇa
  padaExceptionCounts: [12, 14, 16],
  divergenceNote: '⚑ This Tamil COUNT list differs from the northern tārā mod-9 {not 3,5,7} rule — they are NOT the same (e.g. count 10 passes the northern tārā but FAILS this Tamil list). Encoded separately and never merged.',
  cite: 'https://www.prokerala.com/astrology/porutham/dina-porutham.htm (count direction pinned to the standard girl→boy; prokerala does not print the direction explicitly — ⚑).',
};

export const MAHENDRA = {
  rule: "Count the girl's star → boy's star inclusive; counts {4,7,10,13,16,19,22,25} → porutham present.",
  counts: [4, 7, 10, 13, 16, 19, 22, 25],
  signifies: "progeny, longevity and wealth (the tradition's claim).",
  cite: 'http://m.epanchang.com/Mahendra-Porutham ; https://www.prokerala.com/astrology/porutham/mahendra-porutham.htm',
};

export const STRI_DIRGHA = {
  rule: "Count the girl's star → boy's star inclusive; > 13 → uttamam (best).",
  uttamamThreshold: 13,
  variant: '> 7 accepted as madhyamam (middling) by some sources — ⚑ attributed to epanchang/astroved only (not on prokerala).',
  madhyamamThreshold: 7,
  cite: 'http://m.epanchang.com/ ; astroved.com ; prokerala stree-deerga.',
};

// RĀŚI porutham (South) — contradicts the northern bhakūṭa on 5/9.
export const RASI_SOUTH = {
  rule: "Counted from the GIRL's rāśi: the 7th is best; {1 (eka-rāśi conditions), 3, 4, 5, 9, 10, 11} are good; 6/8 (ṣaṣṭāṣṭaka), 2 and 12 are bad.",
  bestCount: 7,
  goodCounts: [1, 3, 4, 5, 9, 10, 11],
  badCounts: [2, 6, 8, 12],
  ekaRashi: "Same rāśi (eka-rāśi) is acceptable when the girl's nakṣatra does not precede the boy's (an exempt-star list applies).",
  contradictionFlag: '⚑ CROSS-SYSTEM CONTRADICTION: a 5/9 relation is GOOD here (South) but a 0-point bhakūṭa-doṣa in the North. Displayed BOTH ways, never resolved.',
  cite: 'https://www.prokerala.com/astrology/porutham/rasi-porutham.htm vs https://saravali.github.io/astrology/koota_rasi.html',
};

export const RASYADHIPATI = {
  rule: "The Moon-sign LORDS' naisargika friendship: mutual friends → uttamam; one-sided or neutral → madhyamam; enemies → fail. Same lord → best.",
  friendshipTable: 'REUSE NATURAL_RELATION in vedic-data.js (naisargika).',
  sameStarApprovedNames: 'Rohiṇī, Ārdrā, Maghā, Hasta, Viśākhā, Śravaṇa, Uttara Bhādrapadā, Revatī (Raman\'s school; the list varies slightly by edition — ⚑).',
  cite: "B. V. Raman, 'Muhurtha' (astrologerjolly.tripod.com/muhurtha.htm) ; astroved.com rāśyādhipati article.",
};

// RAJJU — five body-groups; same rajju = VETO. Aroha/avaroha subdivision.
export const RAJJU = {
  rule: 'Same rajju (body-group) between the two stars = VETO (strict Tamil). saravali subdivides each group āroha (ascending) / avaroha (descending) and scores 0–4, with same-rajju-same-direction the worst.',
  groupsByNakshatraNum: {
    Pada: [1, 9, 10, 18, 19, 27],   // foot
    Kati: [2, 8, 11, 17, 20, 26],   // waist / thigh
    Nabhi: [3, 7, 12, 16, 21, 25],  // navel
    Kantha: [4, 6, 13, 15, 22, 24], // neck
    Sira: [5, 14, 23],              // head
  },
  groupLabels: { Pada: 'Pāda (foot)', Kati: 'Kaṭi (waist)', Nabhi: 'Nābhi (navel)', Kantha: 'Kaṇṭha (neck)', Sira: 'Śiras (head)' },
  aroha: { Pada: [1, 10, 19], Kati: [2, 11, 20], Nabhi: [3, 12, 21], Kantha: [4, 13, 22], Sira: [5, 14, 23] },
  avaroha: { Kantha: [6, 15, 24], Nabhi: [7, 16, 25], Kati: [8, 17, 26], Pada: [9, 18, 27] },
  score_saravali: { diffBothAroha: 4, mixed: 3, sameDiffDirection: 2, diffBothAvaroha: 1, sameSameDirection: 0 },
  traditionalConsequences: {
    Sira: "husband's death", Kantha: "wife's death", Nabhi: "children's death",
    Kati: 'poverty', Pada: 'wandering / separation',
  },
  consequencesNote: "These are the TRADITION'S stated claims for a same-rajju match — recorded as belief, presented as such, NEVER as a prediction about real people.",
  directionToleranceVariant: 'Some schools tolerate same-rajju-DIFFERENT-direction (āroha vs avaroha) — ⚑ a genuine variant; the strict Tamil rule vetoes any same-rajju match.',
  cite: 'https://www.prokerala.com/astrology/porutham/rajju-porutham.htm + https://saravali.github.io/astrology/koota_rajju.html (memberships identical).',
};

// VEDHĀ — 12 afflicting pairs + the mutual triple {5,14,23}; any match = reject.
export const VEDHA = {
  rule: 'Any vedhā match between the two stars = reject. The 12 pairs plus the mutual triple cover all 27 nakṣatras.',
  pairsByNum: [[1, 18], [2, 17], [3, 16], [4, 15], [6, 22], [7, 21], [8, 20], [9, 19], [10, 27], [11, 26], [12, 25], [13, 24]],
  mutualTriple: [5, 14, 23], // Mṛgaśīrṣa, Citrā, Dhaniṣṭhā — mutually vedhā
  historicalNote: '(An older epanchang gloss was said to misprint Thiruvāthirai (Ārdrā 6) for Mṛgaśīrṣa in one pair; the live page is correct. The number set above is the consistent standard.)',
  cite: 'http://www.epanchang.com/Vedha-Porutham ; prokerala.com/astrology/porutham/vedha-porutham.htm ; astroved.com/articles/vedha-porutham',
};

// A single sensitive-domain framing string, reused by the engine + UI.
export const KUTA_FRAMING =
  'SENSITIVE DOMAIN. Marriage matching (guṇa-milāpa / porutham) is a cultural CUSTOM recorded here for study. This tool reports "what the tradition computes" from two Moon positions — it is NOT advice about any real relationship, measures nothing about compatibility, and has no demonstrated validity. Described, never prescribed.';
