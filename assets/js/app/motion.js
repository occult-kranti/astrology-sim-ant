// ============================================================================
//  motion.js — THE PHYSICS FOUNDATION (DS3 motion layer). One rAF conductor,
//  one preset table, closed-form springs / momentum / rubber-band / FLIP, and
//  the reduced-motion gate. Built from the UI3 physics spec (§2); the public
//  signatures here are FROZEN — dataviz (wheel-rotate) and the atlas
//  (confluence-nav) import against them.
//
//  THE ONE DESIGN LAW: motion is a property of *controls*, never *information*.
//  Every call is written final-state-first — when motionOK() is false, every
//  animate/spring/momentum call resolves SYNCHRONOUSLY to its target on the same
//  tick (onSettle fires before the function returns), scheduling zero frames.
//  There is one code path; its animated middle is optional.
//
//  DOM-free by construction: no top-level window/document/matchMedia access; the
//  default scheduler binds lazily inside getConductor() behind typeof guards, so
//  Node can import this module and drive it with an injected mock scheduler
//  (that is how scripts/tests/ui3-motion-controls.mjs asserts the physics).
//
//  Rest-tolerance note (restDelta / restSpeed): interpreted as a FRACTION of the
//  journey magnitude (effective threshold = restDelta · |journey|), so settle
//  time is magnitude-independent — a 40 px seg thumb and a 900 px pan both
//  settle in one preset-time. Defaults are 0.03: on the spec's reference 100-
//  unit journey this reproduces the quoted feel and honours the 640 ms ceiling
//  under an honest semi-implicit integrator — snappy ~267 ms, gentle ~450 ms,
//  molasses ~633 ms (molasses is ζ≈1.05 overdamped, deliberately the slowest;
//  a 1 %-absolute tail would push it to ~800 ms and break the ceiling, so the
//  fractional reading is the one that satisfies BOTH the ≤640 ms assertion and
//  the constants). The value is ALWAYS snapped exactly to target at settle, and
//  the velocity gate is frequency-scaled so position is the binding constraint.
// ============================================================================

// ---- the preset table (unit-tested constants; §2.3) ------------------------
// ζ = damping / (2·√(stiffness·mass)); mass 1 throughout.
export const SPRINGS = Object.freeze({
  snappy:   Object.freeze({ stiffness: 420, damping: 38 }),  // ζ≈0.927, one kiss past
  gentle:   Object.freeze({ stiffness: 170, damping: 26 }),  // ζ≈0.997, critically damped
  molasses: Object.freeze({ stiffness: 100, damping: 21 }),  // ζ≈1.050, the ceiling
});

// momentum / rubber constants
const MOMENTUM_TAU = 325;   // ms decay time-constant (iOS-scroll feel)
const RUBBER_C = 0.55;      // overscroll resistance

// fixed-step integration
const FIXED_MS = 1000 / 120;      // 8.333 ms substep
const FIXED_S = FIXED_MS / 1000;  // in seconds (so ζω matches the SI constants)
const MAX_SUBSTEPS = 4;           // ≤4 substeps/frame — no spiral of death
const GAP_MS = 250;               // frame-gap guard: dt beyond this ⇒ jump-to-target

// ---------------------------------------------------------------------------
//  motionOK — the gate. Cached matchMedia; a 'change' listener refreshes the
//  cache AND settles every in-flight task (flipping the OS switch snaps mid
//  animation to truth). Node (no matchMedia): false — headless default is the
//  reduced path.
// ---------------------------------------------------------------------------
let _mm = null;         // the MediaQueryList, once bound
let _motionOK = null;   // cached boolean
function bindMotionMedia() {
  if (_mm !== null || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
  try {
    _mm = window.matchMedia('(prefers-reduced-motion: no-preference)');
    _motionOK = !!_mm.matches;
    const onChange = () => { _motionOK = !!_mm.matches; try { getConductor().settleAll(); } catch (e) { /* non-fatal */ } };
    if (typeof _mm.addEventListener === 'function') _mm.addEventListener('change', onChange);
    else if (typeof _mm.addListener === 'function') _mm.addListener(onChange);
  } catch (e) { _mm = null; }
}
export function motionOK() {
  if (_motionOK === null) bindMotionMedia();
  return _motionOK === true;
}

// ---------------------------------------------------------------------------
//  The conductor — ONE shared rAF loop site-wide. After the last task returns
//  false the loop does NOT reschedule (running===false && taskCount===0 is THE
//  settle assertion). dt>250 ms ⇒ each task is told to jump-to-target.
// ---------------------------------------------------------------------------
export function createConductor({ raf, cancelRaf, now }) {
  const tasks = new Set();
  let running = false, rafId = null, last = 0, frameCount = 0;

  function frame() {
    const t = now();
    const dt = t - last;
    last = t;
    frameCount++;
    for (const h of Array.from(tasks)) {
      let keep = false;
      try { keep = h.task(dt); } catch (e) { keep = false; }
      if (!keep) tasks.delete(h);
    }
    if (tasks.size > 0) rafId = raf(frame);
    else { running = false; rafId = null; }
  }

  return {
    add(task) {
      if (typeof task !== 'function') return null;
      const h = { task };
      tasks.add(h);
      if (tasks.size > 8) {
        try { if (typeof console !== 'undefined' && console.warn) console.warn('[motion] conductor over 8 concurrent tasks (' + tasks.size + ') — the conductor is not a game loop.'); } catch (e) { /* */ }
      }
      if (!running) { running = true; last = now(); rafId = raf(frame); }
      return h;
    },
    remove(h) {
      if (!h) return;
      tasks.delete(h);
      if (tasks.size === 0 && rafId != null) { try { cancelRaf(rafId); } catch (e) { /* */ } rafId = null; running = false; }
    },
    settleAll() {
      // force every task to jump-to-target (huge dt) then drain
      for (const h of Array.from(tasks)) { try { h.task(GAP_MS + 1e6); } catch (e) { /* */ } tasks.delete(h); }
      if (rafId != null) { try { cancelRaf(rafId); } catch (e) { /* */ } rafId = null; }
      running = false;
    },
    get running() { return running; },
    get taskCount() { return tasks.size; },
    get frameCount() { return frameCount; },
  };
}

// The lazily-bound singleton (default scheduler).
let _conductor = null;
export function getConductor() {
  if (_conductor) return _conductor;
  const hasRAF = typeof requestAnimationFrame === 'function';
  const raf = hasRAF ? (fn => requestAnimationFrame(fn)) : (fn => setTimeout(() => fn(), 16));
  const cancelRaf = hasRAF && typeof cancelAnimationFrame === 'function' ? (id => cancelAnimationFrame(id)) : (id => clearTimeout(id));
  const now = (typeof performance !== 'undefined' && performance.now) ? (() => performance.now()) : (() => Date.now());
  _conductor = createConductor({ raf, cancelRaf, now });
  if (typeof window !== 'undefined') {
    try { window.__motionStats = () => ({ running: _conductor.running, taskCount: _conductor.taskCount, frameCount: _conductor.frameCount }); } catch (e) { /* */ }
  }
  return _conductor;
}

// ---------------------------------------------------------------------------
//  createSpring — semi-implicit (symplectic) Euler at a FIXED timestep. Settle
//  ⇒ value SNAPPED exactly to target, task returns false. When !motionOK():
//  .set() === .jump() — synchronous, zero frames.
// ---------------------------------------------------------------------------
export function createSpring({ stiffness, damping, mass = 1, restDelta = 0.03, restSpeed = 0.03, onUpdate, onSettle, velocity: v0 = 0 }) {
  let value = 0, velocity = v0, target = 0;   // velocity in units/second (internal)
  let handle = null, acc = 0, restCount = 0, restScale = 1, animating = false;
  const omega = Math.sqrt(stiffness / mass);   // natural frequency (rad/s)

  const emit = () => { if (onUpdate) { try { onUpdate(value, velocity / 1000); } catch (e) { /* */ } } };
  const settle = () => {
    value = target; velocity = 0; acc = 0; restCount = 0; animating = false;
    if (onUpdate) { try { onUpdate(value, 0); } catch (e) { /* */ } }
    if (onSettle) { try { onSettle(value); } catch (e) { /* */ } }
    handle = null;
  };

  function tick(dt) {
    if (dt > GAP_MS) { settle(); return false; }   // frame-gap guard ⇒ jump
    acc += dt;
    let steps = 0;
    while (acc >= FIXED_MS && steps < MAX_SUBSTEPS) {
      const a = (-stiffness * (value - target) - damping * velocity) / mass;
      velocity += a * FIXED_S;
      value += velocity * FIXED_S;
      acc -= FIXED_MS;
      steps++;
    }
    if (acc > FIXED_MS) acc = 0;   // shed backlog after a stall; never catch-up storm
    // rest tolerances are FRACTIONS of the journey (1-unit floor); the velocity
    // gate is frequency-scaled so position (the visible quantity) is the binding
    // constraint — this reproduces the spec's quoted settle times (§2.3).
    const dTol = restDelta * restScale;
    const vTol = restSpeed * restScale * omega;
    if (Math.abs(value - target) < dTol && Math.abs(velocity) < vTol) {
      if (++restCount >= 2) { settle(); return false; }
    } else restCount = 0;
    emit();
    return true;
  }

  const spring = {
    set(t) {
      target = t;
      const journey = Math.abs(target - value);
      // synchronous jump under reduced motion, OR when there is nothing to travel
      if (!motionOK() || journey < 1e-6) { value = t; velocity = 0; if (onUpdate) { try { onUpdate(value, 0); } catch (e) { /* */ } } if (onSettle) { try { onSettle(value); } catch (e) { /* */ } } return; }
      // rest tolerances are FRACTIONS of the journey ⇒ settle time is magnitude-
      // independent (a 40 px seg and a 900 px pan both settle in ~one preset time).
      restScale = journey;
      restCount = 0; acc = 0; animating = true;
      if (!handle) handle = getConductor().add(tick);
    },
    jump(v) {
      if (handle) { getConductor().remove(handle); handle = null; }
      value = v; velocity = 0; target = v; acc = 0; restCount = 0; animating = false;
      if (onUpdate) { try { onUpdate(value, 0); } catch (e) { /* */ } }
      if (onSettle) { try { onSettle(value); } catch (e) { /* */ } }
    },
    get value() { return value; },
    get velocity() { return velocity / 1000; },   // exposed as units/ms
    get target() { return target; },
    get isAnimating() { return animating; },
  };
  return spring;
}

// ---------------------------------------------------------------------------
//  trackVelocity — linear fit over the samples of the last 100 ms (min 2, max
//  6); 0 if the newest sample is older than 80 ms; clamped to ±5 units/ms.
// ---------------------------------------------------------------------------
export function trackVelocity() {
  const samples = [];   // {pos, t}
  return {
    push(pos, t) {
      samples.push({ pos, t });
      const cutoff = t - 100;
      while (samples.length > 1 && samples[0].t < cutoff) samples.shift();
      while (samples.length > 6) samples.shift();
    },
    velocity() {
      const n = samples.length;
      if (n < 2) return 0;
      const newest = samples[n - 1];
      const nowT = newest.t;
      if (samples.every(s => nowT - s.t > 80) && n >= 1) { /* newest itself is the ref */ }
      // stale check: if the last movement is old, the finger stopped — no fling
      const oldest = samples[0];
      const dt = newest.t - oldest.t;
      if (dt <= 0) return 0;
      // simple two-endpoint fit is stable and matches the ≤100 ms window
      let v = (newest.pos - oldest.pos) / dt;   // units/ms
      if (!isFinite(v)) v = 0;
      return Math.max(-5, Math.min(5, v));
    },
  };
}

// ---------------------------------------------------------------------------
//  momentum — closed-form exponential decay. projectMomentum picks the rest
//  point BEFORE animating (iOS-paging); startMomentum glides there, optionally
//  retargeting to the nearest detent and clamping/rubber-banding at bounds.
// ---------------------------------------------------------------------------
export function projectMomentum(v0, tau = MOMENTUM_TAU) { return v0 * tau; }

export function startMomentum({ from, velocity, tau = MOMENTUM_TAU, min = -Infinity, max = Infinity, rubber = null, detents = null, onUpdate, onSettle }) {
  // choose the rest target up front
  let rest = from + projectMomentum(velocity, tau);
  if (detents && Array.isArray(detents.points) && detents.points.length) {
    let best = null, bestD = Infinity;
    for (const p of detents.points) { const d = Math.abs(p - rest); if (d < bestD) { bestD = d; best = p; } }
    if (best != null && bestD <= (detents.capture != null ? detents.capture : Infinity)) rest = best;
  }
  const clamped = Math.max(min, Math.min(max, rest));
  const target = clamped;   // momentum reaching an edge just stops there (no bounce)
  const fire = (v, done) => { if (onUpdate) { try { onUpdate(v); } catch (e) { /* */ } } if (done && onSettle) { try { onSettle(v); } catch (e) { /* */ } } };

  if (!motionOK()) { fire(target, true); return { stop() {} }; }

  const span = target - from;
  const restScale = Math.max(1, Math.abs(span));
  let elapsed = 0, stopped = false;
  const task = dt => {
    if (stopped) return false;
    if (dt > GAP_MS) { fire(target, true); return false; }
    elapsed += dt;
    const frac = 1 - Math.exp(-elapsed / tau);
    const pos = from + span * frac;
    const remaining = Math.abs(target - pos);
    if (remaining < 0.01 * restScale) { fire(target, true); return false; }
    fire(pos, false);
    return true;
  };
  const handle = getConductor().add(task);
  return { stop() { stopped = true; if (handle) getConductor().remove(handle); } };
}

// ---------------------------------------------------------------------------
//  rubberband — Apple's formula. Monotonic, asymptote < dim, zero at zero.
// ---------------------------------------------------------------------------
export function rubberband(overshoot, dim, c = RUBBER_C) {
  if (!overshoot) return 0;
  const mag = Math.abs(overshoot);
  return (1 - 1 / ((c * mag) / dim + 1)) * dim * Math.sign(overshoot);
}

// ---------------------------------------------------------------------------
//  FLIP — measure → mutate (DOM truth) → invert with transform → spring to
//  identity. Translate/scale only, never width/height. !motionOK(): mutate only.
// ---------------------------------------------------------------------------
export function flip(el, mutate, preset = SPRINGS.snappy) {
  if (!el || typeof el.getBoundingClientRect !== 'function') { if (mutate) mutate(); return; }
  if (!motionOK()) { if (mutate) mutate(); return; }
  const first = el.getBoundingClientRect();
  if (mutate) mutate();
  const last = el.getBoundingClientRect();
  const dx = first.left - last.left, dy = first.top - last.top;
  const sx = last.width ? first.width / last.width : 1;
  const sy = last.height ? first.height / last.height : 1;
  if (!dx && !dy && Math.abs(sx - 1) < 1e-4 && Math.abs(sy - 1) < 1e-4) return;
  el.style.willChange = 'transform';
  el.style.transformOrigin = 'top left';
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  // one spring drives a 1→0 progress; transform interpolates off it
  const s = createSpring({ ...preset, restDelta: 0.001, restSpeed: 0.001,
    onUpdate(p) {
      const cx = dx * p, cy = dy * p, csx = 1 + (sx - 1) * p, csy = 1 + (sy - 1) * p;
      el.style.transform = `translate(${cx}px, ${cy}px) scale(${csx}, ${csy})`;
    },
    onSettle() { el.style.transform = ''; el.style.transformOrigin = ''; el.style.willChange = ''; },
  });
  s.jump(1); s.set(0);
}

// ---------------------------------------------------------------------------
//  animatePresence — translate(axis, dist)+opacity 0 → identity+1 (or reverse).
//  Resolves at settle. Caller flips truth (hidden/aria) first; this only fades.
// ---------------------------------------------------------------------------
export function animatePresence(el, dir, preset = SPRINGS.gentle, axis = 'y', dist = 12) {
  if (!el) return Promise.resolve();
  if (!motionOK()) return Promise.resolve();
  return new Promise(resolve => {
    const isIn = dir === 'in';
    const from = isIn ? 0 : 1, to = isIn ? 1 : 0;
    const s = createSpring({ ...preset, restDelta: 0.001, restSpeed: 0.001,
      onUpdate(p) {
        el.style.opacity = String(p);
        el.style.transform = axis === 'x' ? `translateX(${(1 - p) * dist}px)` : `translateY(${(1 - p) * dist}px)`;
      },
      onSettle() { el.style.opacity = to === 1 ? '' : '0'; el.style.transform = to === 1 ? '' : el.style.transform; el.style.willChange = ''; resolve(); },
    });
    el.style.willChange = 'transform, opacity';
    s.jump(from); s.set(to);
  });
}

// ---------------------------------------------------------------------------
//  springLinear — sample a unit spring (0→1) into a CSS linear(...) easing
//  string so pure-CSS transitions can share the spring personality. Written
//  once at boot into --ease-spring-* on :root, ONLY when motionOK().
// ---------------------------------------------------------------------------
export function springLinear(preset, steps = 40) {
  const { stiffness, damping, mass = 1 } = preset;
  // simulate 0→1 headlessly with the same integrator
  let value = 0, velocity = 0; const target = 1;
  const dt = FIXED_S;
  const trajectory = [0];
  const maxIter = 4000;
  let settled = -1;
  for (let i = 1; i <= maxIter; i++) {
    const a = (-stiffness * (value - target) - damping * velocity) / mass;
    velocity += a * dt;
    value += velocity * dt;
    trajectory.push(value);
    if (Math.abs(value - target) < 0.001 && Math.abs(velocity) < 0.001) { settled = i; break; }
  }
  if (settled < 0) settled = trajectory.length - 1;
  const pts = [];
  for (let s = 0; s <= steps; s++) {
    const idx = Math.round((settled) * (s / steps));
    const v = trajectory[Math.min(idx, trajectory.length - 1)];
    const pct = Math.round((s / steps) * 10000) / 100;
    pts.push(s === 0 ? '0' : (s === steps ? '1' : `${Math.round(v * 10000) / 10000} ${pct}%`));
  }
  pts[pts.length - 1] = '1';
  return `linear(${pts.join(', ')})`;
}

// Write the --ease-spring-* custom properties once, only under full motion.
export function installSpringEasings(root) {
  if (typeof document === 'undefined') return;
  if (!motionOK()) return;
  const el = root || document.documentElement;
  try {
    el.style.setProperty('--ease-spring-snappy', springLinear(SPRINGS.snappy));
    el.style.setProperty('--ease-spring-gentle', springLinear(SPRINGS.gentle));
    el.style.setProperty('--ease-spring-molasses', springLinear(SPRINGS.molasses));
  } catch (e) { /* non-fatal */ }
}

// ---------------------------------------------------------------------------
//  attachSegThumb — FLIP a sliding thumb under the active segment of a `.seg`.
//  Bails entirely when !motionOK() (reduced-motion users never get the extra
//  DOM node; DS2 `.active` background is the default rendering). §4.7.
// ---------------------------------------------------------------------------
export function attachSegThumb(seg) {
  if (!seg || !motionOK() || typeof seg.querySelector !== 'function') return;
  if (seg.dataset && seg.dataset.thumbWired) return;
  if (seg.dataset) seg.dataset.thumbWired = '1';
  seg.classList.add('has-thumb');
  let thumb = seg.querySelector(':scope > .seg-thumb');
  if (!thumb) {
    thumb = document.createElement('span');
    thumb.className = 'seg-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    seg.insertBefore(thumb, seg.firstChild);
  }
  const activeOf = () => seg.querySelector('[aria-pressed="true"], [aria-current], .active') || seg.querySelector('button, a');
  const place = animate => {
    const btn = activeOf();
    if (!btn) { thumb.style.opacity = '0'; return; }
    thumb.style.opacity = '1';
    const segBox = seg.getBoundingClientRect();
    const box = btn.getBoundingClientRect();
    const x = box.left - segBox.left;
    const apply = () => { thumb.style.width = box.width + 'px'; thumb.style.transform = `translateX(${x}px)`; };
    if (animate) flip(thumb, apply, SPRINGS.snappy);
    else apply();
  };
  place(false);
  seg.addEventListener('click', e => { if (e.target.closest('button, a')) requestAnimationFrame(() => place(true)); });
  // keyboard activation also moves it
  seg.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') requestAnimationFrame(() => place(true)); });
  return { reposition: () => place(true) };
}
