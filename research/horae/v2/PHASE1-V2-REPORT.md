# HORAE MUNDI — PHASE 1 (ROUND 2) INTEGRATION REPORT

**Four dossiers commissioned under the split-role protocol. Four adversarially audited. `overallUsable: true` on all four — and none is READY.**

Date: 2026-08-01. Scope: `research/horae/v2/` only. Nothing under `assets/` or `pages/` was touched and nothing should be until the rulings in §9 are made.

Round 1 produced six dossiers, all unusable, and a diagnosis: one agent both searched and wrote, so a citation read off a fetched page and one recalled from training data were indistinguishable in the output. `docs/plans/horae/RESEARCH-PROTOCOL.md` split the roles to fix it. This report measures whether that worked, and it puts the measurement first because that is the only reason the round was run.

---

## 1. THE MEASUREMENT, STATED FIRST

| | Round 1 | Round 2 |
|---|---|---|
| verdicts | 132 | **137** |
| rejected | 55 (41.7%) | **34 (24.8%)** |
| fabrication-class | 28 (**21.2%**) | **22 (16.1%)** |
| systems | 6 | 4 |

**The fix worked.** Not "the number went down a bit" — the specific mechanism the split was built to close is closed, and the headline number understates that rather than overstating it.

Round 1's 28 fabrication-class findings were **15 `fabricated-citation` + 13 `invented-attribution`**: quoted strings, page numbers and attributions with no fetched source behind them. Round 2 contains, across 137 verdicts:

- **zero `fabricated-citation`**;
- **exactly one `invented-attribution`** — and it is not an attribution to a *source*. It is the shichen dossier attributing to the maintainer a ruling that Tong Shu material must be labelled Tier C. No such ruling exists in `RESEARCH-PROTOCOL.md §5` or `docs/plans/LOOP.md H2`, both of which rule only on ruler columns. That is the one channel the fetcher/compiler split does not cover: the split governs claims about *sources*, and this was a claim about the *brief*.

I re-ran the structural check myself rather than trusting four self-reports. Across the four compiled files there are **388 ledger snippets and zero dangling snippet references**:

| file | ledger snippets | dangling refs | never cited outside the ledger | cited in `entries`/`variants`/`goldenValues` |
|---|---|---|---|---|
| `zmanim.json` | 103 | **0** | 0 | 92 |
| `vedic-hora-choghadiya.json` | 99 | **0** | 6 | 57 |
| `shichen.json` | 108 | **0** | 0 | 107 |
| `egyptian.json` | 78 | **0** | 2 | 51 |

`node scripts/research-validate.mjs --dir research/horae/v2 --strict` → **`4 file(s) · 0 violation(s)`, exit 0** (run 2026-08-01 with the project's conda Node).

Two further round-1 failure classes are effectively gone:

- **Fabricated confirmed gaps.** Round 1: three of six dossiers asserted "nothing attests this" without having looked. Round 2: **38 gaps, every one carrying `searchedWhere` and `searchTermsUsed`, and not one asserted without a search.** Four gaps were rejected — all four for *scope or wording* on a gap that did do the searching. Where no search was made, the field says so in words (`"(NONE AT FETCH TIME — the fetcher states plainly that it did not search for a ruler and makes no gap claim)"`) and the confidence drops to `could-not-determine`. The shichen ruler gap is the clearest single sign the discipline is real: the dossier empties the ruler column on the maintainer's authority and **refuses** to call the absence confirmed, because its fetcher never looked.
- **Field contradicting prose (C4).** Round 1: four of six dossiers. Round 2: the validator reports zero violations, and the residual C4-shaped findings number four, all label-level (a `sourceRefs` array wider than its own parenthetical; a hedge flattened to `benefic`; a `quality` string reading "two witnesses agree" where both witnesses are Budge; one gap field scoped wider than its prose).

---

## 2. WHY THIS IS INDICATIVE AND NOT A CLEAN A/B — three reasons, all of which cut against the flattering reading

**2.1 The denominator changed, and it changed in round 2's favour.** Four systems, not six. **Babylonian and materials were not re-run at all** — and those two held round 1's *only two BLOCKED verdicts* (`babylonian maṣṣartu`, `materials — Picatrix column`). The two worst dossiers are simply absent from the round-2 denominator. A rate computed without them is not comparable to a rate computed with them, and the direction of the bias is downward. Nothing in this round licenses a claim about Babylonian or materials.

**2.2 The four adversaries did not apply one definition of "fabrication-class."** I reconciled each `fabricationCount` against its own verdict list:

| system | rejections | `fabricationCount` | what the adversary excluded |
|---|---|---|---|
| zmanim | 9 | 7 | 2 × `verbatim-copyright` |
| vedic | 6 | 4 | 2, rule not stated |
| shichen | 7 | 5 | 2 × `merged-conflict` |
| egyptian | 12 | 6 | 2 × `tier-inflation`, 2 × `unverifiable`, 1 labelling-only, 1 non-sid bookkeeping |

**22 is the sum of four differently-drawn lines**, not a recount of round 1's 28 under a single rule. On the widest reading (all rejections) the rate is 24.8%; on the narrowest (only findings the adversary judged provenance failures) it is 16.1%. Both are honest; neither is like-for-like with 21.2%.

**2.3 The taxonomy changed underneath the number.** Round 2's dominant failure kind — **`snippet-does-not-support`, 17 of 34 rejections (50%), present in all four systems** — has no round-1 counterpart, *because round 1 had no snippets*. A category that could not exist before the protocol change now accounts for half of all rejections. Comparing a rate computed over one taxonomy with a rate computed over another is the kind of thing this report exists to refuse.

(Note for the record: the baseline itself has two published values. `RESEARCH-PROTOCOL.md §1` gives 15 + 13 = 28 "re-derived from the run's own journal"; `research/horae/PHASE1-REPORT.md §0` gives ~14 + ~12 ≈ 26. The protocol's figure is the one used here.)

---

## 3. THE RESIDUAL FAILURE, NAMED — and it is one line from being closed

The split closed *"a citation from memory."* It opened *"the fetcher's `locus` annotation treated as evidence."*

The fetcher returns, per snippet, a verbatim `snippet` **and** a `locus` note in its own voice ("preceded by 如巳正二刻至午初二刻屬丙方"; "the sentence continues to the 17th century"; "night entries are ~48 min"). The compiler may cite only ledger sids — and it does, cleanly, in all four files. But a sid resolves to a *record*, and the record contains both the evidence and the annotation. Nothing distinguishes them at the point of citation.

The zmanim adversary names the mechanism exactly: **LOCUS IS NOT EVIDENCE.** Seven zmanim claims rest on it (the Prague 48→69 and Israel 36→42 figures and both percentages; Gewirtz's "until the 17th century"; Notis's 22.5-minute mil and 16⅞-minute nightfall; MyZmanim's "2 mil = 36 minutes"; the Jewish Encyclopedia's "lat. 32° N"). Shichen's Advisory 7 names six more, one of them presented as a quotation. Vedic's V1 promotes a locus gloss ("a naming layer distinct from the planetary rulers") into an attributed assertion carrying the word "explicitly", and GV4 splices a next-sunrise value in from a *different source record* to reach 47.583 minutes. Egyptian's failures are the sibling form — a real snippet asked to carry more than it says: `S8-a` says "the day in Egypt" and the dossier writes "the Egyptian **civil** day"; `S8-f`/`S10-c` establish one scale *per month* and the dossier writes "cut for one **place**".

**This is not fabrication.** In every case the fetcher demonstrably read the page. But `locus` is a *locator*, and letting it carry numeric and dated claims reopens the exact channel the split exists to close — a claim that survives spot-checking while its warrant rots underneath it.

Three dossiers already model the correct alternative in place: zmanim flags the 24-minute mil (S22-d) and the Rabbeinu Tam attribution (S15-a/b) as locus-only *at the point of use*; shichen carries every one of ten derived clock ranges in a differently-named field, `clockRangeDerived`, so a renderer cannot mistake them; vedic quarantines all five of its closed-form Choghadiya rules behind an explicit `warning` field. The behaviour is available. It is not yet the default, and the protocol does not require it. **Ruling requested at §9 Q1.**

---

## 4. PER-SYSTEM VERDICTS

| # | System | File | Verdict |
|---|---|---|---|
| 1 | Jewish sha'ot zemaniyot | `zmanim.json` | **NEEDS-REWORK** (moderate — one copyright item must clear before any prose ships) |
| 2 | Vedic horā | `vedic-hora-choghadiya.json` | **NEEDS-REWORK** (light) |
| 3 | Choghadiya | `vedic-hora-choghadiya.json` | **NEEDS-REWORK** (light — provenance labelling only; the data is the best-verified in the round) |
| 4 | Chinese shichen | `shichen.json` | **NEEDS-REWORK** (moderate — one top-level field merges a live conflict) |
| 5 | Egyptian — Amduat / Budge name layer | `egyptian.json` | **NEEDS-REWORK** (light) |
| 6 | **Egyptian — hour arithmetic / any hour clock** | `egyptian.json` | **BLOCKED** — no reproducible golden value and a confirmed gap where the division rule would be |

Nothing is READY. Row 6 is the only BLOCKED verdict and it is a *narrower* block than round 1's two: it forbids building an Egyptian hour engine, not publishing the Egyptian material.

---

### 4.1 Jewish sha'ot zemaniyot — NEEDS-REWORK

**26 verdicts, 17 accepted, 9 rejected, 7 fabrication-class.** The single largest quality jump in the round: round 1's load-bearing blocker was a *false gap* on Beur HaGra (Sefaria spells it "Beur", not "Biur"); round 2 retrieved the ref, found the comment is about *bein ha-shmashot* rather than the endpoints, and refused to let a real retrieval bleed into an unrelated proposition. That is the discipline the split was built for, doing exactly its job.

**Ruler column: FALSE.** Verified mechanically — 0 of 12 entries carry a `ruler` key, and no `associations` key is a ruler under another name. Justification is *not* an argument from silence: the ledger contains a genuine seven-planet hour rotation over the same twelve-hour daytime division — Bavli Shabbat 129b plus Rashi's Saturn–Jupiter–Mars–Sun–Venus–Mercury–Moon cycle, explicitly indexed to numbered daytime hours (S18-a…d) — and the dossier records it as *evidence the question was asked* rather than using it to fill a column, because it sits in a bloodletting sugya and nothing applies it to the halachic prayer clock. **This is the hardest version of the maintainer's ruling to follow and the dossier follows it.**

**Gaps — 12, all with search evidence.**

| # | claimed absent | conf. | evidence | audit |
|---|---|---|---|---|
| 0 | Gra's own words on mil-length at Beur HaGra OC 459:2 | confirmed | 2 refs fetched; 459:2 returned a comment on flour and kneading | ✔ — and it **contradicts round 1's blocker 2**; see Q9 |
| 1 | Tosafot to Pesachim 94a | confirmed | Sefaria: "we have no text" | ✔ |
| 2 | any ruler for a sha'ah zemanit | confirmed | Shabbat 129b + Rashi fetched; returned a real thing that is not the thing | ✔ |
| 3 | modern secular peer-reviewed scholarship | confirmed | 1 Scholar query + Brill catalogue on one author | ✘ **rejected** — two searches cannot establish a literature-wide absence; prose is ledger-scoped, field is literature-scoped |
| 4 | primary source for netz nir'eh / visible horizon | c-n-d | chaitables.com failed at connection level (0 bytes, http=000) | ✔ |
| 5 | Chabad / Ba'al ha-Tanya in its own words | c-n-d | HTTP 403 on curl and WebFetch | ✔ |
| 6 | Benish, *HaZemanim BaHalachah* | c-n-d | not digitised; in copyright | ✔ |
| 7 | rollover of the halachic **calendar** day | c-n-d | ledger scan; terms field says "(none recorded — the fetcher did not report a search)" | ✔ honest |
| 8 | Tier A statement that the **night** divides into twelve | c-n-d | ledger scan; only the 1901–06 JE gloss | ✔ |
| 9 | chatzot identified with solar transit | c-n-d | ledger scan | ✔ |
| 10 | Ohr HaChaim calendar's own introduction | c-n-d | FAQ retrieved; only its characterisation | ✔ |
| 11 | licence-resolved digitisation of MB 58:4 | confirmed | `available_versions` + pinned-version retry | ✔ |

Plus one **fabricated-gap by inversion**, which is the mirror of round 1's failure and is worth naming: entries 2, 5, 8 and 9 each carry a note claiming round-1 landmarks "are recorded in `gaps[]` as things to re-fetch." No gaps entry does. The concrete cost is that round 1's Tier A landmark for the fifth hour (Shulchan Arukh OC 443:1, the erev-Pesach chametz limit) is dropped with nothing pointing at it. **Not a claimed absence without a search — a claimed gap-record without a gap.**

**Golden values: 9, all published constants, none computed.** Every figure is a number a ledger source printed (mil = ¼h + 1/20h = 18 min; 4 mil = 72; 16.1°; 19.8°/19.75°; 8.5°; 4.37°; 34′ + 16′ ⇒ zenith 90.83333°; the JE's 13½ min ≈ 3½°). A Node test can assert all of the arithmetic and every published constant, and the adversary independently recomputed all of it. **It cannot assert a time.** Round 1's Hebcal- and Astronomy-Engine-verified times and its nine polar cut-off latitudes are gone — correctly, since no snippet supports them — and the dossier declares the loss in `honestLimits (3)` rather than hiding it. `PHASE1-REPORT.md` called zmanim "the best-verified system in phase 1" precisely on those vectors. **Maintainer decision, Q8.**

**Copyright — the one item that must clear before any of this prose reaches a page.** A longest-common-run check against every cite-only snippet returns verbatim runs from in-copyright sources, each labelled "paraphrased" in place: **S26-c 15 words**, **S20-c ~14 words**, S19-f 11 words, plus 7–9 word runs from six more; and S24-d reproduced near-verbatim in three fields. `FRAMING §5 A-6` sets this repo's own operative threshold at 12 words and two runs cross it. `honestLimits (6)` asserts the opposite ("Verbatim text appears here only from sources verified as PD-US or CC0"), which makes the summary claim wrong as well as the labels. **Mitigating and verified by me:** the compiled artifact stores cite-only sources as `snippetWithheld` with no snippet field at all — 60 of 103 ledger records — so the artifact is structurally incapable of leaking cite-only text. **The prose is now the only channel.** Small, closable, and governed by Q2.

**Other blockers:** 7 locus-as-evidence claims (§3); the false internal cross-reference above; `gaps[3]` scope; `variants['dawn-90min'].tier` (cheapest fix: add S8-a to its `snippetIds`, making route 1 genuinely Tier A); and one **missing** contested point — 18° (S23-f, 1901–06) against 16.1° (S20-b, S21-b) as the depression-angle equivalent of a 72-minute dawn at Jerusalem, a ~1.9° divergence, far larger than the 19.8-vs-19.75 pair the dossier does flag.

---

### 4.2 Vedic horā (Tier A) and Choghadiya (Tier C) — NEEDS-REWORK

**50 verdicts, 44 accepted, 6 rejected, 4 fabrication-class — the cleanest ratio in the round (8% adverse, 12% rejected).** Its adversary re-derived all 112 Choghadiya cells and all six golden values independently rather than spot-checking, and every cell held.

**Ruler column: TRUE — and asymmetrically, which is the point.** Verified: 14 of 14 entries carry a `ruler`, `hasRulerColumn: true`.

- **Vedic horā — Tier A.** Sūrya Siddhānta xii.79 places the horā regents in downward order from Saturn (S1-h); xii.30–31 supply the order (S1-d, S1-e); xii.78 derives the weekday regent by the same descent (S1-f). This is **the one genuine Tier A ruler column in the grid**, and it is the maintainer's ruling satisfied on its own evidence rather than by assertion.
- **Choghadiya — Tier C only.** All seven assignments are doubly attested across four commercial almanacs which agree, corroborated a third way (S4-e's Sunday planet order matches S4-p's Sunday name order position-for-position). No primary text and no scholarship anywhere in the ledger. `rulerTier: "C"` is in every Choghadiya entry's machine-readable field, not only in prose.
- **NEW FINDING, and it constrains the render: the ruler column is Tier A but its ENGLISH WEEKDAY LABELS are Tier C.** S1-f, S2-c, S2-d, S2-e and S2-i give the ordered sequence and *name no English weekday* — S2-d says "the first of the second day", not "Monday". The mapping Sun–Sunday … Saturn–Saturday is stated in this ledger only at Tier C (S8-g, S7-f). **A cell reading "Saturday — Saturn" splices a Tier A sequence to a Tier C label.** This finding cuts against the compiler's own interest — it downgrades a label it could have shipped as Tier A — and it is the sharpest thing in the round. **Q12.**

**Gaps — 12, all with search evidence.** Seven confirmed-absent, five could-not-determine. Two rejected, both for over-broad wording on a gap that did search:

- `gaps[3]` "Tier B peer-reviewed scholarship on the Vedic horā — **of any kind** — is absent from this ledger" is contradicted by the ledger's own Tier B labelling of S2 and by the dossier's own reliance on S2 as Tier B. The intended claim (no *modern* peer-reviewed scholarship; Pingree never fetched) is true and important. **A false absence closes a search.**
- `gaps[8]` "The only IAST anywhere in the ledger … is Chogaḍīā" is false on the ledger's own snippet text (S1-c prints *sāvana*; S3-d prints *horā*). The true and valuable form — no Indic-script or IAST form for any *individual division*, hence no `nameOriginal` on any entry — survives.

The exemplary entry in the whole round is `gaps[2]`: **"Whether Choghadiya is attested in the classical Sanskrit muhūrta corpus. THIS DOSSIER RECORDS NO VERDICT ON THIS, in either direction"** — with the three works not opened named, and round 1's failure cited as the reason for the restraint.

**Golden values: 6, and this is the only system with a computation a Node test can reproduce to the printed minute.** GV1 reproduces all 16 Choghadiya boundaries at tolerance 0 from a fed sunrise/sunset pair (810 ÷ 8 = 101.25; 630 ÷ 8 = 78.75; every value matches under round-half-up including the three that turn on the exact half-minute). GV5 reproduces four horā boundaries exactly (810 ÷ 12 = 67.5; 630 ÷ 12 = 52.5). GV3 pins the 112-cell weekday table. GV2 pins name order plus two part-lengths. **GV6 is names-only by design** — the source's night table copies its daytime clock labels, contradicting its own header, and the dossier refuses every clock value from it while keeping its names. Two golden values sit on pages that do not name their location, and the `place` field says so in capitals and instructs the test to feed the published sunrise/sunset in rather than compute them — the direct fix for round 1's defect where a bare AstroSage URL re-fetched as Marcellus, New York.

**GV4 is the one that must be fixed first**, because it would pin a shipped test to an unsourced number: "47.583-minute night horās" and "next sunrise 05:57" are cited to S7-d/S7-e, neither of which carries a next-sunrise value, and S7-e's own locus computes 47.5 from a 9h30m night. The 05:57 is in the ledger — at S4-o, a *different* page — and the printed boundary 21:14 does not discriminate 47.5 from 47.583, so nothing in the cited evidence would ever catch it.

**Copyright: clean, and the adversary explicitly declined to call one.** S1/S2/S3 are pd-us on stated pre-1931 grounds (1860; 1910) satisfying `FRAMING §4.3`'s mechanism-and-year test, and are the only sources quoted. An n-gram scan of the notes file against the in-copyright snippets returned two non-expressive hits (a six-word functional overlap and the bare planet list). The adversary records that this is the error the round-1 adversary made against a correctly-used public-domain Budge quotation, and refuses to repeat it. The ≤25-word verification extracts in `sources[]` are flagged as never to travel into shipped data (Q2).

**Other blockers:** V3's `sourceRefs` attach mPanchang (S5-a/S5-b) to all eight cells of every weekday row when those snippets are *first row only* — 14 of 112 cells — while GV3's label reads "112 cells, two witnesses"; the prose says "first row" and the field does not, and the renderer reads the field. `descendingOrderPosition` carries two incompatible semantics across the two families and must be renamed. S4-c is cited for "ninety-six minutes" and gives four ghaṭī and no minute value. V1's "explicitly distinct" is a locus gloss promoted to an attributed assertion.

---

### 4.3 Chinese shichen — NEEDS-REWORK

**25 verdicts, 18 accepted, 7 rejected, 5 fabrication-class.** Round 1 required a full re-sweep; round 2 is a serious dossier that corrects its predecessor on the substantive point (see below) and fails on presentation.

**Ruler column: FALSE.** Verified — a regex for `"ruler":` over the whole 137 kB file returns nothing, and 0 of 12 entries carry a ruler under any name. Two independent grounds are stated, and the second is scoped honestly: the maintainer's ruling settles the column, and the ledger supplies nothing to fill it — but **the fetcher did not search for one, so the gap is `could-not-determine`, not confirmed.** `searchTermsUsed` literally reads "(NONE AT FETCH TIME…)". Given that three of six round-1 dossiers fabricated a confirmed gap, **this refusal is the single clearest evidence in the round that the discipline is internalised rather than performed.** What the ledger *does* attach to a branch is recorded and kept separate: an animal, a descriptive day-part, a ke allotment, and — in the hemerological layer only — a conditional auspiciousness computed from the *day's* branch. The nearest agentive language, 神藏煞沒, is keyed to heavenly stems and the four corners, so it attaches to no row.

**Gaps — 8, all with search evidence**, and shichen is the only system to introduce a fourth confidence value, `probably-absent` (4 of 8). None was rejected. Two are unusually well-evidenced: the missing Sôma et al. appendix (pp. 897–904) records four failed retrieval routes with their exact failure modes and instructs that its contents must not be assumed — and they are not assumed anywhere; and the 1645 scan enumerates five search terms across every date-bearing snippet.

**That 1645 gap is a correction to this repo's own round-1 data and it must propagate.** Round 1's shichen dossier carried "100 ke before 1645, 96 ke after". The round-2 ledger nowhere supports 1645. It supports **1628** (S3-g) and **Kangxi 9 = 1670** (S6-e), with the change recited as a charge in 1665 and re-validated by observatory trial in 1669 — and the dossier prints both and chooses neither. **Q11.**

**Golden values: 12, and they are constants and dates rather than computations.** gv-1 (zi begins 23:00), gv-2 (wu 11–13), gv-4 (1 shichen = 8 ke = 120 min; 1 ke = 15 min under the 96-ke day), gv-5 (8⅓ ke under the 100-ke day), gv-6 (1 ke = 14.4 min), gv-7 (winter solstice 40/60), gv-10 (AD 507), gv-11 (Kangxi 9 = 1670), gv-12 (1628). A Node test can assert all of these plus the twelve-branch clock table derived from the 23:00 anchor — and the derivation is independently checkable, because the two *attested* anchors agree with it: from zi = 23:00 with twelve equal 2 h steps, wu lands at 11:00–13:00, which is exactly what S3-k and S18-b state independently. **Ten of twelve clock ranges are the compiler's arithmetic and live in a differently-named field, `clockRangeDerived`, with `clockRangeDerivedFrom` and a derivation note; no entry carries both an attested and a derived range.** That is the correct structural answer to C4 — the caveat lives in the field *name*, where a renderer cannot lose it. gv-8 is explicitly marked "a pin for a future fetcher, not a value a renderer should display".

**Copyright: advisory, not a blocker.** Narrative fields reuse short verbatim English from four cite-only in-copyright sources (S3-a, S3-k, S3-f/g, S19-a, S20-a, S20-c, and S4-c's quoted "medium values … 1 hour and 7.2 minutes"). `sources[]` marks those snippets `shippable:false`; nothing marks the prose that reuses their wording. Each is ≤25 words and a bare statement of numeric fact. Governed by Q2.

**Toxicity — the only hemerological hazard flag in the round, and it is handled correctly.** Entries 1 (子) and 7 (午) carry `toxicFlag` for 時破大凶 from the 1741 協紀辨方書. It is characterised as a property of a **day/hour pair** with one worked example (the wu hour on a zi day), not as an intrinsic property of either hour, and **no other pair is inferred.** The Tong Shu variant states "NO EFFICACY. Everything here is reported as doctrine held and printed by named sources." The only outcome language anywhere in the file ("a good hour to hold business activities for generating wealth") appears solely inside `sources[]` as a verification snippet marked `shippable:false`, never in a narrative field.

**Blockers, in order:**

1. **`divisionRule` merges a live conflict in the top-level field a comparison view renders.** It asserts "TWELVE EQUAL FIXED DIVISIONS" and a uniform 8⅓ ke under the 100-ke day — while the second half of the very sentence it cites says otherwise (S10-a: 惟寅申己亥有九刻), a Tier A scheme it prints elsewhere is incompatible with equal shi (S12-a: 古法子午時皆十刻餘皆八刻, which makes 子 and 午 2.4 h against the others' 1.92 h), and the 隋書 states outright that the chen's ke differ (S1-j). The dossier's own `contestedPoints` says "a comparison view that shows one distribution as 'the' Chinese scheme misrepresents the sources." **Fix the field, not the commentary.**
2. **gv-3 asserts an inference as an attested value.** "Midnight is zi's midpoint" is in neither cited snippet — S13-a says only that the 正 point is the *middle of the branch*; S6-b says only that 子正 is an epoch instant. The dossier's own notes file hedges it with "**If** midnight is zi's midpoint"; the JSON does not.
3. **The invented maintainer ruling** (§1). Replace the tier demotion with a content-layer flag, or cite the ruling by document and line. **Q6.**
4. "Six centuries before any Jesuit" (AD 507 → Ricci, S5-b, Shenzong r. 1572–1620) is uncited and wrong by roughly five centuries; the interval is about eleven.
5. `v-centred-vs-begun` files S3-k and S3-l under BEGUN while `contestedPoints` files the same two under CENTRED. On the snippets, `contestedPoints` is right.

**One thing the shichen audit establishes that applies round-wide:** *every* defect above passed `research-validate --strict` cleanly. The validator checks snippet presence, sid resolution and shape, and one C4 hedge pattern. **It does not check tier correctness, whether a snippet supports its claim, gap evidence, ruler-column policy, or copyright.** The green gate is necessary and nowhere near sufficient, and must not be quoted as broad assurance.

---

### 4.4 Egyptian — NEEDS-REWORK (name layer) / **BLOCKED** (hour arithmetic)

**36 verdicts, 24 accepted, 12 rejected, 6 fabrication-class.** The highest rejection rate in the round (33%) and, simultaneously, the dossier its adversary certifies most strongly on the thing that matters: *"Round 1 lost 28 claims to fabricated citations and invented attributions. This round loses zero. The six failures I am counting are all over-specification of a genuine source, not invented provenance."* Every sid in every field resolves; no source appears that the ledger does not contain; no scholar is credited with a position no snippet records — and the hardest cases are routed correctly (everything Symons or Schomberg argues goes through Brack-Bernsen reporting them, at every occurrence, because the Brill chapters were never obtained).

**Ruler column: FALSE — and this is the direct execution of the maintainer's ruling in `RESEARCH-PROTOCOL.md §5`.** Round 1 filled it with Amduat hour-goddesses on a system whose own scope note says it has no rulers. Verified: `hasRulerColumn: false`, **`ruler` on 0 of 24 entries**, 0 in `associations`, and the goddesses relocated to the `name` field of the night entries where they belong. The gap is `confirmed-absent` and **earns the word**, on four independent negative lines: Budge prints hour-deities (§XI, §XII) and planet-gods (§XIII) as non-intersecting series *on the same page* and joins them nowhere; the Demotic Magical Papyrus — a Roman-period *operative magical* corpus, the place hour-lords would be most expected — uses hours as bare clock-times and separately invokes planets and never joins them (whole-file counts: "hour" 13, "planet" 3, "Saturn" 1, and that one a modern editorial cross-reference); Budge's entire Am-Tuat volume names exactly one planet, as a picture (a five-rayed star at the door into the Sixth Division); and Cassius Dio 37.18–19, the only ancient text attaching hour-rulers to the word "Egyptians", is correctly quarantined as third-century evidence about the *Roman planetary week* — he calls the practice recent, says the ancient Greeks never understood it, and names no Egyptian hour, hour-name or source. **Consequence recorded in the scope note and worth carrying to phase 2: `assets/js/core/planetary-hours.js` implements the Hellenistic/Chaldean rotation and must not be relabelled "Egyptian" on Dio's authority.**

**Gaps — 6, all with search evidence**, five confirmed-absent. One rejected on scope: gap 3 confirms an absence in the *printed* 1905 volume from a pattern scan run over the sacred-texts HTML transcription, which the same dossier proves in variant 6 is an unfaithful witness (it reproduces two chapter headings Budge's own errata leaf corrects, and its errata page carries none of Budge's errata). Gap 4 is the strongest in the round: eight search locations, five terms, and every recorded absence a *recorded* absence — Parker's full extracted text returns **zero** hits for "shadow" and **zero** for "clepsydra" across 304,915 characters; Ainsworth returns zero for "hours of the day"; four retrieval failures are logged with their exact modes (SAGE paywall, Brill paywall, two empty Internet Archive searches, HTTP 429 twice) — and it closes with **"CONFIDENCE IS ABOUT THIS LEDGER, NOT ABOUT THE FIELD"**, naming the three located-but-unread works that would fill it.

**Two night cells are left empty on purpose and that is the correct result.** Divisions IX and X carry an hour-name formula in the witness — the pattern scan proves it matches in bat12 and bat13 — but no snippet captured the wording, so no name is entered, and the `name` field itself says why. Filling them from the pattern of the neighbouring hours is exactly the completion-by-inference `FRAMING §5 A-2` forbids.

**GOLDEN VALUES: EFFECTIVELY NONE. THIS IS THE FLAG THE BRIEF ASKS FOR.**

Three golden values, and **not one is a computation a Node test can reproduce**:

- **GV1** — the Karnak clepsydra's longest-to-shortest month-scale ratio, 14 fingers to 12. A constant, reported by Parker reporting Borchardt. The dossier explicitly refuses to convert it into a ratio of night lengths or to derive a latitude from it, and names the reason in advance: *"any such conversion would be a number this project invented and then cited to Parker."* Correct, and it means the value tests nothing computational.
- **GV2** — two contested positions on which civil month carries the shortest night (Parker: month 10; Schomberg via Brack-Bernsen: month 9, which would age the vessel by ~250 years). "A test may pin either as an ATTRIBUTED position; it may not pin the answer."
- **GV3** — **an explicit record of absence.** Round 1's USNO rise/set vectors for Luxor are withdrawn, and the deeper reason given is the right one: such a vector would test *the engine's equal-twelfths convention*, not anything Egyptian.

And the reason runs deeper than a missing fetch. **Gap 5 is `confirmed-absent` on the division rule itself**: twelve hours are attested; twelve *equal* parts are not, anywhere in this ledger. Every source that describes how the hours were found describes a **table or an observation, never a division** — Parker's clepsydra filled at sunset and read off one scale per civil month; von Lieven & Schomberg's one row of interior holes per month; Symons (via Brack-Bernsen) demonstrating that no set of real stars can both make its first dawn appearance on the required day *and* rise at evenly spaced moments, so the decans marked out **unequal** stretches; and Budge raising the summer-night objection himself and answering it theologically. Gap 4 adds that there is **no instrument, arithmetic or procedure for the twelve DAY hours at all**.

**Therefore: Egyptian cannot be verified computationally and must not be built on as an hour engine.** What it can carry is a names-and-absences museum layer — twelve day-names, ten of twelve night hour-names, the divergences, and the two honestly empty cells. If the site computes sunset→sunrise ÷ 12 for Egyptian hours it is applying a modern seasonal-hour convention to Egyptian names and must say so in its own voice. **Q7.**

**Copyright: CLEAN, and recorded so it is not re-litigated.** The adversary re-ran the check the round-1 adversary got wrong (it called a hard blocker on a correctly-used public-domain Budge quotation; `RESEARCH-PROTOCOL §4` records that rejection as itself unsound). Independent n-gram scan against all in-copyright snippets: **maximum shared prose run 6 words** — "the twelve hours of the night", which is also the literal wording of Budge's own public-domain §XI heading. The only longer match is a 14-word Dodd *bibliographic citation*, which is a reference string and correct practice. `sources[]` rows for Parker, Ainsworth and Brack-Bernsen carry `verbatimWithheld: true` with a paraphrase and a ledger pointer. The only sources quoted are Budge (1904/05/06), Griffith & Thompson (1904), Brugsch (1883) and Cary's 1914 Loeb Dio — all pre-1930.

**Tier is the substantive rework.** All 24 entries carry tier `A` and no other tier appears in `entries[]`. That collapses Budge 1905's Amduat text edition and Budge 1904's **unfootnoted** day-hour list in a popular compendium into one chip — and the dossier itself establishes that §V carries no source footnote while the *adjacent* planet and dekan lists footnote Brugsch and Lepsius, and that the name-to-hour pairing was read off flattened OCR columns and "was not seen stated on any single line". Separately, Ainsworth 2018 is tier `B` in all five of its `sources[]` rows although the ledger flags it as an unrefereed MA research essay and instructs the compiler to tier it accordingly; the prose is honest at every occurrence and the machine field is not. **Q4, Q5.**

**Other blockers:** four over-specifications where the snippet says less than the dossier ("civil" day; "facing pages" where both sections are p. 302; scales "cut for one place" where the evidence establishes per-*month*; entry 20's "the two volumes are not in conflict here", which the cited pattern scan cannot establish and which contradicts the dossier's own refusal to make that same inference two entries later); variant 5 completing a gate name the summary breaks off at "Sept- …", closing a conflict the file elsewhere keeps open; an uncited latitude range in `polarBehaviour`; and `honestLimits (10)`'s sid count — **which I measured: the file's claimed "26 distinct sids across entries, variants and goldenValues" is entries-only; the correct figure is 51**, independently reproducing the adversary's correction exactly.

---

## 5. THE GOLDEN-VALUE PICTURE ACROSS THE ROUND

| system | golden values | reproducible **computation** a Node test can run | verdict |
|---|---|---|---|
| Vedic / Choghadiya | 6 | **Yes** — GV1 all 16 boundaries at tolerance 0; GV5 four horā boundaries exact; GV3 112 cells; GV2 part-lengths | strongest in the round |
| Chinese shichen | 12 | **Partly** — constants, dates, and a 12-branch clock table derivable from one anchor and cross-checked against the second attested anchor | usable |
| Jewish zmanim | 9 | **Arithmetic only** — every mil/degree constant recomputes; **no time-of-day vector survives** | maintainer decision (Q8) |
| Egyptian | 3 | **None.** One un-convertible ratio, one pair of attributed positions, one recorded absence | **BLOCKED for engine purposes** |

Round-wide, two structural improvements are worth carrying into phase 2 as conventions rather than as one-offs:

- **Feed the anchors, don't compute them.** Vedic GV1/GV5 and shichen gv-5 all instruct the test to feed the *published* sunrise/sunset in rather than recompute them, with `place: "NOT NAMED BY THE SOURCE"` in capitals. This is the direct fix for round 1's defect where a bare almanac URL re-fetched as a different city.
- **Name the field, not the note.** shichen's `clockRangeAttested` / `clockRangeDerived` split and vedic's `compilerDerivations.warning` both put the caveat somewhere a renderer cannot drop it. That is the C4 fix that actually works, and it should be the schema's default shape.

---

## 6. COPYRIGHT AND TOXICITY, ROUND-WIDE

**Copyright.** Two systems clean (Vedic, Egyptian — both independently n-gram checked, both with pd-us grounds stated per source in the `FRAMING §4.3` mechanism-and-year form). Two systems carry short verbatim runs from cite-only in-copyright sources in *narrative prose* (zmanim: two runs over the 12-word threshold, mislabelled "paraphrased", with `honestLimits` asserting the opposite; shichen: half a dozen ≤25-word numeric-fact phrases). **In no case does in-copyright text reach a machine-readable field a renderer would ship** — zmanim withholds cite-only snippets from its ledger entirely (60 of 103 records `snippetWithheld`), shichen and Egyptian mark theirs `shippable:false` / `verbatimWithheld:true`. The leak channel is research prose only, and the governing question is Q2.

**Toxicity / harm.** One hemerological hazard flag in the entire round (shichen's 時破大凶, correctly scoped to a day/hour pair with a single worked example and no inference to other pairs). **No materia, no technique, no dosage, no targeting slot, no second-person address anywhere in the four dossiers** — which means `FRAMING`'s C-1 through C-7 carve-outs were *not exercised* by this round and must not be assumed tested by it.

**Efficacy.** All four clean, each verified independently by its adversary: zmanim scanned for efficacy tokens and `/\b(you|your|yours|yourself)\b/i` (only hits: "underlying work" and "On Your Way", a digitisation's name); Vedic confirmed every quality grade is bound to a sid and to a named almanac and reported as that source's vocabulary, with four ungraded names left empty rather than inferred from the ruling planet's benefic/malefic character; shichen found outcome language only inside `sources[]` verification snippets marked unshippable; Egyptian confirmed the hour-goddesses are framed as figures in a funerary cosmography and never as agents acting on a reader.

---

## 7. STATE OF THE FILES — three things a maintainer should know before phase 2 opens them

1. **`research/horae/v2/` is untracked in git.** `git status` reports `?? research/horae/v2/`; `git ls-files research/horae/v2/` is empty. Nothing in this round is committed.
2. **`egyptian.json`'s `honestLimits` on disk ends at item (9).** Neither the `(10)` validation paragraph nor the n-gram sentence in `(6)` exists in the file — both self-verification claims live only in the submitted dossier text. I confirmed this directly. A verification claim that is not in the artifact cannot be audited later; write it in, corrected.
3. **Four dossiers, four schemas — and the validator passes all four.** `zmanim` names its ledger `ledgerSources`, the other three name it `sources`; `shichen` names its failure log `notObtained` where the others use `attemptedAndFailed`; `shichen` alone uses a fourth `gaps[].confidence` value, `probably-absent`; only three of four carry `round`/`compiled` metadata. Phase 2 cannot read these with one loader as they stand. **Q14.**

---

## 8. WHAT ROUND 2 GOT THAT ROUND 1 DID NOT — for the record, because it is the return on the protocol change

- The **shichen 1645 correction** (round 1's date has no support in any retrieved source; two attested dates survive and both are printed).
- The **zmanim Beur HaGra reversal** — round 1's false gap closed, *and* the retrieval turned out to contradict round 1's blocker 2, which the compiler correctly declined to adjudicate (Q9).
- The **Egyptian ruler column emptied**, on evidence rather than on instruction alone.
- The **Vedic tier inversion**: round 1 put the seasonal horā at Tier C and the 1/24 reading at Tier A; on this ledger it is the other way round, because al-Bīrūnī is Tier A and says seasonal, and the 1/24 is a Tier B annotation glossing a verse nobody in this round read.
- The **Tier A sequence / Tier C weekday-label split** (§4.2) — a finding round 1 did not have.
- The **Vedic 112-cell table**, cell-verified against three witnesses with zero disagreement, and its five closed-form rules re-derived and quarantined as compiler arithmetic rather than presented as the tradition's.
- Two **honest data losses declared as losses** rather than papered over: zmanim's computed time vectors and Vedic's three-way split on Char's auspiciousness, both dropped because this round's ledger does not carry them, both explicitly marked "not because it is wrong."

---

## 9. THE MAINTAINER'S QUESTIONS

These are the points **the build must not resolve silently.** Each is yes/no or pick-one. Numbers in brackets are how many audited findings the answer decides.

1. **LOCUS IS NOT EVIDENCE — yes or no?** Does a fetcher's first-hand `locus` annotation count as evidence on a par with a `snippet`? *No* (recommended) makes 7 zmanim rows, 6 shichen claims and Vedic's V1 wording corrections, and the rule goes into `RESEARCH-PROTOCOL C1` before round 3. *Yes* makes them all acceptable — defensible, but it must then be written down, because round 3 is otherwise guessing. **[~15 findings, all four systems]**
2. **Which rule governs verbatim text in a *research* file — `FRAMING §4.1` (a cite-only record holds no text) or `RESEARCH-PROTOCOL C1` (≤25-word verification extracts permitted, never shipped)? Pick one.** Decides zmanim's copyright blocker and shichen's Advisory 6. Note that under either answer the extracts must be re-voiced before the prose reaches a page. **[~10 runs, 2 systems]**
3. **Is `gaps[].confidence` ledger-scoped or literature-scoped by convention? Pick one.** Three systems carry a gap whose field says one and whose prose says the other. **[3 findings]**
4. **Tier B — does it mean modern peer review, strictly?** Specifically: (a) is Burgess's 1860 translator's annotation Tier B? (b) is an unrefereed 2018 MA research essay Tier B? **Yes/no to each.** **[2 findings]**
5. **Tier A — does it mean primary source or critical edition, strictly?** Specifically: is Budge 1904's unfootnoted list in a popular compendium Tier A alongside Budge 1905's text edition? **Yes/no.** If no, add a fourth tier or a per-entry `tierBasis`; 12 Egyptian entries are affected. **[1 finding, 12 rows]**
6. **Does a ruling exist that Tong Shu / hour-selection *content* is tiered by content rather than by edition? Yes/no.** I searched `docs/plans/horae/RESEARCH-PROTOCOL.md` and `docs/plans/LOOP.md`; both rule only on ruler columns. If no, the 1741 欽定協紀辨方書 returns to Tier A with a content-layer flag, and the round's only `invented-attribution` is closed. **[1 finding]**
7. **Egyptian: names-and-absences layer with no hour clock, or may the site compute equal twelfths labelled as the modern seasonal-hour convention? Pick one.** The system has no reproducible golden value and a `confirmed-absent` gap where its division rule would be. **[blocks/unblocks an entire system]**
8. **zmanim: re-derive round 1's Hebcal / Astronomy-Engine times and nine polar cut-off latitudes as explicitly-labelled *derived* regression targets, or ship zmanim with published constants only and no second-accurate time test? Pick one.** Not an error either way — a real trade between evidence purity and testability.
9. **Beur HaGra OC 459:2 — one of two retrievals is wrong and no agent can settle it.** Round 1 says the comment rejects the 18-minute reckoning and concludes a 22.5-minute mil; round 2's fetch of the same ref returns a short comment about flour and kneading. **Which stands — or neither, pending a human with the Lemberg volume?**
10. **The 1860 Sūrya Siddhānta annotations: Burgess (round-2 ledger) or Whitney (this repo's `PHASE1-REPORT.md`, four places)? Pick one.** Settle from the title page; the dossier currently writes "the 1860 translation's translator's notes" wherever the attribution is load-bearing, which is correct but cannot ship as a permanent hedge.
11. **Confirm that round 1's shichen "100 ke before 1645, 96 ke after" is withdrawn. Yes/no.** The round-2 ledger nowhere supports 1645; 1628 and Kangxi 9 = 1670 both stand, unreconciled.
12. **The Vedic ruler column is Tier A in its sequence and Tier C in its English weekday labels. How does a grid cell render? (a) "Saturday — Saturn" under one Tier A chip; (b) the same under a split chip; (c) sequence only, no weekday label. Pick one.** **[the one Tier A ruler column in the whole grid]**
13. **May a labelled compiler derivation ship inside a machine-readable field at all — or must every unsourced derivation live in prose only? Pick one.** In play: Vedic's `compilerDerivations` (five rules reproducing all 112 cells, stated by nobody), shichen's ten `clockRangeDerived` values, and shichen's horā↔Choghadiya arithmetic relation which sits *inside* `contestedPoints[]` while claiming to be "not in any machine-readable field a renderer could pick up". `FRAMING §2.4` is the governing rule.
14. **Unify the four dossier schemas and add enums (`sources` vs `ledgerSources`; `attemptedAndFailed` vs `notObtained`; `probably-absent` as a fourth confidence value) before phase 2 reads them? Yes/no.**
15. **Authorise one targeted re-fetch pass to recover known-locatable data? Yes/no.** Named, cheap and enumerated: zmanim's hour-5 Tier A landmark (Shulchan Arukh OC 443:1); the Egyptian hour-names for Divisions IX and X (two files, `bat12.htm` and `bat13.htm`); Jéquier 1894 to break the Budge monopoly; Sôma et al. pp. 897–904 (the appendix that would supply ten of shichen's twelve clock ranges outright); Vedic's three-way split on Char.
16. **Do Babylonian and materials get a round-2 re-run before phase 2? Yes/no.** They hold round 1's only two BLOCKED verdicts, they were not re-run, and until they are, this round's 16.1% is a rate measured with the two worst dossiers excluded.

---

## 10. THE ONE-LINE ANSWER

**The protocol change worked: the failure it was written to kill — a citation with no fetched source behind it — went from 28 findings to zero, and the one surviving invented attribution is aimed at the brief rather than at a source. The headline rate fell from 21.2% to 16.1%, but that comparison is indicative and not like-for-like — a different, smaller set of systems, four differently-drawn definitions of "fabrication-class", and a dominant new failure kind that round 1's taxonomy could not have produced. The real result is that the round-2 residue is a *different and much cheaper* failure: the compiler treating the fetcher's locator note as its evidence. Answer Q1 and most of it closes.**
