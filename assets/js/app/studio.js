// Focused local workspace. A live tick owns neither persistence nor network.
import { calculateContext, parseExplicitInstant } from '../core/calculation-context.js';
import { createLiveClock } from './live-clock.js';
import { renderChart } from '../core/chart.js';
import { allAspects } from '../core/aspects.js';
import { formatLon } from '../core/astro.js';
import { vedicChartModel } from './vedic-panel.js';
import { northIndianChart, southIndianChart } from '../core/vedic-chart.js';
import { createSymbolResult, SYMBOL_METHODS } from '../core/symbols.js';
import { renderSymbolSVG } from '../core/viz/symbol-svg.js';
import { gematria, GEMATRIA_METHODS } from '../core/kabbalah.js';
import { normalizeSigilText } from '../core/kamea.js';
import { katapayadiDecode } from '../core/yantra.js';
import { downloadJSON, downloadSVG, svgToPNG } from './state.js';

const $ = id => document.getElementById(id);
const TASKS = ['western', 'vedic', 'kamea', 'yantra', 'gematria', 'katapayadi'];
const PLANETS = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const NAVAGRAHA = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const KEY = 'wb-studio-v1', SNAPSHOTS = 'wb-studio-snapshots-v1';
const utc = value => new Date(value).toISOString().replace('T', ' ').replace('.000Z', ' UTC');
const defaults = () => ({ task: 'western', dateISO: new Date().toISOString(), lat: 51.5074, lon: -.1278,
  system: 'regiomontanus', style: 'north', planet: 'Saturn', method: 'latin', text: '', followHour: false, locationSource: 'demo' });
let displayed = null, traceStep = null, traceTimer = null, current = defaults(), snapshots = [], pendingLocation = 0, resultCurrent = false;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const node = (tag, text, cls) => { const el = document.createElement(tag); if (text != null) el.textContent = text; if (cls) el.className = cls; return el; };
function status(message, error = false) { $('studioStatus').textContent = message; $('studioStatus').dataset.error = String(error); }
function draft() {
  resultCurrent = false;
  ['studioSaveSnapshot', 'studioExportSVG', 'studioExportPNG', 'studioExportJSON', 'studioTracePlay', 'studioTraceReset', 'studioTraceStep'].forEach(id => $(id).disabled = true);
}
function normalizationText(value) {
  if (!value) return '';
  return `Normalized text: ${value.normalized || '(empty)'}. ${value.changes.length ? value.changes.map(change => `${JSON.stringify(change.character)}: ${change.action}${change.value ? ` → ${change.value}` : ''}`).join('; ') : 'No character changes.'}`;
}
function validate(input) {
  if (!input || typeof input !== 'object' || !TASKS.includes(input.task)) throw new Error('Choose a supported study task.');
  const date = parseExplicitInstant(input.dateISO);
  if (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100) throw new Error('Studio dates must be between 1900 and 2100.');
  if (!Number.isFinite(input.lat) || Math.abs(input.lat) > 90 || !Number.isFinite(input.lon) || Math.abs(input.lon) > 180) throw new Error('Enter latitude −90…90 and longitude −180…180 in degrees.');
  if (!['regiomontanus', 'placidus', 'whole', 'equal'].includes(input.system)) throw new Error('Choose a supported house convention.');
  if (!['north', 'south'].includes(input.style) || !NAVAGRAHA.includes(input.planet)) throw new Error('Choose a supported diagram and planet.');
  if (typeof input.text !== 'string' || Array.from(input.text).length > 256) throw new Error('Use at most 256 characters.');
  const methods = input.task === 'gematria' ? ['standard', 'gadol'] : input.task === 'katapayadi' ? ['iast'] : input.task === 'yantra' ? ['navagraha'] : SYMBOL_METHODS.kamea.map(m => m.id);
  if (!methods.includes(input.method)) throw new Error('Choose a supported letter-value method.');
  if (input.task === 'kamea' && !PLANETS.includes(input.planet)) throw new Error('Choose one of the seven kamea planets.');
  return { task: input.task, dateISO: date.toISOString(), lat: input.lat, lon: input.lon, system: input.system,
    style: input.style, planet: input.planet, method: input.method, text: input.text,
    followHour: input.followHour === true, locationSource: ['demo', 'device', 'manual', 'saved'].includes(input.locationSource) ? input.locationSource : 'saved' };
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { $('studioStorageStatus').textContent = 'Browser storage is unavailable or full. Export JSON to keep this result.'; return false; }
}
try {
  const saved = localStorage.getItem(KEY); if (saved) current = validate(JSON.parse(saved));
  const list = JSON.parse(localStorage.getItem(SNAPSHOTS) || '[]');
  if (Array.isArray(list)) snapshots = list.slice(0, 12).flatMap(item => {
    try { return [{ id: String(item.id).slice(0, 80), input: validate(item.input), traceStep: Number.isInteger(item.traceStep) && item.traceStep >= 0 && item.traceStep <= 256 ? item.traceStep : null }]; } catch { return []; }
  });
} catch { $('studioStorageStatus').textContent = 'A saved Studio value was unavailable or invalid. Starting with a fresh moment; other Workbench data is unchanged.'; }

function options(select, list, value) {
  select.replaceChildren(...list.map(item => { const option = node('option', item.label || item); option.value = item.id || item; return option; }));
  select.value = list.some(item => (item.id || item) === value) ? value : (list[0].id || list[0]);
}
function fields() {
  const task = $('studioTask').value;
  for (const [id, shown] of Object.entries({ studioHousesField: task === 'western', studioVedicField: task === 'vedic',
    studioPlanetField: ['kamea', 'yantra'].includes(task), studioSymbolMethodField: ['kamea', 'gematria'].includes(task),
    studioTextField: ['kamea', 'gematria', 'katapayadi'].includes(task), studioFollowField: ['kamea', 'yantra'].includes(task) })) {
    $(id).hidden = !shown; $(id).querySelectorAll('input,select').forEach(el => el.disabled = !shown);
  }
  options($('studioPlanet'), task === 'yantra' ? NAVAGRAHA : PLANETS, current.planet);
  const methods = task === 'gematria' ? Object.entries(GEMATRIA_METHODS).map(([id, m]) => ({ id, label: m.label })) : SYMBOL_METHODS.kamea;
  options($('studioSymbolMethod'), methods, current.method);
  const hebrew = task === 'gematria' || $('studioSymbolMethod').value.startsWith('hebrew-');
  $('studioText').required = task === 'gematria' || task === 'katapayadi';
  $('studioText').lang = hebrew ? 'he' : task === 'katapayadi' ? 'sa-Latn' : 'en';
  $('studioTextLabel').textContent = hebrew ? 'Hebrew text' : task === 'katapayadi' ? 'Sanskrit text · IAST transliteration' : 'Name or text · Latin letters';
  $('studioTextHelp').textContent = hebrew ? 'Hebrew letters only; spaces, punctuation and vowel marks do not contribute. Values and any normalization are shown below.' : task === 'katapayadi' ? 'IAST letters, for example rāma. Syllables produce digits in word order, read right to left; a trailing consonant without a vowel does not count.' : 'Leave empty for a square only. Latin and AIQ methods are modern reconstructions; normalized letters and reductions are listed.';
}
function fill(input) {
  current = { ...input };
  $('studioTask').value = input.task; $('studioTime').value = input.dateISO.slice(0, 19);
  $('studioLat').value = input.lat; $('studioLon').value = input.lon; $('studioHouses').value = input.system;
  $('studioVedicStyle').value = input.style; $('studioText').value = input.text; $('studioFollowHour').checked = input.followHour;
  fields(); locationLabel(input);
}
function locationLabel(input) { $('studioLocationStatus').textContent = input.locationSource === 'demo' ? 'Demo coordinates: London. Set your own observer or request device location.' : `${input.locationSource === 'device' ? 'Device' : 'Entered / saved'} coordinates: ${input.lat.toFixed(4)}° north, ${input.lon.toFixed(4)}° east.`; }
function read() {
  const task = $('studioTask').value, rawDate = $('studioTime').value;
  if (!$('studioForm').reportValidity()) throw new Error('Complete the highlighted input before updating.');
  if (!rawDate) throw new Error('Enter an explicit UTC date and time.');
  return validate({ task, dateISO: `${rawDate}Z`, lat: Number($('studioLat').value), lon: Number($('studioLon').value),
    system: $('studioHouses').value, style: $('studioVedicStyle').value, planet: $('studioPlanet').value,
    method: task === 'katapayadi' ? 'iast' : task === 'yantra' ? 'navagraha' : $('studioSymbolMethod').value,
    text: task === 'yantra' ? '' : $('studioText').value, followHour: $('studioFollowHour').checked,
    locationSource: current.locationSource });
}
function calculate(input) {
  input = validate(input);
  const needsContext = ['western', 'vedic'].includes(input.task) || (input.followHour && ['kamea', 'yantra'].includes(input.task));
  const context = needsContext ? calculateContext({ ...input, includeVedic: input.task === 'vedic', includeReading: false }) : null;
  let result = null, followNote = '';
  if (['kamea', 'yantra'].includes(input.task)) {
    if (input.followHour) {
      if (context.planetaryHour) { input.planet = context.planetaryHour.ruler; followNote = `Following planetary hour ${context.planetaryHour.hourNumber}: ${input.planet}. ${context.planetaryHour.weekdayMethod}.`; }
      else followNote = `No usable sunrise–sunset interval at this location and instant. Kept ${input.planet}; planetary-hour following is unavailable.`;
    }
    result = createSymbolResult({ kind: input.task, planet: input.planet, method: input.method, text: input.text });
  } else if (input.task === 'gematria') {
    const normalization = normalizeSigilText(input.text, 'hebrew');
    if (!normalization.normalized) throw new Error('Enter at least one Hebrew letter.');
    result = { ...gematria(normalization.normalized, { method: input.method }), normalization };
  } else if (input.task === 'katapayadi') {
    const text = input.text.normalize('NFC');
    if (/[^aāiīuūṛṝḷḹeēoōkgṅcjñṭḍṇtdnpbmyrlvśṣshṃṁḥ\s.,;:!?\-'’]/iu.test(text)) throw new Error('Use Sanskrit IAST transliteration, not Devanagari, numbers or unrelated letters.');
    result = katapayadiDecode(text);
    if (!result.digits.length) throw new Error('No complete IAST syllable was found. Add a vowel, for example rāma.');
  }
  if (input.task === 'vedic' && !context.vedic) throw new Error(context.methods.diagnostics.find(d => d.block === 'vedic')?.message || 'The Vedic calculation is unavailable for these inputs.');
  return { input, context, result, followNote };
}
function paragraph(host, text) { if (text) host.append(node('p', text)); }
function pairs(host, rows) { const dl = node('dl'); rows.forEach(([a, b]) => dl.append(node('dt', a), node('dd', String(b)))); host.append(dl); }
function table(host, headings, rows) {
  const table = node('table'), head = node('thead'), tr = node('tr'), body = node('tbody');
  headings.forEach(h => { const th = node('th', h); th.scope = 'col'; tr.append(th); }); head.append(tr);
  rows.forEach(row => { const line = node('tr'); row.forEach(value => line.append(node('td', String(value)))); body.append(line); });
  table.append(head, body); host.append(table);
}
function trustedSVG(svg) {
  // Only the project's pure renderers produce this markup; their text is escaped.
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  if (doc.querySelector('parsererror')) throw new Error('The calculated SVG could not be read.');
  const root = document.importNode(doc.documentElement, true);
  root.querySelectorAll('[role="button"]').forEach(el => { el.removeAttribute('role'); el.removeAttribute('tabindex'); });
  $('studioFigure').replaceChildren(root);
}
function renderTrace() {
  if (!displayed?.result?.grid) return;
  const count = displayed.result.trace?.steps?.length || 0;
  if (traceStep !== null) traceStep = Math.min(count, Math.max(0, traceStep));
  trustedSVG(renderSymbolSVG(displayed.result, { size: 480, traceStep }).svg);
  $('studioTraceControls').hidden = count === 0;
  $('studioTraceStep').max = count; $('studioTraceStep').value = traceStep ?? count;
  $('studioTracePosition').textContent = `${traceStep ?? count} of ${count} path steps visible${(traceStep ?? count) === count ? ' · complete' : ''}`;
  $('studioTracePlay').disabled = reducedMotion.matches || count === 0;
}
function render(value) {
  stopTrace(); displayed = value; current = { ...value.input }; resultCurrent = true;
  ['studioSaveSnapshot', 'studioExportJSON', 'studioTraceReset', 'studioTraceStep'].forEach(id => $(id).disabled = false);
  const { input, context, result, followNote } = value;
  $('studioTime').value = input.dateISO.slice(0, 19); $('studioPlanet').value = input.planet;
  const figure = $('studioFigure'), facts = $('studioFacts'), methods = $('studioMethods');
  figure.replaceChildren(); facts.replaceChildren(); methods.replaceChildren(); $('studioTraceControls').hidden = true;
  $('studioResultContext').textContent = `${utc(input.dateISO)} · ${input.lat.toFixed(4)}° N, ${input.lon.toFixed(4)}° E`;
  $('studioTradition').textContent = ({ western: 'Western · tropical zodiac', vedic: 'Jyotiṣa · sidereal zodiac', kamea: 'Western planetary-square tradition', yantra: 'Navagraha · modern printed tradition', gematria: 'Hebrew letter arithmetic', katapayadi: 'Indian syllabic number system' })[input.task];
  let title, caption;
  if (input.task === 'western') {
    title = 'The Western figure'; caption = 'Tropical positions, house cusps and Ptolemaic aspects. Exact longitudes and house assignments are listed alongside.';
    const wheel = renderChart(figure, context.chart, allAspects(context.chart.planets), { size: 540 });
    // Labels extend beyond the ring's original canvas. Enlarge only the viewport;
    // no plotted coordinate, house cusp, aspect or calculation changes.
    wheel.setAttribute('viewBox', '-24 -24 588 588');
    pairs(facts, [['Ascendant', formatLon(context.chart.asc)], ['Midheaven', formatLon(context.chart.mc)], ['House convention', context.chart.system]]);
    table(facts, ['Point', 'Longitude', 'House'], Object.entries(context.chart.planets).map(([name, p]) => [name + (p.retrograde ? ' · retrograde' : ''), formatLon(p.lon), p.house]));
    paragraph(methods, `${context.methods.engine}. Tropical zodiac. House convention: ${context.methods.houseSystem}; requested ${context.methods.requestedHouseSystem}. Fortune uses Lilly’s both-sects formula; lunar nodes are mean.`);
    paragraph(methods, context.methods.houseWarning); paragraph(methods, context.methods.accuracy);
  } else if (input.task === 'vedic') {
    title = 'The Vedic figure'; caption = input.style === 'north' ? 'North Indian diagram: houses stay fixed; sign numbers change.' : 'South Indian diagram: signs stay fixed; small corner numbers identify houses counted from the marked lagna.';
    const rendered = (input.style === 'north' ? northIndianChart : southIndianChart)(vedicChartModel(context.vedic), { size: 480, title: 'D1 · Rāśi', houseNumbers: true });
    trustedSVG(rendered.svg);
    pairs(facts, [['Lagna', context.vedic.lagna.label], ['Ayanamsha', `${context.vedic.ayanamsa.toFixed(4)}°`]]);
    table(facts, ['Graha', 'Sidereal position', 'House'], Object.entries(context.vedic.grahas).map(([name, p]) => [name + (p.retrograde && !['Rahu', 'Ketu'].includes(name) ? ' · retrograde' : ''), p.label, p.house]));
    const houseKey = node('details'), houseSummary = node('summary', 'All 12 houses · diagram text alternative'), houseList = node('ol');
    rendered.textModel.forEach(line => houseList.append(node('li', line)));
    houseKey.append(houseSummary, node('p', 'This key follows the diagram’s rounded whole-degree labels. The planetary table above retains the calculated degrees and minutes.'), houseList);
    facts.append(houseKey);
    paragraph(methods, `${context.methods.vedic.ayanamsha}. Whole-sign houses; mean Rahu/Ketu. This is the project’s documented approximation, not an exact Swiss Ephemeris or Jagannatha Hora match.`);
    paragraph(methods, context.methods.accuracy);
  } else if (result?.grid) {
    title = result.title; caption = 'An arithmetic square and its calculated path. Open-circle start, end bar on the complete path; repeated cells have a repeat mark.';
    renderTrace();
    pairs(facts, [['Order', `${result.grid.length} × ${result.grid.length}`], ['Every row / column / main diagonal', result.validation.constant], ['Total', result.validation.total], ['Validation', 'Passed arithmetic checks'], ['Normalized letters', result.inputs.normalizedText || 'Square only']]);
    if (result.trace) table(facts, ['Letter', 'Value → cell', 'Row / column'], result.trace.letterTrace.map(step => [step.letter, `${step.value} → ${step.cellValue}`, `${step.row + 1} / ${step.col + 1}`]));
    else table(facts, ['Row', 'Values'], result.grid.map((row, index) => [index + 1, row.join(' · ')]));
    paragraph(methods, result.method.label); paragraph(methods, result.method.note); paragraph(methods, result.method.reduction);
    paragraph(methods, normalizationText(result.normalization)); paragraph(methods, followNote);
    paragraph(methods, result.caveat); result.sources.forEach(source => paragraph(methods, `Source: ${source}`));
  } else if (input.task === 'gematria') {
    title = 'Hebrew letter values'; caption = 'The total is a sum of the stated letter values. Equal sums do not establish a causal relationship.';
    figure.append(node('div', String(result.total), 'studio-number'));
    table(facts, ['Letter', 'Name', 'Value'], result.letters.map(letter => [letter.char, letter.name, letter.value]));
    paragraph(methods, GEMATRIA_METHODS[input.method].label); paragraph(methods, result.methodNote);
    paragraph(methods, normalizationText(result.normalization)); paragraph(methods, 'The fixed Hebrew letter table is documented on the dedicated Gematria & Kabbalah page. No letters are interpreted as predictions. Letter totals export as JSON; SVG/PNG actions apply to chart and square diagrams.');
  } else {
    title = 'Kaṭapayādi letter values'; caption = 'Syllable digits are read right to left. Leading zeroes remain visible; the result is stored as text without number rounding.';
    figure.append(node('div', result.value, 'studio-number'));
    table(facts, ['Syllable', 'Counted consonant', 'Digit'], result.trace.map(step => [step.syllable, step.counted, step.digit]));
    paragraph(methods, result.note); paragraph(methods, `Digits in word order: ${result.digits.join(' · ')}. Read right to left: ${result.reading.join(' · ')}.`);
    if (result.ignoredTrailingConsonants.length) paragraph(methods, `Uncounted trailing consonants: ${result.ignoredTrailingConsonants.join(', ')}.`);
    paragraph(methods, `Source: ${result.cite}`); paragraph(methods, 'The last consonant of a cluster counts when followed by a vowel; a standalone vowel counts as zero. Letter totals export as JSON; SVG/PNG actions apply to chart and square diagrams.');
  }
  if (context?.planetaryHour && !followNote) paragraph(methods, `Planetary hour ${context.planetaryHour.hourNumber}: ${context.planetaryHour.ruler}. ${context.planetaryHour.weekdayMethod}.`);
  if (context && !context.planetaryHour) paragraph(methods, 'A planetary hour is unavailable when a valid surrounding sunrise–sunset interval cannot be found.');
  paragraph(methods, 'Studio inputs use proleptic Gregorian UTC, 1900–2100, geographic degrees north/east. The snapshot context records this moment; letter values and square arithmetic do not depend on location or time unless planetary-hour following is selected.');
  const reference = node('a', 'Calculation methods and validation'); reference.href = 'https://github.com/occult-kranti/astrology-sim-ant/blob/main/docs/2026-10-calculation-methods.md'; methods.append(reference);
  $('studioResultTitle').textContent = title; $('studioFigureCaption').textContent = caption;
  $('studioExportSVG').disabled = $('studioExportPNG').disabled = !figure.querySelector('svg');
  document.querySelector('.studio-result').setAttribute('aria-busy', 'false');
  status(followNote || `Calculated locally · ${utc(input.dateISO)}.`); clockLabel();
}
function clockLabel() {
  const state = clock.state.status, live = state === 'running';
  $('studioClockStatus').dataset.mode = live ? 'live' : 'frozen'; $('studioClockStatus').dataset.status = state;
  $('studioClockStatus').textContent = `${live ? 'Live · refreshes each minute' : state === 'suspended' ? 'Suspended while page is hidden' : 'Frozen'}${displayed ? ` · ${utc(displayed.input.dateISO)}` : ''}`;
  $('studioStartLive').hidden = live || state === 'paused' || state === 'suspended';
  $('studioPause').hidden = !live; $('studioResume').hidden = !['paused', 'suspended', 'error'].includes(state);
}
const clock = createLiveClock({ intervalMs: 60000, onTick: date => calculate({ ...current, dateISO: date.toISOString() }),
  onResult: value => { traceStep = null; render(value); }, onState: clockLabel, onError: error => { draft(); status(`${error.message} Live updates stopped; the last valid result is still displayed.`, true); } });
function stopTrace() { if (traceTimer !== null) clearInterval(traceTimer); traceTimer = null; $('studioTracePlay').textContent = 'Play trace'; }
function freeze() { clock.pause(); stopTrace(); }
function apply({ persist = true } = {}) {
  freeze();
  try { const input = read(); traceStep = null; render(calculate(input)); if (persist) store(KEY, current); locationLabel(current); }
  catch (error) { draft(); status(`${error.message}${displayed ? ' The previous valid result remains displayed; save and export are disabled until a valid update.' : ''}`, true); document.querySelector('.studio-result').setAttribute('aria-busy', 'false'); }
}
function exportRecord() { return { schemaVersion: 1, product: 'Workbench Live Symbol Studio', inputs: displayed.input,
  methods: displayed.context?.methods || displayed.result?.method || { id: displayed.input.method, note: displayed.result?.methodNote || displayed.result?.note },
  frame: { visibleTraceSteps: traceStep ?? displayed.result?.trace?.steps?.length ?? 0, complete: traceStep === null || traceStep === displayed.result?.trace?.steps?.length },
  outputs: displayed.result || { chart: displayed.context.chart, vedic: displayed.context.vedic },
  planetaryHour: displayed.context?.planetaryHour || null, followNote: displayed.followNote,
  caveat: 'Calculated astronomy and arithmetic; traditional interpretation is not a demonstrated prediction or operative effect.' }; }
function renderSaved() {
  const list = $('studioSnapshots'); list.replaceChildren();
  if (!snapshots.length) { list.append(node('li', 'No saved studio snapshots yet.')); return; }
  snapshots.forEach(item => {
    const row = node('li'), restore = node('button', `${item.input.task} · ${utc(item.input.dateISO)}`, 'btn-secondary'), remove = node('button', 'Remove', 'btn-quiet');
    restore.type = remove.type = 'button'; restore.setAttribute('aria-label', `Restore ${item.input.task} snapshot ${utc(item.input.dateISO)}`); remove.setAttribute('aria-label', `Remove ${item.input.task} snapshot ${utc(item.input.dateISO)}`);
    restore.addEventListener('click', () => { freeze(); fill(item.input); traceStep = item.traceStep; try { render(calculate(item.input)); store(KEY, current); status('Saved snapshot restored.'); } catch (error) { draft(); status(error.message, true); } });
    remove.addEventListener('click', () => { snapshots = snapshots.filter(s => s.id !== item.id); store(SNAPSHOTS, snapshots); renderSaved(); $('studioSaveSnapshot').focus(); });
    row.append(restore, remove); list.append(row);
  });
}
$('studioForm').addEventListener('submit', event => { event.preventDefault(); apply(); });
$('studioTask').addEventListener('change', () => { freeze(); draft(); current.planet = $('studioPlanet').value || current.planet; current.method = $('studioSymbolMethod').value; fields(); status('Task changed. Set its method and choose Update view; the last calculated result remains below.'); });
$('studioSymbolMethod').addEventListener('change', () => { current.planet = $('studioPlanet').value || current.planet; current.method = $('studioSymbolMethod').value; fields(); draft(); });
$('studioForm').addEventListener('input', event => {
  if (event.target === $('studioTask')) return;
  draft();
  if (['running', 'suspended'].includes(clock.state.status)) freeze();
  if (['studioLat', 'studioLon'].includes(event.target.id)) { current.locationSource = 'manual'; pendingLocation++; $('studioUseLocation').disabled = false; $('studioLocationStatus').textContent = 'Entered coordinates. Choose Update view to calculate at this observer.'; }
  status('Inputs changed. Choose Update view to calculate; the displayed result retains its stated moment and method.');
});
$('studioStartLive').addEventListener('click', () => { try { current = read(); stopTrace(); clock.start(); } catch (error) { draft(); status(error.message, true); } });
$('studioResume').addEventListener('click', () => { try { current = read(); stopTrace(); clock.resume(); } catch (error) { draft(); status(error.message, true); } });
$('studioPause').addEventListener('click', freeze);
$('studioTraceStep').addEventListener('input', () => { freeze(); traceStep = Number($('studioTraceStep').value); renderTrace(); });
$('studioTraceReset').addEventListener('click', () => { freeze(); traceStep = null; renderTrace(); });
$('studioTracePlay').addEventListener('click', () => {
  if (traceTimer !== null) { stopTrace(); return; }
  freeze(); if (reducedMotion.matches || !displayed?.result?.trace) return;
  traceStep = 0; renderTrace(); $('studioTracePlay').textContent = 'Pause trace';
  traceTimer = setInterval(() => { traceStep++; renderTrace(); if (traceStep >= displayed.result.trace.steps.length) stopTrace(); }, 600);
});
reducedMotion.addEventListener('change', () => { stopTrace(); renderTrace(); if (!resultCurrent) draft(); });
$('studioUseLocation').addEventListener('click', () => {
  if (!navigator.geolocation) { $('studioLocationStatus').textContent = 'Location is unavailable. Enter latitude and longitude manually.'; return; }
  const request = ++pendingLocation; $('studioUseLocation').disabled = true; $('studioLocationStatus').textContent = 'Requesting device location…';
  navigator.geolocation.getCurrentPosition(position => {
    if (request !== pendingLocation) return; $('studioUseLocation').disabled = false;
    $('studioLat').value = position.coords.latitude; $('studioLon').value = position.coords.longitude; current.locationSource = 'device';
    $('studioLocationStatus').textContent = `Device location ready · reported accuracy ±${Math.round(position.coords.accuracy)} m. Choose Update view.`; freeze(); draft(); status('Location changed. Choose Update view to calculate at these coordinates.');
  }, () => { if (request !== pendingLocation) return; $('studioUseLocation').disabled = false; $('studioLocationStatus').textContent = 'Location was denied or unavailable. Existing coordinates are unchanged; enter them manually.'; }, { timeout: 10000, maximumAge: 60000 });
});
$('studioSaveSnapshot').addEventListener('click', () => {
  if (!displayed || !resultCurrent) return; freeze();
  snapshots.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, input: { ...displayed.input }, traceStep }); snapshots = snapshots.slice(0, 12);
  const saved = store(SNAPSHOTS, snapshots); store(KEY, displayed.input); renderSaved(); status(saved ? 'Displayed snapshot saved on this device. Live updates are paused.' : 'Snapshot is available this session; storage failed. Export JSON to keep it.', !saved);
});
for (const [id, type] of [['studioExportSVG', 'svg'], ['studioExportPNG', 'png'], ['studioExportJSON', 'json']]) {
  $(id).addEventListener('click', async () => {
    if (!displayed || !resultCurrent) return; freeze(); $(id).disabled = true;
    try {
      const filename = `studio-${displayed.input.task}-${displayed.input.dateISO.replace(/[:.]/g, '-')}.${type}`;
      if (type === 'json') downloadJSON(exportRecord(), filename);
      else {
        const svg = $('studioFigure').querySelector('svg');
        if (!svg) throw new Error('This result has no SVG diagram. Use JSON for letter values.');
        let metadata = svg.querySelector('metadata[data-studio]');
        if (!metadata) { metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata'); metadata.dataset.studio = 'snapshot'; svg.prepend(metadata); }
        metadata.textContent = JSON.stringify(exportRecord());
        if (type === 'svg') downloadSVG(svg, filename); else await svgToPNG(svg, filename, 2);
      }
      status('Displayed snapshot exported. Live updates are paused.');
    } catch (error) { status(`Export failed: ${error.message}`, true); }
    finally { $(id).disabled = !resultCurrent || (type !== 'json' && !$('studioFigure').querySelector('svg')); }
  });
}
$('studioMcpCopy')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('studioMcpCommand').textContent); $('studioMcpStatus').textContent = 'Setup command copied. Run it in your local MCP client after installing the server dependencies.'; }
  catch { $('studioMcpStatus').textContent = 'Clipboard access is unavailable. Select and copy the command shown below.'; }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.suspend(); stopTrace(); pendingLocation++;
    if ($('studioUseLocation').disabled) $('studioLocationStatus').textContent = 'Location request cancelled while this page was hidden. Request again or enter coordinates.';
    $('studioUseLocation').disabled = false;
  } else if (clock.state.status === 'suspended') clock.resume();
});
window.addEventListener('pagehide', () => { clock.stop(); stopTrace(); pendingLocation++; });
fill(current); renderSaved();
try { render(calculate(current)); } catch (error) { draft(); status(error.message, true); document.querySelector('.studio-result').setAttribute('aria-busy', 'false'); }
