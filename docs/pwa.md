# The PWA layer — offline install, the service worker & the kill switch

The site uses plain static files with no application backend. The original R28
worker cached a small shell and previously visited resources; installation or
one visit alone did **not** make every tool available offline.

The November 2026 [verified offline library](2026-11-chart-console-offline.md)
adds an explicit complete download, checked file hashes, progress, recovery and
scoped removal. The portable ZIP runs the same public files on a local static
server. A private HTML export is a separate, self-contained reading snapshot.
External books, live sources and hosted AI/MCP services require a connection.

The historical shell/runtime mechanisms below remain relevant; explicit pack
preparation also works on localhost, while ordinary localhost browsing still
avoids automatic caching. The new pack is the supported way to establish full
static-tool readiness, rather than inferring it from normal browsing.

## The pieces

| File | Role |
|---|---|
| `sw.js` (repo root) | The hand-written service worker. Versioned cache names, shell precache + lazy runtime caching, cross-origin passthrough, consent-based updates, the kill switch, localhost no-op. |
| `manifest.webmanifest` (repo root) | The web app manifest. Icons are inline-SVG data URIs (no binary assets). Linked from `index.html` (`<link rel="manifest">`). |
| `assets/js/app/sw-register.js` | Registers the worker, drives the consent-based update toast, exposes the in-page kill path. Mounted by `shared.js` via a guarded dynamic import. |
| `scripts/build-search-index.mjs` | Builds `assets/search-index.json` — the full-text search corpus the command palette lazy-loads. Gate-class script: **re-run before every deploy.** |

## Caching model (read before editing `sw.js`)

- **Versioned caches.** Bump `VERSION` in `sw.js` on any deploy that changes
  cached bytes. `activate` deletes every cache whose name isn't in the current
  set, so a version bump cleanly retires the old one.
- **Shell precache, lazy everything-else.** Install precaches a small curated
  boot set (chrome + engine + `index.html` + the search index), each fetched
  individually so one 404 can't fail the whole install. Everything deeper is
  cached the first time it's requested (stale-while-revalidate for assets,
  network-first for navigations). The site becomes fully offline after normal
  browsing, not on the first install.
- **Cross-origin is never touched.** Any request to another origin is left to the
  browser. This is what keeps the **BYOK LLM calls** (`api.anthropic.com`,
  `api.groq.com`, `api.openai.com`, …) and every external link on the network and
  out of the cache — a reading containing birth data must never enter a cache it
  wasn't meant to.
- **Updates need consent.** A new worker installs and **waits**. `sw-register.js`
  shows the site `.toast` ("A new edition is ready — Reload / Later"); only the
  user's click posts `{type:'SKIP_WAITING'}`. A student mid-calculation is never
  reloaded out from under their work.
- **Localhost is a no-op.** On `localhost` / `127.0.0.1` the worker installs but
  caches **nothing** and passes every request straight through. The dev
  hard-refresh flow and the Chromium verify gate behave exactly as if no worker
  were present.

## The dev flow

Nothing changes. `python -m http.server` serves the site; the worker registers
but no-ops on localhost, so a hard refresh (Ctrl-Shift-R) always fetches fresh
bytes. If you ever want a truly worker-free tab, open DevTools → Application →
Service Workers → Unregister (or run the kill path below).

## The kill switch — two paths

If a bad deploy ever pins users to a stale version, disarm the PWA:

### 1. The deploy path (everyone, automatic)

In `sw.js`, set:

```js
const KILL_SWITCH = true;
```

…and deploy. On its next activation the worker **clears every cache and
unregisters itself**, then hands each open client back to the plain network on
its following navigation. It also stops intercepting `fetch` immediately. Leave
`KILL_SWITCH = true` for at least one release cycle so every returning visitor's
worker self-destructs, then remove the worker (or ship a fresh `VERSION`).

### 2. The in-page path (a single browser, now)

From the site in a browser console:

```js
import('/assets/js/app/sw-register.js').then(m => m.killServiceWorker());
```

`killServiceWorker()` posts `{type:'KILL'}` to the active worker (clear caches +
unregister), unregisters every registration, and empties Cache Storage. The next
load is worker-free.

## Rebuilding the search index

`assets/search-index.json` is generated, not hand-edited. Whenever page prose
changes, re-run:

```
node scripts/build-search-index.mjs
```

It walks every `.html` page, extracts title/headings/body, and rewrites the JSON.
The command palette lazy-loads it on first open (never at page load) as the third
"On this site" full-text result tier, below the nav + registry hits.
