# R33 — The blind re-audit of the ritual/magic corpus

**Date:** 2026-07-30 · **Sample:** 37 claims · **Method:** independent re-derivation from outside the site's own curation gate.

---

## 0. What this is, and what it is not

The site has catalogued ritual and magic claims across several wings. This slice re-derived a sample of
them from sources **outside** the curation gate that authored them, because a system must never be scored
against labels its own gate wrote.

**Discipline actually followed.** The repository was opened only to *extract the claims*. No repo record,
no repo research file, no `r3xdata/` JSON and no in-data `cite` string was treated as evidence for
anything. Where a verdict cites a work the site also cites, I reached that work independently — publisher
metadata, the archive scan, the journal record, the public-domain full text — and quoted what I found
there, not what the site said was there. `scratchpad/opgraph/` (the other research slices) was not opened
at any point; their provenance is exactly what this slice exists to be independent of.

**There is no efficacy axis here.** Nothing in the JSON or in these notes ranks, scores or implies how
well any rite works as magic. Three rows record *effects*, and all three are documented
physiological/toxicological findings from peer-reviewed literature (`rasa-cinnabar`, `rasa-saper`,
`rasa-mmwr`). Each carries its limits. Where the answer is "no study exists," that is written down as the
answer, not left as an empty cell — see §5.

---

## 1. Headline

| Verdict | n | share |
|---|---|---|
| CONFIRMED | 31 | 83.8% |
| CONTESTED | 2 | 5.4% |
| REFUTED | 2 | 5.4% |
| UNVERIFIABLE | 2 | 5.4% |

**Accuracy estimate: 83.8% of sampled claims independently confirmed** (95% Wilson CI **68.9%–92.4%**).
Excluding the two I could not check at all: **88.6%** (95% Wilson CI **74.1%–95.5%**).

**The interval is honest about sampling error and dishonest about nothing else, so read the warning
attached to it.** The sample is purposive, not random. I selected toward (a) load-bearing, (b)
cross-cultural, (c) sensitive — and in a corpus like this one those are disproportionately the claims that
already received the most curatorial attention: the ones carrying `contested` blocks, `CORRECTION:` notes
and edition-resolution essays. That biases the estimate **upward**. A random draw across all 155 confluence
edges, all 36 decan faces, all 28 mansions and all 35 mudrā records would very likely land lower, because
most of those records have never been argued about by anyone.

**So: I would not round 83.8% up to "about 90%." I would report the corpus as roughly 80–85% claim-level
accurate, with one important stratification (§3).**

---

## 2. The two refutations

### 2.1 `rasa-mmwr` — a lead figure halved

FRAMING §C-1 makes it *mandatory* that the toxic-materia harm note state: "CDC *MMWR* 61(33) (2012), six
lead-poisoning cases in pregnant women in New York City, **one product at 1.2% lead by weight**."

Everything in that sentence checks out except the number. MMWR 2012;61(33):641–646 reports six cases in
foreign-born pregnant women in NYC, blood lead 16–64 µg/dL, across ten oral Ayurvedic medications made in
India — and states that **"lead concentrations of the medications were as high as 2.4%"**, with several
also containing mercury or arsenic.

The site's stated maximum understates the published maximum by a factor of two. It is possible 1.2% is one
individual product's assay from the article body; even so, the site presents it as the severity figure, and
the severity figure is 2.4%. On this round's own hard line — *record documented toxicological findings as
plainly as anything else* — halving a lead concentration is the precise failure the line exists to catch.
**Fix: `2.4%`.**

### 2.2 `pic-saturn-opium` — the substance that is also the shipping blocker

`planetary-magic.js` gives Saturn `suffumigation: 'opium, etc.'`, cited to `Picatrix III.7`.

The Picatrix's own suffumigation list reads: *"The suffumigation of Saturn is all things that smell bad,
asafoetida, gum arabic, bdellium, hemlock and similar things"* — Jupiter amber and lignum aloes, Mars
pepper and ginger, the Sun nutmeg and amber, Venus rose and violets, Mercury mixed odours, the Moon camphor
and lilies. Opium is genuinely present in the Picatrix corpus; the accessible scholarship attaches it to an
invocation of **the Sun**, not Saturn.

Note that Jupiter (`storax, frankincense`) and the Moon (`28-component lunar`) in the same module also fail
to match that list, which suggests the module is drawing on the Book IV compound recipes while citing III.7.
I could not verify a Book IV.6 Saturn compound containing opium from open sources, so I have left that door
open rather than closed it. **What is certain is that the cite string as shipped is not supported by the
locus it names.**

This is worth two sentences of emphasis because of where the value goes. FRAMING §3.1 already names
`talisman.js` a shipping blocker partly *because* it emits `"Prepare the materials: suffumigation of opium,
etc."` into a generated, personalised, imperative protocol. So the site is currently propagating a
controlled substance into its most policy-exposed artefact **on an attribution that does not hold**. Fixing
the data fixes part of the blocker for free.

---

## 3. The stratification that matters more than the headline number

Split the sample by claim type and the corpus is not uniformly accurate:

| Class | n | confirmed | notes |
|---|---|---|---|
| Latin/Greek-tradition quotation & attribution (Agrippa, Picatrix editions) | 4 | 3 | mansion images and decan faces are **verbatim-exact**; the one failure is the Saturn substance |
| Bibliographic / dating / edition claims | 9 | 9 | uniformly excellent — Wujastyk, Türstig, Pines–Gelblum, Pingree, Hayashi, Alfonso X, MMU 1588, AV date, GS date |
| Transmission edges (cross-cultural dependency) | 6 | 5 | direction and evidence generally well grounded; one row's `kind` contradicts its own body |
| Toxicology / present-day harm figures | 5 | 4 | one number halved; window drift on another |
| **Sanskrit verse loci** | **5** | **3** | **the weak stratum — see below** |

### 3.1 The Gheraṇḍa Saṁhitā loci after 3.32

This is the largest single exposure I found and it is worth stating carefully, because it is not a simple
error.

`practices/mudras.js` ships per-record loci for all 25 Gheraṇḍa mudrās, and `PRACTICES_META.editionResolution.numberingMapping`
states that the ranges "were pinned against Vasu's own English … and **independently cross-checked against
the Sanskrit verse numbering at siva.sh/gherand-samhita/3**."

I went to that Sanskrit witness. It agrees with the site on:

- the 3.1–3 name-list, exactly — v.1 eight names through khecarī, v.2 viparītakaraṇī through the
  pañca-dhāraṇā, v.3 aśvinī through bhujaṅginī;
- mahāvedha at 3.21–24, exactly;
- khecarī beginning at 3.25 — `jihvādho nāḍīṃ sañchinnāṃ rasanāṃ cālayet sadā …` — exactly.

And then it stops agreeing. The same witness places **viparītakaraṇī at 3.46–48** (`…viparītakarī mudrā
sarvatantreṣu gopitā ||3-46||`; `bhūmau śiraś ca saṃsthāpya karayugmaṃ samāhitaḥ ||3-47||`) and **yoni
mudrā from 3.49**. The site has viparītakaraṇī at 3.33–36 and yoni at 3.37–44. That is a **~13-verse
divergence**, and it propagates through every Gheraṇḍa record after khecarī.

A third widely-circulated recension is different again: khecarī 3.21–28, vajrolī 3.39, māṇḍukī 3.45,
pāśinī 3.48, mātaṅginī 3.50, bhujaṅginī 3.51, dhāraṇās 3.59–63. Wikipedia independently cites the Gheraṇḍa
vajrolī at **3.39**, where the site has vajroṇī at **3.45–48**.

**What I am and am not saying.** The site's loci may be perfectly correct *for Vasu's 1895 English*, which
is what it cites, and I could not reach a page-image of that edition to settle it. What I *can* say is:

1. The cross-check the module advertises demonstrably covers only the name-list and the khecarī start. The
   sentence as written invites a reader to believe the whole range set was corroborated. It was not.
2. Nothing in the shipped data warns that other editions renumber Gheraṇḍa ch. 3 by up to thirteen verses.
   A reader who follows a locus into Mallinson's Gheraṇḍa Saṁhitā will land in the wrong place, silently.
3. The module's `residualRisk` field discloses a *different, smaller* risk (OCR of the 1895 Devanāgarī),
   which has the effect of looking like full disclosure while the larger risk goes unmentioned.

The honest fix is a `numberingCaveat` in `PRACTICES_META` naming at least two rival numberings, plus
narrowing the `numberingMapping` prose to what the cross-check actually established.

Everything about the **content** of those records survives: khecarī really does instruct cutting the
frenulum, rubbing with fresh butter and drawing the tongue with an iron instrument; vajroṇī really is an
inverted arm-balance and really is a different practice from the HYP's vajrolī. It is the *pointers*, not
the *contents*, that drifted.

### 3.2 By contrast: the Haṭhayogapradīpikā loci are fine

Eight of eleven HYP ranges match an independent verse index exactly; three end-boundaries differ by one
verse. That is ordinary section-boundary judgement. Whatever went wrong with Gheraṇḍa did not go wrong here.

---

## 4. Three things the site got *more* right than it claims, and one it got less

**Under-claimed (good).**

- `conf-wilkins` — the site says Wilkins 1785 was the first printed translation of a complete Sanskrit work
  directly into English. The record supports the stronger statement: first direct translation from Sanskrit
  into *any European language*.
- `abh-turstig` — the site flags Türstig's WZKS volume number as uncertain (⚑, "an OCR showed 24"). It is
  29. The flag can be retired. Over-hedging is the benign failure, but it is still a misdescription of the
  evidence.
- `rasa-ghost` — confirmed down to the library, the mechanism and both correct attributions. The single
  strongest record in the sample.

**Over-claimed (watch).**

- `abh-dirdeity` — the module states every row was "confirmed **verbatim** against two independent
  authoritative full-text sources." The *mapping* is right: an entirely independent tantric compendium
  reproduces all six act→deity→direction→season rows identically (Rati/NE, Vāṇī/N, Ramā/E, Jyeṣṭhā/SW,
  Durgā/NW, Kālī/SE). But that witness is a traditional compendium, not peer-reviewed work, and I could not
  reach Bühnemann's tables to check the word "verbatim." The claim is stronger than open sources can carry.
  The data is sound; the *verification claim about the data* is not independently checkable.
- `pic-mansion-images` — the module header asserts "Agrippa is translating the Picatrix here." That is a
  transmission claim, it has no `claimedBy`, and §2.4 forbids exactly that. Either attribute it to a named
  scholar or soften it to a parallel.
- `conf-physika-leiden` — the edge's `kind` is `influence` (a directed arrow) while its own `body` says
  "both draw on a common Greco-Egyptian recipe literature" and its own `note` concedes "the influence kind
  overstates." A directed edge whose annotation says the direction is wrong will mislead anyone who reads
  the graph rather than the footnote. §1.3 wants `direction: 'unknown'` or a symmetric kind.

---

## 5. Where "no study exists" is the answer

Recorded here because absence is a first-class value in this round and the site currently leaves it blank.

- **Rasaśāstra bhasma safety.** There is no human randomised or controlled clinical literature establishing
  the safety of classically prepared mercurial or metallic bhasmas. What exists is market-sample assay work
  (Saper 2004; the 2008 internet follow-up), poisoning case series (MMWR 2012; the Wisconsin 2015 series;
  the Durban outbreak), and animal toxicology (Liu 2008; Huang 2012). **The site should say this out loud.**
  A harm note listing four positive findings and no statement of what has *not* been studied reads as a
  complete evidence base when it is a case-report literature.
- **The 0.2% cinnabar absorption figure is rodent data.** It is exact and correctly quoted, but there is no
  human dosimetry behind it, and low absorption is not low hazard — Huang et al. (BioMed Research
  International, 2012) report neurotoxicological effects in offspring mice at *low* cinnabar dose. The
  "processing is the hazard vector, not the mineral" clause in FRAMING C-1 is a reasonable inference from
  the speciation literature; I found no paper stating it in those words. It is an interpretation and should
  be labelled one.
- **Mallinson's "only five of the many texts require the cut."** Unverifiable from open sources. Mallinson
  (2007) is in copyright and cite-only under the site's own §4.4, so neither the site nor I can quote it.
  The general shape is corroborated (cutting is dangerous; many practitioners deem it unnecessary; Mallinson
  met barely half a dozen khecarīs across long fieldwork). The *number* is not checkable. The site presents
  it without that caveat, and it is the site's stated deterrent argument, so the caveat matters.
- **Efficacy of anything in this corpus.** No study exists, and none is cited, and that is correct.

---

## 6. Two findings that are policy, not accuracy — flagged, not adjudicated

An auditor should not decide these; a maintainer should.

1. **`gs-matangini` vs FRAMING C-3 rule 2.** C-3 excludes "anything pairing breath technique with water,
   submersion or bathing — **excluded entirely**, in any voice, from any tradition, at any date." The
   shipped `gs-matangini` record describes, in site voice, standing in water up to the neck and drawing
   water in through the nostrils. It is textually accurate (independently confirmed). Either the record is
   out of policy or C-3 rule 2 is drawn wider than intended. Both cannot stand.

2. **`hyp-khecari`'s progression language vs C-2.** C-2 permits locus, attested sentence, structural
   description and harm note but forbids "graded regimen, recommended interval, session count, progression."
   The record says, in site voice, "over months, to cut the frenum … a little at a time" and "lengthens 'a
   hair's breadth' at a time." Those are increments and an interval. Note that the site is *already* being
   stricter than its source here — Vasu's own apparatus supplies a depth ("one-twelfth of an inch") and a
   duration ("about three years") and a caustic (rock-salt), none of which the site reproduces. So the
   instinct is right and the line is drawn slightly on the wrong side of its own rule.

---

## 7. One unrecorded transmission fact worth having

`hyp-khecari` attributes the snuhī-leaf blade and the *romamātra* ("a hair's breadth") increment to
Haṭhayogapradīpikā 3.34. That is correct. But the same couplet is **Khecarīvidyā 1.46–47**, cited to
Mallinson & Singleton, *Roots of Yoga* (2017) pp. 247–248. The HYP is here reproducing the Khecarīvidyā
verbatim.

That is a documented, scholar-attributed textual dependency between two named loci — precisely the kind of
edge the diffusion argument exists to display, already carrying a `claimedBy` in the literature, and it is
not in the data. It is the cheapest real addition available to the practices wing.

Relatedly: `hyp-vajroli`'s contested block records that the claim "Sinh left explicit portions untranslated
for moral reasons" is UNVERIFIED against the accessible text — which is the right call. The likely origin of
that rumour is now identifiable: **Vasu**, not Sinh, is independently reported to have omitted vajrolī as
"an obscene practice indulged in by low class Tantrists." Naming the probable source of a rumour is more
useful than recording that it could not be confirmed.

---

## 8. Ranked fix list

| # | Fix | Class | Cost |
|---|---|---|---|
| 1 | `1.2%` → `2.4%` lead by weight (FRAMING C-1 + any harm note repeating it) | REFUTED, toxicology | one token |
| 2 | Correct or re-cite `planetary-magic.js` Saturn suffumigation; III.7 gives asafoetida/gum arabic/bdellium/hemlock | REFUTED, substance + blocker | small |
| 3 | Add a `numberingCaveat` to `PRACTICES_META` naming ≥2 rival Gheraṇḍa numberings; narrow the `numberingMapping` prose to what was actually cross-checked | CONTESTED, 20+ records | medium |
| 4 | Add "no human clinical safety literature exists" + "rodent data" limits to the rasa harm note | absence-as-value | small |
| 5 | `physika-kai-mystika → leiden-stockholm` : `direction: 'unknown'` or symmetric kind | §1.3/§2.4 compliance | small |
| 6 | `claimedBy` (or soften) "Agrippa is translating the Picatrix here" | §2.4 compliance | small |
| 7 | NCRB window 2001–2018 → the window the cited data covers (2000–2016) | drift | one token |
| 8 | Retire the ⚑ on Türstig's volume number (29 is right) | over-hedge | one token |
| 9 | Caveat the Mallinson "only five texts" figure as not open-source checkable | absence-as-value | small |
| 10 | Record variant Latin forms for the Picatrix prayer-angels (Jupiter: Raucayehil / Raubeil) | CONTESTED | small |
| 11 | Add the HYP 3.34 ← Khecarīvidyā 1.46–47 dependency edge | addition | small |
| 12 | Resolve `gs-matangini` vs C-3 and `hyp-khecari` vs C-2 (maintainer call) | policy | maintainer |

---

## 9. Limits of this audit, stated plainly

- **n = 37 out of a corpus in the low thousands of claims.** The interval is wide and the sample is not
  random. Treat 83.8% as an order-of-magnitude reading, not a measurement.
- **Three of the site's most important sources are in copyright and I could not reach them**: Bühnemann's
  *Tantra in Practice* chapter, Mallinson's *Khecarīvidyā*, Martelli's *Four Books of Pseudo-Democritus*.
  Every claim resting solely on those is UNVERIFIABLE from open sources, not verified-by-default. That
  affects most of `abhichara-data.js`'s MMU material, which I could only corroborate through traditional
  compendia rather than the scholarship the site cites.
- **I could not obtain a page-image of Vasu 1895**, so the Gheraṇḍa locus finding is a documented
  divergence between witnesses, not a proof that the site is wrong.
- **I did not audit the astronomy, the dignities, the tarot, the I Ching, the Buddhist wing or the
  Kabbalah data** — out of slice.
- **The abhicāra correspondence tables (colours, mats, mudrās, rosaries, fingers, hand-rule) all trace
  through Ullrey's dissertation**, a single scholar's readings of texts with no critical editions. They may
  be entirely right; they are single-sourced, and the module says so. That is not a defect, but it means
  the wing's apparent density of citation overstates the independence of its evidence base.
- **Every WebFetch summary passes through a small model.** Two early fetches in this audit returned
  internally inconsistent verse data and were discarded; the Gheraṇḍa finding rests on four separate
  page-range fetches that agree with each other, plus two independent third-party witnesses. Where I had
  only one fetch, I graded UNVERIFIABLE rather than CONFIRMED.

---

## 10. The one-paragraph verdict

The ritual and magic corpus is **substantially accurate and unusually well-cited by the standards of what
it is** — a tertiary compilation. Its bibliographic and dating layer is essentially clean (9/9). Its
Latin-tradition quotation is verbatim-exact where I could check it against the primary edition. Its
transmission edges mostly assert documented dependency rather than resemblance, and where they do not, the
site has usually said so itself. The failures are not sloppiness; they are the two failure modes this kind
of project actually has: **a number copied down wrong on the one axis where wrong numbers matter most
(lead), and a pointer set that drifted away from the numbering it claims to have been checked against
(Gheraṇḍa ch. 3 after v.32).** Neither is fatal. Both are cheap to fix. Neither should be described as
"minor" — one is a halved toxicology figure and the other silently misdirects twenty-plus citations — and
the corpus should be reported at **roughly 80–85%**, not rounded up.
