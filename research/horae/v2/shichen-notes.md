# shichen — compiler's notes (round 2)

**System:** Chinese shichen 時辰, the twelve earthly-branch double-hours.
**Role:** COMPILER. **Ledger:** the fetcher's 20 sources / 108 snippets (S1-a … S20-c).
**Constraint:** every claim in `shichen.json` carries at least one sid from that ledger. No source
outside it is cited anywhere. All 108 ledger snippets are cited in a structured `snippetIds` array;
none is left as decoration and none is invented.

**Quotation policy in these notes.** Verbatim text appears only from the public-domain Chinese
editions (隋書, 明史, 清史稿, 日知錄, 御定月令輯要, 書齋夜話, 欽定禮記義疏, 欽定協紀辨方書, 論衡,
山堂肆考) and from Doolittle (1865). The four cite-only sources — Sôma et al. 2004 (S3),
di Serego Alighieri & Corsi 2020 (S4), and the three commercial practitioner pages (S18, S19, S20) —
are **paraphrased here and never quoted**; their ≤25-word verification snippets live in
`sources[]` in the JSON, marked `shippable: false`, per RESEARCH-PROTOCOL C1 ("it never reaches the
shipped data, only the research file"). Wikipedia (S17) is CC BY-SA, so it is a licence obligation
rather than a public-domain permission, and it is also marked unshippable.

---

## 1 · The ruler column is empty, and the honest reason is two reasons

`hasRulerColumn: false`, and the `ruler` property is **omitted from every entry** rather than filled
with "none" or "unattested".

Two independent grounds, and they are not equally strong, so the file says which is which:

1. **The maintainer's grid ruling.** Of six systems only Vedic horā has a Tier A ruler column and
   only Choghadiya a Tier C one. shichen, zmanim, Egyptian and Babylonian have none and must not
   render one. This settles it.
2. **Nothing in the ledger fills it.** Across all 108 snippets, not one assigns a planet, deity or
   presiding figure to a shichen. What the ledger attaches to a branch is an animal, a descriptive
   day-part name, a ke allotment, and — in the hemerological layer only — a conditional
   auspiciousness computed from the *day's* branch.

**Ground 2 is weaker than it looks and the file says so.** The fetcher's own scope note states
plainly that it *did not search for a ruler* and makes no absence claim. So this is recorded in
`gaps[]` at `confidence: "could-not-determine"`, not as a confirmed gap. Round 1 had three of six
dossiers assert "nothing attests this" without looking; that failure mode is precisely what a
"could-not-determine" is for. The column is empty because the maintainer ruled it empty, **not**
because anyone has demonstrated that no Chinese source anywhere assigns one.

The nearest thing in the ledger to an agentive quality attached to time is 神藏煞沒 in the 1741
協紀辨方書's 四大吉時 rule (S13-g) — and it is keyed to **heavenly stems and the four corners**
(孟月甲丙庚壬時，仲月艮巽坤乾時，季月乙辛丁癸時), not to the twelve branches. It therefore attaches
to no row in this table, and the file puts it in a variant rather than in an entry.

---

## 2 · What I would not fill in

The brief said: *do not fill the table.* Six specific places where a tidier dossier was available and
was declined.

**2.1 Ten of the twelve clock ranges are derived, not read.** Only two branches carry a range from a
retrieved page: 子 at 23 hr (S3-a; corroborated at Tier C by S17-b and S18-a) and 午 at 11–13 hr
(S3-k; S18-b). The other ten are **my arithmetic** on three attested premises — twelve equal
double-hours, the fixed branch order, and the 23:00 anchor. They are carried in a **differently named
field**, `clockRangeDerived`, alongside `clockRangeDerivedFrom` and a per-entry derivation note, so a
renderer physically cannot show them in the same cell as `clockRangeAttested`. The two attested
anchors are mutually consistent with the derivation, which is the only check this ledger permits.

The source that would have settled this was fetched four ways and never obtained: the Appendix of
Sôma et al. (pp. 897–904) lists the twelve names with their intervals, and the fetcher marks it the
single most on-point missing item. **Nothing here assumes its contents.** The other page that would
have supplied a full table, sizes.com, returned 403. A third page that *was* read in full,
cantian.ai, gives animal, element, yin-yang, direction, season and hidden stems and **no clock ranges
at all** — which is worth recording, because it is the kind of page a careless round would have cited
for ranges it does not contain.

**2.2 Yuan Chong's winter-solstice per-branch figures are recorded and not interpreted.** Both 隋書
transcriptions agree: 子丑亥各二刻，寅戌各六刻，卯酉各十三刻 (S1-l; S2-f, S2-g). The ledger supplies
**no column heading**, no gloss by Yuan Chong, and no values for 辰巳午未申. I do not know what those
figures count. Three readings occurred to me and none survives contact with the rest of the section,
so the JSON prints the numbers verbatim, says the heading is not supplied, and stops. `gv-8` carries
that caveat **inside the `expected` field a renderer reads**, not beside it — RESEARCH-PROTOCOL C4.

**2.3 The 40-ke / 辰正→申正 tension is flagged, not smoothed.** The same row gives 冬至：日出辰正，
入申正，晝四十刻，夜六十刻 (S1-k, S2-e). Forty ke of daylight and a span from 辰正 to 申正 do not sit
together on my arithmetic under a 100-ke equal-chen day, and the ledger nowhere states what 晝 means
in this table — whether it runs sunrise-to-sunset or dawn-to-dusk. I could construct a reconciliation.
It would be mine, not a source's. Printed side by side, left open, flagged for a future fetcher.

**2.4 No direction of influence between the two 96-ke reforms.** The 隋書 records Liang Wudi reaching
96 ke in AD 507 on exactly the arithmetic the seventeenth century would reach again — 晝夜百刻，分配
十二辰，辰得八刻，仍有餘分 … 乃以晝夜為九十六刻，一辰有全刻八焉 (S1-f, S1-g; Siku control S2-b, S2-c).
The 明史 sets its 96-ke sentence inside the passage on the Jesuits (S5-a, S5-b); a Tier B paper calls
96 ke of 15 minutes "the Western division" (S4-a, paraphrased); the 清史稿 lists it among Schall's
forty-two points (S6-a). **The ledger contains no source that argues the relationship between these**,
so the dossier prints both and asserts nothing. Under FRAMING §2.4 a transmission claim needs a named
scholar, work, year and page; I have none, so there is no row.

**2.5 The Huihui scheme is kept separate.** The 明史 卷37 records, for the **Islamic** method,
時二十四，每時六十分。刻九十六。每刻十五分 and 命時起午正。午初四刻屬前日 (S7-a, S7-b) — a 96-ke,
15-minute, 24-hour system with a noon day-start, sitting in a Chinese official history a century
before the Qing reform. That is a tempting adjacency and the fetcher explicitly cautioned against
merging it. It is recorded in its own variant, labelled as a distinct system, with no claim of
influence in either direction.

**2.6 No animal is attached to an hour.** Two facts are separately attested — branch↔animal
(論衡, S14-a…S14-h; Doolittle, S16-a, S16-b) and branch↔hour (S15-a, S15-b; S9-a…S9-c). Chaining them
into "the hour of the rat" would be my inference. Doolittle attaches the animals to the **year**
(S16-c), and searches of his vol. II for *hour of the rat*, *double hour*, *twelve hours*,
*divisions of time* and *watches* returned no hits. So each entry's `associations.animal` is worded
as *the animal a source pairs with that branch*, and the gap entry records the search that justifies
saying so.

---

## 3 · The findings I think are worth the round

**3.1 The 100 → 96 reform happened twice, eleven centuries apart, for the same reason.** 100 does not
divide by 12; 96 does. Liang Wudi's reform of AD 507 is stated in the 隋書 as an explicit remainder
problem (S1-f, S1-g), and Gu Yanwu compresses the whole history to one line: 漢哀新莽以百二十刻為日，
梁武以九十六刻為日 (S8-d). The 明史 gives the seventeenth-century reform the same justification from
the other side — 命日為九十六刻，使每時得八刻無奇零 (S5-a). **The shi is the invariant in both; the ke
was refitted to it.** That is the structural fact a comparison view should carry, and it is Tier A on
both ends.

**3.2 The distribution of the hundred ke was an open dispute for centuries, and the tradition said
so.** At least five incompatible schemes are attested, and two of them sit in the *same* 1715 imperial
compilation on facing arguments:

| Scheme | Which shi get more | Arithmetic | sid |
|---|---|---|---|
| 古法 (reported 1748) | 子午 ten, rest eight | 2×10 + 10×8 = 100 | S12-a |
| 漏刻經 | 寅申巳亥 nine | 4×9 + 8×8 = 100 | S10-a |
| 王氏詩解 | 辰戌丑未 nine — 寅申巳亥 explicitly eight | 36 + 64 = 100 | S10-b, S10-c |
| listed and rejected | 子午 ten; or 子午卯酉 nine; or 夜子時 four | — | S10-f, S10-g |
| 趙緣督 | twelve × eight large ke = 96, residue as small ke | 96 + residue | S10-e |
| 顧炎武's reconciliation | 96 大刻 + 24 小刻 (= 4 大刻) | 96 + 4 = 100 | S8-a, S8-b, S8-c |

The 1715 compilation prints its own verdict on the whole question, quoting the 蠡海集:
**百刻之説衆議紛紛莫有定論** — "the discussions of the hundred ke are many and clamorous, and there is
no settled conclusion" (S10-d). Yu Yan had posed it in the Yuan and rejected both answers then current
(S11-a, S11-b), and the 隋書 records that in practice the ke of the twelve chen *did* differ, and
differed before and after 時正 (S1-j). A comparison view that shows one distribution as "the" Chinese
scheme misrepresents six centuries of the sources disagreeing in print.

The file closes it where the sources close it: 今時憲書時皆八刻，故晝夜共九十六刻 (S12-b, 1748).

**3.3 The 23:00 anchor has a Tier A structural form, not only a Tier B numerical one.** The clock
figure comes from Sôma et al. (S3-a) and practitioner pages (S17-b, S18-a) — B and C. But the 1741
協紀辨方書 states 子正初刻當子中，午正初刻當午中 (S13-a): the 正 point is the **middle** of the branch.
If midnight is zi's midpoint, zi starts an hour before it. The 清史稿 uses 子正 as a calendrical epoch
point (S6-b). That is the Chinese primary-source form of the same fact, and it is why the descriptive
name is 半夜 / 夜半 ("mid-night") rather than a dawn word.

**3.4 The centring convention was already reported lost in AD 938.** Gu Yanwu quotes Ma Chongji:
八刻六十分刻之二十為一時，時以四刻十分為正，此自古所用也 (S8-e) — and immediately,
今失其傳，以午正為時始，下侵未四刻十分而為午 (S8-f). Eight centuries later the imperial manual states
the centred form again (S13-a). Both positions are printed. This is a dispute about practice drifting
over time, not an error one side made.

**3.5 The date this repo previously carried is not in the ledger.** Round 1's shichen dossier said
"100-ke before 1645, 96-ke after". **No retrieved source gives 1645.** Two dates are attested and they
are not the same event: 1628, after which the day had 96 ke (S3-g; S17-d, S17-e); and Kangxi 9 = 1670,
應自康熙九年為始，用九十六刻之曆 (S6-e) — an imperial decision to promulgate, reached after the change
had been recited as a **charge** against Schall in 1665 (每日百刻，新法改為九十六刻, S6-c) and
re-validated by observatory trial in 1669 (南懷仁九十六刻之法既合天象，自應頒用, S6-d). Both are printed;
neither is chosen. The correction is recorded as its own gap entry with the terms searched.

**3.6 Whether the twelve-branch hours are old is a question Gu Yanwu left open, and so does this
file.** For: Du Yu's mapping, with 一日分為十二，始見於此 (S9-a, S9-b, S9-c). Against: the 隋書's
branchless five day-parts and five lettered watches, 晝有朝，有禺，有中，有晡，有夕。夜有甲、乙、丙、
丁、戊 (S1-d), which Gu cites precisely for its negative, 而無十二時之目也 (S9-d); his flat
漢人未有稱夜半為子時者，誤矣 (S9-f); and his refusal to answer, 未知今之所謂十二時者，自何人定之也
(S9-e). Sôma et al. add a dated floor (the Suishu is the first official history to give sunrise and
sunset by the twelve zhi — S3-j, paraphrased). By 1595 the 山堂肆考 prints the pairing as a settled
list with no commentary at all (S15-a, S15-b), which is what a question looks like after it stops
being asked.

---

## 4 · Tier discipline, and one label that overrides the bibliography

- **Tier A** — the branch names, the descriptive day-part names, the animals, the ke arithmetic and
  the whole reform history, all from Chinese primary texts in public-domain editions. The 隋書 was
  fetched **twice**, from two independent transcriptions, as a control on character variants; four of
  the load-bearing 隋書 claims carry a sid from each.
- **Tier B** — Sôma et al. 2004 and di Serego Alighieri & Corsi 2020. Both in copyright, both
  cite-only. They carry the *clock* boundaries, which the Tier A texts give structurally rather than
  numerically. This is the one place where the dossier's strongest layer is not its Tier A layer, and
  the file says so.
- **Tier C** — Doolittle 1865 (public domain, but missionary ethnography, not scholarship and not a
  text of the tradition), Wikipedia (CC BY-SA), and three commercial practitioner pages (in copyright).

**One label overrides its own bibliography.** The 欽定協紀辨方書 (S13) is a 1741 imperial compilation in
a Siku edition, and the fetcher tags it **A** on bibliographic grounds — correctly. Its *content* is
almanac hour-selection doctrine, the direct ancestor of the modern 通書 / 通勝, and the maintainer's
brief requires Tong Shu material to be labelled **Tier C downstream**. The file carries both facts in
the tier string rather than silently picking one, and the hour-selection material lives in its own
variant labelled C, not in the twelve entries.

**No efficacy claim anywhere.** The hour-selection material is reported as doctrine printed by named
sources — what the 協紀辨方書 says, what a modern almanac page says — never as a claim about outcomes.
The one per-entry `toxicFlag` (時破, on 子 and 午) is worded as the **conditional** the source states:
日支衝時支也，如子日午時之類 (S13-f). It is a property of a day/hour *pair*, not of an hour, and the
ledger supplies exactly one worked pair, so exactly one is recorded.

---

## 5 · Polar behaviour, and the layer that would break

The twelve chen are equal fixed divisions of the civil day anchored on a clock instant. Nothing in any
retrieved statement of the rule refers to sunrise, sunset or altitude. So the system is a **total
function of the civil timestamp** and has **no polar failure mode** — it is as well formed at
Longyearbyen in December as at the Sui capital in March. A comparison view must not route shichen
through the repo's seasonal-hour machinery.

The solar-dependent layers are adjacent and separate, and those *would* degenerate: the daylight/
darkness split of the fixed ke total (冬至晝漏四十刻，夜漏六十刻 / 春秋二分，晝夜各五十刻 — S1-b, S1-c),
Yuan Chong's tabulated sunrise and sunset chen (S1-k, S2-e), and his shadow instrument —
充以短影平儀均十二辰，立表隨日影所指辰刻，以驗漏水之節 (S2-h) — which has nothing to point at during
polar night. Note that the instrument **divides the twelve chen evenly** (均十二辰) even while the ke
were being distributed unevenly (S1-j).

One longitude caveat, Tier C, reported without extension: a practitioner page states that the country
runs on a single time zone, gives roughly 80 minutes as Kashgar's offset from Beijing at solar noon,
and gives 4 minutes per degree (S20-a, S20-b, S20-c — all paraphrased here). **The fetcher records that
the page does not state that this moves the 23:00 boundary and gives no hour-pillar error figure.** So
the file reports the three statements and does not chain them into a correction. That chaining is a
one-line arithmetic step and it is exactly the kind of step that produced round 1's rejected claims.

---

## 6 · The eight gaps, and what each one is worth

All eight carry `searchedWhere[]`, `searchTermsUsed[]` and `whatWasFound`, per RESEARCH-PROTOCOL C2.
None is `confirmed-absent` — a distinction worth stating, because round 1's confirmed gaps were the
worst failures in the round.

| # | Claimed absent | Confidence | Why not stronger |
|---|---|---|---|
| 1 | A ruler assigned to any shichen | could-not-determine | The fetcher did not search for one and says so |
| 2 | Clock ranges for the other ten branches | probably-absent | Three routes to a full table failed or lacked ranges |
| 3 | An animal naming a double-hour | probably-absent | Five terms searched in Doolittle vol. II; **vol. I not fetched** |
| 4 | The Sôma et al. Appendix (twelve names + intervals) | could-not-determine | Four retrieval routes; a paywall is not an absence |
| 5 | Anything on the AD 102 clepsydra reform | could-not-determine | Petersen 1992 not digitised anywhere reachable |
| 6 | 1645 as the changeover year | probably-absent | 1628 and 1670 found instead; corrects round 1 |
| 7 | The heading of Yuan Chong's 冬至 row | could-not-determine | Both transcriptions carry the figures, neither the header |
| 8 | A stated shichen-boundary shift from the single time zone | probably-absent | The page's silence is recorded by the fetcher, not inferred by me |

**Gap 4 is the one to fix next.** It would convert ten derived clock ranges into ten read ones and
would be worth more than any other single fetch on this system. Routes that failed: the OUP article
PDF (HTML interstitial under a browser UA), ADS scanned full text (403), the ADS abstract page (empty
body), and the NAOJ author directory (199-byte forbidden page; siblings probed, only `200405-3.pdf`
exists and it stops at p. 896). A library proxy or an interlibrary copy is the realistic route.

Secondary: sizes.com returned 403 and had branch/animal/clock-range tables in the search snippet;
Doolittle vol. I was never fetched.

---

## 7 · Textual variants carried through

The 隋書 double-fetch existed to catch these, and it did.

| Variant | Witnesses | Verdict |
|---|---|---|
| 硃史 / 朱史 | S1-i / S2-d | A real transcription difference; the Siku reading (朱史) is the older witness |
| 醜 / 丑 | S1-l / S2-f | Simplified→traditional conversion artefact, **not** a textual variant. Ship 丑 |
| 隅中 / 禺中 | S9-b / S15-a | Two readings of the 巳 day-part name; both printed in the 巳 entry |
| 日入者百也 | S9 transcript | 百 is OCR for 酉 — the reason the 酉 entry does not cite S9 |
| 日{PUA}失者未也 | S9 transcript | corrupt for 日昳者未也 — the reason the 未 entry does not cite S9 |
| 卜楚卜 / 卜楚丘 | S9 transcript | OCR |
| 目周分 / 日周分 | S7 transcript | OCR |
| 己亥 / 巳亥 | S10-a | **Material** — it changes which four shi receive the ninth ke |

The last one matters: 己 for 巳 in the 漏刻經 quotation is the difference between a scheme that gives
the extra ke to 寅申巳亥 and a nonsense reading. It is flagged in-data at the source record, not only
here.

---

## 8 · Files

- `research/horae/v2/shichen.json` — the dossier. 12 entries, 12 variants, 12 golden values, 8 gaps,
  108 source records (one per ledger snippet, each with url / locator / tier / pd / `shippable`),
  11 `notObtained` records.
- `research/horae/v2/shichen-notes.md` — this file.

`node scripts/research-validate.mjs --dir research/horae/v2 --strict` → **0 violations**.
Every sid token appearing anywhere in the JSON resolves to a `sources[]` id; all 108 ledger snippets
are cited in a structured `snippetIds` array; no entry lacks a sid; no entry carries a `ruler`
property.
