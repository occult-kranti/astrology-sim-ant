// ============================================================================
//  kamea.js (app) — drives pages/picatrix/kameas.html: the seven planetary
//  magic squares of Agrippa II.22, rendered as live SVG with the sigil of any
//  name traced upon them (start-circle, end-bar, wave for a repeated cell),
//  plus each square's intelligence/spirit names, metal and recorded use.
//  All rendering here; all math in core/kamea.js (pure, engine-tested).
// ============================================================================
import { KAMEAS, kameaByPlanet } from '../core/data/kameas.js';
import { sigilFor, SIGIL_METHODS, validateKamea } from '../core/kamea.js';
import { renderCastHour } from './cast-hour.js';
import { autolinkResultPanels } from './shared.js';
import { PLANET_GLYPHS } from '../core/astro.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let planet = 'Saturn';

export function initKameas() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
  $('km-planet').innerHTML = KAMEAS.map(k => `<option value="${k.planet}">${PLANET_GLYPHS[k.planet] || ''} ${k.planet} — ${k.order}×${k.order}</option>`).join('');
  $('km-method').innerHTML = Object.entries(SIGIL_METHODS).map(([k, m]) => `<option value="${k}">${esc(m.label)}</option>`).join('');
  $('km-planet').addEventListener('change', () => { planet = $('km-planet').value; render(); });
  $('km-form').addEventListener('submit', e => { e.preventDefault(); render(); });
  $('km-name').addEventListener('input', () => render());
  $('km-method').addEventListener('change', () => render());
  render();
}

function render() {
  const k = kameaByPlanet(planet);
  if (!k) return;
  const name = $('km-name').value.trim();
  let sigil = null;
  if (name) { try { sigil = sigilFor(name, k, { method: $('km-method').value }); } catch { sigil = null; } }
  drawSquare(k, sigil);
  renderInfo(k, sigil);
}

// the square + the traced sigil, in one SVG (perfect alignment)
function drawSquare(k, sigil) {
  const n = k.order, S = 480, PAD = 6, cell = (S - 2 * PAD) / n;
  const cellXY = (row, col) => [PAD + col * cell + cell / 2, PAD + row * cell + cell / 2];
  let g = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const [x, y] = [PAD + c * cell, PAD + r * cell];
    g += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="var(--card)" stroke="var(--rule)"/>`;
    g += `<text x="${x + cell / 2}" y="${y + cell / 2}" font-size="${Math.max(10, cell * 0.34)}" text-anchor="middle" dominant-baseline="central" fill="var(--muted)">${k.rows[r][c]}</text>`;
  }
  let trace = '';
  if (sigil && sigil.steps.length) {
    const pts = sigil.steps.map(s => cellXY(s.row, s.col));
    if (pts.length > 1) trace += `<polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="var(--link)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>`;
    const [sx, sy] = pts[0];
    trace += `<circle cx="${sx}" cy="${sy}" r="${Math.max(6, cell * 0.14)}" fill="none" stroke="var(--link)" stroke-width="3"/>`;
    const [ex, ey] = pts[pts.length - 1];
    const dirIdx = pts.length > 1 ? pts.length - 2 : 0;
    const ang = pts.length > 1 ? Math.atan2(ey - pts[dirIdx][1], ex - pts[dirIdx][0]) : 0;
    const bl = Math.max(8, cell * 0.18);
    trace += `<line x1="${(ex - bl * Math.sin(ang)).toFixed(1)}" y1="${(ey + bl * Math.cos(ang)).toFixed(1)}" x2="${(ex + bl * Math.sin(ang)).toFixed(1)}" y2="${(ey - bl * Math.cos(ang)).toFixed(1)}" stroke="var(--link)" stroke-width="3"/>`;
    for (const s of sigil.steps) if (s.repeats > 1) { const [wx, wy] = cellXY(s.row, s.col); trace += `<path d="M ${wx - 10} ${wy + cell * 0.24} q 5 -6 10 0 q 5 6 10 0" fill="none" stroke="var(--link)" stroke-width="2"/>`; }
  }
  $('km-square').innerHTML = `<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="The kamea of ${esc(k.planet)}${sigil ? ' with a traced sigil' : ''}" style="width:100%;max-width:${S}px">${g}${trace}</svg>`;
}

function renderInfo(k, sigil) {
  const v = validateKamea(k.rows);
  const moonExtra = k.spiritOfSpirits ? `<li><b>Spirit of the spirits:</b> ${esc(k.spiritOfSpirits.name)} (${k.spiritOfSpirits.value}) — ${esc(k.spiritOfSpirits.note)}</li>` : '';
  $('km-info').innerHTML = `
    <p class="small"><b>The square of ${esc(k.planet)}</b> — order ${k.order}: the numbers 1…${k.order * k.order}, every row,
      column and diagonal summing to <b>${k.magicConstant}</b>, the whole to <b>${k.totalSum}</b>
      <span class="verdict ${v.ok ? 'green' : 'red'}">${v.ok ? 'verified live' : 'INVALID'}</span></p>
    <ul class="clean small">
      <li><b>Intelligence:</b> ${esc(k.intelligence.name)}${k.intelligence.hebrew ? ` (${esc(k.intelligence.hebrew)})` : ''} — gematria <b>${k.intelligence.value}</b>${k.intelligence.note ? ` <span class="muted">(${esc(k.intelligence.note)})</span>` : ''}</li>
      <li><b>Spirit:</b> ${esc(k.spirit.name)}${k.spirit.hebrew ? ` (${esc(k.spirit.hebrew)})` : ''} — gematria <b>${k.spirit.value}</b></li>
      ${moonExtra}
      <li><b>Engraving:</b> ${esc(k.metal)}</li>
    </ul>
    <p class="small"><b>The recorded use (historical only):</b> ${esc(k.use)}</p>
    <p class="small muted"><b>The seal:</b> ${esc(k.sealNote)}</p>
    ${sigil ? `<h3>The traced sigil — “${esc(sigil.text)}”</h3>
      <p class="small">${sigil.steps.map(s => `${esc(s.letters)}${s.value > s.cellValue ? ` (${s.value}→${s.cellValue})` : ` (${s.cellValue})`}`).join(' · ')}</p>
      <p class="small muted">${esc(sigil.methodNote)} ${esc(sigil.note)}</p>` : ''}
    <p class="small muted">— ${esc(k.citation)}</p>`;
  try { autolinkResultPanels(['km-info']); } catch { /* non-fatal */ }
}
