// ============================================================================
//  scripts/tests/r31-dhammapada.mjs — R31 (B-BUDDHIST-DHP) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a
//  `DRIVES` array for the Chromium sweep. Deterministic; no DOM, no network.
//
//  Covers the Dhammapada reading room (vaggas 1–5, Dhp 1–75) added to the R30
//  Buddhist wing: the data module (core/data/buddhist/dhammapada.js via
//  core/buddhist.js), the barrel/reader registration, the new page, and the app
//  wiring. The spine is the RECONSTRUCTION INVARIANT over all 395 records:
//  words[].w rejoined with single spaces === record.pali.
//
//    • data: 395 records (228+167), 957 glossed words, reconstruction on all,
//      translation shapes (63 null / 332 stamped), the frozen CC0 translation
//      char total, NFC hygiene, a PED cite on every word, the derived vagga
//      `section` on every record (5 distinct), the famous dhp1:1 opening intact;
//    • reader: BUDDHIST_TEXTS now carries dhammapada (id/lang/segments/words),
//      textById/recordsFor/buddhistStats/searchBuddhist all resolve it;
//    • page + app: pages/buddhist/dhammapada.html mounts chrome + initBuddhist,
//      the app registers the page hook + enables the section rail for it.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  BUDDHIST_TEXTS, textById, recordsFor, reconstruct, buddhistStats, searchBuddhist,
  DHAMMAPADA_META, DHAMMAPADA_RECORDS,
} from '../../assets/js/core/buddhist.js';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => readFileSync(resolve(REPO, rel), 'utf8');
const has = rel => existsSync(resolve(REPO, rel));
const isNFC = s => typeof s !== 'string' || s === s.normalize('NFC');
const VEDIC = /[॒॑]/;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. data module present + basic counts -----------------------------
  ok(Array.isArray(DHAMMAPADA_RECORDS) && DHAMMAPADA_RECORDS.length === 395,
    `395 Dhammapada records (got ${DHAMMAPADA_RECORDS && DHAMMAPADA_RECORDS.length})`);
  let words = 0;
  for (const r of DHAMMAPADA_RECORDS) words += (r.words ? r.words.length : 0);
  ok(words === 957, `957 glossed word tokens (got ${words})`);

  // ---- 2. THE RECONSTRUCTION INVARIANT — all 395 records -----------------
  let reFail = 0, reFirst = '';
  for (const r of DHAMMAPADA_RECORDS) {
    if (reconstruct(r) !== r.pali) { reFail++; if (!reFirst) reFirst = r.ref; }
    // second, direct proof independent of reconstruct()
    if ((r.words || []).map(w => w.w).join(' ') !== r.pali) { reFail++; if (!reFirst) reFirst = r.ref + ' (join)'; }
  }
  ok(reFail === 0, `reconstruction words[].w.join(' ') === pali on all 395 (${reFail} fail; first ${reFirst})`);

  // ---- 3. translation shapes + the CC0 length check ----------------------
  let nullT = 0, objT = 0, srcBad = 0, transChars = 0, pedNull = 0;
  for (const r of DHAMMAPADA_RECORDS) {
    if (r.translation === null) nullT++;
    else {
      objT++;
      if (typeof r.translation.text !== 'string' || !r.translation.source) srcBad++;
      transChars += r.translation.text.length;
    }
    for (const w of (r.words || [])) if (w.ped == null) pedNull++;
  }
  ok(nullT === 63 && objT === 332, `63 null / 332 stamped translations (got ${nullT}/${objT})`);
  ok(srcBad === 0, `every non-null translation carries a source stamp (${srcBad} bad)`);
  ok(pedNull === 0, `every word carries a PED cite (${pedNull} missing)`);
  // The verbatim CC0 (Sujato) translation total — a byte-level tripwire against
  // any silent edit to the reproduced translation strings.
  ok(transChars === 10562, `CC0 translation char total 10562 (got ${transChars})`);

  // ---- 4. NFC hygiene / no Vedic accents ---------------------------------
  let nfcBad = 0, vedicBad = 0;
  for (const r of DHAMMAPADA_RECORDS) {
    if (!isNFC(r.pali)) nfcBad++;
    if (VEDIC.test(r.pali)) vedicBad++;
    if (r.translation && !isNFC(r.translation.text)) nfcBad++;
    for (const w of (r.words || [])) if (!isNFC(w.w) || !isNFC(w.gloss)) nfcBad++;
  }
  ok(nfcBad === 0, `all Dhammapada strings NFC (${nfcBad} bad)`);
  ok(vedicBad === 0, `no Vedic-accent codepoints (${vedicBad} bad)`);

  // ---- 5. the derived vagga `section` (5 distinct, every record) ---------
  const sections = [...new Set(DHAMMAPADA_RECORDS.map(r => r.section))];
  ok(sections.length === 5, `5 distinct vagga sections (got ${sections.length})`);
  ok(DHAMMAPADA_RECORDS.every(r => typeof r.section === 'string' && r.section.length), 'every record carries a section');
  ok(sections[0].includes('Yamakavagga') && sections[4].includes('Bālavagga'), 'sections run Yamakavagga … Bālavagga in order');

  // ---- 6. the famous opening intact --------------------------------------
  const d1 = DHAMMAPADA_RECORDS.find(r => r.ref === 'dhp1:1');
  ok(d1 && d1.pali === 'Manopubbaṅgamā dhammā,'.normalize('NFC'), 'dhp1:1 opening present verbatim');
  ok(d1 && d1.words[0].w === 'Manopubbaṅgamā' && /CONTESTED/.test(d1.words[0].gloss || ''), 'dhp1:1 first word glossed + flags the contested crux');
  ok(d1 && d1.translation && d1.translation.text === 'Intention shapes experiences; ', 'dhp1:1 Sujato translation verbatim (trailing space)');

  // ---- 7. reader registration (BUDDHIST_TEXTS + the helpers) -------------
  const dhp = textById('dhammapada');
  ok(!!dhp && dhp.id === 'dhammapada' && dhp.lang === 'pi', 'textById(dhammapada) resolves, lang pi');
  ok(dhp && dhp.segments === 395 && dhp.words === 957, `BUDDHIST_TEXTS dhammapada 395/957 (got ${dhp && dhp.segments}/${dhp && dhp.words})`);
  ok(dhp && dhp.licence && dhp.licence.translation === 'cc0', 'dhammapada translation licence cc0');
  ok(BUDDHIST_TEXTS.length === 4 && BUDDHIST_TEXTS[3].id === 'dhammapada', 'dhammapada is the 4th BUDDHIST_TEXTS entry');
  ok(recordsFor('dhammapada').length === 395, 'recordsFor(dhammapada) → 395');

  const st = buddhistStats();
  ok(st.texts === 4 && st.segments === 43 + 16 + 154 + 395, `stats: 4 texts / ${43 + 16 + 154 + 395} segments (got ${st.segments})`);
  ok(st.glossedWords === 138 + 132 + 1184 + 957, `stats glossedWords includes dhammapada (got ${st.glossedWords})`);
  ok(st.byLicence.cc0 === 43 + 154 + 395, `stats byLicence.cc0 includes dhammapada (got ${st.byLicence.cc0})`);

  // ---- 8. search resolves Dhammapada segments ----------------------------
  ok(searchBuddhist('hatred').some(h => h.id === 'dhammapada'), "searchBuddhist('hatred') hits dhammapada (Dhp 3–5)");
  ok(searchBuddhist('manopubbangama').some(h => h.id === 'dhammapada'), "folded 'manopubbangama' matches manopubbaṅgamā");

  // ---- 9. META: merged view + per-file provenance preserved --------------
  ok(DHAMMAPADA_META && DHAMMAPADA_META.counts && DHAMMAPADA_META.counts.records === 395, 'META.counts.records === 395');
  ok(Array.isArray(DHAMMAPADA_META.vaggas) && DHAMMAPADA_META.vaggas.length === 5, 'META.vaggas has 5 vaggas');
  ok(Array.isArray(DHAMMAPADA_META.parts) && DHAMMAPADA_META.parts.length === 2
    && DHAMMAPADA_META.parts[0].counts.records === 228 && DHAMMAPADA_META.parts[1].counts.records === 167,
    'META.parts preserves per-file provenance (228 + 167)');
  ok(/CC0/.test(DHAMMAPADA_META.licenses.translation) || /Creative Commons Zero/.test(DHAMMAPADA_META.licenses.translation),
    'META.licenses.translation states the CC0 dedication');

  // ---- 10. STRUCTURAL: the page + the app wiring -------------------------
  const P = 'pages/buddhist/dhammapada.html';
  ok(has(P), `${P} exists`);
  if (has(P)) {
    const h = read(P);
    ok(/mountChrome\(['"]buddhist['"]\)/.test(h), 'page mounts chrome key buddhist');
    ok(/initBuddhist\(['"]dhammapada['"]\)/.test(h), "page calls initBuddhist('dhammapada')");
    ok(/buddhist\.css/.test(h), 'page links buddhist.css');
    ok(/id="bud-room"/.test(h), 'page has the #bud-room host');
    ok(/id="bud-filter"/.test(h) && /id="bud-filter-count"/.test(h), 'page has the client-side filter');
    ok(/class="pager"/.test(h), 'page has the book pager');
    ok(/no demonstrated validity/i.test(h.replace(/\s+/g, ' ')), 'page carries the no-validity note');
    ok(/vaggas 1.5 of 26|1.5 of the traditional 26|vaggas <b>1.5 of 26/i.test(h.replace(/\s+/g, ' ')), 'page honestly states vaggas 1–5 of 26');
  }
  {
    const a = read('assets/js/app/buddhist.js');
    ok(/dhammapada:\s*'dhammapada\.html'/.test(a), 'app PAGE_OF maps dhammapada');
    ok(/case 'dhammapada':\s*return initRoom\('dhammapada'\)/.test(a), 'app dispatches dhammapada to initRoom');
    ok(/id === 'mn118' \|\| id === 'dhammapada'/.test(a), 'app enables the section rail for dhammapada');
    ok(!/requestAnimationFrame/.test(a), 'app has no requestAnimationFrame (site invariant)');
  }
  // the hub links the new reading room + keeps the honest note
  if (has('pages/buddhist/index.html')) {
    const hub = read('pages/buddhist/index.html').replace(/\s+/g, ' ');
    ok(/href="dhammapada\.html"/.test(hub), 'hub links the Dhammapada reading room');
    ok(/vaggas 1.5 of 26|1.5 of 26|first five chapters/i.test(hub), 'hub notes the 5-of-26 curation honestly');
  }

  return { pass: failures.length === 0, failures };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/buddhist/dhammapada.html',
    actions: ['load', 'hover a Pāli word', 'tap a Pāli word', 'keyboard-focus a Pāli word', 'open a word-by-word table', 'use the vagga section rail', 'filter the segments'],
    asserts: [
      'the famous dhp 1 opening (manopubbaṅgamā dhammā) renders word-by-word with the verbatim CC0 translation',
      'hover/tap/keyboard-focus a word opens the gloss popover (meaning + grammar + PED citation); Esc closes it',
      'the word-by-word <details> table is reachable by keyboard and present in the DOM (AT parity)',
      'the vagga section rail jumps to any of the five chapters (Pairs … the Fool)',
      'a vatthu story-title / colophon shows the honest "no translation" note, never an invented line',
      '390px: no horizontal overflow; reduced-motion: popover appears instantly',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/buddhist/index.html',
    actions: ['load'],
    asserts: [
      'the live counts table now lists the Dhammapada (395 segments) as a fourth reading room',
      'the Dhammapada card + the honest "vaggas 1–5 of 26" note render; the card links resolve',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
