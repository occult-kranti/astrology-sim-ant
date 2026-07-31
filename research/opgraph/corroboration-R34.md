# R34 — corroboration round: second witnesses for the 115 single-witness nodes

**Date:** 2026-07-30
**Machine-readable companion:** `research/opgraph/corroboration-R34.json`
**Status: PROPOSAL. Nothing in this round has been applied.** No slice file was edited, no `meta.sources` entry was added, no node's `cite` array was touched, no weight was recomputed. A human applies the JSON to the slices and the artery regenerates. Until that happens all 115 nodes still carry one witness each.

---

## 1. The result, without softening

**Eighty-one of the 115 single-witness nodes now have a second witness that survived adversarial verification.** That is the number. It is higher than a 70% pass rate on a task this brittle has any right to be, and it is also the least informative number in this report, because three things deflate it hard:

1. **Twenty-two of the 81 rest on one book** — Goudriaan & Gupta, *Hindu Tantric and Śākta Literature* (1981) — **which slice 10 already carried as S20**, flagged there as "accessed: partial". For those nodes the honest description is not "a second witness was found" but "a source the slice already held was finally read at page level". The witness-count arithmetic still moves, because S20 was not on those nodes' `cite` arrays. The *diversity* gain is one book. The same pattern, smaller, appears in slice 13: three acceptances use *The Taoist Canon*, already entry #13 in that slice's source list.
2. **Fifty-four of the 81 required their citation corrected by the verifier.** Wrong page, wrong chapter, wrong folio, wrong date, wrong edition, or — twice — an attribution that inverted who actually said the thing. This is a hard count (entries where the adversarial pass returned a `correctedCite`), not an impression. Had the finder output been applied directly, the graph would have gained 54 citations a reader could not follow to the stated place, several of which would have read as fabrications on inspection.
3. **Fifty-five of the 81 are accepted for a claim narrower than the node states**, or arrive attached to a correction or a live contest the graph must record beside them. (That count is my classification from the verdict reasoning; a maintainer could score it a few either way.) One case is starker than "narrower": on `proc:tan-saradatilaka-1` the witness was accepted and the node's headline claim was rejected in the same verdict.

So the round's output is not 81 clean corroborations. It is **81 witness-count increments of uneven quality, drawn from 28 distinct sources (26 new, 2 the slices already held), one caught fabrication, and a long list of things the slices currently assert that are wrong.** The corrections may be worth more than the corroborations.

---

## 2. Counts

| | in scope | attempted | **accepted** | rejected (adversarial) | confirmed absence (finder) | not adjudicated |
|---|---|---|---|---|---|---|
| 10-indian-tantra | 39 | 39 | **27** | 4 | 8 | 0 |
| 12-solomonic-western | 35 | 35 | **23** | 1 | 10 | 1 |
| 13-east-asian | 20 | 20 | **18** | 1 | 1 | 0 |
| 11-greco-egyptian | 17 | 17 | **10** | 1 | 6 | 0 |
| 14-abrahamic-esoteric | 4 | 4 | **3** | 1 | 0 | 0 |
| **total** | **115** | **115** | **81** | **8** | **25** | **1** |

81 + 8 + 25 + 1 = 115. Every row reconciles.

### Never attempted: zero, per slice

All five finder agents returned `notAttempted: []`, and their `attempted` counts sum to exactly 115. **No node in scope went untouched.** That is a real finding and the one unambiguously good number here: the 34 nodes that did not gain a witness failed on evidence or access, not on coverage.

One gap is in the *verification* stage, not the finder stage, and it is recorded rather than quietly absorbed: **`proc:gw-weyer-pseudomonarchia-1` (12-solomonic-western) was proposed by the finder and never adjudicated.** No verdict was returned for it. It is excluded from the 81 and must not be applied on the strength of this file. Its source (Nicholson 1886) was independently verified for two sibling nodes in the same slice, so it will probably survive — but "probably" is exactly what the two-stage process exists to refuse. Send it back through.

---

## 3. Rejections, grouped by kind

**Adversarial-pass rejections: 8.**

| kind | count | nodes |
|---|---|---|
| does-not-exist | **0** | — |
| does-not-say-it | **5** | `proc:tan-kularnavatantra-4`, `proc:tan-nityotsava-3`, `proc:tan-saundaryalahari-3`, `proc:ea-daofa-huiyuan-4`, `proc:jew-hayyei-haolam-haba-3` |
| not-independent | **2** | `proc:tan-atharvaveda-saunaka-2`, `proc:gw-dee-spiritual-diaries-4` |
| unverifiable | **1** | `proc:gem-pdm-xiv-3` |

Zero in the does-not-exist column is worth stating plainly: **every source proposed in this round is a real source.** No finder invented a book. The failures were of a different kind.

**does-not-say-it (5)** is the dominant failure and it has one shape: the source says something *adjacent* to the node's claim and the finder let adjacency stand for support. Two are worth naming because they invert the node:

- `proc:jew-hayyei-haolam-haba-3` — the node says Abulafia's circle-diagrams *are* the meditative apparatus. Judah Ḥayyat (Mantua, 1558) says the circles exist "so as to confuse those who look at it". That is concealment, the opposite claim. Kaplan's own note adds that it is "**one** manuscript" written in circles, which cuts against the node's completeness grade as well. Real, independent, and evidence for the other side.
- `proc:ea-daofa-huiyuan-4` — a tertiary contents-list names a *neilian* text inside DZ 1220. The node claims *neilian* is the inner engine the outer rite is held to depend on. A nine-item table of contents attests none of that, and being tertiary it would have *lowered* the node's weight in exchange for half-support.

**not-independent (2)** are both the textbook disqualifier — a later scholar quoting the first witness as her own authority — and both were caught by reading footnotes rather than trusting the finder's independence argument. Harkness's notes 110–112 on the Sigillum Dei passage read `Dee, AWS II:83 … Ibid.` where AWS is her abbreviation for Whitby's edition, which *is* the existing witness. Whitney & Lanman fails twice over: it is already in the node's own `editions` array, and its Kauśika data comes from Bloomfield 1890, the existing witness.

**unverifiable (1)** is the serious one and the reason this pipeline needs its second stage. On `proc:gem-pdm-xiv-3` the finder placed a sentence in quotation marks, attributed it to a named review, and it is not in that review — a paraphrase presented as a quotation, with the subject "PGM XIV" and the words "or translations" silently added. The cite was a whole 400-page monograph with no page number, and the finder stated outright that the book was not read. A reader following that locator would have found nothing. **This is the exact failure mode the brief names as worse than no citation, and it got within one review of being shipped.** Dieleman 2005 is a genuinely promising witness for that node; it must be re-proposed by someone who has read a page of it.

---

## 4. Confirmed absences: 25

These are attempted-and-not-found at the finder stage. They are recorded as results, not failures.

| kind | count | where |
|---|---|---|
| does-not-say-it (candidates checked; they describe something else) | 8 | 10-indian-tantra ×6, 13-east-asian ×1, 11-greco-egyptian ×1 |
| unverifiable (candidate exists, could not be read: CDL, paywall, 403, corrupt OCR) | 10 | 12-solomonic-western ×9, 10-indian-tantra ×1 |
| not-independent (every candidate *is* the first witness — translation, reprint, edition of it, or downstream of it) | 6 | 11-greco-egyptian ×5, 12-solomonic-western ×1 |
| declined by design (blacklisted cross-reference row) | 1 | `proc:gw-picatrix-4` |

Several absences are *informative* rather than merely empty, and the slices should record them as weak counter-evidence:

- G&G's independent chapter survey of the Kulārṇava positively describes ullāsa XVII as "the mystical meaning of important terms" — not guru-*dhyāna*. The node asserts a visualization procedure there.
- G&G's five-chapter survey of the Nityāṣoḍaśikārṇava contains no *dīkṣā* at all.
- Four scholars who work the Īśānaśivagurudevapaddhati in detail cite its *sāmānya-*, *mantra-* and *kriyāpādas* and never its *yogapāda*.
- `proc:gem-pgm-i-2` may be a data problem, not a gap: the one page fetched that prints the Pnouthis rite contains no purity instruction at all, and the node's purity claim is admittedly imported by analogy from PGM IV as "the corpus norm" and marked unverified.

Two deliberate non-verifications deserve credit rather than criticism, because both are the discipline working: the Trivandrum Sanskrit Series *Īśānaśivagurudevapaddhati* was not opened (Devanāgarī OCR that could not be reliably checked — "a mis-read locus is worse than none"), and `proc:gw-picatrix-4` was left alone rather than have a new elections source smuggled into a row the slice has deliberately fenced off.

---

## 5. Which slices are weakest, and why

**Weakest by rate: `11-greco-egyptian`, 10 of 17 (59%). The honest reason is structural, not effort.** Four of its six absences are the Proclus cluster (`theu:proclus-hieratic-art` plus its three procedure rows), and that cluster is close to uncorroborable at this level of access. *On the Hieratic Art* survives as one short text. Bidez's Greek (1928) and Pachoumi's 2024 critical edition are **both already S23**; Ficino's Latin, Taylor 1895 and Copenhaver 1988 are translations of the same text and are excluded by the brief's own Mathers/Clavicula rule — one witness, not four. A qualifying witness has to be another scholar's independent examination, and every route to the obvious candidate (Sheppard, *CQ* 32 (1982) 212–224) was paywalled. Asking a future round to "try harder" on these four will not help; asking it for library access will. This slice also produced the round's only fabrication.

**Weakest by shape: `12-solomonic-western`, 23 of 35 (66%).** The rate is unremarkable; the *distribution* is the problem. Its ten absences are almost exactly the printed Solomonic core — Key of Solomon ×5, Heptameron ×2, Grimorium Verum ×2 — and they share a single blocker: **Owen Davies, *Grimoires: A History of Magic Books* (OUP, 2009) covers every one of them, and the only Internet Archive copy is under controlled digital lending returning "Item not available".** That is a library-access failure, not a scholarship failure; one interlibrary loan is the highest-yield unblock available. The second reason is worse and not fixable by access: the existing witness for those rows is Peterson's esotericarchives.com, and most of what the open web says about these texts is visibly downstream of Peterson. **The candidate pool is contaminated by the first witness.**

**Highest raw yield, worst concentration: `10-indian-tantra`, 27 of 39 (69%) — from two volumes.** Twenty-two acceptances are Goudriaan & Gupta 1981; five are two chapters of one 2003 Brill volume. Per node the independence is genuine (different editions, different manuscripts, different scholars from each node's existing witness). Across the slice it means one book now stands behind more than half the slice's corroborated nodes, and it is a book the slice already listed. If S20 is deemed "already present", 22 of these gain a page-level locator rather than a new witness — a judgement the maintainer must make explicitly rather than inherit silently.

**Thinnest evidence per witness: `14-abrahamic-esoteric`, 3 of 4.** The rate looks fine; n = 4. Two of the three lean on Aryeh Kaplan (1982), a devotional popularizer with heavy bracketed interpolation and no critical apparatus, tiered "primary" generously because he at least names his exemplar (JTS Ms. 2158). The third has **no printed page number at all** — the Posen Library entry does not paginate. This slice has the least evidence standing behind each accepted witness.

**Strongest: `13-east-asian`, 18 of 20 (90%) — and it is an access accident, not a method success.** Open-access dissertations (Goodman 2013, Liu 2020) and searchable out-of-print reference works (Needham, *The Taoist Canon*) happened to cover exactly these nodes. Sixteen of its 18 acceptances still needed a corrected citation, including one that would have attributed a passage written about a *Buddhist* liturgy to a *Daoist* manual.

---

## 6. Concentration risk across the whole round

81 acceptances stand on **28 distinct sources** — 26 new plus 2 the slices already held — and **two of them carry 30 of the 81**:

| source | nodes | slice |
|---|---|---|
| Goudriaan & Gupta 1981 (**= existing S20**) | 22 | 10 |
| Klaassen, *The Transformations of Magic* (2013) | 8 | 12 |
| Bühnemann (ed.), *Maṇḍalas and Yantras* (2003) — Törzsök ch. 2 + Bühnemann ch. 3 | 5 | 10 |
| Goodman diss. (2013) | 4 | 13 |
| Liu diss. (2020) | 4 | 13 |
| Láng, *Unlocked Books* (2008) | 4 | 12 |
| Chandler, *Culture and Cosmos* (2015) | 4 | 11 |
| Kambitsis, *BIFAO* 76 (1976) | 3 | 11 |
| *The Taoist Canon* (**already in the slice's source list**) | 3 | 13 |
| Needham & Lu, *SCC* V:5 (1983) | 2 | 13 |
| Mei, *Religions* 16 (2025) | 2 | 13 |
| Skinner & Rankine (2007) | 2 | 12 |
| Nicholson (1886) | 2 | 12 |
| Harkness (1999) | 2 | 12 |
| Bortolani (2016) | 2 | 11 |
| (twelve more, one node each) | 12 | — |

(22 + 8 + 5 + 4 + 4 + 4 + 4 + 3 + 3 + 2 + 2 + 2 + 2 + 2 + 2 + 12 = 81.)

Two consequences the weight rubric cannot see on its own and the maintainer should:

- **Three sets of nodes now share a single passage as their second witness.** `proc:gw-picatrix-1/-2/-3` all rest on the same two pages of Láng. `proc:ea-tuoluoni-jijing-2` and `-4` rest on one and the same Goodman footnote. `proc:tan-saundaryalahari-1` and `-2` both lean on one illustration caption (a third node making the same move was rejected for exactly that reason). Legitimate per node; not independent confirmations of a work's overall procedural completeness.
- **Two acceptances share a scholar with their own existing witness.** `proc:ea-wushang-huanglu-dazhai-lichengyi-5`'s second witness is a Liu footnote whose load-bearing authority is John Lagerwey — who also wrote the *Licheng yi* entry in *The Taoist Canon*, the node's first witness. Not the barred case (different study, different subject, and Liu's anchor is the manual's own wording), but exactly the overlap the rubric is meant to price. Similarly `proc:tan-nisvasatattvasamhita-4/-5`: both witnesses examine the *same sole Nepalese manuscript*, so they corroborate the reading, not the transmission.

---

## 7. What a human must do to apply this

The JSON is a proposal. Applying it is not mechanical.

1. **Two slices have no source-keying scheme at all.** `13-east-asian.json` (32 sources) and `14-abrahamic-esoteric.json` (24 sources) store `meta.sources` as unkeyed arrays of plain strings; their nodes carry free-text `citation`/`cite` fields. There is no S-number to allocate. The JSON supplies **provisional** ids (S33–S39, S25–S27) that assume keys are introduced in array order; if they are not, the cite string goes into the node's free-text field instead. **Do not ship the provisional ids as if they were real keys.**
2. **Next free keys, verified from the files:** slice 10 → **S27** (existing S1–S26); slice 11 → **S28** (existing S1–S27); slice 12 → **S19** (existing S1–S18).
3. **Three proposals reuse an existing source and need no new key:** S20 in slice 10 (22 nodes) and *The Taoist Canon* in slice 13 (3 nodes). Add them to the nodes' cite arrays; do not duplicate the source entry.
4. **Node-id mapping is required before application.** The Dee rows are filed against `proc:gw-dee-spiritual-diaries-*`; the slice's work node is `gw:dee-angelic-diaries`.
5. **Two cite strings are accepted only *as reformulated*.** `proc:ea-tuoluoni-jijing-4` must record Goodman as the consulted witness and Davidson as quoted-through — nobody opened the De Gruyter chapter. Shipping it the other way round would put a peer-reviewed chapter in the graph as directly consulted when it is a second-hand quotation.
6. **Razor warnings ride with four entries.** Törzsök's maṇḍala reconstruction, Bühnemann's Illustration 4 caption, Chandler's Table 2 (voces magicae in the clear, which slice 11's `framingLock` forbids) and Mei's §2.3 (second-person posture-and-breath instructions) all contain operative content. **Cite the passage; never transcribe it.**
7. **Every `scopeLimit` field in the JSON is load-bearing.** They record what the witness does *not* corroborate. Applying a witness without its scope limit converts an honest partial corroboration into a false full one.

---

## 8. Corrections the slices should absorb regardless of the witness count

These came free and several are worth more than the corroborations. Full list in the JSON under `freeCorrectionsHarvestedThisRound`; the load-bearing ones:

- **Slice 13 is wrong twice in one sentence.** It states that Wilhelm translated "an eight-chapter edition of 1834" of the *Taiyi jinhua zongzhi*. Esposito 1998 p.90: Wilhelm used Dan Ranhui's **1921** edition; the 1834 *Daozang xubian* text is Min Yide's Longmen version and is in **13** chapters.
- **Slice 12's Scot row is probably mis-described.** Nicholson 1886 concludes from his own collation that Scot did *not* translate Weyer directly but used a 1570 English manuscript translation marked "the work of one T. R." Reword `proc:gw-scot-discoverie-1` and revisit edge E-TR-01.
- **`proc:gw-liber-juratus-5` currently rests on Peterson's modern parodic copyright notice** — his editorial text, cite-only under the R33 licensing ruling, and not evidence about the fourteenth-century book. Replace it with the transmission oath reported from the text's own prologue.
- **`gw:clm-849` unblocks a voided grade.** Kieckhefer's contents description of Clm 849 is the exact evidence the R33 audit named as the blocker for the VOIDED completeness grade on `proc:gw-clm-849-1`.
- **New discrepancies to OPEN, not close:** Kṛṣṇānanda's date (G&G argue 17th c. against the slice's late 16th); the Kulārṇava purification locus; the Śrīcakra construction locus; the *Dīpikā*'s date (G&G's late-12th/early-13th vs Padoux's 13th–14th); and the pseudo-Agrippa imprint (VD16 records *s.l.* and judges it "wohl kein deutscher Druck", undercutting the flat "Marburg, 1559").
- **`gw:grimoire-pape-honorius`'s "Rome, 1670" is now unsupported by anything verified this round** and may be a transposition of the 1760 title-page imprint. Re-check it against whatever S18 drew it from.
- Two flags close cleanly: the Yoginīhṛdaya *mantrasaṃketa* arthas resolve at **six**; and the *Nityotsava* author flag dissolves — Umānandanātha is the religious name of Jagannātha — with the date corrected to **A.D. 1775**, filed against the work node, not the procedure row that was rejected.

---

## 9. Where the next round should spend its effort

Ranked by nodes unblocked per unit of access, from the recorded blockers:

1. **Owen Davies, *Grimoires* (OUP, 2009)** — 9 nodes in slice 12. Blocked only by controlled digital lending. Highest-yield single unblock in the round.
2. **Sanderson, "The Śaiva Literature", *JIS* 24–25 (2014)** — 4 nodes in slice 10 (Netratantra ×2, Svacchandatantra ×2). academia.edu only.
3. **Sheppard, *CQ* 32 (1982) 212–224** — the entire Proclus cluster, 4 nodes in slice 11. Cambridge Core paywall.
4. **Dieleman 2005 read at page level** — 1 node, and the one that needs redoing properly rather than searching harder.
5. Swanson 2018 (1 node); Brooks 1992 (1 node); Halleux's P.Leid. X or the RMO record fetched with a real browser (1 node); Boudet & Véronèse on the *Clavicula* (alongside Davies).

**Six of the eight are library-access problems, not research problems.** That is the most actionable sentence in this report. A round with institutional access would likely close 15–18 of the 34 remaining nodes; another round of open-web searching would close very few, and would be under pressure to pad.

---

## 10. Method note, so a verifier can check this

Both stages ran per-slice: a finder agent proposing witnesses, then an adversarial agent that checked existence, whether the source says the thing, and independence, and returned a verdict per proposal. The adversarial pass did real work — it downloaded full OCR text, resolved printed page numbers from running heads, read footnotes to test independence claims, and matched quoted strings character by character. It corrected 54 of 81 citations, rejected 8 proposals, caught 1 fabricated quotation, and reversed the finder's reasoning on at least four occasions (including two where the finder's evidence, quoted whole, argued *against* the slice's position).

The count of 115 is the sum of the five finders' `attempted` figures, all of which reported `notAttempted: []`. The 81/8/25/1 split reconciles to 115 exactly and is asserted by machine check in the build of the companion JSON, not by hand.

**Nothing here has been applied.** A human applies `corroboration-R34.json` to the slices; the artery regenerates from the slices. This round edited no graph data.
