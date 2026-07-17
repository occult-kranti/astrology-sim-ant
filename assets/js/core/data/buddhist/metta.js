// ============================================================================
//  core/data/buddhist/metta.js  —  GENERATED, DO NOT HAND-EDIT.
//  Regenerate: node r30build/gen-buddhist.cjs (reads r29data/*.json verbatim).
//
//  The Metta Sutta (Karaṇīyamettasutta), Snp 1.8 = Khp 9 — word-by-word.
//  Root Pāli: Mahāsaṅgīti Tipiṭaka via SuttaCentral (declared PD) — tagged cc0.
//  Translation: Bhikkhu Sujato (SuttaCentral, CC0) — reproduced VERBATIM.
//  Glosses/gram: original prose, PED-informed (PED 1921–25, PD) — original.
//  Reconstruction invariant: words[].w.join(" ") === record.pali (43/43).
//  Note: snp1.8:10.5 (the vagga colophon) has translation === null by fidelity
//  to Sujato, whose Bilara file has no segment for it. DOM-free pure data.
// ============================================================================

export const METTA_META = {
  "title": "Metta Sutta (Karaṇīyametta Sutta) — Snp 1.8, word-by-word",
  "text": "Sutta Nipāta 1.8 (Uragavagga, eighth sutta; the same text recurs as Khuddakapāṭha 9). Verse numbers Snp 143–152 in the PTS numbering (noted, not used as refs).",
  "source": {
    "pali": "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral — segment file bilara-data root/pli/ms/sutta/kn/snp/vagga1/snp1.8_root-pli-ms.json (branch published, fetched 2026-07-17)",
    "translation": "Bhikkhu Sujato, Sutta Nipāta translation, SuttaCentral — segment file bilara-data translation/en/sujato/sutta/kn/snp/vagga1/snp1.8_translation-en-sujato.json (branch published, fetched 2026-07-17)",
    "glosses": "Original prose written for this wing, informed by the PTS Pali-English Dictionary (Rhys Davids & Stede, 1921–25; US-PD), cited per record as 'PED s.v. <headword>'. The Digital Pāḷi Dictionary (CC BY-NC-SA) was used strictly as a lookup/verification instrument; no DPD text is reproduced."
  },
  "licenses": {
    "translation": "CC0 1.0 (public-domain dedication). SuttaCentral licensing page: \"All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).\" Doubly sourced at repo level, suttacentral/bilara-data LICENSE.md: \"All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.\"",
    "pali": "Public domain per SuttaCentral's declaration (licensing page): \"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other languages are in the public domain. Such material does not fall within the scope of copyright.\" The Mahāsaṅgīti edition is distributed as PD by SuttaCentral, its publisher-partner.",
    "glosses": "original (written for this wing); grammatical facts are uncopyrightable; expressive gloss prose is original, PED-informed and PED-cited.",
    "ped": "PTS Pali-English Dictionary, Chipstead 1921–25 — US-PD by the 95-year rule."
  },
  "counts": {
    "records": 43,
    "verses": 10,
    "verseLineSegments": 40,
    "headerSegments": 2,
    "colophonSegments": 1,
    "wordRecords": 138,
    "uniqueSurfaceForms": 111,
    "countNote": "The R28 plan's Appendix A measured 138 word tokens / 110 unique case-folded forms for this file; this encoding counts 111 unique because the header numeral token '1.8' survives its punctuation-stripping tokenizer here. Token total matches exactly (138)."
  },
  "conventions": {
    "ref": "Bilara segment IDs (snp1.8:0.1 … snp1.8:10.5), the community-standard citation grain; 1:1 aligned with root and translation JSON.",
    "pali": "The Bilara root segment value, NFC, with the file's single trailing space trimmed. All other characters — including the opening quote mark on 1.1 and the closing quote inside 10.4 — are preserved exactly.",
    "translationText": "Byte-verbatim value from the Sujato Bilara segment file, INCLUDING trailing spaces and the <j> line-join markers (snp1.8:1.2, 5.3, 9.4). Nothing is edited; a mechanical diff against the source JSON must show zero differences. Segment 10.5 (the vagga colophon) has no Sujato segment; its translation is null.",
    "reconstruction": "Joining words[].w with single spaces rebuilds the (trimmed) pali string exactly. Every whitespace-delimited surface token of the segment — punctuation, quote marks and all — is exactly one words[] entry.",
    "sandhi": "Sandhi/fused tokens are NOT split into multiple entries (which would break reconstruction). A fused token gets ONE entry whose gloss opens with the resolution in the form '= a + b: …', and whose gram field gives the morphology of each resolved member in order. ped may cite several headwords, separated as 'PED s.v. a; s.v. b'.",
    "gram": "Abbreviations: nom./acc./instr./dat./gen./loc. (cases), sg./pl. (number), m./f./nt. (gender), adj., subst., pron. (rel. = relative, dem. = demonstrative, indef. = indefinite, recip. = reciprocal), pres. (present), opt. (optative), imper. (imperative), perf. (perfect), med. (middle voice), part. (participle), pp. (past participle), grdv. (gerundive = future passive participle), ger./absol. (absolutive gerund), cpd. (compound; dvandva/bahubbīhi/tappurisa named where useful), poss. (possessive stem), encl. (enclitic), indecl. (indeclinable), metri causa (metrically conditioned form).",
    "notes": "notes is null or a prose note; contested points state both positions with sources and are never resolved. Described, never prescribed: the text's own claims (rebirth, the divine abiding) are reported as what the text says."
  }
};

export const METTA_RECORDS = [
  {
    "ref": "snp1.8:0.1",
    "pali": "Sutta Nipāta 1.8",
    "words": [
      {
        "w": "Sutta",
        "gloss": "discourse; a text of the canon (lit. 'thread' — the traditional etymology; PED also connects it with Skt sūkta 'well-spoken')",
        "gram": "nt. (title word, uninflected citation form)",
        "ped": "PED s.v. sutta"
      },
      {
        "w": "Nipāta",
        "gloss": "a 'thrown-together' collection, an anthology-section; the Sutta Nipāta is the 'Anthology of Discourses' (so Sujato)",
        "gram": "m. (title word, uninflected citation form)",
        "ped": "PED s.v. nipāta"
      },
      {
        "w": "1.8",
        "gloss": "chapter 1 (Uragavagga), text 8 — SuttaCentral's edition numbering, not part of the canonical text",
        "gram": "numeral (edition apparatus)",
        "ped": null
      }
    ],
    "translation": {
      "text": "Anthology of Discourses 1.8 ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:0.1, verbatim"
    },
    "notes": "Header segment (edition apparatus). The same sutta also appears as Khuddakapāṭha 9; the Bilara kp9 and snp1.8 root texts are identical (verified in the R28 plan, Appendix A). PTS verse numbers Sn 143–152."
  },
  {
    "ref": "snp1.8:0.2",
    "pali": "Mettasutta",
    "words": [
      {
        "w": "Mettasutta",
        "gloss": "= mettā + sutta: the Discourse on Love (mettā: love, friendliness, active goodwill — the abstract of mitta 'friend'); popularly the Karaṇīyametta Sutta, after its first word",
        "gram": "tappurisa cpd., nt. (title, uninflected)",
        "ped": "PED s.v. mettā; s.v. sutta"
      }
    ],
    "translation": {
      "text": "The Discourse on Love ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:0.2, verbatim"
    },
    "notes": "Title segment. 'Love' is Sujato's rendering of mettā; older PD renderings prefer 'loving-kindness' or 'friendliness' (PED s.v. mettā: 'love, amity, sympathy, friendliness, active interest in others')."
  },
  {
    "ref": "snp1.8:1.1",
    "pali": "“Karaṇīyamatthakusalena,",
    "words": [
      {
        "w": "“Karaṇīyamatthakusalena,",
        "gloss": "= karaṇīyaṁ + atthakusalena (sandhi: -ṁ + a- written -m-a-): 'this is what should be done' + 'by one skilled in the good'. karaṇīya is the gerundive (future passive participle) of karoti 'to do' — that-which-ought-to-be-done, a duty; used as the sentence predicate with the agent in the instrumental. attha: the good, welfare, the goal (also 'meaning' — see note); kusala: skilled, wholesome. The opening quote mark belongs to the Bilara segment punctuation.",
        "gram": "karaṇīyaṁ: grdv. (fpp.) of karoti (√kar), nom. sg. nt.; atthakusalena: tappurisa cpd. adj., instr. sg. m. (agent of the gerundive)",
        "ped": "PED s.v. karaṇīya; s.v. attha¹; s.v. kusala"
      }
    ],
    "translation": {
      "text": "Those who are skilled in the meaning of scripture ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:1.1, verbatim"
    },
    "notes": "attha is genuinely ambiguous between 'the good/goal' (most translators: 'skilled in the good/in welfare') and 'the meaning (of the teaching)' — Sujato takes the latter ('skilled in the meaning of scripture'). PED s.v. attha¹ carries both senses ('interest, advantage, gain; need, want; sense, meaning'). Both readings reported; neither resolved."
  },
  {
    "ref": "snp1.8:1.2",
    "pali": "Yanta santaṁ padaṁ abhisamecca;",
    "words": [
      {
        "w": "Yanta",
        "gloss": "= yaṁ + ta(ṁ) (final nasal elided metri causa; many editions print yantaṁ): 'which [is] that…' — the relative pronoun with its correlative, pointing forward to 'the peaceful state'",
        "gram": "rel. pron. acc. sg. nt. + dem. pron. acc. sg. nt.",
        "ped": "PED s.v. ya; s.v. ta"
      },
      {
        "w": "santaṁ",
        "gloss": "peaceful, calmed, stilled; 'the peaceful (state)' — the commentary identifies it with nibbāna",
        "gram": "adj. (pp. of sammati, √śam), acc. sg. nt.",
        "ped": "PED s.v. santa¹"
      },
      {
        "w": "padaṁ",
        "gloss": "state, place, footing, path — 'santaṁ padaṁ', the state of peace",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. pada"
      },
      {
        "w": "abhisamecca;",
        "gloss": "having fully comprehended, having realized by penetration; absolutive of abhisameti (the verb behind abhisamaya 'realization')",
        "gram": "ger. (absol.) of abhisameti (abhi + saṁ + √i)",
        "ped": "PED s.v. abhisameti"
      }
    ],
    "translation": {
      "text": "should practice as follows <j>to realize the state of peace. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:1.2, verbatim"
    },
    "notes": "Syntax contested both ways. (a) Literal absolutive order: 'having realized the peaceful state' — the doer has already understood it (the commentary allows knowing it 'by worldly knowledge' as the goal to be reached). (b) Proleptic/purposive: the absolutive states the aim — 'so as to realize the state of peace' (so Sujato: 'should practice as follows to realize…'). Both are grammatically defensible readings of the absolutive; unresolved."
  },
  {
    "ref": "snp1.8:1.3",
    "pali": "Sakko ujū ca suhujū ca,",
    "words": [
      {
        "w": "Sakko",
        "gloss": "able, capable, competent (from sakkoti 'to be able')",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. sakka²"
      },
      {
        "w": "ujū",
        "gloss": "upright, straight — of character; final vowel lengthened metri causa (stem uju)",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. uju"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "suhujū",
        "gloss": "= su + (h)uju: very upright, thoroughly honest; the -h- is a sandhi glide and the final vowel is again lengthened metri causa",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. uju; s.v. su"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "Let them be capable and upright, very upright, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:1.3, verbatim"
    },
    "notes": "The string of fifteen nominative-singular qualities in vv. 1–2 hangs on 'cassa' ('and he should be') in 1.4 — the optative governs the whole list. The commentary distinguishes ujū (upright) from suhujū (upright again and again, or in body-speech vs mind); reported, not adjudicated."
  },
  {
    "ref": "snp1.8:1.4",
    "pali": "Sūvaco cassa mudu anatimānī.",
    "words": [
      {
        "w": "Sūvaco",
        "gloss": "easy to speak to, amenable to correction, meek (su + vaca); first vowel lengthened metri causa. PED cites this very passage (Sn 143) under su –vaca",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. su (–vaca)"
      },
      {
        "w": "cassa",
        "gloss": "= ca + assa: 'and he should be' — the optative that governs the whole list of qualities in vv. 1–2",
        "gram": "conj. + opt. 3 sg. of atthi (√as)",
        "ped": "PED s.v. ca; s.v. atthi"
      },
      {
        "w": "mudu",
        "gloss": "gentle, mild, soft",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. mudu"
      },
      {
        "w": "anatimānī.",
        "gloss": "not arrogant, without high conceit (an + atimānin, from atimāna 'high opinion of oneself'); PED cites Sn 143 s.v. atimānin",
        "gram": "adj. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. atimānin"
      }
    ],
    "translation": {
      "text": "easy to speak to, gentle and humble; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:1.4, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:2.1",
    "pali": "Santussako ca subharo ca,",
    "words": [
      {
        "w": "Santussako",
        "gloss": "contented, satisfied with what one has (saṁ + tussati 'to be pleased' + -ka); PED cites Sn 144",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. santussaka"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "subharo",
        "gloss": "easy to support, unburdensome to those who provide for one (su + bhara, from bharati 'to carry, support')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. su (–bhara)"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "content and unburdensome, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:2.1, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:2.2",
    "pali": "Appakicco ca sallahukavutti;",
    "words": [
      {
        "w": "Appakicco",
        "gloss": "having few duties, unbusied (appa 'little, few' + kicca 'what is to be done')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. appa (–kicca)"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "sallahukavutti;",
        "gloss": "of light livelihood, living simply and frugally (sallahuka 'light' + vutti 'mode of living, conduct'); PED cites Sn 144 s.v. sallahuka",
        "gram": "bahubbīhi cpd. adj., nom. sg. m. (-i stem)",
        "ped": "PED s.v. sallahuka; s.v. vutti"
      }
    ],
    "translation": {
      "text": "unbusied, living lightly, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:2.2, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:2.3",
    "pali": "Santindriyo ca nipako ca,",
    "words": [
      {
        "w": "Santindriyo",
        "gloss": "= santa + indriya: with calmed sense-faculties, the senses at peace",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. santa¹; s.v. indriya"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "nipako",
        "gloss": "prudent, discerning, mature in judgement (Sujato: 'alert')",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. nipaka"
      },
      {
        "w": "ca,",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "alert, with senses calmed, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:2.3, verbatim"
    },
    "notes": "Sujato's line reverses the Pāli word order (nipako → 'alert' first); alignment is by segment, not by word position."
  },
  {
    "ref": "snp1.8:2.4",
    "pali": "Appagabbho kulesvananugiddho.",
    "words": [
      {
        "w": "Appagabbho",
        "gloss": "not impudent, unobtrusive, modest in bodily and verbal conduct (a + pagabbha 'bold, forward'); PED cites Sn 144",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. appagabbha"
      },
      {
        "w": "kulesvananugiddho.",
        "gloss": "= kulesu + ananugiddho (glide -v- in sandhi): 'among families' + 'not greedily attached' — not fawning on lay supporters for the sake of gain (an + anugiddha, pp. of anugijjhati 'to covet'); PED cites Sn 144 s.v. anugiddha",
        "gram": "kulesu: nt., loc. pl.; ananugiddho: neg. pp. of anugijjhati, nom. sg. m.",
        "ped": "PED s.v. kula; s.v. anugijjhati"
      }
    ],
    "translation": {
      "text": "courteous, not fawning on families. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:2.4, verbatim"
    },
    "notes": "'Families' (kula) in monastic idiom = lay households who support renunciants; the quality described is independence from patron-courting."
  },
  {
    "ref": "snp1.8:3.1",
    "pali": "Na ca khuddamācare kiñci,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "khuddamācare",
        "gloss": "= khuddaṁ + ācare (sandhi -ṁ + ā- written -m-ā-): 'a mean, low, trifling thing' + 'should do, practise'",
        "gram": "khuddaṁ: adj. as subst., acc. sg. nt.; ācare: opt. 3 sg. of ācarati (ā + √car)",
        "ped": "PED s.v. khudda; s.v. ācarati"
      },
      {
        "w": "kiñci,",
        "gloss": "anything at all (kiṁ + indefinitizing -ci)",
        "gram": "indef. pron., acc. sg. nt.",
        "ped": "PED s.v. kiṁ (kiñci)"
      }
    ],
    "translation": {
      "text": "Let them not do the slightest thing ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:3.1, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:3.2",
    "pali": "Yena viññū pare upavadeyyuṁ;",
    "words": [
      {
        "w": "Yena",
        "gloss": "by which, on account of which",
        "gram": "rel. pron., instr. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "viññū",
        "gloss": "the wise, the discerning (viññū as substantive: 'one who knows')",
        "gram": "adj. as subst., nom. pl. m. (-ū stem)",
        "ped": "PED s.v. viññū"
      },
      {
        "w": "pare",
        "gloss": "others",
        "gram": "pron. adj., nom. pl. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "upavadeyyuṁ;",
        "gloss": "would blame, censure, reprove",
        "gram": "opt. 3 pl. of upavadati (upa + √vad)",
        "ped": "PED s.v. upavadati"
      }
    ],
    "translation": {
      "text": "that others who are wise would blame. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:3.2, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:3.3",
    "pali": "Sukhino va khemino hontu,",
    "words": [
      {
        "w": "Sukhino",
        "gloss": "happy, possessed of happiness",
        "gram": "adj. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. sukhin"
      },
      {
        "w": "va",
        "gloss": "an enclitic particle that is either eva 'truly, just' (emphatic — the commentary's reading, yielding 'may they be truly happy and secure') or vā 'or' shortened metri causa ('happy or secure'). PED registers both shortened values of va (= eva; = vā), plus va = iva 'like'",
        "gram": "indecl. (encl. particle; = eva or vā, contested)",
        "ped": "PED s.v. va"
      },
      {
        "w": "khemino",
        "gloss": "safe, secure, at peace (khemin, from khema 'security')",
        "gram": "adj. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. khema (khemin)"
      },
      {
        "w": "hontu,",
        "gloss": "may they be!",
        "gram": "imper. 3 pl. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      }
    ],
    "translation": {
      "text": "May they be happy and safe! ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:3.3, verbatim"
    },
    "notes": "CONTESTED (scope and particle), both ways. (1) The particle: va = eva gives one inclusive blessing, 'may they be happy AND truly secure' (so the commentary, and effectively Sujato's 'happy and safe'); va = vā gives a disjunction, 'happy or secure'. (2) The scope/subject: no subject is expressed in 3.3 — either it anticipates 'sabbasattā' of 3.4 (the traditional reading: all beings are the subject of both lines, 3.4 restating and universalizing 3.3), or 3.3 is a first, general wish whose subject is understood ('may [creatures] be…') with 3.4 widening it to 'all beings'. Both positions stated; neither resolved."
  },
  {
    "ref": "snp1.8:3.4",
    "pali": "Sabbasattā bhavantu sukhitattā.",
    "words": [
      {
        "w": "Sabbasattā",
        "gloss": "= sabba + satta: all beings, all sentient creatures",
        "gram": "kammadhāraya cpd., nom. pl. m.",
        "ped": "PED s.v. sabba; s.v. satta²"
      },
      {
        "w": "bhavantu",
        "gloss": "may they be, may they become",
        "gram": "imper. 3 pl. of bhavati (√bhū)",
        "ped": "PED s.v. bhavati"
      },
      {
        "w": "sukhitattā.",
        "gloss": "= sukhita + attan: 'with happy selves', happy at heart, blissful in themselves (bahubbīhi on attan 'self')",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. sukhita; s.v. attan"
      }
    ],
    "translation": {
      "text": "May all beings be happy! ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:3.4, verbatim"
    },
    "notes": "The sutta's refrain-like wish; it recurs verbatim at snp1.8:5.4 (glossed there again in full — this short text does not use the wing's peyyāla model, which is reserved for the prose suttas)."
  },
  {
    "ref": "snp1.8:4.1",
    "pali": "Ye keci pāṇabhūtatthi,",
    "words": [
      {
        "w": "Ye",
        "gloss": "whatever, which (relative, opening the catalogue of creatures that runs to v. 5)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "keci",
        "gloss": "any whatsoever (ke + indefinitizing -ci)",
        "gram": "indef. pron., nom. pl. m.",
        "ped": "PED s.v. ka² (koci)"
      },
      {
        "w": "pāṇabhūtatthi,",
        "gloss": "= pāṇabhūtā + atthi (sandhi): 'living beings' + 'there are'. pāṇabhūta is either a dvandva ('breathers and beings') or a kammadhāraya ('beings that breathe, living beings') — the commentary offers both resolutions; atthi is the singular verb used with a plural subject, a common canonical idiom for 'there are'",
        "gram": "pāṇabhūtā: cpd., nom. pl. m.; atthi: pres. 3 sg. of √as (sg. form with pl. subject)",
        "ped": "PED s.v. pāṇa; s.v. bhūta; s.v. atthi"
      }
    ],
    "translation": {
      "text": "Whatever living creatures there are ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:4.1, verbatim"
    },
    "notes": "Both compound-resolutions of pāṇabhūta reported (dvandva vs kammadhāraya); unresolved, and nothing hangs on it for the sense."
  },
  {
    "ref": "snp1.8:4.2",
    "pali": "Tasā vā thāvarā vanavasesā;",
    "words": [
      {
        "w": "Tasā",
        "gloss": "trembling, mobile, timid ones — read naturalistically as 'moving creatures' or, with the commentary, as 'the frail': those still subject to craving and fear; PED cites Sn 146 s.v. tasa",
        "gram": "adj. as subst., nom. pl. m.",
        "ped": "PED s.v. tasa²"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "thāvarā",
        "gloss": "firm, stationary ones — naturalistically 'stationary creatures'; commentarially 'the secure': those whose craving is ended (arahants)",
        "gram": "adj. as subst., nom. pl. m.",
        "ped": "PED s.v. thāvara"
      },
      {
        "w": "vanavasesā;",
        "gloss": "= va (= vā 'or', shortened metri causa) + anavasesā 'without remainder, with none left out' (an + avasesa 'remainder')",
        "gram": "indecl. + adj., nom. pl. m.",
        "ped": "PED s.v. avasesa¹ (an°)"
      }
    ],
    "translation": {
      "text": "with not a one left out—",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:4.2, verbatim"
    },
    "notes": "Two things to flag. (1) The tasā/thāvarā pair is CONTESTED both ways: plain zoological 'moving or stationary' vs the commentary's doctrinal 'those with craving vs arahants free of it'; both reported, unresolved. (2) Sujato's verse 4 redistributes the clauses across segments (anavasesā 'none left out' is rendered here at 4.2; tasā/thāvarā appear in his 4.3 'frail or firm') — the translation is aligned by segment ID and is verbatim; the apparent offset is his verse-level poetics, not an error."
  },
  {
    "ref": "snp1.8:4.3",
    "pali": "Dīghā vā ye va mahantā,",
    "words": [
      {
        "w": "Dīghā",
        "gloss": "long (creatures — snakes, worms and the like, says the commentary)",
        "gram": "adj., nom. pl. m.",
        "ped": "PED s.v. dīgha"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "ye",
        "gloss": "those which",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "va",
        "gloss": "= vā 'or', shortened metri causa",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      },
      {
        "w": "mahantā,",
        "gloss": "great, large",
        "gram": "adj., nom. pl. m. (mahant)",
        "ped": "PED s.v. mahant"
      }
    ],
    "translation": {
      "text": "frail or firm, long or large, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:4.3, verbatim"
    },
    "notes": "See snp1.8:4.2 on Sujato's clause redistribution within verse 4."
  },
  {
    "ref": "snp1.8:4.4",
    "pali": "Majjhimā rassakā aṇukathūlā.",
    "words": [
      {
        "w": "Majjhimā",
        "gloss": "middling, medium-sized",
        "gram": "adj., nom. pl. m.",
        "ped": "PED s.v. majjhima"
      },
      {
        "w": "rassakā",
        "gloss": "short (rassa with the adjectival suffix -ka)",
        "gram": "adj., nom. pl. m.",
        "ped": "PED s.v. rassa"
      },
      {
        "w": "aṇukathūlā.",
        "gloss": "= aṇuka + thūla, a dvandva: minute or bulky — the subtle/tiny and the gross/fat (Sujato: 'tiny or round'; the commentary takes thūla of round-bodied creatures)",
        "gram": "dvandva cpd. adj., nom. pl. m.",
        "ped": "PED s.v. aṇu; s.v. thūla"
      }
    ],
    "translation": {
      "text": "medium, small, tiny or round, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:4.4, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:5.1",
    "pali": "Diṭṭhā vā ye va adiṭṭhā,",
    "words": [
      {
        "w": "Diṭṭhā",
        "gloss": "seen (creatures one has seen)",
        "gram": "pp. of passati (√dis), nom. pl. m.",
        "ped": "PED s.v. diṭṭha¹"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "ye",
        "gloss": "those which",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "va",
        "gloss": "= vā 'or', shortened metri causa",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      },
      {
        "w": "adiṭṭhā,",
        "gloss": "unseen (a + diṭṭha) — creatures never encountered",
        "gram": "neg. pp., nom. pl. m.",
        "ped": "PED s.v. diṭṭha¹"
      }
    ],
    "translation": {
      "text": "seen or unseen, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:5.1, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:5.2",
    "pali": "Ye va dūre vasanti avidūre;",
    "words": [
      {
        "w": "Ye",
        "gloss": "those which",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "va",
        "gloss": "= vā 'or', shortened metri causa",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      },
      {
        "w": "dūre",
        "gloss": "far away, in the distance",
        "gram": "loc. sg. as adv.",
        "ped": "PED s.v. dūra"
      },
      {
        "w": "vasanti",
        "gloss": "they dwell, live",
        "gram": "pres. 3 pl. of vasati (√vas)",
        "ped": "PED s.v. vasati²"
      },
      {
        "w": "avidūre;",
        "gloss": "not far, nearby (a + vidūra)",
        "gram": "loc. sg. as adv.",
        "ped": "PED s.v. avidūra"
      }
    ],
    "translation": {
      "text": "living far or near, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:5.2, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:5.3",
    "pali": "Bhūtā va sambhavesī va,",
    "words": [
      {
        "w": "Bhūtā",
        "gloss": "those who have come to be, the (already) born",
        "gram": "pp. of bhavati as subst., nom. pl. m.",
        "ped": "PED s.v. bhūta"
      },
      {
        "w": "va",
        "gloss": "= vā 'or', shortened metri causa (some read = eva)",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      },
      {
        "w": "sambhavesī",
        "gloss": "'seekers of becoming', those yet to be born (sambhava 'origination, coming-to-be' + -esin 'seeking'); nom. pl. of the -in stem with -ī",
        "gram": "cpd. adj. (poss. -in stem) as subst., nom. pl. m.",
        "ped": "PED s.v. sambhava (–esin)"
      },
      {
        "w": "va,",
        "gloss": "= vā 'or'",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      }
    ],
    "translation": {
      "text": "those who have been born <j>and those about to be born—",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:5.3, verbatim"
    },
    "notes": "CONTESTED both ways: the commentary reads bhūtā as arahants (for whom no further becoming is sought) and sambhavesī as all beings still bound to seek rebirth — a doctrinal split; the plainer reading (which Sujato renders) is biological: beings already born vs beings on the way to birth (the commentary's own alternative: egg-born and womb-born creatures before hatching/birth). The term sambhavesin also figures in later 'intermediate state' debates (whether a being can be 'seeking birth' between lives); the text itself decides none of this. Both positions stated; unresolved."
  },
  {
    "ref": "snp1.8:5.4",
    "pali": "Sabbasattā bhavantu sukhitattā.",
    "words": [
      {
        "w": "Sabbasattā",
        "gloss": "= sabba + satta: all beings, all sentient creatures",
        "gram": "kammadhāraya cpd., nom. pl. m.",
        "ped": "PED s.v. sabba; s.v. satta²"
      },
      {
        "w": "bhavantu",
        "gloss": "may they be, may they become",
        "gram": "imper. 3 pl. of bhavati (√bhū)",
        "ped": "PED s.v. bhavati"
      },
      {
        "w": "sukhitattā.",
        "gloss": "= sukhita + attan: 'with happy selves', happy at heart, blissful in themselves",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. sukhita; s.v. attan"
      }
    ],
    "translation": {
      "text": "may all beings be happy! ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:5.4, verbatim"
    },
    "notes": "Verbatim repetition of snp1.8:3.4 in the Pāli; Sujato's rendering differs only in capitalization ('may' vs 'May'), preserved exactly as in the source segment."
  },
  {
    "ref": "snp1.8:6.1",
    "pali": "Na paro paraṁ nikubbetha,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "paro",
        "gloss": "one (person) — para used pronominally: 'the one… the other'",
        "gram": "pron. adj., nom. sg. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "paraṁ",
        "gloss": "another",
        "gram": "pron. adj., acc. sg. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "nikubbetha,",
        "gloss": "should deceive, cheat, humiliate (nikaroti; the middle-voice optative nikubbetha is the old Vedic-style form)",
        "gram": "opt. med. 3 sg. of nikaroti (ni + √kar)",
        "ped": "PED s.v. nikaroti"
      }
    ],
    "translation": {
      "text": "Let none deceive another, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:6.1, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:6.2",
    "pali": "Nātimaññetha katthaci na kañci;",
    "words": [
      {
        "w": "Nātimaññetha",
        "gloss": "= na + atimaññetha (vowel sandhi a + a > ā): 'nor should despise, look down on' (ati 'over' + maññati 'to think': to think oneself above)",
        "gram": "neg. + opt. med. 3 sg. of atimaññati (ati + √man)",
        "ped": "PED s.v. atimaññati"
      },
      {
        "w": "katthaci",
        "gloss": "anywhere (kattha 'where' + indefinitizing -ci)",
        "gram": "indecl. (indef. adv.)",
        "ped": "PED s.v. kattha"
      },
      {
        "w": "na",
        "gloss": "not (reinforcing the negation: 'nor… anyone')",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "kañci;",
        "gloss": "anyone (kaṁ + indefinitizing -ci)",
        "gram": "indef. pron., acc. sg. m.",
        "ped": "PED s.v. ka² (koci)"
      }
    ],
    "translation": {
      "text": "nor look down on anyone anywhere. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:6.2, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:6.3",
    "pali": "Byārosanā paṭighasañña,",
    "words": [
      {
        "w": "Byārosanā",
        "gloss": "through anger, ill-temper, the wish to hurt (vyārosanā, written by- for vy-); the ending -ā stands for the instrumental -āya, shortened metri causa",
        "gram": "f., instr. sg. (-ā for -āya, metrical)",
        "ped": "PED s.v. vyārosa"
      },
      {
        "w": "paṭighasañña,",
        "gloss": "= paṭigha + saññā(ya): 'through a perception of repugnance', an aversive thought or hostile attitude (paṭigha 'repulsion, resentment' + saññā 'perception, idea'); final vowel shortened, again instrumental in sense",
        "gram": "tappurisa cpd. f., instr. sg. (-a for -āya, metrical)",
        "ped": "PED s.v. paṭigha; s.v. saññā"
      }
    ],
    "translation": {
      "text": "Though provoked or aggrieved, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:6.3, verbatim"
    },
    "notes": "Both words are truncated instrumentals depending on the next line's verb: 'let them not, out of anger or hostile perception, wish suffering on one another'. Sujato's 'Though provoked or aggrieved' recasts the instrumentals concessively; the commentary reads them as plain instruments of the wishing. Both construals reported."
  },
  {
    "ref": "snp1.8:6.4",
    "pali": "Nāññamaññassa dukkhamiccheyya.",
    "words": [
      {
        "w": "Nāññamaññassa",
        "gloss": "= na + aññamaññassa (vowel sandhi): 'not… for one another' (aññamañña, the reciprocal 'one another', lit. 'other-other')",
        "gram": "neg. + recip. pron., dat./gen. sg.",
        "ped": "PED s.v. aññamañña"
      },
      {
        "w": "dukkhamiccheyya.",
        "gloss": "= dukkhaṁ + iccheyya (sandhi -ṁ + i- written -m-i-): 'suffering, pain' + 'should wish'",
        "gram": "dukkhaṁ: nt., acc. sg.; iccheyya: opt. 3 sg. of icchati (√is)",
        "ped": "PED s.v. dukkha; s.v. icchati"
      }
    ],
    "translation": {
      "text": "let them not wish pain on each other. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:6.4, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:7.1",
    "pali": "Mātā yathā niyaṁ puttam",
    "words": [
      {
        "w": "Mātā",
        "gloss": "a mother",
        "gram": "f., nom. sg. (stem mātar)",
        "ped": "PED s.v. mātar"
      },
      {
        "w": "yathā",
        "gloss": "just as (opening the simile; correlative evampi 'so too' in 7.3)",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      },
      {
        "w": "niyaṁ",
        "gloss": "her own (niya = nija 'one's own')",
        "gram": "adj., acc. sg. m.",
        "ped": "PED s.v. niya"
      },
      {
        "w": "puttam",
        "gloss": "child, son; the final is written -m (not -ṁ) because the next word (Āyusā, 7.2) begins with a vowel — pure sandhi spelling, same word as puttaṁ",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. putta"
      }
    ],
    "translation": {
      "text": "Even as a mother would protect with her life ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:7.1, verbatim"
    },
    "notes": "See snp1.8:7.4 for the simile-syntax crux (what exactly is being compared)."
  },
  {
    "ref": "snp1.8:7.2",
    "pali": "Āyusā ekaputtamanurakkhe;",
    "words": [
      {
        "w": "Āyusā",
        "gloss": "with her life, at the cost of her own life (āyu(s) 'life, vitality'; the old -s stem shows in this instrumental)",
        "gram": "nt., instr. sg. (stem āyus)",
        "ped": "PED s.v. āyu"
      },
      {
        "w": "ekaputtamanurakkhe;",
        "gloss": "= ekaputtam + anurakkhe (sandhi -ṁ + a- written -m-a-): 'her only child' (eka 'one, only' + putta) + 'would protect, watch over'",
        "gram": "ekaputtaṁ: kammadhāraya cpd., acc. sg. m.; anurakkhe: opt. 3 sg. of anurakkhati (anu + √rakkh)",
        "ped": "PED s.v. eka; s.v. putta; s.v. anurakkhati"
      }
    ],
    "translation": {
      "text": "her child, her only child, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:7.2, verbatim"
    },
    "notes": "Sujato carries 'would protect with her life' up into his 7.1 and renders the child-phrases here — verse-level poetics; alignment is by segment ID and the translation is verbatim."
  },
  {
    "ref": "snp1.8:7.3",
    "pali": "Evampi sabbabhūtesu,",
    "words": [
      {
        "w": "Evampi",
        "gloss": "= evaṁ + pi (sandhi -ṁ + p- written -m-p-): 'even so, so too' — the correlative answering yathā in 7.1",
        "gram": "indecl. + encl. particle",
        "ped": "PED s.v. evaṁ; s.v. pi"
      },
      {
        "w": "sabbabhūtesu,",
        "gloss": "toward all beings (sabba 'all' + bhūta 'being'; locative of reference: with respect to all that lives)",
        "gram": "cpd., loc. pl.",
        "ped": "PED s.v. sabba; s.v. bhūta"
      }
    ],
    "translation": {
      "text": "so too for all creatures ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:7.3, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:7.4",
    "pali": "Mānasaṁ bhāvaye aparimāṇaṁ.",
    "words": [
      {
        "w": "Mānasaṁ",
        "gloss": "mind, heart (mānasa, the poetic equivalent of mano/manas; in this sutta the mettā-filled mind itself)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. mānasa"
      },
      {
        "w": "bhāvaye",
        "gloss": "should develop, cultivate, bring into being (bhāveti, the causative of bhavati — the standard verb of meditative cultivation, whence bhāvanā)",
        "gram": "opt. 3 sg. of bhāveti (caus. of √bhū)",
        "ped": "PED s.v. bhāveti"
      },
      {
        "w": "aparimāṇaṁ.",
        "gloss": "boundless, without measure (a + parimāṇa 'measure')",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. parimāṇa"
      }
    ],
    "translation": {
      "text": "unfold a boundless heart. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:7.4, verbatim"
    },
    "notes": "CONTESTED — the famous simile-syntax crux, both ways. Reading (a), the popular one: love all beings AS a mother loves her only child (the mother's love is the model for the meditator's love of beings). Reading (b), pressed by the syntax: the verbs are anurakkhe 'would PROTECT' (7.2) and bhāvaye 'should develop' — as a mother would protect her only child with her life, SO should one protect/cultivate the boundless mind toward all beings; the point of comparison is the guarding, and what corresponds to the child is the mettā-mind itself, to be safeguarded at any cost. The commentarial tradition leans toward the cultivation-guarding reading; most popular renderings assume (a). Sujato's translation keeps the mother clause intact and lets the ambiguity stand. Both positions stated; unresolved."
  },
  {
    "ref": "snp1.8:8.1",
    "pali": "Mettañca sabbalokasmi,",
    "words": [
      {
        "w": "Mettañca",
        "gloss": "= mettaṁ + ca (sandhi -ṁ + c- written -ñ-c-): 'and love, friendliness, active goodwill' (the abstract noun of mitta 'friend'; PED registers both mettā f. and metta nt., and this accusative could be either)",
        "gram": "acc. sg. (f. mettā or nt. metta — both attested) + conj.",
        "ped": "PED s.v. mettā; s.v. ca"
      },
      {
        "w": "sabbalokasmi,",
        "gloss": "in/toward the entire world (sabba + loka); the locative -asmi stands for -asmiṁ with the final nasal dropped metri causa",
        "gram": "cpd., loc. sg. m. (-asmi for -asmiṁ, metrical)",
        "ped": "PED s.v. sabba; s.v. loka"
      }
    ],
    "translation": {
      "text": "With love for the whole world, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:8.1, verbatim"
    },
    "notes": "This is the only occurrence of the word mettā in the sutta named after it."
  },
  {
    "ref": "snp1.8:8.2",
    "pali": "Mānasaṁ bhāvaye aparimāṇaṁ;",
    "words": [
      {
        "w": "Mānasaṁ",
        "gloss": "mind, heart (mānasa; see snp1.8:7.4)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. mānasa"
      },
      {
        "w": "bhāvaye",
        "gloss": "should develop, cultivate",
        "gram": "opt. 3 sg. of bhāveti (caus. of √bhū)",
        "ped": "PED s.v. bhāveti"
      },
      {
        "w": "aparimāṇaṁ;",
        "gloss": "boundless, without measure",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. parimāṇa"
      }
    ],
    "translation": {
      "text": "unfold a boundless heart: ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:8.2, verbatim"
    },
    "notes": "Pāli repeats 7.4 (with ; for .); the repetition is in the source text, not an encoding artifact."
  },
  {
    "ref": "snp1.8:8.3",
    "pali": "Uddhaṁ adho ca tiriyañca,",
    "words": [
      {
        "w": "Uddhaṁ",
        "gloss": "above, upward",
        "gram": "adv. (indecl.)",
        "ped": "PED s.v. uddhaṁ"
      },
      {
        "w": "adho",
        "gloss": "below, downward",
        "gram": "adv. (indecl.)",
        "ped": "PED s.v. adho"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "tiriyañca,",
        "gloss": "= tiriyaṁ + ca (sandhi -ṁ + c- written -ñ-c-): 'and across, horizontally, all around'",
        "gram": "adv. (indecl.) + conj.",
        "ped": "PED s.v. tiriyaṁ; s.v. ca"
      }
    ],
    "translation": {
      "text": "above, below, all round, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:8.3, verbatim"
    },
    "notes": "The three directions — up, down, across — are the sutta's compressed version of the pervasion formula that the prose suttas give in full (cf. the brahmavihāra pericope); the commentary maps them onto higher/lower/middling realms of beings. Described, not adjudicated."
  },
  {
    "ref": "snp1.8:8.4",
    "pali": "Asambādhaṁ averamasapattaṁ.",
    "words": [
      {
        "w": "Asambādhaṁ",
        "gloss": "unconstricted, without cramping or barrier (a + sambādha 'crowding, obstruction') — the commentary: with the boundaries between beings broken down, love without exclusion zones",
        "gram": "adj., acc. sg. nt. (agreeing with mānasaṁ)",
        "ped": "PED s.v. sambādha"
      },
      {
        "w": "averamasapattaṁ.",
        "gloss": "= averaṁ + asapattaṁ (glide -m- in sandhi): 'without enmity' (a + vera 'hatred') + 'without foe or rival' (a + sapatta) — the commentary distributes the pair as: free of hostility within, having no enemy without",
        "gram": "two adjs., acc. sg. nt.",
        "ped": "PED s.v. avera; s.v. sapatta"
      }
    ],
    "translation": {
      "text": "unconstricted, without enmity or foe. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:8.4, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:9.1",
    "pali": "Tiṭṭhaṁ caraṁ nisinno va,",
    "words": [
      {
        "w": "Tiṭṭhaṁ",
        "gloss": "standing",
        "gram": "pres. part. of tiṭṭhati (√ṭhā), nom. sg. m.",
        "ped": "PED s.v. tiṭṭhati"
      },
      {
        "w": "caraṁ",
        "gloss": "walking, moving about",
        "gram": "pres. part. of carati (√car), nom. sg. m.",
        "ped": "PED s.v. carati"
      },
      {
        "w": "nisinno",
        "gloss": "seated",
        "gram": "pp. of nisīdati (ni + √sad), nom. sg. m.",
        "ped": "PED s.v. nisinna"
      },
      {
        "w": "va,",
        "gloss": "= vā 'or', shortened metri causa",
        "gram": "indecl. (encl., = vā)",
        "ped": "PED s.v. va"
      }
    ],
    "translation": {
      "text": "When standing, walking, sitting, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:9.1, verbatim"
    },
    "notes": "The four postures (standing, walking, sitting, lying) are the canon's standard merism for 'at all times' — the same four organize the postures section of the Satipaṭṭhāna Sutta (MN 10)."
  },
  {
    "ref": "snp1.8:9.2",
    "pali": "Sayāno yāvatāssa vitamiddho;",
    "words": [
      {
        "w": "Sayāno",
        "gloss": "lying down",
        "gram": "pres. med. part. of sayati (√śī), nom. sg. m.",
        "ped": "PED s.v. sayati"
      },
      {
        "w": "yāvatāssa",
        "gloss": "= yāvatā + assa (vowel sandhi): 'for as long as' + 'one should be'",
        "gram": "indecl. (rel. adv.) + opt. 3 sg. of atthi (√as)",
        "ped": "PED s.v. yāvatā; s.v. atthi"
      },
      {
        "w": "vitamiddho;",
        "gloss": "= vīta + middha: free of drowsiness, with torpor gone (vīta 'gone, without' + middha 'torpor, sloth'); the first vowel is shortened (vita- for vīta-) metri causa",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. vīta; s.v. middha"
      }
    ],
    "translation": {
      "text": "or lying down while yet unweary, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:9.2, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:9.3",
    "pali": "Etaṁ satiṁ adhiṭṭheyya,",
    "words": [
      {
        "w": "Etaṁ",
        "gloss": "this (the mettā-awareness just described)",
        "gram": "dem. pron., acc. sg. f. (agreeing with satiṁ)",
        "ped": "PED s.v. eta"
      },
      {
        "w": "satiṁ",
        "gloss": "mindfulness, awareness, keeping-in-mind — here the boundless-love awareness itself is called a sati",
        "gram": "f., acc. sg. (sati)",
        "ped": "PED s.v. sati"
      },
      {
        "w": "adhiṭṭheyya,",
        "gloss": "should resolve upon, stand firmly in, keep steadily to (adhiṭṭhāti, lit. 'to stand upon' — whence adhiṭṭhāna 'resolve')",
        "gram": "opt. 3 sg. of adhiṭṭhāti (adhi + √ṭhā)",
        "ped": "PED s.v. adhiṭṭhāti"
      }
    ],
    "translation": {
      "text": "keep this ever in mind; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:9.3, verbatim"
    },
    "notes": "Notable diction: the sutta calls this sustained mettā a 'mindfulness' (sati) — one of the few places sati names a brahmavihāra-style awareness rather than satipaṭṭhāna-style observation. Reported as the text's own usage."
  },
  {
    "ref": "snp1.8:9.4",
    "pali": "Brahmametaṁ vihāramidhamāhu.",
    "words": [
      {
        "w": "Brahmametaṁ",
        "gloss": "= brahmaṁ + etaṁ (glide -m- in sandhi): 'divine, sublime, best' + 'this' — 'this, they say, is the divine…'",
        "gram": "adj., acc. sg. m. + dem. pron., acc. sg. m.",
        "ped": "PED s.v. brahma; s.v. eta"
      },
      {
        "w": "vihāramidhamāhu.",
        "gloss": "= vihāraṁ + idha + āhu (glide -m- in sandhi): 'abiding, dwelling' + 'here' + 'they say, they have called'. The phrase brahmaṁ vihāraṁ is the poetic seed of the technical term brahmavihāra 'divine abiding'",
        "gram": "vihāraṁ: m., acc. sg.; idha: indecl.; āhu: perf. 3 pl. of √ah",
        "ped": "PED s.v. vihāra; s.v. idha; s.v. āha"
      }
    ],
    "translation": {
      "text": "for this, they say, is a divine meditation <j>in this life. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:9.4, verbatim"
    },
    "notes": "idha 'here' is construed two ways: with the abiding ('a divine abiding HERE, in this very life' — so Sujato's 'in this life') or with āhu ('here [in this teaching] they call it divine'). Both reported; unresolved."
  },
  {
    "ref": "snp1.8:10.1",
    "pali": "Diṭṭhiñca anupaggamma,",
    "words": [
      {
        "w": "Diṭṭhiñca",
        "gloss": "= diṭṭhiṁ + ca (sandhi -ṁ + c- written -ñ-c-): 'and view' — diṭṭhi, in canonical usage almost always speculative or wrong view when unqualified",
        "gram": "f., acc. sg. + conj.",
        "ped": "PED s.v. diṭṭhi; s.v. ca"
      },
      {
        "w": "anupaggamma,",
        "gloss": "= an + upagamma: 'not having gone to', not resorting to, not adopting (absolutive of upagacchati). The Mahāsaṅgiti's geminate -gg- (anupaggamma) is a metrical doubling; most editions print anupagamma",
        "gram": "neg. + ger. (absol.) of upagacchati (upa + √gam)",
        "ped": "PED s.v. upagacchati"
      }
    ],
    "translation": {
      "text": "Avoiding harmful views, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:10.1, verbatim"
    },
    "notes": "CONTESTED — the closing turn, both ways. (a) The commentarial reading: diṭṭhi here is specifically the wrong view of a self (sakkāyadiṭṭhi) that could crystallize around the beings one loves; the practitioner drops it and gains right seeing — 'dassanena sampanno' (10.2) is then the vision of the first path, and the verse maps the mettā practice onto the stream-entry scheme (Sujato's 'harmful views' fits this line). (b) An anti-speculative reading, in the spirit of the Aṭṭhakavagga's critique of view-holding as such (Snp 4, where clinging to any diṭṭhi is the disease): 'not taking up views' means stepping past the view-forming habit altogether, so the poem ends by transcending even right opinions. The Pāli says only 'not resorting to view'; both readings are reported and neither resolved."
  },
  {
    "ref": "snp1.8:10.2",
    "pali": "Sīlavā dassanena sampanno;",
    "words": [
      {
        "w": "Sīlavā",
        "gloss": "virtuous, possessed of moral conduct",
        "gram": "adj. (poss. -vant stem), nom. sg. m.",
        "ped": "PED s.v. sīla (sīlavant)"
      },
      {
        "w": "dassanena",
        "gloss": "with seeing, vision, insight — in the commentarial reading, the path-vision of stream-entry; in the plain reading, clear seeing",
        "gram": "nt., instr. sg.",
        "ped": "PED s.v. dassana"
      },
      {
        "w": "sampanno;",
        "gloss": "endowed, accomplished, perfected",
        "gram": "pp. of sampajjati (saṁ + √pad), nom. sg. m.",
        "ped": "PED s.v. sampanna"
      }
    ],
    "translation": {
      "text": "virtuous, accomplished in insight, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:10.2, verbatim"
    },
    "notes": "See the both-ways note at snp1.8:10.1 — the force of 'dassanena sampanno' shifts with the reading of diṭṭhi."
  },
  {
    "ref": "snp1.8:10.3",
    "pali": "Kāmesu vinaya gedhaṁ,",
    "words": [
      {
        "w": "Kāmesu",
        "gloss": "with regard to sensual pleasures (locative of reference)",
        "gram": "m., loc. pl.",
        "ped": "PED s.v. kāma"
      },
      {
        "w": "vinaya",
        "gloss": "having removed, dispelled — a shortened absolutive of vineti 'to lead away, remove' (= vineyya/vinayitvā), the short form metri causa; some grammarians alternatively parse it as a 2 sg. imperative ('dispel!'), which breaks the verse's third-person frame — both parses noted",
        "gram": "ger. (absol.) of vineti (vi + √nī); alt. parse: imper. 2 sg.",
        "ped": "PED s.v. vineti"
      },
      {
        "w": "gedhaṁ,",
        "gloss": "greed, craving, longing",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. gedha"
      }
    ],
    "translation": {
      "text": "with desire for sensual pleasures dispelled, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:10.3, verbatim"
    },
    "notes": null
  },
  {
    "ref": "snp1.8:10.4",
    "pali": "Na hi jātuggabbhaseyya punaretī”ti.",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "hi",
        "gloss": "indeed, for, surely (emphatic-causal particle)",
        "gram": "indecl. (emph.)",
        "ped": "PED s.v. hi"
      },
      {
        "w": "jātuggabbhaseyya",
        "gloss": "= jātu + gabbhaseyya(ṁ): 'surely, ever' + 'lying in a womb' — womb-rebirth (gabbha 'womb' + seyyā 'lying, bed'); the -gg- doubling after jātu is metrical sandhi, and the accusative's final -ṁ is elided before the following puna",
        "gram": "indecl. + tappurisa cpd. f., acc. sg. (gabbhaseyyaṁ, nasal elided)",
        "ped": "PED s.v. jātu; s.v. gabbha (–seyyā)"
      },
      {
        "w": "punaretī”ti.",
        "gloss": "= puna + r + eti + ti: 'again' + 'comes (back to)' + the end-quote particle closing the sutta's verses; the -r- is the historical sandhi consonant (Skt punar), and -i- of eti is lengthened to -ī- before ti. The closing quotation mark belongs to the Bilara segment punctuation, paired with the opening quote at 1.1",
        "gram": "indecl. + pres. 3 sg. of eti (√i) + quot. particle (iti/ti)",
        "ped": "PED s.v. puna; s.v. eti; s.v. iti"
      }
    ],
    "translation": {
      "text": "they never return to a womb again. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), snp1.8:10.4, verbatim"
    },
    "notes": "The text's own claim — the practitioner 'never again comes to lying in a womb', i.e. no further rebirth (commentarially: the non-returner or arahant fruit of the practice) — is DESCRIBED as what the sutta says, not endorsed as a claim about the world."
  },
  {
    "ref": "snp1.8:10.5",
    "pali": "Mettasuttaṁ aṭṭhamaṁ.",
    "words": [
      {
        "w": "Mettasuttaṁ",
        "gloss": "the Metta Sutta (title as inflected noun)",
        "gram": "tappurisa cpd., nom. sg. nt.",
        "ped": "PED s.v. mettā; s.v. sutta"
      },
      {
        "w": "aṭṭhamaṁ.",
        "gloss": "eighth — the eighth sutta of the Uragavagga (Snp chapter 1)",
        "gram": "ordinal adj., nom. sg. nt.",
        "ped": "PED s.v. aṭṭha¹ (aṭṭhama)"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Metta Sutta, the eighth'). Sujato's Bilara translation file has no segment 10.5 — colophons are left untranslated — so translation is null here by fidelity to the source, not by omission."
  }
];
