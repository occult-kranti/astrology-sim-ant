# 60 — CDC *MMWR* 61(33) (2012): the lead-concentration figure

**Verdict: the blind re-audit is right. The site's `1.2% lead by weight` is wrong; the published figure is
"as high as 2.4%". Correct it — and the sentence is also thin where the article is rich (case count is right,
but the blood-lead range and the mercury/arsenic co-contamination are unstated).**

---

## 1. The claim under test

FRAMING §C-1 makes it *mandatory* that the toxic-materia harm note state:

> CDC *MMWR* 61(33) (2012), six lead-poisoning cases in pregnant women in New York City, **one product at
> 1.2% lead by weight**

## 2. The article

**CDC / New York City DOHMH, "Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India —
New York City, 2011–2012", *MMWR Morb Mortal Wkly Rep* 61(33), 24 Aug 2012, 641–646. PMID 22914225.**

`www.cdc.gov` and `stacks.cdc.gov` both return **HTTP 403** to automated fetch (verified by WebFetch *and*
by curl with a browser UA), so the text was taken from the NLM record and independently corroborated.

### The exact sentence carrying the percentage

> **"Lead concentrations of the medications were as high as 2.4%; several medications also contained mercury
> or arsenic, which also can have adverse health effects."**

### The surrounding verbatim context (same paragraph, NLM record)

> "During 2011–2012, the New York City Department of Health and Mental Hygiene (DOHMH) investigated **six
> cases of lead poisoning** associated with the use of **10 oral Ayurvedic medications made in India**. All
> six cases were in foreign-born pregnant women assessed for lead exposure risk by health-care providers
> during prenatal visits, as required by New York state law. **Their blood lead levels (BLLs) ranged from 16
> to 64 µg/dL.** Lead concentrations of the medications were as high as 2.4%; several medications also
> contained mercury or arsenic, which also can have adverse health effects."

### Established facts

| Fact | Published value |
|---|---|
| Maximum lead concentration | **2.4%** ("as high as 2.4%") — **not** 1.2% |
| Cases | **6**, all foreign-born pregnant women, NYC, 2011–2012 |
| Products implicated | **10** oral Ayurvedic medications made in India |
| Blood lead range | **16–64 µg/dL** |
| Mercury / arsenic | **Yes** — "several medications also contained mercury or arsenic" |

The repo's figure is exactly **half** the published maximum. No source located states 1.2% for this report;
the most likely provenance is a transcription slip, not a variant reading. **This is a correction, not a
divergence — nothing is flagged as contested, because no source disagrees.**

## 3. Sources compared (all agree; zero divergence)

1. **PubMed / NLM record, PMID 22914225** — abstract carries the sentence verbatim.
2. **Europe PMC REST (`ebi.ac.uk/europepmc/webservices/rest`, EXT_ID:22914225)** — independent host; full
   abstract returned verbatim, identical wording, `pageInfo: 641-646`, journal *MMWR*.
3. **MedicalXpress (AP wire, 22 Aug 2012)** — independent contemporaneous witness: "The products contained
   **up to 2.4 percent lead**", mercury and arsenic also present.
4. **Medscape / NC DPH (Occupational & Environmental Epidemiology) secondary pages** — both repeat "as high
   as 2.4%" against the 61(33):641–646 citation.

`cdc.gov` primary HTML/PDF: **not machine-retrievable (403)** — recorded as an access failure, not a
disagreement. Four independent witnesses carry the identical figure.

## 4. Where the repo states it — exact strings and exact replacements

**Grep result:** `assets/js/core/data/` contains **no** occurrence of "MMWR", "61(33)", "1.2%" or "lead by
weight". `pages/rasa.html`'s live callout (lines 63–69) also carries no MMWR sentence yet. The bad figure
lives **only in `docs/FRAMING.md`**, twice — in §C-1 (the mandate) and in §9.7 (the HTML block specified for
pasting into `pages/rasa.html`). Fixing FRAMING before either is encoded prevents the figure ever shipping.

### 4a. `c:\Users\mehta\OneDrive\Documents\github\2026\astrology-sim-ant\docs\FRAMING.md` — §C-1, lines 529–532

CURRENT (exact):

```
**Harm note must state:** heavy-metal toxicity is documented and current — Saper et al., *JAMA* 292:23 (2004)
and the 2008 internet-products follow-up; CDC *MMWR* 61(33) (2012), six lead-poisoning cases in pregnant women
in New York City, one product at 1.2% lead by weight; a bhasma assaying 19,400 mg/kg lead and 1,430 mg/kg
arsenic (*J Occup Med Toxicol* 8:26).
```

REPLACEMENT (exact — same voice, same sentence architecture, one clause widened):

```
**Harm note must state:** heavy-metal toxicity is documented and current — Saper et al., *JAMA* 292:23 (2004)
and the 2008 internet-products follow-up; CDC *MMWR* 61(33) (2012), six lead-poisoning cases in pregnant women
in New York City (blood lead 16–64 µg/dL) traced to ten oral Ayurvedic medications with lead concentrations
as high as 2.4%, several of which also contained mercury or arsenic; a bhasma assaying 19,400 mg/kg lead and
1,430 mg/kg arsenic (*J Occup Med Toxicol* 8:26).
```

Minimal-diff variant, if the mandate is to be changed by a single token as the audit proposes:
`one product at 1.2% lead by weight` → `lead concentrations as high as 2.4% by weight`.

### 4b. `docs\FRAMING.md` — §9.7 (`pages/rasa.html` callout block), lines 1215–1218

CURRENT (exact):

```
    products carry the harm forward: <i>JAMA</i> 292:23 (2004) found detectable lead, mercury or arsenic in
    20% of Ayurvedic products sampled, with rasa-śāstra products far worse; CDC <i>MMWR</i> 61(33) (2012)
    reports six lead-poisoning cases in pregnant women in New York City, one product measuring 1.2% lead by
    weight. Everything here is the <b>historical</b>
```

REPLACEMENT (exact):

```
    products carry the harm forward: <i>JAMA</i> 292:23 (2004) found detectable lead, mercury or arsenic in
    20% of Ayurvedic products sampled, with rasa-śāstra products far worse; CDC <i>MMWR</i> 61(33) (2012)
    reports six lead-poisoning cases in pregnant women in New York City — blood lead 16–64 µg/dL, from ten
    oral Ayurvedic medications whose lead ran <b>as high as 2.4%</b> by weight, several of which also
    contained mercury or arsenic. Everything here is the <b>historical</b>
```

### 4c. Downstream (not yet written — must not be written with the old figure)

- `pages\rasa.html` lines 63–69: the live callout has no MMWR sentence; when §9.7 is applied, it carries
  **2.4%**.
- `assets\js\core\data\rasa-data.js`: `RASA_TOXICITY` (lines ~36–41) carries no citations at all. If the
  harm note is ever moved into data, it takes the citation strings below. Note §C-1's own rule — a
  harm-flagged record may not carry `mg|kg|%` figures in site-voice fields; these belong in the **quoted**
  MMWR sentence and its `source`/`sourceNote`, which is exactly the carve-out §C-1 §524 allows.

## 5. Citation strings to paste into the data record

```js
source: 'CDC (New York City DOHMH), "Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India — New York City, 2011–2012", MMWR Morb Mortal Wkly Rep 61(33), 24 Aug 2012, 641–646; PMID 22914225.',
sourceNote: 'Article, verbatim: "Lead concentrations of the medications were as high as 2.4%; several medications also contained mercury or arsenic, which also can have adverse health effects." Six cases, all foreign-born pregnant women, ten oral Ayurvedic medications made in India, blood lead 16–64 µg/dL. CORRECTION 2026-07-30: this site previously stated "one product at 1.2% lead by weight" — half the published maximum and unsupported by any source; no variant reading exists, so nothing is flagged contested. cdc.gov returns 403 to automated fetch; text verified against PubMed (PMID 22914225), Europe PMC REST and the 2012 AP wire report.',
```

## 6. Unresolved

- **Per-product lead values.** The article's Table (individual concentrations for each of the 10 medications,
  and the quantified mercury/arsenic levels) sits in the CDC-hosted full text, which is 403 to every
  automated route tried. The **maximum** (2.4%) and the qualitative mercury/arsenic statement are firm from
  four witnesses; any per-product figure must not be encoded until the table is read.
- **Provenance of "1.2%".** No source located anywhere states 1.2% for this report. Treated as an in-repo
  transcription error, but if a prior round drew it from a different paper, that paper has not been found.
