# R28 Plan — Adversarial Verification Report

**Verifier pass date:** 2026-07-16 (same day as the research pass, later fetches)
**Docs verified:** `playlist-inventory.md`, `playlist-curriculum.md`, `comparison.md`, `buddhist-canon.md`, `practices-wing.md`
**Stance taken:** assume the researchers got something wrong; verify every licence/PD claim, playlist attribution, and a spot-check set of competitor facts against live sources. All corrections were made IN PLACE in the plan documents (marked "verifier"/"verification pass"), and logged below.

**Verdict in one line:** the licensing audit is remarkably sound — every load-bearing PD/licence claim verified against the actual source — but the pass caught **2 price errors and 1 stale-maintenance claim in comparison.md, 1 wrong-edition scan link in practices-wing.md, a playlist count that had already drifted (132 → 133), 2 foreign-text corruption leaks, and 1 copyright-holder imprecision**. No invented playlist titles. No prescriptive-framing drift. No claim that would ship a copyright violation *as long as the Gheraṇḍa edition mismatch is resolved before encoding*.

---

## 1. LICENSING / PD CLAIMS — verified one by one

| # | Claim (doc) | Verified against | Result |
|---|---|---|---|
| 1 | SuttaCentral original material CC0 1.0 (licensing:6) — buddhist-canon §1.1 | `raw.githubusercontent.com/suttacentral/suttacentral/main/client/localization/elements/licensing_en.json` | **CONFIRMED verbatim** ("All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).") |
| 2 | Root texts PD (licensing:24) | same file | **CONFIRMED verbatim** |
| 3 | Legacy translations third-party copyright (licensing:14) | same file | **CONFIRMED** |
| 4 | SC AI/dataset request (licensing:27) | same file | **CONFIRMED verbatim** |
| 5 | bilara-data repo-level CC0 for translations — buddhist-canon App. A | `bilara-data`, branch `published`, `LICENSE.md` | **CONFIRMED verbatim** ("All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.") |
| 6 | Sujato Dhammapada edition page CC0 — buddhist-canon §1.1 | suttacentral.net/edition/dhp/en/sujato | **NOT DIRECTLY VERIFIABLE** (SPA returned only a browser-compat shell). Not a blocker: the claim is doubly anchored by #1 and #5, both verified. Builders should screenshot the edition front matter when encoding. |
| 7 | Thanissaro CC BY-NC 4.0 + hardened "Commercial = any sale" — §1.5 | dhammatalks.org/books/IntoTheStream/Section0002.html | **CONFIRMED verbatim** (cite-only policy stands) |
| 8 | Access to Insight per-page licences, no blanket permission, no-sale rule, FAQ itself CC BY 4.0 — §1.6 | accesstoinsight.org/faq.html | **CONFIRMED** (incl. "Requiring someone to pay for reproduction costs… is equivalent to selling") |
| 9 | Buddharakkhita ©1985 BPS free-distribution licence incl. 50-copy cap — §1.7 | accesstoinsight.org/tipitaka/kn/dhp/dhp.intro.budd.html | **CONFIRMED verbatim, word for word** |
| 10 | Digital Pāḷi Dictionary CC BY-NC-SA 4.0 — §1.9 | `dpd-db` repo README | **CONFIRMED** (firewall policy justified) |
| 11 | Ānandajoti CC BY-SA 3.0 Unported + exceptions — §1.3 | ancient-buddhist-texts.net Copyright-Notice.htm | **CONFIRMED with one precision fix**: Mahāvaṁsa/Cūlavaṁsa + *Patna* Dharmapada are PTS copyright; the *Gāndhārī* Dharmapada is **Motilal Banarsidass**'s, not PTS's. Corrected in place. |
| 12 | Wong Mou-lam Platform Sūtra, Yu Ching Press, Shanghai, **1930**, from the Tsungpao/Zongbao recension ⇒ US-PD 2026-01-01 — §1.8 | Buddhist Society provenance accounts, sacred-texts A Buddhist Bible preface, Wikipedia Platform Sutra | **CONFIRMED** (first pub. 1930, Yu Ching Press, Zongbao basis; 1930+95 ⇒ PD 1 Jan 2026) |
| 13 | Kindred Sayings vol years I 1917 / II 1922 / III 1924 / IV 1927 / **V 1930** — §1.4 + App. A | discoveringbuddha.org hosts the PTS Part V 1930 scan; PTS listings; bookseller records | **CONFIRMED** (Part V 1930 ⇒ freshly US-PD; Part III 1924 confirmed) |
| 14 | Pe Maung Tin *Path of Purity* I 1923 / II 1929 / III **1931** (III not PD until 2027) — §1.10 & practices-wing G5 | PTS product page, JRAS review, phuocson.org 1929 vol-II scan | **CONFIRMED** (the 2027 deferral for vol III is correct and must be kept) |
| 15 | *Way of a Pilgrim*, R.M. French, SPCK **1930** ⇒ US-PD 2026-01-01 — practices-wing G3 | SPCK catalogue, Wikipedia, archive.org `wayofpilgrim00fren` | **CONFIRMED + strengthened in place**: URAA is bounded — a restored foreign work gets the same 95-years-from-publication term, expired 2025-12-31 either way. Build-time accuracy-check kept as belt-and-braces. Sequel (1943) stays cite-only. |
| 16 | Vasu Gheraṇḍa Saṁhitā "SBH XV pt. 2, 1914–15, archive scan `b28140102`" — practices-wing G1 | archive.org/details/b28140102 metadata | **ERROR FOUND & CORRECTED**: `b28140102` is Vasu's **1895 Bombay ("Tatva-Vivechaka" Press) first edition**, not the 1914–15 SBH printing. Both are US-PD, so no copyright exposure — but citing 1914–15 verse numbering while linking an 1895 scan violates the site's edition-citation discipline. Corrected in two places; build blocker recorded (§Blockers). |
| 17 | Müller SBE 10 (1881), SBE 49 (1894, both Hṛdayas + Vajracchedikā), Müller–Nanjio 1884, Beal JRAS 1865, Gemmell 1912, Warren 1896, Burlingame HOS 28–30 1921, Rhys Davids Dialogues 1899/1910/1921, Chalmers 1926–27, PTS PED 1921–25, Getty 1914, Bhattacharyya 1924 (PD since 2020), Avalon 1913/1918, Pancham Sinh 1914, Legge 1891 SBE 39, Westcott 1887, Kalisch 1877, Waite 1894, Mullan 1914, Field 1909 | standard bibliographic record; all pre-1931 | **CONFIRMED by age** (95-year rule arithmetic checked; all pre-1931 ⇒ US-PD as of 2026) |
| 18 | Not-PD list: Horner 1954–59, Ñāṇamoli 1956, Conze 1948–75, Yampolsky 1967, Norman 1997, Woodward/Hare AN 1932–36 (vol 1 PD 2028), Baynes 1931 (PD 2027), Wilhelm German 1929 (PD 2025), Scholem 1941 (PD 2037), Kohn, Robinet, Idel, Saunders 1960, Bühnemann 1988, Mallinson 2007/2017 | arithmetic + publication records | **CONFIRMED** (all correctly cite-only / correctly dated) |
| 19 | "Woods 1914" (task list item) | — | **Not actually cited in any of the five R28 docs** (buddhist-canon alludes only to "1912/1914 prose" of the existing Yoga wing). For the record: J.H. Woods, *The Yoga-System of Patañjali*, HOS 17, 1914 — US-PD by age. Nothing to correct. |
| 20 | Mahāsaṅgīti Tipiṭaka PD-as-declared-by-SC — §1.2 | licensing:24 (verified) + the doc's own honest "declared PD, residual risk flagged" framing | **CONFIRMED as framed** (the doc already states the honest position) |

## 2. PLAYLIST ATTRIBUTION (`PLhW2FBQMfxKBRvThR7xqe3mwY7ZNU0Iki`)

- **Playlist page re-fetched live:** title **"Astrology Classes"**, channel **Vasishtha Astrologer**, channel ID `UCRQAp5DbT6ZvpZGArXHPeOw` — all as claimed. Channel join date 2014-08-12 re-confirmed from the uploads feed.
- **Title spot-check, 10 of 10 PASS:** positions 1, 7, 33, 42, 72, 113, 114, 122, 126, 132 (video IDs `kY0mU8ycYIU`, `36RT3IlLqlk`, `bKIAAB6DnKA`, `EjJwno-BxRQ`, `-ya08gHSlj0`, `xonO9ZJT1gE`, `W9clb6Q6jQQ`, `HEDFM4XgxpM`, `u5ltbnnCQrc`, `QUqqelTAn28`) returned exactly the inventory's titles — verbatim down to the "Yogkarka" typo and the double space in "Classes -  6" (RSS-confirmed). oEmbed attributes checked videos to "Vasishtha Astrologer" (`@vasishthaastrologer583`). **No invented titles found.** (Several videos return HTTP 401 from oEmbed — embedding disabled — which retro-explains the inventory's oEmbed failure; their titles were verified from watch pages.)
- **ERROR FOUND & CORRECTED:** the live playlist now reports **133 videos**, not 132. The un-enumerated extra is most plausibly the un-numbered channel short "Retrograde planets in a birth chart #astrology#horoscope" (uploaded 2026-03-15). The inventory's "132 of 132 (100%)" recovery claim was true of its snapshot but is now 132/133 ≈ 99.2% — corrected in place in both playlist docs with a dated verifier note.
- **School/lineage assessment** ("generalist modern Parāśari, no named lineage") is explicitly labelled an inference from vocabulary in the doc, with the About text quoted; nothing found contradicting it (no lineage statement surfaced in this pass either). Acceptable as framed.

## 3. COMPARISON FACTS — 12 spot-checked

| Claim | Source checked | Result |
|---|---|---|
| Jagannatha Hora freeware; ephemeris 12899 BC–16900 AD; 2.5M-city atlas | vedicastrologer.org/jh/ | **CONFIRMED** (all three, near-verbatim) |
| Maitreya FOSS/GPL | saravali.github.io | **CONFIRMED open source** — but "original repo unmaintained, community fork active" is **STALE/WRONG**: the original project shows release 8.2 (2025-09-30) + Oct 2025 updates. **Corrected in place.** |
| Solar Fire "~$306–360" | alabe.com/solarfireV9.html | Alabe lists **$360** flat (upgrades from $99). Range tightened in place with provenance of the ~$306 figure. |
| Astro Gold macOS "$229.99" | astrogold.io/get-astro-gold/for-macos/ | **WRONG — now US$249.99.** Corrected in place. |
| TimePassages desktop from $79 | astrograph.com | **CONFIRMED** ("Buy Now from $79.00") |
| TimePassages mobile "$9.99/mo" | iOS App Store listing | **WRONG — Pro is $7.99/mo, $59.99/yr.** Corrected in place. |
| Delphic Oracle license $100 | astrology-x-files.com download page | **CONFIRMED** ("Delphic Oracle 9 License: $100.00"; XPF = the bigger cross-platform build) |
| Morinus GPLv3, Swiss Ephemeris 5000 BC–5000 AD | pymorinus site | **CONFIRMED verbatim** |
| Astrolog GPL, since 1991, 23 house systems / 24 aspects / 27 planetary moons / ~50 fixed stars | Wikipedia (Astrolog) + astrolog.org | **CONFIRMED** (Wikipedia: "the most recent versions are free software under the GNU General Public License"; all four feature counts stated). Note astrolog.org self-describes as "100% freeware" — the GPL claim rests on the sourced Wikipedia/source-distribution fact, which is what comparison.md cites. |
| astro.com free core; PLUS removes ads; ~2000 stored data sets | astro.com/free/free_chart_e.htm | **CONFIRMED** ("ASTRODIENST PLUS frees the website from third-party advertising… up to 2,000 astro data"); AstroDatabank (80,000+ records) also confirmed free-tier |
| Parashara's Light ₹5,000 (Personal) – ₹30,000 (Professional) | techjockey.com listing | **CONFIRMED** (Personal ₹5,000–7,000; Commercial from ₹12,000; Professional ₹20,000–30,000) |
| The Pattern "$14.99/mo", "casts no chart" | — | Left as-is: comparison.md already mandates these render as **attributed reviewer reports**, never flat fact (risk §4.2). Compliant. |

## 4. FRAMING SCAN

- **Prescriptive drift:** grep across all five docs for `users should / should practice|meditate|take|wear|recite / you will / try this` etc. — **zero prescriptive hits**; the only matches are the docs' own anti-prescription rules (e.g. playlist-curriculum §5.7 banning "you will…"). Nothing to recast.
- **khecarī / rasa harm-flags: SURVIVED.** practices-wing §0.1 clause 3 (mandatory `riskNote`, red-bordered, rendered *before* the description), §3.3 (khecarī frenum-cutting divergence as the crosswalk star exhibit, riskNote on both records), §5 engine-test item 5 (riskNote presence asserted for gs-khecari, hyp-khecari, hyp-vajroli, gs-vajroni, basti/dhauti), §2 vajrolī clause; lab-alchemy stays theory-only with `RASA_TOXICITY` extended and rasaśāstra link-only.
- **Remedial-prescription content: description-only confirmed.** playlist-curriculum §5.1–5.2 (no gem recommender, no upāya recommender, `buildPractice()` edge noted and capped), inventory §6 invariant note, comparison novelty claim 4. Compliant.
- **Text-corruption leaks (fixed):** buddhist-canon.md had "aṭṭhakathā背景 story" (Chinese leak) → "aṭṭhakathā background story"; practices-wing.md had "(описание via)" (Russian leak) → "(described via)". (practices-wing's "cún 存" is intentional romanization+character, left alone.)

## 5. CORRECTIONS LOG (all made in place)

1. **playlist-inventory.md** — playlist size row + recovery-score line: was "132 of 132 (100%)"; now records the live count of 133, the probable identity of the extra entry, and a 10/10 title spot-check note (with the oEmbed-401 explanation).
2. **playlist-curriculum.md** — §0 framing lock: "132 videos" annotated with the 133 verifier correction.
3. **comparison.md** — Astro Gold macOS $229.99 → **US$249.99**.
4. **comparison.md** — Maitreya "original repo unmaintained" → **active again (8.2, 2025-09-30)**; fork noted as also existing.
5. **comparison.md** — TimePassages mobile $9.99/mo → **$7.99/mo or $59.99/yr**.
6. **comparison.md** — Solar Fire "~$306–360" → **$360 Alabe list** with provenance note for the older ~$306 figure.
7. **buddhist-canon.md** — mojibake fix (背景 → background).
8. **buddhist-canon.md** — Ānandajoti exceptions: Gāndhārī Dharmapada copyright is **Motilal Banarsidass**, not PTS.
9. **practices-wing.md** — mojibake fix (описание → described).
10. **practices-wing.md** — Gheraṇḍa: archive scan `b28140102` identified as the **1895 Bombay first edition**, not the 1914–15 SBH XV pt. 2 (two locations corrected; build rule added).
11. **practices-wing.md** — Way of a Pilgrim: 1930 first publication confirmed; URAA reasoning bounded; accuracy-check kept.

## 6. BLOCKERS (must not ship as-is)

1. **Gheraṇḍa edition identity (practices-wing):** do NOT encode mudrā/āsana verse refs cited to "Vasu 1914–15 SBH XV pt. 2" while linking the `b28140102` scan — that scan is the 1895 Bombay edition. Resolve edition identity (locate a real SBH XV pt. 2 scan, or re-pin numbering to the 1895 edition) before any record ships. Licensing is unaffected (both PD); citation integrity is the issue.
2. **The "100% recovery" playlist claim** (now corrected in the docs) must not be reproduced downstream: any Workbench page quoting the inventory must say 132 enumerated / playlist since grown.
3. **Standing date-gated bans (already in the docs — keep enforced):** no Baynes 1931 or Path of Purity vol III quotes before 2027-01-01; no Horner/Ñāṇamoli/Conze/Thanissaro/Buddharakkhita/DPD text ever ingested; DPD used lookup-only per the §1.9 firewall.
4. **Sujato Dhammapada edition-page CC0** could not be independently re-verified (SPA); the CC0 status rests on the two verified repo-level declarations. Before quoting the *edition front matter* specifically, capture it at build time.

## 7. What was checked and found CLEAN (no action)

SuttaCentral CC0/PD/legacy/AI-request quartet; bilara-data CC0; Thanissaro hardened NC; ATI per-page + no-sale; Buddharakkhita 50-copy licence verbatim; DPD BY-NC-SA; Wong 1930; Kindred Sayings III 1924 & V 1930; Path of Purity 1923/1929/1931; Way of a Pilgrim 1930; all pre-1931 PD-by-age editions; all not-PD cite-only datings (arithmetic re-derived); playlist identity, channel, join date, 10/10 titles; JHora, Morinus, Astrolog, Delphic Oracle, astro.com, Parashara's Light, TimePassages-desktop facts; the absence of prescriptive framing; the khecarī/rasa/remedial harm-and-description discipline; the Dhammapada 423/26-vagga boundaries (standard); comparison.md's attributed-reviewer discipline for The Pattern/Co-Star.
