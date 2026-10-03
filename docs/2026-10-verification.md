# Verification, release notes and handoff — 2026-10-03

## Repository and scope

`occult-kranti/astrology-sim-ant` is the historical Astrologer's Workbench. It is distinct from Skylens in `occult-kranti/skylens`. Upstream baseline is `3a3ce9953e47a078e659723a52187648f1f08486`; the exact 520-file connector recovery was hash-checked. Local snapshot commit `5752eeb` is not remote ancestry; root must create remote commits preserving upstream parent. The roadmap was committed before implementation (`fa27bcb`). No previous implementation/deployment claim was treated as evidence.

Implemented entry points:

- `pages/book3/nativity.html`: known/unknown birth time, shared named-zone DST resolver, explicit wheel orb settings, method/uncertainty text and polar house warnings. Existing SVG/table/historical readings preserved for supported timed input.
- Every existing `mountMomentPicker` host receives strict civil dates and optional IANA zone/fold selection. Explicit offsets remain available. “Now” and geolocation clock fields use the matching device offset.
- `pages/calendars.html`: Gregorian/Julian/JD conversion; six explicit native civil calendars; Gregorian/Julian Easter; seven prayer methods with Asr, high-latitude and Isha choices; true-north Qibla. Accessible labels, live errors, location fallback and non-authoritative method descriptions.
- Shared chart fixes: Placidus semi-arc mathematics, normalized rounded longitude labels, actual solar-altitude sect, polar singularity rejection and visible fallback. Sunrise-based planetary weekday/Panchang removes UTC-day errors.
- Cast menu and Tools hub link the new page and Skylens. The static search index now covers 116 pages. The service worker version changes and includes its new time-module dependency.

## Checks actually run locally

Environment: managed Linux x86_64, Node v24.19.0, 2026-10-03 UTC. No dependency installation/build required for runtime.

| Check | Result |
|---|---|
| Baseline `node scripts/engine-test.mjs` | All passed before edits |
| Baseline `node scripts/audit.mjs` | 115 HTML, 215 JS, zero problems |
| Final `node scripts/engine-test.mjs` | All existing checks plus both new modules passed; generator/artery gates passed |
| `node scripts/tests/2026-10-calculations.mjs` | 15 groups passed, including 72 independent Swiss house cusps, Astrodienst positions, DST, strict dates, unknown time, wrap, orb and polar/sunrise boundaries |
| `node scripts/tests/cultural-calendars.mjs` | 58 checks passed; repeated independently under UTC and Pacific/Honolulu host settings, plus UTC/Honolulu/Apia invariance comparison |
| Independent skeptical calculation review | Four material findings fixed and rechecked; defining Placidus semi-arc residual ≤5.984×10⁻¹⁰° across sampled hemispheres and ±66° |
| `node scripts/audit.mjs` | 116 HTML, 238 JS, zero problems |
| `node scripts/build-search-index.mjs` | 116 pages, 253,538 raw bytes; generated file refreshed |
| `node --check` changed page/core controllers; `git diff --check` | Passed |
| Local HTTP server / Chromium launch | **Blocked**: socket/server EPERM and Chromium crashpad socket restrictions; no completed local browser or screenshot claim |
| `scripts/browser-release.mjs` | Real desktop/mobile journeys authored by release agent; execution belongs to mandatory GitHub Actions gate |

The independent methods/fixtures are documented in `2026-10-calculation-methods.md` and `2026-10-calendar-methods.md`. Original broad self-tests are preserved but are not treated as universal scientific validation.

## Measured performance and payload costs

`node scripts/benchmark-calculations.mjs /absolute/repository/path`: same Linux/Node process type, fixed London 2026-01-01 09:00UTC input, 20 warmups, five rounds of 200 calls; median per call. Baseline is `/tmp/astrology-baseline` exact upstream worktree. These are noisy server microbenchmarks, not phone responsiveness, network load, or browser rendering measurements.

| Calculation | Baseline median | First correctness implementation | After removing duplicate sunrise searches |
|---|---:|---:|---:|
| `castChart` | 0.3197 ms | 0.3455 ms | 0.3336 ms |
| `castVedic` on fixed chart | 0.2473 ms | 0.5777 ms | 0.2540 ms |

The final correctness checks add a small measured cost (~0.014 ms chart, ~0.007 ms Vedic); there is **no claimed speedup against the original application**. Reusing one sunrise interval avoids repeating three ephemeris searches inside the new compound reading. Values may vary substantially across hosts/runs; no mobile frame-rate or memory result was measured.

There is no JavaScript bundler. Raw-source costs: shared chrome 34,136→34,029 bytes; new required time module 6,552 bytes; core astro 11,890→14,873 bytes; Vedic 41,268→42,037 bytes; natal HTML 3,394→4,233 bytes; search index 248,619→253,538 bytes. Calendar page adds its core 10,721, controller 9,166, CSS 3,254 and HTML 10,963 bytes, plus 39,579 bytes of Adhan runtime modules. These are raw uncompressed source sizes, not transferred gzip sizes. New prayer modules load only when the calendar page is opened; the existing 412,025-byte astronomy library remains shared. No camera/rendering/network benchmark applies to this calculator repository.

## Release gates and remaining work

Remote push, commit hash, workflow success and live Pages identity are **pending the root release coordinator** when this document was authored. Expected existing site: `https://occult-kranti.github.io/astrology-sim-ant/`. A successful local Node run must not be described as deployed. Existing Pages hosting and relative URLs are preserved; the new workflow gates main-only deployment on Node and strict browser journeys. Update deployment evidence after the actual run and live inspection.

Before release, browser CI must complete at 390px/1365px and the project prefix, including known→unknown→known birth time, gap rejection/fold choice, calendars/prayers, keyboard navigation, no console errors, no missing assets and no unexpected runtime data requests. Inspect uploaded screenshots. User-device camera/orientation tests belong to Skylens; no sensor claim is made here.

Remaining calculation limits: one linear Lahiri option; approximate existing advanced Vedic strength/dasha conventions; native calendar/zone data version dependence; civil-date rather than religious sunset/authority boundaries; retained Ankara timetable provenance limitation; no unvalidated Jain/Sikh/regional-festival numbers. Other exact-time historical tools have not acquired a date-only interpretation. Additional geographic/date reference grids remain valuable. No paid API, secret, telemetry, camera transmission or mandatory remote service was introduced by these calculators.

## First real browser gate and responsive repair

GitHub Actions run `37095210748` for Workbench PR #2 passed the full Node gate and the real mobile known/unknown birth-time and New York DST gap/fold journeys, then correctly failed the 390px no-horizontal-overflow assertion. Artifact `mobile-failure.png` was inspected: page width 408px, with the 22rem UTC-offset selector extending to x408 beyond its nested picker card. The details/flex-row parents retained the selector's intrinsic width, so the existing select-only `max-width:100%` could not constrain it.

The targeted shared CSS repair bounds picker rows/details to the containing width, permits their flex children to shrink, and bounds native form controls. It does not clip page overflow or weaken the test. Post-repair local audit remains 116 HTML/238 JS, zero problems; 15 calculation groups and 58 calendar checks pass. The next real CI run must prove the visual repair and proceed through the remaining browser journeys; this first failed run is not a successful release assertion.

The same real-browser screenshot review found a second integration defect: switching to unknown birth time left the previous exact ascendant/day-birth text in the sticky action bar. Nativity now refreshes that summary to the limited/invalid state and hides the action bar on unknown or invalid input, resetting its internal visibility state as well. Shared CSS explicitly respects HTML `hidden` despite component flex/grid rules; named-zone controls stay hidden in explicit-offset mode, and hidden precise-reading panels remain hidden. The fixed-orb field remains intentionally visible but disabled under the traditional method. The full Node engine gate and audit pass after these fixes. Real-browser regression assertions cover the corrected visibility states.
