// ============================================================================
//  kamea.js (app) — drives pages/picatrix/kameas.html: the seven planetary
//  magic squares of Agrippa II.22, rendered as live SVG with explicit Latin or
//  Hebrew name traces (start-circle, end-bar, wave for a repeated cell),
//  plus each square's intelligence/spirit names, metal and recorded use.
//  Results and diagrams use the shared pure symbols / symbol-svg modules.
// ============================================================================
import { KAMEAS, kameaByPlanet } from '../core/data/kameas.js';
import { validateKamea } from '../core/kamea.js';
import { createSymbolResult, SYMBOL_METHODS } from '../core/symbols.js';
import { renderSymbolSVG } from '../core/viz/symbol-svg.js';
import { downloadSVG, svgToPNG, downloadJSON } from './state.js';
import { renderCastHour } from './cast-hour.js';
import { autolinkResultPanels } from './shared.js';
import { PLANET_GLYPHS } from '../core/astro.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let planet = 'Saturn';
let currentResult = null;

export function initKameas() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
  $('km-planet').innerHTML = KAMEAS.map(k => `<option value="${k.planet}">${PLANET_GLYPHS[k.planet] || ''} ${k.planet} — ${k.order}×${k.order}</option>`).join('');
  $('km-method').innerHTML = SYMBOL_METHODS.kamea.map(m => `<option value="${m.id}">${esc(m.label)}</option>`).join('');
  $('km-planet').addEventListener('change', () => { planet = $('km-planet').value; render(); });
  $('km-form').addEventListener('submit', e => { e.preventDefault(); render(); });
  $('km-name').addEventListener('input', () => render());
  $('km-method').addEventListener('change', () => render());
  $('km-svg').addEventListener('click', () => {
    if (!currentResult) return;
    try { downloadSVG($('km-square').querySelector('svg'), 'kamea.svg'); } catch (error) { $('km-status').textContent = error.message; }
  });
  $('km-png').addEventListener('click', () => {
    if (!currentResult) return;
    svgToPNG($('km-square').querySelector('svg'), 'kamea.png').catch(error => { $('km-status').textContent = error.message; });
  });
  $('km-json').addEventListener('click', () => { if (currentResult) downloadJSON(currentResult, 'kamea-method.json'); });
  render();
}

function render() {
  const k = kameaByPlanet(planet);
  if (!k) return;
  const name = $('km-name').value;
  currentResult = null;
  try {
    const result = createSymbolResult({ kind: 'kamea', planet, text: name, method: $('km-method').value });
    const diagram = renderSymbolSVG(result);
    $('km-square').innerHTML = diagram.svg;
    const svg = $('km-square').querySelector('svg'); svg.style.width = '100%'; svg.style.height = 'auto';
    currentResult = result;
    const norm = result.normalization;
    $('km-status').textContent = result.trace
      ? `Normalized letters: ${norm.normalized}. ${norm.changes.length} case, separator or vowel-mark changes disclosed in the JSON export. ${result.method.note}`
      : 'Square only. Enter a name in the alphabet selected above to trace its letters.';
    $('km-name').removeAttribute('aria-invalid');
    renderInfo(k, result.trace);
  } catch (error) {
    $('km-square').textContent = 'No diagram for this input.';
    $('km-status').textContent = error.message || 'The input could not be traced.';
    $('km-name').setAttribute('aria-invalid', 'true');
    renderInfo(k, null);
  }
  for (const id of ['km-svg', 'km-png', 'km-json']) $(id).disabled = !currentResult;
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
