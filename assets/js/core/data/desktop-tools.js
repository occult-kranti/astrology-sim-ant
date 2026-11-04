// Catalogue of every existing application page at the desktop-workbench baseline.
// Titles/descriptions are derived from local HTML metadata; routes retain their own method limits.
// Links are relative to pages/desktop.html. No profiles or query parameters are attached.
// Coverage is checked against the actual page inventory by scripts/tests/desktop-library.mjs.

export const DESKTOP_CATEGORIES = Object.freeze([
  "Charts & interpretation",
  "Timing & events",
  "Calendars & astronomy",
  "Vedic studies",
  "Symbols & divination",
  "Books & traditions",
  "Historical research",
  "AI & connections",
  "Help & navigation"
]);

export const DESKTOP_TOOLS = Object.freeze([
  {
    "id": "index",
    "title": "Observatory home",
    "category": "Help & navigation",
    "description": "A scientifically-honest study and calculation edition of the whole tradition: Western astrology (Lilly's Christian Astrology, 1647, and the Picatrix's astral magic), the Indian systems (Jyotiṣa, praśna,…",
    "href": "../index.html"
  },
  {
    "id": "abhichara-atharvan",
    "title": "The Atharvan roots — the Atharvaveda abhicāra corpus & the Kauśika Sūtra",
    "category": "Books & traditions",
    "description": "The oldest layer of Indian ritual magic: the Atharvaveda's abhicāra hymns with public-domain Bloomfield/Whitney translations and the Kauśika Sūtra ritual applications, the kṛtyā counter-charms…",
    "href": "abhichara/atharvan.html"
  },
  {
    "id": "abhichara-index",
    "title": "Abhicāra & the ṣaṭkarman — the Indian ritual-magic traditions, described",
    "category": "Books & traditions",
    "description": "The Indian ritual-magic wing: abhicāra and the tantric ṣaṭkarman ('the six acts' — śānti, vaśīkaraṇa, stambhana, vidveṣaṇa, uccāṭana, māraṇa), presented at the level of academic scholarship (Goudriaan,…",
    "href": "abhichara/index.html"
  },
  {
    "id": "abhichara-six-acts",
    "title": "The six acts, one by one — the ṣaṭkarman correspondence tables & timing screen",
    "category": "Books & traditions",
    "description": "The tantric ṣaṭkarman act by act (śānti, vaśīkaraṇa, stambhana, vidveṣaṇa, uccāṭana, māraṇa) with the list-variants, Mahīdhara's 19-item apparatus schema, and every verified correspondence table — the two…",
    "href": "abhichara/six-acts.html"
  },
  {
    "id": "abhichara-sources",
    "title": "The texts & the scholarship — the abhicāra sources, dated",
    "category": "Books & traditions",
    "description": "The sources of the Indian ritual-magic wing: every text dated with its editions and attribution flags (the Rāvaṇa attribution of the Uḍḍīśatantra is legendary), from the Atharvaveda (c. 1200-1000 BCE) to…",
    "href": "abhichara/sources.html"
  },
  {
    "id": "about-index",
    "title": "About & Sources",
    "category": "Help & navigation",
    "description": "William Lilly's biography, the editions of Christian Astrology, the modern traditional revival, the scientific assessment of astrology, and the technical and editorial notes for this site.",
    "href": "about/index.html"
  },
  {
    "id": "autopilot",
    "title": "The Grand Orchestrator — one prompt, every engine",
    "category": "AI & connections",
    "description": "One prompt, every engine. Paste your own Claude API key, type any question — simple or advanced, about a past date or a future one — and Claude agentically drives all of the site's engines as tools: it…",
    "href": "autopilot.html"
  },
  {
    "id": "basics",
    "title": "The Basics — every concept, explained",
    "category": "Help & navigation",
    "description": "A plain-English explainer of every concept this site computes: the chart and the zodiac, the planets, houses and aspects, essential and accidental dignity, the Lots, sect, the planetary hours; horary…",
    "href": "basics.html"
  },
  {
    "id": "birth-reading",
    "title": "Birth reading & calendar comparison",
    "category": "Charts & interpretation",
    "description": "Build a private birth reading with calculated sky charts, calendar comparisons, historical rules, timing studies and inspectable sources.",
    "href": "birth-reading.html"
  },
  {
    "id": "book1-degrees",
    "title": "The Degree Tables & Body Parts",
    "category": "Charts & interpretation",
    "description": "Lilly's two necessary Tables of the Signs — the masculine/feminine and light/dark/smoky/void degrees — the deep/pitted, azimene and fortunate degrees, and the planet-by-sign body-parts grid.",
    "href": "book1/degrees.html"
  },
  {
    "id": "book1-dignities",
    "title": "Essential Dignity Calculator",
    "category": "Charts & interpretation",
    "description": "Score any planet in any degree by William Lilly's essential-dignity points: domicile, exaltation, triplicity, term and face, with the almuten of the degree.",
    "href": "book1/dignities.html"
  },
  {
    "id": "book1-index",
    "title": "Book I — An Introduction to Astrology",
    "category": "Charts & interpretation",
    "description": "William Lilly's Book I: the fundamentals of astrology — the twelve signs, seven planets, twelve houses, the aspects, and the tables of essential dignity, with interactive tools.",
    "href": "book1/index.html"
  },
  {
    "id": "book1-master",
    "title": "Book I Master Tool",
    "category": "Charts & interpretation",
    "description": "The Book I master calculator: one chart input yields every fundamental computation — positions, full essential and accidental dignity, almutens, aspects, antiscia, the Part of Fortune, planetary hour and…",
    "href": "book1/master.html"
  },
  {
    "id": "book1-planetary-hours",
    "title": "Planetary Hours",
    "category": "Charts & interpretation",
    "description": "The ruler of the present planetary hour and day in the Chaldean order, with the full table of the twenty-four unequal hours from sunrise to sunrise.",
    "href": "book1/planetary-hours.html"
  },
  {
    "id": "book1-reference",
    "title": "Signs, Planets & Houses — Reference",
    "category": "Charts & interpretation",
    "description": "A reference to the twelve signs, seven planets and twelve houses as William Lilly describes them in Book I of Christian Astrology (1647).",
    "href": "book1/reference.html"
  },
  {
    "id": "book2-considerations",
    "title": "Considerations before Judgement",
    "category": "Charts & interpretation",
    "description": "William Lilly's Considerations before Judgement — the cautions that tell whether a horary figure is radical and fit to be judged.",
    "href": "book2/considerations.html"
  },
  {
    "id": "book2-examples",
    "title": "Lilly's Worked Charts (live)",
    "category": "Charts & interpretation",
    "description": "William Lilly's own horary charts from Christian Astrology — the stolen fish, the ship at sea, the marriage, the lost dog — read LIVE from their printed figures: the wheel drawn, every dignity scored, and…",
    "href": "book2/examples.html"
  },
  {
    "id": "book2-horary",
    "title": "Horary Chart Calculator — Christian Astrology",
    "category": "Charts & interpretation",
    "description": "Cast a horary chart in William Lilly's Regiomontanus style for any moment and place: significators, dignities, aspects with Lilly's orbs, and the considerations before judgement.",
    "href": "book2/horary.html"
  },
  {
    "id": "book2-houses",
    "title": "Horary, House by House (with a live judgement reader)",
    "category": "Charts & interpretation",
    "description": "Which house rules which horary question, with Lilly's natural significators, what perfection means for each topic, and the testimonies that affirm and deny — plus a live judgement reader that casts a chart…",
    "href": "book2/houses.html"
  },
  {
    "id": "book2-index",
    "title": "Book II — The Resolution of All Questions",
    "category": "Charts & interpretation",
    "description": "William Lilly's Book II: horary astrology. The method of judging a question step by step — significators, the Moon, applying aspects, perfection, translation and collection of light, and timing.",
    "href": "book2/index.html"
  },
  {
    "id": "book3-index",
    "title": "Book III — The Judgement of Nativities",
    "category": "Charts & interpretation",
    "description": "William Lilly's Book III: natal astrology. Rectification, the hyleg and alcocoden, the Lord of the Geniture, temperament, and prediction by directions, profections and revolutions.",
    "href": "book3/index.html"
  },
  {
    "id": "book3-master",
    "title": "Book III Master Tool — Nativities",
    "category": "Charts & interpretation",
    "description": "A natal super-view: the birth chart with positions and dignities, the Lord of the Geniture, temperament, the annual profection and Lord of the Year, the hyleg and alcocoden, the primary directions to the…",
    "href": "book3/master.html"
  },
  {
    "id": "book3-nativity",
    "title": "Nativity Calculator",
    "category": "Charts & interpretation",
    "description": "A natal chart in William Lilly's style: houses, dignities, the Part of Fortune, the Lord of the Geniture, and the temperament balance.",
    "href": "book3/nativity.html"
  },
  {
    "id": "buddhist-dhammapada",
    "title": "The Dhammapada (vaggas 1–5, Dhp 1–75) — word by word",
    "category": "Books & traditions",
    "description": "The Dhammapada, the first five chapters (vaggas 1–5, verses 1–75): Yamakavagga (Pairs), Appamādavagga (Heedfulness), Cittavagga (the Mind), Pupphavagga (Flowers) and Bālavagga (the Fool). Each Bilara…",
    "href": "buddhist/dhammapada.html"
  },
  {
    "id": "buddhist-heart",
    "title": "The Heart Sūtra (Prajñāpāramitā-hṛdaya) — word by word",
    "category": "Books & traditions",
    "description": "The shorter Prajñāpāramitā-hṛdaya (Heart Sūtra), word-by-word from the Sanskrit (Müller–Nanjio 1884): a per-word gloss with grammar and Monier-Williams citation on hover/tap/keyboard, F. Max Müller's…",
    "href": "buddhist/heart.html"
  },
  {
    "id": "buddhist-index",
    "title": "Buddhist scriptures — word by word",
    "category": "Books & traditions",
    "description": "A study wing over a curated Buddhist canon, in the manner of the Yoga Sūtras wing: foundational texts word-by-word — the Metta Sutta (Snp 1.8), the Heart Sūtra (Prajñāpāramitā-hṛdaya), the Ānāpānassati…",
    "href": "buddhist/index.html"
  },
  {
    "id": "buddhist-metta",
    "title": "The Metta Sutta (Snp 1.8) — word by word",
    "category": "Books & traditions",
    "description": "The Karaṇīyametta Sutta — the discourse on loving-kindness (Sutta Nipāta 1.8, = Khuddakapāṭha 9), word-by-word: the Mahāsaṅgīti Pāli (IAST), a per-word gloss with grammar and PED citation on…",
    "href": "buddhist/metta.html"
  },
  {
    "id": "buddhist-mn118",
    "title": "The Ānāpānassati Sutta (MN 118) — word by word",
    "category": "Books & traditions",
    "description": "The Ānāpānassati Sutta — mindfulness of breathing (Majjhima Nikāya 118), segment by segment: the sixteen steps in four tetrads, the Mahāsaṅgīti Pāli (IAST) with a per-word gloss (grammar + PED citation on…",
    "href": "buddhist/mn118.html"
  },
  {
    "id": "buddhist-sources",
    "title": "Sources & licensing — the Buddhist wing",
    "category": "Books & traditions",
    "description": "The editions and licensing of the Buddhist scriptures wing: the SuttaCentral CC0 translations, the Mahāsaṅgīti public-domain Pāli, Müller's public-domain SBE 49 for the Heart Sūtra, and the…",
    "href": "buddhist/sources.html"
  },
  {
    "id": "calendar-atlas",
    "title": "Calendar atlas",
    "category": "Calendars & astronomy",
    "description": "Compare the conventions that give a moment its meaning: civil dates, solar positions, lunar divisions and named historical methods.",
    "href": "calendar-atlas.html"
  },
  {
    "id": "calendar-compare",
    "title": "Compare one moment",
    "category": "Calendars & astronomy",
    "description": "Compare civil calendar dates, astronomical positions and documented cultural time conventions for the same chosen instant and location.",
    "href": "calendar-compare.html"
  },
  {
    "id": "calendar-search",
    "title": "Calendar research lab",
    "category": "Timing & events",
    "description": "Search explicit calendar samples, compare brute and optimized calculations, and inspect source-labelled event comparisons with controls.",
    "href": "calendar-search.html"
  },
  {
    "id": "calendar-timeline",
    "title": "Calendar timeline",
    "category": "Calendars & astronomy",
    "description": "Move through civil dates and explore one shared instant across calculated sky charts, calendar traditions and source-attributed study rules.",
    "href": "calendar-timeline.html"
  },
  {
    "id": "calendars-chinese",
    "title": "Chinese calendars",
    "category": "Calendars & astronomy",
    "description": "Compare the Chinese lunisolar civil date with twenty-four calculated solar-term events. Four Pillars remains a separate, unimplemented method.",
    "href": "calendars/chinese.html"
  },
  {
    "id": "calendars-egyptian",
    "title": "Egyptian calendars",
    "category": "Calendars & astronomy",
    "description": "Read the implemented Coptic civil date alongside explicitly bounded ancient civil and lunar research entries.",
    "href": "calendars/egyptian.html"
  },
  {
    "id": "calendars-hebrew",
    "title": "Hebrew calendars",
    "category": "Calendars & astronomy",
    "description": "Compare the fixed Hebrew civil-calendar display with the separate questions of sunset boundaries, observance and symbolic interpretation.",
    "href": "calendars/hebrew.html"
  },
  {
    "id": "calendars-vedic",
    "title": "Vedic calendars",
    "category": "Calendars & astronomy",
    "description": "Inspect approximate Lahiri solar and lunar divisions alongside the Indian national calendar. Regional festival systems remain separate.",
    "href": "calendars/vedic.html"
  },
  {
    "id": "calendars-western",
    "title": "Western calendars",
    "category": "Calendars & astronomy",
    "description": "Compare Gregorian and Julian dates, tropical positions, named house systems and ecclesiastical computus for one chosen moment.",
    "href": "calendars/western.html"
  },
  {
    "id": "calendars",
    "title": "Calendars, prayer times & Qibla",
    "category": "Calendars & astronomy",
    "description": "Compare named civil calendars, convert Gregorian and Julian dates, calculate prayer times with explicit conventions, and find a numerical Qibla bearing.",
    "href": "calendars.html"
  },
  {
    "id": "chronology-alchemy",
    "title": "Alchemy — the Great Work",
    "category": "Books & traditions",
    "description": "The Great Work: alchemy's four colour-stages, the real chemistry beneath the symbolism, its materials and theory, and the adepts from Zosimos to Newton — with laboratory, spiritual, and Jungian readings…",
    "href": "chronology/alchemy.html"
  },
  {
    "id": "chronology-field-guide",
    "title": "Field Guide — reported folklore of practice",
    "category": "Books & traditions",
    "description": "Contemporary magical practice organized by material, purpose, and the timeframe practitioners report — candle colours, crystals, and herbs drawn from practitioner communities, presented as reported…",
    "href": "chronology/field-guide.html"
  },
  {
    "id": "chronology-hermetica",
    "title": "Hermetica — the contemplative practices",
    "category": "Books & traditions",
    "description": "The genuine contemplative practices of the ancient Hermetica: the rebirth of Corpus Hermeticum XIII, the soul's ascent, the rite of the Eighth and Ninth, the expansion-of-mind exercise of CH XI, the…",
    "href": "chronology/hermetica.html"
  },
  {
    "id": "chronology-index",
    "title": "The Hermetic Chronology — as above, so below",
    "category": "Books & traditions",
    "description": "A sourced timeline tracing Hermetic philosophy and magic from the Hellenistic Hermetica through Arabic transmission, Renaissance translation, John Dee, the grimoire tradition, and the modern occult revival…",
    "href": "chronology/index.html"
  },
  {
    "id": "chronology-library",
    "title": "Library — the chronology's sources, tiered",
    "category": "Books & traditions",
    "description": "A verified, reviewed library on Hermeticism, magic, alchemy, and the occult: scholarly books, peer-reviewed journals, and reputable web archives, each tagged by reliability tier.",
    "href": "chronology/library.html"
  },
  {
    "id": "chronology-rituals",
    "title": "Rituals — the starter practices",
    "category": "Books & traditions",
    "description": "Six genuine beginner rites of Western ceremonial magic — grounding, the Qabalistic Cross, the Lesser Banishing Ritual of the Pentagram, the Middle Pillar, candle work, and scrying — with usable steps and an…",
    "href": "chronology/rituals.html"
  },
  {
    "id": "compare",
    "title": "How this site compares — an honest survey of the landscape",
    "category": "Historical research",
    "description": "A dated, cited survey of ~30 astrology and divination products (astro.com, Astro-Seek, Solar Fire, Astro Gold, Astrolog, Jagannatha Hora, Parashara's Light, Maitreya, Drik Panchang, Morinus, Delphic Oracle,…",
    "href": "compare.html"
  },
  {
    "id": "confluence",
    "title": "The Great Confluence — a map of books and their journeys",
    "category": "Books & traditions",
    "description": "The Great Confluence: nine traditions — Christian contemplation, Hermetica & alchemy, Kabbalah, Sufi Islam, Yoga & Vedānta, Tantra & Rasaśāstra, Buddhist lineages and Daoist China — laid out as parallel…",
    "href": "confluence.html"
  },
  {
    "id": "contents",
    "title": "Master Index",
    "category": "Help & navigation",
    "description": "The complete index and concept map of the interactive Christian Astrology — every page, tool and key concept, organised by book and theme for easy access.",
    "href": "contents.html"
  },
  {
    "id": "country-calendars",
    "title": "Countries & historical calendars",
    "category": "Historical research",
    "description": "Compare documented historical reference dates, civil calendar conventions and explicitly assumed house geometry, with sources and uncertainty retained.",
    "href": "country-calendars.html"
  },
  {
    "id": "cycles",
    "title": "Cycles of History — Jupiter–Saturn great conjunctions & the honest eclipse finder",
    "category": "Timing & events",
    "description": "The Jupiter–Saturn great conjunctions computed across the centuries (geocentric, tropical of-date) with the trigon shifts, the triple passes and Abū Maʿshar's doctrinal mean-conjunction overlay — plus an…",
    "href": "cycles.html"
  },
  {
    "id": "eschatology-atlas",
    "title": "Claims & documents",
    "category": "Historical research",
    "description": "Explore sourced eschatological claims through a typed evidence graph, qualified dates and an inspectable ledger. Calendar and sky readings use separately explicit study assumptions.",
    "href": "eschatology-atlas.html"
  },
  {
    "id": "event-horizon",
    "title": "Event horizon · 2026–2031",
    "category": "Timing & events",
    "description": "Explore every date through 1 January 2031. Compare named historical rule profiles, calculated astronomical events and source-qualified religious observances.",
    "href": "event-horizon.html"
  },
  {
    "id": "experiment",
    "title": "Test it yourself — the falsification demo",
    "category": "Historical research",
    "description": "An in-tool honest-science demonstration: permute the moment of an election across a window and watch the fitness score scatter into a null distribution. See where your moment falls, and how a few minutes…",
    "href": "experiment.html"
  },
  {
    "id": "geomancy",
    "title": "Geomancy — the Shield Chart, cast & judged",
    "category": "Symbols & divination",
    "description": "Western/Arabic geomancy (ʿilm al-raml), Agrippa's 'daughter of astrology': strike the four Mothers and the engine derives the Daughters, Nieces, the two Witnesses, the Judge and the Reconciler by pure…",
    "href": "geomancy.html"
  },
  {
    "id": "glossary",
    "title": "Glossary & Dictionary",
    "category": "Help & navigation",
    "description": "A searchable dictionary of the terms of art in William Lilly's Christian Astrology — dignities, aspects, horary technique, points and more, each defined and linked to where it is used.",
    "href": "glossary.html"
  },
  {
    "id": "greatworks-agrippa",
    "title": "Agrippa — Three Books of Occult Philosophy (and the spurious Fourth Book)",
    "category": "Books & traditions",
    "description": "Agrippa's Three Books of Occult Philosophy (Latin 1533; English 'J.F.' 1651) as a chapter-map study guide — Book I natural magic (74 ch), Book II celestial/mathematical (60 ch, incl. II.22 the planetary…",
    "href": "greatworks/agrippa.html"
  },
  {
    "id": "greatworks-crowley",
    "title": "Aleister Crowley — 777, Liber AL, Book 4, Magick, the Book of Thoth",
    "category": "Books & traditions",
    "description": "Aleister Crowley's works as a study guide: 777 (1909) whose Key Scale rows are the site's Tree of Life rows, Liber AL vel Legis and the I:57 verse behind the tzaddi–heh dispute, Book 4 Parts I–II (yoga +…",
    "href": "greatworks/crowley.html"
  },
  {
    "id": "greatworks-dee",
    "title": "John Dee — the Monas, the angelic diaries, the Enochian Calls, the Mathematicall Praeface",
    "category": "Books & traditions",
    "description": "John Dee's works as a study guide: the Monas Hieroglyphica (1564), A True & Faithful Relation (Casaubon, 1659) whose dated séances the site's engine can cast, the Enochian system and its full publication…",
    "href": "greatworks/dee.html"
  },
  {
    "id": "greatworks-east",
    "title": "The Great Works — Eastern masters",
    "category": "Books & traditions",
    "description": "The Eastern masters shelf of the Great Works wing: Varāhamihira (the classical jyotiṣa flagship — Bṛhajjātaka, Bṛhat Saṁhitā, Pañcasiddhāntikā), Swami Vivekananda (Raja Yoga, 1896 — his rendering of the…",
    "href": "greatworks/east.html"
  },
  {
    "id": "greatworks-hall",
    "title": "Manly P. Hall — The Secret Teachings of All Ages",
    "category": "Books & traditions",
    "description": "Manly P. Hall's Secret Teachings of All Ages (1928) as a 45-chapter study guide — every chapter mapped to the site tool that computes what it describes (Kabbalah tree, tarot, Picatrix correspondences,…",
    "href": "greatworks/hall.html"
  },
  {
    "id": "greatworks-hermetica",
    "title": "The Hermetica — Corpus, Asclepius, Stobaean excerpts, Emerald Tablet",
    "category": "Books & traditions",
    "description": "The philosophical Hermetica as a treatise-by-treatise study guide: the Corpus Hermeticum (CH I–XIV, XVI–XVIII, with the visible XV numbering gap), the Asclepius and its god-making rite (ancestor of the…",
    "href": "greatworks/hermetica.html"
  },
  {
    "id": "greatworks-index",
    "title": "The Great Works — author → book → chapter study guides",
    "category": "Books & traditions",
    "description": "A cited study wing for the primary books behind the site's esoteric tools — Manly P. Hall's Secret Teachings, the Hermetica, Crowley, John Dee, Agrippa, and the kindred authors (Lévi, Ficino, Iamblichus,…",
    "href": "greatworks/index.html"
  },
  {
    "id": "greatworks-kin",
    "title": "The Kindred — Lévi, Ficino, Iamblichus, Regardie",
    "category": "Books & traditions",
    "description": "Four kindred authors behind the site's esoteric tools: Éliphas Lévi (Dogme et rituel, 1854–56; the influential tarot–Hebrew-letter key), Marsilio Ficino (De vita libri tres, 1489; astrological medicine,…",
    "href": "greatworks/kin.html"
  },
  {
    "id": "greatworks-varahamihira",
    "title": "Varāhamihira — Bṛhajjātaka",
    "category": "Books & traditions",
    "description": "Varāhamihira (c. 505–587 CE), the 6th-century Ujjain astronomer-astrologer, as a chapter-by-chapter study guide — his Bṛhajjātaka (28 adhyāyas) mapped onto the site's Vedic (sidereal) engine, the yoga…",
    "href": "greatworks/varahamihira.html"
  },
  {
    "id": "greatworks-vivekananda",
    "title": "Swami Vivekananda — Raja Yoga",
    "category": "Books & traditions",
    "description": "Swami Vivekananda (1863–1902) as a chapter-by-chapter study guide — his Raja Yoga (1896), the book that recast Patañjali's Yoga Sūtras as a rational 'science of the mind' for Western readers, mapped…",
    "href": "greatworks/vivekananda.html"
  },
  {
    "id": "greatworks-yogananda",
    "title": "Paramahansa Yogananda — Autobiography of a Yogi",
    "category": "Books & traditions",
    "description": "Paramahansa Yogananda (1893–1952) as a chapter-by-chapter study guide — the 1946 first edition of Autobiography of a Yogi (48 chapters), the wing's honest-framing stress-test. Every supernatural episode…",
    "href": "greatworks/yogananda.html"
  },
  {
    "id": "handcalc",
    "title": "Cast a chart by hand — the ephemeris & tables method, checked against the engine",
    "category": "Charts & interpretation",
    "description": "The classic manual chart-casting workflow — ephemeris + atlas + book of tables, as taught in Catherine Urban's workshop and The Astrology Podcast ep. 396 — reconstructed in five stations: clock time → UT…",
    "href": "handcalc.html"
  },
  {
    "id": "how-it-works",
    "title": "How it's calculated — step by step",
    "category": "Help & navigation",
    "description": "Every calculation on the site explained in plain English: its meaning, the numbered step-by-step method exactly as the engine performs it, and a concrete worked example — for dignity, planetary hours,…",
    "href": "how-it-works.html"
  },
  {
    "id": "iching",
    "title": "I Ching — the Book of Changes, cast & read",
    "category": "Symbols & divination",
    "description": "The I Ching (Yijing): cast the coins and the engine reads the primary hexagram, the moving lines, the nuclear (inner) hexagram, and the relating hexagram — the tendency of the change — over the 64 King Wen…",
    "href": "iching.html"
  },
  {
    "id": "incense",
    "title": "Incense & Suffumigation",
    "category": "Symbols & divination",
    "description": "The planetary suffumigations of Renaissance astral magic, indexed two ways — per planet as the sources give them, and per material across every planet that names it — with the ambiguities that a naive index…",
    "href": "incense.html"
  },
  {
    "id": "interpret",
    "title": "Reading your results — a reference guide",
    "category": "Charts & interpretation",
    "description": "A panel-by-panel guide to reading the output of the Master Tool: the figure and positions, the dignity ledger and its +/- scores, aspects and reception, the Lots, the chart-health verdict, horary…",
    "href": "interpret.html"
  },
  {
    "id": "jung-experiment",
    "title": "Jung's astrological marriage experiment — re-run honestly",
    "category": "Charts & interpretation",
    "description": "C. G. Jung's 1952 astrological experiment from the Synchronicity essay, in full: 483 married couples, 50 cross-aspects, the three classic marriage aspects topping the three batches — and why it failed.…",
    "href": "jung/experiment.html"
  },
  {
    "id": "jung-index",
    "title": "Jung & astrology — the psychologist among the horoscopes",
    "category": "Charts & interpretation",
    "description": "C. G. Jung and astrology, studied honestly: from the 1911 letters to Freud ('my evenings are taken up very largely with astrology') through the patient horoscopes, Psychological Types, Aion's astrological…",
    "href": "jung/index.html"
  },
  {
    "id": "jung-sources",
    "title": "Jung & astrology — sources & reading",
    "category": "Charts & interpretation",
    "description": "The full bibliography of C. G. Jung and astrology: the primary Collected Works (where astrology appears in each), the key dated letters (Freud 1911, Raman 1947, Barbault 1954, the Pauli letters), and the…",
    "href": "jung/sources.html"
  },
  {
    "id": "jung-theory",
    "title": "Jung's theory of astrology — projection, archetypes, synchronicity",
    "category": "Charts & interpretation",
    "description": "What C. G. Jung actually claimed about astrology and what he never claimed: astrology as the projected psychology of antiquity (the 1930 Wilhelm memorial), the planets as archetypes of the collective…",
    "href": "jung/theory.html"
  },
  {
    "id": "jung-timeline",
    "title": "Jung & astrology — the timeline",
    "category": "Charts & interpretation",
    "description": "A cited timeline of C. G. Jung's fifty-year engagement with astrology: 1875 birth at Kesswil, the 1911 horoscope letters to Freud, patient charts, Psychological Types (1921), the Wilhelm memorial (1930),…",
    "href": "jung/timeline.html"
  },
  {
    "id": "jung-tool",
    "title": "The Jung chart tool — psychological horoscope · synastry · aeon clock",
    "category": "Charts & interpretation",
    "description": "The three kinds of chart-work C. G. Jung actually did, computed live: the psychological horoscope he cast for patients (planets as archetypes, the element→function balance, anima/animus, the Sol–Luna…",
    "href": "jung/tool.html"
  },
  {
    "id": "kabbalah",
    "title": "Kabbalah — the Tree of Life explorer & gematria",
    "category": "Symbols & divination",
    "description": "The kabbalistic Tree of Life in Kircher's 1652 layout as an interactive diagram: 10 sephiroth (pillar, sphere, planet and its kamea) and 22 paths (Hebrew letter, Sefer Yetzirah letter-class, Golden Dawn…",
    "href": "kabbalah.html"
  },
  {
    "id": "kuta",
    "title": "Kūṭa matching — the aṣṭakūṭa (36 guṇa) & the ten porutham",
    "category": "Vedic studies",
    "description": "Kūṭa matching: the North-Indian aṣṭakūṭa (36-guṇa milāpa — varṇa, vaśya, tārā, yoni, graha-maitrī, gaṇa, bhakūṭa, nāḍī) and the South-Indian ten porutham (dina, gaṇa, mahendra, strī-dīrgha, yoni, rāśi,…",
    "href": "kuta.html"
  },
  {
    "id": "learn",
    "title": "Learn astrology & the mathematics behind it — a step-by-step curriculum",
    "category": "Help & navigation",
    "description": "A complete step-by-step curriculum from zero to every wing of the Workbench, with the mathematics made first-class: the honest frame, the celestial sphere and Local Sidereal Time, the chart (signs, planets,…",
    "href": "learn.html"
  },
  {
    "id": "library-esoteric",
    "title": "Divination & esoteric systems — the practitioners",
    "category": "Books & traditions",
    "description": "The expert catalog of the divination and esoteric arts: tarot, geomancy, I Ching, runes, Kabbalah, Western alchemy and Jung & divination. Each practice pairs a history shelf (Dummett, Rutt, Page, Scholem,…",
    "href": "library/esoteric.html"
  },
  {
    "id": "library-index",
    "title": "The Practitioners' Library — the people & the books",
    "category": "Books & traditions",
    "description": "An expert deep-dive catalog of the practitioners and sources behind every practice on the Workbench — Western traditional astrology, the Indian systems, and the divination/esoteric arts. Every person, book…",
    "href": "library/index.html"
  },
  {
    "id": "library-indian",
    "title": "The Indian systems (Jyotiṣa) — the practitioners",
    "category": "Books & traditions",
    "description": "The expert catalog of the Indian systems: Parāśarī natal, Jaimini, nakṣatra, Krishnamurti Paddhati (KP), tājika varṣaphala, muhūrta, praśna and nāḍī, plus the history-of-jyotiṣa, rasaśāstra and yoga…",
    "href": "library/indian.html"
  },
  {
    "id": "library-western",
    "title": "Western traditional astrology — the practitioners",
    "category": "Books & traditions",
    "description": "The expert catalog of Western traditional astrology: horary, electional, natal (Hellenistic/medieval/Renaissance), mundane and astrological magic (Picatrix). Lilly, Bonatti and the Arabic-era sources…",
    "href": "library/western.html"
  },
  {
    "id": "master",
    "title": "The Master Tool has moved to the Workbench",
    "category": "Charts & interpretation",
    "description": "The Unified Master Tool is now the Workbench — one tool that runs the whole engine (Lilly's three books, the Picatrix layer, and the Vedic chart side by side) in one place.",
    "href": "master.html"
  },
  {
    "id": "mcp",
    "title": "Connect MCP",
    "category": "AI & connections",
    "description": "Connect the Workbench's private MCP server, browse the source calculation catalogue, or use the same engines locally in Live Symbol Studio.",
    "href": "mcp.html"
  },
  {
    "id": "moments",
    "title": "Moment Scanner — every rulebook, one timeline",
    "category": "Timing & events",
    "description": "The cross-system moment scanner: one time-range scan showing each tradition's verdict on the same sky, side by side — the Lilly/Picatrix election verdict, the Chaldean planetary hour, the Indian muhūrta,…",
    "href": "moments.html"
  },
  {
    "id": "muhurta",
    "title": "Muhūrta — the Indian election of the moment",
    "category": "Vedic studies",
    "description": "Muhūrta, the Indian electional art: the 30 muhūrtas of the sunrise-to-sunrise day (Rudra to Samudra, with Abhijit at noon and the pre-dawn Brāhma muhūrta), the three avoided kālas (Rāhu-kāla, Yamaghaṇṭa,…",
    "href": "muhurta.html"
  },
  {
    "id": "newton-chronology",
    "title": "Newton’s chronology & the calendar",
    "category": "Historical research",
    "description": "Inspect Newton’s conditional chronological arithmetic, its manuscript sources and limits, then explore a deliberately chosen date across calendars and the calculated sky.",
    "href": "newton-chronology.html"
  },
  {
    "id": "now",
    "title": "Right Now — live sky",
    "category": "Calendars & astronomy",
    "description": "A live astrological dashboard for the present moment: the planetary hour and day, the Moon's condition and mansion, what the tradition deemed fit to do now, the active cautions and any Behenian fixed-star…",
    "href": "now.html"
  },
  {
    "id": "opgraph",
    "title": "The Operative Corpus — what these books tell an operator to do",
    "category": "Historical research",
    "description": "The operative-content graph: 101 works from five corpora typed by the KIND of procedure each contains, graded on three separate completeness axes with a named basis and a verbatim evidence sentence, and…",
    "href": "opgraph.html"
  },
  {
    "id": "picatrix-correspondences",
    "title": "Planetary Magic — Correspondences",
    "category": "Symbols & divination",
    "description": "A study reference for the seven-planet talismanic correspondences of the Picatrix and Cornelius Agrippa: the petitions each planet governs and its matching suffumigations, colours, metals, stones and named…",
    "href": "picatrix/correspondences.html"
  },
  {
    "id": "picatrix-election",
    "title": "Election — Picatrix",
    "category": "Symbols & divination",
    "description": "An interactive electional tool: choose a moment, place and magical aim, and it auto-calculates a fully cited readout — Lilly's dignities, the planetary hour and day, the Moon's condition and mansion, the…",
    "href": "picatrix/election.html"
  },
  {
    "id": "picatrix-faces",
    "title": "The 36 Decan Faces",
    "category": "Symbols & divination",
    "description": "The 36 decan faces of the zodiac — each 10° face with its ruling planet in Chaldean order and its traditional magical image from Agrippa's Three Books II.37 (with Picatrix II.11 variants flagged), presented…",
    "href": "picatrix/faces.html"
  },
  {
    "id": "picatrix-index",
    "title": "Picatrix — Astrological Magic",
    "category": "Symbols & divination",
    "description": "The Picatrix (Ghāyat al-Ḥakīm) layer: the 28 lunar mansions, the 36 decan faces, the 15 Behenian fixed stars and the planetary correspondences of medieval astrological magic — presented as historical…",
    "href": "picatrix/index.html"
  },
  {
    "id": "picatrix-kameas",
    "title": "Planetary kameas & sigils — the seven magic squares",
    "category": "Symbols & divination",
    "description": "Seven sourced planetary kameas, verified arithmetic, and explicit Latin or Hebrew letter-to-cell reconstructions. Inspect normalization and export SVG, PNG or method JSON. Historical symbolism for study,…",
    "href": "picatrix/kameas.html"
  },
  {
    "id": "picatrix-mansions",
    "title": "The 28 Mansions of the Moon",
    "category": "Symbols & divination",
    "description": "The 28 tropical Mansions of the Moon used in Picatrix and Agrippa astrological magic — each a uniform 12°51′26″ arc from 0° Aries — with indicator stars, the traditional magical use of each (Agrippa II.33),…",
    "href": "picatrix/mansions.html"
  },
  {
    "id": "picatrix-prayers",
    "title": "Planetary Prayers & Spirits — Picatrix Books III & IV",
    "category": "Symbols & divination",
    "description": "The Picatrix's Book III and IV: the seven planetary prayers (III.7), the directional planetary spirits of the Liber Antimaquis (III.9), the Perfect Nature (III.6), and a summary of Book IV — recorded as…",
    "href": "picatrix/prayers.html"
  },
  {
    "id": "picatrix-stars",
    "title": "The 15 Behenian Fixed Stars",
    "category": "Symbols & divination",
    "description": "The medieval set of 15 Behenian fixed stars (Hermes / Agrippa) used in talismanic magic — each with a planetary nature, stone, plant and traditional use — with each star's ecliptic longitude precessed live…",
    "href": "picatrix/stars.html"
  },
  {
    "id": "picatrix-talisman",
    "title": "Talisman Workflow — Picatrix",
    "category": "Symbols & divination",
    "description": "A guided, step-by-step talisman workflow: choose an aim, elect the moment, gather the historical correspondences (suffumigation, colour, metal, stone, spirits), set the Moon's mansion and the decan image,…",
    "href": "picatrix/talisman.html"
  },
  {
    "id": "practices-index",
    "title": "Practices — the museum of methods",
    "category": "Books & traditions",
    "description": "A museum of historical contemplative and esoteric METHODS, transposed from the Great Works wing: not 'who wrote what?' but 'what did people DO, and which book defines it?' Eight practice groups; the mudrā…",
    "href": "practices/index.html"
  },
  {
    "id": "practices-mudras",
    "title": "The mudrā catalog — the seals, text by text",
    "category": "Books & traditions",
    "description": "The haṭha-yoga mudrās as cited museum records: the Gheraṇḍa Saṁhitā's 25 seals (Vasu 1895) and the Haṭhayogapradīpikā's 10 (Sinh 1914), kept as separate per-source records and joined by a crosswalk. Each…",
    "href": "practices/mudras.html"
  },
  {
    "id": "prasna",
    "title": "Praśna — Indian horary & the KP sub-lords",
    "category": "Vedic studies",
    "description": "Praśna (Indian horary): judge a question from the sidereal chart of the moment it is asked, by the verified rules of the Ṣaṭpañcāśikā, Daivajña Vallabha and Praśna Mārga — plus the KP (Krishnamurti…",
    "href": "prasna.html"
  },
  {
    "id": "rasa",
    "title": "Rasaśāstra & yantra-mathematics — Indian alchemy of mercury & the magic squares",
    "category": "Symbols & divination",
    "description": "The Indian alchemy of mercury (rasaśāstra) and its yantra-mathematics — the dated textual chain with the Wujastyk 'alchemical ghost' dispute flagged, the 18 saṃskāras of mercury and the rasaśālā apparatus…",
    "href": "rasa.html"
  },
  {
    "id": "read",
    "title": "Read the Original — chapter by chapter",
    "category": "Books & traditions",
    "description": "A reader's scaffolding for William Lilly's Christian Astrology (1647): every book and chapter with Lilly's page numbers, linked to the free public scans (Archive.org, Wikisource, Skyscript) and to the…",
    "href": "read.html"
  },
  {
    "id": "roadmap",
    "title": "The Roadmap — planned tools & wings",
    "category": "Help & navigation",
    "description": "What comes next for The Astrologer's Workbench: the planned tools and study wings — Western depth (full primary directions, decumbiture, heliacal star phases, the Arabic-parts catalog), Vedic depth…",
    "href": "roadmap.html"
  },
  {
    "id": "runes",
    "title": "Elder Futhark Runes — cast & read",
    "category": "Symbols & divination",
    "description": "The Elder Futhark: 24 staves in three ættir of eight. Scatter the lots in the Tacitus manner (Germania 10) or draw a single rune or a three-rune spread; the engine reads each stave's attested medieval…",
    "href": "runes.html"
  },
  {
    "id": "sigil-studio",
    "title": "Sigil & Mandala Studio",
    "category": "Symbols & divination",
    "description": "Create editable intention sigils, sourced planetary-square traces and geometric mandalas. Reproduce the drawing, inspect its sources and prepare a paper-only study sheet.",
    "href": "sigil-studio.html"
  },
  {
    "id": "standards",
    "title": "Standards & working examples",
    "category": "AI & connections",
    "description": "Run real time, calendar, astronomy and interchange examples; inspect explicit AI/backend adapter contracts, source rights and reusable specialist skills.",
    "href": "standards.html"
  },
  {
    "id": "structure",
    "title": "Structure & patterns — the hidden symmetry",
    "category": "Historical research",
    "description": "A mathematician's-lens view of the astrological system: the planetary-week theorem (why the weekday order falls out of 24 ≡ 3 mod 7), the harmonic aspects as 360/n, the divisor structure of the zodiac, and…",
    "href": "structure.html"
  },
  {
    "id": "studio",
    "title": "Live Symbol Studio",
    "category": "Charts & interpretation",
    "description": "Explore calculated Western and Vedic charts, planetary squares, Hebrew and Latin sigils, and letter values. Freeze a moment, inspect the method, and export a reproducible snapshot.",
    "href": "studio.html"
  },
  {
    "id": "synastry",
    "title": "Synastry — the chart-to-chart aspect grid",
    "category": "Charts & interpretation",
    "description": "Synastry: the aspect grid BETWEEN two nativities — every cross-aspect (conjunction, sextile, square, trine, opposition) of person A's planets to person B's, with Lilly's moieties, applying/separating and…",
    "href": "synastry.html"
  },
  {
    "id": "tajika",
    "title": "Tājika varṣaphala — the Indo-Persian annual chart · munthā · varṣeśvara · sahams",
    "category": "Vedic studies",
    "description": "The Tājika varṣaphala (annual chart) computed live on the verified engine: the varṣa-praveśa (the SIDEREAL solar return), the munthā, the varṣeśvara chosen from the five candidates (with the tradition's own…",
    "href": "tajika.html"
  },
  {
    "id": "tarot",
    "title": "Tarot — the spread, laid & read",
    "category": "Symbols & divination",
    "description": "The 78-card Rider–Waite–Smith / Golden Dawn Tarot: choose a spread (single, Past/Present/Future, the Horseshoe, or the ten-card Celtic Cross), shuffle & draw with optional reversals, and the engine lays…",
    "href": "tarot.html"
  },
  {
    "id": "thelemic-times",
    "title": "Thelemic times — Era Legis & Liber Resh",
    "category": "Symbols & divination",
    "description": "Two zero-data museum tools on the site's astronomy engine. ERA LEGIS: the Thelemic 'Anno' date-stamp Aleister Crowley used — the {docosade}{year} Roman-numeral notation counted from the 1904 vernal equinox,…",
    "href": "thelemic-times.html"
  },
  {
    "id": "timelords",
    "title": "Time-lords & progressions — secondary progressions · firdaria · zodiacal releasing",
    "category": "Timing & events",
    "description": "The three classical time-lord techniques computed live on the verified engine: secondary progressions (the day-for-a-year of Valens IX.3, angles by the Naibod arc), the Persian firdaria periods of Abu…",
    "href": "timelords.html"
  },
  {
    "id": "tithi-pravesha",
    "title": "Tithi-praveśa — the Vedic annual & monthly tithi return",
    "category": "Vedic studies",
    "description": "Tithi-praveśa: the Vedic annual (and monthly) chart cast for the instant the Moon regains its EXACT natal elongation from the Sun — the same tithi and tithi-fraction — while the Sun is back in its natal…",
    "href": "tithi-pravesha.html"
  },
  {
    "id": "tools",
    "title": "Tools & Calculators",
    "category": "Help & navigation",
    "description": "Every interactive calculator in one place: the Book I Master Tool, the Horary Chart Calculator, the Essential Dignity Calculator, Planetary Hours, the Nativity Calculator and the degree-table lookups — each…",
    "href": "tools.html"
  },
  {
    "id": "trajectory",
    "title": "Life Trajectory — A Whole-Life Reading",
    "category": "Timing & events",
    "description": "A single composed historical reading that walks one nativity across the whole arc of a life: the natal signatures, the year-by-year profection timeline and Lord of the Year, the primary directions to the…",
    "href": "trajectory.html"
  },
  {
    "id": "transits",
    "title": "Transits to a natal chart — the timing timeline",
    "category": "Timing & events",
    "description": "Transits to a nativity: for a birth chart and a date range, the exact-hit dates when a transiting planet perfects a Ptolemaic aspect (conjunction, sextile, square, trine, opposition) to a natal point —…",
    "href": "transits.html"
  },
  {
    "id": "vedic-course",
    "title": "The Parāśarī course — Jyotiṣa as it is actually taught",
    "category": "Vedic studies",
    "description": "A teaching page for Vedic astrology (Jyotiṣa) in the order it is actually taught: nine units from the grahas and rāśis, through the two chart formats, the bhāvas, graha strength, planets-in-houses, the…",
    "href": "vedic/course.html"
  },
  {
    "id": "vedic-delineation",
    "title": "Bhāva delineations — the two-witness browser",
    "category": "Vedic studies",
    "description": "Browse the classical planet-in-house (graha-in-bhāva) delineations of Jyotiṣa, two witnesses side by side and never merged: Mantreśvara's Phaladīpikā (ch. 8) and Kalyāṇavarman's Sārāvalī (ch. 30), each…",
    "href": "vedic/delineation.html"
  },
  {
    "id": "vedic-index",
    "title": "Jagannath Hora — the Vedic (sidereal) reading",
    "category": "Vedic studies",
    "description": "A real Vedic (Jyotiṣa) horoscope modelled on Jagannath Hora: the sidereal Lagna and nine grahas with nakṣatra & pada, whole-sign houses, the Pañcāṅga, the Vimśottarī daśā, the divisional charts (vargas),…",
    "href": "vedic/index.html"
  },
  {
    "id": "vedic-yogas",
    "title": "Vedic yogas — the detector",
    "category": "Vedic studies",
    "description": "A data-driven Jyotiṣa yoga detector: from a birth moment it evaluates 36 cited yoga rules (the pañca-mahāpuruṣa, solar & lunar combinations, dhana and rāja yogas, Vipreet Harṣa/Sarala/Vimala, Nīca-bhaṅga…",
    "href": "vedic/yogas.html"
  },
  {
    "id": "workbench",
    "title": "The Workbench — everything, in one tool",
    "category": "Charts & interpretation",
    "description": "The unified Workbench: one moment and place computes the WHOLE engine at once — positions and the figure, the full dignity ledger, aspects and reception, the lots and antiscia, chart health, horary…",
    "href": "workbench.html"
  },
  {
    "id": "workflow",
    "title": "Chapter Map & Workflows",
    "category": "Help & navigation",
    "description": "A chart and workflow of every chapter of Lilly's three books: the concept, what you compute, a worked example, and the tool that does it — plus the step-by-step method for horary and nativities, and the…",
    "href": "workflow.html"
  },
  {
    "id": "world-events",
    "title": "World events & study dates",
    "category": "Timing & events",
    "description": "A source-labelled international agenda of selected elections, international days and campaigns, with explicit coverage limits and optional historical chart-study context.",
    "href": "world-events.html"
  },
  {
    "id": "yoga-index",
    "title": "The Yoga Sūtras of Patañjali — the study wing",
    "category": "Books & traditions",
    "description": "A study wing over the Pātañjala Yoga-sūtra: all 196 sūtras word-by-word (Devanāgarī, IAST, glosses after Rama Prasada 1912, translations after Woods 1914), a live counts-by-edition table (194/195/196), a…",
    "href": "yoga/index.html"
  },
  {
    "id": "yoga-pada1",
    "title": "Samādhi-pāda (Book I) — all 51 sūtras, word by word",
    "category": "Books & traditions",
    "description": "Book I of the Yoga Sūtras, the Samādhi-pāda: all 51 sūtras word-by-word — Devanāgarī (accents stripped), IAST, a Sanskrit-to-gloss table (after Rama Prasada 1912), the whole-sūtra translation (after Woods…",
    "href": "yoga/pada1.html"
  },
  {
    "id": "yoga-pada2",
    "title": "Sādhana-pāda (Book II) — all 55 sūtras, word by word",
    "category": "Books & traditions",
    "description": "Book II of the Yoga Sūtras, the Sādhana-pāda ('the means'): all 55 sūtras word-by-word — kriyā-yoga, the five kleśas, the seer and the seen, and the first five of the eight limbs (yama, niyama, āsana,…",
    "href": "yoga/pada2.html"
  },
  {
    "id": "yoga-pada3",
    "title": "Vibhūti-pāda (Book III) — the powers, with dual numbering",
    "category": "Books & traditions",
    "description": "Book III of the Yoga Sūtras, the Vibhūti-pāda ('the powers'): saṃyama and the catalogue of siddhis, word-by-word. Dual numbering (195 vulgate ↔ 196 inclusive) with a toggle, and the disputed variant sūtra…",
    "href": "yoga/pada3.html"
  },
  {
    "id": "yoga-pada4",
    "title": "Kaivalya-pāda (Book IV) — all 34 sūtras, with Bhoja's numbering",
    "category": "Books & traditions",
    "description": "Book IV of the Yoga Sūtras, the Kaivalya-pāda ('isolation'): all 34 sūtras word-by-word — the five sources of the siddhis, mind and matter, the immutable seer, the dharma-megha samādhi and kaivalya. Bhoja's…",
    "href": "yoga/pada4.html"
  },
  {
    "id": "yoga-sources",
    "title": "The editions & the method — Yoga Sūtra sources",
    "category": "Books & traditions",
    "description": "The sources of the Yoga Sūtra study wing: the public-domain edition stack (Rama Prasada 1912 gives word-by-word glosses; Vivekananda 1896 does NOT — a verified correction; Woods 1914 is the control…",
    "href": "yoga/sources.html"
  },
  {
    "id": "yoga-theory",
    "title": "The eight limbs, the āsana honesty layer & the powers — Yoga Sūtra theory",
    "category": "Books & traditions",
    "description": "The theory of the Yoga Sūtras: the eight-limb (aṣṭāṅga) map of II.29 limb-by-limb with linked sūtra spans; the yamas and niyamas; the āsana honesty layer — the sūtras name NO postures, the Vyāsa-bhāṣya…",
    "href": "yoga/theory.html"
  }
].map(Object.freeze));
