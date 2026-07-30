# 62 — Gheraṇḍa Saṁhitā ch. 3 verse loci (mudras.js) — accuracy-check re-audit

Date: 2026-07-30. Skill: `.claude/skills/accuracy-check`. File under test:
`assets/js/core/data/practices/mudras.js` (GENERATED from `r31data/hatha-mudras.json` — any fix goes upstream + regenerate).

## 1. Claim identified

The 25 Gheraṇḍa mudrā records carry `locus` values keyed to "Vasu 1895 / SBH 1914–15",
and `PRACTICES_META.editionResolution.numberingMapping` claims the ch. 3 ranges were
"independently cross-checked against the Sanskrit verse numbering at siva.sh/gherand-samhita/3".
A blind re-audit reports the siva.sh witness agrees on 3.1–3, mahāvedha 3.21–24, khecarī from 3.25 —
and diverges for everything after 3.32.

## 2. Witnesses gathered

W1 — **Vasu translation lineage** (the cited edition). The 1895 scan's Devanāgarī OCR is unusable
(as `residualRisk` already discloses) and sacred-texts.com returned 403; a full Vasu-numbering
mirror (yogaconciencia.blogspot.com reproduction of the Vasu chapter) was fetched instead.
It gives, exactly: viparītakaraṇī 33–35(36), yoni 37–42(+benefits to 44), **vajroṇī 45–48**,
śakticālana 49–59(60), tāḍāgī 61, māṇḍukī 62–63, śāmbhavī 64–67, five dhāraṇās 68–81,
aśvinī 82–83, pāśinī 84–85, kākī 86–87, mātaṅginī 88–91, bhujaṅginī 92–93.

W2 — **GRETIL Sanskrit e-text** (ed. Peter Thomi, Wichtrach 1993 — an independent scholarly
Sanskrit witness). Section starts read off the e-text: khecarī 3.25 (jihvādho nāḍīṃ…),
viparītakaraṇī 3.33/34 (bhūmau śiraś ca saṃsthāpya at 3.34), yoni 3.37, **vajroli 3.45–48**
(dharām avaṣṭabhya karadvayābhyām — the inverted-posture vajroṇī, matching the repo's
same-name/different-practice flag), śakticālanī 3.49–60 zone (nābhiṃ bṛhadveṣṭanaṃ at 3.52),
tāḍāgī 3.61, māṇḍukī 3.62 (valitaṃ palitaṃ naiva at 3.63), śāmbhavī 3.64, pārthivī 3.70,
āmbhasī 3.72, vaiśvānarī 3.75, vāyavī 3.77, ākāśī 3.80, aśvinī 3.82, pāśinī 3.84, kākī 3.86,
mātaṅginī 3.88, bhujaṅginī 3.92. Chapter ends 3.100 + colophon ("…mudrāprayogo nāma
tṛtīyopadeśaḥ"), i.e. Thomi has closing phala/secrecy verses AFTER bhujaṅginī that Vasu's 93-verse
chapter does not number.

W3 — **siva.sh/gherand-samhita/3** (the witness the meta cites), walked page by page with
Sanskrit incipits quoted:
- 3.21 rūpayauvanalāvaṇyaṃ…, 3.22 mahābandhaṃ samāsādya…, 3.23–24 mahāvedha, 3.25 jihvādho
  nāḍīṃ sañchinnāṃ… → **agrees with Vasu through 3.32** (khecarī 25–32 incl. the rasa verses 31–32).
- **3.33–3.44 is a duplicated, scrambled block**: 33 repeats the cut-the-tendon matter (=Vasu 25),
  35 repeats the khecarī definition (=Vasu 27), 36–40 repeat the khecarī phala verses under a
  heading खेचरीमुद्रायाः फलकथनम् (=Vasu 28–32), 41–44 repeat mahāvedha (=Vasu 21–24), 34/45 carry
  the sun-moon viparītakaraṇī intro.
- From there Vasu's 33–69 content runs at **+12**: viparītakaraṇī 45–48, yoni 49–56
  (55 yonimudrā parā gopyā…, 56 yāni pāpāni ghorāṇi = Vasu 43–44), vajrolī heading at 57 (57–60),
  śakticālanī heading at 61 (61–72), tāḍāgī heading 73, māṇḍukī 74–75, śāmbhavī 76–79,
  pañcadhāraṇā heading 80 + heaven-in-this-body verse 81 (=Vasu 68–69).
- **The five individual dhāraṇā sections (Vasu 3.70–81) are entirely absent from siva.sh.**
  Because 12 verses were duplicated AND 12 omitted, the tail realigns with Vasu exactly:
  aśvinī heading 82 (82–83), pāśinī 84–85, kākī 86–87, mātaṅginī 88–91 (91 yatra yatra sthito
  yogī = Vasu 91), bhujaṅginī 92–93; then two closing verses 94–95 (atha mudrāṇāṃ phalakathanam;
  śaṭhāya bhaktihīnāya…) that Vasu does not have.

W4 — **Mallinson 2004** (YogaVidya; archive.org excerpt `GherandaSamhita_131`, first 10% only):
his critical edition genuinely renumbers — the excerpt shows viparītakaraṇī already at 3.30–31,
and his ch. 3 runs to ~3.100. A real edition divergence, distinct from the siva.sh defect.

## 3. Comparison — what the divergence actually is

The blind re-audit's observation is REAL but it is a defect/nonstandard state of the siva.sh
text, not an error in the repo: no genuine recension both repeats khecarī+mahāvedha verses out
of order (33–44) and omits the pañcadhāraṇā (70–81) — a section present in Vasu, Thomi 1993 and
Mallinson 2004. Vasu's numbering is independently confirmed after 3.32 by W1 (Vasu lineage) and
W2 (Thomi Sanskrit) at every section boundary the repo records.

## 4. Per-mudrā verdict table — every record after 3.32

| record id | repo locus (Vasu) | Vasu-lineage (W1) | Thomi/GRETIL (W2) | siva.sh (W3) | verdict |
|---|---|---|---|---|---|
| gs-viparitakarani | 3.33–36 | 33–35(36) | 33/34–36 | 45–48 (shifted; defective witness) | **correct as-is** |
| gs-yoni-mudra | 3.37–44 | 37–42 (+43–44 phala) | 37–44 (yāni pāpāni at 44) | 49–56 | **correct as-is** |
| gs-vajroni | 3.45–48 | 45–48 | 45–48 (dharām avaṣṭabhya…) | 57–60 | **correct as-is** |
| gs-sakticalani | 3.49–60 | 49–59(60) | 49–60 zone | 61–72 | **correct as-is** |
| gs-tadagi | 3.61 | 61 | 61 | 73 | **correct as-is** |
| gs-manduki | 3.62–63 | 62–63 | 62–63 | 74–75 | **correct as-is** |
| gs-sambhavi | 3.64–67 | 64–67 | 64–67 | 76–79 | **correct as-is** |
| gs-parthivi-dharana | 3.70–71 | within 68–81 | 70–71 | **ABSENT from siva.sh** | **correct as-is** (siva.sh cannot corroborate) |
| gs-ambhasi-dharana | 3.72–74 | within 68–81 | 72–74 | ABSENT | **correct as-is** |
| gs-agneyi-dharana | 3.75–76 | within 68–81 | 75–76 (vaiśvānarī) | ABSENT | **correct as-is** |
| gs-vayavi-dharana | 3.77–79 | within 68–81 | 77–79 | ABSENT | **correct as-is** |
| gs-akasi-dharana | 3.80–81 | within 68–81 | 80–81 | ABSENT | **correct as-is** |
| gs-asvini | 3.82–83 | 82–83 | 82–83 | 82–83 (realigned) | **correct as-is** |
| gs-pasini | 3.84–85 | 84–85 | 84–85 | 84–85 | **correct as-is** |
| gs-kaki | 3.86–87 | 86–87 | 86–87 | 86–87 | **correct as-is** |
| gs-matangini | 3.88–91 | 88–91 | 88–91 | 88–91 | **correct as-is** |
| gs-bhujangini | 3.92–93 | 92–93 | 92–93 | 92–93 | **correct as-is**; see edition-divergent chapter tail below |

No record needs renumbering. One genuine **edition divergence** to flag, not resolve:
Vasu's ch. 3 ends at 3.93 (bhujaṅginī), while Thomi 1993 / Mallinson 2004 / siva.sh continue
with closing phala-and-secrecy verses (to ~3.100; siva.sh 94–95), and Mallinson's internal
numbering differs earlier too (viparītakaraṇī at 3.30–31). Loci are meaningful only with the
edition named — which every record already does ("Vasu 1895 / SBH 1914–15").

## 5. Required corrections (upstream in r31data/hatha-mudras.json `_meta`, then regenerate)

The loci stand; the **cross-check claim** does not. Exact strings to paste:

(a) Replace `PRACTICES_META.editionResolution.numberingMapping` with:

> "GS ch.3 verse ranges pinned to Vasu's translation (1895 = SBH 1914–15 numbering). Independent Sanskrit cross-check: GRETIL e-text of Peter Thomi's 1993 edition (gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/yoga/ghers_au.htm), which agrees with Vasu on every section boundary recorded here (khecarī 3.25; yoni 3.37; vajroṇī 3.45–48; tāḍāgī 3.61; māṇḍukī 3.62–63; śāmbhavī 3.64; the five dhāraṇās 3.70–81; aśvinī 3.82 … bhujaṅginī 3.92). siva.sh/gherand-samhita/3 corroborates ONLY 3.1–3.32 and 3.82–3.93: its chapter-3 text is defective — a duplicated, scrambled block at 3.33–44 (repeating khecarī 25–32 and mahāvedha 21–24), the five dhāraṇā sections (Vasu 3.70–81) omitted entirely, and two closing verses (94–95) Vasu does not number. Re-audited 2026-07-30."

(b) Add alongside it a flagged edition note (sourceNote):

> "sourceNote: 'Ch.3 length and internal numbering are edition-dependent: Vasu 1895/SBH ends at 3.93; Thomi 1993 (GRETIL) and Mallinson 2004 run to ~3.100 with closing phala/secrecy verses after bhujaṅginī, and Mallinson's critical edition renumbers earlier sections (viparītakaraṇī at 3.30–31 in his excerpt). All loci on this site are Vasu-numbered and say so.'"

(c) In `gs-khecari.sources[1]`, scope the siva.sh line:

> "Cross-check of the Sanskrit numbering: siva.sh/gherand-samhita/3 (valid for 3.1–3.32 — khecarī 3.25–32 confirmed; the same witness is defective after 3.32, see _meta)."

(d) `residualRisk` stays true and unchanged in substance (1895 print still not digit-verified
page-by-page; sacred-texts 403, wayback unreachable from this environment).

## 6. Verdict (one line)

All 25 Gheraṇḍa loci in mudras.js — including every record after 3.32 — are CORRECT per the
cited Vasu 1895/SBH numbering (confirmed by Vasu-lineage translation + Thomi 1993 GRETIL
Sanskrit); the blind re-audit's post-3.32 divergence is a defect of the siva.sh witness
(duplicated 3.33–44 block, omitted dhāraṇās 3.70–81), so the fix is the scoped cross-check
note above, not any renumbering.

## Sources used

- https://siva.sh/gherand-samhita/3 (and paginated /3/21-25 … /3/91-95) — Sanskrit witness cited by the repo; incipits quoted per verse.
- http://gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/yoga/ghers_au.htm — Gheraṇḍasaṁhitā e-text, ed. Peter Thomi, Wichtrach: Institut für Indologie, 1993.
- http://yogaconciencia.blogspot.com/2012/05/gheranda-samhita-capitulo-3-mudras.html — full Vasu-numbering rendering of ch. 3 (Vasu translation lineage).
- https://archive.org/stream/GherandaSamhita_131/GherandaSamhita_djvu.txt — Mallinson 2004 (YogaVidya) excerpt; shows his divergent critical-edition numbering.
- https://archive.org/details/b28140102 — Vasu 1895 Bombay scan (OCR unusable for digit-verification; per existing residualRisk).
- Attempted, unavailable: sacred-texts.com/hin/gher/gher03.htm (HTTP 403); web.archive.org (blocked in this environment); terebess.hu/english/gheranda.html (404).
