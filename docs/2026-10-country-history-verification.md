# Independent historical country/calendar verification

This review concerns the bounded historical study on `feat/country-calendar-history`, extending published baseline `e049fc9`. It does not validate historical timezone accuracy, historical-source truth, cultural authority, or astrology's predictive efficacy. The reviewed page compares curated past records and explicit assumptions; it accepts no future date, military objective, country rank, or outcome prediction.

## Drivers and scope

- `scripts/tests/country-history-independent.mjs` independently checks fixed marker/date identities, all sixteen date-only records, source metadata and citation closure, explicit noon assumptions, all three pre-1900 unavailable records, four house conventions, complete toolkit/core parity, and strict core/adapter/toolkit malformed/future/objective rejection.
- `scripts/browser-country-history.mjs` runs the actual page under a Pages-style URL prefix using real Chromium. It inspects actual JSON and CSV downloads, source precision and metadata, every variant in valid batches, selection errors and recovery, stale result invalidation, changes during the animation-frame calculation handoff, all four house systems and twelve rendered cusps, native slider keyboard input, horizontal table keyboard access, source anchors, responsive layout and platform fonts.
- Browser receipts bind all application assets, pages, root entry files and MCP modules before and after the run, plus both independent test drivers. Actual downloaded bytes are retained as gzip files with raw and compressed byte counts and SHA256 fingerprints. A diagnostic run that permits changes is never marked acceptance eligible.

These are independent AI-agent software checks. They are not human participant research, screen-reader testing, a physical-device test, fresh primary-source research, hosted MCP deployment evidence, or production publication evidence.

## Diagnostic findings

The first independent semantic run passed **187 checks**. This run was performed while root integration was still underway; final held-candidate evidence remains separate.

The first 390px browser diagnostic stopped after 70 checks because its driver incorrectly used `End` as a horizontal-scroll command. The retained failed receipt is `docs/evidence/country-history/independent-diagnostic/receipt.json`. The driver was corrected to `ArrowRight`; no product change or layout-threshold relaxation was made for this driver error.

The corrected 390px diagnostic then exposed an actual keyboard-access defect. The named, focusable `#ch-calendar-table` wrapper measured 358px for both client and scroll width. Its child table inherited `display: block; overflow: auto` and measured 358px client width against 1280px scroll width. Horizontal scrolling therefore belonged to the nested table rather than the labelled region receiving keyboard focus. The failed receipt and screenshot are retained at `docs/evidence/country-history/independent-diagnostic-2/`. The issue was sent to the interface owner for correction. No product files were changed by independent QA.

The 1440px diagnostic passed **488 checks and 18 actual downloads**, with zero runtime/console errors, missing local responses, failed requests or external requests. The interface owner then applied a scoped table display/overflow correction. The corrected 390px diagnostic independently passed the same **488 checks and 18 downloads**, including native `ArrowRight` horizontal scrolling. Both runs are explicitly diagnostic and not acceptance eligible. Receipts: `independent-desktop/receipt.json` and `independent-mobile-corrected/receipt.json` under the evidence directory. The reviewer inspected the desktop and mobile geometry, selection, and DejaVu fallback screenshots; no additional defect was found in those views.

The final driver also records a separate sample-controls screenshot so mobile slider, buttons and cusp values can be reviewed below the diagram, and captures the initial viewport at actual scroll position zero.

## Held candidate

The first held candidate passed **1,940 browser checks**, retaining **72 real downloads** and **20 screenshots** at 320, 390, 1440 and 1920 CSS pixels. All 497 product files and both drivers were unchanged throughout, with product SHA256 `5c1b707cbc34e16c1ffddca8070d0f0d5af5acc5297f23ae151a33e7741f6af8`. Its evidence is preserved as `docs/evidence/country-history/round3-first/`; it is not overwritten by the corrected candidate below.

All twenty screenshots were inspected. This revealed a cosmetic problem outside the initial automated assertions: two-digit house-reference ordinals such as `01` wrapped vertically in the narrow number column. Root confirmed it and the interface owner widened that column and prevented number wrapping. The scientific calculation files did not change. The final driver adds direct text-line-box and non-overlap assertions for all twelve ordinals under both the normal and DejaVu font families, plus dedicated house-reference screenshots at every viewport width. No numerical or layout threshold was loosened.

The independent semantic suite passed **187 checks** on the first held candidate. Its actual receipt pins the independent driver, core, adapter and toolkit hashes in `round3-first/semantic-receipt.json`. The later ordinal correction touches only CSS, while those scientific and protocol modules remain unchanged.

**Revised held candidate: ACCEPT for the historical-study software scope.** The final run passed **1,948 browser assertions**, retained **72 actual JSON/CSV downloads** and **28 screenshots**, with zero page errors, console errors, missing local responses, failed requests or implicit external requests. The receipt has `pass: true` and `acceptanceEligible: true`; no edits were permitted during the run.

The held snapshot contains **497 product files**. Its start and end SHA256 are identical: `b470d90f41223e142dd5f46de5e5ce192a39473367882e13cc441031a788f46f`. The unchanged driver hashes are:

| Driver | SHA256 |
|---|---|
| `scripts/browser-country-history.mjs` | `252776259046f1b93c693f85575e73ee3677c9976c82ea943db2a96f5716128a` |
| `scripts/tests/country-history-independent.mjs` | `abd92b780c3863250aa669ce87b30d756a3604ead7a2b7ce5727ce8ce96cd2c6` |

The environment was Linux x64, Node 24.19.0 / ICU 78.3, Playwright 1.58.2 and Chromium 145.0.7632.6. Actual platform font capture reported Liberation Serif and Noto Sans for the ordinary presentation, and DejaVu Serif / DejaVu Sans for the explicit fallback pass. All four widths passed document-fit and control-containment checks, named table `ArrowRight` access, native slider Home/End/ArrowRight, selection errors, input invalidation, and recovery after an interrupted animation-frame handoff. All sixteen records were exercised in valid batches; selecting all sixteen produces an explicit over-limit error rather than truncated output.

The browser tested actual export bytes against the canonical browser result and serializer, then independently parsed every CSV. All retained record metadata, unknown clocks, source IDs/full metadata, civil references, calendar validation qualifiers, sample counts and full-precision cusps matched the JSON. The three pre-1900 US records retained their original dates and unavailable reasons with no replacement instant or sample. A separate reread decompressed all 72 saved files and verified every raw and compressed byte count and SHA256: **97,227,220 raw bytes**, retained as **2,857,264 gzip bytes**, with zero mismatches.

The screenshot review accounts for all 28 final images. Eighteen are byte-identical to the already inspected first held run; the eight new house-reference views and two changed unavailable views were inspected directly. The corrected ordinals are single-line under both font families at every width, with no description overlap. The geometry and its explicit assumption label, unavailable states, mobile controls, source qualifications and responsive text remained legible. No unresolved visual or functional blocker remains within this review scope.

Evidence is in [the final receipt](evidence/country-history/round3/receipt.json), [independent download and screenshot reinspection](evidence/country-history/round3/independent-reinspection.json), the `source-before.json` / `source-after.json` maps, and gzip files under `round3/downloads/`. The immutable captured browser driver is `round3/driver.mjs`. The earlier failed diagnostics and first held candidate remain available separately.

Reproduction from the repository root:

```bash
node scripts/tests/country-history-independent.mjs
PLAYWRIGHT_PKG=/tmp/atlas-ci-playwright/node_modules/playwright/index.mjs \
PLAYWRIGHT_BROWSERS_PATH=/tmp/atlas-ci-browsers \
COUNTRY_HISTORY_ROUND=round3-corrected \
COUNTRY_OUTPUT=docs/evidence/country-history/round3 \
node scripts/browser-country-history.mjs
```

Use a fresh output directory when reproducing so the accepted receipts remain unchanged. Do not set `COUNTRY_HISTORY_ALLOW_EDITS` for an acceptance run. Repository-wide gates, remote CI, hosted MCP availability and published release identity remain separate evidence; this report does not claim production publication.

## Root integration gates before publication

Executed logs in `docs/evidence/country-history/release/` record the full engine suite723checks passed, audit131HTML/305JS with0problems, and real Chromium sweep131pages with0errors. The sweep retains two inherited UI3 descriptor warnings. It began before the final CSS ordinal correction; the final country-specific acceptance binds the corrected product. All eight generator freshness gates passed. R37 telemetry derives those actual stdout counts; ledgerC1/C2pass andC3remains not evaluable, rather than assumed passing.

The actual SDK HTTP handler and spawned stdio country protocol passed46checks. Existing MCP toolkit and SDK protocol suites passed. Root independently compared all497current product files and both independent drivers against the final receipt, expanded/rehashed all72actual downloads and inspected selected screenshots; see `release/root-acceptance.json`. All four horizon data parts are byte-identical to published e049fc9, verified in `release/horizon-data-parity.json`; only catalogue/source bindings changed.

These are pre-publication receipts. The release additionally requires exact-head pull-request CI, production verification/stress/deployment, and live release/source identity. The static frontend does not deploy an authenticated MCP backend.
