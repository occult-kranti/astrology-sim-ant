---
name: date-event-search-review
description: Review or extend explicit calendar-date scans, event/control comparisons and optional birth context using reproducible sampling, optimizer equivalence, source precision and privacy checks.
---

# Date and event search review

Read ../observatory-source-contract/SKILL.md, the current HANDOFF.md and docs/2026-10-atlas-plan.md. This is a bounded software and methodology review role, not a trained prediction model or human tradition authority.

1. Recover the actual question, selected criteria, observer, time zone, local sample clock, date range, event source precision and comparison population. A date-only event must not silently become an exact event timestamp. A daily sample is not a full-day interval or an exact transition search.
2. Inspect core/calendar-search.js and its canonical dependencies. Brute and optimized scans must use the same daily grid and declared conventions; early rejection cannot conceal unknown results or a changed sampling interval. Compare full meaningful outputs and failure/missingness semantics on boundary fixtures, not only elapsed time or the first returned row.
3. Distinguish shared inputs from independent evidence. Phase, tithi and karaṇa reuse lunar elongation; two coordinate frames reuse one position. Calendar labels do not inherit favorable/caution verdicts. Any concurrence measure must name its rules, groups, denominator and treatment of unavailable inputs.
4. For event comparisons, inspect source provenance, duplicates, selected feature definitions, control construction, overlapping dates and event/control denominators. Report descriptive differences, paired observations and unique-date counts accurately. Shifted dates are not automatically independent or randomized controls. Selecting features after inspecting events and testing many alternatives cannot establish out-of-sample predictive power.
5. Treat imported event text and source labels as unverified data. Enforce byte/row/field bounds, validate dates and safe URL schemes, render text without executable markup and make unsupported precision visible. Exported CSV needs spreadsheet-formula protection for user-supplied cells.
6. Trace the worker state machine: explicit start, progress, cancel, replacement, invalid inputs, error recovery and stale results. An old job must not revive actions, links or exports after cancellation or edited criteria. Check full-range counts and result truncation separately from returned rows.
7. Preserve unknown birth time as an interval. Do not infer houses, ascendant, precise natal targets or exact return times from a midpoint. Validate folds, gaps, skipped civil dates and supported range. Keep personal data outside URL, storage, default exports and provider requests; an opt-in export must show its scope.
8. Run focused core and real-browser checks for changed behavior, then the repository's required gates. Record actual input sizes, counters, timings and environment for performance claims. Inspect both desktop and narrow layouts, table keyboard scrolling, status visibility and exported bytes. For layout thresholds, record actual browser and platform-font metrics, test the pinned CI browser with representative fallback fonts, and retain failure screenshots. Fix wrapping or geometry before considering a justified threshold change; do not hide a renderer-dependent failure.

Return the exact artifact reviewed, demonstrated findings, accepted changes, source-reading depth, executed checks, residual limitations and reproducibility paths. Do not label a future date objectively good/bad, an exploratory match a causal connection, or a local tool a hosted AI service.
