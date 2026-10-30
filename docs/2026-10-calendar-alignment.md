# Calendar overlays, clock alignment and manual calendar export

This component compares named calculations at an explicit instant. It separates three questions: whether the inputs represent the same UTC instant, whether the displayed civil clocks match, and whether the geographic coordinates actually belong to the chosen time zone. The first two are calculated; the third is **not verified**, because the project does not contain a geographic time-zone polygon database.

Baseline: `fb656a8047e93b8d49227d92aa9edc3e9b1fce50`. Implementation: `assets/js/core/calendar-alignment.js`. Focused tests: `scripts/tests/calendar-alignment.mjs`. This is the calendar-comparison role of the new six-agent sky-explorer panel; it is an AI technical review, not human cultural-authority certification.

## Actual source work

Read the project’s source contract, `accuracy-check` skill, current atlas/observatory/comparison-evidence engines and existing exact-time resolver. All astronomical, calendar, house and solar-term calculations reuse these canonical modules. No new calendar conversion, religious-day policy or historical prediction rule is introduced here.

| Source | Sections actually read on 30 October 2026 | Consequence |
|---|---|---|
| [TC39, Time Zones and Resolving Ambiguity](https://tc39.es/proposal-temporal/docs/timezone.html) | Clock time versus exact time; time-zone offset functions; ambiguity/disambiguation examples | Same-instant conversion and same-wall-clock casting are separate operations. Gaps remain unresolved; repeated times require explicit earlier/later selection. Temporal is a reference, not a newly installed runtime dependency. |
| [Unicode ICU Calendar guide](https://unicode-org.github.io/icu/userguide/datetime/calendar/) | Representation and Conversion; Ambiguous Wall Clock Time Resolution | UTC time values are independent of calendar/time zone; display fields are convention-dependent. The project does **not** copy ICU Calendar’s default gap-shifting policy. The guide’s simplified transition-clock examples are not used as numerical fixtures. |
| [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) | §§3.1, 3.3.5, 3.3.11, 3.6.1, 3.8.4.7, 3.8.7.2 | UTC `DATE-TIME`, CRLF, UTF-8-aware line folding, TEXT escaping, component identity and explicit `DTSTAMP`. A `DATE-TIME` event without `DTEND`/`DURATION` ends at its start; an equal `DTEND` is not emitted. |

The old TC39 `docs/ambiguity.html` address returned HTTP 404; its current `docs/timezone.html` successor was retrieved and inspected. Source bodies remain outside the repository; source metadata and SHA-256 hashes are carried in the module. No complete book reading, new historical-source validation or independent full-range astronomical certification is claimed. Book interpretation work belongs to the source/interpretation panel member and retains its own ledger.

## Drawing contract

`buildCalendarAlignment(input, options)` accepts the canonical explicit `dateISO`, `lat`, `lon`, IANA `timeZone`, and optional house/prayer settings. Family and variant filters use the atlas’s nonempty, unique intersection contract. Caller-supplied rows or private notes cannot replace calculations; birth/saved-personal-context keys are rejected. The public result omits the atlas’s internal full comparison.

Every sector `startDegrees`/`endDegrees` and marker `longitudeDegrees` is **already expressed in physical tropical ecliptic plotting coordinates**. `zeroTropicalDegrees` documents a native frame’s origin; the renderer must not add it again. `coordinateLongitudeDegrees` is a native-frame numerical label. Ring radii are layout spacing, not orbital distances.

- A tropical zodiac ring has twelve equal 30° sectors. These are signs, not the unequal IAU constellation regions.
- The approximate Lahiri sidereal zodiac uses the full-precision canonical epoch-dependent offset. Physical planetary markers stay in the same place; coordinate labels and sector origins differ.
- Twenty-seven nakṣatra sectors use the existing equal-arc convention. They are not a measured fixed-star catalogue or a regional festival calendar.
- Twenty-four solar-term marks reuse the canonical computed annual solar events. The marks are the Sun’s target longitudes, not twenty-four simultaneously visible bodies.
- Selected house systems expose their actual calculated cusp sectors. A polar fallback is labelled partial and names the returned system.
- Civil-calendar dates, computus, temporal hours, prayer timetables and unavailable methods remain a labelled legend. Their text is not given invented zodiac coordinates. A civil-only selection has no angular rings.

Each ring, legend row and selected-method comparison retains source IDs and limitations. Output equality is equality of that named method’s calculated fields. It is not agreement about meaning, an independent corroboration count or an outcome forecast. Unavailable rows are never treated as equal successful predictions.

## Synchronization contract

Options are `comparisonTimeZone`, `clockMode: 'same-instant' | 'same-local-clock'`, and `disambiguation: 'reject' | 'earlier' | 'later'`. Defaults are the current observer zone, same instant and reject.

**Same instant** preserves UTC and changes only the clock/calendar context. A different zone may display a different civil date while geocentric positions and observer-dependent houses at the unchanged coordinates remain identical. Temporal-hour/day conventions can depend on the supplied civil zone; an arbitrary zone/coordinate pairing is not asserted to be geographically appropriate.

**Same local clock** copies the base local date, hours, minutes, seconds and milliseconds into the alternative zone. This usually creates a different UTC instant and therefore a different chart. The result reports the exact elapsed seconds. Repeated clocks show both candidates and remain unresolved until chosen; gaps and entirely skipped dates are not shifted automatically. A supported base remains available if the alternative context falls outside 1900–2100.

`synchronization.status` is `aligned`, `different-instant` or `unresolved`; individual `sameInstant`, `sameLocalClock`, `sameZone`, offsets and timestamps stay visible. Coordinates remain fixed during this clock-context comparison; changing the comparison zone is not a relocation to another city. Historical offsets can include seconds; future clock rules follow the installed runtime’s IANA/ICU data and may later change.

`providerSync: 'not-connected'` is separate from numerical alignment. No Google/Outlook account, subscription, remote write, implicit refresh or background synchronization is established by this component.

## iCalendar export and disclosure

`exportCalendarAlignmentICS(input, {familyIds?, variantIds?, generatedAtISO, includeContext?})` returns `{text, filename, disclosure}`. The caller supplies the explicit export/revision instant; the pure helper does not read the current clock. The interface previews the exact text before download.

The event marks one exact study instant in UTC. `DTSTART` is whole-second precision, while the description retains the original ISO instant including milliseconds. There is no invented duration, reminder, recurrence, religious observance or promise of favorable conditions. No `TZID` is attached to a UTC property. Manual file import is not a connected calendar subscription.

By default, the event includes selected method names, UTC and disclosure text, and omits coordinates, zone, civil labels, birth records and notes. An explicit `includeContext: true` includes the supplied observer and selected labelled outputs with their availability and boundaries. The UID includes the complete disclosed identity rather than a short collision-prone hash; a public UID contains no hidden observer context. Exporting from two different disclosed observers cannot silently reuse the same identity.

TEXT backslashes, commas, semicolons and newlines are escaped. Content lines are CRLF-delimited and folded at no more than 75 UTF-8 octets without splitting a code point. Fixed field names and allowlisted options prevent an injected custom title or arbitrary metadata from becoming a new event/property.

## Round 1 verification

`node scripts/tests/calendar-alignment.mjs` passed **66 checks** on the existing Node runtime. They cover selected output isolation; source resolution; physical frame overlays and wrap geometry; canonical event reuse; dateline Gregorian/Hebrew/Chinese differences; same-instant versus same-clock results; Kathmandu’s quarter-hour offset; New York folds and gaps with preserved milliseconds; Lord Howe’s half-hour fold; the skipped Apia date; Paris’s historical 561-second offset; alternative-century boundaries; polar house fallback/unavailable hours; dynamic future ayanāṁśa; malformed/private inputs; default and opt-in export bytes, disclosure, UTF-8 folding, identity changes, positive iCalendar year bounds, and host-zone independence.

An independently installed Python `icalendar==6.3.2` parser also read the actual full-selection public (2,170 bytes) and context-inclusive (6,046 bytes) exports. Each contained one error-free VEVENT with the expected UTC start and stamp, no duration/recurrence, recovered Unicode method names, a maximum physical line length of 75 octets, and the intended observer disclosure. The dependency and full temporary exports stay outside the repository; this is parser interoperability evidence, not a real Google/Outlook import or a provider connection.

These are numerical-contract and export checks. Browser integration, final release tests and actual calendar-provider imports are separate evidence. Independent QA also confirmed the 2024 New York fold’s two fractional-second candidates, elapsed-hour differences, default export omission and maximum line length. Subsequent panel findings will be appended here rather than relabelling this initial artifact as final acceptance.

### Round 1 independent MCP cross-review

[The recorded cross-review](evidence/sky/alignment-r1-crossreview.json) contains 29 passing boundary/parity probes with unchanged source hashes during that run. Alignment MCP output exactly matched the canonical helper for all three New York fold policies, retained fractional seconds, forwarded nondefault prayer/house choices and respected family/variant intersection. All sixteen new registry adapters rejected an undeclared private birth field. The separate existing `tool-guide.mjs` suite passed 21 groups. These are source-level MCP calculations, not a hosted-service or UI test.

Three adapter issues were reported to the AI/MCP owner before final acceptance: the life-trajectory adapter accepted an evaluation before birth and silently clamped age to zero; the positions adapter’s slim result dropped the requested house method/fallback warning at polar Placidus; and the solar-stations adapter converted a polar null into a citation-only object without explicit unavailability or its UTC search-date convention. The receipt preserves the actual observations rather than calling them passing functionality. The owner’s corrections and independent recheck must be recorded separately. No shared adapter or dispatcher file was changed by this reviewer.

## Round 2 corrections and calculator coverage

The AI/MCP owner corrected all three Round 1 findings. Independent follow-up calls verified rejection of a pre-birth trajectory, acceptance of the exact 150-calendar-year endpoint and rejection one millisecond later; preservation of the requested/actual polar house system and canonical warning; and explicit unavailable solar-station status with its UTC-date search convention. A further metadata review identified an explicit ISO offset that was used by the engine but initially absent from the wrapper description; the owner added that suffix-derived offset and its clock convention. These are adapter disclosures and input boundaries, not changes to the inherited astronomical engines.

Eight additional bounded adapters in `mcp/calendar-adapters.mjs` close calculator-level coverage gaps:

| Capability | MCP tool | Exposed calculation and bounds |
|---|---|---|
| KP sublords | `workbench_kp` | Explicit table, sidereal-longitude, horary-number or chart mode; all 249 table entries and approximation flags remain available. |
| Praśna | `workbench_prasna` | Known explicit moment, selected question house, optional KP number/direction and full canonical testimonies. |
| Muhūrta | `workbench_muhurta` | Complete inherited report and optional interval-overlap timeline; unavailable polar intervals remain unavailable. |
| Ṣaṭkarman | `workbench_shatkarman` | Selected historical correspondence/timing record, including conflicting schemes; no operational instructions or efficacy claim. |
| Tājika annual return | `workbench_tajika` | Explicit known birth, target year 1901–2099 after the birth year and within 150 years, optional selected annual observer, full return/aspect/yoga/saham results. |
| Tithi praveśa | `workbench_tithi_pravesha` | Annual solar/soli-lunar return with all candidates and ambiguity, or 1–12 monthly solar returns at the birthplace. |
| Kūṭa tables | `workbench_kuta` | Canonically calculated sidereal Moons from two explicit births, named aṣṭakūṭa/porutham variants and unavailable Sagittarius completion; no relationship advice. |
| Moment comparison | `workbench_moments` | Separate historical columns on an exactly divisible UTC grid, at most 168 hours and 256 samples; no combined score or between-sample extrema claim. |

Schemas reject undeclared fields, private context injection, coercion and unsupported modes. Birth-dependent adapters require explicit known instants and do not read browser birth records. Date/observer inputs are checked against UTC and civil-year limits. Results preserve the canonical methods and inherited citations, while response size and search horizons remain bounded. Some legacy engines use local mean solar conventions even when an IANA zone labels the selected context; annual tithi-return weekday fields use a UTC civil convention. These differences are stated rather than silently relabelled as timezone-aware. Muhūrta’s inherited `civilUTCVara` names are also explicitly qualified because the present canonical values no longer constitute an independent UTC-weekday comparison.

`node scripts/tests/calendar-mcp.mjs` passed **38 groups**, including canonical numerical parity for every adapter, all KP modes, all six historical Ṣaṭkarman records, annual relocation, both annual tithi month rules, monthly returns, kūṭa variants and missing table completion, exact scan endpoints, polar missingness, explicit DST-fold instants, timezone independence and response isolation. These are local adapter checks; the separate dispatcher and transport suites establish integration.

### Round 2 independent product and observatory review

The actual overlay code and saved narrow/wide viewport evidence were reviewed. Four presentation corrections were accepted and implemented by the UI owner: a neutral heading that remains accurate when comparing different instants; an explicit fixed-observer row showing that changing the zone does not relocate coordinates; readable elapsed hours alongside exact seconds; and an ICS checkbox that calls the entered location the “selected observer” rather than assuming it is public. The provider remains explicitly unconnected and export remains a manual file import. This review used source and saved evidence; it did not claim a new browser run.

A separate independent review of `mcp/observatory-adapters.mjs` passed **60 probes** without finding an adapter defect; the [exact rerunnable driver](evidence/sky/alignment-r2/observatory-crossreview.mjs) and [receipt with source hashes before and after](evidence/sky/alignment-r2/observatory-crossreview.json) preserve this review. Every supported displayed field across all thirteen civil calendars matched the canonical result and brute/optimized search behavior. Combined lunar/calendar/rule filters, polar unavailable-rule queries, skipped-date resolution before prefilters, the 31/32-day boundary and the sixteen-criterion aggregate cap were checked. World events retained date-only precision and explicit source freshness, including an assessment clock before the source review. All three sigil modes omitted sentinel text, exact moment, coordinates and zone by default; opt-in context disclosed the explicitly supplied inputs without changing the public recipe. One initial temporary probe expected a generic gap code and was corrected to the actual `NONEXISTENT_TIME` contract before the sixty-probe passing run. This was a corrected test expectation, not a product fix; no reviewed owner files were changed.
