/* ============================================================================
 *  sw.js — The Astrologer's Workbench service worker (R28 P; dynamic-hosting.md
 *  rung (a)). Hand-written, no Workbox: readable-source demands you can audit
 *  the whole cache policy in one sitting.
 *
 *  Contract (every clause is load-bearing — read before editing):
 *    · VERSIONED CACHE NAMES — bump VERSION to invalidate; activate() deletes
 *      this project’s older version caches; other projects remain untouched.
 *    · PRECACHE THE SHELL — a small curated boot set (chrome + engine + index),
 *      fetched individually so one 404 can never fail the whole install.
 *    · LAZY RUNTIME CACHING — everything else is cached the first time it is
 *      requested (stale-while-revalidate for assets; network-first for pages),
 *      so visited resources can work offline. The optional complete static pack
 *      is downloaded only after an explicit OFFLINE_PREPARE request.
 *    · CROSS-ORIGIN PASSTHROUGH — any request to another origin is left to the
 *      browser untouched. This is what keeps the BYOK LLM calls
 *      (api.anthropic.com, api.groq.com, api.openai.com …) and every external
 *      link OUT of the cache and always on the network. Birth data in a reading
 *      must never transit a cache it wasn't meant to.
 *    · CONSENT-BASED UPDATES — a new worker waits; it never skipWaiting()s on
 *      its own. app/sw-register.js shows the site .toast; only the user's click
 *      posts {type:'SKIP_WAITING'}. A student mid-calculation is never reloaded.
 *    · KILL SWITCH — set KILL_SWITCH = true and deploy: the worker clears this project’s
 *      caches and unregisters itself, handing all clients back to the network.
 *      The documented panic path (see docs/pwa.md).
 *    · RESPECTS http://localhost — on localhost/127.0.0.1 the worker installs
 *      with no automatic caching. Only an explicitly completed offline pack
 *      can provide a network-failure fallback there; normal development and
 *      verification requests continue to use the network.
 * ========================================================================== */

'use strict';

// Bump on every deploy that changes cached bytes. The date-ish tag makes stale
// caches obvious in DevTools → Application → Cache Storage.
const CACHE_PREFIX = 'awb-' + encodeURIComponent(new URL('./', self.location.href).pathname) + '-';
const VERSION = CACHE_PREFIX + '2026-11-04-workbench-rag';
const ownsCache = name => name.startsWith(CACHE_PREFIX); // Never clear another project’s caches.
const PRECACHE = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const OFFLINE_STATE = `${VERSION}-offline-state`;
const OFFLINE_PACK_PREFIX = `${VERSION}-offline-pack-`;
const CURRENT = new Set([PRECACHE, RUNTIME, OFFLINE_STATE]);
const BASE = new URL('./', self.location.href);
const OFFLINE_MANIFEST = new URL('assets/offline-manifest.json', BASE).href;
const OFFLINE_RECORD = new URL('__offline_pack_state__', BASE).href;
let offlineJob = null;

// ── THE PANIC PATH ──────────────────────────────────────────────────────────
// Flip to true and redeploy to disarm the PWA for everyone: the next activate
// wipes this project’s caches and unregisters this worker. Clients fall back to plain
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
  'assets/css/observatory.css',
  'assets/css/site-themes.css',
  'assets/css/site-components.css',
  'assets/css/site-patterns.css',
  'assets/js/app/appearance-boot.js',
  'assets/js/app/appearance.js',
  'assets/css/observatory-home.css',
  'assets/search-index.json',
  'assets/js/app/shared.js',
  'assets/js/app/observatory-home.js',
  'assets/js/core/observatory-schedule.js',
  'assets/js/core/time.js',
  'assets/js/app/sw-register.js',
  'assets/js/app/palette.js',
  'assets/js/app/autolink.js',
  'assets/js/app/location.js',
  'assets/js/app/motion.js',
  'assets/js/app/art/icons.js',
  'assets/js/app/art/adopt.js',
  'assets/js/core/registry.js',
  'assets/js/lib/astronomy.js',
  // Desktop entry and its own small modules; canonical dependencies remain lazy.
  // Prepare the explicit offline library for guaranteed complete-tool coverage.
  'pages/desktop.html',
  'assets/css/desktop-workbench.css',
  'assets/js/app/desktop-workbench.js',
  'assets/js/app/desktop-wheel.js',
  'assets/js/app/desktop-library.js',
  'assets/js/core/desktop-workbench.js',
  'assets/js/core/data/desktop-tools.js',
];
// DELIBERATELY NOT IN THE SHELL (R34): pages/opgraph.html, assets/css/opgraph.css,
// assets/js/app/opgraph.js, assets/js/core/opgraph.js and assets/js/core/data/opgraph.js.
// The graph's data module alone is ~851 KB — larger than everything else in this shell
// put together — and it serves exactly one page. Precaching it would spend a
// first-visit download on a page most readers never open, which is what "keep it
// SMALL" forbids. All five are runtime-cached on first request (stale-while-revalidate
// for the assets, network-first for the page), so the graph is fully offline for anyone
// who has actually visited it. Revisit only if that page becomes a boot destination.
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
    await Promise.all(names.map(n => (ownsCache(n) && !CURRENT.has(n) && !n.startsWith(OFFLINE_PACK_PREFIX) ? caches.delete(n) : null)));
    await self.clients.claim();
  })());
});

// ── FETCH ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;

  // Dev / disarmed / non-GET / cross-origin → hands off entirely (network).
  if (KILL_SWITCH) return;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // CROSS-ORIGIN: never touch it — BYOK LLM endpoints, external scans, links.
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE.pathname)) return;
  const relativePath = url.pathname.slice(BASE.pathname.length);
  const staticPage = relativePath === '' || /^(?:index|offline|install)\.html$/.test(relativePath) || /^pages\/[\w./-]+\.html$/.test(relativePath);
  const staticAsset = /^assets\//.test(relativePath) && ASSET_RE.test(url.pathname);
  if (!staticPage && !staticAsset && relativePath !== 'manifest.webmanifest') return;
  // Local development stays network-only unless a complete pack was explicitly
  // requested. An optional offline pack is never installed by visiting a page.
  if (IS_LOCAL) { event.respondWith(fetch(req).catch(async () => (await matchOffline(req)) || offlineResponse())); return; }

  // Navigations → network-first (fresh page online, cached page offline).
  if (req.mode === 'navigate' && staticPage) { event.respondWith(networkFirst(req)); return; }

  // Same-origin static assets → stale-while-revalidate.
  if (staticAsset || relativePath === 'manifest.webmanifest') { event.respondWith(staleWhileRevalidate(req,event)); return; }

  // Anything else same-origin → try cache, else network (no eager caching).
  // Unknown same-origin endpoints are not cache candidates (including APIs).
});

// ── STRATEGIES ──────────────────────────────────────────────────────────────
async function networkFirst(req) {
  const cache = await caches.open(RUNTIME).catch(()=>null);
  if (!cache) return fetch(req).catch(()=>offlineResponse());
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic' && !new URL(req.url).search) await cache.put(req, res.clone()).catch(()=>{});
    return res;
  } catch {
    const hit = (await matchOffline(req)) || (await cache.match(req)) || (await (await caches.open(PRECACHE)).match(req));
    if (hit) return hit;
    const shell = await (await caches.open(PRECACHE)).match(INDEX_URL);
    if (shell) return shell;
    return new Response(
      '<!doctype html><meta charset=utf-8><title>Offline</title>' +
      '<body style="font-family:Georgia,serif;max-width:32rem;margin:12vh auto;padding:0 1.2rem;color:#2a2416">' +
      '<h1>Offline</h1><p>This page hasn’t been cached yet. Reconnect once and it will be available offline afterwards.</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
    );
  }
}

async function staleWhileRevalidate(req,event) {
  const cache = await caches.open(RUNTIME).catch(()=>null);
  if (!cache) return fetch(req).catch(()=>new Response('',{status:504}));
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    if (res && res.ok && res.type === 'basic' && !new URL(req.url).search) return cache.put(req, res.clone()).then(() => res, () => res);
    return res;
  }).catch(() => null);
  event.waitUntil(network.then(()=>{}));
  return cached || (await network) || (await matchOffline(req)) || (await (await caches.open(PRECACHE)).match(req)) || new Response('', { status: 504 });
}

async function clearAllCaches() {
  const names = await caches.keys();
  await Promise.all(names.filter(ownsCache).map(n => caches.delete(n)));
}

function offlineResponse() {
  return new Response('<!doctype html><meta charset="utf-8"><title>Offline page unavailable</title><h1>Offline page unavailable</h1><p>Reconnect and finish the optional offline download before opening an unvisited page.</p>', { status:503, headers:{'Content-Type':'text/html; charset=utf-8'} });
}
async function readOfflineRecord() {
  if (!(await caches.has(OFFLINE_STATE))) return null;
  const response = await (await caches.open(OFFLINE_STATE)).match(OFFLINE_RECORD);
  if (!response) return null;
  const record = await response.json();
  return record?.complete === true && record.appVersion === VERSION && record.cacheName?.startsWith(OFFLINE_PACK_PREFIX) ? record : null;
}
async function matchOffline(req) {
  const url = new URL(req.url);
  if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return null;
  const record = await readOfflineRecord();
  if (!record || !(await caches.has(record.cacheName))) return null;
  // Query fields never become cache keys. Only a known static manifest resource
  // may supply its generic bytes when an input-bearing URL is opened offline.
  url.search = ''; url.hash = '';
  if (url.pathname === BASE.pathname) url.pathname += 'index.html';
  if (!record.files.includes(url.pathname.slice(BASE.pathname.length))) return null;
  return (await caches.open(record.cacheName)).match(url.href);
}
async function offlineStatus() {
  if (offlineJob) return { ...offlineJob.progress, complete:false };
  const record = await readOfflineRecord();
  if (!record || !(await caches.has(record.cacheName))) return { phase:'idle', complete:false, completed:0, total:0 };
  const urls = new Set((await (await caches.open(record.cacheName)).keys()).map(r => r.url));
  const complete = record.files.length === record.total && record.files.every(path => urls.has(new URL(path, BASE).href));
  return { phase:complete?'ready':'error', complete, completed:complete?record.total:urls.size, total:record.total, totalBytes:record.totalBytes, downloadedBytes:complete?record.totalBytes:0, manifestVersion:record.manifestVersion, completedAt:record.completedAt, ...(complete?{}:{message:'Some offline files are missing. Download the pack again.'}) };
}
const offlineReply = (port, state, done = true) => {
  try { port?.postMessage({ protocolVersion:1, appVersion:VERSION, ...state, done }); } catch { /* closed page; download still settles safely */ }
};
async function validateManifest(manifest) {
  if (manifest?.schemaVersion !== 1 || !/^[a-f0-9]{64}$/.test(manifest.version || '') || !Array.isArray(manifest.files) || manifest.files.length < 1 || manifest.files.length > 1500) throw Error('The offline manifest is missing or incompatible. Reload the latest edition.');
  let total = 0; const seen = new Set();
  for (const f of manifest.files) {
    if (typeof f.path !== 'string' || f.path.length > 240 || !/^(?:index\.html|offline\.html|install\.html|manifest\.webmanifest|pages\/[\w./-]+\.html|assets\/[\w./-]+\.(?:js|mjs|css|json|svg|png|jpe?g|webp|gif|ico|woff2?|ttf|otf|csv|txt))$/.test(f.path) || f.path.split('/').some(p => p === '.' || p === '..') || seen.has(f.path)) throw Error('Offline manifest contains an unsupported or duplicate path.');
    if (!Number.isSafeInteger(f.bytes) || f.bytes < 0 || f.bytes > 32*1024*1024 || !/^[a-f0-9]{64}$/.test(f.sha256 || '')) throw Error('Offline manifest contains an invalid file size or digest.');
    total += f.bytes; seen.add(f.path);
  }
  if (total !== manifest.totalBytes || total > 100*1024*1024 || !seen.has('index.html')) throw Error('Offline pack exceeds its supported bound or has an incomplete index.');
  const contentHash = [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(manifest.files))))].map(b=>b.toString(16).padStart(2,'0')).join('');
  if (contentHash !== manifest.version) throw Error('Offline manifest version does not match its file list. Reload and retry.');
  return manifest;
}
async function prepareOffline(port) {
  if (offlineJob) { offlineReply(port, { ...offlineJob.progress, complete:false, message:'An offline download is already running. Use Cancel or wait for it to finish.' }); return; }
  const controller = new AbortController();
  const job = { controller, cancelled:false, cacheName:null, progress:{phase:'preparing',complete:false,completed:0,total:0,totalBytes:0,downloadedBytes:0} };
  offlineJob = job;
  const emit = () => offlineReply(port, job.progress, false);
  emit();
  const deadline = setTimeout(() => controller.abort(), 10*60*1000);
  try {
    const manifestTimeout = setTimeout(() => controller.abort(), 45000);
    let manifestText;
    try {
      const response = await fetch(OFFLINE_MANIFEST, { cache:'reload', redirect:'error', signal:controller.signal });
      if (!response.ok) throw Error('The offline manifest could not be downloaded. Reconnect and retry.');
      manifestText = await response.text();
    } finally { clearTimeout(manifestTimeout); }
    if (manifestText.length > 1024*1024) throw Error('Offline manifest is unexpectedly large.');
    const manifest = await validateManifest(JSON.parse(manifestText)), old = await readOfflineRecord();
    const ready = await offlineStatusForRecord(old);
    if (ready && old.manifestVersion === manifest.version) { job.progress = { ...ready, phase:'ready',complete:true }; return; }
    job.cacheName = OFFLINE_PACK_PREFIX + manifest.version;
    if (old?.cacheName === job.cacheName) await (await caches.open(OFFLINE_STATE)).delete(OFFLINE_RECORD);
    await caches.delete(job.cacheName);
    const cache = await caches.open(job.cacheName);
    Object.assign(job.progress,{total:manifest.files.length,totalBytes:manifest.totalBytes,manifestVersion:manifest.version}); emit();
    let cursor = 0, firstError = null;
    const worker = async () => {
      while (!controller.signal.aborted) {
        const index = cursor++; if (index >= manifest.files.length) return;
        const entry = manifest.files[index], url = new URL(entry.path, BASE).href;
        try {
          const timeout = setTimeout(() => controller.abort(), 45000);
          try {
            const res = await fetch(url,{cache:'reload',redirect:'error',signal:controller.signal});
            if (!res.ok || !['basic','default'].includes(res.type)) throw Error(`Offline file unavailable: ${entry.path}`);
            const bytes = await res.clone().arrayBuffer();
            const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
            if (bytes.byteLength !== entry.bytes || digest !== entry.sha256) throw Error(`The published file changed during download: ${entry.path}. Reload and retry.`);
            if (controller.signal.aborted) return;
            await cache.put(url,res);
            job.progress.completed++; job.progress.downloadedBytes += bytes.byteLength; emit();
          } finally { clearTimeout(timeout); }
        } catch (error) { firstError ||= error; controller.abort(); return; }
      }
    };
    await Promise.all(Array.from({length:4},worker));
    if (job.cancelled) throw Error('Download cancelled. Partial offline files were removed.');
    if (firstError) throw firstError;
    if (controller.signal.aborted || job.progress.completed !== manifest.files.length) throw Error('The download was interrupted or timed out. Reconnect and retry.');
    const record = {complete:true,appVersion:VERSION,cacheName:job.cacheName,manifestVersion:manifest.version,total:manifest.files.length,totalBytes:manifest.totalBytes,completedAt:new Date().toISOString(),files:manifest.files.map(f=>f.path)};
    await (await caches.open(OFFLINE_STATE)).put(OFFLINE_RECORD,new Response(JSON.stringify(record),{headers:{'Content-Type':'application/json'}}));
    job.cacheName = null; // The completion record now owns this verified cache.
    for (const name of await caches.keys()) if (name.startsWith(OFFLINE_PACK_PREFIX) && name !== record.cacheName) await caches.delete(name);
    Object.assign(job.progress,{phase:'ready',complete:true,completedAt:record.completedAt});
  } catch (error) {
    if (job.cacheName) await caches.delete(job.cacheName).catch(()=>{});
    Object.assign(job.progress,{phase:job.cancelled?'cancelled':'error',complete:false,message:job.cancelled?'Download cancelled. Partial offline files were removed.':error?.name==='QuotaExceededError'?'There is not enough browser storage. Free space or use the portable ZIP, then retry.':['SecurityError','InvalidStateError'].includes(error?.name)?'This browser is not allowing offline storage here. Use a normal browser window or the portable ZIP.':error?.message||'Offline download failed. Reconnect and retry.'});
  } finally { clearTimeout(deadline); offlineJob=null; offlineReply(port,job.progress); }
}
async function offlineStatusForRecord(record) {
  if (!record || !(await caches.has(record.cacheName))) return null;
  const keys = new Set((await (await caches.open(record.cacheName)).keys()).map(r=>r.url));
  return record.files.every(p=>keys.has(new URL(p,BASE).href)) ? {phase:'ready',complete:true,completed:record.total,total:record.total,totalBytes:record.totalBytes,downloadedBytes:record.totalBytes,manifestVersion:record.manifestVersion,completedAt:record.completedAt} : null;
}

// ── MESSAGES ────────────────────────────────────────────────────────────────
// The register script drives consent-based updates + the manual kill path.
self.addEventListener('message', event => {
  const data = event.data || {};
  if (['OFFLINE_STATUS','OFFLINE_PREPARE','OFFLINE_CANCEL','OFFLINE_CLEAR'].includes(data.type)) {
    const port = event.ports?.[0];
    let source; try { source = new URL(event.source?.url); } catch { return; }
    if (!port || source.origin !== BASE.origin || !source.pathname.startsWith(BASE.pathname)) return;
    if (KILL_SWITCH) { offlineReply(port,{phase:'error',complete:false,message:'Offline service is disabled for this edition.'}); return; }
    event.waitUntil((async()=>{
      try {
        if (data.type === 'OFFLINE_PREPARE') { await prepareOffline(port); return; }
        if (data.type === 'OFFLINE_CANCEL') { if (offlineJob) { offlineJob.cancelled=true;offlineJob.controller.abort();offlineReply(port,{phase:'cancelling',complete:false}); } else offlineReply(port,await offlineStatus());return; }
        if (data.type === 'OFFLINE_CLEAR') {
          if (offlineJob) { offlineReply(port,{phase:'preparing',complete:false,message:'Cancel the current download before removing offline files.'});return; }
          await Promise.all((await caches.keys()).filter(n=>n===OFFLINE_STATE||n.startsWith(OFFLINE_PACK_PREFIX)).map(n=>caches.delete(n)));
          offlineReply(port,{phase:'idle',complete:false,completed:0,total:0,message:'The optional offline pack was removed. Browsing caches and other sites were preserved.'});return;
        }
        offlineReply(port,await offlineStatus());
      } catch(error) { offlineReply(port,{phase:'error',complete:false,message:error?.message||'Browser offline storage is unavailable.'}); }
    })());return;
  }
  if (data.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (data.type === 'KILL') {
    event.waitUntil((async () => {
      await clearAllCaches();
      try { await self.registration.unregister(); } catch { /* ignore */ }
    })());
  }
});
