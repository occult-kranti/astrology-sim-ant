# Standalone chart studio — independent file verification

4 November 2026. The downloadable `desktop-chart-studio.html` was opened as an actual `file://` URL in Chromium with networking disabled from browser-context creation. It passed **53 checks**, with zero unexpected runtime errors, zero automatic external requests and zero requests for sibling files. This is a downloadable local HTML application; it is **not a ChatGPT-hosted website, a new Pages deployment or a native desktop executable**.

## Accepted artifact

| Item | Recorded value |
|---|---|
| File | `/workspace/artifacts/desktop-workbench/desktop-chart-studio.html` |
| Size | 405,572 bytes |
| SHA-256 before and after verification | `2a325d81bccf99bf0be740fc4146d68a4b752292826ca2585c87d51fbcc63a09` |
| Browser | Chromium 151.0.7922.34 |
| Node | v24.19.0 |
| Completion | `2026-11-04T19:45:51.576Z` |
| Receipt | `/tmp/desktop-standalone-qa/run-02/receipt.json` |
| Receipt SHA-256 | `cb64b6e4b84f5d49daf448c7fc22658afc937768c776990049d9728b818b8647` |

The browser-tested artifact hash matches `standalone-build-receipt.json`. That build receipt binds 47 source inputs and records esbuild 0.25.11 and parse5 7.3.0. The builder retains the bundled astronomy engine's copyright and MIT licence text, includes seven stylesheets inline and emits one classic JavaScript bundle. Automatic font requests and the site service-worker installer are omitted. Browser verification found no external script or stylesheet dependency.

## Actual checks

- The file starts directly with a computed twelve-body/point chart, without a server or sibling files. Its saved-chart library is initially empty; merely opening the file does not save a profile.
- Editing a public 20 March 2024, 03:06 UTC fixture produces the exact selected instant and a solar longitude within 0.05° of the March equinox.
- The Lahiri option executes the declared frame rotation. An unsaved frame edit disables held exports until calculation.
- Transit mode calculates two explicit epochs and displays 24 markers. Time navigation holds chart A fixed and advances B by one elapsed UTC day. Synastry retains its separate no-shared-motion interpretation.
- Keyboard body selection updates the inspector. Dynamically produced source links resolve to HTTPS destinations, rather than broken local paths.
- Actual native downloads succeed for study JSON, SVG, chart-library JSON and the AI handoff text. The SVG parses without scripts. The handoff text exactly matches the editable, privacy-labelled packet shown in its native dialog; Escape restores trigger focus.
- Explicit Save persists a profile for the same file origin, and a real reload displays the saved library entry. A malformed import preserves the existing library. A separate context with deliberately blocked `localStorage` still calculates and exports charts and explains the storage limitation.
- Static and dynamically generated tool links remain valid HTTPS references or local fragments. The new desktop catalogue entry returns to `#dw-app` instead of linking to an unpublished Pages route. External links open deliberately in another tab with `noopener`; no chart fields are appended to them.
- At 390 CSS pixels, the wheel, positions, aspect grid and native editor remain contained without page overflow. The modal closes with Escape and restores its trigger's focus.
- The local offline guide explicitly identifies specialist pages and linked references as online resources. The standalone file does not register or require a service worker.

The run records nine successful native downloads and three screenshots. The independent reviewer directly inspected `desktop-1440-initial.png` and `mobile-390-editor.png`: the desktop desk retains its black chart surface, library and inspector; the mobile editor retains visible labels, focus and actions. The complete studio's broader numerical and responsive coverage remains documented in [desktop verification](2026-11-desktop-verification.md).

## Offline evidence and limits

Chromium reported `navigator.onLine: true` on this file origin even though Playwright had configured the browser context offline. A first development assertion incorrectly treated that advisory property as authoritative and was corrected. The accepted run verifies the actual network condition through one **explicit test-only probe**, which fails with `net::ERR_INTERNET_DISCONNECTED` before chart interaction. That request is absent from the delivered artifact and is recorded separately from application traffic. The application itself makes **zero automatic external requests** during the tested flows.

The catalogue links to existing specialist pages; this single file does not bundle every specialist workspace. The separately supplied full portable ZIP retains the broader collection and requires its documented local-server workflow. References and hosted AI services still require a connection. No AI inference is hosted inside this HTML file.

Local-file storage policy varies by browser. Moving or renaming the file can change which saved library is exposed, and storage can be denied or cleared. JSON backups are portable; the file does not guarantee cross-browser persistence. No Safari/Firefox, physical-device, screen-reader or operating-system print-dialog certification is claimed.

## Reproduce

```sh
node scripts/build-desktop-standalone.mjs --tools /tmp/desktop-standalone-tools/node_modules --out /workspace/artifacts/desktop-workbench
DESKTOP_STANDALONE_OUTPUT=/tmp/desktop-standalone-qa/new-run node scripts/browser-desktop-standalone.mjs
```

Use the builder's pinned build-only dependencies and an installed Playwright browser. `DESKTOP_STANDALONE_HTML` selects another built artifact; `PLAYWRIGHT_PKG` and `CHROME_PATH` select existing test tooling. Choose a new evidence directory for each run because the harness refuses to overwrite a prior receipt. Rebuilding the HTML requires verification of the resulting artifact hash.
