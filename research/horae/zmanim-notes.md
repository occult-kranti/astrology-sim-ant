# zmanim — research notes, reasoning, gaps and open questions

Companion to `research/horae/zmanim.json`. Everything here is working reasoning, not shippable copy.
Written 2026-08-01. Nothing under `assets/` or `pages/` was touched.

---

## 1. What I set out to establish, and what I actually got

The brief said: expose the options, don't pick one, name the poskim, give exact arithmetic.
That turned out to be the easy half. The hard half was **finding which of the popular
"MGA vs GRA" framings survives contact with the primary texts.** It mostly doesn't, and that
correction is the most valuable single thing in this dossier.

What I verified first-hand (fetched, read, transcribed the Hebrew):

| Locus | What it gave me |
|---|---|
| Rema to Shulchan Aruch, Orach Chayim **233:1** | The rule itself, verbatim, with the word *sha'ot zemaniyot* |
| **Mishnah Berurah 233:4** | The rule restated, plus "there is a dispute among the poskim" with both spans |
| **Mishnah Berurah 58:4** | MGA counts from amud ha-shachar; "the opinion of the Gra is from ha-netz ha-chamah" |
| **Mishnah Berurah 443:8** | "and the opinion of the Gra is like them" — the explicit Gra attribution |
| **Magen Avraham 58:1** | MGA in his own words: "here all agree we count from alot ha-shachar" |
| **Magen Avraham 233:3** | ⚠ THE BIG ONE — see §2 |
| **Terumat ha-Deshen I:1** | The text MGA is citing, with "from alot ha-shachar until tzeit ha-kochavim" in it |
| **Bavli Pesachim 93b–94a** | The 5-mil / 4-mil dispute — origin of 90 and 72 |
| **Shulchan Aruch, Orach Chayim 459:2** | mil = ¼ hour + 1/20 hour = **18 minutes** |
| **Bavli Shabbat 34b** | The bein ha-shemashot baraita and the ¾-mil measure |
| **Rambam, Hilchot Tefillah 3:1–4** | 6.5, 9.5 and "an hour and a quarter remains" (= 10.75) |
| **Mishnah Berakhot 1:2, 4:1** | 3 hours, 4 hours, chatzot, plag, 7 hours |
| **Mishnah Berurah 261:23** | ⚠ THE OTHER BIG ONE — see §3 |

What I did **not** get, and it matters: **the Vilna Gaon's own text.** See §7.

---

## 2. The finding that changes the page: the "GRA" column is older than the Gra

Every luach, every app and every library in existence prints two columns and labels them
**MGA** and **GRA**. That labelling is a century-and-a-half of convention, and it is not what
the sources say.

**Magen Avraham, Orach Chayim 233:3**, on Rema's word *u-mesha'arinan*, in full (my working
translation of the Hebrew I fetched):

> In Terumat ha-Deshen it is implied that we measure **from amud ha-shachar until tzeit
> ha-kochavim**, and see what I wrote in siman 443 — **but in the Levush and in the Lechem
> Chamudot they wrote that we measure from ha-netz ha-chamah until its setting, and so wrote
> the Shiltei ha-Gibborim**; and it seems to me there is a proof for their words from Pesachim
> 93b, that the time of slaughter is only until the beginning of shki'ah…

So:

* The sunrise-to-sunset position is **not the Gaon's innovation.** It is the Levush
  (R. Mordechai Yaffe, d. 1612), the Lechem Chamudot (R. Yom-Tov Lipmann Heller, d. 1654) and
  the Shiltei ha-Gibborim — all before the Magen Avraham, let alone before the Gra (b. 1720).
* **The Magen Avraham reports both schools himself**, and even supplies a proof for the one he
  does not follow. The popular presentation of him as a partisan is unfair to the text.
* Mishnah Berurah 443:8 says the Gra holds **"like them"** (כמותם) — i.e. joins an existing
  school. That is the language of adherence, not of authorship.

**Open question for the maintainer.** Three options and I do not think a researcher should pick:

1. Print the conventional label (`GRA`) because that is what a practitioner will recognise on
   their own shul board, and footnote the correction.
2. Print `Levush–Gra` and lose recognisability.
3. Print both the label and the attribution chain in the cell.

I lean (3), but this is an editorial call about who the page is for.

---

## 3. Mishnah Berurah 261:23 is the halachic licence for degree-based computation

This one surprised me. The usual story is that degrees are a modern astronomical overlay on a
minutes-based tradition, tolerated rather than warranted. MB 261:23 says otherwise, in its own
voice, Tier A, in a public-domain digitisation:

> …all agree that the measure of three quarters of a mil **changes according to the time and
> the place**, and this was not said in the gemara except for **the horizon of Babylonia and
> at the season of Nisan and Tishrei**, when the days and nights are equal; and in our places,
> which incline to the northern side of the world, **it lengthens much more**…

That is a nineteenth-century posek saying the Talmudic minute-figure is latitude- and
season-indexed. It is exactly the argument a degree-based computation makes. Anyone presenting
16.1° / 19.8° / 8.5° as "the astronomers' gloss" is under-selling the halachic basis, and the
page should quote this.

The same passage also gives the Gra's position on bein ha-shemashot — that it begins the moment
the sun is hidden from our eyes and runs ¾ mil, against Rabbeinu Tam. So the Gra is
*consistently* the earlier-ending-day authority at both ends: sunset rather than nightfall,
Geonim rather than Rabbeinu Tam.

---

## 4. The derivation chain for 72 and 90, end to end

Worth writing out because it is short, it is entirely Tier A, and it makes the numbers stop
looking arbitrary:

```
Bavli Pesachim 93b   R. Yochanan: alot→netz = 5 mil ;  shkiah→tzeit = 5 mil
Bavli Pesachim 94a   R. Yehuda baraita: 4 mil and 4 mil
Shulchan Aruch OC 459:2   1 mil = ¼ hour + 1/20 hour = 15 + 3 = 18 minutes
                          ⇒ 4 mil = 72 min      5 mil = 90 min
KosherJava / luach practice   sun's depression 72 min before sunrise, Jerusalem, equinox = 16.1°
                              sun's depression 90 min before sunrise, Jerusalem, equinox = 19.8°
                              120 min ⇒ 26°   (deprecated for leniency; lechumra only)
```

Note the last line: **26° cannot be computed at New York City on the summer solstice** (cut-off
40.57 N; NYC is 40.71 N). A library that offers it must fail there, and KosherJava's own docs
deprecate it as lechumra-only.

The `misheyakir` angles are the same kind of back-calibration — 11.5° ≈ 52 min, 11° ≈ 48 min,
10.2° ≈ 45 min before Jerusalem sunrise at the equinox — but with the crucial difference that
**there is no primary source fixing the minute figure in the first place.** Shulchan Aruch
58:1 gives a recognition test and nothing else. So for misheyakir the chain has no Tier A
anchor at all, and the dossier says so.

---

## 5. Golden values: how I built them and why I trust them

I did not want to hand phase 2 a table I had merely copied. So:

1. Pulled three cases from the **Hebcal zmanim API** (a named, dated, URL-addressable
   publication, response `version: v1.4.2`).
2. Recomputed every one of them **from scratch with the repository's own vendored Astronomy
   Engine** (`assets/js/lib/astronomy.js`) — `SearchRiseSet` for sunrise/sunset,
   `SearchAltitude` for every depression angle, then the proportional arithmetic by hand.
3. Compared.

Result: **every value agrees to the second, modulo Hebcal's nearest-minute rounding.** Examples
from Jerusalem 2026-03-21 — Hebcal `chatzot 11:47`, recomputed `11:46:33`; Hebcal
`sofZmanShma 08:44`, recomputed `08:44:14`; Hebcal `alotHaShachar 04:30`, recomputed 16.1°
depression at `04:29:44`.

Two implementation traps I found while doing this, both worth a test:

* **Hebcal's own naming is inconsistent.** `alotHaShachar` is the **16.1° degree-based** dawn,
  but `sofZmanShmaMGA` (unqualified) is the **72-fixed-minute** value. At Lakewood 2026-03-21
  those two are 8 minutes apart on the dawn (05:38 vs 05:46) and 4 minutes apart on the Shema
  (09:21 vs 09:25). If our page mirrors Hebcal's field names it will silently mix two opinions
  in one column. **Do not do that.**
* **Hebcal rounds, and doesn't document it.** I inferred nearest-minute from the data
  (11:46:33 → 11:47). A phase-2 test should either round our output to the minute before
  comparing, or allow ±1 min, and should say in a comment which and why.

The fourth golden row is **derived, not published**: the latitude cut-offs for each depression
angle on the June solstice, computed by bisection with the vendored engine. It is labelled as
derived in the JSON. It is the single best regression test in the dossier because it catches
the class of bug that produces a confident wrong answer rather than an error.

---

## 6. The polar section is not decoration

Two things I want on the record.

**(a) The problem starts in England, not the Arctic.** On the June solstice the sun stops
reaching 16.1° above 50.47 N. London is 51.51 N. So **London has no Magen Avraham degree-based
day for a stretch of every summer** while its Gra day is perfectly well defined. That is a live
halachic situation for a large community, and it is a large part of why fixed-minute reckonings
persist in northern Europe rather than being displaced by degrees.

Full computed table (June solstice, sea level, sun's centre below geometric horizon):

| depression | last latitude at which it occurs |
|---|---|
| 0.833° (sunrise) | 65.73 N |
| 6° | 60.57 N |
| 7.083° | 59.48 N |
| 8.5° | 58.07 N |
| 10.2° | 56.37 N |
| 11.5° | 55.07 N |
| 16.1° | 50.47 N |
| 19.8° | 46.77 N |
| 26° | 40.57 N |

**(b) Halacha's four answers are four different clocks.** Star-K's survey (R. Dovid Heber)
gives Minchat Elazar ("don't go"), Tiferet Yisrael (keep your home city's times), Ben Ish Chai
(declare 6 a.m. sunrise, 6 p.m. sunset), and Mo'adim u-Zmanim (use the sun's high and low
points). These are not four phrasings of a consensus. The page must expose the choice or refuse
to compute — and refusing is respectable.

---

## 7. Confirmed gaps (these are results, not failures)

1. **The Biur ha-Gra was not obtained.** Sefaria 404s on every ref form I tried
   (`Biur HaGra on Shulchan Arukh, Orach Chayim 459:2`, `…261:2`, and the Biur Halacha refs
   too). So the Gra's position rests here on MB 58:4 and MB 443:8 — Tier A, but a *report* of
   the Gaon. Given §2, someone should chase the actual glosses before the page asserts what
   the Gra held.
2. **Rambam's Commentary on the Mishnah, Berakhot ch. 1** — the source Rema names for the whole
   rule — not retrieved. We are quoting the citer.
3. **No Tier B at all.** I searched for peer-reviewed treatment of halachic twilight and of the
   seasonal-hour system and came up empty on anything I could open and confirm. The one journal
   PDF I did extract (Ḥakirah vol. 8, Bernard Dickman) turned out to be about the *calendar*.
   Sacha Stern, *Calendar and Community* (Oxford, 2001) is the obvious candidate for the
   evening-day-boundary question and I did not consult it. **This hole should be filled.**
4. **Cohn 1899** — the Frankfurt UB scan is behind a bot check. This is the one *printed,
   pre-1930, public-domain* published table in the whole dossier; obtaining it would give
   phase 2 a golden reference that isn't a piece of software, and would let us quote rather
   than paraphrase.
5. **Shulchan Aruch ha-Rav / Seder Hachnasat Shabbat** not opened; Baal ha-Tanya's 1.583° and 6°
   come via KosherJava. Chabad.org's own explainer returns HTTP 403 to automated fetching.
6. **Ateret Torah's tzais offset has no number in anything I read** — KosherJava makes it a
   settable parameter with no documented default in the extracted text. That variant is
   therefore *uncomputable* without a communal luach. Recorded rather than guessed.
7. **Southern hemisphere and equator unchecked.** Every golden value is northern mid-latitude;
   the polar cut-offs are June-solstice only.

---

## 8. Licence discipline — read this before anyone quotes anything

The temptation on this system is severe because Sefaria makes everything look equally free.
It isn't.

**Quotable (verified PD-US, pre-1930 publication, Sefaria labels them Public Domain):**

* Shulchan Aruch, Orach Chayim — *Maginei Eretz*, **Lemberg 1893** (all simanim used here)
* Magen Avraham — Sefaria version labelled Public Domain
* Terumat ha-Deshen — **Warsaw 1882**
* Mishnah Berurah — the **"On Your Way"** version (233:4, 233:14, 261:23, 443:8) is labelled
  Public Domain
* Mishnah (Hebrew) — *Torat Emet 357*; Mishneh Torah (Hebrew) — *Torat Emet 370*

**NOT quotable, cite-only:**

* Anything from the **William Davidson Edition** (Koren/Steinsaltz) — CC-BY-NC. That covers the
  vocalized Aramaic Talmud text I read for Berakhot 26a, Pesachim 93b–94a and Shabbat 34b.
  CC-BY-NC is not in FRAMING §4.1's permitted set (`pd-us`, `cc0`, `cc-by`). Cite the Vilna
  folio; do not reproduce Sefaria's text.
* **Touger's Mishneh Torah** English (© Moznaim, CC-BY-NC).
* Mishnah Berurah **58:4 and 89:5** — Sefaria served these from a version titled `Wikitext`
  with `license: unknown`. The *work* is PD-US by age, but this *digitisation* has no stated
  licence, so treat as cite-only until a scan of an original printing is used. (Annoying,
  because 58:4 is the single best sentence in the dossier.)
* KosherJava's Javadoc prose (LGPL 2.1 — the *code* is reusable, the prose is not PD).
  Everything from it in the dossier is paraphrased.
* Star-K, Peninei Halakha, Hebcal site content — in copyright, paraphrased only.

**Second-hand attributions.** A large number of poskim in `variants` reach us through
KosherJava's Javadoc rather than through their own books — Bursztyn, Zilber, Karp, Benish,
Manet, Posen, Shakow, Machatzit ha-Shekel, Pri Megadim, Minchat Kohen, the Komarno chain, the
asymmetric-day chain, Auerbach, Sternbuch. Every one of those is flagged "reported at second
hand" in the JSON. **They must stay flagged on the page.** KosherJava is meticulous and gives
page numbers, but it is Tier C, and presenting its citations as if we had read the books would
be exactly the failure this project exists to avoid.

---

## 9. Notes for whoever writes the engine

* **Every zman is a partial function.** Degree-based ones return "does not occur" above their
  latitude cut-off; sunrise-based ones return the same above the polar circles. Never clamp,
  never extrapolate from a neighbouring date, and **never silently fall back to another
  opinion** — that last one produces a plausible time attributable to nobody, which is worse
  than an error.
* **Elevation cannot be a global switch.** Degree-based zmanim are defined against the
  *geometric* horizon and are unaffected by elevation *by construction*; fixed-minute and
  proportional ones shift with it. One elevation policy applied to a whole table misstates at
  least one row. KosherJava models this correctly and it is worth copying the shape.
* **Chatzot is not one thing.** Midpoint-of-span ≠ solar transit, and in the asymmetric
  variants chatzot is not midday at all. A single "chatzot" row spanning all columns is a false
  statement about some of them.
* **Not every boundary is `n × shaah`.** The Komarno reckoning (3 *ordinary* hours before
  chatzot) and Terumat ha-Deshen §121's erev-Pesach rule (2 hours before chatzot) are offsets
  from an anchor, not fractions of a span. A data model with only `{count, span}` cannot
  express them.
* **Hours 2 and 8 are empty and must render empty.** The classical sources mark boundaries, not
  hours. This is a genuine structural difference from the Chaldean planetary hours already in
  `assets/js/core/planetary-hours.js`, where every hour has a ruler by construction. Do not let
  the comparison layout imply otherwise.
* **`ruler` is `unattested` for all twelve, deliberately.** There *is* a Jewish planetary-hour
  tradition, and Magen Avraham 58 even gestures at a Zoharic twelve-hour night count (Zohar
  Vayakhel p. 342) while saying explicitly that it is *not* how prayer times are reckoned —
  "as I wrote in siman 233". Two counting systems in one commentary, for different purposes.
  Whatever the planetary-hour tradition is, it is **a different system** and must not be
  cross-populated into these cells. That would be exactly the completion-by-inference that
  FRAMING §5 A-2 forbids.

---

## 10. Open questions I could not resolve and am handing up

1. Do we label the column `GRA`, `Levush–Gra`, or both? (§2)
2. Do we ship the misheyakir row at all, given that no posek is attached to any of its numbers?
   My instinct: yes, clearly marked "calibration, no primary source" — because the *absence* is
   itself informative and a reader will otherwise wonder why it's missing.
3. Equinox or equilux for the degree calibrations? The difference is ~9 seconds, so it doesn't
   matter numerically — but if we state the calibration in prose we have to pick a word, and
   Ohr Meir and Manet/Mertzbuch disagree.
4. Which refraction constant? 34′ (KosherJava's global average, giving Baal ha-Tanya 5.93°) or
   31′ (Manet's Israel figure, giving 5.88°)? Whatever we choose changes a *published degree*,
   so it must be disclosed on the page, not buried in the engine.
5. Should the polar fallbacks (Tiferet Yisrael, Ben Ish Chai, Mo'adim u-Zmanim) be *computable*
   options, or only described? Computing "6 a.m. is sunrise" is trivial; computing "use the
   times of the place you came from" needs a second location input. I'd describe all four and
   compute none, but that's a product decision.
