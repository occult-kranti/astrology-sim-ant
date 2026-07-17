// ============================================================================
//  app/glosstip.js — hover / tap glossary POPOVERS riding the existing 247-term
//  glossary (core/data/glossary.js) and the autolinker's `.gloss-link` anchors
//  plus the explain-block `.term-chip` buttons. Fixes chart-ux.md §5:
//    F-NAV-AWAY  — the term is disclosed IN PLACE, not by navigating to the page;
//    F-TABLE-GLOSS — position:fixed escapes `.table-scroll` overflow clipping, so
//                    terms inside scrolling tables can be popovered safely;
//    F-TITLE-ONLY — replaces load-bearing `title=` tooltips (touch/SR-invisible).
//
//  Semantics (WAI-ARIA):
//    • `.gloss-link` (an anchor)  — TOOLTIP on hover/focus; first tap/click opens
//      the popover (preventDefault) which carries a "full glossary entry ↗" link,
//      a second tap follows it. role="tooltip", aria-describedby wiring.
//    • `.term-chip` (a button, ⓘ) — TOGGLETIP: click toggles; hover/focus previews.
//    • Esc closes and returns focus to the trigger; focus is never trapped.
//  Reduced-motion-first (no transitions); popovers never print. One delegated
//  listener set on document — O(1), idempotent, safe to call on every page.
// ============================================================================
import { GLOSSARY } from '../core/data/glossary.js';
import { slugTerm } from './autolink.js';
import { ROOT } from './shared.js';

const SHOW_DELAY = 150;
const GLOSS_HREF = `${ROOT}/pages/glossary.html`;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// slug → glossary entry, built once.
const BY_SLUG = new Map();
for (const g of GLOSSARY) BY_SLUG.set(slugTerm(g.term), g);

let started = false;
let pop = null;            // the single reused popover element
let currentTrigger = null; // the element the popover currently describes
let pinned = false;        // opened by click (stays until dismissed)
let showTimer = 0;

function ensureCSS() {
  if (document.getElementById('glosstip-css')) return;
  const s = document.createElement('style');
  s.id = 'glosstip-css';
  s.textContent = `
  .glosstip { position: fixed; z-index: 9999; max-width: 34ch; margin: 0;
    background: var(--surface-card); color: var(--text);
    border: 1px solid var(--border-strong); border-radius: var(--rad-2);
    box-shadow: var(--shadow-2); padding: var(--sp-3); font-size: var(--fs--1);
    line-height: 1.4; pointer-events: auto; }
  .glosstip[hidden] { display: none; }
  .glosstip .gt-term { font-weight: 700; }
  .glosstip .gt-cat { font-family: var(--font-sans); font-size: var(--fs-badge);
    text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted);
    border: 1px solid var(--border); border-radius: var(--rad-1);
    padding: .05rem .35rem; margin-left: .35rem; vertical-align: middle; }
  .glosstip .gt-def { margin: var(--sp-2) 0 var(--sp-2); color: var(--text-soft); }
  .glosstip .gt-more { font-family: var(--font-sans); font-size: var(--fs--1);
    color: var(--accent-strong); text-decoration: none; }
  .glosstip .gt-more:hover { text-decoration: underline; }
  @media print { .glosstip { display: none !important; } }
  `;
  (document.head || document.documentElement).appendChild(s);
}

function ensurePop() {
  if (pop) return pop;
  pop = document.createElement('div');
  pop.className = 'glosstip';
  pop.id = 'glosstip-pop';
  pop.setAttribute('role', 'tooltip');
  pop.hidden = true;
  // hovering onto the popover keeps it open (so the ↗ link is clickable)
  pop.addEventListener('pointerenter', () => { if (showTimer) { clearTimeout(showTimer); showTimer = 0; } });
  pop.addEventListener('pointerleave', () => { if (!pinned) hide(); });
  document.body.appendChild(pop);
  return pop;
}

// Is this element a glosstip trigger? Return the trigger element or null.
function triggerOf(node) {
  if (!node || !node.closest) return null;
  return node.closest('.gloss-link, .term-chip, .gloss-tip-trigger');
}

// Resolve a trigger to its glossary entry + the deep-link href.
function resolve(el) {
  let slug = el.getAttribute('data-slug');
  if (!slug) {
    const href = el.getAttribute('data-href') || el.getAttribute('href') || '';
    const hash = href.split('#')[1];
    if (hash) slug = hash;
  }
  if (!slug) slug = slugTerm(el.textContent || '');
  const entry = BY_SLUG.get(slug) || null;
  const href = el.getAttribute('data-href')
    || (el.getAttribute('href') && el.getAttribute('href').includes('#') ? el.getAttribute('href') : `${GLOSS_HREF}#${slug}`)
    || `${GLOSS_HREF}#${slug}`;
  return { slug, entry, href };
}

function fill(entry, href) {
  ensurePop();
  pop.innerHTML =
    `<span class="gt-term">${esc(entry.term)}</span>`
    + (entry.cat ? `<span class="gt-cat">${esc(entry.cat)}</span>` : '')
    + `<p class="gt-def">${esc(entry.def)}</p>`
    + `<a class="gt-more" href="${esc(href)}">full glossary entry ↗</a>`;
}

// Place the popover near the trigger: below by default, flipped above with no
// room; clamped into the viewport. position:fixed → rects are viewport-relative.
function place(el) {
  const r = el.getBoundingClientRect();
  pop.hidden = false;                 // must be visible to measure
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight, gap = 8;
  let top = r.bottom + gap;
  if (top + ph > vh - 4 && r.top - gap - ph > 4) top = r.top - gap - ph; // flip up
  top = Math.max(4, Math.min(top, vh - ph - 4));
  let left = r.left;
  left = Math.max(4, Math.min(left, vw - pw - 4));
  pop.style.top = `${Math.round(top)}px`;
  pop.style.left = `${Math.round(left)}px`;
}

function show(el, asPinned) {
  const { entry, href } = resolve(el);
  if (!entry) return;
  ensurePop();
  currentTrigger = el;
  pinned = !!asPinned;
  fill(entry, href);
  place(el);
  el.setAttribute('aria-describedby', 'glosstip-pop');
}

function hide() {
  if (showTimer) { clearTimeout(showTimer); showTimer = 0; }
  if (pop) pop.hidden = true;
  if (currentTrigger) currentTrigger.removeAttribute('aria-describedby');
  currentTrigger = null; pinned = false;
}

function scheduleShow(el) {
  if (showTimer) clearTimeout(showTimer);
  showTimer = setTimeout(() => { showTimer = 0; if (!pinned) show(el, false); }, SHOW_DELAY);
}

export function initGlosstip() {
  if (started) return; started = true;
  ensureCSS();

  // hover / focus preview (tooltip)
  document.addEventListener('pointerover', e => {
    const t = triggerOf(e.target); if (!t) return;
    if (pinned && currentTrigger === t) return;
    if (pinned) return;              // a pinned popover owns the screen until dismissed
    scheduleShow(t);
  });
  document.addEventListener('pointerout', e => {
    const t = triggerOf(e.target); if (!t) return;
    // ignore moves INTO the popover (pointerenter on pop keeps it open)
    const to = e.relatedTarget;
    if (to && (to === pop || (pop && pop.contains(to)))) return;
    if (!pinned) hide();
  });
  document.addEventListener('focusin', e => {
    const t = triggerOf(e.target); if (!t) return;
    show(t, false);
  });
  document.addEventListener('focusout', e => {
    const t = triggerOf(e.target); if (!t) return;
    if (!pinned) setTimeout(() => { if (currentTrigger === t) hide(); }, 0);
  });

  // click / tap — toggletip on chips; first-tap-then-navigate on gloss-links
  document.addEventListener('click', e => {
    const t = triggerOf(e.target);
    if (!t) { if (!e.target.closest || !e.target.closest('.glosstip')) hide(); return; }
    // Only intercept triggers that actually resolve to a glossary entry — some
    // `.gloss-link` anchors are non-glossary (e.g. the saved-readings restore
    // links) and must keep their own click behaviour untouched.
    if (!resolve(t).entry) return;
    const isLink = t.classList.contains('gloss-link') && t.tagName === 'A';
    if (isLink) {
      // first tap: reveal the popover in place; a second tap follows the link.
      if (!(pinned && currentTrigger === t)) { e.preventDefault(); show(t, true); }
      return;                        // (second tap: default navigation proceeds)
    }
    // chips / buttons: toggle
    e.preventDefault();
    if (pinned && currentTrigger === t) hide();
    else show(t, true);
  });

  // Esc closes and restores focus to the trigger; scroll/resize dismiss (fixed
  // popovers would otherwise drift away from their anchor).
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && currentTrigger) { const t = currentTrigger; hide(); try { t.focus(); } catch { /* */ } }
  });
  window.addEventListener('scroll', () => { if (pop && !pop.hidden) hide(); }, true);
  window.addEventListener('resize', () => { if (pop && !pop.hidden) hide(); });
}

export default { initGlosstip };
