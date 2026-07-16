// ============================================================================
//  yogasutra.js — the PURE reading layer over the four Yoga-sūtra data modules.
//
//  It imports the per-pāda data (pada1..pada4) and the metadata (meta.js) and
//  flattens them into ONE uniform, DOM-free catalogue that the pages consume.
//  No DOM, no side effects — a light index only (mirrors the core/data policy).
//
//  ── THE FLATTENING (documented, because Book III is dual-numbered) ──────────
//  Every record in ALL_SUTRAS has the SAME shape:
//
//    { pada, roman, num, num196?, variant?, bhojaNum?, anchor, ref,
//      devanagari, iast, words:[{sa,gloss}], translation, note, src,
//      bhashya, bhashyaSrc }   ← the Vyāsa-bhāṣya gist (bhashya null on the
//                                one variant record; bhashyaSrc absent there)
//
//  • `num`  is the VULGATE number (the 195-count of Woods 1914 / Rama Prasada
//           1912 / sanskritdocuments / the Vyāsa-bhāṣya tradition):
//              – Books I, II, IV: the module's own `num`.
//              – Book III:        the module's `num195` — which is `null` on the
//                                 ONE disputed variant record ("etena
//                                 śabdādyantardhānam uktam"), because that sūtra
//                                 does not exist in the vulgate at all.
//  • `num196` is carried ONLY on Book-III records — the inclusive numbering
//           (1..56) of Taimni / Satchidananda / Iyengar. `num196 === num` for
//           num196 ≤ 21; the variant is num196 22 (num null); thereafter
//           `num === num196 − 1`. It is the stable array position, so it is used
//           as the deep-link `anchor` for Book III.
//  • `variant:true`  marks the disputed III.22 record (Book III only).
//  • `bhojaNum`      is carried ONLY on Book-IV records (Bhoja's Rājamārtaṇḍa
//           omits the vulgate IV.16, so bhojaNum is null there and −1 after).
//  • `anchor` is the number used for the `#s<n>` page anchor: `num196` in
//           Book III (always defined & unique), `num` elsewhere.
//  • `ref`  is the human reference string, e.g. "II.29"; the Book-III variant
//           gets "III.22*" (the star = "inclusive editions only").
//
//  ALL_SUTRAS.length === 196 (51 + 55 + 56 + 34) — the variant record IS
//  included, so the array carries the inclusive text in Book-III order.
// ============================================================================

import { YS_META } from './data/yogasutra/meta.js';
import { PADA1 } from './data/yogasutra/pada1.js';
import { PADA2 } from './data/yogasutra/pada2.js';
import { PADA3 } from './data/yogasutra/pada3.js';
import { PADA4 } from './data/yogasutra/pada4.js';

export { YS_META };

const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
const ROMAN_TO_PADA = { I: 1, II: 2, III: 3, IV: 4 };

// Copy the common fields once, so every flattened record is a fresh object
// (never a shared reference into the source module).
function base(r, pada, num) {
  return {
    pada, roman: ROMAN[pada], num,
    devanagari: r.devanagari, iast: r.iast,
    words: r.words, translation: r.translation, note: r.note, src: r.src,
    // The Vyāsa-bhāṣya gist (an original paraphrase after Woods 1914) + its
    // provenance. `bhashya` is null on the one disputed variant record (which
    // has no classical comment — the reason the vulgate omits it), and
    // `bhashyaSrc` is then absent; every other record carries both.
    bhashya: r.bhashya, bhashyaSrc: r.bhashyaSrc,
  };
}

function flatten() {
  const out = [];
  for (const r of PADA1) {
    const rec = base(r, 1, r.num);
    rec.anchor = r.num; rec.ref = `I.${r.num}`;
    out.push(rec);
  }
  for (const r of PADA2) {
    const rec = base(r, 2, r.num);
    rec.anchor = r.num; rec.ref = `II.${r.num}`;
    out.push(rec);
  }
  for (const r of PADA3) {
    const rec = base(r, 3, r.num195);          // num = the vulgate number (null on the variant)
    rec.num196 = r.num196;
    rec.variant = !!r.variant;
    rec.anchor = r.num196;                       // stable anchor: 1..56, always defined
    rec.ref = r.variant ? `III.${r.num196}*` : `III.${r.num195}`;
    out.push(rec);
  }
  for (const r of PADA4) {
    const rec = base(r, 4, r.num);
    rec.bhojaNum = r.bhojaNum;
    rec.anchor = r.num; rec.ref = `IV.${r.num}`;
    out.push(rec);
  }
  return out;
}

export const ALL_SUTRAS = flatten();

// ── sutraByRef('II.29') ────────────────────────────────────────────────────
// Resolves a VULGATE reference (roman pāda + vulgate number) to its record.
// Book-III references use the vulgate (195) numbering, so the disputed variant
// — absent from the vulgate — is not addressable this way (by design). Accepts
// "II.29", "ii.29", "II 29", "2.29".
export function sutraByRef(ref) {
  if (!ref) return undefined;
  const m = String(ref).trim().match(/^([IVX]+|[1-4])[.\s]+(\d+)$/i);
  if (!m) return undefined;
  const key = m[1].toUpperCase();
  const pada = ROMAN_TO_PADA[key] ?? Number(key);
  const num = Number(m[2]);
  if (!pada || !num) return undefined;
  return ALL_SUTRAS.find(s => s.pada === pada && s.num === num && !s.variant);
}

// ── searchSutras(q) ────────────────────────────────────────────────────────
// Case-insensitive substring search over IAST + translation + the word glosses
// (both the Sanskrit lemma `sa` and its English `gloss`). Diacritic-folded so a
// plain-ASCII query ("kaivalya", "samadhi") still matches the accented text.
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function searchSutras(q) {
  const needle = fold(q).trim();
  if (!needle) return [];
  return ALL_SUTRAS.filter(s => {
    if (fold(s.iast).includes(needle)) return true;
    if (fold(s.translation).includes(needle)) return true;
    return (s.words || []).some(w => fold(w.sa).includes(needle) || fold(w.gloss).includes(needle));
  });
}

// ── counts() ───────────────────────────────────────────────────────────────
// The per-pāda and by-edition totals, ALL derived LIVE from the loaded data
// (not copied from meta) — so the numbers can never drift from the records.
//   • Book III: inclusive = every record; vulgate = minus the variant.
//   • Book IV : bhoja = records that Bhoja keeps (bhojaNum !== null).
export function counts() {
  const p1 = PADA1.length;                                   // 51
  const p2 = PADA2.length;                                   // 55
  const p3variant = PADA3.filter(r => r.variant).length;      // 1
  const p3incl = PADA3.length;                                // 56 (with the variant)
  const p3vulg = p3incl - p3variant;                          // 55 (Vyāsa/Bhoja)
  const p4 = PADA4.length;                                    // 34
  const p4bhoja = PADA4.filter(r => r.bhojaNum != null).length; // 33

  const perPada = [
    { pada: 1, name: YS_META.padas[0].name, count: p1 },
    { pada: 2, name: YS_META.padas[1].name, count: p2 },
    { pada: 3, name: YS_META.padas[2].name, inclusive: p3incl, vulgate: p3vulg, variant: p3variant },
    { pada: 4, name: YS_META.padas[3].name, vulgate: p4, bhoja: p4bhoja },
  ];

  const byEdition = [
    { total: p1 + p2 + p3incl + p4, detail: `${p1}/${p2}/${p3incl}/${p4}`,
      editions: 'Iyengar, Taimni, Satchidananda (include the III.22 variant)' },
    { total: p1 + p2 + p3vulg + p4, detail: `${p1}/${p2}/${p3vulg}/${p4}`,
      editions: 'Vyāsa-bhāṣya tradition, Krishnamacharya, Āraṇya, sanskritdocuments (omit it)' },
    { total: p1 + p2 + p3vulg + p4bhoja, detail: `${p1}/${p2}/${p3vulg}/${p4bhoja}`,
      editions: "Bhoja's Rājamārtaṇḍa (omits it AND treats vulgate IV.16 as commentary)" },
  ];

  return {
    perPada,
    byEdition,
    pada3: { inclusive: p3incl, vulgate: p3vulg, variant: p3variant },
    pada4: { total: p4, bhoja: p4bhoja },
    editions: { inclusive: byEdition[0].total, vulgate: byEdition[1].total, bhoja: byEdition[2].total },
    allSutras: ALL_SUTRAS.length,
  };
}

// ── The whole-work citation ────────────────────────────────────────────────
export const YS_CITATION =
  'Pātañjala Yoga-sūtra (the Yogasūtra of Patañjali), four pādas — 196 sūtras in the ' +
  'inclusive count (vulgate 195; Bhoja 194). Devanāgarī: sanskritdocuments.org ' +
  '(Vedic accents stripped); word-by-word glosses: Rama Prasada, Sacred Books of the ' +
  'Hindus vol. IV (Pāṇini Office, 1912); whole-sūtra translations: J. H. Woods, ' +
  'The Yoga-System of Patañjali (Harvard Oriental Series 17, 1914).';
