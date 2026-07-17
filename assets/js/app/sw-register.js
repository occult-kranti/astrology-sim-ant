// ============================================================================
//  sw-register.js — registers the service worker (../../../sw.js) and drives the
//  CONSENT-BASED update flow (R28 P; dynamic-hosting.md rung (a) §3.1). Loaded
//  by shared.js via a guarded dynamic import — a failure here never touches the
//  page. The worker itself no-ops on localhost; this registrant runs everywhere
//  so the verify gate exercises the real registration path.
//
//  Update policy (identity: this site never nags, never yanks state):
//    · A new worker installs and WAITS. We show the site .toast: "A new edition
//      is ready — reload to open it." Nothing reloads until the user clicks.
//    · The reload is armed only by that click (the `updating` flag), so the
//      first-install clients.claim() can never bounce a reader's page.
//    · killServiceWorker() is the in-page panic path (mirrors sw.js's KILL).
// ============================================================================

const ROOT = new URL('../../../', import.meta.url).href.replace(/\/$/, '');
const SW_URL = `${ROOT}/sw.js`;
const SCOPE = `${ROOT}/`;

let updating = false;   // true only after the user consents to reload

export function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  // Only over secure contexts (https or localhost). file:// and plain http hosts
  // can't run a worker — bail quietly rather than throw.
  if (typeof window !== 'undefined' && window.isSecureContext === false) return;

  // This module is dynamic-imported by shared.js, so the window `load` event may
  // ALREADY have fired by the time we run — in which case a load listener would
  // never fire and the worker would never register. Register now if the page is
  // loaded; otherwise wait for load (don't compete with initial page fetches).
  if (document.readyState === 'complete') doRegister();
  else window.addEventListener('load', doRegister, { once: true });
}

function doRegister() {
  navigator.serviceWorker.register(SW_URL, { scope: SCOPE }).then(reg => {
      // A worker already waiting from a previous visit → offer the update now.
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);

      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          // 'installed' + an existing controller ⇒ this is an UPDATE, not the
          // first install. First installs stay silent.
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            offerUpdate(installing);
          }
        });
      });
  }).catch(() => { /* registration failed — the site works unchanged */ });

  // When control passes to a freshly-activated worker, reload once — but ONLY
  // if the user asked for it (guards against first-install claim() reloads).
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updating) return;
    updating = false;
    window.location.reload();
  });
}

// The kill path: unregister every worker + clear caches, from the page. Handy in
// the console (`import('/assets/js/app/sw-register.js').then(m=>m.killServiceWorker())`)
// and documented in docs/pwa.md alongside sw.js's KILL_SWITCH deploy path.
export async function killServiceWorker() {
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'KILL' });
    }
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
    if (self.caches) { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); }
  } catch { /* best-effort */ }
}

// ---------------------------------------------------------------------------
//  The update toast — built from the site's .toast component (DS2). Reduced-
//  motion parity is handled by the .toast CSS (fade only under no-preference).
// ---------------------------------------------------------------------------
function offerUpdate(worker) {
  if (typeof document === 'undefined') return;
  if (document.getElementById('sw-update-toast')) return;   // once

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'sw-update-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML =
    '<span class="sw-toast-msg">A new edition is ready.</span> ' +
    '<button type="button" class="btn-secondary sm" data-sw="reload">Reload</button> ' +
    '<button type="button" class="btn-quiet sm" data-sw="dismiss" aria-label="Dismiss">Later</button>';
  document.body.appendChild(toast);

  const close = () => { toast.remove(); };
  toast.querySelector('[data-sw="dismiss"]').addEventListener('click', close);
  toast.querySelector('[data-sw="reload"]').addEventListener('click', () => {
    updating = true;
    try { worker.postMessage({ type: 'SKIP_WAITING' }); } catch { /* ignore */ }
    close();
  });
}

export default registerServiceWorker;
