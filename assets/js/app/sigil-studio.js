import { createSigilDesign, makeSigilRecipe, buildSigilImagePrompt, SIGIL_PALETTES } from '../core/sigil-design.js';
import { downloadBlob, downloadJSON } from './state.js';
const $ = id => document.getElementById(id);
const el = (tag, text, className) => { const node = document.createElement(tag); if (text != null) node.textContent = String(text); if (className) node.className = className; return node; };
let current = null, displayed = null, epoch = 0, active = true, pendingImage = null, pendingURL = null;
const status = text => { $('sg-status').textContent = text; };
const exportStatus = text => { $('sg-export-status').textContent = text; };
const mode = () => document.querySelector('input[name="sg-mode"]:checked').value;
const setActions = valid => ['sg-svg','sg-png','sg-json','sg-prepare-prompt'].forEach(id => { $(id).disabled = !valid; });
function clearPrompt(message = 'The drawing changed. Prepare a fresh image prompt.') {
  $('sg-prompt-preview').value = ''; $('sg-copy-prompt').disabled = true; $('sg-prompt-status').textContent = message;
}
function cancelPNG() {
  if (pendingImage) { pendingImage.onload = pendingImage.onerror = null; pendingImage.src = ''; pendingImage = null; }
  if (pendingURL) { URL.revokeObjectURL(pendingURL); pendingURL = null; }
}
function invalidate() {
  epoch++; current = null; cancelPNG(); setActions(false); clearPrompt();
  $('sg-stale').hidden = !displayed; $('sg-error').hidden = true; exportStatus('');
  status('Inputs changed. Draw this design again to update the figure, study sheet and exports.');
}
function modeLabels() {
  const selected = mode(), planetary = selected === 'planetary', mandala = selected === 'mandala';
  $('sg-planetary-options').hidden = !planetary; $('sg-mandala-options').hidden = !mandala;
  $('sg-text-label').textContent = mandala ? 'Personal theme (optional; does not change geometry)' : planetary ? 'Name or phrase to trace (optional)' : 'Your intention';
  $('sg-text-help').textContent = mandala ? 'A contemporary nonsectarian rosette. Symmetry, rings and seed define the geometry; a theme is optional personal context.' : planetary ? 'Choose the exact Latin or Hebrew method. Alphabets are validated; no transliteration is guessed. Leave text empty for the sourced square alone.' : 'Latin A–Z; vowels and repeated consonants are removed by this modern art method. Unsupported scripts are reported, never silently transliterated.';
  $('sg-variation').disabled = planetary;
  $('sg-variation').title = planetary ? 'The sourced square and letter path stay fixed; the seed does not change them.' : 'Increase the deterministic art seed by one.';
}
function readNumber(id) {
  const raw = $(id).value.trim();
  if (!raw || !Number.isFinite(Number(raw))) throw new RangeError(`Enter a finite value for ${$(id).labels[0]?.textContent || id}.`);
  return Number(raw);
}
function inputs() {
  return { mode: mode(), text: $('sg-text').value, planet: $('sg-planet').value, method: $('sg-method').value, seed: readNumber('sg-seed'), symmetry: readNumber('sg-symmetry'), rings: readNumber('sg-rings'), rotation: readNumber('sg-rotation'), stroke: readNumber('sg-stroke'), palette: $('sg-palette').value, showGrid: $('sg-grid').checked, book: $('sg-book').value, calendar: $('sg-calendar').value, moment: { dateISO: $('sg-instant').value.trim(), lat: readNumber('sg-lat'), lon: readNumber('sg-lon'), timeZone: $('sg-zone').value.trim() } };
}
function render(result) {
  // SVG is emitted only by the validated numeric local renderer, never a model
  // response, imported markup, source-book HTML or an entered phrase.
  $('sg-preview').innerHTML = result.svg;
  $('sg-output-kind').textContent = result.inputs.mode === 'planetary' ? `${result.inputs.planet.toUpperCase()} · SOURCED SQUARE` : 'PROCEDURAL ART';
  $('sg-caption').textContent = `${result.title} · ${SIGIL_PALETTES[result.inputs.palette].label} · seed ${result.inputs.seed}. ${result.method.status}.`;
  $('sg-stale').hidden = true;
  $('sg-setup').replaceChildren(...result.studySetup.sections.map(section => {
    const article = el('article'); article.append(el('p', section.sourceStatus, 'sg-source-status'), el('h3', section.title), el('p', section.text)); return article;
  }));
  $('sg-sources').replaceChildren(...result.sources.map(source => {
    const item = el('article', null, 'sg-source-item'), link = el('a', `[${source.id}] ${source.title}`);
    link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    item.append(link, el('p', source.status, 'sg-source-status'));
    if (source.section || source.edition) item.append(el('p', [source.section, source.edition].filter(Boolean).join(' · '), 'sg-help'));
    item.append(el('p', source.note)); return item;
  }));
  $('sg-construction').textContent = JSON.stringify({ method: result.method, construction: result.construction, limits: result.studySetup.limitations }, null, 2);
}
function draw({ focusError = false } = {}) {
  invalidate();
  try {
    const result = createSigilDesign(inputs()); current = displayed = result; render(result); setActions(true);
    status('Drawing and paper-only study sheet updated locally. Nothing has been saved or sent.');
    return result;
  } catch (error) {
    $('sg-error').textContent = error.message || 'The drawing could not be generated. Check the labelled inputs.';
    $('sg-error').hidden = false;
    if (focusError) { for (const detail of document.querySelectorAll('#sg-form details')) detail.open = true; $('sg-error').focus(); }
    status('No current drawing. Correct the inputs and draw again. Previous exports remain disabled.');
    return null;
  }
}
function ensureCurrent() {
  if (!active || !current) { exportStatus('Draw the current inputs before exporting.'); return null; }
  return current;
}
$('sg-form').addEventListener('input', () => { invalidate(); modeLabels(); });
$('sg-form').addEventListener('change', () => { invalidate(); modeLabels(); });
$('sg-form').addEventListener('submit', event => { event.preventDefault(); draw({ focusError: true }); });
$('sg-now').addEventListener('click', () => { $('sg-instant').value = new Date().toISOString(); invalidate(); status('Current UTC time filled. Draw again to freeze it in the study sheet.'); });
$('sg-variation').addEventListener('click', () => {
  try { $('sg-seed').value = (readNumber('sg-seed') + 1) % 4294967296; invalidate(); draw({ focusError: true }); }
  catch (error) { $('sg-error').textContent = error.message; $('sg-error').hidden = false; }
});
$('sg-svg').addEventListener('click', () => { const result = ensureCurrent(); if (!result) return; downloadBlob(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' }), `symbolic-${result.inputs.mode}-${result.inputs.seed}.svg`); exportStatus('Editable SVG downloaded. Original phrase and exact observer omitted; the geometry can still encode the phrase.'); });
$('sg-json').addEventListener('click', () => { const result = ensureCurrent(); if (!result) return; downloadJSON(makeSigilRecipe(result, { includePrivate: $('sg-private').checked }), `symbolic-${result.inputs.mode}-${result.inputs.seed}.json`); exportStatus($('sg-private').checked ? 'Drawing recipe downloaded with original text and exact observer, as selected.' : 'Numeric drawing recipe downloaded. Original text and exact observer omitted; path information remains.'); });
$('sg-png').addEventListener('click', () => {
  const result = ensureCurrent(); if (!result) return;
  cancelPNG(); const token = epoch, image = new Image(); pendingImage = image;
  const url = URL.createObjectURL(new Blob([result.svg], { type: 'image/svg+xml' })); pendingURL = url;
  exportStatus('Rendering PNG locally…');
  image.onload = () => {
    if (!active || token !== epoch || current !== result) { cancelPNG(); return; }
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1280;
    const context = canvas.getContext('2d');
    if (!context) { cancelPNG(); exportStatus('PNG rendering is unavailable. The editable SVG remains available.'); return; }
    context.drawImage(image, 0, 0, 1280, 1280);
    canvas.toBlob(blob => {
      if (!active || token !== epoch || current !== result) return;
      if (!blob) { exportStatus('PNG rendering failed. Try the SVG download.'); return; }
      downloadBlob(blob, `symbolic-${result.inputs.mode}-${result.inputs.seed}.png`); exportStatus('1280 × 1280 PNG downloaded. This is the local procedural drawing, not an AI-rendered image.');
    }, 'image/png');
    cancelPNG();
  };
  image.onerror = () => { cancelPNG(); if (active && token === epoch) exportStatus('PNG rendering failed. The editable SVG is still available.'); };
  image.src = url;
});
$('sg-private').addEventListener('change', () => clearPrompt('Disclosure choice changed. Prepare and review a fresh prompt before copying.'));
$('sg-prepare-prompt').addEventListener('click', () => {
  const result = ensureCurrent(); if (!result) return;
  try { const prompt = buildSigilImagePrompt(result, { includePrivate: $('sg-private').checked }); $('sg-prompt-preview').value = prompt.text; $('sg-copy-prompt').disabled = false; $('sg-prompt-status').textContent = 'Prompt prepared locally. Review the exact text, copy it and attach the SVG or PNG in your chosen chat. No model request was made.'; }
  catch (error) { clearPrompt(error.message); }
});
$('sg-copy-prompt').addEventListener('click', async () => {
  if (!ensureCurrent() || !$('sg-prompt-preview').value) return;
  const token = epoch, text = $('sg-prompt-preview').value;
  try { await navigator.clipboard.writeText(text); if (active && token === epoch && text === $('sg-prompt-preview').value) $('sg-prompt-status').textContent = 'Image prompt copied. Open your chat, attach the reference and explicitly send it. Nothing was sent here.'; }
  catch { if (active && token === epoch && text === $('sg-prompt-preview').value) { $('sg-prompt-preview').focus(); $('sg-prompt-preview').select(); $('sg-prompt-status').textContent = 'Clipboard access is unavailable. Select and copy the preview manually.'; } }
});
window.addEventListener('pagehide', () => { active = false; invalidate(); });
window.addEventListener('pageshow', () => { active = true; });
let incomingError = null;
try {
  const query = new URLSearchParams(location.search);
  for (const [key,id] of [['at','sg-instant'],['lat','sg-lat'],['lon','sg-lon'],['zone','sg-zone'],['book','sg-book'],['calendar','sg-calendar']]) if (query.has(key)) $(id).value = query.get(key);
  if (query.has('mode')) { const option = [...document.querySelectorAll('input[name="sg-mode"]')].find(input => input.value === query.get('mode')); if (!option) throw new RangeError('The incoming construction mode is unsupported.'); option.checked = true; }
} catch (error) { incomingError = error.message; }
modeLabels();
if (incomingError) { invalidate(); $('sg-error').textContent = incomingError; $('sg-error').hidden = false; } else draw();
