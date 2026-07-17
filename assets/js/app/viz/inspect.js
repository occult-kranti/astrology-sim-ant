// ============================================================================
//  app/viz/inspect.js — ONE interaction grammar for every data figure.
//  States per element carrying data-el: rest → hot (tip) → pinned (card).
//  Document-delegated (single set of listeners). Reduced-motion safe by
//  construction: highlight is opacity-only CSS, the tip's fade is CSS-gated.
//  No requestAnimationFrame; tip/card positioned synchronously. [dataviz §2]
//  OWNERSHIP: Builder 2. DOM only; ships NO CSS (B3 owns .viz-tip / .viz-pin-card
//  / .is-hot / .has-focus). Wheel/strip/grid wirings register providers here.
// ============================================================================

const TIP_DELAY = 150, TIP_GRACE = 300, LONGPRESS = 500;

let tipEl = null, cardEl = null;
let tipTimer = null, graceTimer = null, lpTimer = null;
let hotEl = null, pinnedEl = null, lastTouchEl = null;
let inited = false;
const providers = []; // { root, tip(el), card(el) }

const esc = s => String(s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// -- provider registry --------------------------------------------------------
export function registerFigure(root, opts = {}) {
  if (!root) return;
  providers.unshift({ root, ...opts }); // newest wins on overlap
}
function providerFor(el) {
  for (const p of providers) if (p.root && p.root.contains(el)) return p;
  return null;
}

// -- element resolution -------------------------------------------------------
const inspectableOf = t => (t && t.closest ? t.closest('[data-el]') : null);
const figureRootOf = el => el && el.closest('[data-viz],.chart-wheel,.fig,[data-fig-root]');
const isCoarseOrNarrow = () =>
  (window.matchMedia && window.matchMedia('(max-width: 640px), (pointer: coarse)').matches) || window.innerWidth <= 640;

// -- shared DOM shells --------------------------------------------------------
function ensureShells() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'viz-tip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.hidden = true;
    tipEl.addEventListener('pointerenter', () => clearTimeout(graceTimer));
    tipEl.addEventListener('pointerleave', () => scheduleHide());
    document.body.appendChild(tipEl);
  }
}

// -- tip ----------------------------------------------------------------------
function tipContent(el) {
  const p = providerFor(el);
  if (p && p.tip) { const s = p.tip(el); if (s) return s; }
  if (el.dataset && el.dataset.tip) return el.dataset.tip;
  const title = el.querySelector && el.querySelector('title');
  if (title) return title.textContent;
  return el.getAttribute && el.getAttribute('aria-label');
}
function positionTip(anchor) {
  const r = anchor.getBoundingClientRect();
  tipEl.hidden = false;
  const tr = tipEl.getBoundingClientRect();
  let top = r.top - tr.height - 8;
  let above = true;
  if (top < 4) { top = r.bottom + 8; above = false; }
  let left = r.left + r.width / 2 - tr.width / 2;
  left = Math.max(4, Math.min(left, window.innerWidth - tr.width - 4));
  tipEl.style.position = 'fixed';
  tipEl.style.top = `${Math.round(top)}px`;
  tipEl.style.left = `${Math.round(left)}px`;
  tipEl.dataset.placement = above ? 'above' : 'below';
}
function showTip(el, immediate) {
  const content = tipContent(el);
  if (!content) return;
  ensureShells();
  clearTimeout(tipTimer); clearTimeout(graceTimer);
  const paint = () => {
    tipEl.innerHTML = esc(content);
    tipEl.id = 'viz-tip-live';
    if (el.setAttribute) el.setAttribute('aria-describedby', 'viz-tip-live');
    positionTip(el);
  };
  if (immediate) paint();
  else tipTimer = setTimeout(paint, TIP_DELAY);
}
function scheduleHide() {
  clearTimeout(graceTimer);
  graceTimer = setTimeout(hideTip, TIP_GRACE);
}
function hideTip() {
  clearTimeout(tipTimer);
  if (tipEl) tipEl.hidden = true;
}

// -- highlight (hot) ----------------------------------------------------------
function cssq(v) { return String(v == null ? '' : v).replace(/["\\]/g, '\\$&'); }
let hotNodes = [], hotRoots = [];
const markHot = n => { if (n && !n.classList.contains('is-hot')) { n.classList.add('is-hot'); hotNodes.push(n); } };
const markRoot = r => { if (r && !r.classList.contains('has-focus')) { r.classList.add('has-focus'); hotRoots.push(r); } };
function setHot(el) {
  if (hotEl === el) return;
  clearHot();
  hotEl = el;
  const id = el.getAttribute('data-el');
  // co-highlight every element that shares this data-el (table row ↔ figure mark)
  const twins = id ? document.querySelectorAll(`[data-el="${cssq(id)}"]`) : [el];
  twins.forEach(n => { markHot(n); markRoot(figureRootOf(n)); });
  markHot(el); markRoot(figureRootOf(el));
  // pair highlight (aspect lines ↔ planet groups)
  const pair = el.getAttribute('data-pair');
  const root = figureRootOf(el);
  if (pair && root) for (const nm of pair.split(',')) markHot(root.querySelector(`[data-el="planet-${cssq(nm)}"]`));
  // grid cross-highlight (cell ↔ its row/col headers)
  const r = el.getAttribute('data-r'), c = el.getAttribute('data-c');
  if ((r || c) && root) {
    if (r) root.querySelectorAll(`th[data-r="${cssq(r)}"]`).forEach(markHot);
    if (c) root.querySelectorAll(`th[data-c="${cssq(c)}"]`).forEach(markHot);
  }
  document.dispatchEvent(new CustomEvent('viz:hot', { detail: { el, id } }));
}
function clearHot() {
  hotNodes.forEach(n => { if (n !== pinnedEl) n.classList.remove('is-hot'); });
  hotRoots.forEach(r => r.classList.remove('has-focus'));
  hotNodes = []; hotRoots = [];
  hotEl = null;
}

// -- pin card -----------------------------------------------------------------
function buildCard(el) {
  const p = providerFor(el);
  let model = p && p.card ? p.card(el) : null;
  if (!model) model = { title: tipContent(el) || '', rows: [], glossTerms: [], plainLine: '' };
  return model;
}
function cardHtml(model) {
  const rows = (model.rows || []).map(r => `<div class="vpc-row"><span class="vpc-k">${esc(r.k)}</span><span class="vpc-v">${esc(r.v)}</span></div>`).join('');
  const gloss = (model.glossTerms || []).length
    ? `<div class="vpc-gloss">${model.glossTerms.map(t => `<a class="gloss-chip" href="pages/glossary.html#${esc(String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${esc(t)}</a>`).join('')}</div>` : '';
  const plain = model.plainLine ? `<p class="vpc-plain">${esc(model.plainLine)}</p>` : '';
  const foot = model.footer || '';
  return `<button class="vpc-close" aria-label="Close">✕</button>`
    + `<h4 class="vpc-title">${esc(model.title || '')}</h4>${rows}${plain}${gloss}${foot}`;
}
export function pin(el) {
  if (!el) return;
  const root = figureRootOf(el);
  const model = buildCard(el);
  const id = el.getAttribute('data-el');
  // drawer-standard pages mirror into their drawer instead of a floating card
  document.dispatchEvent(new CustomEvent('viz:pin', { detail: { fig: root, el, id, model }, bubbles: true }));
  unpinCard();
  if (document.querySelector('[data-viz-drawer]')) { markPinned(el); return; }

  const inline = isCoarseOrNarrow();
  cardEl = document.createElement('div');
  cardEl.className = inline ? 'viz-pin-card viz-pin-card--inline' : 'viz-pin-card';
  cardEl.setAttribute('role', 'dialog');
  cardEl.setAttribute('aria-label', model.title || 'Details');
  cardEl.innerHTML = cardHtml(model);
  cardEl.querySelector('.vpc-close').addEventListener('click', () => { const t = pinnedEl; unpin(); focusBack(t); });

  if (inline) {
    const host = (root && root.closest('.fig')) || root || el.parentElement;
    (host || document.body).insertAdjacentElement('afterend', cardEl);
  } else {
    document.body.appendChild(cardEl);
    positionCard(el);
  }
  markPinned(el);
}
function positionCard(anchor) {
  const r = anchor.getBoundingClientRect();
  const cr = cardEl.getBoundingClientRect();
  let top = r.bottom + 8;
  if (top + cr.height > window.innerHeight - 4) top = Math.max(4, r.top - cr.height - 8);
  let left = Math.max(4, Math.min(r.left, window.innerWidth - cr.width - 4));
  cardEl.style.position = 'fixed';
  cardEl.style.top = `${Math.round(top)}px`;
  cardEl.style.left = `${Math.round(left)}px`;
}
function markPinned(el) {
  if (pinnedEl && pinnedEl !== el) { pinnedEl.setAttribute('aria-expanded', 'false'); pinnedEl.classList.remove('is-pinned'); }
  pinnedEl = el;
  if (el.setAttribute) el.setAttribute('aria-expanded', 'true');
  el.classList.add('is-hot', 'is-pinned');
}
function unpinCard() { if (cardEl) { cardEl.remove(); cardEl = null; } }
export function unpin() {
  unpinCard();
  if (pinnedEl) {
    pinnedEl.setAttribute('aria-expanded', 'false');
    pinnedEl.classList.remove('is-pinned', 'is-hot');
    pinnedEl = null;
  }
  document.dispatchEvent(new CustomEvent('viz:unpin', { bubbles: true }));
  hideTip();
}
function focusBack(el) { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch { el.focus(); } } }

// -- delegated listeners ------------------------------------------------------
export function initInspect() {
  if (inited) return; inited = true;
  ensureShells();

  document.addEventListener('pointerover', e => {
    if (e.pointerType === 'touch') return;
    const el = inspectableOf(e.target);
    if (!el) return;
    setHot(el); showTip(el, false);
  });
  document.addEventListener('pointerout', e => {
    if (e.pointerType === 'touch') return;
    const el = inspectableOf(e.target);
    if (!el) return;
    if (!el.contains(e.relatedTarget)) { scheduleHide(); if (el !== pinnedEl) { el.classList.remove('is-hot'); if (hotEl === el) clearHot(); } }
  });
  document.addEventListener('focusin', e => {
    const el = inspectableOf(e.target);
    if (!el) return;
    setHot(el); showTip(el, true);
  });
  document.addEventListener('focusout', e => {
    const el = inspectableOf(e.target);
    if (el && el !== pinnedEl) { el.classList.remove('is-hot'); if (hotEl === el) clearHot(); hideTip(); }
  });
  document.addEventListener('click', e => {
    const el = inspectableOf(e.target);
    if (!el) return;
    if (el.tagName === 'A') return; // real links (gloss chips) act normally
    e.preventDefault();
    if (pinnedEl === el) { unpin(); return; }
    pin(el);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (pinnedEl) { const el = pinnedEl; unpin(); focusBack(el); } else hideTip(); return; }
    const el = inspectableOf(e.target);
    if (!el) return;
    if ((e.key === 'Enter' || e.key === ' ') && el.getAttribute('tabindex') != null) {
      e.preventDefault();
      if (pinnedEl === el) unpin(); else pin(el);
    }
  });
  // touch: tap = hover; second tap on same el = pin; long-press 500ms = pin
  document.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    const el = inspectableOf(e.target);
    if (!el) return;
    clearTimeout(lpTimer);
    lpTimer = setTimeout(() => { lastTouchEl = 'pinned'; pin(el); }, LONGPRESS);
  }, { passive: true });
  document.addEventListener('pointerup', e => {
    if (e.pointerType !== 'touch') return;
    clearTimeout(lpTimer);
    const el = inspectableOf(e.target);
    if (!el) return;
    if (lastTouchEl === 'pinned') { lastTouchEl = null; return; }
    e.preventDefault();
    if (lastTouchEl === el) { pin(el); lastTouchEl = null; }
    else { setHot(el); showTip(el, true); lastTouchEl = el; }
  });
  window.addEventListener('resize', () => { if (cardEl && pinnedEl && !cardEl.classList.contains('viz-pin-card--inline')) positionCard(pinnedEl); });
}

// auto-init when imported in a browser
if (typeof document !== 'undefined') initInspect();
