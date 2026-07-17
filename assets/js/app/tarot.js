// ============================================================================
//  tarot.js — drives pages/tarot.html. Choose a spread, shuffle & draw from the
//  78-card deck (optionally with reversals), and the engine (core/tarot.js)
//  lays each card in its position, reads the Golden Dawn elemental dignities
//  between neighbours, and reports the spread's balance. The diviner AI panel
//  narrates it. The SHUFFLE/DRAW (randomness) lives HERE; the engine is pure.
//
//  HONEST FRAMING: Tarot cartomancy has no demonstrated predictive validity —
//  a historical symbolic system shown for study, described never prescribed.
// ============================================================================
import { tarotReading, SPREADS, SPREAD_KEYS } from '../core/tarot.js';
import { TAROT_DECK, DECK_IDS, SUITS } from '../core/data/tarot-deck.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { renderCastHour } from './cast-hour.js';
import { copyShareLink, readStateFromURL, downloadText } from './state.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const SUIT_GLYPH = { wands: '🜂', cups: '🜄', swords: '🜁', pentacles: '🜃' };
const REL_LABEL = { reinforce: 'reinforce', strengthen: 'strengthen', weaken: 'weaken', neutral: 'neutral' };

let reading = null, spreadKey = 'three', question = '', reversalsOn = true;
let lastDraws = null;                 // the drawn cards of the current spread (for share/export)
let divAssistant = null;
const subscribers = [];

// --- crypto-quality shuffle (the randomness lives in the app) ----------------
function randInt(n) {
  try { const a = new Uint32Array(1); (self.crypto || window.crypto).getRandomValues(a); return a[0] % n; }
  catch { return Math.floor(Math.random() * n); }
}
function shuffledDraw(count, reversals) {
  const ids = DECK_IDS.slice();
  for (let i = ids.length - 1; i > 0; i--) { const j = randInt(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  return ids.slice(0, count).map(id => ({ id, reversed: reversals && randInt(2) === 1 }));
}

export function initTarot() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
  $('tarot-spread').innerHTML = SPREAD_KEYS.map(k => `<option value="${k}">${esc(SPREADS[k].name)}</option>`).join('');
  $('tarot-spread').value = 'three';
  renderReference();

  // the draw button is type=submit, so the form-submit handler covers both click
  // and Enter — a separate click handler would fire draw() twice.
  $('tarot-form').addEventListener('submit', e => { e.preventDefault(); draw(); });
  $('tarot-spread').addEventListener('change', () => { $('tarot-spread-desc').textContent = SPREADS[$('tarot-spread').value].description; });
  $('tarot-reversals').addEventListener('change', () => { reversalsOn = $('tarot-reversals').checked; });
  $('tarot-spread-desc').textContent = SPREADS.three.description;

  // "Reveal instantly" skip affordance: drop the staged flag so every card snaps
  // to its final state (the DS2 .stage-figure default is opacity 1).
  const revealBtn = $('tarot-reveal');
  if (revealBtn) revealBtn.addEventListener('click', () => { const s = $('tarot-stage'); if (s) s.classList.remove('is-staged'); });

  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.tarot-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });

  divAssistant = initDivinationAssistant({
    kind: 'tarot',
    getReading: () => currentReading(),
    subscribeReading: cb => subscribers.push(cb),
  });

  mountOracleBar();   // the share/download actions now live on the sticky oracle bar

  if (!restoreFromURL()) draw(); // a shared spread, else a first draw on load (pure compute, no network)
}

// --- the oracle action bar (ui3-spec §8): [Cast again][Copy link][⤓ Download MD]
// [✶ Ask the diviner]. The old in-form share/download buttons MOVED here (same
// handlers — copyShareLink still writes the shareable link, restore is unchanged).
let oracleBar = null;
const oracleMotionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
async function mountOracleBar() {
  const host = $('tarot-actionbar');
  if (!host) return;
  const mod = await import('./action-bar.js').catch(() => null);
  if (!mod || !mod.mountActionBar) return;
  oracleBar = mod.mountActionBar(host, {
    variant: 'oracle',
    oracleActions: [
      { id: 'tarot-ab-recast', label: 'Cast again' },
      { id: 'tarot-ab-copylink', label: 'Copy link' },
      { id: 'tarot-ab-md', label: '⤓ Download MD' },
      { id: 'tarot-ab-diviner', label: '✶ Ask the diviner' },
    ],
    summary: () => ({ verdict: '', text: reading ? `${reading.spread.name} laid.` : '' }),
  });
  const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  on('tarot-ab-recast', () => draw());
  on('tarot-ab-copylink', () => copyShareLink($('tarot-share-status'), shareState()));
  on('tarot-ab-md', () => downloadText(toMarkdown(), 'tarot-reading.md', 'text/markdown;charset=utf-8'));
  on('tarot-ab-diviner', () => askDiviner());
  promoteDivinerInput();
  if (reading) oracleBar.show();   // an auto-draw already ran before the import resolved
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
// the share-link carries the spread, the exact drawn cards (with reversals) and
// the question — so a spread can be reproduced exactly on another device.
function shareState() {
  if (!lastDraws) return {};
  return { ts: spreadKey, td: lastDraws.map(d => d.id + (d.reversed ? '.r' : '')).join(','), tq: question || '' };
}
function restoreFromURL() {
  try {
    const st = readStateFromURL(['ts', 'td', 'tq']);
    if (!st || !st.ts || !st.td || !SPREADS[st.ts]) return false;
    const draws = st.td.split(',').map(tok => { const rev = tok.endsWith('.r'); return { id: rev ? tok.slice(0, -2) : tok, reversed: rev }; });
    if (draws.length !== SPREADS[st.ts].count) return false;
    spreadKey = st.ts; $('tarot-spread').value = st.ts;
    $('tarot-spread-desc').textContent = SPREADS[st.ts].description;
    if (st.tq) { $('tarot-question').value = st.tq; }
    question = st.tq || '';
    computeFromDraws(draws);
    return reading != null;
  } catch { return false; }
}
function toMarkdown() {
  if (!reading) return '# Tarot — no spread yet\n';
  const r = reading;
  return [
    `# Tarot — ${r.spread.name}`,
    question ? `**Question:** ${question}` : '',
    '',
    ...r.cards.map(c => `- **${c.n}. ${c.position}** — ${c.card.name}${c.reversed ? ' (reversed)' : ''}: ${(c.text || []).join(', ')}. ${c.meaning}`),
    '',
    r.dignities.length ? '## Elemental dignities' : '',
    ...r.dignities.map(d => `- ${d.relation}: ${d.between[0]} & ${d.between[1]} (${d.positions.join(' / ')})`),
    '',
    r.summaryLines.length ? '## The spread at a glance' : '',
    ...r.summaryLines.map(s => `- ${s}`),
    '',
    `> ${r.note}`,
    `> — ${r.cite}`,
    '',
    '*A historical divinatory art of no demonstrated validity — described for study, never prescribed.*',
    `*Drawn at ${new Date().toISOString()} on The Astrologer's Workbench.*`,
  ].filter(l => l !== '').join('\n');
}

function currentReading() { return reading ? { kind: 'tarot', question, spreadKey, reading } : null; }
function notify() { const r = currentReading(); subscribers.forEach(cb => { try { cb(r); } catch { /* non-fatal */ } }); }

function draw() {
  spreadKey = $('tarot-spread').value;
  reversalsOn = $('tarot-reversals').checked;
  question = $('tarot-question').value.trim();
  computeFromDraws(shuffledDraw(SPREADS[spreadKey].count, reversalsOn));
}
function computeFromDraws(draws) {
  try { reading = tarotReading(spreadKey, draws, { question }); }
  catch (e) { $('tarot-out').innerHTML = `<p class="muted">Could not lay the spread (${esc(e.message)}).</p>`; reading = null; return; }
  lastDraws = draws;
  render();
  notify();
}

// --- rendering --------------------------------------------------------------
function cardFace(c, opts = {}) {
  const card = c.card;
  const isMajor = card.arcana === 'major';
  const suit = card.suit;
  const elClass = card.element ? 'tarot-el-' + card.element.toLowerCase() : 'tarot-el-none';
  const badge = isMajor ? (ROMAN[card.number] || card.number) : `${SUIT_GLYPH[suit] || ''} ${card.number <= 10 ? card.number : ''}`;
  const transform = `${opts.rotated ? 'rotate(90deg) ' : ''}${c.reversed ? 'scaleY(-1)' : ''}`;
  return `<div class="tarot-card ${elClass}" ${opts.style || ''}>
    <div class="tarot-card-inner" style="transform:${transform || 'none'}">
      <div class="tarot-badge">${esc(badge)}</div>
      <div class="tarot-cname">${esc(card.name)}</div>
      <div class="tarot-suit small">${isMajor ? 'Major' : esc((SUITS[suit] && SUITS[suit].name) || suit)}${c.reversed ? ' · reversed' : ''}</div>
    </div></div>`;
}

function render() {
  const r = reading;
  // the laid-out board
  const tall = spreadKey === 'celticCross' ? 30 : (spreadKey === 'horseshoe' ? 22 : 17);
  // Each slot is absolutely positioned (its own translate centres it); the card +
  // label ride an inner `.stage-figure` so the DS2 casting-stage can reveal them in
  // reading order (`--stage-i` = position index) without disturbing that centring.
  const board = r.cards.map(c => {
    const style = `style="position:absolute; left:${(c.x * 100).toFixed(1)}%; top:${(c.y * 100).toFixed(1)}%; transform:translate(-50%,-50%);"`;
    return `<div class="tarot-slot" ${style}>
      <div class="stage-figure" style="--stage-i:${c.n - 1}">
        <div class="tarot-pos small muted">${esc(c.n)}. ${esc(c.position)}</div>
        ${cardFace(c, { rotated: c.rotated })}</div></div>`;
  }).join('');
  $('tarot-board').innerHTML = `<div class="tarot-board" style="height:${tall}rem">${board}</div>`;

  // arm the staged reveal (idempotent; DS2 CSS is instant under reduced-motion)
  // and announce the keynote card on the live region.
  const stage = $('tarot-stage');
  if (stage) stage.classList.add('is-staged');
  const sv = $('tarot-stage-verdict');
  if (sv && r.cards[0]) sv.textContent = `${r.spread.name} laid — ${r.cards[0].position}: ${r.cards[0].card.name}${r.cards[0].reversed ? ' (reversed)' : ''}.`;

  // per-position reading
  $('tarot-out').innerHTML = `
    ${r.summaryLines.length ? `<p class="small"><b>The spread at a glance:</b></p><ul class="clean small">${r.summaryLines.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
    <div class="tarot-positions">${r.cards.map(c => {
      const chip = `Read the card ${c.card.name}${c.reversed ? ' (reversed)' : ''} in the position "${c.position}" (${c.positionMeaning}): its Golden Dawn correspondence ${c.card.astro || ''}${c.card.hebrew ? ', Hebrew letter ' + c.card.hebrew : ''}, and how the tradition reads it here. Describe as history; do not forecast.`;
      return `<div class="tarot-pos-row">
        <div class="tarot-pos-h"><b>${esc(c.n)}. ${esc(c.position)}</b> — ${esc(c.card.name)}${c.reversed ? ' <span class="muted">(reversed)</span>' : ''}
          <button type="button" class="btn sm tarot-explain" data-q="${esc(chip)}">✶ explain</button></div>
        <div class="small muted">${esc(c.positionMeaning)}</div>
        <div class="small"><b>${esc((c.text || []).join(', '))}.</b> ${esc(c.meaning)}</div>
      </div>`;
    }).join('')}</div>
    ${r.dignities.length ? `<p class="small" style="margin-top:.6rem"><b>Elemental dignities</b> (Golden Dawn — how neighbours strengthen or weaken):</p>
      <ul class="clean small">${r.dignities.map(d => `<li><b>${esc(REL_LABEL[d.relation] || d.relation)}</b> — ${esc(d.between[0])} &amp; ${esc(d.between[1])} (${esc(d.positions.join(' / '))}): ${esc(d.note)}</li>`).join('')}</ul>` : ''}
    <p class="small muted"><b>How a reading works:</b> ${esc(r.note)} <span class="muted">— ${esc(r.cite)}</span></p>`;

  try { autolinkResultPanels(['tarot-out']); } catch { /* non-fatal */ }
  if (oracleBar) oracleBar.show();
}

function renderReference() {
  const byArc = { major: TAROT_DECK.filter(c => c.arcana === 'major'), wands: [], cups: [], swords: [], pentacles: [] };
  for (const c of TAROT_DECK) if (c.arcana === 'minor') byArc[c.suit].push(c);
  const section = (title, cards) => `<details class="small"><summary><b>${esc(title)}</b> (${cards.length})</summary>
    <div class="tarot-ref-grid">${cards.map(c => `<div class="tarot-ref-card ${c.element ? 'tarot-el-' + c.element.toLowerCase() : ''}">
      <b>${esc(c.name)}</b> <span class="muted">${esc(c.astro || '')}${c.hebrew ? ' · ' + esc(c.hebrew) : ''}</span>
      <div class="small">↑ ${esc((c.upright || []).join(', '))}<br>↓ ${esc((c.reversed || []).join(', '))}</div></div>`).join('')}</div></details>`;
  $('tarot-reference').innerHTML =
    section('Major Arcana', byArc.major) +
    section('Wands (Fire)', byArc.wands) + section('Cups (Water)', byArc.cups) +
    section('Swords (Air)', byArc.swords) + section('Pentacles (Earth)', byArc.pentacles);
}
