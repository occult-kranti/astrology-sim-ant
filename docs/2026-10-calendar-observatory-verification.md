# Calendar Observatory: verification and limits

Branch: `feat/mobile-calendar-observatory`, based on `5f030c0`. This report records executed local tests of the redesigned static frontend and shared engines. It does not claim production deployment, human practitioner approval, an automatically connected ChatGPT session, or real AI provider calls.

## Executed checks

| Check | Result | Evidence |
|---|---|---|
| Baseline application inventory/browser sweep | PASS, 117 routes at 390px; all200/chrome/main/skip; zero exceptions, missing resources or outgoing requests; two pre-existing page overflows identified | [Immutable baseline receipt](evidence/calendar-observatory/baseline/receipt.json) and six before screenshots |
| Full current engine gate | PASS, including all inherited suites and the new calendar, scheduling and AI packet tests | [Final engine log](evidence/calendar-observatory/engine-final.log) |
| Independent arithmetic review | PASS, 24 assertions on same-instant identity, separate zodiac zero points, tithi, DST, skipped dates, polar unavailable states and validation | [Receipt](evidence/calendar-observatory/round2-engine.json), [portable verifier](evidence/calendar-observatory/verify-engine.mjs) |
| Static import/link audit | PASS119HTML/256JS at execution, zero broken references | `node scripts/audit.mjs`: 119 HTML, 256 JS, Problems: 0 |
| Historical round ledger | Current; C1/C2 pass; inherited C3 not evaluable and historical claim counts remain unverified | Command `node scripts/round-ledger.mjs --check`; this is not represented as a C3 pass |
| SkyLens adapter parity | PASS, same adapter bytes and six pinned fixtures, SkyLens revision `2b2aa089009db3ddedc2256a7a5456b402b23962` | `SKY_LENS_ROOT=/path/to/pinned/skylens node scripts/check-sky-handoff.mjs` |
| Existing SkyLens/Studio session journeys | PASS, five journeys; 320/390/1280px; context transfer, journal/symbol restore/export, Apia and explicit AI privacy/error/cancellation cases | [Session report](evidence/calendar-observatory/sessions-final.json) |
| New primary mobile/desktop journeys | PASS, 109 checks in corrected preliminary run, zero exceptions/missing/outgoing requests | [Receipt](evidence/calendar-observatory/journeys-corrected/receipt.json) |
| Final source-bound application sweep and primary journeys | PASS, 354 page/viewport loads and 121 checks; 406 product files unchanged; zero runtime/console errors, missing resources or outgoing requests | [Final native-input receipt](evidence/calendar-observatory/final-native-inputs/receipt.json) |
| Existing browser-release journeys and complete HTML gate | PASS, all 6 isolated supported phases: 15 user journeys plus 119 HTML entries; summed serial runtime 333.5 seconds | [Phase aggregate](evidence/calendar-observatory/browser-release-aggregate.json) |
| Legacy Puppeteer check | Exit 0; 119 pages, 0 page errors ; 9 structured drives executed with 2 historical descriptor assertion warnings ; 89 prose drives are documented/page-load covered, not 89 executed semantic journeys | [Exact-scope receipt](evidence/calendar-observatory/legacy-browser-final.json), [log](evidence/calendar-observatory/legacy-browser-final.log) |

A separate default-state text contrast check of seven new-homepage pairs passed the 4.5:1 threshold (minimum 5.66:1). This is a narrow check, not a whole-site or all-interaction-state audit: [measured pairs](evidence/calendar-observatory/final-contrast.json).

## Reproduce

The application remains a static ES-module site with no frontend build step. Use the repository’s Node version and install the pinned test-only Playwright dependency as documented by the existing release workflow. For a managed local Chromium installation set `PLAYWRIGHT_EXECUTABLE_PATH`; CI otherwise uses Playwright’s installed browser.

```sh
node scripts/engine-test.mjs
node scripts/audit.mjs
node scripts/round-ledger.mjs --check
node docs/evidence/calendar-observatory/verify-engine.mjs
for phase in calculators workbench studio connections assistant pages; do
  BROWSER_PHASE="$phase" BROWSER_OUTPUT="test-results/$phase" node scripts/browser-release.mjs
done
OBS_OUTPUT=test-results/observatory node scripts/browser-observatory.mjs
SKY_LENS_ROOT=/path/to/pinned/skylens node scripts/check-sky-handoff.mjs
SKY_LENS_ROOT=/path/to/pinned/skylens node scripts/browser-sessions.mjs
```

The new harness serves files under `/astrology-sim-ant/`, blocks external requests, denies location/camera unless explicitly invoked, blocks service workers for isolation, uses real headless Chromium, exports and parses real download bodies, and freezes browser clocks for deterministic midnight/Monday and DST tests. It does not replace calculation reference vectors or actual phone/screen-reader use.

## Important scope

- All 117 original root/application routes are retained; the comparison page adds one. Documentation HTML is counted separately.
- The complete sweep checks route/resource health, common chrome/landmarks and page reflow. It is not a claim that every control on every page received a separate manual interaction test.
- Representative original calculator, Workbench, Studio, MCP and AI journeys run in the existing release harness. Source records, local saves and engine conventions are retained and tested where those journeys cover them.
- Visual review includes 390px mobile,683px reflow equivalent to half a 1365px desktop viewport, and 1365px desktop. This is not a screen-reader test or physical-phone test. Contrast/semantics/focus are implementation checks, not WCAG certification.
- Civil calendar rows use named runtime conventions and midnight in the selected IANA zone; they do not calculate all religious sunset days, local crescent decisions, festivals or regional traditions. Newly surfaced runtime calendars retain their reference-validation limitation.
- Historic quality classifications remain source-labelled, tradition-specific and partly secondary-source based. An opening-portion rule without limb timing cannot supply an active verdict. Similar solar/lunar inputs are not independent corroboration or predictive validity.
- Follow-present refresh runs while the page is open and on return. A closed browser runs no background forecast service.
- New AI handoff prepares a local preview and copies/downloads only by explicit action. The plain ChatGPT link contains no packet. Users paste/send themselves; no access to this conversation/account is claimed.
- Local MCP transport tests do not establish that the separately hosted production MCP process has deployed the two new tools or that a ChatGPT client connected successfully.

## Release-driver corrections and retained failures

The first all-mode release runner passed its 15 modern user journeys but encountered the legacy master-page delayed-redirect race and later a protocol failure opening a new tab. It was stopped at a bounded 19-minute budget. Its final report is retained as failed; this report does not claim a successful one-process all-mode run. The corrected master-alias check awaits the intended Workbench destination. All 6 supported phases subsequently passed in isolated processes, including 119 HTML pages; the CI workflow now uses those same phases without reducing coverage or extending its 20-minute budget. The cause of the long-lived browser/lifecycle failure remains unconfirmed.

The final visual pass also caught native date/time content clipping inside otherwise non-overflowing 320px form controls. Both new forms now use full-width date/time fields at 480px and below. Eight focused checks verify at least 200px value space, 44px control height and 16px font at 320/390px; actual en-US native controls showing the full 2026 year and 11:59:59 PM were inspected: [measurement receipt](evidence/calendar-observatory/native-input-verification.json), [home320px](evidence/calendar-observatory/native-home-320.png), [comparison320px](evidence/calendar-observatory/native-compare-320.png).

The new comparison page and three older entry pages missing explicit icons received the existing inline favicon so the stricter browser request check makes no implicit `/favicon.ico` 404 request. These head/presentation fixes do not change numerical engines. Earlier passing source-bound receipts remain review history; the current candidate is bound by `final-native-inputs/receipt.json`.

## Successive review evidence

[Panel ledger](2026-10-calendar-observatory-panel.md) distinguishes the baseline assessment, changed implementation challenge, and corrected final candidate. Intermediate failing receipts are retained as review history: the early sweep used an older hardcoded skip-target driver while the shell was being corrected, and the first journey driver attempted a hidden select before opening its disclosure. These are not relabelled as final passes.
