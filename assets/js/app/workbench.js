// ============================================================================
//  workbench.js — drives pages/workbench.html, THE unified tool. One moment &
//  place → one `fullReading` (core/reading.js) → every block rendered, linked,
//  exportable, and offered to a local language model. It re-calls nothing: the
//  spine computes once and every panel (and the JSON export, and the assistant)
//  reads the SAME object. Cross-links are generated from core/registry.js, so
//  "where each number comes from" stays in sync with the code.
// ============================================================================
import { toUTC, nowLocalFields, VERDICT_LEGEND, autolinkResultPanels } from './shared.js';
import { writeStateToURL, readStateFromURL, copyShareLink, downloadJSON, downloadSVG, svgToPNG,
  downloadMarkdown, saveReadingEntry, listSavedReadings, removeSavedReading } from './state.js';
import { castChart, PLANET_GLYPHS } from '../core/astro.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { fullReading } from '../core/reading.js';
import { REGISTRY, byId } from '../core/registry.js';
import { HOUSES } from '../core/data/houses.js';
import { OPERATIONS } from '../core/election.js';
import { mansionOf } from '../core/data/lunar-mansions.js';
import { faceOf } from '../core/data/decan-faces.js';
import { starsInAspect } from '../core/data/behenian-stars.js';
import { prayerFor } from '../core/data/picatrix-prayers.js';
import { mansionImage } from '../core/data/mansion-images.js';
import { planetImage } from '../core/data/planet-images.js';
import { attachVedicPanel } from './vedic-panel.js';
import { attachPersonPicker } from './person.js';
import { eraAccuracy } from '../core/calendar.js';
import { renderExplainBlock, ensureExplainMount } from './explain-block.js';
import { explainWorkbench } from '../core/explain/workbench.js';
import { narrateChart } from '../core/explain/narrate.js';
import { renderNarrate } from './narrate.js';
import { initGlosstip } from './glosstip.js';

const $ = id => document.getElementById(id);
const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const STATE_KEYS = ['date', 'time', 'offset', 'lat', 'lon', 'system', 'op', 'q', 'bdate', 'btime', 'boffset', 'blat', 'blon'];

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const sgn = n => (n >= 0 ? '+' : '') + n;
const vbadge = v => `<span class="verdict ${v}">${v}</span>`;
const rel = p => String(p).replace(/^pages\//, '');           // path from inside pages/

// --- UI3 enhancers (moment-picker, action-bar, wheel/score-bar figures) ------
//  Loaded lazily and defensively so a worktree missing the parallel-built
//  B1/B2 modules degrades to a plain-input fallback instead of a broken page.
const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
const ENH = {};
let bar = null, pickerMain = null, pickerBirth = null;

// --- last computed reading + a tiny subscription, for the assistant ---------
let lastReading = null, lastChart = null, lastBirthChart = null, wheelSvg = null, vedicUpdate = null;
let sectAwareFortune = false;   // Lots toggle: Lilly's both-sects ⊕ (default) vs Ptolemaic night-reversal
const readingSubs = [];
export const getReading = () => lastReading;
// the live engine context tool-calls need (the actual castChart objects).
export const getContext = () => ({ chart: lastChart, birthChart: lastBirthChart });
export const subscribeReading = cb => { readingSubs.push(cb); if (lastReading) { try { cb(lastReading); } catch { /* ignore */ } } };

// Registry-driven header links for a panel: "how it's calculated" + dedicated tool.
function regLinks(id) {
  const e = byId(id); if (!e) return '';
  const parts = [];
  if (e.howItWorks) parts.push(`<a href="${esc(rel(e.howItWorks))}">how it's calculated ↗</a>`);
  const pg = (e.pages || []).find(p => !/master\.html$/.test(p)) || (e.pages || [])[0];
  if (pg) parts.push(`<a href="${esc(rel(pg))}">open the dedicated tool ↗</a>`);
  return parts.length ? '— ' + parts.join(' · ') : '';
}

export async function initWorkbench() {
  const f = nowLocalFields();
  $('wb-date').value = f.date; $('wb-time').value = f.time; $('wb-offset').value = f.offset;
  $('wb-lat').value = 51.5074; $('wb-lon').value = -0.1278;

  $('wb-op').innerHTML = OPERATIONS.map(o => `<option value="${o.key}">${esc(o.label)} (${o.ruler})</option>`).join('');
  // The horary house picker lives IN the horary card now (the main form no longer
  // asks it). Default to the general view (querent + Moon, no specific question).
  $('wb-horary-house').innerHTML = '<option value="">— querent &amp; Moon only (general) —</option>' +
    HOUSES.map(h => `<option value="${h.n}">${h.n} — ${esc(h.signifies.split(';')[0])}</option>`).join('');
  $('wb-horary-house').addEventListener('change', () => run());

  $('wb-form').addEventListener('submit', e => { e.preventDefault(); doCompute(); });
  $('wb-reset').addEventListener('click', () => resetForm());

  // Mount the moment-pickers + action bar (writes through to the legacy hidden ids),
  // then wire the export handlers onto whatever the bar (or fallback) rendered.
  await mountEnhancers();

  renderSaved();   // the on-device saved-readings list (auto-saved each compute)

  // restore shared state from the URL, if any
  const s = readStateFromURL(STATE_KEYS);
  const set = (k, id) => { if (s[k] != null && s[k] !== '') $(id).value = s[k]; };
  set('date', 'wb-date'); set('time', 'wb-time'); set('offset', 'wb-offset');
  set('lat', 'wb-lat'); set('lon', 'wb-lon'); set('system', 'wb-system');
  set('op', 'wb-op'); set('q', 'wb-horary-house');
  set('bdate', 'wb-bdate'); set('btime', 'wb-btime'); set('boffset', 'wb-boffset'); set('blat', 'wb-blat'); set('blon', 'wb-blon');
  if (s.bdate) $('wb-birth-details').open = true;

  renderAssistantPlaceholder();
  try { initGlosstip(); } catch { /* non-fatal: popovers degrade to plain gloss-links */ }
  run();
}

// The flagship "In plain words" block: a computed, attributed synthesis of the
// whole reading, mounted directly under the chart-health verdict banner (chart-ux
// §7.2). Pure text model (core/explain/workbench.js) → app renderer.
function renderExplain(r) {
  const mount = ensureExplainMount($('wb-summary'), 'wb-explain-mount');
  if (!mount) return;
  renderExplainBlock(mount, explainWorkbench(r), { textId: 'wb-explain-text' });
}

// "Read this chart aloud" — the guided-reading rail mounted directly under the
// wheel. Steps light the wheel via its data-el stamps (chart-ux §6). The step
// array is the same one serialized onto the reading for the AI/export.
function renderNarrateBlock(r) {
  const wheelEl = $('wb-wheel');
  const mount = ensureExplainMount(wheelEl, 'wb-narrate-mount');
  if (!mount) return;
  renderNarrate(mount, r.narrative || narrateChart(r), { wheelEl });
}

// The UI3 compute choreography: btn-busy → compute → focus+scroll the verdict banner
// → reveal the action bar. Uses B1's computeFlow where present, else a minimal inline path.
function doCompute() {
  const banner = $('wb-verdict-banner'), status = $('wb-status');
  const btn = $('wb-form').querySelector('button[type="submit"]');
  const cf = ENH.ab && ENH.ab.computeFlow;
  if (cf) { try { cf(btn, status, () => run(), { banner, firstPanel: $('wb-p-figure') }); return; } catch { /* fall through */ } }
  run();
  if (banner && !banner.hidden) {
    try { banner.tabIndex = -1; banner.focus({ preventScroll: true });
      banner.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' }); } catch { /* ignore */ }
  }
}

function resetForm() {
  const f = nowLocalFields();
  $('wb-date').value = f.date; $('wb-time').value = f.time; $('wb-offset').value = f.offset;
  $('wb-lat').value = 51.5074; $('wb-lon').value = -0.1278;
  for (const id of ['wb-blat', 'wb-blon', 'wb-bdate', 'wb-btime', 'wb-boffset']) { const e = $(id); if (e) e.value = ''; }
  run();
}

async function mountEnhancers() {
  const load = async p => { try { return await import(p); } catch { return null; } };
  ENH.mp = await load('./moment-picker.js');
  ENH.ab = await load('./action-bar.js');
  ENH.fig = await load('./viz/figure.js');
  ENH.wi = await load('./viz/wheel-interact.js');
  ENH.wr = await load('./wheel-rotate.js');
  ENH.sb = await load('../core/viz/score-bar.js');
  ENH.dg = await load('../core/dignities.js');
  try { const insp = await load('./viz/inspect.js'); insp && insp.initInspect && insp.initInspect(); } catch { /* non-fatal */ }

  // --- moment pickers (legacy-id write-through) ---
  const mount = (boxId, mode, ids) => {
    if (ENH.mp && ENH.mp.mountMomentPicker) {
      try {
        return ENH.mp.mountMomentPicker($(boxId), { mode, label: mode === 'birth' ? 'Birth moment & place' : 'The moment & place', persist: 'wb', ids, onChange: () => run() });
      } catch { /* fall through to fallback */ }
    }
    revealPickerFallback(boxId, Object.values(ids)); return null;
  };
  pickerMain = mount('wb-picker', 'question', { lat: 'wb-lat', lon: 'wb-lon', date: 'wb-date', time: 'wb-time', offset: 'wb-offset' });
  pickerBirth = mount('wb-bpicker', 'birth', { lat: 'wb-blat', lon: 'wb-blon', date: 'wb-bdate', time: 'wb-btime', offset: 'wb-boffset' });

  // "Tuned to a specific person": the saved-people picker on the birth section (unchanged).
  try {
    const summary = document.querySelector('#wb-birth-details summary');
    attachPersonPicker(summary,
      { bdate: $('wb-bdate'), btime: $('wb-btime'), boffset: $('wb-boffset'), blat: $('wb-blat'), blon: $('wb-blon') },
      { onSelect: () => { $('wb-birth-details').open = true; run(); } });
  } catch { /* non-fatal */ }

  // --- action bar: Export ▾ (the six form buttons move here) + Copy link + Ask AI ---
  const exportsMenu = [
    { id: 'wb-json', label: 'Download JSON' }, { id: 'wb-md', label: 'Download summary (MD)' },
    { id: 'wb-svg', label: 'Download chart (SVG)' }, { id: 'wb-png', label: 'Download chart (PNG)' },
    { id: 'wb-print', label: 'Print' },
  ];
  if (ENH.ab && ENH.ab.mountActionBar) {
    try {
      bar = ENH.ab.mountActionBar($('wb-actionbar'), {
        variant: 'tool', exports: exportsMenu, copyLinkId: 'wb-copy',
        askAI: () => { const a = $('wb-assistant-card'); if (a) { a.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto' }); const ta = a.querySelector('textarea, input'); ta && ta.focus(); } },
        summary: r => barSummary(r),
      });
    } catch { bar = null; }
  }
  if (!bar) injectFallbackExportBar($('wb-actionbar'), exportsMenu);
  wireExportHandlers();
}

function barSummary(r) {
  if (!r || !r.cautions) return { verdict: '', text: '' };
  const m = r.moment;
  return { verdict: r.cautions.verdict, text: `${m.angles.asc.label} rising · chart health ${r.cautions.label}` };
}

function wireExportHandlers() {
  const on = (id, fn) => { const el = $(id); if (el && !el.dataset.wbwired) { el.dataset.wbwired = '1'; el.addEventListener('click', fn); } };
  on('wb-copy', () => copyShareLink($('wb-status'), currentState()));
  on('wb-json', () => { if (lastReading) downloadJSON(lastReading, 'workbench-reading.json'); });
  on('wb-md', () => { if (lastReading) downloadMarkdown(lastReading, 'workbench-reading.md'); });
  on('wb-svg', () => downloadSVG(wheelSvg, 'chart.svg'));
  on('wb-png', () => { svgToPNG(wheelSvg, 'chart.png').catch(() => { $('wb-status').textContent = 'Could not export PNG.'; }); });
  on('wb-print', () => window.print());
}

// Fallbacks used only when the parallel-built modules are absent (worktree / offline failure).
function revealPickerFallback(boxId, ids) {
  const box = $(boxId); if (!box || box.dataset.fb) return; box.dataset.fb = '1';
  const meta = {
    lat: ['number', 'Lat °N', '0.0001'], lon: ['number', 'Lon °E', '0.0001'], date: ['date', 'Date'],
    time: ['time', 'Time (local)'], offset: ['number', 'UTC offset', '0.5'],
    blat: ['number', 'Birth Lat °N', '0.0001'], blon: ['number', 'Birth Lon °E', '0.0001'], bdate: ['date', 'Birth date'],
    btime: ['time', 'Birth time (local)'], boffset: ['number', 'Birth UTC offset', '0.5'],
  };
  const row = document.createElement('div'); row.className = 'field-row';
  for (const id of ids) {
    const input = $(id); if (!input) continue;
    const [type, label, step] = meta[id.replace(/^wb-/, '')] || ['text', id];
    input.type = type; if (step) input.step = step; input.style.width = type === 'number' ? '7rem' : '';
    const field = document.createElement('div'); field.className = 'field';
    const lab = document.createElement('label'); lab.setAttribute('for', id); lab.textContent = label;
    field.append(lab, input); row.appendChild(field);
  }
  box.appendChild(row);
}
function injectFallbackExportBar(box, items) {
  if (!box) return;
  const row = document.createElement('div'); row.className = 'field-row'; row.style.marginTop = '.6rem';
  const mk = (id, label) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn-secondary sm'; b.id = id; b.textContent = label; return b; };
  row.appendChild(mk('wb-copy', 'Copy shareable link'));
  for (const it of items) row.appendChild(mk(it.id, it.label));
  box.appendChild(row);
}

function currentState() {
  return {
    date: $('wb-date').value, time: $('wb-time').value, offset: $('wb-offset').value,
    lat: $('wb-lat').value, lon: $('wb-lon').value, system: $('wb-system').value,
    op: $('wb-op').value, q: $('wb-horary-house').value,
    bdate: $('wb-bdate').value, btime: $('wb-btime').value, boffset: $('wb-boffset').value,
    blat: $('wb-blat').value, blon: $('wb-blon').value,
  };
}

function run() {
  const lat = parseFloat($('wb-lat').value), lon = parseFloat($('wb-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('wb-status').textContent = 'Enter a latitude and longitude.'; return; }
  const date = toUTC($('wb-date').value, $('wb-time').value, parseFloat($('wb-offset').value) || 0);
  const system = $('wb-system').value;
  const operationKey = $('wb-op').value || 'love';
  const quesitedHouse = $('wb-horary-house').value ? parseInt($('wb-horary-house').value, 10) : null;

  // optional birth chart → the natal/trajectory block
  let birth = null;
  const blat = parseFloat($('wb-blat').value), blon = parseFloat($('wb-blon').value);
  if ($('wb-bdate').value && $('wb-btime').value && !isNaN(blat) && !isNaN(blon)) {
    try {
      const bdate = toUTC($('wb-bdate').value, $('wb-btime').value, parseFloat($('wb-boffset').value) || 0);
      birth = { chart: castChart(bdate, blat, blon, system) };
    } catch { birth = null; }
  }

  const chart = castChart(date, lat, lon, system);
  const reading = fullReading(chart, { operationKey, quesitedHouse, birth, sectAwareFortune, generatedAt: new Date().toISOString() });
  // The 'read this chart aloud' narrative order (chart-ux §6): serialize the step
  // list onto the reading so the AI assistant, the JSON export and the Markdown
  // export inherit the site's canonical reading order for free.
  try { reading.narrative = narrateChart(reading); } catch { reading.narrative = []; }
  lastReading = reading; lastChart = chart; lastBirthChart = birth ? birth.chart : null;
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel({ before: '#wb-horary-card' }); vedicUpdate(chart); } catch { /* non-fatal */ }

  // chart wheel — through mountFigure + wireWheel + attachWheelRotate (with a plain fallback)
  try {
    const bodies = {}; for (const p of PLANETS7) bodies[p] = chart.planets[p];
    renderWheel($('wb-wheel'), chart, allAspects(bodies), reading);
  } catch { /* non-fatal */ }

  safe(() => renderNarrateBlock(reading));
  safe(() => renderSummary(reading));
  safe(() => renderVerdictBanner(reading));
  safe(() => renderExplain(reading));
  safe(() => renderEraBadge(chart));
  safe(() => renderMoment(reading));
  safe(() => renderDignities(reading));
  safe(() => renderAspects(reading));
  safe(() => renderLots(reading));
  safe(() => renderCautions(reading));
  safe(() => renderHorary(reading));
  safe(() => renderElection(reading));
  safe(() => renderTalisman(reading));
  safe(() => renderNatal(reading));
  safe(() => renderReference());
  safe(() => renderJSON(reading));
  safe(() => renderCitations(reading));

  // P1-2: auto-link unexplained jargon in the freshly-rendered prose panels
  // (the static autolinker at mount can't reach DOM injected by a compute).
  safe(() => autolinkResultPanels(['wb-explain-text', 'wb-summary', 'wb-lots', 'wb-aspects', 'wb-cautions',
    'wb-horary', 'wb-election', 'wb-talisman', 'wb-natal']));

  writeStateToURL(currentState());
  $('wb-status').textContent = '';
  try { autoSave(reading); } catch { /* non-fatal: saving never blocks the reading */ }
  try { pickerMain && pickerMain.commitRecent && pickerMain.commitRecent(); } catch { /* non-fatal */ }
  try { pickerBirth && pickerBirth.commitRecent && $('wb-blat').value && pickerBirth.commitRecent(); } catch { /* non-fatal */ }
  try { bar && bar.show && bar.show(reading); } catch { /* non-fatal */ }
  for (const cb of readingSubs) { try { cb(reading); } catch { /* ignore */ } }
}

// Render the wheel through B2's figure/interaction pipeline; fall back to the plain
// DOM renderer when those modules aren't present. The wheel modules (wireWheel /
// attachWheelRotate) consume the RAW chart shape ({asc, planets, aspects[]}) exactly
// as horary does — never the fullReading. We hand them a small adapter that carries
// the raw chart, the drawn aspects ARRAY (so aspect-line hover's `.find` works, and
// the rotor's `chart.asc` is a number, not NaN), and a per-planet essential-dignity
// map so the pin card can print Lilly's −5…+5 essential-total line. [ui3-spec §10.2]
function wheelReadingAdapter(chart, aspects, reading) {
  let dignities;
  try {
    const pp = reading && reading.dignities && reading.dignities.perPlanet;
    if (pp) dignities = Object.fromEntries(PLANETS7.filter(n => pp[n] && pp[n].essential).map(n => [n, pp[n].essential]));
  } catch { /* dignity line is optional */ }
  return { chart, aspects, dignities };
}
function renderWheel(container, chart, aspects, reading) {
  const rd = wheelReadingAdapter(chart, aspects, reading);
  if (ENH.fig && ENH.fig.mountFigure) {
    try {
      const svgEl = renderChart(document.createElement('div'), chart, aspects, { size: 520 });
      container.innerHTML = '';
      ENH.fig.mountFigure(container, { svg: svgEl.outerHTML, ariaLabel: 'Chart wheel — planets are buttons', caption: '' });
      const mounted = container.querySelector('svg');
      wheelSvg = mounted;
      try { ENH.wi && ENH.wi.wireWheel && ENH.wi.wireWheel(mounted, rd, aspects); } catch { /* non-fatal */ }
      try { ENH.wr && ENH.wr.attachWheelRotate && ENH.wr.attachWheelRotate(container, rd); } catch { /* non-fatal */ }
      return;
    } catch { /* fall through */ }
  }
  renderChart(container, chart, aspects, { size: 520 });
  wheelSvg = container.querySelector('svg');
}

// --- save / publish ---------------------------------------------------------
const stateKey = s => Object.values(s).join('|');
function autoSave(reading) {                       // silent: no status, no network
  const s = currentState();
  const asc = reading && reading.moment && reading.moment.angles ? reading.moment.angles.asc.label : '';
  const label = `${s.date || ''} ${s.time || ''}${asc ? ' · ' + asc + ' asc' : ''} · ${s.lat},${s.lon}`.trim();
  saveReadingEntry({ key: stateKey(s), ts: new Date().toISOString(), label, state: s });
  renderSaved();
}
function renderSaved() {
  const box = $('wb-saved'); if (!box) return;
  const list = listSavedReadings();
  if (!list.length) { box.innerHTML = '<span class="muted">No saved readings yet — every reading you compute is auto-saved here, on this device only.</span>'; return; }
  box.innerHTML = '<b>Saved on this device:</b><ul class="clean">' + list.map(e =>
    `<li><a href="#" class="gloss-link" data-restore="${esc(e.key)}">${esc(e.label || e.ts)}</a> <span class="muted small">${esc((e.ts || '').slice(0, 16).replace('T', ' '))}</span> · <a href="#" class="small muted" data-remove="${esc(e.key)}">remove</a></li>`).join('') + '</ul>';
  box.querySelectorAll('a[data-restore]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); restoreSaved(a.getAttribute('data-restore')); }));
  box.querySelectorAll('a[data-remove]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); removeSavedReading(a.getAttribute('data-remove')); renderSaved(); }));
}
function restoreSaved(key) {
  const e = listSavedReadings().find(x => x.key === key); if (!e || !e.state) return;
  for (const [k, v] of Object.entries(e.state)) { const id = 'wb-' + (k === 'q' ? 'horary-house' : k); if ($(id) != null && v != null) $(id).value = v; }
  if (e.state.bdate) $('wb-birth-details').open = true;
  run();
}

const safe = fn => { try { fn(); } catch (e) { /* a failing panel never breaks the page */ } };

// --- renderers --------------------------------------------------------------
function renderSummary(r) {
  const m = r.moment;
  const ph = m.planetaryHour;
  $('wb-summary').innerHTML =
    `<strong>${esc(m.angles.asc.label)}</strong> ascending · MC <strong>${esc(m.angles.mc.label)}</strong> · ` +
    `${m.isDay ? 'a <b>day</b> chart' : 'a <b>night</b> chart'}` +
    (ph ? ` · planetary hour of <b>${esc(ph.ruler)}</b> ${G(ph.ruler)} (a ${esc(ph.dayRuler)}-day)` : '') +
    ` · chart health ${vbadge(r.cautions.verdict)}`;
  $('wb-moment-cite').textContent = '— positions from astronomy-engine (~1′); Regiomontanus houses';
}

// The chart-health verdict, lifted to a full-width banner right after the form
// (plan §1.3.9). `role="status"` on the element makes the compute announce
// itself; the banner links down to the Chart-health panel's evidence.
function renderVerdictBanner(r) {
  const banner = $('wb-verdict-banner'); if (!banner || !r || !r.cautions) return;
  const c = r.cautions;
  const mod = c.verdict === 'green' ? 'ok' : c.verdict === 'amber' ? 'warn' : 'bad';
  const counts = `${c.counts.caution} caution${c.counts.caution === 1 ? '' : 's'}, ${c.counts.bad} grave`;
  banner.className = 'verdict-banner verdict-banner--' + mod;
  banner.hidden = false;
  banner.innerHTML =
    `${vbadge(c.verdict)} <span class="vb-reason">Chart health — ${esc(c.label)} <span class="muted">(${counts})</span></span>` +
    `<a class="vb-link" href="#wb-p-health">see the evidence ↓</a>`;
}

// Historical-era honesty (R16): charts outside the casting-grade window carry
// their accuracy tier and the ΔT line — the recorded-time and time-scale
// uncertainty dwarfs the ephemeris there. Display policy, not a computation.
function renderEraBadge(chart) {
  const year = chart.date.getUTCFullYear();
  const tier = eraAccuracy(year);
  if (tier.grade === 'casting') return;
  const dT = tier.deltaTSeconds, sig = tier.deltaTSigmaSeconds;
  const fmt = s => s >= 3600 ? `${(s / 3600).toFixed(1)} h` : s >= 90 ? `${(s / 60).toFixed(1)} min` : `${Math.round(s)} s`;
  $('wb-moment-cite').textContent =
    `— positions from astronomy-engine (~1′); Regiomontanus houses · HISTORICAL DATE, ${tier.label.toUpperCase()}: ` +
    tier.note + (dT != null ? ` ΔT ≈ ${fmt(dT)} (Espenak–Meeus), uncertainty ±${fmt(sig)} at this epoch (Morrison & Stephenson 2004).` : '') +
    (year < 1583 ? ' Dates are proleptic Gregorian — sources of this era record JULIAN dates; convert before casting (see the Chronology wing).' : '');
}

function renderMoment(r) {
  let rows = '';
  for (const name of Object.keys(r.moment.planets)) {
    const p = r.moment.planets[name];
    const dig = r.dignities.perPlanet[name];
    rows += `<tr><td>${G(name)} ${esc(name.replace('Node', ' Node'))}</td>
      <td class="l">${esc(p.label)}${p.retrograde ? ' ℞' : ''}</td><td>${p.house}</td>
      <td class="num small">${p.speed != null ? p.speed.toFixed(2) : ''}</td>
      <td class="num ${dig ? (dig.sumTotal >= 0 ? 'pos' : 'neg') : 'muted'}">${dig ? sgn(dig.sumTotal) : '·'}</td></tr>`;
  }
  // F-TITLE-ONLY sweep: the cryptic column heads carried their meaning in a
  // native `title=` (touch/SR-invisible). Surface it as visible text + a glosstip
  // ⓘ chip (chart-ux §1.2, §5.3).
  const thChip = (term, slug, label) => `<button type="button" class="term-chip" data-term="${esc(term)}" data-slug="${slug}" aria-label="Glossary: ${esc(label)}"><span class="tc-i" aria-hidden="true">ⓘ</span></button>`;
  $('wb-moment').innerHTML = `<div class="table-scroll"><table class="data"><thead><tr><th>Body</th><th>Position</th><th>Ho. ${thChip('Angular / Succedent / Cadent', 'angular-succedent-cadent', 'House (Ho.)')}</th><th class="num">Speed <span class="small muted">(°/day)</span></th><th class="num">Dignity <span class="small muted">(ess.+acc.)</span> ${thChip('Essential Dignity', 'essential-dignity', 'Dignity — essential plus accidental')}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderDignities(r) {
  $('wb-dignities-links').innerHTML = regLinks('essential-dignity');
  let rows = '';
  for (const name of PLANETS7) {
    const d = r.dignities.perPlanet[name];
    const kinds = d.essential.rows.map(x => `<span class="${x.score >= 0 ? 'pos' : 'neg'}">${esc(x.kind)}</span>`).join(', ');
    rows += `<tr><td>${G(name)} ${name}</td><td class="l small">${kinds}</td>
      <td class="num ${d.essential.total >= 0 ? 'pos' : 'neg'}">${sgn(d.essential.total)}</td>
      <td class="num ${d.accidental.total >= 0 ? 'pos' : 'neg'}">${sgn(d.accidental.total)}</td>
      <td class="num ${d.sumTotal >= 0 ? 'pos' : 'neg'}"><b>${sgn(d.sumTotal)}</b></td></tr>`;
  }
  const a = r.dignities.almutens, log = r.dignities.lordOfGeniture;
  $('wb-dignities').innerHTML =
    `<div class="table-scroll"><table class="data"><thead><tr><th>Planet</th><th>Essential dignities</th><th class="num">Ess.</th><th class="num">Acc.</th><th class="num">Total</th></tr></thead><tbody>${rows}</tbody></table></div>
     ${dignityBars(r)}
     <p class="small">Almuten of the Ascendant: <b>${esc(a.ascendant.planet)}</b> (score ${a.ascendant.score}) · of the MC: <b>${esc(a.midheaven.planet)}</b> (${a.midheaven.score}).
       Lord of the Geniture (greatest total dignity): <b>${esc(log.planet)}</b> (${sgn(log.score)}).</p>`;
}

// Anchored essential-dignity score bars, one per planet, sorted strongest-first.
function dignityBars(r) {
  try {
    if (!(ENH.sb && ENH.sb.scoreBar && ENH.dg && ENH.dg.dignityScoreDomain)) return '';
    const domain = ENH.dg.dignityScoreDomain();
    const items = PLANETS7.map(name => ({ name, total: r.dignities.perPlanet[name].essential.total })).sort((x, y) => y.total - x.total);
    const bars = items.map(it => {
      const { svg } = ENH.sb.scoreBar({ value: it.total, domain, anchors: [{ v: 5, label: 'domicile +5' }, { v: -5, label: 'detriment −5' }], zero: 0, label: `${it.name} essential`, tone: null });
      return `<div class="wb-dig-bar" style="display:flex;align-items:center;gap:.5rem"><span style="width:5.5rem" class="small">${G(it.name)} ${it.name}</span>${svg}</div>`;
    }).join('');
    return `<div class="wb-dig-bars" style="margin-top:.7rem;display:grid;gap:.25rem">${bars}</div>`;
  } catch { return ''; }
}

function renderAspects(r) {
  $('wb-aspects-links').innerHTML = regLinks('aspects');
  const list = r.aspects.list;
  const asp = list.length
    ? '<ul class="clean">' + list.map(a => `<li data-el="aspect-${esc(a.from)}-${esc(a.to)}-${esc(a.aspect)}" data-pair="${esc(a.from)},${esc(a.to)}">${G(a.from)} ${a.from} <b>${a.glyph} ${a.aspect}</b> ${G(a.to)} ${a.to} — <span class="${a.applying ? 'pos' : 'muted'}">${a.applying ? 'applying' : 'separating'}</span>, orb ${a.orb.toFixed(1)}°${a.partile ? ' <b>(partile)</b>' : ''}</li>`).join('') + '</ul>'
    : '<p class="muted">No aspects within orb.</p>';
  const rec = r.aspects.receptions.length
    ? '<p class="small"><b>Reception:</b> ' + r.aspects.receptions.map(x => `${x.a}↔${x.b} (${x.a} in ${x.b}’s ${x.byA.join('/')}; ${x.b} in ${x.a}’s ${x.byB.join('/')})`).join('; ') + '</p>'
    : '<p class="small muted">No mutual reception among the seven.</p>';
  $('wb-aspects').innerHTML = asp + rec;
}

function renderLots(r) {
  $('wb-lots-links').innerHTML = regLinks('part-of-fortune');
  const L = r.lots;
  const list = L.list || [];
  const hermetic = list.filter(l => l.cat === 'hermetic');
  const topic = list.filter(l => l.cat === 'topic');
  const lotRow = l => `<tr><td>${l.glyph ? l.glyph + ' ' : ''}${esc(l.name)}</td><td class="l">${esc(l.label)}${l.house ? ` <span class="muted">(${l.house}h)</span>` : ''}</td><td class="l small muted">${esc(l.topic)}${l.confidence && l.confidence !== 'high' ? ' <span class="neg">[formula contested]</span>' : ''}</td></tr>`;
  let anti = '';
  for (const name of PLANETS7) {
    const p = r.moment.planets[name];
    anti += `<tr><td>${G(name)} ${name}</td><td class="l">${esc(p.antiscion.label)}</td><td class="l muted">${esc(p.contraAntiscion.label)}</td></tr>`;
  }
  $('wb-lots').innerHTML =
    `<label class="small" style="display:inline-flex;align-items:center;gap:.3rem;margin-bottom:.4rem">
       <input type="checkbox" id="wb-lots-sect" ${L.sectAware ? 'checked' : ''}> sect-aware Lots (Ptolemy: reverse by night) — off = Lilly's both-sects ⊕</label>
     <p class="small muted" style="margin:.1rem 0 .5rem">The <b>seven Hermetic Lots</b> (Paulus): each a point Asc + A − B. <b>Fortune</b> is the body &amp; material life; <b>Spirit</b> its mirror (mind &amp; action); the five planetary Lots build from them.</p>
     <div class="table-scroll"><table class="data"><caption class="small muted">The seven Hermetic Lots</caption><thead><tr><th scope="col" class="l">Lot</th><th scope="col" class="l">Position</th><th scope="col" class="l">Signifies</th></tr></thead><tbody>${hermetic.map(lotRow).join('')}</tbody></table></div>
     ${topic.length ? `<p class="small" style="margin:.6rem 0 .2rem"><b>Natal topic Lots</b> <span class="muted">(formulas vary by author — Paulus shown)</span></p>
       <div class="table-scroll"><table class="data"><tbody>${topic.map(lotRow).join('')}</tbody></table></div>` : ''}
     <p class="small" style="margin:.7rem 0 .2rem"><b>Antiscia</b> (a point's solstitial shadow — a hidden contact)</p>
     <div class="table-scroll"><table class="data"><thead><tr><th scope="col">Planet</th><th scope="col">Antiscion</th><th scope="col">Contra-antiscion</th></tr></thead><tbody>${anti}</tbody></table></div>`;
  const t = $('wb-lots-sect');
  if (t) t.addEventListener('change', () => { sectAwareFortune = t.checked; run(); });
}

function renderCautions(r) {
  $('wb-cautions-links').innerHTML = regLinks('chart-health');
  const c = r.cautions;
  const adv = c.global.map(a => {
    const cls = a.severity === 'good' ? 'pos' : a.severity === 'caution' ? 'neg' : 'muted';
    const icon = a.severity === 'good' ? '✓' : a.severity === 'caution' ? '⚠' : '·';
    return `<li><span class="${cls}">${icon}</span> ${esc(a.text)}</li>`;
  }).join('');
  const sig = c.significators || { primary: [], secondary: [] };
  const affl = c.afflictedSignificators || [];
  $('wb-cautions').innerHTML =
    `<p style="font-size:1.05rem">Verdict: ${vbadge(c.verdict)} — ${esc(c.label)}</p>
     ${VERDICT_LEGEND}
     <p class="small"><b>Significators of the matter:</b> ${sig.primary.map(p => `${G(p)} ${esc(p)}`).join(', ')}${sig.secondary && sig.secondary.length ? ` <span class="muted">(also ${sig.secondary.map(p => esc(p)).join(', ')})</span>` : ''}.
       ${affl.length ? `<span class="neg">Afflicted: ${affl.map(p => `${G(p)} ${esc(p)}`).join(', ')}.</span>` : '<span class="pos">None of them is gravely afflicted.</span>'}</p>
     <ul class="clean">${adv}</ul>
     <p class="small muted">The verdict is <b>weighted by the significators</b> (a flaw on the Lord of the Ascendant, the Moon, the sect light or the quesited's lord weighs far more than one on an unrelated planet) — weighted impediment ${c.impediment}. ${c.counts.caution} caution, ${c.counts.bad} grave in all.</p>`;
}

function renderHorary(r) {
  $('wb-horary-links').innerHTML = regLinks('perfection');
  // GENERAL view (no specific question house chosen): the querent's significator
  // and the Moon's condition & next aspect — the horary "state of play" that needs
  // no quesited house. Pick a house above for the quesited significator & perfection.
  if (!r.horary) {
    const lordAsc = r.cautions.lordAsc;
    const qp = lordAsc ? r.moment.planets[lordAsc] : null;
    const moon = r.moment.planets.Moon;
    let mn = null;
    for (const a of r.aspects.list) {
      if ((a.from === 'Moon' || a.to === 'Moon') && a.applying && (!mn || a.orb < mn.orb)) mn = { other: a.from === 'Moon' ? a.to : a.from, aspect: a.aspect, glyph: a.glyph, orb: a.orb };
    }
    const sel = r.election.selected, voc = sel && sel.moon ? sel.moon.voidOfCourse : false;
    $('wb-horary').innerHTML =
      `<p class="small muted">The <b>general</b> horary state — the querent's significator and the Moon. Choose the house your question is about (above) for the quesited significator and the modes of perfection.</p>
       <p><b>Querent</b> — the Lord of the Ascendant is ${qp ? `${G(lordAsc)} <b>${esc(lordAsc)}</b> at ${esc(qp.label)} in the ${qp.house}th house` : esc(lordAsc || 'n/a')}, with the Moon as co-significator.</p>
       <p><b>The Moon</b> is in ${esc(moon.sign)}, the ${moon.house}th house${voc ? ', and is <b>void of course</b> — "nothing will come of the matter"' : (mn ? `; she next applies to a <b>${esc(mn.aspect.toLowerCase())}</b> ${mn.glyph || ''} of <b>${G(mn.other)} ${esc(mn.other)}</b> (orb ${mn.orb.toFixed(1)}°)` : '')}.</p>`;
    return;
  }
  const h = r.horary;
  const modeLines = [];
  const M = h.perfection.modes || {};
  if (h.sharedSignificator) modeLines.push('Querent &amp; quesited share one significator — a strong, often affirmative testimony.');
  if (M.direct) modeLines.push(`<b>Direct ${esc(M.direct.aspect.toLowerCase())}</b> ${M.direct.glyph} — <span class="${M.direct.applying ? 'pos' : 'muted'}">${M.direct.applying ? 'applying, the matter perfects' : 'separating, past or denied'}</span> (orb ${M.direct.orb.toFixed(1)}°).`);
  if (M.translation) modeLines.push(`<b>Translation of light</b>: ${esc(M.translation.carrier)} carries light from ${esc(M.translation.from)} to ${esc(M.translation.to)}.`);
  if (M.collection) modeLines.push(`<b>Collection of light</b>: ${esc(M.collection.collector)} collects both significators${M.collection.received ? ', receiving them' : ''}.`);
  if (M.reception) modeLines.push(`<b>Reception</b>: ${M.reception.mutual ? 'mutual' : 'one-way'} reception between the significators.`);
  if (M.prohibition) modeLines.push(`<span class="neg"><b>Prohibition</b></span>: ${esc(M.prohibition.planet)} perfects with ${esc(M.prohibition.target)} first.`);
  if (M.refranation) modeLines.push(`<span class="neg"><b>Refranation</b></span>: ${esc(M.refranation.planet)} turns retrograde before perfecting.`);
  if (h.timing) modeLines.push(`<b>Timing</b>: ${esc(h.timing.text)} <span class="muted">(Lilly proportions a mean — an estimate).</span>`);
  if (!modeLines.length) modeLines.push('No direct aspect, translation or collection within orb — read the Moon.');
  const mn = h.moonCoSignificator.nextAspect;
  $('wb-horary').innerHTML =
    `<p class="small muted">Shown for house ${h.quesitedHouse} (${esc((h.quesitedSignifies || '').split(';')[0])}). Choose the house your question is about, or “— none —” to hide.</p>
     <p><b>Querent</b> — ${esc(h.querent.lordAsc)} ${G(h.querent.lordAsc)}${h.querent.label ? ` at ${esc(h.querent.label)} in the ${h.querent.house}th (ess. ${sgn(h.querent.essentialTotal)})` : ''}, with the Moon as co-significator.</p>
     <p><b>Quesited</b> — the ${h.quesitedHouse}th, ruled by ${esc(h.quesited.lordQ)} ${G(h.quesited.lordQ)}${h.quesited.label ? ` at ${esc(h.quesited.label)} in the ${h.quesited.house}th (ess. ${sgn(h.quesited.essentialTotal)})` : ''}.</p>
     <p>${h.moonCoSignificator.voidOfCourse ? 'The Moon is <b>void of course</b> — she makes no further applying aspect before leaving her sign.' : (mn ? `The Moon next applies to a <b>${esc(mn.aspect.toLowerCase())}</b> ${mn.glyph} of <b>${esc(mn.to)}</b> (orb ${mn.orb.toFixed(1)}°).` : '')}</p>
     <ul class="clean">${modeLines.map(l => `<li>${l}</li>`).join('')}</ul>`;
}

function renderElection(r) {
  $('wb-election-links').innerHTML = regLinks('election');
  const sel = r.election.selected;
  let html = '';
  if (sel) {
    const reasons = sel.reasons.map(x => {
      const cls = x.severity === 'bad' ? 'neg' : x.severity === 'caution' ? 'neg' : x.severity === 'good' ? 'pos' : 'muted';
      return `<li><span class="${cls}">${esc(x.severity)}</span> (${sgn(x.delta)}) ${esc(x.text)} <span class="small muted">— ${esc(x.cite)}</span></li>`;
    }).join('');
    html += `<p style="font-size:1.05rem">For <b>${esc(sel.operation.label)}</b> (${esc(sel.operation.ruler)}): ${vbadge(sel.verdict)} — ${esc(sel.label)} <span class="muted">(score ${sel.score})</span></p>`;
    if (sel.gating && sel.gating.length) html += `<p class="neg small">Hard requirement unmet: ${esc(sel.gating.join('; '))} — the tradition would not call this fit, however high the score.</p>`;
    html += `<ul class="clean small">${reasons}</ul>`;
  }
  const pz = r.natal && r.natal.personalization;
  const fitOf = key => pz && pz.aims ? (pz.aims.find(a => a.key === key) || {}).fit : null;
  const fitBadge = f => f === 'suits' ? '<span class="verdict green">suits you</span>' : f === 'caution' ? '<span class="verdict red">caution</span>' : f === 'neutral' ? '<span class="muted">neutral</span>' : '';
  const rank = r.election.rankedNow.map(o => `<tr><td>${esc(o.label)}</td><td>${G(o.ruler)} ${o.ruler}</td><td>${vbadge(o.verdict)}</td><td class="num">${o.score}</td>${pz ? `<td>${fitBadge(fitOf(o.key))}</td>` : ''}</tr>`).join('');
  html += `<p class="small"><b>All aims ranked for this moment${pz ? ', and tuned to the nativity' : ''}:</b></p>
     <div class="table-scroll"><table class="data"><thead><tr><th scope="col">Aim</th><th scope="col">Ruler</th><th scope="col">Verdict (now)</th><th scope="col" class="num">Score</th>${pz ? '<th scope="col">For you</th>' : ''}</tr></thead><tbody>${rank}</tbody></table></div>`;
  if (pz) html += personalizationHtml(pz, r.election.operationKey);
  // Picatrix correspondences of the moment (mansion / decan faces / Behenian stars)
  if (lastChart) {
    try {
      const moon = lastChart.planets.Moon, sun = lastChart.planets.Sun;
      const mm = mansionOf(moon.lon), mf = faceOf(moon.lon), sf = faceOf(sun.lon);
      const stars = starsInAspect(lastChart, 6);
      const starsTxt = stars.length ? stars.map(s => `${G(s.planet)} ${esc(s.planet)} ∠ ${esc(s.star)} (${s.sep.toFixed(1)}°)`).join('; ') : 'none closely conjunct a planet now';
      const mi = mansionImage(mm.num);
      html += `<p class="small" style="margin-top:.6rem"><b>Picatrix correspondences of the moment:</b> Moon in <b>Mansion ${mm.num} — ${esc(mm.name)}</b> (“${esc(mm.use)}”); Moon’s face ${esc(mf.ruler)} — ${esc(mf.image)}; Sun’s face ${esc(sf.ruler)}. Behenian contacts: ${starsTxt}.</p>` +
        (mi ? `<p class="small muted">Mansion ${mm.num} talismanic image (historical): ${esc(mi.image)} <i>— ${esc(mi.purpose)}</i> <span class="small">[${esc(mi.citation)}]</span></p>` : '');
    } catch { /* non-fatal */ }
  }
  $('wb-election').innerHTML = html;
}

// "Tuned to this nativity" — the Picatrix personalization layer (only when a
// birth moment is present). Answers, honestly: does a birthdate bear on the
// magic? It is primarily electional, but the native's chart TUNES which works
// suit them (Picatrix III.5–6).
function personalizationHtml(pz, currentKey) {
  const suits = pz.aims.filter(a => a.fit === 'suits').map(a => a.label);
  const cautions = pz.aims.filter(a => a.fit === 'caution');
  const cur = pz.aims.find(a => a.key === currentKey);
  return `<div class="callout" style="margin-top:.7rem"><span class="label">Tuned to this nativity (Picatrix III.5–6)</span>
    <p class="small" style="margin:.2rem 0">Picatrix magic is chiefly about the <b>moment</b> — but the tradition tunes it to you.
      This nativity's <b>ruling planets</b> are ${pz.rulingPlanets.map(p => `${G(p)} ${esc(p)}`).join(', ')}; the
      <b>almuten figuris</b> — “the planet that governs you”, the planet of your <b>Perfect Nature</b> — is
      <b>${G(pz.perfectNature.planet)} ${esc(pz.perfectNature.planet)}</b>.</p>
    <p class="small" style="margin:.2rem 0"><b>Works naturally yours:</b> ${suits.length ? esc(suits.join(', ')) : '—'}.
      ${cautions.length ? `<span class="neg"><b>Approach with caution:</b> ${cautions.map(a => esc(a.label)).join(', ')}</span> — the tradition warns against strengthening a planet that signifies harm in your own chart.` : ''}</p>
    ${cur ? `<p class="small" style="margin:.2rem 0">For the selected aim (<b>${esc(cur.label)}</b>): <b>${cur.fit === 'suits' ? 'suits you' : cur.fit === 'caution' ? 'caution' : 'neutral for you'}</b> — ${esc(cur.reason)}</p>` : ''}
    <p class="small muted" style="margin:.2rem 0 0">${esc(pz.perfectNature.description)} <span class="muted">${esc(pz.citation)}</span></p></div>`;
}

function renderTalisman(r) {
  $('wb-talisman-links').innerHTML = regLinks('talisman');
  const t = r.talisman;
  if (!t) { $('wb-talisman').innerHTML = '<p class="muted">No recipe.</p>'; return; }
  const sp = t.materials.spirits;
  const steps = t.steps.map(s => `<li>${esc(s.text)} <span class="small muted">— ${esc(s.cite)}</span></li>`).join('');
  const pimg = planetImage(t.planet);
  const imgHtml = pimg ? `<p class="small"><b>Planetary talismanic image (historical):</b> ${esc(pimg.image)} <i>— ${esc(pimg.purpose)}</i> <span class="muted small">[${esc(pimg.citation)}]</span></p>` : '';
  const pr = prayerFor(t.planet);
  const prayerHtml = pr ? `<p class="small"><b>Picatrix Book III — the prayer &amp; spirit of ${esc(t.planet)}:</b>
       addressed as <i>${esc(pr.address.split('.')[0].toLowerCase())}</i>; prayer-angel ${esc(pr.prayerAngel.latin || '—')}, directional spirit ${esc(pr.spirit.master)}.
       <br><span class="muted">“${esc(pr.prayerExcerpt.slice(0, 150))}…”</span>
       <a href="picatrix/prayers.html">full prayer &amp; spirits ↗</a>${pr.flag ? ` <span class="neg">⚠ ${esc(pr.flag.split('—')[0])}</span>` : ''}
       <span class="muted small">— historical text, described not prescribed.</span></p>` : '';
  $('wb-talisman').innerHTML =
    `<p>Aim: <b>${esc(t.aim)}</b> · ruling planet <b>${esc(t.planet)}</b> ${G(t.planet)} · this moment: ${vbadge(t.verdict)}</p>
     <p class="small"><b>Materials (historical):</b> suffumigation ${esc(t.materials.suffumigation)}; colour ${esc(t.materials.colour)};
       metal ${esc(t.materials.metal)}; stone ${esc(t.materials.stone)}. <b>Powers (kept distinct):</b>
       Picatrix prayer-angel ${esc(sp.picatrixPrayerAngel)}; Agrippa angel ${esc(sp.agrippa.angel)}, intelligence ${esc(sp.agrippa.intelligence)}, spirit ${esc(sp.agrippa.spirit)}.</p>
     ${imgHtml}
     ${prayerHtml}
     <ol class="small">${steps}</ol>
     <p class="small muted">${esc(t.disclaimer)}</p>`;
}

function renderNatal(r) {
  const card = $('wb-natal-card');
  $('wb-natal-links').innerHTML = regLinks('life-trajectory');
  if (!r.natal) {
    $('wb-natal').innerHTML = '<p class="muted">Add a birth date, time and place in the form above (open “Optional — add a birth moment”) to compute the whole-life trajectory: natal signatures, the profection timeline &amp; Lord of the Year, primary directions, the solar return, and a personalised Picatrix overlay.</p>';
    return;
  }
  const tj = r.natal.trajectory;
  const n = tj.natal, cy = tj.currentYear;
  const cur = tj.timeline.find(t => t.current);
  $('wb-natal').innerHTML =
    `<p><b>Natal signatures</b> — ${n.isDay ? 'day' : 'night'} chart; almuten of the Ascendant <b>${esc(n.almutenAsc)}</b>;
       Lord of the Geniture <b>${esc(n.lordOfGeniture.planet)}</b> (${sgn(n.lordOfGeniture.score)}); temperament ${esc(n.temperament.summary)} (${esc(n.temperament.dominant)}).</p>
     <p><b>This year</b> (age ${cy.age}) — profected to ${esc(cy.profectedSign)}, the ${cy.activatedHouse}th house activated;
       <b>Lord of the Year ${esc(cy.lordOfYear)}</b>${cur ? ` (natal dignity ${sgn((cur.lordEssential || 0) + (cur.lordAccidental || 0))})` : ''}.</p>
     <p><b>Ruling planets</b> (the works the tradition counts as this nativity’s): ${esc(tj.picatrix.rulingPlanets.join(', '))}.
       ${tj.picatrix.recommendedTalisman ? `Recommended talisman: <b>${esc(tj.picatrix.recommendedTalisman.aim)}</b> ${vbadge(tj.picatrix.recommendedTalisman.verdict)}.` : ''}</p>
     <p class="small muted">The full year-by-year timeline, directions and personal Picatrix layer are on the
       <a href="trajectory.html">Life Trajectory</a> tool. ${tj.notes ? '(' + esc(tj.notes) + ')' : ''}</p>`;
}

function renderReference() {
  const byBook = {};
  for (const e of REGISTRY) (byBook[e.book] = byBook[e.book] || []).push(e);
  let html = '';
  for (const [book, entries] of Object.entries(byBook)) {
    html += `<h3 class="small" style="margin:.8rem 0 .3rem;text-transform:uppercase;letter-spacing:.04em">${esc(book)}</h3><ul class="clean small">`;
    for (const e of entries) {
      const links = [];
      if (e.howItWorks) links.push(`<a href="${esc(rel(e.howItWorks))}">how it's calculated</a>`);
      for (const pg of (e.pages || [])) links.push(`<a href="${esc(rel(pg))}">${esc(rel(pg))}</a>`);
      html += `<li><b>${esc(e.title)}</b> — ${esc(e.computes)}
        <br><span class="muted">${esc(e.module)} · <code>${esc(e.exportName)}()</code> · ${esc(e.citation)}</span>
        <br>${links.join(' · ')}${e.glossaryTerms.length ? ' · <a href="glossary.html">glossary: ' + e.glossaryTerms.map(esc).join(', ') + '</a>' : ''}</li>`;
    }
    html += '</ul>';
  }
  $('wb-reference').innerHTML = html;
}

function renderJSON(r) { $('wb-json-view').textContent = JSON.stringify(r, null, 2); }
function renderCitations(r) { $('wb-citations').innerHTML = '<b>Sources used in this reading:</b> ' + r.citations.map(esc).join(' · '); }

function renderAssistantPlaceholder() {
  $('wb-assistant').innerHTML =
    `<p class="small muted">An AI assistant attaches here to explain this reading in plain language, grounded in the
      computed, cited facts above — and to plan historical "workings" using the engine tools. It uses <b>Claude</b>
      (the Anthropic API) with <b>your own key</b>. See <a href="../docs/LOCAL-LLM.html">how it works</a>.</p>`;
}
