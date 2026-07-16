// ============================================================================
//  rail.js — the opt-in RESULTS RAIL (in-page nav) for long tool pages.
//  Plan §1.3.8 / revamp WP3. This module is ADDITIVE and is loaded ONLY by the
//  pages that import it (no page pays for it otherwise). It reads the static
//  `section.panel[id]` blocks a page declares, builds a sticky <nav class="rail">
//  of anchor links, wires ONE IntersectionObserver to light the section in view
//  (`.is-here`), and lays the page out as a content column + sticky rail using
//  the DS2 `.rail` / `main.with-rail` classes already shipped in style.css.
//
//  No style.css edits: the grid placement (force content into column 1, span the
//  rail down column 2) is applied here via inline styles, so the shipped
//  `main.with-rail` grid rule is enough. Below 1100px the shipped CSS collapses
//  the rail to a sticky horizontal chip bar; the inline grid styles are inert
//  there (the parent is not a grid), so nothing needs undoing.
//
//  A short rail label comes from `data-rail` on each panel when present, else the
//  panel's `.panel-title` / first heading. Ids are never touched — the rail only
//  reads them — so autolinkers, tests and deep links keep working.
// ============================================================================

export function mountRail(opts = {}) {
  const main = document.querySelector(opts.main || 'main');
  if (!main) return null;
  // Idempotent: never build the rail twice on one page.
  if (main.querySelector(':scope > nav.rail')) return null;

  const panelSel = opts.panelSelector || 'section.panel[id]';
  const panels = Array.from(main.querySelectorAll(panelSel)).filter(p => p.id);
  if (panels.length < (opts.min || 3)) return null;   // not worth a rail

  const nav = document.createElement('nav');
  nav.className = 'rail';
  nav.setAttribute('aria-label', opts.label || 'On this reading');
  const ol = document.createElement('ol');

  const short = t => {
    t = String(t || '').replace(/\s+/g, ' ').trim();
    // Drop trailing " — provenance/citation" clauses, then cap the length.
    t = t.split(/\s+[—–]\s+/)[0].replace(/\s*[—–-]\s*$/, '').trim();
    return t.length > 30 ? t.slice(0, 29).trim() + '…' : t;
  };

  const linkFor = new Map();
  for (const p of panels) {
    const titleEl = p.querySelector('.panel-title') || p.querySelector('h2') || p.querySelector('h3');
    const raw = p.dataset.rail || (titleEl ? titleEl.textContent : p.id);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + p.id;
    a.textContent = short(raw);
    li.appendChild(a);
    ol.appendChild(li);
    linkFor.set(p.id, a);
  }
  nav.appendChild(ol);

  // Lay out main as [full-width intro] over [content column | sticky rail]. The
  // anchor is the DIRECT child of main that carries (or contains — panels may be
  // nested in a grid wrapper) the first rail target: everything before it stays
  // full-width (crumb / heading / honest note / form / verdict banner), and from
  // it onward stacks in column 1 with the rail spanning those rows down column 2
  // (row span kept exact so `position:sticky` has room to travel).
  main.classList.add('with-rail');
  const kids = Array.from(main.children);
  let ref = panels[0];
  while (ref.parentElement && ref.parentElement !== main) ref = ref.parentElement;
  const k = Math.max(0, kids.indexOf(ref));
  kids.forEach((child, i) => { child.style.gridColumn = i < k ? '1 / -1' : '1'; });
  main.insertBefore(nav, ref);
  nav.style.gridColumn = '2';
  nav.style.gridRow = (k + 1) + ' / span ' + Math.max(1, kids.length - k);

  // Highlight the section in view. One observer; we only toggle a class, so the
  // behaviour is colour-only and reduced-motion-safe by construction.
  let currentId = null;
  const setHere = id => {
    if (id === currentId) return;
    if (currentId && linkFor.get(currentId)) linkFor.get(currentId).classList.remove('is-here');
    currentId = id;
    if (id && linkFor.get(id)) linkFor.get(id).classList.add('is-here');
  };
  const vis = new Map();
  const io = new IntersectionObserver(entries => {
    for (const e of entries) vis.set(e.target.id, e.isIntersecting);
    let pick = null;
    for (const p of panels) { if (vis.get(p.id)) { pick = p.id; break; } }
    if (pick) setHere(pick);
  }, { rootMargin: opts.rootMargin || '-12% 0px -72% 0px', threshold: 0 });
  panels.forEach(p => io.observe(p));

  return { nav, panels };
}
