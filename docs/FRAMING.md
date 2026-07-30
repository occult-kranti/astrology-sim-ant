# FRAMING — the site's editorial constitution

**Status: in force. Version 2 (the quotation amendment), as hardened by hostile audit.**
Every other document in this repository is subordinate to this one. Where this document and a shipped page
disagree, **this document is wrong until the page is changed**, and the page is changed in the same commit as
the test that pins it.

---

## 0. What this site is, and what changed

This is a static, offline-first study site about historical divinatory, magical and contemplative systems —
William Lilly's astrology, the *Picatrix* and Agrippa, jyotiṣa, tantric ritual, haṭha yoga, rasaśāstra,
Daoist alchemy, the Buddhist canon, geomancy, tarot, the *I Ching*. Its astronomy is computed and checkable
against published reference vectors. Its interpretations are the traditions', always attributed, always
edition-cited. It claims **no predictive or operative validity for any of it**, and it says so on every page.

Its oldest promise is four words: **described, never prescribed.**

**What changed on 2026-07-30.** Until that date the site read "described, never prescribed" as a blanket ban
on reproducing any operative text at all: no rite, no recipe, no charm was ever quoted in its own words, in
any language, from any edition. That reading has been replaced with a bounded one:

> A survey section may reproduce **alleged operational instructions as sourced primary text** — verbatim,
> bounded, from a verified public-domain edition, attributed to edition and locus, inside a marked quotation
> container, as the **object** of study.
>
> The site's own voice does not change. It remains descriptive and it never instructs. What changes is that
> the site may now **show** what a historical author instructed *his* reader, instead of only reporting that
> he instructed something.

**It is a loosening, and this document says so.** A blanket rule was relaxed to a bounded one. The claim is
not that nothing was given up; it is that what was given up bought something the old rule made impossible —
a transmission argument that can actually be checked — and that the new limits are narrower, more numerous
and far more machine-checkable than the old rule ever was. A document that opens by denying it changed
anything cannot be trusted about what it changed.

**Document history.** Drafted, adversarially reviewed and adopted 2026-07-30 — twenty-two findings, nineteen
applied as binding amendments, four of them shipping blockers (§10). This file is the post-audit text. Two
questions were left open for the maintainer and were both ruled on the same day: the adoption date is
2026-07-30, and **§7.6 (removal on request) ships**, routed through the repository's public issue tracker on
the terms recorded in that section. The working papers behind it — the precedent survey, the harm analysis and the
enforcement map — are cited where they carry weight; nothing in them overrides anything here.

**One thing to keep if everything else is negotiated away:** §2.4, the no-original-diffusion-claim rule.
Without it the new section is a compilation of Victorian occult-revival translations arranged into arguments
this site is not qualified to make, and every other control here is decoration on that.

---

## 1. What is unchanged

Nothing in the amendment touches the following. They are invariants; the amendment is subordinate to them.

**1.1 No demonstrated validity.** Astrology, ritual magic, alchemy, mantra, talismanry and divination have
**no demonstrated predictive or operative validity** and no plausible mechanism. Reproducing a text does not
upgrade its claims. A rite attested in four corpora across nine centuries is a well-attested rite and nothing
more: frequency of attestation is evidence about transmission, never about efficacy. The scientific
assessment on the About page (Carlson 1985; Dean & Kelly 2003; Forer 1949; Gauquelin's failed replications;
Jung's own null marriage experiment) stands unamended and governs the new section exactly as it governs
every other.

**1.2 Everything is cited to a real edition.** Every claim carries a source; every source is a real,
checkable publication with an edition and a page or locus. No claim rests on a work the compiler has not
seen. The new section raises this bar rather than lowering it: a quotation without an edition and a locus is
not a quotation, it is a rumour, and the schema refuses it.

**1.3 Contested claims carry every position and are never resolved.** Where scholars disagree — on a date, a
direction of borrowing, an attribution, a reading — the site prints the positions and does not pick. This is
newly load-bearing, because the point of a diffusion section is to argue about direction. The site documents
transmission; it never settles it. Every directional claim carries at least two positions or carries
`direction: 'unknown'`.

**1.4 The reader is never told what will happen to them.** No second-person destiny: no "you will", no "you
are destined", no "this means you are". The banned-phrase list in `assets/js/core/explain/util.js` is
**unchanged**. What changes is its *scope*, not its contents: it becomes site-voice scoped, applied through a
new `findBannedInSiteVoice(record, fields)` helper, because a public-domain translation that renders an
imperative as "you must" would otherwise trip a list written to catch the site predicting a reader's life.
The list is the invariant. Its application is not.

**1.5 Nothing here is advice.** Not medical, not legal, not financial, not psychological, not safety. A text
that says a preparation cures leprosy is a text that says that; the site reports the claim and does not carry
it.

**1.6 The mathematics remains the checkable part.** The astronomy is computed, verifiable and tested against
published reference vectors. The interpretations are the tradition's. That division is the site's oldest
promise and the amendment does not blur it.

---

## 2. What changed, and why

### 2.1 Why the texts are necessary

The diffusion argument is not arguable without them. You cannot claim that a rite passed from the Greek
magical papyri into the Solomonic corpus, or from Śaiva ritual into haṭha yoga, or from Chinese *waidan* into
Indian rasaśāstra, by asserting it. You establish it the way philology establishes anything: you set the
parallel passages side by side and let the reader see what is shared, what is not, and what has been
transposed. Paraphrase destroys exactly the evidence the argument runs on — a shared syllable string, a
shared sequence of stages, a shared substitution slot, a shared *error*. A site that describes a rite in its
own words and then claims two traditions share it is asking to be believed. A site that prints both passages
is showing its work.

### 2.2 The precedent — this is alignment with the field, not drift from it

Verified against primary framing language, not from memory:

- **A university press prints the Greek magical papyri complete and unexpurgated**, in English, indexed by
  purpose, with **no disclaimer of any kind** — an exhaustive full-text search of Betz, *The Greek Magical
  Papyri in Translation* (Chicago, 1986) returns zero hits for *disclaimer*, *warning*, *not responsible*,
  *do not attempt*, *at your own risk*.
- **The justification the field gives is entirely epistemic.** Betz argues that the suppression of this
  literature deprived scholarship of one of its most important sources of ancient religious life, and that
  modern views of Greek and Roman religion were deformed by surviving only through elite literature and
  official cult. Nobody in the record argues that the material is safe or permitted. Everybody argues that
  its absence deforms knowledge.
- **The standard critical edition of the text this site was most cautious about prints the technique in
  full.** Mallinson, *The Khecarīvidyā of Ādinātha* (Routledge, 2007), translates the blade, the depth, the
  aftercare and the weekly schedule — and attaches, in the same footnote, that the practice is dangerous,
  that most of his informants said it was unnecessary *including those who had done it*, that only five of
  the many texts require it, and that named yogins ended with pronounced lisps and difficulty eating and
  talking. **The annotated page is more protective than silence**, because silence cannot say any of those
  four things. §5.1 adopts that shape wholesale.
- **Where scholarship gates, it gates by competence, not by omission.** Kieckhefer, *Forbidden Rites* (Penn
  State, 1997), publishes an entire fifteenth-century necromancer's manual: the vernacular layer is analytic
  and selective; the complete Latin operative text sits unexpurgated at the back of the volume. Nothing
  suppressed; access graded by effort.
- **The describe/instruct line already has a written, grammatical form.** Wikipedia, WP:NOTHOWTO: describing
  to the reader how people or things do something is encyclopedic; instructing the reader in the imperative
  mood about how to do it is not. That is a testable criterion, not a mood. §3 adopts it.
- **The traditions invented this mechanism themselves.** *Mantroddhāra* — transmit the text complete, encode
  the operative key so it is unusable without the decoding lineage — is the same move: publish the whole,
  withhold the working. It is the one precedent internal to the material rather than imposed on it.
- **What the field withholds is not what we assumed.** Across every verified source, the withholding axis is
  **living-community consent, an identifiable living person at risk, or legal prohibition** — never "a reader
  might hurt themselves." Curses, coercive love magic, hostile rites, mutilation technique and toxic materia
  are all printed complete by leading editions. §5 keeps some exclusions anyway, and says so out loud.

**The one respect in which this site is weaker than the field:** the field prints the operative text
*complete*; this site prints it *bounded*. Bounded extracts are the form most prone to editorial distortion,
because the editor chooses which sentence is representative. The mitigation is §4.4 — every bounded quotation
is a pointer into a complete edition that is named and located, and a reader doing real work is expected to
go there.

### 2.3 What the precedent does **not** license

Betz's argument is an argument for producing and circulating *critical editions*, addressed to a field that
produces them. **This site produces no edition.** It is a tertiary compilation, and because of §4's
public-domain constraint it will disproportionately quote Mathers (1889), Vasu (1895/1914) and Sinh (1914) —
the Victorian and Edwardian occult revival, which is precisely the body of work modern critical editions
exist to correct. A site that reproduces the occult revival while invoking the epistemic authority of
Routledge and Chicago has borrowed a licence issued to somebody else.

So the precedent licenses the **reproduction**. It does not license the **argument**.

### 2.4 NO ORIGINAL DIFFUSION CLAIM — the rule that follows

> **The site does not advance a transmission claim of its own.** Every parallel, every direction of borrowing
> and every priority statement is **attributed to a named scholar, work, year and page**, and is reported as
> that scholar's claim. Passages are set side by side to *show the reader what a published argument is
> about*, never as the site's own evidence for a conclusion it reached itself.
> **Where no scholar has made the comparison, there is no row.**

Consequences, all enforceable:

- Every parallel edge carries `claimedBy: { author, work, year, locus }`. **An edge without it does not
  render.** This is the schema-level form of the rule and the strongest single control in this document.
- It makes completion-by-inference (§5, A-2) *structurally impossible*: there is no cell for the site's own
  inference to occupy.
- Every priority statement carries the same attribution. Not "the earliest attested instance is PGM
  IV.1928–2005", but "**Betz dates** the earliest **attested** instance to PGM IV.1928–2005 [cite]".
- Where two scholars disagree, both are named (§1.3).

This costs the section its most attractive feature — noticing a parallel and printing it. That is the price
of the precedent argument being honest rather than decorative.

### 2.5 What the site was already doing right, and one thing it was doing wrong

`assets/js/core/data/abhichara-data.js` already carries short public-domain material with loci (Bloomfield
SBE 42, 1897; Whitney–Lanman HOS 7–8, 1905) under a `pdQuote` + `cite` pattern, including in-data
`CORRECTION:` notes where an earlier round was found wrong. **What that establishes is the citation
discipline — the apparatus — and nothing more.** Every `pdQuote` value in that module is Whitney's or
Bloomfield's *editorial hymn title* ("To make a certain man impotent"), not a line of the charm. The module
quotes an index, not a text. It is precedent for the apparatus; it is **not** precedent for reproducing
operative verse, and claiming otherwise would be this document's first dishonest sentence.

`pages/about/index.html` already states the whole public-domain discipline for The Great Works: only PD
editions are quoted, always edition-cited; copyrighted editions are cite-only, never quoted. That sentence is
this amendment in miniature and it predates it.

And one live defect the amendment fixes rather than inherits: `assets/js/core/data/picatrix-prayers.js`
reproduces verbatim planetary-prayer excerpts from the **in-copyright** Greer–Warnock *Picatrix* (Adocentyn
Press, 2010–11), with no `pdStatus`, no `quoteSafe` and no PD verdict of any kind — and pipes a slice into
every assistant context. Under §4 that is not permitted. See §9.8.

---

## 3. The voice rule

### 3.1 The rule

> **Every string on this site belongs to exactly one of two voices, and which one must be determinable from
> the structure, not inferred from the prose.**
>
> **Site voice** describes. It never uses the imperative about a procedure, never addresses the reader as an
> operator, and always carries an attributing frame — it says *who* is instructing *whom*.
>
> **Quoted primary text** may say anything its source says, including imperatives, including things this site
> would never say — provided the container proves the site has the right to reproduce it and tells the reader
> exactly what it is.

The operative criterion is **grammatical mood plus person**: describing how people do something is
description; instructing the reader in the imperative mood is not. That is lintable. "Is this tasteful" is
not.

**This rule is false of the site as it ships today, and that is a shipping blocker (§10, B1).**
`assets/js/core/talisman.js` generates, live and personalised to the reader's own time and place, a numbered
imperative protocol in site voice — *"Choose the aim…"*, *"Elect the time: act in the day AND hour of
Saturn…"*, *"Prepare the materials: suffumigation of opium, etc.…"*, *"Consecrate at the elected hour: kindle
Saturn's suffumigation (opium, etc.) and speak the petition over the engraving WHILE the smoke rises."* It
carries no quotation container. It names a controlled substance as a material — `planetary-magic.js` gives
Saturn `suffumigation: 'opium, etc.'`, and that module's own header says these recipes name substances that
are toxic or illegal. And it is exposed to the assistant as a callable tool returning `steps`, with the
operation prompt telling the model to call it.

**Resolution, and it lands before any quotation ships:** `talismanRecipe()` is re-voiced to the museum
register — `steps` → `attestedSequence`, each entry third-person and attributed ("Picatrix III directs the
operator to consecrate at the elected hour…"). The alternative is to delete "never instructs" from
`HONEST_FRAMING`, the About covenant and this section, which forfeits the sentence the whole amendment rests
on. Until one of those lands, every "the site's own voice never instructs" string on this site is a claim the
site fails.

### 3.2 The strip test, defined as assertions

The heuristic is: *strip every marked quotation container from the page; what remains must read as a museum
label.* That is a mood, and §3.1 says moods are not lintable. **The test is therefore defined as exactly the
following machine assertions, and the prose is demoted to a reviewer's note with no authority of its own:**

> **The strip test IS: V1 ∧ V3 ∧ D4 ∧ V6.** Anything a reviewer dislikes that passes V1/V3/D4/V6 is a style
> note, not a policy violation.

- **V1** — no site-voice field begins with an `IMPERATIVE_OPENERS` alternate.
- **V3** — every `siteVoice.summary` opens with an attributing frame.
- **D4** — no `<blockquote>` anywhere in the wing outside a `figure.quoted-primary`.
- **V6** — *the strip test is run, not imagined.* The DOM assertion literally performs it: read the wing's
  HTML, delete every `figure.quoted-primary` subtree, and assert the remaining `<main>` text passes V1, V2
  and V3. A test that describes an operation nobody executes is the definition of a rule that will rot.

A record whose quotation is stripped and leaves nothing behind is an orphan quotation and is separately
forbidden (§4.6). The site always says what a passage *is* before it shows it.

### 3.3 Worked examples

| ✗ Forbidden in site voice | ✓ Allowed in site voice |
|---|---|
| "Recite the formula three times at the third hour of the night." | "The papyrus directs the operator to recite the formula three times at the third hour of the night." |
| "Cut a hair's breadth of the frenulum, then rub the cut with rock-salt." | "The text prescribes a repeated incision with an aftercare powder. The practice is dangerous; most of Mallinson's informants said it was unnecessary, including those who had done it." |
| "Hold the breath for a count of sixteen, then exhale for eight." | "The text gives retention a fixed ratio to inhalation and exhalation. The ratio is in the quoted verse below, in the text's own words." |
| "Perform the rite on a Saturday, facing south." | "The tradition assigned this act to Saturday and to the southern direction." |
| "Use aconite root, three *māṣa*, calcined seven times." | "The recipe names aconite, gives a quantity in an archaic measure and specifies repeated calcination. The measure is not reliably convertible and is not converted here." |
| "The Chinese parallel gives no duration, so use the Indian one." | "Not attested in this witness." |
| "This rite originated in Egypt." | "Betz dates the earliest **attested** instance to PGM IV.1928–2005 [cite]. Whether it originates there is contested: [position A], [position B]." |

**And the same content, allowed, because it is quoted:**

```html
<figure class="quoted-primary" data-record="gs-3-25" data-locus="GS 3.25"
        data-edition="Vasu, The Gheraṇḍa Saṁhitā (1895; SBH XV.2, 1914–15)" data-pd="pd-us" lang="en">
  <div class="qp-harm">The text prescribes a surgical mutilation. Cutting the lingual frenulum risks
    haemorrhage from the sublingual and deep lingual vessels, infection, nerve injury and permanent speech
    and swallowing impairment. Mallinson (2007) records that most of his informants said the cut was
    unnecessary, including those who had done it, and reports yogins left with pronounced lisps and
    difficulty eating and talking.</div>
  <blockquote>Cut down the lower tendon of the tongue … and draw it out.</blockquote>
  <figcaption class="qp-attrib">
    <cite>Gheraṇḍa Saṁhitā 3.25</cite>
    <span class="qp-edition">Vasu (1895)</span>
    <span class="qp-pd qp-pd-pd-us">Public domain in the United States</span>
  </figcaption>
</figure>
```

The imperative in that block belongs to a named translator rendering a compiler who addressed his own
reader — the *Gheraṇḍa Saṁhitā* is a late-seventeenth or early-eighteenth-century text. The site is showing
you what he told him. The site is not telling you anything. That difference is the whole amendment, and it is
carried by the container, not by tone.

Note what the example does **not** contain: no schedule, no interval, no session count (§5, C-2). Note also
what it does contain and where: **the harm note is inside the figure and precedes the blockquote**, so that
no prefix-truncated extraction can carry the quotation without the note (§5, A-5).

### 3.4 What this means for the lint

The current linters are voice-blind: they take a record, `JSON.stringify` it, and grep for banned tokens.
`scripts/engine-test.mjs` bans the bare tokens `perform|recite|kill|slay|burn|write|chant` anywhere in a
serialized abhicāra screen. That assertion is **correct for what it guards** — a computed correspondence
screen, which is site voice by construction and must never emit a verb — and **fatal** to any structure that
carries a quotation.

The resolution is not to relax it. It is to scope by field:

- `SITE_VOICE_FIELDS = ['summary','whatItIs','harmNote','lede','note']` — linted, always.
- `QUOTED_FIELDS = ['text','translation.text']` — never linted.
- The abhicāra screen assertion stays **exactly as written**, with a comment recording that it is
  site-voice-scoped by construction: that screen has no quotation field, so the two rules can never overlap.
- The exclusion must be proven narrow, not assumed (**V5**): assert positively that at least one shipped
  record's quoted text *would* fail the site-voice lint if it were linted, and does not fail the suite.
  Without that assertion the carve-out in the linter is untested and could silently swallow everything.

---

## 4. The provenance rule

### 4.1 Only verified public-domain or open-licensed text is reproduced

The permitted verdicts are exactly four, and they are an enum, not prose:

| `pdBasis.verdict` | Meaning | May the text be reproduced? |
|---|---|---|
| `pd-us` | Public domain **in the United States**, on a stated and checkable ground | Yes |
| `cc0` | Public-domain dedication by the rights-holder | Yes |
| `cc-by` | Open licence requiring attribution, which is given | Yes |
| `cite-only` | In copyright, or status unresolved | **No — never, however important to the argument** |

`cite-only` is not a lesser tier of quotation. It means the record carries locus, work, edition, site-voice
summary, parallels and contested block, and **no quoted text and no translation text**. A copyrighted passage
appears in the diffusion graph as a node with a citation; it does not appear as text. **The schema enforces
this — a `cite-only` record is physically incapable of holding a transcription** — so no reviewer and no
scanner is needed. That move, *make the schema incapable of holding the payload*, is the design principle of
this whole document and is applied six more times below.

**One vocabulary, not four.** The repo already ships two licence vocabularies — `quoteSafe: boolean` +
`pdStatus` on work records, and `licence ∈ {cc0, pd-age, original}` at quoted-unit granularity in the
Buddhist wing. Three enums for one concept is how a rule rots: a future round tightens one, no test notices
the others. **Required in the same commit as the first quotation:** a single `PD_VERDICTS` source of truth in
`assets/js/core/quoted.js`, a declared total mapping (`quoteSafe:true → pd-us`, `quoteSafe:false →
cite-only`, `cc0 → cc0`, `pd-age → pd-us`, `original → cc-by|cc0` per record), and an assertion that every
licence-bearing record in the repo resolves through it. The Buddhist wing's `licence` is migrated, not left
as a parallel dialect.

### 4.2 Jurisdiction is stated, because the site cannot issue a global verdict

**Every verdict in this document is a United States verdict.** The site is served worldwide and precached
offline by a service worker, and the same edition can be public domain in the US and in copyright in the EU —
Preisendanz died in 1968, so the German term runs to 2039. The site is not competent to issue a global
verdict and will not pretend to. Therefore:

- the enum value is `pd-us`, never bare `pd`;
- every rendered chip reads **"Public domain in the United States"**, never bare "public domain";
- the About page states that the site's PD determinations are US determinations and nothing more.

### 4.3 The ground must be checkable, not asserted

`pdBasis.ground` is prose for the human; `pdBasis.verdict` is the enum for the machine. A record saying
"probably fine" must fail. For `verdict: 'pd-us'`, the ground must state a **mechanism and a year** — the
95-year term, a pre-1931 publication date, a failure to renew, a URAA determination, or an expired term — and
`pdBasis.sources` must carry at least one `https:` citation.

The check is: the ground matches `/(95-year|renewal|not renewed|URAA|term expired|published (in )?1[89]\d\d)/i`
**and** matches `/\b1[89]\d\d\b/`. The phrase "public domain" is **not** an accepted ground, because every
`pdStatus` string on the site contains it by definition and an alternation containing it is vacuous.

**Current US threshold, verified:** works published in **1930 or earlier** entered the US public domain on
1 January 2026 (Duke Law Center for the Study of the Public Domain, *Public Domain Day 2026*); 1931 works
follow on 1 January 2027.

**Consequence, stated because it will bite:** Preisendanz, *Papyri Graecae Magicae* vol. 1 (1928) is public
domain; vol. 2 (1931) is **not** until 1 January 2027. Whoever builds the PGM rows checks volume by volume,
not corpus-wide.

### 4.4 The named cite-only editions, and the philological cost of avoiding them

Excluded on copyright alone, before any harm question arises: **Betz**, *The Greek Magical Papyri in
Translation* (1986/1992); **Mallinson**, *The Khecarīvidyā of Ādinātha* (2007); **Bühnemann** on the six
acts; **White**, *The Alchemical Body*; **Ware** and the modern Daoist translations; **Copenhaver**'s
*Hermetica*; **Kaske & Clark**'s Ficino; **Greer–Warnock**'s *Picatrix*. They are cited, page-referenced,
argued with, and never reproduced.

The public-domain routes used instead: Griffith & Thompson, *The Demotic Magical Papyrus of London and
Leiden* (1904); Bloomfield, SBE 42 (1897); Whitney & Lanman, HOS 7–8 (1905); Mathers, *Key of Solomon* (1889)
and *Abramelin* (1900); Vasu (1895/1914); Preisendanz vol. 1 (1928).

**The cost is stated, not hidden.** The public-domain constraint silently selects the *worst* witnesses —
editions superseded by exactly the critical editions the site cannot quote. Where the PD text is known to be
a poor witness, the record **says so and cites the modern critical edition and locus anyway**, even though
its text cannot be reproduced. A site that reproduces the Victorian occult revival while claiming to
reproduce antiquity has committed the one failure this site has consistently refused to commit.

Every bounded quotation is a **pointer** into a complete edition that is named, dated and located, and a
reader doing real work is expected to go and get it. That is Kieckhefer's arrangement adapted to a medium
with no back of the volume: the site is the selective analytic layer, and it always names the place where the
complete text lives.

### 4.5 Boundedness — the caps, and how each is measured

Five caps, all machine-checked, all auditable. Length alone was never the right control and the first four
caps exist because it is not.

**1. Per passage: 120 words AND 700 NFC codepoints, whichever binds first.**
Chinese, Japanese and Thai do not delimit words with whitespace — a 2,000-character Daoist *waidan* passage
tokenises to **one word** and passes a 120-word cap by a factor of a thousand. Sanskrit compounds under
sandhi undercount by three or more. **Scripts without word spacing use a 300-codepoint cap and no word cap**,
selected by the record's declared `script` value, which is itself checked against the dominant Unicode block
of the text — because an author mistypes a `lang` attribute and no test catches it.

**2. The pair is capped, not each half: 180 words / 900 codepoints for text + translation together.**
Giving the translation its own 120-word budget means 240 words for one locus — and for an English-reading
audience the translation *is* the payload; the Greek is decoration.

**3. Never a complete operative unit.** Most PGM spells, most Atharvan charms and most short *vidhi*
fragments are **shorter than 120 words in their entirety**, so a per-passage word cap licenses reproduction
of a complete, standalone, working rite while congratulating itself on being bounded. Therefore: **no
quotation may constitute a complete operative unit** — a whole spell, charm, recipe, consecration or
*prayoga* — regardless of its length. Enforced structurally: every record declares `quoteBounds.unitExtent =
{ of: N, quoted: 'a–b' }` locating the quoted lines within the operative unit as the edition numbers them,
and the quoted span is asserted strictly smaller than the unit. **A record that cannot state where its
passage sits inside the unit does not know what it is quoting and does not ship.**

**4. Per work: `min(20 records, 5% of declared extent)`.** "5% of the work" with no denominator is not a
rule. Every work record carries `workExtent: { unit: 'lines'|'verses'|'words'|'sections', total: N, source }`.
Where the extent is not declared, the cap for that work is **5 records**, not 20. And **"work" is defined**:
the citable bibliographic unit at which the edition itself numbers loci — `PGM IV`, not `PGM`; *Atharvaveda*
book 6, not the *Atharvaveda*. Without that definition a single "work" called *PGM* absorbs twenty records
from every papyrus in the corpus.

**5. No contiguity — structurally, because free-text loci cannot be compared.** `"PGM IV.1928–2005"` and
`"KhV 1.46–47"` are strings; no assertion can order them. Every record carries
`locus: { label, book, from, to }` where the edition numbers numerically. Assertion: within a work, no two
ranges overlap, **and consecutive ranges are separated by at least their own combined length** — otherwise
"non-adjacent" is satisfied by a one-line gap and the text is serialised anyway. Where a locus is not
numerically parsable, that work is capped at **3 records** and the fact is recorded in-data.

**6. The same locus is quoted once, in one edition.** Nothing otherwise stops the site quoting one passage
from Mathers *and* from Vasu *and* from the Greek, tripling the budget for a single text under three record
ids. One locus, one record, one edition; variant readings go in the site-voice fields, cited.

### 4.6 No orphan quotations

Every record carrying quoted text also carries a non-empty `siteVoice.summary`. The site says what a passage
is before it shows it. A quotation standing alone with a citation underneath is a reproduction, not a study.

---

## 5. The carve-outs

### 5.0 How this list was derived

There are two distinct routes from a page to a body, and conflating them produced every wrong answer in the
first draft of this policy.

- **Route A — access-mediated.** The reader already wants to do the thing and the text supplies capability
  they lacked. Risk = severity × capability conferred × **scarcity elsewhere**. Where the identical operative
  content sits in a public-domain book indexed by every search engine, reproducing it confers no capability
  and withholding it is theatre. Toxic materia, khecarī, entheogenic materia and abhicāra are all Route A,
  and all four have a scarcity term of approximately zero.
- **Route B — imitation-mediated.** The reader did *not* arrive wanting to do the thing. The presentation —
  framed as meaningful, disciplined, transformative — supplies the **motive**, and the method detail supplies
  the low-friction script. Risk is driven by how *this site* presents it and is **independent of availability
  elsewhere**. This is the entire evidentiary basis of suicide and self-harm media guidance, which assumes
  universal availability and regulates presentation anyway.

**"It's already online" is a complete defence for Route A and no defence at all for Route B.**

The result: **four things are excluded outright.** Everything else historical is transcribable under a harm
note. The carve-outs below are precision ceilings and interface constraints, not category bans.

### 5.1 The harm-note shape (adopted from Mallinson; applies to every carve-out)

Every harm-flagged record carries a note built to a fixed four-part shape, because the annotated page is more
protective than the blank one:

1. state plainly that the practice is dangerous, and state the **mechanism** — not "be careful";
2. cite a source saying so;
3. report the **tradition's own internal dissent** — who inside the tradition says it is unnecessary, and
   note where those are people who did it;
4. name the documented injuries, where any are attested.

The tradition's own warnings are primary text and are quoted in preference to anything the site could write.
*"Haṭhayoga is said to be very dangerous: many Brahmarṣis have died from it, so it should not be practised"*
cannot be dismissed as modern squeamishness, and it is a philological datum as well as a caution.

The mechanism already exists in the repo — the `harmNote` field, its red-callout renderer, the harm-flag stat
chip, the `harmOnly` filter, the `withHarmNote` coverage count. The new section extends that field. It does
not invent a parallel one. **It does, however, move where the note renders: inside the quotation figure,
before the blockquote** (§5, A-5).

---

### C-1 — The operable triple (toxic materia)

**Rule.** For any harm-flagged substance — mercury, arsenic, lead and other heavy metals; aconite; datura and
other toxic materia — the site may present at most **two** of {substance identity · quantity · process
parameter (temperature, duration, cycle count, route)} in its own voice or in any table it constructs. A
verbatim public-domain quotation containing all three is permitted **only** inside the marked container, in
the original archaic units, unnormalised, with a bound harm note.

**Why not a category ban.** *Rasa-Jala-Nidhi* (Mookerjee, 1926–38) is a complete English rasaśāstra corpus,
free in full, with the mercurial operations spelled out. *Śodhana* and *māraṇa* are examinable content in
India's accredited BAMS syllabus, taught to thousands of students a year. Withholding a twelfth-century verse
that a state-recognised medical curriculum teaches is not a safety measure, and it would suppress the single
richest diffusion dataset on the site.

**Where the real risk is, and it is ours, not the text's.** The uplift lives in **normalisation** — the
editorial instinct to convert *pala* to grams, *puṭa* cycles to °C, "a lightning-struck branch" to a species.
Every such conversion is capability no public-domain source provides, applied to exactly the substances where
a wrong number is fatal. **Never modernise units, temperatures, durations or species identifications for
harm-flagged material.** Quote the archaic unit; gloss it as not reliably convertible; stop.

**And the honest reason that rule is real.** It is weak as a *safety* control — a reader who can read the
passage can paste it into the assistant this site ships and ask for grams. Its sufficient justification is
**accuracy**: archaic units are regionally variable and not reliably convertible, so any conversion the site
published would be a fabricated number carrying the site's authority, on exactly the substances where a wrong
number kills. That is a first-order violation of §1.2 before it is a safety question. The accuracy claim is
unanswerable; the safety claim would not survive a reviewer.

**Enforced at the schema, not by regex.** A rule whose stated locus of danger is the only place it is not
checked is decorative. Therefore:

- The three facts live in three **named, typed fields** — `substance`, `quantity`, `processParam` — and never
  in free prose. For any record with a harm flag, **at most two of the three are non-null**; the third is
  `null` with a stated reason. There is no regex to defeat, because the third value has nowhere to live.
- The renderer never emits all three as columns of one table row, and the column set is declared in data, not
  chosen in the template.
- The verbatim quotation may carry all three — that is the carve-out — but it lives in the quoted text, which
  is not a table cell and is not a field the comparison view reads.
- **`normalised: false` is a required literal on every harm-flagged record**, and the presence of any of
  `g|mg|kg|ml|°C|°F|minutes|hours` in a harm-flagged record's site-voice fields is a hard failure.

**Harm note must state:** heavy-metal toxicity is documented and current — Saper et al., *JAMA* 292:23 (2004)
and the 2008 internet-products follow-up; CDC *MMWR* 61(33) (2012), six lead-poisoning cases in pregnant women
in New York City, one product at 1.2% lead by weight; a bhasma assaying 19,400 mg/kg lead and 1,430 mg/kg
arsenic (*J Occup Med Toxicol* 8:26). And the correction the site currently gets wrong: cinnabar (HgS) is
**not** methylmercury — oral absorption is around 0.2%, against roughly 95% for methylmercury — but the
alchemical **processing** is precisely what liberates the toxic species. **The process is the hazard vector,
not the mineral.** That is a better warning and a better story than the one now on `pages/rasa.html` (§9.7).

**Is this stricter than the field?** Marginally, on the one axis where documented, contemporary,
non-speculative harm exists. Standard editions print the recipes; so do we, in the container. We decline only
to *build the modern table*.

**What is still provided.** Substance names, doctrine, the stages of the sequence, the cover-name system, the
complete diffusion history, and the tradition's own harm literature — Ge Hong's *Baopuzi* flagging eight
poisonous preparations among fifty-six; the *Zhenyuan miaodao yaolüe*'s thirty-five common fatal mistakes;
the *Xuanjie lu*'s antidotes; Shen Kuo (1088) warning that heat-transformed cinnabar becomes "deadly poison";
the five Tang emperors. That is publishable gold and it is entirely harm-reducing.

---

### C-2 — Precision cap on bodily-injury technique

**Rule.** For practices involving cutting, piercing or forced anatomical alteration: locus, the attested
sentence(s), structural description and harm note are permitted. **No graded regimen, no recommended
interval, no session count, no progression.**

**Why the rule is exactly that narrow, and not wider.** An earlier draft also forbade instrument
specifications and aftercare — and would thereby have required retracting the entry it ratifies in the same
paragraph. `assets/js/core/data/practices/mudras.js` entry `gs-khecari` ships, in **site voice**, "to move
and rub the tongue with fresh butter and to draw it out with an iron instrument": an emollient and an
instrument specification, on a page this document holds up as its model of honesty. The evidence locates the
marginal risk in *"does the reader receive a schedule that makes it feel survivable and staged"* — the
incremental regimen and the recommended interval. It does not locate it in the word "blade" or the word
"butter", which are in the first search result and in every public-domain translation. **The rule gives; the
shipped content stays.**

**`gs-khecari` is ratified as the site's worked example of the correct line.** Anyone who prefers the
stricter line must say so and retract that record explicitly, in a commit that changes the prose, the record
and the test together. What is not available is a rule that silently contradicts shipped content — that is
retraction by drift, which this section condemns.

Note that most of the graded material sits in Mallinson (2007), which is in copyright and therefore excluded
by §4 before the harm rule ever bites. The copyright gate and the harm gate agree here, and the copyright
gate runs first.

**What is still provided.** The verse, the locus, the four-part harm note, and the philological point that
only five of the many texts require the cut at all — which is simultaneously good diffusion history and the
strongest deterrent available, because it shows the practice is a minority position *within its own
tradition*.

---

### C-3 — Hypoxia

**The hazard is not "timings."** The dangerous instruction is not "hold for ninety seconds"; it is **"breathe
rapidly, then hold."** Pre-effort hyperventilation depresses arterial CO₂ so that oxygen falls to
unconsciousness *before* any urge to breathe arrives. Loss of consciousness is abrupt and without prodrome. A
timings carve-out does not touch this at all.

**Rule, in four parts:**

1. Classical retention verses and ratios (1:4:2 and the rest) — **permitted with a mandatory harm note that
   states the hypocapnia mechanism**, not merely that the practice is dangerous.
2. Anything pairing breath technique with **water, submersion or bathing** — **excluded entirely**, in any
   voice, from any tradition, at any date.
3. Anything presenting **loss of consciousness as the goal or the marker of success**, and every post-1900
   blackout protocol — **excluded entirely**. Their existence and their death toll are described; the method
   is not reproduced and not linked.
4. **No timings or ratios in the site's own voice.** Quotation only.

**Why this is stricter than the field.** CDC identified **82 probable "choking game" deaths among US youths
aged 6–19 between 1995 and 2007; mean age 13.3; 86.6% male**, deliberately excluding autoerotic and suicidal
cases. Those are deaths caused purely by the idea that induced cerebral hypoxia produces a desirable state —
exactly the proposition an esoterica page transmits when it presents a blackout technique as a route to
gnosis. This is Route B: the marginal population is not people already researching kumbhaka, it is people who
encountered the idea somewhere, and **a survey wing that gathers Indic, Daoist, Thelemic and chaos-magick
hypoxia practices into one browsable place is a somewhere**. A modern branded method with a safety team and a
warnings page still produced a drowning cluster. A study site with neither should assume it can do no better.
Also on the record: spontaneous pneumothorax attributed to kapālabhātī in a healthy 29-year-old (*Chest*,
2004).

**What is still provided.** The existence of kumbhaka, its doctrinal role, its Sanskrit vocabulary, its
transmission history, the classical verses, and — a genuine diffusion finding worth publishing — the
scholarly correction that holding the breath to unconsciousness is *not* what Spare described in *The Book of
Pleasure* (1913). The modern conflation is itself the story.

---

### C-4 — Self-inflicted-injury method

**Rule.** Where a text prescribes self-inflicted injury as a practice or as a penalty, the **method sentence
is not reproduced** — regardless of public-domain status and regardless of availability elsewhere. The text,
its date, its purpose, its reception and its editions are transcribed freely. The site states **in its own
descriptive voice** that the text directs a self-inflicted cut as the penalty for lapse — **without
instrument, body site, or technique**. Harm note and crisis signposting are mandatory.

**Why availability is no defence here.** *Liber III vel Jugorum* is free in full at sacred-texts, the
Hermetic Library, Wikisource and a dozen mirrors. It does not matter. Media guidance on self-harm exists in a
world where every method is trivially discoverable and regulates presentation anyway, because the causal
pathway is **imitation among people who were not looking**. Operability is maximal — no apparatus, no skill,
no cost. Severity includes scarring, infection and, via the tally-and-escalation dynamic the text builds in,
worse. And an esoterica readership self-selects for precisely the "rigorous self-discipline" framing the text
uses to make the act feel legitimate. This is the highest marginal risk per word in the entire analysis.

**The justification is stated correctly and not dressed up.** Not "the reader cannot find it" — they
trivially can. **"We decline to be a vector."** That is what the contagion evidence supports, and it is the
only claim we make.

---

### C-5 — Non-targeting (hostile and coercive rites)

**Content.** Texts, doctrine, correspondences and history are transcribed with a harm note. **No passage is
reproduced that combines a target-substitution slot** (`NN`, "so-and-so", *amuka*, "whom I wish", "the
enemy") **with an operative sequence.** A hostile rite's diffusion is demonstrable from locus, structural
description and parallels — what travels is the *structure*: the burial of the image, the naming, the
substitution, the nail. It is not the syllable string.

**The rule binds the assembled row, not the passage.** The single-passage form of this rule does nothing
about the case the wing exists to produce: witness A supplies the substitution slot; witness B — the
parallel, in the adjacent cell, placed there deliberately because the site judges them the same rite —
supplies the sequence. Each record passes. The row is a working formula assembled by the site, in the site's
own layout, from two individually compliant parts. That is not a hypothetical failure; it is the section
performing its stated function. So:

> **No comparison row may contain, across the union of all its cells, both a target-substitution slot and an
> operative sequence.** Asserted over the *assembled* row at build time, not over the record. Where the union
> trips, the row renders with the offending cell replaced by its site-voice summary and a stated "withheld
> here because of what stands beside it" note — the withholding is disclosed, and the diffusion point
> survives, because the point was the structure and the structure is in the summary.

**And the same union test applies across the rendered page, not only the row.** A wing page with six rows
from one hostile corpus is one screen, and a filter control can bring arbitrary records into adjacency:
"row" is a rendering accident. Whatever is simultaneously on screen is the document.

**"Hostile" means the ṣaṭkarman hostile set**, not *māraṇa* alone: *māraṇa*, *uccāṭana*, *vidveṣaṇa*,
*stambhana* and *vaśīkaraṇa* as applied to a person. Restricting the rule to killing formulae leaves coercive
love magic fully transcribable, and coercive love magic is the category with a live, present-day,
non-historical victim class.

**Interface — where the control actually belongs.** Enforced in code, in the new section and anywhere hostile
material appears:

- no field that accepts a person's name;
- **no second-person address anywhere in the wing**, specified as `/\b(you|your|yours|yourself)\b/i` over the
  wing's rendered `<main>` text **after** removing `figure.quoted-primary` subtrees and the standing-note
  callout, both exempt by construction — the standing note addresses the reader *as a reader*, which is the
  thing the rule exists to protect. Without the exemption the rule fails on day one and gets deleted; without
  the specification it is never implemented at all;
- no per-act composition view that assembles scattered correspondences into one ordered checklist;
- no "cast", "generate" or "perform" affordance;
- not exposed as a callable capability in the registry.

**Why the control moved to the interface.** The documented harm of this material is overwhelmingly social,
economic and legal, and it falls on **the accused and the defrauded** — India's NCRB records 2,500+ deaths
linked to witchcraft accusation and superstition-related violence between 2001 and 2018; the Maharashtra Act
of 2013 criminalises both practising black magic for gain *and accusing someone of being a witch*. The danger
runs toward people who believe the system is real, which is precisely the belief this site exists to deflate.
A rigorously historicised, no-demonstrated-validity presentation is **protective** against that vector, not
additive to it. The site-relevant vector that *is* real — fixation and harassment, a rite supplying structure
and a sense of licence to a campaign against a specific person — is triggered by **targeting affordances and
second-person address**, not by the existence of a translated verse.

**This is stricter than the field, and we say so.** Betz prints hostile and coercive spells complete, in
English, indexed by purpose, from a university press. The public-domain Sacred Books of the East *Atharvaveda*
prints complete hostile charms with commentary. Kieckhefer prints the Munich handbook's coercive experiments.
There is essentially **no scholarly precedent for withholding these**. We withhold the slot-plus-sequence
combination anyway, on one ground and one only: unlike an ancient reader, a modern reader can act on a rite
naming a real, identifiable, living person, and the harm is harm **to a third party who did not consent to
being in this book**. That is the single axis on which the precedent record genuinely *is* restrictive — the
Protocols for Native American Archival Materials, ICOM §4.4, *Foster v Mountford* (1976) 29 FLR 233.

**The abhicāra wing's promise is strengthened, not routed around.** That wing promises, absolutely, that there
are "no dosages, no step-by-step rites, and no 'how to harm' anywhere in this wing." Hosting the new material
at a different URL would preserve that sentence on a technicality while §8.4 requires every quoted record to
link back to the wing that contextualises it — leaving a reader two clicks from what the promise disclaims,
along a link the site put there. Wing-scoping an absolute-sounding sentence is the true-but-misleading
construction this site's whole identity is built on refusing. **So the promise is restated at a larger
scope:** the paragraph gains one clause — *"and no hostile rite is reproduced as a working sequence anywhere
on this site, in this wing or in the quoted-texts survey."* That is a stronger promise than the original, it
is site-wide rather than wing-scoped, it is machine-checkable by the union test above, and it costs the
section nothing it was going to publish. See §9.5.

**Added independently of the new section:** the abhicāra wing currently carries **no** harm note recording the
accusation-violence and fraud record, and that is the true present-day harm of the material. It is added.

---

### C-6 — Modern branded regimens (inedia and its kin)

**Rule.** Historical fasting hagiography is transcribed freely and at length — it is historically valuable and
operationally inert; "she took no food for forty years" is a claim, not a protocol, and redaction has nothing
to bite on. **Modern branded regimens with day-counts and staged water or juice schedules are excluded
entirely**, on three independent grounds: they are in copyright, they are causally linked to deaths with a
manslaughter conviction attached, and they are of zero philological value to a diffusion study.

**What the harm note must carry.** The three named deaths — Timo Degen (Munich, 1997), Lani Morris
(Melbourne, 1998; her two supervising instructors convicted of manslaughter and jailed for six and two
years), Verity Linn (Scotland, 1999) — and the second, invisible risk: **refeeding syndrome**, which kills
during recovery, typically within four days of resuming nutrition. Anyone who reads about historical fasting
and tries it is at risk twice, and the second risk is the one they will not have heard of.

**The real hazard from a survey site here is evidential dignity** — placing a hagiographic claim in a
well-cited comparative apparatus, next to real chemistry and real philology, so that it inherits the
credibility of its neighbours. That is answered by the no-demonstrated-validity flag travelling with the
claim, in the same field, not adjacent to it.

*The sallekhana / santhara case is adjacent and is a genuine religious-legal controversy. It is treated as
doctrine and law, never as procedure: no thresholds, no staging.*

---

### C-7 — The aggregation rule

This is the carve-out that matters most, because it is the only one that addresses risk **this site would
create** rather than risk that already exists. Every category above scores an availability baseline of
approximately zero, so single-passage quotation adds almost nothing. **The danger of this project is not that
it will quote a grimoire. It is that it will build a beautiful, normalised, machine-readable, cross-linked
table with a filter control — and that this artefact, unlike any of its sources, would be operable.**

> **The site does not assemble scattered elements into a usable protocol, even where every element is
> individually published.**

**A-1 — Assembly.** Comparative apparatus is designed to collocate what the sources scatter, and that
collocation is the scholarly point. It is also the only genuine capability uplift on offer. The question
"would this row get a reader materially closer to executing the act?" is **not answered by the author's
estimate**; it is decided mechanically:

- The row's cells are unioned and run through the C-1 triple test, the C-5 slot/sequence test, the C-3
  hyperventilation-pairing test and the C-6 staging test **as if they were one document**. Any test that
  fires on the union fires on the row.
- **The union is computed over the rendered page, not the data row**, because a filter control can bring
  arbitrary records into adjacency.
- **Filters cannot compose.** No filter combination may narrow the wing to a single act or purpose across
  corpora — that is the purpose index §8.2 forbids, rebuilt by the reader out of controls the site supplied.
  **Facets are `corpus`, `date`, `language` and `scholar`. Never `purpose`, `act` or `aim`.** Asserted over
  the filter definitions, which live in data.

**A-2 — Completion.** A comparative table has empty cells and the scholarly reflex is to fill them. Filling by
inference — "the Chinese parallel gives no duration but the Indian one does, so…" — manufactures a composite
procedure that **no source attests**. This is simultaneously the site's worst accuracy failure and its worst
safety failure, and it is unique to diffusion work. **Empty cells render as "not attested in this witness" and
are never filled from a parallel.** Data-layer invariant, with a test. §2.4's `claimedBy` requirement makes it
structurally impossible as well.

**A-3 — Interface.** The gap between a table and a tool is one form control, and **this codebase crossed that
line before the amendment was written**. `talismanRecipe()` already emits a numbered, imperative, personalised
protocol naming opium, surfaced through the registry and returned to the assistant as `steps`. The rule is
therefore site-wide and not scoped to the new section:

> **No capability anywhere in the registry may return an ordered, imperative, personalised sequence of
> operative steps. This binds `talismanRecipe()` today, not only the new section tomorrow.**

Enforcement, all machine-checkable:

- No tool return value may contain a key named `steps`, `procedure`, `instructions` or `recipe` whose values
  are strings beginning with an `IMPERATIVE_OPENERS` alternate. `talismanRecipe` renames `steps` →
  `attestedSequence` and re-voices each entry to third-person attributed form.
- Every material string in a generated output resolves to a record carrying a harm flag and, where flagged,
  renders its harm note **in the same output object** — not adjacent to it.
- The registry entry for the new wing is `callable: false`, pinned by the existing anti-drift test.

*If the maintainer declines to re-voice `talismanRecipe`, then §3.1, `HONEST_FRAMING` and the About covenant
must all drop the claim that the site's voice never instructs. Those are the only two options. Shipping the
claim alongside the generator is the one thing this site cannot do.*

**A-4 — Normalisation.** No modernised units, temperatures, durations or species identifications for any
harm-flagged material, anywhere, in any voice. (Restated from C-1 because it is an aggregation rule as much as
a toxicity rule.)

**A-5 — Machine surface.** The site ships a flattened search index and an assistant context builder, and both
strip the visual framing that does the ethical work. The index does not index *records*: it walks every HTML
file, regex-strips `<main>` to flat text and truncates at 1800 characters. **There are no fields**, so a rule
saying "the harm note travels inside the same indexed field" would pass review, ship, and protect nothing.
Two structural fixes instead:

- **The harm note renders inside `figure.quoted-primary`, before the `<blockquote>`.** DOM order then
  guarantees that any prefix-truncated extraction containing the quotation also contains the note.
- **Quotation bodies are excluded from the search index outright.** The indexer skips `figure.quoted-primary`
  subtrees and indexes the site-voice summary instead. Search then finds the *record*, and the reader arrives
  where the frame is intact. This also closes the §7.5 promise never to build a purpose-indexed table of
  spells — a promise the flat full-text index currently defeats.
- **Quoted text never enters the assistant context** (see A-6), and no survey-section data is exposed through
  the tool schema or dispatcher.

**A-6 — The assistant, honestly described.** The assistant is browser-direct and bring-your-own-key: the user
chooses the provider, supplies the key, and may point at any OpenAI-compatible base URL; the offered models
include small open-weight ones whose adherence to long negative-constraint preambles is materially worse than
the recommended model's; the system prompt is client-side JavaScript on a static site; and the page displays
the passage anyway, so a reader can paste it into any assistant at all. Therefore, stated here rather than
discovered by a reviewer:

> **The assistant preamble rules shape the default experience. They are not a control against a determined
> user, and this document does not claim they are.** The only assistant-side protections that are real are
> structural: the transcription never enters the context, and the tool surface cannot compose it. Those are
> machine-checkable. The preamble sentences are checkable only for *presence* — a check that a sentence
> exists, not that anything obeys it.

The one genuinely behavioural assertion is therefore **required**: for every reading kind, assert that the
built system prompt contains **no ≥12-word substring of any shipped quoted text or translation text**. That
is a real test of a real property, and it is the only one in the entire assistant section.

The assistant's relationship to a quotation is **exegetical, never transitive**. It may say what the text
says, who wrote it, when, in what edition, what the parallel says and what scholars argue. It may not restate
imperatives in the second person, adapt, complete, modernise, dose, or answer "how do I do this" — and it may
**not reconstruct a withheld category from its own training data**. Where the page has not supplied a passage,
the assistant says it does not have the text and names the edition where it lives; it does not produce the
passage from memory. See §9.9–§9.13.

**A-7 — No refusal coaching.** The site currently renders, when a provider's safety system declines: *"(The
model declined this request. Some safety classifiers flag historical occult/magical content — try the
recommended … model, or rephrase.)"* That is user-facing coaching to work around a refusal, and under this
amendment it would sit one panel away from reproduced operative ritual text. **It changes in the same commit
as the amendment** to a message that reports the outcome and offers no workaround, pinned by a test asserting
the coaching strings appear nowhere in the app layer. See §9.17.

### 5.8 The whole list, on one line each

| # | Carve-out | Excluded outright? | Still provided |
|---|---|---|---|
| C-1 | Operable triple (toxic materia) | No — precision ceiling | Names, doctrine, stages, quoted verse in archaic units, full diffusion history, the tradition's own harm literature |
| C-2 | Precision cap (bodily injury) | No — regimen/interval/count/progression only | Locus, attested verse, instrument and emollient where attested, structural description, four-part harm note, the minority-position finding |
| C-3 | Hypoxia | Partly — water pairings and unconsciousness-as-goal | Verses, ratios in quotation, doctrine, vocabulary, transmission, the Spare correction |
| C-4 | Self-injury method sentence | **Yes** | Text, date, purpose clause, reception, editions, the fact that it directs self-injury, crisis signposting |
| C-5 | Slot + sequence, across the assembled union (hostile & coercive rites) | Partly — plus interface constraints | Texts, doctrine, correspondences, loci, parallels, structure, the accusation-violence record |
| C-6 | Modern branded inedia regimens | **Yes** | Hagiography in full, the three deaths, the refeeding mechanism, the legal history |
| C-7 | Aggregation | n/a — structural | Everything, with empty cells honest and units unconverted |

**Four things are excluded outright:** the self-injury method sentence, breath-and-water pairings,
unconsciousness-as-goal protocols, and modern branded inedia regimens. Everything else historical is
transcribable under a harm note.

---

## 6. The reader address

### 6.1 The standing notice the survey section carries

Placed as a threshold — after the title and lede, **before the first quotation in source order**, asserted by
test — and never as a footer:

> **The standing note — quoted primary text, the object of study**
>
> The passages below are **the wording of historical sources, reproduced as the object of study**. Every one
> is public domain in the United States, edition-cited and located; the site's own voice never instructs, and
> where an imperative appears it belongs to a named historical author addressing his own reader, not to you.
> These are **historical symbolic systems of no demonstrated validity**; the purposes reported are only what
> the traditions **claim** for them. Every comparison here is a **named scholar's** comparison, cited as
> theirs; the site advances no transmission claim of its own. Where a text prescribes something cruel,
> criminal, coercive or physically dangerous, that is stated where it occurs, with its mechanism and a
> source. **Some categories are named, located and dated but deliberately not transcribed** — the page says
> which, and why, and names the edition that carries the full text. Nothing here is health, medical, legal or
> spiritual advice, and nothing here is anything to attempt.

**No epigraph, and no borrowed sentence, sits above it.** Two candidates were considered and both are refused
on this document's own grounds:

- **A transgression epigraph in the disclaimer slot** (Betz's Julian: *"Shall we write about the things not to
  be spoken of?"*) is the oldest gesture in occult publishing; it invites the reader into a shared
  transgression, which is the exact inverse of "addressed as a reader, never as an operator"; and it is
  `cite-only` under §4, so reproducing it as a banner would break this document's hardest rule in its own
  showcase. Betz earned that epigraph by producing the edition. This site did not, and borrowing it is the
  §2.3 error in its purest form.
- **A harm-reduction sentence addressed to an operator** ("Attempts to reenact the practices described should
  use ethical alternatives") presupposes the reenactment and implies there is a correct way to do the thing.
  That is advice (§1.5), operator-address (§3.1) and an efficacy implicature (§6.3) in fourteen words. It
  works on an archivist's site that serves practitioners and says so. This site says the opposite about
  itself on 113 pages.

**What replaces them: nothing.** The standing note is the whole threshold. A site whose credibility rests on
refusing to be interesting at the reader's expense should not reach for a better epigraph.

### 6.2 How this note differs from the existing wing notes

The existing wing notes say: *this is a historical description of what the cited text instructs its own
practitioner, of no demonstrated validity.* They frame **the site's paraphrase**. This note must frame **the
source's own words, present on the page, in the imperative**. So it adds three clauses the others do not have:
(i) the passages are verbatim and are the object of study; (ii) the imperative belongs to a named author and
not to the reader; (iii) some categories are withheld and the page says which.

**This is why a wing that starts quoting cannot simply append a sentence to its existing note.** Adding
verbatim quotation changes what the note frames, so the note is rewritten, not extended. See §9.6.

### 6.3 Disclaimers: how many, and where

One site-wide risk statement; **one** standing note per wing, at the threshold; per-record harm annotation in
the editorial voice at the point of occurrence, in the four-part shape; and **no warning banners below the
wing level**. A harm note that states a mechanism and cites a source is *information*, not a badge, and does
not create the false-security problem a per-article disclaimer creates — it is not a signal that something has
been checked, it is a fact about the practice.

### 6.4 No efficacy is claimed, and claims are reported as claims

The site claims **influence, and only influence**. That a formula appears in two corpora is evidence about
texts. It is not evidence that either works, and it is not evidence that either was believed to work by anyone
in particular. The tradition's purpose lines report what the tradition **claims** — grammatically marked as
claim, every time, in the way the mudrā catalog already does it.

The honest close is the site's own and needs no borrowed aphorism: **no demonstrated validity; the purposes
reported are only what the traditions claim.**

---

## 7. The living-tradition clause

**7.1 These are practised religions.** Jyotiṣa, tantra, haṭha yoga, Daoist internal alchemy, Sufi practice,
Kabbalah, Tibetan Buddhism and the rest are not dead corpora. They have living communities, living teachers
and living initiates. The site studies them; it does not stand outside history looking at specimens.

**7.2 Initiation-gated and secret material is described as scholarship describes it.** Where a text is
restricted by its own tradition — an empowerment requirement, a secrecy clause, an oath — the restriction is
recorded **as a fact about the text**, dated and sourced, in the same register as its manuscript history. The
site does not adjudicate whether the restriction binds anyone.

**7.3 Publication confers no authority.** Nothing on this site transmits, initiates, empowers, authorises or
qualifies anyone to do anything. Reading a text is not receiving it. This is stated because the alternative —
a reader concluding that having read the passage they now hold the practice — is a real failure mode, and it
is the one the traditions themselves warn about most consistently.

**7.4 Gating is a speed bump, and we say so.** Institutions with actual lineage authority have examined hard
gating, judged it impractical, and fallen back to stating the restriction and appealing to the reader. A
static, offline-first study site has strictly less authority to gate than they do. Any gate here is a
**signal and a friction**, never a control, and pretending otherwise would be dishonest.

**7.5 The venue gap is admitted, not papered over.** The line institutions actually operate is not
described-versus-reproduced. It is **catalogued-and-locatable versus globally redistributable**. Cline
Library and the Hopi Tribe, 1991: sensitive ceremonial images would not be reproduced or digitised for
internet access without written permission — *and access is still provided onsite*. A public static site has
no onsite tier. That is a genuine structural gap and it cannot be closed. What can be done is to compensate
on the axis this medium *does* have — competence and effort: the browsable layer is analytic and quotes
selectively, the complete text is always named and located elsewhere, and **the site never builds a
purpose-indexed table of spells**. That promise is only true if the search index and the filter facets are
constrained as §5 A-1 and A-5 require; it is not self-executing.

**7.6 Consent is the one near-absolute — and this clause ships only with a door.** Where a living community
with standing identifies material on this site as restricted ceremonial or secret knowledge of theirs and
asks for its removal, **it is removed** — not argued with, not balanced, not deferred to a policy review.
This is not a legal position; it is the site's policy, and it costs nothing that matters.

A removal promise with no door is worse than no promise. This site is static and offline-first, with no named
owner and no contact address on any of its pages. **The clause ships only if all three of the following land
in the same commit:**

1. a **published contact route** for removal requests, on the About page, reachable in one click from every
   wing footer;
2. a stated **acknowledgement window**, and the commitment that material is taken down **while** a request is
   considered, not after;
3. a test asserting the contact string exists on the About page and that the footer link resolves.

**Absent those, §7.6 is cut entirely.** A site with no door does not get credit for saying it would open one.

**DECISION (maintainer, 2026-07-30): §7.6 SHIPS.** The door is the public issue tracker of the site's own
repository — `github.com/occult-kranti/astrology-sim-ant` — linked from the About page and from every wing
footer. That route was chosen over an email address for four reasons: it needs no new infrastructure on a
static site; it is permanent and public; it leaves an **auditable record of the request and the response**,
which is what §7.6 is worth having; and it does not require publishing a private individual's address.

The honest limits, stated on the page rather than hidden:

- **It requires a GitHub account**, which is a real barrier for exactly the people the clause exists to serve.
  A request is therefore accepted **from anyone acting on a community's behalf** — an institution, an
  archivist, a scholar, a lawyer, a family member. Standing is not gatekept, and no proof of authority is
  demanded before takedown.
- **There is no staffed desk.** One maintainer reads the tracker. Material comes down **on receipt** — the
  moment the request is seen, before any assessment — and the request is acknowledged **within seven days**.
  That is a good-faith commitment by one person, not a service-level agreement, and it is described as such.
- **Removals are logged, not silently absorbed.** Each takedown is recorded as an ejection with its date and
  reason. If material ever returns, the reason for its return is logged too. A removal that leaves no trace
  is indistinguishable from a removal that never happened.

Precondition 3 (the tests) remains binding: `R1`/`R2` must ship in the same commit as the route, or the clause
is deleted rather than promised.

**7.7 A note on the gate we did not invent.** *Mantroddhāra* — transmit the text complete, encode the
operative key — is the traditions' own solution to this exact problem, arrived at long before anyone here
thought about it. The site's mechanism is a weaker version of theirs, and it is worth naming the debt.

---

## 8. The survey section's charter

### 8.1 What it is for

1. **Earliest attestation.** Where the surviving record of a procedure starts — not where it "originated,"
   which is almost never knowable — as dated by a named scholar.
2. **Diffusion.** What travelled, in which direction, by what route, through which languages, and on what
   evidence: documented, dated, cited, attributed, and never resolved by us where the field is divided.
3. **Cross-cultural parallels.** Passages set side by side so a reader can see what a published argument is
   about — what is shared, what is transposed, what is coincidence and what is a translator's artefact.
4. **Completeness of witness.** Which recensions carry a passage and which do not, because absence is
   evidence and a table that hides its empty cells is worthless.

### 8.2 What it is not

- **Not a manual.** No procedure is addressed to the reader, in any voice, at any point.
- **Not a claim of efficacy.** Attestation frequency is a fact about texts. Nothing more is implied and
  nothing more may be inferred.
- **Not the site's own philology.** Every comparison is a named scholar's (§2.4). Where no scholar has made
  the comparison, there is no row.
- **Not a lineage.** The site transmits nothing, initiates nobody, confers no authority (§7.3).
- **Not a purpose index.** No "spells by what they are for" table, no `purpose`/`act`/`aim` facet, no
  cast/generate/perform control, no personalised composition view, no callable capability.
- **Not a substitute for the editions.** Every quotation is a bounded pointer into a complete text that is
  named and located.
- **Not resolved.** Where the field disagrees about a date or a direction, both positions print. Always.

### 8.3 The vocabulary rule that follows from being a diffusion section

The site's existing marketing-honesty lint bans the word "first" outright; it stays scoped to the comparison
page and is **not** widened over philological vocabulary. The survey section gets the **inverted** rule
instead:

- Any earliest/priority claim must be **hedged, sourced and attributed**. A string containing
  *earliest / first / oldest / originated* must also contain *attested / extant / surviving / known*, the
  record must carry a citation or a contested block, **and it must carry a non-empty `claimedBy.author`** —
  because a hedged claim is still the site's claim unless someone else's name is on it. The site may say
  "**Betz dates** the earliest **attested** instance to PGM IV.1928–2005 [cite]". It may not say "the
  earliest attested instance is PGM IV.1928–2005" unattributed, and it may never say "this rite originated in
  Egypt."
- Any parallel edge asserting a direction of borrowing carries `direction` and, where the direction is not
  `unknown`, a contested block with at least two positions.

### 8.4 How it links to the rest of the site

- **To the wings** — Picatrix, abhicāra, rasaśāstra, practices, yoga, Buddhist, Great Works — as the place
  where the *text* behind a wing's summary is shown. The wings keep their existing framing; every quoted
  record links back to the wing that contextualises it.
- **To the Confluence atlas** — the natural home of this material's argument, and the persona whose rule
  already fits: influence is the claim and the only claim; the map plots who read whom, never whether any of
  it works. Parallel edges here and transmission arcs there answer to the same discipline and share a data
  spine, so a claim cannot be documented in one and absent from the other.
- **To the About page** — which carries the amended covenant and names the withheld categories, so the
  withholding is disclosed in the one place a reader looks for the site's rules, not only at the point of
  occurrence.

---

## 9. The diff — ready-to-apply blocks for every existing framing surface

Every existing framing grep survives these edits: "described, never prescribed" and "never prescribe" are
preserved verbatim in every string a test currently pins.

### §9.1 — `assets/js/core/reading.js` — `HONEST_FRAMING` (the single source of truth)

**Replace with:**

```js
export const HONEST_FRAMING =
  'Astrology has no demonstrated predictive validity and is regarded by the scientific ' +
  'community as a pseudoscience. The astronomical positions here are computed and verifiable; ' +
  'the interpretations are those of William Lilly (Christian Astrology, 1647) and the Picatrix ' +
  'tradition, presented for historical study — described, never prescribed. Magical and ' +
  'talismanic material is recorded as historical practice only and is never a recommendation. ' +
  'Where a primary text is quoted, it is quoted verbatim as the OBJECT of study — from a ' +
  'public-domain edition, with its locus — and the quotation is the tradition speaking, never ' +
  'this site instructing you.';
```

*Amend here and only here. Surviving greps: every `/never\s+prescribe/i` and `/described, never prescribed/i`
test is untouched. New pin **F1**: `/object of study/i` and `/never this site instructing/i`.*

### §9.2 — `pages/about/index.html` — the covenant paragraph

**Keep the existing paragraph exactly as it stands** (it is load-bearing and correct) and **insert
immediately after it:**

```html
  <p>What we now add is the text itself. Where the argument is about <em>transmission</em> — that a rite
    passed from the Greek magical papyri into the Solomonic corpus, from Śaiva ritual into haṭha yoga, from
    Chinese alchemy into Indian rasaśāstra — it cannot be made in paraphrase, because what travels is the
    wording, the sequence and the shared error. So this site now reproduces <b>alleged operational
    instructions as sourced primary text</b>: verbatim, bounded, from an edition that is <b>public domain in
    the United States</b>, with its <b>edition and locus</b>, inside a marked quotation container, <b>as the
    object of study</b>. Our public-domain determinations are <b>United States</b> determinations and nothing
    more; a work free to reproduce here may still be in copyright where you are reading this. The site's own
    voice is unchanged and still never instructs: where an imperative appears on this site it belongs to a
    named historical author addressing his own reader, and the reader here is addressed as a reader, never as
    an operator. <b>The site advances no transmission claim of its own</b> — every parallel, direction and
    priority statement is a named scholar's, cited as theirs, and where no scholar has made the comparison
    there is no row. This is the standard of the field, not a departure from it: the University of Chicago
    Press prints the magical papyri complete and unexpurgated, with no disclaimer; Routledge's critical
    edition of the <i>Khecarīvidyā</i> prints the frenulum-cutting technique in full and annotates it with the
    injuries it caused. <b>Copyrighted editions are cite-only, never quoted</b>, however important to the
    argument. And <b>some categories are named, located, dated and structurally described but deliberately not
    transcribed</b>: the operable combination of a toxic substance with a quantity and a process parameter;
    the graded regimen, interval and session count of self-mutilation technique; breath practice paired with
    water, and any protocol whose goal is unconsciousness; the method sentence of a text that directs
    self-injury; a hostile or coercive formula that combines a named-target slot with a working sequence; and
    modern branded fasting regimens. Where something is withheld the page says so, says why, and names the
    edition that carries the full text. Nothing is hidden; some things are not repeated.</p>
```

### §9.3 — `pages/about/index.html` — new per-wing paragraph for the survey section

**Insert into the per-wing list, adjacent to The Great Works paragraph:**

```html
  <p class="small"><b>Quoted primary texts — the diffusion survey.</b> The
    <a href="../quoted/index.html">survey wing</a> sets alleged operational instructions side by side across
    corpora, to study the earliest <em>attested</em> use of a procedure and its spread — always as a named
    scholar's comparison, never as ours. Every passage is reproduced verbatim only from an edition verified
    public domain in the United States, or CC0/CC-BY; carries its edition, year and citation-grade locus; and
    is bounded — at most 120 words and 700 characters per passage, 180 words for a passage and its
    translation together, never a complete spell or recipe, never more than 5% or 20 passages of any one work,
    never contiguous, and never the same locus twice. Copyrighted editions (Betz's <i>Greek Magical Papyri</i>
    1986/1992, Mallinson's <i>Khecarīvidyā</i> 2007, Bühnemann, White, Copenhaver, Greer–Warnock) appear in
    the diffusion graph as cited nodes and are <b>never quoted</b>. Where the public-domain witness is known
    to be a poor one, the record says so and cites the modern critical edition anyway. Direction of borrowing
    is documented, never resolved: every directional claim carries both positions or is marked unknown, and
    empty comparative cells read "not attested in this witness" and are never filled from a parallel. Units,
    temperatures, durations and species identifications are <b>not modernised</b> for any harm-flagged
    material. The wing can be browsed by corpus, date, language and scholar — never by purpose or act. No
    demonstrated validity; the purposes reported are only what the traditions claim; described, never
    prescribed.</p>
```

### §9.4 — `pages/about/index.html` — the abhicāra paragraph

**Append to the existing paragraph, before `</p>`:**

```html
    The 2026 framing amendment, which permits public-domain primary text to be reproduced verbatim as the
    object of study, <b>does not change this wing's promise</b>: there are still no dosages, no step-by-step
    rites and no "how to harm" here, and <b>no passage is reproduced anywhere on this site</b> — in this wing
    or in the quoted-texts survey — that combines a named-target substitution slot with a working sequence,
    whether within one passage or across the cells of any comparison the site assembles. That restriction
    covers the whole hostile set of the six acts, coercive love magic included, and it is stricter than the
    standard scholarly editions, which print such rites complete; we are choosing to be stricter, on one
    ground — a modern reader can act on a rite naming a real, living third party who did not consent to being
    in this book.
```

### §9.5 — `pages/abhichara/index.html` — the absolute promise, strengthened

The two-paragraph honest frame is otherwise unchanged. **Append one clause to the absolute-promise sentence,
in the same commit as the test that pins it:**

```html
    — and no hostile rite is reproduced as a working sequence anywhere on this site, in this wing or in the
    quoted-texts survey.
```

**Also add**, as a new harm note on this wing independent of the survey section, the accusation-violence and
fraud record: India's NCRB figures for deaths linked to witchcraft accusation and superstition-related
violence, 2001–2018, and the Maharashtra Act of 2013 criminalising both practising black magic for gain and
accusing someone of being a witch. That is the true present-day harm of this material and the wing is
currently silent on it.

*Test pin **N4**: the appended clause is present, and the union test (**A-3** in the assertion list) is what
makes it true.*

### §9.6 — `pages/practices/mudras.html` — the standing note, rewritten not extended

The existing note is the right shape — name it, locate it, flag the harm, refuse the technique — but it frames
the site's paraphrase, and a wing that quotes needs a note that frames somebody else's words. **Append to the
callout:**

```html
    Where a text is quoted here it is quoted verbatim, bounded and edition-cited, from a translation that is
    public domain in the United States, <b>as the object of study</b>: the imperative in a quotation belongs
    to the historical author addressing his own reader, never to you. What the records do <b>not</b> carry is
    the staging that makes such a practice executable — <b>no graded regimen, no recommended interval, no
    session count, no progression</b>. Where something is withheld, the record says so and names the edition
    that carries it.
```

*The earlier draft of this block claimed that instrument specifications and aftercare "are not reproduced" —
on the page that renders "rub the tongue with fresh butter … draw it out with an iron instrument" above the
fold. That sentence would have made the page lie about its own contents. C-2 was narrowed instead (§5, C-2),
and this is the corrected text.*

### §9.7 — `pages/rasa.html` — the toxicity callout, corrected

The current text equates cinnabar with mercury toxicity flatly. The accurate claim is better science **and** a
better warning. **Replace the callout body with:**

```html
    The substances named below — <b>mercury and its compounds</b> (cinnabar/HgS, mercury chloride),
    <b>lead</b>, <b>arsenic</b>, orpiment and realgar, and their calcined "bhasmas" — are <b>poisons</b>.
    Mercury compounds are neurotoxic and nephrotoxic; there is <b>no safe home preparation</b>. One
    correction the popular account usually gets wrong, and it matters: <b>cinnabar (HgS) is not
    methylmercury</b> — as a mineral it is very poorly absorbed (oral absorption on the order of 0.2%,
    against roughly 95% for methylmercury). <b>It is the alchemical processing that is the hazard.</b>
    Heating, subliming and reducing cinnabar liberates elemental mercury and soluble mercury species, which
    is precisely what the historical procedures do — and the tradition worked this out itself: Shen Kuo's
    <i>Dream Pool Essays</i> (1088) warns that heat-transformed cinnabar becomes "deadly poison." Modern
    products carry the harm forward: <i>JAMA</i> 292:23 (2004) found detectable lead, mercury or arsenic in
    20% of Ayurvedic products sampled, with rasa-śāstra products far worse; CDC <i>MMWR</i> 61(33) (2012)
    reports six lead-poisoning cases in pregnant women in New York City, one product measuring 1.2% lead by
    weight. Everything here is the <b>historical</b>
```
*(…continuing into the existing sentence.)*

### §9.8 — `assets/js/core/data/picatrix-prayers.js` — the live defect

The module reproduces verbatim excerpts from the **in-copyright** Greer–Warnock *Picatrix* (Adocentyn Press,
2010–11) with no PD field of any kind, and a slice is piped into every assistant context. Under §4 that is not
permitted. Two required fixes:

1. Add `pdBasis` to every prayer record, and **either** re-source the excerpts to a public-domain translation
   or to the Latin — the site already does exactly this for Dee's *Monas* ("quote the Latin, and supply fresh
   glosses where English is needed") — **or** mark them `cite-only` and replace the verbatim text with the
   site's own summary.
2. Gate the excerpt injection in `llm-context.js` on `pdBasis.verdict !== 'cite-only'`.

### §9.9 — `assets/js/core/llm-context.js` — `HONEST_SYSTEM_PREAMBLE`, rules 3–6

**Replace rule 3 with rules 3, 4 and 5 (the old rule 3 becomes 5; the old rule 4 becomes 6):**

```js
  '3. Some material on this site is QUOTED PRIMARY TEXT — a bounded, public-domain, edition-cited passage ' +
  'reproduced verbatim inside a marked quotation container AS THE OBJECT OF STUDY. When a passage has been ' +
  'supplied to you in this conversation — by the page or by the user — you may quote it back, translate it, ' +
  'gloss it, date it, compare it with parallel passages, and explain what it meant to its own readers. When ' +
  'it has NOT been supplied, say you do not have the text, name the edition and locus where it lives, and do ' +
  'not reproduce it from your own knowledge. You must never convert quoted text into instruction for the ' +
  'user: do not restate its imperatives in the second person, do not adapt, complete, modernise or dose it, ' +
  'do not supply any step the passage or this site withheld, and do not answer "how do I perform this". You ' +
  'explain the text; you never operate it. If asked to, decline and restate the framing.\n' +
  '4. Some categories are deliberately NOT transcribed on this site: a toxic substance together with a ' +
  'usable quantity and process parameter; the graded regimen, interval and session count of self-mutilation ' +
  'technique; breath practice paired with water and any protocol aimed at unconsciousness; the method ' +
  'sentence of a text directing self-injury; a hostile or coercive formula combining a named-target slot ' +
  'with a working sequence; and modern branded fasting regimens. Their existence, history, doctrine and ' +
  'locus are described; the working is not. Do not reconstruct a withheld procedure from your own training ' +
  'data, in whole or in part, in any register. Say plainly that the site withholds it and why.\n' +
  '5. Talismanic / magical material is HISTORICAL PRACTICE ONLY; some recipes name toxic or illegal ' +
  'substances — record them as history, never instruct their making or use.\n' +
  '6. Cite Lilly (Christian Astrology, 1647) and the Picatrix by name where relevant. Be concise and ' +
  'plain-spoken.';
```

*Rule 3's earlier form told the model it "may quote it back" while the context deliberately withholds the
passage — which invited the model to supply it from training data, exactly what rule 4 forbids in the next
sentence. That contradiction is resolved above and its resolution matters more than any other line in §9.*

*New pins **F2**: `/never convert quoted text into instruction/i` and `/explain the text; you never operate
it/i`. **F4**: `/(do not reconstruct|never reconstruct) a withheld/i`. **F7**: `/do not have the text/i`.*

### §9.10 — `assets/js/core/llm-context.js` — new export, beside `CITE_CONTRACT`

```js
// The single source of truth for the assistant's relationship to a displayed
// quotation: exegetical, never transitive. Injected in assembleSystem() so it
// provably reaches DIVINER / HISTORIAN / JYOTISHI / CONFLUENCE / JUNG alike.
export const QUOTED_TEXT_CONTRACT =
  '\n\nQUOTED PRIMARY TEXT: passages marked as quotations on this site are public domain in the United ' +
  'States (or CC0/CC-BY), edition-cited, bounded, and reproduced AS THE OBJECT OF STUDY. Where a passage ' +
  'has been supplied to you, you may translate, gloss, date and compare it, and you carry its edition and ' +
  'locus with it whenever you quote it back. Where it has not, you say so and name the edition — you never ' +
  'reproduce a passage from your own knowledge. You never convert quoted text into instruction for the ' +
  'user — no second-person restatement, no adaptation, no completion of a withheld step, no dosage, no ' +
  'modernised unit, no answer to "how do I do this". You explain the text; you never operate it. Withheld ' +
  'categories are never reconstructed from your own knowledge.';
```

**And append to `CITE_CONTRACT`:**

```js
  ' When you reproduce a quoted primary passage, carry its EDITION and LOCUS with it exactly as the record ' +
  'gives them; never quote a passage the context has not supplied, and never present your own translation ' +
  'as the site\'s cited one.';
```

**And inject in `assembleSystem()`** — not pasted into each persona, because that is the only way it provably
reaches all five. *New pin **F3**: `QUOTED_TEXT_CONTRACT` is exported, non-empty, and is a substring of both
`buildContext().system` and `assembleSystem()`'s output for at least one divination kind.*

### §9.11 — `assets/js/core/llm-context.js` — `buildOperationPrompt`, rewritten not appended to

```js
    `A reader asks about the historical practice: "${String(request).trim()}"\n\n` +

    '4. WHAT THE SOURCES RECORD about the procedure — the timing (day & hour), the materials and mansion ' +
    '(call `talismanRecipe` if useful), the design — AS THE TEXTS DESCRIBE THEM, in the third person and ' +
    'attributed to the text, with citations. Do not restate any of it as a step for the reader.\n' +

    '5. Point the reader to the live tool to watch it themselves: ' +

    'End with one honest sentence: these are historical, pseudoscientific arts with no demonstrated ' +
    'efficacy — described for study, never a recommendation to act — and nothing above is a set of ' +
    'instructions to follow.'
```

*New pin **F5**: the built prompt no longer matches `/A practitioner asks/` or `/THE HISTORICAL PROCEDURE the
tradition would follow/`, and does match `/never a recommendation to act/` and `/not a set of instructions/i`.
Note that `talismanRecipe` is only safe to reference here **after** §9.16 lands.*

### §9.12 — `assets/js/core/llm-context.js` — the persona clauses

One appended sentence each:

- **`DIVINER_PREAMBLE`** — highest risk; it boasts of knowing "the rituals by which they were cast":
  `'Where a ritual text is quoted on the page, you explain the quotation — its edition, its date, its parallels — and you never turn it into a procedure for the reader.'`
- **`HISTORIAN_PREAMBLE`** — add quoted text as a third register beside computed astronomy and documented
  belief:
  `'(c) QUOTED PRIMARY TEXT is the object of study — reproduce it only as given, with its edition and locus; describing what it prescribes is history, restating it to the reader is not.'`
- **`JYOTISHI_PREAMBLE`** — nearest to the rasaśāstra and abhicāra carve-outs, so it carries the
  withheld-category refusal explicitly:
  `'Where a text is quoted, you explain it and never operate it; where this site withholds a working — a dose, a regimen, a hostile formula — you say so and do not supply it from your own knowledge.'`
- **`CONFLUENCE_PREAMBLE`** — the survey section's natural voice:
  `'Parallel passages are set side by side to report a named scholar\'s claim about TRANSMISSION, not to teach the rite; a shared formula is evidence about texts, not a working.'`

`JUNG_PREAMBLE` needs nothing beyond system rules 3–4.

### §9.13 — `PLAIN_STRUCTURE` and `PLAIN_CODA`

Extend the "To reflect on:" bullet in both with:
`' — and never a step drawn from a quoted operative passage.'`
*New pin **F6**. The existing greps survive unchanged.*

### §9.14 — `assets/js/core/talisman.js` — the re-voicing **(blocker B1)**

`talismanRecipe()` stops emitting an imperative protocol. `steps` → `attestedSequence`; each entry becomes
third-person and attributed, e.g.:

```js
  // was: `Choose the aim: ${op.label}. Its ruling planet is ${op.ruler}.`
  { text: `Picatrix III assigns the aim ${op.label} to ${op.ruler}.`, cite: `Picatrix III / ${op.book}` },
  // was: `Elect the time: act in the day AND hour of ${op.ruler} …`
  { text: `The tradition elects the day and hour of ${op.ruler}, with ${op.ruler} dignified and free of the `
        + `malefics and the Moon ${op.polarity === 'increase' ? 'waxing and swift' : 'waning'}, neither void `
        + `of course nor in the via combusta.`, cite: 'Lilly CA pp.121-123; SOURCE-DATA §5' },
  // was: `Prepare the materials: suffumigation of ${m.suffumigation}; …`
  { text: `The materials recorded are a suffumigation of ${m.suffumigation}, the colour ${m.colour}, the `
        + `metal ${m.metal} and the stone ${m.stone}. ${harmNoteFor(m)}`, cite: `Picatrix III / Agrippa II` },
  // was: `Consecrate at the elected hour: kindle … and speak the petition … WHILE the smoke rises`
  { text: `In Picatrix III the consecration is the fumigation and the prayer together: the text describes `
        + `the smoke as concurrent with the inscription rather than preparatory to it.`,
    cite: 'Picatrix III' },
```

Every material string resolves to a record carrying a harm flag; where flagged, the harm note is carried **in
the same object**, not adjacent to it. `runTool('talismanRecipe')` returns `attestedSequence`, never `steps`.

*New pins **N1**: no registry tool return contains a `steps`/`procedure`/`instructions`/`recipe` key whose
string values begin with an `IMPERATIVE_OPENERS` alternate; and the `talismanRecipe` return object contains a
harm note for every harm-flagged material it names.*

### §9.15 — `assets/js/app/llm-core.js`, `assets/js/app/autopilot.js` — the refusal message **(blocker B2)**

**Replace all three occurrences of:**

> `(The model declined this request. Some safety classifiers flag historical occult/magical content — try the
> recommended Opus 4.8 model, or rephrase.)`

**with:**

```js
'(The model declined to answer. This site does not work around a provider\'s refusal; the page itself ' +
'carries the citation and the edition.)'
```

*New pin **N2**: the strings `try the recommended` and `or rephrase` appear nowhere under `assets/js/app/`.*

### §9.16 — `scripts/build-search-index.mjs` — quotation bodies excluded

The indexer strips `<figure class="quoted-primary">…</figure>` subtrees before text extraction, and indexes
the record's site-voice summary in their place. This is what makes §7.5's "never a purpose-indexed table of
spells" true rather than aspirational, since the index is a flat full-text file with a search box over it.

*New pin **S1**: no shipped quoted text of ≥8 words appears anywhere in `assets/search-index.json`.*

### §9.17 — `pages/about/index.html` + every wing footer — the removal route **(precondition for §7.6)**

A published contact route for removal requests on the About page, reachable in one click from every wing
footer, with a stated acknowledgement window and the commitment that material comes down **while** a request
is considered. *New pins **R1/R2**: the contact string exists on the About page and the footer link resolves.*
**If this is not built, §7.6 is deleted from this document rather than shipped as an unfulfillable promise.**

**Resolved 2026-07-30 — the route is the repository's public issue tracker**
(`https://github.com/occult-kranti/astrology-sim-ant/issues`). The About page carries the §7.6 text with its
three stated limits (a GitHub account is needed; requests are accepted from anyone acting on a community's
behalf, with no proof of standing demanded before takedown; one maintainer, no staffed desk — takedown on
receipt, acknowledgement within seven days). Every wing footer carries a one-click link to that section.
Removals are appended to a public ejection log with date and reason, and any restoration is logged with its
reason. `R1` asserts the contact URL string on the About page; `R2` asserts the footer link resolves to the
About-page anchor from a wing page.

### §9.18 — What does **not** change

| Surface | Status |
|---|---|
| The abhicāra screen verb ban in `engine-test.mjs` | **Unchanged.** Add only a comment recording that it is site-voice-scoped by construction: the screen has no quotation field, so the new rules can never overlap it. Do not widen. Do not relax. |
| The superlative grep in `scripts/tests/r30-compare.mjs` | **Unchanged.** Add a header comment scoping it explicitly to `competitors.js` so a future round does not widen it over philological vocabulary. The survey section gets the inverted rule (§8.3) instead. |
| `assets/js/core/explain/util.js` `BANNED_PHRASES` / `findBanned` | **Unchanged.** Add `findBannedInSiteVoice(record, fields)` so callers cannot accidentally blob-grep a quotation. |
| `blockquote.lilly` in `assets/css/style.css` | **Unchanged.** Lilly 1647 is public domain and its existing uses are non-operative. The new container is `figure.quoted-primary` and applies only to the survey section. |
| Every "described, never prescribed" string on the other 56 files | **Unchanged.** The clause is not retired; it is given a stated scope — it governs the *site's* voice, and always did. |

### §9.19 — The one-line summary, for anywhere a one-liner is needed

> **Described, never prescribed — and where a text is quoted, it is quoted verbatim as the object of study,
> from a public-domain edition, with its locus: the tradition speaking, never this site instructing you.**

---

## 10. Shipping conditions

**Four fixes land in the same commit as the first quotation.** Not the same release; the same commit. Three of
them are pre-existing defects that this policy asserted were absent until the repo was checked.

| # | Blocker | Where | Why it blocks | Diff |
|---|---|---|---|---|
| **B1** | The site already instructs | `assets/js/core/talisman.js`; the tool surface in `llm-context.js` | §3.1's headline claim is false today. Shipping quotations under it makes the claim a lie rather than an aspiration | §9.14 |
| **B2** | Refusal-coaching string in production | `assets/js/app/llm-core.js` (×2), `assets/js/app/autopilot.js` | User-facing instructions for working around a model's safety refusal, about to sit beside operative ritual text | §9.15 |
| **B3** | A rule that contradicted its own ratification, and a page edit that would have made the page lie | C-2 vs `practices/mudras.js`; the mudrās note | An amendment cannot ship an internal contradiction into a shipped page's honest note | §5 C-2 + §9.6 |
| **B4** | The precedent justification does not survive without §2.4 | this document | Without the no-original-diffusion-claim rule, the "alignment, not drift" argument is cover | §2.4 |

**And §2.4 is accepted as written or the section does not ship.** It is the clause that costs the most and it
is the one the rest depends on.

---

## 11. The test this policy has to pass

Print the survey section's most sensitive page. Delete every `figure.quoted-primary`. Hand what remains to
someone who has not read this document.

**If they can tell you what the rite was for and roughly how it went, the containers were doing the work the
prose should have been doing, and the policy has failed regardless of what the assertions say.**

That is why the strip test is a test that actually runs (§3.2, V6) rather than a sentence about a test.

---

## Appendix — sentences from the precedent survey, and their licence status

**Read this line first: nothing in this list is cleared for reproduction by having appeared here.** Only two
items are usable on the site. The rest are working-document quotations, and an earlier draft of this policy
reached into this list twice and broke §4 both times, in the two most prominent positions on the page.

**Usable on the site, with attribution:**

1. *"Describing to the reader how people or things use or do something is encyclopedic; instructing the
   reader in the imperative mood about how to use or do something is not."* — Wikipedia, WP:NOTHOWTO
   (CC BY-SA 4.0 — attribution and licence note required). **[verified]**
2. *"Access is still provided onsite."* — Protocols for Native American Archival Materials, on the 1991 Cline
   Library / Hopi agreement (freely published professional standard; attribution required). **[verified]**

**NOT FOR THE SITE — paraphrase and cite instead:**

3. *"Thus the suppression of this magical literature has deprived us of one of our most important sources of
   ancient religious life."* — Betz (1986), p. xli. **NOT FOR THE SITE — in copyright.**
4. *"The Greek magical papyri are, however, original documents and primary sources."* — Betz, p. xlii.
   **NOT FOR THE SITE — in copyright.**
5. *"The practice of cutting the frenum can be dangerous and the majority of my informants said that it is
   unnecessary, including those who had done it themselves."* — Mallinson (2007), note to 1.46.
   **NOT FOR THE SITE — in copyright; the *substance* of this note is what §5.1 requires, in the site's own
   words.**
6. *"Attempts to reenact the practices described should use ethical alternatives."* — Peterson, *Esoteric
   Archives* (CC-BY). **NOT FOR THE SITE — refused on editorial grounds (§6.1), not licence grounds.**
7. *"The Latin text is, in any case, available at the end of the volume for those who wish to probe more
   deeply."* — Kieckhefer (1997), ch. 1. **NOT FOR THE SITE — in copyright.**
8. *"Some information … may create an unreasonable risk for readers who choose to apply or use the
   information in their own activities."* — Wikipedia, *Risk disclaimer* (CC BY-SA 4.0).
   **NOT FOR THE SITE without the licence note.**

Two further items from that survey — Betz's Julian epigraph and his closing aphorism about deception — have
been **deleted from the working set entirely**. They are the two that kept getting reached for, and §6.1
records why neither belongs on this site.
