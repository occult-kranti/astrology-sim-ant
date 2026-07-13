// ============================================================================
//  chronology.js — The Hermetic Chronology wing's data: a sourced timeline of
//  Hermetic philosophy, magic & the occult from Babylon to the academy, ported
//  verbatim from "The Hermetic Chronology" (7-page companion site).
//
//  Each entry: { era, dateText, sortYear, title, body, label, sources[] } with
//   • label — the EPISTEMIC LABEL, one of 'documented' | 'disputed' |
//     'debunked' | 'conspiracy' (the wing's core honesty device);
//   • sources — the source strings verbatim from the original site;
//   • links (optional) — related Workbench pages, hrefs relative to
//     pages/chronology/;
//   • cast (optional) — a DAY-precise, historically defensible moment that can
//     be cast in the Workbench: { calendar:'julian'|'gregorian', y, m, d,
//     hour (0–23 local; 12 = unrecorded), lat, lon, place, note }. Julian
//     dates are converted to proleptic Gregorian by core/calendar.js before
//     they reach the astronomy engine. Only genuinely day-datable moments
//     carry a cast; century-estimates never do.
//
//  Pure data: no DOM, no network, no randomness.
// ============================================================================

export const CHRONOLOGY_ERAS = [
  { id: 'deepbackground', name: 'Deep Background — Ancient Roots', range: '3rd millennium BCE – 1st century CE' },
  { id: 'antiquity', name: 'Antiquity & Late Antiquity', range: 'c. 1st – 5th century CE' },
  { id: 'islamic', name: 'Islamic Golden Age & Transmission', range: '8th – 11th century' },
  { id: 'medieval', name: 'The Medieval Latin West', range: '12th – 15th century' },
  { id: 'renaissance', name: 'The Renaissance Revival', range: '15th – 16th century' },
  { id: 'earlymodern', name: 'The Early Modern Turn', range: '17th – 18th century' },
  { id: 'revival', name: 'The Modern Occult Revival', range: '19th – early 20th century' },
  { id: 'contemporary', name: 'Contemporary Study & Afterlife', range: '20th – 21st century' },
];

export const CHRONOLOGY_ENTRIES = [
  // — Deep Background — Ancient Roots —
  {
    era: 'deepbackground', dateText: 'c. 2400 BCE', sortYear: -2400,
    title: 'Egyptian heka and the Pyramid Texts',
    body: 'In Egypt, magic (heka) is understood not as transgression but as a divine creative force woven into the order of the cosmos. The Pyramid Texts — among the oldest religious writings known — inscribe ritual spells to guide and protect the dead: the deep substratum from which a later cult of “sacred Egypt” would grow.',
    label: 'documented',
    sources: ['Geraldine Pinch, Magic in Ancient Egypt (1994).'],
  },
  {
    era: 'deepbackground', dateText: 'c. 1550 BCE', sortYear: -1550,
    title: 'Thoth and the Egyptian Book of the Dead',
    body: 'New Kingdom funerary papyri — the “Book of Coming Forth by Day” — cast Thoth, god of writing, wisdom, and magic, as the divine scribe who records the judgment of the soul. Centuries later the Greeks would identify this very god with Hermes, producing “Hermes Trismegistus.”',
    label: 'documented',
    sources: ['Pinch, Magic in Ancient Egypt (1994).'],
  },
  {
    era: 'deepbackground', dateText: 'early 2nd mill. – 7th c. BCE', sortYear: -1000,
    title: 'Babylonian celestial divination',
    body: 'Mesopotamian scribes read the sky as a message from the gods, pairing each celestial event with a predicted outcome. The great omen series Enūma Anu Enlil — with roots in Old Babylonian observation such as the Venus Tablet of Ammiṣaduqa — is the ancestor of the astrology that later reached the Greek, Persian, and Islamic worlds.',
    label: 'documented',
    sources: ['Francesca Rochberg, In the Path of the Moon (2010).'],
    links: [{ href: '../workbench.html', label: 'The Master Tool — that astrology, computed' }],
  },
  {
    era: 'deepbackground', dateText: 'c. 6th–5th c. BCE', sortYear: -500,
    title: 'The Persian magi and the word “magic”',
    body: 'Greek writers borrow mageía from the magoi, the priestly class of Zoroastrian Persia — the etymological origin of the very word “magic.” From the start the term carries a double charge: revered foreign wisdom, and suspect foreign sorcery.',
    label: 'documented',
    sources: ['Classical scholarship on mageia (e.g. Bremmer, 1999).'],
  },
  {
    era: 'deepbackground', dateText: 'c. 5th c. BCE onward', sortYear: -450,
    title: 'Greeks meet Egypt: Thoth becomes Hermes',
    body: 'As Greeks travel in Egypt — Herodotus among them — and later rule it under the Ptolemies, they map their own gods onto Egyptian ones. Thoth is identified with Hermes: the interpretatio graeca that ultimately yields the composite sage Hermes Trismegistus.',
    label: 'documented',
    sources: ['van Bladel, The Arabic Hermes (2009)', 'Ebeling (2007).'],
  },
  {
    era: 'deepbackground', dateText: 'c. 360 BCE', sortYear: -360,
    title: "Plato's Timaeus and the living cosmos",
    body: 'Plato describes the cosmos as a single living being with a World-Soul, ordered by number and mirroring an eternal model. This Platonic substrate — the macrocosm reflected in the microcosm — becomes one of the deepest philosophical roots of later Hermetic and Neoplatonic thought.',
    label: 'documented',
    sources: ['History of philosophy', 'cf. Copenhaver, Hermetica (1992).'],
  },
  {
    era: 'deepbackground', dateText: '2nd c. BCE – 5th c. CE', sortYear: -150,
    title: 'The Greek Magical Papyri',
    body: 'In Greco-Roman Egypt, working magicians compile practical handbooks of spells, hymns, and rituals in Greek, Demotic, and Coptic — freely invoking Hermes and Thoth together. The PGM are our richest surviving record of how ancient magic was actually performed.',
    label: 'documented',
    sources: ['H. D. Betz (ed.), The Greek Magical Papyri in Translation (1986/1992).'],
  },

  // — Antiquity & Late Antiquity —
  {
    era: 'antiquity', dateText: 'c. 1st c. CE', sortYear: -50,
    title: '“Hermes Trismegistus” takes shape',
    body: 'The Greek god Hermes fuses with the Egyptian Thoth into a single legendary sage credited with primordial wisdom. Plutarch already refers to “Hermes Trismegistus” in the first century CE.',
    label: 'documented',
    sources: ['Copenhaver, Hermetica (1992)', 'van Bladel, The Arabic Hermes (2009).'],
  },
  {
    era: 'antiquity', dateText: 'c. 100–300 CE', sortYear: 200,
    title: 'The philosophical Hermetica are written in Roman Egypt',
    body: 'Anonymous authors in Hellenistic-Roman Alexandria compose the Greek treatises later gathered as the Corpus Hermeticum, blending Greek philosophy, Egyptian religion, and Jewish and early-Christian ideas, and teaching gnosis as the road to salvation.',
    label: 'documented',
    sources: ['Copenhaver, Hermetica (1992).'],
    links: [{ href: 'hermetica.html', label: 'Hermetica — the contemplative practices' }],
  },
  {
    era: 'antiquity', dateText: 'c. 300 CE', sortYear: 300,
    title: 'Zosimos of Panopolis and Greek alchemy',
    body: 'The earliest substantial named alchemical author, writing in Greco-Roman Egypt, frames the transmutation of metals as a spiritual as well as material work — fusing laboratory practice with visionary allegory and Hermetic ideas, and setting the template for alchemy for over a millennium.',
    label: 'documented',
    sources: ['History of alchemy', 'cf. Pinch (1994)', 'Ebeling (2007).'],
    links: [{ href: 'alchemy.html', label: 'Alchemy — the Great Work' }],
  },
  {
    era: 'antiquity', dateText: '3rd–4th c. CE', sortYear: 350,
    title: 'The Asclepius survives in Latin',
    body: 'While most Hermetica remained in Greek, the dialogue known as the Asclepius circulated in an early Latin translation through the Middle Ages, keeping a live thread of Hermetic thought inside the Christian West.',
    label: 'documented',
    sources: ['Copenhaver, Hermetica (1992)', 'Hermetica (overview).'],
    links: [{ href: 'hermetica.html', label: 'Hermetica — the contemplative practices' }],
  },
  {
    era: 'antiquity', dateText: '5th c. CE', sortYear: 450,
    title: 'Stobaeus preserves the Hermetic excerpts',
    body: 'In Macedonia, John of Stobi (Stobaeus) compiles a vast anthology of Greek literature that conserves numerous Hermetic discourses — one of the key channels by which the texts survived at all.',
    label: 'documented',
    sources: ['Standard Hermetica scholarship.'],
  },

  // — Islamic Golden Age & Transmission —
  {
    era: 'islamic', dateText: '8th–9th c.', sortYear: 800,
    title: 'The Emerald Tablet appears in Arabic',
    body: 'The famous formula of correspondence — “as above, so below” in paraphrase — is first attested embedded in Arabic works such as the Book of the Secret of Creation attributed to Balīnās (Pseudo-Apollonius). Its legendary discovery in Hermes’s tomb is myth, not history.',
    label: 'documented',
    sources: ['van Bladel, The Arabic Hermes (2009)', 'Ebeling (2007).'],
    links: [{ href: '../glossary.html', label: 'Glossary — the Emerald Tablet' }],
  },
  {
    era: 'islamic', dateText: '9th c.', sortYear: 850,
    title: 'The Sabians of Harran carry Hermetic star-worship',
    body: 'A pagan community in northern Mesopotamia venerates Hermes as prophet and transmits planetary theurgy into the Islamic world — a crucial bridge from Hellenistic Egypt to Arabic learning.',
    label: 'documented',
    sources: ['Pingree, “The Ṣābians of Ḥarrān and the Classical Tradition” (2002).'],
    links: [{ href: '../picatrix/index.html', label: 'Picatrix — astrological magic' }],
  },
  {
    era: 'islamic', dateText: 'c. 9th c.', sortYear: 870,
    title: 'Jābir ibn Ḥayyān and Hermetic alchemy',
    body: 'The enormous corpus attributed to Jābir (“Geber”) develops alchemical theory steeped in Hermetic ideas, shaping the discipline across the Islamic world and, later, Europe.',
    label: 'documented',
    sources: ['van Bladel (2009)', 'standard history of alchemy.'],
    links: [{ href: 'alchemy.html', label: 'Alchemy — the Great Work' }],
  },
  {
    era: 'islamic', dateText: 'c. 1000–1050', sortYear: 1025,
    title: 'The Ghāyat al-Ḥakīm (Picatrix) is compiled in al-Andalus',
    body: 'A systematic Arabic manual of astral and talismanic magic gathers some two hundred sources — Hermetic, Sabian, and Neoplatonic. Its traditional attribution to Maslama al-Majrīṭī is now rejected by scholars as pseudepigraphy.',
    label: 'documented',
    sources: ['Pingree, “Between the Ghāya and Picatrix” (JWCI, 1981).'],
    links: [{ href: '../picatrix/index.html', label: 'Picatrix — astrological magic' }],
  },

  // — The Medieval Latin West —
  {
    era: 'medieval', dateText: '12th c.', sortYear: 1140,
    title: 'The Emerald Tablet enters Latin',
    body: 'Translations of Arabic science carry the Tabula Smaragdina into Europe, where its terse lines become a foundational reference for Latin alchemy for the next five centuries.',
    label: 'documented',
    sources: ['Ebeling (2007)', 'history of alchemy.'],
    links: [{ href: 'alchemy.html', label: 'Alchemy — the Great Work' }],
  },
  {
    era: 'medieval', dateText: '1256', sortYear: 1256,
    title: 'Picatrix translated for Alfonso X',
    body: 'The Ghāyat al-Ḥakīm is rendered into Castilian at the court of Alfonso X “the Wise,” and thence into Latin — the route by which Arabic astral magic reached Renaissance Europe.',
    label: 'documented',
    sources: ['Pingree (1981).'],
    links: [{ href: '../picatrix/index.html', label: 'Picatrix — astrological magic' }],
  },
  {
    era: 'medieval', dateText: '13th–15th c.', sortYear: 1350,
    title: 'The grimoire tradition takes shape',
    body: 'Latin manuals of ritual magic circulate in manuscript: the Sworn Book of Honorius, the Key of Solomon (Clavicula Salomonis), and the Munich Manual of Demonic Magic, weaving Solomonic, astrological, and Christian elements together.',
    label: 'documented',
    sources: ['Owen Davies, Grimoires: A History of Magic Books (2009).'],
    links: [{ href: '../picatrix/prayers.html', label: 'Prayers & spirits (Picatrix Bk III–IV)' }],
  },

  // — The Renaissance Revival —
  {
    era: 'renaissance', dateText: '1460', sortYear: 1460,
    title: 'A Hermetic manuscript reaches Florence',
    body: "Leonardo da Pistoia, an agent of Cosimo de' Medici, brings a Greek codex of the Corpus Hermeticum back from Macedonia — the spark for the Renaissance recovery of Hermes.",
    label: 'documented',
    sources: ['Hermeticism (overview)', 'Yates (1964).'],
  },
  {
    era: 'renaissance', dateText: '1463', sortYear: 1463,
    title: 'Ficino translates the Corpus Hermeticum',
    body: "Cosimo de' Medici orders Marsilio Ficino to set Plato aside and translate the Hermetica first. Ficino takes them for a “pristine theology” older than Moses — a belief that ignites Renaissance Hermeticism.",
    label: 'documented',
    sources: ['Copenhaver (1992)', 'Yates (1964).'],
    links: [{ href: 'hermetica.html', label: 'Hermetica — the contemplative practices' }],
  },
  {
    era: 'renaissance', dateText: '1486', sortYear: 1486,
    title: 'Pico fuses Hermeticism, Kabbalah and magic',
    body: "Giovanni Pico della Mirandola's Oration on the Dignity of Man and 900 Theses braid Hermetic and Jewish-Kabbalistic strands into a Christian frame, founding the current later called Christian Kabbalah.",
    label: 'documented',
    sources: ['Yates (1964)', 'Hanegraaff (2012).'],
  },
  {
    era: 'renaissance', dateText: '1531–33', sortYear: 1531,
    title: "Agrippa's Three Books of Occult Philosophy",
    body: 'Heinrich Cornelius Agrippa systematises natural, celestial, and ceremonial magic into the single most influential occult encyclopedia of the era, printed after years in manuscript.',
    label: 'documented',
    sources: ['Davies (2009)', 'standard scholarship.'],
    links: [{ href: '../picatrix/correspondences.html', label: 'Correspondences — the tables Agrippa inherited' }],
  },
  {
    era: 'renaissance', dateText: '1530s', sortYear: 1536,
    title: 'Paracelsus reforms alchemy and medicine',
    body: 'The Swiss physician Theophrastus von Hohenheim (Paracelsus) turns alchemy toward healing, proposing the tria prima of salt, sulphur, and mercury and an iatrochemical medicine that would shape early modern science and the later occult revival alike.',
    label: 'documented',
    sources: ['Standard history of science and alchemy.'],
    links: [{ href: 'alchemy.html', label: 'Alchemy — the Great Work' }],
  },
  {
    era: 'renaissance', dateText: '1564', sortYear: 1564,
    title: 'John Dee writes the Monas Hieroglyphica',
    body: 'Dee designs a single glyph meant to encode the unity of all creation, dedicating the dense Kabbalistic-alchemical work to the Holy Roman Emperor Maximilian II in a bid for patronage.',
    label: 'documented',
    sources: ['Clulee (1988)', 'Szőnyi (2004).'],
    cast: {
      calendar: 'julian', y: 1527, m: 7, d: 13, hour: 16, lat: 51.51, lon: -0.13, place: 'London',
      note: "John Dee's birth, 13 July 1527 (Julian), London, recorded ~4 p.m. in his own natal figure (cf. Clulee 1988) — the nativity of the Monas's author.",
    },
  },
  {
    era: 'renaissance', dateText: '1582–1589', sortYear: 1583,
    title: "Dee and Kelley's angelic conversations",
    body: 'With the scryer Edward Kelley, Dee records years of crystal-gazing sessions that produce “Enochian,” a purported angelic language with its own alphabet and tables. Reception began on 26 March 1583.',
    label: 'documented',
    sources: ["Harkness, John Dee's Conversations with Angels (1999)."],
    links: [{ href: 'rituals.html', label: 'Rituals — scrying, the practice behind the sessions' }],
    cast: {
      calendar: 'julian', y: 1583, m: 3, d: 26, hour: 12, lat: 51.47, lon: -0.27, place: 'Mortlake, London',
      note: "The reception of the Enochian letters began 26 March 1583 (Julian) at Dee's house in Mortlake (Harkness 1999); hour unrecorded, noon used.",
    },
  },
  {
    era: 'renaissance', dateText: '1600', sortYear: 1600,
    title: 'Giordano Bruno burned at the stake',
    body: 'The philosopher and cosmologist is executed by the Roman Inquisition. Yates later cast him as a Hermetic magus driven by Renaissance occultism — a reading scholars now heavily qualify.',
    label: 'documented',
    sources: ['Yates (1964)', 'later critical scholarship.'],
    cast: {
      calendar: 'gregorian', y: 1600, m: 2, d: 17, hour: 12, lat: 41.8956, lon: 12.4722, place: 'Campo de’ Fiori, Rome',
      note: 'The execution, 17 February 1600 (Gregorian — Rome had reformed in 1582), Campo de’ Fiori; hour unrecorded, noon used. Standard Bruno biographies.',
    },
  },

  // — The Early Modern Turn —
  {
    era: 'earlymodern', dateText: '1614', sortYear: 1614,
    title: 'Casaubon redates the Hermetica',
    body: 'The Swiss philologist Isaac Casaubon shows on linguistic grounds that the Hermetic texts belong to the early Common Era, not deepest Egyptian antiquity — disproving the claim, central to Renaissance Hermeticism, that they predate Moses.',
    label: 'debunked',
    sources: ['Grafton', 'Hermeticism scholarship.'],
  },
  {
    era: 'earlymodern', dateText: '1614–1616', sortYear: 1615,
    title: 'The Rosicrucian manifestos appear',
    body: 'The Fama Fraternitatis (1614), Confessio (1615), and Chymical Wedding of Christian Rosenkreutz (1616) announce a hidden brotherhood. The Chymical Wedding is credited to Johann Valentin Andreae, and scholars largely read the manifestos as allegory rather than the record of a real ancient order.',
    label: 'disputed',
    sources: ['Hanegraaff (2012)', 'Rosicrucian scholarship.'],
  },
  {
    era: 'earlymodern', dateText: '17th c.', sortYear: 1640,
    title: 'The Lemegeton (Lesser Key of Solomon)',
    body: 'A famous grimoire compilation assembled in the seventeenth century gathers earlier Solomonic material, including the Ars Goetia catalogue of spirits. It crystallises the late grimoire tradition that the modern magical orders would inherit and rework.',
    label: 'documented',
    sources: ['Owen Davies, Grimoires: A History of Magic Books (2009).'],
  },
  {
    era: 'earlymodern', dateText: 'late 17th c.', sortYear: 1685,
    title: "Newton's hidden alchemy",
    body: 'Isaac Newton privately writes hundreds of thousands of words on alchemy and Hermetic interpretation. Keynes later called him “the last of the magicians,” complicating any tidy story of a purely rational Scientific Revolution.',
    label: 'documented',
    sources: ['Newton Project', 'history of science.'],
    links: [{ href: 'alchemy.html', label: 'Alchemy — the Great Work' }],
  },
  {
    era: 'earlymodern', dateText: '1776', sortYear: 1776,
    title: 'The (real) Bavarian Illuminati is founded',
    body: 'Adam Weishaupt founds a rationalist, anti-clerical secret society in Ingolstadt, Bavaria. It is banned by edict and effectively dissolved by the mid-1780s — its brief, real history later inflated into a sprawling conspiracy myth it never supported.',
    label: 'documented',
    sources: ['Standard 18th-c. historiography.'],
    cast: {
      calendar: 'gregorian', y: 1776, m: 5, d: 1, hour: 12, lat: 48.7665, lon: 11.4258, place: 'Ingolstadt, Bavaria',
      note: 'The founding, 1 May 1776 (Gregorian), Ingolstadt (standard 18th-c. historiography); hour unrecorded, noon used.',
    },
  },

  // — The Modern Occult Revival —
  {
    era: 'revival', dateText: '1854–1856', sortYear: 1855,
    title: 'Éliphas Lévi revives ritual magic',
    body: "The French occultist's Dogme et Rituel de la Haute Magie links the Tarot to the Kabbalistic Tree of Life and reintroduces ceremonial magic to a modern audience, seeding the revival that followed.",
    label: 'documented',
    sources: ['Hanegraaff (2012)', 'history of occultism.'],
    links: [{ href: '../tarot.html', label: 'Tarot — the spread, laid & read' }],
  },
  {
    era: 'revival', dateText: '1875', sortYear: 1875,
    title: 'The Theosophical Society is founded',
    body: 'Helena Blavatsky and Henry Olcott launch a movement synthesising Western esotericism with Eastern religion, shaping a century of occult, metaphysical, and later New Age thought.',
    label: 'documented',
    sources: ['Hanegraaff (2012).'],
  },
  {
    era: 'revival', dateText: '1888', sortYear: 1888,
    title: 'The Hermetic Order of the Golden Dawn',
    body: 'Westcott, Mathers, and Woodman found the Isis-Urania Temple in London, assembling Hermetic Kabbalah, Tarot, astrology, alchemy, and Enochian magic into the most influential modern magical system — and admitting women as equals.',
    label: 'documented',
    sources: ['Britannica', 'Golden Dawn histories.'],
    links: [{ href: 'rituals.html', label: 'Rituals — the Golden Dawn starter set' }],
    cast: {
      calendar: 'gregorian', y: 1888, m: 3, d: 1, hour: 12, lat: 51.5074, lon: -0.1278, place: 'London',
      note: 'The Isis-Urania Temple charter is dated 1 March 1888 (Gregorian), London (Golden Dawn histories); hour unrecorded, noon used.',
    },
  },
  {
    era: 'revival', dateText: '1888', sortYear: 1888.5,
    title: "The Golden Dawn's fabricated charter",
    body: 'The order’s claimed authorisation by a German adept, “Anna Sprengel,” and the ancient lineage it implied are now widely judged a fabrication — most likely by Westcott himself, who used it to lend the new order authority.',
    label: 'debunked',
    sources: ['Multiple Golden Dawn histories.'],
  },
  {
    era: 'revival', dateText: '1904', sortYear: 1904,
    title: 'Crowley receives The Book of the Law',
    body: 'In Cairo, Aleister Crowley records the founding text of Thelema, with its maxim “Do what thou wilt.” He builds a complete magical-religious system around it over the following decades.',
    label: 'documented',
    sources: ['Standard Crowley scholarship.'],
    cast: {
      calendar: 'gregorian', y: 1904, m: 4, d: 8, hour: 12, lat: 30.0444, lon: 31.2357, place: 'Cairo',
      note: "The first hour of the dictation of Liber AL — noon, 8 April 1904 (Gregorian), Cairo, by Crowley's own record (The Equinox of the Gods).",
    },
  },
  {
    era: 'revival', dateText: '1909', sortYear: 1909,
    title: 'The Rider–Waite–Smith Tarot',
    body: 'Golden Dawn members A. E. Waite and the artist Pamela Colman Smith publish the deck that becomes the template for nearly all modern Tarot.',
    label: 'documented',
    sources: ['Tarot historiography.'],
    links: [{ href: '../tarot.html', label: 'Tarot — that very deck, laid & read' }],
  },

  // — Contemporary Study & Afterlife —
  {
    era: 'contemporary', dateText: '1964', sortYear: 1964,
    title: "Yates's Giordano Bruno and the Hermetic Tradition",
    body: 'Frances Yates argues that Renaissance Hermeticism helped give birth to modern science. The bold “Yates thesis” galvanises the field, but later scholars (Copenhaver, Westman, Hanegraaff) substantially criticise and qualify it.',
    label: 'disputed',
    sources: ['Yates (1964)', 'Westman & McGuire (1977)', 'Hanegraaff (2001).'],
  },
  {
    era: 'contemporary', dateText: '1968', sortYear: 1968,
    title: 'The John Dee “007” hoax is born',
    body: 'Writing as “Richard Deacon,” journalist Donald McCormick casts Dee as Elizabeth I’s secret agent who signed letters with a stylised “007.” Scholar Teresa Burns (2010) and rare-books librarian Katie Birkwood find no such signatures — the claim is an invention.',
    label: 'debunked',
    sources: ['Burns (2010)', 'University of Cambridge / RCP.'],
  },
  {
    era: 'contemporary', dateText: '1994', sortYear: 1994,
    title: "Laycock's sceptical analysis of Enochian",
    body: 'The linguist Donald Laycock concludes that Dee and Kelley’s “angelic language” lacks the features of a natural language and patterns more like glossolalia — undercutting claims of a supernatural origin.',
    label: 'documented',
    sources: ['Laycock, The Complete Enochian Dictionary (1994).'],
  },
  {
    era: 'contemporary', dateText: '1979 · 1999', sortYear: 1999,
    title: 'Esotericism becomes an academic field',
    body: "Antoine Faivre's chair at the Sorbonne (1979) and Wouter Hanegraaff's chair in the History of Hermetic Philosophy at the University of Amsterdam (1999) establish Western esotericism as a rigorous, peer-reviewed discipline rather than a fringe interest.",
    label: 'documented',
    sources: ['Hanegraaff, Esotericism and the Academy (2012).'],
  },
  {
    era: 'contemporary', dateText: '20th–21st c.', sortYear: 2020,
    title: 'Hermetic motifs absorbed into conspiracy culture',
    body: 'Occult and Hermetic imagery — the all-seeing eye, “Illuminati” symbolism — is recycled into modern theories about secret world control. These “bloodline” and “New World Order” narratives have no evidentiary basis and descend from a documented chain of fabrication, distinct from the historical Hermetic tradition itself.',
    label: 'conspiracy',
    sources: ['Shown as discourse', 'see method note.'],
  },
];

export const CHRONOLOGY_CITATION =
  'The Hermetic Chronology — a curated overview, not an exhaustive register; dates for ancient and medieval texts are '
  + 'scholarly estimates rather than fixed points. Every entry carries an epistemic label: the Hermetic tradition is a '
  + 'genuine, well-studied strand of intellectual history, while the modern “Illuminati bloodline” and “New World Order” '
  + 'narratives that borrow its imagery have no evidentiary basis and descend from a documented chain of fabrication. '
  + 'Where history is uncertain it is marked disputed; where a specific claim has been disproven, debunked. '
  + 'Key scholarship: Copenhaver, Hermetica (1992); van Bladel, The Arabic Hermes (2009); Ebeling, The Secret History of '
  + 'Hermes Trismegistus (2007); Hanegraaff, Esotericism and the Academy (2012); Yates (1964, since heavily qualified); '
  + 'Pingree (1981, 2002); Davies, Grimoires (2009); Harkness, John Dee’s Conversations with Angels (1999); '
  + 'Principe, The Secrets of Alchemy (2013); Newman, Newton the Alchemist (2019); Rochberg, In the Path of the Moon (2010); '
  + 'Betz, The Greek Magical Papyri in Translation (1986/1992); Pinch, Magic in Ancient Egypt (1994).';
