# THE GRAPH-RAG PLAN — a cited content-level index for the workbench

> **Status: proposed, not adopted.** One phased plan synthesised from a grounding
> report, four independent designs and three independent judgings.
> Written 2026-08-01 against repo tip `a7b3cf1`. Working tree carries one
> untracked directory (`research/horae/v2/`); no tracked file differs.
>
> **Every number in this document that is load-bearing was re-measured by the
> author against the shipped modules, not inherited.** Where a figure is quoted
> from a design without independent re-measurement, it is marked `[unverified]`.
> Section 2.3 explains why that distinction is not pedantry: two of the three
> judges reached a winner partly on a disagreement that did not exist, because
> two correct measurements were stated without their units.

---

## 0. Provenance of this plan

Four designs were produced against the brief, and three judges scored them
independently on feasibility, anti-fabrication, payload and citation integrity.

| # | design | J1 | J2 | J3 | placing |
|---|---|---:|---:|---:|---|
| D2 | **LEXICAL-FIRST, GRAPH-RERANKED** | **36** | 33 | **35** | won 2 of 3 |
| D4 | **PROVENANCE-DAG-FIRST** | 35 | **38** | 34 | won 1 of 3, runner-up in 2 |
| D1 | **GRAPH-FIRST** | 33 | 30 | 34 | third |
| D3 | **PRECOMPUTED SEMANTIC** | 27 | 26 | 30 | last, unanimously |

**No design was formally disqualified.** All four honour the no-build-step,
no-runtime-request, core-purity, tracked-artery and payload constraints.

**D3's centrepiece disqualified itself, and that verdict is recorded here so
nobody re-proposes it** — see §8.4. It ran the SVD it proposed and published the
result that kills it. That was honest work and it produced the single most
useful negative result of the round.

**All three judges independently recommended the same build shape**, which is
what this plan is: D4's Phase 1 gate script first, at zero shipped bytes; D2's
lexical index as the retrieval spine; D4's verifiability ceiling and D1's anchor
seal, admission gate and delivery tier grafted on. The graft is not the
synthesiser's invention. It is the convergent recommendation of three
independent readings, and §10 attributes every borrowed idea to its origin.

---

## 1. What we are building, in one paragraph

Today this site can search 114 things: one entry per HTML page. Ask it where the
*Sārāvalī* discusses Saturn in the seventh house and it can, at best, hand you a
page with several hundred delineations on it. We are building an index of the
site's **individual addressable passages** instead — every verse, sūtra, sutta
segment and chapter the site already points at, roughly two thousand of them,
each carrying the citation that the module it came from already ships. Ask a
question and you get back those passages, ranked, each with a real address you
can check. Later, and only after the plumbing is proved, a language model is
allowed to write a paragraph over them — but it is never allowed to type a
verse number. It refers to passages by handle (`[L3]`), the site substitutes the
real address from its own data, and any sentence containing a name or a number
that the cited passage does not actually contain is struck before the reader
sees it. The point is not that the model is trustworthy. The point is that the
mechanism does not require it to be.

---

## 2. The corpus as measured

### 2.1 What is *about* books versus what *is* text from books

This is the bluntest number in the grounding report and it survives
re-measurement. It should be read before anything else in this plan.

```
PRIMARY TEXT shipped in assets/js/core/data/**      152,261 B    (3.9%)
SITE-AUTHORED word glosses                          235,162 B
assets/js/core/data/** total                      3,889,027 B
```

**Ratio: ~152 KB of primary text against ~3.74 MB of description, metadata and
apparatus.** The primary text is concentrated almost entirely in two wings:

| wing | source language | translation | licence |
|---|---:|---:|---|
| yogasūtra (196 sūtras) | 15,750 B | 23,375 B | PD |
| buddhist (MN 118, Dhp 1–75, Heart, Metta — 608 segments) | 26,645 B | 26,321 B | CC0 (Bilara/Sujato) |
| abhicāra ATHARVAN | — | 21 `pdQuote` | PD (Whitney 1905) |
| kabbalah QUOTES | — | 3 (1,060 B) | PD |
| picatrix-prayers | — | 13 excerpts | **unresolved** (FRAMING §9.8) |

**Excluding the buddhist and yogasūtra wings, the site holds roughly 30 discrete
quoted passages from the entire Western, Solomonic, Greco-Egyptian, Daoist, Sufi
and Tantric corpus.** Everything else indexable is site-authored prose *about*
books: confluence bodies (100,897 chars), glossary definitions (69,668),
greatworks chapter gists (29,930, avg 121 chars).

**The consequence, stated as arithmetic rather than architecture: a retriever
over `assets/js/core/data/**` retrieves the site's summaries of books, not the
books.** The only regions where "answer from the entries" and "answer from the
text" coincide are yogasūtra, buddhist, and about thirty scattered quotations.
No retrieval architecture changes this. It is a corpus fact, and every one of
the four designs independently reached it. §5.3 makes it visible per answer
rather than pretending it away.

### 2.2 The addressable units — and why the four designs' counts are not comparable

The designs reported 1,237 loci (D1), 2,218 rows (D2), 2,512 rows (D3) and 2,473
edges over 562 documents (D4). **These are not four estimates of one quantity.
They are four different quantities.** D1 counted only records whose address is a
machine-checkable ordinal; D2 and D3 counted every indexable record including
work-level ones; D4 counted evidential edges, of which several may hang off one
record.

Re-measured directly, the modules that carry an address finer than the whole
work:

| module | records | finer-than-work addresses | verified |
|---|---:|---:|---|
| bhava-phala | 108 | **192** (108 Phaladīpikā + 84 Sārāvalī) | ✔ measured |
| buddhist | 608 | 608 canonical Bilara refs | grounding |
| yogasūtra | 196 | 196 (`pada.num`) | grounding |
| greatworks W+E | 247 | 129 ordinal (93 numeric + 36 roman); **118 are opaque labels** | grounding |
| mudrās | 35 | 35 verse ranges | grounding |
| abhicāra ATHARVAN | 21 | 42 (21 AV + 21 Kauśika) | grounding |
| yoga-rules | 36 | **0 structurally** — 34 exist but live inside a prose `sources[]` string | grounding |
| picatrix BOOK_IV | 9 | 9 `ch` values | grounding |
| kabbalah QUOTES | 3 | 3 | grounding |

And the three largest node populations carry **zero**:

```
opgraph work           101 records — 0 carry any locus field
opgraph procedure-claim 246 records — 0 structurally; 205/246 cite strings
                                       contain no digit-locus at all
confluence entries     190 records — 0
                       ---
                       537 records with no address finer than the whole work
```

**Planning figure for this document: ~2,200 indexable rows, of which ~1,200
carry an ordinal address.** It is stated as a range on purpose. D2 — the design
whose row extraction this plan adopts — self-reported that its own extractor
silently lost 145 greatworks rows (`authors[].works[]` read as `.books[]`) and
another 102 (greatworks-east exports a bare array where west exports
`{authors:[…]}`), across three measurement rounds, producing clean-looking
output each time. **The row count is therefore not a commitment. It is an
output of the generator, and the generator carries a per-module count floor
(assertion L1, §3.3) precisely because of that bug.**

Two corrections to PLAN.md's census that this plan inherits and re-verified:

- **bhava-phala is not uniformly two-witness.** PLAN §2.4 asserts "216 verse
  loci in 108 two-witness records." Measured: **108 Phaladīpikā loci + 84
  Sārāvalī loci = 192 loci; 84 two-witness records, 24 single-witness.** The 24
  are Rāhu and Ketu across all twelve bhāvas, and the module itself records why
  — Sārāvalī ch. 30 runs Sun to Saturn only and closes by colophon.
- **The Dhammapada ships 5 vaggas, not 26.** PLAN §8.1's row-minting rule
  ("Dhammapada → 26 vagga rows") is not producible from shipped data.

### 2.3 The join key — and the unit ambiguity that decided a judging

`docs/plans/locator/PLAN.md` §3.11 states that the join the whole locator rests
on is **48% broken**. The grounding report re-measured it at 44.4%. Design D2
re-measured it again, got **35.3%**, observed the disagreement, refused to
smooth it, and told the reader to re-run. Two of the three judges then verified
D2's figure, declared D2 right and the grounding report wrong, and cited that as
a decisive discriminator on citation integrity.

**Measured by the author, at `a7b3cf1`, both are right. Neither stated its
unit.**

```
BY DISTINCT SLUG                          BY WORK NODE
  resolving atlasSlug values   15           work nodes carrying one     22
  proposedAtlasSlug values     12           work nodes carrying one     12
  union                        27           union                       34
  unresolved             12 = 44.4%         unresolved            12 = 35.3%
  non-text targets              4           nodes pointing non-text      7
```

Both denominators are legitimate; several work nodes share one atlas slug. The
grounding report counted slugs. D2 counted nodes. The seven nodes pointing at
non-text entries resolve to exactly the four distinct slugs the grounding report
named (`event-dee-angelic-conversations`, `person-ibn-arabi`, `person-abulafia`,
`person-isaac-luria`). Nobody was wrong about the world. Everybody was silent
about the unit.

**This is not a footnote. It is the same defect class this plan exists to
defeat, occurring inside the round convened to defeat it.** A measurement whose
unit is unstated is an unchecked assertion wearing a number, and it propagated
through four documents and three judgings without anyone catching it — including
two judges who believed they had caught something else. It therefore becomes a
binding rule (§5.5, **B13**): every count this system emits, in a generated
file, a check output or a rendered answer, declares its unit in the same string
as the number.

The state of the join itself, unambiguously:

```
work nodes                                          101
  carrying a resolving atlasSlug                     22   (0 dangling)
  ...of those, pointing at a confluence kind:text    15
  ...of those, pointing at kind:person or kind:event  7
  carrying proposedAtlasSlug (resolves to nothing)   12
  carrying no atlas field at all                     67
  carrying atlasNeeded:true                          36
  ...of those, carrying a resolving atlasSlug         0
```

`11f0c7f` did not create twelve atlas entries. It moved twelve slugs out of an
asserted field into a declaratively-unresolved one. The coverage gap is
unchanged and is now honestly typed. **This plan does not repair it. It removes
it from the load path and makes its true state checkable** (§4.4, §5.4).

The root cause is the one that matters: `docs/plans/opgraph/PLAN.md:1355`
assertion 19 declared *"Every `atlasSlug` resolves to a real
`CONFLUENCE_ENTRIES` slug"* and was never turned into code. The only atlasSlug
check in `scripts/**` is `scripts/tests/og-artery.mjs`:

```js
ok(!works.some(w => w.atlasSlug && /[\s/]/.test(w.atlasSlug)), 'an atlasSlug is not a slug');
```

That validates the string's **shape**. It has never validated its **referent**.

### 2.4 A live, shipped instance of the failure this plan is designed against

Design D4 went looking at a join nobody had examined and found a second one that
is sound — and, on the way, found a fabrication-class defect in the shipped
graph. **The author verified every figure below directly.**

`scripts/gen-opgraph.mjs` attaches witnesses like this:

```js
function citeText(record, sliceName) {          // :175
  // ...walks the ENTIRE record, pushing every string field
  walk(record, null);
  return out.join('  ').normalize('NFC');
}
export function witnessesFor(record, sliceName, table) {   // :189
  const text = citeText(record, sliceName);
  // S-keys first; failing that, substring-match anchor tokens anywhere in the blob
  for (const [tok, key] of table.anchors) if (text.includes(tok)) keys.add(key);
}
```

`citeText` concatenates every string in the record — including narrative
`notes` — and a witness attaches by **prose token co-occurrence anywhere in the
record**, not by evidential support. `computeWeight()` then ranks on that list.

Measured consequences, all verified:

```
procedure-claims                                 246
  carrying witnessesInherited: true              117   = 47.6%
  mean weight, inherited                       0.634
  mean weight, own witnesses                   0.556   <- inherited rank HIGHER
  mean witness count, inherited                 2.16
  mean witness count, own                       1.56
  inherited claims at weight >= 0.80              40

proc:baopuzi-3   weight 1.00 (top of corpus)
                 cite    "Pregadio 2006"
                 sources 13:S10, 13:S19, 13:S5, 13:S6
                 — Pregadio 2006 is 13:S1 and is NOT among them
```

The generator was honest: it wrote `witnessesInherited: true`. **Nothing in the
repository has ever read that flag.** That is a field asserting evidence that no
code checks — the identical shape as the 21% fabrication rate and the
never-executed assertion 19, at 47.6% prevalence, shipped today in
`assets/js/core/data/opgraph.js`.

**Building a retrieval layer over this graph without fixing it would index the
fabrication and hand it a citation.** That is why Phase 0 exists and why it runs
before anything is built.

### 2.5 The join that works

The same design found the counter-example, and it is the foundation Phase 2
builds on. `node.sources[] → OPGRAPH_META.sources[key]`, measured across all 509
nodes:

```
source records                        123
node -> source refs                 1,307
dangling refs                           0
uncited sources                         0
witnesses === sources.length      509/509
```

**100% sound, 100% coverage**, where `atlasSlug` is 44.4% unresolved by slug and
14.9% covering by node. The index joins on this and never on `atlasSlug`.

### 2.6 Two more standing corpus facts

- **`quotable` is not derivable.** 0 of 177 opgraph editions and 0 of 34
  greatworks works carry a `pdBasis` field. B6's dependency is unmet
  corpus-wide, L-PD2 still shows 2 live contradictions
  (`gw:agrippa-three-books`, `gw:pseudo-agrippa-fourth-book`: cite says
  "cite only", `pd='us-pd'`, `quoteSafe=true`) and L-GW still shows 15 of 34.
  **v1 quotes nothing outside the wings with an unambiguous shipped licence.**
- **The shipped graph is stale against accepted research.** `opgraph.js`'s last
  commit is `11f0c7f`, which precedes `312b17a`, where 81 accepted second
  witnesses landed in `research/`. Single-witness figures re-measured today —
  **100/246 claims, 15/101 works** — are pre-corroboration. Applying that round
  is not mechanical: `docs/plans/LOOP.md` §4 records that the five slices carry
  five different source-table shapes.

---

## 3. The index row shape, the generator, and where it sits in the artery

### 3.1 The spine: D2's column-store, grafted

Two shipped files under `assets/locator/`, one pure core module, one generator.
The shape is D2's (the winning design). Three columns are grafts, marked.

**`assets/locator/rows.json` — the citation authority.** Column store, parallel
arrays indexed by row ordinal; D2 measured column-store at 13.9 KB gz against
19.0 KB for row-of-objects.

```jsonc
{ "v": 1, "n": 2218,
  "srcDigest": "<sha256 over the tracked extractor inputs + opgraph.js>",

  "w":  "b36 workIdx,…",        // index into works[]
  "g":  "0125…",                // granularity: verse|segment|chapter|verse-range|hymn|work|term
  "l":  "8.18.2…",  // the locus LABEL, VERBATIM from the source module
  "c":  "b36 citeTmplIdx,…",    // index into citeTemplates[]
  "p":  "b36 pageIdx,…",        // index into pages[] (href + fragment)
  "f":  "b36 flagbits,…",       // harm | doNotQuote | quotableUnresolved | weakFingerprint | singleWitness

  "V":  "021…",                 // GRAFT (D4): verifiability ceiling — text|summary|work
  "d":  "b36 depth,…",          // GRAFT (PLAN §4.1 via D3): depth, INDEPENDENT of granularity
  "h":  "a3f19c2b…",            // GRAFT (D1): FNV-1a 32-bit hex of the exact source string indexed

  "works": [...], "citeTemplates": [...], "pages": [...],
  "wings": { "jyotisa": [0,228], "yoga": [228,459], … } }
```

Row ordinals are assigned **wing-major**, so a wing is a contiguous range and
wing filtering is a range test costing zero bytes.

**`assets/locator/index.json` — the ranking authority.**

```jsonc
{ "v": 1, "n": 2218,
  "t":  "0abhicara 4ra 2solutism …",   // front-coded dictionary: b36 shared-prefix len + suffix
  "p":  ["1f.2*3.7", "b", …],          // postings, term-parallel: delta-gapped b36 ordinals, "*b36" = tf
  "dl": "1a,2f,9,…" }                  // b36 document lengths for BM25 normalisation
```

Terms include **ASCII-fallback dual keys** prefixed `~`, emitted only for tokens
whose source string carried a non-ASCII letter (`Īśvara` → `isvara` **and**
`~isvara`; English is never mangled). D2 measured this at 24.1 KB raw / 9.4 KB
gz, against 61.9 KB gz for the separate variant-map file it built first and
discarded — a 6.6× improvement for the same job. `[unverified]`

**`assets/js/core/locator.js` — PURE.** No DOM, no fetch, no `Date`, no RNG.
Exports `fold`, `asciiKey`, `tokenize`, `parseIndex(json)`, `search(idx, q, opts)`,
`rowContains(idx, rowId, term)`, `verifyAnswer(idx, rows, text, citedIds)`.
**Everything takes the parsed index as an argument; the module never loads
anything.** `assets/js/app/locator-ui.js` is the impure fetch/DOM layer. This
split is D2's and it is the cleanest statement of the core purity contract in
the round.

### 3.2 The three grafted columns, and what each one buys

**`V` — the verifiability ceiling (from D4).** A hard cap on what a row may
support, not a score:

| value | meaning | permitted |
|---|---|---|
| `text` | primary text SHIPS at this address | assertion, attribution, **quotation** (substituted) |
| `summary` | the address is real; what ships is the site's own summary | assertion, attribution; **never quotation** |
| `work` | no address finer than the work exists | **no numeral may appear in a sentence supported only by `work` rows** |

D1 proposed the same idea in two values (`text` / `gloss`); D4's three-value form
subsumes it and this plan ships one column, not two. Roughly 537 rows are `work`
by construction (101 opgraph works + 246 procedure-claims + 190 atlas entries),
because none of those node types has a field capable of holding a finer address.

**The demotion rule that catches `proc:baopuzi-3`:** a claim carrying
`witnessesInherited: true` is forced to `V:'work'` **regardless of what its
claim text says**, because its witness list belongs to the parent work. That
strips claim-level support from 117 of 246 procedure-claims and takes 40 claims
off the `weight >= 0.8` shelf they currently occupy on borrowed evidence.

**`h` — the per-row source hash (from D1).** FNV-1a 32-bit hex over the exact
source string the row's term-bag was derived from. `--check` recomputes it from
the live module. Edit a bhava-phala summary without regenerating and the gate
fails. This is the only mechanism in the round that makes *"the index describes
the shipped text"* a checkable statement rather than an assertion. D1 measured
it at 10% of raw and 37% of gzip on its own row set — hex is incompressible —
and said so. `[unverified]` It is worth it, and it also closes D4's
self-declared worst weakness (positional pointer drift), which is why this plan
takes D1's hash *and* rejects D4's positional pointers in favour of PLAN §3.2's
opaque permanent ids.

**`d` — depth, independent of granularity (PLAN §4.1, restated by D3).** How
finely a row *points* and how deeply the site *treats* it are orthogonal. The
corpus is full of rows with a verse-level address and a work-level treatment,
and the UI must be able to say so.

### 3.3 The generator and its assertions

`scripts/gen-locator.mjs`, modelled line-for-line on `scripts/gen-opgraph.mjs`:
dependency-free, deterministic, no `Date`, `--check` rebuilds to memory and
exits 1 on drift.

**Tracked source** (new, under `research/locator/`):

| file | holds |
|---|---|
| `fields.json` | per module: which field is the locus, which are indexable, which string is the cite, which page renders it — **the hand-authored judgement layer, one entry per module** |
| `stop.json` | the stopword list |
| `ascii-rules.json` | the transliteration fold rules **plus a fixture table the generator asserts** |
| `identities.json` | the append-only merge ledger (PLAN §3.3), retraction as a status flip |
| `gold.json` | the held-out evaluation set (Phase 3) |

**Every assertion carries a non-vacuity floor.** The repository's own repair
commit records the reason: its first slug regex expected `slug: 'x'` while
`confluence.js` writes `"slug": "x"`, matched zero, and *"without the >100 guard
it would have passed vacuously forever — a check that finds nothing looks
exactly like a check that finds nothing wrong."*

| # | assertion | floor |
|---|---|---|
| **L1** | every row has a non-empty locus and a cite | **per-module** count floors, not a global one — this is the assertion that would have caught D2's 145 lost greatworks rows |
| **L2** | every cite is a byte-identical substring of the source module; template expansion reproduces the original exactly | all rows |
| **L3** | **every `atlasSlug` resolves to a real `CONFLUENCE_ENTRIES` slug** — the referent check assertion 19 declared and never got | `>= 20` node-hits, unit declared |
| **L4** | every `proposedAtlasSlug` resolves to **nothing** — a proposed slug that has quietly become real is a stale type and must be promoted deliberately | `== 12` |
| **L5** | every field read is `typeof === 'string'` | D2 put `[object Object]` into a Dhammapada row by reading a non-string field; unasserted, that garbage becomes a legitimate indexed token and the containment check then faithfully attests it |
| **L6** | every `h` recomputes from the live module | all rows |
| **L7** | rows failing the three-rare-token fingerprint are **flagged** `weakFingerprint`, never dropped | D2 measured 501 of 2,218 `[unverified]` |
| **L8** | no row ships `quotable: true` while `pdBasis` is absent corpus-wide | 0 |
| **L9** | the 114 page-level rows are **excluded** — a page is not a locus and must never be citable as a source (D3) | 0 page rows present |
| **L10** | `--check` reproduces the shipped bytes | byte compare |

### 3.4 Where it sits in the artery

```
research/opgraph/slices/*.json  +  gate-decisions.json      hand-authored
        │  seed-opgraph-gate.mjs
        ▼
research/opgraph/gate.json
        │  gen-opgraph.mjs
        ▼
assets/js/core/data/opgraph.js
        │
        ├── opgraph-eig.mjs --write  → NEXT.md
        ├── round-telemetry / round-ledger
        │
        ├── check-evidence.mjs           ← PHASE 0. 0 shipped bytes. Gate only.
        │
        └── gen-locator.mjs              ← PHASE 1. reads research/locator/fields.json
                 │                          + the shipped data modules
                 ▼
            assets/locator/rows.json
            assets/locator/index.json
```

**Two artery rules, both binding.**

1. `gen-locator.mjs` **refuses to run** if `gen-opgraph.mjs --check` reports
   drift. One artery, one head. Without this the spine and the graph can
   disagree silently, which is exactly how `gate.json` went stale under
   `opgraph.js` once already (LOOP §2).
2. The locator artifacts must be **regenerated in the same commit** as
   `opgraph.js`. `rows.json` carries `srcDigest` over its tracked inputs plus
   `opgraph.js`, and `--check` asserts it.

**A standing weakness this plan inherits and must state.** `scripts/` contains
exactly one `gen-*` script. `bhava-phala.js` and `greatworks-east.js` both
declare themselves `GENERATED FILE — do not hand-edit` and **their generators
are not in the repository.** `gen-locator.mjs` reads those shipped modules as
source of truth because that is the only option available, which means the
locator index is reproducible from tracked source exactly as far as those
modules are and no further. D2 put it correctly: *"I am building an artery onto
a stump and should say so plainly."*

---

## 4. The query path, end to end

### 4.1 The path

1. **Fold and tokenize** (pure). NFD → strip combining marks → lowercase →
   strip non-alphanumerics. Stopwords removed.
2. **Dictionary lookup, with fallback only on outright misses.** A query term
   absent from the dictionary is retried once under `~asciiKey(t)`.
3. **The admission gate — before any scoring, and before any model (D1).**
   Compute, per **citable** row, how many of the query's high-IDF anchors that
   single row holds. `coverage = max over citable rows of (anchors held /
   anchors total)`. **On FAIL the model is never invoked** and the page prints
   *"nowhere in what this site indexes"*, naming the anchors it could not
   co-locate **and the terms it actually searched**, so a recall miss is legible
   as a retrieval failure rather than reported as a fact about the corpus (D4).
   There is no "but here is what I know" branch in the code.
4. **BM25** (k1 = 1.2, b = 0.75) over the postings. D2 measured 0.083 ms/query
   on desktop node over 500 queries. `[unverified]`
5. **Graph rerank — bounded, and the bound is the point.** Candidate set = top
   60. Multiplier capped at **1.6×**: +0.2 if the row's work shares an opgraph
   edge with another candidate's work; +0.2 if the work's `atlasSlug` resolves
   *and* its confluence title matches a query term; +0.2 if the row is in a
   genuine two-witness group (the 84 bhava-phala records, not 108). Because it
   is a bounded multiplier over an already-retrieved set, **a completely broken
   graph degrades ordering and cannot cause absence.**
   **The reranker must never read opgraph `weight`** (§5.6, **B12**).
6. **Type suppression.** Rows whose type has no address — author, culture,
   procedure-type — may route a traversal but can never be an answer's locus.
   D1 measured a 4× BM25 blowup on a 6-token `procedure-type` bag and this is
   the fix. `[unverified]`
7. **Per-module normalisation and a diversity cap** of 6 rows per module (D3).
   Without it the buddhist wing's 608 rows and near-disjoint vocabulary either
   swamp the result set or vanish from it, on a site whose entire purpose is
   comparison.
8. **Top-k (8) to the model as `{L1…L8}`**, each carrying row id, indexed term
   set, locus label, cite, granularity, verifiability and flags. **The model
   never receives and never emits a locus string.**
9. **Substitute and strike** — §5.

### 4.2 Worked example — a question the corpus can answer

> **"What does the Sārāvalī say about Saturn in the seventh house?"**

**Tokenize** → `saravali`, `saturn`, `seventh`, `house`. Four in vocabulary,
zero OOV.

**Admission gate.** `saravali` (df low) and `saturn` are anchors. Row
`bp:Saturn:7:saravali` holds both, plus `seventh`. Coverage at a single citable
row = 3/3 anchors. **PASS.** The model may be invoked.

**BM25 + rerank** → `bp:Saturn:7:saravali` (locus `30.80`, `V:'summary'`),
`bp:Saturn:7:phaladipika` (locus `8.22`, `V:'summary'`) promoted +0.2 as its
two-witness partner, then several general Saturn rows.

**To the model:**

```json
[ { "ref": "L1", "work": "Sārāvalī", "granularity": "verse", "V": "summary",
    "terms": ["saturn","seventh","wife","suffering","sickly","late",...],
    "flags": [] },
  { "ref": "L2", "work": "Phaladīpikā", "granularity": "verse", "V": "summary",
    "terms": ["saturn","seventh","wife","aged","ailing",...] } ]
```

Note what is **absent** from that payload: the strings `30.80` and `8.22`. The
model cannot mutate a digit it was never given.

**The model emits:** `"Both texts treat this position as difficult for the
marriage partner [L1][L2]."`

**Post-processing:**
- *Substitution.* `[L1]` → "Sārāvalī 30.80" + the full cite string, both read
  from `rows.json`, neither typed by the model.
- *Bare-locus strike.* No locus-shaped token appears outside an `[Ln]` marker.
  Pass.
- *Verifiability ceiling.* `V:'summary'` on both. No numeral in the sentence
  beyond the substituted ones. Pass. **Quotation would be refused here** — the
  site ships its summary of these verses, not the verses.
- *Anchor containment.* Content anchors in the sentence — `treat`, `position`,
  `difficult`, `marriage`, `partner` — checked against `rowContains(L1, t)` and
  `rowContains(L2, t)`. `marriage`/`partner` resolve through the tombstoned
  synonym table to `wife`. Pass.

**Rendered:** *"Both texts treat this position as difficult for the marriage
partner — Sārāvalī 30.80 (Gopesh Kumar Ojha trans., …) and Phaladīpikā 8.22
(S.S. Sareen trans., Sagar Publications …; verse numbering per the
Śāstri/wisdomlib scheme). The site holds its own summary of these verses, not
the verses themselves."*

### 4.3 Worked contrast — a question the corpus cannot answer

> **"What incense does Agrippa give for Saturn?"**

Every term is in vocabulary; **zero OOV**. BM25 returns a healthy-looking score
against `gw:agrippa-three-books` and several suffumigation glossary rows. This
is precisely the case where a score threshold fails and a coverage test does not:
no single citable row holds `agrippa` **and** `incense` **and** `saturn`,
because the site indexes **no materia at any locus**. D1 measured coverage at
33%. `[unverified]`

**Gate FAILS. The model is never invoked.** The page prints:

> *Nowhere in what this site indexes.*
> Searched: `agrippa`, `incense`, `saturn`.
> No single indexed passage holds all three. The site records that Agrippa's
> *Three Books* contains suffumigation material, but holds no address finer than
> the work, and no materia table at any address.

Even had the gate passed, the ceiling would have finished the job: every
`gw:*` row is `V:'work'`, so any numeral in a sentence resting on them is
struck automatically.

**This refusal is correct on the current corpus, and it is also a bad product.**
It is the maintainer's stated direction and the system will decline it until
Phase 5. §8.2 puts that decision in front of him rather than hiding it in a
failure mode.

---

## 5. The anti-fabrication mechanism

The measured failure was **a field asserting evidence (`fetched: true`) that
nothing ever checked** — 28 of 132 claims carried a citation that did not
support them. Slice 13's validator checked only that `[Ln]` **resolves**, which
is a property of the tag, not of the data. PLAN.md documents four hallucination
paths that passed it — narrowing a range, borrowing another row's locus,
sharpening a work-level row, mutating a digit — and notes the asymmetry that
**the better the model's citation style, the less likely it was to be checked.**

Six mechanisms. All are executable; none is a preamble.

### 5.1 There is no field asserting evidence, because the assertion and the evidence are the same object

This is D2's central insight and it is the strongest structural answer produced
in the round.

> **Retrieval asks `postings[term] → rows`. Verification asks
> `rowContains(row, term)` — a membership test in that same list. The postings
> for row R were produced by tokenizing R's own text. The assertion and the
> evidence are therefore the same bytes, generated by one pass.**

There is no separate field claiming what a row contains, so there is no analogue
of `fetched: true` to leave unchecked. Resolution is a syntax check.
**Containment is a content check.**

No human writes any index field. `terms` is generated by tokenizing the shipped
source string; `h` is that string's hash; the cite is copied verbatim from the
module's own `sources[]`/`src`/`edition`. **A generator that cannot copy a
citation for a candidate row does not mint the row** — a locus with nowhere to
point does not exist (D1).

### 5.2 The model cannot type an address

It receives `{ref:"L3", …}` and emits `[L3]`. The renderer substitutes
`row.locus` + `row.cite` from `rows.json`. Then any locus-shaped token in the
raw output that is not a substitution the renderer performed —
`/\b[IVXLC]+\.\d+|\b\d+\.\d+\b|\bch(?:apter)?\.?\s*\d+|\bAV \d+\.\d+/i` — is
struck, **tagged or not.**

This structurally kills two of PLAN.md's four paths (*mutating a digit*,
*narrowing a range*) because the digits never pass through the model, and a
third (*borrowing another row's locus*) because a row not returned this turn is
not in the substitution table.

### 5.3 The verifiability ceiling (D4)

The fourth path, *sharpening a work-level row*, dies here. Any numeral in a
sentence supported only by `V:'work'` rows is struck automatically. Quotation is
permitted only from `V:'text'` rows and the quoted words are **substituted from
the shipped text, not typed**.

Roughly a quarter of rows and the great majority of the Western, Solomonic,
Greco-Egyptian, Daoist, Sufi and Tantric material is `V:'work'`. **That is the
honest shape of this corpus and the ceiling refuses rather than papers over it.**

### 5.4 The anchor seal (D1), with D1's three-way token partition

For each sentence tagged `[Ln]`, fold-tokenize and partition:

| class | contents | on failure |
|---|---|---|
| **HARD** | numerals; capitalised / proper-noun-shaped tokens; any token in the closed materia and vocab lists | **strike the sentence** |
| **SOFT** | general content words outside the licensed union | render `[unsourced]` inline; **do not strike** |
| **FREE** | a closed function/connective list **plus the site's own 53 `OPGRAPH_VOCAB` and 321 `GLOSSARY` terms** | always permitted |

Each HARD token must appear in `terms(Ln) ∪ terms(other rows cited in the same
sentence) ∪ terms(query)`, or resolve through the tombstoned synonym table.

The FREE class is what stops the site's own controlled vocabulary triggering
false strikes, and it is why D1's three-way partition is adopted over D2's
binary anchor/prose split. The HARD cut is justified by measurement: across the
12,103 prose tokens of the 246 procedure-claims, 1.4% carry a numeral and 9.6%
are capitalised — **names, numbers and materia are ~11% of the text and ~100% of
what a fabricated provenance smuggles in.** `[unverified]`

Struck content renders as a visible `[unsourced — removed]` marker rather than
disappearing, so the fluency-for-provenance trade is loud rather than hidden.

**How tight the seal is, measured by D2 on the corpus it extracted:** 2,059 of
2,218 rows (92.8%) are identified uniquely by their three rarest tokens, median
rows-admitted = 1; 53.7% of anchor-class tokens have df = 1. The other 501 rows
are flagged `weakFingerprint` — concentrated in buddhist (154, whose MN 118
refrain records repeat near-identical text), greatworks (90), glossary (87),
procedure-claims (80) and bhava-phala (59, sharing boilerplate across 192 rows)
— and **the UI must show the retrieved text beside any answer citing one,
because the check is weaker there.** `[unverified]`

**Bloom filters are rejected, and the reason is the design's whole logic.** A
per-row Bloom filter would be ~64 bits and let membership be tested without the
postings — but its error direction is **false positives, which *admit*
fabrications.** A verifier whose errors let bad citations through is worse than
no verifier, because it manufactures confidence. The exact postings cost nothing
extra: they are already resident.

### 5.5 Vacuity floors and the unit rule

Every assertion in `gen-locator.mjs`, `check-evidence.mjs` and
`scripts/tests/loc-artery.mjs` carries a **minimum expected hit count**, written
from the measured inventory rather than as `> 0`. A check that inspects zero
items **fails**.

**B13, new in this plan and derived from §2.3:** every count emitted by this
system — in a generated file, a check output, or a rendered answer — declares
its unit in the same string as the number. `"22 work nodes carry a resolving
atlasSlug"`, never `"22 resolved"`. This is asserted by a test over the check
scripts' output format, because the round that produced this plan demonstrated
that a stated number with an unstated unit propagates through four documents and
three independent audits uncaught.

### 5.6 Two deletions, both required

**(a) The general-knowledge licence must die on the locator path.** The clause
ships today, verified by the author at `assets/js/core/llm-context.js:119`,
applied to all 38 tools:

> *"…on general knowledge of the tradition instead of a numbered fact, say so
> plainly (e.g. "by the tradition, …"). Never attach a fact-tag to a claim the
> numbered facts do not support."*

and again at `:523` in `ORCHESTRATOR_PREAMBLE`. **A model told it may draw on
general knowledge if it labels the fact will do so, and a labelled fabrication
is still a fabrication with a citation attached.** All four designs identified
this independently.

PLAN.md's **H5 asserts this clause's absence by grep** — executed site-wide
today, that assertion **fails on the shipped contract it was modelled on.** That
is the same pattern as assertion 19: a plan-asserted invariant with no executing
code.

The fix is a **named, tested constant**, not an omission: `LOCATOR_CONTRACT`,
with `engine-test.mjs` asserting the clause is absent from it. Whether the
clause also dies for the other 37 tools is §8.2 question 1 — those are
computed-chart tools where "by the tradition" is honest.

**(b) Nothing may rank on opgraph `weight`.** `weight` is a function of the
prose token co-occurrence described in §2.4, so any ranker reading it inherits
the 47.6% inherited-witness inflation. The reranker ranks by
`(verifiability, support, tier, count)`. **This must be an assertion in the
anti-drift test, not a comment**, because `weight` is the obvious field to sort
by and the next model will reach for it.

### 5.7 What this does NOT prevent, stated plainly

**The seal is containment, not entailment.** It stops a locus being cited for a
name or number the locus does not hold — which is precisely the measured 21%
failure — but it cannot stop a claim that *inverts* a locus's meaning using that
locus's own words. *"Sārāvalī 30.16 says the Moon in the seventh gives wealth"*
passes containment if the verse discusses wealth, even if it says poverty.

Catching that requires the independently-authored gold set (PLAN B11, Phase 3),
and this plan does not claim it. **Both the catch rate and the false-strike rate
on legitimately paraphrastic sentences must be published.** A gate reported only
by its catch rate is the same epistemic error as `fetched: true`.

---

## 6. Byte budget and phone degradation

### 6.1 The baseline, measured by the author

```
assets/js/core/data/opgraph.js      853,843 B raw   165,190 B gzip -9
assets/js/core/data/confluence.js   429,169 B raw   125,740 B gzip -9
assets/search-index.json            248,619 B raw    80,247 B gzip -9
assets/js/core/llm-context.js       205,116 B raw    66,017 B gzip -9
```

### 6.2 The arithmetic

D2's figures are its own measurements on its own extraction, marked
`[unverified]`; the graft costs are derived here.

| item | raw | gzip -9 | source |
|---|---:|---:|---|
| Phase 0 `check-evidence.mjs` | — | **0** | gate script, ships nothing |
| `rows.json` base | 71.0 KB | 11.8 KB | D2 measured |
| `index.json` (dict + postings + `~` keys + doclen) | 380.9 KB | 164.7 KB | D2 measured |
| **subtotal, D2 as designed** | **452.0 KB** | **176.5 KB** | |
| + `V` ceiling column (1 enum/row) | +2.2 KB | **+0.4 KB** | 3 values, highly repetitive |
| + `d` depth column | +2.2 KB | +0.4 KB | as above |
| + `h` FNV hash column (8 hex/row) | +33.3 KB | **+15.1 KB** | scaled from D1's 1,237-row measurement (+18,555 raw / +8,403 gz); **hex does not compress** |
| **TOTAL, monolithic** | **~490 KB** | **~192 KB** | |

**Honest comparison.** ~192 KB gzip is **116% of `opgraph.js`'s entire gzip**
and **2.4× `search-index.json`'s**. It is the second-heaviest data asset the
repository would contain. That is the price, stated as a number.

**Two things it is not.** It is not paid on page load — see §6.3. And it does
not duplicate a single byte of content: the index stores pointers, loci and term
ids, and the prose lives in the modules the site already ships. D1 measured the
alternative — locus records carrying their gloss text — at 527 KB raw against
178 KB for the referencing form. `[unverified]`

**Where the fat is not.** D2 swept the per-row token cap: 80 tokens → 132.1 KB
gz, 120 → 141.1, 180 → 143.5, uncapped → 143.9. **Capping at 80 saves 8% of
gzip and costs real recall.** This is close to the floor for this corpus at this
granularity, and truncating to report a better number is not on the table.
`[unverified]`

**Embeddings are out, permanently, on arithmetic.** See §8.4.

### 6.3 Delivery and phone degradation — four rungs

**Cold page load costs ZERO new bytes.** Nothing here is added to `sw.js`
PRECACHE. Both files are fetched on first question only, then runtime-cached by
the existing service worker exactly like every other asset. Repeat visits
transfer nothing and work fully offline.

| rung | trigger | transfer | capability |
|---|---|---:|---|
| **1 — sharded** | default on `saveData`, `deviceMemory <= 2`, or slow connection | **~23 KB** | full BM25 + seal |
| **2 — monolith** | otherwise | ~192 KB once | full |
| **3 — rows only** | index fetch fails | 12 KB | browsable, citable locus table; substring match; **no BM25** |
| **4 — floor** | rows fetch fails | 0 | the existing 114-entry page search, **with a visible banner**: "content-level index unavailable — page-level results only, no loci" |

**Rung 1 resolves a real disagreement between the designs, and the resolution
matters.** D2 measured sharding **by wing** at a **+66% total gzip penalty**
(175.2 KB against 105.5 KB monolithic) from dictionary duplication, and
correctly rejected it. D1 measured sharding **by term-initial** — 36 shards over
a *shared* header — at a **4.5× reduction** for a typical query (~21 KB against
94 KB). Both are right. **Term-initial sharding does not duplicate the
dictionary because the dictionary lives in the header; wing sharding does.** So
this plan takes D1's scheme, which D2 never evaluated. Static-host safe, no
server, ≤ 6 tiny cached requests. `[unverified — both figures are the designs'
own, on different row sets; the generator must re-measure before Phase 1 ships]`

**Runtime cost.** `JSON.parse` of ~490 KB ≈ 5–15 ms on a mid-range phone;
rebuilding the front-coded dictionary into a Map ≈ 20–40 ms, one-time and off
the interaction path; heap ~2–3 MB retained; query < 1 ms. Transfer, not
compute, is the entire cost. `[unverified]`

**Never a silent downgrade to model memory.** Every rung below 2 states its
degradation on screen.

---

## 7. Phases

Six phases. **The first ships zero bytes.** Each is useful alone, and the first
four contain no model at all.

### Phase 0 — `scripts/check-evidence.mjs`. Zero shipped bytes.

A gate script. One line added to the verify gate. It computes three things
nothing currently computes, each with a minimum-hit floor and a declared unit:

- **(a)** which nodes carry `witnessesInherited: true` and yet a claim-level
  `cite` — **117 of 246 procedure-claims today**, 40 of them at
  `weight >= 0.80`;
- **(b)** which free-text `cite` strings name an authority absent from their own
  `sources[]` — D4 reports 22 loose / 10 dated / 4 zero-overlap `[unverified]`;
- **(c)** that `node.sources[] → OPGRAPH_META.sources` is total and non-dangling
  (1,307 refs, 123 sources, 509/509 nodes) **and** that every `atlasSlug`
  resolves to a real `CONFLUENCE_ENTRIES` slug — the referent check assertion 19
  declared and never got.

**Useful alone, immediately, with no later phase.** On day one it names
`proc:baopuzi-3` — top of the corpus at weight 1.00, citing "Pregadio 2006",
whose four witnesses do not include Pregadio — and the 39 other `weight >= 0.8`
claims resting on borrowed evidence. **All three judges independently
recommended shipping this ahead of everything else, including the winning
design.** If the project ships nothing else from this plan, this is the phase
that pays.

It should land together with the root-cause fix in `gen-opgraph.mjs`: `citeText()`
must not walk narrative `notes`, and the anchor fallback must not attach a
witness by substring co-occurrence.

### Phase 1 — the index and a passage finder. No model. ~192 KB gz, lazy.

Ships `scripts/gen-locator.mjs` (+ `--check`), `research/locator/fields.json`,
`assets/locator/{rows,index}.json`, `assets/js/core/locator.js` (pure),
`assets/js/app/locator-ui.js`, `scripts/tests/loc-artery.mjs`.

**Useful alone:** the site goes from searching **114 page-level entries** to
searching **~2,200 content-level passages**, each resolving to a real citation.
That is a straight upgrade to the command palette's third tier and needs nothing
downstream. It is also the first place the site states, **per address**, whether
it holds the primary text or only its own summary — the `V` column rendered as a
visible badge, which is the most honest single thing the site could ship.

Also lands the admission gate as a visible UI state, so a reader can discover the
**shape of the corpus's silence** — a real feature, and the precondition for
every later refusal.

### Phase 2 — the verifier, as a standalone instrument. No model.

Ships `verifyAnswer(idx, rows, text, citedIds)` in `assets/js/core/locator.js` —
pure, testable in `engine-test.mjs` — plus a page that takes arbitrary prose with
`[Ln]` tags and highlights every unattested anchor against the cited rows, and
the seal's fixture suite: the four documented hallucination paths plus a
**negative control** that must pass.

**Useful alone, and this is the phase that pays the brief.** The maintainer can
run it over the 132 existing research claims and **re-measure the 21%
fabrication rate mechanically instead of by hand.** An auditing tool with no
model in it, delivered before anything in the repository can generate a citation.
This is D2's ordering and it is correct: the verifier ships before the generator.

### Phase 3 — the gold set and the pre-registered thresholds. No model.

Ships `research/locator/gold.json`, authored **independently of the index** as
`(question → expected work + locus label)` pairs — never by reading the index,
or it measures itself (PLAN B11).

Publishes: top-1 and top-5, the anchor strike rate, the **false-strike rate on
correct answers**, a computed noise floor with Wilson intervals, and per-module
recall parity as a table rather than an average. Fixes, against held-out data:
the abstention coverage threshold, the anchor df cutoff, the seal's θ, the
anchor cap and the per-module normalisation.

**Useful alone:** it is the evidence that decides whether Phase 4 ships to
readers or does not ship at all. **The no-ship fallback is fixed in advance:
if the thresholds are not met, Phases 0–2 remain shipped and useful and Phase 4
does not land.**

Two calibration facts that make this phase non-optional:

- D2's abstention gate (max-IDF ≥ 4.0) **failed in both directions**: it passed
  *"what is the best stock to buy"* at maxIdf 7.18, and passed a query that
  returned bhava-phala 8.16 for a question about Patañjali on Īśvara, at 11.44.
  **Abstention is unsolved.** D1's single-row coverage gate is the proposed
  replacement and it is **fitted to the 16 queries it separates**, with the
  in-corpus minimum and out-of-corpus maximum **touching at 0.50**, broken only
  by an OOV count. Neither is defensible before this phase.
- Four tuned constants currently rest on zero ground truth.

### Phase 4 — the answer surface. The model enters. +0 payload bytes.

Registers `locatorSearch` in `llm-context.js` alongside the existing 38 tools;
adds `LOCATOR_CONTRACT` with the general-knowledge clause removed and asserted
absent by a test; wires the substitution layer, the ceiling, the seal and the
terminal-absence rule already built and proved in Phase 2.

**Useful alone:** the first cite-bound question answering over the corpus,
riding machinery proven in Phases 0–3. **Even a mediocre local model produces
safe output here, because safety is in the post-processor, not the prompt.**

### Phase 5 — materia. A research round with a build attached.

New node type `materia` (incense, herb, stone, metal, animal part) and edge
`PRESCRIBES_MATERIA`, minted through the existing gate-decisions → gate.json
artery so every materia carries witnesses, a weight and a citation exactly as
procedure-claims do. **Minted only from loci that already resolve, so the
address is inherited, never invented.**

**Useful alone:** a per-planet, per-materia browse page with every row citing a
locus — the documentation format the maintainer asked for. And it makes the §4.3
refusal answerable: materia names enter the term bags the seal reads, so
coverage rises and the seal extends **with no change to the retrieval code.**

**This is a research round comparable to R33's, and it must be scoped as one.**
Phases 0–4 build the substrate that makes it cheap. They do not do it.

---

## 8. What this will not do, and what the maintainer must decide

### 8.1 What it will not do

1. **No synonymy beyond what is curated.** Term matching over folded stems
   cannot bridge *suffumigation*/*incense* or *daimon*/*spirit*. Query expansion
   over the 296 glossary `see` links and 53 `OPGRAPH_VOCAB` terms is 374
   hand-authored relations, not semantic coverage. D2 demonstrated the failure
   with its own queries: *"what does Patañjali say about Īśvara"* returns
   bhava-phala 8.16 on Jupiter in the eleventh, because neither `patanjali` nor
   `ishvara` occurs in the yogasūtra records as indexed (Woods renders Īśvara as
   "the Lord") and the score came entirely from `say`/`about` hitting dense
   bhava-phala prose. **An embedding index would probably get this right and
   this design does not.** §8.4 says why it is nonetheless the right trade.
2. **No phrase matching.** Unigrams only. *"planetary hour"* scores as two
   independent terms. Bigram postings would add an estimated 60–80% more pairs
   and are not proposed for v1.
3. **No entailment checking.** §5.7. Containment is not entailment.
4. **No quotation outside the CC0/PD wings.** `pdBasis` is absent from all 177
   opgraph editions and all 34 greatworks works, so quotability is not derivable
   by anything short of parsing prose. `picatrix-prayers` is excluded from the
   text tier entirely (FRAMING §9.8).
5. **It does not repair the atlas coverage gap.** It removes it from the load
   path and makes its state checkable. Closing it means writing twelve atlas
   entries, which is a research act.
6. **It does not answer the maintainer's actual question until Phase 5.** §4.3.
7. **It does not do synthesis well.** *"What do these traditions share in the
   treatment of purification?"* has no single evidence path. The system returns
   N disconnected passages and leaves the reader to synthesise. An embedding RAG
   would produce a fluent, useful, unverifiable paragraph. **Comparison across
   cultures is the operation this design is worst at, on a site whose purpose is
   comparison**, and L-EQUIV makes it worse by design (a cross-cultural link
   renders only if it carries `claimedBy`, and most interesting comparisons have
   no claimant). D4 named this as its own worst weakness and it transfers.
8. **It has no representation for confirmed absence.**
   `research/opgraph/corroboration-R34.json` records 25 **confirmed absences** —
   "we looked for a second witness and there is none." Nothing in this row shape
   distinguishes *"single-witness because nobody checked"* from *"checked and
   nothing exists"*, which is exactly the distinction that makes the 24
   null-agreement Rāhu/Ketu records honest rather than incomplete.

### 8.2 Questions the maintainer must answer before Phase 1 starts

1. **Does the general-knowledge licence die site-wide, or only on the locator
   path?** It ships at `llm-context.js:119` and `:523` across all 38 tools. This
   plan deletes it for the locator only, because the other 37 are
   computed-chart tools where "by the tradition" is honest. **Site-wide deletion
   is a separate, explicit decision** and PLAN's H5 assumes it.
2. **Right, or answers?** On the Western, Solomonic, Greco-Egyptian, Daoist,
   Sufi and Tantric wings this system will answer *"nowhere in what this site
   indexes"* to almost every step-by-step question. That is **correct on the
   current corpus and it is a bad product.** A softer design would answer from
   work-level summaries with a visible "work-level only" badge. This plan
   forbids it. **Which do you want?** The answer changes §5.3, not the
   architecture.
3. **Regenerate `opgraph.js` with the R34 corroboration first, or index the
   stale graph?** The shipped graph predates 81 accepted second witnesses. The
   application is not mechanical (LOOP §4: five slices, five source-table
   shapes). Indexing first means re-running the artery afterwards; regenerating
   first delays Phase 1.
4. **Do you accept the inherited-witness demotion?** It takes 117 claims off
   claim-level support and 40 off the `weight >= 0.8` shelf. **The graph will
   look emptier and less confident than it does today.** It is more honest, and
   there is a real risk a later round reads it as a regression and reverts it.
5. **`picatrix-prayers` (FRAMING §9.8, LOOP defect #3).** Until `pdBasis` lands
   and the injection is gated, those excerpts cannot enter the text tier and
   three call sites continue shipping in-copyright text to a third-party API.
   This blocks the text tier for that module; it does not block Phase 1.
6. **~192 KB gzip, or sharded-only?** Rung 1 could be the default for everyone,
   at the cost of ≤ 6 requests per query instead of one.
7. **Who authors the gold set, and when?** It must not be authored by reading
   the index. If the answer is "the same agent that built the index", Phase 3
   measures itself and Phase 4 must not ship.
8. **What happens to `assets/search-index.json`?** 114 page-level entries,
   80 KB gz, currently SW-precached. Does it stay as rung 4, or is it retired?

### 8.3 Known risks this plan carries knowingly

- The row count may move by hundreds when the generator runs, because D2's
  extraction had two silent bugs and there may be more in `fields.json`. L1's
  per-module floors exist for this.
- The ASCII fold's **rule order is fragile**. D2 found a real ordering bug by
  measuring: `nirodhaḥ` folds to `nirodah`, then a `dh→d` rule fires on the
  surviving visarga-h and yields something that no longer matches
  `nirodha`→`niroda`. **Visarga and anusvāra must be stripped before digraph
  collapse**, and `ascii-rules.json` must ship a fixture table the generator
  asserts, or this class of bug recurs silently.
- Query expansion **made things worse before it made them better**. Naive
  expansion over glossary definitions degraded 4 of 6 test queries, because long
  definitions win on common words. The disciplined form (labels only, IDF ≥ 3.0
  to trigger, fires only below a floor, additive and capped at 40% of base)
  recovered. **Expansion must never outrank a direct lexical hit**, and needs
  the gold set to justify itself at all.
- The seal will strike some true, well-sourced sentences. Answers will read
  stilted. This is a deliberate trade of fluency for provenance and a reader who
  wants prose will not like it.

### 8.4 The design that disqualified itself, recorded so nobody re-proposes it

**D3, PRECOMPUTED SEMANTIC (SVD/LSA document codes), placed last with all three
judges and argued itself there.** It ran the SVD it proposed. Recording the
result is the point of this section:

- **The corpus has no low-rank structure.** Cumulative Frobenius energy 27.8% at
  D=64, 35.3% at D=128, **45.8% at D=256**; σ256/σ1 = 0.108. The spectrum is
  nearly flat.
- **Because the corpus is 27× block-diagonal by module.** Mean pairwise cosine
  *within* a module 0.1540, *across* modules 0.0056. A global latent space
  spends its dimensions telling Pali from Latin.
- **Cross-script synonymy cannot be learned from this corpus at all.** `saturn`
  occurs in 70 units; `sani`, `shani`, `kronos` in **zero**. LSA learns synonymy
  from co-occurrence and the co-occurrence is empty. **The bridge must be
  curated, not learned** — and it already exists as 285 usable glossary `see`
  links.
- **The query side is the payload killer, and it is the side proposals forget.**
  Document vectors are cheap: 2,512 × 128 bits = **39 KB**. But a precomputed
  embedding is useless unless the *query* can be encoded offline, and the
  encoder is a term × latent matrix: 7,641 × 128 int8 = **955 KB, 23× the
  document side.** A transformer instead is ~23 MB (MiniLM int8) + 8–11 MB of
  onnxruntime WASM, **and needs a build step**, which is a hard-constraint
  violation.
- And the one file it would ship, `sem.bin`, is **the only asset in the
  repository that does not compress**: 39 KB of maximum-entropy sign bits,
  gzip ratio 1.00, while every neighbouring asset gets 3.5–5×.

**Standing conclusion: no precomputed-embedding design ships on this corpus, and
the reason is a number rather than a preference.** Should the question return,
these are the figures to answer it with.

**Three things from D3 are adopted anyway**, and they are in §10.

---

## 9. Composition with the opgraph artery and the locator plan

### 9.1 With the opgraph artery

The locator is a **downstream consumer**, never a peer. `gen-locator.mjs` runs
after `gen-opgraph.mjs`, refuses to run on drift, asserts `opgraph.js`'s digest,
and is regenerated in the same commit. Nothing in the locator writes into the
graph. Phase 5's `materia` nodes enter through the **existing**
`gate-decisions.json → gate.json → opgraph.js` artery, not through a second one —
B1's one-artifact-one-builder rule made concrete.

The locator adds three things the artery does not currently have and should:
`check-evidence.mjs` in the verify gate (Phase 0); the `atlasSlug` **referent**
check with a declared unit (L3/L4); and the rule that nothing may rank on
`weight`.

### 9.2 `docs/plans/locator/PLAN.md` — SUPERSEDED

| § | what is superseded | by what |
|---|---|---|
| §2.1 | the **1,368** / **~6,020** addressable-point headline | a composite over per-module definitions the repo defines nowhere in code, two of whose inputs are wrong. **Replaced by §2.2's per-module table with declared units.** No single headline number replaces it. |
| §2.4 | "216 verse loci in 108 two-witness records" | **192 loci; 84 two-witness, 24 single-witness** (author-verified). The `witnessGroup` mechanism covers 84 records, not 108. |
| §3.11 | the **48%** headline | §2.3. The figure is 44.4% by distinct slug and 35.3% by work node, and **the plan's own statement of it did not name its unit.** |
| §4.5 | `quotable` as a populated tristate in v1 | `pdBasis` is 0 corpus-wide. Ships as a **flag** (`quotableUnresolved`) with L8 asserting no row claims `quotable:true`. |
| §4.6 | the topic spine over the three existing vocabularies as the **primary retrieval structure** | D4 measured it: 370 candidate terms yield only **70 with usable postings — 520 (term,doc) pairs over 562 documents**, under one term per document. **Retained as a query-expansion and anchor arm; rejected as the spine.** |
| §5.4 / H5 | asserting the licence clause's absence **by grep** | a named, tested `LOCATOR_CONTRACT`. Run site-wide today, H5 **fails**. |
| §8.1 | "Dhammapada → 26 vagga rows" | 5 vaggas ship. |
| §9.2 | the competing-claim table (347 affected, score 34.7) | imported a roadmap bug that `a06f0f2` fixed. Measured: **100/246 claims, 15/101 works** single-witness — and even that is pre-corroboration. |
| §3.2 | *(partially)* opaque ids as the **only** integrity mechanism | opaque ids **retained** (D4's positional offsets rejected), **plus** D1's per-row source hash, so a silent edit to a source module fails the gate rather than re-pointing a row. |

### 9.3 `docs/plans/locator/PLAN.md` — ADOPTED, verbatim in substance

- **The five schema refusals** (§4.1): no field capable of holding primary text;
  no purpose/aim/act facet; no free-text tags; no composed citations (strings
  are *copied* from shipped verified fields); **no row without a citation.**
- **`granularity` ⊥ `depth`** (§4.1) — the plan's single best structural idea,
  shipped as two columns.
- **"A row with nowhere to point is a fabrication."**
- **The substitution layer** (§5.3, B8) — the load-bearing control, §5.2 here.
- **Absence is terminal** (§5.1): *"nowhere in what this site indexes"*, with no
  "but here is what I know" clause, enforced in control flow rather than prompt.
- **The numeral rule** on work-granularity rows, subsumed by the ceiling.
- **`L-EQUIV`**: a cross-cultural link carries `claimedBy` or does not render.
- **The append-only merge ledger** (§3.3) with retraction as a status flip, and
  the rule that **no join may exist that the ledger does not record.**
- **Two independent signals to merge** (§3.4); one signal yields
  `status:'proposed'`, which renders nothing and traverses nothing.
- **The kind lattice** (§3.5) over a naive same-kind guard.
- **`tradition` is multi-valued** (§3.9).
- **The computed noise floor, pre-registered Wilson thresholds, independent
  adjudication and the no-ship fallback** (§6) — Phase 3 here.
- **Gold labels authored independently as `(work, locus label)` pairs** (B11).
- **B4, no prose-parsed loci.** Kept, and it costs modules whole: yoga-rules
  contributes **0** loci despite 34 existing inside a prose `sources[]` string;
  abhicāra TEXTS contributes 0; 118 of 247 greatworks refs are opaque labels.
  **The index is honest and small rather than large and parsed.**

### 9.4 The eleven blockers, restated against HEAD

| B | subject | status |
|---|---|---|
| **B1** | one artifact, one builder; no join outside the ledger | **SURVIVES.** §9.1 makes it executable rather than declared. |
| **B2** | A10 attribution-integrity | **PARTIALLY REPAIRED** in `48ea754` (5 → 3). **3 still live**: `author:abd-al-khaliq-ghijduwani`, `author:ahmad-al-buni`, `ea:author-amoghavajra`. |
| **B3** | A9 fan-out; anonymous hubs are not figures | **STILL LIVE.** `au:anonymous-greco-egyptian` → 13 works, `au:anonymous` → 12, both `kind:anonymous-hand`. Mitigated here by type suppression (§4.1 step 6) and by excluding `kind:anonymous-hand` from seeding — **patches to a measured symptom, not a fix.** Any new hub reintroduces it. |
| **B4** | no prose-parsed loci | **SURVIVES**, adopted. Measurement confirms it costs modules whole and buys correctness. |
| **B5** | `quotable` tristate; L-PD2 | **STILL LIVE.** 2 editions contradict. Handled by L8, not solved. |
| **B6** | greatworks licence integrity (L-GW) | **STILL LIVE**, 15 of 34 — and **its dependency is unmet corpus-wide**: 0 of 177 opgraph editions and 0 of 34 greatworks works carry `pdBasis`. |
| **B7** | r29 384-work catalogue out of v1 | **SURVIVES.** ~347 of 384 have no slug and no JSON; nothing importable exists. |
| **B8** | the substitution layer | **ADOPTED** and made load-bearing (§5.2). |
| **B9** | delete the hallucination licence | **SURVIVES, and is now measured live** at `llm-context.js:119` and `:523` across all 38 tools. H5's grep-form is superseded by a tested constant (§5.6a). |
| **B10** | synonym-table tombstones · harm-row exclusion · `callable:false` | **SURVIVES.** Tombstones are load-bearing for the seal's synonym resolution (§5.4). Note the open question the grounding report raised: joining `llm-context`'s 38 tool names against `registry.js` on `exportName`/`exports`, **19 match neither** a registry export nor a `callable:true` entry — PLAN §5.2 assumes `registry.js` is the catalog a locator entry joins into, and that assumption is unverified. |
| **B11** | gold labels authored independently | **SURVIVES**, and is Phase 3. Phase 4 does not ship without it. |

### 9.5 Three blockers this plan adds

- **B12 — nothing ranks on opgraph `weight`,** and `citeText()` must stop
  attaching witnesses by prose co-occurrence. §2.4, §5.6b. **This is a live
  shipped defect at 47.6% prevalence, not a design risk.**
- **B13 — every emitted count declares its unit in the same string as the
  number.** §2.3, §5.5.
- **B14 — the artery ends at a stump.** Five shipped data modules name
  generators that are not in the repository; `scripts/` contains exactly one
  `gen-*` script. The locator is reproducible from tracked source exactly as far
  as those modules are and no further. This does not block Phase 1; it bounds
  what "reproducible" means and must be stated wherever that word is used.

---

## 10. Attribution — which idea came from where

| idea | from | role here |
|---|---|---|
| Postings as retriever **and** verifier; the assertion and the evidence are the same bytes | **D2** | §5.1, the spine of the anti-fabrication argument |
| Column-store `rows.json` + front-coded `index.json`; ASCII dual keys; bounded 1.6× graph rerank | **D2** | §3.1, §4.1 |
| Pure `core/locator.js` taking the parsed index as an argument | **D2** | §3.1 — the cleanest statement of the purity contract in the round |
| Bloom filters rejected on error direction (false positives *admit* fabrications) | **D2** | §5.4 |
| `weakFingerprint` flagged, never dropped; UI shows source text beside those rows | **D2** | §3.3 L7, §5.4 |
| The verifier as a standalone instrument, shipped **before** any generator | **D2** | Phase 2 |
| Per-module count floors, because its own extractor silently lost 247 rows | **D2** | §3.3 L1 |
| Re-measuring an inherited number and refusing to smooth the disagreement | **D2** | the practice §2.3 turns into B13 |
| The `citeText`/`witnessesInherited` defect — found, and verified here | **D4** | §2.4, Phase 0 |
| `node.sources[] → OPGRAPH_META.sources`, the join that works | **D4** | §2.5 |
| The **verifiability ceiling** (text/summary/work) as an enforcement column | **D4** | §3.2, §5.3 |
| Dereference-or-throw; nothing may rank on `weight` | **D4** | §5.6b, B12 |
| Concord/agreement edges carry **forced attribution** and can never be a lead citation | **D4** | a fabrication surface nobody else saw; adopted for Phase 5 |
| Refusal strings must name the terms actually searched | **D4** | §4.1 step 3 |
| The negative-evidence gap (25 confirmed absences have no row type) | **D4** | §8.1.8 |
| Zero-shipped-byte Phase 1 | **D4** | Phase 0 |
| The **anchor seal**, HARD/SOFT/FREE partition with the site's own vocabulary FREE | **D1** | §5.4 |
| Conjunctive **coverage at a single citable row** as the abstention gate, computed **before** the model is invoked | **D1** | §4.1 step 3 |
| Per-row FNV source hash making "the index describes the shipped text" checkable | **D1** | §3.2 |
| Term-initial sharding over a shared header — the delivery tier D2 rejected under a different scheme | **D1** | §6.3 |
| Nodes **reference**, never **copy** — the index duplicates no content byte | **D1** | §6.2 |
| Type suppression: types with no address may route but never answer | **D1** | §4.1 step 6 |
| A generator that cannot copy a citation does not mint the row | **D1** | §5.1 |
| Materia as the phase that changes what is *answerable* | **D1** | Phase 5 |
| The query-side encoder arithmetic that permanently rules out embeddings | **D3** | §8.4 |
| "Cosine similarity never creates a join. Semantic similarity is not evidence of identity." | **D3** | §9.3, the ledger rule |
| Retrieval may **propose** merges into a human worklist, never assert them | **D3** | Phase 5 groundwork |
| Drop the 114 page rows as a **correctness** fix — a page is not a locus | **D3** | §3.3 L9 |
| Per-module normalisation + diversity cap, justified by 27× block-diagonality | **D3** | §4.1 step 7 |
| `granularity` ⊥ `depth` kept orthogonal | **PLAN §4.1** via **D3** | §3.2 |
| Determinism without transcendentals; vacuity floors on every assertion | **D3** | §3.3, §5.5 |

---

## 11. The one thing to keep if everything else is negotiated away

**Phase 0.** It ships zero bytes, it is one line in the verify gate, and on the
day it lands it names forty claims in the shipped graph that rank on evidence
they do not have — including the highest-weighted claim in the corpus. The
retrieval architecture is negotiable. The finding that the graph already
contains the failure this plan was convened to prevent is not.
