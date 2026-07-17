// ============================================================================
//  yoga-rules.js — machine-checkable yoga rule records for the R28 data-driven
//  yoga detector (core/yogas.js). GENERATED from the verified, byte-locked
//  scratchpad/r28data/yogas.json by scratchpad/r28build/gen-yoga-rules.mjs —
//  DO NOT hand-edit the record bodies; re-run the generator to change them.
//
//  36 records. Every 'fruit'/'positions'/'note' body is ORIGINAL PROSE reporting
//  what the cited classical text claims — a historical symbolic system with NO
//  demonstrated validity, described and never prescribed. Where 'contested.flag'
//  is true the detector MUST evaluate each position separately and NEVER reduce
//  the yoga to a single boolean (see meta.purpose).
//
//  SOURCES / editions: see YOGA_META.editions. Predicate grammar (house groups,
//  reference points, condition types): YOGA_META.predicateGrammar.
// ============================================================================

export const YOGA_META = {
  "dataset": "yoga-rules",
  "purpose": "Machine-checkable yoga rule records for the R28 data-driven yoga detector (playlist-curriculum T8). The engine evaluates `conditions` from data and must NEVER reduce a contested yoga to a single boolean: where `contested` is non-null, each position is evaluated and reported separately.",
  "framing": "Historical symbolic system with no demonstrated validity. Every `fruit` is an original-prose summary of what the cited classical text claims; it describes the tradition's doctrine and predicts nothing.",
  "editions": {
    "BPHS": "Brhat Parasara Hora Sastra, tr. R. Santhanam, 2 vols., Ranjan Publications, Delhi 1984 (97-chapter recension; chapter numbers follow it; other recensions divide chapters differently)",
    "Phaladipika": "Phaladipika of Mantresvara, tr. S.S. Sareen, Sagar Publications (chapter/verse numbering follows the Sareen/wisdomlib presentation; ch. 6 has 70 slokas in that witness; some printings number a few verses differently)",
    "Saravali": "Saravali of Kalyanavarman, tr. R. Santhanam, 2 vols., Ranjan Publications 1983",
    "BJ": "Brhat Jataka of Varahamihira, tr. V. Subrahmanya Sastri",
    "JP": "Jataka Parijata of Vaidyanatha Diksita, tr. V. Subrahmanya Sastri, 3 vols.",
    "LP": "Laghu Parasari (Ududaya-pradipa), dual-text editions; sloka numbering varies across printings",
    "UK": "Uttara Kalamrta attrib. Kalidasa, tr. V. Subrahmanya Sastri",
    "Raman": "B.V. Raman, How to Judge a Horoscope, 2 vols., Motilal Banarsidass - cited only as a modern witness, never as the primary authority"
  },
  "predicateGrammar": {
    "houseGroups": {
      "kendra": [
        1,
        4,
        7,
        10
      ],
      "trikona": [
        1,
        5,
        9
      ],
      "trika": [
        6,
        8,
        12
      ],
      "upachaya": [
        3,
        6,
        10,
        11
      ]
    },
    "referencePoints": [
      "Lagna",
      "Moon",
      "Sun",
      "<graha name>"
    ],
    "grahas": [
      "Sun",
      "Moon",
      "Mars",
      "Mercury",
      "Jupiter",
      "Venus",
      "Saturn",
      "Rahu",
      "Ketu"
    ],
    "naturalBenefics": "Jupiter, Venus, unafflicted Mercury, waxing Moon - the conditional cases (Moon phase threshold, Mercury by association) are themselves contested and handled by the graha-classification module, not here",
    "conditionTypes": {
      "placement": "graha occupies a house/group counted from a reference point, or shares a sign with another graha: {graha, in: <group|house[]>, from} | {graha, sameSignAs}",
      "lordship": "the lord of house N (whole-sign, from Lagna unless stated) satisfies a placement: {lordOf: N, in: <group|house[]>, from}",
      "relation": "two selectors stand in sambandha: {between: [sel, sel], sambandha: [\"yuti\", \"mutualDrishti\", \"parivartana\"]}; selectors are \"graha:<name>\" or \"lordOf:<n>\"",
      "strength": "dignity/affliction constraint: {graha|selector, dignity: [...]} or {not: [\"debilitated\", \"combust\", \"inimicalSign\"]}",
      "exclusion": "absence requirement: {noGraha: {in: <house[]>, from}, excluding: [<grahas not counted>]}"
    },
    "housesAreWholeSign": true,
    "nodesNote": "Classical Moon/Sun-flanking yogas count the five taras plus the other luminary and exclude Rahu/Ketu; each record states its own exclusion list explicitly."
  },
  "generated": "2026-07-16",
  "recordCount": 36
};

export const YOGA_FAMILIES = {
  "mahapurusha": {
    "name": "Pañca-Mahāpuruṣa",
    "description": "The five \"great person\" yogas: one of the non-luminous grahas (Mars→Ruchaka, Mercury→Bhadra, Jupiter→Haṁsa, Venus→Mālavya, Saturn→Śaśa) in its own, mūlatrikoṇa or exaltation sign while occupying a kendra. BPHS ch. 75; Phaladīpikā 6.1–4."
  },
  "solar": {
    "name": "Solar (flanking the Sun)",
    "description": "Grahas placed in the 2nd and/or 12th from the Sun — Veśi, Vāsi, Ubhayacārī — and the modern-named Budha-Āditya (Sun–Mercury). The Moon and the nodes are excluded from the flanking count. BPHS ch. 38; Phaladīpikā 6.8."
  },
  "lunar": {
    "name": "Lunar (flanking / from the Moon)",
    "description": "Yogas reckoned from the Moon — the flanking set (Sunaphā, Anaphā, Durudharā, Kemadruma), Gaja-Kesarī, Adhi, Śakaṭa, and the Moon–Mars pairing. BPHS ch. 37; Phaladīpikā ch. 6."
  },
  "general": {
    "name": "General auspicious",
    "description": "Auspicious combinations not tied to a single luminary — e.g. Amala, a natural benefic alone in the 10th from the Lagna or the Moon. BPHS ch. 36; Phaladīpikā 6.19."
  },
  "dhana": {
    "name": "Dhana (wealth)",
    "description": "The wealth combinations — BPHS's concrete own-sign and 5th/11th patterns, the modern 2nd/11th lord grid, and Lakṣmī yoga. BPHS ch. 41; Phaladīpikā ch. 6."
  },
  "raja": {
    "name": "Rāja (sovereignty)",
    "description": "The rāja-yogas — kendra–trikoṇa lord sambandha, Dharma-Karmādhipati, the Vipreet inversions (Harṣa/Sarala/Vimala), Nīca-bhaṅga and BPHS's own trika-lord patterns. BPHS chs. 39–40; Laghu Parāśarī."
  },
  "affliction": {
    "name": "Affliction (doṣa / penury)",
    "description": "Doctrines of harm rather than fruit — Kendrādhipati doṣa (benefic kendra lords losing beneficence) and the Daridra penury combinations. Laghu Parāśarī; BPHS ch. 42."
  },
  "exchange": {
    "name": "Parivartana (sign exchange)",
    "description": "The three exchange classes of Phaladīpikā 6.32 — Mahā (favourable-house lords), Khala (with the 3rd lord), and Dainya (a trika lord involved)."
  },
  "modern": {
    "name": "Modern (no classical locus)",
    "description": "Doctrines that arose in twentieth-century popular practice with no śāstra locus, included with their provenance flagged — Kāla-Sarpa. Absent from BPHS, Phaladīpikā, Sārāvalī and Bṛhat Jātaka."
  }
};

export const YOGA_RULES = [
  {
    "id": "ruchaka",
    "name": "Ruchaka Yoga",
    "iast": "Rucaka",
    "family": "mahapurusha",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "Mars",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        },
        "note": "Aries, Scorpio (own/mulatrikona) or Capricorn (exaltation)"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "Mars",
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "BPHS 75.1-2 defines the kendra from the Lagna alone; Phaladipika's own rider (6.4) extends the reckoning to kendras from the Moon as well - the detector should expose the reference point as a setting, defaulting to Lagna"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The texts describe the Ruchaka native as one of the five great-person types: courageous, physically powerful and long-faced, a commander or leader of men who wins renown through bold action and dies remembered.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 75.1-2 (definitions), 75.3-7 (Ruchaka description; ch. 76 is the five-elements chapter, not these yogas)",
      "Phaladipika (tr. Sareen) 6.1 (definition), 6.2 (effects, shared verse with Bhadra, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "bhadra",
    "name": "Bhadra Yoga",
    "iast": "Bhadra",
    "family": "mahapurusha",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "Mercury",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        },
        "note": "Gemini or Virgo (Virgo is own, mulatrikona and exaltation at once)"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "Mercury",
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "same Lagna-vs-Moon reference caveat as Ruchaka"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The Bhadra native is drawn as the intellectual of the five great persons: sharp-minded, learned, eloquent and long-lived, prosperous through his own capability and esteemed by the learned.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 75.1-2 (definitions), 75.8-12 (Bhadra description)",
      "Phaladipika (tr. Sareen) 6.1 (definition), 6.2 (effects, shared verse with Ruchaka, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "hamsa",
    "name": "Hamsa Yoga",
    "iast": "Hamsa",
    "family": "mahapurusha",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "Jupiter",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        },
        "note": "Sagittarius, Pisces (own) or Cancer (exaltation)"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "Jupiter",
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "same Lagna-vs-Moon reference caveat as Ruchaka"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The Hamsa native is the righteous type among the five: fair-bodied, of refined tastes, honoured by rulers, devoted to dharma and inclined to sacred places and learning.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 75.1-2 (definitions), 75.13-16 (Hamsa description)",
      "Phaladipika (tr. Sareen) 6.1 (definition), 6.3 (effects, shared verse with Malavya, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "malavya",
    "name": "Malavya Yoga",
    "iast": "Malavya",
    "family": "mahapurusha",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "Venus",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        },
        "note": "Taurus, Libra (own) or Pisces (exaltation)"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "Venus",
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "same Lagna-vs-Moon reference caveat as Ruchaka"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The Malavya native is the type of comfort and beauty: graceful, well-provided with vehicles, residence and the pleasures of the senses, happy in marriage and family, wealthy without harshness.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 75.1-2 (definitions), 75.17-19 (Malavya description)",
      "Phaladipika (tr. Sareen) 6.1 (definition), 6.3 (effects, shared verse with Hamsa, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "shasha",
    "name": "Shasha Yoga",
    "iast": "Sasa",
    "family": "mahapurusha",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "Saturn",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        },
        "note": "Capricorn, Aquarius (own) or Libra (exaltation)"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "Saturn",
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "same Lagna-vs-Moon reference caveat as Ruchaka"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The Shasha native is the type of stern authority: a headman or chief who commands servants and followers, acquires others' wealth, roams forests and hills in the texts' imagery, and holds power with a hard edge.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 75.1-2 (definitions), 75.20-22 (Sasa description)",
      "Phaladipika (tr. Sareen) 6.1 (definition), 6.4 (effects; the same verse carries the yoga-count grading and the Lagna-or-Moon reckoning rider)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "budha-aditya",
    "name": "Budha-Aditya Yoga",
    "iast": "Budha-Aditya",
    "family": "solar",
    "provenanceNote": "The NAME is late: the Sun-Mercury conjunction carries no yoga-name in the BPHS ch. 36 yoga inventory or the Brhat Jataka; the effects rest on the two-graha yuti literature. Popular manuals also call a strengthened variant Nipuna Yoga. The playlist teaches it under the modern name.",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "Mercury",
          "sameSignAs": "Sun"
        },
        "note": "whole-sign yuti; Mercury is astronomically never far from the Sun, so the bare conjunction is very common - the classical yuti chapters describe the pairing, and combustion of Mercury is assessed separately by the strength module"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The conjunction literature credits the Sun-Mercury pairing with intelligence, skill in service and letters, sweet and persuasive speech, and respect from superiors - the modern manuals amplified this into a named intellect yoga.",
    "cancellations": null,
    "sources": [
      "Saravali (tr. Santhanam 1983) 15.4 (Sun-Mercury two-graha yuti effects)",
      "B.V. Raman, How to Judge a Horoscope (Motilal Banarsidass) - modern witness for the name and popular usage"
    ],
    "contested": null,
    "taughtInPlaylist": true
  },
  {
    "id": "chandra-mangala",
    "name": "Chandra-Mangala Yoga",
    "iast": "Candra-Mangala",
    "family": "lunar",
    "provenanceNote": "As with Budha-Aditya, the compound NAME is a popularization; the classical basis is the Moon-Mars yuti record in the conjunction chapters.",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "Moon",
          "sameSignAs": "Mars"
        },
        "note": "whole-sign yuti; some modern authors extend the yoga to mutual aspect - that extension has no classical yuti locus and is not encoded"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Saravali's Moon-Mars yuti verse describes a valorous, battle-ready native subject to disorders of the blood, who lives by working clay, skins and minerals - an artisan's portrait. The energetic-acquisitiveness reading (enterprise and trade, boldness, a hot temperament turning unscrupulous when afflicted) belongs to the modern manuals that popularized the compound name, not to the yuti verse itself.",
    "cancellations": null,
    "sources": [
      "Saravali (tr. Santhanam 1983) 15.8 (Moon-Mars two-graha yuti effects)",
      "B.V. Raman, How to Judge a Horoscope (Motilal Banarsidass) - modern witness for the name and the enterprise/trade reading"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "sunapha",
    "name": "Sunapha Yoga",
    "iast": "Sunapha",
    "family": "lunar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            2
          ],
          "from": "Moon"
        },
        "note": "any of Mars, Mercury, Jupiter, Venus, Saturn in the 2nd from the Moon"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Sun",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "the Sun never forms these yogas; the nodes are not counted in the classical enumeration"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The texts promise the Sunapha native self-earned property and standing: wealth won by his own intelligence and effort, a reputation approaching rulers', and a composed mind - graded by which graha forms the flank.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 37.7-10",
      "Brhat Jataka (tr. Sastri) 13.3",
      "Phaladipika (tr. Sareen) 6.5 (definition), 6.6 (effects, shared verse with Anapha, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "anapha",
    "name": "Anapha Yoga",
    "iast": "Anapha",
    "family": "lunar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            12
          ],
          "from": "Moon"
        },
        "note": "any of the five taras in the 12th from the Moon"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Sun",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "as in Sunapha"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Anapha is credited with a well-formed body, virtue and renown: the native is described as healthy, well-dressed and contented, of good conduct, with the texts adding a late-life turn toward renunciation in some readings.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 37.7-10",
      "Brhat Jataka (tr. Sastri) 13.3",
      "Phaladipika (tr. Sareen) 6.5 (definition), 6.6 (effects, shared verse with Sunapha, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "durudhara",
    "name": "Durudhara Yoga",
    "iast": "Durudhara",
    "family": "lunar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            2
          ],
          "from": "Moon"
        },
        "note": "one flank"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            12
          ],
          "from": "Moon"
        },
        "note": "and the other - grahas on both sides of the Moon"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Sun",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "as in Sunapha"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "With the Moon flanked on both sides the texts read the fullest form: enjoyments, wealth, vehicles and attendants, a generous disposition, and fame - Varahamihira counts scores of sub-varieties by the flanking pairs.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 37.7-10",
      "Brhat Jataka (tr. Sastri) 13.3-4 (13.4 counts the sub-varieties)",
      "Phaladipika (tr. Sareen) 6.5 (definition), 6.7 (effects, shared verse with Kemadruma, in the 70-sloka wisdomlib witness)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "kemadruma",
    "name": "Kemadruma Yoga",
    "iast": "Kemadruma",
    "family": "lunar",
    "conditions": [
      {
        "type": "exclusion",
        "predicate": {
          "noGraha": {
            "in": [
              1,
              2,
              12
            ],
            "from": "Moon"
          },
          "excluding": [
            "Sun",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "no tara graha with the Moon nor in her 2nd or 12th - the inverse of the Sunapha family; house 1 here means the Moon's own sign (no yuti)"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Kemadruma is the tradition's lunar isolation doctrine: the texts describe the native as deprived and dependent even if born to standing - dirty, sorrowful, doing menial work in the harshest tellings. The cancellation question dominates the later literature.",
    "cancellations": [
      {
        "label": "graha in kendra from the Moon",
        "rule": {
          "type": "placement",
          "predicate": {
            "graha": "any",
            "in": "kendra",
            "from": "Moon",
            "excluding": [
              "Sun",
              "Rahu",
              "Ketu"
            ]
          }
        },
        "source": "Phaladipika (tr. Sareen) 6.5 (the definition verse carries the exception in this witness)",
        "status": "classical"
      },
      {
        "label": "graha in kendra from the Lagna",
        "rule": {
          "type": "placement",
          "predicate": {
            "graha": "any",
            "in": "kendra",
            "from": "Lagna",
            "excluding": [
              "Sun",
              "Rahu",
              "Ketu"
            ]
          }
        },
        "source": "BPHS (tr. Santhanam 1984) 37.11-13 (this recension folds the Lagna-kendra clause into the definition itself)",
        "status": "classical"
      },
      {
        "label": "Moon conjoined with any graha",
        "rule": {
          "type": "placement",
          "predicate": {
            "graha": "any",
            "sameSignAs": "Moon",
            "excluding": [
              "Sun",
              "Rahu",
              "Ketu"
            ]
          }
        },
        "source": "Brhat Jataka (tr. Sastri) ch. 13 (the yoga is denied when the Moon is joined by a graha)",
        "status": "classical"
      },
      {
        "label": "expanded modern lists (benefic aspect on the Moon; Moon exalted, own-sign or in a friendly navamsa; strong Moon in kendra; etc.)",
        "rule": "prose-only - not encoded as predicates; the lists vary author to author",
        "source": "modern manuals and commentaries (e.g. B.V. Raman and later popularizers) - no single classical locus",
        "status": "modern"
      }
    ],
    "sources": [
      "BPHS (tr. Santhanam 1984) 37.11-13",
      "Brhat Jataka (tr. Sastri) 13.3 (definition and the denial clause)",
      "Phaladipika (tr. Sareen) 6.5 (definition), 6.7 (effects, shared verse with Durudhara, in the 70-sloka wisdomlib witness)"
    ],
    "sensitiveNote": "The classical Kemadruma verses describe destitution and social contempt in deliberately harsh terms. They document a medieval doctrine of lunar isolation, not anyone's actual prospects; the system has no demonstrated validity.",
    "contested": {
      "flag": true,
      "topic": "which cancellations belong to the yoga",
      "positions": [
        "Minimalist/classical position: the exceptions are only those the definition verses themselves carry - a graha with the Moon or in kendra (from Moon per Phaladipika's verse as printed; from Lagna per the Santhanam BPHS recension) - and the yoga is otherwise intact.",
        "Expansive/modern position: a long list of bhanga conditions (benefic drishti on the Moon, dignified or bright Moon, Moon in kendra from Lagna, and more) effectively cancels Kemadruma in most charts; this list has no unified classical locus and grew in the modern manuals.",
        "Reference-point split within the classical layer itself: the kendra exception is counted from the Moon in the Phaladipika witness but from the Lagna in the Santhanam BPHS wording - detectors must expose both and pick neither."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "vesi",
    "name": "Vesi Yoga",
    "iast": "Vesi",
    "family": "solar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            2
          ],
          "from": "Sun"
        },
        "note": "any graha other than the Moon (nodes not counted) in the 2nd from the Sun"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Moon",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "the Moon never forms the solar flanking yogas"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The Vesi native is described as even-sighted and truthful, tall of body but indolent and of modest wealth in the BPHS telling, while the Phaladipika's benefic-formed Subhavesi is handsome, meritorious and kingly - the texts split the outcome by whether a benefic or malefic forms the flank.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 38.1 (definition), 38.2-4 (effects; v. 4 grades benefic vs malefic formers)",
      "Phaladipika (tr. Sareen) 6.8 (definitions), 6.9-10 (effects)"
    ],
    "contested": {
      "flag": true,
      "topic": "which grahas count",
      "positions": [
        "BPHS wording (Santhanam 38.1): any graha except the Moon in the 2nd from the Sun forms Vesi, with the fruit graded benefic/malefic afterwards (38.4).",
        "Phaladipika presentation (6.8 as rendered in the Sareen/wisdomlib line): paired named yogas - Subhavesi when benefics other than the Moon flank the Sun, Asubhavesi when malefics do - rather than one yoga graded afterwards."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "vasi",
    "name": "Vasi (Vosi) Yoga",
    "iast": "Vasi",
    "family": "solar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            12
          ],
          "from": "Sun"
        },
        "note": "any graha other than the Moon (nodes not counted) in the 12th from the Sun"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Moon",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "as in Vesi"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Vasi is credited with skill, learning and a good memory, favour with rulers and quiet effectiveness - again split in quality by the benefic or malefic nature of the flanking graha.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 38.1 (definition), 38.2-4 (effects; v. 4 grades benefic vs malefic formers)",
      "Phaladipika (tr. Sareen) 6.8 (definitions), 6.9-10 (effects)"
    ],
    "contested": {
      "flag": true,
      "topic": "which grahas count",
      "positions": [
        "BPHS wording: any non-Moon graha forms the yoga; fruit graded by its nature (38.4).",
        "Phaladipika presentation (6.8): paired Subhavasi/Asubhavasi forms named separately by benefic or malefic formers."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "ubhayachari",
    "name": "Ubhayachari Yoga",
    "iast": "Ubhayacari",
    "family": "solar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            2
          ],
          "from": "Sun"
        },
        "note": "one flank"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            12
          ],
          "from": "Sun"
        },
        "note": "and the other"
      },
      {
        "type": "exclusion",
        "predicate": {
          "excluding": [
            "Moon",
            "Rahu",
            "Ketu"
          ]
        },
        "note": "as in Vesi"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "With the Sun flanked on both sides the native is described as a king or a king's equal: well-built, eloquent, wealthy and widely liked - the strongest of the three solar flanking forms.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 38.1 (definition), 38.2-4 (effects; v. 4 grades benefic vs malefic formers)",
      "Phaladipika (tr. Sareen) 6.8 (definitions), 6.9-10 (effects)"
    ],
    "contested": {
      "flag": true,
      "topic": "which grahas count",
      "positions": [
        "BPHS wording: any non-Moon grahas on both flanks; fruit graded by their nature (38.4).",
        "Phaladipika presentation (6.8): Subhobhayachari with benefics on both flanks, Asubhobhayachari with malefics - named separately."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "adhi",
    "name": "Adhi Yoga",
    "iast": "Adhi",
    "family": "lunar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "benefics",
          "in": [
            6,
            7,
            8
          ],
          "from": "Moon"
        },
        "note": "Mercury, Jupiter and Venus distributed over the 6th, 7th and 8th from the Moon - one, two or all three of those houses occupied by benefics; the more complete the occupation, the higher the stated grade"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The texts grade Adhi yoga's outcome by the number of benefics involved: a minister, a commander, or a king - the native polished, trustworthy, healthy and long-lived, defeating his enemies and enjoying pleasures.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 37.5",
      "Phaladipika (tr. Sareen) 6.42-43",
      "Brhat Jataka (tr. Sastri) ch. 13 (the lunar-yoga chapter carries the doctrine)"
    ],
    "contested": {
      "flag": true,
      "topic": "reference point",
      "positions": [
        "Chandra-Adhi only: BPHS 37.5 states the yoga from the Moon (benefics in the 6th, 7th and 8th from Chandra).",
        "Moon or Lagna: the Phaladipika presentation (6.42-43 as rendered) admits the same configuration counted from the Lagna as well, which later authors split into Lagnadhi and Chandradhi yogas."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "amala",
    "name": "Amala Yoga",
    "iast": "Amala",
    "family": "general",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "benefics",
          "in": [
            10
          ],
          "from": "Moon",
          "orFrom": "Lagna"
        },
        "note": "a natural benefic - and only a benefic - in the 10th from Lagna or from the Moon; BPHS words it as exclusively a benefic there"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Amala (the stainless) is the fame-through-clean-action doctrine: honour from rulers, enduring reputation, prosperity and a virtuous, charitable character lasting to the end of life.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 36.5-6",
      "Phaladipika (tr. Sareen) 6.19"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "shakata",
    "name": "Shakata Yoga",
    "iast": "Sakata",
    "family": "lunar",
    "provenanceNote": "Homonym warning: BPHS ch. 35 defines a DIFFERENT Shakata among the Nabhasa yogas (all grahas in the 1st and 7th). This record encodes the Moon-Jupiter Shakata of the Phaladipika line; the two must never be merged.",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "Moon",
          "in": [
            6,
            8,
            12
          ],
          "from": "Jupiter"
        },
        "note": "the Moon in a dusthana as counted from Jupiter"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Shakata is the cart-wheel doctrine of fluctuating fortune: the native repeatedly loses and regains wealth and standing, lives by ordinary means, and remains obscure despite capability - the classic instability reading.",
    "cancellations": [
      {
        "label": "Moon in a kendra from the Lagna",
        "rule": {
          "type": "placement",
          "predicate": {
            "graha": "Moon",
            "in": "kendra",
            "from": "Lagna"
          }
        },
        "source": "carried inside the definition verse itself - Phaladipika 6.14: no Sakata when the Moon is in a kendra from the Lagna",
        "status": "classical"
      }
    ],
    "sources": [
      "Phaladipika (tr. Sareen) 6.14 (definition, shared verse with Kesari, exception included), 6.17 (effects)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "lakshmi",
    "name": "Lakshmi Yoga",
    "iast": "Laksmi",
    "family": "dhana",
    "conditions": [
      {
        "type": "lordship",
        "predicate": {
          "lordOf": 9,
          "in": "kendra",
          "from": "Lagna"
        },
        "note": "encoded per the BPHS variant; see contested for the Phaladipika variant"
      },
      {
        "type": "strength",
        "predicate": {
          "selector": "lordOf:9",
          "dignity": [
            "own",
            "moolatrikona",
            "exalted"
          ]
        }
      },
      {
        "type": "strength",
        "predicate": {
          "selector": "lordOf:1",
          "dignity": [
            "strong"
          ]
        },
        "note": "the Lagna lord must possess strength - the texts do not quantify; the engine should surface its shadbala rather than gate on a threshold"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Lakshmi yoga is the fortune doctrine par excellence: abundant wealth, beauty of person, virtue and royal regard - the fortunate 9th house's lord empowered in an angle while the self's lord stands strong.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 36.27-28",
      "Phaladipika (tr. Sareen) 6.21"
    ],
    "contested": {
      "flag": true,
      "topic": "definition differs by text",
      "positions": [
        "BPHS 36.27-28 (Santhanam): the 9th lord in a kendra in its own, mulatrikona or exaltation sign, while the Lagna lord is strong.",
        "Phaladipika 6.21 (as rendered in the Sareen/wisdomlib line): the yoga is stated through the 9th lord together with Venus placed in kendra or trikona positions in dignity - a related but not identical condition set; both are encoded as positions, neither is resolved."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "gaja-kesari",
    "name": "Gaja-Kesari Yoga",
    "iast": "Gaja-Kesari",
    "family": "lunar",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "Jupiter",
          "in": "kendra",
          "from": "Moon"
        },
        "note": "the bare rule - the shared core of every witness; the strength riders are contested and must be evaluated per position, never merged into one boolean"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The elephant-lion yoga promises eminence: the native is described as illustrious, intelligent and virtuous, splendid in assembly, with a reputation that endures - the texts reach for regal imagery to grade its force.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.14 (bare definition, sharing the verse with Shakata; effects at 6.16)",
      "BPHS (tr. Santhanam 1984) 36.3-4 (conditioned definition)",
      "Jataka Parijata (tr. V.S. Sastri) 7.116 (bare kendra-from-Moon definition; a second, conditioned formation follows in the adjacent verses)"
    ],
    "contested": {
      "flag": true,
      "topic": "strength conditions - the dispute the playlist's own session 124 engages",
      "positions": [
        "Bare rule (Phaladipika 6.14): Jupiter in a kendra from the Moon suffices; nothing more is asked.",
        "Conditioned rule (BPHS 36.3-4, Santhanam): Jupiter in a kendra from the Lagna OR the Moon, joined to or aspected by a benefic, and free of debilitation, combustion and placement in an inimical sign - a far rarer configuration.",
        "Jataka Parijata (ch. 7): two formations - 7.116's bare Jupiter-in-kendra-from-Moon rule, and an alternative in which the Moon is aspected by Mercury, Venus or Jupiter with the aspecting graha free of debilitation and combustion; the conditioned alternative is what modern critics of the bare rule cite.",
        "Modern-critical position (mirrored by the playlist teacher's session-124 critique): the bare form occurs in roughly a quarter of all charts, so only the conditioned forms are held meaningful by strictness-minded practitioners - while popular practice continues to report the bare form."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "harsha",
    "name": "Harsha Yoga (Vipreet Raja I)",
    "iast": "Harsa",
    "family": "raja",
    "conditions": [
      {
        "type": "lordship",
        "predicate": {
          "lordOf": 6,
          "in": "trika",
          "from": "Lagna"
        },
        "note": "the 6th lord in the 6th, 8th or 12th - the common-core reading; the exact house set varies by witness (see contested)"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The inverted raja doctrine: the lord of enmity placed in a house of loss is read as loss-of-loss - happiness, a sound body, victory over enemies, reluctance toward wrongdoing, and the friendship of the prominent.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.57 (the rule verse naming all twelve trika-lord yogas, Harsha sixth among them), 6.63 (Harsha effects) in the 70-sloka chapter",
      "Uttara Kalamrta (tr. V.S. Sastri) 4.22 (trika lords jointly or severally in the trika houses, connected with them, or in mutual exchange - with the verse's own proviso that they have no connection with lords outside the trika set)"
    ],
    "contested": {
      "flag": true,
      "topic": "exact condition set and the association rider",
      "positions": [
        "Popular/common-core reading: the 6th lord in any of the 6th, 8th or 12th houses forms Harsha.",
        "Phaladipika 6.57's rule clause: the yoga also arises when the 6th house itself is associated with or aspected by malefics - wider than the clean trika-in-trika grid; 6.63 carries only the effects.",
        "Uttara Kalamrta 4.22: the trika lords occupying the trika houses jointly or severally, connected with those houses, or exchanging among them yield the inverted raja yoga - PROVIDED, in the verse's own rendering, that those lords have no connection with planets owning houses outside the trika set.",
        "The popular mutual-relation hardening - that the trika lords must be conjoined, in mutual aspect or in exchange with EACH OTHER before the yoga fructifies - circulates under Uttara Kalamrta's name but generalizes beyond the verse, which asks only the no-outside-lord proviso; flagged, not encoded."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "sarala",
    "name": "Sarala Yoga (Vipreet Raja II)",
    "iast": "Sarala",
    "family": "raja",
    "conditions": [
      {
        "type": "lordship",
        "predicate": {
          "lordOf": 8,
          "in": "trika",
          "from": "Lagna"
        },
        "note": "the 8th lord in the 6th, 8th or 12th - witnesses differ on whether the 8th itself counts (see contested)"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Sarala is read as steadfastness through the house of crisis: long life, resolution and fearlessness, learning and children, success over opposition, and wide repute.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.57 (rule verse; Sarala eighth in the twelve), 6.65 (Sarala effects)",
      "Uttara Kalamrta (tr. V.S. Sastri) 4.22"
    ],
    "contested": {
      "flag": true,
      "topic": "exact house set and the association rider",
      "positions": [
        "Phaladipika 6.57's grid: the 8th lord in the 6th, the 8th or the 12th forms Sarala (6.65 gives the effects); Uttara Kalamrta 4.22 likewise admits any trika placement, own house included.",
        "The compressed popular grid: the 8th lord in the 6th or the 12th only - own-house placement excluded; this restriction is the manual tradition's, not either verse's.",
        "Uttara Kalamrta's no-outside-lord proviso and the popular mutual-relation hardening apply here exactly as under Harsha."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "vimala",
    "name": "Vimala Yoga (Vipreet Raja III)",
    "iast": "Vimala",
    "family": "raja",
    "conditions": [
      {
        "type": "lordship",
        "predicate": {
          "lordOf": 12,
          "in": "trika",
          "from": "Lagna"
        },
        "note": "the 12th lord in the 6th, 8th or 12th - the common-core reading; witnesses differ (see contested)"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Vimala (the spotless) is read as loss contained: the native spends little and saves much, deals kindly with all, holds a respectable occupation, and is known for independence and good qualities.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.57 (rule verse; Vimala twelfth in the twelve), 6.69 (Vimala effects)",
      "Uttara Kalamrta (tr. V.S. Sastri) 4.22"
    ],
    "contested": {
      "flag": true,
      "topic": "exact condition set and the association rider",
      "positions": [
        "Popular grid: the 12th lord in the 6th or the 8th only; Uttara Kalamrta 4.22 by contrast admits any trika placement, the 12th itself included.",
        "Phaladipika 6.57's rule clause: the yoga also arises when the 12th house itself is associated with or aspected by malefics - again wider than the clean grid; 6.69 carries only the effects.",
        "Uttara Kalamrta's no-outside-lord proviso and the popular mutual-relation hardening apply as under Harsha."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "neecha-bhanga",
    "name": "Neecha-Bhanga Raja Yoga",
    "iast": "Nica-bhanga",
    "family": "raja",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "graha": "any",
          "dignity": [
            "debilitated"
          ]
        },
        "note": "TRIGGER ONLY - some graha stands in its debilitation sign. The cancellation/raja conditions are contested three ways; the engine must evaluate each contested position as its own labelled condition set and never emit a single present/absent boolean for this yoga."
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The doctrine of cancelled debilitation: a fallen graha whose fall is undone is claimed to raise the native higher than an unafflicted one would - the texts reach for the image of a sovereign born of reversal. Which mechanism undoes the fall is exactly what the three texts do not agree on.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 39.19-20 and 39.28",
      "Phaladipika (tr. Sareen) 7.26-30 (the Nichabhanga raja-yoga block)",
      "Jataka Parijata (tr. V.S. Sastri) ch. 7 (nica-bhanga slokas; verse numbering differs across printings of the Sastri translation - chapter-level cite kept deliberately)"
    ],
    "contested": {
      "flag": true,
      "topic": "three divergent condition sets - encode all, pick none",
      "positions": [
        "BPHS position (39.19-20, 39.28 Santhanam): not a cancellation formula at all - 39.19 raises a raja yoga from debilitated grahas occupying the 3rd, 6th and 8th houses while the Lagna lord, exalted or in own sign, aspects the Lagna; 39.20 from the 6th, 8th and 12th LORDS in fall, inimical sign or combustion under the same dignified-lagnesha condition; and 39.28 lets even one debilitated trika lord aspecting the Lagna suffice. BPHS has no dispositor-kendra formula.",
        "Phaladipika position (7.26-30): the debilitation is cancelled when the dispositor of the fallen graha, or the lord of its exaltation sign, stands in a kendra from the Lagna or the Moon; the result rises to raja grade when the configuration centres on kendras, and aspect of the fallen graha by its own dispositor is also given as a cancelling mechanism.",
        "Jataka Parijata position (ch. 7): the lord of the sign occupied by the fallen graha, or the graha that would be exalted in that sign, placed in a kendra from the Lagna or the Chandra-lagna, cancels the debilitation.",
        "Popular composite (flagged, no single classical locus): modern lists add mutual exchange between the fallen graha and its dispositor, and mutual aspect of two debilitated grahas - commentarial accretions that circulate attached to all three texts' names."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "kendradhipati-dosha",
    "name": "Kendradhipati Dosha",
    "iast": "Kendradhipati dosa",
    "family": "affliction",
    "conditions": [
      {
        "type": "lordship",
        "predicate": {
          "grahaIn": [
            "Jupiter",
            "Venus",
            "Mercury",
            "Moon"
          ],
          "lordsHouse": "kendra",
          "from": "Lagna"
        },
        "note": "a natural benefic owning a kendra (the 4th, 7th or 10th; the 1st is treated separately as both kendra and trikona). The doctrine grades severity: Jupiter and Venus worst affected, Mercury less, the Moon least."
      }
    ],
    "allConditionsRequired": true,
    "fruit": "An affliction rule, not a yoga of fruit: the functional-benefic doctrine holds that natural benefics owning kendras lose their disposition to do good (and natural malefics so placed lose their disposition to harm) - the blemish sharpens when the benefic also occupies a kendra or gains maraka connections.",
    "sensitiveNote": "The doctrine ties benefic kendra lords to maraka (death-significator) capacity in the classical scheme. That is recorded as textual doctrine only; it predicts nothing about anyone's health or lifespan.",
    "cancellations": [
      {
        "label": "simultaneous trikona lordship or trikona connection",
        "rule": "the kendra lord also owning or strongly connected to a trikona regains its capacity for good - this is the same doctrine's yogakaraka face",
        "source": "Laghu Parasari, samjna-adhyaya (the kendra/trikona sutras)",
        "status": "classical"
      }
    ],
    "sources": [
      "Laghu Parasari (dual-text eds.), samjna-adhyaya slokas on kendra lords and the dosha (slokas 9-10 in the O.P. Verma line; some editions count the block at 6-7 - numbering varies and is flagged)",
      "Uttara Kalamrta (tr. V.S. Sastri), kanda 4 (the counter-position as read by modern commentators)"
    ],
    "contested": {
      "flag": true,
      "topic": "scope of the dosha - Laghu Parasari vs Uttara Kalamrta",
      "positions": [
        "Laghu Parasari position: benefics owning kendras categorically lose beneficence, Jupiter and Venus most of all - the pair is even said to acquire maraka capacity when kendra lordship combines with maraka placement; the blemish is structural, cancelled only through trikona connection.",
        "Uttara Kalamrta position (as modern commentators read kanda 4): benefic kendra lords are not thereby spoiled - in stated placements (the 2nd, 3rd, 11th and the kendras themselves in the commonly cited reading) they continue to give good results, restricting the dosha to a far narrower case.",
        "Numbering caveat held with the dispute: the Laghu Parasari sloka count for this block differs across printings (9-10 vs 6-7), so the citation is carried at block level, both numbers shown."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "raja-kendra-trikona-sambandha",
    "name": "Raja Yoga (Kendra-Trikona Sambandha)",
    "iast": "Rajayoga (kendra-trikona-sambandha)",
    "family": "raja",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:kendra",
            "lordOf:trikona"
          ],
          "sambandha": [
            "yuti",
            "mutualDrishti",
            "parivartana"
          ]
        },
        "note": "the lord of any kendra (1,4,7,10) and the lord of any trikona (1,5,9) in mutual relation; evaluated over all kendra-trikona lord pairs. The admissible sambandha list is itself contested - see below."
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The core Parasari raja doctrine: when the pillars (kendras) and the fortunes (trikonas) join hands through their lords, the texts claim rank, authority and rising fortune in the periods of the grahas concerned.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) ch. 39 (the raja-yoga chapter; vv. 33-38 carry the kendra-lord-with-trikona-lord association patterns - v. 37 is the angular-lord-joins-trinal-lord rule)",
      "Laghu Parasari (dual-text eds.), yoga-adhyaya (the kendra-trikona lord relation as the yoga-giving mechanism)"
    ],
    "contested": {
      "flag": true,
      "topic": "what counts as sambandha",
      "positions": [
        "Strict school (the Laghu Parasari line as commonly expounded): only full relations count - conjunction, mutual aspect, or exchange of signs between the two lords.",
        "Loose/modern school: one-way aspect, mutual kendra placement, or mere association through occupancy of each other's houses are also admitted, multiplying detected raja yogas - the detector ships the strict set as data and flags the loose extensions rather than encoding them."
      ]
    },
    "taughtInPlaylist": true
  },
  {
    "id": "raja-dharma-karma-adhipati",
    "name": "Dharma-Karmadhipati Yoga",
    "iast": "Dharma-Karmadhipati",
    "family": "raja",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:9",
            "lordOf:10"
          ],
          "sambandha": [
            "yuti",
            "mutualDrishti",
            "parivartana"
          ]
        },
        "note": "the premier instance of the kendra-trikona rule: the 9th (dharma) and 10th (karma) lords related"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The tradition singles out the 9th-10th lords' union as the highest of the lordship raja yogas: fortune joined to action - the texts claim great authority, achievement and fame under its periods.",
    "cancellations": null,
    "sources": [
      "Laghu Parasari (dual-text eds.), yoga-adhyaya (the dharma-karma-adhipati doctrine's locus classicus)",
      "Phaladipika (tr. Sareen) 6.37 (the 9th and 10th lords conjoined in an auspicious bhava constitute Raja yoga)",
      "B.V. Raman, How to Judge a Horoscope (Motilal Banarsidass) - modern witness for the yoga's popular primacy"
    ],
    "contested": null,
    "taughtInPlaylist": true
  },
  {
    "id": "raja-lagnesha-panchamesha",
    "name": "Raja Yoga (Lagna-Putra Lords' Exchange)",
    "iast": "Rajayoga (lagnesa-pancamesa-parivartana)",
    "family": "raja",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:1",
            "lordOf:5"
          ],
          "sambandha": [
            "parivartana",
            "yuti"
          ]
        },
        "note": "BPHS 39.6-7 states the exchange of the Lagna lord and the 5th lord (or the atmakaraka and putrakaraka dignified in the 1st/5th with benefic aspect) as a great raja yoga; the karaka variant is noted, not encoded - it needs the Jaimini karaka module"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The self's lord and the lord of intelligence and merit exchanging places is stated by BPHS as a maha-raja configuration: the native rises to rule or its modern equivalents in the tradition's claim.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 39.6-7"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "raja-neecha-trika",
    "name": "Raja Yoga (Debilitated Trika Lords)",
    "iast": "Rajayoga (nica-trika)",
    "family": "raja",
    "conditions": [
      {
        "type": "strength",
        "predicate": {
          "grahaIn": [
            "lordOf:6",
            "lordOf:8",
            "lordOf:12"
          ],
          "dignity": [
            "debilitated"
          ]
        },
        "note": "one or more of the trika lords debilitated - 39.20 admits fall, inimical sign or combustion; 39.28 lets even one debilitated trika lord aspecting the Lagna suffice; the parallel 39.19 pattern uses debilitated OCCUPANTS of the 3rd, 6th and 8th instead"
      },
      {
        "type": "strength",
        "predicate": {
          "selector": "lordOf:1",
          "dignity": [
            "own",
            "exalted"
          ]
        }
      },
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:1",
            "house:1"
          ],
          "sambandha": [
            "drishti"
          ]
        },
        "note": "the strong Lagna lord casts its aspect upon the Lagna"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "BPHS's own inversion doctrine: the lords of hardship laid low while the self's lord stands in dignity watching over the Lagna - the text claims kingship-grade results from the very weakness of the difficult houses. This is also the BPHS position inside the Neecha-Bhanga dispute (cross-reference: neecha-bhanga).",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 39.19-20 and 39.28"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "dhana-svakshetra-lagna",
    "name": "Dhana Yoga (Own-Sign Graha in Lagna)",
    "iast": "Dhanayoga (svaksetra-lagna)",
    "family": "dhana",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            1
          ],
          "from": "Lagna"
        }
      },
      {
        "type": "strength",
        "predicate": {
          "graha": "same",
          "dignity": [
            "own"
          ]
        },
        "note": "the graha stands in its own sign rising"
      },
      {
        "type": "relation",
        "predicate": {
          "between": [
            "graha:same",
            "designatedSupporters"
          ],
          "sambandha": [
            "yuti",
            "drishti"
          ]
        },
        "note": "BPHS assigns each Lagna-graha its own supporting pair whose conjunction or aspect completes the yoga - the per-graha table (e.g. the Sun in Leo Lagna supported by Mars and Jupiter; the Moon in Cancer by Mercury and Jupiter; Mars in his own rising sign by Mercury, Venus and Saturn; and so on per 41.9-15) belongs in the engine's data table, not in prose"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "BPHS's concrete wealth grammar: a graha rising in its own sign, seconded by its designated allies, is claimed to make the native wealthy in the graha's own idiom - each pairing carries its own flavour of affluence in the text.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 41.9-15"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "dhana-putra-labha",
    "name": "Dhana Yoga (5th-11th Axis Patterns)",
    "iast": "Dhanayoga (putra-labha)",
    "family": "dhana",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "graha": "any",
          "in": [
            5
          ],
          "from": "Lagna"
        }
      },
      {
        "type": "strength",
        "predicate": {
          "graha": "same",
          "dignity": [
            "own"
          ]
        },
        "note": "a graha in its own sign in the 5th"
      },
      {
        "type": "placement",
        "predicate": {
          "graha": "designatedPartner",
          "in": [
            11
          ],
          "from": "Lagna"
        },
        "note": "BPHS pairs each 5th-house graha with named grahas whose presence in the 11th completes the yoga (per-graha table from 41.2-8 - e.g. Venus in own 5th with Mars in the 11th; Mercury in own 5th with Moon, Mars and Jupiter in the 11th; and the parallel patterns for Sun, Moon, Jupiter, Mars, Saturn)"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The 5th-11th axis is the tradition's merit-and-gain circuit: BPHS's opening wealth combinations run a dignified graha in the house of merit against its partners in the house of gains, claiming great affluence when the circuit closes.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 41.2-8"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "dhana-lords-sambandha",
    "name": "Dhana Yoga (Wealth Lords in Sambandha)",
    "iast": "Dhanayoga (dhanesa-labhesa-sambandha)",
    "family": "dhana",
    "provenanceNote": "The abstract grid - 2nd/11th lords related to each other or to the 1st/5th/9th lords - is a MODERN systematization (Raman and the manual tradition) distilled from scattered classical instances. BPHS ch. 41 gives concrete graha patterns and names the 5th and 9th lords as wealth-givers (41.16); it never states the abstract lord-grid. The provenance split is carried here honestly.",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:2",
            "lordOf:11"
          ],
          "sambandha": [
            "yuti",
            "mutualDrishti",
            "parivartana"
          ]
        },
        "note": "evaluated pairwise over the wealth-lord set {2, 11} against itself and against {1, 5, 9}; any closed pairing is reported with its pair label"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The systematized wealth doctrine: the lords of accumulation (2nd) and gains (11th) joined to each other or to the lords of self and fortune are claimed to produce wealth in their joint periods - BPHS's own kernel is that grahas joined to the 5th and 9th lords bestow wealth during their dashas.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 41.16 (the 5th/9th lords as wealth-bestowers - the classical kernel)",
      "B.V. Raman, How to Judge a Horoscope (Motilal Banarsidass) - modern witness for the generalized 2/11 lord grid"
    ],
    "contested": null,
    "taughtInPlaylist": true
  },
  {
    "id": "daridra-lagnesha-trika-exchange",
    "name": "Daridra Indicators (Penury Combinations)",
    "iast": "Daridrayoga",
    "family": "affliction",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:1",
            "lordOf:12"
          ],
          "sambandha": [
            "parivartana"
          ]
        },
        "note": "the Lagna lord in the 12th while the 12th lord holds the Lagna (BPHS 42.2); the parallel 42.3 pattern swaps in the 6th lord - the engine should evaluate both pairs"
      },
      {
        "type": "relation",
        "predicate": {
          "between": [
            "exchangePair",
            "maraka"
          ],
          "sambandha": [
            "yuti",
            "drishti"
          ]
        },
        "note": "BPHS attaches the condition that the pattern be tied to a maraka graha (the 2nd/7th lords' doctrine of ch. 44) by association or aspect"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The penury chapter is the tradition's mirror-image of its wealth grammar: the self's lord sunk in loss (or enmity) while the lord of loss seizes the self, under a maraka's shadow, is claimed to strip means and reduce the native to want - described here as doctrine, with the site's standing caveat at full strength.",
    "sensitiveNote": "The penury combinations are bleak by design - the tradition's deliberate mirror of its wealth grammar, entangled with the maraka (death-significator) scheme. They are recorded as historical doctrine; they forecast nothing about any person's finances or life.",
    "cancellations": null,
    "sources": [
      "BPHS (tr. Santhanam 1984) 42.2-3 (further penury patterns follow through the chapter)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "parivartana-maha",
    "name": "Maha Parivartana Yoga",
    "iast": "Maha-parivartana",
    "family": "exchange",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:A",
            "lordOf:B"
          ],
          "sambandha": [
            "parivartana"
          ],
          "houseSets": {
            "A": [
              1,
              2,
              4,
              5,
              7,
              9,
              10,
              11
            ],
            "B": [
              1,
              2,
              4,
              5,
              7,
              9,
              10,
              11
            ]
          }
        },
        "note": "both exchanging lords own houses from the favourable set {1,2,4,5,7,9,10,11}; 28 possible pairs. Exchange = each graha occupies a sign owned by the other."
      }
    ],
    "allConditionsRequired": true,
    "fruit": "Phaladipika's threefold exchange classification puts the favourable-house exchanges highest: the two lords are read as acting from each other's seats with full mutual support - position, means and authority flowing during their joint periods.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.32 (the parivartana classification verse: 28 Maha, 8 Khala, 30 Dainya)"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "parivartana-khala",
    "name": "Khala Parivartana Yoga",
    "iast": "Khala-parivartana",
    "family": "exchange",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:3",
            "lordOf:B"
          ],
          "sambandha": [
            "parivartana"
          ],
          "houseSets": {
            "B": [
              1,
              2,
              4,
              5,
              7,
              9,
              10,
              11
            ]
          }
        },
        "note": "the 3rd lord exchanging with a lord from the favourable set; 8 possible pairs"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The khala (mischievous) exchanges are read as uneven: the classification claims alternation - phases of boldness, gain and standing giving way to reverses and misconduct, then recovering - the 3rd house's mixed nature stamped on both lords.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.32"
    ],
    "contested": null,
    "taughtInPlaylist": false
  },
  {
    "id": "parivartana-dainya",
    "name": "Dainya Parivartana Yoga",
    "iast": "Dainya-parivartana",
    "family": "exchange",
    "conditions": [
      {
        "type": "relation",
        "predicate": {
          "between": [
            "lordOf:A",
            "lordOf:B"
          ],
          "sambandha": [
            "parivartana"
          ],
          "houseSets": {
            "A": [
              6,
              8,
              12
            ],
            "B": [
              1,
              2,
              3,
              4,
              5,
              7,
              9,
              10,
              11,
              6,
              8,
              12
            ]
          }
        },
        "note": "any exchange in which a trika lord (6th, 8th or 12th) takes part; 30 possible pairs"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The dainya (wretched) exchanges are the classification's troubled class: a dusthana lord drawn into the exchange is read as importing struggle - obstacles, censure and strain in the affairs of both houses involved, whatever else the chart promises.",
    "cancellations": null,
    "sources": [
      "Phaladipika (tr. Sareen) 6.32"
    ],
    "contested": {
      "flag": true,
      "topic": "overlap with the Vipreet doctrine",
      "positions": [
        "Phaladipika's classification reads every trika-lord exchange as dainya - troubled.",
        "The Vipreet Raja doctrine (Harsha/Sarala/Vimala and UK 4.22's exchange clause) reads certain trika-lord placements and exchanges among the trika houses as auspicious inversions. Where a 6th-8th, 6th-12th or 8th-12th exchange occurs, the two doctrines collide head-on; the detector reports both readings side by side and resolves nothing."
      ]
    },
    "taughtInPlaylist": false
  },
  {
    "id": "kala-sarpa",
    "name": "Kala-Sarpa Yoga",
    "iast": "Kala-sarpa",
    "family": "modern",
    "provenanceNote": "MODERN YOGA - flagged per house rules. No definition exists in BPHS (chs. 35-42 and 75 yoga chapters checked in the Santhanam recension), Phaladipika ch. 6-7, Saravali or Brhat Jataka. The doctrine rose in twentieth-century popular practice; printed debate clusters in the Astrological Magazine columns of the late 1970s-80s. It is included because the modern detector user will look for it; its record must always render with this provenance label.",
    "conditions": [
      {
        "type": "placement",
        "predicate": {
          "grahas": [
            "Sun",
            "Moon",
            "Mars",
            "Mercury",
            "Jupiter",
            "Venus",
            "Saturn"
          ],
          "withinArc": {
            "from": "Rahu",
            "to": "Ketu"
          }
        },
        "note": "all seven classical grahas hemmed on one side of the nodal axis (the arc from Rahu forward to Ketu in zodiacal order, per the commonest modern statement)"
      },
      {
        "type": "exclusion",
        "predicate": {
          "noGraha": {
            "outsideArc": true
          },
          "excluding": [
            "Rahu",
            "Ketu"
          ]
        },
        "note": "strict form: not even one graha outside; the popular half-yoga concession for a single straggler is a further modern variant"
      }
    ],
    "allConditionsRequired": true,
    "fruit": "The modern doctrine claims a life squeezed by the serpent of time - obstruction, dramatic rises and falls, and unrest - lifted after remedial observance in the marketing register this site never reproduces. Recorded purely as a description of the modern claim.",
    "sensitiveNote": "Kala-Sarpa is the yoga most often used to frighten people into buying remedies. It has no classical locus, no agreed definition and no demonstrated validity; this record exists to document the claim and its twentieth-century provenance, not to endorse it.",
    "cancellations": [
      {
        "label": "modern relief lists (a graha with the nodes, kendra dignities, the yoga 'breaking' by degree within the terminal signs, etc.)",
        "rule": "prose-only; no two modern authors agree on the list",
        "source": "modern popular literature only",
        "status": "modern"
      }
    ],
    "sources": [
      "Absent from BPHS (tr. Santhanam 1984), Phaladipika (tr. Sareen), Saravali (tr. Santhanam 1983) and Brhat Jataka (tr. Sastri) - the absence is the citable fact",
      "Modern popular literature and the Astrological Magazine debate columns (late 1970s-80s) - the doctrine's actual provenance layer"
    ],
    "contested": {
      "flag": true,
      "topic": "provenance and definition",
      "positions": [
        "Advocacy position (modern practice): Kala-Sarpa is a major affliction deserving detection and remediation; variant schools distinguish Kala-Sarpa (grahas moving toward Rahu / on the Rahu-to-Ketu side) from Kala-Amrita (the reverse), and full from partial forms.",
        "Skeptical position (classically grounded modern jyotishis): the yoga has no sastra locus whatever - Parasara, Varahamihira, Kalyanavarman and Mantresvara are silent - and a doctrine without a text cannot claim classical authority; some reject the yoga outright.",
        "Definitional instability even within advocacy: sign-based vs degree-based hemming, whether the Lagna outside the arc cancels, and which nodal direction defines which name are all answered differently by different modern authors."
      ]
    },
    "taughtInPlaylist": false
  }
];

export default { YOGA_META, YOGA_FAMILIES, YOGA_RULES };
