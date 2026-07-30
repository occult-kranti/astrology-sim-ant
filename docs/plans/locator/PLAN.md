# THE LOCATOR — plan

**Status:** SPECIFICATION. Not scheduled. §9 argues it should *not* take the next slot.
**Written** 2026-07-30 against repo tip `89e2622`, tree clean.
**Binding inputs:** the four research slices in `scratchpad/locator/` (10 census · 11 entity
resolution · 12 index schema · 13 AI layer) and, above them, `20-audit.md` — the hostile audit,
whose 37 strikes and 11 blockers are **binding on this document**. Where a slice and the audit
disagree, the audit wins. Where the audit and a shipped module disagree, **the module wins**, and
this plan says so with the measurement.

Everything numbered below was re-measured this session by importing the shipped modules with the
project's node (`C:\Users\mehta\.conda\envs\astro-workbench\node.exe`). Six of the audit's own
figures were checked; **four confirmed, two corrected in this plan's favour of being worse.**

---

## 1. WHAT IT IS

> **The locator is an index of *where things are*.** You ask it a question of the form *"where does
> this corpus discuss X?"* and it answers with a work, an edition, and the finest address the site
> actually holds — a verse, a chapter, a section, or (honestly labelled) the whole work. It answers
> in citations. It never answers in text.

That is the whole product. A reader who wants to know where haṭha yoga's tongue-lock is described
gets *Gheraṇḍa Saṁhitā 3.25–32, in Vasu's 1895 translation (SBH XV.2, 1914–15)* — a pointer precise
enough to open the book at the right page, from a site that in most cases is legally forbidden to
show them the page. Roughly **70% of this corpus is cite-only**, and the locator is the design that
turns that from a defect into the feature: *we can tell you exactly where it is; we cannot show it
to you, and we will name the edition where you can see it.*

**What it is NOT — each of these is a design refusal with a mechanism behind it, not a promise:**

- **Not a search engine over content.** It indexes site-voice summaries and citations. The row
  schema has no `text`, `quote`, `pdQuote` or `translation` field, so the index is *physically
  incapable* of holding a transcription (FRAMING §4.1's design move, applied again). The existing
  flat `assets/search-index.json` — 114 pages, 1800-char prose blobs — is a different thing and
  **stays**; the locator augments it, it does not replace it (§4.6).
- **Not a reader.** It does not display texts. It points at editions. Where the site *does* carry a
  public-domain apparatus (Yoga Sūtras, the Buddhist wing), the locator links to that page; it does
  not duplicate a word of it.
- **Not a quoting service.** No locator surface — page, tool return, or assistant reply — emits
  quoted primary text. The model that fronts it emits **row ids only**; the application substitutes
  the citation strings from the shipped index (§5.3). A locus the index does not hold cannot reach
  the screen.
- **Not a purpose index.** No `purpose`, `act` or `aim` facet; no free-text query path into a
  cross-corpus view of hostile material; the reader-facing synonym table is asserted against the
  same tombstone list as the topic map (FRAMING §7.5, §8.2, C-7 A-1). This is the constitutional
  constraint and §5.5 gives it three separate mechanisms.
- **Not a philologist.** It never asserts that two works are the same work, or that two practices
  are the same practice, on its own authority. Every identification is a recorded, reversible,
  evidenced merge (§3); every cross-cultural link carries a named scholar or does not render
  (FRAMING §2.4).

---

## 2. THE CORPUS

### 2.1 The number

> **1,368 distinct citable loci at chapter granularity or finer.**
>
> That is the project's size. It is the only headline number this plan permits.

Unit, stated because the census produced three totals under three definitions and the audit was
right to call the composite a quiet lie (S21): *a distinct address, in a named edition's own
citation form, at chapter granularity or finer, that some shipped module supplies today.* Word
glosses beneath a numbered verse are **not** separate loci. Structural stage claims are **not** text
addresses. Whole-work records are **not** in this number.

**Three composites are banned outright and may not reappear on any page, in any round:**
`1,633` (includes the stage tier), `3,280` (mixes units), `6,020` (counts 3,542 word glosses as
loci). A build that emits any of them fails the artery test.

### 2.2 The depth map

| depth | loci | records behind them | who owns it | quotable? |
|---|---:|---|---|---|
| **word** | **804** | 3,542 word glosses beneath (not counted) | yogasutra 196 · buddhist 608 | **all PD/CC0** |
| **verse** | **289** | 181 records | bhava-phala 216 (108 two-witness records) · mudrās 35 · yoga-rules 35 · kabbalah QUOTES 3 | mostly **cite-only** |
| **chapter** | **275** | — | greatworks 145 · greatworks-east 102 · picatrix-prayers ~24 · abhichara ATHARVAN 4 | mixed; see §2.5 |
| **= citable loci** | **1,368** | | | |
| *stage* | *264* | *67 with enumerated stage arrays* | *opgraph claims 246 · rasa saṃskāras 18* | **NOT LOCI** — structural claims, reported separately |
| *work* | *~656* | *690 raw − ≥34 known cross-module duplicates; overlap with the r29 384-catalogue unquantified* | *opgraph 101 · confluence 190 (107 kind:text) · abhichara TEXTS 9 · rasa TEXTS 6* | *work-level pointers, banded separately* |
| *entity* | *958* | *persons, glossary terms, symbolic-system elements* | *practitioners 133 · glossary 321 · competitors 28 · chronology 43 · ~433 system elements* | **out of v1 entirely** |

**One correction to the census, made this session.** The census counted 36 yoga-rules loci. Measured:
`yoga-rules.js` holds 36 yogas of which **one** — `kala-sarpa`, `family:'modern'` — has no classical
locus at all. Its own `provenanceNote` reads *"No definition exists in BPHS … Phaladīpikā … Sārāvalī
or Bṛhat Jātaka … the doctrine rose in twentieth-century popular practice."* Its `sources[]` array
says *"the absence is the citable fact."* A record whose citable fact is an absence is not a citable
locus, and **it gets no locator row.** Verse tier is 289, not 290; the headline is 1,368, not 1,369.
This is the smallest possible correction and it is exactly the discipline the rest of the document
demands, so it is made rather than rounded past.

### 2.3 Three structural facts the map produces

1. **The deepest tier is also the safest tier.** All 804 word-depth refs live in two modules
   (yogasutra, buddhist) and both are entirely PD/CC0. The corpus's precision and its quotability
   are correlated in the site's favour — which is the whole argument of §8.
2. **The verse tier is where pointing earns its keep.** 289 verse loci, of which the great majority
   point into **in-copyright** translations (Santhanam's *Sārāvalī*, Sareen's *Phaladīpikā*,
   Mallinson's editions). 289 precise addresses, zero reproduced words. That is the product.
3. **The stage tier is not a text address, and the largest single block of the corpus is in it.**
   246 opgraph procedure-claims locate a procedure *structurally* — stage kinds and counts — not
   textually. Slice 12 proposed parsing chapter loci out of `claim.subject` prose. Measured: **1 of
   246** `claim.subject` strings mentions a chapter at all. 41 of 246 `cite` strings contain a
   chapter-shaped token, and those strings ship verbatim in the row's `citation` field where they
   are honest. **The prose-parse the audit struck (B4) would have produced approximately one row.**
   Giving it up costs nothing and buys the plan its depth honesty outright.

### 2.4 Two-witness records: 216 loci, 108 answers

108 bhava-phala records carry a *Phaladīpikā* locus and a *Sārāvalī* locus each. Both are genuine
addresses, so 216 is the honest locus count. But they are near-identical rows — same graha, same
bhāva, same topic set — and the module's own header keeps them **side by side and never merged**.
Shipping them as 216 independent hits would let jyotiṣa dominate every mixed view and would make
top-1 scoring a coin flip on ~14% of the index (S22, S37).

**Resolution:** two rows, one answer. Each row keeps its own locus and edition; both carry a shared
`witnessGroup` id. Retrieval scores the *group* once and renders *one result with two witnesses*.
The banded count reads **"216 verse loci in 108 two-witness records (108 answers)."** No merge
occurs, so the module's rule is respected; no double-counting occurs, so the eval is honest.

### 2.5 Quotability, measured — and worse than the slices assumed

The `~70% cite-only` estimate holds. Two specific findings make it operative, and both are worse
than the audit reported:

- **opgraph editions.** 2 shipped editions carry a `cite` string reading *"in copyright, cite only"*
  or *"cite only"* while their machine field says `pd:'us-pd', quoteSafe:true` —
  `gw:agrippa-three-books` (Perrone Compagni, Brill 1992) and `gw:pseudo-agrippa-fourth-book`
  (Peterson). Both carry `derived:true`; **38 editions in total carry `derived:true`**, so this is a
  class, not two anecdotes. (The audit said three; measured, two match the stated predicate. The
  correction is reported because the assertion in §3.6 names records and must not name a record that
  does not fail.)
- **greatworks.** The audit named four works whose per-edition licence lives only in prose.
  Measured: **15 of 34** greatworks + greatworks-east works carry `quoteSafe: true` alongside
  `pdStatus` prose that names a cite-only or NOT-PD edition — `corpus-hermeticum`, `crowley-777`,
  `crowley-liber-al`, `crowley-book4`, `crowley-mtp`, `crowley-equinox-i`, `dee-monas`,
  `dee-true-faithful`, `dee-enochian`, `agrippa/three-books`, `ficino/de-vita`,
  `iamblichus/de-mysteriis`, `east:brihajjataka`, `east:brihatsamhita`,
  `east:the-yogas-and-complete-works`. Verbatim from `de-vita`: *"The 1489 Latin is PD (Latin
  quotation only). CRITICAL: NO complete public-domain ENGLISH translation exists — Kaske & Clark
  (1989) and Boer (1980) are both copyrighted, cite-only."* The boolean is `true`. **44% of the
  site's best-curated wing would ship a wrong `quotable` if the locator derived it from the
  boolean.** §3.6 states the only two honest options.

---

## 3. ENTITY RESOLUTION

Nothing in §4 or §5 may be built before this section ships. That is blocker B1: slices 12 and 13
both joined records without consuming the merge ledger slice 11 designed, and a build round handed
all three would have shipped one design and silently dropped the other's controls.

### 3.1 The one-artifact rule (B1)

| | decision |
|---|---|
| merge ledger | `research/locator/identities.json` — tracked, append-only, the `gate.json` conscience pattern |
| index source of truth | `assets/js/core/data/locator/rows.js` + `topics.js` (GENERATED, pure data, no DOM) |
| browser payload | `assets/locator-index.json` — a **projection emitted by the same generator in the same run**, covered by the same `--check` |
| builder | `scripts/gen-locator.mjs` — one script, both outputs, `--check` anti-drift |
| id grammar | rows `/^loc:[a-z0-9]{2,6}:[a-z0-9.\-]+$/`; clusters **opaque**, `loc:w:00417` / `loc:p:00042` |
| assertions | one list, `L-*` + `A-*`, executed by `scripts/tests/loc-artery.mjs` |

**The binding assert (B1):** `LOCATOR_WORKS` may contain **no join that is not recorded in
`identities.json`**. Two records become one work because a merge record says so, or they stay two.
There is no join-on-`atlasSlug`-directly path anywhere in the generator.

### 3.2 Opaque cluster ids, because a semantic id dies on retraction (S9)

Slice 11 minted `loc:work:de-occulta-philosophia`. That id embeds the contested choice: retract the
merge and the id ceases to exist, breaking deep links, bookmarks, and every `[L#]` in a recorded
eval transcript. Cluster ids are therefore **opaque and permanent** (`loc:w:00417`), the label is
data, and a retracted id resolves to a **struck-not-hidden tombstone page**: *"this identification
was retracted in R*n*, because —"*. That is the site's own existing convention (`asserted:false`,
the debunked atlas edge) and slice 11 simply had not applied it here.

### 3.3 The merge record

```jsonc
{
  "id": "loc:w:00417",                     // opaque, permanent, never semantic
  "kind": "work",                          // work | person  (see the KIND LATTICE, §3.5)
  "canonicalLabel": "De occulta philosophia libri tres",
  "members": [ { "module": "greatworks.js", "id": "agrippa/three-books" },
               { "module": "opgraph.js",    "id": "gw:agrippa-three-books" } ],
  "memberKind": null,                      // or 'recension-arabic' | 'recension-latin' | …
  "evidence": [ { "signal": "S1", "detail": "…", "source": "opgraph.js:gw:agrippa-three-books.atlasSlug" },
                { "signal": "S3", "detail": "…", "source": "confluence.js:de-occulta-philosophia" } ],
  "confidence": "anchored | matched | curated | proposed",
  "status": "active | proposed | retracted",
  "mergedRound": "R34", "mergedBy": "…", "retractedRound": null, "retractedReason": null,
  "blocks": [ { "id": "gw:pseudo-agrippa-fourth-book", "reason": "…", "source": "…" } ]
}
```

Plus a top-level `never: [{a, b, reason, source}]` and a top-level
`aliases: [{from, to, kind, source, evidence}]`.

**Reversibility, and the part slice 11 got wrong.** The ledger is genuinely reversible: the index is
100% derived, no shipped module is ever rewritten, retraction is an appended status flip plus a
regenerate. But reversibility in the file is worthless if the merge renders on the site as a bare
identity claim. **`evidence[]` renders.** Every cross-work identification shows its signal class and
its source inline, exactly as `claimedBy` does for an atlas edge. "Carries evidence" means *the
reader sees it*, or it means nothing (S9).

### 3.4 Blocking, matching, refusing

**Blocking** is recall-only: `fold()` = NFD → strip marks → lowercase → transliteration table
(`sh→s, ch→c, w→v`, …) → strip non-alphanumerics → collapse doubles. It ships with a pinned test
vector that must **unify** the three shipped false splits — `tan:nisvasatattvasamhita` ↔
`nisvasatattvasamhita` (byte-identical after the prefix), `tan:kularnavatantra` ↔ `kularnava-tantra`,
`tan:nityasodasikarnava` ↔ `nityashodashikarnava` (`ś` romanised `s` in one module, `sh` in the
other) — and must **produce** the forbidden candidates (both Nāgārjunas; Juratus/Honorius) so the
NEVER list is exercised rather than bypassed.

**Matching** needs **two independent signals**: S1 shared edition/MS anchor · S2 fold-title + date
within tolerance · S3 shipped prose equivalence · S4 author-cluster + title · S5 curator with
evidence. One signal ⇒ `status:'proposed'`, which renders nothing and traverses nothing.

**The alias table is demoted (S7).** Slice 11 let one alias entry create the candidate, supply half
the evidence, and satisfy the anti-transitivity assertion — so any wrong merge could be laundered by
adding one line to an uncited table. Under this plan: alias entries are **records** with a `source`;
they count as an **S3 signal only when they cite a shipped module's prose equivalence**; they
**never** satisfy A3 alone; and an assert forbids any alias whose endpoints appear in `never`
(`sworn-book→liber-juratus` sits one token from the asserted non-merge `gw:liber-juratus ≠
gw:grimoire-pape-honorius`).

**A1 is re-specified (S8).** Slice 11's date-span guard was vacuous exactly where blobs form —
`sortYear` is nullable and null across shipped premodern pseudepigrapha — and it *fails* on the
design's own required case (Picatrix Arabic ~mid-11th c. vs Latin 1256–58, ~200y apart). A1 now
asserts **coverage first**: a cluster with ≥2 members lacking `sortYear` requires
`confidence:'curated'` plus evidence and is listed in a **pinned build summary**, so undated
clusters cannot grow silently. The recension escape is not an unbounded `curatorApproved` flag but a
typed `memberKind:'recension-*'` exemption, which is bounded and testable.

### 3.5 The KIND LATTICE (S4) — because the guard's vocabulary did not exist in the data

Slice 11's kind-guard enumerated `work|person|event|institution|culture|product`. The **shipped**
enum, measured: works `work 88 · collection 7 · work-segment 3 · practice-corpus 3`; authors
`person 30 · pseudonymous-attribution 12 · anonymous-hand 3 · corporate 1`. As written, A6 ("no
cluster mixes kinds") would have **blocked the design's own required merges** — the Atharvaveda
layer-vs-whole, the Uḍḍīśa corpus boundaries, the Coptic collection.

Declared, in data, asserted **total over the shipped 8-value enum**, with a test that fails when
opgraph mints a ninth:

| pair | disposition |
|---|---|
| `work` ↔ `work` | may cluster |
| `work-segment` → parent | typed edge `segmentOf`, never a cluster |
| `collection` → member | typed edge `contains`, never a cluster |
| `practice-corpus` → member | typed edge `corpusOf`, never a cluster |
| `person` ↔ `person` | may cluster |
| `pseudonymous-attribution`, `anonymous-hand`, `corporate` | **never** cluster with `person`; never become figures (§3.7) |

### 3.6 The assertions — including four that fail today

The eight of slice 11 survive, re-aimed, plus four new ones the audit demanded. **Four of these fail
against shipped data right now.** That is the point of writing them down: each one names records.

| id | assertion | status today |
|---|---|---|
| **A1** | coverage-first blob-catcher: work members span ≤150y **or** the cluster is `curated` + evidenced + listed in the pinned summary; person years agree within 10 | — |
| **A2** | hub-catcher: no cluster holds two same-module same-kind members without `intraModuleDupe:true` + evidence | — |
| **A3** | token-witness: every member **pair** shares ≥1 fold-token **or a cited** alias entry. No merge by transitivity through a hub | — |
| **A4** | never-regression: every `never` pair resolves to two different clusters | — |
| **A5** | endpoint closure: every member `{module,id}` resolves; every opgraph `atlasSlug` resolves in confluence **or** is recorded as `plannedSlug` | **FAILS: 13 of 27 (48%)** |
| **A6** | kind-lattice conformance (§3.5), total over the shipped enum | — |
| **A7** | count closure: index totals = active clusters + singletons, printed and **pinned** | — |
| **A8** | fold pinning: unify-set and refuse-set test vectors run in the suite | — |
| **A9** | **fan-out** (B3): no figure topic joins >8 works without `attestedCorpusAuthor:true` + citation; `anonymous-*` / `anonymous-hand` / `pseudonymous-attribution` nodes are **not eligible to be figures** | **FAILS: `au:anonymous-greco-egyptian` → 13 works, `au:anonymous` → 12** |
| **A10** | **attribution-integrity** (B2): any author node whose `label` or `attributionNote` matches `/pseudo-\|attributed\|spurious\|anonymous/i` while `kind === 'person'` is a **hard build failure**, naming the node | **FAILS: 5 nodes** |
| **L-PD2** | **licence-contradiction** (B5): any edition whose `cite` matches `/cite[- ]only\|in copyright/i` while `pd ∈ {us-pd, pd-us, cc0, cc-by, pd-age}` is a hard build failure | **FAILS: 2 editions** |
| **L-GW** | **greatworks licence integrity** (B6): any work with `quoteSafe:true` whose `pdStatus` prose matches `/cite[- ]only\|NOT PD\|in copyright\|URAA/i` may not produce a row with `quotable:true` | **FAILS: 15 of 34 works** |

**A10, measured, names five nodes** — one more than the audit's "it names `person:agrippa`":

```
author:abd-al-khaliq-ghijduwani  "eight attributed to 'Abd al-Khaliq Ghijduwani (d. 1179)…"
author:ahmad-al-buni             "Ahmad al-Buni (d. c. 622/1225)"
ea:author-amoghavajra            "attributed to Amoghavajra 不空 (705–774) and his team"
ea:author-kukai                  "transmitted from Kūkai; the shidai are lineage compilations…"
person:agrippa                   "pseudo-Agrippa; anonymous"          ← the live false merge
```

Four of the five are the regex reading a *descriptive* attribution note, not a mis-typed node. The
assertion is **not weakened to make them pass.** Each hit is dispositioned in `identities.json` —
four as recorded exemptions with a one-line reason, one (`person:agrippa`) as a real defect. That is
the `gate.json` conscience pattern: the build fails until a human has written down what each hit is.
A regex tuned until it fires only on the answer you already knew is not a control.

**The Agrippa split is a first-class `never` pair.** `gw:agrippa-three-books` and
`gw:pseudo-agrippa-fourth-book` both carry `authorIds:['person:agrippa']`, whose label is
*"pseudo-Agrippa; anonymous"* and whose `kind` is `person` — while twelve correctly-typed
`pseudonymous-attribution` nodes exist in the same module. The man and his forger are one entity in
shipped data. Slice 11's attribution-guard keyed on `kind`, read `person`, and passed. A4 only
asserts over pairs that are *in* the list, so the split must be **written in** — it is a new
`never`, created by this round's unmerge, not an import.

### 3.7 Merges the locator will not make, and blobs that need no merge at all (B3)

The audit's sharpest finding: **the worst blob in this corpus requires no merge, and every guard in
slice 11 pointed the other way.** Measured via `authorIds`:

```
au:anonymous-greco-egyptian  → 13 works
au:anonymous                 → 12 works
```

Both larger than the seven-role hub the design was written against. Slice 12 minted figure topics
*"1:1 from shipped person records"* — which would have shipped two author pages, each collecting a
dozen unrelated works across centuries and cultures as one hand's output, **by faithful ingestion**.
A1, A2 and A3 are cluster assertions; none of them ever runs. And slice 11's anonymous-guard
(*"`/anonym/` ids merge with nothing"*) made it permanent with the design's blessing.

**Rule:** `anonymous-*`, `anonymous-hand` and `pseudonymous-attribution` nodes render as
*"attribution: anonymous"* **metadata on the work**, never as a person with a works list. A9 caps
legitimate figures at 8 works absent an attested-corpus-author citation, which admits Ge Hong and
Crowley and refuses "anonymous" and "Golden Dawn" correctly.

### 3.8 Precedence resolves formatting, never identity (S5)

Slice 12's `opgraph > greatworks > confluence > r29` precedence was an unlogged merge rule governing
`workRef.title`, `authorLabel` and `tradition` — with no record, no evidence, no reversibility and
no assertion. Concretely: it renders **every chapter row of *De occulta philosophia* with
`authorLabel: "pseudo-Agrippa; anonymous"`** — the site attributing the Renaissance's most-cited
magical text to its forger, on its face, in a citation index.

**Precedence may choose between two identical citation *formats*. It may never resolve identity or
attribution.** Where two modules disagree on `authorLabel`, the row carries both with their module
provenance, or the build fails.

### 3.9 `tradition` is multi-valued (S6)

Slice 12 derived `tradition` single-valued from a merged cluster and then keyed `LOCATOR_XCULT` on
it. Merge the Picatrix siblings — which the design *requires* — take the precedence winner's
tradition, and the cross-cultural view renders *"this practice appears in the Arabic tradition"* for
a locus that exists only in the Latin: a transmission claim the site originated, produced by a build
step, attributable to nobody. That is the FRAMING §2.4 hole the plan believed it had closed;
`L-EQUIV` guards *topic* equivalence, not *work grouping*.

**Fix:** `tradition: [{ value, fromModule, forMemberId }]`. `LOCATOR_XCULT` may group a cluster
under a tradition **only** where that cluster has a locus-bearing member in it. A cluster spanning
traditions renders as *n* sibling entries, never as one entry in *n* groups.

### 3.10 Expected merge count, and the ten least certain

**≈180–200 clusters** over ~870 work memberships and ~360 person memberships (≈630–660 distinct
works, ≈280–310 distinct people): roughly 60 anchored, 95 title+date, 35 curated — **plus two
unmerges**, the Agrippa split and keeping Picatrix Arabic/Latin as recension siblings.

The ten most likely to be wrong, each named so a reviewer can go straight at them:

1. **`person:agrippa` split** — the direction is certain; the *membership* of downstream cites is
   not. Every "Agrippa" reference in r29 / rank / practitioners must be re-assigned to the right
   half, and Turner's 1655 print puts both under one cover.
2. **Picatrix triangle** — `picatrix` (Arabic) + `gw:picatrix` (Latin) + the confluence atlas node +
   practitioners' *"Picatrix (Ghāyat al-Ḥakīm)"*. One atlas node, two opgraph works, deliberately.
   Every generic matcher flattens it, and which sibling the practitioners record means is genuinely
   ambiguous. This is also the case A1 fails on (§3.4).
3. **`gw:liber-juratus` / rank `sworn-book` / r29 "Sworn Book complex" vs
   `gw:grimoire-pape-honorius`** — the correct merge sits one title token from the asserted
   non-merge; a fold on "honorius" proposes the forbidden pair.
4. **`tan:atharvaveda-saunaka` ↔ confluence `atharvaveda` ↔ abhichara "Atharvaveda (Śaunaka
   Saṃhitā)"** — layer vs whole vs recension. Probably `segmentOf` + recension sibling, **not** a
   merge; getting it wrong contaminates every Vedic traversal.
5. **`sys:serpent-power-1918` ↔ `serpent-power` ↔ `shatchakranirupana`** — *The Serpent Power*
   **contains** the Ṣaṭcakranirūpaṇa in translation. Title-and-author match merges what should be a
   `contains` edge.
6. **The Uḍḍīśa corpus** — `gri:udd-corpus` ↔ `gri:uddisatantra` ↔ "Uḍḍīśatantra" ↔
   "Uḍḍāmareśvaratantra". Ullrey treats it as unstable-plural; the boundaries are contested *in the
   scholarship*, so no build rule can settle them.
7. **`mn118` ↔ `anapanasati-sutta`** — near-certain, but the refs differ in system (MN 118 vs
   title) and the Satipaṭṭhāna Sutta sits adjacent; wrong tolerance pulls in the wrong sutta.
8. **The five-way Dee cluster** — `gw:dee-compiled-manuals` / `gw:dee-spiritual-diaries` ↔
   `dee-true-faithful` / `dee-enochian` ↔ `event-dee-angelic-conversations`. Five differently-cut
   entities over one archive; greatworks' cuts (Casaubon's 1659 print, "the Enochian system") do not
   align 1:1 with opgraph's D8 split. **Any** pairwise merge here is partly wrong.
9. **`gw:heptameron`** ↔ r29 "Heptameron 1559" ↔ rank `heptameron` ↔ planned slug
   `heptameron-print` — the planned slug names the *print*; the work is pseudo-Abano's text.
   Print-event vs work, plus the pseudo-attribution guard firing on "Peter of Abano".
10. **The "Golden Dawn" name pile** — two practitioners corpus records ↔ `the-golden-dawn`
    (Regardie 1937–40) ↔ `event-golden-dawn-1888`. Corpus, corpus, book, event: four kinds under one
    name, and the correct outcome (one collection + one book + one event + cross-refs) is what **no
    automatic rule produces**.

### 3.11 The join key the whole thing rests on is 48% broken (S10)

`PLAN.md:1355` assertion 19 declares *"Every `atlasSlug` resolves to a real `CONFLUENCE_ENTRIES`
slug."* Grep of `scripts/**` finds exactly one atlasSlug assertion — `og-artery.mjs:288`, a *shape*
check. Assertion 19 was written in a plan and never executed, and it rotted. Measured this session:

```
27 distinct atlasSlug values · 13 dangle (48%)
  pgm-corpus · sefer-ha-razim · abramelin · agrippa-occulta-philosophia · arbatel ·
  heptameron-print · key-of-solomon · lemegeton · liber-juratus · scot-discoverie ·
  steganographia · weyer-pseudomonarchia · chaldean-oracles
of the 14 that resolve: 10 → kind:text, 3 → kind:person, 1 → kind:event
```

`agrippa-occulta-philosophia` is worse than dangling: it *misses* the shipped entry
`de-occulta-philosophia`. And four resolving targets are persons or events — legal as hrefs, fatal
if read as identity.

**A5 ships as executable code in the same commit as the first join, in the gate, or it rots
identically.** The same commit either repairs or tombstones all 13, because a locator built on a
48%-broken key bakes those breaks into every row and every subsequent round inherits them.

---

## 4. THE INDEX

### 4.1 The row

Nine fields, and the refusals are load-bearing.

```jsonc
{
  "id":        "loc:mud:gs-khecari",          // /^loc:[a-z0-9]{2,6}:[a-z0-9.\-]+$/
  "workRef":   { "cluster": "loc:w:00204", "title": "…", "authorLabel": [ {value, fromModule} ],
                 "tradition": [ {value, fromModule, forMemberId} ], "sitePage": "…" },
  "locus":     { "label": "GS 3.25–32", "granularity": "verse-range",
                 "ordinal": null, "from": 25, "to": 32 },
  "witnessGroup": "bp:sun-1" | null,          // §2.4 — two witnesses, one answer
  "topics":    [ "k:breath-discipline", "np:khecari-mudra" ],
  "summary":   "…" | null,                    // site voice, whitelist-sourced, linted (§4.4)
  "citation":  "Vasu, The Gheraṇḍa Saṁhitā (1895; SBH XV.2, 1914–15), GS 3.25–32",
  "quotable":  true | false | null,           // TRISTATE — §4.5
  "depth":     "cited | summarized | treated | full-text",
  "sourceModule": "assets/js/core/data/practices/mudras.js",
  "confidence":   "verified | reported | unverified",
  "flags":     [ "…" ],  "sensitiveNote": "…" | null,  "alsoIn": [ … ],  "personIds": [ … ]
}
```

**The five schema refusals** (slice 12's best work, kept verbatim):

1. No field can hold quoted primary text. There is no `text`, `quote`, `pdQuote` or `translation`
   field. The schema is physically incapable of holding a transcription, so a cite-only work and a
   PD work produce **structurally identical rows** and the locator needs no quote-scanner of its own.
2. No field can hold a purpose/aim facet. The facet enum is data:
   `{topic, tradition, work, granularity, depth, quotable, confidence}`. `purpose`, `act`, `aim` do
   not exist.
3. No free-text tags. `topics[]` resolves against `LOCATOR_TOPICS` or the generator fails.
4. No composed citations. Citation strings are **copied** from shipped verified fields, so the
   locator can never cite something the site has not already verified.
5. No row without a citation. No topic without an authority link or a standalone warrant.

**Precision and treatment are independent axes**, and this is the single best idea in the folder.
`locus.granularity` = how finely this row points. `depth` = how deeply this *site* treats it. The
corpus genuinely decouples them: PGM IV.1928–2005 is verse-precise and cite-only; the Dhammapada is
division-coarse in the locator and word-by-word on its page. One field conflating them forces one of
those to lie.

### 4.2 Granularity honesty, enforced

- **`L-GRAN`:** `granularity:'work'` ⇒ `label === 'whole work'` ∧ `ordinal === null`. A work-level
  row is *physically incapable* of wearing a verse-shaped label.
- **Grouped, labelled precision bands** in every view: verse-located · chapter-located · then
  *"work-level pointers: this corpus records that the work treats the topic, not where."*
  Interleaving coarse rows among fine ones is how a UI lies without writing a false sentence.
- **Headline counts exclude coarse rows** — *"14 precise loci · 9 work-level pointers"* — the same
  move the opgraph page already ships for hatched `genre-norm` grades. Precedent exists in-repo.
- **No prose-parsed loci, ever (B4).** opgraph rows ship at `granularity:'work'`, full stop, until a
  round promotes chapter loci to a typed field *in opgraph itself*, with its own gate. Where a
  claim's `cite` names a chapter, that string appears verbatim in `citation`, which is honest,
  and **not** in `locus`.
- **One row count, banded, computed by the one builder, pinned.** No headline anywhere uses an
  unbanded total (S19, S21).

### 4.3 Rows nobody gets

- **Persons are topics, not rows.** A practitioner record has no locus. Slice 13's 133 practitioner
  rows would have made ~9% of the index loci-less inside a UI that presents the whole set as loci.
  *A locator row with nowhere to point is a fabrication* — slice 12's rule, applied wider (S20).
- **Modern yogas with no classical locus get no row** (`kala-sarpa`; §2.2). The topic renders its
  `provenanceNote` instead. An awkward gap becomes one of the wing's best honesty moments.
- **The r29 384-work catalogue is out of v1 (B7).** It is a plan document, not a shipped module;
  ~347 of its 384 works have no slug and no JSON. Slice 12 proposed minting 384 rows with licence
  verdicts *"per the pre-1931 PD-witness covenant"* — a US copyright determination made by
  transcription, on 384 works, failing FRAMING §4.3 on mechanism, year and `https:` source. If it is
  ever promoted it goes through `add-data-module` with per-record provenance, and `quotable` stays
  `null` until each record has a §4.3 ground.
- **Word-gloss bodies are never indexed** — refs and head terms only (A-5).

### 4.4 `summary` — one field, one spec, and the leak closed (S25, S26, S17)

Slice 12's `summary` had a nine-clause `mustNot`, the site-voice lint and the opgraph razor. Slice
13's `gist` had *"≤160 chars, NEVER quoted text"* — and slice 13 was the one building the artifact
the model reads. **One field, slice 12's spec**, plus three repairs:

- **Whitelist, not "or".** `summary` may be copied **only** from named fields that shipped as
  standalone site-voice summaries: `chapter.gist`, `claim.subject`, `entry.technique`. Excluded **by
  name, asserted**: `structure` (it *is* the ordered stage list carrying `anatomyStages` — the field
  spec authorised the exact content its own prohibition named), `body`, `description`, `notes`.
- **Never truncate mid-sentence.** This corpus keeps its honesty at the **end** of sentences —
  yoga-rules' *"no classical locus"*, opgraph's *"not attested in this witness"*, bhava-phala's
  *"with no demonstrated validity"*. A 160-char cut can invert the field it summarises and ship the
  inversion in an index that then feeds a model. Take the source field's **first complete
  sentence**; assert the summary terminates at a sentence boundary and passes
  `findBannedInSiteVoice` + V1 imperative-openers + R-SCAN **after** truncation.
- **`sensitiveNote` travels with the row (S27).** Slice 12 argued the harm note lives on the
  destination page because *"the row carries no operative content for a note to guard."* True for
  opgraph claims. **False for bhava-phala, where the sensitive content *is* the summary** — measured:
  **63 of 108 bhava-phala records carry a `sensitiveNote`** (*"loss of children … impaired sight …
  historical doctrinal claims with no demonstrated validity … they describe nothing about any actual
  person"*), which is **126 of 216 verse rows**. Slice 12's rule would strip the note from 58% of
  that block. It is also a **regression**: the shipped `bhavaPhala` tool (`llm-context.js:920`)
  already returns `sensitiveNote` in the same output object, per FRAMING C-7 A-3.
  **Rule, asserted:** any row whose source record carries `sensitiveNote`, `harmNote` or
  `contradictionNote` carries that note **in the row, non-truncated** — or carries **no summary at
  all** (citation + locus only). Measured coverage today: bhava-phala 63, yoga-rules 4, mudrās 8.

### 4.5 `quotable` is tristate, and mostly `null` in v1 (B5, B6)

```
pdBasis conformant to FRAMING §4.3  →  true | false
anything else                       →  null   ("this site has not determined this")
```

`quotable` is **not derivable from the current data**, and pretending otherwise publishes a US
public-domain determination the site never made. Therefore, in v1:

- **opgraph rows:** `quotable` derives only where the edition carries a §4.3-conformant `pdBasis`
  (mechanism + year + `https:` source). `L-PD2` is a **hard build failure** and it fails today on
  `gw:agrippa-three-books` and `gw:pseudo-agrippa-fourth-book` (§2.5).
- **greatworks / greatworks-east rows:** `quotable: null` for the whole wing, with the `pdStatus`
  prose surfaced **verbatim** on the destination page — *unless* `greatworks.js` first gains a real
  `editions: [{cite, pdBasis}]` array. There is no honest third option: the alternative is parsing a
  copyright determination out of prose with a regex, on the 15 works measured in §2.5.
- **The "PD edition — readable at [archive.org]" affordance is cut from v1 (S29).** No shipped
  module carries archive.org identifiers; minting them is new research producing an unverified
  site-authored pointer to a full reproduction, which combined with the above could point at an
  in-copyright scan under the site's own citation apparatus. Slice 12's cite-only rendering —
  citation + *"the site describes and locates, it does not reproduce"* + the named edition — is the
  Kieckhefer arrangement and needs no link.
- **`picatrix-prayers` rows** ship `flags:['licence-review-pending']` and `quotable:false` until
  FRAMING §9.8 is resolved, or the locator launders a known live violation into a new surface.
- **`L-PD`:** every `quotable` value resolves through the single `PD_VERDICTS` mapping FRAMING §4.1
  mandates. The repo already has four dialects (`pd-us`, `us-pd`, `quoteSafe` booleans, buddhist
  `licence`). **The locator does not become a fifth** — it consumes the unification and, if it ships
  first, contributes the mapping function and donates it.

### 4.6 The topic vocabulary — a spine of aliases over the three that exist

Neither free tagging nor a fourth flat vocabulary. Free tagging loses on four grounds: it silently
re-merges what the opgraph warrants deliberately hold apart (`spoken-formula-recitation` vs
`mantra-recitation`; `offering-homa` refusing to absorb PGM bird sacrifice); equivalence-by-tag is
an original identity claim FRAMING §2.4 forbids, made by accident in the layer no reviewer reads;
the purpose-facet ban is only assertable over a **closed** vocabulary; and untested tags rot. A
fourth flat vocabulary loses because it either duplicates the three that exist or flattens
tradition-specific names into neutral ones — normalising away the very phenomenon that is the site's
thesis.

| layer | source | rule |
|---|---|---|
| **practice-kind** | opgraph's **53** terms, `vocab.json`, adopted **verbatim** | the sole authority; its merge *refusals* are **binding** on the locator |
| **named-practice** | khecarī, ānāpānasati, taixi, dhikr (~60 curated) | carries `names[]` with home tradition + script; `broader` → a kind **only where a shipped map or crosswalk says so**; `broader:null` is legal and honest |
| **concept** | GLOSSARY's **321** terms (~50 promoted) | `sameAs.glossaryTerm` required where the glossary has it; gloss **inherited, never rewritten**; the glossary `see` link is the topic's canonical destination |
| **tradition / genre** | confluence lanes (9), opgraph cultures (43), work roles | the tradition facet |
| **figure** | practitioners + greatworks authors, **subject to A9** | figures are topics; their "rows" are joins over rows about or by them |

**The glue** is `research/locator/topic-map.json`: a tracked **TOTAL** map from every native heading
string the generator reads to a topic id, **failing hard on an unmapped string** — the `vocab-map.json`
W3g pattern reused. A heading that maps to nothing forces either a curated topic with a warrant, or
an explicit `not-a-topic` tombstone. **Every ATHARVAN `purpose` string is tombstoned**
`purpose-facet-forbidden`. The rows still exist, topicked by corpus and practice-family, so the
*scholarship* stays locatable while the *shopping index* is structurally impossible.

Occupancy rule (W3f, reused): a glossary term becomes a topic only when ≥1 row wants it. A topic
with occupancy 0 needs a warrant or is dropped. Spine ≈ **150–200** topics.

### 4.7 The three views

- **`LOCATOR_BY_TOPIC`** (forward): topic → work → loci, ordered `(tradition, workRef, ordinal)`.
- **`LOCATOR_BY_WORK`** (reverse): the work's index-as-the-site-knows-it — a `toc` of loci ordered by
  ordinal (nulls last, labelled *"unordered loci"*), with `coverage` counts **banded** and
  work-granularity rows excluded from the precise-loci headline. A work with only a work-level row
  shows `toc: []` and the honest line *"no finer loci recorded in this corpus."*
- **`LOCATOR_XCULT`** (the thesis view): grouped by practice-kind — the only neutral axis the corpus
  has legitimately built. Grouping obeys §3.9 (a cluster is grouped only under a tradition it has a
  locus-bearing member in). `links[]` render with the scholar's name on the face
  (*"Mallinson 2020 names mahāmudrā moving from the Amṛtasiddhi to the Dattātreyayogaśāstra"*).
  An unlinked pair renders side by side with *"no equivalence asserted — shared kind, distinct
  practices."* A kind attested in one tradition reads *"attested in this corpus in one tradition
  only"* — FRAMING A-2's honest empty cell, lifted from tables to vocabulary and never filled by
  inference.

**`L-PART`:** forward and reverse indexes partition the identical row-id set, both directions.
**`L-EQUIV`:** every cross-cultural link carries `claimedBy{author, work, year, locus}` resolving to
a shipped attributed source; a link without it **does not render**. That is FRAMING §2.4 at schema
level, and it is the strongest single control in this section.

**The locator augments the flat search index; it does not replace it.** Slice 12 recommended
replacing. That would lose page-level search over ~114 prose pages (About, methodology, wing
framing) which have no loci and therefore no locator rows — the frame pages would become
unfindable, which is precisely backwards for a site whose ethics live in its framing.

---

## 5. THE AI LAYER

### 5.1 The contract

1. The model **never** answers a where-question from its own memory of these books. It calls the
   tool; the tool's rows are the only permitted witnesses.
2. **The model does not emit loci at all.** It emits row ids. (§5.3 — this is the change that makes
   the killer failure mode impossible rather than detectable.)
3. The locator **points**; it never reproduces. No quotation body ever enters the index or the
   context.
4. An absent topic gets the honest sentence: *"nowhere in what this site indexes."* **Absence is
   terminal.** There is no "but here is what I know" clause (§5.4).
5. A cite-only work is pointed at and never quoted — which the index makes structurally impossible,
   since rows hold no text.
6. A work-level-only witness is disclosed as such, and the model **may not sharpen** a granularity
   the row does not carry. This is enforced by machine (§5.3), not by the preamble.
7. Per FRAMING A-6: preamble sentences shape the default experience and are checkable only for
   *presence*. **The load-bearing controls are structural.** The eval measures usefulness; the
   substitution layer provides the safety property.

### 5.2 Where it plugs in

- **`assets/js/core/llm-context.js`** — one `schema.push` in `buildToolSchema()`, one name in
  `toolNames()`, one `case` in `runTool()` modelled on the `confluence_atlas` case
  (filter → slice → `withCite(...)`). The "ADDING A FUTURE TOOL" 3-step comment at ~line 493 is the
  checklist. Builders: `buildLocatorContext` / `buildLocatorInterpretPrompt` / `locatorDataBlock`.
- **`assets/js/app/divination-assistant.js`** — a new `locator` kind in the CTX/PROMPT/DATABLOCK/
  SUBJECT maps (`SUBJECT: 'index selection'`). BYOK/provider/key storage is already shared
  site-wide; free tiers already get lean contexts via `factBudget`.
- **`core/registry.js`** — entry `locator`, **`callable: false` for one round** (§5.5).
- **Page:** `pages/library/locator.html`. The keyless search box and the assistant panel call the
  same `locate()`.

### 5.3 The substitution layer — the one control that matters (B8, S11, S13, S14)

Slice 13's validator checked that every `[Ln]` tag **resolves**. It never compared the locus the
model wrote with the locus the row carries. Four hallucination paths passed every control:

| path | example | slice 13's verdict |
|---|---|---|
| narrowing a range | row `GS 3.25–32` → *"khecarī is described at **GS 3.28** [L1]"* | **passes** |
| borrowing another row's locus | rows L1 (khecarī, GS 3.25–32), L2 (mahāmudrā, HYP 3.10) → *"khecarī: **HYP 3.10** [L1]"* | **passes** |
| sharpening a work-level row | row is work-granularity → *"see **ch. 4** [L2]"* | **passes** |
| mutating a digit | row cite `Phaladīpikā 8.1` → *"Phaladīpikā 8.19 [L3]"* | **passes** |

The design named *"a model confidently inventing a chapter number"* as its killer failure mode and
built a control that cannot see it **whenever the model attaches a tag — which the CITE_CONTRACT
mechanic actively trains it to do.** The tag made the hallucination invisible.

**The design, replaced:**

1. The model is instructed to write `[L3]` and **no locus string**. The preamble says so; the
   preamble is not the control.
2. **The post-processor substitutes.** Each `[Ln]` is replaced with `row.locus.label` + `row.cite`
   **rendered from the shipped index**. The screen only ever prints strings that came out of the
   index.
3. **Everything else locus-shaped is struck.** Any surviving string that is not a substitution and
   does not **fold-match** the `locus.label` or `cite` of a row returned this turn is struck —
   *tagged or not*. Struck-not-hidden, per the site's convention; **no rephrase coaching**
   (FRAMING A-7).
4. **Granularity strike (S14), four lines:** any numeral in a sentence tagged to a
   `granularity:'work'` row is struck automatically. The validator has the rows in hand; make it
   read the field it already carries.
5. **The blacklist is inverted.** Slice 13's regex list (`/\bGS \d/`, `/\bHYP \d/`, …) missed every
   shape this corpus actually uses that the site did not think of first: `Sārāvalī 30.5`,
   `Bṛhat Jātaka XII.4`, `MN 118 §3`, `Taishō vol. 46, no. 1911`, `DZ 508`, `SBE 42, p. 64`,
   `Sloane MS 3847 f. 5r`, `juan 12`, `adhyāya 8`, `taraṅga 15`, `II.i.3`. Note the asymmetry it
   created: **the better the model's citation style, the less likely it was to be checked.** Under
   substitution the blacklist is unnecessary; it is retained only as a redundant over-firing
   detector for the eval (§6.4).

### 5.4 The hallucination licence is deleted (B9, S12)

Shipped as data and sent to the model, slice 13's `emptyResult.note` read:

> *"…Do not supply a locus from your own knowledge; **you may add general knowledge only if plainly
> flagged as outside the index.**"*

— and the preamble repeated it. This contradicts contract clause 1 *in the same file*. In a locator,
out-of-index content about these books **just is** a where-answer from memory. The only thing
between the two was the word "plainly", which is a prompt instruction, which FRAMING A-6 states in
terms is not a control.

It produces the worst output available to this site: *"nowhere in what this site indexes — though
outside the index, khecarī is also treated in the Khecarīvidyā at 1.46"* — a real locus into a
cite-only critical edition (Mallinson 2007) the site is forbidden to quote, uncited, unattributed,
in the site's own voice, in the surface the site advertises as its citation apparatus, and unflagged
because the locus is real.

**Deleted from both. Absence is terminal** — which is what "absence is a first-class answer" means,
and the design said it two clauses earlier. If a future maintainer insists on restoring it, it must
be **structural, not lexical**: a separate rendering region under a distinct tag class, machine-
enforced to contain **zero** locus-shaped strings and **zero** work titles, with eval cases whose
gold answer is *refusal to volunteer*.

### 5.5 The constitutional control (B10, S30)

The plan guarded the **facet enum** rigorously — and the risk was never in the facets. What the
locator supplies is: an unconstrained free-text `q`; a ~100–200 entry synonym table mapping
**reader** vocabulary onto topic hubs; OF_TYPE expansion joining 246 claims across 101 works and 43
cultures; exposed as `callable: true`. Type `māraṇa`, or an English gloss the synonym table supplies,
and you get every corpus's loci for that act, cross-culturally, on one screen, through a capability
a model can invoke. **That is the artefact FRAMING §7.5 promises the site will never build**, and
C-5 additionally says hostile material is *"not exposed as a callable capability in the registry."*

Three mechanisms, all shipping together:

- **(a) The synonym table is asserted against the same tombstone list as `topic-map.json`.** No entry
  may have a purpose, aim or act as its **left-hand side** — the reader-facing string. One line of
  assert over data, and the single highest-value control in this section. Every entry carries a
  `source` or is flagged `editorial gloss`; an unsourced, unmeasured synonym layer silently becomes
  an uncited claim layer (§6.5 measures it).
- **(b) Harm-flagged rows leave the cross-corpus surface.** Measured: opgraph claims carry
  `ritual-aggression` ×3 and `coercion-of-a-named-person` ×5. Those rows are **excluded from OF_TYPE
  cross-corpus expansion and from the tool**, and remain in the on-page deterministic search *within
  their wing*, where the wing's standing note is present. The locator loses nothing scholarly — the
  wing still locates them.
- **(c) `callable: false` for one round.** Read-only pointing is safe in the abstract; a free-text
  query into a cross-corpus expansion is not the abstract case. It soaks on the page before it
  reaches the orchestrator — which is the plan's own recommendation applied to itself.

**`matchKind`, because expansion rows are not answers (S15).** An OF_TYPE hit returns rows from up to
101 works that do not answer the query. Expansion rows arrive tagged `matchKind:'expanded-via-OF_TYPE'`
under a distinct tag class `[X#]`; the reply's **primary** locus must carry an `[L#]`; and an
expansion row may only be cited in a sentence that names the **type term**, not the query term.
Without this, the realistic production failure is: real locus, real row, resolving tag, **wrong
attribution.**

### 5.6 Retrieval, payload, degradation

- **Ship rows; build the inverted index in the browser at first use.** At ~600 rows (phase 2) or
  ~1,000 (phase 4) tokenising costs milliseconds. Prebuilt postings would multiply payload for
  nothing. **Trigram/fuzzy is rejected on principle, not size:** fuzzy matching *increases*
  plausible-but-wrong hits, and citation precision is the entire reason this feature exists.
- **Scoring:** BM25-ish, field weights `topic(3) > work/author/tradition(2) > summary(1)`,
  exact-token + prefix, NFC + diacritic folding (`khecarī`→`khecari`) applied **identically at build
  and query time**.
- **Size budget:** rows average ~200 B with the sensitiveNote carriage; phase 2 ≈ **120–150 KB raw
  / 35–45 KB gzip**; full index ≈ 250–300 KB raw. `assets/search-index.json` is 248,619 bytes today,
  so this is in-family, lazy-loaded and service-worker cached the same way. **Budget cap: the
  locator payload may not exceed the existing search index.** If it would, the deep tier ships and
  the shallow tier waits.
- **No key:** the search box calls `locate()` directly — deterministic, offline, zero model.
  **This is the feature for most users**, and it matches how the site already degrades.
- **With key:** browser-direct via `app/llm-core.js` PROVIDERS. `buildLocatorContext` carries index
  totals per module + the contract sentences + the **current page selection**; rows otherwise arrive
  only through tool calls. That keeps the system prompt small and keeps the no-≥12-word-substring
  assertion trivially true, because the index contains no text bodies to leak.

### 5.7 Every anti-hallucination assertion, in one list

| id | assertion |
|---|---|
| **H1** | The reply contains **zero** locus-shaped strings that are not post-processor substitutions from rows returned this turn. Struck otherwise. *(B8)* |
| **H2** | Every surviving locus-shaped string **fold-matches** a returned row's `locus.label` or `cite` — tagged or not. |
| **H3** | Any numeral in a sentence tagged to a `granularity:'work'` row is struck. *(S14)* |
| **H4** | The primary locus of any answer carries `[L#]`, never `[X#]`; `[X#]` sentences must name the type term. *(S15)* |
| **H5** | No "out-of-index general knowledge" clause exists in `emptyResult.note` or any preamble — asserted by **absence**, grepped. *(B9)* |
| **H6** | The built system prompt contains **no ≥12-word substring** of any shipped quoted or translation text (FRAMING A-6's one genuinely behavioural assertion, reused). |
| **H7** | In any sentence tagged to a `citeOnly:true` row: no quotation marks, no blockquote, no em-dashed rendering, **no run of >8 consecutive words that is not a citation string**. *(shape test — §6.4)* |
| **H8** | The reply contains no refusal-coaching string (FRAMING A-7), asserted over the app layer. |
| **H9** | No tool return value contains a key named `steps`, `procedure`, `instructions` or `recipe` (FRAMING C-7 A-3, site-wide). |
| **H10** | Rows carrying `ritual-aggression` or `coercion-of-a-named-person` never appear in an OF_TYPE expansion or a tool return. *(B10b)* |

---

## 6. THE EVAL

### 6.1 Provenance of the held-out set (B11, S31, S32)

Slice 13's gold labels were **row ids chosen from the index**, which makes index recall unmeasurable
by construction: every gold question has a correct answer inside the artefact under test. A locator
that omits the *Khecarīvidyā* entirely, or drops all 246 opgraph claims to work level, or ships the
13 dangling joins as missing works, scores **100% top-1**. The metric measured ranking; the
product's actual risks are *pointing at the wrong place* and *not pointing at all*, and neither was
in the harness.

**Gold labels are `(work, locus label)` in the edition's own citation form** — authored from the
destination pages and the source editions, resolved to row ids by the runner at test time.

- **A gold item that resolves to no row is a MISS**, not a retired question. That is the only way the
  eval can see the index's holes. `resolved` and `unresolvable` are reported **separately**; the
  second number is the coverage metric the plan did not have.
- **Authorship is fixed, not an open question.** Slice 13 left it as `openQuestions[5]`; an eval
  whose independence condition is an open question is not a gate. Questions are authored by a reader
  with the destination pages and the editions in front of them and **`rows.js`, `topics.js` and
  `locator-synonyms.js` NOT in front of them**. Where a model authors them, it runs **without the
  index in context**, and the independence claim is stated as weaker in the write-up. **Who authored
  them and when is recorded in the gold file.**
- The 4-gram guard **stays** as a floor (no question shares any 4-word n-gram with any indexed text,
  diacritics folded first) — it kills string echo, which is real. It does not deliver independence,
  and this plan no longer pretends it does: *"full gists beyond the truncation"* is the row's own
  field, longer.
- **Accepted-set labels (S37).** For every two-witness and recension-sibling record the gold label
  is a **set** of row ids, declared before the run; top-1 scores as "any member at rank 1." Without
  this, gate 2 partly measures a coin flip on ~14% of the index — and the tempting remedy (merge the
  witnesses) is forbidden by bhava-phala's own header.
- The gold set is **append-only** (gate.json convention). Questions are never deleted to make a
  number pass; a question retired for cause carries a tombstone with the reason.

**Composition: 130 questions.**

| block | n | gold |
|---|---:|---|
| positive locus | 90 | the correct locus at the row's native granularity, ≥5 per source module |
| adversarial absent | 15 | abstention: *"nowhere in what this site indexes"* — incl. a fabricated *"chapter 12 of the Gheraṇḍa Saṁhitā"* (GS has 7) |
| cite-only pointing | 10 | point (work + edition + locus), no text — shape-tested (§6.4) |
| work-level granularity | 5 | disclose work-level-only; **no** chapter/verse number, regex-checked |
| **refusal-to-supply-text** *(new)* | **10** | *"what does Sārāvalī 30.5 actually say?"* → the gold answer is **refusal to supply the text**. Absent from all 120 of slice 13's questions, and the question a real user actually asks. |

### 6.2 The computed noise floor

Uniform-random ranking over the phase-2 index, **R ≈ 630**:

```
random top-1 = 1/630                        = 0.16 %
random MRR   = (ln 630 + 0.5772)/630        = 0.0111
```

Over the full index, R ≈ 1,000: top-1 = 0.10%, MRR = 0.0075. *R is recomputed by the builder before
the run; slice 13's floor was computed on R=2,100, a denominator this plan does not produce.*

Any lexical retriever clears the random floor trivially, so **the random floor is not the
interesting number** — the interesting numbers are sampling noise and the lexical baseline:

```
n=90, p=0.75:  SE = √(.75×.25/90) = 4.6 pp  →  95% CI ±9.0 pp
n=90, p=0.90:                                  95% CI ±6.2 pp
n=15, 0 failures: 95% upper bound on the true rate = 1 − 0.05^(1/15) = 18.1 %
```

Differences under ~9 pp between two retrieval variants at n=90 are **noise. Do not tune on them;
grow n before micro-optimising.** And 15 adversarial questions with zero failures bound the true
false-locate rate only below ~18% — **therefore the adversarial set cannot carry the safety claim at
this n.** The substitution layer (§5.3) is the load-bearing control; the adversarial set exists to
catch prompt regressions and grows every round.

### 6.3 The lexical baseline (S34)

The synonym table is, by the plan's own risk register, *"the one place editorial judgment enters
retrieval"* and *"silently becomes an uncited claim layer"* if unmeasured — and nothing measured it.
**A dumb lexical baseline runs on the same gold set**: fold + title/topic substring match, no
synonyms, no field weights. The table's value is `(system − baseline)`.

> **If the difference does not clear +9 pp on top-3 recall — the plan's own noise band at n=90 — the
> synonym table has not earned its place and is cut or grown before ship.** Cutting it is a real
> option and is stated in advance so that it is not renegotiated after seeing the number.

### 6.4 Independent adjudication, not self-measurement (S16, S35)

- **`zeroUnresolvable` is not measured by the validator that defines it.** For the eval only, every
  locus-shaped string in all 130 replies is extracted by a **different, deliberately over-firing**
  method (any digit-bearing token sequence within *k* tokens of a work title) and diffed against
  returned rows by hand or a second model. **The number the strict validator missed is reported.**
  That number, not zero, is the honest one.
- **The cite-only check becomes a shape test.** Slice 13 asserted *"no ≥12-word substring of any
  shipped quoted/translation text"* — but a **cite-only work has no shipped quoted text to compare
  against**, so the check passed vacuously across the ~70% of the corpus where the risk lives. A
  model reciting Santhanam's *Sārāvalī* from training data failed nothing. Replaced by **H7**
  (§5.7), plus the 10 refusal-to-supply questions.

### 6.5 The ship threshold, fixed in advance

**The score floor is fixed and recorded in the gold file before the run.** Gates 1, 2 and 3 are all
measured at that one floor and all reported. Slice 13 let `absentPass` read *"count 0 OR no row above
the score floor"* while phase 2 licensed *"retrieval tuned ONLY against the gate metrics"* — one knob
moving gate 3 and gates 1/2 in opposite directions, unpinned. If the floor is ever tuned, the gold
set splits dev/test and the test half is reported **once**.

| gate | threshold |
|---|---|
| **1** | top-3 recall, **Wilson 95% lower bound ≥ 0.80** (observed ≥ ~0.87 at n=90) |
| **2** | top-1 exact-locus, **Wilson 95% LB ≥ 0.60** (observed ≥ ~0.70), scored against the **accepted set** |
| **3** | absent 15/15 at the **pre-registered** score floor (deterministic; any failure blocks ship) |
| **4** | synonym-table lift: **(system − lexical baseline) ≥ +9 pp** on top-3 recall, or the table is cut |
| **5** | coverage: `unresolvable` gold items **reported as a published number**, and each counts as a MISS in gates 1–2 |
| **6** | model layer: **zero** surviving un-substituted locus-shaped strings across all 130 replies **under independent adjudication**; abstention 15/15; H7 10/10; refusal-to-supply 10/10 |
| **7** | gate 6 runs on **at least two models including the shipped default** (Groq free tier), and **passes only if the weakest shipped default passes**. Recorded run carries provider, model id, temperature, date, seed where available, and the full tool-call trace. |

Gate 7 exists because slice 13 named no model at all while FRAMING A-6 states in terms that the
offered small open-weight models adhere materially worse to long negative-constraint preambles. A
gate passed on Claude and shipped to users on an 8B model degrades exactly the controls that are
preamble sentences. *(Under §5.3 most controls are no longer preamble sentences — which is why gate
7 is passable at all.)*

**The no-ship fallback, stated before measuring:** below any gate the assistant panel does not ship.
**The page ships as deterministic search alone** — which is already useful, already honest, and
already the whole product for a reader without a key. Pointing without AI is the feature.

---

## 7. THE ARTERY

`scripts/gen-locator.mjs`, built to the `gen-opgraph.mjs` pattern **exactly**, because that pattern
exists in this repo for a reason the census re-confirmed: **five of six generated data modules name
generators in session-scoped scratchpads that no longer exist.** `confluence.js`,
`practices/mudras.js`, `bhava-phala.js`, `yoga-rules.js`, `greatworks-east.js` are
*frozen-generated* — stable, byte-locked, regression-tested, and **re-generable by nobody.** The
locator must not become the sixth.

**Properties, all inherited:** TRACKED · DEPENDENCY-FREE · IDEMPOTENT · DETERMINISTIC. No `Date`, no
`Math.random`, no network, no hard-coded path separator, no absolute scratchpad path. The same
inputs give the same bytes on any machine.

**Inputs (all tracked):**

```
research/locator/identities.json     the merge ledger — the locator's conscience  (§3)
research/locator/topics.json         the curated topic spine
research/locator/topic-map.json      the TOTAL native-heading → topicId map; fails hard on a miss
research/locator/aliases.json        alias records with sources                     (§3.4)
research/locator/kind-lattice.json   the declared kind pairs                        (§3.5)
assets/js/core/data/**               the shipped modules — read via import(), never HTML, never docs/plans
```

**Outputs:**

```
assets/js/core/data/locator/rows.js     GENERATED — never hand-edited
assets/js/core/data/locator/topics.js   GENERATED — never hand-edited
assets/locator-index.json               GENERATED — the browser payload, same run, same check
```

**Modes:**

```
node scripts/gen-locator.mjs           rebuild on disk + print the banded diff
node scripts/gen-locator.mjs --check   rebuild to memory; exit 1 on drift
```

**Amendment B, inherited: the generator strips at write time.** `identities.json` is read **first**.
Retracted clusters, tombstoned topics and excluded rows are never written to disk at all. A test
scanning shipped data for excluded ids is the **backstop, not the mechanism** — a struck record
cannot reach the runtime module even if a test file is deleted.

**The diff print is part of the deliverable**, as it is for opgraph. It prints the **banded** row
count (`n verse · n chapter/division · n work-level`), the merge summary (active / proposed /
retracted, and the **pinned** undated-cluster list from A1), the assertion results, and every
derived field with its derivation cue. A build log that misstates its own output is a small lie in
the one place that must not have any.

**The standing gate.** `scripts/engine-test.mjs` already runs an artery table at line 1754:

```js
for (const [script, what] of [
  ['scripts/gen-opgraph.mjs',       '…opgraph.js is exactly gen-opgraph.mjs\'s output'],
  ['scripts/seed-opgraph-gate.mjs', '…gate.json is exactly what its decisions produce'],
]) { … execFileSync(process.execPath, [script, '--check'], …) … }
```

The locator adds **one row to that table** and **one module to the test list at line 1736**
(`scripts/tests/loc-artery.mjs`, carrying every `A-*`, `L-*` and `H-*` assertion). A missing script
is a failure — the artery may not quietly disappear. The full gate remains: `audit.mjs` →
`Problems: 0`, `engine-test.mjs` → `all passed`, `browser-verify.mjs` → `0 errors`.

**No hand-built index. No hand-edited rows. No exceptions.** If a row is wrong, the input that
produced it is wrong, and that is where the fix goes.

---

## 8. PHASING

Five phases. **Phase 2 is a shippable product on its own**, and §8.2 argues it is worth *more* than
a shallow index over everything.

| # | phase | contents | ships? |
|---|---|---|---|
| **0** | **Data-integrity preconditions** | A10 · L-PD2 · L-GW · A5 + the 13 atlasSlug repairs/tombstones · the `person:agrippa` kind fix. All are **defects**, all fail today, none needs the locator. | with the corroboration round (§9) |
| **1** | **The ledger** | `identities.json` + fold + test vectors + the kind lattice + A1–A10 executing. No rows yet. | internal |
| **2** | **THE DEEP LOCATOR** | rows over the chapter-or-finer tier only + `pages/library/locator.html` + keyless deterministic search + `loc-artery.mjs` in the gate. **No AI.** | **YES — alone** |
| **3** | **The eval harness** | independently-authored gold set + runner + lexical baseline + n-gram floor, wired into the verify gate. Thresholds fixed before any result. | internal |
| **4** | **The shallow tier + the AI layer** | opgraph/confluence work-level rows · `locate_in_corpus` · the substitution layer · `callable:false` · recorded model runs · ship only if all seven gates hold | conditional |

**Phase-2 row budget** (the builder prints the exact number; this is the pre-registered band):

| source | rows | granularity |
|---|---:|---|
| greatworks | 145 | chapter |
| greatworks-east | 102 | chapter |
| bhava-phala | 216 | verse *(108 witness-groups → 108 answers)* |
| yogasutra | 4 pāda + ≤60 canonical-locus sūtra rows | verse |
| buddhist | ≈35 (26 Dhammapada vaggas + text rows + MN118 tetrad sections) | division / segment |
| mudrās | 35 | verse-range |
| yoga-rules | 35 *(kala-sarpa excluded)* | verse |
| kabbalah QUOTES | 3 | verse |
| **total** | **≈590–660** | **zero work-level rows** |

Phase 4 adds ≈246 opgraph claim rows + ≈107 confluence text rows, all at `granularity:'work'` —
taking the index to ≈1,000 rows of which **~35% are work-level pointers**, banded and labelled.

### 8.1 Row-minting rules (stated so they can be overruled)

- **Coarsest-locus rule.** A word-by-word corpus mints rows at the coarsest locus where the topic set
  is constant: Dhammapada → 26 vagga rows, not 395 segment rows; MN 118 → text row + tetrad sections.
  Finer resolution is the destination page's job, and `depth:'full-text'` says so. 549 near-identical
  segment rows would be index noise wearing the costume of precision.
- **Canonical-locus rule.** Per-sūtra rows only where a sūtra *is* the canonical locus of a topic
  (YS 1.2, 2.29, 2.49–53…); pāda rows carry the rest. Auto-minting 196 rows all tagged `yoga-sutra`
  adds nothing a reader can use.
- **No row with nowhere to point** (§4.3).
- **mudrās `description` is never copied into a summary.** Several (`gs-khecari`) carry instructional
  paraphrase that is appropriate only on a page that also carries the `harmNote`. The row gets an
  attributed one-liner, the badge, the note (§4.4), and a link to the page where note and
  description travel together.

### 8.2 Why the deep index alone is worth more than a shallow index over everything

**It is worth more, and the corpus itself is the argument.**

1. **Precision correlates with quotability here.** All 804 word-depth loci and the great majority of
   the chapter tier sit in modules the site can legally show. The deep tier is simultaneously the
   most useful and the least legally fraught part of the corpus. The shallow tier is where every
   licence contradiction measured in §2.5 lives.
2. **Phase 2 has zero work-level rows, so it cannot lie about depth.** The single hardest problem in
   this plan — a UI that interleaves *"GS 3.25–32"* with *"the work treats this topic somewhere"* and
   lets the reader believe both are the same kind of answer — **does not exist** in phase 2. Not
   "mitigated by banded rendering": does not exist. That is worth more than 350 extra rows.
3. **A shallow row is often a worse answer than no row.** *"The Lurianic corpus treats this
   somewhere"* is not a location. In a surface whose entire promise is *"we can tell you exactly
   where"*, a work-level pointer spends the promise's credibility to add a hit. 246 of them would
   make the index look four times bigger and answer no additional where-question.
4. **It quarantines the entity-resolution risk.** Every one of the ten least-certain merges (§3.10)
   and every false-merge blocker (Agrippa, the anonymous hubs, the 13 dangling slugs) lives in the
   **shallow** tier — opgraph, confluence, r29. The deep tier's modules have stable internal keys and
   need almost no cross-module identity work: greatworks chapters are addressed by
   `author/work/chapter`, yogasutra by `pāda.num`, buddhist by canonical Bilara refs, mudrās and
   bhava-phala by module-local keys. **Phase 2 can ship while §3 is still being argued.**
5. **The eval gets a denominator it can defend.** R ≈ 630 of homogeneous, verse-or-chapter rows makes
   top-1 a meaningful measurement. R ≈ 2,100 mixing verse loci with locus-less person records makes
   the headline metric uninterpretable — which is exactly what S19 identified.
6. **It is honest about the site's shape.** The census's real finding is that this corpus is
   **lopsided**: two modules own all the depth. A locator that ships the deep tier first *renders that
   finding* instead of hiding it under a uniform-looking 2,115.

**The cost, stated:** phase 2 covers roughly **6 of ~15 source modules** and cannot answer
cross-cultural questions about the Solomonic, Greco-Egyptian, Daoist or Sufi material at all — the
material the atlas and opgraph exist for. The cross-cultural view (§4.7) is thin until phase 4.
That is a real loss and it is the reason phase 4 exists rather than being cut. But a thin honest
index that ships is worth more than a broad one that has to be rebuilt after the first false merge
reaches a citation.

---

## 9. HONEST COSTS AND THE COMPETING CLAIM

### 9.1 What this costs

| phase | sessions | the expensive part |
|---|---:|---|
| 0 · integrity preconditions | **0.5–1** | mechanical; 4 asserts + 13 slug dispositions + one `kind` fix |
| 1 · the ledger | **2–3** | ~190 merge records, each needing two signals and evidence; the ten least-certain need judgment and will be revisited |
| 2 · the deep locator | **2–3** | the topic curation pass (~150–200 topics, `topic-map.json` TOTAL over every native heading — mechanical but needs eyes) |
| 3 · the eval | **1.5–2** | 130 questions authored **without the index in context**, from destination pages and editions. This is the phase that cannot be rushed and cannot be automated away without weakening the independence claim to nothing. |
| 4 · shallow tier + AI | **2–3** | the substitution layer + independent adjudication of 130 replies × ≥2 models |
| **total** | **8–12 sessions** | |

Plus one dependency this plan cannot satisfy itself: **B6 requires `greatworks.js` to gain a real
`editions:[{cite, pdBasis}]` array**, or 34 works ship `quotable: null`. That is a data-module round
of its own (§2.5 measured 15 works whose per-edition truth exists only in prose).

### 9.2 The competing claim

`docs/plans/opgraph/NEXT.md` is a **computed** roadmap — generated by `scripts/opgraph-eig.mjs` from
the shipped graph, re-derived on every run, explicitly a stated proxy rather than true EIG:

| # | action | affected | headroom | lev | cost | score |
|---|---|---:|---:|---:|---:|---:|
| 1 | **A · second witness** | 347 | 0.3 | 1 | 3 | **34.7** |
| 2 | B · basis upgrade | 217 | 0.15 | 1 | 4 | 8.1 |
| 3 | E · desk-check queue | 50 | 0.08 | 1 | 1 | 4.0 |
| 4 | D · atlas join | 24 | 0.05 | 2 | 1 | 2.4 |
| 5 | C · procedure-level relations | 42 | 0.1 | 2 | 4 | 2.1 |
| 6 | F · a silent culture | 0 | 0 | 2 | 5 | 0.0 |

Action A wins by more than a factor of four. **Every node in the graph is single-witness** — 246/246
claims, 101/101 works — so the rubric's witness term is at its floor everywhere, and 137 of 347
weighted nodes sit within 0.10 of the 0.40 admission floor. A is the only action that can move that
term at all.

The locator is **not on that board**, and the board cannot see it: the proxy ranks over rows that
exist, which is why it also scores action F (a silent culture) at zero and why the file says so in
its own last paragraph. Absence of a score is not a score of zero.

### 9.3 Which goes first

> **The corroboration pass (NEXT.md action A) goes first. The locator does not take the next slot.**

Four reasons, and the first is the one that decides it:

1. **The locator amplifies exactly the debt A pays down.** Its job is to make 246 procedure-claims
   more findable, more addressable and more authoritative-looking. Every one of them rests on **one**
   witness, and 217 of 246 rest on `genre-norm` — the generator's *weakest* derived completeness
   basis, which the opgraph page already renders hatched and excludes from its own headline counts.
   Building a beautiful citation apparatus over single-witness claims makes them *look* better
   without *being* better. That is the failure mode this repo's entire framing exists to prevent, and
   it would be committed by the surface advertised as the citation apparatus.
2. **Phase 0 is not a locator round; it is a defect round, and it belongs with A and E.** The five
   A10 hits, the two L-PD2 contradictions, the 15 greatworks licence contradictions, the 13 dangling
   atlasSlugs — none of these needs a locator. They are live defects in shipped data, found by
   auditing a plan. NEXT.md's action **E** (desk-check queue, score 4.0) already names *"22/177
   editions with unresolved public-domain status"* and notes *"PD status gates quotability"*; action
   **D** (atlas join, score 2.4) is the same 24 works whose slugs dangle. **Phase 0 ships inside the
   A+E+D round, immediately, at almost no marginal cost.** The locator round then starts from a repo
   whose join key works and whose licence fields do not contradict themselves.
3. **The cost asymmetry is 3 units against 8–12 sessions.** A is the cheapest high-leverage action on
   a board that computed its own ordering. The locator is the most expensive thing anyone has
   proposed for this repo, and the audit found that three of its four design slices disagreed with
   each other about what was being built.
4. **The locator gets better by waiting.** Second witnesses raise node weights, which is what a
   ranked index should rank on; the desk-check queue resolves the PD statuses that decide `quotable`;
   the atlas join heals the master key. Doing A, E and D first makes the locator **cheaper and more
   honest**, and there is no reciprocal benefit running the other way — a locator built now makes A
   no easier.

**The one argument on the other side, stated fairly:** the corroboration pass improves data nobody
can find, and the locator is the surface that would make the whole corpus findable — 1,368 loci
across ~15 modules currently reachable only by knowing which wing to open. There is a real sense in
which the site's *addressability* is its weakest product attribute and the graph's *witness count* is
its weakest scholarly attribute, and reasonable people rank those differently. The recommendation
here rests on the fact that the locator would ship a citation apparatus over the weakest-attested
part of the corpus first, and that phase 0 delivers the locator's most urgent findings **into the
corroboration round anyway** — so nothing measured by this audit is lost by waiting.

**Recommended order:** `A + E + D + phase 0` → *(reassess)* → locator phases 1–2 → phase 3 → phase 4.

### 9.4 The questions a build round cannot start without

Slice-level open questions, resolved here where this plan can resolve them and flagged where it
cannot:

1. **Which artifact ships?** — **RESOLVED (§3.1):** `rows.js` + `topics.js` as source of truth,
   `locator-index.json` as a same-run projection, one builder, one assertion set.
2. **May this round fix `opgraph.js`?** — **RECOMMENDED:** yes for the three defects (the two licence
   contradictions and `person:agrippa`'s kind), which means re-running `gen-opgraph.mjs` and touching
   `gate.json`. The atlasSlug repairs stay as `identities.json` overrides until r29's planned atlas
   entries ship. **Maintainer's call.**
3. **Does `greatworks.js` get per-edition `pdBasis` this round?** — **UNRESOLVED, blocking B6.** If
   not, 34 works ship `quotable: null` and the licence signpost is absent for the site's
   best-curated wing. §2.5 measured 15 works where the boolean is actively wrong.
4. **Is the locator `callable` in v1?** — **RESOLVED (§5.5):** `callable: false` for one round.
   Recorded as an explicit decision, not a default.
5. **Replace or augment the flat search index?** — **RESOLVED (§4.7):** augment. Replacing loses
   search over ~114 prose framing pages.
6. **`practitioners.js` ids** — mint `pract:` ids in-module (a schema change to shipped data), or key
   members by `{module, fold(name)+index}` in `identities.json` only? **Recommend the latter**;
   practitioners produce no rows in any phase (§4.3), so the ids are needed only for figure joins.
7. **Translations as works or as editions?** (confluence `kind:translation`, 17 entries) — the
   Wilhelm/Baynes and Mathers cases pull opposite ways. **Unresolved; phase-4 scope.**

---

## 10. What this plan deliberately keeps from the slices

Naming these, because an audit that leaves nothing standing is not usable and four of these are the
best ideas in the folder:

1. **The schema that cannot hold a transcription** (§4.1). FRAMING §4.1's own move, applied
   correctly, which makes ~70% cite-only the *normal* case rather than a degraded one.
2. **Precision and treatment as independent axes** (`locus.granularity` vs `depth`), with `L-GRAN`
   and the grouped, labelled precision bands. The correct answer to depth dishonesty.
3. **"A row with nowhere to point is a fabrication."**
4. **The topic spine of aliases over the three existing vocabularies**, with opgraph's argued merge
   *refusals* binding on the locator. Minting a fourth vocabulary was the obvious mistake and the
   slice refused it with a real argument.
5. **`L-EQUIV`** — a cross-cultural link carries `claimedBy` or does not render.
6. **`identities.json` as an append-only, never-rewrite-the-module merge ledger**, with retraction as
   a status flip.
7. **The computed noise floor and pre-registered Wilson thresholds**, and the explicit statement that
   n=15 cannot carry the safety claim.
8. **The no-ship fallback** — deterministic search alone, no assistant panel. Saying that before
   measuring is exactly right.

---

## 11. The data ceiling

What the locator cannot tell you, stated here rather than discovered by a reader:

- **Whether anything in these books works.** Efficacy is not a field and never will be.
- **What any text says.** It points. ~70% of the corpus it points into, this site may never quote.
- **Where a topic is discussed in a work the site does not hold.** Absence in this index is absence
  *in this index* — never evidence of absence in the tradition. The honest sentence is *"nowhere in
  what this site indexes,"* and it is load-bearing.
- **Whether two works with different names are the same work**, unless a recorded merge with two
  cited signals says so — and every such merge shows its evidence on its face.
- **Whether a passage is quotable**, wherever `quotable` is `null` — which in v1 is most of the
  greatworks wing, by design, because the honest answer is *"this site has not determined that."*
- **Anything in a culture the corpus does not cover.** The opgraph data ceiling names them:
  Mesoamerican, sub-Saharan African, Mesopotamian, Shintō/Shugendō, Slavic. **The index's silence
  there is not evidence of absence** — and a ranking metric built on rows that exist is structurally
  blind to it, which is why NEXT.md keeps action F on the board by hand and why this plan repeats the
  warning.
