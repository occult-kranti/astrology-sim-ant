# Newton chronology: selected primary-text findings

Source review dated 30 October 2026. The module `assets/js/core/data/newton-chronology-sources.js` records two conditional year calculations, four source-only textual issues, and four cited primary-text editions. It does not identify an actual future event date. The source work follows the [Newton Analysis–Synthesis skill](skill://user/6ab167744cd481919333118f9f25a3dc/newton-analysis-synthesis/SKILL.md) and its [research reference](skill://user/6ab167744cd481919333118f9f25a3dc/newton-analysis-synthesis/references/research.md).

The load-bearing finding is Newton’s own qualification: his 2060 calculation follows **if** a particular interpretation is dated from A.C. 800, and he allows a later end while rejecting an assertion of the actual end-time. A different manuscript contains a 2370 upper bound for a **different, 2300-year period**, together with incomplete and internally problematic lines. Correct arithmetic does not settle their theological premises or historical anchors.

## The inspected corpus

| Source ID | Primary text and exact scope | Edition and access limits |
|---|---|---|
| `NC-YAHUDA-7-3G` | *Fragments on the rise of the papacy and Revelation*, Yahuda Ms. 7.3g, **f. 13v, active paragraph 81, line anchors 1170–1180**; deleted paragraph 78 checked separately. | Newton Project [normalized](https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00437#par81) and [diplomatic](https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437#par81) transcriptions, catalogue `THEM00437`; manuscript custodian National Library of Israel. Catalogue dates the unit post-1700; an exact 1704 composition date is not asserted here. |
| `NC-YAHUDA-7-3O` | *Miscellaneous historical and apocalyptic jottings*, Yahuda Ms. 7.3o, **f. 8r, paragraphs 34–43**, especially propositions 2–6 and the three concluding lines. | Newton Project [normalized](https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00430#par34), [diplomatic](https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430#par34) and selected [TEI](https://www.newtonproject.ox.ac.uk/view/texts/xml/THEM00430) elements. The catalogue’s c.1675–80 unit label is not used as a precise date for each scrap: the same unit contains a reused notice dated 1716/17 on f. 7r. |
| `NC-OBS-1733-I-II` | *Observations upon the Prophecies of Daniel*, **Part I, Chapter II, printed pp. 16–23**, especially the political-world analogy at pp. 16–17 and days-for-years wording at pp. 21–22. | [Newton Project transcription `THEM00196`](https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196) of the London 1733 posthumous edition. Selected chapter passages read, not the whole book. |
| `NC-OBS-1733-I-VII` | Same work, **Part I, Chapter VII, printed pp. 74–83**, selected narrative of temporal-power stages, including p. 79’s 755, p. 80’s 773/774, and the 799/following-year sequence at pp. 82–83. | [Newton Project transcription `THEM00201`](https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00201). Historical stages in Newton’s attributed narrative; no new terminal-year calculation is inserted. |

Both electronic views of a manuscript are one source lineage. Related drafts by the same author are not independent empirical confirmation. No manuscript photograph or independent paleographical collation was acquired. Statements about deletion and addition follow the Newton Project’s explicit editorial markup, not a fresh decipherment of Newton’s handwriting. The selected 1733 passages are a posthumous publication and remain distinct from manuscript drafts.

## 2060: what the text actually calculates

The active f. 13v passage separates three steps that must remain separate in the application:

1. **Symbolic period:** three and a half times, 42 months, and 1260 days, using twelve months per year and thirty days per month. The arithmetic is `3.5 × 12 × 30 = 42 × 30 = 1260`.
2. **Interpretive mapping:** days of short-lived beasts stand for years of long-lived kingdoms. The arithmetic alone does not establish this theological day-for-year interpretation.
3. **Conditional historical anchor:** Newton dates the period from what he calls the complete conquest of three kings, A.C. 800. Under that interpretation, `800 + 1260 = 2060`.

His next sentence says, **“It may end later, but I see no reason for its ending sooner.”** He immediately explains that he is not asserting when the time of the end shall be; he is responding to repeated unsuccessful date-setting. The implemented scenario therefore labels 2060 a **conditional lower-bound argument**. It is neither an exact end-of-world date nor a demonstrated minimum lifetime of Earth.

The political and religious referent remains attached. In the 1733 interpretive dictionary Newton relates natural imagery to kingdoms and bodies politic, and explicitly discusses the beginning and end of a “world” in that figurative register. This does not supply an astronomical mechanism. It also does not authorize the application to collapse all of Newton’s eschatology into one identical event or to speak for all Christian traditions.

## The deleted-draft trap

Plain text extraction exposed a genuine risk. The diplomatic HTML contains two passages mentioning 2060:

- **Paragraph 78** says “period of 1260 years” inside `blockstrike-n`, explicitly titled **“This block of text has been deleted.”**
- **Active paragraph 81** says “period of 1260 days” in both diplomatic and normalized views, immediately after the explicit mapping of days to kingdom-years.

These are a deleted earlier draft and an active passage, not a disagreement between the two electronic views at the same active locus. An initial independent plain-text comparison conflated them; inspecting paragraph IDs and deletion attributes corrected that interpretation. The module preserves the source-state distinction and identifies the view used for each short quotation. It does not silently pool every visible number in a flattened transcription.

## 2370 and the unresolved f. 8r lines

| Text on f. 8r | What can be represented | What remains unresolved |
|---|---|---|
| The 2300-day period did not commence after the destruction of Jerusalem and the Temple, A.C. 70; the conclusion says the 2300 years end neither before 2132 nor after 2370. | `70 + 2300 = 2370`, as a **conditional upper bound for this 2300-year argument**. | The leaf’s first proposition names the rise of the little horn without a numeric commencement year. The 2132 lower bound is retained as written, without inventing a negative-year anchor or an ancient counting convention. |
| “The time times & half time do not end before 2060 nor after” | A literal unfinished line, corroborating the presence of 2060 in this draft. | The upper endpoint is blank. The application does not insert 2344 merely because a preceding proposition names 1084 and another period is 1260. |
| “The 1290 days do not begin before 2090 nor after 1374” | A literal **source-only, unresolved** line in both views and the TEI. | It says *begin*, not *end*; its not-before number exceeds its not-after number; and the nearby 842/1084 premises do not yield the written pair under ordinary addition. No verb, digit, ordering or proposed correction is silently substituted. |

The 2060 lower bound and 2370 upper bound concern different stated periods and referents. They are not combined into a “2060–2370 prediction window,” averaged, ranked, or treated as independent forecasts with measured accuracy.

The textual variants carry `calculationEligible: false` and null `anchor`, `resultYear`, `bound`, and `proposedRepair`. Their literal numbers remain visible as evidence. The two arithmetic scenarios are the only calculation-eligible records.

## 2016 and 2034: bounded negative finding

Neither 2016 nor 2034 was verified as a terminal year Newton actually wrote in the selected passages. The Newton Project search for 2016 returned many modern transcription/revision dates; these are not Newton’s predictions. The 2034 keyword query returned no result. This is a description of the performed search, not proof that no such material exists anywhere.

The inspected 1733 Chapter VII gives **755**, rather than 756, for one historical acquisition stage and **773/774** for another. It does not state terminal years 2016 or 2034 in those passages. Adding 1260 to a chosen historical stage would create a new modern reconstruction; it must not be presented as a newly discovered Newton statement or silently substituted for the complete-conquest anchor in f. 13v. This implementation consequently supplies no 2016 or 2034 scenario.

## Calendar precision and computational meaning

“A.C.” is retained as a CE year label for this arithmetic display. Both encoded additions remain in the CE era, so neither crosses a year zero. No month, day, calendar-reform conversion, historical time zone, observer or UTC instant is supplied by a year-only conclusion.

The thirty-day month and 360-day scheme are the passage’s symbolic convention. They are not asserted lengths of real lunar months, Gregorian years or tropical years. Multiplying the period by an astronomical year length, or mapping a whole CE year to a single Hebrew or Islamic date, would add premises absent from the selected text. A separate calendar explorer must require its own explicit civil date and assumptions; it cannot manufacture a historical event chart from 2060 or 2370.

The module’s `outcomePrediction: false` denotes the application’s claim boundary: it presents Newton’s conditional arguments without certifying their future occurrence. Arithmetic verification establishes only the addition under the stated premises.

## Acquisition, provenance and review

Nineteen bounded HTTP acquisitions are logged under `/workspace/analysis/newton-calendar/source-fetches.json`, with request/final URLs, timestamps, response hashes, actual reading status and source use. All requests used the inherited proxy and verified TLS. No browser, new sub-agent, authentication workaround or alternative network route was used.

Initial guessed text IDs were wrong: `THEM00051` exposed Yahuda Ms. 8 metadata; `THEM00057` was Yahuda Ms. 14; and `THEM00216` was Yahuda Ms. 9.1, not the 1733 book. Those receipts remain unused rather than being relabelled as the desired works. The first search used an ignored `query` parameter; inspecting the actual form established `keyword`, after which the genuine 2060 results identified `THEM00437` and `THEM00430`. Search hits and catalogue records are discovery/metadata evidence, not read manuscript passages.

Full fetched HTML/TEI and derived extracts remain outside the repository in the analysis folder. The module includes only source metadata, short quotations and original paraphrases. Newton’s historical words are public-domain material; the modern scholarly edition and its editorial apparatus retain their stated rights. A SHA-256 identifies retrieved bytes, not historical truth or correctness of a scholarly transcription.

**Round 1:** the source historian read the selected active/draft passages and reported the conditional 2060 argument, the separate 2370 bound, unresolved 2090/1374 wording, unfinished line and unverified 2016/2034 attributions before implementing the module. Independent QA read the retained excerpts and checked paragraph/deletion markup; the deleted-versus-active passage issue was corrected against the markup. No complete-book or manuscript-image review was claimed.

**Round 2:** the source historian independently inspected the implemented core and UI renderer, re-read retained manuscript loci, and executed one explicitly assumed modern frame. Eighteen checks passed. One minor source-contract defect remained: the core's project-method record `NC-CIVIL` lacked a literal citation. It was reported to the engine owner. The review accepted the separate directional arguments, null source dates and clocks, source-only unresolved variants, and active-versus-deleted distinction. It also recommended showing each quotation's editorial view and the historical anchor's meaning beside the sum. This was code and source review, not browser or visual validation. The receipt `/workspace/analysis/newton-calendar/source-round2-core-ui-review.json` binds source data `5616574d…`, core `99341d5e…`, and renderer `6e810a4e…`, with full hashes for six files.

**Round 3:** the separately held corrected candidate passed all 19 repeated checks and four additional candidate/context checks: **23 passed, zero failed**. The `NC-CIVIL` literal citation is present. The renderer now shows the quotation/transcription view and the conditional historical anchor's meaning beside the argument. No merged 2060–2370 interval, repaired manuscript result or inferred exact source day was found. After the final shared CSV serializer/context-row correction, all 23 checks were rerun within the same round. Six file hashes were stable during that execution, including unchanged source data `5616574d…`, final core `525601f4…`, renderer `71bb494d…` and page `a1ab7041…`. Full hashes, scope and results are retained in `/workspace/analysis/newton-calendar/source-round3-core-ui-review.json`; the earlier receipt remains saved as `source-round3-core-ui-review-superseded-pre-csv.json`. This acceptance is limited to source history, code inspection and bounded core execution; UI interactions, visual gap marks and atomic display acceptance belong to the separate browser review. No new source acquisition, manuscript-image reading or complete-book reading occurred in this round.

Independent QA of this authored source module and review of the cross-tradition comparison retain their own scopes and receipts.
