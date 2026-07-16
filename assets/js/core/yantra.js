// ============================================================================
//  yantra.js — the METHOD behind the Indian yantra-mathematics. The data live
//  in data/rasa-data.js; this module holds the provable operations, pure and
//  headless-testable (no DOM):
//
//   • validateYantra(grid)      — every row, column and BOTH diagonals sum to
//     the same magic constant (the pattern of core/kamea.js validateKamea, but
//     WITHOUT the 1..n² bijection: the navagraha grids use consecutive integers
//     k..k+8, and Varāhamihira's square repeats 1..8 — so distinctness is not
//     required, only the magic-sum property).
//   • validateMostPerfect(grid) — the extra invariants of the Khajuraho
//     Chautisa: all broken diagonals, all wrapping 2×2 blocks, and the corner
//     quads = the constant (a most-perfect pandiagonal square).
//   • yantraForGraha(name)      — the 3×3 navagraha square for a planet.
//   • katapayadiDecode / Encode — the consonant→digit letter-numeration.
//   • buildSarvatobhadra()      — the 81-cell Sarvatobhadra Chakra.
//   • sarvatobhadraVedha(nak)   — the piercing (vedha) lines from a nakṣatra.
//
//  HONEST FRAMING: the ARITHMETIC is real and proven; the astrological /
//  talismanic READINGS carry no demonstrated validity. Provenance is flagged
//  in the data (the navagraha set is the modern printed tradition; the ring-2
//  Sarvatobhadra consonants are single-source). Described, never prescribed.
// ============================================================================
import {
  NAVAGRAHA_YANTRAS, CLASSICAL_SQUARES, KATAPAYADI, SARVATOBHADRA,
} from './data/rasa-data.js';

// --- the provable magic-square mathematics ----------------------------------
// validateYantra(grid): rows/cols/both diagonals must equal one constant.
// Entries are NOT required to be a permutation of 1..n² (navagraha grids use
// consecutive integers; Varāhamihira's square repeats values) — only the
// magic-sum property is asserted.
export function validateYantra(grid) {
  const errors = [];
  const n = grid.length;
  if (!grid.every(r => r.length === n)) return { ok: false, errors: ['not square'], order: n };
  const rowSum = i => grid[i].reduce((a, b) => a + b, 0);
  const colSum = j => grid.reduce((a, r) => a + r[j], 0);
  const constant = rowSum(0);
  let total = 0;
  for (const r of grid) for (const v of r) { if (!Number.isFinite(v)) errors.push(`bad cell ${v}`); total += v; }
  for (let i = 0; i < n; i++) {
    if (rowSum(i) !== constant) errors.push(`row ${i + 1} sums to ${rowSum(i)}, not ${constant}`);
    if (colSum(i) !== constant) errors.push(`column ${i + 1} sums to ${colSum(i)}, not ${constant}`);
  }
  const d1 = grid.reduce((a, r, i) => a + r[i], 0);
  const d2 = grid.reduce((a, r, i) => a + r[n - 1 - i], 0);
  if (d1 !== constant) errors.push(`main diagonal sums to ${d1}, not ${constant}`);
  if (d2 !== constant) errors.push(`anti-diagonal sums to ${d2}, not ${constant}`);
  return {
    ok: errors.length === 0, errors, constant, order: n, total,
    lines: { rows: n, cols: n, diagonals: 2 }, checked: 2 * n + 2,
  };
}

// validateMostPerfect(grid): the Chautisa invariants on top of validateYantra —
// all n broken diagonals in each direction, all n² wrapping 2×2 blocks, and the
// four corner quads (of the whole square and of each 3×3), all = the constant.
export function validateMostPerfect(grid) {
  const base = validateYantra(grid);
  const n = grid.length;
  const errors = [...base.errors];
  const C = base.constant;
  const at = (r, c) => grid[((r % n) + n) % n][((c % n) + n) % n];
  // broken diagonals, both directions (s = starting column)
  let brokenChecked = 0;
  for (let s = 0; s < n; s++) {
    let dn = 0, up = 0;
    for (let i = 0; i < n; i++) { dn += at(i, s + i); up += at(i, s - i); }
    brokenChecked += 2;
    if (dn !== C) errors.push(`broken ↘ diagonal @${s} sums to ${dn}, not ${C}`);
    if (up !== C) errors.push(`broken ↗ diagonal @${s} sums to ${up}, not ${C}`);
  }
  // all wrapping 2×2 blocks
  let blockChecked = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const b = at(r, c) + at(r, c + 1) + at(r + 1, c) + at(r + 1, c + 1);
    blockChecked++;
    if (b !== C) errors.push(`2×2 block @(${r},${c}) sums to ${b}, not ${C}`);
  }
  // corner quads: the whole square and each 3×3 sub-square (non-wrapping)
  let cornerChecked = 0;
  for (let span = 2; span <= n - 1; span++) for (let r = 0; r + span < n; r++) for (let c = 0; c + span < n; c++) {
    const q = grid[r][c] + grid[r][c + span] + grid[r + span][c] + grid[r + span][c + span];
    cornerChecked++;
    if (q !== C) errors.push(`corner-quad @(${r},${c})+${span} sums to ${q}, not ${C}`);
  }
  return {
    ok: errors.length === 0, errors, constant: C, order: n, total: base.total,
    mostPerfect: errors.length === 0,
    checks: { magic: base.checked, brokenDiagonals: brokenChecked, blocks2x2: blockChecked, cornerQuads: cornerChecked },
  };
}

// --- the navagraha square for a planet (English or Sanskrit name) -----------
const GRAHA_INDEX = new Map();
for (const y of NAVAGRAHA_YANTRAS) { GRAHA_INDEX.set(y.graha.toLowerCase(), y); GRAHA_INDEX.set(y.en.toLowerCase(), y); }
export function yantraForGraha(name) {
  if (name == null) return null;
  return GRAHA_INDEX.get(String(name).trim().toLowerCase()) || null;
}

// ---------------------------------------------------------------------------
//  KAṬAPAYĀDI — decode an IAST word/verse to a number, and encode back.
// ---------------------------------------------------------------------------
// Tokenise an IAST string into consonants (with value) and vowels, greedily
// matching the longest consonant/vowel and skipping the ignorable marks.
function tokenizeIAST(text) {
  const s = String(text).toLowerCase();
  const CS = KATAPAYADI.consonantsByLength;   // already longest-first
  const VS = KATAPAYADI.vowels;               // already longest-first
  const IG = new Set(KATAPAYADI.ignore);
  const toks = [];
  let i = 0;
  outer: while (i < s.length) {
    if (IG.has(s[i])) { i++; continue; }
    for (const c of CS) { if (s.startsWith(c, i)) { toks.push({ type: 'C', ch: c, value: KATAPAYADI.map[c] }); i += c.length; continue outer; } }
    for (const v of VS) { if (s.startsWith(v, i)) { toks.push({ type: 'V', ch: v }); i += v.length; continue outer; } }
    i++;   // unrecognised char — skip
  }
  return toks;
}

// katapayadiDecode(text): apply the rules — last consonant of a cluster takes
// the value when a vowel follows; a bare vowel = 0; vowelless (trailing)
// consonants are ignored; digits read RIGHT-TO-LEFT. `.value` is a STRING (the
// π verse overflows Number precision); `.digits` is the in-word order.
export function katapayadiDecode(text) {
  const toks = tokenizeIAST(text);
  const digits = [];   // in word order
  const trace = [];
  let cluster = [];
  for (const t of toks) {
    if (t.type === 'C') { cluster.push(t); }
    else {
      if (cluster.length) { const last = cluster[cluster.length - 1]; digits.push(last.value); trace.push({ syllable: cluster.map(x => x.ch).join('') + t.ch, counted: last.ch, digit: last.value }); }
      else { digits.push(0); trace.push({ syllable: t.ch, counted: '(standalone vowel)', digit: 0 }); }
      cluster = [];
    }
  }
  const reading = [...digits].reverse();   // right-to-left = the actual number
  return {
    input: String(text), digits, reading, trace,
    value: reading.join(''),               // string (avoids precision loss)
    ignoredTrailingConsonants: cluster.map(x => x.ch),
    note: 'Digits read right-to-left ("aṅkānāṃ vāmato gatiḥ"); value returned as a string.',
    cite: KATAPAYADI.cite,
  };
}

// katapayadiEncode(number): one representative spelling (many exist — each
// digit has several consonants). Reverses the number's digits so the encoding
// round-trips through katapayadiDecode. `.alternatives` lists every candidate.
export function katapayadiEncode(number) {
  const str = String(number).replace(/[^0-9]/g, '');
  if (!str) return { input: String(number), syllables: '', digits: [], note: 'no digits' };
  const byDigit = {};
  for (const row of KATAPAYADI.table) byDigit[row.digit] = row.syllables.filter(x => !x.startsWith('('));
  const reversed = str.split('').reverse();     // katapayādi reads leftward
  const parts = reversed.map(d => byDigit[+d][0]);
  return {
    input: str, syllables: parts.join(''), digits: str.split('').map(Number),
    alternatives: reversed.map(d => ({ digit: +d, choices: byDigit[+d] })),
    note: 'One representative spelling; every digit has several consonant options (this is why one number has many mnemonic words). Reversed to round-trip through the right-to-left decoder.',
    cite: KATAPAYADI.cite,
  };
}

// ---------------------------------------------------------------------------
//  SARVATOBHADRA CHAKRA — build the 81-cell grid from the construction rules.
// ---------------------------------------------------------------------------
// Ordered border cells of the square [lo..hi]×[lo..hi] on a given side, in the
// classical reading direction (N: L→R, E: T→B, S: R→L, W: B→T).
function sideCells(lo, hi, side) {
  const out = [];
  if (side === 'north') for (let c = lo + 1; c <= hi - 1; c++) out.push([lo, c]);
  else if (side === 'east') for (let r = lo + 1; r <= hi - 1; r++) out.push([r, hi]);
  else if (side === 'south') for (let c = hi - 1; c >= lo + 1; c--) out.push([hi, c]);
  else if (side === 'west') for (let r = hi - 1; r >= lo + 1; r--) out.push([r, lo]);
  return out;
}

export function buildSarvatobhadra() {
  const S = SARVATOBHADRA, N = S.size;
  const grid = Array.from({ length: N }, () => new Array(N).fill(null));
  const set = (r, c, cell) => { grid[r][c] = { row: r, col: c, ...cell }; };

  // vowels at the four corners of each ring (all land on the two diagonals)
  for (const vr of S.vowelRings) {
    const lo = vr.ring - 1, hi = N - 1 - lo;
    set(lo, hi, { type: 'vowel', label: vr.NE, ring: vr.ring, corner: 'NE' });
    set(hi, hi, { type: 'vowel', label: vr.SE, ring: vr.ring, corner: 'SE' });
    set(hi, lo, { type: 'vowel', label: vr.SW, ring: vr.ring, corner: 'SW' });
    set(lo, lo, { type: 'vowel', label: vr.NW, ring: vr.ring, corner: 'NW' });
  }
  // ring 1 — the 28 nakṣatras (7 per side)
  for (const side of ['north', 'east', 'south', 'west']) {
    const cells = sideCells(0, N - 1, side), list = S.nakshatraSides[side];
    cells.forEach(([r, c], k) => set(r, c, { type: 'nakshatra', label: list[k].name, num: list[k].num, isAbhijit: !!list[k].isAbhijit, ring: 1 }));
  }
  // ring 2 — 20 consonants (5 per side) — FLAGGED (single OCR-degraded source)
  for (const side of ['north', 'east', 'south', 'west']) {
    const cells = sideCells(1, N - 2, side), list = S.consonantSides[side];
    cells.forEach(([r, c], k) => set(r, c, { type: 'consonant', label: list[k], ring: 2, flagged: true }));
  }
  // ring 3 — the 12 rāśis (3 per side, clockwise)
  for (const side of ['north', 'east', 'south', 'west']) {
    const cells = sideCells(2, N - 3, side), list = S.rashiSides[side];
    cells.forEach(([r, c], k) => set(r, c, { type: 'rashi', label: list[k], ring: 3 }));
  }
  // ring 4 — the four tithi-group + weekday cells (1 per side)
  for (const side of ['north', 'east', 'south', 'west']) {
    const cells = sideCells(3, N - 4, side), spec = S.ring4Sides[side];
    cells.forEach(([r, c]) => set(r, c, { type: 'tithivara', label: spec.tithiGroup, tithiGroup: spec.tithiGroup, weekdays: spec.weekdays, ring: 4 }));
  }
  // centre — Pūrṇā + Saturday
  const mid = (N - 1) / 2;
  set(mid, mid, { type: 'tithivara', label: S.center.tithiGroup, tithiGroup: S.center.tithiGroup, weekdays: S.center.weekdays, ring: 'center' });

  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) cells.push(grid[r][c]);
  const count = t => cells.filter(x => x && x.type === t).length;
  const byNakshatraNum = new Map();
  for (const cell of cells) if (cell && cell.type === 'nakshatra') byNakshatraNum.set(cell.num, cell);

  return {
    size: N, grid, cells, byNakshatraNum,
    counts: {
      vowels: count('vowel'), consonants: count('consonant'), nakshatras: count('nakshatra'),
      rashis: count('rashi'), tithiVara: count('tithivara'), total: cells.filter(Boolean).length,
    },
    accuracyFlags: S.accuracyFlags,
    cite: S.cite,
  };
}

// ---------------------------------------------------------------------------
//  sarvatobhadraVedha(nakshatraNum) — the piercing lines from a border
//  nakṣatra: occupation, the sammukha/front cell (straight across the centre),
//  and the two diagonal endpoints. Which diagonal is "forward" vs "hind"
//  depends on the planet's motion (a contested rule kept in the data), so both
//  are returned neutrally. Vowel targets propagate to their paired vowel.
// ---------------------------------------------------------------------------
export function sarvatobhadraVedha(nakshatraNum, chakra) {
  const sbc = chakra || buildSarvatobhadra();
  const N = sbc.size, hi = N - 1;
  const cell = sbc.byNakshatraNum.get(nakshatraNum);
  if (!cell) return null;
  const { row: r, col: c } = cell;
  const contentOf = (rr, cc) => sbc.grid[rr] && sbc.grid[rr][cc] ? sbc.grid[rr][cc] : null;
  const key = (rr, cc) => `${rr},${cc}`;
  const self = key(r, c);

  // front (sammukha): the point-reflection through the centre
  const front = contentOf(hi - r, hi - c);

  // the two diagonal lines through (r,c); report the FAR endpoints (≠ self)
  const endpoints = new Set();
  // ↘ diagonal (r+t, c+t)
  const dnBack = Math.min(r, c), dnFwd = Math.min(hi - r, hi - c);
  endpoints.add(key(r - dnBack, c - dnBack)); endpoints.add(key(r + dnFwd, c + dnFwd));
  // ↗ diagonal (r+t, c−t)
  const upBack = Math.min(r, hi - c), upFwd = Math.min(hi - r, c);
  endpoints.add(key(r - upBack, c + upBack)); endpoints.add(key(r + upFwd, c - upFwd));
  endpoints.delete(self);

  const vowelPairOf = v => { const p = SARVATOBHADRA.vowelPairs.find(pr => pr.includes(v)); return p ? p.find(x => x !== v) : null; };
  const wrap = content => {
    if (!content) return null;
    const out = { row: content.row, col: content.col, type: content.type, label: content.label };
    if (content.num) out.num = content.num;
    if (content.type === 'vowel') { const pair = vowelPairOf(content.label); if (pair) out.vowelPair = pair; }
    return out;
  };

  const diagonals = [...endpoints].map(k => { const [rr, cc] = k.split(',').map(Number); return wrap(contentOf(rr, cc)); }).filter(Boolean);

  return {
    nakshatra: { num: cell.num, name: cell.label, row: r, col: c, isAbhijit: !!cell.isAbhijit },
    occupied: wrap(cell),
    front: wrap(front),
    diagonals,
    rules: SARVATOBHADRA.vedha,
    note: 'A computable reconstruction of the three vedha lines (front + two diagonals). Which diagonal is "forward" vs '
      + '"hind" depends on the planet\'s motion; the luminaries/nodes rule and the primary source are both CONTESTED and '
      + 'kept in the data, unresolved. Vowel targets carry their paired vowel (a↔ā …).',
    cite: SARVATOBHADRA.vedha.cite,
  };
}

export { NAVAGRAHA_YANTRAS, CLASSICAL_SQUARES, KATAPAYADI, SARVATOBHADRA };
