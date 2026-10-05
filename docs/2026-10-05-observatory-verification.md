# Observatory sessions — verification and release handoff

Date:2026-10-05. This is the connected-session follow-up to the Studio/MCP release. Workbench is `occult-kranti/astrology-sim-ant`; SkyLens is the separate `occult-kranti/skylens`. Both remain on GitHub Pages. The existing private MCP backend is unchanged.

## Implemented flow

The existing Studio route now supports Observe → Cast → Compare → Symbol → Journal. SkyLens hands over an explicit frozen instant/location/selected-object/name-display packet through a bounded fragment. Return navigation retains Hindi preferences without starting camera, motion, geolocation or feeds. Unknown objects remain observational context; stars/constellations are never silently assigned a classical planet.

Four sourced lenses connect Lilly’s chart reasoning, Agrippa’s planetary-square traditions, distinct Hermetic texts, and Newton’s observation/analysis method to existing tools. Comparison uses the same instant and observer for tropical/selected houses and the existing approximate Lahiri sidereal/whole-sign method. A question chart remains frozen. Source editions and calculation conventions remain explicit.

Journal snapshots retain validated inputs, observation provenance, source/method references, notes, measurement descriptions and the visible symbol trace frame. Entries are immutable; restoration and saving create separate studies. Up to20 are kept locally; exports require an explicit action. Numeric discrepancies are observed minus expected, with no circular-angle or uncertainty propagation implied.

The AI panel loads on request, previews the exact provider body without its authorization key, and sends only after Send. Location-dependent results, exact coordinates, notes, question/title and entered symbolic text each require their own inclusion choice. Keys stay in memory; no automatic tool use or prior assistant history is included. Context/disclosure/provider changes cancel stale work. Copy/export works without an account. The optional MCP connection is a separate, authenticated calculation service.

## Executed verification

- Root engine aggregator passes, including8 native journal groups and10 packet/controller groups alongside the existing independent astronomy/calendar fixtures and graph gates.
- Root static audit:118HTML and249JS, zero link/import problems. Ledger C1/C2 pass; C3 remains not evaluable from available historical evidence.
- SkyLens existing npm suite and7 new handoff groups pass. Six shared fixtures round-trip at both fixed destinations; adapter source is byte-identical across repositories. Cases cover DST folds, the date line, Serpens parts, Hindi, invalid dates/duplicates/fields and object-identity fallback.
- Five new browser groups pass at320,390 and1280px: actual SkyLens↔Studio navigation, frozen epoch, tropical/sidereal comparison, AIQ symbols, partial-frame save/restore/export, malformed hash/history recovery, question/live separation, unknown-star behavior, Apia unknown civil zone and explicit/custom offset replacement.
- AI browser fixtures pass exact preview/body equality, no network before Send, default data exclusion, explicit opt-ins, safe text rendering, memory-only key, cancellation/late-response rejection and401/429/offline recovery. Six provider requests were mocked; no real account or paid API was used.
- Nineteen screenshots plus viewport crops were reviewed in one batch and a capture-framing confirmation. No remaining material layout finding;320px symbol grid and mobile request JSON remain readable without page overflow. These are browser checks, not human usability research or native screen-reader testing.
- Root’s full existing browser release suite also passes:15 focused workflow/viewport groups and118/118 HTML entries in 332,422ms. [Raw release evidence](evidence/observatory-sessions/browser-release.json) records the exact checks; CI repeats them on each release commit. A local source build is never reported as deployed.

Material repairs from the skeptical pass: canonical `aiq` method storage, actual offset-control IDs, hashchange import handling, rate-limit error wording, and partial trace preservation. No tests were weakened to accept overflow or stale results.

## Measured cost

`scripts/measure-static-imports.mjs` measures literal static ESM closures from page script entries, including shared chrome. It excludes HTML bytes, dynamic imports, CSS/fonts, HTTP caching and actual browser timings. Gzip figures sum per-file level9 outputs and are not measured network transfer sizes. Evidence compares Studio/MCP baseline `cae1f4d` with integrated candidate `dfa1030` using the same script.

| Page | Before | After | Change |
|---|---:|---:|---:|
| Studio modules |55|58|+3 |
| Studio static source bytes |1,210,835|1,258,549|+47,714 (3.94%) |
| Studio summed gzip9 bytes |391,918|407,265|+15,347 |
| Workbench modules |58|58|0 |
| Workbench static source bytes |1,318,232|1,319,189|+957 |
| Workbench summed gzip9 bytes |424,514|424,733|+219 |

The session AI panel remains a dynamic import. There is no claimed FCP, phone FPS or CPU speedup. The earlier optional-assistant dependency reduction is documented separately with its own measured snapshots and conditions.

## Publication and remaining checks

Workbench CI pins SkyLens source `2b2aa089009db3ddedc2256a7a5456b402b23962` outside the Pages artifact, verifies adapter parity and runs the cross-app journeys. Release the receiving Studio first, then merge [SkyLens PR10](https://github.com/occult-kranti/skylens/pull/10). Both workflows verify their exact published SHA in `release.json`; Workbench also checks the session journal and MCP setup/catalogue.

- Studio: https://occult-kranti.github.io/astrology-sim-ant/pages/studio.html
- MCP setup: https://occult-kranti.github.io/astrology-sim-ant/pages/mcp.html
- Live sky: https://occult-kranti.github.io/skylens/
- Private MCP: https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp

Actual phone alignment/camera behavior, native screen readers, a real provider-key request and actual private-MCP OAuth client invocation remain distinct checks. No mandatory new account is required for local calculation, journaling, source study or exports. See README’s human-action list. Advanced election planning, broader source retrieval and encrypted cloud synchronization remain explicit later work; no universal coverage or traditional efficacy is claimed.
