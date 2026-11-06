# Independent timeline-search browser verification

The browser review exercises the existing calendar timeline, the new complete daily search, memory-only study captures, and the explicit map transfer. The reviewer owns the verification driver and this report; product changes belong to the interface, numerical, and integration owners.

Driver: [browser-timeline-search.mjs](../scripts/browser-timeline-search.mjs). It uses real Chromium, real native controls, real Worker calculations and actual downloaded bytes. Test-side wrappers can delay and reorder completed Worker messages, simulate a missing Worker constructor, delay a map-transfer handshake and accelerate the receiver's expiry timer. They do not expose a mutable product test hook or invent calculation results.

## Acceptance scope

- The applied range, observer, local clock, zone and repeated-clock policy must be the actual scan request. Editing that context or the scan conditions invalidates earlier results and actions.
- Every sampled date, unavailable clock, selected calendar slot and all forty available line distances must remain in the canonical downloads. Display filters, order and pagination must leave the full statistical family and denominators unchanged.
- A selected search row must update the existing linked chart at its exact sampled UTC. Existing native calendar sliders and public bookmark controls remain available inside the new disclosures.
- Fixed geometry retains its immutable source instant. Transit geometry follows each sampled instant. Missing and repeated clocks retain their reasons and candidates. Irregular UTC spacing cannot masquerade as a regular statistical grid.
- Within-grid exceedance frequencies include ties and expose their available denominator. Descriptive correlations, the artificial circular-phase reference, adjustment and outcome-probability limits remain distinct.
- Kept studies preserve their exact old request and row without relabelling them after an observer edit. They live only in tab memory until an explicit download; reload clears them.
- The map handoff carries only an opaque nonce in its URL. The receiver previews transferred inputs while preserving the prior map; only an explicit calculation accepts them. Invalid, expired, unsupported and cancelled transfers retain the existing map.
- The complete flow is checked at 320, 390, 1440 and 1920 CSS pixels with keyboard input, touch-capable mobile emulation, the site font and a DejaVu fallback. Tables have named, focusable horizontal-scroll regions. Screenshots require visual review beyond automated geometry checks.

The receipt hashes every public file under `assets`, `pages` and `mcp`, plus the root public entry/service-worker/manifest files and the driver, before and after each run. A final receipt is eligible only when explicitly run with `TIMELINE_SEARCH_FROZEN=1`, all four widths and all journeys, no source drift and no failures. An existing receipt directory cannot be overwritten.

## Preliminary evidence

The first 390 px run passed 68 checks, six actual downloads and four screenshots with zero runtime errors. Its receipt is `/workspace/setup-validation/timeline-search/preliminary-1/receipt.json`. It is explicitly preliminary and is not release acceptance. All four PNGs were directly inspected; visible text and controls were readable. The screenshot targets were subsequently refined to include the result heading and selected-row inspector separately.

Static integration review identified three bounded disclosures for the interface owner: derive selected line membership from the requested bodies/angles rather than a nonexistent line flag; expose both fold candidates; and use the handoff callback's human message instead of its state identifier. The owner corrected these, and the final browser run verified the corrected behavior.

The second diagnostic retained three test-driver visibility timeouts after the interface began closing the search-conditions disclosure on start. The driver now explicitly reopens it before editing. Its eight initialization errors came from the test's storage-sentinel setup running in opaque `about:blank` documents; the setup now runs only on HTTP(S) documents. These are preserved in `preliminary-2/receipt.json`, not discarded or represented as product failures. That run also verified the corrected line membership and fold candidates, and completed the first real map preview/acceptance.

The complete third diagnostic passed 408 checks, 36 actual downloads and 31 screenshots across all four widths and all ten journeys, with zero browser errors. Receipt: `/workspace/setup-validation/timeline-search/preliminary-3/receipt.json`. Two interface files changed during this run, so its passing receipt correctly has `acceptanceEligible: false`. The final driver additionally records the initial receiver URL to verify its nonce-only fragment, checks map-transfer action geometry and verifies that fractional seconds are refused explicitly when the destination form supports whole seconds only.

## Frozen acceptance

The final run on 6 November 2026 passed **420 checks, 36 actual downloads and 31 screenshots**, with zero runtime errors, missing resources, external requests, assertion failures or source changes. All ten journey instances ran, including the complete responsive journey at all four widths. The receipt has `pass: true` and `acceptanceEligible: true`.

Evidence is retained under `/workspace/setup-validation/timeline-search/final/`:

- `receipt.json`: checks, actual download hashes, screenshot hashes, browser/font receipts and eligibility. SHA-256: `fc6532da0f2bdf4083f5d22602310ee52f70c5272b26ba268c84d8b29ac61e4c`.
- `source-before.json` and `source-after.json`: identical manifests of 596 public files and the driver. Manifest hash: `3bf6e140c852125f9d280316b9cbff165df4d6c00e6bfd24d0afa50842cd9c80`.
- `driver.mjs`: exact executed driver, SHA-256 `aa5b66def053b8b999a1a73d86c7676b2382869b22ead4e8d1d9022d2419c0a0`.
- `visual-review.json`: direct inspection of all 31 PNGs. The twenty responsive views and eleven lifecycle, missing-clock, fixed-map and transfer views were accepted without a visual blocker. The configuration screenshot named `worker-lifecycle-390-recoverable-error.png` does not show the offscreen error status; error visibility and recovery are established by the browser assertions.
- `retention-audit.json`: all 597 current manifest entries, the driver snapshot, 31 PNG hashes and sizes, and 36 compressed and expanded download hashes were independently rechecked successfully.

The real 32-day transit fixture contains 32 map-available samples and 32 map-threshold matches, while only seven samples meet the separate calendar/rule conditions. The final run verifies the visible statement that this map threshold did not narrow the search. Display filtering and sorting leave the downloaded full ledger, statistical family and denominators unchanged; the observed within-grid upper-tail frequencies are independently recomputed with ties included.

Lifecycle checks release real Worker results in reverse order, cancel pending work, edit the applied clock and recover from a simulated constructor failure. Replaced or cancelled results cannot restore stale actions. New York gap and fold fixtures preserve missingness and both candidate instants; resolving the fold does not make unequal UTC spacing eligible for the regular-grid reference. Kept records preserve the old request after an observer edit and disappear on reload.

The actual map-transfer journey verifies a nonce-only initial fragment, immediate fragment removal, unchanged receiver inputs/map before explicit acceptance, and exact UTC, observer, zone, house system and complete geometry catalogue afterward. Fixed-map transfers keep their source instant; fractional-second input is explicitly refused by the whole-second destination form. Malformed, expired, unsupported and source-cancelled transfers preserve the receiver's prior map and expose a recovery message. These assertions use real same-origin channels and retained map downloads.

Key accepted source hashes are recorded below; the complete manifest is authoritative.

| File | SHA-256 |
| --- | --- |
| `assets/js/app/timeline-search.js` | `4f4f202729345f790acb29caa5b1ba955c205eed0cfb29e9fe50706d924ca3d4` |
| `assets/js/core/timeline-search.js` | `337f0b658c2a655adfe0147b8f8c53fb991af5dbb0fe92646fe364f9c4589c01` |
| `assets/js/core/timeline-statistics.js` | `b7b169caedca445472a5450d29254b4e6908d4a2da7ce52ce3acb3a825f420b8` |
| `assets/js/workers/timeline-search-worker.js` | `963f5bacec8de0a489c892c26f33d30264afc71c1f812d9824f992084dca2d1d` |
| `assets/js/app/astrocartography-handoff.js` | `fda8bf26ee6e94a3aef607383db252463d32eb34caf7c2b279cca5a89b7ac4ec` |

## Reproduction and limits

Run a static server on port 8003, then use a fresh output directory:

```sh
TIMELINE_SEARCH_OUTPUT=/workspace/setup-validation/timeline-search/final \
TIMELINE_SEARCH_FROZEN=1 node scripts/browser-timeline-search.mjs
```

`BASE`, `PLAYWRIGHT_PKG` and `CHROMIUM_PATH` can select another local server or installed browser. `TIMELINE_SEARCH_WIDTHS` and `TIMELINE_SEARCH_JOURNEYS` support diagnostic subsets; subset runs are never final acceptance. The installed default is Chromium 1234 through Playwright.

This verifies browser integration and consistency with the inherited canonical calculations. It is not an independent ephemeris validation, historical source authentication, prediction validation, physical-phone test, screen-reader session or human usability study. The separate numerical reviewer checks optimizer/statistical equivalence. Root owns the repository-wide gates, release and deployment status.
