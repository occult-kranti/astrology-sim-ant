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
import { renderCastHour } from './cast-hour.js';
import { copyShareLink, readStateFromURL, downloadText } from './state.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let reading = null, question = '';
let lastThrows = null;                 // the six line-throws of the current cast (for share/export)
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
// `stageStart` (null on the reference grids) turns on the casting-stage reveal:
// each line carries `stage-figure` + a `--stage-i` keyed to its height from the
// bottom, so the six lines BUILD BOTTOM-UP in the DS2 stage.
function hexFigure(hexOrLines, changing, stageStart = null) {
  const lines = Array.isArray(hexOrLines) ? hexOrLines : hexOrLines.lines;
  const rows = lines.map((_, i) => i).reverse().map(i => {
    const yang = lines[i] === 1;
    const ch = changing && changing[i];
    const bar = yang ? '<span class="hx-bar"></span>' : '<span class="hx-bar hx-half"></span><span class="hx-gap"></span><span class="hx-bar hx-half"></span>';
    const stageCls = stageStart == null ? '' : ' stage-figure';
    const stageAttr = stageStart == null ? '' : ` style="--stage-i:${stageStart + i}"`;
    return `<div class="hx-line${ch ? ' hx-changing' : ''}${stageCls}"${stageAttr}>${bar}${ch ? `<span class="hx-mark" aria-hidden="true">${yang ? '○' : '×'}</span>` : ''}</div>`;
  }).join('');
  return `<div class="hx-figure" aria-hidden="true">${rows}</div>`;
}
function explainChip(text) { return `<button type="button" class="btn sm ich-explain" data-q="${esc(text)}">✶ explain</button>`; }

export function initIching() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
  renderReference();
  buildManualPad();
  $('ich-form').addEventListener('submit', e => { e.preventDefault(); castCoins(); });
  $('ich-manual-read').addEventListener('click', () => castManual());
  // "Reveal instantly" skip affordance: drop the staged flag so every line snaps
  // to its final state (the DS2 .stage-figure default is opacity 1).
  const revealBtn = $('ich-reveal');
  if (revealBtn) revealBtn.addEventListener('click', () => { const s = $('ich-stage'); if (s) s.classList.remove('is-staged'); });
  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.ich-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });
  divAssistant = initDivinationAssistant({
    kind: 'iching',
    getReading: () => currentReading(),
    subscribeReading: cb => subscribers.push(cb),
  });
  mountOracleBar();   // the share/download actions now live on the sticky oracle bar
  if (!restoreFromURL()) castCoins(); // a shared cast, else a first cast on load (pure compute, no network)
}

// --- the oracle action bar (ui3-spec §8): [Cast again][Copy link][⤓ Download MD]
// [✶ Ask the diviner]. The old in-form share/download buttons MOVED here (same
// handlers — copyShareLink still writes the shareable link, restore is unchanged).
let oracleBar = null;
const oracleMotionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
async function mountOracleBar() {
  const host = $('ich-actionbar');
  if (!host) return;
  const mod = await import('./action-bar.js').catch(() => null);
  if (!mod || !mod.mountActionBar) return;
  oracleBar = mod.mountActionBar(host, {
    variant: 'oracle',
    oracleActions: [
      { id: 'ich-ab-recast', label: 'Cast again' },
      { id: 'ich-ab-copylink', label: 'Copy link' },
      { id: 'ich-ab-md', label: '⤓ Download MD' },
      { id: 'ich-ab-diviner', label: '✶ Ask the diviner' },
    ],
    summary: () => ({ verdict: '', text: reading ? `${reading.primary.num}. ${reading.primary.name}.` : '' }),
  });
  const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  on('ich-ab-recast', () => castCoins());
  on('ich-ab-copylink', () => copyShareLink($('ich-share-status'), shareState()));
  on('ich-ab-md', () => downloadText(toMarkdown(), 'iching-reading.md', 'text/markdown;charset=utf-8'));
  on('ich-ab-diviner', () => askDiviner());
  promoteDivinerInput();
  if (reading) oracleBar.show();   // an auto-cast already ran before the import resolved
}
// Move the diviner's "Connect an AI" settings fieldset below the ask box so the
// textarea is the panel's primary/first control — and so the sticky action bar
// reliably hides when the ask box takes focus at 390 px (the config inputs
// otherwise precede the textarea in the DOM). Nodes keep their wired listeners.
function promoteDivinerInput() {
  try { const dv = document.getElementById('dv-assistant'); const fs = dv && dv.querySelector('fieldset'); if (dv && fs) dv.appendChild(fs); } catch { /* non-fatal */ }
}
function askDiviner() {
  const c = $('dv-assistant-card'); if (!c) return;
  try { c.scrollIntoView({ behavior: oracleMotionOK() ? 'smooth' : 'auto', block: 'start' }); } catch { /* */ }
  const t = c.querySelector('textarea, input'); if (t) { try { t.focus(); } catch { /* */ } }
}

function currentReading() { return reading ? { kind: 'iching', question, reading } : null; }
function notify() { const r = currentReading(); subscribers.forEach(cb => { try { cb(r); } catch { /* non-fatal */ } }); }

function castCoins() {
  const throws = castThrows();
  lastThrows = throws;
  const { lines, changing } = linesFromThrows(throws);
  compute(lines, changing);
}
function castManual() {
  try {
    const throws = readManualThrows();
    lastThrows = throws;
    const { lines, changing } = linesFromThrows(throws);
    compute(lines, changing);
    $('ich-out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { $('ich-manual-status').textContent = 'Could not read the cast: ' + e.message; }
}

// --- share & export -----------------------------------------------------------
// the share-link carries the six line-throws (6..9, bottom to top) and the
// question — the whole cast derives from them, so it reproduces exactly.
function shareState() {
  return lastThrows ? { it: lastThrows.join(''), iq: question || '' } : {};
}
function restoreFromURL() {
  try {
    const st = readStateFromURL(['it', 'iq']);
    if (!st || !st.it || !/^[6-9]{6}$/.test(st.it)) return false;
    const throws = st.it.split('').map(Number);
    lastThrows = throws;
    if (st.iq) $('ich-question').value = st.iq;
    const { lines, changing } = linesFromThrows(throws);
    compute(lines, changing);
    return true;
  } catch { return false; }
}
function toMarkdown() {
  if (!reading) return '# I Ching — no cast yet\n';
  const r = reading;
  return [
    `# I Ching — ${r.primary.num}. ${r.primary.name} (${r.primary.pinyin})`,
    question ? `**Question:** ${question}` : '',
    '',
    `**Figure:** ${r.trigrams.upper.name} over ${r.trigrams.lower.name} — lines (bottom→top): ${r.lines.map((l, i) => (l ? '⚊' : '⚋') + (r.changing[i] ? '·' : '')).join(' ')}`,
    '',
    `**Judgment.** ${r.primary.judgment}`,
    `**Image.** ${r.primary.image}`,
    '',
    r.moving.length ? '## Moving lines' : '_No moving lines — the situation is stable._',
    ...r.moving.map(m => `- **${m.position} line** (${m.yang ? 'old yang 9' : 'old yin 6'}): ${m.text}`),
    '',
    `**Nuclear hexagram:** ${r.nuclear.num}. ${r.nuclear.name}`,
    r.relating ? `**Relating hexagram:** ${r.relating.num}. ${r.relating.name} — ${r.relating.judgment}` : '',
    '',
    `**Reading.** ${r.guidance}`,
    '',
    `> ${r.note}`,
    `> — ${r.cite}`,
    '',
    '*A historical divinatory art of no demonstrated validity — described for study, never prescribed.*',
    `*Cast at ${new Date().toISOString()} on The Astrologer's Workbench.*`,
  ].filter(l => l !== '').join('\n');
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
        ${hexFigure(r.primary, r.changing, 0)}
        <div class="hx-name"><b>${r.primary.num}. ${esc(r.primary.name)}</b><br><span class="muted small">${esc(r.primary.pinyin)} · ${esc(r.trigrams.upper.name)} over ${esc(r.trigrams.lower.name)}</span></div>
        ${explainChip('Explain the primary hexagram ' + r.primary.num + '. ' + r.primary.name + ' (' + r.trigrams.upper.name + ' over ' + r.trigrams.lower.name + ') in this cast — its Judgment and Image and what situation the tradition reads in it. Describe as history, never predict.')}
      </div>
      ${r.relating ? `<div class="hx-arrow" aria-hidden="true">→</div>
      <div class="hx-col">
        <div class="small muted">Relating (where it tends)</div>
        ${hexFigure(r.relating, null, 6)}
        <div class="hx-name"><b>${r.relating.num}. ${esc(r.relating.name)}</b><br><span class="muted small">${esc(r.relating.pinyin)}</span></div>
        ${explainChip('Explain the relating hexagram ' + r.relating.num + '. ' + r.relating.name + ' as the direction this cast tends toward. Describe as history, never predict.')}
      </div>` : ''}
    </div>`;

  // arm the staged reveal (idempotent; DS2 CSS is instant under reduced-motion)
  // and announce the primary hexagram and where it tends on the live region.
  const stage = $('ich-stage');
  if (stage) stage.classList.add('is-staged');
  const sv = $('ich-stage-verdict');
  if (sv) sv.textContent = `Primary: ${r.primary.num}. ${r.primary.name}${r.moving.length ? ` — ${r.moving.length} moving line${r.moving.length > 1 ? 's' : ''}` : ' — no moving lines'}${r.relating ? `, tending to ${r.relating.num}. ${r.relating.name}` : ''}.`;

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
  if (oracleBar) oracleBar.show();
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
