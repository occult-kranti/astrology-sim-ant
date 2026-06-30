// ============================================================================
//  geomancy.js — drives pages/geomancy.html. Cast a geomantic Shield Chart
//  (four Mothers struck at random, or set by hand), watch the engine derive the
//  Daughters, Nieces, Witnesses, the Judge and the Reconciler by pure algebra
//  (core/geomancy.js), lay the twelve figures into the houses, and read a
//  house-by-house judgement. The diviner AI panel narrates the cast.
//
//  The RANDOMNESS lives HERE (the app), never in the engine — so the engine
//  stays pure & testable. We use crypto.getRandomValues where available.
//
//  HONEST FRAMING: a historical divinatory art of no demonstrated validity,
//  computed for study — described, never prescribed.
// ============================================================================
import { castShield, mothersFromTallies, geomanticJudgement, geomancyHouses, GEOMANTIC_FIGURES } from '../core/geomancy.js';
import { figureByRows } from '../core/data/geomantic-figures.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'));
const toneBadge = t => `<span class="verdict ${t === 'affirmed' ? 'green' : t === 'denied' ? 'red' : 'amber'}">${t}</span>`;

const TOPICS = [
  [1, 'the querent — self, body, life'], [2, 'money & movable goods'], [3, 'siblings, neighbours, short journeys'],
  [4, 'father, land, houses, the end of the matter'], [5, 'children, pleasure, pregnancy'], [6, 'sickness, servants, small animals'],
  [7, 'marriage, partners, open enemies, theft'], [8, 'death, legacies, the partner’s estate'], [9, 'long journeys, religion, learning'],
  [10, 'honour, office, career, the mother'], [11, 'friends, hopes & wishes'], [12, 'secret enemies, imprisonment, self-undoing'],
];

let shield = null, judgement = null, houses = null, question = '', quesitedHouse = 7;
let divAssistant = null;
const subscribers = [];

// --- random marks (the "strike in the sand") --------------------------------
function randomTallies() {
  const a = new Uint32Array(16);
  try { (self.crypto || window.crypto).getRandomValues(a); }
  catch { for (let i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 0xffffffff); }
  // the tradition tallies a hasty, uncounted row of marks; here each line gets a
  // random count whose parity gives a single (odd) or double (even) point.
  return Array.from(a, x => (x % 16) + 1);
}

// --- rendering --------------------------------------------------------------
function figureDots(f) {
  return `<div class="geo-dots" aria-hidden="true">${f.rows.map(r =>
    `<div class="geo-row">${r === 2 ? '<i class="geo-dot"></i><i class="geo-dot"></i>' : '<i class="geo-dot"></i>'}</div>`).join('')}</div>`;
}
function figureCard(f, label, extra = '') {
  return `<div class="geo-figure geo-${esc(f.nature)}">
    ${label ? `<div class="geo-slot">${esc(label)}</div>` : ''}
    ${figureDots(f)}
    <div class="geo-fname">${esc(f.english)}<br><span class="muted small">${esc(f.latin)} · ${esc(f.points)}pt</span></div>
    ${extra}</div>`;
}
function explainChip(text) { return `<button type="button" class="btn sm geo-explain" data-q="${esc(text)}">✶ explain</button>`; }

export function initGeomancy() {
  // topic select
  $('geo-topic').innerHTML = TOPICS.map(([n, t]) => `<option value="${n}">${n} — ${esc(t)}</option>`).join('');
  $('geo-topic').value = 7;
  renderReference();
  buildManualPad();

  // the cast button is type=submit, so the form-submit handler covers both click
  // and Enter — a separate click handler would cast twice.
  $('geo-form').addEventListener('submit', e => { e.preventDefault(); castRandom(); });
  $('geo-topic').addEventListener('change', () => { if (shield) recompute(); });
  $('geo-manual-read').addEventListener('click', () => castManual());

  // delegated per-figure explain
  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.geo-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });

  // AI panel
  divAssistant = initDivinationAssistant({
    kind: 'geomancy',
    getReading: () => currentReading(),
    subscribeReading: cb => subscribers.push(cb),
  });

  castRandom(); // a first cast on load (no network; pure compute)
}

function currentReading() {
  if (!shield) return null;
  return { kind: 'geomancy', question, quesitedHouse, shield, judgement, houses };
}
function notify() { const r = currentReading(); subscribers.forEach(cb => { try { cb(r); } catch { /* non-fatal */ } }); }

function castRandom() {
  const mothers = mothersFromTallies(randomTallies());
  shield = castShield(mothers);
  recompute();
}
function castManual() {
  try {
    const rows = readManualRows();
    shield = castShield(rows.map(r => figureByRows(r)));
    recompute();
    $('geo-out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { $('geo-manual-status').textContent = 'Could not read the cast: ' + e.message; }
}

function recompute() {
  question = $('geo-question').value.trim();
  quesitedHouse = parseInt($('geo-topic').value, 10) || 7;
  houses = geomancyHouses(shield);
  judgement = geomanticJudgement(shield, quesitedHouse);
  render();
  notify();
}

function render() {
  const j = judgement;
  // the shield tiers
  $('geo-shield').innerHTML = `
    <div class="geo-tier"><h3>The four Mothers <span class="muted small">(struck at random)</span></h3>
      <div class="geo-row-figs">${shield.mothers.map((f, i) => figureCard(f, `Mother ${i + 1}`)).join('')}</div></div>
    <div class="geo-tier"><h3>The four Daughters <span class="muted small">(by transposition)</span></h3>
      <div class="geo-row-figs">${shield.daughters.map((f, i) => figureCard(f, `Daughter ${i + 1}`)).join('')}</div></div>
    <div class="geo-tier"><h3>The four Nieces <span class="muted small">(mother+mother, daughter+daughter)</span></h3>
      <div class="geo-row-figs">${shield.nieces.map((f, i) => figureCard(f, `Niece ${i + 1}`)).join('')}</div></div>
    <div class="geo-tier"><h3>Witnesses, Judge &amp; Reconciler</h3>
      <div class="geo-row-figs geo-verdict-figs">
        ${figureCard(shield.witnesses.right, 'Right Witness', explainChip('Explain the Right Witness ' + shield.witnesses.right.english + ' (the querent’s side / the past) in this cast — what the tradition read here. Describe, never predict.'))}
        ${figureCard(shield.witnesses.left, 'Left Witness', explainChip('Explain the Left Witness ' + shield.witnesses.left.english + ' (the quesited’s side / what follows) in this cast — what the tradition read here. Describe, never predict.'))}
        ${figureCard(shield.judge, 'THE JUDGE', explainChip('Explain the Judge of this shield, ' + shield.judge.english + ' (' + shield.judge.latin + '), as the figure that passes sentence on the question — how the tradition read a Judge of this nature. Ground only in the computed shield; describe, never predict.'))}
        ${figureCard(shield.reconciler, 'Reconciler')}
      </div></div>`;

  // judgement
  $('geo-out').innerHTML =
    `<p style="font-size:1.05rem">${esc(j.topic)} — house ${j.quesitedHouse} ${toneBadge(j.tone)}</p>
     <p class="small">${esc(j.toneText)}</p>
     <ul class="clean small">${j.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
     <p class="small muted"><b>How geomancy reads a figure:</b> ${esc(j.note)} <span class="muted">— ${esc(j.cite)}</span></p>`;

  // the house chart
  $('geo-houses').innerHTML = houses.map(h => {
    const isQ = h.house === j.quesitedHouse, isA = h.house === 1;
    const chipText = `Explain the figure ${h.figure.english} (${h.figure.latin}) in the ${ord(h.house)} house (${(h.signifies || '').split(';')[0]}) of this cast — its planet ${h.figure.planet}, element ${h.figure.element}, and what the geomancers held it to mean here. Describe as history, never predict.`;
    return `<div class="geo-house ${isA ? 'geo-querent' : ''} ${isQ ? 'geo-quesited' : ''}">
      <div class="geo-house-n">${h.house}${isA ? ' · querent' : ''}${isQ && !isA ? ' · quesited' : ''}</div>
      ${figureDots(h.figure)}
      <div class="geo-fname small"><b>${esc(h.figure.english)}</b><br><span class="muted">${esc((h.signifies || '').split(';')[0])}</span></div>
      ${explainChip(chipText)}</div>`;
  }).join('');

  try { autolinkResultPanels(['geo-out']); } catch { /* non-fatal */ }
}

function renderReference() {
  $('geo-reference').innerHTML = GEOMANTIC_FIGURES.map(f => `<div class="geo-ref-card geo-${esc(f.nature)}">
    ${figureDots(f)}
    <div><b>${esc(f.english)}</b> <span class="muted small">${esc(f.latin)}</span>
      <div class="small muted">${esc(f.planet)} · ${esc(f.sign)} · ${esc(f.element)} · ${esc(f.nature)}${f.even ? ' · even' : ''}</div>
      <div class="small">${esc(f.meaning)}</div></div></div>`).join('');
}

// --- manual "strike the sand" mode -----------------------------------------
// Four Mothers × four lines; each line toggles single (·) / double (:).
function buildManualPad() {
  const pad = $('geo-manual-pad');
  pad.innerHTML = [0, 1, 2, 3].map(m => `<div class="geo-mpad">
    <div class="small muted">Mother ${m + 1}</div>
    ${[0, 1, 2, 3].map(r => `<button type="button" class="geo-mline" data-m="${m}" data-r="${r}" data-v="1" aria-pressed="false"><i class="geo-dot"></i></button>`).join('')}
  </div>`).join('');
  pad.querySelectorAll('.geo-mline').forEach(b => b.addEventListener('click', () => {
    const v = b.getAttribute('data-v') === '1' ? '2' : '1';
    b.setAttribute('data-v', v); b.setAttribute('aria-pressed', v === '2' ? 'true' : 'false');
    b.innerHTML = v === '2' ? '<i class="geo-dot"></i><i class="geo-dot"></i>' : '<i class="geo-dot"></i>';
  }));
}
function readManualRows() {
  const rows = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
  $('geo-manual-pad').querySelectorAll('.geo-mline').forEach(b => {
    rows[+b.getAttribute('data-m')][+b.getAttribute('data-r')] = +b.getAttribute('data-v');
  });
  return rows;
}
