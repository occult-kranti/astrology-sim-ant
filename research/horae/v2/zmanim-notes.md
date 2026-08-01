# zmanim v2 — compiler's notes

**System:** Jewish sha'ot zemaniyot — the dawn/dusk opinions that change the clock.
**Round:** 2, under the fetcher/compiler split (RESEARCH-PROTOCOL §3, C3).
**Round 1 verdict being answered:** NEEDS-REWORK (light), five blockers.
**Data file:** `research/horae/v2/zmanim.json`.

---

## 1 · The hard constraint, and what it cost

I could cite only snippet ids present in the fetcher's ledger. No source was introduced;
nothing was cited from my own knowledge. Every one of the ledger's **103 sids is cited
somewhere in the dossier**, and every entry, variant and golden value carries at least one.
A self-check in the build script fails the file if a sid appears in prose or in a
`snippetIds` array without resolving.

What that cost, stated as a loss rather than hidden:

- **All of round 1's computed times are gone.** The Jerusalem / Lakewood / NYC golden-value
  sets, verified to the second against Hebcal and the repo's vendored Astronomy Engine, have
  no ledger snippet behind them, so they are not here. `goldenValues` now contains only
  figures a ledger source *published* — 72 min ↔ 16.1°, 36 min ↔ 8.5°, 90 min ↔ 19.8°/19.75°,
  78/88 minutes at the solstices, the JE's 13½ min ↔ 3½°, Notis's 4.37°, and the 34ʹ+16ʹ
  refraction constant. That is a real regression-data loss and phase 2 should re-derive the
  times deliberately, labelled as derived.
- **Round 1's nine derived polar cut-off latitudes are gone,** including the unsourced 26° row
  the report flagged as blocker 3. `polarBehaviour` now carries only what the ledger says:
  the Gaon's own midnight-dawn remark, the Bavel-at-the-tekufah limitation, the JE's 50°/60°
  overlap dates, and Gewirtz's Israel-vs-Prague magnitudes. The one inference I make (a deeper
  angle fails at a lower latitude than a shallower one) is labelled **COMPILER'S NOTE, not a
  sourced claim**, in the field itself.
- **Four daytime hours are blank** — 2, 5, 8 and 9. Round 1 filled some of them from a wider
  source set. No sid, no row.

## 2 · Blockers from PHASE1-REPORT §1.1, one by one

1. **False gap on the Gaon's own words — FIXED, and the fix is not the one the report expected.**
   The Gaon's own voice *is* now in the dossier: Beur HaGra OC 261:2, Lemberg 1893, PD-US,
   at `S14-a`/`S14-b`/`S14-c`. But that comment is about **bein ha-shmashot**, not about the
   endpoints of the twelve-fold span. So `variants[endpoints-gra]` carries an explicit
   provenance note: every attribution of *the endpoints* to the Gra in this ledger is still a
   **report** of him (MB 58:4, MB 443:8, SA HaRav, Touger, Gewirtz), not his own words.
2. **Merged conflict on the mil — FIXED, but see §3.** 18, 22.5 and 24 minutes are all in the
   dossier with their own variant row, and 90 minutes is recorded as reached by *two
   incompatible routes* (5 mil × 18 and 4 mil × 22.5) rather than as one number.
3. **The 26° row — GONE.** No sid, so no row.
4. **The unrecomputed misheyakir figures (11.5°, 10.2°) — GONE.** Neither angle appears in
   this ledger at all, so neither appears here.
5. **Self-contradictory quotation policy — FIXED, and stated once in `scopeNote`.** MB 58:4 is
   quoted, on the ground the report gave: Warsaw 1884–1907, term expired, PD-US; an unlicensed
   digitisation cannot create a new copyright in the underlying words. Its "unknown" licence is
   carried as a transcription-accuracy caveat and travels with the sid in `ledgerSources`.

## 3 · ONE THING I COULD NOT RESOLVE, AND A HUMAN SHOULD

`PHASE1-REPORT.md` blocker 2 asserts that **Beur HaGra on OC 459:2** sharply rejects the
18-minute reckoning and concludes a 22.5-minute mil, and quotes Hebrew for it. That phrase has
no sid in this ledger, so it is not reproduced here or in the JSON.

**This round's fetcher retrieved that exact ref and found a short comment about flour and
kneading.** It recorded the miss explicitly and told the compiler not to cite the locus.

Both statements are about the same URL. One of the two retrievals is wrong, and I have no way
to adjudicate it from inside the ledger — so I did not. The 22.5-minute mil is still in the
dossier, but attributed only to where this ledger actually finds it: Peninei Halakhah's
footnote (`S22-d`, `S22-d3`) and the Jewish Action review of Notis (`S24-c`). It is **not**
attributed to the Gra. This is `gaps[0]` and `honestLimits` item 4. Someone with the Lemberg
volume, or a second independent fetch, should settle it before anything downstream cites
"Biur HaGra 459:2" for mil-length — that citation is currently unsupported in this repo.

## 4 · Ruler column: FALSE, with the search on the record

`hasRulerColumn: false`, and **no entry carries a `ruler` property at all** — not `"none"`,
not `"unattested"`, nothing. Round 1 wrote `"unattested"` into all twelve cells; a renderer
reads the field, and a filled field is a claim.

The search is in the ledger rather than asserted. Bavli Shabbat 129b assumes an hour-ruler
premise in a bloodletting sugya (`S18-a`), and Rashi — Vilna Shas, printed 1880–1886, PD-US —
spells out the full rotation over the same numbered daytime hours:

> שעה ראשונה של ד' בשבת שימש שבתאי ובשניה צדק ואחריו מאדים ואחריו חמה ואחריו נוגה ואחריו כוכב ואחריו לבנה
> — Rashi to Shabbat 129b, s.v. דקיימא ליה מאדים בזווי (`S18-b`)

That is a real seven-planet hour cycle in rabbinic literature. **It is not a ruler column.**
Nothing in this ledger applies it to the halachic prayer clock, and no source names the ruler
of a sha'ah zemanit. `gaps[2]` records the search, the terms and what came back. Per the
maintainer's grid ruling, the absence is the teaching.

## 5 · Quotation policy, applied

Verbatim text appears in `zmanim.json` and in this file **only** from sources the fetcher
verified as PD-US or CC0: the Lemberg 1893 Shulchan Arukh / Magen Avraham / Beur HaGra, the
Warsaw 1882 Terumat ha-Deshen, the Warsaw 1884–1907 Mishnah Berurah and Biur Halacha, the
Vilna Shas Rashi, the Torat Emet Rambam and Mishnah, the 1901–06 Jewish Encyclopedia, and
Sefaria's CC0 community translations.

Everything else is cite-only and **paraphrased, never reproduced**: the William Davidson
Talmud and Mishnah English (CC-BY-NC — which is why Pesachim 94a, Shabbat 34b and Shabbat 129b
appear here only in paraphrase, even though the underlying texts are ancient), Touger,
Peninei Halakhah, the Kehot Shulchan Aruch HaRav, Gewirtz, KosherJava (LGPL-2.1), MyZmanim,
Jewish Action and royzmanim.com.

`ledgerSources[]` in the JSON is **deliberately not named `sources[]`.** The C1 check in
`scripts/research-validate.mjs` requires every `sources[]` member declaring `fetched:true` to
carry a verbatim snippet; satisfying it here would mean copying in-copyright text into the
file, which the standing rule forbids outright. So each sid carries `quotable: true|false`,
with `snippet` present only when quotable and an explicit `snippetWithheld` reason otherwise.
The evidence artifact for cite-only sids is the fetcher's ledger — which is where C3 puts it.
*If a future validator checks `snippetIds` against the fetcher's ledger, this array is the
provenance index it needs and the rename should be handled there rather than by importing the
text.*

## 6 · What a builder must not do with this file

- **Do not render a single "MGA" column.** Gewirtz records that the Magen Avraham's *evening*
  endpoint is itself in dispute (`S19-c`). "Alot to tzeit" is a family of arithmetics.
- **Do not compute the MGA hour independently of the Gra's.** The dawn and dusk offsets are
  defined relative to sunrise and sunset; Gewirtz reports the dependency (`S26-d`).
- **Do not build a night column on `S23-g` alone.** The only night statement in the ledger is
  the 1901–06 Jewish Encyclopedia's, and its wording ("whichever is the longer") is odd on its
  face. No Tier A snippet here divides the night.
- **Do not identify chatzot with solar transit.** Nothing in the ledger does. `gaps[9]`.
- **Do not re-attribute anything second-hand.** Bursztyn, Zilber, Karp, Benish, the Chazon Ish,
  Rabbeinu Tam and R. Ovadia Yosef are present *only* as someone else reports them, and each is
  labelled that way in place. Rabbeinu Tam in particular: Tosafot to Pesachim 94a is not
  digitised at the ref tried, so his position exists here **only as the Biur Halacha reports
  it** (`S15-a`, `S15-b`).
- **Do not trust the English where it is doing work the Hebrew does not.** The Davidson
  rendering of Mishnah Berakhot 4:1 supplies a sunrise anchor for R. Yehuda's four hours that
  the Hebrew (`S1-a`) does not carry. Sefaria's CC0 translator adds a bracketed 18-min/mil
  gloss at OC 459:2 (`S8-b`) and a metric conversion plus an "approx. 60 minutes" gloss at
  OC 261:2 (`S9-c`) that are in no Hebrew text. All three are flagged in `contestedPoints`.
- **Do not treat 16.1° / 19.8° / 8.5° as halachic positions.** Every one is a *calibration* of
  a minute-count at one place and one season, and every source that derives them says so.

## 7 · Tier honesty

There is **no modern secular peer-reviewed source in this ledger**, and the dossier says so
rather than inflating what it has. The two entries the fetcher tagged B are Ḥakirah vol. 26 —
refereed, with an academic apparatus, but a journal of Jewish law rather than a secular venue —
and the 1901–06 Jewish Encyclopedia, a signed scholarly article that is 120 years old and
which the fetcher caught mis-citing the dawn sugya as "Pes. 84a". Both carry their tier caveat
in `ledgerSources[].pdBasis`. On a strict reading of Tier B, this system has zero.

The thinnest axis is **visible-horizon / netz nir'eh sunrise**: chaitables.com failed at the
connection level and the only trace in the whole ledger is KosherJava's one-line attribution
to R. Yaakov Karp's *Shimush Zekeinim* (`S20-i`). That is a hole, it is marked as one in
`variants[elevation-three-positions]`, and it is `gaps[4]`.

## 8 · Shape

12 entries (4 blank by evidence) · 17 variants across 5 axes (day-endpoints, dawn-interval,
fixed-vs-degrees, nightfall, sunrise-definition) · 9 golden values · 12 gaps · 12 contested
points · 103 sids, all cited.

`node scripts/research-validate.mjs --dir research/horae/v2 --strict` → 0 violations.
