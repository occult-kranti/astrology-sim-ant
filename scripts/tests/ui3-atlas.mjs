// ============================================================================
//  scripts/tests/ui3-atlas.mjs — Builder 6 (THE ATLAS) headless test module.
//  Exports:  async run() -> { pass, failures[] }   and   DRIVES[]
//  Wired into scripts/engine-test.mjs by the integrator (D16). Deterministic,
//  dependency-free, DOM-free. Covers: the motion-consumption contract, the zoom
//  bridge (zoomAnchor + the linear-zoom lemma), clustering, minimapModel,
//  laneDensity, excerpt / edgeSparkline / searchEntries, the WP-11 tripwires,
//  and a re-run of the 18 shipped confluence engine-test asserts against
//  core/confluence.js after this round's edits.
// ============================================================================
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONFLUENCE_LANES, CONFLUENCE_ENTRIES, CONFLUENCE_EDGES } from '../../assets/js/core/data/confluence.js';
import {
  timeScale, layoutConfluence, filterEntries, entryBySlug, threadFrom, confluenceStats,
  ZOOM_LEVELS, ZOOM_RANGE, ZOOM_REBASE, nearestLevel, zoomAnchor,
  minimapModel, laneDensity, excerpt, edgeSparkline, searchEntries,
} from '../../assets/js/core/confluence.js';
import {
  SPRINGS, createConductor, createSpring, projectMomentum, rubberband, trackVelocity, motionOK,
} from '../../assets/js/app/motion.js';

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };
  const approx = (a, b, eps) => Math.abs(a - b) <= eps;

  // ---- 1. MOTION-CONSUMPTION CONTRACT (the atlas's physics dependencies) ----
  // preset constants exact (D2 — the atlas maps onto these).
  ok(SPRINGS.snappy.stiffness === 420 && SPRINGS.snappy.damping === 38, 'atlas/motion: snappy = {420,38}');
  ok(SPRINGS.gentle.stiffness === 170 && SPRINGS.gentle.damping === 26, 'atlas/motion: gentle = {170,26}');
  // headless: motionOK() false ⇒ createSpring.set resolves synchronously to target, zero frames.
  ok(motionOK() === false, 'atlas/motion: motionOK() === false headless');
  {
    let settledVal = null, updates = 0;
    const s = createSpring({ ...SPRINGS.snappy, onUpdate: () => updates++, onSettle: v => { settledVal = v; } });
    s.set(100);
    ok(settledVal === 100 && s.value === 100, 'atlas/motion: headless spring set() snaps to target synchronously');
    // a mock conductor never reschedules after the last task returns false (idle contract)
    let t = 0; const now = () => t; const raf = () => { t += 16; return 1; };
    const cond = createConductor({ raf, cancelRaf: () => {}, now });
    let calls = 0;
    cond.add(dt => { calls++; return calls < 3; });   // stops after 3
    ok(cond.running === true, 'atlas/motion: conductor runs while a task is live');
  }
  ok(projectMomentum(0.8, 325) === 260, 'atlas/motion: projectMomentum(0.8,325) === 260');
  ok(rubberband(0, 800) === 0, 'atlas/motion: rubberband(0)===0');
  {
    let mono = true, prev = -Infinity;
    for (let d = 0; d <= 2000; d += 50) { const r = rubberband(d, 800); if (r < prev - 1e-9) mono = false; prev = r; }
    ok(mono, 'atlas/motion: rubberband monotonic in overshoot');
    // the property the atlas depends on: overscroll RESISTANCE (output < input,
    // bounded). NB the atlas does not pin the asymptote value — B1 owns the
    // constant; see manifest-b6.md for the spec-vs-motion.js discrepancy note.
    ok(rubberband(2000, 800) < 2000 && rubberband(2000, 800) > 0, 'atlas/motion: rubberband resists (output < overshoot, bounded)');
    ok(rubberband(-100, 800) < 0, 'atlas/motion: rubberband signed');
  }
  { const tv = trackVelocity(); tv.push(0, 0); tv.push(50, 100); ok(typeof tv.velocity() === 'number', 'atlas/motion: trackVelocity returns a number'); }

  // ---- 2. ZOOM BRIDGE (pure) ------------------------------------------------
  ok(JSON.stringify(ZOOM_LEVELS) === '[0.6,1,1.6]', 'atlas/zoom: ZOOM_LEVELS = [0.6,1,1.6]');
  ok(ZOOM_RANGE.min === 0.5 && ZOOM_RANGE.max === 1.8, 'atlas/zoom: ZOOM_RANGE {0.5,1.8}');
  ok(ZOOM_REBASE.hi === 1.30 && ZOOM_REBASE.lo === 0.77 && ZOOM_REBASE.quietMs === 90, 'atlas/zoom: ZOOM_REBASE hysteresis constants');
  // nearestLevel log-space midpoints (√0.6≈0.7746, √1.6≈1.2649)
  ok(nearestLevel(0.5) === 0.6, 'atlas/zoom: nearestLevel(0.5)=0.6');
  ok(nearestLevel(0.79) === 1, 'atlas/zoom: nearestLevel(0.79)=1 (past the 0.77 midpoint)');
  ok(nearestLevel(1.26) === 1, 'atlas/zoom: nearestLevel(1.26)=1');
  ok(nearestLevel(1.27) === 1.6, 'atlas/zoom: nearestLevel(1.27)=1.6');
  ok(nearestLevel(1.8) === 1.6, 'atlas/zoom: nearestLevel(1.8)=1.6');

  // zoomAnchor center-year invariant: zoom 1→1.6 about the viewport centre keeps
  // the centre unscaled world point (hence the centre year) fixed.
  {
    const lo = layoutConfluence({ zoom: 1, width: 1280 });
    const vw = 900, vh = 600, sl = 300, st = 1400;
    const yearBefore = lo.scale.pxToYear((st + vh / 2) / 1);
    const a = zoomAnchor({ scrollLeft: sl, scrollTop: st, px: vw / 2, py: vh / 2, sOld: 1, sNew: 1.6, worldW: lo.width, worldH: lo.height, vw, vh });
    const yearAfter = lo.scale.pxToYear((a.scrollTop + vh / 2) / 1.6);
    ok(approx(yearBefore, yearAfter, 0.01), `atlas/zoom: zoomAnchor keeps the centre year invariant (Δ=${(yearAfter - yearBefore).toFixed(4)})`);
  }
  // The linear-zoom lemma: yearToPx scales linearly with zoom (the bridge's honesty).
  {
    const t1 = timeScale(1), t16 = timeScale(1.6);
    let linear = true;
    for (let k = 0; k < 20; k++) {
      const y = -1500 + k * 175;
      if (!approx(t16.yearToPx(y), 1.6 * t1.yearToPx(y), 1e-9)) linear = false;
    }
    ok(linear, 'atlas/zoom: linear-zoom lemma — timeScale(1.6).yearToPx === 1.6·timeScale(1).yearToPx (20 samples)');
  }

  // ---- 3. CLUSTERING (§7.1) -------------------------------------------------
  {
    const lo06 = layoutConfluence({ zoom: 0.6, width: 1180 });
    const painted = lo06.nodes.filter(n => !n.clusterOf);
    const absorbed = lo06.nodes.filter(n => n.clusterOf);
    const memberTotal = lo06.clusters.reduce((s, c) => s + c.count, 0);
    ok(painted.length + absorbed.length === CONFLUENCE_ENTRIES.length, 'atlas/cluster: painted + absorbed = all entries');
    ok(absorbed.length === memberTotal, 'atlas/cluster: every absorbed node belongs to exactly one cluster');
    // painted XOR clustered: no node both painted and a member
    const memberSet = new Set(lo06.clusters.flatMap(c => c.members));
    ok(painted.every(n => !memberSet.has(n.slug)), 'atlas/cluster: painted nodes are never cluster members (XOR)');
    ok(lo06.clusters.some(c => c.laneId === 'confluence'), 'atlas/cluster: the dense confluence lane produces ≥1 cluster at 0.6');
    // contestedCount correct
    const bySlug = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e]));
    ok(lo06.clusters.every(c => c.contestedCount === c.members.filter(s => bySlug.get(s) && bySlug.get(s).contested).length), 'atlas/cluster: contestedCount = members flagged contested');
    // deterministic membership
    const b = layoutConfluence({ zoom: 0.6, width: 1180 });
    ok(JSON.stringify(lo06.clusters) === JSON.stringify(b.clusters), 'atlas/cluster: membership byte-deterministic');
    ok(JSON.stringify([...(lo06.labelQuiet)]) === JSON.stringify([...(b.labelQuiet)]), 'atlas/cluster: labelQuiet byte-deterministic');
    // no two painted same-lane marks overlap > 4px at L=1
    const lo1 = layoutConfluence({ zoom: 1, width: 1280 });
    const byLane = {};
    for (const n of lo1.nodes) { if (n.clusterOf) continue; (byLane[n.laneId] = byLane[n.laneId] || []).push(n); }
    let overlap = 0;
    for (const k in byLane) { const a = byLane[k]; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (Math.abs(a[i].x - a[j].x) <= 4 && Math.abs(a[i].y - a[j].y) <= 4) overlap++; }
    ok(overlap === 0, `atlas/cluster: no two painted same-lane marks overlap ≤4px at L=1 (${overlap})`);
  }

  // ---- 3b. LABEL PLACEMENT: side flip (DEFECT 2) + de-conflict (DEFECT 3) ---
  // Every painted mark carries a deterministic labelSide + labelDy; no two
  // VISIBLE (non-quiet) same-lane label boxes overlap at zoom 1. The box
  // convention mirrors the layout + the CSS: chars*6.2 wide (capped to the
  // lane) × 22 tall, anchored 14px from the mark centre on its side.
  {
    const W = 1280, RULER_W = 64, LABEL_H = 24, LABEL_CW = 6.2, LABEL_INSET = 14;
    const laneW = (W - RULER_W) / CONFLUENCE_LANES.length;
    const lo = layoutConfluence({ zoom: 1, width: W });
    const byS = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e]));
    const painted = lo.nodes.filter(n => !n.clusterOf);
    ok(painted.every(n => n.labelSide === 'left' || n.labelSide === 'right'),
      'atlas/label: every painted mark has a labelSide ∈ {left,right}');
    ok(painted.every(n => typeof n.labelDy === 'number' && n.labelDy >= 0),
      'atlas/label: every painted mark has a numeric labelDy ≥ 0');
    // DEFECT 2 — no RIGHT-side label overruns the world's right frame edge
    const boxOf = n => {
      const e = byS.get(n.slug); const chars = e ? e.title.length : 8;
      const w = Math.min(chars * LABEL_CW, Math.max(20, laneW - 30));
      const xL = n.labelSide === 'left' ? n.x - LABEL_INSET - w : n.x + LABEL_INSET;
      const xR = n.labelSide === 'left' ? n.x - LABEL_INSET : n.x + LABEL_INSET + w;
      const cy = n.y + (n.labelDy || 0);
      return { xL, xR, yT: cy - LABEL_H / 2, yB: cy + LABEL_H / 2 };
    };
    const quiet = lo.labelQuiet instanceof Set ? lo.labelQuiet : new Set(lo.labelQuiet || []);
    let rightSpill = 0;
    for (const n of painted) { if (n.labelSide === 'right' && boxOf(n).xR > W) rightSpill++; }
    ok(rightSpill === 0, `atlas/label: no right-side label overruns the frame edge (${rightSpill})`);
    // DEFECT 3 — no two VISIBLE same-lane label boxes overlap
    const visByLane = {};
    for (const n of painted) { if (quiet.has(n.slug)) continue; (visByLane[n.laneId] = visByLane[n.laneId] || []).push(boxOf(n)); }
    let overlaps = 0, worst = null;
    for (const k in visByLane) {
      const a = visByLane[k];
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
        const A = a[i], B = a[j];
        const ox = Math.min(A.xR, B.xR) - Math.max(A.xL, B.xL);
        const oy = Math.min(A.yB, B.yB) - Math.max(A.yT, B.yT);
        if (ox > 1 && oy > 1) { overlaps++; if (!worst) worst = { k, ox: +ox.toFixed(1), oy: +oy.toFixed(1) }; }
      }
    }
    ok(overlaps === 0, `atlas/label: no two visible same-lane label boxes overlap at z1 (${overlaps}${worst ? ' e.g. ' + JSON.stringify(worst) : ''})`);
    // the two named collisions from the bug report are resolved (not both visible + overlapping)
    const katha = lo.nodes.find(n => n.slug === 'katha-upanisad');
    const shvet = lo.nodes.find(n => n.slug === 'shvetashvatara-upanisad');
    if (katha && shvet && !katha.clusterOf && !shvet.clusterOf) {
      const A = boxOf(katha), B = boxOf(shvet);
      const overlapping = !quiet.has(katha.slug) && !quiet.has(shvet.slug) &&
        (Math.min(A.xR, B.xR) - Math.max(A.xL, B.xL) > 1) && (Math.min(A.yB, B.yB) - Math.max(A.yT, B.yT) > 1);
      ok(!overlapping, 'atlas/label: katha ✕ shvetashvatara upaniṣad labels no longer overlap');
    }
    // determinism of the new fields
    const lo2 = layoutConfluence({ zoom: 1, width: W });
    ok(JSON.stringify(lo.nodes.map(n => [n.labelSide, n.labelDy])) === JSON.stringify(lo2.nodes.map(n => [n.labelSide, n.labelDy])),
      'atlas/label: labelSide + labelDy byte-deterministic');
  }

  // ---- 4. MINIMAP MODEL (§6.2) ---------------------------------------------
  {
    const lo = layoutConfluence({ zoom: 1, width: 1280 });
    const all = new Set(lo.nodes.map(n => n.slug));
    const mm = minimapModel(lo, all);
    ok(mm.bands.length === 6 && mm.bands.map(b => b.label).join('') === 'DACLTRSCEMGL', 'atlas/minimap: 6 era bands with 2-letter codes');
    ok(mm.cells.reduce((s, c) => s + c.count, 0) === CONFLUENCE_ENTRIES.length, 'atlas/minimap: Σ cell counts = visible entry count');
    ok(mm.cells.every(c => [0.08, 0.16, 0.28, 0.45].includes(c.alpha)), 'atlas/minimap: alphas ∈ {.08,.16,.28,.45}');
    const two = minimapModel(lo, all);
    ok(JSON.stringify(mm) === JSON.stringify(two), 'atlas/minimap: model byte-deterministic');
    const one = minimapModel(lo, new Set(lo.nodes.filter(n => n.laneId === 'islamic').map(n => n.slug)));
    ok(new Set(one.cells.map(c => c.laneIdx)).size === 1, 'atlas/minimap: filtering to one lane zeroes eight columns');
  }

  // ---- 5. laneDensity / excerpt / edgeSparkline / searchEntries -------------
  {
    const lo = layoutConfluence({ zoom: 1, width: 1280 });
    const ld = laneDensity(lo, null);
    ok(ld.length > 0 && ld.every(d => d.alpha >= 0.03 && d.alpha <= 0.12), 'atlas/laneDensity: alphas within [.03,.12]');
    ok(JSON.stringify(ld) === JSON.stringify(laneDensity(lo, null)), 'atlas/laneDensity: deterministic');
  }
  {
    const short = 'A short body.';
    ok(excerpt(short, 140) === short, 'atlas/excerpt: returns whole body when short');
    const long = 'Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega and then some more words to run well past the truncation boundary here';
    const ex = excerpt(long, 140);
    ok(ex.length <= 140, `atlas/excerpt: ≤ max (${ex.length})`);
    ok(!/\s\S*$/.test(ex.replace(/…$/, '')) || long.startsWith(ex.replace(/…$/, '')), 'atlas/excerpt: truncates on a boundary (no split word)');
    ok(excerpt(long, 140) === ex, 'atlas/excerpt: deterministic');
  }
  {
    const sp = edgeSparkline('picatrix');
    ok(sp.ticks.every(t => t.x >= 0 && t.x <= 1), 'atlas/edgeSparkline: partner ticks x ∈ [0,1]');
    ok(sp.ticks.every(t => t.dir === 'in' || t.dir === 'out'), 'atlas/edgeSparkline: each tick has a direction');
    ok(JSON.stringify(sp) === JSON.stringify(edgeSparkline('picatrix')), 'atlas/edgeSparkline: deterministic');
  }
  {
    const se = searchEntries('upani', 12);
    ok(se.length > 0 && /upani/i.test(se[0].title + (se[0].titleOriginal || '')), 'atlas/search: "upani" ranks an Upaniṣad entry first');
    ok(se.length <= 12, 'atlas/search: respects the limit');
    ok(searchEntries('', 12).length === 0, 'atlas/search: empty query → no rows');
    ok(JSON.stringify(searchEntries('golden', 12).map(e => e.slug)) === JSON.stringify(searchEntries('golden', 12).map(e => e.slug)), 'atlas/search: deterministic');
  }

  // ---- 6. WP-11 TRIPWIRES ---------------------------------------------------
  {
    const st = confluenceStats();
    ok(st.entries <= 450, `atlas/tripwire: entries ≤ 450 (${st.entries})`);
    ok(st.edges <= 400, `atlas/tripwire: edges ≤ 400 (${st.edges})`);
    const capacity = st.entries / 450;
    ok(capacity < 1.0, `atlas/tripwire: entry capacity below FAIL (100%) — ${(capacity * 100).toFixed(0)}%`);
    ok(st.crossLaneEdges <= 400, 'atlas/tripwire: cross-lane edges within budget');
  }

  // ---- 7. RE-RUN THE 18 SHIPPED CONFLUENCE ASSERTS --------------------------
  {
    const CFL_LANE_IDS = ['christian', 'alchemy-west', 'kabbalah', 'islamic', 'confluence', 'yoga-vedanta', 'tantra-rasa', 'buddhist', 'daoist'];
    const KINDS = new Set(['text', 'person', 'event', 'translation', 'institution']);
    const LABELS = new Set(['documented', 'disputed', 'debunked', 'conspiracy']);
    ok(CONFLUENCE_ENTRIES.length === 188, 'confluence(18): 188 entries');
    ok(CONFLUENCE_LANES.length === 9 && CONFLUENCE_LANES.every((l, i) => l.id === CFL_LANE_IDS[i]), 'confluence(18): 9 lanes in fixed order');
    const slugs = new Set(CONFLUENCE_ENTRIES.map(e => e.slug));
    ok(slugs.size === CONFLUENCE_ENTRIES.length, 'confluence(18): slugs unique');
    ok(CONFLUENCE_EDGES.every(g => slugs.has(g.from) && slugs.has(g.to)), 'confluence(18): no dangling edge endpoints');
    ok(CONFLUENCE_ENTRIES.every(e => CFL_LANE_IDS.includes(e.lane) && KINDS.has(e.kind) && LABELS.has(e.label)), 'confluence(18): lane/kind/label in enum');
    ok(CONFLUENCE_ENTRIES.every(e => e.sortYearEnd == null || e.sortYearEnd >= e.sortYear), 'confluence(18): sortYearEnd ≥ sortYear');
    ok(CONFLUENCE_ENTRIES.filter(e => e.contested).every(e => Array.isArray(e.contested.positions) && e.contested.positions.length >= 2), 'confluence(18): contested ≥ 2 positions');
    let badLink = 0;
    for (const e of CONFLUENCE_ENTRIES) if (e.siteLink && e.siteLink.href && !existsSync(resolve(process.cwd(), 'pages', e.siteLink.href.split('#')[0]))) badLink++;
    ok(badLink === 0, 'confluence(18): every siteLink href exists');
    const ts = timeScale(1);
    let mono = true, prev = -Infinity;
    for (let y = -1600; y <= 2030; y += 50) { const p = ts.yearToPx(y); if (p < prev - 1e-9) mono = false; prev = p; }
    ok(mono, 'confluence(18): timeScale(1) monotonic');
    ok(ts.totalHeight > 3000, 'confluence(18): totalHeight > 3000');
    const l1 = layoutConfluence({ zoom: 1, width: 1280 }), l2 = layoutConfluence({ zoom: 1, width: 1280 });
    ok(JSON.stringify(l1) === JSON.stringify(l2), 'confluence(18): layoutConfluence deterministic');
    let overlap = false; const rows = {};
    for (const n of l1.nodes) { const k = n.laneId + '|' + n.row; (rows[k] || (rows[k] = [])).forEach(y => { if (Math.abs(y - n.y) < n.h) overlap = true; }); rows[k].push(n.y); }
    ok(!overlap, 'confluence(18): no same-lane same-row y overlap');
    ok(l1.nodes.length === CONFLUENCE_ENTRIES.length && l1.edges.length === CONFLUENCE_EDGES.length, 'confluence(18): places every node + edge (188 nodes kept incl. absorbed)');
    const cross = filterEntries({ crossingsOnly: true });
    ok(cross.length > 0 && cross.every(s => slugs.has(s)), 'confluence(18): crossingsOnly subset');
    ok(filterEntries({}).length === 188, 'confluence(18): filterEntries({}) = 188');
    ok(threadFrom('sirr-i-akbar').stops.some(s => s.slug === 'oupnekhat'), 'confluence(18): threadFrom reaches oupnekhat');
    ok(entryBySlug('picatrix') && entryBySlug('nope') === null, 'confluence(18): entryBySlug hydrates/null');
    const stx = confluenceStats();
    let laneSum = 0; for (const id of CFL_LANE_IDS) laneSum += stx.byLane[id] || 0;
    const rawCross = CONFLUENCE_EDGES.filter(g => entryBySlug(g.from).lane !== entryBySlug(g.to).lane).length;
    ok(stx.entries === CONFLUENCE_ENTRIES.length && stx.edges === CONFLUENCE_EDGES.length && laneSum === CONFLUENCE_ENTRIES.length && stx.crossLaneEdges === rawCross, 'confluence(18): stats totals match');
  }

  return { pass: failures.length === 0, failures };
}

// ============================================================================
//  DRIVES — Chromium sweep descriptors (expert-atlas §15.2 E–N). The integrator
//  translates these into scripts/browser-verify.mjs steps.
// ============================================================================
export const DRIVES = [
  { page: '/pages/confluence.html', width: 1440, actions: ['load'],
    asserts: ['#cfl-minimap visible', '#cfl-instrument present', 'no console errors', "after 1.2s __motionStats().running === false"] },
  { page: '/pages/confluence.html', width: 1280, actions: ['load'], asserts: ['#cfl-minimap visible', 'toolbar ≤ 2 rows'] },
  { page: '/pages/confluence.html', width: 1140, actions: ['load'], asserts: ['#cfl-minimap visible at the 1140 breakpoint'] },
  { page: '/pages/confluence.html', width: 1024, actions: ['load'], asserts: ['#cfl-minimap hidden', 'atlas still renders'] },
  { page: '/pages/confluence.html', width: 390, actions: ['load'], asserts: ['ledger forced', 'atlas button disabled', 'no horizontal page scroll'] },
  { page: '/pages/confluence.html#sirr-i-akbar', width: 1280, actions: ['coldload'], asserts: ['drawer open', 'node .is-selected', 'viewport scrolled to it'] },
  { page: '/pages/confluence.html#thread=sirr-i-akbar', width: 1280, actions: ['coldload'], asserts: ['thread panel present', 'medallions painted (on the pill if absorbed)'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['pointer-drag #cfl-scroll up 300px with 8 samples'],
    asserts: ['scrollTop increased', 'after 1.5s __cflNav() = {state:idle, raf:false, s:1}'] },
  { page: '/pages/confluence.html?perf=1', width: 1280, actions: ['ctrl+wheel -480 over the map centre in two events'],
    asserts: ['zoom label reads 160%', "atlas[data-zoom=\"1.6\"]", 'world transform none after settle', 'centre year invariant within 2y'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['set zoom 60%', 'Enter a .cfl-cluster in the confluence lane', 'Esc'],
    asserts: ['cluster list drawer opens', 'Esc returns focus to the pill'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['type "upani" in #cfl-search', 'ArrowDown', 'Enter'],
    asserts: ['drawer opens an Upaniṣad entry', 'only offending filter axes relaxed if it was hidden'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['click #cfl-minimap at 80% height'], asserts: ['viewport centred near the global band', 'idle after'] },
  { page: '/pages/confluence.html', width: 1280, emulate: 'prefers-reduced-motion:reduce', actions: ['repeat drag + ctrl+wheel'],
    asserts: ['MutationObserver on #cfl-world[style]: no translate ever', 'zoom is instant re-render, transform stays none'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['focus a node that clusters at 0.6', 'press − twice'],
    asserts: ['focus lands on the absorbing pill (activeElement)'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['Tab through the page'],
    asserts: ['tab order toolbar → search → atlas nodes/pills (roving) → drawer', '#cfl-scroll never receives Tab focus'] },
  { page: '/pages/confluence.html', width: 1280, emulate: 'prefers-reduced-motion:reduce', actions: ['hover an edge .cfl-edge-hit'],
    asserts: ['card visible', "computed animation-name of the hot edge line is 'none'"] },
  { page: '/pages/confluence.html', width: 1280, actions: ['hover a node 300ms', 'click ⌖', 'move pointer away', 'Esc'],
    asserts: ['card persists then closes', 'focus undisturbed'] },
];
