// ============================================================================
//  dignities-data.js — The numerical tables of essential & accidental dignity
//  exactly as printed in William Lilly's "Christian Astrology" (1647), Book 1.
//
//  Sources (all cross-checked against multiple transcriptions; see /pages/about
//  for full citations):
//   • Lilly, Christian Astrology Bk 1, "Table of Essentiall Dignities" (p.104)
//     and "A ready Table … of Fortitudes and Debilities" (p.115).
//   • Primary scan: worldastrology.net CA-I.pdf; cross-checked vs skyscript.co.uk
//     (Deborah Houlding), renaissanceastrology.com, and Ptolemy's Tetrabiblos.
//
//  IMPORTANT fidelity notes:
//   • TERMS are Lilly's PTOLEMAIC terms (NOT the Egyptian terms). Each sign's
//     five terms are transcribed from Lilly's own table and verified to sum to
//     exactly 30°. Sun and Moon never rule terms.
//   • TRIPLICITY uses Lilly's two-ruler scheme (day/night only, no
//     "participating" ruler) and Mars rules WATER both day and night.
//   • FIXED-STAR longitudes are Lilly's 1647 positions.
// ============================================================================

export const PLANETS7 = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

// ---------------------------------------------------------------------------
//  Domicile (house) rulers, by sign index 0=Aries … 11=Pisces
// ---------------------------------------------------------------------------
export const DOMICILE = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];
// Diurnal (day) vs nocturnal (night) domicile, for sect-aware display.
export const DOMICILE_SECT = {
  Saturn: { day: 10, night: 9 },   // Aquarius (day), Capricorn (night)
  Jupiter: { day: 8, night: 11 },  // Sagittarius, Pisces
  Mars: { day: 0, night: 7 },      // Aries, Scorpio
  Venus: { day: 6, night: 1 },     // Libra, Taurus
  Mercury: { day: 2, night: 5 },   // Gemini, Virgo
  Sun: { day: 4 }, Moon: { night: 3 }
};

// Detriment = ruler of the opposite sign.
export const DETRIMENT = DOMICILE.map((_, i) => DOMICILE[(i + 6) % 12]);

// ---------------------------------------------------------------------------
//  Exaltations: planet → {sign index, exact degree}. Includes the Nodes.
//  Fall is the same degree in the opposite sign.
// ---------------------------------------------------------------------------
export const EXALTATION = {
  Sun: { sign: 0, deg: 19 },        // 19° Aries
  Moon: { sign: 1, deg: 3 },        // 3° Taurus
  NorthNode: { sign: 2, deg: 3 },   // 3° Gemini
  Jupiter: { sign: 3, deg: 15 },    // 15° Cancer
  Mercury: { sign: 5, deg: 15 },    // 15° Virgo
  Saturn: { sign: 6, deg: 21 },     // 21° Libra
  SouthNode: { sign: 8, deg: 3 },   // 3° Sagittarius
  Mars: { sign: 9, deg: 28 },       // 28° Capricorn
  Venus: { sign: 11, deg: 27 }      // 27° Pisces
};
// Per-sign exalted planet (or null) for table display.
export const EXALT_BY_SIGN = (() => {
  const a = new Array(12).fill(null);
  for (const [p, e] of Object.entries(EXALTATION)) a[e.sign] = { planet: p, deg: e.deg };
  return a;
})();

// ---------------------------------------------------------------------------
//  Triplicity rulers — Lilly's scheme (day, night). Water = Mars/Mars.
//  triplicity element index: Fire=0, Earth=1, Air=2, Water=3
// ---------------------------------------------------------------------------
export const TRIPLICITY = [
  { element: 'Fire',  signs: [0, 4, 8],  day: 'Sun',    night: 'Jupiter' },
  { element: 'Earth', signs: [1, 5, 9],  day: 'Venus',  night: 'Moon' },
  { element: 'Air',   signs: [2, 6, 10], day: 'Saturn', night: 'Mercury' },
  { element: 'Water', signs: [3, 7, 11], day: 'Mars',   night: 'Mars' }
];
export const TRIPLICITY_BY_SIGN = (() => {
  const a = new Array(12);
  for (const t of TRIPLICITY) for (const s of t.signs) a[s] = t;
  return a;
})();

// ---------------------------------------------------------------------------
//  Egyptian TERMS as printed by Lilly (Ptolemaic terms). Each entry is
//  [planet, startDeg, endDeg] with 0 ≤ start < end ≤ 30; widths sum to 30.
//  Transcribed from Lilly's Bk 1 table (p.104) and cross-checked against his
//  planet-by-planet term lists in the same book.
// ---------------------------------------------------------------------------
const T = (ends, rulers) => {
  // ends = cumulative end degrees, rulers parallel
  const out = []; let prev = 0;
  for (let i = 0; i < 5; i++) { out.push([rulers[i], prev, ends[i]]); prev = ends[i]; }
  return out;
};
export const TERMS = [
  T([6, 14, 21, 26, 30],  ['Jupiter','Venus','Mercury','Mars','Saturn']),    // Aries
  T([8, 15, 22, 26, 30],  ['Venus','Mercury','Jupiter','Saturn','Mars']),    // Taurus
  T([7, 14, 21, 25, 30],  ['Mercury','Jupiter','Venus','Saturn','Mars']),    // Gemini
  T([6, 13, 20, 27, 30],  ['Mars','Jupiter','Mercury','Venus','Saturn']),    // Cancer
  T([6, 13, 19, 25, 30],  ['Saturn','Mercury','Venus','Jupiter','Mars']),    // Leo
  T([7, 13, 18, 24, 30],  ['Mercury','Venus','Jupiter','Saturn','Mars']),    // Virgo
  T([6, 11, 19, 24, 30],  ['Saturn','Venus','Jupiter','Mercury','Mars']),    // Libra
  T([6, 14, 21, 27, 30],  ['Mars','Jupiter','Venus','Mercury','Saturn']),    // Scorpio
  T([8, 14, 19, 25, 30],  ['Jupiter','Venus','Mercury','Saturn','Mars']),    // Sagittarius
  T([6, 12, 19, 25, 30],  ['Venus','Mercury','Jupiter','Mars','Saturn']),    // Capricorn
  T([6, 12, 20, 25, 30],  ['Saturn','Mercury','Venus','Jupiter','Mars']),    // Aquarius
  T([8, 14, 20, 26, 30],  ['Venus','Jupiter','Mercury','Mars','Saturn'])     // Pisces
];

// ---------------------------------------------------------------------------
//  FACES (decans): 10° each, in continuous Chaldean order beginning with Mars
//  at 0° Aries. Generated algorithmically (verified to match Lilly's table).
// ---------------------------------------------------------------------------
const FACE_ORDER = ['Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'];
export const FACES = (() => {
  const a = [];
  for (let s = 0; s < 12; s++) {
    a.push([0, 1, 2].map(f => FACE_ORDER[(s * 3 + f) % 7]));
  }
  return a; // a[sign] = [face1Ruler, face2Ruler, face3Ruler]
})();

// ---------------------------------------------------------------------------
//  Point scores (Lilly, CA p.101 / p.115)
// ---------------------------------------------------------------------------
export const DIGNITY_SCORES = {
  domicile: 5, exaltation: 4, triplicity: 3, term: 2, face: 1,
  detriment: -5, fall: -4, peregrine: -5
};

// ---------------------------------------------------------------------------
//  Planetary orbs (full diameter, degrees) — Lilly's primary set, used to
//  determine whether an aspect is "in orb". Moiety = half the orb.
// ---------------------------------------------------------------------------
export const ORBS = {
  Saturn: 9, Jupiter: 9, Mars: 7, Sun: 15, Venus: 7, Mercury: 7, Moon: 12,
  // points use a small nominal orb
  NorthNode: 0, SouthNode: 0, Fortune: 0
};
export const moiety = p => (ORBS[p] ?? 0) / 2;

// Lilly's "ancients'" alternate orb column (shown for reference in the UI).
export const ORBS_ALT = { Saturn: 10, Jupiter: 12, Mars: 7.5, Sun: 17, Venus: 8, Mercury: 7, Moon: 12.5 };

// ---------------------------------------------------------------------------
//  Solar-proximity thresholds (Lilly, CA pp.113-114)
// ---------------------------------------------------------------------------
export const SOLAR = {
  cazimi: 17 / 60,        // 0°17'  — in the heart of the Sun (a fortitude)
  combust: 8.5,           // 8°30'  — combust (a strong debility)
  underBeams: 17          // 17°    — under the Sun's beams
};

// ---------------------------------------------------------------------------
//  Fixed stars used in Lilly's accidental-dignity table (1647 longitudes)
// ---------------------------------------------------------------------------
export const FIXED_STARS = [
  { name: 'Regulus (Cor Leonis)', lon: 144, score: +6, note: '24° Leo — royal star of Mars/Jupiter nature' },
  { name: 'Spica', lon: 198, score: +5, note: '18° Libra — fortunate, of Venus/Mars nature' },
  { name: 'Caput Algol', lon: 50, score: -5, note: "20° Taurus — most violent star; orb 5°" }
];

// ---------------------------------------------------------------------------
//  Joys of the planets — the house each planet rejoices in.
// ---------------------------------------------------------------------------
export const JOYS = { Mercury: 1, Moon: 3, Venus: 5, Mars: 6, Sun: 9, Jupiter: 11, Saturn: 12 };

// ---------------------------------------------------------------------------
//  Planetary day rulers (index into a Sun..Sat week) and Chaldean order.
// ---------------------------------------------------------------------------
export const DAY_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']; // Sun..Sat

// ---------------------------------------------------------------------------
//  Lookups
// ---------------------------------------------------------------------------
export function termRulerAt(signIdx, degInSign) {
  for (const [planet, s, e] of TERMS[signIdx]) if (degInSign >= s && degInSign < e) return planet;
  return TERMS[signIdx][4][0];
}
export function faceRulerAt(signIdx, degInSign) {
  return FACES[signIdx][Math.min(2, Math.floor(degInSign / 10))];
}
export function triplicityRulerAt(signIdx, isDay) {
  const t = TRIPLICITY_BY_SIGN[signIdx];
  return isDay ? t.day : t.night;
}
