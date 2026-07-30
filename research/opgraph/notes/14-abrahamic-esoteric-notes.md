# Slice 14 — Jewish + Islamic operative esoterica

Companion notes to `14-abrahamic-esoteric.json`. Research 2026-07-30; `meta.dateISO` kept at
2026-07-17 per the operator's instruction.

**Counts (machine-verified from the JSON, not asserted):** 23 works · 42 graded
work×procedure-type rows (+1 marked cross-reference-only) · 96 edges
(22 BELONGS_TO · 14 AUTHORED_BY · 2 RECORDS_TEACHING_OF · 12 TRANSMITS_TO · 3 PARALLELS ·
1 COMMENTS_ON · 42 CONTAINS_PROCEDURE).
**Completeness distribution:** complete 16 · partial 16 · referenced 10 · **fragmentary 0**.

---

## 1. What the razor forced me to leave out, and why that is the interesting part

I hit the operative-content razor hardest in exactly three places, and how I handled them is the
template I would want applied to the rest of the program:

1. **The golem rite** (Eleazar of Worms's *Sefer Yetzirah* commentary). My source material handed
   me the procedure in usable form on the first search — material, water, the alphabet-gates worked
   limb by limb. I recorded a four-stage shape (material → figure → gate-recitation correlated to
   limbs → reversal) and nothing below that. A stage-list is a map; a gate-order is a recipe.
2. **The Birhatiya oath** in the printed *Shams al-Maʿārif*. Here even a stage-list was too much.
   I recorded that the item exists, that it is a transmitted oath-formula of the adjuration genre,
   that it circulates entire (hence `complete`), and that it carries a hard ethics flag. Nothing else.
3. **Abulafia's circles.** The Braginsky manuscript description is itself an operative document —
   it tells you where each circle is entered. I recorded the *architecture* (the method is the page
   layout; figures carry entry-marks; recitation follows the circuit) without reproducing a single
   figure, letter-string or mark.

Three practical rules fell out of this that I would recommend to the synthesizer:

- **Grading completeness never requires reproducing content.** Every `complete` in this file is
  justified by structural evidence — the text enumerates and terminates; the edition prints
  witnesses synoptically; the construction is arithmetically checkable — not by quoting the steps.
- **Naming a stage is safe; ordering the sub-steps is not.** The boundary is whether a reader could
  execute from the record. "Five stages: purification, nyāsa, dhyāna, japa, homa" is a map.
  "The gates in this order" is a recipe.
- **The most sensitive items should be graded *shorter*, not omitted.** Omission loses the honest
  record that the thing exists; a bare naming keeps it and gives an adversary nothing.

## 2. Living-tradition posture (this slice's distinguishing constraint)

Every tradition here is practised **today**. That is not true of most of the repo's corpus, and it
changes the writing. Specific decisions:

- **al-Ghazālī's *Iḥyāʾ* 38 is not occult literature.** It is a mainstream Sunni devotional classic
  read by ordinary Muslims. I flagged it explicitly so the synthesizer does not file it beside
  al-Būnī just because both are Arabic and both are in my slice. Getting this wrong would be a real
  insult, not a taxonomy error.
- **The Naqshbandī principles are described as a rule-set, never as method.** I list the eleven
  Persian names and what each *governs*; I give no breath, count or locus content. Note that
  Bahāʾ al-Dīn's three additions (*wuqūf-i zamānī / ʿadadī / qalbī*) are precisely the ones fixing
  timing, count and locus — which is both the structural evidence for the `partial` grade and the
  reason the operative content is unpublishable in a public text and unrecordable here.
- **Two harm classes are specific to this slice and are in the proposed taxonomy:**
  `sectarian-defamation-risk` (Jewish magical material and the golem have a documented history in
  antisemitic polemic; Sufi occultism in anti-Sufi polemic) and `living-tradition-sensitivity`
  applied at *record* level rather than page level.
- **The Shams is revered and censured at once** in the modern Muslim world. I recorded that
  reception as reception and did not adjudicate it.

## 3. The five findings I would defend under audit

**(a) The awfāq → Ghāya → Agrippa chain lands directly on shipped repo data.**
`assets/js/core/data/kameas.js` holds all seven planetary squares, arithmetically verified by the
repo's own engine test, cited to Agrippa II.22 via the 1651 English printing — with **no upstream
whatsoever**. The Arabic constructive literature (Sesiano's editions of al-Anṭākī, al-Būzjānī, and
the *al-Awfāq* attributed to Ibn Yūnus) and the *Ghāyat al-Ḥakīm*'s transmission of the seven-square
set are entirely absent. This is the cheapest high-value join in my slice.
**Two honest limits, both flagged in-record:** the chapter of the Ghāya carrying the squares is
*(unverified)* — my sources for it this round were secondary and partly blog-level, and it must be
checked against Ritter 1933 before anything ships; and per Bink Hallum (*Suhayl* 18), the
*astrological attribution* of squares to planets emerged **later** within the Islamic tradition than
the squares themselves. So the edge carries mathematics forward confidently and astrology only
partly. Do not flatten that.

**(b) Completeness and construction come apart, and awfāq is the proof.**
The awfāq row is the only one in 42 where `complete` is a **demonstrable property** rather than a
judgement about a manuscript: a constructed magic square either satisfies its magic constant or it
does not — which is exactly what the repo's engine test already does to the seven kameas. The
*construction* is provable mathematics; only the *talismanic use* is the unevidenced claim.
Collapsing both into `consecration-of-object/talisman` destroys that distinction, which is why
`numerical-grid / magic-square construction` is my strongest vocabulary proposal.

**(c) *Sefer Yetzirah* is the ancestor of the Jewish half and is itself not operative.**
Graded `referenced`. Under 2,500 words, it enumerates a system — ten sefirot, twenty-two letters in
three classes, permutational "gates" — and instructs no one to do anything. Every procedure later
attached to it arrives in the **commentary** tradition. This is why the golem material is filed
under Eleazar of Worms and not under `sefer-yetzirah`, and it is a correction the repo's atlas
already gets right by carrying `technique: null` there. If a later round attaches golem-making to
the `sefer-yetzirah` slug, that will be a regression.

**(d) Two independent grounds keep producing `partial`, and they are different grounds.**
- *Initiation-gating*: Naqshbandī dhikr, Ibn ʿArabī's *khalwa* (an epistle to one named senior
  disciple, presupposing his formation), Lurianic yiḥudim (**assigned** per soul-diagnosis).
  The last is the same logic by which the inventory agent graded the TM mantra `partial`.
- *Genre*: exegesis is not rubric (*Sefer ha-Shem*, *ʿAlam al-hudā*); narrative is not rubric
  (3 Enoch, which is routinely mistaken for an operative manual and is not one).

  These must not be merged into one grade. "The master supplies the missing variable" and "this kind
  of book never had steps" are different facts about a text.

**(e) Zero fragmentary rows — and that is a substantive result.**
This corpus survives by *continuous copying* in communities that never stopped reading it. Its
characteristic defect is not damage but **instability**: fluid macroforms (Hekhalot),
divergent recensions (Sefer Ḥasidim's Bologna vs Parma; Shimmush Tehillim, which Rebiger prints
synoptically *because* each recension is internally complete and they disagree), and pseudepigraphic
accretion (the corpus Bunianum). **Recommendation: the completeness vocabulary needs a fifth grade
— `unstable` / `plural` — for a text that is complete in every witness and different in each.**
`complete` plus a prose caveat, which is what I had to do four times, loses the signal.

## 4. Structural convergences worth the synthesizer's attention

Recorded as observations, **not** as transmission claims — no contact evidence was sought or found
for any of these:

- **Abulafia's circle-diagrams ↔ al-Būnī's *Laṭāʾif al-ishārāt* diagrams.** In both, the figure is
  apparatus, not illustration: Gardiner's 2023 chapter is specifically about the relation of
  al-Būnī's diagrams to visionary experience; the Braginsky Abulafia's circles carry physical entry
  marks. Two 13th-century Mediterranean letter-mysticisms, one Hebrew and one Arabic, independently
  making the diagram the operative medium. I did **not** assert an edge between them.
- **al-Ghazālī's six stations ↔ Guigo II's four rungs** (edge recorded, labelled `disputed`, no
  contact claimed). Both are closed enumerated ladders of interior discipline; the inventory agent
  graded Guigo `complete` on the identical enumerate-and-terminate criterion I used for Iḥyāʾ 38.
  This is the cleanest cross-slice test that the completeness grade travels between traditions.
- **Three separate authorship situations with one shape:** Hekhalot macroforms (no fixed original),
  Lurianic Kabbalah (a man who wrote almost nothing, transmitted through competing disciple
  redactions), and the corpus Bunianum (an authentic core buried under accretion). All three
  defeat a naive `work → AUTHORED_BY → author` edge. My compromise is `RECORDS_TEACHING_OF` for the
  Lurianic case and a `debunked`-labelled AUTHORED_BY edge for the Shams — drawn struck, never
  hidden, per the repo's existing atlas convention.

## 5. Repo join keys

Six atlas slugs already exist and were read this round:
`hekhalot-literature`, `sefer-yetzirah`, `person-abulafia`, `person-isaac-luria`, `picatrix`,
`person-ibn-arabi`.

**Do not create four Hekhalot entries.** Four of my work-nodes (`jew:hekhalot-rabbati`,
`jew:sar-ha-torah`, `jew:maaseh-merkavah`, `jew:3-enoch`) all point at the single corpus-level slug
`hekhalot-literature`.

Seventeen works need namespaced ids (`jew:` / `isl:`). The atlas's `islamic` lane is the repo's
thinnest at 7 entries and contains **no** dhikr material, **no** al-Būnī, and **no** al-Ghazālī,
despite the r29 plan proposing `person-al-ghazali` (line 230) and dhikr litanies (item 35).

**Atlas omission worth fixing:** `person-ibn-arabi` carries `technique: null` and names the
*Futūḥāt* and the *Fuṣūṣ*. Ibn ʿArabī's one genuinely procedural text — *Risālat al-anwār*, written
at Konya 1204–05, surviving in c. 70 manuscripts — is absent.

**Inherited PD verdicts (not re-derived, per the brief):** r29 plan line 230 (Ghazālī via Field 1909
/ Gairdner 1924, PD) and line 393 (dhikr litanies via Nicholson 1914/1921, Field 1909, quotable).

## 6. Weakest links — read before trusting anything downstream

| Item | Problem |
|---|---|
| `jew:sefer-ha-malbush` | **Weakest record in the file.** My sources were an independent researcher's paper and encyclopedia-style summaries, not a critical edition. All three procedure rows are graded on source quality, not on the text. Needs Bohak, *Ancient Jewish Magic* (CUP 2008) before shipping. |
| `jew:or-ha-sekhel` | Included as a pointer only. Graded `referenced` because **I** did not consult it — a research gap, deliberately not disguised as a textual finding. |
| Ghāya chapter for the planetary squares | *(unverified)*. Check Ritter 1933 before the awfāq→kamea edge ships. |
| Latin channel Ghāya → Agrippa | Not established this round. Candidate lead: the Azarquiel magic-square transmission literature. Currently a gap in the middle of my best edge. |
| Vital's print history | Edition and first-printing dates for *Shaʿar ha-Kavvanot* / *Shaʿar Ruaḥ ha-Kodesh* *(unverified)*. |
| Ghijduwānī attribution counter-position | I state the critical-historical reading (silsila retrojection) but **could not name a scholar advancing it** this round. Flagged in-record. A contested block with an unnamed position is weaker than the repo's standard and must be fixed or dropped. |
| Ihyāʾ 38 six stations | Sourced from multiple independent publisher/bookseller descriptions of the ITS 2015 translation, all giving the same six in the same order — reliable for the *enumeration*, but not a scholarly citation. Translator's name *(unverified)*. |
| `isl:futuhat-khalwa-passages` | Graded `referenced` on my evidence, not the text's. Ibn ʿArabī's separately-transmitted *awrād* corpus was not examined at all. |

## 7. Slice discipline

I stayed inside the assigned corpus. **Sefer ha-Razim, the Sword of Moses and Sefer Raziel** are
Jewish operative texts with PD verdicts already sitting in the r29 plan (lines 188–193); they are
adjacent to my slice and I deliberately left them for whoever owns them rather than manufacture
false agreement on shared evidence. I did not research the PGM, the Latin Picatrix wing, or the
Sixth/Seventh Books of Moses; the three edges touching them are marked as out-of-slice pointers and
labelled `(unverified)`.

## 8. Open question the synthesizer must rule on

The prior-art inventory asked whether procedures may hang off non-work nodes. **This slice forces a
partial answer: yes, and the vocabulary should say so.** Two of my highest-value procedure-bearers
are not books —

- the Naqshbandī *kalimāt-i qudsiyya*, a rule-set transmitted across many texts and silsila-histories
  with no single edition;
- the Lurianic material, which exists only as disciple-redactions of a man who wrote almost nothing
  (which is exactly why the atlas made `person-isaac-luria` a **person** node).

Forcing either into a fictional book-node falsifies the record; hanging procedures on person-nodes
reproduces the untyped mess the inventory agent found. **Recommendation: add a `practice-corpus`
node kind distinct from `work`.**
