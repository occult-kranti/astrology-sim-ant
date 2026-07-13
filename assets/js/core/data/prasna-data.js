// ============================================================================
//  prasna-data.js — the cited reference data for PRAŚNA (Indian horary): the
//  benefic/malefic classification, the judgement rules of the Ṣaṭpañcāśikā,
//  Daivajña Vallabha and Praśna Mārga (with every verified correction and
//  edition discrepancy stored IN-DATA, never silently resolved), the twelve
//  quesited houses, the ārūḍha direction table, and the honestly non-computable
//  ritual layers. PURE DATA — no DOM, no computation beyond string constants.
//
//  SOURCES (verified against the primary translations):
//  · Ṣaṭpañcāśikā of Pṛthuyaśas (6th c., 56 verses) — Adhyāya I trans. at
//    medium.com/prasna-jyotish (verses checked against the printed Sanskrit mūla).
//  · Daivajña Vallabha (attrib. Varāhamihira/Śrīpati) — archive.org full text.
//    NOTE: the archive translation DUAL-NUMBERS Chapter II verses (17/18, 19/20,
//    20/21) — both numbers are stored where it matters.
//  · Praśna Mārga (Kerala, 1649), trans. B. V. Raman, Motilal Banarsidass,
//    2 vols — archive.org full text. NOTE: Raman's table of contents uses
//    SECTION numbers ("95. Lagna and Arudha") that are not stanza numbers; the
//    stanza loci below were verified against the body text.
//  · Varāhamihira, Bṛhat Jātaka II.5 — trans. N. Chidambaram Aiyar
//    (chestofbooks.com) cross-checked against V. Subrahmanya Sastri (2nd ed.).
//
//  HONEST FRAMING (locked): these rules are a historical symbolic grammar with
//  no demonstrated predictive validity — described and cited, never prescribed.
// ============================================================================

export const PRASNA_SOURCES = {
  spsh: 'Ṣaṭpañcāśikā of Pṛthuyaśas (6th c.), Adhyāya I — trans. at medium.com/prasna-jyotish, verified against the printed Sanskrit mūla.',
  dv: 'Daivajña Vallabha (attrib. Varāhamihira/Śrīpati) — archive.org/details/DaivajnaVallabha (Ch. II verses dual-numbered in this translation).',
  pm: 'Praśna Mārga (Kerala, 1649), trans. B. V. Raman, Motilal Banarsidass, 2 vols — archive.org/details/PrasnaMargaBVR.',
  bj: 'Varāhamihira, Bṛhat Jātaka II.5 — trans. N. C. Aiyar; cross-checked V. Subrahmanya Sastri 2nd ed.',
  phaladipika: 'Phaladīpikā (Mantreśvara), as quoted in I. Rangacharya, "Specialty of Prasna Lagna", Saptarishis Astrology.',
};

// --- Benefic / malefic classification (Bṛhat Jātaka II.5, as verified) -------
// The VERSE enumerates only the malefics: "The waning Moon, the Sun, Mars,
// Saturn and Mercury when in conjunction with any of these, are malefic
// planets." The benefic list (Jupiter, Venus, the WAXING Moon, unafflicted
// Mercury) is the complement supplied in the TRANSLATOR NOTES (Aiyar note (d);
// Sastri's commentary names the waxing Moon) — cited to the notes, not the verse.
export const CLASSIFICATION = {
  maleficsAlways: ['Sun', 'Mars', 'Saturn'],
  beneficsAlways: ['Jupiter', 'Venus'],
  moonRule: 'waning (Kṛṣṇa pakṣa) Moon = malefic; waxing (Śukla pakṣa) Moon = benefic. Waxing = sidereal elongation Moon−Sun in (0°,180°).',
  mercuryRule: 'Mercury joined (same rāśi) with any malefic is malefic; otherwise benefic.',
  cite: 'Bṛhat Jātaka II.5 (Aiyar trans.; Sastri 2nd ed. concurs: "The waning Moon, the Sun, Mars and Saturn are known as malefic planets. Mercury in conjunction with any of them is malignant also.")',
  flags: [
    'The benefic enumeration (incl. the waxing Moon) comes from the translator notes/commentary, not the verse text itself.',
    'Sastri’s commentary records an ALTERNATIVE weak-Moon criterion — the Moon within roughly two signs of the Sun is weak regardless of pakṣa (elongation-based). The pakṣa (elongation < 180°) reading is used here; the variant is stored, not merged.',
    'Rāhu/Ketu are ABSENT from Bṛhat Jātaka II.5 (they appear in that śloka only as direction lords); later tradition — Phaladīpikā — adds them as malefics. This engine counts them as malefics under that flagged extension; the source layering is never silently merged.',
  ],
  nodesCite: 'Phaladīpikā, as quoted in Rangacharya (Saptarishis): "the weak Moon, the Sun, Mars, Rahu, Ketu, Saturn and Mercury in conjunction with malefics" as malefics.',
};

// --- Śīrṣodaya (head-rising) signs -------------------------------------------
// The ṢPŚ I.4 success rule includes a third clause most summaries drop: the
// rising rāśi being śīrṣodaya is itself a success testimony (corroborated by
// DV II.19/20: "If the ascendant falls in a Shirshodaya sign or in the sign of
// a benefic planet, the result of the query will be auspicious").
export const SHIRSHODAYA = ['Gemini', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Aquarius'];
export const PRISHTODAYA = ['Aries', 'Taurus', 'Cancer', 'Sagittarius', 'Capricorn'];
export const UBHAYODAYA = ['Pisces'];
export const SHIRSHODAYA_CITE = 'Bṛhat Jātaka Ch. I (śīrṣodaya/pṛṣṭhodaya classification — uniform across editions; exact śloka number varies by edition, flagged); applied to praśna per Ṣaṭpañcāśikā I.4 and Daivajña Vallabha II.19/20.';

// --- House sets ---------------------------------------------------------------
export const KENDRAS = [1, 4, 7, 10];       // quadrants
export const TRIKONAS = [5, 9];             // trines
export const MALEFIC_GOOD_HOUSES = [3, 6, 11]; // where DV wants the malefics
// DV III.2: Moon in these houses ASPECTED BY BENEFICS → good results
// (specifically "gains through the help of a woman" — the promised result is
// narrower than generic success; stored as found).
export const MOON_FAVOURABLE_HOUSES = [2, 3, 6, 7, 10, 11];
// DV III.2's adverse counterpart: Moon in these houses ASPECTED BY MALEFICS
// → "he will cause fear". House 3 sits on BOTH lists — disambiguated by which
// planets aspect the Moon.
export const MOON_ADVERSE_HOUSES = [1, 3, 5, 8, 9];
export const MOON_HOUSE_CITE = 'Daivajña Vallabha III.2; the 8th-house obstruction: Praśna Mārga XVII.15 (Raman Vol. II — marriage context, generalized by the tradition; genre-dependent, see flag).';
export const MOON_8TH_FLAG = 'Counter-testimony stored in-data: DV V.3 (travel-return context) — the Moon in the 8th with NO malefic in the angles means the absent person "returns happily". The 8th-as-obstacle reading is genre-dependent, flagged rather than hard-coded as universal.';

// --- The twelve quesited houses (whole-sign bhāvas from the praśna lagna) ----
// Kendra significations per Ṣaṭpañcāśikā I.2 (verified against the Sanskrit
// mūla: cyuti from the 1st, vṛddhi from the 4th, pravāsa from the 10th,
// nivṛtti from the 7th); the rest are the standard bhāva significations (BPHS).
export const QUESITED_HOUSES = [
  { house: 1, name: 'Tanu (self)', meaning: 'the querent — body, displacement or removal from one’s position (cyuti)' },
  { house: 2, name: 'Dhana (wealth)', meaning: 'money, family, food, speech' },
  { house: 3, name: 'Sahaja (siblings)', meaning: 'brothers & sisters, courage, short undertakings' },
  { house: 4, name: 'Sukha (happiness)', meaning: 'home, land, vehicles — growth, success & prosperity (vṛddhi)' },
  { house: 5, name: 'Putra (children)', meaning: 'children, learning, counsel, mantra' },
  { house: 6, name: 'Ripu (enemies)', meaning: 'illness, debts, enemies, obstacles' },
  { house: 7, name: 'Saptama / Kalatra (partner)', meaning: 'spouse, partnership, the opponent, the absent person — return from travel (nivṛtti); the DEFAULT quesited' },
  { house: 8, name: 'Āyus (longevity)', meaning: 'obstruction, loss, crisis, inheritance' },
  { house: 9, name: 'Dharma (fortune)', meaning: 'fortune, dharma, the guru, long journeys' },
  { house: 10, name: 'Karma (action)', meaning: 'career, rank, the king — absence from home & travelling (pravāsa)' },
  { house: 11, name: 'Lābha (gains)', meaning: 'gains, recovery of the lost, fulfilment of desires' },
  { house: 12, name: 'Vyaya (loss)', meaning: 'loss, expense, exile, confinement' },
];
export const QUESITED_CITE = 'Ṣaṭpañcāśikā I.2 (kendra significations, verified against the Sanskrit mūla); the remaining bhāva significations per BPHS (as already encoded in the Vedic wing).';

// --- Ārūḍha: the sign of the direction the querent faces ---------------------
// PM II.7–11: the twelve signs are assigned to the eight compass directions;
// the ārūḍha is the sign of the direction the querent occupies/faces at the
// consultation (circle-touch fallback). It is an EXTERNAL PHYSICAL DATUM —
// computable only when the direction (or touched sign) is supplied, NEVER
// derivable from the chart. Houses are then reckoned from ārūḍha or lagna,
// whichever is stronger (PM IX.29 — "95" in Raman's TOC is a section number,
// not a stanza; the stanza locus was verified in the body text).
export const ARUDHA_DIRECTIONS = {
  'east': [0, 1],          // Meṣa, Vṛṣabha
  'south-east': [2],       // Mithuna
  'south': [3, 4],         // Karka, Siṁha
  'south-west': [5],       // Kanyā
  'west': [6, 7],          // Tulā, Vṛścika
  'north-west': [8],       // Dhanu
  'north': [9, 10],        // Makara, Kumbha
  'north-east': [11],      // Mīna
};
export const ARUDHA_CITE = 'Praśna Mārga II.7–11 (direction → sign table; circle-touch fallback) and IX.29 (houses from ārūḍha or lagna, whichever is stronger), Raman trans. Vol. I.';
export const ARUDHA_FLAGS = [
  'Ārūḍha is absent from the Ṣaṭpañcāśikā — it is the later Kerala (Praśna Mārga) layer. With no supplied direction the engine returns null and all judgement falls back to the praśna lagna (the Ṣaṭpañcāśikā mode).',
  'Raman’s note gives unequal arcs for a degree bearing: the common signs (Mithuna, Kanyā, Dhanu, Mīna) own a full 45° octant each, the other eight signs 22.5° each. For discrete 8-way input the sign sets above apply.',
];

// --- Non-computable layers (honest out-of-scope) ------------------------------
// PM II.12 lists FOURTEEN factors to weigh at the query moment; several depend
// on the diviner's physical observation and can NEVER be computed from a
// timestamp and place. They are described here as history and excluded.
export const OUT_OF_SCOPE = [
  { layer: 'Nimittas (omens)', why: 'ominous sounds, sights and encounters observed from the moment the astrologer leaves his residence until he sits down — physical observation, not computation.', cite: 'Praśna Mārga II.12–13 (Raman Vol. I).' },
  { layer: 'Svara / breath examination', why: 'the flow of the astrologer’s own breath (svarāyu) at the query — listed among the fourteen factors; a bodily observation.', cite: 'Praśna Mārga II.12 (Raman Vol. I).' },
  { layer: 'Tāmbūla (betel-leaf) examination', why: 'the Kerala practice of reading the betel leaves the querent presents — depends on physical objects.', cite: 'Praśna Mārga II (Kerala ritual layer; Raman Vol. I).' },
  { layer: 'Aṣṭamaṅgala / gold-coin ritual', why: 'the querent places a gold piece on a drawn circle; the touched point supplies the ārūḍha — physical ritual, engine-computable only if the result is typed in.', cite: 'Praśna Mārga II.7–15 (Raman Vol. I, stanzas 11–15 and notes).' },
  { layer: 'The astrologer’s steady mind', why: '"If the mind of the astrologer is steady… the reading will be correct" — a precondition of the diviner, not of the chart.', cite: 'Praśna Mārga II.14–15 (Raman Vol. I).' },
];

// --- Edition / numbering discrepancies (stored, never resolved) ---------------
export const EDITION_FLAGS = [
  'The archive Daivajña Vallabha translation dual-numbers Chapter II verses: the rotation rule is "17./18.", the śīrṣodaya rule "19./20.", the kendra-configuration rule "20./21." — both numbers are cited where used.',
  'Raman’s Praśna Mārga table of contents numbers SECTIONS, not stanzas ("95. Lagna and Arudha" is TOC section 95; the rule itself is Ch. IX, Stanza 29). The stanza loci used here were verified against the body text.',
  '"As Prasna Lagna is similar to Janma Lagna, all events should be read from Prasna as you would do in a horoscope" is Praśna Mārga I.47 (section "Similarity Between Prasna and Jataka", stanzas 45–47) — the stanza number is verified, the verify-flag cleared.',
  'Rāhu/Ketu malefic status: absent from Bṛhat Jātaka II.5, added by Phaladīpikā — a source-layering discrepancy carried on every testimony that uses it.',
];

// --- The locked honest caveat --------------------------------------------------
export const PRASNA_CAVEAT = 'Praśna’s judgement rules are a historical symbolic grammar with no demonstrated predictive validity. They are the Indian tradition’s answer to the same epistemic problem Western horary addresses — reading a question from its moment — described and cited for study, never prescribed. Nothing here forecasts anything, and no decision should rest on it.';
