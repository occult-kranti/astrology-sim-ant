# Source-guided explanation handoff and MCP

This is the AI/interoperability member's contribution to the [six-member, three-round ensemble](2026-10-ensemble-panel.md), extending the [existing AI contract](2026-10-calendar-observatory-ai.md). It adds explanation evidence to an explicit handoff and one local MCP tool. No external model, inherited ChatGPT session, credential, database or provider request is configured by this change.

## Round 1: observed gap and accepted contract

The default nine-fact packet exposed UTC and geocentric longitude conventions but omitted the daily guide's rule IDs, measured inputs, thresholds and source qualifications. A model receiving that packet could not explain the new guidance without guessing. The solution recomputes the existing canonical guide and selectively includes its evidence; it does not invent another calendar engine or historical interpretation.

| Outgoing choices | Packet contents |
|---|---|
| Neither checkbox | Existing nine geocentric facts, three provenance sources; no guidance field or observer data |
| Historical rules only | Nine facts plus ten Western/Muhūrta sample rules, their thresholds, source qualifications and applicable tensions; no observer, local clock, civil labels or temporal-hour rule |
| Location only | Existing explicit observer/civil-calendar disclosure; no guidance field |
| Both | Observer/civil-calendar facts plus eleven rules, including the selected observer's temporal-hour rule |

Both choices start off. Changing either, the question, or the underlying calculated context clears the prepared preview and disables copying/downloading. The visible preview is the exact prompt to be copied. The ChatGPT link is plain `https://chatgpt.com/`, without query text or a connection claim. Local “measured rules” and “favorable and caution coexist” questions compute evidence on-device without changing the outgoing choices.

The packet uses explicit field allowlists. Historical explanations and opted-in civil labels are recomputed from the validated UTC context, ignoring supplied derived rules, prose and sources. With location off the computation uses a neutral observer and excludes the observer-dependent tradition entirely. Rules retain their selected-instant scope, measured values, thresholds, source IDs, source status and modern editorial action labels. A timing-unresolved Yoga remains unavailable, with `applicableAtInstant:null`; missing start/end events never become an inferred safe interval. Favorable and caution testimonies are not averaged. An encoded historical source disagreement stays a disagreement.

The local helper is finite rule-based prose, identified as `modelCalled:false`. Source citations support provenance, not predictive validity or evidence of an effect. Source text and questions are marked untrusted data in the handoff instructions; the receiving provider's own behavior and retention are outside this local workflow.

## Source access and reading depth

The member read the new shared source contract, Gregorian calendar profile, Lilly profile and Agrippa profile. Those are implementation/review instructions, not evidence that the original books were read. Actual additional acquisition on 2026-10-29 was:

| Source | Actual access and reading | Application |
|---|---|---|
| [Official MCP tools specification, protocol 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | HTTP 200, 375,999 bytes. Read structured-content/text compatibility, optional output schema and untrusted-annotation sections. SHA256 `5e60d77317be6bb1bccfe6013712158f01d83578c0632a07c04471ef7db248d3` | Retain both structured JSON and matching text, use the official SDK, and test actual protocol exchange. Server data is not LLM structured generation. An annotation is not authentication. |
| [Agrippa, Book II, chapters 29 and 34](https://esotericarchives.com/agrippa/agripp2c.htm) | HTTP 200, 105,914 bytes. Read the complete selected II.29 and II.34 text sections (2,479 and 2,419 characters in extracted text), not the whole book. Hosted transcription of the 1651 English “J.F.” edition; translator identity is not resolved here. SHA256 `3b2a63d41c2b54196e94305bbc0bd361568d846cba6ea5d650e7738c3e306608` | II.29's broad solar-conjunction warning is preserved as the already encoded source difference at a cazimi sample. II.34 describes both sunrise/sunset division and a competing oblique-ascension convention; the selected engine convention must not be presented as the only historical one. No new occult timing rule was encoded. |

These are access and selected-reading receipts, not whole-book mastery, human-practitioner endorsement, primary verification of every inherited Lilly/Muhūrta rule or confirmation of magical effects. The Muhūrta packet still explicitly carries “primary-passage verification pending.” The downloaded source HTML stays outside the repository; only acquisition metadata and the bounded reading account are recorded here.

## Local MCP contract

`workbench_explain_guidance` is the fourteenth tool, retaining all previous thirteen. It wraps `buildDayGuidance` with an explicit UTC timestamp, latitude, longitude, IANA zone and optional supported house-system selector. Unknown fields, date-only or invalid dates, invalid zones and out-of-range/non-finite coordinates are rejected before calculation. One sample is returned, not an arbitrary time scan. Existing input/output bounds and read-only/idempotent annotations remain in force.

Unlike the browser's minimal handoff, an MCP caller explicitly supplies the observer, and this tool returns the full canonical observer and temporal-hour context. It cannot read browser notes, stored births or an account. All source calculations run locally without model credentials or outbound calls. Both Streamable HTTP and child-process stdio return identical structured and text data using the pinned official SDK. No output schema was added or claimed.

The generated catalogue describes current source, now fourteen tools. The historically deployed private backend exposed eleven; comparison, outlook and guidance are not asserted to be available remotely until that backend is deployed and an authenticated `tools/list` and actual call succeed. GitHub Pages remains static.

## Candidate verification

Focused checks on the changed Round 1 candidate passed ten packet test groups and eight pure MCP toolkit groups, plus actual official-SDK HTTP and child-process stdio initialize/list/call exchanges. These test geography independence, separate opt-in, forged-derived-snapshot exclusion, unchanged default packet, exact inherited thresholds/source qualifications, unresolved Yoga, actual source disagreement at 2024-04-08T18:17Z, polar unavailability, bounded output and zero network calls. The protocol tests call the new tool and compare text JSON with `structuredContent`; HTTP metadata exposes the read-only annotation. Catalogue regeneration and stale-check agree on fourteen tools.

The Delhi 2026-10-29T12Z fixture produces 4,133 JSON characters by default, 25,897 with rule evidence and 33,165 with both choices, below the enforced 48,000-byte limit. These are fixture observations, not universal packet-size guarantees. A first new test assumed the input zone alias was preserved verbatim; the canonical context normalizes its alias, so the assertion was corrected to compare the canonical zone. No production calculation was changed for that test.

## Round 2: independent review and corrections

The symbol member injected arbitrary civil-calendar text and a fabricated primary-source claim into an opted-in comparison snapshot. Historical guidance was already recalculated, but the legacy civil rows still copied derived snapshot strings. The packet now recomputes those rows from explicit context before assigning local-engine provenance. The new malicious-row regression covers both location-only and combined disclosure; all eleven packet test groups pass.

The experience member observed that the local guidance answer referred to evidence “in the preview” even when no outgoing rule evidence had been prepared. The answer now explains the separate historical-rule checkbox and Prepare preview action, while stating that local explanation does not change either disclosure choice. No checkbox is automatically enabled.

This member independently reviewed the changed sigil importer at core SHA256 `2f9f886d8e1bfbdf26953034bc6d52e3f571aefd9acaefbd27b6eaa588d9ec38` and app SHA256 `10fb9ba30096fa50804036af60de77c9ffb057579f50aa890c03ac1c96e9b3ea`. The probe found that nonplanetary `planet` accepted an arbitrary object and carried a private-field sentinel into replay metadata. This was a schema/privacy boundary issue, not executable SVG. The symbol member now requires null for intention/mandala. An independent recheck against core `cafdab49bb2ebb845626519afdc789cc54114fbdd18a4ed91ae4bbc67830fef1` rejected eight object/string/array/number cases across those modes, while canonical null recipes replayed. Numeric primitive limits, escaping, explicit restoration/recomputation and cancellation guards were also inspected; top-level prototype-bearing fields were rejected and the Object prototype remained unchanged.

## Round 3: held-candidate acceptance

**ACCEPT for the reviewed local AI packet and MCP source.** After the root's formal Round 3 trigger, the held candidate passed eleven packet groups, eight pure MCP groups, the fourteen-tool catalogue stale-check, and actual official-SDK HTTP and child-process stdio tests. A separate probe rejected twelve option/MCP type-abuse cases, confirmed that false/null/undefined guidance values do not disclose, and verified all four disclosure combinations against forged civil text, fabricated rule prose and arbitrary private fields. Both R2 corrections remain present; no further product edit was needed for acceptance.

| Held artifact | SHA256 |
|---|---|
| `assets/js/core/calendar-study-packet.js` | `ddcdb60eee7d3f71b608d04fbaea1afbe0da09e2f7ea4daba556c0c76bd8ed90` |
| `assets/js/app/calendar-assistant.js` | `33111c9a121276c32a183081839e6f902bc6e481de8e3ecb6244154af2fab318` |
| `mcp/toolkit.mjs` | `6e439e3780026f61a93a41cf09a904f53c223f1b75c9b3826e8c73281c2fd290` |
| `assets/data/mcp-catalogue.json` | `db1cab2ebccc1126fd2fac238bf322fea8f66fa9b1cffbb331a113439f7849e3` |
| `mcp/test-protocol.mjs` | `734785ea75897c0a5c8c496205d785dd9f7935f18a08a6261ae1fa09d0d95d04` |

This member ran no browser process in Round 3; the experience member owns final integrated browser evidence. Acceptance establishes the local explicit-disclosure and deterministic read-only contracts. It does not establish hosted backend deployment/authentication, an external-model invocation, full-book expertise, human specialist review or empirically validated predictions. Those limitations remain explicit in the source and UI.
