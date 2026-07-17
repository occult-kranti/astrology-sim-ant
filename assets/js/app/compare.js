// ============================================================================
//  compare.js (app) — the ONLY DOM module for pages/compare.html, the honest
//  landscape survey. All facts live in the PURE core (core/data/competitors.js);
//  this file owns the rendering: the feature matrix (a wide table in an
//  overflow-x:auto container with a sticky first column and ●/◐/○/? cells), the
//  filterable competitor cards (each with the MANDATORY "What it does better
//  than this site" list), the 11 novelty claims (claim + verify + qualifier),
//  the closing humility summary, and the client-side STALENESS BADGES.
//
//  Staleness is computed HERE (surveyed date vs Date.now()) so the core stays
//  pure and deterministic: amber past 12 months, red past 24 — never a test
//  failure, only a rendered warning. No motion, no requestAnimationFrame — the
//  page is reduced-motion-first by construction (there is nothing to animate).
// ============================================================================
import {
  SURVEY_STAMP, CATEGORIES, COMPETITORS, FEATURE_MATRIX, MATRIX_COLUMNS,
  NOVELTY_CLAIMS, HUMILITY_SUMMARY,
} from '../core/data/competitors.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Cell glyphs + their accessible label / severity class.
const CELL = {
  full:    { glyph: '●', label: 'full',      cls: 'cmp-full' },     // ●
  partial: { glyph: '◐', label: 'partial',   cls: 'cmp-partial' },  // ◐
  none:    { glyph: '○', label: 'absent',    cls: 'cmp-none' },     // ○
  unknown: { glyph: '?',      label: 'unverified', cls: 'cmp-unknown' },
};
const AXIS = {
  explains: { yes: 'teaches the method', partial: 'partly explains', no: 'output only' },
  cites:    { yes: 'cites sources per rule', partial: 'names some sources', rare: 'rarely cites', no: 'no primary citations' },
};

const catLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || id;

// ── client-side staleness (never in core) ────────────────────────────────────
function monthsSince(iso) {
  const then = new Date(iso + 'T00:00:00Z'), now = new Date();
  if (isNaN(then)) return null;
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}
function stalenessBadge(iso) {
  const m = monthsSince(iso);
  if (m == null) return '';
  const word = m <= 0 ? 'this month' : m === 1 ? '1 month ago' : `${m} months ago`;
  const cls = m >= 24 ? 'badge--bad' : m >= 12 ? 'badge--warn' : 'badge--plain';
  const warn = m >= 24 ? ' — re-survey overdue' : m >= 12 ? ' — may be stale' : '';
  return `<span class="badge ${cls} cmp-staleness" title="Facts change; this record was last checked on ${esc(iso)}.">surveyed ${word}${warn}</span>`;
}

export function initCompare() {
  // survey stamp into every marker
  document.querySelectorAll('[data-survey-stamp]').forEach(el => { el.textContent = SURVEY_STAMP; });
  const cc = $('cmp-competitor-count'); if (cc) cc.textContent = String(COMPETITORS.length);

  renderMatrix();
  renderCards();
  renderClaims();
  renderHumility();

  try { autolinkResultPanels(['cmp-humility']); } catch (e) { /* non-fatal */ }
}

// ── the feature matrix ───────────────────────────────────────────────────────
function renderMatrix() {
  const mount = $('cmp-matrix');
  if (!mount) return;
  const cols = MATRIX_COLUMNS;

  const head = `<tr>
    <th scope="col" class="cmp-corner l">Capability</th>
    ${cols.map(c => `<th scope="col" class="cmp-col${c.id === 'site' ? ' cmp-col-site' : ''}">${esc(c.label)}</th>`).join('')}
  </tr>`;

  const body = FEATURE_MATRIX.features.map((f, i) => {
    const cells = cols.map(c => {
      const v = FEATURE_MATRIX.cells[f.id][c.id] || 'unknown';
      const d = CELL[v];
      return `<td class="cmp-cell ${d.cls}${c.id === 'site' ? ' cmp-col-site' : ''}" title="${esc(f.label)} — ${esc(c.label)}: ${d.label}">
        <span aria-hidden="true">${d.glyph}</span><span class="cmp-sr">${d.label}</span></td>`;
    }).join('');
    const noteId = `cmp-rn-${f.id}`;
    return `<tr>
      <th scope="row" class="cmp-feat l">
        <span class="cmp-feat-label">${esc(f.label)}</span>
        <button type="button" class="cmp-note-btn" aria-expanded="false" aria-controls="${noteId}" title="Show the note & citation">note</button>
        <div id="${noteId}" class="cmp-rownote" hidden><p>${esc(f.rowNote)}</p>
          <p class="small"><a href="${esc(f.cite)}" target="_blank" rel="noopener noreferrer">source ↗</a></p></div>
      </th>
      ${cells}
    </tr>`;
  }).join('');

  mount.innerHTML = `
    <div class="cmp-legend small muted" role="note">
      <b>${CELL.full.glyph}</b> full &nbsp; <b>${CELL.partial.glyph}</b> partial &nbsp;
      <b>${CELL.none.glyph}</b> absent &nbsp; <b>${CELL.unknown.glyph}</b> unverified (not confirmed from a public source — never guessed).
      Each row’s <b>note</b> button carries the citation and the caveat.
    </div>
    <div class="cmp-matrix-scroll" tabindex="0" role="region" aria-label="Feature comparison matrix (scroll horizontally)">
      <table class="cmp-matrix">
        <caption class="cmp-sr">Feature-by-tool comparison. Every cell is a checkable fact about software, surveyed ${esc(SURVEY_STAMP)}; ● full, ◐ partial, ○ absent, ? unverified.</caption>
        <thead>${head}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;

  // row-note disclosure (no motion; pure show/hide)
  mount.querySelectorAll('.cmp-note-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      const open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}

// ── the filterable competitor cards ──────────────────────────────────────────
function renderCards() {
  const filters = $('cmp-filters');
  const mount = $('cmp-cards');
  if (!mount) return;

  // filter bar: All + one per category (only categories that actually appear)
  const present = CATEGORIES.filter(c => COMPETITORS.some(k => k.category === c.id));
  if (filters) {
    filters.innerHTML =
      `<button type="button" class="cmp-filter" data-cat="all" aria-pressed="true">All <span class="cmp-fcount">${COMPETITORS.length}</span></button>` +
      present.map(c => {
        const n = COMPETITORS.filter(k => k.category === c.id).length;
        return `<button type="button" class="cmp-filter" data-cat="${esc(c.id)}" aria-pressed="false">${esc(c.label)} <span class="cmp-fcount">${n}</span></button>`;
      }).join('');
  }

  mount.innerHTML = COMPETITORS.map(cardHTML).join('');

  if (filters) {
    const count = $('cmp-cards-count');
    const apply = cat => {
      let shown = 0;
      mount.querySelectorAll('.cmp-card').forEach(card => {
        const hit = cat === 'all' || card.dataset.cat === cat;
        card.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      filters.querySelectorAll('.cmp-filter').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.cat === cat ? 'true' : 'false'));
      if (count) count.textContent = cat === 'all'
        ? `${shown} products` : `${shown} of ${COMPETITORS.length} products`;
    };
    filters.addEventListener('click', e => {
      const b = e.target.closest('.cmp-filter'); if (!b) return;
      apply(b.dataset.cat);
    });
    apply('all');
  }
}

function axisRow(c) {
  const validity = c.statesValidity
    ? `<span class="cmp-axis-yes">states validity honestly</span>`
    : `<span class="cmp-axis-no">no validity statement</span>`;
  return `<ul class="cmp-axes clean small">
    <li><span class="cmp-axis-k">Explains?</span> ${esc(AXIS.explains[c.explains] || c.explains)}</li>
    <li><span class="cmp-axis-k">Cites?</span> ${esc(AXIS.cites[c.cites] || c.cites)}</li>
    <li><span class="cmp-axis-k">Validity?</span> ${validity}</li>
  </ul>`;
}

function cardHTML(c) {
  const better = (c.betterAtThanUs || []).map(x => `<li>${esc(x)}</li>`).join('');
  const sources = (c.sources || []).map((u, i) =>
    `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">source ${i + 1} ↗</a>`).join(' · ');
  const unver = (c.unverified && c.unverified.length)
    ? `<p class="cmp-unverified small"><span class="cmp-axis-k">Unverified (?):</span> ${c.unverified.map(esc).join('; ')}</p>` : '';
  const platforms = (c.platforms || []).map(p => `<span class="pill">${esc(p)}</span>`).join(' ');
  return `<article class="cmp-card card" data-cat="${esc(c.category)}" id="cmp-${esc(c.id)}">
    <div class="cmp-card-head">
      <span class="tag">${esc(catLabel(c.category))}</span>
      ${stalenessBadge(c.surveyed)}
    </div>
    <h3>${esc(c.name)}</h3>
    <p class="cmp-what">${esc(c.what)}</p>
    ${axisRow(c)}
    <div class="cmp-better">
      <h4>What it does better than this site</h4>
      <ul class="cmp-better-list">${better}</ul>
    </div>
    <p class="cmp-meta small"><b>Licence:</b> ${esc(c.license)}<br>
      <b>Price:</b> ${esc(c.price)}<br>
      <b>Platforms:</b> ${platforms}</p>
    ${c.notes ? `<p class="cmp-notes small muted">${esc(c.notes)}</p>` : ''}
    ${unver}
    <p class="cmp-sources small">Surveyed ${esc(c.surveyed)} · ${sources}</p>
  </article>`;
}

// ── the novelty claims ───────────────────────────────────────────────────────
function renderClaims() {
  const mount = $('cmp-claims');
  if (!mount) return;
  mount.innerHTML = NOVELTY_CLAIMS.map((n, i) => `
    <li class="cmp-claim">
      <p class="cmp-claim-text"><span class="cmp-claim-n">${i + 1}</span>${esc(n.claim)}</p>
      <p class="cmp-verify small"><span class="cmp-axis-k">Verify it yourself:</span> ${esc(n.verify)}</p>
      <p class="cmp-qualifier small muted"><span class="cmp-axis-k">The honest qualifier:</span> ${esc(n.qualifier)}</p>
    </li>`).join('');
}

// ── the closing humility summary ─────────────────────────────────────────────
function renderHumility() {
  const mount = $('cmp-humility');
  if (!mount) return;
  mount.innerHTML = `<dl class="cmp-humility-list">${HUMILITY_SUMMARY.map(h => `
    <dt>${esc(h.area)}</dt><dd>${esc(h.text)}</dd>`).join('')}</dl>`;
}
