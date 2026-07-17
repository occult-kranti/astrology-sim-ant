// ============================================================================
//  ui3-hosts-west.mjs — Builder 4 (Western casting hosts) test module.
//  Exports async run() -> { pass, failures[] } and a DRIVES array of
//  {page, actions[], asserts[]} descriptors the integrator translates into
//  browser-verify steps. run() is a static, deterministic audit of the host
//  edits (picker migration write-through structure, action-bar hosts, the
//  one-primary-per-form law, the C9 wireCitySelect retention, label grammar,
//  the autopilot honesty line) — no DOM, so it runs headless in engine-test.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = rel => { const p = join(ROOT, rel); return existsSync(p) ? readFileSync(p, 'utf8') : null; };

// Pages whose moment-picker was migrated this round (D12 subset owned by B4).
const MIGRATED = [
  { html: 'pages/workbench.html', js: 'assets/js/app/workbench.js', pre: 'wb', mode: 'question' },
  { html: 'pages/book2/horary.html', js: 'assets/js/app/horary.js', pre: 'h', mode: 'question' },
  { html: 'pages/book3/nativity.html', js: 'assets/js/app/book3.js', pre: 'n', mode: 'birth' },
  { html: 'pages/book3/master.html', js: 'assets/js/app/book3-master.js', pre: 'bm', mode: 'birth' },
  { html: 'pages/book1/master.html', js: 'assets/js/app/book1-master.js', pre: 'm', mode: 'question' },
  { html: 'pages/trajectory.html', js: 'assets/js/app/trajectory.js', pre: 'tj', mode: 'birth' },
  { html: 'pages/picatrix/election.html', js: 'assets/js/app/election-tool.js', pre: 'e', mode: 'now' },
  { html: 'pages/picatrix/talisman.html', js: 'assets/js/app/talisman.js', pre: 't', mode: 'now' },
];

// C9: these keep wireCitySelect this round — assert it is still present.
// (cycles.js has no place input — it scans conjunctions/eclipses — so it is not listed.)
const C9_KEEP = [
  'assets/js/app/transits.js', 'assets/js/app/synastry.js', 'assets/js/app/timelords.js',
  'assets/js/app/moments.js', 'assets/js/app/experiment.js',
  'assets/js/app/handcalc.js', 'assets/js/app/jung-tool.js',
];

const VERBS = /(Cast|Compute|Judge|Scan|Run|Read|Build)\b/; // 5-verb grammar (+ legacy Read/Build tolerated)

export async function run() {
  const failures = [];
  const fail = m => failures.push(m);

  for (const P of MIGRATED) {
    const html = read(P.html), js = read(P.js);
    if (html == null) { fail(`${P.html}: missing`); continue; }
    if (js == null) { fail(`${P.js}: missing`); continue; }

    // 1. picker container present
    if (!new RegExp(`id="${P.pre}-picker"`).test(html)) fail(`${P.html}: no #${P.pre}-picker container`);
    // 2. all five legacy hidden inputs present with the historic ids (write-through targets)
    for (const f of ['lat', 'lon', 'date', 'time', 'offset']) {
      if (!new RegExp(`id="${P.pre}-${f}"`).test(html)) fail(`${P.html}: legacy id #${P.pre}-${f} missing`);
    }
    // 3. the raw city <select> is gone (replaced by the picker combobox)
    if (new RegExp(`id="${P.pre}-city"`).test(html)) fail(`${P.html}: stale #${P.pre}-city select still present`);
    // 4. the page's own wireCitySelect call and import are removed
    if (/wireCitySelect\s*\(/.test(js)) fail(`${P.js}: wireCitySelect() call not removed`);
    if (/import\s*\{[^}]*\bwireCitySelect\b[^}]*\}/.test(js)) fail(`${P.js}: wireCitySelect still imported`);
    // 5. mounts the shared picker with the frozen id map and correct mode
    if (!/mountMomentPicker\s*\(/.test(js)) fail(`${P.js}: does not call mountMomentPicker`);
    if (!new RegExp(`'${P.mode}'`).test(js)) fail(`${P.js}: expected picker mode '${P.mode}'`);
    // 6. commitRecent is called (write-on-compute contract)
    if (!/commitRecent\s*\(/.test(js)) fail(`${P.js}: picker.commitRecent() never called`);
    // 7. an action-bar host + a mountActionBar call
    if (!new RegExp(`id="${P.pre}-actionbar"`).test(html)) fail(`${P.html}: no #${P.pre}-actionbar host`);
    if (!/mountActionBar\s*\(/.test(js)) fail(`${P.js}: does not mount the action bar`);
    // 8. computeFlow choreography wired (consumed as ENH.ab.computeFlow)
    if (!/computeFlow/.test(js)) fail(`${P.js}: computeFlow not wired`);
    // 9. exactly one primary submit button in each <form>
    const forms = html.match(/<form[\s\S]*?<\/form>/g) || [];
    for (const frm of forms) {
      const submits = (frm.match(/type="submit"/g) || []).length;
      if (submits !== 1) fail(`${P.html}: a form has ${submits} submit buttons (want 1)`);
      const submitBtn = frm.match(/<button[^>]*type="submit"[^>]*>([^<]*)</);
      if (submitBtn && !VERBS.test(submitBtn[1])) fail(`${P.html}: submit label "${submitBtn[1].trim()}" breaks the verb grammar`);
    }
  }

  // C9: wireCitySelect retained
  for (const j of C9_KEEP) {
    const js = read(j);
    if (js == null) { fail(`${j}: missing`); continue; }
    if (!/wireCitySelect/.test(js)) fail(`${j}: wireCitySelect must be KEPT this round (C9)`);
  }

  // workbench export ids preserved on their handlers (buttons moved to the bar, ids kept)
  const wb = read('assets/js/app/workbench.js') || '';
  for (const id of ['wb-json', 'wb-md', 'wb-svg', 'wb-png', 'wb-print', 'wb-copy']) {
    if (!new RegExp(`'${id}'`).test(wb)) fail(`workbench.js: export handler id '${id}' lost`);
  }

  // autopilot keyless-honesty line (exact text, flow §5 row 22)
  const ap = read('assets/js/app/autopilot.js') || '';
  if (!/Needs your own Claude key — nothing works without one, and nothing is sent anywhere else\./.test(ap)) {
    fail('autopilot.js: keyless-honesty sentence missing or reworded');
  }

  return { pass: failures.length === 0, failures };
}

// ---------------------------------------------------------------------------
//  DRIVES — browser-verify descriptors (integrator translates to Puppeteer).
// ---------------------------------------------------------------------------
export const DRIVES = [
  { page: 'pages/workbench.html',
    actions: ['fill #wb-picker place+moment via the picker combobox', 'submit #wb-form'],
    asserts: ['#wb-lat hidden value written from picker', '#wb-verdict-banner not [hidden] and focused',
      'viewport scrolled to banner', '.action-bar visible', '#wb-wheel svg present',
      'click a planet <g> -> .viz-pin-card mentions "of Lilly’s −5…+5"', 'Esc returns focus',
      'one .btn (non-secondary/quiet) inside #wb-form', '.wb-dig-bars scoreBar svg rendered'] },
  { page: 'pages/book2/horary.html',
    actions: ['pick a place', 'submit #h-form'],
    asserts: ['#h-verdict-banner shown+focused', '.action-bar visible', '#h-wheel svg present'] },
  { page: 'pages/book3/nativity.html',
    actions: ['pick a birth moment', 'submit #n-form'],
    asserts: ['#n-lat written from picker', '#n-wheel svg present', '.action-bar visible'] },
  { page: 'pages/book3/master.html', actions: ['submit #bm-form'], asserts: ['#bm-wheel svg present', '.action-bar visible'] },
  { page: 'pages/book1/master.html', actions: ['submit #m-form'], asserts: ['#m-verdict-banner focused', '#m-wheel svg present'] },
  { page: 'pages/trajectory.html',
    actions: ['pick a birth moment', 'submit #tj-form'],
    asserts: ['#tj-lat written from picker', '#tj-timeline .period-strip present', '.action-bar visible'] },
  { page: 'pages/picatrix/election.html',
    actions: ['pick a moment', 'change #e-op (live re-judge, no submit)'],
    asserts: ['#e-summary verdict updates on onChange', '#e-summary .vb-bar scoreBar svg present', '.action-bar visible'] },
  { page: 'pages/picatrix/talisman.html', actions: ['pick a moment', 'submit #t-form'], asserts: ['#t-card recipe present', '.action-bar visible'] },
  { page: 'pages/transits.html', actions: ['submit #tx-form', 'pointermove over the hit strip'],
    asserts: ['crosshair chip appears then clears with no rAF pending', 'brushing hides ≥1 table row [hidden]'] },
  { page: 'pages/synastry.html', actions: ['submit #sy-form', 'hover a grid cell', 'click swap A↔B'],
    asserts: ['cell + its two headers get .is-hot', 'arrow-key roving moves cell focus', 'A/B fields swap values'] },
  { page: 'pages/timelords.html', actions: ['submit #tl-form', 'focus a strip, press +'],
    asserts: ['a .period-strip present', 'data-domain halves + aria-live readout', '.action-bar visible'] },
  { page: 'pages/handcalc.html', actions: ['focus a degree dial, arrow-key +1'], asserts: ['bound number input increments by step'] },
];

// Allow `node scripts/tests/ui3-hosts-west.mjs` to print a summary directly.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && process.argv[1].endsWith('ui3-hosts-west.mjs')) {
  run().then(r => { console.log(r.pass ? 'ui3-hosts-west: PASS' : 'ui3-hosts-west: FAIL'); r.failures.forEach(f => console.log('  - ' + f)); process.exit(r.pass ? 0 : 1); });
}
