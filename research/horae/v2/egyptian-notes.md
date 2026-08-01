# Egyptian hours — compiler's notes, round 2

**Dossier:** `research/horae/v2/egyptian.json`
**Compiled:** 2026-08-01 · COMPILER role only (fetcher/compiler split, RESEARCH-PROTOCOL §3 C3)
**Ledger:** the round-2 Egyptian fetcher ledger, 10 sources / 78 snippet ids (S1-a … S10-g)
**Constraint honoured:** every citation in the dossier is a sid present in that ledger. No source
was introduced. Nothing was cited from the compiler's own knowledge.

---

## 1 · What changed against round 1

| | round 1 | round 2 |
|---|---|---|
| night hour-names | 8 of 12 | **10 of 12**, all sid-backed |
| day hour-names | 0 of 12 | **12 of 12**, all sid-backed, all caveated in-field |
| ruler column | **filled** with Amduat hour-goddesses | **absent** — `hasRulerColumn: false`, `ruler` omitted from all 24 entries |
| gaps | one bare string, no search evidence | 6 objects with `searchedWhere` / `searchTermsUsed` / `whatWasFound` |
| golden values | USNO rise/set vectors (source not in any ledger) | 2 attributed published values + 1 **recorded absence** |
| in-copyright quotation | Parker/Ainsworth/BMCR text present | **none** — paraphrased throughout, mechanically checked |

Twenty-two of twenty-four rows now carry a name. The two that do not are the Ninth and Tenth
Divisions, and they are empty **because no snippet supplies a name**, not because the source is
silent — see §5.

---

## 2 · The ruler column: why it is empty and what the emptiness costs

The maintainer's grid ruling settles this, but the ledger independently supports it on four lines,
and the dossier states all four rather than leaning on the ruling:

1. **Budge prints both series and never joins them.** *Gods of the Egyptians* II ch. XIX gives
   hour-deities at §XI and §XII and planet-deities at §XIII — on facing pages, non-intersecting.
   Jupiter is recorded as having no god at all. [S4-g, S4-h, S4-i]
2. **The one operative Egyptian corpus where hour-lords would be expected does not have them.** The
   Demotic Magical Papyrus uses hours as bare clock-times and separately invokes planets, and never
   joins the two; whole-file counts `hour` 13, `planet` 3, `Saturn` 1 (that one in a modern
   editorial note). [S5-a, S5-b, S5-c, S5-d, S5-e]
3. **Budge's whole Amduat volume names exactly one planet, as a picture** — the five-rayed Venus
   star at the door of the Sixth Division. [S1-d]
4. **Cassius Dio names no Egyptian hour.** He credits the planetary week to the Egyptians, gives the
   hour-rotation, *calls the practice comparatively recent*, and names no Egyptian hour, hour-name or
   source. Early 3rd c. AD, in Greek, at second hand. [S6-a … S6-d]

**The cost, stated:** Dio is real evidence and it is not thrown away. It lives in `variants` with
its own three positions, so a reader can see exactly what the classical attribution says and why it
will not carry a pharaonic column. What is refused is the move from "Dio says the Egyptians ordered
the planetary cycles this way" to "here is the Egyptian hour-lord table."

**Round 1's specific error, named:** it filled `ruler` with the Amduat hour-goddesses. An
hour-goddess in a funerary cosmography is the hour's own tutelary figure inside a book about the
sun's night journey; a *ruler* in this project's grid is a member of a rotating planetary sequence.
Those are different objects. The goddesses are preserved — they are the `name` of every night
entry — but they are not a ruler column and the dossier says so in `rulerColumnJustification`.

---

## 3 · The day hours: how twelve empty cells were filled, and what the filling is worth

Source is **Budge, *Gods of the Egyptians* II (1904), ch. XIX §V, p. 294** — heading at S4-a, the
twelve names at S4-b. Three problems, all carried into the data rather than smoothed away:

- **The pairing is column-order, not a stated line.** The Internet Archive OCR flattens Budge's two
  printed columns, so the numbered hour-labels print as one block and the names as another. The
  fetcher confirms the name order runs 1–12 but records explicitly that no line was seen pairing a
  name to a number. **Every one of the twelve `name` values therefore ends `— hour-pairing
  uncertain`.** A renderer that shows only the name still shows the caveat; that is the C4 rule
  ("the caveat must live in the field") applied literally.
- **The list is unsourced.** §V, §VI, §XI and §XII carry no source footnote, while §XIII (planets)
  and §XIV (dekans) on the very next pages footnote Brugsch and Lepsius. [S4-j] That asymmetry is
  recorded and not explained away.
- **Budge contradicts himself twice over.** §VI says the night deities are these same twelve names
  in the same order [S4-c]; §XI gives a completely different twelve-name night series [S4-d, S4-e];
  §XII gives a completely different twelve-name *day* series [S4-f]. All three are in `variants`.

**What was deliberately NOT done:** §XII was not distributed across the day rows. The fetcher stated
outright that hour↔goddess↔god triples could not be read off that OCR and instructed the compiler
not to treat the order as attested. Two incompatible day-lists in one chapter is a finding about the
witness; flattening it into one tidy table would destroy the finding. The list is recorded whole so
a human with the printed page can finish it.

---

## 4 · The night hours: which cells came from where

| # | Division | Name in dossier | Witness |
|---|---|---|---|
| 1 | I | Ushem-hat-kheftiu-nu-Ra | Budge 1905 p. 20 [S2-a] |
| 2 | II | Seshet-maket-neb-s | Budge 1905 p. 43 [S2-b] |
| 3 | III | Tent-baiu *(contested)* | 1905 p. 50 vs 1906 p. 121 [S2-c, S3-g] |
| 4 | IV | Urt-em-sekhemu-s *(1906 only)* | 1906 pp. 97, 132 [S3-d, S3-h] |
| 5 | V | Sekmet-her-abt-uaa-s *(two readings)* | 1906 pp. 97, ~135 [S3-e, S3-i] |
| 6 | VI | Mesperit-ar-at-maatu *(1906 only)* | 1906 pp. 97–98, 148 [S3-f, S3-j] |
| 7 | VII | Kheftes-hau-hesq-Neha-hra *(two readings)* | 1906 ~p. 150 + p. 98 [S3-k, S2-d] |
| 8 | VIII | Nebt-ushau | 1906 ~p. 152 [S3-l] |
| 9 | IX | **empty** | name exists in bat12, not captured [S2-j] |
| 10 | X | **empty** | name exists in bat13, not captured [S2-j] |
| 11 | XI | Sebit-nebt-uaa-khesfet-seba-em-pert-f | Budge 1905 p. 233 [S2-i] |
| 12 | XII | Maa-nefert-Ra | 1906 p. 192 + 1905 p. 257 [S3-m, S2-e] |

**The round-1 hole (hours 4, 5, 6) is closed by vol. III, and the closure is attributed.** Budge's
1905 vol. I has no hour-name formula in those three chapters — established by the fetcher's pattern
scan over all twelve chapter files, not by impression. His 1906 vol. III supplies a goddess for each,
twice over (summary list and running text). Whether the *Amduat itself* names them is unresolved:
Hornung's *Texte zum Amduat* is the critical edition that would decide it, was not obtained, and is
in copyright and unquotable under FRAMING §4 in any case. **So those three cells are attributed to
Budge 1906 and to nobody else, and the `name` field says so.**

---

## 5 · The two empty cells are a *different kind* of empty, and the distinction matters

Divisions IX and X carry no name here. That is **not** a claim that they have none. The fetcher's
pattern scan records `name of (the|this) (hour)` matching in `bat12` and `bat13` — the Ninth and
Tenth — so a name is present in the witness and was simply not quoted into the ledger. [S2-j]

That is recorded as `confidence: "could-not-determine"`, against `confirmed-absent` for the other
five gaps. **The cheapest outstanding fix in this whole dossier is to open `bat12.htm` and
`bat13.htm` and read the colophon.** Filling those two cells by analogy with their neighbours would
be exactly the completion-by-inference the project forbids (FRAMING §5 A-2), and it is the one place
in this compile where the temptation was real.

---

## 6 · Textual chaos that a downstream page must not tidy

Every divergence below is *inside Budge or inside an OCR of Budge*. There is no second author
anywhere in the name data, so none of them can be adjudicated.

- **Division VII**, three divergences at one locus: name (Thephet-Asar / Thephet-sheta /
  Thephet-shetat), gate (Ruti-Asar / Kuti-Asar / Ruti-en-Asar), goddess (Kheftes-Hau-hesq-Neha-hra /
  Khesfet-hau-hesqetu-neha-hra).
- **Division XII**: the 1905 chapter heading prints the **gate's** name as the division's name.
  Budge's own errata leaf corrects it; his Contents already had it right. [S1-a, S1-c, S2-g]
- **Division V**: `Sekmet-her-abt-uaa-s` (summary) vs `SEMix-HER-ABT-uiA-s` (running text, OCR
  corrupt). Quoted as printed and labelled corrupt, not silently repaired.
- **Division VI**: Metchet-nebt-Tuat vs Metchet-mu-nebt-Tuat; gate broken as `Sept-` vs `Sept-Metu`.
- **Budge vs Budge on gates**: 1906 p. 102 says the Am-Tuat divisions are considered without
  reference to Gates; his own summary four pages earlier prints gate-names for IV onwards. [S3-q]

**Practical warning recorded in `variants`:** the Internet Sacred Text Archive transcription
reproduces both errata'd chapter headings **uncorrected**, and its own `errata.htm` contains nothing
but a transcription typo fix for p. 140. Anyone extending this dossier by reading chapter headings
off that site will import two errors the author personally corrected in 1905.

---

## 7 · The arithmetic: what an engine may and may not claim

**The twelve are attested. Equal twelfths are not.** Every source in the ledger that says how the
hours were *found* describes a table or an observation, never a division:

- water clock filled at sundown; each hour begins at the next mark of **that civil month's scale** —
  twelve scales for twelve months [S8-e, S8-f]; corroborated as one interior row of holes per month
  [S10-c];
- twelve night hours whose length shifted with the season [S9-a, S9-c];
- decans produced **unequal** stretches, because no real stars both rise heliacally on the right days
  and come up at evenly spaced moments [S10-a, S10-b];
- Budge himself raises the summer-night objection and answers it *theologically* — divisions I and
  XII are ante-chambers [S3-c].

**Consequence for the site, stated in `divisionRule`:** if the engine divides sunset→sunrise and
sunrise→sunset into twelve equal parts, that is the **modern seasonal-hour convention** and the page
must label it as the site's convention, not as the Egyptian procedure.

**Golden values.** Round 1's USNO rise/set vectors are gone: no astronomical-data source is in this
ledger, so citing one would introduce a source. In their place are two *attributed published values*
— Borchardt's 14:12 finger ratio via Parker [S8-i], and the two rival answers to which civil month
carries the shortest night [S8-g vs S10-d] — plus a third `goldenValues` entry that **records the
absence** and explains what a rise/set vector would actually be pinning.

Note what was **not** derived: the 14:12 ratio was not converted into a night-length ratio or a
latitude. No source in the ledger does that, so doing it here would have been a fabricated number
carrying the site's authority — the exact failure shape FRAMING §C-1 calls out for archaic units.

---

## 8 · Copyright handling

- **Quotable (pd-us, pre-1930 threshold, FRAMING §4.3):** Budge 1904 / 1905 / 1906, Griffith &
  Thompson 1904, Brugsch 1883, Cary's Loeb Dio 1914. These are quoted verbatim in `sources[]` with
  locus and PD ground.
- **Cite-only (in copyright):** Parker 1950 (ISAC free PDF, © 1950 University of Chicago, renewal
  **not** verified and not asserted), Ainsworth 2018 (© author), Brack-Bernsen's BMCR review.
  **No verbatim text from any of the three appears in the dossier.** Their `sources[]` entries carry
  a paraphrase, `quotable: false`, `verbatimWithheld: true` and a pointer back to the fetcher ledger
  sid where the words live.
- **Not quoted at all from Brugsch:** no hour name. The volume is autographed and its OCR is
  unrecoverable; only the printed contents lines were legible, and they are used solely to say
  *where the material is* so a human can fetch it.

**Mechanical check run:** every window of 6+ consecutive words from all 22 in-copyright ledger
snippets was tested against the finished dossier. Result: **one** 6-word hit, `"the twelve hours of
the night"` — a stock domain phrase that is also the literal wording of Budge's own §XI heading
(public domain). Eleven distinct paraphrases were rewritten during the compile because the first
draft echoed source wording; that rewrite pass is why the check is worth running rather than
asserting.

---

## 9 · Validation

```
node scripts/research-validate.mjs research/horae/v2/egyptian.json --strict
→ [research-validate] 1 file(s) · 0 violation(s)     exit 0
```

- **C1** — all 78 `sources[]` entries carry `fetched: true` and a non-empty snippet field.
- **C2** — all 6 gaps are objects with `searchedWhere[]`, `searchTermsUsed[]`, `whatWasFound`,
  `confidence`.
- **C3** — all 26 distinct sids used across `entries` / `variants` / `goldenValues` resolve into the
  ledger; sid-set checked programmatically, 0 unresolved. No entry has an empty `snippetIds`.
- **C4** — every entry whose `note` hedges carries the same hedge in `name` and `quality`. Verified
  by the validator, which finds no field-contradicts-note pair.
- `ruler` appears on **0 of 24** entries; `hasRulerColumn` is `false`.

---

## 10 · Outstanding, in priority order

1. **`bat12.htm` / `bat13.htm` colophons** — closes the last two empty name cells. Minutes of work.
2. **Jéquier, *Le Livre de ce qu'il y a dans l'Hadès* (1894)** — public domain, and the only cheap
   way to break the Budge monopoly on every name in this dossier. Round-1 attempt failed on an
   accented-filename URL encoding; not re-attempted in round 2.
3. **Brugsch p. 57, via the Heidelberg page images** — `Die Sonne in den 12 Stunden des Tages`, the
   day-hour layer, blocked here by an anti-scraping challenge and openable by a human in seconds.
4. **Symons & Khurana, sundial catalogue (JHA 47, 2016)** — paywalled; the single most relevant
   modern source for the day side, which currently has names but no instrument and no arithmetic.
5. **Borchardt 1920** — would be public domain if found; Parker's source for both the 14:12 ratio and
   the ca. 1630–1510 BC redating, and the principal pre-1930 treatment of **shadow clocks**.
6. **Hornung, *Texte zum Amduat*** — settles hours 4/5/6 and the Fifth Division reading. In
   copyright: could be *consulted* and cited, never quoted.

Items 1–3 are free. Items 4–6 need library access or money, and until they land the day side of this
system rests on one unsourced list in one 1904 compendium, read off a flattened column — which is
what §3 above and `honestLimits` in the dossier both say in as many words.
