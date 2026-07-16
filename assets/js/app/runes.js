// ============================================================================
//  runes.js (app) — drives pages/runes.html. Scatter and draw the lots, and the
//  pure engine (core/runes.js) reads each drawn stave: its attested medieval
//  rune-poem stanzas ABOVE its flagged modern keyword. The diviner AI panel
//  narrates the cast.
//
//  The RANDOMNESS (the "scatter") lives HERE (the app), never in the engine — so
//  the engine stays pure & testable. We draw DISTINCT stave indices with
//  crypto.getRandomValues (a partial Fisher–Yates over 0..23), matching the
//  other diviner apps.
//
//  HONEST FRAMING: the Elder Futhark was a writing system; no ancient source
//  gives a rune-by-rune meaning table — the per-rune oracle is a 20th-century
//  construction. Described for study, never prescribed. No blank rune.
// ============================================================================
import {
  castFromDraws, poemCoverageOf,
  RUNES, AETTIR, CASTING_METHODS, POEMS, FRAMING, DECK_SIZE,
} from '../core/runes.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { renderCastHour } from './cast-hour.js';
import { copyShareLink, readStateFromURL, downloadText } from './state.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let reading = null;                 // the raw engine reading (method, staves, …)
let question = '';
let lastReading = null;             // the shaped reading object for the AI panel / export
let divAssistant = null;
const subscribers = [];

// --- randomness (the "scatter") lives here ----------------------------------
function rand(n) {
  try { const a = new Uint32Array(1); (self.crypto || window.crypto).getRandomValues(a); return a[0] % n; }
  catch { return Math.floor(Math.random() * n); }
}
// draw `count` DISTINCT stave indices from 0..deckSize-1 (partial Fisher–Yates)
function drawDistinct(count, deckSize) {
  const pool = Array.from({ length: deckSize }, (_, i) => i);
  for (let i = 0; i < count; i++) {
    const j = i + rand(deckSize - i);
    const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }
  return pool.slice(0, count);
}

// --- the shaped reading (contract for the AI wiring; see manifest) ----------
function shapeReading() {
  if (!reading) return null;
  return {
    kind: 'runes',
    question,
    method: reading.method,          // { id, label, drawCount, historicity, modern, quote, quoteCite, latinKey, dispute, cite }
    staves: reading.staves,          // [rune record + { drawIndex, slot, positionLabel }]
    methodNote: reading.methodNote,
    coverage: poemCoverageOf(),      // { total:24, oe:24, norse:16, oeOnly:8, oeOnlyStaves:[…], noPoem:0 }
    framing: reading.framing,        // FRAMING (the honest block, each field .cite)
    note: reading.note,
    cite: reading.cite,
  };
}
export function currentRunesReading() { return lastReading; }
export function subscribeRunesReading(cb) { subscribers.push(cb); }
function notify() { subscribers.forEach(cb => { try { cb(lastReading); } catch { /* non-fatal */ } }); }

// --- init -------------------------------------------------------------------
export function initRunes() {
  try { renderCastHour('cast-hour'); } catch { /* non-fatal */ }
  buildMethods();
  renderReference();
  renderFraming();

  $('rn-form').addEventListener('submit', e => { e.preventDefault(); castNow(); });

  // delegated per-stave "explain this" → the diviner box
  document.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.rn-explain');
    if (chip && divAssistant) divAssistant.prefill(chip.getAttribute('data-q'));
  });

  const shareBtn = $('rn-share'), mdBtn = $('rn-md');
  if (shareBtn) shareBtn.addEventListener('click', () => copyShareLink($('rn-share-status'), shareState()));
  if (mdBtn) mdBtn.addEventListener('click', () => downloadText(toMarkdown(), 'runes-reading.md', 'text/markdown;charset=utf-8'));

  // "Reveal instantly" skip affordance: drop the staged flag so every stave snaps
  // to its final state (the DS2 .stage-figure default is opacity 1).
  const revealBtn = $('rn-reveal');
  if (revealBtn) revealBtn.addEventListener('click', () => { const s = $('rn-stage'); if (s) s.classList.remove('is-staged'); });

  // the AI diviner panel: kind 'runes' (buildRunesContext/…InterpretPrompt/…DataBlock
  // wired in core/llm-context.js + app/divination-assistant.js). Mount only if the
  // page provides the placeholder.
  if (document.getElementById('dv-assistant')) {
    divAssistant = initDivinationAssistant({
      kind: 'runes',
      getReading: () => currentRunesReading(),
      subscribeReading: subscribeRunesReading,
      copy: { emptyText: 'Cast the runes above first.' },
    });
  }

  if (!restoreFromURL()) castNow(); // a shared cast, else a first cast on load (no network; pure compute)
}

// --- the casting-method radios ----------------------------------------------
function buildMethods() {
  const host = $('rn-methods');
  host.innerHTML = CASTING_METHODS.map(m => `
    <label class="rn-method${m.default ? ' sel' : ''}">
      <input type="radio" name="rn-method" value="${esc(m.id)}"${m.default ? ' checked' : ''}>
      <span><b>${esc(m.label)}</b> <span class="muted">(${m.drawCount} ${m.drawCount === 1 ? 'stave' : 'staves'})</span>
        <span class="rn-flag muted">${m.modern ? '· modern' : '· Tacitus prototype'}</span></span>
    </label>`).join('');
  host.querySelectorAll('input[name=rn-method]').forEach(r => r.addEventListener('change', () => {
    host.querySelectorAll('.rn-method').forEach(l => l.classList.toggle('sel', l.querySelector('input').checked));
    castNow();   // re-scatter with the newly chosen method
  }));
}
function currentMethod() { const r = document.querySelector('input[name=rn-method]:checked'); return r ? r.value : 'tacitus'; }
function setMethod(id) {
  const r = document.querySelector(`input[name=rn-method][value="${id}"]`);
  if (!r) return;
  r.checked = true;
  document.querySelectorAll('.rn-method').forEach(l => l.classList.toggle('sel', l.querySelector('input').checked));
}

// --- cast -------------------------------------------------------------------
function castNow() {
  const methodId = currentMethod();
  const m = CASTING_METHODS.find(x => x.id === methodId) || CASTING_METHODS[0];
  const indices = drawDistinct(m.drawCount, DECK_SIZE);
  compute(indices, methodId);
}
function compute(indices, methodId) {
  question = $('rn-question').value.trim();
  try { reading = castFromDraws(indices, methodId); }
  catch (e) { $('rn-out').innerHTML = `<p class="muted">Could not cast (${esc(e.message)}).</p>`; return; }
  lastReading = shapeReading();
  render();
  notify();
}

// --- share & export ----------------------------------------------------------
// the share-link carries the drawn stave ids, the question and the method — so a
// cast reproduces exactly on another device.
function shareState() {
  if (!reading) return {};
  return { rs: reading.staves.map(s => s.id).join('-'), rq: question || '', rm: reading.method.id };
}
function restoreFromURL() {
  try {
    const st = readStateFromURL(['rs', 'rq', 'rm']);
    if (!st || !st.rs) return false;
    const indices = st.rs.split('-').map(id => RUNES.findIndex(r => r.id === id));
    if (!indices.length || indices.some(i => i < 0)) return false;
    let methodId = st.rm;
    const m = CASTING_METHODS.find(x => x.id === methodId);
    if (!m || m.drawCount !== indices.length) methodId = indices.length === 1 ? 'single' : 'tacitus';
    setMethod(methodId);
    if (st.rq) $('rn-question').value = st.rq;
    compute(indices, methodId);
    return true;
  } catch { return false; }
}
function toMarkdown() {
  if (!reading) return '# Elder Futhark runes — no cast yet\n';
  const L = [`# Elder Futhark runes — ${reading.method.label}`, question ? `**Question:** ${question}` : '', ''];
  for (const s of reading.staves) {
    L.push(`## ${s.positionLabel}: ${s.name} ${s.char} (${s.translit}) — ætt ${s.aett}`);
    L.push(`Attested names: OE ${s.attestedNames.oe}${s.attestedNames.no ? `, ON ${s.attestedNames.no}` : ''}. Etymology: ${s.etymMeaning}.`);
    L.push('**Attested — the medieval rune poems:**');
    if (s.poems.oe) L.push(`- Old English (${s.poems.oe.name}): ${s.poems.oe.stanzaGist}`);
    if (s.poems.no) L.push(`- Old Norwegian (${s.poems.no.name}): ${s.poems.no.stanzaGist}`);
    if (s.poems.is) L.push(`- Old Icelandic (${s.poems.is.name}): ${s.poems.is.stanzaGist}`);
    if (!s.hasNorse) L.push(`- ${s.norseNote}`);
    L.push(`**Modern keyword (20th-c., flagged):** ${s.modernMeaning}`);
    if (s.contested) L.push(`> ⚑ ${s.contested.note}`);
    L.push('');
  }
  L.push(`> ${reading.note}`, `> — ${reading.cite}`, '');
  L.push('*A historical divinatory art of no demonstrated validity — described for study, never prescribed.*');
  L.push(`*Cast at ${new Date().toISOString()} on The Astrologer's Workbench.*`);
  return L.join('\n');
}

// --- rendering --------------------------------------------------------------
function explainChip(text) { return `<button type="button" class="btn sm rn-explain" data-q="${esc(text)}">✶ explain</button>`; }

function render() {
  $('rn-method-note').innerHTML = methodNoteHtml(reading.method);
  $('rn-cards').innerHTML = reading.staves.map((s, i) => staveCard(s, i)).join('');
  $('rn-out').innerHTML = outHtml();
  // arm the staged reveal (idempotent; DS2 CSS is instant under reduced-motion)
  // and announce the drawn staves on the live region.
  const stage = $('rn-stage');
  if (stage) stage.classList.add('is-staged');
  const sv = $('rn-stage-verdict');
  if (sv) sv.textContent = `${reading.method.label}: ${reading.staves.map(s => `${s.char} ${s.name}`).join(' · ')}.`;
  try { autolinkResultPanels(['rn-out']); } catch { /* non-fatal */ }
}

function methodNoteHtml(m) {
  if (m.quote) {
    return `<blockquote class="small" style="border-left:3px solid var(--gold);padding:.3rem .7rem;margin:.2rem 0">
        “${esc(m.quote)}”<br><span class="muted">— ${esc(m.quoteCite)}</span></blockquote>
      <p class="small"><b>Key phrase:</b> ${esc(m.latinKey)}</p>
      <p class="small muted"><b>The dispute (why this is a prototype, not proof):</b> ${esc(m.dispute)}</p>`;
  }
  return `<p class="small muted">${esc(reading.methodNote)}</p>`;
}

function staveCard(s, si = null) {
  const aett = AETTIR.find(a => a.num === s.aett);
  const attested = [`OE ${esc(s.attestedNames.oe)}`, s.attestedNames.no ? `ON ${esc(s.attestedNames.no)}` : null].filter(Boolean).join(' · ');
  const poems = [
    s.poems.oe ? `<p class="rn-poem"><b>Old English</b> <span class="muted">(${esc(s.poems.oe.name)})</span>: ${esc(s.poems.oe.stanzaGist)}</p>` : '',
    s.poems.no ? `<p class="rn-poem"><b>Old Norwegian</b> <span class="muted">(${esc(s.poems.no.name)})</span>: ${esc(s.poems.no.stanzaGist)}</p>` : '',
    s.poems.is ? `<p class="rn-poem"><b>Old Icelandic</b> <span class="muted">(${esc(s.poems.is.name)})</span>: ${esc(s.poems.is.stanzaGist)}</p>` : '',
    !s.hasNorse ? `<p class="rn-poem rn-nonorse muted">${esc(s.norseNote)}</p>` : '',
  ].join('');
  const contested = s.contested
    ? `<div class="rn-contested small"><b>⚑ dispute (${esc(s.contested.type)})</b> — ${esc(s.contested.note)} <span class="muted">[${esc(s.contested.cite)}]</span></div>` : '';
  const nameNote = s.nameNote ? `<p class="small muted rn-sub">Note: ${esc(s.nameNote)}</p>` : '';
  const variants = s.displayVariants
    ? `<div class="small muted rn-sub">Display variant: ${s.displayVariants.map(v => esc(v.char)).join(' ')} <span title="${esc(s.variantNote)}" style="cursor:help">ⓘ</span></div>` : '';
  const chipText = `Explain the Elder Futhark rune ${s.name} (${s.char}, transliteration ${s.translit}) drawn in the ${s.positionLabel} position of this cast — its attested rune-poem stanzas and what the modern oracle reads in it. Describe as history, never predict.`;
  const stageCls = si == null ? '' : ' stage-figure';
  const stageAttr = si == null ? '' : ` style="--stage-i:${si}"`;
  return `<div class="rn-card${stageCls}"${stageAttr}>
    <div class="rn-card-head">
      <div class="rn-char" aria-hidden="true">${s.char}</div>
      <div>
        <div class="rn-slot">${esc(s.positionLabel)}</div>
        <div class="rn-name"><b>${esc(s.name)}</b> <span class="muted">${esc(s.translit)}</span></div>
        <div class="rn-sub muted">${attested} · ætt ${s.aett}${aett ? ` (${esc(aett.name)})` : ''} · ${esc(s.etymMeaning)}</div>
        ${variants}
      </div>
    </div>
    <div class="rn-layer">
      <div class="rn-layer-label">Attested — the medieval rune poems</div>
      ${poems}
    </div>
    <div class="rn-layer rn-modern">
      <div class="rn-layer-label">Modern keyword — 20th-century construction (flagged)</div>
      <b>${esc(s.modernMeaning)}</b>
    </div>
    ${nameNote}
    ${contested}
    <div style="margin-top:.5rem">${explainChip(chipText)}</div>
  </div>`;
}

function firstClause(t) { const s = String(t || ''); const i = s.search(/[;.]/); return i > 0 ? s.slice(0, i) : s; }
function outHtml() {
  const m = reading.method;
  const q = question ? `<p><b>Question:</b> ${esc(question)}</p>` : '';
  const list = reading.staves.map(s =>
    `<li><b>${esc(s.positionLabel)}:</b> ${s.char} ${esc(s.name)} — <span class="small">attested (OE): ${esc(firstClause(s.poems.oe.stanzaGist))}</span>;
      <span class="muted small">modern keyword: ${esc(s.modernMeaning)}</span>${s.contested ? ' <span title="flagged dispute">⚑</span>' : ''}</li>`).join('');
  return `${q}
    <p class="small">${esc(m.label)} — ${m.modern ? 'a <b>modern</b> method' : 'the <b>Tacitus prototype</b>'}, ${m.drawCount} ${m.drawCount === 1 ? 'stave' : 'distinct staves'}.</p>
    <ul class="clean small">${list}</ul>
    <p class="small muted"><b>How the runes "answer":</b> ${esc(reading.note)} <span class="muted">— ${esc(reading.cite)}</span></p>`;
}

// --- reference blocks (the 24 staves, the poems, the framing) ---------------
function refCell(r) {
  const flag = r.contested ? ' <span title="flagged dispute" aria-label="flagged dispute">⚑</span>' : '';
  return `<div class="rn-ref-cell${r.contested ? ' rn-has-flag' : ''}">
    <div class="rn-ref-char" aria-hidden="true">${r.char}</div>
    <div class="small"><b>${esc(r.name)}</b>${flag}<br><span class="muted">${esc(r.translit)} · ${esc(r.etymMeaning.split('(')[0].trim())}</span></div></div>`;
}
function renderReference() {
  $('rn-aettir').innerHTML = AETTIR.map(a => {
    const cells = a.staves.map(id => refCell(RUNES.find(x => x.id === id))).join('');
    return `<div class="rn-aett"><h3>Ætt ${a.num} — ${esc(a.name)} <span class="small muted">(${esc(a.firstStave)} … ${esc(a.lastStave)})</span></h3>
      <div class="rn-ref-grid">${cells}</div>
      <p class="small muted">${esc(a.nameNote)}</p></div>`;
  }).join('');
  const cov = poemCoverageOf();
  $('rn-poems').innerHTML = POEMS.map(p => `<div style="margin-bottom:.6rem">
      <b>${esc(p.name)}</b> <span class="muted small">(${esc(p.date)}, ${p.runes} runes)</span>
      <div class="small">Covers: ${esc(p.covers)}.</div>
      <div class="small muted">Transmission: ${esc(p.transmission)} · Edition: ${esc(p.edition)}.</div></div>`).join('')
    + `<p class="small muted">Coverage (computed from the data): the Old English poem covers all <b>${cov.oe}/24</b> staves;
       the Norse poems cover <b>${cov.norse}/24</b>; exactly <b>${cov.oeOnly}</b> staves are Old-English-only
       (${cov.oeOnlyStaves.join(', ')}); <b>${cov.noPoem}</b> staves lack a medieval poem entirely — none does.</p>`;
}
function renderFraming() {
  const order = [
    ['writingSystem', 'A writing system, first'],
    ['epigraphicMagic', 'Attested magic (but not a meaning table)'],
    ['noMeaningTable', 'No rune-by-rune meaning table survives'],
    ['tacitus', 'The one detailed ancient source'],
    ['page', 'Page’s skepticism'],
    ['blankRune', 'The blank rune — excluded'],
    ['keepOut', 'Deliberately kept out'],
    ['poemsCritical', 'The poem paraphrases'],
  ];
  $('rn-framing-body').innerHTML = order.map(([k, label]) => {
    const f = FRAMING[k]; if (!f) return '';
    return `<p class="small"><b>${esc(label)}.</b> ${esc(f.text)} <span class="muted">[${esc(f.cite)}]</span></p>`;
  }).join('');
}
