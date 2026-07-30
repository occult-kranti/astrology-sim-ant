# THE RANKING SPEC — five axes over the operative corpus, and the one axis that does not exist

**Round:** R34 (follows the R33 operative-graph build) · **Written:** 2026-07-30 · **Repo tip at writing:** `89e2622`
**Status:** specification. Nothing here is shipped.
**Subordinate to:** `docs/FRAMING.md` v2 as amended 2026-07-30. Where this document and FRAMING disagree, **this document is wrong.**
**Sibling to:** `docs/plans/opgraph/PLAN.md`. The ranking is a **VIEW over the operative graph**, not a second corpus. It mints no nodes, no edges and no claims; every row is keyed by an `OPGRAPH_NODES` id.

**Inputs, all read in full:**
`rank/30-scholarly-census.json` (27 rows) + notes · `rank/31-documented-effects.json` (23 records, 49 citations) + notes ·
`rank/32-discourse-snapshot.json` (34 families) + notes · `rank/33-blind-reaudit.json` (37 sampled claims) + notes.
**Pattern reused rather than reinvented:** `pages/compare.html` + `assets/js/core/data/competitors.js` + `assets/js/app/compare.js` — the dated survey stamp, the per-record capture date, the `?` unverified glyph, the app-layer staleness badge, the pure-core data module.

---

# §1 THE REFUSAL, STATED FIRST

There is **no efficacy axis**. Not hidden, not deferred, not "out of scope for this round" — **it does not exist and no combination of the columns below produces one.** A reader who leaves this page believing that a work at the top of these columns is more powerful than one at the bottom has been failed by the page, and the page is what changes.

## 1.1 The on-page notice — exact text, verbatim, non-negotiable

This renders as the **first child** of the ranked view, before any control and before any table or card, in DOM order (so no prefix-truncated extraction — search index, assistant context, screen-reader linear read, print — can carry a column without it). It is not collapsible, it is not a footer, and it is not a `<details>`.

> **What these columns rank — and the one thing they cannot.** Every column measures a fact about the **record**: how fully a text spells out what it describes, how much modern academic attention it has received, how many other cultures a **named scholar** has documented it reaching, what peer-reviewed research has measured about practices of its kind, and how much the English-language internet currently talks about it. **No column measures whether any of it works.** There is no efficacy axis here and none can be assembled from these numbers. A text at the top of every column has been carefully edited, widely discussed and much studied — it has not thereby been shown to *do* anything. These are historical symbolic systems of **no demonstrated predictive or operative validity**. Where research is recorded, it is research about **people performing practices**, never about a rite reaching its stated aim; and *"no study has been located"* is the commonest answer here and a full finding, not an empty cell. **A high score means the paperwork is thick. It means nothing else.**

*(147 words. It was drafted at 210 and cut twice. Length is a feature: a notice nobody finishes is a notice nobody read. Any future edit that lengthens it must delete something else.)*

## 1.2 The three structural refusals that back the sentence up

The notice is prose, and prose rots. These three make it hold:

1. **No efficacy field can exist.** The schema has no key for it, and `RK-1` (§6) greps every key name in the shipped module against `/effic|potenc|^(effective|effectiveness|works|power|strength|success|score|rating)$/i`. A future round cannot add one quietly; it has to delete a test.
2. **No single blended score, ever, by default** (§3). A documentation metric printed as one number is exactly how it gets read as a power metric. The composite that *is* permitted is user-weighted, transparent, off by default, and excludes the research axis outright.
3. **The canvas encodes none of this.** The operative-graph SVG gets no colour ramp, no size ramp, no rank halo from any of the five axes (§5.4). A visual magnitude reads as force. The ranking lives in a table, where a number is adjacent to the sentence that qualifies it.

## 1.3 What "effects" means here, and its hard boundary

Where a row records effects it records **only documented physiological, psychological or toxicological findings from real peer-reviewed literature**, with their limitations, their null results and their absence stated as plainly as their positive findings. The axis is **about research, not about practices** (`31-documented-effects.json → axisContract`). Three consequences are load-bearing and appear in §2D:

- **The best-studied thing in the corpus carries the most deflating result.** Goyal et al., *JAMA Intern Med* 2014 (PMID 24395196): 47 RCTs, 3,515 participants; anxiety 0.38 (0.12–0.64) at 8 weeks, depression 0.30 (0.00–0.59) — CI touching zero — pain 0.33 (0.03–0.62); and **no evidence that meditation beat any active treatment.** A grade chip that renders without that sentence has told the reader the opposite of the evidence.
- **The separation rule.** Norton & Gino (PMID 23398180) measured grief **in the bereaved**, not the condition of the dead — and the effect appeared in participants who did *not* believe rituals work, which is the tell that it is not evidence for the mechanism. Bernardi (*BMJ* 2001, PMID 11751348) is a finding about **metre**, not mantra: a Latin *Ave Maria* and a Sanskrit mantra produced identical baroreflex gains (9.5 → 11.5 ms/mmHg) because both force ~6 breaths/min, which is why the AHA rates a breathing **device** (Class IIA) above every meditation technique (Class III — *not useful or effective*).
- **`none` is a first-class value in both directions.** Six of 23 records are graded `none`. `none` is *searched and not located*; it is **not** evidence that a rite fails, because nobody has tested the stated aim of a single rite in this site's corpora. Records use *"no study located"*, never *"no study exists"*.

---

# §2 THE FIVE AXES

Common contract, applying to all five:

| property | rule |
|---|---|
| **id / label** | `id` is a stable slug; `label` never contains a word implying quality, standing, importance or power. |
| **source** | Every value carries `source.kind` + provenance (§4.3). A value with no source does not render (`RK-2`). |
| **missing** | Every value may instead carry `missing: <reason>` from a closed enum. **Missing renders differently from low and sorts last in both directions** (§4.4, `RK-3`). |
| **biasNote** | Every axis carries a non-empty `biasNote` containing at least one **measured figure**, rendered in the DOM beside the column header, not in a tooltip and not in a modal (`RK-5`). |
| **highMeans / lowMeans** | Two mandatory strings per axis, both rendered, each saying what the value does **and does not** mean. Neither may be empty. |
| **no colour ramp** | No axis maps its value to hue, saturation or size. Values render as glyph + number + word. |

---

## A · DIRECTNESS — "How fully the text spells it out"

**Measures, in one sentence.** How completely the work itself sets out the procedures it contains, as graded by the operative graph — and, where it does not, *what kind of incompleteness* that is.

**DATA SOURCE.** Derived, in-repo, from `OPGRAPH_NODES` `procedure-claim` op-nodes: `textCompleteness`, `completenessBasis`, `incompletenessKind`, `gradeWithheld`, plus `witnessCompleteness` carried alongside. No external file. Provenance is the claim's own `cite` and the graph's gate row, reached by claim id.

**COMPUTATION.**

```js
const GRADE_ORDINAL = { complete: 4, partial: 3, referenced: 2, fragmentary: 1 };
// unstable-plural, null+gradeWithheld and genre-norm-based grades carry NO ordinal.

function directness(work, claims) {
  if (work.role === 'applied-text')                       // PLAN W3d: grading an output is a category error
    return { value: null, missing: 'not-applicable', note: 'An applied text is a procedure OUTPUT; grading its completeness is a category error the schema forbids.' };

  const counted = claims.filter(c =>
       c.workId === work.id
    && c.textCompleteness != null                          // withheld never counts
    && c.textCompleteness !== 'unstable-plural'            // lateral value, own chip
    && c.completenessBasis !== 'genre-norm');              // strike E3: "the genre usually does this" is not a grade

  const dist = tally(claims, ['complete','partial','referenced','fragmentary','unstable-plural']);
  dist.withheld  = claims.filter(c => c.textCompleteness === null).length;
  dist.genreNorm = claims.filter(c => c.completenessBasis === 'genre-norm').length;

  if (counted.length === 0) return { value: null, missing: reasonFor(dist), dist };

  const best = Math.max(...counted.map(c => GRADE_ORDINAL[c.textCompleteness]));
  return {
    value: best,                                           // 1..4
    atGrade: gradeNameOf(best),
    n: counted.filter(c => GRADE_ORDINAL[c.textCompleteness] === best).length,
    dist,                                                  // ALWAYS rendered; the headline never travels alone
    withholding: uniq(counted.concat(unc(claims))
                   .filter(c => c.textCompleteness !== 'complete')
                   .map(c => c.incompletenessKind).filter(Boolean)).sort(),
    witness: worstWitness(claims),                         // the second chip: what the EDITION IN HAND gives
    claimIds: claims.map(c => c.id),                       // provenance: every contributing claim is clickable
  };
}
```

`value` is **the highest grade attained on any one procedure**, not a mean. A mean over heterogeneous procedures is a fabricated number; the max answers a real question ("does this book ever spell a procedure out in full?") and the **distribution renders in the same cell**, always, so the headline cannot travel alone.

**SCALE.** Four ordinal steps + three non-ordinal values that are displayed and never converted to a number:

| value | glyph (reused from PLAN §5.3) | reads |
|---|---|---|
| 4 · complete | `▰` | the text enumerates and terminates |
| 3 · partial | `▰▱` | some stages named, some not |
| 2 · referenced | `○` | the procedure is named, not set out |
| 1 · fragmentary | `◌` | what survives is broken |
| — · unstable-plural | `≠` | complete **in each recension**, and the recensions disagree |
| — · withheld | `⊘` | **nobody opened the book** — a result, not a gap |
| — · not applicable | `▫` | applied text; grading is a category error |
| hatched overlay | (fill) | grade rests on `genre-norm` — excluded from the headline count |

**KNOWN BIAS, stated on the page.**

> This column reads the **text**, not the repository and not the edition in hand. Three things distort it. **(1) The witness may be redacted where the text is not:** M. P. Pandit's preface to the standard English Kulārṇava states that *"portions relating to rituals, technicalities of special types of japa, etc. have been kept out of the treatment"* — anyone grading the Kulārṇava from Pandit is grading Pandit. Turner 1657 omits the *Ars Notoria*'s *notae* entirely, and the figures **are** the art. Mathers has 242 squares to the German tradition's 251 and most of his are unfilled. **The witness chip beside every value is therefore not decoration; it is the correction.** **(2) A grade whose basis is "the genre usually does this" is not the same claim as a grade built from a slot inventory** — those grades are hatched and excluded from the headline. **(3) 19 of 62 sampled Solomonic rows diverge between text and witness**, with the public-domain witness abridged *precisely at the operative core*.

**THE INVERSION TRAP — the most important sentence in this axis.**

> **An initiation-gated tantra scores LOW on directness precisely because it withholds.** That is a fact about the genre, not a defect of the text and not a deficiency of the tradition. Śrīvidyā, Shingon *shidō kegyō*, the *Dadong zhenjing*'s jade formulae and the officiant's silent *neilian* are `gated`; the *Wuzhen pian* is `constitutive` — allusive regulated verse that was **never going to tell you**, and the proof it is deliberate is the commentarial apparatus it immediately grew, both titled as though supplying what the base text withholds and both still symbolic. A text that withholds by design and a text that was damaged in transmission are **not the same low score**, which is why `incompletenessKind` (`constitutive` · `damaged` · `gated` · `truncated`) is mandatory and renders **in the cell**, never as a tooltip.

Enforcement, so it is not merely written down:

- Any row whose `withholding` includes `gated` or `constitutive` renders a **"withholds by design"** badge with the one-line gloss, and `RK-18` asserts the badge is present in the DOM for every such row.
- The sort control offers **"group withheld-by-design separately"**, which lifts those rows into their own labelled band rather than sorting them to the bottom of a single list.
- The axis copy says, in site voice: *here the razor and the tradition's own restriction point the same direction — the site is not censoring anything the tradition itself publishes.*

**HIGH means / does NOT mean.** High: the text enumerates its own procedure and terminates. It does **not** mean the procedure is better, more authentic, more effective, or safe to attempt; PLAN §8.3 records that even ancient practitioners *adapted* formularies rather than executing them, **so even a "complete" recipe was not a closed algorithm to its own users.**
**LOW means / does NOT mean.** Low: what survives, or what the text chose to say, is less than a full account. It does **not** mean the tradition is thin, the text is unimportant, or something has been lost — for `gated` and `constitutive` rows it means the opposite of loss: the withholding is the design.

---

## B · MODERN ACADEMIC ATTENTION — "How much philology it has attracted"

**Relabelled deliberately.** The brief calls this axis "scholarly weight" and the census's own §5.2 refuses the word *peer-reviewed* for what it measures: attention from one largely Euro-American, largely post-1900, largely secular-philological academy. The Chinese commentarial tradition on the *Cantong qi* (Weng Baoguang, Chen Zhixu, Lu Xixing), Japanese sectarian scholarship at Kōyasan and Taishō, and the Sanskrit commentarial tradition (Kṣemarāja, Rāghavabhaṭṭa) are rigorous cumulative peer-scrutinised bodies of work that this axis registers at **near zero**. Shipping it labelled "peer reviewed" would be a claim the site fails. **Label: "Modern academic attention."**

**Measures, in one sentence.** How much modern critical-editorial and academic-philological work a corpus has attracted — dominated by whether a critical edition exists, not by how many papers mention it.

**DATA SOURCE.** `research/rank/30-scholarly-census.json` → `rows[]`: `weightBand` (0–5), `criticalEdition{status, editions[]}`, `counts[{query, count, sampled, note}]`, `countVerdict`, `namedScholars[]`, `researchProgramme`, `exemplarCitations[].verified`. Compiled 2026-07-30. Counting method: OpenAlex `title_and_abstract.search` with a **quoted phrase**, `meta.count` read from a URL anyone can re-run.

**COMPUTATION.** The band is **not recomputed**. It is a compiler's ordinal derived from `criticalEdition` (dominant) + `researchProgramme` + `namedScholars`, and the spec's job is to make that judgement **auditable rather than arithmetic**:

```js
// 1 · The value is the filed band, immutable.
attention.band = censusRow.weightBand;              // 0..5, ordinal, NOT interval
attention.bandAsFiled = censusRow.weightBand;       // never overwritten by a later round

// 2 · The band is CHECKED, not derived. Two monotonicity invariants (RK-9):
assert(censusRow.criticalEdition.status !== 'none' || censusRow.weightBand <= 2);
assert(!fundedNamedProgramme(censusRow)            || censusRow.weightBand >= 3);
assert(censusRow.weightBand >= 0 && censusRow.weightBand <= 5);

// 3 · Counts are DISPLAY-ONLY and are NEVER a sort key, NEVER summed, NEVER averaged.
attention.counts = censusRow.counts.map(c => ({
  query: c.query,                                   // the literal probe string, so a reader can re-run it
  count: c.sampled ? c.count : null,                // unsampled → renders '?' (compare.html glyph), never a bare integer
  sampled: c.sampled,
  contaminationNote: c.note ?? null,                // MANDATORY where sampled === false or the verdict is VOID (RK-10)
  floorNotEstimate: true,                           // every count is a FLOOR
}));
```

**Sort key: `band`, ties broken by `criticalEditionRank` (`critical-edition-modern` > `semi-critical` > `vulgate` > `none`), then by `nodeId`. Counts are never a tiebreak.**

**SCALE.** 0–5, ordinal and **not interval — band 4 is not twice band 2** (census `weightBandScale.type`). Rendered as the integer plus its one-line band name, no colour.

| band | name |
|---|---|
| 5 | A century or more of philology; multiple critical editions across languages; a funded programme or standing chair; a subfield with its own conferences |
| 4 | A modern critical edition from an academic press plus an identifiable school of named scholars |
| 3 | Either one critical edition **or** a substantial monograph literature — not both |
| 2 | No critical edition; the circulating text is a vulgate, lithograph or Victorian translation |
| 1 | Essentially none; editing by practitioners or trade presses |
| 0 | No scholarship located |

**KNOWN BIAS, stated on the page** (every figure below is a measured probe, not an assertion):

> **English-only searching demotes exactly the corpora whose primary scholarship is not in English, and the demotion is an artefact of the instrument.** Measured: Japanese 密教 **1602** against English "Shingon" **731** (2.2×); Chinese 内丹 **282** against romanised "neidan" **144** (2.0×); German *Zauberpapyri* **52** as an extra third on top of "Greek magical papyri" **153**. For at least six corpora here the primary scholarship is in another language — Picatrix (Ritter 1933 Arabic; Ritter–Plessner 1962 German), *Sefer ha-Razim* (Rebiger & Schäfer 2009, German), Hekhalot (Schäfer's *Synopse*, German), *Ars notoria* (Véronèse, French), al-Būnī (Coulon, French), *Baopuzi* (Wang Ming, Chinese). **Diacritics produce false zeroes:** "Saradatilaka" returns **0**; "Śāradātilaka" returns **8**. **Reprints count as scholarship:** "Key of Solomon" returns **48**, and a sample of the first five results is **five reprints of the primary text and zero studies**. **Homonyms can be the entire count:** "Heptameron" returns **283**, and it is Marguerite de Navarre — that figure is marked VOID and never renders bare. **Every count is a floor, not an estimate**: OpenAlex misses non-DOI monographs, pre-1970 philology (the era of exactly the German and French work above), small learned presses and regional journals. And the axis measures **one academy**: the Chinese, Japanese and Sanskrit commentarial traditions register here at close to zero.

**The standing warning row, rendered adjacent to this column's header whenever the column is sorted:**

> *Niśvāsatattvasaṃhitā* — OpenAlex count **1–3**, band **5**: a 2015 critical edition by Goodall, Sanderson and Isaacson, from an ANR/DFG-funded Early Tantra project, published by IFP/EFEO/Hamburg. *Key of Solomon* — count **48**, band **2**, no critical edition of any kind. **Ranking by count places the two worst-edited texts above the two best-edited.** That is why the band is driven by the critical edition and counts are display-only.

**HIGH means / does NOT mean.** High: a lot of people with manuscripts and apparatus have read this carefully. It does **not** mean the text is truer, more powerful, more canonical, or more likely to do anything, and it is not corroboration of any effect (`hardLine.forbiddenJoins` bans joining this band to any efficacy, potency or "start here for practice" surface).
**LOW means / does NOT mean.** Low: the field has not chosen to edit it. That is a fact about **the field's choices**, not about the genre — the *Ars notoria* and the *Liber iuratus*, obscure siblings in the very same Solomonic corpus, have excellent modern critical editions (Véronèse, SISMEL 2007; Hedegård, Almqvist & Wiksell 2002) while their famous siblings have none. It does **not** mean the text is unimportant, unread, or worse.

---

## C · DOCUMENTED CROSS-CULTURAL REACH — "How far a cited scholar has traced it"

**Measures, in one sentence.** How many other cultures this work is connected to by a **relation-claim that a named scholar published**, counted at one hop and never inferred from resemblance.

**DATA SOURCE.** Derived, in-repo, from `OPGRAPH_NODES` `relation-claim` op-nodes and `BELONGS_TO` culture edges. No external file. Every contributing claim carries `bestCitation` and (per FRAMING §2.4) an attribution: **where no scholar has made the comparison, there is no edge and there is nothing to count.**

**COMPUTATION.**

```js
const RANKABLE_RELATIONS = new Set(['TRANSMITS_TO', 'PARALLELS', 'COMMENTS_ON']);
// FOUND_WITH is codicological co-presence, not transmission.
// NON_EDGE is an asserted NEGATION.
// RECONSTRUCTED_THROUGH runs modern-scholarship → later-witness and is excluded from the DAG (PLAN D7).

function spread(work, relClaims, nodes) {
  const home = new Set(work.cultureIds);
  const contributing = relClaims.filter(r =>
       RANKABLE_RELATIONS.has(r.relation)
    && (r.fromId === work.id || r.toId === work.id)
    && r.asserted === true                        // asserted:false NEVER counts — it renders struck in the cell
    && r.label !== 'debunked'                     // debunked is LISTED in the cell, counted at zero
    && String(r.bestCitation || '').trim() !== ''  // no citation, no edge
  );

  const reached = new Set();
  for (const r of contributing) {
    const otherId = r.fromId === work.id ? r.toId : r.fromId;
    for (const c of (nodes.get(otherId)?.cultureIds ?? [])) if (!home.has(c)) reached.add(c);
  }

  return {
    value: reached.size,                                        // integer >= 0. ZERO IS A REAL VALUE.
    cultureIds: [...reached].sort(),
    procedureLevel: contributing.filter(r => r.procedureLevel === true).length,   // the Mallinson standard
    disputed:      contributing.filter(r => r.label === 'disputed').length,
    debunked:      relClaims.filter(r => r.label === 'debunked' && touches(r, work)),   // shown, never counted
    struck:        relClaims.filter(r => r.asserted === false && touches(r, work)),     // shown struck, with notAssertedReason
    nonEdges:      relClaims.filter(r => r.relation === 'NON_EDGE' && touches(r, work)),// "recorded as NOT related, and here is who confused them"
    claimIds:      contributing.map(r => r.id),
  };
}
```

**Only documented edges, never resemblance — enforced four ways, not asserted once.**

1. `bestCitation` non-empty is a **filter condition inside the count**, not a display nicety (`RK-12`).
2. `asserted === false` claims contribute **zero** and render **struck with `notAssertedReason` on the face** — never hidden, because hiding them is how a struck edge becomes an unstruck one.
3. `NON_EDGE` contributes zero and renders as a positive statement in the cell: *"recorded as NOT related: [pair] — confused by [who], [citation]."* A graph with no way to say "these are not related" regrows the error every pass.
4. **A second number, always beside the first:** `procedureLevel` — how many of those claims name the propagated *procedure* rather than asserting book-level influence. The repo contains exactly **one** such claim today (`amṛtasiddhi → dattātreyayogaśāstra`, Mallinson 2020, naming mahāmudrā / mahābandha / mahāvedha). A high spread built entirely of work-level influence edges is a weaker claim than a spread of two procedure-level ones, and the cell shows which it is.

**SCALE.** Integer ≥ 0 (distinct foreign cultures reached at one hop), plus the four adjacent counts above. **0 is a value, not a missing.** Rendered: `3 cultures · 1 procedure-level · 1 disputed`.

**KNOWN BIAS, stated on the page.**

> This column measures **which comparisons scholars have published and this graph has admitted** — not which connections exist. It has three shapes of blindness. **(1) The graph's culture coverage is uneven and its silence is not evidence of absence:** it carries no Mesoamerican, Sub-Saharan African, Mesopotamian, Greco-Roman mystery-cult, Shintō/Shugendō, Korean, Vietnamese, Zoroastrian, Mandaean, Slavic or Baltic material — and it computes geomancy while never naming the ʿilm al-raml → Ifá question. A **0** here very often means *nobody has written the paper*, and sometimes means *nobody in this graph's reach has*. **(2) It correlates with the column beside it:** heavily edited corpora attract more published comparisons, so a high reach is partly a restatement of high academic attention. The page prints that correlation rather than hiding it (§3.3). **(3) One hop only.** Chains are walkable on the graph; they are not summed into this number, because a chain of three is one scholar's claim built on another's and summing them would manufacture confidence nobody published.

**HIGH means / does NOT mean.** High: many published, cited claims connect this work across cultural lines. It does **not** mean the work is more influential in fact, more original, more ancient, or more effective — FRAMING §1.1: *a rite attested in four corpora across nine centuries is a well-attested rite and nothing more; frequency of attestation is evidence about transmission, never about efficacy.*
**LOW means / does NOT mean.** Low or zero: no scholar in this graph's reach has published a documented connection. It does **not** mean the work is isolated, derivative-free, or unimportant — and it explicitly does not license the site to supply the missing edge (FRAMING §2.4: *where no scholar has made the comparison, there is no row*).

---

## D · WHAT HAS BEEN STUDIED — "the peer-reviewed record, including its absence"

**Measures, in one sentence.** How much peer-reviewed **outcome research** exists on practices of this kind, and how methodologically strong it is — never whether the practice benefits anyone and never whether a rite attains its stated aim.

**DATA SOURCE.** `research/rank/31-documented-effects.json` → `records[]` (23) and `citations{}` (49). Join to the graph is **explicit and hand-written** in `research/rank/join.json` (§4.2): a work's `procedure-type` terms and `siteWings` map to zero or one effects record, each mapping carrying a `basis` sentence. A work with no mapping renders **`no-record`** — *"not studied as a practice-type in this survey"* — never a zero and never a blank.

**COMPUTATION — and the axis's defining refusal.**

```js
// THERE IS NO ORDINAL. This axis is NOT SORTABLE (RK-7).
// It is FILTERABLE and GROUPABLE only. `compareBy('studied', …)` throws.
// Reason, printed in the UI next to the disabled control:
//   "Ordering this column would rebuild the efficacy ranking this page exists to refuse.
//    A research-volume grade sorted into a league table reads as a benefit ranking within one screenful."

studied = {
  recordId,                                   // resolves into 31-documented-effects.json (RK-11)
  grade:      record.evidenceGrade,           // sr-meta | sr-single | rct-few | lab-physiology
                                              // | observational | case-reports | toxicology-adjacent | none
  harmGrade:  record.harmEvidenceGrade,       // SAME scale, SEPARATE value — they diverge, and the divergence is the finding
  keyNullFinding:  record.keyNullFinding,     // renders BEFORE the grade chip in DOM order
  separationNote:  record.separationNote,     // mandatory; 23 of 23 have one; renders BEFORE the grade chip
  strongestCritique: record.strongestCritique,
  documentedHarms: record.documentedHarms,    // renders IN THE SAME CELL as any positive finding
  absenceOfEvidence: record.absenceOfEvidence,// what has NOT been studied — full-weight text
  measuredValues:  record.measuredValues,     // numbers with units live ONLY here, as data chips
  provenanceWarning: record.provenanceWarning ?? null,   // never dropped (RK-13)
  retrievalPending: bool,                     // suppresses the NUMBER and prints why (see §7.4)
  citations: record.citations,
  joinBasis: joinRow.basis,                   // why this work maps to this practice-type
};
```

**SCALE.** Eight named grades, ordinal **on volume and rigour only** — explicitly not ordinal on benefit, on effect size, or on anything a tradition claims:

`sr-meta` › `sr-single` › `rct-few` › `lab-physiology` › `observational` › `case-reports` › `toxicology-adjacent` › `none`

`toxicology-adjacent` is a grade the compiling slice had to invent and it earns its place: real, strong literature about the **material or the surgery in general clinical use**, and none about the practice. Khecarī is the sharp case — the frenulum evidence is entirely clinical frenectomy for ankyloglossia (PMID 31255827: haemorrhage from submental and sublingual arteries, Wharton's-duct obstruction, lingual-nerve injury, deep-space infection) performed **once, under anaesthesia, with haemostasis and follow-up**. The practice is a repeated incision with none of that, so **the clinical rates do not transfer and would understate.**

**THE RENDERING RULES, adopted verbatim as build requirements** (source: `31-documented-effects-notes.md` §6; each is an engine assertion in §6):

1. **Do not sort or colour-rank by grade.** Filter and group only.
2. **No grade chip renders without `keyNullFinding` and `separationNote` adjacent, and BEFORE it in DOM order** — the same structural move FRAMING §5 A-5 makes for harm notes inside `figure.quoted-primary`, so a prefix-truncated extraction cannot carry the grade without the qualifier.
3. **The adverse-effects record renders in the same cell as any positive finding.** Not a tab, not a disclosure, not a second column: `harmGrade` + `documentedHarms` sit beside `grade`. Meditation is `sr-meta` for benefit and `observational` for harm, and Farias et al. (*Acta Psychiatr Scand* 2020, doi 10.1111/acps.13225) put a number on why: pooled adverse-event prevalence **8.3%**, but **3.7% in experimental studies against 33.2% in observational ones** — a ninefold gap produced by trials that do not ask.
4. **`provenanceWarning` is never dropped.** Three harm entries are journalistic, coroner or court records; stripping the warning converts a press count into a study finding.
5. **Do not size cards by content length.** Practice-types with literature produced long records; the six `none` records are short **and are findings**. They render at full weight or the interface teaches the opposite of what the axis says.
6. **Never place this column visually adjacent to an attestation-frequency measure without a separator.** Column order is therefore fixed: `work · directness · attention · spread ‖ studied · discourse`, with a rendered separator at `‖` (`RK-14`). Collocating a transmission count with a research grade invites exactly the inference both forbid.
7. **Quote nothing from Mallinson (2007)** — `cite-only` under FRAMING §4.4. The khecarī evidence cites and page-references it and reproduces nothing.
8. **"Perceived" never comes off "perceived efficacy."** Legare & Souza (*Cognition* 2012; n=162 Brazil + 68 US) is the most useful and most anti-efficacy result available: repetition, procedural step count and specificity of detail raise **perceived** efficacy — exactly the features this site's corpora are dense in. It is the best explanation of why elaborate rites *feel* like they work in the total absence of their working, and it is the one place the word "efficacy" is permitted on the page (`RK-6` allowlist, and only in that bigram).

**KNOWN BIAS, stated on the page.**

> One research pass, one compiler, search-and-fetch over PubMed/PMC/publisher pages — **not a systematic review**: no protocol, no second screener, no PRISMA flow. **Anglophone and PubMed-biased**: non-English clinical literature, Indian AYUSH-indexed journals and Chinese-language TCM literature are essentially absent, which cuts hardest on rasaśāstra, where BAMS-syllabus research on *śodhana* and *māraṇa* exists in venues this search did not reach — **its absence here is not evidence of its non-existence.** Two of the six `none` grades are backed by a **stored null-search query and date**, so "no study located" is auditable; the other four rest on the absence of results across the searches that were run, which is weak evidence and is phrased accordingly. No effect size was recomputed; all are as the source reported them.

**HIGH means / does NOT mean.** A high grade means a practice-type **has been studied a lot**. It does **not** mean it works, that it benefits anyone, or that it does what its tradition claims — the best-studied record in the file has as its strongest finding that meditation programmes were **no better than any active treatment**, and the AHA grades all meditation other than TM **Class III / LOE C**, where Class III means *not useful or effective*.
**LOW / `none` means / does NOT mean.** `none` means **searched and not located**. It is **not** evidence that a rite fails, because nobody has tested the stated aim. It is not a demerit, not a gap, and not an invitation for a later round to fill it in.

---

## E · ONLINE DISCUSSED — "how much the anglophone internet currently talks about it"

**Measures, in one sentence.** How many people looked this up on English Wikipedia in a stated twelve-month window, on a stated capture date, by a method anyone can re-run — and nothing else.

**DATA SOURCE.** `research/rank/32-discourse-snapshot.json` → `families[]` (34). **Component A** — Wikipedia pageviews, `en.wikipedia / all-access / agent=user` (spiders and bots excluded by the API's own filter), window **2025-07-01 → 2026-06-30**, captured **2026-07-30**, endpoint URL stored per record. **Component B** — subreddit membership, a **third-party estimate** (Reddit's `/about.json` is closed to unauthenticated clients; both `www` and `old` tested on the capture date). **Component C** — named popular artefacts, **illustrative only**.

**COMPUTATION.**

```js
// Tier is derived from COMPONENT A ALONE, by the published threshold rule.
// Merging B into it would launder a coverage gap into an apparent fact.
const TIER = v =>
  v === 0      ? 'absent'      :   // no English Wikipedia article — A FINDING, ordinal 0
  v <  5000    ? 'marginal'    :
  v <  60000   ? 'specialist'  :
  v <  300000  ? 'broad'       :
                 'mass';
const TIER_ORDINAL = { absent: 0, marginal: 1, specialist: 2, broad: 3, mass: 4 };

discourse = {
  familyId,                                   // resolves (RK-11)
  tier:        family.tier,                   // sort key
  anchor:      family.anchor,                 // { article, views12mo, absent }
  corpusAnchor: family.corpusAnchor ?? null,  // { article, views12mo, absent } — RENDERS TOO, NEVER COLLAPSED (RK-17)
  corpusTier:  family.corpusTier ?? null,
  otherArticles: family.otherArticles,        // each listed; sums shown AS sums, never silently merged
  reddit:      family.reddit,                 // beside, uncombined; verified:false → '?' glyph, never 0
  trend:       family.trend,                  // separate from tier: canonical status makes readers, live practice makes forums
  flags:       family.flags,                  // rendered BESIDE the number; a flagged number never renders bare
  popularPresence: family.popularPresence,    // NEVER sortable; carries its illustrative-only caveat
  capturedAt:  '2026-07-30',
  surveyStamp: '2026-07',                     // page-level, via data-survey-stamp — compare.html's two-level stamp
};
```

**Staleness badge — computed in the app layer, never in the data module**, exactly as `competitors.js` delegates to `app/compare.js`. One refinement: the pure core exports the function and the **app supplies the clock**, so `core/` keeps its no-`Date` rule:

```js
// core/rank.js — PURE, takes the clock as an argument, testable at fixed dates
export function stalenessClass(capturedAtISO, nowMs) {
  const m = monthsBetween(capturedAtISO, nowMs);
  if (m == null) return { cls: 'plain', months: null, text: 'capture date unreadable' };
  if (m >= 24)   return { cls: 'bad',   months: m, text: `captured ${m} months ago — re-survey overdue` };
  if (m >= 12)   return { cls: 'warn',  months: m, text: `captured ${m} months ago — may be stale` };
  return { cls: 'plain', months: m, text: m <= 0 ? 'captured this month' : `captured ${m} month${m === 1 ? '' : 's'} ago` };
}
// app/opgraph.js calls stalenessClass(row.axes.discourse.capturedAt, Date.now())
```

**SCALE.** Five named tiers, ordinal 0–4. **`absent` is a value, not a missing** — it renders as the positive statement **"No English Wikipedia article"** and sorts at 0. A tracker gap renders `?` (compare.html's glyph), never 0 and never a blank.

**KNOWN BIAS, stated on the page — labelled popularity, not validity.**

> **This is a reception metric. It measures the internet, not the material, and it tracks accessibility, recency and English-language popularity — never importance.** The worked example is the finding: the Solomonic entry points (Lesser Key of Solomon 44,922 + Ars Goetia 97,817 + Goetia 204,403) draw **347,142** annual lookups; the **Śāradātilaka and the Mantra Mahodadhi have no English Wikipedia article at all** (verified 2026-07-30, `action=query` returns *missing*). **The ratio is not large — it is undefined, because the denominator is zero.** Five further distortions, all measured: **celebrity over doctrine** (Crowley 1,513,619 vs *The Book of the Law* 110,062 = 13.8:1); **author over work** (Manly P. Hall 136,597 vs *The Secret Teachings of All Ages* 5,991 = 22.8:1); **practice over originator** (sigil discourse 217,312 vs Austin Osman Spare 78,399 = 2.8:1); **popular parent over technical corpus** (Ayurveda 459,412 vs rasaśāstra 873 = 526:1); **language of origin** (Western "Alchemy" 656,769 vs the *Cantong qi*, the foundational text of Chinese alchemy, 5,068 = 130:1 for the same subject). And the control: **manifestation / Law of Attraction draws 941,736 annual lookups and ~621k subreddit members on material with no historical corpus at all** — outranking the Picatrix, Agrippa, the Lemegeton, the *Cantong qi* and the entire Sanskrit ritual literature **combined** (166,839). It has no wing on this site and it is in the data on purpose. **Anchor selection is a judgement, not a measurement, and it decides tiers**: "Runes" (422,589) is the article about the Germanic *writing system*, so the family was re-anchored to "Runic magic" (44,724), costing 377,865 views and a full tier — recorded in-record so it can be overruled. **Tiers are buckets with hard edges**: 59,999 and 60,001 are indistinguishable in reality and land in different tiers here. **Pageviews count lookups**, not interest, engagement or belief; a person checking a word in a novel counts the same as a scholar. **English Wikipedia and anglophone Reddit only** — jyotiṣa's real discourse is in Hindi, Tamil, Telugu and Sanskrit on platforms not measured here, and **no correction factor was applied because there is no honest one.**

**The uncomfortable line the page prints about itself, because leaving it out would be the dishonest choice:**

> Horary astrology — the system this site is built on — draws **17,220** annual lookups, about 1/26th of "Astrology". Khecarī mudrā draws **351/year**, under one lookup a day. Rasaśāstra draws **873/year**. The *Book of Abramelin* draws **546/year**. The practices this site handles with its heaviest harm apparatus are among the least-discussed things in the survey. **That ordering is a coincidence of accessibility, not a safety finding. Low discourse volume is not safety and high volume is not risk.**

**HIGH means / does NOT mean.** High: many people looked it up in English in a twelve-month window ending 2026-06-30. It does **not** mean the material is more valid, more important, more authentic or better attested — a mass number is not a credential.
**LOW / `absent` means / does NOT mean.** Low or absent: the anglophone internet has not written this down, which is **a fact about the anglophone internet**. It does not mean the corpus is minor, dead, or debunked — a marginal number is not a debunking.

---

# §3 THE COMBINED VIEW — five columns, no composite

## 3.1 The decision, and the argument for it

> **There is no default combined score. The five axes are sortable columns and multi-axis filters, never one blended number.**

Five reasons, in order of weight:

1. **A single number is a claim of commensurability, and these quantities are not commensurable.** A critical edition and a subreddit are not units of the same thing. Averaging band 5 with tier 1 produces a number whose units are nothing.
2. **A single number is exactly how a documentation metric gets misread as a power metric.** A reader who sees `Niśvāsatattvasaṃhitā — 3.4` and `Key of Solomon — 3.1` will supply the missing predicate, and the predicate they supply is *better*. Every one of the five axes is explicitly not that, and the page's whole argument is that there is no *better* here. A ranked list with a single score is a page that fights its own notice — and the notice loses, because the number is nearer the eye.
3. **The measured anti-correlations are the findings, and averaging destroys them.** The *Key of Solomon* sits high on discourse and low on academic attention; the *Niśvāsatattvasaṃhitā* is the exact inverse. **A mean puts them next to each other and erases the single most important result in the census.** Same for Ayurveda vs rasaśāstra (526:1 on discourse, comparable on academic attention) and for the Heptameron (band 1, count 283, and the count is Marguerite de Navarre).
4. **A composite hides missingness.** Averaging four present axes and one absent one silently imputes a value for the absent one — which is precisely the "empty cell filled from a parallel" failure FRAMING §5 A-2 calls simultaneously the worst accuracy failure and the worst safety failure available to this kind of work.
5. **This repo has already refused this once and was right.** `pages/compare.html` surveys ~30 products and ships **no overall product score** — only a per-cell matrix of `● ◐ ○ ?` where every cell is a checkable fact. That is the precedent, and this page reuses it rather than relitigating it.

## 3.2 What ships instead

**Sortable columns.** Exactly four sort keys, each a total, deterministic, stable order:

| column | sortable | key | tiebreak |
|---|---|---|---|
| Directness | ✅ | `GRADE_ORDINAL` 1–4 | count at that grade, then `nodeId` |
| Modern academic attention | ✅ | `band` 0–5 | `criticalEditionRank`, then `nodeId` |
| Documented cross-cultural reach | ✅ | `cultures` (integer) | `procedureLevel`, then `nodeId` |
| **What has been studied** | ❌ **never** | — | — (`compareBy('studied')` throws; `RK-7`) |
| Online discussed | ✅ | `TIER_ORDINAL` 0–4 | `anchor.views12mo`, then `nodeId` |

**Multi-axis filtering** — the honest substitute for a composite, because it answers the question a composite pretends to answer without inventing a scalar:

- `directness ∈ {complete, partial, referenced, fragmentary, unstable-plural, withheld}` · `withholding ∈ {constitutive, damaged, gated, truncated}` · `basis ≠ genre-norm` toggle
- `attention.band ≥ n` · `criticalEdition.status ∈ {…}` · `hasFundedProgramme`
- `spread.cultures ≥ n` · `procedureLevel ≥ 1` · `hasNonEdge`
- `studied.grade ∈ {…}` · `studied.harmGrade ∈ {…}` · `hasDocumentedHarms` · **`grade = none`** (a first-class filter, because "what has nobody studied?" is a real question)
- `discourse.tier ∈ {…}` · `absent` · `flags ∈ {reception-not-text, homonym-diluted}`

Filters serialise to the URL hash, so a view is linkable, reproducible and reportable. **Inherited constraint, non-negotiable:** FRAMING §5 A-1 — *facets are `corpus`, `date`, `language` and `scholar`; never `purpose`, `act` or `aim`*, and **no filter combination may narrow the view to a single act or purpose across corpora.** The five axes above are all record-metadata facets and none of them is a purpose index; a future round that adds a `purpose` facet here has rebuilt the thing §7.5 promises never to build.

**Group-by** (not sort): `by culture` · `by procedure-type family` · `by withheld-by-design` · `by studied grade`. Grouping preserves the honest thing sorting destroys — it puts a band around the rows instead of implying a line through them.

## 3.3 The correlation panel — the thing a composite would hide, printed instead

A fixed panel above the table, four rows, each a measured pair from the inputs, with the one-line reading:

| pair | reading |
|---|---|
| discourse 347,142 vs discourse **absent** (Solomonic entry points vs Śāradātilaka + Mantra Mahodadhi) | the ratio is **undefined**; it measures access, not either text |
| attention band **5**, count **1–3** (Niśvāsa) vs band **2**, count **48** (Key of Solomon, five reprints) | **fame and philology are uncorrelated and sometimes anti-correlated** |
| attention band **1**, count **283** (Heptameron) | the count is a French Renaissance novella; VOID, never rendered bare |
| spread vs attention across all rows (printed as the actual Spearman ρ, computed by the generator, with n) | reach partly restates attention; **the number is printed so the reader can discount it** |

## 3.4 If a composite is wanted anyway — the five conditions

A user-weighted index is permitted. It is not the default, it is not named a score, and it obeys all five:

1. **Off by default.** `weights: null` in the initial state (`RK-8`). No preset, no "recommended weighting", no "balanced" button — a preset is the site's ranking wearing the user's clothes.
2. **User-set, and every weight is explicit.** Four sliders (directness · attention · spread · discourse). Setting none leaves it off.
3. **Transparent.** The formula renders above the column, and each row shows its **per-axis contribution**, not only the total: `0.30×4 + 0.25×5 + 0.20×3 + 0.25×2 = 3.55`. A number whose parts are not visible is not transparent because it says it is.
4. **Missing is never imputed.** A row missing any weighted axis is **excluded and counted**: *"14 of 103 rows cannot be indexed under your weighting — 9 not surveyed, 3 grade withheld, 2 not applicable."* Never zero-filled, never mean-filled.
5. **`studied` cannot be weighted at all.** There is no slider for it. Folding a research-volume grade into a composite is the efficacy inference performed with arithmetic, which is the one thing this whole document exists to prevent (`RK-8`).

Naming: the control is **"your weighting"**; the column header is **"your weighting"**; the URL hash carries the weights so a shared link displays them as the reader's, never the site's. The words *score*, *rank*, *rating*, *top* and *best* appear nowhere in it (`RK-6`).

---

# §4 THE DATA MODEL

## 4.1 Where things live

| path | kind | responsibility |
|---|---|---|
| `research/rank/30-scholarly-census.json` + `-notes.md` | **input, tracked** | relocated verbatim from the compiling scratchpad |
| `research/rank/31-documented-effects.json` + `-notes.md` | **input, tracked** | " |
| `research/rank/32-discourse-snapshot.json` + `-notes.md` | **input, tracked** | " (plus `wiki-pv.sh`, `gs.sh` and the raw TSVs — the capture scripts ship, so the numbers are re-runnable) |
| `research/rank/33-blind-reaudit.json` + `-notes.md` | **input, tracked** | the accuracy substrate (§7) |
| `research/rank/join.json` | **input, tracked, hand-written** | the total join table (§4.2) |
| `scripts/gen-rank.mjs` | script | the artery: reads the five inputs + `opgraph.js`, emits the module, prints the diff, `--check` mode |
| `assets/js/core/data/rank-axes.js` | **GENERATED** | `RANK_META`, `RANK_ROWS`, `RANK_AXES`, `RANK_SCALES`, `RANK_JOIN_SUMMARY` |
| `assets/js/core/rank.js` | pure engine | `rankModel`, `axisValue`, `compareBy`, `stalenessClass`, `combinedIndex`, `rankStats` — no DOM, no `Date`, no randomness |
| `assets/js/app/opgraph.js` | app (edited) | the ranked table view; the only DOM |

Inputs are **never** runtime data — the same convention as PLAN §7.1. The generator is idempotent, byte-stable, `node:path`-only and exits non-zero on any failure.

## 4.2 `join.json` — the total, hand-written join

The four surveys were compiled against **practice-types, corpora and reception families**, and the graph is keyed by **works**. The mapping is a research act, not a build act, so it is written by hand, is total, and the generator fails on an unmapped id.

```jsonc
{ "nodeId": "tan:saradatilaka",
  "censusRowId":       "saradatilaka",
  "effectsRecordId":   null,
  "effectsMissing":    "no-record",
  "effectsBasis":      "No effects record covers Sanskrit ritual compendia as a practice-type; the nearest records (mantra-chanting, ritual-as-behaviour) are about acts this work parameterises rather than performs, and mapping them here would attribute a literature to a text it is not about.",
  "discourseFamilyId": "tantra-ritual-manuals",
  "discourseBasis":    "The family's corpusAnchor IS this work; both anchor and corpusAnchor render.",
  "confidence": "high" }
```

Every non-null mapping carries a `basis` sentence. Every null carries a `missing` reason **and** a basis sentence saying why the nearest candidate was refused. **A join with no basis does not ship** — an unexplained mapping is how a clinical literature silently becomes a claim about a text.

## 4.3 The row schema

```jsonc
{
  "nodeId": "tan:saradatilaka",            // resolves into OPGRAPH_NODES (RK-11). THE RANKING MINTS NO SUBJECTS.
  "label":  "Śāradātilaka",
  "atlasSlug": null,                        // carried through for the cross-link only

  "axes": {
    "directness": {
      "value": 3, "atGrade": "partial", "n": 2,
      "dist": { "complete": 0, "partial": 2, "referenced": 4, "fragmentary": 0,
                "unstable-plural": 0, "withheld": 0, "genreNorm": 1 },
      "withholding": ["constitutive"],
      "witness": { "grade": "partial", "note": "…" },
      "source": { "kind": "derived", "from": "opgraph", "claimIds": ["…"], "capturedAt": null },
      "cite": null                          // provenance is each claim's own cite, reached by claimId
    },

    "attention": {
      "band": 3, "bandAsFiled": 3,
      "criticalEdition": { "status": "semi-critical", "editions": [ /* … */ ] },
      "counts": [ { "query": "\"Saradatilaka\"",  "count": 0, "sampled": true,
                    "contaminationNote": "ASCII probe; a false zero — see the diacritic pair." },
                  { "query": "\"Śāradātilaka\"", "count": 8, "sampled": true, "contaminationNote": null } ],
      "diacriticPair": true,                // both render side by side; NEVER summed (the sets are not nested)
      "programme": null, "namedScholars": ["…"],
      "source": { "kind": "census", "file": "research/rank/30-scholarly-census.json",
                  "rowId": "saradatilaka", "compiled": "2026-07-30" },
      "cite": "Bühnemann, BSOAS 74.2 (2011), 205–235, doi S0041977X11000036",
      "verified": "web-2026-07-30"          // 'web-2026-07-30' | 'unverified-this-pass' | 'derived'
    },

    "spread": {
      "value": 2, "cultureIds": ["culture:…","culture:…"],
      "procedureLevel": 0, "disputed": 1,
      "debunked": [], "struck": [], "nonEdges": [],
      "source": { "kind": "derived", "from": "opgraph", "claimIds": ["…"], "capturedAt": null }
    },

    "studied": {
      "value": null, "missing": "no-record",
      "note": "Not studied as a practice-type in this survey.",
      "joinBasis": "…",                     // mandatory even when null (§4.2)
      "source": { "kind": "effects", "file": "research/rank/31-documented-effects.json",
                  "recordId": null, "compiledOn": "2026-07-30" }
    },

    "discourse": {
      "tier": "mass",
      "anchor":       { "article": "Tantra",        "views12mo": 364228, "absent": false },
      "corpusAnchor": { "article": "Sharadatilaka", "views12mo": null,   "absent": true,
                        "verifiedAt": "2026-07-30", "method": "en.wikipedia action=query returned 'missing'" },
      "corpusTier": "absent",
      "otherArticles": [ /* each listed; sums shown AS sums */ ],
      "reddit": [ { "sub": "Tantra", "members": "34k", "verified": true, "note": "substantially a neotantra community" } ],
      "trend": "live-trend",
      "flags": ["reception-not-text"],
      "popularPresence": [ /* illustrative only; never sortable */ ],
      "source": { "kind": "discourse", "file": "research/rank/32-discourse-snapshot.json",
                  "familyId": "tantra-ritual-manuals",
                  "endpoint": "https://wikimedia.org/api/rest_v1/metrics/pageviews/…" },
      "capturedAt": "2026-07-30", "surveyStamp": "2026-07",
      "window": { "from": "2025-07-01", "to": "2026-06-30", "months": 12 }
    }
  },

  "corpusAccuracy": { /* §7.3 — the substrate's audited accuracy, page-level, not per-row */ }
}
```

**Per-value citation + capture-date rule, asserted (`RK-2`):**

- Every axis value object has **either** a `value`/`tier`/`band` **or** a `missing` reason. **Never both, never neither.**
- Every axis value object has `source.kind ∈ {derived, census, effects, discourse}`.
- `kind: 'derived'` values carry `from: 'opgraph'` + a non-empty `claimIds[]` and `capturedAt: null` — traceable to the graph's own per-claim citations, which are themselves gate-checked.
- All other kinds carry a resolving id into their source file **and** an ISO `capturedAt`/`compiled` date not in the future.
- `verified` records what was actually seen: `web-2026-07-30` (confirmed against a source retrieved in the compiling pass), `unverified-this-pass` (asserted from compiler knowledge — **renders with a `?` marker and is counted by a ratchet assertion**), or `derived`.

## 4.4 MISSING — the enum, and how it renders

**Absence and a low score are different things and they must look different.** A missing value is never `0`, never `—`, never blank, and never sorts to the top of an ascending sort.

| `missing` | glyph | rendered text | sorts |
|---|---|---|---|
| `not-surveyed` | `–` | "not surveyed in this pass" | **last, both directions** |
| `no-record` | `–` | "not studied as a practice-type in this survey" | n/a (axis D never sorts) |
| `not-graded` | `⊘` | "grade withheld — nobody opened the book" | **last, both directions** |
| `not-applicable` | `▫` | "an applied text; grading it would be a category error" | **last, both directions** |
| `unverified` | `?` | "not confirmed from a public source" (compare.html's own rule, carried across) | **last, both directions** |
| `void` | `⚠` | the figure, struck, **with its contamination note in the same DOM node** | never sorts (counts are display-only) |

**These are values, NOT missing** — and the distinction is the whole point:

| value | renders | sorts |
|---|---|---|
| `discourse.absent === true` | **"No English Wikipedia article"** — a positive statement and a finding | tier `absent`, ordinal **0** |
| `spread.value === 0` | "no documented cross-cultural claim in this graph" | **0** |
| `studied.grade === 'none'` | "no peer-reviewed outcome literature located" — full-weight, full-size card | n/a |
| `attention.band === 0` | "no scholarship located" | **0** |

The comparator, which is the mechanism rather than the promise:

```js
export function compareBy(axisId, dir) {
  if (axisId === 'studied') throw new Error('axis "studied" is not sortable — see RANKING-SPEC §2D');
  const sgn = dir === 'asc' ? 1 : -1;
  return (a, b) => {
    const av = ordinalOf(axisId, a), bv = ordinalOf(axisId, b);   // number | null
    if (av == null && bv == null) return a.nodeId < b.nodeId ? -1 : 1;
    if (av == null) return  1;      // MISSING ALWAYS LAST …
    if (bv == null) return -1;      // … IN BOTH DIRECTIONS
    if (av !== bv) return sgn * (av - bv);
    return tiebreak(axisId, a, b);
  };
}
```

Sorting ascending must never present "no data" as "worst". The `aria-live` announcement says so out loud: *"sorted by modern academic attention, ascending; 14 rows have no value and are listed last."*

---

# §5 THE PAGE

## 5.1 It is a view, not a page

**No new URL.** The ranking is a second view of `pages/opgraph.html`, rendering **the same nodes** through the same pure model:

- New section `<section id="ranked">` after the ledger, with its own `<h2>` and its own in-page nav entry.
- A view toggle — **Graph · Ledger · Ranked** — serialised to the hash (`#view=ranked&sort=attention:desc&f=…`).
- **The ranked view is ledger Table A with five columns added**, plus a new **Table F · Axis methods** (axis · what it measures · source file · capture date · formula · bias note · high-means · low-means). Table F is the methods page inline; there is no separate methods page to fall out of sync.
- **AT-parity assertion, machine-checked:** `rankModel({}).rows.length === ledgerModel({}).works.length`. The ranking can never show a different population than the ledger, in either direction (`RK-15`).

## 5.2 DOM order (load-bearing, asserted)

```
<section id="ranked">
  <h2>                                   ← "The five columns"
  <div class="rk-notice">                ← §1.1 VERBATIM. First child. Not collapsible. Not a footer.
  <p class="rk-accuracy">                ← §7.3 corpus-accuracy chip + Wilson interval + "do not round up"
  <div class="rk-correlations">          ← §3.3 panel
  <div class="rk-controls">              ← sort + filter + group + "your weighting" (off)
  <div class="rk-axis-legend">           ← one <div data-axis-bias="…"> per axis, all five, always visible
  <div id="rk-table">                    ← the table (>680px) or the cards (<=680px)
  <table id="rk-methods">                ← Table F
</section>
```

The notice precedes every control and every value. A prefix-truncated extraction — the flat search index, an assistant context, a screen-reader linear read, a print — cannot carry a column without carrying the refusal.

## 5.3 The AT-parity text mirror

The ranking is already a table, so parity is about **glyphs, colour and sort state**, and it is enforced as four rules:

1. **Every glyph carries a visually-hidden word.** `▰` ships `<span class="rk-sr">complete</span>`; `?` ships "not confirmed from a public source"; `⊘` ships "grade withheld". **No fact exists only as a glyph.**
2. **No fact exists only as colour.** There is no colour ramp on any axis (§5.4). The two colour uses on the view are the shipped `--ep-*` epistemic label tokens (documented/disputed/debunked) and the staleness badge classes, both of which already carry text.
3. **Sort state is announced.** A single `aria-live="polite"` region emits the sort key, direction and **the missing-row count**. The `<caption>` carries the same sentence, so it survives with the table into print and into copy-paste.
4. **`rankModel()` is the single source for both renderings.** The table and the ≤680px cards read the same model object; a fact absent from the model cannot be painted, and a fact in the model must be rendered (`RK-15` asserts every model field has a render binding).

## 5.4 The canvas encodes nothing from these axes — a deliberate refusal

The operative-graph SVG gains **no** ranking encoding: no colour ramp, no node-size ramp, no rank halo, no ordering by any of the five axes. Three reasons: a visual magnitude reads as **force**; a colour ramp cannot carry its bias note; and the canvas is `aria-hidden` by design, so any fact encoded only there is a parity failure by construction. **The ranking lives where a number can sit next to the sentence that qualifies it.** Asserted: no `rk-*` axis value reaches the SVG painter (`RK-19`).

## 5.5 390 px behaviour

- **≥ 681 px** — the table, in an `overflow-x: auto` region with a **sticky first column** (the shipped `cmp-matrix-scroll` pattern, reused not reinvented), `tabindex="0"` and `role="region"` with a scroll-hint label. The page body itself never scrolls horizontally.
- **≤ 680 px** — the table is **replaced**, not scrolled: one `<article>` per work, each axis a `<dl>` row with its label, its value, its glyph word and its qualifying note. **Rationale, stated because it is a departure:** a five-axis row cannot be honestly side-scrolled at 390 px, because scrolling moves the value away from the axis label and away from the note that qualifies it — and on this page the note is not decoration, it is the correction. The ledger already defaults to text at ≤680 px (PLAN D13); this follows it.
- **At 390 px specifically:** no horizontal scroll anywhere in `<main>` (asserted by the existing browser-verify phase); the sort control becomes a `<select>` plus a direction toggle rather than a row of buttons; the axis legend stays expanded — it is never collapsed behind a control, because a bias note behind a tap is a bias note nobody reads.
- **Print** — cards, all notes expanded, all disclosures open, the notice on the first page.

## 5.6 The reduced-motion rule

**Reduced-motion-first, and here that means: no motion at all.** Every default state IS the final resting state. Sorting is a full re-render with no transition, no FLIP, no fade, no `requestAnimationFrame` anywhere in the ranked view — there is nothing to animate and nothing is animated. The only permitted motion on the whole view is the shipped drawer-presence fade inherited from the graph view, already ≤180 ms and already inside `@media (prefers-reduced-motion: no-preference)`. `__motionStats().running === false` within 1.2 s idle, asserted by the existing Chromium sweep on every page. **A sort animation on a ranking table is a small piece of theatre that implies movement up and down a ladder; there is no ladder.**

---

# §6 THE ENGINE-TEST ASSERTIONS

New files `scripts/tests/r34-rank-core.mjs` (invariants, purity, comparator, greps) and `scripts/tests/r34-rank-ui.mjs` (DOM + `DRIVES[]`), both exporting `async run() -> {pass, failures[]}` and registered in `scripts/engine-test.mjs`'s isolated-child-process list. Plus `node scripts/gen-rank.mjs --check` shelled from the same gate.

**The five the brief names, first.**

| # | assertion | what it prevents |
|---|---|---|
| **RK-1** | **No efficacy field exists anywhere in the schema.** Walk every object in `RANK_ROWS`, `RANK_AXES`, `RANK_SCALES`, `RANK_META`; fail on any **key** matching `/effic\|potenc/i` or exactly `effective\|effectiveness\|works\|power\|strength\|success\|score\|rating\|rank`. Also fail if any axis definition declares `sortable: true` for `studied`. | the axis growing back |
| **RK-2** | **Every axis value carries a source.** For all rows × 5 axes: exactly one of `{value, band, tier}` or `missing` is present (never both, never neither); `source.kind` ∈ enum; `kind='derived'` ⇒ non-empty `claimIds[]`; every other kind ⇒ a resolving source id **and** an ISO `capturedAt`/`compiled` not in the future. | an unattributed number |
| **RK-3** | **Missing ≠ zero.** No value object has a numeric `0` together with a `missing`; every `missing` reason is in the enum and has a render entry in `MISSING_RENDER`; **`compareBy(axis,'asc')` and `compareBy(axis,'desc')` both place every missing row after every valued row** (asserted by running both comparators on a fixture with holes). | absence rendering as "worst" |
| **RK-4** | **Discourse carries a capture date and a staleness computation.** Every discourse value has ISO `capturedAt` ≤ today and `surveyStamp` matching `/^\d{4}-\d{2}$/`; `stalenessClass(iso, fixedNowMs)` returns `plain\|warn\|bad` at exactly the 11/12 and 23/24-month boundaries, tested at **fixed** timestamps. **Staleness is never a test failure** — it is a rendered badge (compare.js's rule, carried across). `RANK_META.surveyStamp === '2026-07'`. | a stale figure passing as current |
| **RK-5** | **Bias notes are present in the rendered DOM.** Data side: all five axes have non-empty `biasNote`, `highMeans`, `lowMeans`, and every `biasNote` contains at least one digit (a measured figure, not an adjective). DOM side (`r34-rank-ui`): exactly five `[data-axis-bias]` nodes inside `<main>`, each with non-empty text; the §1.1 notice present **and preceding** the first `table\|.rk-card` in document order; the five axis `highMeans`/`lowMeans` strings all present. | a bias note that exists only in a spec |
| **RK-6** | **Banned-phrase grep for efficacy language over the page copy.** Over `pages/opgraph.html`'s ranked section, every string in `rank-axes.js`, and the rendered ledger text: fail on `/\b(works\|working\|effective\|effectiveness\|efficacy\|potent\|potency\|powerful\|power\|proven\|validated\|success rate)\b/i` **except** exact allowlisted constructions, each an exported string constant, **each printed by the test** so a reviewer sees exactly what was let through. Allowlist (closed): the §1.1 notice's *"whether any of it works"* and *"no demonstrated predictive or operative validity"*; §2D's quoted AHA grading *"Class III means not useful or effective"*; the Goyal null *"no evidence that meditation programmes were better than any active treatment"*; and **`perceived efficacy`** — asserted separately: **every occurrence of `/\befficacy\b/i` outside the notice is immediately preceded by `perceived `** (`RK-6b`). The word *powerful* has no allowlist entry at all. | the site's own voice sliding into efficacy claims |

**The rest, in force.**

7. **RK-7 · `studied` is not sortable.** `compareBy('studied', …)` throws; the sort-control definitions in data contain no `studied` entry; the DOM has no sort button in that column header.
8. **RK-8 · No composite by default.** Initial state `weights === null`; `combinedIndex(row, null) === null`; with weights, the return carries per-axis `contributions[]`; a row missing any weighted axis returns `{ excluded: true, reasons: [...] }` and **never a number**; `combinedIndex` ignores/rejects a `studied` weight and the axis definition carries `weightable: false`.
9. **RK-9 · Census monotonicity.** Every `band ∈ 0..5`; `criticalEdition.status === 'none'` ⇒ `band ≤ 2`; a funded named programme ⇒ `band ≥ 3`; `bandAsFiled === band` (a later round cannot silently re-band).
10. **RK-10 · A flagged number never renders bare.** Any count with `sampled === false` or a VOID verdict carries a non-empty `contaminationNote`; the UI test asserts the note text is inside **the same cell element** as the number. Same rule for every discourse `flags` entry.
11. **RK-11 · Join integrity.** Every `nodeId` resolves in `OPGRAPH_NODES`; every non-null `censusRowId`, `effectsRecordId`, `discourseFamilyId` resolves in its input file; every mapping — **including every null one** — carries a non-empty `basis`; `join.json` is total over the shipped node set (unmapped node ⇒ generator failure, not a silent gap).
12. **RK-12 · Spread counts only documented edges.** Every claim id in `spread.claimIds` has `asserted === true`, non-empty `bestCitation`, `label !== 'debunked'`, and `relation ∈ {TRANSMITS_TO, PARALLELS, COMMENTS_ON}`; every `NON_EDGE` and every `asserted:false` claim touching the row appears in `nonEdges[]`/`struck[]` and contributes **0**; `RECONSTRUCTED_THROUGH` never appears in `claimIds`.
13. **RK-13 · Effects cell composition.** In the rendered cell: the `separationNote` and `keyNullFinding` nodes **precede** the grade chip in document order; `harmGrade` and `documentedHarms` are inside the **same** cell as `grade`; every source record with a `provenanceWarning` renders it; every `retrievalPending` value renders the reason **instead of** a number.
14. **RK-14 · Column order + separator.** `RANK_COLUMNS` is exactly `['work','directness','attention','spread','SEP','studied','discourse']`; the DOM has a rendered separator between `spread` and `studied`.
15. **RK-15 · Determinism + AT parity + render coverage.** `rankModel(f, s)` deep-equals itself across two calls; `rankModel({}).rows.length === ledgerModel({}).works.length`; every glyph in the rendered output has a sibling `.rk-sr` text node; every model field has a render binding.
16. **RK-16 · Unverified-citation ratchet.** Count of `verified === 'unverified-this-pass'` across `RANK_ROWS` ≤ the pinned constant (**29** at import, from the census's own flag). It can only go down. A round that adds an unverified citation fails.
17. **RK-17 · `corpusAnchor` is never collapsed.** Any discourse value with both `anchor` and `corpusAnchor` exposes them as two fields with no derived merge, and the DOM renders both figures.
18. **RK-18 · Withheld-by-design badge.** Every row whose `directness.withholding` includes `gated` or `constitutive` renders the badge and its gloss.
19. **RK-19 · The canvas stays clean.** No ranking axis value reaches the SVG painter: assert the painter's input keys contain none of `directness\|attention\|spread\|studied\|discourse`.
20. **RK-20 · Facet legality (inherited).** The filter definitions contain no facet named `purpose`, `act` or `aim`, and no filter combination narrows the view to a single act across corpora (FRAMING §5 A-1).
21. **RK-21 · Anti-drift.** `node scripts/gen-rank.mjs --check` exits 0. Hand-editing the generated module is a test failure.

---

# §7 THE BLIND RE-AUDIT'S VERDICT, FOLDED IN

## 7.1 What the independent check found

`33-blind-reaudit.json` re-derived **37 sampled claims** from sources **outside** the repository's own curation gate. Verdicts: **31 CONFIRMED · 2 CONTESTED · 2 REFUTED · 2 UNVERIFIABLE.**

**Accuracy estimate: 83.8% (Wilson 95% CI 68.9%–92.4%; 88.6% / 74.1%–95.5% excluding the unverifiable pair).** The sample is **purposive, not random**, and was deliberately weighted toward load-bearing, cross-cultural and sensitive claims — which in this corpus are disproportionately the ones already carrying contested blocks, `CORRECTION:` notes and edition-resolution essays, i.e. **the site's best work**. That biases the estimate **upward**. The auditor's own instruction, adopted here verbatim: **report the corpus at roughly 80–85%, and do not round up.**

**The stratification matters more than the headline.**

| stratum | n | confirmed | reading |
|---|---:|---:|---|
| Bibliographic / dating / edition | 9 | **9** | uniformly excellent — Wujastyk *Ambix* 31.2 (1984) confirmed down to the Jammu library and the mechanism; Türstig *WZKS* 29 (1985) 69–117; Pines–Gelblum *BSOAS* 29 (1966); Pingree *JWCI* 43 (1980); Hayashi *Historia Mathematica* 14 (1987); Alfonso X 1256–58 Latin-from-Castilian; MMU 1588; AV c.1200–1000 BCE; Gheraṇḍa late 17th c. |
| Latin/Greek quotation & attribution | 4 | 3 | **verbatim-exact**: five of five sampled mansion images from Agrippa II.46 match the Freake 1651 text including every suffumigation, the mansion-11 gold bracelet and the mansion-22 *argent vive*; the Aries first face from II.37 matches. The one failure is a substance. |
| Transmission edges | 6 | 5 | direction and evidence generally well grounded; one row's `kind` contradicts its own body |
| Toxicology / present-day harm | 5 | 4 | **one number halved**; window drift on another |
| **Sanskrit verse loci** | **5** | **3** | **the weak stratum** |

**This is a strong result for a tertiary compilation, and the honest reading is not that it is fine.** The two failure modes it found are exactly the two this kind of project has: *a number copied down wrong on the one axis where wrong numbers matter most*, and *a pointer set that drifted away from the numbering it claims to have been checked against*.

## 7.2 Corrections this ranking DEMANDS before it ships on top of that data

**Blocking. The ranking does not ship until all four land.**

- **RK-B1 · The lead figure. `1.2%` → `2.4%`.** FRAMING §C-1 makes it *mandatory* that the toxic-materia harm note state *"CDC MMWR 61(33) (2012) … one product at 1.2% lead by weight."* The published article (MMWR 2012;61(33):641–646) states lead concentrations **"as high as 2.4%"**. Everything else in the sentence checks out — six foreign-born pregnant women in NYC, blood lead 16–64 µg/dL, mercury and arsenic co-contamination. **The site understates a published lead maximum by a factor of two, in the one place it made carrying that figure compulsory.** Axis D renders toxicology figures; shipping a research axis over a halved lead concentration is the precise failure this round's hard line exists to catch. Fix in FRAMING §C-1, in `pages/rasa.html`'s callout, and in every harm note repeating it, in one commit, with the test that pins it. **Cost: one token.**
- **RK-B2 · The Saturn suffumigation.** `planetary-magic.js` gives Saturn `suffumigation: 'opium, etc.'` cited to `Picatrix III.7`. The Picatrix's own list reads *"all things that smell bad, asafoetida, gum arabic, bdellium, hemlock and similar things"*; opium in the Picatrix corpus attaches, in accessible scholarship, to a **solar** invocation. Jupiter and the Moon in the same module also fail to match III.7, which suggests the module draws on Book IV compound recipes while citing III.7. **What is certain is that the cite string as shipped is not supported by the locus it names.** This is blocking twice over: the ranking surfaces `planetary-magic` records under axes A and C, and FRAMING §3.1 already names `talisman.js` a shipping blocker partly *because* it emits *"Prepare the materials: suffumigation of opium, etc."* into a generated, personalised, imperative protocol. **The site is propagating a controlled substance into its most policy-exposed artefact on an attribution that does not hold.** Correct the substance or re-cite the locus; do not leave the string standing.
- **RK-B3 · The Gheraṇḍa numbering caveat.** `PRACTICES_META` says the mudrā loci were *"independently cross-checked against the Sanskrit verse numbering at siva.sh."* That witness agrees **exactly** on the 3.1–3 name-list, on mahāvedha 3.21–24 and on khecarī beginning at 3.25 — and then places viparītakaraṇī at **3.46–48** and yoni mudrā from **3.49**, against the site's 3.33–36 and 3.37–44. A **~13-verse divergence** propagating through 20+ records. A third circulating recension differs again (khecarī 3.21–28, vajrolī 3.39), and Wikipedia independently cites Gheraṇḍa vajrolī at 3.39 where the site has vajroṇī at 3.45–48. **The site's loci may be perfectly correct for Vasu's 1895 English — no page image was obtainable — but the cross-check it advertises demonstrably covers only the name-list and the khecarī start, and nothing shipped warns that other editions renumber by up to thirteen verses.** Axis A (directness) is computed over exactly these locus-bearing records, so the ranking would sort on completeness while its pointers silently misdirect. **Required: a `numberingCaveat` in `PRACTICES_META` naming at least two rival numberings, and the `numberingMapping` prose narrowed to what the cross-check actually established.** (The permitted alternative — excluding post-3.32 Gheraṇḍa rows from the directness computation and saying so — is worse and more expensive; take the caveat.)
- **RK-B4 · Axis-C attribution hygiene, two rows.** Both are FRAMING §2.4 violations that would otherwise become *counted* cross-cultural reach:
  - `physika-kai-mystika → leiden-stockholm` ships `kind: 'influence'` (a directed arrow) while its own body says *"both draw on a common Greco-Egyptian recipe literature"* and its own note concedes *"the influence kind overstates."* **A directed edge whose annotation says the direction is wrong misleads anyone who reads the graph rather than the footnote.** Set `direction: 'unknown'` or use a symmetric kind — otherwise the edge is excluded from the spread count.
  - `mansion-images.js` asserts *"Agrippa is translating the Picatrix here"* with **no `claimedBy`**. §2.4 forbids exactly that. Attribute it to a named scholar or soften it to a parallel; unattributed, it cannot contribute to any spread count.

**Same-round, non-blocking, and each one is this round's own hard line applied to the site's own pages:**

- **Add the absence.** The rasa harm note lists four positive findings and **no statement of what has not been studied**, which reads as a complete evidence base when it is a case-report literature. Add: *there is no human randomised or controlled clinical literature establishing the safety of classically prepared mercurial or metallic bhasmas*; what exists is market-sample assay work (Saper 2004; the 2008 internet follow-up), poisoning case series (MMWR 2012; the Wisconsin series; the Durban outbreak) and animal toxicology (Liu 2008; Huang 2012). **This is axis D's absence-as-value applied to the site's own prose, and the audit found the site currently blank there.**
- **Label the rodent data and the inference.** The 0.2% cinnabar absorption figure is **rodent** data with no human dosimetry behind it, and low absorption is not low hazard — Huang et al. (2012) report neurotoxicological effects in offspring mice at *low* cinnabar dose. And *"the process is the hazard vector, not the mineral"* is a reasonable inference from the speciation literature; **no paper states it in those words.** Label it an interpretation.
- **Caveat the deterrent.** Mallinson's *"only five of the many texts require the cut"* is unverifiable from open sources (in copyright, `cite-only`). The general shape is corroborated; **the number is not checkable**, and it is the site's stated deterrent argument, so the caveat matters.
- **Retire an over-hedge and fix a window.** Türstig's *WZKS* volume is **29** — the ⚑ can go. The NCRB window `2001–2018` should read the window the cited data actually covers (2000–2016).
- **Two over-claims about verification, not about facts.** `DIRECTIONS_DEITIES` says every row was *"confirmed verbatim against two independent authoritative full-text sources"* — the **mapping is right** (an entirely independent tantric compendium reproduces all six act→deity→direction→season rows identically: Rati/NE, Vāṇī/N, Ramā/E, Jyeṣṭhā/SW, Durgā/NW, Kālī/SE), but Bühnemann is in copyright and *"verbatim"* is not checkable from open sources. Soften the verification claim; keep the data.
- **One under-claim worth correcting upward:** Wilkins 1785 was the first direct translation of a complete Sanskrit work into **any European language**, which is stronger than the site says.
- **One free addition, and the cheapest real one available:** `hyp-khecari` correctly attributes the snuhī-leaf blade and the *romamātra* increment to HYP 3.34 — **and that couplet is Khecarīvidyā 1.46–47**, cited to Mallinson & Singleton, *Roots of Yoga* (2017) pp. 247–248. The HYP is reproducing the Khecarīvidyā verbatim: a documented, already-scholar-attributed dependency between two named loci, absent from the data, and exactly the kind of edge axis C exists to count. Relatedly, the *"Sinh left vajrolī untranslated for moral reasons"* rumour the site records as UNVERIFIED has an identifiable probable origin: **Vasu**, not Sinh, is independently reported to have omitted vajrolī as *"an obscene practice indulged in by low class Tantrists."* Naming the probable source of a rumour beats recording that it could not be confirmed.
- **Suppress two numbers until retrieved** (from the effects slice's own retrieval flags): Goodwin's primary-endpoint least-squares mean differences and CIs (publisher returned 403 twice, not reproduced from memory) and the Tang-emperor elixir death count (left at *"five, six or more"*; Needham vol. V and Ho Peng Yoke not retrieved). Both carry `retrievalPending: true`; the renderer prints the reason **instead of** a number (`RK-13`).

**Two policy questions for the maintainer, flagged and not adjudicated** — an auditor should not decide these:

1. `gs-matangini` describes, in site voice, standing in water to the neck and drawing water in through the nostrils. FRAMING §C-3 rule 2 excludes *"anything pairing breath technique with water, submersion or bathing — excluded entirely, in any voice, from any tradition, at any date."* The record is textually accurate. **Either the record is out of policy or C-3 rule 2 is drawn wider than intended. Both cannot stand.**
2. `hyp-khecari` says, in site voice, *"over months, to cut the frenum … a little at a time"* and *"lengthens 'a hair's breadth' at a time"* — increments and an interval, against C-2's ban on graded regimen and progression. Note the site is *already* stricter than its source: Vasu supplies a depth, a duration and a caustic, none of which the site reproduces. **The instinct is right and the line is drawn slightly on the wrong side of its own rule.**

Until they are ruled on, both records render with a `policy-open` marker linking the open question. **They are not silently excluded from the ranking** — excluding them would hide the thing the marker exists to show.

## 7.3 What the ranking page must say about its own substrate

A ranking built on a corpus is a claim about that corpus, so the page carries the corpus's audited accuracy, in the notice's immediate neighbourhood, as a chip with the interval and the caveat:

> **The data under these columns was independently re-audited in 2026-07: 31 of 37 sampled claims confirmed against sources outside this site's own curation gate (83.8%; Wilson 95% CI 68.9%–92.4%). The sample was purposive, not random, and was weighted toward this site's best-attended claims, so the true rate is more likely below that figure than above it. Read it as roughly 80–85%, not rounded up. The bibliographic and dating layer was 9/9 clean; the weak stratum was Sanskrit verse loci, 3/5.** [link: the full audit]

And the audit's own limits, on the methods table beside it: n=37 against a corpus in the low thousands of claims; three of the site's most important sources are in copyright and unreachable from open sources (Bühnemann's *Tantra in Practice* chapter, Mallinson's *Khecarīvidyā*, Martelli's *Four Books of Pseudo-Democritus*), so claims resting solely on those are **UNVERIFIABLE from outside the gate, not verified-by-default**; no page image of Vasu 1895 was obtainable; the astronomy, dignities, tarot, I Ching, Buddhist, Kabbalah and geomancy data were out of slice; and 6 of 155 confluence edges and 5 of 28 mansion images were sampled. **The abhicāra correspondence tables all trace through one scholar's dissertation on texts with no critical editions — the module says so, but the wing's apparent density of citation overstates the independence of its evidence base**, and axis B must not read that density as corroboration.

## 7.4 What the audit changes about the axes themselves

- **Axis A** gains its witness chip and RK-B3's numbering caveat, because the audit demonstrated that a locus set can drift away from the numbering it claims to have been checked against **while the content of every record stays correct**. It is the pointers, not the contents, that drifted — and a completeness ranking is a ranking of pointers.
- **Axis B** gains the `verified` field and the RK-16 ratchet, because **29 of ~110 census citations are `unverified-this-pass`** and FRAMING §1.2 says no claim rests on a work the compiler has not seen. The file marks the gap rather than hiding it; the ranking must not launder it.
- **Axis C** gains RK-12's citation filter and RK-B4's two fixes, because the audit found the exact failure mode the filter exists to catch: **a directed arrow whose own note concedes the direction overstates**, and **a transmission assertion with no `claimedBy`**.
- **Axis D** gains `retrievalPending` and the absence-of-evidence text, because the audit's §5 is a list of places where *"no study exists"* is the answer and the site currently leaves it blank.
- **Axis E** gains nothing from the audit and needs nothing: it is the only axis whose every figure is exactly reproducible from a stored URL, and its own self-verification pass re-read all 34 families out of the finished JSON and diffed them against the raw capture TSVs with every figure matching and every tier following the published thresholds mechanically.
