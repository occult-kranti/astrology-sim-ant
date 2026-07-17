// ============================================================================
//  app/vedic-course.js — the Parāśarī course (pages/vedic/course.html).
//
//  A TEACHING page composing existing computed tools — no engine, no external
//  data. This module does one small thing: a scroll-spy that keeps the sticky
//  in-page unit navigator in sync with the section currently under the sticky
//  bar (and reflects the URL hash on load / on click).
//
//  Site invariants honoured:
//   • DOM only here (this is app/, not core/). No animation-frame scheduling —
//     the highlight is a class/attribute toggle driven by a passive scroll
//     listener + an IntersectionObserver trigger (both cheap; ≤9 sections).
//   • Reduced-motion-first: nothing animates; the active state is aria-current
//     plus a CSS border + bold weight (colour is never the only channel).
//   • Degrades gracefully: with no JS the anchors still work as plain in-page
//     links; nothing throws.
//
//  Pure, testable helpers `navTargets()` and `activeFromTops()` are exported so
//  engine-test can assert the nav↔section wiring without a DOM.
// ============================================================================

// Given the in-page nav element (or a list of {getAttribute}), return the
// ordered list of section ids it points at (the leading '#' stripped). Pure.
export function navTargets(navOrLinks) {
  const links = Array.isArray(navOrLinks)
    ? navOrLinks
    : (navOrLinks && navOrLinks.querySelectorAll ? Array.from(navOrLinks.querySelectorAll('a[href^="#"]')) : []);
  const out = [];
  for (const a of links) {
    const href = a.getAttribute ? a.getAttribute('href') : a.href;
    if (typeof href === 'string' && href.charAt(0) === '#' && href.length > 1) out.push(href.slice(1));
  }
  return out;
}

// Geometry-based active-section pick, height-independent: given each section's
// viewport-relative top (in document order) and a horizontal detection line,
// the active section is the LAST one whose top has scrolled at/above the line.
// Before the first section reaches the line, the first section is active. Pure.
//   tops : [{ id, top }] in document order
//   line : the y (px from viewport top) of the sticky detection line
export function activeFromTops(tops, line) {
  if (!tops || !tops.length) return null;
  let active = tops[0].id;
  for (const t of tops) {
    if (t.top <= line + 1) active = t.id; // +1 tolerance for sub-pixel rounding
  }
  return active;
}

export function initVedicCourse() {
  const nav = document.getElementById('vt-course-nav');
  if (!nav) return;
  const ids = navTargets(nav);
  const links = new Map();
  for (const a of nav.querySelectorAll('a[href^="#"]')) {
    links.set(a.getAttribute('href').slice(1), a);
  }
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const setCurrent = id => {
    for (const [lid, a] of links) {
      if (lid === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  // The detection line sits just below the sticky nav bar — and, crucially,
  // below where a scrolled-to section's heading lands (the .vt-unit
  // scroll-margin-top clears the sticky bar by ~3.6rem), so a section navigated
  // to reads as active rather than the one above it.
  const detectionLine = () => nav.getBoundingClientRect().bottom + 40;

  const recompute = () => {
    const line = detectionLine();
    const tops = sections.map(s => ({ id: s.id, top: s.getBoundingClientRect().top }));
    const id = activeFromTops(tops, line);
    if (id) setCurrent(id);
  };

  recompute(); // initial state

  // A click sets the current immediately (before the scroll settles).
  for (const [id, a] of links) a.addEventListener('click', () => setCurrent(id));

  // Passive scroll/resize listeners keep the highlight live. No rAF, no motion —
  // a handful of getBoundingClientRect reads per event; cheap and layout-safe.
  window.addEventListener('scroll', recompute, { passive: true });
  window.addEventListener('resize', recompute, { passive: true });
  window.addEventListener('hashchange', recompute, { passive: true });

  // An IntersectionObserver is an extra, coalesced trigger so the state also
  // settles after programmatic scrolls that don't emit scroll events.
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(() => recompute(), { threshold: [0, 1] });
    for (const s of sections) io.observe(s);
  }
}

export default { initVedicCourse, navTargets, activeFromTops };
