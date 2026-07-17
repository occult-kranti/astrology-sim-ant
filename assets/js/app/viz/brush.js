// ============================================================================
//  app/viz/brush.js — brush-zoom + crosshair for every period strip. Direct
//  manipulation only: NO requestAnimationFrame (pointermove writes are already
//  frame-coalesced by the browser), so nothing runs at rest and reduced motion
//  needs no special path. Emits viz:zoom; the HOST re-renders (semantic zoom, so
//  labels re-gate at every scale). [dataviz §4.2–4.3]
//  OWNERSHIP: Builder 2. DOM only; ships NO CSS (B3 owns .viz-brush / .viz-zoombar
//  / .viz-tip). No motion dependency.
// ============================================================================

const GUTTER = 90, PAD = 8, MIN_BRUSH = 24; // px0=GUTTER, px1=vbWidth-PAD (timeline-svg)
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtT = t => { const d = new Date(t); return `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function stripOf(root) { return root.matches && root.matches('[data-viz="period-strip"]') ? root : root.querySelector('[data-viz="period-strip"]'); }
function vbWidth(svg) { const vb = (svg.getAttribute('viewBox') || '0 0 960 60').split(/\s+/); return parseFloat(vb[2]) || 960; }
function domainOf(svg) { const d = (svg.getAttribute('data-domain') || '0,1').split(','); return [Number(d[0]), Number(d[1])]; }

// screen X → time, through the plot band [GUTTER, vbWidth-PAD]
function timeAt(svg, screenX) {
  const rect = svg.getBoundingClientRect();
  const scale = rect.width / vbWidth(svg);
  const svgX = (screenX - rect.left) / scale;
  const px0 = GUTTER, px1 = vbWidth(svg) - PAD;
  const frac = Math.max(0, Math.min(1, (svgX - px0) / (px1 - px0)));
  const [t0, t1] = domainOf(svg);
  return t0 + frac * (t1 - t0);
}

// initBrush(root) — root is the .fig / container holding a period strip.
export function initBrush(root) {
  const svg = stripOf(root);
  if (!svg || svg._brushed) return;
  svg._brushed = true;
  if (!svg.dataset.domainOrig) svg.dataset.domainOrig = svg.getAttribute('data-domain');

  const container = root.closest('.fig') || root;
  const live = ensureLive(container);
  let brushDiv = null, startX = 0, dragging = false;

  const emitZoom = (t0, t1) => {
    container.dispatchEvent(new CustomEvent('viz:zoom', { detail: { t0, t1 }, bubbles: true }));
    live.textContent = `Showing ${fmtT(t0)} to ${fmtT(t1)}`;
    syncZoombar(container, svg, [t0, t1]);
  };

  // -- pointer brush (shift anywhere, or drag on the lower axis band) ----------
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && !e.shiftKey) {
      // touch: only the axis band brushes; lanes scroll the page normally
      const rect = svg.getBoundingClientRect();
      if ((e.clientY - rect.top) / rect.height < 0.72) return;
    }
    dragging = true; startX = e.clientX;
    try { svg.setPointerCapture(e.pointerId); } catch { /* no active pointer (e.g. synthetic events) */ }
    brushDiv = document.createElement('div');
    brushDiv.className = 'viz-brush';
    brushDiv.style.position = 'fixed';
    const rect = svg.getBoundingClientRect();
    brushDiv.style.top = `${rect.top}px`;
    brushDiv.style.height = `${rect.height}px`;
    brushDiv.style.left = `${startX}px`;
    brushDiv.style.width = '0px';
    document.body.appendChild(brushDiv);
    e.preventDefault();
  });
  svg.addEventListener('pointermove', e => {
    if (!dragging || !brushDiv) return;
    const x0 = Math.min(startX, e.clientX), x1 = Math.max(startX, e.clientX);
    brushDiv.style.left = `${x0}px`;
    brushDiv.style.width = `${x1 - x0}px`;
  });
  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    const w = Math.abs(e.clientX - startX);
    const a = timeAt(svg, Math.min(startX, e.clientX)), b = timeAt(svg, Math.max(startX, e.clientX));
    if (brushDiv) { brushDiv.remove(); brushDiv = null; }
    if (w >= MIN_BRUSH && b > a) emitZoom(a, b);
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  // -- double-click a segment → zoom to its span ------------------------------
  svg.addEventListener('dblclick', e => {
    const seg = e.target.closest('[data-t0][data-t1]');
    if (!seg) return;
    emitZoom(Date.parse(seg.getAttribute('data-t0') + 'T00:00:00Z'), Date.parse(seg.getAttribute('data-t1') + 'T00:00:00Z'));
  });

  // -- keyboard: +/− zoom ×2, ←/→ pan 10%, Home reset -------------------------
  container.addEventListener('keydown', e => {
    if (!container.contains(document.activeElement)) return;
    const [t0, t1] = domainOf(svg); const span = t1 - t0; const mid = (t0 + t1) / 2;
    const [o0, o1] = svg.dataset.domainOrig.split(',').map(Number);
    if (e.key === '+' || e.key === '=') { e.preventDefault(); emitZoom(mid - span / 4, mid + span / 4); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); emitZoom(Math.max(o0, mid - span), Math.min(o1, mid + span)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); const d = -span * 0.1; emitZoom(Math.max(o0, t0 + d), Math.max(o0, t0 + d) + span); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); const d = span * 0.1; emitZoom(Math.min(o1 - span, t0 + d), Math.min(o1 - span, t0 + d) + span); }
    else if (e.key === 'Home') { e.preventDefault(); emitZoom(o0, o1); }
  });

  // -- crosshair (opt-in via data-crosshair) ----------------------------------
  if (svg.hasAttribute('data-crosshair')) initCrosshair(svg, container, live);
}

function ensureLive(container) {
  let live = container.querySelector('.viz-live');
  if (!live) {
    live = document.createElement('div');
    live.className = 'viz-live';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('role', 'status');
    live.style.cssText = 'position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden';
    container.appendChild(live);
  }
  return live;
}

function syncZoombar(container, svg, dom) {
  const [o0, o1] = svg.dataset.domainOrig.split(',').map(Number);
  const zoomed = dom[0] > o0 + 1 || dom[1] < o1 - 1;
  let bar = container.querySelector('.viz-zoombar');
  if (!zoomed) { if (bar) bar.remove(); return; }
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'viz-zoombar';
    bar.innerHTML = `<button type="button" class="btn-secondary sm zb-out" aria-label="Zoom out">− out</button>`
      + `<button type="button" class="btn-secondary sm zb-reset" aria-label="Reset zoom">⟲ reset</button>`
      + `<button type="button" class="btn-secondary sm zb-in" aria-label="Zoom in">+ in</button>`
      + `<span class="zb-readout"></span>`;
    const anchor = container.querySelector('.fig-body') || container.firstChild;
    (anchor || container).insertAdjacentElement('afterend', bar);
    const zoom = (f) => {
      const [t0, t1] = svg.getAttribute('data-domain').split(',').map(Number);
      const span = t1 - t0, mid = (t0 + t1) / 2;
      const [oo0, oo1] = svg.dataset.domainOrig.split(',').map(Number);
      const ns = f === 0 ? (oo1 - oo0) : span * f;
      let a = f === 0 ? oo0 : mid - ns / 2, b = f === 0 ? oo1 : mid + ns / 2;
      a = Math.max(oo0, a); b = Math.min(oo1, b);
      container.dispatchEvent(new CustomEvent('viz:zoom', { detail: { t0: a, t1: b }, bubbles: true }));
    };
    bar.querySelector('.zb-in').addEventListener('click', () => zoom(0.5));
    bar.querySelector('.zb-out').addEventListener('click', () => zoom(2));
    bar.querySelector('.zb-reset').addEventListener('click', () => zoom(0));
  }
  bar.querySelector('.zb-readout').textContent = `${fmtT(dom[0])} – ${fmtT(dom[1])}`;
}

function initCrosshair(svg, container, live) {
  let rule = null, chip = null;
  const markers = () => Array.from(svg.querySelectorAll('.ps-marker'));
  let vIdx = -1;
  const show = (screenX, label) => {
    const rect = svg.getBoundingClientRect();
    if (!rule) { rule = document.createElement('div'); rule.className = 'viz-crosshair'; rule.style.cssText = 'position:fixed;width:1px;background:var(--dg-strong,#8a6a2a);pointer-events:none;z-index:60'; document.body.appendChild(rule); }
    if (!chip) { chip = document.createElement('div'); chip.className = 'viz-tip'; chip.style.position = 'fixed'; document.body.appendChild(chip); }
    rule.style.left = `${screenX}px`; rule.style.top = `${rect.top}px`; rule.style.height = `${rect.height}px`; rule.hidden = false;
    chip.hidden = false; chip.innerHTML = esc(label);
    chip.style.left = `${Math.min(screenX + 6, window.innerWidth - 160)}px`; chip.style.top = `${rect.top + 4}px`;
  };
  const hide = () => { if (rule) rule.hidden = true; if (chip) chip.hidden = true; };
  svg.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const t = timeAtLocal(svg, e.clientX);
    let label = new Date(t).toISOString().slice(0, 10);
    const near = nearestMarker(svg, e.clientX);
    if (near) { const ttl = near.querySelector('title'); if (ttl) label = ttl.textContent; }
    show(e.clientX, label);
  });
  svg.addEventListener('pointerleave', hide);
  container.addEventListener('keydown', e => {
    if (!container.contains(document.activeElement)) return;
    const ms = markers(); if (!ms.length) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); vIdx = Math.min(ms.length - 1, vIdx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); vIdx = Math.max(0, vIdx - 1); }
    else return;
    const m = ms[vIdx]; const r = m.getBoundingClientRect(); const ttl = m.querySelector('title');
    show(r.left + r.width / 2, ttl ? ttl.textContent : '');
    if (ttl) live.textContent = ttl.textContent;
  });
}
function timeAtLocal(svg, screenX) {
  const rect = svg.getBoundingClientRect(); const scale = rect.width / vbWidth(svg);
  const svgX = (screenX - rect.left) / scale; const px0 = GUTTER, px1 = vbWidth(svg) - PAD;
  const frac = Math.max(0, Math.min(1, (svgX - px0) / (px1 - px0)));
  const [t0, t1] = domainOf(svg); return t0 + frac * (t1 - t0);
}
function nearestMarker(svg, screenX) {
  let best = null, bd = 5;
  for (const m of svg.querySelectorAll('.ps-marker')) {
    const r = m.getBoundingClientRect(); const d = Math.abs((r.left + r.width / 2) - screenX);
    if (d < bd) { bd = d; best = m; }
  }
  return best;
}
