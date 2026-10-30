#!/usr/bin/env bash
set -euo pipefail
cd /workspace/astrology-sim-ant
out=/workspace/setup-validation/atlas-final
export PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium
export PLAYWRIGHT_PKG=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js
export SKY_LENS_ROOT=/workspace/astrology-skylens-fixture
run_gate() {
  local label="$1"
  shift
  local started result=0
  started=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  "$@" >"$out/$label.txt" 2>&1 || result=$?
  python3 - "$out/executed-gates.jsonl" "$label" "$started" "$result" "$@" <<'PYLOG'
import json,sys,datetime
path,label,started,code,*command=sys.argv[1:]
with open(path,'a') as f:
    f.write(json.dumps({'gate':label,'startedAt':started,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exitCode':int(code),'command':command})+'\n')
PYLOG
  if [ "$result" -ne 0 ]; then cat "$out/$label.txt"; return "$result"; fi
  echo "PASS $label"
}
run_gate audit node scripts/audit.mjs
run_gate engine node scripts/engine-test.mjs
run_gate opgraph node scripts/gen-opgraph.mjs --check
run_gate opgraph-gate node scripts/seed-opgraph-gate.mjs --check
run_gate profiles node scripts/build-specialist-profiles.mjs --check
run_gate round-ledger node scripts/round-ledger.mjs --check
run_gate mcp-toolkit node scripts/tests/mcp-toolkit.mjs
run_gate mcp-transports npm test --prefix mcp
for browser_phase in calculators workbench studio connections assistant pages; do
  run_gate "release-$browser_phase" env BROWSER_PHASE="$browser_phase" BROWSER_OUTPUT="$out/release-$browser_phase" node scripts/browser-release.mjs
done
run_gate observatory env OBS_OUTPUT="$out/observatory" node scripts/browser-observatory.mjs
run_gate studio-expansion env EXPANSION_OUTPUT="$out/studio-expansion" node scripts/browser-studio-expansion.mjs
run_gate ensemble env ENSEMBLE_OUTPUT="$out/ensemble" node scripts/browser-ensemble.mjs
run_gate all-pages env PUPPETEER_PKG=/workspace/astrology-browser-tools/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js CHROME_PATH=/usr/bin/chromium BASE=http://127.0.0.1:8030 node scripts/browser-verify.mjs
run_gate sky-contract node scripts/check-sky-handoff.mjs
run_gate sky-browser node scripts/browser-sessions.mjs
