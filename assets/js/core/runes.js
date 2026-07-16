// ============================================================================
//  runes.js — the ELDER FUTHARK rune oracle engine. From a set of drawn stave
//  indices (0..23) and a chosen casting method it assembles the reading: the
//  drawn staves, each carrying its attested poem stanzas ABOVE its flagged modern
//  keyword, the method note (with the Tacitus dispute for the scatter-cast), and
//  the honest framing block.
//
//  PURE — no DOM and NO randomness. The caller (app/runes.js) scatters and draws
//  the lots (crypto.getRandomValues, DISTINCT indices); this module only
//  validates and reads, so it is headless-testable and deterministic — the same
//  contract as core/iching.js and core/geomancy.js.
//
//  HONEST FRAMING: the Elder Futhark was a WRITING system (c. 150–700/800 CE);
//  no ancient source gives a rune-by-rune meaning table — the per-rune oracle is a
//  20th-century construction. What is attested (the medieval rune poems) is quoted
//  as such; every "modern meaning" is flagged; disputes are flagged, never
//  resolved. A divinatory art of no demonstrated validity — described, never
//  prescribed.
// ============================================================================
import {
  RUNES, AETTIR, CASTING_METHODS, POEMS, FRAMING, RUNES_SOURCES,
  runeById, runeByTranslit,
} from './data/runes-data.js';

const DECK_SIZE = RUNES.length;                         // 24 — no blank rune
const METHOD_BY_ID = new Map(CASTING_METHODS.map(m => [m.id, m]));

// --- lookups (pure) ---------------------------------------------------------
export function byId(id) { return runeById(id); }
export function byTranslit(t) { return runeByTranslit(t); }

// The ætt (1..3) of a 1-indexed futhark position (1..24) — the attested 3×8
// division: ætt(n) = floor((n-1)/8)+1.
export function aettOf(position) {
  const p = Number(position);
  if (!Number.isInteger(p) || p < 1 || p > DECK_SIZE) throw new Error('runes: position must be an integer 1..' + DECK_SIZE);
  const num = Math.floor((p - 1) / 8) + 1;
  return AETTIR.find(a => a.num === num) || null;
}

// Poem-coverage summary — the corrected premise: via the OE poem NO stave lacks a
// medieval poem; the gap is Norse-side only (exactly 8 staves have no Norse
// stanza). Computed from the data so it can never drift.
export function poemCoverageOf() {
  const oe = RUNES.filter(r => r.poems.oe).length;
  const norseCovered = RUNES.filter(r => r.poems.no || r.poems.is);
  const oeOnly = RUNES.filter(r => !r.poems.no && !r.poems.is);
  const noPoem = RUNES.filter(r => !r.poems.oe && !r.poems.no && !r.poems.is);
  return {
    total: RUNES.length,
    oe,                                                 // 24
    norse: norseCovered.length,                         // 16
    norseStaves: norseCovered.map(r => r.id),
    oeOnly: oeOnly.length,                              // 8
    oeOnlyStaves: oeOnly.map(r => r.id),                // gebo, wunjo, pertho, algiz, ehwaz, ingwaz, dagaz, othala
    noPoem: noPoem.length,                              // 0
  };
}

// The staves flagged as contested (name/meaning disputes + the two order
// variances) — a convenience for the page and the anti-drift test.
export function contestedStaves() { return RUNES.filter(r => r.contested).map(r => r.id); }

// ---------------------------------------------------------------------------
//  castFromDraws(indices, methodId) — the full reading from injected draws.
//  `indices`: an array of DISTINCT stave indices in 0..23, of the method's
//  required length (tacitus & three → 3; single → 1). `methodId`: 'tacitus'
//  (default), 'single' or 'three'. Throws on a bad method, a wrong count, an
//  out-of-range index, or a duplicate — so the app can never smuggle in a
//  malformed or blank-rune cast.
// ---------------------------------------------------------------------------
export function castFromDraws(indices, methodId = 'tacitus') {
  const method = METHOD_BY_ID.get(methodId);
  if (!method) throw new Error('runes: unknown casting method "' + methodId + '"');
  if (!Array.isArray(indices)) throw new Error('runes: draws must be an array of stave indices');
  if (indices.length !== method.drawCount) {
    throw new Error(`runes: method "${methodId}" needs ${method.drawCount} distinct draw(s), got ${indices.length}`);
  }
  for (const i of indices) {
    if (!Number.isInteger(i) || i < 0 || i >= DECK_SIZE) {
      throw new Error('runes: each draw must be an integer stave index 0..' + (DECK_SIZE - 1));
    }
  }
  if (new Set(indices).size !== indices.length) throw new Error('runes: draws must be distinct staves (no repeats)');

  const staves = indices.map((idx, i) => ({
    ...RUNES[idx],
    drawIndex: idx,
    slot: i + 1,
    positionLabel: method.positions[i] || `position ${i + 1}`,
  }));

  const methodNote = method.historicity === 'prototype'
    ? `${method.procedure} — ${method.dispute}`
    : `${method.procedure} ${method.note || ''}`.trim();

  return {
    method: {
      id: method.id, label: method.label, drawCount: method.drawCount,
      historicity: method.historicity, modern: !!method.modern,
      quote: method.quote || null, quoteCite: method.quoteCite || null,
      latinKey: method.latinKey || null, dispute: method.dispute || null,
      cite: method.cite,
    },
    staves,
    methodNote,
    framing: FRAMING,
    note: 'The Elder Futhark was a writing system; no ancient source gives a rune-by-rune meaning table. This reproduces a 20th-century practice over the attested medieval rune-poem material — a mirror for reflection, never a prediction.',
    cite: RUNES_SOURCES,
  };
}

export { RUNES, AETTIR, CASTING_METHODS, POEMS, FRAMING, RUNES_SOURCES, DECK_SIZE };
