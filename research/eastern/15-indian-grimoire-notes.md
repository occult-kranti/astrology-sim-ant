# 15 — THE INDIAN GRIMOIRE CORPUS · method, gaps, and what the auditor must attack

**Slice file:** `15-indian-grimoire.json` — 25 works, 48 procedure rows, 54 edges (44 asserted, 10 explicitly declined), 8 structural findings.
**Date:** 2026-07-30. **Round:** east2.

---

## 1. What this slice claims to be

The operative manual literature of South Asia, treated as a genre in its own right and mapped against the Western grimoire corpus **structurally, not genealogically**. It is disjoint from S10 (Indian tantra) by corpus, not by method: S10 holds the philosophical and systematising mantraśāstra spine, S15 holds what Ullrey calls the **encyclopedic** grimoires — first-order ritual catalogues.

One id is shared with S10 on purpose (`tan:isanasivagurudevapaddhati`). Four titles overlap the repo's shipped abhicāra wing and each carries `dedupWith`.

---

## 2. Method, honestly stated

**One source was actually read at length.** Aaron Michael Ullrey's *Grim Grimoires: Pragmatic Ritual in the Magic Tantras* (UCSB diss. 2016) — from a `pdftotext -layout` extract already cached in this session's scratchpad as `ullrey.txt`. Sections read end-to-end: pp. 144-159 (the ritual-anatomy and systematic/encyclopedic chapters), pp. 181-197 (the three Uḍḍīśatantras and the Uḍḍ-corpus definition), pp. 551-568 (Bhūtaḍāmara: organising strategies, prior studies, textual origins), pp. 575-577 (the eight Demon Princesses), pp. 630-634 (contemporary magic and conclusion), plus targeted reads at pp. 113-118.

**Everything else is bibliographic verification**, done live this round against archive.org, Wellcome, Cambridge Core, Brill/Springer listings, and KSTS/TSS series records.

**Where a source could not be read, the row says `NOT READ`** in those words. There are eleven such sources (U2, U3, U4, U5, U6, U7, U13, U14, U17, U22, and the failed U23). Three fetches failed outright and are recorded rather than quietly dropped: Brill's PDF of Bühnemann 1999 returned **403**; academia.edu returned **403**; the IJFMR Tantrasamuccaya paper returned **an unparseable compressed PDF stream**; and 84000's reading-room pages are **client-side rendered** and returned no body text to two attempts.

**No `complete` grade is asserted about a text nobody opened.** The six `complete` grades all trace to a full translation or a critical edition made from manuscripts, and each says which.

**Razor compliance was mechanically checked, not asserted.** A pattern scan over the finished JSON for seed-syllable strings, numeric repetition counts, clock and nth-day timings, second-person imperatives, and operative substances returned **zero hits on all seven patterns**. This matters because the principal source deliberately prints all of it — Ullrey states his method at p. 146: *"I translate mantras, deity names, ingredients, and procedures in full."* Everything he translates in full, this file describes structurally and withholds.

---

## 3. What the slice actually found

**SF1 — Systematic vs encyclopedic is a completeness axis, not a taxonomy.** Encyclopedic tantras catalogue discrete rites grouped by result ("cookbooks, grimoire catalogs"); systematic tantras map variables to results and are second-order. Grading them on one scale is a category error. This is why every procedure row here carries `completenessBasis` separately from `textCompleteness`.

**SF2 — A magic tantra's own table of contents routinely does not describe it.** All three published Uḍḍīśatantras print a six-item index verse over bodies delivering eight, seven and seven results in three different orders. Zadoo's Uḍḍāmareśvara prints four mutually inconsistent organising passages before its body starts. Ullrey: *"Index verses differing from actual contents of the text is common, if not universal, in magic tantras."* **Consequence: no contents claim in this corpus may be derived from an index verse, a title, or a catalogue entry copying either.**

**SF3 — Withholding is engineered, in three distinct forms.** (a) Mantra encoding — the Śaiva Bhūtaḍāmara substitutes coded epithets for the syllables its Buddhist source writes out plainly, so the text is whole and unusable without an initiator's key; encoding also correlates with lateness, so it doubles as a dating tool. (b) The guru clause — the Uḍḍīśatantra's opening states in its own voice that wisdom written in a book confers nothing. (c) Possible editorial suppression in the 1915 print, with Goudriaan and Ullrey offering competing explanations, both recorded.

**SF4 — The print trade is the transmission, and it is nameable.** One Marwari family — Gangavishnu and Khemraj Bajaj of Churu — printed the 1899 *Kāmaratnam* with 27 plates of yantras, the Venkateshvar Steam Press *Uḍḍīśatantra* that Tripathī reproduces, Tripathī's own 1965 volume under the other brother's imprint, and a 2005 Nāgārjuna-branded tantra. Meanwhile **no published Uḍḍīśatantra recension has an identified manuscript attestation.** The Indian counterpart of the cheap chapbook grimoire is better documented at the imprint level than at the textual level — the reverse of the Western case.

**SF5 — The Goetia parallel is structural and has exactly one weak leg.** Named ranked hierarchy: evidenced. Compelling procedure with a coercive sanction: evidenced. Servitor outcome: evidenced. **Dismissal terminus: attested for the ritual grammar, from a Jain text, and not located inside the Bhūtaḍāmaratantra by any source read.** Transmission: no evidence in either direction.

**SF6 — Kerala mantravāda is not where the brief expected it.** Tantrasamuccaya and Prayogamañjarī are temple-ritual paddhatis; no source read places ṣaṭkarman or abhicāra in either. The operative material sits in the Īśānaśivagurudevapaddhati's Mantrapāda and in Nārāyaṇa's **Tantrasārasaṃgraha (Viṣanārāyaṇīya)** — 32 chapters, ten of them toxicology, the rest spirit-affliction, madness, counter-sorcery, and desire-directed acts. **The Kerala operative profile is defence-weighted; the Uḍḍ-corpus profile is murder-first. Do not flatten them into one "Indian grimoire" shape.**

**SF8 — Shared error, not shared content, is what makes a dependency here.** The slice's one strong transmission edge rests on Śaiva manuscripts reproducing errors found in *late* Buddhist versions postdating the Tibetan translation. Every other candidate rests on shared goddess-lists, which Ullrey warns are "not standard, contain both real and fanciful names, and often represent borrowed materials with no semantic value."

---

## 4. Corrections to material the repo already ships

**`abhichara-data.js` TEXTS[8] — Bhūtaḍāmaratantra.** The repo says *"A Buddhist conjuring source feeding the later Uḍḍīśa material,"* citing Ullrey pp. 133-134. **Two problems.** (i) It does not distinguish the Buddhist from the Śaiva recension, and the distinction is the whole story — one is prose, uncoded, encyclopedic, with a conversion narrative; the other is verse, mantra-coded, systematic, with no conversion narrative. (ii) *"Feeding the later Uḍḍīśa material"* asserts a transmission the cited pages do not support. What Ullrey supports is symmetric list-sharing, carrying his own caution against exactly that inference. **Recommendation: soften to a content-sharing note; the slice records the transmission edge as `ASSERTED: false`.**

**`abhichara-data.js` TEXTS[6] — Uḍḍāmareśvaratantra.** The repo has only *"Zadoo ed. (Kashmir Series of Texts and Studies)."* Add: **KSTS LXX, Srinagar: Research Department, 1947** — and note that **1947 is not public domain**. The archive.org scan carries a CC0 tag, but that is an *uploader claim*, not a rights determination, and a URAA-restored 1947 foreign publication should be treated as in US copyright. **Cite-only.**

**`tan:isanasivagurudevapaddhati` PD split (new, load-bearing).** The 1920s Trivandrum Sanskrit Series edition (vol. 1 = TSS 69, 1920, confirmed) is PD. The **1988-89 Bharatiya Vidya Prakashan reprint** with N.P. Unni is not — and it is the edition actually in circulation, including the archive.org scans of vols III-IV, which are labelled "Ganapati Sastri" but are the 1989 printing. **Any future quotation must verify which printing the page came from.**

**`rasa-data.js` Kakṣapuṭa magic square.** The repo already cites the Kakṣapuṭa for Nāgārjuna's 4×4 construction method and correctly declines to assert a grid. What it does not know is that the containing text is a **ṣaṭkarman grimoire printed in an uncritical 1915 magic anthology** whose editors may have suppressed material. The datum stands; the context should be attached.

**`confluence.js` / `rasa-data.js` Nāgārjuna flags.** Both stand. The slice adds a **third** use of the name — "Nāgārjuna" as a 20th–21st-c. bazaar-print author-brand (Ullrey's bibliography carries an *Āścaryayogamālātantra* under "the perennial author Nāgārjuna," Khemarāja Śrīkṛṣṇadāsa) — and merges none of the three.

---

## 5. Gaps — where the scholarship is genuinely thin, said plainly

1. **Bṛhat Indrajāla has no scholarship at all.** Every source found is a commercial retail listing. Three differently-compiled, differently-attributed books share the title. **The row is deliberately `UNGRADED`.** Grading it from a bookseller's blurb is precisely the failure the brief warns against.
2. **The Śaiva Bhūtaḍāmaratantra has no critical edition** despite Ullrey alone collecting 26 manuscripts from the Kathmandu National Archives. Trade prints exist and are not scholarship.
3. **The Bengali Ḍāmarutantra rests entirely on a footnote.** A translated table of contents plus "several conversations" with Keith Cantú, personal communication, unpublished. A search this round for Cantú on Ḍāmara material found nothing — his published work is on Bengali Sufism and Bāul song. **This is the weakest asserted edge in the slice** and is flagged `confidence: low`.
4. **The Malayalam Kerala mantravāda manual tradition could not be reached.** Searches returned temple-history and community pages. Two leads surfaced and could not be verified: *Śeṣasamuccaya* (attrib. Kṛṣṇa Śarma) and the household compendium usually called *Kuzhikkāṭṭu Pacca*.
5. **The Kāmākhyā-milieu vernacular corpus is an empty node**, opened deliberately so a later round does not read silence as absence.
6. **"Rāvaṇa Saṃhitā" has no critical treatment.** The only scholarly description of any such book is Ullrey's *footnote* on a Manoj Pocket Books omnibus — which turns out to reprint Tripathī's Uḍḍīśatantra verbatim. Treat the title as a **print-trade category**, not a text.
7. **Two Kerala editions are unverified on year**, and one PD status therefore hangs: Tantrasamuccaya TSS LXVII (number from a search summary, year unknown); ĪŚGDP vols 2-4 TSS numbers (commonly 72/77/83, unconfirmed).
8. **The 84000 Bhūtaḍāmara translation was never actually read.** Publication year unverified; the 7th–8th-c. dating attributed to it reached me only through a search-result summary, not from the page.
9. **Bühnemann 1999 was never read** — two edges (`ADOPTS_MATERIAL_FROM`) rest on its verified *title and scope* alone and are marked `confidence: medium`. They assert that a specialist documented Buddhist deities and mantras in those two texts, and nothing more specific.
10. **Yamano 2013's page range is disputed** — Ullrey's bibliography gives 61-118, the NTU catalogue gives 61-99. Unresolved. Do not print a range without saying which record it came from.
11. **Editorship of the 1915 Indrajālavidyāsaṃgraha is unresolved** — archive.org files it under a collection label, search gives two Bhaṭṭācārya editors, Ullrey names none.

---

## 6. What the auditor must attack — ranked, with my own best case against each

**A1 · The `ASSERTED` boolean is my invention and it carries the slice's whole epistemics.** I defined `true` = the relation holds and `evidence` documents it; `false` = recorded as a candidate the slice *declines* to assert. Ten edges are declined. **Attack:** does declining-in-place actually help, or does it smuggle resemblance claims into the graph under a negative sign where a downstream generator might render them as edges anyway? I think recording the declination is worth more than deleting it — the repo's existing abhicāra record shows exactly what happens when a declined edge gets asserted by default — but the rendering risk is real and I have not solved it.

**A2 · The Goetia comparison is the slice's headline and its fourth leg is soft.** Correspondences (1)–(3) are independently evidenced. Correspondence (4), the licence-to-depart, is *an analyst's echo-reading anchored in a Jain verse*. **Attack it directly**: is a four-point structural parallel with one leg resting on a different text still a parallel worth publishing? If the answer is no, the honest fix is to publish it as a three-point parallel and record the dismissal question as open. I chose to publish four points with the fourth explicitly fenced, in the edge, in the procedure row, and in SF5. A reviewer may reasonably say that is three fences too many for a claim that should have been cut.

**A3 · Six `complete` grades — check every one.** They are: Uḍḍīśatantra six-results catalogue and systematic tables (Tripathī, full translation exists in Ullrey's Appendix One); Rāvaṇa Saṃhitā (a **derived** grade, inherited from textual identity with Tripathī — attack this one first, it is the softest); Bhūtaḍāmara Buddhist conjuring (one sādhana edited and translated, remainder characterised as repetitive variants — attack whether "repetitive" licenses a corpus-wide grade); Kakṣapuṭa yakṣiṇī-sādhana (Yamano's critical edition, **section-scoped only**); BPK visarjana verse (one verse, in translation).

**A4 · Eleven sources were not read and two edges rest on a title.** The Bühnemann edges are the clearest target. If the auditor's rule is "no edge from an unread source," strike both and the Kerala Buddhist-adoption finding goes with them.

**A5 · The Kerala negative findings are arguments from silence.** I record `NOT ESTABLISHED AS PRESENT` for ṣaṭkarman in Tantrasamuccaya and Prayogamañjarī, and I decline their membership in the operative corpus. That is a *failure to find*, not a demonstration of absence — and the one paper that would have settled Tantrasamuccaya's chapter contents is the one whose PDF would not parse. **If the auditor wants one thing fixed before shipping, make it this: get the Tantrasamuccaya's paṭala list.**

**A6 · U12 is Wikipedia.** The entire Venkateshvar Steam Press chronology in SF4 — the dates 1868, 1871, 1880, 1893 — is tertiary. The *imprint* facts that matter (Khemarāja Śrīkṛṣṇadāsa on the 1899 Kāmaratnam; the Venkateshvar Press behind Tripathī's root text; Gangāviṣṇu Śrīkṛṣṇadāsa on the 1965 volume) are independently sourced to item records and to Ullrey, and survive without the chronology. **The chronology should be struck or re-sourced to Stark 2007.**

**A7 · Three non-local edge endpoints.** `tan:merutantra` and `gw:ars-goetia` are intentional cross-slice bridges. `gri:uddisatantra-tripathi-edition` is an **edition-level endpoint with no work row**, deliberately: collapsing it onto the work would assert that the whole textual tradition passed through the Venkateshvar Steam Press, which is false. Either the generator accepts edition endpoints or it resolves this one *with the qualification intact*.

**A8 · Living people and current disputes.** Judgements about Śivadatta, Śrīvāstava and Giri Ratna Mishra are attributed to Ullrey and never adopted. The bazaar compilers are named only as imprint facts. The Kerala practitioner interview is **one person, in a footnote**, and is explicitly not generalised. The Buddhist/Śaiva priority dispute carries three positions and resolves none. **Attack whether the Śrīvāstava recoding material — "anesthetizing," "akin to Protestant prayer" — is fairly quoted; I paired it deliberately with Ullrey's own counter-caution that "South Asians interpret tantra from the inside; their interpretations are valid developments."**

**A9 · Harm framing.** Every ṣaṭkarman row carries a `harmNote`; the māraṇa rows say so in terms; the bazaar-print row states the sharpest point — that lethal and subjugating material circulates in cheap mass-market form with no gatekeeping, which is where harm stops being historical. Efficacy is never asserted anywhere. **Attack whether the harm notes are *specific enough to be honest* without being specific enough to be useful.** That is the line I was trying to walk and it is the one worth checking hardest.

---

## 7. One thing worth saying plainly

The most useful result of this slice is not the Goetia parallel. It is **SF2 and SF4 together**: in this corpus a text's own index verse does not describe it, and the surviving witnesses are commercial prints of undetermined manuscript provenance. Those two facts mean that almost every confident statement in circulation about "the Uḍḍīśa Tantra" — including statements sourced to printed editions with commentaries — is a statement about a bazaar print whose relationship to any manuscript tradition nobody has established. The repo should not repeat such statements, and this slice tries not to.
