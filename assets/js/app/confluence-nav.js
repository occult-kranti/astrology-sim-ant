// ============================================================================
//  confluence-nav.js — THE ATLAS PHYSICS / NAVIGATION STATE MACHINE (UI3 · B6).
//  Owns pan (drag → glide → rubber), the continuous zoom bridge over the three
//  discrete layout levels, and flyTo (search / minimap / thread / deep link).
//  It NEVER lies about positions: at rest v === L, s === 1, the world transform
//  is `none`, and every resting frame is a genuine layoutConfluence() render.
//  During a gesture the map is a uniform magnification of a truthful render.
//
//  Physics comes entirely from app/motion.js (D1): one conductor, one spring
//  solver, one settle test. Pure atlas math (zoomAnchor / nearestLevel / the
//  ZOOM_* constants) lives in core/confluence.js. No requestAnimationFrame here
//  — createSpring / startMomentum are the only frame sources, via the conductor.
//
//  The app (confluence.js) drives the DOM: it renders the atlas at a level and
//  hands this module the elements + a small hook surface (render(L) → layout,
//  afterScroll(), afterSettle()). This module writes ONLY scroll positions, the
//  world transform, and the canvas size.
// ============================================================================
import { SPRINGS, createSpring, startMomentum, rubberband, trackVelocity, motionOK, getConductor } from './motion.js';
import { zoomAnchor, nearestLevel, ZOOM_LEVELS, ZOOM_RANGE, ZOOM_REBASE } from '../core/confluence.js';

const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
// D2 preset map onto the ONE motion.js preset table: zoom settle = snappy,
// flyTo = gentle, rubber-return = snappy.
const SETTLE = SPRINGS.snappy;
const FLY = SPRINGS.gentle;
const RUBBER_RETURN = SPRINGS.snappy;

export function createConfluenceNav(opts) {
  const vp = opts.viewport;        // #cfl-scroll (overflow:auto)
  const world = opts.world;        // #cfl-world  (transform:scale(s))
  const canvas = opts.canvas;      // #cfl-canvas (sized = layout × s)
  const render = opts.render;      // (L) => newLayout   — app re-renders at level L
  const getLayout = opts.getLayout;// () => current layout {width,height,scale,...}
  const getLevel = opts.getLevel;  // () => current L (state.zoom)
  const setLevel = opts.setLevel;  // (L) => void  (writes state.zoom + label + sessionStorage)
  const afterScroll = opts.afterScroll || (() => {});   // migrated era readout / lens / pill
  const afterRebase = opts.afterRebase || (() => {});   // repaint minimap model etc.
  const slugXY = opts.slugXY;      // (slug) => {x,y} in unscaled world px at current L
  const yearToPx = () => getLayout().scale.yearToPx;
  const pxToYear = () => getLayout().scale.pxToYear;

  const nav = {
    state: 'idle',                 // idle|dragging|gliding|zooming|settling|flying
    v: getLevel(), s: 1,
    over: { x: 0, y: 0 },          // rubber overshoot (CSS px)
    _drag: null, _glide: null, _zoomTimer: 0, _rebaseTimer: 0,
    _flyX: null, _flyY: null, _rubber: null, _settleSpring: null,
    _anchor: null,                 // {wx,wy} captured world point during zoom settle
  };

  const perf = (() => { try { return new URLSearchParams(location.search).get('perf') === '1'; } catch { return false; } })();

  // Drive a spring from `from` to `to`. NB motion.js `jump()` fires onSettle
  // SYNCHRONOUSLY (value===target after a jump), so the settle callback must be
  // armed only AFTER the initial jump — otherwise it fires before the animation
  // starts and (here) tears down the handle we are about to .set().
  function springFromTo(preset, from, to, onUpdate, onDone) {
    let armed = false;
    const sp = createSpring({ ...preset, onUpdate: v => onUpdate(v), onSettle: v => { if (armed) onDone && onDone(v); } });
    sp.jump(from); armed = true; sp.set(to);
    return sp;
  }

  // ---- scale + scroll plumbing ---------------------------------------------
  function applyScale() {
    const lo = getLayout();
    const s = nav.s;
    canvas.style.width = (lo.width * s) + 'px';
    canvas.style.height = (lo.height * s) + 'px';
    const rx = nav.over.x, ry = nav.over.y;
    // translate is emitted ONLY for rubber overshoot (pan past a bound); a pure
    // zoom writes `scale(...)` alone. This keeps the RM contract observable: a
    // `translate` on #cfl-world can only mean rubber, which RM never produces.
    let t = '';
    if (rx || ry) t += `translate(${rx}px, ${ry}px) `;
    if (s !== 1) t += `scale(${s})`;
    world.style.transform = t.trim();
    if (t) world.classList.remove('is-resting'); else world.classList.add('is-resting');
  }
  const maxScrollLeft = () => Math.max(0, getLayout().width * nav.s - vp.clientWidth);
  const maxScrollTop = () => Math.max(0, getLayout().height * nav.s - vp.clientHeight);
  const centerWorldY = () => (vp.scrollTop + vp.clientHeight / 2) / nav.s;
  const centerWorldX = () => (vp.scrollLeft + vp.clientWidth / 2) / nav.s;
  const centerYear = () => pxToYear()(centerWorldY());

  function setState(s) { nav.state = s; if (perf) updatePerf(); }
  function updatePerf() { /* window.__cflNav installed below reads live nav */ }

  // ---- PAN: drag → glide → rubber (§3) -------------------------------------
  const vel = trackVelocity();
  function onPointerDown(e) {
    if (e.button !== 0) return;
    if (e.pointerType === 'touch') return;                // native touch pan
    cancelMotion();                                       // grabbing the map stops physics
    nav._drag = { x0: e.clientX, y0: e.clientY, sl0: vp.scrollLeft, st0: vp.scrollTop, moved: false, id: e.pointerId };
  }
  function onPointerMove(e) {
    const d = nav._drag; if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6) return;                 // 6 px slop
      d.moved = true; setState('dragging');
      try { vp.setPointerCapture(e.pointerId); } catch { /* */ }
      vp.classList.add('is-dragging');
    }
    let sl = d.sl0 - dx, st = d.st0 - dy;
    const maxL = maxScrollLeft(), maxT = maxScrollTop();
    // rubber overshoot past the bounds (motion only)
    let ovx = 0, ovy = 0;
    if (motionOK()) {
      if (st < 0) { ovy = rubberband(-st, vp.clientHeight); st = 0; }
      else if (st > maxT) { ovy = -rubberband(st - maxT, vp.clientHeight); st = maxT; }
      if (sl < 0) { ovx = rubberband(-sl, vp.clientWidth); sl = 0; }
      else if (sl > maxL) { ovx = -rubberband(sl - maxL, vp.clientWidth); sl = maxL; }
    } else { st = clamp(st, 0, maxT); sl = clamp(sl, 0, maxL); }
    vp.scrollTop = st; vp.scrollLeft = sl;
    nav.over.x = ovx; nav.over.y = ovy; applyScale();
    vel.push(-dy, e.timeStamp);                           // track vertical fling (px vs time)
    d.lastX = e.clientX; d.lastY = e.clientY; d.t = e.timeStamp;
  }
  function onPointerUp(e) {
    const d = nav._drag; if (!d) return;
    try { vp.releasePointerCapture(e.pointerId); } catch { /* */ }
    vp.classList.remove('is-dragging');
    nav._drag = null;
    if (!d.moved) return;                                  // a click, not a drag
    // spring any rubber overshoot back to 0
    springRubberHome();
    const v = vel.velocity();                              // px/ms of scrollTop (already signed)
    if (Math.abs(v) > 0.05 && motionOK() && !nav.over.y) {
      setState('gliding');
      nav._glide = startMomentum({
        from: vp.scrollTop, velocity: v, min: 0, max: maxScrollTop(),
        onUpdate(p) { vp.scrollTop = clamp(p, 0, maxScrollTop()); afterScroll(); },
        onSettle() { nav._glide = null; if (nav.state === 'gliding') setState('idle'); },
      });
    } else if (nav.state === 'dragging') { setState('idle'); }
  }
  function springRubberHome() {
    if (!nav.over.x && !nav.over.y) return;
    if (!motionOK()) { nav.over.x = 0; nav.over.y = 0; applyScale(); return; }
    const start = { ...nav.over };
    if (nav._rubber) nav._rubber.stop();
    nav._rubber = springFromTo(RUBBER_RETURN, 1, 0,
      p => { nav.over.x = start.x * p; nav.over.y = start.y * p; applyScale(); },
      () => { nav.over.x = 0; nav.over.y = 0; applyScale(); nav._rubber = null; });
  }

  // ---- ZOOM BRIDGE (§4) -----------------------------------------------------
  function applyZoomAround(px, py, vNew) {
    const L = getLevel();
    const sOld = nav.s;
    nav.v = clamp(vNew, ZOOM_RANGE.min, ZOOM_RANGE.max);
    nav.s = nav.v / L;
    const lo = getLayout();
    const a = zoomAnchor({ scrollLeft: vp.scrollLeft, scrollTop: vp.scrollTop, px, py,
      sOld, sNew: nav.s, worldW: lo.width, worldH: lo.height, vw: vp.clientWidth, vh: vp.clientHeight });
    applyScale();
    vp.scrollLeft = a.scrollLeft; vp.scrollTop = a.scrollTop;
    afterScroll();
  }
  function onWheel(e) {
    if (!e.ctrlKey) return;                                // plain wheel = native scroll
    e.preventDefault();
    // RM: no continuous scaling — ctrl+wheel steps to the next level, instant
    // re-render (today's path). The world transform stays `none` throughout.
    if (!motionOK()) { zoomStep(e.deltaY < 0 ? 1 : -1); return; }
    cancelFly(); if (nav._glide) { nav._glide.stop(); nav._glide = null; }
    if (nav._settleSpring) { nav._settleSpring.stop(); nav._settleSpring = null; }
    setState('zooming');
    const rect = vp.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const unit = e.deltaMode === 1 ? 16 : 1;
    applyZoomAround(px, py, nav.v * Math.exp(-e.deltaY * unit * 0.0022));
    // mid-gesture rebase to keep text crisp on long pinches
    clearTimeout(nav._rebaseTimer);
    nav._rebaseTimer = setTimeout(() => maybeRebase(px, py), ZOOM_REBASE.quietMs);
    // settle after the gesture goes quiet
    clearTimeout(nav._zoomTimer);
    nav._zoomTimer = setTimeout(() => settleZoom(px, py), 160);
  }
  function maybeRebase(px, py) {
    if (nav.state !== 'zooming') return;
    if (nav.s > ZOOM_REBASE.hi || nav.s < ZOOM_REBASE.lo) rebaseTo(nearestLevel(nav.v), px, py);
  }
  // Re-render at a new level L keeping the anchor point fixed (§4.5).
  function rebaseTo(Lnew, px, py) {
    const loOld = getLayout();
    const s = nav.s;
    const ax = px == null ? vp.clientWidth / 2 : px;
    const ay = py == null ? vp.clientHeight / 2 : py;
    const year = loOld.scale.pxToYear((vp.scrollTop + ay) / s);
    const wx = (vp.scrollLeft + ax) / s;                  // lane-x is level-independent
    setLevel(Lnew);
    const loNew = render(Lnew);                            // app re-renders; returns new layout
    nav.s = nav.v / Lnew;
    const sNew = nav.s;
    applyScale();
    vp.scrollTop = clamp(loNew.scale.yearToPx(year) * sNew - ay, 0, maxScrollTop());
    vp.scrollLeft = clamp(wx * sNew - ax, 0, maxScrollLeft());
    afterRebase(); afterScroll();
  }
  function settleZoom(px, py) {
    if (nav.state !== 'zooming') return;
    clearTimeout(nav._rebaseTimer);
    const targetV = nearestLevel(nav.v);
    if (!motionOK()) { finishSettle(targetV, px, py); return; }
    setState('settling');
    // keep the anchor point fixed while v springs to the level
    const L = getLevel();
    const ax = px == null ? vp.clientWidth / 2 : px;
    const ay = py == null ? vp.clientHeight / 2 : py;
    const wx = (vp.scrollLeft + ax) / nav.s, wy = (vp.scrollTop + ay) / nav.s;
    nav._settleSpring = springFromTo(SETTLE, nav.v, targetV,
      vNow => {
        nav.v = vNow; nav.s = vNow / L; applyScale();
        vp.scrollLeft = clamp(wx * nav.s - ax, 0, maxScrollLeft());
        vp.scrollTop = clamp(wy * nav.s - ay, 0, maxScrollTop());
        afterScroll();
      },
      () => { nav._settleSpring = null; finishSettle(targetV, px, py); });
  }
  function finishSettle(targetV, px, py) {
    nav.v = targetV;
    if (targetV !== getLevel()) { rebaseTo(targetV, px, py); }
    nav.s = 1; nav.over.x = 0; nav.over.y = 0; applyScale();
    setState('idle');
  }
  // Discrete keyboard / button zoom (§4.4 last bullet): smooth settle under
  // motion, instant re-render under RM. Keeps center-year invariant.
  function zoomStep(dir) {
    const L = getLevel();
    const i = ZOOM_LEVELS.indexOf(L);
    const ni = clamp((i < 0 ? 1 : i) + dir, 0, ZOOM_LEVELS.length - 1);
    const targetL = ZOOM_LEVELS[ni];
    if (targetL === L) return;
    const px = vp.clientWidth / 2, py = vp.clientHeight / 2;
    if (!motionOK()) { nav.v = targetL; rebaseTo(targetL, px, py); nav.s = 1; applyScale(); setState('idle'); return; }
    // animate v to the target level, then rebase at settle
    cancelFly();
    setState('settling');
    const wx = (vp.scrollLeft + px) / nav.s, wy = (vp.scrollTop + py) / nav.s;
    if (nav._settleSpring) nav._settleSpring.stop();
    nav._settleSpring = springFromTo(SETTLE, nav.v, targetL,
      vNow => {
        nav.v = vNow; nav.s = vNow / L; applyScale();
        vp.scrollLeft = clamp(wx * nav.s - px, 0, maxScrollLeft());
        vp.scrollTop = clamp(wy * nav.s - py, 0, maxScrollTop());
        afterScroll();
      },
      () => { nav._settleSpring = null; finishSettle(targetL, px, py); });
  }

  // ---- FLY-TO (§5) ----------------------------------------------------------
  function targetScroll(target) {
    let wx = null, wy = null;
    if (target.slug && slugXY) { const p = slugXY(target.slug); if (p) { wx = p.x; wy = p.y; } }
    if (target.worldX != null) wx = target.worldX;
    if (target.worldY != null) wy = target.worldY;
    if (target.year != null) wy = yearToPx()(target.year);
    const s = nav.s;
    const left = wx == null ? vp.scrollLeft : clamp(wx * s - vp.clientWidth / 2, 0, maxScrollLeft());
    const top = wy == null ? vp.scrollTop : clamp(wy * s - vp.clientHeight / 2, 0, maxScrollTop());
    return { left, top };
  }
  function flyTo(target, o = {}) {
    const dest = targetScroll(target);
    if (!motionOK() || o.source === 'coldload') {
      cancelFly(); vp.scrollTo({ left: dest.left, top: dest.top, behavior: 'auto' }); afterScroll(); return;
    }
    // teleport cap: don't cruise more than 3 viewports
    const dist = Math.abs(dest.top - vp.scrollTop);
    if (dist > 3 * vp.clientHeight) {
      const sign = Math.sign(dest.top - vp.scrollTop);
      vp.scrollTop = dest.top - sign * 1.5 * vp.clientHeight;
    }
    setState('flying');
    startFlySpring('_flyX', vp.scrollLeft, dest.left, x => { vp.scrollLeft = x; });
    startFlySpring('_flyY', vp.scrollTop, dest.top, y => { vp.scrollTop = y; afterScroll(); });
  }
  function startFlySpring(key, from, to, write) {
    if (nav[key]) { nav[key].set(to); return; }            // retarget live (cinematic threads)
    nav[key] = springFromTo(FLY, from, to,
      p => write(p),
      () => { nav[key] = null; if (!nav._flyX && !nav._flyY && nav.state === 'flying') setState('idle'); });
  }
  function cancelFly() {
    if (nav._flyX) { nav._flyX.stop(); nav._flyX = null; }
    if (nav._flyY) { nav._flyY.stop(); nav._flyY = null; }
    if (nav.state === 'flying') setState('idle');
  }

  // ---- cancel all physics (user grabbed the map / Esc) ----------------------
  function cancelMotion() {
    if (nav._glide) { nav._glide.stop(); nav._glide = null; }
    if (nav._settleSpring) { nav._settleSpring.stop(); nav._settleSpring = null; }
    if (nav._rubber) { nav._rubber.stop(); nav._rubber = null; }
    cancelFly();
    clearTimeout(nav._zoomTimer); clearTimeout(nav._rebaseTimer);
    if (nav.state !== 'idle') setState('idle');
  }

  // ---- pinch (2-pointer) ----------------------------------------------------
  const pointers = new Map();
  let pinch0 = null;
  function pinchDown(e) { if (e.pointerType !== 'touch') return; pointers.set(e.pointerId, e); if (pointers.size === 2) beginPinch(); }
  function pinchMove(e) {
    if (!pointers.has(e.pointerId)) return; pointers.set(e.pointerId, e);
    if (pointers.size === 2 && pinch0) {
      const pts = [...pointers.values()];
      const spread = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
      const rect = vp.getBoundingClientRect();
      const cx = (pts[0].clientX + pts[1].clientX) / 2 - rect.left;
      const cy = (pts[0].clientY + pts[1].clientY) / 2 - rect.top;
      setState('zooming');
      applyZoomAround(cx, cy, pinch0.v * (spread / pinch0.spread));
      clearTimeout(nav._rebaseTimer);
      nav._rebaseTimer = setTimeout(() => maybeRebase(cx, cy), ZOOM_REBASE.quietMs);
    }
  }
  function beginPinch() {
    const pts = [...pointers.values()];
    pinch0 = { spread: Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY) || 1, v: nav.v };
  }
  function pinchUp(e) {
    if (pointers.has(e.pointerId)) pointers.delete(e.pointerId);
    if (pointers.size < 2 && pinch0) { pinch0 = null; const rect = vp.getBoundingClientRect(); settleZoom(vp.clientWidth / 2, vp.clientHeight / 2); }
  }

  // ---- wiring ---------------------------------------------------------------
  vp.addEventListener('pointerdown', e => { onPointerDown(e); pinchDown(e); });
  vp.addEventListener('pointermove', e => { onPointerMove(e); pinchMove(e); });
  vp.addEventListener('pointerup', e => { onPointerUp(e); pinchUp(e); });
  vp.addEventListener('pointercancel', e => { onPointerUp(e); pinchUp(e); });
  vp.addEventListener('wheel', onWheel, { passive: false });

  if (perf && typeof window !== 'undefined') {
    window.__cflNav = () => ({ state: nav.state, raf: getConductor().running, s: Math.round(nav.s * 1000) / 1000, v: Math.round(nav.v * 1000) / 1000 });
  }

  applyScale();

  return {
    flyTo, zoomStep, cancelMotion,
    centerYear, centerWorldX, centerWorldY,
    applyScale,
    get state() { return nav.state; },
    get s() { return nav.s; },
    resync() { nav.v = getLevel(); nav.s = 1; nav.over.x = 0; nav.over.y = 0; applyScale(); },
  };
}
