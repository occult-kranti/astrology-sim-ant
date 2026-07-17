// ============================================================================
//  ui3-hosts-east.mjs — Builder 5's headless test module (UI3 revamp).
//
//  Exports `run() -> {pass, failures[]}` (wired into engine-test.mjs by the
//  integrator) and a `DRIVES` array of {page, actions, asserts} descriptors the
//  integrator translates into browser-verify.mjs steps.
//
//  Coverage:
//   • the PURE vedic model-builders (vedic-panel.js) — determinism + invariants;
//   • the wing-hub data-fp frontispiece hooks (art §4.3);
//   • the oracle page-order standardization (cast-hour below the diviner, the
//     keyless-honesty line, reference tables collapsed into <details>);
//   • the now.html hour-dial panel hook.
//  All file reads resolve relative to THIS module (cwd-independent).
// ============================================================================
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import {
  vedicChartModel, savHeatModel, shadbalaBarSpecs, vimshottariStripModel,
} from '../../assets/js/app/vedic-panel.js';
import { kutaHeatModel } from '../../assets/js/app/kuta.js';

const root = new URL('../../', import.meta.url);
const read = rel => readFileSync(fileURLToPath(new URL(rel, root)), 'utf8');

// A fixed reference chart (15 May 1990, 12:00 UT, London) + a fixed "now".
const REF_NOW = new Date(Date.UTC(2026, 6, 16));
function refVedic() {
  const chart = castChart(new Date(Date.UTC(1990, 4, 15, 12, 0, 0)), 51.5074, -0.1278, 'whole');
  return castVedic(chart, { currentDate: REF_NOW });
}

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. vedic model-builders: invariants -------------------------------
  const v = refVedic();

  const cm = vedicChartModel(v);
  ok(cm.houses.length === 12, `vedicChartModel: expected 12 houses, got ${cm.houses.length}`);
  ok(cm.lagnaSign >= 1 && cm.lagnaSign <= 12, `vedicChartModel: lagnaSign out of range (${cm.lagnaSign})`);
  ok(cm.lagnaSign === (v.lagna.rashiIndex % 12) + 1, 'vedicChartModel: lagnaSign != lagna rashiIndex+1');
  for (const h of cm.houses) {
    const expSign = ((cm.lagnaSign - 1) + (h.house - 1)) % 12 + 1;
    ok(h.sign === expSign, `vedicChartModel: house ${h.house} sign ${h.sign} != whole-sign ${expSign}`);
  }
  const grahaCount = cm.houses.reduce((a, h) => a + h.grahas.length, 0);
  ok(grahaCount === Object.keys(v.grahas).length, `vedicChartModel: ${grahaCount} placed grahas != ${Object.keys(v.grahas).length}`);
  const ids = cm.houses.flatMap(h => h.grahas.map(g => g.id));
  ok(new Set(ids).size === ids.length, 'vedicChartModel: a graha was placed in more than one house');
  ok(cm.houses.every(h => h.grahas.every(g => g.glyph && Number.isFinite(g.deg))), 'vedicChartModel: a graha lacks glyph/deg');

  const sh = savHeatModel(v);
  ok(sh.cols.length === 12, `savHeatModel: expected 12 cols, got ${sh.cols.length}`);
  ok(sh.rows.every(r => r.cells.length === 12), 'savHeatModel: a row does not have 12 cells');
  ok(sh.rows[sh.rows.length - 1].id === 'sav', 'savHeatModel: last row is not the SAV row');
  ok(sh.emphasis && sh.emphasis.rowId === 'sav' && sh.emphasis.threshold === 28, 'savHeatModel: emphasis not {sav,28}');
  ok(sh.scale && sh.scale.steps === 4, 'savHeatModel: scale steps != 4');
  const savCells = sh.rows[sh.rows.length - 1].cells.map(c => c.v);
  ok(savCells.reduce((a, b) => a + b, 0) === v.ashtakavarga.savTotal, 'savHeatModel: SAV cells do not sum to savTotal');

  const bars = shadbalaBarSpecs(v);
  ok(bars.length === (v.shadbala.order || []).length, 'shadbalaBarSpecs: wrong bar count');
  for (const b of bars) {
    ok(b.domain[0] === 0, `shadbalaBarSpecs: ${b.label} domain does not start at 0`);
    ok(b.value <= b.domain[1] + 1e-9, `shadbalaBarSpecs: ${b.label} value ${b.value} exceeds domain top ${b.domain[1]} (would clip)`);
    ok(b.anchors.length === 1 && b.anchors[0].label === 'required', `shadbalaBarSpecs: ${b.label} missing 'required' anchor`);
    ok(b.tone === 'ok' || b.tone === 'bad', `shadbalaBarSpecs: ${b.label} tone invalid`);
  }

  const strip = vimshottariStripModel(v, REF_NOW);
  ok(strip.lanes.length === 2, `vimshottariStripModel: expected 2 lanes, got ${strip.lanes.length}`);
  ok(strip.now === REF_NOW.getTime(), 'vimshottariStripModel: now not passed through');
  ok(strip.domain[0] < strip.domain[1], 'vimshottariStripModel: domain not ascending');
  const maha = strip.lanes[0].segments;
  ok(maha.filter(s => s.current).length === 1, 'vimshottariStripModel: not exactly one current mahā');
  for (let i = 1; i < maha.length; i++) {
    ok(maha[i].start >= maha[i - 1].end - 1, `vimshottariStripModel: mahā segments overlap at ${i}`);
  }
  ok(maha.every(s => s.label && s.short && s.id), 'vimshottariStripModel: a segment lacks label/short/id');

  // ---- 2. determinism (two calls byte-equal) -----------------------------
  const v2 = refVedic();
  ok(JSON.stringify(vedicChartModel(v2)) === JSON.stringify(cm), 'vedicChartModel: non-deterministic');
  ok(JSON.stringify(savHeatModel(v2)) === JSON.stringify(sh), 'savHeatModel: non-deterministic');
  ok(JSON.stringify(vimshottariStripModel(v2, REF_NOW)) === JSON.stringify(strip), 'vimshottariStripModel: non-deterministic');

  // ---- 3. wing-hub data-fp frontispiece hooks (art §4.3) -----------------
  const FP = {
    'pages/book1/index.html': 'quill-square',
    'pages/book2/index.html': 'quill-square',
    'pages/book3/index.html': 'quill-square',
    'pages/picatrix/index.html': 'heptagram',
    'pages/jung/index.html': 'mandala',
    'pages/chronology/index.html': 'hourglass',
    'pages/yoga/index.html': 'lotus',
    'pages/greatworks/index.html': 'codex',
    'pages/library/index.html': 'codex',
  };
  for (const [file, name] of Object.entries(FP)) {
    let html = '';
    try { html = read(file); } catch { failures.push(`data-fp: cannot read ${file}`); continue; }
    ok(html.includes(`data-fp="${name}"`), `data-fp: ${file} missing data-fp="${name}"`);
    // emoji/glyph fallback must be KEPT (the wh-glyph span still carries its text)
    ok(/<span class="wh-glyph"[^>]*data-fp=/.test(html), `data-fp: ${file} data-fp not on the wh-glyph span`);
  }

  // ---- 4. oracle page-order standardization ------------------------------
  const ORACLES = ['pages/geomancy.html', 'pages/tarot.html', 'pages/iching.html', 'pages/runes.html'];
  const KEYLESS = 'The computed reading above is complete without a key — the assistant only narrates it.';
  for (const file of ORACLES) {
    let html = '';
    try { html = read(file); } catch { failures.push(`oracle: cannot read ${file}`); continue; }
    ok(html.includes(KEYLESS), `oracle: ${file} missing the keyless-honesty line`);
    const iDiv = html.indexOf('id="dv-assistant-card"');
    const iHour = html.indexOf('id="cast-hour"');
    ok(iDiv > 0 && iHour > iDiv, `oracle: ${file} cast-hour strip is not below the diviner`);
    ok(/<details class="acc card"/.test(html), `oracle: ${file} reference not collapsed into <details class="acc card">`);
    // exactly one cast-hour mount (the strip moved, not duplicated)
    ok((html.match(/id="cast-hour"/g) || []).length === 1, `oracle: ${file} has ${(html.match(/id="cast-hour"/g) || []).length} cast-hour mounts`);
  }

  // ---- 4b. kūṭa 36-guṇa heat strip (neutral, no traffic light) -----------
  const ak = { total: 24, max: 36, kutas: [
    { key: 'varna', name: 'Varṇa', points: 1, max: 1 },
    { key: 'nadi', name: 'Nāḍī', points: 0, max: 8 },
    { key: 'bhakoot', name: 'Bhakūṭa', points: 7, max: 7 },
  ] };
  const kh = kutaHeatModel(ak);
  ok(kh.cols.length === ak.kutas.length, 'kutaHeatModel: col count != kūṭa count');
  ok(kh.rows.length === 1 && kh.rows[0].cells.length === ak.kutas.length, 'kutaHeatModel: single guṇa row with one cell per kūṭa');
  ok(kh.scale.min === 0 && kh.scale.max === 8 && kh.scale.steps === 4, 'kutaHeatModel: scale not gold-ramp 0..8/4');
  ok(!kh.emphasis, 'kutaHeatModel: must carry no verdict emphasis (neutral counting convention)');
  ok(/counting convention/.test(kh.caption), 'kutaHeatModel: caption missing the honesty framing');

  // ---- 5. now.html hour-dial panel hook ----------------------------------
  const nowHtml = read('pages/now.html');
  ok(nowHtml.includes('id="n-dial"'), 'now.html: missing the #n-dial hour-dial panel');

  return { pass: failures.length === 0, failures };
}

// Browser-sweep descriptors (integrator translates into browser-verify.mjs).
export const DRIVES = [
  {
    page: 'pages/vedic/index.html',
    actions: ['waitForSelector .v-fig-chart .seg', 'click .seg-btn[data-style="south"]', 'reload', 'waitForSelector .v-fig-chart .seg'],
    asserts: [
      "localStorage['vedicChartStyle'] === 'south'",
      '.seg-btn[data-style="south"][aria-pressed="true"] exists after reload',
      'no console errors; __motionStats().running === false after 1.2s idle',
    ],
  },
  {
    page: 'pages/now.html',
    actions: ['waitForSelector #n-dial', 'waitForSelector #n-moon'],
    asserts: [
      '#n-moon .moon-inset svg exists (engraved moon)',
      '#n-dial .n-dial-fig svg exists (planetary-hours dial)',
      "#n-dial details summary contains 'The 24 hours as a table'",
      'no console errors',
    ],
  },
  {
    page: 'pages/geomancy.html',
    actions: ['click #geo-cast', 'waitForSelector #geo-out'],
    asserts: [
      '#dv-assistant-card precedes #cast-hour in DOM order (standardized order)',
      'details.acc#geo-reference-acc is present and collapsed by default',
      'the keyless-honesty line is present in #dv-assistant-card',
      'no console errors',
    ],
  },
  {
    page: 'pages/prasna.html',
    actions: ['fill the moment-picker via #pr-picker (or defaults)', 'submit #pr-form', 'waitForSelector #pr-judgement table'],
    asserts: [
      'the praśna chart + testimonies render (compute via the picker legacy-id write-through)',
      'no console errors',
    ],
  },
  {
    page: 'pages/book1/index.html',
    actions: ['waitForSelector .wing-hero'],
    asserts: ['.wing-hero .fp replaced the emoji watermark (B3 adopt.js consumes data-fp="quill-square")'],
  },
];

// Allow `node scripts/tests/ui3-hosts-east.mjs` to run the suite directly.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  run().then(r => {
    if (r.pass) { console.log('ui3-hosts-east: PASS'); }
    else { console.error('ui3-hosts-east: FAIL\n - ' + r.failures.join('\n - ')); process.exitCode = 1; }
  });
}
