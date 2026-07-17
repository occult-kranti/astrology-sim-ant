// ============================================================================
//  scripts/build-search-index.mjs — the static full-text index builder (R28 P;
//  dynamic-hosting.md §6.1 "adopt now", the no-Pagefind-binary variant).
//
//  Walks every .html page in the repo (index.html + pages/**), extracts the
//  <title>, the <meta description>, the h1/h2/h3 headings and the visible <main>
//  prose, and emits assets/search-index.json — a plain JSON document the command
//  palette lazy-loads as its third "On this site" result tier. No Pagefind, no
//  WASM, no binary: ~everything the palette needs for full-text, in one file the
//  service worker can cache like any other asset.
//
//  Classified WITH the gate scripts (audit.mjs / engine-test.mjs): dependency-
//  free, run from the repo root, deterministic output ordered by URL. Re-run
//  before deploy whenever page prose changes:
//    node scripts/build-search-index.mjs
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'assets', 'search-index.json');
const TITLE_SUFFIX = ' | The Astrologer\'s Workbench';
const BODY_CHARS = 1800;   // per-page body budget — keeps the whole index lean

// ---------------------------------------------------------------------------
//  Walk: collect every .html under the repo (skip vcs / deps / the scratch
//  research folder). Sorted for deterministic output.
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (['.git', '.github', 'node_modules', '.cache', 'research'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
//  Tiny HTML → text helpers (regex, no DOM). Good enough for indexing prose;
//  the palette scores substrings, not structure.
// ---------------------------------------------------------------------------
const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'",
  '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&middot;': '·',
  '&times;': '×', '&deg;': '°', '&rsquo;': '’', '&lsquo;': '‘', '&rdquo;': '”', '&ldquo;': '“',
};
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(+n); } catch { return ' '; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch { return ' '; } })
    .replace(/&[a-z]+;/gi, m => ENTITIES[m] ?? ' ');
}
function stripToText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}
function firstMatch(re, s) { const m = re.exec(s); return m ? m[1] : ''; }

function indexOne(absPath) {
  const html = readFileSync(absPath, 'utf8');
  const url = relative(ROOT, absPath).split(sep).join('/');

  // <title> — trim the shared brand suffix so labels stay short.
  let title = decodeEntities(firstMatch(/<title>([\s\S]*?)<\/title>/i, html)).replace(/\s+/g, ' ').trim();
  if (title.endsWith(TITLE_SUFFIX)) title = title.slice(0, -TITLE_SUFFIX.length).trim();
  if (!title) title = url;

  // meta description (a good short summary when present).
  const desc = decodeEntities(
    firstMatch(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i, html)
  ).replace(/\s+/g, ' ').trim();

  // The searchable region is <main>; fall back to <body>, then whole doc.
  const region =
    firstMatch(/<main[^>]*>([\s\S]*?)<\/main>/i, html) ||
    firstMatch(/<body[^>]*>([\s\S]*?)<\/body>/i, html) ||
    html;

  // Headings (h1–h3) from the region, in document order.
  const headings = [];
  const hRe = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
  let hm;
  while ((hm = hRe.exec(region))) {
    const t = stripToText(hm[1]);
    if (t) headings.push(t);
  }

  const body = stripToText(region).slice(0, BODY_CHARS);

  return {
    u: url,
    t: title,
    d: desc,
    h: headings.join(' · '),
    b: body,
  };
}

// ---------------------------------------------------------------------------
//  Build + write.
// ---------------------------------------------------------------------------
const pages = walk(ROOT).sort((a, b) => a.localeCompare(b));
const docs = pages.map(indexOne);
const payload = {
  generated: new Date().toISOString().slice(0, 10),   // date only → stable diffs within a day
  count: docs.length,
  docs,
};
writeFileSync(OUT, JSON.stringify(payload));
const bytes = statSync(OUT).size;
console.log(`[build-search-index] ${docs.length} pages → assets/search-index.json (${(bytes / 1024).toFixed(1)} KB)`);
