# Egyptian hours of night and day — research notes, gaps, open questions

Compiled 2026-08-01 for **Horae Mundi**. Companion to `egyptian.json`.
Governed by `docs/FRAMING.md`. Nothing below is prescriptive; nothing below claims efficacy.

---

## 0. The one-paragraph version

The Amduat gives twelve hours of night, each a region with a name and (sometimes) a gate and a
goddess. The **public-domain witness names a goddess for only eight of the twelve**; hours 4, 5 and 6
have none, hour 3's candidate is ambiguous, and **all twelve day-hours are empty**. Egyptian
timekeeping — decan risings, then water clocks, then shadow tables — is a *different subject* from
the Amduat and cannot be reconstructed by dividing sunset-to-sunrise by twelve, which is what any
modern engine will actually do. Both facts are the deliverable. The tidy 12-goddess tables that
circulate online are, at minimum, not what this witness contains, and their two most-copied region
names are errors their own author corrected on an errata leaf.

---

## 1. What I actually did

**Fetched and read in full:**

| What | How |
|---|---|
| Budge, *The Egyptian Heaven and Hell* vol. I = *The Book Am-Tuat* (1905) | Internet Archive OCR of the UCLA copy, `theegyptianheave01budgiala_djvu.txt`, 248 kB, scanned exhaustively |
| Same text, clean HTML | sacred-texts.com `/egy/bat/bat04.htm`–`bat15.htm` + `errata.htm`, fetched with a browser UA (WebFetch is 403'd there; `curl` is not) |
| Parker, *The Calendars of Ancient Egypt*, SAOC 26 (1950) | free PDF from ISAC Chicago, `pdftotext`, 316 kB, grepped |
| Ainsworth, *A Timeline of the Decans* (Queen's MA, 2018) | Queen's repository PDF, `pdftotext`, grepped |
| Brack-Bernsen's review of Miller & Symons, *Down to the Hour* | BMCR 2020.11.44 |
| USNO rise/set/twilight values for Luxor | `aa.usno.navy.mil/api/rstt/oneday`, five separate dates |

**Method note on the Budge OCR.** The first three greps returned zero hits and I nearly concluded
Budge names no hours at all. He does — the OCR simply breaks the phrases across line ends, so
`"name of this hour"` never matches while `name\s+of\s+this\s+hour` matches fine. Every extraction in
this dossier was therefore run against whitespace-normalised text, and every hit was then
**re-verified against the clean sacred-texts HTML** so that no name in `egyptian.json` rests on OCR
alone. That double pass is why the readings below carry no OCR artefacts (`Ea` for `Ra`,
`Sesilet` for `Seshet`, `Euti` for `Ruti`) that the raw scan is full of.

**Tried and failed** — recorded because a confirmed failure is a result:

- **Jéquier 1894** (`archive.org/details/JequierGustave1894`), a second PD edition of the abridged
  Amduat: the item exists, the metadata resolves, my download URL mis-encoded the accented filename
  and returned a 404 HTML page. *This is the cheapest outstanding check in the whole dossier.*
- **Schomberg on the Karnak clepsydra** (Berlin Studies of the Ancient World 53): `ECONNREFUSED`
  from refubium.fu-berlin.de, twice, on two URL forms.
- **Met Museum, "Telling Time in Ancient Egypt"**: HTTP 429, twice.
- **Neugebauer, *The Exact Sciences in Antiquity***: the Internet Archive copy is lending-restricted;
  the full-text-search endpoint returns "Item not available".

---

## 2. The Amduat night hours, as the witness actually gives them

Budge's rendering supplies three different kinds of name and does **not** supply all three for any
hour. Reading across:

| Hr | Region ("City") | Gate | Hour-goddess | Budge p. |
|---:|---|---|---|---|
| 1 | Net-Ra *(fields: Maati; Net-Ra, warden Arnebaui)* | — | **Ushem-hat-kheftiu-nu-Ra** | 3, 8–11, 20 |
| 2 | Urnes | — | **Seshet-maket-neb-s** | 21, 43 |
| 3 | Net-neb-ua-kheper-aut *(warder Khetra)* | — | *"the Hour Tent-baiu"* — **ambiguous** | 44, 50 |
| 4 | Ankhet-kheperu | — | **none** | 62 |
| 5 | Ament *(the Kingdom of Seker)* | — | **none** | 85 |
| 6 | Metchet-mu-nebt-Tuat *(chambers Het-stau-kher-aha, Het-temtet-Ra)* | — | **none** | 116 |
| 7 | **Thephet-shetat** *(heading prints "Thephet-Asar")* | Ruti-Asar | **Kheftes-hau-hesqet-[neha]-hra** | 139–40 |
| 8 | Tebat-neteru-s | Aha-an-urt-nef | **Nebt-usha** | 161–2 |
| 9 | Best-aru-ankhet-kheperu | Saa-em-keb | **Tuatet-maketet-en-neb-s** | 186–7 |
| 10 | Metet-qa-utchebu | Aa-kherpu-mes-aru *(Budge: "door")* | **Tentenit-uheset-khak-abu** | 207–8 |
| 11 | Re-en-qerert-apt-khatu | Seken-tuatiu | **Sebit-nebt-uaa-khesfet-seba-em-pert-f** | 232–3 |
| 12 | **Kheper-kekiu-khau-mestu** *(heading prints "Then-neteru")* | Then-neteru | **Maa-nefert-Ra** | 256–7 |

Three things to notice, all of them load-bearing:

1. **The gate column is empty for the first six hours and full for the last six.** That is a property
   of the text as Budge renders it, not of my extraction: hours 7–12 all carry the same tripartite
   colophon ("the name of the gate … the name of this City … the name of the hour"), and hours 1–6
   do not.
2. **Hour 3 is a trap.** The string is real — p. 50, "This great god paddleth through this Field
   towards the Hour TENT-BAIU" — but Budge never calls it the name of the third hour, and *towards*
   is at least as consistent with the hour being entered next. Recorded, unassigned.
3. **The square brackets in hour 7 are Budge's own restoration**, not editorial decoration. Render
   them.

---

## 3. Two errata, one dead link, and a family of wrong tables

This is the most concretely useful finding in the dossier, and every step of it was verified by
direct fetch.

Budge's volume carries a printed **ERRATA** leaf, which includes:

> p. 139, l. 3, for "Thephet-Asar" read "Thephet-shetat"; p. 256, l. 3, for "Then-neteru" read
> "Kheper-kekiu-khau-mestu."

Those two lines are the **chapter headings** of divisions VII and XII. In other words, the two
region names Budge printed at the head of two chapters are wrong, and he said so at the front of the
book. In the twelfth case the reason is plain from his own running text: **Then-neteru is the GATE**,
and the City is Kheper-kekiu-khau-mestu.

Now the propagation:

- The Internet Sacred Text Archive transcription — by a wide margin the most linked full text of the
  *Book of Am-Tuat* — reproduces both **uncorrected** headings. Verified: `bat10.htm` is titled
  "…WHICH IS CALLED THEPHET-ASAR", `bat15.htm` is titled "…WHICH IS CALLED THEN-NETERU".
- Its index links to an **"Errata"** page. That page exists (`/egy/bat/errata.htm`, HTTP 200) and
  contains, in its entirety: *"page 140: 'againt'->'against'"* — a transcription typo fix. **It does
  not reproduce Budge's errata at all.** (`bat16.htm`, the filename the chapter nav also gestures
  at, is a 404.)
- Consequently: **any Amduat hour-table whose seventh region is "Thephet-Asar" or whose twelfth is
  "Then-Neteru" is downstream of the uncorrected online transcription, not of the book.** That is a
  fingerprint a reader can check in five seconds, and it is worth putting on the page.

A general-purpose web search performed during this round returned exactly that signature —
a twelve-region list ending "…Re-En-Qerert-Apt-Khatu, and Then-Neteru". The error is live.

---

## 4. The "goddess of hour N" table, and where a fake one would come from

The brief asked me to say so if a per-hour goddess table circulates without ancient warrant. Here is
the honest statement, and its limits.

**What I can assert:** the public-domain witness names a goddess for eight of the twelve night
hours. Hours 4, 5 and 6 have none — verified by scanning each of those chapters for *every*
occurrence of the phrase "the name of", which returns nothing at all for IV and V and only two
chamber-names for VI. **Any complete twelve-row goddess table is therefore carrying at least three
rows that this witness does not supply**, and the burden is on whoever publishes it to name a source
that does.

**What I must not assert:** that anybody fabricated anything, or that they took the names from a
particular place. I have no evidence of derivation and FRAMING §2.4 forbids me inventing the
argument.

**What I can put beside it, as a fact about the text:** Budge's **First** Division contains, in its
upper register, "Twelve divine beings, in the form of women, who are described as *the goddesses who
guide the great god*" — Tentenit, Sbai, Mat-neferu-neb-set, Khesefet-smatet, Khuai, Maket-ari-s,
Urt-amt-Tuat, Her-ab-uaa-set, Mesperit, Ushem-hat-kheftiu-s, Sheset-kerh-maket-neb-s,
Teset-tesheru (pp. 11–12). All twelve stand **in hour 1**. Budge maps none of them to hours.

And three of them resemble hour-names attested elsewhere in the same book: no. 10
*Ushem-hat-kheftiu-s* beside hour 1's *Ushem-hat-kheftiu-nu-Ra*; no. 11 *Sheset-kerh-maket-neb-s*
beside hour 2's *Seshet-maket-neb-s*; no. 9 *Mesperit* standing bare.

That resemblance is **recorded and not interpreted**. It might mean the register *is* the roster of
hour-goddesses. It might be an artefact of Budge's romanisation. It might be coincidence in a
composition that generates twelves the way this one does — the same hour also holds nine praising
gods, nine singing apes and twelve fire-throwing serpents. Deciding is Egyptology, and this file is
not Egyptology. What the file does is guarantee that **no engine can quietly use that register to
fill hours 4, 5 and 6**, because those three cells are hard-coded to `unattested` and there is a
golden value asserting they stay that way.

---

## 5. The timekeeping layer — why the clean 12-hour mapping is a model, not a clock

Four separate systems, none of which is "divide sunset-to-sunrise by twelve":

**Decan star clocks (First Intermediate Period onward).** Thirty-six stars or asterisms, rising ten
days apart; twelve visible through a night; each rising marks a new hour. Diagonal star charts on
coffin lids: columns are decades, rows are the hours 1–12 (Ainsworth 2018, pp. 4–6, after Symons
1999 and Neugebauer & Parker *EAT* I). The hours so marked are explicitly **"of varying length
(depending on the time of the year)"** (Ainsworth p. 2). And Symons's demolition, as reported in
BMCR 2020.11.44: *no* set of real stars both rises heliacally on the right dates **and** rises at
even intervals through the night — so the decans mark **uneven** intervals. A modern twelfth-of-the-
night is smoother than anything the decans ever produced.

**Transit clocks (New Kingdom).** The scheme shifts from heliacal risings to meridian transits
(cenotaph of Seti I, tomb of Ramesses IV, P. Carlsberg 1); Ainsworth, following Parker, notes the
transit scheme runs 360 days and falls 5¼ days short of the year, so "there is little likelihood
that these clocks were of real-time keeping utility."

**Water clocks.** The Karnak clepsydra of Amenhotep III: twelve engraved scales, one per **civil
month**; filled to the brim at **sunset**; when the level reaches the first mark of that month's
scale, the second hour of the night begins (Parker §208). So night length is a **step function of
the civil month** read off a fixed table — and because the Egyptian civil year wandered a quarter-day
a year, that table drifts. Parker uses the drift to date it (shortest scale II šmw, longest IIII ꜣḫt
⇒ I ꜣḫt 1 near the autumn equinox, ~5 October, under Amenhotep III, and therefore **no evidence for a
fixed Sothic year**). Von Lieven and Schomberg push the shortest-night month back to 9, which
re-dates the scheme by ~250 years and makes the instrument **already obsolete when it was cut**.
Both readings are carried in the JSON. Neither is resolved.

**Shadow clocks.** The day side. I have **nothing** on them. Everything this dossier says about
day-hours rests on arithmetic, not on an Egyptian instrument. Say that on the page.

### The day-start tangle

Three boundaries, three purposes, one civilisation, all sourced:

- **Dawn** starts the civil day — Parker SAOC 26 §32: *"That the day in Egypt began at dawn, and was
  reckoned from one dawn to the next, has been fully demonstrated."* Sethe (quoted at §33) gets to a
  morning start by a different route. Sunrise remains the live alternative, and the choice moves the
  Egyptian civil date of a Sothic rising and hence its Julian conversion — this is a chronology
  question, not a UI preference.
- **Sunrise** starts the twelve day-hours.
- **Sunset** starts the twelve night-hours and is where the clepsydra was physically filled.

`egyptian.json` declares dawn (Parker) and then says out loud that the other two exist. **A page
that picks one and calls it "the Egyptian day start" without printing the other two is asserting
something no source asserts.** And the golden value for the dawn marker is explicit that equating
Parker's "dawn" with the −6° civil-twilight definition is a **modern convention with no ancient
warrant** — the test exists to make that choice visible and falsifiable, not to validate it.

---

## 6. Golden values — what phase 2 should test, and why these

Six, in `goldenValues`. The astronomical ones are anchored on **USNO**, which is a US Government
work and therefore public domain, published to whole minutes, queried live for this dossier at
Luxor (25.6989 N, 32.6421 E, UTC+02:00 — Egypt has DST since 2023, so December and March are both
safely EET; I deliberately avoided a June case for that reason).

1. **Day hours, winter solstice** — span 10:33:00, hour 00:52:45, twelve boundaries to the second.
2. **Night hours, winter solstice** — span 13:28:00, hour 01:07:20, crossing midnight (this is the
   case that breaks naive implementations).
3. **Equinox, both** — and this one earns its place: even at the March equinox the day-hour is
   **60m35s** and the night-hour **59m20s**. An engine returning exactly 60:00 for both has quietly
   substituted geometric sunrise for the published, refraction- and disc-corrected almanac value.
   That is a real bug this test catches.
4. **Dawn marker** — 06:06 local on 2026-12-21, pinning the disclosed −6° convention.
5. **The Karnak clepsydra months** — a *non-astronomical published table*: month 10 shortest, month 4
   longest (Parker Fig. 17), **and** the test must assert the competing month-9 reading ships
   alongside it. A build carrying only one position fails. This is the FRAMING §1.3 rule made
   executable.
6. **The twelve region names in order**, with the two errata applied — asserting that entries 7 and
   12 do *not* read "Thephet-Asar" and "Then-Neteru", and that hours 4, 5, 6 hold the literal string
   `unattested`. This is the regression test against the whole failure mode described in §§3–4.

Suggested tolerance: ±90 s against USNO on any boundary (whole-minute publication plus model
differences), and ±1 s on the equality of the twelve intervals to each other.

---

## 7. Open questions for a human

1. **Do hours 4, 5 and 6 have names in the Amduat itself?** Hornung, *Texte zum Amduat*. If yes,
   Budge's omission is itself worth a line; if no, the gap is the tradition's and is more
   interesting still.
2. **Collate Jéquier 1894.** Second PD edition, French, abridged recension. Would corroborate or
   isolate all eight of Budge's hour-names for the price of one successful download.
3. **Are the twelve goddesses of Division I the hour-goddesses?** §4 above. Needs an Egyptologist,
   and the answer changes what the page may render.
4. **Did the decanal night include twilight?** Neugebauer & Parker *EAT* I; Neugebauer, "The Egyptian
   'Decans'", *Vistas in Astronomy* 1 (1955) 47–51. Unresolved here, and it moves **every** night
   boundary.
5. **Dawn or sunrise for the declared day start**, and does the UI marker mean dawn, sunrise or
   sunset? Someone must decide; the page must print the decision *and* the alternatives.
6. **Do we want day-hours at all?** If the twelve day cells stay empty, say so loudly and treat the
   emptiness as content. If not, someone reads Piankoff 1942 and Faulkner 1954/1958 — and the
   dossier is amended, not guessed at.
7. **The clepsydra "fingers".** The 12-to-14 scheme (implying a 7:6 longest-to-shortest night ratio)
   is repeated everywhere and is recorded **nowhere** in `egyptian.json`, because I could not verify
   it. If it is verified from Borchardt 1920 or Ritner, *JNES* 75.2 (2016) 361–89, it becomes a
   striking finding, because Thebes' real ratio is about **1.28 : 1**, not 1.17 : 1 — an ancient
   scheme that is wrong for the latitude it was used at. **Do not publish that comparison until the
   ancient number is sourced.** Half of it is currently a rumour.

---

## 8. Framing compliance

- **No invented attributions.** Three hour-goddess cells and twelve day-hour cells are `unattested`
  and there is a golden value that fails the build if they are ever filled.
- **No verbatim in-copyright text.** Parker, the Brill volume, BMCR, Ainsworth, Hornung, Neugebauer
  & Parker, Piankoff and Faulkner are all `cite-only`. The only reproduced strings are short
  identifying phrases from Budge 1905 (PD, published 1905 — comfortably clear of the 1930 threshold)
  and from Parker for identification of a specific claim.
- **Every datum tagged** `{system, source, tier}`; every source carries a fetched/not-fetched flag
  and a locator, and the ones I could not get say so in their own entry.
- **Conflicts kept, both sides.** Parker vs von Lieven & Schomberg on the clepsydra month;
  Neugebauer & Parker vs Conman on the decanal belt; dawn vs sunrise; the Division-I goddess
  register left open.
- **Living tradition:** n/a — this is a dead cult, but the register is the same museum-label
  register used elsewhere on the site. No "ancient wisdom" framing anywhere; the Amduat is a text
  with a manuscript history, not a mystery.
- **No efficacy, no outcomes, no toxins.** Nothing in this system prescribes anything. No hour is
  called good or bad for anything, because no source read for this dossier says any such thing —
  which is itself worth stating on the page, since every neighbouring system in Horae Mundi does.
