# Desktop astrology workbench: product research and design rationale

Research date: 4 November 2026. Target branch: `feat/desktop-astrology-workbench`. Baseline: `39d622394bed9f8d370695502a9e753478695434`. This is original interface development in the existing static application. Solar Fire, TimePassages and Kepler are independent commercial products, used here as workflow references. No affiliation, feature equivalence, copied interpretation corpus or identical calculation precision is implied.

## Evidence inspected

Official feature descriptions were fetched over HTTPS through the configured cloud proxy. Selected passages were read and two official screenshots were directly inspected. The vendor programs were not installed or independently benchmarked. The [source ledger](desktop-research-sources.json) records successful and failed retrievals, final URLs, hashes and reading limits. Raw pages and proprietary screenshots are excluded from the repository and product.

| Product / official source | Observed product description | Useful pattern |
|---|---|---|
| [Solar Fire V9, Astrolabe](https://alabe.com/solarfireV9.html) | Natal, progressed, directed, return, composite, harmonic and other chart calculations; configurable point sets and wheels; interpretive reports; planet/electional searches. The page states Swiss Ephemeris and 30 house systems. | A stable working chart can feed several views and derived calculations. Method and point settings should be visible and exports should retain them. |
| [TimePassages desktop](https://astrograph.com/timepassages/desktop) | Basic edition describes natal/transit work and point-and-click inspection; Standard adds progressions, reports, tri-wheels and transit animation; Advanced lists comparison bi-wheels, composites, maps and midpoints. | Selecting the chart artifact should lead directly to readable details. The primary wheel must remain large enough to study. |
| [TimePassages screenshots](https://astrograph.com/timepassages/screenshots) | The inspected natal screenshot places a large chart beside position and element listings. Exact angular positions accompany glyphs; chart identity, clock, place and house system are visible. | Pair the diagram with an exact-value table. Do not require a user to infer degrees from drawing positions alone. |
| [Kepler user interface](https://www.astrosoftware.com/cpnew/software/kepler/user.html) | Distinguishes creating/transformation of charts from choosing wheels, tables, listings and interpretations. A chart list and selected-report list preserve access to work already opened. | Separate **Chart** actions from **View** actions. Preserve a discoverable library and clear active-chart identity. |
| [Kepler chart wheels](https://www.astrosoftware.com/cpnew/software/kepler/wheels.html) and [interactive customization](https://www.astrosoftware.com/cpnew/software/kepler/interactive.html) | Describes optional chart points, customizable aspect lines and tables, multi-ring wheels and interactive adjustment through time. | Layer toggles, selection highlighting and date stepping should change a reversible view without overwriting a saved natal record. |
| [Kepler multi-ring / progression documentation](https://www.astrosoftware.com/cpnew/software/kepler/forecast_charts.html) | Explains multiple chart rings, multiple progression-angle conventions, and the importance of minutes of arc when assessing contacts. | Always label which chart supplies each ring and which method generated it. Keep exact position/orb data adjacent to the wheel. |
| [Kepler data entry](https://www.astrosoftware.com/cpnew/software/kepler/data.html) and [time-zone documentation](https://www.astrosoftware.com/cpnew/software/kepler/time_zone.html) | Discusses rapid place lookup, ambiguous place names, historical time conventions and DST uncertainty. Some examples/tutorials use Sirius and explicitly qualify product differences. | Date, clock, coordinates and IANA zone need explicit, editable fields. Reject nonexistent clocks and resolve repeated clocks rather than guessing. |

The TimePassages feature-comparison endpoint returned HTTP 200, but the extracted response did not expose its comparison table. Edition descriptions and the inspected screenshot, rather than an inferred hidden table, support the observations above. Guessed legacy URLs returning 404 or an empty response were not treated as evidence. Vendor accuracy/usability claims remain vendor claims.

## Original design direction

The primary job is to cast, inspect, compare and retain charts. A working instrument should occupy the first viewport; the application does not need a marketing hero or a grid of interchangeable feature cards.

Use a black desk with restrained, named accents. Put the saved-chart library and tool discovery at the left; place the large wheel and alternate tables in the centre; put selection details and method notes in a right inspector. Time controls belong near the chart they change. On narrow screens, recompose these into an ordered vertical workflow and collapsible utility regions. Color should reinforce text, glyph and line-pattern distinctions; it must not be the only signal of a selected record or aspect type.

The three commercial references suggest useful jobs, not a layout to trace. The workbench's own strengths are its source-labelled historical methods, cultural-calendar comparisons, private local data and existing research tools. Those should remain identifiable in the new shell.

### Primary flows

1. **Cast:** enter a name, civil date, local clock, IANA zone, coordinates and house method; inspect the resolved instant; calculate; see the wheel and exact positions together.
2. **Inspect:** choose a planet or aspect through either the wheel or a keyboard-accessible table; keep the selection synchronized; read calculated values, named conventions and a bounded traditional explanation.
3. **Compare:** retain chart A; choose an explicit comparison instant or chart B; label both contexts and aspect rules; provide a way to return to the single chart without losing either input.
4. **Advance time:** step a declared unit or choose an instant. The displayed result and its exports must update together. A natal library record changes only through an explicit save/update action.
5. **Retain:** save locally, reopen, rename/delete through deliberate actions, and download a portable record. Import must validate schema and coordinates rather than accepting arbitrary executable content. Storage denial should produce a usable temporary session with a clear message.
6. **Explore specialist work:** search a catalogue of existing tools by actual name/topic. Open the original working route and preserve deep links; label anything that needs separate input. A link does not mean that its complete tool has been rebuilt inside the new shell.
7. **Explain:** distinguish deterministic calculations from historical interpretation and optional model-generated prose. Preview the actual disclosed packet before sending to any configured model; a static website does not inherit this ChatGPT session.

### Detail decisions

- Separate **calculation settings** (instant, observer, zodiac and house convention) from **display settings** (labels, lines, density, active view). Changing the latter should not quietly change the former.
- Keep a visible active-chart title and method line when scrolling or switching views. A comparison has two named charts, rather than an unexplained second ring.
- Retain degree/minute values in positions and aspect tables. Drawing label spreading is a layout adjustment; exact angular anchors must remain tied to computed longitude.
- Distinguish local persistence from cloud sync. Saving a chart to this browser is not a backup, an account or a Google Drive integration.
- Use native buttons, inputs, dialogs and tables where possible. Every hover interaction needs an equivalent focus/click/tap path.
- Preserve the earlier black/neon chart identity without copying a vendor's icon set, typography, chart art, interpretive paragraphs or trade dress.

## Existing engine and scope map

This inventory is an implementation substrate, not a claim that every item is directly embedded in the new desktop page. The delivery report must identify which are embedded and which remain available through their existing routes.

| Existing module or feature | Reuse opportunity | Boundary to preserve |
|---|---|---|
| `astro.js`, `chart.js`, `aspects.js`, `dignities.js` | Chart, positions, four house methods, aspect and dignity inspection. | Astronomy Engine ephemeris; not a Swiss Ephemeris replacement. Exact displayed decimals do not imply corresponding physical accuracy. |
| `synastry.js` | Two-chart interaspects and house overlays. | Current default uses seven classical bodies and Lilly's planet-based moieties; label these rather than silently claiming a modern aspect-orb default. |
| `progressions.js` | Day-for-year planetary progressions and explicit Naibod-angle method. | The implemented angle convention is not the full range of progressed-house techniques advertised by commercial products. |
| `returns.js`, `solar-return.js` | Solve recurrence to a selected natal longitude. | Declare body, search window, observer and method; monthly-return traditions differ. |
| `calendar-atlas.js`, `calendar-timeline.js`, `orbital-events.js` | Calendar overlays, astronomical timelines and orbital exploration. | Existing source and precision notes remain attached; global eclipses do not establish local visibility or personal outcomes. |
| `birth-reading.js`, `lots.js`, `releasing.js`, `jung.js` | Existing private reading and specialist historical/symbolic tools. | User birth data and private reports are not public example fixtures. Later psychological mappings are distinct from validated psychological assessment. |
| `registry.js`, tool-guide and MCP coverage | Discoverable catalogue of actual calculations and routes. | Static hosting is not a running MCP server. Tool presence does not establish a hosted AI connection. |
| Existing offline library / service worker | Deliberate public-asset installation and offline operation. | Optional external books, hosted AI, external links and providers need network access. |

Professional products advertise extensive asteroid catalogues, proprietary atlases/time-zone research, many extra house/progression conventions, astrocartography, harmonics and specialized reports. These are not implied by a new wheel or desktop layout. Keep unsupported functions out of active controls; document them as future work only if there is a concrete implementation plan.

## Acceptance priorities derived from the research

- Test one complete cast → inspect → compare → save → reload → export flow with independent numerical assertions against the declared canonical engine.
- Test local DST gaps/folds, leap days, longitude wrap, invalid and boundary coordinates, supported year boundaries, close conjunction label collisions and high-latitude house unavailability. Never silently substitute a different calculation convention.
- Verify display changes preserve the chart input; comparison/date changes preserve saved records; exports match the currently displayed frozen context.
- Test bounded rapid date stepping, repeated view changes, imports with long/malformed content, corrupt/blocked storage, empty search and large local libraries.
- Exercise keyboard paths, visible focus, dialogs, 320px reflow and a dense desktop layout; inspect actual screenshots. Tables provide an alternative to glyph geometry.
- Confirm existing tools remain reachable, old route behavior and privacy rules remain intact, the deployment uses the new branch, and the deployed page identity matches the verified revision.

These are acceptance requirements, not a record of tests already passed. Executed checks and any remaining limits belong in the release verification record.
