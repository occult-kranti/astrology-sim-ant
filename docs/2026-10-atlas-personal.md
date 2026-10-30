# Optional personal solar/lunar calendar study

Baseline `0d115c911ffd744279e3d3640f598d2b8fee3c81`; member `ai_explanations` in the new six-member, five-round atlas panel. This is an engineering and source-analysis role, not a human astrologer, historical author or trained specialist model.

## Round 1: baseline finding and implemented contract

The existing Nativity page already distinguishes known and unknown birth time, resolves named time zones, and uses `untimedPositions` for an actual civil-day interval. `castChart`, `castVedic` and the solar-return rootfinder already provide the relevant arithmetic. The new atlas and search need a reusable optional interface to those methods, rather than silently turning a birthday into an exact personal chart.

New files:

- `assets/js/core/personal-calendar.js`: normalization, selected-instant comparison, actual tropical returns and explicit export disclosure.
- `assets/js/app/personal-calendar.js` and `assets/css/personal-calendar.css`: optional local birth form, method comparison, status/limits and reviewed JSON export.
- `scripts/tests/personal-calendar.mjs`: semantic, source-fixture, uncertainty, range, root and privacy checks.

The supported study range is 1900–2100, checked against the input civil birth date and its resolved UTC instant/interval. This narrower atlas range does not extend the accuracy claims of older chart modules. Dates are proleptic Gregorian; a named zone is the birth record's zone, not the selected public observer's zone. Modern IANA rules and historical database quality still limit interpretation of old records.

### Input certainty

| Record | Actual calculation | Withheld |
|---|---|---|
| Recorded time supplied | Resolve local date/time with explicit zone and repeated-clock occurrence; compute tropical Sun/Moon, selected Western houses, and approximate Lahiri sidereal Sun/Moon, whole-sign placements and a bounded inherited Vimśottarī period label | Alternative ayanāṁśas/school rules, complete Lilly or Jyotiṣa judgments, outcome predictions and unimplemented sidereal return models |
| Time unknown | Use `zonedCivilDay` and `untimedPositions`; 25 samples estimate the tropical and sidereal Sun/Moon arcs from the true interval start through its last included millisecond | Ascendant, Midheaven, houses, sect-based personal judgment, Vimśottarī and exact return instants |

An unknown-time record never supplies a clock time to `castChart` or `castVedic`. Its representative midpoint is explicitly marked `representativeIsBirthTime:false` and each body's representative longitude `representativeIsBirthPosition:false`. The UI displays the estimated arc and possible sampled signs, not one exact natal sign. The samples are not certified extrema, and boundary memberships retain numerical uncertainty. A 23-hour day, 25-hour day, 23.5-hour day or midnight gap is resolved as such; a wholly skipped date is rejected.

Repeated local clocks reject by default. A recorded-time user must choose earlier or later only after checking their record; a nonexistent clock remains rejected even if earlier/later is selected. This deliberately differs from Temporal's optional gap-shifting behavior. Exact geographic poles cannot define the timed chart's ascendant and are rejected; the inherited engine's other house fallback warnings remain visible.

### Named conventions, comparisons and actual returns

Regiomontanus is identified as the inherited Lilly house convention. Placidus, whole-sign and equal houses are explicit comparison alternatives, not statements that Lilly used all four. The Vedic display always uses the repository's documented linear Lahiri estimate, whole-sign houses and mean nodes. No new primary text collation or JHora equivalence is claimed. The small selected fixture set does not validate all dates, regions or schools.

The current-minus-birth Sun/Moon longitude is a signed circular displacement in degrees, not an aspect score or personal prediction. Sidereal displacement includes the change in ayanāṁśa between birth and the selected moment; it is not forced equal to tropical displacement. Shared positions are a common calculation dependency, not independent agreement between traditions.

The exact-time mode can explicitly request two real numerical recurrences:

- **Solar:** existing `solarReturnInstant`, in the selected UTC year, with residual below its 0.0005° stopping criterion. This can precede the selected moment. A complete annual judgment or return-chart interpretation is not produced.
- **Lunar:** next tropical geocentric Moon-longitude crossing after the selected instant, within 32 days and the supported UTC range. Six-hour brackets reject the ±180° discontinuity and feed the vendored Astronomy Engine `Search` ascending-zero rootfinder. Output includes the actual bracket, root, residual and one-second search tolerance. This is neither a lunar-phase recurrence nor a sidereal return. The numerical tolerance is not a promise of physical ephemeris/time accuracy.

Unknown-time mode withholds exact returns even if requested; it never uses the midpoint target as a known natal longitude. A next lunar crossing beyond the supported range remains unavailable. Vimśottarī is also unavailable before the recorded birth instant or outside the actually computed timeline, preventing the inherited engine's generic first-period fallback from being presented as a current period.

### Component and privacy boundary

`mountPersonalCalendar(container, { onChange, getSelectedInstant })` returns `{getValue, clear, refresh, destroy}`. `getSelectedInstant()` returns an explicit UTC/offset ISO string or null. The normalized value is either:

```js
{date, timeKnown: false, timeZone}
// or
{date, timeKnown: true, time, timeZone, lat, lon, disambiguation}
```

No birth data are read from or placed in URLs, localStorage, sessionStorage, a database, a chatbot or an account. The component starts collapsed with empty birth fields, unknown time and private export off. Applying a valid context holds it only in memory. Public-context refresh recalculates; an absent public moment clears the personal result while retaining the explicitly applied birth input in memory. Editing birth inputs invalidates the previous result, callback value, export preview and private disclosure. Clearing or destroying the component clears its private fields and state.

Parent atlas/search exports and URLs must use their public calculation object and exclude `getValue()`. The component's separate export requires Prepare preview, review of exact JSON and Download. By default it contains only the selected public instant and source metadata—no birth date, coordinates or derived personal reading. A separate checkbox explicitly permits the private result; that result is recomputed rather than copied from supplied derived prose. Already downloaded data cannot be recalled.

Stable integration hooks use `data-pc-field` for fields, `data-pc-action` for apply/clear/prepare/download and `data-pc` for status/error/results/preview. The component makes no relative-page URL assumptions; sources use absolute public links. Atlas and search owners mount it and call `refresh()` when their selected public instant changes or becomes unavailable.

## Source access and actual reading

Read the shared source contract, Gregorian profile and Lilly profile, plus the actual `time.js`, `untimedPositions`, `castVedic`, solar-return and Astronomy Engine `Search` contracts. Source profiles are review instructions, not newly read original books. The inherited bibliography and prior selected fixture status are preserved.

Fresh source access in this round:

| Source | Actual result and scope |
|---|---|
| `https://tc39.es/proposal-temporal/docs/ambiguity.html` | HTTP 404. No fresh page reading claimed. |
| `https://en.wikisource.org/wiki/Christian_Astrology` | HTTP 403. No fresh Lilly chapter reading or numerical-rule collation claimed; existing 1647 engine/1659 source-study distinction retained. |
| [MDN Temporal.ZonedDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime) | HTTP 200, 218,855 bytes, retrieved 2026-10-29T23:41:06Z; SHA256 `1c05fbc9e0f68509e629fb26384f40c27db50063b558e72605d4d4688d380ae0`. Read time-zone/offset definitions, political/DST changes and ambiguity/disambiguation behavior. This supports describing time semantics, not astrology. The new component reuses the existing stricter gap-rejecting parser, not a Temporal polyfill. |

The source HTML stays outside the repository. No full-book reading, universal culture coverage, occult expertise, empirical prediction or third-party API connection is asserted by this feature.

## Executed Round 1 checks

`node scripts/tests/personal-calendar.mjs`: eleven groups passed. Checks cover canonical local→UTC resolution and twelve cusps; inherited independent Astrodienst Jan 1, 2026 Sun/Moon and selected Lahiri reference positions; explicit New York fold/gap behavior; 23/25-hour and Lord Howe 23.5-hour days; São Paulo midnight gap; rejected Samoa skipped date; unknown-time Moon wrap/multiple possible signs; changing ayanāṁśa; alternate houses without changing the sidereal positions; no out-of-timeline Vimśottarī fallback; actual solar/lunar root residuals, bracket inclusion and ±one-minute sign crossings; next recurrence rather than the starting or opposite-longitude event; supported-range termination; strict input types; default/private export semantics; host-zone independence and zero fetch calls.

A representative exact-time smoke calculation produced about 5.4 KB of JSON and completed in approximately 50 ms in this cloud run; an unknown-time calculation produced about 6.7 KB in approximately 13 ms. These are fixture observations, not device-wide performance guarantees. Browser, assistive-technology, human tradition review and later panel-round acceptance are separate evidence. Rounds 2–5 require explicit changed-candidate review and are not pre-counted here.

## Round 2: independent domain review and correction

After the moderator's explicit Round 2 trigger, this member independently reviewed the atlas core at SHA256 `43b923d18ee604ec205ec838eb4f258927932406de723011a0a21077585d1ed5` and the fifteen-tool MCP source at `c5c6ad3e93baba78763d6c26708dcdfa9e6a8c37f2d6be6e17c08f5aeaa11e07`. Fifty-three atlas checks and nine MCP toolkit groups passed. An additional independent probe rejected fifteen malformed atlas arguments, checked Hebrew civil-midnight versus unavailable religious sunset output, confirmed partial Placidus→Regiomontanus polar fallback and observer-civil-year Julian computus, and measured the complete tool result at 136,411 bytes against the existing 1.5 MB bound.

One concrete selected-export mismatch was found: choosing only Julian produced one selected row but retained every civil calendar plus unselected Western/Vedic/prayer/hour results inside the full `comparison` object. This was not private birth leakage, but contradicted the UI's selected-only download wording and the MCP filter scope. The calendar owner accepted an additive canonical export helper that recomputes and omits full internal comparison while retaining selected rows and their referenced sources. The full comparison remains an internal sky-rendering contract. Nested result source references also need preservation; planetary-hour results, for example, include `OBS-WESTERN` in addition to the outer metadata's source IDs. Final helper acceptance is recorded after its independent recheck.

The calendar member independently found that this personal component's unknown-time samples included the exclusive end instant. For birth date 2100-12-31 UTC, that meant sampling 2101 despite the supported range ending in 2100. Accepted correction: both the canonical `untimedPositions` call and the sidereal/tropical sample list now end at `end−1 ms`. The true `endUTCExclusive` remains unchanged, and a separate `sampleEndUTC` identifies the last included sample. The regression verifies 2100-12-31T23:59:59.999Z, exact endpoint longitude, and all existing DST interval behavior. Eleven groups pass on corrected personal core SHA256 `06a25c33883c74ba23ceab1df7f9131c03eeaf6e0f79471671308a5d29f4a812`.

These are actual code/source reviews and Node checks. No browser, hosted MCP invocation or human astrology review is counted by this member in Round 2.

The desktop/symbol member separately executed the integrated atlas personal workflow on core `06a25c33…` and app `14f602f2…`: London 2026-10-25 unknown time produced a 25-hour interval without houses or exact returns; recorded 01:30 rejected ambiguity; explicit earlier resolved 00:30 UTC; returning to unknown time did not reuse the clock or houses. Their report is an independent agent/browser check, not this member's browser execution or a human participant study. The search/UI member separately confirmed that its public export omitted the optional birth context.

**Final Round 2 correction acceptance:** independently rechecked all 32 one-variant exports through `exportCalendarAtlas`; every output retained exactly the selected row/family, omitted full `comparison`, and resolved all 209 visited row/method/shared-geometry source references. The helper explicitly declares shared Sun/Moon plate quantities without adding unselected tradition readings. The actual MCP Julian call returned this selected-method form (5,851 JSON bytes), and source inspection confirmed the atlas JSON click handler calls the same helper. A planetary-hour-only payload retained nested `OBS-WESTERN`. The complete atlas tool output was 122,943 bytes, below its 1.5 MB bound. The current 87 atlas checks, eleven personal groups and nine MCP toolkit groups passed. The private unknown-time 2100 endpoint remained `sampleEndUTC=2100-12-31T23:59:59.999Z`, distinct from its true 2101 exclusive boundary. No browser process was run by this member for this recheck.

Accepted held hashes: atlas core `763195d3d9e1defba8d8c2b9a966675934f5f6c3e00f0cac689b30c73aa631a4`; atlas app `a8a2f0860db4471eb032c1aeb8ecc04ea5fa747cbff95618e4e8a6eb9ef2570d`; MCP toolkit `f5b868b4be506a4759fc371399b09848963ef2c8a228f5d2f18e1baa3daf54e6`; personal core `06a25c33883c74ba23ceab1df7f9131c03eeaf6e0f79471671308a5d29f4a812`; personal app `14f602f27719feb20944a2bea29c542ab27e57f29d43ad0abb8ee4a636e20dcb`. This is acceptance of the reviewed Round 2 source/serialization corrections, not a claim that rounds 3–5 or hosted deployment have occurred.

## Round 3: worker, import and private-state challenge

After the formal trigger, this member inspected the search worker controller, app cancellation/revision guards, import bounds and source normalization, plus the personal component's `getValue`, `refresh`, `clear` and `destroy` lifecycle. **ACCEPT for the bounded tested lifecycle/privacy scope; no additional product correction was needed.** A real Chromium run on 2026-10-30 passed 25 checks:

- Native module Worker completed three actual samples. A long advanced job was cancelled and its native Worker was terminated.
- A previously received native calculation result was deliberately dispatched to an old listener while a newer job was active, and again after cancellation. It could not replace the active result or enable stale exports. This was controlled late-message injection using real result data, not evidence of a naturally occurring race.
- A local `File.text()` promise was deliberately held until after an input revision. Releasing it could not activate the stale import. A 100,001-byte import was rejected without replacing existing event records. Applied imported source claims remained labelled caller-supplied/unverified.
- Actual JSON download bytes confirmed public search and default personal exports omit birth date, birth zone, coordinates and derived private fields. A separately reviewed explicit private export contained the requested birth data. Changing disclosure cleared the preview; editing birth inputs cleared results, download state and the private checkbox.
- Birth application changed neither localStorage nor sessionStorage, did not mutate the URL and never put birth fields in a Worker request. The component retained its explicitly applied immutable input when the public moment became null, cleared the calculated result, then returned null after clear and removed its DOM after destroy.

There were zero external requests and zero uncaught browser errors. The temporary browser and local server were closed before releasing the slot. Two driver-only setup mistakes were corrected before acceptance: the installed Playwright package required its default import, and the first workflow attempted to click an import action inside a closed disclosure. The corrected driver opened the actual disclosure; no force click or product change was used, and the failed trial was not counted as acceptance.

The durable [machine report](evidence/atlas/personal-worker-r3.json) records the checks and hashes of JavaScript responses actually served to the browser: search app `a8ee4649539144f36c725205837d9ebb7c52a61237c066976683d973b3ce29bc`; search core `27f33f444492015d755b2b5c4c4944055457e66679588ecda7ea5cca08d15920`; worker `0895f5c200e9c4b73d0b3c2f6b00e57e23acd9b858e777a6566ca3f0e72bc020`; personal core `06a25c33883c74ba23ceab1df7f9131c03eeaf6e0f79471671308a5d29f4a812`; personal app `14f602f27719feb20944a2bea29c542ab27e57f29d43ad0abb8ee4a636e20dcb`. Statistical ranking/denominator review and final release coverage belong to the other assigned reviewers and later rounds; this run does not claim those checks.

The [bounded reproduction driver](evidence/atlas/personal-worker-r3-repro.mjs) is the executed script. In this cloud image it uses the existing Playwright runtime path and `/usr/bin/chromium`. Start `python3 -m http.server 8136 --bind 127.0.0.1` from the repository root, then run `node docs/evidence/atlas/personal-worker-r3-repro.mjs` from another shell. It creates one browser process, uses synthetic birth/event records, closes the browser in `finally`, and writes a new receipt to `/tmp/atlas-r3-ai-browser-report.json`; stop the HTTP server afterward. Its controlled message/File delays are described above and inside the receipt. This focused driver is separate from the maintained release browser gate.

## Round 4: mobile personal flow and readable actions

After the formal Round 4 trigger, a focused actual Chromium check at 390×844 exercised the integrated search-page personal panel: collapsed optional birth control opened with Enter; known-time input and requested solar/lunar recurrences; switch to unknown time; London’s 25-hour civil day; cancellation of the public search; and explicit clearing of all birth fields. Fourteen checks passed, with zero external requests or uncaught browser errors. Exact returns remained withheld for unknown birth time. Public cancellation cleared the derived reading while truthfully retaining the explicitly applied memory input until Clear.

One measured UI defect was corrected: the later-loaded shared `observatory.css` button selectors reduced the personal action labels to 14.4px. Computed parent/body and field text were already 16px. An initial inference about inherited body size was disproved; a trial base font reset did not fix the buttons and was removed. The final change only adds `.pc-panel button[type][data-pc-action]{font-size:1rem}`, with enough specificity for the shared stylesheet’s load order. The final visible form/action metrics were all 16px and at least 45px high; the page had no horizontal overflow. No global theme or calculation change was made.

The [final machine receipt](evidence/atlas/personal-flow-r4.json) includes served hashes and clearly marked post-run review notes. The [initial failing receipt](evidence/atlas/personal-flow-r4-before.json) preserves the measured baseline; it is not counted as acceptance. The [executed bounded driver](evidence/atlas/personal-flow-r4-repro.mjs) uses localhost port 8137, the installed Playwright runtime and `/usr/bin/chromium`; run a local HTTP server from the repository root before invoking it, then close the server afterward. It writes new receipts and screenshots under `/tmp`. The [known-time return view](evidence/atlas/atlas-r4-personal-known390.png) and [unknown-time return view](evidence/atlas/atlas-r4-personal-unknown390.png) were visually inspected for wrapping and readable qualification.

**Round 4 ACCEPT / product HOLD:** personal CSS SHA256 `ca5d7419b165e9aa71fab5f115989f8d486d073d4c3c21590d4fcfd2db1f388a`; personal app `14f602f27719feb20944a2bea29c542ab27e57f29d43ad0abb8ee4a636e20dcb`; personal core `06a25c33883c74ba23ceab1df7f9131c03eeaf6e0f79471671308a5d29f4a812`. This is bounded local mobile-flow acceptance, not a human tradition/usability study or hosted-release verification. Round 5 remains separately triggered.

## Round 5: frozen personal contract acceptance

After the moderator's explicit freeze trigger, this member performed a read-only final inspection of the held component and core: explicit recorded/unknown-time choice; actual half-open civil-day sampling ending at `end−1 ms`; unavailable houses, periods and exact returns without recorded time; canonical private recomputation; metadata-only default export; explicit private preview; input invalidation; `clear` and `destroy`; and the scoped action typography correction. No new product/driver change, broad test run or browser was made by this member in Round 5.

Independently inspected the QA member's completed [Round 5 browser receipt](evidence/atlas/round5-final/receipt.json), SHA256 `c1fadd75a25bc16481a763ee73ba63f7be840f5bfafa259e87be198e4a98ccf7`: 612 passing checks, 85 actual downloads, no errors, missing requests or external requests. Its known/unknown-time, DST-fold, private/default export, public JSON/CSV/link isolation, clear, actual return disclosure and 16px action checks passed. The [final source binding](evidence/atlas/final-source-binding.json) records 446 product files unchanged between Round 4 and Round 5 and no drift during execution. The actual personal core/app/CSS hashes in that receipt match the held files listed in Round 4 above. This member reviewed the receipt and source binding; QA executed that browser run.

**Round 5 ACCEPT / personal product remains frozen.** No unresolved blocker was found in this bounded personal-calculation, privacy and mobile-flow scope. The implementation is a local, source-qualified traditional-coordinate study; approximate Lahiri, sampled unknown-time arcs, unsupported variants, absent full-book collation and unestablished predictive validity remain explicit. No real AI provider, physical-phone or screen-reader test is asserted. Repository-wide final gates, remote CI and hosted deployment are separate moderator evidence.
