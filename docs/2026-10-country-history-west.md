# Country history sources: United States, Israel and Palestine

Source/data round 1, 30 October 2026. Method: primary-document transcription and selected official archival, statutory, diplomatic and UN passages, with explicit source-access and institutional-dependency checks. This catalogue supplies historical reference events. It does not choose a national “birth”, adjudicate legitimacy or borders, forecast outcomes, or supply military timing.

The eight records are in `assets/js/core/data/country-history-west.js`. All are **date-only**: `localTime: null`. There is no normalized UTC instant, invented noon, certified ceremony clock or exact historical observer. The app's shared engine is limited to 1900–2100: all three U.S. records remain computationally unavailable. No different year or hidden sample instant may replace them.

## Events and comparison verdicts

| Record | Checked event and date | Evidence / limit |
|---|---|---|
| United States — independence resolution | Congress adopted the independence portion of the Lee Resolution on **1776-07-02**. | NARA's primary-document transcription and historical account agree. Both share one archival institution; independent institutional corroboration remains unresolved. June 7 proposal and July 4 Declaration adoption are different acts. |
| United States — Declaration | Declaration text adopted **1776-07-04**. | Primary dateline plus NARA history and Library of Congress summary agree. This does not mean all delegates signed the engrossed parchment that day. |
| United States — Constitution | Convention signing **1787-09-17**. | Constitutional attestation plus Library of Congress account agree. Ratification and operation of the new government are separate events. |
| Israel — declaration | Declaration issued at Tel Aviv **1948-05-14**, dated 5 Iyar 5708 in the checked English transcription. | Yale's primary-document transcription and U.S. State Department official history agree on the Gregorian day. The original Hebrew manuscript was not inspected. |
| Israel — provisional authority | Declaration's provisional-institution clause refers to **1948-05-15**, 6 Iyar 5708, following termination of the Mandate. | The declaration and the UK Palestine Act independently specify this date for distinct legal acts. The Act allows an earlier date by Order in Council; the statute alone is not proof of every implementation step. This is not a second declaration ceremony. |
| Israel — UN membership | UN Library indexes admission resolution A/RES/273 (III) to **1949-05-11**. | **Single accessible institutional source.** Original-resolution access failed. This is an institutional admission marker, not a national birth or universal recognition date. |
| Palestine — PNC proclamation | UN resolution 67/19 recalls the PNC proclamation on **1988-11-15**. | A Palestinian mission's separate historical account corroborates November 1988, not the exact day. Original 1988 annex access failed. Algiers is a historical reference city; the accessible passages do not independently corroborate the city or precise venue. These limits are encoded. |
| Palestine — UN observer State | Resolution 67/19 adopted **2012-11-29**, operative paragraph 2. | Official PDF and UN Library catalogue agree; they share UN institutional provenance. The Palestinian mission independently describes the 2012 status change, not its exact day. December 4 is the PDF distribution date. Non-member observer State status is not full UN membership. |

These are differences in the acts being dated, not competing predictions. The choice of an institutional reference marker cannot settle questions of sovereignty, recognition or historical continuity.

## Source reading, editions and rights

The module records source IDs, institution, title, URL, exact locator, access date, rights, and actual reading status. Every event has both a resolvable `sourceIds` list and a self-contained `source` citation. The sources are documents or retrospectively maintained pages, not a claim to have read whole archival collections.

- **NARA**: Lee Resolution document/transcript and introduction; Declaration dateline and selected adoption/signing history; Constitution attestation. **Library of Congress**: opening Independence Day and Constitution-signing sections. These supply the precise U.S. event distinctions.
- **Yale Avalon**: the English declaration transcription, including opening dateline, provisional-authority clause and concluding Tel Aviv attestation, was read. This is a scholarly-hosted primary-document transcription; it is not an official facsimile or a fresh Hebrew collation. The U.S. State Department opening historical paragraph independently confirms May 14. That historical series is marked retired/no longer maintained.
- **UK Parliament / legislation.gov.uk**: original print of the Palestine Act 1948, chapter 27, page 1, section 1(1), was extracted and visually inspected. The PDF parser issued cross-reference-reconstruction messages; the crucial date and the earlier-Order-in-Council qualification were confirmed on the rendered scan. The portal states Open Government Licence v3.0 except where otherwise stated.
- **United Nations**: the official four-page A/RES/67/19 PDF was read at its cover adoption date, page 2 recalled proclamation, and page 3 operative status paragraph. The UN Library's Israel and observer-state entries were separately read. Multiple UN presentations are not independent issuing authorities.
- **General Delegation of Palestine to Australia, New Zealand and the Pacific**: selected retrospective paragraphs were checked for the November 1988 declaration and 2012 status change. The broader political narrative and territorial assertions are not adopted as findings of this catalogue.

No full protected HTML, PDF, photograph, scan or transcript is redistributed. The repository retains metadata, source URLs, hashes and factual paraphrases only. Temporary fetched bodies, extracts and the rendered UK scan remain outside the repository in `/tmp/country-history-west/`.

## Access failures and clock distinctions

All research used the inherited HTTPS proxy and verified TLS. No credentials, alternate egress, bypass or unverified TLS were used. The fetch receipts distinguish actual response status from reading status. HTTP 200 is not a passage check:

- Several guessed legacy `gov.il` declaration paths returned a small not-found page with status 200; the Knesset route redirected to a geographic-unavailability page. These are not verified declaration editions.
- `docs.un.org` resolution/document requests returned 403; Digital Library search/record attempts returned empty 202 responses. The UN press release returned an HTTP 200 client challenge. These do not corroborate dates.
- A direct official `documents.un.org` PDF URL was accessible and its selected text was checked. It is an ordinary public UN repository, accessed through the same proxy and verified TLS.
- NARA's U.S.-recognition commentary uses “midnight” proclamation wording. The checked declaration transcription distinguishes issuance on May 14 from provisional authority at Mandate termination referring to May 15. The catalogue preserves the document's distinction and uses no clock from that retrospective narrative. NARA recognition material is discovery evidence, not an encoded source for the declaration's exact ceremony time.
- Failed original 1988 and 1949 document links remain visible in the source graph with `readingStatus: access-unavailable`, never counted as text read or independent corroboration.

The original-calendar strings preserve source-stated labels. Source-stated 5/6 Iyar labels are not a claim that the app reconstructed historical sunset boundaries. Modern IANA zones and rounded city coordinates are editorial geography: Philadelphia, Tel Aviv, Algiers and New York. They do not establish historical UTC offsets, capitals, legal borders, exact venues or timing. In particular, the 1949 UN city reference is **not** a coordinate for today's Manhattan headquarters.

## Evidence and checks

`docs/evidence/country-history/west/source-fetches.json` retains request URLs, access times, actual response status, successful body size/hash, and source-use assessment. `source-bindings.json` binds encoded source IDs to those receipts. A receipt authenticates the fetched bytes for this review, not the historical truth or future availability of the page.

`round1-data-check.json` records the executable schema/provenance check and the authored-file hash. Checked: unique event/source IDs; eight dates no later than 2026-10-30; three U.S. dates before 1900; all clocks null and date-only; valid finite reference coordinates and runtime-recognized IANA zones; complete citations, rights/reading status, source graph, and required claim type. No astronomy calculation, calendar conversion, exact event-time reconstruction or browser validation is claimed by this data-only check. Integration and the planned cross-review/held-candidate rounds belong to the parent ledger.

Unresolved: independent second institutional support for the July 2 resolution; accessible original A/RES/273 (III); original 1988 declaration collation and Algiers venue confirmation; any certified ceremony clock; universal recognition/legal-origin interpretations. None is silently promoted to verified scope.

## Round 2: independent cross-review

The east-source owner independently read the retained NARA, Yale, UK and UN passages, checked the eight-record source graph and matched all 13 successfully fetched encoded source bodies against their bindings. The two inaccessible encoded originals remain failures. No factual/date-only blocker was found. Requested wording refinements were applied: Philadelphia now names Congress and the Constitutional Convention; the 1949 UN display city expressly marks the venue unverified. Algiers likewise exposes its unverified-venue status in the location label. The time qualification now says that noon must not be treated as the historical event time; an explicitly disclosed, non-event civil-label reference can still be used by the shared interface.

This source owner independently cross-reviewed the east module's eight records and actual retained passages, including a visual check of the Persian constitutional date words. The Iranian two-day referendum and its selected closing day, the English/Persian label discrepancy, WIPO's attributed entry-into-force metadata and the distinct 1 April proclamation are preserved. India’s Article 394 distinction between provisions effective at once and the remaining provisions is correctly encoded. The Russian sovereignty declaration's renewed-USSR language is not conflated with later dissolution. No blocking source finding was identified within that scope. See `round2-east-cross-review.json` for exact file hashes, reading scope and limits; this is AI cross-review, not human historical or Persian-language certification.

The extra Palestinian-mission attachments were accessed during final discovery. The 2018 speech references the exact 29 November 2012 resolution date, but these extra files were not added to the encoded source graph. They did not resolve the Algiers venue gap. Their access receipts are retained without importing their political arguments or claiming a full-speech review. No new event date or exact clock was added in round 2.

A final source-metadata check removed an unverified sender/date attribution from the inaccessible A/43/827 node. Its title now gives only the document reference; no inaccessible letter metadata is treated as checked.

## Round 3: held integrated candidate

Accepted the frozen candidate within this source/data scope. The independent check JSON-roundtripped two integrated studies containing all eight west records; every projected record and every referenced historical source node exactly matched the reviewed authored data. All three U.S. records retained their source dates, unavailable coverage, null civil references, zero civil rows and zero house samples. No replacement date was introduced.

For the 14 May 1948 Israel declaration, the source clock remained null while an explicitly assumed local-noon civil-label reference and 25 assumed Regiomontanus samples were returned. Every sample identified itself as an assumption, retained the historical civil date and supplied the named convention. The declaration/legal-effect distinction, Palestine’s non-member observer State wording, both inaccessible original-source statuses and the unverified-venue qualifications survived serialization. Unknown records and arbitrary future-date arguments were rejected.

The immutable review receipt is `round3-held-candidate.json`; it binds the west source module, aggregate catalogue, core implementation, app and page before/after the check. West module SHA-256: `b04d3d8156b50b8ed4a02ea76ab42e7b189bd96662b8b8050689941c62c224a3`. No product file changed during the review. This was an export-shaped core-data check, not a browser download inspection, publication check, general calendar-accuracy validation or new source reading. The source limitations listed above remain unresolved and visible.
