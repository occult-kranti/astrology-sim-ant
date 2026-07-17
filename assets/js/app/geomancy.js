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
import { figureByRows, figureGlyph } from '../core/data/geomantic-figures.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { renderCastHour } from './cast-hour.js';
import { copyShareLink, readStateFromURL, downloadText } from './state.js';

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
// The shield is the page's ritual moment: each figure carries a `stage-figure`
// class + a `--stage-i` index so the DS2 casting-stage reveals them one by one in
// DERIVATION order (Mothers→Daughters→Nieces→Witnesses→Judge). `si` is that index
// (null = no staging); `cls` marks the Judge for its landing pulse.
function figureCard(f, label, extra = '', si = null, cls = '') {
  const stageCls = si == null ? '' : ` stage-figure${cls ? ' ' + cls : ''}`;
  const stageAttr = si == null ? '' : ` style="--stage-i:${si}"`;
  return `<div class="geo-figure geo-${esc(f.nature)}${stageCls}"${stageAttr}>
    ${label ? `<div class="geo-slot">${esc(label)}</div>` : ''}
    ${figureDots(f)}
    <div class="geo-fname">${esc(f.english)}<br><span class="muted small">${esc(f.latin)} · ${esc(f.points)}pt</span></div>
    ${extra}</div>`;
}
function explainChip(text) { return `<button type="button" class="btn sm geo-explain" data-q="${esc(text)}">✶ explain</button>`; }

export function initGeomancy() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
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

  // "Reveal instantly" skip affordance: drop the staged flag so every figure
  // snaps to its final state (the DS2 .stage-figure default is opacity 1).
  const revealBtn = $('geo-reveal');
  if (revealBtn) revealBtn.addEventListener('click', () => { const s = $('geo-stage'); if (s) s.classList.remove('is-staged'); });

  // delegated per-figure explain
  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.geo-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });

  // share / export — the actions now live on the sticky oracle action bar
  mountOracleBar();

  // AI panel
  divAssistant = initDivinationAssistant({
    kind: 'geomancy',
    getReading: () => currentReading(),
    subscribeReading: cb => subscribers.push(cb),
  });

  if (!restoreFromURL()) castRandom(); // a shared cast, else a first cast on load (no network; pure compute)
}

// --- the oracle action bar (ui3-spec §8): [Cast again][Copy link][⤓ Download MD]
// [✶ Ask the diviner]. The old in-form share/download buttons MOVED here (same
// handlers — copyShareLink still writes the shareable link, restore is unchanged).
let oracleBar = null;
const oracleMotionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
async function mountOracleBar() {
  const host = $('geo-actionbar');
  if (!host) return;
  const mod = await import('./action-bar.js').catch(() => null);
  if (!mod || !mod.mountActionBar) return;
  oracleBar = mod.mountActionBar(host, {
    variant: 'oracle',
    oracleActions: [
      { id: 'geo-ab-recast', label: 'Cast again' },
      { id: 'geo-ab-copylink', label: 'Copy link' },
      { id: 'geo-ab-md', label: '⤓ Download MD' },
      { id: 'geo-ab-diviner', label: '✶ Ask the diviner' },
    ],
    summary: () => ({ verdict: '', text: judgement ? `The tradition reads the matter ${judgement.tone}.` : '' }),
  });
  const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  on('geo-ab-recast', () => castRandom());
  on('geo-ab-copylink', () => copyShareLink($('geo-share-status'), shareState()));
  on('geo-ab-md', () => downloadText(toMarkdown(), 'geomancy-reading.md', 'text/markdown;charset=utf-8'));
  on('geo-ab-diviner', () => askDiviner());
  promoteDivinerInput();
  if (shield) oracleBar.show();   // an auto-cast already ran before the import resolved
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

// --- share & export -----------------------------------------------------------
// the share-link carries the four Mothers (everything else derives), the house
// and the question — so a cast can be reproduced exactly on another device.
function shareState() {
  if (!shield) return {};
  return { gm: shield.mothers.map(m => m.rows.join('')).join('-'), gh: String(quesitedHouse), gq: question || '' };
}
function restoreFromURL() {
  try {
    const st = readStateFromURL(['gm', 'gh', 'gq']);
    if (!st || !st.gm) return false;
    const rows = st.gm.split('-').map(s => s.split('').map(Number));
    if (rows.length !== 4 || rows.some(r => r.length !== 4 || r.some(v => v !== 1 && v !== 2))) return false;
    shield = castShield(rows.map(r => figureByRows(r)));
    if (st.gq) $('geo-question').value = st.gq;
    if (st.gh && +st.gh >= 1 && +st.gh <= 12) $('geo-topic').value = st.gh;
    recompute();
    return true;
  } catch { return false; }
}
function toMarkdown() {
  if (!shield || !judgement) return '# Geomancy — no cast yet\n';
  const j = judgement;
  const F = f => `${f.english} (${f.latin}) ${figureGlyph(f)}`;
  return [
    '# Geomancy — the Shield Chart',
    question ? `**Question:** ${question} (house ${j.quesitedHouse} — ${j.topic})` : `**Topic:** house ${j.quesitedHouse} — ${j.topic}`,
    '',
    `**Mothers:** ${shield.mothers.map(F).join(' · ')}`,
    `**Daughters:** ${shield.daughters.map(F).join(' · ')}`,
    `**Nieces:** ${shield.nieces.map(F).join(' · ')}`,
    `**Witnesses:** right ${F(shield.witnesses.right)}; left ${F(shield.witnesses.left)}`,
    `**Judge:** ${F(shield.judge)} — **Reconciler:** ${F(shield.reconciler)}`,
    '',
    `## Judgement — ${j.tone}`,
    j.toneText, '',
    ...j.lines.map(l => `- ${l}`),
    '',
    `> ${j.note}`,
    `> — ${j.cite}`,
    '',
    '*A historical divinatory art of no demonstrated validity — described for study, never prescribed.*',
    `*Cast at ${new Date().toISOString()} on The Astrologer's Workbench.*`,
  ].join('\n');
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
      <div class="geo-row-figs">${shield.mothers.map((f, i) => figureCard(f, `Mother ${i + 1}`, '', i)).join('')}</div></div>
    <div class="geo-tier"><h3>The four Daughters <span class="muted small">(by transposition)</span></h3>
      <div class="geo-row-figs">${shield.daughters.map((f, i) => figureCard(f, `Daughter ${i + 1}`, '', 4 + i)).join('')}</div></div>
    <div class="geo-tier"><h3>The four Nieces <span class="muted small">(mother+mother, daughter+daughter)</span></h3>
      <div class="geo-row-figs">${shield.nieces.map((f, i) => figureCard(f, `Niece ${i + 1}`, '', 8 + i)).join('')}</div></div>
    <div class="geo-tier"><h3>Witnesses, Judge &amp; Reconciler</h3>
      <div class="geo-row-figs geo-verdict-figs">
        ${figureCard(shield.witnesses.right, 'Right Witness', explainChip('Explain the Right Witness ' + shield.witnesses.right.english + ' (the querent’s side / the past) in this cast — what the tradition read here. Describe, never predict.'), 12)}
        ${figureCard(shield.witnesses.left, 'Left Witness', explainChip('Explain the Left Witness ' + shield.witnesses.left.english + ' (the quesited’s side / what follows) in this cast — what the tradition read here. Describe, never predict.'), 13)}
        ${figureCard(shield.judge, 'THE JUDGE', explainChip('Explain the Judge of this shield, ' + shield.judge.english + ' (' + shield.judge.latin + '), as the figure that passes sentence on the question — how the tradition read a Judge of this nature. Ground only in the computed shield; describe, never predict.'), 14, 'stage-judge')}
        ${figureCard(shield.reconciler, 'Reconciler', '', 15)}
      </div></div>`;

  // arm the staged reveal (idempotent; DS2 CSS short-circuits to instant under
  // prefers-reduced-motion) and announce the Judge on the live region.
  const stage = $('geo-stage');
  if (stage) stage.classList.add('is-staged');
  const sv = $('geo-stage-verdict');
  if (sv) sv.textContent = `Judge: ${shield.judge.english} (${shield.judge.latin}) — the tradition reads the matter ${j.tone}.`;

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
  if (oracleBar) oracleBar.show();
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
