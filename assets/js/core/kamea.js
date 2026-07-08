// ============================================================================
//  kamea.js — the planetary KAMEAS (magic squares) of Agrippa II.22 and the
//  SIGIL-TRACING of names upon them (Agrippa III.30; the Golden Dawn practice).
//  The seven squares live in data/kameas.js; this module holds the METHOD:
//
//   • validateKamea(rows)   — the mathematics is PROVABLE: every row, column
//     and main diagonal must sum to the magic constant, and the cells must be
//     exactly 1..n² each once. The engine-test runs this over all seven squares,
//     so a corrupt grid can never ship.
//   • sigilFor(text, kamea) — the tradition turned a name into numbers and drew
//     a line through the corresponding cells: a small circle marks the start, a
//     cross-bar the end. Values above the square's range are reduced the way
//     the practice did (collapsing powers of ten; the aiq-bekar "nine chambers"
//     did the same for Hebrew). The default letter-values here are the MODERN
//     Latin convenience (A=1…Z=26) — flagged as such; the historical method
//     worked on Hebrew names and gematria.
//
//  PURE — no DOM. HONEST FRAMING: a historical magical practice of no
//  demonstrated efficacy, recorded for study — described, never prescribed.
// ============================================================================
import { KAMEAS, kameaByPlanet } from './data/kameas.js';

// --- the provable mathematics ------------------------------------------------
export function validateKamea(rows) {
  const n = rows.length;
  const errors = [];
  if (!rows.every(r => r.length === n)) return { ok: false, errors: ['not square'] };
  const constant = n * (n * n + 1) / 2;
  const seen = new Set();
  for (const r of rows) for (const v of r) {
    if (!Number.isInteger(v) || v < 1 || v > n * n || seen.has(v)) errors.push(`bad cell ${v}`);
    seen.add(v);
  }
  for (let i = 0; i < n; i++) {
    const rowSum = rows[i].reduce((a, b) => a + b, 0);
    if (rowSum !== constant) errors.push(`row ${i + 1} sums to ${rowSum}, not ${constant}`);
    const colSum = rows.reduce((a, r) => a + r[i], 0);
    if (colSum !== constant) errors.push(`column ${i + 1} sums to ${colSum}, not ${constant}`);
  }
  const d1 = rows.reduce((a, r, i) => a + r[i], 0);
  const d2 = rows.reduce((a, r, i) => a + r[n - 1 - i], 0);
  if (d1 !== constant) errors.push(`main diagonal sums to ${d1}`);
  if (d2 !== constant) errors.push(`anti-diagonal sums to ${d2}`);
  return { ok: errors.length === 0, errors, constant, order: n, total: n * n * (n * n + 1) / 2 };
}

// --- letters → numbers ---------------------------------------------------------
// 'latin' — the modern convenience: A=1…Z=26 (flagged; not the historical way).
// 'aiq'   — the nine-chambers style value: A=1…I=9, J=10(→1 chamber)… i.e. the
//           Latin letters laid on the 1..9 / 10..90 / 100..800 ladder, the
//           closest Latin analogue of the Hebrew gematria the tradition used.
export const SIGIL_METHODS = {
  latin: { label: 'A=1 … Z=26 (modern convenience)', note: 'A modern Latin adaptation — the historical practice worked on Hebrew names and their gematria.' },
  aiq: { label: 'Latin letters on the 1–9 / 10–90 / 100–800 ladder (aiq-bekar style)', note: 'An analogue of the Hebrew aiq-bekar “nine chambers”; still a Latin adaptation, flagged as such.' },
};
export function letterValues(text, method = 'latin') {
  const letters = String(text).toUpperCase().replace(/[^A-Z]/g, '').split('');
  if (method === 'aiq') {
    return letters.map(ch => {
      const i = ch.charCodeAt(0) - 65;                     // 0..25
      const chamber = i % 9, decade = Math.floor(i / 9);   // 1..9 × 1/10/100
      return { letter: ch, value: (chamber + 1) * Math.pow(10, decade) };
    });
  }
  return letters.map(ch => ({ letter: ch, value: ch.charCodeAt(0) - 64 }));
}

// Reduce a value into the square's 1..n² range the way the practice did:
// collapse powers of ten first (300 → 30 → 3), then fall back to summing the
// digits (a modern convenience, flagged in the method note).
export function reduceToCell(value, nCells) {
  let v = value, guard = 0;
  while (v > nCells && guard++ < 24) {
    if (v % 10 === 0) v = v / 10;
    else v = String(v).split('').reduce((a, d) => a + +d, 0);
  }
  return Math.max(1, Math.min(nCells, v));
}

// --- the sigil ------------------------------------------------------------------
// sigilFor(text, kamea, {method}) → the traced path: one step per letter, each
// resolved to its cell (row, col, 0-indexed) on the square. Consecutive
// duplicate cells collapse (the tradition marked a repeated letter with a small
// wave rather than a new stroke — we note it).
export function sigilFor(text, kamea, opts = {}) {
  const method = opts.method || 'latin';
  const n = kamea.order, nCells = n * n;
  const pos = new Map();
  kamea.rows.forEach((row, r) => row.forEach((v, c) => pos.set(v, { row: r, col: c })));
  const steps = [];
  for (const lv of letterValues(text, method)) {
    const cellValue = reduceToCell(lv.value, nCells);
    const p = pos.get(cellValue);
    const prev = steps[steps.length - 1];
    if (prev && prev.row === p.row && prev.col === p.col) { prev.repeats = (prev.repeats || 1) + 1; prev.letters += lv.letter; continue; }
    steps.push({ letter: lv.letter, letters: lv.letter, value: lv.value, cellValue, row: p.row, col: p.col, repeats: 1 });
  }
  return {
    text: String(text), method, methodNote: (SIGIL_METHODS[method] || SIGIL_METHODS.latin).note,
    planet: kamea.planet, order: n, steps,
    note: 'The sigil begins with a small circle and ends with a cross-bar; a repeated cell is marked with a wave. Historical practice traced HEBREW names by gematria (Agrippa III.30; the Golden Dawn drew spirit-sigils this way on the kameas) — Latin letter-values are a modern adaptation, used here for study.',
    cite: 'Agrippa, Three Books of Occult Philosophy II.22 (the tables) & III.30 (the characters); the Golden Dawn practice of planetary sigils.',
  };
}

export { KAMEAS, kameaByPlanet };
