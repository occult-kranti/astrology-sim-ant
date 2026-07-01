// ============================================================================
//  iching.js — drives pages/iching.html. Cast the coins (or set the lines by
//  hand), and the engine (core/iching.js) reads the primary hexagram, the moving
//  lines, the nuclear (inner) hexagram, and the relating hexagram — the tendency
//  of the change. The diviner AI panel narrates the cast.
//
//  The RANDOMNESS (the coin throws) lives HERE (the app); the engine is pure.
//  Three coins per line: tails=2, heads=3, summed → 6/7/8/9 (the classical odds).
//
//  HONEST FRAMING: a historical divinatory art of no demonstrated validity,
//  computed for study — a mirror for reflection, never a prediction.
// ============================================================================
import { castReading, linesFromThrows, HEXAGRAMS, TRIGRAMS } from '../core/iching.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let reading = null, question = '';
let divAssistant = null;
const subscribers = [];

// --- coin cast (the randomness lives here) ----------------------------------
function rand(n) {
  try { const a = new Uint32Array(1); (self.crypto || window.crypto).getRandomValues(a); return a[0] % n; }
  catch { return Math.floor(Math.random() * n); }
}
const coin = () => (rand(2) === 0 ? 2 : 3);          // tails=2, heads=3
const castThrows = () => Array.from({ length: 6 }, () => coin() + coin() + coin()); // each 6..9

// --- rendering --------------------------------------------------------------
// A figure (hexagram of 6 lines, or trigram of 3) drawn TOP line to BOTTOM.
// Yang = one solid bar; yin = two bars with a gap. A changing line is marked.
// Accepts a hexagram/trigram object (with .lines) or a raw lines array.
function hexFigure(hexOrLines, changing) {
  const lines = Array.isArray(hexOrLines) ? hexOrLines : hexOrLines.lines;
  const rows = lines.map((_, i) => i).reverse().map(i => {
    const yang = lines[i] === 1;
    const ch = changing && changing[i];
    const bar = yang ? '<span class="hx-bar"></span>' : '<span class="hx-bar hx-half"></span><span class="hx-gap"></span><span class="hx-bar hx-half"></span>';
    return `<div class="hx-line${ch ? ' hx-changing' : ''}">${bar}${ch ? `<span class="hx-mark" aria-hidden="true">${yang ? '○' : '×'}</span>` : ''}</div>`;
  }).join('');
  return `<div class="hx-figure" aria-hidden="true">${rows}</div>`;
}
function explainChip(text) { return `<button type="button" class="btn sm ich-explain" data-q="${esc(text)}">✶ explain</button>`; }

export function initIching() {
  renderReference();
  buildManualPad();
  $('ich-form').addEventListener('submit', e => { e.preventDefault(); castCoins(); });
  $('ich-manual-read').addEventListener('click', () => castManual());
  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.ich-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });
  divAssistant = initDivinationAssistant({
    kind: 'iching',
    getReading: () => currentReading(),
    subscribeReading: cb => subscribers.push(cb),
  });
  castCoins(); // a first cast on load (pure compute, no network)
}

function currentReading() { return reading ? { kind: 'iching', question, reading } : null; }
function notify() { const r = currentReading(); subscribers.forEach(cb => { try { cb(r); } catch { /* non-fatal */ } }); }

function castCoins() {
  const { lines, changing } = linesFromThrows(castThrows());
  compute(lines, changing);
}
function castManual() {
  try {
    const throws = readManualThrows();
    const { lines, changing } = linesFromThrows(throws);
    compute(lines, changing);
    $('ich-out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { $('ich-manual-status').textContent = 'Could not read the cast: ' + e.message; }
}
function compute(lines, changing) {
  question = $('ich-question').value.trim();
  try { reading = castReading(lines, changing); } catch (e) { $('ich-out').innerHTML = `<p class="muted">Could not cast (${esc(e.message)}).</p>`; return; }
  render();
  notify();
}

function render() {
  const r = reading;
  // the figures — primary, and relating if there are moving lines
  $('ich-figure').innerHTML = `
    <div class="hx-pair">
      <div class="hx-col">
        <div class="small muted">Primary</div>
        ${hexFigure(r.primary, r.changing)}
        <div class="hx-name"><b>${r.primary.num}. ${esc(r.primary.name)}</b><br><span class="muted small">${esc(r.primary.pinyin)} · ${esc(r.trigrams.upper.name)} over ${esc(r.trigrams.lower.name)}</span></div>
        ${explainChip('Explain the primary hexagram ' + r.primary.num + '. ' + r.primary.name + ' (' + r.trigrams.upper.name + ' over ' + r.trigrams.lower.name + ') in this cast — its Judgment and Image and what situation the tradition reads in it. Describe as history, never predict.')}
      </div>
      ${r.relating ? `<div class="hx-arrow" aria-hidden="true">→</div>
      <div class="hx-col">
        <div class="small muted">Relating (where it tends)</div>
        ${hexFigure(r.relating, null)}
        <div class="hx-name"><b>${r.relating.num}. ${esc(r.relating.name)}</b><br><span class="muted small">${esc(r.relating.pinyin)}</span></div>
        ${explainChip('Explain the relating hexagram ' + r.relating.num + '. ' + r.relating.name + ' as the direction this cast tends toward. Describe as history, never predict.')}
      </div>` : ''}
    </div>`;

  $('ich-out').innerHTML = `
    <p style="font-size:1.05rem">${r.primary.num}. ${esc(r.primary.name)} <span class="muted">(${esc(r.primary.pinyin)})</span></p>
    <p class="small"><b>Judgment.</b> ${esc(r.primary.judgment)}</p>
    <p class="small"><b>Image.</b> ${esc(r.primary.image)}</p>
    ${r.moving.length ? `<p class="small" style="margin-top:.5rem"><b>Moving lines</b> (the pivots of the reading):</p>
      <ul class="clean small">${r.moving.map(m => `<li><b>${m.position} line</b> (${m.yang ? 'old yang 9' : 'old yin 6'}): ${esc(m.text)}</li>`).join('')}</ul>` : '<p class="small muted">No moving lines — the situation is stable; the Judgment and Image stand as the whole answer.</p>'}
    <p class="small"><b>Nuclear hexagram</b> (the hidden core): ${r.nuclear.num}. ${esc(r.nuclear.name)}.</p>
    ${r.relating ? `<p class="small"><b>Relating hexagram</b> (the tendency of the change): ${r.relating.num}. ${esc(r.relating.name)} — ${esc(r.relating.judgment)}</p>` : ''}
    <p class="small"><b>Reading.</b> ${esc(r.guidance)}</p>
    <p class="small muted"><b>How the I Ching answers:</b> ${esc(r.note)} <span class="muted">— ${esc(r.cite)}</span></p>`;

  try { autolinkResultPanels(['ich-out']); } catch { /* non-fatal */ }
}

function renderReference() {
  $('ich-trigrams').innerHTML = TRIGRAMS.map(t => `<div class="ich-ref-card">
    ${hexFigure(t.lines, null)}
    <div><b>${esc(t.name)}</b> <span class="muted small">${esc(t.chinese)} · ${esc(t.key)}</span>
      <div class="small muted">${esc(t.attribute)} · ${esc(t.element)} · ${esc(t.family)}</div></div></div>`).join('');
  $('ich-hexes').innerHTML = HEXAGRAMS.map(h => `<div class="ich-hex-card">
    ${hexFigure(h, null)}
    <div class="small"><b>${h.num}. ${esc(h.name)}</b> <span class="muted">${esc(h.pinyin)}</span>
      <div class="muted">${esc(h.keywords.slice(0, 4).join(', '))}</div></div></div>`).join('');
}

// --- manual mode: set each of the 6 lines (young/old × yin/yang) -------------
const STATES = [{ v: 8, label: 'yin', cls: 'yin' }, { v: 7, label: 'yang', cls: 'yang' }, { v: 6, label: 'old yin ×', cls: 'yin old' }, { v: 9, label: 'old yang ○', cls: 'yang old' }];
function buildManualPad() {
  const pad = $('ich-manual-pad');
  // lines shown top (6) to bottom (1); default all young yang (7)
  pad.innerHTML = [6, 5, 4, 3, 2, 1].map(n => `<div class="ich-mline-row">
    <span class="small muted">Line ${n}</span>
    <button type="button" class="ich-mline" data-line="${n}" data-si="1">yang</button>
  </div>`).join('');
  pad.querySelectorAll('.ich-mline').forEach(b => b.addEventListener('click', () => {
    let si = (parseInt(b.getAttribute('data-si'), 10) + 1) % STATES.length;
    b.setAttribute('data-si', si); b.textContent = STATES[si].label;
    b.className = 'ich-mline ' + STATES[si].cls;
  }));
}
function readManualThrows() {
  const throws = [0, 0, 0, 0, 0, 0];
  $('ich-manual-pad').querySelectorAll('.ich-mline').forEach(b => {
    const line = parseInt(b.getAttribute('data-line'), 10); // 1..6
    throws[line - 1] = STATES[parseInt(b.getAttribute('data-si'), 10)].v;
  });
  return throws;
}
