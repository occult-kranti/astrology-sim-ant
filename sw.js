/* ============================================================================
 *  sw.js — The Astrologer's Workbench service worker (R28 P; dynamic-hosting.md
 *  rung (a)). Hand-written, no Workbox: readable-source demands you can audit
 *  the whole cache policy in one sitting.
 *
 *  Contract (every clause is load-bearing — read before editing):
 *    · VERSIONED CACHE NAMES — bump VERSION to invalidate; activate() deletes
 *      every cache whose name is not in the current set.
 *    · PRECACHE THE SHELL — a small curated boot set (chrome + engine + index),
 *      fetched individually so one 404 can never fail the whole install.
 *    · LAZY RUNTIME CACHING — everything else is cached the first time it is
 *      requested (stale-while-revalidate for assets; network-first for pages),
 *      so the site becomes fully offline after normal browsing, not on install.
 *    · CROSS-ORIGIN PASSTHROUGH — any request to another origin is left to the
 *      browser untouched. This is what keeps the BYOK LLM calls
 *      (api.anthropic.com, api.groq.com, api.openai.com …) and every external
 *      link OUT of the cache and always on the network. Birth data in a reading
 *      must never transit a cache it wasn't meant to.
 *    · CONSENT-BASED UPDATES — a new worker waits; it never skipWaiting()s on
 *      its own. app/sw-register.js shows the site .toast; only the user's click
 *      posts {type:'SKIP_WAITING'}. A student mid-calculation is never reloaded.
 *    · KILL SWITCH — set KILL_SWITCH = true and deploy: the worker clears every
 *      cache and unregisters itself, handing all clients back to the network.
 *      The documented panic path (see docs/pwa.md).
 *    · RESPECTS http://localhost — on localhost/127.0.0.1 the worker installs
 *      but caches NOTHING and passes every request straight through, so the dev
 *      hard-refresh flow and the Chromium verify gate behave exactly as if no
 *      worker were present.
 * ========================================================================== */

'use strict';

// Bump on every deploy that changes cached bytes. The date-ish tag makes stale
// caches obvious in DevTools → Application → Cache Storage.
const VERSION = 'awb-2026-07-16';
const PRECACHE = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const CURRENT = new Set([PRECACHE, RUNTIME]);

// ── THE PANIC PATH ──────────────────────────────────────────────────────────
// Flip to true and redeploy to disarm the PWA for everyone: the next activate
// wipes all caches and unregisters this worker. Clients fall back to plain
// network on their following navigation. See docs/pwa.md.
const KILL_SWITCH = false;

// ── LOCALHOST GUARD ─────────────────────────────────────────────────────────
// Dev + the verify gate run on localhost; there the worker is a pure no-op.
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const IS_LOCAL = LOCAL_HOSTS.has(self.location.hostname);

// ── THE SHELL ───────────────────────────────────────────────────────────────
// Resolved relative to the worker's own URL, so this is correct at the domain
// root AND under the GitHub Pages project subpath (…github.io/astrology-sim-ant/).
// Keep it SMALL: the chrome, the palette, the search index, the astronomy
// engine, and the home page. Everything deeper is runtime-cached on first use.
const SHELL_PATHS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/style.css',
  'assets/search-index.json',
  'assets/js/app/shared.js',
  'assets/js/app/sw-register.js',
  'assets/js/app/palette.js',
  'assets/js/app/autolink.js',
  'assets/js/app/location.js',
  'assets/js/app/motion.js',
  'assets/js/app/art/icons.js',
  'assets/js/app/art/adopt.js',
  'assets/js/core/registry.js',
  'assets/js/lib/astronomy.js',
];
const SHELL = SHELL_PATHS.map(p => new URL(p, self.location).href);
const INDEX_URL = new URL('index.html', self.location).href;

// Same-origin assets we stale-while-revalidate rather than network-first.
const ASSET_RE = /\.(?:css|js|mjs|json|svg|png|jpe?g|webp|gif|ico|woff2?|ttf|otf)$/i;

// ── INSTALL ─────────────────────────────────────────────────────────────────
// Precache the shell (individually — a single miss must not fail the install).
// Do NOT skipWaiting: a fresh worker waits for consent (the toast).
self.addEventListener('install', event => {
  if (IS_LOCAL || KILL_SWITCH) return;   // no precache on dev / when disarmed
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await Promise.allSettled(SHELL.map(async url => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res && res.ok) await cache.put(url, res.clone());
      } catch { /* a shell miss is non-fatal — runtime caching backfills it */ }
    }));
  })());
});

// ── ACTIVATE ────────────────────────────────────────────────────────────────
// Drop old version caches; take control of open clients. Honour the kill switch.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (KILL_SWITCH) {
      await clearAllCaches();
      try { await self.registration.unregister(); } catch { /* ignore */ }
      try { const cs = await self.clients.matchAll(); cs.forEach(c => c.navigate(c.url)); } catch { /* ignore */ }
      return;
    }
    const names = await caches.keys();
    await Promise.all(names.map(n => (CURRENT.has(n) ? null : caches.delete(n))));
    await self.clients.claim();
  })());
});

// ── FETCH ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;

  // Dev / disarmed / non-GET / cross-origin → hands off entirely (network).
  if (IS_LOCAL || KILL_SWITCH) return;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // CROSS-ORIGIN: never touch it — BYOK LLM endpoints, external scans, links.
  if (url.origin !== self.location.origin) return;

  // Navigations → network-first (fresh page online, cached page offline).
  if (req.mode === 'navigate') { event.respondWith(networkFirst(req)); return; }

  // Same-origin static assets → stale-while-revalidate.
  if (ASSET_RE.test(url.pathname)) { event.respondWith(staleWhileRevalidate(req)); return; }

  // Anything else same-origin → try cache, else network (no eager caching).
  event.respondWith((async () => (await caches.match(req)) || fetch(req))());
});

// ── STRATEGIES ──────────────────────────────────────────────────────────────
async function networkFirst(req) {
  const cache = await caches.open(RUNTIME);
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  } catch {
    const hit = (await cache.match(req)) || (await caches.match(req));
    if (hit) return hit;
    const shell = await caches.match(INDEX_URL);
    if (shell) return shell;
    return new Response(
      '<!doctype html><meta charset=utf-8><title>Offline</title>' +
      '<body style="font-family:Georgia,serif;max-width:32rem;margin:12vh auto;padding:0 1.2rem;color:#2a2416">' +
      '<h1>Offline</h1><p>This page hasn’t been cached yet. Reconnect once and it will be available offline afterwards.</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
    );
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await network) || new Response('', { status: 504 });
}

async function clearAllCaches() {
  const names = await caches.keys();
  await Promise.all(names.map(n => caches.delete(n)));
}

// ── MESSAGES ────────────────────────────────────────────────────────────────
// The register script drives consent-based updates + the manual kill path.
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (data.type === 'KILL') {
    event.waitUntil((async () => {
      await clearAllCaches();
      try { await self.registration.unregister(); } catch { /* ignore */ }
    })());
  }
});
