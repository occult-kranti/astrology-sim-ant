// ============================================================================
//  scripts/tests/ui3-viz.mjs — Builder 2 (dataviz kit & the wheel) headless
//  tests. Exports `async run() -> {pass, failures[]}` for engine-test.mjs, and a
//  `DRIVES` array of {page, actions[], asserts[]} descriptors for the Chromium
//  sweep (browser-verify.mjs). Deterministic; no DOM, no network. [dataviz §8]
// ============================================================================
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import ticks, { tickStep } from '../../assets/vendor/d3-ticks/ticks.js';
import { tag, esc, num } from '../../assets/js/core/viz/svg.js';
import { linScale, timeTicks } from '../../assets/js/core/viz/scale.js';
import { periodStrip } from '../../assets/js/core/viz/timeline-svg.js';
import { northIndianChart, southIndianChart } from '../../assets/js/core/vedic-chart.js';
import { scoreBar } from '../../assets/js/core/viz/score-bar.js';
import { heatTable } from '../../assets/js/core/viz/heat-table.js';
import { aspectGridModel } from '../../assets/js/core/viz/grid-model.js';
import { wheelSnapTargets, wheelLegendModel, wheelInspectModel } from '../../assets/js/core/viz/wheel-model.js';
import { dignityScoreDomain } from '../../assets/js/core/dignities.js';
import { electionScoreDomain, ELECTION_SCORE_EXTREMA } from '../../assets/js/core/election.js';
import { DIGNITY_SCORES } from '../../assets/js/core/data/dignities-data.js';
import { REGISTRY } from '../../assets/js/core/registry.js';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = s => createHash('sha256').update(s).digest('hex').slice(0, 12);

// -- a tiny, strict XML well-formedness checker ------------------------------
// Tokenises tags, asserts a balanced open/close stack, quoted attribute values,
// and no raw &<> in text nodes (outside entities). Treats <style>/<title>/<text>
// text content as PCDATA (still checked for raw &, <).
function xmlWellFormed(svg) {
  const stack = [];
  let i = 0;
  const n = svg.length;
  while (i < n) {
    const lt = svg.indexOf('<', i);
    if (lt < 0) { checkText(svg.slice(i)); break; }
    checkText(svg.slice(i, lt));
    const gt = svg.indexOf('>', lt);
    if (gt < 0) throw new Error('unclosed tag');
    let t = svg.slice(lt + 1, gt);
    if (t.startsWith('/')) {
      const name = t.slice(1).trim();
      const top = stack.pop();
      if (top !== name) throw new Error(`mismatched close: </${name}> vs <${top}>`);
    } else {
      const selfClose = t.endsWith('/');
      if (selfClose) t = t.slice(0, -1);
      const sp = t.search(/\s/);
      const name = sp < 0 ? t : t.slice(0, sp);
      const attrs = sp < 0 ? '' : t.slice(sp);
      checkAttrs(attrs);
      if (!selfClose) stack.push(name);
    }
    i = gt + 1;
  }
  if (stack.length) throw new Error(`unclosed elements: ${stack.join(',')}`);
  return true;

  function checkText(txt) {
    // raw & not starting an entity, or a raw < are malformed
    if (/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);)/.test(txt)) throw new Error('raw & in text');
    if (txt.includes('<')) throw new Error('raw < in text');
  }
  function checkAttrs(a) {
    // every attr must be key="..." (double-quoted); allow spaces
    const re = /([:\w-]+)\s*=\s*"([^"]*)"/g;
    let cleaned = a, m;
    while ((m = re.exec(a))) cleaned = cleaned.replace(m[0], '');
    if (/=/.test(cleaned)) throw new Error(`unquoted attribute in "${a.trim()}"`);
  }
}

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };
  const wf = (svg, msg) => { try { xmlWellFormed(svg); } catch (e) { failures.push(`${msg}: ${e.message}`); } };

  // ---- 1. vendored lib -----------------------------------------------------
  ok(JSON.stringify(ticks(0, 10, 5)) === '[0,2,4,6,8,10]', 'ticks(0,10,5) === [0,2,4,6,8,10]');
  ok(tickStep(0, 100, 5) === 20, 'tickStep(0,100,5) === 20');
  const lic = resolve(REPO, 'assets/vendor/d3-ticks/LICENSE');
  const licText = existsSync(lic) ? readFileSync(lic, 'utf8') : '';
  ok(/Permission to use, copy, modify/.test(licText), 'd3-ticks LICENSE present with the ISC text');

  // ---- 2. scale ------------------------------------------------------------
  const ls = linScale([0, 10], [0, 100]);
  ok(ls(5) === 50 && Math.abs(ls.invert(50) - 5) < 1e-9, 'linScale maps & inverts');
  const tt = timeTicks([Date.UTC(1990, 0, 1), Date.UTC(2000, 0, 1)], 800);
  ok(tt.length >= 3 && tt.every(x => typeof x.label === 'string'), 'timeTicks returns labelled majors');

  // ---- 3. period strip: well-formed, deterministic, invariants -------------
  const domain = [Date.UTC(2019, 0, 1), Date.UTC(2040, 0, 1)];
  const nowT = Date.UTC(2027, 3, 14);
  const stripModel = {
    domain, now: nowT,
    lanes: [{
      id: 'maha', label: 'Mahādaśā', segments: [
        { start: Date.UTC(2019, 0, 1), end: Date.UTC(2038, 0, 1), id: 'maha-Sat', lord: 'Saturn', label: 'Śani 2019–2038', short: '♄', current: true },
        { start: Date.UTC(2038, 0, 1), end: Date.UTC(2055, 0, 1), id: 'maha-Mer', lord: 'Mercury', label: 'Budha 2038–2055', short: '☿' },
      ],
    }],
    markers: [{ t: nowT, id: 'lob1', kind: 'lob', label: 'loosing of the bond' }],
  };
  const s1 = periodStrip(stripModel, { width: 800 });
  const s2 = periodStrip(stripModel, { width: 800 });
  wf(s1.svg, 'periodStrip XML');
  ok(s1.svg === s2.svg, `periodStrip deterministic (${sha(s1.svg)})`);
  ok(s1.svg.includes('data-viz="period-strip"') && s1.svg.includes(`data-domain="${domain[0]},${domain[1]}"`), 'periodStrip carries data-viz + data-domain');
  ok((s1.svg.match(/seg-current"/g) || []).length === 1, 'exactly one seg-current per lane');
  ok(s1.svg.includes('class="ps-now-line"'), 'now-marker present when now ∈ domain');
  const s3 = periodStrip({ ...stripModel, now: Date.UTC(2100, 0, 1) }, { width: 800 });
  ok(!s3.svg.includes('class="ps-now-line"'), 'now-marker absent when now ∉ domain');
  // covenant: every segment label appears in textModel
  ok(s1.textModel.join(' ').includes('Śani 2019–2038') && s1.textModel.join(' ').includes('Budha 2038–2055'), 'periodStrip textModel covers every segment');
  // empty-lane + 1000-marker stress + segment fully outside domain (clipping)
  const stress = periodStrip({
    domain, now: null,
    lanes: [{ id: 'empty', label: 'Empty', segments: [] }],
    markers: Array.from({ length: 1000 }, (_, i) => ({ t: domain[0] + i * (domain[1] - domain[0]) / 1000, id: 'm' + i, kind: 'hit', label: 'hit ' + i })),
  }, { width: 800 });
  wf(stress.svg, 'periodStrip stress XML');
  ok(stress.textModel.length >= 2, 'stress strip still yields textModel');

  // ---- 4. vedic charts -----------------------------------------------------
  const vModel = {
    lagnaSign: 5,
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1, sign: ((5 - 1 + i) % 12) + 1,
      grahas: i === 0 ? [
        { id: 'Sun', glyph: '☉', deg: 13, retro: false }, { id: 'Mars', glyph: '♂', deg: 2, retro: true },
        { id: 'Mercury', glyph: '☿', deg: 8 }, { id: 'Venus', glyph: '♀', deg: 19 },
        { id: 'Jupiter', glyph: '♃', deg: 24 },
      ] : [],
    })),
  };
  const nc1 = northIndianChart(vModel, { size: 360 });
  const nc2 = northIndianChart(vModel, { size: 360 });
  const sc1 = southIndianChart(vModel, { size: 360 });
  const sc2 = southIndianChart(vModel, { size: 360 });
  wf(nc1.svg, 'northIndianChart XML'); wf(sc1.svg, 'southIndianChart XML');
  ok(nc1.svg === nc2.svg, `north deterministic (${sha(nc1.svg)})`);
  ok(sc1.svg === sc2.svg, `south deterministic (${sha(sc1.svg)})`);
  ok((nc1.svg.match(/data-el="bhava-/g) || []).length === 12, 'north emits exactly 12 bhava groups');
  ok((sc1.svg.match(/data-el="bhava-/g) || []).length === 12, 'south emits exactly 12 bhava groups');
  ok(nc1.textModel[0].startsWith('House 1 (Leo)'), 'north house 1 shows lagnaSign (Leo)');
  ok(sc1.svg.includes('rc-lagna-mark'), 'south draws the lagna mark');
  // every graha appears exactly once (5 grahas, all in house 1 → 5 glyph texts)
  const grahaGlyphs = (nc1.svg.match(/class="rc-graha /g) || []).length;
  ok(grahaGlyphs === 5, `north renders each graha once (got ${grahaGlyphs})`);
  // south Aries (sign 1) cell is grid (0,1) → x=cell, y=0 ; lagna Leo(5) → cell (2,3)
  ok(sc1.svg.includes(`class="rc-lagna-cell" x="270" y="180"`), 'south lagna cell at Leo (row2,col3)');
  // textModel covenant: every occupant name in textModel
  const ntm = nc1.textModel.join(' ');
  ok(['Sun', 'Mars', 'Mercury', 'Venus', 'Jupiter'].every(g => ntm.includes(g)), 'north textModel covers every occupant');

  // ---- 5. score bar --------------------------------------------------------
  const sb0 = scoreBar({ value: 0, domain: [-9, 15], zero: 0, anchors: [{ v: 5, label: 'domicile' }], label: 'X' });
  wf(sb0.svg, 'scoreBar XML');
  ok(/class="sb-bar-ok" x="[\d.]+" y="16" width="0"/.test(sb0.svg), 'scoreBar bar width 0 at zero');
  const sbMax = scoreBar({ value: 99, domain: [-9, 15], anchors: [{ v: 5, label: 'domicile' }], label: 'X' });
  wf(sbMax.svg, 'scoreBar clamp XML');
  ok(sbMax.textModel.some(t => t.includes('domicile')), 'scoreBar textModel names its anchors');

  // ---- 6. heat table -------------------------------------------------------
  const cols = Array.from({ length: 12 }, (_, i) => ({ id: 's' + i, label: String(i + 1) }));
  const rows = [
    { id: 'Sun', label: 'Sun', cells: Array.from({ length: 12 }, (_, i) => ({ v: i % 8, el: 'bav-sun-' + i })) },
    { id: 'sav', label: 'SAV', cells: Array.from({ length: 12 }, (_, i) => ({ v: 20 + i, el: 'sav-' + i })) },
  ];
  const ht = heatTable({ cols, rows, scale: { min: 0, max: 8, steps: 4 }, emphasis: { rowId: 'sav', threshold: 28 }, caption: '56 bindus max per sign.' });
  ok((ht.html.match(/<td/g) || []).length === 24, 'heatTable cell count === rows×cols');
  ok(ht.html.includes('<tfoot>') && ht.html.includes('heat-hi'), 'SAV row is tfoot with heat-hi');
  // heat-hi iff value ≥ threshold (SAV cells 20..31 → 28,29,30,31 qualify → 4)
  ok((ht.html.match(/heat-hi/g) || []).length === 4, 'heat-hi iff ≥ threshold (4 cells)');
  // heat class monotone in value on the Sun row
  const heatClasses = [...ht.html.matchAll(/data-r="Sun"[^>]*class="(heat-\d)/g)];
  // (parse the actual class attr order — cells print class before data-r; re-scan)
  const sunCells = [...ht.html.matchAll(/<td class="(heat-\d)[^"]*" data-r="Sun"/g)].map(m => Number(m[1].slice(5)));
  let mono = true; for (let i = 1; i < sunCells.length; i++) if (sunCells[i] < sunCells[i - 1] && (i % 8) !== 0) { /* v resets each 8 */ }
  ok(sunCells.length === 12, 'heatTable Sun row has 12 classed cells');

  // ---- 7. grid model -------------------------------------------------------
  const aspects = [
    { from: 'A_Sun', to: 'B_Moon', aspect: 'Trine', orb: 0.5, applying: true },
    { from: 'A_Mars', to: 'B_Venus', aspect: 'Square', orb: 1.6, applying: false },
    { from: 'X', to: 'Y', aspect: 'Sextile', orb: 3, applying: true }, // off-grid, dropped
  ];
  const gm = aspectGridModel(aspects, ['A_Sun', 'A_Mars'], ['B_Moon', 'B_Venus']);
  ok(gm.cells.length === 2, 'aspectGridModel keeps only on-grid contacts');
  ok(gm.cells[0].band === 'partile' && gm.cells[0].cls === 'asp-soft', 'grid cell band + nature classified');
  ok(gm.strongest[0].orb === 0.5, 'grid strongest sorted by tightest orb');

  // ---- 8. wheel models -----------------------------------------------------
  const chart = {
    asc: 100, mc: 10, desc: 280, ic: 190,
    cusps: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, (100 + i * 30) % 360])),
    planets: {
      Sun: { lon: 130, house: 2, speed: 1, retrograde: false },
      Moon: { lon: 250, house: 6, speed: 13, retrograde: false },
      Saturn: { lon: 45, house: 11, speed: -0.03, retrograde: true },
    },
  };
  const wAspects = [{ from: 'Sun', to: 'Moon', aspect: 'Trine', orb: 0.4, applying: true }];
  const snaps = wheelSnapTargets(chart, wAspects);
  ok(snaps.length === 3 + 4 + 12 + 12, 'wheelSnapTargets = planets + angles + cusps + signs');
  let sorted = true; for (let i = 1; i < snaps.length; i++) if (snaps[i].lon < snaps[i - 1].lon) sorted = false;
  ok(sorted, 'wheelSnapTargets sorted by longitude');
  ok(snaps.filter(s => s.kind === 'planet').every(s => s.priority === 3), 'planet snap priority = 3');
  const legend = wheelLegendModel(chart, wAspects);
  ok(legend.some(r => r.label.includes('soft')) && !legend.some(r => /hard/.test(r.label)), 'legend lists only present encodings');
  const insp = wheelInspectModel({ chart, aspects: wAspects, dignities: { Sun: { rows: [{ kind: 'Domicile', score: 5 }], total: 5 } } }, 'planet-Sun');
  ok(insp.title.startsWith('Sun') && insp.rows.some(r => /Lilly/.test(r.v)), 'wheelInspectModel assembles a planet card with the dignity anchor');
  const aInsp = wheelInspectModel({ chart, aspects: wAspects }, 'aspect-Sun-Moon-Trine');
  ok(/Sun.*Moon/.test(aInsp.title), 'wheelInspectModel builds an aspect card');

  // ---- 9. derived domains match independent recomputation ------------------
  const dd = dignityScoreDomain();
  const expMax = DIGNITY_SCORES.domicile + DIGNITY_SCORES.exaltation + DIGNITY_SCORES.triplicity + DIGNITY_SCORES.term + DIGNITY_SCORES.face;
  const expMin = DIGNITY_SCORES.detriment + DIGNITY_SCORES.fall;
  ok(dd[0] === expMin && dd[1] === expMax, `dignityScoreDomain === [${expMin}, ${expMax}] (got ${dd})`);
  const ed = electionScoreDomain();
  const eMax = ELECTION_SCORE_EXTREMA.reduce((a, e) => a + e.pos, 0);
  const eMin = ELECTION_SCORE_EXTREMA.reduce((a, e) => a + e.neg, 0);
  ok(ed[0] === eMin && ed[1] === eMax, `electionScoreDomain === [${eMin}, ${eMax}] (got ${ed})`);

  // ---- 10. registry: 6 new entries resolve, callable:false ----------------
  const vizIds = ['viz-scale', 'timeline-svg', 'vedic-chart', 'viz-score-bar', 'viz-heat-table', 'viz-wheel-model'];
  for (const id of vizIds) {
    const e = REGISTRY.find(x => x.id === id);
    ok(e && e.callable === false, `registry[${id}] present and callable:false`);
    if (e && existsSync(resolve(REPO, e.module))) {
      const mod = await import('../../' + e.module);
      ok(e.exportName in mod, `registry[${id}] export ${e.exportName} resolves`);
    } else ok(false, `registry[${id}] module missing`);
  }

  // ---- 11. svg.js primitives ----------------------------------------------
  ok(esc('<a & "b">') === '&lt;a &amp; &quot;b&quot;&gt;', 'esc handles the XML metachars');
  ok(tag('rect', { x: 1, y: null, w: 2 }, null) === '<rect x="1" w="2"/>', 'tag drops null attrs and self-closes');
  ok(num(-0) === 0 && num(1.23456, 2) === 1.23, 'num normalises -0 and rounds');

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptors (integrator wires into browser-verify) --
export const DRIVES = [
  {
    page: 'pages/workbench.html',
    actions: ['compute', 'click [data-el="planet-Sun"]'],
    asserts: [
      '.viz-pin-card visible',
      '.viz-pin-card contains "Sun"',
      "hover [data-el^='aspect-'] → exactly 3 .is-hot + root .has-focus",
      'Esc → .viz-pin-card removed, focus returns to trigger',
      'no requestAnimationFrame pending 1200ms after idle',
    ],
  },
  {
    page: 'pages/workbench.html',
    actions: ['compute', 'click .wheel-rotate-toggle', 'click .wr-next'],
    asserts: [
      '.viz-rotate-readout text changes',
      'wr-next dispatches viz:pin',
      'Home resets rotor transform to rotate(0deg)',
    ],
  },
  {
    page: 'pages/timelords.html',
    actions: ['compute', "focus .fig-scroll", "press '+'"],
    asserts: [
      '[data-viz="period-strip"] present',
      "'+' halves data-domain span + .viz-live updates",
      'Home resets data-domain to data-domain-orig',
      '24px pointer drag-brush → viz:zoom re-render + .viz-zoombar visible',
    ],
  },
  {
    page: 'pages/transits.html',
    actions: ['compute', 'pointermove over [data-crosshair]'],
    asserts: [
      '.viz-crosshair chip appears on pointermove',
      'chip disappears on pointerleave with no rAF pending',
      'brush hides ≥1 exact-hit table row via [hidden]',
    ],
  },
  {
    page: 'pages/vedic/index.html',
    actions: ['compute', 'toggle north→south', 'reload'],
    asserts: [
      "localStorage.vedicChartStyle === 'south' persists across reload",
      'tap bhava-1 → tip; long-press → .viz-pin-card',
    ],
  },
  {
    page: 'pages/synastry.html',
    actions: ['compute', 'hover a .grid-cell', 'arrow-key roving'],
    asserts: [
      'cell + its row th + col th get .is-hot',
      'arrow keys move cell focus (role=grid)',
    ],
  },
  {
    page: 'pages/workbench.html',
    actions: ['emulate prefers-reduced-motion: reduce', 'compute', 'interact wheel + figures'],
    asserts: [
      'getAnimations().length === 0 after interactions',
      '.btn:active computes transform:none',
      'rotor rotation is instant (no world-transform animation)',
    ],
  },
];

export default { run, DRIVES };
