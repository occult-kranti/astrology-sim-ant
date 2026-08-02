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
  byPlanet, byMaterial, convergences, openQuestions, census, tableComparison,
  materiaForRuler, INCENSE_SOURCE, INCENSE_FRAMING,
} from '../core/incense.js';
import { hoursTable } from '../core/planetary-hours.js';
import { vedicHora } from '../core/vedic-hora.js';

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
//  5 · Text against practice — two tables, neither corrected into the other
// ---------------------------------------------------------------------------
function renderComparison(rows) {
  const body = rows.map(r => {
    const verdict = r.agrees
      ? '<span class="badge badge--doc">agree</span>'
      : r.nearMiss
        ? `<span class="badge badge--plain">${r.nearMiss.kind === 'wording' ? 'same material' : 'reassigned'}</span>`
        : '<span class="badge badge--plain">differs</span>';
    const why = r.nearMiss
      ? `<div class="small">${esc(r.nearMiss.body)}</div>`
      : r.substitution
        ? `<div class="small"><b>Declared substitution.</b> ${esc(r.substitutionNote || '')}</div>`
        : '<span class="small muted">—</span>';
    return `<tr>
      <th scope="row">${esc(GLYPH[r.planet] || '')} ${esc(r.planet)}</th>
      <td>${esc(r.textual || '—')}</td>
      <td>${esc(r.practitioner || '—')}${r.practitionerAlt ? `<span class="small muted"> · ${esc(r.practitionerAlt)}</span>` : ''}</td>
      <td>${verdict}</td>
      <td>${why}</td>
    </tr>`;
  }).join('');

  const real = rows.filter(r => !r.agrees && !r.nearMiss).length;
  const near = rows.filter(r => !r.agrees && r.nearMiss).length;

  return `<table class="tbl">
      <thead><tr><th>Planet</th><th>The texts <span class="small muted">Tier A/B — cited, authoritative</span></th>
        <th>Earlier working table <span class="small muted">Tier C — superseded, uncited</span></th><th></th><th>What the difference is</th></tr></thead>
      <tbody>${body}</tbody></table>
    <div class="callout"><span class="label">${real} real divergences, ${near} near-misses</span>
      A blunt comparison would report all seven as disagreements. Most are not.
      <b>The clearest case is a straight swap</b>: the texts give frankincense to Jupiter and saffron to
      the Sun, and the practitioner table gives frankincense to the Sun and saffron to Jupiter. Mercury
      is handed the mastic the texts assign to Venus. Those are <i>reassignments</i> of materials the
      tradition does name — a different and more interesting claim than substituting something new.</div>`;
}

// ---------------------------------------------------------------------------
//  6 · THIS HOUR, NOW — the live panel
//
//  Inherits the earlier instrument's shape (big glyph, ruler, countdown to the
//  turn, proportional 24-segment ribbon with a needle) and changes ONE thing
//  that matters: the verb. That page said "Burn dragon's blood". This one says
//  what the TEXTS ASSIGN to the hour's ruler. FRAMING §11.5 — if the panel
//  could be lifted onto a site with no framing and read as instruction, it has
//  failed.
//
//  The clock lives here, never in core/**, which may not read Date.
// ---------------------------------------------------------------------------
const PRESETS = [['New York', 40.71, -74.01], ['London', 51.51, -0.13],
  ['Cairo', 30.04, 31.24], ['Delhi', 28.61, 77.21], ['Tokyo', 35.68, 139.69]];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const fmtT = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

let _tick = null;
let _rows = null;

function paintNow(lat, lon) {
  const el = id => document.getElementById(id);
  const now = new Date();
  let table;
  try { table = hoursTable(now, lat, lon); } catch (e) { table = null; }

  if (!table || !table.rows || !table.rows.length) {
    // Polar honesty, kept from the earlier instrument.
    el('inc-now-body').innerHTML = '<p class="small muted">No sunrise and sunset bound a day at this '
      + 'latitude right now, so the unequal-hours division is <b>undefined here</b> — not merely '
      + 'unavailable. Try a lower latitude.</p>';
    el('inc-ribbon').innerHTML = '';
    return;
  }
  // hoursTable rows carry {hour, night, start, ruler} and NO `end`. Derive it:
  // each hour ends where the next begins, and the last ends at the next sunrise.
  // (Assuming an `end` cost a render; the shape is checked in the test.)
  const rows = table.rows.map((r, i) => ({
    ...r,
    start: new Date(r.start),
    end: new Date(i < table.rows.length - 1 ? table.rows[i + 1].start : table.nextRise),
  }));
  _rows = rows;
  const cur = rows.find(r => r.start <= now && now < r.end) || rows[0];
  const m = materiaForRuler(cur.ruler);
  const day = rows[0].start, endOfDay = rows[rows.length - 1].end;
  const span = endOfDay - day;

  const left = Math.max(0, Math.floor((cur.end - now) / 1000));
  const cd = `${Math.floor(left / 3600)}:${String(Math.floor(left / 60) % 60).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
  const idx = rows.indexOf(cur);
  const nxt = idx < rows.length - 1 ? rows[idx + 1] : null;

  // THE VEDIC COLUMN. Structurally present, deliberately EMPTY, and saying why.
  // The horā ruler is the same Chaldean sequence, so naming it is safe. The
  // MATERIA is not: this repo has no Indian incense data at all — vedic-remedies.js
  // carries mantras, devatās, japa counts and āsana, and NAKSHATRA_INFO is
  // num/name/lord/deity/significance. There is no herb, tree, vanaspati or
  // samidha table anywhere in core/data.
  //
  // Under FRAMING §11.3 an empty cell is the only honest cell here. Filling it
  // from general knowledge is exactly the fabrication the whole protocol exists
  // to stop, and it would be indistinguishable on the page from a cited one.
  const h = vedicHora(now, lat, lon);
  const vedic = h
    ? `<div class="inc-assign inc-vedic">
        <b>Vedic horā</b> — ${esc(h.iast || h.graha)} <span class="small muted">${esc(h.devanagari || '')}</span>,
        ${h.night ? 'night' : 'day'} horā ${esc(h.indexInHalf)} of 12
        <span class="small muted">· day of ${esc(h.dayLord)}</span>
        <div class="small muted">Same arithmetic as the hour above, and that is a <b>sourced</b> claim,
          not an inference from the tables looking alike: al-Bīrūnī (c. AD 1030) reports the Indian
          dominants as arranged by <i>horæ obliquæ temporales</i> — twelve by day, twelve by night.</div>
        <div class="small"><b>Materia: not carried.</b> This repo holds no Indian incense data —
          no graha samidha, no nakṣatra-vanaspati, no remedial-herb table. Rather than fill the cell
          from general knowledge, it stays empty: an invented assignment would look exactly like a
          cited one. It needs its own sourced round.</div>
      </div>`
    : '';

  const assigned = m
    ? `<div class="inc-assign">The texts assign to ${esc(cur.ruler)}: <b>${esc(m.substance)}</b>
        <span class="small muted">— ${esc(m.source || '')}</span>
        ${m.harmFlag ? `<div class="small"><b>⚠ Record, not a recipe.</b> ${esc(m.harmNote || '')}</div>` : ''}
        ${m.truncatedInSource ? `<div class="small muted">${esc(m.truncationNote || '')}</div>` : ''}</div>`
    : '';

  el('inc-now-body').innerHTML = `
    <div class="inc-nowline">
      <span class="inc-glyph">${esc(GLYPH[cur.ruler] || '')}</span>
      <div>
        <div class="inc-ruler">Hour of ${esc(cur.ruler)} · ${cur.night ? 'Night' : 'Day'} ${esc(ROMAN[(idx % 12)])}</div>
        ${assigned}
        ${vedic}
      </div>
      <div class="inc-cd"><div class="inc-cd-t">${esc(cd)}</div>
        <div class="small muted">until the hour turns</div></div>
    </div>
    <p class="small muted">${esc(fmtT(cur.start))} – ${esc(fmtT(cur.end))}
      ${nxt ? `· next: ${esc(GLYPH[nxt.ruler] || '')} ${esc(nxt.ruler)} at ${esc(fmtT(nxt.start))}` : ''}
      · times in this device's zone.</p>`;

  el('inc-ribbon').innerHTML = rows.map(r => {
    const w = ((r.end - r.start) / span * 100).toFixed(3);
    const isNow = r === cur;
    return `<span class="inc-seg${r.night ? ' night' : ''}${isNow ? ' now' : ''}" style="width:${w}%"
      title="${esc(r.ruler)} · ${esc(fmtT(r.start))}–${esc(fmtT(r.end))}">${esc(GLYPH[r.ruler] || '')}</span>`;
  }).join('') + `<span class="inc-needle" style="left:${((now - day) / span * 100).toFixed(3)}%"></span>`;
}

function initNowPanel() {
  const el = id => document.getElementById(id);
  const host = el('inc-now-body');
  if (!host) return;
  el('inc-presets').innerHTML = PRESETS.map((p, i) =>
    `<button type="button" class="btn sm" data-i="${i}">${esc(p[0])}</button>`).join('');

  const recast = () => {
    const lat = parseFloat(el('inc-lat').value), lon = parseFloat(el('inc-lon').value);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;
    paintNow(lat, lon);
    if (_tick) clearInterval(_tick);
    _tick = setInterval(() => paintNow(lat, lon), 1000);
  };

  el('inc-presets').addEventListener('click', e => {
    const b = e.target.closest('button[data-i]'); if (!b) return;
    const p = PRESETS[+b.dataset.i];
    el('inc-lat').value = p[1]; el('inc-lon').value = p[2]; recast();
  });
  el('inc-recast').addEventListener('click', recast);
  el('inc-geo').addEventListener('click', () => {
    if (!navigator.geolocation) { el('inc-locnote').textContent = 'Geolocation unavailable — enter coordinates.'; return; }
    navigator.geolocation.getCurrentPosition(pos => {
      el('inc-lat').value = pos.coords.latitude.toFixed(2);
      el('inc-lon').value = pos.coords.longitude.toFixed(2);
      el('inc-locnote').textContent = 'Using your location. Coordinates stay in this browser.';
      recast();
    }, () => { el('inc-locnote').textContent = 'Location not shared — enter coordinates.'; });
  });
  recast();
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
  set('inc-comparison', renderComparison(tableComparison()));
  set('inc-questions', openQuestions().map(q =>
    `<div class="callout"><span class="label">${esc(q.title)}</span> ${esc(q.body)}
      <div class="small"><i>Status: ${esc(q.status)}</i></div></div>`).join(''));
  set('inc-census', renderCensus(census()));
  set('inc-source', esc(INCENSE_SOURCE));
  initNowPanel();
}
