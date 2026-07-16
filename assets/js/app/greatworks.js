// ============================================================================
//  greatworks.js (app) — renders THE GREAT WORKS wing from the cited data
//  module (core/data/greatworks.js, one source of truth). DOM lives here; the
//  data stays pure in core/**.
//
//  Two render modes, chosen by the root element's data attribute:
//    • data-gw="index"                → the wing map (author cards + framing +
//                                        the PD-framework and site-mapping legends)
//    • data-gw="hall" | "levi,ficino…"→ one or more author dossiers: each work a
//                                        collapsible chapter/treatise table with
//                                        "on this site" cross-link chips, a
//                                        described-never-prescribed magic box, the
//                                        PD-status box + PD-source pointers, and
//                                        the ordered STUDY PATH with tool chips.
//  A single client-side filter per author page narrows chapters by title/gist.
//  NO assistant panels anywhere.
//
//  Cross-links are page-relative ("../" + the pages/-relative path stored in the
//  data); this file lives one level under pages/ (pages/greatworks/…), so "../"
//  reaches any other pages/ target.
// ============================================================================
import { GREAT_WORKS, GW_CITATION, GW_METHOD_NOTE } from '../core/data/greatworks.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// A page-relative href for a pages/-relative path (e.g. "picatrix/kameas.html").
const href = path => `../${path}`;

const chapterCount = a => a.works.reduce((n, w) => n + (w.chapters || []).length, 0);

// ---------------------------------------------------------------------------
//  Scoped styles — injected once so no site CSS is touched (all .gw- prefixed).
// ---------------------------------------------------------------------------
const GW_CSS = `
.gw-cards { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); margin:1rem 0; }
.gw-authcard { display:flex; flex-direction:column; }
.gw-authcard .gw-glyph { font-size:1.8rem; line-height:1; color:var(--gold); }
.gw-authcard h3 { margin:.3rem 0 .1rem; }
.gw-authcard .gw-count { font-family:var(--sans); font-size:.72rem; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
.gw-legend { display:grid; gap:.6rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
.gw-author { margin:2rem 0; }
.gw-author > h2 .gw-glyph { color:var(--gold); margin-right:.35rem; }
.gw-filter { margin:.8rem 0; }
.gw-filter input { width:100%; max-width:420px; font:inherit; padding:.45rem .6rem; border:1px solid var(--rule); border-radius:7px; background:#fff; color:var(--ink); }
details.gw-work { border:1px solid var(--rule); border-radius:10px; background:var(--card); margin:.7rem 0; padding:0 .9rem; }
details.gw-work[open] { padding-bottom:.9rem; }
details.gw-work > summary { cursor:pointer; padding:.75rem .1rem; font-family:var(--serif); font-size:1.08rem; font-weight:700; color:var(--link); list-style:none; }
details.gw-work > summary::-webkit-details-marker { display:none; }
details.gw-work > summary::before { content:"▸"; color:var(--gold); margin-right:.5rem; font-size:.9em; }
details.gw-work[open] > summary::before { content:"▾"; }
.gw-sub { font-family:var(--sans); font-weight:400; font-size:.8rem; color:var(--muted); }
.gw-badge { display:inline-block; font-family:var(--sans); font-size:.62rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; padding:.12rem .45rem; border-radius:99px; margin-left:.4rem; vertical-align:middle; }
.gw-badge.quote { background:#d8efd6; color:#1f5e1d; }
.gw-badge.cite { background:#f6dcd6; color:#8a2f1c; }
.gw-badge.spurious { background:#f3d2b0; color:#7a3d06; }
.gw-pd { border-left:4px solid var(--air); background:#eef5fa; padding:.55rem .8rem; border-radius:0 8px 8px 0; margin:.5rem 0; font-size:.9rem; }
.gw-pd.cite { border-color:#b5482f; background:#fbefec; }
.gw-flag { border-left:4px solid var(--gold); background:#fbf4e2; padding:.4rem .7rem; border-radius:0 8px 8px 0; margin:.35rem 0; font-size:.86rem; }
.gw-flag.crit { border-color:#b5482f; background:#fbefec; }
.gw-magic { border-left:4px solid #7a5cad; background:#f3effa; padding:.55rem .8rem; border-radius:0 8px 8px 0; margin:.6rem 0; font-size:.88rem; }
.gw-magic .gw-mlabel { font-family:var(--sans); font-size:.66rem; letter-spacing:.1em; text-transform:uppercase; font-weight:700; color:#5a3f8a; display:block; margin-bottom:.2rem; }
.gw-chip { display:inline-block; font-family:var(--sans); font-size:.68rem; font-weight:600; padding:.14rem .5rem; margin:.12rem .18rem .12rem 0; border-radius:6px; background:#e7eef7; color:#2b4a6b; text-decoration:none; border:1px solid #cfdcec; }
a.gw-chip:hover { background:#d6e6f6; border-color:#2b4a6b; }
.gw-tools { font-size:.82rem; color:var(--muted); margin-top:.2rem; }
.gw-cflag { font-size:.82rem; color:#7a5a06; margin-top:.2rem; }
.gw-src { font-size:.86rem; margin:.15rem 0; }
.gw-path { margin-top:.7rem; }
.gw-path ol { padding-left:1.3rem; }
.gw-path li { margin:.55rem 0; }
.gw-steptools { margin-top:.2rem; }
.gw-hidden { display:none !important; }
tr.gw-gap td { background:#f4ecd6 !important; color:#6b6450; font-style:italic; }
`;

function injectCss() {
  if (document.getElementById('gw-css')) return;
  const s = document.createElement('style');
  s.id = 'gw-css';
  s.textContent = GW_CSS;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
//  Shared fragments
// ---------------------------------------------------------------------------
function mappingChips(chapter) {
  const sm = chapter.siteMapping || [];
  const chips = sm.map(x => `<a class="gw-chip" href="${esc(href(x.path))}">${esc(x.label)} ↗</a>`).join('');
  const tools = chapter.toolsCharts ? `<div class="gw-tools">${esc(chapter.toolsCharts)}</div>` : '';
  const cflag = chapter.flag ? `<div class="gw-cflag">⚑ ${esc(chapter.flag)}</div>` : '';
  return chips || tools || cflag ? `${chips}${tools}${cflag}` : '<span class="muted small">—</span>';
}

function chapterRow(chapter) {
  const isGap = /no treatise/i.test(chapter.title || '');
  const search = `${chapter.ref} ${chapter.title} ${chapter.gist || ''}`.toLowerCase();
  const magic = chapter.spellsMagic
    ? `<div class="gw-tools"><b>Magic, described:</b> ${esc(chapter.spellsMagic)}</div>` : '';
  return `<tr class="${isGap ? 'gw-gap' : ''}" data-search="${esc(search)}">
    <td class="l" style="white-space:nowrap"><b>${esc(chapter.ref)}</b></td>
    <td class="l"><b>${esc(chapter.title)}</b>${chapter.gist ? `<br><span class="small">${esc(chapter.gist)}</span>` : ''}${magic}</td>
    <td class="l">${mappingChips(chapter)}</td>
  </tr>`;
}

function pdSourceList(work) {
  const items = (work.pdSources || []).map(s =>
    `<li class="gw-src"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join('');
  return items ? `<p class="small muted" style="margin:.5rem 0 .2rem">Read the source (external, opens a new tab):</p><ul class="clean">${items}</ul>` : '';
}

function workBlock(work) {
  const unit = work.unit || 'Chapter';
  const rows = (work.chapters || []).map(chapterRow).join('');
  const cite = work.quoteSafe === false;
  const badge = work.spurious
    ? '<span class="gw-badge spurious">Spurious · flagged</span>'
    : (cite ? '<span class="gw-badge cite">Cite-only</span>' : '<span class="gw-badge quote">PD · quote-safe</span>');
  const flags = (work.flags || []).map(f => {
    const crit = /^(CRITICAL|CITE-ONLY|THE NUMBERING GAP)/.test(f) || /NOT by Agrippa/.test(f);
    return `<div class="gw-flag${crit ? ' crit' : ''}">⚑ ${esc(f)}</div>`;
  }).join('');
  const magic = (work.spellsMagic || []).length
    ? `<div class="gw-magic"><span class="gw-mlabel">Magic — described, never prescribed</span>${work.spellsMagic.map(s => `<div>${esc(s)}</div>`).join('')}</div>`
    : '';
  const subtitle = work.subtitle ? ` <span class="gw-sub">— ${esc(work.subtitle)}</span>` : '';
  return `<details class="gw-work" id="gw-w-${esc(slug(work.id))}">
    <summary>${esc(work.title)}${subtitle} <span class="gw-sub">(${esc(String(work.year))})</span>${badge}</summary>
    <p class="small muted" style="margin:.3rem 0"><b>Edition:</b> ${esc(work.edition)}</p>
    <div class="gw-pd${cite ? ' cite' : ''}"><b>Public domain:</b> ${esc(work.pdStatus)}</div>
    ${flags}
    <table class="data"><thead><tr><th class="l">Ref</th><th class="l">${esc(unit)}</th><th class="l">On this site</th></tr></thead>
    <tbody>${rows}</tbody></table>
    ${magic}
    ${pdSourceList(work)}
  </details>`;
}

function studyPathBlock(author) {
  const steps = (author.studyPath || []).map(s => {
    const tools = (s.tools || []).map(t => `<a class="gw-chip" href="${esc(href(t.path))}">${esc(t.label)} ↗</a>`).join('');
    return `<li>${esc(s.text)}${tools ? `<div class="gw-steptools">${tools}</div>` : ''}</li>`;
  }).join('');
  return `<div class="gw-path"><h3>Study path — ${esc(author.name)}</h3>
    <p class="small muted">An ordered lesson list. Each step pairs the reading with the site tool that computes what the book describes.</p>
    <ol>${steps}</ol></div>`;
}

function authorSection(author) {
  const links = (author.siteLinks || []).map(l =>
    `<a class="gw-chip" href="${esc(href(l.path))}">${esc(l.label)} ↗</a>`).join('');
  const works = author.works.map(workBlock).join('');
  return `<section class="gw-author" id="gw-a-${esc(author.id)}">
    <h2><span class="gw-glyph">${esc(author.glyph || '✶')}</span>${esc(author.name)}
      <span class="gw-sub">${esc(author.dates)}</span></h2>
    <p>${esc(author.line)}</p>
    ${links ? `<p>${links}</p>` : ''}
    <h3>The works</h3>
    ${works}
    ${studyPathBlock(author)}
  </section>`;
}

// ---------------------------------------------------------------------------
//  The wing map (index)
// ---------------------------------------------------------------------------
// Author pages group the 9 authors onto 6 pages; the index cards point at those
// pages (Lévi/Ficino/Iamblichus/Regardie share kin.html).
const PAGE_OF = { hall: 'hall', hermetica: 'hermetica', crowley: 'crowley', dee: 'dee', agrippa: 'agrippa', levi: 'kin', ficino: 'kin', iamblichus: 'kin', regardie: 'kin' };

function indexCard(a) {
  const page = PAGE_OF[a.id] || a.id;
  return `<a class="card gw-authcard" href="${esc(page)}.html">
    <span class="gw-glyph" aria-hidden="true">${esc(a.glyph || '✶')}</span>
    <h3>${esc(a.name)}</h3>
    <span class="gw-count">${a.works.length} work${a.works.length === 1 ? '' : 's'} · ${chapterCount(a)} chapters · ${esc(a.dates)}</span>
    <p class="small" style="margin:.4rem 0 0">${esc(a.who)}</p>
  </a>`;
}

function renderIndex(root) {
  root.innerHTML = `
  <div class="gw-cards">${GREAT_WORKS.authors.map(indexCard).join('')}</div>

  <h2>How to read this wing</h2>
  <div class="callout science"><span class="label">These are the books as historical documents</span>
    Every author here is studied as a <b>primary source in the history of ideas</b> — described, never prescribed, with
    no validity claimed for its magic or its cosmology. Where a book catalogues "magic" — Agrippa’s seals, Crowley’s
    rituals, the Hermetic god-making rite — this wing catalogues it too, as a <b>museum piece</b> (with its publication
    history in place of instructions). Nothing here is taught operationally.</div>

  <h3>What we quote, and what we only cite</h3>
  <div class="gw-legend">
    <div class="card"><span class="chip done">PD · quote-safe</span>
      <p class="small" style="margin:.4rem 0 0">The cited edition is <b>US public domain</b> (verified under the 95-year
        rule + renewal evidence). Short quotation is permitted, always edition-cited — e.g. Hall’s <i>Secret Teachings</i>
        (1928), Mead’s Hermetica (1906), the 1651 Agrippa, Waite’s Lévi (1896), Newton’s Emerald Tablet.</p></div>
    <div class="card"><span class="chip" style="background:#f6dcd6;color:#8a2f1c">Cite-only</span>
      <p class="small" style="margin:.4rem 0 0">The standard edition is <b>in copyright</b>: described and page-cited,
        <b>never quoted</b>, no images — Crowley’s <i>Book of Thoth</i> (1944, PD 2040), Regardie’s <i>Golden Dawn</i>
        (renewal unverified), Josten’s Monas, Copenhaver’s Hermetica, Kaske &amp; Clark’s Ficino.</p></div>
    <div class="card"><span class="chip" style="background:#f3d2b0;color:#7a3d06">Contested / spurious</span>
      <p class="small" style="margin:.4rem 0 0">Legendary, fringe or misattributed material is <b>flagged in-data and
        never resolved</b> — Hall’s Atlantis (his claim), the Corpus Hermeticum <b>XV</b> numbering gap (shown, not
        renumbered), the <b>spurious Fourth Book</b> of Agrippa.</p></div>
  </div>

  <h3>The site-mapping legend</h3>
  <div class="callout"><span class="label">Chapters link to the tools that compute what the book describes</span>
    Each chapter row carries <b>"on this site" chips</b> — cross-links into the live engines. Agrippa II.22 links to the
    <b>kameas</b> that build his planetary squares; the Hermetic decan excerpt links to the <b>36 faces</b>; Crowley’s
    777 links to the <b>Tree of Life</b> whose Key Scale rows <em>are</em> 777’s rows. The point of the wing is to read
    the book and then watch the site reproduce its calculation.</div>

  <h2>How this was verified</h2>
  <p class="small muted">${esc(GW_METHOD_NOTE)}</p>
  <p class="small muted" style="margin-top:.6rem"><b>Cite this wing:</b> ${esc(GW_CITATION)}</p>`;
}

// ---------------------------------------------------------------------------
//  Per-author page + the single client-side filter
// ---------------------------------------------------------------------------
function renderAuthors(root, ids) {
  const authors = ids.map(id => GREAT_WORKS.authors.find(a => a.id === id)).filter(Boolean);
  const filter = `<div class="gw-filter">
    <label for="gw-search" class="small muted">Filter chapters by title or subject</label><br>
    <input id="gw-search" type="search" placeholder="e.g. tarot, sephiroth, decan, geomancy, alchemy…" autocomplete="off">
    <span id="gw-count" class="small muted" role="status" aria-live="polite" style="margin-left:.5rem"></span>
  </div>`;
  root.innerHTML = filter + authors.map(authorSection).join('');
  wireFilter(root);
}

function wireFilter(root) {
  const input = $('gw-search');
  const countEl = $('gw-count');
  if (!input) return;
  const rows = Array.from(root.querySelectorAll('tr[data-search]'));
  const works = Array.from(root.querySelectorAll('details.gw-work'));
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach(r => {
      const match = !q || r.dataset.search.includes(q);
      r.classList.toggle('gw-hidden', !match);
      if (match) shown++;
    });
    // Hide works with no visible non-gap rows; auto-open matching works when searching.
    works.forEach(w => {
      const visible = Array.from(w.querySelectorAll('tr[data-search]')).some(r => !r.classList.contains('gw-hidden') && !r.classList.contains('gw-gap'));
      w.classList.toggle('gw-hidden', !!q && !visible);
      if (q && visible) w.open = true;
      if (!q) w.open = false;
    });
    countEl.textContent = q ? `${shown} chapter${shown === 1 ? '' : 's'} match` : '';
  };
  input.addEventListener('input', apply);
}

// ---------------------------------------------------------------------------
//  Entry point
// ---------------------------------------------------------------------------
export function initGreatWorks() {
  injectCss();
  const root = document.getElementById('gw-root');
  if (!root) return;
  const mode = (root.dataset.gw || '').trim();
  if (!mode || mode === 'index') { renderIndex(root); return; }
  renderAuthors(root, mode.split(',').map(s => s.trim()).filter(Boolean));
}
