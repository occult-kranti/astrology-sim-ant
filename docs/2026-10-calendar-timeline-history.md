# Calendar timeline: historical reference dates

Reviewed on 30 October 2026. The twelve markers in `assets/js/core/data/timeline-history.js` identify selected past armistice, agreement and cooperation dates. Their sources establish the named historical acts, not future conflict, treaty success, auspiciousness or an association with astronomical conditions. The catalogue is an editorial convenience sample within 1900–2026; its actual selected dates run from 1918 to 1999.

The source contract follows the [Investigative Evidence Research evidence contract](skill://user/6acff19b52b08191aa90c8e4a3864634/investigative-evidence-research/references/evidence-contract.md). The finite question is: **which civil date and exact historical act do the accessed institutional passages support?** Signature, referendum approval, legal effect, ratification exchange and later implementation are separate propositions. A different date may describe another act; an inaccessible source or a transcription variant cannot silently resolve that difference.

## Date and source ledger

| Marker | Date and act supported | Evidence and qualification |
|---|---|---|
| Armistice with Germany | **1918-11-11**, effective day | Library of Congress June 28 historical account says the armistice went into effect on November 11. One retrospective institutional lineage. This is neither a treaty signature marker nor an end date for every conflict. |
| Treaty of Versailles | **1919-06-28**, signature | Same Library of Congress account explicitly dates signature. Its compressed phrase about formally ending World War I is not generalized into an entry-into-force claim. A primary treaty attestation was not read. |
| UN Charter | **1945-06-26**, signature | UN-hosted certified copy, PDF page 54, and NARA archival commentary identify the San Francisco signature. The certification paragraph was visually checked. Both presentations refer to the same signed original and count as one signature lineage. |
| UN Charter | **1945-10-24**, legal effect | State Department institutional history dates the UN's coming into existence; NARA identifies the ratification threshold on the same date. Neither establishes a universal peace outcome. |
| Simla Agreement | **1972-07-02**, signature | UNTS vol. 858, No. 12308, printed pp. 71–73 / PDF pp. 81–83. Article 5 requires exchanged ratifications; its footnote separately dates entry into force to 4 August 1972. Single accessible treaty lineage. |
| Egypt–Israel treaty | **1979-03-26**, signature | UNTS vol. 1138, No. 17855, printed p. 59 / PDF p. 77; State Department historical account; Yale transcription. UNTS gives Washington. The treaty copies share one lineage, while the diplomatic history is a separate institutional narrative. |
| Egypt–Israel treaty | **1979-04-25**, entry into force | Same UNTS record, printed p. 72 / PDF p. 90, footnote: exchange of ratifications at Om-Khosheib, Egypt. Visually checked. This exact effective day has one accessible registration lineage. |
| Israel–Jordan treaty | **1994-10-26**, signature | UNTS vol. 2042, No. 35325, printed pp. 351 and 403 / PDF pp. 375 and 427; Yale transcription. The official attestation names the Arava/Araba Crossing Point. Two hosts of the same treaty are one lineage. |
| Israel–Jordan treaty | **1994-11-10**, entry into force | UNTS registration metadata explicitly dates exchange of ratifications. The later **1998-11-11** UN registration is a different act. The signature venue is not reused as the exchange venue. |
| Belfast / Good Friday Agreement | **1998-04-10**, signature | Northern Ireland Office summary. The package includes the Multi-Party Agreement and British-Irish Agreement; country tags do not reduce the whole package to a bilateral act. Single accessible institutional summary. |
| Belfast Agreement | **1998-05-22**, voter approval | Same government summary. No vote totals, individual electoral returns or polling clock were acquired. |
| Belfast Agreement | **1999-12-02**, entry into force | Same government summary. The marker uses the source's package-level wording; no provision-by-provision implementation or full original treaty audit is claimed. |

`sourceIds` resolve to eleven source records. Each source has the institutional publisher, requested/final URL, selected passage locator, reading status, retrieval date, source family, SHA-256 receipt and limitations. Multiple institutional narratives are not independent eyewitness accounts; a second hosting location for one treaty is not a second original event record. `single-lineage` remains explicit for claims with only one accessible lineage.

The [claim ledger](evidence/calendar-timeline/history/claim-ledger.json) binds each marker to its precise date, act, sources and unsupported extensions. The [fetch manifest](evidence/calendar-timeline/history/source-fetches.json) includes all 25 bounded acquisition attempts, including unused and failed leads. It retains HTTP status separately from reading status. No successful response is treated as proof that a source was read.

## Clocks, places and calendar labels

Every marker has `datePrecision: day`, `time.status: date-only`, and null local clock, time zone and UTC instant. That means this dataset has **not verified or encoded** an event clock; it does not mean that historians cannot establish one. No midnight, noon, historical UTC offset or astronomical instant is invented. The use of `T12:00:00Z` inside date validation checks whether a Gregorian date label is valid; it is not stored or emitted as an event instant.

A timeline jump may retain a user's entered observer, clock and IANA zone for an explicitly assumed comparison sample. Those inputs must remain distinguishable from the sourced historical event. A chart at that sample is not an event chart and does not increase the source date's precision. None of the records has coordinates or a place-derived offset. Named cities and venues are source wording with an explicit precision label; unchecked venues remain unverified.

The Library of Congress November 11 page says the ceasefire was signed at 11 a.m.; signature and cessation are distinct. The catalogue does not adopt this clock wording. Its effective-day marker uses the separate June 28 account, and the unused November 11 passage remains in the acquisition manifest. IWM and NARA armistice link attempts failed. No claim is made that this bounded check settled the precise signature or cessation instant.

The Jordan treaty illustrates a real transcription disagreement. The Yale closing paragraph gives Hebrew year **5775** alongside Gregorian 26 October 1994. The official UN scan, visually checked at printed p. 403, gives **5755**. The source notes preserve both readings; the marker indexes the checked Gregorian day. The Hebrew and Islamic date labels in the official attestation are not presented as independently recalculated conversions or sunset-boundary determinations.

The Yale Egypt treaty page also contains an inconsistent 1973 heading. Its specific treaty heading gives 26 March 1979; the UN registration and State Department account agree with 1979. The stray heading is retained as a source limitation, not silently treated as evidence for a different treaty date.

## What was accessed

All HTTP requests used the inherited proxy and verified TLS under the managed environment's enforced unrestricted HTTP policy. No authentication, access restriction or TLS verification was bypassed. Source bodies and temporary text/page renders are retained in `/tmp/calendar-timeline-history/` for this review; only metadata, short extracts, paraphrases and receipts are retained in the worktree. Hashes identify the bytes retrieved, not the historical truth or future availability of a URL.

Named selected passages were read from the Library of Congress, National Archives, State Department, Yale Avalon and Northern Ireland Office pages. UN treaty volumes were downloaded and text-extracted, then only the named portions were read. The Jordan registration and attestation, UN Charter certification, Simla registration heading and Egypt entry-into-force footnote were additionally inspected as rendered images. No full-volume, whole-book, full multilingual-text or complete archival-collection reading is claimed.

The unsuccessful and unused leads matter:

- Two IWM armistice paths, the NARA armistice path and Yale Simla path returned 404.
- UN history, full-Charter and Peacemaker pages and the Irish government agreement page returned 403. No passages were read from those responses.
- One Indian ministry URL returned a matching title and navigation shell without treaty text; another redirected to an error page with HTTP 200. Neither corroborates the Simla record. The accessible UNTS text resolved the signature/effect distinction.
- A guessed per-document Egypt UNTS URL redirected to a not-found page with HTTP 200. The accessible full vol. 1138 identifies the correct entry as No. 17855 and notes the separate Egyptian registration No. 17813 in vol. 1136.
- The Belfast PDF attachment was fetched, but text extraction was empty and its treaty text was **not read**. Only the government HTML summary supports the three Belfast markers in this release.
- The State Department Versailles narrative was read for context but did not supply an exact signature day in the inspected passages; it does not inflate exact-day corroboration.

Publication or maintenance dates were not established for every source and remain null. The event date, source publication date, UN registration date and retrieval timestamp are separate fields or explicit notes. Retrieval occurred on 30 October 2026; no source event date is in the future relative to that cutoff.

## Coverage and inference limits

The country tags are navigation aids and omit some multilateral parties. UN milestones use an empty country list with multilateral scope; this avoids substituting a modern state for a historical signatory such as the USSR. There is no guarantee of an event for every country in the existing country-history page, every year, or every region. The catalogue is concentrated on Europe, South Asia, the Middle East and UN cooperation. Absence of a marker is not evidence of peace or war.

No conflict database, comparison cohort, non-event denominator, outcome labels, exposure definition, statistical association or causal model was built. Event dates were selected for documented legal and diplomatic distinctions, not for a chart pattern. Displaying them beside calendar or astronomical values does not establish correlation, prediction or astrological validity. Treaty names and declared purposes do not show that every provision was implemented or that violence ended permanently.

Future conflict forecasts, military timing criteria, probability claims and country rankings are outside this catalogue. Historical references remain source-only context for the timeline and contribute no study score.

## Three review rounds

**Round 1 — source reconstruction and owner data check.** The owner acquired and read the specified passages and scanned-page selections. A fresh reviewing agent received raw LOC, GOV.UK and Yale pages before the drafted module and independently reconstructed the dates/actions. It identified the Jordan Hebrew-year transcription variant and emphasized the signature/effect distinction. The owner separately located and visually checked the official UN attestation. The executable [data check](evidence/calendar-timeline/history/round1-data-check.json) verified twelve chronological past dates, eleven resolvable source records, recursive immutability, null event clocks and coordinates, separate paired signature/effect dates, and matching hashes for all eleven retained source bodies. It did not test astronomy or the browser.

**Round 2 — independent module and passage challenge.** The reviewer examined all twelve authored records, the selected Simla registration image and Egypt entry-into-force footnote, source-family distinctions and unknown-clock handling. It found one metadata correction: the Belfast package should be `multi-party`, not `bilateral`. That correction was applied to all three Belfast markers. The source owner also independently checked the task-card method/source boundary against the inherited Agrippa/Lilly receipt and existing ranking code; no new historical-work retrieval or full-book reading was claimed.

**Round 3 — held final catalogue.** The independent reviewer passed ten history/held-file assertions within a combined 28-check review. All twelve records and eleven sources survived JSON serialization with day precision, unresolved clocks, null coordinates, source references and limits intact. All three Belfast records retained multi-party scope; the two UN signature presentations counted as one original lineage; Jordan’s transcription variant remained visible. No historical object acquired a score, forecast, rank or chart field. The [held-catalogue receipt](evidence/calendar-timeline/history/round3-held-catalogue.json) binds the unchanged module SHA-256 `1828e00a160513f767bf49b37c1301679f46b18bb2592193f86416184ac4b7a1`. This was catalogue serialization, not a browser download inspection: calculated timeline frame exports deliberately exclude historical records. Browser history jumps and downloaded-frame assumptions belong to the parent integration review.
