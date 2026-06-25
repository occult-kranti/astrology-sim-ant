// ============================================================================
//  autolink.js — automatically turns the first mention of each glossary term in
//  a page's prose into a link to its Glossary entry. Conservative: only touches
//  text inside <p> and <li>, never inside links, forms, headings, code, data
//  tables, calculators or chart SVGs. Links each term at most once per page.
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

export function autolinkGlossary(root, glossaryHref) {
  if (!root) return;
  // phrase → slug, longest phrases first so multi-word terms win
  const seen = new Set();
  const list = GLOSSARY.map(g => ({ phrase: matchPhrase(g.term), slug: slugTerm(g.term) }))
    .filter(e => e.phrase.length > 3)
    .sort((a, b) => b.phrase.length - a.phrase.length)
    .filter(e => { const k = e.phrase.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const phraseToSlug = {};
  for (const e of list) phraseToSlug[e.phrase.toLowerCase()] = e.slug;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('\\b(' + list.map(e => esc(e.phrase)).join('|') + ')\\b', 'i');

  const linked = new Set();

  root.querySelectorAll('p, li').forEach(block => {
    if (block.closest('a, .calc, table.data, .no-autolink, #m-points, #m-body, #h-considerations, #h-aspects')) return;
    walk(block);
  });

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
