// ============================================================================
//  app/incense.js — the suffumigation materia, rendered both ways.
//
//  THE RENDERING RULE THIS FILE EXISTS TO HONOUR. planetary-magic.js keeps
//  `substance`, `quantity` and `processParam` in three TYPED fields precisely
//  so that the operable triple (FRAMING §5, C-1) has nowhere to assemble. A
//  template that interpolates them into one sentence re-creates the triple in
//  free text and defeats the design. So: each field is rendered in its own
//  cell, and `quantity`/`processParam` are shown as an explicit WITHHELD state
//  rather than omitted — an absent field reads as an oversight, a stated one
//  reads as a decision.
//
//  A harm-flagged material may never render without its harm note. That is
//  enforced here by construction (the note is emitted in the same call) and
//  asserted in scripts/tests/incense.mjs.
// ============================================================================

import {
  byPlanet, byMaterial, convergences, openQuestions, census,
  INCENSE_SOURCE, INCENSE_FRAMING,
} from '../core/incense.js';

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const txt = s => (typeof s === 'string' && s.trim() ? s.trim() : '');

const GLYPH = {
  Saturn: '♄', Jupiter: '♃', Mars: '♂', Sun: '☉', Venus: '♀', Mercury: '☿', Moon: '☽',
};

// ---------------------------------------------------------------------------
//  The withheld cell. Rendered, not omitted.
// ---------------------------------------------------------------------------
function withheldCell(materia, field) {
  if (!materia) return '<td class="small muted">—</td>';
  const v = materia[field];
  if (v != null && v !== '') return `<td>${esc(v)}</td>`;
  return '<td class="small muted"><b>withheld</b></td>';
}

// ---------------------------------------------------------------------------
//  1 · Per planet
// ---------------------------------------------------------------------------
function renderPlanets(rows) {
  const body = rows.map(r => {
    const harm = r.harmFlag
      ? `<div class="small" style="margin-top:.35rem"><b>⚠ Record, not a recipe.</b> ${esc(r.harmNote || '')}</div>`
      : '';
    const trunc = r.truncatedInSource
      ? `<div class="small muted" style="margin-top:.3rem">${esc(r.truncationNote || '')}</div>` : '';
    const tnote = r.tokenNote
      ? `<div class="small muted" style="margin-top:.3rem">${esc(r.tokenNote)}</div>` : '';
    const toks = r.tokens.map(t =>
      `<span class="badge ${t.harm ? 'badge--plain' : 'badge--doc'}">${esc(t.label)}</span>`).join(' ');
    return `<tr>
      <th scope="row">${esc(GLYPH[r.planet] || '')} ${esc(r.planet)}</th>
      <td>${esc(r.substance)}${harm}${trunc}${tnote}
        <div style="margin-top:.4rem">${toks}</div></td>
      ${withheldCell(r.materia, 'quantity')}
      ${withheldCell(r.materia, 'processParam')}
      <td class="small">${esc(r.colour || '—')}</td>
      <td class="small">${esc(r.metal || '—')}</td>
    </tr>`;
  }).join('');

  return `<table class="tbl">
    <caption class="small muted">Each field in its own cell. <b>Quantity</b> and <b>process</b> are shown as
      <b>withheld</b> rather than left out, because an absent column reads as an oversight and a stated one
      reads as a decision.</caption>
    <thead><tr><th>Planet</th><th>Substance, as the text names it</th><th>Quantity</th>
      <th>Process</th><th>Colour</th><th>Metal</th></tr></thead>
    <tbody>${body}</tbody></table>`;
}

// ---------------------------------------------------------------------------
//  2 · Per material — the view a single grimoire cannot give you
// ---------------------------------------------------------------------------
function renderMaterials(rows) {
  const body = rows.map(m => {
    const planets = m.planets.map(p => `${GLYPH[p] || ''} ${p}`).join(', ');
    const bot = txt(m.botanical) ? `<div class="small muted">${esc(m.botanical)}</div>` : '';
    const comp = m.kind === 'composite'
      ? `<div class="small"><b>${m.componentCount} components, not carried here.</b> ${esc(m.note || '')}</div>`
      : '';
    const animal = m.kind === 'animal' && m.note
      ? `<div class="small">${esc(m.note)}</div>` : '';
    const amb = (m.ambiguities || []).map(a =>
      `<div class="small" style="margin-top:.35rem"><b>${esc(a.title)}</b> — ${esc(a.body)}
        <i>Status: ${esc(a.status)}</i></div>`).join('');
    return `<tr>
      <th scope="row">${esc(m.label)}${m.harm ? ' <span class="badge badge--plain">⚠ harm-flagged</span>' : ''}
        ${bot}</th>
      <td>${esc(planets)}</td>
      <td class="small">${esc(m.kind)}</td>
      <td>${comp}${animal}${amb || '<span class="small muted">—</span>'}</td>
    </tr>`;
  }).join('');

  return `<table class="tbl">
    <thead><tr><th>Material</th><th>Named by</th><th>Kind</th><th>What complicates it</th></tr></thead>
    <tbody>${body}</tbody></table>`;
}

// ---------------------------------------------------------------------------
//  3 · The convergence panel — which is currently EMPTY, and says so
// ---------------------------------------------------------------------------
function renderConvergence(conv, mats) {
  if (conv.length) {
    return `<ul>${conv.map(m =>
      `<li><b>${esc(m.label)}</b> — named by ${esc(m.planets.join(', '))}</li>`).join('')}</ul>`;
  }
  return `<div class="callout"><span class="label">No material is shared</span>
    Across the seven planetary suffumigations recorded here, <b>not one material is named by two
    planets</b> — ${mats.length} distinct materials, ${conv.length} shared. That is a result, not a
    missing panel. It also depends on a judgement: Mars's <i>aloes wood</i> and Venus's <i>aloes</i>
    are kept apart as two different plants. Merge them and this page would report a Mars–Venus
    convergence that no source states.</div>`;
}

// ---------------------------------------------------------------------------
//  4 · Census — every count carries its unit (rule B13)
// ---------------------------------------------------------------------------
function renderCensus(c) {
  return `<ul class="small">${Object.entries(c).map(([k, v]) =>
    `<li><b>${esc(v.n)}</b> ${esc(v.unit)} <span class="muted">— ${esc(k)}</span></li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------------------
export function initIncense() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const planets = byPlanet();
  const mats = byMaterial();

  set('inc-framing', `<span class="label">Read this first</span> ${esc(INCENSE_FRAMING)}`);
  set('inc-planets', renderPlanets(planets));
  set('inc-materials', renderMaterials(mats));
  set('inc-convergence', renderConvergence(convergences(), mats));
  set('inc-questions', openQuestions().map(q =>
    `<div class="callout"><span class="label">${esc(q.title)}</span> ${esc(q.body)}
      <div class="small"><i>Status: ${esc(q.status)}</i></div></div>`).join(''));
  set('inc-census', renderCensus(census()));
  set('inc-source', esc(INCENSE_SOURCE));
}
