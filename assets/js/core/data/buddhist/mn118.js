// ============================================================================
//  core/data/buddhist/mn118.js  —  GENERATED, DO NOT HAND-EDIT.
//  Regenerate: node r30build/gen-buddhist.cjs (reads r29data/*.json verbatim).
//
//  The Ānāpānassati Sutta (Mindfulness of Breathing), Majjhima Nikāya 118 — word-by-word.
//  Root Pāli: Mahāsaṅgīti Tipiṭaka via SuttaCentral (declared PD) — cc0.
//  Translation: Bhikkhu Sujato, The Middle Discourses (SuttaCentral, CC0) — VERBATIM
//  (9 segments carry translation.text === "" where Sujato folds the sense into an
//  adjacent segment — preserved, not nulled, to keep the segment ids 1:1).
//  PEYYĀLA MODEL: 105 full records + 49 refrain-use records over 6 refrains.
//  A refrain-use carries {kind:"refrain-use", refrain, substitutions}; expand it with
//  the refrain template (see core/buddhist.js expandRefrain). MN118_SUBSTITUTION_GLOSSES
//  glosses the sixteen-aspect object forms that occur only inside substitution slots.
//  Reconstruction: full → words[].w.join(" ") === pali; refrain-use → expand === pali.
//  DOM-free pure data.
// ============================================================================

export const MN118_META = {
  "title": "Ānāpānassati Sutta — Mindfulness of Breathing (Majjhima Nikāya 118)",
  "ref": "MN 118",
  "source": {
    "pali": "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, Bangkok, 2005), Roman-script edition, via SuttaCentral bilara-data, branch \"published\", file root/pli/ms/sutta/mn/mn118_root-pli-ms.json (fetched 2026-07-17).",
    "translation": "Bhikkhu Sujato, \"The Middle Discourses\" (SuttaCentral, 2018-), bilara-data file translation/en/sujato/sutta/mn/mn118_translation-en-sujato.json (fetched 2026-07-17)."
  },
  "licenceQuotes": {
    "sujato_translation": "bilara-data LICENSE.md (branch \"published\"): \"All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.\" Also suttacentral.net/licensing (licensing:6): \"All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).\"",
    "pali_root": "suttacentral.net/licensing (licensing:24): \"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other languages are in the public domain. Such material does not fall within the scope of copyright.\" (SuttaCentral distributes the Mahāsaṅgīti edition under the CC Public Domain Mark.)",
    "ped": "PTS Pali-English Dictionary (Rhys Davids & Stede, 1921–25) is US public domain (pre-1931). Glosses here are ORIGINAL prose informed by PED (cited by headword) and lookup-verified against the Digital Pāḷi Dictionary (CC BY-NC-SA — verification instrument only, never copied).",
    "ai_request": "SuttaCentral (licensing:27) politely requests its content not be scraped for generative-AI datasets. This is a hand-curated, attributed, human-verified study edition, encoded by hand from the cited files, carrying prominent attribution and linkbacks — offered as good-faith compliance with that request."
  },
  "conventions": {
    "ref": "ref = SuttaCentral Bilara segment id (e.g. \"mn118:17.2\"), the community-standard citation grain, 1:1 with both the Pāli root and Sujato's translation.",
    "reconstruction": "RECONSTRUCTION INVARIANT: for every full record, the space-join of words[].w exactly equals the trimmed-NFC pali. For every refrain-use, the space-join of the refrain template expanded with its substitutions exactly equals the pali. Both are asserted at build time (this file emits only if all 154 pass).",
    "surfaceTokens": "words[].w holds the EXACT whitespace-delimited surface token, including any attached punctuation and quotation marks (e.g. \"assasissāmī’ti\", \"‘sabbakāyapaṭisaṁvedī\", \"sikkhati;\"). No sandhi-splitting is done to w; where a token fuses two words by sandhi or carries the quotative iti, the split is explained in the gloss and gram (e.g. \"assasāmī’ti\" = assasāmi + iti). This keeps reconstruction purely mechanical.",
    "compounds": "Compounds are kept as a single w token; their members are resolved inside the gloss in parentheses (e.g. \"abhijjhādomanassaṁ\" → \"covetousness-and-displeasure (abhijjhā + domanassa)\").",
    "ped": "ped = \"PED s.v. <headword>\" citing the PTS Pali-English Dictionary headword, or null for personal/place names, title words, and the editorial ellipsis markers.",
    "peyyala": "PEYYĀLA MODEL: six repeating frames are glossed ONCE in refrains[] with named substitution slots. Segments that instantiate a frame are stored as {kind:\"refrain-use\", refrain, substitutions} with NO re-glossed word table; the reader expands them on demand. Slots are named (PH1, LAST, ANUP, FAC, ELL, …) rather than single-word keys, because MN 118's varying parts are multi-word phrases and punctuation — a documented variance from the plan's single-word substitution example (§3.4). substitutions store surface tokens; each is glossed via the same dictionary as full records, so no word is glossed twice. The Pāli tradition's own \"…pe…\" (peyyāla) is the precedent, and is itself preserved as tokens in the §14/§42 abbreviated list-items.",
    "cruxes": "Translator/commentary disagreements (assasati/passasati direction; sabbakāyapaṭisaṁvedī = whole physical body vs breath-body; kāyesu kāyaññatara) are flagged both-ways in note fields and in keyFindings — described, never resolved.",
    "substitutionGlosses": "substitutionGlosses[] glosses the meditation-object forms that occur ONLY inside refrain-use substitution slots (the sixteen-aspects objects). In the peyyāla model these varying tokens are not repeated in any words[] table, so they are glossed once here (keyed by surface form, quotes/punctuation stripped) — making every one of the 348 unique corpus forms glossed in the shipped file itself, not merely in the build dictionary. Added by the R29 adversarial verification pass."
  },
  "counts": {
    "segments": 154,
    "fullRecords": 105,
    "refrainUseRecords": 49,
    "refrains": 6,
    "paliTokensTotal": 1551,
    "glossedWordTokens_fullRecords": 1184,
    "glossedWordTokens_refrainSamples": 50,
    "uniqueFormsGlossed": 348,
    "glossDictionaryEntries": 350,
    "missingGlosses": 0,
    "substitutionOnlyFormsGlossed": 13,
    "uniqueFormsGlossedInShippedFile": 348
  }
};

export const MN118_REFRAINS = [
  {
    "id": "mn118-sikkhati",
    "kind": "refrain",
    "label": "The training-step frame (peyyāla of the sixteen aspects)",
    "desc": "Each meditation aspect is trained with an identical bipartite frame: \"…I will breathe in… / …I will breathe out…, so one trains.\" Only the meditation-object phrase (slot PH1/PH2) and the final punctuation (slot LAST) vary. Fourteen of the sixteen steps use this frame; it recurs in the four-tetrad section (24–27).",
    "template": [
      {
        "slot": "PH1"
      },
      {
        "t": "assasissāmī’ti"
      },
      {
        "t": "sikkhati,"
      },
      {
        "slot": "PH2"
      },
      {
        "t": "passasissāmī’ti"
      },
      {
        "slot": "LAST"
      }
    ],
    "slots": {
      "PH1": "the meditation-object qualifier as it appears before the in-breath verb (may be sentence-initial capital, carries the opening quote ‘)",
      "PH2": "the same qualifier before the out-breath verb (lower-case, carries ‘)",
      "LAST": "the closing \"sikkhati\" token with its punctuation (\";\" mid-tetrad, \".\" tetrad-final)"
    },
    "samplePali": "‘sabbakāyapaṭisaṁvedī assasissāmī’ti sikkhati, ‘sabbakāyapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "sampleRef": "mn118:18.3",
    "sampleTranslation": "They practice like this: ‘I’ll breathe in experiencing the whole body.’ They practice like this: ‘I’ll breathe out experiencing the whole body.’",
    "sampleSubstitutions": {
      "PH1": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "PH2": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "words": [
      {
        "w": "‘sabbakāyapaṭisaṁvedī",
        "gloss": "experiencing the whole body (Sujato) — CRUX: comy reads kaya as the \"breath-body\", i.e. the whole length of the breath; moderns read the entire physical body",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "assasissāmī’ti",
        "gloss": "(assasissami + iti) \"I shall breathe in\" + quotative",
        "gram": "fut. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "sikkhati,",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      },
      {
        "w": "‘sabbakāyapaṭisaṁvedī",
        "gloss": "experiencing the whole body (Sujato) — CRUX: comy reads kaya as the \"breath-body\", i.e. the whole length of the breath; moderns read the entire physical body",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "passasissāmī’ti",
        "gloss": "(passasissami + iti) \"I shall breathe out\" + quotative",
        "gram": "fut. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "sikkhati;",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  },
  {
    "id": "mn118-evarupapi",
    "kind": "refrain",
    "label": "The \"such mendicants too are here\" refrain",
    "desc": "After each class of noble disciple is named, the text closes with this fixed sentence. No slots; a verbatim repeat.",
    "template": [
      {
        "t": "evarūpāpi,"
      },
      {
        "t": "bhikkhave,"
      },
      {
        "t": "santi"
      },
      {
        "t": "bhikkhū"
      },
      {
        "t": "imasmiṁ"
      },
      {
        "t": "bhikkhusaṅghe."
      }
    ],
    "slots": {},
    "samplePali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "sampleRef": "mn118:9.2",
    "sampleTranslation": "There are such mendicants in this Saṅgha.",
    "sampleSubstitutions": {},
    "words": [
      {
        "w": "evarūpāpi,",
        "gloss": "(evarupa + pi) of such a kind, such (mendicants) too",
        "gram": "adj. nom. pl. m. + emphatic",
        "ped": "PED s.v. evarupa"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "santi",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe.",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  },
  {
    "id": "mn118-tatharupo",
    "kind": "refrain",
    "label": "The \"such is this Saṅgha, such is this assembly\" refrain",
    "desc": "Repeated four times in the praise of the assembly, each time introducing a further epithet. No slots.",
    "template": [
      {
        "t": "Tathārūpo"
      },
      {
        "t": "ayaṁ,"
      },
      {
        "t": "bhikkhave,"
      },
      {
        "t": "bhikkhusaṅgho;"
      },
      {
        "t": "tathārūpā"
      },
      {
        "t": "ayaṁ,"
      },
      {
        "t": "bhikkhave,"
      },
      {
        "t": "parisā"
      }
    ],
    "slots": {},
    "samplePali": "Tathārūpo ayaṁ, bhikkhave, bhikkhusaṅgho; tathārūpā ayaṁ, bhikkhave, parisā",
    "sampleRef": "mn118:8.2",
    "sampleTranslation": "Such is this Saṅgha of mendicants, such is this assembly!",
    "sampleSubstitutions": {},
    "words": [
      {
        "w": "Tathārūpo",
        "gloss": "of such a kind (masc.)",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. tatharupa"
      },
      {
        "w": "ayaṁ,",
        "gloss": "this",
        "gram": "dem. pron. nom. sg. m./f.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhusaṅgho;",
        "gloss": "the Sangha of monks",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "tathārūpā",
        "gloss": "of such a kind (fem.)",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. tatharupa"
      },
      {
        "w": "ayaṁ,",
        "gloss": "this",
        "gram": "dem. pron. nom. sg. m./f.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "parisā",
        "gloss": "assembly, gathering",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. parisa"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  },
  {
    "id": "mn118-anupassana-dwelling",
    "kind": "refrain",
    "label": "The satipaṭṭhāna dwelling refrain (form A)",
    "desc": "Closes each tetrad: \"…observing an aspect of X, at that time a mendicant meditates — keen, aware, mindful, rid of covetousness and displeasure for the world.\" Slot ANUP = the contemplation phrase.",
    "template": [
      {
        "slot": "ANUP"
      },
      {
        "t": "bhikkhave,"
      },
      {
        "t": "tasmiṁ"
      },
      {
        "t": "samaye"
      },
      {
        "t": "bhikkhu"
      },
      {
        "t": "viharati"
      },
      {
        "t": "ātāpī"
      },
      {
        "t": "sampajāno"
      },
      {
        "t": "satimā"
      },
      {
        "t": "vineyya"
      },
      {
        "t": "loke"
      },
      {
        "t": "abhijjhādomanassaṁ."
      }
    ],
    "slots": {
      "ANUP": "the two-word contemplation phrase, e.g. \"kāye kāyānupassī,\" (locative object + anupassin), with trailing comma"
    },
    "samplePali": "kāye kāyānupassī, bhikkhave, tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "sampleRef": "mn118:24.5",
    "sampleTranslation": "at that time they’re meditating by observing an aspect of the body—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
    "sampleSubstitutions": {
      "ANUP": [
        "kāye",
        "kāyānupassī,"
      ]
    },
    "words": [
      {
        "w": "kāye",
        "gloss": "in the body",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "kāyānupassī,",
        "gloss": "observing the body (contemplating the body as a body)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "ātāpī",
        "gloss": "ardent, keen, applying effort",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. atapin"
      },
      {
        "w": "sampajāno",
        "gloss": "clearly aware, fully attentive",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. sampajana"
      },
      {
        "w": "satimā",
        "gloss": "mindful",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. satimant"
      },
      {
        "w": "vineyya",
        "gloss": "having removed/dispelled",
        "gram": "ger. of vineti",
        "ped": "PED s.v. vineti"
      },
      {
        "w": "loke",
        "gloss": "in the world (i.e. regarding the world/body)",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. loka"
      },
      {
        "w": "abhijjhādomanassaṁ.",
        "gloss": "covetousness-and-displeasure (abhijjha + domanassa)",
        "gram": "acc. sg. nt.; dvandva cpd.",
        "ped": "PED s.v. abhijjha"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  },
  {
    "id": "mn118-anupassana-tasmatiha",
    "kind": "refrain",
    "label": "The satipaṭṭhāna dwelling refrain (form B, \"tasmātiha\")",
    "desc": "The \"that is why…\" restatement that closes each tetrad. Slot ANUP2 = the contemplation phrase (no comma).",
    "template": [
      {
        "t": "Tasmātiha,"
      },
      {
        "t": "bhikkhave,"
      },
      {
        "slot": "ANUP2"
      },
      {
        "t": "tasmiṁ"
      },
      {
        "t": "samaye"
      },
      {
        "t": "bhikkhu"
      },
      {
        "t": "viharati"
      },
      {
        "t": "ātāpī"
      },
      {
        "t": "sampajāno"
      },
      {
        "t": "satimā"
      },
      {
        "t": "vineyya"
      },
      {
        "t": "loke"
      },
      {
        "t": "abhijjhādomanassaṁ."
      }
    ],
    "slots": {
      "ANUP2": "the two-word contemplation phrase without trailing comma, e.g. \"kāye kāyānupassī\""
    },
    "samplePali": "Tasmātiha, bhikkhave, kāye kāyānupassī tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "sampleRef": "mn118:24.7",
    "sampleTranslation": "That’s why at that time a mendicant is meditating by observing an aspect of the body—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
    "sampleSubstitutions": {
      "ANUP2": [
        "kāye",
        "kāyānupassī"
      ]
    },
    "words": [
      {
        "w": "Tasmātiha,",
        "gloss": "(tasma + iha) \"therefore, here / in this\"",
        "gram": "abl. adv. + adv.; sandhi",
        "ped": "PED s.v. ta"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "kāye",
        "gloss": "in the body",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "kāyānupassī",
        "gloss": "observing the body (contemplating the body as a body)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "ātāpī",
        "gloss": "ardent, keen, applying effort",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. atapin"
      },
      {
        "w": "sampajāno",
        "gloss": "clearly aware, fully attentive",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. sampajana"
      },
      {
        "w": "satimā",
        "gloss": "mindful",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. satimant"
      },
      {
        "w": "vineyya",
        "gloss": "having removed/dispelled",
        "gram": "ger. of vineti",
        "ped": "PED s.v. vineti"
      },
      {
        "w": "loke",
        "gloss": "in the world (i.e. regarding the world/body)",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. loka"
      },
      {
        "w": "abhijjhādomanassaṁ.",
        "gloss": "covetousness-and-displeasure (abhijjha + domanassa)",
        "gram": "acc. sg. nt.; dvandva cpd.",
        "ped": "PED s.v. abhijjha"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  },
  {
    "id": "mn118-bojjhanga-nissita",
    "kind": "refrain",
    "label": "The awakening-factor cultivation frame (abbreviated, §42)",
    "desc": "In the vijjā-vimutti section each awakening factor is \"developed, dependent on seclusion, on fading away, on cessation, ripening in release\" — but the middle five are elided with \"…pe…\"/\"…\". Slot FAC = the factor (accusative), slot ELL = the elision marker.",
    "template": [
      {
        "slot": "FAC"
      },
      {
        "t": "bhāveti"
      },
      {
        "slot": "ELL"
      }
    ],
    "slots": {
      "FAC": "the awakening factor in the accusative, e.g. \"Dhammavicayasambojjhaṅgaṁ\"",
      "ELL": "the elision marker \"…pe…\" (first occurrence) or \"…\" (subsequent)"
    },
    "samplePali": "Dhammavicayasambojjhaṅgaṁ bhāveti …pe…",
    "sampleRef": "mn118:42.2",
    "sampleTranslation": "investigation of principles,",
    "sampleSubstitutions": {
      "FAC": [
        "Dhammavicayasambojjhaṅgaṁ"
      ],
      "ELL": [
        "…pe…"
      ]
    },
    "words": [
      {
        "w": "Dhammavicayasambojjhaṅgaṁ",
        "gloss": "the awakening-factor of investigation of principles (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "bhāveti",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "…pe…",
        "gloss": "peyyala: the canonical abbreviation \"…pe…\" (pe = peyyala) signalling an omitted repeated passage",
        "gram": "editorial marker",
        "ped": "PED s.v. peyyala"
      }
    ],
    "transSrc": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)",
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    }
  }
];

export const MN118_SUBSTITUTION_GLOSSES = [
  {
    "w": "passambhayaṁ",
    "gloss": "calming, stilling",
    "gram": "prp. caus. nom. sg. m.",
    "ped": "PED s.v. passambhati"
  },
  {
    "w": "kāyasaṅkhāraṁ",
    "gloss": "the bodily formation/process (identified with the in-and-out breath, cf. MN 44)",
    "gram": "acc. sg. m.; cpd.",
    "ped": "PED s.v. saṅkhāra"
  },
  {
    "w": "sukhapaṭisaṁvedī",
    "gloss": "experiencing bliss/pleasure",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. paṭisaṁvedin"
  },
  {
    "w": "cittasaṅkhārapaṭisaṁvedī",
    "gloss": "experiencing the mental process",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. paṭisaṁvedin"
  },
  {
    "w": "cittasaṅkhāraṁ",
    "gloss": "the mental formation/process (perception and feeling, cf. MN 44)",
    "gram": "acc. sg. m.; cpd.",
    "ped": "PED s.v. saṅkhāra"
  },
  {
    "w": "abhippamodayaṁ",
    "gloss": "gladdening, causing to rejoice",
    "gram": "prp. caus. nom. sg. m.",
    "ped": "PED s.v. abhippamodati"
  },
  {
    "w": "samādahaṁ",
    "gloss": "concentrating, composing (the mind)",
    "gram": "prp. nom. sg. m. of samādahati",
    "ped": "PED s.v. samādahati"
  },
  {
    "w": "vimocayaṁ",
    "gloss": "freeing, liberating (the mind)",
    "gram": "prp. caus. nom. sg. m.",
    "ped": "PED s.v. vimoceti"
  },
  {
    "w": "virāgānupassī",
    "gloss": "observing fading-away / dispassion (virāga + anupassin)",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. anupassin"
  },
  {
    "w": "nirodhānupassī",
    "gloss": "observing cessation (nirodha + anupassin)",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. anupassin"
  },
  {
    "w": "paṭinissaggānupassī",
    "gloss": "observing relinquishment/letting go (paṭinissagga + anupassin)",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. paṭinissagga"
  },
  {
    "w": "vedanānupassī",
    "gloss": "observing feelings (vedanā + anupassin)",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. anupassin"
  },
  {
    "w": "cittānupassī",
    "gloss": "observing the mind (citta + anupassin)",
    "gram": "nom. sg. m.; cpd.",
    "ped": "PED s.v. anupassin"
  }
];

export const MN118_RECORDS = [
  {
    "ref": "mn118:0.1",
    "section": "Title",
    "pali": "Majjhima Nikāya 118",
    "kind": "full",
    "words": [
      {
        "w": "Majjhima",
        "gloss": "Middle (the Majjhima/Middle-Length collection)",
        "gram": "adj.; collection title",
        "ped": null
      },
      {
        "w": "Nikāya",
        "gloss": "collection, corpus (a Nikaya)",
        "gram": "m.; collection title",
        "ped": null
      },
      {
        "w": "118",
        "gloss": "the discourse number, Majjhima Nikaya 118",
        "gram": "numeral",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Middle Discourses 118",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:0.2",
    "section": "Title",
    "pali": "Ānāpānassatisutta",
    "kind": "full",
    "words": [
      {
        "w": "Ānāpānassatisutta",
        "gloss": "the \"Mindfulness of Breathing\" discourse (title)",
        "gram": "nt. nom. sg.; title cpd.",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Mindfulness of Breathing",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:1.1",
    "section": "Setting (nidāna)",
    "pali": "Evaṁ me sutaṁ—",
    "kind": "full",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "me",
        "gloss": "by me / of me (enclitic pronoun)",
        "gram": "ins./gen. sg. of ahaṁ",
        "ped": "PED s.v. ahaṁ"
      },
      {
        "w": "sutaṁ—",
        "gloss": "heard",
        "gram": "ppp. nom. sg. nt. of suṇati",
        "ped": "PED s.v. suṇati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "So I have heard.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:1.2",
    "section": "Setting (nidāna)",
    "pali": "ekaṁ samayaṁ bhagavā sāvatthiyaṁ viharati pubbārāme migāramātupāsāde sambahulehi abhiññātehi abhiññātehi therehi sāvakehi saddhiṁ—",
    "kind": "full",
    "words": [
      {
        "w": "ekaṁ",
        "gloss": "one, a certain",
        "gram": "num./adj. acc. sg. m.",
        "ped": "PED s.v. eka"
      },
      {
        "w": "samayaṁ",
        "gloss": "time, occasion",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "sāvatthiyaṁ",
        "gloss": "at/near Savatthi",
        "gram": "loc. sg. f.; place name",
        "ped": null
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "pubbārāme",
        "gloss": "in the Eastern Monastery (Pubbarama)",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. arama"
      },
      {
        "w": "migāramātupāsāde",
        "gloss": "in the Mansion/Palace of Migara’s Mother (the stilt longhouse)",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. pasada"
      },
      {
        "w": "sambahulehi",
        "gloss": "with several, with many",
        "gram": "adj. ins. pl. m.",
        "ped": "PED s.v. sambahula"
      },
      {
        "w": "abhiññātehi",
        "gloss": "well-known, distinguished",
        "gram": "ins. pl. m.; ppp. of abhijanati used as adj.",
        "ped": "PED s.v. abhiññata"
      },
      {
        "w": "abhiññātehi",
        "gloss": "well-known, distinguished",
        "gram": "ins. pl. m.; ppp. of abhijanati used as adj.",
        "ped": "PED s.v. abhiññata"
      },
      {
        "w": "therehi",
        "gloss": "by the elders",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "sāvakehi",
        "gloss": "with disciples",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. savaka"
      },
      {
        "w": "saddhiṁ—",
        "gloss": "together with (+ins.)",
        "gram": "indecl.",
        "ped": "PED s.v. saddhiṁ"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At one time the Buddha was staying near Sāvatthī in the stilt longhouse of Migāra’s mother in the Eastern Monastery, together with several well-known senior disciples, such as",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:1.3",
    "section": "Setting (nidāna)",
    "pali": "āyasmatā ca sāriputtena āyasmatā ca mahāmoggallānena āyasmatā ca mahākassapena āyasmatā ca mahākaccāyanena āyasmatā ca mahākoṭṭhikena āyasmatā ca mahākappinena āyasmatā ca mahācundena āyasmatā ca anuruddhena āyasmatā ca revatena āyasmatā ca ānandena, aññehi ca abhiññātehi abhiññātehi therehi sāvakehi saddhiṁ.",
    "kind": "full",
    "words": [
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "sāriputtena",
        "gloss": "by (the venerable) Sariputta",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahāmoggallānena",
        "gloss": "by (the venerable) Mahamoggallana",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahākassapena",
        "gloss": "by (the venerable) Mahakassapa",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahākaccāyanena",
        "gloss": "by (the venerable) Mahakaccana",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahākoṭṭhikena",
        "gloss": "by (the venerable) Mahakoṭṭhita",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahākappinena",
        "gloss": "by (the venerable) Mahakappina",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mahācundena",
        "gloss": "by (the venerable) Mahacunda",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "anuruddhena",
        "gloss": "by (the venerable) Anuruddha",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "revatena",
        "gloss": "by (the venerable) Revata",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "āyasmatā",
        "gloss": "with the venerable",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. ayasmant"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "ānandena,",
        "gloss": "by (the venerable) Ananda",
        "gram": "ins. sg. m.; personal name",
        "ped": null
      },
      {
        "w": "aññehi",
        "gloss": "with other",
        "gram": "ins. pl. m. (añña)",
        "ped": "PED s.v. añña"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "abhiññātehi",
        "gloss": "well-known, distinguished",
        "gram": "ins. pl. m.; ppp. of abhijanati used as adj.",
        "ped": "PED s.v. abhiññata"
      },
      {
        "w": "abhiññātehi",
        "gloss": "well-known, distinguished",
        "gram": "ins. pl. m.; ppp. of abhijanati used as adj.",
        "ped": "PED s.v. abhiññata"
      },
      {
        "w": "therehi",
        "gloss": "by the elders",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "sāvakehi",
        "gloss": "with disciples",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. savaka"
      },
      {
        "w": "saddhiṁ.",
        "gloss": "together with (+ins.)",
        "gram": "indecl.",
        "ped": "PED s.v. saddhiṁ"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the venerables Sāriputta, Mahāmoggallāna, Mahākassapa, Mahākaccāna, Mahākoṭṭhita, Mahākappina, Mahācunda, Anuruddha, Revata, Ānanda, and others.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:2.1",
    "section": "The elders instruct the juniors",
    "pali": "Tena kho pana samayena therā bhikkhū nave bhikkhū ovadanti anusāsanti.",
    "kind": "full",
    "words": [
      {
        "w": "Tena",
        "gloss": "by that; (with samayena) \"at that time\"",
        "gram": "dem. ins. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "pana",
        "gloss": "moreover, now, but",
        "gram": "indecl.",
        "ped": "PED s.v. pana"
      },
      {
        "w": "samayena",
        "gloss": "at that time (idiomatic ins. of time)",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "nave",
        "gloss": "new, junior",
        "gram": "adj. acc. pl. m.",
        "ped": "PED s.v. nava"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti.",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Now at that time the senior mendicants were advising and instructing the junior mendicants.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:2.2",
    "section": "The elders instruct the juniors",
    "pali": "Appekacce therā bhikkhū dasapi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū vīsampi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū tiṁsampi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū cattārīsampi bhikkhū ovadanti anusāsanti.",
    "kind": "full",
    "words": [
      {
        "w": "Appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "dasapi",
        "gloss": "(dasa + pi) even ten",
        "gram": "num. + emphatic",
        "ped": "PED s.v. dasa"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "vīsampi",
        "gloss": "(visaṁ + pi) even twenty",
        "gram": "num. + emph.",
        "ped": "PED s.v. visati"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tiṁsampi",
        "gloss": "(tiṁsaṁ + pi) even thirty",
        "gram": "num. + emph.",
        "ped": "PED s.v. tiṁsa"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "cattārīsampi",
        "gloss": "(cattarisaṁ + pi) even forty",
        "gram": "num. + emphatic particle",
        "ped": "PED s.v. cattarisaṁ"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti.",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Some senior mendicants instructed ten mendicants, while some instructed twenty, thirty, or forty.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:2.3",
    "section": "The elders instruct the juniors",
    "pali": "Te ca navā bhikkhū therehi bhikkhūhi ovadiyamānā anusāsiyamānā uḷāraṁ pubbenāparaṁ visesaṁ jānanti.",
    "kind": "full",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those; (here) those (mendicants)",
        "gram": "dem. pron. nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "navā",
        "gloss": "new, junior (of a mendicant)",
        "gram": "adj. nom. pl. m.",
        "ped": "PED s.v. nava"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "therehi",
        "gloss": "by the elders",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhūhi",
        "gloss": "by the monks",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadiyamānā",
        "gloss": "being advised/admonished",
        "gram": "prp. pass. nom. pl. m.",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsiyamānā",
        "gloss": "being instructed",
        "gram": "prp. pass. nom. pl. m.",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "uḷāraṁ",
        "gloss": "lofty, superior, eminent",
        "gram": "adj. acc. sg. m.",
        "ped": "PED s.v. uḷara"
      },
      {
        "w": "pubbenāparaṁ",
        "gloss": "(pubbena + aparaṁ) later than before, progressively",
        "gram": "adv.; sandhi",
        "ped": "PED s.v. pubba"
      },
      {
        "w": "visesaṁ",
        "gloss": "distinction, a higher attainment",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. visesa"
      },
      {
        "w": "jānanti.",
        "gloss": "they know, come to know",
        "gram": "pres. 3 pl. of janati",
        "ped": "PED s.v. janati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Being instructed by the senior mendicants, the junior mendicants realized a higher distinction than they had before.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:3.1",
    "section": "The first sabbath",
    "pali": "Tena kho pana samayena bhagavā tadahuposathe pannarase pavāraṇāya puṇṇāya puṇṇamāya rattiyā bhikkhusaṅghaparivuto abbhokāse nisinno hoti.",
    "kind": "full",
    "words": [
      {
        "w": "Tena",
        "gloss": "by that; (with samayena) \"at that time\"",
        "gram": "dem. ins. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "pana",
        "gloss": "moreover, now, but",
        "gram": "indecl.",
        "ped": "PED s.v. pana"
      },
      {
        "w": "samayena",
        "gloss": "at that time (idiomatic ins. of time)",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "tadahuposathe",
        "gloss": "on that very sabbath day",
        "gram": "loc. sg. m.; cpd. (tad-aha-uposatha)",
        "ped": "PED s.v. uposatha"
      },
      {
        "w": "pannarase",
        "gloss": "on the fifteenth (day of the fortnight)",
        "gram": "ord. loc. sg. m.",
        "ped": "PED s.v. pannarasa"
      },
      {
        "w": "pavāraṇāya",
        "gloss": "for the Pavaraṇa (the invitation to admonish at the rains-end)",
        "gram": "dat./loc. sg. f.",
        "ped": "PED s.v. pavaraṇa"
      },
      {
        "w": "puṇṇāya",
        "gloss": "full (of the moon)",
        "gram": "adj. loc./ins. sg. f.",
        "ped": "PED s.v. puṇṇa"
      },
      {
        "w": "puṇṇamāya",
        "gloss": "on the full-moon",
        "gram": "loc./ins. sg. f.",
        "ped": "PED s.v. puṇṇama"
      },
      {
        "w": "rattiyā",
        "gloss": "in/of the night",
        "gram": "loc./gen. sg. f.",
        "ped": "PED s.v. ratti"
      },
      {
        "w": "bhikkhusaṅghaparivuto",
        "gloss": "surrounded by the Sangha of monks",
        "gram": "ppp. nom. sg. m.; cpd.",
        "ped": "PED s.v. parivuta"
      },
      {
        "w": "abbhokāse",
        "gloss": "in the open air",
        "gram": "loc. sg. m. (abbhokasa)",
        "ped": "PED s.v. abbhokasa"
      },
      {
        "w": "nisinno",
        "gloss": "seated, sitting",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. nisidati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Now, at that time it was the sabbath—the full moon on the fifteenth day—and the Buddha was sitting surrounded by a Saṅgha of monks for the invitation to admonish.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:3.2",
    "section": "The first sabbath",
    "pali": "Atha kho bhagavā tuṇhībhūtaṁ tuṇhībhūtaṁ bhikkhusaṅghaṁ anuviloketvā bhikkhū āmantesi:",
    "kind": "full",
    "words": [
      {
        "w": "Atha",
        "gloss": "then, thereupon",
        "gram": "indecl.",
        "ped": "PED s.v. atha"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "tuṇhībhūtaṁ",
        "gloss": "fallen silent, become quiet",
        "gram": "ppp./adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. tuṇhi"
      },
      {
        "w": "tuṇhībhūtaṁ",
        "gloss": "fallen silent, become quiet",
        "gram": "ppp./adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. tuṇhi"
      },
      {
        "w": "bhikkhusaṅghaṁ",
        "gloss": "the Sangha/community of monks",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "anuviloketvā",
        "gloss": "having surveyed, looked around at",
        "gram": "ger. of anuviloketi",
        "ped": "PED s.v. anuviloketi"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āmantesi:",
        "gloss": "(amantesi + colon) addressed, called out to",
        "gram": "aor. 3 sg. of amanteti",
        "ped": "PED s.v. amanteti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Then the Buddha looked around the Saṅgha of mendicants, who were so very silent. He addressed them:",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:4.1",
    "section": "The Buddha will wait at Sāvatthī",
    "pali": "“āraddhosmi, bhikkhave, imāya paṭipadāya;",
    "kind": "full",
    "words": [
      {
        "w": "“āraddhosmi,",
        "gloss": "(araddho + amhi) \"I am satisfied/resolved\"",
        "gram": "nom. sg. m. + pres. 1 sg. of atthi; sandhi",
        "ped": "PED s.v. araddha"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imāya",
        "gloss": "by/with this",
        "gram": "dem. ins. sg. f.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "paṭipadāya;",
        "gloss": "in/by the practice, the way",
        "gram": "ins./loc. sg. f.",
        "ped": "PED s.v. paṭipada"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "“I am satisfied, mendicants, with this practice.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:4.2",
    "section": "The Buddha will wait at Sāvatthī",
    "pali": "āraddhacittosmi, bhikkhave, imāya paṭipadāya.",
    "kind": "full",
    "words": [
      {
        "w": "āraddhacittosmi,",
        "gloss": "(araddhacitto + amhi) \"I am resolved of heart / my mind is satisfied\"",
        "gram": "nom. sg. m. + pres. 1 sg. of atthi; sandhi",
        "ped": "PED s.v. araddha"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imāya",
        "gloss": "by/with this",
        "gram": "dem. ins. sg. f.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "paṭipadāya.",
        "gloss": "in/by the practice, the way",
        "gram": "ins./loc. sg. f.",
        "ped": "PED s.v. paṭipada"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "My heart is satisfied with this practice.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:4.3",
    "section": "The Buddha will wait at Sāvatthī",
    "pali": "Tasmātiha, bhikkhave, bhiyyoso mattāya vīriyaṁ ārabhatha appattassa pattiyā, anadhigatassa adhigamāya, asacchikatassa sacchikiriyāya.",
    "kind": "full",
    "words": [
      {
        "w": "Tasmātiha,",
        "gloss": "(tasma + iha) \"therefore, here / in this\"",
        "gram": "abl. adv. + adv.; sandhi",
        "ped": "PED s.v. ta"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhiyyoso",
        "gloss": "still more, to a greater degree",
        "gram": "indecl. adv.",
        "ped": "PED s.v. bhiyyoso"
      },
      {
        "w": "mattāya",
        "gloss": "to the degree/measure (of)",
        "gram": "ins. sg. f. (matta)",
        "ped": "PED s.v. matta"
      },
      {
        "w": "vīriyaṁ",
        "gloss": "energy, vigour",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "ārabhatha",
        "gloss": "rouse up! undertake! (energy)",
        "gram": "imp. 2 pl. of arabhati",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "appattassa",
        "gloss": "of the unattained",
        "gram": "gen. sg. nt.; neg. ppp.",
        "ped": "PED s.v. patta"
      },
      {
        "w": "pattiyā,",
        "gloss": "for the attainment",
        "gram": "dat. sg. f.",
        "ped": "PED s.v. patti"
      },
      {
        "w": "anadhigatassa",
        "gloss": "of what is unattained",
        "gram": "gen. sg. nt.; neg. ppp.",
        "ped": "PED s.v. adhigata"
      },
      {
        "w": "adhigamāya,",
        "gloss": "for the attaining",
        "gram": "dat. sg. m. (adhigama)",
        "ped": "PED s.v. adhigama"
      },
      {
        "w": "asacchikatassa",
        "gloss": "of the unrealized",
        "gram": "gen. sg. nt.; neg. ppp.",
        "ped": "PED s.v. sacchikaroti"
      },
      {
        "w": "sacchikiriyāya.",
        "gloss": "for the realization",
        "gram": "dat. sg. f.",
        "ped": "PED s.v. sacchikiriya"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "So you should rouse up even more energy for attaining the unattained, achieving the unachieved, and realizing the unrealized.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:4.4",
    "section": "The Buddha will wait at Sāvatthī",
    "pali": "Idhevāhaṁ sāvatthiyaṁ komudiṁ cātumāsiniṁ āgamessāmī”ti.",
    "kind": "full",
    "words": [
      {
        "w": "Idhevāhaṁ",
        "gloss": "(idha + eva + ahaṁ) \"right here I\"",
        "gram": "adv. + emph. + pron.; sandhi",
        "ped": "PED s.v. idha"
      },
      {
        "w": "sāvatthiyaṁ",
        "gloss": "at/near Savatthi",
        "gram": "loc. sg. f.; place name",
        "ped": null
      },
      {
        "w": "komudiṁ",
        "gloss": "the Komudi (full moon of the month Kattika)",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. komudi"
      },
      {
        "w": "cātumāsiniṁ",
        "gloss": "of the four-month (Komudi) period",
        "gram": "adj. acc. sg. f.",
        "ped": "PED s.v. catumasa"
      },
      {
        "w": "āgamessāmī”ti.",
        "gloss": "(agamessami + iti) \"I will wait/remain\" + quotative",
        "gram": "fut. 1 sg. of agacchati + indecl.",
        "ped": "PED s.v. agacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "I will wait here in Sāvatthī for the Komudī full moon of the fourth month.”",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:5.1",
    "section": "Mendicants gather from the country",
    "pali": "Assosuṁ kho jānapadā bhikkhū:",
    "kind": "full",
    "words": [
      {
        "w": "Assosuṁ",
        "gloss": "they heard",
        "gram": "aor. 3 pl. of suṇati",
        "ped": "PED s.v. suṇati"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "jānapadā",
        "gloss": "of the countryside, from the provinces",
        "gram": "adj. nom. pl. m.",
        "ped": "PED s.v. janapada"
      },
      {
        "w": "bhikkhū:",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Mendicants from around the country heard about this,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:5.2",
    "section": "Mendicants gather from the country",
    "pali": "“bhagavā kira tattheva sāvatthiyaṁ komudiṁ cātumāsiniṁ āgamessatī”ti.",
    "kind": "full",
    "words": [
      {
        "w": "“bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "kira",
        "gloss": "it is said, reportedly",
        "gram": "indecl.",
        "ped": "PED s.v. kira"
      },
      {
        "w": "tattheva",
        "gloss": "(tattha + eva) right there, in that very place",
        "gram": "adv. + emph.; sandhi",
        "ped": "PED s.v. tattha"
      },
      {
        "w": "sāvatthiyaṁ",
        "gloss": "at/near Savatthi",
        "gram": "loc. sg. f.; place name",
        "ped": null
      },
      {
        "w": "komudiṁ",
        "gloss": "the Komudi (full moon of the month Kattika)",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. komudi"
      },
      {
        "w": "cātumāsiniṁ",
        "gloss": "of the four-month (Komudi) period",
        "gram": "adj. acc. sg. f.",
        "ped": "PED s.v. catumasa"
      },
      {
        "w": "āgamessatī”ti.",
        "gloss": "(agamessati + iti) \"he will wait\" + quotative",
        "gram": "fut. 3 sg. of agacchati + indecl.",
        "ped": "PED s.v. agacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:5.3",
    "section": "Mendicants gather from the country",
    "pali": "Te jānapadā bhikkhū sāvatthiṁ osaranti bhagavantaṁ dassanāya.",
    "kind": "full",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those; (here) those (mendicants)",
        "gram": "dem. pron. nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "jānapadā",
        "gloss": "of the countryside, from the provinces",
        "gram": "adj. nom. pl. m.",
        "ped": "PED s.v. janapada"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "sāvatthiṁ",
        "gloss": "to Savatthi",
        "gram": "acc. sg. f.; place name",
        "ped": null
      },
      {
        "w": "osaranti",
        "gloss": "they come down, converge, resort to",
        "gram": "pres. 3 pl. of osarati",
        "ped": "PED s.v. osarati"
      },
      {
        "w": "bhagavantaṁ",
        "gloss": "the Blessed One",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "dassanāya.",
        "gloss": "for seeing, for the sight (of)",
        "gram": "dat. sg. nt.",
        "ped": "PED s.v. dassana"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "and came down to Sāvatthī to see the Buddha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:6.1",
    "section": "The elders instruct further",
    "pali": "Te ca kho therā bhikkhū bhiyyoso mattāya nave bhikkhū ovadanti anusāsanti.",
    "kind": "full",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those; (here) those (mendicants)",
        "gram": "dem. pron. nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhiyyoso",
        "gloss": "still more, to a greater degree",
        "gram": "indecl. adv.",
        "ped": "PED s.v. bhiyyoso"
      },
      {
        "w": "mattāya",
        "gloss": "to the degree/measure (of)",
        "gram": "ins. sg. f. (matta)",
        "ped": "PED s.v. matta"
      },
      {
        "w": "nave",
        "gloss": "new, junior",
        "gram": "adj. acc. pl. m.",
        "ped": "PED s.v. nava"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti.",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And those senior mendicants instructed the junior mendicants even more.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:6.2",
    "section": "The elders instruct further",
    "pali": "Appekacce therā bhikkhū dasapi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū vīsampi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū tiṁsampi bhikkhū ovadanti anusāsanti, appekacce therā bhikkhū cattārīsampi bhikkhū ovadanti anusāsanti.",
    "kind": "full",
    "words": [
      {
        "w": "Appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "dasapi",
        "gloss": "(dasa + pi) even ten",
        "gram": "num. + emphatic",
        "ped": "PED s.v. dasa"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "vīsampi",
        "gloss": "(visaṁ + pi) even twenty",
        "gram": "num. + emph.",
        "ped": "PED s.v. visati"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tiṁsampi",
        "gloss": "(tiṁsaṁ + pi) even thirty",
        "gram": "num. + emph.",
        "ped": "PED s.v. tiṁsa"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti,",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "appekacce",
        "gloss": "(api + ekacce) some, a certain number",
        "gram": "indef. pron. nom. pl. m.; sandhi",
        "ped": "PED s.v. ekacca"
      },
      {
        "w": "therā",
        "gloss": "elder (senior monks)",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "cattārīsampi",
        "gloss": "(cattarisaṁ + pi) even forty",
        "gram": "num. + emphatic particle",
        "ped": "PED s.v. cattarisaṁ"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadanti",
        "gloss": "they exhort, advise, admonish",
        "gram": "pres. 3 pl. of ovadati",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsanti.",
        "gloss": "they instruct, give guidance",
        "gram": "pres. 3 pl. of anusasati",
        "ped": "PED s.v. anusasati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Some senior mendicants instructed ten mendicants, while some instructed twenty, thirty, or forty.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:6.3",
    "section": "The elders instruct further",
    "pali": "Te ca navā bhikkhū therehi bhikkhūhi ovadiyamānā anusāsiyamānā uḷāraṁ pubbenāparaṁ visesaṁ jānanti.",
    "kind": "full",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those; (here) those (mendicants)",
        "gram": "dem. pron. nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "navā",
        "gloss": "new, junior (of a mendicant)",
        "gram": "adj. nom. pl. m.",
        "ped": "PED s.v. nava"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "therehi",
        "gloss": "by the elders",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. thera"
      },
      {
        "w": "bhikkhūhi",
        "gloss": "by the monks",
        "gram": "ins. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ovadiyamānā",
        "gloss": "being advised/admonished",
        "gram": "prp. pass. nom. pl. m.",
        "ped": "PED s.v. ovadati"
      },
      {
        "w": "anusāsiyamānā",
        "gloss": "being instructed",
        "gram": "prp. pass. nom. pl. m.",
        "ped": "PED s.v. anusasati"
      },
      {
        "w": "uḷāraṁ",
        "gloss": "lofty, superior, eminent",
        "gram": "adj. acc. sg. m.",
        "ped": "PED s.v. uḷara"
      },
      {
        "w": "pubbenāparaṁ",
        "gloss": "(pubbena + aparaṁ) later than before, progressively",
        "gram": "adv.; sandhi",
        "ped": "PED s.v. pubba"
      },
      {
        "w": "visesaṁ",
        "gloss": "distinction, a higher attainment",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. visesa"
      },
      {
        "w": "jānanti.",
        "gloss": "they know, come to know",
        "gram": "pres. 3 pl. of janati",
        "ped": "PED s.v. janati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Being instructed by the senior mendicants, the junior mendicants realized a higher distinction than they had before.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:7.1",
    "section": "The Komudī sabbath",
    "pali": "Tena kho pana samayena bhagavā tadahuposathe pannarase komudiyā cātumāsiniyā puṇṇāya puṇṇamāya rattiyā bhikkhusaṅghaparivuto abbhokāse nisinno hoti.",
    "kind": "full",
    "words": [
      {
        "w": "Tena",
        "gloss": "by that; (with samayena) \"at that time\"",
        "gram": "dem. ins. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "pana",
        "gloss": "moreover, now, but",
        "gram": "indecl.",
        "ped": "PED s.v. pana"
      },
      {
        "w": "samayena",
        "gloss": "at that time (idiomatic ins. of time)",
        "gram": "ins. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "tadahuposathe",
        "gloss": "on that very sabbath day",
        "gram": "loc. sg. m.; cpd. (tad-aha-uposatha)",
        "ped": "PED s.v. uposatha"
      },
      {
        "w": "pannarase",
        "gloss": "on the fifteenth (day of the fortnight)",
        "gram": "ord. loc. sg. m.",
        "ped": "PED s.v. pannarasa"
      },
      {
        "w": "komudiyā",
        "gloss": "on the Komudi (full moon)",
        "gram": "loc./ins. sg. f.",
        "ped": "PED s.v. komudi"
      },
      {
        "w": "cātumāsiniyā",
        "gloss": "on the four-month (full moon)",
        "gram": "adj. loc./ins. sg. f.",
        "ped": "PED s.v. catumasa"
      },
      {
        "w": "puṇṇāya",
        "gloss": "full (of the moon)",
        "gram": "adj. loc./ins. sg. f.",
        "ped": "PED s.v. puṇṇa"
      },
      {
        "w": "puṇṇamāya",
        "gloss": "on the full-moon",
        "gram": "loc./ins. sg. f.",
        "ped": "PED s.v. puṇṇama"
      },
      {
        "w": "rattiyā",
        "gloss": "in/of the night",
        "gram": "loc./gen. sg. f.",
        "ped": "PED s.v. ratti"
      },
      {
        "w": "bhikkhusaṅghaparivuto",
        "gloss": "surrounded by the Sangha of monks",
        "gram": "ppp. nom. sg. m.; cpd.",
        "ped": "PED s.v. parivuta"
      },
      {
        "w": "abbhokāse",
        "gloss": "in the open air",
        "gram": "loc. sg. m. (abbhokasa)",
        "ped": "PED s.v. abbhokasa"
      },
      {
        "w": "nisinno",
        "gloss": "seated, sitting",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. nisidati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Now, at that time it was the sabbath—the Komudī full moon on the fifteenth day of the fourth month—and the Buddha was sitting in the open surrounded by a Saṅgha of monks.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:7.2",
    "section": "The Komudī sabbath",
    "pali": "Atha kho bhagavā tuṇhībhūtaṁ tuṇhībhūtaṁ bhikkhusaṅghaṁ anuviloketvā bhikkhū āmantesi:",
    "kind": "full",
    "words": [
      {
        "w": "Atha",
        "gloss": "then, thereupon",
        "gram": "indecl.",
        "ped": "PED s.v. atha"
      },
      {
        "w": "kho",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhagavā",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "tuṇhībhūtaṁ",
        "gloss": "fallen silent, become quiet",
        "gram": "ppp./adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. tuṇhi"
      },
      {
        "w": "tuṇhībhūtaṁ",
        "gloss": "fallen silent, become quiet",
        "gram": "ppp./adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. tuṇhi"
      },
      {
        "w": "bhikkhusaṅghaṁ",
        "gloss": "the Sangha/community of monks",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "anuviloketvā",
        "gloss": "having surveyed, looked around at",
        "gram": "ger. of anuviloketi",
        "ped": "PED s.v. anuviloketi"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āmantesi:",
        "gloss": "(amantesi + colon) addressed, called out to",
        "gram": "aor. 3 sg. of amanteti",
        "ped": "PED s.v. amanteti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Then the Buddha looked around the Saṅgha of mendicants, who were so very silent. He addressed them:",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.1",
    "section": "Praise of the assembly",
    "pali": "“Apalāpāyaṁ, bhikkhave, parisā; nippalāpāyaṁ, bhikkhave, parisā; suddhā sāre patiṭṭhitā.",
    "kind": "full",
    "words": [
      {
        "w": "“Apalāpāyaṁ,",
        "gloss": "(apalapa + ayaṁ) \"this [assembly] is without prattle/chaff\"",
        "gram": "adj. nom. sg. f. + dem.; sandhi",
        "ped": "PED s.v. palapa"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "parisā;",
        "gloss": "assembly, gathering",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "nippalāpāyaṁ,",
        "gloss": "(nippalapa + ayaṁ) \"this [is] free of chaff/prattle\"",
        "gram": "adj. nom. sg. f. + dem.; sandhi",
        "ped": "PED s.v. palapa"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "parisā;",
        "gloss": "assembly, gathering",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "suddhā",
        "gloss": "pure",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. suddha"
      },
      {
        "w": "sāre",
        "gloss": "in the core/essence, in what is substantial",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. sara"
      },
      {
        "w": "patiṭṭhitā.",
        "gloss": "established, settled (in)",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. patiṭṭhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "“This assembly has no chaff, mendicants, it is free of chaff, pure, and consolidated in the core.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.2",
    "section": "Praise of the assembly",
    "pali": "Tathārūpo ayaṁ, bhikkhave, bhikkhusaṅgho; tathārūpā ayaṁ, bhikkhave, parisā",
    "kind": "refrain-use",
    "refrain": "mn118-tatharupo",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Such is this Saṅgha of mendicants, such is this assembly!",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.3",
    "section": "Praise of the assembly",
    "pali": "yathārūpā parisā āhuneyyā pāhuneyyā dakkhiṇeyyā añjalikaraṇīyā anuttaraṁ puññakkhettaṁ lokassa.",
    "kind": "full",
    "words": [
      {
        "w": "yathārūpā",
        "gloss": "of what kind, such as (fem.)",
        "gram": "rel. adj. nom. sg. f.",
        "ped": "PED s.v. yatharupa"
      },
      {
        "w": "parisā",
        "gloss": "assembly, gathering",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "āhuneyyā",
        "gloss": "worthy of offerings/oblations",
        "gram": "grd. nom. sg. f.",
        "ped": "PED s.v. ahuneyya"
      },
      {
        "w": "pāhuneyyā",
        "gloss": "worthy of hospitality",
        "gram": "grd. nom. sg. f.",
        "ped": "PED s.v. pahuneyya"
      },
      {
        "w": "dakkhiṇeyyā",
        "gloss": "worthy of religious gifts/donations",
        "gram": "grd. nom. sg. f.",
        "ped": "PED s.v. dakkhiṇeyya"
      },
      {
        "w": "añjalikaraṇīyā",
        "gloss": "worthy of reverential salutation (raising the joined palms)",
        "gram": "grd. nom. sg. f.",
        "ped": "PED s.v. añjali"
      },
      {
        "w": "anuttaraṁ",
        "gloss": "unsurpassed, supreme",
        "gram": "adj. acc. sg. nt.",
        "ped": "PED s.v. anuttara"
      },
      {
        "w": "puññakkhettaṁ",
        "gloss": "field of merit",
        "gram": "acc. sg. nt.; cpd.",
        "ped": "PED s.v. puñña"
      },
      {
        "w": "lokassa.",
        "gloss": "for/of the world",
        "gram": "gen. sg. m.",
        "ped": "PED s.v. loka"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "An assembly such as this is worthy of offerings dedicated to the gods, worthy of hospitality, worthy of a religious donation, worthy of greeting with cupped palms, and is the supreme field of merit for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.4",
    "section": "Praise of the assembly",
    "pali": "Tathārūpo ayaṁ, bhikkhave, bhikkhusaṅgho; tathārūpā ayaṁ, bhikkhave, parisā",
    "kind": "refrain-use",
    "refrain": "mn118-tatharupo",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Such is this Saṅgha of mendicants, such is this assembly!",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.5",
    "section": "Praise of the assembly",
    "pali": "yathārūpāya parisāya appaṁ dinnaṁ bahu hoti, bahu dinnaṁ bahutaraṁ.",
    "kind": "full",
    "words": [
      {
        "w": "yathārūpāya",
        "gloss": "of what kind (loc./gen. fem.)",
        "gram": "rel. adj. loc./gen. sg. f.",
        "ped": "PED s.v. yatharupa"
      },
      {
        "w": "parisāya",
        "gloss": "of/for/in the assembly",
        "gram": "gen./dat./loc. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "appaṁ",
        "gloss": "little, a small amount",
        "gram": "adj. nom./acc. sg. nt.",
        "ped": "PED s.v. appa"
      },
      {
        "w": "dinnaṁ",
        "gloss": "what is given, a gift",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. dadati"
      },
      {
        "w": "bahu",
        "gloss": "much, many",
        "gram": "adj. nom./acc. sg. nt.",
        "ped": "PED s.v. bahu"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "bahu",
        "gloss": "much, many",
        "gram": "adj. nom./acc. sg. nt.",
        "ped": "PED s.v. bahu"
      },
      {
        "w": "dinnaṁ",
        "gloss": "what is given, a gift",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. dadati"
      },
      {
        "w": "bahutaraṁ.",
        "gloss": "(becomes) even more",
        "gram": "adj. compar. nom. sg. nt.",
        "ped": "PED s.v. bahu"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "For an assembly such as this, giving little becomes much, while giving much becomes even more.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.6",
    "section": "Praise of the assembly",
    "pali": "Tathārūpo ayaṁ, bhikkhave, bhikkhusaṅgho; tathārūpā ayaṁ, bhikkhave, parisā",
    "kind": "refrain-use",
    "refrain": "mn118-tatharupo",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Such is this Saṅgha of mendicants, such is this assembly!",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.7",
    "section": "Praise of the assembly",
    "pali": "yathārūpā parisā dullabhā dassanāya lokassa.",
    "kind": "full",
    "words": [
      {
        "w": "yathārūpā",
        "gloss": "of what kind, such as (fem.)",
        "gram": "rel. adj. nom. sg. f.",
        "ped": "PED s.v. yatharupa"
      },
      {
        "w": "parisā",
        "gloss": "assembly, gathering",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "dullabhā",
        "gloss": "hard to find, rarely met with",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. dullabha"
      },
      {
        "w": "dassanāya",
        "gloss": "for seeing, for the sight (of)",
        "gram": "dat. sg. nt.",
        "ped": "PED s.v. dassana"
      },
      {
        "w": "lokassa.",
        "gloss": "for/of the world",
        "gram": "gen. sg. m.",
        "ped": "PED s.v. loka"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "An assembly such as this is rarely seen in the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.8",
    "section": "Praise of the assembly",
    "pali": "Tathārūpo ayaṁ, bhikkhave, bhikkhusaṅgho; tathārūpā ayaṁ, bhikkhave, parisā",
    "kind": "refrain-use",
    "refrain": "mn118-tatharupo",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Such is this Saṅgha of mendicants, such is this assembly!",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:8.9",
    "section": "Praise of the assembly",
    "pali": "yathārūpaṁ parisaṁ alaṁ yojanagaṇanāni dassanāya gantuṁ puṭosenāpi.",
    "kind": "full",
    "words": [
      {
        "w": "yathārūpaṁ",
        "gloss": "of what kind (acc. fem.)",
        "gram": "rel. adj. acc. sg. f.",
        "ped": "PED s.v. yatharupa"
      },
      {
        "w": "parisaṁ",
        "gloss": "assembly",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. parisa"
      },
      {
        "w": "alaṁ",
        "gloss": "fit, worthwhile, enough",
        "gram": "indecl.",
        "ped": "PED s.v. alaṁ"
      },
      {
        "w": "yojanagaṇanāni",
        "gloss": "counted in yojanas (leagues), many leagues",
        "gram": "nt. acc. pl.; cpd.",
        "ped": "PED s.v. yojana"
      },
      {
        "w": "dassanāya",
        "gloss": "for seeing, for the sight (of)",
        "gram": "dat. sg. nt.",
        "ped": "PED s.v. dassana"
      },
      {
        "w": "gantuṁ",
        "gloss": "to go",
        "gram": "inf. of gacchati",
        "ped": "PED s.v. gacchati"
      },
      {
        "w": "puṭosenāpi.",
        "gloss": "(puṭosena + api) even with a knapsack of provisions",
        "gram": "ins. sg. + emph.; sandhi",
        "ped": "PED s.v. puṭaṁsa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "An assembly such as this is worth traveling many leagues to see, even if you have to carry your own provisions in a knapsack.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:9.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe arahanto khīṇāsavā vusitavanto katakaraṇīyā ohitabhārā anuppattasadatthā parikkhīṇabhavasaṁyojanā sammadaññāvimuttā—",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "arahanto",
        "gloss": "perfected ones, arahants",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. arahant"
      },
      {
        "w": "khīṇāsavā",
        "gloss": "whose defilements are destroyed",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. asava"
      },
      {
        "w": "vusitavanto",
        "gloss": "who have lived (the holy life to its end)",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. vasati"
      },
      {
        "w": "katakaraṇīyā",
        "gloss": "who have done what had to be done",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. karaṇiya"
      },
      {
        "w": "ohitabhārā",
        "gloss": "who have laid down the burden",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. bhara"
      },
      {
        "w": "anuppattasadatthā",
        "gloss": "who has reached the true/highest goal",
        "gram": "adj. nom. sg. m.; cpd. (anuppatta + sad-attha)",
        "ped": "PED s.v. anuppatta"
      },
      {
        "w": "parikkhīṇabhavasaṁyojanā",
        "gloss": "with the fetter of continued existence utterly ended",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. saṁyojana"
      },
      {
        "w": "sammadaññāvimuttā—",
        "gloss": "freed by right knowledge (sammad-añña-vimutta)",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. añña"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "For in this Saṅgha there are perfected mendicants, who have ended the defilements, completed the spiritual journey, done what had to be done, laid down the burden, achieved their heart’s goal, utterly ended the fetter of continued existence, and are rightly freed through enlightenment.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:9.2",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:10.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe pañcannaṁ orambhāgiyānaṁ saṁyojanānaṁ parikkhayā opapātikā tattha parinibbāyino anāvattidhammā tasmā lokā—",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "pañcannaṁ",
        "gloss": "of five",
        "gram": "num. gen.",
        "ped": "PED s.v. pañca"
      },
      {
        "w": "orambhāgiyānaṁ",
        "gloss": "belonging to the lower part (the lower fetters)",
        "gram": "adj. gen. pl. nt.; cpd.",
        "ped": "PED s.v. orambhagiya"
      },
      {
        "w": "saṁyojanānaṁ",
        "gloss": "of the fetters",
        "gram": "gen. pl. nt.",
        "ped": "PED s.v. saṁyojana"
      },
      {
        "w": "parikkhayā",
        "gloss": "through the exhaustion/ending (of the fetters)",
        "gram": "abl. sg. m.",
        "ped": "PED s.v. parikkhaya"
      },
      {
        "w": "opapātikā",
        "gloss": "of spontaneous rebirth (arising without parents)",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. opapatika"
      },
      {
        "w": "tattha",
        "gloss": "there, in that place",
        "gram": "indecl.",
        "ped": "PED s.v. tattha"
      },
      {
        "w": "parinibbāyino",
        "gloss": "who attain final Nibbana (there)",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. parinibbayin"
      },
      {
        "w": "anāvattidhammā",
        "gloss": "not liable to return (from that world)",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. avatti"
      },
      {
        "w": "tasmā",
        "gloss": "therefore",
        "gram": "abl. sg. used adverbially",
        "ped": "PED s.v. ta"
      },
      {
        "w": "lokā—",
        "gloss": "from the world",
        "gram": "abl. sg. m.",
        "ped": "PED s.v. loka"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who, with the ending of the five lower fetters are reborn spontaneously. They are extinguished there, and are not liable to return from that world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:10.2",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:11.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe tiṇṇaṁ saṁyojanānaṁ parikkhayā rāgadosamohānaṁ tanuttā sakadāgāmino sakideva imaṁ lokaṁ āgantvā dukkhassantaṁ karissanti—",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "tiṇṇaṁ",
        "gloss": "of three",
        "gram": "num. gen.",
        "ped": "PED s.v. ti"
      },
      {
        "w": "saṁyojanānaṁ",
        "gloss": "of the fetters",
        "gram": "gen. pl. nt.",
        "ped": "PED s.v. saṁyojana"
      },
      {
        "w": "parikkhayā",
        "gloss": "through the exhaustion/ending (of the fetters)",
        "gram": "abl. sg. m.",
        "ped": "PED s.v. parikkhaya"
      },
      {
        "w": "rāgadosamohānaṁ",
        "gloss": "of greed, hate and delusion",
        "gram": "gen. pl. m.; dvandva cpd.",
        "ped": "PED s.v. raga"
      },
      {
        "w": "tanuttā",
        "gloss": "through the attenuation/weakening",
        "gram": "abl. sg. nt.",
        "ped": "PED s.v. tanu"
      },
      {
        "w": "sakadāgāmino",
        "gloss": "once-returners",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. sakadagamin"
      },
      {
        "w": "sakideva",
        "gloss": "(sakiṁ + eva) just once, this once only",
        "gram": "adv. + emph.; sandhi",
        "ped": "PED s.v. sakiṁ"
      },
      {
        "w": "imaṁ",
        "gloss": "this",
        "gram": "dem. acc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "lokaṁ",
        "gloss": "the world",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. loka"
      },
      {
        "w": "āgantvā",
        "gloss": "having come",
        "gram": "ger. of agacchati",
        "ped": "PED s.v. agacchati"
      },
      {
        "w": "dukkhassantaṁ",
        "gloss": "(dukkhassa + antaṁ) the end of suffering",
        "gram": "gen. sg. + acc. sg.; sandhi",
        "ped": "PED s.v. dukkha"
      },
      {
        "w": "karissanti—",
        "gloss": "they will make/do (here: make an end)",
        "gram": "fut. 3 pl. of karoti",
        "ped": "PED s.v. karoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who, with the ending of three fetters, and the weakening of greed, hate, and delusion, are once-returners. They come back to this world once only, then make an end of suffering.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:11.2",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:12.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe tiṇṇaṁ saṁyojanānaṁ parikkhayā sotāpannā avinipātadhammā niyatā sambodhiparāyanā—",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "tiṇṇaṁ",
        "gloss": "of three",
        "gram": "num. gen.",
        "ped": "PED s.v. ti"
      },
      {
        "w": "saṁyojanānaṁ",
        "gloss": "of the fetters",
        "gram": "gen. pl. nt.",
        "ped": "PED s.v. saṁyojana"
      },
      {
        "w": "parikkhayā",
        "gloss": "through the exhaustion/ending (of the fetters)",
        "gram": "abl. sg. m.",
        "ped": "PED s.v. parikkhaya"
      },
      {
        "w": "sotāpannā",
        "gloss": "stream-enterers",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. sotapanna"
      },
      {
        "w": "avinipātadhammā",
        "gloss": "not liable to fall into loss / the lower realms",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. vinipata"
      },
      {
        "w": "niyatā",
        "gloss": "fixed in destiny, assured",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. niyata"
      },
      {
        "w": "sambodhiparāyanā—",
        "gloss": "bound for / destined for awakening",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. parayana"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who, with the ending of three fetters are stream-enterers, not liable to be reborn in the underworld, assured, destined for awakening.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:12.2",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:13.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe catunnaṁ satipaṭṭhānānaṁ bhāvanānuyogamanuyuttā viharanti—",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "catunnaṁ",
        "gloss": "of four",
        "gram": "num. gen.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhānānaṁ",
        "gloss": "of the foundations of mindfulness",
        "gram": "gen. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "bhāvanānuyogamanuyuttā",
        "gloss": "devoted to the pursuit of development/meditation",
        "gram": "nom. pl. m.; cpd.",
        "ped": "PED s.v. bhavana"
      },
      {
        "w": "viharanti—",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who are committed to developing the four kinds of mindfulness meditation …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:13.2",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:14.1",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe catunnaṁ sammappadhānānaṁ bhāvanānuyogamanuyuttā viharanti …pe…",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "catunnaṁ",
        "gloss": "of four",
        "gram": "num. gen.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "sammappadhānānaṁ",
        "gloss": "of the right efforts/exertions",
        "gram": "gen. pl. nt.; cpd.",
        "ped": "PED s.v. padhana"
      },
      {
        "w": "bhāvanānuyogamanuyuttā",
        "gloss": "devoted to the pursuit of development/meditation",
        "gram": "nom. pl. m.; cpd.",
        "ped": "PED s.v. bhavana"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…pe…",
        "gloss": "peyyala: the canonical abbreviation \"…pe…\" (pe = peyyala) signalling an omitted repeated passage",
        "gram": "editorial marker",
        "ped": "PED s.v. peyyala"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the four right efforts …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.2",
    "section": "The kinds of mendicants present",
    "pali": "catunnaṁ iddhipādānaṁ …",
    "kind": "full",
    "words": [
      {
        "w": "catunnaṁ",
        "gloss": "of four",
        "gram": "num. gen.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "iddhipādānaṁ",
        "gloss": "of the bases of spiritual power",
        "gram": "gen. pl. m.; cpd.",
        "ped": "PED s.v. iddhipada"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the four bases of psychic power …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.3",
    "section": "The kinds of mendicants present",
    "pali": "pañcannaṁ indriyānaṁ …",
    "kind": "full",
    "words": [
      {
        "w": "pañcannaṁ",
        "gloss": "of five",
        "gram": "num. gen.",
        "ped": "PED s.v. pañca"
      },
      {
        "w": "indriyānaṁ",
        "gloss": "of the [five spiritual] faculties",
        "gram": "gen. pl. nt.",
        "ped": "PED s.v. indriya"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the five faculties …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.4",
    "section": "The kinds of mendicants present",
    "pali": "pañcannaṁ balānaṁ …",
    "kind": "full",
    "words": [
      {
        "w": "pañcannaṁ",
        "gloss": "of five",
        "gram": "num. gen.",
        "ped": "PED s.v. pañca"
      },
      {
        "w": "balānaṁ",
        "gloss": "of the [five spiritual] powers",
        "gram": "gen. pl. nt. (bala)",
        "ped": "PED s.v. bala"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the five powers …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.5",
    "section": "The kinds of mendicants present",
    "pali": "sattannaṁ bojjhaṅgānaṁ …",
    "kind": "full",
    "words": [
      {
        "w": "sattannaṁ",
        "gloss": "of seven",
        "gram": "num. gen.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅgānaṁ",
        "gloss": "of the awakening-factors",
        "gram": "gen. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the seven awakening factors …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.6",
    "section": "The kinds of mendicants present",
    "pali": "ariyassa aṭṭhaṅgikassa maggassa bhāvanānuyogamanuyuttā viharanti—",
    "kind": "full",
    "words": [
      {
        "w": "ariyassa",
        "gloss": "of the noble (path)",
        "gram": "gen. sg. m. adj.",
        "ped": "PED s.v. ariya"
      },
      {
        "w": "aṭṭhaṅgikassa",
        "gloss": "eightfold",
        "gram": "adj. gen. sg. m.",
        "ped": "PED s.v. aṭṭhaṅgika"
      },
      {
        "w": "maggassa",
        "gloss": "of the path",
        "gram": "gen. sg. m.",
        "ped": "PED s.v. magga"
      },
      {
        "w": "bhāvanānuyogamanuyuttā",
        "gloss": "devoted to the pursuit of development/meditation",
        "gram": "nom. pl. m.; cpd.",
        "ped": "PED s.v. bhavana"
      },
      {
        "w": "viharanti—",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "the noble eightfold path.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.7",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.8",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe mettābhāvanānuyogamanuyuttā viharanti …",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "mettābhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing loving-kindness",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. metta"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who are committed to developing the meditation on love …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.9",
    "section": "The kinds of mendicants present",
    "pali": "karuṇābhāvanānuyogamanuyuttā viharanti …",
    "kind": "full",
    "words": [
      {
        "w": "karuṇābhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing compassion",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. karuṇa"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "compassion …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.10",
    "section": "The kinds of mendicants present",
    "pali": "muditābhāvanānuyogamanuyuttā viharanti …",
    "kind": "full",
    "words": [
      {
        "w": "muditābhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing rejoicing (sympathetic gladness)",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. mudita"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "rejoicing …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.11",
    "section": "The kinds of mendicants present",
    "pali": "upekkhābhāvanānuyogamanuyuttā viharanti …",
    "kind": "full",
    "words": [
      {
        "w": "upekkhābhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing equanimity",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "equanimity …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.12",
    "section": "The kinds of mendicants present",
    "pali": "asubhabhāvanānuyogamanuyuttā viharanti …",
    "kind": "full",
    "words": [
      {
        "w": "asubhabhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing [the perception of] ugliness/foulness",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. asubha"
      },
      {
        "w": "viharanti",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "ugliness …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.13",
    "section": "The kinds of mendicants present",
    "pali": "aniccasaññābhāvanānuyogamanuyuttā viharanti—",
    "kind": "full",
    "words": [
      {
        "w": "aniccasaññābhāvanānuyogamanuyuttā",
        "gloss": "devoted to developing the perception of impermanence",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. sañña"
      },
      {
        "w": "viharanti—",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "impermanence.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.14",
    "section": "The kinds of mendicants present",
    "pali": "evarūpāpi, bhikkhave, santi bhikkhū imasmiṁ bhikkhusaṅghe.",
    "kind": "refrain-use",
    "refrain": "mn118-evarupapi",
    "substitutions": {},
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There are such mendicants in this Saṅgha.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:14.15",
    "section": "The kinds of mendicants present",
    "pali": "Santi, bhikkhave, bhikkhū imasmiṁ bhikkhusaṅghe ānāpānassatibhāvanānuyogamanuyuttā viharanti.",
    "kind": "full",
    "words": [
      {
        "w": "Santi,",
        "gloss": "there are, exist",
        "gram": "pres. 3 pl. of atthi",
        "ped": "PED s.v. atthi"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "imasmiṁ",
        "gloss": "in this",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "bhikkhusaṅghe",
        "gloss": "in the Sangha of monks",
        "gram": "loc. sg. m.; cpd.",
        "ped": "PED s.v. saṅgha"
      },
      {
        "w": "ānāpānassatibhāvanānuyogamanuyuttā",
        "gloss": "devoted to the pursuit of developing mindfulness of breathing",
        "gram": "nom. pl. m.; long cpd.",
        "ped": "PED s.v. bhavana"
      },
      {
        "w": "viharanti.",
        "gloss": "they dwell, abide",
        "gram": "pres. 3 pl. of viharati",
        "ped": "PED s.v. viharati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "In this Saṅgha there are mendicants who are committed to developing the meditation on mindfulness of breathing.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:15.1",
    "section": "Mindfulness of breathing is fruitful",
    "pali": "Ānāpānassati, bhikkhave, bhāvitā bahulīkatā mahapphalā hoti mahānisaṁsā.",
    "kind": "full",
    "words": [
      {
        "w": "Ānāpānassati,",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "mahapphalā",
        "gloss": "of great fruit, very fruitful",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. phala"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "mahānisaṁsā.",
        "gloss": "of great benefit/advantage",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. anisaṁsa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Mendicants, when mindfulness of breathing is developed and cultivated it is very fruitful and beneficial.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:15.2",
    "section": "Mindfulness of breathing is fruitful",
    "pali": "Ānāpānassati, bhikkhave, bhāvitā bahulīkatā cattāro satipaṭṭhāne paripūreti.",
    "kind": "full",
    "words": [
      {
        "w": "Ānāpānassati,",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhāne",
        "gloss": "the foundations of mindfulness",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "paripūreti.",
        "gloss": "fulfils, brings to fulfilment",
        "gram": "pres. 3 sg. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Mindfulness of breathing, when developed and cultivated, fulfills the four kinds of mindfulness meditation.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:15.3",
    "section": "Mindfulness of breathing is fruitful",
    "pali": "Cattāro satipaṭṭhānā bhāvitā bahulīkatā satta bojjhaṅge paripūrenti.",
    "kind": "full",
    "words": [
      {
        "w": "Cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhānā",
        "gloss": "the establishments/foundations of mindfulness",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅge",
        "gloss": "the awakening-factors",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "paripūrenti.",
        "gloss": "they fulfil, bring to completion",
        "gram": "pres. 3 pl. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "The four kinds of mindfulness meditation, when developed and cultivated, fulfill the seven awakening factors.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:15.4",
    "section": "Mindfulness of breathing is fruitful",
    "pali": "Satta bojjhaṅgā bhāvitā bahulīkatā vijjāvimuttiṁ paripūrenti.",
    "kind": "full",
    "words": [
      {
        "w": "Satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅgā",
        "gloss": "awakening-factors",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "vijjāvimuttiṁ",
        "gloss": "knowledge-and-liberation (vijja + vimutti)",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. vijja"
      },
      {
        "w": "paripūrenti.",
        "gloss": "they fulfil, bring to completion",
        "gram": "pres. 3 pl. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And the seven awakening factors, when developed and cultivated, fulfill knowledge and freedom.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:16.1",
    "section": "The question restated",
    "pali": "Kathaṁ bhāvitā ca, bhikkhave, ānāpānassati kathaṁ bahulīkatā mahapphalā hoti mahānisaṁsā?",
    "kind": "full",
    "words": [
      {
        "w": "Kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ānāpānassati",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "mahapphalā",
        "gloss": "of great fruit, very fruitful",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. phala"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "mahānisaṁsā?",
        "gloss": "of great benefit/advantage",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. anisaṁsa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And how is mindfulness of breathing developed and cultivated to be very fruitful and beneficial?",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:17.1",
    "section": "Sitting down to meditate",
    "pali": "Idha, bhikkhave, bhikkhu araññagato vā rukkhamūlagato vā suññāgāragato vā nisīdati pallaṅkaṁ ābhujitvā ujuṁ kāyaṁ paṇidhāya parimukhaṁ satiṁ upaṭṭhapetvā.",
    "kind": "full",
    "words": [
      {
        "w": "Idha,",
        "gloss": "here, in this case (in this teaching)",
        "gram": "indecl.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "araññagato",
        "gloss": "gone to a wilderness/forest",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. arañña"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "rukkhamūlagato",
        "gloss": "gone to the root of a tree",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. rukkhamula"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "suññāgāragato",
        "gloss": "gone to an empty dwelling/hut",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. suññagara"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "nisīdati",
        "gloss": "sits down",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. nisidati"
      },
      {
        "w": "pallaṅkaṁ",
        "gloss": "the cross-legged (sitting) posture",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. pallaṅka"
      },
      {
        "w": "ābhujitvā",
        "gloss": "having bent/folded (the legs) crosswise",
        "gram": "ger. of abhujati",
        "ped": "PED s.v. abhujati"
      },
      {
        "w": "ujuṁ",
        "gloss": "straight, upright",
        "gram": "adj. acc. sg. m.",
        "ped": "PED s.v. uju"
      },
      {
        "w": "kāyaṁ",
        "gloss": "the body",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "paṇidhāya",
        "gloss": "having set/directed (the body straight)",
        "gram": "ger. of paṇidahati",
        "ped": "PED s.v. paṇidahati"
      },
      {
        "w": "parimukhaṁ",
        "gloss": "to the fore, in front (mindfulness set up \"in front\")",
        "gram": "adv./acc.",
        "ped": "PED s.v. parimukha"
      },
      {
        "w": "satiṁ",
        "gloss": "mindfulness",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "upaṭṭhapetvā.",
        "gloss": "having set up, established (mindfulness)",
        "gram": "ger. caus. of upaṭṭhati",
        "ped": "PED s.v. upaṭṭhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "It’s when a mendicant—gone to a wilderness, or to the root of a tree, or to an empty hut—sits down cross-legged, sets their body straight, and brings mindfulness to the present.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:17.2",
    "section": "Sitting down to meditate",
    "pali": "So satova assasati satova passasati.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "satova",
        "gloss": "(sato + eva) just mindful, mindful indeed",
        "gram": "ppp./adj. nom. sg. m. + emph.; sandhi",
        "ped": "PED s.v. sata"
      },
      {
        "w": "assasati",
        "gloss": "breathes in (Sujato); \"breathes out\" in the Theravada commentaries — CRUX, flagged both ways",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "satova",
        "gloss": "(sato + eva) just mindful, mindful indeed",
        "gram": "ppp./adj. nom. sg. m. + emph.; sandhi",
        "ped": "PED s.v. sata"
      },
      {
        "w": "passasati.",
        "gloss": "breathes out (Sujato); \"breathes in\" in the Theravada commentaries — CRUX",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passasati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Just mindful, they breathe in. Mindful, they breathe out.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "CRUX (assasati / passasati): Sujato renders assasati \"breathe in\" and passasati \"breathe out\". The Theravāda commentaries (Vism VIII.164, Paṭisambhidāmagga) hold the reverse — assāsa = the out-breath, passāsa = the in-breath — while the Sanskrit/Sarvāstivāda usage (āśvāsa = in) agrees with Sujato. Flagged both ways; not resolved."
  },
  {
    "ref": "mn118:18.1",
    "section": "The sixteen steps",
    "tetrad": 1,
    "pali": "Dīghaṁ vā assasanto ‘dīghaṁ assasāmī’ti pajānāti, dīghaṁ vā passasanto ‘dīghaṁ passasāmī’ti pajānāti;",
    "kind": "full",
    "words": [
      {
        "w": "Dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "assasanto",
        "gloss": "breathing in (Sujato; out-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "‘dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "assasāmī’ti",
        "gloss": "(assasami + iti) \"I breathe in\" + quotative — CRUX: rendered \"breathe in\" by Sujato; the commentaries take assasa as the out-breath",
        "gram": "pres. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "pajānāti,",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      },
      {
        "w": "dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "passasanto",
        "gloss": "breathing out (Sujato; in-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "‘dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "passasāmī’ti",
        "gloss": "(passasami + iti) \"I breathe out\" + quotative — CRUX: \"breathe out\" (Sujato); the commentaries take passasa as the in-breath",
        "gram": "pres. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "pajānāti;",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Breathing in heavily they know: ‘I’m breathing in heavily.’ Breathing out heavily they know: ‘I’m breathing out heavily.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:18.2",
    "section": "The sixteen steps",
    "tetrad": 1,
    "pali": "rassaṁ vā assasanto ‘rassaṁ assasāmī’ti pajānāti, rassaṁ vā passasanto ‘rassaṁ passasāmī’ti pajānāti;",
    "kind": "full",
    "words": [
      {
        "w": "rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "assasanto",
        "gloss": "breathing in (Sujato; out-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "‘rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "assasāmī’ti",
        "gloss": "(assasami + iti) \"I breathe in\" + quotative — CRUX: rendered \"breathe in\" by Sujato; the commentaries take assasa as the out-breath",
        "gram": "pres. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "pajānāti,",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      },
      {
        "w": "rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "passasanto",
        "gloss": "breathing out (Sujato; in-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "‘rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "passasāmī’ti",
        "gloss": "(passasami + iti) \"I breathe out\" + quotative — CRUX: \"breathe out\" (Sujato); the commentaries take passasa as the in-breath",
        "gram": "pres. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "pajānāti;",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "When breathing in lightly they know: ‘I’m breathing in lightly.’ Breathing out lightly they know: ‘I’m breathing out lightly.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:18.3",
    "section": "The sixteen steps",
    "tetrad": 1,
    "pali": "‘sabbakāyapaṭisaṁvedī assasissāmī’ti sikkhati, ‘sabbakāyapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "PH2": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in experiencing the whole body.’ They practice like this: ‘I’ll breathe out experiencing the whole body.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "CRUX (sabbakāyapaṭisaṁvedī): \"experiencing the whole body\" (Sujato, modern readers = the entire physical body) vs the commentarial reading kāya = the \"breath-body\" (assāsapassāsa-kāya), i.e. sensitivity to the whole length — beginning, middle, end — of the breath (Vism VIII.171). Both positions cited, not resolved."
  },
  {
    "ref": "mn118:18.4",
    "section": "The sixteen steps",
    "tetrad": 1,
    "pali": "‘passambhayaṁ kāyasaṅkhāraṁ assasissāmī’ti sikkhati, ‘passambhayaṁ kāyasaṅkhāraṁ passasissāmī’ti sikkhati.",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘passambhayaṁ",
        "kāyasaṅkhāraṁ"
      ],
      "PH2": [
        "‘passambhayaṁ",
        "kāyasaṅkhāraṁ"
      ],
      "LAST": [
        "sikkhati."
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in stilling the physical process.’ They practice like this: ‘I’ll breathe out stilling the physical process.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:19.1",
    "section": "The sixteen steps",
    "tetrad": 2,
    "pali": "‘Pītipaṭisaṁvedī assasissāmī’ti sikkhati, ‘pītipaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘Pītipaṭisaṁvedī"
      ],
      "PH2": [
        "‘pītipaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in experiencing rapture.’ They practice like this: ‘I’ll breathe out experiencing rapture.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:19.2",
    "section": "The sixteen steps",
    "tetrad": 2,
    "pali": "‘sukhapaṭisaṁvedī assasissāmī’ti sikkhati, ‘sukhapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘sukhapaṭisaṁvedī"
      ],
      "PH2": [
        "‘sukhapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in experiencing bliss.’ They practice like this: ‘I’ll breathe out experiencing bliss.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:19.3",
    "section": "The sixteen steps",
    "tetrad": 2,
    "pali": "‘cittasaṅkhārapaṭisaṁvedī assasissāmī’ti sikkhati, ‘cittasaṅkhārapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘cittasaṅkhārapaṭisaṁvedī"
      ],
      "PH2": [
        "‘cittasaṅkhārapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in experiencing the mental process.’ They practice like this: ‘I’ll breathe out experiencing the mental process.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:19.4",
    "section": "The sixteen steps",
    "tetrad": 2,
    "pali": "‘passambhayaṁ cittasaṅkhāraṁ assasissāmī’ti sikkhati, ‘passambhayaṁ cittasaṅkhāraṁ passasissāmī’ti sikkhati.",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘passambhayaṁ",
        "cittasaṅkhāraṁ"
      ],
      "PH2": [
        "‘passambhayaṁ",
        "cittasaṅkhāraṁ"
      ],
      "LAST": [
        "sikkhati."
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in stilling the mental process.’ They practice like this: ‘I’ll breathe out stilling the mental process.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:20.1",
    "section": "The sixteen steps",
    "tetrad": 3,
    "pali": "‘Cittapaṭisaṁvedī assasissāmī’ti sikkhati, ‘cittapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘Cittapaṭisaṁvedī"
      ],
      "PH2": [
        "‘cittapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in experiencing the mind.’ They practice like this: ‘I’ll breathe out experiencing the mind.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:20.2",
    "section": "The sixteen steps",
    "tetrad": 3,
    "pali": "‘abhippamodayaṁ cittaṁ assasissāmī’ti sikkhati, ‘abhippamodayaṁ cittaṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘abhippamodayaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘abhippamodayaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in gladdening the mind.’ They practice like this: ‘I’ll breathe out gladdening the mind.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:20.3",
    "section": "The sixteen steps",
    "tetrad": 3,
    "pali": "‘samādahaṁ cittaṁ assasissāmī’ti sikkhati, ‘samādahaṁ cittaṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘samādahaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘samādahaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in immersing the mind in samādhi.’ They practice like this: ‘I’ll breathe out immersing the mind in samādhi.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:20.4",
    "section": "The sixteen steps",
    "tetrad": 3,
    "pali": "‘vimocayaṁ cittaṁ assasissāmī’ti sikkhati, ‘vimocayaṁ cittaṁ passasissāmī’ti sikkhati.",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘vimocayaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘vimocayaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati."
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in freeing the mind.’ They practice like this: ‘I’ll breathe out freeing the mind.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:21.1",
    "section": "The sixteen steps",
    "tetrad": 4,
    "pali": "‘Aniccānupassī assasissāmī’ti sikkhati, ‘aniccānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘Aniccānupassī"
      ],
      "PH2": [
        "‘aniccānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in observing impermanence.’ They practice like this: ‘I’ll breathe out observing impermanence.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:21.2",
    "section": "The sixteen steps",
    "tetrad": 4,
    "pali": "‘virāgānupassī assasissāmī’ti sikkhati, ‘virāgānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘virāgānupassī"
      ],
      "PH2": [
        "‘virāgānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in observing fading away.’ They practice like this: ‘I’ll breathe out observing fading away.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:21.3",
    "section": "The sixteen steps",
    "tetrad": 4,
    "pali": "‘nirodhānupassī assasissāmī’ti sikkhati, ‘nirodhānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘nirodhānupassī"
      ],
      "PH2": [
        "‘nirodhānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in observing cessation.’ They practice like this: ‘I’ll breathe out observing cessation.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:21.4",
    "section": "The sixteen steps",
    "tetrad": 4,
    "pali": "‘paṭinissaggānupassī assasissāmī’ti sikkhati, ‘paṭinissaggānupassī passasissāmī’ti sikkhati.",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘paṭinissaggānupassī"
      ],
      "PH2": [
        "‘paṭinissaggānupassī"
      ],
      "LAST": [
        "sikkhati."
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They practice like this: ‘I’ll breathe in observing letting go.’ They practice like this: ‘I’ll breathe out observing letting go.’",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:22.1",
    "section": "Conclusion of the sixteen steps",
    "pali": "Evaṁ bhāvitā kho, bhikkhave, ānāpānassati evaṁ bahulīkatā mahapphalā hoti mahānisaṁsā.",
    "kind": "full",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "kho,",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ānāpānassati",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "mahapphalā",
        "gloss": "of great fruit, very fruitful",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. phala"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "mahānisaṁsā.",
        "gloss": "of great benefit/advantage",
        "gram": "adj. nom. sg. f.; cpd.",
        "ped": "PED s.v. anisaṁsa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Mindfulness of breathing, when developed and cultivated in this way, is very fruitful and beneficial.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:23.1",
    "section": "Fulfilling the four satipaṭṭhānas — question",
    "pali": "Kathaṁ bhāvitā ca, bhikkhave, ānāpānassati kathaṁ bahulīkatā cattāro satipaṭṭhāne paripūreti?",
    "kind": "full",
    "words": [
      {
        "w": "Kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ānāpānassati",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhāne",
        "gloss": "the foundations of mindfulness",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "paripūreti?",
        "gloss": "fulfils, brings to fulfilment",
        "gram": "pres. 3 sg. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And how is mindfulness of breathing developed and cultivated so as to fulfill the four kinds of mindfulness meditation?",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:24.1",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu dīghaṁ vā assasanto ‘dīghaṁ assasāmī’ti pajānāti, dīghaṁ vā passasanto ‘dīghaṁ passasāmī’ti pajānāti;",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "assasanto",
        "gloss": "breathing in (Sujato; out-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "‘dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "assasāmī’ti",
        "gloss": "(assasami + iti) \"I breathe in\" + quotative — CRUX: rendered \"breathe in\" by Sujato; the commentaries take assasa as the out-breath",
        "gram": "pres. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "pajānāti,",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      },
      {
        "w": "dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "passasanto",
        "gloss": "breathing out (Sujato; in-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "‘dīghaṁ",
        "gloss": "long; (adv.) deeply/heavily (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. digha"
      },
      {
        "w": "passasāmī’ti",
        "gloss": "(passasami + iti) \"I breathe out\" + quotative — CRUX: \"breathe out\" (Sujato); the commentaries take passasa as the in-breath",
        "gram": "pres. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "pajānāti;",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant knows that they breathe heavily,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:24.2",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "rassaṁ vā assasanto ‘rassaṁ assasāmī’ti pajānāti, rassaṁ vā passasanto ‘rassaṁ passasāmī’ti pajānāti;",
    "kind": "full",
    "words": [
      {
        "w": "rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "assasanto",
        "gloss": "breathing in (Sujato; out-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "‘rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "assasāmī’ti",
        "gloss": "(assasami + iti) \"I breathe in\" + quotative — CRUX: rendered \"breathe in\" by Sujato; the commentaries take assasa as the out-breath",
        "gram": "pres. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "pajānāti,",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      },
      {
        "w": "rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "vā",
        "gloss": "or; (repeated) either...or",
        "gram": "indecl.",
        "ped": "PED s.v. va"
      },
      {
        "w": "passasanto",
        "gloss": "breathing out (Sujato; in-breath in the commentaries)",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "‘rassaṁ",
        "gloss": "short; (adv.) lightly/shallowly (of the breath)",
        "gram": "adj. acc. sg. nt. used adverbially",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "passasāmī’ti",
        "gloss": "(passasami + iti) \"I breathe out\" + quotative — CRUX: \"breathe out\" (Sujato); the commentaries take passasa as the in-breath",
        "gram": "pres. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "pajānāti;",
        "gloss": "clearly knows, discerns",
        "gram": "pres. 3 sg. of pajanati",
        "ped": "PED s.v. pajanati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or lightly,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:24.3",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "‘sabbakāyapaṭisaṁvedī assasissāmī’ti sikkhati, ‘sabbakāyapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "PH2": [
        "‘sabbakāyapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or experiencing the whole body,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Same sabbakāyapaṭisaṁvedī crux as 18.3 (whole physical body vs breath-body); see the sixteen-steps note."
  },
  {
    "ref": "mn118:24.4",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "‘passambhayaṁ kāyasaṅkhāraṁ assasissāmī’ti sikkhati, ‘passambhayaṁ kāyasaṅkhāraṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘passambhayaṁ",
        "kāyasaṅkhāraṁ"
      ],
      "PH2": [
        "‘passambhayaṁ",
        "kāyasaṅkhāraṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or stilling the physical process—",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:24.5",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "kāye kāyānupassī, bhikkhave, tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-dwelling",
    "substitutions": {
      "ANUP": [
        "kāye",
        "kāyānupassī,"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "at that time they’re meditating by observing an aspect of the body—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:24.6",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "Kāyesu kāyaññatarāhaṁ, bhikkhave, evaṁ vadāmi yadidaṁ—assāsapassāsā.",
    "kind": "full",
    "words": [
      {
        "w": "Kāyesu",
        "gloss": "among bodies (i.e. among the kinds of body)",
        "gram": "loc. pl. m.",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "kāyaññatarāhaṁ,",
        "gloss": "(kaya-aññataraṁ + ahaṁ) \"a certain [kind of] body ... I [say]\"",
        "gram": "acc. sg. + pron.; sandhi/cpd.",
        "ped": "PED s.v. aññatara"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "vadāmi",
        "gloss": "I say, I declare",
        "gram": "pres. 1 sg. of vadati",
        "ped": "PED s.v. vadati"
      },
      {
        "w": "yadidaṁ—assāsapassāsā.",
        "gloss": "(yad idaṁ) \"namely\" + assasa-passasa, the in-breaths and out-breaths",
        "gram": "rel. + nom. pl. m.; cpd.",
        "ped": "PED s.v. assasa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "For I say that the in-breaths and out-breaths are an aspect of the body.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "CRUX (kāyesu kāyaññatara): the Buddha explains why breathing counts as body-contemplation — \"the in-and-out breaths are a certain body among bodies\" (kāyesu kāya-aññatara). Sujato: \"an aspect of the body\". The commentary glosses kāya here as one of the four primary-element bodies (the wind/air body); moderns often read it non-technically as \"one kind of bodily phenomenon\". Cited, not resolved."
  },
  {
    "ref": "mn118:24.7",
    "section": "First tetrad → contemplating the body",
    "tetrad": 1,
    "pali": "Tasmātiha, bhikkhave, kāye kāyānupassī tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-tasmatiha",
    "substitutions": {
      "ANUP2": [
        "kāye",
        "kāyānupassī"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s why at that time a mendicant is meditating by observing an aspect of the body—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.1",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu ‘pītipaṭisaṁvedī assasissāmī’ti sikkhati, ‘pītipaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "‘pītipaṭisaṁvedī",
        "gloss": "experiencing rapture",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "assasissāmī’ti",
        "gloss": "(assasissami + iti) \"I shall breathe in\" + quotative",
        "gram": "fut. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "sikkhati,",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      },
      {
        "w": "‘pītipaṭisaṁvedī",
        "gloss": "experiencing rapture",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "passasissāmī’ti",
        "gloss": "(passasissami + iti) \"I shall breathe out\" + quotative",
        "gram": "fut. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "sikkhati;",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant practices breathing while experiencing rapture,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.2",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "‘sukhapaṭisaṁvedī assasissāmī’ti sikkhati, ‘sukhapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘sukhapaṭisaṁvedī"
      ],
      "PH2": [
        "‘sukhapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or experiencing bliss,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.3",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "‘cittasaṅkhārapaṭisaṁvedī assasissāmī’ti sikkhati, ‘cittasaṅkhārapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘cittasaṅkhārapaṭisaṁvedī"
      ],
      "PH2": [
        "‘cittasaṅkhārapaṭisaṁvedī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or experiencing the mental process,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.4",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "‘passambhayaṁ cittasaṅkhāraṁ assasissāmī’ti sikkhati, ‘passambhayaṁ cittasaṅkhāraṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘passambhayaṁ",
        "cittasaṅkhāraṁ"
      ],
      "PH2": [
        "‘passambhayaṁ",
        "cittasaṅkhāraṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or stilling the mental process—",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.5",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "vedanāsu vedanānupassī, bhikkhave, tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-dwelling",
    "substitutions": {
      "ANUP": [
        "vedanāsu",
        "vedanānupassī,"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "at that time they meditate observing an aspect of feelings—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:25.6",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "Vedanāsu vedanāññatarāhaṁ, bhikkhave, evaṁ vadāmi yadidaṁ—assāsapassāsānaṁ sādhukaṁ manasikāraṁ.",
    "kind": "full",
    "words": [
      {
        "w": "Vedanāsu",
        "gloss": "among feelings, in feelings",
        "gram": "loc. pl. f.",
        "ped": "PED s.v. vedana"
      },
      {
        "w": "vedanāññatarāhaṁ,",
        "gloss": "(vedana-aññataraṁ + ahaṁ) \"a certain [kind of] feeling ... I [say]\"",
        "gram": "acc. sg. + pron.; sandhi/cpd.",
        "ped": "PED s.v. aññatara"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "vadāmi",
        "gloss": "I say, I declare",
        "gram": "pres. 1 sg. of vadati",
        "ped": "PED s.v. vadati"
      },
      {
        "w": "yadidaṁ—assāsapassāsānaṁ",
        "gloss": "(yad idaṁ) \"namely\" + assasa-passasanaṁ, of the in-and-out breaths",
        "gram": "rel. + gen. pl. m.; cpd.",
        "ped": "PED s.v. assasa"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "manasikāraṁ.",
        "gloss": "attention, application of mind",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. manasikara"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "For I say that careful application of mind to the in-breaths and out-breaths is an aspect of feelings.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Parallel to 24.6 for feelings: careful attention to the breaths is called \"a certain feeling among feelings\" (vedanāsu vedanā-aññatara)."
  },
  {
    "ref": "mn118:25.7",
    "section": "Second tetrad → contemplating feelings",
    "tetrad": 2,
    "pali": "Tasmātiha, bhikkhave, vedanāsu vedanānupassī tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-tasmatiha",
    "substitutions": {
      "ANUP2": [
        "vedanāsu",
        "vedanānupassī"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s why at that time a mendicant is meditating by observing an aspect of feelings—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.1",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu ‘cittapaṭisaṁvedī assasissāmī’ti sikkhati, ‘cittapaṭisaṁvedī passasissāmī’ti sikkhati;",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "‘cittapaṭisaṁvedī",
        "gloss": "experiencing the mind",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "assasissāmī’ti",
        "gloss": "(assasissami + iti) \"I shall breathe in\" + quotative",
        "gram": "fut. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "sikkhati,",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      },
      {
        "w": "‘cittapaṭisaṁvedī",
        "gloss": "experiencing the mind",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. paṭisaṁvedin"
      },
      {
        "w": "passasissāmī’ti",
        "gloss": "(passasissami + iti) \"I shall breathe out\" + quotative",
        "gram": "fut. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "sikkhati;",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant practices breathing while experiencing the mind,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.2",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "‘abhippamodayaṁ cittaṁ assasissāmī’ti sikkhati, ‘abhippamodayaṁ cittaṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘abhippamodayaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘abhippamodayaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or gladdening the mind,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.3",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "‘samādahaṁ cittaṁ assasissāmī’ti sikkhati, ‘samādahaṁ cittaṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘samādahaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘samādahaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or immersing the mind in samādhi,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.4",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "‘vimocayaṁ cittaṁ assasissāmī’ti sikkhati, ‘vimocayaṁ cittaṁ passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘vimocayaṁ",
        "cittaṁ"
      ],
      "PH2": [
        "‘vimocayaṁ",
        "cittaṁ"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or freeing the mind—",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.5",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "citte cittānupassī, bhikkhave, tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-dwelling",
    "substitutions": {
      "ANUP": [
        "citte",
        "cittānupassī,"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "at that time they meditate observing an aspect of the mind—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.6",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "Nāhaṁ, bhikkhave, muṭṭhassatissa asampajānassa ānāpānassatiṁ vadāmi.",
    "kind": "full",
    "words": [
      {
        "w": "Nāhaṁ,",
        "gloss": "(na + ahaṁ) \"not I\"",
        "gram": "neg. + pron.; sandhi",
        "ped": "PED s.v. na"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "muṭṭhassatissa",
        "gloss": "of one of confused/lost mindfulness",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. muṭṭhassati"
      },
      {
        "w": "asampajānassa",
        "gloss": "of one lacking clear awareness",
        "gram": "gen. sg. m.; neg. adj.",
        "ped": "PED s.v. sampajana"
      },
      {
        "w": "ānāpānassatiṁ",
        "gloss": "mindfulness of breathing",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "vadāmi.",
        "gloss": "I say, I declare",
        "gram": "pres. 1 sg. of vadati",
        "ped": "PED s.v. vadati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "There is no development of mindfulness of breathing for someone who is unmindful and lacks awareness, I say.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:26.7",
    "section": "Third tetrad → contemplating the mind",
    "tetrad": 3,
    "pali": "Tasmātiha, bhikkhave, citte cittānupassī tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-tasmatiha",
    "substitutions": {
      "ANUP2": [
        "citte",
        "cittānupassī"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s why at that time a mendicant is meditating by observing an aspect of the mind—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.1",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu ‘aniccānupassī assasissāmī’ti sikkhati, ‘aniccānupassī passasissāmī’ti sikkhati;",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "‘aniccānupassī",
        "gloss": "observing impermanence (anicca + anupassin)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "assasissāmī’ti",
        "gloss": "(assasissami + iti) \"I shall breathe in\" + quotative",
        "gram": "fut. 1 sg. of assasati + indecl.",
        "ped": "PED s.v. assasati"
      },
      {
        "w": "sikkhati,",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      },
      {
        "w": "‘aniccānupassī",
        "gloss": "observing impermanence (anicca + anupassin)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "passasissāmī’ti",
        "gloss": "(passasissami + iti) \"I shall breathe out\" + quotative",
        "gram": "fut. 1 sg. of passasati + indecl.",
        "ped": "PED s.v. passasati"
      },
      {
        "w": "sikkhati;",
        "gloss": "trains, practises",
        "gram": "pres. 3 sg. of sikkhati",
        "ped": "PED s.v. sikkhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant practices breathing while observing impermanence,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.2",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "‘virāgānupassī assasissāmī’ti sikkhati, ‘virāgānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘virāgānupassī"
      ],
      "PH2": [
        "‘virāgānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or observing fading away,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.3",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "‘nirodhānupassī assasissāmī’ti sikkhati, ‘nirodhānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘nirodhānupassī"
      ],
      "PH2": [
        "‘nirodhānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or observing cessation,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.4",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "‘paṭinissaggānupassī assasissāmī’ti sikkhati, ‘paṭinissaggānupassī passasissāmī’ti sikkhati;",
    "kind": "refrain-use",
    "refrain": "mn118-sikkhati",
    "substitutions": {
      "PH1": [
        "‘paṭinissaggānupassī"
      ],
      "PH2": [
        "‘paṭinissaggānupassī"
      ],
      "LAST": [
        "sikkhati;"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "or observing letting go—",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.5",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "dhammesu dhammānupassī, bhikkhave, tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-dwelling",
    "substitutions": {
      "ANUP": [
        "dhammesu",
        "dhammānupassī,"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "at that time they meditate observing an aspect of principles—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.6",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "So yaṁ taṁ abhijjhādomanassānaṁ pahānaṁ taṁ paññāya disvā sādhukaṁ ajjhupekkhitā hoti.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "yaṁ",
        "gloss": "which, that (which)",
        "gram": "rel. pron. acc. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "abhijjhādomanassānaṁ",
        "gloss": "of covetousness and displeasure",
        "gram": "gen. pl.; dvandva cpd.",
        "ped": "PED s.v. abhijjha"
      },
      {
        "w": "pahānaṁ",
        "gloss": "giving up, abandoning",
        "gram": "nt. acc. sg.",
        "ped": "PED s.v. pahana"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "disvā",
        "gloss": "having seen",
        "gram": "ger. of passati (dassati)",
        "ped": "PED s.v. passati"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "ajjhupekkhitā",
        "gloss": "one who looks on with equanimity, an equable observer",
        "gram": "agent-noun nom. sg. m.",
        "ped": "PED s.v. ajjhupekkhati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Having seen with wisdom the giving up of covetousness and displeasure, they watch over closely with equanimity.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:27.7",
    "section": "Fourth tetrad → contemplating principles",
    "tetrad": 4,
    "pali": "Tasmātiha, bhikkhave, dhammesu dhammānupassī tasmiṁ samaye bhikkhu viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ.",
    "kind": "refrain-use",
    "refrain": "mn118-anupassana-tasmatiha",
    "substitutions": {
      "ANUP2": [
        "dhammesu",
        "dhammānupassī"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s why at that time a mendicant is meditating by observing an aspect of principles—keen, aware, and mindful, rid of covetousness and displeasure for the world.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:28.1",
    "section": "Conclusion (four satipaṭṭhānas)",
    "pali": "Evaṁ bhāvitā kho, bhikkhave, ānāpānassati evaṁ bahulīkatā cattāro satipaṭṭhāne paripūreti.",
    "kind": "full",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "kho,",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "ānāpānassati",
        "gloss": "mindfulness of breathing (anapana + sati)",
        "gram": "f. nom. sg.; tappurisa cpd.",
        "ped": "PED s.v. anapana"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhāne",
        "gloss": "the foundations of mindfulness",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "paripūreti.",
        "gloss": "fulfils, brings to fulfilment",
        "gram": "pres. 3 sg. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s how mindfulness of breathing, when developed and cultivated, fulfills the four kinds of mindfulness meditation.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:29.1",
    "section": "Fulfilling the seven awakening factors — question",
    "pali": "Kathaṁ bhāvitā ca, bhikkhave, cattāro satipaṭṭhānā kathaṁ bahulīkatā satta bojjhaṅge paripūrenti?",
    "kind": "full",
    "words": [
      {
        "w": "Kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhānā",
        "gloss": "the establishments/foundations of mindfulness",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅge",
        "gloss": "the awakening-factors",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "paripūrenti?",
        "gloss": "they fulfil, bring to completion",
        "gram": "pres. 3 pl. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And how are the four kinds of mindfulness meditation developed and cultivated so as to fulfill the seven awakening factors?",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:30.1",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu kāye kāyānupassī viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ, upaṭṭhitāssa tasmiṁ samaye sati hoti asammuṭṭhā.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "kāye",
        "gloss": "in the body",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "kāyānupassī",
        "gloss": "observing the body (contemplating the body as a body)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "ātāpī",
        "gloss": "ardent, keen, applying effort",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. atapin"
      },
      {
        "w": "sampajāno",
        "gloss": "clearly aware, fully attentive",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. sampajana"
      },
      {
        "w": "satimā",
        "gloss": "mindful",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. satimant"
      },
      {
        "w": "vineyya",
        "gloss": "having removed/dispelled",
        "gram": "ger. of vineti",
        "ped": "PED s.v. vineti"
      },
      {
        "w": "loke",
        "gloss": "in the world (i.e. regarding the world/body)",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. loka"
      },
      {
        "w": "abhijjhādomanassaṁ,",
        "gloss": "covetousness-and-displeasure (abhijjha + domanassa)",
        "gram": "acc. sg. nt.; dvandva cpd.",
        "ped": "PED s.v. abhijjha"
      },
      {
        "w": "upaṭṭhitāssa",
        "gloss": "(upaṭṭhita + assa) \"his [mindfulness] is established\"",
        "gram": "ppp. nom. sg. f. + gen. pron.; sandhi",
        "ped": "PED s.v. upaṭṭhati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "sati",
        "gloss": "mindfulness",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "asammuṭṭhā.",
        "gloss": "unconfused, not muddled",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. sammussati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant meditates by observing an aspect of the body, at that time their mindfulness is established and lucid.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:30.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno upaṭṭhitā sati hoti asammuṭṭhā, satisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti. Satisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, satisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "upaṭṭhitā",
        "gloss": "established, present, ready",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. upaṭṭhati"
      },
      {
        "w": "sati",
        "gloss": "mindfulness",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "asammuṭṭhā,",
        "gloss": "unconfused, not muddled",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. sammussati"
      },
      {
        "w": "satisambojjhaṅgo",
        "gloss": "the awakening-factor of mindfulness (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "Satisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of mindfulness (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "satisambojjhaṅgo",
        "gloss": "the awakening-factor of mindfulness (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of mindfulness; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:31.1",
    "section": "The seven awakening factors (body)",
    "pali": "So tathāsato viharanto taṁ dhammaṁ paññāya pavicinati pavicayati parivīmaṁsaṁ āpajjati.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "tathāsato",
        "gloss": "thus mindful",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. sata"
      },
      {
        "w": "viharanto",
        "gloss": "dwelling, abiding",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinati",
        "gloss": "investigates, discriminates, examines",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayati",
        "gloss": "investigates thoroughly (intensive of pavicinati)",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjati.",
        "gloss": "enters upon, undertakes",
        "gram": "pres. 3 sg. of apajjati",
        "ped": "PED s.v. apajjati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "As they live mindfully in this way they investigate, explore, and inquire into that principle with wisdom.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:31.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu tathāsato viharanto taṁ dhammaṁ paññāya pavicinati pavicayati parivīmaṁsaṁ āpajjati, dhammavicayasambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, dhammavicayasambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, dhammavicayasambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tathāsato",
        "gloss": "thus mindful",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. sata"
      },
      {
        "w": "viharanto",
        "gloss": "dwelling, abiding",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinati",
        "gloss": "investigates, discriminates, examines",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayati",
        "gloss": "investigates thoroughly (intensive of pavicinati)",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjati,",
        "gloss": "enters upon, undertakes",
        "gram": "pres. 3 sg. of apajjati",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "dhammavicayasambojjhaṅgo",
        "gloss": "the awakening-factor of investigation of principles (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "dhammavicayasambojjhaṅgaṁ",
        "gloss": "the awakening-factor of investigation of principles (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "dhammavicayasambojjhaṅgo",
        "gloss": "the awakening-factor of investigation of principles (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of investigation of principles; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:32.1",
    "section": "The seven awakening factors (body)",
    "pali": "Tassa taṁ dhammaṁ paññāya pavicinato pavicayato parivīmaṁsaṁ āpajjato āraddhaṁ hoti vīriyaṁ asallīnaṁ.",
    "kind": "full",
    "words": [
      {
        "w": "Tassa",
        "gloss": "of him; for that",
        "gram": "dem. gen. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinato",
        "gloss": "of one investigating",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayato",
        "gloss": "of one investigating thoroughly",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjato",
        "gloss": "of one entering upon",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "āraddhaṁ",
        "gloss": "aroused, undertaken",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyaṁ",
        "gloss": "energy, vigour",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "asallīnaṁ.",
        "gloss": "unshrinking, not sluggish",
        "gram": "adj. nom. sg. nt.",
        "ped": "PED s.v. sallina"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "As they investigate principles with wisdom in this way their energy is roused up and unflagging.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:32.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno taṁ dhammaṁ paññāya pavicinato pavicayato parivīmaṁsaṁ āpajjato āraddhaṁ hoti vīriyaṁ asallīnaṁ, vīriyasambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, vīriyasambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, vīriyasambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinato",
        "gloss": "of one investigating",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayato",
        "gloss": "of one investigating thoroughly",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjato",
        "gloss": "of one entering upon",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "āraddhaṁ",
        "gloss": "aroused, undertaken",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyaṁ",
        "gloss": "energy, vigour",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "asallīnaṁ,",
        "gloss": "unshrinking, not sluggish",
        "gram": "adj. nom. sg. nt.",
        "ped": "PED s.v. sallina"
      },
      {
        "w": "vīriyasambojjhaṅgo",
        "gloss": "the awakening-factor of energy (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyasambojjhaṅgaṁ",
        "gloss": "the awakening-factor of energy (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "vīriyasambojjhaṅgo",
        "gloss": "the awakening-factor of energy (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of energy; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:33.1",
    "section": "The seven awakening factors (body)",
    "pali": "Āraddhavīriyassa uppajjati pīti nirāmisā.",
    "kind": "full",
    "words": [
      {
        "w": "Āraddhavīriyassa",
        "gloss": "of one whose energy is aroused",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "uppajjati",
        "gloss": "arises, comes into being",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. uppajjati"
      },
      {
        "w": "pīti",
        "gloss": "rapture, joy, zest",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "nirāmisā.",
        "gloss": "not of the flesh, spiritual (rapture)",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. amisa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "When they’re energetic, rapture not of the flesh arises.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:33.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno āraddhavīriyassa uppajjati pīti nirāmisā, pītisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, pītisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, pītisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddhavīriyassa",
        "gloss": "of one whose energy is aroused",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "uppajjati",
        "gloss": "arises, comes into being",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. uppajjati"
      },
      {
        "w": "pīti",
        "gloss": "rapture, joy, zest",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "nirāmisā,",
        "gloss": "not of the flesh, spiritual (rapture)",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. amisa"
      },
      {
        "w": "pītisambojjhaṅgo",
        "gloss": "the awakening-factor of rapture (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "pītisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of rapture (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "pītisambojjhaṅgo",
        "gloss": "the awakening-factor of rapture (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of rapture; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:34.1",
    "section": "The seven awakening factors (body)",
    "pali": "Pītimanassa kāyopi passambhati, cittampi passambhati.",
    "kind": "full",
    "words": [
      {
        "w": "Pītimanassa",
        "gloss": "of one whose mind is full of rapture",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "kāyopi",
        "gloss": "(kayo + pi) the body too",
        "gram": "nom. sg. m. + emphatic",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "cittampi",
        "gloss": "(cittaṁ + pi) the mind too",
        "gram": "nom. sg. nt. + emphatic",
        "ped": "PED s.v. citta"
      },
      {
        "w": "passambhati.",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "When the mind is full of rapture, the body and mind become tranquil.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:34.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno pītimanassa kāyopi passambhati, cittampi passambhati, passaddhisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, passaddhisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, passaddhisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "pītimanassa",
        "gloss": "of one whose mind is full of rapture",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "kāyopi",
        "gloss": "(kayo + pi) the body too",
        "gram": "nom. sg. m. + emphatic",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "cittampi",
        "gloss": "(cittaṁ + pi) the mind too",
        "gram": "nom. sg. nt. + emphatic",
        "ped": "PED s.v. citta"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "passaddhisambojjhaṅgo",
        "gloss": "the awakening-factor of tranquillity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "passaddhisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of tranquillity (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "passaddhisambojjhaṅgo",
        "gloss": "the awakening-factor of tranquillity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of tranquility; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:35.1",
    "section": "The seven awakening factors (body)",
    "pali": "Passaddhakāyassa sukhino cittaṁ samādhiyati.",
    "kind": "full",
    "words": [
      {
        "w": "Passaddhakāyassa",
        "gloss": "of one whose body is tranquil",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. passaddha"
      },
      {
        "w": "sukhino",
        "gloss": "of one who is happy/blissful",
        "gram": "adj. gen. sg. m.",
        "ped": "PED s.v. sukhin"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "samādhiyati.",
        "gloss": "becomes concentrated/composed",
        "gram": "pres. 3 sg. pass. of samadahati",
        "ped": "PED s.v. samadahati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "When the body is tranquil and they feel bliss, the mind becomes immersed in samādhi.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:35.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno passaddhakāyassa sukhino cittaṁ samādhiyati, samādhisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, samādhisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, samādhisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "passaddhakāyassa",
        "gloss": "of one whose body is tranquil",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. passaddha"
      },
      {
        "w": "sukhino",
        "gloss": "of one who is happy/blissful",
        "gram": "adj. gen. sg. m.",
        "ped": "PED s.v. sukhin"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "samādhiyati,",
        "gloss": "becomes concentrated/composed",
        "gram": "pres. 3 sg. pass. of samadahati",
        "ped": "PED s.v. samadahati"
      },
      {
        "w": "samādhisambojjhaṅgo",
        "gloss": "the awakening-factor of immersion/concentration (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "samādhisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of immersion/concentration (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "samādhisambojjhaṅgo",
        "gloss": "the awakening-factor of immersion/concentration (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of immersion; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:36.1",
    "section": "The seven awakening factors (body)",
    "pali": "So tathāsamāhitaṁ cittaṁ sādhukaṁ ajjhupekkhitā hoti.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "tathāsamāhitaṁ",
        "gloss": "thus concentrated/composed",
        "gram": "adj. acc. sg. nt.; cpd.",
        "ped": "PED s.v. samahita"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "ajjhupekkhitā",
        "gloss": "one who looks on with equanimity, an equable observer",
        "gram": "agent-noun nom. sg. m.",
        "ped": "PED s.v. ajjhupekkhati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "They closely watch over that mind immersed in samādhi.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:36.2",
    "section": "The seven awakening factors (body)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu tathāsamāhitaṁ cittaṁ sādhukaṁ ajjhupekkhitā hoti, upekkhāsambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, upekkhāsambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, upekkhāsambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tathāsamāhitaṁ",
        "gloss": "thus concentrated/composed",
        "gram": "adj. acc. sg. nt.; cpd.",
        "ped": "PED s.v. samahita"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "ajjhupekkhitā",
        "gloss": "one who looks on with equanimity, an equable observer",
        "gram": "agent-noun nom. sg. m.",
        "ped": "PED s.v. ajjhupekkhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "upekkhāsambojjhaṅgo",
        "gloss": "the awakening-factor of equanimity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "upekkhāsambojjhaṅgaṁ",
        "gloss": "the awakening-factor of equanimity (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "upekkhāsambojjhaṅgo",
        "gloss": "the awakening-factor of equanimity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of equanimity; they develop it and perfect it.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:37.1",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu vedanāsu …pe…",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "vedanāsu",
        "gloss": "among feelings, in feelings",
        "gram": "loc. pl. f.",
        "ped": "PED s.v. vedana"
      },
      {
        "w": "…pe…",
        "gloss": "peyyala: the canonical abbreviation \"…pe…\" (pe = peyyala) signalling an omitted repeated passage",
        "gram": "editorial marker",
        "ped": "PED s.v. peyyala"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Whenever a mendicant meditates by observing an aspect of feelings …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.1",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "citte …",
    "kind": "full",
    "words": [
      {
        "w": "citte",
        "gloss": "in the mind",
        "gram": "loc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "…",
        "gloss": "ellipsis: marks a passage abbreviated (elided) in the manuscript tradition",
        "gram": "editorial marker",
        "ped": null
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "mind …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.2",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "dhammesu dhammānupassī viharati ātāpī sampajāno satimā vineyya loke abhijjhādomanassaṁ, upaṭṭhitāssa tasmiṁ samaye sati hoti asammuṭṭhā.",
    "kind": "full",
    "words": [
      {
        "w": "dhammesu",
        "gloss": "in principles/phenomena",
        "gram": "loc. pl. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "dhammānupassī",
        "gloss": "observing principles/phenomena",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. anupassin"
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "ātāpī",
        "gloss": "ardent, keen, applying effort",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. atapin"
      },
      {
        "w": "sampajāno",
        "gloss": "clearly aware, fully attentive",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. sampajana"
      },
      {
        "w": "satimā",
        "gloss": "mindful",
        "gram": "adj. nom. sg. m.",
        "ped": "PED s.v. satimant"
      },
      {
        "w": "vineyya",
        "gloss": "having removed/dispelled",
        "gram": "ger. of vineti",
        "ped": "PED s.v. vineti"
      },
      {
        "w": "loke",
        "gloss": "in the world (i.e. regarding the world/body)",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. loka"
      },
      {
        "w": "abhijjhādomanassaṁ,",
        "gloss": "covetousness-and-displeasure (abhijjha + domanassa)",
        "gram": "acc. sg. nt.; dvandva cpd.",
        "ped": "PED s.v. abhijjha"
      },
      {
        "w": "upaṭṭhitāssa",
        "gloss": "(upaṭṭhita + assa) \"his [mindfulness] is established\"",
        "gram": "ppp. nom. sg. f. + gen. pron.; sandhi",
        "ped": "PED s.v. upaṭṭhati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "sati",
        "gloss": "mindfulness",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "asammuṭṭhā.",
        "gloss": "unconfused, not muddled",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. sammussati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "principles, at that time their mindfulness is established and lucid.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.3",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno upaṭṭhitā sati hoti asammuṭṭhā, satisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, satisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, satisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "upaṭṭhitā",
        "gloss": "established, present, ready",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. upaṭṭhati"
      },
      {
        "w": "sati",
        "gloss": "mindfulness",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "asammuṭṭhā,",
        "gloss": "unconfused, not muddled",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. sammussati"
      },
      {
        "w": "satisambojjhaṅgo",
        "gloss": "the awakening-factor of mindfulness (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "satisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of mindfulness (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "satisambojjhaṅgo",
        "gloss": "the awakening-factor of mindfulness (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "At such a time, a mendicant has initiated the awakening factor of mindfulness …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.4",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "So tathāsato viharanto taṁ dhammaṁ paññāya pavicinati pavicayati parivīmaṁsaṁ āpajjati.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "tathāsato",
        "gloss": "thus mindful",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. sata"
      },
      {
        "w": "viharanto",
        "gloss": "dwelling, abiding",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinati",
        "gloss": "investigates, discriminates, examines",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayati",
        "gloss": "investigates thoroughly (intensive of pavicinati)",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjati.",
        "gloss": "enters upon, undertakes",
        "gram": "pres. 3 sg. of apajjati",
        "ped": "PED s.v. apajjati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:38.5",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu tathāsato viharanto taṁ dhammaṁ paññāya pavicinati pavicayati parivīmaṁsaṁ āpajjati, dhammavicayasambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, dhammavicayasambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, dhammavicayasambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tathāsato",
        "gloss": "thus mindful",
        "gram": "adj. nom. sg. m.; cpd.",
        "ped": "PED s.v. sata"
      },
      {
        "w": "viharanto",
        "gloss": "dwelling, abiding",
        "gram": "prp. nom. sg. m.",
        "ped": "PED s.v. viharati"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinati",
        "gloss": "investigates, discriminates, examines",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayati",
        "gloss": "investigates thoroughly (intensive of pavicinati)",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjati,",
        "gloss": "enters upon, undertakes",
        "gram": "pres. 3 sg. of apajjati",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "dhammavicayasambojjhaṅgo",
        "gloss": "the awakening-factor of investigation of principles (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "dhammavicayasambojjhaṅgaṁ",
        "gloss": "the awakening-factor of investigation of principles (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "dhammavicayasambojjhaṅgo",
        "gloss": "the awakening-factor of investigation of principles (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. vicaya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "investigation of principles …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.6",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Tassa taṁ dhammaṁ paññāya pavicinato pavicayato parivīmaṁsaṁ āpajjato āraddhaṁ hoti vīriyaṁ asallīnaṁ.",
    "kind": "full",
    "words": [
      {
        "w": "Tassa",
        "gloss": "of him; for that",
        "gram": "dem. gen. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinato",
        "gloss": "of one investigating",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayato",
        "gloss": "of one investigating thoroughly",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjato",
        "gloss": "of one entering upon",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "āraddhaṁ",
        "gloss": "aroused, undertaken",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyaṁ",
        "gloss": "energy, vigour",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "asallīnaṁ.",
        "gloss": "unshrinking, not sluggish",
        "gram": "adj. nom. sg. nt.",
        "ped": "PED s.v. sallina"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:38.7",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno taṁ dhammaṁ paññāya pavicinato pavicayato parivīmaṁsaṁ āpajjato āraddhaṁ hoti vīriyaṁ asallīnaṁ, vīriyasambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, vīriyasambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, vīriyasambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "taṁ",
        "gloss": "that, it",
        "gram": "dem. acc. sg. m./nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the principle/phenomenon (here the object investigated)",
        "gram": "acc. sg. m.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "paññāya",
        "gloss": "with wisdom",
        "gram": "ins. sg. f.",
        "ped": "PED s.v. pañña"
      },
      {
        "w": "pavicinato",
        "gloss": "of one investigating",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "pavicayato",
        "gloss": "of one investigating thoroughly",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. vicinati"
      },
      {
        "w": "parivīmaṁsaṁ",
        "gloss": "thorough inquiry, investigation",
        "gram": "acc. sg. f.",
        "ped": "PED s.v. vimaṁsa"
      },
      {
        "w": "āpajjato",
        "gloss": "of one entering upon",
        "gram": "prp. gen. sg. m.",
        "ped": "PED s.v. apajjati"
      },
      {
        "w": "āraddhaṁ",
        "gloss": "aroused, undertaken",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyaṁ",
        "gloss": "energy, vigour",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "asallīnaṁ,",
        "gloss": "unshrinking, not sluggish",
        "gram": "adj. nom. sg. nt.",
        "ped": "PED s.v. sallina"
      },
      {
        "w": "vīriyasambojjhaṅgo",
        "gloss": "the awakening-factor of energy (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "vīriyasambojjhaṅgaṁ",
        "gloss": "the awakening-factor of energy (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "vīriyasambojjhaṅgo",
        "gloss": "the awakening-factor of energy (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "energy …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.8",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Āraddhavīriyassa uppajjati pīti nirāmisā.",
    "kind": "full",
    "words": [
      {
        "w": "Āraddhavīriyassa",
        "gloss": "of one whose energy is aroused",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "uppajjati",
        "gloss": "arises, comes into being",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. uppajjati"
      },
      {
        "w": "pīti",
        "gloss": "rapture, joy, zest",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "nirāmisā.",
        "gloss": "not of the flesh, spiritual (rapture)",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. amisa"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:38.9",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno āraddhavīriyassa uppajjati pīti nirāmisā, pītisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, pītisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, pītisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddhavīriyassa",
        "gloss": "of one whose energy is aroused",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. viriya"
      },
      {
        "w": "uppajjati",
        "gloss": "arises, comes into being",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. uppajjati"
      },
      {
        "w": "pīti",
        "gloss": "rapture, joy, zest",
        "gram": "nom. sg. f.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "nirāmisā,",
        "gloss": "not of the flesh, spiritual (rapture)",
        "gram": "adj. nom. sg. f.",
        "ped": "PED s.v. amisa"
      },
      {
        "w": "pītisambojjhaṅgo",
        "gloss": "the awakening-factor of rapture (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "pītisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of rapture (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "pītisambojjhaṅgo",
        "gloss": "the awakening-factor of rapture (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "rapture …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.10",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Pītimanassa kāyopi passambhati, cittampi passambhati.",
    "kind": "full",
    "words": [
      {
        "w": "Pītimanassa",
        "gloss": "of one whose mind is full of rapture",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "kāyopi",
        "gloss": "(kayo + pi) the body too",
        "gram": "nom. sg. m. + emphatic",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "cittampi",
        "gloss": "(cittaṁ + pi) the mind too",
        "gram": "nom. sg. nt. + emphatic",
        "ped": "PED s.v. citta"
      },
      {
        "w": "passambhati.",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:38.11",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno pītimanassa kāyopi passambhati, cittampi passambhati, passaddhisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, passaddhisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, passaddhisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "pītimanassa",
        "gloss": "of one whose mind is full of rapture",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. piti"
      },
      {
        "w": "kāyopi",
        "gloss": "(kayo + pi) the body too",
        "gram": "nom. sg. m. + emphatic",
        "ped": "PED s.v. kaya"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "cittampi",
        "gloss": "(cittaṁ + pi) the mind too",
        "gram": "nom. sg. nt. + emphatic",
        "ped": "PED s.v. citta"
      },
      {
        "w": "passambhati,",
        "gloss": "becomes calm, is stilled/tranquillized",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. passambhati"
      },
      {
        "w": "passaddhisambojjhaṅgo",
        "gloss": "the awakening-factor of tranquillity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "passaddhisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of tranquillity (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "passaddhisambojjhaṅgo",
        "gloss": "the awakening-factor of tranquillity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. passaddhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "tranquility …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:38.12",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Passaddhakāyassa sukhino cittaṁ samādhiyati.",
    "kind": "full",
    "words": [
      {
        "w": "Passaddhakāyassa",
        "gloss": "of one whose body is tranquil",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. passaddha"
      },
      {
        "w": "sukhino",
        "gloss": "of one who is happy/blissful",
        "gram": "adj. gen. sg. m.",
        "ped": "PED s.v. sukhin"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "samādhiyati.",
        "gloss": "becomes concentrated/composed",
        "gram": "pres. 3 sg. pass. of samadahati",
        "ped": "PED s.v. samadahati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:38.13",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhuno passaddhakāyassa sukhino cittaṁ samādhiyati, samādhisambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, samādhisambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, samādhisambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "passaddhakāyassa",
        "gloss": "of one whose body is tranquil",
        "gram": "gen. sg. m.; cpd.",
        "ped": "PED s.v. passaddha"
      },
      {
        "w": "sukhino",
        "gloss": "of one who is happy/blissful",
        "gram": "adj. gen. sg. m.",
        "ped": "PED s.v. sukhin"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "samādhiyati,",
        "gloss": "becomes concentrated/composed",
        "gram": "pres. 3 sg. pass. of samadahati",
        "ped": "PED s.v. samadahati"
      },
      {
        "w": "samādhisambojjhaṅgo",
        "gloss": "the awakening-factor of immersion/concentration (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "samādhisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of immersion/concentration (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "samādhisambojjhaṅgo",
        "gloss": "the awakening-factor of immersion/concentration (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. samadhi"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "immersion …",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:39.1",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "So tathāsamāhitaṁ cittaṁ sādhukaṁ ajjhupekkhitā hoti.",
    "kind": "full",
    "words": [
      {
        "w": "So",
        "gloss": "he; that one",
        "gram": "dem./pers. pron. nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "tathāsamāhitaṁ",
        "gloss": "thus concentrated/composed",
        "gram": "adj. acc. sg. nt.; cpd.",
        "ped": "PED s.v. samahita"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "ajjhupekkhitā",
        "gloss": "one who looks on with equanimity, an equable observer",
        "gram": "agent-noun nom. sg. m.",
        "ped": "PED s.v. ajjhupekkhati"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  },
  {
    "ref": "mn118:39.2",
    "section": "The awakening factors (feelings, mind, principles)",
    "pali": "Yasmiṁ samaye, bhikkhave, bhikkhu tathāsamāhitaṁ cittaṁ sādhukaṁ ajjhupekkhitā hoti, upekkhāsambojjhaṅgo tasmiṁ samaye bhikkhuno āraddho hoti, upekkhāsambojjhaṅgaṁ tasmiṁ samaye bhikkhu bhāveti, upekkhāsambojjhaṅgo tasmiṁ samaye bhikkhuno bhāvanāpāripūriṁ gacchati.",
    "kind": "full",
    "words": [
      {
        "w": "Yasmiṁ",
        "gloss": "in/at which; (with samaye) \"whenever\"",
        "gram": "rel. pron. loc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "samaye,",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "tathāsamāhitaṁ",
        "gloss": "thus concentrated/composed",
        "gram": "adj. acc. sg. nt.; cpd.",
        "ped": "PED s.v. samahita"
      },
      {
        "w": "cittaṁ",
        "gloss": "mind",
        "gram": "nom./acc. sg. nt.",
        "ped": "PED s.v. citta"
      },
      {
        "w": "sādhukaṁ",
        "gloss": "thoroughly, carefully, well",
        "gram": "adv.",
        "ped": "PED s.v. sadhuka"
      },
      {
        "w": "ajjhupekkhitā",
        "gloss": "one who looks on with equanimity, an equable observer",
        "gram": "agent-noun nom. sg. m.",
        "ped": "PED s.v. ajjhupekkhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "upekkhāsambojjhaṅgo",
        "gloss": "the awakening-factor of equanimity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "āraddho",
        "gloss": "aroused, initiated, set going",
        "gram": "ppp. nom. sg. m.",
        "ped": "PED s.v. arabhati"
      },
      {
        "w": "hoti,",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of bhavati",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "upekkhāsambojjhaṅgaṁ",
        "gloss": "the awakening-factor of equanimity (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāveti,",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "upekkhāsambojjhaṅgo",
        "gloss": "the awakening-factor of equanimity (nom.)",
        "gram": "nom. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "tasmiṁ",
        "gloss": "in/at that (time)",
        "gram": "dem. loc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "samaye",
        "gloss": "at the time, on the occasion",
        "gram": "loc. sg. m.",
        "ped": "PED s.v. samaya"
      },
      {
        "w": "bhikkhuno",
        "gloss": "of/for the monk",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhāvanāpāripūriṁ",
        "gloss": "fulfilment/perfection of development",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. paripuri"
      },
      {
        "w": "gacchati.",
        "gloss": "goes; (here) reaches, comes to",
        "gram": "pres. 3 sg.",
        "ped": "PED s.v. gacchati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "equanimity.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:40.1",
    "section": "Conclusion (seven awakening factors)",
    "pali": "Evaṁ bhāvitā kho, bhikkhave, cattāro satipaṭṭhānā evaṁ bahulīkatā satta sambojjhaṅge paripūrenti.",
    "kind": "full",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "kho,",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "cattāro",
        "gloss": "four",
        "gram": "num. nom./acc. m.",
        "ped": "PED s.v. catu"
      },
      {
        "w": "satipaṭṭhānā",
        "gloss": "the establishments/foundations of mindfulness",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. satipaṭṭhana"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "sambojjhaṅge",
        "gloss": "awakening-factors",
        "gram": "acc. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "paripūrenti.",
        "gloss": "they fulfil, bring to completion",
        "gram": "pres. 3 pl. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s how the four kinds of mindfulness meditation, when developed and cultivated, fulfill the seven awakening factors.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:41.1",
    "section": "Fulfilling knowledge and freedom — question",
    "pali": "Kathaṁ bhāvitā ca, bhikkhave, satta bojjhaṅgā kathaṁ bahulīkatā vijjāvimuttiṁ paripūrenti?",
    "kind": "full",
    "words": [
      {
        "w": "Kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl.",
        "ped": "PED s.v. ca"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅgā",
        "gloss": "awakening-factors",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "kathaṁ",
        "gloss": "how? in what way?",
        "gram": "interr. indecl.",
        "ped": "PED s.v. kathaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "vijjāvimuttiṁ",
        "gloss": "knowledge-and-liberation (vijja + vimutti)",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. vijja"
      },
      {
        "w": "paripūrenti?",
        "gloss": "they fulfil, bring to completion",
        "gram": "pres. 3 pl. caus.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "And how are the seven awakening factors developed and cultivated so as to fulfill knowledge and freedom?",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.1",
    "section": "Developing the awakening factors",
    "pali": "Idha, bhikkhave, bhikkhu satisambojjhaṅgaṁ bhāveti vivekanissitaṁ virāganissitaṁ nirodhanissitaṁ vossaggapariṇāmiṁ.",
    "kind": "full",
    "words": [
      {
        "w": "Idha,",
        "gloss": "here, in this case (in this teaching)",
        "gram": "indecl.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "satisambojjhaṅgaṁ",
        "gloss": "the awakening-factor of mindfulness (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. sati"
      },
      {
        "w": "bhāveti",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "vivekanissitaṁ",
        "gloss": "dependent on seclusion",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. viveka"
      },
      {
        "w": "virāganissitaṁ",
        "gloss": "dependent on dispassion/fading-away",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. nissita"
      },
      {
        "w": "nirodhanissitaṁ",
        "gloss": "dependent on cessation",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. nissita"
      },
      {
        "w": "vossaggapariṇāmiṁ.",
        "gloss": "maturing/ripening in release (letting go)",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. vossagga"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "It’s when a mendicant develops the awakening factors of mindfulness,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.2",
    "section": "Developing the awakening factors",
    "pali": "Dhammavicayasambojjhaṅgaṁ bhāveti …pe…",
    "kind": "refrain-use",
    "refrain": "mn118-bojjhanga-nissita",
    "substitutions": {
      "FAC": [
        "Dhammavicayasambojjhaṅgaṁ"
      ],
      "ELL": [
        "…pe…"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "investigation of principles,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.3",
    "section": "Developing the awakening factors",
    "pali": "vīriyasambojjhaṅgaṁ bhāveti …",
    "kind": "refrain-use",
    "refrain": "mn118-bojjhanga-nissita",
    "substitutions": {
      "FAC": [
        "vīriyasambojjhaṅgaṁ"
      ],
      "ELL": [
        "…"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "energy,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.4",
    "section": "Developing the awakening factors",
    "pali": "pītisambojjhaṅgaṁ bhāveti …",
    "kind": "refrain-use",
    "refrain": "mn118-bojjhanga-nissita",
    "substitutions": {
      "FAC": [
        "pītisambojjhaṅgaṁ"
      ],
      "ELL": [
        "…"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "rapture,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.5",
    "section": "Developing the awakening factors",
    "pali": "passaddhisambojjhaṅgaṁ bhāveti …",
    "kind": "refrain-use",
    "refrain": "mn118-bojjhanga-nissita",
    "substitutions": {
      "FAC": [
        "passaddhisambojjhaṅgaṁ"
      ],
      "ELL": [
        "…"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "tranquility,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.6",
    "section": "Developing the awakening factors",
    "pali": "samādhisambojjhaṅgaṁ bhāveti …",
    "kind": "refrain-use",
    "refrain": "mn118-bojjhanga-nissita",
    "substitutions": {
      "FAC": [
        "samādhisambojjhaṅgaṁ"
      ],
      "ELL": [
        "…"
      ]
    },
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "immersion,",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:42.7",
    "section": "Developing the awakening factors",
    "pali": "upekkhāsambojjhaṅgaṁ bhāveti vivekanissitaṁ virāganissitaṁ nirodhanissitaṁ vossaggapariṇāmiṁ.",
    "kind": "full",
    "words": [
      {
        "w": "upekkhāsambojjhaṅgaṁ",
        "gloss": "the awakening-factor of equanimity (acc.)",
        "gram": "acc. sg. m.; cpd.",
        "ped": "PED s.v. upekkha"
      },
      {
        "w": "bhāveti",
        "gloss": "develops, cultivates",
        "gram": "pres. 3 sg. caus. of bhavati",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "vivekanissitaṁ",
        "gloss": "dependent on seclusion",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. viveka"
      },
      {
        "w": "virāganissitaṁ",
        "gloss": "dependent on dispassion/fading-away",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. nissita"
      },
      {
        "w": "nirodhanissitaṁ",
        "gloss": "dependent on cessation",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. nissita"
      },
      {
        "w": "vossaggapariṇāmiṁ.",
        "gloss": "maturing/ripening in release (letting go)",
        "gram": "adj. acc. sg. m.; cpd.",
        "ped": "PED s.v. vossagga"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "and equanimity, which rely on seclusion, fading away, and cessation, and ripen as letting go.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:43.1",
    "section": "Conclusion & the mendicants delight",
    "pali": "Evaṁ bhāvitā kho, bhikkhave, satta bojjhaṅgā evaṁ bahulīkatā vijjāvimuttiṁ paripūrentī”ti.",
    "kind": "full",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bhāvitā",
        "gloss": "developed, cultivated",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bhaveti"
      },
      {
        "w": "kho,",
        "gloss": "indeed (emphatic/enclitic particle)",
        "gram": "indecl.",
        "ped": "PED s.v. kho"
      },
      {
        "w": "bhikkhave,",
        "gloss": "monks! mendicants! (O bhikkhus)",
        "gram": "voc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "satta",
        "gloss": "seven",
        "gram": "num.",
        "ped": "PED s.v. satta"
      },
      {
        "w": "bojjhaṅgā",
        "gloss": "awakening-factors",
        "gram": "nom. pl. m.",
        "ped": "PED s.v. bojjhaṅga"
      },
      {
        "w": "evaṁ",
        "gloss": "thus, so, in this way",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "bahulīkatā",
        "gloss": "made much of, cultivated, practised repeatedly",
        "gram": "ppp. nom. sg. f.",
        "ped": "PED s.v. bahulikaroti"
      },
      {
        "w": "vijjāvimuttiṁ",
        "gloss": "knowledge-and-liberation (vijja + vimutti)",
        "gram": "acc. sg. f.; cpd.",
        "ped": "PED s.v. vijja"
      },
      {
        "w": "paripūrentī”ti.",
        "gloss": "(paripurenti + iti) \"they fulfil\" + quotative",
        "gram": "pres. 3 pl. + indecl.",
        "ped": "PED s.v. paripureti"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That’s how the seven awakening factors, when developed and cultivated, fulfill knowledge and freedom.”",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:43.2",
    "section": "Conclusion & the mendicants delight",
    "pali": "Idamavoca bhagavā.",
    "kind": "full",
    "words": [
      {
        "w": "Idamavoca",
        "gloss": "(idaṁ + avoca) \"this he said\"",
        "gram": "dem. nt. + aor. 3 sg. of vatti; sandhi",
        "ped": "PED s.v. vatti"
      },
      {
        "w": "bhagavā.",
        "gloss": "the Blessed One, the Buddha",
        "gram": "nom. sg. m.",
        "ped": "PED s.v. bhagavant"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "That is what the Buddha said.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:43.3",
    "section": "Conclusion & the mendicants delight",
    "pali": "Attamanā te bhikkhū bhagavato bhāsitaṁ abhinandunti.",
    "kind": "full",
    "words": [
      {
        "w": "Attamanā",
        "gloss": "pleased, elated, glad at heart",
        "gram": "adj. nom. pl. m.",
        "ped": "PED s.v. attamana"
      },
      {
        "w": "te",
        "gloss": "they, those; (here) those (mendicants)",
        "gram": "dem. pron. nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "bhikkhū",
        "gloss": "monks, mendicants",
        "gram": "nom./acc. pl. m.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "bhagavato",
        "gloss": "of/to the Blessed One",
        "gram": "gen./dat. sg. m.",
        "ped": "PED s.v. bhagavant"
      },
      {
        "w": "bhāsitaṁ",
        "gloss": "what was spoken, the utterance",
        "gram": "ppp./nt. noun acc. sg.",
        "ped": "PED s.v. bhasati"
      },
      {
        "w": "abhinandunti.",
        "gloss": "(abhinanduṁ + iti) they rejoiced at, approved + quotative particle",
        "gram": "aor. 3 pl. of abhinandati + indecl.",
        "ped": "PED s.v. abhinandati"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "Satisfied, the mendicants approved what the Buddha said.",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": null
  },
  {
    "ref": "mn118:43.4",
    "section": "Conclusion & the mendicants delight",
    "pali": "Ānāpānassatisuttaṁ niṭṭhitaṁ aṭṭhamaṁ.",
    "kind": "full",
    "words": [
      {
        "w": "Ānāpānassatisuttaṁ",
        "gloss": "the Anapanassati discourse (title)",
        "gram": "nom./acc. sg. nt.; title",
        "ped": null
      },
      {
        "w": "niṭṭhitaṁ",
        "gloss": "finished, completed",
        "gram": "ppp. nom. sg. nt.",
        "ped": "PED s.v. niṭṭhita"
      },
      {
        "w": "aṭṭhamaṁ.",
        "gloss": "the eighth (discourse of the chapter)",
        "gram": "ord. num. nom. sg. nt.",
        "ped": "PED s.v. aṭṭhama"
      }
    ],
    "src": "Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral bilara-data (declared PD/CC0); translation: Bhikkhu Sujato, \"Middle Discourses\" (SuttaCentral, CC0); glosses: original, after PED (1921–25, PD), DPD lookup-verified.",
    "licence": {
      "pali": "cc0",
      "translation": "cc0",
      "words": "original"
    },
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato (SuttaCentral, bilara-data, CC0)"
    },
    "notes": "Sujato leaves this segment blank in translation, folding its sense into the adjacent rendered segment (his own peyyāla handling of the Pāli abbreviation). The Pāli root text is present and glossed."
  }
];
