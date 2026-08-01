// ============================================================================
//  scripts/research-validate.mjs — MAKE THE RESEARCH PROTOCOL FAIL LOUDLY.
//
//  WHY THIS EXISTS. Horae Mundi phase 1 produced 132 verdicts; 55 were
//  rejections, and 28 of those — 21% of every claim made — were a fabricated
//  citation or an invented attribution. The round-1 prompt had already demanded
//  fetched locators in bold. Nothing checked it, so the demand was an honour
//  system and the schema made compliance optional.
//
//  That is the repo's recurring defect shape, now seen three times:
//      · `witnesses` recorded a count nothing recomputed  → the roadmap lied
//      · `atlasSlug` asserted a join nothing resolved     → twelve dead links
//      · `fetched: true` asserted a retrieval nothing saw → invented citations
//  Stated as a rule: A FIELD THAT RECORDS A CLAIM ABOUT EVIDENCE IS NOT
//  EVIDENCE. If nothing can fail when the field is wrong, the field is
//  decoration.
//
//  This script is the mechanism. See docs/plans/horae/RESEARCH-PROTOCOL.md.
//
//  Usage:  node scripts/research-validate.mjs research/horae/*.json
//          node scripts/research-validate.mjs --dir research/horae
//          node scripts/research-validate.mjs --dir research/horae --strict
//
//  Default mode REPORTS. `--strict` exits 1 on any violation, which is how a
//  round should gate itself once the fetcher/compiler split (C3) is in use.
// ============================================================================

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const argv = process.argv.slice(2);
const STRICT = argv.includes('--strict');
const dirIx = argv.indexOf('--dir');
const files = dirIx >= 0
  ? readdirSync(argv[dirIx + 1]).filter(f => f.endsWith('.json')).map(f => join(argv[dirIx + 1], f))
  : argv.filter(a => a.endsWith('.json'));

if (!files.length) {
  console.error('[research-validate] no .json files given. Use --dir <path> or list files.');
  process.exit(2);
}

// Hedges that must not appear in a NOTE while the FIELD beside it states a bare
// value. A renderer reads the field; the caveat has to live in the field.
const HEDGE = /\b(unattested|not attested|uncertain|unverified|not verified|could not verify|approximate|approximated|disputed|contested|conjectur|reconstruct|speculat|no source|unclear|presumed|allegedly)\b/i;

// Fields whose value a renderer would show as fact.
const ASSERTIVE = ['ruler', 'name', 'quality', 'nameOriginal', 'transliteration'];

const out = [];
const rec = (file, kind, msg) => out.push({ file, kind, msg });

for (const f of files) {
  const name = basename(f);
  let j;
  try { j = JSON.parse(readFileSync(f, 'utf8')); }
  catch (e) { rec(name, 'unparsable', e.message); continue; }
  if (!j || typeof j !== 'object' || !j.entries) continue;   // not a dossier

  // ---- C1 · every claim carries a fetched snippet -------------------------
  const sources = Array.isArray(j.sources) ? j.sources : [];
  const sourceIds = new Set(sources.map(s => s && s.id).filter(Boolean));
  for (const s of sources) {
    if (!s || !s.id) continue;
    const hasSnippet = typeof s.snippet === 'string' && s.snippet.trim().length > 0;
    const claimsFetched = s.fetched === true;
    if (claimsFetched && !hasSnippet) {
      rec(name, 'C1-unevidenced-fetch',
        `source "${s.id}" declares fetched:true but carries no snippet. A fetch nobody `
        + 'can see is an assertion, not evidence.');
    }
    if (!claimsFetched && !/NOT OBTAINED|not obtained|could not/i.test(String(s.pd) + String(s.locator))) {
      rec(name, 'C1-unfetched-unmarked',
        `source "${s.id}" is not marked fetched and does not say it was unobtainable. `
        + 'State which — silence here is what invented citations hide behind.');
    }
  }

  // ---- C2 · a gap carries the same burden as a claim ----------------------
  for (const g of (j.gaps || [])) {
    if (typeof g === 'string') {
      rec(name, 'C2-bare-gap',
        `gap is a bare string: "${g.slice(0, 70)}…". A confirmed absence needs `
        + 'searchedWhere[] and searchTermsUsed[] — three of six dossiers invented one.');
    } else if (g && typeof g === 'object') {
      if (!Array.isArray(g.searchedWhere) || !g.searchedWhere.length) {
        rec(name, 'C2-gap-no-search', `gap "${String(g.claimedAbsent).slice(0, 50)}…" names no search locations`);
      }
    }
  }

  // ---- C3 · no citation may name a source outside the ledger --------------
  const walkRefs = (o, path) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach((x, i) => walkRefs(x, `${path}[${i}]`));
    for (const [k, v] of Object.entries(o)) {
      if (k === 'sourceRef' && typeof v === 'string' && v && !sourceIds.has(v)) {
        // Distinguish the two failures that look identical here. A comma-joined
        // "S1,S2,S3" resolves fine once split — that is a SHAPE violation (a
        // multi-value crammed into a single-value field), and calling it a
        // dangling reference would misdescribe it. Only an id that resolves
        // nowhere is the fabrication signal C3 exists to catch.
        const parts = v.split(',').map(x => x.trim()).filter(Boolean);
        const unresolved = parts.filter(p => !sourceIds.has(p));
        if (parts.length > 1 && !unresolved.length) {
          rec(name, 'C3-multi-ref-in-single-field',
            `${path}.sourceRef = "${v}" packs ${parts.length} ids into a single-id field. `
            + 'They all resolve, so this is shape, not fabrication — but a consumer '
            + 'splitting on the wrong assumption gets one bogus id instead of three good ones.');
        } else {
          rec(name, 'C3-dangling-sourceRef',
            `${path}.sourceRef = "${v}" names ${unresolved.length} id(s) absent from this `
            + `dossier's sources[]: ${unresolved.join(', ')}. A compiler may cite only what `
            + 'the fetcher returned.');
        }
      }
      walkRefs(v, `${path}.${k}`);
    }
  };
  walkRefs(j.entries, 'entries');

  // ---- C4 · field and prose may not disagree ------------------------------
  for (const [i, e] of (j.entries || []).entries()) {
    if (!e || typeof e !== 'object') continue;
    const noteText = [e.note, e.scopeNote, e.comment].filter(Boolean).join(' ');
    if (!HEDGE.test(noteText)) continue;
    for (const field of ASSERTIVE) {
      const v = e[field];
      if (typeof v !== 'string' || !v.trim()) continue;
      if (HEDGE.test(v)) continue;                       // caveat IS in the field — correct
      rec(name, 'C4-field-contradicts-note',
        `entries[${i}].${field} = "${v.slice(0, 40)}" states a bare value while its note hedges `
        + `("${(noteText.match(HEDGE) || [''])[0]}"). A renderer shows the field, not the note.`);
    }
  }
}

// ---- report ---------------------------------------------------------------
const byKind = new Map();
for (const o of out) byKind.set(o.kind, (byKind.get(o.kind) || 0) + 1);

console.log(`[research-validate] ${files.length} file(s) · ${out.length} violation(s)`);
if (out.length) {
  console.log('');
  for (const [k, n] of [...byKind.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${k}`);
  }
  console.log('');
  const shown = out.slice(0, 25);
  for (const o of shown) console.log(`  · [${o.file}] ${o.kind}\n      ${o.msg}`);
  if (out.length > shown.length) console.log(`  … and ${out.length - shown.length} more`);
}

if (STRICT && out.length) {
  console.log('');
  console.log('[research-validate] --strict: a round may not proceed on data that fails these.');
  process.exit(1);
}
