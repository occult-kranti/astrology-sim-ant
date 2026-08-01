# Vedic horā & Choghadiya — round 2 compiler's notes

Companion to `vedic-hora-choghadiya.json`. Compiled 2026-08-01 under
[RESEARCH-PROTOCOL.md](../../../docs/plans/horae/RESEARCH-PROTOCOL.md) C3, the
fetcher/compiler split.

**Every claim in the JSON carries at least one snippet id from the round-2 fetcher
ledger. No source was introduced. Nothing was cited from the compiler's own
knowledge.** Where the ledger does not support a row, there is no row, and the
absence is written up as a gap with the fetcher's actual search record attached.

**Quotation policy in this file.** S1, S2 and S3 are `pd-us` — Burgess's
translation was published in *JAOS* vol. 6 (1860) and Sachau's al-Bīrūnī in 1888,
this printing 1910; both are pre-1931 publications whose US term has expired.
Those three are quoted. S4–S10 are commercial or share-alike and are `cite-only`
under FRAMING §4.1: **this file paraphrases them and quotes none of them.** The
≤25-word verification extracts required by protocol C1 live in the JSON's
`sources[]` and go no further.

---

## 1 · The two headline results

**Vedic horā carries the grid's one legitimate Tier A ruler column, and it is
Tier A on the ruler *sequence* only.** A primary text assigns a governing planet
to each division:

> the regents of the hours (horā), also, occur in downward order from Saturn.
> — *Sūrya Siddhānta* xii.79, trans. Burgess (1860) · `S1-h`

> Revolve Saturn, Jupiter, Mars, the sun, Venus, Mercury, and the moon
> — xii.31, supplying that downward order · `S1-e`

> Counting downward from Saturn, the fourth successively is regent of the day
> — xii.78 · `S1-f`

That last verse, taken every fourth planet down the list, reproduces the weekday
lords exactly — Saturn, Sun, Moon, Mars, Mercury, Jupiter, Venus. It was
re-derived, not assumed.

**But the weekday *names* on that column are Tier C.** Neither the verses nor the
1860 notes say "Saturday". The mapping Sun–Sunday, Moon–Monday and so on is
stated in this ledger only by a commercial almanac (`S8-g`, restated anchor by
anchor at `S7-f`). A rendered cell reading "Saturday — Saturn" is splicing a Tier
A sequence to a Tier C label, and the JSON says so in
`associations.weekdayMappingNote` on all seven horā entries. This distinction is
new in round 2.

**Choghadiya is Tier C throughout, and its data is far better than its
provenance.** All 112 published cells were re-derived and reproduce with zero
failures across three witnesses; the golden-value boundaries reproduce to the
printed minute. And behind them: four commercial almanacs and one encyclopedia
article whose only reference is a glossary of Buddhist terms, which itself
carries no rulers and no weekday table and has been flagged unsourced since July
2012. No primary text, no scholarship, no date, no author.

That combination — thin provenance, rich data — is what FRAMING flags as an
evidential-dignity risk. It is why the Tier C label has to sit on the comparison
view itself and not merely in a badge.

---

## 2 · What changed against round 1

Round 1 was NEEDS-REWORK (moderate) on horā and needed provenance re-labelling on
Choghadiya. Point by point:

**Blocker 1 — tier inflation on the division rule. The tiers have flipped, and
the flip is the finding.** Round 1 put the seasonal 12 + 12 reading at Tier C and
the "twenty-fourth of the day" at Tier A. On this ledger it is the other way
round. Al-Bīrūnī, writing c. AD 1030, is Tier A and says seasonal outright:

> They arrange the order of the dominants according to the horæ temporales.
> — al-Bīrūnī ch. XXXIV, p. 343, trans. Sachau (1910) · `S3-g`

> the hours used in the theory of the dominants of the hours are horæ obliquæ
> temporales — · `S3-i`

Meanwhile the 1/24 formulation is Tier B *and is a gloss*. It occurs in the
translator's note, not in the verse:

> adding also the important and significant specification respecting the hours,
> or twenty-fourths of the day — note to xii.78–79 · `S2-h`

The fetcher flags that this is the translator's own wording and not the
Sanskrit's — and **the Sanskrit of xii.78–79 was never retrieved** (both GRETIL
URLs 404'd). Both readings are printed in `divisionRule`. They are not
interchangeable arithmetic: seasonal day-horās and night-horās differ in length
on the same date, which the retrieved tables show directly — 72.5 min against
47.583 min at one location, 67.5 against 52.5 at another, same date.

**Blocker 2 — the false recorded negative is gone.** Round 1 claimed an
equal-hour horā "WAS SEARCHED FOR AND NOT FOUND" while its own primary source
defined the horā as a twenty-fourth of the day. Round 2 records the divergence as
a contested point with both positions attributed, and asserts no negative.

**Blocker 3 — the day-start citation is re-aimed.** Round 1 cited the sunrise
day-start to xii.78–79 with i.51–52, neither of which mentions sunrise. This
round cites it where the ledger actually supports it: *Sūrya Siddhānta* i.12,
which defines the civil reckoning by counting sunrises (`S1-c`), and the
translator's note to i.12–13:

> The civil (sāvana) day is the natural day: it is counted in India, from sunrise
> to sunrise — · `S2-a`

The caveat is stated in the field itself rather than in prose beside it.

**Blocker 4 — no undated primary text, no unmarked transliteration.** No date or
age is asserted for the *Sūrya Siddhānta* anywhere in this file, because the
ledger contains none. Al-Bīrūnī is dated because his ledger record dates him
(c. AD 1030, trans. 1888/1910). And **no entry carries a `nameOriginal`** — the
ledger holds no Devanāgarī or IAST for any individual division, so round 1's
compiler-supplied forms are simply absent rather than corrected.

**Choghadiya blocker 1 — the Char three-way split is NOT reproduced, and here is
why.** Round 1 flattened a three-way grading spread into two camps. The honest
round-2 answer is that **this ledger carries a quality verdict for Char from one
source only.** The snippets that would carry the spread were not fetched. So the
JSON records the one attested grade and the contested-points entry says plainly
that the split is missing because it was not fetched — not because it is wrong.
Reproducing it from round 1's memory would be exactly the fabrication this round
exists to stop.

**Choghadiya blocker 2 — golden values re-pinned, with the reproducibility
defect named.** Two of the six golden values sit on pages that **do not name
their location**. That is stated in the `place` field in capitals, together with
the instruction that the test must *feed the published sunrise/sunset in* rather
than compute them. This is the same defect that made round 1's GV4 re-fetch as
Marcellus, New York.

---

## 3 · The conflicts, all kept

None of these is resolved. Each is in `contestedPoints` with both sides
attributed and tiered.

**Did Indians use hour-lords at all?** The two witnesses are 830 years apart and
flatly disagree. Burgess in 1860:

> they never made that division of the day into twenty-four hours upon which the
> order of regency depends — note to i.51–52 · `S2-f`

Al-Bīrūnī c. AD 1030:

> Nobody in India uses the hours except the astrologers, for they speak of the
> dominants of the hours — ch. XXXIV, p. 343 · `S3-f`

— and he quotes a *named* Indian text for the rule, Vijayanandin's
*Karaṇatilaka* (`S3-j`, `S3-k`). The fetcher flagged this conflict; it is carried,
not brokered.

**The etymology of *horā*.** Burgess (Tier B, 1860) argues the Greek loan:

> the name by which the hours are there called (horā — ὥρα) indicates beyond a
> question the source whence they derived it · `S2-g`

A contemporary almanac (Tier C) states the indigenous derivation instead, from
*(a)horā(tra)*, sunrise to sunrise (`S7-a`). Both are printed, both dated, both
tiered. **No modern scholarship on this is in the ledger** — Pingree was not
fetched — so this file reports *no consensus*, and its silence must not be read
as siding with the louder, older claim. This is the register question the
phase-1 report raised at Q17, and the only answer available on this ledger is to
print both and say what is missing.

**Does the night get its own lord?** Al-Bīrūnī draws the distinction himself:
Greek and Muslim practice gives the night a separate lord, whereas

> the Hindus make the dominus diei the dominus of the whole [νυχθήμερον], so that
> day and night follow each other — ch. XIX, p. 214 · `S3-c`

The fetcher's caution is carried into the JSON: `S3-a` and `S3-b` describe
**Muslim** astronomers' practice and must not be attributed to India on their
own. Current practice matches al-Bīrūnī on the horā — the planet cycle crosses
sunset without resetting, Venus followed by Mercury. **Choghadiya behaves the
opposite way**: on all seven weekdays its night sequence starts somewhere the day
cycle would not have reached. That contrast is recorded as an observation over
cited cells. No source in the ledger comments on it.

**The length of a Choghadiya — five figures, one of them wrong.** Ninety-eight
minutes, ninety-six, ninety, 90.125, and "about four hours" (where 3.75 ghaṭī is
in fact ninety minutes). Three of the five are on a single page. One source gives
96 minutes and 1.5 hours in consecutive sentences. Structurally **none of them is
a length**: every source that states the *rule* states a proportional one — the
sunrise-to-sunset arc divided by eight — so the fixed figures are all
idealisations of a twelve-hour day. The observed tables give 108.75 min by day
and 71.375 by night at one location and 101.25 / 78.75 at another, same date.

**And the etymology does not match the arithmetic, in the sources' own numbers.**
The name is glossed *cho* (four) + *ghaḍiyā* (ghaṭī) = four ghaṭī. The same
sources divide 30 ghaṭī by 8, which is 3.75. One almanac says 3.75 outright.
Only DrikPanchang marks the gap at all, and it does so with a hedge — its
sentence says the division *approximates* four ghaṭī rather than equalling them.

**Who wrote the 1860 notes?** The ledger labels S2 "Ebenezer Burgess, translator's
notes and commentary". The repository's own phase-1 report attributes the same
annotations to Whitney. **Nothing in this ledger resolves it** and no snippet
bears on it, so the JSON uses the formula "the 1860 translation's translator's
notes" and names the ledger's attribution alongside. Settle it from the title
page before printing a name in shipped data.

---

## 4 · What is derived rather than sourced

The Choghadiya weekday table has closed forms. **They are the compiler's
arithmetic over the published cells and are stated by nobody.** They reproduce
all 112 cells with zero failures, and they live in
`variants[V3].compilerDerivations` behind an explicit `warning` field so no
renderer can pick them up as sourced:

- **Day:** start on the weekday lord, step +1 through Saturn · Jupiter · Mars ·
  Sun · Venus · Mercury · Moon; the 8th cell repeats the 1st.
- **Night:** step −2 through the same list; the 8th cell repeats the 1st.
- **Night start:** the lord of the fifth weekday counted inclusively from the
  current one — equivalently five places on from the day's starting cell.
- **Weekday advance:** both the day-start and the night-start move three places
  along the list from one weekday to the next.

Only the first of these has any source at all behind it: the almanacs state that
the first division of each weekday is ruled by the weekday lord, and that the
eighth division of the daytime repeats it. **Nothing states a night-start rule or
a reason for the offset.** All four Choghadiya sources were read in full and none
explains it; that is `gaps[]`, `confirmed-absent`, with the sources named.

---

## 5 · The empty cells, and what was actually done to fill them

A confirmed gap is a good result only with evidence that someone looked. Twelve
gaps, each with `searchedWhere`, `searchTermsUsed` and `whatWasFound` taken from
the fetcher's real attempt log. The load-bearing ones:

| Gap | Confidence | Why that confidence |
|---|---|---|
| Sanskrit of SS xii.78–79 | `confirmed-absent` | Two GRETIL URLs 404'd; three Devanāgarī search terms logged; one archive item returned a 146-byte stub |
| No Tier A text / Tier B scholarship for Choghadiya **in this ledger** | `confirmed-absent` | Four sources read in full, two full query strings logged, Google Books unopenable |
| Choghadiya in the classical Sanskrit muhūrta corpus | **`could-not-determine`** | The searches found nothing, **but Muhūrtacintāmaṇi, Muhūrtamārtaṇḍa and printed Gujarati/Marathi pañcāṅgas were never opened.** The fetcher says so; the compiler refuses to upgrade it |
| Tier B scholarship on the horā | `confirmed-absent` (ledger-scoped) | Pingree's two standard works were not fetched. Stated, not implied |
| Grades for Udveg, Labh, Amrit, Rog | **`could-not-determine`** | The captured sentences give the *ruler's* benefic/malefic nature, not a grade for the division. Both sites plainly have a section per name, so this is a hole in the fetch |
| Polar / high-latitude behaviour | **`could-not-determine`** | **No polar query appears in the fetcher's log at all.** Recorded as a hole in the fetch, not a finding about the traditions |

Note the pattern in the two `confirmed-absent` rows about Choghadiya and Pingree:
both are scoped to *this ledger*, not to the world. The world-scoped version of
the same question is the `could-not-determine` row directly beneath it. Round 1
collapsed that distinction three times out of six, and the collapse is what turns
a missing row into a closed question.

**The refusal that mattered most:** four Choghadiya quality cells are empty.
Inferring "the Sun is malefic, therefore Udveg is inauspicious" would have filled
them plausibly and would have been completion-by-inference — FRAMING A-2, the
site's worst accuracy failure mode. The cells stay empty.

---

## 6 · Deliberately not built

**No comparison row between the horā and the day-Choghadiya.** Both start on the
weekday lord; both step the same direction through the same seven-planet list;
one divides by eight, the other by twelve. **No source in this ledger makes that
comparison**, and FRAMING §2.4 says that where no scholar has made it there is no
row. The observation is confined to the contested-points prose, deliberately kept
out of every machine-readable field, so that nothing can render it as a finding.
A future round wanting it needs a named source, not better arithmetic.

**No merge of al-Bīrūnī's hour-names into the ruler table.** He gives twelve day
and twelve night names with a Lucky/Unlucky column of their own, and says
explicitly that this is a naming layer distinct from the regents. They sit in
`variants[V1]`, with Sachau's own `(?)` marks on four night-names carried through
unchanged rather than tidied, and with al-Bīrūnī's own hedge about their source
reported as his hedge.

**No merge of Vaar Vela / Kaal Vela / Kaal Ratri into the seven-name set.** They
are overlay markers rendered on top of the Choghadiya cells. Recorded in
`variants[V4]` purely so a later round does not absorb them.

**Sources used for nothing.** S9 (Prokerala) came back through an extraction
model rather than being read directly; it is marked `secondHand` in `sources[]`
and is cited in **no** entry and **no** golden value. S8-f — a Sanskrit verse
presented with no text, author, chapter or verse number anywhere on its page — is
recorded as evidence for a provenance gap and supports no row. S10 (Wikipedia) is
CC BY-SA, which is not among the four verdicts FRAMING §4.1 permits, so it is
`cite-only`.

---

## 7 · For whoever builds the renderer

1. **Two ruler columns, two weights.** Tier A on horā, Tier C on Choghadiya. Per
   the maintainer's grid ruling, zmanim, shichen, Egyptian and Babylonian get
   none, and nothing in this file offers them one.
2. **The weekday label on the horā column is Tier C even though the sequence is
   Tier A.** Do not let one badge cover both.
3. **Feed published sunrise/sunset into the golden-value tests.** Do not compute
   them — two of the six source pages do not name their location, and a bare
   re-fetch will silently return a different city.
4. **`quality` is absent on all seven horā entries and on four of the seven
   Choghadiyas.** Render those as "not attested in this witness". Never fill from
   a neighbour.
5. **`nameOriginal` is absent everywhere.** There is no Devanāgarī or IAST in the
   ledger for any individual division.
6. The Choghadiya closed forms are the thing *under test*, not the reference.
   Assert against `variants[V3].table`, which is the published data.
7. Nothing here is an efficacy claim. *Auspicious*, *benefic* and *malefic* are
   the sources' vocabulary, reported as theirs.

**Gate:** `node scripts/research-validate.mjs --dir research/horae/v2 --strict`
→ `1 file(s) · 0 violation(s)`.
