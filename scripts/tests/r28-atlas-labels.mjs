// ============================================================================
//  scripts/tests/r28-atlas-labels.mjs — Builder A (ATLAS EDGE EPISTEMIC LABELS)
//  headless test module. Exports:  async run() -> { pass, failures[] }  and
//  DRIVES[]. Wired into scripts/engine-test.mjs by the integrator.
//  Deterministic, dependency-free, DOM-free.
//
//  Covers the R28 WP-3d edge-label pass: all 151 edges labeled; the label enum
//  is legal; every edge carries bestCitation + note; the label distribution
//  (141 documented / 9 disputed / 1 debunked) is exact; the one debunked edge is
//  corpus-hermeticum→kybalion; the labels bijection with the verified
//  r28data/edge-labels.json holds; the layout passes each edge's label through;
//  layout determinism is preserved; and the 18 shipped confluence engine-test
//  asserts remain green after this round's data regeneration.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { CONFLUENCE_LANES, CONFLUENCE_ENTRIES, CONFLUENCE_EDGES } from '../../assets/js/core/data/confluence.js';
import {
  timeScale, layoutConfluence, filterEntries, entryBySlug, threadFrom, confluenceStats,
} from '../../assets/js/core/confluence.js';

const EDGE_LABELS_JSON = 'C:/Users/mehta/AppData/Local/Temp/claude/c--Users-mehta-OneDrive-Documents-github-2026-astrology-sim-ant/4c4bfebe-9070-4f90-b661-5425fb4ad24b/scratchpad/r28data/edge-labels.json';
const LABEL_ENUM = new Set(['documented', 'disputed', 'debunked', 'conspiracy']);
const key = g => g.from + '|' + g.to + '|' + g.kind;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. EVERY EDGE LABELED, ENUM LEGAL -----------------------------------
  ok(CONFLUENCE_EDGES.length === 151, `labels: 151 edges (${CONFLUENCE_EDGES.length})`);
  ok(CONFLUENCE_EDGES.every(g => LABEL_ENUM.has(g.label)), 'labels: every edge label ∈ {documented,disputed,debunked,conspiracy}');
  ok(CONFLUENCE_EDGES.every(g => typeof g.bestCitation === 'string' && g.bestCitation.trim().length > 0),
    'labels: every edge carries a non-empty bestCitation');
  ok(CONFLUENCE_EDGES.every(g => typeof g.note === 'string' && g.note.trim().length > 0),
    'labels: every edge carries a non-empty note');
  // the R27 quintet survives intact (schema not clobbered)
  const KINDS = new Set(['translation', 'influence', 'commentary', 'synthesis', 'refutation', 'adaptation']);
  ok(CONFLUENCE_EDGES.every(g => g.from && g.to && KINDS.has(g.kind) && typeof g.body === 'string' && Array.isArray(g.sources)),
    'labels: R27 edge fields (from,to,kind,body,sources[]) intact');

  // ---- 2. LABEL DISTRIBUTION (exact) ---------------------------------------
  const dist = { documented: 0, disputed: 0, debunked: 0, conspiracy: 0 };
  for (const g of CONFLUENCE_EDGES) dist[g.label]++;
  ok(dist.documented === 141, `labels: 141 documented (${dist.documented})`);
  ok(dist.disputed === 9, `labels: 9 disputed (${dist.disputed})`);
  ok(dist.debunked === 1, `labels: 1 debunked (${dist.debunked})`);
  ok(dist.conspiracy === 0, `labels: 0 conspiracy edges (${dist.conspiracy})`);

  // ---- 3. THE ONE DEBUNKED EDGE --------------------------------------------
  const deb = CONFLUENCE_EDGES.filter(g => g.label === 'debunked');
  ok(deb.length === 1 && deb[0].from === 'corpus-hermeticum' && deb[0].to === 'kybalion',
    'labels: the single debunked edge is corpus-hermeticum→kybalion');
  // its citation is the Deslippe definitive edition (verbatim witness present)
  ok(deb[0] && /Deslippe/.test(deb[0].bestCitation), 'labels: debunked edge cites Deslippe (Kybalion definitive edition)');

  // ---- 4. BIJECTION WITH THE VERIFIED edge-labels.json ---------------------
  {
    let rows = null;
    try { rows = JSON.parse(readFileSync(EDGE_LABELS_JSON, 'utf8')); } catch { /* scratchpad may be absent in a clean checkout */ }
    if (Array.isArray(rows)) {
      ok(rows.length === 151, `labels: edge-labels.json has 151 rows (${rows.length})`);
      const rowByKey = new Map(rows.map(r => [r.from + '|' + r.to + '|' + r.kind, r]));
      ok(rowByKey.size === 151, 'labels: edge-labels.json keys unique');
      let matched = 0, mismatchLabel = 0, mismatchCite = 0, mismatchNote = 0;
      for (const g of CONFLUENCE_EDGES) {
        const r = rowByKey.get(key(g));
        if (!r) continue;
        matched++;
        if (r.label !== g.label) mismatchLabel++;
        if (r.bestCitation !== g.bestCitation) mismatchCite++;
        if (r.note !== g.note) mismatchNote++;
      }
      ok(matched === 151, `labels: all 151 edges matched a label row (${matched})`);
      ok(mismatchLabel === 0, `labels: merged label === verified label (${mismatchLabel} drift)`);
      ok(mismatchCite === 0, `labels: merged bestCitation verbatim === verified (${mismatchCite} drift)`);
      ok(mismatchNote === 0, `labels: merged note verbatim === verified (${mismatchNote} drift)`);
      // reverse: every verified row was consumed by an edge
      const edgeKeys = new Set(CONFLUENCE_EDGES.map(key));
      const orphans = rows.filter(r => !edgeKeys.has(r.from + '|' + r.to + '|' + r.kind));
      ok(orphans.length === 0, `labels: every verified row consumed by an edge (${orphans.length} orphan rows)`);
    } else {
      // clean checkout without the scratchpad: assert self-consistency stands in
      ok(dist.documented + dist.disputed + dist.debunked + dist.conspiracy === 151,
        'labels: (scratchpad absent) self-consistent 151-edge label total');
    }
  }

  // ---- 5. LAYOUT PASSES THE LABEL THROUGH ----------------------------------
  {
    const lo = layoutConfluence({ zoom: 1, width: 1280 });
    ok(lo.edges.length === CONFLUENCE_EDGES.length, 'labels/layout: layout keeps every edge');
    ok(lo.edges.every(e => LABEL_ENUM.has(e.label)), 'labels/layout: every layout edge carries a legal label');
    const dataByKey = new Map(CONFLUENCE_EDGES.map(g => [key(g), g.label]));
    let through = 0;
    for (const e of lo.edges) { if (dataByKey.get(key(e)) === e.label) through++; }
    ok(through === lo.edges.length, `labels/layout: layout label === data label for every edge (${through}/${lo.edges.length})`);
    // determinism preserved with the new field on the layout edge
    const a = layoutConfluence({ zoom: 1, width: 1280 });
    const b = layoutConfluence({ zoom: 1, width: 1280 });
    ok(JSON.stringify(a) === JSON.stringify(b), 'labels/layout: layoutConfluence deterministic (label field included)');
    // the debunked + disputed edges survive layout with their labels
    ok(lo.edges.some(e => e.from === 'corpus-hermeticum' && e.to === 'kybalion' && e.label === 'debunked'),
      'labels/layout: debunked edge present in layout with its label');
    ok(lo.edges.filter(e => e.label === 'disputed').length === 9, 'labels/layout: 9 disputed edges in layout');
  }

  // ---- 6. RE-RUN THE 18 SHIPPED CONFLUENCE ASSERTS (still green) ------------
  {
    const CFL_LANE_IDS = ['christian', 'alchemy-west', 'kabbalah', 'islamic', 'confluence', 'yoga-vedanta', 'tantra-rasa', 'buddhist', 'daoist'];
    const KINDS_E = new Set(['text', 'person', 'event', 'translation', 'institution']);
    const LABELS = new Set(['documented', 'disputed', 'debunked', 'conspiracy']);
    ok(CONFLUENCE_ENTRIES.length === 188, 'confluence(18): 188 entries');
    ok(CONFLUENCE_LANES.length === 9 && CONFLUENCE_LANES.every((l, i) => l.id === CFL_LANE_IDS[i]), 'confluence(18): 9 lanes in fixed order');
    const slugs = new Set(CONFLUENCE_ENTRIES.map(e => e.slug));
    ok(slugs.size === CONFLUENCE_ENTRIES.length, 'confluence(18): slugs unique');
    ok(CONFLUENCE_EDGES.every(g => slugs.has(g.from) && slugs.has(g.to)), 'confluence(18): no dangling edge endpoints');
    ok(CONFLUENCE_ENTRIES.every(e => CFL_LANE_IDS.includes(e.lane) && KINDS_E.has(e.kind) && LABELS.has(e.label)), 'confluence(18): lane/kind/label in enum');
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
    ok(l1.nodes.length === CONFLUENCE_ENTRIES.length && l1.edges.length === CONFLUENCE_EDGES.length, 'confluence(18): places every node + edge');
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
//  DRIVES — Chromium sweep descriptors for the edge-label rendering. The
//  integrator translates these into scripts/browser-verify.mjs steps.
// ============================================================================
export const DRIVES = [
  { page: '/pages/confluence.html', width: 1280, actions: ['load'],
    asserts: ['no console errors',
      '.cfl-edge[data-label="debunked"] present (corpus-hermeticum→kybalion)',
      '.cfl-edge[data-label="disputed"] count === 9',
      '.cfl-edge-strike present on the debunked edge'] },
  { page: '/pages/confluence.html', width: 1280, emulate: 'prefers-reduced-motion:reduce',
    actions: ['hover the corpus-hermeticum→event-harran-sabians edge .cfl-edge-hit'],
    asserts: ['hover card visible', 'card shows a badge--disp "disputed" badge', 'card shows the "Cited." best-citation line'] },
  { page: '/pages/confluence.html#corpus-hermeticum', width: 1280, actions: ['coldload'],
    asserts: ['drawer open', 'Journeys list present', 'each journey line carries a badge--doc/disp/deb epistemic badge', 'a .cfl-jcite best-citation line under a journey'] },
  { page: '/pages/confluence.html', width: 1280, actions: ['set zoom 60%', 'observe the confluence spine'],
    asserts: ['disputed edges render faded (opacity ~.35)', 'no console errors', 'layout stable'] },
];
