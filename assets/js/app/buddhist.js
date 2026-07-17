// ============================================================================
//  buddhist.js (app) — the ONE app module driving every page of the Buddhist
//  scriptures reading-room wing (hub · metta · heart · mn118 · sources) via
//  initBuddhist(page). All computation lives in the pure core
//  (core/buddhist.js, built in parallel by B-bud-data); this file owns the DOM:
//    • the hub's live-counts table + cross-text word search,
//    • the reading room per text (interactive Pāli/Sanskrit line, the
//      always-reachable word-by-word table, the verbatim CC0/PD translation,
//      ⚑ contested cruxes, honest null-translation colophons),
//    • MN 118's peyyāla model — each refrain glossed ONCE, its uses shown
//      collapsed with an on-demand "show the full refrain" expansion.
//
//  Honest framing is carried in the page prose, not here: this wing presents
//  historical scriptures for close study — the texts' own claims (rebirth, the
//  divine abidings, the fruits of meditation) are DESCRIBED, never prescribed.
//
//  The word-gloss popover mirrors the app/glosstip.js pattern (position:fixed,
//  hover/tap/focus, Esc, scroll-dismiss) but carries per-WORD data (gloss +
//  grammar + PED/MW citation) rather than glossary entries — so it is a small
//  dedicated implementation here, not a call into glosstip's glossary lookup.
//  glosstip itself is still initialised, for any autolinked terms in the prose.
// ============================================================================
import {
  textById, recordsFor, buddhistStats, expandRefrain, reconstruct,
} from '../core/buddhist.js';
import { BUDDHIST_TEXTS, MN118_REFRAINS } from '../core/data/buddhist/index.js';
import { initGlosstip } from './glosstip.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Diacritic-fold for the client-side filter (so "metta" matches "mettā").
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// A DOM-id-safe slug for a segment ref ('mn118:8.2' → 'mn118-8-2').
const slug = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// text id → its reading-room page filename.
const PAGE_OF = { metta: 'metta.html', heart: 'heart.html', mn118: 'mn118.html' };

// ── Tolerant accessors — code to the FROZEN contract but survive the small
//    shape differences between the verse texts ({translation:{text,source}})
//    and the prose sutta ({translation:'…', transSrc, note, src}). ───────────
const lineText = r => r.pali ?? r.sanskrit ?? '';
const isSanskrit = r => r.sanskrit != null;
function translationOf(r) {
  const t = r.translation;
  if (t == null) return null;                                   // honest colophon / untranslated segment
  if (typeof t === 'string') return { text: t, source: r.transSrc || r.src || '' };
  return { text: t.text, source: t.source || r.transSrc || '' };
}
const noteOf = r => r.notes ?? r.note ?? '';
const srcOf = r => r.src ?? (r.translation && r.translation.source) ?? '';
const licenceOf = r => r.licence ?? null;
const wordsOf = r => Array.isArray(r.words) ? r.words : [];
// Clean a Bilara translation string for display: drop <j> line-join markers,
// collapse runs of whitespace, trim. (The data keeps them verbatim; we only
// tidy for reading — the verbatim value stays in the source module.)
const cleanTr = s => String(s ?? '').replace(/<\/?j>/g, ' ').replace(/\s+/g, ' ').trim();

// ── The word-gloss popover (mirrors glosstip mechanics) ─────────────────────
const WordPop = (() => {
  let pop = null, trigger = null, pinned = false, timer = 0, started = false;
  const SHOW_DELAY = 140;
  function ensure() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'bud-pop'; pop.id = 'bud-pop'; pop.setAttribute('role', 'tooltip'); pop.hidden = true;
    pop.addEventListener('pointerenter', () => { if (timer) { clearTimeout(timer); timer = 0; } });
    pop.addEventListener('pointerleave', () => { if (!pinned) hide(); });
    document.body.appendChild(pop);
    return pop;
  }
  const triggerOf = n => (n && n.closest) ? n.closest('.bud-w') : null;
  function fill(el) {
    ensure();
    const w = el.getAttribute('data-w') || el.textContent || '';
    const gloss = el.getAttribute('data-gloss') || '';
    const gram = el.getAttribute('data-gram') || '';
    const ped = el.getAttribute('data-ped') || '';
    pop.innerHTML =
      `<span class="bp-w" lang="${isSanskritEl(el) ? 'sa-Latn' : 'pi-Latn'}">${esc(w)}</span>`
      + (gram ? `<span class="bp-gram">${esc(gram)}</span>` : '')
      + (gloss ? `<p class="bp-gloss">${esc(gloss)}</p>` : '')
      + (ped ? `<p class="bp-ped">${esc(ped)}</p>` : '');
  }
  const isSanskritEl = el => (el.closest('[data-lang]')?.getAttribute('data-lang') === 'sa');
  function place(el) {
    const r = el.getBoundingClientRect();
    pop.hidden = false;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const vw = innerWidth, vh = innerHeight, gap = 8;
    let top = r.bottom + gap;
    if (top + ph > vh - 4 && r.top - gap - ph > 4) top = r.top - gap - ph;
    top = Math.max(4, Math.min(top, vh - ph - 4));
    let left = Math.max(4, Math.min(r.left, vw - pw - 4));
    pop.style.top = `${Math.round(top)}px`; pop.style.left = `${Math.round(left)}px`;
  }
  function show(el, asPinned) {
    ensure(); trigger = el; pinned = !!asPinned; fill(el); place(el);
    el.setAttribute('aria-describedby', 'bud-pop'); el.setAttribute('aria-expanded', 'true');
  }
  function hide() {
    if (timer) { clearTimeout(timer); timer = 0; }
    if (pop) pop.hidden = true;
    if (trigger) { trigger.removeAttribute('aria-describedby'); trigger.setAttribute('aria-expanded', 'false'); }
    trigger = null; pinned = false;
  }
  function schedule(el) { if (timer) clearTimeout(timer); timer = setTimeout(() => { timer = 0; if (!pinned) show(el, false); }, SHOW_DELAY); }
  function init(root) {
    if (started) return; started = true;
    (root || document).addEventListener('pointerover', e => { const t = triggerOf(e.target); if (!t || pinned) return; schedule(t); });
    (root || document).addEventListener('pointerout', e => {
      const t = triggerOf(e.target); if (!t) return;
      const to = e.relatedTarget; if (to && (to === pop || (pop && pop.contains(to)))) return;
      if (!pinned) hide();
    });
    (root || document).addEventListener('focusin', e => { const t = triggerOf(e.target); if (t) show(t, false); });
    (root || document).addEventListener('focusout', e => { const t = triggerOf(e.target); if (t && !pinned) setTimeout(() => { if (trigger === t) hide(); }, 0); });
    (root || document).addEventListener('click', e => {
      const t = triggerOf(e.target);
      if (!t) { if (!e.target.closest || !e.target.closest('.bud-pop')) hide(); return; }
      e.preventDefault();
      if (pinned && trigger === t) hide(); else show(t, true);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && trigger) { const t = trigger; hide(); try { t.focus(); } catch { /* */ } } });
    addEventListener('scroll', () => { if (pop && !pop.hidden) hide(); }, true);
    addEventListener('resize', () => { if (pop && !pop.hidden) hide(); });
  }
  return { init };
})();

// ── Render helpers ──────────────────────────────────────────────────────────

// The interactive text line: every word a keyboard-reachable button carrying
// its gloss/grammar/citation for the popover. Words join with single spaces —
// the reconstruction convention — so the line reads exactly as the source.
function renderLine(words, sanskrit) {
  const lang = sanskrit ? 'sa-Latn' : 'pi-Latn';
  const btns = words.map(w =>
    `<button type="button" class="bud-w" aria-expanded="false"`
    + ` data-w="${esc(w.w)}"`
    + (w.gloss ? ` data-gloss="${esc(w.gloss)}"` : '')
    + (w.gram ? ` data-gram="${esc(w.gram)}"` : '')
    + (w.ped ? ` data-ped="${esc(w.ped)}"` : '')
    + `>${esc(w.w)}</button>`).join(' ');
  return `<p class="bud-line" lang="${lang}">${btns}</p>`;
}

// The always-visible-on-demand word table — the AT / no-JS gloss surface.
// <details> is native, keyboard-operable and works with scripting off; the
// same words[] feeds both this and the inline popover (one source of truth).
function renderWordTable(words) {
  if (!words.length) return '';
  const rows = words.map(w => `<tr>
    <td class="l bud-wt-w">${esc(w.w)}</td>
    <td class="l">${esc(w.gloss || '')}</td>
    <td class="l bud-wt-gram">${esc(w.gram || '')}</td>
    <td class="l bud-wt-ped">${esc(w.ped || '')}</td></tr>`).join('');
  return `<details class="bud-words"><summary>Word by word (${words.length})</summary>
    <div class="table-scroll" style="overflow-x:auto"><table class="data bud-wtab">
      <thead><tr><th class="l">Word</th><th class="l">Gloss</th><th class="l">Grammar</th><th class="l">Dictionary</th></tr></thead>
      <tbody>${rows}</tbody></table></div></details>`;
}

function renderTranslation(r) {
  const t = translationOf(r);
  if (t == null) {
    return `<p class="bud-tr-null">No translation — this segment is a vagga colophon; the CC0 translation
      leaves it untranslated, so nothing is invented here. See the note below.</p>`;
  }
  return `<p class="bud-tr">${esc(cleanTr(t.text))}
    ${t.source ? `<span class="bud-tr-src"> — ${esc(t.source)}</span>` : ''}</p>`;
}

function renderNote(r) {
  const n = noteOf(r);
  return n ? `<p class="bud-note"><span class="bud-note-label">Note</span>${esc(n)}</p>` : '';
}

const LIC = {
  cc0: { cls: 'bud-lic-cc0', label: 'CC0' },
  'pd-age': { cls: 'bud-lic-pd', label: 'PD' },
  pd: { cls: 'bud-lic-pd', label: 'PD' },
  original: { cls: 'bud-lic-original', label: 'original' },
};
function renderFoot(r, text) {
  const src = srcOf(r);
  // Verse texts (Metta/Heart) stamp the licence at the text level, not per
  // record; the prose sutta (MN 118) stamps it per record. Prefer the record's
  // own stamp, fall back to the text's.
  const lic = licenceOf(r) || (text && text.licence) || null;
  let chips = '';
  if (lic && typeof lic === 'object') {
    const seen = new Set();
    for (const v of Object.values(lic)) {
      const key = String(v);
      if (seen.has(key) || !LIC[key]) continue; seen.add(key);
      chips += `<span class="bud-lic ${LIC[key].cls}">${LIC[key].label}</span>`;
    }
  }
  return `<div class="bud-foot">${chips}${src ? `<span class="bud-src">${esc(src)}</span>` : ''}</div>`;
}

// ── One segment record → a card ─────────────────────────────────────────────
function renderSegment(r, text) {
  const sanskrit = isSanskrit(r);
  const words = wordsOf(r);
  const anchor = `seg-${slug(r.ref)}`;
  const hay = fold([r.ref, lineText(r), (translationOf(r) || {}).text, words.map(w => `${w.w} ${w.gloss}`).join(' ')].join(' '));

  // A refrain-USE (MN 118 peyyāla): collapsed, honest, expandable to the full gloss.
  if (r.kind === 'refrain-use') return renderRefrainUse(r, text, anchor, hay);

  return `<article class="bud-seg" id="${esc(anchor)}" data-lang="${sanskrit ? 'sa' : 'pi'}" data-hay="${esc(hay)}">
    <div class="bud-head">
      <a class="bud-ref" href="#${esc(anchor)}">${esc(r.ref)}</a>
      ${r.section ? `<span class="bud-section">${esc(r.section)}</span>` : ''}
    </div>
    ${renderLine(words, sanskrit)}
    ${renderWordTable(words)}
    ${renderTranslation(r)}
    ${renderNote(r)}
    ${renderFoot(r, text)}
  </article>`;
}

function renderRefrainUse(r, text, anchor, hay) {
  const t = translationOf(r);
  const refId = r.refrain;
  let expanded = '';
  try {
    const words = expandRefrain(r, MN118_REFRAINS) || [];
    if (words.length) expanded = `<details class="bud-expand"><summary></summary>
      ${renderLine(words, false)}${renderWordTable(words)}</details>`;
  } catch { expanded = ''; }
  // Fallback: if the refrain could not be expanded, still show the Pāli line so
  // the reader sees the text (never a silent drop) — plain, un-glossed.
  if (!expanded && lineText(r)) {
    expanded = `<details class="bud-expand"><summary></summary>
      <p class="bud-line" lang="pi-Latn">${esc(lineText(r))}</p></details>`;
  }
  return `<article class="bud-seg bud-ruse" id="${esc(anchor)}" data-lang="pi" data-hay="${esc(hay)}">
    <div class="bud-head">
      <a class="bud-ref" href="#${esc(anchor)}">${esc(r.ref)}</a>
      ${r.section ? `<span class="bud-section">${esc(r.section)}</span>` : ''}
    </div>
    <p class="bud-ruse-tag">This repeats a refrain${refId ? ` — glossed in full above (<a class="bud-refrain-link" href="#refrain-${esc(slug(refId))}">${esc(refId)}</a>)` : ''}.</p>
    ${t ? `<p class="bud-tr">${esc(cleanTr(t.text))}${t.source ? `<span class="bud-tr-src"> — ${esc(t.source)}</span>` : ''}</p>` : ''}
    ${expanded}
    ${renderNote(r)}
    ${renderFoot(r, text)}
  </article>`;
}

// ── The peyyāla refrains, each glossed ONCE (MN 118 head panel) ─────────────
//    The refrain's fixed frame (words[]) is glossed word-by-word; a concrete
//    instance (samplePali → sampleTranslation) is shown as an example so the
//    reader sees the whole shape, not just the skeleton.
function renderRefrain(rf) {
  const words = Array.isArray(rf.words) ? rf.words : [];
  const sampleTr = rf.sampleTranslation || (rf.translation && (typeof rf.translation === 'string' ? rf.translation : rf.translation.text)) || '';
  const src = rf.src || '';
  return `<div class="bud-refrain" id="refrain-${esc(slug(rf.id))}">
    <p class="bud-refrain-label">${esc(rf.label || rf.id)}</p>
    ${rf.desc ? `<p class="bud-refrain-desc">${esc(rf.desc)}</p>` : ''}
    ${words.length ? renderLine(words, false) : ''}
    ${renderWordTable(words)}
    ${rf.samplePali ? `<p class="bud-line" lang="pi-Latn"><span class="bud-tradition">e.g. </span>${esc(rf.samplePali)}</p>` : ''}
    ${sampleTr ? `<p class="bud-tr">${esc(cleanTr(sampleTr))}</p>` : ''}
    ${src ? `<div class="bud-foot"><span class="bud-src">${esc(src)}</span></div>` : ''}
  </div>`;
}

// ── CONTESTED cruxes → ⚑ both-positions panels ─────────────────────────────
function renderContested(list) {
  if (!Array.isArray(list) || !list.length) return '';
  return list.map(c => `<section class="bud-crux" aria-labelledby="crux-${esc(slug(c.id || c.title))}">
    <h3 class="bud-crux-title" id="crux-${esc(slug(c.id || c.title))}">${esc(c.title || c.id)}</h3>
    ${(c.positions || []).map(p => `<div class="bud-crux-pos">
      <b>${esc(p.label || '')}</b>
      <p>${esc(p.claim || '')}</p>
      ${p.sources ? `<span class="bud-crux-src">${esc(p.sources)}</span>` : ''}
    </div>`).join('')}
    <p class="small muted">Both positions are reported; neither is resolved here.</p>
  </section>`).join('');
}

// ── The reading room (metta / heart / mn118) ────────────────────────────────
function initRoom(id) {
  const host = $('bud-room');
  if (!host) return;
  const text = textById(id) || BUDDHIST_TEXTS.find(t => t.id === id) || null;
  let records = [];
  try { records = recordsFor(id) || []; } catch { records = []; }

  // MN 118: the refrains, glossed once, ride at the top of the stream.
  let refrainHTML = '';
  if (id === 'mn118' && Array.isArray(MN118_REFRAINS) && MN118_REFRAINS.length) {
    refrainHTML = `<h2 class="bud-section-head" id="refrains">The refrains (peyyāla) — glossed once</h2>
      <p class="small muted" style="max-width:var(--measure)">This discourse repeats fixed blocks — the manuscript
        tradition itself abbreviates them with <i>…pe…</i>. Each refrain is glossed in full here; where it recurs
        below it is shown collapsed, with a toggle to expand the full word-by-word. Nothing is silently dropped.</p>
      ${MN118_REFRAINS.map(renderRefrain).join('')}`;
  }

  // Contested cruxes (heart-origins etc.) surface above the text stream.
  const contestedHTML = renderContested(text && text.contested);

  // Group the segment stream by `section` (prose suttas); print a divider when
  // the section changes. Verse texts have no sections → one flat stream.
  let lastSection = null;
  const segHTML = records.map(r => {
    let head = '';
    if (r.section && r.section !== lastSection) {
      lastSection = r.section;
      head = `<h2 class="bud-section-head" id="sec-${slug(r.section)}">${esc(r.section)}</h2>`;
    }
    return head + renderSegment(r, text);
  }).join('');

  // MN 118 section nav rail (jump to any section).
  let railHTML = '';
  if (id === 'mn118') {
    const secs = [];
    const seen = new Set();
    for (const r of records) if (r.section && !seen.has(r.section)) { seen.add(r.section); secs.push(r.section); }
    if (secs.length) railHTML = `<details class="bud-rail"><summary>Jump to a section (${secs.length})</summary>
      <ul class="clean">${secs.map(s => `<li><a href="#sec-${slug(s)}">${esc(s)}</a></li>`).join('')}</ul></details>`;
  }

  host.innerHTML = contestedHTML + railHTML + refrainHTML
    + (records.length ? `<h2 class="bud-section-head" id="text">${esc((text && text.title) || 'The text')}</h2>` : '')
    + segHTML;

  WordPop.init(document);

  // Client-side filter (hide/show rendered cards — DOM stays put).
  const filter = $('bud-filter');
  const count = $('bud-filter-count');
  if (filter) {
    const arts = Array.from(host.querySelectorAll('.bud-seg'));
    const apply = () => {
      const needle = fold(filter.value).trim();
      let shown = 0;
      for (const art of arts) {
        const hit = !needle || (art.dataset.hay || '').includes(needle);
        art.style.display = hit ? '' : 'none';
        if (hit) shown++;
      }
      if (count) count.textContent = needle ? `${shown} of ${arts.length} segments` : `${arts.length} segments`;
    };
    filter.addEventListener('input', apply);
    apply();
  }
}

// ── The wing hub: live counts + a cross-text word search ────────────────────
function initIndex() {
  const cEl = $('bud-counts');
  if (cEl) {
    let stats = null;
    try { stats = buddhistStats(); } catch { stats = null; }
    const rows = BUDDHIST_TEXTS.map(t => {
      const segs = (t.segments != null) ? t.segments : ((() => { try { return (recordsFor(t.id) || []).length; } catch { return ''; } })());
      const words = (t.words != null) ? t.words : '';
      return `<tr>
        <td class="l"><a href="${esc(PAGE_OF[t.id] || '#')}">${esc(t.title)}</a>
          ${t.titleOriginal ? `<br><span class="bud-tradition" lang="${t.lang === 'sa' ? 'sa-Latn' : 'pi-Latn'}">${esc(t.titleOriginal)}</span>` : ''}</td>
        <td class="l"><span class="bud-tradition">${esc(t.tradition || '')}</span></td>
        <td class="r">${esc(segs)}</td>
        <td class="r">${esc(words)}</td>
      </tr>`;
    }).join('');
    const total = stats
      ? `<tr class="bud-total"><td class="l">Total</td><td></td><td class="r">${esc(stats.segments ?? '')}</td><td class="r">${esc(stats.glossedWords ?? '')}</td></tr>`
      : '';
    cEl.innerHTML = `<div class="table-scroll" style="overflow-x:auto"><table class="data bud-counts">
      <thead><tr><th class="l">Text</th><th class="l">Tradition</th><th class="r">Segments</th><th class="r">Glossed words</th></tr></thead>
      <tbody>${rows}${total}</tbody></table></div>
      <p class="small muted">Counted live from the data. These three texts are word-by-word'd in full; the wider
        canon is catalogued, not yet glossed — see the honest note below.</p>`;
  }

  // A small cross-text word search (app-layer; the pure core exposes no search).
  const q = $('bud-q'), out = $('bud-results');
  if (!q || !out) return;
  // Build a light index once.
  const index = [];
  for (const t of BUDDHIST_TEXTS) {
    let recs = [];
    try { recs = recordsFor(t.id) || []; } catch { recs = []; }
    for (const r of recs) {
      const tr = translationOf(r);
      index.push({
        id: t.id, ref: r.ref, page: PAGE_OF[t.id] || '#', anchor: `seg-${slug(r.ref)}`,
        line: lineText(r), tr: tr ? cleanTr(tr.text) : '',
        hay: fold([r.ref, lineText(r), tr ? tr.text : '', wordsOf(r).map(w => `${w.w} ${w.gloss}`).join(' ')].join(' ')),
      });
    }
  }
  const run = () => {
    const term = fold(q.value).trim();
    if (!term) { out.innerHTML = '<p class="small muted">Type a word — Pāli, Sanskrit, or English (plain ASCII is fine).</p>'; return; }
    const hits = index.filter(x => x.hay.includes(term));
    if (!hits.length) { out.innerHTML = `<p class="small muted">No segment matches “${esc(q.value.trim())}”.</p>`; return; }
    const shown = hits.slice(0, 60);
    out.innerHTML = `<p class="small muted">${hits.length} match${hits.length === 1 ? '' : 'es'}${hits.length > shown.length ? ` — showing the first ${shown.length}` : ''}:</p>
      <ul class="bud-hits clean">${shown.map(x => `<li>
        <a href="${esc(x.page)}#${esc(x.anchor)}"><b>${esc(x.ref)}</b></a>
        <span class="bud-hit-line" lang="${x.id === 'heart' ? 'sa-Latn' : 'pi-Latn'}">${esc(trim(x.line, 70))}</span>
        <span class="bud-hit-tr small muted">${esc(trim(x.tr, 110))}</span></li>`).join('')}</ul>`;
  };
  q.addEventListener('input', run);
  run();
}

function trim(s, n) { s = String(s ?? ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

// ── Dispatch ────────────────────────────────────────────────────────────────
export function initBuddhist(page) {
  try { initGlosstip(); } catch { /* non-fatal: prose glosses degrade to links */ }
  switch (page) {
    case 'index': return initIndex();
    case 'metta': return initRoom('metta');
    case 'heart': return initRoom('heart');
    case 'mn118': return initRoom('mn118');
    default: return;   // sources.html is static prose
  }
}

export default { initBuddhist };
