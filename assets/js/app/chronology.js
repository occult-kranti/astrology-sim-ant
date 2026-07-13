// ============================================================================
//  chronology.js (app) — renders the Hermetic Chronology timeline on
//  pages/chronology/index.html from the cited data module (one source of truth):
//   • era headers + entry cards (date, epistemic-label badge, title, body,
//     source line, related-page links);
//   • client-side controls — free-text search, era select, four label-filter
//     chips, a live count and a reset — the same UX as the original site;
//   • an IntersectionObserver reveal that honours prefers-reduced-motion;
//   • for day-datable entries, a "Cast this moment" link into the Workbench,
//     built via core/calendar.js: Julian dates are converted to proleptic
//     Gregorian for the engine, and BOTH dates are shown with the era's
//     accuracy tier so nothing is over-claimed.
//  DOM lives here; the data and the calendar math stay pure in core/**.
// ============================================================================
import { CHRONOLOGY_ERAS, CHRONOLOGY_ENTRIES } from '../core/data/chronology.js';
import { julianToGregorian, isoDate, eraAccuracy } from '../core/calendar.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const LABELS = ['documented', 'disputed', 'debunked', 'conspiracy'];
const LABEL_CSS = { documented: 'doc', disputed: 'disp', debunked: 'deb', conspiracy: 'con' };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const dmy = (y, m, d) => `${d} ${MONTHS[m - 1]} ${y}`;

// --- the "Cast this moment" link (Julian → proleptic Gregorian for the engine)
function castBlock(cast) {
  const g = cast.calendar === 'julian'
    ? julianToGregorian(cast.y, cast.m, cast.d)
    : { y: cast.y, m: cast.m, d: cast.d };
  const acc = eraAccuracy(g.y);
  const time = `${String(cast.hour).padStart(2, '0')}:00`;
  const href = `../workbench.html?date=${isoDate(g.y, g.m, g.d)}&time=${time}&offset=0`
    + `&lat=${cast.lat}&lon=${cast.lon}`;
  const both = cast.calendar === 'julian'
    ? `${dmy(cast.y, cast.m, cast.d)} (Julian, as recorded) = ${dmy(g.y, g.m, g.d)} (proleptic Gregorian, used for computation)`
    : `${dmy(cast.y, cast.m, cast.d)} (Gregorian, as recorded)`;
  const title = `${both} — ${cast.note} · Era accuracy: ${acc.label}.`;
  return `<p class="small chron-cast">✶ <a href="${esc(href)}" title="${esc(title)}">Cast this moment in the Workbench</a>
    <span class="chron-tier" title="${esc(acc.note)}">${esc(acc.label)}</span><br>
    <span class="muted">${esc(both)} · ${esc(cast.place)}. ${esc(cast.note)}</span></p>`;
}

function entryCard(e) {
  const css = LABEL_CSS[e.label] || 'doc';
  const links = e.links && e.links.length
    ? `<p class="small chron-links">Explore: ${e.links.map(l =>
        `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(' · ')}</p>` : '';
  return `<div class="chron-item chron-l-${css} chron-reveal">
    <article class="card chron-entry">
      <p class="chron-meta"><span class="chron-date">${esc(e.dateText)}</span>
        <span class="chron-badge chron-${css}">${esc(e.label)}</span></p>
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.body)}</p>
      <p class="small muted chron-src">— ${esc(e.sources.join('; '))}</p>
      ${links}${e.cast ? castBlock(e.cast) : ''}
    </article>
  </div>`;
}

// --- filtering ---------------------------------------------------------------
function matches(e, state) {
  if (state.era && e.era !== state.era) return false;
  if (!state.labels.has(e.label)) return false;
  if (state.q) {
    const hay = `${e.title} ${e.body} ${e.dateText} ${e.sources.join('; ')}`.toLowerCase();
    if (!hay.includes(state.q)) return false;
  }
  return true;
}

// --- reveal animation (honours prefers-reduced-motion) ------------------------
function revealAll(host) {
  const rows = host.querySelectorAll('.chron-reveal');
  const reduced = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof IntersectionObserver !== 'function') {
    rows.forEach(r => r.classList.add('chron-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('chron-in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  rows.forEach(r => io.observe(r));
}

// --- init + render -------------------------------------------------------------
export function initChronology() {
  const host = $('chron-timeline'); if (!host) return;
  const eraOrder = new Map(CHRONOLOGY_ERAS.map((e, i) => [e.id, i]));
  const sorted = [...CHRONOLOGY_ENTRIES].sort((a, b) =>
    (eraOrder.get(a.era) - eraOrder.get(b.era)) || (a.sortYear - b.sortYear));

  // controls
  const qIn = $('chron-search'), eraSel = $('chron-era'), count = $('chron-count'),
    reset = $('chron-reset'), chips = [...document.querySelectorAll('.chron-chip')];
  if (eraSel) eraSel.innerHTML = '<option value="">All eras</option>'
    + CHRONOLOGY_ERAS.map(e => `<option value="${esc(e.id)}">${esc(e.name)}</option>`).join('');

  const state = { q: '', era: '', labels: new Set(LABELS) };

  function render() {
    const shown = sorted.filter(e => matches(e, state));
    let html = '', lastEra = null;
    for (const e of shown) {
      if (e.era !== lastEra) {
        const era = CHRONOLOGY_ERAS.find(x => x.id === e.era);
        html += `<h2 class="chron-era">${esc(era.name)} <span class="chron-range">${esc(era.range)}</span></h2>`;
        lastEra = e.era;
      }
      html += entryCard(e);
    }
    host.innerHTML = shown.length ? html
      : '<p class="muted" style="padding:1rem 0">No entries match — try clearing a filter.</p>';
    if (count) count.textContent = `${shown.length} of ${CHRONOLOGY_ENTRIES.length} entries`;
    revealAll(host);
    try { autolinkResultPanels(['chron-timeline']); } catch { /* non-fatal */ }
  }

  if (qIn) qIn.addEventListener('input', () => { state.q = qIn.value.trim().toLowerCase(); render(); });
  if (eraSel) eraSel.addEventListener('change', () => { state.era = eraSel.value; render(); });
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const label = chip.dataset.label;
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) state.labels.add(label); else state.labels.delete(label);
      render();
    });
  }
  if (reset) reset.addEventListener('click', () => {
    state.q = ''; state.era = ''; state.labels = new Set(LABELS);
    if (qIn) qIn.value = ''; if (eraSel) eraSel.value = '';
    chips.forEach(c => c.setAttribute('aria-pressed', 'true'));
    render();
  });

  render();
}
