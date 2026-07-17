// ============================================================================
//  competitors.js — the HONEST COMPARISON dataset (pure data, no DOM, no fetch).
//
//  The machine-readable survey behind pages/compare.html: ~30 astrology /
//  divination products, each a checkable FACTUAL record (never a value
//  judgement), dated and sourced; the feature matrix; and the verifiable
//  novelty claims about THIS site. Follows the add-data-module discipline —
//  provenance per record (>=1 https source + a `surveyed` ISO date), the honest
//  three axes (explains / cites / statesValidity), and the MANDATORY, non-empty
//  `betterAtThanUs` column on every competitor.
//
//  The governing rule (docs/plans/r28/comparison.md §0): every cell is a
//  checkable fact about software; where a fact could not be confirmed from a
//  public page it is `unknown` ('?'), never guessed. No unqualified superlative
//  ('best' / 'first' / 'only' / 'most') survives review — absence is phrased
//  "we found none in our 2026-07 survey" with a standing correction invitation.
//  scripts/tests/r30-compare.mjs enforces all of this, including a superlative
//  grep over every string here.
//
//  ── RE-SURVEY CHECKLIST (competitor facts go stale; comparison.md §3.6) ──────
//  For each record: reload every `sources` URL; update `surveyed`; move anything
//  no longer confirmable into `unverified`; re-run the §2.7 search "does a
//  Confluence-like cross-tradition computed atlas now exist?" and the §2.6
//  search "an interactive hand-calc checker?" — NOVELTY_CLAIMS 6 & 7 are the
//  perishable ones. Prices live ONLY on the cards, always "as surveyed <date>".
//  The staleness badge (amber >=12mo, red >=24mo) is computed in app/compare.js,
//  NEVER here — this module stays pure & deterministic.
// ============================================================================

// Page-level survey stamp (rendered in the lede + above the matrix).
export const SURVEY_STAMP = '2026-07';

// The valid categories (matches the `category` field on every competitor).
export const CATEGORIES = [
  { id: 'western', label: 'Western — general purpose' },
  { id: 'vedic', label: 'Vedic — Jyotiṣa' },
  { id: 'traditional', label: 'Traditional / Hellenistic / horary' },
  { id: 'oracle', label: 'Oracles — tarot · I Ching · geomancy · runes' },
  { id: 'kabbalah', label: 'Kabbalah tree explorers' },
  { id: 'teaching', label: 'Hand-calculation teaching' },
  { id: 'atlas', label: 'Cross-tradition timeline atlases' },
  { id: 'ai', label: 'AI astrology products' },
];
const CATEGORY_IDS = CATEGORIES.map(c => c.id);

// ── The competitor survey (all facts as of the per-record `surveyed` date) ───
//  Honesty axes:
//    explains        : 'yes' | 'partial' | 'no'   — teaches the method, or only outputs?
//    cites           : 'yes' | 'partial' | 'rare' | 'no' — names primary sources/editions per rule?
//    statesValidity  : boolean — states anywhere that astrology has no demonstrated empirical validity?
export const COMPETITORS = [
  // ── Western — general purpose ─────────────────────────────────────────────
  {
    id: 'astro-com', name: 'astro.com (Astrodienst)', category: 'western',
    what: 'The de-facto standard free web chart service since 1996; Extended Chart Selection (many chart types, house systems, asteroids), a 9000-year online ephemeris, and the host of the Swiss Ephemeris (JPL-DE based, the precision reference) plus the AstroDatabank collection of Rodden-rated timed birth data.',
    license: 'Free core; ASTRODIENST PLUS subscription', price: 'free / subscription',
    platforms: ['web'],
    explains: 'partial', cites: 'rare', statesValidity: false,
    betterAtThanUs: [
      'Swiss Ephemeris sub-arcsecond precision over ±5000+ years (ours is astronomy-engine ~1′)',
      'AstroDatabank — thousands of Rodden-rated birth charts',
      'a built-in worldwide atlas with historical timezones (we require manual lat/lon)',
      'a quarter-century of community trust and reach',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.astro.com/free/free_chart_e.htm', 'https://www.astro.com/swisseph/swephinfo_e.htm', 'https://www.astro.com/swisseph/swepha_e.htm'],
    notes: 'Extensive explanatory articles, but the calculators output results without teaching the method per rule.',
    unverified: [],
  },
  {
    id: 'astro-seek', name: 'Astro-Seek', category: 'western',
    what: 'Free web calculators with an unusually deep traditional module: 7 planets, whole-sign, terms, antiscia, prenatal syzygy, profections, firdaria, decennials, zodiacal releasing and lots; plus transits, progressions, returns, synastry, astrocartography and a tropical/sidereal toggle.',
    license: 'Free, ad-supported', price: 'free',
    platforms: ['web'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'astrocartography / relocation charts (we have none)',
      'a built-in city atlas',
      'decennials and a breadth of time-lord tables in one free web tool',
    ],
    surveyed: '2026-07-16',
    sources: ['https://horoscopes.astro-seek.com/traditional-astrology', 'https://horoscopes.astro-seek.com/advanced-astrology-chart-tools-tables'],
    notes: 'Mostly computation-focused with some explanatory notes; no per-rule primary citations were observed.',
    unverified: [],
  },
  {
    id: 'timepassages', name: 'TimePassages (Astrograph)', category: 'western',
    what: 'Modern psychological astrology: point-and-click interpretations by Henry Seltzer; natal, transits, progressions and compatibility, delivered as interpretation text rather than method teaching.',
    license: 'Commercial (desktop) + freemium mobile', price: 'desktop from $79; mobile free + Pro $7.99/mo or $59.99/yr — as surveyed 2026-07-16',
    platforms: ['windows', 'macos', 'ios', 'android'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a polished native mobile app with a curated interpretation library',
      'point-and-click delineation text for beginners',
      'a built-in atlas and push features',
    ],
    surveyed: '2026-07-16',
    sources: ['https://astrograph.com/astrology-software', 'https://astrograph.com/timepassages/mobile'],
    notes: 'The 2026-07-16 verification pass corrected the mobile price from $9.99/mo to $7.99/mo (App Store listing).',
    unverified: [],
  },
  {
    id: 'solar-fire', name: 'Solar Fire (Astrolabe / Esoteric Technologies)', category: 'western',
    what: 'The professional Windows standard: a large calculation set (medieval, esoteric, Cosmobiology, fixed stars, asteroids, astromapping, Vedic, financial), TimeMap, animation, report writers and the ACS atlas.',
    license: 'Commercial', price: '$360 list at Alabe; upgrades from $99 — as surveyed 2026-07-16',
    platforms: ['windows'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a vast calculation breadth (Cosmobiology, financial, astromapping) far beyond ours',
      'print-quality wheels and report writers',
      'the ACS atlas with historical timezones',
      'chart-file and client management',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.solarfireastrology.com/solarfireorderform.htm', 'https://alabe.com/solarfireV9.html'],
    notes: 'Compute plus canned reports, not per-rule teaching. The ~$306 lower bound in the original survey came from the solarfireastrology.com order form; Alabe lists $360.',
    unverified: [],
  },
  {
    id: 'astro-gold', name: 'Astro Gold (Esoteric Technologies)', category: 'western',
    what: "Solar Fire's mobile and Mac sibling: professional calculations plus report add-ons, on macOS and iOS.",
    license: 'Commercial + IAP', price: 'macOS US$249.99; iOS free download + subscription or lifetime unlock — as surveyed 2026-07-16',
    platforms: ['macos', 'ios'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a professional-grade native app on macOS and iOS with sync',
      'printable reports',
      'a built-in atlas',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.astrogold.io/get-astro-gold/for-macos/', 'https://www.astrogold.io/get-astro-gold/for-ios/'],
    notes: 'The 2026-07-16 verification pass corrected the macOS price from $229.99 to $249.99 (astrogold.io).',
    unverified: [],
  },
  {
    id: 'time-nomad', name: 'Time Nomad', category: 'western',
    what: 'Free, offline-capable iOS charts on the DE-430 ephemeris, with electional tools and blog articles.',
    license: 'Free + optional IAP', price: 'free + IAP — as surveyed 2026-07-16',
    platforms: ['ios'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a native iOS app that computes fully offline on the DE-430 ephemeris',
      'push and mobile-native ergonomics',
    ],
    surveyed: '2026-07-16',
    sources: ['https://timenomad.app/'],
    notes: 'Compute plus blog articles; no per-rule citations observed.',
    unverified: [],
  },
  {
    id: 'astrolog', name: 'Astrolog (Walter Pullen)', category: 'western',
    what: 'A FOSS veteran distributed with source since 1991: 23 house systems, 24 aspect types, asteroids / TNOs / Uranian points / 27 planetary moons, ~50 fixed stars, sidereal and heliocentric modes, real-time chart animation and exoplanet transits, with both a CLI and a GUI.',
    license: 'GPL, free', price: 'free (open source)',
    platforms: ['windows', 'macos', 'linux'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      '23 house systems and 24 aspect types (we ship 4 house systems)',
      '27 planetary moons, TNOs and Uranian points — a far larger body set',
      'real-time chart animation and a scriptable CLI',
      'open source and offline since 1991 — free-software astrology long predates us',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.astrolog.org/astrolog.htm', 'https://en.wikipedia.org/wiki/Astrolog'],
    notes: 'Computation-focused; the helpfile documents switches, not doctrine.',
    unverified: [],
  },

  // ── Vedic ─────────────────────────────────────────────────────────────────
  {
    id: 'jhora', name: 'Jagannatha Hora (P.V.R. Narasimha Rao)', category: 'vedic',
    what: 'The freeware standard our Vedic wing is modelled on: a full-install ephemeris (12899 BC–16900 AD), a 2.5M-city atlas, dozens of daśā systems (Vimśottarī, Yogini, Chara…), all vargas, Aṣṭakavarga, Ṣaḍbala and muhūrta tools.',
    license: 'Freeware (not open source)', price: 'free',
    platforms: ['windows'],
    explains: 'partial', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'a 2.5M-city atlas (we require manual lat/lon)',
      'dozens of daśā systems and research options beyond our set',
      'an offline desktop ephemeris spanning ~30 millennia',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.vedicastrologer.org/jh/', 'https://archive.org/details/jh_full_install'],
    notes: "The author's free book and lectures exist separately; the software mostly computes. Rooted in the BPHS tradition, but not per-rule in-app; devotional framing.",
    unverified: [],
  },
  {
    id: 'parasharas-light', name: "Parashara's Light (GeoVision)", category: 'vedic',
    what: 'A commercial Vedic suite advertising "5000 calculations": interpretive reports, rectification, varshaphala, praśna and a built-in world atlas; marketing claims "100% accurate calculations certified".',
    license: 'Commercial', price: '₹5,000 (Personal) – ₹30,000 (Professional) — as surveyed 2026-07-16',
    platforms: ['windows', 'android'],
    explains: 'partial', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'interpretive report writers and a rectification suite',
      'a built-in world atlas',
      'varshaphala and praśna modules with classical-text quotation in reports',
    ],
    surveyed: '2026-07-16',
    sources: ['http://www.parashara.com/home.html', 'https://www.techjockey.com/detail/parasharas-light-commercial-edition'],
    notes: 'Quotes classics in reports but not per-rule; the "certified accuracy" claim is marketing, recorded here as their statement, not endorsed.',
    unverified: ['the "100% accurate calculations certified" marketing claim'],
  },
  {
    id: 'maitreya', name: 'Maitreya / Maitreya9', category: 'vedic',
    what: 'FOSS Vedic + Western software: vargas, daśās (graphical), KP, parts of Jaimini, Sarvatobhadra, Tajaka and Uranian. The original project is active again (release 8.2, 2025-09-30, with Oct 2025 updates per saravali.github.io); a community fork, Maitreya9, also exists.',
    license: 'GPL, free', price: 'free (open source)',
    platforms: ['windows', 'linux', 'macos', 'freebsd'],
    explains: 'no', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'graphical daśā views and Jaimini / KP breadth beyond our KP table',
      'Sarvatobhadra and Tajaka modules',
      'open source across four desktop platforms',
    ],
    surveyed: '2026-07-16',
    sources: ['https://github.com/robinrodricks/Maitreya9', 'https://saravali.github.io/'],
    notes: 'Computation-focused, with separate documentation; the yoga view references Parasara / Saravali / Brihat Jataka. The 2026-07-16 pass corrected "unmaintained" — the project is active again.',
    unverified: [],
  },
  {
    id: 'drik-panchang', name: 'Drik Panchang', category: 'vedic',
    what: 'The reference web pañcāṅga: 100k+ cities, festival and vrat calendars, muhūrta (choghadiya, horā, abhijit…) and kundali D1–D60 in North/South/East Indian formats, plus kūṭa matching.',
    license: 'Free, ad-supported; apps with IAP', price: 'free',
    platforms: ['web', 'ios', 'android'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'festival and vrat calendars with regional variants',
      '100k+ cities with local timezone handling',
      'a native app with notifications',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.drikpanchang.com/', 'https://www.drikpanchang.com/utilities/astrology-utilities.html'],
    notes: 'Good conceptual articles on the pañcāṅga elements, but not to critical editions; devotional framing.',
    unverified: [],
  },
  {
    id: 'astrosage', name: 'AstroSage', category: 'vedic',
    what: 'A mass-market free kundli and panchang portal that monetizes via paid consultations and gemstone / remedy recommendations.',
    license: 'Free + paid services', price: 'free + paid consultations',
    platforms: ['web', 'ios', 'android'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a large free kundli portal with a native app and huge reach',
      'a marketplace of consultations for those who want a human reader',
    ],
    surveyed: '2026-07-16',
    sources: ['https://panchang.astrosage.com/', 'https://www.astrosage.com/'],
    notes: 'Actively sells remedies and gemstones — prescriptive commerce, the opposite of this site’s described-never-prescribed stance.',
    unverified: [],
  },

  // ── Traditional / Hellenistic / horary ────────────────────────────────────
  {
    id: 'morinus', name: 'Morinus (+ Traditional Morinus / Valens forks)', category: 'traditional',
    what: 'FOSS Python traditional software on the Swiss Ephemeris (5000 BC–5000 AD): accurate Placidian MUNDANE primary directions, antiscia on the wheel, in-mundo progressions, revolutions and syzygy; a Python-3 community fork exists.',
    license: 'GPLv3, free', price: 'free (open source)',
    platforms: ['windows', 'linux', 'macos'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'true Placidian MUNDANE primary directions (ours are in-zodiac Naibod, flagged simplified)',
      'in-mundo progressions and antiscia on the wheel',
      'Swiss Ephemeris precision, open source and offline',
    ],
    surveyed: '2026-07-16',
    sources: ['https://sites.google.com/site/pymorinus/', 'https://sourceforge.net/projects/morinus/', 'https://ingenieriaastrologica.github.io/Morinus/'],
    notes: 'Computation-focused; community docs reference traditional method.',
    unverified: [],
  },
  {
    id: 'delphic-oracle', name: 'Delphic Oracle (Zoidiasoft / Curtis Manwaring)', category: 'traditional',
    what: 'Called "the gold standard of traditional programs" by reviewer Hank Friedman: Hellenistic→early-Modern techniques built on the Project Hindsight translations (Valens, Dorotheus, Hephaistio, Māshāʾallāh, Bonatti, Lilly…), time-lord systems, a graphic ephemeris and the Swiss Ephemeris (4713 BCE–5399 CE). Its wizards name the ancient authors and translations — the strongest citing culture we found in the field.',
    license: 'Commercial', price: 'WL license $100; XPF tiers higher — as surveyed 2026-07-16',
    platforms: ['windows', 'macos'],
    explains: 'partial', cites: 'yes', statesValidity: false,
    betterAtThanUs: [
      'a complete set of Hellenistic time-lord wizards beyond our four systems',
      'it names its primary-source authors and translations throughout — the nearest thing to our cited provenance',
      'decades of technique coverage across the Project Hindsight corpus',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.astrology-x-files.com/delphicoracle-download.html', 'https://www.astrology-x-files.com/software/delphicoracle-wl.html', 'http://www.projecthindsight.com/products/delphicoracle.html'],
    notes: 'The closest competitor to "explains its provenance"; it names ancient authors, though not as a machine-readable per-rule field. It does not state validity limits.',
    unverified: [],
  },
  {
    id: 'skyscript', name: 'Skyscript (Deborah Houlding)', category: 'traditional',
    what: 'Not software but the reference free web library for traditional astrology: historical research articles, a horary course, a long-running forum and the STA school.',
    license: 'Free articles; paid courses', price: 'free articles; paid courses',
    platforms: ['web'],
    explains: 'yes', cites: 'yes', statesValidity: false,
    betterAtThanUs: [
      'scholarly, teaching-led articles — teaching is the whole point',
      'a decades-old practitioner forum and community',
      'a structured horary course written by a leading traditional teacher',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.skyscript.co.uk/'],
    notes: 'Scholarly citations in articles; a practitioner stance rather than a validity statement.',
    unverified: [],
  },

  // ── Oracles (cards only — never matrix columns; comparison.md Risk 6) ──────
  {
    id: 'labyrinthos', name: 'Labyrinthos (Tina Gong)', category: 'oracle',
    what: 'A gamified tarot school (also Lenormand and runes): structured lessons, quizzes and leveling, teaching-led.',
    license: 'Free app + paid decks/courses', price: 'free + paid decks',
    platforms: ['web', 'ios', 'android'],
    explains: 'yes', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'gamified, structured lessons and quizzes (our study wings are text-led)',
      'a polished native learning app',
    ],
    surveyed: '2026-07-16',
    sources: ['https://labyrinthos.co/', 'https://www.taroscoper.com/guides/best-tarot-apps-and-sites-compared'],
    notes: 'Teaching-led; citation is light, not edition-level.',
    unverified: [],
  },
  {
    id: 'biddy-tarot', name: 'Biddy Tarot', category: 'oracle',
    what: 'A widely-cited card-meanings reference plus commercial courses.',
    license: 'Free meanings; paid courses', price: 'free meanings; paid courses',
    platforms: ['web'],
    explains: 'yes', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a large, widely-used library of per-card meanings',
      'structured paid courses',
    ],
    surveyed: '2026-07-16',
    sources: ['https://biddytarot.com/', 'https://tarostarot.com/blog/best-free-tarot-reading-sites'],
    notes: 'Meanings are taught, but sources/editions are not named.',
    unverified: [],
  },
  {
    id: 'tarot-com', name: 'Tarot.com', category: 'oracle',
    what: 'Commercial readings: tarot plus numerology and I Ching, delivered freemium.',
    license: 'Freemium', price: 'freemium',
    platforms: ['web'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a wide consumer catalogue of paid readings across several systems',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.taroscoper.com/guides/best-tarot-apps-and-sites-compared'],
    notes: 'Minimal method exposure; no citations.',
    unverified: ['the exact reading algorithms (unpublished)'],
  },
  {
    id: 'online-clarity', name: 'Online Clarity (Hilary Barrett)', category: 'oracle',
    what: 'Free I Ching readings using a named translation by a named translator (Barrett’s own), with an active community forum and podcast — a rare oracle site with real provenance whose commentary distinguishes translated text from interpretation.',
    license: 'Free readings; paid books/courses', price: 'free readings; paid books',
    platforms: ['web'],
    explains: 'yes', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'it names its I Ching translation and separates translated text from commentary',
      'an active community forum and podcast around one translator’s work',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.onlineclarity.co.uk/', 'https://www.onlineclarity.co.uk/reading/free-online-i-ching/'],
    notes: 'Names its translation (partial citation); does not state validity limits.',
    unverified: [],
  },
  {
    id: 'geomancy-web', name: 'Geomancy web tools (PsychicScience, Tarotsmith, OracleSanctum…)', category: 'oracle',
    what: 'Free shield-chart generators: PsychicScience.org (full shield + house chart with interpretation), Tarotsmith (a step-by-step classic method), OracleSanctum (shield→house mapping), Geomancy.me and small GitHub-pages tools. In our 2026-07 survey we found none that both teach the algebra (daughters by transposition, the even-Judge checksum) AND cite Agrippa / the Latin tradition per figure.',
    license: 'Free, ads on some', price: 'free',
    platforms: ['web'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'instant, no-setup shield generators (Tarotsmith walks the method step by step)',
    ],
    surveyed: '2026-07-16',
    sources: ['https://psychicscience.org/geomancy', 'https://tarotsmith.com/geomancy/', 'https://oraclesanctum.com/geomancy/', 'https://www.weisschoice.org/geomancy/geomancy-shield-generator'],
    notes: 'PsychicScience sits within a parapsychology-framed site. None surfaced that cite Agrippa per figure.',
    unverified: [],
  },
  {
    id: 'rune-sites', name: 'Rune-casting sites (Elder Futhark)', category: 'oracle',
    what: 'Numerous free Elder Futhark casters; in our 2026-07 survey none surfaced that cite the rune-poem sources (Old English / Old Icelandic / Norwegian) per rune.',
    license: 'Free, ads', price: 'free',
    platforms: ['web'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'instant free draws with no account',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.taroscoper.com/guides/best-tarot-apps-and-sites-compared'],
    notes: 'A category-level observation, not a single product; searched broadly in 2026-07.',
    unverified: ['a per-rune-poem-citing caster may exist beyond our survey'],
  },

  // ── Kabbalah tree explorers (cards only) ──────────────────────────────────
  {
    id: 'findyourfate-kabbalah', name: "FindYourFate & other Tree-of-Life explorers", category: 'kabbalah',
    what: 'Interactive Tree-of-Life tools (kabbalistic.com, kabbala-study.com with gematria, Servants of the Light, archetypes.kaabalah.com in 3D, FindYourFate’s calculator, a commercial Kabbalah REST API). FindYourFate is notable for SELECTABLE Golden-Dawn/Kircher vs Gra path-mappings and several gematria ciphers — the nearest partial precedent to our cited-and-flagged treatment.',
    license: 'Free / freemium / API', price: 'free to freemium',
    platforms: ['web'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'FindYourFate lets you SELECT between Golden-Dawn/Kircher and Gra path-mappings (a real precedent for our flagged treatment)',
      '3D and richly interactive tree visualisations',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.findyourfate.com/ai/kabbalah-calculator-fyf.php', 'https://archetypes.kaabalah.com/', 'https://astrology-api.io/p/kabbalah'],
    notes: 'The pattern across these: Golden-Dawn attributions presented as THE Tree, rarely flagging that the GD letter/path/tarot attributions are a 19th-century innovation and that Gra/Ari/Kircher arrangements genuinely disagree. None observed distinguishing Jewish Kabbalah from Hermetic Qabalah with citations; none state validity limits. Cosmos Daily even sells an invented astrology-Kabbalah "birth-chart pathways" reading.',
    unverified: [],
  },

  // ── Hand-calculation teaching (cards only) ────────────────────────────────
  {
    id: 'handcalc-courses', name: 'Hand-calculation courses & discussions (Demetra George, Catherine Urban, ep. 396)', category: 'teaching',
    what: 'Demetra George sells a video course "How to Calculate a Chart by Hand" (ephemeris + Table of Houses + arithmetic); Catherine Urban sells "Chart Calculations for the Apocalypse"; The Astrology Podcast ep. 396 (Urban & Watson, 2023-04) DISCUSSES hand-calculation, pointing to Michelsen/Pottenger ephemerides — explicitly not a tutorial. The book route is Margaret Hone and similar. In our 2026-07 survey we found no free interactive in-browser tool that checks each hand step against a live engine and shows the delta.',
    license: 'Paid courses; free podcast', price: 'paid courses',
    platforms: ['web'],
    explains: 'yes', cites: 'partial', statesValidity: false,
    betterAtThanUs: [
      'expert human instruction and the full ephemeris + Table of Houses method taught end to end',
      'the depth and nuance a video course and a book give over an automated checker',
    ],
    surveyed: '2026-07-16',
    sources: ['https://www.astrologyuniversity.com/shop/search-by-astrologer/demetra-george/how-to-calculate-a-chart-by-hand/', 'https://catherine-urban.squarespace.com/courses-and-webinars/chart-calculations-for-the-apocalypse', 'https://theastrologypodcast.com/transcripts/ep-396-transcript-calculating-astrology-charts-by-hand/', 'https://patrickwatsonastrology.com/should-astrologers-know-how-to-calculate-natal-charts-by-hand/'],
    notes: 'Courses and the podcast teach the method well; the perishable claim is that no interactive live-checking tool surfaced. Re-run this search each survey.',
    unverified: [],
  },

  // ── Cross-tradition timeline atlases (cards only) ─────────────────────────
  {
    id: 'timelinejs', name: 'Knight Lab TimelineJS', category: 'atlas',
    what: 'A FOSS timeline authoring tool (spreadsheet-driven), not a content atlas — you supply the events.',
    license: 'FOSS', price: 'free (open source)',
    platforms: ['web'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a mature, general-purpose timeline authoring engine anyone can populate',
    ],
    surveyed: '2026-07-16',
    sources: ['https://timeline.knightlab.com/'],
    notes: 'A tool for building timelines, not a sourced cross-tradition content atlas.',
    unverified: [],
  },
  {
    id: 'histography', name: 'Histography (Matan Stauber)', category: 'atlas',
    what: 'A WebGL timeline of 14 billion years driven by Wikipedia; online-hosted, no sourcing beyond Wikipedia and no computation.',
    license: 'Free web project', price: 'free',
    platforms: ['web'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a striking WebGL visualisation across an enormous time span',
    ],
    surveyed: '2026-07-16',
    sources: ['https://cargocollective.com/matanstauber/histography'],
    notes: 'In our 2026-07 survey we found timeline tools (TimelineJS, Histography) and scholarly archives (Amsterdam HHP, the Ritman Library), but no interactive atlas that places multiple divination traditions on one computed, per-event-cited timeline. If you know of one, tell us and we will list it.',
    unverified: [],
  },

  // ── AI astrology products ─────────────────────────────────────────────────
  {
    id: 'co-star', name: 'Co-Star', category: 'ai',
    what: 'Computes a natal chart from JPL/NASA data, then generates daily lines with language models trained on interpretation corpora; reviewers criticize opacity, negativity-tuning and shallow Big-Three depth.',
    license: 'Freemium', price: 'freemium — as surveyed 2026-07-16',
    platforms: ['ios', 'android'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a native mobile app with daily push and a large social user base',
      'JPL/NASA chart data and a slick onboarding',
    ],
    surveyed: '2026-07-16',
    sources: ['https://asapjournal.com/node/as-above-so-below-astrological-data-in-the-age-of-co-star/', 'https://leaveit2ai.com/ai-tools/astrology/co-star', 'https://www.auraeastrology.com/blog/co-star-app-review-2026-an-astrologers-honest-opinion'],
    notes: 'Presents output as astrology that works; methodology opaque, no citations, no BYOK — your data sits on their servers. Reviewer criticisms are attributed observations, and several reviewers are themselves competing apps.',
    unverified: ['the exact model and prompt pipeline (unpublished)'],
  },
  {
    id: 'the-pattern', name: 'The Pattern', category: 'ai',
    what: 'Reviewers report it does NOT cast a chart at all — algorithmic psychological profiling from birth data; the methodology is unpublished.',
    license: 'Freemium', price: '$14.99/mo compatibility gate reported — as surveyed 2026-07-16',
    platforms: ['ios', 'android'],
    explains: 'no', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'a polished narrative-profile experience many users find compelling',
    ],
    surveyed: '2026-07-16',
    sources: ['https://unstar.app/blog/co-star-sanctuary-pattern-nebula-stellium-astrology-apps-ranked-2026', 'https://eraastrology.ai/blog/best-ai-astrology-apps-2026/'],
    notes: 'Opaque by design. "Casts no chart" comes from reviewers, not the vendor — recorded as an attributed observation, never as flat fact; reviewer reports of non-reproducible outputs across runs are likewise attributed.',
    unverified: ['whether it casts a chart at all (reviewer claim, vendor silent)', 'reproducibility of outputs across runs (reviewer reports)'],
  },
  {
    id: 'kundligpt', name: 'KundliGPT (and clones)', category: 'ai',
    what: 'A free/pro Vedic chatbot on OpenAI models: kundli readings, daśā timing and yoga analysis in 15 languages with a tropical/sidereal toggle. It gives remedy advice — prescriptive.',
    license: 'Freemium', price: 'free / pro — as surveyed 2026-07-16',
    platforms: ['web'],
    explains: 'partial', cites: 'no', statesValidity: false,
    betterAtThanUs: [
      'conversational Vedic readings in 15 languages',
      'a low-friction chat interface for beginners',
    ],
    surveyed: '2026-07-16',
    sources: ['https://kundligpt.com/'],
    notes: 'Vendor-hosted on the vendor’s key; markets that it "cites the astrological logic" but not editions; no validity statement; prescriptive remedy advice.',
    unverified: ['the "cites the astrological logic" marketing claim'],
  },
];

// ── The feature matrix (features × tools) ────────────────────────────────────
//  Cell states: 'full' (●) · 'partial' (◐) · 'none' (○) · 'unknown' (?).
//  Columns are `site` plus ONE-PER capped set of ~13 chart-software tools
//  (comparison.md Risk 7 — the oracle/kabbalah/teaching/atlas/ai cards are NOT
//  matrix columns, or the grid becomes apples-to-oranges). Every column id is
//  `site` or a real competitor id; every cell key is a real feature id; the test
//  enforces both.
export const MATRIX_COLUMNS = [
  { id: 'site', label: 'This site' },
  { id: 'astro-com', label: 'astro.com' },
  { id: 'astro-seek', label: 'Astro-Seek' },
  { id: 'timepassages', label: 'TimePassages' },
  { id: 'solar-fire', label: 'Solar Fire' },
  { id: 'astro-gold', label: 'Astro Gold' },
  { id: 'astrolog', label: 'Astrolog' },
  { id: 'jhora', label: 'JHora' },
  { id: 'parasharas-light', label: "Parashara's L." },
  { id: 'maitreya', label: 'Maitreya' },
  { id: 'drik-panchang', label: 'Drik Panchang' },
  { id: 'morinus', label: 'Morinus' },
  { id: 'delphic-oracle', label: 'Delphic Oracle' },
  { id: 'co-star', label: 'Co-Star' },
];

// Short-hand so the cell table stays legible: F=full P=partial N=none U=unknown.
const F = 'full', P = 'partial', N = 'none', U = 'unknown';
// Column order for the terse per-row arrays below (must match MATRIX_COLUMNS).
const COL = MATRIX_COLUMNS.map(c => c.id);
// Build a {colId: state} object from a terse 14-slot array.
const row = arr => { const o = {}; COL.forEach((c, i) => { o[c] = arr[i]; }); return o; };

export const FEATURE_MATRIX = {
  features: [
    { id: 'swiss-precision', label: 'Swiss-Ephemeris-grade precision (sub-arcsecond)', cite: 'https://www.astro.com/swisseph/swephinfo_e.htm', rowNote: 'Ours is the MIT astronomy-engine at ~1 arc-minute — fine for degree-based traditional work, and we say so. Sub-arcsecond over ±5000+ years is the Swiss Ephemeris standard the others host.' },
    { id: 'outer-bodies', label: 'Outer planets, asteroids & many fixed stars', cite: 'https://www.astrolog.org/astrolog.htm', rowNote: 'We compute 7 planets + nodes + 15 Behenian stars (precessed). Astrolog alone adds TNOs, Uranian points and 27 planetary moons.' },
    { id: 'traditional-engine', label: 'Seven-planet traditional (Lilly) engine', cite: 'https://horoscopes.astro-seek.com/traditional-astrology', rowNote: 'A 7-planet, sect-aware traditional engine with Lilly’s orbs and receptions.' },
    { id: 'dignity-ledger', label: 'Essential-dignity ledger & almuten', cite: 'https://www.skyscript.co.uk/', rowNote: 'The full +5/+4/+3/+2/+1 ledger with the almuten of a degree.' },
    { id: 'horary', label: 'Horary perfection engine (house-by-house judgement)', cite: 'https://www.skyscript.co.uk/', rowNote: 'Perfection modes, receptions and Lilly’s house-by-house judgement. Praśna (Indian horary) is a separate system, kept in the Vedic wing.' },
    { id: 'time-lords', label: 'Hellenistic time-lords (ZR, firdaria, profections)', cite: 'https://www.astrology-x-files.com/software/delphicoracle-wl.html', rowNote: 'Zodiacal releasing, firdaria (night-order shown as a toggle) and profections. Vedic daśās are the Indian parallel, kept separate; Delphic Oracle’s time-lord wizards are deeper than ours.' },
    { id: 'primary-directions', label: 'Primary directions', cite: 'https://sites.google.com/site/pymorinus/', rowNote: 'Ours are in-zodiac Naibod, flagged simplified. Morinus and Delphic Oracle do true Placidian MUNDANE directions.' },
    { id: 'vedic-depth', label: 'Vedic vargas / daśās / Ṣaḍbala', cite: 'https://www.vedicastrologer.org/jh/', rowNote: 'Modelled on Jagannath Hora: vargas D1–D60, Vimśottarī, Aṣṭakavarga and the six-fold Ṣaḍbala. JHora and Maitreya go wider on daśā systems.' },
    { id: 'panchanga', label: 'Pañcāṅga & muhūrta', cite: 'https://www.drikpanchang.com/', rowNote: 'The five limbs and muhūrta timing. Drik Panchang adds festival/vrat calendars and regional variants we do not.' },
    { id: 'kp-sublords', label: 'KP 249 sub-lords', cite: 'https://www.vedicastrologer.org/jh/', rowNote: 'The Krishnamurti-Paddhati sub-lord table.' },
    { id: 'election', label: 'Electional engine with cited testimonies', cite: 'https://www.astro.com/swisseph/swephinfo_e.htm', rowNote: 'Picatrix-cited election scoring with the mansions and the planetary hour. Indian muhūrta is the parallel Vedic tool.' },
    { id: 'magic-layer', label: 'Astral-magic layer (talismans, described not prescribed)', cite: 'https://www.skyscript.co.uk/', rowNote: 'Picatrix / Agrippa mansions, decan faces, Behenian stars and talisman recipes — every recipe carries the described-never-prescribed disclaimer.' },
    { id: 'oracles', label: 'Oracles: geomancy / tarot / I Ching / runes', cite: 'https://psychicscience.org/geomancy', rowNote: 'A cast-and-judged geomantic shield (with the even-Judge checksum), tarot, I Ching and Elder Futhark. Compared here against dedicated oracle sites in the cards below, not as matrix columns.' },
    { id: 'kabbalah', label: 'Kabbalah Tree-of-Life explorer (systems flagged)', cite: 'https://www.findyourfate.com/ai/kabbalah-calculator-fyf.php', rowNote: 'Tree + gematria that flags Golden-Dawn vs Gra/Kircher as genuinely disagreeing. FindYourFate’s selectable mappings are the nearest precedent.' },
    { id: 'atlas-timeline', label: 'Cross-tradition computed timeline atlas', cite: 'https://timeline.knightlab.com/', rowNote: 'The Great Confluence + Moment Scanner place many traditions on one computed, per-event-cited timeline. We found no comparable atlas in our 2026-07 survey — tell us if one exists.' },
    { id: 'handcalc-live', label: 'Hand-calculation teacher with live engine-checking', cite: 'https://theastrologypodcast.com/transcripts/ep-396-transcript-calculating-astrology-charts-by-hand/', rowNote: 'Each manual step is checked against the engine live with the delta shown. Courses and podcast ep. 396 teach the method; we found no interactive checker in our 2026-07 survey.' },
    { id: 'per-rule-citations', label: 'Per-rule primary-source citations (machine-readable)', cite: 'https://www.astrology-x-files.com/software/delphicoracle-wl.html', rowNote: 'All 61 registry capabilities carry a named citation field. Delphic Oracle also names its ancient authors, though not as a machine-readable per-rule field.' },
    { id: 'validity-stated', label: "States astrology's empirical validity honestly", cite: 'https://en.wikipedia.org/wiki/Astrology_and_science', rowNote: 'The honest-science banner appears on every page. Zero of the ~30 products surveyed state this at all.' },
    { id: 'contested-flags', label: 'Flags intra-tradition disagreement as unresolved', cite: 'https://www.findyourfate.com/ai/kabbalah-calculator-fyf.php', rowNote: 'Firdaria night order, hyleg rules, rectification assumptions and sect-aware lots are flagged CONTESTED and left unresolved. Competitors typically pick one convention silently.' },
    { id: 'offline-open', label: 'Runs fully offline AND ships as open, readable source', cite: 'https://www.astrolog.org/astrolog.htm', rowNote: 'Offline web with the whole engine as unminified ES modules and no build step. The FOSS desktop apps (Astrolog since 1991, Morinus, Maitreya) are open and offline but native, not web.' },
    { id: 'byok-ai', label: 'BYOK AI with auditable tool-calls', cite: 'https://leaveit2ai.com/ai-tools/astrology/co-star', rowNote: 'Your own API key, browser-direct, every engine call shown as an auditable tool-call line. Co-Star and The Pattern run opaque server-side models; no BYOK product surfaced.' },
    { id: 'mobile-app', label: 'Native mobile app + notifications', cite: 'https://astrograph.com/timepassages/mobile', rowNote: 'We ship an installable PWA, not a native app, and no push notifications. TimePassages, Astro Gold, Drik Panchang and Co-Star have real native apps.' },
    { id: 'built-in-atlas', label: 'Built-in city atlas & historical timezones', cite: 'https://www.vedicastrologer.org/jh/', rowNote: 'We offer ~33 city presets plus device geolocation, but no full atlas or historical-timezone database — the single biggest practical gap. JHora has 2.5M cities; Solar Fire the ACS atlas; Drik Panchang 100k+.' },
    { id: 'reports-pdf', label: 'Printable / PDF report writer', cite: 'https://www.solarfireastrology.com/solarfireorderform.htm', rowNote: 'We print via the browser; we have no dedicated report writer. Solar Fire, Astro Gold, Parashara’s Light and Delphic Oracle do.' },
    { id: 'client-mgmt', label: 'Chart database / client file management', cite: 'https://www.astro.com/free/free_chart_e.htm', rowNote: 'We are deliberately stateless — no accounts, no tracking, so no saved-chart database. astro.com, Solar Fire, Astro Gold and JHora manage client files.' },
  ],
  //          site astro astro time solar astro astro jhora para  mait  drik  mori delph co
  //               .com  seek pass  fire  gold log        shar  reya  panc  nus  hic   star
  cells: {
    'swiss-precision':     row([P, F, F, F, F, F, F, F, F, F, F, F, F, F]),
    'outer-bodies':        row([P, F, F, F, F, F, F, P, P, P, P, F, F, P]),
    'traditional-engine':  row([F, P, F, N, F, F, P, N, N, P, N, F, F, N]),
    'dignity-ledger':      row([F, P, F, N, F, F, P, N, N, P, N, F, F, N]),
    'horary':              row([F, N, P, N, P, P, N, N, N, N, N, P, P, N]),
    'time-lords':          row([F, N, F, N, P, P, N, N, N, N, N, P, F, N]),
    'primary-directions':  row([P, P, N, N, F, P, P, N, N, N, N, F, F, N]),
    'vedic-depth':         row([F, P, P, N, P, N, P, F, F, F, P, N, N, N]),
    'panchanga':           row([F, N, P, N, P, N, N, F, F, P, F, N, N, N]),
    'kp-sublords':         row([F, N, N, N, N, N, N, F, P, F, N, N, N, N]),
    'election':            row([F, N, P, N, P, P, P, P, P, N, P, N, P, N]),
    'magic-layer':         row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'oracles':             row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'kabbalah':            row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'atlas-timeline':      row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'handcalc-live':       row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'per-rule-citations':  row([F, N, N, N, N, N, N, N, N, N, N, N, P, N]),
    'validity-stated':     row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'contested-flags':     row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'offline-open':        row([F, N, N, N, N, N, P, N, N, P, N, P, N, N]),
    'byok-ai':             row([F, N, N, N, N, N, N, N, N, N, N, N, N, N]),
    'mobile-app':          row([P, P, P, F, N, F, N, N, P, N, F, N, N, F]),
    'built-in-atlas':      row([P, F, F, F, F, F, P, F, F, P, F, P, F, F]),
    'reports-pdf':         row([P, F, P, F, F, F, P, F, F, P, P, P, F, N]),
    'client-mgmt':         row([N, F, P, F, F, F, P, F, F, P, N, P, F, P]),
  },
};

// ── The verifiable novelty claims about THIS site (comparison.md §3.4) ───────
//  Each renders claim + verify + qualifier; NO unqualified superlative — an
//  absence is phrased "we found none in our 2026-07 survey" with a standing
//  correction invitation. The test asserts all three fields are non-empty and
//  greps the whole set for banned superlatives.
export const NOVELTY_CLAIMS = [
  {
    claim: 'All 61 computed capabilities carry a named primary-source citation in the machine-readable registry.',
    verify: 'Open assets/js/core/registry.js — every entry has a `citation` field naming its source.',
    qualifier: 'Delphic Oracle also names its ancient authors; a per-capability machine-readable citation field is what we found nowhere else in our 2026-07 survey.',
  },
  {
    claim: 'Every page states that these systems have no demonstrated empirical validity.',
    verify: 'Read the honest-science banner in the site footer; the Chromium sweep asserts the chrome is injected on every page.',
    qualifier: 'Zero of the ~30 products in our 2026-07 survey state this at all — the nearest is a boilerplate disclaimer on a minor vendor.',
  },
  {
    claim: 'Genuine disagreements are flagged CONTESTED, with both positions shown and left unresolved.',
    verify: 'See the firdaria night-order toggle, the hyleg rules, the rectification assumptions and the sect-aware lots on their named pages.',
    qualifier: 'Competitors typically pick one convention silently; FindYourFate’s selectable Kircher-vs-Gra Kabbalah mappings are the nearest partial gesture we found.',
  },
  {
    claim: 'Historical practices are described, never prescribed.',
    verify: 'Every talisman recipe carries TALISMAN_DISCLAIMER; the ṣaṭkarman / abhicāra screens describe, without prescribing.',
    qualifier: 'AstroSage actively sells remedies and gemstones; many magic sites prescribe. We assert this of our own pages, checkable in the source.',
  },
  {
    claim: 'The site runs entirely from static files — no server, no build step, no account, no tracking — and works offline after the initial load.',
    verify: 'Open DevTools → Network and view-source: static ES modules, a service worker, and no analytics beacons.',
    qualifier: 'Time Nomad computes offline on iOS; JHora and Morinus are offline desktop apps. Offline WEB, with the whole engine readable as unminified ES modules, is the precise niche.',
  },
  {
    claim: 'A cross-tradition atlas and a Moment Scanner run every rulebook over one timeline, each event cited.',
    verify: 'Open pages/confluence.html and pages/moments.html and follow any event to its citation.',
    qualifier: 'We found timeline tools (TimelineJS, Histography) and scholarly archives (HHP, Ritman) but no comparable computed, per-event-cited cross-tradition atlas in our 2026-07 survey. Tell us if one exists.',
  },
  {
    claim: 'A hand-calculation teacher checks each manual step against the engine live and shows the delta.',
    verify: 'Open pages/handcalc.html, work a step, and watch the live delta against the engine.',
    qualifier: 'Demetra George and Catherine Urban sell courses and podcast ep. 396 discusses the method; the interactive live-checking tool is the one we found none of in our 2026-07 survey.',
  },
  {
    claim: 'BYOK AI on every tool: your own key, browser-direct, with every engine call shown as an auditable tool-call line.',
    verify: 'Open the Grand Orchestrator and read the ⚙ toolName(args) lines; no server sits between you and the provider.',
    qualifier: 'Co-Star and The Pattern run opaque server-side models; no bring-your-own-key astrology product surfaced in our 2026-07 survey.',
  },
  {
    claim: 'An anti-drift test suite ties every registry entry to real exports, pages, glossary terms and citations.',
    verify: 'Run node scripts/engine-test.mjs — it fails if any registry entry drifts from its code, page, glossary term or citation.',
    qualifier: 'FOSS competitors have unit tests; tying rules to citations is what we found none of in our 2026-07 survey.',
  },
  {
    claim: "Lilly's own 1647 charts are re-computed from their printed positions, with confidence caveats.",
    verify: 'Open pages/book2/examples.html and compare the re-run figures to Lilly’s printed positions.',
    qualifier: 'Unique in our 2026-07 survey; Delphic Oracle covers the same authors’ techniques rather than re-running their printed charts.',
  },
  {
    claim: 'This comparison page itself lists what every competitor does better than this site, with sources and survey dates.',
    verify: 'Scroll up: every competitor card has a "What it does better than this site" list and a dated source.',
    qualifier: 'The reflexive claim, cheap to verify, that sets the tone for the rest of the page.',
  },
];

// ── The generous "what others do better" summary (comparison.md §3.5) ────────
//  Aggregated so the page can END on it (the humility section).
export const HUMILITY_SUMMARY = [
  { area: 'Precision', text: 'The Swiss Ephemeris (astro.com, Solar Fire, Astro Gold, Morinus, Delphic Oracle, Maitreya) is sub-arcsecond over ±5000+ years; our astronomy-engine is ~1 arc-minute — fine for degree-based traditional work, and we say so.' },
  { area: 'Bodies', text: 'Outer planets, Chiron, asteroids, Uranian points and thousands of fixed stars, versus our 7 planets + nodes + 15 Behenian stars. Astrolog alone computes 27 planetary moons and 23 house systems to our 4.' },
  { area: 'Open-source pedigree', text: 'Free-software astrology is not our invention: Astrolog has shipped with source since 1991; Morinus and Maitreya are GPL. Our contribution is the honesty layer, not the openness.' },
  { area: 'Atlas & historical timezones', text: "JHora's 2.5M-city atlas, Solar Fire's ACS atlas and Drik Panchang's 100k+ cities. We require manual lat/lon and UTC — the single biggest practical gap." },
  { area: 'Primary directions', text: 'Morinus and Delphic Oracle do true Placidian mundane directions; ours are in-zodiac Naibod, flagged simplified.' },
  { area: 'Vedic depth', text: "JHora's dozens of daśā systems, Parashara's Light's interpretive reports and rectification, and Maitreya's Jaimini / KP breadth beyond our KP table." },
  { area: 'Panchang breadth', text: "Drik Panchang's festival and vrat calendars and regional variants." },
  { area: 'Native mobile', text: 'Native apps, notifications and sync (TimePassages, Astro Gold, Co-Star, Drik Panchang). We ship an installable PWA, not a native app.' },
  { area: 'Client work', text: "Chart databases, file management, print-quality wheels and PDF report writers (Solar Fire, Astro Gold, Parashara's Light); AstroDatabank's Rodden-rated birth data (astro.com)." },
  { area: 'Community & longevity', text: "astro.com since 1996, Skyscript's forum, decades of practitioner shakedown — against our young engine." },
  { area: 'Astrocartography', text: 'Astro-Seek and Solar Fire do relocation and astrocartography; we have none.' },
  { area: 'Gamified learning', text: 'Labyrinthos gamifies tarot learning; our study wings are text-led.' },
  { area: 'Hellenistic completeness', text: "Delphic Oracle's time-lord wizards go beyond our four systems, and it names its provenance throughout." },
];

// ── Tiny pure helpers (no DOM) ───────────────────────────────────────────────
export function competitorById(id) {
  return COMPETITORS.find(c => c.id === id) || null;
}

export function competitorsByCategory(category) {
  return COMPETITORS.filter(c => c.category === category);
}

// The callable tool behind the registry `comparison` entry (callable:true), so
// the AI assistant answers "how does this compare to Solar Fire?" from the
// SURVEYED data — never from the model's own memory. Deterministic & pure.
//   • { id }        → that competitor's full record (condensed).
//   • { category }  → the competitors in that category (name + one-line what).
//   • { }           → the survey summary: stamp, counts, the honesty gap, the
//                     novelty claims and the humility summary.
export function compareTools(args = {}) {
  const note = `Facts are as surveyed on each record's date (page stamp ${SURVEY_STAMP}); prices and features change — always quote the survey date, and point the user at the per-record sources.`;
  if (args && args.id) {
    const c = competitorById(String(args.id));
    if (!c) return { found: false, id: args.id, note: `No competitor "${args.id}" in the survey. Categories: ${CATEGORY_IDS.join(', ')}.` };
    return {
      found: true, id: c.id, name: c.name, category: c.category, what: c.what,
      license: c.license, price: c.price, platforms: c.platforms,
      explains: c.explains, cites: c.cites, statesValidity: c.statesValidity,
      betterAtThanUs: c.betterAtThanUs, surveyed: c.surveyed, sources: c.sources,
      unverified: c.unverified || [], note,
    };
  }
  if (args && args.category) {
    const cat = String(args.category);
    const list = competitorsByCategory(cat);
    return { category: cat, count: list.length, note,
      competitors: list.map(c => ({ id: c.id, name: c.name, what: c.what, betterAtThanUs: c.betterAtThanUs, surveyed: c.surveyed })) };
  }
  const byCat = {};
  for (const c of COMPETITORS) byCat[c.category] = (byCat[c.category] || 0) + 1;
  return {
    surveyStamp: SURVEY_STAMP,
    surveyed: COMPETITORS.length + ' products across ' + CATEGORY_IDS.length + ' categories',
    countsByCategory: byCat,
    honestyGap: 'Across the ~30 products surveyed in 2026-07: zero state that astrology has no demonstrated empirical validity; one (Delphic Oracle) systematically names its primary-source provenance and Online Clarity names its I Ching translation; none flag intra-tradition disagreements as unresolved; none publish an anti-drift test tying rules to sources.',
    noveltyClaims: NOVELTY_CLAIMS.map(n => ({ claim: n.claim, verify: n.verify, qualifier: n.qualifier })),
    whatOthersDoBetter: HUMILITY_SUMMARY.map(h => `${h.area}: ${h.text}`),
    note,
  };
}
