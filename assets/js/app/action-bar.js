// ============================================================================
//  action-bar.js — the sticky results action bar + computeFlow (flow §2.4–2.5,
//  D5). Long results carry their actions; the compute moment gets a
//  choreography that moves the viewport to the verdict WITHOUT animating the
//  information itself (D5: the .reveal-seq stagger is CUT — results are truth,
//  they appear instantly and in final position).
//
//  Site law: no requestAnimationFrame outside motion.js. The paint-yield in
//  computeFlow is scheduled on the shared motion conductor (motion.js owns the
//  one rAF), never a bare rAF here.
// ============================================================================

import { getConductor, motionOK } from './motion.js';

// ---------------------------------------------------------------------------
//  computeFlow(btn, statusEl, fn, { banner, firstPanel })
//  press → busy paints one frame → synchronous compute → verdict banner is
//  focused (role=status already speaks it) → scrollIntoView (smooth only under
//  motion) → done. Failure: busy cleared, status carries the error, banner
//  stays hidden. Returns a Promise that resolves after the reveal.
// ---------------------------------------------------------------------------
export function computeFlow(btn, statusEl, fn, { banner, firstPanel } = {}) {
  const busyMsg = 'Computing…';
  if (btn) { btn.classList.add('btn-busy'); btn.setAttribute('aria-busy', 'true'); btn.disabled = true; }
  if (statusEl) statusEl.textContent = busyMsg;

  return new Promise(resolve => {
    let frame = 0;
    const finish = (ok, err) => {
      if (btn) { btn.classList.remove('btn-busy'); btn.removeAttribute('aria-busy'); btn.disabled = false; }
      if (!ok) {
        if (statusEl) statusEl.textContent = (err && err.message) ? `Could not compute: ${err.message}` : 'Could not compute the reading.';
        try { if (typeof console !== 'undefined') console.error('[computeFlow]', err); } catch (e) { /* */ }
        resolve({ ok: false, error: err });
        return;
      }
      const target = (banner && !banner.hidden) ? banner : (firstPanel || null);
      if (target) {
        try {
          if (target.tabIndex === undefined || target.tabIndex < 0) target.tabIndex = -1;
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' });
        } catch (e) { /* non-fatal */ }
      }
      if (statusEl && statusEl.textContent === busyMsg) statusEl.textContent = '';
      resolve({ ok: true });
    };
    // one skipped frame lets the busy state paint before the (synchronous) work
    getConductor().add(() => {
      if (frame++ < 1) return true;
      try { fn(); } catch (e) { finish(false, e); return false; }
      finish(true); return false;
    });
  });
}

// ---------------------------------------------------------------------------
//  mountActionBar(host, opts) → { el, show(reading), hide() }
//  opts:
//    variant:      'tool' (Export ▾ menu) | 'oracle' (explicit action buttons)
//    exports:      [{ id, label }]  → items inside the Export ▾ menu (ids kept
//                  so the host re-wires the SAME handlers by id)
//    oracleActions:[{ id, label }]  → buttons rendered inline (oracle variant)
//    copyLinkId:   string  → renders a "Copy link" button with that id
//    askAI:        fn      → renders "✶ Ask the AI"; hidden when absent
//    summary:      (reading) => { verdict, text }  → fills the chip + one-liner
//    top:          boolean (default true) → renders the "↑ Top" button
// ---------------------------------------------------------------------------
export function mountActionBar(host, opts = {}) {
  if (!host) return null;
  const { variant = 'tool', exports = [], oracleActions = [], copyLinkId, askAI, summary, top = true } = opts;

  const menuItems = exports.map(e => `<button type="button" role="menuitem" class="btn-quiet sm ab-menu-item" id="${e.id}">${e.label}</button>`).join('');
  const oracleBtns = oracleActions.map(a => `<button type="button" class="btn-secondary sm" id="${a.id}">${a.label}</button>`).join('');

  host.innerHTML = `<div class="action-bar" role="region" aria-label="Reading actions" hidden>
    <span class="ab-chip badge" hidden></span>
    <span class="ab-sum small muted"></span>
    <span class="ab-spacer"></span>
    ${variant === 'tool' && exports.length ? `<span class="ab-menu-wrap">
      <button type="button" class="btn-quiet sm ab-menu-btn" aria-haspopup="true" aria-expanded="false">Export <span aria-hidden="true">▾</span></button>
      <span class="ab-menu" role="menu" hidden>${menuItems}</span></span>` : ''}
    ${oracleBtns}
    ${copyLinkId ? `<button type="button" class="btn-quiet sm" id="${copyLinkId}">Copy link</button>` : ''}
    ${askAI ? `<button type="button" class="btn-quiet sm ab-ai" data-ab-ai>✶ Ask the AI</button>` : ''}
    ${top ? `<button type="button" class="btn-quiet sm ab-top" aria-label="Back to top">↑ Top</button>` : ''}
  </div>`;

  const barEl = host.querySelector('.action-bar');
  const chip = barEl.querySelector('.ab-chip');
  const sumEl = barEl.querySelector('.ab-sum');

  // Export ▾ disclosure menu
  const menuBtn = barEl.querySelector('.ab-menu-btn');
  const menu = barEl.querySelector('.ab-menu');
  if (menuBtn && menu) {
    const openMenu = open => { menu.hidden = !open; menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { const first = menu.querySelector('button'); if (first) first.focus(); } };
    menuBtn.addEventListener('click', e => { e.stopPropagation(); openMenu(menu.hidden); });
    menuBtn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(true); } });
    menu.addEventListener('keydown', e => {
      const items = Array.from(menu.querySelectorAll('button'));
      const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); openMenu(false); menuBtn.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
    menu.addEventListener('click', () => openMenu(false));   // any export closes it
    document.addEventListener('click', e => { if (!barEl.contains(e.target)) openMenu(false); });
  }

  // ✶ Ask the AI
  const aiBtn = barEl.querySelector('[data-ab-ai]');
  if (aiBtn && askAI) aiBtn.addEventListener('click', askAI);

  // ↑ Top
  const topBtn = barEl.querySelector('.ab-top');
  if (topBtn) topBtn.addEventListener('click', () => { try { window.scrollTo({ top: 0, behavior: motionOK() ? 'smooth' : 'auto' }); } catch (e) { window.scrollTo(0, 0); } });

  // hide the bar while an assistant textarea is focused (self-contained; the
  // action bar and a bottom chat input must not fight at 390 px — flow risk 6).
  let shown = false, typing = false;
  const applyVis = () => { barEl.hidden = !shown || typing; barEl.classList.toggle('ab-typing', typing); };
  document.addEventListener('focusin', e => { if (e.target && e.target.tagName === 'TEXTAREA') { typing = true; applyVis(); } });
  document.addEventListener('focusout', e => { if (e.target && e.target.tagName === 'TEXTAREA') { typing = false; applyVis(); } });

  return {
    el: barEl,
    show(reading) {
      shown = true;
      if (summary) {
        try {
          const s = summary(reading) || {};
          const v = s.verdict || s.label || '';
          if (v) { chip.textContent = v; chip.hidden = false; chip.className = 'ab-chip badge' + (s.verdictClass ? ' ' + s.verdictClass : ''); }
          else chip.hidden = true;
          sumEl.textContent = s.text || '';
        } catch (e) { /* non-fatal */ }
      }
      applyVis();
    },
    hide() { shown = false; applyVis(); },
  };
}
