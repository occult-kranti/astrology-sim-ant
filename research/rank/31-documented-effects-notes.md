# 31 — Documented effects: the honest "studied effects" axis

Working notes for `31-documented-effects.json`. Compiled 2026-07-30 under `docs/FRAMING.md` v2.
23 records, 40 citation entries, 5 practice-types graded `none`, 14 harm-flagged.

---

## 1. What this axis is, and the one thing it must never become

The brief replaces an impossible "effective" axis with a possible one. The replacement is **not** a
softer efficacy axis. It is an axis **about research**, not about practices:

> **The grade measures how much peer-reviewed outcome literature exists on a practice-type and how
> methodologically strong it is. It does not measure benefit, and it does not measure whether any rite
> attains its stated aim.**

Two consequences that the interface has to carry, or the axis silently becomes the thing it replaced:

**A high grade routinely sits on top of a null result.** The best-studied practice-type in the whole
file — secular seated meditation, `sr-meta` — has as its strongest single finding that meditation
programmes were **no better than any active treatment**: not better than drugs, not better than
exercise, not better than other behavioural therapies (Goyal et al., *JAMA Intern Med* 2014, PMID
24395196). The benefit that survives is a benefit over *doing nothing*, which is the weakest possible
comparator. If a chip reading "systematic-review backed" renders without that sentence beside it, the
axis has told the reader the opposite of what the evidence says. Every record therefore carries an
explicit `keyNullFinding` where one exists, and the risks list names this as a rendering blocker.

**A low grade is not a negative verdict.** `none` means searched-and-not-found. It is not evidence that
a rite fails, because nobody has tested the rite. Six records carry it and they are full-weight
findings, not stubs.

---

## 2. The trap, stated as the site will meet it

The brief names it and the schema enforces it: `separationNote` is required on every record, and 23 of
23 have one.

> **Norton & Gino (2014) measured grief in the bereaved. They did not measure the condition of the
> dead.** Three experiments; participants directed to recall or to perform a mourning ritual reported
> lower grief; increased feelings of control mediated the link; the effect appeared in people who did
> *not* believe rituals work. That last detail is the tell. An effect that does not require belief in
> the mechanism is not evidence for the mechanism.

The same shape recurs:

| The finding | What it is evidence about | What it is **not** evidence about |
|---|---|---|
| Rosary and mantra recitation raise baroreflex sensitivity (Bernardi, *BMJ* 2001, PMID 11751348) | Respiratory rate in the reciter | Intercession; the addressee; bīja theory; mantroddhāra |
| Ritual performance lowers pre-task anxiety (Hobson et al., *PSPR* 2018, PMID 29130838) | Emotion regulation in the performer | Whether any rite reaches any target |
| Elaborate rites are *rated* more effective (Legare & Souza, *Cognition* 2012) | A heuristic in causal reasoning under causal opacity | Anything at all about efficacy |
| Cinnabar is poorly absorbed orally (Liu et al., *Exp Biol Med* 2008) | Toxicokinetics of a mineral | Transmutation; deha-vedha; immortality |
| Cold-shock response halves after ~six immersions (Datta & Tipton, *J Appl Physiol* 2006) | Autonomic habituation | Purification; ritual bathing |

**The inverse trap is also live and is written into the axis contract.** A `none` grade is not evidence
that a rite *fails*. Nobody has tested the stated aim of a single rite in this site's corpora. Absence
of study is absence of study, in both directions.

**The most useful single result in the file is the most anti-efficacy one.** Legare & Souza show that
repetition, step count and procedural specificity raise *perceived* efficacy — in Brazilian adults
(n=162) and in a US replication (n=68), with identical stimuli. Those three features are exactly what
this site's corpora are dense in. That is the best available explanation of why elaborate rites feel
like they work in the total absence of their working. It belongs on the site, and the word "perceived"
must never come off it.

---

## 3. The evidence-grade scale, defined

Ordinal on **volume and rigour only**. Eight values, defined in `evidenceGradeScale`:

`sr-meta` › `sr-single` › `rct-few` › `lab-physiology` › `observational` › `case-reports` ›
`toxicology-adjacent` › `none`

Two grades per record, deliberately: `evidenceGrade` for the outcome literature and `harmEvidenceGrade`
for the harm literature. **They diverge sharply, and that divergence is the most important structural
fact about the contemplative field.** Meditation is `sr-meta` for benefit and `observational` for harm.
Farias et al. (*Acta Psychiatr Scand* 2020) put a number on why: pooled adverse-event prevalence 8.3%
overall, but **3.7% in experimental studies against 33.2% in observational ones** — roughly a ninefold
gap, produced by trials that mostly do not solicit adverse events at all. 55 of 83 studies reported at
least one adverse-event type; the other 28 reported none, which in this literature usually means none
were asked about.

`toxicology-adjacent` is the grade I had to invent and it earns its place. It covers the case where a
real, strong literature exists about the *material or the surgery in general clinical use*, and no
literature exists about the *practice*. Datura is the clean case: rich emergency toxicology from
recreational and accidental ingestion, zero studies of any ritual or divinatory use. Khecarī is the
sharper one: the frenulum-cutting evidence is entirely from clinical frenectomy for ankyloglossia
(PMID 31255827 — haemorrhage from submental/sublingual arteries and deep lingual veins, Wharton's duct
obstruction with retention cyst and stricture, lingual nerve injury, sublingual and submandibular space
infection), performed once, under anaesthesia, by a clinician, with haemostasis and follow-up. The
practice is a repeated incision with none of that. **The clinical rates do not transfer and would
understate.** Nobody has studied the practice. The strongest evidence about it remains Mallinson's
ethnography in a cite-only 2007 critical edition, and the record says so rather than dressing fieldwork
as medicine.

---

## 4. Practice-by-practice, the short version

**Seated meditation / mindfulness — `sr-meta`.** Goyal: 18,753 citations screened, 47 RCTs, 3,515
participants. Anxiety 0.38 (0.12–0.64) at 8 weeks decaying to 0.22 (0.02–0.43); depression 0.30
(0.00–0.59) → 0.23 (0.05–0.42); pain 0.33 (0.03–0.62). Note the depression CI at 8 weeks touches zero.
Low evidence of no effect, or insufficient evidence of any effect, for positive mood, attention,
substance use, eating, sleep and weight. Strongest critique: Van Dam et al. (PMID 29016274), sixteen
authors including working meditation researchers and Britton, on construct instability, inactive
controls, small unblinded samples, and a press environment ahead of the data — stating outright that
poor methodology may leave the public harmed, misled and disappointed.

**Meditation adverse events — its own record, because it is its own literature.** Lindahl et al.
(*PLoS ONE* 2017, doi 10.1371/journal.pone.0176239): 60 practitioners across Theravāda, Zen and Tibetan
lineages plus 32 experts; 59 experience categories across 7 domains; **73% moderate-to-severe impairment
in ≥1 domain, 17% suicidality, 17% inpatient hospitalisation, median symptom duration 1–3 years, range
days to over a decade.** Those numbers are arresting and they are **not incidence** — the study used
deviant-case sampling explicitly *for* challenging experiences and the authors say so. I recorded the
authors' own five limitations verbatim in structure: sampling frame, whiteness and education of the
sample, retrospective self-report, no control group, no causal inference. Recruitment through teachers
plausibly *excluded* people who quit entirely, which biases toward under-statement — worth flagging
because it cuts the other way from the sampling bias and reviewers only ever notice one.

**Transcendental Meditation — `sr-meta`, and the cleanest provenance story on the site.** Canter & Ernst:
**107 reports identified, 10 met inclusion** — the other 97 excluded for no controls or no
randomisation. Of the ten: 4 strongly positive, 4 wholly negative, 2 largely negative, positives
concentrated inside the movement. Conclusion: no convincing specific effect beyond practice effects and
motivation. **Date correction recorded in-data per §1.2: the brief and much of the literature cite
"Canter & Ernst 2004"; the paper published in *Wiener klinische Wochenschrift* on 28 November 2003,
115(21–22):758–66, PMID 14743579.** The AHA 2013 statement (PMID 23608661) is the most quotable single
artefact in this record because it grades four things at once: TM **Class IIB / LOE B**, all other
meditation **Class III / LOE C**, yoga **Class III / LOE C**, device-guided slow breathing **Class IIA /
LOE B**. Class III means *not useful or effective*. And the movement's researchers published a formal
request in *Hypertension* that the rating be upgraded; the AHA writing group published a response
declining. Both are in print, both are cited, neither is resolved here (§1.3).

**Chanting / mantra — `lab-physiology`, and the classic is more interesting than its reputation.**
Bernardi's 23 subjects; both the Latin Ave Maria and a Sanskrit mantra converged on ~6 breaths/min;
baroreflex sensitivity rose 9.5 (SD 4.6) → 11.5 (SD 4.9) ms/mmHg. **The result is about metre, not
mantra** — the study's own design proves it, since two unrelated verses in two languages produced the
same effect by producing the same breathing rate, and metronomic breathing reproduces it with no
recitation at all. That is why the AHA rates a *breathing device* higher than any meditation technique.
Reading Bernardi as evidence for sacred syllables inverts what he demonstrated, and the site is in a
strong position to say so.

**Breath practices, split into three records deliberately.** Paced/pranayama (`sr-meta`, via the device
rating), hyperventilation methods (`sr-single`), and retention/hypoxia (`none`). The split matters
because FRAMING C-3's whole point is that the hazard is not "timings" but **"breathe rapidly, then
hold"**, and a single "breathwork" record would have averaged a Class IIA recommendation together with a
drowning mechanism.

- Wim Hof: Kox et al. (*PNAS* 2014) is real — voluntary epinephrine release, blunted cytokine response
  to injected endotoxin, fewer flu-like symptoms. The 2024 systematic review (Almahayni & Hammond, PMID
  38478473) covers **9 papers / 8 trials, 15–48 participants each, 86.4% male, all RCTs at high
  risk-of-bias concern except one, heterogeneity too great to meta-analyse**, and states that all
  results must be interpreted with caution. There is also a published proof-of-principle study
  specifically testing whether *outcome expectancy* rather than the technique drove the endotoxemia
  result — which is precisely the right question for an unblindable intervention.
- **The death tally is not peer-reviewed and the file says so in a `provenanceWarning`.** 21 deaths and
  18 injuries as of 1 Jan 2024, 12 in the US, 13 involving drowning of practitioners who lost
  consciousness — this is investigative journalism and civil litigation, not a registry and not a
  forensic case series. **I searched for a peer-reviewed forensic report specific to the branded method
  and did not find one.** That gap is recorded as a finding rather than papered over by borrowing the
  authority of the drowning physiology, which is a genuinely different and much stronger literature
  (Craig 1976, 58 cases; Craig 1961, 8 cases).
- Retention/hypoxia is graded `none` and is the file's clearest case of **an empty effects axis beside a
  full harms axis**. The CDC figure carried in FRAMING C-3 — 82 probable deaths, US youths 6–19,
  1995–2007, mean age 13.3, 86.6% male, autoerotic and suicidal cases excluded by definition — is
  deaths caused purely by the idea that induced cerebral hypoxia produces a desirable state. Nothing in
  this slice weakens C-3; the harm evidence here is why C-3 exists.

**Fasting, split from inedia.** Supervised therapeutic fasting has a real dataset — Wilhelmi de Toledo
et al., 1,422 subjects, 4–21 days, 200–250 kcal/day plus a lifestyle programme — and it is
**single-centre, uncontrolled, run by the clinic whose programme it evaluates, on self-selected paying
participants under continuous medical supervision**, so its safety finding generalises to that setting
and nowhere else. Inedia is graded `none` and will stay there; the claim contradicts mammalian
energetics and there is no study to await. What exists is the C-6 death record (Degen 1997, Morris 1998
with two manslaughter convictions, Linn 1999 — coroner and court, flagged non-peer-reviewed) and the
**refeeding** mechanism, which is the one the site should push hardest because it is the invisible one:
insulin-driven intracellular electrolyte shift on reintroduction of carbohydrate, severe
hypophosphataemia, cardiac/respiratory/neuromuscular failure, **typically within four days of resuming
nutrition**. Anyone who reads hagiography and tries it is at risk twice and will not have heard of the
second.

**Heavy metals — the most replicated finding in the file.** Saper 2004 (PMID 15598918): 70 South-Asian
products from Boston stores, 14 (20%) over regulatory limits. Saper 2008 (PMID 18728265): 193 internet
products, 40 (20.7%) with detectable Pb/Hg/As, **all 40 over a state, national or international limit**,
and rasa-śāstra-declared products roughly 40% positive against 17% for herbal-only. CDC MMWR 61(33):
six lead-poisoned pregnant women in NYC, BLL 16–64 µg/dL, product lead **up to 2.4% by weight**. Four
years apart, two sampling frames, two countries of manufacture, corroborated by case investigation.
The strongest *counter*-argument is recorded too and is not dismissed: these are product surveys, not
studies of correct preparation, and nobody has assayed a controlled series of properly performed
bhasmas against the same standards. That is a real gap and the record says so.
**The cinnabar correction lands as FRAMING C-1 predicts**: Liu et al. (doi 10.3181/0712-MR-336) —
insoluble, poorly absorbed, distributes like inorganic mercury with renal accumulation, neurotoxic
threshold ~1000× methylmercury. And the same literature is why **the process is the hazard vector, not
the mineral**: heat transformation liberates the toxic species, which is what Shen Kuo said in 1088.

**Waidan — `none` for effects, and the Tang count is left unresolved.** Secondary accounts differ on
whether five, six or more Tang emperors died of elixir poisoning. §1.3 requires the disagreement to
print. **Needham vol. V and Ho Peng Yoke were not retrieved in this pass and the record says so**;
whoever renders a count retrieves them first. The tradition's own harm literature (Baopuzi's poisonous
preparations, the Zhenyuan miaodao yaolüe's fatal mistakes, the Xuanjie lu's antidotes) is carried from
FRAMING C-1 and is flagged as not independently re-verified here.

**Psilocybin — `sr-meta`, and the most careful record in the file.** Goodwin (PMID 36322843): 233
participants, mean age 39, 52% women, 25/10/1 mg arms with 1 mg as control, **severe adverse events 9% /
7% / 1%**, suicidal ideation and self-injurious behaviour numerically higher in both active arms, and
the 12-week sustained-response difference **not** statistically significant. Carhart-Harris (doi
10.1056/NEJMoa2032994) found no significant difference from escitalopram on the primary endpoint.
Functional unblinding is near-total. **I could not retrieve the primary-endpoint effect estimates —
the publisher returned 403 twice — and I did not reproduce them from memory.** The gap is flagged
in-record with an instruction to retrieve before rendering. That is §1.2 working as designed and it is
the right outcome: a number I am confident about is still a number I did not see.

**Five records added beyond the brief**, because the site's corpora demand them and they were all
grounded in this pass: suffumigation/incense (a real exposure literature — fine PM and carcinogenic
PAHs in enclosed temple settings, PMID 16979223; inconsistent cancer epidemiology, recorded as
inconsistent), ritual bathing/cold immersion (cold-shock physiology and the drowning literature that
C-3 rests on), talismanry/election (`none`), divinatory consultation (`none`), mudrās (near-`none`;
the reviews themselves concede direct evidence is limited and inferred from wider yoga interventions).

**The two null-searches are recorded as citation entries with their queries and dates**, so the claim
"no study exists" is itself checkable rather than asserted. The talisman search is a small comic gem
that makes the point better than prose: it returns almost nothing but cardiology trials of the
AMPLATZER Amulet left atrial appendage occluder.

---

## 5. The one real conflict with FRAMING, stated rather than smuggled

**§C-1 makes the presence of `g|mg|kg|ml|°C|°F|minutes|hours` in a harm-flagged record's site-voice
fields a hard failure. A documented-effects axis cannot exist without mg/kg assay results, µg/dL blood
levels and mg trial doses.** Fourteen of my records are harm-flagged.

I do not think C-1 is wrong, and I have not routed around it. C-1's stated locus of danger is
**normalisation** — converting *pala* to grams, *puṭa* cycles to °C, "a lightning-struck branch" to a
species — and its stated justification is **accuracy**, that archaic units are regionally variable and
any conversion the site published would be a fabricated number carrying the site's authority on exactly
the substances where a wrong number kills. **Not one number in this file is such a conversion.** Every
value in `measuredValues` is (a) an assay result from a marketed product, (b) a standardised effect
size, (c) a dose of a pharmaceutical-grade compound in a registered trial, or (d) a prevalence figure.

So the structural answer, and it follows the pattern FRAMING already uses:

- All numbers live in `measuredValues`, declared machine data, **never a site-voice field, never a
  recipe parameter, never a table column the comparison view reads**. The lint I ran confirms zero
  units, zero imperative openers and zero second-person tokens across all six site-voice fields in all
  23 records.
- The integrating round must either declare `measuredValues` exempt in the linter **with a positive
  assertion that the exemption is narrow** — the V5 pattern from §3.4, assert that at least one shipped
  `measuredValues` string *would* fail the site-voice lint if linted, and does not fail the suite — or
  render numbers only as chips. **Doing neither ships a rule the data trips on day one**, which is the
  failure mode §3.4 exists to prevent.
- The psilocybin arms (25/10/1 mg) are the one place a reviewer could still reasonably object, since
  they are doses and they sit near entheogenic materia. Recommendation in-record: render them in site
  voice as "high, low, and sub-perceptual control dose" and keep the integers in data only.

---

## 6. What the renderer must not do

1. **Do not sort or colour-rank by grade.** It is a research-volume measure. A league table turns it
   back into the efficacy axis this round exists to abolish.
2. **Do not render a grade chip without the record's `keyNullFinding` or `separationNote` adjacent.**
   Per §5 A-5, put them in DOM order *before* the grade, so a prefix-truncated extraction cannot carry
   the grade without the qualifier — the same structural move the harm note uses inside
   `figure.quoted-primary`.
3. **Do not drop `provenanceWarning`.** Three harm entries are journalistic, coroner or court records.
   Stripping the warning converts a press count into a study finding — the §2.3 credibility-borrowing
   error, committed against ourselves.
4. **Do not size cards by content length.** Practice-types with literature produced long records;
   practice-types without produced short ones. Six `none` records are findings and must render at full
   weight or the interface will teach the opposite of what the axis says.
5. **Do not quote Mallinson (2007).** It is `cite-only` under §4.4. The khecarī harm evidence cites and
   page-references it and reproduces nothing.
6. **Do not let this axis appear on the same visual row as an attestation-frequency measure** without a
   separator. §1.1: frequency of attestation is evidence about transmission, never about efficacy;
   collocating a transmission count with a research grade invites exactly the inference both forbid.

---

## 7. Honest limits of this slice

- **One research pass, one compiler.** Search-and-fetch over PubMed, PMC, publisher pages and journal
  sites. Not a systematic review; no protocol, no second screener, no PRISMA flow. Literature selection
  was steered by the brief, which named most of the anchor papers, and my additions were chosen for
  relevance to the site's corpora rather than by any sampling rule.
- **Two citations carry retrieval flags.** Goodwin's primary-endpoint estimates (publisher 403) and the
  CDC choking-game MMWR volume/issue (carried from FRAMING, not re-derived). Flagged in-record. Neither
  reproduced from memory.
- **Page numbers and DOIs are omitted where not seen.** Mehanna's page range, Legare & Souza's DOI,
  Lin 2008's DOI, and three PMIDs are marked as unconfirmed rather than guessed. `verified` arrays on
  every citation record which identifiers were actually seen on a retrieved page in this session.
- **Anglophone and PubMed-biased.** Non-English clinical literature, Indian AYUSH-indexed journals and
  Chinese-language TCM literature are essentially absent. For rasaśāstra in particular this cuts hard:
  BAMS-syllabus research on śodhana and māraṇa exists in venues my search did not reach, and its absence
  here should not be read as its non-existence.
- **The `none` records rest on negative searches, which are weak evidence.** Two are documented with
  query and date. The other four are supported by the absence of results across the searches I ran, not
  by an exhaustive search. "No study located" is the accurate phrasing and is what the records use;
  "no study exists" would be an overclaim and does not appear in the record text.
- **No effect size in this file was recomputed.** All are as reported by the source. Where a source
  reported only a qualitative summary, `magnitude` is qualitative.
- **This slice cannot and does not tell the site whether to publish anything.** It supplies the studied
  and unstudied record. The publishing decisions stay with FRAMING §5's carve-outs, which this file
  cross-references at four points and weakens at none.
