// ============================================================================
//  data/confluence.js  ·  The Great Confluence — cross-tradition atlas data
//  (R27 "The Great Confluence"). PURE DATA. No DOM, no network, no Date, no
//  randomness. Consumed by core/confluence.js (geometry engine) and painted by
//  app/confluence.js. One source of truth for the atlas and the mobile ledger.
//
//  PROVENANCE. Compiled from NINE adversarially-verified research domains
//  (kabbalah, yoga-vedanta, tantra-rasa, buddhist, daoist, alchemy-west,
//  abrahamic-mysticism [→ christian + islamic lanes], confluence-early,
//  confluence-modern). The verification pass logged 109 corrections across the
//  domains; four synthesis entries (person-jung, corpus-hermeticum, picatrix,
//  yijing) were authored to resolve cross-domain edge references and are cited
//  to the same standard. Bodies, sources and contested blocks are reproduced
//  VERBATIM from the verified files — this module rewords nothing.
//
//  HONESTY RULES (locked, site-wide).
//   • The atlas plots INFLUENCE, never validity: an edge means "demonstrably
//     read / rendered / answered / absorbed," per its own citation — nothing
//     about whether any doctrine works.
//   • Every entry carries an epistemic `label`: documented | disputed |
//     debunked | conspiracy. Debunked / conspiracy material STAYS in the record,
//     drawn recessive, never dressed as documented fact.
//   • `contested` entries carry ≥2 positions, each with its own citation,
//     reproduced verbatim and NEVER resolved by the site.
//   • Techniques are DESCRIBED as historical practice, never prescribed.
//
//  SCHEMA.
//   CONFLUENCE_LANES:  { id, name, glyph, side:'west'|'spine'|'east' }  (9, fixed order)
//   CONFLUENCE_ENTRIES (188), each:
//     { slug, lane, title, titleOriginal|null, dateText, sortYear (BCE negative),
//       sortYearEnd|null, dateCertainty:'year'|'decade'|'century'|'range'|'contested',
//       kind:'text'|'person'|'event'|'translation'|'institution', place|null,
//       body, technique:string|null, label, sources:[...],
//       contested:null|{flag, positions:[{source,value},...]}, siteLink:null|{href,label} }
//     Sorted by (sortYear, slug).
//   CONFLUENCE_EDGES (151), each:
//     { from, to, kind:'translation'|'influence'|'commentary'|'synthesis'
//       |'refutation'|'adaptation', body, sources:[...] }
//     from = the earlier work / source of the act; to = where it landed.
//     Sorted by (from, to, kind); deduped on that triple (kept the richer sources).
//
//  MERGE OPERATIONS APPLIED (merge-instructions.md, exactly): 5 duplicate copies
//  dropped with their unique sources unioned into the kept copy; 4 edge endpoints
//  repointed (wilhelm-golden-flower-1929→event-golden-flower-1929,
//  event-1144-alchemy-latin→event-robert-chester-1144, upanishads→
//  brhadaranyaka-upanisad, taiyi-jinhua-zongzhi→secret-of-the-golden-flower);
//  edges deduped on (from,to,kind); the Pico text↔event pair was already linked
//  (event-pico-1486→pico-conclusions) so no synthetic edge was added.
//  Assertions passed: no dangling endpoints; entry total 188; 29 of
//  151 edges cross traditions.
//
//  DO NOT hand-edit — regenerate via scratchpad/r27/gen-data.mjs.
// ============================================================================

export const CONFLUENCE_LANES = [
  {
    "id": "christian",
    "name": "Christian contemplation",
    "glyph": "✝",
    "side": "west"
  },
  {
    "id": "alchemy-west",
    "name": "Hermetica & Alchemy",
    "glyph": "☿",
    "side": "west"
  },
  {
    "id": "kabbalah",
    "name": "Kabbalah",
    "glyph": "א",
    "side": "west"
  },
  {
    "id": "islamic",
    "name": "Sufi Islam",
    "glyph": "☪",
    "side": "west"
  },
  {
    "id": "confluence",
    "name": "The Confluence",
    "glyph": "✶",
    "side": "spine"
  },
  {
    "id": "yoga-vedanta",
    "name": "Yoga & Vedānta",
    "glyph": "ॐ",
    "side": "east"
  },
  {
    "id": "tantra-rasa",
    "name": "Tantra & Rasaśāstra",
    "glyph": "☤",
    "side": "east"
  },
  {
    "id": "buddhist",
    "name": "Buddhist lineages",
    "glyph": "☸",
    "side": "east"
  },
  {
    "id": "daoist",
    "name": "Daoist China",
    "glyph": "☯",
    "side": "east"
  }
];

export const CONFLUENCE_ENTRIES = [
  {
    "slug": "rigveda",
    "lane": "yoga-vedanta",
    "title": "Rigveda",
    "titleOriginal": "Ṛgveda",
    "dateText": "c. 1500–1200 BCE (codified c. 1200–1000 BCE)",
    "sortYear": -1500,
    "sortYearEnd": -1200,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Punjab region, northwestern South Asia",
    "body": "The oldest stratum of Sanskrit literature: 1,028 hymns to Agni, Indra, Soma and other deities, composed orally in the Punjab region and transmitted by prodigious feats of memorization for centuries before writing. Philology places the core 'family books' around 1500–1200 BCE, with codification under the early Kuru polity by c. 1000 BCE. Claims of far greater antiquity from astronomical readings have not withstood scrutiny. The hymns contain no systematic yoga; later tradition retrojects contemplative practice onto them.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Michael Witzel, 'Vedas and Upaniṣads', in The Blackwell Companion to Hinduism (2003)",
      "Thomas Oberlies, Die Religion des Ṛgveda (1998)",
      "Stephanie Jamison & Joel Brereton, The Rigveda: The Earliest Religious Poetry of India (OUP, 2014)"
    ],
    "contested": {
      "flag": "Absolute date of composition of the Rigvedic corpus",
      "positions": [
        {
          "source": "Michael Witzel ('Vedas and Upaniṣads', Blackwell Companion to Hinduism, 2003); Gavin Flood (1996)",
          "value": "hymns composed c. 1500–1200 BCE; collection codified c. 1200–1000 BCE in the early Kuru realm"
        },
        {
          "source": "Thomas Oberlies, Die Religion des Ṛgveda (1998)",
          "value": "on 'cumulative evidence', a wider window of c. 1700–1100 BCE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "atharvaveda",
    "lane": "tantra-rasa",
    "title": "Atharvaveda",
    "titleOriginal": "Atharvaveda",
    "dateText": "c. 1200–1000 BCE (compilation)",
    "sortYear": -1100,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Kuru realm, northwestern India",
    "body": "The fourth Veda: some 730 hymns of healing charms, protective rites, and abhichara — hostile sorcery against rivals, demons, and disease. Witzel dates its compilation to the early Iron Age, at or slightly after c. 1200/1000 BCE, from its mention of iron ('black metal'); Flood prefers c. 900 BCE. Its ritual pragmatism, later elaborated in the tantric shatkarman (six acts), makes it the deepest documented root of Indian magical literature.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Michael Witzel, 'The Development of the Vedic Canon and its Schools' (1997)",
      "Gavin Flood, An Introduction to Hinduism (1996)",
      "Hans-Georg Türstig, 'The Indian Sorcery Called Abhicāra', WZKS 29 (1985), 69–117"
    ],
    "contested": {
      "flag": "Date of compilation of the hymn collection",
      "positions": [
        {
          "source": "Michael Witzel, 'The Development of the Vedic Canon and its Schools' (1997)",
          "value": "at, or slightly after, c. 1200/1000 BCE (early Iron Age, Kuru realm)"
        },
        {
          "source": "Gavin Flood, An Introduction to Hinduism (1996)",
          "value": "c. 900 BCE"
        }
      ]
    },
    "siteLink": {
      "href": "abhichara/index.html",
      "label": "Abhichara wing"
    }
  },
  {
    "slug": "yijing",
    "lane": "daoist",
    "title": "The Yijing (I Ching, Book of Changes)",
    "titleOriginal": "易經",
    "dateText": "core divination text, Western Zhou, c. 9th c. BCE; 'Ten Wings' appended by the Han; canonized 136 BCE",
    "sortYear": -850,
    "sortYearEnd": -136,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Zhou China",
    "body": "The Changes began as a Western Zhou diviner's manual — sixty-four hexagrams with omen texts — and grew, through the appended 'Ten Wings' commentaries, into the first of the Confucian classics and a shared cosmological grammar for Daoist and Confucian thought alike. Bouvet's correspondence carried its diagrams to Leibniz in 1701–03; Wilhelm's German translation (1924; English via Baynes, 1950) made it a twentieth-century Western oracle.",
    "technique": "The tradition's yarrow-stalk consultation — forty-nine stalks repeatedly divided to build a hexagram line by line — is described in the Great Commentary; the site's I Ching page computes the procedure's arithmetic for study.",
    "label": "documented",
    "sources": [
      "Richard Rutt, The Book of Changes (Zhouyi): A Bronze Age Document (Curzon, 1996)",
      "Edward L. Shaughnessy, The Composition of the Zhouyi (PhD dissertation, Stanford, 1983)",
      "Richard J. Smith, Fathoming the Cosmos and Ordering the World (University of Virginia Press, 2008)"
    ],
    "contested": {
      "flag": "Authorship and dating of the core text",
      "positions": [
        {
          "source": "Traditional attribution (canonical prefaces)",
          "value": "trigrams from Fuxi; hexagram and line texts from King Wen and the Duke of Zhou; the Ten Wings from Confucius"
        },
        {
          "source": "Modern text-critical scholarship (Shaughnessy 1983; Rutt 1996)",
          "value": "core text compiled late Western Zhou, c. 9th c. BCE; the Ten Wings centuries later (Warring States–Han), none by Confucius"
        }
      ]
    },
    "siteLink": {
      "href": "iching.html",
      "label": "I Ching — the Changes, computed"
    }
  },
  {
    "slug": "brhadaranyaka-upanisad",
    "lane": "yoga-vedanta",
    "title": "Brhadaranyaka Upanishad",
    "titleOriginal": "Bṛhadāraṇyaka Upaniṣad",
    "dateText": "c. 7th–6th c. BCE, give or take a century (Olivelle)",
    "sortYear": -650,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Northern India (Kuru-Pancala–Videha region)",
    "body": "The earliest of the great prose Upanishads, transmitted as the closing portion of the Shatapatha Brahmana of the White Yajurveda. Its dialogues around the sage Yajnavalkya articulate the identity of atman and brahman, the negative formula 'neti neti', and some of the earliest statements of karma and rebirth. Olivelle places it, pre-Buddhist, in the 7th–6th centuries BCE 'give or take a century or so', warning that tighter datings of the early Upanishads are 'as stable as a house of cards'.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Patrick Olivelle, The Early Upanishads: Annotated Text and Translation (OUP, 1998)",
      "Wikipedia, 'Brihadaranyaka Upanishad' (accessed 2026, citing Olivelle)"
    ],
    "contested": {
      "flag": "Date of composition of the oldest Upanishad",
      "positions": [
        {
          "source": "Patrick Olivelle, The Early Upanishads (OUP, 1998)",
          "value": "pre-Buddhist, 7th–6th c. BCE, give or take a century; anything more precise is 'a house of cards'"
        },
        {
          "source": "Older Indological scholarship (e.g. Deussen's tradition) and some current surveys",
          "value": "oldest layers earlier still — scholarly estimates range from c. 900 to 600 BCE, all pre-Buddhist"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "anapanasati-sutta",
    "lane": "buddhist",
    "title": "Ānāpānasati Sutta",
    "titleOriginal": "Ānāpānasati Sutta (MN 118)",
    "dateText": "c. 5th–3rd c. BCE (oral composition; written down 1st c. BCE)",
    "sortYear": -400,
    "sortYearEnd": -250,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Gangetic plain, India (oral transmission)",
    "body": "The canonical discourse on mindfulness of breathing, the 118th sutta of the Majjhima Nikāya. It sets out sixteen contemplations in four tetrads and claims that breath-mindfulness, fully developed, fulfils the four establishments of mindfulness and the seven awakening factors. It is the root text for breath-centred meditation across the Theravāda world and was elaborated at length in Buddhaghosa's Visuddhimagga.",
    "technique": "The text describes sixteen steps in which the meditator attends to the breath while progressively contemplating the body, feelings, mind, and impermanence — e.g., knowing a long breath as long, calming the bodily formation, and observing fading and relinquishment — organized as four tetrads mapped to the four satipaṭṭhānas.",
    "label": "documented",
    "sources": [
      "Bhikkhu Ñāṇamoli & Bhikkhu Bodhi (tr.), The Middle Length Discourses of the Buddha, 1995",
      "Anālayo, Perspectives on Satipaṭṭhāna, 2013"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "katha-upanisad",
    "lane": "yoga-vedanta",
    "title": "Katha Upanishad",
    "titleOriginal": "Kaṭha Upaniṣad",
    "dateText": "c. 5th–3rd c. BCE (contested)",
    "sortYear": -400,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Northern India",
    "body": "A verse Upanishad framing the boy Naciketas's dialogue with Death. It contains the first datable occurrence of the word 'yoga' in a technical, contemplative sense: its closing verses call yoga the firm restraint of the senses when mind and intellect stand still. Its chariot simile — the self as passenger, the body as chariot, the mind as reins — became stock imagery for the disciplined self across later Indian literature. Dating rests on language and doctrine alone, and scholars diverge widely.",
    "technique": "The text describes an inward method it calls adhyatma-yoga: the senses, mind and intellect are progressively stilled and withdrawn until only the self remains. It presents this as Death's teaching to Naciketas, not as a stepwise manual.",
    "label": "documented",
    "sources": [
      "Patrick Olivelle, The Early Upanishads (OUP, 1998)",
      "Gavin Flood, An Introduction to Hinduism (Cambridge, 1996)",
      "David Gordon White, The Yoga Sutra of Patanjali: A Biography (Princeton, 2014)"
    ],
    "contested": {
      "flag": "Date of composition",
      "positions": [
        {
          "source": "Gavin Flood, An Introduction to Hinduism (1996), as cited in standard surveys",
          "value": "probably composed between the 5th and 3rd centuries BCE"
        },
        {
          "source": "David Gordon White, The Yoga Sutra of Patanjali: A Biography (2014)",
          "value": "about the 3rd century BCE"
        },
        {
          "source": "Richard King; A. L. Basham (reported in the secondary literature)",
          "value": "c. 5th century BCE, after the earliest Buddhist material"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "satipatthana-sutta",
    "lane": "buddhist",
    "title": "Satipaṭṭhāna Sutta",
    "titleOriginal": "Satipaṭṭhāna Sutta (MN 10; longer version DN 22)",
    "dateText": "c. 5th–3rd c. BCE (oral composition; written down 1st c. BCE)",
    "sortYear": -400,
    "sortYearEnd": -250,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Gangetic plain, India (oral transmission)",
    "body": "The discourse on the 'establishments of mindfulness', preserved as the tenth sutta of the Majjhima Nikāya with an expanded version in the Dīgha Nikāya. It presents systematic observation of body, feeling-tones, mind and mental phenomena as 'the direct path' to liberation. Committed to writing with the rest of the canon in first-century-BCE Sri Lanka, it became the charter text of the modern vipassanā movement and, at several removes, of secular mindfulness programs.",
    "technique": "The text instructs its practitioner to establish mindfulness on four domains — the body (breathing, postures, activities, anatomical parts, elements, charnel-ground decay), feeling-tones, states of mind, and categories of mental phenomena — contemplating each internally and externally as arising and passing away.",
    "label": "documented",
    "sources": [
      "Bhikkhu Ñāṇamoli & Bhikkhu Bodhi (tr.), The Middle Length Discourses of the Buddha, 1995",
      "Anālayo, Satipaṭṭhāna: The Direct Path to Realization, 2003"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "shvetashvatara-upanisad",
    "lane": "yoga-vedanta",
    "title": "Shvetashvatara Upanishad",
    "titleOriginal": "Śvetāśvatara Upaniṣad",
    "dateText": "c. 4th–3rd c. BCE (after the Katha)",
    "sortYear": -350,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Northern India",
    "body": "A theistic verse Upanishad devoted to Rudra-Shiva, composed after the Katha in the last centuries BCE. Its second chapter preserves some of the earliest surviving descriptions of meditative procedure — the held body, the restrained breath, the choice of a quiet, sheltered place — making it a distant ancestor of the later yoga manuals. It is also an early landmark of devotional monotheism inside the Vedic corpus, anticipating themes the Bhagavad Gita would develop.",
    "technique": "Chapter 2 describes a practitioner holding trunk, head and neck erect, restraining the senses and the breath until it becomes subtle, and meditating in a clean, level, quiet place sheltered from wind — framed in the text as a path to knowing the deity.",
    "label": "documented",
    "sources": [
      "Patrick Olivelle, The Early Upanishads (OUP, 1998)",
      "Gavin Flood, An Introduction to Hinduism (Cambridge, 1996)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "neiye",
    "lane": "daoist",
    "title": "Neiye (Inward Training)",
    "titleOriginal": "內業",
    "dateText": "c. 350–300 BCE",
    "sortYear": -325,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "State of Qi, China (preserved in the Guanzi)",
    "body": "Preserved as a short chapter of the Guanzi compendium, the Neiye ('Inward Training') is a set of rhymed verses that Harold Roth identifies as the oldest surviving Chinese text on breath meditation. It describes how aligning the body and calming the breath lets vital essence (jing) settle, so the heart-mind becomes a 'lodging place' for the Way. Roth dates it to the mid-fourth century BCE — earlier, he argues, than the received Daodejing — making it the fountainhead of Daoist 'inner cultivation.'",
    "technique": "The verses describe a fourfold aligning — of body, limbs, breath, and heart-mind — in which the practitioner sits stably, regularizes and quiets the breathing, and empties the mind of desire and excess thought so that vital essence accumulates and the Way 'comes to rest' within.",
    "label": "documented",
    "sources": [
      "Harold D. Roth, Original Tao: Inward Training (Nei-yeh) and the Foundations of Taoist Mysticism, Columbia University Press, 1999",
      "W. Allyn Rickett, Guanzi: Political, Economic, and Philosophical Essays from Early China, vol. 2, Princeton University Press, 1998"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "daodejing",
    "lane": "daoist",
    "title": "Daodejing (Laozi)",
    "titleOriginal": "道德經",
    "dateText": "compiled c. 4th–3rd c. BCE; oldest slips (Guodian) c. 300 BCE",
    "sortYear": -320,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Warring States China (Guodian slips: Jingmen, Hubei)",
    "body": "The foundational Daoist classic: a terse anthology on the Way, non-action, and self-cultivation, traditionally ascribed to Laozi, an archivist said to have instructed Confucius. Modern scholarship treats it as a composite text that reached form in the fourth to third centuries BCE. Bamboo slips excavated at Guodian in 1993, from a tomb closed around 300 BCE, contain about two-fifths of the received text and are its earliest witness — a terminus, not a composition date. Laozi's historicity remains genuinely disputed.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Robert G. Henricks, Lao Tzu's Tao Te Ching: A Translation of the Startling New Documents Found at Guodian, Columbia University Press, 2000",
      "William G. Boltz, 'Lao tzu Tao te ching', in Michael Loewe (ed.), Early Chinese Texts: A Bibliographical Guide, 1993",
      "Alan Chan, 'Laozi', Stanford Encyclopedia of Philosophy"
    ],
    "contested": {
      "flag": "Whether Laozi was a historical person who authored the text",
      "positions": [
        {
          "source": "Sima Qian, Shiji (c. 94 BCE), the traditional account",
          "value": "Laozi was Li Er (Lao Dan), a Zhou dynasty archivist and elder contemporary of Confucius (6th c. BCE), who wrote the two-part text before departing west"
        },
        {
          "source": "William G. Boltz, 'Lao tzu Tao te ching', in Loewe (ed.), Early Chinese Texts (1993); A. C. Graham",
          "value": "The text is a composite anthology assembled c. 4th–3rd c. BCE with no single author; 'Laozi' is a legendary figure retrojected onto it"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "event-alexandria-fusion",
    "lane": "confluence",
    "title": "Alexandria: the Greco-Egyptian-Jewish fusion milieu",
    "titleOriginal": null,
    "dateText": "c. 300 BCE – 300 CE",
    "sortYear": -300,
    "sortYearEnd": 300,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Alexandria, Ptolemaic and Roman Egypt",
    "body": "Under the Ptolemies and Rome, Alexandria concentrated Greek philosophy, Egyptian priestly learning, and Jewish scriptural culture — the Septuagint and Philo — in one harbour city. From this Greco-Egyptian fusion came the philosophical Hermetica, Greek in idiom but claiming Thoth-Hermes as their sage, and the earliest Greek alchemical writings ascribed to Pseudo-Democritus and elaborated by Zosimos of Panopolis. Fowden reads the technical and philosophical Hermetica alike as products of this single bilingual milieu.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Garth Fowden, The Egyptian Hermes: A Historical Approach to the Late Pagan Mind (Cambridge, 1986)",
      "Brian Copenhaver, Hermetica (Cambridge, 1992), introduction"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "The Hermetica on the Workbench"
    }
  },
  {
    "slug": "zhuangzi",
    "lane": "daoist",
    "title": "Zhuangzi",
    "titleOriginal": "莊子",
    "dateText": "core chapters c. 4th c. BCE; received text ed. Guo Xiang c. 300 CE",
    "sortYear": -300,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Warring States China",
    "body": "The second great classic of early Daoism, whose 'inner chapters' are generally credited to Zhuang Zhou (4th c. BCE); the received thirty-three-chapter text was edited by Guo Xiang around 300 CE. Amid its parables and paradoxes stand the two most cited descriptions of early Daoist meditation: xinzhai, the 'fasting of the mind' (chapter 4), and zuowang, 'sitting and forgetting' (chapter 6) — both placed, with sly irony, in the mouths of Confucius and his student Yan Hui.",
    "technique": "In chapter 4 a fictionalized Confucius teaches xinzhai: listening not with ear or mind but with qi, cultivating an emptiness in which the Way gathers. In chapter 6 Yan Hui reports zuowang: letting limbs, perception, and knowledge 'fall away' into a self-forgetting stillness — a practice later Tang Daoists systematized under the same name.",
    "label": "documented",
    "sources": [
      "A. C. Graham, Chuang-tzu: The Inner Chapters, 1981",
      "Livia Kohn, Sitting in Oblivion: The Heart of Daoist Meditation, Three Pines Press, 2010"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-pali-canon-written",
    "lane": "buddhist",
    "title": "The Pali Canon Committed to Writing (Fourth Council)",
    "titleOriginal": null,
    "dateText": "1st c. BCE; conventionally 29–17 BCE (reign of Vaṭṭagāmaṇī Abhaya)",
    "sortYear": -29,
    "sortYearEnd": -17,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Aluvihāra, near Matale, Sri Lanka (location per later tradition)",
    "body": "The Sinhalese chronicles Dīpavaṃsa and Mahāvaṃsa record that monks of the Mahāvihāra lineage, facing famine and war under King Vaṭṭagāmaṇī Abhaya, wrote the previously oral Tipiṭaka and its commentaries onto palm leaves. Theravāda tradition counts this as its Fourth Council and places it at the Aluvihāra rock temple near Matale — a location supplied by later Sinhalese tradition, not named in the chronicles themselves. Modern scholarship accepts a first-century-BCE writing-down as broadly historical while noting the account rests on chronicles compiled centuries later; no original manuscript survives, and the king's absolute dates depend on which Sri Lankan chronology is followed.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Hermann Oldenberg (ed. & tr.), The Dīpavaṃsa: An Ancient Buddhist Historical Record, 1879",
      "K. R. Norman, Pāli Literature, 1983",
      "Oskar von Hinüber, A Handbook of Pāli Literature, 1996"
    ],
    "contested": {
      "flag": "Vaṭṭagāmaṇī Abhaya's reign dates: two chronologies for early Sri Lanka",
      "positions": [
        {
          "source": "Wilhelm Geiger's corrected chronology (Buddha's parinibbāna c. 483 BCE), followed in much Pali scholarship (e.g. K. R. Norman, Pāli Literature, 1983)",
          "value": "second reign c. 29–17 BCE"
        },
        {
          "source": "Traditional Sinhalese chronicle chronology (parinibbāna 544/543 BCE), used in much Sri Lankan historiography",
          "value": "second reign c. 89–77 BCE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "bhagavad-gita",
    "lane": "yoga-vedanta",
    "title": "Bhagavad Gita",
    "titleOriginal": "Bhagavad Gītā",
    "dateText": "c. 2nd c. BCE – 2nd c. CE (contested)",
    "sortYear": 0,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Northern India",
    "body": "A 700-verse dialogue between Krishna and Arjuna set into the sixth book of the Mahabharata, weaving Samkhya cosmology, Upanishadic monism and early theism into parallel disciplines of action, knowledge and devotion. It absorbs older material: two verses on the deathless self are taken nearly verbatim from the Katha Upanishad. Whether it belongs to the epic's early core or was interpolated later remains unresolved, so its date floats across roughly four centuries of scholarly proposals.",
    "technique": "Chapter 6 describes a seated meditative discipline: a firm seat in a clean place, body, head and neck held straight, gaze directed toward the tip of the nose, the wandering mind repeatedly drawn back to rest on a single point.",
    "label": "documented",
    "sources": [
      "Jeaneane Fowler, The Bhagavad Gita: A Text and Commentary for Students (Sussex Academic, 2012)",
      "Kashi Nath Upadhyaya, Early Buddhism and the Bhagavadgītā (Motilal Banarsidass, 1971)",
      "Encyclopaedia Britannica, 'Bhagavad Gita'"
    ],
    "contested": {
      "flag": "Date of composition and relation to the Mahabharata's core",
      "positions": [
        {
          "source": "Jeaneane Fowler, The Bhagavad Gita: A Text and Commentary for Students (2012); common scholarly consensus",
          "value": "c. 2nd century BCE, with proposals clustering around the 1st century BCE"
        },
        {
          "source": "Kashi Nath Upadhyaya, Early Buddhism and the Bhagavadgītā (1971)",
          "value": "as early as the 5th–4th century BCE"
        },
        {
          "source": "Encyclopaedia Britannica, 'Bhagavad Gita'",
          "value": "perhaps the 1st or 2nd century CE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "physika-kai-mystika",
    "lane": "alchemy-west",
    "title": "Physika kai Mystika (pseudo-Democritus)",
    "titleOriginal": "Φυσικὰ καὶ μυστικά",
    "dateText": "c. 1st c. CE (Martelli: c. 54–68 CE)",
    "sortYear": 60,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Greco-Roman Egypt",
    "body": "The oldest surviving treatise of Greco-Egyptian alchemy, transmitted under the name of Democritus. Its recipes for making gold and silver, purple dye, and artificial gems close with the refrain 'nature delights in nature; nature conquers nature; nature masters nature', fusing workshop chemistry with natural philosophy. Matteo Martelli's critical edition (2013) dates the extant epitomes to the first century CE; older scholarship traced the material to Bolos of Mendes, centuries earlier.",
    "technique": "Teaches chrysopoeia and argyropoeia by tingeing and alloying: base metals are treated with sulfur waters, arsenic compounds and dye-baths until they take on the appearance of gold or silver. Recorded for historical study; several reagents (arsenic and mercury compounds) are toxic.",
    "label": "documented",
    "sources": [
      "Matteo Martelli, The Four Books of Pseudo-Democritus, 2013",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": {
      "flag": "Author and date of the Democritean alchemical books",
      "positions": [
        {
          "source": "Older scholarship (Ruska; Festugière tradition)",
          "value": "core material by Bolos of Mendes, 3rd–2nd c. BCE, writing as Democritus"
        },
        {
          "source": "Matteo Martelli, The Four Books of Pseudo-Democritus (2013)",
          "value": "extant treatises by an anonymous author c. 54–68 CE, distinct from Bolos"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "corpus-hermeticum",
    "lane": "alchemy-west",
    "title": "The Corpus Hermeticum",
    "titleOriginal": "Ἑρμοῦ τοῦ Τρισμεγίστου",
    "dateText": "treatises composed c. 100–300 CE; gathered as a corpus in Byzantium; Latin 1463, printed 1471",
    "sortYear": 100,
    "sortYearEnd": 300,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Roman Egypt (Alexandria and its milieu)",
    "body": "Greek treatises of philosophical Hermetica composed by anonymous authors in Roman Egypt, blending Greek philosophy, Egyptian religion and Jewish elements, and teaching gnosis — saving knowledge of God, cosmos and self — under the name of Hermes Trismegistus. Assembled as a corpus in Byzantine hands, the collection reached Florence in the 1460s; Ficino's Latin made it the Renaissance's 'ancient theology' until Casaubon's 1614 redating returned it to the Common Era.",
    "technique": "The treatises describe a contemplative ascent: the Poimandres (CH I) narrates the soul's rise through the planetary spheres shedding a vice at each, and CH XIII a rebirth through hymnic silence — presented by the texts as revelation, recorded here as their self-description.",
    "label": "documented",
    "sources": [
      "Brian P. Copenhaver, Hermetica (Cambridge University Press, 1992)",
      "Garth Fowden, The Egyptian Hermes (Cambridge University Press, 1986)",
      "Kevin van Bladel, The Arabic Hermes (Oxford University Press, 2009)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica — the contemplative practices"
    }
  },
  {
    "slug": "cantong-qi",
    "lane": "daoist",
    "title": "Cantong qi (Seal of the Unity of the Three)",
    "titleOriginal": "周易參同契",
    "dateText": "trad. c. 142 CE; received text formed by c. 450 CE (contested)",
    "sortYear": 142,
    "sortYearEnd": 450,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "China (trad. Kuaiji, Zhejiang)",
    "body": "Honored in China as the ancestor of all elixir literature, the Cantong qi weaves together Yijing cosmology, Huang-Lao thought, and alchemy in cryptic emblematic verse. Tradition assigns it to Wei Boyang around 142 CE; Fabrizio Pregadio's textual history argues instead for a composite work — a Han core with accretions reaching a first conclusion around 450 CE, its earliest extant versions surviving only through Tang commentaries. Its mercury–lead emblems were read outwardly by waidan alchemists and inwardly by the entire later neidan tradition.",
    "technique": "The text encodes elixir work in Yijing emblems: the trigrams Kan and Li stand for the ingredients ('true lead' and 'true mercury'), and lunar-cycle hexagram sequences set the timing of the 'fire phases.' Read as waidan it governs compounding actual mercury and lead — both documented severe poisons, described here for study only; read as neidan the same emblems map onto breath and inner essences.",
    "label": "disputed",
    "sources": [
      "Fabrizio Pregadio, The Seal of the Unity of the Three: A Study and Translation of the Cantong qi, Golden Elixir Press, 2011",
      "Joseph Needham et al., Science and Civilisation in China, vol. 5 pt. 3, Cambridge University Press, 1976"
    ],
    "contested": {
      "flag": "Date and authorship: 2nd-century work of Wei Boyang, or later composite?",
      "positions": [
        {
          "source": "Traditional attribution (Wei Boyang legend in the Shenxian zhuan attributed to Ge Hong; Peng Xiao's 10th-c. commentary)",
          "value": "Composed by Wei Boyang, a Han recluse of Kuaiji, c. 142 CE"
        },
        {
          "source": "Fabrizio Pregadio, The Seal of the Unity of the Three (2011)",
          "value": "A composite text in three subject-layers; its composition arrived at a first conclusion c. 450 CE, and no version predates the Tang commentaries"
        }
      ]
    },
    "siteLink": {
      "href": "iching.html",
      "label": "I Ching on the Workbench"
    }
  },
  {
    "slug": "huangting-jing",
    "lane": "daoist",
    "title": "Huangting jing (Scripture of the Yellow Court)",
    "titleOriginal": "黃庭經",
    "dateText": "Outer version c. 2nd–3rd c. CE; Inner version c. late 3rd–4th c. CE",
    "sortYear": 150,
    "sortYearEnd": 350,
    "dateCertainty": "range",
    "kind": "text",
    "place": "China",
    "body": "A rhymed scripture mapping the human body as a landscape of palaces, chambers, and resident gods, centered on the 'Yellow Court' within. The shorter Outer version is generally placed in the late Han–Jin era (c. 2nd–3rd century CE); the expanded Inner version, linked to Wei Huacun and the Shangqing milieu and usually dated to the late 3rd–4th century, was taken up and canonized in the Shangqing corpus — though scholars still debate which of the two versions came first. Recited and visualized for centuries, it became the common ancestor of Daoist body-god meditation and, later, a proof-text for inner alchemy.",
    "technique": "The text instructs its reciter to chant the verses and visualize the gods dwelling in each organ and 'palace' of the body — keeping the spirits in residence, guarding vital essence, and thereby, it claims, warding off illness and death.",
    "label": "documented",
    "sources": [
      "Paul W. Kroll, 'Body Gods and Inner Vision: The Scripture of the Yellow Court', in Donald S. Lopez (ed.), Religions of China in Practice, Princeton University Press, 1996",
      "Isabelle Robinet, Taoist Meditation: The Mao-shan Tradition of Great Purity, SUNY Press, 1993",
      "Livia Kohn, The Yellow Court Scripture, vol. 1: Text and Main Commentaries, Three Pines Press, 2023"
    ],
    "contested": {
      "flag": "Relative dating and priority of the Outer (Waijing) and Inner (Neijing) versions",
      "positions": [
        {
          "source": "Recent textual scholarship, including rhyme-structure analysis (Livia Kohn, The Yellow Court Scripture, vol. 1, Three Pines Press, 2023; earlier, Kristofer Schipper's studies)",
          "value": "The Outer version is the older, most likely 2nd-century Eastern Han; the Inner version is a Shangqing-linked expansion roughly a century later (3rd–4th c.)"
        },
        {
          "source": "Wang Ming, 'Huangting jing kao' (textual study)",
          "value": "The Inner version was completed first, in the Western Jin Taikang era (280s), and the Outer version was derived from it in the Eastern Jin"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-maria-jewess",
    "lane": "alchemy-west",
    "title": "Maria the Jewess",
    "titleOriginal": null,
    "dateText": "fl. between 1st and 3rd c. CE (known only through Zosimos)",
    "sortYear": 150,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Alexandria (by tradition), Roman Egypt",
    "body": "Maria the Jewess is the earliest woman recorded in Western alchemy, known solely through quotations preserved by Zosimos of Panopolis, who treats her as a founding authority. The apparatus attributed to her — the kerotakis reflux vessel, the three-armed still or tribikos, and the gentle water-bath still called bain-marie after her — shaped laboratory practice for centuries. No independent writings survive, and her dates can only be bracketed between the first and third centuries CE.",
    "technique": "Credited with vapor-treatment apparatus: the bain-marie heats material indirectly through surrounding water, while the kerotakis suspends metal leaf in circulating sulfurous or mercurial vapors — vapors that are poisonous — until its surface is transformed. Described here as documented history.",
    "label": "documented",
    "sources": [
      "Raphael Patai, The Jewish Alchemists, 1994",
      "Michèle Mertens, Les alchimistes grecs IV.1: Zosime de Panopolis, 1995",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-nagarjuna",
    "lane": "buddhist",
    "title": "Nāgārjuna (Madhyamaka philosopher)",
    "titleOriginal": null,
    "dateText": "c. 150–250 CE",
    "sortYear": 150,
    "sortYearEnd": 250,
    "dateCertainty": "range",
    "kind": "person",
    "place": "South India (Andhra region, Sātavāhana period)",
    "body": "Author of the Mūlamadhyamakakārikā and founder of the Madhyamaka school, which analyses all phenomena as empty of intrinsic nature. Scholarly consensus places him around 150–250 CE in southern India. Indian and Tibetan tradition later conflated him with a tantric alchemist and physician of the same name active centuries later; modern scholarship keeps the figures distinct, and this entry concerns only the second-century philosopher.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Jan Westerhoff, Nāgārjuna's Madhyamaka: A Philosophical Introduction, 2009",
      "Jan Christoph Westerhoff, 'Nāgārjuna', Stanford Encyclopedia of Philosophy, first published 2010 (substantive revision 2026)",
      "David Gordon White, The Alchemical Body, 1996 (on the later alchemist of the same name)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "yoga-sutras",
    "lane": "yoga-vedanta",
    "title": "Yoga Sutras of Patanjali",
    "titleOriginal": "Pātañjalayogaśāstra (Yogasūtra)",
    "dateText": "c. 1st–4th c. CE (contested; Maas: c. 400 CE)",
    "sortYear": 250,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "India (region unknown)",
    "body": "One hundred ninety-five terse aphorisms — 196 in some editions, which divide one sutra differently — defining yoga as the stilling of mental fluctuations and mapping an eight-limbed path to samadhi, in sustained conversation with Buddhist thought. Later Sanskrit tradition conflates the author with the 2nd-century BCE grammarian Patanjali — an identification most modern scholars doubt. Philipp Maas argues from the manuscript evidence that sutras and commentary were composed together as a single work, the Patanjalayogasastra, around 400 CE. It became the reference text of 'classical yoga'.",
    "technique": "The work describes an eightfold discipline — restraints, observances, posture, breath control, sense-withdrawal, concentration, meditation and absorption — through which the fluctuations of consciousness are said to be progressively stilled by practice and dispassion until awareness rests in its own nature.",
    "label": "documented",
    "sources": [
      "Philipp A. Maas, 'A Concise Historiography of Classical Yoga Philosophy', in Periodization and Historiography of Indian Philosophy (2013)",
      "Edwin Bryant, The Yoga Sūtras of Patañjali (North Point Press, 2009)",
      "David Gordon White, The Yoga Sutra of Patanjali: A Biography (Princeton, 2014)"
    ],
    "contested": {
      "flag": "Date, authorship, and whether sutra and bhasya form one work",
      "positions": [
        {
          "source": "Philipp A. Maas, 'A Concise Historiography of Classical Yoga Philosophy' (2013)",
          "value": "c. 400 CE; sutras and bhasya are a single authored whole, the Pātañjalayogaśāstra"
        },
        {
          "source": "Edwin Bryant, The Yoga Sūtras of Patañjali (2009)",
          "value": "shortly after the turn of the Common Era, c. 1st–2nd century CE"
        },
        {
          "source": "Later Sanskrit tradition (e.g. Bhoja; popular accounts)",
          "value": "the author is identical with the 2nd-c. BCE grammarian Patanjali — doubted by most modern scholarship"
        }
      ]
    },
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga Sutras wing"
    }
  },
  {
    "slug": "person-ge-hong",
    "lane": "daoist",
    "title": "Ge Hong",
    "titleOriginal": "葛洪",
    "dateText": "283–343 CE (death also dated c. 363)",
    "sortYear": 283,
    "sortYearEnd": 343,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "Jurong, Jiangsu, China",
    "body": "Southern gentleman-scholar, official, and self-styled 'Master Who Embraces Simplicity,' Ge Hong (283–343, though his death is also dated c. 363) is the most articulate early apologist for the pursuit of transcendence as a learnable art. Heir to the esoteric library of his great-uncle Ge Xuan's lineage, he wrote the Baopuzi and is traditionally credited with the Shenxian zhuan, a collection of transcendents' biographies studied critically by Robert Campany. He ranked laboratory elixirs above herbs, breath work, and merit as the surest path to immortality.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Robert Ford Campany, To Live as Long as Heaven and Earth: A Translation and Study of Ge Hong's Traditions of Divine Transcendents, University of California Press, 2002",
      "James R. Ware, Alchemy, Medicine, Religion in the China of A.D. 320: The Nei P'ien of Ko Hung, MIT Press, 1966"
    ],
    "contested": {
      "flag": "Ge Hong's death date: 343 or c. 363?",
      "positions": [
        {
          "source": "Jin shu official biography as traditionally read (death at 81 sui), in keeping with hagiographic accounts of his end at Mount Luofu",
          "value": "Died c. 363 (some accounts 364), aged 81"
        },
        {
          "source": "Chen Guofu's textual study; Nathan Sivin, 'On the Pao P'u Tzu Nei Pien and the Life of Ko Hung (283–343)', Isis 60, 1969; followed by Robert Ford Campany (2002)",
          "value": "Died 343, aged 61; the age-81 figure is hagiographic and inconsistent with the biography's own chronology"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "leiden-stockholm-papyri",
    "lane": "alchemy-west",
    "title": "Leiden Papyrus X & Stockholm Papyrus",
    "titleOriginal": null,
    "dateText": "c. 300 CE (late 3rd–early 4th c.)",
    "sortYear": 300,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Thebes, Egypt",
    "body": "Two Greek papyrus codices, found together at Thebes and copied around 300 CE (late third or early fourth century), probably by one scribe, preserve the practical substrate of early alchemy without mystical framing. Leiden Papyrus X gives 111 workshop recipes for alloying, gilding, and imitating gold and silver; the Stockholm Papyrus covers gemstones, pearls, and purple dyeing. Their recipes overlap with pseudo-Democritus, revealing the craft literature behind the philosophical treatises.",
    "technique": "Plain workshop recipes: debasing and 'multiplying' precious metals, surface-gilding with mercury amalgams (a toxic process), mordant dyeing, and imitation of purple and gems — an aide-memoire for craftsmen, with no theory attached.",
    "label": "documented",
    "sources": [
      "Robert Halleux, Les alchimistes grecs I: Papyrus de Leyde, Papyrus de Stockholm, 1981",
      "Earle R. Caley, 'The Leyden Papyrus X' and 'The Stockholm Papyrus', Journal of Chemical Education, 1926–1927"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "zosimos-corpus",
    "lane": "alchemy-west",
    "title": "Zosimos of Panopolis, alchemical corpus",
    "titleOriginal": "Χειρόκμητα (Cheirokmeta)",
    "dateText": "fl. c. 300 CE",
    "sortYear": 300,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Panopolis (Akhmim), Roman Egypt",
    "body": "Zosimos of Panopolis, working in Roman Egypt around 300 CE, produced the earliest alchemical corpus by a securely historical author, later excerpted by Byzantine compilers. His writings pair concrete laboratory instruction — furnaces, stills, sublimation of arsenic and mercury — with visionary allegories in which priest-figures are dismembered and boiled, dreams he reads as images of the transformation of matter and, in Gnostic key, of the self. Michèle Mertens's critical edition (1995) anchors modern study.",
    "technique": "Describes distillation, sublimation, and the fixation of volatile 'spirits' (mercury, sulfur, arsenic) upon metals, interpreted through dream-allegory. The metallic vapors central to these operations are toxic; the procedures survive as historical record, not practice.",
    "label": "documented",
    "sources": [
      "Michèle Mertens, Les alchimistes grecs IV.1: Zosime de Panopolis, 1995",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "baopuzi",
    "lane": "daoist",
    "title": "Baopuzi (Inner Chapters)",
    "titleOriginal": "抱朴子內篇",
    "dateText": "completed c. 317 CE (revised to c. 330)",
    "sortYear": 317,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Jurong, Jiangsu, China",
    "body": "Ge Hong's Inner Chapters, substantially complete by 317 CE by his own account, are the fullest early source on waidan, 'external alchemy.' The chapters on 'gold and cinnabar' rank elixirs of refined cinnabar (mercury sulfide) and 'potable gold' above every other method of transcendence, alongside chapters on talismans, demonology, and herbs. The recipes call for mercury, arsenic, and lead compounds — all documented poisons whose historical ingestion caused deaths, not immortality; the tradition is described here strictly for study.",
    "technique": "The waidan method Ge Hong endorses refines cinnabar through repeated cyclical transformations with mercury in sealed, luted crucibles — the 'nine-times-reverted elixir' — the product to be ingested in small doses. Its ingredients (mercury, arsenic and lead compounds) are severely toxic, and elixir ingestion is documented to have killed practitioners and emperors alike.",
    "label": "documented",
    "sources": [
      "James R. Ware, Alchemy, Medicine, Religion in the China of A.D. 320: The Nei P'ien of Ko Hung, MIT Press, 1966",
      "Fabrizio Pregadio, Great Clarity: Daoism and Alchemy in Early Medieval China, Stanford University Press, 2006"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-shangqing-revelations",
    "lane": "daoist",
    "title": "The Shangqing Revelations",
    "titleOriginal": "上清",
    "dateText": "364–370 CE",
    "sortYear": 364,
    "sortYearEnd": 370,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Jurong (Mount Mao region), Jiangsu, China",
    "body": "Between 364 and 370 CE the visionary Yang Xi, employed by the aristocratic Xu family of Jurong, produced nightly transcripts of visitations from 'Perfected' beings of the Shangqing ('Highest Clarity') heaven, dictated in exquisite literary style. The resulting corpus reoriented southern Daoism away from communal rite and laboratory elixirs toward solitary visualization, founding the Mount Mao (Maoshan) tradition that dominated Tang Daoism. The revelations are documented as a historical textual event; the celestial visitations are their claimed source.",
    "technique": "The Shangqing scriptures instruct their adept to visualize gods residing in the body, to absorb the effulgences of sun, moon, and stars, and to undertake ecstatic spirit-journeys through the heavens — interior, imaginal disciplines replacing both congregational ritual and mineral elixirs.",
    "label": "documented",
    "sources": [
      "Isabelle Robinet, Taoist Meditation: The Mao-shan Tradition of Great Purity, SUNY Press, 1993",
      "Michel Strickmann, 'The Mao Shan Revelations: Taoism and the Aristocracy', T'oung Pao 63, 1977"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "praktikos",
    "lane": "christian",
    "title": "Praktikos (Evagrius Ponticus)",
    "titleOriginal": "Praktikos (Λόγος πρακτικός)",
    "dateText": "c. 385–399 CE (written at Kellia, Egypt)",
    "sortYear": 391,
    "sortYearEnd": 399,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Kellia, Egypt",
    "body": "Evagrius Ponticus, philosopher-monk who reached the Egyptian desert in 383 — roughly two years at Nitria, then the cells of Kellia from c. 385 until his death in 399 — condensed desert ascetic experience into one hundred numbered chapters. The Praktikos classifies the eight generic 'thoughts' (logismoi) — gluttony, lust, avarice, sadness, anger, acedia, vainglory, pride — that assail the monk, and treats their diagnosis as the foundation of the contemplative life. Condemned posthumously for Origenism, Evagrius nonetheless shaped Byzantine and, through Cassian, Latin monastic psychology.",
    "technique": "The text instructs its monastic reader to observe incoming thoughts dispassionately, identify which of the eight logismoi each belongs to, and note its triggers and sequences — an analytic watchfulness meant to culminate in apatheia (calm freedom from compulsive passion), which Evagrius treats as the precondition of prayer. Historical description, not instruction.",
    "label": "documented",
    "sources": [
      "A. & C. Guillaumont (eds.), Évagre le Pontique: Traité pratique, Sources Chrétiennes 170–171 (1971)",
      "Robert E. Sinkewicz, Evagrius of Pontus: The Greek Ascetic Corpus (OUP, 2003)",
      "Columba Stewart, 'Evagrius Ponticus and the Eight Generic Logismoi' (2005)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "sefer-yetzirah",
    "lane": "kabbalah",
    "title": "Sefer Yetzirah (Book of Formation)",
    "titleOriginal": "ספר יצירה",
    "dateText": "c. 2nd–7th c. CE (contested); first printed Mantua 1562",
    "sortYear": 400,
    "sortYearEnd": 650,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Uncertain (Palestine or the Near East)",
    "body": "A terse Hebrew treatise — under 2,500 words in its longest recension — describing creation through the ten sefirot ('ciphers', primordial numbers) and the twenty-two letters of the Hebrew alphabet, arranged in '32 wondrous paths of wisdom'. Nearly every later current of Jewish esotericism, from the Ashkenazi Pietists to Abulafia and the theosophic kabbalists, anchored itself in commentary upon it. Its date is genuinely unresolved, with serious proposals spanning half a millennium; the editio princeps (Mantua, 1562) prints two recensions.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "A. Peter Hayman, Sefer Yeṣira (2004)",
      "Gershom Scholem, Kabbalah (1974)",
      "Editio princeps: Mantua, Ya'akov ben Naphtali ha-Kohen of Gazolo, 1562"
    ],
    "contested": {
      "flag": "Date of composition: proposals range from the 1st–2nd to the 7th–8th century CE",
      "positions": [
        {
          "source": "A. Peter Hayman, Sefer Yeṣira: Edition, Translation and Text-Critical Commentary (2004)",
          "value": "No single original text; a fluid work whose earliest recoverable recensions crystallized late, around the 7th century, in the early Islamic era"
        },
        {
          "source": "Gershom Scholem (Kabbalah, 1974); Yehuda Liebes (Ars Poetica in Sefer Yeṣira, 2000)",
          "value": "An early composition — Scholem placed it between the 3rd and 6th centuries CE; Liebes has argued for a 1st-century, late Second Temple-period date"
        }
      ]
    },
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "yoga-bhasya",
    "lane": "yoga-vedanta",
    "title": "Yoga Bhasya",
    "titleOriginal": "Yogabhāṣya (Vyāsabhāṣya)",
    "dateText": "c. 4th–5th c. CE",
    "sortYear": 425,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "India (region unknown)",
    "body": "The earliest surviving commentary on the Yoga Sutras, expanding the aphorisms into a full philosophical system and fixing their canonical interpretation for every later reading. Tradition ascribes it to the legendary sage Vyasa and dates it to the 4th–5th century CE; Maas contends it is the sutra author's own explanation, the two forming one Patanjalayogasastra, while others have connected it to the Samkhya teacher Vindhyavasin. All subsequent commentaries, including the one attributed to Shankara, respond to it.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Philipp A. Maas, 'A Concise Historiography of Classical Yoga Philosophy' (2013)",
      "Internet Encyclopedia of Philosophy, 'The Yoga Sutras of Patanjali'"
    ],
    "contested": {
      "flag": "Authorship of the commentary",
      "positions": [
        {
          "source": "Traditional attribution (manuscript colophons, later commentators)",
          "value": "composed by Vyāsa, a separate commentator of the 4th–5th c. CE"
        },
        {
          "source": "Philipp A. Maas (2013)",
          "value": "auto-commentary by the sutra author himself; sutra and bhasya are one Pātañjalayogaśāstra, c. 400 CE"
        },
        {
          "source": "Some scholars (reported in the secondary literature)",
          "value": "attributable to or influenced by Vindhyavāsin, a late-4th-c. Sāṃkhya thinker"
        }
      ]
    },
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga Sutras wing (bhashya layer)"
    }
  },
  {
    "slug": "cassian-conferences",
    "lane": "christian",
    "title": "Conferences (John Cassian)",
    "titleOriginal": "Collationes Patrum",
    "dateText": "c. 426–429 CE",
    "sortYear": 427,
    "sortYearEnd": 429,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Marseilles, Gaul",
    "body": "John Cassian, who had trained among the Egyptian desert fathers, wrote the twenty-four Conferences at Marseilles c. 426–429, recasting Evagrian teaching for Latin monasticism. Conference 10, attributed to Abba Isaac, addresses unceasing prayer and transmits a single scriptural formula for it; Benedict's Rule later commended Cassian to every Western monastery, making the Conferences a standing bridge between desert practice and medieval lectio. Cassian names the eight principal vices while quietly omitting the condemned Evagrius' name.",
    "technique": "Conference 10 records the counsel to repeat one verse — 'O God, come to my assistance; O Lord, make haste to help me' (Ps 69:2 Vulgate) — continually through work, vigil and distraction, until the mind, stripped of images, arrives at what Cassian calls the prayer of fire. Described historically.",
    "label": "documented",
    "sources": [
      "Boniface Ramsey (trans.), John Cassian: The Conferences, Ancient Christian Writers 57 (Paulist, 1997)",
      "Columba Stewart, Cassian the Monk (OUP, 1998)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "visuddhimagga",
    "lane": "buddhist",
    "title": "Visuddhimagga (The Path of Purification)",
    "titleOriginal": "Visuddhimagga",
    "dateText": "early 5th c. CE",
    "sortYear": 430,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Mahāvihāra, Anurādhapura, Sri Lanka",
    "body": "Buddhaghosa's encyclopedic manual of Theravāda doctrine and meditation, composed at the Mahāvihāra in Anurādhapura in the early fifth century CE. Structured on the triad of virtue, concentration and understanding, it codifies the commentarial tradition's map of the path — forty meditation subjects, the absorption states, and the progressive 'insight knowledges'. It remained the reference grid against which the Burmese vipassanā teachers of the nineteenth and twentieth centuries framed their methods.",
    "technique": "The manual catalogs forty kammaṭṭhāna (meditation subjects) — ten kasiṇa discs, ten corpse contemplations, ten recollections, four divine abidings, four formless attainments, one perception, one analysis — prescribing subjects to temperaments and mapping the jhāna absorptions and the sequence of insight knowledges.",
    "label": "documented",
    "sources": [
      "Bhikkhu Ñāṇamoli (tr.), The Path of Purification (Visuddhimagga), 1956",
      "Oskar von Hinüber, A Handbook of Pāli Literature, 1996"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "hekhalot-literature",
    "lane": "kabbalah",
    "title": "Hekhalot / Merkabah literature",
    "titleOriginal": "ספרות ההיכלות",
    "dateText": "c. 3rd–7th c. CE (redaction debated)",
    "sortYear": 450,
    "sortYearEnd": 700,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Palestine and Babylonia (uncertain)",
    "body": "The earliest extensive corpus of Jewish mystical writing — Hekhalot Rabbati, Hekhalot Zutarti, Ma'aseh Merkavah, 3 Enoch — describes visionary ascents through seven heavenly palaces (hekhalot) to the divine throne-chariot of Ezekiel's vision. Composed and reworked anonymously in Hebrew and Aramaic between late antiquity and the early Middle Ages, the texts survive only in medieval manuscripts and Cairo Genizah fragments; Peter Schäfer's 1981 Synopse made this fluid manuscript tradition the basis of all modern study.",
    "technique": "The texts describe adjurations and the repetitive recitation of hymns, divine names, and 'seals' by which the 'descender to the chariot' was said to pass the angelic guardians of each palace — a visionary-ascent liturgy of late antiquity, described here as historical practice.",
    "label": "documented",
    "sources": [
      "Peter Schäfer, Synopse zur Hekhalot-Literatur (1981)",
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941)",
      "Ra'anan Boustan, 'Hekhalot/Merkabah literature', Encyclopedia of Ancient History (2012)"
    ],
    "contested": {
      "flag": "Dating and provenance of the corpus",
      "positions": [
        {
          "source": "Gershom Scholem, Major Trends in Jewish Mysticism (1941)",
          "value": "A continuous mystical tradition originating in Tannaitic and Amoraic rabbinic circles (2nd–5th c. CE Palestine)"
        },
        {
          "source": "Peter Schäfer, Synopse zur Hekhalot-Literatur (1981) and later studies",
          "value": "Fluid, composite 'macroforms' with no fixed original, redacted between late antiquity and the early Middle Ages; earliest full witnesses are medieval manuscripts"
        }
      ]
    },
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "zhengao",
    "lane": "daoist",
    "title": "Zhen'gao (Declarations of the Perfected)",
    "titleOriginal": "真誥",
    "dateText": "compiled c. 499 CE",
    "sortYear": 499,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Mount Mao (Maoshan), Jiangsu, China",
    "body": "Tao Hongjing (456–536), the polymath recluse of Mount Mao, spent years recovering the scattered autograph manuscripts of Yang Xi and the Xu family, authenticating them by handwriting and provenance, and around 499 CE arranged them as the Zhen'gao — 'Declarations of the Perfected' — with his own meticulous annotations. The work preserves the Shangqing revelations' poetry, visualization instructions, and correspondence, and stands as a remarkable early instance of philological criticism applied to revealed literature.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Michel Strickmann, 'The Mao Shan Revelations: Taoism and the Aristocracy', T'oung Pao 63, 1977",
      "Thomas E. Smith, Declarations of the Perfected, Part One, Three Pines Press, 2013"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "mystical-theology",
    "lane": "christian",
    "title": "Mystical Theology (Pseudo-Dionysius)",
    "titleOriginal": "Peri mystikēs theologias",
    "dateText": "c. 500 CE",
    "sortYear": 500,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Syria (probable)",
    "body": "A Greek author writing c. 500, probably in Syria, issued his corpus under the name of Dionysius the Areopagite, Paul's Athenian convert (Acts 17:34) — a pseudonym that secured near-apostolic authority for a millennium. The false attribution is itself the documented fact, exposed on internal evidence (dependence on the Neoplatonist Proclus) by Renaissance and modern criticism. The brief Mystical Theology reads Moses' entry into the darkness of Sinai as the soul's ascent beyond affirmation and negation into the 'brilliant darkness' of God.",
    "technique": "The apophatic method the treatise describes proceeds by systematic negation: the contemplative successively denies of God all sensible attributes, then all intelligible ones, until language and concept are left behind and union occurs in unknowing. Described as the text presents it, not as instruction.",
    "label": "documented",
    "sources": [
      "Colm Luibheid (trans.), Pseudo-Dionysius: The Complete Works (Paulist CWS, 1987)",
      "Paul Rorem, Pseudo-Dionysius: A Commentary on the Texts (OUP, 1993)",
      "Kevin Corrigan & L. Michael Harrington, 'Pseudo-Dionysius the Areopagite', Stanford Encyclopedia of Philosophy (2023)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "nisvasatattvasamhita",
    "lane": "tantra-rasa",
    "title": "Nisvasatattvasamhita",
    "titleOriginal": "Niśvāsatattvasaṃhitā",
    "dateText": "c. 450–550 CE (oldest layer)",
    "sortYear": 500,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "India; sole complete manuscript preserved in Nepal (9th c.)",
    "body": "Recognized since the Goodall–Sanderson–Isaacson critical edition (2015) as probably the earliest surviving complete scripture of tantric Shaivism (the Mantramarga). Its oldest layer, the Mulasutra, is dated on internal and comparative evidence to perhaps 450–550 CE, with later sutras accreting into the seventh century. A single well-preserved ninth-century Nepalese palm-leaf manuscript transmits it. The text moves ritual initiation, mantra, and yoga to the center of Shaiva religion, before the mature tantric systems.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Dominic Goodall, with Alexis Sanderson & Harunaga Isaacson (eds.), The Niśvāsatattvasaṃhitā: The Earliest Surviving Śaiva Tantra, vol. 1 (IFP/EFEO/Hamburg, 2015)",
      "University of Hamburg Centre for Tantric Studies, Niśvāsatattvasaṃhitā edition project"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-bodhidharma",
    "lane": "buddhist",
    "title": "Bodhidharma",
    "titleOriginal": null,
    "dateText": "fl. c. late 5th–early 6th c. CE",
    "sortYear": 500,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "person",
    "place": "Luoyang / Mount Song region, China (origins contested)",
    "body": "A western meditation master in northern China, attested in Yang Xuanzhi's Record of the Monasteries of Luoyang (547) and in Tanlin's preface to the Two Entrances and Four Practices; Chan tradition made him its First Patriarch. The famous embellishments — nine years gazing at a wall, founding Shaolin boxing, crossing the Yangzi on a reed — are later legendary accretions with no early attestation. The historical core is documented; the legends, and any detailed biography, are disputed (McRae judges a reliable life unrecoverable).",
    "technique": "Tanlin's preface attributes to him 'wall-examining' (biguan), a contemplative stabilizing of the mind whose exact meaning was already obscure to early commentators; the later image of nine years literally facing a wall at Shaolin is legend.",
    "label": "disputed",
    "sources": [
      "John R. McRae, Seeing Through Zen, 2003",
      "Jeffrey L. Broughton, The Bodhidharma Anthology, 1999",
      "Philip B. Yampolsky, The Platform Sutra of the Sixth Patriarch, 1967"
    ],
    "contested": {
      "flag": "Bodhidharma's origin: the earliest sources disagree",
      "positions": [
        {
          "source": "Yang Xuanzhi, Luoyang qielan ji (547)",
          "value": "a monk from Central Asia / 'Persia' in the Western Regions"
        },
        {
          "source": "Tanlin (c. mid-6th c.) and Daoxuan, Xu gaoseng zhuan (645)",
          "value": "a South Indian, third son of a Brahmin king"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "mohe-zhiguan",
    "lane": "buddhist",
    "title": "Mohe Zhiguan (The Great Calming and Contemplation)",
    "titleOriginal": "摩訶止観 (Mohe zhiguan)",
    "dateText": "lectures of 594, compiled by Guanding",
    "sortYear": 594,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Yuquan Temple, Dangyang, China",
    "body": "The Tiantai school's summa of meditation, based on lectures Zhiyi (538–597) delivered through the ninety-day summer retreat of 594 at Yuquan Temple, recorded and edited by his disciple Guanding (561–632) into ten fascicles. It systematizes zhi and guan — the Chinese renderings of śamatha and vipaśyanā — into a single graded and 'perfect-sudden' curriculum, and shaped meditation doctrine in China and Japan for a millennium.",
    "technique": "The treatise organizes practice as calming (zhi) and contemplation (guan) pursued through 'four samādhis' — constantly sitting, constantly walking, half-walking-half-sitting, and neither-walking-nor-sitting — and through contemplating ten successive objects in ten modes, culminating in seeing the threefold truth in a single thought-moment.",
    "label": "documented",
    "sources": [
      "Paul L. Swanson (tr.), Clear Serenity, Quiet Insight: T'ien-t'ai Chih-i's Mo-ho chih-kuan, 3 vols., University of Hawai'i Press, 2017",
      "Neal Donner & Daniel B. Stevenson, The Great Calming and Contemplation, 1993"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "ladder-of-divine-ascent",
    "lane": "christian",
    "title": "The Ladder of Divine Ascent (John Climacus)",
    "titleOriginal": "Klimax tou Paradeisou",
    "dateText": "early 7th c. CE (c. 600–649)",
    "sortYear": 625,
    "sortYearEnd": 649,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Mount Sinai, Egypt",
    "body": "John Climacus, abbot of the Sinai monastery (traditional dates c. 579–649), arranged the monastic life as a ladder of thirty steps, from renunciation through the passions to faith, hope and love. Written in the early seventh century at another abbot's request, the Ladder became the most copied ascetic handbook of the Greek church, is still read aloud in Orthodox monasteries every Lent, and carried the Evagrian analysis of thoughts — and an early witness to the Jesus Prayer — into Byzantine practice.",
    "technique": "Step 27 counsels stripping prayer to few words; the injunction 'let the remembrance of Jesus be present with your every breath' documents monologistos (one-phrase) prayer joined to breathing — a source later hesychasts repeatedly invoked. Historical description.",
    "label": "documented",
    "sources": [
      "Colm Luibheid & Norman Russell (trans.), John Climacus: The Ladder of Divine Ascent, intro. Kallistos Ware (Paulist CWS, 1982)",
      "John Chryssavgis, John Climacus: From the Egyptian Desert to the Sinaite Mountain (Ashgate, 2004)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-shankara",
    "lane": "yoga-vedanta",
    "title": "Shankara (Adi Shankaracharya)",
    "titleOriginal": "Ādi Śaṅkara",
    "dateText": "c. 700–750 CE (traditional: 788–820)",
    "sortYear": 700,
    "sortYearEnd": 750,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "Kaladi, Kerala (traditional birthplace); active across India",
    "body": "The most influential systematizer of Advaita Vedanta, the doctrine that brahman alone is real and the world's multiplicity a misapprehension born of ignorance. His commentaries on the Brahmasutra, the principal Upanishads and the Bhagavad Gita became the templates of Vedantic exegesis, and later tradition credits him — on thin historical evidence — with founding monastic networks across India. Hagiographies accreted centuries after his death; his dates remain a classic problem of Indian chronology.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Hajime Nakamura, A History of Early Vedānta Philosophy, Part 1 (Motilal Banarsidass, 1983)",
      "Encyclopaedia Britannica, 'Shankara'"
    ],
    "contested": {
      "flag": "Shankara's dates",
      "positions": [
        {
          "source": "Hajime Nakamura, A History of Early Vedānta Philosophy (1983); much recent scholarship",
          "value": "c. 700–750 CE"
        },
        {
          "source": "Earlier 20th-century scholarship and widespread convention",
          "value": "788–820 CE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "bayt-al-hikma",
    "lane": "confluence",
    "title": "The Baghdad translation movement (Bayt al-Hikma)",
    "titleOriginal": "بيت الحكمة",
    "dateText": "c. 750–1000 CE",
    "sortYear": 750,
    "sortYearEnd": 1000,
    "dateCertainty": "range",
    "kind": "institution",
    "place": "Baghdad, Abbasid caliphate",
    "body": "Between roughly 750 and 1000 nearly the whole extant corpus of secular Greek science and philosophy was translated into Arabic under Abbasid patronage — Galen and Ptolemy through Hunayn ibn Ishaq (d. 873) and his circle, with Aristotle, Euclid, and astrological and alchemical writings besides. The 'House of Wisdom' attached to this movement in popular accounts was, on Gutas's reading, a palace library of Sasanian type; the translating itself was financed by patrons across Abbasid society.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Dimitri Gutas, Greek Thought, Arabic Culture: The Graeco-Arabic Translation Movement in Baghdad and Early Abbasid Society (Routledge, 1998)",
      "Marie-Geneviève Balty-Guesdon, 'Le Bayt al-hikma de Baghdad', Arabica 39 (1992)"
    ],
    "contested": {
      "flag": "What the Bayt al-Hikma actually was",
      "positions": [
        {
          "source": "Popular and older encyclopedic accounts (e.g. the Britannica tradition)",
          "value": "a formal academy and translation institute where Greek science was rendered into Arabic"
        },
        {
          "source": "Dimitri Gutas, Greek Thought, Arabic Culture (Routledge, 1998)",
          "value": "an Abbasid palace library on a Sasanian model, chiefly housing Persian-to-Arabic material; not a single report connects Greek–Arabic translation to it — the movement was society-wide patronage, not an academy"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "guhyasamaja-tantra",
    "lane": "buddhist",
    "title": "Guhyasamāja Tantra",
    "titleOriginal": "Guhyasamāja-tantra",
    "dateText": "c. 8th c. CE (dating contested, 4th–8th c. proposed)",
    "sortYear": 750,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "India",
    "body": "The root scripture of the 'father tantra' class of the Buddhist highest yoga tantras, organized around the maṇḍala of Akṣobhyavajra. Its transgressive rhetoric and two-stage yoga made it a template for later Vajrayāna systems; Amoghavajra, back in China from India and Ceylon in 746, listed a Guhyasamāja yoga among the eighteen assemblies of the Vajraśekhara cycle in his mid-eighth-century index, and Tsongkhapa later made it the centrepiece of Gelug tantric study. Its composition date remains genuinely unresolved among specialists.",
    "technique": "The tantra teaches deity yoga in two stages: a generation stage of visualizing oneself within the thirty-two-deity Akṣobhyavajra maṇḍala, and a completion stage of yogas said to manipulate winds and drops within a visualized subtle body of channels — practices the tradition restricted to initiates under a guru.",
    "label": "documented",
    "sources": [
      "Yukei Matsunaga, The Guhyasamāja Tantra: A New Critical Edition, 1978",
      "Alex Wayman, Yoga of the Guhyasamājatantra, 1977",
      "Francesca Fremantle, A Critical Study of the Guhyasamāja Tantra, 1971"
    ],
    "contested": {
      "flag": "Date of composition",
      "positions": [
        {
          "source": "Alex Wayman, Yoga of the Guhyasamājatantra, 1977",
          "value": "as early as the 4th century CE"
        },
        {
          "source": "Yukei Matsunaga, The Guhyasamāja Tantra critical edition, 1978",
          "value": "8th century CE; a prototype existed by the time of Amoghavajra (705–774)"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "jabir-corpus",
    "lane": "alchemy-west",
    "title": "The Jabirian corpus",
    "titleOriginal": null,
    "dateText": "c. 750–950 CE (accreted corpus; dating contested)",
    "sortYear": 750,
    "sortYearEnd": 950,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Abbasid Iraq and Persia",
    "body": "An enormous Arabic corpus — nearly three thousand titles travel under the name of Jābir ibn Ḥayyān — systematizing alchemy around the sulfur–mercury theory of metals, elixirs drawn from mineral, plant, and animal matter, and a numerological 'science of the balance'. Paul Kraus argued in 1942–43 that the corpus is the product of a Shi'ite school writing c. 850–950 rather than of one eighth-century master; Fuat Sezgin defended the traditional single author. Latinized as 'Geber', the name became Europe's supreme alchemical authority.",
    "technique": "Codifies distillation, calcination, sublimation, and the preparation of elixirs from substances including mercury, arsenic compounds, and sal ammoniac — materials now known to be seriously toxic. The operations are documented history, not a method to follow.",
    "label": "disputed",
    "sources": [
      "Paul Kraus, Jābir ibn Ḥayyān: Contribution à l'histoire des idées scientifiques dans l'Islam, 1942–1943",
      "Fuat Sezgin, Geschichte des arabischen Schrifttums, Band IV, 1971",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": {
      "flag": "Whether the corpus is the work of one 8th-century author or a later school",
      "positions": [
        {
          "source": "Paul Kraus, Jābir ibn Ḥayyān, 1942–1943",
          "value": "a collective corpus of a Shi'ite/Ismaili school, late 9th–early 10th c.; 'Jābir' largely legendary"
        },
        {
          "source": "Fuat Sezgin, Geschichte des arabischen Schrifttums IV, 1971",
          "value": "the writings are attributable to one historical 8th-century Jābir ibn Ḥayyān"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "event-sindhind-transmission",
    "lane": "confluence",
    "title": "India to Baghdad: the Sindhind transmission",
    "titleOriginal": "Zīj al-Sindhind",
    "dateText": "c. 771–773 CE",
    "sortYear": 771,
    "sortYearEnd": 773,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Baghdad, court of al-Mansur",
    "body": "An embassy from Sind reached the caliph al-Mansur's court — the date is given as 771 or 773 — bringing a Sanskrit astronomical text of the school of Brahmagupta's Brahmasphutasiddhanta. Al-Fazari, with Ya'qub ibn Tariq, reworked it into Arabic as the Zij al-Sindhind, the channel through which Indian planetary methods and, by tradition, Indian numerals entered Islamic science. Pingree reconstructed the episode from the surviving fragments of al-Fazari's works.",
    "technique": null,
    "label": "documented",
    "sources": [
      "David Pingree, 'The Fragments of the Works of al-Fazārī', Journal of Near Eastern Studies 29 (1970)",
      "E. S. Kennedy, 'A Survey of Islamic Astronomical Tables', Transactions of the American Philosophical Society 46 (1956)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "platform-sutra",
    "lane": "buddhist",
    "title": "Platform Sutra of the Sixth Patriarch",
    "titleOriginal": "六祖壇經 (Liuzu tanjing)",
    "dateText": "c. 780 (earliest recension; Dunhuang copies c. 830–860)",
    "sortYear": 780,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Southern China (manuscripts from Dunhuang)",
    "body": "The foundational Chan scripture presenting the autobiography and sermons of Huineng (638–713), the illiterate 'Sixth Patriarch', championing sudden awakening and 'no-thought' over gradual cultivation. The earliest surviving version, found at Dunhuang, derives from an edition of about 780, decades after Huineng's death. Its verse contest between Huineng and Shenxiu became East Asia's most famous parable of meditation, though scholars treat the narrative as sectarian literature rather than biography.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Philip B. Yampolsky, The Platform Sutra of the Sixth Patriarch: The Text of the Tun-huang Manuscript, 1967",
      "John R. McRae (tr.), The Platform Sutra of the Sixth Patriarch, 2000"
    ],
    "contested": {
      "flag": "Authorship and origin of the text",
      "positions": [
        {
          "source": "Traditional attribution (the text itself)",
          "value": "sermons of Huineng recorded by his disciple Fahai"
        },
        {
          "source": "Philip Yampolsky, The Platform Sutra of the Sixth Patriarch, 1967",
          "value": "a composite work of c. 780 drawing on the Shenhui faction's polemics, not a verbatim record of Huineng"
        },
        {
          "source": "Yanagida Seizan, Shoki zenshū shisho no kenkyū, 1967 (followed by John McRae)",
          "value": "composed c. 780 within the Oxhead (Niutou) school of Chan"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "emerald-tablet",
    "lane": "alchemy-west",
    "title": "The Emerald Tablet (in the Sirr al-khalīqa)",
    "titleOriginal": "Tabula Smaragdina / Kitāb sirr al-khalīqa",
    "dateText": "first attested c. 750–850 CE (Arabic)",
    "sortYear": 800,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Abbasid Near East",
    "body": "The Emerald Tablet — a short, cryptic text on the correspondence of above and below and the 'one thing' from which all proceeds — is first attested in Arabic, appended to the Kitāb sirr al-khalīqa ('Book of the Secret of Creation') of pseudo-Apollonius of Tyana (Balīnās). Hugo of Santalla first rendered it into Latin (c. 1145–1151) within his translation of the Sirr, though his version circulated little; the widely copied 'vulgate' Latin version, by an unidentified twelfth-century translator sometimes conjectured to be Plato of Tivoli, made the Tabula Smaragdina the most quoted formula of Latin alchemy, glossed by generations of commentators.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Ursula Weisser, Das 'Buch über das Geheimnis der Schöpfung' von Pseudo-Apollonios von Tyana, 1980",
      "Paul Kraus, Jābir ibn Ḥayyān: Contribution à l'histoire des idées scientifiques dans l'Islam, 1942–1943",
      "Julius Ruska, Tabula Smaragdina, 1926"
    ],
    "contested": {
      "flag": "Date of the Sirr al-khalīqa, the tablet's earliest witness",
      "positions": [
        {
          "source": "Paul Kraus, Jābir ibn Ḥayyān II, 1942",
          "value": "compiled c. 813–833, under al-Ma'mūn"
        },
        {
          "source": "Ursula Weisser, Das 'Buch über das Geheimnis der Schöpfung', 1980",
          "value": "compiled c. 750–800, drawing on older Greek/Syriac sources"
        }
      ]
    },
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "event-waidan-neidan-shift",
    "lane": "daoist",
    "title": "The Waidan-to-Neidan Shift",
    "titleOriginal": "外丹 → 內丹",
    "dateText": "c. 8th–11th c. CE",
    "sortYear": 800,
    "sortYearEnd": 1100,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Tang–Song China",
    "body": "Across the late Tang and early Song, Chinese alchemy turned inward. The term and discipline of neidan, 'inner alchemy,' emerge in the eighth century — the Zhong-Lü textual lineage is its first clear school — while laboratory elixirs, discredited by documented poisonings, declined. The furnace, tripod, lead, and mercury of the old art were retained as symbols mapped onto the practitioner's own body and breath: a symbolic-physiological system whose vocabulary is alchemical but whose 'ingredients' are no longer minerals.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Fabrizio Pregadio, The Way of the Golden Elixir: An Introduction to Taoist Alchemy, Golden Elixir Press, 2012",
      "Farzeen Baldrian-Hussein, 'Neidan', in Fabrizio Pregadio (ed.), The Encyclopedia of Taoism, Routledge, 2008",
      "Joseph Needham and Lu Gwei-djen, Science and Civilisation in China, vol. 5 pt. 5 (Physiological Alchemy), Cambridge University Press, 1983"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "vijnanabhairava-tantra",
    "lane": "tantra-rasa",
    "title": "Vijnanabhairava Tantra",
    "titleOriginal": "Vijñānabhairava",
    "dateText": "c. 7th–9th c. CE",
    "sortYear": 800,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Kashmir",
    "body": "A short Shaiva scripture of 163 verses, cast as a dialogue in which Bhairava answers the goddess Bhairavi by cataloguing roughly 112 compressed meditation methods (dharanas). Abhinavagupta honored it as the 'Shiva-vijnana Upanishad'; Kshemaraja's commentary survives only in part, and Shivopadhyaya supplied the remainder in the eighteenth century. Jaideva Singh's 1979 English edition carried it to a global readership. Its exact date is unsettled: an eighth-century Kashmiri reference implies it was already well known by then.",
    "technique": "The text instructs its hearer in 112 brief centering methods: attention to the pause between in-breath and out-breath, one-pointed gazing into empty space or a dark cloudless sky, dwelling in the moment a sound dies away, or in intense sensation and strong emotion — each treated as an opening onto Bhairava as undivided consciousness. Historical description; the methods are stated in a few words each, presupposing an initiated teacher.",
    "label": "documented",
    "sources": [
      "Jaideva Singh, Vijñānabhairava or Divine Consciousness (Motilal Banarsidass, 1979)",
      "Christopher Wallis, Tantra Illuminated (2012)"
    ],
    "contested": {
      "flag": "Century of composition",
      "positions": [
        {
          "source": "Jaideva Singh, Vijñānabhairava or Divine Consciousness (1979), introduction",
          "value": "well known by the 8th c. CE (cited by Vamananatha, likely the poetician Vamana under King Jayapida, 779–813); possibly compiled a century earlier"
        },
        {
          "source": "recent scholarship (e.g. surveys of Trika literature)",
          "value": "an eighth- or ninth-century Shaiva scripture"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "event-tang-elixir-deaths",
    "lane": "daoist",
    "title": "The Tang Elixir Poisonings",
    "titleOriginal": null,
    "dateText": "9th c. CE (imperial deaths 820–859)",
    "sortYear": 820,
    "sortYearEnd": 859,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Chang'an, Tang China",
    "body": "The great cautionary fact of the elixir tradition: in the ninth century a series of Tang emperors died after consuming immortality elixirs — Xianzong (d. 820) and Muzong (d. 824) probably, Wuzong (d. 846) and Xuanzong (d. 859) almost certainly, per the dynastic histories. Ho Ping-Yü and Joseph Needham's 1959 study matched the recorded symptoms — tremors, rages, wasting — to mercury, lead, and arsenic poisoning. The scandal of sovereigns killed by the medicine of immortality helped discredit ingestible elixirs altogether.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Ho Ping-Yü (Ho Peng Yoke) and Joseph Needham, 'Elixir Poisoning in Mediaeval China', Janus 48, 1959",
      "Joseph Needham et al., Science and Civilisation in China, vol. 5 pt. 3, Cambridge University Press, 1976"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-harran-sabians",
    "lane": "confluence",
    "title": "Harran and the Sabians: Hermes becomes a prophet",
    "titleOriginal": null,
    "dateText": "9th–10th c. CE",
    "sortYear": 830,
    "sortYearEnd": 950,
    "dateCertainty": "century",
    "kind": "event",
    "place": "Harran, Upper Mesopotamia; Baghdad",
    "body": "Harran kept a pagan astral cult alive deep into the Islamic era; the mathematician-translator Thabit ibn Qurra (d. 901) came from this community to Baghdad. Arabic sources report that Harranians, pressed to name their religion, identified as Qur'anic 'Sabians' with Hermes as their prophet — the accommodation that gave Hermetic books scriptural standing in Islam. Van Bladel's study deflates the older picture of Harran as a Hermetic academy: Thabit's own surviving works show almost no Hermetism.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Kevin van Bladel, The Arabic Hermes: From Pagan Sage to Prophet of Science (Oxford, 2009), ch. 3",
      "Bryn Mawr Classical Review 2010.02.63 (review of van Bladel)"
    ],
    "contested": {
      "flag": "Harran's role as a conduit of Hermetic literature into Islam",
      "positions": [
        {
          "source": "D. Chwolsohn, Die Ssabier und der Ssabismus (1856), and the older historiography following it",
          "value": "Harran preserved a continuous pagan Hermetic tradition and transmitted the Hermetica to the Islamic world"
        },
        {
          "source": "Kevin van Bladel, The Arabic Hermes: From Pagan Sage to Prophet of Science (Oxford, 2009)",
          "value": "'Sabian' became a generic Arabic label for pagans; there is little evidence the Harranians transmitted the extant Hermetica, and Thabit ibn Qurra's writings betray almost no Hermeticism"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-junayd",
    "lane": "islamic",
    "title": "Junayd of Baghdad",
    "titleOriginal": "Abū al-Qāsim al-Junayd al-Baghdādī",
    "dateText": "c. 830 – 910 CE (d. 297/298 AH; some sources 908)",
    "sortYear": 870,
    "sortYearEnd": 910,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Baghdad",
    "body": "Abu al-Qasim al-Junayd (c. 830–910 CE), head of Baghdad's early Sufi circle, articulated the 'sober' (sahw) school: mystical annihilation (fana) disciplined by scriptural law and exact language. His teaching sessions grounded remembrance of God (dhikr) — a practice Sufis anchor in Quranic injunctions such as 'remember God with much remembrance' (Q 33:41) — strictly within Sharia observance. Nearly every later Sufi order traces its chain of transmission through him; his surviving letters (Rasa'il) are dense, guarded treatises on divine unity (tawhid).",
    "technique": null,
    "label": "documented",
    "sources": [
      "A.H. Abdel-Kader, The Life, Personality and Writings of al-Junayd (Luzac, 1962)",
      "Encyclopaedia of Islam, 2nd ed., art. 'al-Djunayd' (Brill)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-nagarjuna-siddha",
    "lane": "tantra-rasa",
    "title": "Nagarjuna the alchemist",
    "titleOriginal": "Nāgārjuna Siddha",
    "dateText": "attributions span c. 2nd–12th c. CE",
    "sortYear": 900,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "India (traditions locate him variously)",
    "body": "Indian tradition credits a Nagarjuna with alchemical works, notably the Rasendramangala. Medieval and modern sources conflate this siddha with the second-century Madhyamaka philosopher — a conflation scholarship rejects: the alchemist is a distinct, much later figure. Wujastyk (1984) further showed that the 'Rasaratnakara by Nagarjuna' printed by P. C. Ray was a literary ghost created by mixed manuscript leaves; that title belongs to Nityanatha Siddha. The mercury elixirs in these attributed works involve documented toxins, noted here for study only.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Dominik Wujastyk, 'An Alchemical Ghost: The Rasaratnâkara by Nâgârjuna', Ambix 31.2 (1984), 70–83",
      "David Gordon White, The Alchemical Body (1996)"
    ],
    "contested": {
      "flag": "Identity and date of the alchemist Nagarjuna",
      "positions": [
        {
          "source": "Indian tradition (and P. C. Ray's History of Hindu Chemistry)",
          "value": "one Nagarjuna, identical with the 2nd-century Madhyamaka philosopher"
        },
        {
          "source": "Dominik Wujastyk, 'An Alchemical Ghost', Ambix 31 (1984); David Gordon White (1996)",
          "value": "a distinct later siddha (roughly 10th c. or later); Ray's 'Rasaratnakara by Nagarjuna' is a manuscript-conflation ghost — the real Rasaratnakara is by Nityanatha Siddha"
        }
      ]
    },
    "siteLink": {
      "href": "rasa.html",
      "label": "Rasashastra page"
    }
  },
  {
    "slug": "turba-philosophorum",
    "lane": "alchemy-west",
    "title": "Turba Philosophorum",
    "titleOriginal": "Turba Philosophorum (Latin; Arabic original lost)",
    "dateText": "c. 900 CE (Arabic original; Latin translation 12th c.)",
    "sortYear": 900,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Arabic-speaking world, possibly Egypt",
    "body": "The 'Assembly of the Philosophers' stages a council in which Pythagoras convenes ancient sages — pre-Socratics filtered and garbled through Arabic — to expound the art in successive speeches. Composed in Arabic around 900 CE, on Plessner's argument that Ibn Umayl is the earliest author to quote it, the original is lost and the work survives complete only in Latin, where it became a foundational authority. Julius Ruska's 1931 edition and study fixed its place at the head of Arabic–Latin alchemical literature.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Julius Ruska, Turba Philosophorum: Ein Beitrag zur Geschichte der Alchemie, 1931",
      "Martin Plessner, 'The Place of the Turba Philosophorum in the Development of Alchemy', Isis 45, 1954"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "kitab-al-asrar",
    "lane": "alchemy-west",
    "title": "Kitāb al-Asrār (al-Rāzī, Book of Secrets)",
    "titleOriginal": "Kitāb al-Asrār",
    "dateText": "c. 920 CE",
    "sortYear": 920,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Rayy, Persia",
    "body": "Abū Bakr al-Rāzī (Rhazes, 865–925), physician of Rayy, wrote the Book of Secrets near the end of his career as a working manual: substances classified into mineral, vegetable, and animal kinds, apparatus catalogued — furnaces, alembics, crucibles, pestles — and procedures set out in reproducible steps, stripped of allegory. Julius Ruska's 1937 study established its structure; historians of chemistry read it as the closest medieval ancestor of the laboratory handbook.",
    "technique": "Systematic recipes for distillation, calcination, and the softening and 'corporification' of substances, employing mercury, arsenic sulfides, and lead compounds — all highly toxic reagents, described strictly as documented historical practice.",
    "label": "documented",
    "sources": [
      "Julius Ruska, Al-Rāzī's Buch Geheimnis der Geheimnisse, 1937",
      "Gail Marlow Taylor, 'The Kitab al-Asrar: An Alchemy Manual in Tenth-Century Persia', Arab Studies Quarterly 32.1 (Winter 2010), 6–27"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "ibn-umayl-silvery-water",
    "lane": "alchemy-west",
    "title": "The Silvery Water (Ibn Umayl)",
    "titleOriginal": "Kitāb al-māʾ al-waraqī wa-l-arḍ al-najmiyya",
    "dateText": "10th c. (author c. 900–960)",
    "sortYear": 930,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Egypt",
    "body": "Muḥammad ibn Umayl (c. 900–960), an Egyptian alchemist of allegorical temperament, wrote The Book of the Silvery Water and the Starry Earth as a meditation on an ancient temple statue holding a tablet that encodes the whole art. Translated into Latin as the Tabula chemica of 'Senior Zadith', it fed European symbolic alchemy — Chaucer's Canon's Yeoman cites it. C. G. Jung and his school later took Ibn Umayl as a key witness for a symbolic reading of alchemy.",
    "technique": null,
    "label": "documented",
    "sources": [
      "H. E. Stapleton & M. H. Husain, 'Three Arabic Treatises on Alchemy by Muhammad bin Umail', Memoirs of the Asiatic Society of Bengal, 1933",
      "Theodor Abt & Wilferd Madelung (eds.), Corpus Alchemicum Arabicum I: Ibn Umayl, 2003"
    ],
    "contested": null,
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung and alchemy"
    }
  },
  {
    "slug": "person-matsyendranatha",
    "lane": "tantra-rasa",
    "title": "Matsyendranatha",
    "titleOriginal": "Matsyendranātha / Macchanda",
    "dateText": "c. 9th–10th c. CE (legendary)",
    "sortYear": 950,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "Bengal/Kamarupa (by tradition); revered in Kashmir and Nepal",
    "body": "The adept revered as founder of the Yogini Kaula stream of tantra and, in Nath legend, guru of Gorakhnath. Abhinavagupta salutes him as Macchanda-vibhu in the Tantraloka's opening. Bagchi, following Tibetan siddha lists identifying him with Lui-pa, placed him in the tenth century; the hagiography — rescued scriptures from a fish's belly, worship in Nepal as a form of Avalokiteshvara — is legendary accretion around a plausibly real teacher.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "P. C. Bagchi (ed.), Kaulajnana-nirnaya and Some Minor Texts of the School of Matsyendranatha (Calcutta Sanskrit Series, 1934)",
      "David Gordon White, The Alchemical Body (University of Chicago Press, 1996)"
    ],
    "contested": {
      "flag": "Historical date and identity of Matsyendranatha",
      "positions": [
        {
          "source": "P. C. Bagchi, Kaulajñāna-nirṇaya (1934)",
          "value": "10th century, identified via Tibetan tradition with the siddha Lui-pa"
        },
        {
          "source": "David Gordon White, The Alchemical Body (1996)",
          "value": "a composite legendary figure; traditions attached to the name span several centuries"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "rasahrdaya-tantra",
    "lane": "tantra-rasa",
    "title": "Rasahrdaya Tantra",
    "titleOriginal": "Rasahṛdayatantra",
    "dateText": "c. 10th c. CE",
    "sortYear": 950,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "India",
    "body": "The 'Heart of Mercury', by Govinda Bhagavat (Govindabhagavatpada): one of the earliest classics of rasashastra, Indian mercurial alchemy. Meulenbeld places it in the tenth century; a traditional identification of its author with Adi Shankara's eighth-century guru of the same name is unsupported. The work teaches that perfected mercury confers a stable, liberated body. Mercury and its compounds are documented neurotoxins; the operations are recorded in scholarship for historical study, never for practice.",
    "technique": "The text describes the graded purification and potentiation of mercury (rasa) through sequential operations (samskaras) — trituration, amalgamation with sulfur and mica, distillation — aiming at an elixir said to perfect the body toward jivanmukti. Mercury compounds are documented toxins; these procedures are described here solely as history of alchemy.",
    "label": "documented",
    "sources": [
      "G. J. Meulenbeld, A History of Indian Medical Literature, vol. IIA (2000)",
      "David Gordon White, The Alchemical Body (1996)"
    ],
    "contested": {
      "flag": "Identity and century of the author Govinda Bhagavat",
      "positions": [
        {
          "source": "G. J. Meulenbeld, A History of Indian Medical Literature (1999–2002)",
          "value": "a 10th-century alchemical author"
        },
        {
          "source": "traditional attribution (some Indian sources)",
          "value": "identical with Govinda Bhagavatpada, the 8th–9th-century guru of Adi Shankara"
        }
      ]
    },
    "siteLink": {
      "href": "rasa.html",
      "label": "Rasashastra page"
    }
  },
  {
    "slug": "kaulajnananirnaya",
    "lane": "tantra-rasa",
    "title": "Kaulajnananirnaya",
    "titleOriginal": "Kaulajñānanirṇaya",
    "dateText": "c. 9th–11th c. CE (manuscript evidence)",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "eastern India; manuscripts preserved in Nepal",
    "body": "The 'Determination of Kaula Knowledge', principal scripture ascribed to Matsyendranatha and foundational for the goddess-centered Yogini Kaula. P. C. Bagchi edited it from Nepalese manuscripts in 1934; Haraprasad Sastri had assigned the oldest manuscript to the ninth century, while Bagchi preferred the eleventh–twelfth. The attribution to Matsyendra is traditional rather than demonstrable. Its esoteric ritual program treats the initiate's own body as the seat of the yoginis' clan (kula).",
    "technique": "The text describes a body-centered Kaula ritual yoga: worship of clans of yoginis, visualization of energy centers within the body, and secret, deliberately transgressive rites through which the practitioner's body is held to become identical with the goddess's kula. Recorded here as historical description of an initiatory system.",
    "label": "disputed",
    "sources": [
      "P. C. Bagchi (ed.), Kaulajnana-nirnaya (Calcutta Sanskrit Series, 1934)",
      "Satkari Mukhopadhyaya & Stella Dupuis, The Kaulajnananirnaya (Aditya Prakashan, 2012)"
    ],
    "contested": {
      "flag": "Date of the text and its oldest manuscript",
      "positions": [
        {
          "source": "Haraprasad Sastri (catalogue of Nepalese MSS)",
          "value": "manuscript assigned to the 9th century CE"
        },
        {
          "source": "P. C. Bagchi, Kaulajñāna-nirṇaya (1934), p. 5",
          "value": "manuscripts dateable to the 11th–12th centuries"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "nityashodashikarnava",
    "lane": "tantra-rasa",
    "title": "Nityashodashikarnava (Vamakeshvara Tantra)",
    "titleOriginal": "Nityāṣoḍaśikārṇava / Vāmakeśvarīmata",
    "dateText": "before 9th c.? – c. 11th c. CE",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Kashmir / South Asia",
    "body": "The earliest scripture of Kaula Shrividya, the refined goddess tradition centered on Lalita Tripurasundari. It circulates as two parts — the Nityashodashikarnava proper and the Yoginihridaya ('Heart of the Yogini') — together called the Vamakeshvara Tantra. Jayaratha (12th–13th c.) commented on it and cites a ninth-century commentator, Ishvarashiva. Brooks and Beck argue for composition before the ninth century; Padoux places the Yoginihridaya around the eleventh. Shrividya later flourished especially in South India.",
    "technique": "The corpus instructs the initiate in worship of Tripurasundari through the Shrichakra, a nine-circuit diagram homologized with the cosmos and the worshipper's body, together with repetition of the fifteen-syllable shrividya mantra and visualization of the sixteen Nitya goddesses — a historical description of diagram-and-mantra contemplation.",
    "label": "documented",
    "sources": [
      "Douglas Renfrew Brooks, The Secret of the Three Cities (1990)",
      "André Padoux with Roger-Orphé Jeanty, The Heart of the Yogini: The Yoginīhṛdaya (OUP, 2013)"
    ],
    "contested": {
      "flag": "Date of the Vamakeshvara corpus",
      "positions": [
        {
          "source": "Douglas Renfrew Brooks, The Secret of the Three Cities (1990) / Guy L. Beck",
          "value": "composed before the 9th century CE"
        },
        {
          "source": "André Padoux, The Heart of the Yogini (OUP, 2013)",
          "value": "the Yoginihridaya dates to around the 11th century CE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-abhinavagupta",
    "lane": "tantra-rasa",
    "title": "Abhinavagupta",
    "titleOriginal": "Abhinavagupta",
    "dateText": "fl. c. 975–1025 CE",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Kashmir",
    "body": "Kashmirian polymath — tantric theologian, philosopher, and aesthetician — whose floruit Sanderson sets at c. 975–1025. He unified the Trika, Kaula, and Krama streams in the Tantraloka, wrote the Paratrisika-vivarana and the Isvarapratyabhijna commentaries, and shaped Sanskrit aesthetics through the Abhinavabharati on rasa theory. His disciple Kshemaraja popularized the system. No other single figure so thoroughly systematized tantric Shaivism; modern Kashmir Shaivism studies descend largely from his corpus.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Alexis Sanderson, 'The Tantrāloka of Abhinavagupta' (lecture series, 2016)",
      "John R. Dupuche, Abhinavagupta: The Kula Ritual (2003)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-naropa",
    "lane": "buddhist",
    "title": "Nāropa",
    "titleOriginal": null,
    "dateText": "956–1040 or 1016–1100 CE (contested)",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "Eastern India (Nālandā region; hermitage of Pullahari)",
    "body": "Indian mahāsiddha remembered as a great Nālandā scholar who abandoned the monastery to serve the tantric master Tilopa through twelve hardships. Through the translator Marpa, whom Kagyu tradition counts as his direct Tibetan student, the completion-stage practices systematized as the 'six dharmas of Nāropa' became, with Mahāmudrā, the contemplative core of the Kagyu school. His biography survives chiefly in late Tibetan hagiography, and even his dates divide scholars.",
    "technique": "The six dharmas transmitted under his name — inner heat (gtummo), illusory body, dream, luminosity, transference of consciousness, and the intermediate state — are described as completion-stage yogas using breath retention and visualization of channels, winds and drops; Mahāmudrā, in the same lineage, is described as direct resting in the nature of mind.",
    "label": "disputed",
    "sources": [
      "Herbert V. Guenther, The Life and Teaching of Nāropa, 1963",
      "Glenn H. Mullin, Tsongkhapa's Six Yogas of Naropa, 1996"
    ],
    "contested": {
      "flag": "Nāropa's dates",
      "positions": [
        {
          "source": "Herbert V. Guenther, The Life and Teaching of Nāropa, 1963 (following late Tibetan hagiography)",
          "value": "1016–1100 CE"
        },
        {
          "source": "Turrell V. Wylie, 'Dating the Death of Nāropa', in Indological and Buddhist Studies, 1982 (followed by Peter Alan Roberts)",
          "value": "956–1040 CE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "picatrix",
    "lane": "alchemy-west",
    "title": "Picatrix (Ghāyat al-Ḥakīm)",
    "titleOriginal": "غاية الحكيم",
    "dateText": "Arabic, 10th–11th c. (attribution contested); Castilian 1256–58; Latin thereafter",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "al-Andalus",
    "body": "The most comprehensive Arabic manual of astral magic — planetary elections, talisman-making, suffumigations and invocations, compiled (its author says) from over two hundred sources. Long ascribed to the mathematician Maslama al-Majrīṭī, an ascription scholarship rejects; its translation for Alfonso X of Castile (1256–58) and thence into Latin made it learned Europe's underground handbook of the very astral magic the church condemned.",
    "technique": "The book describes the election of astrologically fitting moments and the engraving of images under them — the operative program the site's Picatrix wing documents, computed for study and never for practice.",
    "label": "documented",
    "sources": [
      "David Pingree (ed.), Picatrix: The Latin Version of the Ghāyat al-Ḥakīm (Warburg Institute, 1986)",
      "Hellmut Ritter & Martin Plessner, \"Picatrix\": Das Ziel des Weisen von Pseudo-Maǧrīṭī (Warburg Institute, 1962)",
      "Maribel Fierro, 'Bāṭinism in al-Andalus', Studia Islamica 84 (1996), 87–112"
    ],
    "contested": {
      "flag": "Author and date of the Arabic original",
      "positions": [
        {
          "source": "David Pingree (1986) and the older consensus",
          "value": "pseudo-Maslama al-Majrīṭī, composed mid-11th century"
        },
        {
          "source": "Maribel Fierro (1996), followed by Godefroid de Callataÿ",
          "value": "Maslama ibn Qāsim al-Qurṭubī (d. 964), placing composition before 964"
        }
      ]
    },
    "siteLink": {
      "href": "picatrix/index.html",
      "label": "Picatrix — the astral-magic wing"
    }
  },
  {
    "slug": "tantraloka",
    "lane": "tantra-rasa",
    "title": "Tantraloka",
    "titleOriginal": "Tantrāloka",
    "dateText": "c. 975–1025 CE (Abhinavagupta's floruit)",
    "sortYear": 1000,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Kashmir",
    "body": "Abhinavagupta's 'Light on the Tantras': a vast encyclopedic synthesis, in thirty-seven chapters, of Trika Shaiva scripture, Kaula ritual, and non-dual metaphysics, composed in Kashmir around 1000 CE (Sanderson places Abhinavagupta's activity c. 975–1025). It takes the Malinivijayottara as its scriptural base; Jayaratha's thirteenth-century commentary (-viveka) preserves its interpretive tradition. First printed in the Kashmir Series of Texts and Studies (1918–1938), it remains the summa of Kashmirian tantra.",
    "technique": "The work systematizes paths to liberation as graded 'means' (upaya): the instantaneous non-means (anupaya), the will-and-awareness method (shambhava), contemplative discernment (shakta), and body-breath-mantra ritual (anava) — a hierarchy of contemplative strategies described, not prescribed, for its initiated medieval audience.",
    "label": "documented",
    "sources": [
      "Alexis Sanderson, lectures and studies on the Tantrāloka (e.g. 'The Tantrāloka of Abhinavagupta' lecture series, 2016)",
      "John R. Dupuche, Abhinavagupta: The Kula Ritual as Elaborated in Chapter 29 of the Tantrāloka (2003)",
      "Kashmir Series of Texts and Studies edition (1918–1938)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "kitab-patanjal",
    "lane": "confluence",
    "title": "Kitab Patanjal: al-Biruni's Arabic Yoga Sutras",
    "titleOriginal": "Kitāb Bātanjal",
    "dateText": "c. 1017–1030 CE (before 1030)",
    "sortYear": 1025,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "translation",
    "place": "Ghazna and northwestern India",
    "body": "In the wake of Mahmud of Ghazna's conquests, al-Biruni studied Sanskrit in India and rendered Patanjali's Yoga Sutras, together with a commentary, into Arabic as the Kitab Batanjal (before 1030) — a documented Sanskrit-to-Arabic transmission of yoga. Pines and Gelblum, who translated the unique Istanbul manuscript, characterise it precisely as an interpretive paraphrase: sutra and commentary fused, recast as a dialogue, Indian terms rendered in Arabic philosophical and Sufi vocabulary. Al-Biruni's India quotes it extensively.",
    "technique": "The text transmits Patanjali's discipline for stilling mental activity — posture, breath-restraint, withdrawal of the senses, and staged concentration culminating in liberation — which al-Biruni reframed as a question-and-answer dialogue between a master and an ascetic in Arabic idiom.",
    "label": "documented",
    "sources": [
      "Shlomo Pines & Tuvia Gelblum, 'Al-Bīrūnī's Arabic Version of Patañjali's Yogasūtra', BSOAS 29 (1966), 40 (1977), 46 (1983), 52 (1989)",
      "Mario Kozah (ed. & tr.), The Yoga Sutras of Patañjali by Abū Rayḥān al-Bīrūnī, Library of Arabic Literature (NYU Press, 2020)",
      "Hellmut Ritter, 'Al-Bīrūnī's Übersetzung des Yoga-Sūtra des Patañjali', Oriens 9 (1956)"
    ],
    "contested": null,
    "siteLink": {
      "href": "yoga/index.html",
      "label": "The Yoga Sutras on the Workbench"
    }
  },
  {
    "slug": "amrtasiddhi",
    "lane": "yoga-vedanta",
    "title": "Amrtasiddhi",
    "titleOriginal": "Amṛtasiddhi",
    "dateText": "11th c. CE (probably second half; before 1160)",
    "sortYear": 1075,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "South Asia (tantric Buddhist milieu; region uncertain)",
    "body": "The earliest text to teach the physical practices later classified as hatha yoga — and it is Buddhist. Composed in Sanskrit in an eclectic tantric Vajrayana milieu, probably in the later 11th century and certainly before 1160, the date of its oldest manuscript's colophon, it teaches preservation of bindu, the vital essence, and survives in a rare bilingual Sanskrit-Tibetan manuscript. Mallinson and Szántó's 2021 critical edition established its Buddhist origin; later Shaiva and Vaishnava texts silently absorbed its verses — a documented cross-tradition transfer at hatha yoga's root.",
    "technique": "The text describes three physical methods — mahamudra, mahabandha and mahavedha, postural locks combined with breath retention — said to arrest the downward loss of bindu and drive the breath into the central channel, framed in metaphors of an internal moon dripping nectar consumed by a sun below.",
    "label": "documented",
    "sources": [
      "James Mallinson & Péter-Dániel Szántó, The Amṛtasiddhi and Amṛtasiddhimūla: The Earliest Texts of the Haṭhayoga Tradition (EFEO/Institut Français de Pondichéry, 2021)",
      "James Mallinson, 'The Amṛtasiddhi: Haṭhayoga's Tantric Buddhist Source Text', in Śaivism and the Tantric Traditions (Brill, 2020)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "wuzhen-pian",
    "lane": "daoist",
    "title": "Wuzhen pian (Awakening to Reality)",
    "titleOriginal": "悟真篇",
    "dateText": "1075",
    "sortYear": 1075,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Song China (trad. Chengdu, Sichuan)",
    "body": "Zhang Boduan (c. 987–1082; Crowe gives ca. 983–1081) completed this cycle of regulated verses in 1075, and it became the foundational classic of neidan's Southern Lineage (Nanzong) — the most influential inner-alchemy text after the Cantong qi, whose emblematic language it deliberately continues. Written in cryptic, allusive poetry meant to be chanted, it fuses alchemical symbolism with Chan Buddhist ideas of awakening, and explicitly rejects mineral elixirs and other 'side gates' in favor of the inner work.",
    "technique": "The poems describe inner alchemy in symbolic terms: gathering 'true lead' and 'true mercury' — emblems for complementary aspects of the person, not the toxic metals — joining them in the 'tripod' of the body, and refining essence (jing) into breath (qi) and spirit (shen) through timed 'fire phases.' The physiology is symbolic; no physical elixir is compounded, and the text itself warns against ingesting minerals.",
    "label": "documented",
    "sources": [
      "Fabrizio Pregadio, Awakening to Reality: The 'Regulated Verses' of the Wuzhen pian, Golden Elixir Press, 2009",
      "Paul Crowe, 'Chapters on Awakening to the Real: A Song Dynasty Classic of Inner Alchemy Attributed to Zhang Boduan (ca. 983–1081)', B.C. Asian Review 12, 2000"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "ihya-ulum-al-din",
    "lane": "islamic",
    "title": "Ihya Ulum al-Din (al-Ghazali)",
    "titleOriginal": "Iḥyāʾ ʿulūm al-dīn",
    "dateText": "c. 1096–1105 (during al-Ghazali's withdrawal)",
    "sortYear": 1100,
    "sortYearEnd": 1105,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Damascus, Jerusalem and Tus",
    "body": "Abu Hamid al-Ghazali abandoned his chair at Baghdad's Nizamiyya in 1095 after a spiritual crisis and, during roughly a decade of withdrawal in Damascus, Jerusalem and Tus, composed the forty-book Ihya ('Revival of the Religious Sciences'), integrating Sufi interior discipline into mainstream Sunni piety. His later autobiography, al-Munqidh min al-Dalal ('Deliverance from Error', written after he resumed teaching in 1106), recounts his tested rejection of theology and philosophy as roads to certainty and his conclusion that the Sufis' 'taste' (dhawq) must be lived, not merely studied.",
    "technique": "Al-Ghazali describes dhikr as retreat into seclusion, reduction of attention to a single point, and continuous repetition of the divine name until the tongue's motion falls away and only the word's meaning persists in the heart; muraqaba he describes as sustained, vigilant self-observation as if under God's gaze. Reported here as he describes it, not as instruction.",
    "label": "documented",
    "sources": [
      "W. Montgomery Watt (trans.), The Faith and Practice of al-Ghazali (Allen & Unwin, 1953)",
      "Frank Griffel, Al-Ghazali's Philosophical Theology (OUP, 2009)",
      "Encyclopaedia of Islam, 2nd ed., art. 'al-Ghazālī' (Brill)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "rasarnava",
    "lane": "tantra-rasa",
    "title": "Rasarnava",
    "titleOriginal": "Rasārṇava",
    "dateText": "c. 11th–12th c. CE",
    "sortYear": 1100,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "India",
    "body": "The 'Ocean of Mercury', an anonymous Shaiva alchemical tantra cast as Bhairava's teaching to the Goddess, and the doctrinal summit of the Rasa Siddhas. Its aphorism 'yatha lohe tatha dehe' — as in metal, so in the body — welds transmutation to bodily immortality. White treats it as eleventh-century; other surveys give the twelfth. Its mercury-sulfur elixirs employ substances now documented as severely toxic; they are studied as history, not chemistry to repeat.",
    "technique": "The text details the eighteen samskaras of mercury — swooning, binding, 'killing' (oxidation), and fixation with sulfur, mica, and plant juices — held to make mercury capable first of transmuting metals, then of transubstantiating the alchemist's body. Mercury vapor and salts are documented neurotoxins; the sequence is preserved here strictly for historical study.",
    "label": "documented",
    "sources": [
      "David Gordon White, The Alchemical Body (University of Chicago Press, 1996)",
      "David Gordon White, 'The Ocean of Mercury: An Eleventh-Century Alchemical Text', in Donald S. Lopez Jr. (ed.), Religions of India in Practice (Princeton University Press, 1995), pp. 281–287"
    ],
    "contested": {
      "flag": "Century of composition",
      "positions": [
        {
          "source": "David Gordon White, 'The Ocean of Mercury: An Eleventh-Century Alchemical Text', in Donald S. Lopez Jr. (ed.), Religions of India in Practice (Princeton, 1995)",
          "value": "11th century CE"
        },
        {
          "source": "G. J. Meulenbeld and general surveys of rasashastra literature",
          "value": "c. 12th century CE"
        }
      ]
    },
    "siteLink": {
      "href": "rasa.html",
      "label": "Rasashastra page"
    }
  },
  {
    "slug": "person-wang-chongyang",
    "lane": "daoist",
    "title": "Wang Chongyang",
    "titleOriginal": "王重陽",
    "dateText": "1113–1170",
    "sortYear": 1113,
    "sortYearEnd": 1170,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Shaanxi and Shandong, China",
    "body": "A Shaanxi literatus turned ascetic under the Jurchen Jin dynasty, Wang Chongyang (1113–1170) reported encounters with immortals — identified by tradition as Zhongli Quan and Lü Dongbin — around 1159–1160, sealed himself for years in a pit he called the 'Tomb of the Living Dead,' then in 1167 burned his hut and walked to Shandong, where he gathered the seven disciples later styled the Seven Perfected and founded the Quanzhen order. Hagiography encrusts, but does not erase, this documented core.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Louis Komjathy, Cultivating Perfection: Mysticism and Self-transformation in Early Quanzhen Daoism, Brill, 2007",
      "Stephen Eskildsen, The Teachings and Practices of the Early Quanzhen Taoist Masters, SUNY Press, 2004"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-adelard-1126",
    "lane": "confluence",
    "title": "Adelard of Bath Latinises al-Khwarizmi's Sindhind tables",
    "titleOriginal": null,
    "dateText": "1126",
    "sortYear": 1126,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "England / al-Andalus (transmission route)",
    "body": "The Indian-Arabic astronomy came full circuit into Latin: al-Khwarizmi's Zij al-Sindhind — built on the Sindhind material translated in Baghdad — survived in the revision made by Maslama al-Majriti of Córdoba (c. 1000), and that recension was translated into Latin in 1126, a version scholarship attributes, with a customary 'presumably', to Adelard of Bath. The original Arabic is lost; the Latin tables are the work's sole complete witness — Brahmagupta's parameters reaching Latin Europe at third hand.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Otto Neugebauer, The Astronomical Tables of al-Khwārizmī (Copenhagen, 1962)",
      "H. Suter (ed.), Die astronomischen Tafeln des Muhammed ibn Mūsā al-Khwārizmī (1914)",
      "Charles Burnett, 'Adelard of Bath', Oxford Dictionary of National Biography (Oxford, 2004)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-toledo-translations",
    "lane": "confluence",
    "title": "Toledo: the Arabic-to-Latin translation century",
    "titleOriginal": null,
    "dateText": "c. 1130–1187",
    "sortYear": 1130,
    "sortYearEnd": 1187,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Toledo, Castile",
    "body": "In twelfth-century Toledo, reconquered libraries of Arabic science fell into Latin hands and translators converged. John of Seville (fl. 1133–53) turned Arabic astrology into Latin; Gerard of Cremona (d. 1187), who came seeking Ptolemy's Almagest, translated it and — per the memorial list his students appended to his Vita — seventy-one works in all, with later tradition crediting him with more. The 'Toledo School of Translators' is a modern historians' label; Burnett describes instead an informal but coherent program.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Charles Burnett, 'The Coherence of the Arabic-Latin Translation Program in Toledo in the Twelfth Century', Science in Context 14 (2001)",
      "'Gerard of Cremona', Dictionary of Scientific Biography (the socii list of 71 works)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-robert-chester-1144",
    "lane": "confluence",
    "title": "Alchemy's Latin debut: the Morienus translation, 1144",
    "titleOriginal": "Liber de compositione alchemiae",
    "dateText": "dated 11 February 1144 (attribution contested)",
    "sortYear": 1144,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "translation",
    "place": "Iberia (Segovia milieu of the English Arabists in Spain)",
    "body": "A preface in the name of Robertus Castrensis — Robert of Chester, the Arabist who Latinised al-Khwarizmi's algebra at Segovia in 1145; older scholarship also credited him with the 1143 Qur'an translation, a conflation with Robert of Ketton that modern scholarship treats as unproven — dates to 11 February 1144 the Liber de compositione alchemiae, the epistle of the monk Morienus to the Umayyad prince Khalid ibn Yazid, claiming that alchemy was then unknown to the Latin world. It is traditionally alchemy's first Latin arrival. The elixir recipes' mineral ingredients — mercury and arsenic compounds among them — are toxic; the text is described here for study, never practice.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Ahmad Y. al-Hassan, 'The Arabic Original of Liber de compositione alchemiae', Arabic Sciences and Philosophy 14 (2004)",
      "Marion Dapsens, 'De la Risālat Maryānus au De compositione alchemiae', Studia graeco-arabica 6 (2016)",
      "Lee Stavenhagen, A Testament of Alchemy: Being the Revelations of Morienus to Khalid ibn Yazid, 1974",
      "Ahmad Y. al-Hassan, 'The Arabic Original of Liber de compositione alchemiae', Arabic Sciences and Philosophy 14, 2004",
      "Julius Ruska, Arabische Alchemisten I: Chālid ibn Jazīd ibn Muʿāwija, 1924"
    ],
    "contested": {
      "flag": "Whether the 1144 preface genuinely belongs to this translation and secures its status as the first Latin alchemical text",
      "positions": [
        {
          "source": "Traditional attribution (the preface), defended by Richard Lemay, 'L'authenticité de la préface de Robert de Chester à sa traduction du Morienus', Chrysopoeia 4 (1990–91), and accepted by A. Y. al-Hassan (2004)",
          "value": "Robert of Chester completed the translation on 11 February 1144; the earliest Latin translation of an Arabic alchemical work"
        },
        {
          "source": "Marion Dapsens, 'De la Risālat Maryānus au De compositione alchemiae', Studia graeco-arabica 6 (2016)",
          "value": "even if the preface is Robert's, it may not have been written for this treatise; the translator, the date, and the 'first translation' status remain uncertain"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "scala-claustralium",
    "lane": "christian",
    "title": "Scala Claustralium (Guigo II)",
    "titleOriginal": "Scala Claustralium (The Ladder of Monks)",
    "dateText": "12th c., third quarter (popular accounts say c. 1150; Guigo II was prior 1174–1180, d. c. 1188)",
    "sortYear": 1150,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Grande Chartreuse, France",
    "body": "Guigo II, ninth prior of the Grande Chartreuse (1174–1180), addressed this short Latin letter on the contemplative life to a Brother Gervase; the standard edition can date it no more precisely than the third quarter of the twelfth century (popular accounts round this to c. 1150), and it long circulated under the names of Bernard of Clairvaux and Augustine. It is the first Western text to formalize lectio divina as a four-runged ladder — reading, meditation, prayer, contemplation — presenting monastic engagement with scripture as a graded ascent rather than as study, and it became a staple of late-medieval devotional compilations.",
    "technique": "The letter describes four rungs: lectio (slow reading of a scriptural passage), meditatio (ruminating on its sense), oratio (prayer arising from it) and contemplatio (wordless rest in God). Guigo compares the sequence to eating — seeking, chewing, tasting, savoring. Historical description of the schema.",
    "label": "documented",
    "sources": [
      "Edmund Colledge & James Walsh (trans.), Guigo II: The Ladder of Monks and Twelve Meditations (Cistercian Publications, 1981)",
      "Bernard McGinn, The Growth of Mysticism (Crossroad, 1994)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "quanzhen",
    "lane": "daoist",
    "title": "The Quanzhen (Complete Perfection) Order",
    "titleOriginal": "全真",
    "dateText": "founded 1167",
    "sortYear": 1167,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "institution",
    "place": "Shandong, China",
    "body": "Founded by Wang Chongyang in Shandong in 1167, Quanzhen ('Complete Perfection') remade Daoism as a celibate monastic order that harmonized the Three Teachings and replaced elixirs and ritual with ascetic discipline and neidan meditation. Qiu Chuji's celebrated 1222 audience with Chinggis Khan won it imperial patronage, and it absorbed the Southern neidan lineage under the Yuan. With the Zhengyi liturgical tradition it remains one of the two great divisions of Daoism today.",
    "technique": "Early Quanzhen practice, as documented by Eskildsen and Komjathy, combined severe asceticism — sleep deprivation, begging, seclusion in meditation enclosures — with inner-alchemical meditation aimed at 'refining' the person, framed in the symbolic vocabulary of neidan rather than mineral alchemy.",
    "label": "documented",
    "sources": [
      "Louis Komjathy, Cultivating Perfection: Mysticism and Self-transformation in Early Quanzhen Daoism, Brill, 2007",
      "Stephen Eskildsen, The Teachings and Practices of the Early Quanzhen Taoist Masters, SUNY Press, 2004"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-michael-scot",
    "lane": "confluence",
    "title": "Michael Scot: from Toledo to Frederick II's Sicily",
    "titleOriginal": null,
    "dateText": "c. 1175 – c. 1236",
    "sortYear": 1175,
    "sortYearEnd": 1236,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Toledo; Bologna; Palermo (court of Frederick II)",
    "body": "Michael Scot is first documented at Toledo in 1217, completing the Latin translation of al-Bitruji's On the Motions of the Heavens; he went on to translate Aristotle's zoology and the commentaries of Averroes, opening the Latin Averroist age. By about 1228 he served the emperor Frederick II in Sicily as court astrologer, compiling the astrological Liber introductorius. A poem of early 1236 mentions him as recently dead; legend — Dante's Inferno included — soon made him a wizard.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Charles Burnett, 'Michael Scot and the Transmission of Scientific Culture from Toledo to Bologna via the Court of Frederick II Hohenstaufen', Micrologus 2 (1994), 101–126",
      "Lynn Thorndike, Michael Scot (London, 1965)",
      "'Michael Scot', Encyclopaedia Britannica"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "sefer-ha-bahir",
    "lane": "kabbalah",
    "title": "Sefer ha-Bahir (Book of Brightness)",
    "titleOriginal": "ספר הבהיר",
    "dateText": "surfaced in Provence c. 1176",
    "sortYear": 1176,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Provence",
    "body": "An anonymous Hebrew work, pseudepigraphically framed as ancient teaching of the rabbi Nehunya ben ha-Qanah, which surfaced in Provence around 1176. Scholem identified it as the earliest text of Kabbalah proper: the first to deploy the sefirot as dynamic divine powers and to use symbols — the cosmic tree, the divine feminine — that theosophic Kabbalah would elaborate for centuries. Fragmentary and midrashic in form, it reworks older materials, including Sefer Yetzirah, whose 'sefirot' it transforms from numbers into emanations; where and when its constituent layers were composed remains contested.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Gershom Scholem, Origins of the Kabbalah (German 1962; English 1987)",
      "Aryeh Kaplan, The Bahir (1979)",
      "Encyclopaedia Britannica, 'Sefer ha-bahir'"
    ],
    "contested": {
      "flag": "Origins of its materials: how old are the strata behind the Provençal book, and where were they composed?",
      "positions": [
        {
          "source": "Gershom Scholem, Origins of the Kabbalah (German 1962; English 1987)",
          "value": "A stratified work reworking ancient Eastern, gnostic-tinged materials — including relics of the lost Raza Rabba — that reached Provence through channels such as the German Pietists"
        },
        {
          "source": "Ronit Meroz, 'A Journey of Initiation in the Babylonian Layer of Sefer ha-Bahir', Studia Hebraica 7 (2007) and related studies",
          "value": "Distinct textual layers: some composed in the East (Babylonia) around the 9th–10th centuries — witnessed by the Babylonian vowel-pointing system — others written in 12th-century Provence"
        }
      ]
    },
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "kularnava-tantra",
    "lane": "tantra-rasa",
    "title": "Kularnava Tantra",
    "titleOriginal": "Kulārṇava Tantra",
    "dateText": "c. 1000–1400 CE",
    "sortYear": 1200,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "India (region uncertain)",
    "body": "The most authoritative scripture of the later Kaula tradition, roughly 2,058 verses in seventeen chapters, dated by scholarship between 1000 and 1400 CE. It exalts the guru, grades revelations with Kaula doctrine supreme, and regulates the secret rite of the five 'M' substances (panchamakara) while condemning their profane misuse. Nearly all later tantric digests quote it. The Sanskrit text was published in Woodroffe's Tantrik Texts series (ed. Taranatha Vidyaratna, 1917).",
    "technique": "The text describes kula worship: initiation by a qualified guru, japa of received mantras, and a tightly hedged ritual use of the five makaras (wine, meat, fish, parched grain, sexual union), framed as sacramental only within initiation — a description of a medieval ritual system, not a practice manual.",
    "label": "documented",
    "sources": [
      "Teun Goudriaan & Sanjukta Gupta, Hindu Tantric and Śākta Literature (1981)",
      "Oxford Reference, 'Kulārṇava Tantra'",
      "Tantrik Texts vol. V, ed. Taranatha Vidyaratna, intro. Arthur Avalon (1917)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-gorakhnath",
    "lane": "tantra-rasa",
    "title": "Gorakhnath",
    "titleOriginal": "Gorakṣanātha",
    "dateText": "c. 11th–14th c. CE (contested)",
    "sortYear": 1200,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "person",
    "place": "northern India / Punjab-Nepal borderlands (traditions vary)",
    "body": "The yogi credited with organizing the Nath sampradaya of ascetic 'split-ear' yogis and with early hatha yoga works such as the Gorakshashataka attributed to him. Legend makes him the disciple who rescued his guru Matsyendranatha from sensual captivity. Historians agree only that he lived in the early second millennium: Briggs argued for the eleventh–twelfth century, Abbott for the thirteenth, Grierson for the fourteenth. The vast hagiography — immortal wanderer, master alchemist — is legendary accretion.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "George Weston Briggs, Gorakhnath and the Kanphata Yogis (1938)",
      "James Mallinson, 'Nāth Saṃpradāya', Brill Encyclopedia of Hinduism (2011)",
      "David Gordon White, The Alchemical Body (1996)"
    ],
    "contested": {
      "flag": "Century in which Gorakhnath lived",
      "positions": [
        {
          "source": "G. W. Briggs, Gorakhnath and the Kanphata Yogis (1938)",
          "value": "11th–12th century CE"
        },
        {
          "source": "J. E. Abbott (Baba Farid documents, Jnaneshvari MSS)",
          "value": "13th century CE"
        },
        {
          "source": "G. A. Grierson (Gujarat evidence)",
          "value": "14th century CE"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-ibn-arabi",
    "lane": "islamic",
    "title": "Ibn Arabi",
    "titleOriginal": "Muḥyī al-Dīn Ibn ʿArabī",
    "dateText": "1165–1240; Fuṣūṣ al-Ḥikam 1229",
    "sortYear": 1202,
    "sortYearEnd": 1240,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Murcia, al-Andalus; died Damascus",
    "body": "Muhyi al-Din Ibn Arabi (Murcia 1165 – Damascus 1240), 'al-Shaykh al-Akbar', produced the encyclopedic al-Futuhat al-Makkiyya (begun in Mecca in 1202; second recension completed 1238) and the compact Fusus al-Hikam (1229), which he reported receiving in a vision of the Prophet. His ontology of continual divine self-disclosure was later systematized — by followers and opponents alike — under the label wahdat al-wujud ('unity of being'), a phrase absent from his own writings; its meaning has been fought over ever since.",
    "technique": null,
    "label": "documented",
    "sources": [
      "William C. Chittick, The Sufi Path of Knowledge (SUNY, 1989)",
      "Claude Addas, Quest for the Red Sulphur: The Life of Ibn Arabi (Islamic Texts Society, 1993)",
      "Muhyiddin Ibn Arabi Society, 'The Writings of Ibn Arabi' (ibnarabisociety.org)"
    ],
    "contested": {
      "flag": "The reception of wahdat al-wujud — a term Ibn Arabi himself never used — as the meaning of his doctrine",
      "positions": [
        {
          "source": "Ibn Taymiyya (d. 1328) and the anti-Akbarian polemical tradition",
          "value": "Ibn Arabi's teaching amounts to a heretical conflation of God and world (pantheism/incarnationism) and must be condemned"
        },
        {
          "source": "William C. Chittick, The Sufi Path of Knowledge (SUNY, 1989)",
          "value": "The term wahdat al-wujud does not appear in Ibn Arabi's writings; it was attached by later interpreters, and his position — creatures as loci of divine self-disclosure — is not reducible to pantheism"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-eleazar-of-worms",
    "lane": "kabbalah",
    "title": "Eleazar of Worms and the Ashkenazi Hasidim",
    "titleOriginal": null,
    "dateText": "c. 1176–1238",
    "sortYear": 1207,
    "sortYearEnd": 1238,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Worms, Rhineland",
    "body": "Rabbi of Worms and the last major theologian of the Hasidei Ashkenaz, the medieval German-Jewish pietists. His five-part compendium Sodei Razayya ('Secrets of Secrets') committed the school's esoteric inheritance to writing — divine-name speculation, merkavah traditions, and a commentary on Sefer Yetzirah later associated with golem legends — he said, lest it die with him. Writing after the Crusade-era massacres (his wife Dulcea and his daughters were murdered by intruders in 1196), he transmitted early mystical materials that theosophic Kabbalah later absorbed.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Encyclopaedia Judaica, 'Eleazar ben Judah of Worms'",
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lecture 3",
      "Joseph Dan, The Esoteric Theology of Ashkenazi Hasidism (1968)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-al-shadhili",
    "lane": "islamic",
    "title": "Abu al-Hasan al-Shadhili",
    "titleOriginal": "Abū al-Ḥasan al-Shādhilī",
    "dateText": "c. 1196–1258",
    "sortYear": 1227,
    "sortYearEnd": 1258,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Morocco; Tunis; died Humaithara, Egypt",
    "body": "Abu al-Hasan al-Shadhili (c. 1196–1258), Moroccan-born jurist and mystic, founded the Shadhiliyya in Tunis and Alexandria and died at Humaithara in Egypt's eastern desert while traveling toward Mecca. He wrote no books, reportedly saying his companions were his books; his teaching survives in transmitted litanies (ahzab), most famously the Hizb al-Bahr ('Litany of the Sea'), which tradition reports he received in a dream-vision of the Prophet. The order joined strict legal observance to an unostentatious interior path pursued within ordinary working life.",
    "technique": "The Shadhili path as transmitted centers on recitation of fixed litanies (ahzab, awrad) at set times and on gatherings of collective dhikr, rather than on distinctive postures or prolonged retreat. Historical description of the order's documented practice.",
    "label": "documented",
    "sources": [
      "Encyclopaedia of Islam, 2nd ed., art. 'al-Shādhilī' (Brill)",
      "Elmer H. Douglas (trans.), The Mystical Teachings of al-Shadhili (Ibn al-Sabbagh's Durrat al-Asrar) (SUNY, 1993)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "shobogenzo",
    "lane": "buddhist",
    "title": "Shōbōgenzō",
    "titleOriginal": "正法眼蔵 (Shōbōgenzō)",
    "dateText": "composed 1231–1253",
    "sortYear": 1231,
    "sortYearEnd": 1253,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Kyoto and Eiheiji (Echizen), Japan",
    "body": "Dōgen (1200–1253), founder of Japanese Sōtō Zen, composed the essays of the Shōbōgenzō ('Treasury of the True Dharma Eye') between 1231 and his death in 1253, at Kōshōji and Eiheiji. Written in Japanese rather than Chinese, the fascicles dissolve the distinction between practice and realization: zazen is not a means to awakening but its enactment. His earlier Fukanzazengi (1227) gives the school's canonical instructions for sitting.",
    "technique": "Dōgen's method, shikantaza ('just sitting'), is described as objectless seated meditation in the upright posture, without koan, breath-count, goal, or technique applied — sitting itself taken as the direct expression of the awakened state rather than a route toward it.",
    "label": "documented",
    "sources": [
      "Carl Bielefeldt, Dōgen's Manuals of Zen Meditation, 1988",
      "Kazuaki Tanahashi (ed.), Treasury of the True Dharma Eye: Zen Master Dogen's Shobo Genzo, 2010"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "dattatreyayogasastra",
    "lane": "yoga-vedanta",
    "title": "Dattatreyayogasastra",
    "titleOriginal": "Dattātreyayogaśāstra",
    "dateText": "c. 13th c. CE",
    "sortYear": 1250,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "India (region uncertain)",
    "body": "A Vaishnava teaching text of roughly 193 verses, probably of the 13th century, and the earliest work to teach a systematized practice under the name hatha yoga. It classifies yoga into mantra, laya, hatha and raja varieties, is the first text to combine Patanjali's eight-limbed scheme with physical techniques such as the mudras, and declares success open to anyone who practises diligently, whatever their religious affiliation — an unusually inclusive charter for its period.",
    "technique": "The text describes an eightfold hatha practice grafted onto Patanjali's limbs, plus physical 'seals' including mahamudra, mahabandha, mahavedha and khecarimudra — breath retentions and bodily locks said to conquer death by preserving the vital essence.",
    "label": "documented",
    "sources": [
      "James Mallinson, 'Translation of the Dattātreyayogaśāstra, the earliest text to teach haṭhayoga' (draft translation, 2013)",
      "James Mallinson & Mark Singleton, Roots of Yoga (Penguin Classics, 2017)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-picatrix-translation",
    "lane": "confluence",
    "title": "The Picatrix crosses over: Arabic to Castilian to Latin",
    "titleOriginal": "Ghāyat al-Ḥakīm → Picatrix",
    "dateText": "Castilian 1256–1258; Latin soon after",
    "sortYear": 1256,
    "sortYearEnd": 1258,
    "dateCertainty": "range",
    "kind": "translation",
    "place": "Toledo, court of Alfonso X of Castile",
    "body": "The Ghayat al-Hakim ('Goal of the Sage'), an Andalusi Arabic compendium of astral magic, was translated into Castilian at the order of Alfonso X between 1256 and 1258; the Latin Picatrix, derived from that Castilian version, carried Arabic talismanic magic into the libraries of Ficino's and Agrippa's Europe. Pingree edited the Latin text in 1986. The Arabic original's date and author are themselves contested between tenth- and eleventh-century attributions — a dispute scholarship keeps open.",
    "technique": null,
    "label": "documented",
    "sources": [
      "David Pingree (ed.), Picatrix: The Latin Version of the Ghāyat al-Hakīm (Warburg Institute, 1986)",
      "Maribel Fierro, 'Bāṭinism in al-Andalus. Maslama b. Qāsim al-Qurṭubī', Studia Islamica 84 (1996)",
      "Dan Attrell & David Porreca, Picatrix: A Medieval Treatise on Astral Magic (Penn State, 2019)"
    ],
    "contested": {
      "flag": "Date and authorship of the Arabic original (Ghayat al-Hakim)",
      "positions": [
        {
          "source": "David Pingree, 'Some of the Sources of the Ghāyat al-hakīm', JWCI 43 (1980), and his 1986 Latin edition",
          "value": "composed in al-Andalus around the mid-eleventh century, pseudonymously ascribed to Maslama al-Majriti"
        },
        {
          "source": "Maribel Fierro, 'Bāṭinism in al-Andalus', Studia Islamica 84 (1996)",
          "value": "the true author is Maslama b. Qasim al-Qurtubi (d. 964); an internal colophon dates composition to 954–959"
        }
      ]
    },
    "siteLink": {
      "href": "picatrix/index.html",
      "label": "The Picatrix on the Workbench"
    }
  },
  {
    "slug": "masnavi",
    "lane": "islamic",
    "title": "Masnavi (Rumi)",
    "titleOriginal": "Mas̱navī-yi Maʿnavī",
    "dateText": "c. 1258–1273 (start also dated c. 1262; sixth book left unfinished)",
    "sortYear": 1265,
    "sortYearEnd": 1273,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Konya",
    "body": "Jalal al-Din Rumi began dictating the Masnavi-yi Ma'navi to his scribe Husam al-Din Chalabi around 1258 (some scholars place the start c. 1262) in Konya and continued until his death in 1273, leaving the sixth book unfinished. Roughly 25,000 Persian couplets of stories, Quranic exegesis and mystical teaching, it was soon honored as 'the Quran in the Persian tongue.' After Rumi's death his son Sultan Walad organized his followers into the Mevlevi order, whose whirling sama ceremony became the tradition's public face.",
    "technique": "The Mevlevi sama — codified after Rumi's death by Sultan Walad and standardized in the form still used under Pir Adil Çelebi (15th c.) — is a ceremonial whirling: dervishes revolve counterclockwise, right palm turned upward and left downward, to sung poetry and the ney flute, as a bodily form of dhikr. Described here historically; the Masnavi itself is a didactic poem, not a sama manual.",
    "label": "documented",
    "sources": [
      "Franklin D. Lewis, Rumi: Past and Present, East and West (Oneworld, 2000)",
      "Jawid Mojaddedi (trans.), Rumi: The Masnavi, Book One (OUP, 2004)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-abulafia",
    "lane": "kabbalah",
    "title": "Abraham Abulafia and ecstatic Kabbalah",
    "titleOriginal": null,
    "dateText": "1240–c. 1291; Hayyei ha-Olam ha-Ba written 1280",
    "sortYear": 1280,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Spain, Greece, Italy, Sicily",
    "body": "Born in Zaragoza, Abraham Abulafia founded what he called prophetic Kabbalah — an ecstatic path largely indifferent to the sefirotic theosophy of his contemporaries, aiming instead at prophetic experience through the divine names. His handbook Hayyei ha-Olam ha-Ba ('Life of the World to Come', 1280) circulated widely in manuscript. That same year he traveled to Rome seeking an audience with Pope Nicholas III, escaping execution when the pope suddenly died. Moshe Idel's studies restored him to a central place in the history of Jewish mysticism.",
    "technique": "His hokhmat ha-tseruf ('science of letter-combination') instructed the practitioner to permute, write, and vocalize the letters of divine names — coordinated with controlled breathing and prescribed head movements — until an ecstatic, prophetic state ensued. Described here as a documented historical method, not instruction.",
    "label": "documented",
    "sources": [
      "Moshe Idel, The Mystical Experience in Abraham Abulafia (1988)",
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lecture 4",
      "Braginsky Collection, MS of Hayyei ha-Olam ha-Ba"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "zohar",
    "lane": "kabbalah",
    "title": "The Zohar (Book of Splendor)",
    "titleOriginal": "ספר הזהר",
    "dateText": "c. 1280s Castile per scholarship (traditionally 2nd c. CE); printed Mantua & Cremona 1558–60",
    "sortYear": 1285,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Castile (per modern scholarship)",
    "body": "The central work of theosophic Kabbalah: a sprawling Aramaic corpus of mystical Torah commentary, narrative, and theosophy voiced through the 2nd-century sage Shimon bar Yochai and his companions. Kabbalistic tradition accepts that attribution; academic scholarship since Scholem places composition in Castile in the 1280s–90s, whether principally by Moses de Leon or, per Liebes and Idel, by a circle of kabbalists. Rival printings at Mantua (1558–60) and Cremona (1558–60), amid rabbinic controversy, fixed the canon Christian Europe would later translate.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lectures 5–6",
      "Yehuda Liebes, Studies in the Zohar (1993)",
      "Editio princeps: Mantua 1558–60 and Cremona 1558–60"
    ],
    "contested": {
      "flag": "Authorship and date: 2nd-century Galilee by tradition vs. 13th-century Castile per scholarship",
      "positions": [
        {
          "source": "Kabbalistic tradition and the printed title pages",
          "value": "Composed by Shimon bar Yochai in 2nd-century CE Galilee"
        },
        {
          "source": "Gershom Scholem, Major Trends in Jewish Mysticism (1941)",
          "value": "Moses de Leon of Castile wrote the bulk of the corpus in the last decades of the 13th century"
        },
        {
          "source": "Yehuda Liebes, Studies in the Zohar (1993); Moshe Idel",
          "value": "The work of a circle of Castilian kabbalists writing over time, with de Leon prominent among several hands"
        }
      ]
    },
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "shaarei-orah",
    "lane": "kabbalah",
    "title": "Sha'arei Orah (Gates of Light)",
    "titleOriginal": "שערי אורה",
    "dateText": "written c. 1290; Latin Portae Lucis 1516; Hebrew first printed Riva di Trento & Mantua 1561",
    "sortYear": 1290,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "text",
    "place": "Castile",
    "body": "Joseph Gikatilla's systematic guide to the ten sefirot and the divine names attached to each, written in Castile around 1290; Scholem judged it the most influential handbook of kabbalistic symbolism. A former student of Abulafia who turned toward theosophic Kabbalah, Gikatilla arranged the work as an ascent through ten 'gates' from the last sefirah to the first. Paulus Ricius's partial Latin translation, Portae Lucis (Augsburg, 1516), carried the first printed sefirotic tree to Christian readers; the Hebrew original was first printed in 1561, at Riva di Trento by Jacob Marcaria, with a second printing at Mantua that same year.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Paulus Ricius (trans.), Portae Lucis (Augsburg: Johannes Miller, 1516)",
      "Gershom Scholem, Kabbalah (1974)",
      "Avi Weinstein (trans.), Gates of Light (1994)"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "summa-perfectionis",
    "lane": "alchemy-west",
    "title": "Summa Perfectionis (pseudo-Geber)",
    "titleOriginal": "Summa perfectionis magisterii",
    "dateText": "late 13th c. (c. 1280–1310)",
    "sortYear": 1295,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Italy (Franciscan milieu)",
    "body": "The Summa perfectionis magisterii, circulating under the name 'Geber', became the standard textbook of medieval Latin alchemy: metals as compounds of sulfur and mercury, a corpuscular theory of matter, and the doctrine that purified mercury alone perfects. William Newman's critical edition (1991) showed the work is an original Latin composition of the late thirteenth century and tentatively assigned it to the Franciscan Paul of Taranto — 'Geber' is not the Arabic Jābir. Ahmad al-Hassan dissented, arguing for Arabic originals behind the Latin.",
    "technique": "Teaches the purification and 'medicines' of metals through mercury, with the sublimation of quicksilver as the key operation. Mercury vapor is severely toxic; the procedures survive as historical record only.",
    "label": "documented",
    "sources": [
      "William R. Newman, The Summa Perfectionis of Pseudo-Geber: A Critical Edition, Translation and Study, 1991",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": {
      "flag": "Authorship of the Summa perfectionis",
      "positions": [
        {
          "source": "William R. Newman, The Summa Perfectionis of Pseudo-Geber, 1991",
          "value": "an original Latin work of the late 13th c., plausibly by the Franciscan Paul of Taranto"
        },
        {
          "source": "Ahmad Y. al-Hassan",
          "value": "the pseudo-Geber works were written in or compiled from Arabic sources, not original Latin compositions"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-longchenpa",
    "lane": "buddhist",
    "title": "Longchenpa (Longchen Rabjam)",
    "titleOriginal": "Klong chen rab 'byams pa Dri med 'od zer",
    "dateText": "1308–1364",
    "sortYear": 1308,
    "sortYearEnd": 1364,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Central Tibet (with exile in Bumthang, Bhutan)",
    "body": "The scholastic systematizer of Dzogchen, the 'Great Perfection' of the Nyingma school. His Seven Treasuries and Trilogy of Natural Ease integrated the Dzogchen tantras' vision of pristine awareness with the normative Buddhist scholasticism of fourteenth-century Tibet, and are generally taken as the definitive expression of the tradition. His synthesis later anchored the nineteenth-century nonsectarian revival through Jigme Lingpa's visionary rediscovery of his corpus.",
    "technique": "His treasuries codify Dzogchen contemplation as distinguishing ordinary mind from pristine awareness (rigpa) and resting in that recognition without fabrication, with the advanced paired methods the tradition calls 'cutting through' (khregs chod) and 'direct crossing' (thod rgal).",
    "label": "documented",
    "sources": [
      "David Germano, Poetic Thought, the Intelligent Universe, and the Mystery of Self: The Tantric Synthesis of rDzogs Chen in Fourteenth Century Tibet, PhD dissertation, University of Wisconsin–Madison, 1992",
      "Stéphane Arguillère, Profusion de la vaste sphère: Klong-chen rab-'byams (Tibet, 1308–1364). Sa vie, son œuvre, sa doctrine, Peeters, 2007",
      "Tulku Thondup, Buddha Mind: An Anthology of Longchen Rabjam's Writings, 1989"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-barlaam",
    "lane": "christian",
    "title": "Barlaam of Calabria",
    "titleOriginal": "Barlaam of Seminara",
    "dateText": "c. 1290–1348",
    "sortYear": 1319,
    "sortYearEnd": 1348,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Calabria; Constantinople",
    "body": "Barlaam of Seminara (c. 1290–1348), Calabrian Greek humanist, philosopher and monk, taught in Constantinople before igniting the hesychast controversy: encountering Athonite monks' prayer methods, he branded them Messalian heretics and 'navel-gazers' in polemics the patriarchate later ordered destroyed, so his treatise Against the Messalians survives only in fragments and quotation. Condemned by the Constantinople council of June 1341, he returned to Italy, entered the Latin church as bishop of Gerace, and briefly taught Greek to Petrarch.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Oxford Dictionary of Byzantium, art. 'Barlaam of Calabria' (OUP, 1991)",
      "John Meyendorff, A Study of Gregory Palamas (Faith Press, 1964)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-in-agro-dominico",
    "lane": "christian",
    "title": "In agro dominico: the condemnation of Meister Eckhart",
    "titleOriginal": "In agro dominico",
    "dateText": "27 March 1329",
    "sortYear": 1329,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Avignon",
    "body": "On 27 March 1329 Pope John XXII issued the bull In agro dominico at Avignon, censuring twenty-eight propositions drawn from Meister Eckhart's Latin and German works — seventeen as heretical, eleven as 'evil-sounding, rash and suspect of heresy.' Eckhart — on McGinn's assessment the only medieval theologian tried as a heretic in his capacity as a theologian — had died (probably early 1328) while appealing to the papal court; the bull records that he revoked in advance whatever should be proven erroneous. The condemnation shadowed, without extinguishing, his influence on Rhineland mysticism.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Edmund Colledge & Bernard McGinn, Meister Eckhart: The Essential Sermons, Commentaries, Treatises, and Defense (Paulist CWS, 1981; includes In agro dominico)",
      "Bernard McGinn, The Mystical Thought of Meister Eckhart (Crossroad, 2001)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "pseudo-lull-corpus",
    "lane": "alchemy-west",
    "title": "The pseudo-Lullian alchemical corpus",
    "titleOriginal": "Testamentum (earliest work)",
    "dateText": "Testamentum 1332; corpus accreted 14th–15th c.",
    "sortYear": 1332,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "London (per the Testamentum colophon); anonymous Catalan author of the Montpellier milieu",
    "body": "Beginning with the Testamentum of 1332 — written, according to its colophon, in London by an anonymous Catalan master a generation after Ramon Llull's death — an alchemical corpus of well over a hundred texts accreted under Llull's name, complete with a legend of his conversion to alchemy in England. Michela Pereira's 1989 survey consolidated the scholarly verdict that none are authentic: the historical Llull wrote against alchemy. The pseudo-Lullian art of quintessences and lettered wheels nonetheless dominated late medieval alchemical theory.",
    "technique": "The Testamentum tradition teaches the extraction of a 'quintessence' by repeated distillation of wine and the preparation of vegetable and mineral 'mercuries' as universal medicines — historical doctrine involving toxic metallic preparations, described for study.",
    "label": "documented",
    "sources": [
      "Michela Pereira, The Alchemical Corpus Attributed to Raymond Lull, 1989",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "triads",
    "lane": "christian",
    "title": "Triads in Defense of the Holy Hesychasts (Gregory Palamas)",
    "titleOriginal": "Hyper tōn hierōs hēsychazontōn",
    "dateText": "1338–1341",
    "sortYear": 1339,
    "sortYearEnd": 1341,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Thessaloniki / Mount Athos",
    "body": "Gregory Palamas, Athonite monk and later archbishop of Thessaloniki, wrote the three Triads 'in defense of the holy hesychasts' (1338–1341) against Barlaam of Calabria, who had ridiculed the monks' psychophysical prayer — calling them omphalopsychoi, 'navel-souls', a hostile caricature and not the practice's self-description — and denied that the light they reported was uncreated. Palamas answered with the essence–energies distinction: God unknowable in essence yet truly participated in his energies. Councils at Constantinople (1341, 1347, 1351) upheld his teaching.",
    "technique": "The hesychast method Palamas defends: seated, head bowed, attention gathered 'into the heart', breathing measured, the practitioner continually repeats the Jesus Prayer ('Lord Jesus Christ, Son of God, have mercy on me'). Palamas treats posture and breath as aids for beginners, not the prayer's essence. Historical description of a defended practice.",
    "label": "documented",
    "sources": [
      "John Meyendorff (ed.), Gregory Palamas: The Triads (Paulist CWS, 1983)",
      "John Meyendorff, A Study of Gregory Palamas (Faith Press, 1964)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "bardo-thodol",
    "lane": "buddhist",
    "title": "Bardo Thödol (Liberation Through Hearing in the Intermediate State)",
    "titleOriginal": "Bar do thos grol chen mo",
    "dateText": "14th c. (terma revealed by Karma Lingpa, conventionally 1326–1386)",
    "sortYear": 1350,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Dakpo region, Tibet (Mount Gampodar)",
    "body": "A Nyingma funerary cycle within the 'Peaceful and Wrathful Deities' treasure teachings revealed by the fourteenth-century treasure-finder Karma Lingpa. Recited aloud to the dying and the dead, it describes the successive intermediate states (bardos) after death — the luminosity of dying, visions of peaceful and wrathful deities, and the search for rebirth — holding that recognition of these appearances as one's own mind liberates. Tradition ascribes its composition to Padmasambhava; scholarship situates it in Karma Lingpa's own era.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Bryan J. Cuevas, The Hidden History of the Tibetan Book of the Dead, 2003",
      "Gyurme Dorje (tr.), The Tibetan Book of the Dead: First Complete Translation, ed. Graham Coleman with Thupten Jinpa, 2005"
    ],
    "contested": {
      "flag": "Authorship: 8th-century concealment vs. 14th-century composition",
      "positions": [
        {
          "source": "Nyingma tradition (the terma framework)",
          "value": "composed by Padmasambhava in the 8th century, written down by Yeshe Tsogyal, hidden, and rediscovered by Karma Lingpa"
        },
        {
          "source": "Bryan J. Cuevas, The Hidden History of the Tibetan Book of the Dead, 2003",
          "value": "compiled and redacted in the fourteenth century within Karma Lingpa's milieu, drawing on older Nyingma materials"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "naqshbandi-order",
    "lane": "islamic",
    "title": "The Naqshbandi Order and Silent Dhikr",
    "titleOriginal": "Ṭarīqa Naqshbandiyya",
    "dateText": "14th c. (Bahāʾ al-Dīn Naqshband 1318–1389; silent dhikr traced to ʿAbd al-Khāliq Ghijduvānī, d. 1179)",
    "sortYear": 1350,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "institution",
    "place": "Bukhara, Central Asia",
    "body": "The Central Asian Khwajagan lineage, consolidated as the Naqshbandiyya around Baha al-Din Naqshband of Bukhara (1318–1389), distinguished itself by silent rather than vocal remembrance of God. Tradition credits Abd al-Khaliq Ghijduvani (d. 1179) with introducing the silent dhikr and eight of the order's eleven governing principles; Baha al-Din, who added three, held the silent form the stronger. The order paired inward concentration with strict Sharia observance and 'solitude within society' — contemplative discipline carried into ordinary commerce and company.",
    "technique": "Dhikr-i khafi: repetition of the divine name or the profession of faith silently in the heart, without movement of tongue or body, in some manuals coordinated with regulated or retained breath and directed toward subtle centers (lata'if) of the body — a practice its adherents anchor in Quranic injunctions to remembrance (Q 33:41). Documented from fourteenth-century Central Asian sources; described for study.",
    "label": "documented",
    "sources": [
      "Hamid Algar, 'The Naqshbandī Order: A Preliminary Survey of Its History and Significance', Studia Islamica 44 (1976)",
      "Shahzad Bashir, 'Movement and Stillness: The Practice of Sufi Dhikr in Fourteenth-Century Central Asia' (Matheson Trust paper, 2011)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "cloud-of-unknowing",
    "lane": "christian",
    "title": "The Cloud of Unknowing",
    "titleOriginal": "The Cloude of Unknowyng",
    "dateText": "c. 1375 (latter half of the 14th c.)",
    "sortYear": 1375,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "England (north-east Midlands, probable)",
    "body": "An anonymous English priest, probably of the north-east Midlands, wrote this Middle English guide to contemplation in the latter half of the fourteenth century. Addressed to a young solitary, it teaches that God 'may well be loved, but not thought': the contemplative stands beneath a 'cloud of unknowing' pierced only by love. The same author freely translated Pseudo-Dionysius' Mystical Theology into English as Deonise Hid Diuinite — an unprecedented vernacular rendering — making the work's apophatic debts explicit.",
    "technique": "The text tells its reader to press every created thought beneath a 'cloud of forgetting' and to reach toward God with a 'naked intent of love', optionally gathered into one short word — 'God' or 'love' — with which to 'beat upon' the cloud above. Described, never prescribed.",
    "label": "documented",
    "sources": [
      "Phyllis Hodgson (ed.), The Cloud of Unknowing and The Book of Privy Counselling, EETS 218 (1944); Deonise Hid Diuinite, EETS 231 (1955)",
      "A.C. Spearing (trans.), The Cloud of Unknowing and Other Works (Penguin, 2001)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "rasaratnasamuccaya",
    "lane": "tantra-rasa",
    "title": "Rasaratnasamuccaya",
    "titleOriginal": "Rasaratnasamuccaya",
    "dateText": "c. 13th–16th c. CE",
    "sortYear": 1400,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "India",
    "body": "The great systematic compendium of rasashastra: mercury and sulfur operations, mica and gem preparations, laboratory apparatus (yantras), and an opening roll-call of twenty-seven Rasa Siddhas. It is credited to a Vagbhata — necessarily a much later author than the seventh-century medical Vagbhata — while some manuscripts name Nityanatha or Ashvinikumara; dating proposals run from the thirteenth to the sixteenth century. Its metallic and mercurial medicines involve documented toxins; the text is studied as a monument of proto-chemistry.",
    "technique": "The compendium codifies alchemical laboratory practice: classified apparatus (dola, damaru, and other yantras), crucibles, heating grades (puta), and staged processing of mercury, sulfur, mica, and metals into medicinal bhasmas. Mercury, lead, and arsenic preparations described in it are documented toxins; the procedures are recorded for historical study only.",
    "label": "documented",
    "sources": [
      "G. J. Meulenbeld, A History of Indian Medical Literature, vol. IA (1999), pp. 391–593",
      "'Critical Review of Rasaratna Samuccaya: A Comprehensive Treatise of Indian Alchemy', Ancient Science of Life 36.1 (2016), 12–18 / PMC"
    ],
    "contested": {
      "flag": "Author identity and century of composition",
      "positions": [
        {
          "source": "internal referential evidence (e.g. Critical Review of Rasaratna Samuccaya, Ancient Science of Life, 2016)",
          "value": "13th century, by a later Vagbhata distinct from the 7th-century medical author"
        },
        {
          "source": "G. J. Meulenbeld, A History of Indian Medical Literature (1999–2002); manuscript colophons",
          "value": "possibly as late as the 16th century; some MSS attribute the work to Nityanatha or Ashvinikumara"
        }
      ]
    },
    "siteLink": {
      "href": "rasa.html",
      "label": "Rasashastra page"
    }
  },
  {
    "slug": "lamrim-chenmo",
    "lane": "buddhist",
    "title": "Lamrim Chenmo (Great Treatise on the Stages of the Path)",
    "titleOriginal": "Lam rim chen mo",
    "dateText": "1402",
    "sortYear": 1402,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Reting Monastery, Tibet",
    "body": "Tsongkhapa (1357–1419) completed this graded-path masterwork at Reting Monastery in 1402, taking its inspiration from Atiśa's eleventh-century Lamp for the Path to Enlightenment. It arranges the entire Buddhist path for practitioners of three capacities, ending in extended treatments of meditative serenity (śamatha) and insight (vipaśyanā), the latter a rigorous exposition of Madhyamaka emptiness. It became the doctrinal backbone of the Gelug school he founded.",
    "technique": "The treatise describes a sequenced curriculum: analytic contemplation of topics from the preciousness of human life to emptiness, the cultivation of single-pointed serenity through nine stages of attentional stability, and insight meditation applying Madhyamaka analysis within that stillness.",
    "label": "documented",
    "sources": [
      "Tsongkhapa, The Great Treatise on the Stages of the Path to Enlightenment, tr. Lamrim Chenmo Translation Committee (ed. Joshua Cutler, Guy Newland), 3 vols., 2000–2004",
      "Guy Newland, introduction to the Lamrim Chenmo translation, 2000"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "hathayogapradipika",
    "lane": "yoga-vedanta",
    "title": "Hathayogapradipika",
    "titleOriginal": "Haṭhapradīpikā / Haṭhayogapradīpikā",
    "dateText": "15th c. CE (earliest dated MS 1496)",
    "sortYear": 1425,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "India (region uncertain)",
    "body": "Svatmarama's 15th-century compendium, the classic manual of hatha yoga, compiled — often verbatim — from at least twenty earlier works, including texts descending from the Buddhist-born Amrtasiddhi. Its four chapters treat posture, breath retention, the mudras, and the meditative absorption they serve, presenting hatha as a ladder to raja yoga rather than its rival. The earliest dated manuscript is from 1496; through 19th- and 20th-century editions it became the most cited premodern authority on physical yoga.",
    "technique": "The text describes fifteen asanas, six cleansing acts, eight breath-retentions (kumbhakas), and ten mudras and locks intended to awaken kundalini and force breath into the central channel, culminating in concentration on internal sound (nadanusandhana) leading to samadhi.",
    "label": "documented",
    "sources": [
      "James Mallinson & Mark Singleton, Roots of Yoga (Penguin Classics, 2017)",
      "Wikipedia, 'Hatha Yoga Pradipika' (accessed 2026, citing Birch and Mallinson)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-plethon-florence",
    "lane": "confluence",
    "title": "Plethon at the Council of Florence",
    "titleOriginal": null,
    "dateText": "1438–1439",
    "sortYear": 1438,
    "sortYearEnd": 1439,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Ferrara and Florence",
    "body": "George Gemistos Plethon, the Byzantine Platonist, attended the council of church union at Ferrara and Florence in 1438–39 and there wrote De differentiis, contrasting Plato with Aristotle for Italian ears. Ficino's 1492 preface to Plotinus claims that Cosimo de' Medici, hearing Plethon speak 'like a second Plato', conceived the plan of a Platonic revival in Florence. Hankins has shown the founding-of-an-academy story to be retrospective: Cosimo's documented patronage of Ficino began only in 1462.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "James Hankins, 'Cosimo de' Medici and the \"Platonic Academy\"', Journal of the Warburg and Courtauld Institutes 53 (1990)",
      "C. M. Woodhouse, George Gemistos Plethon: The Last of the Hellenes (Oxford, 1986)"
    ],
    "contested": {
      "flag": "Whether Plethon's Florence lectures inspired Cosimo de' Medici to found a Platonic 'academy'",
      "positions": [
        {
          "source": "Marsilio Ficino, preface to his Plotinus translation (1492)",
          "value": "Cosimo, hearing Plethon at the council, conceived the idea of an academy and later charged Ficino with realising it"
        },
        {
          "source": "James Hankins, 'Cosimo de' Medici and the \"Platonic Academy\"', JWCI 53 (1990)",
          "value": "a retrospective myth: no contemporary evidence links Plethon to Cosimo's plans, and the 'Academy' was Ficino's informal circle, not a founded institution"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "shiva-samhita",
    "lane": "yoga-vedanta",
    "title": "Shiva Samhita",
    "titleOriginal": "Śivasaṃhitā",
    "dateText": "c. 1300–1500 (Mallinson) or 17th c. (older scholarship)",
    "sortYear": 1450,
    "sortYearEnd": null,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Varanasi or environs (per Mallinson)",
    "body": "An anonymous hatha compendium cast as Shiva's instruction to Parvati, blending Vedantic nondualism with tantric physiology — nadis, kundalini, chakras — and detailed mudra practice; it shares thirty-four verses with the Buddhist Amrtasiddhi. Mallinson's critical edition argues for composition in or around Varanasi before 1500, probably between 1300 and 1500, against older scholarship's 17th-century placement. It was among the first hatha texts rendered into English, shaping colonial-era ideas of yoga.",
    "technique": "The text describes seated breath practice joined to mantra, the raising of kundalini through postural locks and mudras such as yonimudra, and meditation on the chakras — presented as secret instruction conferring bodily perfection and liberation.",
    "label": "documented",
    "sources": [
      "James Mallinson, The Shiva Samhita: A Critical Edition and an English Translation (YogaVidya, 2007)",
      "Wikipedia, 'Shiva Samhita' (accessed 2026)"
    ],
    "contested": {
      "flag": "Date of composition",
      "positions": [
        {
          "source": "James Mallinson, The Shiva Samhita: A Critical Edition (2007)",
          "value": "pre-1500, probably c. 1300–1500, composed in or around Varanasi"
        },
        {
          "source": "Earlier scholarship (reported in the secondary literature)",
          "value": "17th or 18th century"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "event-ficino-1463",
    "lane": "confluence",
    "title": "Hermes before Plato: Ficino's 1463 translation",
    "titleOriginal": "Pimander (Mercurii Trismegisti liber de potestate et sapientia Dei)",
    "dateText": "translated 1463; printed Treviso 1471",
    "sortYear": 1463,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Florence; printed at Treviso",
    "body": "About 1460 the monk Leonardo of Pistoia brought Cosimo de' Medici a Greek manuscript containing fourteen treatises of the Corpus Hermeticum. Believing Hermes far older than Plato, Cosimo ordered Marsilio Ficino to set aside the Plato translation and render Hermes first; Ficino finished in April 1463. Printed at Treviso in 1471 under the title Pimander, the version ran through well over a dozen editions by the sixteenth century and set the 'ancient theology' at the centre of Renaissance thought.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Brian Copenhaver, Hermetica (Cambridge, 1992), introduction",
      "Sebastiano Gentile & Carlos Gilly, Marsilio Ficino e il ritorno di Ermete Trismegisto (1999)",
      "Brandeis University Special Collections essay on the 1471 Pimander"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "The Hermetica on the Workbench"
    }
  },
  {
    "slug": "compound-of-alchymie",
    "lane": "alchemy-west",
    "title": "The Compound of Alchymie (George Ripley)",
    "titleOriginal": "The Compound of Alchymie, or the Twelve Gates",
    "dateText": "1471 (printed in Ashmole's Theatrum, 1652)",
    "sortYear": 1471,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Bridlington, Yorkshire, England",
    "body": "George Ripley, canon of Bridlington, composed his English verse Compound of Alchymie in 1471, dedicating it to King Edward IV. Its twelve 'gates' — calcination through projection — organize the work of the philosophers' stone as a sequence of operations, drawing heavily on pseudo-Lullian doctrine. Elias Ashmole printed it in his Theatrum Chemicum Britannicum (1652), and Ripley's recipes were mined by readers down to Isaac Newton, as Jennifer Rampling's study of English alchemy has shown.",
    "technique": "A twelve-stage poetic itinerary of the opus; Rampling shows its practical basis in 'sericon' — red lead dissolved in vinegar to yield a 'vegetable mercury'. Lead compounds are toxic; the recipe is preserved as history, not instruction.",
    "label": "documented",
    "sources": [
      "Jennifer M. Rampling, The Experimental Fire: Inventing English Alchemy, 1300–1700, 2020",
      "Elias Ashmole, Theatrum Chemicum Britannicum, 1652"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-pico-1486",
    "lane": "confluence",
    "title": "Pico's 900 Conclusions: Kabbalah enters the Christian synthesis",
    "titleOriginal": "Conclusiones nongentae",
    "dateText": "published Rome, 7 December 1486",
    "sortYear": 1486,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Rome (printed by Eucharius Silber)",
    "body": "On 7 December 1486 the Roman printer Eucharius Silber issued Giovanni Pico della Mirandola's nine hundred Conclusiones, offered for public disputation — among them dozens of kabbalistic theses, the first substantial entry of Jewish Kabbalah into a Christian philosophical program. Behind them stood Flavius Mithridates, the Sicilian convert who translated thousands of folios of kabbalistic literature into Latin for Pico; Wirszubski identified these versions as the theses' likeliest sources. Innocent VIII suspended the disputation and condemned thirteen theses in 1487.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Chaim Wirszubski, Pico della Mirandola's Encounter with Jewish Mysticism (Harvard, 1989)",
      "S. A. Farmer, Syncretism in the West: Pico's 900 Theses (1486) (MRTS, 1998)",
      "'Giovanni Pico della Mirandola', Stanford Encyclopedia of Philosophy"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Kabbalah on the Workbench"
    }
  },
  {
    "slug": "pico-conclusions",
    "lane": "kabbalah",
    "title": "Pico della Mirandola, 900 Conclusions",
    "titleOriginal": "Conclusiones nongentae",
    "dateText": "Rome, December 1486; condemned 1487",
    "sortYear": 1486,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Rome",
    "body": "Giovanni Pico della Mirandola published nine hundred theses at Rome in December 1486, inviting all comers to dispute them. Among them were the first kabbalistic theses ever printed, drawn from Hebrew texts Latinized for him — often tendentiously — by the convert Flavius Mithridates. Pico argued that Kabbalah, properly read, confirmed the divinity of Christ, inaugurating Christian Cabala's systematic re-reading of Jewish sources for Christological ends. Innocent VIII condemned thirteen theses in 1487, then denounced the whole collection by bull of 4 August 1487.",
    "technique": null,
    "label": "documented",
    "sources": [
      "S. A. Farmer, Syncretism in the West: Pico's 900 Theses (1998)",
      "Stanford Encyclopedia of Philosophy, 'Giovanni Pico della Mirandola'",
      "Editio princeps: Rome, Eucharius Silber, December 1486"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-paracelsus",
    "lane": "alchemy-west",
    "title": "Paracelsus",
    "titleOriginal": "Theophrastus Bombastus von Hohenheim",
    "dateText": "1493–1541",
    "sortYear": 1493,
    "sortYearEnd": 1541,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Einsiedeln, Swiss Confederation (itinerant)",
    "body": "Theophrastus von Hohenheim, called Paracelsus (1493–1541), redirected alchemy from gold-making toward medicine: the body as a chemical system, disease treated with chemically prepared remedies (iatrochemistry), and matter analyzed into the tria prima of salt, sulfur, and mercury alongside the old four elements. His 'spagyric' pharmacy separated and recombined a substance's principles. His mineral remedies — mercury for syphilis, antimony preparations — were as toxic as they were influential, and his dictum that 'the dose makes the poison' seeded toxicology.",
    "technique": "Spagyric preparation: separating a substance into salt, sulfur, and mercury principles by distillation and calcination, then recombining the purified parts as medicine — a historical procedure employing poisonous metals such as mercury and antimony, described for study only.",
    "label": "documented",
    "sources": [
      "Walter Pagel, Paracelsus: An Introduction to Philosophical Medicine in the Era of the Renaissance, 1958",
      "Charles Webster, Paracelsus: Medicine, Magic and Mission at the End of Time, 2008"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "de-arte-cabalistica",
    "lane": "kabbalah",
    "title": "Reuchlin, De Arte Cabalistica",
    "titleOriginal": "De arte cabalistica libri tres",
    "dateText": "Hagenau, 1517",
    "sortYear": 1517,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Hagenau, Alsace",
    "body": "Johann Reuchlin's three-book Latin dialogue, printed at Hagenau in 1517 and dedicated to Pope Leo X, was the first substantial Latin exposition of Kabbalah by a Christian Hebraist. Drawing on Gikatilla's Sha'arei Orah and Ginnat Egoz and harmonizing Kabbalah with Pythagorean philosophy, Reuchlin — like Pico before him — read Jewish sources as prefiguring Christian doctrine; his earlier De Verbo Mirifico (1494) had already argued that the name of Jesus (the pentagrammaton YHSVH) was the unpronounceable Tetragrammaton made pronounceable. The work appeared while Reuchlin was defending Hebrew books against the confiscation campaign begun by Johannes Pfefferkorn.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Johann Reuchlin, De arte cabalistica (Hagenau: Anshelm, 1517)",
      "Martin & Sarah Goodman (trans.), On the Art of the Kabbalah (1983)",
      "Reuchlin, Sämtliche Werke II,1 (frommann-holzboog critical edition)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "splendor-solis",
    "lane": "alchemy-west",
    "title": "Splendor Solis",
    "titleOriginal": "Splendor Solis",
    "dateText": "earliest dated ms 1532–1535 (Berlin); Harley ms 1582 (London)",
    "sortYear": 1532,
    "sortYearEnd": 1582,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Augsburg, Germany",
    "body": "The most sumptuous of illuminated alchemical manuscripts, attributed to the legendary Salomon Trismosin. The earliest dated copy (Berlin, Kupferstichkabinett, 1532–35) and the celebrated London manuscript (British Library Harley 3469, dated 1582) frame twenty-two full-page paintings — the drowning and rising sun, the peacock's tail, kings, queens, and bathing figures — that narrate the Great Work as visual allegory. Roughly twenty copies survive; Jörg Völlnagel's study traces the sequence to Augsburg workshops.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Jörg Völlnagel, Splendor Solis oder Sonnenglanz: Studien zu einer alchemistischen Bilderhandschrift, 2004",
      "British Library, Harley MS 3469 (catalogue description)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "de-occulta-philosophia",
    "lane": "confluence",
    "title": "Agrippa's Three Books of Occult Philosophy",
    "titleOriginal": "De occulta philosophia libri tres",
    "dateText": "Book I printed 1531; complete edition Cologne 1533 (drafted c. 1510)",
    "sortYear": 1533,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Antwerp; Cologne",
    "body": "Agrippa drafted his three books by 1510 and sent them to Trithemius, then rewrote the whole for print: Book I appeared in 1531, and the complete work at Cologne in 1533 from Johannes Soter's press, over the Dominican inquisitor Conrad Köllin's objections. The book fuses Ficino's natural magic, Pico's and Reuchlin's Christian Kabbalah, the Hermetica, and Arabic astral magic drawn from the Picatrix into one three-world system — the great Renaissance synthesis of the occult sciences in a single book.",
    "technique": "The work catalogues, without demonstrated efficacy, the procedures of learned magic: numerical magic squares of the seven planets, seals and characters, permutations of Hebrew divine names, and rites of natural, celestial and ceremonial magic, arranged as an ascent through the elemental, celestial and intellectual worlds.",
    "label": "documented",
    "sources": [
      "Vittoria Perrone Compagni (ed.), Cornelius Agrippa: De occulta philosophia libri tres (Brill, 1992)",
      "'Heinrich Cornelius Agrippa von Nettesheim', Stanford Encyclopedia of Philosophy",
      "Christopher Lehrich, The Language of Demons and Angels (Brill, 2003)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/agrippa.html",
      "label": "Agrippa on the Workbench"
    }
  },
  {
    "slug": "pardes-rimmonim",
    "lane": "kabbalah",
    "title": "Cordovero, Pardes Rimmonim",
    "titleOriginal": "פרדס רמונים",
    "dateText": "written Safed 1548; first extant printing Kraków/Nowy Dwór 1591",
    "sortYear": 1548,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Safed, Galilee",
    "body": "Moses Cordovero completed this 'Orchard of Pomegranates' at Safed in 1548, in his twenties: the first comprehensive, quasi-philosophical systematization of kabbalistic doctrine, arranged in thirty-two gates that reconcile the Zohar's scattered symbolism into a coherent account of the sefirot as vessels and instruments of the divine essence. A Salonika printing of 1584 is reported in bibliographies but no copy survives; the extant first edition was produced by Isaac Prostitz at Kraków and Nowy Dwór in 1591.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Eugene D. Matanky, 'Picturing the Tetragrammaton', IMAGES 15 (2022)",
      "Sotheby's Important Judaica catalogue (2009), lot 127: Pardes Rimmonim, Cracow/Nowy Dwór 1591",
      "Encyclopaedia Judaica, 'Cordovero, Moses'"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "spiritual-exercises",
    "lane": "christian",
    "title": "Spiritual Exercises (Ignatius of Loyola)",
    "titleOriginal": "Exercitia spiritualia",
    "dateText": "composed from 1522 (Manresa); first printed Rome 1548",
    "sortYear": 1548,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Manresa; printed Rome",
    "body": "Ignatius of Loyola drafted the core of the Exercises during his convalescent conversion and retreat at Manresa (1522) and revised it over two decades; the Latin text was printed at Rome in 1548 with Paul III's approval. Not a book to be read through but a director's manual for a roughly thirty-day retreat organized in four 'weeks', it became the formative instrument of the Jesuit order and the template for modern Catholic retreat practice.",
    "technique": "The manual directs a retreatant, under a director, through structured meditations: 'composition of place' (imaginatively entering a Gospel scene with all five senses), colloquies, rules for the discernment of spirits, and the twice-daily examen — a systematic review of the day's interior movements of consolation and desolation. Historical description of the method.",
    "label": "documented",
    "sources": [
      "George E. Ganss (trans.), The Spiritual Exercises of Saint Ignatius (Loyola Press, 1992)",
      "John W. O'Malley, The First Jesuits (Harvard, 1993)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-isaac-luria",
    "lane": "kabbalah",
    "title": "Isaac Luria (the Ari) of Safed",
    "titleOriginal": null,
    "dateText": "1534–1572; taught at Safed 1570–72",
    "sortYear": 1553,
    "sortYearEnd": 1572,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Jerusalem, Egypt, Safed",
    "body": "The Ari ('Lion') of Safed taught for barely two years before dying in an epidemic in 1572, and wrote almost nothing, yet his oral teaching remade Kabbalah: tsimtsum (God's self-contraction to make room for creation), the shattering of the vessels, and tikkun, the human work of cosmic repair. Lawrence Fine's studies reconstruct his fellowship's practices — grave prostrations, soul-diagnosis, assigned unifications — from the records of his disciples, above all Hayyim Vital, whose manuscripts became the movement's canon.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Lawrence Fine, Physician of the Soul, Healer of the Cosmos: Isaac Luria and His Kabbalistic Fellowship (2003)",
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lecture 7"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "monas-hieroglyphica",
    "lane": "confluence",
    "title": "John Dee's Monas Hieroglyphica",
    "titleOriginal": "Monas Hieroglyphica",
    "dateText": "Antwerp, 1564",
    "sortYear": 1564,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Antwerp (press of Willem Silvius)",
    "body": "John Dee wrote the Monas Hieroglyphica in twelve days of January 1564 while lodging with the Antwerp printer Willem Silvius, who published it that year with a dedication to Maximilian II — styled on the title page King of the Romans, of Bohemia and of Hungary; he succeeded as emperor only that July. In twenty-four 'theorems' Dee expounds a single composite glyph — Moon, Sun, the elemental cross, and the sign of Aries — as a cipher claimed to unite astronomy, alchemy, geometry and number. Contemporaries already found it deliberately obscure; Dee wrote that the vulgar would not understand it.",
    "technique": "The book proceeds by geometrical construction and exegesis of one emblem rather than by recipe: each 'theorem' derives cosmological and alchemical meanings from the glyph's parts, a symbolic method Clucas and others describe as diagrammatic alchemy. No practical procedure, and no demonstrated validity, attaches to it.",
    "label": "documented",
    "sources": [
      "C. H. Josten, 'A Translation of John Dee's Monas Hieroglyphica (Antwerp, 1564)', Ambix 12 (1964)",
      "Stephen Clucas, 'The Royal Typographer and the Alchemist: John Dee, Willem Silvius, and the Diagrammatic Alchemy of the Monas Hieroglyphica', Ambix 64 (2017)",
      "Nicholas Clulee, John Dee's Natural Philosophy (Routledge, 1988)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/dee.html",
      "label": "John Dee on the Workbench"
    }
  },
  {
    "slug": "interior-castle",
    "lane": "christian",
    "title": "The Interior Castle (Teresa of Avila)",
    "titleOriginal": "El Castillo Interior / Las Moradas",
    "dateText": "written June–November 1577; printed 1588",
    "sortYear": 1577,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Toledo and Avila, Castile",
    "body": "Teresa of Avila wrote El Castillo Interior (Las Moradas) between 2 June and 29 November 1577, under obedience and amid the persecution of her Carmelite reform. It figures the soul as a crystal castle of seven suites of dwelling-places, from the outer rooms of self-knowledge to the innermost chamber of mystical marriage. First printed in 1588 among her collected works, it became the classic Spanish map of the graded contemplative life and a touchstone for later psychology of mysticism.",
    "technique": "Teresa distinguishes the active recollection and vocal-mental prayer of the outer dwellings from the passive 'prayer of quiet' and 'prayer of union' of the inner ones — states she describes as given rather than achieved, and verifiable, she insists, chiefly by their fruits in humility and charity. Descriptive mapping, not a method taught here.",
    "label": "documented",
    "sources": [
      "Kieran Kavanaugh & Otilio Rodriguez (trans.), The Collected Works of St. Teresa of Avila, vol. 2 (ICS Publications, 1980)",
      "Rowan Williams, Teresa of Avila (Continuum, 1991)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "shatchakranirupana",
    "lane": "tantra-rasa",
    "title": "Shatchakranirupana",
    "titleOriginal": "Ṣaṭcakranirūpaṇa",
    "dateText": "1577 CE (Shaka 1499)",
    "sortYear": 1577,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Bengal",
    "body": "The 'Description of the Six Centres': the sixth chapter of Purnananda's Shri-tattva-chintamani, whose colophon dates the work to Shaka 1499 (1577 CE); some catalogues round to c. 1550. This late Bengali synthesis fixed the now-familiar scheme of six chakras plus the sahasrara, each with lotus petals, seed-syllables, and deities. Through Woodroffe's 1919 translation it became, almost by accident of selection, the single most influential source for the Western idea of the chakras.",
    "technique": "The text describes kundalini yoga as its tradition conceived it: visualization of the six chakras along the central sushumna channel with their petals, letters, and resident deities, and the arousal of kundalini from the muladhara to union in the sahasrara — a sixteenth-century contemplative map, described here historically.",
    "label": "documented",
    "sources": [
      "Arthur Avalon (Sir John Woodroffe), The Serpent Power (Luzac & Co., 1919), preface",
      "Motilal Banarsidass / Wisdom Library editions of the Ṣaṭcakranirūpaṇa"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "etz-hayyim",
    "lane": "kabbalah",
    "title": "Vital, Etz Hayyim (Tree of Life)",
    "titleOriginal": "עץ חיים",
    "dateText": "compiled c. 1573–1592; first printed Korets 1782",
    "sortYear": 1582,
    "sortYearEnd": 1592,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Safed and Damascus",
    "body": "Hayyim Vital's vast redaction of Isaac Luria's oral teaching, compiled over roughly two decades after the master's death in 1572 and guarded in manuscript by rival custodians for more than a century; it was first printed at Korets in 1782, in the recension arranged by Meir Poppers (Derekh Etz Hayyim). The rival eight-part recension edited by Vital's son Shmuel, the Shemonah She'arim, reached print only in Jerusalem in 1863–98. The work expounds the Lurianic drama — tsimtsum, the breaking of the vessels, tikkun — that became the dominant idiom of later Kabbalah and the theoretical basis of its meditative prayer.",
    "technique": "Lurianic practice as recorded by Vital centered on kavvanot — precise meditative intentions mapping each word of the liturgy onto configurations of divine names — and yihudim, mental 'unifications' of divine names, sometimes performed while prostrated on the graves of saints. A documented discipline of the Safed fellowship, described for study.",
    "label": "documented",
    "sources": [
      "Encyclopaedia Britannica, 'Etz hayyim (work by Vital)'",
      "Lawrence Fine, Physician of the Soul, Healer of the Cosmos (2003)",
      "First printing: Korets, 1782 (Meir Poppers' recension)"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "event-dee-angelic-conversations",
    "lane": "confluence",
    "title": "Dee and Kelley's angelic conversations",
    "titleOriginal": null,
    "dateText": "1582–1589 (published by Casaubon, 1659)",
    "sortYear": 1582,
    "sortYearEnd": 1589,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Mortlake; Kraków; Prague and Třeboň, Bohemia",
    "body": "From 1582 John Dee, with the scryer Edward Kelley, conducted 'actions' in which Kelley reported visions in a shew-stone and Dee transcribed — sessions continuing through their travels in Poland and Bohemia until the partnership dissolved in 1589. The manuscript records survive in the Sloane and Cotton collections and include the letter-tables of the 'Enochian' language; Méric Casaubon printed a large portion in 1659 as A True & Faithful Relation. The diaries are documented; nothing the angels reportedly said was ever validated.",
    "technique": "The records describe a two-person scrying procedure: the seer gazed into a crystal 'shew-stone' and reported visions and dictated letter-squares, while Dee questioned, transcribed, and compiled the resulting 'Enochian' tables. The procedure is documented in the diaries as practised; its claims were never demonstrated.",
    "label": "documented",
    "sources": [
      "Méric Casaubon (ed.), A True & Faithful Relation of What Passed for Many Yeers Between Dr. John Dee ... and Some Spirits (London, 1659)",
      "Deborah Harkness, John Dee's Conversations with Angels (Cambridge, 1999)",
      "Nicholas Clulee, John Dee's Natural Philosophy (Routledge, 1988)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/dee.html",
      "label": "John Dee on the Workbench"
    }
  },
  {
    "slug": "dark-night-of-the-soul",
    "lane": "christian",
    "title": "Dark Night of the Soul (John of the Cross)",
    "titleOriginal": "Noche oscura del alma",
    "dateText": "poem 1578; commentaries c. 1584–1586, unfinished at his death 1591",
    "sortYear": 1584,
    "sortYearEnd": 1591,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Toledo; Granada",
    "body": "John of the Cross composed the poem 'En una noche oscura' in or shortly after his 1578 escape from nine months' imprisonment in Toledo; his prose commentaries The Ascent of Mount Carmel and The Dark Night (first redaction 1584, expanded c. 1585–86, unfinished at his death in 1591) expound its opening stanzas. The 'dark night' names the passive purgations — first of sense, then of spirit — through which, he writes, God weans the soul from consolation toward union.",
    "technique": "The commentary specifies three signs for leaving discursive meditation — inability to meditate as before, no inclination to fix the imagination elsewhere, and a loving general attentiveness to God — after which the soul is described as passing into contemplation received rather than produced. Reported as John describes it.",
    "label": "documented",
    "sources": [
      "Kieran Kavanaugh & Otilio Rodriguez (trans.), The Collected Works of St. John of the Cross (ICS Publications, 1991)",
      "Colin Thompson, St John of the Cross: Songs in the Night (SPCK, 2002)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-casaubon-1614",
    "lane": "confluence",
    "title": "Casaubon redates the Hermetica",
    "titleOriginal": "De rebus sacris et ecclesiasticis exercitationes XVI",
    "dateText": "1614",
    "sortYear": 1614,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "London",
    "body": "In the course of a polemic against Baronio's Annales, the Huguenot philologist Isaac Casaubon subjected the Greek of the Hermetic treatises to linguistic analysis, showing vocabulary, syntax and doctrine of the early Common Era rather than remote Egyptian antiquity. The demonstration deflated the prisca theologia that had authorized Renaissance Hermetism since Ficino. It discredited the dating, not the texts themselves, which continued to circulate and be studied. Grafton's account made the episode a touchstone of critical philology.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Anthony Grafton, \"Protestant versus Prophet: Isaac Casaubon on Hermes Trismegistus\", Journal of the Warburg and Courtauld Institutes 46 (1983)",
      "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964), ch. 21",
      "Isaac Casaubon, De rebus sacris et ecclesiasticis exercitationes XVI (London, 1614)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "fama-fraternitatis",
    "lane": "alchemy-west",
    "title": "Fama Fraternitatis",
    "titleOriginal": "Fama Fraternitatis, deß Löblichen Ordens des Rosenkreutzes",
    "dateText": "printed 1614, Kassel",
    "sortYear": 1614,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Kassel, Germany",
    "body": "Printed at Kassel in 1614 after years of manuscript circulation, the Fama announces a hidden brotherhood founded by 'Christian Rosenkreuz' (1378–1484), whose intact tomb, rediscovered in 1604, heralds a general reformation of learning. Rosenkreuz and his fraternity are fiction — a 'ludibrium', in Johann Valentin Andreae's later word — issuing from Andreae's Tübingen circle; but the fiction was productive, drawing some four hundred printed responses within a decade, the 'Rosicrucian furore'.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972",
      "Christopher McIntosh, The Rosicrucians: The History, Mythology, and Rituals of an Esoteric Order, 1997"
    ],
    "contested": {
      "flag": "Authorship of the Fama within the Tübingen circle",
      "positions": [
        {
          "source": "J. W. Montgomery, Cross and Crucible, 1973; Roland Edighoffer",
          "value": "Johann Valentin Andreae as principal author"
        },
        {
          "source": "Carlos Gilly (Cimelia Rhodostaurotica, 1995)",
          "value": "a collective product of the Tübingen circle around Tobias Hess, with Andreae one hand among several"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "confessio-fraternitatis",
    "lane": "alchemy-west",
    "title": "Confessio Fraternitatis",
    "titleOriginal": "Confessio Fraternitatis R.C. ad Eruditos Europae",
    "dateText": "printed 1615, Kassel",
    "sortYear": 1615,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Kassel, Germany",
    "body": "The second Rosicrucian manifesto, issued in Latin at Kassel in 1615, confirms the brotherhood announced in the Fama and sharpens its program: polemic against the pope and against gold-hungry pseudo-alchemists, millenarian readings of the new stars of 1604, and the promise that the fraternity's knowledge will renew learning before the end of the age. Like the Fama it is anonymous, a product of the same Tübingen circle, describing a society that did not exist while summoning real readers to reform.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972",
      "Christopher McIntosh, The Rosicrucians, 1997"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "chymical-wedding",
    "lane": "alchemy-west",
    "title": "The Chymical Wedding of Christian Rosenkreutz",
    "titleOriginal": "Chymische Hochzeit Christiani Rosencreutz anno 1459",
    "dateText": "printed 1616, Strasbourg",
    "sortYear": 1616,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Strasbourg",
    "body": "Published at Strasbourg in 1616, the Chymical Wedding is a seven-day allegorical romance: the aged Christian Rosenkreutz, summoned to a royal wedding in a marvel-filled castle, witnesses the beheading and alchemical resurrection of kings and queens. Johann Valentin Andreae later acknowledged writing it in his youth — a 'ludibrium', he called it — making it the only Rosicrucian manifesto with an admitted author. Readers have taken it variously as satire, serious Lutheran allegory, and the finest alchemical fiction of its age.",
    "technique": null,
    "label": "documented",
    "sources": [
      "John Warwick Montgomery, Cross and Crucible: Johann Valentin Andreae, 1973",
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "atalanta-fugiens",
    "lane": "alchemy-west",
    "title": "Atalanta Fugiens (Michael Maier)",
    "titleOriginal": "Atalanta fugiens, hoc est Emblemata nova de secretis naturae chymica",
    "dateText": "1617 (some issues dated 1618), Oppenheim",
    "sortYear": 1617,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Oppenheim (press of Johann Theodor de Bry)",
    "body": "Michael Maier's Atalanta fugiens (Oppenheim: de Bry, 1617) sets fifty alchemical emblems, each comprising an engraving by Matthäus Merian, an epigram, a prose discourse, and a three-voice fugue — Atalanta the fleeing voice, Hippomenes pursuing, the golden apple delaying — making it an early multimedia book. Maier, physician to Emperor Rudolf II and an apologist for the Rosicrucians, recast Ovid's race as the chase and union of philosophical mercury and sulfur. H. M. E. de Jong's 1969 monograph traces its sources.",
    "technique": null,
    "label": "documented",
    "sources": [
      "H. M. E. de Jong, Michael Maier's Atalanta Fugiens: Sources of an Alchemical Book of Emblems, 1969",
      "Hereward Tilton, The Quest for the Phoenix: Spiritual Alchemy and Rosicrucianism in the Work of Count Michael Maier, 2003"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-newton-alchemy",
    "lane": "alchemy-west",
    "title": "Isaac Newton's alchemical manuscripts",
    "titleOriginal": null,
    "dateText": "Newton 1642–1727; mss c. 1660s–1690s; Sotheby's sale July 1936",
    "sortYear": 1642,
    "sortYearEnd": 1727,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Cambridge, England",
    "body": "Isaac Newton (1642–1727) left roughly a million words on alchemy — reading notes, indexes, and laboratory records spanning the 1660s to the 1690s, kept private in his lifetime. Dispersed at the Sotheby's sale of the Portsmouth papers on 13–14 July 1936, the alchemical manuscripts were largely reassembled by John Maynard Keynes, who bequeathed them to King's College, Cambridge, in 1946 and pronounced Newton 'not the first of the age of reason' but 'the last of the magicians'. Dobbs and Newman have since integrated the alchemy into Newton's science.",
    "technique": null,
    "label": "documented",
    "sources": [
      "B. J. T. Dobbs, The Foundations of Newton's Alchemy, 1975",
      "B. J. T. Dobbs, The Janus Faces of Genius: The Role of Alchemy in Newton's Thought, 1991",
      "William R. Newman, Newton the Alchemist: Science, Enigma, and the Quest for Nature's 'Secret Fire', 2019",
      "J. M. Keynes, 'Newton, the Man', in Newton Tercentenary Celebrations, 1947"
    ],
    "contested": {
      "flag": "What Newton's alchemy meant for his science and religion",
      "positions": [
        {
          "source": "B. J. T. Dobbs, The Janus Faces of Genius, 1991",
          "value": "Newton's alchemy was at root a religious quest — the alchemical 'vegetable spirit' as God's activity in matter, unifying his thought"
        },
        {
          "source": "William R. Newman, Newton the Alchemist, 2019",
          "value": "Newton's alchemy was disciplined experimental chymistry pursued for natural-philosophical and practical ends, not chiefly a religious exercise"
        }
      ]
    },
    "siteLink": {
      "href": "greatworks/index.html",
      "label": "The Great Works wing"
    }
  },
  {
    "slug": "oedipus-aegyptiacus",
    "lane": "confluence",
    "title": "Oedipus Aegyptiacus",
    "titleOriginal": "Oedipus Aegyptiacus",
    "dateText": "1652–54",
    "sortYear": 1652,
    "sortYearEnd": 1654,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Rome",
    "body": "Athanasius Kircher's three-volume \"Egyptian Oedipus\", printed in Rome with imperial patronage, claimed to decipher the hieroglyphs as symbols of a Hermetic wisdom concordant with Chaldean, Hebrew and Christian truth. Written a generation after Casaubon's redating, it perpetuated the Hermetic frame regardless. The translations were fantasies — Champollion's decipherment in the 1820s showed the signs largely phonetic — yet the book's erudition, engravings and comparative ambition shaped European images of Egypt for over a century. Stolzenberg's Egyptian Oedipus is the standard study.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Daniel Stolzenberg, Egyptian Oedipus: Athanasius Kircher and the Secrets of Antiquity (Chicago, 2013)",
      "Athanasius Kircher, Oedipus Aegyptiacus, 3 vols (Rome, 1652–54)",
      "Joscelyn Godwin, Athanasius Kircher: A Renaissance Man and the Quest for Lost Knowledge (1979)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "sirr-i-akbar",
    "lane": "confluence",
    "title": "Sirr-i-Akbar — fifty Upanishads in Persian",
    "titleOriginal": "Sirr-i-Akbar",
    "dateText": "1657",
    "sortYear": 1657,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Delhi / Varanasi",
    "body": "The Mughal prince Dara Shikoh, working with pandits of Banaras, rendered fifty Upanishads into Persian as Sirr-i-Akbar, \"The Greatest Secret,\" identifying them with the \"hidden book\" mentioned in the Quran. Completed in 1657, two years before his execution in the succession war with Aurangzeb, the version carried Sanskrit metaphysics into the Persianate world — and, through the manuscript Anquetil-Duperron later obtained, became Europe's first substantial conduit to Upanishadic thought.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Supriya Gandhi, The Emperor Who Never Was: Dara Shukoh in Mughal India (Harvard, 2020)",
      "Urs App, The Birth of Orientalism (Pennsylvania, 2010)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-sabbatai-zevi-1666",
    "lane": "kabbalah",
    "title": "The Sabbatian messianic movement",
    "titleOriginal": null,
    "dateText": "1665–66; conversion 16 September 1666",
    "sortYear": 1666,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Gaza, Smyrna, Istanbul",
    "body": "In May 1665 the young Lurianic kabbalist Nathan of Gaza proclaimed Sabbatai Zevi, a Smyrna-born mystic of unstable temperament, the Messiah; the announcement ignited the largest messianic movement in post-Temple Jewish history, convulsing communities from Yemen to Amsterdam. Detained by the Ottoman authorities, Sabbatai converted to Islam on 16 September 1666, shattering most followers' faith while driving a heretical remnant underground. Scholem's monumental study argued the movement's power flowed from Lurianic Kabbalah's messianic charge — an interpretation itself much debated since.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Gershom Scholem, Sabbatai Ṣevi: The Mystical Messiah (English 1973)",
      "Encyclopedia.com, 'Shabbetai Tzevi (1626–1676)'"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "mutus-liber",
    "lane": "alchemy-west",
    "title": "Mutus Liber",
    "titleOriginal": "Mutus Liber",
    "dateText": "printed 1677, La Rochelle",
    "sortYear": 1677,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "La Rochelle, France",
    "body": "The 'wordless book', printed at La Rochelle in 1677 under the anagrammatic name 'Altus', narrates the whole Great Work in fifteen engraved plates almost without text: a sleeping alchemist, angels on Jacob's ladder, and a husband-and-wife pair gathering dew in fields and working it through laboratory vessels. The royal printing privilege of 1676 names Jacob Saulat, sieur des Marez; Jean Flouret argued in 1976 for the La Rochelle apothecary Isaac Baulot. Its eloquent silence made it a favorite of later esoteric interpreters.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Jean Flouret, 'À propos de l'auteur du Mutus Liber', Revue française d'histoire du livre 11, 1976",
      "Jacques van Lennep, Alchimie: contribution à l'histoire de l'art alchimique, 1985"
    ],
    "contested": {
      "flag": "Identity of 'Altus', the author behind the anagram",
      "positions": [
        {
          "source": "Royal printing privilege of 23 November 1676",
          "value": "Jacob Saulat (Sulat), sieur des Marez"
        },
        {
          "source": "Jean Flouret, Revue française d'histoire du livre, 1976",
          "value": "Isaac Baulot, apothecary of La Rochelle"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "kabbala-denudata",
    "lane": "kabbalah",
    "title": "Knorr von Rosenroth, Kabbala Denudata",
    "titleOriginal": "Kabbala denudata, seu doctrina Hebraeorum transcendentalis",
    "dateText": "Sulzbach 1677–78; Frankfurt 1684",
    "sortYear": 1680,
    "sortYearEnd": 1684,
    "dateCertainty": "range",
    "kind": "translation",
    "place": "Sulzbach and Frankfurt am Main",
    "body": "Christian Knorr von Rosenroth's two-volume Latin anthology (Sulzbach, Abraham Lichtenthaler, 1677–78; Frankfurt, Johann David Zunner, 1684) — 'the Kabbalah Uncovered' — gave Christian Europe its largest window into Jewish Kabbalah before the nineteenth century: translations of Zoharic tractates, a kabbalistic lexicon, and expositions of Lurianic doctrine. Compiled with the Cambridge Platonist Henry More among its interlocutors, and framed by the Christian hope that Kabbalah would lead Jews to conversion, it remained the standard non-Hebrew source for two centuries.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Christian Knorr von Rosenroth, Kabbala denudata (Sulzbach 1677–78; Frankfurt 1684)",
      "Encyclopaedia Judaica, 'Knorr von Rosenroth, Christian'",
      "Zutot 22:1 (2025), 'Kabbala Denudata and Christian Knorr von Rosenroth's Approach to the Zohar'",
      "Allison Coudert, The Impact of the Kabbalah in the Seventeenth Century (Brill, 1999)",
      "Christian Knorr von Rosenroth, Kabbala Denudata (Sulzbach 1677–78; Frankfurt 1684)",
      "S. L. MacGregor Mathers, The Kabbalah Unveiled (London: Redway, 1887)"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "secret-of-the-golden-flower",
    "lane": "daoist",
    "title": "The Secret of the Golden Flower (Taiyi jinhua zongzhi)",
    "titleOriginal": "太乙金華宗旨",
    "dateText": "late 17th c.; transmitted by spirit-writing c. 1668–1692",
    "sortYear": 1680,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Changzhou (Piling) region, Jiangsu, Qing China",
    "body": "A concise neidan meditation manual attributed by its transmitters to the immortal Lü Dongbin, received through spirit-writing (fuji). Scholarship — notably the studies of Mori Yuria and Monica Esposito — locates its actual origin in a late-seventeenth-century Qing spirit-writing cult of Patriarch Lü around Changzhou (Piling): its own prefaces date the transmissions to 1668–1692, and the earliest extant versions are preserved in later compilations linked to the Longmen branch of Quanzhen, one carrying prefaces dated 1692 as a chapter of Shao Zhilin's Lüzu quanshu. The Lü Dongbin attribution is legendary; the text itself, teaching the circulation of inner light, became the most famous Daoist meditation work in the West.",
    "technique": "The text instructs its adept in 'turning the light around' (huiguang): reversing attention back upon the source of awareness itself, combined with quiet natural breathing, so that the 'light' circulates and, in the text's alchemical idiom, crystallizes as the 'golden flower' — a symbolic, not physiological, description.",
    "label": "documented",
    "sources": [
      "Mori Yuria, 'Identity and Lineage: The Taiyi jinhua zongzhi and the Spirit-Writing Cult of Patriarch Lü in Qing China', in Livia Kohn and Harold D. Roth (eds.), Daoist Identity, University of Hawai'i Press, 2002",
      "Thomas Cleary, The Secret of the Golden Flower: The Classic Chinese Book of Life, HarperCollins, 1991"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "confucius-sinarum-philosophus",
    "lane": "confluence",
    "title": "Confucius Sinarum Philosophus",
    "titleOriginal": "Confucius Sinarum Philosophus, sive Scientia Sinensis latine exposita",
    "dateText": "1687",
    "sortYear": 1687,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Paris",
    "body": "Four Jesuit missionaries — Couplet, Intorcetta, Herdtrich and Rougemont — published in Paris, dedicated to Louis XIV, the first substantial Latin translation of the Confucian canon: the Analects, the Great Learning and the Doctrine of the Mean, with a long introduction presenting Confucius as a natural theologian compatible with Christianity. A monument of the accommodationist mission, it founded Western sinology and fed Enlightenment debate, from Bayle to Leibniz, about a virtuous ethics arrived at without revelation.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Thierry Meynard, The Jesuit Reading of Confucius: The First Complete Translation of the Lunyu (1687) Published in the West (Brill, 2015)",
      "Philippe Couplet et al., Confucius Sinarum Philosophus (Paris: Horthemels, 1687)",
      "D. E. Mungello, Curious Land: Jesuit Accommodation and the Origins of Sinology (1985)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "gheranda-samhita",
    "lane": "yoga-vedanta",
    "title": "Gheranda Samhita",
    "titleOriginal": "Gheraṇḍasaṃhitā",
    "dateText": "c. 1700 (oldest MS 1802)",
    "sortYear": 1700,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "text",
    "place": "Bengal",
    "body": "The latest of the three classic hatha manuals, compiled in Bengal around 1700 as the sage Gheranda's instruction to Chandakapali. It never calls its system hatha, teaching instead a sevenfold ghatastha-yoga, 'yoga of the pot' — the body a vessel to be cleansed and perfected. With thirty-two asanas, twenty-five mudras and an elaborate regimen of cleansing acts, it is the most encyclopedic of the three; Mallinson's 2004 translation, printed with the Sanskrit text, is the standard English version.",
    "technique": "The text describes seven sequential disciplines — cleansing acts, posture, mudras, sense-withdrawal, breath control, meditation and samadhi — each said to develop a distinct quality, from purification through steadiness and lightness to 'isolation'.",
    "label": "documented",
    "sources": [
      "James Mallinson, The Gheranda Samhita: The Original Sanskrit and an English Translation (YogaVidya, 2004)",
      "Wikipedia, 'Gheranda Samhita' (accessed 2026)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-leibniz-iching",
    "lane": "confluence",
    "title": "Leibniz reads the hexagrams as binary",
    "titleOriginal": null,
    "dateText": "1701–03",
    "sortYear": 1701,
    "sortYearEnd": 1703,
    "dateCertainty": "range",
    "kind": "event",
    "place": "Beijing / Hanover",
    "body": "The Jesuit Figurist Joachim Bouvet sent Leibniz, in a letter of November 1701 from Beijing, a diagram of the sixty-four hexagrams in the Xiantian (\"Earlier Heaven\") ordering; it reached Hanover in April 1703. Leibniz, who had developed binary arithmetic decades earlier, read the broken and unbroken lines as 0 and 1 and said so in his \"Explication de l'arithmétique binaire\", submitted within weeks to the Paris Académie and printed in its Mémoires for 1703 (issued 1705). The identification tells more about European projection than about the Yijing's divinatory logic, but it remains the most celebrated East–West mathematical encounter.",
    "technique": null,
    "label": "documented",
    "sources": [
      "G. W. Leibniz, \"Explication de l'arithmétique binaire\", Mémoires de l'Académie Royale des Sciences, année 1703 (issued 1705)",
      "Franklin Perkins, Leibniz and China: A Commerce of Light (Cambridge, 2004)"
    ],
    "contested": null,
    "siteLink": {
      "href": "iching.html",
      "label": "I Ching study page"
    }
  },
  {
    "slug": "person-baal-shem-tov",
    "lane": "kabbalah",
    "title": "The Baal Shem Tov and the rise of Hasidism",
    "titleOriginal": null,
    "dateText": "c. 1700–1760",
    "sortYear": 1730,
    "sortYearEnd": 1760,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Podolia (Medzhybizh)",
    "body": "Israel ben Eliezer (c. 1700–1760), the Baal Shem Tov or 'Master of the Good Name', was a healer and charismatic mystic in Podolia around whom Hasidism crystallized in the mid-eighteenth century. Leaving no books of his own, he taught through sayings and letters that divine vitality pervades all things and that joyful cleaving to God outranks ascetic and elite kabbalistic attainment. The movement he inspired carried Lurianic language to Eastern Europe's Jewish masses while softening its ascetic and theurgic emphases.",
    "technique": "Teachings attributed to him describe devekut — continuous attachment of the mind to God amid ordinary acts of eating, work, and speech — and ecstatic prayer in which the worshipper binds himself to the letters of the liturgy. Described as the historical practice of early Hasidism.",
    "label": "documented",
    "sources": [
      "Moshe Rosman, Founder of Hasidism: A Quest for the Historical Ba'al Shem Tov (1996)",
      "Encyclopaedia Britannica, 'Baal Shem Tov'"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "philokalia",
    "lane": "christian",
    "title": "The Philokalia",
    "titleOriginal": "Philokalia tōn hierōn nēptikōn",
    "dateText": "printed Venice 1782",
    "sortYear": 1782,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Mount Athos; printed Venice",
    "body": "Nicodemus the Hagiorite (1749–1809) and Macarius of Corinth (1731–1805), leaders of the traditionalist Kollyvades movement on Mount Athos, compiled this anthology of some thirty-six Greek ascetic and hesychast authors spanning the fourth to fifteenth centuries — from Evagrius' circle to Gregory Palamas — and printed it at Venice in 1782. The 'love of the beautiful' gathered the tradition of watchfulness (nepsis) and the Jesus Prayer into one book, seeding revivals in Greece, the Slavic lands and, in the twentieth century, the West.",
    "technique": "Its texts document the Jesus Prayer tradition: continual inward repetition of 'Lord Jesus Christ, have mercy on me', guarding of the heart against thoughts, and, in some late Byzantine texts, a psychophysical method of posture and breath. The compilers themselves cautioned that such texts presuppose a guide. Described for study.",
    "label": "documented",
    "sources": [
      "G.E.H. Palmer, Philip Sherrard & Kallistos Ware (trans.), The Philokalia, vol. 1, introduction (Faber, 1979)",
      "Brock Bingaman & Bradley Nassif (eds.), The Philokalia: A Classic Text of Orthodox Spirituality (OUP, 2012)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-asiatic-society-1784",
    "lane": "confluence",
    "title": "The Asiatic Society founded",
    "titleOriginal": null,
    "dateText": "15 January 1784",
    "sortYear": 1784,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Calcutta",
    "body": "On 15 January 1784 Sir William Jones, newly arrived as a Supreme Court judge, convened some thirty Europeans in Calcutta to found the Asiatick Society, its inquiries bounded only by \"the geographical limits of Asia.\" Its journal Asiatick Researches carried Indological scholarship to Europe, and Jones's 1786 discourse on Sanskrit's kinship with Greek and Latin helped found comparative philology. The institution was colonial in structure — Indian members were not admitted until 1829 — even as it made Sanskrit learning a European concern.",
    "technique": null,
    "label": "documented",
    "sources": [
      "O. P. Kejariwal, The Asiatic Society of Bengal and the Discovery of India's Past (Oxford, 1988)",
      "Michael J. Franklin, 'Orientalist Jones': Sir William Jones, Poet, Lawyer, and Linguist (Oxford, 2011)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-wilkins-gita-1785",
    "lane": "confluence",
    "title": "Wilkins's Bhagvat-Geeta in English",
    "titleOriginal": "The Bhăgvăt-Gēētā, or Dialogues of Krĕĕshnă and Ărjŏŏn",
    "dateText": "printed 1785",
    "sortYear": 1785,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "London",
    "body": "Charles Wilkins's Bhagvat-Geeta, printed in London at the East India Company's expense with a commendatory letter from Warren Hastings, was the first printed translation of a complete Sanskrit work directly into English. Emerson prized it, and Thoreau, in Walden's \"The Pond in Winter,\" describes bathing his intellect each morning \"in the stupendous and cosmogonal philosophy of the Bhagvat-Geeta.\" Company patronage and Transcendentalist reception mark its double life as colonial scholarship and adopted scripture.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Charles Wilkins, The Bhăgvăt-Gēētā (London: Nourse, 1785)",
      "Richard H. Davis, The Bhagavad Gita: A Biography (Princeton, 2014)",
      "Henry David Thoreau, Walden (1854), \"The Pond in Winter\""
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-nachman-of-breslov",
    "lane": "kabbalah",
    "title": "Nachman of Breslov",
    "titleOriginal": null,
    "dateText": "1772–1810; Likutei Moharan printed Ostroh 1808",
    "sortYear": 1791,
    "sortYearEnd": 1810,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Podolia and Ukraine (Bratslav, Uman)",
    "body": "Great-grandson of the Baal Shem Tov, Nachman of Breslov led a small, intense Hasidic circle in Podolia and Ukraine; his formal lessons were printed as Likutei Moharan (Ostroh, 1808), the only volume published in his lifetime, and his enigmatic tales became classics of Jewish literature. He died of tuberculosis at Uman in 1810, and his followers, uniquely among Hasidic groups, never appointed a successor. Arthur Green's biography Tormented Master reads his teachings through his documented struggles with doubt and depression.",
    "technique": "He taught hitbodedut: secluding oneself daily, ideally outdoors at night, and speaking aloud to God spontaneously in one's own vernacular — an unscripted personal outpouring set alongside fixed liturgical prayer. Recorded in Likutei Moharan and Breslov tradition; described here as historical practice.",
    "label": "documented",
    "sources": [
      "Likutei Moharan (Ostroh, 1808), first edition",
      "Arthur Green, Tormented Master: The Life and Spiritual Quest of Rabbi Nahman of Bratslav (1979)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "dobrotolubiye",
    "lane": "christian",
    "title": "Dobrotolubiye (Slavonic Philokalia)",
    "titleOriginal": "Добротолюбїе",
    "dateText": "printed Moscow 1793 (reprinted 1822)",
    "sortYear": 1793,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Moldavia; printed Moscow",
    "body": "Paisius Velichkovsky (1722–1794), a Poltava-born monk who had worked on Mount Athos and led the Moldavian monasteries of Dragomirna, Secu and Neamts, rendered a substantial selection of the Greek Philokalia into Church Slavonic; his Dobrotolubiye was printed at Moscow in 1793 and reprinted in 1822. Carried by wandering pilgrims and prized by the Optina elders, it made hesychast texts a living force in nineteenth-century Russian piety; Theophan the Recluse's expanded Russian version followed in 1877–1889.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Kallistos Ware, 'St Nikodimos and the Philokalia', in Bingaman & Nassif (eds.), The Philokalia (OUP, 2012)",
      "Palmer, Sherrard & Ware, The Philokalia, vol. 1, introduction (Faber, 1979)",
      "SESDIVA project, 'Paisius Velichkovsky' (sesdiva.eu)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "oupnekhat",
    "lane": "confluence",
    "title": "Oupnek'hat — the Upanishads in Latin",
    "titleOriginal": "Oupnek'hat (id est, Secretum tegendum)",
    "dateText": "1801–02",
    "sortYear": 1801,
    "sortYearEnd": 1802,
    "dateCertainty": "range",
    "kind": "translation",
    "place": "Strasbourg",
    "body": "Abraham Hyacinthe Anquetil-Duperron, who had earlier published the Zend-Avesta, rendered Dara Shikoh's Persian Upanishads into knotted Latin as Oupnek'hat (Strasbourg, 1801–02) — the first extensive European version of the Upanishads, standing at two removes from the Sanskrit. Schopenhauer read it from 1814 and wrote in Parerga and Paralipomena (§184) that it had been \"the solace of my life\" and would be \"the solace of my death\"; Urs App has traced its deep imprint on his metaphysics.",
    "technique": null,
    "label": "documented",
    "sources": [
      "A. H. Anquetil-Duperron, Oupnek'hat, 2 vols (Strasbourg, 1801–02)",
      "Urs App, Schopenhauer's Compass (2014); App, \"Required Reading: Schopenhauer's Favorite Book\", Schopenhauer-Jahrbuch 93 (2012)",
      "Arthur Schopenhauer, Parerga und Paralipomena (1851), §184"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-ledi-sayadaw",
    "lane": "buddhist",
    "title": "Ledi Sayadaw",
    "titleOriginal": null,
    "dateText": "1846–1923",
    "sortYear": 1846,
    "sortYearEnd": 1923,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Monywa region, Burma",
    "body": "Burmese scholar-monk whose response to the British conquest of Burma reshaped Buddhist practice worldwide. Fearing the religion's decline, he taught Abhidhamma and insight meditation to laypeople on an unprecedented scale, writing accessible manuals (dīpanī) in Burmese and authorizing lay teachers such as the farmer Saya Thetgyi. Erik Braun's study identifies him as the pivotal figure who made vipassanā a mass lay practice, seeding the lineages that reached U Ba Khin and, ultimately, global meditation culture.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Erik Braun, The Birth of Insight: Meditation, Modern Buddhism, and the Burmese Monk Ledi Sayadaw, 2013",
      "Ledi Sayadaw, The Manuals of Buddhism (collected dīpanī, English eds.), Buddhist Publication Society"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "dogme-et-rituel",
    "lane": "confluence",
    "title": "Dogme et rituel de la haute magie",
    "titleOriginal": "Dogme et rituel de la haute magie",
    "dateText": "1854–56 (2 vols)",
    "sortYear": 1854,
    "sortYearEnd": 1856,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Paris",
    "body": "Alphonse-Louis Constant, writing as Éliphas Lévi, issued Dogme (1854) and Rituel (1856) in twenty-two chapters each, keyed to the tarot trumps. The work fused tarot, Kabbalah and ceremonial magic into a single system pivoting on the \"astral light\" — the template that the Golden Dawn and nearly all later occultism inherited, in English mostly through Waite's 1896 Transcendental Magic. Its historical claims are unreliable; its influence on the modern occult synthesis is not.",
    "technique": "Lévi describes magical operation as the trained will acting through imagination upon a universal medium he calls the astral light, disciplined by ritual, correspondences, and the tarot's twenty-two-letter symbolic alphabet. He presents the doctrine as ancient; scholarship treats it as his own nineteenth-century synthesis.",
    "label": "documented",
    "sources": [
      "Éliphas Lévi, Dogme et rituel de la haute magie (Paris: Baillière, 1854–56)",
      "Christopher McIntosh, Eliphas Lévi and the French Occult Revival (1972)",
      "A. E. Waite (trans.), Transcendental Magic (London, 1896)"
    ],
    "contested": null,
    "siteLink": {
      "href": "tarot.html",
      "label": "Tarot study page"
    }
  },
  {
    "slug": "way-of-a-pilgrim",
    "lane": "christian",
    "title": "The Way of a Pilgrim",
    "titleOriginal": "Otkrovennye rasskazy strannika dukhovnomu svoemu ottsu",
    "dateText": "written c. 1850s–1860s; first published Kazan 1881",
    "sortYear": 1860,
    "sortYearEnd": 1881,
    "dateCertainty": "contested",
    "kind": "text",
    "place": "Russia; published Kazan",
    "body": "These 'candid tales' of an anonymous Russian wanderer who learns the unceasing Jesus Prayer from a starets and from the Dobrotolubiye were first printed at Kazan in 1881 (an expanded edition followed in 1884), from texts composed around the 1850s–1860s. Long read as an artless first-person memoir, the narrative's authorship is genuinely contested: Aleksei Pentkovsky's textual scholarship assigns its core and compilation to identifiable nineteenth-century monastics. R.M. French's 1930 English translation made it a Western devotional classic.",
    "technique": "The narrative depicts the starets instructing the pilgrim to recite the Jesus Prayer a fixed number of times daily — 3,000, then 6,000, then 12,000 repetitions — until it becomes 'self-acting', descending from the lips into the heart. A literary depiction of hesychast practice, reported here as narrative content, not guidance.",
    "label": "disputed",
    "sources": [
      "Aleksei Pentkovsky (ed.), The Pilgrim's Tale, trans. T. Allan Smith (Paulist CWS, 1999)",
      "R.M. French (trans.), The Way of a Pilgrim (Philip Allan, 1930)"
    ],
    "contested": {
      "flag": "Authorship and textual history of the anonymous narrative",
      "positions": [
        {
          "source": "Aleksei Pentkovsky, The Pilgrim's Tale (Paulist CWS, 1999); Pentkovsky's later textual studies (manuscript find 2009; publications to 2018)",
          "value": "The tales are the work of identifiable nineteenth-century monastics: Pentkovsky first argued the four core tales survive as a redaction of Archimandrite Mikhail Kozlov's The Seeker of Unceasing Prayer with compilation and supplementary tales by hieromonk Arsenii Troepolsky; his later manuscript discoveries led him to assign the authorship of all seven tales to Troepolsky"
        },
        {
          "source": "Traditional reception (Kazan editions; R.M. French's 1930 translation)",
          "value": "An authentic anonymous pilgrim's first-person account, at most lightly edited by Abbot Paisii Fedorov of Kazan; author unknown"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-woodroffe",
    "lane": "tantra-rasa",
    "title": "Sir John Woodroffe (Arthur Avalon)",
    "titleOriginal": null,
    "dateText": "1865–1936",
    "sortYear": 1865,
    "sortYearEnd": 1936,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Calcutta / Oxford",
    "body": "Judge of the Calcutta High Court who, under the pen-name Arthur Avalon, edited the Tantrik Texts series (from 1913), translated the Mahanirvana Tantra, and wrote Shakti and Shakta (1918) and The Serpent Power (1919) — the first sustained Western defense of tantra against colonial contempt. Taylor's 2001 biography shows the Avalon oeuvre was collaborative, resting on Bengali scholars, especially Atal Bihari Ghosh. He later held a readership in Indian law at Oxford and died in France.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Kathleen Taylor, Sir John Woodroffe, Tantra and Bengal (Curzon, 2001)",
      "Klaus Karttunen, 'Woodroffe, John (Arthur Avalon)', Persons of Indian Studies / Who Was Who in Indology (whowaswho-indology.info)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-theosophical-society-1875",
    "lane": "confluence",
    "title": "The Theosophical Society founded",
    "titleOriginal": null,
    "dateText": "17 November 1875",
    "sortYear": 1875,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "New York",
    "body": "On 17 November 1875 Helena Blavatsky, Henry Steel Olcott, William Quan Judge and others founded the Theosophical Society in New York; its 1875 object was \"to collect and diffuse a knowledge of the laws which govern the universe,\" later formalized as the familiar three Objects — universal brotherhood, comparative study of religion, and investigation of \"the powers latent in man.\" Blavatsky's Isis Unveiled (1877) — whose extensive unacknowledged borrowings W. E. Coleman catalogued in 1895 — and the Society's 1879 relocation to India made it the nineteenth century's principal engine for mixing Asian religious vocabularies with Western occultism.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Joscelyn Godwin, The Theosophical Enlightenment (SUNY, 1994)",
      "Gary Lachman, Madame Blavatsky: The Mother of Modern Spirituality (2012)",
      "H. P. Blavatsky, Isis Unveiled (New York, 1877)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "person-jung",
    "lane": "confluence",
    "title": "Carl Gustav Jung — the psychological interchange",
    "titleOriginal": null,
    "dateText": "1875–1961",
    "sortYear": 1875,
    "sortYearEnd": 1961,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Küsnacht / Zürich, Switzerland",
    "body": "The Swiss psychiatrist became the twentieth century's busiest interchange for esoteric traditions: a commentary on Wilhelm's Golden Flower translation (1929), psychological commentaries on Evans-Wentz's Tibetan Book of the Dead (German edition 1935, English 1957), a foreword to Suzuki's Zen (German edition 1939), the Eranos lectures from 1933, and Psychology and Alchemy (1944), which re-read Latin and Greek alchemy as the projection of an inner individuation process — a psychological reading that historians of alchemy such as Principe and Newman contest.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Sonu Shamdasani, Jung and the Making of Modern Psychology (Cambridge University Press, 2003)",
      "C. G. Jung, Psychologie und Alchemie (Zürich: Rascher, 1944)",
      "Wouter J. Hanegraaff, Esotericism and the Academy (Cambridge University Press, 2012)"
    ],
    "contested": null,
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung & astrology — the wing"
    }
  },
  {
    "slug": "sacred-books-of-the-east",
    "lane": "confluence",
    "title": "Sacred Books of the East",
    "titleOriginal": null,
    "dateText": "1879–1910 (50 vols)",
    "sortYear": 1879,
    "sortYearEnd": 1910,
    "dateCertainty": "range",
    "kind": "translation",
    "place": "Oxford",
    "body": "Friedrich Max Müller persuaded Oxford's Clarendon Press to issue a fifty-volume series — translations of Vedic and Buddhist texts, the Zend-Avesta, Confucian and Daoist classics, Jain sutras, the Quran, closed in 1910 by a general index — by an international team including Legge, Oldenberg, Rhys Davids and Darmesteter. The series fixed the category of \"sacred books\" and put scholarly versions of Asian scriptures on Victorian shelves; the Christian canon was pointedly excluded. Molendijk's study shows how its philological frame also flattened living traditions into texts.",
    "technique": null,
    "label": "documented",
    "sources": [
      "F. Max Müller (ed.), The Sacred Books of the East, 50 vols (Oxford: Clarendon Press, 1879–1910)",
      "Arie L. Molendijk, Friedrich Max Müller and the Sacred Books of the East (Oxford, 2016)"
    ],
    "contested": null,
    "siteLink": {
      "href": "library/index.html",
      "label": "The expert Library"
    }
  },
  {
    "slug": "event-mahatma-letters",
    "lane": "confluence",
    "title": "The Mahatma Letters and the Hodgson Report",
    "titleOriginal": null,
    "dateText": "letters 1880–85; Hodgson Report 1885; Harrison re-examination 1986",
    "sortYear": 1880,
    "sortYearEnd": 1885,
    "dateCertainty": "range",
    "kind": "event",
    "place": "India / London",
    "body": "Between 1880 and 1885 letters attributed to hidden \"Mahatmas,\" Koot Hoomi and Morya, reached A. P. Sinnett and other Theosophists, often by claimed paranormal delivery. Richard Hodgson's 1885 report for the Society for Psychical Research concluded that Blavatsky wrote them and staged the phenomena. In 1986 the SPR's journal published Vernon Harrison's \"J'Accuse,\" which found Hodgson's handwriting evidence flawed and his verdict unproven — a critique of method that did not authenticate the letters, whose claimed Mahatma authorship has never been demonstrated.",
    "technique": null,
    "label": "debunked",
    "sources": [
      "Richard Hodgson et al., Proceedings of the Society for Psychical Research 3 (1885)",
      "Vernon Harrison, \"J'Accuse\", Journal of the Society for Psychical Research 53:803 (April 1986)",
      "Peter Washington, Madame Blavatsky's Baboon (1993)"
    ],
    "contested": {
      "flag": "Whether Hodgson's 1885 verdict of fabrication by Blavatsky stands as delivered",
      "positions": [
        {
          "source": "Richard Hodgson, 'Report of the Committee Appointed to Investigate Phenomena Connected with the Theosophical Society', Proceedings of the SPR 3 (1885)",
          "value": "The Mahatma Letters were written by Blavatsky (partly via accomplices) and the delivery phenomena were fraudulent."
        },
        {
          "source": "Vernon Harrison, \"J'Accuse: An Examination of the Hodgson Report of 1885\", Journal of the SPR 53:803 (1986)",
          "value": "Hodgson's procedures and handwriting analysis were flawed and biased and his verdict is unproven — while explicitly not authenticating the letters as written by Mahatmas."
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "event-golden-dawn-1888",
    "lane": "confluence",
    "title": "The Hermetic Order of the Golden Dawn",
    "titleOriginal": null,
    "dateText": "cipher MSS 1887; Isis-Urania Temple chartered March 1888",
    "sortYear": 1887,
    "sortYearEnd": 1888,
    "dateCertainty": "range",
    "kind": "event",
    "place": "London",
    "body": "Working from some sixty \"cipher manuscripts\" obtained in 1887, William Wynn Westcott, S. L. MacGregor Mathers and W. R. Woodman chartered the Isis-Urania Temple in London in March 1888. The order's graded curriculum wove Kabbalah, tarot, astrology, geomancy, alchemy and Dee's Enochian material into one initiatic system — Western occultism's great synthesis machine, formative for Yeats, Waite and Crowley. Its authorizing correspondence with a German adept, \"Anna Sprengel,\" is judged a fabrication, most likely Westcott's, in Howe's documentary history.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Ellic Howe, The Magicians of the Golden Dawn: A Documentary History of a Magical Order 1887–1923 (1972)",
      "R. A. Gilbert, The Golden Dawn Scrapbook: The Rise and Fall of a Magical Order (1997)"
    ],
    "contested": {
      "flag": "Origin of the cipher manuscripts and reality of the claimed German Rosicrucian lineage",
      "positions": [
        {
          "source": "Ellic Howe, The Magicians of the Golden Dawn (1972)",
          "value": "The Sprengel letters were forged, most plausibly by or for Westcott; the German lineage is a fabrication."
        },
        {
          "source": "R. A. Gilbert (The Golden Dawn Scrapbook, 1997; 'Provenance Unknown')",
          "value": "Agrees the Sprengel correspondence is spurious, but argues the cipher manuscripts themselves are genuine earlier Victorian documents, plausibly by Kenneth Mackenzie, of uncertain date and purpose."
        }
      ]
    },
    "siteLink": {
      "href": "greatworks/index.html",
      "label": "The Great Works wing"
    }
  },
  {
    "slug": "kabbalah-unveiled",
    "lane": "kabbalah",
    "title": "Mathers, The Kabbalah Unveiled",
    "titleOriginal": "Kabbala Denudata: The Kabbalah Unveiled",
    "dateText": "London, 1887",
    "sortYear": 1887,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "London",
    "body": "S. L. MacGregor Mathers, soon a founding chief of the Hermetic Order of the Golden Dawn, rendered three Zoharic tractates into English from Knorr von Rosenroth's Latin as The Kabbalah Unveiled (London: George Redway, 1887). The book channelled Kabbalah — already at two removes from its Aramaic sources — into modern occultism, where it fused with tarot, astrology, and ceremonial magic. The resulting 'Hermetic Qabalah' of the Golden Dawn diverges sharply in aim and content from Jewish Kabbalah, and scholars treat the two as distinct traditions.",
    "technique": null,
    "label": "documented",
    "sources": [
      "S. L. MacGregor Mathers, The Kabbalah Unveiled (London: George Redway, 1887)",
      "Wellcome Collection catalogue record, 'The Kabbalah unveiled'"
    ],
    "contested": null,
    "siteLink": {
      "href": "kabbalah.html",
      "label": "Tree of Life explorer"
    }
  },
  {
    "slug": "person-krishnamacharya",
    "lane": "yoga-vedanta",
    "title": "Tirumalai Krishnamacharya and the Mysore synthesis",
    "titleOriginal": null,
    "dateText": "1888–1989 (Mysore yogashala from 11 August 1933)",
    "sortYear": 1888,
    "sortYearEnd": 1989,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Mysore, India",
    "body": "Brahmin scholar and yoga teacher who, from 1933, ran a yogashala in the gymnastics hall of Mysore's Jaganmohan Palace under royal patronage. There he forged a dynamic style for energetic schoolboys — hatha yoga crossed with Indian wrestling exercises and Western gymnastic movement, as Sjoman and Singleton document. His students K. Pattabhi Jois, B.K.S. Iyengar and Indra Devi carried the synthesis worldwide; most global postural yoga descends, by one route or another, from this one room.",
    "technique": "He taught vinyasa: sequences of postures dynamically linked and synchronized with regulated breathing, graded into series and adapted to the individual student — a method his pupils later formalized as Ashtanga Vinyasa Yoga and, along a different line, Iyengar Yoga.",
    "label": "documented",
    "sources": [
      "N. E. Sjoman, The Yoga Tradition of the Mysore Palace (Abhinav, 1996)",
      "Mark Singleton, Yoga Body: The Origins of Modern Posture Practice (OUP, 2010)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "secret-doctrine",
    "lane": "confluence",
    "title": "The Secret Doctrine",
    "titleOriginal": null,
    "dateText": "1888 (2 vols)",
    "sortYear": 1888,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "London",
    "body": "Blavatsky's two-volume synthesis of \"cosmogenesis\" and \"anthropogenesis\" presents itself as commentary on stanzas from a \"Book of Dzyan\" in a secret language; no such manuscript has ever been identified, and scholarship treats the stanzas as her own composition. Built from contemporary Orientalist translations and occult literature — a dependence Coleman documented — the book codified karma, reincarnation, root-races and hidden Masters for Western readers, becoming the wellspring of twentieth-century \"Ancient Wisdom\" movements far beyond the Society itself.",
    "technique": null,
    "label": "documented",
    "sources": [
      "H. P. Blavatsky, The Secret Doctrine, 2 vols (London, 1888)",
      "William Emmette Coleman, \"The Sources of Madame Blavatsky's Writings\", in V. Solovyov, A Modern Priestess of Isis (1895), appendix",
      "Gary Lachman, Madame Blavatsky (2012)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-chicago-1893",
    "lane": "confluence",
    "title": "Vivekananda at the World's Parliament of Religions",
    "titleOriginal": null,
    "dateText": "September 1893",
    "sortYear": 1893,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Chicago",
    "body": "At the World's Parliament of Religions, opened on 11 September 1893 alongside the Columbian Exposition, Swami Vivekananda's greeting \"Sisters and brothers of America\" drew a standing ovation, and his lectures over the following weeks made Vedanta a public presence in the United States, establishing the travelling Indian teacher as a durable institution. The same Parliament brought the Zen abbot Shaku Sōen to America, opening the channel through which his student D. T. Suzuki would later carry Zen westward.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Richard Hughes Seager, The World's Parliament of Religions: The East/West Encounter, Chicago 1893 (1995)",
      "J. H. Barrows (ed.), The World's Parliament of Religions (Chicago, 1893)",
      "John Henry Barrows (ed.), The World's Parliament of Religions (1893)",
      "Wikipedia, 'Swami Vivekananda at the Parliament of the World's Religions' (accessed 2026)"
    ],
    "contested": null,
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga wing"
    }
  },
  {
    "slug": "raja-yoga-1896",
    "lane": "yoga-vedanta",
    "title": "Raja Yoga (Vivekananda)",
    "titleOriginal": null,
    "dateText": "July 1896 (New York)",
    "sortYear": 1896,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "New York, USA",
    "body": "Published in New York in July 1896 from lectures Vivekananda delivered there in 1895–96, together with his free translation of and commentary on Patanjali's sutras. It recast yoga as a rational 'science of the mind', fusing Patanjali with prana theory, contemporary scientific idiom and, as De Michelis shows, Brahmo Samaj and Western occultist currents — while dismissing postural hatha yoga as inferior. It fixed the template through which Anglophone readers encountered Patanjali for half a century.",
    "technique": "The book describes a graded practice of steady seated posture, breath control and concentration, presented by Vivekananda as experimental psychology rather than religion and said to awaken kundalini and culminate in samadhi.",
    "label": "documented",
    "sources": [
      "Swami Vivekananda, Raja Yoga (New York, 1896)",
      "Elizabeth De Michelis, A History of Modern Yoga: Patañjali and Western Esotericism (Continuum, 2004)",
      "Wikipedia, 'Raja Yoga (book)' (accessed 2026)"
    ],
    "contested": null,
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga Sutras wing"
    }
  },
  {
    "slug": "person-u-ba-khin",
    "lane": "buddhist",
    "title": "Sayagyi U Ba Khin",
    "titleOriginal": null,
    "dateText": "1899–1971 (International Meditation Centre founded 1952)",
    "sortYear": 1899,
    "sortYearEnd": 1971,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Rangoon, Burma",
    "body": "Accountant General of newly independent Burma and a lay meditation master in the Ledi Sayadaw lineage, trained under the farmer-teacher Saya Thetgyi. He founded a meditation association within his government office in 1950 and the International Meditation Centre in Rangoon in 1952, teaching ten-day courses that fitted vipassanā to householders' and foreigners' schedules. His most consequential student was S. N. Goenka. Scholarly literature on him is thinner than for the monastics; Houtman's anthropological study is the key academic source.",
    "technique": "U Ba Khin's method begins with breath awareness at the nostrils (ānāpāna) to concentrate the mind, then moves attention systematically through the body, observing sensations as impermanent — a 'sweeping' technique his tradition traces through Saya Thetgyi to Ledi Sayadaw.",
    "label": "documented",
    "sources": [
      "Gustaaf Houtman, Traditions of Buddhist Practice in Burma, PhD thesis, SOAS, 1990",
      "Sayagyi U Ba Khin, The Clock of Vipassana Has Struck (Pariyatti collected papers), 1999 ed."
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "book-of-the-law",
    "lane": "confluence",
    "title": "The Book of the Law",
    "titleOriginal": "Liber AL vel Legis",
    "dateText": "written April 1904; first published 1909",
    "sortYear": 1904,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Cairo",
    "body": "Aleister Crowley reported that over three afternoons, 8–10 April 1904 in Cairo, a praeterhuman intelligence he named Aiwass dictated to him the three chapters of Liber AL vel Legis, the founding scripture of Thelema; the dictation claim rests entirely on his own testimony. First published in 1909 in the collection ΘΕΛΗΜΑ, the short text supplied the doctrinal core around which Crowley reorganized his Golden Dawn inheritance. It is described here from the scholarly literature and is not quoted.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Richard Kaczynski, Perdurabo: The Life of Aleister Crowley (rev. ed., 2010)",
      "Aleister Crowley, ΘΕΛΗΜΑ (privately printed, London, 1909)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/crowley.html",
      "label": "Crowley in the Great Works wing"
    }
  },
  {
    "slug": "person-mahasi-sayadaw",
    "lane": "buddhist",
    "title": "Mahasi Sayadaw",
    "titleOriginal": null,
    "dateText": "1904–1982 (method taught from 1938; Rangoon centre from 1949)",
    "sortYear": 1904,
    "sortYearEnd": 1982,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Seikkhun and Rangoon, Burma",
    "body": "Burmese monk who first taught his insight method in his home village of Seikkhun in 1938 and, invited by Prime Minister U Nu, inaugurated systematic instruction at the Mahasi Sasana Yeiktha in Rangoon on 4 December 1949. His 'noting' technique, presented as a direct application of the Satipaṭṭhāna Sutta requiring no prior concentration attainment, powered Burma's mass lay meditation movement and, through students such as Nyanaponika Thera and the founders of the Insight Meditation Society, Western vipassanā.",
    "technique": "The Mahasi method directs attention to the rising and falling of the abdomen in breathing, mentally 'noting' each occurrence and any competing sensation, thought, or intention with a simple label ('rising', 'hearing', 'thinking'), in slow-motion activity, to develop momentary concentration and progressive insight.",
    "label": "documented",
    "sources": [
      "Mahasi Sayadaw, Manual of Insight, tr. Vipassanā Mettā Foundation Translation Committee, 2016",
      "Erik Braun, The Birth of Insight, 2013",
      "Ingrid Jordt, Burma's Mass Lay Meditation Movement, 2007"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-tantrik-order-1905",
    "lane": "tantra-rasa",
    "title": "Founding of the Tantrik Order in America",
    "titleOriginal": null,
    "dateText": "1905/1906",
    "sortYear": 1905,
    "sortYearEnd": null,
    "dateCertainty": "range",
    "kind": "event",
    "place": "US West Coast — San Francisco / Seattle / Tacoma / Portland (founding city variously reported)",
    "body": "Pierre Bernard — 'Oom the Omnipotent' — founded the first American tantric organization around 1905–1906, a secret society whose journal appeared in 1906. Urban's scholarship shows Bernard was pivotal in fixing the modern Western equation of tantra with sacred sexuality: an eroticized re-reading shaped by Victorian discourses on sex, greatly exaggerating one hedged strand of the Sanskrit tradition. Historians of religion mark this equation as a modern construction, not a summary of the Indian corpus.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Hugh B. Urban, 'The Omnipotent Oom: Tantra and Its Impact on Modern Western Esotericism', Esoterica 3 (2001), 218–259",
      "Hugh B. Urban, Tantra: Sex, Secrecy, Politics, and Power in the Study of Religion (2003)",
      "International Journal, Tantrik Order (Vira Sadhana), vol. V no. 1 (1906)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "kybalion",
    "lane": "confluence",
    "title": "The Kybalion",
    "titleOriginal": null,
    "dateText": "1908",
    "sortYear": 1908,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Chicago",
    "body": "Issued by Chicago's Yogi Publication Society under the pseudonym \"Three Initiates,\" The Kybalion claims to transmit ancient Hermetic axioms through seven principles — mentalism, correspondence, vibration, polarity, rhythm, cause and effect, gender. Philip Deslippe's documentary edition identifies the author as the New Thought writer William Walker Atkinson and shows the \"axioms\" to be early twentieth-century New Thought, not ancient Hermetica: the antiquity claim is debunked, though the book remains one of occultism's steadiest sellers and a genuine influence in its own right.",
    "technique": "The book teaches \"mental transmutation\": deliberately shifting one's mental state along claimed polarities (fear to courage, hate to love) on the premise that \"all is mind.\" The method is affirmational New Thought self-culture in Hermetic dress, and its efficacy claims were never demonstrated.",
    "label": "debunked",
    "sources": [
      "Philip Deslippe (ed.), The Kybalion: The Definitive Edition (Tarcher/Penguin, 2011)",
      "Three Initiates, The Kybalion (Chicago: Yogi Publication Society, 1908)",
      "Mitch Horowitz, Occult America (2009)"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "serpent-power",
    "lane": "tantra-rasa",
    "title": "The Serpent Power",
    "titleOriginal": null,
    "dateText": "1919 (first edition, Luzac & Co.)",
    "sortYear": 1919,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "London / Calcutta",
    "body": "Arthur Avalon's translation-with-study of the Shatchakranirupana and Padukapanchaka, published by Luzac in 1919: the book that gave the West its working vocabulary of kundalini and the chakras. Kathleen Taylor's biography (2001) established that 'Arthur Avalon' was a collaborative persona — Sir John Woodroffe working with Bengali pandits, above all Atal Bihari Ghosh, who supplied much of the Sanskrit labor. Jung's 1932 Zurich seminars on kundalini took this book as their base text.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Arthur Avalon (Sir John Woodroffe), The Serpent Power (Luzac & Co., London, 1919)",
      "Kathleen Taylor, Sir John Woodroffe, Tantra and Bengal: 'An Indian Soul in a European Body?' (Curzon, 2001)"
    ],
    "contested": {
      "flag": "Authorship of the 'Arthur Avalon' works",
      "positions": [
        {
          "source": "title pages, 1919 and later editions",
          "value": "Arthur Avalon, i.e. Sir John Woodroffe, sole author-translator"
        },
        {
          "source": "Kathleen Taylor, Sir John Woodroffe, Tantra and Bengal (2001)",
          "value": "a collaborative production: Woodroffe depended heavily on Atal Bihari Ghosh and other Bengali collaborators for the Sanskrit"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "person-goenka",
    "lane": "buddhist",
    "title": "S. N. Goenka",
    "titleOriginal": null,
    "dateText": "1924–2013 (first Indian course 1969)",
    "sortYear": 1924,
    "sortYearEnd": 2013,
    "dateCertainty": "year",
    "kind": "person",
    "place": "Rangoon, Burma / Igatpuri, India",
    "body": "A wealthy Burmese-Indian industrialist and Hindu community leader in Rangoon who trained under U Ba Khin from 1955. Authorized as a teacher, he moved to India in 1969 and began conducting courses, founding the academy at Igatpuri (1976) and eventually a worldwide network of centres teaching a standardized, donation-funded ten-day course. Presenting vipassanā as a non-sectarian 'art of living', he became the single largest conduit of Burmese insight practice to a global public.",
    "technique": "The Goenka course prescribes a fixed ten-day sequence: three days of breath observation at the nostrils, then body-scanning vipassanā — moving attention part by part through the body and observing sensations with equanimity as impermanent — concluding with loving-kindness practice, all in silence and to recorded instructions.",
    "label": "documented",
    "sources": [
      "Daniel M. Stuart, S. N. Goenka: Emissary of Insight, 2020",
      "Vipassana Research Institute / dhamma.org, 'The Chain of Teachers' (lineage documentation)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "essays-in-zen-buddhism",
    "lane": "buddhist",
    "title": "Essays in Zen Buddhism (First Series)",
    "titleOriginal": null,
    "dateText": "1927 (Luzac & Co., London)",
    "sortYear": 1927,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "London / Kyoto",
    "body": "Daisetz Teitaro Suzuki's seven essays, published in London in 1927 for the Eastern Buddhist Society of Kyoto (second and third series 1933, 1934), gave the anglophone world its formative picture of Zen: satori as sudden, ineffable experience, and the koan as its instrument. The book shaped writers from Jung to the Beats. Later scholarship, notably Robert Sharf, has criticized Suzuki's presentation as a modernist, experience-centred construction shaped by Meiji-era reform and Japanese cultural nationalism.",
    "technique": null,
    "label": "documented",
    "sources": [
      "D. T. Suzuki, Essays in Zen Buddhism: First Series, Luzac & Co., 1927",
      "Robert H. Sharf, 'The Zen of Japanese Nationalism', History of Religions 33(1), 1993"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "tibetan-book-of-the-dead",
    "lane": "buddhist",
    "title": "The Tibetan Book of the Dead (Evans-Wentz edition)",
    "titleOriginal": null,
    "dateText": "1927 (Oxford University Press); Jung's commentary 1935 (German), 1957 (English)",
    "sortYear": 1927,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Oxford, England",
    "body": "Walter Y. Evans-Wentz's edition of the Bardo Thödol, from a translation made with the Sikkimese lama Kazi Dawa Samdup (d. 1922), published by Oxford in 1927 under a title echoing the Egyptian Book of the Dead. Donald Lopez has shown that Evans-Wentz, a Theosophist, framed the text through Theosophical doctrines of spiritual evolution foreign to the Tibetan original. C. G. Jung added a psychological commentary to the 1935 German edition, translated into English for the 1957 third edition; the book became the West's emblematic 'Tibetan' text.",
    "technique": null,
    "label": "documented",
    "sources": [
      "W. Y. Evans-Wentz (ed.), The Tibetan Book of the Dead, Oxford University Press, 1927",
      "Donald S. Lopez Jr., Prisoners of Shangri-La: Tibetan Buddhism and the West, 1998",
      "Donald S. Lopez Jr., The Tibetan Book of the Dead: A Biography, 2011"
    ],
    "contested": null,
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung's psychological commentary — Workbench Jung wing"
    }
  },
  {
    "slug": "event-golden-flower-1929",
    "lane": "confluence",
    "title": "The Secret of the Golden Flower in German",
    "titleOriginal": "Das Geheimnis der goldenen Blüte",
    "dateText": "1929 (English 1931)",
    "sortYear": 1929,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "Munich",
    "body": "Richard Wilhelm's Das Geheimnis der goldenen Blüte, published with an extensive psychological commentary by C. G. Jung (Munich: Dornverlag Grete Ullmann, 1929; English by Cary F. Baynes, 1931), carried the Qing-era inner-alchemical manual Taiyi jinhua zongzhi to Western readers. Jung later recorded that the text broke his interpretive isolation and turned him decisively toward alchemy. Thomas Cleary's 1991 retranslation argued that Wilhelm worked from a corrupt, truncated edition — a caution now standard in the scholarship.",
    "technique": "The Chinese text describes \"turning the light around\" (huiguang fanzhao): reversing attention inward in seated stillness, coordinated with the breath, so that an inner \"golden flower\" — in neidan terms, the germ of an immortal spirit-body — is said to form. It is inner, meditative alchemy; no laboratory substances are involved.",
    "label": "documented",
    "sources": [
      "Richard Wilhelm & C. G. Jung, Das Geheimnis der goldenen Blüte (Munich: Dornverlag Grete Ullmann, 1929); trans. Cary F. Baynes (1931)",
      "Thomas Cleary, The Secret of the Golden Flower: The Classic Chinese Book of Life (1991), introduction",
      "Richard Wilhelm (trans.) with C. G. Jung, Das Geheimnis der Goldenen Blüte: Ein chinesisches Lebensbuch, Dornverlag, 1929",
      "Cary F. Baynes (trans.), The Secret of the Golden Flower: A Chinese Book of Life, 1931",
      "Thomas Cleary, The Secret of the Golden Flower, HarperCollins, 1991"
    ],
    "contested": null,
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung wing"
    }
  },
  {
    "slug": "claim-5000-year-yoga",
    "lane": "yoga-vedanta",
    "title": "The '5,000-year-old postural yoga' claim",
    "titleOriginal": null,
    "dateText": "claim crystallized 20th c. (Marshall 1931) – present",
    "sortYear": 1931,
    "sortYearEnd": null,
    "dateCertainty": "century",
    "kind": "event",
    "place": "Global popular yoga culture",
    "body": "The popular assertion that today's postural yoga is a continuous 5,000-year-old practice. It leans on John Marshall's 1931 reading of a Mohenjo-daro seal as a proto-Shiva in yogic posture — an identification Srinivasan and others have seriously challenged — and on conflating ancient meditative yoga, which is genuinely documented, with modern asana practice, which is not: most of today's postural repertoire is unattested before the 19th–20th centuries. The antiquity claim as stated is false; the ancient contemplative tradition is real.",
    "technique": null,
    "label": "debunked",
    "sources": [
      "Mark Singleton, Yoga Body: The Origins of Modern Posture Practice (OUP, 2010)",
      "Doris Srinivasan, 'The So-Called Proto-Śiva Seal from Mohenjo-Daro: An Iconological Assessment' (Archives of Asian Art, 1975–76)",
      "Geoffrey Samuel, The Origins of Yoga and Tantra (Cambridge, 2008)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-eranos",
    "lane": "confluence",
    "title": "Jung at Eranos; Psychology and Alchemy",
    "titleOriginal": null,
    "dateText": "1933 onward; Psychologie und Alchemie 1944",
    "sortYear": 1933,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Ascona",
    "body": "From 1933 Olga Fröbe-Kapteyn convened annual conferences at her estate on Lago Maggiore near Ascona; Rudolf Otto proposed the name Eranos, \"shared banquet.\" Jung lectured there for decades, and his Eranos papers of 1935–36 grew into Psychologie und Alchemie (Zurich: Rascher, 1944), which read Western alchemical imagery as projected symbolism of psychological individuation — a study of symbols, not a validation of alchemy or of laboratory transmutation. Scholem, Corbin and Eliade made Eranos the crossroads where comparative religion met depth psychology.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Hans Thomas Hakl, Eranos: An Alternative Intellectual History of the Twentieth Century (2013)",
      "C. G. Jung, Psychologie und Alchemie (Zurich: Rascher, 1944); English CW 12 (1953)"
    ],
    "contested": null,
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung wing"
    }
  },
  {
    "slug": "event-emerald-tablet-egypt-myth",
    "lane": "alchemy-west",
    "title": "The 'ancient Egyptian Emerald Tablet' myth",
    "titleOriginal": null,
    "dateText": "medieval legend; modern form incl. Doreal's 'Tablets of Thoth' (first issued c. 1939)",
    "sortYear": 1939,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "event",
    "place": "Popular occult literature (Europe and USA)",
    "body": "Popular occultism presents the Emerald Tablet as a primordial Egyptian inscription — carved by the god-sage Hermes-Thoth, discovered in his tomb, even carried from Atlantis, as in Maurice Doreal's channeled 'Emerald Tablets of Thoth the Atlantean' (first issued c. 1939; bibliographies of the Brotherhood of the White Temple editions differ on the exact year). Philology finds otherwise: no ancient Greek or Egyptian text of the Tablet has ever surfaced, and it is first attested in an Arabic compilation of c. 750–850 CE, as Ruska, Kraus, and Weisser established — scholars debate only whether a lost late-antique Greek or Syriac source lies behind the Arabic. The claimed primordial antiquity is legend; the Arabic tablet is the documented reality.",
    "technique": null,
    "label": "debunked",
    "sources": [
      "Julius Ruska, Tabula Smaragdina, 1926",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013",
      "Florian Ebeling, The Secret History of Hermes Trismegistus, 2007"
    ],
    "contested": null,
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "major-trends",
    "lane": "kabbalah",
    "title": "Scholem, Major Trends in Jewish Mysticism",
    "titleOriginal": null,
    "dateText": "lectures 1938; published 1941",
    "sortYear": 1941,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "New York / Jerusalem",
    "body": "Gershom Scholem's nine lectures, delivered at the Jewish Institute of Religion in New York in 1938 as the Hilda Stich Stroock Lectures and published by Schocken in Jerusalem in 1941, founded the modern academic study of Jewish mysticism: a philologically rigorous history running from Merkabah mysticism through the Zohar, Luria, Sabbatianism, and Hasidism. Scholem argued that mysticism was a vital, sometimes anarchic force within Judaism rather than a marginal aberration. Later scholars — Idel, Liebes, Schäfer — have revised many of his conclusions while working inside the field he created.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (Jerusalem: Schocken Publishing House; New York: Jewish Institute of Religion, 1941)",
      "Stanford Encyclopedia of Philosophy, 'Gershom Scholem'"
    ],
    "contested": null,
    "siteLink": {
      "href": "library/index.html",
      "label": "The Library"
    }
  },
  {
    "slug": "person-thomas-merton",
    "lane": "christian",
    "title": "Thomas Merton",
    "titleOriginal": null,
    "dateText": "1915–1968",
    "sortYear": 1941,
    "sortYearEnd": 1968,
    "dateCertainty": "range",
    "kind": "person",
    "place": "Abbey of Gethsemani, Kentucky",
    "body": "Thomas Merton (1915–1968), Trappist monk of Gethsemani Abbey, Kentucky, carried contemplative Christianity into the American mainstream: his autobiography The Seven Storey Mountain (1948) became an unexpected bestseller, and works such as New Seeds of Contemplation (1961) recovered the apophatic tradition for lay readers. In his final decade he pursued documented dialogue with Zen Buddhism (D.T. Suzuki), Sufi correspondents and Asian monasticism, dying by accidental electrocution in Bangkok in 1968 during a monastic conference. Later centering-prayer teachers credited his vocabulary of prayer 'centered' on God's presence.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Lawrence S. Cunningham, Thomas Merton and the Monastic Vision (Eerdmans, 1999)",
      "William H. Shannon, Christine M. Bochen & Patrick F. O'Connell, The Thomas Merton Encyclopedia (Orbis, 2002)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "autobiography-of-a-yogi",
    "lane": "confluence",
    "title": "Autobiography of a Yogi",
    "titleOriginal": null,
    "dateText": "1946",
    "sortYear": 1946,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "New York",
    "body": "Paramahansa Yogananda, resident in America since 1920, published his life story with New York's Philosophical Library in December 1946. Mixing memoir, hagiography and apologetics, it presents Kriya Yoga through a lineage running from Lahiri Mahasaya and Sri Yukteswar; miracle narratives are integral and are offered as testimony, not evidence. Continuously in print since — and famously distributed at Steve Jobs's memorial — it became modern yoga's most effective single piece of literature and the template for the guru autobiography in English.",
    "technique": "The book describes Kriya Yoga as an initiation-only pranayama discipline — controlled circulation of breath and attention along the spinal axis — which Yogananda characterizes as accelerating spiritual evolution. That characterization belongs to the tradition's self-description; no such physiological effect has been demonstrated.",
    "label": "documented",
    "sources": [
      "Paramhansa Yogananda, Autobiography of a Yogi (New York: Philosophical Library, 1946)",
      "Philip Goldberg, American Veda (2010)"
    ],
    "contested": null,
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga wing"
    }
  },
  {
    "slug": "eliade-yoga",
    "lane": "confluence",
    "title": "Yoga: Immortality and Freedom",
    "titleOriginal": "Le Yoga: Immortalité et liberté",
    "dateText": "1954 (English 1958)",
    "sortYear": 1954,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Paris",
    "body": "Mircea Eliade's Le Yoga: Immortalité et liberté (Paris: Payot, 1954; English by Willard R. Trask, 1958, in the Bollingen Series) grew from his Bucharest doctorate and Indian years into the century's most influential scholarly synthesis of yoga, framed by his categories of archaic soteriology and \"enstasis.\" For half a century it defined academic yoga studies; later text-critical work, above all Mallinson and Singleton's Roots of Yoga, has revised much of its picture, especially the history of hatha yoga.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Mircea Eliade, Le Yoga: Immortalité et liberté (Paris: Payot, 1954)",
      "Mircea Eliade, Yoga: Immortality and Freedom, trans. W. R. Trask (Bollingen, 1958)"
    ],
    "contested": null,
    "siteLink": {
      "href": "yoga/index.html",
      "label": "Yoga wing"
    }
  },
  {
    "slug": "way-of-zen",
    "lane": "confluence",
    "title": "The Way of Zen",
    "titleOriginal": null,
    "dateText": "1957",
    "sortYear": 1957,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "New York",
    "body": "Alan Watts's Pantheon volume, drawing openly on D. T. Suzuki's essays while adding a history of Zen's Taoist background, became the Zen boom's most readable gateway and a bestseller among Beat and later counterculture readers. Watts wrote as an interpreter rather than a trained Zen scholar-practitioner, a limit he acknowledged, and in \"Beat Zen, Square Zen, and Zen\" (1958) he himself criticized the fad the book helped create. It marks the moment Zen entered the American vernacular.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Alan Watts, The Way of Zen (New York: Pantheon, 1957)",
      "Rick Fields, How the Swans Came to the Lake: A Narrative History of Buddhism in America (1981)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "the-sufis",
    "lane": "islamic",
    "title": "The Sufis (Idries Shah)",
    "titleOriginal": null,
    "dateText": "1964 (Doubleday, New York)",
    "sortYear": 1964,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "London / New York",
    "body": "Idries Shah's The Sufis (Doubleday, 1964), introduced by Robert Graves, presented Sufism as a universal wisdom current older than Islam, transmitted through teaching-stories such as the Mulla Nasrudin corpus, and made Sufi ideas fashionable among Western writers. Its publication and popular impact are documented; its scholarly standing is not. The Orientalist L.P. Elwell-Sutton judged Shah's books error-ridden 'pseudo-Sufism', and Graves privately conceded — 'misleading: he is one of us, not a Moslem personage' — that his lineage framing for Shah was misleading. Both assessments are preserved here without adjudication.",
    "technique": null,
    "label": "disputed",
    "sources": [
      "Idries Shah, The Sufis (Doubleday, 1964; intro. Robert Graves)",
      "L.P. Elwell-Sutton, 'Sufism & Pseudo-Sufism', Encounter 44 (May 1975)",
      "Mark Sedgwick, 'Neo-Sufism in the 1960s: Idries Shah' (CISMOR conference paper, 2018)"
    ],
    "contested": {
      "flag": "Whether Shah transmitted an authentic Sufi tradition or constructed a de-Islamized 'universal Sufism'",
      "positions": [
        {
          "source": "Idries Shah, The Sufis (1964), with Robert Graves's introduction",
          "value": "Sufism is a perennial wisdom stream predating and exceeding Islam, and Shah — presented as heir to a distinguished lineage — is its authorized contemporary exponent"
        },
        {
          "source": "L.P. Elwell-Sutton, 'Sufism & Pseudo-Sufism', Encounter 44 (May 1975)",
          "value": "Shah's work is 'pseudo-Sufism' centred on man rather than God: error-ridden, philologically careless, with inflated lineage claims (Graves himself privately called the lineage framing misleading)"
        }
      ]
    },
    "siteLink": null
  },
  {
    "slug": "yates-1964",
    "lane": "confluence",
    "title": "Giordano Bruno and the Hermetic Tradition",
    "titleOriginal": null,
    "dateText": "1964",
    "sortYear": 1964,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "London",
    "body": "Frances Yates's Giordano Bruno and the Hermetic Tradition (Routledge & Kegan Paul) recovered the Hermetic core of Renaissance magic from Ficino to Bruno and effectively founded the modern academic study of Western esotericism. Her further suggestion that the magus's operative stance helped prepare the Scientific Revolution hardened into a \"Yates thesis\" that subsequent scholarship has largely rejected — while retaining her documentary achievement. The book made Casaubon's 1614 redating the hinge of its narrative.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Frances A. Yates, Giordano Bruno and the Hermetic Tradition (London: Routledge & Kegan Paul, 1964)",
      "Wouter J. Hanegraaff, \"Beyond the Yates Paradigm\", Aries 1:1 (2001)",
      "Brian Vickers (ed.), Occult and Scientific Mentalities in the Renaissance (1984)"
    ],
    "contested": {
      "flag": "Validity of the 'Yates thesis' that the Hermetic tradition helped generate the Scientific Revolution",
      "positions": [
        {
          "source": "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964) and later essays",
          "value": "Renaissance Hermeticism, by dignifying the operative magus, prepared the will toward operating on the world that issued in early modern science."
        },
        {
          "source": "Brian Vickers (ed.), Occult and Scientific Mentalities in the Renaissance (1984); Wouter Hanegraaff, \"Beyond the Yates Paradigm\", Aries 1:1 (2001)",
          "value": "The grand narrative overstates a unified 'Hermetic tradition' and its causal role in science; the paradigm dissolved under closer textual and historiographic scrutiny."
        }
      ]
    },
    "siteLink": {
      "href": "greatworks/hermetica.html",
      "label": "Hermetica in the Great Works wing"
    }
  },
  {
    "slug": "light-on-yoga",
    "lane": "yoga-vedanta",
    "title": "Light on Yoga (B.K.S. Iyengar)",
    "titleOriginal": null,
    "dateText": "1966 (London: George Allen & Unwin)",
    "sortYear": 1966,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Pune, India / London, UK",
    "body": "B.K.S. Iyengar's encyclopedic manual, published in London by George Allen & Unwin with a foreword by the violinist Yehudi Menuhin: some 200 asanas documented in roughly 600 photographs of Iyengar's own body, followed by accounts of the bandhas, kriyas and pranayama. Translated into more than twenty languages and selling over three million copies, it became the de facto global reference for postural practice — often called the 'bible of modern yoga' — standardizing asana names and forms worldwide.",
    "technique": "The book describes each posture step by step, graded by difficulty and annotated with claimed effects and cautions, together with timed breath-control practices — a photographic codification of a Mysore-lineage repertoire rather than a meditative treatise.",
    "label": "documented",
    "sources": [
      "B.K.S. Iyengar, Light on Yoga (George Allen & Unwin, 1966)",
      "Wikipedia, 'Light on Yoga' (accessed 2026)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-rishikesh-1968",
    "lane": "confluence",
    "title": "The Beatles at Rishikesh",
    "titleOriginal": null,
    "dateText": "February–April 1968",
    "sortYear": 1968,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "Rishikesh",
    "body": "In February 1968 the Beatles joined a Transcendental Meditation teacher-training course at Maharishi Mahesh Yogi's ashram above the Ganges, alongside Donovan, Mike Love and Mia Farrow; stays ranged from Starr's ten days to Harrison's and Lennon's nearly two months, during which much of the White Album was written. The most photographed meditation event of the century mainstreamed mantra meditation in the West — but it capped, rather than began, almost two centuries of transmission running from Wilkins and Anquetil-Duperron through Vivekananda and Yogananda.",
    "technique": "Transcendental Meditation as taught by Maharishi Mahesh Yogi: silent mental repetition of an individually assigned Sanskrit mantra for 15–20 minutes twice daily, without concentration or contemplation. Claims of unique physiological benefit later attracted systematic criticism of the supporting research's quality (Canter & Ernst 2004; Ospina et al. 2007).",
    "label": "documented",
    "sources": [
      "Philip Goldberg, American Veda (2010)",
      "Ian MacDonald, Revolution in the Head (1994)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "needham-scc-vol5",
    "lane": "daoist",
    "title": "Needham, Science and Civilisation in China, vol. 5 (alchemy parts)",
    "titleOriginal": null,
    "dateText": "parts 2–5 published 1974–1983",
    "sortYear": 1974,
    "sortYearEnd": 1983,
    "dateCertainty": "range",
    "kind": "text",
    "place": "Cambridge, England",
    "body": "The scholarship anchor for Chinese alchemy: Joseph Needham's Science and Civilisation in China, volume 5 ('Chemistry and Chemical Technology'), whose 'Spagyrical Discovery and Invention' parts — 2 (1974), 3 (1976), 4 (1980), and 5, 'Physiological Alchemy' (1983) — were written with Lu Gwei-djen, Ho Ping-Yü, and Nathan Sivin. They survey elixir chemistry, apparatus, and neidan, and, with Ho and Needham's earlier 1959 study, established the medical identification of elixir sickness as mercury, lead, and arsenic poisoning.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Joseph Needham, with Lu Gwei-djen, Ho Ping-Yü, and Nathan Sivin, Science and Civilisation in China, vol. 5, parts 2–5, Cambridge University Press, 1974–1983",
      "Ho Ping-Yü and Joseph Needham, 'Elixir Poisoning in Mediaeval China', Janus 48, 1959"
    ],
    "contested": null,
    "siteLink": {
      "href": "library/index.html",
      "label": "The Library"
    }
  },
  {
    "slug": "centering-prayer",
    "lane": "christian",
    "title": "Centering Prayer",
    "titleOriginal": null,
    "dateText": "mid-1970s (workshops from 1974–75; Contemplative Outreach 1984)",
    "sortYear": 1975,
    "sortYearEnd": null,
    "dateCertainty": "decade",
    "kind": "institution",
    "place": "St. Joseph's Abbey, Spencer, Massachusetts",
    "body": "In the mid-1970s three Trappists of St. Joseph's Abbey, Spencer, Massachusetts — William Meninger, Basil Pennington and Thomas Keating — distilled a simple silent-prayer method for laypeople drawn to Eastern meditation. Meninger built it explicitly on The Cloud of Unknowing; the name honors Thomas Merton's description of prayer 'centered entirely on the presence of God.' It is a modern adaptation of medieval sources, not an ancient practice: formalized in workshops from 1974–75 and organized as the Contemplative Outreach network in 1984.",
    "technique": "The published method has the practitioner sit for twenty minutes twice daily, silently introduce a chosen 'sacred word' as a symbol of consent to God's presence, and, on noticing engagement with any thought, return 'ever-so-gently' to the word. Documented from Keating's Open Mind, Open Heart (1986); described, not prescribed.",
    "label": "documented",
    "sources": [
      "Thomas Keating, Open Mind, Open Heart (Amity House, 1986)",
      "Contemplative Outreach, 'The History of Centering Prayer' (contemplativeoutreach.org)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "christian-meditation",
    "lane": "christian",
    "title": "Christian Meditation (John Main)",
    "titleOriginal": null,
    "dateText": "1975 (first Christian Meditation Centre, Ealing Abbey; WCCM founded 1991)",
    "sortYear": 1975,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "institution",
    "place": "Ealing Abbey, London",
    "body": "Benedictine John Main (1926–1982), who had first learned mantra meditation from Swami Satyananda in Malaya, later found what he took to be its Christian counterpart in Cassian's tenth Conference and opened the first Christian Meditation Centre at Ealing Abbey, London, in 1975. His teaching — a modern adaptation framed as recovery, not a continuously transmitted ancient rite — spread through Word into Silence (1980) and, after his death, through the World Community for Christian Meditation (1991), led by Laurence Freeman.",
    "technique": "Main taught two daily periods of twenty to thirty minutes silently repeating the Aramaic phrase 'maranatha' ('Come, Lord'), continuously and without imagery, from the beginning to the end of each sitting — a practice he grounded in Cassian's counsel of the single unceasing formula. Historical description of his published teaching.",
    "label": "documented",
    "sources": [
      "John Main, Word into Silence (Darton, Longman & Todd, 1980)",
      "WCCM, 'John Main OSB' (wccm.org biography)",
      "Paul T. Harris (ed.), John Main by Those Who Knew Him (1991)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "miracle-of-mindfulness",
    "lane": "buddhist",
    "title": "The Miracle of Mindfulness",
    "titleOriginal": "Phép Lạ Của Sự Tỉnh Thức",
    "dateText": "1975 (Vietnamese); English tr. Mobi Ho, Beacon Press, 1976",
    "sortYear": 1975,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Written in exile in France, for social workers in Vietnam",
    "body": "Thich Nhat Hanh wrote this small manual in 1974–75 as a long letter to a colleague in the School of Youth for Social Service, to sustain relief workers amid the Vietnam War; it was published in Vietnamese in 1975 and in Mobi Ho's English translation soon after (Beacon Press first edition, 1976). It carried mindfulness out of the meditation hall into washing dishes and drinking tea, and became a founding text of engaged, everyday-life Buddhist practice in the West.",
    "technique": "The book describes maintaining bare attention on the breath and on ordinary activities — walking, washing dishes, drinking tea — treating each act as itself the object of meditation, with a weekly 'day of mindfulness' and gentle breath-counting for beginners.",
    "label": "documented",
    "sources": [
      "Plum Village, 'The Miracle of Mindfulness (1975)' (official bibliography)",
      "Thich Nhat Hanh, The Miracle of Mindfulness, tr. Mobi Ho, Beacon Press, 1976"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "relaxation-response",
    "lane": "confluence",
    "title": "The Relaxation Response",
    "titleOriginal": null,
    "dateText": "1975",
    "sortYear": 1975,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Boston / New York",
    "body": "Harvard cardiologist Herbert Benson, whose laboratory had measured lowered metabolism and blood pressure in Transcendental Meditation practitioners (Wallace, Benson & Wilson, 1971), argued in this Morrow bestseller that a generic, secular \"relaxation response\" underlies such effects, detaching the physiology from any particular tradition. The book carried meditation into cardiology and stress medicine. Later systematic reviews — Canter and Ernst (2004) on TM and blood pressure, Ospina et al. (2007) for AHRQ — judged much meditation research methodologically weak, a caution the field now cites.",
    "technique": "Benson's published protocol consisted of sitting quietly with closed eyes, silently repeating a neutral word such as \"one\" on each exhalation, and passively disregarding intruding thoughts, for 10–20 minutes once or twice daily — a deliberately de-traditionalized adaptation of mantra meditation, described here as history of medicine.",
    "label": "documented",
    "sources": [
      "Herbert Benson with Miriam Z. Klipper, The Relaxation Response (New York: Morrow, 1975)",
      "R. K. Wallace, H. Benson & A. F. Wilson, \"A wakeful hypometabolic physiologic state\", American Journal of Physiology 221 (1971)",
      "M. B. Ospina et al., \"Meditation Practices for Health: State of the Research\", AHRQ Evidence Report 155 (2007)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-mbsr-1979",
    "lane": "buddhist",
    "title": "Kabat-Zinn Founds MBSR (Stress Reduction Clinic)",
    "titleOriginal": null,
    "dateText": "September 1979",
    "sortYear": 1979,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "event",
    "place": "University of Massachusetts Medical School, Worcester, USA",
    "body": "Jon Kabat-Zinn, trained in Zen (Kapleau, Seung Sahn, Thich Nhat Hanh) and in vipassanā at the Insight Meditation Society, opened the Stress Reduction Clinic in September 1979, teaching an eight-week program of body scan, sitting meditation and hatha yoga to chronic-pain patients. Mindfulness-Based Stress Reduction deliberately recast Buddhist-derived practice in secular, clinical language, launching the scientific mindfulness field. The retrospective claim that the Buddha taught 'stress reduction' is an anachronism: MBSR is a modern re-framing, not an ancient program.",
    "technique": "MBSR's protocol, as documented, comprises eight weekly classes plus a day-long retreat: a supine 'body scan' moving attention through the body, seated awareness of breath and sensation, gentle hatha yoga, and informal mindfulness of daily activities, framed in secular medical vocabulary.",
    "label": "documented",
    "sources": [
      "Jon Kabat-Zinn, Full Catastrophe Living, 1990",
      "Jon Kabat-Zinn, 'Some reflections on the origins of MBSR, skillful means, and the trouble with maps', Contemporary Buddhism 12(1), 2011",
      "Jeff Wilson, Mindful America, 2014"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "event-mind-and-life-1987",
    "lane": "confluence",
    "title": "The Mind & Life Institute",
    "titleOriginal": null,
    "dateText": "first Dialogue 1987; institute incorporated 1991",
    "sortYear": 1987,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "institution",
    "place": "Dharamsala",
    "body": "In October 1987 the neuroscientist Francisco Varela, the entrepreneur R. Adam Engle and the Fourteenth Dalai Lama held the first Mind & Life Dialogue in Dharamsala; the dialogue series was incorporated as the Mind & Life Institute in 1991 and has since brokered sustained exchange between Buddhist contemplatives and cognitive science. Gentle Bridges (1992) records that first meeting. The venture helped legitimate meditation as a research object — the field now called contemplative neuroscience — while critics within that field continue to press on hype, small samples and publication bias.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Jeremy W. Hayward & Francisco J. Varela (eds.), Gentle Bridges: Conversations with the Dalai Lama on the Sciences of Mind (1992)",
      "Mind & Life Institute, institutional history (mindandlife.org; first Dialogue 1987, incorporated 1991)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "alchemical-body",
    "lane": "tantra-rasa",
    "title": "The Alchemical Body",
    "titleOriginal": null,
    "dateText": "1996",
    "sortYear": 1996,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Chicago, USA",
    "body": "David Gordon White's The Alchemical Body: Siddha Traditions in Medieval India (University of Chicago Press, 1996) reconstructed the lost world of the Rasa Siddhas and Nath Siddhas, arguing that mercurial alchemy and hatha yoga were parallel, intertwined technologies of bodily immortality — 'as in metal, so in the body.' It remains the standard English study of rasashastra's religious context, read alongside Meulenbeld's and Wujastyk's philological work; some of its broader identifications are debated among specialists.",
    "technique": null,
    "label": "documented",
    "sources": [
      "David Gordon White, The Alchemical Body: Siddha Traditions in Medieval India (University of Chicago Press, 1996)",
      "University of Chicago Press catalogue entry for The Alchemical Body"
    ],
    "contested": null,
    "siteLink": {
      "href": "rasa.html",
      "label": "Rasashastra page"
    }
  },
  {
    "slug": "yoga-body",
    "lane": "yoga-vedanta",
    "title": "Yoga Body (Mark Singleton)",
    "titleOriginal": null,
    "dateText": "2010 (Oxford University Press)",
    "sortYear": 2010,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Oxford, UK",
    "body": "Mark Singleton's monograph argues that popular postural yoga is not a linear descendant of medieval hatha yoga but a modern synthesis forged between the mid-19th century and the Second World War, drawing on Scandinavian gymnastics, British physical culture, bodybuilding, harmonial movements, and Indian nationalism's search for an indigenous exercise regime. The book reset the historiography of modern yoga and supplied the scholarly basis for distinguishing the ancient meditative tradition from the recent postural canon.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Mark Singleton, Yoga Body: The Origins of Modern Posture Practice (Oxford University Press, 2010)",
      "Oxford University Press catalogue entry, 'Yoga Body' (ISBN 9780195395341)"
    ],
    "contested": null,
    "siteLink": null
  },
  {
    "slug": "hanegraaff-2012",
    "lane": "confluence",
    "title": "Esotericism and the Academy",
    "titleOriginal": null,
    "dateText": "2012",
    "sortYear": 2012,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Cambridge / Amsterdam",
    "body": "Wouter Hanegraaff's Esotericism and the Academy: Rejected Knowledge in Western Culture (Cambridge, 2012) narrates how Hermetism, Kabbalah, magic and alchemy were expelled from respectable learning by Protestant and Enlightenment polemic, then re-entered it as objects of historical study. With Gershom Scholem's 1925 appointment as lecturer in Jewish mysticism at the newly opened Hebrew University (he became its first professor of the subject in 1933) as the founding precedent, and the Amsterdam, Sorbonne and Exeter chairs as institutions, the book consolidated esotericism studies as a discipline that analyzes such currents without endorsing their claims.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Wouter J. Hanegraaff, Esotericism and the Academy: Rejected Knowledge in Western Culture (Cambridge University Press, 2012)",
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941)"
    ],
    "contested": null,
    "siteLink": {
      "href": "library/index.html",
      "label": "The expert Library"
    }
  },
  {
    "slug": "secrets-of-alchemy",
    "lane": "alchemy-west",
    "title": "The Secrets of Alchemy (Principe) and the historiography debate",
    "titleOriginal": null,
    "dateText": "2013 (debate from Jung 1944 to Principe & Newman 2001)",
    "sortYear": 2013,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "text",
    "place": "Chicago, USA",
    "body": "Lawrence Principe's The Secrets of Alchemy (University of Chicago Press, 2013) distills the 'new historiography' he and William Newman built: alchemy as a serious experimental enterprise whose cover-names (Decknamen) encode replicable laboratory operations, several of which Principe reproduced. The book presses their critique of the Jungian tradition, which reads the opus as psychic projection and individuation. The disagreement is genuine and unresolved: historians of chemistry and the analytical-psychology tradition continue to read the same texts in incompatible ways.",
    "technique": null,
    "label": "documented",
    "sources": [
      "Lawrence M. Principe, The Secrets of Alchemy, 2013",
      "Lawrence M. Principe & William R. Newman, 'Some Problems with the Historiography of Alchemy', in Secrets of Nature (MIT Press), 2001",
      "C. G. Jung, Psychologie und Alchemie, 1944"
    ],
    "contested": {
      "flag": "Was alchemy essentially a spiritual/psychological discipline or a material laboratory practice?",
      "positions": [
        {
          "source": "C. G. Jung, Psychologie und Alchemie, 1944",
          "value": "alchemical imagery records the projection of unconscious contents; the opus mirrors the psychological process of individuation"
        },
        {
          "source": "Principe & Newman, 'Some Problems with the Historiography of Alchemy', 2001; Principe 2013",
          "value": "the 'spiritual alchemy' reading is a 19th–20th-century anachronism; historical alchemists pursued material laboratory goals encoded in Decknamen"
        }
      ]
    },
    "siteLink": {
      "href": "jung/index.html",
      "label": "Jung and alchemy"
    }
  },
  {
    "slug": "roots-of-yoga",
    "lane": "yoga-vedanta",
    "title": "Roots of Yoga (Mallinson & Singleton)",
    "titleOriginal": null,
    "dateText": "2017 (Penguin Classics)",
    "sortYear": 2017,
    "sortYearEnd": null,
    "dateCertainty": "year",
    "kind": "translation",
    "place": "London, UK",
    "body": "Mallinson and Singleton's sourcebook of yoga's primary literature: commentary and translations from more than a hundred texts in Sanskrit, Tibetan, Arabic, Persian, Pali, Tamil and other languages, spanning roughly 1000 BCE to the mid-19th century, many rendered into English for the first time. Organized thematically — posture, breath, mantra, meditation, liberation — it made the actual textual record of yoga publicly checkable and is now the standard reference anthology for the field.",
    "technique": null,
    "label": "documented",
    "sources": [
      "James Mallinson & Mark Singleton (trans., ed.), Roots of Yoga (Penguin Classics, 2017)",
      "Penguin Random House catalogue entry, 'Roots of Yoga' (ISBN 9780241253045)",
      "James Mallinson & Mark Singleton, Roots of Yoga (Penguin Classics, 2017)",
      "Mark Singleton, Yoga Body: The Origins of Modern Posture Practice (Oxford, 2010)"
    ],
    "contested": null,
    "siteLink": null
  }
];

export const CONFLUENCE_EDGES = [
  {
    "from": "amrtasiddhi",
    "to": "dattatreyayogasastra",
    "kind": "influence",
    "body": "The Dattatreyayogasastra's core physical trio — mahamudra, mahabandha and mahavedha — is the practice set first taught in the Buddhist Amrtasiddhi, transposed into a Vaishnava frame; Mallinson documents the Amrtasiddhi as the source of these techniques in the later hatha corpus.",
    "sources": [
      "James Mallinson, 'The Amṛtasiddhi: Haṭhayoga's Tantric Buddhist Source Text', in Śaivism and the Tantric Traditions (Brill, 2020)"
    ]
  },
  {
    "from": "amrtasiddhi",
    "to": "hathayogapradipika",
    "kind": "influence",
    "body": "The Hathapradipika borrows a few Amrtasiddhi verses without attribution, as Mallinson documents; Birch's work on the closely related Amaraughaprabodha — some of whose verses were themselves copied into the Hathapradipika — suggests that text as a likely intermediary for the transmission.",
    "sources": [
      "James Mallinson & Péter-Dániel Szántó, The Amṛtasiddhi and Amṛtasiddhimūla (2021)",
      "James Mallinson, 'The Amṛtasiddhi: Haṭhayoga's Tantric Buddhist Source Text' (Brill, 2020)",
      "Jason Birch, 'The Amaraughaprabodha: New Evidence on the Manuscript Transmission of an Early Work on Haṭha- and Rājayoga' (Journal of Indian Philosophy, 2019)"
    ]
  },
  {
    "from": "amrtasiddhi",
    "to": "shiva-samhita",
    "kind": "influence",
    "body": "The Shiva Samhita shares thirty-four verses with the Amrtasiddhi, silently absorbing material of Buddhist Vajrayana origin into a Shaiva-Vedantic compendium — one of the clearest documented cross-tradition transfers in the hatha corpus.",
    "sources": [
      "James Mallinson, 'The Amṛtasiddhi: Haṭhayoga's Tantric Buddhist Source Text' (Brill, 2020)",
      "James Mallinson, The Shiva Samhita: A Critical Edition (2007)"
    ]
  },
  {
    "from": "anapanasati-sutta",
    "to": "visuddhimagga",
    "kind": "commentary",
    "body": "Visuddhimagga chapter VIII gives the most detailed classical exposition of mindfulness of breathing, treating the sutta's sixteen steps as one of the forty kammaṭṭhāna and the one recommended for all temperaments.",
    "sources": [
      "Bhikkhu Ñāṇamoli (tr.), The Path of Purification, 1956, ch. VIII"
    ]
  },
  {
    "from": "baopuzi",
    "to": "event-tang-elixir-deaths",
    "kind": "influence",
    "body": "The cinnabar-and-gold elixir doctrine the Baopuzi codified remained the model for the ingestible court elixirs whose mercury, lead, and arsenic killed Tang emperors, as Ho Ping-Yü and Needham documented.",
    "sources": [
      "Ho Ping-Yü and Joseph Needham, 'Elixir Poisoning in Mediaeval China', Janus 48, 1959",
      "Joseph Needham et al., Science and Civilisation in China, vol. 5 pt. 3, 1976"
    ]
  },
  {
    "from": "bardo-thodol",
    "to": "tibetan-book-of-the-dead",
    "kind": "translation",
    "body": "Kazi Dawa Samdup's English rendering of part of Karma Lingpa's Bardo Thödol cycle, edited and framed by W. Y. Evans-Wentz, was published by Oxford in 1927 as The Tibetan Book of the Dead — a partial translation completed and glossed by Evans-Wentz after the translator's death in 1922.",
    "sources": [
      "Donald S. Lopez Jr., Prisoners of Shangri-La, 1998",
      "Bryan J. Cuevas, The Hidden History of the Tibetan Book of the Dead, 2003"
    ]
  },
  {
    "from": "bayt-al-hikma",
    "to": "event-toledo-translations",
    "kind": "influence",
    "body": "The twelfth-century Latin translators worked from the Arabic versions the Abbasid movement had produced: Gerard of Cremona's Almagest and much of the Toledo corpus were Latin renderings of Arabic intermediaries, Greek science reaching Latin Europe through Baghdad's Arabic.",
    "sources": [
      "Charles Burnett, 'The Coherence of the Arabic-Latin Translation Program in Toledo', Science in Context 14 (2001)",
      "Dimitri Gutas, Greek Thought, Arabic Culture (1998)"
    ]
  },
  {
    "from": "bayt-al-hikma",
    "to": "jabir-corpus",
    "kind": "influence",
    "body": "The Jabirian corpus presupposes the Graeco-Arabic translations: Kraus's foundational study traced its systematic debts to translated Greek philosophical, medical and alchemical literature, from Aristotelian natural philosophy to the legacy of Zosimos.",
    "sources": [
      "Paul Kraus, Jābir ibn Ḥayyān: Contribution à l'histoire des idées scientifiques dans l'Islam, vol. II (Cairo, 1942)",
      "Dimitri Gutas, Greek Thought, Arabic Culture (1998)"
    ]
  },
  {
    "from": "bhagavad-gita",
    "to": "event-wilkins-gita-1785",
    "kind": "translation",
    "body": "Wilkins's 1785 Bhagvat-Geeta was the first printed translation of a complete Sanskrit work directly into English, financed by the East India Company at Hastings's urging.",
    "sources": [
      "Charles Wilkins, The Bhăgvăt-Gēētā (1785)",
      "Richard H. Davis, The Bhagavad Gita: A Biography (2014)"
    ]
  },
  {
    "from": "brhadaranyaka-upanisad",
    "to": "sirr-i-akbar",
    "kind": "translation",
    "body": "Dara Shikoh and the pandits of Banaras rendered fifty Upanishads from Sanskrit into Persian in 1657, framing them as the Quran's 'hidden book.'",
    "sources": [
      "Supriya Gandhi, The Emperor Who Never Was (2020)",
      "Urs App, The Birth of Orientalism (2010)"
    ]
  },
  {
    "from": "cantong-qi",
    "to": "wuzhen-pian",
    "kind": "influence",
    "body": "Zhang Boduan wrote the Wuzhen pian in the Cantong qi's emblematic language of trigrams, lead, and mercury, and the neidan tradition paired the two as its ancestral and classic scriptures.",
    "sources": [
      "Fabrizio Pregadio, Awakening to Reality, Golden Elixir Press, 2009"
    ]
  },
  {
    "from": "cassian-conferences",
    "to": "christian-meditation",
    "kind": "adaptation",
    "body": "John Main grounded his mantra practice in Cassian's tenth Conference — Abba Isaac's counsel of the single continually repeated formula — reading it as a Christian precedent for the meditation he had learned in Malaya; a modern adaptation explicitly framed as recovery.",
    "sources": [
      "John Main, Word into Silence (Darton, Longman & Todd, 1980)",
      "WCCM, 'John Main OSB' (wccm.org biography)"
    ]
  },
  {
    "from": "cloud-of-unknowing",
    "to": "centering-prayer",
    "kind": "adaptation",
    "body": "William Meninger stated that he developed the centering-prayer method directly from The Cloud of Unknowing, found in the Spencer abbey library in 1974, and Contemplative Outreach's own history names the Cloud as the method's principal source — a twentieth-century adaptation, not a continuous lineage.",
    "sources": [
      "Contemplative Outreach, 'The History of Centering Prayer' (contemplativeoutreach.org)",
      "Thomas Keating, Open Mind, Open Heart (Amity House, 1986)"
    ]
  },
  {
    "from": "compound-of-alchymie",
    "to": "person-newton-alchemy",
    "kind": "influence",
    "body": "Newton copied, indexed, and glossed Ripley for decades; the Keynes manuscripts include his notes expounding Ripley's works.",
    "sources": [
      "William R. Newman, Newton the Alchemist, 2019",
      "Jennifer M. Rampling, The Experimental Fire, 2020"
    ]
  },
  {
    "from": "confucius-sinarum-philosophus",
    "to": "event-leibniz-iching",
    "kind": "influence",
    "body": "Jesuit sinology — Couplet's 1687 Confucius and the Figurist circle around Bouvet — framed Leibniz's engagement with China that culminated in the hexagram-binary correspondence.",
    "sources": [
      "Franklin Perkins, Leibniz and China (2004)",
      "D. E. Mungello, Curious Land (1985)"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "event-casaubon-1614",
    "kind": "refutation",
    "body": "Casaubon's philological analysis refuted the traditional pre-Mosaic dating of the Hermetic treatises, placing them in the early Common Era; the texts themselves were untouched.",
    "sources": [
      "Anthony Grafton, JWCI 46 (1983)",
      "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964), ch. 21"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "event-ficino-1463",
    "kind": "translation",
    "body": "Fourteen treatises of the Corpus Hermeticum, in the Greek manuscript Leonardo of Pistoia brought to Florence around 1460, were the object of Ficino's Latin version completed in April 1463 and printed at Treviso in 1471 as the Pimander.",
    "sources": [
      "Brian Copenhaver, Hermetica (1992), introduction",
      "Sebastiano Gentile & Carlos Gilly, Marsilio Ficino e il ritorno di Ermete Trismegisto (1999)"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "event-harran-sabians",
    "kind": "adaptation",
    "body": "Arabic authors report that the Harranian 'Sabians' claimed Hermes as their prophet and Hermetic books as their scripture — the accommodation by which Hermes became a Qur'anically legitimate prophet of science in Islam. Van Bladel treats the reports critically, tracing how the Arabic Hermes legend was constructed.",
    "sources": [
      "Kevin van Bladel, The Arabic Hermes (Oxford, 2009), ch. 3"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "kybalion",
    "kind": "adaptation",
    "body": "The Kybalion borrows the Hermetic name and the figure of Hermes, but Deslippe shows its content is Atkinson's New Thought; the claimed ancient axioms have no Hermetic source.",
    "sources": [
      "Philip Deslippe (ed.), The Kybalion: The Definitive Edition (2011)",
      "Mitch Horowitz, Occult America (2009)"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "oedipus-aegyptiacus",
    "kind": "influence",
    "body": "Kircher read the hieroglyphs through Hermetic doctrine, treating Hermes Trismegistus as the fountainhead of Egyptian wisdom despite Casaubon's redating.",
    "sources": [
      "Daniel Stolzenberg, Egyptian Oedipus (2013)",
      "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964)"
    ]
  },
  {
    "from": "corpus-hermeticum",
    "to": "yates-1964",
    "kind": "commentary",
    "body": "Yates's book is a historical study of the Hermetica's Renaissance reception from Ficino's 1463 translation to Bruno, and founded modern esotericism scholarship on that corpus.",
    "sources": [
      "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964)",
      "Brian Copenhaver, Hermetica (1992), introduction"
    ]
  },
  {
    "from": "daodejing",
    "to": "cantong-qi",
    "kind": "influence",
    "body": "Pregadio's analysis identifies Daoist (Daodejing/Huang-Lao) cosmology as one of the three subject-strands the Cantong qi 'seals into one' alongside Yijing emblems and alchemy.",
    "sources": [
      "Fabrizio Pregadio, The Seal of the Unity of the Three, Golden Elixir Press, 2011"
    ]
  },
  {
    "from": "dattatreyayogasastra",
    "to": "hathayogapradipika",
    "kind": "influence",
    "body": "Svatmarama's Hathapradipika is largely a compilation from earlier hatha works, and the Dattatreyayogasastra — the earliest text to teach yoga under the name hatha — is among the sources whose teachings and verses it incorporates.",
    "sources": [
      "James Mallinson & Mark Singleton, Roots of Yoga (2017)",
      "Wikipedia, 'Hatha Yoga Pradipika' (accessed 2026)"
    ]
  },
  {
    "from": "de-arte-cabalistica",
    "to": "de-occulta-philosophia",
    "kind": "influence",
    "body": "From Reuchlin, Agrippa took a framework for integrating kabbalistic doctrine — the power of the Hebrew divine names and the graded ladder of natural, celestial and ceremonial magic — documented among the principal sources of the 1533 text.",
    "sources": [
      "Vittoria Perrone Compagni (ed.), De occulta philosophia libri tres (Brill, 1992)",
      "'Heinrich Cornelius Agrippa von Nettesheim', Stanford Encyclopedia of Philosophy"
    ]
  },
  {
    "from": "dobrotolubiye",
    "to": "way-of-a-pilgrim",
    "kind": "influence",
    "body": "The pilgrim of the Kazan tales carries the Dobrotolubiye in his knapsack and reads it under his starets' direction; the narrative in turn drove the Slavonic Philokalia's popularity far beyond the monasteries.",
    "sources": [
      "Aleksei Pentkovsky (ed.), The Pilgrim's Tale (Paulist CWS, 1999)",
      "R.M. French (trans.), The Way of a Pilgrim (Philip Allan, 1930)"
    ]
  },
  {
    "from": "dogme-et-rituel",
    "to": "event-golden-dawn-1888",
    "kind": "influence",
    "body": "Lévi's tarot–Kabbalah correspondences and astral-light doctrine became structural in the Golden Dawn synthesis; Mathers and Westcott treated him as a direct predecessor.",
    "sources": [
      "Ronald Decker & Michael Dummett, A History of the Occult Tarot (2002)",
      "R. A. Gilbert, The Golden Dawn Scrapbook (1997)"
    ]
  },
  {
    "from": "dogme-et-rituel",
    "to": "event-theosophical-society-1875",
    "kind": "influence",
    "body": "Blavatsky's Isis Unveiled (1877) drew heavily and often without acknowledgment on Lévi, whom Coleman's 1895 source analysis lists among her principal uncredited authorities.",
    "sources": [
      "W. E. Coleman, \"The Sources of Madame Blavatsky's Writings\" (1895)",
      "Joscelyn Godwin, The Theosophical Enlightenment (1994)"
    ]
  },
  {
    "from": "eliade-yoga",
    "to": "roots-of-yoga",
    "kind": "refutation",
    "body": "Mallinson and Singleton's text-critical sourcebook revises the Eliade-era picture of yoga's history, notably on hatha yoga's medieval development and the modernity of complex posture practice.",
    "sources": [
      "Mallinson & Singleton, Roots of Yoga (2017), introduction",
      "Mark Singleton, Yoga Body (2010)"
    ]
  },
  {
    "from": "emerald-tablet",
    "to": "jabir-corpus",
    "kind": "adaptation",
    "body": "An early recension of the Emerald Tablet is embedded in the Jabirian Kitāb usṭuqus al-uss, one of its two oldest witnesses alongside the Sirr al-khalīqa.",
    "sources": [
      "Peter Zirnis, The Kitab Ustuqus al-uss of Jabir ibn Hayyan (diss.), 1979",
      "Paul Kraus, Jābir ibn Ḥayyān, 1942–1943"
    ]
  },
  {
    "from": "essays-in-zen-buddhism",
    "to": "person-jung",
    "kind": "influence",
    "body": "Suzuki's presentation of Zen and satori strongly shaped Jung's engagement with Buddhism; Jung wrote the foreword to the 1939 German edition of Suzuki's Introduction to Zen Buddhism, interpreting satori psychologically.",
    "sources": [
      "C. G. Jung, foreword to D. T. Suzuki, Die grosse Befreiung: Einführung in den Zen-Buddhismus, 1939 (Collected Works 11)"
    ]
  },
  {
    "from": "etz-hayyim",
    "to": "event-sabbatai-zevi-1666",
    "kind": "influence",
    "body": "Nathan of Gaza, an expert Lurianic kabbalist, articulated Sabbatai Zevi's messiahship in Lurianic terms; Scholem argued the movement's spread rode on Lurianic messianism.",
    "sources": [
      "Gershom Scholem, Sabbatai Ṣevi: The Mystical Messiah (1973)"
    ]
  },
  {
    "from": "etz-hayyim",
    "to": "person-baal-shem-tov",
    "kind": "adaptation",
    "body": "Hasidism popularized Lurianic language while redirecting its elite kavvanot toward devekut accessible to ordinary Jews — an adaptation, not a continuation, of Lurianic practice.",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lecture 9",
      "Moshe Idel, Hasidism: Between Ecstasy and Magic (1995)"
    ]
  },
  {
    "from": "event-alexandria-fusion",
    "to": "corpus-hermeticum",
    "kind": "influence",
    "body": "The philosophical Hermetica were composed in Roman Egypt's Greco-Egyptian milieu (c. 1st–3rd c. CE): Greek in language and philosophical idiom, Egyptian in the figure of Thoth-Hermes and in cultic colouring — Fowden's 'single way of Hermes' rooted in the fusion culture that formed after Alexander.",
    "sources": [
      "Garth Fowden, The Egyptian Hermes (1986)",
      "Brian Copenhaver, Hermetica (1992), introduction"
    ]
  },
  {
    "from": "event-alexandria-fusion",
    "to": "turba-philosophorum",
    "kind": "influence",
    "body": "Plessner showed the Turba Philosophorum (Arabic, c. 900) to be a planned attempt to put Greek alchemy into Arabic and adapt it to Islamic science: pre-Socratic philosophers — Anaximenes, Empedocles, Pythagoras — speak under Arabicised names, drawn from a lost Greek doxography.",
    "sources": [
      "Martin Plessner, 'The Place of the Turba Philosophorum in the Development of Alchemy', Isis 45 (1954)"
    ]
  },
  {
    "from": "event-asiatic-society-1784",
    "to": "event-wilkins-gita-1785",
    "kind": "influence",
    "body": "Wilkins was a founding member of Jones's Asiatic Society, and the Hastings–Jones–Wilkins milieu of Company Orientalism produced and financed the Gita translation the following year.",
    "sources": [
      "Richard H. Davis, The Bhagavad Gita: A Biography (2014)",
      "Michael J. Franklin, 'Orientalist Jones' (2011)"
    ]
  },
  {
    "from": "event-casaubon-1614",
    "to": "yates-1964",
    "kind": "influence",
    "body": "Yates made Casaubon's 1614 redating the hinge of her narrative of the Hermetic tradition's rise and fall; Grafton in turn re-examined the episode.",
    "sources": [
      "Frances Yates, Giordano Bruno and the Hermetic Tradition (1964), ch. 21",
      "Anthony Grafton, JWCI 46 (1983)"
    ]
  },
  {
    "from": "event-chicago-1893",
    "to": "autobiography-of-a-yogi",
    "kind": "influence",
    "body": "Vivekananda's 1893 breakthrough created the American mission path — lecture circuit, urban centers, initiating societies — that Yogananda followed from 1920 and memorialized in 1946.",
    "sources": [
      "Elizabeth De Michelis, A History of Modern Yoga (2004)",
      "Philip Goldberg, American Veda (2010)"
    ]
  },
  {
    "from": "event-chicago-1893",
    "to": "raja-yoga-1896",
    "kind": "influence",
    "body": "The celebrity Vivekananda won at the 1893 Chicago Parliament created the American lecture circuit and New York classes of 1895–96 from which Raja Yoga was compiled and published by his new Western following.",
    "sources": [
      "Wikipedia, 'Raja Yoga (book)' (accessed 2026)",
      "Elizabeth De Michelis, A History of Modern Yoga (2004)"
    ]
  },
  {
    "from": "event-chicago-1893",
    "to": "way-of-zen",
    "kind": "influence",
    "body": "Shaku Sōen's appearance at the 1893 Parliament began the American Zen transmission that ran through his student D. T. Suzuki, Watts's principal source.",
    "sources": [
      "Rick Fields, How the Swans Came to the Lake (1981)",
      "Alan Watts, The Way of Zen (1957), preface"
    ]
  },
  {
    "from": "event-eranos",
    "to": "eliade-yoga",
    "kind": "influence",
    "body": "Eliade lectured at Eranos from 1950 and published his yoga synthesis in the Bollingen orbit that grew from that circle; Trask's 1958 English version appeared in the Bollingen Series.",
    "sources": [
      "Steven Wasserstrom, Religion after Religion (1999)",
      "Mircea Eliade, Yoga: Immortality and Freedom (Bollingen Series LVI, 1958)"
    ]
  },
  {
    "from": "event-ficino-1463",
    "to": "de-occulta-philosophia",
    "kind": "influence",
    "body": "Agrippa wove Ficino's Hermetic and magical writing — the Pimander translation and the natural magic of De vita — into his synthesis; the Hermetica reach Agrippa's pages in Ficino's Latin.",
    "sources": [
      "Vittoria Perrone Compagni (ed.), De occulta philosophia libri tres (Brill, 1992)",
      "'Heinrich Cornelius Agrippa von Nettesheim', Stanford Encyclopedia of Philosophy"
    ]
  },
  {
    "from": "event-golden-dawn-1888",
    "to": "book-of-the-law",
    "kind": "influence",
    "body": "Crowley, initiated into the Golden Dawn in 1898, built Thelema's ritual and doctrinal apparatus on the order's synthesis after the 1904 Cairo text.",
    "sources": [
      "Richard Kaczynski, Perdurabo (2010)",
      "Alex Owen, The Place of Enchantment (2004)"
    ]
  },
  {
    "from": "event-golden-flower-1929",
    "to": "event-eranos",
    "kind": "influence",
    "body": "Jung recorded that Wilhelm's text turned him toward alchemy; his Eranos lectures of 1935–36 grew into Psychologie und Alchemie (1944).",
    "sources": [
      "C. G. Jung, Memories, Dreams, Reflections (1962)",
      "C. G. Jung, Psychology and Alchemy, CW 12, prefatory material"
    ]
  },
  {
    "from": "event-golden-flower-1929",
    "to": "person-jung",
    "kind": "influence",
    "body": "Jung wrote that Wilhelm's text reached him at a decisive moment and confirmed his developing ideas on mandala symbolism and the process he would call individuation.",
    "sources": [
      "C. G. Jung, commentary in The Secret of the Golden Flower, 1929/1931",
      "C. G. Jung, Memories, Dreams, Reflections, 1962"
    ]
  },
  {
    "from": "event-harran-sabians",
    "to": "bayt-al-hikma",
    "kind": "influence",
    "body": "Thabit ibn Qurra, recruited from Harran to Baghdad by the Banu Musa, became one of the movement's foremost Greek-to-Arabic translators and revisers — Archimedes, Apollonius, Nicomachus, and the revision of Ishaq ibn Hunayn's Euclid and Almagest.",
    "sources": [
      "Roshdi Rashed (ed.), Thābit ibn Qurra: Science and Philosophy in Ninth-Century Baghdad (de Gruyter, 2009)",
      "Kevin van Bladel, The Arabic Hermes (2009)"
    ]
  },
  {
    "from": "event-harran-sabians",
    "to": "picatrix",
    "kind": "influence",
    "body": "The Ghayat al-Hakim's planetary rituals include prayers and rites it explicitly ascribes to the Sabians of Harran; Pingree traced this Sabian material among the compilation's identifiable sources.",
    "sources": [
      "David Pingree, 'Some of the Sources of the Ghāyat al-hakīm', Journal of the Warburg and Courtauld Institutes 43 (1980)"
    ]
  },
  {
    "from": "event-mahatma-letters",
    "to": "secret-doctrine",
    "kind": "influence",
    "body": "The Mahatma mythos the letters established underwrites The Secret Doctrine's claimed source: Blavatsky presented the book as transmitting the same hidden Masters' teaching.",
    "sources": [
      "H. P. Blavatsky, The Secret Doctrine (1888), introductory",
      "K. Paul Johnson, The Masters Revealed (1994)"
    ]
  },
  {
    "from": "event-picatrix-translation",
    "to": "de-occulta-philosophia",
    "kind": "influence",
    "body": "Agrippa used the Latin Picatrix among the sources of his astral and talismanic material; Perrone Compagni's critical edition documents the borrowings in its apparatus of sources.",
    "sources": [
      "Vittoria Perrone Compagni (ed.), Cornelius Agrippa: De occulta philosophia libri tres (Brill, 1992)"
    ]
  },
  {
    "from": "event-pico-1486",
    "to": "de-arte-cabalistica",
    "kind": "influence",
    "body": "Inspired by Pico's kabbalistic theses, Johann Reuchlin produced the first Latin books on Kabbalah by a Christian author — De verbo mirifico (1494) and De arte cabalistica (Hagenau, 1517) — systematising what Pico had proposed in aphorism.",
    "sources": [
      "Charles Zika, 'Reuchlin's De Verbo Mirifico and the Magic Debate of the Late Fifteenth Century', JWCI 39 (1976)",
      "M. & S. Goodman, introduction to Reuchlin, On the Art of the Kabbalah (1983)"
    ]
  },
  {
    "from": "event-pico-1486",
    "to": "pico-conclusions",
    "kind": "synthesis",
    "body": "The Roman publication of 7 December 1486 is the transmission event; the nine hundred Conclusiones are its text. Its kabbalistic theses, resting on Flavius Mithridates' Latin renderings of Hebrew kabbalistic works, first joined Jewish Kabbalah to the Christian-Hermetic program.",
    "sources": [
      "Chaim Wirszubski, Pico della Mirandola's Encounter with Jewish Mysticism (1989)",
      "S. A. Farmer, Syncretism in the West (1998)"
    ]
  },
  {
    "from": "event-plethon-florence",
    "to": "event-ficino-1463",
    "kind": "influence",
    "body": "Ficino's 1492 preface claims Cosimo conceived his Platonic project on hearing Plethon at the council — the direct ancestry of the commission that produced the 1463 Hermes translation. Hankins reads the story as retrospective myth-making; the link is asserted in the primary source but contested in modern scholarship.",
    "sources": [
      "Marsilio Ficino, preface to the Plotinus translation (1492)",
      "James Hankins, 'Cosimo de' Medici and the \"Platonic Academy\"', JWCI 53 (1990)"
    ]
  },
  {
    "from": "event-rishikesh-1968",
    "to": "relaxation-response",
    "kind": "influence",
    "body": "TM's post-1968 spread supplied the practitioner cohort that Wallace and Benson studied; Benson then generalized the measured effects into a secular 'relaxation response.'",
    "sources": [
      "Wallace, Benson & Wilson, American Journal of Physiology 221 (1971)",
      "Herbert Benson, The Relaxation Response (1975)"
    ]
  },
  {
    "from": "event-shangqing-revelations",
    "to": "huangting-jing",
    "kind": "adaptation",
    "body": "The expanded 'Inner' version of the Yellow Court scripture was produced and canonized within the Shangqing milieu, which adopted the older Outer version's body-god visualization as its own.",
    "sources": [
      "Isabelle Robinet, Taoist Meditation, SUNY Press, 1993",
      "Paul W. Kroll, 'Body Gods and Inner Vision', in Religions of China in Practice, 1996"
    ]
  },
  {
    "from": "event-shangqing-revelations",
    "to": "zhengao",
    "kind": "commentary",
    "body": "Tao Hongjing recovered, authenticated, and annotated the autograph fragments of Yang Xi's 364–370 revelations, compiling them as the Zhen'gao around 499 CE.",
    "sources": [
      "Michel Strickmann, 'The Mao Shan Revelations', T'oung Pao 63, 1977",
      "Thomas E. Smith, Declarations of the Perfected, Part One, Three Pines Press, 2013"
    ]
  },
  {
    "from": "event-sindhind-transmission",
    "to": "bayt-al-hikma",
    "kind": "influence",
    "body": "Indian astronomy entered the Abbasid scientific corpus through al-Fazari's Zij al-Sindhind: al-Khwarizmi, working under al-Ma'mun in the milieu of the Baghdad library, built his own Zij al-Sindhind on the tradition the Sind embassy had brought.",
    "sources": [
      "David Pingree, 'The Fragments of the Works of al-Fazārī', JNES 29 (1970)",
      "Dimitri Gutas, Greek Thought, Arabic Culture (1998)"
    ]
  },
  {
    "from": "event-sindhind-transmission",
    "to": "event-adelard-1126",
    "kind": "translation",
    "body": "The chain closed in Latin: al-Khwarizmi's Sindhind-based tables, revised by Maslama al-Majriti in Córdoba, were rendered into Latin in 1126 in the version attributed to Adelard of Bath — Brahmagupta's astronomical parameters reaching Latin Europe at third hand, the Arabic original now lost.",
    "sources": [
      "Otto Neugebauer, The Astronomical Tables of al-Khwārizmī (1962)",
      "H. Suter (ed.), Die astronomischen Tafeln des Muhammed ibn Mūsā al-Khwārizmī (1914)"
    ]
  },
  {
    "from": "event-tang-elixir-deaths",
    "to": "event-waidan-neidan-shift",
    "kind": "influence",
    "body": "The documented ninth-century poisonings of emperors discredited ingestible mineral elixirs and are cited by historians as a driver of alchemy's turn from waidan to the symbolic inner work of neidan.",
    "sources": [
      "Joseph Needham et al., Science and Civilisation in China, vol. 5 pt. 3, 1976",
      "Fabrizio Pregadio, The Way of the Golden Elixir, Golden Elixir Press, 2012"
    ]
  },
  {
    "from": "event-toledo-translations",
    "to": "person-michael-scot",
    "kind": "influence",
    "body": "Michael Scot's first dated work, the Latin translation of al-Bitruji's On the Motions of the Heavens, was completed at Toledo in 1217; Burnett traces how Scot carried the Toledan Arabic-Latin craft onward to Bologna and to Frederick II's Sicilian court.",
    "sources": [
      "Charles Burnett, 'Michael Scot and the Transmission of Scientific Culture from Toledo to Bologna via the Court of Frederick II Hohenstaufen', Micrologus 2 (1994), 101–126"
    ]
  },
  {
    "from": "event-waidan-neidan-shift",
    "to": "wuzhen-pian",
    "kind": "influence",
    "body": "The Wuzhen pian (1075) is the classic crystallization of the new inner alchemy that emerged from the late-Tang Zhong-Lü milieu after the decline of laboratory elixirs.",
    "sources": [
      "Fabrizio Pregadio, The Way of the Golden Elixir, Golden Elixir Press, 2012",
      "Farzeen Baldrian-Hussein, 'Neidan', in The Encyclopedia of Taoism, Routledge, 2008"
    ]
  },
  {
    "from": "fama-fraternitatis",
    "to": "atalanta-fugiens",
    "kind": "influence",
    "body": "Maier wrote as the furore's leading apologist (Silentium post clamores, 1617), and Atalanta fugiens issued from the same de Bry press ambit that carried Rosicrucian publishing.",
    "sources": [
      "Hereward Tilton, The Quest for the Phoenix, 2003",
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972"
    ]
  },
  {
    "from": "fama-fraternitatis",
    "to": "chymical-wedding",
    "kind": "influence",
    "body": "Andreae's romance adopts the Fama's fictional founder as its pilgrim-hero, binding the third Rosicrucian publication to the first.",
    "sources": [
      "John Warwick Montgomery, Cross and Crucible, 1973",
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972"
    ]
  },
  {
    "from": "fama-fraternitatis",
    "to": "confessio-fraternitatis",
    "kind": "commentary",
    "body": "The Confessio presents itself as the promised sequel, confirming and expounding the brotherhood announced in the Fama.",
    "sources": [
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972",
      "Christopher McIntosh, The Rosicrucians, 1997"
    ]
  },
  {
    "from": "guhyasamaja-tantra",
    "to": "person-naropa",
    "kind": "influence",
    "body": "The six dharmas associated with Nāropa are completion-stage yogas drawing on the highest-yoga-tantra systems including the Guhyasamāja; Tsongkhapa's commentary on the six yogas treats Guhyasamāja materials as a principal source.",
    "sources": [
      "Glenn H. Mullin, Tsongkhapa's Six Yogas of Naropa, 1996"
    ]
  },
  {
    "from": "hekhalot-literature",
    "to": "person-eleazar-of-worms",
    "kind": "influence",
    "body": "The Ashkenazi Hasidim preserved and transmitted Merkabah and Hekhalot materials; Eleazar's Sodei Razayya includes a 'Secret of the Chariot' drawing on this inheritance.",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lecture 3",
      "Encyclopaedia Judaica, 'Eleazar ben Judah of Worms'"
    ]
  },
  {
    "from": "ibn-umayl-silvery-water",
    "to": "person-jung",
    "kind": "influence",
    "body": "Jung cites 'Senior' (Ibn Umayl) throughout his alchemical writings, and his school — von Franz, Abt — sponsored the Corpus Alchemicum Arabicum editions of Ibn Umayl.",
    "sources": [
      "C. G. Jung, Psychologie und Alchemie, 1944",
      "Theodor Abt & Wilferd Madelung (eds.), Corpus Alchemicum Arabicum I, 2003"
    ]
  },
  {
    "from": "jabir-corpus",
    "to": "summa-perfectionis",
    "kind": "adaptation",
    "body": "The Latin Summa builds on translated Jabirian material (notably the Liber de septuaginta) while transforming it with corpuscular theory; Newman shows 'Geber' is a Latin author writing under Jābir's name.",
    "sources": [
      "William R. Newman, The Summa Perfectionis of Pseudo-Geber, 1991",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ]
  },
  {
    "from": "kabbala-denudata",
    "to": "event-golden-dawn-1888",
    "kind": "influence",
    "body": "Mathers's The Kabbalah Unveiled (1887), translated from Knorr's Latin rather than the Aramaic, supplied the kabbalistic backbone of the Golden Dawn curriculum he co-created the following year.",
    "sources": [
      "S. L. MacGregor Mathers, The Kabbalah Unveiled (1887)",
      "R. A. Gilbert, The Golden Dawn Scrapbook (1997)"
    ]
  },
  {
    "from": "kabbala-denudata",
    "to": "kabbalah-unveiled",
    "kind": "translation",
    "body": "Mathers translated three Zoharic tractates into English from Knorr von Rosenroth's Latin, collated with the Aramaic and Hebrew, as The Kabbalah Unveiled (1887).",
    "sources": [
      "S. L. MacGregor Mathers, The Kabbalah Unveiled (London: George Redway, 1887), title page",
      "Wellcome Collection catalogue record"
    ]
  },
  {
    "from": "katha-upanisad",
    "to": "bhagavad-gita",
    "kind": "influence",
    "body": "Bhagavad Gita 2.19–20, on the unborn and undying self, reproduce Katha Upanishad 1.2.18–19 almost verbatim, and the Gita reworks other Katha themes; commentators ancient and modern have noted the borrowing.",
    "sources": [
      "R. C. Zaehner, The Bhagavad-Gītā (OUP, 1969), notes on 2.19–20",
      "Wikipedia, 'Bhagavad Gita' (accessed 2026)"
    ]
  },
  {
    "from": "miracle-of-mindfulness",
    "to": "event-mbsr-1979",
    "kind": "influence",
    "body": "Kabat-Zinn names Thich Nhat Hanh among his teachers; Nhat Hanh's everyday-life mindfulness, crystallized in The Miracle of Mindfulness, prefigured MBSR's informal practices, and Nhat Hanh wrote the preface to Kabat-Zinn's Full Catastrophe Living (1990).",
    "sources": [
      "Jon Kabat-Zinn, Full Catastrophe Living, 1990 (preface by Thich Nhat Hanh)",
      "Jon Kabat-Zinn, 'Some reflections on the origins of MBSR', Contemporary Buddhism 12(1), 2011"
    ]
  },
  {
    "from": "mohe-zhiguan",
    "to": "shobogenzo",
    "kind": "influence",
    "body": "Dōgen trained first as a Tendai monk on Mount Hiei, where Zhiyi's calming-and-contemplation curriculum defined meditation; Bielefeldt situates Dōgen's zazen manuals against this Tiantai/Tendai and Chinese Chan background.",
    "sources": [
      "Carl Bielefeldt, Dōgen's Manuals of Zen Meditation, 1988"
    ]
  },
  {
    "from": "monas-hieroglyphica",
    "to": "event-dee-angelic-conversations",
    "kind": "influence",
    "body": "Clulee traces the continuity of Dee's search for a universal, divinely warranted symbolic language from the Monas of 1564 to the angel diaries begun in 1582: the later 'actions' pursued by claimed revelation what the glyph had pursued by construction. The continuity is a scholarly reading of documented texts, not a validation of either project.",
    "sources": [
      "Nicholas Clulee, John Dee's Natural Philosophy (Routledge, 1988)",
      "Deborah Harkness, John Dee's Conversations with Angels (1999)"
    ]
  },
  {
    "from": "mystical-theology",
    "to": "cloud-of-unknowing",
    "kind": "influence",
    "body": "The Cloud's teaching that God is reached by love beneath a 'cloud of unknowing' draws directly on Dionysian apophasis; the Cloud author also produced Deonise Hid Diuinite, the first vernacular English rendering of the Mystical Theology.",
    "sources": [
      "Phyllis Hodgson (ed.), Deonise Hid Diuinite, EETS 231 (1955)",
      "A.C. Spearing (trans.), The Cloud of Unknowing and Other Works (Penguin, 2001)"
    ]
  },
  {
    "from": "needham-scc-vol5",
    "to": "event-tang-elixir-deaths",
    "kind": "commentary",
    "body": "Ho Ping-Yü and Needham's 1959 study and SCC vol. 5 pt. 3 (1976) supplied the medical identification of Tang elixir deaths as heavy-metal poisoning that anchors modern accounts of the episode.",
    "sources": [
      "Ho Ping-Yü and Joseph Needham, 'Elixir Poisoning in Mediaeval China', Janus 48, 1959",
      "Joseph Needham et al., Science and Civilisation in China, vol. 5 pt. 3, 1976"
    ]
  },
  {
    "from": "neiye",
    "to": "daodejing",
    "kind": "influence",
    "body": "Roth argues the Daodejing emerged from the same 'inner cultivation' lineage whose earliest expression is the Neiye, which he dates earlier than the received Laozi.",
    "sources": [
      "Harold D. Roth, Original Tao, Columbia University Press, 1999"
    ]
  },
  {
    "from": "neiye",
    "to": "zhuangzi",
    "kind": "influence",
    "body": "Roth identifies the Neiye's breath-meditation and inner-cultivation vocabulary as the practical basis underlying the Zhuangzi's meditative passages (xinzhai, zuowang).",
    "sources": [
      "Harold D. Roth, Original Tao, Columbia University Press, 1999"
    ]
  },
  {
    "from": "oupnekhat",
    "to": "sacred-books-of-the-east",
    "kind": "influence",
    "body": "Müller's introduction to Sacred Books of the East vol. 1 reviews the Dara Shikoh–Anquetil transmission before offering direct-from-Sanskrit versions that superseded the Oupnek'hat.",
    "sources": [
      "F. Max Müller, SBE vol. 1 (1879), introduction",
      "Urs App, The Birth of Orientalism (2010)"
    ]
  },
  {
    "from": "pardes-rimmonim",
    "to": "person-isaac-luria",
    "kind": "influence",
    "body": "Luria studied briefly with Cordovero at Safed before his death in 1570, then developed a mythological system that superseded Cordovero's rationalizing scheme.",
    "sources": [
      "Lawrence Fine, Physician of the Soul, Healer of the Cosmos (2003)"
    ]
  },
  {
    "from": "person-abulafia",
    "to": "shaarei-orah",
    "kind": "influence",
    "body": "Gikatilla studied with Abulafia in Castile in the early 1270s before turning to the theosophic Kabbalah systematized in Sha'arei Orah.",
    "sources": [
      "Gershom Scholem, Kabbalah (1974)",
      "Encyclopaedia Judaica, 'Gikatilla, Joseph'"
    ]
  },
  {
    "from": "person-baal-shem-tov",
    "to": "person-nachman-of-breslov",
    "kind": "influence",
    "body": "Nachman was the Baal Shem Tov's great-grandson and framed his own leadership within, and against, the Hasidic movement his ancestor founded.",
    "sources": [
      "Arthur Green, Tormented Master (1979)"
    ]
  },
  {
    "from": "person-bodhidharma",
    "to": "platform-sutra",
    "kind": "influence",
    "body": "The Platform Sutra legitimates Huineng by placing him sixth in a patriarchal lineage descending from Bodhidharma, the genealogical charter that defined Chan identity.",
    "sources": [
      "Philip B. Yampolsky, The Platform Sutra of the Sixth Patriarch, 1967",
      "John R. McRae, Seeing Through Zen, 2003"
    ]
  },
  {
    "from": "person-ge-hong",
    "to": "cantong-qi",
    "kind": "commentary",
    "body": "The earliest full account of the Wei Boyang attribution legend appears in the Shenxian zhuan traditionally credited to Ge Hong — a key witness (and complication) in the text's contested dating.",
    "sources": [
      "Robert Ford Campany, To Live as Long as Heaven and Earth, University of California Press, 2002",
      "Fabrizio Pregadio, The Seal of the Unity of the Three, Golden Elixir Press, 2011"
    ]
  },
  {
    "from": "person-gorakhnath",
    "to": "alchemical-body",
    "kind": "commentary",
    "body": "White's 1996 study reconstructs the Nath Siddha tradition around Gorakhnath, arguing that Nath hatha yoga and rasashastra alchemy were practiced by overlapping lineages as twin technologies of the immortal body.",
    "sources": [
      "David Gordon White, The Alchemical Body (University of Chicago Press, 1996)",
      "University of Chicago Press catalogue entry"
    ]
  },
  {
    "from": "person-isaac-luria",
    "to": "etz-hayyim",
    "kind": "influence",
    "body": "Etz Hayyim is Hayyim Vital's redaction of Luria's oral teaching, compiled over the two decades after the master's death in 1572.",
    "sources": [
      "Encyclopaedia Britannica, 'Etz hayyim (work by Vital)'",
      "Lawrence Fine, Physician of the Soul, Healer of the Cosmos (2003)"
    ]
  },
  {
    "from": "person-isaac-luria",
    "to": "kabbala-denudata",
    "kind": "influence",
    "body": "Knorr's volumes carried Lurianic doctrine into Latin — Liber Druschim and De Revolutionibus Animarum (the latter from the Vital-derived Sefer ha-Gilgulim), plus material in the Sarugian line of Naphtali Bacharach — a century before Vital's Etz Hayyim itself reached print.",
    "sources": [
      "Encyclopaedia Judaica, 'Knorr von Rosenroth, Christian'",
      "'Christian Knorr von Rosenroth's Translation of a Lurianic Dissertation: Liber Druschim', Aschkenas (2024)"
    ]
  },
  {
    "from": "person-junayd",
    "to": "ihya-ulum-al-din",
    "kind": "influence",
    "body": "Al-Ghazali's account of the Sufi path names Junayd among its exemplary masters, and the Ihya's sober integration of mysticism with legal observance continues the Baghdad school Junayd defined.",
    "sources": [
      "W. Montgomery Watt (trans.), The Faith and Practice of al-Ghazali (Allen & Unwin, 1953)",
      "Frank Griffel, Al-Ghazali's Philosophical Theology (OUP, 2009)"
    ]
  },
  {
    "from": "person-jung",
    "to": "event-golden-flower-1929",
    "kind": "commentary",
    "body": "C. G. Jung contributed the 'European commentary' published with Wilhelm's 1929 translation, reading the Daoist text through analytical psychology.",
    "sources": [
      "Richard Wilhelm and C. G. Jung, Das Geheimnis der Goldenen Blüte, 1929",
      "Cary F. Baynes (trans.), The Secret of the Golden Flower, 1931"
    ]
  },
  {
    "from": "person-krishnamacharya",
    "to": "light-on-yoga",
    "kind": "influence",
    "body": "B.K.S. Iyengar received his formative asana training from his brother-in-law Krishnamacharya at the Mysore yogashala in the mid-1930s before being sent to Pune to teach; Light on Yoga codifies and vastly extends a repertoire descending from that instruction.",
    "sources": [
      "Mark Singleton, Yoga Body (OUP, 2010)",
      "Wikipedia, 'Light on Yoga' and 'Tirumalai Krishnamacharya' (accessed 2026)"
    ]
  },
  {
    "from": "person-ledi-sayadaw",
    "to": "person-u-ba-khin",
    "kind": "influence",
    "body": "U Ba Khin's lineage runs through the lay farmer-teacher Saya Thetgyi, who trained under Ledi Sayadaw and was encouraged by him to teach — the chain of teachers documented by the tradition and analyzed by Braun and Houtman.",
    "sources": [
      "Erik Braun, The Birth of Insight, 2013",
      "Gustaaf Houtman, Traditions of Buddhist Practice in Burma, 1990"
    ]
  },
  {
    "from": "person-mahasi-sayadaw",
    "to": "event-mbsr-1979",
    "kind": "influence",
    "body": "Kabat-Zinn trained in vipassanā at the Insight Meditation Society, whose founding teachers (Goldstein, Kornfield, Salzberg) had studied in Burmese-derived lineages including Mahasi's; this insight stream, alongside Zen, fed directly into MBSR's design.",
    "sources": [
      "Jon Kabat-Zinn, 'Some reflections on the origins of MBSR', Contemporary Buddhism 12(1), 2011",
      "Jeff Wilson, Mindful America, 2014"
    ]
  },
  {
    "from": "person-maria-jewess",
    "to": "zosimos-corpus",
    "kind": "influence",
    "body": "Everything known of Maria comes through Zosimos, who cites her sayings and apparatus as authoritative; her kerotakis and water-bath structure his practical chapters.",
    "sources": [
      "Raphael Patai, The Jewish Alchemists, 1994",
      "Michèle Mertens, Les alchimistes grecs IV.1, 1995"
    ]
  },
  {
    "from": "person-matsyendranatha",
    "to": "kaulajnananirnaya",
    "kind": "influence",
    "body": "The Kaulajnananirnaya is traditionally ascribed to Matsyendranatha (Matsyendrapada); the attribution is the tradition's own claim, preserved in the Nepalese manuscripts Bagchi edited, not an independently demonstrable authorship.",
    "sources": [
      "P. C. Bagchi (ed.), Kaulajnana-nirnaya (Calcutta Sanskrit Series, 1934)",
      "Satkari Mukhopadhyaya & Stella Dupuis, The Kaulajnananirnaya (2012)"
    ]
  },
  {
    "from": "person-matsyendranatha",
    "to": "person-gorakhnath",
    "kind": "influence",
    "body": "Nath tradition makes Gorakhnath the direct disciple of Matsyendranatha — a guru-disciple pairing central to Nath legend, though the two figures' contested dates make a historical meeting undemonstrable.",
    "sources": [
      "George Weston Briggs, Gorakhnath and the Kanphata Yogis (1938)",
      "David Gordon White, The Alchemical Body (1996)"
    ]
  },
  {
    "from": "person-matsyendranatha",
    "to": "tantraloka",
    "kind": "influence",
    "body": "The Tantraloka's opening verses salute Macchanda-vibhu (Matsyendranatha); the Kaula ritual stream Abhinavagupta systematizes in chapter 29 traces its lineage to Matsyendra's Yogini Kaula.",
    "sources": [
      "John R. Dupuche, Abhinavagupta: The Kula Ritual as Elaborated in Chapter 29 of the Tantrāloka (2003)",
      "P. C. Bagchi, Kaulajñāna-nirṇaya (1934)"
    ]
  },
  {
    "from": "person-nagarjuna",
    "to": "lamrim-chenmo",
    "kind": "influence",
    "body": "The insight (vipaśyanā) section of the Lamrim Chenmo expounds emptiness through Nāgārjuna's Madhyamaka as interpreted by Candrakīrti, which Tsongkhapa takes as the definitive view.",
    "sources": [
      "Tsongkhapa, The Great Treatise on the Stages of the Path, vol. 3, tr. Lamrim Chenmo Translation Committee, 2002",
      "Guy Newland, introduction to vol. 3, 2002"
    ]
  },
  {
    "from": "person-nagarjuna",
    "to": "mohe-zhiguan",
    "kind": "influence",
    "body": "Zhiyi's Tiantai system, including the threefold-truth contemplation at the heart of the Mohe Zhiguan, develops Nāgārjuna's Madhyamaka as received through Kumārajīva's translations; Tiantai lineage lists honour Nāgārjuna as a patriarch.",
    "sources": [
      "Paul L. Swanson, Foundations of T'ien-T'ai Philosophy, 1989"
    ]
  },
  {
    "from": "person-paracelsus",
    "to": "fama-fraternitatis",
    "kind": "influence",
    "body": "The Fama names Paracelsus with approval (though not as a brother), and the manifestos' program of medical-alchemical reformation is saturated with Paracelsian expectation.",
    "sources": [
      "Frances A. Yates, The Rosicrucian Enlightenment, 1972",
      "Christopher McIntosh, The Rosicrucians, 1997"
    ]
  },
  {
    "from": "person-shankara",
    "to": "bhagavad-gita",
    "kind": "commentary",
    "body": "Shankara's Gitabhasya is the earliest surviving full commentary on the Bhagavad Gita, construing its teaching as knowledge of the nondual self; nearly all later Gita commentary positions itself for or against his reading.",
    "sources": [
      "Hajime Nakamura, A History of Early Vedānta Philosophy (1983)",
      "Encyclopaedia Britannica, 'Bhagavad Gita'"
    ]
  },
  {
    "from": "person-shankara",
    "to": "brhadaranyaka-upanisad",
    "kind": "commentary",
    "body": "Shankara's Brhadaranyakopanisadbhasya, his longest Upanishad commentary, reads the text as a charter of nondual Vedanta and became the dominant lens through which the Upanishad was received in later tradition.",
    "sources": [
      "Hajime Nakamura, A History of Early Vedānta Philosophy (1983)",
      "Encyclopaedia Britannica, 'Shankara'"
    ]
  },
  {
    "from": "person-thomas-merton",
    "to": "centering-prayer",
    "kind": "influence",
    "body": "The practice's name derives from Merton's description of contemplative prayer as 'centered entirely on the presence of God', and Keating and Pennington cited Merton's writings among the movement's proximate inspirations.",
    "sources": [
      "Contemplative Outreach, 'The History of Centering Prayer' (contemplativeoutreach.org)",
      "Basil Pennington, Centering Prayer: Renewing an Ancient Christian Prayer Form (Doubleday, 1980)"
    ]
  },
  {
    "from": "person-u-ba-khin",
    "to": "person-goenka",
    "kind": "influence",
    "body": "Goenka trained under U Ba Khin at the International Meditation Centre in Rangoon from 1955 and was authorized by him to teach; from 1969 he carried the method to India and then worldwide, always teaching 'in the tradition of Sayagyi U Ba Khin'.",
    "sources": [
      "Daniel M. Stuart, S. N. Goenka: Emissary of Insight, 2020",
      "Vipassana Research Institute / dhamma.org, 'The Chain of Teachers'"
    ]
  },
  {
    "from": "person-wang-chongyang",
    "to": "quanzhen",
    "kind": "influence",
    "body": "Wang Chongyang founded the Quanzhen order in Shandong in 1167 and trained the Seven Perfected who institutionalized it after his death in 1170.",
    "sources": [
      "Louis Komjathy, Cultivating Perfection, Brill, 2007",
      "Stephen Eskildsen, The Teachings and Practices of the Early Quanzhen Taoist Masters, SUNY Press, 2004"
    ]
  },
  {
    "from": "philokalia",
    "to": "dobrotolubiye",
    "kind": "translation",
    "body": "Paisius Velichkovsky's Church Slavonic Dobrotolubiye (Moscow, 1793) translates a substantial selection of the Greek Philokalia printed at Venice in 1782, transplanting the Athonite hesychast revival into the Slavic monastic world.",
    "sources": [
      "Kallistos Ware, 'St Nikodimos and the Philokalia', in Bingaman & Nassif (eds.), The Philokalia (OUP, 2012)",
      "Palmer, Sherrard & Ware, The Philokalia, vol. 1, introduction (Faber, 1979)"
    ]
  },
  {
    "from": "physika-kai-mystika",
    "to": "leiden-stockholm-papyri",
    "kind": "influence",
    "body": "Several recipes in the Theban papyri parallel pseudo-Democritus closely, showing both draw on a common Greco-Egyptian recipe literature.",
    "sources": [
      "Robert Halleux, Les alchimistes grecs I, 1981",
      "Matteo Martelli, The Four Books of Pseudo-Democritus, 2013"
    ]
  },
  {
    "from": "physika-kai-mystika",
    "to": "zosimos-corpus",
    "kind": "influence",
    "body": "Zosimos treats 'Democritus' as a founding authority and repeatedly quotes the Democritean books; the four-book corpus underlies his theory of tinctures.",
    "sources": [
      "Matteo Martelli, The Four Books of Pseudo-Democritus, 2013",
      "Michèle Mertens, Les alchimistes grecs IV.1, 1995"
    ]
  },
  {
    "from": "picatrix",
    "to": "event-picatrix-translation",
    "kind": "translation",
    "body": "Alfonso X's commission of 1256–58 turned the Arabic Ghayat al-Hakim into Castilian; the Latin Picatrix, derived from that vernacular version rather than directly from the Arabic, is the form in which Arabic astral magic circulated in Renaissance libraries.",
    "sources": [
      "David Pingree (ed.), Picatrix: The Latin Version of the Ghāyat al-Hakīm (Warburg Institute, 1986)",
      "Dan Attrell & David Porreca, Picatrix: A Medieval Treatise on Astral Magic (2019)"
    ]
  },
  {
    "from": "pico-conclusions",
    "to": "de-arte-cabalistica",
    "kind": "influence",
    "body": "Reuchlin explicitly continued Pico's project of a Christian Cabala, expanding the kabbalistic theses of 1486 into the first full Latin exposition.",
    "sources": [
      "Stanford Encyclopedia of Philosophy, 'Giovanni Pico della Mirandola'",
      "Martin & Sarah Goodman, introduction to On the Art of the Kabbalah (1983)"
    ]
  },
  {
    "from": "praktikos",
    "to": "cassian-conferences",
    "kind": "influence",
    "body": "Cassian, formed in Egypt within Evagrius' circle, carried the Evagrian scheme of eight generic thoughts into Latin monasticism as the eight principal vices (Institutes V–XII; Conference 5), while never naming the posthumously condemned Evagrius.",
    "sources": [
      "Columba Stewart, Cassian the Monk (OUP, 1998)",
      "Owen Chadwick, John Cassian (2nd ed., CUP, 1968)"
    ]
  },
  {
    "from": "praktikos",
    "to": "ladder-of-divine-ascent",
    "kind": "influence",
    "body": "The Ladder reworks the Evagrian catalogue of assaulting thoughts within its thirty steps; the standard English edition's introduction documents Climacus' debt to Evagrian ascetic psychology as transmitted through the Gaza and Sinai traditions.",
    "sources": [
      "Kallistos Ware, introduction to John Climacus: The Ladder of Divine Ascent (Paulist CWS, 1982)",
      "John Chryssavgis, John Climacus: From the Egyptian Desert to the Sinaite Mountain (Ashgate, 2004)"
    ]
  },
  {
    "from": "praktikos",
    "to": "philokalia",
    "kind": "synthesis",
    "body": "The Philokalia anthologizes Evagrius among its earliest authors — ascetic texts under his own name plus On Prayer transmitted under 'Neilos' — folding his analysis of thoughts into the hesychast canon nearly thirteen centuries after his condemnation.",
    "sources": [
      "G.E.H. Palmer, P. Sherrard & K. Ware (trans.), The Philokalia, vol. 1 (Faber, 1979)",
      "Brock Bingaman & Bradley Nassif (eds.), The Philokalia (OUP, 2012)"
    ]
  },
  {
    "from": "pseudo-lull-corpus",
    "to": "compound-of-alchymie",
    "kind": "influence",
    "body": "Ripley organized English practice around pseudo-Lullian doctrine of vegetable mercury and the quintessence; the Compound repeatedly invokes 'Raymond'.",
    "sources": [
      "Jennifer M. Rampling, The Experimental Fire, 2020",
      "Michela Pereira, The Alchemical Corpus Attributed to Raymond Lull, 1989"
    ]
  },
  {
    "from": "quanzhen",
    "to": "secret-of-the-golden-flower",
    "kind": "influence",
    "body": "The Taiyi jinhua zongzhi arose in a Qing spirit-writing cult of Lü Dongbin and was transmitted in editions tied to the Longmen branch of Quanzhen, whose neidan idiom it condenses.",
    "sources": [
      "Mori Yuria, 'Identity and Lineage', in Daoist Identity, University of Hawai'i Press, 2002"
    ]
  },
  {
    "from": "raja-yoga-1896",
    "to": "hathayogapradipika",
    "kind": "refutation",
    "body": "Vivekananda's Raja Yoga explicitly disparaged the hatha yoga of texts like the Hathapradipika as mere body-culture of little spiritual value, a dismissal that shaped early Western reception and that De Michelis and Singleton identify as decisive for how 'yoga' was first packaged for the West.",
    "sources": [
      "Elizabeth De Michelis, A History of Modern Yoga (2004)",
      "Mark Singleton, Yoga Body (OUP, 2010)"
    ]
  },
  {
    "from": "rasahrdaya-tantra",
    "to": "rasaratnasamuccaya",
    "kind": "synthesis",
    "body": "The Rasaratnasamuccaya is a compilatory digest that draws extensively on the earlier rasashastra classics, the Rasahrdaya Tantra among them, systematizing their mercury operations into a single compendium.",
    "sources": [
      "G. J. Meulenbeld, A History of Indian Medical Literature (1999–2002)",
      "'Critical Review of Rasaratna Samuccaya', Ancient Science of Life 36.1 (2016) / PMC"
    ]
  },
  {
    "from": "rasarnava",
    "to": "alchemical-body",
    "kind": "commentary",
    "body": "White's The Alchemical Body takes the Rasarnava as its central primary source, translating and analyzing its 'as in metal, so in the body' doctrine to reconstruct the Rasa Siddha tradition.",
    "sources": [
      "David Gordon White, The Alchemical Body (1996)",
      "David Gordon White, 'The Ocean of Mercury: An Eleventh-Century Alchemical Text', in Donald S. Lopez Jr. (ed.), Religions of India in Practice (Princeton, 1995)"
    ]
  },
  {
    "from": "rasarnava",
    "to": "rasaratnasamuccaya",
    "kind": "synthesis",
    "body": "The Rasarnava's doctrines and mercurial procedures are absorbed and reorganized by the later Rasaratnasamuccaya, which codifies the earlier tantra's operations into its systematic laboratory format.",
    "sources": [
      "G. J. Meulenbeld, A History of Indian Medical Literature (1999–2002)",
      "David Gordon White, The Alchemical Body (1996)"
    ]
  },
  {
    "from": "rigveda",
    "to": "brhadaranyaka-upanisad",
    "kind": "influence",
    "body": "The Brhadaranyaka is transmitted as the closing portion of the Shatapatha Brahmana of the White Yajurveda, the ritual corpus that grew out of the Vedic hymn collections whose oldest stratum is the Rigveda; its opening meditation reinterprets the Vedic horse sacrifice, turning liturgy into cosmology.",
    "sources": [
      "Patrick Olivelle, The Early Upanishads (OUP, 1998)",
      "Michael Witzel, 'Vedas and Upaniṣads', Blackwell Companion to Hinduism (2003)"
    ]
  },
  {
    "from": "roots-of-yoga",
    "to": "amrtasiddhi",
    "kind": "translation",
    "body": "Roots of Yoga presents translated excerpts of the Amrtasiddhi among its hundred-plus sources, bringing the Buddhist source text of hatha yoga to a general readership ahead of Mallinson and Szántó's 2021 critical edition.",
    "sources": [
      "James Mallinson & Mark Singleton, Roots of Yoga (Penguin Classics, 2017)"
    ]
  },
  {
    "from": "roots-of-yoga",
    "to": "dattatreyayogasastra",
    "kind": "translation",
    "body": "Roots of Yoga includes translated passages of the Dattatreyayogasastra, building on Mallinson's pioneering English translation of the earliest text to teach hatha yoga under that name.",
    "sources": [
      "James Mallinson & Mark Singleton, Roots of Yoga (2017)",
      "James Mallinson, 'Translation of the Dattātreyayogaśāstra' (2013)"
    ]
  },
  {
    "from": "satipatthana-sutta",
    "to": "event-mbsr-1979",
    "kind": "adaptation",
    "body": "MBSR's 'mindfulness' is a secular adaptation of satipaṭṭhāna-derived practice; Kabat-Zinn himself describes MBSR as recontextualizing dharma in medical settings, and historians treat the program as the key secularization bridge.",
    "sources": [
      "Jon Kabat-Zinn, 'Some reflections on the origins of MBSR', Contemporary Buddhism 12(1), 2011",
      "Jeff Wilson, Mindful America, 2014"
    ]
  },
  {
    "from": "satipatthana-sutta",
    "to": "person-mahasi-sayadaw",
    "kind": "adaptation",
    "body": "Mahasi Sayadaw presented his noting method explicitly as a practical application of the Satipaṭṭhāna Sutta, promising insight without prior jhāna attainment — the 'dry insight' reading that defined the Burmese vipassanā revival.",
    "sources": [
      "Mahasi Sayadaw, Manual of Insight, tr. 2016",
      "Erik Braun, The Birth of Insight, 2013"
    ]
  },
  {
    "from": "satipatthana-sutta",
    "to": "visuddhimagga",
    "kind": "synthesis",
    "body": "Buddhaghosa's manual systematizes the canonical meditation teachings, including the satipaṭṭhāna contemplations, within the Mahāvihāra commentarial framework of purifications and insight knowledges.",
    "sources": [
      "Bhikkhu Ñāṇamoli (tr.), The Path of Purification, 1956 (introduction)",
      "Oskar von Hinüber, A Handbook of Pāli Literature, 1996"
    ]
  },
  {
    "from": "secret-of-the-golden-flower",
    "to": "event-golden-flower-1929",
    "kind": "translation",
    "body": "Richard Wilhelm translated an eight-chapter 1834 edition of the Taiyi jinhua zongzhi into German in 1929; Cary F. Baynes's English version followed in 1931.",
    "sources": [
      "Richard Wilhelm, Das Geheimnis der Goldenen Blüte, Dornverlag, 1929",
      "Catherine Despeux and Livia Kohn (identification of the 1834 Daozang xubian base edition)"
    ]
  },
  {
    "from": "secrets-of-alchemy",
    "to": "person-jung",
    "kind": "refutation",
    "body": "Principe and Newman argue the Jungian spiritual-psychological reading of alchemy is an anachronism rooted in 19th-century occultism; the Jungian tradition maintains its psychological reading. Both positions are preserved verbatim in the entry's contested field.",
    "sources": [
      "Lawrence M. Principe & William R. Newman, 'Some Problems with the Historiography of Alchemy', 2001",
      "Lawrence M. Principe, The Secrets of Alchemy, 2013"
    ]
  },
  {
    "from": "sefer-ha-bahir",
    "to": "zohar",
    "kind": "influence",
    "body": "The Zohar elaborates the sefirotic symbolism — cosmic tree, divine feminine — that first surfaced in the Bahir a century earlier.",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lectures 5–6"
    ]
  },
  {
    "from": "sefer-yetzirah",
    "to": "person-abulafia",
    "kind": "commentary",
    "body": "Abulafia wrote commentaries on Sefer Yetzirah (Gan Na'ul, Otzar Eden Ganuz) and built his letter-combination method on its alphabet mysticism.",
    "sources": [
      "Moshe Idel, The Mystical Experience in Abraham Abulafia (1988)"
    ]
  },
  {
    "from": "sefer-yetzirah",
    "to": "person-eleazar-of-worms",
    "kind": "commentary",
    "body": "Eleazar wrote a commentary on Sefer Yetzirah, included in Sodei Razayya, later associated with golem-making legends.",
    "sources": [
      "Encyclopaedia Judaica, 'Eleazar ben Judah of Worms'"
    ]
  },
  {
    "from": "sefer-yetzirah",
    "to": "sefer-ha-bahir",
    "kind": "influence",
    "body": "The Bahir reworks Sefer Yetzirah's ten sefirot, transforming them from primordial numbers into dynamic divine powers — the founding move of theosophic Kabbalah.",
    "sources": [
      "Gershom Scholem, Origins of the Kabbalah (1987)"
    ]
  },
  {
    "from": "serpent-power",
    "to": "person-jung",
    "kind": "influence",
    "body": "C. G. Jung's 1932 Zurich seminars on kundalini yoga took Avalon's The Serpent Power as their textual basis, channelling Woodroffe's tantric material into depth psychology (cross-domain edge; target slug in the Jung/psychology domain).",
    "sources": [
      "Sonu Shamdasani (ed.), The Psychology of Kundalini Yoga: Notes of the Seminar Given in 1932 by C. G. Jung (Princeton, 1996)",
      "Kathleen Taylor, Sir John Woodroffe, Tantra and Bengal (2001)"
    ]
  },
  {
    "from": "shaarei-orah",
    "to": "de-arte-cabalistica",
    "kind": "influence",
    "body": "Reuchlin studied Gikatilla's Sha'arei Orah and Ginnat Egoz in manuscript, and Paulus Ricius's Latin Portae Lucis (1516) appeared the year before De Arte Cabalistica; Gikatilla was among Reuchlin's principal Jewish sources.",
    "sources": [
      "Gershom Scholem, Kabbalah (1974)",
      "Bonhams sale record: Ricius (trans.), Portae Lucis (Augsburg: Johannes Miller, 1516)"
    ]
  },
  {
    "from": "shatchakranirupana",
    "to": "serpent-power",
    "kind": "translation",
    "body": "The Serpent Power (1919) is Woodroffe/Avalon's annotated English translation of Purnananda's Shatchakranirupana (with the Padukapanchaka), the act of translation that made this one late Bengali text the West's canonical chakra source.",
    "sources": [
      "Arthur Avalon, The Serpent Power (Luzac & Co., 1919)",
      "Kathleen Taylor, Sir John Woodroffe, Tantra and Bengal (2001)"
    ]
  },
  {
    "from": "sirr-i-akbar",
    "to": "oupnekhat",
    "kind": "translation",
    "body": "Anquetil-Duperron translated Dara Shikoh's Persian version into Latin (Strasbourg, 1801–02) — Europe's first extensive Upanishads, at two removes from the Sanskrit.",
    "sources": [
      "A. H. Anquetil-Duperron, Oupnek'hat (1801–02)",
      "Urs App, The Birth of Orientalism (2010)"
    ]
  },
  {
    "from": "tibetan-book-of-the-dead",
    "to": "event-eranos",
    "kind": "commentary",
    "body": "Jung contributed a 'Psychological Commentary' to Evans-Wentz's Tibetan Book of the Dead (German 1935; in the English 3rd edition, 1957), reading the bardo states as psychic symbolism.",
    "sources": [
      "W. Y. Evans-Wentz (ed.), The Tibetan Book of the Dead, 3rd ed. (1957)",
      "C. G. Jung, CW 11"
    ]
  },
  {
    "from": "tibetan-book-of-the-dead",
    "to": "person-jung",
    "kind": "influence",
    "body": "Jung wrote a 'Psychological Commentary' for the 1935 German edition (Das Tibetanische Totenbuch), reading the bardo visions as projections of the collective unconscious; R. F. C. Hull's English translation appeared in the 1957 third Oxford edition and in Collected Works vol. 11. Jung called the book a constant companion.",
    "sources": [
      "C. G. Jung, 'Psychological Commentary on The Tibetan Book of the Dead', Collected Works 11 (orig. German 1935; English 1957)",
      "Donald S. Lopez Jr., The Tibetan Book of the Dead: A Biography, 2011"
    ]
  },
  {
    "from": "triads",
    "to": "person-barlaam",
    "kind": "refutation",
    "body": "The Triads answer, point by point, Barlaam's attacks on hesychast prayer and on the uncreated character of the light of Tabor; the Constantinople council of June 1341 endorsed Palamas and Barlaam's polemics were ordered destroyed.",
    "sources": [
      "John Meyendorff (ed.), Gregory Palamas: The Triads (Paulist CWS, 1983)",
      "John Meyendorff, A Study of Gregory Palamas (Faith Press, 1964)"
    ]
  },
  {
    "from": "turba-philosophorum",
    "to": "ibn-umayl-silvery-water",
    "kind": "influence",
    "body": "Ibn Umayl's Silvery Water is the earliest text known to quote the Turba — the anchor of Plessner's c. 900 dating of the Arabic original.",
    "sources": [
      "Martin Plessner, 'The Place of the Turba Philosophorum in the Development of Alchemy', Isis 45, 1954",
      "Julius Ruska, Turba Philosophorum, 1931"
    ]
  },
  {
    "from": "vijnanabhairava-tantra",
    "to": "tantraloka",
    "kind": "influence",
    "body": "Abhinavagupta held the Vijnanabhairava in the highest esteem — dignifying it as the 'Shiva-vijnana Upanishad' — and drew on it in the Tantraloka; Jayaratha's commentary quotes it repeatedly.",
    "sources": [
      "Jaideva Singh, Vijñānabhairava or Divine Consciousness (1979), introduction",
      "John R. Dupuche, Abhinavagupta: The Kula Ritual (2003)"
    ]
  },
  {
    "from": "visuddhimagga",
    "to": "person-mahasi-sayadaw",
    "kind": "commentary",
    "body": "Mahasi Sayadaw produced a Burmese nissaya translation-commentary of the Visuddhimagga, and his map of the progress of insight follows Buddhaghosa's sequence of insight knowledges.",
    "sources": [
      "Mahasi Sayadaw, Manual of Insight, tr. 2016 (translators' introduction)",
      "Ingrid Jordt, Burma's Mass Lay Meditation Movement, 2007"
    ]
  },
  {
    "from": "wuzhen-pian",
    "to": "quanzhen",
    "kind": "synthesis",
    "body": "The Southern Lineage (Nanzong) founded on the Wuzhen pian was merged into Quanzhen under the Yuan, uniting the two great neidan traditions within one monastic order.",
    "sources": [
      "Fabrizio Pregadio (ed.), The Encyclopedia of Taoism ('Nanzong'), Routledge, 2008",
      "Louis Komjathy, Cultivating Perfection, Brill, 2007"
    ]
  },
  {
    "from": "yates-1964",
    "to": "hanegraaff-2012",
    "kind": "refutation",
    "body": "Hanegraaff's 'Beyond the Yates Paradigm' and Esotericism and the Academy dismantle the grand-narrative 'Hermetic Tradition' while institutionalizing the field Yates opened.",
    "sources": [
      "Wouter Hanegraaff, \"Beyond the Yates Paradigm\", Aries 1:1 (2001)",
      "Wouter Hanegraaff, Esotericism and the Academy (2012)"
    ]
  },
  {
    "from": "yijing",
    "to": "event-leibniz-iching",
    "kind": "adaptation",
    "body": "Leibniz mapped the sixty-four hexagrams of the Xiantian diagram onto his binary arithmetic, announcing the correspondence in his 1703 Académie mémoire — an adaptation of the diagram, not of Yijing divination.",
    "sources": [
      "G. W. Leibniz, \"Explication de l'arithmétique binaire\" (1703)",
      "Franklin Perkins, Leibniz and China (2004)"
    ]
  },
  {
    "from": "yoga-bhasya",
    "to": "yoga-sutras",
    "kind": "commentary",
    "body": "The Yogabhasya is the earliest extant commentary on the sutras and fixed their canonical interpretation; on Maas's reading the two were composed together as a single Patanjalayogasastra rather than as text and later gloss.",
    "sources": [
      "Philipp A. Maas, 'A Concise Historiography of Classical Yoga Philosophy' (2013)",
      "Internet Encyclopedia of Philosophy, 'The Yoga Sutras of Patanjali'"
    ]
  },
  {
    "from": "yoga-body",
    "to": "claim-5000-year-yoga",
    "kind": "refutation",
    "body": "Singleton's Yoga Body demonstrates that the modern postural canon was forged between the mid-19th century and the Second World War from gymnastics, physical culture and nationalism, directly refuting the claim of an unbroken 5,000-year-old postural practice.",
    "sources": [
      "Mark Singleton, Yoga Body: The Origins of Modern Posture Practice (OUP, 2010)"
    ]
  },
  {
    "from": "yoga-sutras",
    "to": "dattatreyayogasastra",
    "kind": "synthesis",
    "body": "The Dattatreyayogasastra is the first text to combine Patanjali's eight-limbed (astanga) scheme with physical hatha techniques, attributing the eightfold yoga to 'Yajnavalkya and others' while grafting mudras and breath retention onto it.",
    "sources": [
      "James Mallinson, 'Translation of the Dattātreyayogaśāstra' (2013)",
      "James Mallinson & Mark Singleton, Roots of Yoga (2017)"
    ]
  },
  {
    "from": "yoga-sutras",
    "to": "eliade-yoga",
    "kind": "commentary",
    "body": "Eliade's study centers on Patañjali's system, framing classical yoga through his categories of enstasis and archaic soteriology.",
    "sources": [
      "Mircea Eliade, Yoga: Immortality and Freedom (1958)",
      "David Gordon White, The Yoga Sutra of Patanjali: A Biography (2014)"
    ]
  },
  {
    "from": "yoga-sutras",
    "to": "kitab-patanjal",
    "kind": "translation",
    "body": "Al-Biruni rendered Patanjali's sutras together with a commentary into Arabic before 1030. Pines and Gelblum characterise the result precisely: an interpretive paraphrase in dialogue form, sutra and commentary fused, with Indian technical terms recast in Arabic philosophical and Sufi vocabulary — not a verbatim translation.",
    "sources": [
      "Shlomo Pines & Tuvia Gelblum, 'Al-Bīrūnī's Arabic Version of Patañjali's Yogasūtra', BSOAS 29 (1966)",
      "Mario Kozah (ed.), The Yoga Sutras of Patañjali by Abū Rayḥān al-Bīrūnī (NYU Press, 2020)"
    ]
  },
  {
    "from": "yoga-sutras",
    "to": "raja-yoga-1896",
    "kind": "adaptation",
    "body": "The second half of Vivekananda's Raja Yoga is his free translation of and commentary on Patanjali's sutras, recast for Western audiences as an experimental 'science of the mind' — one of the first English presentations to treat the text as practical instruction.",
    "sources": [
      "Swami Vivekananda, Raja Yoga (1896)",
      "Elizabeth De Michelis, A History of Modern Yoga (2004)"
    ]
  },
  {
    "from": "zohar",
    "to": "kabbala-denudata",
    "kind": "translation",
    "body": "Kabbala Denudata rendered major Zoharic tractates (Idra Rabba, Idra Zuta, Sifra di-Tseniuta) into Latin — Christian Europe's principal access to the Zohar for two centuries.",
    "sources": [
      "Encyclopaedia Judaica, 'Knorr von Rosenroth, Christian'",
      "Zutot 22:1 (2025)"
    ]
  },
  {
    "from": "zohar",
    "to": "major-trends",
    "kind": "commentary",
    "body": "Major Trends devotes two lectures to the Zohar, presenting Scholem's philological case that Moses de Leon composed it in 1280s Castile.",
    "sources": [
      "Gershom Scholem, Major Trends in Jewish Mysticism (1941), lectures 5–6"
    ]
  },
  {
    "from": "zohar",
    "to": "pardes-rimmonim",
    "kind": "synthesis",
    "body": "Pardes Rimmonim is the first comprehensive systematization of Zoharic Kabbalah; Cordovero also composed Or Yakar, a massive Zohar commentary.",
    "sources": [
      "Encyclopaedia Judaica, 'Cordovero, Moses'",
      "Eugene D. Matanky, IMAGES 15 (2022)"
    ]
  },
  {
    "from": "zosimos-corpus",
    "to": "ibn-umayl-silvery-water",
    "kind": "influence",
    "body": "Ibn Umayl cites Zosimos among his Greek authorities; Arabic translations and adaptations of Zosimos circulated in his milieu.",
    "sources": [
      "Theodor Abt & Wilferd Madelung (eds.), Corpus Alchemicum Arabicum I, 2003",
      "H. E. Stapleton & M. H. Husain, Memoirs of the Asiatic Society of Bengal, 1933"
    ]
  }
];
