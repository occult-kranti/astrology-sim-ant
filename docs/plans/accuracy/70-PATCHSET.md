# 70 — PATCHSET: the consolidated correction set from the four Fable re-verifications

**Date:** 2026-07-30 · **Consolidator:** Opus (patch consolidator) · **Status:** INSTRUCTIONS ONLY — nothing
in the repo was edited (another build is in flight). Every CURRENT string below was re-read from the working
tree at commit `cc89bde` and is byte-exact as of that commit.

**Inputs:** `60-cdc-lead.md`, `61-picatrix-saturn.md`, `62-gheranda-loci.md`, `63-citation-queue.md` (same
directory).

**Anchor verification: 18/18 PASS.** Every CURRENT string in this document was machine-checked to occur
**exactly once** in its target file. Re-run it before applying, in case the in-flight build has moved
something (this machine has no system Node — use the conda env, per `verify-gate-env`):

```
& "C:\Users\mehta\.conda\envs\astro-workbench\node.exe" <scratchpad>\repin\verify-anchors.mjs
```

It prints one line per anchor and `all anchors verbatim + unique` on success. The checker is EOL-agnostic;
**the patches are not** — see §0.0.

---

## 0.0 ⚠ LINE ENDINGS — read before any scripted replace

The files in this patchset are **mixed EOL**, and every multi-line anchor below is written with `\n`:

| EOL | Files |
|---|---|
| **CRLF** | `docs/FRAMING.md` · `research/SOURCE-DATA.md` · `assets/js/core/data/planetary-magic.js` · `assets/js/core/data/practices/mudras.js` |
| **LF** | `docs/plans/opgraph/RANKING-SPEC.md` · `pages/rasa.html` · `assets/js/core/data/rasa-data.js` · `scratchpad/rank/30-scholarly-census.json` |

**Every multi-line anchor in Groups A, B and C targets a CRLF file.** A naïve `\n`-joined search will match
**zero** times (this was verified — all four multi-line anchors failed with `\n` and succeeded with `\r\n`).

- Editing by hand or with an editor-aware tool: no action needed.
- Scripted replace: substitute `\r\n` for every `\n` inside the anchor, **and** emit `\r\n` in the
  replacement, or the patched file will end up with mixed endings and a noisy diff.
- Single-line anchors are unaffected.

---

## 0. Verdict classes used

| Class | Meaning | Rule applied |
|---|---|---|
| **factual-error-fixed** | Sources agree; the repo is simply wrong. Replace outright. | Correct silently-wrong value; record the correction in a `sourceNote` so it cannot be re-introduced as "a variant". |
| **edition-divergence-flagged** | Sources genuinely disagree. | **ADD BOTH POSITIONS** with a `sourceNote`. Never pick one silently. Dominant reading goes in the value; the minority reading goes in the note with its witness named. |
| **unverifiable-must-be-marked** | Could not be retrieved this pass. | Leave flagged, name the access failure, and forbid surfacing until resolved. Access failure ≠ disagreement. |

**Global rule for this patchset:** every corrected value ships *with* its citation in the same commit. A
value without its `source` string is not landed; a citation without the value it licenses is not landed.
The engine-test assertions in §5 exist precisely to make that coupling mechanical.

**Scope note:** 4 of the 20 patches touch files that live in the session scratchpad, not the repo
(`scratchpad/rank/30-scholarly-census.json`). They are marked **[scratchpad]** and are prerequisites for the
ranking round, not for the site build.

---

## 1. GROUP A — CDC *MMWR* 61(33) (2012): the lead figure is halved

**Headline:** the repo states **1.2% lead by weight**. The published maximum is **"as high as 2.4%"** —
exactly double. Four independent witnesses (PubMed PMID 22914225, Europe PMC REST, AP wire 2012-08-22,
Medscape/NC-DPH secondaries) carry the identical sentence. **Zero sources disagree.** This is
`factual-error-fixed`, not a divergence — nothing here gets a contested flag.

Good news: the bad figure has **not shipped**. `grep` over `assets/` returns no `MMWR`, no `61(33)`, no
`1.2%`; `pages/rasa.html` carries no MMWR sentence. It lives only in `docs/FRAMING.md`, twice — once as the
**mandate** and once as the **HTML block queued for pasting into `pages/rasa.html`**. Fixing FRAMING before
§9.7 is applied is what stops it ever reaching a page.

---

### P1 — `docs/FRAMING.md` §C-1 "The operable triple (toxic materia)", lines 529–532

**Verdict class:** `factual-error-fixed`

> **⚠ Line 532 does not end at the sentence.** It continues
> `… And the correction the site currently gets wrong: cinnabar (HgS) is`. So this is a **substring**
> replace spanning line 531 and the first sentence of line 532 — **not** a whole-line replace of 529–532.

**CURRENT (exact substring — line 531 + the opening of line 532; occurs once in the file):**

```
in New York City, one product at 1.2% lead by weight; a bhasma assaying 19,400 mg/kg lead and 1,430 mg/kg
arsenic (*J Occup Med Toxicol* 8:26).
```

**REPLACEMENT (exact):**

```
in New York City (blood lead 16–64 µg/dL) traced to ten oral Ayurvedic medications with lead concentrations
as high as 2.4%, several of which also contained mercury or arsenic; a bhasma assaying 19,400 mg/kg lead and
1,430 mg/kg arsenic (*J Occup Med Toxicol* 8:26).
```

**Resulting paragraph (for review — lines 529–533 after the patch):**

```
**Harm note must state:** heavy-metal toxicity is documented and current — Saper et al., *JAMA* 292:23 (2004)
and the 2008 internet-products follow-up; CDC *MMWR* 61(33) (2012), six lead-poisoning cases in pregnant women
in New York City (blood lead 16–64 µg/dL) traced to ten oral Ayurvedic medications with lead concentrations
as high as 2.4%, several of which also contained mercury or arsenic; a bhasma assaying 19,400 mg/kg lead and
1,430 mg/kg arsenic (*J Occup Med Toxicol* 8:26). And the correction the site currently gets wrong: cinnabar …
```

**Minimal-diff fallback** (if the maintainer wants a one-clause change rather than the widened sentence —
the correction is preserved either way, the enrichment is not):

```
one product at 1.2% lead by weight   →   lead concentrations as high as 2.4% by weight
```

**Unique find-anchor** (safe for a scripted replace — this substring occurs once in the file):
`in New York City, one product at 1.2% lead by weight;`

**Citation to attach** (in the mandate's own prose, or as a footnote in §C-1):

> CDC (New York City DOHMH), "Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India —
> New York City, 2011–2012", *MMWR Morb Mortal Wkly Rep* 61(33), 24 Aug 2012, 641–646; PMID 22914225.

---

### P2 — `docs/FRAMING.md` §9.7, the `pages/rasa.html` callout block, lines 1215–1218

**Verdict class:** `factual-error-fixed`

**CURRENT (exact — note the 4-space indent, it is inside a fenced HTML block):**

```
    products carry the harm forward: <i>JAMA</i> 292:23 (2004) found detectable lead, mercury or arsenic in
    20% of Ayurvedic products sampled, with rasa-śāstra products far worse; CDC <i>MMWR</i> 61(33) (2012)
    reports six lead-poisoning cases in pregnant women in New York City, one product measuring 1.2% lead by
    weight. Everything here is the <b>historical</b>
```

**REPLACEMENT (exact):**

```
    products carry the harm forward: <i>JAMA</i> 292:23 (2004) found detectable lead, mercury or arsenic in
    20% of Ayurvedic products sampled, with rasa-śāstra products far worse; CDC <i>MMWR</i> 61(33) (2012)
    reports six lead-poisoning cases in pregnant women in New York City — blood lead 16–64 µg/dL, from ten
    oral Ayurvedic medications whose lead ran <b>as high as 2.4%</b> by weight, several of which also
    contained mercury or arsenic. Everything here is the <b>historical</b>
```

**Unique find-anchor:** `in New York City, one product measuring 1.2% lead by`

**Ordering constraint:** P2 **must land before** §9.7 is applied to `pages/rasa.html`. If §9.7 has already
been applied by the in-flight build, apply the same replacement a second time against `pages/rasa.html` and
re-run the browser sweep.

---

### P3 — `assets/js/core/data/rasa-data.js` — pre-emptive encoding contract (apply only *if/when* the harm note moves into data)

**Verdict class:** `factual-error-fixed` (prophylactic — the record does not exist yet)

**CURRENT:** `RASA_TOXICITY` (lines 36–41) is a single site-voice string with **no `source` and no
`sourceNote` fields at all**. It contains no MMWR sentence.

**REPLACEMENT — do not put the figure in the site-voice string.** If the MMWR material is encoded, it goes
into a structured record whose *quoted* fields carry the numbers:

```js
source: 'CDC (New York City DOHMH), "Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India — New York City, 2011–2012", MMWR Morb Mortal Wkly Rep 61(33), 24 Aug 2012, 641–646; PMID 22914225.',
sourceNote: 'Article, verbatim: "Lead concentrations of the medications were as high as 2.4%; several medications also contained mercury or arsenic, which also can have adverse health effects." Six cases, all foreign-born pregnant women, ten oral Ayurvedic medications made in India, blood lead 16–64 µg/dL. CORRECTION 2026-07-30: this site previously stated "one product at 1.2% lead by weight" — half the published maximum, unsupported by any source; no variant reading exists, so nothing is flagged contested. cdc.gov returns HTTP 403 to automated fetch; text verified against PubMed (PMID 22914225), Europe PMC REST and the 2012 AP wire report.',
```

**§C-1 lint interaction — read this before encoding.** FRAMING §C-1 (lines 526–528) makes the presence of
`g|mg|kg|ml|°C|°F|minutes|hours` in a **harm-flagged record's site-voice fields** a hard failure. The
citation above legitimately contains `µg/dL`. The carve-out is that `source` and `sourceNote` are
**quotation containers, not site voice**. Whoever implements that lint must scope it to site-voice fields
only, or this correct citation will hard-fail the gate. Assertion **T4** in §5 pins that scoping.

---

## 2. GROUP B — Picatrix, Saturn's suffumigation: wrong value *and* wrong locus

**Headline:** the re-audit was substantively right and locus-wrong. Both accessible editions put the plain
planetary correspondence at **Book III chapter 3**, not III.7:

- Greer & Warnock, III.3: *"The suffumigation of Saturn is all things that smell bad, asafoetida, **gum
  arabic**, bdellium, hemlock and similar things."*
- Attrell & Porreca, 3.3 §11: *"The suffumigation of Saturn comprises all foul-smelling things, like
  asafoetida, **gum**, bdellium, hemlock, and the like."*

And **opium is not a phantom**: it is genuinely the first ingredient of the III.7 Saturn-conjuration
confection (A&P 3.7.16). The module's defect is that it pasted a *ritual confection's* lead ingredient into
the *generic correspondence* slot, and cited a chapter that is right for the confection and wrong for the
correspondence. Both facts must survive into the note — deleting "opium" without explaining where it came
from invites a future round to "restore" it.

`docs/plans/opgraph/RANKING-SPEC.md` line 711 (untracked) contains a partly-wrong diagnosis of this same
defect — it says opium "attaches, in accessible scholarship, to a **solar** invocation". That is incorrect;
P9 fixes it.

---

### P4 — `assets/js/core/data/planetary-magic.js`, Saturn record, lines 37–46

**Verdict class:** `factual-error-fixed` (the value) **+ `edition-divergence-flagged`** (gum arabic vs gum —
BOTH readings encoded, neither picked silently)

**CURRENT (exact block):**

```js
  Saturn: {
    governs: 'binding, long-term, secret knowledge, endings',
    suffumigation: 'opium, etc.',
    colour: 'black',
    metal: 'lead',
    stone: 'onyx/turquoise',
    picatrixPrayerAngel: 'Heylil',
    agrippa: { angel: 'Zaphkiel', intelligence: 'Agiel', spirit: 'Zazel' },
    source: SOURCE
  },
```

**REPLACEMENT (exact block):**

```js
  Saturn: {
    governs: 'binding, long-term, secret knowledge, endings',
    suffumigation: 'foul-smelling things: asafoetida, gum arabic, bdellium, hemlock',
    colour: 'black',
    metal: 'lead',
    stone: 'onyx/turquoise',
    picatrixPrayerAngel: 'Heylil',
    agrippa: { angel: 'Zaphkiel', intelligence: 'Agiel', spirit: 'Zazel' },
    source: 'Picatrix III.3 (Greer & Warnock, The Complete Picatrix, Liber Atratus ed.; Attrell & Porreca 2019, 3.3 §11); Agrippa, Three Books II',
    sourceNote:
      'Editions diverge on one ingredient and BOTH readings are recorded: "gum arabic" (Greer–Warnock) / '
      + '"gum" (Attrell–Porreca); otherwise the two agree word for word. This III.3 correspondence is DISTINCT '
      + 'from the Picatrix III.7 Saturn-conjuration confection (Attrell–Porreca 3.7.16), which does begin with '
      + 'opium (opium, actarag/storax, saffron, laurel seed, caraway/carob, wormwood, lanolin, colocynth, the '
      + 'head of a black cat, black-goat urine) — that confection is where this module\'s former value '
      + '"opium, etc." came from — and distinct again from a third compound recipe at IV.6 (mandrake, olive '
      + 'leaves, black myrobalan, black pepper, dried crow/crane brains, pig/ape blood; no opium). Edition '
      + 'divergences inside the III.7 confection ("actarag" G–W vs "storax" A–P; "caraway" G–W vs "carob" A–P) '
      + 'are recorded, not adjudicated. WARNING: hemlock (Conium maculatum) is severely poisonous, including '
      + 'by inhalation of its smoke; the III.7 confection additionally names opium and colocynth. Described, '
      + 'never recommended. CORRECTION 2026-07-30: value and locus both fixed.',
    hazard: 'hemlock'
  },
```

**Unique find-anchor:** `    suffumigation: 'opium, etc.',`

**Note on `source`:** the module-level `SOURCE` constant (line 34) is
`'Picatrix III.7; Agrippa, Three Books II (see research/SOURCE-DATA.md §4)'`. Saturn must now carry its own
per-record string because its correspondence is III.3. See P6 — the other six planets are suspected of the
same mixed-loci problem and are **not** patched here.

**Optional `hazard` field:** included above so assertion **T9** can mechanically check "corrected ingredient
list ⇒ hazard marker". If the maintainer prefers not to add a new field, drop it and weaken T9 to a
`sourceNote`-substring check.

---

### P5 — `assets/js/core/data/planetary-magic.js`, header safety comment, lines 10–13

**Verdict class:** `factual-error-fixed` (the exemplar no longer matches the data)

**CURRENT (exact):**

```js
//  SAFETY/FRAMING (non-negotiable): some historical recipes name substances
//  that are toxic or illegal (e.g. opium; "blood" in martial recipes). These
//  are reproduced because the historical texts list them — they are DESCRIBED,
//  never RECOMMENDED. Do not attempt any historical recipe.
```

**REPLACEMENT (exact):**

```js
//  SAFETY/FRAMING (non-negotiable): some historical recipes name substances
//  that are toxic, poisonous or illegal — hemlock (Conium maculatum) in
//  Saturn's III.3 suffumigation, which is lethal by ingestion AND dangerous by
//  inhalation of its smoke; opium and colocynth in the Picatrix III.7 ritual
//  confections; "blood" in the martial recipes. These are reproduced because
//  the historical texts list them — they are DESCRIBED, never RECOMMENDED.
//  Do not attempt any historical recipe.
```

**Why this is not cosmetic:** the old comment's only named hazard was opium, and opium is being removed from
the Saturn value. Left unpatched, the module would carry a poison (hemlock) in its data with a safety header
that does not name it. See §6.

---

### P6 — `assets/js/core/data/planetary-magic.js`, `SOURCE` constant, line 34

**Verdict class:** `unverifiable-must-be-marked` (the other six planets were not audited)

**CURRENT (exact):**

```js
const SOURCE = 'Picatrix III.7; Agrippa, Three Books II (see research/SOURCE-DATA.md §4)';
```

**REPLACEMENT (exact):**

```js
// Fallback attribution for records whose Picatrix locus has NOT yet been audited
// per-record. Saturn now carries its own (correctly III.3, not III.7). The
// remaining six are UNAUDITED: Jupiter reads 'storax, frankincense' where III.3
// gives 'amber, lignum aloes', and Venus's 'aloes, mastic, roses' resembles the
// III.7 confection rather than the III.3 correspondence — so this constant is
// known to over-claim III.7 for at least two planets. Audit before relying on it.
const SOURCE = 'Picatrix (locus not individually audited — see sourceNote; the III.3 correspondences and the III.7 ritual confections are different lists); Agrippa, Three Books II (see research/SOURCE-DATA.md §4)';
```

**This is the honest form.** Do NOT quietly change the other six values to III.3 readings — they were not
verified this pass. Marking the constant as an unaudited fallback is the `unverifiable-must-be-marked`
discipline. See **BLOCKED B4**.

---

### P7 — `research/SOURCE-DATA.md` §4, line 130 (Saturn row) and the §4 preamble, lines 125–126

**Verdict class:** `factual-error-fixed`

**CURRENT (line 130, exact):**

```
|Saturn|binding, long-term, secret knowledge, endings|opium, etc.|black|lead|onyx/turquoise|Heylil|Zaphkiel / Agiel / Zazel|
```

**REPLACEMENT (exact):**

```
|Saturn|binding, long-term, secret knowledge, endings|foul-smelling things: asafoetida, gum arabic, bdellium, hemlock ⚠ *(III.3; hemlock is a lethal poison — see note)*|black|lead|onyx/turquoise|Heylil|Zaphkiel / Agiel / Zazel|
```

**CURRENT (§4 preamble, lines 125–126, exact):**

```
Keep **THREE spirit-name systems separate** (do not merge): Picatrix prayer-angels (Bk III.7),
Picatrix Mirror angels, Agrippa Angel/Intelligence/Spirit. Colours = the ritual garments.
```

**REPLACEMENT (exact):**

```
Keep **THREE spirit-name systems separate** (do not merge): Picatrix prayer-angels (Bk III.7),
Picatrix Mirror angels, Agrippa Angel/Intelligence/Spirit. Colours = the ritual garments.

**Locus warning (added 2026-07-30):** the *suffumigation* column and the *prayer-angel* column come from
**different chapters**. The planetary suffumigation correspondences are **Picatrix III.3**; the prayer-angels
are **III.7**, and III.7 also contains separate compound *ritual confections* (Saturn's begins with opium)
that must NOT be pasted into the suffumigation column. Saturn's row is corrected; **Jupiter, Mars, Sun,
Venus, Mercury and Moon are UNAUDITED and at least Jupiter and Venus look like III.7/IV material mis-filed
as III.3 correspondences.** ⚠ Saturn's corrected list contains **hemlock (Conium maculatum), a lethal
poison, dangerous even as smoke** — described, never recommended.
```

---

### P8 — `docs/FRAMING.md` §3.1, lines 217–223 (three occurrences of the old value)

**Verdict class:** `factual-error-fixed`

> **⚠ Line 223 does not end at the sentence.** It continues
> `… And it is exposed to the assistant as a callable tool returning \`steps\`, with the`. This is a
> **substring** replace running from the start of line 217 through `are toxic or illegal.` on line 223 —
> **not** a whole-line replace of 217–223. Verified line numbers: opium occurs at **219, 220, 222**.

**CURRENT (exact substring, start of line 217 → `are toxic or illegal.` on line 223):**

```
`assets/js/core/talisman.js` generates, live and personalised to the reader's own time and place, a numbered
imperative protocol in site voice — *"Choose the aim…"*, *"Elect the time: act in the day AND hour of
Saturn…"*, *"Prepare the materials: suffumigation of opium, etc.…"*, *"Consecrate at the elected hour: kindle
Saturn's suffumigation (opium, etc.) and speak the petition over the engraving WHILE the smoke rises."* It
carries no quotation container. It names a controlled substance as a material — `planetary-magic.js` gives
Saturn `suffumigation: 'opium, etc.'`, and that module's own header says these recipes name substances that
are toxic or illegal.
```

**REPLACEMENT (exact):**

```
`assets/js/core/talisman.js` generates, live and personalised to the reader's own time and place, a numbered
imperative protocol in site voice — *"Choose the aim…"*, *"Elect the time: act in the day AND hour of
Saturn…"*, *"Prepare the materials: suffumigation of …"*, *"Consecrate at the elected hour: kindle
Saturn's suffumigation and speak the petition over the engraving WHILE the smoke rises."* It
carries no quotation container. It names a poisonous material — until 2026-07-30 `planetary-magic.js` gave
Saturn `suffumigation: 'opium, etc.'` (a controlled substance, and mis-attributed: see §C-2); the corrected
III.3 value is `'foul-smelling things: asafoetida, gum arabic, bdellium, hemlock'`, and **hemlock is a lethal
poison whose smoke is itself dangerous** — so correcting the substance does NOT retire this blocker, it
merely changes which poison the generated protocol tells a reader to burn. That module's own header says
these recipes name substances that are toxic or illegal.
```

**Also line 776 (§A-3), CURRENT:**

```
protocol naming opium, surfaced through the registry and returned to the assistant as `steps`. The rule is
```

**REPLACEMENT:**

```
protocol naming a poison (opium before the 2026-07-30 correction; hemlock after it), surfaced through the
registry and returned to the assistant as `steps`. The rule is
```

**This is the single most important editorial point in the whole patchset.** See §6.

---

### P9 — `docs/plans/opgraph/RANKING-SPEC.md` line 711 (RK-B2) — untracked file

**Verdict class:** `factual-error-fixed` (the diagnosis itself was partly wrong)

**CURRENT (exact substring to replace):**

```
opium in the Picatrix corpus attaches, in accessible scholarship, to a **solar** invocation.
```

**REPLACEMENT (exact):**

```
opium in the Picatrix corpus attaches to the **III.7 ritual confections** — including Saturn's own (Attrell–Porreca 3.7.16), which begins with opium — not to the III.3 suffumigation correspondences; the module conflated the two and cited III.7 for a III.3 value.
```

**Also in the same line, CURRENT:** `The Picatrix's own list reads *"all things that smell bad, asafoetida,
gum arabic, bdellium, hemlock and similar things"*` — this is **correct** (Greer–Warnock wording) but should
gain its locus: append ` (III.**3**, not III.7)`.

---

## 3. GROUP C — Gheraṇḍa Saṁhitā ch. 3 loci: the loci are right, the cross-check claim is not

**Headline:** **all 25 Gheraṇḍa loci in `mudras.js` are CORRECT as shipped**, including every record after
3.32. No renumbering. The blind re-audit's post-3.32 divergence is real but is a **defect of the siva.sh
witness**, which the repo's `_meta` currently cites as an unqualified independent cross-check:

- siva.sh ch. 3 contains a duplicated, scrambled block at 3.33–44 (re-running khecarī 25–32 and mahāvedha
  21–24), **omits the five dhāraṇā sections entirely** (Vasu 3.70–81), then re-aligns with Vasu from aśvinī
  3.82 (because 12 verses were duplicated and 12 omitted), and adds two closing verses 94–95.
- Vasu's numbering after 3.32 is independently confirmed by the **GRETIL Sanskrit e-text of Peter Thomi's
  1993 edition** at every section boundary the repo records.

So the patch is: **scope the cross-check claim, name a sound witness, and flag the real edition divergence.**

> **⚠ BUILD-PIPELINE PROBLEM — READ FIRST.** `mudras.js` header says *"GENERATED — do not hand-edit. Source
> of truth: r31data/hatha-mudras.json … Regenerate via scratchpad/r31build/gen-practices-data.mjs."*
> **Both `scratchpad/r31data/` and `scratchpad/r31build/` are now EMPTY** (0 entries each, verified
> 2026-07-30). The declared source of truth and its generator no longer exist. The maintainer must choose:
> **(a)** hand-edit `mudras.js` and amend its header to say the JSON is gone and the file is now the source
> of truth; or **(b)** reconstruct `hatha-mudras.json` from `mudras.js` (minus `artId`) plus the generator,
> then patch upstream and regenerate. **Do not silently hand-edit a file that claims to be generated** —
> that is exactly the drift this patchset is trying to prevent. Recorded as **BLOCKED B6**.

---

### P10 — `PRACTICES_META.editionResolution.numberingMapping` (mudras.js line 952)

**Verdict class:** `factual-error-fixed` (an over-broad provenance claim)

**CURRENT (exact, one line):**

```
    "numberingMapping": "GS ch.3 verse ranges were pinned against Vasu's own English (archive.org full text of Vasu's translation) and independently cross-checked against the Sanskrit verse numbering at siva.sh/gherand-samhita/3, which agrees on the mudrā-list order (v.1: 8 names through khecarī; v.2: viparītakaraṇī…pañcadhāraṇā; v.3: aśvinī…bhujaṅginī) and on khecarī beginning at 3.25. Ch.3 in Vasu runs to v.93 (bhujaṅginī 92–93).",
```

**REPLACEMENT (exact, one line):**

```
    "numberingMapping": "GS ch.3 verse ranges are pinned to Vasu's translation (1895 = SBH 1914–15 numbering), verified against Vasu's own English full text. Independent Sanskrit cross-check: the GRETIL e-text of Peter Thomi's 1993 edition (gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/yoga/ghers_au.htm), which agrees with Vasu at every section boundary recorded here (khecarī 3.25; viparītakaraṇī 3.33/34; yoni 3.37; vajroṇī 3.45–48; śakticālanī 3.49–60; tāḍāgī 3.61; māṇḍukī 3.62–63; śāmbhavī 3.64; the five dhāraṇās 3.70–81; aśvinī 3.82; pāśinī 3.84; kākī 3.86; mātaṅginī 3.88; bhujaṅginī 3.92). SCOPE CORRECTION 2026-07-30: siva.sh/gherand-samhita/3 corroborates ONLY 3.1–3.32 and 3.82–3.93 and must not be cited beyond that range — its chapter-3 text is defective, carrying a duplicated and scrambled block at 3.33–44 (repeating khecarī 25–32 and mahāvedha 21–24), omitting the five dhāraṇā sections (Vasu 3.70–81) entirely, and adding two closing verses (94–95) Vasu does not number; because it duplicates 12 verses and omits 12, its tail re-aligns with Vasu by coincidence. Ch.3 in Vasu runs to v.93 (bhujaṅginī 92–93).",
```

**Unique find-anchor:** `and independently cross-checked against the Sanskrit verse numbering at siva.sh/gherand-samhita/3, which agrees on the mudrā-list order`

---

### P11 — NEW field `PRACTICES_META.editionResolution.chapterLengthSourceNote` (insert after `residualRisk`, mudras.js line 953)

**Verdict class:** `edition-divergence-flagged` — **BOTH positions encoded, neither picked**

**CURRENT:** does not exist.

**REPLACEMENT — insert this key immediately after the `residualRisk` line:**

```
    "chapterLengthSourceNote": "EDITION DIVERGENCE, FLAGGED NOT RESOLVED. Chapter 3's length and internal numbering are edition-dependent, and this site does not adjudicate between them. POSITION A (the site's cited edition): Vasu 1895 / SBH XV pt.2 1914–15 ends ch.3 at 3.93, with bhujaṅginī at 3.92–93. POSITION B: Thomi 1993 (GRETIL) and Mallinson 2004 (YogaVidya critical edition) run ch.3 to roughly 3.100, adding closing phala- and secrecy-verses after bhujaṅginī that Vasu does not number; Mallinson's critical edition additionally renumbers earlier sections (his accessible excerpt places viparītakaraṇī at 3.30–31 against Vasu's 3.33–36). Every locus on this site is Vasu-numbered and every record says so; a locus is meaningful only with its edition named. Recorded 2026-07-30.",
```

---

### P12 — `gs-khecari.sources[1]` (mudras.js line 176)

**Verdict class:** `factual-error-fixed` (scope)

**CURRENT (exact):**

```
      "Cross-check of the Sanskrit numbering: siva.sh/gherand-samhita/3."
```

**REPLACEMENT (exact):**

```
      "Cross-check of the Sanskrit numbering: siva.sh/gherand-samhita/3 — valid for GS 3.1–3.32, which covers this record (khecarī 3.25–32 confirmed against the Sanskrit incipits); that witness is defective after 3.32, see PRACTICES_META.editionResolution.numberingMapping. Independent Sanskrit cross-check for the whole chapter: GRETIL, Thomi 1993 (ghers_au.htm)."
```

**Note:** this string occurs **once** in the file (verified). Records with loci after 3.32 do not carry a
siva.sh line at all, so no other record needs scoping — but assertion **T15** enforces that going forward.

---

### P13 — `PRACTICES_META.editionResolution.residualRisk` (mudras.js line 953)

**Verdict class:** `unverifiable-must-be-marked`

**CURRENT (exact substring):**

```
they are verified via (a) Vasu's identical-translation full text and (b) the independent siva.sh Sanskrit numbering.
```

**REPLACEMENT (exact):**

```
they are verified via (a) Vasu's identical-translation full text, (b) the GRETIL Sanskrit e-text of Thomi 1993 across the whole chapter, and (c) the siva.sh Sanskrit numbering for 3.1–3.32 and 3.82–3.93 only. Re-audit 2026-07-30 additionally failed to reach: sacred-texts.com/hin/gher/gher03.htm (HTTP 403), web.archive.org (blocked in this environment), terebess.hu/english/gheranda.html (404). The 1895 print has still not been digit-verified page-by-page.
```

**Substance unchanged** — the residual risk was already honestly disclosed. This patch only replaces the
now-scoped siva.sh claim and names the new access failures.

**Per-record verdict:** all 17 records with loci after 3.32 (`gs-viparitakarani` 3.33–36, `gs-yoni-mudra`
3.37–44, `gs-vajroni` 3.45–48, `gs-sakticalani` 3.49–60, `gs-tadagi` 3.61, `gs-manduki` 3.62–63,
`gs-sambhavi` 3.64–67, the five dhāraṇās 3.70–81, `gs-asvini` 3.82–83, `gs-pasini` 3.84–85, `gs-kaki`
3.86–87, `gs-matangini` 3.88–91, `gs-bhujangini` 3.92–93) are **correct as-is — action: none**.

---

## 4. GROUP D — the citation queue: 29 flagged citations, 0 fabricated

**Headline:** **nothing was invented.** 27 CONFIRMED with retrieved identifiers, 2 CORRECTED, 4 flagged as
genuine date/pagination variance. All 6 flagged critical-edition entries (the band-dominant signal for the
ranking) also CONFIRMED. The census is rankable once P14–P19 land.

**[scratchpad]** — target file is
`scratchpad/rank/30-scholarly-census.json`, not a repo file. Line numbers are from that file.

---

### P14 — census line 326, Abramelin row: Mathers year

**Verdict class:** `factual-error-fixed`

**CURRENT (exact):**

```json
        {"cite": "Mathers, S. L. M., The Book of the Sacred Magic of Abramelin the Mage, 1900", "id": "PD-US", "verified": "unverified-this-pass"}
```

**REPLACEMENT (exact):**

```json
        {"cite": "Mathers, S. L. M. (trans.), The Book of the Sacred Magic of Abramelin the Mage, 1898; 2nd edn London: J. M. Watkins, 1900", "id": "PD-US", "verified": "web-2026-07-30", "sourceNote": "1900 is the SECOND edition; the first is 1898. Both are PD-US, so the public-domain claim survives either way. Witness: esotericarchives.com/abramelin/abramelin.htm (Peterson's foreword)."}
```

**Companion patch — `docs/FRAMING.md` line 381 (repo file, `factual-error-fixed`):**

CURRENT: `and *Abramelin* (1900); Vasu (1895/1914); Preisendanz vol. 1 (1928).`
REPLACEMENT: `and *Abramelin* (1898; 2nd edn 1900); Vasu (1895/1914); Preisendanz vol. 1 (1928).`

---

### P15 — census line 415, Mantramahodadhi row: the vague Bühnemann cite

**Verdict class:** `factual-error-fixed` (unverifiable-as-written → pinned)

**CURRENT (exact):**

```json
        {"cite": "Bühnemann, G., work on the ṣaṭkarman (six acts) — named in FRAMING §4.4 as cite-only", "id": "cite-only", "verified": "unverified-this-pass"}
```

**REPLACEMENT (exact):**

```json
        {"cite": "Bühnemann, G., 'The Six Rites of Magic', in D. G. White (ed.), Tantra in Practice, Princeton Readings in Religions, Princeton University Press, 2000, pp. 447–462 — named in FRAMING §4.4 as cite-only", "id": "muse.jhu.edu/book/61197 ch.26", "verified": "web-2026-07-30", "sourceNote": "The census's original 'work on the ṣaṭkarman (six acts)' carried no title, venue or year and was unverifiable as written. Pinned to the Tantra in Practice chapter via the Project MUSE TOC (book 61197, ch. 26, pp. 447–462) and press.princeton.edu/books/paperback/9780691057798."}
```

**Companion patch — `docs/FRAMING.md` lines 374–375 (repo file, `factual-error-fixed`).** The citation wraps
across a newline, so this is a two-line substring replace.

CURRENT (exact — end of line 374 + start of line 375):

```
**Bühnemann** on the six
acts;
```

REPLACEMENT (exact):

```
**Bühnemann**, 'The Six Rites of
Magic' (in White, ed., *Tantra in Practice*, 2000, pp. 447–462);
```

*(FRAMING §4.4's "cite-only" status for this work is unchanged — it is excluded on copyright and remains
cited, never reproduced. Only the vagueness is fixed.)*

---

### P16–P19 — the four genuine variances: **ADD BOTH, never pick**

Each of these is `edition-divergence-flagged`. The dominant reading stays in `cite`; the minority reading is
added in a new `sourceNote` naming its witness. **Also set `"verified": "web-2026-07-30"`** on each — they
were verified; the variance is a property of the record, not a failure to check it.

| # | Census line | Row | Dominant (keep in `cite`) | Variant (add in `sourceNote`) | `sourceNote` string to paste |
|---|---|---|---|---|---|
| **P16** | 905 | Orzech/Sørensen/Payne | **2011** | 2010 | `"VARIANT YEAR, both recorded: printed reviews (Religious Studies Review 2013, Wedemeyer) give 'Leiden: Brill, 2011'; Brill's own catalogue and the National Humanities Center listing give 2010. Neither is wrong — 2011 is the dominant citation form. HdO Section 4 vol. 24; ISBN 9789004184916; xxi+1200 pp. Brill's title page is 403-blocked to automated fetch."` |
| **P17** | 508 | Sanderson, 'The Śaiva Age' | **pp. 41–349** | 41–350 | `"VARIANT PAGINATION, both recorded: Zenodo (records/4395629) gives pp. 41–349; the Academia record gives 41–350. Unresolved which the printed volume shows. Add series: Institute of Oriental Culture Special Series 23, University of Tokyo, 2009."` |
| **P18** | 638 | Vasu, *The Śiva Saṁhitā* | **1914** | 1913 | `"VARIANT YEAR, both recorded: the archive.org scan's title page reads 1914 (SBH vol. 15 pt.1, Pāṇini Office) — the stronger witness; some library catalogs date the SBH vol. 15 issue 1913. Keep 1914. openlibrary.org/books/OL4873385M."` |
| **P19** | 807 | Idel, *Mystical Experience in Abraham Abulafia* | **1988** | Dec 1987 printing | `"VARIANT YEAR, both recorded: SUNY Press gives 1988 (copyright); some records show a December 1987 printing. Keep 1988. ISBN 088706552X / 0887065538; sunypress.edu/isbn/9780887065538."` |

---

### P20 — census line 544, Wujastyk title particle

**Verdict class:** `factual-error-fixed` (micro)

**CURRENT (exact):**

```json
        {"cite": "Wujastyk, Dominik, 'An Alchemical Ghost: The Rasaratnākara of Nāgārjuna', Ambix 31 (1984)", "id": null, "verified": "unverified-this-pass"},
```

**REPLACEMENT (exact):**

```json
        {"cite": "Wujastyk, Dominik, 'An Alchemical Ghost: The Rasaratnākara by Nāgārjuna', Ambix 31/2 (1984) 70–83", "id": "DOI 10.1179/amb.1984.31.2.70; PMID 11615977", "verified": "web-2026-07-30"},
```

**Note — the repo already gets this right.** `assets/js/core/data/rasa-data.js` line 44 already reads
`'An Alchemical Ghost: The Rasaratnākara by Nāgārjuna', Ambix 31.2 (1984) 70–83 (DOI 10.1179/amb.1984.31.2.70)`.
This patch aligns the census *to the shipped data*, not the other way round. Assertion **T18** turns that
into a standing invariant.

---

### P21 — the remaining 25 CONFIRMED exemplar citations + 6 CONFIRMED edition entries

**Verdict class:** `factual-error-fixed` (a stale flag is a factual error about the repo's own state)

**Mechanical patch:** for census lines **168, 362, 392, 542, 546, 586, 587, 588, 613, 693, 695, 726, 780,
781, 782, 808, 809, 810, 836, 904, 944, 945** (exemplars) and **379, 562, 604, 766, 825, 884** (editions),
change `"verified": "unverified-this-pass"` → `"verified": "web-2026-07-30"` and attach the retrieved
identifier into the `id` field per the table in `63-citation-queue.md` §"The 27 CONFIRMED" and §"the 6
flagged edition entries" (ISBNs, DOIs, catalog records — all listed there with their retrieval URLs).

**Two of these carry an enrichment worth taking:**
- line 168 (Griffith & Thompson): `1904` → `London: H. Grevel & Co., 3 vols, 1904–1909 (vol. I 1904)`.
- line 780 (Schäfer & Shaked): Bd 1 = TSAJ 42 (1994), Bd 2 = TSAJ 64 (1997), Bd 3 = TSAJ 72 — **Bd 3's year
  1999 is `unverifiable-must-be-marked`**, see BLOCKED B8. Keep that one component flagged.

**Do NOT clear** the 5 `researchProgramme` flags on lines 195, 222, 465, 805, 937 — see BLOCKED B7.

---

## 5. ENGINE-TEST ASSERTIONS — so none of this can silently drift back

House style: `ok(cond, msg)` in `scripts/engine-test.mjs`, or a new
`scripts/tests/r34-citation-pins.mjs` exporting `async run() -> {pass, failures[]}` and registered in the
`for (const modName of [...])` loop at the tail of `engine-test.mjs`. **Recommendation: a new module**, since
several assertions must read files from disk (`node:fs`) which the pure-import section of `engine-test.mjs`
deliberately avoids.

The organising principle: **pin the value and its citation together in one assertion.** A test that checks
only the number lets a future round delete the citation; a test that checks only the citation lets the
number drift.

### A — CDC lead figure

```js
// T1 — the halved figure can never reappear, anywhere.
const BAD = /1\.2\s*%\s*lead|one product (at|measuring) 1\.2/i;
for (const f of walk(['docs', 'pages', 'assets', 'research'])) {
  ok(!BAD.test(read(f)), `T1 no "1.2% lead" anywhere (${f})`);
}

// T2 — figure and citation are welded: any file naming MMWR 61(33) must carry BOTH
//      the correct figure AND the PMID, within the same file.
for (const f of walk(['docs', 'pages', 'assets'])) {
  const t = read(f);
  if (!/MMWR/.test(t)) continue;
  ok(/2\.4\s*%/.test(t), `T2a MMWR file states 2.4% (${f})`);
  ok(/61\(33\)/.test(t), `T2b MMWR file names the issue 61(33) (${f})`);
}

// T3 — once the harm note is encoded in data, the number may not exist without its source.
//      (No-op until RASA_TOXICITY gains structured records; write it now so it fires the
//       moment it becomes relevant.)
import { RASA_TOXICITY } from '../../assets/js/core/data/rasa-data.js';
for (const rec of rasaHarmRecords()) {
  if (/2\.4\s*%/.test(JSON.stringify(rec))) {
    ok(/22914225/.test(rec.source || ''), 'T3a the 2.4% figure carries PMID 22914225');
    ok(/MMWR Morb Mortal Wkly Rep 61\(33\)/.test(rec.source || ''), 'T3b … and the full MMWR cite');
    ok(/CORRECTION 2026-07-30/.test(rec.sourceNote || ''), 'T3c … and the correction memo');
  }
}

// T4 — the §C-1 unit lint must be scoped to SITE-VOICE fields only.
//      Guard assertion: a record whose source/sourceNote contains "µg/dL" or "mg/kg"
//      must still PASS the harm lint. Without this, the correct citation hard-fails the gate.
ok(harmLintPasses({ normalised: false, harmNote: 'poison', source: 'MMWR … 16–64 µg/dL' }),
   'T4 harm lint ignores units inside source/sourceNote (quotation containers, not site voice)');
```

### B — Picatrix Saturn

```js
import { PLANETARY_MAGIC } from '../../assets/js/core/data/planetary-magic.js';
const sat = PLANETARY_MAGIC.Saturn;

// T5 — the wrong value cannot come back.
ok(!/opium/i.test(sat.suffumigation), 'T5 Saturn suffumigation no longer names opium');

// T6 — the right value is present, in full.
for (const ing of ['asafoetida', 'bdellium', 'hemlock', 'gum'])
  ok(sat.suffumigation.includes(ing), `T6 Saturn suffumigation includes ${ing}`);

// T7 — value and locus are welded: the corrected value must cite III.3.
ok(/III\.3/.test(sat.source), 'T7 Saturn cites Picatrix III.3 (the correspondence chapter)');
ok(!/^Picatrix III\.7;/.test(sat.source), 'T7b Saturn no longer cites only III.7');

// T8 — the edition divergence is ADDED, not resolved: BOTH readings present, both witnesses named.
ok(/gum arabic/.test(sat.sourceNote) && /Greer/.test(sat.sourceNote), 'T8a G–W reading + witness');
ok(/"gum"/.test(sat.sourceNote) && /Attrell/.test(sat.sourceNote),   'T8b A–P reading + witness');
ok(/3\.7\.16/.test(sat.sourceNote), 'T8c the III.7 confection is named (so "opium" is explained, not erased)');

// T9 — HARM FOLLOWS THE INGREDIENTS. Any planet whose suffumigation names a substance in
//      the hazard lexicon must carry a hazard marker AND a warning in its sourceNote.
const HAZARD = /hemlock|opium|colocynth|blood|mercury|arsenic|mandrake|nightshade|henbane/i;
for (const [name, p] of Object.entries(PLANETARY_MAGIC)) {
  if (!HAZARD.test(p.suffumigation)) continue;
  ok(/WARNING|poison/i.test(p.sourceNote || ''),
     `T9 ${name}: hazardous suffumigation carries an explicit warning`);
}

// T10 — the module header's named exemplar must match the data. If hemlock is in a value,
//       the safety header must name hemlock.
const hdr = read('assets/js/core/data/planetary-magic.js').slice(0, 2000);
ok(/hemlock/i.test(hdr), 'T10 module safety header names hemlock');

// T11 — doc/data parity: research/SOURCE-DATA.md §4's Saturn row must carry the same value.
const row = read('research/SOURCE-DATA.md').split('\n').find(l => l.startsWith('|Saturn|'));
ok(row.includes('hemlock') && !row.includes('opium, etc.'),
   'T11 SOURCE-DATA.md §4 Saturn row matches the corrected data value');

// T12 — the unaudited-locus honesty marker survives.
ok(/not individually audited/.test(read('assets/js/core/data/planetary-magic.js')),
   'T12 the SOURCE fallback still declares the other six planets unaudited');
```

### C — Gheraṇḍa loci

```js
import { HATHA_MUDRAS, PRACTICES_META } from '../../assets/js/core/practices.js';

// T13 — EVERY locus carries its edition tag. A bare "GS 3.45" is meaningless and is a failure.
const GS_LOCUS = /^GS \d+\.\d+(–\d+)? \(Vasu 1895 \/ SBH 1914–15\)$/;
for (const m of HATHA_MUDRAS.filter(m => m.source === 'gheranda'))
  ok(GS_LOCUS.test(m.locus), `T13 ${m.id}: locus carries the Vasu 1895 / SBH 1914–15 edition tag`);
ok(HATHA_MUDRAS.filter(m => m.source === 'gheranda').length === 25, 'T13b still 25 Gheraṇḍa records');

// T14 — ch.3 loci are non-overlapping and monotonic: a renumbering cannot slip in unnoticed.
const ch3 = HATHA_MUDRAS.filter(m => m.source === 'gheranda' && /^GS 3\./.test(m.locus))
  .map(m => { const [, a, b] = m.locus.match(/^GS 3\.(\d+)(?:–(\d+))?/); return { id: m.id, a: +a, b: +(b || a) }; })
  .sort((x, y) => x.a - y.a);
for (let i = 1; i < ch3.length; i++)
  ok(ch3[i].a > ch3[i - 1].b, `T14 ${ch3[i].id} starts after ${ch3[i - 1].id} ends (no overlap)`);
ok(ch3.at(-1).b === 93, 'T14b ch.3 ends at 3.93 (the Vasu endpoint the site commits to)');

// T15 — the siva.sh claim may never again be unscoped, anywhere in the module.
const raw = read('assets/js/core/data/practices/mudras.js');
for (const line of raw.split('\n').filter(l => l.includes('siva.sh')))
  ok(/3\.1–3\.32|3\.1-3\.32|defective|see PRACTICES_META/.test(line),
     'T15 every siva.sh citation is scope-limited or points at the scope note');

// T16 — a sound independent Sanskrit witness is named for the WHOLE chapter.
const nm = PRACTICES_META.editionResolution.numberingMapping;
ok(/gretil/i.test(nm) && /Thomi/.test(nm), 'T16 GRETIL/Thomi 1993 named as the chapter-wide cross-check');
ok(/3\.70–3\.81|3\.70-81|dhāraṇās 3\.70–81/.test(nm),
   'T16b the dhāraṇā range siva.sh omits is explicitly called out');

// T17 — the chapter-length divergence is FLAGGED WITH BOTH POSITIONS, not resolved.
const cl = PRACTICES_META.editionResolution.chapterLengthSourceNote || '';
ok(/3\.93/.test(cl) && /3\.100/.test(cl), 'T17a both chapter endpoints recorded (Vasu 3.93 / Thomi–Mallinson ~3.100)');
ok(/Mallinson/.test(cl) && /Vasu/.test(cl), 'T17b both witnesses named');
ok(/FLAGGED NOT RESOLVED/.test(cl),         'T17c divergence is declared unresolved, not silently picked');
```

### D — the citation census

```js
// T18 — census/data parity: a citation the site actually ships must match the census row.
//       (Catches the Wujastyk "of"/"by" class of drift in either direction.)
ok(census.find(r => /Alchemical Ghost/.test(r.cite)).cite.includes('by Nāgārjuna'),
   'T18 census matches the shipped rasa-data.js Wujastyk title');

// T19 — after this patchset, NO exemplar and NO edition entry may remain unverified.
const stillFlagged = allCitationRows(census).filter(r => r.verified === 'unverified-this-pass');
ok(stillFlagged.every(r => r.kind === 'researchProgramme'),
   `T19 only researchProgramme rows remain flagged (got ${stillFlagged.length}, expect exactly 5)`);
ok(stillFlagged.length === 5, 'T19b exactly the 5 known-open researchProgramme flags remain');

// T20 — no flagged row may reach a shipped page. If a citation string appears under assets/
//       or pages/, its census row must be verified.
for (const r of stillFlagged)
  ok(!appearsInShippedFiles(r.cite), `T20 unverified row not surfaced on any page: ${r.cite.slice(0, 60)}`);

// T21 — the four genuine variances must keep BOTH readings.
for (const [needle, a, b] of [
  ['Esoteric Buddhism and the Tantras', '2011', '2010'],
  ['Śaiva Age',                          '41–349', '41–350'],
  ['Śiva Saṁhitā',                       '1914', '1913'],
  ['Mystical Experience in Abraham',     '1988', '1987'],
]) {
  const row = census.find(r => r.cite.includes(needle));
  ok(row.cite.includes(a) && (row.sourceNote || '').includes(b),
     `T21 ${needle}: dominant reading in cite, variant preserved in sourceNote`);
}
```

**One more, cheap and high-value:**

```js
// T22 — the generated-file contract holds. mudras.js claims a source of truth; assert it exists,
//       or that the header has been honestly amended. (Currently FAILS — see BLOCKED B6.)
const mudrasHdr = read('assets/js/core/data/practices/mudras.js').slice(0, 800);
if (/GENERATED — do not hand-edit/.test(mudrasHdr))
  ok(existsSync('scratchpad/r31data/hatha-mudras.json'),
     'T22 a file declaring itself GENERATED has a source of truth that actually exists');
```

---

## 6. THE HARM-PROFILE NOTE — does correcting Picatrix change the danger? (asked directly, answered directly)

**Yes it changes it, and no it does not reduce it. The corrected list is arguably worse.**

The old value, `'opium, etc.'`, was hazardous in a *regulatory* way: opium is a controlled substance, and
FRAMING §3.1 named that as the reason `talisman.js` is a shipping blocker — a live, personalised, imperative
protocol that tells a named reader to *"Prepare the materials: suffumigation of opium, etc."*

The corrected III.3 value is `'foul-smelling things: asafoetida, gum arabic, bdellium, hemlock'`. Three of
those four are inert aromatics. The fourth is **hemlock — *Conium maculatum*, the poison that killed
Socrates.** Its alkaloid coniine causes ascending neuromuscular paralysis and death by respiratory failure,
and — this is the part that matters for a *suffumigation*, a recipe whose entire mode of use is **burning it
and standing in the smoke** — **coniine is volatile and hemlock smoke is documented as dangerous to inhale.**

So the substitution runs: *a controlled substance a reader almost certainly cannot obtain* → *a lethal
poison that grows wild on roadsides across Europe and North America, in a recipe whose instruction is to
burn it and breathe the fumes.* Availability goes up; lethality goes up; the route of exposure is now the
recipe's own operation rather than a misuse of it.

**Four consequences, all mandatory:**

1. **The correction does not retire the §3.1 blocker — it strengthens it.** P8 rewrites that passage so it
   cannot be misread as "the opium problem is solved". `talismanRecipe()` must not emit an imperative
   materials step for Saturn either way. If anyone argues the blocker can now be downgraded because opium is
   gone, this note is the answer.
2. **The harm note follows the ingredients, not the old text.** P5 rewrites the module's safety header so its
   named exemplar is hemlock. Assertion **T10** makes the header/data mismatch a test failure, and **T9**
   generalises it: any planet whose suffumigation names a hazard-lexicon substance must carry an explicit
   warning. This is the structural fix — it will catch Jupiter, Venus and the rest when they are audited.
3. **Opium stays in the record, in the note.** It is genuinely the first ingredient of the III.7
   Saturn-conjuration confection (A&P 3.7.16), alongside colocynth (a violent purgative) and wormwood. The
   `sourceNote` in P4 keeps that, both because it is true and because it explains where the wrong value came
   from — an unexplained deletion is an invitation to a future round to "restore" it. **T8c** pins it.
4. **If the III.7 confection is ever described as such**, it needs its own harm note covering opium,
   colocynth and the animal materia — it does not inherit Saturn's III.3 note.

**Net:** the talisman material's harm profile is *changed in kind and not reduced in degree*. Nothing in this
patchset licenses relaxing any existing safety framing, and P5/P8 tighten two places where the old framing
would otherwise have gone stale against the new data.

---

## 7. SUGGESTED LANDING ORDER

1. **P1, P2** (CDC) — highest urgency: P2 must beat §9.7's application to `pages/rasa.html`.
2. **P4, P5, P6, P7, P8, P9** (Picatrix) — land as one commit; the data, the header, the doc table and the
   FRAMING blocker prose must not be separable.
3. **T5–T12** — add before or with step 2 so the gate proves it.
4. **P10–P13** (Gheraṇḍa) — resolve **B6** (the missing generator) first.
5. **T13–T17**.
6. **P14–P21** (census) — scratchpad only; prerequisite for the ranking round, not for the site build.
7. **T18–T22**.
8. Run the CHECK gate: `verify-site` (audit + engine-test + Chromium sweep).

---

## 8. BLOCKED — what could not be resolved, and what would resolve it

| # | Blocked item | Why | Evidence that would resolve it | Interim rule |
|---|---|---|---|---|
| **B1** | Per-product lead concentrations for each of the 10 MMWR medications, and the quantified mercury/arsenic levels | The table sits in the CDC-hosted full text; `cdc.gov`, `stacks.cdc.gov` and the NYC DOHMH PDF all return **HTTP 403** to every automated route tried (WebFetch and curl with a browser UA) | A human opening the *MMWR* 61(33) PDF (or a library copy of pp. 641–646) and reading the table | Encode **only** the maximum (2.4%) and the qualitative mercury/arsenic statement. **No per-product figure may be written.** |
| **B2** | Provenance of the "1.2%" figure | No source anywhere states 1.2% for this report | If an earlier round drew it from a different paper, that paper's identifier | Treated as an in-repo transcription error. `sourceNote` says so explicitly (P3) so it is not later mistaken for a variant reading. |
| **B3** | The MMWR sentence attested only at one remove | cdc.gov 403; the verbatim sentence comes from the NLM abstract (which is the report's own summary) plus 3 independent secondary witnesses, not from CDC-hosted body text | A retrieved CDC-hosted page or PDF | Access failure, **not** disagreement — do not flag as contested. Record the 403 in the `sourceNote`. |
| **B4** | The other six planets' suffumigations in `planetary-magic.js` | Not audited this pass. Jupiter reads `'storax, frankincense'` where III.3 gives *amber, lignum aloes*; Venus's `'aloes, mastic, roses'` resembles the III.7 confection, not the III.3 correspondence | An accuracy-check pass over Greer–Warnock III.3 and III.7 for all six | P6 marks `SOURCE` as an unaudited fallback. **Do not surface these six as III.3 correspondences.** T12 pins the marker. |
| **B5** | Picatrix base texts not consulted | Ritter & Plessner (1962 German) and Pingree (1986 Latin) not accessible online; the Arabic *Ghāyat al-Ḥakīm* (Atallah–Kiesel vol. 2) not checked | Library access to Pingree's Latin — which would also settle "actarag/storax" and "caraway/carob" in the III.7 confection | Attrell–Porreca stands in for Pingree at one remove; declared in the `sourceNote`. The two micro-divergences are recorded, not adjudicated. |
| **B6** | **`mudras.js`'s declared source of truth does not exist.** The header names `r31data/hatha-mudras.json` and `scratchpad/r31build/gen-practices-data.mjs`; **both directories are empty** (verified 0 entries, 2026-07-30) | The scratchpad was cleared between rounds | Recovering the JSON + generator from an earlier build artefact, **or** a maintainer decision to make `mudras.js` the source of truth and amend its header | **Blocks P10–P13.** Do not hand-edit a file that claims to be generated without also fixing the claim. T22 encodes the contract. |
| **B7** | The 5 `researchProgramme` census fields (lines 195, 222, 465, 805, 937 — Societas Magica framing ×2, the Ratié/ERC Kashmir-Śaiva characterisation, the Hebrew-University/AJS infrastructure note, BDRC) | Institutional characterisations, not bibliographic records; no retrievable identifier makes them checkable the way an ISBN does | Institutional web pages or annual reports confirming each programme's existence and scope | **Stay flagged `unverified-this-pass`. Must not be surfaced on any page.** T19b asserts exactly 5 remain; T20 asserts none reaches a page. |
| **B8** | *Magische Texte aus der Kairoer Geniza* **Band 3**: the year 1999 | Series number TSAJ 72 was retrieved; the year 1999 was not read off a retrieved page — it rests on the census's own 1994–1999 range plus a catalog series listing | The Mohr Siebeck Band 3 title page or a library catalog record showing the imprint year | Cite Bd 1 = TSAJ 42 (1994) and Bd 2 = TSAJ 64 (1997) as verified; mark **Bd 3's year only** as unverified within the row's `sourceNote`. |
| **B9** | Sanderson 'The Śaiva Age' page span: 41–349 vs 41–350 | Two records disagree; the printed volume was not seen | The printed *Genesis and Development of Tantrism* volume, or a scan of its TOC | `edition-divergence-flagged` — **both encoded** (P17). Never pick one silently. |
| **B10** | Orzech/Sørensen/Payne 2010 vs 2011 | Brill's direct title page is 403-blocked; settled from review literature + publisher listings, which disagree with each other | The book's own title page / copyright page | `edition-divergence-flagged` — both encoded (P16), 2011 dominant. |
| **B11** | Vasu 1895 print not digit-verified page-by-page | sacred-texts.com **403**; web.archive.org blocked in this environment; terebess.hu **404**; the b28140102 Devanāgarī OCR is unusable | A page-image scan of Vasu's ch. 3, or of SBH XV pt. 2 (1914–15) | Already disclosed in `residualRisk`; P13 keeps it and adds the new access failures. Loci are confirmed via a Vasu-lineage translation + Thomi 1993 GRETIL. |
| **B12** | Thomi 1993's own micro-boundaries (viparītakaraṇī opening at 3.33 or 3.34; śakticālanī at 3.49 or 3.52) | The GRETIL reads matched characteristic verses, not section headings | A copy of Thomi 1993 with its section headings | **Does not affect any repo locus** (all loci are Vasu-numbered). Noted only so a future round does not mistake it for a discrepancy. |
| **B13** | A Vasu-lineage blog reports ch.3's final verse as 3:100 while Vasu (and the repo) end at 3.93 | Most likely the blog appends long-recension closing verses | A page image of Vasu's last ch.3 page | Covered by the flagged divergence in P11 — both positions recorded. |

---

## 9. ONE-LINE SUMMARY PER GROUP

- **A / CDC:** one real factual error, caught before it shipped. `1.2%` → `2.4%`, plus the case detail the
  article actually supports. Two `docs/FRAMING.md` edits; nothing in `assets/` yet.
- **B / Picatrix:** the value *and* the locus were wrong, and fixing them **raises** the harm profile
  (hemlock for opium). Six patches across data, docs and the FRAMING blocker prose, which must land together.
- **C / Gheraṇḍa:** all 25 loci are right — the provenance *claim* was over-broad. Scope siva.sh to
  3.1–3.32/3.82–3.93, name GRETIL/Thomi 1993 as the chapter-wide witness, flag the real Vasu-vs-Mallinson
  divergence with both positions. **Blocked on a missing generator (B6).**
- **D / Census:** nothing fabricated. 27 confirmed, 2 corrected, 4 genuine variances get both readings, 5
  institutional flags stay open.
