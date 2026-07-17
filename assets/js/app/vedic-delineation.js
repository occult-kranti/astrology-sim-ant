// ============================================================================
//  vedic-delineation.js (app) — drives pages/vedic/delineation.html, the
//  planet-in-bhāva delineation browser. The pure data is V1's frozen contract:
//    core/data/bhava-phala.js  BHAVA_PHALA (108 records)
//  Each record carries TWO witnesses (Phaladīpikā + Sārāvalī) that are shown
//  side by side and NEVER merged, an agreement badge, a contradictionNote when
//  the texts clash, a sensitiveNote rendered as a tradition-not-advice callout,
//  and — for Rāhu/Ketu — a single-witness absence note rendered honestly.
//
//  The 12×9 grid (12 bhāvas × 9 grahas) is keyboard-rovable exactly like the
//  synastry grid. "From a chart" mode casts the sidereal chart and rings the
//  nine cells the chart actually occupies.
//
//  HONEST FRAMING: a historical symbolic system with no demonstrated validity;
//  the summaries report what the cited verse says. Described, never prescribed.
// ============================================================================
import { castChart } from '../core/astro.js';
import { castVedic } from '../core/vedic.js';
import { BHAVA_PHALA } from '../core/data/bhava-phala.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// canonical graha order + glyphs, and the twelve bhāva names
export const GRAHA_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const GL = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋' };
const BHAVA_NAMES = ['Tanu', 'Dhana', 'Sahaja', 'Sukha', 'Putra', 'Ari', 'Yuvati', 'Randhra', 'Dharma', 'Karma', 'Lābha', 'Vyaya'];

// ---------------------------------------------------------------------------
//  PURE model helpers (DOM-free, engine-testable) — operate on plain records.
// ---------------------------------------------------------------------------

// Build a lookup + the present grahas/bhavas from a record list. Deterministic.
export function delinGridModel(records = BHAVA_PHALA || []) {
  const byKey = new Map();
  const grahaSet = new Set();
  for (const r of records) {
    if (!r) continue;
    byKey.set(r.graha + '|' + r.bhava, r);
    grahaSet.add(r.graha);
  }
  const grahas = GRAHA_ORDER.filter(g => grahaSet.has(g));
  for (const g of grahaSet) if (!grahas.includes(g)) grahas.push(g);   // defensive: any extra graha
  const bhavas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return { grahas, bhavas, byKey };
}

// agreement value → a compact, colour-blind-safe cell mark + accessible label
export function agreementMark(agreement) {
  switch (agreement) {
    case 'agree': return { mark: '=', label: 'the two texts agree' };
    case 'partial': return { mark: '~', label: 'partial overlap' };
    case 'contradict': return { mark: '✕', label: 'a genuine contradiction' };
    default: return { mark: '·', label: 'single witness' };
  }
}

// agreement value → badge class + label (null/absent = single witness)
export function agreementBadge(agreement) {
  switch (agreement) {
    case 'agree': return { cls: 'agree', label: 'agree' };
    case 'partial': return { cls: 'partial', label: 'partial' };
    case 'contradict': return { cls: 'contradict', label: 'contradiction' };
    default: return { cls: 'single', label: 'single witness' };
  }
}

// Is a Sārāvalī witness present (vs. an honest absence note)? Pure.
export function hasSaravali(rec) {
  return !!(rec && rec.saravali && rec.saravali.summary != null && rec.saravali.locus != null);
}

// The nine (graha, bhava) placements of a cast chart. Pure over a castVedic result.
export function chartPlacements(v) {
  const out = [];
  if (!v || !v.grahas) return out;
  for (const g of GRAHA_ORDER) {
    const gr = v.grahas[g];
    if (gr && gr.house) out.push({ graha: g, bhava: gr.house });
  }
  return out;
}

// ---------------------------------------------------------------------------
//  State + rendering (DOM)
// ---------------------------------------------------------------------------
let model = null;
let selected = null;                 // { graha, bhava }
let placements = [];                 // [{graha, bhava}] in "from a chart" mode
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentVedicDelineationReport() { return lastReport; }

let picker = null;
const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };

function renderGrid() {
  const host = $('vd-grid'); if (!host) return;
  const placedSet = new Set(placements.map(p => p.graha + '|' + p.bhava));
  const head = `<tr><th scope="col"><span class="vt-sr">bhāva</span></th>${model.grahas.map(g =>
    `<th scope="col" data-graha="${esc(g)}" title="${esc(g)}">${GL[g] || esc(g.slice(0, 2))}</th>`).join('')}</tr>`;
  const rows = model.bhavas.map(b => {
    const cells = model.grahas.map(g => {
      const rec = model.byKey.get(g + '|' + b);
      const am = agreementMark(rec && rec.agreement);
      const placed = placedSet.has(g + '|' + b);
      const cls = ['vt-cell'];
      if (placed) cls.push('is-placed');
      if (rec && rec.saravali && rec.saravali.summary == null) cls.push('is-absent');
      return `<td class="${cls.join(' ')}" role="gridcell" data-el="cell-${esc(g)}-${b}" data-graha="${esc(g)}" data-bhava="${b}" tabindex="-1"
        aria-label="${esc(g)} in bhāva ${b} — ${esc(am.label)}${placed ? ', occupied by this chart' : ''}" title="${esc(g)} in bhāva ${b}">${placed ? '' : am.mark}</td>`;
    }).join('');
    return `<tr><th scope="row" title="${esc(BHAVA_NAMES[b - 1])} bhāva">${b}<span class="vt-sr"> ${esc(BHAVA_NAMES[b - 1])}</span></th>${cells}</tr>`;
  }).join('');
  host.innerHTML = `<table class="data vt-grid" role="grid" aria-label="Graha in bhāva delineation grid"><thead>${head}</thead><tbody>${rows}</tbody></table>`;
  wireGridRoving(host.querySelector('table.vt-grid'));
  markSelected();
}

function markSelected() {
  const host = $('vd-grid'); if (!host) return;
  for (const td of host.querySelectorAll('.vt-cell')) {
    const on = selected && td.dataset.graha === selected.graha && +td.dataset.bhava === selected.bhava;
    td.classList.toggle('is-selected', !!on);
    td.setAttribute('tabindex', on ? '0' : '-1');
  }
  // ensure exactly one cell is tab-reachable even before any selection
  if (!selected) { const first = host.querySelector('.vt-cell'); if (first) first.setAttribute('tabindex', '0'); }
}

function select(graha, bhava, focus) {
  selected = { graha, bhava };
  markSelected();
  renderRecord();
  if (focus) { const c = $('vd-grid').querySelector(`.vt-cell[data-graha="${graha}"][data-bhava="${bhava}"]`); if (c) try { c.focus(); } catch { /* */ } }
}

// roving-tabindex keyboard nav over the grid cells (synastry pattern):
// arrow keys move (row for ←/→, column for ↑/↓), Home/End jump, Enter opens.
function wireGridRoving(table) {
  if (!table) return;
  const cells = [...table.querySelectorAll('td.vt-cell')];
  if (!cells.length) return;
  const focusCell = t => { if (!t) return; cells.forEach(c => c.setAttribute('tabindex', c === t ? '0' : '-1')); try { t.focus(); } catch { /* */ } };
  const inRow = (cur, dir) => { const tr = cur.parentElement; const sib = [...tr.querySelectorAll('td.vt-cell')]; return sib[sib.indexOf(cur) + dir] || null; };
  const inCol = (cur, dir) => {
    const col = cur.cellIndex, rows = [...cur.parentElement.parentElement.children];
    let ri = rows.indexOf(cur.parentElement);
    for (ri += dir; ri >= 0 && ri < rows.length; ri += dir) { const cand = rows[ri].cells[col]; if (cand && cand.matches && cand.matches('td.vt-cell')) return cand; }
    return null;
  };
  table.addEventListener('keydown', e => {
    const cur = e.target.closest && e.target.closest('td.vt-cell');
    if (!cur || cells.indexOf(cur) < 0) return;
    const i = cells.indexOf(cur);
    let t = null;
    switch (e.key) {
      case 'ArrowRight': t = inRow(cur, 1) || cells[Math.min(i + 1, cells.length - 1)]; break;
      case 'ArrowLeft': t = inRow(cur, -1) || cells[Math.max(i - 1, 0)]; break;
      case 'ArrowDown': t = inCol(cur, 1) || cells[Math.min(i + 1, cells.length - 1)]; break;
      case 'ArrowUp': t = inCol(cur, -1) || cells[Math.max(i - 1, 0)]; break;
      case 'Home': t = cells[0]; break;
      case 'End': t = cells[cells.length - 1]; break;
      case 'Enter': case ' ': e.preventDefault(); select(cur.dataset.graha, +cur.dataset.bhava, true); return;
      default: return;
    }
    e.preventDefault();
    if (t && t !== cur) focusCell(t);
  });
  table.addEventListener('click', e => {
    const cur = e.target.closest && e.target.closest('td.vt-cell');
    if (cur) select(cur.dataset.graha, +cur.dataset.bhava, true);
  });
}

function witnessCol(name, w, opts = {}) {
  if (w && w.summary != null) {
    return `<div class="vt-witness">
      <h4>${esc(name)} <span class="vt-witness-locus">${esc(w.locus || '')}</span></h4>
      <p class="small">${esc(w.summary)}</p></div>`;
  }
  const note = (w && w.note) || opts.absentNote || 'No delineation recorded in this text.';
  return `<div class="vt-witness">
    <h4>${esc(name)} <span class="vt-witness-locus">— absent</span></h4>
    <p class="small vt-witness-absent">${esc(note)}</p></div>`;
}

function renderRecord() {
  const host = $('vd-record'); if (!host) return;
  if (!selected) { host.innerHTML = '<p class="muted">Pick a cell in the grid to read both witnesses.</p>'; return; }
  const rec = model.byKey.get(selected.graha + '|' + selected.bhava);
  if (!rec) { host.innerHTML = `<p class="muted">No record for ${esc(selected.graha)} in bhāva ${selected.bhava}.</p>`; return; }
  const badge = agreementBadge(rec.agreement);
  const contradiction = rec.contradictionNote
    ? `<div class="vt-contradiction small"><b>A genuine clash:</b> ${esc(rec.contradictionNote)}</div>` : '';
  const sensitive = rec.sensitiveNote
    ? `<div class="vt-sensitive small"><b>Tradition, not advice:</b> ${esc(rec.sensitiveNote)}</div>` : '';
  const sources = (rec.sources || []).length
    ? `<details class="small" style="margin-top:.5rem"><summary>Sources &amp; edition notes</summary>
        <ul class="clean small">${rec.sources.map(s => `<li>${esc(s)}</li>`).join('')}</ul></details>` : '';
  const isPlaced = placements.some(p => p.graha === selected.graha && p.bhava === selected.bhava);
  host.innerHTML = `
    <div class="vt-record-head">
      <h3>${GL[selected.graha] || ''} ${esc(selected.graha)} in the ${ordinal(selected.bhava)} bhāva
        <span class="small muted">(${esc(BHAVA_NAMES[selected.bhava - 1])})</span></h3>
      <span class="vt-agree vt-agree--${badge.cls}">${esc(badge.label)}</span>
    </div>
    ${isPlaced ? '<p class="small"><b>• This is one of your chart’s nine placements.</b></p>' : ''}
    <div class="vt-witnesses">
      ${witnessCol('Phaladīpikā', rec.phaladipika)}
      ${witnessCol('Sārāvalī', rec.saravali, { absentNote: 'Sārāvalī records no delineation here.' })}
    </div>
    ${contradiction}
    ${sensitive}
    <p class="small muted">Two witnesses, kept apart on purpose — the tradition holds both. Described, never prescribed.</p>
    ${sources}`;
  notifyReportFor(rec);
}

function notifyReportFor(rec) {
  lastReport = {
    kind: 'vedicdelineation',
    graha: selected.graha, bhava: selected.bhava, bhavaName: BHAVA_NAMES[selected.bhava - 1],
    agreement: rec.agreement || 'single witness',
    phaladipika: rec.phaladipika && { locus: rec.phaladipika.locus, summary: rec.phaladipika.summary },
    saravali: hasSaravali(rec) ? { locus: rec.saravali.locus, summary: rec.saravali.summary } : { absent: true, note: rec.saravali && rec.saravali.note },
    contradictionNote: rec.contradictionNote || null,
    sensitiveNote: rec.sensitiveNote || null,
    fromChart: placements.length ? placements : null,
    sources: rec.sources || [],
  };
  notifyReport();
}

function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

// ---------------------------------------------------------------------------
//  Init + modes
// ---------------------------------------------------------------------------
export function initVedicDelineation() {
  try { model = delinGridModel(BHAVA_PHALA); } catch (e) {
    const host = $('vd-grid'); if (host) host.innerHTML = `<p class="muted">Could not load the delineation data (${esc(e.message)}).</p>`;
    return;
  }
  renderGrid();
  // open a sensible default record (Sun in the 1st)
  select(model.grahas[0] || 'Sun', 1, false);

  // mode toggle
  const seg = $('vd-form').querySelector('.seg');
  if (seg) seg.addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn'); if (!btn) return;
    const mode = btn.dataset.mode;
    for (const b of seg.querySelectorAll('.seg-btn')) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    const fields = $('vd-chart-fields');
    if (mode === 'chart') { fields.hidden = false; mountPicker(); }
    else { fields.hidden = true; placements = []; renderGrid(); markSelected(); if (selected) renderRecord(); $('vd-status').textContent = ''; }
  });

  $('vd-form').addEventListener('submit', e => { e.preventDefault(); computeChart(); });

  // dv-assistant (kind wired via the integrator manifest)
  import('./divination-assistant.js').then(da => {
    if (da && da.initDivinationAssistant && $('dv-assistant')) {
      try {
        da.initDivinationAssistant({
          kind: 'vedicdelineation',
          getReading: () => lastReport,
          subscribeReading: cb => reportSubs.push(cb),
          copy: { emptyText: 'Pick a graha-in-bhāva cell above first.' },
        });
      } catch { /* non-fatal */ }
    }
  }).catch(() => { /* non-fatal */ });
}

async function mountPicker() {
  if (picker) return;
  const host = $('vd-picker'); if (!host) return;
  // seed a default birth moment
  $('vd-date').value = '1990-05-15'; $('vd-time').value = '12:00'; $('vd-offset').value = 0;
  $('vd-lat').value = 51.5074; $('vd-lon').value = -0.1278;
  const mp = await import('./moment-picker.js').catch(() => null);
  if (mp && mp.mountMomentPicker) {
    try {
      picker = mp.mountMomentPicker(host, {
        mode: 'birth',
        ids: { lat: 'vd-lat', lon: 'vd-lon', date: 'vd-date', time: 'vd-time', offset: 'vd-offset' },
        label: 'The birth moment & place',
        persist: 'wb',
      });
    } catch { /* non-fatal */ }
  }
}

async function computeChart() {
  const lat = parseFloat($('vd-lat').value), lon = parseFloat($('vd-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('vd-status').textContent = 'Enter a latitude and longitude.'; return; }
  const off = parseFloat($('vd-offset').value) || 0;
  const { toUTC } = await import('./shared.js').catch(() => ({ toUTC: null }));
  let dateUTC;
  try { dateUTC = toUTC ? toUTC($('vd-date').value, $('vd-time').value, off) : new Date($('vd-date').value + 'T' + ($('vd-time').value || '12:00') + 'Z'); }
  catch { $('vd-status').textContent = 'Could not read the birth moment.'; return; }

  let v;
  try { v = castVedic(castChart(dateUTC, lat, lon, 'whole'), { currentDate: new Date() }); }
  catch (e) { $('vd-status').textContent = `Could not compute the chart (${e.message}).`; return; }

  placements = chartPlacements(v);
  $('vd-status').textContent = `Nine placements ringed: ${placements.map(p => `${GL[p.graha] || p.graha}${p.bhava}`).join(' · ')}.`;
  renderGrid();
  // auto-open the first luminary placement
  const first = placements[0];
  if (first) select(first.graha, first.bhava, false);
  try { picker && picker.commitRecent && picker.commitRecent(); } catch { /* */ }
}
