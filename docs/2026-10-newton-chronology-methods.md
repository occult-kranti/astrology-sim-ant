# Chronology, calculated years and explicit assumptions

The [source ledger](2026-10-newton-sources.md) identifies the inspected Newton passages. The [comparative ledger](2026-10-eschatology-comparisons.md) identifies the separate religious and esoteric texts. These are selected readings, not a complete edition or universal religious chronology.

## Reconstructing a conditional year

`buildNewtonChronology` accepts an optional nonempty selection of the documented machine-calculable branches. In Yahuda7.3g f.13v,42 symbolic months of30 symbolic days give1260 symbolic days. An equivalent modern display is3.5×360=1260. Newton's day-for-year interpretation then assigns1260 years; this is an interpretive premise, not a physical unit conversion. Adding the proposed800CE historical anchor gives2060CE. The source allows a later ending and disclaims asserting the end-time. The data therefore retain a conditional not-before year with no precise civil date or UTC instant.

The separately documented70CE+2300=2370 upper-bound calculation belongs to a different period in Yahuda7.3o. It must not be spliced into the1260-year argument. The written2132 lower bound, unfinished2060 upper bound and contradictory1290-day concluding line remain source-only records. Arithmetic supports positiveCE year numbers1–9999; no implicit year zero, inventedBCE anchor, repaired manuscript digit or inferred prophetic day is accepted.

An anchor sensitivity display shifts the assumed anchor by±1 year and shows the corresponding±1-year change. These shifted anchors are modern probes, not alternative dates attributed to Newton. The [inverse-method notes](2026-10-calendar-inverse-methods.md) explain why reproducing a sum does not establish the historical premise or identify a hidden belief.

## Exploring a year

`buildNewtonExplorationFrame` requires an explicit Gregorian civil date, local clock, IANA zone, observer coordinates, house convention and repeated-clock policy. It delegates to the canonical chart/calendar timeline engine. The chosen date and observer are recorded as modern study assumptions. Guidance scores and purpose rankings are omitted. The result preserves thirteen civil conventions, ten geocentric bodies, twelve tropical house cusps, the supported sidereal chart, sources and unavailable states.

`buildNewtonYearSurvey` covers every Gregorian date of one supported year1900–2100:365 or366 slots, each at the same chosen local clock. Local days need not be24 elapsed hours. Gaps and ambiguous clocks remain present with their reason; no substitute instant or zero score is inserted. Each available row uses the existing canonical calendar comparison. Calendar month/year/era changes and tropical/sidereal Sun/Moon sign changes are first observed changes between daily samples, not exact ingress or religious-boundary times. The year dial uses date position around the year, not zodiac longitude.

The canonical sky timeline separately solves lunar quarters and the four solar seasons. Those events retain their own UTC times and are not moved to the daily sample clock. Only the existing Gregorian and Julian Easter/Pascha computus rules are projected as religious-date examples. Month transitions are not holiday determinations. No extrapolated published2060festival schedule, comprehensive observance calendar or ritual-start calculation is claimed. Future local timezone rules reflect the runtime database and may change by law.

The default2060London-noon survey currently contains366dates,4,758civil-calendar slots and54solved solar/lunar-quarter events. These counts describe the declared configuration, not every possible observer/clock or an outcome model. In this convention the computus projections are18April2060(Gregorian) and25April2060(Julian Pascha displayed as Gregorian). Neither is a Newton-supplied prophetic day.

Six selected Hong Kong calendar fixtures are retained in [the external-check record](evidence/newton/hko2060-fixtures.json). They were read from the HKO table and compared with the canonical runtime; this narrow agreement does not promote the entire calendar family's validation status. Protected table artwork is not distributed.

## Interface, exports and MCP

The UI terminates obsolete workers and checks request identifiers. Changing calculation assumptions invalidates derived exports until recomputation; an old view retains its original context. Calendar-ring selection is presentation only. Moment and complete-year exports preserve their exact inputs and qualifications, while chronology/source exports remain separate from the chosen chart.

`workbench_newton_chronology` has a strict stateless schema and returns the complete source chronology plus one explicit study frame. It rejects undeclared country, birth, belief, objective and caller-chart fields. No stored browser context, provider credentials or model call is read. The bounded adapter does not run the full-year survey. Official SDK HTTP-handler and child-process stdio tests exercise the actual transports. Repository support and static Pages publication do not establish deployment of an authenticated hosted MCP service.
