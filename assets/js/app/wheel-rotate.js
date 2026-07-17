// ============================================================================
//  app/wheel-rotate.js — rotate-to-inspect physics for the chart wheel. Consumes
//  app/motion.js (frozen API, ui3-spec §4): trackVelocity/projectMomentum/
//  startMomentum/createSpring/motionOK. The DATA side (snap targets, ‹prev/next›
//  stepping, Home, readout) ships here and is the reduced-motion / keyboard path;
//  drag + inertia ride on top only under prefers-reduced-motion: no-preference.
//  [physics §4.4 + dataviz §4.5 + D4]  OWNERSHIP: Builder 2. Ships NO CSS.
// ============================================================================
import { trackVelocity, projectMomentum, startMomentum, createSpring, motionOK, SPRINGS } from './motion.js';
import { wheelSnapTargets } from '../core/viz/wheel-model.js';
import { pin } from './viz/inspect.js';

const norm = a => ((a % 360) + 360) % 360;
const shortest = (from, to) => { let d = norm(to) - norm(from); if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

// attachWheelRotate(container, reading) → { destroy(), rotateTo(id), reset() }
export function attachWheelRotate(container, reading = {}) {
  const svg = container.querySelector('.chart-wheel');
  const rotor = svg && svg.querySelector('.wheel-rotor');
  if (!svg || !rotor) return { destroy() {} };
  const chart = reading.chart || reading;
  const ascLon = chart.asc;
  const targets = wheelSnapTargets(chart, reading.aspects || []); // sorted by longitude
  // detent θ (SVG clockwise rotate that brings a target's longitude to the left anchor)
  targets.forEach(t => { t.theta = norm(t.lon - ascLon); });
  const snapAngles = targets.map(t => t.theta);
  // ‹prev/next› steps over DISTINCT angles (many targets co-locate — e.g. the
  // 1st cusp sits on the Ascendant), each keeping the highest-priority target,
  // so every step visibly moves to a new point. [dataviz §4.5]
  const stepTargets = (() => {
    const seen = new Map();
    for (const t of targets) { const k = Math.round(t.theta); const p = seen.get(k); if (!p || t.priority > p.priority) seen.set(k, t); }
    return [...seen.values()].sort((a, b) => a.theta - b.theta);
  })();

  let theta = 0;               // current rotor rotation (deg, may run outside 0..360 mid-glide)
  let momentum = null, spring = null;
  const tracker = trackVelocity();
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  // -- toolbar ---------------------------------------------------------------
  const bar = document.createElement('div');
  bar.className = 'wheel-toolbar';
  bar.innerHTML =
    `<button type="button" class="btn-secondary sm wheel-rotate-toggle" aria-pressed="false"><span aria-hidden="true">⟲</span> Rotate</button>`
    + `<span class="wheel-steppers" ${coarse ? 'hidden' : ''}>`
    + `<button type="button" class="btn-secondary sm wr-prev" aria-label="Previous point"><span aria-hidden="true">‹</span> prev</button>`
    + `<button type="button" class="btn-secondary sm wr-next" aria-label="Next point">next <span aria-hidden="true">›</span></button>`
    + `<button type="button" class="btn-secondary sm wr-home" aria-label="Reset wheel">Home</button>`
    + `</span>`
    + `<span class="viz-rotate-readout" role="status" aria-live="polite"></span>`;
  container.insertBefore(bar, container.firstChild);
  const toggle = bar.querySelector('.wheel-rotate-toggle');
  const steppers = bar.querySelector('.wheel-steppers');
  const readout = bar.querySelector('.viz-rotate-readout');
  let armed = !coarse; // fine pointers rotate immediately; coarse needs the toggle

  const setTransform = d => { rotor.style.transform = `rotate(${d.toFixed(2)}deg)`; };
  const uprightSel = '.planet-glyph,.planet-deg,.sign-glyph,.house-num';
  const clearUpright = () => rotor.querySelectorAll(uprightSel).forEach(n => n.removeAttribute('transform'));
  const applyUpright = d => rotor.querySelectorAll(uprightSel).forEach(n => {
    const x = n.getAttribute('x'), y = n.getAttribute('y');
    if (x != null && y != null) n.setAttribute('transform', `rotate(${(-d).toFixed(2)}, ${x}, ${y})`);
  });

  function anchoredTarget(d) {
    const nd = norm(d);
    let best = targets[0], bd = 1e9;
    for (const t of targets) { const gap = Math.abs(shortest(t.theta, nd)); if (gap < bd) { bd = gap; best = t; } }
    return best;
  }
  function updateReadout(d) {
    const t = anchoredTarget(d);
    readout.textContent = Math.abs(norm(d)) < 0.5 ? `Ascendant ${targets.find(x => x.id === 'angle-ASC')?.label || ''} (home)`.replace('  ', ' ') : `${t.label}`;
    return t;
  }
  function settleAt(d, doPin = true) {
    theta = norm(d);
    setTransform(theta);
    applyUpright(theta);                       // counter-rotate glyphs upright, once
    const t = updateReadout(theta);
    // tick flash on the anchored target's DOM element (if any)
    const elFlash = svg.querySelector(`[data-el="${cssq(t.id)}"]`);
    if (elFlash) { elFlash.classList.add('is-detent'); setTimeout(() => elFlash.classList.remove('is-detent'), 120); }
    if (doPin) {
      const el = svg.querySelector(`[data-el="${cssq(t.id)}"]`);
      if (el) pin(el);                         // same inspector card as clicking (one pipeline)
    }
  }
  function cssq(v) { return String(v).replace(/["\\]/g, '\\$&'); }

  // spring the rotor to an absolute target angle (near current θ), then settle.
  // NB: spring.jump() fires onSettle synchronously — guard it with `arming` so
  // only the real arrival (via .set) runs the settle work.
  function animateTo(targetTheta, preset, doPin) {
    if (momentum) { momentum.stop(); momentum = null; }
    clearUpright();
    const dest = theta + shortest(theta, targetTheta);
    let arming = true;
    const sp = createSpring({
      ...preset,
      onUpdate: v => { theta = v; setTransform(v); },
      onSettle: v => { if (arming) return; if (spring === sp) spring = null; settleAt(v, doPin); },
    });
    spring = sp;
    sp.jump(theta);   // seed the current angle (onSettle ignored while arming)
    arming = false;
    sp.set(dest);     // animates under motionOK(); instant + settle when reduced
  }

  // -- fling on release ------------------------------------------------------
  function fling(v0) {
    clearUpright();
    const projected = theta + projectMomentum(v0, 325);
    const target = anchoredTarget(projected);
    const dest = theta + shortest(theta, target.theta);
    if (momentum) momentum.stop();
    momentum = startMomentum({
      from: theta, velocity: v0, tau: 325,
      detents: { points: dest === target.theta ? snapAngles : [dest, dest + 360, dest - 360], capture: 6 },
      onUpdate: v => { theta = v; setTransform(v); },
      onSettle: v => { momentum = null; settleAt(v, true); },
    });
  }

  // -- pointer drag ----------------------------------------------------------
  const center = () => { const r = svg.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const angleAt = (x, y) => { const c = center(); return Math.atan2(y - c.y, x - c.x) * 180 / Math.PI; };
  let dragging = false, lastAngle = 0;
  svg.addEventListener('pointerdown', e => {
    if (e.target.closest('[data-el]')) return; // clicking a planet inspects, never drags
    if (coarse && !armed) return;
    dragging = true; lastAngle = angleAt(e.clientX, e.clientY);
    tracker.push(theta, e.timeStamp);
    svg.classList.add('is-dragging');
    if (spring) spring = null; if (momentum) { momentum.stop(); momentum = null; }
    clearUpright();
    try { svg.setPointerCapture(e.pointerId); } catch { /* no active pointer (e.g. synthetic events) */ }
    e.preventDefault();
  });
  svg.addEventListener('pointermove', e => {
    if (!dragging) return;
    const a = angleAt(e.clientX, e.clientY);
    let d = a - lastAngle; if (d > 180) d -= 360; if (d < -180) d += 360;
    lastAngle = a;
    theta += d;                     // SVG rotate is CW+, atan2 CCW+, but drag is 1:1 either way
    setTransform(theta);
    tracker.push(theta, e.timeStamp);
  });
  const release = e => {
    if (!dragging) return;
    dragging = false; svg.classList.remove('is-dragging');
    const v = tracker.velocity();
    if (motionOK() && Math.abs(v) > 0.02) fling(v);
    else { const t = anchoredTarget(theta); animateTo(t.theta, SPRINGS.snappy, true); }
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);

  // -- toggle / steppers / keyboard ------------------------------------------
  toggle.addEventListener('click', () => {
    armed = !armed;
    toggle.setAttribute('aria-pressed', String(armed));
    if (coarse) { steppers.hidden = !armed; svg.style.touchAction = armed ? 'none' : ''; }
  });
  const nearestStepIndex = d => {
    const nd = norm(d); let bi = 0, bd = 1e9;
    stepTargets.forEach((t, i) => { const gap = Math.abs(shortest(t.theta, nd)); if (gap < bd) { bd = gap; bi = i; } });
    return bi;
  };
  const step = dir => {
    const i = (nearestStepIndex(theta) + dir + stepTargets.length) % stepTargets.length;
    animateTo(stepTargets[i].theta, SPRINGS.snappy, true);
  };
  bar.querySelector('.wr-prev').addEventListener('click', () => step(-1));
  bar.querySelector('.wr-next').addEventListener('click', () => step(1));
  bar.querySelector('.wr-home').addEventListener('click', () => reset());
  svg.setAttribute('tabindex', svg.getAttribute('tabindex') || '0');
  svg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'Home') { e.preventDefault(); reset(); }
  });

  function reset() { animateTo(0, SPRINGS.gentle, false); readout.textContent = 'Wheel reset — Ascendant at the left.'; }
  function rotateTo(id) { const t = targets.find(x => x.id === id); if (t) animateTo(t.theta, SPRINGS.snappy, true); }

  updateReadout(0);

  return {
    rotateTo, reset,
    destroy() {
      if (momentum) momentum.stop();
      spring = null;
      bar.remove();
      rotor.style.transform = '';
      clearUpright();
    },
  };
}
