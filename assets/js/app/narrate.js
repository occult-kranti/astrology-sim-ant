// ============================================================================
//  app/narrate.js — "Read this chart aloud", the guided-reading control.
//  DOM only (app layer). Renders a "🔊 Read this chart aloud ▶" toggle under the
//  chart wheel; opening it reveals a numbered rail of steps (from the PURE
//  core/explain/narrate.js sequence). Stepping through the rail lights the
//  matching wheel element via its `data-el` stamp (opacity only — the others dim
//  to context; reduced-motion safe) and reveals each step's attributed sentence.
//
//  Interaction: click a step, or use the ◀ / ▶ controls, or Arrow keys; Esc
//  closes and returns focus to the toggle. The full numbered list is ALWAYS in the
//  rail, so mobile, print and reduced-motion get the static "aloud" script with no
//  highlighting required (Datawrapper's numbered-annotation fallback).
//
//  Motion law: NO requestAnimationFrame here — the only movement is native
//  `scrollIntoView`, gated by motionOK() from the motion conductor (app/motion.js).
//  All colour/spacing via DS2 tokens; style.css is untouched (page-scoped <style>).
// ============================================================================
import { motionOK } from './motion.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const asArray = el => (Array.isArray(el) ? el : (el == null ? [] : [el]));

let cssInjected = false;
function ensureCSS() {
  if (cssInjected || document.getElementById('narrate-css')) { cssInjected = true; return; }
  cssInjected = true;
  const s = document.createElement('style');
  s.id = 'narrate-css';
  s.textContent = `
  .narrate { margin: var(--sp-3) 0; }
  .narrate-rail[hidden] { display: none; }
  .narrate-rail { margin-top: var(--sp-2); border: 1px solid var(--border);
    border-radius: var(--rad-2); background: var(--surface-card); padding: var(--sp-3); }
  .narrate-head { display: flex; align-items: center; justify-content: space-between;
    gap: var(--sp-2); flex-wrap: wrap; }
  .narrate-head .nr-title { font-family: var(--font-sans); font-weight: 700;
    color: var(--text); }
  .narrate-controls { display: inline-flex; align-items: center; gap: var(--sp-1); }
  .narrate-counter { font-family: var(--font-sans); font-size: var(--fs--1);
    color: var(--text-muted); min-width: 3.4em; text-align: center; }
  .narrate-live { margin: var(--sp-2) 0 0; color: var(--text-muted);
    font-size: var(--fs--1); }
  .narrate-steps { list-style: none; counter-reset: nstep; margin: var(--sp-2) 0 0; padding: 0; }
  .narrate-steps li { margin: 0; }
  .narrate-step { counter-increment: nstep; display: block; width: 100%; text-align: left;
    background: transparent; border: 1px solid transparent; border-left: 3px solid transparent;
    border-radius: var(--rad-1); padding: var(--sp-2) var(--sp-3); margin: var(--sp-1) 0;
    color: var(--text-soft); cursor: pointer; font: inherit; }
  .narrate-step:hover { background: var(--surface-wash); }
  .narrate-step:focus-visible { outline: 2px solid var(--focus); outline-offset: 1px; }
  .narrate-step .ns-n { font-family: var(--font-sans); font-weight: 700;
    color: var(--accent); margin-right: .4rem; }
  .narrate-step .ns-n::before { content: counter(nstep) ". "; }
  .narrate-step .ns-title { font-weight: 700; color: var(--text); }
  .narrate-step .ns-say { color: var(--text-soft); }
  .narrate-step.narrate-current { background: var(--surface-wash);
    border-color: var(--border); border-left-color: var(--accent); }
  /* wheel focus+context: dim the data-bearing marks, lift the lit step's marks */
  .chart-wheel.narrate-active [data-el] { opacity: .35; }
  .chart-wheel.narrate-active [data-el].narrate-lit { opacity: 1; }
  @media (prefers-reduced-motion: no-preference) {
    .chart-wheel.narrate-active [data-el] { transition: opacity .18s ease; }
  }
  @media print {
    .narrate-toggle, .narrate-controls, .narrate-live { display: none !important; }
    .narrate-rail { display: block !important; border: none; padding: 0; }
    .narrate-step { break-inside: avoid; }
  }`;
  (document.head || document.documentElement).appendChild(s);
}

// ---------------------------------------------------------------------------
//  renderNarrate(mountEl, steps, opts)
//    mountEl  : the persistent container to (re)render into (innerHTML wholesale).
//    steps    : the core/explain/narrate.js sequence [{ el, title, say }].
//    opts.wheelEl : the element that CONTAINS the .chart-wheel <svg> (for lighting).
//  Idempotent per compute; resets to the collapsed state each call.
// ---------------------------------------------------------------------------
export function renderNarrate(mountEl, steps, opts = {}) {
  if (!mountEl) return;
  ensureCSS();
  const list = Array.isArray(steps) ? steps.filter(s => s && s.title) : [];
  if (!list.length) { mountEl.innerHTML = ''; return; }
  const wheelEl = opts.wheelEl || null;
  const n = list.length;

  const stepsHTML = list.map((s, i) =>
    `<li><button type="button" class="narrate-step" data-i="${i}">` +
    `<span class="ns-n" aria-hidden="true"></span>` +
    `<span class="ns-title">${esc(s.title)}</span> ` +
    `<span class="ns-say">— ${esc(s.say)}</span></button></li>`).join('');

  mountEl.innerHTML =
    `<div class="narrate">
      <button type="button" class="btn-secondary sm narrate-toggle" aria-expanded="false">🔊 Read this chart aloud ▶</button>
      <section class="narrate-rail" hidden aria-label="Read this chart aloud — a guided reading">
        <div class="narrate-head">
          <span class="nr-title">Read this chart aloud</span>
          <span class="narrate-controls">
            <button type="button" class="btn-secondary sm nr-prev" aria-label="Previous step">◀</button>
            <span class="narrate-counter" aria-hidden="true">1 / ${n}</span>
            <button type="button" class="btn-secondary sm nr-next" aria-label="Next step">▶</button>
            <button type="button" class="btn-secondary sm nr-close" aria-label="Close the reading">Esc</button>
          </span>
        </div>
        <p class="narrate-live" role="status" aria-live="polite"></p>
        <ol class="narrate-steps">${stepsHTML}</ol>
      </section>
    </div>`;

  const toggle = mountEl.querySelector('.narrate-toggle');
  const rail = mountEl.querySelector('.narrate-rail');
  const counter = mountEl.querySelector('.narrate-counter');
  const live = mountEl.querySelector('.narrate-live');
  const stepBtns = Array.from(mountEl.querySelectorAll('.narrate-step'));
  let idx = -1;

  const wheelSvg = () => (wheelEl && wheelEl.querySelector ? wheelEl.querySelector('.chart-wheel') : null);

  function clearLit() {
    const svg = wheelSvg(); if (!svg) return;
    svg.classList.remove('narrate-active');
    svg.querySelectorAll('.narrate-lit').forEach(el => el.classList.remove('narrate-lit'));
  }
  function lightStep(step) {
    const svg = wheelSvg(); if (!svg) return;
    svg.classList.add('narrate-active');
    svg.querySelectorAll('.narrate-lit').forEach(el => el.classList.remove('narrate-lit'));
    for (const id of asArray(step.el)) {
      if (!id) continue;
      svg.querySelectorAll(`[data-el="${id}"]`).forEach(el => el.classList.add('narrate-lit'));
    }
  }

  function select(i, moveFocus) {
    if (!list.length) return;
    idx = Math.max(0, Math.min(n - 1, i));
    stepBtns.forEach((b, k) => b.classList.toggle('narrate-current', k === idx));
    if (counter) counter.textContent = `${idx + 1} / ${n}`;
    if (live) live.textContent = `Step ${idx + 1} of ${n}: ${list[idx].title}.`;
    lightStep(list[idx]);
    const btn = stepBtns[idx];
    if (btn) {
      if (moveFocus) btn.focus();
      try { btn.scrollIntoView({ block: 'nearest', behavior: motionOK() ? 'smooth' : 'auto' }); } catch { /* non-fatal */ }
    }
  }

  function open() {
    rail.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    select(0, true);
  }
  function close(refocus) {
    rail.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    idx = -1;
    stepBtns.forEach(b => b.classList.remove('narrate-current'));
    clearLit();
    if (refocus !== false) { try { toggle.focus(); } catch { /* non-fatal */ } }
  }

  toggle.addEventListener('click', () => { if (rail.hidden) open(); else close(); });
  mountEl.querySelector('.nr-prev').addEventListener('click', () => select(idx - 1, true));
  mountEl.querySelector('.nr-next').addEventListener('click', () => select(idx + 1, true));
  mountEl.querySelector('.nr-close').addEventListener('click', () => close());

  stepBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => select(i, false));
    btn.addEventListener('focus', () => { if (i !== idx) select(i, false); });
    // hover previews the step's lighting without disturbing the selected step
    btn.addEventListener('mouseenter', () => { if (!rail.hidden) lightStep(list[i]); });
    btn.addEventListener('mouseleave', () => { if (!rail.hidden && idx >= 0) lightStep(list[idx]); });
  });

  rail.addEventListener('keydown', e => {
    switch (e.key) {
      case 'Escape': e.preventDefault(); close(); break;
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); select(idx + 1, true); break;
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); select(idx - 1, true); break;
      case 'Home': e.preventDefault(); select(0, true); break;
      case 'End': e.preventDefault(); select(n - 1, true); break;
      default: break;
    }
  });
}

export default renderNarrate;
