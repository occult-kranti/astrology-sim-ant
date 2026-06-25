// ============================================================================
//  book1.js — interactive references and calculators for Book I (Fundamentals):
//  the Table of Essential Dignities, the Dignity Calculator, the Planetary
//  Hours tool, and renderers for the signs/planets/houses reference pages.
// ============================================================================
import { signOf, formatLon, norm360, PLANET_GLYPHS, SIGN_GLYPHS, SIGNS as SIGNNAMES } from '../core/astro.js';
import { essentialDignity, almuten } from '../core/dignities.js';
import {
  DOMICILE, DETRIMENT, EXALT_BY_SIGN, TRIPLICITY_BY_SIGN, TERMS, FACES, ORBS, ORBS_ALT, JOYS
} from '../core/data/dignities-data.js';
import { PLANETS, PLANET_LIST } from '../core/data/planets.js';
import { SIGNS, ELEMENTS, MODES } from '../core/data/signs.js';
import { HOUSES } from '../core/data/houses.js';
import { hoursTable, planetaryHour } from '../core/planetary-hours.js';
import { wireCitySelect, nowLocalFields } from './shared.js';

const $ = id => document.getElementById(id);
const PL = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const G = p => PLANET_GLYPHS[p] || p;

// ---------------------------------------------------------------------------
//  The Table of Essential Dignities (all 12 signs)
// ---------------------------------------------------------------------------
export function renderDignityTable(el) {
  let html = `<table class="data"><thead><tr>
    <th class="l">Sign</th><th>Ruler</th><th>Exalt.</th><th>Tripl. (D/N)</th>
    <th class="l">Terms (Ptolemaic)</th><th class="l">Faces (10° each)</th><th>Detri.</th><th>Fall</th>
  </tr></thead><tbody>`;
  for (let s = 0; s < 12; s++) {
    const tri = TRIPLICITY_BY_SIGN[s];
    const ex = EXALT_BY_SIGN[s];
    const terms = TERMS[s].map(([p, a, b]) => `${G(p)}${b}`).join(' ');
    const faces = FACES[s].map(p => G(p)).join('&nbsp;&nbsp;');
    // fall = planet exalted opposite
    const fallEntry = EXALT_BY_SIGN[(s + 6) % 12];
    html += `<tr>
      <td class="l">${SIGN_GLYPHS[s]} ${SIGNNAMES[s]}</td>
      <td>${G(DOMICILE[s])}</td>
      <td>${ex ? G(ex.planet) + ' ' + ex.deg + '°' : '—'}</td>
      <td>${G(tri.day)}/${G(tri.night)}</td>
      <td class="l mono small">${terms}</td>
      <td class="l">${faces}</td>
      <td>${G(DETRIMENT[s])}</td>
      <td>${fallEntry ? G(fallEntry.planet) : '—'}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  el.innerHTML = html;
}

// ---------------------------------------------------------------------------
//  Dignity Calculator
// ---------------------------------------------------------------------------
export function initDignityCalc() {
  $('d-planet').innerHTML = PL.map(p => `<option value="${p}">${G(p)} ${p}</option>`).join('');
  $('d-sign').innerHTML = SIGNNAMES.map((n, i) => `<option value="${i}">${SIGN_GLYPHS[i]} ${n}</option>`).join('');
  $('d-form').addEventListener('submit', e => { e.preventDefault(); runDignity(); });
  ['d-planet', 'd-sign', 'd-deg', 'd-sect'].forEach(id => $(id).addEventListener('change', runDignity));
  runDignity();
}
function runDignity() {
  const planet = $('d-planet').value;
  const sign = parseInt($('d-sign').value, 10);
  const deg = Math.min(29.99, Math.max(0, parseFloat($('d-deg').value) || 0));
  const isDay = $('d-sect').value === 'day';
  const lon = sign * 30 + deg;
  const ed = essentialDignity(planet, lon, isDay);
  const al = almuten(lon, isDay);
  $('d-result').innerHTML = `
    <p class="lede">${G(planet)} <b>${planet}</b> at <b>${formatLon(lon)}</b> (${isDay ? 'day' : 'night'} chart)</p>
    <table class="data" style="max-width:480px"><thead><tr><th class="l">Dignity / debility</th><th>Points</th></tr></thead>
    <tbody>${ed.rows.map(r => `<tr><td class="l">${r.kind}</td><td class="${r.score >= 0 ? 'pos' : 'neg'}">${r.score >= 0 ? '+' : ''}${r.score}</td></tr>`).join('')}
      <tr><td class="l"><b>Net essential score</b></td><td class="${ed.total >= 0 ? 'pos' : 'neg'}"><b>${ed.total >= 0 ? '+' : ''}${ed.total}</b></td></tr>
    </tbody></table>
    <p class="small muted">Dispositor (lord of the sign): ${G(ed.dispositor)} ${ed.dispositor}.
      Almuten of this degree (planet with most dignity here): <b>${G(al.planet)} ${al.planet}</b> (score ${al.score}).</p>`;
}

// ---------------------------------------------------------------------------
//  Planetary Hours tool
// ---------------------------------------------------------------------------
export function initPlanetaryHours() {
  const n = nowLocalFields();
  $('ph-date').value = n.date; $('ph-lat').value = 51.5074; $('ph-lon').value = -0.1278;
  wireCitySelect($('ph-city'), $('ph-lat'), $('ph-lon'), null);
  $('ph-form').addEventListener('submit', e => { e.preventDefault(); runHours(); });
  $('ph-now').addEventListener('click', () => { $('ph-date').value = nowLocalFields().date; runHours(); });
  runHours();
}
function runHours() {
  const [y, mo, d] = $('ph-date').value.split('-').map(Number);
  const lat = parseFloat($('ph-lat').value), lon = parseFloat($('ph-lon').value);
  const noon = new Date(Date.UTC(y, mo - 1, d, 12, 0));
  const now = new Date();
  const tbl = hoursTable(noon, lat, lon);
  const cur = planetaryHour(now, lat, lon);
  if (!tbl) { $('ph-result').innerHTML = '<p class="muted">No sunrise/sunset for this latitude/date (polar).</p>'; return; }
  const fmt = dt => dt.toISOString().slice(11, 16) + 'Z';
  $('ph-current').innerHTML = cur
    ? `<div class="callout"><span class="label">Right now</span> The planetary hour is ruled by
       <b>${G(cur.ruler)} ${cur.ruler}</b> — hour ${cur.hourNumber} of a <b>${cur.dayRuler}</b> day
       (${cur.isNight ? 'night' : 'day'} hour). Each hour ≈ ${cur.hourLengthMinutes.toFixed(0)} min.</div>`
    : '';
  let rows = '';
  for (const r of tbl.rows) {
    rows += `<tr${r.ruler === tbl.dayRuler && r.hour === 1 ? ' style="font-weight:600"' : ''}>
      <td>${r.hour}</td><td>${r.night ? 'Night' : 'Day'}</td><td class="l">${fmt(r.start)}</td><td>${G(r.ruler)} ${r.ruler}</td></tr>`;
  }
  $('ph-result').innerHTML = `<p class="small muted">Day ruler: <b>${G(tbl.dayRuler)} ${tbl.dayRuler}</b> ·
    sunrise ${fmt(tbl.sunrise)} · sunset ${fmt(tbl.sunset)} (times in UTC)</p>
    <table class="data" style="max-width:520px"><thead><tr><th>Hour</th><th>Part</th><th class="l">Begins</th><th>Ruler</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ---------------------------------------------------------------------------
//  Reference renderers (signs / planets / houses)
// ---------------------------------------------------------------------------
export function renderSigns(el) {
  el.innerHTML = SIGNS.map((s, i) => `<div class="card">
    <h3><span class="glyph-badge" style="font-size:1.4rem">${s.glyph}</span> ${s.name}
      <span class="pill">${s.element}</span><span class="pill">${s.mode}</span><span class="pill">${s.gender}</span></h3>
    <p class="small"><b>Ruler:</b> ${G(s.ruler)} ${s.ruler} · <b>Nature:</b> ${s.quality} · <b>Rules the body:</b> ${s.body}</p>
    <p class="small">${s.description}</p>
    <p class="small muted"><b>Diseases:</b> ${s.diseases}</p>
    <p class="small muted"><b>Places:</b> ${s.places}</p>
    <p class="small muted"><b>Countries:</b> ${s.countries}</p>
  </div>`).join('');
}
export function renderPlanets(el) {
  el.innerHTML = PLANET_LIST.map(p => `<div class="card">
    <h3><span class="glyph-badge">${p.glyph}</span> ${p.name} <span class="muted" style="font-size:.9rem">— ${p.title}</span></h3>
    <p class="small"><b>Nature:</b> ${p.nature}</p>
    <p class="small"><b>Rules:</b> ${p.houses} · <b>Exalt.:</b> ${p.exaltation} · <b>Detri.:</b> ${p.detriment} · <b>Fall:</b> ${p.fall} · <b>Joy:</b> ${p.joy}</p>
    <p class="small"><b>Well dignified:</b> ${p.wellDignified}</p>
    <p class="small"><b>Ill dignified:</b> ${p.illDignified}</p>
    <p class="small muted"><b>Corporature:</b> ${p.corporature}</p>
    <p class="small muted"><b>Men &amp; professions:</b> ${p.men}</p>
    <p class="small muted"><b>Diseases:</b> ${p.diseases}</p>
    <p class="small muted">${p.associations}</p>
  </div>`).join('');
}
export function renderHouses(el) {
  el.innerHTML = HOUSES.map(h => `<div class="card">
    <h3>${h.n}. ${h.name} ${h.angle ? `<span class="pill">${h.angle}</span>` : ''}<span class="pill">${h.type}</span></h3>
    <p class="small"><b>Signifies:</b> ${h.signifies}</p>
    <p class="small muted"><b>Co-significators:</b> ${h.cosig}${h.joy ? ` · <b>Joy of:</b> ${G(h.joy)} ${h.joy}` : ''} · <b>Body:</b> ${h.bodyPart}</p>
  </div>`).join('');
}
