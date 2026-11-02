# Orbital Space verification

The focused browser gate is `scripts/browser-orbital-space.mjs`. It serves the real static application under `/astrology-sim-ant/`, uses a public London fixture, disables service workers, blocks unexpected remote requests, and captures actual native downloads and screenshots. No birth record, provider key, connected-calendar write, or model inference is involved.

## Planned acceptance scope

- Earth-view angular directions and Sun-centered AU geometry remain distinct. Earth is a selectable body in the Sun-centered frame, with finite vectors and truthful display-scale labels.
- Native SVG downloads identify the selected frame, pair and exact UTC, retain physical-vector metadata, resolve local paint references, and contain no executable document elements.
- A bounded event search locates the independently documented 8 April 2024 total solar eclipse; the interface retains the distinction between a global eclipse and local visibility.
- Event-kind filters, keyboard-operable event bookmarks, range selection, explicit saving, previous/next navigation and exact-instant casting update their actual state.
- Named traditional favorable/caution classifications remain separate from astronomical event geometry and do not imply physical-danger forecasts.
- Cancellation and superseded inputs cannot install stale event results or enable stale exports.
- Real rendered views at 320, 390 and 1440 CSS pixels, reduced motion, native keyboard controls, and a 200% CSS-zoom reflow proxy are checked. CSS zoom is not claimed as browser zoom or physical-device coverage.

## Execution status

The planned checks below are completed by the accepted focused run. Predictive validity is outside the gate.

## Accepted focused browser run

The final candidate passed **109 browser assertions** in Chromium **145**, with **zero page/console errors, zero missing resources and zero unexpected external requests**. The source inventory covers **538 files**; its before/after SHA-256 is `e81f13970fe888adf26b974eb1de8ef4113f46a876c26764c6c9a21646fd1e18`, with no changed source files during the run.

Executed from the repository root:

```bash
ORBITAL_OUTPUT=/workspace/setup-validation/orbital-space/attempt4 \
PLAYWRIGHT_PKG=/tmp/site-design-playwright/node_modules/playwright/index.mjs \
CHROME_PATH=/tmp/site-design-browsers/chromium-1208/chrome-linux64/chrome \
node scripts/browser-orbital-space.mjs
```

`PLAYWRIGHT_PKG` and `CHROME_PATH` select the already installed development tools. The script also supports the ordinary installed `playwright` package and its default browser for CI. Use a fresh output directory: the gate refuses to overwrite an existing receipt.

Actual evidence outside the public site:

- Receipt: `/workspace/setup-validation/orbital-space/attempt4/receipt.json`.
- Direct visual and byte acceptance: `/workspace/setup-validation/orbital-space/attempt4/visual-acceptance.json`.
- Eight actual PNGs were individually inspected: the native Earth-view SVG opened as a standalone image, the desktop Sun-centered Earth–Mars diagram, desktop populated eclipse timeline, the focused control at a 200% CSS-zoom proxy, and populated stage/timeline views at both 390px and 320px.
- Nine actual SVG downloads retain hashed compressed and native bytes. All nine were independently decompressed and parsed as inert SVG documents. The Earth-view native download was also rendered as its own image document, with black/neon computed paints preserved.

The assertions recover the true 3D angle using an independent vector dot product and the longitude-only separation using modular longitude arithmetic. Sun-centered vector norms match their AU distances; display rotation/compression preserves the physical source vectors. Changing turn/tilt changes actual drawn geometry. Earth-view endpoints exclude Earth itself, while Sun-centered pairs can include Earth.

The 90-day fixture centered on 1 April 2024 returns the **8 April 2024 total solar eclipse**, with a computed global peak at **18:17:19.495Z**. The historical NASA catalogue row gives TD 18:18:29 and rounded ΔT 74 seconds, implying approximately UT 18:17:15. The gate uses a 60-second comparison allowance; it does not claim that the historical rounded value is exact UTC or that London sees the global event type. The catalogue source is `https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html`; the independently captured source receipt is `/workspace/setup-validation/orbital-sources/nasa-2024-eclipse-check.json`.

The populated event controls were exercised at 1440px, 390px and 320px. Exact event casting retains the solved UTC timestamp. Filtering, keyboard range input, reversible previous/next navigation, explicit bookmark save/removal and its public-reference-only schema passed. The selected event's named source reading prints its own calculated timestamp. Two actual local source links were checked for application-root resolution and HTTP 200 responses. Cancellation and an external moment edit prevent a superseded search from restoring ready state or enabling stale export/cast controls.

The 200% check is a **CSS-zoom proxy**, with the actual focused viewpoint selector checked by a center-point hit test and captured between the fixed site navigation. It is not evidence of physical-device or browser-level zoom coverage. Native select text can truncate inside its control; the complete option remains available through its native menu and accessible value. The mobile two-dimensional event timeline scrolls locally; its complete event list remains available as native agenda buttons. Scaled SVG labels are supplemented by full-size native endpoint controls and numerical facts.

## Earlier attempts retained

- `attempt1`: 47 assertions passed before a test-only selector timeout. The harness attempted to focus Mars while selected-system mode did not plot Mars. A late component edit also invalidated the frozen-source assertion. This run is not acceptance evidence.
- `attempt2`: 97 assertions passed with frozen source, before adding populated mobile event views and a standalone native-SVG rendering check. It is superseded by the fuller final run.
- `attempt3`: 106 assertions passed, then a separately found source-link resolution defect was fixed in the product. This candidate is superseded; its zoom screenshot also showed global navigation rather than the intended target. The final gate checks actual local source responses and focuses/scrolls/hit-tests the target before the zoom screenshot.

No physical handset, screen reader, human usability study, exhaustive event search, local eclipse visibility model, or provider inference was exercised by this focused gate. Wider engine/site/inherited checks are recorded by the release integrator separately.

## Integrated local release checks

The release integrator also ran the complete dependency-free engine gate (**736 assertions, all passed**), including the new isolated orbital suite (**87 numerical assertions**) and updated assistant suite (**20 checks**). The static audit scanned **135 HTML / 336 JavaScript files with zero problems**. The real Chromium all-page gate completed **135 pages with zero errors**, including its existing UI/print journeys. The retained sky gate passed **3,520 checks and 307 downloads**, with its orbital assertions migrated to the actual replacement controls while retaining AU vector norms, rotation/compression invariance and portable metadata checks.

All ten existing generator freshness checks pass. The round ledger remains current: C1/C2 pass; inherited C3 remains not evaluable and is not promoted to pass. The offline inventory contains **529 public files / 52,972,098 bytes**, version `52a5dddf6050ac0b75f0f8b4d58aff3733e7a5ba33192a3e2ed35f7a8277cf5a`. The independently built portable ZIP has **532 entries / 7,471,158 bytes**, SHA-256 `4090dc111c3abb20e10cb627d37934e8f8c150e73b06a0f67d0eea160ebc454c`.

The root directly reviewed the final desktop eclipse rail and 320px populated timeline in addition to the independent eight-image review. A separate numerical reviewer inspected the integrated frame, projection, assistant and lifecycle code; the two blockers it found (unfrozen export paint and retrieval-query overflow) were corrected. A root review found the local source-link base-path defect, corrected before the accepted 109-check run. Product bytes were frozen for that accepted run. Local evidence is under `/workspace/setup-validation/orbital-space/`; production identity, workflow/artifact and disconnected live tests are recorded there after deployment.
