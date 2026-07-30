# S16 — the criticism and reception literature: method, gaps, and what the auditor must attack

Companion to `16-criticism-reception.json`. Written 2026-07-30.
**40 works, 88 edges, 38 source keys, 57 `ext:` stub nodes, 16 unresolved contested blocks, 21 harm notes, 16 self-declared compiler inferences.** (All counts machine-verified against the emitted file, not asserted.)

---

## 1. What this slice is, and the one structural difference from every other slice

Every other slice in this graph files **operative texts**. This one files **arguments about operative texts and
about the people who made them famous**. The consequence is that the `procedures[]` axis, which is the spine of
S10 and S13, is nearly empty here — and it *should* be. I added a completeness value `n/a-secondary` so that an
empty procedures array on a criticism book reads as "correctly empty" rather than "not yet researched".

Five rows do carry a procedure. Every one of them carries `sourceLayer: "secondary-scholarship"`, because the
grade describes **the scholar's description**, never the rite. If a downstream generator ever renders a
completeness grade from this file next to a grade from S10 without carrying `sourceLayer` through, it will be
comparing two different things and the output will be wrong.

## 2. Schema decision — I shipped a superset, and this is the first thing to attack

The brief said "read one slice first and match its schema exactly". I did, and **the on-disk slices do not agree
with each other**:

| | `10-indian-tantra` | `13-east-asian` | `14-abrahamic-esoteric` | brief's shape |
|---|---|---|---|---|
| edge relation key | `type` | `type` | `type` | `kind` |
| edge citation key | `cite` | `citation` | `cite` | `sources` |
| edge evidence | sometimes `evidence` | always `evidence` | `note` | `basis` + `evidence` |
| work date key | `date` | `dateText` | `dateText` | `dateText` + `sortYear` |
| edition shape | `{cite, pd}` | `{...}` | `{ref, pd}` | `{translator, year, publisher, pdStatus, quoteSafe}` |
| completeness present | yes | **all null** | yes | required |

There is no single schema to match. I emitted **both** key sets on every edge and every work: `type` and `kind`
carry the same string; `cite` is always the space-joined `sources` array; editions carry `cite`/`pd` *and*
`translator`/`year`/`publisher`/`pdStatus`/`quoteSafe`; procedures carry `type` *and* `typeAsFiled`.

**Attack this.** If the maintainer wants one canonical shape, this file is the easiest to normalise (it is the
only one with both), but it is also the only one that is deliberately redundant, and redundancy rots.

## 3. Method, stated at its actual weakness

WebSearch + WebFetch, one working day. **I read no monograph in this slice.** Not one. Every book-level
characterisation comes from a publisher page, a catalogue record, an encyclopedia article with a citation trail,
or a review notice. S10 had a full dissertation read behind its completeness grades; this file has nothing
equivalent, and the grades are hedged accordingly (`completenessBasis: "not-read-this-round"` appears on every
procedure row).

I did grep the repo (`assets/js/core/data/confluence.js`) for every figure in the brief, and every work row
carries `dedupWith` recording what the repo already says. Six repo records already cite people in this slice:
Woodroffe/Taylor (with the two-position contested block already correct), The Serpent Power, Pierre Bernard/Urban,
Krishnamacharya/Singleton, the rasa corpus/White, and the haṭha corpus/Mallinson.

**What that grep found that matters:** the repo already carries the *conclusions* of this literature in several
places while carrying none of the *arguments*, and none of the *disputes*. It cites Sanderson for datings without
recording that his dependency thesis is contested. It cites Singleton and Mallinson side by side without recording
that one wrote a response to the other. It states that the Ṣaṭcakranirūpaṇa became the West's chakra source
"almost by accident of selection" — which is a construction claim of exactly Urban's kind — without the framework.

## 4. The finding I most want read: the public-domain asymmetry

`crit:pd-status-of-the-criticism-layer` is a node, not a footnote, because it bears directly on FRAMING.

Every substantive work here dates 1965–2022. **Not one is public domain.** The single exception is the AHRQ
evidence report, a US federal work. Meanwhile the primary editions the site may eventually quote — Avalon 1917,
Avalon 1919, Whitney & Lanman 1905, Bloomfield 1897 — are all pre-1930 and quotable.

So a quotation policy keyed to public-domain status **structurally privileges the Victorian and Edwardian
occult-revival translations over the modern scholarship that says those translations are unreliable.** The site
could quote *The Serpent Power* at length and would be permitted only to *cite* Taylor's demonstration that its
authorship attribution is wrong.

This is not an argument against the quotation amendment. It is an argument that FRAMING §2.4 is load-bearing in a
way §2.4 does not itself say, and a concrete proposal: **every quoted pre-1930 edition should be required to carry
a cited modern corrective in the same record.** That is a machine-checkable rule.

## 5. Where I handled live disputes, and how

Six rows involve living people, live political disputes, or organised communities with an active stake:
Kālī's Child, The Hindus, Indra's Net / the plagiarism allegation, Invading the Sacred / The Battle for Sanskrit,
the Siddha Yoga article, the Sivananda allegations. Plus the Anusara row and the Rajneeshee attack.

The discipline I applied, uniformly:

1. **Allegation → response → outcome, in that order, always all three.** Where the outcome is "no formal
   proceeding occurred and no adjudicating body issued a finding" (Indra's Net) or "no court ruled on the
   merits" (The Hindus) or "no court, regulator or independent investigator finding was located" (Sivananda),
   the row says exactly that. Absence of a finding is recorded as absence — never as vindication, never as guilt.
2. **Withdrawal is not a finding; republication is not a finding.** Penguin India's February 2014 settlement and
   the Speaking Tiger republication are both recorded, and the row states in terms that neither is a
   determination about the book.
3. **Ending a reply is not conceding.** Kripal announced in late 2002 that he was ending formal responses; the
   2010 Tyagananda/Vrajaprana volume therefore has no reply from him. The edge says so.
4. **Institutional position is stated, never used to discount.** Tyagananda is a monastic of the Ramakrishna
   Order; Schneider's TM reply is from movement-affiliated researchers; the AHRQ critique came substantially from
   researchers aligned with the practices reviewed. Each is stated as a fact about the source. A translation
   objection is right or wrong independently of who makes it.
5. **Political characterisations are attributed.** "Acknowledged proponent of Hindutva" and "famed Hindu
   nationalist" (Amanda Lucia) appear as attributed characterisations, never in this file's voice.
6. **The four separate kinds of objection to Kālī's Child are kept separate** — translation, documentary,
   methodological, community/polemical. Collapsing them (which almost every popular account does) makes the
   dispute unarguable in both directions.
7. **Narasingha Sil is load-bearing for exactly this reason**: he had published his own psychoanalytic study of
   Ramakrishna before attacking Kripal, so his objection cannot be read as a tradition defending itself against
   psychoanalysis. Any presentation that files him with the Order's defenders is misreading the record.
8. **Singleton vs Mallinson is not a feud** and the file says so with an edge kind of its own
   (`SUPERSEDED_BY_COLLABORATION`). Mallinson opened by calling *Yoga Body* a wonderful piece of work; the two
   later co-authored *Roots of Yoga* and ran the Haṭha Yoga Project together. It is a **scope** correction.

## 6. Gaps — the honest list

**Requested by the brief and NOT delivered:**

- **"Vishwa Adhyayan Kendra"** — *no organisation of that name was verified to exist.* It does not appear in the
  Rajiv Malhotra reference article; targeted searching found nothing. What does exist: the Infinity Foundation
  (Princeton, 1995, 400+ grants, advisory board drawn mainly from software rather than academia) and a "Center
  for Indic Studies" which reference sources current to May 2026 say Malhotra chairs. **I did not silently
  substitute either.** The brief's named body is recorded as unconfirmed. Someone should check whether the brief
  meant one of these, or the UMass Dartmouth Center for Indic Studies, or something else entirely.
- **Criticism of Sivananda-*lineage claims*** (the historicity of the lineage, as distinct from the abuse
  allegations). Searching returned only organisational lineage pages. Nothing scholarly found. Unfilled.
- **Named critics of Eliade beyond Strenski and Wasserstrom.** The Wikipedia fetch confirmed a criticism section
  exists and gave its three themes (overgeneralisation, lack of empirical support, far-right/nationalist
  influences) but **named nobody** — not J. Z. Smith, not McCutcheon, not Dubuisson, not Rennie. I gave rows only
  to the two I could verify bibliographically. Their absence is a hole, not a judgement.
- **A named defender of Eliade.** The contested block on the Iron Guard question carries a defender's position
  with **no name attached**, and flags itself as defective for that reason.
- **Named critics of N. N. Bhattacharyya.** None found. The strongest documented criticism of the 1982 book is
  the author's own 1999 preface withdrawing some formulations — and *which* formulations he withdrew was not
  determined. **Anyone citing the 1982 edition may be citing a claim its author abandoned.**
- **The Kāmākhyā access-and-representation dispute** as an actual named dispute. Urban's and Dold's positions are
  recorded; no named published opponent was found. Recorded as not-found rather than invented.
- **The Siddha Yoga organisation's reply to Caldwell.** Not located. The contested block records the missing
  position as missing rather than paraphrasing an absent party's defence.
- **Academic reviews of *Invading the Sacred*.** Only favourable community reception was found. That is a gap in
  the search, not evidence of concession.
- **The Cochrane 2014 conclusion text.** Record located, scope recorded, conclusions not retrieved. Flagged
  in-edge; must be fetched before any site use.

**Bibliographic discrepancies left open (deliberately):**

- Bharati, *The Tantric Tradition*: **1965** (Internet Archive scan, and the brief) vs **1966, rev. 1975**
  (Wikipedia). Resolvable by reading the Rider imprint page. Not resolved.
- Sil's Ramakrishna monograph: **1995** (per the reception summary consulted) vs **1991, Brill** (common
  catalogue listings). Not resolved.
- Caldwell, *Oh Terrifying Mother*: title, subtitle and imprint **not re-verified this round**. Row carries a
  strike flag.

## 7. What the auditor must attack, ranked

1. **The superset schema (§2).** It is the single decision most likely to be wrong. If the generator ignores the
   duplicated keys, they are dead weight; if it reads the wrong one, the output is subtly wrong.
2. **`crit:brooks-anusara-entanglement` and its edge.** Sole source is yoga-press journalism from February 2012.
   It carries BLP exposure for two living people and its scholarly payload is one structural observation. I flagged
   it a strike-candidate in-file. **My recommendation is to strike it unless the structural point is wanted badly
   enough to source it properly.** No allegation against Douglas Brooks is recorded or implied anywhere.
3. **The `ext:sanderson-priority-objection` edge.** Sole source is an undated Substack essay. I included it
   because a real counter-current exists outside the journals and pretending otherwise would be its own
   distortion — but a blog is not evidence and the edge says so twice. Strike-candidate.
4. **`crit:caldwell-oh-terrifying-mother`.** Imprint unverified. Verify or strike.
5. **The 16 `ASSERTED: true` edges.** Each names itself as a compiler inference. The four I am least sure of:
   - `crit:urban-tantra-2003 COMMENTS_ON crit:bharati-tantric-tradition` — **if Urban does not in fact engage
     Bharati, this edge is simply wrong.** I did not verify it.
   - `crit:wedemeyer REFUTES crit:white-kiss-yogini` — the publisher framing names three fallacies; that White is
     the target of the first is my reading.
   - `crit:white-kiss-yogini REFUTES crit:brooks-secret-three-cities` — neither author was verified to have
     engaged the other. The opposition is real at the level of readings; the *edge* is mine.
   - `crit:demichelis → repo:raja-yoga-1896` — applied from a subtitle. Low confidence, flagged in-file.
6. **The `ext:` namespace.** 57 stub nodes — scholars, organisations, events, generic positions, genres. None is
   a works[] row, deliberately: promoting one would imply an evidentiary base I do not have. But 65 of 176 edge
   endpoints point into this namespace, which means **more than a third of this graph's edges terminate in a
   label rather than a node.** That is a real structural weakness and an auditor should decide whether it is
   acceptable or whether the slice needs a second pass to resolve them.
7. **The Sanderson row.** I graded the dependency claim from a *secondary characterisation* of a 310-page article
   I did not read, and the file says the popular version of the claim is stronger than Sanderson's own. If that
   characterisation is wrong, the Sanderson/Wedemeyer/Davidson triangle — four edges — is wrong with it.
8. **`ext:dold-kamakhya`, `ext:openshaw-1995`, `ext:ray-1997`.** Name-and-year only; no position retrieved. Thin.

## 8. Vocabulary I added, and why

Existing edge types could not carry this slice. Added, declared in `meta.edgeVocabularyExtension`:
`REFUTES`, `REFRAMES`, `CRITICISES_TRANSLATION`, `ALLEGES_MISATTRIBUTION`, `REDATES` (declared, ultimately
unused), `DEFENDS`, `RESPONDS_TO`, `ALLEGES_PLAGIARISM`, `LEGAL_ACTION_AGAINST`,
`SUPERSEDED_BY_COLLABORATION`.

Two procedure-type gaps recorded rather than papered over:
- **fluid-transactional rite** (White's subject) — filed under `coercive-rite` with `typeIsApproximate: true`.
  The fit is bad and the flag says so.
- **possession/performance rite** (Caldwell's teyyam/muṭiyēṟṟu material) — filed under `invocation/evocation`,
  same flag.

`SUPERSEDED_BY_COLLABORATION` is the one I would defend hardest. The graph needs a way to say *"this looked like a
dispute and the participants settled it by working together"*, because without it every criticism edge reads as an
unresolved fight, and the Singleton/Mallinson case would be actively misrepresented.

## 9. One thing this slice says about the repo itself

`crit:wasserstrom-religion-after-religion` is uncomfortable and I want it on the record. Wasserstrom's argument is
that Scholem, Eliade and Corbin — at Eranos, 1949–1978 — built the modern comparative-esotericism framing by
de-emphasising law, ritual and social history in favour of myth and mysticism, and that its most controversial
consequence was minimising the binding character of moral law.

**This repository is a comparative survey of esoteric systems.** It is the genre Wasserstrom is writing about. I
have not asserted that the critique lands on this site — that would be adjudicating — but the row is filed with
`siteRelevance: high` and it belongs in front of the maintainer alongside the pizza effect, which is the other
concept in this slice that the site cannot safely ignore: **any claim that a repo-listed Eastern practice is "the
traditional form" has to survive a pizza-effect test, because the version that reached the compiler may be the
re-imported one.**
