// ============================================================================
//  vedic-yogas.js (app) — drives pages/vedic/yogas.html, the data-driven yoga
//  detector. The pure engine + data are V1's frozen contract:
//    core/yogas.js        detectYogas(chart,opts) · yogaStats()
//    core/data/yoga-rules.js  YOGA_RULES (36) · YOGA_FAMILIES
//  This file is ONLY DOM: it casts the sidereal chart, runs detectYogas, and
//  renders the results as .record cards grouped by family, with the status
//  badge, every condition's ✓/✗, the fruit + honest frame, the sources line
//  and — where the rule is CONTESTED — a panel printing every position verbatim.
//
//  A contested yoga is NEVER shown as a single boolean: detectYogas returns
//  status 'conditional' for it and the contested panel carries all positions.
//
//  HONEST FRAMING: yogas are a historical symbolic system with no demonstrated
//  validity. Every fruit is the cited text's claim; described, never prescribed.
// ============================================================================
import { castChart } from '../core/astro.js';
import { castVedic } from '../core/vedic.js';
import { detectYogas, YOGA_RULES, YOGA_FAMILIES } from '../core/yogas.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------------------
//  PURE view helpers (DOM-free, engine-testable). They operate on whatever
//  detectYogas returns — a list of { rule, status, conditionResults[],
//  contestedNote } — plus the YOGA_FAMILIES map, and never mutate their inputs.
// ---------------------------------------------------------------------------

// The family display order: families as they first appear in YOGA_RULES, so the
// grouping is deterministic and matches the data's own ordering.
export function familyOrder(rules = YOGA_RULES || []) {
  const seen = [];
  for (const r of rules) if (r && r.family && !seen.includes(r.family)) seen.push(r.family);
  return seen;
}

// Group detector results by family → [{ family, meta, results[] }], in familyOrder.
export function groupByFamily(results = [], families = YOGA_FAMILIES || {}, rules = YOGA_RULES || []) {
  const order = familyOrder(rules);
  const byFam = new Map();
  for (const res of results) {
    const fam = (res.rule && res.rule.family) || 'other';
    if (!byFam.has(fam)) byFam.set(fam, []);
    byFam.get(fam).push(res);
  }
  const out = [];
  const emit = fam => { if (byFam.has(fam)) out.push({ family: fam, meta: families[fam] || { name: fam, description: '' }, results: byFam.get(fam) }); };
  for (const fam of order) emit(fam);
  for (const fam of byFam.keys()) if (!order.includes(fam)) emit(fam);   // any family not in rules (defensive)
  return out;
}

// Does a single result pass the current filter set? Pure predicate.
export function passesFilter(res, filter = {}) {
  if (!res || !res.rule) return false;
  if (filter.family && res.rule.family !== filter.family) return false;
  if (filter.status && res.status !== filter.status) return false;
  if (filter.taught && !res.rule.taughtInPlaylist) return false;
  return true;
}

// Status → { label, glyph, cls }. 'conditional' is the contested/partial state.
export function statusView(status) {
  if (status === 'met') return { label: 'met', glyph: '✓', cls: 'met' };
  if (status === 'not-met') return { label: 'not met', glyph: '✗', cls: 'not-met' };
  return { label: 'conditional', glyph: '◐', cls: 'conditional' };
}

// ---------------------------------------------------------------------------
//  Rendering (DOM)
// ---------------------------------------------------------------------------
let lastResults = [];
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentVedicYogasReport() { return lastReport; }

let picker = null, abar = null;

function renderCondition(c) {
  const met = !!(c && c.met);
  const detail = c && (c.detail || c.note || '');
  return `<li class="vt-cond ${met ? 'vt-cond--met' : 'vt-cond--unmet'}">
    <span class="vt-cond-mark" aria-hidden="true">${met ? '✓' : '✗'}</span>
    <span class="vt-cond-detail small"><span class="vt-sr">${met ? 'condition met: ' : 'condition not met: '}</span>${esc(detail)}</span></li>`;
}

// The CONTESTED panel — surfaces every position VERBATIM, with the detector's
// per-position outcome badge where it computed one (gaja-kesarī, nīca-bhaṅga,
// kāla-sarpa carry met/not-met per position; the rest are 'described'). Falls
// back to the rule record's verbatim positions if the detector gave none.
const POS_GLYPH = { met: '✓ present', 'not-met': '✗ absent', conditional: '◐ conditional' };
function renderContested(res) {
  const rule = res.rule || {};
  const c = rule.contested;
  if (!c && !res.contestedNote && !(res.positions && res.positions.length)) return '';
  const topic = c && c.topic ? `<p class="vt-contested-topic small"><b>What is disputed:</b> ${esc(c.topic)}</p>` : '';
  let positions = '';
  if (Array.isArray(res.positions) && res.positions.length) {
    positions = `<ol class="vt-positions small">${res.positions.map(p => {
      const badge = p.outcome && p.outcome !== 'described' && POS_GLYPH[p.outcome]
        ? ` <span class="vt-status vt-status--${p.outcome}">${POS_GLYPH[p.outcome]}</span>` : '';
      const detail = p.detail ? ` <span class="muted">— ${esc(p.detail)}</span>` : '';
      return `<li>${esc(p.label)}${badge}${detail}</li>`;
    }).join('')}</ol>`;
  } else if (c && Array.isArray(c.positions) && c.positions.length) {
    positions = `<ol class="vt-positions small">${c.positions.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`;
  }
  return `<details class="vt-contested">
    <summary>⚑ Contested — the editions disagree; every position stands, unresolved</summary>
    ${topic}${positions}</details>`;
}

function renderYoga(res) {
  const rule = res.rule || {};
  const sv = statusView(res.status);
  const conds = (res.conditionResults || []).map(renderCondition).join('');
  const sensitive = rule.sensitiveNote
    ? `<div class="vt-sensitive small"><b>Tradition, not advice:</b> ${esc(rule.sensitiveNote)}</div>` : '';
  const sources = (rule.sources || []).length
    ? `<p class="vt-yoga-sources small">${rule.sources.map(esc).join(' · ')}</p>` : '';
  const contested = renderContested(res);
  const taught = rule.taughtInPlaylist ? `<span class="vt-taught" title="Directly taught in the source teaching playlist">taught</span>` : '';
  return `<article class="vt-yoga" data-family="${esc(rule.family || '')}" data-status="${esc(res.status || '')}" data-taught="${rule.taughtInPlaylist ? '1' : '0'}">
    <div class="vt-yoga-head">
      <h4>${esc(rule.name || rule.id || 'Yoga')}</h4>
      ${rule.iast ? `<span class="vt-yoga-iast small">${esc(rule.iast)}</span>` : ''}
      ${taught}
      <span class="vt-yoga-spacer"></span>
      <span class="vt-status vt-status--${sv.cls}"><span aria-hidden="true">${sv.glyph}</span> ${sv.label}</span>
    </div>
    <ul class="vt-conditions">${conds || '<li class="small muted">No conditions recorded.</li>'}</ul>
    ${rule.fruit ? `<p class="vt-fruit small"><b>The fruit the text claims:</b> ${esc(rule.fruit)} <span class="muted">(the tradition's doctrine — it predicts nothing)</span></p>` : ''}
    ${sensitive}
    ${contested}
    ${sources}
  </article>`;
}

function render(results) {
  const host = $('vy-out');
  if (!host) return;
  if (!results || !results.length) { host.innerHTML = '<p class="muted">No yogas evaluated. Enter a birth moment above and detect.</p>'; return; }
  const groups = groupByFamily(results, YOGA_FAMILIES, YOGA_RULES);
  const html = groups.map(g => `
    <section class="vt-family" data-family="${esc(g.family)}">
      <div class="vt-family-head"><h3>${esc(g.meta.name || g.family)}</h3></div>
      ${g.meta.description ? `<p class="vt-family-desc small muted">${esc(g.meta.description)}</p>` : ''}
      ${g.results.map(renderYoga).join('')}
    </section>`).join('');
  const met = results.filter(r => r.status === 'met').length;
  const cond = results.filter(r => r.status === 'conditional').length;
  host.innerHTML = `
    <p class="small">Of <b>${results.length}</b> cited yoga rules, <b>${met}</b> are met and <b>${cond}</b> are conditional /
      contested for this chart. Every condition's ✓/✗ is shown; contested rules print every position verbatim and resolve
      nothing.</p>
    <div class="callout science vt-standing" style="margin:.4rem 0 .8rem"><span class="label">Standing note</span>
      Astrology has no demonstrated validity; everything below describes what the historical Jyotiṣa system computes — study,
      not guidance.</div>
    ${html}`;
  applyFilter();
}

// Filters hide/show cards in place (no recompute, spatial memory preserved),
// then hide any family group left empty.
function applyFilter() {
  const filter = {
    family: $('vy-f-family') ? $('vy-f-family').value : '',
    status: $('vy-f-status') ? $('vy-f-status').value : '',
    taught: $('vy-f-taught') ? $('vy-f-taught').checked : false,
  };
  const host = $('vy-out'); if (!host) return;
  for (const card of host.querySelectorAll('.vt-yoga')) {
    const res = { rule: { family: card.dataset.family, taughtInPlaylist: card.dataset.taught === '1' }, status: card.dataset.status };
    card.classList.toggle('is-hidden', !passesFilter(res, filter));
  }
  for (const fam of host.querySelectorAll('.vt-family')) {
    const anyVisible = [...fam.querySelectorAll('.vt-yoga')].some(c => !c.classList.contains('is-hidden'));
    fam.hidden = !anyVisible;
  }
}

// ---------------------------------------------------------------------------
//  Init + compute
// ---------------------------------------------------------------------------
export function initVedicYogas() {
  // seed a default birth moment so the page shows a full reading on load
  $('vy-date').value = '1990-05-15'; $('vy-time').value = '12:00'; $('vy-offset').value = 0;
  $('vy-lat').value = 51.5074; $('vy-lon').value = -0.1278;

  // populate the family filter from the frozen YOGA_FAMILIES / YOGA_RULES
  const famSel = $('vy-f-family');
  if (famSel) for (const fam of familyOrder(YOGA_RULES)) {
    const meta = (YOGA_FAMILIES || {})[fam] || {};
    const opt = document.createElement('option');
    opt.value = fam; opt.textContent = meta.name || fam;
    famSel.appendChild(opt);
  }
  for (const id of ['vy-f-family', 'vy-f-status', 'vy-f-taught']) {
    const el = $(id); if (el) el.addEventListener('change', applyFilter);
  }

  $('vy-form').addEventListener('submit', e => { e.preventDefault(); doCompute(); });

  mountEnhancements();
  run();
}

// moment-picker + action-bar + AI assistant are dynamically imported so an
// absent module never blocks the page (the hidden legacy inputs keep defaults).
async function mountEnhancements() {
  const host = $('vy-picker');
  const mp = await import('./moment-picker.js').catch(() => null);
  if (host && mp && mp.mountMomentPicker) {
    try {
      picker = mp.mountMomentPicker(host, {
        mode: 'birth',
        ids: { lat: 'vy-lat', lon: 'vy-lon', date: 'vy-date', time: 'vy-time', offset: 'vy-offset' },
        label: 'The birth moment & place',
        persist: 'wb',
      });
    } catch { /* mountMomentPicker throws on a missing legacy id — non-fatal */ }
  }
  const ab = await import('./action-bar.js').catch(() => null);
  if (ab && ab.mountActionBar && $('vy-actionbar')) {
    try {
      abar = ab.mountActionBar($('vy-actionbar'), {
        variant: 'tool', exports: [],
        askAI: () => { const a = $('dv-assistant'); if (a) { a.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto' }); const t = a.querySelector('textarea, input'); t && t.focus(); } },
        summary: () => ({ verdict: '', text: `${lastResults.filter(r => r.status === 'met').length} yogas met of ${lastResults.length}.` }),
      });
    } catch { abar = null; }
  }
  const da = await import('./divination-assistant.js').catch(() => null);
  if (da && da.initDivinationAssistant && $('dv-assistant')) {
    try {
      da.initDivinationAssistant({
        kind: 'vedicyogas',
        getReading: () => lastReport,
        subscribeReading: cb => reportSubs.push(cb),
        copy: { emptyText: 'Detect the yogas for a birth chart above first.' },
      });
    } catch { /* non-fatal */ }
  }
}

const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };

function doCompute() {
  const btn = $('vy-form').querySelector('button[type="submit"]');
  const status = $('vy-status');
  import('./action-bar.js').then(m => {
    if (m && m.computeFlow) m.computeFlow(btn, status, () => run(), { firstPanel: $('vy-out') });
    else run();
  }).catch(() => run());
}

async function run() {
  const lat = parseFloat($('vy-lat').value), lon = parseFloat($('vy-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('vy-status').textContent = 'Enter a latitude and longitude.'; return; }
  const off = parseFloat($('vy-offset').value) || 0;
  const { toUTC } = await import('./shared.js').catch(() => ({ toUTC: null }));
  let dateUTC;
  try { dateUTC = toUTC ? toUTC($('vy-date').value, $('vy-time').value, off) : new Date($('vy-date').value + 'T' + ($('vy-time').value || '12:00') + 'Z'); }
  catch { $('vy-status').textContent = 'Could not read the birth moment.'; return; }
  $('vy-status').textContent = '';

  let v, results;
  try {
    const chart = castChart(dateUTC, lat, lon, 'whole');
    v = castVedic(chart, { currentDate: new Date() });
    results = detectYogas(v, {});
  } catch (e) {
    $('vy-out').innerHTML = `<p class="muted">Could not detect the yogas (${esc(e.message)}).</p>`;
    return;
  }
  lastResults = Array.isArray(results) ? results : [];
  render(lastResults);

  lastReport = {
    kind: 'vedicyogas',
    momentUTC: dateUTC.toISOString(), place: { lat, lon },
    ayanamsa: v.ayanamsa, ayanamsaName: v.ayanamsaName,
    lagna: v.lagna && { sign: v.lagna.rashi, sanskrit: v.lagna.sanskrit, lord: v.lagna.lord },
    counts: {
      total: lastResults.length,
      met: lastResults.filter(r => r.status === 'met').length,
      conditional: lastResults.filter(r => r.status === 'conditional').length,
      notMet: lastResults.filter(r => r.status === 'not-met').length,
    },
    yogas: lastResults.map(r => ({
      id: r.rule && r.rule.id, name: r.rule && r.rule.name, family: r.rule && r.rule.family,
      status: r.status,
      conditions: (r.conditionResults || []).map(c => ({ met: !!c.met, detail: c.detail || c.note || '' })),
      fruit: r.rule && r.rule.fruit,
      contested: !!(r.rule && r.rule.contested),
      contestedPositions: r.rule && r.rule.contested && r.rule.contested.positions || null,
      sources: (r.rule && r.rule.sources) || [],
    })),
  };
  notifyReport();
  try { const sh = await import('./shared.js'); sh.autolinkResultPanels && sh.autolinkResultPanels(['vy-out']); } catch { /* non-fatal */ }
  try { abar && abar.show && abar.show(); } catch { /* */ }
  try { picker && picker.commitRecent && picker.commitRecent(); } catch { /* */ }
}
