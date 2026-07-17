// ============================================================================
//  core/explain/util.js — PURE helpers shared by the "In plain words" text-model
//  builders (explain/workbench.js, explain/horary.js, explain/nativity.js).
//
//  These builders emit a computed, deterministic TEXT MODEL — never interpretation
//  as truth. The voice is always ATTRIBUTED ("the tradition reads this as…",
//  "Lilly would judge…") and the second-person-destiny register is banned:
//  BANNED_PHRASES below is enforced by scripts/tests/r28-explain.mjs, which greps
//  every emitted model on reference charts. No DOM, no Date, no randomness — the
//  whole layer is headless-testable and offline-first (chart-ux.md §4, §8, §10).
// ============================================================================

// The forbidden register: horoscope voice, fortune-telling, determinism. Kept
// here as the single source of truth so the engine test and the builders agree.
export const BANNED_PHRASES = [
  'you will', 'you are destined', 'is destined', 'your destiny', 'this means you are',
  'you must', 'you should', 'guarantees', 'will definitely', 'foretells that you',
  'predicts that you', 'is fated', 'are fated',
];

// Return the first banned phrase found in `text` (case-insensitive), else null.
export function findBanned(text) {
  const low = String(text || '').toLowerCase();
  for (const p of BANNED_PHRASES) if (low.includes(p)) return p;
  return null;
}

// Slug used as the Glossary anchor id for a term — MUST match app/autolink.js's
// slugTerm so a term-chip's #slug resolves to the same entry. (A test pins this.)
export function termSlug(t) {
  return String(t).toLowerCase().replace(/\([^)]*\)/g, '').trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// A glossary reference for the text model: { term, slug }.
export const mkTerm = term => ({ term, slug: termSlug(term) });

// Deduplicate a list of {term,slug} by slug, preserving order.
export function uniqTerms(terms) {
  const seen = new Set(); const out = [];
  for (const t of terms) { if (!t || seen.has(t.slug)) continue; seen.add(t.slug); out.push(t); }
  return out;
}

// XML/HTML-safe escaping for the mechanics HTML (core-safe: string only).
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export const sgn = n => (n >= 0 ? '+' : '') + n;

// The N tightest aspects from a reading's aspect list (a copy, sorted by orb).
export function tightestAspects(list, n = 3) {
  return [...(list || [])].sort((a, b) => a.orb - b.orb).slice(0, n);
}

// Strongest & most-afflicted body by ESSENTIAL dignity total, from a
// reading.dignities.perPlanet map. Returns { strongest, weakest } or null.
export function dignityExtremes(perPlanet) {
  const rows = Object.keys(perPlanet || {}).map(name => ({
    name, total: (perPlanet[name] && perPlanet[name].essential && perPlanet[name].essential.total) || 0,
  }));
  if (!rows.length) return null;
  let strongest = rows[0], weakest = rows[0];
  for (const r of rows) { if (r.total > strongest.total) strongest = r; if (r.total < weakest.total) weakest = r; }
  return { strongest, weakest };
}

// Map the site's green/amber/red verdict to an explain-block tone token.
export function verdictTone(v) {
  return v === 'green' ? 'ok' : v === 'amber' ? 'warn' : v === 'red' ? 'bad' : null;
}

// A well-formed text model. Every builder returns exactly this shape so the
// app renderer (app/explain-block.js) and the test can rely on it.
export function model({ anchorId, label = 'In plain words', text, terms = [], tone = null, mechanics = null }) {
  return {
    anchorId,
    plain: { label, text: String(text || '').replace(/\s+/g, ' ').trim(), terms: uniqTerms(terms), tone },
    mechanics: mechanics && {
      summary: mechanics.summary || 'What the tradition computes here',
      html: mechanics.html || '',
      citation: mechanics.citation || '',
      contested: mechanics.contested || [],
    },
  };
}
