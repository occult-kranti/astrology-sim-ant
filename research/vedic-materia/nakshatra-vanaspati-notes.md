# The nakṣatra-vanaspati — compiler's notes

Companion to [`nakshatra-vanaspati.json`](./nakshatra-vanaspati.json). Compiled 2026-08-01
under [RESEARCH-PROTOCOL.md](../../docs/plans/horae/RESEARCH-PROTOCOL.md) C3, the
fetcher/compiler split, and [FRAMING.md](../../docs/FRAMING.md) §11, the
documented-practice amendment.

**Every row in the JSON carries at least one snippet id from the fetcher's ledger, and
the whole ledger — including its eleven failed and one deliberately-declined fetches — is
persisted in `ledgerSources[]` so the evidence chain can be re-walked.** No source was
introduced by the compiler. Nothing was cited from the compiler's own knowledge. A
mechanical check over the finished file confirms 106 distinct sids used, 0 of them absent
from the persisted ledger, and 0 entries without a sid.

**Quotation policy in this file.** The Sanskrit of the Rājanighaṇṭu, the Nārada Purāṇa,
the Atharvaveda-Pariśiṣṭas (Bolling & von Negelein 1909–10) and the Bṛhatsaṃhitā (Kern
1865) is public domain, as are Iyer 1884, Monier-Williams 1899 and pw 1879–89; those are
quoted. The Motilal AITM translation, Soni et al. 2023 and every practitioner or
commercial page are **cite-only** — paraphrased here, never reproduced. Note separately
that the GRETIL **files** are CC BY-NC-SA 4.0 even though the verses they carry are PD;
Wikipedia is CC BY-SA 4.0. The ≤25-word verification extracts required by protocol C1
live in the JSON's `ledgerSources[]` and go no further.

---

## 1 · The headline result, and it is better than the brief expected

The brief anticipated that this list "circulates widely in modern practice but its
attested source is much narrower than the circulation suggests." That is right, and the
narrow source turned out to be **findable, quotable and public-domain**.

The Rājanighaṇṭu of Narahari does not merely happen to contain the list. It announces it,
counts it, and states its own indexing rule, in a passage the 1896 Ānandāśrama edition
prints under its own numbered section heading — `( ३२ ) नक्षत्रवृक्षाः।` (`ANAND-1`),
running head `राजनिघण्टुः । ३२७` (`ANAND-12`):

> atha vakṣāmi nakṣatravṛkṣān āgamalakṣitān / pūjyān āyuṣyadāṃś caiva varddhanāt pālanād api
> — Rājanighaṇṭu 2.41 · `RAJNI-1`, printed at v. 33 · `ANAND-2`

> amī nakṣatradaivatyā vṛkṣāḥ syuḥ saptaviṃśatiḥ / aśvinyādikramād eṣām eṣā nakṣatrapaddhatiḥ
> — 2.44 · `RAJNI-4`

That second verse is what makes the whole dossier possible. **The text states its own
count (twenty-seven) and its own indexing rule (in order from Aśvinī), so the positional
assignment is not the compiler's arithmetic.** Everything downstream is reading a list the
text says is a list.

The 27 names sit in two verses (`RAJNI-2`, trees 1–13, ending *krameṇa*; `RAJNI-3`, trees
14–27, ending *kramāt*), and I re-derived both counts by hand against the fetcher's own
locus annotations before writing anything down.

And a second, independent Sanskrit witness carries the same 27 names in the same order:
Nārada Purāṇa Pūrvabhāga 89.144–147 (`NARP-1`…`NARP-4`, chapter established at
`AITM-4`).

---

## 2 · The one thing I refused to inherit from the fetcher

**The ledger's own summary line calls the Nārada Purāṇa "the earliest located witness."
I have not carried that, and the reason is in the same ledger.**

- The Rājanighaṇṭu's 14th-century date rests on a wisdomlib aggregator page (`RDATE-1`,
  `RDATE-2`; alternative titles at `RDATE-3`) — Tier C — and the fetcher records that
  Meulenbeld, the standard authority, was unreachable. Weakly sourced, and flagged as such.
- The Nārada Purāṇa is worse. Ch. 89 sits **outside** Hazra's pre-11th-century core of
  Pūrvabhāga chs. 1–41 (`NDATE-1`; the Pūrvabhāga runs to 125 chapters, `NDATE-2`).
  Rocher holds every Purāṇa's composition date unclear (`NDATE-3`). Wilson's low-end
  estimate is the **16th or 17th century** (`NDATE-4`) — which would put it *after*
  Narahari.
- **No scholar anywhere in this ledger has compared the two passages or stated a
  priority.** Under FRAMING §2.4 that means there is no row for the site's own inference
  to occupy.

What survives without inference is narrower and more interesting: Narahari's own closing
verse names his sources —

> ācāryoktau sphuṭam atha bṛhatsuśrute nāradīye nārāyaṇyāṃ kvacid api tathānyatra tantrāntareṣu
> — Rājanighaṇṭu 2.46 · `RAJNI-6`, printed witness `ANAND-11`

— and one of the three names he gives, *nāradīya*, demonstrably carries the doctrine. The
other two, **Bṛhat-Suśruta and "Nārāyaṇī", could not be traced at all**: no e-text, no
edition, no catalogue entry, no scholarly discussion (gap 7). So a 14th-century compiler
names three authorities, one is verifiable, two have vanished, and the direction of
borrowing between the surviving pair is undetermined. That is the honest shape of it.

**Corollary worth shipping.** The 19th-century lexica knew exactly one locus. Böhtlingk's
entry for *nakṣatravṛkṣa* gives a single textual citation — `Rājan 2,41` (`MW-3`) — under
a definition that is otherwise unremarkable (`MW-1`, `MW-2`). Whatever the doctrine's real
distribution, its **documented** footprint was one verse in one nighaṇṭu when Western
lexicography went looking.

---

## 3 · Three traditions, and where the evidence refuses to be tidy

The brief's central instruction was to keep homa woods, mansion trees and incense apart.
The evidence supports the separation **on the indexing principle**, which is the right
axis, and it also contains one honest counter-example that I have not suppressed.

**The separation is textual, not asserted.** Atharvaveda-Pariśiṣṭa 26 is the pariśiṣṭa
*devoted to samidhs* (`AVP-6`). Its series —

> arkaḥ palāśo madhuko nyagrodhodumbaras tathā / plakṣo 'śvattho gomayānikuśāś ca samidhaḥ kramāt
> — AVParis 26,5.6cd–5.7ab · `AVP-7`

— is nine members (seven woods, plus cow-dung and kuśa), and the text's **very next
words** index it:

> yathākrameṇa samidha ādityādigraheṣu ca
> — 26,5.7cd · `AVP-8`

*Grahas beginning with the Sun.* Not nakṣatras. And the same pariśiṣṭa gives a third,
incompatible indexing principle in the same chapter — samidh by **purpose**: puṣṭi, śānti,
wealth, kingship (`AVP-9`). Three indexes, one plant vocabulary.

**Meanwhile a nakṣatra-indexed plant system that is NOT this list also exists**, in
Pariśiṣṭa 1, the Nakṣatrakalpa (`AVP-1`). Its nakṣatra series at chs. 42–45 is a
**bathing** rite (`AVP-2`), and its cells are plural and heterogeneous where the tree list
is singular: Kṛttikā takes a leaf-infusion of śirīṣa, aśvattha and vaṭa *together*
(`AVP-3`); Ārdrā takes resins and aromatics rather than any tree (`AVP-4`); and Śraviṣṭhā
takes **sandalwood** (`AVP-5`) where the tree list gives **śamī**. That last pair is the
cleanest single demonstration available: *same mansion, two nakṣatra-indexed plant
systems, two different plants.*

**The modern merge is documented in the present tense.** A commercial supplier sells a
product called "Nakshatra Samidha" and defines it on the page as the woods of the trees
representing the 27 nakṣatras, for homa (`BHAKTI-1`, `BHAKTI-2`). That is category (1)
sold as category (2), with the definition printed on the product page.

**And here is the counter-example I am not burying.** The Nārada Purāṇa itself burns a
person's *janma-nakṣatra* tree as homa fuel — three times in one chapter, at 1,90.172,
1,90.185 and 1,90.215 (`NARP-6`, `NARP-7`, `NARP-5`). So a textual bridge from the tree
list to fire-fuel exists. It is specific (the wood comes from an *individual's birth
star*, not from a graha index) and it sits inside an **abhicāra** chapter. It is not the
generic commercial nakṣatra-samidha. Both facts ship, side by side, unreconciled.

> **Rendering constraint, and it is a hard one.** Those three loci are **described here
> and not quoted, and must not be quoted downstream.** They pair a target slot (the enemy)
> with an operative homa sequence, and that combination is forbidden site-wide by FRAMING
> §5 C-5 — a promise the amendment deliberately widened from wing-scope to site-scope. The
> publishable facts are the locus, the category and the existence of the bridge.

---

## 4 · Where the modern versions diverge — six cells, named

The Sanskrit witnesses agree closely on the **names**. The modern circulating tables
diverge mainly in the **botanical identification** of ambiguous names, and in six cells
they contradict the Sanskrit outright.

| # | Nakṣatra | Sanskrit witnesses | Modern circulation | sids |
|---|---|---|---|---|
| 26 | Uttara Bhādrapadā | nimba / nimbā / ariṣṭa — **all three agree** | talipot palm, *Corypha umbraculifera*; tāla-druma | `RAJNI-3` `NARP-4` `ANAND-10` vs `WIKI-6` `NRR-2` |
| 13 | Hasta | ambaṣṭha-taru — **both Tier A agree** | *Spondias* / *Azadirachta* / *Jasminum* in one cell; āmrāta; *Sapindus mukorossi*; jātī in the 1896 variant | `RAJNI-2` `NARP-2` vs `WIKI-4` `NRR-1` `AW-2` `ANAND-7` |
| 18 | Jyeṣṭhā | śambara / saralā / mocā — **three witnesses, three plants** | silk cotton; *Aporosa* or two *Calamus*; lodhra; "Valaka" | `RAJNI-3` `NARP-3` `NAG-1` `ANAND-8` vs `CI-2` `AW-3` `WIKI-5` `BHAKTI-3` `NRR-4` |
| 6 | Ārdrā | kṛṣṇa / kṛṣṇā (main), aguru (1896 variant) | agarwood; red sanders; ebony — three mutually exclusive binomials in one Wikipedia cell | `RAJNI-2` `NARP-1` `ANAND-5` vs `WIKI-3` `SONI-4` `AW-1` `CI-4` `BHAKTI-4` |
| 17 | Anurādhā | kesara / kakubhā / nāgapuṣpa | *Mimusops elengi*; "Bakula, Nagkesa" printed together | `RAJNI-3` `NARP-3` `NAG-1` `ANAND-8` vs `AW-4` `CI-3` |
| 16 | Viśākhā | vikaṅkata — **both Tier A agree** | babbulī (1896 variant, glyph reading uncertain); śruva-vṛkṣa | `RAJNI-3` `NARP-3` `NAG-1` vs `ANAND-8` `NRR-3` |

**Jyeṣṭhā is the worst cell in the list and deserves its own paragraph**, because it is
contested three times over. Between the witnesses: śambara, saralā and mocā are three
different plants. *Inside the Rājanighaṇṭu itself*: that text glosses **śambara three
incompatible ways in three separate nānārtha verses** — as tāla at 23.33 (`RAJNI-9`),
among the lodhra synonyms at 5.208 (`RAJNI-10`), and among the arjuna synonyms at 9.116
(`RAJNI-11`). The arjuna reading would duplicate Svātī (15), which is a reason to prefer
one of the others — recorded as a reason, **not acted on**. And in modern circulation: at
least four further readings. Any table that prints one value here is choosing.

**Two internal ambiguities behave the same way and are worth noticing as a pattern.**
*vañjula* at Pūrva Āṣāḍhā is glossed by the same text as both vetasa/nicula (`RAJNI-12`)
and aśoka (`RAJNI-13`) — a reed and a tree. *kṛṣṇa* at Ārdrā is a bare colour-word that
the same text takes as kāśmīra-vṛkṣa (`RAJNI-14`). In each case the **derivative** sources
resolve the ambiguity and the Tier A witnesses do not: the 1896 variant list reads *vetra*
at 20 and a supplier reads *jala-vetra* (`ANAND-9`, `BHAKTI-3`); the same variant list
reads *aguru* at 6 and the practitioner tradition carries it forward as *kṛṣṇāguru*
(`ANAND-5`, `BHAKTI-4`, `CI-4`).

**So the modern agarwood reading for Ārdrā does not descend from the main verse at all.**
It descends from a variant list an 1896 editor printed in a footnote, introduced as
`ग्रन्थान्तरे नक्षत्रवृक्षनामानि` — "the names of the nakṣatra trees in another book"
(`ANAND-4`), a book he does not name. That is the single most useful transmission fact in
this dossier, and it is a fact about a footnote.

**Provenance of the modern tables is worse than "uncited" — it is unestablished.** The
most-mirrored one cites no Sanskrit text anywhere on the page, and its only substantive
reference is a 2012 newspaper article (`WIKI-8`) that returned HTTP 403. Three further
modern sources most likely to carry a citation were also unreachable behind 403,
including the one paper claiming Purāṇic roots and the one asserting roots in the "Atharva
Veda, Brihat Samhita, and Kalpa Sūtras" — an assertion I therefore **did not use**. The
one peer-reviewed paper that was retrieved names modern authors only and no Sanskrit locus
for its nakṣatra table (`SONI-7`, title at `SONI-1`).

---

## 5 · Varāhamihira does not have this list

This is the round's cleanest confirmed gap, and it matters because the Bṛhat Saṃhitā is
the text modern claims of antiquity reach for.

Chapters 15 (`BS-1`) and 97 (`BS-6`) were read in full and ch. 55 checked. Trees appear in
ch. 15 only as **classes**: Viśākhā gets red-flowered and red-fruited trees alongside
sesame and mung (`BS-2`), which Iyer 1884 (`IYER-1`) renders as growing trees yielding red
flowers and red fruits and dealing in seeds and pulses (`IYER-2`); Puṣya gets grains and
cane groves listed among occupations and commodities (`BS-3`); Mūla gets drugs and
physicians, and dealers in flowers, roots, fruits and seeds (`BS-4`, `IYER-3`). In ch. 97
tree **planting** is prescribed under the dhruva nakṣatras *collectively* (`BS-5`) — the
three uttaras and Rohiṇī together — which is a nakṣatra/tree connection of an entirely
different kind and is very likely the seed of the modern misattribution.

The fetcher also recorded declining to use a machine-generated encyclopedia page that
asserts the Bṛhat Saṃhitā connection, precisely because the full read contradicts it. That
decision is persisted in `ledgerSources[]` rather than dropped, so nobody re-finds the page
and assumes it was simply missed.

Agni Purāṇa: zero hits, whole file (`AGNI-1`, `AGNI-2`). Matsya Purāṇa: zero hits, but the
e-text covers only adhyāyas 1–176 (`MATSYA-1`, `MATSYA-2`), so that one is graded
*probably*-absent, not confirmed.

---

## 6 · What I would not write down

Five refusals, each of which would have produced a tidier dossier.

**(1) No binomial column.** Nineteen of twenty-seven cells have **no** botanical
identification from any source in this ledger, and the eight that do are all Tier B or
Tier C. **Not one Tier A source identifies a single plant by binomial** (gap 6). A
binomial column would be 70% fabrication, so the JSON leaves those cells empty and
`publicationConstraints` forbids a renderer from filling them. Where a binomial *is*
given, the tier travels **inside the field**, not in a note beside it, so that field and
prose cannot disagree (protocol C4).

**(2) No silent synonym equations.** Where two witnesses give different Sanskrit names at
the same position, I equate them **only** where a nānārtha verse in the ledger says so.
That happens at exactly three positions: Aśvinī (viṣadruma = kāraskara, `RAJNI-8`),
Kṛttikā (hemadugdha = udumbara, `RAJNI-7`) and Maghā (nyagrodha = rohiṇa, `RAJNI-14`, which
rescues the Nārada Purāṇa's otherwise stray *rohiṇā* and reconciles it with *vaṭa*). At
Bharaṇī (dhātrī / āmalā), Puṣya (aśvattha / pippala), Punarvasu (vaṃśa / veṇu), Mūla (sarja
/ rāla), Śatabhiṣā (kadamba / halipriyā), Uttara Bhādrapadā (nimba / ariṣṭa) and Revatī
(madhuka / mohavṛkṣa) the equations are conventional and probably correct and **are not
made**. Making them without a sid is exactly the invented-attribution failure this protocol
exists to stop. A reader who wants them made needs a nighaṇṭu the fetcher did not reach —
which is precisely the Bhāvaprakāśa gap below.

**(3) No back-transliterated Devanagari.** The `devanagari` field is populated only where a
ledger snippet carries the actual glyphs — the main verse for positions 1–13 (`ANAND-3`),
the 1896 variant list for most positions, the Nag page images for parts of the Nārada text.
It is **empty for the main verse at positions 14–27**, because the Ānandāśrama snippets
stop at v. 34.

**(4) No fetcher gloss promoted to evidence.** The claim that *śruva-vṛkṣa* is a synonym of
*vikaṅkata* appears in the ledger only inside a **locus annotation** on `NRR-3` — written by
the fetcher, not stated by any source. It is reported as the fetcher's gloss and not used
as an identification. Worth flagging as a class: a fetcher's `locus` field is apparatus, not
testimony, and a compiler that mines it for facts has quietly re-merged the two roles the
split exists to keep apart.

**(5) No efficacy, in either direction.** The Rājanighaṇṭu calls these trees *āyuṣya-da* and
ties that to nurturing and protecting them (`RAJNI-1`), and 2.45 asserts that a mortal who,
blind with pride, makes medicines from the tree of his **own** birth-star loses longevity,
prosperity, wife and son (`RAJNI-5`). Both are recorded as **statements the text makes**.
The site asserts no outcome of any kind, and carries no quantity and no preparation
(FRAMING §1.1, §1.5, §5 C-1, §11.2.3).

---

## 7 · Safety flags, and the honest state of the evidence behind them

**Aśvinī is toxic and the sources say so themselves.** The Sanskrit names are poison-names
— *viṣa-dru* "poison-tree", with *kālakūṭaka* in the same synonym verse (`RAJNI-8`) — and
the modern identification is *Strychnos nux-vomica* (`SONI-2`, `WIKI-2`). StatPearls
(`STRY-1`, `STRY-2`) gives the mechanism; Soni et al. flag lethality **in their own table
row** (`SONI-3`). No quantity, preparation or process parameter is carried, and none may be
added.

**Ārdrā is protected on either modern reading, and the evidence is unevenly verified.**
Agarwood: all agarwood-producing taxa are in CITES Appendix II, *Aquilaria malaccensis*
listed 1994 and the rest of the genus subsequently (`CITES-2`, heading `CITES-1`), under
annotation #14 agreed at CoP16 Bangkok 2013 (`CITES-3`), and the analysis notes wood chips
traded for burning as incense wood (`CITES-4`) — directly relevant to any homa or dhūpa
use. Red sanders: "endemic to India and considered worldwide endangered", again a flag the
source itself raises (`SONI-5`).

> **The caveat has to travel with the flag.** `cites.org` returned HTTP 403 on every route
> the fetcher tried — the appendices page, the PDFs, and the JavaScript checklist app. So
> agarwood's Appendix-II status here rests on an **IUCN/TRAFFIC CoP17 analysis, not the
> official appendices**, and the listings for *Pterocarpus santalinus* and *Santalum album*
> were **never independently verified at all**. Any downstream page carrying the flag must
> carry that sentence too.

No other position in the list has a toxicity or protection assessment anywhere in this
ledger, and none is asserted. That includes *arka* at Śravaṇa, where a flag would be easy
to guess and would be guessing.

---

## 8 · Text-critical state, briefly

Printed confirmation from page images exists for Nārada Purāṇa v. 144 (`NAG-2`) and v. 146
(`NAG-1`) — the latter confirming **ककुभा** against the AITM English, which prints
"Vakula" at that item (`AITM-2`), a reading its own base text does not carry. For **v. 145
there is no image read**: the ledger holds only an archive.org OCR line, visibly corrupt
(रोरिणा for रोहिणा) and covering only the first half of the verse (`NAG-3`). **Nakṣatras
12–15 of the Nārada list are therefore unconfirmed against print here**, which is exactly
where the e-text's odd *pakṣakā* sits (`NARP-2`) — and the GRETIL file's own header warns
that after many corrections the text still needs proof-reading (`NARP-9`; input provenance
at `NARP-8`).

The Rājanighaṇṭu side is in better shape: GRETIL rests on Calcutta 1933 (`RAJNI-15`) and
the 1896 Ānandāśrama printing was read from page images independently, giving a second
printed witness for the opening verse (`ANAND-2`), the first tree verse (`ANAND-3`) and the
source-naming verse (`ANAND-11`). **Note the verse numbering differs between editions** —
GRETIL 2.41–2.46 = Ānandāśrama vv. 33–38 — so any citation must say which edition it means.

---

## 9 · The gaps, ranked by how much a follow-up round would gain

Twelve are recorded in the JSON with `searchedWhere` / `searchTermsUsed` / `whatWasFound` /
`confidence`. Four are worth naming here.

1. **Bhāvaprakāśa-nighaṇṭu (16th c.) — could not be checked.** The GRETIL file is ~75 KB
   and its own header says "three chapters; to be continued". This is the single most
   valuable gap to close: it would establish whether the doctrine had a transmission life
   inside the nighaṇṭu genre or effectively stops with Narahari. **Open gap, not a negative
   result.**
2. **The Vedic Saṃhitā / Brāhmaṇa layer — not searched, and I will not claim absence.** The
   fetcher checked the Atharvaveda-*Pariśiṣṭas*, which are appendices, and one blog
   reproducing the Nakṣatrakalpa mantras (`MANASA-1`, `MANASA-2` — 28 numbered mantras, no
   trees). No Saṃhitā, Brāhmaṇa, Āraṇyaka or Sūtra text was searched at all. Modern sources
   assert an Atharvavedic root; this ledger neither supports nor refutes it. Recorded as
   `could-not-determine` **specifically so a later round does not mistake this dossier's
   silence for a confirmed absence** — the failure mode that hit three of six dossiers in
   round 1.
3. **Bṛhat-Suśruta and "Nārāyaṇī" — untraced.** Two of the three authorities Narahari
   names. Nothing found in any catalogue or e-text.
4. **The 1896 footnote readings for Bharaṇī (2) and Pūrva Phalgunī (11)** were not captured
   by the fetcher, though the surrounding positions were. Small, and closeable by re-reading
   one leaf image.

Also confirmed absent: any 28-fold (Abhijit-inclusive) tree list. Every located list is 27,
and the Rājanighaṇṭu says so in its own words (`RAJNI-4`), the Motilal footnote counts
twenty-seven for the Nārada passage (`AITM-1`), and the 1896 footnote is numbered 1–27
(`ANAND-4` … `ANAND-10`).

---

## 10 · What this means for the site's empty Vedic cell

The cell can now be filled — **narrowly, and not as a table.**

- **27 rows of Sanskrit name + verse locus, Tier A.** Two witnesses per row, cited to
  chapter and verse, in a public-domain text, from an edition that is named. That clears
  FRAMING §11.3's requirement of a named text at a named locus.
- **8 rows of botanical identification, Tier B or C, tier stated in the field.** Nineteen
  blanks that stay blank and say why.
- **A `variants` column that is the point, not an apology.** Six cells where the modern
  circulation contradicts every Sanskrit witness located. The divergence is the finding.
- **No merging with samidha or dhūpa, and no "Vedic plants" label.** Three categories,
  three textual homes, one documented commercial merge (`BHAKTI-1`) and one genuine textual
  bridge in an abhicāra chapter that is described and never quoted (`NARP-5`–`NARP-7`).
- **Two safety flags, both with their evidentiary caveats attached** — and, per §5 C-1, at
  most two of {substance · quantity · process parameter}. Only substance is carried here.
  The other two fields have nowhere to sit, which is the design, not an omission.

The asymmetry carried forward from the horae round applies here too: **the shape of the
table is itself a finding.** A Vedic column that shows twenty-seven confident Sanskrit
names beside nineteen honestly empty botanical cells tells the reader something true about
this material that a filled table would conceal.
