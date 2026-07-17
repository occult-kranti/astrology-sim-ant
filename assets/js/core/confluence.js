// ============================================================================
//  core/confluence.js  ·  The Great Confluence — geometry & query engine (PURE)
//  (R27 "The Great Confluence"). No DOM, no network, no Date, no randomness.
//  All arithmetic for the atlas lives here so it is headless-testable; the app
//  layer (app/confluence.js) only paints what these functions return.
//
//  THE TIME AXIS IS VERTICAL: x = tradition lane, y = time (later is lower).
//  The scale is piecewise-linear and era-warped — within each band year→px is
//  linear (local distances truthful), and px-per-century steps up at explicit
//  era boundaries so modernity is legible without a lie. The warp is disclosed
//  on the map (every band states its own scale); it is never hidden.
// ============================================================================
import { CONFLUENCE_LANES, CONFLUENCE_ENTRIES, CONFLUENCE_EDGES } from './data/confluence.js';

// ---- the era-warped scale (timeline-design.md §2.2; exported + test-asserted)-
// Each band: linear year→px at pxPerCentury; boundaries chosen where history
// hinges and the data thins — NOT to equalise heights.
export const ERA_BANDS = [
  { id: 'antiquity', name: 'Deep antiquity', fromYear: -1500, toYear: -300, pxPerCentury: 30 },
  { id: 'classical', name: 'Classical & late antiquity', fromYear: -300, toYear: 600, pxPerCentury: 70 },
  { id: 'transmission', name: 'The transmission age', fromYear: 600, toYear: 1200, pxPerCentury: 110 },
  { id: 'scholastic', name: 'Scholastic & vernacular', fromYear: 1200, toYear: 1500, pxPerCentury: 160 },
  { id: 'earlymodern', name: 'Early modern', fromYear: 1500, toYear: 1800, pxPerCentury: 220 },
  { id: 'global', name: 'The global exchange', fromYear: 1800, toYear: 2020, pxPerCentury: 380 },
];

const YEAR_MIN = ERA_BANDS[0].fromYear;
const YEAR_MAX = ERA_BANDS[ERA_BANDS.length - 1].toYear;
const clampYear = y => y < YEAR_MIN ? YEAR_MIN : y > YEAR_MAX ? YEAR_MAX : y;
const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;

// unscaled band heights + cumulative tops (zoom applied on read)
const BAND_META = (() => {
  let top = 0;
  return ERA_BANDS.map(b => {
    const h = (b.toYear - b.fromYear) / 100 * b.pxPerCentury;
    const m = { ...b, topPx0: top, heightPx0: h };
    top += h;
    return m;
  });
})();
const TOTAL0 = BAND_META[BAND_META.length - 1].topPx0 + BAND_META[BAND_META.length - 1].heightPx0;

// tick label pitch: smallest of {100,200,300,500} whose scaled px ≥ 44
function labelStep(pxPerCentury, zoom) {
  for (const step of [100, 200, 300, 500]) if (step / 100 * pxPerCentury * zoom >= 44) return step;
  return 500;
}

export function timeScale(zoom = 1) {
  const z = zoom || 1;
  const totalHeight = TOTAL0 * z;

  const bands = BAND_META.map(b => ({
    id: b.id, name: b.name, fromYear: b.fromYear, toYear: b.toYear,
    pxPerCentury: b.pxPerCentury, topPx: b.topPx0 * z, heightPx: b.heightPx0 * z,
  }));

  const yearToPx = year => {
    const y = clampYear(year);
    for (const b of BAND_META) {
      if (y <= b.toYear) return (b.topPx0 + (y - b.fromYear) / 100 * b.pxPerCentury) * z;
    }
    return totalHeight;
  };

  const pxToYear = px => {
    const p = clamp(px, 0, totalHeight) / z;
    for (const b of BAND_META) {
      if (p <= b.topPx0 + b.heightPx0) return b.fromYear + (p - b.topPx0) / b.pxPerCentury * 100;
    }
    return YEAR_MAX;
  };

  // century ticks across the whole domain; major per band's label pitch
  const ticks = [];
  for (const b of BAND_META) {
    const step = labelStep(b.pxPerCentury, z);
    const start = Math.ceil(b.fromYear / 100) * 100;
    for (let y = start; y <= b.toYear; y += 100) {
      if (y === b.toYear && b.toYear !== YEAR_MAX) continue; // boundary owned by later band
      ticks.push({ year: y, px: yearToPx(y), major: ((y % step) + step) % step === 0 });
    }
  }

  return { yearToPx, pxToYear, totalHeight, bands, ticks, zoom: z };
}

// ---- lane index ------------------------------------------------------------
const LANE_BY_ID = new Map(CONFLUENCE_LANES.map(l => [l.id, l]));
const ENTRY_BY_SLUG = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e]));
const LANE_OF = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e.lane]));

// slugs that touch at least one cross-lane edge (source of the "crossings" view)
const CROSSING_SLUGS = (() => {
  const s = new Set();
  for (const g of CONFLUENCE_EDGES) {
    if (LANE_OF.get(g.from) !== LANE_OF.get(g.to)) { s.add(g.from); s.add(g.to); }
  }
  return s;
})();

// outgoing edges per slug (kept stable for deterministic threading)
const OUT_EDGES = (() => {
  const m = new Map();
  for (const g of CONFLUENCE_EDGES) {
    if (!m.has(g.from)) m.set(g.from, []);
    m.get(g.from).push(g);
  }
  return m;
})();

const RULER_W = 64;
const MARK = 14;      // node mark w/h (px)
const MIN_GAP = 22;   // min vertical centre-to-centre gap for same sub-track
const SUB_D_FRAC = 0.28; // sub-track offset as a fraction of lane width
const CLUSTER_SPAN = 28;  // px window that collapses into a "+N" pill (atlas §7.1)
// ---- painted-label geometry (atlas label-side flip + same-lane de-conflict) --
// The box convention is shared with the engine test: a label is chars*LABEL_CW
// wide (capped to the lane) × LABEL_H tall, anchored LABEL_INSET px from the mark
// centre on whichever side it takes (mirrors the CSS: .cfl-label sits 26px from
// the 24px node's left → 14px from the mark centre, clamped to --cfl-lane-w−30).
const LABEL_H = 24;      // label box height (px) — two wrapped lines at .66rem/1.15 (measured)
const LABEL_CW = 6.2;    // per-character width estimate (px)
const LABEL_INSET = 14;  // near-edge offset of the label box from the mark centre
const LABEL_EDGE_PAD = 2; // slack before a box is judged to overrun a frame edge

export const entryBySlug = slug => ENTRY_BY_SLUG.get(slug) || null;

// ============================================================================
//  ATLAS PHYSICS PURE MATH (UI3 · atlas §2, §4 — the app imports app/motion.js
//  for the spring solver; ONLY the atlas-specific pure math lives here, so the
//  zoom bridge, minimap, clustering, cards and search are engine-testable.)
// ============================================================================

// The three discrete layout levels the atlas renders at. `v` (continuous zoom)
// always settles to one of these; the world displays at s = v / L.
export const ZOOM_LEVELS = [0.6, 1, 1.6];
export const ZOOM_RANGE = { min: 0.5, max: 1.8 };       // hard clamp on v (no rubber)
// hysteresis for the mid-gesture rebase (atlas §4.4): re-render when the applied
// scale drifts past these bounds and input has been quiet for `quietMs`.
export const ZOOM_REBASE = { hi: 1.30, lo: 0.77, quietMs: 90 };

// nearest of ZOOM_LEVELS to v, measured in LOG space (perceptual midpoints).
// Midpoints: √0.6≈0.7746 between 0.6|1 ; √1.6≈1.2649 between 1|1.6.
export function nearestLevel(v) {
  const x = Math.log(v <= 0 ? ZOOM_RANGE.min : v);
  let best = ZOOM_LEVELS[0], bd = Infinity;
  for (const L of ZOOM_LEVELS) { const d = Math.abs(Math.log(L) - x); if (d < bd - 1e-12) { bd = d; best = L; } }
  return best;
}

// Zoom around an anchor with transform-origin 0 0 → pure scroll compensation
// (atlas §4.3). worldW/worldH are the UNSCALED layout dimensions; the applied
// content box is worldW*sNew × worldH*sNew. Deterministic + clamped.
export function zoomAnchor({ scrollLeft, scrollTop, px, py, sOld, sNew, worldW, worldH, vw, vh }) {
  const wx = (scrollLeft + px) / sOld;   // world point under the anchor (unscaled px)
  const wy = (scrollTop + py) / sOld;
  const maxL = Math.max(0, worldW * sNew - vw);
  const maxT = Math.max(0, worldH * sNew - vh);
  return {
    scrollLeft: clamp(wx * sNew - px, 0, maxL),
    scrollTop: clamp(wy * sNew - py, 0, maxT),
  };
}

// ---- layout: lanes → nodes → edges (deterministic, serialisable) -----------
export function layoutConfluence(opts = {}) {
  const zoom = opts.zoom || 1;
  const width = opts.width || 1280;
  const scale = timeScale(zoom);
  const laneW = (width - RULER_W) / CONFLUENCE_LANES.length;

  const lanes = CONFLUENCE_LANES.map((l, i) => {
    const x0 = RULER_W + i * laneW;
    return { id: l.id, name: l.name, glyph: l.glyph, side: l.side, x0, x1: x0 + laneW, cx: x0 + laneW / 2 };
  });
  const laneGeo = new Map(lanes.map(l => [l.id, l]));

  // sub-track x for a given row index: 0=centre, then out ±1, ±2 … (clamped in-lane)
  const rowOffsetIndex = row => row === 0 ? 0 : (row % 2 === 1 ? -Math.ceil(row / 2) : Math.ceil(row / 2));
  const rowX = (lane, row) => clamp(lane.cx + rowOffsetIndex(row) * laneW * SUB_D_FRAC,
    lane.x0 + MARK / 2, lane.x1 - MARK / 2);

  // greedy sub-track stacking per lane; entries already sorted (sortYear, slug)
  const rowLastY = new Map();   // laneId -> [lastY per row]
  const nodes = [];
  const nodeBySlug = new Map();
  for (const e of CONFLUENCE_ENTRIES) {
    const lane = laneGeo.get(e.lane);
    const y = scale.yearToPx(e.sortYear);
    let rows = rowLastY.get(e.lane);
    if (!rows) { rows = []; rowLastY.set(e.lane, rows); }
    let row = 0;
    while (row < rows.length && y - rows[row] < MIN_GAP) row++;
    rows[row] = y;
    const node = {
      slug: e.slug, laneId: e.lane, x: rowX(lane, row), y,
      y2: e.sortYearEnd != null ? scale.yearToPx(e.sortYearEnd) : null,
      row, w: MARK, h: MARK,
    };
    nodes.push(node);
    nodeBySlug.set(e.slug, node);
  }

  // edges: cubic Béziers with vertical tangents (leave downward, arrive downward)
  const edges = [];
  for (const g of CONFLUENCE_EDGES) {
    const a = nodeBySlug.get(g.from), b = nodeBySlug.get(g.to);
    if (!a || !b) continue; // never, post-merge; guarded for safety
    const x1 = a.x, y1 = a.y + MARK / 2;
    const x2 = b.x, y2 = b.y - MARK / 2;
    const k = clamp(Math.abs(y2 - y1) * 0.4, 24, 120);
    const c1x = x1, c1y = y1 + k, c2x = x2, c2y = y2 - k;
    // cubic point at t=0.5
    const midX = 0.125 * x1 + 0.375 * c1x + 0.375 * c2x + 0.125 * x2;
    const midY = 0.125 * y1 + 0.375 * c1y + 0.375 * c2y + 0.125 * y2;
    edges.push({ from: g.from, to: g.to, kind: g.kind, label: g.label || 'documented', x1, y1, x2, y2, c1x, c1y, c2x, c2y, midX, midY });
  }

  // ---- semantic-zoom clustering (atlas §7.1) --------------------------------
  // A function of the render level L (= zoom): near-cotemporal same-lane marks
  // collapse into a single "+N" pill so a marks-only view stays legible. Absorbed
  // nodes STAY in `nodes` (carry `clusterOf`) but are not painted by the app.
  const span = CLUSTER_SPAN * (zoom <= 0.6 ? 1.2 : 1); // eager at the compact level
  const clusters = [];
  const labelQuiet = new Set();
  const byLane = new Map();
  for (const n of nodes) { if (!byLane.has(n.laneId)) byLane.set(n.laneId, []); byLane.get(n.laneId).push(n); }

  // ---- painted-label placement: side flip (DEFECT 2) + de-conflict (DEFECT 3)
  // For a mark at world-x `x` carrying a label estimated `w` wide:
  //   • a RIGHT label spans [x+LABEL_INSET , x+LABEL_INSET+w]  → overruns the
  //     frame when its right edge passes `width`;
  //   • a LEFT  label spans [x−LABEL_INSET−w , x−LABEL_INSET]  → overruns the
  //     ruler gutter when its left edge passes RULER_W.
  const labelW = slug => { const e = ENTRY_BY_SLUG.get(slug); const chars = e ? e.title.length : 8;
    return Math.min(chars * LABEL_CW, Math.max(20, laneW - 30)); };
  const spillsRight = (x, w) => x + LABEL_INSET + w > width - LABEL_EDGE_PAD;
  const spillsLeft = (x, w) => x - LABEL_INSET - w < RULER_W + LABEL_EDGE_PAD;
  // the label box for a mark at (x,y) on `side`, nudged down by `dy`
  const boxFor = (x, y, side, dy, w) => ({
    xL: side === 'left' ? x - LABEL_INSET - w : x + LABEL_INSET,
    xR: side === 'left' ? x - LABEL_INSET : x + LABEL_INSET + w,
    yT: y + dy - LABEL_H / 2, yB: y + dy + LABEL_H / 2,
  });
  const boxHit = (a, b) => (Math.min(a.xR, b.xR) - Math.max(a.xL, b.xL) > 0) && (Math.min(a.yB, b.yB) - Math.max(a.yT, b.yT) > 0);

  for (const lane of lanes) {
    const arr = (byLane.get(lane.id) || []).slice().sort((a, b) => a.y - b.y || a.x - b.x);
    let i = 0;
    while (i < arr.length) {
      const group = [arr[i]];
      let j = i + 1;
      while (j < arr.length && arr[j].y - group[0].y < span) { group.push(arr[j]); j++; }
      if (group.length >= 3) {
        const sumY = group.reduce((s, g) => s + g.y, 0);
        const cy = Math.round(sumY / group.length);
        const id = `c-${lane.id}-${Math.round(group[0].y)}`;
        let contestedCount = 0;
        for (const g of group) { g.clusterOf = id; const e = ENTRY_BY_SLUG.get(g.slug); if (e && e.contested) contestedCount++; }
        clusters.push({
          id, laneId: lane.id, x: Math.round(lane.cx), y: cy,
          members: group.map(g => g.slug), count: group.length,
          contestedCount, label: '+' + group.length,
        });
      }
      i = j;
    }
    // painted (non-clustered) survivors, top-to-bottom, get a deterministic
    // label side + optional downward nudge, else are quieted (mark+hover only).
    const painted = arr.filter(n => !n.clusterOf);
    const kept = [];   // boxes actually painted in this lane, tested geometrically
    // minimum downward nudge that clears every already-kept box a candidate hits
    const clearDy = (x, y, side, w) => {
      const base = boxFor(x, y, side, 0, w);
      let bottom = base.yT;
      for (const b of kept) { if ((Math.min(b.xR, base.xR) - Math.max(b.xL, base.xL) > 0) && b.yB > bottom) bottom = b.yB; }
      return Math.ceil(Math.max(0, bottom - base.yT));
    };
    for (let k = 0; k < painted.length; k++) {
      const n = painted[k];
      const w = labelW(n.slug);
      const canRight = !spillsRight(n.x, w), canLeft = !spillsLeft(n.x, w);
      const nextY = k + 1 < painted.length ? painted[k + 1].y : Infinity;
      const maxDy = nextY - LABEL_H - n.y;    // stay clear of the next mark's own label row
      // ordered candidates: DEFECT 2 keeps RIGHT the default; LEFT is the flip /
      // alternate; a bounded downward nudge (DEFECT 3b) is the last resort before
      // quieting. A candidate that overruns its frame edge is dropped up front.
      const cands = [];
      if (canRight) cands.push(['right', 0]);
      if (canLeft) cands.push(['left', 0]);
      if (canRight) { const dy = clearDy(n.x, n.y, 'right', w); if (dy > 0 && dy <= maxDy) cands.push(['right', dy]); }
      if (canLeft) { const dy = clearDy(n.x, n.y, 'left', w); if (dy > 0 && dy <= maxDy) cands.push(['left', dy]); }
      let placed = null;
      for (const [side, dy] of cands) {
        const box = boxFor(n.x, n.y, side, dy, w);
        if (!kept.some(b => boxHit(b, box))) { placed = { side, dy, box }; break; }
      }
      if (placed) {
        n.labelSide = placed.side; n.labelDy = placed.dy; kept.push(placed.box);
      } else {
        // (c) nowhere clear → quiet the later label (mark + hover only survive)
        n.labelSide = canRight ? 'right' : 'left'; n.labelDy = 0; labelQuiet.add(n.slug);
      }
    }
  }

  return { scale, lanes, nodes, edges, clusters, labelQuiet, width, height: scale.totalHeight };
}

// ---- filtering (pure; returns visible slugs) -------------------------------
export function filterEntries(state = {}) {
  const laneSet = state.lanes && state.lanes.length ? new Set(state.lanes) : null;
  const kindSet = state.kinds && state.kinds.length ? new Set(state.kinds) : null;
  const labelSet = state.labels && state.labels.length ? new Set(state.labels) : null;
  const q = state.q ? String(state.q).toLowerCase().trim() : '';
  const out = [];
  for (const e of CONFLUENCE_ENTRIES) {
    if (laneSet && !laneSet.has(e.lane)) continue;
    if (kindSet && !kindSet.has(e.kind)) continue;
    if (labelSet && !labelSet.has(e.label)) continue;
    if (state.yearFrom != null && (e.sortYearEnd ?? e.sortYear) < state.yearFrom) continue;
    if (state.yearTo != null && e.sortYear > state.yearTo) continue;
    if (state.crossingsOnly && e.lane !== 'confluence' && !CROSSING_SLUGS.has(e.slug)) continue;
    if (q) {
      const hay = `${e.title} ${e.titleOriginal || ''} ${e.body} ${e.dateText} ${e.place || ''} ${e.sources.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    out.push(e.slug);
  }
  return out;
}

// ---- "follow this thread": deterministic forward chain ---------------------
// From an entry, repeatedly take the outgoing edge whose TARGET is
// chronologically next (sortYear, then slug); stop on a cycle.
export function threadFrom(slug) {
  if (!ENTRY_BY_SLUG.has(slug)) return { stops: [] };
  const stops = [{ slug, via: null }];
  const seen = new Set([slug]);
  let cur = slug;
  while (true) {
    const outs = (OUT_EDGES.get(cur) || []).slice().sort((p, q) => {
      const ep = ENTRY_BY_SLUG.get(p.to), eq = ENTRY_BY_SLUG.get(q.to);
      const yp = ep ? ep.sortYear : Infinity, yq = eq ? eq.sortYear : Infinity;
      return yp - yq || (p.to < q.to ? -1 : p.to > q.to ? 1 : 0);
    });
    const next = outs.find(g => !seen.has(g.to));
    if (!next) break;
    seen.add(next.to);
    stops.push({ slug: next.to, via: next });
    cur = next.to;
  }
  return { stops };
}

// ---- aggregate stats -------------------------------------------------------
export function confluenceStats() {
  const byLane = {}, byKind = {}, byLabel = {};
  for (const l of CONFLUENCE_LANES) byLane[l.id] = 0;
  let yearMin = Infinity, yearMax = -Infinity;
  for (const e of CONFLUENCE_ENTRIES) {
    byLane[e.lane] = (byLane[e.lane] || 0) + 1;
    byKind[e.kind] = (byKind[e.kind] || 0) + 1;
    byLabel[e.label] = (byLabel[e.label] || 0) + 1;
    if (e.sortYear < yearMin) yearMin = e.sortYear;
    const end = e.sortYearEnd ?? e.sortYear;
    if (end > yearMax) yearMax = end;
  }
  let crossLaneEdges = 0;
  for (const g of CONFLUENCE_EDGES) if (LANE_OF.get(g.from) !== LANE_OF.get(g.to)) crossLaneEdges++;
  return {
    entries: CONFLUENCE_ENTRIES.length, edges: CONFLUENCE_EDGES.length,
    byLane, byKind, byLabel, yearMin, yearMax, crossLaneEdges,
  };
}

// ============================================================================
//  MINIMAP MODEL (atlas §6.2 — pure, normalised 0..1, engine-tested)
// ============================================================================
// Two-letter era codes, in band order (atlas §6.1).
const ERA_CODE = { antiquity: 'DA', classical: 'CL', transmission: 'TR', scholastic: 'SC', earlymodern: 'EM', global: 'GL' };
// density → alpha tiers (atlas §6.1: .08/.16/.28/.45 by visible-entry count).
const MM_ALPHA = [0.08, 0.16, 0.28, 0.45];
const tierOf = (count, tiers) => count <= 0 ? -1 : count === 1 ? 0 : count === 2 ? 1 : count === 3 ? 2 : 3;

export function minimapModel(layout, visibleSlugs, opts = {}) {
  const rows = opts.rows || 48;
  const H = layout.height || 1;
  const vis = visibleSlugs instanceof Set ? visibleSlugs : new Set(visibleSlugs || []);
  const bands = layout.scale.bands.map(b => ({
    y: b.topPx / H, h: b.heightPx / H, label: ERA_CODE[b.id] || b.id.slice(0, 2).toUpperCase(),
  }));
  const laneIndex = new Map(layout.lanes.map((l, i) => [l.id, i]));
  // count visible entries per (lane, row)
  const counts = new Map(); // key `${laneIdx}|${row}` → count
  for (const n of layout.nodes) {
    if (!vis.has(n.slug)) continue;
    const li = laneIndex.get(n.laneId); if (li == null) continue;
    let row = Math.floor((n.y / H) * rows);
    if (row < 0) row = 0; if (row >= rows) row = rows - 1;
    const key = li + '|' + row;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const cells = [];
  for (const [key, count] of counts) {
    const [li, row] = key.split('|').map(Number);
    const tier = tierOf(count, MM_ALPHA);
    cells.push({ laneIdx: li, row, y: row / rows, h: 1 / rows, count, alpha: MM_ALPHA[tier] });
  }
  cells.sort((a, b) => a.laneIdx - b.laneIdx || a.row - b.row);
  return { bands, cells, height: 1 };
}

// ============================================================================
//  LANE DENSITY WASH (atlas §9.1 — per lane×band quartile alpha in [.03,.12])
// ============================================================================
const WASH_ALPHA = [0.03, 0.06, 0.09, 0.12];

export function laneDensity(layout, visibleSlugs) {
  const vis = visibleSlugs instanceof Set ? visibleSlugs : new Set(visibleSlugs || (layout.nodes.map(n => n.slug)));
  const bands = layout.scale.bands;
  const counts = new Map(); // `${laneId}|${bandIdx}` → count
  const yearOf = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e.sortYear]));
  for (const n of layout.nodes) {
    if (!vis.has(n.slug)) continue;
    const yr = yearOf.get(n.slug);
    let bi = bands.findIndex(b => yr >= b.fromYear && yr < b.toYear);
    if (bi < 0) bi = yr < bands[0].fromYear ? 0 : bands.length - 1;
    const key = n.laneId + '|' + bi;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const out = [];
  for (const lane of layout.lanes) {
    for (let bi = 0; bi < bands.length; bi++) {
      const c = counts.get(lane.id + '|' + bi) || 0;
      if (c === 0) continue;
      const tier = tierOf(c, WASH_ALPHA);
      out.push({
        laneId: lane.id, bandIndex: bi, x0: lane.x0, x1: lane.x1,
        y: bands[bi].topPx, h: bands[bi].heightPx, count: c, tier, alpha: WASH_ALPHA[tier],
      });
    }
  }
  return out;
}

// ============================================================================
//  CARD BUILDERS (atlas §8 — pure; render-only truncation of locked prose)
// ============================================================================
// Sentence-boundary truncation of a body string; never splits a word; ≤ max.
export function excerpt(body, max = 140) {
  const s = String(body == null ? '' : body).trim();
  if (s.length <= max) return s;
  const window = s.slice(0, max + 1);
  // prefer the last sentence boundary within the window
  const mEnd = window.match(/[.!?][»”"')\]]?\s/g);
  if (mEnd) {
    const idx = window.lastIndexOf(mEnd[mEnd.length - 1]);
    const end = idx + mEnd[mEnd.length - 1].length - 1; // include the punctuation, drop the space
    if (end >= 40) return s.slice(0, end).trim();
  }
  // else cut at the last word boundary and add an ellipsis (stays ≤ max)
  let cut = s.lastIndexOf(' ', max - 1);
  if (cut < 40) cut = max - 1;
  return s.slice(0, cut).trim() + '…';
}

// incident edges per slug (both directions) for the journeys mini-timeline
const INCIDENT = (() => {
  const m = new Map();
  for (const g of CONFLUENCE_EDGES) {
    if (!m.has(g.from)) m.set(g.from, []);
    if (!m.has(g.to)) m.set(g.to, []);
    m.get(g.from).push({ partner: g.to, dir: 'out', kind: g.kind });
    m.get(g.to).push({ partner: g.from, dir: 'in', kind: g.kind });
  }
  return m;
})();
const SPARK_MIN = -1500, SPARK_MAX = 2020;
const sparkX = year => clamp((clampYear(year) - SPARK_MIN) / (SPARK_MAX - SPARK_MIN), 0, 1);

// {self:x, ticks:[{x,dir}]} — a 0..1 linear-time strip of a node + its partners.
export function edgeSparkline(slug) {
  const e = ENTRY_BY_SLUG.get(slug);
  const self = e ? sparkX(e.sortYear) : 0;
  const inc = INCIDENT.get(slug) || [];
  const ticks = inc.map(x => {
    const pe = ENTRY_BY_SLUG.get(x.partner);
    return { x: pe ? sparkX(pe.sortYear) : 0, dir: x.dir, partner: x.partner };
  }).sort((a, b) => a.x - b.x || (a.partner < b.partner ? -1 : 1));
  return { self, ticks };
}

// ============================================================================
//  SEARCH (atlas §10 — pure ranked query; title-prefix > title-substring > body)
// ============================================================================
export function searchEntries(q, limit = 12) {
  const query = String(q == null ? '' : q).toLowerCase().trim();
  if (!query) return [];
  const scored = [];
  for (const e of CONFLUENCE_ENTRIES) {
    const title = e.title.toLowerCase();
    const orig = (e.titleOriginal || '').toLowerCase();
    let rank;
    if (title.startsWith(query) || orig.startsWith(query)) rank = 0;
    else if (title.includes(query) || orig.includes(query)) rank = 1;
    else {
      const hay = `${e.body} ${e.dateText} ${e.place || ''} ${(e.sources || []).join(' ')}`.toLowerCase();
      if (hay.includes(query)) rank = 2; else continue;
    }
    scored.push({ e, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || a.e.sortYear - b.e.sortYear || (a.e.slug < b.e.slug ? -1 : a.e.slug > b.e.slug ? 1 : 0));
  return scored.slice(0, limit).map(s => s.e);
}
