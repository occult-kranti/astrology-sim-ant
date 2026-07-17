// ============================================================================
//  scripts/tests/r31-practices-ui.mjs — R31 Practices wing (the mudrā catalog
//  UI) headless tests. Exports `async run() -> {pass, failures[]}` for
//  engine-test.mjs and a `DRIVES` array for the Chromium sweep.
//
//  Two tiers (the parallel-builder pattern from r30-buddhist-ui):
//   • STRUCTURAL (always runnable): read the two page HTMLs, the two app
//     modules and the CSS as text and assert the load-bearing invariants —
//     mountChrome('practices'), initPractices wiring, the hub/catalog hosts,
//     the standing no-validity caveat, the harm-flag-before-description order,
//     the art builder's role=img contract, no stray requestAnimationFrame, and
//     DS-tokens-only + reduced-motion-safe CSS.
//   • BEHAVIOURAL (guarded): dynamically import B-practices-data's pure contract
//     (core/practices.js + core/data/practices/mudras.js) and this wing's art
//     builder, and assert the data↔wing contract this UI codes against — the
//     35-record census (25 GS + 10 HYP), the crosswalk integrity, the harm
//     flags on the known-dangerous seals, the descriptive-voice lint, and that
//     every record resolves to a role=img figure whose label never depicts the
//     dangerous specifics (e.g. khecarī's cutting). When the data modules are
//     absent (integrated in parallel) the block is SKIPPED and noted, never
//     failed.
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

  // ---- STRUCTURAL: the two pages -----------------------------------------
  const pages = { 'pages/practices/index.html': 'index', 'pages/practices/mudras.html': 'mudras' };
  for (const [p, page] of Object.entries(pages)) {
    ok(has(p), `${p} exists`);
    if (!has(p)) continue;
    const h = read(p);
    ok(/mountChrome\(['"]practices['"]\)/.test(h), `${page}: mounts chrome key practices`);
    ok(new RegExp(`initPractices\\(['"]${page}['"]\\)`).test(h), `${page}: calls initPractices('${page}')`);
    ok(/practices\.css/.test(h), `${page}: links practices.css`);
    ok(/no demonstrated (supernatural )?validity/i.test(h.replace(/\s+/g, ' ')), `${page}: carries the no-validity note`);
    ok(/describes,?\s+(it )?never prescribes|described never prescribed|never (an instruction|prescribed)/i.test(h.replace(/\s+/g, ' ')), `${page}: carries the described-never-prescribed framing`);
  }

  // index hub hosts + honest taxonomy + cross-links
  if (has('pages/practices/index.html')) {
    const h = read('pages/practices/index.html');
    ok(/class="wing-hero"/.test(h), 'index: has the wing-hero');
    ok(/class="ep-strip"/.test(h), 'index: has the epistemic strip');
    ok(/id="pr-stats"/.test(h), 'index: has the #pr-stats live-counts host');
    ok(/id="pr-groups"/.test(h), 'index: has the #pr-groups taxonomy host');
    ok(/id="hiw-practices"/.test(h), 'index: has the #hiw-practices how-it-works anchor');
    ok(/catalogued/i.test(h) && /planned/i.test(h), 'index: shows the un-built groups honestly (catalogued/planned)');
    ok(/greatworks\//.test(h), 'index: cross-links Great Works (the transpose)');
    ok(/confluence\.html/.test(h), 'index: cross-links the Confluence');
    ok(/yoga\/index\.html/.test(h), 'index: cross-links the Yoga wing');
    // caveat must precede the group taxonomy (standing note FIRST)
    ok(h.indexOf('standing note') >= 0 && h.indexOf('standing note') < h.indexOf('id="pr-groups"'),
      'index: the standing caveat renders before the group cards');
  }

  // catalog hosts + filters + crosswalk + the sensitive records named
  if (has('pages/practices/mudras.html')) {
    const h = read('pages/practices/mudras.html');
    ok(/id="pr-filter"/.test(h) && /id="pr-filter-count"/.test(h), 'mudras: has the text filter + count');
    ok(/id="pr-source"/.test(h) && /data-source="gheranda"/.test(h) && /data-source="hyp"/.test(h), 'mudras: has the source segmented control');
    ok(/id="pr-harm"/.test(h), 'mudras: has the harm-flag toggle');
    ok(/id="pr-catalog"/.test(h), 'mudras: has the #pr-catalog host');
    ok(/id="pr-crosswalk"/.test(h) && /id="crosswalk"/.test(h), 'mudras: has the crosswalk host + anchor');
    ok(/class="pager"/.test(h), 'mudras: has the wing pager');
    ok(/khecar/i.test(h) && /vajrol/i.test(h), 'mudras: names the sensitive khecarī + vajrolī records in the prose');
    ok(/harm flag/i.test(h), 'mudras: the standing note announces the harm flag');
  }

  // ---- STRUCTURAL: the app renderer --------------------------------------
  {
    const a = 'assets/js/app/practices.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'practices.js has no requestAnimationFrame (site invariant)');
      ok(/from '\.\.\/core\/practices\.js'/.test(s), 'practices.js imports the core/practices.js contract');
      ok(/mudrasBySource/.test(s) && /mudraById/.test(s) && /crosswalkOf/.test(s) && /practicesStats/.test(s),
        'practices.js consumes the frozen core lookups');
      ok(/HATHA_MUDRAS/.test(s) && /MUDRA_GROUPS/.test(s), 'practices.js consumes HATHA_MUDRAS + MUDRA_GROUPS');
      ok(/from '\.\/practices-art\.js'/.test(s) && /mudraFigure/.test(s), 'practices.js uses the art builder (mudraFigure)');
      ok(/export function initPractices/.test(s), 'practices.js exports initPractices');
      // harm block must be built BEFORE the figure in the card template
      const harmIdx = s.indexOf('harmBlock(r)');
      const figIdx = s.indexOf('mudraFigure(r)');
      ok(harmIdx >= 0 && figIdx >= 0 && harmIdx < figIdx, 'practices.js renders the harm flag BEFORE the figure/description');
      ok(/pr-crux/.test(s), 'practices.js renders the ⚑ contested panel');
      ok(!/style="background:/.test(s), 'practices.js uses no inline background highlight');
    }
  }

  // ---- STRUCTURAL: the art builder ---------------------------------------
  {
    const a = 'assets/js/app/practices-art.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'practices-art.js has no requestAnimationFrame');
      ok(/export function mudraFigure/.test(s), 'practices-art.js exports mudraFigure');
      ok(/role="img"/.test(s) && /aria-label/.test(s), 'practices-art.js emits role=img + aria-label figures');
      ok(/not-diagrammed/.test(s), 'practices-art.js has the honest not-diagrammed archetype (vajrolī)');
      ok(/viewBox="0 0 120 140"/.test(s), 'practices-art.js uses the yoga-wing viewBox');
      ok(!/<img\b/.test(s) && !/\.png|\.jpg|\.jpeg|data:image\/(png|jpe?g)/.test(s), 'practices-art.js ships no binary/raster assets (inline SVG only)');
    }
  }

  // ---- STRUCTURAL: the CSS is DS-tokens-only + reduced-motion-safe --------
  {
    const c = 'assets/css/practices.css';
    ok(has(c), `${c} exists`);
    if (has(c)) {
      const css = read(c).replace(/\/\*[\s\S]*?\*\//g, '');   // strip comments (they mention banned tokens in prose)
      const stripped = css.replace(/var\([^)]*\)/g, '');
      ok(!/#[0-9a-fA-F]{3,8}\b/.test(stripped), 'practices.css uses no raw hex colours (DS tokens only)');
      ok(!/@keyframes|transition:/.test(css), 'practices.css is reduced-motion-safe (no transitions/keyframes)');
      ok(/\.pr-harm\b/.test(css) && /var\(--bad\)/.test(css), 'practices.css styles the harm callout on the --bad token');
      ok(/overflow-x: auto/.test(css), 'practices.css scrolls wide content (crosswalk table) inside its own box');
    }
  }

  // ---- BEHAVIOURAL: B-practices-data's pure contract + the art (guarded) --
  await guard('core/practices.js contract', async () => {
    const core = await import('../../assets/js/core/practices.js');
    const data = await import('../../assets/js/core/data/practices/mudras.js');
    const art = await import('../../assets/js/app/practices-art.js');

    const M = data.HATHA_MUDRAS;
    ok(Array.isArray(M) && M.length === 35, `HATHA_MUDRAS has 35 records (got ${M && M.length})`);
    ok(core.mudrasBySource('gheranda').length === 25, `25 Gheraṇḍa records (got ${core.mudrasBySource('gheranda').length})`);
    ok(core.mudrasBySource('hyp').length === 10, `10 HYP records (got ${core.mudrasBySource('hyp').length})`);

    const st = core.practicesStats();
    ok(st.total === 35, 'practicesStats().total === 35');
    ok(st.withHarmNote >= 6, `≥6 records carry a harm flag (got ${st.withHarmNote})`);
    ok(st.contested >= 2, `≥2 records carry a contested note (got ${st.contested})`);

    // schema + id uniqueness + source enum
    const ids = new Set();
    let schemaBad = 0;
    for (const r of M) {
      if (ids.has(r.id)) schemaBad++;
      ids.add(r.id);
      if (!r.name || !r.iast || !r.locus || !r.description || !r.purpose) schemaBad++;
      if (r.source !== 'gheranda' && r.source !== 'hyp') schemaBad++;
      if (!Array.isArray(r.sources) || !r.sources.length) schemaBad++;
    }
    ok(schemaBad === 0, `every record has id/name/iast/locus/description/purpose/source∈enum/sources (${schemaBad} bad)`);

    // crosswalk integrity: every crosswalk id resolves
    let xwBad = 0, pairs = 0;
    for (const r of M) for (const cid of (r.crosswalk || [])) {
      if (!core.mudraById(cid)) xwBad++;
      if (r.source === 'gheranda' && core.mudraById(cid) && core.mudraById(cid).source === 'hyp') pairs++;
    }
    ok(xwBad === 0, `every crosswalk id resolves (${xwBad} dangling)`);
    ok(pairs === 10, `10 GS→HYP crosswalk pairs (got ${pairs})`);

    // riskNote presence on the known-dangerous seals
    for (const id of ['gs-khecari', 'hyp-khecari', 'hyp-vajroli', 'gs-mahavedha', 'hyp-mahavedha']) {
      const r = core.mudraById(id);
      ok(r && r.harmNote, `${id} carries a harmNote`);
    }
    // the CORRECTED framing: gs-vajroni is an inversion (arm-balance figure), NOT
    // the HYP genito-urinary practice — its harmNote is the inversion risk.
    const gsv = core.mudraById('gs-vajroni');
    ok(gsv && /invert|inversion/i.test(gsv.harmNote || '') && art.artIdFor(gsv) === 'arm-balance',
      'gs-vajroni framed as an inversion / arm-balance (not the HYP genito-urinary vajrolī)');
    const hypv = core.mudraById('hyp-vajroli');
    ok(hypv && /clinical|ethical|urethra|urinary/i.test(hypv.harmNote || ''), 'hyp-vajroli carries the clinical+ethical harm note');

    // descriptive-voice lint: no imperative openings
    const IMPER = /^(Sit|Breathe|Hold|Place|Press|Repeat|Inhale|Exhale|Visualize|Recite)\b/;
    let voiceBad = 0;
    for (const r of M) if (IMPER.test(r.description) || IMPER.test(r.purpose)) voiceBad++;
    ok(voiceBad === 0, `descriptive voice: no imperative openings in description/purpose (${voiceBad} bad)`);

    // MUDRA_GROUPS: 8 groups, exactly one built (mudrā)
    ok(Array.isArray(data.MUDRA_GROUPS) && data.MUDRA_GROUPS.length === 8, `8 practice groups (got ${data.MUDRA_GROUPS && data.MUDRA_GROUPS.length})`);
    ok(data.MUDRA_GROUPS.filter(g => g.built).length === 1, 'exactly one group is built this round (mudrā)');

    // the art builder: every record → a role=img figure; labels never depict cutting
    let artBad = 0, cutLabel = 0;
    for (const r of M) {
      const fig = art.mudraFigure(r);
      if (!/role="img"/.test(fig) || !/aria-label="[^"]{8,}/.test(fig)) artBad++;
      const m = fig.match(/aria-label="([^"]*)"/);
      if (m && /\bcut/i.test(m[1])) cutLabel++;
    }
    ok(artBad === 0, `every record resolves to a role=img figure with a descriptive label (${artBad} bad)`);
    ok(cutLabel === 0, `no figure label depicts the frenum-cutting (${cutLabel} did)`);
    ok(art.mudraFigure(core.mudraById('hyp-vajroli')).includes('Not diagrammed'), 'vajrolī renders the honest not-diagrammed panel, not an invented figure');
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/practices/index.html',
    actions: ['load'],
    asserts: [
      '#pr-stats renders the live catalog counts; #pr-groups renders the 8 practice-group cards',
      'the mudrā group shows "built this round"; the other 7 show catalogued/planned/theory-only/computed with cross-links',
      'the standing no-validity caveat renders before the group cards; Great Works + Confluence + Yoga cross-links resolve',
      '390px: no horizontal overflow; reduced-motion: no animation',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/practices/mudras.html',
    actions: ['load', 'type a term into the filter', 'toggle the source segmented control', 'toggle "only harm-flagged"'],
    asserts: [
      '35 record cards render (25 Gheraṇḍa + 10 HYP), each with a generated schematic SVG figure (role=img + aria-label)',
      'the khecarī and vajrolī cards show a prominent red harm callout BEFORE the description; vajrolī shows the honest "Not diagrammed" panel',
      'same-name divergences render a ⚑ contested panel with both positions (khecarī cut-in-both; vajrolī vs vajroṇī)',
      'the filter/source/harm controls narrow the catalog; the crosswalk table joins the 10 shared-name pairs and its links jump to the cards',
      '390px: no horizontal overflow (the crosswalk table scrolls in its own box); reduced-motion: instant',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
