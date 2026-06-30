// ============================================================================
//  degree-tables.js — Lilly's "two necessary Tables of the Signs" (Christian
//  Astrology Bk I, p.116) plus his three flag-lists. Transcribed from the clean
//  1647 text (worldastrology CA-I scan) and confirmed against Lilly's own prose
//  worked example for Aries.
//
//  • MASC_FEM and LIGHT_DARK are authoritative (verified against the text and
//    Lilly's explicit Aries example). Each entry is [upperBoundDeg, code]; a
//    degree d (0–30 within the sign) takes the code of the first bound ≥ d.
//  • The pitted/azimene/fortune flag-lists are given with Lilly's exact USE
//    (verbatim), and the fortune degrees that read cleanly from the scan; the
//    pitted & azimene specific degrees vary between transcriptions, so they are
//    presented for reference with a link to verify, and are NOT auto-asserted.
// ============================================================================

// Masculine (M) / Feminine (F) degrees — upper bound of each band, per sign.
export const MASC_FEM = [
  [[8,'M'],[9,'F'],[15,'M'],[22,'F'],[30,'M']],            // Aries
  [[5,'F'],[11,'M'],[17,'F'],[21,'M'],[24,'F'],[30,'M']],  // Taurus
  [[5,'F'],[16,'M'],[22,'F'],[26,'M'],[30,'F']],           // Gemini
  [[2,'M'],[8,'F'],[10,'M'],[12,'F'],[23,'M'],[27,'F'],[30,'M']], // Cancer
  [[5,'M'],[8,'F'],[15,'M'],[23,'F'],[30,'M']],            // Leo
  [[8,'F'],[12,'M'],[20,'F'],[30,'M']],                    // Virgo
  [[5,'M'],[15,'F'],[20,'M'],[27,'F'],[30,'M']],           // Libra
  [[4,'M'],[14,'F'],[17,'M'],[25,'F'],[30,'M']],           // Scorpio
  [[2,'M'],[5,'F'],[12,'M'],[24,'F'],[30,'M']],            // Sagittarius
  [[11,'M'],[19,'F'],[30,'M']],                            // Capricorn
  [[5,'M'],[15,'F'],[21,'M'],[25,'F'],[27,'M'],[30,'F']],  // Aquarius
  [[10,'M'],[20,'F'],[23,'M'],[28,'F'],[30,'M']]           // Pisces
];

// Light (L) / Dark (D) / Smoky (S) / Void (V) degrees — upper bound + code.
export const LIGHT_DARK = [
  [[3,'D'],[8,'L'],[16,'D'],[20,'L'],[24,'V'],[29,'L'],[30,'V']],  // Aries
  [[3,'D'],[7,'L'],[12,'V'],[15,'L'],[20,'V'],[28,'L'],[30,'D']],  // Taurus
  [[4,'L'],[7,'D'],[12,'L'],[16,'V'],[22,'L'],[27,'D'],[30,'V']],  // Gemini
  [[12,'L'],[14,'D'],[18,'V'],[20,'S'],[28,'L'],[30,'V']],          // Cancer
  [[10,'D'],[20,'S'],[25,'V'],[30,'L']],                            // Leo
  [[5,'D'],[8,'L'],[10,'V'],[16,'L'],[22,'S'],[27,'V'],[30,'D']],   // Virgo
  [[5,'L'],[10,'D'],[18,'L'],[21,'D'],[27,'L'],[30,'V']],           // Libra
  [[3,'D'],[8,'L'],[14,'V'],[22,'L'],[24,'S'],[29,'V'],[30,'D']],   // Scorpio
  [[9,'L'],[12,'D'],[19,'L'],[23,'S'],[30,'L']],                    // Sagittarius
  [[7,'D'],[10,'L'],[15,'S'],[19,'L'],[22,'D'],[25,'V'],[30,'D']],  // Capricorn
  [[4,'S'],[9,'L'],[13,'D'],[23,'L'],[25,'V'],[30,'D']],            // Aquarius
  [[6,'D'],[12,'L'],[18,'D'],[22,'L'],[25,'V'],[28,'L'],[30,'D']]   // Pisces
];

// Degrees increasing fortune — Lilly's "De. encreasing fortune" column from the
// two Tables of the Signs, Christian Astrology Bk I p.116 (1647), read from the
// first-edition scan. The four signs once left blank (Taurus, Leo, Sagittarius,
// Capricorn) were re-read from p.116 at high zoom (2026-06-30); all four now
// filled at high confidence.
export const FORTUNE_DEG = [
  [19],            // Aries
  [3, 15, 27],     // Taurus      (p.116, re-read 2026-06-30)
  [11],            // Gemini
  [1, 2, 3],       // Cancer
  [2, 5, 7, 19],   // Leo         (p.116, re-read 2026-06-30)
  [3, 14, 20],     // Virgo
  [3, 15, 21],     // Libra
  [20],            // Scorpio
  [13, 20],        // Sagittarius (p.116, re-read 2026-06-30)
  [12, 13, 14, 20],// Capricorn   (p.116, re-read 2026-06-30)
  [17, 20],        // Aquarius
  [13, 20]         // Pisces
];

// ---------------------------------------------------------------------------
//  Body-parts grid (CA Bk I, p.119/121). Generating rule, verbatim: "Every
//  planet in his own house or sign governeth the Head; in the second sign from
//  his house, the Neck; … successively through the twelve signs." Each planet
//  counts from its earliest (lowest zodiacal-index) domicile. Verified against
//  Lilly's own example: Saturn in Gemini → the Belly.
// ---------------------------------------------------------------------------
const MEMBERS = ['Head', 'Neck', 'Arms & shoulders', 'Breast', 'Heart', 'Belly',
  'Reins', 'Secrets', 'Thighs', 'Knees', 'Legs', 'Feet'];
const HEAD_START = { Saturn: 9, Jupiter: 8, Mars: 0, Sun: 4, Venus: 1, Mercury: 2, Moon: 3 };
export function bodyPartOf(planet, signIdx) {
  const h = HEAD_START[planet];
  if (h === undefined) return null;
  let part = MEMBERS[((signIdx - h) % 12 + 12) % 12];
  // Arabian exception: the Moon in Aries rules the Head as well as the Knees
  if (planet === 'Moon' && signIdx === 0) part = 'Head & knees';
  return part;
}
export { MEMBERS };

const GENDER = { M: 'Masculine', F: 'Feminine' };
const QUALITY = { L: 'Light', D: 'Dark', S: 'Smoky', V: 'Void' };

export function genderOfDegree(signIdx, degInSign) {
  for (const [b, c] of MASC_FEM[signIdx]) if (degInSign <= b) return GENDER[c];
  return 'Masculine';
}
export function qualityOfDegree(signIdx, degInSign) {
  for (const [b, c] of LIGHT_DARK[signIdx]) if (degInSign <= b) return QUALITY[c];
  return 'Light';
}
export function isFortunateDegree(signIdx, degInSign) {
  return FORTUNE_DEG[signIdx].includes(Math.floor(degInSign)) ||
         FORTUNE_DEG[signIdx].includes(Math.ceil(degInSign));
}

// Lilly's verbatim explanation of the use of each table (CA Bk I, pp.116-118).
export const TABLE_USE = {
  mascfem: 'When the angles, the sex of the planet and the signs leave the sex of an unborn child, or of a thief, undecided, look to the degree of the Moon, of the significator, and of the relevant cusp: a masculine degree argues a male, a feminine degree a female.',
  lightdark: 'A Light degree on the Ascendant makes the native or querent fairer; a Dark degree, more obscure (and any deformity greater); a Smoky degree, a mixed, middling complexion and condition; a Void degree, "his understanding will be small, and his judgement less than the world supposeth."',
  deep: 'Deep or Pitted degrees: if the Moon, the Ascendant, or its lord be in one, "it shews the man at a stand in the question he asks, not knowing which way to turn himself, and that he had need of help… as a man cast into a ditch."',
  azimene: 'Azimene (lame or deficient) degrees: when the Ascendant, its lord, or the Moon falls here, they answer to a native or querent "defective in any member, or infected with an inseparable disease, halting, blindness, deafness," and the like.',
  fortune: 'Degrees increasing fortune: if the cusp or lord of the 2nd house, Jupiter, or the Part of Fortune be in one, "it is an argument of much wealth, and that the native or querent will be rich."'
};
