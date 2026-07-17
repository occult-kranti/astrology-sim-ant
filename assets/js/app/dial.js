// ============================================================================
//  dial.js — a degree/orb DIAL around an existing <input type="number">
//  (physics §4.6, D17). Progressive enhancement: the input stays the source of
//  truth and stays FIRST in the tab order; the dial is a second way in. No
//  fling-to-spin — a fling on a precision input is noise, and momentum here
//  would delay information (the value IS information).
//
//  RM (D17): the needle tracks the pointer exactly, no ±0.6° magnet, but the
//  crossed major tick still gets a 120 ms static `.is-hit` COLOUR flash — a
//  colour state change is not motion, matching the site's verdict-banner idiom.
// ============================================================================

import { createSpring, SPRINGS, trackVelocity, motionOK } from './motion.js';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const NS = 'http://www.w3.org/2000/svg';

function fmt(v) { return (Math.round(v * 100) / 100).toString(); }

export function attachDial(input, opts = {}) {
  if (!input || typeof input.addEventListener !== 'function') return null;
  if (input.dataset && input.dataset.dialWired) return null;
  if (input.dataset) input.dataset.dialWired = '1';

  const min = opts.min != null ? opts.min : Number(input.min !== '' ? input.min : 0);
  const max = opts.max != null ? opts.max : Number(input.max !== '' ? input.max : 360);
  const step = opts.step != null ? opts.step : Number(input.step && input.step !== 'any' ? input.step : 1);
  const wrap = opts.wrap != null ? opts.wrap : (min === 0 && max === 360);
  const detents = opts.detents != null ? opts.detents : 30;   // degrees per major tick
  const unit = opts.unit != null ? opts.unit : '°';
  const zodiac = (max - min) === 360 || (min === 0 && max === 360);
  const span = max - min;

  // ---- DOM: wrap the input in a .dial grid, add the face -------------------
  const wrapEl = document.createElement('span');
  wrapEl.className = 'dial';
  input.parentNode.insertBefore(wrapEl, input);
  const face = document.createElement('span');
  face.className = 'dial-face';
  face.tabIndex = 0;
  face.setAttribute('role', 'slider');
  face.setAttribute('aria-valuemin', String(min));
  face.setAttribute('aria-valuemax', String(max));
  face.style.touchAction = 'none';   // safe: a small self-contained face, not a scroll corridor
  wrapEl.appendChild(face);
  wrapEl.appendChild(input);         // input stays visible, beside the face, first in tab order after? see below
  // keep the input BEFORE the face in tab order: move face after input visually
  // but ensure input is reachable first — set explicit order via DOM sequence:
  wrapEl.insertBefore(input, face);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'dial-svg');
  svg.setAttribute('aria-hidden', 'true');
  face.appendChild(svg);
  // ticks
  const tickEls = [];
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0;
    const ang = (i * 6 - 90) * Math.PI / 180;
    const r1 = major ? 38 : 41, r2 = 45;
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', (50 + r1 * Math.cos(ang)).toFixed(2));
    ln.setAttribute('y1', (50 + r1 * Math.sin(ang)).toFixed(2));
    ln.setAttribute('x2', (50 + r2 * Math.cos(ang)).toFixed(2));
    ln.setAttribute('y2', (50 + r2 * Math.sin(ang)).toFixed(2));
    ln.setAttribute('class', 'dial-tick' + (major ? ' dial-tick--major' : ''));
    svg.appendChild(ln);
    if (major) tickEls.push(ln);
  }
  const needle = document.createElementNS(NS, 'line');
  needle.setAttribute('class', 'dial-needle');
  needle.setAttribute('x1', '50'); needle.setAttribute('y1', '50');
  svg.appendChild(needle);
  const hub = document.createElementNS(NS, 'circle');
  hub.setAttribute('cx', '50'); hub.setAttribute('cy', '50'); hub.setAttribute('r', '2.5');
  hub.setAttribute('class', 'dial-needle');
  svg.appendChild(hub);
  const readout = document.createElement('span');
  readout.className = 'dial-readout small muted';
  wrapEl.appendChild(readout);

  // ---- state --------------------------------------------------------------
  let value = clampWrap(Number(input.value) || min);
  let displayBias = 0;   // magnetic offset applied to the NEEDLE only
  const biasSpring = createSpring({ ...SPRINGS.snappy, onUpdate(v) { displayBias = v; drawNeedle(); }, onSettle(v) { displayBias = v; drawNeedle(); } });

  function clampWrap(v) {
    if (wrap) { let x = (v - min) % span; if (x < 0) x += span; return min + x; }
    return Math.max(min, Math.min(max, v));
  }
  function valueText(v) {
    if (zodiac) { const s = Math.floor(((v % 360) + 360) % 360 / 30); const d = (((v % 30) + 30) % 30); return `${Math.floor(d)}° ${SIGNS[s]}`; }
    return `${fmt(v)}${unit}`;
  }
  function angleOf(v) { return ((v - min) / span) * 360; }   // 0 at top, clockwise

  function drawNeedle() {
    const disp = value + (motionOK() ? displayBias : 0);
    const a = (angleOf(disp) - 90) * Math.PI / 180;
    needle.setAttribute('x2', (50 + 40 * Math.cos(a)).toFixed(2));
    needle.setAttribute('y2', (50 + 40 * Math.sin(a)).toFixed(2));
  }
  function syncOut(fireInput) {
    input.value = fmt(value);
    face.setAttribute('aria-valuenow', fmt(value));
    face.setAttribute('aria-valuetext', valueText(value));
    readout.textContent = valueText(value);
    drawNeedle();
    if (fireInput) { try { input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { /* */ } }
  }

  // major-tick flash (colour state — allowed under RM)
  let lastTickIndex = Math.round(value / detents);
  function tickFlash() {
    const idx = ((Math.round(value / detents) % tickEls.length) + tickEls.length) % tickEls.length;
    const el = tickEls[idx]; if (!el) return;
    el.classList.add('is-hit');
    setTimeout(() => { try { el.classList.remove('is-hit'); } catch (e) { /* */ } }, 120);
  }
  function maybeTick() {
    const t = Math.round(value / detents);
    if (t !== lastTickIndex) { lastTickIndex = t; tickFlash(); }
  }
  function applyMagnet() {
    if (!motionOK()) { biasSpring.jump(0); return; }
    const nearestTick = Math.round(value / detents) * detents;
    const d = nearestTick - value;
    if (Math.abs(d) <= 1.5) biasSpring.set(Math.max(-0.6, Math.min(0.6, d)));
    else biasSpring.set(0);
  }

  // ---- pointer drag (absolute angle) --------------------------------------
  const tracker = trackVelocity();
  let dragging = false;
  function valueFromEvent(e) {
    const box = face.getBoundingClientRect();
    const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    const dx = (e.clientX != null ? e.clientX : 0) - cx, dy = (e.clientY != null ? e.clientY : 0) - cy;
    let screen = Math.atan2(dy, dx) * 180 / Math.PI;   // 0 at +x
    let deg = (screen + 90 + 360) % 360;               // 0 at top
    return clampWrap(min + (deg / 360) * span);
  }
  face.addEventListener('pointerdown', e => {
    dragging = true;
    try { face.setPointerCapture(e.pointerId); } catch (err) { /* */ }
    biasSpring.jump(0);
    value = valueFromEvent(e); maybeTick(); syncOut(true); applyMagnet();
    tracker.push(value, e.timeStamp || performance.now());
  });
  face.addEventListener('pointermove', e => {
    if (!dragging) return;
    value = valueFromEvent(e); maybeTick(); syncOut(true); applyMagnet();
    tracker.push(value, e.timeStamp || performance.now());
  });
  const endDrag = () => { if (!dragging) return; dragging = false; biasSpring.set(0); };
  face.addEventListener('pointerup', endDrag);
  face.addEventListener('pointercancel', endDrag);

  // ---- keyboard (slider parity) -------------------------------------------
  face.addEventListener('keydown', e => {
    let d = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = step;
    else if (e.key === 'PageUp') d = detents;
    else if (e.key === 'PageDown') d = -detents;
    else if (e.key === 'Home') { value = min; syncOut(true); tickFlash(); e.preventDefault(); return; }
    else if (e.key === 'End') { value = wrap ? clampWrap(max) : max; syncOut(true); tickFlash(); e.preventDefault(); return; }
    else return;
    if (e.shiftKey) d *= 10;
    e.preventDefault();
    value = clampWrap(value + d);
    maybeTick(); syncOut(true);
  });

  // ---- input → dial two-way bind ------------------------------------------
  input.addEventListener('input', () => {
    if (dragging) return;
    const v = Number(input.value);
    if (!Number.isNaN(v)) { value = clampWrap(v); syncOut(false); }
  });

  syncOut(false);

  return {
    setValue(v) { value = clampWrap(Number(v) || 0); syncOut(true); },
    getValue() { return value; },
    destroy() { try { wrapEl.parentNode.insertBefore(input, wrapEl); wrapEl.remove(); if (input.dataset) delete input.dataset.dialWired; } catch (e) { /* */ } },
  };
}
