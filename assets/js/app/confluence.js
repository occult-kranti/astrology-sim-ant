// ============================================================================
//  confluence.js (app) — THE GREAT CONFLUENCE atlas (pages/confluence.html).
//  All geometry lives in the pure engine core/confluence.js; this file only
//  PAINTS its output and wires interaction. It measures the container width,
//  asks layoutConfluence({zoom,width}) for fully-resolved lanes/nodes/edges,
//  and renders:
//   • an aria-hidden SVG underlay — era zebra, lane washes/rules, ruler ticks,
//     date-certainty bands and ALL transmission arcs;
//   • an HTML node layer — one <button> per entry (roving tabindex, arrow-key
//     lane/time navigation, Enter opens the drawer);
//   • a detail drawer (contested positions verbatim, technique described-never-
//     prescribed, journeys, sources, siteLink CTA);
//   • a single-column Ledger (accessible / mobile / print view of the same data);
//   • a "follow this thread" walk of connected transmissions;
//   • the shared divination-assistant panel (kind:'confluence').
//  Honest framing is locked: influence documented, never validated; every fact
//  is cited; contested claims show both positions, never resolved.
//  DOM only here — no geometry arithmetic; the engine owns all of it.
// ============================================================================
import { CONFLUENCE_LANES, CONFLUENCE_ENTRIES, CONFLUENCE_EDGES } from '../core/data/confluence.js';
import { layoutConfluence, filterEntries, entryBySlug, threadFrom, confluenceStats,
  minimapModel, laneDensity, excerpt, edgeSparkline, searchEntries } from '../core/confluence.js';
import { createConfluenceNav } from './confluence-nav.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const KINDS = ['text', 'person', 'event', 'translation', 'institution'];
const KIND_GLYPH = { text: '▮', person: '●', event: '◆', translation: '◎', institution: '⌂' };
const LABELS = ['documented', 'disputed', 'debunked', 'conspiracy'];
const LABEL_CSS = { documented: 'doc', disputed: 'disp', debunked: 'deb', conspiracy: 'con' };
const CERT_PHRASE = {
  year: 'dated to the year', decade: 'dated to its decade', century: 'dated only to the century',
  range: 'composed over a range', contested: 'date contested ⚑',
};
const ZOOMS = [0.6, 1, 1.6];
const LANE_ORDER = CONFLUENCE_LANES.map(l => l.id);
const LANE_META = new Map(CONFLUENCE_LANES.map(l => [l.id, l]));

// scripts that read right-to-left (Arabic/Hebrew title originals) — for lang/dir
const RTL_LANES = new Set(['islamic', 'kabbalah']);
const LANG_BY_LANE = { kabbalah: 'he', islamic: 'ar', 'yoga-vedanta': 'sa', 'tantra-rasa': 'sa', daoist: 'zh', buddhist: 'sa' };

const entryMap = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e]));
const getEntry = slug => entryMap.get(slug) || entryBySlug(slug) || null;

// incident edges per slug (drawer Journeys + node journey count + hover)
const incident = new Map();
for (const e of CONFLUENCE_EDGES) {
  if (!incident.has(e.from)) incident.set(e.from, []);
  if (!incident.has(e.to)) incident.set(e.to, []);
  incident.get(e.from).push(e); incident.get(e.to).push(e);
}
const journeyCount = slug => (incident.get(slug) || []).length;

// ---- SVG marker defs (context-stroke → marker paints in the edge's colour) --
const MARKERS = `
  <marker id="cfl-m-tri" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke"/></marker>
  <marker id="cfl-m-chev" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 5 L0 10" fill="none" stroke="context-stroke" stroke-width="1.6"/></marker>
  <marker id="cfl-m-bar" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 0 L1 10" fill="none" stroke="context-stroke" stroke-width="1.8"/></marker>`;
const MARKER_FOR = { translation: 'tri', synthesis: 'tri', adaptation: 'tri', influence: 'chev', commentary: 'chev', refutation: 'bar' };

function markSvg(kind) {
  const g = 'class="cfl-shape"';
  if (kind === 'person') return `<svg viewBox="0 0 14 14"><circle ${g} cx="7" cy="7" r="5.5"/></svg>`;
  if (kind === 'event') return `<svg viewBox="0 0 14 14"><rect ${g} x="2.2" y="2.2" width="9.6" height="9.6" transform="rotate(45 7 7)"/></svg>`;
  if (kind === 'translation') return `<svg viewBox="0 0 14 14"><circle ${g} cx="4.6" cy="7" r="4.4"/><circle ${g} cx="9.4" cy="7" r="4.4"/></svg>`;
  if (kind === 'institution') return `<svg viewBox="0 0 14 14"><path ${g} d="M1.5 6 L7 1 L12.5 6 L12.5 13 L1.5 13 Z"/></svg>`;
  // text (default): a book — upright rect + inset spine line
  return `<svg viewBox="0 0 14 14"><rect ${g} x="2.5" y="0.6" width="9" height="12.8" rx="1"/><line ${g} x1="4.4" y1="2" x2="4.4" y2="12"/></svg>`;
}

// ---------- module state ----------------------------------------------------
const state = {
  zoom: 1, mode: 'atlas',
  lanes: new Set(LANE_ORDER), kinds: new Set(KINDS), labels: new Set(LABELS),
  yearFrom: null, yearTo: null, crossingsOnly: false, q: '',
};
let layout = null;                 // current layoutConfluence() output
const layoutCache = new Map();     // key `zoom|width` → layout
let laneMap = new Map();           // laneId → lane {x0,x1,cx,side}
let nodesBySlug = new Map();       // slug → node {x,y,y2,laneId,row}
let laneNodes = new Map();         // laneId → [slug] sorted by y
let allByY = [];                   // [slug] sorted by y (Home/End)
let visibleSet = new Set(CONFLUENCE_ENTRIES.map(e => e.slug));
let focusSlug = null;              // roving tabindex holder (a slug OR a cluster id)
let selectedSlug = null;           // open drawer entry
let thread = null;                 // { stops:[{slug,via}], i }
let entered = false;               // one-time entrance guard
let nav = null;                    // the physics/nav state machine (confluence-nav.js)
let clusterById = new Map();       // clusterId → cluster model
let slugToCluster = new Map();     // absorbed slug → clusterId
let mmModel = null;                // current minimapModel()
let pinnedCard = false;            // one pinned hover card at a time
let clusterListOpen = null;        // clusterId whose member list is open in the drawer
const isCluster = id => clusterById.has(id);
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(currentConfluenceReport()); } catch { /* non-fatal */ } } };
const motionOK = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: no-preference)').matches;
const forcedLedger = () => typeof matchMedia === 'function' && matchMedia('(max-width: 719px)').matches;

// ---------- helpers ---------------------------------------------------------
// A "token" is either an entry slug (painted node) or a cluster id (a +N pill);
// nodeEl resolves whichever exists so the roving keyboard model spans both.
const nodeEl = token => {
  const over = $('cfl-over'); if (!over) return null;
  return over.querySelector(`.cfl-node[data-slug="${token}"]`) || over.querySelector(`.cfl-cluster[data-cluster="${token}"]`);
};
const laneW = () => (layout && layout.lanes[0]) ? (layout.lanes[0].x1 - layout.lanes[0].x0) : 120;
const tickLabel = y => y < 0 ? `${Math.abs(y)} BCE` : `${y === 0 ? 1 : y} CE`;
function filterState() {
  return {
    lanes: [...state.lanes], kinds: [...state.kinds], labels: [...state.labels],
    yearFrom: state.yearFrom, yearTo: state.yearTo, crossingsOnly: state.crossingsOnly, q: state.q,
  };
}
function bandIndexForPx(px) {
  const b = layout.scale.bands;
  for (let i = 0; i < b.length; i++) if (px >= b[i].topPx && px < b[i].topPx + b[i].heightPx) return i;
  return px < b[0].topPx ? 0 : b.length - 1;
}
function measureWidth() {
  const sc = $('cfl-scroll');
  return Math.max(360, Math.round(sc ? sc.clientWidth : 1280));
}
// Publish the sticky toolbar's real height into --cfl-toolbar-h so the ledger's
// sticky era strip pins just below the header + toolbar chain (it wraps to a
// different height per width, so a fixed token can't track it). No-JS renders
// keep the 3.1rem fallback in the CSS.
function syncToolbarHeight() {
  const tb = $('cfl-toolbar'), page = document.querySelector('.cfl-page');
  if (tb && page) page.style.setProperty('--cfl-toolbar-h', tb.offsetHeight + 'px');
}
function getLayout() {
  const width = measureWidth();
  const key = `${state.zoom}|${width}`;
  if (layoutCache.has(key)) return layoutCache.get(key);
  const lo = layoutConfluence({ zoom: state.zoom, width });
  layoutCache.set(key, lo);
  return lo;
}

// ============================================================================
//  RENDER — SVG underlay
// ============================================================================
function buildUnder(lo) {
  const s = lo.scale;
  let bands = '', lanes = '', wash = '', ticks = '';
  s.bands.forEach((b, i) => {
    if (i % 2 === 1) bands += `<rect class="cfl-era-band" x="0" y="${b.topPx}" width="${lo.width}" height="${b.heightPx}"/>`;
  });
  // lane density wash (atlas §9.1): per lane×band, alpha by quartile — replaces
  // the flat full-height wash; a finding aid disclosed on the minimap tooltip.
  for (const d of laneDensity(lo, null)) {
    wash += `<rect class="cfl-lane-wash cfl-wash-${d.tier + 1}" data-lane="${esc(d.laneId)}" x="${d.x0}" y="${d.y}" width="${d.x1 - d.x0}" height="${d.h}"/>`;
  }
  for (const L of lo.lanes) {
    if (L.side === 'spine') {
      // the gold spine, framed: two hairlines 3 px apart on each edge (§9.2)
      lanes += `<line class="cfl-spine-rule" x1="${L.x0}" y1="0" x2="${L.x0}" y2="${lo.height}"/>`
        + `<line class="cfl-spine-rule cfl-spine-rule-2" x1="${L.x0 + 3}" y1="0" x2="${L.x0 + 3}" y2="${lo.height}"/>`
        + `<line class="cfl-spine-rule" x1="${L.x1}" y1="0" x2="${L.x1}" y2="${lo.height}"/>`
        + `<line class="cfl-spine-rule cfl-spine-rule-2" x1="${L.x1 - 3}" y1="0" x2="${L.x1 - 3}" y2="${lo.height}"/>`;
    } else {
      lanes += `<line class="cfl-lane-rule" x1="${L.x0}" y1="0" x2="${L.x0}" y2="${lo.height}"/>`;
    }
  }
  for (const t of s.ticks) {
    ticks += `<line class="cfl-tick${t.major ? ' cfl-tick-major' : ''}" x1="0" y1="${t.px}" x2="${lo.width}" y2="${t.px}"/>`;
  }
  return `<defs>${MARKERS}</defs>${bands}${wash}${lanes}${ticks}${buildCert(lo)}<g class="cfl-edges" id="cfl-edges">${buildEdges(lo)}</g>`;
}

// The century ruler as an instrument scale (§9.5): tick labels move OUT of the
// SVG into the sticky-left #cfl-ruler gutter so dates survive horizontal scroll,
// plus a per-era "century bracket" whose height IS 100 y of that band — the warp
// is seen. Rendered in unscaled world px (the world transform scales it).
function buildRuler(lo) {
  const s = lo.scale;
  let out = '';
  for (const t of s.ticks) {
    if (!t.major) continue;
    out += `<span class="cfl-ruler-label" style="top:${t.px}px">${esc(tickLabel(t.year))}</span>`;
  }
  // one century bracket per band (spanning exactly 100 y of that band's px)
  for (const b of s.bands) {
    const y0 = s.yearToPx(b.fromYear), y100 = s.yearToPx(Math.min(b.fromYear + 100, b.toYear));
    const h = Math.max(6, y100 - y0);
    out += `<span class="cfl-century-bracket" style="top:${y0}px;height:${h}px" title="one century in ${esc(b.name)}"><span class="cfl-century-label">100 y</span></span>`;
  }
  return out;
}

// Lane headers move into #cfl-lane-strip (sticky top:0) — WP-10.1 for free.
function buildLaneStrip(lo) {
  let out = '';
  for (const L of lo.lanes) {
    const m = LANE_META.get(L.id) || { name: L.name, glyph: L.glyph };
    const cnt = CONFLUENCE_ENTRIES.filter(e => e.lane === L.id).length;
    out += `<button type="button" class="cfl-lane-head" data-lane="${esc(L.id)}" aria-pressed="true"`
      + ` style="left:${L.x0}px;width:${L.x1 - L.x0}px" title="${esc(m.name)} — click to hide/show this lane">`
      + `<span class="cfl-lane-glyph" aria-hidden="true">${esc(m.glyph)}</span>`
      + `<span class="cfl-lane-name">${esc(m.name)}</span>`
      + `<span class="cfl-lane-count">${cnt}</span></button>`;
  }
  return out;
}

function buildCert(lo) {
  const yToPx = lo.scale.yearToPx;
  let out = '';
  for (const n of lo.nodes) {
    const e = getEntry(n.slug); if (!e) continue;
    const L = laneMap.get(n.laneId); if (!L) continue;
    const x0 = L.x0 + 3, w = (L.x1 - L.x0) - 6;
    const cert = e.dateCertainty;
    if (cert === 'decade') {
      const yA = yToPx(e.sortYear - 5), yB = yToPx(e.sortYear + 5);
      out += `<rect class="cfl-cert-band" x="${x0}" y="${Math.min(yA, yB)}" width="${w}" height="${Math.abs(yB - yA) || 4}" rx="4"/>`;
    } else if (cert === 'century') {
      const cs = Math.floor(e.sortYear / 100) * 100;
      const yA = yToPx(cs), yB = yToPx(cs + 100);
      out += `<rect class="cfl-cert-band" x="${x0}" y="${Math.min(yA, yB)}" width="${w}" height="${Math.abs(yB - yA) || 6}" rx="4"/>`;
    } else if (cert === 'range') {
      const yB = (n.y2 != null) ? n.y2 : (e.sortYearEnd != null ? yToPx(e.sortYearEnd) : n.y);
      out += `<rect class="cfl-cert-capsule" data-lane="${esc(n.laneId)}" x="${n.x - 2}" y="${Math.min(n.y, yB)}" width="4" height="${Math.abs(yB - n.y) || 4}" rx="2"/>`;
    }
    if (cert === 'contested') out += `<circle class="cfl-cert-ring" cx="${n.x}" cy="${n.y}" r="9"/>`;
  }
  return out;
}

function buildEdges(lo) {
  let out = '';
  for (const ed of lo.edges) {
    const d = `M ${ed.x1} ${ed.y1} C ${ed.c1x} ${ed.c1y} ${ed.c2x} ${ed.c2y} ${ed.x2} ${ed.y2}`;
    const marker = MARKER_FOR[ed.kind] || 'chev';
    const label = ed.label || 'documented';
    const bead = ed.kind === 'synthesis' && ed.midX != null
      ? `<circle class="cfl-edge-bead" cx="${ed.midX}" cy="${ed.midY}" r="3"/>` : '';
    // epistemic texture: the label grades the TRANSMISSION CLAIM (atlas WP-3d).
    // disputed → a ⚑ affordance at mid-path (edge itself faded via CSS);
    // debunked/conspiracy → a strike-motif crossbar (faint via CSS), never hidden.
    let mark = '';
    if (ed.midX != null) {
      if (label === 'disputed') {
        mark = `<text class="cfl-edge-flag" x="${ed.midX.toFixed(1)}" y="${(ed.midY + 4).toFixed(1)}" text-anchor="middle" aria-hidden="true">⚑</text>`;
      } else if (label === 'debunked' || label === 'conspiracy') {
        mark = `<line class="cfl-edge-strike" x1="${(ed.midX - 8).toFixed(1)}" y1="${ed.midY.toFixed(1)}" x2="${(ed.midX + 8).toFixed(1)}" y2="${ed.midY.toFixed(1)}"/>`;
      }
    }
    out += `<g class="cfl-edge" data-from="${esc(ed.from)}" data-to="${esc(ed.to)}" data-kind="${esc(ed.kind)}" data-label="${esc(label)}">`
      + `<path class="cfl-edge-hit" d="${d}"/>`
      + `<path class="cfl-edge-line" pathLength="1" d="${d}" marker-end="url(#cfl-m-${marker})"/>`
      + bead + mark + `</g>`;
  }
  return out;
}

// ============================================================================
//  RENDER — HTML over layer (era headers, lane headers, node buttons)
// ============================================================================
function buildOver(lo) {
  let out = '';
  // era header rows at each band top (whisper repeat mid-band on very tall bands)
  lo.scale.bands.forEach((b, i) => {
    const scale = i === 0
      ? `one century ≈ ${Math.round(b.pxPerCentury)} px here — the map stretches as it nears the present`
      : `one century ≈ ${Math.round(b.pxPerCentury)} px here`;
    out += `<div class="cfl-era-head" id="cfl-era-${i}" style="top:${b.topPx}px;width:${lo.width}px">`
      + `${esc(b.name)} · ${esc(rangeText(b))} · <span class="cfl-era-scale">${esc(scale)}</span></div>`;
    if (b.heightPx > 2 * (nav ? 700 : 700)) {
      out += `<div class="cfl-era-whisper" style="top:${b.topPx + b.heightPx / 2}px;width:${lo.width}px" aria-hidden="true">${esc(b.name)}</div>`;
    }
  });
  const quiet = lo.labelQuiet || new Set();
  // painted nodes (absorbed ones carry clusterOf and are drawn as a pill instead)
  for (const n of lo.nodes) {
    if (n.clusterOf) continue;
    const e = getEntry(n.slug); if (!e) continue;
    // label side + downward nudge are decided by the pure layout (DEFECT 2/3):
    // labelSide 'left' flips the label off the frame edge; labelDy de-conflicts
    // stacked same-lane labels. Fall back to the old sub-track heuristic only if
    // an older layout without these fields is ever handed in.
    const L = laneMap.get(n.laneId);
    const flip = n.labelSide ? n.labelSide === 'left' : (L && n.x > L.cx + 4);
    const labelStyle = n.labelDy ? ` style="top:calc(50% + ${n.labelDy}px)"` : '';
    const eraI = bandIndexForPx(n.y);
    const contested = !!e.contested;
    const flag = contested ? ` <span class="cfl-flag" title="${esc(disputeNote(e))}">⚑</span>` : '';
    out += `<button type="button" class="cfl-node${flip ? ' is-flip' : ''}${quiet.has(n.slug) ? ' is-quiet' : ''}" id="cfl-${esc(n.slug)}"`
      + ` data-slug="${esc(n.slug)}" data-lane="${esc(e.lane)}" data-kind="${esc(e.kind)}"`
      + ` data-label="${esc(e.label)}" data-cert="${esc(e.dateCertainty)}" tabindex="-1"`
      + ` style="left:${n.x - 12}px;top:${n.y - 12}px;--era-i:${eraI}"`
      + ` aria-label="${esc(nodeAria(e))}">`
      + `<span class="cfl-mark" aria-hidden="true">${markSvg(e.kind)}</span>`
      + `<span class="cfl-label"${labelStyle}>${esc(e.title)}${flag}</span></button>`;
  }
  // cluster pills (a "+N" per collapsed run; opens a list of its members)
  for (const c of (lo.clusters || [])) {
    out += `<button type="button" class="cfl-cluster" data-cluster="${esc(c.id)}" data-lane="${esc(c.laneId)}"`
      + ` tabindex="-1" style="left:${c.x - 17}px;top:${c.y - 11}px" aria-label="${esc(clusterAria(c))}">`
      + `<span class="cfl-cluster-n">${c.count}</span>`
      + (c.contestedCount > 0 ? `<span class="cfl-cluster-c">${c.contestedCount}⚑</span>` : '') + `</button>`;
  }
  return out;
}
function clusterAria(c) {
  const lane = (LANE_META.get(c.laneId) || {}).name || c.laneId;
  const yr = layout ? Math.round(layout.scale.pxToYear(c.y)) : null;
  const when = yr == null ? '' : (yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`);
  return `${c.count} entries near ${when} in the ${lane} lane`
    + (c.contestedCount > 0 ? `, ${c.contestedCount} with contested dates` : '') + ' — opens a list';
}

function rangeText(b) {
  return `${tickLabel(b.fromYear)}–${tickLabel(b.toYear)}`;
}
function nodeAria(e) {
  const phrase = CERT_PHRASE[e.dateCertainty] || '';
  const jc = journeyCount(e.slug);
  const lane = (LANE_META.get(e.lane) || {}).name || e.lane;
  return `${e.title} — ${e.kind}, ${lane} lane, ${e.dateText} (${phrase}), ${e.label}. ${jc} journey${jc === 1 ? '' : 's'}.`;
}
function disputeNote(e) {
  if (!e.contested) return '';
  const c = e.contested;
  const pos = (c.positions || []).map(p => `${p.value} (${p.source})`).join(' | ');
  return `${c.flag || 'The sources disagree.'} — ${pos}`.trim();
}

// ============================================================================
//  MAIN RENDER
// ============================================================================
function renderAtlas(opts = {}) {
  layout = getLayout();
  laneMap = new Map(layout.lanes.map(L => [L.id, L]));
  nodesBySlug = new Map(layout.nodes.map(n => [n.slug, n]));
  // cluster maps (a function of the render level)
  clusterById = new Map((layout.clusters || []).map(c => [c.id, c]));
  slugToCluster = new Map();
  for (const n of layout.nodes) if (n.clusterOf) slugToCluster.set(n.slug, n.clusterOf);

  // roving token model = painted nodes + cluster pills, ordered by y within a lane
  laneNodes = new Map(LANE_ORDER.map(id => [id, []]));
  const tokens = [];
  for (const n of layout.nodes) { if (!n.clusterOf) tokens.push({ token: n.slug, laneId: n.laneId, y: n.y, x: n.x }); }
  for (const c of (layout.clusters || [])) tokens.push({ token: c.id, laneId: c.laneId, y: c.y, x: c.x });
  tokens.sort((a, b) => a.y - b.y || a.x - b.x);
  for (const t of tokens) if (laneNodes.has(t.laneId)) laneNodes.get(t.laneId).push(t.token);
  allByY = tokens.map(t => t.token);

  const atlas = $('cfl-atlas'), under = $('cfl-under'), over = $('cfl-over');
  const hadFocus = over.contains(document.activeElement);   // preserve focus across the innerHTML swap
  atlas.style.width = layout.width + 'px';
  atlas.style.height = layout.height + 'px';
  atlas.setAttribute('data-zoom', String(state.zoom));
  under.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
  under.setAttribute('width', layout.width);
  under.setAttribute('height', layout.height);
  over.style.setProperty('--cfl-lane-w', laneW() + 'px');
  under.innerHTML = buildUnder(layout);
  over.innerHTML = buildOver(layout);
  const strip = $('cfl-lane-strip'); if (strip) { strip.style.width = layout.width + 'px'; strip.innerHTML = buildLaneStrip(layout); }
  const ruler = $('cfl-ruler'); if (ruler) ruler.innerHTML = buildRuler(layout);

  // roving tabindex: keep the last focus; if it was absorbed, move it to the
  // absorbing pill (never strand focus — §7.4); else the first token.
  if (!tokenExists(focusSlug)) focusSlug = slugToCluster.get(focusSlug) || allByY[0] || null;
  const first = focusSlug && nodeEl(focusSlug);
  if (first) { first.tabIndex = 0; if (hadFocus) first.focus(); }   // never strand focus (§7.4)

  applyFilters();
  updateEraReadout();
  paintMinimapCells();
  if (selectedSlug) { const abs = slugToCluster.get(selectedSlug); const sel = nodeEl(selectedSlug) || (abs && nodeEl(abs)); if (sel) sel.classList.add('is-selected'); highlightIncident(selectedSlug); }
  if (thread) paintThread();
  if (nav) nav.applyScale();

  // materialize the fresh marks on a level swap (opacity only, motion-gated §7.3)
  if (opts.materialize && motionOK()) {
    over.querySelectorAll('.cfl-node, .cfl-cluster').forEach(el => el.classList.add('is-materializing'));
    setTimeout(() => over.querySelectorAll('.is-materializing').forEach(el => el.classList.remove('is-materializing')), 180);
  }
  // one-time entrance choreography — only where motion is welcome
  if (!entered && motionOK()) {
    atlas.classList.add('is-entering');
    setTimeout(() => atlas.classList.remove('is-entering'), 720);
  }
  entered = true;
}
const tokenExists = t => (t != null) && (nodesBySlug.has(t) && !slugToCluster.has(t) || clusterById.has(t));
const tokenLane = t => isCluster(t) ? clusterById.get(t).laneId : (nodesBySlug.get(t) || {}).laneId;
const tokenY = t => isCluster(t) ? clusterById.get(t).y : (nodesBySlug.get(t) || {}).y;
const tokenX = t => isCluster(t) ? clusterById.get(t).x : (nodesBySlug.get(t) || {}).x;

// ============================================================================
//  FILTERS — never re-layout; toggle visibility only (design §6.1)
// ============================================================================
function applyFilters() {
  const vis = new Set(filterEntries(filterState()));
  visibleSet = vis;
  const over = $('cfl-over'), edges = $('cfl-edges');
  if (over) over.querySelectorAll('.cfl-node').forEach(btn => { btn.hidden = !vis.has(btn.dataset.slug); });
  // cluster pills: hide only when ALL members are filtered out; partial → "k/N"
  if (over) over.querySelectorAll('.cfl-cluster').forEach(pill => {
    const c = clusterById.get(pill.dataset.cluster); if (!c) return;
    const shown = c.members.filter(s => vis.has(s)).length;
    pill.hidden = shown === 0;
    const n = pill.querySelector('.cfl-cluster-n');
    if (n) n.textContent = shown === c.count ? String(c.count) : `${shown}/${c.count}`;
  });
  let crossings = 0;
  if (edges) edges.querySelectorAll('.cfl-edge').forEach(g => {
    const on = vis.has(g.dataset.from) && vis.has(g.dataset.to);
    g.hidden = !on; if (on) crossings++;
  });
  updateCount(vis.size, crossings);
  syncLaneChrome();
  paintMinimapCells();
  if (state.mode === 'ledger') renderLedger(vis);
  notifyReport();
}
function updateCount(nEntries, nCross) {
  const c = $('cfl-count');
  if (c) c.textContent = `${nEntries} of ${CONFLUENCE_ENTRIES.length} entries · ${nCross} of ${CONFLUENCE_EDGES.length} crossings`;
}
function syncLaneChrome() {
  const strip = $('cfl-lane-strip'); if (!strip) return;
  strip.querySelectorAll('.cfl-lane-head').forEach(h => {
    h.setAttribute('aria-pressed', state.lanes.has(h.dataset.lane) ? 'true' : 'false');
  });
}

// ============================================================================
//  HIGHLIGHT — hover / focus lights a path, dims the rest (class toggles only)
// ============================================================================
function markRelated(set, except) {
  const over = $('cfl-over'); if (!over) return;
  over.querySelectorAll('.cfl-node.is-related').forEach(n => n.classList.remove('is-related'));
  set.forEach(s => { if (s !== except) { const n = nodeEl(s); if (n) n.classList.add('is-related'); } });
}
function highlightIncident(slug) {
  const edges = $('cfl-edges'); if (!edges) return;
  edges.classList.add('has-hot');
  const related = new Set();
  edges.querySelectorAll('.cfl-edge').forEach(g => {
    const hot = !g.hidden && (g.dataset.from === slug || g.dataset.to === slug);
    g.classList.toggle('edge-hot', hot);
    if (hot) { related.add(g.dataset.from); related.add(g.dataset.to); }
  });
  markRelated(related, slug);
}
function highlightEdge(g) {
  const edges = $('cfl-edges'); if (!edges) return;
  edges.classList.add('has-hot');
  edges.querySelectorAll('.cfl-edge').forEach(x => x.classList.toggle('edge-hot', x === g));
  markRelated(new Set([g.dataset.from, g.dataset.to]));
}
function clearHighlight() {
  if (thread) return;                        // thread mode owns the highlight
  if (selectedSlug) { highlightIncident(selectedSlug); return; }
  const edges = $('cfl-edges'); if (!edges) return;
  edges.classList.remove('has-hot');
  edges.querySelectorAll('.edge-hot').forEach(g => g.classList.remove('edge-hot'));
  markRelated(new Set());
}

// ============================================================================
//  TOOLTIP
// ============================================================================
let tipHideTimer = null;
function showTip(html, x, y, opts = {}) {
  const tip = $('cfl-tip'); if (!tip) return;
  if (pinnedCard && !opts.force) return;                 // a pinned card owns the surface
  clearTimeout(tipHideTimer);
  tip.className = 'cfl-tip cfl-card' + (opts.wide ? ' cfl-card-wide' : '');
  tip.innerHTML = html; tip.hidden = false;
  tip.classList.remove('is-pinned');
  const w = tip.offsetWidth, h = tip.offsetHeight;
  // prefer the right of the anchor; flip left near the edge; never under the pointer
  let px = x + 14, py = y - 8;
  if (px + w > innerWidth - 8) px = x - w - 18;
  if (py + h > innerHeight - 8) py = innerHeight - h - 8;
  tip.style.left = Math.max(8, px) + 'px'; tip.style.top = Math.max(8, py) + 'px';
  const pin = tip.querySelector('.cfl-card-pin'); if (pin) pin.onclick = () => pinCard();
}
// Delayed hide so the pointer can cross the small gap from node to card to reach
// the ⌖ pin without the card vanishing (§8.4 flicker guard). The card's own
// mouseenter cancels the timer; mouseleave hides at once.
function hideTip() {
  if (pinnedCard) return;
  clearTimeout(tipHideTimer);
  tipHideTimer = setTimeout(() => { if (!pinnedCard) { const t = $('cfl-tip'); if (t) t.hidden = true; } }, 180);
}
function pinCard() {
  const tip = $('cfl-tip'); if (!tip || tip.hidden) return;
  pinnedCard = true;
  tip.classList.add('is-pinned'); tip.style.pointerEvents = 'auto';
  const pin = tip.querySelector('.cfl-card-pin');
  if (pin) { pin.innerHTML = '✕'; pin.setAttribute('aria-label', 'Unpin this card'); pin.onclick = unpinCard; }
}
function unpinCard() {
  pinnedCard = false;
  const tip = $('cfl-tip'); if (tip) { tip.classList.remove('is-pinned'); tip.style.pointerEvents = ''; tip.hidden = true; }
}
// the journeys mini-timeline (§8.2 #3) — a 168×22 linear-scale strip
function sparkSvg(slug) {
  const sp = edgeSparkline(slug);
  const W = 168, H = 22, ax = 14;
  let ticks = '';
  const capped = sp.ticks.length > 11 ? sp.ticks.slice(0, 11) : sp.ticks;
  for (const t of capped) {
    const x = 1 + t.x * (W - 2);
    if (t.dir === 'out') ticks += `<line class="cfl-spark-out" x1="${x.toFixed(1)}" y1="4" x2="${x.toFixed(1)}" y2="${ax - 1}"/>`;
    else ticks += `<line class="cfl-spark-in" x1="${x.toFixed(1)}" y1="${ax + 1}" x2="${x.toFixed(1)}" y2="${H - 1}"/>`;
  }
  const selfX = (1 + sp.self * (W - 2)).toFixed(1);
  const more = sp.ticks.length > 11 ? `<text class="cfl-spark-more" x="${W - 2}" y="9" text-anchor="end">+${sp.ticks.length - 11}</text>` : '';
  return `<svg class="cfl-spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">`
    + `<line class="cfl-spark-axis" x1="0" y1="${ax}" x2="${W}" y2="${ax}"/>`
    + `${ticks}<line class="cfl-spark-self" x1="${selfX}" y1="1" x2="${selfX}" y2="${H - 1}"/>${more}</svg>`
    + `<span class="cfl-spark-cap">linear scale · −1500 … 2020</span>`;
}
function journeysRow(slug) {
  const inc = incident.get(slug) || []; if (!inc.length) return '';
  const byKind = {};
  for (const ed of inc) byKind[ed.kind] = (byKind[ed.kind] || 0) + 1;
  const parts = Object.keys(byKind).slice(0, 4).map(k => `${k === 'refutation' ? 'argued against' : k} ${byKind[k]}`);
  return `<p class="cfl-card-journeys">↳ ${esc(parts.join(' · '))}</p>`;
}
function pinBtn() { return `<button type="button" class="cfl-card-pin" aria-label="Pin this card">⌖</button>`; }
function nodeTip(e) {
  const lane = (LANE_META.get(e.lane) || {}).name || e.lane;
  const script = e.titleOriginal ? `<span class="cfl-card-orig" lang="${esc(LANG_BY_LANE[e.lane] || '')}"${RTL_LANES.has(e.lane) ? ' dir="rtl"' : ''}>${esc(e.titleOriginal)}</span>` : '';
  const flag = e.contested ? ' <span class="cfl-flag">⚑</span>' : '';
  return pinBtn()
    + `<div class="cfl-card-title">${esc(e.title)}${flag}</div>${script}`
    + `<div class="cfl-card-meta">${esc(e.dateText)} · ${esc(CERT_PHRASE[e.dateCertainty] || '')} · ${esc(lane)}</div>`
    + sparkSvg(e.slug)
    + `<p class="cfl-card-excerpt">${esc(excerpt(e.body, 140))}</p>`
    + journeysRow(e.slug)
    + `<div class="cfl-card-foot"><span class="badge badge--${LABEL_CSS[e.label]}">${esc(e.label)}</span>`
    + `<span class="cfl-card-hint">Enter opens · t follows the thread · click ⌖ to pin</span></div>`;
}
function edgeTip(g) {
  const ed = edgeObj(g);
  const a = getEntry(g.dataset.from), b = getEntry(g.dataset.to);
  const kind = g.dataset.kind === 'refutation' ? 'argued against' : g.dataset.kind;
  const label = (ed && ed.label) || g.dataset.label || 'documented';
  const cite = ed && ed.bestCitation ? `<div class="cfl-card-cite"><b>Cited.</b> ${esc(ed.bestCitation)}</div>` : '';
  return pinBtn()
    + `<div class="cfl-card-title">${esc(a ? a.title : g.dataset.from)} <span class="cfl-card-kind">—${esc(kind)}→</span> ${esc(b ? b.title : g.dataset.to)}</div>`
    + `<div class="cfl-card-label"><span class="badge badge--${LABEL_CSS[label]}">${esc(label)}</span>`
    + `<span class="cfl-card-labelnote">the transmission claim</span></div>`
    + (ed && ed.body ? `<p class="cfl-card-excerpt">${esc(excerpt(ed.body, 140))}</p>` : '')
    + cite;
}
function clusterTip(c) {
  const lane = (LANE_META.get(c.laneId) || {}).name || c.laneId;
  const yr = layout ? Math.round(layout.scale.pxToYear(c.y)) : 0;
  const when = yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  const titles = c.members.slice(0, 5).map(s => { const e = getEntry(s); return `<li>${esc(e ? e.title : s)}</li>`; }).join('');
  const more = c.count > 5 ? `<li class="muted">…and ${c.count - 5} more</li>` : '';
  return pinBtn()
    + `<div class="cfl-card-title">${c.count} texts${c.contestedCount ? ` · ${c.contestedCount} contested` : ''}</div>`
    + `<div class="cfl-card-meta">${esc(lane)} lane · near ${esc(when)}</div>`
    + `<ul class="cfl-card-list">${titles}${more}</ul>`;
}
function edgeObj(g) {
  return CONFLUENCE_EDGES.find(e => e.from === g.dataset.from && e.to === g.dataset.to && e.kind === g.dataset.kind) || null;
}

// ============================================================================
//  DRAWER
// ============================================================================
function drawerHTML(e) {
  const inc = incident.get(e.slug) || [];
  const journeys = inc.length ? `
    <h3 style="margin:.6rem 0 .2rem;font-size:1rem">Journeys <span class="small muted">(${inc.length})</span></h3>
    <ul class="cfl-journeys">${inc.map(ed => journeyLine(ed, e.slug)).join('')}</ul>` : '';
  const followBtn = inc.some(ed => ed.from === e.slug) || inc.length
    ? `<button type="button" class="btn-quiet sm cfl-follow" data-thread="${esc(e.slug)}">Follow this thread ▸</button>` : '';
  const contested = e.contested ? contestedPanel(e.contested) : '';
  const technique = e.technique ? `
    <div class="cfl-tech"><div class="cfl-tech-head">Technique — described, never prescribed</div>
      <p style="margin:.3rem 0 0">${esc(e.technique)}</p></div>` : '';
  const scriptLine = e.titleOriginal ? `<p class="cfl-script" lang="${esc(LANG_BY_LANE[e.lane] || '')}"${RTL_LANES.has(e.lane) ? ' dir="rtl"' : ''}>${esc(e.titleOriginal)}</p>` : '';
  const site = e.siteLink ? `<a class="btn" href="${esc(e.siteLink.href)}">${esc(e.siteLink.label)} →</a>` : '';
  const lane = LANE_META.get(e.lane) || { name: e.lane, glyph: '' };
  return `
    <button type="button" class="cfl-drawer-close" id="cfl-drawer-close" aria-label="Close detail">✕</button>
    <div class="cfl-sheet-handle" aria-hidden="true"></div>
    <div class="panel-head" style="margin-bottom:.4rem">
      <span class="panel-status"><span class="badge badge--plain">${esc(KIND_GLYPH[e.kind] || '')} ${esc(e.kind)}</span></span>
      <span class="panel-title" style="font-size:1rem;grid-row:1">
        <span class="cfl-lanechip" data-lane="${esc(e.lane)}"><span class="cfl-dot"></span>${esc(lane.glyph)} ${esc(lane.name)}</span>
        <span class="badge badge--${LABEL_CSS[e.label]}">${esc(e.label)}</span></span>
    </div>
    <h2 class="panel-title" style="margin:.2rem 0 0">${esc(e.title)}${e.contested ? ` <span class="cfl-flag" title="${esc(disputeNote(e))}">⚑</span>` : ''}</h2>
    ${scriptLine}
    <p class="panel-meta">${esc(e.dateText)} · ${esc(CERT_PHRASE[e.dateCertainty] || '')}${e.place ? ` · ${esc(e.place)}` : ''}</p>
    ${contested}
    <p style="max-width:var(--measure)">${esc(e.body)}</p>
    ${technique}
    ${journeys}
    <p style="margin:.4rem 0 0">${followBtn}</p>
    <div class="cfl-src"><b>Sources.</b> ${(e.sources || []).map(esc).join('; ')}</div>
    <div class="cfl-cta">
      ${site}
      <a class="btn-quiet" href="chronology/index.html">Read this era in the Chronology</a>
      <button type="button" class="btn-quiet" id="cfl-copy" data-slug="${esc(e.slug)}">Copy link</button>
    </div>`;
}
function journeyLine(ed, slug) {
  const out = ed.from === slug;
  const partner = getEntry(out ? ed.to : ed.from);
  const arrow = out ? '→' : '←';
  const label = ed.label || 'documented';
  const badge = `<span class="badge badge--${LABEL_CSS[label]} cfl-jbadge" title="the transmission claim is ${esc(label)}">${esc(label)}</span>`;
  const cite = ed.bestCitation ? `<div class="cfl-jcite">${esc(ed.bestCitation)}</div>` : '';
  return `<li><span class="cfl-jkind">${arrow} ${esc(ed.kind)} ${arrow}</span> ${badge}
    <a href="#${esc(out ? ed.to : ed.from)}" class="cfl-jlink" data-slug="${esc(out ? ed.to : ed.from)}">${esc(partner ? partner.title : (out ? ed.to : ed.from))}</a>
    ${ed.body ? `<div class="small muted">${esc(ed.body)}</div>` : ''}${cite}</li>`;
}
function contestedPanel(c) {
  const pos = (c.positions || []).map(p =>
    `<div class="cfl-pos">${esc(p.value)}<cite>${esc(p.source || '')}</cite></div>`).join('');
  return `<div class="callout cfl-contested"><span class="label">The sources disagree ⚑</span>
    ${c.flag ? `<p style="margin:.2rem 0 .3rem">${esc(c.flag)}</p>` : ''}${pos}</div>`;
}

function openDrawer(slug, opts = {}) {
  const e = getEntry(slug); if (!e) { toast('No such entry on the map.'); return; }
  // deep-link relaxation: relax ONLY the axes hiding it (never a blunt reset)
  if (!visibleSet.has(slug)) { relaxFiltersFor(slug); }
  selectedSlug = slug;
  const dr = $('cfl-drawer');
  dr.innerHTML = drawerHTML(e);
  dr.hidden = false;
  $('cfl-stage').classList.add('drawer-open');
  const mobile = matchMedia('(max-width: 1099px)').matches;
  if (mobile) {
    dr.setAttribute('role', 'dialog'); dr.setAttribute('aria-modal', 'true');
    $('cfl-scrim').hidden = false; document.documentElement.style.overflow = 'hidden';
  } else {
    dr.setAttribute('role', 'complementary'); dr.removeAttribute('aria-modal');
  }
  wireDrawer();
  // node selection + highlight (if absorbed, mark the ABSORBING pill — §7.4)
  $('cfl-over').querySelectorAll('.is-selected').forEach(n => n.classList.remove('is-selected'));
  const abs = slugToCluster.get(slug);
  const node = nodeEl(slug) || (abs && nodeEl(abs));
  if (node) {
    node.classList.add('is-selected');
    if (motionOK()) { node.classList.add('is-pulsing'); setTimeout(() => node.classList.remove('is-pulsing'), 340); }
  }
  highlightIncident(slug);
  if (!opts.silent) history.replaceState(null, '', '#' + slug);
  try { autolinkResultPanels(['cfl-drawer']); } catch { /* non-fatal */ }
  const close = $('cfl-drawer-close'); if (close && !opts.keepFocus) close.focus();
  notifyReport();
}
function closeDrawer() {
  const dr = $('cfl-drawer'); if (!dr || dr.hidden) return;
  clusterListOpen = null;
  dr.hidden = true; dr.innerHTML = '';
  $('cfl-stage').classList.remove('drawer-open');
  $('cfl-scrim').hidden = true; document.documentElement.style.overflow = '';
  const node = selectedSlug && nodeEl(selectedSlug);
  selectedSlug = null;
  clearHighlight();
  $('cfl-over').querySelectorAll('.is-selected').forEach(n => n.classList.remove('is-selected'));
  history.replaceState(null, '', location.pathname + location.search);
  if (node) node.focus();
  notifyReport();
}
function wireDrawer() {
  const dr = $('cfl-drawer');
  const close = $('cfl-drawer-close'); if (close) close.addEventListener('click', closeDrawer);
  dr.querySelectorAll('.cfl-jlink').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault(); const s = a.dataset.slug;
    if (state.mode === 'ledger') { scrollLedgerTo(s); openDrawer(s); } else { scrollNodeToCenter(s); openDrawer(s); }
  }));
  const follow = dr.querySelector('.cfl-follow'); if (follow) follow.addEventListener('click', () => startThread(follow.dataset.thread));
  const copy = $('cfl-copy'); if (copy) copy.addEventListener('click', () => copyLink(copy.dataset.slug));
}
function copyLink(slug) {
  const url = location.origin + location.pathname + '#' + slug;
  const done = () => toast('Link copied — ' + url);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => toast(url));
  else toast(url);
}
let toastTimer = null;
function toast(msg) {
  const t = $('cfl-toast'); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

// ============================================================================
//  FOLLOW THIS THREAD (design §4.5)
// ============================================================================
function startThread(slug) {
  const res = threadFrom(slug);
  if (!res || !res.stops || res.stops.length < 2) { toast('No connected thread from here.'); return; }
  thread = { stops: res.stops, i: 0 };
  paintThread();
  renderThreadPanel();
  notifyReport();
}
function paintThread() {
  const over = $('cfl-over'), edges = $('cfl-edges'); if (!over || !edges) return;
  over.classList.add('is-threading');
  over.querySelectorAll('.is-threaded').forEach(n => n.classList.remove('is-threaded'));
  over.querySelectorAll('.cfl-medallion').forEach(m => m.remove());
  const chain = new Set(thread.stops.map(s => s.slug));
  thread.stops.forEach((s, idx) => {
    const n = nodeEl(s.slug); if (!n) return;
    n.classList.add('is-threaded');
    const med = document.createElement('span'); med.className = 'cfl-medallion'; med.textContent = idx + 1;
    n.appendChild(med);
  });
  edges.classList.add('has-hot');
  edges.querySelectorAll('.cfl-edge').forEach(g => {
    const on = chain.has(g.dataset.from) && chain.has(g.dataset.to)
      && thread.stops.some(s => s.via && s.via.from === g.dataset.from && s.via.to === g.dataset.to && s.via.kind === g.dataset.kind);
    g.classList.toggle('edge-hot', on);
  });
  history.replaceState(null, '', '#thread=' + thread.stops[0].slug);
}
function renderThreadPanel() {
  const dr = $('cfl-drawer');
  const stops = thread.stops.map((s, i) => {
    const e = getEntry(s.slug);
    return `<li class="${i === thread.i ? 'is-current' : ''}"><a href="#${esc(s.slug)}" class="cfl-jlink" data-stop="${i}">${i + 1}. ${esc(e ? e.title : s.slug)}</a>
      ${s.via ? `<span class="cfl-jkind"> · ${esc(s.via.kind)}</span>` : ''}</li>`;
  }).join('');
  dr.innerHTML = `
    <button type="button" class="cfl-drawer-close" id="cfl-drawer-close" aria-label="Leave thread">✕</button>
    <div class="cfl-sheet-handle" aria-hidden="true"></div>
    <h2 class="panel-title" style="margin:.1rem 0 .3rem;font-size:1.2rem">Following a thread</h2>
    <p class="small muted">A deterministic chronological chain of documented transmissions. Step with the buttons or the <b>n</b> / <b>p</b> keys.</p>
    <ol class="cfl-thread-stops">${stops}</ol>
    <div class="cfl-thread-nav">
      <button type="button" class="btn-secondary sm" id="cfl-thread-prev">‹ prev</button>
      <button type="button" class="btn-secondary sm" id="cfl-thread-next">next ›</button>
      <button type="button" class="btn-quiet sm" id="cfl-thread-leave">Leave thread</button>
    </div>`;
  dr.hidden = false;
  $('cfl-stage').classList.add('drawer-open');
  $('cfl-drawer-close').addEventListener('click', exitThread);
  $('cfl-thread-leave').addEventListener('click', exitThread);
  $('cfl-thread-prev').addEventListener('click', () => stepThread(-1));
  $('cfl-thread-next').addEventListener('click', () => stepThread(1));
  dr.querySelectorAll('.cfl-jlink').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault(); thread.i = +a.dataset.stop; focusStop();
  }));
  focusStop();
}
function stepThread(d) {
  if (!thread) return;
  thread.i = Math.max(0, Math.min(thread.stops.length - 1, thread.i + d));
  focusStop();
}
function focusStop() {
  if (!thread) return;
  const s = thread.stops[thread.i];
  scrollNodeToCenter(s.slug);
  $('cfl-drawer').querySelectorAll('.cfl-thread-stops li').forEach((li, i) => li.classList.toggle('is-current', i === thread.i));
}
function exitThread() {
  if (!thread) return;
  thread = null;
  const over = $('cfl-over'); if (over) { over.classList.remove('is-threading'); over.querySelectorAll('.cfl-medallion').forEach(m => m.remove()); over.querySelectorAll('.is-threaded').forEach(n => n.classList.remove('is-threaded')); }
  closeDrawer();
  clearHighlight();
  notifyReport();
}

// ============================================================================
//  SCROLL helpers (native scroll only — no drag-pan, no hijack)
// ============================================================================
// Fly a token (a slug OR a cluster id) to the viewport centre via the nav.
function scrollNodeToCenter(token, source) {
  if (isCluster(token)) { const c = clusterById.get(token); if (c && nav) nav.flyTo({ worldX: c.x, worldY: c.y }, { source: source || 'legacy' }); return; }
  if (nav) nav.flyTo({ slug: token }, { source: source || 'legacy' });
}
function focusNode(token) {
  const n = nodeEl(token); if (!n) return;
  if (focusSlug && nodeEl(focusSlug)) nodeEl(focusSlug).tabIndex = -1;
  focusSlug = token; n.tabIndex = 0; n.focus();
  n.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// ============================================================================
//  KEYBOARD navigation (design §6.5)
// ============================================================================
const tokenVisible = t => isCluster(t) ? (clusterById.get(t).members.some(s => visibleSet.has(s))) : visibleSet.has(t);
function nearestInLane(laneId, y) {
  const arr = (laneNodes.get(laneId) || []).filter(tokenVisible);
  let best = null, bd = Infinity;
  for (const s of arr) { const d = Math.abs(tokenY(s) - y); if (d < bd) { bd = d; best = s; } }
  return best;
}
function adjacentLane(laneId, dir) {
  let i = LANE_ORDER.indexOf(laneId) + dir;
  while (i >= 0 && i < LANE_ORDER.length) {
    const id = LANE_ORDER[i];
    if (state.lanes.has(id) && (laneNodes.get(id) || []).some(tokenVisible)) return id;
    i += dir;
  }
  return null;
}
function onOverKeydown(ev) {
  const tok = focusSlug; if (!tok) return;
  const lane = tokenLane(tok); if (lane == null) return;
  const laneArr = (laneNodes.get(lane) || []).filter(tokenVisible);
  const idx = laneArr.indexOf(tok);
  const y = tokenY(tok);
  let handled = true;
  switch (ev.key) {
    case 'ArrowDown': if (idx >= 0 && idx < laneArr.length - 1) focusNode(laneArr[idx + 1]); break;
    case 'ArrowUp': if (idx > 0) focusNode(laneArr[idx - 1]); break;
    case 'ArrowRight': { const L = adjacentLane(lane, 1); const t = L && nearestInLane(L, y); if (t) focusNode(t); break; }
    case 'ArrowLeft': { const L = adjacentLane(lane, -1); const t = L && nearestInLane(L, y); if (t) focusNode(t); break; }
    case 'Home': { const t = allByY.find(tokenVisible); if (t) focusNode(t); break; }
    case 'End': { const t = [...allByY].reverse().find(tokenVisible); if (t) focusNode(t); break; }
    case 'PageDown': jumpEra(1); break;
    case 'PageUp': jumpEra(-1); break;
    case 'Enter': case ' ': activateToken(tok); break;
    case 't': case 'T': if (!isCluster(tok)) startThread(tok); break;
    case 'n': case 'N': if (thread) stepThread(1); break;
    case 'p': case 'P': if (thread) stepThread(-1); break;
    case '+': case '=': if (nav) nav.zoomStep(1); break;
    case '-': case '_': if (nav) nav.zoomStep(-1); break;
    case 'Escape': onEscape(); break;
    default: handled = false;
  }
  if (handled) ev.preventDefault();
}
function activateToken(tok) { if (isCluster(tok)) openClusterList(tok); else openDrawer(tok, { keepFocus: false }); }
// Esc priority (§8.4): pinned card → thread → drawer/cluster-list → highlight
function onEscape() {
  if (pinnedCard) { unpinCard(); return; }
  if (thread) { exitThread(); return; }
  if (clusterListOpen) { const id = clusterListOpen; closeDrawer(); const pill = nodeEl(id); if (pill) pill.focus(); return; }
  if (selectedSlug) { closeDrawer(); return; }
  clearHighlight();
}
function jumpEra(dir) {
  if (!layout || !nav) return;
  const centerYear = nav.centerYear();
  const bands = layout.scale.bands;
  let bi = bands.findIndex(b => centerYear >= b.fromYear && centerYear < b.toYear);
  if (bi < 0) bi = 0;
  bi = Math.max(0, Math.min(bands.length - 1, bi + dir));
  nav.flyTo({ worldY: bands[bi].topPx + 8 }, { source: 'key' });
}

// ============================================================================
//  ZOOM (re-render at a new scale; re-anchor the viewport-centre year)
// ============================================================================
// The nav (confluence-nav.js) owns the zoom bridge; the app only exposes a
// level-writer + a re-render hook it can call at a rebase/settle.
function setLevel(L) {
  state.zoom = L;
  try { sessionStorage.setItem('cfl-zoom', String(L)); } catch { /* ignore */ }
  const zl = $('cfl-zoom-label'); if (zl) zl.textContent = Math.round(L * 100) + '%';
}

// ============================================================================
//  LEDGER — single column, grouped by era band (accessible / mobile / print)
// ============================================================================
function renderLedger(vis) {
  if (!layout) layout = getLayout();
  const host = $('cfl-ledger'); if (!host) return;
  const bands = layout.scale.bands;
  const shown = [...CONFLUENCE_ENTRIES].filter(e => vis.has(e.slug)).sort((a, b) => a.sortYear - b.sortYear || a.slug.localeCompare(b.slug));
  if (!shown.length) { host.innerHTML = `<p class="muted" style="padding:1rem 0">Nothing matches — every entry is hidden by the current lane, kind, label or century filters. <button type="button" class="btn-quiet" id="cfl-ledger-reset">Reset the filters</button> to see all ${CONFLUENCE_ENTRIES.length} entries.</p>`; const r = $('cfl-ledger-reset'); if (r) r.addEventListener('click', resetAll); return; }
  let html = '', bi = -1;
  for (const e of shown) {
    const eb = bands.findIndex(b => e.sortYear >= b.fromYear && e.sortYear < b.toYear);
    const b = bands[eb < 0 ? bands.length - 1 : eb];
    if (eb !== bi) {
      bi = eb;
      html += `<h3 class="cfl-ledger-era">${esc(b.name)} <span class="cfl-era-scale">· ${esc(rangeText(b))} — the map's arcs live in each entry's Journeys</span></h3>`;
    }
    const flag = e.contested ? ` <span class="cfl-flag" title="${esc(disputeNote(e))}">⚑</span>` : '';
    html += `<button type="button" class="cfl-row" data-slug="${esc(e.slug)}" id="cfl-row-${esc(e.slug)}" data-lane="${esc(e.lane)}" data-label="${esc(e.label)}">
      <span class="cfl-dot" aria-hidden="true"></span>
      <span class="cfl-row-date">${esc(e.dateText)}</span>
      <span class="cfl-mark" aria-hidden="true">${markSvg(e.kind)}</span>
      <span class="cfl-row-title">${esc(e.title)}${flag}</span>
      <span class="badge badge--${LABEL_CSS[e.label]}">${esc(e.label)}</span></button>`;
  }
  host.innerHTML = html;
  host.querySelectorAll('.cfl-row').forEach(r => r.addEventListener('click', () => openDrawer(r.dataset.slug)));
}
function scrollLedgerTo(slug) {
  const r = $('cfl-row-' + slug); if (r) r.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' });
}

// ============================================================================
//  MODE (atlas / ledger) + responsive force
// ============================================================================
function setMode(mode) {
  if (mode === 'atlas' && forcedLedger()) mode = 'ledger';
  state.mode = mode;
  const instr = $('cfl-instrument'); if (instr) instr.hidden = mode !== 'atlas';
  const led = $('cfl-ledger'); led.hidden = mode !== 'ledger';
  if (mode === 'atlas') renderMinimap();
  $('cfl-mode').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
  if (mode === 'ledger') renderLedger(visibleSet);
}

// ============================================================================
//  ERA readout (the always-visible current-era label)
// ============================================================================
// The ambient era pill (§9.6) + minimap lens. Driven directly by the viewport
// 'scroll' event — NO requestAnimationFrame (the atlas owns zero rAF outside the
// motion.js conductor; scroll writes are cheap and read only scrollTop).
function updateEraReadout() {
  if (!layout) return;
  const el = $('cfl-era-current'); if (!el) return;
  const centerYear = nav ? nav.centerYear() : layout.scale.bands[0].fromYear;
  const bands = layout.scale.bands;
  let bi = bands.findIndex(bb => centerYear >= bb.fromYear && centerYear < bb.toYear);
  if (bi < 0) bi = centerYear < bands[0].fromYear ? 0 : bands.length - 1;
  const b = bands[bi];
  const dots = bands.map((_, i) => `<span class="cfl-era-dot${i <= bi ? ' is-on' : ''}"></span>`).join('');
  el.innerHTML = `<span class="cfl-era-name">${esc(b.name)} · ${esc(rangeText(b))}</span><span class="cfl-era-dots" aria-hidden="true">${dots}</span>`;
}
function onScroll() { updateEraReadout(); paintMinimapLens(); }

// ============================================================================
//  RESET
// ============================================================================
function resetFilters() {
  state.lanes = new Set(LANE_ORDER); state.kinds = new Set(KINDS); state.labels = new Set(LABELS);
  state.yearFrom = null; state.yearTo = null; state.crossingsOnly = false; state.q = '';
  const set = (id, val) => { const s = $(id); if (s) s.value = val; };
  set('cfl-from', ''); set('cfl-to', '');
  const cr = $('cfl-crossings'); if (cr) cr.setAttribute('aria-pressed', 'false');
  document.querySelectorAll('#cfl-lanes .chip-toggle, #cfl-kinds .chip-toggle, #cfl-labels .chip-toggle')
    .forEach(c => c.setAttribute('aria-pressed', 'true'));
  applyFilters();
}
function resetAll() { resetFilters(); }

// ============================================================================
//  TOOLBAR build + wiring
// ============================================================================
function buildToolbar() {
  // lane chips
  $('cfl-lanes').innerHTML = CONFLUENCE_LANES.map(l =>
    `<button type="button" class="chip-toggle" data-lane="${esc(l.id)}" aria-pressed="true" title="${esc(l.name)}">
      <span class="cfl-dot"></span><span class="cfl-kglyph" aria-hidden="true">${esc(l.glyph)}</span>${esc(shortLane(l.name))}</button>`).join('');
  // kind chips
  $('cfl-kinds').innerHTML = KINDS.map(k =>
    `<button type="button" class="chip-toggle" data-kind="${esc(k)}" aria-pressed="true"><span class="cfl-kglyph" aria-hidden="true">${esc(KIND_GLYPH[k])}</span>${esc(k)}</button>`).join('');
  // label chips
  $('cfl-labels').innerHTML = LABELS.map(l =>
    `<button type="button" class="chip-toggle" data-label="${esc(l)}" aria-pressed="true"><span class="badge badge--${LABEL_CSS[l]}">${esc(l)}</span></button>`).join('');
  // century range selects
  const opts = ['<option value="">— start —</option>'];
  const optsB = ['<option value="">— end —</option>'];
  for (let y = -1500; y <= 2000; y += 100) { opts.push(`<option value="${y}">${esc(tickLabel(y))}</option>`); optsB.push(`<option value="${y}">${esc(tickLabel(y))}</option>`); }
  $('cfl-from').innerHTML = opts.join(''); $('cfl-to').innerHTML = optsB.join('');
}
function shortLane(name) { return name.replace(' & ', ' & ').replace('contemplation', '').replace('lineages', '').trim(); }

function populateEraJump() {
  const sel = $('cfl-era-jump'); if (!sel || !layout) return;
  sel.innerHTML = '<option value="">Jump to an era…</option>'
    + layout.scale.bands.map((b, i) => `<option value="${i}">${esc(b.name)} (${esc(rangeText(b))})</option>`).join('');
}

function wireToolbar() {
  $('cfl-mode').querySelectorAll('button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('cfl-lanes').addEventListener('click', ev => chipToggle(ev, 'lane', state.lanes));
  $('cfl-kinds').addEventListener('click', ev => chipToggle(ev, 'kind', state.kinds));
  $('cfl-labels').addEventListener('click', ev => chipToggle(ev, 'label', state.labels));
  $('cfl-from').addEventListener('change', () => { state.yearFrom = $('cfl-from').value === '' ? null : +$('cfl-from').value; applyFilters(); });
  $('cfl-to').addEventListener('change', () => { state.yearTo = $('cfl-to').value === '' ? null : +$('cfl-to').value; applyFilters(); });
  $('cfl-crossings').addEventListener('click', () => {
    state.crossingsOnly = !state.crossingsOnly;
    $('cfl-crossings').setAttribute('aria-pressed', state.crossingsOnly ? 'true' : 'false');
    applyFilters();
  });
  $('cfl-zoom-in').addEventListener('click', () => { if (nav) nav.zoomStep(1); });
  $('cfl-zoom-out').addEventListener('click', () => { if (nav) nav.zoomStep(-1); });
  $('cfl-era-jump').addEventListener('change', () => {
    const v = $('cfl-era-jump').value; if (v === '' || !layout || !nav) return;
    nav.flyTo({ worldY: layout.scale.bands[+v].topPx + 8 }, { source: 'era' });
    $('cfl-era-jump').value = '';
  });
  $('cfl-reset').addEventListener('click', resetFilters);
}
function chipToggle(ev, key, set) {
  const chip = ev.target.closest('.chip-toggle'); if (!chip) return;
  const val = chip.dataset[key];
  const on = chip.getAttribute('aria-pressed') !== 'true';
  chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  if (on) set.add(val); else set.delete(val);
  applyFilters();
}

// ============================================================================
//  ATLAS-level event wiring (delegation)
// ============================================================================
function wireAtlas() {
  const over = $('cfl-over'), under = $('cfl-under');
  over.addEventListener('click', ev => {
    const n = ev.target.closest('.cfl-node'); const c = ev.target.closest('.cfl-cluster');
    if (n) openDrawer(n.dataset.slug); else if (c) openClusterList(c.dataset.cluster);
  });
  over.addEventListener('keydown', onOverKeydown);
  over.addEventListener('focusin', ev => {
    const el = ev.target.closest('.cfl-node, .cfl-cluster'); if (!el) return;
    const tok = el.dataset.slug || el.dataset.cluster;
    if (focusSlug && focusSlug !== tok && nodeEl(focusSlug)) nodeEl(focusSlug).tabIndex = -1;
    focusSlug = tok; el.tabIndex = 0;
    const r = el.getBoundingClientRect();
    if (el.dataset.slug) { if (!thread && !selectedSlug) highlightIncident(tok); const e = getEntry(tok); if (e) showTip(nodeTip(e), r.right, r.top); }
    else { const cl = clusterById.get(tok); if (cl) showTip(clusterTip(cl), r.right, r.top, { wide: true }); }
  });
  over.addEventListener('focusout', ev => { const el = ev.target.closest('.cfl-node, .cfl-cluster'); if (el) { hideTip(); if (!thread && !selectedSlug) clearHighlight(); } });
  over.addEventListener('mouseover', ev => {
    const n = ev.target.closest('.cfl-node'), c = ev.target.closest('.cfl-cluster');
    if (n) { const e = getEntry(n.dataset.slug); if (e) showTip(nodeTip(e), ev.clientX, ev.clientY); if (!thread && !selectedSlug) highlightIncident(n.dataset.slug); }
    else if (c) { const cl = clusterById.get(c.dataset.cluster); if (cl) showTip(clusterTip(cl), ev.clientX, ev.clientY, { wide: true }); }
  });
  over.addEventListener('mouseout', ev => { const el = ev.target.closest('.cfl-node, .cfl-cluster'); if (el) { hideTip(); if (!thread && !selectedSlug) clearHighlight(); } });
  under.addEventListener('mouseover', ev => { const g = ev.target.closest('.cfl-edge'); if (!g || g.hidden) return; highlightEdge(g); showTip(edgeTip(g), ev.clientX, ev.clientY); });
  under.addEventListener('mouseout', ev => { const g = ev.target.closest('.cfl-edge'); if (g) { hideTip(); clearHighlight(); } });
  const strip = $('cfl-lane-strip');
  if (strip) strip.addEventListener('click', ev => { const h = ev.target.closest('.cfl-lane-head'); if (h) toggleLaneFromHead(h); });
  $('cfl-scrim').addEventListener('click', () => { if (thread) exitThread(); else closeDrawer(); });
  // Escape must also work when focus is INSIDE the drawer (its close button,
  // a source link) — the atlas keydown handler can't see those events.
  $('cfl-drawer').addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { ev.stopPropagation(); onEscape(); }
  });
  // a pinned hover card is a fixed overlay outside the atlas/drawer focus scopes,
  // so its Esc-to-close needs a document-level catch (§8.4 top priority).
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && pinnedCard) { unpinCard(); } });
  // keep the card alive while the pointer is on it (so the ⌖ pin is reachable)
  const tip = $('cfl-tip');
  if (tip) {
    tip.addEventListener('mouseenter', () => clearTimeout(tipHideTimer));
    tip.addEventListener('mouseleave', () => { if (!pinnedCard) { tip.hidden = true; } });
  }
}
function toggleLaneFromHead(h) {
  const id = h.dataset.lane;
  const on = h.getAttribute('aria-pressed') !== 'true';
  h.setAttribute('aria-pressed', on ? 'true' : 'false');
  if (on) state.lanes.add(id); else state.lanes.delete(id);
  const chip = $('cfl-lanes').querySelector(`.chip-toggle[data-lane="${id}"]`);
  if (chip) chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  applyFilters();
}

// ============================================================================
//  DEEP LINKS
// ============================================================================
function applyHash(cold) {
  const h = location.hash.slice(1); if (!h) return;
  const src = cold ? 'coldload' : 'legacy';
  if (h.startsWith('thread=')) { const s = decodeURIComponent(h.slice(7)); if (getEntry(s)) startThread(s); return; }
  const slug = decodeURIComponent(h);
  if (getEntry(slug)) { if (state.mode === 'atlas') scrollNodeToCenter(slug, src); else scrollLedgerTo(slug); openDrawer(slug, { silent: true }); }
}

// ============================================================================
//  THE MINIMAP (atlas §6) — a 56 px instrument column mirroring the viewport
// ============================================================================
function minimapH() { const mm = $('cfl-minimap'); return mm ? Math.max(1, mm.clientHeight || mm.offsetHeight) : 0; }
function renderMinimap() {
  const mm = $('cfl-minimap'); if (!mm || !layout) return;
  const H = minimapH(); if (H < 2) return;                // hidden (<1140px) — skip
  mmModel = minimapModel(layout, visibleSet);
  let bands = '', cells = '';
  mmModel.bands.forEach((b, i) => {
    if (i % 2 === 1) bands += `<rect class="cfl-mm-era" x="0" y="${(b.y * H).toFixed(1)}" width="56" height="${(b.h * H).toFixed(1)}"/>`;
    bands += `<text class="cfl-mm-era-label" x="3" y="${(b.y * H + 9).toFixed(1)}">${esc(b.label)}</text>`;
  });
  for (const c of mmModel.cells) {
    const x = 8 + c.laneIdx * 5;
    cells += `<rect class="cfl-mm-cell" x="${x}" y="${(c.y * H).toFixed(1)}" width="3" height="${Math.max(3, c.h * H).toFixed(1)}" opacity="${c.alpha}"/>`;
  }
  mm.innerHTML = `<svg viewBox="0 0 56 ${H}" width="56" height="${H}" preserveAspectRatio="none">`
    + `<title>entries in this atlas per era — a fact about our curation, not historical importance.</title>`
    + `${bands}${cells}<rect class="cfl-mm-lens" id="cfl-mm-lens" x="0.5" y="0" width="55" height="8" rx="2"/></svg>`;
  paintMinimapLens();
}
function paintMinimapCells() { renderMinimap(); }
function paintMinimapLens() {
  const lens = $('cfl-mm-lens'); const mm = $('cfl-minimap'); const vp = $('cfl-scroll');
  if (!lens || !mm || !vp || !layout || !nav) return;
  const H = minimapH(); if (H < 2) return;
  const s = nav.s || 1;
  const y = (vp.scrollTop / s) / layout.height * H;
  const h = Math.max(8, (vp.clientHeight / s) / layout.height * H);
  lens.setAttribute('y', Math.max(0, Math.min(H - h, y)).toFixed(1));
  lens.setAttribute('height', h.toFixed(1));
}
function wireMinimap() {
  const mm = $('cfl-minimap'); if (!mm) return;
  let dragging = false;
  const toWorldY = clientY => {
    const r = mm.getBoundingClientRect(); const H = minimapH();
    return Math.max(0, Math.min(1, (clientY - r.top) / H)) * layout.height;
  };
  mm.addEventListener('pointerdown', ev => {
    if (!layout || !nav) return;
    const lens = $('cfl-mm-lens');
    const onLens = lens && ev.target === lens;
    if (onLens) { dragging = true; try { mm.setPointerCapture(ev.pointerId); } catch { /* */ } }
    else { nav.flyTo({ worldY: toWorldY(ev.clientY) }, { source: 'minimap' }); }
  });
  mm.addEventListener('pointermove', ev => {
    if (!dragging || !nav) return;
    const vp = $('cfl-scroll'); const s = nav.s || 1;
    vp.scrollTop = Math.max(0, toWorldY(ev.clientY) * s - vp.clientHeight / 2);
    onScroll();
  });
  const end = ev => { if (dragging) { dragging = false; try { mm.releasePointerCapture(ev.pointerId); } catch { /* */ } } };
  mm.addEventListener('pointerup', end);
  mm.addEventListener('pointercancel', end);
}

// ============================================================================
//  CLUSTER LIST (atlas §7.2) — Enter/click on a +N pill opens its members
// ============================================================================
function openClusterList(id) {
  const c = clusterById.get(id); if (!c) return;
  clusterListOpen = id;
  const yr = layout ? Math.round(layout.scale.pxToYear(c.y)) : 0;
  const when = yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  const lane = LANE_META.get(c.laneId) || { name: c.laneId };
  const rows = c.members.map(s => {
    const e = getEntry(s); if (!e) return '';
    const flag = e.contested ? ' <span class="cfl-flag">⚑</span>' : '';
    return `<button type="button" class="cfl-row cfl-cluster-row" data-slug="${esc(s)}" data-lane="${esc(e.lane)}" data-label="${esc(e.label)}">
      <span class="cfl-mark" aria-hidden="true">${markSvg(e.kind)}</span>
      <span class="cfl-row-title">${esc(e.title)}${flag}</span>
      <span class="cfl-row-date">${esc(e.dateText)}</span>
      <span class="badge badge--${LABEL_CSS[e.label]}">${esc(e.label)}</span></button>`;
  }).join('');
  const dr = $('cfl-drawer');
  dr.innerHTML = `<button type="button" class="cfl-drawer-close" id="cfl-drawer-close" aria-label="Close list">✕</button>
    <div class="cfl-sheet-handle" aria-hidden="true"></div>
    <h2 class="panel-title" style="margin:.1rem 0 .2rem;font-size:1.15rem">Near ${esc(when)} · ${esc(lane.name)} lane</h2>
    <p class="small muted">${c.count} entries the map has collapsed at this zoom${c.contestedCount ? ` · ${c.contestedCount} with contested dates` : ''}. Open one, or zoom in to separate them.</p>
    <div class="cfl-cluster-rows">${rows}</div>`;
  dr.hidden = false;
  $('cfl-stage').classList.add('drawer-open');
  const mobile = matchMedia('(max-width: 1099px)').matches;
  if (mobile) { dr.setAttribute('role', 'dialog'); dr.setAttribute('aria-modal', 'true'); $('cfl-scrim').hidden = false; document.documentElement.style.overflow = 'hidden'; }
  const close = $('cfl-drawer-close'); if (close) close.addEventListener('click', () => { closeDrawer(); const pill = nodeEl(id); if (pill) pill.focus(); });
  dr.querySelectorAll('.cfl-cluster-row').forEach(r => r.addEventListener('click', () => openDrawer(r.dataset.slug)));
  if (close) close.focus();
}

// ============================================================================
//  SEARCH with fly-to (atlas §10)
// ============================================================================
let searchActive = -1, searchResults = [];
function wireSearch() {
  const inp = $('cfl-search'), list = $('cfl-search-list'); if (!inp || !list) return;
  const close = () => { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); searchActive = -1; };
  const renderList = () => {
    searchResults = searchEntries(inp.value, 12);
    if (!searchResults.length) { close(); return; }
    list.innerHTML = searchResults.map((e, i) => {
      const lane = LANE_META.get(e.lane) || { glyph: '' };
      return `<li role="option" id="cfl-sr-${i}" class="cfl-search-row" data-slug="${esc(e.slug)}">
        <span class="cfl-mark" aria-hidden="true">${markSvg(e.kind)}</span>
        <span class="cfl-sr-title">${esc(e.title)}</span>
        <span class="cfl-sr-date">${esc(e.dateText)}</span>
        <span class="cfl-dot" data-lane="${esc(e.lane)}"></span></li>`;
    }).join('');
    list.hidden = false; inp.setAttribute('aria-expanded', 'true'); searchActive = -1;
    list.querySelectorAll('.cfl-search-row').forEach(r => r.addEventListener('mousedown', ev => { ev.preventDefault(); pickSearch(r.dataset.slug); }));
  };
  const setActive = i => {
    const rows = [...list.querySelectorAll('.cfl-search-row')];
    rows.forEach((r, j) => r.classList.toggle('is-active', j === i));
    if (i >= 0 && rows[i]) { inp.setAttribute('aria-activedescendant', rows[i].id); rows[i].scrollIntoView({ block: 'nearest' }); }
    searchActive = i;
  };
  inp.addEventListener('input', renderList);
  inp.addEventListener('keydown', ev => {
    if (list.hidden && (ev.key === 'ArrowDown')) { renderList(); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(Math.min(searchResults.length - 1, searchActive + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(Math.max(0, searchActive - 1)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); const pick = searchActive >= 0 ? searchResults[searchActive] : searchResults[0]; if (pick) pickSearch(pick.slug); }
    else if (ev.key === 'Escape') { ev.preventDefault(); if (!list.hidden) close(); else inp.blur(); }
  });
  inp.addEventListener('blur', () => setTimeout(close, 120));
  // '/' focuses the search when focus is inside the atlas region
  document.addEventListener('keydown', ev => {
    if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    const region = $('cfl-instrument');
    if (region && (region.contains(t) || t === document.body || (t && t.closest && t.closest('.cfl-page')))) { ev.preventDefault(); inp.focus(); }
  });
  function pickSearch(slug) {
    if (thread) exitThread();
    close(); inp.value = '';
    if (!visibleSet.has(slug)) relaxFiltersFor(slug);
    if (state.mode === 'atlas') scrollNodeToCenter(slug, 'search');
    else scrollLedgerTo(slug);
    openDrawer(slug, { silent: false });
  }
}
// Relax ONLY the axes hiding this entry (§9.9 / G11) — never the blunt reset.
function relaxFiltersFor(slug) {
  const e = getEntry(slug); if (!e) { resetFilters(); return; }
  let touched = false;
  if (!state.lanes.has(e.lane)) { state.lanes.add(e.lane); touched = true; }
  if (!state.kinds.has(e.kind)) { state.kinds.add(e.kind); touched = true; }
  if (!state.labels.has(e.label)) { state.labels.add(e.label); touched = true; }
  if (state.yearFrom != null && e.sortYear < state.yearFrom) { state.yearFrom = null; const f = $('cfl-from'); if (f) f.value = ''; touched = true; }
  if (state.yearTo != null && e.sortYear > state.yearTo) { state.yearTo = null; const t = $('cfl-to'); if (t) t.value = ''; touched = true; }
  if (state.crossingsOnly && e.lane !== 'confluence') { state.crossingsOnly = false; const c = $('cfl-crossings'); if (c) c.setAttribute('aria-pressed', 'false'); touched = true; }
  if (touched) {
    document.querySelectorAll('#cfl-lanes .chip-toggle').forEach(c => c.setAttribute('aria-pressed', state.lanes.has(c.dataset.lane) ? 'true' : 'false'));
    document.querySelectorAll('#cfl-kinds .chip-toggle').forEach(c => c.setAttribute('aria-pressed', state.kinds.has(c.dataset.kind) ? 'true' : 'false'));
    document.querySelectorAll('#cfl-labels .chip-toggle').forEach(c => c.setAttribute('aria-pressed', state.labels.has(c.dataset.label) ? 'true' : 'false'));
    applyFilters();
  }
}

// ============================================================================
//  PUBLIC API
// ============================================================================
export function currentConfluenceReport() {
  return {
    focus: selectedSlug ? getEntry(selectedSlug) : null,
    thread: thread ? { stops: thread.stops } : null,
    filters: filterState(),
    visibleCount: visibleSet.size,
    stats: confluenceStats(),
  };
}

export function initConfluence() {
  if (!$('cfl-atlas')) return;
  try { const z = parseFloat(sessionStorage.getItem('cfl-zoom')); if (ZOOMS.includes(z)) state.zoom = z; } catch { /* ignore */ }
  const zl = $('cfl-zoom-label'); if (zl) zl.textContent = Math.round(state.zoom * 100) + '%';

  buildToolbar();
  wireToolbar();
  renderAtlas();
  populateEraJump();
  syncToolbarHeight();

  // the physics / navigation state machine (imports app/motion.js). The nav
  // owns pan, the zoom bridge and flyTo; the app hands it the elements + a small
  // hook surface (render(L) → layout, level-writer, scroll-reactive readouts).
  nav = createConfluenceNav({
    viewport: $('cfl-scroll'), world: $('cfl-world'), canvas: $('cfl-canvas'), atlas: $('cfl-atlas'),
    getLayout: () => layout, getLevel: () => state.zoom, setLevel,
    render: () => { renderAtlas({ materialize: true }); return layout; },
    afterScroll: onScroll, afterRebase: renderMinimap,
    slugXY: slug => { const n = nodesBySlug.get(slug); if (n) return { x: n.x, y: n.y }; const cid = slugToCluster.get(slug); const c = cid && clusterById.get(cid); return c ? { x: c.x, y: c.y } : null; },
  });
  nav.applyScale();

  wireAtlas();
  wireMinimap();
  wireSearch();
  renderMinimap();

  // lane legend in the how-to-read panel
  const leg = $('cfl-lane-legend');
  if (leg) leg.innerHTML = CONFLUENCE_LANES.map(l => `<span data-lane="${esc(l.id)}"><span class="cfl-dot"></span>${esc(l.glyph)} ${esc(l.name)}</span>`).join('');

  // responsive: <720px forces the ledger
  if (typeof matchMedia === 'function') {
    const mq = matchMedia('(max-width: 719px)');
    const apply = () => {
      const atlasBtn = $('cfl-mode').querySelector('[data-mode="atlas"]');
      if (mq.matches) { atlasBtn.disabled = true; atlasBtn.title = 'The nine-lane atlas needs a wider screen — showing the ledger.'; setMode('ledger'); }
      else { atlasBtn.disabled = false; atlasBtn.title = ''; if (state.mode === 'ledger') { /* keep user choice */ } }
    };
    apply();
    (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
    // fluid re-layout on width change (debounced), preserving the centre year
    let rt = 0, lastW = measureWidth();
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const w = measureWidth();
        const year = nav ? nav.centerYear() : null;
        if (Math.abs(w - lastW) > 2) { lastW = w; renderAtlas(); if (nav) { nav.resync(); if (year != null) nav.flyTo({ year }, { source: 'coldload' }); } }
        renderMinimap();
        syncToolbarHeight();
      }, 150);
    });
  }

  const vp = $('cfl-scroll'); if (vp) vp.addEventListener('scroll', onScroll, { passive: true });
  addEventListener('hashchange', () => applyHash(false));

  // the AI panel — same shared assistant, confluence historian voice
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'confluence',
      getReading: () => currentConfluenceReport(),
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Open an entry, follow a thread, or set a filter on the map above first.' },
    });
  }

  applyHash(true);            // honour a #slug / #thread= on cold load (instant)
}
