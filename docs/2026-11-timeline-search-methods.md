# Timeline date search, bookmarks and map comparison

Updated 6 November 2026. The synchronized calendar timeline now searches its applied date range instead of only calculating the selected frame. The search is an exhaustive **sampled grid**, not continuous-time event detection: one explicit local clock is resolved for each civil date. Selecting a result still opens the existing full calendar and chart frame.

## What is searched

The browser supports up to 3,660 inclusive civil dates within 1900–2100, thirteen named calendar conversions, up to eight conditions from the existing calendar/lunar/weekday/traditional-rule catalogue, and an optional map-distance condition. Calendar conditions can use supported day, month, year and era fields; lunar conditions reuse the canonical tithi, half-tithi, nakshatra, yoga and broad phase partitions. Historical classifications retain the existing named Western/Lilly and Jyotisha rule sources. Civil date labels, religious observances, astronomical events and philosophical readings are different outputs. This is not an implementation of every religion or every calendar variant.

The thirteen conversions are Gregorian, Julian, Hebrew civil, Islamic tabular, Umm al-Qura, Chinese lunisolar, Thai Buddhist civil, Indian national Saka, Persian, Coptic, Ethiopic, Japanese and ROC. Runtime-dependent values retain their existing fixture qualifications. Hebrew and Islamic civil conversion does not infer local sunset observance or a religious authority's decision. Chinese leap-month identity and text fields remain intact. Missing or unsupported fields are unavailable, not a nonmatching zero.

The inherited `normalizeCalendarTimelineRequest` and clock grid resolve zones and daylight-saving folds/gaps. The search wrapper requires an explicit repeated-clock policy. An unavailable date remains a row with its candidates/reason; it never acquires a fabricated noon. The rule sample reuses `compareMoment` and, only when required, the existing day-guidance engine. Optimized mode avoids unused guidance and caches fixed-map geometry. Brute mode deliberately recomputes that work; complete-result equivalence is tested separately from timing. Neither mode stops after enough matches have been found.

## A fixed map and a moving sky

Map mode is explicit:

- **None:** calendar and rule conditions only.
- **Transit/event:** recalculate planetary directions at every sampled instant.
- **Fixed reference:** use one supplied exact UTC instant. Angular geometry and location distances stay constant across the search window. This does not invent or infer a birth record.

When active, every available sample retains all forty Sun–Pluto ASC/DSC/MC/IC distances at the **single explicitly selected observer location**. Body/angle filters, radius and minimum nearby-line count define the map matching condition; they do not remove the other measured distances from the ledger. This is not an exhaustive search of every location on Earth. The global map is available for an explicitly selected sample.

The canonical astrocartography half-arc geometry is reused with display-segment generation disabled during scans. No alternative ephemeris or copied map formula is introduced. The underlying apparent equatorial-of-date convention, matching sidereal time, Moon vector shortcut, spherical radius and polar/grazing limits remain those in [astrocartography methods](2026-11-astrocartography-methods.md). A distance to an endpoint can represent a polar or grazing boundary, not an ordinary angular event. Several nearby lines are not proof of an exact geographic intersection or a paran. The scanner explicitly reports that it does not solve pair intersections; the full map separately computes its declared angular crossings.

A daily sample can miss a line passing nearby for minutes, or alias a recurring alignment at the same clock. Neither a zero count nor a complete daily scan establishes that no event happened between samples. Distances and coincidences are not measures of danger, safety, success or a physical influence.

## Matching, statistical scope and skeptical reading

All selected conditions are conjunctive; the map requirement is additional when enabled. `fullyObserved` describes the selected conditions and map, not a guarantee that every displayed calendar is supported. Full counts and per-calendar availability remain visible. Display filters, pagination and a chosen date do not change the scan denominator.

Each selected condition contributes a binary hit series. Active map mode contributes two continuous series: the number of selected lines within the declared radius and the closest selected-line distance. Thus the predeclared statistical family has at most ten series and forty-five pairs; raw forty-line tables remain inspectable without silently expanding the hypothesis family.

Read [the statistical methods](2026-11-timeline-search-statistics.md) for exact equations and sources. Finite-grid exceedance fractions describe this completed grid, not an event probability. Spearman/phi/Jaccard calculations are descriptive. The circular-phase audit is available only for complete, equally spaced UTC series; local civil grids crossing daylight-saving changes can therefore retain descriptions while the phase reference is unavailable. The fixed 1,023-rotation budget, or all nonidentity rotations for a smaller grid, has a stated resolution. Holm adjustment includes every predeclared pair slot, including unavailable pairs at a conservative reference value of one. No result-driven increase in resampling or filtering of the correction family occurs.

The phase null deliberately disrupts relative alignment while retaining within-series order. Periodicity, stationarity and the appropriateness of a circular boundary are substantive assumptions, not established facts about calendars. Shared astronomical mechanisms can produce strong correlations without independent evidence. This exploratory sensitivity analysis has no outcome-labelled data, calibrated disaster probability, causal attribution or validated forecast. Source-based readings and the inspector explain these limits beside the numerical values.

## Timeline, bookmarks and transfer

A shared density rail and candidate table use the applied grid. Selecting a date updates the existing canonical timeline cursor; hover/focus previews do not change it. All prior per-calendar navigators remain available in named disclosures. Editing settings invalidates held results, exports and outstanding transfers; cancelling a worker never exposes an incomplete ledger as a completed search.

Search bookmarks are session-only records with the held request/context. Recomputing a different search cannot silently attach an old rank or probability to a date. Explicit JSON/CSV downloads carry the applied conditions, all sampled rows, sources, missingness and statistical assumptions. Existing persistent public date-reference bookmarks keep their narrow scope/id/date/kind format; private observer or reference-map inputs are not automatically added to that store.

“Map this sample” opens the existing Astrocartography page through an explicit one-shot transfer. A cryptographically random channel identifier is the only added URL fragment. Inputs travel in same-origin `BroadcastChannel` memory, expire after sixty seconds, and are never stored or sent to a model. The receiving map previews the exact moment, place and options, and requires **Calculate transferred map** before replacing the displayed map. A fixed reference remains fixed. Fractional-second instants that the map profile cannot represent are rejected for transfer rather than silently rounded; the scan itself retains its exact supported instant. A blocked popup or unsupported channel produces an explicit status without changing the current calculation.

## Resource bounds and reproducibility

Criteria definitions occur once in the request; rows reference stable criterion IDs. The request is bounded to 32 KiB, criteria definitions to 16 KiB and the complete compact JSON ledger to 64 MiB. Oversized output fails explicitly rather than returning a truncated success. Rendering uses selected rows and bounded lists; the worker keeps the full available ledger. Native calendar formatter/zone configuration now uses bounded 128-entry caches, reset when the Intl factory changes. No date, birth profile or calculated result is cached there. Fresh-Intl parity, range boundaries and eviction are tested.

A maximum 3,660-day/ten-series run and a separate fixed three-year public Greenwich illustration have reproducible drivers/receipts. [The illustration driver](../scripts/run-timeline-search-study.mjs) freezes arbitrary conditions before reading its results, compares complete optimized and brute ledgers, and saves the full ledger outside Git. These are implementation/performance studies, not empirical astrology validation. Runtime, ICU/time-zone data and source hashes qualify the calculations. The final verification report records measured resource use rather than promising identical performance on every phone.

Two read-only MCP adapters expose bounded summaries and one-date calculations. Browser scan scope is 3,660 days; MCP whole-scan scope is 366 days with a 128 KiB output bound. The summary explicitly limits displayed matches to twelve while retaining complete denominators and statistics. The selected-date tool calculates one index without scanning its predecessors. Local source availability does not establish deployment to the previously hosted MCP service.
