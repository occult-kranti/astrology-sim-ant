# Chart console and offline verification

The accepted local candidate passes 735 engine assertions, 69 inherited birth
reading browser checks, 80 new console/offline checks and 192 inherited neon
chart/export checks. The full browser sweep loads 135 HTML documents with zero
errors; its two inherited descriptor warnings remain warnings. The static audit
reports zero problems. All nine inherited generators and the new offline
inventory freshness check pass. The round ledger is current: C1/C2 pass and the
inherited C3 remains not evaluable, not a claimed pass.

The new browser gate ran with Chromium 145.0.7632.6 under the GitHub Pages project
path. It checks three held frames, layer switching, body/house readouts, focus,
zoom/orientation/reset, actual SVG/PNG/HTML/JSON downloads, canonical report
invariance, stale input clearing and cancellation of a pending private PNG.
Keyboard, 320/390/1440px reflow, 200% CSS zoom and reduced motion are exercised.
Eight actual screenshots and the native PNG were independently reviewed. For
tall element captures only, external sticky navigation is temporarily hidden to
avoid screenshot compositing across the chart; viewport captures retain chrome.

The offline journey uses an actual HTTPS origin on literal loopback 127.0.0.2,
with service workers enabled. It reloads during preparation, cancels, checks that
the partial pack is absent, retries and verifies all 526 manifest resources.
The pack contains 134 application HTML files and 52,900,737 uncompressed bytes.
With networking disabled, it opens a previously unvisited page and compares the
actual served bytes, runs the birth worker and obtains byte-identical canonical
JSON, then reloads and recalculates. Query strings are not persisted. Removal
preserves an unrelated project cache. Zero unexpected runtime, missing-resource
or external-request errors occurred.

The portable ZIP was independently inspected: 529 regular files, 7,447,204 bytes,
with exact inventory membership, file hashes, CRC, public scope and launch
instructions checked. It has no symlinks, private birth profile, backend code,
research downloads or copied third-party LCARS template. The generator accepts
only tracked/staged public files and rejects symlinks. The packer independently
checks bounded canonical paths, schema, unique entries, sizes and manifest hash.

Earlier diagnostic evidence is retained outside the repository. Corrections
covered a duplicate reset identifier, ambiguous test hooks and the stale PNG
callback. Two later harness corrections replaced a guessed HTML count with exact
catalogue equality and removed sticky-chrome screenshot compositing. These
failed diagnostic receipts are not counted as acceptance. A minor status-copy
observation remains: clearing a focused pair updates the actual chart, list and
control state, but the prior status announcement can remain visible.

These are automated browser and independent model-agent reviews, not a physical
device, screen-reader or human usability study. The calculations do not establish
predictive validity. CI preserves every inherited gate, adds the 80-check journey
and manifest check, then generates the verified ZIP for the Pages artifact.
Production publication must also pass all workflow jobs and match `release.json`.

The first production candidate stopped at the offline test: CI's default headless
shell did not grant service-worker support to the simulated HTTP origin despite
the secure-origin flag that worked in the local full-Chromium diagnostic. No
production deployment occurred. The test now uses HTTPS with an ephemeral local
certificate and pins only that certificate's SPKI. The explicit secure-context
and service-worker assertion runs before the offline journey. The gate was moved
earlier in the same verification job for faster failure feedback; all inherited
gates remain. The job budget is 40 minutes because the prior successful inherited
run took 27m53s before this extra journey was added.

The corrected local gate passed all 80 checks with Playwright's default
headless_shell 145.0.7632.6, matching the CI launcher, without a global proxy
bypass. It asserted `https:`, a secure context, service-worker support and an
active scoped controller before exercising the complete offline flow. The
ephemeral certificate files were removed. A hostname-based HTTPS diagnostic
encountered proxy routing; the literal loopback fixture avoids that route and
continues to exercise the production caching branch. Public application and
offline-package bytes did not change in this test correction.
