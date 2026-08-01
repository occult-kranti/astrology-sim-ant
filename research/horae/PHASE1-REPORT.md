# HORAE MUNDI — PHASE 1 INTEGRATION REPORT

**Six dossiers commissioned. Six adversarially audited. `overallUsable: false` on all six.**

Date: 2026-08-01. Scope: `research/horae/` only. Nothing under `assets/` or `pages/` was touched
in phase 1 and nothing should be until the rulings in §2 are made.

This report exists to stop phase 2 from writing code against data that has not survived audit. It is
organised so a maintainer can read §1 (verdicts), make the §2 rulings, and hand §3–§4 to whoever
writes the engine.

---

## 0. THE SYSTEMIC FINDING, STATED FIRST

Across roughly fifty rejected verdicts in six independent audits, **the dominant failure mode is a
citation that does not say what it is claimed to say.** Counting by the auditors' own `failureKind`:

| failureKind | approx. count | what it means |
|---|---|---|
| `fabricated-citation` | ~14 | a quoted string, page, chapter or line number that is not there |
| `invented-attribution` | ~12 | a real claim credited to a source that does not make it |
| `merged-conflict` | ~10 | two live positions flattened into one tidy answer |
| `unverifiable` | ~6 | a figure carried at second hand and never recomputed |
| `tier-inflation` | ~4 | Tier C practitioner material shipped under a Tier A locator |
| `verbatim-copyright` | ~3 | in-copyright text reproduced under a `cite-only` label |
| `efficacy-claim` | 1 | a false absence-claim about efficacy, refuted by the dossier's own witness |

Roughly **half of all rejected findings are rule-1 and rule-7 failures** — the two rules the brief put
first. Not one of them was a hallucinated fact in the ordinary sense; every one was a real claim
attached to the wrong locator, or a real locator asked to carry a claim it does not make. That is the
failure this phase was designed to catch and it caught it in all six systems.

Two further patterns worth recording before anyone writes code:

**Confirmed gaps were fabricated in three of six dossiers.** Shichen declared the 120-ke episode
unattested when 隋書 卷19 carries it explicitly in the section quoted five times elsewhere. Vedic
declared an equal-hour horā "searched for and not found" when its own Tier A source defines the horā
as a twenty-fourth of the day on the page it quotes. Zmanim declared the Vilna Gaon's own words
unreachable on one misspelling ("Biur" for Sefaria's "Beur"). **A false confirmed gap is worse than a
missing row, because downstream it reads as settled and tells the next round not to look.**

**Machine-readable fields contradicted the prose beside them in four of six dossiers.** Shichen's
`fetched: true` sits next to prose saying "fetched at search level". Babylonian's
`pd: "no verbatim reproduction is made here"` sits in a file that reproduces Steele and Hunger
verbatim. Egyptian's `ruler` field is filled on a system whose own `scopeNote` says has no rulers.
Vedic's `associations.extent` states an equal-thirds rule its own `contestedPoints` concedes is
unattested. **A renderer reads the field, not the caveat.** Every fix below that moves a caveat out of
prose and into the field it governs is load-bearing, not cosmetic.

---

## 1. PER-SYSTEM VERDICTS

Nine verdicts for six dossiers — three dossiers split, because in each case one half survived audit
and the other did not, and a single verdict would have concealed which.

| # | System / sub-system | File | Verdict |
|---|---|---|---|
| 1 | Jewish sha'ot zemaniyot | `zmanim.json` | **NEEDS-REWORK** (light) |
| 2 | Vedic horā | `vedic-hora-choghadiya.json` | **NEEDS-REWORK** (moderate) |
| 3 | Choghadiya | `vedic-hora-choghadiya.json` | **NEEDS-REWORK** (provenance re-labelling) |
| 4 | Chinese shichen | `shichen.json` | **NEEDS-REWORK** (major — full re-sweep) |
| 5 | Egyptian division / astronomy | `egyptian.json` | **NEEDS-REWORK** (light) |
| 6 | Egyptian Amduat name layer | `egyptian.json` | **NEEDS-REWORK** (major, structurally thin) |
| 7 | Babylonian bēru | `babylonian.json` | **NEEDS-REWORK** (moderate) |
| 8 | **Babylonian maṣṣartu (watches)** | `babylonian.json` | **BLOCKED** |
| 9 | Materials — Agrippa / Heptameron | `materials.json` | **NEEDS-REWORK** (light) |
| 10 | **Materials — Picatrix column** | `materials.json` | **BLOCKED** |

Nothing is READY. Two things are BLOCKED and **must not be built**. Everything else has bounded,
enumerated fixes.

---

### 1.1 Jewish sha'ot zemaniyot — NEEDS-REWORK (light)

**The best-verified system in phase 1.** All three golden-value sets reproduce to the second against
the repository's own vendored Astronomy Engine and match the live Hebcal v1.4.2 API. All nine polar
latitude cut-offs reproduce within 0.004°. Every Tier A locator — Mishnah Berakhot 1:2 and 4:1,
Berakhot 26a, Pesachim 93b/94a, Rambam Tefillah 3:2 and 3:4, Rema OC 233:1, SA OC 443:1 and 459:2,
Terumat ha-Deshen I:1, MGA 58:1 and 233:3, MB 58:4 / 89:5 / 233:4 / 233:14 / 261:23 / 443:8 — was
fetched and says what the dossier says. Every licence label is accurate. No ruler invented, no
efficacy claim made. The MGA 233:3 finding that the "GRA" column predates the Gra is fully verified
and is the best single piece of work in phase 1.

**Blockers (5):**

1. **FALSE GAP, and it is the load-bearing one.** Gap #1 says the Gaon's own words could not be
   obtained because "Sefaria 404s on every ref form I tried". Sefaria spells it **Beur HaGra**, not
   Biur HaGra. `Beur_HaGra_on_Shulchan_Arukh,_Orach_Chayim` at 58.1 / 233.1 / 261.2 / 459.2 all
   return HTTP 200, Lemberg 1893, Public Domain, quotable. The text settles contested point #1 in the
   Gaon's own voice and rejects Magen Avraham 58:1 by name. Delete the gap; cite the primary.
2. **MERGED CONFLICT on the derivation the whole system rests on.** `divisionRule` presents
   4 mil × 18 min = 72 and 5 mil × 18 = 90 as "end to end and entirely Tier A" with no dissent. Beur
   HaGra on OC 459:2 — the gloss on the very se'if cited for the 18-minute mil — calls that reckoning
   תמוה מאד ושגגה גדולה and concludes a mil is 3/8 of an hour (22.5 min), citing Rambam for 2/5 of an
   hour (24 min). None of 22.5, 24, 96, 112.5 or 120 minutes appears anywhere in the dossier. Rule 4
   requires both branches, attributed.
3. **26° is an unsourced number sitting in a regression table.** 16.1° and 19.8° confirm exactly as
   72- and 90-minute calibrations; 26° recomputes to 119.5–120.3 min — a 120-minute figure the
   dossier's single 18-minute mil cannot produce. It has no variant entry, no source id and no
   authority anywhere in the JSON, yet is printed as a polar cut-off row (40.57 N) a phase-2 test will
   encode. Derive it from the 24-minute mil or delete it.
4. **Two second-hand figures were never recomputed, in a file that recomputed everything else.**
   Misheyakir 11.5° is stated at ≈52 min before Jerusalem sunrise; it is 50.2–50.4 min on every
   equinox and equilux date tested. 10.2° is stated at ≈45 min; it is 44.1. These are KosherJava
   Javadoc approximations carried over unchecked — in the one row the dossier itself flags as
   fabrication-prone.
5. **Self-contradictory quotation policy.** MB 58:4 and 89:5 are declared CITE-ONLY on a
   "Wikitext / licence unknown" digitisation, then quoted in English twice. The underlying Mishnah
   Berurah is PD-US by pre-1930 publication, so the words are quotable and the cite-only label is the
   error — but the rule must be stated once and followed.

**After rework this is the richest system on the page.** Nothing in the golden values needs touching.

---

### 1.2 Vedic horā — NEEDS-REWORK (moderate)

**Blockers (4):**

1. **Tier inflation on the central division rule.** The dossier states the horā as "day arc ÷ 12 and
   night arc ÷ 12, giving 24 unequal (seasonal) horās" under Sūrya-Siddhānta authority, tagging all
   seven horā entries tier A / `SS-BURGESS-1860`. The Tier A source says something else: Whitney's
   note to the quoted verses calls the horā "the hours, or twenty-fourths of the day", of an
   astronomical day the same volume calls invariable. **The seasonal 12+12 split is attested only by
   shubhpanchang and drikpanchang — Tier C.** Split the datum: Tier A carries the Chaldean lord
   sequence, the first-hour = day-lord identity and the 24th-of-a-day definition; Tier C carries the
   seasonal computation. The shift from an equal 24th to a seasonal twelfth is itself publishable.
2. **False recorded negative.** `gaps[6]` says an equal-hour horā "WAS SEARCHED FOR AND NOT FOUND".
   The compiler's own primary source, quoted on the page cited, defines the horā as a twenty-fourth of
   the day. Strike and replace with the divergence.
3. **Mis-located dayStart citation, with a suppressed tension.** "Primary authority for the
   sunrise-bounded civil day: SS xii.78–79 with i.51–52" — neither locus mentions sunrise, and
   i.51–52's own note uses a **midnight-to-midnight** astronomical day. The correct loci are in the
   same volume and are stronger: **i.36** and, decisively, **xiv.18–19**, which ties the
   sunrise-reckoned sāvana day directly to "the regents of days, months, and years". Re-cite, and
   record the midnight/sunrise tension rather than dropping it.
4. **Undated primary text and an omitted text-critical caveat.** "Datable Sanskrit primary text" and
   "1500-year-old" appear with no date, no range and no scholar cited anywhere in the file. Separately,
   Whitney's note to the anchor passage calls xii.78–79 an **intrusion** into its chapter. Cite a date
   or drop the word; carry the intrusion remark.

Minor, same pass: the Devanagari/IAST forms for six of seven Choghadiyas and all seven horās are
compiler-supplied and unmarked, while the Chal entry correctly flags its own uncertainty.

**This is the only system in phase 1 with a legitimate Tier A ruler column.** See §3.1.

---

### 1.3 Choghadiya — NEEDS-REWORK (provenance re-labelling)

**The data is the best-verified name table in phase 1 and its provenance is the thinnest.** All 112
published weekday cells were independently re-derived and reproduce with zero failures; the closed
forms `CHALDEAN[(c0+k) mod 7]` and `CHALDEAN[(c0+5(k+1)) mod 7]` were re-run and hold. GV1 (Ahmedabad
2026-08-15) matches line by line with tolerance 0.

**And no primary text for Choghadiya exists in anything reachable.** Four practitioner almanacs,
Wikipedia (whose sole reference is a Buddhist-terms glossary), and targeted searches against the named
Sanskrit muhūrta corpus returned nothing. Date and place of origin unattested. No Tier B academic
treatment at all.

**Blockers (2):**

1. **Merged conflict on Chal/Chara — in the row the dossier offers as its preserved-conflict
   exemplar.** It reports mpanchang, astrosage, shubhpanchang and Wikipedia as counting Chal among the
   four auspicious. Three of those four in fact give it its own intermediate grade distinct from their
   auspicious group: mpanchang "Good", astrosage "good rather than fully auspicious", Wikipedia
   "Favorable". A three-way spread was flattened into two camps. Print three positions.
2. **Non-reproducible golden-value locators.** GV2, GV4 and GV5 use URLs with no date (GV4/GV5 also no
   geoname); the bare GV4 URL re-fetched today returned **Marcellus, New York**, not New Delhi. GV1 and
   GV3 show the correct dated, geoname-pinned pattern and reproduced perfectly. Re-pin, and add to GV5
   the ±1 minute declaration GV3 and GV4 already carry.

**Structural requirement for phase 2, not optional:** Choghadiya ships Tier C throughout and must
carry a standing note on the comparison view itself, not a badge. Putting an undated, primary-text-less
almanac division in the same table as a Tier A primary-text-attested division is the evidential-dignity
failure FRAMING §5 C-6 names by name. See contested point **Q41**.

---

### 1.4 Chinese shichen — NEEDS-REWORK (major, full re-sweep)

**The structural findings survive hostile checking and the attribution layer does not.**

Verified and strong: the fixed twelve equal civil divisions; the closed forms (`shichenIndex`, hour
stem, hour-spirit anchor) all recomputed by hand and correct; the 協紀辨方書 卷32 甲子日 and 乙丑日
rows confirmed 12/12 each from raw wikitext, on two independent rows; 午時三刻 arithmetic
reproduced; the 論衡 物勢篇 11-of-12 animal finding (辰 absent, dragon from 言毒篇) confirmed and
correctly refused completion; the "no fixed ruler" negative verified in three primary sources; the
100→96 ke arithmetic and the 天監六年 passage exact character for character; copyright hygiene clean
(longest CJK run 86 codepoints against a 300 cap).

**Blockers (5):**

1. **Entry-level attribution is FALSE on 11 of 12 entries.** Every entry but 辰 carries
   `"tier": "A", "sourceRef": "suishu-19"` while `quality` holds a classical name. Raw wikitext of
   隋書/卷19 contains **zero** occurrences of 雞鳴, 平旦, 食時, 隅中, 日昳, 晡時, 黃昏, 人定; 夜半
   occurs once in an unrelated star-observation sentence. 隋書 卷19 supports the ke arithmetic and the
   seasonal daylight/darkness split and **no branch name, no boundary and no classical name.**
2. **Four verified invented attributions**, each load-bearing: 杜預's 左傳 commentary claimed as
   zh-wiki's authority (杜預 appears 0 times there; the real citation is 张衍田《中国古代纪时考》2019,
   上海古籍, pp. 35–50 — obtainable, and the dossier miscites the title as 計時考); en-wiki
   transliterating 日昳 as "Rìyì" (0 occurrences; an entire contestedPoint rests on it); Lin (2007)
   reading 午時三刻 as 午初三刻 (he gives the numbers, never that reading); 五行大義 卷一 第五
   「論九宮數」 (the passage is in 第二「論五行及生成」).
3. **One fabricated quotation element.** `lunheng-14` presents as verbatim
   「亥、豕也，未、羊也，丑、牛也」; the text reads 「亥豕也，丑牛也」. Separately the dossier twice
   asserts 論衡 writes 虵; the cited page reads 蛇 both times.
4. **A false gap produced by not reading the dossier's own Tier A source through.** The 120-ke episode
   is in 隋書 卷19 explicitly — 「至哀帝時，又改用晝夜一百二十刻，尋亦寢廢。至王莽竊位，又遵行之。」
   Promote to Tier A and correct the substance: 哀帝 introduced it, 王莽 only continued it.
5. **A conflict resolved that is not resolved.** The two ke-naming conventions are declared aliases
   "RESOLVED by zh-wiki-ke". That alias holds only for the **96-ke** system; en-wiki's enumeration
   belongs to its 100-ke discussion and carries an explicit footnote saying 初四刻 ≠ 子正 by 1–5 minor
   ke. A third convention (子, 子一刻 … 子八刻, 丑) and a fourth (明代 时初 = 一至四刻) are never
   recorded.

**The consequence that makes this a re-sweep and not a patch:** `fetched: true` is contradicted by
its own prose on three source records, and the 120-ke false negative proves the boolean was not
earned. **No `fetched` value in this file may be taken at face value.** The whole source list needs
re-verification before any of it is used, and per-field `sourceRef` and per-field `tier` must replace
the entry-level ones.

Also: drop the 子午流注 organ/meridian column rather than ship it unverified (the intended primary
`zysj.com.cn` returns 403, not the "expired TLS certificate" recorded).

---

### 1.5 Egyptian — split verdict

#### 1.5a Division / astronomy layer — NEEDS-REWORK (light)

**The best pure-astronomy golden values in phase 1.** All 52 printed timestamps across GV1–GV3
reproduce to the second; the twelve intervals tile each span exactly with no residue; USNO was
re-queried live for all four dates and every published figure matched. The equinox asymmetry test
(day-hour 60m35s against night-hour 59m20s, because sunrise and sunset are refraction- and
disc-defined, not geometric) is a genuinely good bug-catcher and should be kept verbatim.

The framing decision that `divisionRule` is a **modern reconstruction**, arithmetically identical to
the Chaldean division already in `planetary-hours.js` and not an attested Egyptian procedure, is the
single most valuable judgement in the dossier and must survive into phase 2 unaltered.

**Blockers (2):**

1. **Arithmetic error.** `polarBehaviour` compares the longest night (13h28m) against 10h33m, which is
   the winter-solstice **day**, not the shortest night. USNO gives Luxor's shortest night as 10h15m
   (2026-06-21 sunset 18:44 → 06-22 sunrise 04:59). True ratio 1.314:1, ~31% — not "~25%" (JSON) and
   not "1.28:1" (notes §7). The notes propose publishing that wrong number against the ancient 14:12.
2. **Sunrise is not attested** as the start of the twelve day-hours by anything fetched, yet dayStart
   and contestedPoints call all three boundaries "attested" — contradicted by the dossier's own
   "NO SHADOW-CLOCK DATA AT ALL" gap. Label it a modelling convention.

#### 1.5b Amduat name layer — NEEDS-REWORK (major, structurally thin)

**Blockers (6):**

1. **RULER COLUMN FILLED ON A SYSTEM THE DOSSIER SAYS HAS NO RULERS.** Eight night entries put the
   Amduat hour-goddess in the shared `ruler` field that carries "Saturn"/"Sun" in sibling dossiers and
   "unattested" in `shichen.json` and `zmanim.json`. Budge's goddess "guideth this great god" through a
   region of a funerary journey; nothing makes her the governor of a time-unit. Set `ruler: 'unattested'`
   on all twelve and move the names to `associations.hourGoddess`.
2. **Hour 3 encoding defeats its own caveat.** `ruler` is correctly held AMBIGUOUS but
   `name` = "Tent-baiu", so any renderer showing `entry.name` publishes the forbidden assignment.
3. **VERBATIM IN-COPYRIGHT TEXT** — see §5.1. Hard blocker.
4. **False absence-claim in honestLimits** — see §5.2. Hard blocker.
5. **Fabricated quotation and a manufactured conflict** — the BMCR string does not exist, and Parker
   fn 73 already holds, after Borchardt, that the Karnak scales are inherited and out of date. The
   dossier assigns Parker's own position to the opposing camp. See §2 **Q27**.
6. **Golden value 6 resolves a documented conflict** it says elsewhere it declines to resolve
   (asserting region 7 = "Thephet-shetat" when Budge's Contents and running text both give
   "Thephet-sheta"; only the errata gives the longer form), and misquotes the errata line number.
   Assert the negative only.

**The honest shape of this row:** 8 of 24 hour-names filled; hour 3 ambiguous; hours 4, 5 and 6 with
no goddess name in the public-domain witness; **all twelve day-hours entirely empty**; gate names for
only half the night; every name in a superseded 1905 romanisation with no modern transliteration
anywhere. See §4.2 and §6.

---

### 1.6 Babylonian bēru — NEEDS-REWORK (moderate)

**The headline finding is verified and it is the strongest confirmed negative in phase 1.** No
cuneiform source assigns a planet, god or any ruling power to a bēru or a watch. Re-read independently
across CAD B s.v. *bēru* A mngs. 1–3 (pp. 208–211), CAD Q s.v. *qablītu* mng. 2 (p. 5), CAD U/W s.v.
*urru* A in *šāt urri* (pp. 244–245) and CAD M/1 s.v. *maṣṣartu* mng. 3d (p. 338) — together well over
a hundred loci in which time of day is specified, and **not one governing agent anywhere.**

GV-1 through GV-5 all verified: Steele SCIAMVS 14 Table 1 both ratios, every row summing to 360 UŠ;
MUL.APIN II ii 21/25/31/35; the unit arithmetic verbatim; ABL 1428:4 at CAD B 211.

**Blockers (4):**

1. **Invented attribution at the dossier's self-declared load-bearing point.** The "EN.NUN = whole of
   day/night, not a third" correction is credited to Gehlken 1991 and Brown–Fermor–Walker 1999–2000.
   Steele's n. 19 — the only support he gives — cites **al-Rawi and George (1991), AfO 38, 52–73**, and
   **Hunger (2001)**. Neither appears anywhere in the dossier. The finding is right; the chain behind
   `contestedPoints[0]`, `variants[v-massartu-sense]` and two source records is wrong. Locator also off
   by a page (p. 12, not p. 11).
2. **Fabricated primary-text strings in a machine-readable field.** Entries 2–5 and 8–11 carry
   `nameOriginal` values `2/3/4/5 KASKAL.GÍD GE₆` and `2/3/4/5 KASKAL.GÍD ūmu`, tier A, sourceRef
   `cad-b-beru`. **None occurs in CAD B s.v. bēru A.** The dossier's own gaps section says a list of
   twelve named Babylonian double-hours is a modern invention — and the dossier ships one. Set to
   `unattested` or move to a clearly-derived field.
3. **Night-bēru anchor contradicted by its own source.** Entries 1–6 set `anchor: 'sunset'`. CAD B 210
   renders all three night attestations **backward from a terminal event** — "at the last double hour of
   the night", "before midnight", "left before morning". The dossier quotes that wording in its own note
   and asserts the opposite in the data field. (The sunrise anchor for daylight is fine and verified.)
4. **Provenance self-contradiction** — see §5.1.

Also: the equinox identity "one watch = 2 bēru = 60 UŠ = 4 modern hours" sits in `divisionRule` as
plain fact when the dossier's own `derivedNotPublished` block declares that exact join attested
nowhere. Move it.

---

### 1.7 Babylonian maṣṣartu (the watches) — **BLOCKED. DO NOT BUILD.**

This is the only part of the Babylonian system that requires astronomy — the only part a Horae Mundi
engine would compute per location per week — and **it has no verified division rule and no golden
value.**

- The rule "each watch = one third of the ACTUAL daylight/night" is hard-coded as
  `associations.extent` on entries 13–18 and stated as fact in `divisionRule`, with three citations.
  **Smith, *Iraq* 31 (1969) 74–75 was not read** (paywalled to compiler and auditor alike).
  **Steele, "Short Time in Mesopotamia" (Brill 2019/2020) ch. 3 was not read** (Brill 403).
  **K.6476 / Oppenheim JNES 33 (1974) 202 was read in full and states no division rule and no length.**
- The only item actually fetched — the BMCR 2020.11.44 review — says "day and night are split into 3
  watches each". **Split into three is not the equal-thirds quantification an engine would implement.**
- Nothing in CAD *maṣṣartu*, *qablītu*, *šāt urri* or *bēru* states a division rule or gives a watch a
  length. CAD's "third watch of the night" is an ordinal, not a fraction.
- **No published Babylonian table of real watch boundaries for a real place and date exists** in
  anything read. Every published table is either schematic (latitude-free) or a single observational
  datum in a letter. There is therefore nothing to test an engine against.
- The one dedicated scholarly treatment of the question — Rochberg-Halton, "Babylonian Seasonal
  Hours", *Centaurus* 32 (1989) 146–170 — was unobtainable behind two HTTP 403s.

The dossier's own `contestedPoints[5]` concedes all of this: "NO cuneiform text read here states the
rule of division, and none gives a watch a length; 'one third' may be the modern description of a guard
rota judged by eye or by star." **The caveat lives in prose the code will not read while the tidy
answer sits in the field the code will read.**

**Unblocking condition, and it is a single, specific, achievable acquisition:** obtain **either**
Smith, *Iraq* 31 (1969) 74–75 **or** Steele, *Down to the Hour* (Brill 2019/2020) ch. 3 — and,
ideally, Rochberg-Halton *Centaurus* 32 (1989), which is the on-point authority for whether Babylonia
had a seasonal hour at all. Until one of those is in hand, the six watch entries carry a division rule
nobody has verified, and phase 2 must not compute them.

The Babylonian bēru row (§1.6) is unaffected and needs no astronomy.

---

### 1.8 Materials — Agrippa / Heptameron columns — NEEDS-REWORK (light)

**All six golden values verified verbatim against raw HTML** (raw fetch, not a summariser — the
dossier records that a summarising fetch returned *fabricated* Heptameron hour-angels, and every table
was therefore read off downloaded source. That method note should be preserved and followed).

Verified: Agrippa I.xliv's seven compound suffumigations token for token; the Hermes seven-aromatic;
the three mutually inconsistent suffumigation schemes in one chapter; the Scale of Seven's metals,
stones, angels and birds in exact order with Peterson's Zaphiel/Zaphkiel emendation correctly
distinguished from the printed reading; the Michael/Raphael swap from both sides; all seven Heptameron
perfumes against both Latin and English columns with Turner's two documented translation errors; all
24 Sunday hour-angels and all 16 Monday ones; the weekday triads, air-kings and winds.

**Blockers (5):**

1. **OPIUM — the primary blocker, and it is safety-adjacent.** The dossier asserts opium is not named
   by its own cited primary text. **Agrippa I.xxv lists "Mandrake, Opium, and those things which
   stupifie" among Saturnine plants** — in a chapter the dossier draws three other fields from. The
   narrow point about I.xliv is correct and worth keeping (the compound fume there really is black
   poppy seed, not opium latex, and the pharmacological distinction is real), but the generalised
   absence-claim is false, and it is the premise of a contestedPoint that frames the repo's existing
   harmNote as possibly resting on a practitioner conflation. There is a primary-text warrant. Restate
   as a locus/scheme distinction exactly parallel to V4.
2. **Mars conditional table-metal, encoded into GV5.** Agrippa II.xxii gives Mars iron-or-sword when
   fortunate and **red brass when unfortunate**, so the Moon is not "the only planet" with a
   conditional table metal. GV5 flattens Mars to unconditional; **a test written against GV5 would
   assert Mars is unconditional and encode the error permanently.** Also widen the substrate field:
   Mars permits "the Stone Correola" and Mercury "Virgin Parchment", neither representable in a
   metals-only column.
3. **Peterson quoted selectively in dayStart.** The quoted sentence describes the manuscript
   tradition's intended scheme; the immediately following sentence — "H follows the same scheme for the
   day hours, but realigns the night hours" — distinguishes the Heptameron and is omitted. Quote both.
   (The sunrise verdict itself survives on the independent table-layout argument, which is stronger.)
4. **S4 self-contradiction on verbatim Peterson** — see §5.1.
5. **Tier and transcription precision.** Entry-level `tier: "A"` with `sourceRef: "S1,S2,S3"` silently
   absorbs Peterson's Tier B emendations (Zaphkiel, the Heliotropion and ambergris glosses, Sarabotres)
   and S4 is in no entry's sourceRef. The Jupiter `colourClass` attribution is inverted. Two
   golden-value strings will not match the source: `Malcha betharsisim` → `Malcha betharsism hed
   beruah schehalim`, and GV1 `Mathon` (Latin column) → `Mathun` (English). The Greer–Warnock ISBN as
   printed is twelve digits and cannot resolve: `978-1-257-77958-1`.

---

### 1.9 Materials — Picatrix column — **BLOCKED. DO NOT BUILD.**

Colour, suffumigation, offering and prayer-angel from the Picatrix were the four fields this dossier
was specifically commissioned to produce. **Not one could be verified.** Both translations
(Greer–Warnock 2010–11; Attrell–Porreca, Penn State 2019) are in copyright, neither was available, and
**the compiler declined to use the unauthorized full-text copies that circulate — not even to check a
page number.** That refusal is correct and should be recorded as a positive finding, not a shortfall.

Every Picatrix cell in the dossier is correctly marked `unattested`. No Greer–Warnock or
Attrell–Porreca string appears anywhere in the file, in any field, in any paraphrase presented as a
quotation. The auditor tried to break this and could not.

**Consequences that decide grid shape:**

- Book and chapter are established (III.7, whose rubric covers sacrifices, prayers and suffumigations).
  **Pages are not — for either edition, for any planet.** A citation without a page is not the citation
  the brief asked for.
- **The offerings column is empty across the entire matrix.** Agrippa I.xliv and the Heptameron perfume
  sections supply no offerings category, and Picatrix III.7 — the one locus where offerings would be —
  is exactly what could not be verified.
- **Agrippa supplies no ritual garment colour.** The Scale of Seven was enumerated row by row: Angels,
  Planets, Birds, Fish, Animals, Metals, Stones, integral members, holes of the head, habitations of
  infernals. **There is no colour row.** Agrippa's I.xxiii–xxix colour statements describe a class of
  matter, not what an operator wears, and must not render in a colour column beside a Picatrix garment
  colour — they are not answering the same question.

**Do not fill this column from the repo's existing `assets/js/core/data/planetary-magic.js`.** Those
values are a Tier C practitioner compilation and nothing in phase 1 corroborates them. The dossier
additionally flags that the repo's `Raucayehil` (Jupiter) and `Raucahehil` (Mars) differ by one letter
and may be one name corrupted twice, and that the repo's Sun-stone "diamond" is attested at no Agrippa
locus while Agrippa gives the diamond to Mars twice.

**Unblocking condition:** acquire an authorized copy of Attrell–Porreca (Penn State, 2019,
ISBN 978-0-271-08212-7) or Greer–Warnock. This is a purchasable book, not a lost manuscript. Until it
is in hand, **the Picatrix column stays empty and the emptiness is the finding.**

---

## 2. THE CONTESTED POINTS — ONE LIST

**These are the points the build must not resolve silently.** Every one is a live disagreement between
named sources, or a genuine editorial fork with no textual answer. Each is phrased so it can be
answered yes/no or pick-one. A default chosen by whoever writes the renderer is a substantive
editorial claim made by accident.

### Cross-system — these decide the shape of the grid, answer these first

**Q1.** Does the comparison grid carry a **"ruler" column at all**, given that four of six systems
cannot legitimately fill it (§3.1)? *(yes, with four columns reading "unattested" / no, drop the column
and give Vedic horā its rulers in a system-specific field)*

**Q2.** May a Tier A primary-text-attested division (Vedic horā, Babylonian bēru) sit in the same
table as a Tier C almanac division with no primary text at all (Choghadiya)? Does the tier badge
suffice, or does Choghadiya need a **standing note on the comparison view itself**? *(badge / standing
note / separate the tiers into different views)* — FRAMING §5 C-6.

**Q3.** Does the grid carry a single **"chatzot" or "midpoint" row** across all columns? In the Ateret
Torah system and the alos-16.1°-to-tzais-7.083° family, chatzot is explicitly **not** midday, so one
row across all columns states something false about at least two of them. *(single row / per-variant
row / no midpoint row)*

**Q4.** Does the grid **score robustness**? Shichen has no polar failure mode because it is a civil
clock; every other system fails at the poles because it is anchored to the sky. The shichen dossier's
own words: "a comparison page that scores robustness as a virtue is comparing a clock to a sundial and
awarding points." *(yes / no — present robustness as a property, never a score)*

**Q5.** May the site keep the label **"Chaldean unequal hours"** on `planetary-hours.js`, given that
nothing in the cuneiform record read in phase 1 corresponds to it and the planetary hour is a
Hellenistic construction? Keeping the traditional label is defensible; letting adjacency on the
comparison page imply Babylonian descent is not. *(keep with a disclaimer / rename / keep and
physically separate the rows)*

### Jewish sha'ot zemaniyot

**Q6.** Label the sunrise-to-sunset column **"GRA"**, **"Levush–Gra"**, or print both? MGA 233:3
attributes the position to the Levush (d. 1612), Lechem Chamudot (d. 1654) and Shiltei ha-Gibborim —
all before the Gra was born (1720); MB 443:8 says the Gra holds כמותם, the language of adherence.
Post-audit the question sharpens: **Beur HaGra OC 459:2 has the Gaon endorsing it in his own voice and
rejecting Magen Avraham 58:1 by name.** *(GRA / Levush–Gra / both)*

**Q7.** Are the 72/90-minute intervals **fixed clock minutes**, **proportional minutes**, or
**degrees**? Machatzit ha-Shekel OC 235:3 and Pri Megadim OC 261:2 for fixed; Minchat Kohen Ma'amar
2:4 for proportional; MB 261:23 in its own voice for the degree-based argument. All three are printed
in current luchot. *(pick one as default and disclose / offer all three / no default)*

**Q8.** **Which mil?** 18 minutes (SA OC 459:2) or 22.5 minutes (Beur HaGra on that very se'if, calling
the 18-minute reckoning תמוה מאד ושגגה גדולה) or 24 minutes (Rambam's Pesachim commentary as reported
by the Gra)? This decides whether the offsets are 72/90 or 90/112.5 or 96/120. *(pick one / carry all
three)*

**Q9.** **Equinox or equilux** as the calibration date for every degree value? R. Meir Posen holds
equilux; R. Yedidya Manet and R. Yonah Mertzbuch hold the astronomical equinox. About nine seconds for
16.1° — numerically trivial, but it means the canonical angles are not canonical, and prose must pick a
word. *(equinox / equilux)*

**Q10.** **Which refraction model?** 34′ (0.566°, KosherJava) giving Baal ha-Tanya tzeis 5.93°→5.95°,
or 31′ (0.516°, Manet for Israel) giving 5.88°. The published *degree* is a function of an atmospheric
assumption and different luchot embed different ones. Whatever is picked must be disclosed on the page,
not buried in the engine. *(34′ / 31′)*

**Q11.** **Sea-level or observer elevation?** Bursztyn (*Zmanim ke-Hilchatam* ch. 2): no zman other
than sunrise and sunset should use elevation. Zilber (*Birur Halacha* vol. 6 ch. 58 pp. 34, 42):
elevation should be accounted for. Karp (*Shimush Zekeinim* ch. 1 p. 17): obstructing horizons should
be factored in. About 4.6 minutes each way at 800 m. **Critically: this cannot be a global switch** —
degree-based zmanim are defined against the geometric horizon and are unaffected by construction, while
fixed-minute and proportional ones shift. One elevation policy applied to a whole table misstates at
least one row. *(sea level / observer elevation / per-row policy)*

**Q12.** Is chatzot the **midpoint** of the span or the sun's **meridian transit**? If transit, does
consistency require unequal morning and afternoon proportional hours — in tension with the plain sense
of Rema 233:1? Auerbach (*Halichot Shlomo*, Mo'adim 9:44) and Sternbuch (*Teshuvot ve-Hanhagot* VII:1)
take the night midpoint as sunset-to-alos rather than astronomical midnight. *(midpoint / transit)*

**Q13.** **Which shki'ah ends the Gra day** — the beginning of shki'ah (about an hour and a fifth
before tzeit) or the end (about a quarter hour before)? MGA 233:3 raises it directly. Roughly an hour
of disagreement about the endpoint of the whole span. *(beginning / end / both)*

**Q14.** Does the page **compute** any of the four polar positions or only **describe** them? Minchat
Elazar 4:42 ("do not go there"); Tiferet Yisrael (keep your home city's clock); Ben Ish Chai / Rav
Pe'alim Sod Yesharim 2:4 (call 6 a.m. sunrise); Mo'adim u-Zmanim vol. 2 §155 (the sun's high and low
points). These are four different clocks, not four phrasings of one. *(compute all / compute none,
describe only)*

**Q15.** Does the grid carry the **Komarno reckoning** — sof zman Shema at three *ordinary* clock hours
before chatzot? It abandons proportionality for one boundary and an engine whose model is only
`{count, span}` cannot express it, but the attribution chain is substantial (Shach, Yaavetz, Komarno,
Shevut Yaakov, Chatan Sofer). *(carry it and widen the model / omit and say so)*

### Vedic horā and Choghadiya

**Q16.** How much weight does the **1860 dissent** get? Whitney's note to SS xii.78–79 says horā is
Greek ὥρα and betrays the source of the whole system; Burgess's Concluding Note in the *same volume*
dissents, locating priority between the Hindus and the Chaldeans and citing Herodotus II.109. Modern
scholarship (Gansten 2020, on Pingree) sides with Whitney. Quoting a volume's translation while
suppressing that volume's translator's dissent is selective quotation. *(print both and date both,
noting modern consensus / footnote Burgess / omit Burgess)*

**Q17.** In what **register** does the page state the loanword consensus without writing a living
tradition's account of its own vocabulary off as folk error? The *ahorātra* derivation (BPHS 4.1–2) is
the tradition's assertion of indigenous origin and is still printed in site voice by contemporary
almanacs. Note also that the objection reported against it — that it violates Sanskrit word formation —
is attributed to no named scholar and currently fails the §2.4 `claimedBy` test. *(free text ruling
required)*

**Q18.** May the **arithmetic identity between day-Choghadiya and horā** be shown at all? It is true
and self-verified across all 112 cells — same Chaldean step, same weekday seed, eighths instead of
twelfths — and **no source makes the comparison**, which FRAMING §2.4 says means there is no row.
*(show as pure arithmetic with `direction: 'unknown'` and an explicit no-source line / do not show)*

**Q19.** **Chal/Chara** — the row prints how many positions? Post-audit the real shape is three:
Neutral (drikpanchang) / an explicit intermediate grade set apart from the source's own auspicious
group (mpanchang "Good", astrosage "good rather than fully auspicious", Wikipedia "Favorable") /
genuinely auspicious. *(two camps / three positions)*

**Q20.** **Chal, Char or Chara**, and is the Sanskrit *cala* or *cara*? Sources print all three forms
without comment and none adjudicates. *(pick a display form / print variants)*

### Chinese shichen

**Q21.** **Where does 子 begin** — 23:00 (mainstream, and the branch's own name 夜半 presupposes it) or
00:00 (Song dynasty, per Sôma, Kawabata & Tanikawa, PASJ 56(5), 2004)? Not a rounding difference: it
relabels every hour of the day. The discriminating test case is 23:30. *(selectable convention /
mainstream with the Song in a footnote)*

**Q22.** **When did the 96-ke reform take?** 1628 (崇禎曆書 project, per en-wiki); 1645 (時憲曆
promulgation, 順治二年 — most sources); 1668/69 (still argued at court in 康熙四年 = 1665, settled
after the Verbiest observatory trial, 清史稿 卷45); and the same source gives a fourth,
「應自康熙九年為始」 = **1670**. Whose date does a pre/post-reform toggle use, and does the page name
whose it is? *(pick one and name it)*

**Q23.** Is the 96-ke system a **European import**? It is universally told that way, and the Jesuit
role in 1645 is real — but 隋書 records the identical reform for the identical arithmetical reason
(100 ∤ 12) in Liang 天監六年 = **507 CE**, eleven centuries earlier, then abandoned. **No cited scholar
answers this and the site must not either.** This is the finding most worth putting on the page: the
"Western reform" was Chinese first. *(state the two dates and refuse the causal question — confirm)*

**Q24.** **早子時 / 晚子時** — does the day-pillar change at 23:00 or 00:00? A living dispute among
practising bazi astrologers; anyone born in that one hour gets a different chart; both sides cite
classical authority. Because this is a living tradition, **the wrong default is a substantive editorial
claim, not a UX choice.** *(23:00 / 00:00 / offer both / refuse to pick)*

**Q25.** **真太陽時** — read shichen off the civil clock or off local apparent time? Ürümqi and Beijing
share UTC+8 across ~30° of longitude, about two hours of apparent time, so the two conventions put a
Ürümqi birth **two shichen apart**. The classical texts state no correction; the classical clepsydra
was nonetheless set locally. Still a Tier C practitioner argument, not a scholarly finding. *(civil /
apparent / offer both)*

**Q26.** Is 昳 read **dié** or **yì**? A transliteration column has to choose. *(Note: the dossier's
attribution of "Rìyì" to en-wiki is fabricated — that article does not contain the string. Whoever
answers this must find a real source first.)*

**Q27.** **天德 or 寶光** as the sixth spirit? The 四庫全書 協紀辨方書 prints 寶光; most modern lists
give 天德. One spirit under two names, or a recension difference? Not established. *(one entry with
alias / two entries)*

**Q28.** May the **almanac layer share a column header with the planetary hour-lord**? 隋書, 論衡 and
五行大義 give the divisions, animals and phases and assign **no ruler to any hour**; rulership enters
only through the 協紀辨方書, keyed to the **day's** stem-branch. The dossier leans NO and the auditor
says the lean is right and should be adopted rather than left open. *(adopt the NO — confirm)*

### Egyptian

**Q29.** **Dawn or sunrise** for the Egyptian civil day? Parker SAOC 26 §32 holds dawn and treats it as
demonstrated; Sethe reaches a morning start by a different route; the sunrise alternative persists. The
stake is real — the choice shifts the Egyptian civil date assigned to a heliacal rising of Sothis and
therefore its Julian conversion, and by extension parts of New Kingdom chronology. *(dawn / sunrise —
and print both regardless)*

**Q30.** **Which boundary is "the" Egyptian day start** in the UI's day-start marker? Three are
attested for three purposes: dawn for the civil day (Parker §32), sunset for the night-hours and the
clepsydra fill (Parker §208) — and **sunrise for the day-hours, which is attested by nothing fetched
and is a modelling convention.** *(pick one and say what the marker means)*

**Q31.** Did the decanal night divide **sunset→sunrise** or **only full darkness**? Decans are observed
stars and twilight suppresses star risings. Unresolved from anything fetched; Neugebauer & Parker,
*Egyptian Astronomical Texts* I (1960) is where to check and was not obtained. **It moves every
night-hour boundary.** *(sunset→sunrise as declared model / hold the row until EAT I is read)*

**Q32.** **Karnak clepsydra — which month carries the shortest night, 10 or 9?** Parker SAOC 26 §208
reads II šmw = month 10; Schomberg argues month 9, which would make the clock ~250 years older.
**Restated post-audit: this is the whole of the dispute.** Parker's own fn 73 already holds, after
Borchardt, that the scales "do not fit the reign of Amenhotep III … but reflect the calendarial
situation of the civil year from ca. 1630 to ca. 1510 B.C." and calls the clock "simply another
manifestation of Egyptian conservatism". The "contemporary instrument vs inherited table" framing is a
manufactured disagreement and must be deleted. *(carry both months / carry Parker with Schomberg noted)*

**Q33.** Are the **twelve goddesses of the First Division** the twelve hour-goddesses? Budge's first
division carries a register of exactly twelve goddesses "who guide the great god", all standing in
hour 1, none mapped to hours — and three resemble hour-names attested elsewhere in the same book. It
might be a roster, an artefact of romanisation, or coincidence in a division that also contains nine
praising gods, nine singing apes and twelve fire-throwing serpents. **An Egyptologist must rule. Until
one does, no engine may use that register to fill hours 4, 5 and 6.** *(escalate — do not answer from
the chair)*

**Q34.** Do **Budge's eight hour-names survive modern collation** at all? None was checked against
Hornung's *Texte zum Amduat*, Jéquier 1894 or Lefébure's plates. *(verify before rendering any as "the
goddess of the Nth hour" / render with a standing 1905-romanisation caveat)*

### Babylonian

**Q35.** What does **EN.NUN mean inside MUL.APIN** — the whole of day/night (current: al-Rawi & George
1991, Hunger 2001, adopted by Steele) or **one third** (Neugebauer 1975; Pingree in Hunger–Pingree
1989/1999)? **Not a nuance: it changes every number by a factor of three** and is the difference
between a scheme that closes at 360 UŠ and one that does not. *(report both / report current with the
older in a note)*

**Q36.** **When did the 3:2 ratio arrive?** Brown, Fermor & Walker (1999–2000): the eighth century BC.
Steele (2013): the earliest actual evidence is BM 29371, late sixth century, and an earlier date should
not be assumed. *(carry both — confirm)*

**Q37.** What did **Herodotus II.109** mean by "the twelve parts of the day"? If twelve bēru, he is
describing this system and the Greek debt is real; if twelve seasonal daylight hours, he is describing
an Egyptian scheme and has attributed it to the wrong nation. **The two candidates differ in kind —
fixed versus seasonal — not merely in label.** *(state the ambiguity and refuse — confirm)*

**Q38.** **AO 6478's 364 UŠ** — real, reflecting knowledge of a 364-day stellar year and ancestral to
the Qumran calendar (Horowitz 1998, 184–85), or a scribal summation error with 360 reconstructed
(Steele 2017, 15–16)? Koch 1997 and Hunger & Pingree 1999 offer further accounts. A large claim resting
on a four-unit discrepancy. *(carry all positions — confirm)*

**Q39.** **Did Babylonia have a seasonal hour at all?** Rochberg-Halton devoted an article to exactly
this and it could not be read. Until it is, the safest statement is the narrow one that *is*
established: the bēru is fixed, the maṣṣartu is seasonal, and no term meaning "one twelfth of the
daylight" was encountered in any lexical entry read. *(publish the narrow statement / hold the claim
until Rochberg-Halton is obtained)*

**Q40.** **Were the watches exact thirds or observationally judged?** May the engine draw **hard watch
boundaries** at all, or should it draw bands? See §1.7 — this is the question that blocks the maṣṣartu.
*(hard boundaries once a source is obtained / bands / do not compute)*

**Q41.** Do the **personified watches of Maqlû** count as rulers? Maqlû I 3 invokes the three night
watches by name; Maqlû I 30 and KAR 58 r. 12 address them as wakeful, watchful, restless and sleepless
ones. The dossier reads that as the watch being the **addressee**, which is the opposite relation to
rulership, and files it under associations. A reviewer who disagrees would be turning an incantation's
vocative into a rulership table. **The decision should be made explicitly rather than by default.**
*(addressee, not ruler — confirm)*

### Materials matrix

**Q42.** **Which angel rules the Sun — Raphael or Michael?** Agrippa II.10 gives Raphael to the Sun and
Michael to Mercury; the Heptameron gives Michael to the Sun and Raphael to Mercury. Both attested, in
widely circulated texts, within four years of each other in English. **An engine emitting one "angel of
the Sun" has silently picked a side.** The same choice binds Mercury. *(emit both with sources / pick
one and say so on the page — never silently)*

**Q43.** Is **"metal" one column or two**? Agrippa gives a metal of the planet (II.10) and a metal of
the planet's table (II.22), and they disagree for Jupiter (tin vs silver), Venus (copper vs silver),
Mercury (quicksilver vs silver/tin/yellow brass), and conditionally for the Moon (silver/lead) and Mars
(iron-or-sword / red brass). A single field cannot be filled without choosing. *(one column / two)*

**Q44.** **Which Turner printing is "the" Heptameron?** The 1655 Sunday perfume ("Red Wheat") is a
mistranslation the same translator corrected in 1665 ("Red Sanders"). A page printing "Red Wheat" is
faithful to the 1655 text and wrong about the Latin; one printing "Red Sanders" is right about the
Latin and is not the 1655 text. **The edition must be a field, not a footnote.** *(1655 / 1665 / both,
labelled)*

**Q45.** Does the repo's **Sun-stone "diamond"** survive? It is attested at no Agrippa locus checked,
and Agrippa gives the diamond to Mars at both II.10 and I.xxvii. It may be correct for the Picatrix —
which is precisely what could not be verified. Deleting it discards a possibly-sound datum; keeping it
under the current source string asserts an Agrippa attestation that does not exist. *(delete / keep and
re-source / keep marked unattested)*

**Q46.** Now that Agrippa I.xxv is known to name **opium** under Saturn, **which scheme does the repo's
suffumigation column draw on** — I.xliv (black poppy seed) or I.xxv (the Saturnine plant list, which
includes opium)? The live question is the scheme, not whether Agrippa names it. *(pick the locus and
label it)*

**Q47.** Are **"Raucayehil" (Jupiter) and "Raucahehil" (Mars)** two names or one corrupted twice? They
differ by a single letter and no primary source was reachable to check either. **Should not ship as
distinct data until someone reads an actual Picatrix.** *(hold both / merge / delete pending)*

**Q48.** Do **Agrippa's three suffumigation schemes have a priority order**? He presents the compound
fumes, the class-of-matter list and the Hermes seven-aromatic in one chapter without ranking them, and
they conflict on saffron and lignum aloes. Practitioner literature routinely quotes the Hermes list as
"Agrippa's planetary incenses", silently promoting the third over the first two. **That promotion is
not in the text.** *(expose `scheme` as a field and refuse a default — confirm)*

**Q49.** Should `planetary-magic.js`'s header claim that Angel / Intelligence / Spirit are "Agrippa's
ONE triad per planet" be **corrected**? The Angel is II.x (the Scale of Seven); the Intelligence and
Spirit are II.xxii (the planetary tables) — twelve chapters apart, under different rubrics. Whether
Agrippa intended one system is arguable; that the module asserts one locus where there are two is not.
*(correct it — this is a change to shipped fidelity prose and needs a signed-off commit)*

---

## 3. CONFIRMED GAPS — THE CELLS THAT STAY EMPTY

These are **verified negatives**: someone looked at the place the datum would be and it was not there.
They are distinguished throughout from *not-obtained* items (§7), which are a to-do list, not a
finding. **A confirmed gap renders as an empty cell reading "unattested" and is never filled from a
parallel** (FRAMING §5 A-2).

### 3.1 THE RULER COLUMN — which systems cannot legitimately have one

**This decides the shape of the comparison grid and it is the most important finding in phase 1.**

| System | Ruler column? | Evidence |
|---|---|---|
| **Vedic horā** | **YES — Tier A** | SS xii.78–79 and xii.31 (Burgess 1860, PD, verified verbatim): the Chaldean lord sequence downward from Saturn, and the first-hour = day-lord identity. The one legitimate Tier A ruler column in phase 1. |
| **Choghadiya** | **YES — Tier C only** | Udveg=Sun, Chal=Venus, Labh=Mercury, Amrit=Moon, Kaal=Saturn, Shubh=Jupiter, Rog=Mars — from contemporary almanacs, no primary text, undated, no academic treatment. Must never render at the same weight as the horā column. |
| **Babylonian bēru** | **NO** | Confirmed negative across nine CAD lemmas and several hundred loci. Time of day is specified constantly; a governing power for an interval is never specified once. |
| **Babylonian maṣṣartu** | **NO** | Same. The Maqlû personification is a **vocative** — the watch is the addressee, the opposite relation (Q41). |
| **Chinese shichen** | **NO** | 隋書 卷19, 論衡 14/66 and 五行大義 卷一 assign no ruler to any hour. Rulership enters only through the 協紀辨方書 almanac layer, keyed to the **day's** stem-branch, not the hour-in-itself. |
| **Jewish zmanim** | **NO** | All twelve ruler cells correctly read "unattested". The system marks *boundaries*, not a twelve-fold qualitative scheme. |
| **Egyptian** | **NO** | The dossier's own scopeNote: "No hour-lord table of the planetary/Chaldean type is attested here." The eight Amduat hour-goddesses currently occupying the field must be moved out of it (§1.5b). |
| **Materials matrix** | **N/A — the ruler is the input** | It is a lookup keyed on a ruler another system supplies. It has no arithmetic of its own; that is a finding, not an omission. |

**Read that column: of six time-division systems, one has a Tier A ruler, one has a Tier C ruler, and
four have none.** The grid's most obvious column — "who rules this hour" — is empty for two thirds of
the traditions, and it is exactly the column the site's existing `planetary-hours.js` is organised
around. **Presenting a ruler column across the grid would manufacture a parallel that four of six
traditions do not make.** That is the finding, and it needs the maintainer's ruling at **Q1** before
any layout is written.

### 3.2 Structural absences that empty whole rows or columns

- **All twelve Egyptian DAY hours are empty.** No name, deity or region verified for any. The Amduat is
  a night composition. Day-hour material exists (Piankoff, *Le Livre du Jour et de la Nuit*, IFAO 1942;
  Faulkner's hour-liturgy of Pap. BM 10569, JEA 40, 1954) and neither was obtained. **A page laying out
  24 labelled Egyptian cells would be inventing twelve of them.**
- **Egyptian night hours 4, 5 and 6 carry no goddess name** in the public-domain witness. Verified by
  slicing the flat text between the Chapter IV and Chapter VII headings (44,283 characters) and
  scanning: "name of" returns exactly two hits, both chamber names; "the Hour" returns zero.
- **Egyptian gate names are missing for hours 1–6.** Hours 7–12 all carry the tripartite gate/city/hour
  colophon; hours 1–6 do not. A property of the text as rendered, not of the extraction.
- **No modern Egyptological transliteration exists anywhere in the Egyptian dossier.** Every name is
  Budge's superseded 1905 romanisation, and back-forming a transliteration from a Victorian romanisation
  would manufacture a philological datum.
- **The offerings column is empty across the whole materials matrix** (§1.9).
- **Agrippa supplies no ritual garment colour** — the Scale of Seven has no colour row (§1.9).
- **The entire Picatrix column is unattested** (§1.9).
- **No primary text for Choghadiya exists in anything reachable.** The headline gap of the Vedic
  dossier and it holds: four almanacs, one Wikipedia article whose sole reference is a Buddhist
  glossary, and targeted searches against Muhūrta Cintāmaṇi and Muhūrta Mārtaṇḍa. Every "rooted in
  ancient Vedic texts" phrase encountered was unlocatable practitioner assertion.
- **Choghadiya's date and place of origin are unattested.** astrosage records it as used mostly in
  western India; nothing dates it or traces its spread.
- **The reason for the night-Choghadiya offset is unattested.** The tables are printed; no source
  explains why the night sequence starts on the lord of the fifth weekday or steps −2. Both rules in the
  dossier are the compiler's derivation — verified against every cell, explained by nobody.

### 3.3 Point gaps inside otherwise-populated rows

- **Zmanim hours 2 and 8 carry no named halachic boundary.** Deliberate empty cells, and the blank is
  itself a finding about the shape of the system: it marks boundaries, it is not a twelve-fold
  qualitative scheme like the Egyptian or Chaldean hours.
- **Misheyakir has no primary number.** SA OC 58:1 gives a qualitative recognition test and no time.
  Every circulating angle (11.5°, 11°, 10.2°) is a modern back-calibration attributable to no posek by
  name. **Any cell in this row not marked as a calibration is a fabricated attribution.**
- **The Ateret Torah tzais offset has no documented default** in anything read. That variant is
  literally uncomputable without a communal luach to supply the figure. Recorded rather than guessed.
- **辰 has no animal in 論衡 物勢篇.** That chapter supplies eleven and is silent on 辰; the dragon
  comes from a different chapter, 言毒篇. **The complete twelve exist in 論衡 only as a reconstruction
  across two chapters** — verified, and the refusal to fill 辰=龍 from the same chapter is exactly
  right.
- **No date→ganzhi published source exists.** Both editions of the Hong Kong Observatory's 2026
  conversion tables carry four columns and the **year's** 干支 only; Taiwan's 中央氣象署 astronomy
  downloads carry no 日干支 product. Two confirmed negatives, deliberately checked. **Consequence:
  shichen golden values gv-3, gv-4 and gv-7 are keyed to a sexagenary day rather than a calendar date,
  so the hour layer can be tested without closing this gap — and PHASE 2 MUST NOT CLOSE IT BY INVENTING
  A FORMULA.**
- **The day-watch quality cells are genuinely empty in Babylonian.** Oppenheim's n. 42 records that
  K.6476 — the tablet that lists the three day watches — does not indicate their favourable or
  unfavourable character, and that the two versions of the manual disagree even about the night
  watches'.
- **The Babylonian watch→land scheme cannot be completed.** "The morning watch (concerns) Elam" is
  attested twice and paraphrased a third time. **No land was found for the evening or middle watch in
  any entry read.** The four-lands scheme is well attested for eclipse quadrants and colours; whether it
  ran over the three watches is not established. **Do not complete this row by inference.** The
  single-cell row is the finding.
- **Individual bēru have no names.** The watches have names; the double-hours do not. They appear only
  as ordinals counted from sunrise or sunset. **Anyone who has seen a list of twelve named Babylonian
  double-hours has seen a modern invention** — including, currently, this dossier's own entries 2–5 and
  8–11 (§1.6, blocker 2).
- **No continuous 1→12 bēru cycle is attested.** The counts restart at the boundary event. A single
  twelve-cell strip from sunset to sunset is a modern reconstruction and must be labelled as one.
- **No subdivision of a maṣṣartu is attested.** The bēru divides into UŠ and NINDA; the watch does not
  appear to divide into anything.
- **The one-word horā planet "natures"** (sluggish / fruitful / aggressive / vigorous / beneficial /
  quick / gentle) have no Tier A or Tier B source, and the two Tier C witnesses give them in **identical
  wording**, so they are probably not independent. Treat as one witness or drop.
- **No Tier B source was verified at all in the zmanim dossier.** Every arithmetic claim rests on Tier A
  primary/PD halachic texts or Tier C practitioner and engineering literature. Sacha Stern, *Calendar and
  Community* (Oxford, 2001) — the obvious candidate for the evening-day-boundary question — was not
  consulted. This is a real hole in the best-verified system on the page.
- **No Tier B academic treatment of Choghadiya was found at all.** Greek-loanword scholarship covers
  horā; nothing comparable exists in reach for Choghadiya. **The two halves of that dossier are not
  evidentially comparable and the UI must not present them as if they were.**

---

## 4. GOLDEN VALUES FOR PHASE 2

### 4.1 Usable now

| System | Golden value | Publication | Status |
|---|---|---|---|
| **Zmanim** | Jerusalem 2026-03-21 — sunrise 05:41:56, sunset 17:51:09, Gra sof zman Shema 08:44:14, chatzot 11:46:33, plag 16:35:12, MGA-72 08:08:14, 16.1° alos 04:29:44 | Hebcal zmanim API v1.4.2, `geonameid=281184`; independently reproduced with the repo's vendored Astronomy Engine | **Verified to the second** |
| **Zmanim** | Lakewood NJ 2026-03-21 — sunrise 06:58:30, Gra 10:01:22, MGA-72 09:25:22, MGA-16.1° 09:21:07, MGA-19.8° 09:11:04 (a **50-minute spread** across four published columns) | Hebcal v1.4.2, `zip=08701` | **Verified to the second** |
| **Zmanim** | NYC 2026-06-21 — sunrise 05:25:02, sunset 20:30:42, Gra 09:11:27, plag 18:56:22, MGA-72 08:35:27, MGA-16.1° 08:16:48, MGA-19.8° 07:59:10 (**72-minute spread**) | Hebcal v1.4.2, `geonameid=5128581` | **Verified to the second** |
| **Zmanim** | Polar cut-off latitudes, June solstice: 0.833°→65.73, 6°→60.57, 7.083°→59.48, 8.5°→58.07, 10.2°→56.37, 11.5°→55.07, 16.1°→50.47, 19.8°→46.77 | **DERIVED, not published.** Bisection with the vendored Astronomy Engine | Reproduced within 0.004°. **26° row must be dropped or derived (§1.1 blocker 3)** |
| **Vedic** | GV1 Choghadiya, Ahmedabad 2026-08-15 — 18 boundaries, 16 names, day arc 776/8 = 97 min exactly | drikpanchang, **dated + geoname-pinned URL** | **Exact, tolerance 0** |
| **Vedic** | GV3 Choghadiya, Udaipur 2026-08-05 (Wednesday — pins the non-Saturday offsets) | drikpanchang, dated + geoname-pinned | Day exact; **four night cells ±1 min, declared and correctly explained** |
| **Vedic** | GV6 — the 112-cell weekday table, day start indices `[0,3,6,2,5,1,4]` step +1, night `[5,1,4,0,3,6,2]` step −2 | mpanchang reference tables, cross-checked against three dated drikpanchang tables | **All 112 cells reproduced independently, zero failures.** Cheapest and strongest regression test in phase 1 |
| **Shichen** | gv-3 / gv-4 — 協紀辨方書 卷32, the 甲子日 and 乙丑日 rows, twelve 黃道/黑道 spirits each | 欽定協紀辨方書 (1741), 四庫全書 recension, Chinese Wikisource | **12/12 on two independent rows, from raw wikitext.** Add the multi-valued-cell caveat (§4.3) |
| **Shichen** | gv-5 — 午時三刻 = 11:43:12–11:57:36 under 100-ke, 11:45–12:00 under 96-ke | 林聰益, 《科學發展》 420 (2007), 科技大觀園 | **Verified; arithmetic recomputed.** Strip the 午初三刻 reading, which is not Lin's |
| **Egyptian** | GV1–GV3 — Luxor day-hours, night-hours and the March equinox pair; 52 timestamps | USNO RSTT API v4.0.1 (US Government work, public domain) | **Every timestamp reproduces to the second; USNO re-queried live and every input matched.** The equinox asymmetry (60m35s day vs 59m20s night) is a real bug-catcher |
| **Babylonian** | GV-1 / GV-2 — day and night lengths in UŠ for the 15th of each ideal month, both 2:1 and 3:2 | Steele, *SCIAMVS* 14 (2013), Table 1 at p. 5 | **Every row verified; all sum to 360 UŠ; recomputed independently** |
| **Babylonian** | GV-3 — MUL.APIN II ii 21/25/31/35 in minas: 3/3, 4/2, 3/3, 2/4 | Hunger's edition, reproduced with commentary in Steele pp. 7–8 | **Verified.** Hunger is cite-only — record numerals as data, not text (§5.1) |
| **Babylonian** | GV-4 — 1 bēru = 30 UŠ = 120 min; 1 UŠ = 60 NINDA = 4 min; 1 NINDA = 4 s; 12 bēru = 86400 s | Steele pp. 4 and 8, both source sentences verified verbatim; arc senses at CAD B 208, 211 | **Verified.** Needs no astronomy |
| **Babylonian** | GV-5 — ABL 1428:4: on 15 Nisannu, six double-hours of daylight and six of night | Harper, *ABL* (1892–1914), PD-US; translated at CAD B 211 | **Verified.** The **only** attested 6+6 case — a UI laying out 6+6 cells is showing the equinox and calling it the system |
| **Materials** | GV1 / GV2 — Heptameron §XXV Sunday (24 angels, 24 hour-names) and Monday (first 8 of each) | Turner 1655 / Marburg 1559, ed. Peterson | **Verified off raw HTML.** Monday catches a Sunday-is-index-0 off-by-one. Fix GV1 `Mathon`→`Mathun` |
| **Materials** | GV3 — the seven weekday perfumes with the 1655/1665 divergence | Heptameron, both printings | **Verified against both Latin and English columns** |
| **Materials** | GV4 — Agrippa II.x Scale of Seven: metals, stones, angels, birds | Freake 1651, ed. Peterson | **Verified row by row, exact order** |
| **Materials** | GV5 — Agrippa II.xxii table-metals, Intelligences, Spirits | Freake 1651, ed. Peterson | **Verified — but Mars MUST be corrected to conditional before any test is written (§1.8 blocker 2)** |
| **Materials** | GV6 — the Hermes seven-aromatic | Agrippa I.xliv | **Verified verbatim.** Its "no numeric field, no unit token" assertion pins FRAMING §5 C-1 at the data layer |

### 4.2 Systems and sub-systems with NO usable golden value

**The maintainer must know these before code exists.**

1. **Babylonian maṣṣartu — NO GOLDEN VALUE AT ALL.** No published Babylonian table of watch boundaries
   for a stated place and date is known to exist. Combined with the unverified division rule (§1.7),
   **this sub-system cannot be verified and must not be built.**
2. **Materials — the Picatrix column — NO GOLDEN VALUE, because no verified datum.** Colour,
   suffumigation, offering and prayer-angel have nothing to test against (§1.9).
3. **Egyptian day-hours — NO GOLDEN VALUE, because no data.** The astronomy golden values cover the
   division; there is nothing to verify about names that do not exist. Twelve empty cells.
4. **Shichen — NO END-TO-END CALENDAR-DATE FIXTURE.** Because no published date→ganzhi source was
   found, the almanac layer is testable **only** against a sexagenary-day key (「any 甲子 day」), never
   against "the almanac for such-and-such a printed year marks these hours auspicious on this date".
   That is a real and permanent limit on what phase 2 can verify about the 協紀辨方書 layer, and the
   dossier deliberately keyed its golden values around it rather than closing it by invention. **Do not
   let phase 2 close it by invention either.**
5. **Egyptian GV5 (Karnak clepsydra)** is currently unusable as written: it rests on the manufactured
   Parker/von-Lieven conflict and must be rewritten (Q32) before any test is built on it.
6. **Babylonian GV-6 (ziqpu 364 UŠ)** — unverified (Breger pp. 20 and 29–30 unreadable;
   Thureau-Dangin RA 10 unfetched) and, on its own terms, a star-list arc total rather than a
   time-division reference vector. **Demote from goldenValues to a contested-point note** — GV-4 already
   carries the only unit identity it would test.
7. **Shichen gv-7 (五鼠遁)** — the arithmetic is verified and self-closing, but the 淵海子平 locus is
   unverified (the Wikisource transcription is marked 此文檔未完成 and lacks the passage). **Pin the
   arithmetic; do not present the locus as established.**

### 4.3 Golden-value hygiene requirements for phase 2

- **Re-pin Vedic GV2, GV4 and GV5** with dated, geoname-qualified URLs on the pattern GV1 and GV3
  already use. A locator that returns Marcellus, New York tomorrow is not a golden value. Add the ±1
  declaration to GV5.
- **Shichen gv-3 / gv-4 assert single-valued cells against a multi-valued source.** The printed
  協紀辨方書 cells carry a second, larger layer per hour (日建, 日破, 日合, 日害, 日刑, 日馬, 日禄,
  喜神, 五不遇, 路空, 旬空, 天乙貴人, 天官貴人, 福星貴人). State that the dossier extracts only the
  黃道/黑道 member, and print one cell verbatim so a test author knows.
- **Shichen: the Wikisource transcription supports three clean rows, not two.** 戊辰日 extracts cleanly
  and matches the closed form; 丙寅, 丁卯, 己巳, 庚午, 辛未 and 壬申 are column-misaligned in the same
  way, each appearing to seat 青龍 one hour late. Add 戊辰日; keep the caution that a third row read off
  a page image is still wanted.
- **Egyptian GV6 must assert the negative only** (region 7 ≠ "Thephet-Asar", region 12 ≠ "Then-Neteru")
  and carry both positive forms, rather than resolving a conflict the dossier says it declines to
  resolve.
- **Hebcal's rounding rule is inferred, not documented.** Comparison against second-resolution
  recomputation shows nearest-minute rounding (chatzot 11:46:33 published as 11:47), but no
  documentation states it. A phase-2 test must either round output to the minute before comparing or
  allow ±1 minute, **and say in a comment which and why.**
- **Do not mirror Hebcal's field names.** Its `alotHaShachar` is the 16.1° degree-based dawn while its
  unqualified `sofZmanShmaMGA` is the 72-fixed-minute value — 8 minutes apart on the dawn and 4 on the
  Shema at Lakewood. The two are genuinely inconsistent within one response. Copying the names
  propagates the defect.
- **Vedic golden values are specified to be tested by feeding the PUBLISHED sunrise/sunset in**, not by
  re-deriving them. drikpanchang and mpanchang disagree by ~3 minutes on the same city and day.
  Cross-publisher agreement to the minute must not be expected or asserted.
- **Discriminating test cases that must not be omitted:** shichen **23:30** (子 mainstream vs 亥 Song —
  14:30 proves nothing); zmanim **Lakewood 2026-03-21** (the only case where all four opinions
  separate visibly); Egyptian **the equinox pair** (an engine returning exactly 60:00 for both has
  substituted geometry for the published almanac); materials **Monday** (Sunday alone cannot catch a
  weekday-index off-by-one).

---

## 5. COPYRIGHT AND TOXICITY FINDINGS, ITEMISED

### 5.1 Copyright

**C1 — Egyptian: verbatim in-copyright text. HARD BLOCKER.**
Parker, *The Calendars of Ancient Egypt*, SAOC 26 (1950), is tagged `pd: "cite-only"` and is quoted
**verbatim in four places**: the §32 sentence in JSON `dayStart`, again in JSON `v2.authority`, again as
a block quote in `notes.md` §5, plus a second §208 sentence in `v4`. Meanwhile `notes.md` §8 asserts
"No verbatim in-copyright text." FRAMING §4.4 names Parker-class editions as ones that are "cited,
page-referenced, argued with, and **never reproduced**", and §4.1 makes `cite-only` mean no quoted text
and no translation text. The dossier issues itself a "minimal factual quotations for identification
only" exemption that appears nowhere in FRAMING. **Paraphrase all four and delete the self-issued
exemption.** Budge 1905 quotations are fine and stay.

**C2 — Babylonian: provenance self-contradiction, with real exposure on Hunger.**
`sources[steele-sciamvs-2013].pd` asserts "no verbatim reproduction is made here"; GV-4 reproduces two
Steele sentences inside quotation marks and `polarBehaviour` reproduces a third. **More seriously,
`variants[v-massartu-sense].arithmetic` reproduces Hunger's in-copyright MUL.APIN translation verbatim**
— "on the 15th of Month I, 3 minas is a daytime watch, 3 minas is a nighttime watch" — in the same file
where GV-3 declares Hunger cite-only and not reproduced. The same pattern recurs with the CAD headword
definition. Every quoted string checked is *accurate*; this is a provenance-labelling failure, not a
fabrication — but **a source record that misdescribes its own compliance is the one thing a downstream
reader cannot check cheaply.** Paraphrase, or correct every `pd` field to state what was actually done.

**C3 — Materials: S4 self-contradiction on Peterson.**
S4 states Peterson's editorial notes are "not reproduced as text"; **three passages are reproduced word
for word** (the Costus note, the §XXV headnote, the "swaps Raphael and Michael" clause). Two
mitigations, which is why this is a self-description problem rather than a licensing emergency: every
instance is short and explicitly attributed to Peterson by name, and the Book II page fetched carries a
header declaring the transcription **CC-BY 4.0** (with introduction and notes separately marked
copyright 2000), so short attributed quotation is very likely permitted outright. **Preferred fix: keep
the quotations, which are useful and correctly attributed, and amend S4 to say so, noting the CC-BY 4.0
licence.**

**C4 — Zmanim: self-contradictory quotation policy, and the caution is backwards.**
MB 58:4 and 89:5 are declared CITE-ONLY on the strength of a "Wikitext / licence unknown" digitisation,
then quoted in English in `dayStart` and `divisionRule`. **The licence labels are accurate** (both do
return `versionTitle: 'Wikitext'`, `license: 'unknown'`) — but the Mishnah Berurah was published
1884–1907 and is PD-US by pre-1930 publication, and an unlicensed digitisation cannot create new
copyright in the underlying words. **The words are quotable; the cite-only label is the error.** State
the rule once, follow it, and treat the digitisation caveat as a transcription-accuracy concern rather
than a copyright one. Better: re-fetch both from the PD "On Your Way" version.

**C5 — Materials: the Picatrix refusal, recorded as a POSITIVE finding.**
Unauthorized full-text copies of both Picatrix translations circulate on academia.edu and archive.org.
**The compiler declined to use them, not even to check a page number.** That is the correct behaviour
under FRAMING §4.1 and it is the direct cause of the empty Picatrix column. **The empty column is the
cost of the rule working.**

**C6 — Clean on copyright:**
- **Vedic** — best hygiene in phase 1. The Burgess 1860 PD quotations verify verbatim with OCR damage
  disclosed in-data and no word supplied; no string of the in-copyright Gansten appears anywhere.
- **Shichen** — no string traces to any in-copyright translation; CJK runs measured (longest single run
  86 codepoints, largest per-work total 178, against the 300-codepoint cap FRAMING §4.5 sets for scripts
  without word spacing); the 清史稿 PD ground (pre-1930 US publication) matches §4.3. **But see T5 — its
  problem is fabricated quotation, which is an accuracy failure, not a copyright one.**

**C7 — The repo's own live defect is confirmed and still unfixed.**
The materials dossier independently confirms FRAMING §9.8: `assets/js/core/data/picatrix-prayers.js`
reproduces verbatim planetary-prayer excerpts from the in-copyright Greer–Warnock *Picatrix*, and that
file's own header says the edition is "quoted throughout". **This predates phase 1 and phase 1 did not
repeat it. It is out of scope for this report and it is still shipping.**

### 5.2 Toxicity and harm

**T1 — Materials: the highest-risk data in phase 1, and C-1 compliance verified.**
Agrippa I.xliv names, across the seven compound fumes: **henbane** (Hyoscyamus niger, tropane
alkaloids), **mandrake root** (Mandragora, same class), **black and white poppy seed**, **euphorbium**
(dried Euphorbia resinifera latex — severe vesicant and ocular/respiratory irritant), **the roots of
both hellebores** (Helleborus niger, cardiotoxic; and Veratrum album, veratrum alkaloids — **two
unrelated genera sharing one archaic name, and confusing them is itself a documented poisoning
pathway**), **sulphur**, **camphor** (a recognised paediatric poisoning agent), and — twice — **human
blood** (Mars, "the blood of a Man"; Moon, "Menstruous blood"). Plus raw animal tissue throughout and
protected species (eagle — Bald and Golden Eagle Protection Act; storks and swallows protected across
much of Europe and North America). Separately, **Mercury's assigned metal is elemental mercury**, whose
vapour is absorbed by inhalation at room temperature; the repo's phrase "fixed mercury" names an
alchemical operation on it.

**C-1 compliance was independently checked and holds:** `quantity` and `processParam` are `null` on
every harm-flagged record with a stated reason; the operable triple is genuinely not assemblable from
these fields; GV6 additionally asserts the returned object contains **no numeric field and no unit
token**, which pins FRAMING §5 C-1 at the data layer. Worth noting for the record that Agrippa himself
supplies the workaround on the one row where the metal is the hazard: II.xxii permits the Mercury table
in "Silver, tin, or yellow brass", so the text does not require the operator to handle quicksilver.

**T2 — Materials: the OPIUM misdescription. Safety-adjacent. Fix before anything downstream reasons
about it.**
The dossier asserts opium is not named by its own cited primary text and builds a contestedPoint on it,
framing the repo's existing harmNote as possibly resting on a practitioner conflation. **Agrippa I.xxv
names opium explicitly among Saturnine plants**, in a chapter the dossier draws three other fields
from. The narrow I.xliv point is correct and keeps; the generalised absence-claim is false. See **Q46**.

**T3 — Egyptian: a FALSE ABSENCE-CLAIM about efficacy, refuted by the dossier's own witness.**
`honestLimits` states "nothing in the text assigns a quality, a fortune or a use to any hour" and "no
efficacy, no fortune, no advice". Budge carries **seven "Whosoever knoweth…" formulae** plus the Second
Division's promise that the words "shall act as magical protectors of a man upon earth, regularly,
unfailingly, and eternally" — **in the same sentence-run as the Hour-2 goddess name the dossier
quotes** — and the Third Division's "Whosoever knoweth these things shall have both his habitation and
his bread with Ra", immediately after the Hour-3 sentence. **This paragraph is destined for the page and
is false as written.**
**The fix is not to add efficacy claims.** Rule 6 still bars asserting anything works. Replace the flat
denial with the accurate, attributed version: the Amduat assigns no hour-quality or elective use to a
clock time, but each division closes with a formula promising benefits to whoever knows its figures and
words; those are recorded in the text's own voice, attributed, and the site asserts nothing about them.

**T4 — Shichen: the organ/meridian column. Recommend DROP.**
Every organ association rests on `zhenjiu-dacheng-nazhi`, whose intended primary transcription failed
(zysj.com.cn returns **403**, not the "expired TLS certificate" recorded) and whose locus (針灸大成
卷五, 1601) reached the compiler only through secondary pages. The earlier attribution to
《子午流注針經》 (1153) is equally unverified. All twelve entries carry "TIER C, UNVERIFIED PRIMARY"
and "Not a health claim", and `honestLimits` states outright that nobody should read a claim about
their body out of it — **that discipline is correct**. But an unverified 1601 acupuncture attribution
rendered beside verified 論衡 and 五行大義 columns is exactly the evidential-dignity failure §5 C-6
names. **The dossier's own recommendation is to drop it rather than ship at equal weight, and the
auditor says that recommendation should be taken.**

**T5 — Shichen: fabricated quotation elements. Accuracy failure with a provenance surface.**
`lunheng-14` presents 「亥、豕也，未、羊也，丑、牛也」 as verbatim; 未、羊也 does not exist at that
locator, where the text reads 「亥豕也，丑牛也」. The dossier twice asserts 論衡 writes 虵; the cited
Wikisource page reads 蛇 both times. Also: 「四年，議政王等言」 is quoted as 「康熙四年」 with a
two-character editorial insertion (correct from context) silently inside a verbatim string. And the
as-printed policy is inconsistent — 元武 and 寶光 are recorded "as printed" while 戍→戌, punctuation and
須/需 are silently normalised. **A paraphrase or reconstruction inside a string labelled verbatim is the
failure mode this project treats as worst-case.**

**T6 — Vedic: clean, with one live renderer requirement.**
'Rog' (disease) is recorded as an almanac slot name with an explicit no-health-claim note; `honestLimits`
is explicit and adequate; the qualities are consistently framed as the almanacs' own labels with
`qualitySourceRefs` attached. **Residual risk for phase 2, not a defect here:** the `quality` field is a
bare string ("auspicious", "inauspicious") that **would read as site voice if rendered without its
attribution**. The renderer must carry the attributing frame **with** the label, not beside it. That is a
phase-2 requirement, not a suggestion.

**T7 — Zmanim, Babylonian: clean.**
Zmanim's `honestLimits` records what sources say without asserting any practice works, and no ruler was
invented. Babylonian's hemerology values are consistently framed as what the text says, with the
explicit gloss "no agent is named and it is not a rulership", and `honestLimits` closes correctly:
"these are statements about a corpus of omen literature and about nothing else."

---

## 6. WHICH SYSTEMS CAME OUT THIN, AND WHY

**Stated without softening, because the whole point of the phase was to find out.**

**Egyptian is the thinnest, and it is thin structurally, not through negligence.** Eight of
twenty-four hour-names are filled. All twelve day-hours are empty. Hour 3 is ambiguous and correctly
withheld. Gate names exist for only half the night. Every name is a Victorian romanisation with no
modern transliteration anywhere. No shadow-clock data at all, so nothing the dossier says about
day-hour *measurement* rests on an Egyptian instrument. The Karnak clepsydra's actual scale values were
never obtained. Jéquier 1894 — a second, independent, **public-domain** edition of the abridged Amduat,
and the cheapest available check on hours 4, 5 and 6 — was identified and then lost to a mis-encoded
accented filename that 404'd.
**Why:** the public-domain constraint selected the worst witness. FRAMING §4.4 predicts exactly this and
the dossier says so. Hornung's critical edition is the answer and it is in copyright. **The honest
presentation is a well-verified division row with a mostly-empty name column, and never a 24-cell
labelled table.**

**Babylonian split cleanly into a solid half and an unusable one.** The bēru — fixed, equal,
non-seasonal, needing no astronomy — is verified end to end and carries the strongest confirmed
negative in phase 1. The maṣṣartu — the only half that requires astronomy, and therefore the only half a
Horae Mundi engine would actually compute — has an unverified division rule, no golden value, and the
one dedicated scholarly treatment (Rochberg-Halton, *Centaurus* 32, 1989) sitting behind two HTTP 403s.
**Why:** three of the four things needed were paywalled or 403'd, and the one item actually fetched (a
book review) says something weaker than what got encoded. The gap between "split into 3 watches" and
"three equal thirds of the actual daylight" is the whole difference between describable and computable,
and it landed on the wrong side.

**Choghadiya is thin in provenance and rich in data, which is the most dangerous combination on the
page.** 112 published cells verified perfectly; closed forms independently re-derived; two dated golden
values reproducing at tolerance 0. And: no primary text, no date, no place of origin, no Tier B
treatment, and one Wikipedia article whose sole reference is a Buddhist glossary. **Why:** it may well
exist in vernacular Gujarati or Marathi pañcāṅga literature this pass could not reach — which is a
reason to keep looking and never a reason to imply attestation. Beside the Tier A horā in one table it
will inherit the horā's evidential dignity unless the interface actively prevents it (**Q2**).

**Shichen came out thin exactly where it claimed to be thick.** Entry-level attribution false on 11 of
12 entries. The classical twelve names with no verified primary locus at all — and the real, obtainable
citation (张衍田 2019, with page numbers) displaced by an invented one (杜預) that turned a closeable
gap into a permanent one. The meridian column on one unverified secondary chain. A fabricated
quotation. A false gap inside the section quoted five times elsewhere. And a `fetched` boolean that
cannot be trusted anywhere in the file.
**Why:** the compiler read widely and recorded shallowly. The structural work — the closed forms, the
two 協紀辨方書 rows, the 論衡 11-of-12 finding, the 507-CE reform — is genuinely good and survived
hostile checking. The provenance layer beneath it was not built to the same standard, and in this
project the provenance layer *is* the deliverable.

**Materials came out half-empty by design and half-excellent by method.** The Agrippa and Heptameron
columns are the best-verified string data in phase 1, read off raw HTML precisely because a summarising
fetch of the same pages returned **fabricated** hour-angel lists — plausible, fluent, wrong, and
undetectable by reading. That method note is worth more than most of the data and must be preserved.
The Picatrix column is empty because the books are in copyright, unavailable, and the pirated copies
were correctly refused. **The commissioned deliverable was four Picatrix fields per planet and zero
were produced. That is the rule working, not the researcher failing** — but the maintainer commissioned
a column and is getting a blank one, and should hear it plainly.

**Zmanim is the thickest and is thin in exactly one place.** No Tier B source was verified at all.
Every arithmetic claim rests on Tier A primary halachic texts or on Tier C practitioner and engineering
literature — chiefly one software library's Javadoc (KosherJava) and one API (Hebcal). Searches for
peer-reviewed academic treatment returned nothing openable; the one journal PDF extracted turned out to
be about the calendar rather than zmanim. Sacha Stern was not consulted. **The system with the best
golden values on the page has no academic layer under it at all.**

**A pattern across four of the six, worth naming:** each leans disproportionately on **one** secondary
source — Steele 2013 for Babylonian, KosherJava for zmanim's variant set, Peterson for materials'
philology, drikpanchang/mpanchang for Choghadiya. Each of those is a good source by a competent person,
and none is two sources. Where a single secondary carries a whole column, the column inherits that
source's errors invisibly.

---

## 7. WHAT PHASE 2 MAY BUILD

**After the §1 blockers are cleared and the §2 rulings are made — and not before.**

**Buildable:**

1. **Jewish sha'ot zemaniyot** — full, all variants, both spans, the polar refusal, the four-column
   spread that is the row's whole point. Richest system on the page.
2. **Vedic horā** — full, with the **only** Tier A ruler column in the grid, and the Tier A / Tier C
   split made explicit on the division rule itself.
3. **Choghadiya** — full data, Tier C throughout, with a standing note on the comparison view (Q2), and
   the derived closed forms attributed to the compiler rather than to the almanacs.
4. **Chinese shichen** — the fixed twelve divisions, the 初/正 halving, both ke layers, and the
   協紀辨方書 almanac layer **keyed to the sexagenary day, never to a calendar date** — *after* the
   full source re-sweep, and without the organ column.
5. **Egyptian** — the seasonal division with its excellent astronomy, an 8-of-24 name column with
   twenty-two honest empty cells, and an empty ruler column. **Not a 24-cell labelled table.**
6. **Babylonian bēru** — the fixed unit, the unit arithmetic, and the schematic 2:1 / 3:2 tables
   presented **as fixed tables and never as functions of the reader's latitude** (Steele: the 2:1 ratio
   is "very inaccurate for the latitude of Babylon (or anywhere else in Babylonia or Assyria)").
7. **Materials** — the Agrippa and Heptameron columns, with `scheme` and `edition` as fields rather
   than footnotes, and two metal columns rather than one (Q43).

**NOT buildable. Do not write code against these:**

- **Babylonian maṣṣartu** (§1.7) — no verified division rule, no golden value. Describe the six watches,
  their names, their lexical sequence and their omen qualities; **do not compute a boundary.**
- **Materials — the Picatrix column** (§1.9) — no verified datum. Four empty fields per planet, and do
  not fill them from `planetary-magic.js`.

**And the grid-shape consequence, restated because it is the thing most likely to be decided by
accident:** four of six systems cannot carry a ruler column, all twelve Egyptian day-hours are empty,
the offerings column is empty across the whole materials matrix, and Agrippa has no colour row. **Those
empty cells are the deliverable.** A grid that looks complete will be lying about six traditions in
order to look tidy, and it will be doing it in exactly the places where phase 1 did the most work to
find out that nothing is there.
