// ============================================================================
//  yoga.js (app) — the ONE app module that drives every page of the Yoga-sūtra
//  study wing (index · the four pāda browsers · theory · sources) via
//  initYoga(page). All computation stays in the pure core (core/yogasutra.js);
//  this file owns the DOM only: the site-wide search box on the index, the
//  full per-pāda sūtra browser with its client-side filter, the Book-III
//  numbering toggle (195 ↔ 196), and the Book-IV Bhoja-number badges.
//
//  Honest framing is carried in the page prose, not here: this wing presents a
//  historical philosophy/practice text for study — the siddhi (power) claims
//  are the text's own, described never prescribed.
// ============================================================================
import { ALL_SUTRAS, sutraByRef, searchSutras, counts } from '../core/yogasutra.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Diacritic-fold for the client-side filter (so "samadhi" matches "samādhi").
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function initYoga(page) {
  switch (page) {
    case 'index': return initIndex();
    case 'pada1': return initPada(1);
    case 'pada2': return initPada(2);
    case 'pada3': return initPada(3);
    case 'pada4': return initPada(4);
    // theory & sources are static prose + inline SVG; nothing to wire.
    default: return;
  }
}

// ── The counts-by-edition table + the site-wide search box (index page) ─────
function initIndex() {
  const cEl = $('ys-counts');
  if (cEl) {
    const c = counts();
    const per = c.perPada;
    const p3 = per[2], p4 = per[3];
    cEl.innerHTML = `
      <div style="overflow-x:auto"><table class="data">
        <thead><tr>
          <th class="l">Pāda (book)</th>
          <th>Vyāsa / Krishnamacharya / <span class="muted">sanskritdocuments</span> (195)</th>
          <th>Iyengar · Taimni · Satchidananda (196)</th>
          <th>Bhoja's Rājamārtaṇḍa (194)</th>
        </tr></thead>
        <tbody>
          <tr><td class="l"><b>I</b> — ${esc(per[0].name)}</td><td>${per[0].count}</td><td>${per[0].count}</td><td>${per[0].count}</td></tr>
          <tr><td class="l"><b>II</b> — ${esc(per[1].name)}</td><td>${per[1].count}</td><td>${per[1].count}</td><td>${per[1].count}</td></tr>
          <tr><td class="l"><b>III</b> — ${esc(p3.name)}</td><td>${p3.vulgate} <span class="small muted">(omits the variant)</span></td><td>${p3.inclusive} <span class="small muted">(+III.22)</span></td><td>${p3.vulgate}</td></tr>
          <tr><td class="l"><b>IV</b> — ${esc(p4.name)}</td><td>${p4.total}</td><td>${p4.total}</td><td>${p4.bhoja} <span class="small muted">(IV.16 as bhāṣya)</span></td></tr>
          <tr class="ys-total"><td class="l"><b>Total</b></td><td><b>${c.editions.vulgate}</b></td><td><b>${c.editions.inclusive}</b></td><td><b>${c.editions.bhoja}</b></td></tr>
        </tbody>
      </table></div>
      <p class="small muted" style="margin:.5rem 0 0">The three totals differ over exactly two sūtras: the disputed
        <b>III.22</b> "etena śabdādyantardhānam uktam" (the inclusive editions keep it, the rest drop it) and the
        vulgate <b>IV.16</b> (Bhoja treats it as commentary, not sūtra). This wing stores all 196 records and flags
        both — it never silently picks one count. Numbers are counted live from the data.</p>`;
  }

  const q = $('ys-q'), out = $('ys-results');
  if (!q || !out) return;
  const runSearch = () => {
    const term = q.value.trim();
    if (!term) { out.innerHTML = '<p class="small muted">Type a word — Sanskrit or English — or a reference like <code>II.29</code>.</p>'; return; }
    // let a bare reference (e.g. "II.29") jump straight to that sūtra
    let hits = searchSutras(term);
    const byRef = sutraByRef(term);
    if (byRef && !hits.includes(byRef)) hits = [byRef, ...hits];
    if (!hits.length) { out.innerHTML = `<p class="small muted">No sūtra matches “${esc(term)}”.</p>`; return; }
    const shown = hits.slice(0, 60);
    out.innerHTML = `<p class="small muted">${hits.length} match${hits.length === 1 ? '' : 'es'}${hits.length > shown.length ? ` — showing the first ${shown.length}` : ''}:</p>
      <ul class="ys-hits clean">${shown.map(s => `
        <li><a href="pada${s.pada}.html#s${s.anchor}"><b>${esc(s.ref)}</b></a>
          <span class="ys-hit-iast">${esc(s.iast)}</span>
          <span class="ys-hit-tr small muted">${esc(trim(s.translation, 110))}</span></li>`).join('')}</ul>`;
  };
  q.addEventListener('input', runSearch);
  runSearch();
}

function trim(s, n) { s = String(s ?? ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

// ── The full sūtra browser for one pāda ─────────────────────────────────────
function initPada(pada) {
  const list = $('ys-list');
  if (!list) return;
  const records = ALL_SUTRAS.filter(s => s.pada === pada);

  // Book III renders in the 196 (inclusive) order by default; the toggle only
  // re-labels the numbers, it never re-orders or hides anything.
  let mode196 = true;   // Book III only
  list.innerHTML = records.map(r => renderSutra(r, mode196)).join('');
  autolinkResultPanels(['ys-list']);

  // Book-III numbering toggle.
  const toggle = $('ys-numbering');
  if (pada === 3 && toggle) {
    toggle.addEventListener('click', e => {
      const btn = e.target.closest('button[data-mode]');
      if (!btn) return;
      mode196 = btn.dataset.mode === '196';
      toggle.querySelectorAll('button[data-mode]').forEach(b =>
        b.classList.toggle('active', (b.dataset.mode === '196') === mode196));
      relabelNumbers(list, mode196);
    });
  }

  // Client-side filter (hide/show already-rendered records — DOM stays light).
  const filter = $('ys-filter');
  const count = $('ys-filter-count');
  if (filter) {
    const arts = Array.from(list.querySelectorAll('.ys-sutra'));
    const apply = () => {
      const needle = fold(filter.value).trim();
      let shown = 0;
      for (const art of arts) {
        const hit = !needle || fold(art.dataset.hay).includes(needle);
        art.style.display = hit ? '' : 'none';
        if (hit) shown++;
      }
      if (count) count.textContent = needle ? `${shown} of ${arts.length} sūtras` : `${arts.length} sūtras`;
    };
    filter.addEventListener('input', apply);
    apply();
  }
}

// Re-label the Book-III numbers in place when the 195/196 toggle flips.
function relabelNumbers(list, mode196) {
  list.querySelectorAll('.ys-sutra[data-num196]').forEach(art => {
    const numEl = art.querySelector('.ys-num');
    if (!numEl) return;
    const n196 = art.dataset.num196;
    const n195 = art.dataset.num195;   // "" (empty) on the variant
    if (mode196) {
      numEl.textContent = `III.${n196}`;
    } else {
      numEl.textContent = n195 ? `III.${n195}` : 'III —';
    }
  });
}

function renderSutra(r, mode196) {
  // The "haystack" the client-side filter searches (ref + iast + translation + glosses).
  const hay = [r.ref, r.iast, r.translation, (r.words || []).map(w => `${w.sa} ${w.gloss}`).join(' ')].join(' ');

  // Number label (Book III depends on the toggle mode).
  let numLabel, dataAttrs = '';
  if (r.pada === 3) {
    dataAttrs = ` data-num196="${r.num196}" data-num195="${r.num == null ? '' : r.num}"`;
    numLabel = mode196 ? `III.${r.num196}` : (r.num == null ? 'III —' : `III.${r.num}`);
  } else {
    numLabel = r.ref;
  }

  // Badges: the Book-III variant, and the Book-IV Bhoja divergence.
  let badge = '';
  if (r.variant) {
    badge = `<span class="ys-badge ys-badge-variant" title="Absent from the Vyāsa/Bhoja vulgate and from Woods (1914) and Rama Prasada (1912)">variant sūtra — absent from Vyāsa/Bhoja editions</span>`;
  }
  if (r.pada === 4 && r.bhojaNum !== r.num) {
    badge += r.bhojaNum == null
      ? `<span class="ys-badge ys-badge-bhoja" title="Bhoja's Rājamārtaṇḍa treats this vulgate sūtra as commentary, not a sūtra">absent in Bhoja (counted as bhāṣya)</span>`
      : `<span class="ys-badge ys-badge-bhoja" title="Bhoja's numbering runs one behind the vulgate from here on">Bhoja IV.${r.bhojaNum}</span>`;
  }

  const words = (r.words || []).map(w =>
    `<tr><td class="l ys-sa">${esc(w.sa)}</td><td class="l">${esc(w.gloss)}</td></tr>`).join('');

  const note = r.note
    ? `<p class="ys-note small"><span class="ys-note-label">Note</span> ${esc(r.note)}</p>` : '';

  return `<article class="ys-sutra" id="s${r.anchor}"${dataAttrs} data-hay="${esc(hay)}">
    <div class="ys-head">
      <a class="ys-num" href="#s${r.anchor}">${esc(numLabel)}</a>${badge}
    </div>
    <p class="ys-dev" lang="sa">${esc(r.devanagari)}</p>
    <p class="ys-iast"><i>${esc(r.iast)}</i></p>
    <div style="overflow-x:auto"><table class="data ys-words">
      <thead><tr><th class="l">Sanskrit</th><th class="l">Gloss</th></tr></thead>
      <tbody>${words}</tbody>
    </table></div>
    <p class="ys-tr">${esc(r.translation)}</p>
    ${note}
    <p class="ys-src small muted">${esc(r.src)}</p>
  </article>`;
}
