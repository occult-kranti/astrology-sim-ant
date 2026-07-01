// ============================================================================
//  local-config.js — OPTIONAL per-device defaults for the AI assistant.
//
//  This file is COMMITTED EMPTY and contains NO secrets. The public/deployed
//  site ships this empty stub — nothing is bundled, and no key is ever exposed
//  in the repo (a client-side key in a public site would be scraped and revoked).
//
//  To pre-fill your OWN key as the default on THIS device only (so you never
//  paste it again), set the fields below and tell git to ignore your local edit:
//
//      git update-index --skip-worktree assets/js/app/local-config.js
//
//  Your edit then stays on your machine and is never staged or pushed. To undo:
//      git update-index --no-skip-worktree assets/js/app/local-config.js
//
//  NEVER commit a real key here.
// ============================================================================
export const LOCAL_DEFAULTS = {
  provider: '',   // '' | 'groq' | 'anthropic' — the provider to select by default
  key: '',        // the API key for that provider (THIS DEVICE ONLY — never commit)
};
