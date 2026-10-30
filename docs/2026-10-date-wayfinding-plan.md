# Date wayfinding and saved study markers

Baseline: `fdc184df829fda685a23d69962d121328b68537e`. Branch: `feat/date-wayfinding`.

The user wants recognizable dates, color distinctions, hover details with bookmarks, a slider for each chart/calendar view, and matching country-specific interactions. This change extends the existing source-led instruments in native JavaScript. It preserves numerical engines, source dates, deep links, held exports, and the separate private birth workflow.

## Interaction contract

- Shared date navigators expose every retained item through a native range and a bounded list. Previous/next and keyboard navigation supplement dragging. Color has a named text category and a redundant symbol.
- Detail cards open on hover, focus or tap. They retain date precision, method, measured context and source. A card remains usable when the pointer moves into it; Escape dismisses it. Interactive bookmark actions are not hidden inside an inaccessible tooltip.
- Bookmarking is an explicit local action. A dedicated, bounded storage namespace holds only public date/reference identifiers and category, with no birth data, notes, coordinates or provider credentials. Failure to persist is visible. Restoring a bookmark requires an explicit action and cannot silently restore an unrelated observer or calculation.
- Calendar and chart controls are synchronized to the same selected instant. Compact controls and progressive disclosure keep the comparison usable when many calendars are selected. Unknown clocks, missing dates, stale controls, cancellation and unsupported ranges remain visible.
- Per-country views preserve the distinction between documented source dates and modern study observers. Historical conflict markers describe recorded past events. A selected capital/zone is an observer convention, not a national birth chart or a prediction about that country.

## Semantic colors

Traditional favorable, traditional caution, mixed rules, calculated astronomy, published observance, historical conflict, historical peaceful event, source claim, neutral and unavailable are distinct categories. Labels come from the held canonical record. A calendar conversion, signed editorial profile index, source wording or an uncalculated day does not acquire an invented favorable/caution classification.

These are study aids. Traditional readings do not establish physical danger, safety, protective efficacy, future attacks or a probability of an event. Source claims and Newton's conditional year arguments retain their own qualifications.

## Owned surfaces

| Owner | Surface |
| --- | --- |
| Shared component role | Native date navigator, detail card, semantic colors, bounded local bookmarks |
| Source-page role | Eschatology source axis and study chart; Newton year, chart and selected calendar rings |
| Country role | Founding/status references, seven-country historical research views, explicit observer links |
| Chart role | Chart & Calendar Timeline, Calendar Atlas and shared family routes, sampled sky timeline |
| Horizon/search role | Held horizon dates/profile/calendar tracks, retained search results, explicit country study observer |
| Independent verification role | Interaction, source precision, privacy, keyboard, viewport and regression evidence |

Root integrates shared assets, documentation, required gates and release. These are six AI-agent roles, not human expert endorsements or observed user research.

## Review rounds and acceptance

1. Inspect baseline tasks and source/worker contracts; implement the coordinated component and page integrations.
2. Exercise the changed flows, challenge ambiguity, focus, touch, state preservation and dense comparisons; implement confirmed corrections.
3. Hold the corrected files, run the required repository checks and changed browser journeys, inspect actual images and downloads, then verify exact candidate CI, deployment and live behavior.

The verification record must distinguish development runs from a held candidate, failed checks from their corrections, local checks from deployment, and actual assistive-technology coverage from DOM/keyboard checks. Preserve the inherited CI gates. Publication remains authorized by the user's existing instructions.
