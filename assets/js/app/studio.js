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
import { parseSkyHandoff, buildSkyHandoff } from '../core/sky-handoff.js';
import { createStudySession, readStudyJournal, appendStudySession, deleteStudySession, buildWorkbenchStudyURL, measurementDifference } from '../core/study-session.js';
import { STUDY_LENSES, getStudyLens } from '../core/data/study-lenses.js';

const $ = id => document.getElementById(id);
const TASKS = ['western', 'vedic', 'kamea', 'yantra', 'gematria', 'katapayadi'];
const PLANETS = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const NAVAGRAHA = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const KEY = 'wb-studio-v1', SNAPSHOTS = 'wb-studio-snapshots-v1';
const utc = value => new Date(value).toISOString().replace('T', ' ').replace('.000Z', ' UTC');
const defaults = () => ({ task: 'western', dateISO: new Date().toISOString(), lat: 51.5074, lon: -.1278,
  system: 'regiomontanus', style: 'north', planet: 'Saturn', method: 'latin', text: '', followHour: false, locationSource: 'demo' });
let displayed = null, traceStep = null, traceTimer = null, current = defaults(), snapshots = [], pendingLocation = 0, resultCurrent = false;
let observation = null, handoffError = '', studyAssistant = null, assistantLoad = null, comparison = null, journal = [];
let journalStorage = null;
try { journalStorage = localStorage; } catch { /* explicit journal actions report unavailable storage */ }
const draftSessionId = crypto.randomUUID(), draftCreatedAt = new Date().toISOString();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const node = (tag, text, cls) => { const el = document.createElement(tag); if (text != null) el.textContent = text; if (cls) el.className = cls; return el; };
function status(message, error = false) { $('studioStatus').textContent = message; $('studioStatus').dataset.error = String(error); }
function draft() {
  resultCurrent = false;
  ['studioSaveSnapshot', 'studioExportSVG', 'studioExportPNG', 'studioExportJSON', 'studioTracePlay', 'studioTraceReset', 'studioTraceStep'].forEach(id => $(id).disabled = true);
  invalidateStudy('Calculation inputs changed. Prepare a new preview after updating the figure.');
  $('sessionSave').disabled = $('sessionExport').disabled = true;
  $('sessionSkyLink').setAttribute('aria-disabled', 'true'); $('sessionWorkbenchLink').setAttribute('aria-disabled', 'true');
  if ($('sessionCompare').open) $('sessionCompareContext').textContent = 'Inputs changed. The comparison below belongs to the previous labeled snapshot; update the figure to compare the new inputs.';
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
    followHour: input.followHour === true, locationSource: ['demo', 'device', 'manual', 'saved', 'skylens'].includes(input.locationSource) ? input.locationSource : 'saved' };
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
try {
  observation = parseSkyHandoff(location.hash);
  if (observation) current = { ...defaults(), task: 'western', dateISO: observation.dateISO, lat: observation.lat, lon: observation.lon,
    locationSource: observation.locationSource === 'demo' ? 'demo' : 'skylens' };
} catch (error) { handoffError = `${error.message} The saved Studio inputs are unchanged.`; }

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
function locationLabel(input) { $('studioLocationStatus').textContent = input.locationSource === 'demo' ? `Demo coordinates: ${input.lat.toFixed(4)}° north, ${input.lon.toFixed(4)}° east. Choose an actual observer before treating this as your local sky.` : `${input.locationSource === 'device' ? 'Device' : input.locationSource === 'skylens' ? 'SkyLens captured' : 'Entered / saved'} coordinates: ${input.lat.toFixed(4)}° north, ${input.lon.toFixed(4)}° east.`; }
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
  invalidateStudy('The displayed calculation changed. Prepare a new preview for this snapshot.'); comparison = null;
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
  status(followNote || `Calculated locally · ${utc(input.dateISO)}.`); clockLabel(); renderSessionContext();
  if ($('sessionCompare').open) renderComparison();
}
function clockLabel() {
  const state = clock.state.status, live = state === 'running';
  $('studioClockStatus').dataset.mode = live ? 'live' : 'frozen'; $('studioClockStatus').dataset.status = state;
  $('studioClockStatus').textContent = `${live ? 'Live · refreshes each minute' : state === 'suspended' ? 'Suspended while page is hidden' : 'Frozen'}${displayed ? ` · ${utc(displayed.input.dateISO)}` : ''}`;
  $('studioStartLive').hidden = live || state === 'paused' || state === 'suspended';
  $('studioPause').hidden = !live; $('studioResume').hidden = !['paused', 'suspended', 'error'].includes(state);
  const question = $('sessionPurpose').value === 'question';
  $('studioStartLive').disabled = $('studioResume').disabled = question;
  if (question) $('studioClockStatus').textContent = `Frozen question epoch${displayed ? ` · ${utc(displayed.input.dateISO)}` : ''}`;
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
$('studioStartLive').addEventListener('click', () => { if ($('sessionPurpose').value === 'question') return; try { current = read(); stopTrace(); clock.start(); } catch (error) { draft(); status(error.message, true); } });
$('studioResume').addEventListener('click', () => { if ($('sessionPurpose').value === 'question') return; try { current = read(); stopTrace(); clock.resume(); } catch (error) { draft(); status(error.message, true); } });
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

// The session layer composes the existing calculators; it never owns another clock.
function invalidateStudy(reason) { studyAssistant?.invalidate(reason); }
function sessionStatus(message, error = false) { $('sessionJournalStatus').textContent = message; $('sessionJournalStatus').dataset.error = String(error); }
function sessionRecord({ newIdentity = false, requireQuestion = true } = {}) {
  if (!displayed || !resultCurrent) throw new Error('Update the calculation before using this session snapshot.');
  if (requireQuestion && $('sessionPurpose').value === 'question' && !$('sessionQuestion').value.trim()) throw new Error('Record the question before saving or explaining a question chart.');
  return createStudySession({ id: newIdentity ? crypto.randomUUID() : draftSessionId, createdAt: newIdentity ? new Date().toISOString() : draftCreatedAt,
    input: displayed.input, traceStep, lens: $('sessionLens').value, purpose: $('sessionPurpose').value, title: $('sessionTitle').value.trim() || 'Untitled study',
    question: $('sessionQuestion').value, observationNotes: $('sessionObservationNotes').value, hypothesis: $('sessionHypothesis').value, reflection: $('sessionReflection').value,
    measurement: { expected: $('sessionExpected').value, observed: $('sessionObserved').value, uncertainty: $('sessionUncertainty').value,
      unit: $('sessionUnit').value, method: $('sessionMeasurementMethod').value }, observation });
}
function sessionContext() {
  if (!displayed || !resultCurrent) throw new Error('Update the displayed figure first.');
  if (!comparison) comparison = calculateContext({ ...displayed.input, includeVedic: true, includeReading: false });
  return comparison;
}
function skyRecord() {
  const input = displayed.input;
  const original = observation && input.dateISO === observation.dateISO && input.lat === observation.lat && input.lon === observation.lon;
  return { dateISO: new Date(Math.floor(new Date(input.dateISO).getTime() / 1000) * 1000).toISOString(), lat: input.lat, lon: input.lon,
    mode: original ? observation.mode : 'simulated', locationSource: input.locationSource === 'demo' ? 'demo' : 'selected',
    object: observation?.object || null, names: observation?.names || 'bilingual' };
}
function renderSessionContext() {
  if (!displayed) return;
  const input = displayed.input, banner = $('sessionObservation');
  banner.dataset.error = String(!!handoffError);
  if (handoffError) banner.textContent = handoffError;
  else if (observation) {
    const same = new Date(input.dateISO).getTime() === new Date(observation.dateISO).getTime() && input.lat === observation.lat && input.lon === observation.lon;
    banner.textContent = `Captured in SkyLens: ${utc(observation.dateISO)} · ${observation.lat.toFixed(4)}° N, ${observation.lon.toFixed(4)}° E · ${observation.mode === 'simulated' ? 'simulated sky' : 'then-current sky'} · ${observation.locationSource === 'demo' ? 'demo location' : 'selected location'}.${observation.object ? ` Selected: ${observation.object.name} (${observation.object.kind}); a contextual observation, not an automatic planetary correspondence.` : ''} ${same ? 'The displayed calculation uses this captured moment.' : 'The displayed calculation has changed; the original observation remains attached as provenance.'}`;
  } else banner.textContent = 'No SkyLens observation attached. Use this Studio moment, or open the live sky and choose “Cast this sky moment”.';
  $('sessionSave').disabled = $('sessionExport').disabled = !resultCurrent;
  for (const id of ['sessionSkyLink', 'sessionWorkbenchLink']) $(id).setAttribute('aria-disabled', String(!resultCurrent));
  if (resultCurrent) {
    $('sessionSkyLink').href = buildSkyHandoff(skyRecord(), 'skylens');
    try { $('sessionWorkbenchLink').href = buildWorkbenchStudyURL(sessionRecord({ requireQuestion: false })); }
    catch { $('sessionWorkbenchLink').setAttribute('aria-disabled', 'true'); }
  }
}
function receiveSkyFragment() {
  let incoming;
  try { incoming = parseSkyHandoff(location.hash); }
  catch (error) {
    freeze(); invalidateStudy('An invalid sky handoff was received.');
    handoffError = `${error.message} The last valid calculation and current notes are unchanged.`;
    renderSessionContext(); return;
  }
  // Ordinary stage anchors are not incoming sky records.
  if (!incoming) return;
  freeze(); invalidateStudy('A new frozen sky moment was imported. Prepare a new preview.');
  observation = incoming; handoffError = '';
  $('sessionPurpose').value = 'moment'; $('sessionQuestionField').hidden = true;
  fill({ ...defaults(), task: 'western', dateISO: incoming.dateISO, lat: incoming.lat, lon: incoming.lon,
    locationSource: incoming.locationSource === 'demo' ? 'demo' : 'skylens' });
  traceStep = null;
  try {
    render(calculate(current));
    sessionStatus('SkyLens moment imported frozen. The chart purpose is now moment study; existing note and question drafts remain available. Nothing was saved automatically.');
  } catch (error) { draft(); status(error.message, true); renderSessionContext(); }
}
function renderLens() {
  const lens = getStudyLens($('sessionLens').value), host = $('sessionLensContent'); host.replaceChildren();
  if (!lens) return;
  $('sessionLensSummary').textContent = `${lens.shortTitle} · method, prompts and sources`;
  paragraph(host, lens.summary);
  const prompts = node('ul'); lens.prompts.forEach(prompt => prompts.append(node('li', prompt))); host.append(prompts);
  const sourceList = node('ul');
  lens.sources.forEach(source => {
    const row = node('li'), link = node('a', `${source.title}${source.section ? ` · ${source.section}` : ''}`); link.href = source.url;
    row.append(link); paragraph(row, `${source.edition} · ${source.claimStatus}. ${source.note}`); sourceList.append(row);
  });
  host.append(node('h3', 'Inspect the sources'), sourceList);
  const links = node('nav', null, 'studio-related'); links.setAttribute('aria-label', `${lens.shortTitle} dedicated tools`);
  lens.tools.forEach(tool => { const link = node('a', tool.label); link.href = tool.path; links.append(link); }); host.append(links);
}
function renderComparison() {
  const host = $('sessionCompareTable');
  if (!resultCurrent) { $('sessionCompareContext').textContent = 'Update the figure before comparing these inputs.'; return; }
  try {
    const context = sessionContext(); host.replaceChildren();
    $('sessionCompareContext').textContent = `${utc(context.inputs.dateISO)} · ${context.inputs.lat.toFixed(4)}° N, ${context.inputs.lon.toFixed(4)}° E. Western ${context.methods.houseSystem} houses; sidereal whole-sign houses.`;
    if (!context.vedic) throw new Error('The Vedic comparison is unavailable for this moment.');
    table(host, ['Planet', 'Tropical · Western house', 'Sidereal · whole-sign house'], Object.entries(context.chart.planets)
      .filter(([name]) => PLANETS.includes(name)).map(([name, point]) => [name, `${formatLon(point.lon)} · house ${point.house}`, `${context.vedic.grahas[name].label} · house ${context.vedic.grahas[name].house}`]));
    paragraph(host, `Ascendant: tropical ${formatLon(context.chart.asc)}; sidereal ${context.vedic.lagna.label}. Ayanamsha ${context.vedic.ayanamsa.toFixed(4)}° — documented linear Lahiri estimate.`);
    paragraph(host, context.methods.houseWarning);
  } catch (error) { host.replaceChildren(node('p', error.message)); }
}
function exportSession(record) {
  const lens = getStudyLens(record.lens);
  const context = calculateContext({ ...record.input, includeVedic: true, includeReading: false });
  return { ...record, provenance: { ...(record.provenance || {}), methods: context.methods,
    sources: lens.sources.map(source => ({ ...source })), sourceIds: lens.sources.map(source => source.id),
    observationRole: 'Captured sky metadata is contextual evidence; no camera frame, sensor permission or visual recognition is included.' } };
}
function renderMeasurement() {
  const result = measurementDifference({ expected: $('sessionExpected').value, observed: $('sessionObserved').value, unit: $('sessionUnit').value });
  $('sessionMeasurementResult').textContent = result.status === 'numeric' ? `Difference: ${result.delta}${result.unit ? ` ${result.unit}` : ''} · ${result.convention}.` : result.status === 'descriptive' ? 'Descriptive values recorded. No numerical difference is calculated.' : 'Enter numeric expected and observed values to calculate their difference.';
}
function renderJournal() {
  const host = $('sessionJournal'); host.replaceChildren();
  if (!journal.length) { host.append(node('li', 'No saved sessions yet. Record an observation and save a snapshot to begin.')); return; }
  journal.forEach(record => {
    const row = node('li'), title = node('h4', record.title), summary = node('p', `${utc(record.input.dateISO)} · ${getStudyLens(record.lens)?.shortTitle || record.lens} · ${record.purpose}`), actions = node('div', null, 'studio-actions');
    row.dataset.sessionId = record.id;
    for (const [label, action] of [
      ['Restore', () => restoreSession(record)],
      ['Export JSON', () => { try { downloadJSON(exportSession(record), `study-${record.id}.json`); sessionStatus('Saved session exported with its methods and sources.'); } catch (error) { sessionStatus(error.message, true); } }],
      ['Delete', () => { try { journal = deleteStudySession(journalStorage, record.id).records; renderJournal(); $('sessionSave').focus(); sessionStatus('Deleted this saved session. Other records are unchanged.'); } catch { sessionStatus('Could not change browser storage. The saved session remains available.', true); } }],
    ]) { const control = node('button', label, 'btn-secondary'); control.type = 'button'; control.setAttribute('aria-label', `${label} session ${record.title}`); control.addEventListener('click', action); actions.append(control); }
    row.append(title, summary, actions); host.append(row);
  });
}
function restoreSession(record) {
  freeze(); invalidateStudy('A saved session was restored. Prepare a new preview.');
  observation = record.observation; handoffError = '';
  $('sessionTitle').value = record.title; $('sessionPurpose').value = record.purpose; $('sessionLens').value = record.lens;
  $('sessionQuestion').value = record.question; $('sessionObservationNotes').value = record.observationNotes;
  $('sessionHypothesis').value = record.hypothesis; $('sessionReflection').value = record.reflection;
  for (const [id, key] of [['sessionExpected','expected'],['sessionObserved','observed'],['sessionUncertainty','uncertainty'],['sessionUnit','unit'],['sessionMeasurementMethod','method']]) $(id).value = record.measurement[key];
  $('sessionQuestionField').hidden = record.purpose !== 'question'; renderLens();
  renderMeasurement();
  fill(validate(record.input)); traceStep = record.traceStep ?? null;
  try { render(calculate(current)); sessionStatus('Session restored as a frozen snapshot. Save again to create a separate record.'); $('studioContextTitle').scrollIntoView({ block: 'start' }); }
  catch (error) { draft(); sessionStatus(error.message, true); }
}
for (const id of ['sessionTitle','sessionQuestion','sessionObservationNotes','sessionHypothesis','sessionReflection','sessionExpected','sessionObserved','sessionUncertainty','sessionUnit','sessionMeasurementMethod']) {
  $(id).addEventListener('input', () => { invalidateStudy('Session notes changed. Prepare a new preview before sending.'); if (id === 'sessionQuestion') renderSessionContext(); if (['sessionExpected','sessionObserved','sessionUnit'].includes(id)) renderMeasurement(); });
}
$('sessionPurpose').addEventListener('change', () => {
  freeze(); $('sessionQuestionField').hidden = $('sessionPurpose').value !== 'question';
  invalidateStudy('The purpose changed. Prepare a new preview.'); clockLabel(); renderSessionContext();
  sessionStatus($('sessionPurpose').value === 'question' ? 'Question epoch frozen. Record the question and set its received time explicitly.' : 'Moment study selected. Live time can be started explicitly.');
});
$('sessionLens').addEventListener('change', () => { invalidateStudy('The source lens changed. Prepare a new preview.'); renderLens(); renderSessionContext(); });
$('sessionCompare').addEventListener('toggle', () => { invalidateStudy('Comparison scope changed. Prepare a new preview.'); if ($('sessionCompare').open) renderComparison(); });
$('sessionCompareLink').addEventListener('click', () => { $('sessionCompare').open = true; });
$('sessionSymbol').addEventListener('click', () => {
  if (!resultCurrent) { status('Update the calculation before starting symbolic construction.', true); $('studioApply').focus(); return; }
  freeze();
  if (!['kamea','yantra','gematria','katapayadi'].includes(current.task)) { fill({ ...current, task: 'kamea', planet: PLANETS.includes(current.planet) ? current.planet : 'Saturn', method: 'latin', text: '' }); apply(); }
  $('studioTask').focus(); $('studioTask').scrollIntoView({ block: 'center' });
});
for (const id of ['sessionSkyLink','sessionWorkbenchLink']) $(id).addEventListener('click', event => {
  if (!resultCurrent || $(id).getAttribute('aria-disabled') === 'true') { event.preventDefault(); status('Update the calculation before transferring this moment.', true); return; }
  freeze(); renderSessionContext();
});
$('sessionSave').addEventListener('click', () => {
  freeze();
  try { const record = sessionRecord({ newIdentity: true }); journal = appendStudySession(journalStorage, record).records; renderJournal(); sessionStatus('Journal snapshot saved with its moment, source lens and notes. Earlier snapshots are unchanged.'); }
  catch (error) { sessionStatus(`Could not save: ${error.message} Your current notes remain on this page; export JSON to keep them.`, true); }
});
$('sessionExport').addEventListener('click', () => { freeze(); try { const record = sessionRecord(); downloadJSON(exportSession(record), `study-${record.id}.json`); sessionStatus('Session exported with exact inputs, methods and source references.'); } catch (error) { sessionStatus(error.message, true); } });
$('sessionOpenAI').addEventListener('click', async () => {
  freeze();
  try {
    sessionRecord(); $('sessionOpenAI').disabled = true;
    if (!assistantLoad) assistantLoad = import('./session-study.js').catch(error => { assistantLoad = null; throw error; });
    const module = await assistantLoad;
    if (!studyAssistant) studyAssistant = module.mountSessionStudy($('sessionStudyHost'), { getSession: () => ({ session: sessionRecord(), context: { ...sessionContext(), studyComparison: $('sessionCompare').open } }) });
    $('sessionOpenAI').textContent = 'Study assistant opened';
    $('sessionStudyHost').querySelector('textarea,input,select,button')?.focus();
  } catch (error) { sessionStatus(`Could not open study assistant: ${error.message}`, true); }
  finally { $('sessionOpenAI').disabled = false; }
});
options($('sessionLens'), STUDY_LENSES.map(lens => ({ id: lens.id, label: lens.shortTitle })), 'lilly');
const savedJournal = readStudyJournal(journalStorage); journal = savedJournal.records;
if (savedJournal.error) sessionStatus(savedJournal.error, true);
renderJournal(); renderLens();
window.addEventListener('hashchange', receiveSkyFragment);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.suspend(); stopTrace(); pendingLocation++;
    if ($('studioUseLocation').disabled) $('studioLocationStatus').textContent = 'Location request cancelled while this page was hidden. Request again or enter coordinates.';
    $('studioUseLocation').disabled = false;
  } else if (clock.state.status === 'suspended') clock.resume();
});
window.addEventListener('pagehide', () => { clock.stop(); stopTrace(); pendingLocation++; studyAssistant?.destroy(); studyAssistant = null; });
fill(current); renderSaved();
try { render(calculate(current)); } catch (error) { draft(); status(error.message, true); document.querySelector('.studio-result').setAttribute('aria-busy', 'false'); }
