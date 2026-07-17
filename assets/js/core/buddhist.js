// ============================================================================
//  buddhist.js — the PURE reading layer over the Buddhist wing data modules.
//
//  Mirrors yogasutra.js: it imports the generated per-text data (metta / heart /
//  mn118) and the assembled BUDDHIST_TEXTS barrel and exposes a small, DOM-free
//  index the pages consume. No DOM, no side effects, no rAF.
//
//  ── THE THREE TEXTS ─────────────────────────────────────────────────────────
//    • metta  — Metta Sutta (Snp 1.8), 43 segment records, 138 glossed words.
//               Verse text; snp1.8:10.5 (colophon) has translation === null.
//    • heart  — Heart Sūtra (shorter), 16 records, 132 words. Records key the
//               root on `sanskrit` (not `pali`); `ped` carries MW citations.
//    • mn118  — Ānāpānassati Sutta (MN 118), 154 records = 105 full + 49
//               refrain-use over 6 refrains (the peyyāla model). Full records
//               carry words[]; refrain-use records carry {refrain, substitutions}
//               and are expanded on demand by expandRefrain().
//
//  ── THE RECONSTRUCTION INVARIANT (house-style, live-from-data) ──────────────
//  For EVERY record, reconstruct(rec) === (rec.pali ?? rec.sanskrit):
//    • full record   → words[].w joined with single spaces;
//    • refrain-use   → the refrain template expanded with the record's
//                      substitutions, joined with single spaces.
//  This is the single strongest automatic proof that no word was silently
//  skipped in glossing; the engine-test runs it over all 213 records.
//
//  ── LICENCE DISCIPLINE (per-record / per-layer tags ∈ {cc0, pd-age, original})
//  Translations are reproduced VERBATIM from the CC0 (Sujato) / PD (Müller SBE 49)
//  source; word-glosses are ORIGINAL prose informed by the PD dictionaries
//  (PED 1921–25 for Pāli, Monier-Williams 1899 for Sanskrit), cited per word.
// ============================================================================

import {
  BUDDHIST_TEXTS,
  METTA_META, METTA_RECORDS,
  HEART_META, HEART_RECORDS,
  MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES,
  DHAMMAPADA_META, DHAMMAPADA_RECORDS,
} from './data/buddhist/index.js';

export {
  BUDDHIST_TEXTS,
  METTA_META, METTA_RECORDS,
  HEART_META, HEART_RECORDS,
  MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES,
  DHAMMAPADA_META, DHAMMAPADA_RECORDS,
};

// ── records-by-id map (private) ─────────────────────────────────────────────
// R31 extends the reader with the Dhammapada (vaggas 1–5, Dhp 1–75). Its
// records use the verse-text shape ({ref, pali, words, translation, notes} +
// a derived `section`), so every existing helper — recordsFor, reconstruct,
// searchBuddhist, buddhistStats — handles it with no special-casing.
const RECORDS_BY_ID = {
  metta: METTA_RECORDS,
  heart: HEART_RECORDS,
  mn118: MN118_RECORDS,
  dhammapada: DHAMMAPADA_RECORDS,
};

// ── textById('mn118') ───────────────────────────────────────────────────────
// Returns the BUDDHIST_TEXTS metadata entry for a text id, or undefined.
export function textById(id) {
  return BUDDHIST_TEXTS.find(t => t.id === id);
}

// ── recordsFor('metta') ─────────────────────────────────────────────────────
// Returns the RAW segment records for a text (refrain-use records are NOT
// pre-expanded — the caller expands them on demand via expandRefrain, so the
// peyyāla stays collapsed by default). Returns [] for an unknown id.
export function recordsFor(id) {
  return RECORDS_BY_ID[id] || [];
}

// ── the gloss index for refrain expansion (built once, private) ─────────────
// A refrain-use's varying tokens are glossed once — in the refrain's own
// words[] (fixed frame + sample) or in MN118_SUBSTITUTION_GLOSSES (the
// sixteen-aspect object forms). We index both by exact surface form and by a
// punctuation/quote-stripped key so expandRefrain can attach a gloss to every
// expanded token as a display convenience. Gloss attachment never affects the
// reconstruction invariant (which depends only on the `w` surface strings).
const stripKey = w => String(w).replace(/^[‘’“”'"]+/, '').replace(/[.,;:!?‘’“”'"]+$/, '');

const EXACT_GLOSS = new Map();   // surface form → {gloss, gram, ped}
const STRIP_GLOSS = new Map();   // stripped form → {gloss, gram, ped}
function indexGloss(w) {
  if (!w || !w.w) return;
  const val = { gloss: w.gloss ?? null, gram: w.gram ?? null, ped: w.ped ?? null };
  if (!EXACT_GLOSS.has(w.w)) EXACT_GLOSS.set(w.w, val);
  const k = stripKey(w.w);
  if (!STRIP_GLOSS.has(k)) STRIP_GLOSS.set(k, val);
}
for (const rf of MN118_REFRAINS) for (const w of (rf.words || [])) indexGloss(w);
for (const r of MN118_RECORDS) for (const w of (r.words || [])) indexGloss(w);
for (const w of MN118_SUBSTITUTION_GLOSSES) {
  // substitution glosses are keyed by stripped surface form (per mn118 conventions)
  const val = { gloss: w.gloss ?? null, gram: w.gram ?? null, ped: w.ped ?? null };
  STRIP_GLOSS.set(stripKey(w.w), val);
  if (!EXACT_GLOSS.has(w.w)) EXACT_GLOSS.set(w.w, val);
}
function glossToken(tok) {
  const g = EXACT_GLOSS.get(tok) || STRIP_GLOSS.get(stripKey(tok)) || { gloss: null, gram: null, ped: null };
  return { w: tok, gloss: g.gloss, gram: g.gram, ped: g.ped };
}

// ── expandRefrain(rec, refrains) ────────────────────────────────────────────
// Expands a MN 118 refrain-use record into a full words[] table, applying its
// substitutions to the referenced refrain's template. Each returned entry is
// {w, gloss, gram, ped} (gloss best-effort from the gloss index). Non-refrain-use
// records (or an unresolved refrain) yield []. `refrains` defaults to the module's
// MN118_REFRAINS — a refrain-use only ever exists in MN 118.
export function expandRefrain(rec, refrains = MN118_REFRAINS) {
  if (!rec || rec.kind !== 'refrain-use') return [];
  const rf = refrains.find(x => x.id === rec.refrain);
  if (!rf) return [];
  const subs = rec.substitutions || {};
  const out = [];
  for (const item of rf.template) {
    if (item.t !== undefined) out.push(glossToken(item.t));
    else if (item.slot !== undefined) for (const tk of (subs[item.slot] || [])) out.push(glossToken(tk));
  }
  return out;
}

// ── reconstruct(rec, refrains) ──────────────────────────────────────────────
// Rebuilds the record's surface string from its words per the documented
// join-on-single-space convention. For a refrain-use it expands first. The
// invariant reconstruct(rec) === (rec.pali ?? rec.sanskrit) holds for every
// shipped record (asserted in the engine-test).
export function reconstruct(rec, refrains = MN118_REFRAINS) {
  if (!rec) return '';
  if (rec.kind === 'refrain-use') return expandRefrain(rec, refrains).map(w => w.w).join(' ');
  return (rec.words || []).map(w => w.w).join(' ');
}

// ── searchBuddhist(q) ───────────────────────────────────────────────────────
// Diacritic-folded substring search across every text's root string
// (pali/sanskrit), word glosses, and translation text. Returns flat hits
// [{ id, ref, rec }]. A plain-ASCII query ("anapanasati", "mindfulness") still
// matches the accented Pāli/Sanskrit. Refrain-use records are searched against
// their stored pali + translation (their glosses live in the refrain).
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export function searchBuddhist(q) {
  const needle = fold(q).trim();
  if (!needle) return [];
  const hits = [];
  for (const t of BUDDHIST_TEXTS) {
    for (const rec of recordsFor(t.id)) {
      const root = rec.pali ?? rec.sanskrit ?? '';
      const trans = rec.translation ? (rec.translation.text || '') : '';
      let hit = fold(root).includes(needle) || fold(trans).includes(needle);
      if (!hit && rec.words) hit = rec.words.some(w => fold(w.w).includes(needle) || fold(w.gloss).includes(needle));
      if (hit) hits.push({ id: t.id, ref: rec.ref, rec });
    }
  }
  return hits;
}

// ── buddhistStats() ─────────────────────────────────────────────────────────
// Live totals derived from the loaded data (never hard-typed): the text count,
// the segment total, the glossed-word total, the peyyāla tallies, a per-text
// breakdown, and the licence distribution over segments (by translation layer;
// all word-glosses are `original`).
export function buddhistStats() {
  const byText = BUDDHIST_TEXTS.map(t => {
    const recs = recordsFor(t.id);
    const e = { id: t.id, segments: recs.length, words: recs.reduce((n, r) => n + (r.words ? r.words.length : 0), 0) };
    if (t.id === 'mn118') {
      e.refrains = MN118_REFRAINS.length;
      e.refrainUses = recs.filter(r => r.kind === 'refrain-use').length;
      e.fullRecords = recs.filter(r => r.kind === 'full').length;
    }
    return e;
  });
  const segments = byText.reduce((n, e) => n + e.segments, 0);
  const glossedWords = byText.reduce((n, e) => n + e.words, 0);
  const byLicence = {};
  for (const t of BUDDHIST_TEXTS) {
    const tag = t.licence.translation;
    byLicence[tag] = (byLicence[tag] || 0) + recordsFor(t.id).length;
  }
  return {
    texts: BUDDHIST_TEXTS.length,
    segments,
    glossedWords,
    refrains: MN118_REFRAINS.length,
    refrainUseRecords: MN118_RECORDS.filter(r => r.kind === 'refrain-use').length,
    byText,
    byLicence,          // segment records grouped by their translation-layer licence tag
    glossLicence: 'original',
  };
}

// ── The whole-wing citation ─────────────────────────────────────────────────
export const BUDDHIST_CITATION =
  'A curated Buddhist canon, word-by-word in the manner of the Yoga-sūtra wing. ' +
  'Pāli root: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via ' +
  'SuttaCentral (declared public domain). Pāli translations: Bhikkhu Sujato ' +
  '(SuttaCentral, CC0), reproduced verbatim. Heart Sūtra: F. Max Müller, Sacred ' +
  'Books of the East vol. 49 (1894; US-PD), verbatim, over a normalised IAST of the ' +
  'Müller–Nanjio 1884 shorter recension. Word-glosses: original prose after the PTS ' +
  'Pali-English Dictionary (1921–25, PD) and Monier-Williams (1899, PD), cited per ' +
  'word. Every record source-stamped; described never prescribed.';
