// ============================================================================
//  app/practices.js — the ONE app module driving the Practices wing:
//    • initPractices('index')  — the wing hub: live catalog stats + the 8
//      practice-group taxonomy cards (mudrā = built this round; the rest shown
//      HONESTLY as catalogued / planned / theory-only / computed, with the
//      cross-links to where their material already lives — never faked).
//    • initPractices('mudras') — the mudrā catalog: 35 museum-record cards
//      (Gheraṇḍa 25 + HYP 10), each with its generated schematic figure, the
//      harm callout rendered FIRST and prominent where present, the description
//      ("the text instructs…"), the claimed purpose ("the text claims…"),
//      the text's own cautions, crosswalk chips to the counterpart record, and
//      the ⚑ contested (same-name / divergence) panel. Filter by text/source/
//      harm-flag; the GS↔HYP crosswalk table renders below.
//
//  All computation is in the pure core (core/practices.js); this file owns the
//  DOM. The SVG figures come from app/practices-art.js. Honest framing lives in
//  the page prose (the standing caveat renders FIRST in the HTML): these are
//  historical disciplines described as history, NEVER prescribed to the reader.
//  No animation-frame loops; reduced-motion-first (no JS motion here).
// ============================================================================
import {
  HATHA_MUDRAS, MUDRA_GROUPS, mudrasBySource, mudraById, crosswalkOf, practicesStats,
} from '../core/practices.js';
import { mudraFigure } from './practices-art.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const SOURCE_LABEL = { gheranda: 'Gheraṇḍa Saṁhitā', hyp: 'Haṭha­yoga­pradīpikā' };
const SOURCE_SHORT = { gheranda: 'Gheraṇḍa', hyp: 'HYP' };

// ── The hub (index) ─────────────────────────────────────────────────────────
function renderHub() {
  const stats = practicesStats();
  const host = $('pr-stats');
  if (host) {
    host.innerHTML =
      `<div class="pr-statline">`
      + statChip(stats.total, 'mudrā records')
      + statChip(stats.bySource.gheranda, 'from the Gheraṇḍa Saṁhitā')
      + statChip(stats.bySource.hyp, 'from the Haṭhayogapradīpikā')
      + statChip(stats.withHarmNote, 'carry a harm flag')
      + statChip(stats.contested, 'carry a ⚑ contested note')
      + `</div>`;
  }
  const groups = $('pr-groups');
  if (groups) groups.innerHTML = MUDRA_GROUPS.map(groupCard).join('');
}
function statChip(n, label) {
  return `<span class="pr-stat"><b>${esc(n)}</b> ${esc(label)}</span>`;
}
const STATUS_META = {
  built: { cls: 'ok', txt: 'Built this round' },
  catalogued: { cls: 'doc', txt: 'Catalogued · planned' },
  planned: { cls: 'doc', txt: 'Catalogued · planned' },
  'theory-only': { cls: 'warn', txt: 'Theory-only' },
  computed: { cls: 'info', txt: 'Computed elsewhere' },
};
function groupCard(g) {
  const sm = STATUS_META[g.status] || STATUS_META.planned;
  const links = (g.crossLinks || []).map(l =>
    `<a class="pr-xlink" href="${esc(l.href)}">${esc(l.label)}</a>`).join('');
  const count = g.built && g.records != null ? `<span class="pr-gcount">${esc(g.records)} records</span>` : '';
  return `<div class="pr-group pr-group--${sm.cls}${g.built ? ' pr-group--built' : ''}" id="grp-${esc(g.id)}">`
    + `<div class="pr-group-hd"><span class="pr-gglyph" aria-hidden="true">${esc(g.glyph)}</span>`
    + `<h3>${esc(g.name)}</h3></div>`
    + `<span class="pr-gstatus pr-gstatus--${sm.cls}">${esc(sm.txt)}</span>${count}`
    + `<p class="pr-glede">${esc(g.lede)}</p>`
    + (links ? `<div class="pr-glinks">${links}</div>` : '')
    + `</div>`;
}

// ── The catalog (mudras) ────────────────────────────────────────────────────
const state = { q: '', source: 'all', harmOnly: false };

function matches(r) {
  if (state.source !== 'all' && r.source !== state.source) return false;
  if (state.harmOnly && !r.harmNote) return false;
  if (state.q) {
    const hay = fold([r.name, r.iast, r.description, r.purpose, r.locus].join(' '));
    if (!hay.includes(fold(state.q))) return false;
  }
  return true;
}

function sourceBadge(r) {
  const cls = r.source === 'hyp' ? 'pr-badge--hyp' : 'pr-badge--gs';
  return `<span class="pr-badge ${cls}">${esc(SOURCE_LABEL[r.source] || r.source)}</span>`;
}

function harmBlock(r) {
  if (!r.harmNote) return '';
  return `<div class="pr-harm" role="note"><span class="pr-harm-label">⚠ Harm flag — historical text, never a practice</span>`
    + `<p>${esc(r.harmNote)}</p></div>`;
}

function contestedBlock(r) {
  const c = r.contested;
  if (!c) return '';
  const pos = (c.positions || []).map(p =>
    `<div class="pr-crux-pos"><b>${esc(p.value)}</b><span class="pr-crux-src">— ${esc(p.source)}</span></div>`).join('');
  return `<div class="pr-crux"><p class="pr-crux-title">${esc(c.flag)}</p>${pos}</div>`;
}

function crosswalkChips(r) {
  const pairs = crosswalkOf(r.id);
  if (!pairs.length) return '';
  const chips = pairs.map(p =>
    `<a class="pr-chip" href="#${esc(p.id)}">${esc(SOURCE_SHORT[p.source] || p.source)}: ${esc(p.name)}</a>`).join('');
  return `<div class="pr-xwalk-chips"><span class="pr-chips-label">Crosswalk</span>${chips}</div>`;
}

function card(r) {
  return `<article class="pr-card" id="${esc(r.id)}">`
    + `<div class="pr-card-hd">`
    + `<h3 class="pr-name">${esc(r.name)}`
    + (r.devanagari ? ` <span class="pr-deva" lang="sa">${esc(r.devanagari)}</span>` : '')
    + `</h3>`
    + `<p class="pr-iast" lang="sa-Latn">${esc(r.iast)}</p>`
    + `<div class="pr-meta">${sourceBadge(r)}<span class="pr-locus">${esc(r.locus)}</span></div>`
    + `</div>`
    + `<div class="pr-card-body">`
    + harmBlock(r)                                   // harm callout FIRST, before the description
    + `<div class="pr-fig-wrap">${mudraFigure(r)}</div>`
    + `<div class="pr-prose">`
    + `<p class="pr-desc"><span class="pr-field">The text instructs</span>${esc(r.description)}</p>`
    + `<p class="pr-purpose"><span class="pr-field">The text claims</span>${esc(r.purpose)}</p>`
    + (r.textCaution ? `<p class="pr-caution"><span class="pr-field pr-field--warn">The text's own caution</span>${esc(r.textCaution)}</p>` : '')
    + crosswalkChips(r)
    + contestedBlock(r)
    + `</div>`
    + `<div class="pr-src">${(r.sources || []).map(esc).join('<br>')}</div>`
    + `</div>`
    + `</article>`;
}

function renderCatalog() {
  const host = $('pr-catalog');
  if (!host) return;
  const gs = mudrasBySource('gheranda').filter(matches);
  const hyp = mudrasBySource('hyp').filter(matches);
  const total = gs.length + hyp.length;
  let html = '';
  if (gs.length) html += `<h2 class="pr-src-head" id="cat-gheranda">Gheraṇḍa Saṁhitā <span class="pr-src-count">${gs.length} of 25</span></h2>`
    + gs.map(card).join('');
  if (hyp.length) html += `<h2 class="pr-src-head" id="cat-hyp">Haṭhayogapradīpikā <span class="pr-src-count">${hyp.length} of 10</span></h2>`
    + hyp.map(card).join('');
  if (!total) html = `<p class="pr-empty">No mudrā matches those filters. <button type="button" class="pr-reset" id="pr-reset">Clear the filters</button></p>`;
  host.innerHTML = html;
  const reset = $('pr-reset');
  if (reset) reset.addEventListener('click', clearFilters);
  const count = $('pr-filter-count');
  if (count) count.textContent = total === HATHA_MUDRAS.length
    ? `all ${total} records` : `${total} of ${HATHA_MUDRAS.length} records`;
}

function clearFilters() {
  state.q = ''; state.source = 'all'; state.harmOnly = false;
  const f = $('pr-filter'); if (f) f.value = '';
  const h = $('pr-harm'); if (h) h.checked = false;
  syncSourceButtons();
  renderCatalog();
}

function syncSourceButtons() {
  document.querySelectorAll('#pr-source [data-source]').forEach(b =>
    b.setAttribute('aria-pressed', b.getAttribute('data-source') === state.source ? 'true' : 'false'));
}

function renderCrosswalk() {
  const host = $('pr-crosswalk');
  if (!host) return;
  const rows = mudrasBySource('gheranda')
    .filter(r => crosswalkOf(r.id).some(p => p.source === 'hyp'))
    .map(gsr => {
      const hypr = crosswalkOf(gsr.id).find(p => p.source === 'hyp');
      const note = (gsr.contested && /same name/i.test(gsr.contested.flag)) ? gsr.contested.flag
        : (gsr.contested ? gsr.contested.flag : '');
      return { gsr, hypr, note };
    });
  const body = rows.map(({ gsr, hypr, note }) =>
    `<tr>`
    + `<th scope="row">${esc(hypr.name)}</th>`
    + `<td><a href="#${esc(gsr.id)}">${esc(gsr.locus)}</a></td>`
    + `<td><a href="#${esc(hypr.id)}">${esc(hypr.locus)}</a></td>`
    + `<td class="pr-xw-note">${note ? `⚑ ${esc(note)}` : '<span class="muted">— substantively the same seal</span>'}</td>`
    + `</tr>`).join('');
  host.innerHTML =
    `<table class="pr-xwtab"><caption class="pr-xwcap">The ${rows.length} seals named in both texts — kept as separate per-source records, joined here. The star exhibit is khecarī (frenum-cutting in both); the vajrolī / vajroṇī row shares a name across two entirely different practices.</caption>`
    + `<thead><tr><th scope="col">Seal</th><th scope="col">Gheraṇḍa (Vasu)</th><th scope="col">HYP (Sinh)</th><th scope="col">Divergence</th></tr></thead>`
    + `<tbody>${body}</tbody></table>`;
}

function wireCatalogControls() {
  const f = $('pr-filter');
  if (f) f.addEventListener('input', () => { state.q = f.value; renderCatalog(); });
  const src = $('pr-source');
  if (src) src.addEventListener('click', e => {
    const b = e.target.closest('[data-source]');
    if (!b) return;
    state.source = b.getAttribute('data-source'); syncSourceButtons(); renderCatalog();
  });
  const h = $('pr-harm');
  if (h) h.addEventListener('change', () => { state.harmOnly = h.checked; renderCatalog(); });
}

// ── Entry point ─────────────────────────────────────────────────────────────
export function initPractices(page) {
  if (page === 'index') { renderHub(); return; }
  if (page === 'mudras') {
    syncSourceButtons();
    wireCatalogControls();
    renderCatalog();
    renderCrosswalk();
  }
}

export default { initPractices };
