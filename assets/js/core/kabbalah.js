// ============================================================================
//  kabbalah.js — GEMATRIA and the Tree-of-Life lookups. The arithmetic here is
//  EXACT and checkable (letter values are a fixed table; a word's value is a
//  sum); what the tradition READ INTO equal sums (echad 13 = ahavah 13, their
//  sum 26 = YHVH…) is symbolism of NO demonstrated validity, recorded for study.
//
//   • gematria(text, {method}) — sums a Hebrew string over the standard values
//     (mispar hechrachi, Aleph 1 … Tau 400). `method:'gadol'` switches to the
//     MISPAR-GADOL variant (finals ך ם ן ף ץ = 500–900) — flagged, never the
//     default. Non-Hebrew characters are ignored.
//   • pathBetween(a, b) — the GD path record joining two sephiroth, or null.
//   • sephiraByNum / pathByNum / pathsAt / letterByChar — tree lookups.
//   • kameaCellFor(value, order) — reuses core/kamea.js reduceToCell (the
//     aiq-bekar power-of-ten collapse) to land a gematria total on a kamea
//     cell, joining this page to the sigil-tracer on the kameas page.
//
//  NOTE: core/kamea.js `letterValues` is the LATIN convenience (it strips
//  /[^A-Z]/, so Hebrew input yields nothing) — this module carries its own
//  Hebrew table (data/kabbalah-data.js) and does NOT reuse that function.
//
//  PURE — no DOM. HONEST FRAMING: a historical symbolic system, described
//  never prescribed. Every datum cited in data/kabbalah-data.js.
// ============================================================================
import { HEBREW_LETTERS, PATHS, SEPHIROTH, FINALS_NOTE } from './data/kabbalah-data.js';
import { reduceToCell } from './kamea.js';

// char → letter record, medial and final forms both indexed.
const CHAR_INDEX = new Map();
for (const L of HEBREW_LETTERS) {
  CHAR_INDEX.set(L.char, { ...L, isFinal: false });
  if (L.finalChar) CHAR_INDEX.set(L.finalChar, { ...L, isFinal: true });
}

export const GEMATRIA_METHODS = {
  standard: { label: 'Standard (mispar hechrachi)', note: 'Aleph 1 … Tau 400; final forms count the same as their medials.' },
  gadol: { label: 'Mispar gadol (finals 500–900) — VARIANT', note: FINALS_NOTE },
};

// gematria('אחד') → { total: 13, letters:[{char,name,value}…], method:'standard' }
export function gematria(text, opts = {}) {
  const method = opts.method === 'gadol' ? 'gadol' : 'standard';
  const letters = [];
  let total = 0;
  for (const char of String(text == null ? '' : text)) {
    const rec = CHAR_INDEX.get(char);
    if (!rec) continue;                                    // ignore non-Hebrew
    const value = rec.isFinal && method === 'gadol' ? rec.finalValue : rec.value;
    letters.push({ char, name: rec.name + (rec.isFinal ? ' (final)' : ''), translit: rec.translit, value, isFinal: rec.isFinal });
    total += value;
  }
  return { total, letters, method, methodNote: GEMATRIA_METHODS[method].note };
}

// Verified worked examples (each sum arithmetic-checked; the classic pairing:
// echad 13 + ahavah 13 = 26 = YHVH — the tradition's reading, not a fact).
export const GEMATRIA_EXAMPLES = [
  { he: 'אחד', translit: 'echad', gloss: 'one', total: 13, calc: '1+8+4', cite: 'Stock classical example; sum arithmetic-verified against the standard letter values.' },
  { he: 'אהבה', translit: 'ahavah', gloss: 'love', total: 13, calc: '1+5+2+5', note: '13 + 13 = 26 = YHVH — the classic pairing (the tradition’s reading).', cite: 'Stock classical example; arithmetic-verified.' },
  { he: 'חי', translit: 'chai', gloss: 'life', total: 18, calc: '8+10', note: 'Source of the custom of gifts in multiples of 18.', cite: 'Stock classical example; arithmetic-verified.' },
  { he: 'יהוה', translit: 'YHVH (the Tetragrammaton)', gloss: 'the divine name', total: 26, calc: '10+5+6+5', cite: 'Stock classical example; arithmetic-verified.' },
];

// --- tree lookups -----------------------------------------------------------------
const SEPH_BY_NUM = new Map(SEPHIROTH.map(s => [s.num, s]));
const PATH_BY_NUM = new Map(PATHS.map(p => [p.num, p]));

export function sephiraByNum(num) { return SEPH_BY_NUM.get(num) || null; }
export function pathByNum(num) { return PATH_BY_NUM.get(num) || null; }

// pathBetween(1, 6) → path 13 (Gimel, the High Priestess). Order-insensitive.
export function pathBetween(a, b) {
  return PATHS.find(p => (p.from === a && p.to === b) || (p.from === b && p.to === a)) || null;
}

// All paths touching a sephira (each sephira meets 1–8 of the 22).
export function pathsAt(num) { return PATHS.filter(p => p.from === num || p.to === num); }

// letterByChar('ג') (or a final form) → the alphabet record, or null.
export function letterByChar(char) { return CHAR_INDEX.get(char) || null; }

// Land a gematria total on a kamea cell (1..order²) by the aiq-bekar
// power-of-ten collapse the sigil-tracer uses — reusing core/kamea.js.
export function kameaCellFor(value, order) { return reduceToCell(value, order * order); }
