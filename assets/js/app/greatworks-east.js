// ============================================================================
//  greatworks-east.js (app) — renders THE GREAT WORKS · Eastern masters wing
//  from the cited data module core/data/greatworks-east.js (built by
//  B-east-data). GREAT_WORKS_EAST uses the SAME record shape as GREAT_WORKS, so
//  this module reuses the Western renderer's building blocks verbatim
//  (injectCss + authorSection + workRail + the filter/rail wiring) — only the
//  data source and the hub page differ. DOM lives here; the data stays pure.
//
//  Two render modes, chosen by #gw-root's data-gw attribute:
//    • data-gw="east"                         → the Eastern-masters hub (author
//                                                cards + the shared framing note)
//    • data-gw="varahamihira" | "yogananda"…  → one author dossier: each work a
//                                                collapsible chapter table with
//                                                "on this site" chips, the
//                                                described-never-prescribed box,
//                                                PD-status + PD sources, and the
//                                                ordered study path — identical
//                                                layout to the Western pages.
//
//  Cross-links are page-relative ("../" + the pages/-relative path stored in the
//  data); this file drives pages/greatworks/*.html (one level under pages/), so
//  "../" reaches any other pages/ target.
// ============================================================================
import { GREAT_WORKS_EAST, EG_CITATION, EG_METHOD_NOTE } from '../core/data/greatworks-east.js';
import { injectCss, authorSection, workRail, wireFilter, wireRail } from './greatworks.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const chapterCount = a => (a.works || []).reduce((n, w) => n + (w.chapters || []).length, 0);

// GREAT_WORKS_EAST is a bare author ARRAY (B-east-data's contract), unlike the
// Western GREAT_WORKS which wraps its list in { authors:[…] }. Normalise both so
// the wing is resilient to either shape.
const AUTHORS = Array.isArray(GREAT_WORKS_EAST) ? GREAT_WORKS_EAST : (GREAT_WORKS_EAST && GREAT_WORKS_EAST.authors) || [];

// The hub cards live on east.html; each author has its own per-author page named
// by id (varahamihira.html, yogananda.html, vivekananda.html).
const PAGE_OF_EAST = { varahamihira: 'varahamihira', yogananda: 'yogananda', vivekananda: 'vivekananda' };

function indexCard(a) {
  const page = PAGE_OF_EAST[a.id] || a.id;
  return `<a class="card gw-authcard" href="${esc(page)}.html">
    <span class="gw-glyph" aria-hidden="true">${esc(a.glyph || '✶')}</span>
    <h3>${esc(a.name)}</h3>
    <span class="gw-count">${(a.works || []).length} work${(a.works || []).length === 1 ? '' : 's'} · ${chapterCount(a)} chapters · ${esc(a.dates)}</span>
    <p class="small" style="margin:.4rem 0 0">${esc(a.who)}</p>
  </a>`;
}

// ---------------------------------------------------------------------------
//  The Eastern-masters hub (east.html)
// ---------------------------------------------------------------------------
function renderHub(root) {
  const authors = AUTHORS;
  root.innerHTML = `
  <div class="gw-cards">${authors.map(indexCard).join('')}</div>

  <h2>How to read these masters</h2>
  <div class="callout science"><span class="label">Primary sources in the history of ideas — described, never prescribed</span>
    Each figure here is studied as a <b>historical author</b>, mapped chapter-by-chapter onto the Workbench tools that
    <b>compute what the book describes</b> — Varāhamihira's natal manual onto the <b>Vedic (sidereal) engine</b>,
    Vivekananda's <i>Raja Yoga</i> onto the <b>Yoga Sūtras wing</b> (as <em>his</em> rendering), Yogananda's
    <i>Autobiography</i> onto the <b>vedic-remedies museum piece</b>. No predictive validity is claimed for any of it;
    every miracle or efficacy claim is catalogued as the <b>book's claim</b>, page-cited, never endorsed.</div>

  <h3>What we quote, and what we only cite</h3>
  <div class="gw-legend">
    <div class="card"><span class="badge badge--ok">PD · quote-safe</span>
      <p class="small" style="margin:.4rem 0 0">The cited edition is <b>US public domain</b> — e.g. Iyer's <i>Bṛhat
        Jātaka</i> (1885) and Sastri's (1929), Vivekananda's <i>Raja Yoga</i> (1896), and the <b>1946 first edition</b>
        of the <i>Autobiography of a Yogi</i>. Short quotation is permitted, always edition-cited.</p></div>
    <div class="card"><span class="badge badge--bad">Cite-only</span>
      <p class="small" style="margin:.4rem 0 0">The standard edition is <b>in copyright</b>: described and page-cited,
        <b>never quoted</b> — every <b>post-1946 revised</b> SRF edition of the <i>Autobiography</i> (added ch. 49, new
        photographs), the modern <i>Complete Works</i> resets, the 1946 <i>Bṛhat Saṁhitā</i> (US PD 2042).</p></div>
    <div class="card"><span class="badge badge--con">Claims &amp; contested</span>
      <p class="small" style="margin:.4rem 0 0">Miracle narratives are <b>the author's claims</b> (Yogananda's
        materializations, resurrection, inedia — reported, never endorsed); contested points keep <b>both positions</b>
        (Varāhamihira's traditional dates; the <i>Kriya-Yoga</i> vs <i>kriyā-yoga</i> term collision).</p></div>
  </div>

  <h2>How this was verified</h2>
  <p class="small muted">${esc(EG_METHOD_NOTE || '')}</p>
  <p class="small muted" style="margin-top:.6rem"><b>Cite this wing:</b> ${esc(EG_CITATION || '')}</p>`;
}

// ---------------------------------------------------------------------------
//  Per-author dossiers — reuses the Western renderer's authorSection + rail +
//  filter so the two wings are pixel-identical.
// ---------------------------------------------------------------------------
function renderAuthorsEast(root, ids) {
  const authors = ids.map(id => AUTHORS.find(a => a.id === id)).filter(Boolean);
  const filter = `<div class="filterbar">
    <label for="gw-search" class="small muted" style="flex:0 0 auto">Filter chapters by title or subject</label>
    <input id="gw-search" class="filter-input" type="search" placeholder="e.g. daśā, samādhi, kriya, longevity, aṣṭakavarga…" autocomplete="off">
    <span id="gw-count" class="filter-count" role="status" aria-live="polite"></span>
  </div>`;
  root.innerHTML = `<div class="gw-layout">
    <div class="gw-main">${filter}${authors.map(authorSection).join('')}</div>
    ${workRail(authors)}
  </div>`;
  wireFilter(root);
  wireRail(root);
}

// ---------------------------------------------------------------------------
//  Entry point
// ---------------------------------------------------------------------------
export function initGreatWorksEast() {
  injectCss();
  const root = document.getElementById('gw-root');
  if (!root) return;
  const mode = (root.dataset.gw || '').trim();
  if (!mode || mode === 'east') { renderHub(root); return; }
  renderAuthorsEast(root, mode.split(',').map(s => s.trim()).filter(Boolean));
}
