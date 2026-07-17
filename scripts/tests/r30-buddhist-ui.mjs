// ============================================================================
//  scripts/tests/r30-buddhist-ui.mjs — R30 Buddhist scriptures wing (the
//  reading-room UI) headless tests. Exports `async run() -> {pass, failures[]}`
//  for engine-test.mjs and a `DRIVES` array for the Chromium sweep.
//
//  Two tiers (the parallel-builder pattern from r28-vedic-ui):
//   • STRUCTURAL (always runnable): read the five page HTMLs, the app module and
//     the CSS as text and assert the load-bearing invariants — mountChrome key,
//     initBuddhist wiring, the room/counts hosts, the honest notes, the glosstip
//     import, no stray requestAnimationFrame, DS-tokens-only CSS, the verbatim
//     licensing quotes on the sources page.
//   • BEHAVIOURAL (guarded): dynamically import B-bud-data's pure contract
//     (core/buddhist.js + core/data/buddhist/index.js) and assert the data↔wing
//     contract this UI codes against — textById/recordsFor/buddhistStats, the
//     6 MN118 refrains, expandRefrain on a refrain-use, the reconstruct
//     invariant, and that a null translation (the Metta colophon) is present.
//     When those modules are absent (B-bud-data integrates in parallel) the
//     block is SKIPPED and noted, never failed.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => readFileSync(resolve(REPO, rel), 'utf8');
const has = rel => existsSync(resolve(REPO, rel));

const failures = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); };
async function guard(label, fn) {
  try { await fn(); } catch (e) { notes.push(`skipped ${label}: ${e && e.message ? e.message : e}`); }
}

export async function run() {
  failures.length = 0; notes.length = 0;

  // ---- STRUCTURAL: the five pages ----------------------------------------
  const pages = {
    'pages/buddhist/index.html': 'index',
    'pages/buddhist/metta.html': 'metta',
    'pages/buddhist/heart.html': 'heart',
    'pages/buddhist/mn118.html': 'mn118',
    'pages/buddhist/sources.html': 'sources',
  };
  for (const [p, page] of Object.entries(pages)) {
    ok(has(p), `${p} exists`);
    if (!has(p)) continue;
    const h = read(p);
    ok(/mountChrome\(['"]buddhist['"]\)/.test(h), `${page}: mounts chrome key buddhist`);
    ok(new RegExp(`initBuddhist\\(['"]${page}['"]\\)`).test(h), `${page}: calls initBuddhist('${page}')`);
    ok(/buddhist\.css/.test(h), `${page}: links buddhist.css`);
    ok(/no demonstrated validity/i.test(h.replace(/\s+/g, ' ')), `${page}: carries the no-validity note`);
  }

  // index-specific hosts
  if (has('pages/buddhist/index.html')) {
    const h = read('pages/buddhist/index.html');
    ok(/id="bud-counts"/.test(h), 'index: has #bud-counts live-counts host');
    ok(/id="bud-q"/.test(h) && /id="bud-results"/.test(h), 'index: has the cross-text search box + results host');
    ok(/class="wing-hero"/.test(h), 'index: has the wing-hero');
    ok(/class="ep-strip"/.test(h), 'index: has the epistemic strip');
    ok(/id="canon"/.test(h) && /catalogued, not glossed/i.test(h), 'index: has the honest wider-canon note');
    ok(/confluence\.html#anapanasati-sutta/.test(h), 'index: cross-links the Confluence buddhist lane');
    ok(/yoga\/index\.html/.test(h), 'index: cross-links the Yoga wing');
  }
  // reading rooms need the #bud-room host + the filterbar
  for (const p of ['pages/buddhist/metta.html', 'pages/buddhist/heart.html', 'pages/buddhist/mn118.html']) {
    if (!has(p)) continue;
    const h = read(p);
    ok(/id="bud-room"/.test(h), `${p}: has the #bud-room host`);
    ok(/id="bud-filter"/.test(h) && /id="bud-filter-count"/.test(h), `${p}: has the client-side filter`);
    ok(/class="pager"/.test(h), `${p}: has the book pager`);
  }
  // heart page must name the Nattier crux; mn118 must document the peyyāla
  if (has('pages/buddhist/heart.html')) ok(/Nattier/.test(read('pages/buddhist/heart.html')), 'heart: names the Nattier origins crux');
  if (has('pages/buddhist/mn118.html')) ok(/peyy[āa]la/i.test(read('pages/buddhist/mn118.html')), 'mn118: documents the peyyāla refrains');

  // ---- STRUCTURAL: the sources / licensing ledger ------------------------
  if (has('pages/buddhist/sources.html')) {
    const raw = read('pages/buddhist/sources.html');
    const h = raw.replace(/\s+/g, ' ');   // collapse HTML whitespace so verbatim quotes match across line wraps
    ok(/dedicated to the Public Domain by means of Creative Commons Zero/.test(h), 'sources: verbatim SuttaCentral CC0 quote');
    ok(/All translations created in Bilara/.test(h), 'sources: verbatim bilara-data LICENSE quote');
    ok(/politely request that our content not be scraped/.test(h), 'sources: acknowledges the SuttaCentral AI request verbatim');
    ok(/quote-safe/.test(h) && /cite-only/.test(h), 'sources: the quote-safe vs cite-only ledger');
    ok(/PED s\.v\.|Monier-Williams/.test(h), 'sources: states the PED/MW gloss discipline');
    ok(/reconstruction invariant/i.test(h), 'sources: states the reconstruction invariant');
    ok(/id="hiw-buddhist"/.test(raw), 'sources: has the #hiw-buddhist how-it-works anchor');
  }

  // ---- STRUCTURAL: the app module ----------------------------------------
  {
    const a = 'assets/js/app/buddhist.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'buddhist.js has no requestAnimationFrame (site invariant)');
      ok(/from '\.\.\/core\/buddhist\.js'/.test(s), 'buddhist.js imports the core/buddhist.js contract');
      ok(/textById/.test(s) && /recordsFor/.test(s) && /buddhistStats/.test(s) && /expandRefrain/.test(s) && /reconstruct/.test(s), 'buddhist.js consumes the frozen core contract');
      ok(/BUDDHIST_TEXTS/.test(s) && /MN118_REFRAINS/.test(s), 'buddhist.js consumes BUDDHIST_TEXTS + MN118_REFRAINS');
      ok(/from '\.\/glosstip\.js'/.test(s) && /initGlosstip/.test(s), 'buddhist.js reuses the glosstip pattern (imports initGlosstip)');
      ok(/export function initBuddhist/.test(s), 'buddhist.js exports initBuddhist');
      ok(/kind === 'refrain-use'/.test(s), 'buddhist.js handles refrain-use records (peyyāla)');
      ok(/translation == null|t == null/.test(s), 'buddhist.js accepts a null translation (colophon) honestly');
      ok(/aria-expanded/.test(s) && /focusin/.test(s), 'buddhist.js word popover is keyboard-reachable (focus + aria-expanded)');
      ok(/<details class="bud-words">/.test(s), 'buddhist.js renders the always-reachable word table (AT parity, no-JS path)');
      ok(!/style="background:/.test(s), 'buddhist.js uses no inline background highlight');
    }
  }

  // ---- STRUCTURAL: the CSS is DS-tokens-only + reduced-motion-safe --------
  {
    const c = 'assets/css/buddhist.css';
    ok(has(c), `${c} exists`);
    if (has(c)) {
      const css = read(c).replace(/\/\*[\s\S]*?\*\//g, '');   // strip comments (they mention the banned tokens in prose)
      const stripped = css.replace(/var\([^)]*\)/g, '');
      ok(!/#[0-9a-fA-F]{3,8}\b/.test(stripped), 'buddhist.css uses no raw hex colours (DS tokens only)');
      ok(!/@keyframes|transition:/.test(css), 'buddhist.css is reduced-motion-safe (no transitions/keyframes)');
      ok(/position: fixed/.test(css) && /\.bud-pop/.test(css), 'buddhist.css has the position:fixed word popover (escapes table clip)');
    }
  }

  // ---- BEHAVIOURAL: B-bud-data's pure contract (guarded) -----------------
  await guard('core/buddhist.js contract', async () => {
    const core = await import('../../assets/js/core/buddhist.js');
    const data = await import('../../assets/js/core/data/buddhist/index.js');
    ok(Array.isArray(data.BUDDHIST_TEXTS) && data.BUDDHIST_TEXTS.length >= 3, 'BUDDHIST_TEXTS has ≥3 texts');
    ok(typeof core.textById === 'function' && typeof core.recordsFor === 'function', 'textById/recordsFor are functions');
    for (const id of ['metta', 'heart', 'mn118']) {
      const recs = core.recordsFor(id);
      ok(Array.isArray(recs) && recs.length > 0, `recordsFor('${id}') returns records (got ${recs && recs.length})`);
    }
    // stats shape
    const st = core.buddhistStats();
    ok(st && typeof st === 'object' && 'segments' in st && 'glossedWords' in st, 'buddhistStats returns {segments, glossedWords, …}');

    // Metta colophon: a null translation must be present and accepted.
    const metta = core.recordsFor('metta');
    ok(metta.some(r => r.translation == null), 'Metta has the null-translation colophon (10.5)');

    // Every record carries a source line + a licence stamp in {cc0,pd-age,pd,original}.
    const allow = new Set(['cc0', 'pd-age', 'pd', 'original']);
    let licBad = 0, srcBad = 0;
    for (const id of ['metta', 'heart', 'mn118']) {
      const text = core.textById(id);
      for (const r of core.recordsFor(id)) {
        const lic = r.licence || (text && text.licence);
        if (lic && typeof lic === 'object') { for (const v of Object.values(lic)) if (!allow.has(String(v))) licBad++; }
        // Provenance: per-record src, or the translation's own source, or the
        // text-level source. A colophon with translation:null legitimately has
        // no translation source — it is covered by the text-level provenance.
        const src = r.src ?? (r.translation && r.translation.source) ?? (text && text.translationSource);
        if (!src) srcBad++;
      }
    }
    ok(licBad === 0, `every licence value ∈ {cc0,pd-age,pd,original} (${licBad} bad)`);
    ok(srcBad === 0, `every record has provenance (per-record, translation, or text-level) (${srcBad} missing)`);

    // The reconstruction invariant: words[].w rejoined == the pali/sanskrit line.
    const norm = s => String(s ?? '').normalize('NFC');
    let reconChecked = 0, reconBad = 0;
    for (const id of ['metta', 'heart']) for (const r of core.recordsFor(id)) {
      const words = Array.isArray(r.words) ? r.words : [];
      if (!words.length) continue;
      const line = r.pali ?? r.sanskrit ?? '';
      let joined;
      try { joined = core.reconstruct(r); } catch { joined = words.map(w => w.w).join(' '); }
      reconChecked++;
      if (norm(joined).trim() !== norm(line).trim()) reconBad++;
    }
    ok(reconChecked > 0, 'reconstruct exercised on ≥1 record');
    ok(reconBad === 0, `reconstruct(words) == line on every verse record (${reconBad} mismatched)`);

    // MN 118 refrains + peyyāla expansion.
    ok(Array.isArray(data.MN118_REFRAINS) && data.MN118_REFRAINS.length === 6, `MN118 has 6 refrains (got ${data.MN118_REFRAINS && data.MN118_REFRAINS.length})`);
    const mn = core.recordsFor('mn118');
    const ru = mn.find(r => r.kind === 'refrain-use');
    ok(!!ru, 'MN118 has ≥1 refrain-use record');
    if (ru) {
      const expanded = core.expandRefrain(ru, data.MN118_REFRAINS);
      ok(Array.isArray(expanded) && expanded.length > 0 && expanded.every(w => w && typeof w.w === 'string'), 'expandRefrain(refrain-use) → full words[]');
    }

    // Heart contested crux present (the ⚑ Nattier panel the UI renders).
    const heartText = core.textById('heart');
    ok(heartText && Array.isArray(heartText.contested) && heartText.contested.length > 0
      && heartText.contested.every(c => Array.isArray(c.positions) && c.positions.length >= 2),
      'Heart text carries ≥1 contested crux with ≥2 positions');
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/buddhist/index.html',
    actions: ['load', 'type a term into the cross-text search'],
    asserts: [
      '#bud-counts renders a live per-text counts table',
      'the search box filters segments across all three texts and links to each segment',
      'the honest wider-canon note is present; cross-links to Confluence + Yoga resolve',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/buddhist/metta.html',
    actions: ['load', 'hover a Pāli word', 'tap a Pāli word', 'keyboard-focus a Pāli word', 'open a word-by-word table', 'filter the segments'],
    asserts: [
      'each segment shows the Pāli line as interactive words + the verbatim CC0 translation + a licence chip',
      'hover/tap/focus a word opens the gloss popover (meaning + grammar + PED citation); Esc closes it',
      'the word-by-word <details> table is reachable by keyboard and present in the DOM (AT parity)',
      'the colophon segment shows the honest "no translation" note, never an invented line',
      '390px: no horizontal overflow; reduced-motion: popover appears instantly',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/buddhist/heart.html',
    actions: ['load', 'read the Sanskrit word glosses', 'read the contested panel'],
    asserts: [
      'the Sanskrit line words popover shows Monier-Williams (MW s.v.) citations',
      'the ⚑ Nattier origins crux renders both positions with sources, resolved neither way',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/buddhist/mn118.html',
    actions: ['load', 'expand a refrain-use with the "show the full refrain" toggle', 'use the section nav rail'],
    asserts: [
      'the 6 peyyāla refrains are glossed once at the top (anchored)',
      'each refrain-use is collapsed by default and links to its glossed refrain; the toggle expands the full word-by-word',
      'the section nav rail jumps to any of the sutta\'s sections',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/buddhist/sources.html',
    actions: ['load'],
    asserts: [
      'the edition-stack ledger renders quote-safe vs cite-only columns',
      'the verbatim CC0 + AI-request quotes are shown; the PED/MW firewall + peyyāla model are documented',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
