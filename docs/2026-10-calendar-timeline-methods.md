# Synchronized calendar timeline: task and adapter methods

This page studies one explicit local-clock sample on each selected civil date. One chosen index supplies a shared UTC instant for the calendar, tropical house chart, sidereal chart, sky and optional rule evidence. A moving slider is not a search for exact transitions, a whole-day verdict or a model of future outcomes. Astrology has no demonstrated predictive validity.

The canonical engine is `assets/js/core/calendar-timeline.js`. Presentation definitions are in `assets/js/core/data/timeline-study-tasks.js`; the public read-only adapter is `mcp/calendar-timeline-adapters.mjs`. The [engine contract](2026-10-calendar-timeline-engine.md) describes coordinate frames and exports. The [existing ranking method](2026-10-horizon-ranking.md) remains authoritative for profile weights, dependencies, complete-case scoring and source disagreements.

## Five task cards, three existing editorial profiles

| Card | Implemented method | What the displayed value means | Required evidence and limits |
|---|---|---|---|
| Begin a small project | `western-increase-study` | Greater match to an authored increasing-light preference and a limited inherited lunar-rule subset. | Moon–Sun elongation/solar separation, Moon speed and tropical longitude, Moon–Mars/Saturn applying-aspect evidence. Six contributions with fixed total weight 10; all must be observed. |
| Finish or simplify | `western-decrease-study` | The same authored profile with its phase preference reversed. Completion is a modern prompt. | Same six contributions and denominator. The original guidance classes remain visible; Lilly’s decreasing-light debility is not replaced by an invented historical endorsement. |
| Read, write or study | `mercury-hour-study` | Mercury temporal hour maps to 100 editorial index points; another known ruler maps to 0 and is not adverse. | Observer sunrise/sunset, weekday sequence, temporal-hour number/ruler and interval. Missing solar boundaries produce no score. Mercury dignity, ascendant and image conditions are omitted. |
| Prepare for dialogue | Unimplemented | No profile, score, favorable time or predicted agreement. | A dedicated source-verified method and full implementation would be required. A Mercury/learning profile does not become a negotiation or treaty-success method. The practical preparation prompt is ordinary editorial advice. |
| Plan a ceremony | Unimplemented | No profile, score, predicted religious event or ritual-efficacy claim. | A named community, observance, convention and authoritative schedule or checked method would be required. Civil dates cannot supply missing sunset, lunar observation or jurisdiction rules. |

All five cards expose calculation requirements, implementation status, claim type, source references and limitations. Each also carries a nonempty `source` citation string: implemented cards resolve the existing source titles, locators and URLs; unimplemented cards cite this project-authored method boundary. `wholeDayValidity` and `eventOutcomePrediction` remain false. The two unimplemented cards have `profileId:null`, `result:null`, `score:null` and no purported supporting historical source IDs. Their optional actions are modern practical prompts, not historical rules.

The three implemented cards reuse existing profiles without changing a weight, threshold or formula. A score is `100 × sum(value × weight) / sum(all declared weights)` only when every required contribution is observed. Missing data is not favorable and never reduces the denominator. Raw traditional classifications, exact measurements, weighted contributions and dependency groups stay in the canonical result. Phase and solar distance share Moon–Sun geometry; these are not independent confirmations. Different profiles are not comparable measures of success.

The canonical frame can also expose the existing `jyotisha-classification-study` profile. It retains its separate secondary-source classification status, shared tithi/karaṇa dependency and unresolved opening-portion yoga missingness. None of the five task cards uses that profile as a substitute for a task-specific method. Neither calendar labels nor observance dates are score contributions.

## Sources reused, with their original reading limits

This implementation inspected the existing source records, method report and [source receipt](evidence/horizon/ranking-sources.json). It did **not** newly retrieve these works, read whole books, resolve edition variants or independently establish historical efficacy. The receipt records the earlier selected-passage work on 30 October 2026; those are inherited reading claims, not new readings by this timeline pass.

| Source | Exact inherited reading scope | Supported limited claim |
|---|---|---|
| Agrippa, *Three Books of Occult Philosophy*, II.29 | Complete selected chapter, J.F. English translation (1651), Peterson digital edition. | Several celestial conditions occur together; a single phase/hour is insufficient to reproduce the procedure. |
| Agrippa II.32 | Opening paragraph in the same edition. | Lunar generation, increase and decrease associations. The completion prompt and opposite-phase preference remain editorial. |
| Agrippa II.34 | Complete selected chapter in the same edition, carried by the existing hour source. | Twelve daylight and twelve night divisions, alongside another ascension convention that is not implemented. |
| Agrippa II.43 | Complete selected chapter in the same edition. | Mercury-image knowledge/eloquence associations under additional conditions. A standalone study-hour match is an incomplete modern adaptation. |
| Lilly, *Christian Astrology*, Book I | pp.77–78 and p.115 in the World Astrology Network transcription marked copyright 2003; historical work 1647. | Mercury and literate/learning professions under stated conditions; increasing-light fortitude and decreasing-light debility. No endorsement of the completion profile or proof of learning outcomes. |

The Agrippa historical translation is public domain; Peterson’s hosted editorial material retains its own rights. “J.F.” is retained without resolving the disputed translator attribution. Lilly’s historical public-domain status does not erase the modern transcription’s copyright notice. The implementation stores original short paraphrases and source metadata, not copies of the PDF or modern editorial material. The existing unusable Skyscript response and unused Agrippa Book I retrieval remain unused evidence.

Inherited solar-distance conventions, lunar-speed thresholds, Via Combusta selection and the 0.05-day applying-aspect approximation keep their existing qualifications. The selected passages above do not newly validate every inherited threshold. No lunar, calendar or religious label is promoted to a universal auspiciousness rule. No source-reading role represents a historical author, human practitioner or religious community.

## One strict MCP selected-frame tool

`workbench_calendar_timeline_frame` requires `startDate`, `endDate`, `time`, `timeZone`, `lat`, `lon`, `system`, `disambiguation` and zero-based `index`. Date endpoints are inclusive within 1900-01-01–2100-12-31, and the grid contains at most 3,660 daily slots. The selected UTC instant must also fall within supported years. The index must be an integer within the actual grid. Coordinates are explicit; the caller is responsible for selecting the geographically appropriate IANA zone.

Optional `includeCatalogStars` defaults to false and `includeGuidance` defaults to true. Explicit prayer method, Asr and high-latitude convention enums are accepted and recorded by the canonical engine. The adapter requires a declared house system and fold policy even though the core can default its fold policy to reject.

The schema has `additionalProperties:false`. Runtime validation also rejects unknown or symbolic keys, accessor/non-enumerable properties, nonplain objects, type coercion, invalid numbers and malformed date/clock strings before canonical semantic validation. It accepts no free-form objective, event narrative, private note, country identity, birth context, supplied chart or military field. The adapter invokes the canonical frame builder; caller-supplied calculated records are never treated as evidence.

`reject` preserves an ambiguous repeated clock with both candidates and no chosen instant. `earlier` or `later` selects an occurrence and retains both alternatives. A nonexistent clock or skipped civil date remains unavailable, without shifting the clock. A supported local endpoint that resolves outside the supported UTC years also remains unavailable with its actual candidate retained. The complete requested date grid is distinct from the single computed frame; changing a sample’s local date does not imply a constant 24-hour UTC interval.

The serialized result must fit 1,300,000 UTF-8 bytes. A result exceeding that bound raises a clear error suggesting optional detail be disabled. No rows, sources or limitations are silently truncated. The tool returns an explicit observer disclosure; it reads no browser storage, personal record, model credential, authenticated calendar or remote provider. Source registration and passing local/transport tests do not establish hosted deployment or a signed-in external service connection.

## Review and verification record

Round 1 implements the existing-profile mapping and strict adapter. The independent source-boundary reviewer accepted the five-card structure, the preserved Lilly/completion disagreement and the explicit unimplemented dialogue/ceremony status. The reviewer required that the UI/API preserve sampled-instant limits, resolved source IDs and absence of custom task objectives. Those are contract requirements, not a claim that browser integration has already passed.

Round 2 challenged the adapter with canonical parity, every required-field omission, unknown/free-form/private fields, primitive coercion, accessor/symbol fields, the 3,660/3,661-date boundary, repeated and missing clocks, the skipped Apia date, UTC endpoint limits, optional detail, polar missing hours, disabled guidance, source-reference closure and unimplemented task status. The executed [driver](evidence/calendar-timeline/methods/check.mjs) and [receipt](evidence/calendar-timeline/methods/round2-receipt.json) retain actual inputs, runtime, response byte sizes and before/after source hashes. The initial temporary driver passed 19 groups; the retained integrated driver additionally checks source stability and canonical task/source integration. Counts in each receipt describe that exact run.

Two independent roles then checked the implementation. The adapter reviewer found no method defect in strict field validation, canonical recomputation, byte bounds or the existing-profile mapping. The source reviewer compared the cards with `horizon-ranking.js`, its method report and source receipt, confirming the II.29/32/43, II.34 hour-source and Lilly pp.77–78/115 boundaries. This was a consistency review of inherited evidence, not new retrieval or full-book reading.

Round 3 held the files for independent engine, source and browser verification; the [initial held-check receipt](evidence/calendar-timeline/methods/round3-receipt.json) identifies that earlier snapshot. The root's final source-contract audit then found that task records lacked the literal `source` field required by the repository's `add-data-module` skill. The bounded correction adds citation strings and one assertion that every task has one. It changes no calculation, weight, input schema or task-status behavior, and supplies no new historical claim. Corrected task-data SHA-256: `0eeebc1d445844db95c4e9e8f38f2f6c4fe0b2035019c74eea4e2bf5d52d3d46`.

The [citation-correction held-check receipt](evidence/calendar-timeline/methods/round3-source-citation-receipt.json) records the current focused run and source hashes. Parent integration owns tool registration, generated inventories, inherited release gates and publication evidence. Planned checks and local tests are not claims of hosted deployment.

Sources: [Agrippa II.29/32/34/43](https://esotericarchives.com/agrippa/agripp2c.htm); [Lilly, *Christian Astrology* I](https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf); [inherited ranking receipt](evidence/horizon/ranking-sources.json); `HORIZON_RANKING_SOURCES` and `DAY_GUIDANCE_SOURCES` in the canonical engine.
