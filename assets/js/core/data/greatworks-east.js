// ============================================================================
//  greatworks-east.js — THE EASTERN GREATS: the Great Works wing's Eastern
//  extension. author → book → chapter study guides, in the EXACT schema of
//  GREAT_WORKS.authors[] (assets/js/core/data/greatworks.js). PURE DATA, NO DOM.
//
//  R32 phase E1 — three figures whose masterworks the site already COMPUTES
//  (the Vedic/sidereal wing, praśna, muhūrta) or already treats (the Yoga
//  Sūtras wing): Varāhamihira, Paramahansa Yogananda, Swami Vivekananda.
//
//  GENERATED FILE — do not hand-edit. Source of truth: the three verified
//  research JSONs (r32data/{varahamihira,yogananda,vivekananda}.json), emitted
//  by r32build/gen-greatworks-east.mjs. Re-run the generator to regenerate.
//
//  LOCKED FRAMING (honours the site's rule everywhere):
//   • These are historical symbolic / devotional documents of NO demonstrated
//     validity — described, never prescribed. Every miracle or efficacy passage
//     is CATALOGUED as the source's own CLAIM ("the book claims…"), never taught
//     or endorsed.
//   • PUBLIC-DOMAIN discipline is load-bearing, PER EDITION:
//       quoteSafe:true  → the cited edition is US public domain; short PD
//                         quotation permitted, always edition-cited.
//       quoteSafe:false → the standard edition is IN COPYRIGHT (or free-to-read
//                         with © retained) — CITE-ONLY: described and page-cited,
//                         never quoted, no images.
//     Notably: Yogananda's Autobiography is quote-safe ONLY in its 1946 first
//     edition (later SRF revisions copyrighted); Varāhamihira's Bṛhajjātaka is
//     PD in BOTH standard translations; Vivekananda's modern Complete Works reset
//     is cite-only (quote only pre-1930 printings).
//   • Contested dates/attributions are FLAGGED in-data with both positions and
//     never resolved. See EG_METHOD_NOTE.
//
//  siteMapping.path / siteLinks.path values are relative to the pages/ directory
//  (e.g. "vedic/index.html", "yoga/pada2.html"), exactly like greatworks.js.
// ============================================================================

export const EG_CITATION =
  "The Eastern Greats — author→book→chapter study guides for The Astrologer's Workbench, extending the Great Works wing into the Eastern traditions (R32 phase E1: Varāhamihira, Paramahansa Yogananda, Swami Vivekananda). Public-domain status determined per edition under the US 95-year rule (plus URAA restoration and renewal evidence where relevant); quotation restricted to verified PD editions and always edition-cited, copyrighted and free-to-read-but-©-retained editions cite-only. Miracle / efficacy claims reported as the source’s CLAIMS, never endorsed; contested dates and attributions flagged with both positions, never resolved. Verified 2026-07-17.";

export const EG_METHOD_NOTE =
  "How this wing was verified (E1, 2026-07-17): three figures were researched by fan-out web search and then adversarially fact-checked source-by-source (see r32data/verify-eastern-e1.md). Licence rules: US 95-year term (anything first published 1929 or earlier is US public domain now); URAA restoration for foreign works first published 1930+ and still in copyright in the source country on 1996-01-01 (a flat 95-year US term, no renewal needed); and \"free-to-read ≠ public domain\" (a hosted free PDF with copyright retained is cite-only). The load-bearing verdicts: Varāhamihira’s Bṛhajjātaka is US-PD in BOTH standard English translations (N. Chidambaram Iyer / N. C. Aiyar 1885, and V. Subrahmanya Sastri, Mysore, 1929 — PD as of 2025 under the 95-year rule); the archive.org scan labelled \"2nd ed.\" is a 1996 reprint and must NOT be quoted. Yogananda’s Autobiography of a Yogi is US public domain in its DECEMBER 1946 FIRST EDITION ONLY (48 chapters) — the practical consequence of SRF v. Ananda, 206 F.3d 1322 (9th Cir. 2000), which affirmed that SRF could not renew the book copyrights; every later SRF edition (3rd ed. 1951 onward, its added ch. 49 and photographs, and posthumous compilations such as The Second Coming of Christ, 2004) is copyrighted, cite-only. Vivekananda’s Raja Yoga (July 1896) is US-PD; the modern multi-volume Complete Works reset carries posthumously added/edited matter and is cite-only (quote only from a printing dated before 1930). Every supernatural episode is stored as the source’s CLAIM (\"the book claims…\", \"Yogananda recounts…\"), never endorsed; the Kriya Yoga (Lahiri–Yogananda lineage breath-technique) vs kriyā-yoga (Yoga Sūtra II.1: tapas–svādhyāya–īśvarapraṇidhāna) terminology collision is disambiguated in-data and in the glossary.";

export const GREAT_WORKS_EAST = [
  {
    "id": "varahamihira",
    "name": "Varāhamihira",
    "dates": "c. 505 – 587 CE",
    "glyph": "♄",
    "who": "The 6th-century Ujjain astronomer-astrologer who codified classical Indian horoscopy (jyotiṣa) and mundane omen-lore into standard reference texts.",
    "line": "A real historical scholar of Ujjain (Ujjayinī), traditionally dated c. 505–587 CE, who systematised horā (natal astrology), saṁhitā (omens/mundane/architecture) and gaṇita (mathematical astronomy). His Bṛhajjātaka became the standard Sanskrit natal manual for a millennium; his Pañcasiddhāntikā preserves five lost astronomical schools (siddhāntas). The site COMPUTES what these books describe (the Vedic/sidereal wing, praśna, muhūrta) and already CITES the Bṛhat Jātaka in prasna-data.js. The astrology is described as a historical symbolic system of no demonstrated predictive validity — never validated. Uniquely clean licence: TWO independently verified US-public-domain English translations of the natal masterwork.",
    "siteLinks": [
      {
        "path": "vedic/index.html",
        "label": "The Vedic (sidereal) reading — the engine that computes what these texts describe"
      },
      {
        "path": "prasna.html",
        "label": "Praśna — where Bṛhat Jātaka II.5 is already cited in-data"
      }
    ],
    "studyPath": [
      {
        "text": "Orientation: read the site's framing note first, so the predictive claims are bracketed before study begins — Varāhamihira's astrology is described here as a historical symbolic system, never endorsed.",
        "tools": [
          {
            "path": "about/index.html",
            "label": "Sources & Science"
          }
        ]
      },
      {
        "text": "Bṛhajjātaka ch. I (saṁjñā/definitions) with the Basics and the Vedic reading open — this is the vocabulary layer (signs, houses, planetary significations) the whole book assumes.",
        "tools": [
          {
            "path": "basics.html",
            "label": "The Basics"
          },
          {
            "path": "vedic/index.html",
            "label": "The Vedic reading"
          }
        ]
      },
      {
        "text": "Bṛhajjātaka ch. II (grahayoni — planetary natures, benefic/malefic) against prasna-data.js, which already cites II.5 in both PD translations — see a single verse turned into a computed rule.",
        "tools": [
          {
            "path": "prasna.html",
            "label": "Praśna — cites Bṛhat Jātaka II.5"
          }
        ]
      },
      {
        "text": "The longevity/period block (chs. VII–VIII, āyurdāya + daśāntardaśā) with the timelords page — read the daśā arithmetic as an ANALOGY to the site's time-lord machinery, not as validated prediction.",
        "tools": [
          {
            "path": "timelords.html",
            "label": "Time-lords (daśā analogy)"
          },
          {
            "path": "vedic/index.html",
            "label": "The Vimśottarī daśā"
          }
        ]
      },
      {
        "text": "The aṣṭakavarga chapter (ch. IX) against the Vedic reading's Sarvāṣṭakavarga output — the book's point-distribution scheme is exactly what the engine tabulates.",
        "tools": [
          {
            "path": "vedic/index.html",
            "label": "Aṣṭakavarga (SAV)"
          }
        ]
      },
      {
        "text": "The yoga chapters (XI Rāja-yoga, XII Nābhasa, XIII Candra-yoga, XIV Dvigraha) against the Vedic yogas detector — 36 cited yoga rules evaluated predicate by predicate, contested rules both ways.",
        "tools": [
          {
            "path": "vedic/yogas.html",
            "label": "Vedic yogas — the detector"
          }
        ]
      },
      {
        "text": "The results-by-house chapter (ch. XX, bhāvādhyāya) against the bhāva delineation browser.",
        "tools": [
          {
            "path": "vedic/delineation.html",
            "label": "Bhāva delineations"
          }
        ]
      },
      {
        "text": "The naṣṭa-jātaka chapter (ch. XXVI, reconstructing an unknown birth chart from the query moment) against the praśna wing — the query-time method the site treats under praśna.",
        "tools": [
          {
            "path": "prasna.html",
            "label": "Praśna — query-moment charts"
          }
        ]
      },
      {
        "text": "Close with the Pañcasiddhāntikā (the astronomy layer) against the cast-by-hand pages — the mathematical substrate under all the astrology.",
        "tools": [
          {
            "path": "handcalc.html",
            "label": "Cast by hand — the math layer"
          }
        ]
      }
    ],
    "works": [
      {
        "id": "brihajjataka",
        "title": "Bṛhajjātaka (Bṛhat Jātaka)",
        "subtitle": "The 'Great Nativity' — the standard classical Sanskrit manual of natal astrology (horā)",
        "year": "c. 550 CE",
        "unit": "Chapter (adhyāya)",
        "edition": "Ancient Sanskrit text (28 adhyāyas, 400+ ślokas). TWO verified US-PD English translations: (a) N. Chidambaram Iyer, 'The Brihat Jataka of Varaha Mihira', Foster Press, Madras, 1885 (2nd ed. 1905); (b) V. Subrahmanya Sastri, \"Varahamihira's Brihat Jataka\", Government Branch Press, Mysore, 1929.",
        "quoteSafe": true,
        "pdStatus": "US public domain in BOTH standard translations. (a) Iyer 1885 — published pre-1929, US PD (Wellcome Collection marks its scan public domain). (b) Sastri 1929 (Mysore Government Branch Press) — US PD as of 1 Jan 2025 under the 95-year rule (a 1929 foreign publication; any URAA-restored term is a flat 95 years, which expired end-2024). Short PD quotation permitted, always edition-cited; the Sanskrit source text is itself PD. Chapter GISTS below are original prose, not either translator's wording. CITE-ONLY (never quote): P. S. Sastri and other modern reprints; M. Ramakrishna Bhat's and B. Suryanarain Rao's copyrighted editions.",
        "pdSources": [
          {
            "path": "https://archive.org/details/wg1079",
            "label": "archive.org wg1079 — Iyer, 'The Brihat Jataka of Varaha Mihira', 1885 (full scan)"
          },
          {
            "path": "https://wellcomecollection.org/works/afmgm695",
            "label": "Wellcome Collection — Iyer 1885 (marked public domain)"
          },
          {
            "path": "https://catalog.hathitrust.org/Record/006938775",
            "label": "HathiTrust 006938775 — Sastri, Varahamihira's Brihat Jataka, Mysore Govt Branch Press, 1929"
          },
          {
            "path": "https://archive.org/details/BrihatJataka2ndEd.ByVSubrahmanyaSastri",
            "label": "archive.org — Sastri Brihat Jataka scan: VERIFIED to be the 1996 2nd-edition reprint (printed Sadhana Press, Bangalore; the scan's own preface dates the 1st ed. to 11 Feb 1929). This 1996 reprint is NOT PD — do NOT quote from it. Use ONLY for locating text; quote the PD 1929 1st ed. via the HathiTrust record instead."
          }
        ],
        "flags": [
          "Every predictive method below (longevity computation, death chapters, yoga results) is CATALOGUED as the text's own historical method, never asserted as valid. Astrology has no demonstrated predictive validity; the site takes no position beyond describing the source.",
          "Dates c. 505–587 CE are TRADITIONAL: the death year rests on a traditional Śaka-509 (= 587 CE) reckoning, and the c. 505 birth is inferred from his stated karaṇa epoch (Śaka 427 = 505 CE) in the Pañcasiddhāntikā. Modern scholarship broadly accepts the 6th century (fl. c. 550 CE); exact birth/death years are not documented — flagged, not resolved.",
          "Caste-frame content: chapters that assign varṇa (social class) to planets and to nativities (esp. the profession chapter and planetary-nature verses) carry historical caste hierarchy. Where cited it is historicised as a 6th-century social frame of the text, never endorsed.",
          "Chapter NUMBERING varies between recensions and editions: Iyer (1885) and Sastri (1929) present 28 adhyāyas but the mid-book sign/nakṣatra chapters (roughly XVI–XVIII) and some titles differ between printings and Sanskrit recensions. The 28-chapter spine below follows the Iyer/standard numbering; spot-check the exact śloka/chapter number against whichever scan is quoted before pinning a citation (prasna-data.js already documents an edition-varying śloka number for ch. I).",
          "The two PD translations use slightly different chapter titles/numbering; prasna-data.js already cross-checks II.5 across 'N. C. Aiyar' (= Iyer) and 'Sastri 2nd ed.' — reuse that dual-citation habit.",
          "The archive.org Sastri scan labelled '2nd ed.' is VERIFIED (2026-07-17) to be a 1996 reprint (Sadhana Press, Bangalore) — its own preface dates the 1st edition to 11 Feb 1929. The 1996 reprint is NOT PD and must never be quoted. The verified-PD basis is the 1929 1st edition only (HathiTrust 006938775, Mysore Govt Branch Press).",
          "'N. Chidambaram Iyer' is also transliterated 'N. C. Aiyar' (as in prasna-data.js). Same translator — do not treat as two people. He also translated the Bṛhat Saṁhitā; he did NOT translate the Bṛhat Parāśara Horā Śāstra (a common conflation the site refutes elsewhere)."
        ],
        "spellsMagic": [
          "The Bṛhajjātaka prescribes no ritual magic — it is a computational/interpretive manual. Its 'remedy'-adjacent material (gem and directional lore surfacing via later commentary) is catalogued as historical claim, never prescribed; the site's museum-piece framing for remedies applies."
        ],
        "chapters": [
          {
            "ref": "I",
            "title": "Saṁjñā-adhyāya (Definitions)",
            "gist": "Opens with an invocation, then fixes the technical vocabulary the rest of the book assumes: the twelve signs and their natures, planetary significations, the houses (bhāvas), directions, and the śīrṣodaya/pṛṣṭhodaya (head-rising/back-rising) classification of signs.",
            "siteMapping": [
              {
                "path": "basics.html",
                "label": "The Basics — signs & houses"
              },
              {
                "path": "vedic/index.html",
                "label": "The Vedic reading"
              },
              {
                "path": "glossary.html",
                "label": "Glossary"
              }
            ],
            "flag": "The śīrṣodaya/pṛṣṭhodaya classification is cited in prasna-data.js (SHIRSHODAYA_CITE) as 'uniform across editions; exact śloka number varies by edition' — keep that flag."
          },
          {
            "ref": "II",
            "title": "Grahayoni-prabheda (Planetary natures)",
            "gist": "The physical and symbolic natures of the seven planets — their bodies, elements, castes, guṇas, aspects, friendships, and the benefic/malefic classification. Verse II.5 (waning Moon, Sun, Mars, Saturn as malefics; conjoined Mercury as malignant) is the site's cited benefic/malefic rule.",
            "siteMapping": [
              {
                "path": "prasna.html",
                "label": "Praśna — II.5 is cited in-data (benefic/malefic classification)"
              },
              {
                "path": "vedic/index.html",
                "label": "Planetary significations"
              }
            ],
            "flag": "Assigns varṇa (caste) to the planets — historicised, not endorsed."
          },
          {
            "ref": "III",
            "title": "Viyoni-janma (Non-human births)",
            "gist": "Planetary combinations said to indicate birth in non-human forms — animals, birds, trees — a chapter on anomalous nativities.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Bhāva/graha delineation (described only)"
              }
            ]
          },
          {
            "ref": "IV",
            "title": "Niṣeka (Conception)",
            "gist": "Rules relating the moment of conception to the birth chart; determining the timing of birth, the child's sex, and multiple births.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Vedic reading (described only)"
              }
            ]
          },
          {
            "ref": "V",
            "title": "Janma-kāla-lakṣaṇa (Signs at the birth-moment)",
            "gist": "Reading the circumstances of the birth itself — normal versus difficult delivery, deformities, twins, and the newborn's immediate fortunes — from the ascendant and planetary positions.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Lagna & grahas (described only)"
              }
            ]
          },
          {
            "ref": "VI",
            "title": "Bālāriṣṭa (Infant mortality)",
            "gist": "Planetary combinations traditionally read as indicating early death, together with the ariṣṭa-bhaṅga combinations said to cancel them.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Yoga/combination detector (described only)"
              }
            ],
            "flag": "Death-of-infant prognostication — described as the text's historical method, never asserted as valid."
          },
          {
            "ref": "VII",
            "title": "Āyurdāya (Longevity)",
            "gist": "The methods for computing length of life (piṇḍāyu, aṁśāyu, naisargikāyu and the haraṇa reductions) — the book's most intricate calculative machinery.",
            "siteMapping": [
              {
                "path": "timelords.html",
                "label": "Time-lords (longevity/period arithmetic as analogy)"
              },
              {
                "path": "handcalc.html",
                "label": "Cast by hand — the arithmetic"
              }
            ],
            "flag": "Longevity computation — a historical predictive method, catalogued not endorsed."
          },
          {
            "ref": "VIII",
            "title": "Daśāntardaśā (Periods and sub-periods)",
            "gist": "The planetary time-periods (daśās) and their sub-divisions that distribute the computed life-span, with the results assigned to each ruling period.",
            "siteMapping": [
              {
                "path": "timelords.html",
                "label": "Time-lords — the daśā analogy"
              },
              {
                "path": "vedic/index.html",
                "label": "The Vimśottarī daśā"
              }
            ],
            "flag": "The daśā mapping is offered as an ANALOGY to the site's time-lord machinery, not as validated timing."
          },
          {
            "ref": "IX",
            "title": "Aṣṭakavarga",
            "gist": "The eight-source point scheme: each planet contributes benefic points to the signs, tabulated into the aṣṭakavarga tables used to weight transits and strengths.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "Aṣṭakavarga (Sarvāṣṭakavarga) — computed in the Vedic reading"
              }
            ]
          },
          {
            "ref": "X",
            "title": "Ājīva / Karma-jīva (Livelihood & profession)",
            "gist": "Determining the native's means of living, occupation, and sources of wealth from the tenth house, its lord, and planetary strengths.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Bhāva delineation — the 10th (described only)"
              }
            ],
            "flag": "Assigns occupation partly by varṇa/social class — historicised, not endorsed."
          },
          {
            "ref": "XI",
            "title": "Rāja-yoga (Combinations for power)",
            "gist": "The classic combinations traditionally read as conferring royal status, authority, and high fortune.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Vedic yogas — Rāja-yoga rules (contested rules shown both ways)"
              }
            ]
          },
          {
            "ref": "XII",
            "title": "Nābhasa-yoga",
            "gist": "The Nābhasa yogas — combinations defined by the geometric distribution of planets across the chart (āśraya, dala, ākṛti and saṅkhyā classes) said to give lifelong character effects.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Vedic yogas — the detector"
              }
            ]
          },
          {
            "ref": "XIII",
            "title": "Candra-yoga (Lunar combinations)",
            "gist": "Yogas defined from the Moon's placement and the planets flanking or aspecting it (sunapha, anapha, durudhara, kemadruma and the like).",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Vedic yogas — lunar combinations"
              }
            ]
          },
          {
            "ref": "XIV",
            "title": "Dvigraha-yoga (Two-planet conjunctions)",
            "gist": "The results attributed to each pairwise conjunction of two planets.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Vedic yogas — conjunction results"
              }
            ]
          },
          {
            "ref": "XV",
            "title": "Pravrajyā-yoga (Renunciation)",
            "gist": "Combinations traditionally read as marking a life of asceticism or monastic renunciation.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Yoga detector (described only)"
              }
            ]
          },
          {
            "ref": "XVI",
            "title": "Nakṣatra-jātaka (Character by lunar mansion)",
            "gist": "Temperament and conduct read from the birth nakṣatra (the lunar mansion of the Moon).",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Vedic reading — nakṣatra & pada"
              },
              {
                "path": "kuta.html",
                "label": "Kūṭa (nakṣatra-based compatibility)"
              }
            ],
            "flag": "Mid-book sign/nakṣatra chapters (XVI–XVIII) differ in title and order between recensions/editions — verify numbering against the scan cited."
          },
          {
            "ref": "XVII",
            "title": "Rāśiśīla (Character by sign)",
            "gist": "Disposition and behaviour read from the sign occupied — the rāśi-based character chapter.",
            "siteMapping": [
              {
                "path": "basics.html",
                "label": "The signs"
              },
              {
                "path": "vedic/index.html",
                "label": "The Vedic reading"
              }
            ],
            "flag": "Titles/order of the sign chapters vary by edition (Iyer vs Sastri) — spot-check before citing."
          },
          {
            "ref": "XVIII",
            "title": "Results of planets in the signs",
            "gist": "The specific effects attributed to each planet placed in each of the twelve signs.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Bhāva/graha delineation"
              }
            ],
            "flag": "Numbering of this chapter varies by recension — confirm against the cited edition."
          },
          {
            "ref": "XIX",
            "title": "Dṛṣṭi-phala (Aspect results)",
            "gist": "The effects of the planetary aspects (dṛṣṭis) on one another and on the houses.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Vedic reading — aspects"
              }
            ]
          },
          {
            "ref": "XX",
            "title": "Bhāva-adhyāya (Results by house)",
            "gist": "The results of planets occupying each of the twelve bhāvas (houses) — the house-by-house delineation chapter.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Bhāva delineations — the two-witness browser (the tightest single mapping)"
              }
            ]
          },
          {
            "ref": "XXI",
            "title": "Āśraya-yoga (Special combinations)",
            "gist": "Additional combinations, including effects tied to exaltation, debilitation and planetary strengths.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Vedic yogas — the detector"
              }
            ]
          },
          {
            "ref": "XXII",
            "title": "Prakīrṇa-adhyāya (Miscellaneous)",
            "gist": "Assorted results and extraordinary planetary situations not covered by the earlier systematic chapters.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Delineation (described only)"
              }
            ]
          },
          {
            "ref": "XXIII",
            "title": "Aniṣṭa-adhyāya (Misfortunes)",
            "gist": "Indicators of adversity, disease, and undesirable outcomes.",
            "siteMapping": [
              {
                "path": "vedic/yogas.html",
                "label": "Combination detector (described only)"
              }
            ],
            "flag": "Adversity/affliction prognostication — described as historical method, never validated."
          },
          {
            "ref": "XXIV",
            "title": "Strī-jātaka (Female nativities)",
            "gist": "The chapter on women's horoscopes — read here as a historical document reflecting 6th-century social assumptions, described not endorsed.",
            "siteMapping": [
              {
                "path": "vedic/delineation.html",
                "label": "Delineation (described only)"
              }
            ],
            "flag": "Period gender frame — historicised, not endorsed."
          },
          {
            "ref": "XXV",
            "title": "Niryāṇa (Death)",
            "gist": "The mode and circumstances of death and the departure of the soul, read from the chart.",
            "siteMapping": [
              {
                "path": "timelords.html",
                "label": "Time-lords (timing analogy, described only)"
              }
            ],
            "flag": "Death prognostication — catalogued as the text's method, never asserted as valid."
          },
          {
            "ref": "XXVI",
            "title": "Naṣṭa-jātaka (Lost / unknown horoscopes)",
            "gist": "How to reconstruct an unknown birth chart from the moment a question is asked — the query-time method that the site treats under praśna.",
            "siteMapping": [
              {
                "path": "prasna.html",
                "label": "Praśna — query-moment chart construction (the natural mapping)"
              }
            ]
          },
          {
            "ref": "XXVII",
            "title": "Drekkāṇa-adhyāya (Decanate results)",
            "gist": "The effects of the decanates (drekkāṇas, the thirds of a sign) and their symbolic images.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The vargas (D-3 drekkāṇa)"
              },
              {
                "path": "picatrix/faces.html",
                "label": "The 36 decan faces (cross-tradition parallel, noted as parallel)"
              }
            ]
          },
          {
            "ref": "XXVIII",
            "title": "Upasaṁhāra-adhyāya (Conclusion)",
            "gist": "The closing chapter — a summation and the author's colophon.",
            "siteMapping": [
              {
                "path": "vedic/course.html",
                "label": "The Parāśarī course (context)"
              }
            ]
          }
        ]
      },
      {
        "id": "brihatsamhita",
        "title": "Bṛhat Saṁhitā",
        "subtitle": "The 'Great Compendium' — an encyclopaedia of omens, mundane astrology, architecture, gemmology, and natural science",
        "year": "c. 550 CE",
        "unit": "Chapter (adhyāya)",
        "edition": "Ancient Sanskrit text (~106 chapters). PD English: N. Chidambaram Iyer, 'The Brihat Samhita of Varaha Mihira', 2 parts, South Indian Press, Madras, 1884. Partial earlier PD: H. Kern's serial translation in the Journal of the Royal Asiatic Society (1870–75).",
        "quoteSafe": true,
        "pdStatus": "US public domain: Iyer's 1884 translation is pre-1929 (Wellcome/archive.org scans). CITE-ONLY (never quote): V. Subrahmanya Sastri & M. Ramakrishna Bhat, 2 vols, Bangalore, 1946 (URAA-restored, US PD 2042); M. Ramakrishna Bhat, MLBD, 2 vols, 1981–82. NOTE: the encyclopaedic Saṁhitā, not the Jātaka, is the work with the 1946 Sastri edition.",
        "pdSources": [
          {
            "path": "https://archive.org/details/bihatsahitvarah00iyergoog",
            "label": "archive.org bihatsahitvarah00iyergoog — Iyer, Brihat Samhita, 1884"
          },
          {
            "path": "https://archive.org/details/brihatsamhitaenglishtranslationchidambaramiyerpart121884_478_p",
            "label": "archive.org — Iyer Brihat Samhita, Parts 1 & 2, 1884"
          },
          {
            "path": "https://wellcomecollection.org/works/hzaaf9ak",
            "label": "Wellcome Collection — Iyer's Bṛhat Saṁhitā (public domain)"
          }
        ],
        "flags": [
          "The Saṁhitā is not a natal manual: it is a mundane/omen/natural-science encyclopaedia (planetary omens, comets, rainfall, agriculture, architecture/vāstu, iconometry, gemmology, perfumery, portents). Its predictive omen-lore is described as historical claim, never validated.",
          "This treatment is a work-level record with a summary chapter overview only (the full ~106-chapter map is out of scope for the flagship natal wing); the chapter-by-chapter build is the Bṛhajjātaka."
        ],
        "spellsMagic": [
          "Contains omen-interpretation, muhūrta (electional) rules, and gem/talisman lore — all catalogued as historical claim (museum-piece framing), never prescribed."
        ],
        "chapters": [
          {
            "ref": "overview",
            "title": "The encyclopaedic compendium (~106 chapters)",
            "gist": "A single sprawling reference work covering planetary and cometary omens, the movements and 'courses' of the planets, mundane prognostication (rain, crops, prices, portents for kings and armies), muhūrta and marriage-election rules, temple and house architecture (vāstu), image-making and iconometry, gemmology, and perfumery. The astronomical/omen framework is a 6th-century worldview, described not endorsed.",
            "siteMapping": [
              {
                "path": "muhurta.html",
                "label": "Muhūrta — the electional layer the Saṁhitā codifies"
              },
              {
                "path": "kuta.html",
                "label": "Kūṭa — marriage-compatibility rules"
              },
              {
                "path": "picatrix/stars.html",
                "label": "Gem/stone lore (cross-tradition parallel, noted as parallel)"
              }
            ]
          }
        ]
      },
      {
        "id": "pancasiddhantika",
        "title": "Pañcasiddhāntikā",
        "subtitle": "The 'Treatise on the Five Astronomical Schools' — Varāhamihira's mathematical-astronomy digest",
        "year": "c. 550 CE (karaṇa epoch Śaka 427 = 505 CE)",
        "unit": "Work (noted briefly)",
        "edition": "Ancient Sanskrit text. PD English: G. Thibaut & Mahāmahopādhyāya Sudhākara Dvivedī, 'The Panchasiddhantika: The Astronomical Work of Varaha Mihira', E. J. Lazarus & Co. (Medical Hall Press), Benares, 1889.",
        "quoteSafe": true,
        "pdStatus": "US public domain: the Thibaut–Dvivedī 1889 edition is pre-1929 (the Digital Library of India record lists it 'In Public Domain'; archive.org and Open Library host scans).",
        "pdSources": [
          {
            "path": "https://archive.org/details/pancasiddhantavarahamihirathibautg.sudhakaradvivedi1889_800_f",
            "label": "archive.org — Thibaut & Sudhakara Dvivedi, The Panchasiddhantika, 1889"
          },
          {
            "path": "https://archive.org/details/in.ernet.dli.2015.110157",
            "label": "archive.org / DLI 2015.110157 — The Panchasiddhantika (marked In Public Domain)"
          }
        ],
        "flags": [
          "Noted briefly per the plan: the astronomy layer, not a fresh chapter wing. It summarises five earlier siddhāntas (Sūrya, Romaka, Pauliśa, Vāsiṣṭha, Paitāmaha), several otherwise lost — its historical value is as a witness to 6th-century Indian mathematical astronomy, and it supplies the karaṇa epoch used to date Varāhamihira.",
          "Astronomy, not astrology: this is the gaṇita (mathematical) substrate. Maps to the site's 'cast by hand' / learn-the-math pages, not to a predictive tool."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "whole",
            "title": "The five siddhāntas (mathematical astronomy)",
            "gist": "A compendium of planetary-position computation drawn from five earlier astronomical schools — mean and true positions, eclipses, and calendrical reckoning — preserving methods (including a Greek-influenced Romaka and Pauliśa) that are otherwise largely lost.",
            "siteMapping": [
              {
                "path": "handcalc.html",
                "label": "Cast by hand — the mathematical layer"
              },
              {
                "path": "learn.html",
                "label": "Learn the math"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "yogananda",
    "name": "Paramahansa Yogananda",
    "dates": "1893–1952",
    "glyph": "🕉",
    "who": "Indian monk who popularized Kriya Yoga in the West and wrote the century's best-known spiritual autobiography.",
    "line": "Bengali-born teacher (Mukunda Lal Ghosh) of the Yukteswar–Lahiri Mahasaya lineage who came to the United States in 1920, founded the Self-Realization Fellowship (Los Angeles, 1920/1935), and in December 1946 published Autobiography of a Yogi with the Philosophical Library, New York. His name is spelled 'Paramhansa Yogananda' on the 1946 title page; 'Paramahansa' is the later SRF standardization. His spiritual claims are presented here as the book's claims, and the site takes no position on them.",
    "siteLinks": [
      {
        "path": "yoga/index.html",
        "label": "The Yoga Sūtras wing — where kriyā-yoga (YS II.1) is disambiguated from Yogananda's Kriya Yoga"
      },
      {
        "path": "confluence.html",
        "label": "Confluence atlas — the Autobiography and the SRF v. Ananda ruling as documented entries"
      },
      {
        "path": "glossary.html",
        "label": "Glossary — the required 'Kriya Yoga vs kriyā-yoga' disambiguation entry"
      }
    ],
    "studyPath": [
      {
        "text": "Orientation FIRST: read the site's framing note, then approach the Autobiography as a devotional memoir whose miracle narratives are the author's claims — bracket every supernatural episode before study.",
        "tools": [
          {
            "path": "about/index.html",
            "label": "Sources & Science"
          }
        ]
      },
      {
        "text": "The one astrology chapter: ch. 16 'Outwitting the Stars' with the vedic wing open — read Sri Yukteswar's astrological-armlet/gem-remedy passage as a museum-piece claim, exactly as the site frames vedic remedies.",
        "tools": [
          {
            "path": "vedic/index.html",
            "label": "The Vedic wing"
          }
        ]
      },
      {
        "text": "The lineage technique: ch. 26 'The Science of Kriya Yoga' beside Yoga Sūtras Pāda II — note that Yogananda's 'Kriya Yoga' is a lineage prāṇāyāma method, NOT Patañjali's kriyā-yoga (tapas–svādhyāya–īśvarapraṇidhāna, YS II.1); keep the glossary disambiguation open.",
        "tools": [
          {
            "path": "yoga/pada2.html",
            "label": "Yoga Sūtras — Pāda II (kriyā-yoga)"
          },
          {
            "path": "glossary.html",
            "label": "Glossary — Kriya Yoga vs kriyā-yoga"
          }
        ]
      },
      {
        "text": "The power-claims cluster (chs. 3, 7, 19, 32, 34, 43, 46) read against the Yoga Sūtras' vibhūti-pāda: both texts catalog 'powers' — described side by side AS CLAIMS, never as fact.",
        "tools": [
          {
            "path": "yoga/pada3.html",
            "label": "Yoga Sūtras — Pāda III (vibhūti / powers)"
          }
        ]
      },
      {
        "text": "The publishing-history chapter of the method note: read the SRF v. Ananda copyright story (why the 1946 first edition is US public domain while later SRF revisions are not) as a documented legal event.",
        "tools": [
          {
            "path": "confluence.html",
            "label": "Confluence atlas — the 2000 ruling entry"
          }
        ]
      }
    ],
    "works": [
      {
        "id": "autobiography-of-a-yogi-1946",
        "title": "Autobiography of a Yogi",
        "subtitle": "First edition — Philosophical Library, New York, December 1946 (48 chapters)",
        "year": 1946,
        "unit": "Chapter",
        "edition": "Philosophical Library, New York, December 1946 (1st ed.); title page 'Paramhansa Yogananda'; dedicated to Luther Burbank; foreword by W. Y. Evans-Wentz. This FIRST EDITION has 48 chapters, ending at ch. 48 'At Encinitas in California'. Later editions differ: SRF's 3rd (1951) and subsequent revised editions add ch. 49 'The Years 1940–1951' and carry extensive authorial/editorial revisions — those revised editions are copyrighted.",
        "quoteSafe": true,
        "pdStatus": "The 1946 FIRST EDITION is US public domain. In Self-Realization Fellowship Church v. Ananda Church of Self-Realization, 206 F.3d 1322 (9th Cir. 2000), the court held (a) Yogananda's books were NOT works made for hire and the 'corporate body' authorship doctrine did not apply ('a single, identifiable individual rather than a faceless corporate mass'), and (b) affirmed summary judgment for Ananda on the books' renewal-term copyrights — books are not the 'periodical, cyclopedic, or other composite work' class a non-author proprietor may renew — so SRF's 1974 renewal registration of the 1946 edition was ineffective and the renewal right vested in the author's statutory successors. The practical settled consequence is that the 1946 text is public domain (Project Gutenberg hosts it as ebook #7452; Ananda/Crystal Clarity reprint it as 'the original 1946 edition'). QUOTE-SAFE FOR THE 1946 FIRST EDITION ONLY — always with a <25-word limit and edition citation. Every later SRF edition (3rd ed. 1951 onward, current 13th ed.) and its revised text, added chapters, and photographs are COPYRIGHTED — never quote, reproduce, or image them.",
        "pdSources": [
          {
            "path": "https://www.gutenberg.org/ebooks/7452",
            "label": "Project Gutenberg #7452 — the 1946 first edition, PD-US (48-chapter table of contents verified 2026-07-17)"
          },
          {
            "path": "https://caselaw.findlaw.com/court/us-9th-circuit/1082695.html",
            "label": "SRF v. Ananda, 206 F.3d 1322 (9th Cir. 2000) — opinion text (renewal summary judgment affirmed for Ananda)"
          },
          {
            "path": "https://en.wikipedia.org/wiki/Autobiography_of_a_Yogi",
            "label": "Wikipedia — publication history and the SRF v. Ananda copyright litigation"
          }
        ],
        "flags": [
          "FRAMING STRESS-TEST FIGURE: this is the wing's hardest honest-framing case. Every supernatural episode is stored as the book's claim ('Yogananda recounts…' / 'the book claims…'), page-cited to the first edition, never endorsed.",
          "NAME: the 1946 first-edition title page reads 'Paramhansa Yogananda' (one medial 'a'); SRF later standardized 'Paramahansa'. Both spellings recorded; do not silently normalize a first-edition quotation.",
          "LIVING ORGANIZATION: Self-Realization Fellowship (SRF) and Ananda are treated neutrally; the copyright dispute is recorded as court outcome (fact) plus each party's position (position).",
          "QUOTE ONLY the 1946 first edition (48 chapters). Do NOT quote or image any SRF revised edition (1951+), whose changes and photographs remain in copyright.",
          "The 9th Circuit opinion discusses 'the books' generically and does not analyze the Autobiography by name; the 1946 text's PD status is the settled practical consequence, so state the legal facts precisely and avoid over-claiming a title-specific holding.",
          "The 2002 final judgment split the wider dispute (NOT just 'SRF lost'): SRF RETAINED copyrights in nine magazine article-series/works (1943–1976), six 1949–51 sound recordings, and unpublished writings while unpublished; Ananda won all disputed photographs; the jury awarded SRF ~$29,000 (on the recordings). Record the whole split when the litigation is described.",
          "Record the litigation NEUTRALLY: court outcome as fact; SRF's and Ananda's positions as positions."
        ],
        "spellsMagic": [
          "The book prescribes no ritual. Its supernatural episodes (bilocation, materializations, resurrection, a woman living without food, an astrological gem-armlet) are catalogued as THE AUTHOR'S CLAIMS with first-edition chapter cites — described, never endorsed or instructed."
        ],
        "chapters": [
          {
            "ref": "1",
            "title": "My Parents and Early Life",
            "gist": "Yogananda's Bengali childhood as Mukunda Lal Ghosh; he recounts an unusually vivid memory of a prior incarnation — reported as his claim.",
            "flag": "Past-life recollection presented as the author's claim."
          },
          {
            "ref": "2",
            "title": "Mother's Death and the Amulet",
            "gist": "His mother's death and a family silver amulet the book says a sage had given her; Yogananda recounts the amulet's later disappearance as foretold — reported as the book's claim.",
            "flag": "Amulet/prophecy narrative described as claim."
          },
          {
            "ref": "3",
            "title": "The Saint with Two Bodies (Swami Pranabananda)",
            "gist": "The book claims Pranabananda appeared in two places at once — a bilocation account, reported never endorsed.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — 'powers' as claims, side by side"
              }
            ],
            "flag": "Bilocation claim."
          },
          {
            "ref": "4",
            "title": "My Interrupted Flight Toward the Himalaya",
            "gist": "A boyhood attempt to run away to the Himalayas with friends; a biographical episode of youthful spiritual longing."
          },
          {
            "ref": "5",
            "title": "A \"Perfume Saint\" Performs his Wonders",
            "gist": "Yogananda recounts 'Gandha Baba' apparently producing scents and objects at will; the book also reports his own skeptical reading of such feats — described as claim.",
            "flag": "Materialization claim."
          },
          {
            "ref": "6",
            "title": "The Tiger Swami",
            "gist": "The reported story of Sohong, a swami said to have wrestled tigers before turning to yoga — recounted as tradition/claim.",
            "flag": "Legendary feat described as claim."
          },
          {
            "ref": "7",
            "title": "The Levitating Saint (Nagendra Nath Bhaduri)",
            "gist": "The book claims the yogi Bhaduri levitated during breath-control practice — a power-claim, reported never endorsed.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — levitation among the classical 'powers'"
              }
            ],
            "flag": "Levitation claim."
          },
          {
            "ref": "8",
            "title": "India's Great Scientist and Inventor, Jagadis Chandra Bose",
            "gist": "A portrait of the physicist-botanist J. C. Bose and his crescograph work on plant response — a historical figure, described factually.",
            "siteMapping": [
              {
                "path": "confluence.html",
                "label": "Confluence atlas — a documented historical scientist"
              }
            ]
          },
          {
            "ref": "9",
            "title": "The Blissful Devotee and his Cosmic Romance (Master Mahasaya)",
            "gist": "A devotional portrait of Mahendranath Gupta ('M.'), the chronicler of Ramakrishna, whom Yogananda knew — the ecstatic states are recounted as the devotee's reported experience."
          },
          {
            "ref": "10",
            "title": "I Meet my Master, Sri Yukteswar",
            "gist": "Yogananda's account of first meeting his guru Sri Yukteswar Giri; he claims the meeting had been mutually foreseen — reported as the book's claim.",
            "flag": "Foreknowledge described as claim."
          },
          {
            "ref": "11",
            "title": "Two Penniless Boys in Brindaban",
            "gist": "A pilgrimage 'test of faith' in Brindaban in which, the book says, the boys' needs were unexpectedly met — recounted as claim."
          },
          {
            "ref": "12",
            "title": "Years in my Master's Hermitage",
            "gist": "Ashram life under Sri Yukteswar: discipline, study, and the guru's teaching method — largely biographical, with reported instances of the guru's insight described as claims."
          },
          {
            "ref": "13",
            "title": "The Sleepless Saint (Ram Gopal Muzumdar)",
            "gist": "The book claims a yogi who scarcely sleeps through mastery of trance — a power-claim, reported never endorsed.",
            "flag": "Sleeplessness claim."
          },
          {
            "ref": "14",
            "title": "An Experience in Cosmic Consciousness",
            "gist": "Yogananda recounts a samādhi of 'cosmic consciousness' he says his guru's touch induced — reported as his subjective claim.",
            "siteMapping": [
              {
                "path": "yoga/pada1.html",
                "label": "Yoga Sūtras — samādhi in Pāda I"
              }
            ],
            "flag": "Mystical-experience claim."
          },
          {
            "ref": "15",
            "title": "The Cauliflower Robbery",
            "gist": "A light domestic episode illustrating Sri Yukteswar's apparent prescience about small events — the foreknowledge described as claim."
          },
          {
            "ref": "16",
            "title": "Outwitting the Stars",
            "gist": "THE astrology chapter: Sri Yukteswar's teaching that astrology maps past karma and that 'affirmation' and remedy can lessen its pull; Yogananda recounts wearing an astrological armlet of metals and gems that, the book says, averted a karmically foretold illness. The gem-remedy claim is framed as a museum-piece, exactly as the site frames vedic remedies — described, never endorsed as efficacious.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Vedic wing — jyotiṣa the chapter invokes"
              },
              {
                "path": "glossary.html",
                "label": "Glossary — astrological gem-remedy (museum-piece framing)"
              }
            ],
            "flag": "Astrological gem/metal-armlet efficacy claim — reported never endorsed."
          },
          {
            "ref": "17",
            "title": "Sasi and the Three Sapphires",
            "gist": "A companion gem-remedy narrative: an astrologically prescribed sapphire is said to have changed a devotee's fortunes — reported as claim, in the same museum-piece frame as ch. 16.",
            "siteMapping": [
              {
                "path": "vedic/index.html",
                "label": "The Vedic wing"
              }
            ],
            "flag": "Gemstone-remedy efficacy claim."
          },
          {
            "ref": "18",
            "title": "A Mohammedan Wonder-Worker (Afzal Khan)",
            "gist": "The book recounts a magician said to materialize objects through a spirit-agent — reported as claim, with Yogananda distinguishing such feats from spiritual attainment.",
            "flag": "Materialization claim."
          },
          {
            "ref": "19",
            "title": "My Guru Appears Simultaneously in Calcutta and Serampore",
            "gist": "Yogananda claims Sri Yukteswar appeared to him in two cities at once — a bilocation account, reported never endorsed.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — 'powers' as claims"
              }
            ],
            "flag": "Bilocation claim."
          },
          {
            "ref": "20",
            "title": "We Do Not Visit Kashmir",
            "gist": "Sri Yukteswar postpones a Kashmir journey, which the book reads as foreknowledge of Yogananda's coming illness — the prescience described as claim."
          },
          {
            "ref": "21",
            "title": "We Visit Kashmir",
            "gist": "The Kashmir journey and Yogananda's severe illness; the book claims his guru knowingly bore a share of the karmic suffering — reported as claim.",
            "flag": "Karma-transfer / healing claim."
          },
          {
            "ref": "22",
            "title": "The Heart of a Stone Image",
            "gist": "A childhood devotional episode in which, the book says, a temple image of the Divine Mother responded to the devotee's prayer — recounted as the author's claim.",
            "flag": "Vision/answered-prayer claim."
          },
          {
            "ref": "23",
            "title": "My University Degree",
            "gist": "Yogananda's improbable Calcutta University A.B.; the book credits his guru's foretelling and quiet help — the prophecy described as claim, the degree as biographical fact."
          },
          {
            "ref": "24",
            "title": "I Become a Monk of the Swami Order",
            "gist": "His initiation into the monastic Swami Order by Sri Yukteswar and the taking of the name 'Yogananda' — a biographical account of the Shankaracharya Swami order."
          },
          {
            "ref": "25",
            "title": "Brother Ananta and Sister Nalini",
            "gist": "Family portraits; the book recounts a reported cure of his sister Nalini attributed to Sri Yukteswar's blessing — described as claim.",
            "flag": "Healing claim."
          },
          {
            "ref": "26",
            "title": "The Science of Kriya Yoga",
            "gist": "The doctrinal core: Yogananda presents 'Kriya Yoga' as a specific prāṇāyāma technique of his lineage (Babaji → Lahiri Mahasaya → Sri Yukteswar), which he frames as reviving a technique known to Patañjali and the Gītā. CRITICAL DISAMBIGUATION: Yogananda's Kriya Yoga (a lineage life-energy/breath method) is NOT the same as Patañjali's kriyā-yoga in Yoga Sūtra II.1 (tapas, svādhyāya, īśvarapraṇidhāna); the shared term is a collision, not an identity. Presented as the lineage's own teaching claim; no technique is instructed.",
            "siteMapping": [
              {
                "path": "yoga/pada2.html",
                "label": "Yoga Sūtras II.1 — Patañjali's kriyā-yoga (distinct term)"
              },
              {
                "path": "glossary.html",
                "label": "Glossary — REQUIRED 'Kriya Yoga vs kriyā-yoga' disambiguation"
              }
            ],
            "flag": "Term collision: Yogananda's Kriya Yoga ≠ YS II.1 kriyā-yoga — disambiguation required."
          },
          {
            "ref": "27",
            "title": "Founding of a Yoga School at Ranchi",
            "gist": "Establishing his boys' school at Ranchi (1917), blending yoga and modern education — a biographical/institutional account."
          },
          {
            "ref": "28",
            "title": "Kashi, Reborn and Rediscovered",
            "gist": "Yogananda claims to have located a young disciple, Kashi, reborn after death, as the boy had promised — a reincarnation account reported as claim.",
            "flag": "Reincarnation-identification claim."
          },
          {
            "ref": "29",
            "title": "Rabindranath Tagore and I Compare Schools",
            "gist": "A meeting with the poet Rabindranath Tagore comparing their educational experiments (Ranchi and Santiniketan) — a historical encounter, described factually."
          },
          {
            "ref": "30",
            "title": "The Law of Miracles",
            "gist": "Yogananda's metaphysical theory that 'miracles' are lawful operations within a cosmic dream (māyā), invoking prāṇa and period physics vocabulary — reported as his metaphysical claim, not as science.",
            "flag": "Metaphysical 'law of miracles' presented as the author's theory, described never endorsed; period vitalist/physics language flagged."
          },
          {
            "ref": "31",
            "title": "An Interview with the Sacred Mother (Kashi Moni Lahiri)",
            "gist": "A visit to Lahiri Mahasaya's widow, Kashi Moni; the book relays her reported testimony about her husband — described as her reported account."
          },
          {
            "ref": "32",
            "title": "Rama is Raised from the Dead",
            "gist": "The book claims a disciple named Rama, dead of illness, was restored to life through Sri Yukteswar's intercession — reported as the book's claim, never endorsed.",
            "flag": "Resurrection claim."
          },
          {
            "ref": "33",
            "title": "Babaji, the Yogi-Christ of Modern India",
            "gist": "The deathless guru 'Mahavatar Babaji': the book claims a physically ageless master who founded the Kriya lineage — reported as the tradition's claim, its historicity contested and left unresolved.",
            "flag": "Immortality/deathless-master claim; historicity contested."
          },
          {
            "ref": "34",
            "title": "Materializing a Palace in the Himalayas",
            "gist": "The book claims Babaji materialized a golden palace to teach a disciple non-attachment — a materialization account reported never endorsed.",
            "flag": "Materialization claim."
          },
          {
            "ref": "35",
            "title": "The Christlike Life of Lahiri Mahasaya",
            "gist": "A hagiographic portrait of Lahiri Mahasaya (a documented 19th-c. householder-yogi) including reported healings and materializations — the man historical, the supernatural episodes described as claims.",
            "flag": "Healing/materialization claims within a historical portrait."
          },
          {
            "ref": "36",
            "title": "Babaji's Interest in the West",
            "gist": "The book claims Babaji charged Lahiri and later Yogananda's lineage with carrying Kriya Yoga to the West, framing Yogananda's mission as prophesied — reported as the tradition's claim.",
            "flag": "Prophecy-of-mission claim."
          },
          {
            "ref": "37",
            "title": "I Go to America",
            "gist": "Yogananda's 1920 voyage and his address to the International Congress of Religious Liberals in Boston — a biographical account of his arrival in the United States."
          },
          {
            "ref": "38",
            "title": "Luther Burbank — An American Saint",
            "gist": "His friendship with the horticulturist Luther Burbank, the book's dedicatee — a historical figure, described factually.",
            "siteMapping": [
              {
                "path": "confluence.html",
                "label": "Confluence atlas — documented historical acquaintance"
              }
            ]
          },
          {
            "ref": "39",
            "title": "Therese Neumann, the Catholic Stigmatist of Bavaria",
            "gist": "The book reports the Bavarian stigmatic Therese Neumann, said to live without food and to bear the wounds of Christ; Yogananda recounts a visit — the non-eating and stigmata described as the book's claims.",
            "flag": "Inedia / stigmata claim."
          },
          {
            "ref": "40",
            "title": "I Return to India",
            "gist": "His 1935 return to India via Europe, and a reunion with Sri Yukteswar — a biographical travel account."
          },
          {
            "ref": "41",
            "title": "An Idyl in South India",
            "gist": "Travels in South India, including reported visits to shrines and saints — largely descriptive, with any wonders recounted as claims."
          },
          {
            "ref": "42",
            "title": "Last Days with my Guru",
            "gist": "The final period with Sri Yukteswar, whom the book says foretold his own passing — the foreknowledge described as claim, the death as biographical fact.",
            "flag": "Foretold-death claim."
          },
          {
            "ref": "43",
            "title": "The Resurrection of Sri Yukteswar",
            "gist": "The book's central resurrection claim: Yogananda recounts that his deceased guru appeared to him in a physical, resurrected body in a Bombay hotel and delivered a long discourse on the astral worlds — reported explicitly as the author's claim, never endorsed.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — post-mortem 'appearance' as a claim"
              }
            ],
            "flag": "Bodily-resurrection / post-mortem-appearance claim — the book's most extraordinary account, described never endorsed."
          },
          {
            "ref": "44",
            "title": "With Mahatma Gandhi at Wardha",
            "gist": "A documented 1935 visit to Gandhi's Wardha ashram; Yogananda reports initiating Gandhi and others into Kriya Yoga — the meeting historical, the initiation described as his account.",
            "siteMapping": [
              {
                "path": "confluence.html",
                "label": "Confluence atlas — documented meeting with Gandhi"
              }
            ]
          },
          {
            "ref": "45",
            "title": "The Bengali \"Joy-Permeated Mother\" (Ananda Moyi Ma)",
            "gist": "A portrait of the Bengali saint Anandamayi Ma (a documented 20th-c. figure); her ecstatic states recounted as her reported experience."
          },
          {
            "ref": "46",
            "title": "The Woman Yogi who Never Eats (Giri Bala)",
            "gist": "The book claims Giri Bala, a Bengali woman, lived for decades entirely without food or drink through a yogic technique — an inedia account Yogananda says he investigated; reported as the book's claim, never endorsed.",
            "flag": "Inedia (non-eating) claim — the 'non-eating saint', described never endorsed."
          },
          {
            "ref": "47",
            "title": "I Return to the West",
            "gist": "His return voyage to America (1936) via Europe and Palestine — a biographical travel account."
          },
          {
            "ref": "48",
            "title": "At Encinitas in California",
            "gist": "The 1946 first edition's closing chapter: the Encinitas hermitage in California and reflections on his mission and the SRF work. NOTE: this is the LAST chapter of the 1946 first edition; the added ch. 49 'The Years 1940–1951' belongs to the copyrighted 1951+ revised editions, not to the PD first edition.",
            "flag": "First edition ends here (48 chapters); ch. 49 exists only in copyrighted later editions."
          }
        ]
      },
      {
        "id": "whispers-from-eternity-1929",
        "title": "Whispers from Eternity",
        "subtitle": "A book of prayer-demands / devotional poems",
        "year": 1929,
        "unit": "Overview",
        "edition": "First edition attributed to 1929 (Yogoda Sat-Sanga / early SRF imprint); later SRF revised editions are copyrighted.",
        "quoteSafe": true,
        "pdStatus": "Pre-1930 publication → US public domain under the 95-year rule. QUOTE ONLY from a verified dated pre-1930 first-edition scan; every later revised SRF edition is copyrighted. First-edition year (1929) should be confirmed against a dated scan before a quotation is placed.",
        "pdSources": [
          {
            "path": "https://archive.org/",
            "label": "archive.org — locate and cite a dated pre-1930 first-edition scan before quoting"
          }
        ],
        "flags": [
          "First-edition year (1929) not scan-verified this round — confirm a dated pre-1930 scan before quoting; quote the first edition only, never a revised SRF edition."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "whole",
            "title": "Devotional prayer-poems",
            "gist": "A collection of Yogananda's devotional 'prayer-demands' and poems; a minor work relative to the Autobiography, listed for completeness with the pre-1930 PD note.",
            "flag": "First-edition scan to be confirmed before any quotation."
          }
        ]
      },
      {
        "id": "science-of-religion-1924",
        "title": "The Science of Religion",
        "year": 1924,
        "unit": "Overview",
        "edition": "First English edition, early Yogoda/SRF imprint, adapted from an earlier Bengali/Hindi lecture text. FIRST-EDITION YEAR UNCERTAIN: sources give 1920, 1924 and 1925 — all pre-1930, so the PD verdict is unaffected, but the exact year is not established.",
        "quoteSafe": true,
        "pdStatus": "Pre-1930 publication → US public domain under the 95-year rule (whether 1920, 1924 or 1925, all fall before the cutoff). Quote only from a verified dated pre-1930 first-edition scan; later revised editions are copyrighted.",
        "pdSources": [
          {
            "path": "https://archive.org/",
            "label": "archive.org — locate and cite a dated pre-1930 first-edition scan (year unresolved: 1920/1924/1925) before quoting"
          }
        ],
        "flags": [
          "First-edition year UNRESOLVED (sources give 1920/1924/1925) — verify against a dated scan before pinning the year; PD verdict holds regardless. Confirm a dated pre-1930 scan before quoting; quote the first edition only."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "whole",
            "title": "The universal necessity of religion",
            "gist": "An early doctrinal essay arguing all religions share the aim of removing suffering and attaining bliss — Yogananda's programmatic statement, listed for completeness with the pre-1930 PD note."
          }
        ]
      },
      {
        "id": "songs-of-the-soul-1923",
        "title": "Songs of the Soul",
        "year": 1923,
        "unit": "Overview",
        "edition": "First edition 1923 (early Yogoda/SRF imprint); later revised editions copyrighted.",
        "quoteSafe": true,
        "pdStatus": "Pre-1930 publication → US public domain under the 95-year rule. Quote only from a verified dated 1923 first-edition scan; later revised editions are copyrighted.",
        "pdSources": [
          {
            "path": "https://archive.org/",
            "label": "archive.org — locate and cite a dated 1923 first-edition scan before quoting"
          }
        ],
        "flags": [
          "Confirm a dated pre-1930 scan before quoting; quote the first edition only."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "whole",
            "title": "Devotional verse",
            "gist": "Yogananda's early book of devotional poems; a minor work listed for completeness with the pre-1930 PD note."
          }
        ]
      },
      {
        "id": "second-coming-of-christ-2004",
        "title": "The Second Coming of Christ: The Resurrection of the Christ Within You",
        "year": 2004,
        "unit": "Overview",
        "edition": "Self-Realization Fellowship, 2004 (2 vols), compiled and edited posthumously from Yogananda's commentaries.",
        "quoteSafe": false,
        "pdStatus": "IN COPYRIGHT — a posthumous SRF compilation (2004). CITE-ONLY: described and page-cited, never quoted, no images. Included to mark clearly that the modern SRF corpus around Yogananda is copyrighted, in contrast to the 1946 Autobiography first edition.",
        "pdSources": [
          {
            "path": "https://en.wikipedia.org/wiki/Paramahansa_Yogananda",
            "label": "Wikipedia — bibliographic record (no hosted text; access via libraries/purchase)"
          }
        ],
        "flags": [
          "CITE-ONLY — copyrighted SRF compilation; never quote or image. Included as the contrast case to the PD 1946 Autobiography."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "whole",
            "title": "Gospel commentary (posthumous compilation)",
            "gist": "A posthumously compiled two-volume commentary on the Christian Gospels attributed to Yogananda's teachings; recorded cite-only to flag the copyright contrast with the 1946 Autobiography."
          }
        ]
      }
    ]
  },
  {
    "id": "vivekananda",
    "name": "Swami Vivekananda",
    "dates": "1863–1902",
    "glyph": "ॐ",
    "who": "The monk who carried Advaita Vedānta and a rationalist reframing of Patañjali's yoga to the West.",
    "line": "Bengali monk (b. Narendranath Datta), disciple of Ramakrishna, who at the 1893 World's Parliament of Religions in Chicago made Vedānta a public presence in the United States and, in Raja Yoga (1896), recast Patañjali's Yoga Sūtras as a rational 'science of the mind' for Western readers. Everything published in his lifetime (d. 4 July 1902) is US public domain, as are the pre-1930 collected printings; the modern multi-volume Complete Works carries posthumously added/edited matter that is cite-only. His teaching is DESCRIBED here as a documented historical episode; De Michelis's 'Modern Yoga' thesis and traditionalist readings are both reported and neither endorsed.",
    "siteLinks": [
      {
        "path": "yoga/index.html",
        "label": "The Yoga Sūtras wing — Raja Yoga is Vivekananda's rendering of this text"
      },
      {
        "path": "yoga/theory.html",
        "label": "Yoga theory — Advaita/prāṇa framing"
      },
      {
        "path": "confluence.html",
        "label": "Confluence atlas — Vivekananda at the World's Parliament (1893), the Raja Yoga text entry, and the Ādi Śaṅkara / Advaita lineage"
      }
    ],
    "studyPath": [
      {
        "text": "Orientation: read the Preface and 'Raja-Yoga in Brief' first to see Vivekananda's thesis — yoga as an experimental 'science of the mind' — then read the site's framing note so the efficacy claims are bracketed before study begins.",
        "tools": [
          {
            "path": "about/index.html",
            "label": "Sources & Science"
          }
        ]
      },
      {
        "text": "Part I lecture by lecture ('The First Steps' → 'Dhyana and Samadhi') as period vitalism: his prāṇa/ākāśa physics-language is flagged as 1890s vitalism, described not endorsed.",
        "tools": [
          {
            "path": "yoga/theory.html",
            "label": "Yoga theory"
          }
        ]
      },
      {
        "text": "Then Part II (his free translation + commentary on Patañjali) mapped pāda-by-pāda onto the finished Yoga Sūtras wing — compare Vivekananda's rendering against the site's sūtra-by-sūtra treatment.",
        "tools": [
          {
            "path": "yoga/pada1.html",
            "label": "Samādhi-pāda"
          },
          {
            "path": "yoga/pada2.html",
            "label": "Sādhana-pāda"
          },
          {
            "path": "yoga/pada3.html",
            "label": "Vibhūti-pāda"
          },
          {
            "path": "yoga/pada4.html",
            "label": "Kaivalya-pāda"
          }
        ]
      },
      {
        "text": "Close at the Confluence atlas's Chicago-1893 event to place the whole book in its documented historical moment; note the De Michelis / traditionalist debate, unresolved.",
        "tools": [
          {
            "path": "yoga/index.html",
            "label": "The Yoga Sūtras wing (atlas cross-links from here)"
          }
        ]
      }
    ],
    "works": [
      {
        "id": "raja-yoga",
        "title": "Raja Yoga",
        "subtitle": "Being lectures by the Swami Vivekananda, with Patanjali's Aphorisms, commentaries and a glossary of terms",
        "year": 1896,
        "unit": "Chapter",
        "edition": "First published July 1896 from lectures Vivekananda delivered in New York in 1895–96. Imprint varies by issue: the New York Vedanta-circle issue (Vivekananda's American students) and Longmans, Green & Co. (London printing 1896/1897); the American students later brought out a New York edition (glossary added by Swami Abhedananda, c. 1899). PD under any of these imprints.",
        "quoteSafe": true,
        "pdStatus": "US public domain (first published 1896, well before the 1929 cutoff, under any of the Vedanta-circle / Longmans imprints). Quote from a pre-1930 printing and cite the exact imprint used; do not quote the editorial matter of any modern reset (e.g. the Advaita Ashrama Complete Works Vol. I reset), which may carry later added/edited text.",
        "pdSources": [
          {
            "path": "https://archive.org/details/RajaYogaAndPatanjalisYogaAphorisms",
            "label": "archive.org — Raja Yoga and Patanjali's Yoga Aphorisms (scan; verify the printing/imprint state before quoting)"
          },
          {
            "path": "http://www.yogebooks.com/english/vivekananda/1896rajayoga.pdf",
            "label": "yogebooks.com — '1896 Raja Yoga' PDF (title/date match; verify against a dated scan before quoting)"
          },
          {
            "path": "https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/raja-yoga_contents.htm",
            "label": "ramakrishnavivekananda.info — Raja Yoga table of contents (Complete Works Vol. I reset; use for the chapter LIST, a citable fact, not for quotation)"
          }
        ],
        "flags": [
          "Hagiography: Ramakrishna-and-disciple hagiographic narratives and miracle-tinged biography are described AS the tradition's accounts with citation, never asserted as fact.",
          "Efficacy claims: Raja Yoga's claims that its practice awakens kuṇḍalinī and yields samādhi and siddhis/vibhūtis are reported as the text's CLAIMS with page cites, never endorsed; the prāṇa/ākāśa 'physics' is flagged as 1890s vitalism.",
          "Contested scholarship, both ways unresolved: Elizabeth De Michelis's 'Modern Yoga' thesis (that Vivekananda's yoga fused Patañjali with Neo-Vedānta, Brahmo Samaj reform and Western occult/harmonial currents) vs. traditionalist readings that treat it as a faithful transmission — present both, resolve neither.",
          "Organisational sensitivity: the Ramakrishna Math/Mission and Vedanta Society lineages are living institutions; their doctrinal positions are described as positions, not adjudicated.",
          "Terminology collision (glossary REQUIRED): 'kriyā-yoga' in Raja Yoga Part II.2 is the Yoga Sūtras sense (Y.S. II.1: tapas–svādhyāya–īśvarapraṇidhāna); it is NOT the Lahiri Mahasaya/Yogananda-lineage 'Kriya Yoga' breath-technique. Cross-link a disambiguation glossary entry from pada2.html and any Yogananda record.",
          "Reception-layer honesty: Vivekananda's Raja Yoga is a RENDERING of Patañjali, not the sūtra text; every cross-link into the Yoga Sūtras wing must label it as his interpretation so a reader never mistakes his 'free translation' for the primary text.",
          "Imprint UNRESOLVED but licence-immaterial: first-1896-issue publisher is given variously as the New York Vedanta circle and Longmans, Green (London 1896/97); the New York students' edition with Abhedananda's glossary is usually dated c. 1899. All pre-1930 → PD, so the verdict stands regardless; do not assert a single 'the' first publisher without a dated scan.",
          "The received chapter list here is transcribed from the Advaita Ashrama Complete Works Vol. I reset (a modern edition); the TITLES and ORDER are citable facts, but any quotation must come from a verified pre-1930 printing, not from the reset's text.",
          "Documented modern-reception edge: this book, not a Sanskrit manuscript, is how most Anglophone readers first met Patañjali — the site's Yoga Sūtras wing treats the sūtras directly, so Vivekananda's chapters are cross-linked to that wing as a RENDERING/RECEPTION layer, explicitly labelled as his interpretation, not as the sūtras themselves."
        ],
        "spellsMagic": [
          "Raja Yoga makes efficacy claims — that its graded practice of posture, breath control (prāṇāyāma) and concentration awakens kuṇḍalinī and culminates in samādhi with attendant powers (Part II, 'Powers'). These are catalogued as the book's own claims with page cites, described as history, never prescribed as method; the prāṇa/ākāśa 'physics' is flagged as 1890s vitalism."
        ],
        "chapters": [
          {
            "ref": "Preface",
            "title": "Preface",
            "gist": "Vivekananda frames the book as an experimental method rather than a creed — his signature claim that each soul is potentially divine and that the aim is to manifest that divinity by control of the mind. Short PD quote available for citation, Raja Yoga (1896), Preface: \"Each soul is potentially divine. The goal is to manifest this divinity within.\"",
            "siteMapping": [
              {
                "path": "yoga/index.html",
                "label": "Yoga wing — the framing the site brackets"
              }
            ]
          },
          {
            "ref": "I.1",
            "title": "Introductory",
            "gist": "Sets up rāja-yoga as internal, verifiable psychology — knowledge won by concentrated observation of the mind, contrasted with external science.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory"
              }
            ]
          },
          {
            "ref": "I.2",
            "title": "The First Steps",
            "gist": "Preliminary discipline: seat, posture, ethical restraints and the beginner's practice of steadying attention.",
            "siteMapping": [
              {
                "path": "yoga/pada2.html",
                "label": "Sādhana-pāda — the limbs of practice"
              }
            ]
          },
          {
            "ref": "I.3",
            "title": "Prana",
            "gist": "Vivekananda's prāṇa doctrine: a universal energy underlying all forces, of which breath is the most accessible handle — presented in the vocabulary of 1890s ether/vital-force physics.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory"
              }
            ],
            "flag": "Period vitalism — described as his framing, not as physics."
          },
          {
            "ref": "I.4",
            "title": "The Psychic Prana",
            "gist": "Prāṇa turned inward: nerve-currents, the nāḍī channels iḍā/piṅgalā/suṣumnā, and the claim that controlling breath controls mind.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory — subtle-body model"
              }
            ],
            "flag": "Subtle-physiology claims described as the text's model."
          },
          {
            "ref": "I.5",
            "title": "The Control of the Psychic Prana",
            "gist": "The prāṇāyāma programme proper — regulated inhalation, retention and exhalation as the lever on the nervous system and, the text claims, on kuṇḍalinī.",
            "siteMapping": [
              {
                "path": "yoga/pada2.html",
                "label": "Sādhana-pāda — prāṇāyāma"
              }
            ],
            "spellsMagic": "Kuṇḍalinī-awakening claim — described, never prescribed."
          },
          {
            "ref": "I.6",
            "title": "Pratyahara and Dharana",
            "gist": "Withdrawal of the senses and one-pointed fixing of the mind — limbs five and six, presented as the trainable core of the method.",
            "siteMapping": [
              {
                "path": "yoga/pada2.html",
                "label": "Sādhana-pāda — pratyāhāra"
              },
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — dhāraṇā"
              }
            ]
          },
          {
            "ref": "I.7",
            "title": "Dhyana and Samadhi",
            "gist": "Meditation ripening into absorption; Vivekananda's account of samādhi as super-conscious knowledge — the summit of the lecture series.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda — dhyāna/samādhi (saṁyama)"
              },
              {
                "path": "yoga/pada1.html",
                "label": "Samādhi-pāda"
              }
            ]
          },
          {
            "ref": "I.8",
            "title": "Raja-Yoga in Brief",
            "gist": "A compact recapitulation of the whole graded path — the best single-chapter statement of his thesis.",
            "siteMapping": [
              {
                "path": "yoga/index.html",
                "label": "Yoga wing overview"
              }
            ]
          },
          {
            "ref": "II.0",
            "title": "Patanjali's Yoga Aphorisms — Introduction",
            "gist": "Opens Part II: Vivekananda introduces Patañjali and his own approach, which he calls a 'rather free translation' plus commentary delivered as talks — the reception layer the site flags.",
            "siteMapping": [
              {
                "path": "yoga/sources.html",
                "label": "Yoga sources — editions & translators"
              }
            ],
            "flag": "His own words: a 'free translation' — treat as rendering, not the sūtra text."
          },
          {
            "ref": "II.1",
            "title": "Concentration: Its Spiritual Uses",
            "gist": "His translation-and-commentary on the Samādhi-pāda — the nature of yoga (citta-vṛtti-nirodha), the kinds of mental modification, and the varieties of samādhi. This section = Yoga Sūtras Pāda I; his numbering follows Patañjali's.",
            "siteMapping": [
              {
                "path": "yoga/pada1.html",
                "label": "Samādhi-pāda (Pāda I) — direct sūtra-by-sūtra treatment"
              }
            ]
          },
          {
            "ref": "II.2",
            "title": "Concentration: Its Practice",
            "gist": "His rendering of the Sādhana-pāda — kriyā-yoga, the five kleśas, the eight limbs (aṣṭāṅga) through prāṇāyāma and pratyāhāra. This section = Yoga Sūtras Pāda II. Kriyā-yoga here (tapas–svādhyāya–īśvarapraṇidhāna) is the Yoga Sūtras sense — distinct from the later Lahiri/Yogananda-lineage 'Kriya Yoga' technique.",
            "siteMapping": [
              {
                "path": "yoga/pada2.html",
                "label": "Sādhana-pāda (Pāda II)"
              }
            ]
          },
          {
            "ref": "II.3",
            "title": "Powers",
            "gist": "His rendering of the Vibhūti-pāda — saṁyama (dhāraṇā-dhyāna-samādhi combined) and the siddhis/vibhūtis it is claimed to produce.",
            "siteMapping": [
              {
                "path": "yoga/pada3.html",
                "label": "Vibhūti-pāda (Pāda III) — the powers, described as the text's claims"
              }
            ],
            "flag": "The power-claims (levitation, mind-reading, etc.) are described as the text's claims, exactly as the wing frames the Sanskrit."
          },
          {
            "ref": "II.4",
            "title": "Independence",
            "gist": "His rendering of the Kaivalya-pāda — the sources of the mind, liberation (kaivalya) as the isolation of puruṣa from prakṛti. This section = Yoga Sūtras Pāda IV.",
            "siteMapping": [
              {
                "path": "yoga/pada4.html",
                "label": "Kaivalya-pāda (Pāda IV)"
              }
            ]
          },
          {
            "ref": "II.App",
            "title": "Appendix (References to Yoga) + Glossary",
            "gist": "Supporting matter: scriptural references to yoga and a glossary of Sanskrit terms (the glossary is often credited to Swami Abhedananda in the later New York edition).",
            "siteMapping": [
              {
                "path": "glossary.html",
                "label": "Site glossary — Sanskrit terms"
              }
            ],
            "flag": "Glossary attribution/edition varies; confirm against the specific printing before quoting."
          }
        ]
      },
      {
        "id": "the-yogas-and-complete-works",
        "title": "Karma-Yoga, Jñāna-Yoga, Bhakti-Yoga & the Complete Works",
        "subtitle": "The four-yoga corpus and the collected editions",
        "year": "1896–1907 (lifetime books) / collected editions from 1907",
        "unit": "Volume",
        "edition": "Lifetime lecture-books: Karma-Yoga (New York, 1896); Bhakti-Yoga and Jñāna-Yoga assembled from 1895–96 lectures (first book editions in the years around 1899–1902). Collected: 'Speeches and Writings of Swami Vivekananda' (Madras, 1899-era) and, definitively, The Complete Works of Swami Vivekananda (Advaita Ashrama, Mayavati/Almora), whose collected volumes begin appearing from 1907; the modern set (later reprinted/reset through the 20th century, current 8–9 volumes) adds posthumously edited/collected matter.",
        "quoteSafe": true,
        "pdStatus": "MIXED — gated by edition/printing. Everything Vivekananda published in his lifetime (d. 4 July 1902) and every collected volume PRINTED before 1930 is US public domain: quote-safe from a verified pre-1930 printing. The modern Complete Works reset (mid-20th-century Mayavati Memorial Edition reprints and the current set) contains posthumously ADDED or EDITED matter — letters, newly collected talks, editorial apparatus — which is cite-only; quote ONLY from a printing you have dated to before 1930 and cite the exact volume/year.",
        "pdSources": [
          {
            "path": "https://archive.org/details/in.ernet.dli.2015.532734",
            "label": "archive.org — Complete Works of Swami Vivekananda, Mayavati Memorial Edition, Vol. II (scan; verify the printing year on the copyright page before quoting)"
          },
          {
            "path": "https://www.ramakrishnavivekananda.info/vivekananda/complete_works.htm",
            "label": "ramakrishnavivekananda.info — the Complete Works text (use for structure/citable facts; quotation must be checked against a pre-1930 printing)"
          }
        ],
        "flags": [
          "First-BOOK-edition years of Jñāna-Yoga and Bhakti-Yoga are approximate here (lectures 1895–96; book editions around 1899–1902) — verify the exact first-edition year against a dated scan before marking any specific volume quote-safe. The lifetime-lecture CONTENT is PD regardless; the caution is about which PRINTING you quote.",
          "The Complete Works volumes carry different printing years across reprints (e.g. Vol. IV seen dated 1948; Vol. I resets carry later copyright pages). 'Collected volumes from 1907' is the honest start-date; treat any individual volume as quote-safe only after dating its printing to pre-1930.",
          "posthumous-additions flag: the modern set's newly collected letters, conversations and 'Inspired Talks' apparatus are editorial/posthumous matter — cite-only, never quoted from a post-1929 printing."
        ],
        "spellsMagic": [
          "Karma-, Bhakti- and Jñāna-Yoga present paths to liberation (mokṣa) and, in the Advaita frame, realisation of identity with Brahman — described as the tradition's soteriological claims, never endorsed as demonstrated."
        ],
        "chapters": [
          {
            "ref": "KY",
            "title": "Karma-Yoga (1896)",
            "gist": "The yoga of selfless action: work without attachment to results as a discipline of liberation — the most this-worldly of the four paths.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory — the four-yoga scheme"
              }
            ]
          },
          {
            "ref": "BY",
            "title": "Bhakti-Yoga",
            "gist": "The yoga of devotion: love of a personal God as the direct path, culminating (in his reading) in the same non-dual realisation as the other yogas.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory"
              }
            ]
          },
          {
            "ref": "JY",
            "title": "Jñāna-Yoga",
            "gist": "The yoga of knowledge: his Advaita Vedānta lectures — the Real vs. the apparent, māyā, and the ātman–Brahman identity that anchors his whole system.",
            "siteMapping": [
              {
                "path": "yoga/theory.html",
                "label": "Yoga theory — Advaita frame"
              }
            ],
            "flag": "Advaita lineage from Ādi Śaṅkara is the tradition's own claim (atlas: person-shankara → person-vivekananda)."
          },
          {
            "ref": "CW",
            "title": "The Complete Works (collected, from 1907)",
            "gist": "The collected lectures, class-talks, letters and writings assembled by Advaita Ashrama. The pre-1930 printings are the quote-safe substrate; the modern reset's added matter is the cite-only overlay.",
            "siteMapping": [
              {
                "path": "yoga/sources.html",
                "label": "Yoga sources"
              }
            ],
            "flag": "Quote only from a dated pre-1930 printing; cite the exact volume/year."
          }
        ]
      },
      {
        "id": "chicago-1893-address",
        "title": "The 1893 World's Parliament of Religions address",
        "subtitle": "Cross-linked to the Confluence atlas — NOT duplicated here",
        "year": 1893,
        "unit": "Event",
        "edition": "Addresses delivered at the World's Parliament of Religions, Chicago, September 1893 (opened 11 Sept 1893, alongside the Columbian Exposition); the responses are printed in J. H. Barrows (ed.), The World's Parliament of Religions (Chicago, 1894), a PD source.",
        "quoteSafe": true,
        "pdStatus": "US public domain (1893 addresses; Barrows's 1894 proceedings are pre-1930). Fully covered by the Confluence atlas event entry 'event-chicago-1893' — this record exists only as a POINTER so the Great Works wing does not duplicate the atlas.",
        "pdSources": [
          {
            "path": "https://archive.org/details/worldsparliament01barr",
            "label": "archive.org — Barrows (ed.), The World's Parliament of Religions (1894), the PD proceedings"
          }
        ],
        "flags": [
          "DO NOT DUPLICATE: the full treatment lives at Confluence atlas slug 'event-chicago-1893' ('Vivekananda at the World's Parliament of Religions'). This work record is a cross-link stub; the wing renderer should link out to the atlas, not restate it."
        ],
        "spellsMagic": [],
        "chapters": [
          {
            "ref": "atlas",
            "title": "See Confluence atlas: event-chicago-1893",
            "gist": "The Sept 1893 Chicago address that made Vedānta a public presence in the United States and established the travelling Indian teacher as a durable institution — treated in full in the atlas, cross-linked here only.",
            "siteMapping": [
              {
                "path": "yoga/index.html",
                "label": "Yoga wing → atlas event-chicago-1893"
              }
            ]
          }
        ]
      }
    ]
  }
];
