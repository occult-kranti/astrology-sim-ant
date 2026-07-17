// ============================================================================
//  scripts/tests/r28-vedic-ui.mjs — R28 Vedic tools UI (V2) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a
//  `DRIVES` array of {page, actions[], asserts[]} for the Chromium sweep.
//
//  Two tiers of checks:
//   • STRUCTURAL (always runnable): read the two new page HTMLs, the two app
//     modules, the CSS and the edited vedic-panel.js as text and assert the
//     load-bearing invariants (hosts present, mountChrome keys, no stray rAF,
//     DS2-tokens-only CSS, dv-assistant markup, honest notes, keyboard roving).
//   • BEHAVIOURAL (guarded): dynamically import the pure exports — always the
//     vedic-panel normalisers (V1-independent), and, when V1's frozen data +
//     engine modules are present, the yoga/delineation helpers and the data
//     shape (36 yogas, 108 bhāva records, detectYogas never a bare boolean).
//     Absent V1 modules are SKIPPED (noted), never failed — the two builders
//     integrate in parallel.
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

  // ---- STRUCTURAL: the yoga detector page --------------------------------
  {
    const p = 'pages/vedic/yogas.html';
    ok(has(p), `${p} exists`);
    if (has(p)) {
      const h = read(p);
      ok(/mountChrome\(['"]vedicyogas['"]\)/.test(h), 'yogas.html mounts chrome key vedicyogas');
      ok(/initVedicYogas\(\)/.test(h), 'yogas.html calls initVedicYogas');
      ok(/id="vy-out"/.test(h), 'yogas.html has #vy-out results host');
      ok(/id="vy-picker"/.test(h), 'yogas.html has #vy-picker moment-picker host');
      for (const f of ['vy-lat', 'vy-lon', 'vy-date', 'vy-time', 'vy-offset']) ok(new RegExp(`id="${f}"`).test(h), `yogas.html has hidden #${f}`);
      ok(/id="vy-f-family"/.test(h) && /id="vy-f-status"/.test(h) && /id="vy-f-taught"/.test(h), 'yogas.html has family/status/taught filters');
      ok(/id="dv-assistant"/.test(h), 'yogas.html has #dv-assistant');
      ok(/id="vy-actionbar"/.test(h), 'yogas.html has #vy-actionbar');
      ok(/vedic-tools\.css/.test(h), 'yogas.html links vedic-tools.css');
      ok(/no demonstrated (?:predictive )?validity/i.test(h), 'yogas.html carries the honest-validity note');
      ok(/class="ep-strip"/.test(h), 'yogas.html has the epistemic strip');
    }
  }

  // ---- STRUCTURAL: the delineation browser page --------------------------
  {
    const p = 'pages/vedic/delineation.html';
    ok(has(p), `${p} exists`);
    if (has(p)) {
      const h = read(p);
      ok(/mountChrome\(['"]vedicdelineation['"]\)/.test(h), 'delineation.html mounts chrome key vedicdelineation');
      ok(/initVedicDelineation\(\)/.test(h), 'delineation.html calls initVedicDelineation');
      ok(/id="vd-grid"/.test(h), 'delineation.html has #vd-grid');
      ok(/id="vd-record"/.test(h), 'delineation.html has #vd-record');
      ok(/data-mode="browse"/.test(h) && /data-mode="chart"/.test(h), 'delineation.html has browse/chart mode toggle');
      for (const f of ['vd-lat', 'vd-lon', 'vd-date', 'vd-time', 'vd-offset']) ok(new RegExp(`id="${f}"`).test(h), `delineation.html has hidden #${f}`);
      ok(/id="dv-assistant"/.test(h), 'delineation.html has #dv-assistant');
      ok(/vedic-tools\.css/.test(h), 'delineation.html links vedic-tools.css');
      ok(/no demonstrated (?:predictive )?validity/i.test(h), 'delineation.html carries the honest-validity note');
      ok(/never merged|side by side/i.test(h), 'delineation.html states the two-witness (never merged) discipline');
    }
  }

  // ---- STRUCTURAL: app modules -------------------------------------------
  {
    const a = 'assets/js/app/vedic-yogas.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'vedic-yogas.js has no requestAnimationFrame (site invariant)');
      ok(/from '\.\.\/core\/yogas\.js'/.test(s), 'vedic-yogas.js imports the V1 core/yogas.js contract');
      ok(/detectYogas/.test(s) && /YOGA_RULES/.test(s) && /YOGA_FAMILIES/.test(s), 'vedic-yogas.js consumes detectYogas/YOGA_RULES/YOGA_FAMILIES');
      ok(/kind:\s*'vedicyogas'/.test(s), 'vedic-yogas.js wires the vedicyogas assistant kind');
      ok(/export function groupByFamily/.test(s) && /export function passesFilter/.test(s) && /export function statusView/.test(s), 'vedic-yogas.js exports its pure view helpers');
      ok(!/style="background:/.test(s), 'vedic-yogas.js uses no inline background HL (F-INLINE-HL)');
    }
  }
  {
    const a = 'assets/js/app/vedic-delineation.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'vedic-delineation.js has no requestAnimationFrame');
      ok(/from '\.\.\/core\/data\/bhava-phala\.js'/.test(s), 'vedic-delineation.js imports BHAVA_PHALA contract');
      ok(/ArrowRight/.test(s) && /ArrowDown/.test(s) && /tabindex/.test(s), 'vedic-delineation.js has roving-tabindex keyboard nav');
      ok(/kind:\s*'vedicdelineation'/.test(s), 'vedic-delineation.js wires the vedicdelineation assistant kind');
      ok(/export function delinGridModel/.test(s) && /export function chartPlacements/.test(s) && /export function agreementBadge/.test(s), 'vedic-delineation.js exports its pure helpers');
    }
  }

  // ---- STRUCTURAL: CSS is DS2-tokens-only --------------------------------
  {
    const c = 'assets/css/vedic-tools.css';
    ok(has(c), `${c} exists`);
    if (has(c)) {
      const css = read(c);
      // strip var(--token, fallback) fallbacks that legitimately name other tokens,
      // then assert no raw hex colours remain.
      const stripped = css.replace(/var\([^)]*\)/g, '');
      ok(!/#[0-9a-fA-F]{3,8}\b/.test(stripped), 'vedic-tools.css uses no raw hex colours (DS2 tokens only)');
      ok(/prefers-reduced-motion|no animation|Reduced-motion/i.test(css) || !/@keyframes|transition:/.test(css), 'vedic-tools.css is reduced-motion-safe (no transitions/keyframes)');
    }
  }

  // ---- STRUCTURAL: the vedic-panel edits ---------------------------------
  {
    const a = 'assets/js/app/vedic-panel.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(/export function normalizeCombustion/.test(s) && /export function relationHeatModel/.test(s) && /export function drishtiModel/.test(s), 'vedic-panel.js exports the R28 normalisers');
      ok(/mountVedicRelations/.test(s), 'vedic-panel.js wires mountVedicRelations');
      ok(/data-asta/.test(s), 'vedic-panel.js adds the combustion (asta) flag slots');
      ok(/v-fig-relmatrix/.test(s) && /v-fig-drishti/.test(s), 'vedic-panel.js adds the friendship + drishti hosts');
      // the V1 surfaced exports must be reached by DYNAMIC import (a static import
      // of a not-yet-exported name is a module-load SyntaxError that would blank
      // the whole panel before V1 lands).
      ok(!/import\s*\{[^}]*compoundRelations[^}]*\}\s*from\s*'\.\.\/core\/vedic\.js'/.test(s), 'vedic-panel.js does NOT statically import the surfaced exports');
      ok(/import\('\.\.\/core\/vedic\.js'\)/.test(s), 'vedic-panel.js dynamically imports core/vedic.js for the surfaced exports');
    }
  }

  // ---- BEHAVIOURAL: vedic-panel normalisers (V1-independent, run now) ----
  await guard('vedic-panel normalisers', async () => {
    const m = await import('../../assets/js/app/vedic-panel.js');
    // combustion: boolean map, object map, array
    const c1 = m.normalizeCombustion({ Sun: false, Mercury: true });
    ok(c1.Mercury && c1.Mercury.combust === true && c1.Sun.combust === false, 'normalizeCombustion: boolean map');
    const c2 = m.normalizeCombustion({ Venus: { combust: true, arc: 9, cite: 'SS 9.6', contested: true } });
    ok(c2.Venus && c2.Venus.combust === true && c2.Venus.arc === 9 && c2.Venus.contested === true, 'normalizeCombustion: object map with arc/cite/contested');
    const c3 = m.normalizeCombustion([{ graha: 'Mars', is: true, deg: 17 }]);
    ok(c3.Mars && c3.Mars.combust === true && c3.Mars.arc === 17, 'normalizeCombustion: array form');
    ok(Object.keys(m.normalizeCombustion(null)).length === 0, 'normalizeCombustion: null → {}');

    // friendship heat model over a number matrix
    const relRaw = { Sun: { Sun: 0, Moon: 22.5, Mars: 15 }, Moon: { Sun: 15, Moon: 0, Mars: 7.5 }, Mars: { Sun: 22.5, Moon: 3.75, Mars: 0 } };
    const rel = m.relationHeatModel(relRaw);
    ok(rel && rel.cols.length === 3 && rel.rows.length === 3, 'relationHeatModel: 3×3 model');
    ok(rel.rows[0].cells[0].v === '·', 'relationHeatModel: diagonal is blank (·)');
    ok(rel.rows[0].cells[1].v === 22.5, 'relationHeatModel: off-diagonal carries the virūpa');
    ok(rel.scale && rel.scale.min === 0 && rel.scale.steps === 4, 'relationHeatModel: quantised scale');
    ok(m.relationHeatModel(null) === null, 'relationHeatModel: null → null');

    // drishti model: full aspect flagged at 60
    const drRaw = { Mars: { Mars: 0, Jupiter: 60, Saturn: 30 }, Jupiter: { Mars: 45, Jupiter: 0, Saturn: 60 }, Saturn: { Mars: 60, Jupiter: 15, Saturn: 0 } };
    const dr = m.drishtiModel(drRaw);
    ok(dr && dr.grahas.length === 3, 'drishtiModel: grahas parsed');
    ok(dr.matrix.Mars.Jupiter && dr.matrix.Mars.Jupiter.full === true, 'drishtiModel: 60 virūpa → full aspect');
    ok(dr.matrix.Mars.Saturn && dr.matrix.Mars.Saturn.full === false, 'drishtiModel: 30 virūpa → not full');
    ok(dr.matrix.Mars.Mars === null, 'drishtiModel: diagonal null');
    // object-cell form
    const dr2 = m.drishtiModel({ Sun: { Sun: null, Moon: { virupa: 60, full: true } }, Moon: { Sun: { value: 12 }, Moon: null } });
    ok(dr2.matrix.Sun.Moon.full === true && dr2.matrix.Moon.Sun.virupa === 12, 'drishtiModel: object cells');

    // V1's actual WRAPPER shapes: { grahas, matrix|grid, cite } and { perGraha, cite, contested }
    const relWrap = { grahas: ['Sun', 'Moon'], matrix: { Sun: { Sun: null, Moon: { compound: 'great friend', tierVirupa: 22.5 } }, Moon: { Sun: { tierVirupa: 15 }, Moon: null } }, cite: 'BPHS 3.55–60', note: 'x' };
    const rw = m.relationHeatModel(relWrap);
    ok(rw && rw.cols.length === 2 && rw.rows.length === 2, 'relationHeatModel: unwraps {grahas,matrix} (2×2, not the wrapper keys)');
    ok(rw.rows[0].cells[1].v === 22.5, 'relationHeatModel: reads tierVirupa from the wrapped matrix');
    const drWrap = { grahas: ['Mars', 'Jupiter'], grid: { Mars: { Mars: null, Jupiter: { sphuta: 60, full: true, special: true } }, Jupiter: { Mars: { sphuta: 30, full: false }, Jupiter: null } }, modes: ['whole-sign', 'sphuta'], cite: 'BPHS 26' };
    const dw = m.drishtiModel(drWrap);
    ok(dw && dw.grahas.length === 2 && dw.matrix.Mars.Jupiter.full === true && dw.matrix.Mars.Jupiter.virupa === 60, 'drishtiModel: unwraps {grahas,grid} and reads sphuta/full');
    const combWrap = { perGraha: { Mercury: { is: true, sep: 3.1, arc: 14, retrograde: false }, Mars: { is: false, sep: 40, arc: 17 } }, notApplicable: ['Sun', 'Rahu', 'Ketu'], contested: true, cite: 'SS 9.6–9' };
    const cw = m.normalizeCombustion(combWrap);
    ok(cw.Mercury && cw.Mercury.combust === true && cw.Mercury.arc === 14 && cw.Mercury.contested === true && cw.Mercury.cite === 'SS 9.6–9', 'normalizeCombustion: unwraps {perGraha} + inherits top cite/contested');
    ok(cw.Mars && cw.Mars.combust === false && !('perGraha' in cw) && !('notApplicable' in cw) && !('cite' in cw), 'normalizeCombustion: does not leak wrapper keys as grahas');
  });

  // ---- BEHAVIOURAL: the REAL V1 surfaced functions → my normalisers ------
  await guard('real compoundRelations/grahaDrishti/combustion pipeline', async () => {
    const { castChart } = await import('../../assets/js/core/astro.js');
    const { castVedic, compoundRelations, grahaDrishti, combustion } = await import('../../assets/js/core/vedic.js');
    const pan = await import('../../assets/js/app/vedic-panel.js');
    const v = castVedic(castChart(new Date('1990-05-15T12:00:00Z'), 51.5074, -0.1278, 'whole'), { currentDate: new Date('2026-07-16T00:00:00Z') });
    ok(typeof compoundRelations === 'function' && typeof grahaDrishti === 'function' && typeof combustion === 'function', 'V1 surfaced compoundRelations/grahaDrishti/combustion exist');
    const rel = pan.relationHeatModel(compoundRelations(v));
    ok(rel && rel.rows.length === 7 && rel.cols.length === 7, 'real compoundRelations → 7×7 heat model');
    ok(rel.rows.every(r => r.cells.every(c => c.v === '·' || typeof c.v === 'number')), 'real friendship cells are virūpa numbers or the blank diagonal');
    const dr = pan.drishtiModel(grahaDrishti(v));
    ok(dr && dr.grahas.length === 9, 'real grahaDrishti → 9-graha model');
    ok(dr.grahas.some(a => dr.grahas.some(b => a !== b && dr.matrix[a][b] && dr.matrix[a][b].full)), 'real drishti has at least one full aspect (every graha aspects its 7th)');
    const comb = pan.normalizeCombustion(combustion(v));
    ok(!('Sun' in comb) && !('Rahu' in comb) && !('Ketu' in comb), 'real combustion excludes Sun/Rāhu/Ketu');
    ok(Object.keys(comb).every(g => typeof comb[g].combust === 'boolean'), 'real combustion → per-graha boolean flags');
  });

  // ---- BEHAVIOURAL: yoga view helpers (needs V1 core/yogas.js) -----------
  await guard('yoga view helpers', async () => {
    const m = await import('../../assets/js/app/vedic-yogas.js');
    const rules = [
      { id: 'a', family: 'solar', taughtInPlaylist: true },
      { id: 'b', family: 'lunar', taughtInPlaylist: false },
      { id: 'c', family: 'solar', taughtInPlaylist: false },
    ];
    const families = { solar: { name: 'Solar', description: 'x' }, lunar: { name: 'Lunar', description: 'y' } };
    const results = [
      { rule: rules[0], status: 'met' },
      { rule: rules[1], status: 'not-met' },
      { rule: rules[2], status: 'conditional' },
    ];
    const groups = m.groupByFamily(results, families, rules);
    ok(groups.length === 2 && groups[0].family === 'solar' && groups[0].results.length === 2, 'groupByFamily: groups in family order');
    ok(m.passesFilter(results[0], { family: 'solar' }) && !m.passesFilter(results[1], { family: 'solar' }), 'passesFilter: family');
    ok(m.passesFilter(results[2], { status: 'conditional' }) && !m.passesFilter(results[0], { status: 'conditional' }), 'passesFilter: status');
    ok(m.passesFilter(results[0], { taught: true }) && !m.passesFilter(results[2], { taught: true }), 'passesFilter: taught');
    ok(m.statusView('met').glyph === '✓' && m.statusView('not-met').glyph === '✗' && m.statusView('conditional').cls === 'conditional', 'statusView: glyph/class mapping');
  });

  // ---- BEHAVIOURAL: delineation helpers (needs V1 bhava-phala.js) --------
  await guard('delineation helpers', async () => {
    const m = await import('../../assets/js/app/vedic-delineation.js');
    const recs = [
      { graha: 'Sun', bhava: 1, phaladipika: { locus: '8.1', summary: 'x' }, saravali: { locus: '30.2', summary: 'y' }, agreement: 'agree' },
      { graha: 'Rahu', bhava: 1, phaladipika: { locus: '8.25', summary: 'z' }, saravali: { locus: null, summary: null, note: 'absent' }, agreement: null },
    ];
    const model = m.delinGridModel(recs);
    ok(model.grahas[0] === 'Sun' && model.grahas.includes('Rahu'), 'delinGridModel: grahas in canonical order');
    ok(model.bhavas.length === 12, 'delinGridModel: 12 bhāvas');
    ok(model.byKey.get('Sun|1').agreement === 'agree', 'delinGridModel: byKey lookup');
    ok(m.hasSaravali(recs[0]) === true && m.hasSaravali(recs[1]) === false, 'hasSaravali: present vs absent');
    ok(m.agreementBadge('contradict').cls === 'contradict' && m.agreementBadge(null).cls === 'single', 'agreementBadge: mapping incl. single witness');
    ok(m.agreementMark('agree').mark === '=' && m.agreementMark(null).mark === '·', 'agreementMark: mapping');
    const v = { grahas: { Sun: { house: 10 }, Moon: { house: 3 }, Ketu: { house: 5 } } };
    const pl = m.chartPlacements(v);
    ok(pl.length === 3 && pl[0].graha === 'Sun' && pl[0].bhava === 10, 'chartPlacements: (graha, house) pairs');
  });

  // ---- CONTRACT SHAPE: V1's frozen data (when present) -------------------
  await guard('YOGA_RULES / YOGA_FAMILIES shape', async () => {
    const { YOGA_RULES, YOGA_FAMILIES } = await import('../../assets/js/core/data/yoga-rules.js');
    ok(Array.isArray(YOGA_RULES) && YOGA_RULES.length === 36, `YOGA_RULES has 36 records (got ${YOGA_RULES && YOGA_RULES.length})`);
    ok(YOGA_RULES.every(r => r.id && r.family && r.name), 'every yoga rule has id/family/name');
    const fams = new Set(YOGA_RULES.map(r => r.family));
    ok([...fams].every(f => YOGA_FAMILIES[f] && YOGA_FAMILIES[f].name), 'every family present in YOGA_FAMILIES with a name');
    const contested = YOGA_RULES.filter(r => r.contested);
    ok(contested.length > 0 && contested.every(r => Array.isArray(r.contested.positions) && r.contested.positions.length >= 2), 'contested rules carry ≥2 verbatim positions');
  });
  await guard('BHAVA_PHALA shape', async () => {
    const { BHAVA_PHALA } = await import('../../assets/js/core/data/bhava-phala.js');
    ok(Array.isArray(BHAVA_PHALA) && BHAVA_PHALA.length === 108, `BHAVA_PHALA has 108 records (got ${BHAVA_PHALA && BHAVA_PHALA.length})`);
    const grahas = new Set(BHAVA_PHALA.map(r => r.graha));
    ok(grahas.size === 9, `BHAVA_PHALA covers 9 grahas (got ${grahas.size})`);
    ok(BHAVA_PHALA.every(r => r.phaladipika && r.phaladipika.summary), 'every record has a Phaladīpikā witness');
    const nodes = BHAVA_PHALA.filter(r => r.graha === 'Rahu' || r.graha === 'Ketu');
    ok(nodes.length > 0 && nodes.every(r => r.saravali && r.saravali.summary == null), 'Rāhu/Ketu records are single-witness (no Sārāvalī summary)');
    const agreements = new Set(BHAVA_PHALA.map(r => r.agreement));
    ok([...agreements].every(a => a === 'agree' || a === 'partial' || a === 'contradict' || a == null), 'agreement values are in the enum');
  });

  // ---- CONTRACT: detectYogas never a bare boolean for a real chart -------
  await guard('detectYogas contract', async () => {
    const { castChart } = await import('../../assets/js/core/astro.js');
    const { castVedic } = await import('../../assets/js/core/vedic.js');
    const { detectYogas } = await import('../../assets/js/core/yogas.js');
    const v = castVedic(castChart(new Date('1990-05-15T12:00:00Z'), 51.5074, -0.1278, 'whole'), { currentDate: new Date('2026-07-16T00:00:00Z') });
    const res = detectYogas(v, {});
    ok(Array.isArray(res) && res.length > 0, 'detectYogas returns a non-empty array');
    ok(res.every(r => r && typeof r === 'object' && !('present' in r && typeof r.present === 'boolean' && !('status' in r))), 'detectYogas returns records, never bare booleans');
    ok(res.every(r => ['met', 'not-met', 'conditional'].includes(r.status)), 'every result has an enum status');
    ok(res.every(r => Array.isArray(r.conditionResults)), 'every result carries conditionResults[]');
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/vedic/yogas.html',
    actions: ['load', 'detect the yogas', 'change family/status filters', 'toggle taught-only'],
    asserts: [
      '#vy-out renders yoga cards grouped by family',
      'every contested yoga shows a ⚑ CONTESTED panel with ≥2 positions, never a lone yes/no',
      'each condition row shows ✓ or ✗ + its detail',
      'filters hide/show cards in place without recompute; empty families collapse',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/vedic/delineation.html',
    actions: ['load', 'arrow-key rove the 12×9 grid', 'Enter opens a record', 'switch to "from a chart" and compute'],
    asserts: [
      '#vd-grid is a role=grid; arrow keys move cell focus; Enter/click opens the record',
      'the record shows TWO witness columns side by side (never merged) + an agreement badge',
      'a contradiction record renders the contradiction callout; Rāhu/Ketu show the single-witness absence note',
      '"from a chart" mode rings the nine actual placements (• marks) and opens the first',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/vedic/index.html',
    actions: ['compute the Vedic chart'],
    asserts: [
      'the graha table shows ☀ asta flags for any combust graha',
      'the pañcadhā-maitrī friendship heat table renders',
      'the graha-dṛṣṭi aspect grid renders with full aspects boxed',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
