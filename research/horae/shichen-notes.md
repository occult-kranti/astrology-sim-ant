# shichen — research notes, reasoning, gaps and open questions

Companion to `research/horae/shichen.json`. Compiled 2026-08-01.
Research files only; nothing under `assets/` or `pages/` was touched.

---

## 1. What I set out to establish, and what I actually got

The brief named five things. Here is the honest scorecard.

| Asked for | Got | Tier | Verified? |
|---|---|---|---|
| The twelve branch names + boundaries | Yes, both the mainstream and a Song variant | A (arithmetic) / C (table) | Yes |
| **The fixed-civil-not-seasonal point, stated explicitly** | **Yes, with a primary proof** | **A** | **Yes** |
| Zodiac animals | Yes, all twelve — but from *two* chapters of 論衡 | A | Yes |
| Elemental associations | Yes, all twelve — 論衡 gives only eight, 五行大義 supplies the rest | A | Yes |
| Organ associations | Attribution only. Primary fetch failed. | **C** | **No** |
| Tong Shu auspicious-hour layer, labelled almanac-derived | Yes — **and the rule reproduces a printed 1741 imperial table exactly** | A | Yes, twice |
| 100-ke → 96-ke shift, and when | Yes — **and the usual story is wrong in two ways** | A | Yes |
| Modern practitioner vs classical, both kept | Yes — three live disputes recorded, none adjudicated | C | n/a |
| A golden value a Node test can reproduce | Seven, of which four are strong | mixed | Yes |

The two rows I would most want a reviewer to look at hard are the **organ column** (unverified, and it should probably not ship at full weight) and the **twelve-name classical set** (夜半・雞鳴・平旦…, uncontroversial in substance but with no primary locus reached).

---

## 2. The structural point, and why I think it is actually proved

The brief flagged this as CRITICAL, so I went looking for a primary text rather than
a reference-work assertion. I found one, and it proves the point by accident, which
is the best way to have it proved.

隋書·天文志上 (Book of Sui, completed 636 CE), on the clepsydra:

> 至天監六年，武帝以晝夜百刻，分配十二辰，辰得八刻，仍有餘分。乃以晝夜為九十六刻，一辰有全刻八焉。

*In Liang Tianjian 6 (507 CE), Emperor Wu, taking the hundred ke of day-and-night and
distributing them among the twelve chen, found each chen received eight ke with a
remainder still left over. He therefore made day-and-night ninety-six ke, so that one
chen has eight whole ke.*

Read what that sentence has to presuppose to make sense:

1. There is **one pool** of ke covering 晝夜 — day *and* night together, not two pools.
2. The twelve chen partition that single pool **evenly** (辰得八刻 — each chen gets
   eight).
3. The problem being solved is **arithmetical** (100 ∤ 12), not astronomical.

A seasonal-hour system cannot generate that complaint. If the chen were twelve
divisions of daylight, or six of daylight and six of night, their ke count would vary
through the year and "each chen gets eight with a remainder" would be meaningless.
The remainder is only a problem because the divisions are constant. **The reform is
the evidence.**

And the same passage puts the seasonality exactly where it does belong:

> 冬至晝漏四十刻，夜漏六十刻。夏至晝漏六十刻，夜漏四十刻。春秋二分，晝夜各五十刻。

The *daylight share of the fixed total* moves with the season — 40/60 at midwinter,
60/40 at midsummer, 50/50 at the equinoxes. The chen do not. Two different layers,
and they are not to be merged in the comparison view.

**Consequence for phase 2:** do not reuse `planetary-hours.js`'s rise/set machinery for
shichen, and do not let a shared "hour" abstraction imply they are the same kind of
object. They are not. One is an observation of the sky; the other is a naming
convention for the clock.

I deliberately did **not** lean on the NAOJ 暦Wiki page on 定時法/不定時法 for this,
even though it is the obvious authority. The fetch came back garbled — it appeared to
attribute Japan's 1873 adoption of fixed hours to China — and I did not trust the
extraction enough to cite it. The 隋書 passage is better evidence anyway.

---

## 3. The 100-ke → 96-ke story, and the two ways the usual telling is wrong

The received account is: China used 100 ke; the Jesuits brought 96; it was adopted
with the 時憲曆 in 1645. Both halves of that are shakier than they look.

### 3.1 The 96-ke reform happened first in 507 CE

Same 隋書 passage. Emperor Wu of Liang went to 96 ke in Tianjian 6 (507), for
precisely the reason the Qing reform is credited with — 100 does not divide by 12.
He then went to 108 in Datong 10 (544), justified from the apocryphal 尚書考靈曜's
thirty-six *qǐng* tripled; and Chen Wendi restored 100 in the Tianjia era.

So 96 ke is an *indigenous* solution that had been tried and abandoned eleven
centuries before Adam Schall. Whether the Qing reform is a re-adoption, an
independent European import, or a European import that happened to land on a
familiar number, **no scholar I reached answers**, and this dossier does not answer
it either. It is logged in `contestedPoints`.

This is the finding I would most want on the page. It is the kind of thing a
comparison site exists to surface: the "Western reform" was Chinese first.

### 3.2 1645 is a promulgation date, not a settlement date

清史稿 卷45 時憲一 shows the question alive at court for a further generation:

> 康熙四年，議政王等言：每日百刻，新法改為九十六刻

That is 1665, twenty years after promulgation, with the 96-ke change being cited
*against* the new methods during the Kangxi Calendar Case (康熙曆獄) — the affair in
which Schall was condemned and Verbiest exiled. And then the reversal:

> 圖海等赴觀象台測驗，南懷仁所言皆合…竊思百刻雖行之已久，但南懷仁九十六刻之法既合天象，自應頒用。

*Tuhai and the others went to the observatory to test; what Verbiest said all
accorded… Considering that the hundred-ke system has long been in use, since
Verbiest's ninety-six-ke method accords with the heavens, it should be promulgated.*

So there are **three** defensible dates in circulation and all three are printed in
the dossier: 1628 (en-wiki dates the redefinition to the 崇禎曆書 project), 1645
(promulgation), and 1668–69 (settlement after the observatory trial). A pre/post
toggle in the engine must name whose date it uses.

A caution I want on the record: the widely repeated line that Yang Guangxian argued
adopting a 96-ke Western calendar would *shorten the dynasty's fortune* reached me
only at Tier C. It is a good line and I did not verify it, so it is not in the JSON as
a quotation.

---

## 4. The animals: a real finding, and one I nearly got wrong

The standard claim is that 論衡 (Wang Chong, c. 80 CE) is the earliest extant text
with the modern twelve-animal set. I went to check it and found the claim needs
qualifying.

論衡 物勢篇 gives **eleven**:

> 寅木也，其禽虎也；戌土也，其禽犬也；丑未亦土也，丑禽牛，未禽羊也。…
> 亥水也，其禽豕也；巳火也，其禽虵也；子亦水也，其禽鼠也；午亦火也，其禽馬也。

plus, further down, 午馬・子鼠・酉雞・卯兔 and 巳虵・申猴. Tally them: 子鼠 丑牛
寅虎 卯兔 巳蛇 午馬 未羊 申猴 酉雞 戌犬 亥豕. Eleven. **辰 has no animal in that
chapter.** I fetched it twice, from Wikisource and from ctext, and asked directly
about 辰 both times; it is genuinely absent.

The dragon comes from 論衡 **言毒篇** (ch. 66):

> 辰為龍，巳為蛇，辰巳之位在東南。龍有毒，蛇有螫，故蝮有利牙，龍有逆鱗。

So the complete twelve exist in 論衡 only as a **reconstruction across two chapters**.
That is a more precise and more interesting statement than "the earliest complete list
is in 論衡", and it is exactly the kind of cell the project's rules exist to protect:
had I filled 辰=龍 from the same chapter as the others by inference, the table would
have looked tidier and been false.

The 睡虎地 / 放馬灘 Qin daybook priority claim — that an earlier and partly different
animal–branch scheme exists there — I reached only at tertiary level and it is
recorded as *someone else's claim*, unverified, with no priority statement in the
site's own voice.

---

## 5. The five phases: why I needed a second primary source

論衡 物勢 supplies phases for only eight branches (寅木 戌土 丑土 未土 亥水 巳火 子水
午火). It is silent on 卯 辰 申 酉. Under rule 1 those four cells stay empty unless a
source fills them.

They are filled by 五行大義 (Xiao Ji, Sui, c. 594), 卷一, 第五「論九宮數」, via the
Kyoto University Institute for Research in Humanities digital text:

> 北方亥子水也、生數一、丑土也、生數五… 東方寅卯木也、生數三、辰土也、生數五…
> 南方巳午火也、生數二、未土也、生數五… 西方申酉金也、生數四、戌土也、生數五…

That single passage gives all twelve phases *and* the quadrant assignment (亥子丑
north, 寅卯辰 east, 巳午未 south, 申酉戌 west) in one go, and it agrees with 論衡 on
every branch the two share. Two independent primary witnesses agreeing is why the
phase column is Tier A throughout.

Every entry in the JSON records *which* source each cell came from, so a reader can
see that 卯=木 rests on 五行大義 and not on 論衡. That distinction matters more than
it looks: it is the difference between "two witnesses" and "one witness plus an
inference".

One small unresolved friction, printed rather than smoothed: 五行大義 puts 辰 in the
**east** quadrant, while 論衡 言毒 says 辰巳之位在**東南**. These are compatible at
different granularities (quadrant vs 24-point compass) but nobody cited here
reconciles them, so both are printed.

---

## 6. The Tong Shu layer — and the one thing I am genuinely pleased with

The brief asked for this "clearly labelled as almanac-derived rather than canonical".
That framing is exactly right and the evidence supports it hard: **隋書, 論衡 and
五行大義 assign no ruler to any hour whatsoever.** Rulership is not a property of a
shichen. It enters only through the almanac, and it is a function of the **day**.

### 6.1 What I found

Practitioner sources give a mnemonic for seating 青龍 by the day's branch:

> 寅申須加子，卯酉卻在寅。辰戌龍位上，巳亥午上存。子午臨申地，丑未戌上行。

and the twelve spirits in fixed order, six 黃道 (auspicious) and six 黑道.

That is Tier C practitioner literature and the page that gave it names no classical
source at all — it just says 歷家 ("the calendar specialists"). Under the project's
rules that is not enough to ship as a rule.

### 6.2 So I went and tested it against a Tier A printed table

欽定協紀辨方書 (imperially commissioned, completed 1741), 卷三十二, contains
「六十日時辰定局」 — a printed 60-day × 12-hour table. I read two rows off the
四庫全書 recension at Chinese Wikisource and turned the mnemonic into a closed form:

```
anchor(dayBranch)  = (dayBranch * 2 + 8) mod 12        // 子 = 0
spiritIndex(hour)  = (hour - anchor + 12) mod 12
spirits = [青龍 明堂 天刑 朱雀 金匱 寶光/天德 白虎 玉堂 天牢 元武/玄武 司命 勾陳]
黃道 = indices {0, 1, 4, 5, 7, 10}
```

Result, run under the project's conda Node:

```
jiazi  (day-branch zi)   QingLong seated at shen   MATCH=true
   huangdao hours: zi chou mao wu shen you
yichou (day-branch chou) QingLong seated at xu     MATCH=true
   huangdao hours: yin mao si shen xu hai
```

**Twelve of twelve cells, on two independent rows, against a 1741 imperial print.**
That is why the rule is carried at all. Had it missed, the miss would have been
recorded as a discrepancy rather than the rule quietly dropped.

### 6.3 What I could not do

The **庚午日** row did not extract cleanly — the retrieval returned three spirits in
one cell and a bare character fragment in another, plainly a table-alignment artefact
rather than a source disagreement. Its anchor cells (子=金匱, 申=青龍, 酉=明堂,
戌=天刑, 亥=朱雀) do agree with the closed form, but I am not offering a garbled row
as a golden value. A third row should be read off a page image before anyone calls
the rule fully validated.

Two philological notes preserved as printed, not normalised:
- The 四庫全書 text prints **寶光** where most modern lists give 天德.
- It prints **元武** where most give 玄武. The usual explanation is Qing avoidance of
  玄 (Kangxi's personal name 玄燁). **I could not verify that** — what search turned
  up instead was an unrelated Song precedent (真宗 avoiding 玄 → 真武). So the taboo
  explanation is in `gaps`, not asserted.

卷32 also carries **貴登天門時定局** and **四大吉時定局**, two further hour layers.
The first is keyed by *solar term* crossed with the day stem — so unlike the 黃道
layer it *is* seasonal. Both are named and located and neither is transcribed; a later
round can go and get them.

---

## 7. Golden values — what phase 2 can actually test, ranked by how much I trust them

**Strong (Tier A source, verified by me, deterministic):**

- **gv-3 / gv-4** — the 協紀辨方書 甲子日 and 乙丑日 rows. These are the best fixtures
  in the dossier. Note the deliberate design: they are keyed to the *sexagenary day*,
  not to a calendar date, so the hour-spirit rule can be tested **without** first
  solving the day-ganzhi gap (§8). That isolation is intentional.
- **gv-5** — 午時三刻 under both ke systems: 11:43:12–11:57:36 (100-ke) and
  11:45–12:00 (96-ke), from a named academic in a named government journal issue.
  Reproduces as `3 * 1440/100 = 43.2` and `3 * 1440/96 = 45`. Verified.
- **gv-6** — the eight named ke of a shichen with the alias pair
  (未正初刻 ≡ 未初四刻; 申初初刻 ≡ 未正四刻).

**Adequate (arithmetic certain, published table is Tier C but corroborated):**

- **gv-1 / gv-2** — the boundary tables. The mainstream one is corroborated three
  ways (en-wiki, zh-wiki, and derivable from the 隋書 96-ke arithmetic). The
  discriminating test case is **23:30**, which is 子 under the mainstream convention
  and 亥 under the Song one. A test that only checks 14:30 proves nothing, because
  14:30 is 未 under both.

**Weak, and labelled weak (pin the arithmetic, not the locus):**

- **gv-7** — the 五鼠遁 hour-stem grid. The arithmetic is certain and self-checking
  (`((dayStem mod 5) * 2 + branch) mod 10`, verified to close correctly at 癸亥). The
  attribution to 《淵海子平》 is **not** established — the Wikisource transcription is
  marked 此文檔未完成 and lacks the passage.

---

## 8. The gap that matters most: day stem-branch

Two of the layers here — 五鼠遁 hour stems and the 協紀辨方書 hour spirits — need the
**day's** stem-branch, and this system does not supply it. I could not close it, and I
want to be specific about what I actually checked rather than vague about what I
"couldn't find":

- **Hong Kong Observatory**, Gregorian–Lunar Calendar Conversion Table 2026, both the
  English (`T2026e.txt`) and Chinese (`T2026c.txt`) editions: four columns only —
  Gregorian date, lunar date, weekday, solar term. The **year's** 干支 (丙午) appears
  in the title; **the day's does not appear at all**. Checked both editions.
- **Taiwan 中央氣象署** astronomy download page: sunrise/sunset, moonrise/moonset,
  star charts, solar transits, solar-term dates. No 日干支 product linked.
- **Yuk Tung Liu's Chinese Calendar** *does* output day 干支 and documents its
  authorities (GB/T 33661-2017 from Purple Mountain Observatory; 張培瑜 et al.,
  《中國古代曆法》 2008). But it is a carefully-built independent implementation, not a
  published authority, so it is a cross-check and not a golden value.
- The named scholarly references — **陳垣《二十史朔閏表》(1926**, and therefore PD in
  the US) and **張培瑜《三千五百年曆日天象》** — I did not obtain.

This is a confirmed gap, not a shrug. **Phase 2 must not close it by inventing a
formula.** Either someone obtains 陳垣 or an equivalent published table, or the
day-ganzhi-dependent layers ship keyed to the sexagenary day (as the golden values
already are) with the date→ganzhi step left explicitly unsupplied.

---

## 9. The living-tradition disputes, and why I did not settle any of them

Three are recorded, all Tier C on both sides, all current among practising astrologers:

1. **早子時 / 晚子時 (夜子時)** — does the day-pillar change at 23:00 or at 00:00?
   Position 1 (reported mainstream): 23:00. Position 2 (attributed to 袁樹珊, reported
   minority): 00:00, with 23:00–24:00 as 夜子時 taking the 子 branch but the current
   day's pillar. Anyone born in that one hour gets a different chart. Both sides cite
   classical authority against the other.
2. **真太陽時** — read the shichen off the civil clock, or convert to local apparent
   time first (longitude offset plus equation of time)? This is the *only* thing that
   would make shichen location-dependent. The stake is concrete: Ürümqi and Beijing
   share UTC+8 across ~30° of longitude, about two hours of apparent time, so the two
   conventions put a Ürümqi birth two shichen apart.
3. **Where 子 begins historically** — 23:00 (mainstream, and implied by the name 夜半)
   versus 00:00 (Sôma et al. 2004 for the Song).

A default here is a substantive editorial claim, not a UX choice, and the project's
rule 5 says these get the same precision as the historical layers. I have set out all
three and adopted none. **A human has to rule**, and the ruling should be visible on
the page rather than buried in a default.

One caution about a tempting shortcut on #2: the argument that the true-solar-time
correction is a *restoration* (because the classical clepsydra was set to local 夜半
and 日中, hence local apparent time by construction) is genuinely attractive and I
believe it is at least half right. It is still **a Tier C practitioner argument**, not
a scholarly finding, and I have not upgraded it. If the site wants to make it, it needs
a named scholar making it first.

---

## 10. Things I checked and rejected

- **NAOJ 暦Wiki (定時法と不定時法)** — the obvious authority for fixed vs seasonal
  hours, and I wanted it. The extraction came back apparently attributing Japan's 1873
  fixed-hour adoption to China. Rather than cite a garbled reading of a good source, I
  dropped it and used 隋書, which is stronger evidence anyway.
- **sizes.com** and **zysj.com.cn** — both failed to fetch (403; expired TLS
  certificate). The second cost me the primary text for the organ column.
- **ctext.org 論衡 言毒** — hit a CAPTCHA on the second request. Routed to Wikisource
  instead and got the passage.
- **Wilkinson, *Chinese History: A New Manual*** — almost certainly has a clean
  boundary table, is in copyright and therefore cite-only anyway, and I could not
  confirm a page. Not cited, because "this book surely covers it" is not a citation.
- **A published Tong Shu page for a named calendar date** — I wanted one as an
  end-to-end fixture and did not get a stable, citable one. The 協紀辨方書 table is a
  better fixture for testing the rule, but it does not substitute for "the almanac for
  this printed year marks these hours auspicious on this date". Missing, and logged.

---

## 11. Rule-compliance notes for whoever writes the code

- **No efficacy claims anywhere.** The 黃道/黑道 hours are recorded as what a 1741
  almanac prints. There is no affordance for choosing an hour by them, and there
  should not be one — that would be an ordered operative recommendation in the site's
  voice (FRAMING §5 A-3).
- **The organ column is not health information.** Every entry carries
  `meridianCaveat`. It is an unverified attribution to a 1601 acupuncture compendium,
  recorded because the tradition records it. If it cannot be verified against a printed
  《針灸大成》, my recommendation is to drop it rather than ship it at the same visual
  weight as the 論衡 and 五行大義 columns.
- **No toxic materia, no bodily technique, no hostile rite** appears anywhere in this
  system. C-1 through C-6 do not bite. C-7 (aggregation) does not bite either: there is
  nothing here to assemble into a protocol.
- **Empty cells are empty.** `ruler` is `unattested` on all twelve entries, with the
  reason stated, because no source assigns a fixed ruler to a shichen. That is the
  single most important empty cell in the dossier and it should render as "unattested",
  not as a blank that looks like a bug.
- **Quotations** are short technical/historical passages from texts of 80 CE, 594 CE,
  636 CE, 139 BCE and 1741, all PD by age, plus 清史稿 (1928, PD in the US as a
  pre-1930 publication). None is operative instruction; no harm container is required.
  All are well inside the 300-codepoint cap FRAMING §4.5 sets for scripts without word
  spacing.

---

## 12. Open questions for the maintainer

1. Does the comparison page offer the **Song 00:00-anchored** reckoning as a selectable
   convention, or footnote it? It relabels every hour of the day, so this is not a
   footnote-sized decision.
2. Which of **1628 / 1645 / 1668–69** does a pre/post-reform toggle use, and does the
   page name whose date that is?
3. **早子時/晚子時** and **真太陽時**: default to one, offer both, or refuse to pick?
   This is live practice for millions of people and the default is an editorial claim.
4. May the almanac's hour-spirit share a column header with the planetary hour-lord?
   I lean no — 隋書, 論衡 and 五行大義 assign no hour ruler at all, and a shared header
   would manufacture a parallel the Chinese sources do not make.
5. Does the **organ column** ship unverified, ship after someone checks a printed
   《針灸大成》, or get dropped? My recommendation: do not ship it unverified.
6. Is anyone able to obtain **陳垣《二十史朔閏表》(1926)** or an equivalent published
   day-ganzhi table? That single acquisition closes the largest gap here and unlocks
   two layers.
