# babylonian — reasoning, gaps, open questions

Companion to `research/horae/babylonian.json`.
Compiled 2026-08-01. Governing document: `docs/FRAMING.md` v2.

---

## 0. The one-line answer to the question that was asked

**No cuneiform source assigns a ruler to a bēru or to a watch.** Not a planet, not a
god, not a demon. The comparison page must render the Babylonian ruler column empty,
and it must say *why* it is empty, because a blank cell that looks like an oversight is
worse than no row at all.

That is a confirmed negative rather than an unsearched field. What was actually read, in
full, in the Chicago Assyrian Dictionary: `bēru A` (B 208–211), `barārītu` (B 105),
`qablītu` (Q 3–5), `urru A in šāt urri` (U/W 244), `namāritu` (N/1 208), `maṣṣartu`
(M/1 331–339), `šēru A` (Š/2 332), `muṣlālu` (M/2), `lilâtu` (L). Between them those
entries collect several hundred loci across Old Akkadian, Old Assyrian, Old Babylonian,
Mari, Boğazköy, Middle Babylonian, Neo-Assyrian, Neo-Babylonian and Late Babylonian
material — letters, omens, hemerologies, rituals, medicine, epic, lexical lists,
astronomical tables. Time of day is specified constantly. A governing power for a
division of time is never specified once.

The nearest misses, and why each is a miss:

- **The watches are personified and invoked.** *Maqlû* I 3 calls on the evening, middle
  and dawn watches by name alongside the gods of the night; *Maqlû* I 30 and KAR 58 r. 12
  address "the three watches of the night, the wakeful, watchful, restless and sleepless
  ones". They are *addressed*, which is the opposite relation: the watch is the entity
  spoken to, not the entity ruling the interval. Promoting this to a ruler column would
  turn an incantation's vocative into a rulership table.
- **The watches carry omen qualities.** KAR 177 iii 38–39 marks the evening and middle
  watches unfavourable and the morning watch propitious; the Diviner's Manual tabulates
  each night watch as favourable or not for stated undertakings. That is a *quality*
  field, and the schema has one. It is not an agent.
- **One watch has a country.** "The morning watch concerns Elam" (Thompson Rep. 242 rev. 2;
  ACh Supp. 2 Sin 19:13). That is the closest thing in the corpus to a per-division
  association — and it is a land, not a planet. No land was found for the other two.

---

## 1. The structural finding: this is two systems, not one

The single most important thing for whoever writes the code:

| | bēru | maṣṣartu (watch) |
|---|---|---|
| length | **fixed** — exactly 2 h, always | **seasonal** — a third of actual daylight or actual night |
| count per nychthemeron | 12 | 6 (3 of night, 3 of day) |
| subdivides into | 30 UŠ; 1 UŠ = 60 NINDA | nothing attested |
| named individually | **no** | **yes**, all six |
| carries a quality | no | yes, for the night watches |
| needs astronomy | no | yes |
| coincide? | only at equinox, where 1 watch = 2 bēru | |

They must be computed by two different code paths and must not be nested. A grid that
divides a watch into bēru, or groups bēru into watches, is an arrangement no Babylonian
made.

The bēru is also 30° of arc and a road-distance of over 10 km — CAD's entry gives all
three senses under one lemma. That triple duty is *why* the system is sexagesimal and
*why* the bēru is not seasonal: you cannot have a unit that is simultaneously 1/12 of a
circle and a stretchy hour.

---

## 2. The trap that would have shipped

In MUL.APIN's day-length and shadow-length sections, `EN.NUN` / *maṣṣartu* means the
**whole** of the daytime or the **whole** of the night — not a third. Gehlken (1991)
and Brown–Fermor–Walker (1999–2000) established this; Steele (2013) adopts it and shows
Pingree's arithmetic fails without it.

So MUL.APIN II ii 21, "3 minas is a daytime watch, 3 minas is a nighttime watch", means
daylight = 180 UŠ and night = 180 UŠ, total 360 UŠ = 24 h. Read "watch" as a third and
you get 9 minas of daylight and the scheme does not close.

Neugebauer (1975) and Pingree (in the standard 1989 edition, and modified in 1999) read
it as a third. Anyone building from the older literature — which includes most of what a
general search surfaces — will be out by a factor of three. It is in
`variants[v-massartu-sense]` and it is why that variant exists.

---

## 3. Why the golden values are the ones they are

The brief asked for at least one **published** table a Node test can reproduce. Six are
given; the load-bearing one is **GV-1**.

**GV-1/GV-2** are Table 1 of Steele, *SCIAMVS* 14 (2013) 5 — day and night lengths in UŠ
for the 15th of each of the twelve ideal months, under both the 2:1 and the 3:2 ratios.
The journal is freely readable, the PDF was fetched in full, the table is unambiguous,
every row sums to 360, and the sexagesimal-to-decimal conversion is stated in the dossier
so a test can't get it wrong. This is the best available reference vector for this system.

**GV-3** is MUL.APIN's own four cardinal-day statements in minas. It anchors GV-1 in the
primary text and it fixes the mina-of-water conversion (1 mina = 60 UŠ = 2 bēru = 4 h).

**GV-4** is the unit arithmetic, which a test can assert without any astronomy at all:
1 bēru = 30 UŠ, 1 UŠ = 60 NINDA, 12 bēru = 360 UŠ = 86 400 s.

**GV-5** is the only *observational* datum: a Neo-Assyrian letter reporting six double-hours
of daylight and six of night at the 15th of Nisannu. It is the sole attested case where
the 6+6 split is true, and it is worth pinning precisely because a reader will otherwise
assume 6+6 is the normal shape.

**GV-6** is the ziqpu circle — 12 bēru = 360 UŠ, against AO 6478's own total of 364 —
which is both a unit check and a live scholarly dispute.

### What is deliberately NOT a golden value

Watch lengths. If a watch is a third of the schematic night, then at summer solstice a
night watch is 40 UŠ = 2 h 40 m, at equinox 60 UŠ = 4 h, at winter solstice 80 UŠ =
5 h 20 m. That arithmetic is correct and it is **mine**, not any source's. No text read
here joins the day-length scheme to the three-fold division — the schemes that give
lengths use "watch" to mean the whole night, and the texts that use three watches give no
lengths. It is parked in `derivedNotPublished` with a warning, so a test can use it for
internal consistency without the page ever presenting it as attested. This is
FRAMING §5 A-2 in practice: the empty cell is the honest render.

---

## 4. Day start — the distinction that matters

The Babylonian **calendar day** begins at sunset. That is settled and multiply sourced.

But it does not by itself give the engine an epoch, and conflating the two would be a
quiet error:

- The schematic texts give **lengths**, never a start instant.
- The attested running counts anchor on the **nearest boundary event**: "the first
  double-hour of the day" counts from sunrise, "a double-hour of the night" counts from
  sunset. ACT 200 iv 17 measures "five double-hours of daylight after sunrise".
- **A continuous 1→12 bēru cycle from sunset through the next sunset is not attested
  anywhere in what was read.** If the engine draws one twelve-cell strip, that strip is a
  modern reconstruction and has to be labelled.

Note the corollary: because the count restarts and the unit is fixed, the count is *not*
capped at six. Under the 2:1 scheme the winter night runs to eight bēru. A UI that lays
out exactly six night cells and six day cells is showing the equinox and calling it the
system.

---

## 5. Polar behaviour — the genuinely interesting result

The bēru **does not break anywhere.** It is a fixed twelfth of the mean solar day; it is
2 hours at the equator and 2 hours at the pole. This system is, on that axis, the most
robust in the whole comparison — and it is robust for the same reason it has no rulers:
it is a metrological unit, not a liturgy.

What breaks is the *anchor*. Above the polar circles there are stretches with no sunrise
and no sunset, so "n double-hours after sunrise" has no referent even though the unit
survives. Any epoch the engine substitutes is the engine's.

The watches break properly. Three thirds of a zero-length night are three zero-length
watches. There is no attested Babylonian rule, because the case could not arise. Render
"not attested in this witness".

And the schematic schemes should not be evaluated at the user's latitude *at all*. The
2:1 ratio does not fit Babylon and Steele says so flatly. It is arithmetic, not
measurement. If the page offers it, offer it as a fixed table.

---

## 6. Open questions for a human

1. **Rochberg-Halton, "Babylonian Seasonal Hours" (Centaurus 32, 1989) could not be
   obtained.** Wiley 403, Brill preview 403. It is the field's dedicated treatment of
   exactly the question the brief poses. Everything this dossier says about the *absence*
   of a Babylonian seasonal hour is provisional pending it. **This is the single highest-value
   follow-up.** A library copy would settle both this and the Herodotus question below.
2. **Herodotus II.109.** He says the Greeks got the polos, the gnomon and "the twelve parts
   of the day" from Babylon. Twelve bēru of the nychthemeron, or twelve seasonal daylight
   hours? The two candidates differ in kind, not just in label. Neugebauer's *HAMA*
   discussion was not obtainable either. Recorded as contested, not adjudicated.
3. **Does the comparison page keep the label "Chaldean hours"?** The repo's existing
   `planetary-hours.js` is documented as "Chaldean unequal hours". That name is a Greek
   and Roman origin claim. Nothing found here corresponds to it in cuneiform. Keeping the
   label is defensible; letting adjacency imply descent is not. Editorial call.
4. **May the engine draw hard watch boundaries?** No text states the rule of division and
   none gives a watch a length; "one third" may be the modern description of a guard rota
   judged by eye or by star. Bands rather than lines might be the honest render.
5. **The watch→land row.** Only the morning watch has a country. Do not complete it.
   Someone with access to the *Enūma Anu Enlil* eclipse tablets could check whether a full
   three-watch scheme exists; if it does not, the single-cell row is the finding.
6. **KAR 177 iii 38–39 should be checked in the original** (Ebeling's copy; Labat,
   *Hémérologies et ménologies d'Assur*, 1939). The two half-lines that carry the watch
   qualities were taken from two different CAD volumes. The reading is almost certainly
   right; it is simply not first-hand here.

---

## 7. Provenance discipline notes

- **Nothing in-copyright is reproduced.** MUL.APIN's lines are Hunger's edition and are
  cite-only; the numerals are reported as data with locus, which is what §4 permits and
  what a comparison table needs. Oppenheim's *Diviner's Manual* is cite-only; the
  transliterated sign sequences reported are the ancient tablet's own signs.
- **The one PD quotation used** is Herodotus II.109 in Godley's 1920 Loeb, public domain
  in the United States on the pre-1930 ground (FRAMING §4.3). It is a single attributed
  sentence, not a quotation container.
- **Public-domain items cited but not obtained** are flagged `fetched: false` with an
  `unverified` note: Harper's *ABL* (1892–1914), Thompson's *Reports* (1900),
  Thureau-Dangin *RA* 10 (1913), Ebeling's *KAR* (1919–23). All four are PD in the US and
  all four are reported at second hand through the CAD. Someone with access should
  upgrade them.
- **The CAD is tiered B**, as a lexicographic compilation, but the loci it prints are
  Tier A primary attestations and are treated as such in the entries. Its PDFs are freely
  downloadable from the publisher and were fetched in full; the volumes themselves remain
  in copyright and are cite-only for text.
- **One Tier C source is included on purpose.** The Wikipedia "Planetary hours" article
  says the scheme has "possible roots in older Babylonian astrology" in its lede while its
  own first footnote says there is no evidence for that. It is cited as evidence of what
  the popular account says — and of the fact that the popular account already disclaims
  itself. It is never presented as the tradition's own claim.

---

## 8. What a reviewer should attack first

- The claim that no ruler exists is a universal negative over a corpus I read through a
  dictionary. The dictionary is exhaustive for the lemmas I read; I did not read every
  lemma. If a ruler exists, the likeliest hiding places are the *Enūma Anu Enlil* eclipse
  tablets, the Late Babylonian "kalendar texts" / micro-zodiac material, and the
  hemerological series `iqqur īpuš`. None was read.
- The six-watch scheme rests substantially on **one tablet** (K.6476, the Diviner's Manual
  duplicate), corroborated by *Enūma eliš* V 46 ("the watches of the night and the day")
  and by the CAD's cross-references. It is well founded but it is not densely attested,
  and the three day-watch names come from a single line.
- The 2:1 / 3:2 material is second-hand from one open-access article. It is by the leading
  living authority on Babylonian schematic astronomy and is internally consistent with the
  primary lines it prints, but it is one source.
