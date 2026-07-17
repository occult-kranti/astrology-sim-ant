// ============================================================================
//  core/data/buddhist/heart.js  —  GENERATED, DO NOT HAND-EDIT.
//  Regenerate: node r30build/gen-buddhist.cjs (reads r29data/*.json verbatim).
//
//  The Heart Sūtra (Prajñāpāramitāhṛdaya, shorter Sanskrit recension) — word-by-word.
//  Records use `sanskrit` (IAST, NFC), not `pali`; the per-word `ped` field carries
//  Monier-Williams citations ("MW s.v. …"), documented in HEART_META.conventions.ped.
//  Translation: F. Max Müller, SBE 49 (1894; PD) — reproduced VERBATIM in his orthography.
//  Sanskrit witness: Müller–Nanjio 1884, given in normalised IAST (HEART_META.conventions).
//  Glosses/gram: original prose, MW-informed (MW 1899, PD) — original.
//  Reconstruction invariant: words[].w.join(" ") === record.sanskrit (16/16).
//  HEART_META.contested carries the 3 both-ways blocks (Nattier origins etc.). DOM-free.
// ============================================================================

export const HEART_META = {
  "title": "The Heart Sūtra (Prajñāpāramitāhṛdaya, shorter Sanskrit recension) — word-by-word",
  "text": "The shorter (smaller) Prajñā-pāramitā-hṛdaya-sūtra. Sanskrit root segmented into 16 records and glossed word-by-word; English translation layer = F. Max Müller's verbatim rendering in the Sacred Books of the East, vol. 49 (1894). Homage + body + mantra + colophon.",
  "source": {
    "sanskrit": "Root witness of record: F. Max Müller & Bunyiu Nanjio, 'The Ancient Palm-Leaves containing the Pragñâ-pâramitâ-hridaya-sûtra and the Ushnîsha-vigaya-dhâranî', Anecdota Oxoniensia, Aryan Series vol. I part III (Oxford: Clarendon Press, 1884) — their 'Shorter Text Restored' of the smaller Prajñāpāramitāhṛdaya (edited from the Hōryū-ji / Horiuzi palm-leaf ms). PD by age. Archive.org item TheAncientPalmLeavesMuller (The_ancient_palm_leaves_Muller_djvu.txt), 'Shorter Text Restored', p.48–49 of the reprint pagination. See conventions.sanskritWitness for why the text is given here in normalized IAST rather than copied from the scan.",
    "translation": "F. Max Müller, 'The Smaller Pragñâ-pâramitâ-hridaya-sûtra', in Buddhist Mahâyâna Texts (SBE vol. 49, Oxford: Clarendon Press, 1894), pp. 153–154. Reproduced VERBATIM. Archive.org item buddhistmahy02cowe (buddhistmahy02cowe_djvu.txt), lines 10939–11003. PD by age (published 1894).",
    "glosses": "Original prose written for this wing, informed by Monier Monier-Williams, 'A Sanskrit-English Dictionary' (Oxford, 1899; US-PD by age), cited per word as 'MW s.v. <headword>'. No copyrighted lexicon text is reproduced; grammatical facts (case, number, tense, compound resolution) are uncopyrightable."
  },
  "licenses": {
    "translation": "pd-age. Müller's SBE 49 translation (1894) is US-public-domain under the 95-year publication rule (site policy baseline: pre-1931 => US-PD). The plan (§1.8) names this the Heart Sūtra's quotable PD witness.",
    "sanskrit": "pd-age. The underlying canonical text is ancient and uncopyrightable; the Müller–Nanjio 1884 edition (the witness of record) is PD by age. The IAST presented here is a normalization of that received shorter recension (conventions.sanskritWitness).",
    "glosses": "original (written for this wing); MW-informed and MW-cited. Monier-Williams 1899 is itself pd-age.",
    "mw": "Monier-Williams, A Sanskrit-English Dictionary (Oxford 1899) — US-PD by the 95-year rule.",
    "excluded": "Edward Conze's editions and translations of the Heart Sūtra (1948–1975) are copyrighted and are CITE-ONLY here — never reproduced. Conze's normalized Sanskrit and his English register ('gone, gone, gone beyond...') are his; where this file's readings differ from Conze's familiar text, the difference is flagged in notes, not silently harmonized to him."
  },
  "counts": {
    "records": 16,
    "segments": 16,
    "wordRecords": 132,
    "homageSegments": 1,
    "bodySegments": 13,
    "mantraSegments": 1,
    "colophonSegments": 1,
    "countNote": "16 segment records (hrdaya:0 homage … hrdaya:15 colophon); 132 word records. Concatenating each record's words[].w with single spaces reconstructs its sanskrit string exactly (reconstruction invariant, verified)."
  },
  "conventions": {
    "ref": "Synthetic segment IDs hrdaya:0 … hrdaya:15 (the shorter text has no community-standard segment scheme comparable to SuttaCentral's Bilara IDs; Conze's numbered sections are copyrighted apparatus and are not used). The IDs are this wing's own, documented here.",
    "sanskrit": "The record's Sanskrit surface string, NFC, in IAST (Roman). Anusvāra is written ṃ uniformly; avagraha (elided initial a- after -o/-e) is written with an ASCII apostrophe ' fused to the following token (e.g. 'nuttaramantro = anuttaramantraḥ).",
    "sanskritWitness": "The witness of record is Müller–Nanjio 1884, whose 'Shorter Text Restored' is printed in DEVANAGARI (not roman); the only public full-text scan (archive.org) OCRs that Devanagari — and the SBE 49 romanized proper nouns — too corruptly to copy mechanically. The Sanskrit is therefore given in modern IAST as the received shorter recension that Müller–Nanjio restored and that Müller (SBE 49) translated sentence-by-sentence; the English translation (which IS reproduced verbatim from clean text) is the alignment control. Every point where the Hōryū-ji/Müller reading is peculiar, or where the familiar Conze (cite-only) normalization differs, is flagged in the record's notes. This is a documented reconstruction of a PD witness, not a transcription of a copyrighted edition. No Devanagari column is shipped because no reliable PD Devanagari source was transcribable (honest omission).",
    "translationText": "Müller's SBE 49 (1894) English, verbatim, in his orthography (Sâriputra, Pragñâpâramitâ, Nirvâna, Svâhâ; palatal ś→'s', palatal j→italic 'g', ṣ→'sh'). OCR diacritic corruption in the scan was regularized to Müller's own printed SBE forms; wording, punctuation, '&c.' abbreviations and em-dashes are preserved exactly. His parenthetical editorial glosses (the eighteen dhātus at hrdaya:8) are kept as printed and marked as his.",
    "reconstruction": "words[].w are the exact whitespace-delimited surface tokens of sanskrit (punctuation/avagraha attached); joining them with single spaces rebuilds the sanskrit string exactly.",
    "sandhi": "Following the wing's Metta convention: sandhi-fused or compound tokens are NEVER split into multiple entries (that would break reconstruction). A fused/compound token gets ONE entry whose gloss opens '= a + b (+ …): …', whose gram gives each member's morphology in order, and whose ped (here an MW citation) may list several headwords ('MW s.v. a; s.v. b').",
    "ped": "For this SANSKRIT text the per-word citation field is named 'ped' for shape-uniformity with the wing's Pāli modules, but it carries MONIER-WILLIAMS citations ('MW s.v. <headword>'), never PED. null only for pure sandhi/avagraha notes with no distinct headword.",
    "gram": "Abbreviations: nom./acc./instr./dat./abl./gen./loc./voc. (cases), sg./du./pl. (number), m./f./nt. (gender), adj., subst., pron., indecl.; pres. (present), impf., aor.; ppp. (past passive participle), pres.part., ger. (gerund/absolutive in -ya/-tvā), gdv. (gerundive), inf.; cpd. (compound; tatpuruṣa/karmadhāraya/dvandva/bahuvrīhi named where useful); √ marks a verbal root; 'sma + pres.' = the sma-periphrasis giving past sense.",
    "notes": "notes is null or prose; contested/variant points state positions with sources and are never resolved. Described, never prescribed: the sūtra's claims (emptiness of the aggregates, no attainment, the Buddhas' awakening) are reported as what the text says; the mantra is transliterated and glossed as language, explicitly NOT presented as efficacious (see hrdaya:14)."
  },
  "contested": [
    {
      "id": "heart-origins",
      "title": "Origins of the shorter Heart Sūtra — Chinese apocryphon vs Indian composition (FLAGGED, never resolved)",
      "positions": [
        {
          "label": "Chinese back-translation thesis",
          "claim": "The shorter Heart Sūtra was composed in China, not India: its core was extracted from Kumārajīva's Chinese translation of the Large Prajñāpāramitā (the Dà zhìdù lùn tradition) and later back-translated into Sanskrit; the Sanskrit text we have is thus a retro-version, which would explain features like its wording of the 'form/emptiness' passage matching the Chinese rather than any known Indian Large-Sūtra Sanskrit.",
          "sources": "Jan Nattier, 'The Heart Sūtra: A Chinese Apocryphal Text?', Journal of the International Association of Buddhist Studies 15.2 (1992), 153–223. Later philological support: Jayarava Attwood, several papers in the Journal of the Oxford Centre for Buddhist Studies (2015– )."
        },
        {
          "label": "Indian-composition / traditionalist defense",
          "claim": "The sūtra is an Indian Prajñāpāramitā condensation (a genuine hṛdaya 'heart/dhāraṇī' extract) transmitted from India; the parallels with the Chinese Large Sūtra reflect shared source material or Kumārajīva's fidelity, not Chinese authorship. Critics argue Nattier's evidence is consistent with Indian origin.",
          "sources": "Harada Wasō and Ishii Kōsei (Japanese critiques of Nattier, 2000s); Red Pine (Bill Porter), 'The Heart Sutra' (2004), traditionalist reading. (Conze's own view of Indian origin is noted as historical context; his editions remain cite-only.)"
        }
      ],
      "framing": "The wing FLAGS this both ways and resolves nothing. Recent philology (Attwood) is widely read as strengthening Nattier; that is reported as the state of debate, not as a verdict."
    },
    {
      "id": "form-emptiness-syntax",
      "title": "Syntax of the rūpaṃ śūnyatā / śūnyataiva rūpaṃ equations",
      "positions": [
        {
          "label": "Predicative identity",
          "claim": "'rūpaṃ śūnyatā' is a nominal (verbless) sentence 'form [is] emptiness'; 'śūnyataiva rūpaṃ' (= śūnyatā eva rūpaṃ) reverses it with emphatic eva, 'emptiness itself [is] form' — a two-way identity, reinforced by the following 'na pṛthak' (not separate) and 'yad rūpaṃ sā śūnyatā' (what is form, that is emptiness) clauses."
        },
        {
          "label": "Non-difference, not strict identity",
          "claim": "The four-part figure (X is Y; Y-eva is X; X and Y not separate; what is X is Y) is read by many commentators as asserting non-difference / mutual non-obstruction rather than a bare logical identity; the eva marks emphasis/restriction, and the 'na pṛthak' lines gloss the equations as 'not other than', guarding against reifying either term."
        }
      ],
      "framing": "Both construals of the Sanskrit are grammatically available; the gloss records at hrdaya:2–3 carry the syntax note and neither is adjudicated. Müller renders it flatly as 'form here is emptiness, and emptiness indeed is form.'"
    },
    {
      "id": "acittavarana-reading",
      "title": "viharati (a)cittāvaraṇaḥ — 'dwells WITH / WITHOUT mental covering'",
      "positions": [
        {
          "label": "Standard reading: acittāvaraṇaḥ ('without mental hindrance')",
          "claim": "Most witnesses and Conze read 'viharaty acittāvaraṇaḥ; cittāvaraṇa-nāstitvād atrasto…' — the bodhisattva dwells WITHOUT any covering of the mind, and BECAUSE there is no covering, is unafraid. The privative a- is on the first term."
        },
        {
          "label": "Müller/Horiuzi reading: cittāvaraṇaḥ ('enveloped in consciousness')",
          "claim": "Müller's SBE 49 translates 'dwells enveloped in consciousness. But when the envelopment of consciousness has been annihilated, then he becomes free of all fear' — i.e. his Hōryū-ji text read 'viharati cittāvaraṇaḥ' (no privative on the first term), with the freedom following only once the covering is removed. The sense inverts the sequence but not the doctrine."
        }
      ],
      "framing": "hrdaya:11 prints the witness (Müller/Horiuzi) reading 'viharati cittāvaraṇaḥ' to keep the Sanskrit aligned with the reproduced translation, and flags the standard 'acittāvaraṇaḥ' reading both ways in the record note."
    }
  ]
};

export const HEART_RECORDS = [
  {
    "ref": "hrdaya:0",
    "sanskrit": "namaḥ sarvajñāya",
    "words": [
      {
        "w": "namaḥ",
        "gloss": "homage, adoration, obeisance (to) — the noun 'bowing' used as a salutation; governs the dative",
        "gram": "nt., nom./acc. sg. used as an indecl. of salutation (+ dat.)",
        "ped": "MW s.v. namas"
      },
      {
        "w": "sarvajñāya",
        "gloss": "= sarva + jña: 'to the all-knowing one, the Omniscient' — an epithet of the Buddha (sarva 'all' + -jña 'knowing', from √jñā)",
        "gram": "tatpuruṣa cpd., dat. sg. m.",
        "ped": "MW s.v. sarvajña; s.v. sarva; s.v. jña"
      }
    ],
    "translation": {
      "text": "Adoration to the Omniscient!",
      "source": "Müller, SBE 49 (1894; PD), 'The Smaller Pragñâ-pâramitâ-hridaya-sûtra', p.153, verbatim"
    },
    "notes": "The opening homage (maṅgala). Present in the Müller–Nanjio shorter witness; some forms of the 'shorter' text (as circulated in East Asia and in Conze's shortest recension) begin directly with Avalokiteśvara and lack this line. Recension detail, flagged not resolved."
  },
  {
    "ref": "hrdaya:1",
    "sanskrit": "āryāvalokiteśvaro bodhisattvo gambhīrāyāṃ prajñāpāramitāyāṃ caryāṃ caramāṇo vyavalokayati sma pañca skandhāḥ tāṃś ca svabhāvaśūnyān paśyati sma",
    "words": [
      {
        "w": "āryāvalokiteśvaro",
        "gloss": "= ārya + avalokiteśvara: 'the noble Avalokiteśvara' — the bodhisattva of compassion; ārya 'noble', avalokita 'looked-down/gazing' (ava + √lok) + īśvara 'lord' (avalokita-īśvara → -teśvara). Nominative -aḥ becomes -o before the voiced b- of the next word",
        "gram": "karmadhāraya cpd., nom. sg. m. (-aḥ > -o by sandhi)",
        "ped": "MW s.v. ārya; s.v. avalokita; s.v. īśvara"
      },
      {
        "w": "bodhisattvo",
        "gloss": "a bodhisattva, 'awakening-being' — one bound for buddhahood (bodhi 'awakening' + sattva 'being')",
        "gram": "tatpuruṣa/bahuvrīhi cpd., nom. sg. m. (-o by sandhi)",
        "ped": "MW s.v. bodhisattva; s.v. bodhi; s.v. sattva"
      },
      {
        "w": "gambhīrāyāṃ",
        "gloss": "deep, profound (agreeing with prajñāpāramitāyāṃ)",
        "gram": "adj., loc. sg. f.",
        "ped": "MW s.v. gambhīra"
      },
      {
        "w": "prajñāpāramitāyāṃ",
        "gloss": "= prajñā + pāramitā: 'in the perfection of wisdom' — prajñā 'wisdom, insight' (pra + √jñā), pāramitā 'perfection, going-to-the-far-shore' (from pāram-itā or pāramī)",
        "gram": "tatpuruṣa cpd., loc. sg. f.",
        "ped": "MW s.v. prajñā; s.v. pāramitā"
      },
      {
        "w": "caryāṃ",
        "gloss": "practice, course, conduct, the 'study' (from √car 'to move, practise')",
        "gram": "f., acc. sg. (object of caramāṇo)",
        "ped": "MW s.v. caryā"
      },
      {
        "w": "caramāṇo",
        "gloss": "practising, coursing, carrying on (middle present participle of √car); with caryāṃ, 'performing the practice'",
        "gram": "pres.part. mid. of √car, nom. sg. m. (-o by sandhi)",
        "ped": "MW s.v. car"
      },
      {
        "w": "vyavalokayati",
        "gloss": "looks down upon, observes, surveys, examines (vi + ava + √lok, causative-stem)",
        "gram": "pres. 3 sg. of vyavalokayati (vi-ava-√lok)",
        "ped": "MW s.v. lok (ava-lok, vy-ava-lok)"
      },
      {
        "w": "sma",
        "gloss": "particle that, with a present tense, gives past sense: 'he observed'",
        "gram": "indecl. (sma + pres. = past)",
        "ped": "MW s.v. sma"
      },
      {
        "w": "pañca",
        "gloss": "five",
        "gram": "num., nom./acc. (indeclinable in this form)",
        "ped": "MW s.v. pañcan"
      },
      {
        "w": "skandhāḥ",
        "gloss": "the aggregates, 'heaps' — the five constituents of the person (form, feeling, perception, formations, consciousness); nom. pl. reflecting Müller's reading 'There are the five Skandhas'",
        "gram": "m., nom. pl.",
        "ped": "MW s.v. skandha"
      },
      {
        "w": "tāṃś",
        "gloss": "them, those (five) — resumptive demonstrative; tān before c- becomes tāṃś by sandhi",
        "gram": "dem. pron., acc. pl. m. (tān > tāṃś)",
        "ped": "MW s.v. tad"
      },
      {
        "w": "ca",
        "gloss": "and",
        "gram": "indecl. (conj.)",
        "ped": "MW s.v. ca"
      },
      {
        "w": "svabhāvaśūnyān",
        "gloss": "= svabhāva + śūnya: 'empty of own-being, empty by their nature' (svabhāva 'own-nature, intrinsic being' + śūnya 'empty, void')",
        "gram": "bahuvrīhi/tatpuruṣa cpd. adj., acc. pl. m.",
        "ped": "MW s.v. svabhāva; s.v. śūnya"
      },
      {
        "w": "paśyati",
        "gloss": "sees, perceives, regards (√paś/√dṛś)",
        "gram": "pres. 3 sg. of √paś",
        "ped": "MW s.v. paś; s.v. dṛś"
      },
      {
        "w": "sma",
        "gloss": "past-sense particle (with paśyati): 'he saw/considered'",
        "gram": "indecl. (sma + pres. = past)",
        "ped": "MW s.v. sma"
      }
    ],
    "translation": {
      "text": "The venerable Bodhisattva Avalokitesvara, performing his study in the deep Pragñâpâramitâ (perfection of wisdom), thought thus: 'There are the five Skandhas, and these he considered as by their nature empty (phenomenal).'",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "The Hōryū-ji/Müller–Nanjio shorter text compresses 'gambhīrāyāṃ prajñāpāramitāyāṃ caryāṃ caramāṇo' toward the compound 'gambhīrāṃ prajñāpāramitā-caryāṃ caramāṇo' in some copies; the fuller locative phrasing (used here) is the widely-received reading and does not change the sense. Müller renders 'pañca skandhāḥ … paśyati sma' as a statement ('There are the five Skandhas, and these he considered…'), reading skandhāḥ as nominative; Conze's text punctuates 'pañca skandhāṃs tāṃś ca … paśyati sma' (accusative object of paśyati). Both parses noted; unresolved. 'phenomenal' is Müller's interpretive addition, kept verbatim."
  },
  {
    "ref": "hrdaya:2",
    "sanskrit": "iha śāriputra rūpaṃ śūnyatā śūnyataiva rūpaṃ",
    "words": [
      {
        "w": "iha",
        "gloss": "here, in this (world / matter); introduces the address to Śāriputra",
        "gram": "indecl. (adv. of place)",
        "ped": "MW s.v. iha"
      },
      {
        "w": "śāriputra",
        "gloss": "Śāriputra — the disciple addressed (son of Śārī); vocative",
        "gram": "m., voc. sg.",
        "ped": "MW s.v. śāriputra"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form, materiality, the first of the five aggregates; here the subject",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      },
      {
        "w": "śūnyatā",
        "gloss": "emptiness, voidness — the abstract of śūnya (śūnya + -tā); predicate nominative in the verbless sentence 'form [is] emptiness'",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. śūnyatā; s.v. śūnya"
      },
      {
        "w": "śūnyataiva",
        "gloss": "= śūnyatā + eva (sandhi ā + e > ai): 'emptiness itself/indeed' — with the emphatic particle eva reversing the equation",
        "gram": "f. nom. sg. + emph. particle",
        "ped": "MW s.v. śūnyatā; s.v. eva"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form (predicate: 'emptiness itself [is] form')",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      }
    ],
    "translation": {
      "text": "'O Sâriputra,' he said, 'form here is emptiness, and emptiness indeed is form.",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "SYNTAX (see meta.contested 'form-emptiness-syntax'). Both clauses are nominal (verbless): 'rūpaṃ śūnyatā' = 'form [is] emptiness'; 'śūnyatā eva rūpaṃ' = 'emptiness itself [is] form', the eva emphatic. Read as two-way predicative identity, or (with the following na-pṛthak lines) as non-difference rather than strict identity. Neither resolved. Müller supplies 'he said' — not in the Sanskrit of this segment; kept verbatim as his."
  },
  {
    "ref": "hrdaya:3",
    "sanskrit": "rūpān na pṛthak śūnyatā śūnyatāyā na pṛthag rūpaṃ yad rūpaṃ sā śūnyatā yā śūnyatā tad rūpaṃ",
    "words": [
      {
        "w": "rūpān",
        "gloss": "from form (ablative of separation: 'not separate FROM form'); rūpāt before n- becomes rūpān by sandhi",
        "gram": "nt., abl. sg. (rūpāt > rūpān)",
        "ped": "MW s.v. rūpa"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "pṛthak",
        "gloss": "separate, apart, distinct (from)",
        "gram": "indecl. (adv., + abl.)",
        "ped": "MW s.v. pṛthak"
      },
      {
        "w": "śūnyatā",
        "gloss": "emptiness (subject: 'emptiness [is] not separate from form')",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. śūnyatā"
      },
      {
        "w": "śūnyatāyā",
        "gloss": "from emptiness (ablative); śūnyatāyāḥ loses its visarga before n-",
        "gram": "f., abl. sg. (śūnyatāyāḥ > śūnyatāyā)",
        "ped": "MW s.v. śūnyatā"
      },
      {
        "w": "na",
        "gloss": "not",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "pṛthag",
        "gloss": "separate, apart (pṛthak voiced to pṛthag before r-)",
        "gram": "indecl. (adv., + abl.)",
        "ped": "MW s.v. pṛthak"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form (subject: 'form [is] not separate from emptiness')",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      },
      {
        "w": "yad",
        "gloss": "what, that which (relative pronoun opening 'what is form, that is emptiness')",
        "gram": "rel. pron., nom. sg. nt.",
        "ped": "MW s.v. yad"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      },
      {
        "w": "sā",
        "gloss": "that (feminine, agreeing with śūnyatā) — the correlative: 'that [is] emptiness'",
        "gram": "dem. pron., nom. sg. f.",
        "ped": "MW s.v. tad"
      },
      {
        "w": "śūnyatā",
        "gloss": "emptiness",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. śūnyatā"
      },
      {
        "w": "yā",
        "gloss": "which (feminine relative): 'which is emptiness'",
        "gram": "rel. pron., nom. sg. f.",
        "ped": "MW s.v. yad"
      },
      {
        "w": "śūnyatā",
        "gloss": "emptiness",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. śūnyatā"
      },
      {
        "w": "tad",
        "gloss": "that (neuter, agreeing with rūpaṃ): 'that [is] form'",
        "gram": "dem. pron., nom. sg. nt.",
        "ped": "MW s.v. tad"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      }
    ],
    "translation": {
      "text": "Emptiness is not different from form, form is not different from emptiness. What is form that is emptiness, what is emptiness that is form.'",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "The gender concord is exact and load-bearing: 'yad rūpaṃ sā śūnyatā' pairs neuter yad/tad-rūpaṃ with feminine sā-śūnyatā, so the relative-correlative is 'what (form) — that (emptiness)'. These 'na pṛthak' lines are the classical grounds for reading the hrdaya:2 equations as non-difference rather than bare identity (meta.contested)."
  },
  {
    "ref": "hrdaya:4",
    "sanskrit": "evam eva vedanāsaṃjñāsaṃskāravijñānāni",
    "words": [
      {
        "w": "evam",
        "gloss": "thus, in this way",
        "gram": "indecl. (adv.)",
        "ped": "MW s.v. evam"
      },
      {
        "w": "eva",
        "gloss": "just, precisely (emphatic): 'in just this same way'",
        "gram": "indecl. (emph. particle)",
        "ped": "MW s.v. eva"
      },
      {
        "w": "vedanāsaṃjñāsaṃskāravijñānāni",
        "gloss": "= vedanā + saṃjñā + saṃskāra + vijñāna (-āni): the other four aggregates as a dvandva — feeling (vedanā), perception/apperception (saṃjñā), formations/volitions (saṃskāra), consciousness (vijñāna); '[so too are] feeling, perception, formations and consciousness [empty]'. Müller renders the four as 'perception, name, conception, and knowledge'",
        "gram": "dvandva cpd., nom. pl. nt. (-āni)",
        "ped": "MW s.v. vedanā; s.v. saṃjñā; s.v. saṃskāra; s.v. vijñāna"
      }
    ],
    "translation": {
      "text": "'The same applies to perception, name, conception, and knowledge.'",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "Müller's Victorian renderings of the four aggregates differ from the now-standard ones: he gives vedanā='perception' (standard: feeling/sensation), saṃjñā='name' (standard: perception/recognition), saṃskāra='conception' (standard: formations/mental constructs), vijñāna='knowledge' (standard: consciousness). The translation is reproduced as his; the modern senses are given in the word glosses. Described, not corrected."
  },
  {
    "ref": "hrdaya:5",
    "sanskrit": "iha śāriputra sarvadharmāḥ śūnyatālakṣaṇā anutpannā aniruddhā amalā avimalā anūnā aparipūrṇāḥ",
    "words": [
      {
        "w": "iha",
        "gloss": "here, in this case",
        "gram": "indecl. (adv.)",
        "ped": "MW s.v. iha"
      },
      {
        "w": "śāriputra",
        "gloss": "Śāriputra (vocative)",
        "gram": "m., voc. sg.",
        "ped": "MW s.v. śāriputra"
      },
      {
        "w": "sarvadharmāḥ",
        "gloss": "= sarva + dharma: 'all things / all dharmas' — every phenomenon (Müller: 'all things')",
        "gram": "tatpuruṣa cpd., nom. pl. m.",
        "ped": "MW s.v. sarva; s.v. dharma"
      },
      {
        "w": "śūnyatālakṣaṇā",
        "gloss": "= śūnyatā + lakṣaṇa: 'having emptiness as their mark/character' (lakṣaṇa 'mark, defining characteristic'); bahuvrīhi agreeing with sarvadharmāḥ",
        "gram": "bahuvrīhi cpd. adj., nom. pl. m.",
        "ped": "MW s.v. lakṣaṇa; s.v. śūnyatā"
      },
      {
        "w": "anutpannā",
        "gloss": "unarisen, unproduced, 'without beginning' (an + utpanna, ppp. of ut-√pad)",
        "gram": "neg. ppp., nom. pl. m.",
        "ped": "MW s.v. utpanna; s.v. utpad"
      },
      {
        "w": "aniruddhā",
        "gloss": "unceased, unstopped, 'without end' (a + niruddha, ppp. of ni-√rudh)",
        "gram": "neg. ppp., nom. pl. m.",
        "ped": "MW s.v. niruddha; s.v. nirudh"
      },
      {
        "w": "amalā",
        "gloss": "stainless, faultless, without impurity (a + mala 'stain, dirt')",
        "gram": "adj., nom. pl. m.",
        "ped": "MW s.v. amala; s.v. mala"
      },
      {
        "w": "avimalā",
        "gloss": "= a + vimala: 'not stainless, not immaculate' — the privative a- negating vimala 'stainless, spotless, pure' (MW s.v. vimala); pairs with amalā in the doubled negation 'neither stained nor stainless', of which Müller renders this member 'not faultless'",
        "gram": "adj., nom. pl. m.",
        "ped": "MW s.v. vimala; s.v. mala"
      },
      {
        "w": "anūnā",
        "gloss": "not deficient, not lacking, 'not imperfect' (an + ūna 'less, wanting')",
        "gram": "adj., nom. pl. m.",
        "ped": "MW s.v. ūna"
      },
      {
        "w": "aparipūrṇāḥ",
        "gloss": "not full, not complete, 'not perfect' (a + paripūrṇa, ppp. of pari-√pṝ 'to fill')",
        "gram": "neg. ppp., nom. pl. m.",
        "ped": "MW s.v. paripūrṇa; s.v. pṝ"
      }
    ],
    "translation": {
      "text": "'Here, O Sâriputra, all things have the character of emptiness, they have no beginning, no end, they are faultless and not faultless, they are not imperfect and not perfect.",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "The received text pairs the negations 'amalā avimalā' and 'anūnā aparipūrṇāḥ'; some witnesses read 'amalā na vimalā, anūnā na paripūrṇāḥ' (with separate na). Conze's normalized text has 'amalā na vimalā nonā na paripūrṇāḥ'. Orthographic/sandhi variation only; the doubled-negation sense ('neither pure nor impure, neither deficient nor complete') is stable. Flagged, not harmonized."
  },
  {
    "ref": "hrdaya:6",
    "sanskrit": "tasmāc chāriputra śūnyatāyāṃ na rūpaṃ na vedanā na saṃjñā na saṃskārā na vijñānaṃ",
    "words": [
      {
        "w": "tasmāc",
        "gloss": "therefore, for that reason (tasmāt 'from that'); tasmāt before c- (ś-) becomes tasmāc",
        "gram": "abl. sg. nt. of tad, used adverbially (tasmāt > tasmāc)",
        "ped": "MW s.v. tad; s.v. tasmāt"
      },
      {
        "w": "chāriputra",
        "gloss": "Śāriputra (vocative); initial ś- is written ch- after the -c of tasmāc (t+ś sandhi)",
        "gram": "m., voc. sg. (śāriputra, sandhi form)",
        "ped": "MW s.v. śāriputra"
      },
      {
        "w": "śūnyatāyāṃ",
        "gloss": "in emptiness (locative): 'in this emptiness there is…'",
        "gram": "f., loc. sg.",
        "ped": "MW s.v. śūnyatā"
      },
      {
        "w": "na",
        "gloss": "no, not [there is]",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "rūpaṃ",
        "gloss": "form",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. rūpa"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "vedanā",
        "gloss": "feeling/sensation (Müller: 'perception')",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. vedanā"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "saṃjñā",
        "gloss": "perception/recognition (Müller: 'name')",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. saṃjñā"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "saṃskārā",
        "gloss": "formations, volitional constructs (Müller: 'concepts'); nom. pl. saṃskārāḥ loses visarga before na",
        "gram": "m., nom. pl. (saṃskārāḥ > saṃskārā)",
        "ped": "MW s.v. saṃskāra"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "vijñānaṃ",
        "gloss": "consciousness (Müller: 'knowledge')",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. vijñāna"
      }
    ],
    "translation": {
      "text": "Therefore, O Sâriputra, in this emptiness there is no form, no perception, no name, no concepts, no knowledge.",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "The five-aggregate negation. Müller's aggregate-renderings (perception/name/concepts/knowledge) are his; standard senses in the word glosses (feeling/perception/formations/consciousness)."
  },
  {
    "ref": "hrdaya:7",
    "sanskrit": "na cakṣuḥśrotraghrāṇajihvākāyamanāṃsi na rūpaśabdagandharasaspraṣṭavyadharmāḥ",
    "words": [
      {
        "w": "na",
        "gloss": "no, not [there are]",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "cakṣuḥśrotraghrāṇajihvākāyamanāṃsi",
        "gloss": "= cakṣus + śrotra + ghrāṇa + jihvā + kāya + manas: the six sense-faculties as a dvandva — eye, ear, nose, tongue, body, mind; neuter plural -manāṃsi from the manas-stem",
        "gram": "dvandva cpd., nom. pl. nt.",
        "ped": "MW s.v. cakṣus; s.v. śrotra; s.v. ghrāṇa; s.v. jihvā; s.v. kāya; s.v. manas"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "rūpaśabdagandharasaspraṣṭavyadharmāḥ",
        "gloss": "= rūpa + śabda + gandha + rasa + spraṣṭavya + dharma: the six sense-objects as a dvandva — form/sight, sound, smell, taste, the tangible (spraṣṭavya, gdv. of √spṛś 'to touch'), and mental objects (dharma). Müller: 'form, sound, smell, taste, touch, objects'",
        "gram": "dvandva cpd., nom. pl. m.",
        "ped": "MW s.v. rūpa; s.v. śabda; s.v. gandha; s.v. rasa; s.v. spraṣṭavya; s.v. dharma"
      }
    ],
    "translation": {
      "text": "No eye, ear, nose, tongue, body, mind. No form, sound, smell, taste, touch, objects.'",
      "source": "Müller, SBE 49 (1894; PD), p.153, verbatim"
    },
    "notes": "The six internal bases (āyatana) and their six objects. The two compounds pair 1:1 (eye–form, ear–sound, …, mind–dharmas)."
  },
  {
    "ref": "hrdaya:8",
    "sanskrit": "na cakṣurdhātur yāvan na manovijñānadhātuḥ",
    "words": [
      {
        "w": "na",
        "gloss": "no, not [there is]",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "cakṣurdhātur",
        "gloss": "= cakṣus + dhātu: 'the eye-element', first of the eighteen dhātus; nom. sg. cakṣurdhātuḥ, visarga voiced to -r before y-",
        "gram": "tatpuruṣa cpd., nom. sg. m. (-ḥ > -r)",
        "ped": "MW s.v. cakṣus; s.v. dhātu"
      },
      {
        "w": "yāvan",
        "gloss": "up to, as far as — 'and so on down to' (yāvat before n- becomes yāvan); marks the elided list",
        "gram": "indecl. (yāvat > yāvan)",
        "ped": "MW s.v. yāvat"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "manovijñānadhātuḥ",
        "gloss": "= manas + vijñāna + dhātu: 'the mind-consciousness element', the last of the eighteen dhātus (manas 'mind' + vijñāna 'consciousness' + dhātu 'element')",
        "gram": "tatpuruṣa cpd., nom. sg. m.",
        "ped": "MW s.v. manas; s.v. vijñāna; s.v. dhātu"
      }
    ],
    "translation": {
      "text": "'There is no eye,' &c., till we come to 'there is no mind.' (What is left out here are the eighteen Dhâtus or aggregates, viz. eye, form, vision; ear, sound, hearing; nose, odour, smelling; tongue, flavour, tasting; body, touch, feeling; mind, objects, thought.)",
      "source": "Müller, SBE 49 (1894; PD), pp.153–154, verbatim (incl. Müller's parenthetical editorial gloss)"
    },
    "notes": "The 'yāvat' formula abbreviates the eighteen elements (dhātu): the six faculties + six objects + six consciousnesses. The parenthesis is Müller's own editorial enumeration, reproduced verbatim and marked as his (not part of the sūtra text)."
  },
  {
    "ref": "hrdaya:9",
    "sanskrit": "na vidyā nāvidyā na vidyākṣayo nāvidyākṣayo yāvan na jarāmaraṇaṃ na jarāmaraṇakṣayo",
    "words": [
      {
        "w": "na",
        "gloss": "no, not [there is]",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "vidyā",
        "gloss": "knowledge, [true] knowing (Müller: 'knowledge'); here the counterpart heading the reverse of the twelve-linked chain",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. vidyā"
      },
      {
        "w": "nāvidyā",
        "gloss": "= na + avidyā: 'nor ignorance' — avidyā, the first link of dependent origination (a + vidyā, 'not-knowing')",
        "gram": "neg. + f. nom. sg.",
        "ped": "MW s.v. avidyā; s.v. na"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "vidyākṣayo",
        "gloss": "= vidyā + kṣaya: 'destruction of knowledge' (kṣaya 'wasting, cessation', from √kṣi); nom. -kṣayaḥ > -kṣayo",
        "gram": "tatpuruṣa cpd., nom. sg. m. (-o by sandhi)",
        "ped": "MW s.v. kṣaya; s.v. vidyā"
      },
      {
        "w": "nāvidyākṣayo",
        "gloss": "= na + avidyā + kṣaya: 'nor destruction of ignorance' — the ceasing of ignorance that heads the liberative sequence",
        "gram": "neg. + tatpuruṣa cpd., nom. sg. m.",
        "ped": "MW s.v. avidyā; s.v. kṣaya"
      },
      {
        "w": "yāvan",
        "gloss": "up to, as far as — abbreviating the intervening ten links (yāvat > yāvan)",
        "gram": "indecl.",
        "ped": "MW s.v. yāvat"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "jarāmaraṇaṃ",
        "gloss": "= jarā + maraṇa: 'old age and death' (jarā 'aging' + maraṇa 'dying'), the last link of dependent origination",
        "gram": "dvandva cpd., nom. sg. nt.",
        "ped": "MW s.v. jarā; s.v. maraṇa"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "jarāmaraṇakṣayo",
        "gloss": "= jarāmaraṇa + kṣaya: 'nor destruction of old-age-and-death'; nom. -kṣayaḥ > -kṣayo",
        "gram": "tatpuruṣa cpd., nom. sg. m.",
        "ped": "MW s.v. jarā; s.v. maraṇa; s.v. kṣaya"
      }
    ],
    "translation": {
      "text": "'There is no knowledge, no ignorance, no destruction of knowledge, no destruction of ignorance,' &c., till we come to 'there is no decay and death, no destruction of decay and death;",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "The twelve links of dependent origination (pratītyasamutpāda) and their cessation, negated from first (avidyā) to last (jarāmaraṇa) and abbreviated by yāvat. The shorter witness prefaces the chain with 'na vidyā' (Müller 'no knowledge'), pairing vidyā with avidyā; Conze's text begins 'na vidyā nāvidyā …' likewise but some copies open directly 'nāvidyā'. Noted, not resolved."
  },
  {
    "ref": "hrdaya:10",
    "sanskrit": "na duḥkhasamudayanirodhamārgā na jñānaṃ na prāptiḥ",
    "words": [
      {
        "w": "na",
        "gloss": "no, not [there are]",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "duḥkhasamudayanirodhamārgā",
        "gloss": "= duḥkha + samudaya + nirodha + mārga: the four noble truths as a dvandva — suffering, its origin, its cessation, and the path; nom. pl. -mārgāḥ loses visarga before na. Müller: 'pain, origin of pain, stoppage of pain, and the path to it'",
        "gram": "dvandva cpd., nom. pl. m. (-mārgāḥ > -mārgā)",
        "ped": "MW s.v. duḥkha; s.v. samudaya; s.v. nirodha; s.v. mārga"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "jñānaṃ",
        "gloss": "knowledge, cognition (√jñā); Müller: 'knowledge'",
        "gram": "nt., nom. sg.",
        "ped": "MW s.v. jñāna"
      },
      {
        "w": "na",
        "gloss": "no",
        "gram": "indecl. (neg.)",
        "ped": "MW s.v. na"
      },
      {
        "w": "prāptiḥ",
        "gloss": "attainment, obtaining (pra + √āp); Müller: 'obtaining (of Nirvâna)'",
        "gram": "f., nom. sg.",
        "ped": "MW s.v. prāpti; s.v. āp"
      }
    ],
    "translation": {
      "text": "there are not (the four truths, viz. that there) is pain, origin of pain, stoppage of pain, and the path to it. There is no knowledge, no obtaining (of Nirvâna).'",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "The four truths and even 'knowledge' and 'attainment' are negated. The shorter Müller/Horiuzi witness ends 'na jñānaṃ na prāptiḥ' (Müller 'no obtaining'); Conze's text adds 'na abhisamayaḥ' or 'nāprāptiḥ' ('no non-attainment') in some recensions — that extra term is absent from the witness followed here. Flagged, not added. Müller's parentheses ('(the four truths, viz. that there)', '(of Nirvâna)') are his editorial supplements, kept verbatim."
  },
  {
    "ref": "hrdaya:11",
    "sanskrit": "tasmāc chāriputra aprāptitvād bodhisattvasya prajñāpāramitām āśritya viharati cittāvaraṇaḥ cittāvaraṇanāstitvād atrasto viparyāsātikrānto niṣṭhanirvāṇaḥ",
    "words": [
      {
        "w": "tasmāc",
        "gloss": "therefore (tasmāt > tasmāc before ch-)",
        "gram": "abl. sg. nt. of tad, adverbial",
        "ped": "MW s.v. tad; s.v. tasmāt"
      },
      {
        "w": "chāriputra",
        "gloss": "Śāriputra (voc.; ś- > ch- after -c)",
        "gram": "m., voc. sg.",
        "ped": "MW s.v. śāriputra"
      },
      {
        "w": "aprāptitvād",
        "gloss": "= a + prāpti + -tva: 'because of the state of non-attainment / because there is nothing to attain' (abl. of cause); prāpti 'attainment' + abstract -tva, negated by a-",
        "gram": "abstract-noun cpd., abl. sg. nt. (-tvāt > -tvād)",
        "ped": "MW s.v. prāpti; s.v. tva"
      },
      {
        "w": "bodhisattvasya",
        "gloss": "of a/the bodhisattva (genitive: 'a bodhisattva, relying on…')",
        "gram": "m., gen. sg.",
        "ped": "MW s.v. bodhisattva"
      },
      {
        "w": "prajñāpāramitām",
        "gloss": "the perfection of wisdom (accusative, object of āśritya)",
        "gram": "tatpuruṣa cpd., acc. sg. f.",
        "ped": "MW s.v. prajñā; s.v. pāramitā"
      },
      {
        "w": "āśritya",
        "gloss": "having relied on, resorting to, depending on (ger./absol. of ā-√śri)",
        "gram": "ger. (absol.) of ā-√śri",
        "ped": "MW s.v. āśri; s.v. śri"
      },
      {
        "w": "viharati",
        "gloss": "dwells, abides, lives (vi + √hṛ)",
        "gram": "pres. 3 sg. of vi-√hṛ",
        "ped": "MW s.v. vihṛ; s.v. hṛ"
      },
      {
        "w": "cittāvaraṇaḥ",
        "gloss": "= citta + āvaraṇa: 'having a covering of the mind' — with mind enveloped/obstructed (citta 'mind' + āvaraṇa 'covering, hindrance'). Müller's witness reads this WITHOUT the privative a-, rendering 'dwells enveloped in consciousness' (see note; Conze reads acittāvaraṇaḥ, 'without mental hindrance')",
        "gram": "bahuvrīhi cpd., nom. sg. m.",
        "ped": "MW s.v. citta; s.v. āvaraṇa"
      },
      {
        "w": "cittāvaraṇanāstitvād",
        "gloss": "= citta + āvaraṇa + nāstitva: 'because of the non-existence of the mind-covering' (nāstitva 'state of not-being', from na asti + -tva); abl. of cause",
        "gram": "abstract-noun cpd., abl. sg. nt. (-tvāt > -tvād)",
        "ped": "MW s.v. āvaraṇa; s.v. nāstitva; s.v. asti"
      },
      {
        "w": "atrasto",
        "gloss": "unafraid, not trembling (a + trasta, ppp. of √tras 'to tremble'); nom. -aḥ > -o",
        "gram": "neg. ppp., nom. sg. m.",
        "ped": "MW s.v. trasta; s.v. tras"
      },
      {
        "w": "viparyāsātikrānto",
        "gloss": "= viparyāsa + atikrānta: 'having passed beyond distortion/error' (viparyāsa 'inversion, delusion, perverse view'; atikrānta, ppp. of ati-√kram 'to go beyond'). Müller: 'beyond the reach of change'",
        "gram": "tatpuruṣa cpd. (ppp.), nom. sg. m.",
        "ped": "MW s.v. viparyāsa; s.v. atikram; s.v. kram"
      },
      {
        "w": "niṣṭhanirvāṇaḥ",
        "gloss": "= niṣṭhā + nirvāṇa: 'having final nirvāṇa [as his end]' (niṣṭhā 'culmination, end' + nirvāṇa 'extinction, quenching'). Müller: 'enjoying final Nirvâna'",
        "gram": "bahuvrīhi cpd., nom. sg. m.",
        "ped": "MW s.v. niṣṭhā; s.v. nirvāṇa"
      }
    ],
    "translation": {
      "text": "'A man who has approached the Pragñâpâramitâ of the Bodhisattva dwells enveloped in consciousness. But when the envelopment of consciousness has been annihilated, then he becomes free of all fear, beyond the reach of change, enjoying final Nirvâna.'",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "TEXTUAL CRUX (see meta.contested 'acittavarana-reading'), both ways. Müller's Hōryū-ji witness reads 'viharati cittāvaraṇaḥ' (mind still covered), so that freedom follows only 'when the envelopment … has been annihilated'; the standard/Conze reading is 'viharaty acittāvaraṇaḥ' (the bodhisattva already dwells WITHOUT mental covering, and BECAUSE there is no covering is unafraid). This record prints the witness reading to keep the Sanskrit aligned with the reproduced translation; the standard reading is flagged, not silently substituted. Müller also compresses 'tasmāt aprāptitvāt' (he does not render 'because of non-attainment' explicitly) and reads bodhisattvasya loosely as 'of the Bodhisattva'."
  },
  {
    "ref": "hrdaya:12",
    "sanskrit": "tryadhvavyavasthitāḥ sarvabuddhāḥ prajñāpāramitām āśrityānuttarāṃ samyaksaṃbodhim abhisaṃbuddhāḥ",
    "words": [
      {
        "w": "tryadhvavyavasthitāḥ",
        "gloss": "= tri + adhvan + vyavasthita: 'established/abiding in the three times' (tri 'three' + adhvan 'time-period, road' + vyavasthita 'settled, positioned', ppp. of vi-ava-√sthā) — i.e. of past, present and future. Müller: 'of the past, present, and future'",
        "gram": "cpd. (ppp.) adj., nom. pl. m.",
        "ped": "MW s.v. tri; s.v. adhvan; s.v. vyavasthita; s.v. sthā"
      },
      {
        "w": "sarvabuddhāḥ",
        "gloss": "= sarva + buddha: 'all the Buddhas'",
        "gram": "tatpuruṣa cpd., nom. pl. m.",
        "ped": "MW s.v. sarva; s.v. buddha"
      },
      {
        "w": "prajñāpāramitām",
        "gloss": "the perfection of wisdom (acc., object of āśritya)",
        "gram": "tatpuruṣa cpd., acc. sg. f.",
        "ped": "MW s.v. prajñā; s.v. pāramitā"
      },
      {
        "w": "āśrityānuttarāṃ",
        "gloss": "= āśritya + anuttarāṃ (sandhi a + a > ā): 'having relied on [the perfection of wisdom], the unsurpassed…' — āśritya (ger. of ā-√śri) + anuttarā 'unsurpassed, supreme' (an + uttara 'higher'), acc. f. agreeing with samyaksaṃbodhim",
        "gram": "ger. + adj. acc. sg. f.",
        "ped": "MW s.v. āśri; s.v. anuttara; s.v. uttara"
      },
      {
        "w": "samyaksaṃbodhim",
        "gloss": "= samyak + saṃbodhi: 'perfect complete awakening' (samyak 'rightly, fully' + saṃbodhi 'full awakening'); acc. sg., object of abhisaṃbuddhāḥ. Müller: 'the highest perfect knowledge'",
        "gram": "karmadhāraya cpd., acc. sg. f.",
        "ped": "MW s.v. samyañc; s.v. saṃbodhi; s.v. bodhi"
      },
      {
        "w": "abhisaṃbuddhāḥ",
        "gloss": "fully awakened (to), have realized/awoke to (abhi + saṃ + √budh, ppp. used predicatively). Müller: 'have awoke'",
        "gram": "ppp. of abhisaṃ-√budh, nom. pl. m.",
        "ped": "MW s.v. abhisaṃbudh; s.v. budh"
      }
    ],
    "translation": {
      "text": "'All Buddhas of the past, present, and future, after approaching the Pragñâpâramitâ, have awoke to the highest perfect knowledge.'",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "The text's own claim — that all Buddhas of the three times awaken by relying on the perfection of wisdom — is reported as what the sūtra says (described, not endorsed as a claim about the world)."
  },
  {
    "ref": "hrdaya:13",
    "sanskrit": "tasmāj jñātavyaṃ prajñāpāramitā mahāmantro mahāvidyāmantro 'nuttaramantro 'samasamamantraḥ sarvaduḥkhapraśamanaḥ satyam amithyatvāt prajñāpāramitāyām ukto mantras tadyathā",
    "words": [
      {
        "w": "tasmāj",
        "gloss": "therefore (tasmāt > tasmāj before j-)",
        "gram": "abl. sg. nt. of tad, adverbial",
        "ped": "MW s.v. tad; s.v. tasmāt"
      },
      {
        "w": "jñātavyaṃ",
        "gloss": "to be known, one should know (gerundive of √jñā)",
        "gram": "gdv. of √jñā, nom. sg. nt.",
        "ped": "MW s.v. jñā"
      },
      {
        "w": "prajñāpāramitā",
        "gloss": "the perfection of wisdom (nom., the thing to be known / the subject of the following predicates)",
        "gram": "tatpuruṣa cpd., nom. sg. f.",
        "ped": "MW s.v. prajñā; s.v. pāramitā"
      },
      {
        "w": "mahāmantro",
        "gloss": "= mahat + mantra: 'the great mantra/spell' (Müller: 'the great verse'); nom. -mantraḥ > -mantro",
        "gram": "karmadhāraya cpd., nom. sg. m.",
        "ped": "MW s.v. mahat; s.v. mantra"
      },
      {
        "w": "mahāvidyāmantro",
        "gloss": "= mahat + vidyā + mantra: 'the great knowledge-mantra' (vidyā 'knowledge, spell'). Müller: 'the verse of the great wisdom'",
        "gram": "cpd., nom. sg. m.",
        "ped": "MW s.v. mahat; s.v. vidyā; s.v. mantra"
      },
      {
        "w": "'nuttaramantro",
        "gloss": "= anuttara + mantra (initial a- elided after -o, marked by avagraha '): 'the unsurpassed mantra' (anuttara 'without a higher'). Müller: 'the unsurpassed verse'",
        "gram": "karmadhāraya cpd., nom. sg. m. (avagraha for elided a-)",
        "ped": "MW s.v. anuttara; s.v. mantra"
      },
      {
        "w": "'samasamamantraḥ",
        "gloss": "= asamasama + mantra (a- elided, avagraha): 'the peerless mantra' — asamasama 'equal to the unequalled, matchless' (a-sama-sama). Müller: 'the peerless verse'",
        "gram": "cpd., nom. sg. m.",
        "ped": "MW s.v. asamasama; s.v. sama; s.v. mantra"
      },
      {
        "w": "sarvaduḥkhapraśamanaḥ",
        "gloss": "= sarva + duḥkha + praśamana: 'allayer of all suffering' (praśamana 'pacifying, quieting', from pra-√śam). Müller: 'which appeases all pain'",
        "gram": "cpd. adj., nom. sg. m.",
        "ped": "MW s.v. sarva; s.v. duḥkha; s.v. praśamana; s.v. śam"
      },
      {
        "w": "satyam",
        "gloss": "true, truth ('it is truth')",
        "gram": "nt., nom. sg. (adj./subst.)",
        "ped": "MW s.v. satya"
      },
      {
        "w": "amithyatvāt",
        "gloss": "= a + mithyā + -tva: 'because of not-being-false' (mithyā 'falsely, wrongly' + abstract -tva, negated); abl. of cause. Müller: 'because it is not false'",
        "gram": "abstract-noun cpd., abl. sg. nt.",
        "ped": "MW s.v. mithyā; s.v. tva"
      },
      {
        "w": "prajñāpāramitāyām",
        "gloss": "in the perfection of wisdom (locative: 'the mantra spoken in the Prajñāpāramitā')",
        "gram": "tatpuruṣa cpd., loc. sg. f.",
        "ped": "MW s.v. prajñā; s.v. pāramitā"
      },
      {
        "w": "ukto",
        "gloss": "spoken, proclaimed, uttered (ppp. of √vac); nom. -aḥ > -o. Müller: 'proclaimed'",
        "gram": "ppp. of √vac, nom. sg. m.",
        "ped": "MW s.v. ukta; s.v. vac"
      },
      {
        "w": "mantras",
        "gloss": "mantra, spell, formula (Müller renders 'verse' throughout); nom. mantraḥ > mantras before t-",
        "gram": "m., nom. sg. (mantraḥ > mantras)",
        "ped": "MW s.v. mantra"
      },
      {
        "w": "tadyathā",
        "gloss": "= tad + yathā: 'namely, as follows, that is to say' — the standard formula introducing a mantra's words",
        "gram": "indecl. phrase (tad 'that' + yathā 'as')",
        "ped": "MW s.v. tad; s.v. yathā"
      }
    ],
    "translation": {
      "text": "'Therefore one ought to know the great verse of the Pragñâpâramitâ, the verse of the great wisdom, the unsurpassed verse, the peerless verse, which appeases all pain—it is truth, because it is not false—the verse proclaimed in the Pragñâpâramitâ:",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "Müller consistently translates 'mantra' as 'verse'. The four epithets (mahā-, mahāvidyā-, anuttara-, asamasama-mantra) are the sūtra's own praise of the formula; reported as the text's language. 'satyam amithyatvāt' = 'true because not false' introduces the mantra's authority-claim in the text's own voice, described not endorsed."
  },
  {
    "ref": "hrdaya:14",
    "sanskrit": "gate gate pāragate pārasaṃgate bodhi svāhā",
    "words": [
      {
        "w": "gate",
        "gloss": "gone, one who has gone (voc./loc. of gata, ppp. of √gam) — traditionally read as a feminine vocative addressing the 'gone' one (i.e. wisdom/the goddess Prajñāpāramitā), or as an absolute/interjectional 'gone!'. Müller renders the whole as 'O wisdom, gone…', taking it as an address",
        "gram": "ppp. of √gam, voc. sg. f. (so trad.); form also loc. sg.",
        "ped": "MW s.v. gata; s.v. gam"
      },
      {
        "w": "gate",
        "gloss": "gone (repetition, intensifying: 'gone, gone')",
        "gram": "ppp. of √gam, voc. sg. f.",
        "ped": "MW s.v. gata; s.v. gam"
      },
      {
        "w": "pāragate",
        "gloss": "= pāra + gata: 'gone to the far shore' (pāra 'the further bank, the beyond' + gata 'gone'). Müller: 'gone to the other shore'",
        "gram": "tatpuruṣa cpd. (ppp.), voc. sg. f.",
        "ped": "MW s.v. pāra; s.v. gata"
      },
      {
        "w": "pārasaṃgate",
        "gloss": "= pāra + saṃ + gata: 'gone completely to the far shore, fully arrived beyond' (saṃ- intensive 'together, wholly'). Müller: 'landed at the other shore'",
        "gram": "tatpuruṣa cpd. (ppp.), voc. sg. f.",
        "ped": "MW s.v. pāra; s.v. saṃgata; s.v. gam"
      },
      {
        "w": "bodhi",
        "gloss": "awakening, enlightenment (from √budh) — a vocative 'O awakening!' or read with svāhā as 'to awakening, hail'. Müller's opening 'O wisdom' answers roughly to this term brought forward",
        "gram": "f., voc. sg. (bodhi)",
        "ped": "MW s.v. bodhi; s.v. budh"
      },
      {
        "w": "svāhā",
        "gloss": "'hail! / so be it!' — the ancient exclamation that closes an offering or invocation (Vedic svāhā, marking an oblation). Müller keeps it untranslated as 'Svâhâ!'",
        "gram": "indecl. (ritual exclamation)",
        "ped": "MW s.v. svāhā"
      }
    ],
    "translation": {
      "text": "\"O wisdom, gone, gone, gone to the other shore, landed at the other shore, Svâhâ!\"'",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "FRAMING: the mantra is transliterated and glossed here strictly AS LANGUAGE — each word's grammar and lexical sense — and is expressly NOT presented as efficacious; the wing makes no claim that reciting it produces any effect. The sūtra itself calls it a spell that 'allays all suffering' (hrdaya:13); that is reported as the text's own claim, described never prescribed. Grammar of 'gate' is itself debated (feminine vocative addressing personified Wisdom, vs an uninflected/absolutive 'gone'); both are noted. Müller's 'O wisdom' has no separate word in 'gate gate' — it is his interpretive vocative, kept verbatim as his rendering."
  },
  {
    "ref": "hrdaya:15",
    "sanskrit": "iti prajñāpāramitāhṛdayaṃ samāptam",
    "words": [
      {
        "w": "iti",
        "gloss": "thus, so (end-quote / closing particle marking the end of the text)",
        "gram": "indecl. (quotative/closing)",
        "ped": "MW s.v. iti"
      },
      {
        "w": "prajñāpāramitāhṛdayaṃ",
        "gloss": "= prajñāpāramitā + hṛdaya: 'the Heart of the Perfection of Wisdom' (hṛdaya 'heart, core, essence'); the title as a noun",
        "gram": "tatpuruṣa cpd., nom. sg. nt.",
        "ped": "MW s.v. prajñā; s.v. pāramitā; s.v. hṛdaya"
      },
      {
        "w": "samāptam",
        "gloss": "completed, finished, ended (ppp. of sam-√āp 'to reach, complete')",
        "gram": "ppp. of sam-√āp, nom. sg. nt.",
        "ped": "MW s.v. samāpta; s.v. āp"
      }
    ],
    "translation": {
      "text": "Thus ends the heart of the Pragñâpâramitâ.",
      "source": "Müller, SBE 49 (1894; PD), p.154, verbatim"
    },
    "notes": "Closing colophon. Müller's larger-text version prints 'Here ends the Pragñâpâramitâhridayasûtra'; the smaller text closes 'Thus ends the heart of the Pragñâpâramitâ' (reproduced). Colophon wording varies by manuscript (…hṛdayaṃ samāptam / …hṛdayasūtraṃ samāptam); flagged."
  }
];
