// ============================================================================
//  ui3-motion-controls.mjs — Builder 1's test module (motion + controls
//  foundation). Exports `async run() -> { pass, failures[] }` (wired into
//  scripts/engine-test.mjs by the integrator) and a `DRIVES` array of
//  {page, actions[], asserts[]} descriptors (translated into browser-verify
//  steps by the integrator).
//
//  Node headless: motion.js is DOM-free and driveable with mocked globals. We
//  set globalThis.window/matchMedia + a mock rAF clock to exercise the real
//  spring physics deterministically. The reduced-motion (synchronous) path is
//  asserted FIRST, before any global is set, so getConductor() only ever binds
//  the mock rAF.
// ============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..', '..');
const onDisk = rel => existsSync(resolve(REPO, rel.replace(/^\//, '')));

// pure/lazy modules (safe to import in Node)
import * as motion from '../../assets/js/app/motion.js';
import { validateMoment, OFFSETS, offsetPairForCity, formatOffset } from '../../assets/js/app/moment-picker.js';
import { searchIndex, buildIndex, ALIASES } from '../../assets/js/app/palette.js';
import { SECTION_KEYS, nextUpFor, allHrefs, NEXT_UP } from '../../assets/js/app/next-up.js';
import { CITIES } from '../../assets/js/app/shared.js';

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };
  const approx = (a, b, eps, msg) => ok(Math.abs(a - b) < eps, `${msg} (got ${a}, want ~${b})`);

  // ==== 1a. REDUCED-MOTION PATH (no window ⇒ motionOK() false, synchronous) ==
  //  NOTE: must NOT call getConductor() here — doing so before the mock rAF is
  //  installed would bind the singleton to the real setTimeout scheduler. The
  //  synchronous jump (value===100 + onSettle before set() returns) IS the proof
  //  that zero frames were scheduled: the animated branch (which alone touches
  //  the conductor) was never entered.
  ok(motion.motionOK() === false, 'motionOK() should be false headless before any window is set');
  {
    let updates = 0, settled = -1;
    const s = motion.createSpring({ ...motion.SPRINGS.gentle, onUpdate: () => updates++, onSettle: v => (settled = v) });
    s.jump(0); s.set(100);
    ok(s.value === 100, 'reduced-motion set() should jump exactly to target');
    ok(settled === 100, 'reduced-motion set() should fire onSettle synchronously (zero frames scheduled)');
    ok(updates >= 1, 'reduced-motion set() should fire onUpdate synchronously');
  }

  // ==== install mock browser globals for the animated tests =================
  //  Capture originals so we can restore them — this module is wired alongside
  //  other Node test modules and must not leak a fake `window` into them.
  const saved = { window: globalThis.window, raf: globalThis.requestAnimationFrame, caf: globalThis.cancelAnimationFrame, perf: globalThis.performance,
    hadWindow: 'window' in globalThis, hadRaf: 'requestAnimationFrame' in globalThis, hadCaf: 'cancelAnimationFrame' in globalThis };
  let clock = 0; const rafQueue = [];
  globalThis.window = { matchMedia: () => ({ matches: true, addEventListener() {}, addListener() {} }) };
  globalThis.requestAnimationFrame = fn => { rafQueue.push(fn); return rafQueue.length; };
  globalThis.cancelAnimationFrame = () => {};
  globalThis.performance = { now: () => clock };
  const restoreGlobals = () => {
    if (saved.hadWindow) globalThis.window = saved.window; else delete globalThis.window;
    if (saved.hadRaf) globalThis.requestAnimationFrame = saved.raf; else delete globalThis.requestAnimationFrame;
    if (saved.hadCaf) globalThis.cancelAnimationFrame = saved.caf; else delete globalThis.cancelAnimationFrame;
    globalThis.performance = saved.perf;
  };
  const pump = (frameMs = 1000 / 60, maxFrames = 4000) => {
    let f = 0;
    while (rafQueue.length && f < maxFrames) { const b = rafQueue.splice(0, rafQueue.length); clock += frameMs; b.forEach(fn => { try { fn(); } catch (e) { /* */ } }); f++; }
    return f;
  };
  ok(motion.motionOK() === true, 'motionOK() should become true once matchMedia(no-preference) matches');

  // ==== 1b. PRESET CONSTANTS + ζ ranges =====================================
  const P = motion.SPRINGS;
  ok(P.snappy.stiffness === 420 && P.snappy.damping === 38, 'snappy preset must be {420,38}');
  ok(P.gentle.stiffness === 170 && P.gentle.damping === 26, 'gentle preset must be {170,26}');
  ok(P.molasses.stiffness === 100 && P.molasses.damping === 21, 'molasses preset must be {100,21}');
  const zeta = p => p.damping / (2 * Math.sqrt(p.stiffness * (p.mass || 1)));
  const zS = zeta(P.snappy), zG = zeta(P.gentle), zM = zeta(P.molasses);
  ok(zS >= 0.90 && zS <= 0.95, `snappy ζ in .90–.95 (got ${zS.toFixed(4)})`);
  ok(zG >= 0.98 && zG <= 1.01, `gentle ζ in .98–1.01 (got ${zG.toFixed(4)})`);
  ok(zM >= 1.02 && zM <= 1.08, `molasses ζ in 1.02–1.08 (got ${zM.toFixed(4)})`);

  // ==== 1c. THE SETTLE TEST =================================================
  for (const [name, preset] of Object.entries(P)) {
    clock = 0; rafQueue.length = 0;
    let settleAt = -1, maxV = 0; const traj = [];
    const s = motion.createSpring({ ...preset, onUpdate: v => { traj.push(v); if (v > maxV) maxV = v; }, onSettle: () => (settleAt = clock) });
    s.jump(0); s.set(100);
    const start = clock;
    pump();
    const settleMs = settleAt - start;
    ok(s.value === 100, `${name}: final value must be EXACTLY 100 (got ${s.value})`);
    ok(motion.getConductor().running === false, `${name}: conductor must idle (running===false) after settle`);
    ok(settleMs > 0 && settleMs <= 640, `${name}: settle must be ≤640 ms (got ${settleMs.toFixed(0)})`);
    const overshoot = Math.max(0, maxV - 100);
    ok(overshoot <= (name === 'snappy' ? 2.5 : 0.1), `${name}: overshoot ${overshoot.toFixed(3)}% exceeds bound`);
    // frameCount stops growing: pump 100 more frames, no new ticks
    const fc = motion.getConductor().frameCount;
    for (let i = 0; i < 100; i++) pump();
    ok(motion.getConductor().frameCount === fc, `${name}: frameCount must not grow after settle`);
    // determinism: a second identical run yields a byte-equal trajectory
    clock = 0; rafQueue.length = 0; const traj2 = [];
    const s2 = motion.createSpring({ ...preset, onUpdate: v => traj2.push(v), onSettle: () => {} });
    s2.jump(0); s2.set(100); pump();
    ok(traj.length === traj2.length && traj.every((v, i) => v === traj2[i]), `${name}: two runs must be deterministic`);
  }

  // ==== 1d. momentum / rubberband / springLinear ============================
  ok(motion.projectMomentum(0.8, 325) === 260, 'projectMomentum(0.8,325) must equal 260');
  {
    clock = 0; rafQueue.length = 0; let landed = null;
    motion.startMomentum({ from: 0, velocity: 0.2, tau: 325, detents: { points: [0, 30, 60, 90, 120], capture: 20 }, onSettle: v => (landed = v) });
    pump();
    ok([0, 30, 60, 90, 120].includes(landed), `momentum must land ON a detent (got ${landed})`);
  }
  ok(motion.rubberband(0, 500) === 0, 'rubberband(0,d) must be 0');
  ok(motion.rubberband(1e9, 500) < 500 && motion.rubberband(1e9, 500) > 0, 'rubberband asymptote must be < dim and > 0');
  { // monotonic
    let prev = -1, mono = true;
    for (let x = 0; x <= 2000; x += 50) { const r = motion.rubberband(x, 500); if (r < prev) mono = false; prev = r; }
    ok(mono, 'rubberband must be monotonic in overshoot');
  }
  {
    const sl = motion.springLinear(P.snappy);
    ok(/^linear\(0[,)]/.test(sl), 'springLinear must start with linear(0');
    ok(/(,\s*1|\b1)\)\s*$/.test(sl), 'springLinear must end at 1');
  }

  // ==== conductor semantics (injected mock) =================================
  {
    let c = 0; const q = [];
    const cond = motion.createConductor({ raf: fn => { q.push(fn); return q.length; }, cancelRaf: () => {}, now: () => c });
    let ticks = 0;
    cond.add(dt => { ticks++; return ticks < 3; });
    ok(cond.running === true, 'createConductor: running after add');
    while (q.length) { const b = q.splice(0, q.length); c += 16; b.forEach(fn => fn()); }
    ok(ticks === 3 && cond.running === false && cond.taskCount === 0, 'createConductor: loop stops when the last task returns false');
  }

  // ==== 2a. validateMoment — the 7-rule set ================================
  const vm = f => validateMoment(f);
  ok(vm({ lat: 51, lon: 0, offset: 0, date: '2020-06-01', time: '12:00' }).errors.length === 0, 'valid casting-grade moment should have no errors');
  ok(hasErr(vm({ lat: 91, lon: 0, offset: 0, date: '2020-06-01', time: '12:00' }), 'lat'), 'lat 91 should error on lat');
  ok(hasErr(vm({ lat: 0, lon: -200, offset: 0, date: '2020-06-01', time: '12:00' }), 'lon'), 'lon −200 should error on lon');
  ok(hasErr(vm({ lat: 0, lon: 0, offset: -13.7, date: '2020-06-01', time: '12:00' }), 'offset'), 'offset −13.7 should error on offset (range)');
  ok(hasErr(vm({ lat: 0, lon: 0, offset: 1.1, date: '2020-06-01', time: '12:00' }), 'offset'), 'offset 1.1 should error on offset (15-min step)');
  ok(hasHint(vm({ lat: 0, lon: 150, offset: 0, date: '2020-06-01', time: '12:00' }), 'offset'), 'lon 150 vs offset 0 should hint on offset');
  ok(hasHint(vm({ lat: 80, lon: 0, offset: 0, date: '2020-06-01', time: '12:00' }), 'lat'), 'lat 80 should hint (polar)');
  ok(hasHint(vm({ lat: 51, lon: 0, offset: 0, date: '1000-06-01', time: '12:00' }), 'date'), 'year 1000 should hint (study/illustrative era)');
  ok(hasErr(vm({ lat: 51, lon: 0, offset: 0, date: '5000-06-01', time: '12:00' }), 'date'), 'year 5000 should error (out of range)');
  { const r = vm({}); ok(hasErr(r, 'date') && hasErr(r, 'time') && hasErr(r, 'lat') && hasErr(r, 'lon'), 'empty moment should error on all required fields'); }

  // ==== 2b. offset table verified against CITIES ============================
  ok(OFFSETS.length === 38, `OFFSETS must have 38 rows (got ${OFFSETS.length})`);
  const offVals = new Set(OFFSETS.map(o => o.value));
  for (const row of CITIES) {
    const { standard, summer } = offsetPairForCity(row);
    ok(offVals.has(standard), `CITIES "${row[0]}" standard offset ${standard} must be a row in OFFSETS`);
    if (summer != null) ok(offVals.has(summer), `CITIES "${row[0]}" summer offset ${summer} must be a row in OFFSETS`);
  }
  ok(formatOffset(5.5) === 'UTC+5:30' && formatOffset(-3.5) === 'UTC−3:30' && formatOffset(0) === 'UTC+0', 'formatOffset must render named offsets');

  // ==== 2c. searchIndex ranking ============================================
  {
    const items = [
      { label: 'Workflow & maps', order: 1 },
      { label: 'The Workbench', order: 2 },
      { label: 'How it works', order: 3 },
      { label: 'Talisman Workshop', order: 4 },
    ];
    const r = searchIndex('work', items, 9);
    ok(r[0].label === 'Workflow & maps', `prefix match should rank first for "work" (got ${r[0] && r[0].label})`);
    const rEmpty = searchIndex('', items, 2);
    ok(rEmpty.length === 2, 'empty query should return the first N items');
    const rNone = searchIndex('zzzzq', items, 9);
    ok(rNone.length === 0, 'a no-match query should return nothing');
    const rSub = searchIndex('wbnch', [{ label: 'The Workbench', order: 1 }, { label: 'Random', order: 2 }], 9);
    ok(rSub.length === 1 && rSub[0].label === 'The Workbench', 'subsequence match should find "The Workbench" for "wbnch"');
  }

  // ==== 2d. palette index + alias hrefs on disk ============================
  const index = buildIndex();
  ok(index.length > 40, `palette index should have >40 rows (got ${index.length})`);
  for (const a of ALIASES) ok(onDisk(a.href), `palette alias href must exist on disk: ${a.href}`);

  // ==== 2e. NEXT_UP — every key resolves ≥2 rows; every href on disk =======
  for (const k of SECTION_KEYS) {
    const rows = nextUpFor(k);
    ok(Array.isArray(rows) && rows.length >= 2, `next-up key "${k}" must resolve to ≥2 rows (got ${rows && rows.length})`);
  }
  for (const href of allHrefs()) ok(onDisk(href), `NEXT_UP href must exist on disk: ${href}`);
  // explicit-entry sanity
  ok(NEXT_UP.talisman && NEXT_UP.geomancy && NEXT_UP.horary, 'NEXT_UP must carry the spec-named curated entries');

  restoreGlobals();
  return { pass: failures.length === 0, failures };
}

function hasErr(r, field) { return r.errors.some(e => e.field === field); }
function hasHint(r, field) { return r.hints.some(h => h.field === field); }

// ============================================================================
//  DRIVES — browser-verify descriptors (integrator translates). Each: a page,
//  a sequence of actions, and asserts. The global 0-rAF-at-idle assertion is
//  the round's signature — asserted here for a motion-bearing page after idle.
// ============================================================================
export const DRIVES = [
  {
    page: 'pages/workbench.html',
    label: 'command palette opens/closes by keyboard',
    actions: [
      { type: 'key', key: 'k', ctrl: true, meta: true },
      { type: 'assert', kind: 'exists', selector: 'dialog.cmdk[open]' },
      { type: 'type', selector: 'dialog.cmdk .cmdk-input', text: 'horary' },
      { type: 'assert', kind: 'exists', selector: 'dialog.cmdk .cmdk-row' },
      { type: 'key', key: 'Escape' },
      { type: 'assert', kind: 'notExists', selector: 'dialog.cmdk[open]' },
    ],
    asserts: [{ kind: 'jsEquals', expr: 'window.__motionStats && window.__motionStats().running', value: false, afterIdleMs: 1200 }],
  },
  {
    page: 'pages/handcalc.html',
    label: 'dial arrow keys move the bound input',
    actions: [
      { type: 'focus', selector: '.dial-face' },
      { type: 'readValue', selector: '.dial input[type="number"]', store: 'before' },
      { type: 'key', key: 'ArrowUp' },
      { type: 'assert', kind: 'inputChanged', selector: '.dial input[type="number"]', from: 'before' },
    ],
    asserts: [{ kind: 'jsEquals', expr: 'window.__motionStats && window.__motionStats().running', value: false, afterIdleMs: 1200 }],
  },
  {
    page: 'pages/workbench.html',
    label: 'recents chip round-trip (seed localStorage → reload → chip fills fields)',
    actions: [
      { type: 'evalBeforeLoad', js: "localStorage.setItem('wb-recent-places', JSON.stringify([{name:'Testville',lat:12.34,lon:56.78,offset:5.5,ts:Date.now()}]))" },
      { type: 'reload' },
      { type: 'assert', kind: 'exists', selector: '.mp-chip' },
      { type: 'click', selector: '.mp-chip .mp-chip-pick' },
      { type: 'assert', kind: 'inputEquals', selector: '#wb-lat', value: '12.34' },
    ],
    asserts: [],
  },
  {
    page: 'pages/workbench.html',
    label: 'compute choreography — verdict focused, viewport scrolled, action-bar shown',
    actions: [
      { type: 'click', selector: '#wb-form button[type="submit"]' },
      { type: 'assert', kind: 'exists', selector: '.action-bar:not([hidden])', afterIdleMs: 400 },
      { type: 'assert', kind: 'jsTruthy', expr: "document.activeElement && document.activeElement.getAttribute('role')==='status'" },
    ],
    asserts: [{ kind: 'jsEquals', expr: 'window.__motionStats && window.__motionStats().running', value: false, afterIdleMs: 1200 }],
  },
];

export default { run, DRIVES };
