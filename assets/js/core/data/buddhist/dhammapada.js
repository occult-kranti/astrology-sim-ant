// ============================================================================
//  core/data/buddhist/dhammapada.js  —  GENERATED, DO NOT HAND-EDIT.
//  Regenerate: node r31build/gen-dhammapada.cjs (reads r31data/dhp-vaggas-*.json verbatim).
//
//  The Dhammapada, vaggas 1–5 (Dhp 1–75) — word-by-word. 395 segment records
//  (228 for vaggas 1–3 + 167 for vaggas 4–5), 957 glossed word tokens.
//  Root Pāli: Mahāsaṅgīti Tipiṭaka via SuttaCentral (declared PD) — tagged cc0.
//  Translation: Bhikkhu Sujato, 'Sayings of the Dhamma' (SuttaCentral, CC0) — VERBATIM
//  (63 segments — chapter headers’ partners, vatthu story-titles and vagga colophons —
//  carry translation === null where Sujato’s Bilara file has no segment; not omission).
//  Glosses/gram: original prose, PED-informed (PED 1921–25, PD) — tagged original.
//  Reconstruction invariant: words[].w.join(" ") === record.pali (395/395).
//  The per-record `section` field is DERIVED (vagga grouping for the reading room /
//  section rail); all canonical fields (ref/pali/words/translation/notes) are byte-verbatim.
//  Per-file provenance is preserved in DHAMMAPADA_META.parts. DOM-free pure data.
// ============================================================================

export const DHAMMAPADA_META = {
  "title": "The Dhammapada, vaggas 1–5 (Dhp 1–75) — word-by-word",
  "text": "The first five chapters (vaggas) of the Dhammapada, a book of the Khuddaka Nikāya: Yamakavagga 'the Pairs' (Dhp 1–20), Appamādavagga 'Heedfulness' (21–32), Cittavagga 'the Mind' (33–43), Pupphavagga 'Flowers' (44–59), and Bālavagga 'the Fool' (60–75). These are vaggas 1–5 of the traditional 26; the remaining 21 are catalogued, not yet glossed.",
  "source": {
    "pali": "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral — Bilara root segment files for dhp1–75 (the exact per-vagga file list is preserved verbatim in meta.parts[].source; branch published, fetched 2026-07-17).",
    "translation": "Bhikkhu Sujato, 'Sayings of the Dhamma' (Dhammapada), SuttaCentral — Bilara translation segment files for dhp1–75 (per-vagga file list in meta.parts[].source; branch published, fetched 2026-07-17).",
    "glosses": "Original prose written for this wing, informed by the PTS Pali-English Dictionary (Rhys Davids & Stede, 1921–25; US-PD), cited per word as 'PED s.v. <headword>'. The Digital Pāḷi Dictionary (CC BY-NC-SA) was used strictly as a lookup/verification instrument; no DPD text is reproduced."
  },
  "licenses": {
    "translation": "CC0 1.0 (public-domain dedication). SuttaCentral licensing page: \"All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).\" Doubly sourced at repo level, suttacentral/bilara-data LICENSE.md: \"All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.\"",
    "pali": "Public domain per SuttaCentral's declaration (licensing page): \"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other languages are in the public domain. Such material does not fall within the scope of copyright.\" The Mahāsaṅgīti edition is distributed as PD by SuttaCentral, its publisher-partner.",
    "glosses": "original (written for this wing); grammatical facts are uncopyrightable; expressive gloss prose is original, PED-informed and PED-cited. No Buddharakkhita / Norman / Thanissaro / Fronsdal wording is used anywhere.",
    "ped": "PTS Pali-English Dictionary, Chipstead 1921–25 — US-PD by the 95-year rule."
  },
  "conventions": {
    "ref": "Bilara segment IDs (dhp1:0.1 … dhp43:5), the community-standard citation grain; 1:1 aligned with the root and, where present, the Sujato translation JSON. Verse-lines are dhpN:1, dhpN:2 …; chapter headers dhpN:0.1–0.3; vatthu story-titles dhp1:0.4 and dhpN:0; colophons dhp20:7, dhp32:5, dhp43:5.",
    "pali": "The Bilara root segment value, NFC, with the file's single trailing space trimmed. All other characters — including the curly quotation marks fused to tokens at dhp17:3 and dhp18:3 (“Pāpaṁ … katan”ti) — are preserved exactly.",
    "translationText": "Byte-verbatim value from the Sujato Bilara segment file, INCLUDING trailing spaces and the <j> line-join markers (e.g. dhp17:1, 17:3, 17:4); a mechanical diff against the source JSON must show zero differences. Segments with no Sujato counterpart — the vatthu story-titles (dhp1:0.4, dhpN:0) and the three vagga colophons — have translation null (fidelity, not omission).",
    "reconstruction": "Joining words[].w with single spaces rebuilds the (trimmed) pali string exactly, verified mechanically for every one of the 228 records. Every whitespace-delimited surface token of the segment — punctuation, quote marks and all — is exactly one words[] entry.",
    "sandhi": "Sandhi/fused tokens are NOT split into multiple entries (which would break reconstruction). A fused token gets ONE entry whose gloss opens with the resolution in the form '= a + b: …', and whose gram field gives the morphology of each resolved member in order. ped may cite several headwords, separated as 'PED s.v. a; s.v. b'. va is disambiguated per instance as = iva 'like' (the similes), = vā 'or', or = eva (emphatic).",
    "gram": "Abbreviations: nom./acc./instr./dat./gen./loc./abl. (cases), sg./pl. (number), m./f./nt. (gender), adj., subst., pron. (rel. = relative, dem. = demonstrative, indef. = indefinite, recip. = reciprocal, encl. = enclitic), pres. (present), aor. (aorist), fut. (future), opt. (optative), imper. (imperative), perf. (perfect), med. (middle voice), ppr. (present participle), pp. (past participle), grdv. (gerundive = future passive participle), ger./absol. (absolutive gerund), inf. (infinitive), cpd. (compound; dvandva/bahubbīhi/tappurisa/kammadhāraya named where useful), poss. (possessive stem), indecl. (indeclinable), metri causa (metrically conditioned form).",
    "notes": "notes is null or a prose note; contested points state both positions with sources and are never resolved. Described, never prescribed: the text's own claims (rebirth, no return to the womb, the deathless, transcendence of merit and evil) are reported as what the text says, not endorsed. The famous cruxes get careful both-ways notes: manopubbaṅgamā dhammā (dhp1:1), appamādo amatapadaṁ (dhp21:1), plus yamāmase (6:2), saṁhita (19:1), okamokataubbhato (34:2), dīpa 'island/lamp' (25:3), and others."
  },
  "counts": {
    "records": 395,
    "verses": 75,
    "vaggas": 5,
    "wordRecords": 957,
    "translatedSegments": 332,
    "nullTranslationSegments": 63,
    "translationChars": 10562,
    "countNote": "Merged from two verified source files (vaggas 1–3 = 228 records / 552 word tokens; vaggas 4–5 = 167 records / 405 word tokens). Totals here are computed live over the concatenated records. The full 26-vagga Dhammapada is ~5,618 Pāli tokens; this wing glosses vaggas 1–5 (Dhp 1–75) in full. Each record's `section` field is derived by the generator from its verse number and the vagga headers; all canonical fields are byte-verbatim."
  },
  "vaggas": [
    {
      "n": 1,
      "pali": "Yamakavagga",
      "title": "1. Pairs",
      "start": 1,
      "end": 20,
      "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
    },
    {
      "n": 2,
      "pali": "Appamādavagga",
      "title": "2. Diligence",
      "start": 21,
      "end": 32,
      "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
    },
    {
      "n": 3,
      "pali": "Cittavagga",
      "title": "3. The Mind",
      "start": 33,
      "end": 43,
      "section": "3. The Mind · Cittavagga (Dhp 33–43)"
    },
    {
      "n": 4,
      "pali": "Pupphavagga",
      "title": "4. Flowers",
      "start": 44,
      "end": 59,
      "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
    },
    {
      "n": 5,
      "pali": "Bālavagga",
      "title": "5. The Fool",
      "start": 60,
      "end": 75,
      "section": "5. The Fool · Bālavagga (Dhp 60–75)"
    }
  ],
  "parts": [
    {
      "span": "1–3 (Dhp 1–43)",
      "title": "Dhammapada, vaggas 1–3 (Yamakavagga, Appamādavagga, Cittavagga; verses 1–43) — word-by-word",
      "source": {
        "pali": "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral — segment files bilara-data root/pli/ms/sutta/kn/dhp/{dhp1-20,dhp21-32,dhp33-43}_root-pli-ms.json (branch published, fetched 2026-07-17)",
        "translation": "Bhikkhu Sujato, 'Sayings of the Dhamma' (Dhammapada), SuttaCentral — segment files bilara-data translation/en/sujato/sutta/kn/dhp/{dhp1-20,dhp21-32,dhp33-43}_translation-en-sujato.json (branch published, fetched 2026-07-17)",
        "glosses": "Original prose written for this wing, informed by the PTS Pali-English Dictionary (Rhys Davids & Stede, 1921–25; US-PD), cited per word as 'PED s.v. <headword>'. The Digital Pāḷi Dictionary (CC BY-NC-SA) was used strictly as a lookup/verification instrument; no DPD text is reproduced."
      },
      "licenses": {
        "translation": "CC0 1.0 (public-domain dedication). SuttaCentral licensing page: \"All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).\" Doubly sourced at repo level, suttacentral/bilara-data LICENSE.md: \"All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.\"",
        "pali": "Public domain per SuttaCentral's declaration (licensing page): \"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other languages are in the public domain. Such material does not fall within the scope of copyright.\" The Mahāsaṅgīti edition is distributed as PD by SuttaCentral, its publisher-partner.",
        "glosses": "original (written for this wing); grammatical facts are uncopyrightable; expressive gloss prose is original, PED-informed and PED-cited. No Buddharakkhita / Norman / Thanissaro / Fronsdal wording is used anywhere.",
        "ped": "PTS Pali-English Dictionary, Chipstead 1921–25 — US-PD by the 95-year rule."
      },
      "conventions": {
        "ref": "Bilara segment IDs (dhp1:0.1 … dhp43:5), the community-standard citation grain; 1:1 aligned with the root and, where present, the Sujato translation JSON. Verse-lines are dhpN:1, dhpN:2 …; chapter headers dhpN:0.1–0.3; vatthu story-titles dhp1:0.4 and dhpN:0; colophons dhp20:7, dhp32:5, dhp43:5.",
        "pali": "The Bilara root segment value, NFC, with the file's single trailing space trimmed. All other characters — including the curly quotation marks fused to tokens at dhp17:3 and dhp18:3 (“Pāpaṁ … katan”ti) — are preserved exactly.",
        "translationText": "Byte-verbatim value from the Sujato Bilara segment file, INCLUDING trailing spaces and the <j> line-join markers (e.g. dhp17:1, 17:3, 17:4); a mechanical diff against the source JSON must show zero differences. Segments with no Sujato counterpart — the vatthu story-titles (dhp1:0.4, dhpN:0) and the three vagga colophons — have translation null (fidelity, not omission).",
        "reconstruction": "Joining words[].w with single spaces rebuilds the (trimmed) pali string exactly, verified mechanically for every one of the 228 records. Every whitespace-delimited surface token of the segment — punctuation, quote marks and all — is exactly one words[] entry.",
        "sandhi": "Sandhi/fused tokens are NOT split into multiple entries (which would break reconstruction). A fused token gets ONE entry whose gloss opens with the resolution in the form '= a + b: …', and whose gram field gives the morphology of each resolved member in order. ped may cite several headwords, separated as 'PED s.v. a; s.v. b'. va is disambiguated per instance as = iva 'like' (the similes), = vā 'or', or = eva (emphatic).",
        "gram": "Abbreviations: nom./acc./instr./dat./gen./loc./abl. (cases), sg./pl. (number), m./f./nt. (gender), adj., subst., pron. (rel. = relative, dem. = demonstrative, indef. = indefinite, recip. = reciprocal, encl. = enclitic), pres. (present), aor. (aorist), fut. (future), opt. (optative), imper. (imperative), perf. (perfect), med. (middle voice), ppr. (present participle), pp. (past participle), grdv. (gerundive = future passive participle), ger./absol. (absolutive gerund), inf. (infinitive), cpd. (compound; dvandva/bahubbīhi/tappurisa/kammadhāraya named where useful), poss. (possessive stem), indecl. (indeclinable), metri causa (metrically conditioned form).",
        "notes": "notes is null or a prose note; contested points state both positions with sources and are never resolved. Described, never prescribed: the text's own claims (rebirth, no return to the womb, the deathless, transcendence of merit and evil) are reported as what the text says, not endorsed. The famous cruxes get careful both-ways notes: manopubbaṅgamā dhammā (dhp1:1), appamādo amatapadaṁ (dhp21:1), plus yamāmase (6:2), saṁhita (19:1), okamokataubbhato (34:2), dīpa 'island/lamp' (25:3), and others."
      },
      "counts": {
        "records": 228,
        "verses": 43,
        "vaggas": 3,
        "headerSegments": 9,
        "verseLineSegments": 184,
        "vatthuTitleSegments": 32,
        "colophonSegments": 3,
        "translatedSegments": 193,
        "nullTranslationSegments": 35,
        "wordRecords": 552,
        "uniqueSurfaceForms": 385,
        "pedCitations": 552,
        "pedNull": 0,
        "countNote": "The R28 plan's Appendix A measured 5,618 Pāli word tokens / 3,041 unique forms for the whole 26-vagga Dhammapada; this file encodes vaggas 1–3 only. Every root segment of the three files is represented as one record, including collection/chapter headers, commentarial vatthu story-titles, and the three vagga colophons. 'wordRecords' counts every whitespace-delimited surface token across all segments (headers, vatthu titles and colophons included)."
      }
    },
    {
      "span": "4–5 (Dhp 44–75)",
      "title": "Dhammapada, Pupphavagga (Flowers, 44–59) & Bālavagga (The Fool, 60–75) — word-by-word",
      "source": {
        "pali": "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral — segment files bilara-data root/pli/ms/sutta/kn/dhp/dhp44-59_root-pli-ms.json and dhp60-75_root-pli-ms.json (branch published, fetched 2026-07-17)",
        "translation": "Bhikkhu Sujato, Sayings of the Dhamma, SuttaCentral — segment files bilara-data translation/en/sujato/sutta/kn/dhp/dhp44-59_translation-en-sujato.json and dhp60-75_translation-en-sujato.json (branch published, fetched 2026-07-17)",
        "variants": "Edition variants noted in-data are quoted from bilara-data variant/pli/ms/sutta/kn/dhp/dhp44-59_variant-pli-ms.json and dhp60-75_variant-pli-ms.json (Mahāsaṅgīti apparatus; sigla bj = Burmese, sya/sya-all/km = Sinhala/Siamese, pts1ed/pts2ed = PTS, mr = Marammaraṭṭha, cck/csp1ed = further editions, ṭīkā = subcommentary).",
        "glosses": "Original prose written for this wing, informed by the PTS Pali-English Dictionary (Rhys Davids & Stede, 1921–25; US-PD), cited per record as 'PED s.v. <headword>'. The Digital Pāḷi Dictionary (CC BY-NC-SA) was used strictly as a lookup/verification instrument; no DPD text is reproduced. No Buddharakkhita/Norman/Thanissaro/Fronsdal wording is used anywhere."
      },
      "licenses": {
        "translation": "CC0 1.0 (public-domain dedication). SuttaCentral licensing page: \"All original material created by SuttaCentral is dedicated to the Public Domain by means of Creative Commons Zero (CC0 1.0 Universal).\" Doubly sourced at repo level, suttacentral/bilara-data LICENSE.md: \"All translations created in Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons Public Domain (CC0) license.\"",
        "pali": "Public domain per SuttaCentral's declaration (licensing page): \"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other languages are in the public domain. Such material does not fall within the scope of copyright.\" The Mahāsaṅgīti edition is distributed as PD by SuttaCentral, its publisher-partner.",
        "glosses": "original (written for this wing); grammatical facts are uncopyrightable; expressive gloss prose is original, PED-informed and PED-cited.",
        "ped": "PTS Pali-English Dictionary, Chipstead 1921–25 — US-PD by the 95-year rule."
      },
      "conventions": {
        "ref": "Bilara segment IDs (dhp44:0.1 … dhp75:7), the community-standard citation grain; 1:1 aligned with root and translation JSON. Header segments (X:0.1–0.3), vatthu story-titles (X:0 or X:0.4), verse lines (X:1..n), and vagga colophons are all encoded.",
        "pali": "The Bilara root segment value, NFC, with the file's single trailing space trimmed. All other characters — including the curly quote marks on dhp63:4 (“bālo”ti) — are preserved exactly.",
        "translationText": "Byte-verbatim value from the Sujato Bilara segment file, INCLUDING trailing spaces and any <j>/em-dash line-join punctuation. A mechanical diff against the source JSON shows zero differences. Segments with no Sujato value (vatthu titles, the two colophons) have translation null; dhp72:0 has an empty-string Sujato value, preserved as \"\".",
        "reconstruction": "Joining words[].w with single spaces rebuilds the (trimmed) pali string exactly. Every whitespace-delimited surface token — punctuation, quote marks and all — is exactly one words[] entry.",
        "sandhi": "Sandhi/fused tokens are NOT split into multiple entries (which would break reconstruction). A fused token gets ONE entry whose gloss opens with the resolution in the form '= a + b: …', and whose gram field gives the morphology of each resolved member in order. ped may cite several headwords, separated as 'PED s.v. a; s.v. b'.",
        "gram": "Abbreviations: nom./acc./instr./dat./gen./loc. (cases), sg./pl. (number), m./f./nt. (gender), adj., subst., pron. (rel. = relative, dem. = demonstrative, indef. = indefinite, interr. = interrogative, refl. = reflexive), pres. (present), fut. (future), opt. (optative), imper. (imperative), perf. (perfect), med. (middle voice), pass. (passive), part. (participle), pp. (past participle), grdv./fpp. (gerundive = future passive participle), ger./absol. (absolutive gerund), cpd. (compound; dvandva/bahubbīhi/tappurisa/kammadhāraya named where useful), poss. (possessive stem), encl. (enclitic), indecl. (indeclinable), compar. (comparative), metri causa (metrically conditioned form).",
        "notes": "notes is null or a prose note; contested points state both positions with sources and are never resolved. Flower/garland/fragrance similes have their compound structure flagged (e.g. vaṇṇagandha dvandva at dhp49:2, mālāguṇa 'garland-string' at dhp53:2, sīlagandha at dhp55:4). The dhp60:1 'dīghā jāgarato ratti' both-ways sense (wearisome long night vs. the vigilant one) is stated, unresolved. Described, never prescribed: the text's own claims (kamma-ripening, no return to a womb, Māra losing the track) are reported as what the text says."
      },
      "counts": {
        "records": 167,
        "pupphavagga": {
          "verses": 16,
          "records": 80
        },
        "balavagga": {
          "verses": 16,
          "records": 87
        },
        "verses": 32,
        "headerSegments": 6,
        "vatthuSegments": 27,
        "colophonSegments": 2,
        "nullTranslationSegments": 28,
        "wordRecords": 405,
        "uniqueSurfaceForms": 316,
        "countNote": "Records are Bilara segments (verse-line grain): 80 for Pupphavagga (dhp44-59) + 87 for Bālavagga (dhp60-75). Each vagga carries 16 verses. 'wordRecords' counts every whitespace-delimited surface token glossed (headers, vatthu story-titles, verse lines, and vagga colophons all glossed). nullTranslationSegments are the vatthu story-titles and the two vagga colophons, which Sujato's Bilara files do not translate (dhp72:0 is the one exception: Sujato carries an empty-string segment for it, preserved verbatim as \"\")."
      }
    }
  ]
};

export const DHAMMAPADA_RECORDS = [
  {
    "ref": "dhp1:0.1",
    "pali": "Khuddakanikāya",
    "words": [
      {
        "w": "Khuddakanikāya",
        "gloss": "= khuddaka + nikāya: the 'Minor Collection', the fifth and miscellaneous nikāya of the Sutta Piṭaka (khuddaka 'small, minor' + nikāya 'collection, group'); the Dhammapada is one of its books",
        "gram": "tappurisa cpd., nom. sg. m. (title, uninflected citation form)",
        "ped": "PED s.v. khuddaka; s.v. nikāya"
      }
    ],
    "translation": {
      "text": "Minor Collection ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:0.1, verbatim"
    },
    "notes": "Header segment (edition apparatus).",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:0.2",
    "pali": "Dhammapada",
    "words": [
      {
        "w": "Dhammapada",
        "gloss": "= dhamma + pada: 'Dhamma-path' or 'words/lines of the Dhamma' — the title admits both 'the path of the teaching' (pada 'path, step') and 'sayings/verse-lines of the teaching' (pada 'word, verse-line'); both are current",
        "gram": "cpd., nom. sg. nt. (title)",
        "ped": "PED s.v. dhamma; s.v. pada"
      }
    ],
    "translation": {
      "text": "Sayings of the Dhamma 1–20 ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:0.2, verbatim"
    },
    "notes": "Title; the two senses of pada (path vs word/verse) are both live in the very title — flagged, not resolved.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:0.3",
    "pali": "Yamakavagga",
    "words": [
      {
        "w": "Yamakavagga",
        "gloss": "= yamaka + vagga: the 'Chapter of Pairs' (yamaka 'twin, paired' + vagga 'chapter, section') — so called because its verses come in matched pairs (1–2, 3–4, 15–16, …) contrasting a dark and a bright case",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. yamaka; s.v. vagga"
      }
    ],
    "translation": {
      "text": "1. Pairs ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:0.3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:0.4",
    "pali": "Cakkhupālattheravatthu",
    "words": [
      {
        "w": "Cakkhupālattheravatthu",
        "gloss": "= Cakkhupāla + thera + vatthu: 'the story of the Elder Cakkhupāla' — the commentarial frame-narrative (Dhp-a); Cakkhupāla ('guardian of the eye', cakkhu 'eye' + pāla 'guardian') is the monk who went blind rather than break his meditation vow. thera 'elder'; vatthu 'story, basis, ground'",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. cakkhu; s.v. pāla; s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Commentarial story-title (Dhp-a). The root file carries these vatthu rubrics, but Sujato's translation does not render them, so translation is null here (fidelity, not omission). All dhpN:0 segments below are of this kind.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:1",
    "pali": "Manopubbaṅgamā dhammā,",
    "words": [
      {
        "w": "Manopubbaṅgamā",
        "gloss": "= mano + pubbaṅgama: 'having mind as forerunner', mind-preceded — the mental states (dhammā) have mind (mano/manas) going before them as leader. pubbaṅgama = pubba 'before, first' + gama (from gacchati 'to go') 'going', hence 'going before, preceding, chief'. CONTESTED (see note): mano may be the cause/leader that produces the dhammas, or merely first in sequence.",
        "gram": "bahubbīhi cpd. adj., nom. pl. m. (agreeing with dhammā); mano- is the -o composition form of the -s stem mano/manas",
        "ped": "PED s.v. mano; s.v. pubbaṅgama"
      },
      {
        "w": "dhammā,",
        "gloss": "mental states, experiences, phenomena — here the constituents/contents of experience (Sujato: 'experiences'); dhamma is famously multivalent (teaching, law, thing, mental object, quality). The commentary glosses these as the kammically active mind-states bound up with intention.",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. dhamma"
      }
    ],
    "translation": {
      "text": "Intention shapes experiences; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:1, verbatim"
    },
    "notes": "The famous opening, contested both ways on two linked points. (1) manopubbaṅgama: mano (mind/mentality, the -s stem manas) 'goes before' the dhammas — either as their CAUSE/leader (mind produces and dominates the mental states; so the commentary and most renderings, 'mind precedes / is the forerunner of all things') or, more weakly, as merely first-in-sequence. The compound is a bahubbīhi: the dhammas are 'those-of-which-mind-is-the-forerunner'. (2) dhammā: unqualified here it is read as 'mental states / experiences' (the kammic mind-states, so Buddhaghosa; Sujato 'experiences'), NOT external 'things' in the widest sense, though the Victorian control renderings universalize it (Müller: 'all that we are is the result of what we have thought'). mano vs the near-synonyms citta and viññāṇa is itself a standing exegetical question; here mano is chosen for the alliterative triad mano-… mano-… mano-. Both positions reported; neither resolved.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:2",
    "pali": "manoseṭṭhā manomayā;",
    "words": [
      {
        "w": "manoseṭṭhā",
        "gloss": "= mano + seṭṭha: 'having mind as chief/best', mind-led — mind is the foremost of them (seṭṭha 'best, highest, chief', superl.)",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. mano; s.v. seṭṭha"
      },
      {
        "w": "manomayā;",
        "gloss": "= mano + maya: 'made of / made by mind', mind-wrought (the suffix -maya 'consisting of, made of')",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. mano; s.v. maya"
      }
    ],
    "translation": {
      "text": "intention is first, they’re made by intention. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:3",
    "pali": "Manasā ce paduṭṭhena,",
    "words": [
      {
        "w": "Manasā",
        "gloss": "with the mind, by mind (instrumental of mano/manas)",
        "gram": "nt., instr. sg. (stem manas)",
        "ped": "PED s.v. mano"
      },
      {
        "w": "ce",
        "gloss": "if",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "paduṭṭhena,",
        "gloss": "corrupted, defiled, malignant — with a mind gone bad (pp of padussati 'to offend, be corrupt', pa + √dus)",
        "gram": "pp., instr. sg. nt. (agreeing with manasā)",
        "ped": "PED s.v. paduṭṭha"
      }
    ],
    "translation": {
      "text": "If with corrupt intent ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:4",
    "pali": "bhāsati vā karoti vā;",
    "words": [
      {
        "w": "bhāsati",
        "gloss": "one speaks",
        "gram": "pres. 3 sg. of bhāsati (√bhās)",
        "ped": "PED s.v. bhāsati¹"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "karoti",
        "gloss": "one does, acts",
        "gram": "pres. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "vā;",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      }
    ],
    "translation": {
      "text": "you speak or act, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:5",
    "pali": "Tato naṁ dukkhamanveti,",
    "words": [
      {
        "w": "Tato",
        "gloss": "thence, from that, thereupon",
        "gram": "adv. (abl. of ta)",
        "ped": "PED s.v. tato"
      },
      {
        "w": "naṁ",
        "gloss": "him/that one (enclitic accusative pronoun)",
        "gram": "encl. pron., acc. sg. m.",
        "ped": "PED s.v. naṁ"
      },
      {
        "w": "dukkhamanveti,",
        "gloss": "= dukkhaṁ + anveti (sandhi -ṁ + a- written -m-a-): 'suffering' + 'follows after, accompanies' (anveti = anu + eti 'to go after')",
        "gram": "dukkhaṁ: nt., nom. sg.; anveti: pres. 3 sg. of anveti (anu + √i)",
        "ped": "PED s.v. dukkha; s.v. anveti"
      }
    ],
    "translation": {
      "text": "suffering follows you, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:5, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp1:6",
    "pali": "cakkaṁva vahato padaṁ.",
    "words": [
      {
        "w": "cakkaṁva",
        "gloss": "= cakkaṁ + va (= iva 'like'): 'like the wheel' (cakka 'wheel'; va is the enclitic short form of iva)",
        "gram": "cakkaṁ: nt., nom./acc. sg.; va: indecl. (= iva, comparative)",
        "ped": "PED s.v. cakka; s.v. iva"
      },
      {
        "w": "vahato",
        "gloss": "of the one drawing/pulling the load, i.e. of the draught-ox (genitive of the pres. part. vahant, from vahati 'to carry, draw')",
        "gram": "ppr., gen. sg. m. (vahant)",
        "ped": "PED s.v. vahati"
      },
      {
        "w": "padaṁ.",
        "gloss": "the foot, hoof — here the ox's foot, which the cart-wheel follows step by step (pada in its concrete sense 'foot, footstep')",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. pada"
      }
    ],
    "translation": {
      "text": "like a wheel, the ox’s foot. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp1:6, verbatim"
    },
    "notes": "The simile: as the cart-wheel follows the hoof of the ox that draws it, so suffering follows the doer of the evil deed. pada here is 'foot/track' — contrast its abstract sense 'state, path' at Dhp 21 (amatapada); the word's range is flagged wherever it recurs.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:0",
    "pali": "Maṭṭhakuṇḍalīvatthu",
    "words": [
      {
        "w": "Maṭṭhakuṇḍalīvatthu",
        "gloss": "= Maṭṭhakuṇḍalī + vatthu: 'the story of Maṭṭhakuṇḍalī' — the youth 'with polished ear-rings' (maṭṭha 'polished, burnished' + kuṇḍala 'ear-ring' + -in) who was reborn in heaven for a moment's faith; vatthu 'story'",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. kuṇḍala; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:1",
    "pali": "Manopubbaṅgamā dhammā,",
    "words": [
      {
        "w": "Manopubbaṅgamā",
        "gloss": "= mano + pubbaṅgama: 'having mind as forerunner', mind-preceded — the mental states (dhammā) have mind (mano/manas) going before them as leader. pubbaṅgama = pubba 'before, first' + gama (from gacchati 'to go') 'going', hence 'going before, preceding, chief'. CONTESTED (see note): mano may be the cause/leader that produces the dhammas, or merely first in sequence.",
        "gram": "bahubbīhi cpd. adj., nom. pl. m. (agreeing with dhammā); mano- is the -o composition form of the -s stem mano/manas",
        "ped": "PED s.v. mano; s.v. pubbaṅgama"
      },
      {
        "w": "dhammā,",
        "gloss": "mental states, experiences, phenomena — here the constituents/contents of experience (Sujato: 'experiences'); dhamma is famously multivalent (teaching, law, thing, mental object, quality). The commentary glosses these as the kammically active mind-states bound up with intention.",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. dhamma"
      }
    ],
    "translation": {
      "text": "Intention shapes experiences; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:1, verbatim"
    },
    "notes": "Identical Pāli to Dhp 1:1; the Yamakavagga's paired structure (the bright verse answering the dark). Glossed in full again per the wing's convention.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:2",
    "pali": "manoseṭṭhā manomayā;",
    "words": [
      {
        "w": "manoseṭṭhā",
        "gloss": "= mano + seṭṭha: 'having mind as chief/best', mind-led — mind is the foremost of them (seṭṭha 'best, highest, chief', superl.)",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. mano; s.v. seṭṭha"
      },
      {
        "w": "manomayā;",
        "gloss": "= mano + maya: 'made of / made by mind', mind-wrought (the suffix -maya 'consisting of, made of')",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. mano; s.v. maya"
      }
    ],
    "translation": {
      "text": "intention is first, they’re made by intention. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:3",
    "pali": "Manasā ce pasannena,",
    "words": [
      {
        "w": "Manasā",
        "gloss": "with the mind, by mind (instrumental of mano/manas)",
        "gram": "nt., instr. sg. (stem manas)",
        "ped": "PED s.v. mano"
      },
      {
        "w": "ce",
        "gloss": "if",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "pasannena,",
        "gloss": "bright, clear, purified, confident — with a mind made serene (pp of pasīdati 'to become clear, be gladdened', pa + √sad)",
        "gram": "pp., instr. sg. nt.",
        "ped": "PED s.v. pasanna"
      }
    ],
    "translation": {
      "text": "If with pure intent ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:4",
    "pali": "bhāsati vā karoti vā;",
    "words": [
      {
        "w": "bhāsati",
        "gloss": "one speaks",
        "gram": "pres. 3 sg. of bhāsati (√bhās)",
        "ped": "PED s.v. bhāsati¹"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "karoti",
        "gloss": "one does, acts",
        "gram": "pres. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "vā;",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      }
    ],
    "translation": {
      "text": "you speak or act, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:5",
    "pali": "Tato naṁ sukhamanveti,",
    "words": [
      {
        "w": "Tato",
        "gloss": "thence, thereupon",
        "gram": "adv. (abl. of ta)",
        "ped": "PED s.v. tato"
      },
      {
        "w": "naṁ",
        "gloss": "him/that one (enclitic accusative pronoun)",
        "gram": "encl. pron., acc. sg. m.",
        "ped": "PED s.v. naṁ"
      },
      {
        "w": "sukhamanveti,",
        "gloss": "= sukhaṁ + anveti (sandhi -ṁ + a- written -m-a-): 'happiness' + 'follows after'",
        "gram": "sukhaṁ: nt., nom. sg.; anveti: pres. 3 sg. (anu + √i)",
        "ped": "PED s.v. sukha; s.v. anveti"
      }
    ],
    "translation": {
      "text": "happiness follows you ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:5, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp2:6",
    "pali": "chāyāva anapāyinī.",
    "words": [
      {
        "w": "chāyāva",
        "gloss": "= chāyā + va (= iva 'like'): 'like a shadow' (chāyā 'shade, shadow')",
        "gram": "chāyā: f., nom. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. chāyā; s.v. iva"
      },
      {
        "w": "anapāyinī.",
        "gloss": "not departing, never leaving (an + apāyin, from apeti 'to go away'); f. to agree with chāyā — the shadow that does not forsake its object",
        "gram": "adj. (poss. -in stem), nom. sg. f.",
        "ped": "PED s.v. apāyin"
      }
    ],
    "translation": {
      "text": "like a shadow that never leaves. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp2:6, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp3:0",
    "pali": "Tissattheravatthu",
    "words": [
      {
        "w": "Tissattheravatthu",
        "gloss": "= Tissa + thera + vatthu: 'the story of the Elder Tissa' (Tissa, a personal name; thera 'elder'; vatthu 'story')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp3:1",
    "pali": "Akkocchi maṁ avadhi maṁ,",
    "words": [
      {
        "w": "Akkocchi",
        "gloss": "'he/they abused, reviled me' — aorist of akkosati 'to scold, revile, abuse' (ā + √kruś)",
        "gram": "aor. 3 sg. of akkosati (ā + √kruś)",
        "ped": "PED s.v. akkosati"
      },
      {
        "w": "maṁ",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      },
      {
        "w": "avadhi",
        "gloss": "'he/they struck, beat, killed' — aorist of vadhati/hanati 'to strike, slay' (a- is the augment)",
        "gram": "aor. 3 sg. of vadhati (√vadh/han)",
        "ped": "PED s.v. vadhati; s.v. hanati"
      },
      {
        "w": "maṁ,",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      }
    ],
    "translation": {
      "text": "“They abused me, they hit me! ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp3:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp3:2",
    "pali": "ajini maṁ ahāsi me;",
    "words": [
      {
        "w": "ajini",
        "gloss": "'he/they defeated, conquered me' — aorist of jināti 'to conquer, win' (√ji)",
        "gram": "aor. 3 sg. of jināti (√ji)",
        "ped": "PED s.v. jināti"
      },
      {
        "w": "maṁ",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      },
      {
        "w": "ahāsi",
        "gloss": "'he/they carried off, robbed' — aorist of harati 'to carry, take away, rob' (√har)",
        "gram": "aor. 3 sg. of harati (√har)",
        "ped": "PED s.v. harati"
      },
      {
        "w": "me;",
        "gloss": "of/from me (my possessions)",
        "gram": "pers. pron., gen. sg.",
        "ped": "PED s.v. ahaṁ (me)"
      }
    ],
    "translation": {
      "text": "They beat me, they robbed me!” ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp3:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp3:3",
    "pali": "Ye ca taṁ upanayhanti,",
    "words": [
      {
        "w": "Ye",
        "gloss": "those who (relative)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "taṁ",
        "gloss": "that (grudge/thought), it",
        "gram": "dem. pron., acc. sg. nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "upanayhanti,",
        "gloss": "they harbour, tie up, nurse (a grudge) — lit. 'bind close to', pres. of upanayhati (upa + √nah 'to bind'); whence upanāha 'enmity, grudge'",
        "gram": "pres. 3 pl. of upanayhati (upa + √nah)",
        "ped": "PED s.v. upanayhati"
      }
    ],
    "translation": {
      "text": "For those who bear such a grudge, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp3:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp3:4",
    "pali": "veraṁ tesaṁ na sammati.",
    "words": [
      {
        "w": "veraṁ",
        "gloss": "hatred, enmity, hostility",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. vera"
      },
      {
        "w": "tesaṁ",
        "gloss": "of/for them (their hatred)",
        "gram": "dem. pron., gen. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "sammati.",
        "gloss": "is stilled, is appeased, comes to rest, ceases (sammati, √śam 'to be calmed')",
        "gram": "pres. 3 sg. of sammati (√śam)",
        "ped": "PED s.v. sammati¹"
      }
    ],
    "translation": {
      "text": "hatred is never laid to rest. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp3:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp4:1",
    "pali": "Akkocchi maṁ avadhi maṁ,",
    "words": [
      {
        "w": "Akkocchi",
        "gloss": "'he/they abused, reviled me' — aorist of akkosati 'to scold, revile, abuse' (ā + √kruś)",
        "gram": "aor. 3 sg. of akkosati (ā + √kruś)",
        "ped": "PED s.v. akkosati"
      },
      {
        "w": "maṁ",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      },
      {
        "w": "avadhi",
        "gloss": "'he/they struck, beat, killed' — aorist of vadhati/hanati 'to strike, slay' (a- is the augment)",
        "gram": "aor. 3 sg. of vadhati (√vadh/han)",
        "ped": "PED s.v. vadhati; s.v. hanati"
      },
      {
        "w": "maṁ,",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      }
    ],
    "translation": {
      "text": "“They abused me, they hit me! ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp4:1, verbatim"
    },
    "notes": "Identical to Dhp 3:1 (the paired 'bright' verse of vv. 3–4).",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp4:2",
    "pali": "ajini maṁ ahāsi me;",
    "words": [
      {
        "w": "ajini",
        "gloss": "'he/they defeated, conquered me' — aorist of jināti 'to conquer, win' (√ji)",
        "gram": "aor. 3 sg. of jināti (√ji)",
        "ped": "PED s.v. jināti"
      },
      {
        "w": "maṁ",
        "gloss": "me",
        "gram": "pers. pron., acc. sg.",
        "ped": "PED s.v. ahaṁ (maṁ)"
      },
      {
        "w": "ahāsi",
        "gloss": "'he/they carried off, robbed' — aorist of harati 'to carry, take away, rob' (√har)",
        "gram": "aor. 3 sg. of harati (√har)",
        "ped": "PED s.v. harati"
      },
      {
        "w": "me;",
        "gloss": "of/from me (my possessions)",
        "gram": "pers. pron., gen. sg.",
        "ped": "PED s.v. ahaṁ (me)"
      }
    ],
    "translation": {
      "text": "They beat me, they robbed me!” ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp4:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp4:3",
    "pali": "Ye ca taṁ nupanayhanti,",
    "words": [
      {
        "w": "Ye",
        "gloss": "those who (relative)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "taṁ",
        "gloss": "that (grudge), it",
        "gram": "dem. pron., acc. sg. nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "nupanayhanti,",
        "gloss": "= na + upanayhanti (sandhi: na + u- → nu-): 'do not harbour, do not nurse (the grudge)'",
        "gram": "neg. + pres. 3 pl. of upanayhati (upa + √nah)",
        "ped": "PED s.v. na¹; s.v. upanayhati"
      }
    ],
    "translation": {
      "text": "For those who bear no such grudge, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp4:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp4:4",
    "pali": "veraṁ tesūpasammati.",
    "words": [
      {
        "w": "veraṁ",
        "gloss": "hatred, enmity",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. vera"
      },
      {
        "w": "tesūpasammati.",
        "gloss": "= tesu + upasammati (sandhi -u + u- → -ū-): 'in/for them' + 'is fully stilled, is quelled' (upasammati = upa + √śam, intensive of sammati)",
        "gram": "tesu: dem. pron., loc. pl. m.; upasammati: pres. 3 sg. (upa + √śam)",
        "ped": "PED s.v. ta; s.v. upasammati"
      }
    ],
    "translation": {
      "text": "hatred is laid to rest. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp4:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp5:0",
    "pali": "Kāḷayakkhinīvatthu",
    "words": [
      {
        "w": "Kāḷayakkhinīvatthu",
        "gloss": "= Kāḷ(ī) + yakkhinī + vatthu: 'the story of the black she-spirit' — kāḷī/kāḷa 'black' + yakkhinī 'female yakkha, ogress'; the vengeful spirit whose feud the Buddha stills with this verse",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. kāḷa; s.v. yakkhinī; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp5:1",
    "pali": "Na hi verena verāni,",
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
        "w": "verena",
        "gloss": "by hatred, through enmity",
        "gram": "nt., instr. sg.",
        "ped": "PED s.v. vera"
      },
      {
        "w": "verāni,",
        "gloss": "hatreds, enmities (pl.)",
        "gram": "nt., nom. pl.",
        "ped": "PED s.v. vera"
      }
    ],
    "translation": {
      "text": "For never is hatred ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp5:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp5:2",
    "pali": "sammantīdha kudācanaṁ;",
    "words": [
      {
        "w": "sammantīdha",
        "gloss": "= sammanti + idha (sandhi -i + i- → -ī-): 'are stilled' + 'here, in this world' (sammanti pres. 3 pl. of sammati; idha 'here')",
        "gram": "sammanti: pres. 3 pl. of sammati (√śam); idha: indecl. adv.",
        "ped": "PED s.v. sammati¹; s.v. idha"
      },
      {
        "w": "kudācanaṁ;",
        "gloss": "ever, at any time (kudā 'when' + -canaṁ indefinitizing); with the preceding na = 'never'",
        "gram": "indecl. (indef. adv.)",
        "ped": "PED s.v. kudācanaṁ"
      }
    ],
    "translation": {
      "text": "laid to rest by hate, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp5:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp5:3",
    "pali": "Averena ca sammanti,",
    "words": [
      {
        "w": "Averena",
        "gloss": "by non-hatred, through love/absence of enmity (a + vera); the commentary glosses it as mettā/khanti — loving-kindness and patience",
        "gram": "nt., instr. sg.",
        "ped": "PED s.v. avera"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "sammanti,",
        "gloss": "are stilled, come to rest",
        "gram": "pres. 3 pl. of sammati (√śam)",
        "ped": "PED s.v. sammati¹"
      }
    ],
    "translation": {
      "text": "it’s laid to rest by love: ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp5:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp5:4",
    "pali": "esa dhammo sanantano.",
    "words": [
      {
        "w": "esa",
        "gloss": "this (is)",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. esa (eta)"
      },
      {
        "w": "dhammo",
        "gloss": "law, principle, timeless norm — here dhamma in the sense of a standing 'law' or rule of things (Sujato: 'teaching'), not 'mental state' as in vv. 1–2",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "sanantano.",
        "gloss": "ancient, primeval, perennial, eternal (sanantana 'of old, from the beginning')",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. sanantana"
      }
    ],
    "translation": {
      "text": "this is an ancient teaching. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp5:4, verbatim"
    },
    "notes": "dhamma here shifts sense from vv. 1–2: an 'ancient law/principle' (sanantano dhammo) — the perennial rule that hatred ends only by non-hatred. The polysemy of dhamma (mental state / teaching / law / thing) is the standing crux flagged at Dhp 1:1.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp6:0",
    "pali": "Kosambakavatthu",
    "words": [
      {
        "w": "Kosambakavatthu",
        "gloss": "= Kosambaka + vatthu: 'the story of the monks of Kosambī' (kosambaka 'of/pertaining to Kosambī', the city) — the quarrelsome community the Buddha admonishes",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp6:1",
    "pali": "Pare ca na vijānanti,",
    "words": [
      {
        "w": "Pare",
        "gloss": "others, the others (the quarrelling folk)",
        "gram": "pron. adj., nom. pl. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "vijānanti,",
        "gloss": "they understand, realize, come to know (vijānāti, vi + √ñā)",
        "gram": "pres. 3 pl. of vijānāti (vi + √ñā)",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "When others do not understand, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp6:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp6:2",
    "pali": "mayamettha yamāmase;",
    "words": [
      {
        "w": "mayamettha",
        "gloss": "= mayaṁ + ettha (sandhi -ṁ + e- → -m-e-): 'we' + 'here, in this matter' (mayaṁ 'we'; ettha 'here, herein')",
        "gram": "mayaṁ: pers. pron., nom. pl.; ettha: indecl. adv.",
        "ped": "PED s.v. mayaṁ; s.v. ettha"
      },
      {
        "w": "yamāmase;",
        "gloss": "'let us restrain ourselves / be self-controlled' — an archaic 1 pl. middle imperative-optative of yamati 'to restrain, control'; CONTESTED (see note): some read it as 'we (too) perish/are checked'",
        "gram": "1 pl. med. (imper./opt.) of yamati (√yam); archaic Vedic-type ending -āmase",
        "ped": "PED s.v. yamati"
      }
    ],
    "translation": {
      "text": "let us, who do understand this, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp6:2, verbatim"
    },
    "notes": "yamāmase is archaic and genuinely contested both ways. (a) From yamati 'to restrain': 'let us here control ourselves' — quarrels are stilled by self-restraint (so the commentary and Sujato: 'let us, who do understand this, restrain ourselves'). (b) Read as equivalent to 'we here must perish / are subject to death' (linking to the sense of yam-/Yama, death), giving 'others do not realize that we here must die; but those who realize it — their quarrels are stilled' — the reading of Müller and many older translators, on the mortality-awareness reading. Both positions stated; unresolved.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp6:3",
    "pali": "Ye ca tattha vijānanti,",
    "words": [
      {
        "w": "Ye",
        "gloss": "those who (relative)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "tattha",
        "gloss": "there, in that matter, therein",
        "gram": "indecl. adv.",
        "ped": "PED s.v. tattha"
      },
      {
        "w": "vijānanti,",
        "gloss": "they understand, realize",
        "gram": "pres. 3 pl. of vijānāti (vi + √ñā)",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "restrain ourselves in this regard; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp6:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp6:4",
    "pali": "tato sammanti medhagā.",
    "words": [
      {
        "w": "tato",
        "gloss": "thence, thereby, as a result",
        "gram": "adv. (abl. of ta)",
        "ped": "PED s.v. tato"
      },
      {
        "w": "sammanti",
        "gloss": "are stilled, cease",
        "gram": "pres. 3 pl. of sammati (√śam)",
        "ped": "PED s.v. sammati¹"
      },
      {
        "w": "medhagā.",
        "gloss": "quarrels, disputes, contentions (medhaga)",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. medhaga"
      }
    ],
    "translation": {
      "text": "for that is how conflicts are laid to rest. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp6:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:0",
    "pali": "Mahākāḷattheravatthu",
    "words": [
      {
        "w": "Mahākāḷattheravatthu",
        "gloss": "= Mahākāḷa + thera + vatthu: 'the story of the Elder Mahākāḷa' (mahā 'great' + kāḷa 'black', a personal name; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. mahā; s.v. kāḷa; s.v. thera"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:1",
    "pali": "Subhānupassiṁ viharantaṁ,",
    "words": [
      {
        "w": "Subhānupassiṁ",
        "gloss": "= subha + anupassin: 'contemplating the beautiful/attractive', dwelling seeing (things as) lovely (subha 'beautiful, pleasant' + anupassin 'contemplating', from anupassati)",
        "gram": "cpd. adj. (poss. -in stem), acc. sg. m.",
        "ped": "PED s.v. subha; s.v. anupassin"
      },
      {
        "w": "viharantaṁ,",
        "gloss": "dwelling, living, abiding (pres. part. of viharati 'to dwell')",
        "gram": "ppr., acc. sg. m. (viharant)",
        "ped": "PED s.v. viharati"
      }
    ],
    "translation": {
      "text": "Those who contemplate the beautiful, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:2",
    "pali": "indriyesu asaṁvutaṁ;",
    "words": [
      {
        "w": "indriyesu",
        "gloss": "in/over the sense-faculties (the senses: eye, ear, etc.)",
        "gram": "nt., loc. pl.",
        "ped": "PED s.v. indriya"
      },
      {
        "w": "asaṁvutaṁ;",
        "gloss": "unrestrained, uncontrolled (a + saṁvuta, pp of saṁvarati 'to restrain, hold in')",
        "gram": "neg. pp., acc. sg. m.",
        "ped": "PED s.v. saṁvuta"
      }
    ],
    "translation": {
      "text": "their faculties unrestrained, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:3",
    "pali": "Bhojanamhi cāmattaññuṁ,",
    "words": [
      {
        "w": "Bhojanamhi",
        "gloss": "in/with regard to food, eating (locative of bhojana 'food, meal')",
        "gram": "nt., loc. sg. (-amhi ending)",
        "ped": "PED s.v. bhojana"
      },
      {
        "w": "cāmattaññuṁ,",
        "gloss": "= ca + amattaññuṁ (sandhi a + a → ā): 'and' + 'not knowing moderation, immoderate (in eating)' (a + mattaññū, from mattā 'measure' + -ññū 'knowing')",
        "gram": "ca: conj.; amattaññuṁ: cpd. adj., acc. sg. m. (-ū stem)",
        "ped": "PED s.v. ca; s.v. mattaññutā"
      }
    ],
    "translation": {
      "text": "immoderate in eating, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:4",
    "pali": "kusītaṁ hīnavīriyaṁ;",
    "words": [
      {
        "w": "kusītaṁ",
        "gloss": "lazy, slothful, indolent",
        "gram": "adj., acc. sg. m.",
        "ped": "PED s.v. kusīta"
      },
      {
        "w": "hīnavīriyaṁ;",
        "gloss": "= hīna + vīriya: 'of low energy, wanting in vigour' (hīna 'low, deficient' + vīriya 'energy, vigour')",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. hīna; s.v. viriya"
      }
    ],
    "translation": {
      "text": "lazy, lacking energy: ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:5",
    "pali": "Taṁ ve pasahati māro,",
    "words": [
      {
        "w": "Taṁ",
        "gloss": "him (that person)",
        "gram": "dem. pron., acc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ve",
        "gloss": "truly, indeed (affirmative particle)",
        "gram": "indecl. (affirm.)",
        "ped": "PED s.v. ve"
      },
      {
        "w": "pasahati",
        "gloss": "overpowers, overcomes, masters (pa + √sah 'to prevail')",
        "gram": "pres. 3 sg. of pasahati (pa + √sah)",
        "ped": "PED s.v. pasahati"
      },
      {
        "w": "māro,",
        "gloss": "Māra, the Tempter/Death, the personification of death and defilement",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. māra"
      }
    ],
    "translation": {
      "text": "Māra strikes them down ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:5, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp7:6",
    "pali": "vāto rukkhaṁva dubbalaṁ.",
    "words": [
      {
        "w": "vāto",
        "gloss": "the wind",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. vāta"
      },
      {
        "w": "rukkhaṁva",
        "gloss": "= rukkhaṁ + va (= iva 'like'): 'like a tree' (rukkha 'tree')",
        "gram": "rukkhaṁ: m., acc. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. rukkha; s.v. iva"
      },
      {
        "w": "dubbalaṁ.",
        "gloss": "weak, feeble (du(r) + bala 'strength' → 'of poor strength')",
        "gram": "adj., acc. sg. m. (agreeing with rukkhaṁ)",
        "ped": "PED s.v. dubbala"
      }
    ],
    "translation": {
      "text": "like the wind, a feeble tree. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp7:6, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:1",
    "pali": "Asubhānupassiṁ viharantaṁ,",
    "words": [
      {
        "w": "Asubhānupassiṁ",
        "gloss": "= asubha + anupassin: 'contemplating the unlovely/foul', dwelling seeing (the body etc. as) unattractive — the asubha meditation (a + subha 'not-beautiful' + anupassin)",
        "gram": "cpd. adj. (poss. -in stem), acc. sg. m.",
        "ped": "PED s.v. asubha; s.v. anupassin"
      },
      {
        "w": "viharantaṁ,",
        "gloss": "dwelling, abiding (pres. part. of viharati)",
        "gram": "ppr., acc. sg. m. (viharant)",
        "ped": "PED s.v. viharati"
      }
    ],
    "translation": {
      "text": "Those who contemplate the ugly, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:1, verbatim"
    },
    "notes": "Dhp 8 is the bright counterpart of Dhp 7; the Mahāsaṅgīti capitalizes several line-initial words here (Indriyesu, Saddaṁ, Taṁ, Vāto) — preserved exactly.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:2",
    "pali": "Indriyesu susaṁvutaṁ;",
    "words": [
      {
        "w": "Indriyesu",
        "gloss": "in/over the sense-faculties",
        "gram": "nt., loc. pl.",
        "ped": "PED s.v. indriya"
      },
      {
        "w": "susaṁvutaṁ;",
        "gloss": "= su + saṁvuta: 'well-restrained, well-controlled' (su 'well' + saṁvuta pp)",
        "gram": "cpd. pp., acc. sg. m.",
        "ped": "PED s.v. su; s.v. saṁvuta"
      }
    ],
    "translation": {
      "text": "their faculties well-restrained, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:3",
    "pali": "Bhojanamhi ca mattaññuṁ,",
    "words": [
      {
        "w": "Bhojanamhi",
        "gloss": "in/with regard to food, eating (loc. of bhojana)",
        "gram": "nt., loc. sg.",
        "ped": "PED s.v. bhojana"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "mattaññuṁ,",
        "gloss": "knowing moderation, moderate (in eating) — mattaññū 'one who knows the (right) measure' (mattā 'measure' + -ññū 'knowing')",
        "gram": "cpd. adj., acc. sg. m. (-ū stem)",
        "ped": "PED s.v. mattaññutā"
      }
    ],
    "translation": {
      "text": "eating in moderation, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:4",
    "pali": "Saddhaṁ āraddhavīriyaṁ;",
    "words": [
      {
        "w": "Saddhaṁ",
        "gloss": "faithful, endowed with faith/confidence (saddha, from saddhā 'faith')",
        "gram": "adj., acc. sg. m.",
        "ped": "PED s.v. saddha¹"
      },
      {
        "w": "āraddhavīriyaṁ;",
        "gloss": "= āraddha + vīriya: 'with energy aroused, energetic, resolute' (āraddha pp of ārabhati 'to begin, undertake' + vīriya 'energy')",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. āraddha; s.v. viriya"
      }
    ],
    "translation": {
      "text": "faithful and energetic: ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:5",
    "pali": "Taṁ ve nappasahati māro,",
    "words": [
      {
        "w": "Taṁ",
        "gloss": "him (that person)",
        "gram": "dem. pron., acc. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ve",
        "gloss": "truly, indeed (affirmative particle)",
        "gram": "indecl. (affirm.)",
        "ped": "PED s.v. ve"
      },
      {
        "w": "nappasahati",
        "gloss": "= na + pasahati (sandhi na + p → napp): 'does not overpower' (cf. Dhp 7:5)",
        "gram": "neg. + pres. 3 sg. of pasahati (pa + √sah)",
        "ped": "PED s.v. na¹; s.v. pasahati"
      },
      {
        "w": "māro,",
        "gloss": "Māra, Death-the-Tempter",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. māra"
      }
    ],
    "translation": {
      "text": "Māra cannot strike them down, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:5, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp8:6",
    "pali": "Vāto selaṁva pabbataṁ.",
    "words": [
      {
        "w": "Vāto",
        "gloss": "the wind",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. vāta"
      },
      {
        "w": "selaṁva",
        "gloss": "= selaṁ + va (= iva 'like'): 'like a rock / of stone' (sela 'rock, crag; rocky')",
        "gram": "selaṁ: adj./m., acc. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. sela; s.v. iva"
      },
      {
        "w": "pabbataṁ.",
        "gloss": "mountain (here 'a rocky mountain', sela qualifying pabbata)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. pabbata"
      }
    ],
    "translation": {
      "text": "like the wind, a rocky mountain. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp8:6, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp9:0",
    "pali": "Devadattavatthu",
    "words": [
      {
        "w": "Devadattavatthu",
        "gloss": "= Devadatta + vatthu: 'the story of Devadatta' (the Buddha's cousin and schismatic; a personal name, deva 'god' + datta 'given')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp9:1",
    "pali": "Anikkasāvo kāsāvaṁ,",
    "words": [
      {
        "w": "Anikkasāvo",
        "gloss": "not free of impurity/stain — one whose moral 'stain' (kasāva) has not been expelled (a + nikkasāva, 'not stainless'). A deliberate wordplay with kāsāva (the ochre robe) follows.",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. kasāva; s.v. nikkasāva"
      },
      {
        "w": "kāsāvaṁ,",
        "gloss": "the ochre/dull-yellow(-dyed) robe of a monk (kāsāva)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. kāsāva"
      }
    ],
    "translation": {
      "text": "One who, not free of stains themselves, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp9:1, verbatim"
    },
    "notes": "The verse turns on the near-homophones a-nikkasāva ('not free of stain') and kāsāva ('the stained/ochre robe'): one full of inner stain does not deserve the stain-coloured robe. Flagged as the text's own paronomasia.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp9:2",
    "pali": "yo vatthaṁ paridahissati;",
    "words": [
      {
        "w": "yo",
        "gloss": "who(ever)",
        "gram": "rel. pron., nom. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "vatthaṁ",
        "gloss": "cloth, garment, robe",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. vattha"
      },
      {
        "w": "paridahissati;",
        "gloss": "will put on, will wear (pari + √dhā 'to place around')",
        "gram": "fut. 3 sg. of paridahati (pari + √dhā)",
        "ped": "PED s.v. paridahati"
      }
    ],
    "translation": {
      "text": "would wear the robe stained in ocher, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp9:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp9:3",
    "pali": "Apeto damasaccena,",
    "words": [
      {
        "w": "Apeto",
        "gloss": "gone away from, devoid of, lacking (apa + ita, pp of apeti 'to go away'); with instr. = 'destitute of'",
        "gram": "pp. of apeti (apa + √i), nom. sg. m.",
        "ped": "PED s.v. apeta"
      },
      {
        "w": "damasaccena,",
        "gloss": "= dama + sacca: 'self-control and truth(fulness)' (dama 'taming, self-restraint' + sacca 'truth'); instr. with apeto = 'bereft of self-control and truth'",
        "gram": "dvandva cpd. nt., instr. sg.",
        "ped": "PED s.v. dama; s.v. sacca"
      }
    ],
    "translation": {
      "text": "bereft of self-control and of truth: ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp9:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp9:4",
    "pali": "na so kāsāvamarahati.",
    "words": [
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "so",
        "gloss": "he, that one",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (so)"
      },
      {
        "w": "kāsāvamarahati.",
        "gloss": "= kāsāvaṁ + arahati (sandhi -ṁ + a- → -m-a-): 'the ochre robe' + 'is worthy of, deserves' (arahati 'to be worthy', whence arahant)",
        "gram": "kāsāvaṁ: nt., acc. sg.; arahati: pres. 3 sg. of arahati (√arh)",
        "ped": "PED s.v. kāsāva; s.v. arahati"
      }
    ],
    "translation": {
      "text": "they are not worthy of the ocher robe. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp9:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp10:1",
    "pali": "Yo ca vantakasāvassa,",
    "words": [
      {
        "w": "Yo",
        "gloss": "who(ever)",
        "gram": "rel. pron., nom. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ca",
        "gloss": "and, but",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "vantakasāvassa,",
        "gloss": "= vanta + kasāva: 'for/of one who has vomited out (expelled) the stain' (vanta pp of vamati 'to eject, vomit' + kasāva 'stain, impurity'); gen. of the implied subject",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. vanta; s.v. kasāva"
      }
    ],
    "translation": {
      "text": "One who’s purged all their stains, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp10:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp10:2",
    "pali": "sīlesu susamāhito;",
    "words": [
      {
        "w": "sīlesu",
        "gloss": "in the precepts / in virtues, in moral conduct",
        "gram": "nt., loc. pl.",
        "ped": "PED s.v. sīla"
      },
      {
        "w": "susamāhito;",
        "gloss": "= su + samāhita: 'well-composed, well-concentrated, steady' (su 'well' + samāhita pp of samādahati 'to collect, concentrate the mind')",
        "gram": "cpd. pp., nom. sg. m.",
        "ped": "PED s.v. su; s.v. samāhita"
      }
    ],
    "translation": {
      "text": "steady in ethics, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp10:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp10:3",
    "pali": "Upeto damasaccena,",
    "words": [
      {
        "w": "Upeto",
        "gloss": "endowed with, possessed of (upa + ita, pp of upeti 'to come to be furnished with'); the opposite of apeto (9:3)",
        "gram": "pp. of upeti (upa + √i), nom. sg. m.",
        "ped": "PED s.v. upeta"
      },
      {
        "w": "damasaccena,",
        "gloss": "= dama + sacca: 'self-control and truth'; instr. with upeto = 'endowed with self-control and truth'",
        "gram": "dvandva cpd. nt., instr. sg.",
        "ped": "PED s.v. dama; s.v. sacca"
      }
    ],
    "translation": {
      "text": "possessed of self-control and of truth, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp10:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp10:4",
    "pali": "sa ve kāsāvamarahati.",
    "words": [
      {
        "w": "sa",
        "gloss": "he, that one (shortened form of so)",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (sa/so)"
      },
      {
        "w": "ve",
        "gloss": "truly, indeed",
        "gram": "indecl. (affirm.)",
        "ped": "PED s.v. ve"
      },
      {
        "w": "kāsāvamarahati.",
        "gloss": "= kāsāvaṁ + arahati (sandhi -ṁ + a- → -m-a-): 'the ochre robe' + 'is worthy of, deserves' (cf. 9:4)",
        "gram": "kāsāvaṁ: nt., acc. sg.; arahati: pres. 3 sg. (√arh)",
        "ped": "PED s.v. kāsāva; s.v. arahati"
      }
    ],
    "translation": {
      "text": "they are truly worthy of the ocher robe. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp10:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp11:0",
    "pali": "Sāriputtattheravatthu",
    "words": [
      {
        "w": "Sāriputtattheravatthu",
        "gloss": "= Sāriputta + thera + vatthu: 'the story of the Elder Sāriputta' (the Buddha's chief disciple; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp11:1",
    "pali": "Asāre sāramatino,",
    "words": [
      {
        "w": "Asāre",
        "gloss": "in the essenceless, in what has no pith/substance (a + sāra 'pith, core, essence')",
        "gram": "nt., loc. sg.",
        "ped": "PED s.v. sāra"
      },
      {
        "w": "sāramatino,",
        "gloss": "= sāra + matin: 'those who think (it) essential/pith', holding it to be the substance (sāra 'essence' + matin, poss. of mati 'opinion, notion')",
        "gram": "cpd. adj. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. sāra; s.v. mati (matin)"
      }
    ],
    "translation": {
      "text": "Thinking the inessential is essential, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp11:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp11:2",
    "pali": "sāre cāsāradassino;",
    "words": [
      {
        "w": "sāre",
        "gloss": "in the essential, in the pith/substance",
        "gram": "nt., loc. sg.",
        "ped": "PED s.v. sāra"
      },
      {
        "w": "cāsāradassino;",
        "gloss": "= ca + asāradassino (sandhi a + a → ā): 'and' + 'those who see (it as) unessential' (a + sāra + dassin 'seeing', from dassati/passati)",
        "gram": "ca: conj.; asāradassino: cpd. adj. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. ca; s.v. sāra; s.v. dassin"
      }
    ],
    "translation": {
      "text": "seeing the essential as inessential; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp11:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp11:3",
    "pali": "Te sāraṁ nādhigacchanti,",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those (ones)",
        "gram": "dem. pron., nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "sāraṁ",
        "gloss": "the essence, the pith, the substance",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. sāra"
      },
      {
        "w": "nādhigacchanti,",
        "gloss": "= na + adhigacchanti (sandhi a + a → ā): 'do not attain, do not reach/realize' (adhigacchati 'to attain', adhi + √gam)",
        "gram": "neg. + pres. 3 pl. of adhigacchati (adhi + √gam)",
        "ped": "PED s.v. na¹; s.v. adhigacchati"
      }
    ],
    "translation": {
      "text": "they don’t realize the essential, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp11:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp11:4",
    "pali": "micchāsaṅkappagocarā.",
    "words": [
      {
        "w": "micchāsaṅkappagocarā.",
        "gloss": "= micchāsaṅkappa + gocara: 'having wrong intention as their pasture (range)' (micchā 'wrong, false' + saṅkappa 'thought, intention, resolve' + gocara 'pasture, range, resort') — their mind grazes on wrong thoughts",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. micchā; s.v. saṅkappa; s.v. gocara"
      }
    ],
    "translation": {
      "text": "for wrong thoughts are their habitat. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp11:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp12:1",
    "pali": "Sārañca sārato ñatvā,",
    "words": [
      {
        "w": "Sārañca",
        "gloss": "= sāraṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and the essence' (sāra 'pith, essence')",
        "gram": "sāraṁ: nt., acc. sg.; ca: conj.",
        "ped": "PED s.v. sāra; s.v. ca"
      },
      {
        "w": "sārato",
        "gloss": "as essence, for what is pith (ablative-of-relation, predicative -to: 'as the essential')",
        "gram": "nt., abl. sg. (predicative -to)",
        "ped": "PED s.v. sāra"
      },
      {
        "w": "ñatvā,",
        "gloss": "having known, having understood (absolutive of jānāti 'to know', √ñā)",
        "gram": "ger. (absol.) of jānāti (√ñā)",
        "ped": "PED s.v. jānāti (ñatvā)"
      }
    ],
    "translation": {
      "text": "Having known the essential as essential, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp12:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp12:2",
    "pali": "asārañca asārato;",
    "words": [
      {
        "w": "asārañca",
        "gloss": "= asāraṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and the unessential' (a + sāra)",
        "gram": "asāraṁ: nt., acc. sg.; ca: conj.",
        "ped": "PED s.v. sāra; s.v. ca"
      },
      {
        "w": "asārato;",
        "gloss": "as unessential, for what is not pith (predicative -to)",
        "gram": "nt., abl. sg. (predicative -to)",
        "ped": "PED s.v. sāra"
      }
    ],
    "translation": {
      "text": "and the inessential as inessential; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp12:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp12:3",
    "pali": "Te sāraṁ adhigacchanti,",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those (ones)",
        "gram": "dem. pron., nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "sāraṁ",
        "gloss": "the essence, the pith",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. sāra"
      },
      {
        "w": "adhigacchanti,",
        "gloss": "they attain, reach, realize (adhi + √gam)",
        "gram": "pres. 3 pl. of adhigacchati (adhi + √gam)",
        "ped": "PED s.v. adhigacchati"
      }
    ],
    "translation": {
      "text": "they realize the essential, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp12:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp12:4",
    "pali": "sammāsaṅkappagocarā.",
    "words": [
      {
        "w": "sammāsaṅkappagocarā.",
        "gloss": "= sammāsaṅkappa + gocara: 'having right intention as their pasture' (sammā 'right, proper' + saṅkappa 'thought, intention' + gocara 'range, resort') — cf. sammā-saṅkappa, the second factor of the noble eightfold path",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. sammā; s.v. saṅkappa; s.v. gocara"
      }
    ],
    "translation": {
      "text": "for right thoughts are their habitat. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp12:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp13:0",
    "pali": "Nandattheravatthu",
    "words": [
      {
        "w": "Nandattheravatthu",
        "gloss": "= Nanda + thera + vatthu: 'the story of the Elder Nanda' (the Buddha's half-brother; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp13:1",
    "pali": "Yathā agāraṁ ducchannaṁ,",
    "words": [
      {
        "w": "Yathā",
        "gloss": "just as (opening the simile)",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      },
      {
        "w": "agāraṁ",
        "gloss": "a house, dwelling",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. agāra"
      },
      {
        "w": "ducchannaṁ,",
        "gloss": "= du(r) + channa: 'badly thatched, poorly roofed' (du(r)- 'ill, badly' + channa pp of chādeti 'to cover, thatch')",
        "gram": "cpd. pp., acc. sg. nt.",
        "ped": "PED s.v. du; s.v. channa¹"
      }
    ],
    "translation": {
      "text": "Just as rain seeps into ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp13:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp13:2",
    "pali": "vuṭṭhī samativijjhati;",
    "words": [
      {
        "w": "vuṭṭhī",
        "gloss": "rain (vuṭṭhi 'rain, downpour'); final lengthened metri causa",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. vuṭṭhi"
      },
      {
        "w": "samativijjhati;",
        "gloss": "penetrates through, pierces right through (saṁ + ati + √vidh 'to pierce'); of rain leaking through a roof",
        "gram": "pres. 3 sg. of samativijjhati (saṁ + ati + √vidh)",
        "ped": "PED s.v. samativijjhati"
      }
    ],
    "translation": {
      "text": "a poorly roofed house, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp13:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp13:3",
    "pali": "Evaṁ abhāvitaṁ cittaṁ,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "even so, so too (the correlative answering yathā)",
        "gram": "indecl. adv.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "abhāvitaṁ",
        "gloss": "undeveloped, uncultivated (a + bhāvita, pp of bhāveti 'to develop, cultivate')",
        "gram": "neg. pp., acc. sg. nt.",
        "ped": "PED s.v. bhāvita (a°)"
      },
      {
        "w": "cittaṁ,",
        "gloss": "mind, heart, thought (citta, the affective-cognitive 'mind')",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "lust seeps into ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp13:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp13:4",
    "pali": "rāgo samativijjhati.",
    "words": [
      {
        "w": "rāgo",
        "gloss": "passion, lust, greed (rāga)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. rāga"
      },
      {
        "w": "samativijjhati.",
        "gloss": "penetrates through, pierces (saṁ + ati + √vidh)",
        "gram": "pres. 3 sg. of samativijjhati",
        "ped": "PED s.v. samativijjhati"
      }
    ],
    "translation": {
      "text": "an undeveloped mind. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp13:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp14:1",
    "pali": "Yathā agāraṁ suchannaṁ,",
    "words": [
      {
        "w": "Yathā",
        "gloss": "just as (opening the simile)",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      },
      {
        "w": "agāraṁ",
        "gloss": "a house, dwelling",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. agāra"
      },
      {
        "w": "suchannaṁ,",
        "gloss": "= su + channa: 'well-thatched, well-roofed' (su 'well' + channa pp of chādeti)",
        "gram": "cpd. pp., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. channa¹"
      }
    ],
    "translation": {
      "text": "Just as rain doesn’t seep into ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp14:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp14:2",
    "pali": "vuṭṭhī na samativijjhati;",
    "words": [
      {
        "w": "vuṭṭhī",
        "gloss": "rain; final lengthened metri causa",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. vuṭṭhi"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "samativijjhati;",
        "gloss": "does not penetrate through (with na)",
        "gram": "pres. 3 sg. of samativijjhati",
        "ped": "PED s.v. samativijjhati"
      }
    ],
    "translation": {
      "text": "a well roofed house, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp14:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp14:3",
    "pali": "Evaṁ subhāvitaṁ cittaṁ,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "even so, so too",
        "gram": "indecl. adv.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "subhāvitaṁ",
        "gloss": "= su + bhāvita: 'well-developed, well-cultivated' (su + bhāvita pp of bhāveti)",
        "gram": "cpd. pp., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. bhāveti (bhāvita)"
      },
      {
        "w": "cittaṁ,",
        "gloss": "mind, heart",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "lust doesn’t seep into ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp14:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp14:4",
    "pali": "rāgo na samativijjhati.",
    "words": [
      {
        "w": "rāgo",
        "gloss": "passion, lust, greed",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. rāga"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "samativijjhati.",
        "gloss": "does not penetrate through (with na)",
        "gram": "pres. 3 sg. of samativijjhati",
        "ped": "PED s.v. samativijjhati"
      }
    ],
    "translation": {
      "text": "a well developed mind. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp14:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp15:0",
    "pali": "Cundasūkarikavatthu",
    "words": [
      {
        "w": "Cundasūkarikavatthu",
        "gloss": "= Cunda + sūkarika + vatthu: 'the story of Cunda the pork-butcher' (Cunda, a name; sūkarika 'pig-killer, pork-dealer', from sūkara 'pig')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. sūkara; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp15:1",
    "pali": "Idha socati pecca socati,",
    "words": [
      {
        "w": "Idha",
        "gloss": "here, in this world / in this life",
        "gram": "indecl. adv.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "socati",
        "gloss": "grieves, sorrows, mourns (√śuc)",
        "gram": "pres. 3 sg. of socati (√śuc)",
        "ped": "PED s.v. socati"
      },
      {
        "w": "pecca",
        "gloss": "having departed (after death), in the hereafter (absolutive of pa + eti 'to pass on')",
        "gram": "ger. (absol.) of peti (pa + √i)",
        "ped": "PED s.v. pecca"
      },
      {
        "w": "socati,",
        "gloss": "grieves, sorrows",
        "gram": "pres. 3 sg. of socati (√śuc)",
        "ped": "PED s.v. socati"
      }
    ],
    "translation": {
      "text": "Here they grieve, hereafter they grieve, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp15:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp15:2",
    "pali": "Pāpakārī ubhayattha socati;",
    "words": [
      {
        "w": "Pāpakārī",
        "gloss": "= pāpa + kārin: 'an evildoer, doer of evil' (pāpa 'evil, bad' + kārin 'doer', from karoti)",
        "gram": "cpd. subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. pāpa; s.v. kārin"
      },
      {
        "w": "ubhayattha",
        "gloss": "in both places / in both cases (ubhaya 'both' + -ttha 'in … place'): here and hereafter",
        "gram": "indecl. adv.",
        "ped": "PED s.v. ubhaya"
      },
      {
        "w": "socati;",
        "gloss": "grieves",
        "gram": "pres. 3 sg. of socati (√śuc)",
        "ped": "PED s.v. socati"
      }
    ],
    "translation": {
      "text": "an evildoer grieves in both places. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp15:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp15:3",
    "pali": "So socati so vihaññati,",
    "words": [
      {
        "w": "So",
        "gloss": "he, that one",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (so)"
      },
      {
        "w": "socati",
        "gloss": "grieves",
        "gram": "pres. 3 sg. of socati (√śuc)",
        "ped": "PED s.v. socati"
      },
      {
        "w": "so",
        "gloss": "he, that one",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (so)"
      },
      {
        "w": "vihaññati,",
        "gloss": "is troubled, is vexed, is distressed (passive of vihanati 'to strike, harass', vi + √han)",
        "gram": "pres. pass. 3 sg. of vihanati (vi + √han)",
        "ped": "PED s.v. vihaññati"
      }
    ],
    "translation": {
      "text": "They grieve and fret, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp15:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp15:4",
    "pali": "Disvā kammakiliṭṭhamattano.",
    "words": [
      {
        "w": "Disvā",
        "gloss": "having seen (absolutive of passati/dakkhati 'to see', √dis)",
        "gram": "ger. (absol.) of passati (√dis)",
        "ped": "PED s.v. passati (disvā)"
      },
      {
        "w": "kammakiliṭṭhamattano.",
        "gloss": "= kammakiliṭṭhaṁ + attano (sandhi -ṁ + a- → -m-a-): 'his own defiled deed(s)' — kammakiliṭṭha = kamma 'action, deed' + kiliṭṭha 'defiled, soiled' (pp of kilissati); attano 'of oneself, one's own'",
        "gram": "kammakiliṭṭhaṁ: kammadhāraya cpd., acc. sg. nt.; attano: gen./refl. sg. (attan)",
        "ped": "PED s.v. kamma; s.v. kiliṭṭha; s.v. attan"
      }
    ],
    "translation": {
      "text": "seeing their own corrupt deeds. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp15:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp16:0",
    "pali": "Dhammikaupāsakavatthu",
    "words": [
      {
        "w": "Dhammikaupāsakavatthu",
        "gloss": "= Dhammika + upāsaka + vatthu: 'the story of the lay-follower Dhammika' (Dhammika, a name, 'righteous'; upāsaka 'lay devotee, layman')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. upāsaka; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp16:1",
    "pali": "Idha modati pecca modati,",
    "words": [
      {
        "w": "Idha",
        "gloss": "here, in this world",
        "gram": "indecl. adv.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "modati",
        "gloss": "rejoices, is glad (√mud)",
        "gram": "pres. 3 sg. of modati (√mud)",
        "ped": "PED s.v. modati"
      },
      {
        "w": "pecca",
        "gloss": "having departed (after death), in the hereafter",
        "gram": "ger. (absol.) of peti (pa + √i)",
        "ped": "PED s.v. pecca"
      },
      {
        "w": "modati,",
        "gloss": "rejoices",
        "gram": "pres. 3 sg. of modati (√mud)",
        "ped": "PED s.v. modati"
      }
    ],
    "translation": {
      "text": "Here they rejoice, hereafter they rejoice, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp16:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp16:2",
    "pali": "Katapuñño ubhayattha modati;",
    "words": [
      {
        "w": "Katapuñño",
        "gloss": "= kata + puñña: 'one who has done good/merit, a doer of merit' (kata pp of karoti 'done' + puñña 'merit, good deed')",
        "gram": "bahubbīhi cpd., nom. sg. m.",
        "ped": "PED s.v. kata; s.v. puñña"
      },
      {
        "w": "ubhayattha",
        "gloss": "in both places (here and hereafter)",
        "gram": "indecl. adv.",
        "ped": "PED s.v. ubhaya"
      },
      {
        "w": "modati;",
        "gloss": "rejoices",
        "gram": "pres. 3 sg. of modati (√mud)",
        "ped": "PED s.v. modati"
      }
    ],
    "translation": {
      "text": "one who does good rejoices in both places. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp16:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp16:3",
    "pali": "So modati so pamodati,",
    "words": [
      {
        "w": "So",
        "gloss": "he, that one",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (so)"
      },
      {
        "w": "modati",
        "gloss": "rejoices",
        "gram": "pres. 3 sg. of modati (√mud)",
        "ped": "PED s.v. modati"
      },
      {
        "w": "so",
        "gloss": "he, that one",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (so)"
      },
      {
        "w": "pamodati,",
        "gloss": "greatly rejoices, is delighted (intensive pa + modati)",
        "gram": "pres. 3 sg. of pamodati (pa + √mud)",
        "ped": "PED s.v. pamodati"
      }
    ],
    "translation": {
      "text": "They rejoice and celebrate, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp16:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp16:4",
    "pali": "Disvā kammavisuddhimattano.",
    "words": [
      {
        "w": "Disvā",
        "gloss": "having seen (absolutive of passati)",
        "gram": "ger. (absol.) of passati (√dis)",
        "ped": "PED s.v. passati (disvā)"
      },
      {
        "w": "kammavisuddhimattano.",
        "gloss": "= kammavisuddhiṁ + attano (sandhi -ṁ + a- → -m-a-): 'the purity of his own deeds' — kammavisuddhi = kamma 'deed' + visuddhi 'purity, cleansing'; attano 'one's own'",
        "gram": "kammavisuddhiṁ: tappurisa cpd., acc. sg. f.; attano: gen./refl. sg. (attan)",
        "ped": "PED s.v. kamma; s.v. visuddhi; s.v. attan"
      }
    ],
    "translation": {
      "text": "seeing their own pure deeds. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp16:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp17:0",
    "pali": "Devadattavatthu",
    "words": [
      {
        "w": "Devadattavatthu",
        "gloss": "= Devadatta + vatthu: 'the story of Devadatta' (the schismatic; recurs from Dhp 9)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp17:1",
    "pali": "Idha tappati pecca tappati,",
    "words": [
      {
        "w": "Idha",
        "gloss": "here, in this world",
        "gram": "indecl. adv.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "tappati",
        "gloss": "is tormented, is scorched, burns (with remorse) (√tap 'to burn'); passive-medial sense",
        "gram": "pres. 3 sg. of tappati (√tap)",
        "ped": "PED s.v. tappati¹"
      },
      {
        "w": "pecca",
        "gloss": "having departed (after death), in the hereafter",
        "gram": "ger. (absol.) of peti (pa + √i)",
        "ped": "PED s.v. pecca"
      },
      {
        "w": "tappati,",
        "gloss": "is tormented",
        "gram": "pres. 3 sg. of tappati (√tap)",
        "ped": "PED s.v. tappati¹"
      }
    ],
    "translation": {
      "text": "Here they’re tormented, <j>hereafter they’re tormented, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp17:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp17:2",
    "pali": "Pāpakārī ubhayattha tappati;",
    "words": [
      {
        "w": "Pāpakārī",
        "gloss": "= pāpa + kārin: 'an evildoer' (pāpa 'evil' + kārin 'doer')",
        "gram": "cpd. subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. pāpa; s.v. kārin"
      },
      {
        "w": "ubhayattha",
        "gloss": "in both places (here and hereafter)",
        "gram": "indecl. adv.",
        "ped": "PED s.v. ubhaya"
      },
      {
        "w": "tappati;",
        "gloss": "is tormented",
        "gram": "pres. 3 sg. of tappati (√tap)",
        "ped": "PED s.v. tappati¹"
      }
    ],
    "translation": {
      "text": "an evildoer is tormented in both places. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp17:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp17:3",
    "pali": "“Pāpaṁ me katan”ti tappati,",
    "words": [
      {
        "w": "“Pāpaṁ",
        "gloss": "'evil, a bad deed' — with the opening quotation mark of the reported thought (pāpa 'evil, wrong'). The quote mark belongs to the Bilara segment punctuation.",
        "gram": "nt., nom./acc. sg.",
        "ped": "PED s.v. pāpa"
      },
      {
        "w": "me",
        "gloss": "by me (agent) / mine",
        "gram": "pers. pron., instr./gen. sg.",
        "ped": "PED s.v. ahaṁ (me)"
      },
      {
        "w": "katan”ti",
        "gloss": "= kataṁ + ti (sandhi -ṁ + t- → -n-t-; with the closing quote mark): 'has been done' + the quotative particle iti/ti marking the end of the thought 'Evil has been done by me' (kata pp of karoti)",
        "gram": "kataṁ: pp., nom./acc. sg. nt.; ti: quot. particle (iti)",
        "ped": "PED s.v. kata; s.v. iti"
      },
      {
        "w": "tappati,",
        "gloss": "is tormented",
        "gram": "pres. 3 sg. of tappati (√tap)",
        "ped": "PED s.v. tappati¹"
      }
    ],
    "translation": {
      "text": "They’re tormented <j>thinking of bad things they’ve done; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp17:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp17:4",
    "pali": "Bhiyyo tappati duggatiṁ gato.",
    "words": [
      {
        "w": "Bhiyyo",
        "gloss": "more, still more, all the more (comparative adv.)",
        "gram": "indecl. (compar. adv.)",
        "ped": "PED s.v. bhiyyo"
      },
      {
        "w": "tappati",
        "gloss": "is tormented",
        "gram": "pres. 3 sg. of tappati (√tap)",
        "ped": "PED s.v. tappati¹"
      },
      {
        "w": "duggatiṁ",
        "gloss": "to a bad destination, an evil rebirth-realm (du(g) 'bad' + gati 'going, destiny, realm of rebirth')",
        "gram": "cpd. f., acc. sg. (motion)",
        "ped": "PED s.v. duggati"
      },
      {
        "w": "gato.",
        "gloss": "gone (to), having gone (pp of gacchati 'to go')",
        "gram": "pp. of gacchati (√gam), nom. sg. m.",
        "ped": "PED s.v. gata"
      }
    ],
    "translation": {
      "text": "when gone to a bad place, <j>they’re tormented all the more. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp17:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp18:0",
    "pali": "Sumanadevīvatthu",
    "words": [
      {
        "w": "Sumanadevīvatthu",
        "gloss": "= Sumanā + devī + vatthu: 'the story of (the lady) Sumanādevī' (sumana 'good-minded, glad' + devī 'lady, goddess'; Anāthapiṇḍika's daughter)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. devī; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp18:1",
    "pali": "Idha nandati pecca nandati,",
    "words": [
      {
        "w": "Idha",
        "gloss": "here, in this world",
        "gram": "indecl. adv.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "nandati",
        "gloss": "rejoices, is glad, delights (√nand)",
        "gram": "pres. 3 sg. of nandati (√nand)",
        "ped": "PED s.v. nandati"
      },
      {
        "w": "pecca",
        "gloss": "having departed (after death), in the hereafter",
        "gram": "ger. (absol.) of peti (pa + √i)",
        "ped": "PED s.v. pecca"
      },
      {
        "w": "nandati,",
        "gloss": "delights, rejoices",
        "gram": "pres. 3 sg. of nandati (√nand)",
        "ped": "PED s.v. nandati"
      }
    ],
    "translation": {
      "text": "Here they delight, hereafter they delight, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp18:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp18:2",
    "pali": "Katapuñño ubhayattha nandati;",
    "words": [
      {
        "w": "Katapuñño",
        "gloss": "= kata + puñña: 'a doer of merit' (kata pp + puñña 'merit')",
        "gram": "bahubbīhi cpd., nom. sg. m.",
        "ped": "PED s.v. kata; s.v. puñña"
      },
      {
        "w": "ubhayattha",
        "gloss": "in both places (here and hereafter)",
        "gram": "indecl. adv.",
        "ped": "PED s.v. ubhaya"
      },
      {
        "w": "nandati;",
        "gloss": "delights",
        "gram": "pres. 3 sg. of nandati (√nand)",
        "ped": "PED s.v. nandati"
      }
    ],
    "translation": {
      "text": "one who does good delights in both places. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp18:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp18:3",
    "pali": "“Puññaṁ me katan”ti nandati,",
    "words": [
      {
        "w": "“Puññaṁ",
        "gloss": "'merit, a good deed' — with the opening quotation mark (puñña 'merit, meritorious act')",
        "gram": "nt., nom./acc. sg.",
        "ped": "PED s.v. puñña"
      },
      {
        "w": "me",
        "gloss": "by me (agent) / mine",
        "gram": "pers. pron., instr./gen. sg.",
        "ped": "PED s.v. ahaṁ (me)"
      },
      {
        "w": "katan”ti",
        "gloss": "= kataṁ + ti (sandhi -ṁ + t- → -n-t-; with the closing quote): 'has been done' + the quotative ti — 'Merit has been done by me' (kata pp of karoti)",
        "gram": "kataṁ: pp., nom./acc. sg. nt.; ti: quot. particle (iti)",
        "ped": "PED s.v. kata; s.v. iti"
      },
      {
        "w": "nandati,",
        "gloss": "delights",
        "gram": "pres. 3 sg. of nandati (√nand)",
        "ped": "PED s.v. nandati"
      }
    ],
    "translation": {
      "text": "They delight thinking of good things they’ve done; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp18:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp18:4",
    "pali": "Bhiyyo nandati suggatiṁ gato.",
    "words": [
      {
        "w": "Bhiyyo",
        "gloss": "more, still more, all the more",
        "gram": "indecl. (compar. adv.)",
        "ped": "PED s.v. bhiyyo"
      },
      {
        "w": "nandati",
        "gloss": "delights",
        "gram": "pres. 3 sg. of nandati (√nand)",
        "ped": "PED s.v. nandati"
      },
      {
        "w": "suggatiṁ",
        "gloss": "to a good destination, a happy rebirth-realm (su(g) 'good' + gati 'destiny, realm')",
        "gram": "cpd. f., acc. sg. (motion)",
        "ped": "PED s.v. sugati"
      },
      {
        "w": "gato.",
        "gloss": "gone (to), having gone (pp of gacchati)",
        "gram": "pp. of gacchati (√gam), nom. sg. m.",
        "ped": "PED s.v. gata"
      }
    ],
    "translation": {
      "text": "when gone to a good place, they delight all the more. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp18:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp19:0",
    "pali": "Dvesahāyakabhikkhuvatthu",
    "words": [
      {
        "w": "Dvesahāyakabhikkhuvatthu",
        "gloss": "= dve + sahāyaka + bhikkhu + vatthu: 'the story of the two companion monks' (dve 'two' + sahāyaka 'companion, friend' + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. dve; s.v. sahāya; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp19:1",
    "pali": "Bahumpi ce saṁhita bhāsamāno,",
    "words": [
      {
        "w": "Bahumpi",
        "gloss": "= bahuṁ + pi (sandhi -ṁ + p- → -m-p-): 'much even', though much (bahu 'much, many' + pi 'even, also')",
        "gram": "bahuṁ: adj./adv., acc. sg.; pi: encl. particle",
        "ped": "PED s.v. bahu; s.v. api (pi)"
      },
      {
        "w": "ce",
        "gloss": "if, though",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "saṁhita",
        "gloss": "the (collected) texts, scripture — saṁhitā 'that which is put together, a text/collection' (here acc. sg. saṁhita, shortened metri causa). Sujato: 'scripture'. CONTESTED (see note).",
        "gram": "f., acc. sg. (saṁhitā, shortened)",
        "ped": "PED s.v. saṁhita"
      },
      {
        "w": "bhāsamāno,",
        "gloss": "reciting, speaking (present middle participle of bhāsati 'to speak, recite')",
        "gram": "ppr. med. of bhāsati (√bhās), nom. sg. m.",
        "ped": "PED s.v. bhāsati¹"
      }
    ],
    "translation": {
      "text": "Much though they may recite scripture, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp19:1, verbatim"
    },
    "notes": "saṁhita(ṁ) is read two ways: (a) as a noun 'scripture, the collected texts' — object of 'reciting' (Sujato: 'recite scripture'); (b) as pp of sandahati, 'connected, salutary, beneficial' — 'though he recite much beneficial/well-connected speech'. PED registers both a noun saṁhitā and the sense 'furnished with, beneficial'. Both reported; unresolved.",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp19:2",
    "pali": "Na takkaro hoti naro pamatto;",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "takkaro",
        "gloss": "= taṁ + kara: 'a doer of that, one who acts accordingly' (ta 'that' + kara 'doing, doer'); one who practises what he recites",
        "gram": "cpd. adj./subst., nom. sg. m.",
        "ped": "PED s.v. ta; s.v. kara"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "naro",
        "gloss": "a man, person",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. nara"
      },
      {
        "w": "pamatto;",
        "gloss": "negligent, heedless, careless (pp of pamajjati 'to be negligent', pa + √mad); the key antonym of appamatta in the next vagga",
        "gram": "pp., nom. sg. m.",
        "ped": "PED s.v. pamatta"
      }
    ],
    "translation": {
      "text": "if a negligent person does not apply them, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp19:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp19:3",
    "pali": "Gopova gāvo gaṇayaṁ paresaṁ,",
    "words": [
      {
        "w": "Gopova",
        "gloss": "= gopo + va (= iva 'like'): 'like a cowherd' (gopa 'cowherd, herdsman')",
        "gram": "gopo: m., nom. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. gopa; s.v. iva"
      },
      {
        "w": "gāvo",
        "gloss": "cattle, cows (acc. pl. of go 'cow, ox')",
        "gram": "m./f., acc. pl. (go)",
        "ped": "PED s.v. go (gāvo)"
      },
      {
        "w": "gaṇayaṁ",
        "gloss": "counting, numbering (present participle of gaṇeti 'to count')",
        "gram": "ppr. of gaṇeti, nom. sg. m.",
        "ped": "PED s.v. gaṇeti"
      },
      {
        "w": "paresaṁ,",
        "gloss": "of others, belonging to others (gen. pl. of para)",
        "gram": "pron. adj., gen. pl. m.",
        "ped": "PED s.v. para"
      }
    ],
    "translation": {
      "text": "then, like a cowherd who counts the cattle of others, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp19:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp19:4",
    "pali": "Na bhāgavā sāmaññassa hoti.",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "bhāgavā",
        "gloss": "one who has a share, a partaker, sharer (bhāga 'share, portion' + -vant possessive)",
        "gram": "adj. (poss. -vant stem), nom. sg. m.",
        "ped": "PED s.v. bhāga (bhāgavant)"
      },
      {
        "w": "sāmaññassa",
        "gloss": "of the ascetic life, of recluseship (sāmañña 'the state of a samaṇa, monkhood; the ascetic life'). A pun on sāmañña 'commonness' is available but the sense is 'recluseship'.",
        "gram": "nt., gen. sg.",
        "ped": "PED s.v. sāmañña²"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      }
    ],
    "translation": {
      "text": "they miss out on the blessings of the ascetic life. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp19:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:1",
    "pali": "Appampi ce saṁhita bhāsamāno,",
    "words": [
      {
        "w": "Appampi",
        "gloss": "= appaṁ + pi (sandhi -ṁ + p- → -m-p-): 'little even', though little (appa 'little, few' + pi 'even')",
        "gram": "appaṁ: adj./adv., acc. sg.; pi: encl. particle",
        "ped": "PED s.v. appa; s.v. api (pi)"
      },
      {
        "w": "ce",
        "gloss": "if, though",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "saṁhita",
        "gloss": "scripture, the collected texts (see Dhp 19:1 for the both-ways note)",
        "gram": "f., acc. sg. (saṁhitā, shortened)",
        "ped": "PED s.v. saṁhita"
      },
      {
        "w": "bhāsamāno,",
        "gloss": "reciting, speaking (pres. med. part. of bhāsati)",
        "gram": "ppr. med. of bhāsati (√bhās), nom. sg. m.",
        "ped": "PED s.v. bhāsati¹"
      }
    ],
    "translation": {
      "text": "Little though they may recite scripture, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:1, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:2",
    "pali": "Dhammassa hoti anudhammacārī;",
    "words": [
      {
        "w": "Dhammassa",
        "gloss": "of the Dhamma, of the teaching",
        "gram": "m., gen. sg.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "anudhammacārī;",
        "gloss": "= anudhamma + cārin: 'one who practises in accordance with the Dhamma' (anudhamma 'conformity with the dhamma' + cārin 'practising, living', from carati); dhammassa … anudhammacārī = 'living in line with the teaching'",
        "gram": "cpd. adj. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. anudhamma; s.v. cārin"
      }
    ],
    "translation": {
      "text": "if they live in line with the teaching, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:2, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:3",
    "pali": "Rāgañca dosañca pahāya mohaṁ,",
    "words": [
      {
        "w": "Rāgañca",
        "gloss": "= rāgaṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and greed/passion' (rāga)",
        "gram": "rāgaṁ: m., acc. sg.; ca: conj.",
        "ped": "PED s.v. rāga; s.v. ca"
      },
      {
        "w": "dosañca",
        "gloss": "= dosaṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and hate/aversion' (dosa 'anger, hatred, ill-will')",
        "gram": "dosaṁ: m., acc. sg.; ca: conj.",
        "ped": "PED s.v. dosa; s.v. ca"
      },
      {
        "w": "pahāya",
        "gloss": "having abandoned, having given up (absolutive of pajahati 'to give up', pa + √hā)",
        "gram": "ger. (absol.) of pajahati (pa + √hā)",
        "ped": "PED s.v. pajahati (pahāya)"
      },
      {
        "w": "mohaṁ,",
        "gloss": "delusion, confusion, bewilderment (moha) — the third of the three roots (rāga, dosa, moha)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. moha"
      }
    ],
    "translation": {
      "text": "having given up greed, hate, and delusion, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:3, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:4",
    "pali": "Sammappajāno suvimuttacitto;",
    "words": [
      {
        "w": "Sammappajāno",
        "gloss": "= sammā + pajāna: 'rightly understanding, of correct comprehension' (sammā 'rightly' + pajāna 'knowing', from pajānāti); the -pp- is metrical doubling in sandhi",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. sammā; s.v. pajānāti"
      },
      {
        "w": "suvimuttacitto;",
        "gloss": "= su + vimutta + citta: 'with mind well liberated' (su 'well' + vimutta pp of vimuccati 'freed' + citta 'mind')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. su; s.v. vimutta; s.v. citta²"
      }
    ],
    "translation": {
      "text": "with deep understanding and heart well freed, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:4, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:5",
    "pali": "Anupādiyāno idha vā huraṁ vā,",
    "words": [
      {
        "w": "Anupādiyāno",
        "gloss": "not grasping, not clinging (an + upādiyāna, pres. med. part. of upādiyati 'to grasp, cling', upa + ā + √dā)",
        "gram": "neg. + ppr. med. of upādiyati, nom. sg. m.",
        "ped": "PED s.v. upādiyati"
      },
      {
        "w": "idha",
        "gloss": "here (in this world / this life)",
        "gram": "indecl. adv.",
        "ped": "PED s.v. idha"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "huraṁ",
        "gloss": "yonder, in the other world, in the next life (huraṁ 'in the beyond')",
        "gram": "indecl. adv.",
        "ped": "PED s.v. huraṁ"
      },
      {
        "w": "vā,",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      }
    ],
    "translation": {
      "text": "not grasping to this life or the next, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:5, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:6",
    "pali": "Sa bhāgavā sāmaññassa hoti.",
    "words": [
      {
        "w": "Sa",
        "gloss": "he, that one (short form of so)",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta (sa/so)"
      },
      {
        "w": "bhāgavā",
        "gloss": "one who has a share, a partaker (bhāga + -vant)",
        "gram": "adj. (poss. -vant stem), nom. sg. m.",
        "ped": "PED s.v. bhāga (bhāgavant)"
      },
      {
        "w": "sāmaññassa",
        "gloss": "of the ascetic life, of recluseship (sāmañña)",
        "gram": "nt., gen. sg.",
        "ped": "PED s.v. sāmañña²"
      },
      {
        "w": "hoti.",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      }
    ],
    "translation": {
      "text": "they share in the blessings of the ascetic life. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp20:6, verbatim"
    },
    "notes": null,
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp20:7",
    "pali": "Yamakavaggo paṭhamo.",
    "words": [
      {
        "w": "Yamakavaggo",
        "gloss": "= yamaka + vagga: the Chapter of Pairs (the vagga's name as inflected noun)",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. yamaka; s.v. vagga"
      },
      {
        "w": "paṭhamo.",
        "gloss": "first — 'the Pairs, the first (chapter)'",
        "gram": "ordinal adj., nom. sg. m.",
        "ped": "PED s.v. paṭhama"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Chapter of Pairs, the first'). Sujato's Bilara translation has no segment for the colophon, so translation is null (fidelity, not omission).",
    "section": "1. Pairs · Yamakavagga (Dhp 1–20)"
  },
  {
    "ref": "dhp21:0.1",
    "pali": "Khuddakanikāya",
    "words": [
      {
        "w": "Khuddakanikāya",
        "gloss": "= khuddaka + nikāya: the 'Minor Collection', the fifth nikāya of the Sutta Piṭaka",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. khuddaka; s.v. nikāya"
      }
    ],
    "translation": {
      "text": "Minor Collection ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:0.1, verbatim"
    },
    "notes": "Header segment.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:0.2",
    "pali": "Dhammapada",
    "words": [
      {
        "w": "Dhammapada",
        "gloss": "= dhamma + pada: the Dhammapada (see the title note at dhp1:0.2)",
        "gram": "cpd., nom. sg. nt. (title)",
        "ped": "PED s.v. dhamma; s.v. pada"
      }
    ],
    "translation": {
      "text": "Sayings of the Dhamma 21–32 ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:0.2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:0.3",
    "pali": "Appamādavagga",
    "words": [
      {
        "w": "Appamādavagga",
        "gloss": "= appamāda + vagga: the 'Chapter on Heedfulness/Diligence' (appamāda 'heedfulness, diligence' + vagga 'chapter')",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. appamāda; s.v. vagga"
      }
    ],
    "translation": {
      "text": "2. Diligence ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:0.3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:0.4",
    "pali": "Sāmāvatīvatthu",
    "words": [
      {
        "w": "Sāmāvatīvatthu",
        "gloss": "= Sāmāvatī + vatthu: 'the story of (Queen) Sāmāvatī' (a queen of Udena, killed in the fire the verse's frame recounts)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Commentarial story-title; no Sujato segment, so translation is null.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:1",
    "pali": "Appamādo amatapadaṁ,",
    "words": [
      {
        "w": "Appamādo",
        "gloss": "heedfulness, diligence, vigilance, moral carefulness — the opposite of pamāda 'negligence, heedless intoxication' (a + pamāda; pamāda from pa + √mad 'to be heedless/intoxicated'). The Buddha's last theme (appamādena sampādetha) and this vagga's keyword.",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. appamāda"
      },
      {
        "w": "amatapadaṁ,",
        "gloss": "= amata + pada: 'the deathless state / the path to the deathless' — amata (a + mata 'not-dead', the 'deathless', a standard epithet of nibbāna; also literally 'the ambrosia, nectar of immortality', Skt amṛta) + pada ('state, place, footing' OR 'path, way'). CONTESTED both ways (see note).",
        "gram": "tappurisa/kammadhāraya cpd., nom. sg. nt.",
        "ped": "PED s.v. amata; s.v. pada"
      }
    ],
    "translation": {
      "text": "Heedfulness is the state free of death; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:1, verbatim"
    },
    "notes": "The vagga's programmatic opening, contested both ways on two linked cruxes. (1) amata: literally 'un-dying, the deathless' (a + mata, pp of marati) — used throughout the canon as an epithet of nibbāna, 'the deathless (state)'; but the same word is also the noun amata = Skt amṛta, the 'ambrosia' or 'nectar of immortality' of older Indian myth (the deathless drink). Most take the abstract 'deathless' (Sujato: 'the state free of death'); the concrete 'ambrosia/deathless-nectar' resonance is real and older. (2) pada: 'state, footing, place' (amata-pada = 'the deathless state', so most) OR 'path, way, step' (amata-pada = 'the road to the deathless', pada as in the title Dhamma-pada). The antithesis pamādo maccuno padaṁ (line 2) replays padaṁ: 'the state/realm of Death (Maccu)' or 'the path to death'. Both readings of amata and of pada reported; neither resolved. The double wordplay appamādo/pamādo and amata/maccu is the verse's engine.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:2",
    "pali": "pamādo maccuno padaṁ;",
    "words": [
      {
        "w": "pamādo",
        "gloss": "heedlessness, negligence, carelessness, moral intoxication (pa + √mad)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. pamāda"
      },
      {
        "w": "maccuno",
        "gloss": "of death, of Death (Maccu, personified Death; maccu 'death')",
        "gram": "m., gen. sg. (maccu)",
        "ped": "PED s.v. maccu"
      },
      {
        "w": "padaṁ;",
        "gloss": "the state, footing, place OR path — 'the realm/path of death'; see the note at 21:1 on pada",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. pada"
      }
    ],
    "translation": {
      "text": "heedlessness is the state of death. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:3",
    "pali": "Appamattā na mīyanti,",
    "words": [
      {
        "w": "Appamattā",
        "gloss": "the heedful, the diligent (a + pamatta, pp of pamajjati; here as subst. pl.)",
        "gram": "neg. pp. as subst., nom. pl. m.",
        "ped": "PED s.v. appamatta"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "mīyanti,",
        "gloss": "they die (passive/medial of marati 'to die', √mar); 'do not die' = are not (truly) subject to death",
        "gram": "pres. 3 pl. of mīyati (√mar)",
        "ped": "PED s.v. mīyati"
      }
    ],
    "translation": {
      "text": "The heedful do not die, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp21:4",
    "pali": "ye pamattā yathā matā.",
    "words": [
      {
        "w": "ye",
        "gloss": "who, those who (relative)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "pamattā",
        "gloss": "the heedless, the negligent (pp of pamajjati, as subst. pl.)",
        "gram": "pp. as subst., nom. pl. m.",
        "ped": "PED s.v. pamatta"
      },
      {
        "w": "yathā",
        "gloss": "as, like",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      },
      {
        "w": "matā.",
        "gloss": "dead, the dead (pp of marati 'to die')",
        "gram": "pp. as subst., nom. pl. m.",
        "ped": "PED s.v. mata²"
      }
    ],
    "translation": {
      "text": "while the heedless are like the dead. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp21:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp22:1",
    "pali": "Evaṁ visesato ñatvā,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "thus, so",
        "gram": "indecl. adv.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "visesato",
        "gloss": "distinctly, in terms of (this) distinction; as a special/distinguishing fact (visesa 'distinction, difference' + -to abl./adverbial)",
        "gram": "m., abl. sg. as adv. (visesa)",
        "ped": "PED s.v. visesa"
      },
      {
        "w": "ñatvā,",
        "gloss": "having known, having understood (absolutive of jānāti, √ñā)",
        "gram": "ger. (absol.) of jānāti (√ñā)",
        "ped": "PED s.v. jānāti (ñatvā)"
      }
    ],
    "translation": {
      "text": "Understanding this distinction ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp22:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp22:2",
    "pali": "appamādamhi paṇḍitā;",
    "words": [
      {
        "w": "appamādamhi",
        "gloss": "in heedfulness, regarding diligence (locative of appamāda)",
        "gram": "m., loc. sg. (-amhi ending)",
        "ped": "PED s.v. appamāda"
      },
      {
        "w": "paṇḍitā;",
        "gloss": "the wise, the learned, the astute (paṇḍita)",
        "gram": "adj. as subst., nom. pl. m.",
        "ped": "PED s.v. paṇḍita"
      }
    ],
    "translation": {
      "text": "when it comes to heedfulness, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp22:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp22:3",
    "pali": "Appamāde pamodanti,",
    "words": [
      {
        "w": "Appamāde",
        "gloss": "in heedfulness, in diligence (locative)",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. appamāda"
      },
      {
        "w": "pamodanti,",
        "gloss": "they rejoice, greatly delight (pa + modati)",
        "gram": "pres. 3 pl. of pamodati (pa + √mud)",
        "ped": "PED s.v. pamodati"
      }
    ],
    "translation": {
      "text": "the astute rejoice in heedfulness, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp22:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp22:4",
    "pali": "ariyānaṁ gocare ratā.",
    "words": [
      {
        "w": "ariyānaṁ",
        "gloss": "of the noble ones, of the ariyas (ariya 'noble, worthy'; the awakened / those on the path)",
        "gram": "adj. as subst., gen. pl. m.",
        "ped": "PED s.v. ariya"
      },
      {
        "w": "gocare",
        "gloss": "in the pasture, range, resort (gocara 'pasture, domain, proper resort') — here the meditative domain of the noble ones",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. gocara"
      },
      {
        "w": "ratā.",
        "gloss": "delighting in, taking pleasure in (pp of ramati 'to delight', √ram)",
        "gram": "pp., nom. pl. m.",
        "ped": "PED s.v. rata¹"
      }
    ],
    "translation": {
      "text": "happy in the noble ones’ domain. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp22:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp23:1",
    "pali": "Te jhāyino sātatikā,",
    "words": [
      {
        "w": "Te",
        "gloss": "they, those (ones)",
        "gram": "dem. pron., nom. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "jhāyino",
        "gloss": "meditators, those who practise jhāna/meditative absorption (jhāyin, from jhāyati 'to meditate')",
        "gram": "adj. as subst. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. jhāyin"
      },
      {
        "w": "sātatikā,",
        "gloss": "persevering, constant, unremitting (sātatika, from sātacca 'continuity, perseverance')",
        "gram": "adj., nom. pl. m.",
        "ped": "PED s.v. sātatika"
      }
    ],
    "translation": {
      "text": "They who regularly meditate, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp23:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp23:2",
    "pali": "niccaṁ daḷhaparakkamā;",
    "words": [
      {
        "w": "niccaṁ",
        "gloss": "constantly, always (nicca 'constant' used adverbially)",
        "gram": "adj. as adv., acc. sg. nt.",
        "ped": "PED s.v. nicca"
      },
      {
        "w": "daḷhaparakkamā;",
        "gloss": "= daḷha + parakkama: 'of firm effort, staunchly vigorous' (daḷha 'firm, strong' + parakkama 'exertion, endeavour')",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. daḷha; s.v. parakkama"
      }
    ],
    "translation": {
      "text": "always staunchly vigorous; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp23:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp23:3",
    "pali": "Phusanti dhīrā nibbānaṁ,",
    "words": [
      {
        "w": "Phusanti",
        "gloss": "they touch, reach, attain (phusati 'to touch, reach', √phus/spṛś)",
        "gram": "pres. 3 pl. of phusati (√phus)",
        "ped": "PED s.v. phusati¹"
      },
      {
        "w": "dhīrā",
        "gloss": "the wise, the steadfast, the sagacious (dhīra)",
        "gram": "adj. as subst., nom. pl. m.",
        "ped": "PED s.v. dhīra"
      },
      {
        "w": "nibbānaṁ,",
        "gloss": "nibbāna, extinguishment, the 'blowing out' of the fires of greed, hate, delusion (nir + √vā 'to blow'). Sujato: 'extinguishment'.",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. nibbāna"
      }
    ],
    "translation": {
      "text": "the attentive realize extinguishment, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp23:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp23:4",
    "pali": "yogakkhemaṁ anuttaraṁ.",
    "words": [
      {
        "w": "yogakkhemaṁ",
        "gloss": "= yoga + khema: 'sanctuary/security from the yoke (bond)' — the supreme rest secure from the yogas (the 'yokes' that bind beings to saṁsāra); yoga 'yoke, bond' + khema 'safety, peace'. A standard epithet of nibbāna.",
        "gram": "tappurisa cpd. nt., acc. sg.",
        "ped": "PED s.v. yoga; s.v. khema"
      },
      {
        "w": "anuttaraṁ.",
        "gloss": "unsurpassed, supreme, highest (an + uttara 'nothing higher')",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. anuttara"
      }
    ],
    "translation": {
      "text": "the supreme sanctuary from the yoke. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp23:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp24:0",
    "pali": "Kumbaghosakaseṭṭhivatthu",
    "words": [
      {
        "w": "Kumbaghosakaseṭṭhivatthu",
        "gloss": "= Kumbhaghosaka + seṭṭhi + vatthu: 'the story of the treasurer Kumbhaghosaka' (a merchant's name; seṭṭhi 'guild-master, treasurer, banker'). The Mahāsaṅgīti spells the name Kumba- (single -b-); usually Kumbhaghosaka.",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. seṭṭhi; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp24:1",
    "pali": "Uṭṭhānavato satīmato,",
    "words": [
      {
        "w": "Uṭṭhānavato",
        "gloss": "of the energetic/enterprising one, of one full of initiative (uṭṭhāna 'rousing, exertion, energy, industry' + -vant possessive)",
        "gram": "adj. (poss. -vant stem), gen. sg. m.",
        "ped": "PED s.v. uṭṭhāna (uṭṭhānavant)"
      },
      {
        "w": "satīmato,",
        "gloss": "of the mindful one, of one possessed of mindfulness (sati 'mindfulness' + -mant → satimant)",
        "gram": "adj. (poss. -mant stem), gen. sg. m.",
        "ped": "PED s.v. sati (satimant)"
      }
    ],
    "translation": {
      "text": "For the hard-working and mindful, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp24:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp24:2",
    "pali": "Sucikammassa nisammakārino;",
    "words": [
      {
        "w": "Sucikammassa",
        "gloss": "= suci + kamma: 'of pure deeds, of clean conduct' (suci 'pure, clean' + kamma 'action, deed')",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. suci; s.v. kamma"
      },
      {
        "w": "nisammakārino;",
        "gloss": "= nisamma + kārin: 'of one who acts with consideration, acting circumspectly' (nisamma 'having considered', absol. of nisāmeti 'to observe, consider' + kārin 'acting, doer')",
        "gram": "cpd. adj. (poss. -in stem), gen. sg. m.",
        "ped": "PED s.v. nisamma; s.v. kārin"
      }
    ],
    "translation": {
      "text": "pure of deed and attentive, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp24:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp24:3",
    "pali": "Saññatassa dhammajīvino,",
    "words": [
      {
        "w": "Saññatassa",
        "gloss": "of the self-restrained, of the controlled one (saññata pp of saṁyamati 'to restrain', saṁ + √yam)",
        "gram": "pp., gen. sg. m.",
        "ped": "PED s.v. saṁyata (saññata)"
      },
      {
        "w": "dhammajīvino,",
        "gloss": "= dhamma + jīvin: 'of one who lives righteously/by the Dhamma' (dhamma 'righteousness, the norm' + jīvin 'living', from jīvati)",
        "gram": "cpd. adj. (poss. -in stem), gen. sg. m.",
        "ped": "PED s.v. dhamma; s.v. jīvin"
      }
    ],
    "translation": {
      "text": "restrained, living righteously, and diligent, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp24:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp24:4",
    "pali": "Appamattassa yasobhivaḍḍhati.",
    "words": [
      {
        "w": "Appamattassa",
        "gloss": "of the heedful, of the diligent one (a + pamatta)",
        "gram": "neg. pp., gen. sg. m.",
        "ped": "PED s.v. appamatta"
      },
      {
        "w": "yasobhivaḍḍhati.",
        "gloss": "= yaso + abhivaḍḍhati (sandhi: the initial a- of abhi- is elided after -o): 'fame/reputation' + 'increases, grows greatly' (yasa/yaso 'glory, fame, repute', -s stem; abhivaḍḍhati 'to increase', abhi + √vaḍḍh)",
        "gram": "yaso: nt., nom. sg. (-s stem yasas); abhivaḍḍhati: pres. 3 sg. (abhi + √vaḍḍh)",
        "ped": "PED s.v. yasa; s.v. abhivaḍḍhati"
      }
    ],
    "translation": {
      "text": "their reputation only grows. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp24:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp25:0",
    "pali": "Cūḷapanthakavatthu",
    "words": [
      {
        "w": "Cūḷapanthakavatthu",
        "gloss": "= Cūḷapanthaka + vatthu: 'the story of Cūḷapanthaka' ('Panthaka the Lesser', cūḷa 'small, junior' + Panthaka; the dull-witted monk who won arahantship by diligence)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. cūḷa; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp25:1",
    "pali": "Uṭṭhānenappamādena,",
    "words": [
      {
        "w": "Uṭṭhānenappamādena,",
        "gloss": "= uṭṭhānena + appamādena (sandhi -a + a- → -app-, doubling): 'by energy/exertion' + 'by heedfulness/diligence' (uṭṭhāna 'exertion, industry'; appamāda 'diligence')",
        "gram": "uṭṭhānena: nt., instr. sg.; appamādena: m., instr. sg.",
        "ped": "PED s.v. uṭṭhāna; s.v. appamāda"
      }
    ],
    "translation": {
      "text": "By hard work and diligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp25:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp25:2",
    "pali": "saṁyamena damena ca;",
    "words": [
      {
        "w": "saṁyamena",
        "gloss": "by restraint, by self-control (saṁyama 'restraint, control', saṁ + √yam)",
        "gram": "m., instr. sg.",
        "ped": "PED s.v. saṁyama"
      },
      {
        "w": "damena",
        "gloss": "by taming, by self-mastery (dama 'taming, control')",
        "gram": "m., instr. sg.",
        "ped": "PED s.v. dama"
      },
      {
        "w": "ca;",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "by restraint and by self-control, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp25:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp25:3",
    "pali": "Dīpaṁ kayirātha medhāvī,",
    "words": [
      {
        "w": "Dīpaṁ",
        "gloss": "an island (dīpa 'island') — the flood-proof refuge one builds. (dīpa also means 'lamp'; here 'island' is intended, cf. 'which the flood does not overwhelm')",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. dīpa²"
      },
      {
        "w": "kayirātha",
        "gloss": "one should make/build (medial optative of karoti 'to do, make')",
        "gram": "opt. med. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti (kayirā)"
      },
      {
        "w": "medhāvī,",
        "gloss": "the intelligent/wise one, a person of understanding (medhāvin, from medhā 'wisdom, sagacity')",
        "gram": "adj. as subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. medhāvin"
      }
    ],
    "translation": {
      "text": "a smart person would build an island ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp25:3, verbatim"
    },
    "notes": "dīpa is ambiguous in Pāli between 'island' and 'lamp' (Skt dvīpa vs dīpa); here the relative clause 'that the floods cannot overwhelm' fixes the sense as 'island' — a refuge standing above the flood. The other famous dīpa crux (attā hi attano nātho / att-dīpa 'be an island/lamp unto yourselves') is at DN 16, not here.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp25:4",
    "pali": "yaṁ ogho nābhikīrati.",
    "words": [
      {
        "w": "yaṁ",
        "gloss": "which (relative, referring to the island)",
        "gram": "rel. pron., acc. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ogho",
        "gloss": "the flood, deluge (ogha) — figuratively the 'floods' (of sensuality, becoming, views, ignorance) that sweep beings through saṁsāra",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. ogha"
      },
      {
        "w": "nābhikīrati.",
        "gloss": "= na + abhikīrati (sandhi a + a → ā): 'does not overwhelm, does not submerge/flood over' (abhikirati 'to cover over, overwhelm', abhi + √kir 'to scatter, pour')",
        "gram": "neg. + pres. 3 sg. of abhikirati (abhi + √kir)",
        "ped": "PED s.v. na¹; s.v. abhikirati"
      }
    ],
    "translation": {
      "text": "that the floods cannot overflow. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp25:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp26:0",
    "pali": "Bālanakkhattasaṅghuṭṭhavatthu",
    "words": [
      {
        "w": "Bālanakkhattasaṅghuṭṭhavatthu",
        "gloss": "= bāla + nakkhatta + saṅghuṭṭha + vatthu: 'the story of the fools' festival that was proclaimed' (bāla 'fool' + nakkhatta 'festival, star-festival' + saṅghuṭṭha 'proclaimed, resounded', pp)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. bāla; s.v. nakkhatta; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp26:1",
    "pali": "Pamādamanuyuñjanti,",
    "words": [
      {
        "w": "Pamādamanuyuñjanti,",
        "gloss": "= pamādaṁ + anuyuñjanti (sandhi -ṁ + a- → -m-a-): 'negligence' + 'they devote themselves to, pursue, are addicted to' (anuyuñjati 'to give oneself up to, practise', anu + √yuj)",
        "gram": "pamādaṁ: m., acc. sg.; anuyuñjanti: pres. 3 pl. of anuyuñjati (anu + √yuj)",
        "ped": "PED s.v. pamāda; s.v. anuyuñjati"
      }
    ],
    "translation": {
      "text": "Fools and simpletons ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp26:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp26:2",
    "pali": "bālā dummedhino janā;",
    "words": [
      {
        "w": "bālā",
        "gloss": "fools, the foolish, the childish (bāla 'young, ignorant, foolish')",
        "gram": "adj. as subst., nom. pl. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "dummedhino",
        "gloss": "= du(r) + medhin: 'of poor wit, dull-witted, stupid' (du(r) 'ill, bad' + medhin 'intelligent', from medhā)",
        "gram": "cpd. adj. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. dummedha; s.v. medhin"
      },
      {
        "w": "janā;",
        "gloss": "people, folk (jana)",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. jana"
      }
    ],
    "translation": {
      "text": "devote themselves to negligence. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp26:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp26:3",
    "pali": "Appamādañca medhāvī,",
    "words": [
      {
        "w": "Appamādañca",
        "gloss": "= appamādaṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and heedfulness/diligence' (appamāda)",
        "gram": "appamādaṁ: m., acc. sg.; ca: conj.",
        "ped": "PED s.v. appamāda; s.v. ca"
      },
      {
        "w": "medhāvī,",
        "gloss": "the wise/intelligent one (medhāvin)",
        "gram": "adj. as subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. medhāvin"
      }
    ],
    "translation": {
      "text": "But the wise protect diligence ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp26:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp26:4",
    "pali": "dhanaṁ seṭṭhaṁva rakkhati.",
    "words": [
      {
        "w": "dhanaṁ",
        "gloss": "wealth, treasure, riches (dhana)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. dhana"
      },
      {
        "w": "seṭṭhaṁva",
        "gloss": "= seṭṭhaṁ + va (= iva 'like'): 'as the best/finest', i.e. 'like the best treasure' (seṭṭha 'best, highest')",
        "gram": "seṭṭhaṁ: adj., acc. sg. nt.; va: indecl. (= iva)",
        "ped": "PED s.v. seṭṭha; s.v. iva"
      },
      {
        "w": "rakkhati.",
        "gloss": "guards, protects, keeps (rakkhati, √rakṣ)",
        "gram": "pres. 3 sg. of rakkhati (√rakkh)",
        "ped": "PED s.v. rakkhati"
      }
    ],
    "translation": {
      "text": "as their best treasure. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp26:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp27:1",
    "pali": "Mā pamādamanuyuñjetha,",
    "words": [
      {
        "w": "Mā",
        "gloss": "do not (prohibitive particle)",
        "gram": "indecl. (prohib.)",
        "ped": "PED s.v. mā²"
      },
      {
        "w": "pamādamanuyuñjetha,",
        "gloss": "= pamādaṁ + anuyuñjetha (sandhi -ṁ + a- → -m-a-): 'negligence' + 'do not devote yourselves to' (anuyuñjetha med. opt./imper. 2 pl. of anuyuñjati)",
        "gram": "pamādaṁ: m., acc. sg.; anuyuñjetha: opt./imper. med. 2 pl. of anuyuñjati (anu + √yuj)",
        "ped": "PED s.v. pamāda; s.v. anuyuñjati"
      }
    ],
    "translation": {
      "text": "Don’t devote yourself to negligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp27:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp27:2",
    "pali": "mā kāmaratisanthavaṁ;",
    "words": [
      {
        "w": "mā",
        "gloss": "do not (prohibitive; with the verb of the previous line understood: 'do not [devote yourself to]')",
        "gram": "indecl. (prohib.)",
        "ped": "PED s.v. mā²"
      },
      {
        "w": "kāmaratisanthavaṁ;",
        "gloss": "= kāma + rati + santhava: 'intimacy with sensual delight' (kāma 'sensual pleasure' + rati 'delight, pleasure' + santhava 'intimacy, acquaintance, association')",
        "gram": "tappurisa cpd. m., acc. sg.",
        "ped": "PED s.v. kāma; s.v. rati; s.v. santhava"
      }
    ],
    "translation": {
      "text": "or delight in erotic intimacy. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp27:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp27:3",
    "pali": "Appamatto hi jhāyanto,",
    "words": [
      {
        "w": "Appamatto",
        "gloss": "the heedful one, being diligent (a + pamatta)",
        "gram": "neg. pp. as adj., nom. sg. m.",
        "ped": "PED s.v. appamatta"
      },
      {
        "w": "hi",
        "gloss": "indeed, for, surely (emphatic-causal particle)",
        "gram": "indecl. (emph.)",
        "ped": "PED s.v. hi"
      },
      {
        "w": "jhāyanto,",
        "gloss": "meditating, absorbed in jhāna (present participle of jhāyati 'to meditate')",
        "gram": "ppr. of jhāyati (√jhā), nom. sg. m.",
        "ped": "PED s.v. jhāyati¹"
      }
    ],
    "translation": {
      "text": "For if you’re diligent and meditate, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp27:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp27:4",
    "pali": "pappoti vipulaṁ sukhaṁ.",
    "words": [
      {
        "w": "pappoti",
        "gloss": "attains, reaches, wins (pa + āpuṇāti 'to reach', pra + √āp)",
        "gram": "pres. 3 sg. of pappoti (pa + √āp)",
        "ped": "PED s.v. pappoti"
      },
      {
        "w": "vipulaṁ",
        "gloss": "abundant, great, extensive (vipula)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. vipula"
      },
      {
        "w": "sukhaṁ.",
        "gloss": "happiness, ease, bliss",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. sukha"
      }
    ],
    "translation": {
      "text": "you’ll attain abundant happiness. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp27:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:0",
    "pali": "Mahākassapattheravatthu",
    "words": [
      {
        "w": "Mahākassapattheravatthu",
        "gloss": "= Mahākassapa + thera + vatthu: 'the story of the Elder Mahākassapa' (a chief disciple; mahā 'great' + Kassapa; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:1",
    "pali": "Pamādaṁ appamādena,",
    "words": [
      {
        "w": "Pamādaṁ",
        "gloss": "negligence, heedlessness (acc.)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. pamāda"
      },
      {
        "w": "appamādena,",
        "gloss": "by heedfulness, through diligence (instr.)",
        "gram": "m., instr. sg.",
        "ped": "PED s.v. appamāda"
      }
    ],
    "translation": {
      "text": "When the astute dispel negligence ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:2",
    "pali": "yadā nudati paṇḍito;",
    "words": [
      {
        "w": "yadā",
        "gloss": "when (relative adv. of time)",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yadā"
      },
      {
        "w": "nudati",
        "gloss": "dispels, drives away, removes (nudati 'to push away, dispel', √nud)",
        "gram": "pres. 3 sg. of nudati (√nud)",
        "ped": "PED s.v. nudati"
      },
      {
        "w": "paṇḍito;",
        "gloss": "the wise one, the learned/astute person",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. paṇḍita"
      }
    ],
    "translation": {
      "text": "by means of diligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:3",
    "pali": "Paññāpāsādamāruyha,",
    "words": [
      {
        "w": "Paññāpāsādamāruyha,",
        "gloss": "= paññāpāsādaṁ + āruyha (sandhi -ṁ + ā- → -m-ā-): 'the palace/terrace of wisdom' + 'having ascended, climbed up' (paññā 'wisdom' + pāsāda 'palace, upper terrace, tower'; āruyha absol. of āruhati 'to ascend', ā + √ruh)",
        "gram": "paññāpāsādaṁ: tappurisa cpd., acc. sg. m.; āruyha: ger. (absol.) of āruhati (ā + √ruh)",
        "ped": "PED s.v. paññā; s.v. pāsāda; s.v. āruhati"
      }
    ],
    "translation": {
      "text": "ascending the palace of wisdom, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:4",
    "pali": "asoko sokiniṁ pajaṁ;",
    "words": [
      {
        "w": "asoko",
        "gloss": "sorrowless, free of grief (a + soka 'grief, sorrow')",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. asoka"
      },
      {
        "w": "sokiniṁ",
        "gloss": "grieving, sorrowing (sokin 'full of sorrow', from soka); f. acc. agreeing with pajaṁ",
        "gram": "adj. (poss. -in stem), acc. sg. f.",
        "ped": "PED s.v. sokin"
      },
      {
        "w": "pajaṁ;",
        "gloss": "progeny, offspring, people, generation (pajā 'progeny, mankind, generation')",
        "gram": "f., acc. sg.",
        "ped": "PED s.v. pajā"
      }
    ],
    "translation": {
      "text": "sorrowless, they behold this generation of sorrow, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:5",
    "pali": "Pabbataṭṭhova bhūmaṭṭhe,",
    "words": [
      {
        "w": "Pabbataṭṭhova",
        "gloss": "= pabbataṭṭho + va (= iva 'like'): 'like one standing on a mountain' (pabbata 'mountain' + ṭṭha 'standing', from tiṭṭhati)",
        "gram": "pabbataṭṭho: cpd. adj., nom. sg. m.; va: indecl. (= iva)",
        "ped": "PED s.v. pabbata; s.v. ṭha (-ṭṭha); s.v. iva"
      },
      {
        "w": "bhūmaṭṭhe,",
        "gloss": "= bhūmi + ṭṭha: 'those standing on the ground' (bhūmi 'ground, earth' + ṭṭha 'standing'); acc. pl. object of avekkhati",
        "gram": "cpd. adj., acc. pl. m.",
        "ped": "PED s.v. bhūmi; s.v. ṭha (-ṭṭha)"
      }
    ],
    "translation": {
      "text": "as an attentive one on a mountain top ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:5, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp28:6",
    "pali": "dhīro bāle avekkhati.",
    "words": [
      {
        "w": "dhīro",
        "gloss": "the wise/steadfast one (dhīra)",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. dhīra"
      },
      {
        "w": "bāle",
        "gloss": "the fools (acc. pl. of bāla)",
        "gram": "adj. as subst., acc. pl. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "avekkhati.",
        "gloss": "looks down upon, observes, surveys (ava + √īkṣ 'to look')",
        "gram": "pres. 3 sg. of avekkhati (ava + √ikkh)",
        "ped": "PED s.v. avekkhati"
      }
    ],
    "translation": {
      "text": "beholds the fools below. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp28:6, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp29:0",
    "pali": "Pamattāpamattadvesahāyakabhikkhuvatthu",
    "words": [
      {
        "w": "Pamattāpamattadvesahāyakabhikkhuvatthu",
        "gloss": "= pamatta + apamatta + dve + sahāyaka + bhikkhu + vatthu: 'the story of the two companion monks, one heedless and one heedful' (pamatta 'heedless' + a-pamatta 'heedful' + dve 'two' + sahāyaka 'companion' + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. pamatta; s.v. sahāya; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp29:1",
    "pali": "Appamatto pamattesu,",
    "words": [
      {
        "w": "Appamatto",
        "gloss": "the heedful one (a + pamatta)",
        "gram": "neg. pp. as subst., nom. sg. m.",
        "ped": "PED s.v. appamatta"
      },
      {
        "w": "pamattesu,",
        "gloss": "among the heedless (loc. pl. of pamatta)",
        "gram": "pp. as subst., loc. pl. m.",
        "ped": "PED s.v. pamatta"
      }
    ],
    "translation": {
      "text": "Heedful among the heedless, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp29:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp29:2",
    "pali": "suttesu bahujāgaro;",
    "words": [
      {
        "w": "suttesu",
        "gloss": "among the sleeping (loc. pl. of sutta, pp of supati 'to sleep' — not to be confused with sutta 'thread, discourse')",
        "gram": "pp. as subst., loc. pl. m.",
        "ped": "PED s.v. supati (sutta)"
      },
      {
        "w": "bahujāgaro;",
        "gloss": "= bahu + jāgara: 'much awake, wide awake' (bahu 'much' + jāgara 'wakeful, watchful', from jāgarati 'to be awake')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. bahu; s.v. jāgara"
      }
    ],
    "translation": {
      "text": "wide awake while others sleep—",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp29:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp29:3",
    "pali": "Abalassaṁva sīghasso,",
    "words": [
      {
        "w": "Abalassaṁva",
        "gloss": "= abalassaṁ + va (= iva 'like'): 'like a weak horse' (abala 'weak, feeble' + assa 'horse'); acc. abalassaṁ, the one left behind",
        "gram": "abalassaṁ: cpd. m., acc. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. abala; s.v. assa³; s.v. iva"
      },
      {
        "w": "sīghasso,",
        "gloss": "= sīgha + assa: 'a swift horse' (sīgha 'fast, swift' + assa 'horse')",
        "gram": "kammadhāraya cpd. m., nom. sg.",
        "ped": "PED s.v. sīgha; s.v. assa³"
      }
    ],
    "translation": {
      "text": "a true sage leaves them behind, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp29:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp29:4",
    "pali": "hitvā yāti sumedhaso.",
    "words": [
      {
        "w": "hitvā",
        "gloss": "having left behind, having abandoned (absolutive of jahati 'to leave, abandon', √hā)",
        "gram": "ger. (absol.) of jahati (√hā)",
        "ped": "PED s.v. jahati (hitvā)"
      },
      {
        "w": "yāti",
        "gloss": "goes, proceeds, moves on (yāti 'to go', √yā)",
        "gram": "pres. 3 sg. of yāti (√yā)",
        "ped": "PED s.v. yāti"
      },
      {
        "w": "sumedhaso.",
        "gloss": "the very wise one, one of good understanding (su 'good' + medhas 'wisdom', -s stem; 'of fine intelligence')",
        "gram": "adj. (poss. -s stem) as subst., nom. sg. m.",
        "ped": "PED s.v. medhasa (su°)"
      }
    ],
    "translation": {
      "text": "like a swift horse passing a feeble. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp29:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp30:0",
    "pali": "Maghavatthu",
    "words": [
      {
        "w": "Maghavatthu",
        "gloss": "= Magha + vatthu: 'the story of Magha' (the youth Magha whose diligence in doing good made him Sakka, king of the gods; hence Maghavā, a title of Sakka)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. maghavant; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp30:1",
    "pali": "Appamādena maghavā,",
    "words": [
      {
        "w": "Appamādena",
        "gloss": "by heedfulness, through diligence (instr.)",
        "gram": "m., instr. sg.",
        "ped": "PED s.v. appamāda"
      },
      {
        "w": "maghavā,",
        "gloss": "Maghavā — a title of Sakka/Indra, king of the gods (also the youth Magha who became Sakka through diligence); 'the Bountiful'.",
        "gram": "m., nom. sg. (-vant stem, maghavant)",
        "ped": "PED s.v. maghavant"
      }
    ],
    "translation": {
      "text": "Maghavā became chief of the gods ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp30:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp30:2",
    "pali": "devānaṁ seṭṭhataṁ gato;",
    "words": [
      {
        "w": "devānaṁ",
        "gloss": "of the gods, among the deities (gen. pl. of deva)",
        "gram": "m., gen. pl.",
        "ped": "PED s.v. deva"
      },
      {
        "w": "seṭṭhataṁ",
        "gloss": "chieftaincy, pre-eminence, the state of being highest/best (seṭṭha 'best' + abstract suffix -tā)",
        "gram": "f., acc. sg. (abstr. -tā)",
        "ped": "PED s.v. seṭṭha"
      },
      {
        "w": "gato;",
        "gloss": "gone (to), attained (pp of gacchati)",
        "gram": "pp. of gacchati (√gam), nom. sg. m.",
        "ped": "PED s.v. gata"
      }
    ],
    "translation": {
      "text": "by means of diligence. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp30:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp30:3",
    "pali": "Appamādaṁ pasaṁsanti,",
    "words": [
      {
        "w": "Appamādaṁ",
        "gloss": "heedfulness, diligence (acc.)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. appamāda"
      },
      {
        "w": "pasaṁsanti,",
        "gloss": "they praise, commend (pasaṁsati, pa + √śaṁs)",
        "gram": "pres. 3 pl. of pasaṁsati (pa + √saṁs)",
        "ped": "PED s.v. pasaṁsati"
      }
    ],
    "translation": {
      "text": "People praise diligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp30:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp30:4",
    "pali": "pamādo garahito sadā.",
    "words": [
      {
        "w": "pamādo",
        "gloss": "negligence, heedlessness (nom.)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. pamāda"
      },
      {
        "w": "garahito",
        "gloss": "blamed, censured, reproached (pp of garahati 'to blame')",
        "gram": "pp. of garahati (√garh), nom. sg. m.",
        "ped": "PED s.v. garahita"
      },
      {
        "w": "sadā.",
        "gloss": "always, ever (sadā)",
        "gram": "indecl. (adv.)",
        "ped": "PED s.v. sadā"
      }
    ],
    "translation": {
      "text": "while negligence is always deplored. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp30:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp31:0",
    "pali": "Aññatarabhikkhuvatthu",
    "words": [
      {
        "w": "Aññatarabhikkhuvatthu",
        "gloss": "= aññatara + bhikkhu + vatthu: 'the story of a certain monk' (aññatara 'a certain, some' + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. aññatara; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp31:1",
    "pali": "Appamādarato bhikkhu,",
    "words": [
      {
        "w": "Appamādarato",
        "gloss": "= appamāda + rata: 'delighting in heedfulness, devoted to diligence' (appamāda + rata pp of ramati 'to delight')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. appamāda; s.v. rata¹"
      },
      {
        "w": "bhikkhu,",
        "gloss": "a monk, mendicant (bhikkhu 'one who lives on alms', from bhikkhati 'to beg')",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bhikkhu"
      }
    ],
    "translation": {
      "text": "A mendicant who loves diligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp31:1, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp31:2",
    "pali": "pamāde bhayadassi vā;",
    "words": [
      {
        "w": "pamāde",
        "gloss": "in negligence, in heedlessness (loc.)",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. pamāda"
      },
      {
        "w": "bhayadassi",
        "gloss": "= bhaya + dassin: 'seeing danger/fear, perceiving peril' (bhaya 'fear, danger' + dassin 'seeing', from dassati); nom. sg. shortened for -dassī",
        "gram": "cpd. adj. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. bhaya; s.v. dassin"
      },
      {
        "w": "vā;",
        "gloss": "an enclitic particle here best read as va = eva (emphatic) or as a metrical filler, not a genuine 'or'; some texts print -dassī va. PED registers va both = eva and = iva.",
        "gram": "indecl. (encl. particle; = eva/va, not disjunctive 'or' in sense)",
        "ped": "PED s.v. va; s.v. vā"
      }
    ],
    "translation": {
      "text": "seeing fear in negligence—",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp31:2, verbatim"
    },
    "notes": "'bhayadassi vā': though written vā (long) in the Mahāsaṅgīti, the particle is not a real 'or' here — it is read either as emphatic va/eva ('truly seeing danger in negligence') or as a metrical expletive; the same colon-line recurs verbatim at Dhp 32:2. Sujato renders simply 'seeing fear in negligence'. Both parses noted.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp31:3",
    "pali": "Saṁyojanaṁ aṇuṁ thūlaṁ,",
    "words": [
      {
        "w": "Saṁyojanaṁ",
        "gloss": "a fetter, bond that binds beings to saṁsāra (saṁyojana, saṁ + √yuj 'to yoke')",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. saṁyojana"
      },
      {
        "w": "aṇuṁ",
        "gloss": "small, subtle, minute (aṇu)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. aṇu"
      },
      {
        "w": "thūlaṁ,",
        "gloss": "big, gross, coarse (thūla)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. thūla"
      }
    ],
    "translation": {
      "text": "advances like fire, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp31:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp31:4",
    "pali": "ḍahaṁ aggīva gacchati.",
    "words": [
      {
        "w": "ḍahaṁ",
        "gloss": "burning, consuming (present participle of ḍahati 'to burn', √dah)",
        "gram": "ppr. of ḍahati (√dah), nom. sg. m.",
        "ped": "PED s.v. ḍahati"
      },
      {
        "w": "aggīva",
        "gloss": "= aggī + va (= iva 'like'): 'like fire' (aggi 'fire'; final lengthened to aggī metri causa)",
        "gram": "aggī: m., nom. sg. (aggi); va: indecl. (= iva)",
        "ped": "PED s.v. aggi; s.v. iva"
      },
      {
        "w": "gacchati.",
        "gloss": "goes, advances, proceeds (here 'advances burning up the fetters')",
        "gram": "pres. 3 sg. of gacchati (√gam)",
        "ped": "PED s.v. gacchati"
      }
    ],
    "translation": {
      "text": "burning up fetters big and small. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp31:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:0",
    "pali": "Nigamavāsitissattheravatthu",
    "words": [
      {
        "w": "Nigamavāsitissattheravatthu",
        "gloss": "= nigama + vāsi + Tissa + thera + vatthu: 'the story of the Elder Tissa who dwelt in a market-town' (nigama 'market-town' + vāsin 'dweller' + Tissa, a name; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. nigama; s.v. vāsin; s.v. thera"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:1",
    "pali": "Appamādarato bhikkhu,",
    "words": [
      {
        "w": "Appamādarato",
        "gloss": "= appamāda + rata: 'delighting in heedfulness' (as at 31:1)",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. appamāda; s.v. rata¹"
      },
      {
        "w": "bhikkhu,",
        "gloss": "a monk, mendicant",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bhikkhu"
      }
    ],
    "translation": {
      "text": "A mendicant who loves diligence, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp32:1, verbatim"
    },
    "notes": "Lines 32:1–32:2 repeat 31:1–31:2 verbatim; the twinned opening of the vagga's last pair.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:2",
    "pali": "pamāde bhayadassi vā;",
    "words": [
      {
        "w": "pamāde",
        "gloss": "in negligence (loc.)",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. pamāda"
      },
      {
        "w": "bhayadassi",
        "gloss": "= bhaya + dassin: 'seeing danger in negligence' (as at 31:2)",
        "gram": "cpd. adj. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. bhaya; s.v. dassin"
      },
      {
        "w": "vā;",
        "gloss": "the enclitic particle read as va/eva (emphatic) or a metrical filler, not disjunctive 'or' (see note at 31:2)",
        "gram": "indecl. (encl. particle; = eva/va)",
        "ped": "PED s.v. va; s.v. vā"
      }
    ],
    "translation": {
      "text": "seeing fear in negligence—",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp32:2, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:3",
    "pali": "Abhabbo parihānāya,",
    "words": [
      {
        "w": "Abhabbo",
        "gloss": "incapable, unable, not liable (a + bhabba 'able, capable', grdv. of bhavati); 'incapable of [falling away]'",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. abhabba"
      },
      {
        "w": "parihānāya,",
        "gloss": "for/of falling away, decline, regression (parihāna 'decrease, loss, falling off'; dat. of respect: 'incapable of decline')",
        "gram": "nt., dat. sg.",
        "ped": "PED s.v. parihāna"
      }
    ],
    "translation": {
      "text": "such a one can’t decline, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp32:3, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:4",
    "pali": "nibbānasseva santike.",
    "words": [
      {
        "w": "nibbānasseva",
        "gloss": "= nibbānassa + eva (the emphatic eva): 'of nibbāna itself, of extinguishment indeed' (nibbāna + emph. eva)",
        "gram": "nibbānassa: nt., gen. sg.; eva: emph. particle",
        "ped": "PED s.v. nibbāna; s.v. eva"
      },
      {
        "w": "santike.",
        "gloss": "in the presence/vicinity of, near (santika 'nearness, presence'; loc. santike 'near' + gen.) — 'is near to nibbāna itself'",
        "gram": "nt., loc. sg. (as postpos. with gen.)",
        "ped": "PED s.v. santika"
      }
    ],
    "translation": {
      "text": "and has drawn near to extinguishment. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp32:4, verbatim"
    },
    "notes": null,
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp32:5",
    "pali": "Appamādavaggo dutiyo.",
    "words": [
      {
        "w": "Appamādavaggo",
        "gloss": "= appamāda + vagga: the Chapter on Heedfulness (as inflected noun)",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. appamāda; s.v. vagga"
      },
      {
        "w": "dutiyo.",
        "gloss": "second — 'Heedfulness, the second (chapter)'",
        "gram": "ordinal adj., nom. sg. m.",
        "ped": "PED s.v. dutiya"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Chapter on Heedfulness, the second'); no Sujato segment, translation null.",
    "section": "2. Diligence · Appamādavagga (Dhp 21–32)"
  },
  {
    "ref": "dhp33:0.1",
    "pali": "Khuddakanikāya",
    "words": [
      {
        "w": "Khuddakanikāya",
        "gloss": "= khuddaka + nikāya: the 'Minor Collection'",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. khuddaka; s.v. nikāya"
      }
    ],
    "translation": {
      "text": "Minor Collection ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:0.1, verbatim"
    },
    "notes": "Header segment.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:0.2",
    "pali": "Dhammapada",
    "words": [
      {
        "w": "Dhammapada",
        "gloss": "= dhamma + pada: the Dhammapada (see dhp1:0.2)",
        "gram": "cpd., nom. sg. nt. (title)",
        "ped": "PED s.v. dhamma; s.v. pada"
      }
    ],
    "translation": {
      "text": "Sayings of the Dhamma 33–43 ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:0.2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:0.3",
    "pali": "Cittavagga",
    "words": [
      {
        "w": "Cittavagga",
        "gloss": "= citta + vagga: the 'Chapter on the Mind' (citta 'mind, heart, thought' + vagga 'chapter')",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. citta²; s.v. vagga"
      }
    ],
    "translation": {
      "text": "3. The Mind ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:0.3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:0.4",
    "pali": "Meghiyattheravatthu",
    "words": [
      {
        "w": "Meghiyattheravatthu",
        "gloss": "= Meghiya + thera + vatthu: 'the story of the Elder Meghiya' (whose restless mind occasions the verses; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Commentarial story-title; no Sujato segment, translation null.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:1",
    "pali": "Phandanaṁ capalaṁ cittaṁ,",
    "words": [
      {
        "w": "Phandanaṁ",
        "gloss": "quivering, trembling, throbbing (phandana, from phandati 'to throb, quiver')",
        "gram": "adj., acc. sg. nt. (agreeing with cittaṁ)",
        "ped": "PED s.v. phandana"
      },
      {
        "w": "capalaṁ",
        "gloss": "unsteady, fickle, wavering, agitated (capala)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. capala"
      },
      {
        "w": "cittaṁ,",
        "gloss": "the mind, heart, thought (citta)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "The mind quivers and shakes, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:2",
    "pali": "dūrakkhaṁ dunnivārayaṁ;",
    "words": [
      {
        "w": "dūrakkhaṁ",
        "gloss": "= du(r) + rakkha: 'hard to guard, difficult to protect' (du(r) 'hard, ill' + rakkha 'guarding', from rakkhati)",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. du; s.v. rakkha"
      },
      {
        "w": "dunnivārayaṁ;",
        "gloss": "= du(r) + nivāraya: 'hard to restrain, difficult to hold back/ward off' (du(r) + nivāraya, from nivāreti 'to ward off, restrain', ni + √vṛ)",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. du; s.v. nivāreti"
      }
    ],
    "translation": {
      "text": "hard to guard, hard to curb. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:3",
    "pali": "Ujuṁ karoti medhāvī,",
    "words": [
      {
        "w": "Ujuṁ",
        "gloss": "straight, upright (uju); 'makes it straight'",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. uju"
      },
      {
        "w": "karoti",
        "gloss": "makes, does",
        "gram": "pres. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "medhāvī,",
        "gloss": "the wise/intelligent one (medhāvin)",
        "gram": "adj. as subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. medhāvin"
      }
    ],
    "translation": {
      "text": "The discerning straighten it out, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp33:4",
    "pali": "usukārova tejanaṁ.",
    "words": [
      {
        "w": "usukārova",
        "gloss": "= usukāro + va (= iva 'like'): 'like a fletcher/arrow-maker' (usu 'arrow' + kāra 'maker')",
        "gram": "usukāro: cpd. m., nom. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. usu; s.v. kāra; s.v. iva"
      },
      {
        "w": "tejanaṁ.",
        "gloss": "an arrow-shaft, the shaft (tejana 'shaft of an arrow, reed')",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. tejana"
      }
    ],
    "translation": {
      "text": "like a fletcher straightens an arrow. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp33:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp34:1",
    "pali": "Vārijova thale khitto,",
    "words": [
      {
        "w": "Vārijova",
        "gloss": "= vārijo + va (= iva 'like'): 'like a fish' (vāri 'water' + ja 'born', vārija = 'water-born', a fish)",
        "gram": "vārijo: cpd. m., nom. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. vāri; s.v. ja; s.v. iva"
      },
      {
        "w": "thale",
        "gloss": "on dry land, on the ground (thala 'dry ground, land')",
        "gram": "nt., loc. sg.",
        "ped": "PED s.v. thala"
      },
      {
        "w": "khitto,",
        "gloss": "thrown, cast (pp of khipati 'to throw', √kṣip)",
        "gram": "pp. of khipati (√khip), nom. sg. m.",
        "ped": "PED s.v. khitta"
      }
    ],
    "translation": {
      "text": "Like a fish pulled from the sea ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp34:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp34:2",
    "pali": "okamokataubbhato;",
    "words": [
      {
        "w": "okamokataubbhato;",
        "gloss": "= okamokata + ubbhato (contested resolution): 'pulled up out of its watery home' — okamokata is a distributive reduplication of oka 'abode, dwelling (esp. the watery home of aquatic creatures)', okam-oka 'from (its every) abode' (some read okamokato as an ablative 'from the home'); ubbhata is pp of ubbharati/ubbhavati 'raised up, lifted out'. Sujato: 'pulled from the sea'.",
        "gram": "okamokata: reduplicated cpd. (oka), abl.-sense; ubbhato: pp., nom. sg. m.",
        "ped": "PED s.v. oka; s.v. ubbhata"
      }
    ],
    "translation": {
      "text": "and cast upon the shore, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp34:2, verbatim"
    },
    "notes": "okamokataubbhato is a genuine crux. Most editions read it as okamokato ubbhato ('lifted out from its watery abode'), taking okamoka as reduplicated oka 'home, water-abode' with ablative sense; the Mahāsaṅgīti's fused spelling okamokata-ubbhato preserves the compound. Other analyses divide it differently (oka-m-okata); nothing in the sense (a fish yanked from water) turns on it. Both the reduplicative and ablative parses reported; unresolved.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp34:3",
    "pali": "Pariphandatidaṁ cittaṁ,",
    "words": [
      {
        "w": "Pariphandatidaṁ",
        "gloss": "= pariphandati + idaṁ (sandhi -i + i- → -id-): 'flounders/thrashes about' + 'this' (pariphandati 'to struggle, quiver all round', pari + √phand; idaṁ 'this')",
        "gram": "pariphandati: pres. 3 sg. (pari + √phand); idaṁ: dem. pron., nom. sg. nt.",
        "ped": "PED s.v. pariphandati; s.v. ayaṁ (idaṁ)"
      },
      {
        "w": "cittaṁ,",
        "gloss": "the mind (nom.)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "this mind flounders about, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp34:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp34:4",
    "pali": "māradheyyaṁ pahātave.",
    "words": [
      {
        "w": "māradheyyaṁ",
        "gloss": "= māra + dheyya: 'the realm/dominion of Māra' (māra 'Māra, Death' + dheyya 'domain, sphere; that which is laid down', from dahati/√dhā). Māra's sway.",
        "gram": "tappurisa cpd. nt., acc. sg.",
        "ped": "PED s.v. māra; s.v. dheyya"
      },
      {
        "w": "pahātave.",
        "gloss": "in order to abandon, so as to cast off (an archaic infinitive of pajahati 'to give up', pa + √hā)",
        "gram": "inf. (Vedic-type -tave) of pajahati (pa + √hā)",
        "ped": "PED s.v. pajahati (pahātave)"
      }
    ],
    "translation": {
      "text": "trying to throw off Māra’s dominion. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp34:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp35:0",
    "pali": "Aññatarabhikkhuvatthu",
    "words": [
      {
        "w": "Aññatarabhikkhuvatthu",
        "gloss": "= aññatara + bhikkhu + vatthu: 'the story of a certain monk' (aññatara 'a certain' + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. aññatara; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp35:1",
    "pali": "Dunniggahassa lahuno,",
    "words": [
      {
        "w": "Dunniggahassa",
        "gloss": "= du(r) + niggaha: 'hard to hold in check, difficult to restrain/subdue' (du(r) 'hard' + niggaha 'restraint, control', ni + √grah); gen. agreeing with cittassa (35:3)",
        "gram": "cpd. adj., gen. sg. nt.",
        "ped": "PED s.v. du; s.v. niggaha"
      },
      {
        "w": "lahuno,",
        "gloss": "light, quick, swift, flighty (lahu 'light, nimble'); gen. sg.",
        "gram": "adj., gen. sg. nt. (lahu)",
        "ped": "PED s.v. lahu"
      }
    ],
    "translation": {
      "text": "Hard to hold back, flighty, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp35:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp35:2",
    "pali": "yatthakāmanipātino;",
    "words": [
      {
        "w": "yatthakāmanipātino;",
        "gloss": "= yattha + kāma + nipātin: 'alighting/landing wherever it wishes' (yattha 'where(ever)' + kāma 'desire, wish' + nipātin 'falling, alighting', from nipatati); settling on whatever object it pleases",
        "gram": "cpd. adj. (poss. -in stem), gen. sg. nt.",
        "ped": "PED s.v. yattha; s.v. kāma; s.v. nipātin"
      }
    ],
    "translation": {
      "text": "alighting where it will; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp35:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp35:3",
    "pali": "Cittassa damatho sādhu,",
    "words": [
      {
        "w": "Cittassa",
        "gloss": "of the mind (gen.)",
        "gram": "nt., gen. sg.",
        "ped": "PED s.v. citta²"
      },
      {
        "w": "damatho",
        "gloss": "taming, subduing, control (damatha, from dameti 'to tame')",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. damatha"
      },
      {
        "w": "sādhu,",
        "gloss": "good, excellent, beneficial (sādhu)",
        "gram": "adj./indecl., nom. sg. m./nt.",
        "ped": "PED s.v. sādhu"
      }
    ],
    "translation": {
      "text": "it’s good to tame the mind; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp35:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp35:4",
    "pali": "cittaṁ dantaṁ sukhāvahaṁ.",
    "words": [
      {
        "w": "cittaṁ",
        "gloss": "the mind (nom.)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. citta²"
      },
      {
        "w": "dantaṁ",
        "gloss": "tamed, controlled, disciplined (danta pp of dameti 'to tame')",
        "gram": "pp., nom. sg. nt.",
        "ped": "PED s.v. danta³"
      },
      {
        "w": "sukhāvahaṁ.",
        "gloss": "= sukha + āvaha: 'bringing happiness, conducive to bliss' (sukha 'happiness' + āvaha 'bringing', from āvahati 'to bring')",
        "gram": "cpd. adj., nom. sg. nt.",
        "ped": "PED s.v. sukha; s.v. āvaha"
      }
    ],
    "translation": {
      "text": "a tamed mind leads to bliss. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp35:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp36:0",
    "pali": "Aññataraukkaṇṭhitabhikkhuvatthu",
    "words": [
      {
        "w": "Aññataraukkaṇṭhitabhikkhuvatthu",
        "gloss": "= aññatara + ukkaṇṭhita + bhikkhu + vatthu: 'the story of a certain discontented monk' (aññatara 'a certain' + ukkaṇṭhita 'dissatisfied, longing, fretting', pp + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. aññatara; s.v. ukkaṇṭhita; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp36:1",
    "pali": "Sududdasaṁ sunipuṇaṁ,",
    "words": [
      {
        "w": "Sududdasaṁ",
        "gloss": "= su + duddasa: 'very hard to see, most difficult to perceive' (su 'very' + duddasa = du(r) + dasa 'hard to see', from dassati)",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. duddasa"
      },
      {
        "w": "sunipuṇaṁ,",
        "gloss": "= su + nipuṇa: 'very subtle, exceedingly fine' (su 'very' + nipuṇa 'subtle, clever, fine')",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. nipuṇa"
      }
    ],
    "translation": {
      "text": "So hard to see, so subtle, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp36:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp36:2",
    "pali": "yatthakāmanipātinaṁ;",
    "words": [
      {
        "w": "yatthakāmanipātinaṁ;",
        "gloss": "= yattha + kāma + nipātin: 'alighting wherever it wishes' (as at 35:2, here acc. agreeing with cittaṁ)",
        "gram": "cpd. adj. (poss. -in stem), acc. sg. nt.",
        "ped": "PED s.v. yattha; s.v. kāma; s.v. nipātin"
      }
    ],
    "translation": {
      "text": "alighting where it will; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp36:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp36:3",
    "pali": "Cittaṁ rakkhetha medhāvī,",
    "words": [
      {
        "w": "Cittaṁ",
        "gloss": "the mind (acc.)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. citta²"
      },
      {
        "w": "rakkhetha",
        "gloss": "should guard, should protect (optative 3 sg. of rakkhati)",
        "gram": "opt. 3 sg. of rakkhati (√rakkh)",
        "ped": "PED s.v. rakkhati"
      },
      {
        "w": "medhāvī,",
        "gloss": "the wise one (medhāvin)",
        "gram": "adj. as subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. medhāvin"
      }
    ],
    "translation": {
      "text": "the discerning protect the mind, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp36:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp36:4",
    "pali": "cittaṁ guttaṁ sukhāvahaṁ.",
    "words": [
      {
        "w": "cittaṁ",
        "gloss": "the mind (nom.)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. citta²"
      },
      {
        "w": "guttaṁ",
        "gloss": "guarded, protected, watched over (gutta pp of gopeti 'to guard')",
        "gram": "pp., nom. sg. nt.",
        "ped": "PED s.v. gutta"
      },
      {
        "w": "sukhāvahaṁ.",
        "gloss": "= sukha + āvaha: 'bringing happiness' (as at 35:4)",
        "gram": "cpd. adj., nom. sg. nt.",
        "ped": "PED s.v. sukha; s.v. āvaha"
      }
    ],
    "translation": {
      "text": "a guarded mind leads to bliss. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp36:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp37:0",
    "pali": "Saṅgharakkhitabhāgineyyattheravatthu",
    "words": [
      {
        "w": "Saṅgharakkhitabhāgineyyattheravatthu",
        "gloss": "= Saṅgharakkhita + bhāgineyya + thera + vatthu: 'the story of the Elder who was Saṅgharakkhita's nephew' (Saṅgharakkhita, a name; bhāgineyya 'sister's son, nephew'; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. bhāgineyya; s.v. thera"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp37:1",
    "pali": "Dūraṅgamaṁ ekacaraṁ,",
    "words": [
      {
        "w": "Dūraṅgamaṁ",
        "gloss": "= dūra + (ṅ)gama: 'travelling far, far-ranging' (dūra 'far, distant' + gama 'going', from gacchati); of the mind that roams to distant objects",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. dūra; s.v. gama (dūraṅgama)"
      },
      {
        "w": "ekacaraṁ,",
        "gloss": "= eka + cara: 'wandering alone, moving solitary' (eka 'one, alone' + cara 'moving, roaming', from carati)",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. eka; s.v. cara"
      }
    ],
    "translation": {
      "text": "The mind travels far, wandering alone; ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp37:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp37:2",
    "pali": "asarīraṁ guhāsayaṁ;",
    "words": [
      {
        "w": "asarīraṁ",
        "gloss": "bodiless, incorporeal, formless (a + sarīra 'body')",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. sarīra (a°)"
      },
      {
        "w": "guhāsayaṁ;",
        "gloss": "= guhā + saya: 'lying in a cave, hidden in the cavern' (guhā 'cave, cavern' + saya 'lying, resting', from seti/sayati); the 'cave' is traditionally the heart (hadaya)",
        "gram": "cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. guhā; s.v. saya"
      }
    ],
    "translation": {
      "text": "incorporeal, it lies hidden in the heart. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp37:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp37:3",
    "pali": "Ye cittaṁ saṁyamissanti,",
    "words": [
      {
        "w": "Ye",
        "gloss": "those who (relative)",
        "gram": "rel. pron., nom. pl. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "cittaṁ",
        "gloss": "the mind (acc.)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. citta²"
      },
      {
        "w": "saṁyamissanti,",
        "gloss": "will restrain, will control (future of saṁyamati, saṁ + √yam)",
        "gram": "fut. 3 pl. of saṁyamati (saṁ + √yam)",
        "ped": "PED s.v. saṁyamati"
      }
    ],
    "translation": {
      "text": "Those who will restrain the mind ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp37:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp37:4",
    "pali": "mokkhanti mārabandhanā.",
    "words": [
      {
        "w": "mokkhanti",
        "gloss": "they will be freed, will be released (future of muccati 'to be freed', √muc)",
        "gram": "fut. 3 pl. of muccati (√muc)",
        "ped": "PED s.v. muccati (mokkhati)"
      },
      {
        "w": "mārabandhanā.",
        "gloss": "= māra + bandhana: 'from the bond(s) of Māra' (māra + bandhana 'bond, fetter'); ablative 'from Māra's bondage'",
        "gram": "tappurisa cpd. nt., abl. sg.",
        "ped": "PED s.v. māra; s.v. bandhana"
      }
    ],
    "translation": {
      "text": "are freed from Māra’s bonds. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp37:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp38:0",
    "pali": "Cittahatthattheravatthu",
    "words": [
      {
        "w": "Cittahatthattheravatthu",
        "gloss": "= Cittahattha + thera + vatthu: 'the story of the Elder Cittahattha' (a monk who repeatedly disrobed and returned; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp38:1",
    "pali": "Anavaṭṭhitacittassa,",
    "words": [
      {
        "w": "Anavaṭṭhitacittassa,",
        "gloss": "= an + avaṭṭhita + citta: 'of one whose mind is unsteady/not settled' (an- 'not' + avaṭṭhita 'settled, fixed', pp of avatiṭṭhati + citta 'mind'); gen. sg.",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. avaṭṭhita; s.v. citta²"
      }
    ],
    "translation": {
      "text": "Those of unsteady mind, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp38:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp38:2",
    "pali": "saddhammaṁ avijānato;",
    "words": [
      {
        "w": "saddhammaṁ",
        "gloss": "= sad(t) + dhamma: 'the true teaching, the good Dhamma' (sant 'true, good, real' + dhamma)",
        "gram": "cpd. m., acc. sg.",
        "ped": "PED s.v. saddhamma"
      },
      {
        "w": "avijānato;",
        "gloss": "of one not understanding/not knowing (a + vijānant, pres. part. of vijānāti); gen. sg. agreeing",
        "gram": "neg. ppr., gen. sg. m. (vijānant)",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "who don’t understand the true teaching, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp38:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp38:3",
    "pali": "Pariplavapasādassa,",
    "words": [
      {
        "w": "Pariplavapasādassa,",
        "gloss": "= pariplava + pasāda: 'of one whose confidence/faith is wavering' (pariplava 'moving to and fro, unsteady, fluctuating' + pasāda 'faith, serene confidence, trust'); gen. sg.",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. pariplava; s.v. pasāda"
      }
    ],
    "translation": {
      "text": "and whose confidence wavers, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp38:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp38:4",
    "pali": "paññā na paripūrati.",
    "words": [
      {
        "w": "paññā",
        "gloss": "wisdom, understanding, insight (paññā)",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. paññā"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "paripūrati.",
        "gloss": "becomes full, is fulfilled/perfected, reaches completion (pari + √pūr)",
        "gram": "pres. 3 sg. of paripūrati (pari + √pūr)",
        "ped": "PED s.v. paripūrati"
      }
    ],
    "translation": {
      "text": "do not perfect their wisdom. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp38:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp39:1",
    "pali": "Anavassutacittassa,",
    "words": [
      {
        "w": "Anavassutacittassa,",
        "gloss": "= an + avassuta + citta: 'of one whose mind is not oozing/not lustful, free of the inflows' (an- 'not' + avassuta 'flowing with, soaked, lustful', pp of avassavati 'to flow into' + citta); gen. sg. Sujato: 'not festering'.",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. avassuta; s.v. citta²"
      }
    ],
    "translation": {
      "text": "One whose mind is not festering, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp39:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp39:2",
    "pali": "ananvāhatacetaso;",
    "words": [
      {
        "w": "ananvāhatacetaso;",
        "gloss": "= an + anvāhata + cetas: 'of undisturbed/unassailed heart, whose mind is unstruck' (an- 'not' + anvāhata 'struck, assailed', pp of anvāhanati, anu + ā + √han + cetas 'mind, heart', -s stem); gen. sg.",
        "gram": "bahubbīhi cpd. (cetas stem), gen. sg. m.",
        "ped": "PED s.v. anvāhata; s.v. ceto (cetas)"
      }
    ],
    "translation": {
      "text": "whose heart is undamaged, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp39:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp39:3",
    "pali": "Puññapāpapahīnassa,",
    "words": [
      {
        "w": "Puññapāpapahīnassa,",
        "gloss": "= puñña + pāpa + pahīna: 'of one who has abandoned both merit and evil, good and bad' (puñña 'merit, good' + pāpa 'evil, bad' + pahīna 'given up', pp of pajahati); gen. sg. — beyond both wholesome and unwholesome kamma",
        "gram": "bahubbīhi cpd., gen. sg. m.",
        "ped": "PED s.v. puñña; s.v. pāpa; s.v. pahīna"
      }
    ],
    "translation": {
      "text": "who’s given up right and wrong, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp39:3, verbatim"
    },
    "notes": "'given up merit and evil' (puñña-pāpa-pahīna): the arahant is described as beyond both good and bad kamma — reported as the text's own idiom for one who no longer generates kamma of either kind, not as a licence for wrongdoing.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp39:4",
    "pali": "natthi jāgarato bhayaṁ.",
    "words": [
      {
        "w": "natthi",
        "gloss": "= na + atthi: 'there is not' (na 'not' + atthi 'is')",
        "gram": "neg. + pres. 3 sg. of atthi (√as)",
        "ped": "PED s.v. na¹; s.v. atthi"
      },
      {
        "w": "jāgarato",
        "gloss": "for the wakeful/watchful one, of one who is awake (gen. of jāgarant, pres. part. of jāgarati 'to be awake, watchful')",
        "gram": "ppr., gen. sg. m. (jāgarant)",
        "ped": "PED s.v. jāgarati"
      },
      {
        "w": "bhayaṁ.",
        "gloss": "fear, danger (bhaya)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. bhaya"
      }
    ],
    "translation": {
      "text": "alert, has nothing to fear. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp39:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp40:0",
    "pali": "Pañcasatabhikkhuvatthu",
    "words": [
      {
        "w": "Pañcasatabhikkhuvatthu",
        "gloss": "= pañcasata + bhikkhu + vatthu: 'the story of the five hundred monks' (pañca 'five' + sata 'hundred' + bhikkhu 'monk')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. pañca; s.v. sata; s.v. bhikkhu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp40:1",
    "pali": "Kumbhūpamaṁ kāyamimaṁ viditvā,",
    "words": [
      {
        "w": "Kumbhūpamaṁ",
        "gloss": "= kumbha + upama: 'like a pot/jar, comparable to an earthen pot' (kumbha 'water-pot, jar' + upama 'resembling, like'); of the fragile body, u → ū in sandhi",
        "gram": "cpd. adj., acc. sg. m. (agreeing with kāyaṁ)",
        "ped": "PED s.v. kumbha; s.v. upama"
      },
      {
        "w": "kāyamimaṁ",
        "gloss": "= kāyaṁ + imaṁ (sandhi -ṁ + i- → -m-i-): 'this body' (kāya 'body' + imaṁ 'this')",
        "gram": "kāyaṁ: m., acc. sg.; imaṁ: dem. pron., acc. sg. m.",
        "ped": "PED s.v. kāya; s.v. ayaṁ (imaṁ)"
      },
      {
        "w": "viditvā,",
        "gloss": "having known, having understood (absolutive of vindati/vedeti 'to know', √vid)",
        "gram": "ger. (absol.) of vindati (√vid)",
        "ped": "PED s.v. vindati (viditvā)"
      }
    ],
    "translation": {
      "text": "Knowing this body breaks like a pot, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp40:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp40:2",
    "pali": "Nagarūpamaṁ cittamidaṁ ṭhapetvā;",
    "words": [
      {
        "w": "Nagarūpamaṁ",
        "gloss": "= nagara + upama: 'like a city/citadel, comparable to a fortified town' (nagara 'city, fortress' + upama 'like'); u → ū in sandhi",
        "gram": "cpd. adj., acc. sg. nt. (agreeing with cittaṁ)",
        "ped": "PED s.v. nagara; s.v. upama"
      },
      {
        "w": "cittamidaṁ",
        "gloss": "= cittaṁ + idaṁ (sandhi -ṁ + i- → -m-i-): 'this mind' (citta + idaṁ 'this')",
        "gram": "cittaṁ: nt., acc. sg.; idaṁ: dem. pron., acc. sg. nt.",
        "ped": "PED s.v. citta²; s.v. ayaṁ (idaṁ)"
      },
      {
        "w": "ṭhapetvā;",
        "gloss": "having set up, having established/made firm (absolutive of ṭhapeti 'to place, set up', caus. of tiṭṭhati)",
        "gram": "ger. (absol.) of ṭhapeti (caus. √ṭhā)",
        "ped": "PED s.v. ṭhapeti"
      }
    ],
    "translation": {
      "text": "and fortifying the mind like a citadel, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp40:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp40:3",
    "pali": "Yodhetha māraṁ paññāvudhena,",
    "words": [
      {
        "w": "Yodhetha",
        "gloss": "should fight, should do battle with (optative-imperative medial of yodheti 'to fight, combat', from yudhyati √yudh)",
        "gram": "opt./imper. med. 2 sg. of yodheti (√yudh)",
        "ped": "PED s.v. yodheti"
      },
      {
        "w": "māraṁ",
        "gloss": "Māra (acc.), the Tempter-Death",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. māra"
      },
      {
        "w": "paññāvudhena,",
        "gloss": "= paññā + āvudha: 'with the weapon of wisdom' (paññā 'wisdom' + āvudha 'weapon'; ā + ā → ā in the compound)",
        "gram": "instr. cpd. nt., instr. sg.",
        "ped": "PED s.v. paññā; s.v. āvudha"
      }
    ],
    "translation": {
      "text": "attack Māra with the sword of wisdom, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp40:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp40:4",
    "pali": "Jitañca rakkhe anivesano siyā.",
    "words": [
      {
        "w": "Jitañca",
        "gloss": "= jitaṁ + ca (sandhi -ṁ + c- → -ñ-c-): 'and what has been won/conquered' (jita pp of jināti 'conquered' + ca)",
        "gram": "jitaṁ: pp., acc. sg. nt.; ca: conj.",
        "ped": "PED s.v. jita; s.v. ca"
      },
      {
        "w": "rakkhe",
        "gloss": "should guard, should protect (optative 3 sg. of rakkhati)",
        "gram": "opt. 3 sg. of rakkhati (√rakkh)",
        "ped": "PED s.v. rakkhati"
      },
      {
        "w": "anivesano",
        "gloss": "not settling down, without attachment/resting-place, unentrenched (a + nivesana 'settling, abode, attachment'); one who takes up no fixed dwelling/clinging",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. nivesana (a°)"
      },
      {
        "w": "siyā.",
        "gloss": "may be, should be (optative 3 sg. of atthi 'to be', √as)",
        "gram": "opt. 3 sg. of atthi (√as)",
        "ped": "PED s.v. atthi (siyā)"
      }
    ],
    "translation": {
      "text": "guard your conquest, and never settle. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp40:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp41:0",
    "pali": "Pūtigattatissattheravatthu",
    "words": [
      {
        "w": "Pūtigattatissattheravatthu",
        "gloss": "= pūtigatta + Tissa + thera + vatthu: 'the story of the Elder Tissa of the putrid body' (pūti 'rotten, putrid' + gatta 'limb, body' + Tissa, a name; thera 'elder')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. pūti; s.v. gatta; s.v. thera"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp41:1",
    "pali": "Aciraṁ vatayaṁ kāyo,",
    "words": [
      {
        "w": "Aciraṁ",
        "gloss": "before long, soon, in no long time (a + cira 'long time' → 'not long')",
        "gram": "adv. (acc. of acira)",
        "ped": "PED s.v. acira"
      },
      {
        "w": "vatayaṁ",
        "gloss": "= vata + ayaṁ (sandhi -a + a- → -ay-): 'alas, indeed' + 'this' (vata 'surely, alas', an emphatic particle of pathos; ayaṁ 'this')",
        "gram": "vata: indecl. (emph.); ayaṁ: dem. pron., nom. sg. m.",
        "ped": "PED s.v. vata¹; s.v. ayaṁ"
      },
      {
        "w": "kāyo,",
        "gloss": "the body (kāya)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. kāya"
      }
    ],
    "translation": {
      "text": "All too soon this body ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp41:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp41:2",
    "pali": "pathaviṁ adhisessati;",
    "words": [
      {
        "w": "pathaviṁ",
        "gloss": "the earth, the ground (pathavī); acc. of the place lain on",
        "gram": "f., acc. sg. (pathavī)",
        "ped": "PED s.v. pathavī"
      },
      {
        "w": "adhisessati;",
        "gloss": "will lie upon, will lie down on (adhi + √śī 'to lie'); future of adhiseti",
        "gram": "fut. 3 sg. of adhiseti (adhi + √sī)",
        "ped": "PED s.v. adhiseti"
      }
    ],
    "translation": {
      "text": "will lie upon the earth, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp41:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp41:3",
    "pali": "Chuddho apetaviññāṇo,",
    "words": [
      {
        "w": "Chuddho",
        "gloss": "thrown away, discarded, cast off (chuddha, pp; 'flung aside')",
        "gram": "pp., nom. sg. m.",
        "ped": "PED s.v. chuddha"
      },
      {
        "w": "apetaviññāṇo,",
        "gloss": "= apeta + viññāṇa: 'bereft of consciousness, with consciousness gone' (apeta 'gone away, devoid of', pp of apeti + viññāṇa 'consciousness')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. apeta; s.v. viññāṇa"
      }
    ],
    "translation": {
      "text": "bereft of consciousness, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp41:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp41:4",
    "pali": "niratthaṁva kaliṅgaraṁ.",
    "words": [
      {
        "w": "niratthaṁva",
        "gloss": "= niratthaṁ + va (= iva 'like'): 'like a useless (thing)' (niratthaṁ = nir 'without' + attha 'use, purpose, good' → 'useless, profitless')",
        "gram": "niratthaṁ: adj., acc. sg. nt.; va: indecl. (= iva)",
        "ped": "PED s.v. niratthaṁ; s.v. iva"
      },
      {
        "w": "kaliṅgaraṁ.",
        "gloss": "a log, a block of wood, a useless piece of timber (kaliṅgara)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. kaliṅgara"
      }
    ],
    "translation": {
      "text": "tossed aside like a worthless log. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp41:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp42:0",
    "pali": "Nandagopālakavatthu",
    "words": [
      {
        "w": "Nandagopālakavatthu",
        "gloss": "= Nanda + gopālaka + vatthu: 'the story of Nanda the cowherd' (Nanda, a name; gopālaka 'cowherd, herdsman')",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. gopālaka; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp42:1",
    "pali": "Diso disaṁ yaṁ taṁ kayirā,",
    "words": [
      {
        "w": "Diso",
        "gloss": "an enemy, foe (disa 'enemy'); nom. sg.",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. disa¹"
      },
      {
        "w": "disaṁ",
        "gloss": "to/against an enemy (disa 'enemy'); acc. sg.",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. disa¹"
      },
      {
        "w": "yaṁ",
        "gloss": "whatever (relative, correlative with taṁ)",
        "gram": "rel. pron., acc. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "taṁ",
        "gloss": "that (correlative)",
        "gram": "dem. pron., acc. sg. nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "kayirā,",
        "gloss": "might do, would do (optative 3 sg. of karoti)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti (kayirā)"
      }
    ],
    "translation": {
      "text": "A wrongly directed mind ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp42:1, verbatim"
    },
    "notes": "Lines 42:1–42:2 form a double simile ('whatever an enemy would do to an enemy, or a hater to the hated') whose apodosis is 42:3–42:4: a wrongly-aimed mind does one worse harm than any of these. The syntax runs across the whole quatrain.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp42:2",
    "pali": "verī vā pana verinaṁ;",
    "words": [
      {
        "w": "verī",
        "gloss": "a hostile person, one full of enmity (verin, from vera 'hatred'); nom. sg.",
        "gram": "adj. as subst. (poss. -in stem), nom. sg. m.",
        "ped": "PED s.v. verin"
      },
      {
        "w": "vā",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      },
      {
        "w": "pana",
        "gloss": "moreover, but, and (a connective/adversative particle)",
        "gram": "indecl. (particle)",
        "ped": "PED s.v. pana"
      },
      {
        "w": "verinaṁ;",
        "gloss": "to/against a hostile person, an enemy (verin, acc.)",
        "gram": "adj. as subst. (poss. -in stem), acc. sg. m.",
        "ped": "PED s.v. verin"
      }
    ],
    "translation": {
      "text": "would do you more harm ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp42:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp42:3",
    "pali": "Micchāpaṇihitaṁ cittaṁ,",
    "words": [
      {
        "w": "Micchāpaṇihitaṁ",
        "gloss": "= micchā + paṇihita: 'wrongly directed/aimed, ill-disposed' (micchā 'wrongly, falsely' + paṇihita 'directed, applied, set', pp of paṇidahati 'to direct, aspire')",
        "gram": "cpd. pp., nom. sg. nt.",
        "ped": "PED s.v. micchā; s.v. paṇihita"
      },
      {
        "w": "cittaṁ,",
        "gloss": "the mind (nom.)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "than a hater to the hated, ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp42:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp42:4",
    "pali": "pāpiyo naṁ tato kare.",
    "words": [
      {
        "w": "pāpiyo",
        "gloss": "worse, more evil (comparative of pāpa 'bad')",
        "gram": "adj. (compar.), acc. sg. nt.",
        "ped": "PED s.v. pāpiya"
      },
      {
        "w": "naṁ",
        "gloss": "him, that one (enclitic acc. pronoun)",
        "gram": "encl. pron., acc. sg. m.",
        "ped": "PED s.v. naṁ"
      },
      {
        "w": "tato",
        "gloss": "than that (ablative of comparison: 'more than that [enemy would]')",
        "gram": "adv. (abl. of ta)",
        "ped": "PED s.v. tato"
      },
      {
        "w": "kare.",
        "gloss": "would make/do (optative 3 sg. of karoti)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti (kare)"
      }
    ],
    "translation": {
      "text": "or an enemy to their foe. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp42:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:0",
    "pali": "Soreyyavatthu",
    "words": [
      {
        "w": "Soreyyavatthu",
        "gloss": "= Soreyya + vatthu: 'the story of Soreyya' (the merchant's son who changed sex and back; a personal name)",
        "gram": "cpd. proper name, nom. sg. nt. (commentarial rubric)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:1",
    "pali": "Na taṁ mātā pitā kayirā,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na¹"
      },
      {
        "w": "taṁ",
        "gloss": "that (correlative)",
        "gram": "dem. pron., acc. sg. nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "mātā",
        "gloss": "mother",
        "gram": "f., nom. sg. (mātar)",
        "ped": "PED s.v. mātar"
      },
      {
        "w": "pitā",
        "gloss": "father",
        "gram": "m., nom. sg. (pitar)",
        "ped": "PED s.v. pitar"
      },
      {
        "w": "kayirā,",
        "gloss": "would do (optative 3 sg. of karoti)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti (kayirā)"
      }
    ],
    "translation": {
      "text": "A rightly directed mind ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp43:1, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:2",
    "pali": "aññe vāpi ca ñātakā;",
    "words": [
      {
        "w": "aññe",
        "gloss": "others, other (people)",
        "gram": "pron. adj., nom. pl. m.",
        "ped": "PED s.v. añña"
      },
      {
        "w": "vāpi",
        "gloss": "= vā + api: 'or even, or also' (vā 'or' + api 'even')",
        "gram": "indecl. (vā + api)",
        "ped": "PED s.v. vā; s.v. api"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "ñātakā;",
        "gloss": "relatives, kinsmen (ñātaka 'kinsman', from ñāti)",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. ñātaka"
      }
    ],
    "translation": {
      "text": "would do you more good ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp43:2, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:3",
    "pali": "Sammāpaṇihitaṁ cittaṁ,",
    "words": [
      {
        "w": "Sammāpaṇihitaṁ",
        "gloss": "= sammā + paṇihita: 'rightly directed/aimed, well-disposed' (sammā 'rightly' + paṇihita 'directed, set', pp of paṇidahati)",
        "gram": "cpd. pp., nom. sg. nt.",
        "ped": "PED s.v. sammā; s.v. paṇihita"
      },
      {
        "w": "cittaṁ,",
        "gloss": "the mind (nom.)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. citta²"
      }
    ],
    "translation": {
      "text": "than your mother or father ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp43:3, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:4",
    "pali": "seyyaso naṁ tato kare.",
    "words": [
      {
        "w": "seyyaso",
        "gloss": "better, superior, more excellent (comparative; seyya 'better'); 'would make him better'",
        "gram": "adj. (compar.), acc. sg. nt.",
        "ped": "PED s.v. seyya (seyyaso)"
      },
      {
        "w": "naṁ",
        "gloss": "him",
        "gram": "encl. pron., acc. sg. m.",
        "ped": "PED s.v. naṁ"
      },
      {
        "w": "tato",
        "gloss": "than that (abl. of comparison)",
        "gram": "adv. (abl. of ta)",
        "ped": "PED s.v. tato"
      },
      {
        "w": "kare.",
        "gloss": "would make (optative 3 sg. of karoti)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti (kare)"
      }
    ],
    "translation": {
      "text": "or any other relative. ",
      "source": "Sujato, SuttaCentral (Bilara, CC0 1.0), dhp43:4, verbatim"
    },
    "notes": null,
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp43:5",
    "pali": "Cittavaggo tatiyo.",
    "words": [
      {
        "w": "Cittavaggo",
        "gloss": "= citta + vagga: the Chapter on the Mind (as inflected noun)",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. citta²; s.v. vagga"
      },
      {
        "w": "tatiyo.",
        "gloss": "third — 'the Mind, the third (chapter)'",
        "gram": "ordinal adj., nom. sg. m.",
        "ped": "PED s.v. tatiya"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Chapter on the Mind, the third'); no Sujato segment, translation null.",
    "section": "3. The Mind · Cittavagga (Dhp 33–43)"
  },
  {
    "ref": "dhp44:0.1",
    "pali": "Khuddakanikāya",
    "words": [
      {
        "w": "Khuddakanikāya",
        "gloss": "= khuddaka + nikāya: the Minor (or Short) Collection, the fifth of the five Nikāyas of the Sutta Piṭaka, in which the Dhammapada is included",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. khuddaka; s.v. nikāya"
      }
    ],
    "translation": {
      "text": "Minor Collection ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:0.1, verbatim"
    },
    "notes": "Header segment (edition/collection apparatus).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:0.2",
    "pali": "Dhammapada",
    "words": [
      {
        "w": "Dhammapada",
        "gloss": "= dhamma + pada: the title of the collection. dhamma = the teaching, truth, law, or a phenomenon; pada = foot, step, path, state, word, or a line/foot of verse — so the title reads either 'Words/Verses of the Dhamma' or 'the Path/State of Dhamma'. Both construals are old and neither is decisive",
        "gram": "tappurisa cpd., nom. sg. nt. (title)",
        "ped": "PED s.v. dhamma; s.v. pada"
      }
    ],
    "translation": {
      "text": "Sayings of the Dhamma 44–59 ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:0.2, verbatim"
    },
    "notes": "Title segment. The title itself is ambiguous (see gloss); rendered by Sujato as 'Sayings of the Dhamma'.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:0.3",
    "pali": "Pupphavagga",
    "words": [
      {
        "w": "Pupphavagga",
        "gloss": "= puppha + vagga: the 'Flowers Chapter' — puppha 'flower, blossom' + vagga 'section, chapter, group'",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. puppha; s.v. vagga"
      }
    ],
    "translation": {
      "text": "4. Flowers ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:0.3, verbatim"
    },
    "notes": "Chapter title. Pupphavagga is the fourth vagga of the Dhammapada (verses 44–59), grouped by the recurring flower/garland/fragrance similes.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:0.4",
    "pali": "Pathavikathāpasutapañcasatabhikkhuvatthu",
    "words": [
      {
        "w": "Pathavikathāpasutapañcasatabhikkhuvatthu",
        "gloss": "= pathavī + kathā + pasuta + pañcasata + bhikkhu + vatthu: 'the story of the five hundred monks engaged in talk about the earth' — pathavī 'earth' + kathā 'talk' + pasuta 'intent on, engaged in' + pañcasata 'five hundred' + bhikkhu 'monk' + vatthu 'story, basis, ground'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. pathavī; s.v. kathā; s.v. pasuta; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu) from the Dhammapada-aṭṭhakathā, carried in the Mahāsaṅgīti apparatus as a segment but not part of the verse text; Sujato does not translate the vatthu titles, so the translation is null here by fidelity to the source, not omission.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:1",
    "pali": "Ko imaṁ pathaviṁ vicessati,",
    "words": [
      {
        "w": "Ko",
        "gloss": "who? (interrogative pronoun)",
        "gram": "interr. pron., nom. sg. m.",
        "ped": "PED s.v. ka¹"
      },
      {
        "w": "imaṁ",
        "gloss": "this",
        "gram": "dem. pron., acc. sg. f. (agreeing with pathaviṁ)",
        "ped": "PED s.v. ima"
      },
      {
        "w": "pathaviṁ",
        "gloss": "the earth, the ground",
        "gram": "f., acc. sg.",
        "ped": "PED s.v. pathavī"
      },
      {
        "w": "vicessati,",
        "gloss": "will investigate, sift, discern, master — from vicināti 'to search, sift, select' (vi + √ci); the commentary glosses it 'will comprehend' (vijānissati). Variant vijessati 'will conquer'",
        "gram": "fut. 3 sg. of vicināti (vi + √ci)",
        "ped": "PED s.v. vicināti"
      }
    ],
    "translation": {
      "text": "Who bestirs this earth, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:1, verbatim"
    },
    "notes": "The opening riddle of the vagga. vicessati 'will investigate/sift/discern' (fut. of vicināti) deliberately echoes pacessati 'will cull [a flower]' (fut. of pacināti) at 44:4 — a built-in pun: who will 'sift' this earth as an expert 'culls' a flower? A well-attested variant reads vijessati 'will conquer/master' (sya-all, pts1ed, pts2ed); both are reported, neither resolved.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:2",
    "pali": "Yamalokañca imaṁ sadevakaṁ;",
    "words": [
      {
        "w": "Yamalokañca",
        "gloss": "= yamalokaṁ + ca (sandhi -ṁ + c- > -ñc-): 'and the world of Yama' — yama, the lord of the dead + loka 'world, realm'",
        "gram": "tappurisa cpd., acc. sg. m. + conj.",
        "ped": "PED s.v. yama; s.v. loka; s.v. ca"
      },
      {
        "w": "imaṁ",
        "gloss": "this",
        "gram": "dem. pron., acc. sg. m. (agreeing with yamalokaṁ)",
        "ped": "PED s.v. ima"
      },
      {
        "w": "sadevakaṁ;",
        "gloss": "= sa + deva + -ka: together with its gods, including the deva realms ('with-its-gods')",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. sa³; s.v. deva"
      }
    ],
    "translation": {
      "text": "and the Yama realm with its gods? ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:3",
    "pali": "Ko dhammapadaṁ sudesitaṁ,",
    "words": [
      {
        "w": "Ko",
        "gloss": "who?",
        "gram": "interr. pron., nom. sg. m.",
        "ped": "PED s.v. ka¹"
      },
      {
        "w": "dhammapadaṁ",
        "gloss": "= dhamma + pada: the well-taught word/path of truth — a 'line of the doctrine' or the state of Dhamma; the very phrase that names the book",
        "gram": "tappurisa cpd., acc. sg. nt.",
        "ped": "PED s.v. dhamma; s.v. pada"
      },
      {
        "w": "sudesitaṁ,",
        "gloss": "= su + desita: well-taught, well-expounded (su 'well' + desita, pp. of deseti 'to point out, teach')",
        "gram": "pp. cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. deseti"
      }
    ],
    "translation": {
      "text": "Who sets out the well-taught word of truth, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp44:4",
    "pali": "Kusalo pupphamiva pacessati.",
    "words": [
      {
        "w": "Kusalo",
        "gloss": "skilful, an expert (kusala 'skilled, clever'); here the skilled garland-maker or flower-gatherer",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. kusala"
      },
      {
        "w": "pupphamiva",
        "gloss": "= pupphaṁ + iva (sandhi -ṁ + i- written -m-i-): 'like a flower' (puppha 'flower' + iva 'as, like')",
        "gram": "pupphaṁ: nt., acc. sg.; iva: indecl. (compar. particle)",
        "ped": "PED s.v. puppha; s.v. iva"
      },
      {
        "w": "pacessati.",
        "gloss": "will pick, gather, cull — future of pacināti 'to gather, pluck' (pa + √ci); the deliberate sound-echo of vicessati",
        "gram": "fut. 3 sg. of pacināti (pa + √ci)",
        "ped": "PED s.v. pacināti"
      }
    ],
    "translation": {
      "text": "as an expert a flower? ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp44:4, verbatim"
    },
    "notes": "The flower half of the pun (see 44:1). Variant pupphamivappacessati (pts2ed, mr) fuses -iva with pacessati.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp45:1",
    "pali": "Sekho pathaviṁ vicessati,",
    "words": [
      {
        "w": "Sekho",
        "gloss": "a trainee, a disciple in higher training (one of the seven sekha, not yet an arahant); from sikkhati 'to train'",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. sekha"
      },
      {
        "w": "pathaviṁ",
        "gloss": "the earth",
        "gram": "f., acc. sg.",
        "ped": "PED s.v. pathavī"
      },
      {
        "w": "vicessati,",
        "gloss": "will investigate, discern, master (see dhp44:1)",
        "gram": "fut. 3 sg. of vicināti (vi + √ci)",
        "ped": "PED s.v. vicināti"
      }
    ],
    "translation": {
      "text": "A trainee bestirs this earth, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp45:1, verbatim"
    },
    "notes": "Verse 45 answers verse 44's riddle: the sekha (trainee) is the one who will master the earth. The shared vocabulary of 44 is glossed again in full here (this verse text does not use the wing's peyyāla/refrain model, which is reserved for the prose suttas).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp45:2",
    "pali": "Yamalokañca imaṁ sadevakaṁ;",
    "words": [
      {
        "w": "Yamalokañca",
        "gloss": "= yamalokaṁ + ca: 'and the world of Yama'",
        "gram": "tappurisa cpd., acc. sg. m. + conj.",
        "ped": "PED s.v. yama; s.v. loka; s.v. ca"
      },
      {
        "w": "imaṁ",
        "gloss": "this",
        "gram": "dem. pron., acc. sg. m.",
        "ped": "PED s.v. ima"
      },
      {
        "w": "sadevakaṁ;",
        "gloss": "with its gods",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. sa³; s.v. deva"
      }
    ],
    "translation": {
      "text": "and the Yama realm with its gods. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp45:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp45:3",
    "pali": "Sekho dhammapadaṁ sudesitaṁ,",
    "words": [
      {
        "w": "Sekho",
        "gloss": "a trainee (see dhp45:1)",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. sekha"
      },
      {
        "w": "dhammapadaṁ",
        "gloss": "= dhamma + pada: the well-taught word of truth",
        "gram": "tappurisa cpd., acc. sg. nt.",
        "ped": "PED s.v. dhamma; s.v. pada"
      },
      {
        "w": "sudesitaṁ,",
        "gloss": "well-taught",
        "gram": "pp. cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. su; s.v. deseti"
      }
    ],
    "translation": {
      "text": "A trainee sets out the well-taught word of truth, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp45:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp45:4",
    "pali": "Kusalo pupphamiva pacessati.",
    "words": [
      {
        "w": "Kusalo",
        "gloss": "skilful, an expert",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. kusala"
      },
      {
        "w": "pupphamiva",
        "gloss": "= pupphaṁ + iva: 'like a flower'",
        "gram": "pupphaṁ: nt., acc. sg.; iva: indecl.",
        "ped": "PED s.v. puppha; s.v. iva"
      },
      {
        "w": "pacessati.",
        "gloss": "will cull, gather",
        "gram": "fut. 3 sg. of pacināti (pa + √ci)",
        "ped": "PED s.v. pacināti"
      }
    ],
    "translation": {
      "text": "as an expert a flower. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp45:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp46:0",
    "pali": "Marīcikammaṭṭhānikabhikkhuvatthu",
    "words": [
      {
        "w": "Marīcikammaṭṭhānikabhikkhuvatthu",
        "gloss": "= marīci + kammaṭṭhāna + -ika + bhikkhu + vatthu: 'the story of the monk whose meditation-subject was the mirage' — marīci 'mirage, shimmer, mote in a sunbeam' + kammaṭṭhāna 'meditation subject, working-ground' + bhikkhu 'monk' + vatthu 'story'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. marīci; s.v. kammaṭṭhāna; s.v. bhikkhu; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); Sujato does not translate it, so translation is null.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp46:1",
    "pali": "Pheṇūpamaṁ kāyamimaṁ viditvā,",
    "words": [
      {
        "w": "Pheṇūpamaṁ",
        "gloss": "= pheṇa + upama (sandhi a + u > ū): 'foam-like, having foam as its likeness' — pheṇa 'foam, froth' + upama 'like, resembling; a simile'",
        "gram": "bahubbīhi cpd. adj., acc. sg. m. (agreeing with kāyaṁ)",
        "ped": "PED s.v. pheṇa; s.v. upama"
      },
      {
        "w": "kāyamimaṁ",
        "gloss": "= kāyaṁ + imaṁ (sandhi -ṁ + i- written -m-i-): 'this body' (kāya 'body' + ima 'this')",
        "gram": "kāyaṁ: m., acc. sg.; imaṁ: dem. pron., acc. sg. m.",
        "ped": "PED s.v. kāya; s.v. ima"
      },
      {
        "w": "viditvā,",
        "gloss": "having known, understood (absolutive of vindati 'to know, find', √vid)",
        "gram": "ger. (absol.) of vindati (√vid)",
        "ped": "PED s.v. vindati"
      }
    ],
    "translation": {
      "text": "Knowing this body’s like foam, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp46:1, verbatim"
    },
    "notes": "The body-as-foam simile (cf. the Pheṇapiṇḍūpama Sutta, SN 22.95). Pheṇūpama is a bahubbīhi — 'having foam as its likeness'.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp46:2",
    "pali": "Marīcidhammaṁ abhisambudhāno;",
    "words": [
      {
        "w": "Marīcidhammaṁ",
        "gloss": "= marīci + dhamma: 'having the nature of a mirage' — marīci 'mirage' + dhamma here 'nature, quality'",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. marīci; s.v. dhamma"
      },
      {
        "w": "abhisambudhāno;",
        "gloss": "fully awakening to, thoroughly understanding (present middle participle of abhisambujjhati, abhi + saṁ + √budh)",
        "gram": "pres. med. part. of abhisambujjhati, nom. sg. m.",
        "ped": "PED s.v. abhisambujjhati"
      }
    ],
    "translation": {
      "text": "realizing it’s all just a mirage, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp46:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp46:3",
    "pali": "Chetvāna mārassa papupphakāni,",
    "words": [
      {
        "w": "Chetvāna",
        "gloss": "having cut off, severed (absolutive of chindati 'to cut', √chid; the -āna absolutive, poetic)",
        "gram": "ger. (absol.) of chindati (√chid)",
        "ped": "PED s.v. chindati"
      },
      {
        "w": "mārassa",
        "gloss": "of Māra (the personification of death and temptation)",
        "gram": "m., gen. sg.",
        "ped": "PED s.v. māra"
      },
      {
        "w": "papupphakāni,",
        "gloss": "the flower-arrows / the blossoming — papupphaka; either Māra's flower-tipped arrows (commentary) or the 'blossoming' of existence (see note). Variant sapupphakāni",
        "gram": "nt., acc. pl.",
        "ped": "PED s.v. papupphaka"
      }
    ],
    "translation": {
      "text": "and cutting off Māra’s blossoming, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp46:3, verbatim"
    },
    "notes": "papupphakāni continues the flower motif: contested both ways — the commentary reads Māra's 'flower-tipped arrows' (the defilements, esp. the arrows of Kāma-Māra), while the word can also be taken as 'the flowering/blossoming (of continued existence)' that one cuts off. Variant sapupphakāni (ṭīkā). Both reported; neither resolved.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp46:4",
    "pali": "Adassanaṁ maccurājassa gacche.",
    "words": [
      {
        "w": "Adassanaṁ",
        "gloss": "out of sight, the invisible/unseen (a + dassana 'seeing'); acc. of goal, 'to where he is unseen'",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. dassana"
      },
      {
        "w": "maccurājassa",
        "gloss": "= maccu + rāja: 'of the King of Death' — maccu 'death' + rājan 'king' (an epithet of Māra/Yama)",
        "gram": "tappurisa cpd., gen. sg. m.",
        "ped": "PED s.v. maccu; s.v. rājan"
      },
      {
        "w": "gacche.",
        "gloss": "would go, may go — 'would pass beyond the sight of the King of Death' (opt. of gacchati, √gam)",
        "gram": "opt. 3 sg. of gacchati (√gam)",
        "ped": "PED s.v. gacchati"
      }
    ],
    "translation": {
      "text": "vanish from the King of Death. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp46:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp47:0",
    "pali": "Viṭaṭūbhavatthu",
    "words": [
      {
        "w": "Viṭaṭūbhavatthu",
        "gloss": "= Viṭaṭūbha (proper name = Viḍūḍabha) + vatthu: 'the story of Viḍūḍabha'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated in the source. Viṭaṭūbha = Viḍūḍabha, the Kosalan prince who massacred the Sākiyans and perished with his army in a flood — the frame for the 'flood sweeps off the sleeping village' simile.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp47:1",
    "pali": "Pupphāni heva pacinantaṁ,",
    "words": [
      {
        "w": "Pupphāni",
        "gloss": "flowers",
        "gram": "nt., acc. pl.",
        "ped": "PED s.v. puppha"
      },
      {
        "w": "heva",
        "gloss": "= hi + eva (with -v- glide): an emphatic particle-cluster, 'just, indeed'",
        "gram": "indecl. (emph. particle)",
        "ped": "PED s.v. eva; s.v. hi"
      },
      {
        "w": "pacinantaṁ,",
        "gloss": "gathering, plucking (present participle of pacināti 'to gather', pa + √ci); acc. agreeing with naraṁ",
        "gram": "pres. part. of pacināti, acc. sg. m.",
        "ped": "PED s.v. pacināti"
      }
    ],
    "translation": {
      "text": "As a mighty flood sweeps off a sleeping village, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp47:1, verbatim"
    },
    "notes": "The subject 'naraṁ' (47:2) is the object of gacchati at 47:4; pacinantaṁ and byāsattamanasaṁ are participial modifiers of it — 'a man gathering flowers, his mind attached'.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp47:2",
    "pali": "byāsattamanasaṁ naraṁ;",
    "words": [
      {
        "w": "byāsattamanasaṁ",
        "gloss": "= byāsatta + manasa: 'with a mind attached, clinging' — byāsatta (= vyāsatta, pp. of vyāsajjati 'to attach, hang on') + manas 'mind'",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. vyāsatta; s.v. manas"
      },
      {
        "w": "naraṁ;",
        "gloss": "a man, person",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. nara"
      }
    ],
    "translation": {
      "text": "death steals away a man ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp47:2, verbatim"
    },
    "notes": "Variant byāsattamānasaṁ (mr).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp47:3",
    "pali": "Suttaṁ gāmaṁ mahoghova,",
    "words": [
      {
        "w": "Suttaṁ",
        "gloss": "asleep, sleeping (pp. of supati 'to sleep', √svap); agreeing with gāmaṁ",
        "gram": "pp., acc. sg. m.",
        "ped": "PED s.v. supati"
      },
      {
        "w": "gāmaṁ",
        "gloss": "a village",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. gāma"
      },
      {
        "w": "mahoghova,",
        "gloss": "= mahā + ogha + va (mahā + ogha > mahogha; va = iva 'like'): 'like a great flood' — mahant 'great' + ogha 'flood'",
        "gram": "mahogho: kammadhāraya cpd., nom. sg. m.; va: indecl. (= iva)",
        "ped": "PED s.v. mahant; s.v. ogha; s.v. iva"
      }
    ],
    "translation": {
      "text": "even as he gathers flowers, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp47:3, verbatim"
    },
    "notes": "Suttaṁ here is the past participle 'asleep' (from supati), NOT sutta 'a discourse/thread'. mahogha 'great flood' is the frame image (see the Viḍūḍabha vatthu).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp47:4",
    "pali": "maccu ādāya gacchati.",
    "words": [
      {
        "w": "maccu",
        "gloss": "death",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. maccu"
      },
      {
        "w": "ādāya",
        "gloss": "having taken, seizing (absolutive of ādadāti 'to take', ā + √dā)",
        "gram": "ger. (absol.) of ādadāti (ā + √dā)",
        "ped": "PED s.v. ādāti"
      },
      {
        "w": "gacchati.",
        "gloss": "goes off, carries away",
        "gram": "pres. 3 sg. of gacchati (√gam)",
        "ped": "PED s.v. gacchati"
      }
    ],
    "translation": {
      "text": "his mind caught up in them. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp47:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp48:0",
    "pali": "Patipūjikakumārivatthu",
    "words": [
      {
        "w": "Patipūjikakumārivatthu",
        "gloss": "= Patipūjikā (proper name) + kumārī 'girl, maiden' + vatthu: 'the story of the girl Patipūjikā'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. kumārī; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. Patipūjikā, a young laywoman, died suddenly while gathering flowers — the frame for the repeated 'death takes the flower-gatherer' image.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp48:1",
    "pali": "Pupphāni heva pacinantaṁ,",
    "words": [
      {
        "w": "Pupphāni",
        "gloss": "flowers",
        "gram": "nt., acc. pl.",
        "ped": "PED s.v. puppha"
      },
      {
        "w": "heva",
        "gloss": "= hi + eva: an emphatic particle-cluster",
        "gram": "indecl. (emph. particle)",
        "ped": "PED s.v. eva; s.v. hi"
      },
      {
        "w": "pacinantaṁ,",
        "gloss": "gathering, plucking",
        "gram": "pres. part. of pacināti, acc. sg. m.",
        "ped": "PED s.v. pacināti"
      }
    ],
    "translation": {
      "text": "The terminator gains control of the man ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp48:1, verbatim"
    },
    "notes": "Verse 48 repeats 47:1–2 verbatim and re-glossed in full.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp48:2",
    "pali": "byāsattamanasaṁ naraṁ;",
    "words": [
      {
        "w": "byāsattamanasaṁ",
        "gloss": "= byāsatta + manasa: 'with a mind attached'",
        "gram": "bahubbīhi cpd. adj., acc. sg. m.",
        "ped": "PED s.v. vyāsatta; s.v. manas"
      },
      {
        "w": "naraṁ;",
        "gloss": "a man",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. nara"
      }
    ],
    "translation": {
      "text": "who has not had his fill of pleasures, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp48:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp48:3",
    "pali": "Atittaññeva kāmesu,",
    "words": [
      {
        "w": "Atittaññeva",
        "gloss": "= atittaṁ + eva (sandhi -ṁ + e- > -ññe-): 'the unsated one indeed' — a + titta (pp. of tappati 'to be satisfied') + eva 'just'",
        "gram": "atittaṁ: neg. pp. adj., acc. sg. m.; eva: indecl. (emph.)",
        "ped": "PED s.v. titta¹; s.v. eva"
      },
      {
        "w": "kāmesu,",
        "gloss": "in/among sensual pleasures (loc. of reference)",
        "gram": "m., loc. pl.",
        "ped": "PED s.v. kāma"
      }
    ],
    "translation": {
      "text": "even as he gathers flowers, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp48:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp48:4",
    "pali": "antako kurute vasaṁ.",
    "words": [
      {
        "w": "antako",
        "gloss": "the End-maker, Death (antaka, from anta 'end'); an epithet of Māra/death",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. antaka"
      },
      {
        "w": "kurute",
        "gloss": "makes, brings (middle-voice present of karoti, √kar)",
        "gram": "pres. med. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "vasaṁ.",
        "gloss": "under (his) power/control — 'kurute vasaṁ' = brings under his sway (vasa 'power, control')",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. vasa"
      }
    ],
    "translation": {
      "text": "his mind caught up in them. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp48:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp49:0",
    "pali": "Macchariyakosiyaseṭṭhivatthu",
    "words": [
      {
        "w": "Macchariyakosiyaseṭṭhivatthu",
        "gloss": "= macchariya + Kosiya + seṭṭhi + vatthu: 'the story of the stingy treasurer Kosiya' — macchariya 'stinginess, meanness' + Kosiya (name) + seṭṭhi 'treasurer, banker'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. macchariya; s.v. seṭṭhi; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. Kosiya, a miserly treasurer, is the frame for the verse about the sage who takes alms 'like a bee' without burdening the giver.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp49:1",
    "pali": "Yathāpi bhamaro pupphaṁ,",
    "words": [
      {
        "w": "Yathāpi",
        "gloss": "= yathā + api: 'just as, even as' (opening the simile)",
        "gram": "indecl. (rel. adv. + emph. particle)",
        "ped": "PED s.v. yathā; s.v. api"
      },
      {
        "w": "bhamaro",
        "gloss": "a bee",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bhamara"
      },
      {
        "w": "pupphaṁ,",
        "gloss": "a flower (object of ādāya at 49:3)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. puppha"
      }
    ],
    "translation": {
      "text": "A bee takes the nectar ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp49:1, verbatim"
    },
    "notes": "The classic bee simile: as a bee takes nectar without harming the flower's colour or scent, so a sage should gather alms in the village.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp49:2",
    "pali": "vaṇṇagandhamaheṭhayaṁ;",
    "words": [
      {
        "w": "vaṇṇagandhamaheṭhayaṁ;",
        "gloss": "= vaṇṇagandhaṁ + aheṭhayaṁ (sandhi -ṁ + a- written -m-a-): 'not harming its colour and fragrance' — vaṇṇa 'colour, beauty' + gandha 'scent' (a dvandva) + a + heṭhayaṁ (pres. part. of heṭheti 'to harm, injure')",
        "gram": "vaṇṇagandhaṁ: dvandva cpd., acc. sg. m.; aheṭhayaṁ: neg. pres. part. of heṭheti, nom. sg. m.",
        "ped": "PED s.v. vaṇṇa; s.v. gandha; s.v. heṭheti"
      }
    ],
    "translation": {
      "text": "and moves on, doing no damage ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp49:2, verbatim"
    },
    "notes": "The crux compound of the bee verse, and the most edition-variant line of the vagga. The Mahāsaṅgīti fuses it as vaṇṇagandham-aheṭhayaṁ ('not harming its colour-and-scent'), taking vaṇṇagandha as a dvandva. Other editions read vaṇṇagandhaṁ aheṭhayaṁ (bj, pts1ed, pts2ed), vaṇṇavantaṁ agandhakaṁ (cck), vaṇṇavantaṁ aheṭhayaṁ (sya1ed, sya2ed), or vaṇṇagandhamapoṭhayaṁ (mr). Reported; not resolved.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp49:3",
    "pali": "Paleti rasamādāya,",
    "words": [
      {
        "w": "Paleti",
        "gloss": "flies off, departs (palāyati 'to flee, go away')",
        "gram": "pres. 3 sg. of palāyati",
        "ped": "PED s.v. palāyati"
      },
      {
        "w": "rasamādāya,",
        "gloss": "= rasaṁ + ādāya (sandhi -ṁ + ā- written -m-ā-): 'having taken the nectar/essence' — rasa 'juice, nectar, essence' + ādāya (absol. 'having taken')",
        "gram": "rasaṁ: m., acc. sg.; ādāya: ger. (absol.) of ādadāti (ā + √dā)",
        "ped": "PED s.v. rasa; s.v. ādāti"
      }
    ],
    "translation": {
      "text": "to the flower’s beauty and fragrance; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp49:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp49:4",
    "pali": "evaṁ gāme munī care.",
    "words": [
      {
        "w": "evaṁ",
        "gloss": "thus, so (correlative answering yathāpi)",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "gāme",
        "gloss": "in the village",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. gāma"
      },
      {
        "w": "munī",
        "gloss": "a sage (muni; nom. sg. lengthened metri causa)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. muni"
      },
      {
        "w": "care.",
        "gloss": "should move, walk, conduct oneself (opt. of carati 'to go about, live', √car)",
        "gram": "opt. 3 sg. of carati (√car)",
        "ped": "PED s.v. carati"
      }
    ],
    "translation": {
      "text": "and that’s how a sage should walk in the village. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp49:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp50:0",
    "pali": "Pāveyyaājīvakavatthu",
    "words": [
      {
        "w": "Pāveyyaājīvakavatthu",
        "gloss": "= pāveyya (of Pāvā) + ājīvaka (an Ājīvika ascetic) + vatthu: 'the story of the Ājīvika ascetic from Pāvā'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. ājīvaka; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp50:1",
    "pali": "Na paresaṁ vilomāni,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "paresaṁ",
        "gloss": "of others (para 'other'; gen. pl.)",
        "gram": "pron. adj., gen. pl. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "vilomāni,",
        "gloss": "contrary things, faults, wrongs (viloma 'against the grain, contrary'; nt. pl.)",
        "gram": "adj. as subst., acc. pl. nt.",
        "ped": "PED s.v. viloma"
      }
    ],
    "translation": {
      "text": "Don’t find fault with others, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp50:1, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp50:2",
    "pali": "na paresaṁ katākataṁ;",
    "words": [
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "paresaṁ",
        "gloss": "of others",
        "gram": "pron. adj., gen. pl. m.",
        "ped": "PED s.v. para"
      },
      {
        "w": "katākataṁ;",
        "gloss": "= kata + akata: 'the done and the undone' — kata (pp. of karoti 'done') + a + kata 'not-done'",
        "gram": "dvandva cpd. subst., acc. sg. nt.",
        "ped": "PED s.v. karoti"
      }
    ],
    "translation": {
      "text": "with what they’ve done or left undone. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp50:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp50:3",
    "pali": "Attanova avekkheyya,",
    "words": [
      {
        "w": "Attanova",
        "gloss": "= attano + va (va = eva 'just, only'): 'of oneself only' — attan 'self' (gen. attano) + eva",
        "gram": "attano: refl. n., gen. sg.; va: indecl. (= eva)",
        "ped": "PED s.v. attan; s.v. eva"
      },
      {
        "w": "avekkheyya,",
        "gloss": "should look at, regard, consider (opt. of avekkhati, ava + √ikkh)",
        "gram": "opt. 3 sg. of avekkhati (ava + √ikkh)",
        "ped": "PED s.v. avekkhati"
      }
    ],
    "translation": {
      "text": "You should only watch yourself, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp50:3, verbatim"
    },
    "notes": "Attanova = attano + va, with va here = eva 'only, just'; some would read va = iva, but the sense 'only one's own' is standard.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp50:4",
    "pali": "katāni akatāni ca.",
    "words": [
      {
        "w": "katāni",
        "gloss": "things done (pp. of karoti, nt. pl.)",
        "gram": "pp., acc. pl. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "akatāni",
        "gloss": "things not done (a + kata)",
        "gram": "neg. pp., acc. pl. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "ca.",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "what you’ve done or left undone. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp50:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp51:0",
    "pali": "Chattapāṇiupāsakavatthu",
    "words": [
      {
        "w": "Chattapāṇiupāsakavatthu",
        "gloss": "= chattapāṇi (name, 'umbrella-in-hand') + upāsaka 'lay follower' + vatthu: 'the story of the lay follower Chattapāṇi'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. upāsaka; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp51:1",
    "pali": "Yathāpi ruciraṁ pupphaṁ,",
    "words": [
      {
        "w": "Yathāpi",
        "gloss": "just as (yathā + api)",
        "gram": "indecl. (rel. adv. + emph. particle)",
        "ped": "PED s.v. yathā; s.v. api"
      },
      {
        "w": "ruciraṁ",
        "gloss": "lovely, bright, beautiful (rucira)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. rucira"
      },
      {
        "w": "pupphaṁ,",
        "gloss": "a flower",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. puppha"
      }
    ],
    "translation": {
      "text": "Just like a glorious flower ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp51:1, verbatim"
    },
    "notes": "The twin 51/52 turns on the vaṇṇavant/gandha compounds: a lovely but scentless flower : well-spoken but unpractised speech :: fruitless; a fragrant flower : speech acted upon :: fruitful.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp51:2",
    "pali": "vaṇṇavantaṁ agandhakaṁ;",
    "words": [
      {
        "w": "vaṇṇavantaṁ",
        "gloss": "possessing colour, colourful (vaṇṇavant = vaṇṇa 'colour' + poss. -vant)",
        "gram": "adj. (poss. -vant stem), acc. sg. nt.",
        "ped": "PED s.v. vaṇṇavant"
      },
      {
        "w": "agandhakaṁ;",
        "gloss": "scentless (a + gandha 'scent' + -ka)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. gandha"
      }
    ],
    "translation": {
      "text": "that’s colorful but lacks fragrance; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp51:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp51:3",
    "pali": "Evaṁ subhāsitā vācā,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "so, thus",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "subhāsitā",
        "gloss": "well-spoken (su 'well' + bhāsita, pp. of bhāsati 'to speak')",
        "gram": "pp. cpd. adj., nom. sg. f.",
        "ped": "PED s.v. su; s.v. bhāsati"
      },
      {
        "w": "vācā,",
        "gloss": "speech, word",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. vācā"
      }
    ],
    "translation": {
      "text": "eloquent speech is fruitless ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp51:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp51:4",
    "pali": "aphalā hoti akubbato.",
    "words": [
      {
        "w": "aphalā",
        "gloss": "fruitless, without result (a + phala 'fruit')",
        "gram": "adj., nom. sg. f.",
        "ped": "PED s.v. phala"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "akubbato.",
        "gloss": "for one not acting on it (a + kubbant, pres. part. of karoti; gen. sg.)",
        "gram": "neg. pres. part. of karoti (√kar), gen. sg. m.",
        "ped": "PED s.v. karoti"
      }
    ],
    "translation": {
      "text": "for one who does not act on it. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp51:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp52:1",
    "pali": "Yathāpi ruciraṁ pupphaṁ,",
    "words": [
      {
        "w": "Yathāpi",
        "gloss": "just as",
        "gram": "indecl. (rel. adv. + emph. particle)",
        "ped": "PED s.v. yathā; s.v. api"
      },
      {
        "w": "ruciraṁ",
        "gloss": "lovely, beautiful",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. rucira"
      },
      {
        "w": "pupphaṁ,",
        "gloss": "a flower",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. puppha"
      }
    ],
    "translation": {
      "text": "Just like a glorious flower ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp52:1, verbatim"
    },
    "notes": "Verse 52, the fruitful counterpart, repeats 51's frame and is glossed again in full.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp52:2",
    "pali": "Vaṇṇavantaṁ sagandhakaṁ;",
    "words": [
      {
        "w": "Vaṇṇavantaṁ",
        "gloss": "colourful",
        "gram": "adj. (poss. -vant stem), acc. sg. nt.",
        "ped": "PED s.v. vaṇṇavant"
      },
      {
        "w": "sagandhakaṁ;",
        "gloss": "= sa + gandha + -ka: fragrant, scented (sa 'with' + gandha 'scent')",
        "gram": "bahubbīhi cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. sa³; s.v. gandha"
      }
    ],
    "translation": {
      "text": "that’s both colorful and fragrant, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp52:2, verbatim"
    },
    "notes": "Variant sugandhakaṁ (csp1ed).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp52:3",
    "pali": "Evaṁ subhāsitā vācā,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "so, thus",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "subhāsitā",
        "gloss": "well-spoken",
        "gram": "pp. cpd. adj., nom. sg. f.",
        "ped": "PED s.v. su; s.v. bhāsati"
      },
      {
        "w": "vācā,",
        "gloss": "speech",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. vācā"
      }
    ],
    "translation": {
      "text": "eloquent speech is fruitful ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp52:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp52:4",
    "pali": "Saphalā hoti kubbato.",
    "words": [
      {
        "w": "Saphalā",
        "gloss": "fruitful (sa 'with' + phala 'fruit')",
        "gram": "adj., nom. sg. f.",
        "ped": "PED s.v. sa³; s.v. phala"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "kubbato.",
        "gloss": "for one who acts on it (kubbant, pres. part. of karoti; gen. sg.)",
        "gram": "pres. part. of karoti (√kar), gen. sg. m.",
        "ped": "PED s.v. karoti"
      }
    ],
    "translation": {
      "text": "for one who acts on it. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp52:4, verbatim"
    },
    "notes": "Variants pakubbato (bj), sukubbato (sya-all, km), sakubbato (pts1ed, pts2ed).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp53:0",
    "pali": "Visākhāvatthu",
    "words": [
      {
        "w": "Visākhāvatthu",
        "gloss": "= Visākhā (proper name) + vatthu: 'the story of Visākhā'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. Visākhā, the great lay patroness, is the frame for the verse on making 'many garlands' of merit.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp53:1",
    "pali": "Yathāpi puppharāsimhā,",
    "words": [
      {
        "w": "Yathāpi",
        "gloss": "just as",
        "gram": "indecl. (rel. adv. + emph. particle)",
        "ped": "PED s.v. yathā; s.v. api"
      },
      {
        "w": "puppharāsimhā,",
        "gloss": "= puppha + rāsi: 'from a heap of flowers' — puppha 'flower' + rāsi 'heap, mass'; abl. sg. -mhā",
        "gram": "tappurisa cpd., abl. sg. m.",
        "ped": "PED s.v. puppha; s.v. rāsi"
      }
    ],
    "translation": {
      "text": "Just as one would create many garlands ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp53:1, verbatim"
    },
    "notes": "The garland simile: as many garlands are strung from a heap of flowers, so a mortal, once born, should do much good. The key compound is mālāguṇa 'garland-string' (53:2); jātena maccena is the instrumental agent of the gerundive kattabbaṁ (53:4).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp53:2",
    "pali": "kayirā mālāguṇe bahū;",
    "words": [
      {
        "w": "kayirā",
        "gloss": "one could make, would make (opt. of karoti; the archaic kayirā form)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "mālāguṇe",
        "gloss": "= mālā + guṇa: garland-strings, strands of a garland — mālā 'garland, wreath' + guṇa 'strand, cord, string'",
        "gram": "tappurisa cpd., acc. pl. m.",
        "ped": "PED s.v. mālā; s.v. guṇa"
      },
      {
        "w": "bahū;",
        "gloss": "many",
        "gram": "adj., acc. pl. m.",
        "ped": "PED s.v. bahu"
      }
    ],
    "translation": {
      "text": "from a heap of flowers, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp53:2, verbatim"
    },
    "notes": "mālāguṇa = 'garland-string, strand of a garland' — the compound at the heart of the garland simile (guṇa in its concrete sense 'strand, cord').",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp53:3",
    "pali": "Evaṁ jātena maccena,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "so, thus",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "jātena",
        "gloss": "by one (who is) born (jāta, pp. of jāyati 'to be born'; instr., agent of the gerundive)",
        "gram": "pp., instr. sg. m.",
        "ped": "PED s.v. jāta"
      },
      {
        "w": "maccena,",
        "gloss": "by a mortal (macca 'mortal'; instr.)",
        "gram": "m., instr. sg.",
        "ped": "PED s.v. macca"
      }
    ],
    "translation": {
      "text": "when a person has come to be born, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp53:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp53:4",
    "pali": "kattabbaṁ kusalaṁ bahuṁ.",
    "words": [
      {
        "w": "kattabbaṁ",
        "gloss": "is to be done, should be done (gerundive/fpp of karoti)",
        "gram": "grdv. (fpp.) of karoti (√kar), nom. sg. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "kusalaṁ",
        "gloss": "good, skilful, wholesome (deed); here 'merit'",
        "gram": "adj. as subst., nom. sg. nt.",
        "ped": "PED s.v. kusala"
      },
      {
        "w": "bahuṁ.",
        "gloss": "much, many",
        "gram": "adj., nom. sg. nt.",
        "ped": "PED s.v. bahu"
      }
    ],
    "translation": {
      "text": "they should do many skillful things. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp53:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp54:0",
    "pali": "Ānandattherapañhavatthu",
    "words": [
      {
        "w": "Ānandattherapañhavatthu",
        "gloss": "= Ānanda (the elder) + thera 'elder' + pañha 'question' + vatthu: 'the story of the elder Ānanda's question'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. thera; s.v. pañha; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. It answers Ānanda's question about whether any fragrance travels against the wind.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp54:1",
    "pali": "Na pupphagandho paṭivātameti,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "pupphagandho",
        "gloss": "= puppha + gandha: the scent of flowers",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. puppha; s.v. gandha"
      },
      {
        "w": "paṭivātameti,",
        "gloss": "= paṭivātaṁ + eti (sandhi -ṁ + e- written -m-e-): 'goes against the wind, upwind' — paṭivāta 'against the wind' (paṭi 'against' + vāta 'wind') + eti 'goes'",
        "gram": "paṭivātaṁ: acc. sg. m. as adv.; eti: pres. 3 sg. of eti (√i)",
        "ped": "PED s.v. paṭivāta; s.v. eti"
      }
    ],
    "translation": {
      "text": "The fragrance of flowers doesn’t spread upwind, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp54:1, verbatim"
    },
    "notes": "The famous 'fragrance of virtue travels upwind' verse: material scents (candana, tagara, mallikā) go only downwind, but the fragrance of the good (sataṁ gandho) spreads against the wind and in every direction.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp54:2",
    "pali": "Na candanaṁ tagaramallikā vā;",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "candanaṁ",
        "gloss": "sandalwood",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. candana"
      },
      {
        "w": "tagaramallikā",
        "gloss": "= tagara + mallikā: tagara (a fragrant shrub / its powder) and jasmine (mallikā) — a dvandva",
        "gram": "dvandva cpd., nom. sg. f.",
        "ped": "PED s.v. tagara; s.v. mallikā"
      },
      {
        "w": "vā;",
        "gloss": "or",
        "gram": "indecl. (disj.)",
        "ped": "PED s.v. vā"
      }
    ],
    "translation": {
      "text": "nor sandalwood, pinwheel, or jasmine; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp54:2, verbatim"
    },
    "notes": "Variant taggaramallikā (csp1ed).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp54:3",
    "pali": "Satañca gandho paṭivātameti,",
    "words": [
      {
        "w": "Satañca",
        "gloss": "= sataṁ + ca (sandhi -ṁ + c- > -ñc-): 'and of the good/true ones' — sant 'good, virtuous, true' (gen. pl. sataṁ) + ca",
        "gram": "sataṁ: pres. part./adj. (sant) as subst., gen. pl. m.; ca: conj.",
        "ped": "PED s.v. sant; s.v. ca"
      },
      {
        "w": "gandho",
        "gloss": "scent, fragrance",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. gandha"
      },
      {
        "w": "paṭivātameti,",
        "gloss": "goes upwind (see 54:1)",
        "gram": "paṭivātaṁ: acc. sg. m. as adv.; eti: pres. 3 sg. of eti (√i)",
        "ped": "PED s.v. paṭivāta; s.v. eti"
      }
    ],
    "translation": {
      "text": "but the fragrance of the good spreads upwind; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp54:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp54:4",
    "pali": "Sabbā disā sappuriso pavāyati.",
    "words": [
      {
        "w": "Sabbā",
        "gloss": "all",
        "gram": "adj., acc. pl. f. (agreeing with disā)",
        "ped": "PED s.v. sabba"
      },
      {
        "w": "disā",
        "gloss": "directions, quarters (disā; acc. pl.)",
        "gram": "f., acc. pl.",
        "ped": "PED s.v. disā"
      },
      {
        "w": "sappuriso",
        "gloss": "= sat/sant + purisa: a true/good person",
        "gram": "kammadhāraya cpd., nom. sg. m.",
        "ped": "PED s.v. sappurisa"
      },
      {
        "w": "pavāyati.",
        "gloss": "blows forth, wafts, pervades with fragrance (pa + vāyati 'to blow', √vā)",
        "gram": "pres. 3 sg. of pavāyati (pa + √vā)",
        "ped": "PED s.v. pavāyati"
      }
    ],
    "translation": {
      "text": "a true person’s virtue spreads in every direction. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp54:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp55:1",
    "pali": "Candanaṁ tagaraṁ vāpi,",
    "words": [
      {
        "w": "Candanaṁ",
        "gloss": "sandalwood",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. candana"
      },
      {
        "w": "tagaraṁ",
        "gloss": "tagara (fragrant powder/shrub)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. tagara"
      },
      {
        "w": "vāpi,",
        "gloss": "= vā + api: 'or even, or also'",
        "gram": "indecl. (disj. + emph.)",
        "ped": "PED s.v. vā; s.v. api"
      }
    ],
    "translation": {
      "text": "Among all the fragrances—",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp55:1, verbatim"
    },
    "notes": "Verse 55 continues the fragrance theme, capping a list of the finest physical perfumes with 'the fragrance of virtue is unsurpassed'.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp55:2",
    "pali": "uppalaṁ atha vassikī;",
    "words": [
      {
        "w": "uppalaṁ",
        "gloss": "the blue lotus, water-lily (uppala)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. uppala"
      },
      {
        "w": "atha",
        "gloss": "and then, moreover, or",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. atha"
      },
      {
        "w": "vassikī;",
        "gloss": "the great-flowered jasmine (vassikā/vassikī, Jasminum sambac)",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. vassikā"
      }
    ],
    "translation": {
      "text": "sandalwood or pinwheel ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp55:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp55:3",
    "pali": "Etesaṁ gandhajātānaṁ,",
    "words": [
      {
        "w": "Etesaṁ",
        "gloss": "of these (eta 'this'; gen. pl.)",
        "gram": "dem. pron., gen. pl. nt.",
        "ped": "PED s.v. eta"
      },
      {
        "w": "gandhajātānaṁ,",
        "gloss": "= gandha + jāta: of the kinds of scent, of fragrant things — gandha 'scent' + jāta 'kind, sort'",
        "gram": "cpd., gen. pl. nt.",
        "ped": "PED s.v. gandha; s.v. jāta"
      }
    ],
    "translation": {
      "text": "or lotus or jasmine—",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp55:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp55:4",
    "pali": "sīlagandho anuttaro.",
    "words": [
      {
        "w": "sīlagandho",
        "gloss": "= sīla + gandha: the fragrance of virtue — sīla 'virtue, morality' + gandha 'scent'",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. sīla; s.v. gandha"
      },
      {
        "w": "anuttaro.",
        "gloss": "unsurpassed, supreme (an + uttara 'higher')",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. anuttara"
      }
    ],
    "translation": {
      "text": "the fragrance of virtue is supreme. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp55:4, verbatim"
    },
    "notes": "sīlagandha 'the fragrance of virtue' — the compound that fuses the vagga's scent imagery with its ethical point.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp56:0",
    "pali": "Mahākassapattherapiṇḍapātadinnavatthu",
    "words": [
      {
        "w": "Mahākassapattherapiṇḍapātadinnavatthu",
        "gloss": "= Mahākassapa (the elder) + thera + piṇḍapāta 'almsfood' + dinna 'given' + vatthu: 'the story of the almsfood given to the elder Mahākassapa'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. thera; s.v. piṇḍapāta; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp56:1",
    "pali": "Appamatto ayaṁ gandho,",
    "words": [
      {
        "w": "Appamatto",
        "gloss": "slight, trifling, of little measure (appa 'little' + matta 'measure') — NOT the homonym appamatta 'heedful, diligent'",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. appamatta¹"
      },
      {
        "w": "ayaṁ",
        "gloss": "this",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ayaṁ"
      },
      {
        "w": "gandho,",
        "gloss": "scent, fragrance",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. gandha"
      }
    ],
    "translation": {
      "text": "Faint is the fragrance ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp56:1, verbatim"
    },
    "notes": "appamatto here = 'slight, of little measure' (appa + matta), a homonym of appamatta 'diligent, heedful' (the key word of the Appamādavagga); context ('faint is this fragrance') fixes the 'slight' sense.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp56:2",
    "pali": "yāyaṁ tagaracandanī;",
    "words": [
      {
        "w": "yāyaṁ",
        "gloss": "= yā + ayaṁ: 'which is this' (rel. pron. yā + dem. ayaṁ)",
        "gram": "rel. pron., nom. sg. f. + dem. pron., nom. sg. f.",
        "ped": "PED s.v. ya; s.v. ayaṁ"
      },
      {
        "w": "tagaracandanī;",
        "gloss": "= tagara + candana + fem. -ī: the tagara-and-sandal (scent)",
        "gram": "dvandva cpd., nom. sg. f.",
        "ped": "PED s.v. tagara; s.v. candana"
      }
    ],
    "translation": {
      "text": "of sandal or pinwheel; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp56:2, verbatim"
    },
    "notes": "Variant yvāyaṁ tagaracandanī (sya-all); yvāyaṁ tagaracandanaṁ (csp1ed).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp56:3",
    "pali": "Yo ca sīlavataṁ gandho,",
    "words": [
      {
        "w": "Yo",
        "gloss": "which",
        "gram": "rel. pron., nom. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "ca",
        "gloss": "but, and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "sīlavataṁ",
        "gloss": "of the virtuous ones (sīlavant 'virtuous'; gen. pl.)",
        "gram": "adj. (poss. -vant) as subst., gen. pl. m.",
        "ped": "PED s.v. sīla"
      },
      {
        "w": "gandho,",
        "gloss": "scent, fragrance",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. gandha"
      }
    ],
    "translation": {
      "text": "but the fragrance of the virtuous ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp56:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp56:4",
    "pali": "vāti devesu uttamo.",
    "words": [
      {
        "w": "vāti",
        "gloss": "blows, wafts (vāyati 'to blow', √vā)",
        "gram": "pres. 3 sg. of vāti (√vā)",
        "ped": "PED s.v. vāti"
      },
      {
        "w": "devesu",
        "gloss": "among the gods",
        "gram": "m., loc. pl.",
        "ped": "PED s.v. deva"
      },
      {
        "w": "uttamo.",
        "gloss": "highest, supreme (uttama)",
        "gram": "adj., nom. sg. m.",
        "ped": "PED s.v. uttama"
      }
    ],
    "translation": {
      "text": "floats to the highest gods. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp56:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp57:0",
    "pali": "Godhikattheraparinibbānavatthu",
    "words": [
      {
        "w": "Godhikattheraparinibbānavatthu",
        "gloss": "= Godhika (the elder) + thera + parinibbāna 'final quenching' + vatthu: 'the story of the elder Godhika's final Nibbāna'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. thera; s.v. parinibbāna; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. The elder Godhika attained final Nibbāna and Māra searched in vain for his rebirth-consciousness — the frame for 'Māra finds not their track'.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp57:1",
    "pali": "Tesaṁ sampannasīlānaṁ,",
    "words": [
      {
        "w": "Tesaṁ",
        "gloss": "of those (ta; gen. pl.)",
        "gram": "dem. pron., gen. pl. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "sampannasīlānaṁ,",
        "gloss": "= sampanna + sīla: of those accomplished in virtue — sampanna (pp. of sampajjati 'to be endowed, succeed') + sīla 'virtue'",
        "gram": "bahubbīhi cpd. adj. as subst., gen. pl. m.",
        "ped": "PED s.v. sampanna; s.v. sīla"
      }
    ],
    "translation": {
      "text": "For those accomplished in ethics, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp57:1, verbatim"
    },
    "notes": "Three genitive-plural epithets (57:1–3) qualify 'those' whose path Māra cannot find (57:4).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp57:2",
    "pali": "appamādavihārinaṁ;",
    "words": [
      {
        "w": "appamādavihārinaṁ;",
        "gloss": "= appamāda + vihārin: of those dwelling in diligence — appamāda 'heedfulness, diligence' + vihārin 'dwelling, abiding'",
        "gram": "cpd. adj. (poss. -in stem), gen. pl. m.",
        "ped": "PED s.v. appamāda; s.v. vihārin"
      }
    ],
    "translation": {
      "text": "meditating diligently, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp57:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp57:3",
    "pali": "Sammadaññāvimuttānaṁ,",
    "words": [
      {
        "w": "Sammadaññāvimuttānaṁ,",
        "gloss": "= sammad (= sammā 'rightly', sandhi form before a vowel) + aññā 'final knowledge, gnosis' + vimutta 'freed' (pp. of vimuñcati): 'of those freed through perfect knowledge'",
        "gram": "cpd. adj. (pp. vimutta) as subst., gen. pl. m.",
        "ped": "PED s.v. sammā; s.v. aññā; s.v. vimutta"
      }
    ],
    "translation": {
      "text": "freed through the highest knowledge, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp57:3, verbatim"
    },
    "notes": "sammad- is the sandhi form of sammā 'rightly' before a vowel (historical final consonant).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp57:4",
    "pali": "māro maggaṁ na vindati.",
    "words": [
      {
        "w": "māro",
        "gloss": "Māra",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. māra"
      },
      {
        "w": "maggaṁ",
        "gloss": "the way, path, track",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. magga"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "vindati.",
        "gloss": "finds, knows (vindati, √vid)",
        "gram": "pres. 3 sg. of vindati (√vid)",
        "ped": "PED s.v. vindati"
      }
    ],
    "translation": {
      "text": "Māra cannot find their path. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp57:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp58:0",
    "pali": "Garahadinnavatthu",
    "words": [
      {
        "w": "Garahadinnavatthu",
        "gloss": "= Garahadinna (proper name) + vatthu: 'the story of Garahadinna'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp58:1",
    "pali": "Yathā saṅkāradhānasmiṁ,",
    "words": [
      {
        "w": "Yathā",
        "gloss": "just as",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      },
      {
        "w": "saṅkāradhānasmiṁ,",
        "gloss": "= saṅkāra + dhāna: on a rubbish-heap, in a refuse-dump — saṅkāra 'sweepings, rubbish' + dhāna 'receptacle, place'; loc. sg. -smiṁ",
        "gram": "tappurisa cpd., loc. sg. nt.",
        "ped": "PED s.v. saṅkāra; s.v. dhāna"
      }
    ],
    "translation": {
      "text": "From a heap of trash ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp58:1, verbatim"
    },
    "notes": "The lotus-on-a-dungheap twin (58 simile / 59 application): as a fragrant lotus can spring from roadside refuse, so a disciple of the Buddha outshines by wisdom the 'blind' worldlings. The word saṅkāra 'rubbish' links both verses. Variant saṅkāraṭhānasmiṁ (mr).",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp58:2",
    "pali": "ujjhitasmiṁ mahāpathe;",
    "words": [
      {
        "w": "ujjhitasmiṁ",
        "gloss": "cast off, thrown away (ujjhita, pp. of ujjhati 'to abandon, discard'; loc.)",
        "gram": "pp., loc. sg. m.",
        "ped": "PED s.v. ujjhati"
      },
      {
        "w": "mahāpathe;",
        "gloss": "= mahā + patha: on the highway, main road",
        "gram": "kammadhāraya cpd., loc. sg. m.",
        "ped": "PED s.v. mahant; s.v. patha"
      }
    ],
    "translation": {
      "text": "discarded on the highway, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp58:2, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp58:3",
    "pali": "Padumaṁ tattha jāyetha,",
    "words": [
      {
        "w": "Padumaṁ",
        "gloss": "a lotus",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. paduma"
      },
      {
        "w": "tattha",
        "gloss": "there",
        "gram": "indecl. (adv.)",
        "ped": "PED s.v. tattha"
      },
      {
        "w": "jāyetha,",
        "gloss": "might arise, spring up, be born (opt. med. of jāyati 'to be born', √jan)",
        "gram": "opt. med. 3 sg. of jāyati (√jan)",
        "ped": "PED s.v. jāyati"
      }
    ],
    "translation": {
      "text": "a lotus might blossom, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp58:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp58:4",
    "pali": "sucigandhaṁ manoramaṁ.",
    "words": [
      {
        "w": "sucigandhaṁ",
        "gloss": "= suci + gandha: sweet-scented, of pure fragrance — suci 'pure, clean' + gandha 'scent'",
        "gram": "bahubbīhi cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. suci; s.v. gandha"
      },
      {
        "w": "manoramaṁ.",
        "gloss": "delightful, pleasing to the mind (mano 'mind' + rama 'delighting')",
        "gram": "bahubbīhi cpd. adj., acc. sg. nt.",
        "ped": "PED s.v. manorama"
      }
    ],
    "translation": {
      "text": "fragrant and delightful. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp58:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp59:1",
    "pali": "Evaṁ saṅkārabhūtesu,",
    "words": [
      {
        "w": "Evaṁ",
        "gloss": "so, thus",
        "gram": "indecl.",
        "ped": "PED s.v. evaṁ"
      },
      {
        "w": "saṅkārabhūtesu,",
        "gloss": "= saṅkāra + bhūta: among those become-as-rubbish, the trash-like — saṅkāra 'rubbish' + bhūta 'become, being' (worldlings likened to a rubbish-heap)",
        "gram": "cpd., loc. pl. m.",
        "ped": "PED s.v. saṅkāra; s.v. bhūta"
      }
    ],
    "translation": {
      "text": "So too, among those thought of as trash, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp59:1, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp59:2",
    "pali": "andhabhūte puthujjane;",
    "words": [
      {
        "w": "andhabhūte",
        "gloss": "= andha + bhūta: become blind, blinded — andha 'blind' + bhūta 'become'",
        "gram": "cpd. adj., loc. sg. m. (agreeing with puthujjane)",
        "ped": "PED s.v. andha; s.v. bhūta"
      },
      {
        "w": "puthujjane;",
        "gloss": "an ordinary person, worldling (puthu 'separate, common' + jana 'person') — the common run of people, not yet noble",
        "gram": "cpd., loc. sg. m.",
        "ped": "PED s.v. puthujjana"
      }
    ],
    "translation": {
      "text": "a disciple of the perfect Buddha ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp59:2, verbatim"
    },
    "notes": "Variant andhībhūte (mr), with the factitive -ī- ('become blind').",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp59:3",
    "pali": "Atirocati paññāya,",
    "words": [
      {
        "w": "Atirocati",
        "gloss": "outshines, shines forth exceedingly (ati 'beyond' + rocati 'to shine', √ruc)",
        "gram": "pres. 3 sg. of atirocati (ati + √ruc)",
        "ped": "PED s.v. atirocati"
      },
      {
        "w": "paññāya,",
        "gloss": "by/with wisdom (paññā; instr.)",
        "gram": "f., instr. sg.",
        "ped": "PED s.v. paññā"
      }
    ],
    "translation": {
      "text": "outshines with their wisdom ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp59:3, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp59:4",
    "pali": "sammāsambuddhasāvako.",
    "words": [
      {
        "w": "sammāsambuddhasāvako.",
        "gloss": "= sammāsambuddha + sāvaka: a disciple of the Fully Awakened One — sammāsambuddha 'the Perfectly Self-Awakened' (sammā 'rightly' + sambuddha 'fully awakened') + sāvaka 'hearer, disciple'",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. sammāsambuddha; s.v. sāvaka"
      }
    ],
    "translation": {
      "text": "the blind ordinary folk. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp59:4, verbatim"
    },
    "notes": null,
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp59:5",
    "pali": "Pupphavaggo catuttho.",
    "words": [
      {
        "w": "Pupphavaggo",
        "gloss": "= puppha + vagga: the Flowers Chapter",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. puppha; s.v. vagga"
      },
      {
        "w": "catuttho.",
        "gloss": "the fourth (catuttha, ordinal)",
        "gram": "ordinal adj., nom. sg. m.",
        "ped": "PED s.v. catuttha"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Flowers Chapter, the fourth'). Sujato's Bilara file has no segment for the colophon, so translation is null by fidelity to the source, not omission.",
    "section": "4. Flowers · Pupphavagga (Dhp 44–59)"
  },
  {
    "ref": "dhp60:0.1",
    "pali": "Khuddakanikāya",
    "words": [
      {
        "w": "Khuddakanikāya",
        "gloss": "= khuddaka + nikāya: the Minor Collection",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. khuddaka; s.v. nikāya"
      }
    ],
    "translation": {
      "text": "Minor Collection ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:0.1, verbatim"
    },
    "notes": "Header segment.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:0.2",
    "pali": "Dhammapada",
    "words": [
      {
        "w": "Dhammapada",
        "gloss": "= dhamma + pada (see dhp44:0.2): the title, 'Words/Path of the Dhamma'",
        "gram": "tappurisa cpd., nom. sg. nt. (title)",
        "ped": "PED s.v. dhamma; s.v. pada"
      }
    ],
    "translation": {
      "text": "Sayings of the Dhamma 60–75 ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:0.2, verbatim"
    },
    "notes": "Title segment (see dhp44:0.2 on the ambiguity of the title).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:0.3",
    "pali": "Bālavagga",
    "words": [
      {
        "w": "Bālavagga",
        "gloss": "= bāla + vagga: the 'Fools Chapter' — bāla 'fool, ignorant one; immature' + vagga 'section, chapter'",
        "gram": "tappurisa cpd., nom. sg. m. (title)",
        "ped": "PED s.v. bāla; s.v. vagga"
      }
    ],
    "translation": {
      "text": "5. The Fool ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:0.3, verbatim"
    },
    "notes": "Chapter title. Bālavagga is the fifth vagga (verses 60–75), on the fool (bāla) and the ripening of unwise action.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:0.4",
    "pali": "Aññatarapurisavatthu",
    "words": [
      {
        "w": "Aññatarapurisavatthu",
        "gloss": "= aññatara 'a certain' + purisa 'man' + vatthu: 'the story of a certain man'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. aññatara; s.v. purisa; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated in the source.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:1",
    "pali": "Dīghā jāgarato ratti,",
    "words": [
      {
        "w": "Dīghā",
        "gloss": "long",
        "gram": "adj., nom. sg. f. (agreeing with ratti)",
        "ped": "PED s.v. dīgha"
      },
      {
        "w": "jāgarato",
        "gloss": "for one who is awake / keeping watch (jāgarant, pres. part. of jāgarati 'to be awake, watch', √jāgṛ; gen./dat. sg.) — the crux word: either the sleepless sufferer or the spiritually vigilant (see note)",
        "gram": "pres. part. of jāgarati, gen./dat. sg. m.",
        "ped": "PED s.v. jāgarati"
      },
      {
        "w": "ratti,",
        "gloss": "the night",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. ratti"
      }
    ],
    "translation": {
      "text": "Long is the night for the wakeful; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:1, verbatim"
    },
    "notes": "THE both-ways crux of the vagga. jāgarato is the gen./dat. of the present participle jāgarant 'being awake, keeping watch'. Two readings, both defensible and both live in the tradition: (a) the natural, dominant sense — 'long is the night TO one who lies awake' (the sleepless sufferer for whom the night drags), exactly parallel to 60:2 'long is the league to the weary' and 60:3 'long is saṁsāra to fools'; the aṭṭhakathā frames it with a man kept awake by longing. (b) A valorized sense trading on jāgara- as spiritual wakefulness/vigilance (appamāda): 'long [and full] is the night for the [inwardly] watchful one'. The Pāli fixes neither; both are reported, with the wearisome-night reading dominant. Sujato renders the neutral 'Long is the night for the wakeful'.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:2",
    "pali": "dīghaṁ santassa yojanaṁ;",
    "words": [
      {
        "w": "dīghaṁ",
        "gloss": "long",
        "gram": "adj., nom. sg. nt. (agreeing with yojanaṁ)",
        "ped": "PED s.v. dīgha"
      },
      {
        "w": "santassa",
        "gloss": "for one who is weary, tired (santa, pp. of sammati 'to be wearied', √śram; gen./dat.) — a homonym of santa 'calmed' (< √śam)",
        "gram": "pp. of sammati (√śram), gen./dat. sg. m.",
        "ped": "PED s.v. santa²"
      },
      {
        "w": "yojanaṁ;",
        "gloss": "a yojana, a league (a measure of distance, several miles)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. yojana"
      }
    ],
    "translation": {
      "text": "long is the league for the weary; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:2, verbatim"
    },
    "notes": "santa here = 'weary, tired', the past participle of sammati (√śram) — a homonym of santa 'calmed, at peace' (< √śam, as at Snp 1.8). Context (the long league) fixes the 'weary' sense.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:3",
    "pali": "Dīgho bālāna saṁsāro,",
    "words": [
      {
        "w": "Dīgho",
        "gloss": "long",
        "gram": "adj., nom. sg. m. (agreeing with saṁsāro)",
        "ped": "PED s.v. dīgha"
      },
      {
        "w": "bālāna",
        "gloss": "for/of fools (bāla; gen. pl., -āna for -ānaṁ metri causa)",
        "gram": "subst., gen. pl. m. (-āna for -ānaṁ, metrical)",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "saṁsāro,",
        "gloss": "the round of rebirth, transmigration, the faring-on (saṁsāra, from saṁsarati 'to wander on')",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. saṁsāra"
      }
    ],
    "translation": {
      "text": "long transmigrate the fools ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp60:4",
    "pali": "saddhammaṁ avijānataṁ.",
    "words": [
      {
        "w": "saddhammaṁ",
        "gloss": "= sad/sant + dhamma: the true teaching, the good Dhamma",
        "gram": "kammadhāraya cpd., acc. sg. m.",
        "ped": "PED s.v. saddhamma"
      },
      {
        "w": "avijānataṁ.",
        "gloss": "for those not understanding (a + vijānant, pres. part. of vijānāti 'to know'; gen. pl.)",
        "gram": "neg. pres. part. of vijānāti (vi + √ñā), gen. pl. m.",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "who don’t understand the true teaching. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp60:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp61:0",
    "pali": "Mahākassapasaddhivihārikavatthu",
    "words": [
      {
        "w": "Mahākassapasaddhivihārikavatthu",
        "gloss": "= Mahākassapa (the elder) + saddhivihārika 'co-resident pupil, fellow-dweller' + vatthu: 'the story of Mahākassapa's co-resident pupil'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. saddhivihārika; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp61:1",
    "pali": "Carañce nādhigaccheyya,",
    "words": [
      {
        "w": "Carañce",
        "gloss": "= caraṁ + ce (sandhi -ṁ + c- > -ñc-): 'if, while faring/wandering' — caraṁ (pres. part. of carati 'to go, live') + ce 'if'",
        "gram": "caraṁ: pres. part. of carati (√car), nom. sg. m.; ce: indecl. (conditional)",
        "ped": "PED s.v. carati; s.v. ce"
      },
      {
        "w": "nādhigaccheyya,",
        "gloss": "= na + adhigaccheyya (sandhi a + a > ā): 'should not find, obtain, meet with' (adhigacchati 'to attain, find', adhi + √gam; opt.)",
        "gram": "neg. + opt. 3 sg. of adhigacchati (adhi + √gam)",
        "ped": "PED s.v. adhigacchati"
      }
    ],
    "translation": {
      "text": "If while wandering you find no partner ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp61:1, verbatim"
    },
    "notes": "'Better to walk alone than with a fool.' The protasis runs across 61:1–2; the apodosis is 61:3.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp61:2",
    "pali": "Seyyaṁ sadisamattano;",
    "words": [
      {
        "w": "Seyyaṁ",
        "gloss": "a better one, a superior (seyya, comparative 'better')",
        "gram": "adj. (compar.), acc. sg. m.",
        "ped": "PED s.v. seyya"
      },
      {
        "w": "sadisamattano;",
        "gloss": "= sadisaṁ + attano (sandhi -ṁ + a- written -m-a-): 'an equal to oneself' — sadisa 'like, equal' + attano 'of oneself' (gen. of attan)",
        "gram": "sadisaṁ: adj., acc. sg. m.; attano: refl. n., gen. sg.",
        "ped": "PED s.v. sadisa; s.v. attan"
      }
    ],
    "translation": {
      "text": "equal or better than yourself, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp61:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp61:3",
    "pali": "Ekacariyaṁ daḷhaṁ kayirā,",
    "words": [
      {
        "w": "Ekacariyaṁ",
        "gloss": "= eka + cariyā: solitary faring, walking alone — eka 'one, alone' + cariyā 'conduct, going'",
        "gram": "tappurisa cpd., acc. sg. f.",
        "ped": "PED s.v. eka; s.v. cariyā"
      },
      {
        "w": "daḷhaṁ",
        "gloss": "firmly, resolutely (daḷha 'firm'; acc. as adv.)",
        "gram": "adj., acc. sg. nt. as adv.",
        "ped": "PED s.v. daḷha"
      },
      {
        "w": "kayirā,",
        "gloss": "should do, make (opt. of karoti, the archaic kayirā form)",
        "gram": "opt. 3 sg. of karoti (√kar)",
        "ped": "PED s.v. karoti"
      }
    ],
    "translation": {
      "text": "then firmly resolve to wander alone—",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp61:3, verbatim"
    },
    "notes": "Variant ekaccariyaṁ (mr).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp61:4",
    "pali": "Natthi bāle sahāyatā.",
    "words": [
      {
        "w": "Natthi",
        "gloss": "= na + atthi: 'there is not'",
        "gram": "neg. + pres. 3 sg. of atthi (√as)",
        "ped": "PED s.v. na²; s.v. atthi"
      },
      {
        "w": "bāle",
        "gloss": "in/with a fool (bāla; loc. sg.)",
        "gram": "subst., loc. sg. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "sahāyatā.",
        "gloss": "companionship, fellowship (sahāya 'companion' + abstract -tā)",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. sahāya"
      }
    ],
    "translation": {
      "text": "there’s no fellowship with fools. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp61:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp62:0",
    "pali": "Ānandaseṭṭhivatthu",
    "words": [
      {
        "w": "Ānandaseṭṭhivatthu",
        "gloss": "= Ānanda (the treasurer) + seṭṭhi 'treasurer, banker' + vatthu: 'the story of the treasurer Ānanda'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. seṭṭhi; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp62:1",
    "pali": "Puttā matthi dhanaṁ matthi,",
    "words": [
      {
        "w": "Puttā",
        "gloss": "sons, children",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. putta"
      },
      {
        "w": "matthi",
        "gloss": "= me + atthi: 'are mine' — me 'to/of me' (dat./gen. of ahaṁ) + atthi 'is/are'",
        "gram": "pron. (me, dat./gen. sg.) + pres. 3 sg. of atthi (√as)",
        "ped": "PED s.v. ahaṁ; s.v. atthi"
      },
      {
        "w": "dhanaṁ",
        "gloss": "wealth",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. dhana"
      },
      {
        "w": "matthi,",
        "gloss": "= me + atthi: 'is mine'",
        "gram": "pron. (me) + pres. 3 sg. of atthi (√as)",
        "ped": "PED s.v. ahaṁ; s.v. atthi"
      }
    ],
    "translation": {
      "text": "“Sons are mine, wealth is mine”—",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp62:1, verbatim"
    },
    "notes": "matthi = me + atthi ('are mine'), the fool's possessive thought. The editions split the sandhi differently: puttā matthi dhanammatthi (bj), puttā matthi dhanamatthi (sya-all), puttamatthi dhanamatthi (mr) — all resolving to the same me + atthi.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp62:2",
    "pali": "iti bālo vihaññati;",
    "words": [
      {
        "w": "iti",
        "gloss": "thus (marking the quoted thought)",
        "gram": "indecl. (quot.)",
        "ped": "PED s.v. iti"
      },
      {
        "w": "bālo",
        "gloss": "the fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "vihaññati;",
        "gloss": "is vexed, troubled, worn out (passive of vihanti 'to strike, distress', vi + √han)",
        "gram": "pres. pass. 3 sg. of vihanati (vi + √han)",
        "ped": "PED s.v. vihaññati"
      }
    ],
    "translation": {
      "text": "thus the fool frets. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp62:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp62:3",
    "pali": "Attā hi attano natthi,",
    "words": [
      {
        "w": "Attā",
        "gloss": "self, oneself",
        "gram": "refl. n., nom. sg. (attan)",
        "ped": "PED s.v. attan"
      },
      {
        "w": "hi",
        "gloss": "indeed, for (emphatic-causal particle); variant reading attāpi (?)",
        "gram": "indecl. (emph.-causal)",
        "ped": "PED s.v. hi"
      },
      {
        "w": "attano",
        "gloss": "to/of oneself (attan; gen./dat.)",
        "gram": "refl. n., gen./dat. sg.",
        "ped": "PED s.v. attan"
      },
      {
        "w": "natthi,",
        "gloss": "= na + atthi: 'is not'",
        "gram": "neg. + pres. 3 sg. of atthi (√as)",
        "ped": "PED s.v. na²; s.v. atthi"
      }
    ],
    "translation": {
      "text": "For even your self is not your own, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp62:3, verbatim"
    },
    "notes": "The apparatus records a variant reading attāpi (?) for hi. The wordplay attā (self) / attano (of the self) drives the verse: even the self is not one's own.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp62:4",
    "pali": "kuto puttā kuto dhanaṁ.",
    "words": [
      {
        "w": "kuto",
        "gloss": "whence? from where? (interrog. adv.)",
        "gram": "indecl. (interr. adv.)",
        "ped": "PED s.v. kuto"
      },
      {
        "w": "puttā",
        "gloss": "sons",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. putta"
      },
      {
        "w": "kuto",
        "gloss": "whence?",
        "gram": "indecl. (interr. adv.)",
        "ped": "PED s.v. kuto"
      },
      {
        "w": "dhanaṁ.",
        "gloss": "wealth",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. dhana"
      }
    ],
    "translation": {
      "text": "let alone your sons or wealth. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp62:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp63:0",
    "pali": "Gaṇṭhibhedakacoravatthu",
    "words": [
      {
        "w": "Gaṇṭhibhedakacoravatthu",
        "gloss": "= gaṇṭhibhedaka 'cut-purse' (one who cuts the knots of money-bags) + cora 'thief' + vatthu: 'the story of the pickpocket thief'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. cora; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp63:1",
    "pali": "Yo bālo maññati bālyaṁ,",
    "words": [
      {
        "w": "Yo",
        "gloss": "who, the one who",
        "gram": "rel. pron., nom. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "bālo",
        "gloss": "a fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "maññati",
        "gloss": "thinks, is aware of, knows (maññati, √man)",
        "gram": "pres. 3 sg. of maññati (√man)",
        "ped": "PED s.v. maññati"
      },
      {
        "w": "bālyaṁ,",
        "gloss": "foolishness, his folly (bālya, abstract of bāla)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. bālya"
      }
    ],
    "translation": {
      "text": "The fool who thinks they’re a fool ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp63:1, verbatim"
    },
    "notes": "The paradox verse: the fool who knows his folly is to that extent wise; the fool who fancies himself wise is the real fool.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp63:2",
    "pali": "paṇḍito vāpi tena so;",
    "words": [
      {
        "w": "paṇḍito",
        "gloss": "wise, a wise man",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. paṇḍita"
      },
      {
        "w": "vāpi",
        "gloss": "= vā + api: 'even, at least' (here 'even so, to that extent')",
        "gram": "indecl.",
        "ped": "PED s.v. vā; s.v. api"
      },
      {
        "w": "tena",
        "gloss": "by that, to that extent, therefore (ta; instr. as adv.)",
        "gram": "dem. pron., instr. sg. nt. as adv.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "so;",
        "gloss": "he",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta"
      }
    ],
    "translation": {
      "text": "is wise at least to that extent. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp63:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp63:3",
    "pali": "Bālo ca paṇḍitamānī,",
    "words": [
      {
        "w": "Bālo",
        "gloss": "a fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "ca",
        "gloss": "but, and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "paṇḍitamānī,",
        "gloss": "= paṇḍita + mānin: fancying oneself wise, conceited of being learned — paṇḍita 'wise' + mānin 'thinking, proud' (poss. -in stem)",
        "gram": "bahubbīhi cpd. adj. (poss. -in), nom. sg. m.",
        "ped": "PED s.v. paṇḍita; s.v. mānin"
      }
    ],
    "translation": {
      "text": "But the true fool is said to be one ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp63:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp63:4",
    "pali": "sa ve “bālo”ti vuccati.",
    "words": [
      {
        "w": "sa",
        "gloss": "he (the short nom. of ta)",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "ve",
        "gloss": "truly, indeed (asseverative particle)",
        "gram": "indecl. (emph.)",
        "ped": "PED s.v. ve"
      },
      {
        "w": "“bālo”ti",
        "gloss": "= bālo + ti (iti): '“a fool”' + the quotation particle; the quote marks are the Bilara segment punctuation",
        "gram": "bālo: m., nom. sg.; ti: quot. particle (iti)",
        "ped": "PED s.v. bāla; s.v. iti"
      },
      {
        "w": "vuccati.",
        "gloss": "is called (passive of vatti 'to say', √vac)",
        "gram": "pres. pass. 3 sg. of vatti (√vac)",
        "ped": "PED s.v. vuccati"
      }
    ],
    "translation": {
      "text": "who imagines that they are wise. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp63:4, verbatim"
    },
    "notes": "The curly quotation marks around bālo are the Bilara segment's own punctuation.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp64:0",
    "pali": "Udāyittheravatthu",
    "words": [
      {
        "w": "Udāyittheravatthu",
        "gloss": "= Udāyi (the elder) + thera 'elder' + vatthu: 'the story of the elder Udāyī'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp64:1",
    "pali": "Yāvajīvampi ce bālo,",
    "words": [
      {
        "w": "Yāvajīvampi",
        "gloss": "= yāva + jīvaṁ + pi: 'even for a whole lifetime, all life long' — yāva 'as long as' + jīva 'life' + api/pi 'even'",
        "gram": "adv. acc. + emph. particle",
        "ped": "PED s.v. yāva; s.v. jīva; s.v. api"
      },
      {
        "w": "ce",
        "gloss": "if",
        "gram": "indecl. (conditional)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "bālo,",
        "gloss": "a fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      }
    ],
    "translation": {
      "text": "Though a fool attends to the wise ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp64:1, verbatim"
    },
    "notes": "The spoon-and-soup twin (64/65): the fool who long attends a sage grasps the Dhamma no more than a spoon tastes the soup; the clever one, in a moment, like the tongue.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp64:2",
    "pali": "paṇḍitaṁ payirupāsati;",
    "words": [
      {
        "w": "paṇḍitaṁ",
        "gloss": "a wise person (paṇḍita; acc.)",
        "gram": "adj. as subst., acc. sg. m.",
        "ped": "PED s.v. paṇḍita"
      },
      {
        "w": "payirupāsati;",
        "gloss": "attends on, sits close to, associates with, serves (pari + upa + √ās 'to sit'; -ir- is metathesis of pari-)",
        "gram": "pres. 3 sg. of payirupāsati (pari + upa + √ās)",
        "ped": "PED s.v. payirupāsati"
      }
    ],
    "translation": {
      "text": "even for the rest of their life, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp64:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp64:3",
    "pali": "Na so dhammaṁ vijānāti,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "so",
        "gloss": "he",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the teaching, the truth (dhamma)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "vijānāti,",
        "gloss": "understands, knows (vi + √ñā)",
        "gram": "pres. 3 sg. of vijānāti",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "they still don’t understand the teaching, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp64:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp64:4",
    "pali": "dabbī sūparasaṁ yathā.",
    "words": [
      {
        "w": "dabbī",
        "gloss": "a spoon, ladle",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. dabbī"
      },
      {
        "w": "sūparasaṁ",
        "gloss": "= sūpa + rasa: the taste/flavour of the soup — sūpa 'soup, curry, broth' + rasa 'taste'",
        "gram": "tappurisa cpd., acc. sg. m.",
        "ped": "PED s.v. sūpa; s.v. rasa"
      },
      {
        "w": "yathā.",
        "gloss": "just as, like",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      }
    ],
    "translation": {
      "text": "like a spoon the taste of the soup. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp64:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp65:0",
    "pali": "Tiṁsapāveyyakabhikkhuvatthu",
    "words": [
      {
        "w": "Tiṁsapāveyyakabhikkhuvatthu",
        "gloss": "= tiṁsa 'thirty' + pāveyyaka 'of Pāvā' + bhikkhu 'monk' + vatthu: 'the story of the thirty monks of Pāvā'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. bhikkhu; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp65:1",
    "pali": "Muhuttamapi ce viññū,",
    "words": [
      {
        "w": "Muhuttamapi",
        "gloss": "= muhuttaṁ + api (sandhi -ṁ + a- written -m-a-): 'even for a moment' — muhutta 'a moment, short while' + api 'even'",
        "gram": "muhuttaṁ: m./nt., acc. sg. as adv.; api: emph. particle",
        "ped": "PED s.v. muhutta; s.v. api"
      },
      {
        "w": "ce",
        "gloss": "if",
        "gram": "indecl. (conditional)",
        "ped": "PED s.v. ce"
      },
      {
        "w": "viññū,",
        "gloss": "a wise, discerning person (viññū 'intelligent, knowing')",
        "gram": "adj. as subst., nom. sg. m.",
        "ped": "PED s.v. viññū"
      }
    ],
    "translation": {
      "text": "If a clever person attends to the wise ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp65:1, verbatim"
    },
    "notes": "Verse 65, the counterpart to 64, is glossed again in full.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp65:2",
    "pali": "paṇḍitaṁ payirupāsati;",
    "words": [
      {
        "w": "paṇḍitaṁ",
        "gloss": "a wise person (acc.)",
        "gram": "adj. as subst., acc. sg. m.",
        "ped": "PED s.v. paṇḍita"
      },
      {
        "w": "payirupāsati;",
        "gloss": "attends on, associates with (see 64:2)",
        "gram": "pres. 3 sg. of payirupāsati (pari + upa + √ās)",
        "ped": "PED s.v. payirupāsati"
      }
    ],
    "translation": {
      "text": "even just for an hour or so, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp65:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp65:3",
    "pali": "Khippaṁ dhammaṁ vijānāti,",
    "words": [
      {
        "w": "Khippaṁ",
        "gloss": "quickly, swiftly (khippa 'quick'; acc. as adv.)",
        "gram": "adj., acc. sg. nt. as adv.",
        "ped": "PED s.v. khippa"
      },
      {
        "w": "dhammaṁ",
        "gloss": "the teaching",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. dhamma"
      },
      {
        "w": "vijānāti,",
        "gloss": "understands, knows",
        "gram": "pres. 3 sg. of vijānāti",
        "ped": "PED s.v. vijānāti"
      }
    ],
    "translation": {
      "text": "they swiftly understand the teaching, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp65:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp65:4",
    "pali": "jivhā sūparasaṁ yathā.",
    "words": [
      {
        "w": "jivhā",
        "gloss": "the tongue",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. jivhā"
      },
      {
        "w": "sūparasaṁ",
        "gloss": "the taste of the soup (see 64:4)",
        "gram": "tappurisa cpd., acc. sg. m.",
        "ped": "PED s.v. sūpa; s.v. rasa"
      },
      {
        "w": "yathā.",
        "gloss": "just as, like",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yathā"
      }
    ],
    "translation": {
      "text": "like a tongue the taste of the soup. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp65:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp66:0",
    "pali": "Suppabuddhakuṭṭhivatthu",
    "words": [
      {
        "w": "Suppabuddhakuṭṭhivatthu",
        "gloss": "= Suppabuddha (name) + kuṭṭhi 'leper' + vatthu: 'the story of Suppabuddha the leper'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. kuṭṭhi; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. Suppabuddha the leper is the frame for the verse on fools who are their own enemy.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp66:1",
    "pali": "Caranti bālā dummedhā,",
    "words": [
      {
        "w": "Caranti",
        "gloss": "wander, go about, live (carati; 3 pl.)",
        "gram": "pres. 3 pl. of carati (√car)",
        "ped": "PED s.v. carati"
      },
      {
        "w": "bālā",
        "gloss": "fools",
        "gram": "m., nom. pl.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "dummedhā,",
        "gloss": "witless, of poor understanding (du 'bad' + medhā 'wisdom, intelligence')",
        "gram": "bahubbīhi cpd. adj., nom. pl. m.",
        "ped": "PED s.v. dummedha"
      }
    ],
    "translation": {
      "text": "Fools and simpletons behave ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp66:1, verbatim"
    },
    "notes": "'Fools go about being their own enemy' — the kamma-and-ripening theme; kaṭukapphala 'of bitter fruit' (66:4) is the key compound.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp66:2",
    "pali": "amitteneva attanā;",
    "words": [
      {
        "w": "amitteneva",
        "gloss": "= amittena + eva: 'as with an enemy indeed' — amitta 'enemy, non-friend' (a + mitta 'friend'; instr.) + eva",
        "gram": "amittena: m., instr. sg.; eva: emph. particle",
        "ped": "PED s.v. amitta; s.v. eva"
      },
      {
        "w": "attanā;",
        "gloss": "with/by oneself (attan; instr.)",
        "gram": "refl. n., instr. sg.",
        "ped": "PED s.v. attan"
      }
    ],
    "translation": {
      "text": "like their own worst enemies, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp66:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp66:3",
    "pali": "Karontā pāpakaṁ kammaṁ,",
    "words": [
      {
        "w": "Karontā",
        "gloss": "doing, making (pres. part. of karoti; nom. pl.)",
        "gram": "pres. part. of karoti (√kar), nom. pl. m.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "pāpakaṁ",
        "gloss": "bad, evil (pāpaka, from pāpa 'evil' + -ka)",
        "gram": "adj., acc. sg. nt.",
        "ped": "PED s.v. pāpaka"
      },
      {
        "w": "kammaṁ,",
        "gloss": "deed, action, kamma",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. kamma"
      }
    ],
    "translation": {
      "text": "doing wicked deeds ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp66:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp66:4",
    "pali": "yaṁ hoti kaṭukapphalaṁ.",
    "words": [
      {
        "w": "yaṁ",
        "gloss": "which",
        "gram": "rel. pron., nom. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "hoti",
        "gloss": "is, becomes",
        "gram": "pres. 3 sg. of hoti (√bhū)",
        "ped": "PED s.v. hoti"
      },
      {
        "w": "kaṭukapphalaṁ.",
        "gloss": "= kaṭuka + phala: of bitter fruit, bringing bitter results — kaṭuka 'sharp, bitter, pungent' + phala 'fruit' (-pph- geminate sandhi)",
        "gram": "bahubbīhi cpd. adj., nom. sg. nt.",
        "ped": "PED s.v. kaṭuka; s.v. phala"
      }
    ],
    "translation": {
      "text": "that ripen as bitter fruit. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp66:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp67:0",
    "pali": "Kassakavatthu",
    "words": [
      {
        "w": "Kassakavatthu",
        "gloss": "= kassaka 'farmer, ploughman' + vatthu: 'the story of the farmer'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. kassaka; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp67:1",
    "pali": "Na taṁ kammaṁ kataṁ sādhu,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "taṁ",
        "gloss": "that",
        "gram": "dem. pron., nom. sg. nt.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "kammaṁ",
        "gloss": "deed, action",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. kamma"
      },
      {
        "w": "kataṁ",
        "gloss": "done (pp. of karoti)",
        "gram": "pp., nom. sg. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "sādhu,",
        "gloss": "good, well (sādhu)",
        "gram": "adj./adv., nom. sg. nt.",
        "ped": "PED s.v. sādhu"
      }
    ],
    "translation": {
      "text": "It’s not good to do a deed ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp67:1, verbatim"
    },
    "notes": "The regretted-vs-unregretted-deed twin (67/68): a deed 'not well done' is one you weep over as its result ripens; the good deed you meet gladly.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp67:2",
    "pali": "yaṁ katvā anutappati;",
    "words": [
      {
        "w": "yaṁ",
        "gloss": "which",
        "gram": "rel. pron., acc. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "katvā",
        "gloss": "having done (absol. of karoti)",
        "gram": "ger. (absol.) of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "anutappati;",
        "gloss": "one regrets, is remorseful, burns afterwards (anu + tappati 'to be tormented', √tap)",
        "gram": "pres. 3 sg. of anutappati (anu + √tap)",
        "ped": "PED s.v. anutappati"
      }
    ],
    "translation": {
      "text": "that plagues you later on, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp67:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp67:3",
    "pali": "Yassa assumukho rodaṁ,",
    "words": [
      {
        "w": "Yassa",
        "gloss": "of/for whom (ya; gen. sg.)",
        "gram": "rel. pron., gen. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "assumukho",
        "gloss": "= assu + mukha: with tear-streaked face, tearful-faced — assu 'tear' + mukha 'face'",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. assu; s.v. mukha"
      },
      {
        "w": "rodaṁ,",
        "gloss": "weeping, crying (pres. part. of rodati 'to weep', √rud)",
        "gram": "pres. part. of rodati, nom. sg. m.",
        "ped": "PED s.v. rodati"
      }
    ],
    "translation": {
      "text": "for which you weep and wail, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp67:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp67:4",
    "pali": "vipākaṁ paṭisevati.",
    "words": [
      {
        "w": "vipākaṁ",
        "gloss": "the result, ripening, consequence (vipāka, of kamma)",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. vipāka"
      },
      {
        "w": "paṭisevati.",
        "gloss": "experiences, undergoes, reaps (paṭi + sevati 'to follow, pursue')",
        "gram": "pres. 3 sg. of paṭisevati (paṭi + √sev)",
        "ped": "PED s.v. paṭisevati"
      }
    ],
    "translation": {
      "text": "as its effect stays with you. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp67:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp68:0",
    "pali": "Sumanamālākāravatthu",
    "words": [
      {
        "w": "Sumanamālākāravatthu",
        "gloss": "= Sumana (name) + mālākāra 'garland-maker, florist' (mālā 'garland' + kāra 'maker') + vatthu: 'the story of Sumana the garland-maker'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. mālākāra; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated. Note the garland-word mālākāra 'garland-maker' in the title.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp68:1",
    "pali": "Tañca kammaṁ kataṁ sādhu,",
    "words": [
      {
        "w": "Tañca",
        "gloss": "= taṁ + ca (sandhi -ṁ + c- > -ñc-): 'and that'",
        "gram": "dem. pron., nom. sg. nt. + conj.",
        "ped": "PED s.v. ta; s.v. ca"
      },
      {
        "w": "kammaṁ",
        "gloss": "deed",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. kamma"
      },
      {
        "w": "kataṁ",
        "gloss": "done",
        "gram": "pp., nom. sg. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "sādhu,",
        "gloss": "good, well",
        "gram": "adj./adv., nom. sg. nt.",
        "ped": "PED s.v. sādhu"
      }
    ],
    "translation": {
      "text": "It is good to do a deed ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp68:1, verbatim"
    },
    "notes": "Verse 68, the good-deed counterpart, is glossed again in full.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp68:2",
    "pali": "yaṁ katvā nānutappati;",
    "words": [
      {
        "w": "yaṁ",
        "gloss": "which",
        "gram": "rel. pron., acc. sg. nt.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "katvā",
        "gloss": "having done",
        "gram": "ger. (absol.) of karoti (√kar)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "nānutappati;",
        "gloss": "= na + anutappati: 'one does not regret'",
        "gram": "neg. + pres. 3 sg. of anutappati (anu + √tap)",
        "ped": "PED s.v. na²; s.v. anutappati"
      }
    ],
    "translation": {
      "text": "that doesn’t plague you later on, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp68:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp68:3",
    "pali": "Yassa patīto sumano,",
    "words": [
      {
        "w": "Yassa",
        "gloss": "of/for whom",
        "gram": "rel. pron., gen. sg. m.",
        "ped": "PED s.v. ya"
      },
      {
        "w": "patīto",
        "gloss": "glad, pleased, satisfied (patīta, pp.; pra + √i, 'gladdened')",
        "gram": "pp. adj., nom. sg. m.",
        "ped": "PED s.v. patīta"
      },
      {
        "w": "sumano,",
        "gloss": "= su + mano: glad-minded, happy (su 'good' + mano 'mind')",
        "gram": "bahubbīhi cpd. adj., nom. sg. m.",
        "ped": "PED s.v. su; s.v. manas"
      }
    ],
    "translation": {
      "text": "that gladdens and cheers, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp68:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp68:4",
    "pali": "vipākaṁ paṭisevati.",
    "words": [
      {
        "w": "vipākaṁ",
        "gloss": "the result, ripening",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. vipāka"
      },
      {
        "w": "paṭisevati.",
        "gloss": "experiences, undergoes, reaps",
        "gram": "pres. 3 sg. of paṭisevati (paṭi + √sev)",
        "ped": "PED s.v. paṭisevati"
      }
    ],
    "translation": {
      "text": "as its effect stays with you. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp68:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp69:0",
    "pali": "Uppalavaṇṇattherīvatthu",
    "words": [
      {
        "w": "Uppalavaṇṇattherīvatthu",
        "gloss": "= Uppalavaṇṇā (the elder nun, 'lotus-hued') + therī 'elder nun' + vatthu: 'the story of the nun Uppalavaṇṇā'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. therī; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp69:1",
    "pali": "Madhuṁvā maññati bālo,",
    "words": [
      {
        "w": "Madhuṁvā",
        "gloss": "= madhuṁ + va (va = iva 'like'): 'as though it were honey' — madhu 'honey, sweet' + iva. Variant madhuvā",
        "gram": "madhuṁ: nt., acc. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. madhu; s.v. iva"
      },
      {
        "w": "maññati",
        "gloss": "thinks, imagines (maññati, √man)",
        "gram": "pres. 3 sg. of maññati (√man)",
        "ped": "PED s.v. maññati"
      },
      {
        "w": "bālo,",
        "gloss": "the fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      }
    ],
    "translation": {
      "text": "The fool imagines that evil is sweet, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp69:1, verbatim"
    },
    "notes": "'The fool thinks evil sweet as honey until it ripens.' Variant madhuvā (bj, sya-all, pts1ed, pts2ed) — i.e. madhu + vā rather than the Mahāsaṅgīti's fused Madhuṁvā (madhuṁ + va = iva).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp69:2",
    "pali": "yāva pāpaṁ na paccati;",
    "words": [
      {
        "w": "yāva",
        "gloss": "as long as, until",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yāva"
      },
      {
        "w": "pāpaṁ",
        "gloss": "evil, the evil deed (pāpa)",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. pāpa"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "paccati;",
        "gloss": "ripens, matures, 'is cooked' (paccati, intr./pass. of pacati 'to cook', √pac; here of kamma ripening)",
        "gram": "pres. 3 sg. of paccati (√pac)",
        "ped": "PED s.v. paccati"
      }
    ],
    "translation": {
      "text": "so long as it has not yet ripened. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp69:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp69:3",
    "pali": "Yadā ca paccati pāpaṁ,",
    "words": [
      {
        "w": "Yadā",
        "gloss": "when",
        "gram": "indecl. (rel. adv.)",
        "ped": "PED s.v. yadā"
      },
      {
        "w": "ca",
        "gloss": "and, but",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "paccati",
        "gloss": "ripens",
        "gram": "pres. 3 sg. of paccati (√pac)",
        "ped": "PED s.v. paccati"
      },
      {
        "w": "pāpaṁ,",
        "gloss": "evil",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. pāpa"
      }
    ],
    "translation": {
      "text": "But as soon as that evil ripens, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp69:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp69:4",
    "pali": "atha dukkhaṁ nigacchati.",
    "words": [
      {
        "w": "atha",
        "gloss": "then",
        "gram": "indecl. (conj.)",
        "ped": "PED s.v. atha"
      },
      {
        "w": "dukkhaṁ",
        "gloss": "suffering, pain (dukkha)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. dukkha"
      },
      {
        "w": "nigacchati.",
        "gloss": "comes to, undergoes, falls into (ni + gacchati 'to go down/into', √gam)",
        "gram": "pres. 3 sg. of nigacchati (ni + √gam)",
        "ped": "PED s.v. nigacchati"
      }
    ],
    "translation": {
      "text": "they fall into suffering. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp69:4, verbatim"
    },
    "notes": "Variants add bālo: atha bālo (bj, sya-all, pts1ed, pts2ed) 'then the fool...'; bālo (mr).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp70:0",
    "pali": "Jambukattheravatthu",
    "words": [
      {
        "w": "Jambukattheravatthu",
        "gloss": "= Jambuka (the elder, an ascetic) + thera + vatthu: 'the story of the elder Jambuka'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. thera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp70:1",
    "pali": "Māse māse kusaggena,",
    "words": [
      {
        "w": "Māse",
        "gloss": "in a month (māsa; loc.); reduplicated for 'month after month'",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. māsa"
      },
      {
        "w": "māse",
        "gloss": "month (repeated — 'month after month')",
        "gram": "m., loc. sg.",
        "ped": "PED s.v. māsa"
      },
      {
        "w": "kusaggena,",
        "gloss": "= kusa + agga: with the tip of a kusa-grass blade — kusa 'kusa grass' + agga 'tip, point'; instr. (a tiny morsel of food)",
        "gram": "tappurisa cpd., instr. sg. nt.",
        "ped": "PED s.v. kusa; s.v. agga"
      }
    ],
    "translation": {
      "text": "Month after month a fool may eat ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp70:1, verbatim"
    },
    "notes": "The reduplication māse māse = distributive 'month after month'. The verse: extreme fasting-austerity is not worth a sixteenth of one who has comprehended the Dhamma.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp70:2",
    "pali": "bālo bhuñjeyya bhojanaṁ;",
    "words": [
      {
        "w": "bālo",
        "gloss": "the fool",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "bhuñjeyya",
        "gloss": "might eat, should eat (opt. of bhuñjati 'to eat', √bhuj)",
        "gram": "opt. 3 sg. of bhuñjati (√bhuj)",
        "ped": "PED s.v. bhuñjati"
      },
      {
        "w": "bhojanaṁ;",
        "gloss": "food, a meal (bhojana)",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. bhojana"
      }
    ],
    "translation": {
      "text": "food from a grass-blade’s tip; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp70:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp70:3",
    "pali": "Na so saṅkhātadhammānaṁ,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "so",
        "gloss": "he",
        "gram": "dem. pron., nom. sg. m.",
        "ped": "PED s.v. ta"
      },
      {
        "w": "saṅkhātadhammānaṁ,",
        "gloss": "= saṅkhāta + dhamma: of those who have comprehended the teaching — saṅkhāta 'reckoned, comprehended' (pp.) + dhamma; gen. pl. Variant saṅkhata-",
        "gram": "cpd. adj. as subst., gen. pl. m.",
        "ped": "PED s.v. saṅkhāta; s.v. dhamma"
      }
    ],
    "translation": {
      "text": "but they’ll never be worth a sixteenth part ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp70:3, verbatim"
    },
    "notes": "Variant saṅkhatadhammānaṁ (bj, pts1ed, pts2ed, mr) — a one-letter difference (saṅkhāta 'comprehended, reckoned' vs saṅkhata 'conditioned, reckoned up') that shifts the nuance; both readings recorded, neither resolved.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp70:4",
    "pali": "kalaṁ agghati soḷasiṁ.",
    "words": [
      {
        "w": "kalaṁ",
        "gloss": "a fraction, a part (kalā, esp. a sixteenth part)",
        "gram": "f., acc. sg.",
        "ped": "PED s.v. kalā"
      },
      {
        "w": "agghati",
        "gloss": "is worth, is equal to (agghati 'to be worth')",
        "gram": "pres. 3 sg. of agghati",
        "ped": "PED s.v. agghati"
      },
      {
        "w": "soḷasiṁ.",
        "gloss": "a sixteenth (soḷasī, from soḷasa 'sixteen'); 'kalaṁ soḷasiṁ' = a sixteenth part",
        "gram": "fractional/ordinal adj., acc. sg. f.",
        "ped": "PED s.v. soḷasa"
      }
    ],
    "translation": {
      "text": "of one who has appraised the teaching. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp70:4, verbatim"
    },
    "notes": "Idiom: 'not worth a sixteenth part' (kalaṁ soḷasiṁ) = of negligible value.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp71:0",
    "pali": "Ahipetavatthu",
    "words": [
      {
        "w": "Ahipetavatthu",
        "gloss": "= ahi 'snake' + peta 'ghost, departed spirit' + vatthu: 'the story of the snake-ghost (the peta shaped like a snake)'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. ahi; s.v. peta; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp71:1",
    "pali": "Na hi pāpaṁ kataṁ kammaṁ,",
    "words": [
      {
        "w": "Na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "PED s.v. na²"
      },
      {
        "w": "hi",
        "gloss": "for, indeed",
        "gram": "indecl. (emph.-causal)",
        "ped": "PED s.v. hi"
      },
      {
        "w": "pāpaṁ",
        "gloss": "evil (an evil deed)",
        "gram": "adj., nom. sg. nt.",
        "ped": "PED s.v. pāpa"
      },
      {
        "w": "kataṁ",
        "gloss": "done (pp. of karoti)",
        "gram": "pp., nom. sg. nt.",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "kammaṁ,",
        "gloss": "deed, action",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. kamma"
      }
    ],
    "translation": {
      "text": "For a wicked deed that has been done ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp71:1, verbatim"
    },
    "notes": "The ash-covered-fire simile: an evil deed does not ripen at once (like milk that curdles the same day) but, smouldering like fire hidden under ash, follows the fool and burns him later.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp71:2",
    "pali": "Sajjukhīraṁva muccati;",
    "words": [
      {
        "w": "Sajjukhīraṁva",
        "gloss": "= sajju + khīra + va (va = iva 'like'): 'like fresh (same-day) milk' — sajju 'at once, on the same day' + khīra 'milk' + iva",
        "gram": "sajjukhīraṁ: tappurisa cpd., nt., nom./acc. sg.; va: indecl. (= iva)",
        "ped": "PED s.v. sajju; s.v. khīra; s.v. iva"
      },
      {
        "w": "muccati;",
        "gloss": "curdles, turns (lit. 'is released, freed'; here of milk turning) — the deed does not so 'turn' at once",
        "gram": "pres. 3 sg. of muccati (√muc)",
        "ped": "PED s.v. muccati"
      }
    ],
    "translation": {
      "text": "does not curdle quickly like milk. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp71:2, verbatim"
    },
    "notes": "The point: an evil deed does NOT 'turn'/bring its result at once, the way milk curdles the same day.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp71:3",
    "pali": "Ḍahantaṁ bālamanveti,",
    "words": [
      {
        "w": "Ḍahantaṁ",
        "gloss": "burning, smouldering (pres. part. of ḍahati 'to burn', √dah)",
        "gram": "pres. part. of ḍahati (√dah), acc. sg. m.",
        "ped": "PED s.v. ḍahati"
      },
      {
        "w": "bālamanveti,",
        "gloss": "= bālaṁ + anveti (sandhi -ṁ + a- written -m-a-): 'follows the fool' — bāla 'fool' + anveti 'follows' (anu + eti)",
        "gram": "bālaṁ: m., acc. sg.; anveti: pres. 3 sg. of anveti (anu + √i)",
        "ped": "PED s.v. bāla; s.v. anveti"
      }
    ],
    "translation": {
      "text": "Smoldering, it follows the fool, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp71:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp71:4",
    "pali": "Bhasmacchannova pāvako.",
    "words": [
      {
        "w": "Bhasmacchannova",
        "gloss": "= bhasmā + channa + va (va = iva 'like'): 'like a fire covered over with ash' — bhasman 'ashes' + channa (pp. of chādeti 'to cover') + iva",
        "gram": "bhasmacchanno: bahubbīhi cpd. adj., nom. sg. m.; va: indecl. (= iva)",
        "ped": "PED s.v. bhasma; s.v. chādeti; s.v. iva"
      },
      {
        "w": "pāvako.",
        "gloss": "fire (pāvaka 'fire, the purifier')",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. pāvaka"
      }
    ],
    "translation": {
      "text": "like a fire smothered over with ash. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp71:4, verbatim"
    },
    "notes": "Variants bhasmā channova (sya-all, mr) 'covered by ash', bhasmācchannova (pts1ed, pts2ed).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp72:0",
    "pali": "Saṭṭhikūṭapetavatthu",
    "words": [
      {
        "w": "Saṭṭhikūṭapetavatthu",
        "gloss": "= Saṭṭhikūṭa (name, 'sixty-hammer', the peta struck by sixty hammers) + peta 'ghost' + vatthu: 'the story of the hammer-struck ghost'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. peta; s.v. vatthu"
      }
    ],
    "translation": {
      "text": "",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp72:0, verbatim"
    },
    "notes": "Story-title (vatthu). Uniquely among the vagga's vatthu titles, Sujato's Bilara file DOES carry a segment for dhp72:0, but its value is the empty string; the translation is preserved verbatim as \"\" (empty), not null. The Saṭṭhikūṭa-peta is a ghost struck by sixty hammers — the frame for 'the fool's fame destroys him'.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp72:1",
    "pali": "Yāvadeva anatthāya,",
    "words": [
      {
        "w": "Yāvadeva",
        "gloss": "= yāva + d + eva (the -d- is the historical sandhi consonant): 'only just, merely, precisely to the extent that' — yāva 'as far as' + eva 'just'",
        "gram": "indecl. (adv. phrase)",
        "ped": "PED s.v. yāva; s.v. eva"
      },
      {
        "w": "anatthāya,",
        "gloss": "for harm, to (one's) detriment (an + attha 'good, benefit' > anattha 'harm'; dat. of purpose)",
        "gram": "m., dat. sg.",
        "ped": "PED s.v. attha¹"
      }
    ],
    "translation": {
      "text": "Whatever fame a fool may get, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp72:1, verbatim"
    },
    "notes": "'Whatever fame a fool gets is only to his harm.' yāvadeva = 'only just, merely, to the extent only that'.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp72:2",
    "pali": "ñattaṁ bālassa jāyati;",
    "words": [
      {
        "w": "ñattaṁ",
        "gloss": "knowledge, renown, fame — what is known (ñatta, from ñāta 'known'); here the fool's reputation/cleverness. Variant ñāttaṁ",
        "gram": "nt., nom. sg.",
        "ped": "PED s.v. ñatta"
      },
      {
        "w": "bālassa",
        "gloss": "of the fool (bāla; gen.)",
        "gram": "subst., gen. sg. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "jāyati;",
        "gloss": "arises, is born (jāyati, √jan)",
        "gram": "pres. 3 sg. of jāyati (√jan)",
        "ped": "PED s.v. jāyati"
      }
    ],
    "translation": {
      "text": "it only gives rise to harm. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp72:2, verbatim"
    },
    "notes": "Variant ñāttaṁ (?) in the apparatus. The sense 'renown, cleverness, what-is-known' fits Sujato's 'fame'.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp72:3",
    "pali": "Hanti bālassa sukkaṁsaṁ,",
    "words": [
      {
        "w": "Hanti",
        "gloss": "strikes, destroys, kills (hanati/hanti, √han)",
        "gram": "pres. 3 sg. of hanti (√han)",
        "ped": "PED s.v. hanti"
      },
      {
        "w": "bālassa",
        "gloss": "of the fool (gen.)",
        "gram": "subst., gen. sg. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "sukkaṁsaṁ,",
        "gloss": "= sukka + aṁsa: the bright/good portion, the share of merit — sukka 'bright, white, good' + aṁsa 'portion, share'",
        "gram": "tappurisa cpd., acc. sg. m.",
        "ped": "PED s.v. sukka; s.v. aṁsa"
      }
    ],
    "translation": {
      "text": "Whatever good features they have it ruins, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp72:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp72:4",
    "pali": "muddhamassa vipātayaṁ.",
    "words": [
      {
        "w": "muddhamassa",
        "gloss": "= muddhaṁ + assa (sandhi -ṁ + a- written -m-a-): 'his head' — muddhā 'head, crown, top' (acc. muddhaṁ) + assa 'his' (gen. of ta)",
        "gram": "muddhaṁ: m., acc. sg.; assa: dem. pron., gen. sg. m.",
        "ped": "PED s.v. muddhā; s.v. ta"
      },
      {
        "w": "vipātayaṁ.",
        "gloss": "splitting, cleaving, making fall (pres. part. of vipāteti, causative 'to split, destroy', vi + √pat)",
        "gram": "pres. part. (caus.) of vipāteti (vi + √pat), nom. sg. m.",
        "ped": "PED s.v. vipāteti"
      }
    ],
    "translation": {
      "text": "and blows their head into bits. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp72:4, verbatim"
    },
    "notes": "muddhā 'head' is both literal and figurative (the 'head' = wisdom, the crown of understanding).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp73:0",
    "pali": "Cittagahapativatthu",
    "words": [
      {
        "w": "Cittagahapativatthu",
        "gloss": "= Citta (the householder) + gahapati 'householder' + vatthu: 'the story of Citta the householder'",
        "gram": "tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. gahapati; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp73:1",
    "pali": "Asantaṁ bhāvanamiccheyya,",
    "words": [
      {
        "w": "Asantaṁ",
        "gloss": "what is not (real/deserved); here 'the esteem he does not have/deserve' (a + sant 'being, existing')",
        "gram": "neg. pres. part. (sant) adj., acc. sg. f. (agreeing with bhāvanaṁ)",
        "ped": "PED s.v. sant"
      },
      {
        "w": "bhāvanamiccheyya,",
        "gloss": "= bhāvanaṁ + iccheyya (sandhi -ṁ + i- written -m-i-): 'would desire esteem/recognition' — bhāvanā here 'esteem, regard, being made much of' (from bhāveti 'to develop, make become'; NOT 'meditation' in this context) + iccheyya 'would wish' (opt. of icchati)",
        "gram": "bhāvanaṁ: f., acc. sg.; iccheyya: opt. 3 sg. of icchati (√is)",
        "ped": "PED s.v. bhāvanā; s.v. icchati"
      }
    ],
    "translation": {
      "text": "They’d seek the esteem that they lack, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp73:1, verbatim"
    },
    "notes": "The ambitious-fool verses (73/74): a string of accusatives (bhāvanā, purekkhāra, issariya, pūjā) governed by iccheyya 'would desire'. bhāvanā here is not 'meditation' but 'esteem, being made much of' (so the commentary and Sujato). Variants asantaṁ bhāvamiccheyya (sya-all), asantabhāvanamiccheyya (mr).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp73:2",
    "pali": "Purekkhārañca bhikkhusu;",
    "words": [
      {
        "w": "Purekkhārañca",
        "gloss": "= purekkhāraṁ + ca (sandhi -ṁ + c- > -ñc-): 'and precedence, deference, being put first' — purekkhāra 'honouring, putting in front' (pure 'before' + kāra 'making')",
        "gram": "purekkhāraṁ: m., acc. sg.; ca: conj.",
        "ped": "PED s.v. purekkhāra; s.v. ca"
      },
      {
        "w": "bhikkhusu;",
        "gloss": "among the monks (bhikkhu; loc. pl.)",
        "gram": "m., loc. pl.",
        "ped": "PED s.v. bhikkhu"
      }
    ],
    "translation": {
      "text": "and status among the mendicants; ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp73:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp73:3",
    "pali": "Āvāsesu ca issariyaṁ,",
    "words": [
      {
        "w": "Āvāsesu",
        "gloss": "in the dwellings, monasteries (āvāsa 'dwelling, residence'; loc. pl.)",
        "gram": "m., loc. pl.",
        "ped": "PED s.v. āvāsa"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "issariyaṁ,",
        "gloss": "lordship, authority, mastery (issariya, from issara 'lord')",
        "gram": "nt., acc. sg.",
        "ped": "PED s.v. issariya"
      }
    ],
    "translation": {
      "text": "authority over monasteries, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp73:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp73:4",
    "pali": "Pūjaṁ parakulesu ca.",
    "words": [
      {
        "w": "Pūjaṁ",
        "gloss": "honour, worship, homage (pūjā)",
        "gram": "f., acc. sg.",
        "ped": "PED s.v. pūjā"
      },
      {
        "w": "parakulesu",
        "gloss": "= para + kula: among other families — para 'other' + kula 'family'; loc. pl.",
        "gram": "cpd., loc. pl. nt.",
        "ped": "PED s.v. para; s.v. kula"
      },
      {
        "w": "ca.",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      }
    ],
    "translation": {
      "text": "and honor among other families. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp73:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:1",
    "pali": "Mameva kata maññantu,",
    "words": [
      {
        "w": "Mameva",
        "gloss": "= mama + eva: 'by me alone, mine only' — mama 'my, of me' (gen. of ahaṁ) + eva 'just'",
        "gram": "pron. (mama, gen. sg.) + emph. particle",
        "ped": "PED s.v. ahaṁ; s.v. eva"
      },
      {
        "w": "kata",
        "gloss": "done (kata, pp. of karoti; the deed 'done', with -ṁ elided before maññantu)",
        "gram": "pp. of karoti (√kar), nom./acc. sg. nt. (kataṁ, nasal elided)",
        "ped": "PED s.v. karoti"
      },
      {
        "w": "maññantu,",
        "gloss": "let them think (imper. 3 pl. of maññati)",
        "gram": "imper. 3 pl. of maññati (√man)",
        "ped": "PED s.v. maññati"
      }
    ],
    "translation": {
      "text": "“Let both layfolk and renunciants think ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:1, verbatim"
    },
    "notes": "The fool's inner speech (74:1–4) closes with 'thus grow his desire and conceit' (74:5–6).",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:2",
    "pali": "gihī pabbajitā ubho;",
    "words": [
      {
        "w": "gihī",
        "gloss": "laypeople, householders (gihin 'householder'; nom. pl.)",
        "gram": "subst. (poss. -in stem), nom. pl. m.",
        "ped": "PED s.v. gihin"
      },
      {
        "w": "pabbajitā",
        "gloss": "those gone forth, renunciants (pabbajita, pp. of pabbajati 'to go forth')",
        "gram": "pp. as subst., nom. pl. m.",
        "ped": "PED s.v. pabbajati"
      },
      {
        "w": "ubho;",
        "gloss": "both",
        "gram": "numeral adj., nom. pl. m.",
        "ped": "PED s.v. ubho"
      }
    ],
    "translation": {
      "text": "the work was done by me alone. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:3",
    "pali": "Mamevātivasā assu,",
    "words": [
      {
        "w": "Mamevātivasā",
        "gloss": "= mama + eva + ativasā (sandhi): 'under my sway alone' — mama 'my' + eva 'only' + ativasa 'subject to, under (another's) control' (ati + vasa 'power')",
        "gram": "mama: gen. sg.; eva: particle; ativasā: adj., nom. pl. m.",
        "ped": "PED s.v. ahaṁ; s.v. eva; s.v. vasa"
      },
      {
        "w": "assu,",
        "gloss": "may they be (opt. 3 pl. of atthi 'to be')",
        "gram": "opt. 3 pl. of atthi (√as)",
        "ped": "PED s.v. atthi"
      }
    ],
    "translation": {
      "text": "In anything at all that’s to be done, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:4",
    "pali": "kiccākiccesu kismici;",
    "words": [
      {
        "w": "kiccākiccesu",
        "gloss": "= kicca + akicca: in things to be done and not to be done, in every kind of business — kicca 'what is to be done, duty' + akicca 'what should not be done' (a dvandva); loc. pl.",
        "gram": "dvandva cpd., loc. pl. nt.",
        "ped": "PED s.v. kicca; s.v. akicca"
      },
      {
        "w": "kismici;",
        "gloss": "in anything whatever (kismiṁ, loc. of ka 'what' + indefinitizing -ci)",
        "gram": "indef. pron., loc. sg. nt.",
        "ped": "PED s.v. ka¹"
      }
    ],
    "translation": {
      "text": "let them fall under my sway alone.” ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:5",
    "pali": "Iti bālassa saṅkappo,",
    "words": [
      {
        "w": "Iti",
        "gloss": "thus (closing the quoted thought)",
        "gram": "indecl. (quot.)",
        "ped": "PED s.v. iti"
      },
      {
        "w": "bālassa",
        "gloss": "of the fool (gen.)",
        "gram": "subst., gen. sg. m.",
        "ped": "PED s.v. bāla"
      },
      {
        "w": "saṅkappo,",
        "gloss": "thought, intention, aspiration (saṅkappa)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. saṅkappa"
      }
    ],
    "translation": {
      "text": "So thinks the fool, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:5, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp74:6",
    "pali": "icchā māno ca vaḍḍhati.",
    "words": [
      {
        "w": "icchā",
        "gloss": "desire, longing, wanting (icchā)",
        "gram": "f., nom. sg.",
        "ped": "PED s.v. icchā"
      },
      {
        "w": "māno",
        "gloss": "conceit, pride (māna)",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. māna"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (encl. conj.)",
        "ped": "PED s.v. ca"
      },
      {
        "w": "vaḍḍhati.",
        "gloss": "grows, increases (vaḍḍhati, √vṛdh)",
        "gram": "pres. 3 sg. of vaḍḍhati (√vaḍḍh)",
        "ped": "PED s.v. vaḍḍhati"
      }
    ],
    "translation": {
      "text": "their greed and pride only growing. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp74:6, verbatim"
    },
    "notes": "'icchā māno ca vaḍḍhati' — a singular verb (vaḍḍhati) with two subjects (icchā and māna), a common Pāli idiom.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:0",
    "pali": "Vanavāsitissasāmaṇeravatthu",
    "words": [
      {
        "w": "Vanavāsitissasāmaṇeravatthu",
        "gloss": "= vanavāsi 'forest-dwelling' + Tissa (the novice) + sāmaṇera 'novice' + vatthu: 'the story of the forest-dwelling novice Tissa'",
        "gram": "long tappurisa cpd., nom. sg. nt. (aṭṭhakathā apparatus)",
        "ped": "PED s.v. sāmaṇera; s.v. vatthu"
      }
    ],
    "translation": null,
    "notes": "Story-title (vatthu); untranslated.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:1",
    "pali": "Aññā hi lābhūpanisā,",
    "words": [
      {
        "w": "Aññā",
        "gloss": "one (thing), other, different (añña 'other')",
        "gram": "adj., nom. sg. f.",
        "ped": "PED s.v. añña"
      },
      {
        "w": "hi",
        "gloss": "for, indeed",
        "gram": "indecl. (emph.-causal)",
        "ped": "PED s.v. hi"
      },
      {
        "w": "lābhūpanisā,",
        "gloss": "= lābha + upanisā (sandhi a + u > ū): the means/requisite leading to gain — lābha 'gain, acquisition, profit' + upanisā 'cause, means, necessary condition'",
        "gram": "tappurisa cpd., nom. sg. f.",
        "ped": "PED s.v. lābha; s.v. upanisā"
      }
    ],
    "translation": {
      "text": "For the means to profit and the path to quenching ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:1, verbatim"
    },
    "notes": "The closing verse of the vagga: the requisite for worldly gain is one thing, the path to Nibbāna another — knowing which, the Buddha's disciple fosters seclusion, not honours.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:2",
    "pali": "aññā nibbānagāminī;",
    "words": [
      {
        "w": "aññā",
        "gloss": "another (thing)",
        "gram": "adj., nom. sg. f.",
        "ped": "PED s.v. añña"
      },
      {
        "w": "nibbānagāminī;",
        "gloss": "= nibbāna + gāminī: leading to Nibbāna — nibbāna 'quenching, extinction' + gāmin 'going, leading' (fem. -ī)",
        "gram": "cpd. adj. (poss. -in stem), nom. sg. f.",
        "ped": "PED s.v. nibbāna; s.v. gāmin"
      }
    ],
    "translation": {
      "text": "are two quite different things. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:2, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:3",
    "pali": "Evametaṁ abhiññāya,",
    "words": [
      {
        "w": "Evametaṁ",
        "gloss": "= evaṁ + etaṁ (sandhi -ṁ + e- written -m-e-): 'this thus, this fact' — evaṁ 'thus' + etaṁ 'this'",
        "gram": "evaṁ: indecl.; etaṁ: dem. pron., acc. sg. nt.",
        "ped": "PED s.v. evaṁ; s.v. eta"
      },
      {
        "w": "abhiññāya,",
        "gloss": "having directly known, fully understood (absol. of abhijānāti 'to know directly', abhi + √ñā)",
        "gram": "ger. (absol.) of abhijānāti (abhi + √ñā)",
        "ped": "PED s.v. abhijānāti"
      }
    ],
    "translation": {
      "text": "A mendicant disciple of the Buddha, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:3, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:4",
    "pali": "bhikkhu buddhassa sāvako;",
    "words": [
      {
        "w": "bhikkhu",
        "gloss": "a monk, mendicant",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. bhikkhu"
      },
      {
        "w": "buddhassa",
        "gloss": "of the Buddha, the Awakened One (buddha; gen.)",
        "gram": "m., gen. sg.",
        "ped": "PED s.v. buddha"
      },
      {
        "w": "sāvako;",
        "gloss": "a disciple, hearer (sāvaka, from suṇāti 'to hear')",
        "gram": "m., nom. sg.",
        "ped": "PED s.v. sāvaka"
      }
    ],
    "translation": {
      "text": "understanding what this really means, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:4, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:5",
    "pali": "Sakkāraṁ nābhinandeyya,",
    "words": [
      {
        "w": "Sakkāraṁ",
        "gloss": "honour, hospitality, favour (sakkāra 'homage, reverence')",
        "gram": "m., acc. sg.",
        "ped": "PED s.v. sakkāra"
      },
      {
        "w": "nābhinandeyya,",
        "gloss": "= na + abhinandeyya (sandhi a + a > ā): 'should not delight in, rejoice at' (abhi + nandati 'to be glad'; opt.)",
        "gram": "neg. + opt. 3 sg. of abhinandati (abhi + √nand)",
        "ped": "PED s.v. abhinandati"
      }
    ],
    "translation": {
      "text": "would never delight in honors, ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:5, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:6",
    "pali": "vivekamanubrūhaye.",
    "words": [
      {
        "w": "vivekamanubrūhaye.",
        "gloss": "= vivekaṁ + anubrūhaye (sandhi -ṁ + a- written -m-a-): 'should foster/cultivate seclusion' — viveka 'seclusion, detachment, aloofness' + anubrūhaye (opt. of anubrūheti 'to foster, increase, devote oneself to', anu + brūheti)",
        "gram": "vivekaṁ: m., acc. sg.; anubrūhaye: opt. 3 sg. of anubrūheti (anu + √bṛh)",
        "ped": "PED s.v. viveka; s.v. anubrūheti"
      }
    ],
    "translation": {
      "text": "but rather would foster seclusion. ",
      "source": "Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, Bilara, CC0 1.0), dhp75:6, verbatim"
    },
    "notes": null,
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  },
  {
    "ref": "dhp75:7",
    "pali": "Bālavaggo pañcamo.",
    "words": [
      {
        "w": "Bālavaggo",
        "gloss": "= bāla + vagga: the Fools Chapter",
        "gram": "tappurisa cpd., nom. sg. m.",
        "ped": "PED s.v. bāla; s.v. vagga"
      },
      {
        "w": "pañcamo.",
        "gloss": "the fifth (pañcama, ordinal)",
        "gram": "ordinal adj., nom. sg. m.",
        "ped": "PED s.v. pañcama"
      }
    ],
    "translation": null,
    "notes": "Vagga colophon ('The Fools Chapter, the fifth'). No Sujato segment for the colophon, so translation is null by fidelity to the source, not omission.",
    "section": "5. The Fool · Bālavagga (Dhp 60–75)"
  }
];
