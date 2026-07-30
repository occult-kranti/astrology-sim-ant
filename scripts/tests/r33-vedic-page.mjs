// ============================================================================
//  scripts/tests/r33-vedic-page.mjs — R33 (B2) "explain the sidereal reading":
//  the PAGE & APP WIRING half of the new divination-assistant kind 'vedic' on
//  pages/vedic/index.html. Exports `async run() -> {pass, failures[], notes[]}`
//  for engine-test.mjs and a `DRIVES` array for the Chromium sweep.
//
//  Two tiers (the parallel-builder pattern from r30-buddhist-ui):
//   • STRUCTURAL (always runnable): read pages/vedic/index.html, app/vedic.js and
//     app/vedic-panel.js as text and assert the invariants this round locks —
//     the #dv-assistant host mounted AFTER the computed reading (#v-out) so the
//     figure always leads; the canonical lastReport / reportSubs / notifyReport /
//     currentVedicReport() accessor; the guarded dynamic mount with kind 'vedic'
//     and its emptyText; the report shape the B1↔B2 contract froze (v, chart,
//     moment{dateISO,offset,lat,lon,place}, conclusions); the null-on-failure
//     paths (a failed or empty cast must clear the report, never leave a stale
//     reading for the assistant to narrate); the prefilled question chips that
//     FILL and never send; the standing About-this-diviner honest note with the
//     framing law (compare-never-merge, the ayanāṁśa is a choice, nothing is
//     advice, no demonstrated validity) and the keyless line; plus the site
//     invariants (no requestAnimationFrame here, style.css untouched).
//   • BEHAVIOURAL (guarded): cast a real chart on the pure core and assert the
//     report shape the page hands the assistant is genuinely available from one
//     cast (v.conclusions, v.shadbala, v.ashtakavarga, v.vimshottari), and — when
//     B1's parallel AI layer has landed — that kind 'vedic' is wired in
//     core/llm-context.js + app/divination-assistant.js. B1's files are NOT
//     edited by this builder, so their absence is NOTED and skipped, never failed.
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

const PAGE = 'pages/vedic/index.html';
const APP = 'assets/js/app/vedic.js';
const PANEL = 'assets/js/app/vedic-panel.js';

export async function run() {
  failures.length = 0; notes.length = 0;

  // =========================================================================
  //  STRUCTURAL — the page
  // =========================================================================
  ok(has(PAGE), `${PAGE} exists`);
  if (has(PAGE)) {
    const raw = read(PAGE);
    const h = raw.replace(/\s+/g, ' ');

    // -- the panel host, and its ORDER relative to the computed reading -----
    ok(/id="dv-assistant"/.test(raw), 'page: exposes the #dv-assistant panel host');
    ok(/id="dv-assistant-card"/.test(raw), 'page: wraps the panel in the site-standard #dv-assistant-card section');
    const iOut = raw.indexOf('id="v-out"');
    const iAsst = raw.indexOf('id="dv-assistant"');
    ok(iOut > -1 && iAsst > iOut, 'page: the assistant panel comes AFTER the computed reading (#v-out) — the figure leads, the AI follows');
    // the chips must be inside the assistant card, above the panel
    const iCard = raw.indexOf('id="dv-assistant-card"');
    const iChips = raw.indexOf('id="v-ai-chips"');
    ok(iChips > iCard && iChips < iAsst, 'page: the chip row sits inside the assistant card, before the panel host');

    // -- the prefilled explain chips ---------------------------------------
    const chipBlock = raw.slice(iChips > -1 ? iChips : 0, iAsst > -1 ? iAsst : raw.length);
    const chips = [...chipBlock.matchAll(/<button\b[^>]*\bdata-q="([^"]+)"[^>]*>([^<]*)<\/button>/g)];
    ok(chips.length >= 5, `page: at least 5 prefilled question chips (found ${chips.length})`);
    ok(chips.every(m => m[1].trim().length > 20), 'page: every chip carries a real, non-empty data-q question');
    ok(chips.every(m => m[2].trim().length > 0), 'page: every chip has a visible label');
    ok(chips.every(m => /type="button"/.test(m[0])), 'page: chips are type="button" — they can never submit the cast form');
    ok(!/data-q="[^"]*"[^>]*\bdata-(send|auto)/.test(chipBlock), 'page: no chip declares an auto-send attribute');
    // the five commissioned explain entry points are present in some form
    const qAll = chips.map(m => m[1]).join(' ');
    for (const [label, re] of [
      ['ṣaḍbala', /Ṣaḍbala|rūpa/i],
      ['daśā', /daśā|Vimśottarī/i],
      ['aṣṭakavarga bindus', /Aṣṭakavarga|bindu/i],
      ['sidereal vs tropical', /tropical/i],
      ['which rule produced each conclusion', /conclusion/i],
    ]) ok(re.test(qAll), `page: a chip covers "${label}"`);
    ok(/reading order|in what order|canonical sequence/i.test(qAll), 'page: a chip covers the canonical order a Jyotiṣī reads a chart');

    // -- the standing About-this-diviner honest note -----------------------
    ok(/About this diviner/i.test(h), 'page: the About-this-diviner note is present in the page\'s own voice');
    ok(/explains a computed reading/i.test(h) && /not a prediction service/i.test(h),
      'page: the note says it explains a computed reading and is not a prediction service');
    // framing law 1 — compared, never merged
    ok(/compared/i.test(h) && /never merged/i.test(h), 'page: framing law 1 — compared with the Western chart, never merged');
    // framing law 2 — the ayanāṁśa is a choice
    ok(/ayanāṁśa is a choice/i.test(h), 'page: framing law 2 — the ayanāṁśa is a choice');
    ok(/Lahiri/.test(h) && /Rāman/.test(h) && /KP/.test(h) && /Fagan/.test(h),
      'page: framing law 2 — names Lahiri as a default and Rāman / KP / Fagan–Bradley as differing alternatives');
    ok(/not the one true zodiac/i.test(h), 'page: framing law 2 — the sidereal frame is never presented as objectively correct');
    // framing law 3 — described, never prescribed
    ok(/Nothing here is advice/i.test(h), 'page: framing law 3 — nothing here is advice');
    ok(/gemstone/i.test(h) && /mantra/i.test(h) && /muhūrta/i.test(h), 'page: framing law 3 — names the refused remedy classes');
    ok(/medical/i.test(h) && /legal/i.test(h) && /financial/i.test(h) && /marital/i.test(h),
      'page: framing law 3 — names the refused advice domains');
    ok(/māraka/i.test(h) && /(lifespan|time a death)/i.test(h), 'page: framing law 3 — no lifespan / death timing; māraka is historical doctrine only');
    // framing law 4 — cite the rule
    ok(/BPHS/.test(h) && /Santhanam/.test(h) && /Phaladīpikā/.test(h) && /Sārāvalī/.test(h) && /Laghu Parāśarī/.test(h),
      'page: framing law 4 — names the citation contract editions');
    ok(/cannot be tied to a cited rule/i.test(h), 'page: framing law 4 — says so plainly when a claim has no cited rule');
    // framing law 5 — contested stays contested
    ok(/nīca-bhaṅga/i.test(h) && /kendrādhipati/i.test(h), 'page: framing law 5 — names the contested doctrines');
    ok(/every position and resolves none/i.test(h), 'page: framing law 5 — every position shown, none resolved');
    // framing law 6 — no demonstrated validity, said once
    ok(/no demonstrated predictive validity/i.test(h), 'page: framing law 6 — no demonstrated validity, stated plainly');

    // -- the keyless honesty line ------------------------------------------
    ok(/your own API key/i.test(h), 'page: keyless line — the model is called with your own API key');
    ok(/nothing is proxied/i.test(h) && /no key is bundled/i.test(h), 'page: keyless line — nothing proxied, no key bundled');
    ok(/No key, no calls/i.test(h), 'page: keyless line — no key, no calls');
    ok(/birth data is never sent anywhere by this site itself/i.test(h),
      'page: keyless line — your birth data is never sent anywhere by this site itself');

    // -- site invariants ----------------------------------------------------
    ok(!/requestAnimationFrame/.test(raw), 'page: no requestAnimationFrame in the page');
    ok(/initVedic\(\)/.test(raw) && /mountChrome\('vedic'\)/.test(raw), 'page: still mounts the chrome and boots initVedic()');
    ok(/style\.css/.test(raw), 'page: still links style.css');
  }

  // =========================================================================
  //  STRUCTURAL — the app module
  // =========================================================================
  ok(has(APP), `${APP} exists`);
  if (has(APP)) {
    const a = read(APP);
    const flat = a.replace(/\s+/g, ' ');

    // the canonical accessor pattern (muhurta.js)
    ok(/let lastReport = null;/.test(a), 'app: module-level lastReport initialised to null');
    ok(/const reportSubs = \[\]/.test(a), 'app: reportSubs subscriber array');
    ok(/notifyReport\s*=\s*\(\)\s*=>/.test(flat), 'app: notifyReport() fan-out');
    ok(/export function currentVedicReport\(\)\s*\{\s*return lastReport;\s*\}/.test(flat),
      'app: exports currentVedicReport() per the B1↔B2 contract');
    ok(/for \(const cb of reportSubs\)[\s\S]*try \{ cb\(lastReport\)/.test(a),
      'app: notifyReport guards every subscriber callback (one throwing sub cannot break the page)');

    // the frozen report shape
    ok(/lastReport = \{/.test(a), 'app: run() populates lastReport after a successful cast');
    for (const k of ['dateISO', 'offset', 'lat', 'lon', 'place'])
      ok(new RegExp(`\\b${k}\\b`).test(flat.slice(flat.indexOf('moment: {'))), `app: moment carries ${k}`);
    ok(/moment: \{/.test(flat) && /conclusions: v\.conclusions/.test(flat),
      'app: the report is { v, chart, moment, conclusions } per the contract');
    ok(/placeLabel/.test(a), 'app: the moment carries a human place label the assistant can name');

    // null-on-failure: an invalid or failed cast must clear the report
    ok(/function clearReport\(\)/.test(a), 'app: has a clearReport() that nulls + notifies');
    ok(/lastReport = null; notifyReport\(\)/.test(flat), 'app: clearReport sets null AND notifies');
    const runBody = a.slice(a.indexOf('function run()'));
    ok((runBody.match(/clearReport\(\)/g) || []).length >= 3,
      'app: every failure path in run() clears the report (bad coords, a failed panel cast, a thrown cast)');
    ok(/if \(!v\) \{ clearReport\(\); return; \}/.test(runBody),
      'app: a panel cast that returned no reading clears the report rather than leaving a stale one');

    // the guarded assistant mount
    ok(/import\('\.\/divination-assistant\.js'\)/.test(a), 'app: the assistant module is DYNAMICALLY imported');
    ok(/\.catch\(\(\) => null\)/.test(a), 'app: a missing assistant module resolves to null, never throws');
    ok(/if \(!\$\('dv-assistant'\)\)/.test(a), 'app: a missing panel host is a no-op');
    ok(/kind: 'vedic'/.test(a), "app: mounts the assistant with kind 'vedic'");
    ok(/getReading: currentVedicReport/.test(a), 'app: getReading is the exported accessor');
    ok(/subscribeReading: cb => reportSubs\.push\(cb\)/.test(a), 'app: subscribeReading pushes onto reportSubs');
    ok(/emptyText: 'Cast the sidereal chart above first\.'/.test(a), 'app: the contract emptyText');

    // the chips: prefill only, never send
    ok(/function wireChips/.test(a), 'app: wires the prefill chips');
    ok(/handle\.prefill/.test(a), "app: chips go through the assistant's public prefill(text) affordance");
    ok(/dv-asst-input/.test(a) && /new Event\('input'/.test(a),
      'app: chips fall back to setting the textarea value + dispatching an input event');
    ok(!/\bsend\(\)/.test(a) && !/dv-asst-send/.test(a), 'app: NOTHING in the chip path clicks send — a chip never fires a request');
    ok(/closest\('button\[data-q\]'\)/.test(a), 'app: chip clicks are delegated off data-q buttons');

    // site invariants
    ok(!/requestAnimationFrame/.test(a), 'app: no requestAnimationFrame outside app/motion.js');
    ok(/motionOK\(\)/.test(a) && /prefers-reduced-motion/.test(a), 'app: the chip scroll respects prefers-reduced-motion');
  }

  // =========================================================================
  //  STRUCTURAL — the shared panel returns its cast (one cast, one reading)
  // =========================================================================
  if (has(PANEL)) {
    const p = read(PANEL);
    const body = p.slice(p.indexOf('export function renderVedicPanel'));
    ok(/return null;/.test(body.slice(0, 1200)), 'panel: renderVedicPanel returns null when the cast fails');
    ok(/return v;\s*\}/.test(body), 'panel: renderVedicPanel returns the castVedic result so the page never casts twice');
  }

  ok(!/#v-ai-chips/.test(has('assets/css/style.css') ? read('assets/css/style.css') : ''),
    'style.css is untouched by this round (the chip rules are page-scoped)');

  // =========================================================================
  //  BEHAVIOURAL (guarded) — the reading the page hands over is real
  // =========================================================================
  await guard('core cast (astro.js + vedic.js)', async () => {
    const { castChart } = await import('../../assets/js/core/astro.js');
    const { castVedic } = await import('../../assets/js/core/vedic.js');
    const chart = castChart(new Date(Date.UTC(1990, 4, 15, 12, 0, 0)), 51.5074, -0.1278, 'whole');
    const v = castVedic(chart, { currentDate: new Date(Date.UTC(2026, 6, 30)) });
    ok(v && v.lagna && v.grahas, 'core: castVedic yields a lagna + grahas');
    ok(v.ayanamsa != null, 'core: the cast carries the ayanāṁśa VALUE the assistant must name');
    ok(v.panchanga && v.panchanga.tithi, 'core: the cast carries the pañcāṅga');
    ok(v.vimshottari && v.vimshottari.currentMaha && v.vimshottari.balanceYears != null,
      'core: the cast carries the running mahādaśā + the balance at birth');
    ok(v.shadbala && v.shadbala.perGraha && Object.keys(v.shadbala.perGraha).length >= 7,
      'core: the cast carries the six-fold ṣaḍbala rūpas');
    ok(v.ashtakavarga && v.ashtakavarga.sav && v.ashtakavarga.savTotal != null,
      'core: the cast carries the Sarvāṣṭakavarga bindus');
    ok(Array.isArray(v.yogas), 'core: the cast carries the yogas');
    ok('conclusions' in v, 'core: the cast carries the conclusions the report forwards');
  });

  // B1's half — noted, never failed (parallel builder, different files)
  await guard('B1 AI layer (core/llm-context.js)', async () => {
    const m = await import('../../assets/js/core/llm-context.js');
    const missing = ['buildVedicContext', 'buildVedicInterpretPrompt', 'vedicDataBlock'].filter(k => typeof m[k] !== 'function');
    if (missing.length) notes.push(`B1 not yet landed: llm-context.js is missing ${missing.join(', ')} (kind 'vedic' will fall back)`);
    else notes.push("B1 landed: llm-context.js exports the kind 'vedic' trio");
  });
  await guard("B1 AI layer (kind 'vedic' in divination-assistant.js)", async () => {
    const src = read('assets/js/app/divination-assistant.js');
    const wired = ['CTX', 'PROMPT', 'DATABLOCK', 'SUBJECT'].filter(map => {
      const i = src.indexOf(`const ${map} = {`);
      return i > -1 && /\bvedic:/.test(src.slice(i, src.indexOf('};', i) > -1 ? src.indexOf('};', i) : i + 900));
    });
    if (wired.length === 4) notes.push("B1 landed: kind 'vedic' is wired in all four assistant maps");
    else notes.push(`B1 not yet landed: kind 'vedic' wired in ${wired.length}/4 assistant maps (${wired.join(',') || 'none'})`);
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    label: 'vedic reading: assistant mounts after the cast; a chip prefills without sending',
    page: 'pages/vedic/index.html',
    actions: [
      // the page auto-casts on load → the report accessor is populated
      { type: 'assert', kind: 'jsTruthy', expr: 'window.__vedicReport && window.__vedicReport() !== null', afterIdleMs: 900 },
      { type: 'assert', kind: 'jsTruthy', expr: '!!window.__vedicReport().moment.place' },
      { type: 'assert', kind: 'jsTruthy', expr: '!!window.__vedicReport().v.shadbala && !!window.__vedicReport().v.ashtakavarga' },
      // the assistant panel has rendered its own controls inside the host
      { type: 'assert', kind: 'exists', selector: '#dv-assistant-card #v-ai-chips button[data-q]' },
      { type: 'assert', kind: 'exists', selector: '#dv-asst-input' },
      // a chip fills the box — and sends nothing (no key exists in the gate)
      { type: 'click', selector: '#v-ai-chips button[data-q]' },
      { type: 'assert', kind: 'jsTruthy', expr: 'document.getElementById("dv-asst-input").value.length > 20' },
      { type: 'assert', kind: 'jsEquals', expr: 'document.querySelectorAll("#dv-asst-log .chat-turn").length', value: 0 },
      // an invalid cast must NULL the report, never leave a stale reading
      { type: 'evalBeforeLoad', js: 'document.getElementById("v-lat").value = "";' },
      { type: 'click', selector: '#v-form button[type="submit"]' },
      { type: 'assert', kind: 'jsEquals', expr: 'window.__vedicReport()', value: null, afterIdleMs: 300 },
      { type: 'assert', kind: 'jsTruthy', expr: '/Cast the sidereal chart above first/.test(document.getElementById("dv-asst-preview").textContent)' },
    ],
    asserts: [],
  },
  {
    page: 'pages/vedic/index.html',
    actions: ['load', 'cast the default chart', 'click each explain chip', 'clear the latitude and re-submit'],
    asserts: [
      'the #dv-assistant panel mounts AFTER the computed reading (#v-out) — the figure is never delayed by the AI',
      'the About-this-diviner note states: explains a computed reading (not a prediction service); compared with the Western chart, never merged; the ayanāṁśa is a choice (Lahiri default, Rāman/KP/Fagan–Bradley differ); nothing here is advice; no demonstrated predictive validity',
      'the keyless line is present: your own API key, nothing proxied, no key no calls, your birth data is never sent anywhere by this site itself',
      'each of the 6 chips fills #dv-asst-input with its full question and sends nothing — with no API key in the gate the chat log stays empty and no network request fires',
      'currentVedicReport() is populated after a successful cast and null after an invalid one (the panel then shows "Cast the sidereal chart above first.")',
      '390px: no horizontal overflow (the chip row wraps, the chart tables scroll in their own boxes); reduced-motion: the chip scroll is instant, no animation',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
