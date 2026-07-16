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

export const entryBySlug = slug => ENTRY_BY_SLUG.get(slug) || null;

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
    edges.push({ from: g.from, to: g.to, kind: g.kind, x1, y1, x2, y2, c1x, c1y, c2x, c2y, midX, midY });
  }

  return { scale, lanes, nodes, edges, width, height: scale.totalHeight };
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
