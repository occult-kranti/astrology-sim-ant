# Master Plan v3 — the documented-practice turn

**Authoritative direction document, 2026-08-01.** Supersedes `MASTER-PLAN.md`
and `MASTER-PLAN-V2.md` for planning; those keep their round logs.
Round-level queue: [`docs/plans/LOOP.md`](docs/plans/LOOP.md).
Continuation prompt: [`docs/plans/HANDOFF.md`](docs/plans/HANDOFF.md).

---

## 1 · The turn

The site began as a study workbench: what the texts *say*, held at arm's length.
It is now becoming a **documented-practice reference** — per planet, per materia,
per procedure, step by step, book by book, with every step credited to the text
and edition it comes from.

Three commitments come with that, and they are the whole difference between this
and the thousand sites that already exist:

1. **Book-based.** A step exists on this site because a named text at a named
   locus gives it. No step is assembled from general knowledge, and none is
   improved, modernised or completed.
2. **Credited, never owned.** These are living and historical traditions
   belonging to the communities that carry them. The site documents and
   compares; it claims authorship of nothing, and says so on the page rather
   than in a footer.
3. **Comparison is the contribution.** Anyone can transcribe one grimoire. The
   thing only this corpus can do is put the Picatrix, Agrippa, the tantric
   compendia, the Daoist canon and the pañcāṅga tradition beside each other on
   the *same* question — what is burned, at what hour, under whose rulership —
   and show where they agree, where they diverge, and where one is silent.

---

## 2 · The licence question, answered properly

The maintainer's instruction: *ignore licence-blocked, this is culture and
religion, give proper credit.*

**The premise is right and the block was never on the tradition.** But the
correction matters, because it makes the plan *bigger*, not smaller:

> A copyright sits on a **modern translator's English**, not on the tradition and
> not on the source text. Greer–Warnock own their 2010 rendering of the
> Picatrix. They do not own the Picatrix.

So the route is not to ignore the licence — it is to **go to the public-domain
sources directly**, which yields *more* usable text, not less:

| tradition | the PD route |
|---|---|
| Picatrix | the Latin *Picatrix* and the Arabic *Ghāyat al-Ḥakīm* themselves |
| Agrippa | **Freake 1651** — the standard English, public domain |
| Heptameron | Peterson's edition of a PD text; the underlying text is PD |
| Key of Solomon | **Mathers 1889** — PD |
| PGM | **Preisendanz 1928** — PD in the US |
| Amduat | **Budge 1905** — PD, already used correctly in the Egyptian dossier |
| *Magus* | **Barrett 1801** — PD |

**What this changes:** the materials matrix is no longer blocked. The Picatrix
column gets built from the Latin/Arabic with a PD English where one exists,
paraphrasing modern scholarship and citing it. Full step-by-step content, fully
attributed, nothing borrowed from a living translator.

**What stays, and it is narrow.** Two ceilings in `docs/FRAMING.md` are safety,
not licence, and they survive the turn untouched:

- **C-1, the operable triple** — for a harm-flagged materia the site carries at
  most two of {substance · quantity · process parameter}. Rituals are documented
  in full; a *toxic preparation* is not dosed. This costs almost nothing: it
  binds a handful of rows, not the corpus.
- **C-2, bodily-injury technique** — the graded regimen of self-injury practice
  is described and located, not transcribed as method.

**One thing needs the maintainer's signature, not mine.** `FRAMING.md` is a
locked document with its own amendment process. "Practical magick and ritual
documentation" is a genuine change to how the site presents itself, and it
should be an *explicit amendment* rather than something that drifts in through
a build round. Draft it before the first ritual page ships.

---

## 3 · Removed, kept, added

**REMOVED from the plan**
- *"Licence-blocked, do not build"* on the Picatrix materials column and the
  wider materia matrix. Re-route to PD sources per §2.
- The `MASTER-PLAN.md` / `-V2.md` roadmap sections as a live queue. Historical.
- Any design that treats the atlas and the operative graph as one thing. They
  answer different questions and the boundary is load-bearing.

**KEPT, non-negotiable**
- The tracked artery: hand-authored source → arithmetic gate → generated module,
  with `--check` and a pristine-export test. Every new dataset joins it.
- The research protocol (`docs/plans/horae/RESEARCH-PROTOCOL.md`) —
  fetcher/compiler split, snippet-required, gap-burden. **Measured 21%
  fabrication before it; nothing enters the corpus without it.**
- The two-column ledger and its stop conditions. A documented-practice turn is
  exactly the kind of expansion that generates instruments and calls them
  knowledge.
- C-1 and C-2.

**ADDED**
- **The materia programme** — per planet **and** per incense/material, both
  directions. §4.
- **The ritual programme** — step-by-step procedures, book-based. §5.
- **The graph + RAG programme** — index everything, answer from the index. §6.

---

## 4 · The materia programme — per planet, per incense

Two indexes over one dataset, and the second is the one nobody else has:

- **Per planet** → what each tradition burns for it. This exists in part
  (`planetary-magic.js`, Picatrix III.7 + Agrippa II).
- **Per material** → *frankincense is assigned where, by whom, for what?* One
  substance, every tradition that names it, side by side. This is a pure
  comparison view and it falls straight out of the graph once materia are nodes.

**Materia become first-class graph nodes**, joined to works by locus and to
planets/hours/deities by the assignment each text makes. A material inherits no
property from its assignment — Saturn's assignment of a resin is a *claim by a
text*, not a fact about the resin.

Immediate deliverable: **HORARIUM**
([spec](docs/plans/horae/HORARIUM-SPEC.md)) — per hour, per materia, per
location, live. Stage 1 is unblocked. Its precondition stands: resolve Saturn's
`'opium, etc.'` (Picatrix III.7 citation queued as a suspected III.3 conflation;
Agrippa I.xliv names black poppy *seed*, which is pharmacologically not opium).

---

## 5 · The ritual programme

Procedures documented **as the text gives them**: numbered steps, the text's own
sequence, its own conditions (hour, day, direction, purity, materials), each
step carrying its locus.

Design rules, learned from what already went wrong here:

- **The step is the unit, and it carries its own citation.** Not a paragraph
  with a footnote. A step whose locus cannot be resolved does not ship — the
  same rule that made the graph's procedure-claims trustworthy.
- **Recension differences are content, not noise.** Where manuscripts differ,
  both ship, attributed. Merging them into one clean procedure is the
  merged-conflict error the audits keep catching.
- **Completeness is graded, not assumed.** The graph already grades works
  `complete | partial | referenced | fragmentary`. A procedure page states which
  it is, so a reader knows whether they are seeing a whole rite or a fragment.
- **Living traditions get the same precision as dead ones**, and no exoticising
  register.

---

## 6 · The graph + RAG programme

**The target.** Ask a question in plain language; the system looks up every
relevant indexed entry across works, authors, cultures, procedures and materia,
and answers **from those entries, with citations** — never from model memory.

**Why this is not a generic RAG build.** Two facts about this corpus dominate
the design:

1. **Most of the corpus is *about* books, not *text from* books.** The graph
   holds 509 nodes describing works and claims; the shipped search index has
   **114 entries — one per HTML page.** There is no content-level index today.
   That gap is the programme.
2. **The measured failure mode is invented provenance.** 21% of research claims
   carried a citation that did not support them. So the retrieval design's first
   job is not recall — it is making a wrong citation *mechanically detectable*.

**Architecture is being designed now** by four independent proposals
(graph-native traversal · lexical index with graph re-ranking · precomputed
quantized embeddings · provenance-DAG where the answer is a proof tree), scored
by three judges on constraint compliance, payload reality and citation
integrity, then synthesized into
[`docs/plans/graph/GRAPH-RAG-PLAN.md`](docs/plans/graph/GRAPH-RAG-PLAN.md).

**Constraints that disqualify rather than penalise:** no build step, no runtime
network, `core/**` pure, generated data reproducible from tracked source, and a
stated byte budget — `opgraph.js` is already 850 KB and a naive embedding index
over ~6,020 points would dwarf the site.

**It composes with the locator plan rather than replacing it.**
`docs/plans/locator/PLAN.md` is 1195 audited lines; its verdict was DO NOT BUILD
AS SPECIFIED (37 strikes, 11 blockers) *while protecting the core idea*, and its
§3.11 records that **the join key the whole thing rests on is 48% broken**. The
synthesis must say which parts are adopted, which superseded, and which blockers
still bite.

---

## 7 · Order of work

| # | what | state |
|---|---|---|
| 1 | Research protocol v2 result — did fabrication drop? | **running** |
| 2 | Resolve Saturn `'opium, etc.'` | unblocked, small |
| 3 | HORARIUM stage 1 — Western hours + materia, live | **unblocked** |
| 4 | Graph+RAG plan synthesized, then phase 1 of it | **designing** |
| 5 | Materia as graph nodes; the per-material view | after 4 |
| 6 | Re-route the Picatrix materia column to PD sources | after 1 |
| 7 | FRAMING amendment for the documented-practice turn | needs maintainer |
| 8 | Ritual programme — first procedure page, one text, end to end | after 7 |

Carried, unchanged: apply the 81 corroboration witnesses (needs the five
source-table shapes normalised first), and the §9.8 `picatrix-prayers.js` fix —
which §2 now makes easier, since the PD route replaces the in-copyright excerpts
rather than merely deleting them.
