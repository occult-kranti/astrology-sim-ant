# Desktop chart studio — verification record

Date: 4 November 2026. Branch: `feat/desktop-astrology-workbench`. This record covers the original desktop browser workspace, its calculation adapter and private chart-library integration. It is a bounded engineering review, not a claim of equivalence with Solar Fire, TimePassages or Kepler, or empirical validation of astrology.

## Accepted browser candidate

The complete `scripts/browser-desktop-workbench.mjs` run passed **124 checks** in real Chromium **151.0.7922.34**, with Node **v24.19.0**. It completed at `2026-11-04T19:36:40.119Z` in approximately 17 seconds. The receipt reports zero runtime errors, missing resources or unexpected external requests. It records 14 screenshots and 25 successful native downloads.

The harness served the application under `/astrology-sim-ant/` on a temporary HTTPS loopback origin. Only that temporary certificate's public key was allowed for this browser process; the test did not disable TLS verification globally. The certificate files were removed afterward. The complete source inventory was hashed before and after: both inventories have SHA-256 `a78b1a6da6621c24abc964a0087975b097c9befcdcb874d46de1e1fc396fc27e`, with **no changed files** during acceptance.

Repository copies of the accepted receipt and before/after source inventories are in [docs/evidence/desktop](evidence/desktop/receipt.json).

Local retained evidence: `/tmp/desktop-workbench-qa/all-01/receipt.json`, `source-before.json`, `source-after.json`, the copied driver, screenshots and compressed native downloads. CI writes the same gate's evidence into `test-results/desktop-workbench` for the existing verification artifact upload.

| Product file | SHA-256 at acceptance |
|---|---|
| `pages/desktop.html` | `e6c1d8a4b490be765d6c3985c1ee8f9892c7cc7cef434e7e57c5609d9065af61` |
| `assets/js/app/desktop-workbench.js` | `d145bcfb6ac82c7409a76ac0bf9576cda17ff5c5c159c6d550ad81fc4a64d88b` |
| `assets/js/core/desktop-workbench.js` | `6e46dffc61633f60b0353074a4fa4b10054706d25de03b9502e5e1c91a8d8ced` |
| `assets/js/app/desktop-wheel.js` | `6c89ac08c37092a4fa5fbd308657255f71e383787b1e52b54424f39ab40ff3d7` |
| `assets/css/desktop-workbench.css` | `97dfa35738e51f08bd03ca4281bb79695b3e983d2907ce0e1c167a3ddd0051d4` |
| `assets/js/app/desktop-library.js` | `537d4a503e583503634f44692e7f576dbc88404ce4e48f031fb2ad803f6cc234` |
| `assets/offline-manifest.json` | `07877c02018b519a34c9cfe51464e2a4fd44ca920bae2fb036970390eb5e6863` |

## Actual exercised workflows

- Public equinox fixture at 20 March 2024, 03:06 UTC, London coordinates; the tropical solar longitude is within 0.05° of the March equinox. The nearly exact boundary correctly remains labelled 29°59′ Pisces when the unrounded longitude is below 360°.
- Twelve plotted bodies/points match the twelve exported longitudes; twelve house cusps remain available. All four house systems and the declared linear Lahiri rotation change the actual calculation.
- Single chart, transit and synastry modes. Transit stepping holds chart A fixed and advances chart B by an elapsed UTC day. Synastry does not fabricate a shared applying/separating clock. Reducing the orb reduces or preserves the admitted contact set.
- Settings edits mark results stale and disable exports and AI handoff. Toggling visual layers does not restore calculation readiness.
- Keyboard selection of a plotted body and a close-contact list item opens the relevant inspector and preserves focus after redraw. Native profile and AI dialogs close with Escape and restore their triggering controls.
- JSON studies, standalone SVGs, chart-library JSON and the reviewable AI text packet download through actual browser download events. The SVG parses without scripts or external assets. The AI text download matches the visible editable packet exactly. The print button's call to the browser print entry point is checked; the operating system's print dialog and PDF printer were not automated.
- Chart opening does not persist a profile. Explicit Save writes the primary chart; malformed imports preserve the existing bytes; identical reimports do not duplicate a chart. Markup-like chart names remain inert. Simulated storage quota failure preserves the previous library and leaves chart calculations usable.
- New York's skipped 10 March 2024, 02:30 clock is rejected. The repeated 3 November 2024, 01:30 clock requires a choice; earlier/later exports differ by exactly one hour. Accepted time-zone whitespace is normalized before subsequent navigation. The explicit Now action uses a current instant.
- Latitude 90° cannot produce invented house angles. At 80° latitude, the inherited Placidus fallback is disclosed in the visible output and export. Rejected navigation beyond the supported year range retains the previous chart and restores the slider.
- Keyboard movement to +365 elapsed days, reset to the exact reference and a burst of 101 slider previews followed by one released value. The final calculation corresponds to the final released value.
- Tool search, an unmatched-search message, and the complete 134-entry route catalogue. Links preserve the GitHub Pages project prefix and carry no private chart parameters.
- Reflow of wheel, positions, aspect grid and dialogs at 320, 390 and 1920 CSS pixels, with the principal workflow at 1440 pixels. A 200% CSS-zoom proxy also passed. Horizontal scrolling stays inside dense two-dimensional tables.
- Explicit preparation of the 536-file static offline library, followed by service-worker-controlled reload with the browser network disabled, a new chart calculation and export, and navigation to an unvisited Newton specialist page. Cache keys contain no chart-input parameters. External books and hosted AI were not tested offline and are not promised offline.

## Review corrections and visual inspection

Earlier retained development receipts exposed a genuine narrow-screen aspect-grid overflow. Absolutely positioned accessible header labels escaped their scrolling container; making that container positioned fixed the document overflow. The tool filters also needed wrapping at the zoom proxy's available width. The mobile Edit control received a non-shrinking width. SVG and close-contact focus restoration, normalized profile inputs and restoration after rejected time navigation were added before final acceptance.

One early functional test waited on the wrong status region for an import error; that test was corrected to inspect the actual library status. This was a harness selector error, not an application import failure. Source changes during development runs are recorded as ineligible evidence; only the complete unchanged run above is accepted.

The independent reviewer directly inspected these final screenshots:

- `functional-1440-initial.png`: complete chart desk, explicit observer and convention, local library and readable inspector.
- `layout-1920-initial.png`: wider desk keeps the wheel centred and the inspector adjacent.
- `layout-320-initial.png`: controls stack without page overflow; the Edit action remains legible. Wheel labels become small at this width, with positions and the inspector supplying text equivalents.
- `layout-390-profile-dialog.png`: the modal remains contained, labelled and usable with visible focus and actions.

No physical-device, screen-reader, Safari/Firefox, assistive-technology certification, human usability study or exhaustive input-space test is claimed. The CSS-zoom proxy is not a substitute for native browser zoom testing.

## Calculation, library and inherited gates

The independent reviewer replayed both new headless suites:

| Command | Observed result |
|---|---|
| `node scripts/tests/desktop-workbench.mjs` | PASS; 7,427 assertions, 156 casts including a 144-chart bounded stress grid |
| `node scripts/tests/desktop-library.mjs` | PASS; 599 assertions and complete 134-route inventory |

These suites combine canonical coordinate replay with independent angle, whole-sign and UTC-step arithmetic, input rejection and bounded storage failure cases. They do not constitute independent observational ephemeris validation across the full 1900–2100 range.

The parent integration lane additionally reported the executed full inherited engine suite passing **737 checks**, static audit passing **136 HTML / 341 JS, Problems: 0**, and `round-ledger --check` passing with the existing C3-not-evaluable state unchanged. The parent integration lane subsequently completed the inherited all-page browser sweep: **136 pages, 0 errors**, including reduced-motion, narrow-screen and print passes. Two pre-existing structured-descriptor warnings remain (dial input descriptor and recents fixture); they are not new desktop failures. The new desktop acceptance above binds the final product files; the broader development sweep overlapped earlier edits. Remote exact-commit verification and deployment are recorded separately in the release notes.

## Reproduce

Use the repository's browser tooling, or install the same test-only tooling used by its workflow. No browser dependency is shipped with the static application.

```sh
node scripts/tests/desktop-workbench.mjs
node scripts/tests/desktop-library.mjs
DESKTOP_OUTPUT=test-results/desktop-workbench node scripts/browser-desktop-workbench.mjs
```

Choose a new output directory for every run; the harness refuses to overwrite an existing receipt. `PLAYWRIGHT_PKG` and `CHROME_PATH` may select already installed local tooling. The optional `DESKTOP_PHASE` values run a focused development journey; only the full default `all` run can set `acceptanceEligible: true`. Rebuild the existing offline manifest after product-file changes before repeating the offline journey.
