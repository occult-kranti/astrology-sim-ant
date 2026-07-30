---
name: verify-site
description: The project's CHECK gate. Run after any change to this Lilly/Picatrix astrology site before committing — it serves the static site, loads every page in real Chromium (failing on any console error/pageerror/failed request and asserting the chrome is injected), runs the static link+import audit, and runs the headless engine test. Use whenever asked to verify, check, test the site, or confirm a change works, and at the end of every ROADMAP phase.
---

# verify-site — the universal verification gate

Run all five checks from the repo root. **All must pass (exit 0) before committing.**

## 1. Static audit (dependency-free, fast)
```bash
node scripts/audit.mjs
```
Must print `Problems: 0`. Fix any BROKEN LINK / BROKEN IMPORT before continuing.

## 2. Engine headless test (dependency-free)
```bash
node scripts/engine-test.mjs
```
Must print `all passed` (equinox/solstice Sun, body-parts, dignity/almuten/cautions shapes).
When you add a core module, extend `scripts/engine-test.mjs` with a check for it.

## 3. Real-browser sweep (every page, 0 console errors)
Ensure the server is up on **8003**, install puppeteer once (ephemeral, in /tmp), make sure
Chromium's system libs are present, then run the committed harness:
```bash
# serve (skip if already running: curl -s -o /dev/null -w '%{http_code}' http://localhost:8003/index.html)
(python3 -m http.server 8003 >/tmp/httpd.log 2>&1 &) ; sleep 1

# puppeteer + Chromium (once per container)
[ -d /tmp/node_modules/puppeteer ] || (cd /tmp && npm i puppeteer && node node_modules/puppeteer/install.mjs)
sudo apt-get install -y -qq libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 \
  libasound2t64 libnss3 libnspr4 libxshmfence1 2>/dev/null

PUPPETEER_PKG=/tmp/node_modules/puppeteer/lib/puppeteer/puppeteer.js \
BASE=http://localhost:8003 \
PUPPETEER_CACHE_DIR=$HOME/.cache/puppeteer \
node scripts/browser-verify.mjs
```
Must print `0 errors` and `hdr✓` on every page.

## 4. The generator artery (one second; run it before committing any hand-edit)
```bash
node scripts/gen-opgraph.mjs --check       # exit 1 = the generated data module has drifted
node scripts/seed-opgraph-gate.mjs --check # exit 1 = gate.json is not what its decisions produce
```
Each rebuilds its output in memory and compares it to the committed bytes, so **hand-editing
`assets/js/core/data/opgraph.js` or `research/opgraph/gate.json` is a failure, not a silent
divergence**. Both are also asserted from inside step 2 (the `artery:` checks and the
`og-artery` module), so a green engine-test already covers this — but this is the cheap
version that runs without loading the suite. If either fails, the fix is to re-run the
generator (`node scripts/gen-opgraph.mjs`) and put the change in its tracked INPUTS, never
in its output.

**When you add a generated data module, give it a `--check` and add it here.** Five older
modules under `assets/js/core/data/` name generators that were never committed; nobody can
tell a rebuild from a hand-edit in any of them. That list is in `OPGRAPH_META.orphanedGenerators`
and it should shrink, not grow.

## 5. The round ledger (telemetry)
```bash
node scripts/round-ledger.mjs --check   # exit non-zero = docs/ROUND-LEDGER.md is stale
node scripts/round-ledger.mjs           # regenerates it; EXIT 3 IS A HARD STOP
```
Exit 3 means stop condition C1 has tripped — the ledger's own arithmetic over
`docs/telemetry/rounds.jsonl` says the recent rounds have produced tooling rather than
subject matter. It is a signal to change what the next round does, not a lint to silence.
At the end of a round, record the real gate numbers first:
`node scripts/round-telemetry.mjs record --round <id> --force --domain <N> --tooling <M>`
(`--force` appends a superseding row; it never rewrites a line).

## Notes
- The puppeteer entry is `…/lib/puppeteer/puppeteer.js` (NOT `lib/esm/…`); the Chromium is at
  `~/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome`. **Do not** use `/opt/pw-browsers`
  (it does not exist here — that path is from a stale handoff).
- For a tool/page that renders data, also add a `page.evaluate` content assertion (e.g. the
  Master Tool check: verdict badge present, ≥1 caution row, dignity rows = 7) — see the pattern
  used when the Cautions panel was added.
- If `sudo apt-get` is unavailable, the libs are usually already installed from a prior run.
