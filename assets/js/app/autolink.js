// ============================================================================
//  autolink.js — automatically turns the first mention of each glossary term in
//  a page's prose into a link to its Glossary entry. Conservative: only touches
//  text inside <p> and <li>, never inside links, forms, headings, code, data
//  tables, calculators or chart SVGs. Links each term at most once per pass.
//
//  Two entry points:
//    • autolinkGlossary(root, href)        — once, over a page's static prose
//      (called by shared.js mountChrome).
//    • autolinkResults(roots, href)        — over freshly-rendered RESULT panels
//      after a compute, sharing ONE link-once set across the panels. Safe to
//      call on every recompute: the panels' innerHTML is replaced each time, so
//      a fresh set per call re-links the new DOM (no creeping accumulation).
// ============================================================================
import { GLOSSARY } from '../core/data/glossary.js';

// slug used as the Glossary anchor id for a term
export function slugTerm(t) {
  return t.toLowerCase().replace(/\([^)]*\)/g, '').trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
// the bare phrase to match in text (strip parentheticals and glyphs)
function matchPhrase(t) {
  return t.replace(/\([^)]*\)/g, '')
    .replace(/[☉☽☿♀♂♃♄☊☋⊕△□⚹☌☍✶]/g, '')
    .replace(/\s+/g, ' ').trim();
}

const SKIP_TAGS = new Set(['A', 'BUTTON', 'CODE', 'H1', 'H2', 'H3', 'H4', 'SCRIPT',
  'STYLE', 'SELECT', 'INPUT', 'LABEL', 'TEXTAREA', 'TH', 'CITE']);

// Build the phrase→slug map and the alternation regex once per pass.
function buildMatcher() {
  const seen = new Set();
  const list = GLOSSARY.map(g => ({ phrase: matchPhrase(g.term), slug: slugTerm(g.term) }))
    .filter(e => e.phrase.length > 3)
    .sort((a, b) => b.phrase.length - a.phrase.length)
    .filter(e => { const k = e.phrase.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const phraseToSlug = {};
  for (const e of list) phraseToSlug[e.phrase.toLowerCase()] = e.slug;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('\\b(' + list.map(e => esc(e.phrase)).join('|') + ')\\b', 'i');
  return { phraseToSlug, re };
}

// Link the first match in each text node under `block`, honouring `linked`.
function linkBlock(block, glossaryHref, phraseToSlug, re, linked) {
  if (block.closest('a, .calc, table.data, .no-autolink, #m-points, #m-body, #h-considerations, #h-aspects')) return;
  walk(block);
  function walk(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const text = child.nodeValue;
        const m = re.exec(text);
        if (!m) continue;
        const phrase = m[1], slug = phraseToSlug[phrase.toLowerCase()];
        if (!slug || linked.has(slug)) continue;
        linked.add(slug);
        const a = document.createElement('a');
        a.href = `${glossaryHref}#${slug}`;
        a.className = 'gloss-link';
        a.textContent = phrase;
        a.title = `Glossary: ${phrase}`;
        const frag = document.createDocumentFragment();
        const before = text.slice(0, m.index), after = text.slice(m.index + phrase.length);
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(a);
        if (after) frag.appendChild(document.createTextNode(after));
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !SKIP_TAGS.has(child.tagName) && !child.classList.contains('gloss-link')) {
        walk(child);
      }
    }
  }
}

export function autolinkGlossary(root, glossaryHref) {
  if (!root) return;
  const { phraseToSlug, re } = buildMatcher();
  const linked = new Set();
  root.querySelectorAll('p, li').forEach(block => linkBlock(block, glossaryHref, phraseToSlug, re, linked));
}

// Autolink across several freshly-rendered result containers. One shared set so
// each term links at most once across the panels of THIS compute.
export function autolinkResults(roots, glossaryHref) {
  if (!roots) return;
  const { phraseToSlug, re } = buildMatcher();
  const linked = new Set();
  for (const root of (Array.isArray(roots) ? roots : [roots])) {
    if (!root) continue;
    if (root.matches && root.matches('p, li')) linkBlock(root, glossaryHref, phraseToSlug, re, linked);
    root.querySelectorAll('p, li').forEach(block => linkBlock(block, glossaryHref, phraseToSlug, re, linked));
  }
}
