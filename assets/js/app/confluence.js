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
import { layoutConfluence, filterEntries, entryBySlug, threadFrom, confluenceStats } from '../core/confluence.js';
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
let focusSlug = null;              // roving tabindex holder
let selectedSlug = null;           // open drawer entry
let thread = null;                 // { stops:[{slug,via}], i }
let entered = false;               // one-time entrance guard
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(currentConfluenceReport()); } catch { /* non-fatal */ } } };
const motionOK = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: no-preference)').matches;
const forcedLedger = () => typeof matchMedia === 'function' && matchMedia('(max-width: 719px)').matches;

// ---------- helpers ---------------------------------------------------------
const nodeEl = slug => $('cfl-over') && $('cfl-over').querySelector(`.cfl-node[data-slug="${slug}"]`);
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
  let bands = '', lanes = '', ticks = '';
  s.bands.forEach((b, i) => {
    if (i % 2 === 1) bands += `<rect class="cfl-era-band" x="0" y="${b.topPx}" width="${lo.width}" height="${b.heightPx}"/>`;
  });
  for (const L of lo.lanes) {
    const w = L.x1 - L.x0;
    lanes += `<rect class="cfl-lane-wash" data-lane="${esc(L.id)}" x="${L.x0}" y="0" width="${w}" height="${lo.height}"/>`;
    if (L.side === 'spine') {
      lanes += `<line class="cfl-spine-rule" x1="${L.x0}" y1="0" x2="${L.x0}" y2="${lo.height}"/>`
        + `<line class="cfl-spine-rule" x1="${L.x1}" y1="0" x2="${L.x1}" y2="${lo.height}"/>`;
    } else {
      lanes += `<line class="cfl-lane-rule" x1="${L.x0}" y1="0" x2="${L.x0}" y2="${lo.height}"/>`;
    }
  }
  for (const t of s.ticks) {
    ticks += `<line class="cfl-tick${t.major ? ' cfl-tick-major' : ''}" x1="0" y1="${t.px}" x2="${lo.width}" y2="${t.px}"/>`;
    if (t.major) ticks += `<text class="cfl-tick-label" x="4" y="${t.px - 2}">${esc(tickLabel(t.year))}</text>`;
  }
  return `<defs>${MARKERS}</defs>${bands}${lanes}${ticks}${buildCert(lo)}<g class="cfl-edges" id="cfl-edges">${buildEdges(lo)}</g>`;
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
    const bead = ed.kind === 'synthesis' && ed.midX != null
      ? `<circle class="cfl-edge-bead" cx="${ed.midX}" cy="${ed.midY}" r="3"/>` : '';
    out += `<g class="cfl-edge" data-from="${esc(ed.from)}" data-to="${esc(ed.to)}" data-kind="${esc(ed.kind)}">`
      + `<path class="cfl-edge-hit" d="${d}"/>`
      + `<path class="cfl-edge-line" pathLength="1" d="${d}" marker-end="url(#cfl-m-${marker})"/>`
      + bead + `</g>`;
  }
  return out;
}

// ============================================================================
//  RENDER — HTML over layer (era headers, lane headers, node buttons)
// ============================================================================
function buildOver(lo) {
  let out = '';
  // era header rows at each band top
  lo.scale.bands.forEach((b, i) => {
    const scale = i === 0
      ? `one century ≈ ${Math.round(b.pxPerCentury)} px here — the map stretches as it nears the present`
      : `one century ≈ ${Math.round(b.pxPerCentury)} px here`;
    out += `<div class="cfl-era-head" id="cfl-era-${i}" style="top:${b.topPx}px;width:${lo.width}px">`
      + `${esc(b.name)} · ${esc(rangeText(b))} · <span class="cfl-era-scale">${esc(scale)}</span></div>`;
  });
  // lane headers (also the lane filter toggle)
  for (const L of lo.lanes) {
    const m = LANE_META.get(L.id) || { name: L.name, glyph: L.glyph };
    const cnt = CONFLUENCE_ENTRIES.filter(e => e.lane === L.id).length;
    out += `<button type="button" class="cfl-lane-head" data-lane="${esc(L.id)}" aria-pressed="true"`
      + ` style="left:${L.x0}px;width:${L.x1 - L.x0}px" title="${esc(m.name)} — click to hide/show this lane">`
      + `<span class="cfl-lane-glyph" aria-hidden="true">${esc(m.glyph)}</span>`
      + `<span class="cfl-lane-name">${esc(m.name)}</span>`
      + `<span class="cfl-lane-count">${cnt}</span></button>`;
  }
  // nodes
  for (const n of lo.nodes) {
    const e = getEntry(n.slug); if (!e) continue;
    const L = laneMap.get(n.laneId);
    const flip = L && n.x > L.cx + 4;
    const eraI = bandIndexForPx(n.y);
    const contested = !!e.contested;
    const flag = contested ? ` <span class="cfl-flag" title="${esc(disputeNote(e))}">⚑</span>` : '';
    out += `<button type="button" class="cfl-node${flip ? ' is-flip' : ''}" id="cfl-${esc(n.slug)}"`
      + ` data-slug="${esc(n.slug)}" data-lane="${esc(e.lane)}" data-kind="${esc(e.kind)}"`
      + ` data-label="${esc(e.label)}" data-cert="${esc(e.dateCertainty)}" tabindex="-1"`
      + ` style="left:${n.x - 12}px;top:${n.y - 12}px;--era-i:${eraI}"`
      + ` aria-label="${esc(nodeAria(e))}">`
      + `<span class="cfl-mark" aria-hidden="true">${markSvg(e.kind)}</span>`
      + `<span class="cfl-label">${esc(e.title)}${flag}</span></button>`;
  }
  return out;
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
function renderAtlas() {
  layout = getLayout();
  laneMap = new Map(layout.lanes.map(L => [L.id, L]));
  nodesBySlug = new Map(layout.nodes.map(n => [n.slug, n]));
  laneNodes = new Map(LANE_ORDER.map(id => [id, []]));
  for (const n of [...layout.nodes].sort((a, b) => a.y - b.y || a.x - b.x)) {
    if (laneNodes.has(n.laneId)) laneNodes.get(n.laneId).push(n.slug);
  }
  allByY = [...layout.nodes].sort((a, b) => a.y - b.y || a.x - b.x).map(n => n.slug);

  const atlas = $('cfl-atlas'), under = $('cfl-under'), over = $('cfl-over');
  atlas.style.width = layout.width + 'px';
  atlas.style.height = layout.height + 'px';
  under.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
  under.setAttribute('width', layout.width);
  under.setAttribute('height', layout.height);
  over.style.setProperty('--cfl-lane-w', laneW() + 'px');
  under.innerHTML = buildUnder(layout);
  over.innerHTML = buildOver(layout);

  // roving tabindex: keep the last focus if still present, else the first node
  if (!nodesBySlug.has(focusSlug)) focusSlug = allByY[0] || null;
  const first = focusSlug && nodeEl(focusSlug);
  if (first) first.tabIndex = 0;

  applyFilters();
  updateEraReadout();
  if (selectedSlug && nodeEl(selectedSlug)) { nodeEl(selectedSlug).classList.add('is-selected'); highlightIncident(selectedSlug); }
  if (thread) paintThread();

  // one-time entrance choreography — only where motion is welcome
  if (!entered && motionOK()) {
    atlas.classList.add('is-entering');
    setTimeout(() => atlas.classList.remove('is-entering'), 720);
  }
  entered = true;
}

// ============================================================================
//  FILTERS — never re-layout; toggle visibility only (design §6.1)
// ============================================================================
function applyFilters() {
  const vis = new Set(filterEntries(filterState()));
  visibleSet = vis;
  const over = $('cfl-over'), edges = $('cfl-edges');
  if (over) over.querySelectorAll('.cfl-node').forEach(btn => { btn.hidden = !vis.has(btn.dataset.slug); });
  let crossings = 0;
  if (edges) edges.querySelectorAll('.cfl-edge').forEach(g => {
    const on = vis.has(g.dataset.from) && vis.has(g.dataset.to);
    g.hidden = !on; if (on) crossings++;
  });
  updateCount(vis.size, crossings);
  syncLaneChrome();
  if (state.mode === 'ledger') renderLedger(vis);
  notifyReport();
}
function updateCount(nEntries, nCross) {
  const c = $('cfl-count');
  if (c) c.textContent = `${nEntries} of ${CONFLUENCE_ENTRIES.length} entries · ${nCross} of ${CONFLUENCE_EDGES.length} crossings`;
}
function syncLaneChrome() {
  const over = $('cfl-over'); if (!over) return;
  over.querySelectorAll('.cfl-lane-head').forEach(h => {
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
function showTip(html, x, y) {
  const tip = $('cfl-tip'); if (!tip) return;
  tip.innerHTML = html; tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let px = x + 14, py = y + 14;
  if (px + w > innerWidth - 8) px = x - w - 14;
  if (py + h > innerHeight - 8) py = y - h - 14;
  tip.style.left = Math.max(8, px) + 'px'; tip.style.top = Math.max(8, py) + 'px';
}
function hideTip() { const t = $('cfl-tip'); if (t) t.hidden = true; }
function nodeTip(e) {
  const lane = (LANE_META.get(e.lane) || {}).name || e.lane;
  return `<b>${esc(e.title)}</b><br><span class="cfl-tip-meta">${esc(e.dateText)} · ${esc(lane)}</span> `
    + `<span class="badge badge--${LABEL_CSS[e.label]}">${esc(e.label)}</span>`;
}
function edgeTip(g) {
  const ed = edgeObj(g);
  const a = getEntry(g.dataset.from), b = getEntry(g.dataset.to);
  return `<b>${esc(a ? a.title : g.dataset.from)}</b> <span class="cfl-tip-meta">—${esc(g.dataset.kind)}→</span> `
    + `<b>${esc(b ? b.title : g.dataset.to)}</b>${ed && ed.body ? `<br><span class="cfl-tip-meta">${esc(ed.body)}</span>` : ''}`;
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
  return `<li><span class="cfl-jkind">${arrow} ${esc(ed.kind)} ${arrow}</span>
    <a href="#${esc(out ? ed.to : ed.from)}" class="cfl-jlink" data-slug="${esc(out ? ed.to : ed.from)}">${esc(partner ? partner.title : (out ? ed.to : ed.from))}</a>
    ${ed.body ? `<div class="small muted">${esc(ed.body)}</div>` : ''}</li>`;
}
function contestedPanel(c) {
  const pos = (c.positions || []).map(p =>
    `<div class="cfl-pos">${esc(p.value)}<cite>${esc(p.source || '')}</cite></div>`).join('');
  return `<div class="callout cfl-contested"><span class="label">The sources disagree ⚑</span>
    ${c.flag ? `<p style="margin:.2rem 0 .3rem">${esc(c.flag)}</p>` : ''}${pos}</div>`;
}

function openDrawer(slug, opts = {}) {
  const e = getEntry(slug); if (!e) { toast('No such entry on the map.'); return; }
  // deep-link relaxation: if a filter is hiding it, reset filters so it shows
  if (!visibleSet.has(slug)) { resetFilters(); }
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
  // node selection + highlight
  $('cfl-over').querySelectorAll('.is-selected').forEach(n => n.classList.remove('is-selected'));
  const node = nodeEl(slug);
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
function atlasTop() {
  const a = $('cfl-atlas'); if (!a) return 0;
  return a.getBoundingClientRect().top + window.scrollY;
}
function scrollNodeToCenter(slug) {
  const n = nodesBySlug.get(slug); if (!n) return;
  const y = atlasTop() + n.y - innerHeight / 2;
  window.scrollTo({ top: Math.max(0, y), behavior: motionOK() ? 'smooth' : 'auto' });
  // horizontal: reveal the lane if the atlas overflows its scroll box
  const sc = $('cfl-scroll');
  if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollTo({ left: Math.max(0, n.x - sc.clientWidth / 2), behavior: motionOK() ? 'smooth' : 'auto' });
}
function focusNode(slug) {
  const n = nodeEl(slug); if (!n) return;
  if (focusSlug && nodeEl(focusSlug)) nodeEl(focusSlug).tabIndex = -1;
  focusSlug = slug; n.tabIndex = 0; n.focus();
  n.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// ============================================================================
//  KEYBOARD navigation (design §6.5)
// ============================================================================
function nearestInLane(laneId, y) {
  const arr = (laneNodes.get(laneId) || []).filter(s => visibleSet.has(s));
  let best = null, bd = Infinity;
  for (const s of arr) { const n = nodesBySlug.get(s); const d = Math.abs(n.y - y); if (d < bd) { bd = d; best = s; } }
  return best;
}
function adjacentLane(laneId, dir) {
  let i = LANE_ORDER.indexOf(laneId) + dir;
  while (i >= 0 && i < LANE_ORDER.length) {
    const id = LANE_ORDER[i];
    if (state.lanes.has(id) && (laneNodes.get(id) || []).some(s => visibleSet.has(s))) return id;
    i += dir;
  }
  return null;
}
function onOverKeydown(ev) {
  const slug = focusSlug; if (!slug) return;
  const n = nodesBySlug.get(slug); if (!n) return;
  const laneArr = (laneNodes.get(n.laneId) || []).filter(s => visibleSet.has(s));
  const idx = laneArr.indexOf(slug);
  let handled = true;
  switch (ev.key) {
    case 'ArrowDown': if (idx >= 0 && idx < laneArr.length - 1) focusNode(laneArr[idx + 1]); break;
    case 'ArrowUp': if (idx > 0) focusNode(laneArr[idx - 1]); break;
    case 'ArrowRight': { const L = adjacentLane(n.laneId, 1); const t = L && nearestInLane(L, n.y); if (t) focusNode(t); break; }
    case 'ArrowLeft': { const L = adjacentLane(n.laneId, -1); const t = L && nearestInLane(L, n.y); if (t) focusNode(t); break; }
    case 'Home': { const t = allByY.find(s => visibleSet.has(s)); if (t) focusNode(t); break; }
    case 'End': { const t = [...allByY].reverse().find(s => visibleSet.has(s)); if (t) focusNode(t); break; }
    case 'PageDown': jumpEra(1); break;
    case 'PageUp': jumpEra(-1); break;
    case 'Enter': case ' ': openDrawer(slug, { keepFocus: false }); break;
    case 't': case 'T': startThread(slug); break;
    case 'n': case 'N': if (thread) stepThread(1); break;
    case 'p': case 'P': if (thread) stepThread(-1); break;
    case '+': case '=': zoomTo(state.zoom, 1); break;
    case '-': case '_': zoomTo(state.zoom, -1); break;
    case 'Escape': if (thread) exitThread(); else if (selectedSlug) closeDrawer(); else clearHighlight(); break;
    default: handled = false;
  }
  if (handled) ev.preventDefault();
}
function jumpEra(dir) {
  if (!layout) return;
  const centerYear = layout.scale.pxToYear(window.scrollY + innerHeight / 2 - atlasTop());
  const bands = layout.scale.bands;
  let bi = bands.findIndex(b => centerYear >= b.fromYear && centerYear < b.toYear);
  if (bi < 0) bi = 0;
  bi = Math.max(0, Math.min(bands.length - 1, bi + dir));
  window.scrollTo({ top: Math.max(0, atlasTop() + bands[bi].topPx - 8), behavior: motionOK() ? 'smooth' : 'auto' });
}

// ============================================================================
//  ZOOM (re-render at a new scale; re-anchor the viewport-centre year)
// ============================================================================
function zoomTo(cur, dir) {
  const i = ZOOMS.indexOf(cur);
  const ni = Math.max(0, Math.min(ZOOMS.length - 1, (i < 0 ? 1 : i) + dir));
  if (ZOOMS[ni] === state.zoom) return;
  const year = layout ? layout.scale.pxToYear(window.scrollY + innerHeight / 2 - atlasTop()) : null;
  state.zoom = ZOOMS[ni];
  try { sessionStorage.setItem('cfl-zoom', String(state.zoom)); } catch { /* ignore */ }
  const zl = $('cfl-zoom-label'); if (zl) zl.textContent = Math.round(state.zoom * 100) + '%';
  renderAtlas();
  if (year != null) window.scrollTo({ top: Math.max(0, atlasTop() + layout.scale.yearToPx(year) - innerHeight / 2), behavior: 'auto' });
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
  $('cfl-scroll').hidden = mode !== 'atlas';
  const led = $('cfl-ledger'); led.hidden = mode !== 'ledger';
  $('cfl-mode').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
  if (mode === 'ledger') renderLedger(visibleSet);
}

// ============================================================================
//  ERA readout (the always-visible current-era label)
// ============================================================================
let readoutRAF = 0;
function updateEraReadout() {
  if (!layout) return;
  const el = $('cfl-era-current'); if (!el) return;
  const centerYear = layout.scale.pxToYear(Math.max(0, window.scrollY + innerHeight / 2 - atlasTop()));
  const b = layout.scale.bands.find(bb => centerYear >= bb.fromYear && centerYear < bb.toYear) || layout.scale.bands[0];
  el.textContent = `${b.name} · ${rangeText(b)}`;
}
function onScroll() { if (readoutRAF) return; readoutRAF = requestAnimationFrame(() => { readoutRAF = 0; updateEraReadout(); }); }

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
  $('cfl-zoom-in').addEventListener('click', () => zoomTo(state.zoom, 1));
  $('cfl-zoom-out').addEventListener('click', () => zoomTo(state.zoom, -1));
  $('cfl-era-jump').addEventListener('change', () => {
    const v = $('cfl-era-jump').value; if (v === '' || !layout) return;
    window.scrollTo({ top: Math.max(0, atlasTop() + layout.scale.bands[+v].topPx - 8), behavior: motionOK() ? 'smooth' : 'auto' });
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
  over.addEventListener('click', ev => { const n = ev.target.closest('.cfl-node'); const h = ev.target.closest('.cfl-lane-head'); if (n) openDrawer(n.dataset.slug); else if (h) toggleLaneFromHead(h); });
  over.addEventListener('keydown', onOverKeydown);
  over.addEventListener('focusin', ev => { const n = ev.target.closest('.cfl-node'); if (!n) return; if (focusSlug && focusSlug !== n.dataset.slug && nodeEl(focusSlug)) nodeEl(focusSlug).tabIndex = -1; focusSlug = n.dataset.slug; n.tabIndex = 0; if (!thread && !selectedSlug) highlightIncident(n.dataset.slug); const e = getEntry(n.dataset.slug); if (e) { const r = n.getBoundingClientRect(); showTip(nodeTip(e), r.right, r.top); } });
  over.addEventListener('focusout', ev => { const n = ev.target.closest('.cfl-node'); if (n) { hideTip(); if (!thread && !selectedSlug) clearHighlight(); } });
  over.addEventListener('mouseover', ev => { const n = ev.target.closest('.cfl-node'); if (!n) return; const e = getEntry(n.dataset.slug); if (e) showTip(nodeTip(e), ev.clientX, ev.clientY); if (!thread && !selectedSlug) highlightIncident(n.dataset.slug); });
  over.addEventListener('mouseout', ev => { const n = ev.target.closest('.cfl-node'); if (n) { hideTip(); if (!thread && !selectedSlug) clearHighlight(); } });
  under.addEventListener('mouseover', ev => { const g = ev.target.closest('.cfl-edge'); if (!g || g.hidden) return; highlightEdge(g); showTip(edgeTip(g), ev.clientX, ev.clientY); });
  under.addEventListener('mouseout', ev => { const g = ev.target.closest('.cfl-edge'); if (g) { hideTip(); clearHighlight(); } });
  $('cfl-scrim').addEventListener('click', () => { if (thread) exitThread(); else closeDrawer(); });
  // Escape must also work when focus is INSIDE the drawer (its close button,
  // a source link) — the atlas keydown handler can't see those events.
  $('cfl-drawer').addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { ev.stopPropagation(); if (thread) exitThread(); else closeDrawer(); }
  });
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
function applyHash() {
  const h = location.hash.slice(1); if (!h) return;
  if (h.startsWith('thread=')) { const s = decodeURIComponent(h.slice(7)); if (getEntry(s)) startThread(s); return; }
  const slug = decodeURIComponent(h);
  if (getEntry(slug)) { if (state.mode === 'atlas') scrollNodeToCenter(slug); else scrollLedgerTo(slug); openDrawer(slug, { silent: true }); }
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
  wireAtlas();

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
        if (Math.abs(w - lastW) > 2) { lastW = w; const year = layout ? layout.scale.pxToYear(window.scrollY + innerHeight / 2 - atlasTop()) : null; renderAtlas(); if (year != null) window.scrollTo({ top: Math.max(0, atlasTop() + layout.scale.yearToPx(year) - innerHeight / 2), behavior: 'auto' }); }
      }, 150);
    });
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('hashchange', applyHash);

  // the AI panel — same shared assistant, confluence historian voice
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'confluence',
      getReading: () => currentConfluenceReport(),
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Open an entry, follow a thread, or set a filter on the map above first.' },
    });
  }

  applyHash();                // honour a #slug / #thread= on cold load
}
