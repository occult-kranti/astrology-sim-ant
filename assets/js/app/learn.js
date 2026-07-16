// ============================================================================
//  learn.js — drives pages/learn.html (the curriculum).
//
//  ONE job: persist per-lesson "done" ticks in localStorage and reflect them
//  in the UI (medallion fill, per-module count, an overall progress bar, a
//  reset button). NO engine, NO network, NO chart maths — the page is a
//  static curriculum and works fully with JS disabled (the checkboxes simply
//  don't remember). Progressive enhancement only.
// ============================================================================

const KEY = 'awb-learn-progress-v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { /* private mode / quota — degrade silently, ticks just won't persist */ }
}

export function initLearn() {
  const checks = Array.from(document.querySelectorAll('.learn-check'));
  if (!checks.length) return;
  let state = load();

  const reflectNode = (cb) => {
    const node = cb.closest('.learn-node');
    if (node) node.classList.toggle('is-done', cb.checked);
  };

  const updateCounts = () => {
    // Per-module tallies.
    const mod = {};
    for (const cb of checks) {
      const m = cb.getAttribute('data-module') || '_';
      (mod[m] || (mod[m] = { done: 0, total: 0 })).total++;
      if (cb.checked) mod[m].done++;
    }
    for (const m of Object.keys(mod)) {
      const el = document.querySelector(`[data-modcount="${m}"]`);
      if (el) el.textContent = `${mod[m].done} / ${mod[m].total} done`;
    }
    // Overall bar + live label.
    const total = checks.length;
    const done = checks.reduce((n, c) => n + (c.checked ? 1 : 0), 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById('learn-bar-fill');
    if (fill) { fill.style.width = pct + '%'; fill.parentElement.setAttribute('aria-valuenow', String(pct)); }
    const label = document.getElementById('learn-progress-label');
    if (label) label.textContent = `${done} of ${total} lessons complete · ${pct}%`;
  };

  for (const cb of checks) {
    const id = cb.getAttribute('data-lesson');
    if (id && state[id]) cb.checked = true;
    reflectNode(cb);
    cb.addEventListener('change', () => {
      const lid = cb.getAttribute('data-lesson');
      if (lid) { if (cb.checked) state[lid] = true; else delete state[lid]; save(state); }
      reflectNode(cb);
      updateCounts();
    });
  }

  const reset = document.getElementById('learn-reset');
  if (reset) reset.addEventListener('click', () => {
    state = {};
    save(state);
    for (const cb of checks) { cb.checked = false; reflectNode(cb); }
    updateCounts();
  });

  updateCounts();
}
