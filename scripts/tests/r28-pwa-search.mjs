// ============================================================================
//  scripts/tests/r28-pwa-search.mjs — R28 builder P (offline install + search).
//  Exports:  async run() -> { pass, failures[] }   and   DRIVES[]
//  Wired into scripts/engine-test.mjs by the integrator. Deterministic, DOM-free,
//  dependency-free. Covers:
//    · searchFullText — purity, AND semantics, ranking, shape, limit, guards
//    · loadSearchIndex — lazy load via an injected fetch, load-once memoization
//    · assets/search-index.json — shape, coverage, every url on disk, clean text
//    · sw.js — the load-bearing contract clauses are present (regression guard)
//    · manifest.webmanifest — valid PWA manifest, inline-SVG data-URI icons
//    · sw-register.js — exports + consent-gated reload + kill path present
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchFullText, loadSearchIndex } from '../../assets/js/app/palette.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const P = (...p) => join(REPO, ...p);

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- fixture docs (small, hand-built — exercises ranking deterministically)-
  const DOCS = [
    { u: 'pages/a.html', t: 'Combustion and the Sun', d: '', h: 'Combustion · Asta', b: 'the planet is combust when near the sun' },
    { u: 'pages/b.html', t: 'Nakṣatra basics', d: '', h: 'The lunar mansions', b: 'combustion is mentioned once here in passing' },
    { u: 'pages/c.html', t: 'Dignities', d: '', h: 'Essential dignity', b: 'no relevant term at all in this body text' },
  ];

  // ---- 1. searchFullText: purity + determinism -----------------------------
  const r1 = searchFullText('combustion', DOCS, 6);
  const r2 = searchFullText('combustion', DOCS, 6);
  ok(JSON.stringify(r1) === JSON.stringify(r2), 'searchFullText deterministic (two calls deep-equal)');

  // AND semantics: a term absent everywhere excludes the doc.
  ok(searchFullText('combustion zzzznotpresent', DOCS, 6).length === 0, 'searchFullText requires ALL terms (AND)');

  // Ranking: title hit (doc a) outranks body-only hit (doc b).
  ok(r1.length === 2 && r1[0].href === 'pages/a.html' && r1[1].href === 'pages/b.html',
    'searchFullText ranks title > body and excludes the no-match doc');

  // Shape: the palette row contract.
  const row = r1[0];
  ok(row && row.kind === 'On this site' && typeof row.label === 'string' && typeof row.href === 'string' && 'hint' in row,
    'searchFullText rows are { label, href, kind:"On this site", hint }');

  // Guards.
  ok(searchFullText('a', DOCS, 6).length === 0, 'searchFullText ignores queries shorter than 2 chars');
  ok(searchFullText('combustion', null, 6).length === 0, 'searchFullText tolerates a non-array corpus');
  ok(searchFullText('', DOCS, 6).length === 0, 'searchFullText empty query → []');
  ok(searchFullText('dignity', DOCS, 1).length === 1, 'searchFullText respects the limit');

  // ---- 2. loadSearchIndex: lazy load via injected fetch + load-once ---------
  const raw = existsSync(P('assets', 'search-index.json')) ? readFileSync(P('assets', 'search-index.json'), 'utf8') : null;
  let fetchCalls = 0;
  const fakeFetch = async () => { fetchCalls++; return { ok: true, json: async () => JSON.parse(raw) }; };
  if (raw) {
    const docsA = await loadSearchIndex(fakeFetch);
    const docsB = await loadSearchIndex(fakeFetch);   // cached — must not re-fetch
    ok(Array.isArray(docsA) && docsA.length > 0, 'loadSearchIndex returns the docs array');
    ok(docsA === docsB && fetchCalls === 1, 'loadSearchIndex memoizes (fetch called exactly once)');
    // the loaded corpus feeds searchFullText end-to-end.
    const live = searchFullText('combustion', docsA, 6);
    ok(Array.isArray(live), 'searchFullText runs against the real loaded index');
  } else {
    ok(false, 'assets/search-index.json is missing — run scripts/build-search-index.mjs');
  }

  // ---- 3. the generated index file -----------------------------------------
  if (raw) {
    let idx = null;
    try { idx = JSON.parse(raw); } catch { /* handled below */ }
    ok(idx && Array.isArray(idx.docs), 'search-index.json parses with a docs[] array');
    if (idx && Array.isArray(idx.docs)) {
      ok(idx.count === idx.docs.length, 'search-index.json count matches docs length');
      ok(idx.docs.length >= 90, `search-index.json covers the site (${idx.docs.length} pages)`);
      let badUrl = 0, emptyTitle = 0, taggy = 0;
      for (const d of idx.docs) {
        if (!d.u || !existsSync(P(d.u))) badUrl++;
        if (!d.t || !d.t.trim()) emptyTitle++;
        if (/<(script|style|div|span|p)\b/i.test(d.b || '')) taggy++;
      }
      ok(badUrl === 0, `every indexed url resolves on disk (${badUrl} missing)`);
      ok(emptyTitle === 0, `every indexed page has a title (${emptyTitle} empty)`);
      ok(taggy === 0, `indexed body text is stripped of markup (${taggy} tag-bearing)`);
      // spot-check: a known page is findable by a term from its prose.
      const hit = searchFullText('workbench', idx.docs, 12);
      ok(hit.some(r => r.href === 'index.html' || /workbench/.test(r.href)), 'a known term finds a real page in the built index');
    }
  }

  // ---- 4. sw.js contract clauses -------------------------------------------
  if (existsSync(P('sw.js'))) {
    const sw = readFileSync(P('sw.js'), 'utf8');
    ok(/const VERSION\s*=/.test(sw), 'sw.js declares a VERSION (versioned cache names)');
    ok(/const KILL_SWITCH\s*=\s*false\b/.test(sw), 'sw.js ships with KILL_SWITCH = false (not accidentally armed)');
    ok(/IS_LOCAL/.test(sw) && /localhost/.test(sw), 'sw.js has the localhost no-op guard');
    ok(/url\.origin\s*!==\s*self\.location\.origin/.test(sw), 'sw.js passes cross-origin requests through (BYOK LLM bypass)');
    ok(/api\.anthropic\.com/.test(sw), 'sw.js documents the LLM endpoints it must not cache');
    ok(/SKIP_WAITING/.test(sw) && !/self\.skipWaiting\(\)\s*;?\s*\n[^]*?addEventListener\('install'/.test(sw),
      'sw.js only skipWaiting()s on the SKIP_WAITING message (consent-based)');
    ok(/self\.skipWaiting\(\)/.test(sw), 'sw.js has a skipWaiting path (driven by consent)');
    ok(/respondWith/.test(sw) && /networkFirst|staleWhileRevalidate/.test(sw), 'sw.js implements the fetch strategies');
    ok(/req\.method\s*!==\s*'GET'/.test(sw), 'sw.js only handles GET (never caches mutations)');
  } else ok(false, 'sw.js is missing at the repo root');

  // ---- 5. manifest.webmanifest ---------------------------------------------
  if (existsSync(P('manifest.webmanifest'))) {
    let man = null;
    try { man = JSON.parse(readFileSync(P('manifest.webmanifest'), 'utf8')); } catch { /* below */ }
    ok(man, 'manifest.webmanifest parses as JSON');
    if (man) {
      ok(man.name && man.short_name, 'manifest has name + short_name');
      ok(man.start_url && man.scope && man.display === 'standalone', 'manifest has start_url, scope, standalone display');
      ok(Array.isArray(man.icons) && man.icons.length >= 1, 'manifest declares icons');
      const svgData = (man.icons || []).filter(i => /^data:image\/svg\+xml,/.test(i.src || '') && i.type === 'image/svg+xml');
      ok(svgData.length === (man.icons || []).length && svgData.length >= 1, 'every icon is an inline-SVG data URI (no binary assets)');
      ok((man.icons || []).some(i => (i.purpose || '').includes('maskable')), 'manifest ships a maskable icon');
    }
  } else ok(false, 'manifest.webmanifest is missing at the repo root');

  // ---- 6. sw-register.js ----------------------------------------------------
  if (existsSync(P('assets', 'js', 'app', 'sw-register.js'))) {
    const reg = readFileSync(P('assets', 'js', 'app', 'sw-register.js'), 'utf8');
    ok(/export function registerServiceWorker/.test(reg), 'sw-register exports registerServiceWorker');
    ok(/export default/.test(reg), 'sw-register has a default export (integrator flexibility)');
    ok(/sw\.js/.test(reg), 'sw-register targets sw.js');
    ok(/class="toast"|className\s*=\s*'toast'|'toast'/.test(reg), 'sw-register uses the site .toast component');
    ok(/updating/.test(reg) && /controllerchange/.test(reg), 'sw-register gates the reload behind user consent (updating flag)');
    ok(/killServiceWorker/.test(reg), 'sw-register exposes the in-page kill path');
    ok(/SKIP_WAITING/.test(reg), 'sw-register posts SKIP_WAITING on consent');
  } else ok(false, 'assets/js/app/sw-register.js is missing');

  const pass = failures.length === 0;
  return { pass, failures };
}

// ---------------------------------------------------------------------------
//  DRIVES — Chromium-sweep descriptors (prose form; the final verifier drives
//  them by hand / via browser-verify). They assert the PWA registers, the search
//  tier works, and the SW never breaks the localhost dev + hard-refresh flow.
// ---------------------------------------------------------------------------
export const DRIVES = [
  { page: '/index.html', label: 'PWA: manifest + SW register cleanly (no console errors)',
    actions: ['load'],
    asserts: ['<link rel="manifest"> resolves', 'navigator.serviceWorker.controller or a registration exists after load', '0 console/page errors'] },
  { page: '/index.html', label: 'search: third "On this site" tier appears on palette open',
    actions: ['press Ctrl+K', 'type "combustion" into .cmdk-input'],
    asserts: ['assets/search-index.json fetched exactly once (first open)', 'a .cmdk-row with kicker "On this site" renders below the nav/registry rows', 'ArrowDown/Enter opens a real page'] },
  { page: '/pages/vedic/index.html', label: 'search: index lazy-loads (not at page load)',
    actions: ['load', 'wait 1s', 'open the palette', 'type "nakshatra"'],
    asserts: ['no search-index.json request BEFORE the palette opens', 'full-text hits render after it loads'] },
  { page: '/index.html', label: 'localhost: SW is a no-op — hard refresh serves fresh bytes',
    actions: ['load', 'hard-reload (bypass cache)'],
    asserts: ['SW registered but IS_LOCAL passthrough means every request is network', 'no stale-cache pinning', 'page identical to no-SW load'] },
  { page: '/index.html', label: 'PWA: consent-based update toast never auto-reloads',
    actions: ['load with an existing controller', 'simulate a waiting worker'],
    asserts: ['.toast#sw-update-toast shown with Reload + Later', 'nothing reloads until Reload clicked', 'role=status announced'] },
];
