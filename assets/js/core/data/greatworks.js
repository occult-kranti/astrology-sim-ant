// ============================================================================
//  greatworks.js — THE GREAT WORKS wing: author → book → chapter study guides.
//
//  A cited catalog of the primary books behind the site's esoteric wings —
//  Hall, the Hermetica, Crowley, Dee, Agrippa, and the kindred authors (Lévi,
//  Ficino, Iamblichus, Regardie) — mapped chapter-by-chapter onto the tools
//  that COMPUTE what each book describes. PURE DATA, NO DOM.
//
//  LOCKED FRAMING (honours the site's rule everywhere):
//   • These are historical symbolic documents of NO demonstrated validity —
//     described, never prescribed. Any "magic" is CATALOGUED as a museum piece
//     (publication history in place of instructions), never taught operationally.
//   • PUBLIC-DOMAIN discipline is load-bearing, per record:
//       quoteSafe:true  → the cited edition is US public domain; short PD
//                         quotation permitted, always edition-cited.
//       quoteSafe:false → the standard edition is IN COPYRIGHT — CITE-ONLY:
//                         described and page-cited, never quoted, no images.
//     `pdSources` are CITATIONS (URLs a reader may follow), never fetched assets.
//   • Contested / speculative / legendary material is FLAGGED in-data and never
//     resolved (e.g. Hall's Atlantis = his claim; the spurious Fourth Book;
//     the Corpus Hermeticum XV numbering gap; Regardie's unproven US renewal).
//
//  Verification: see GW_METHOD_NOTE. Every verdict from the adversarial review
//  round has been applied — refuted site-mappings dropped, off-by-one fixed,
//  cite-only editions gated, uncertains kept flagged.
//
//  siteMapping.path values are relative to the `pages/` directory (e.g.
//  "kabbalah.html", "picatrix/kameas.html"); the renderer prefixes "../" for a
//  depth-2 page and the smoke test resolves them against repo/pages/.
// ============================================================================

export const GW_CITATION =
  "The Great Works — author→book→chapter study guides for The Astrologer's Workbench. " +
  'Public-domain status determined under the US 95-year rule plus renewal evidence; ' +
  'quotation restricted to PD editions and always edition-cited; copyrighted editions cite-only. ' +
  'Contested values flagged, never resolved. Verified 2026-07-16.';

export const GW_METHOD_NOTE =
  'How this wing was verified (2026-07-16): the catalog was built by fan-out web research and then ' +
  'adversarially fact-checked, source-by-source, against Wikisource (the 1928 Secret Teachings transcript), ' +
  "Duke Law's Public Domain Day pages (the 95-year term), the Chymistry of Isaac Newton project at Indiana " +
  '(Newton’s Emerald-Tablet transcription, Keynes MS 28), Joseph Peterson’s esotericarchives.com ' +
  '(the 1651 Agrippa and the spurious Fourth Book), archive.org, Gallica (BnF), and Project Gutenberg. ' +
  'Public-domain verdicts follow the US 95-year rule and, where relevant, URAA restoration and renewal evidence; ' +
  'anything not verifiably public-domain is marked cite-only and never quoted. Corrections from the review ' +
  'were applied and refuted claims dropped; items that could not be settled are kept flagged, not resolved. ' +
  'Note: sacred-texts.com returns HTTP 403 to automated fetchers, so its deep links are for human readers ' +
  'and were verified through Wikisource / archive.org mirrors.';

// Small helper so page-relative mappings stay terse below.
const m = (path, label) => ({ path, label });

export const GREAT_WORKS = {
  authors: [
    // ======================================================================
    //  MANLY P. HALL
    // ======================================================================
    {
      id: 'hall',
      name: 'Manly Palmer Hall',
      dates: '1901–1990',
      glyph: '⭐',
      who: 'The 20th-century encyclopedist of the Western esoteric traditions.',
      line: 'Canadian-American lecturer who compiled the Western esoteric traditions into one illustrated ' +
        'encyclopedia and founded the Philosophical Research Society (Los Angeles, 1934), presiding until his death. ' +
        'C. G. Jung secured copies of the PRS alchemical collection in the 1940s and acknowledged their use in ' +
        'Psychology and Alchemy (1944) — he consulted the collection remotely, he did not visit it.',
      siteLinks: [m('jung/index.html', 'Jung & astrology — who used Hall’s alchemy collection')],
      studyPath: [
        { text: 'Orientation: read the Preface and ch. 45 first to see Hall’s perennialist thesis stated plainly — then read the site’s framing note so the claim is bracketed before study begins.', tools: [m('about/index.html', 'Sources & Science')] },
        { text: 'The mystery-school frame: chs. 1–3 alongside the Hermetic Chronology timeline.', tools: [m('chronology/index.html', 'The Hermetic Chronology')] },
        { text: 'The Hermetic core: ch. 5, then the Hermetica dossier (Mead’s CH I); return for ch. 7 with the Kore Kosmou.', tools: [m('chronology/hermetica.html', 'Hermetica — the practices page')] },
        { text: 'The astrology block: chs. 8–9 with the basics and dignities open — compare Hall’s zodiac lore to Lilly’s dignities table.', tools: [m('basics.html', 'The Basics'), m('book1/dignities.html', 'Essential Dignities')] },
        { text: 'The number block: chs. 12–13 with the gematria calculator.', tools: [m('kabbalah.html', 'Kabbalah — gematria')] },
        { text: 'The correspondence block: chs. 16–20 with the planetary correspondences — tabulate where Hall and the Picatrix agree or disagree.', tools: [m('picatrix/correspondences.html', 'Planetary correspondences')] },
        { text: 'The magic block: chs. 21–22, described never prescribed — the grimoire apparatus with the Talisman Workshop and the Shield.', tools: [m('picatrix/talisman.html', 'Talisman Workshop'), m('geomancy.html', 'Geomancy')] },
        { text: 'The Qabbalah block: chs. 24–27 + 32 with the Tree of Life explorer — trace each of Hall’s tree diagrams onto the explorer.', tools: [m('kabbalah.html', 'Tree of Life explorer')] },
        { text: 'The tarot chapter: ch. 28 with the spread engine — mark the letter-trump correspondence as contested between schools.', tools: [m('tarot.html', 'Tarot')] },
        { text: 'The alchemy block: chs. 23, 33–36 with the alchemy page.', tools: [m('chronology/alchemy.html', 'Alchemy — the Great Work')] },
        { text: 'The Rosicrucian / Masonic block: chs. 15, 30–31, 37–39 with the esoteric library shelf.', tools: [m('library/esoteric.html', 'The esoteric shelf')] },
        { text: 'Close: chs. 40–45 as Hall’s synthesis; end at the Jung wing, noting Jung’s documented use of Hall’s alchemy collection.', tools: [m('jung/index.html', 'Jung & astrology')] },
      ],
      works: [
        {
          id: 'stoaa',
          title: 'The Secret Teachings of All Ages',
          subtitle: 'An Encyclopedic Outline of Masonic, Hermetic, Qabbalistic and Rosicrucian Symbolical Philosophy',
          year: 1928,
          unit: 'Chapter',
          edition: 'Self-published, printed by H. S. Crocker Company, Inc., San Francisco, 1928; color plates by J. Augustus Knapp.',
          quoteSafe: true,
          pdStatus: 'US public domain TWICE over: (a) the text copyright was never renewed (1955–57 renewal window, no renewal found — sacred-texts’ stacstat.htm documents the search); and (b) every 1928 publication — including the separately registered-and-renewed Knapp color plates — entered US PD on 1 Jan 2024 under the 95-year term. Plates are usable ONLY from a 1928 edition, never from the PRS Diamond Jubilee or the Tarcher/Penguin 2003 Reader’s Edition, whose new matter remains copyrighted.',
          pdSources: [
            m('https://sacred-texts.com/eso/sta/', 'sacred-texts.com — J. B. Hare’s etext of the 1928 ed. (omits the once-renewed Knapp plates)'),
            m('https://en.wikisource.org/wiki/The_Secret_Teachings_of_All_Ages', 'Wikisource — mirrors the sacred-texts etext (PD-US)'),
            m('https://archive.org/details/pdfy-NXrCfPe_e-QETRFj', 'archive.org — a 1928 scan (choose a high-res 1928 scan for the plates)'),
          ],
          flags: [
            'The pdfy archive.org scan is full-view but only ~3.3 MB — almost certainly too small to carry the color plates; pick a higher-resolution 1928 scan before using any plate.',
            'Unresolved and kept flagged (spot-check the 1928 scan, do not settle from a transcript): the exact 1928 placement of the "Hand of the Mysteries" plate; Hall’s original chapter-title spellings (Wikisource renders ch. 11 singular "Wonder of antiquity" and ch. 37’s heading "Shakespeare" against the body’s "Shakspere").',
          ],
          spellsMagic: [
            'STOAA prescribes nothing of its own — it REPRODUCES historical apparatus as museum pieces: the grimoire toolkit of ch. 21 (magic circles, pentacles, the black-magic pact literature, which Hall condemns), the alchemical processes of chs. 34–35 (printed as symbolic documents), and the talismanic gem lore of ch. 20. Treatment here: describe, cite the 1928 plates, never prescribe.',
          ],
          chapters: [
            { ref: '1', title: 'The Ancient Mysteries and Secret Societies Which Have Influenced Modern Masonic Symbolism', gist: 'The mystery-school thesis: Eleusinian/Orphic rites as the claimed root of fraternal symbolism.', siteMapping: [m('chronology/index.html', 'Hermetic Chronology timeline')] },
            { ref: '2', title: 'The Ancient Mysteries and Secret Societies, Part Two', gist: 'Mithraic, Serapean, Odinic and Eleusinian rites continued.', siteMapping: [m('chronology/index.html', 'Timeline')] },
            { ref: '3', title: 'The Ancient Mysteries and Secret Societies, Part Three', gist: 'Druidic, Gothic, Bacchic/Dionysiac rites; the Dionysian Artificers.', siteMapping: [m('chronology/index.html', 'Timeline')] },
            { ref: '4', title: 'Atlantis and the Gods of Antiquity', gist: 'Hall retells the Platonic Atlantis (Timaeus/Critias) as myth-history.', flag: 'Legendary material — present as Hall’s claim, never endorse.' },
            { ref: '5', title: 'The Life and Writings of Thoth Hermes Trismegistus', gist: 'Hall’s digest of the Hermes legend and the Poimandres vision (leaning on Everard/Mead).', siteMapping: [m('chronology/hermetica.html', 'Hermetica dossier')] },
            { ref: '6', title: 'The Initiation of the Pyramid', gist: 'The Great Pyramid read as an initiation chamber — a 19th-c. pyramidology trope.', flag: 'Speculative; flag as Hall’s symbolic reading.' },
            { ref: '7', title: 'Isis, the Virgin of the World', gist: 'Isis symbolism keyed to the Hermetic tract of that name — i.e. the Kore Kosmou (Stobaean excerpt).', siteMapping: [m('chronology/hermetica.html', 'Hermetica — pairs with Kore Kosmou')], toolsCharts: 'Knapp plate of Isis; Bembine-table detail cuts.' },
            { ref: '8', title: 'The Sun, A Universal Deity', gist: 'Solar theology across cultures; the three suns; solstice/equinox symbolism.', siteMapping: [m('now.html', 'Right Now — the live sky'), m('picatrix/prayers.html', 'Planetary prayers (described)')] },
            { ref: '9', title: 'The Zodiac and Its Signs', gist: 'Precession, the zodiacal ages, and sign symbolism — Hall’s astrology chapter proper.', siteMapping: [m('basics.html', 'The Basics'), m('book1/dignities.html', 'Essential Dignities'), m('transits.html', 'Transits')], toolsCharts: 'Zodiacal wheel diagrams; precessional tables.' },
            { ref: '10', title: 'The Bembine Table of Isis', gist: 'The Renaissance bronze Mensa Isiaca and Kircher’s/Lévi’s readings of it.', toolsCharts: 'The Bembine Table foldout plate (verify the foldout location in the 1928 scan).' },
            { ref: '11', title: 'Wonders of Antiquity', gist: 'Ever-burning lamps, the Seven Wonders, oracles of Delphi/Dodona.', flag: 'Title spelling to spot-check against the 1928 ed. (Wikisource renders it singular, "Wonder of antiquity").' },
            { ref: '12', title: 'The Life and Philosophy of Pythagoras', gist: 'Biography of Pythagoras and the Crotona school’s discipline.', siteMapping: [m('kabbalah.html', 'Gematria — number-mysticism lineage')] },
            { ref: '13', title: 'Pythagorean Mathematics', gist: 'The tetractys, the meanings of numbers 1–10, and number cosmology.', siteMapping: [m('kabbalah.html', 'Gematria'), m('handcalc.html', 'Cast by hand')], toolsCharts: 'Tetractys diagram; numerical tables of the decad.' },
            { ref: '14', title: 'The Human Body in Symbolism', gist: 'Anthropos doctrine: the body as temple/microcosm.', toolsCharts: 'Microcosm figures. NOTE — the "Hand of the Mysteries" plate’s exact 1928 placement is UNVERIFIED here; spot-check the scan before captioning.' },
            { ref: '15', title: 'The Hiramic Legend', gist: 'CHiram Abiff and the third-degree drama read symbolically.', siteMapping: [m('library/esoteric.html', 'The Masonic shelf')] },
            { ref: '16', title: 'The Pythagorean Theory of Music and Color', gist: 'The music of the spheres; planetary tone- and color-scales.', siteMapping: [m('picatrix/correspondences.html', 'Planetary correspondences')], toolsCharts: 'Tone/color correspondence tables.' },
            { ref: '17', title: 'Fishes, Insects, Animals, Reptiles and Birds (Part One)', gist: 'Sacred zoology: bull, serpent, scarab, fish symbolism.', siteMapping: [m('picatrix/correspondences.html', 'Correspondences')] },
            { ref: '18', title: 'Fishes, Insects, Animals, Reptiles and Birds (Part Two)', gist: 'Continued: phoenix, pelican, eagle, dove, peacock.', siteMapping: [m('picatrix/correspondences.html', 'Correspondences')] },
            { ref: '19', title: 'Flowers, Plants, Fruits, and Trees', gist: 'Planetary plants, the lotus, the acacia, mistletoe, the World Tree.', siteMapping: [m('picatrix/correspondences.html', 'Planetary plants')] },
            { ref: '20', title: 'Stones, Metals and Gems', gist: 'Planetary metals and gem lore; the breastplate stones; talismanic gems.', siteMapping: [m('picatrix/correspondences.html', 'Correspondences'), m('picatrix/stars.html', 'Behenian stone pairings')] },
            { ref: '21', title: 'Ceremonial Magic and Sorcery', gist: 'Grimoiric apparatus — circles, pentacles, pacts — surveyed and morally cautioned; Hall describes, condemns sorcery.', siteMapping: [m('picatrix/talisman.html', 'Talisman Workshop'), m('geomancy.html', 'Geomancy (Agrippa IV lineage)')], spellsMagic: 'Describes (never prescribes) the grimoire toolkit: magic circles, pentacles, the black-magic pact literature.' },
            { ref: '22', title: 'The Elements and Their Inhabitants', gist: 'Paracelsus’ elementals — gnomes, undines, sylphs, salamanders.', flag: 'No on-site page covers Paracelsian elementals — no direct mapping (the folklore "field guide" is a different, modern subject).' },
            { ref: '23', title: 'Hermetic Pharmacology, Chemistry, and Therapeutics', gist: 'Paracelsian medicine: mumia, sympathetic cures, herbal spagyrics.', siteMapping: [m('chronology/alchemy.html', 'Alchemy')] },
            { ref: '24', title: 'The Qabbalah, the Secret Doctrine of Israel', gist: 'Origins of Kabbalah; the four worlds; written vs oral law.', siteMapping: [m('kabbalah.html', 'Transmission timeline')] },
            { ref: '25', title: 'Fundamentals of Qabbalistic Cosmogony', gist: 'Ain Soph, tzimtzum-style emanation, the four Adams.', siteMapping: [m('kabbalah.html', 'Kabbalah')] },
            { ref: '26', title: 'The Tree of the Sephiroth', gist: 'The ten sephiroth and 22 paths — Hall reproduces Kircher-type tree diagrams.', siteMapping: [m('kabbalah.html', 'Tree of Life explorer — the tightest single mapping in the book')], toolsCharts: 'Sephirothic tree diagrams (Kircher lineage; compare against the explorer’s own layout).' },
            { ref: '27', title: 'Qabbalistic Keys to the Creation of Man', gist: 'Adam Kadmon; gematria of the divine names.', siteMapping: [m('kabbalah.html', 'Gematria calculator')] },
            { ref: '28', title: 'An Analysis of the Tarot Cards', gist: 'The 22 majors keyed to Hebrew letters (Lévi/Papus lineage); Egyptian-origin claim retold as legend.', siteMapping: [m('tarot.html', 'Tarot — 78-card reference + spread engine')], toolsCharts: 'Major-arcana figures; letter-trump correspondence table (CONTESTED across schools — flag, don’t resolve).' },
            { ref: '29', title: 'The Tabernacle in the Wilderness', gist: 'The Mosaic tabernacle as cosmological diagram.', toolsCharts: 'Tabernacle ground-plan diagrams.' },
            { ref: '30', title: 'The Fraternity of the Rose Cross', gist: 'The Rosicrucian manifestos and the Christian Rosenkreuz legend.', siteMapping: [m('chronology/index.html', 'The 1614–16 manifesto entries')] },
            { ref: '31', title: 'Rosicrucian Doctrines and Tenets', gist: 'The alchemical-Christian synthesis of the manifestos.', siteMapping: [m('chronology/index.html', 'Timeline')] },
            { ref: '32', title: 'Fifteen Rosicrucian and Qabbalistic Diagrams', gist: 'A pure plate-chapter: fifteen annotated cosmological diagrams (Fludd/Khunrath lineage).', siteMapping: [m('kabbalah.html', 'Kabbalah'), m('chronology/alchemy.html', 'Alchemy')], toolsCharts: 'All fifteen diagrams — prime candidates for PD image embedding from the 1928 scan.' },
            { ref: '33', title: 'Alchemy and Its Exponents', gist: 'History of alchemy from Hermes to the Renaissance adepts.', siteMapping: [m('chronology/alchemy.html', 'Alchemy')] },
            { ref: '34', title: 'The Theory and Practice of Alchemy: Part One', gist: 'First matter, the philosopher’s-stone doctrine, laboratory-vs-spiritual readings.', siteMapping: [m('chronology/alchemy.html', 'Alchemy')] },
            { ref: '35', title: 'The Theory and Practice of Alchemy: Part Two', gist: 'Alchemical recipes-as-allegory; Hall prints sample processes as symbolic texts.', siteMapping: [m('chronology/alchemy.html', 'Alchemy')], spellsMagic: 'Alchemical processes reproduced as historical documents (described, never prescribed).' },
            { ref: '36', title: 'The Chemical Marriage', gist: 'Digest of the Chymical Wedding of Christian Rosenkreutz (1616).', siteMapping: [m('chronology/index.html', 'Timeline'), m('chronology/alchemy.html', 'Alchemy')] },
            { ref: '37', title: 'Bacon, Shakspere, and the Rosicrucians', gist: 'The Baconian authorship thesis, which Hall favored.', flag: 'Fringe/contested thesis; describe only. "Shakspere" is Hall’s spelling — verify against the 1928 ed.' },
            { ref: '38', title: 'The Cryptogram as a Factor in Symbolic Philosophy', gist: 'Cipher systems (biliteral, acroamatic) claimed to hide doctrine in books.', flag: 'Speculative.' },
            { ref: '39', title: 'Freemasonic Symbolism', gist: 'Lodge symbolism, the three degrees, working tools.', siteMapping: [m('library/esoteric.html', 'The Masonic shelf')] },
            { ref: '40', title: 'Mystic Christianity', gist: 'Esoteric readings of Christ’s life; Gnostic currents.', siteMapping: [m('chronology/index.html', 'Timeline')] },
            { ref: '41', title: 'The Cross and the Crucifixion', gist: 'Cross symbolism across cultures; the "crucified saviors" motif.', flag: 'Comparativist claims of the Kersey Graves type — describe as Hall’s sources, not fact.' },
            { ref: '42', title: 'The Mystery of the Apocalypse', gist: 'Revelation read as an initiation document.' },
            { ref: '43', title: 'The Faith of Islam', gist: 'Muhammad, the Kaaba, and Sufi mysticism in brief.', siteMapping: [m('library/index.html', 'The Practitioners’ Library')] },
            { ref: '44', title: 'American Indian Symbolism', gist: 'North/Mesoamerican cosmologies — 1920s ethnography.', flag: 'Period ethnography; handle with care.' },
            { ref: '45', title: 'The Mysteries and Their Emissaries', gist: 'Closing thesis: an unbroken chain of adept-teachers — Hall’s own credo.', siteMapping: [m('about/index.html', 'Sources & Science — the perennialist claim the site declines to endorse')] },
          ],
        },
        {
          id: 'lost-keys',
          title: 'The Lost Keys of Masonry',
          subtitle: 'Later retitled The Lost Keys of Freemasonry',
          year: 1923,
          unit: 'Overview',
          edition: 'First edition 1923 — Hall’s first book, written just past his 21st birthday (he did not join a lodge until 1954).',
          quoteSafe: true,
          pdStatus: 'US public domain (published before 1929).',
          pdSources: [m('https://archive.org/', 'archive.org — the 1923 first-edition scan ("Lost Keys of Masonry, Manly P. Hall 1923")')],
          flags: ['The chapter list remains UNVERIFIED — confirm against the 1923 scan before encoding titles.'],
          chapters: [
            { ref: 'whole', title: 'The Eternal Quest · The Candidate · The Entered Apprentice · The Fellow Craft · The Master Mason · The Qualifications of a True Mason', gist: 'A symbolic, non-ritual reading of the three degrees as stages of self-unfoldment.', siteMapping: [m('library/esoteric.html', 'The esoteric shelf record')], flag: 'Chapter list to be confirmed against the 1923 scan.' },
          ],
        },
        {
          id: 'lectures',
          title: 'Lectures on Ancient Philosophy',
          subtitle: 'An Introduction to the Study and Application of Rational Procedure',
          year: 1929,
          unit: 'Overview',
          edition: 'First edition 1929 — written as the companion/commentary volume to STOAA.',
          quoteSafe: true,
          pdStatus: 'US public domain since 1 Jan 2025 (95-year term on 1929 publications).',
          pdSources: [m('https://archive.org/details/ManlyP.HallLecturesOnAncientPhilosophy1929', 'archive.org — the 1929 scan')],
          flags: ['The full lecture list is to be transcribed from the 1929 scan before encoding.'],
          chapters: [
            { ref: 'whole', title: 'Lecture series (Neoplatonism, Pythagorean mathematics, the mysteries, Rosicrucianism, symbolism)', gist: 'Hall’s own expansion of STOAA themes in lecture form — the "second pass" commentary track.', siteMapping: [m('chronology/index.html', 'Same wings as the STOAA blocks it expands')], flag: 'Full lecture list to be transcribed from the 1929 scan.' },
          ],
        },
      ],
    },

    // ======================================================================
    //  HERMES TRISMEGISTUS (attributed) — the philosophical Hermetica
    // ======================================================================
    {
      id: 'hermetica',
      name: 'Hermes Trismegistus (attributed)',
      dates: 'Greek treatises c. 100–300 CE, Roman Egypt',
      glyph: '⚚',
      who: 'The philosophical Hermetica — Greco-Egyptian wisdom dialogues; "Hermes" is a literary attribution, not a historical author.',
      line: 'Greco-Egyptian wisdom dialogues (teacher Hermes/Poimandres/Nous to pupils Tat, Asclepius, Ammon) aiming ' +
        'at gnosis and rebirth; transmitted via Byzantium (the Corpus), Latin antiquity (the Asclepius), Stobaeus’ ' +
        'anthology (the excerpts), and — for the Emerald Tablet — Arabic alchemy. PD English: G. R. S. Mead, ' +
        'Thrice-Greatest Hermes (3 vols., 1906), whose dated Theosophical framing is itself flagged as period ' +
        'commentary. Copenhaver 1992, Salaman 1999 and the Nock–Festugière Budé text are copyrighted (cite-only).',
      studyPath: [
        { text: 'CH I (Poimandres) with the seven-sphere ascent charted against the Chaldean planetary order.', tools: [m('book1/planetary-hours.html', 'Planetary Hours — the Chaldean order'), m('chronology/hermetica.html', 'Hermetica — the Poimandres hymn')] },
        { text: 'CH IV + CH VII (the krater and the diatribe) — the call to study.' },
        { text: 'CH V + CH XVI with the cycles and transits open: the cosmos-as-icon and the planets-as-administrators, read as historical cosmology.', tools: [m('cycles.html', 'Cycles of History — planetary cycles'), m('transits.html', 'Transits')] },
        { text: 'CH X (The Key) as the doctrinal summa.' },
        { text: 'CH XI + CH XIII as a pair (the site’s Hermetica page already does this per Hanegraaff) — end with the rebirth hymn.', tools: [m('chronology/hermetica.html', 'Hermetica — rituals/hymns')] },
        { text: 'The Asclepius, stopping at 23–24 and 37–38 (god-making) with the Talisman Workshop open — the direct ancestor of the talisman doctrine.', tools: [m('picatrix/talisman.html', 'Talisman Workshop')] },
        { text: 'Stobaean excerpts: Kore Kosmou — then jump to Hall’s STOAA ch. 7 "Isis, the Virgin of the World" to see the 1928 reception.', tools: [m('picatrix/faces.html', 'The 36 decan faces')] },
        { text: 'The Emerald Tablet last: the transmission line + Newton’s English, with the alchemy timeline open.', tools: [m('chronology/index.html', 'The Emerald-Tablet timeline entries')] },
      ],
      works: [
        {
          id: 'corpus-hermeticum',
          title: 'Corpus Hermeticum (CH I–XIV, XVI–XVIII)',
          subtitle: 'There is NO CH XV — the number was vacated in the editorial tradition',
          year: 'treatises c. 100–300 CE; Byzantine compilation; Ficino’s Latin 1471',
          unit: 'Treatise',
          edition: 'Ancient text; PD English = Mead, Thrice-Greatest Hermes vol. 2 (Theosophical Publishing Society, 1906).',
          quoteSafe: true,
          pdStatus: 'The ancient text is PD; Mead’s 1906 translation is PD. Copenhaver 1992 (Cambridge) and the Nock–Festugière Budé critical text are copyrighted — cite-only; PD quotation must come from Mead 1906 or Everard’s 1650 Divine Pymander.',
          pdSources: [m('https://sacred-texts.com/gno/th2/index.htm', 'sacred-texts.com — Mead vol. 2 (Corpus Hermeticum + Asclepius). Verify via archive.org mirrors (sacred-texts 403s bots).')],
          flags: [
            'THE NUMBERING GAP: there is NO Corpus Hermeticum treatise XV — the number was vacated in the editorial tradition (early-modern ch. XV held a Suda entry + three Stobaeus excerpts, later removed). The gap is shown here, never renumbered. Mead’s 1906 edition handles it with DUAL numbering (e.g. "XIV. (XV.)"); we store the modern I–XIV / XVI–XVIII numbering and note Mead’s parenthetical alternates.',
          ],
          spellsMagic: [
            'CH XI’s "make yourself grow to immeasurable immensity" — an imaginative expansion contemplation, described as a historical exercise.',
            'CH XIII’s secret hymnody (the sung liturgy of rebirth) — described, never prescribed.',
          ],
          chapters: [
            { ref: 'CH I', title: 'Poimandres (Mead: "Poemandres, the Shepherd of Men")', gist: 'The founding vision: Nous reveals cosmogony, the fall of Anthropos, and the soul’s ascent through the seven planetary spheres — the Hermetic "genesis".', siteMapping: [m('chronology/hermetica.html', 'Poimandres hymn'), m('book1/planetary-hours.html', 'The seven-sphere ascent vs the Chaldean order')], toolsCharts: 'Seven-planet ascent ladder — chartable against the Chaldean order.' },
            { ref: 'CH II', title: 'To Asclepius', gist: 'On motion and the incorporeal: God as the place of all things; the Good.' },
            { ref: 'CH III', title: 'The Sacred Sermon (Hieros Logos)', gist: 'A compressed Genesis-like cosmogony; humanity’s purpose to contemplate heaven.', siteMapping: [m('now.html', 'Right Now — observation of the sky (epigraph candidate)')] },
            { ref: 'CH IV', title: 'The Cup or Monad (Krater)', gist: 'God sends down a mixing-bowl of Nous; those who "baptize" in mind become complete — the election motif.' },
            { ref: 'CH V', title: 'That God is Both Apparent and Unapparent', gist: 'Seeing the invisible through the visible order — the cosmos as icon.', siteMapping: [m('cycles.html', 'Cycles — the order of the heavens as the "visible"')] },
            { ref: 'CH VI', title: 'In God Alone Is Good', gist: 'The Good exists only in God; the cosmos is "not good" but becoming.' },
            { ref: 'CH VII', title: 'The Greatest Ill Among Men Is Ignorance of God', gist: 'A street-preacher diatribe: the drunkenness of ignorance, the garment of the body.' },
            { ref: 'CH VIII', title: 'That No One of Existing Things Doth Perish', gist: 'Death as change, not destruction; the cosmos as second god.' },
            { ref: 'CH IX', title: 'On Thought and Sense', gist: 'Perception and understanding; the cosmos generates as God creates.' },
            { ref: 'CH X', title: 'The Key', gist: 'The summa: the soul’s journeys, the metempsychosis debate, gnosis as deification — "the good of the soul is knowledge".' },
            { ref: 'CH XI', title: 'Mind unto Hermes', gist: 'Nous instructs Hermes: Aion, cosmos, time; the famous "make yourself grow to immeasurable immensity" exercise.', siteMapping: [m('chronology/hermetica.html', 'Hermetica — CH XI + XIII pairing (per Hanegraaff)')], spellsMagic: 'The expansion contemplation (described as a historical exercise).' },
            { ref: 'CH XII', title: 'About the Common Mind', gist: 'Nous in all humans; fate vs. mind; the logos shared with animals denied.' },
            { ref: 'CH XIII', title: 'The Secret Sermon on the Mountain', gist: 'The rebirth (palingenesia) dialogue: ten powers drive out the twelve zodiacal torments; ends in the hymn of rebirth.', siteMapping: [m('chronology/hermetica.html', 'Hermetica — rituals/hymns'), m('basics.html', 'The zodiac — 12 torments vs 10 powers')], toolsCharts: '12 torments / 10 powers table.', spellsMagic: 'The secret hymnody (a sung liturgy — described).' },
            { ref: 'CH XIV', title: 'A Letter to Asclepius', gist: 'Epistolary recap: maker and made, God as sower. (Mead numbers this "XIV. (XV.)".)' },
            { ref: 'XV', title: '— no treatise XV —', gist: 'The number was vacated in the editorial tradition. Shown here as the visible gap; the corpus runs I–XIV then XVI–XVIII.', flag: 'The numbering gap — never renumbered.' },
            { ref: 'CH XVI', title: 'The Definitions of Asclepius unto King Ammon', gist: 'The sun as demiurge-charioteer; daimones stationed under the planets administering fate — the most "astrological" treatise.', siteMapping: [m('transits.html', 'Transits'), m('cycles.html', 'Cycles — planetary administration of fate'), m('picatrix/stars.html', 'The fixed stars')], toolsCharts: 'Solar-centric cosmos sketch; daimon-ranks under the planets.' },
            { ref: 'CH XVII', title: '(Untitled fragment: Tat to a King)', gist: 'Short fragment on statues/images reflecting the intelligible — a bridge to the Asclepius god-making theme.', siteMapping: [m('picatrix/talisman.html', 'Talisman Workshop (conceptual bridge)')] },
            { ref: 'CH XVIII', title: 'The Encomium of Kings', gist: 'A rhetorical set-piece praising kings; usually judged a non-Hermetic appendix.', flag: 'Widely considered extraneous to the corpus.' },
          ],
        },
        {
          id: 'asclepius',
          title: 'Asclepius (Latin; "The Perfect Sermon")',
          subtitle: 'Greek original Logos Teleios, lost',
          year: 'Greek original c. 2nd–3rd c. CE; Latin translation antique (quoted by Augustine)',
          unit: 'Section',
          edition: 'Ancient text; Mead’s 1906 English (vol. 2, "The Perfect Sermon") is PD.',
          quoteSafe: true,
          pdStatus: 'Ancient text PD; Mead 1906 PD.',
          pdSources: [m('https://sacred-texts.com/gno/th2/index.htm', 'sacred-texts.com — Mead vol. 2, "The Perfect Sermon"')],
          flags: [],
          spellsMagic: [
            'The god-making rite (Asclepius 23–24 and 37–38): temple statues ensouled by rites, herbs, stones and hymns — the single most important "magic" passage in the corpus and the locus classicus behind Picatrix-style talismanry. Described with Augustine’s hostile witness (City of God VIII) as counterpoint; never prescribed.',
          ],
          chapters: [
            { ref: 'Ascl. 1–41', title: 'The Perfect Sermon', gist: 'The longest Hermetic dialogue: man as magnum miraculum; the apocalyptic lament for Egypt (24–26); and the god-making passages (23–24, 37–38). Ends with the sunset prayer "with no incense" (Ascl. 41b), which also survives in Greek (Papyrus Mimaut = PGM III.591–611) and Coptic (the Prayer of Thanksgiving, NHC VI,7).', siteMapping: [m('picatrix/talisman.html', 'Talisman Workshop (god-making → talisman doctrine)'), m('picatrix/prayers.html', 'The Ascl. 41 prayer among the planetary prayers')], toolsCharts: 'Statue-animation ingredient list (herbs/stones/hymns) as a described historical table.' },
          ],
        },
        {
          id: 'stobaean',
          title: 'Stobaean Excerpts (incl. Kore Kosmou) + fragments in the Fathers',
          year: 'excerpted by John Stobaeus, 5th c. CE',
          unit: 'Excerpt',
          edition: 'Ancient text; Mead vol. 3 (1906) PD.',
          quoteSafe: true,
          pdStatus: 'Ancient text PD; Mead vol. 3 (1906) PD.',
          pdSources: [m('https://sacred-texts.com/gno/th3/index.htm', 'sacred-texts.com — Mead vol. 3 (Excerpts and Fragments)')],
          flags: [
            'Mead’s excerpt numbering DIFFERS from the modern Nock–Festugière SH numbering (e.g. Mead’s Excerpt XXVI = SH 24); store both, flag the mismatch, never silently convert. The Kore Kosmou material spans SH 23 with its Isis–Horus continuations in SH 24–27.',
          ],
          chapters: [
            { ref: 'SH XXIII', title: 'Kore Kosmou (Mead: "The Virgin of the World")', gist: 'Isis teaches Horus: the creation of souls, their embodiment as punishment, the descent of Hermes’ books — the grand Isis-frame myth.', siteMapping: [m('chronology/hermetica.html', 'Hermetica — cross-links Hall STOAA ch. 7')] },
            { ref: 'SH VI', title: 'Of the Decans and the Stars', gist: 'The decan-gods stationed between the outermost circle and the zodiac, shooting energies earthward — the Hermetic decan doctrine.', siteMapping: [m('picatrix/faces.html', 'The 36 decan faces — a direct doctrinal ancestor')], toolsCharts: '36-decan scheme.', flag: 'Mead-vs-SH numbering to verify per-excerpt before encoding.' },
          ],
        },
        {
          id: 'emerald-tablet',
          title: 'The Emerald Tablet (Tabula Smaragdina)',
          subtitle: 'NOT part of the Corpus Hermeticum',
          year: 'earliest attestation Arabic (Balinas, Sirr al-khaliqa), c. 8th–9th c. CE; Latin from the 12th c.',
          unit: 'Text',
          edition: 'Text PD; Newton’s English translation + commentary (Keynes MS 28) PD (Newton d. 1727).',
          quoteSafe: true,
          pdStatus: 'The text is PD; Newton’s English rendering is PD.',
          pdSources: [m('https://webapp1.dlib.indiana.edu/newton/mss/dipl/ALCH00017', 'The Chymistry of Isaac Newton (Indiana) — diplomatic transcription ALCH00017, opening "Tis true without lying, certain & most true…"')],
          flags: [
            'The Emerald Tablet is first attested in ARABIC (pseudo-Apollonius/Balinas, Sirr al-khaliqa), NOT ancient Greek, and is NOT part of the Corpus Hermeticum.',
            'Kept flagged, not resolved: the oft-repeated "first printed in De Alchemia, Nuremberg 1541" claim was not verified; and the Hugo-of-Santalla (c. 1145–51) vs "vulgate" Latin lineage should be cited to a scholarly source or omitted.',
          ],
          chapters: [
            { ref: 'whole', title: 'The Emerald Tablet with Newton’s commentary (Keynes MS 28)', gist: 'Thirteen aphorisms ("as above, so below"); transmission: Arabic Sirr al-khaliqa → 12th-c. Latin → early-modern print → Newton’s private English rendering c. 1680s.', siteMapping: [m('chronology/index.html', 'The Emerald-Tablet timeline entries (Arabic → Latin)'), m('glossary.html', 'Glossary — "Emerald Tablet"')], flag: 'On-site anchor is the chronology TIMELINE + glossary, NOT the alchemy page (which does not mention the Tablet).' },
          ],
        },
      ],
    },

    // ======================================================================
    //  ALEISTER CROWLEY
    // ======================================================================
    {
      id: 'crowley',
      name: 'Aleister Crowley',
      dates: '1875–1947',
      glyph: '☉',
      who: 'The 20th-century synthesist of Golden Dawn magic, yoga, and his own Thelema.',
      line: 'English occultist who printed the Golden Dawn’s once-secret correspondence tables (777), founded the ' +
        'religion of Thelema on Liber AL, and organized the whole system as "Magick". PD in the UK since 2018 ' +
        '(d. 1947, life+70); US status is per-work — the pre-1930 works are quote-safe, the 1944 Book of Thoth is not.',
      studyPath: [
        { text: 'Start on the Tree: its Key Scale rows ARE the rows of 777 (1909).', tools: [m('kabbalah.html', 'Kabbalah — the Tree of Life')] },
        { text: 'Read Liber AL I:57 ("צ is not the Star"), then open the tzaddi–heh dispute card — see what one verse did to a tarot attribution.', tools: [m('tarot.html', 'Tarot'), m('kabbalah.html', 'The tzaddi–heh dispute')] },
        { text: 'Book 4 Part I (yoga) against the Yoga Sūtras wing, chapter by chapter; note what Crowley strips out and flag his "scientific" framing as his framing.', tools: [m('yoga/index.html', 'The Yoga Sūtras')] },
        { text: 'Book 4 Part II’s wand/cup/sword/disk = fire/water/air/earth against the tarot suits.', tools: [m('tarot.html', 'Tarot — the suit/element scheme')] },
        { text: 'Magick in Theory and Practice: read One Star in Sight against the Tree (each A∴A∴ grade on its sephira), then walk chapters 0–XXI with the tarot open.', tools: [m('kabbalah.html', 'Grades as a tree overlay'), m('tarot.html', 'Chapters 0–XXI = the trumps')] },
        { text: 'Read the pentagram-ritual publication history (Collected Works I 1905 → Liber O 1909 → Regardie 1937–40, cite-only) as the history of a text, not as practice.', tools: [m('chronology/rituals.html', 'The rituals page')] },
      ],
      works: [
        {
          id: 'crowley-777',
          title: '777 (Liber 777)',
          subtitle: 'Prolegomena Symbolica ad Systemam Sceptico-Mysticae Viae Explicandae',
          year: 1909,
          unit: 'Column',
          edition: 'London & Felling-on-Tyne: Walter Scott Publishing Co., 1909 (published anonymously).',
          quoteSafe: true,
          pdStatus: 'US PD (pre-1930 publication, 95-year rule); UK PD since 2018. Quote ONLY the 1909 edition — "777 Revised" (Neptune Press, 1955) adds Crowley’s annotations and revised columns and is NOT PD in the US (URAA-restored UK work, 95-year term to 2051): cite-only.',
          pdSources: [m('https://archive.org/', 'archive.org — scans of the 1909 edition (verify the 1909 state before quoting)')],
          flags: ['Keep the 1909 and 1955 editions distinct: quote 1909, cite 1955. The printed tables also carry "bis" rows (31 bis, 32 bis).'],
          chapters: [
            { ref: 'Rows 1–32', title: 'The Key Scale correspondence tables', gist: 'The core tool: 32 rows (Sephiroth 1–10, paths 11–32) crossed with columns of correspondences — derived from the GD knowledge-lecture tables.', siteMapping: [m('kabbalah.html', 'Kabbalah — the Key Scale rows are already cited here')] },
            { ref: 'Hebrew col', title: 'Hebrew letters and their values', gist: 'The letter/value column — joins the site’s gematria layer.', siteMapping: [m('kabbalah.html', 'Gematria')] },
            { ref: 'Tarot col', title: 'Tarot trump attributions', gist: 'The GD standard in 1909 — the Tzaddi swap only enters with the later Book of Thoth.', siteMapping: [m('tarot.html', 'Tarot — the trump ids join exactly')], flag: 'The Star/Emperor Tzaddi–Heh attribution becomes contested only later; the 1909 column is GD-standard.' },
            { ref: 'Geomancy col', title: 'Geomantic figures', gist: 'The geomantic-figures column — joins the Agrippa IV geomancy lineage.', siteMapping: [m('geomancy.html', 'Geomancy — the Shield')] },
            { ref: 'Planet col', title: 'Planetary correspondences', gist: 'Sit alongside the Agrippa II.22 planetary squares (kameas).', siteMapping: [m('picatrix/kameas.html', 'The planetary kameas')] },
          ],
        },
        {
          id: 'crowley-liber-al',
          title: 'Liber AL vel Legis (The Book of the Law)',
          year: 1904,
          unit: 'Chapter',
          edition: 'Written Cairo, April 1904 (Crowley’s claim: dictated by "Aiwass"); first published 1909 as "Liber L vel Legis" in ΘΕΛΗΜΑ vol. III; republished The Equinox I(10), 1913; Tunis edition 1925/1926.',
          quoteSafe: true,
          pdStatus: 'US PD — every publication through 1926 is pre-1930 (Wikisource hosts it as PD-US); UK PD since 2018. Quote from the 1909/1913/1926 texts; The Equinox of the Gods (1936), which carries the manuscript facsimile and commentary, is URAA-restored (US term to 2032): cite-only.',
          pdSources: [m('https://en.wikisource.org/wiki/Liber_AL_vel_Legis', 'Wikisource — Liber AL vel Legis (PD-US)')],
          flags: ['The Tunis edition year is split across sources (1925 vs 1926); pre-1930 either way, so the PD verdict is unaffected. This is a religious scripture of Thelema — the dictation claim is presented as Crowley’s claim; the site takes no position.'],
          chapters: [
            { ref: 'I', title: 'The chapter of Nuit', gist: 'The first of three chapters (220 verses total), each voiced by a deity of the Stele of Revealing. I:57 — "All these old letters of my Book are aright; but צ is not the Star" — is the exact verse behind the tzaddi–heh dispute.', siteMapping: [m('kabbalah.html', 'The tzaddi–heh dispute card (cites I:57)')] },
            { ref: 'II', title: 'The chapter of Hadit', gist: 'The second chapter; Hadit as the infinitely small point.', siteMapping: [m('tarot.html', 'Tarot — GD standard kept, Crowley variant documented')] },
            { ref: 'III', title: 'The chapter of Ra-Hoor-Khuit', gist: 'The third chapter; plus Crowley’s short "Tunis Comment" (1925/1926) forbidding discussion of the book — described as a religious injunction, not obeyed.', flag: 'The book’s own prohibition on commentary is reported as history, not followed.' },
          ],
        },
        {
          id: 'crowley-book4',
          title: 'Book 4 (Liber ABA), Parts I–II',
          year: 1912,
          unit: 'Part',
          edition: 'Part I "Mysticism": Wieland & Co., London, 1912. Part II "Magick (Elemental Theory)": Wieland & Co., 1913. With Mary d’Este Sturges ("Soror Virakam").',
          quoteSafe: true,
          pdStatus: 'US PD (both parts pre-1930); UK PD since 2018. The modern one-volume "Magick: Liber ABA" (ed. Hymenaeus Beta, Weiser 1994/1997) has copyrighted editorial matter — cite-only; quote the 1912/1913 texts.',
          pdSources: [m('https://archive.org/', 'archive.org — scans of the Wieland editions')],
          flags: ['The Abuldiz-vision origin story is reported as Crowley’s account.'],
          spellsMagic: [
            'Part II’s temple furniture (circle, altar, wand, cup, sword, pantacle, lamp, robe…) is catalogued as symbolism — each "weapon" chapter a symbol essay, never an instruction.',
          ],
          chapters: [
            { ref: 'Part I', title: 'Mysticism (the yoga ladder)', gist: 'A deliberately plain-language yoga manual — asana, pranayama, mantra-yoga, dharana, dhyana, samadhi — framed as skeptical method ("the method of science, the aim of religion"). Maps limb-for-limb onto Patanjali.', siteMapping: [m('yoga/index.html', 'The Yoga Sūtras — the natural bridge text')] },
            { ref: 'Part II', title: 'Magick (Elemental Theory) — the temple and its furniture', gist: 'One short chapter per item; the wand/cup/sword/disk = fire/water/air/earth scheme — the same elemental scheme as the tarot suits.', siteMapping: [m('tarot.html', 'Tarot — the suit/element scheme'), m('kabbalah.html', 'Weapon correspondences = 777 columns')] },
          ],
        },
        {
          id: 'crowley-mtp',
          title: 'Magick in Theory and Practice (Book 4, Part III)',
          year: 1929,
          unit: 'Section',
          edition: 'Paris: Lecram Press — title page dated 1929; the Subscriber’s Edition actually appeared 1930 (dating contested; flagged, not resolved).',
          quoteSafe: true,
          pdStatus: 'US PD as of 2026 under EITHER dating (URAA-restored foreign work, flat 95-year term: 1929+95 expired end-2024, 1930+95 expired end-2025; and as of 1 Jan 2026 the plain pre-1931 rule independently covers both). UK PD since 2018.',
          pdSources: [m('https://archive.org/details/b29825064', 'archive.org — the Wellcome scan of the Lecram edition')],
          flags: ['The 1929 (title page) vs 1930 (actual issue) dating is contested — stored, not resolved.'],
          spellsMagic: [
            'The ritual catalog (banishing/invoking pentagram and hexagram forms, via the reprinted Liber O) is presented with its publication history in place of instructions — described, never prescribed.',
          ],
          chapters: [
            { ref: 'Intro', title: 'Introduction', gist: '"Magick is the Science and Art of causing Change to occur in conformity with Will" — the definitions read under description.' },
            { ref: '0–XXI', title: 'Chapters 0–XXI (the trump-numbered scheme)', gist: 'Twenty-two chapters (matching the tarot trumps in count) on magical theory — the formulae of Tetragrammaton, IAO, the Holy Guardian Angel, banishings, consecrations, divination, alchemy.', siteMapping: [m('tarot.html', 'Tarot — one trump per chapter')] },
            { ref: 'One Star in Sight', title: 'The A∴A∴ grade ladder (Appendix II)', gist: 'Probationer 0=0 through Ipsissimus 10=1, mapped rung-by-rung onto the Tree of Life sephiroth — a documented overlay.', siteMapping: [m('kabbalah.html', 'Grades as a tree overlay')] },
            { ref: 'Appendices', title: 'The curriculum + reprinted libers (Liber O, Liber E)', gist: 'The Class A–E document lists and reprinted instructional libers — the printed source for the pentagram/hexagram ritual texts.', siteMapping: [m('chronology/rituals.html', 'The rituals page (publication history)')] },
          ],
        },
        {
          id: 'crowley-book-of-thoth',
          title: 'The Book of Thoth (The Equinox III:5)',
          subtitle: 'Paintings by Frieda Harris',
          year: 1944,
          unit: 'Part',
          edition: 'London: O.T.O. / Chiswick Press, 21 March 1944; 200 signed and numbered copies.',
          quoteSafe: false,
          pdStatus: 'NOT PD in the US. As a UK work in copyright on the URAA date (1 Jan 1996; Crowley d. 1947), its US copyright was restored regardless of renewal — 95-year term to 1 Jan 2040. Frieda Harris’s card paintings are not PD in the UK until 2033 (d. 1962, life+70). CITE-ONLY throughout: no quotations, no card images. Attributions may be STATED as facts-about-the-book with citation (facts are not copyrightable).',
          pdSources: [m('https://en.wikipedia.org/wiki/The_Book_of_Thoth_(Crowley)', 'Wikipedia — bibliographic record (no hosted text; access via libraries/purchase)')],
          flags: ['CITE-ONLY — the one Crowley work in this wing that cannot be quoted or shown. Its occult-history claims (Egyptian origins, etc.) are flagged as Crowley’s romance.'],
          chapters: [
            { ref: 'Part One', title: 'The theory', gist: 'Tarot origins as Crowley tells them (flagged as his telling), the Tree of Life scheme, the "Naples arrangement".', flag: 'Part One’s Egyptian-origins history is long-refuted romance.' },
            { ref: 'Part Two', title: 'The 22 Atu (trumps)', gist: 'The Atu essays, with the Tzaddi/Heh "counterchange" explanation — this 1944 book is the source of the site’s tzaddi–heh dispute.', siteMapping: [m('kabbalah.html', 'The tzaddi–heh dispute (this book is its 1944 source)')] },
            { ref: 'Part Three', title: 'The Court Cards', gist: 'The court-card attributions.', siteMapping: [m('tarot.html', 'Tarot — GD standard as display, Thoth as documented variant')] },
            { ref: 'Part Four', title: 'The Small Cards', gist: 'The decanic minor-card attributions (planet-in-sign per pip) matching the GD Book T scheme.', siteMapping: [m('picatrix/faces.html', 'The decans — same GD skeleton')] },
          ],
        },
        {
          id: 'crowley-equinox-i',
          title: 'The Equinox, Volume I, Numbers 1–10',
          subtitle: 'The wing’s PD-safe quotation vault',
          year: 1909,
          unit: 'Liber',
          edition: 'London, 1909–1913, semi-annual — "the Review of Scientific Illuminism".',
          quoteSafe: true,
          pdStatus: 'US PD (all ten numbers pre-1930); UK PD since 2018. Only Volume I is the safe vault — Vol. III no. 5 is The Book of Thoth (1944, NOT PD) and The Equinox of the Gods (III:3, 1936) is NOT PD in the US.',
          pdSources: [
            m('https://archive.org/', 'archive.org — scans of Equinox I(1)–(10)'),
            m('https://sacred-texts.com/oto/lib84.htm', 'sacred-texts.com — Liber Chanokh (Equinox I:7–8)'),
          ],
          flags: ['Presented as the publication vehicle that put once-secret GD material in print — the wing’s whole PD-quoting strategy rests on Volume I’s pre-1930 dates.'],
          chapters: [
            { ref: 'I:1', title: 'An Account of A∴A∴ + Liber E', gist: 'The founding account and Liber E (Exercitiorum).' },
            { ref: 'I:2', title: 'Liber O vel Manus et Sagittae (1909)', gist: 'The pentagram/hexagram ritual texts in print — the wing’s citation for ritual publication history.', siteMapping: [m('chronology/rituals.html', 'The rituals page')] },
            { ref: 'I:7–8', title: 'Liber Chanokh (1912)', gist: 'The Enochian tables and the 48 Calls in Crowley’s PD-safe presentation — the bridge between the Crowley and Dee halves of this wing.', siteMapping: [m('chronology/rituals.html', 'Rituals'), m('kabbalah.html', 'Kabbalah')] },
            { ref: 'I:10', title: 'Liber AL (1913)', gist: 'The Book of the Law printed in The Equinox — the PD text to quote from.', siteMapping: [m('kabbalah.html', 'The tzaddi–heh dispute')] },
          ],
        },
      ],
    },

    // ======================================================================
    //  JOHN DEE
    // ======================================================================
    {
      id: 'dee',
      name: 'John Dee',
      dates: '1527–1608/09',
      glyph: '☿',
      who: 'Elizabethan mathematician, astrologer and angelic diarist.',
      line: 'Queen Elizabeth I’s mathematician and astrologer, who wrote the enigmatic Monas glyph, championed English ' +
        'mathematics in the Praeface to Euclid, and — with the scryer Edward Kelley — recorded the "angelic ' +
        'conversations" that produced the Enochian system. His diaries survive as records of what Dee BELIEVED was ' +
        'happening; Casaubon’s hostile 1659 frame and Laycock’s linguistic verdict are both presented, and the ' +
        'site adds no third claim.',
      studyPath: [
        { text: 'Start from the Monas glyph in the chronology timeline; read theorems I–VI (the construction).', tools: [m('chronology/index.html', 'The Hermetic Chronology — Dee’s Monas entry')] },
        { text: 'Theorems VII–XIII: watch the seven planet symbols fall out of the glyph; XIV–XXIV: the number-mysticism with the kamea page open.', tools: [m('picatrix/kameas.html', 'The kameas (number-lore)'), m('handcalc.html', 'Glyph construction by compass & rule')] },
        { text: 'A True & Faithful Relation: read Casaubon’s hostile preface FIRST (the book was published as a warning), then sample dated séances and cast them with the historical engine.', tools: [m('chronology/library.html', 'The chronology library'), m('chronology/index.html', 'The 1583 reception anchor')] },
        { text: 'The Enochian chain publication-first: MS → Casaubon 1659 → Golden Dawn → Crowley’s Liber Chanokh 1912 → Laycock 1978; close on Laycock’s glossolalia verdict, flagged not softened.', tools: [m('chronology/rituals.html', 'The rituals page')] },
        { text: 'The Mathematicall Praeface: read the address to the "unlatined" reader and study the Groundplat; find the site’s engines on it (Astronomie → ephemeris; Astrologie → the chart engines), then do by hand what Dee says the arts do.', tools: [m('handcalc.html', 'Cast a chart by hand'), m('cycles.html', 'Cycles — Astronomie/Astrologie branches')] },
      ],
      works: [
        {
          id: 'dee-monas',
          title: 'Monas Hieroglyphica',
          year: 1564,
          unit: 'Theorem',
          edition: 'Antwerp: Willem Silvius, 1564; dedicated to Emperor Maximilian II.',
          quoteSafe: true,
          pdStatus: 'The 1564 LATIN original is PD and freely quotable. The standard English translation — C. H. Josten, Ambix XII (1964) — is NOT PD: cite it, quote the Latin, and supply fresh glosses where English is needed. (esotericarchives.com’s Monas page hosts the Hamilton-Jones 1947 English, also unfree to 2043 — not the Latin; verify any hosted translation before quoting a word.)',
          pdSources: [m('https://archive.org/', 'archive.org / library scans of the 1564 Latin printing')],
          flags: ['Nobody, then or now, has a confirmed key to what Dee thought the glyph DID; the obscurity is flagged, not filled in. The dedication was a patronage bid (Clulee).'],
          chapters: [
            { ref: 'Ded.', title: 'Dedicatory letter to Maximilian II', gist: 'A patronage bid framed as the delivery of a universal key.', siteMapping: [m('chronology/index.html', 'Dee’s Monas timeline entry (with his 1527 natal figure)')] },
            { ref: 'I–VI', title: 'The construction (point, circle, semicircle, cross, Aries)', gist: 'Point and circle (Sun), semicircle (Moon), cross (the four elements), the Aries fire-sign base — the glyph built stroke by stroke.', siteMapping: [m('handcalc.html', 'Compass-and-rule construction')] },
            { ref: 'VII–XIII', title: 'The seven planetary symbols derived', gist: 'The seven planet symbols fall out of the one glyph — compare the site’s planet glyphs.', siteMapping: [m('picatrix/kameas.html', 'The planetary kameas')] },
            { ref: 'XIV–XXIV', title: 'The number-mysticism (ternary / quaternary / septenary)', gist: 'Number games building to the alchemical process and the final theorem.', siteMapping: [m('picatrix/kameas.html', 'The kamea number-lore')] },
          ],
        },
        {
          id: 'dee-true-faithful',
          title: 'A True & Faithful Relation… Between Dr. John Dee… and Some Spirits',
          subtitle: 'ed. Meric Casaubon, 1659',
          year: 1659,
          unit: 'Section',
          edition: 'London, 1659 (posthumous; from the Cotton Appendix XLVI manuscripts), with Casaubon’s long hostile preface arguing Dee was deluded by evil spirits.',
          quoteSafe: true,
          pdStatus: 'PD (1659). Modern critical editions and Harkness’s 1999 study are cite-only.',
          pdSources: [m('https://archive.org/', 'archive.org — scans of the 1659 folio (multiple copies)')],
          flags: ['The diaries are records of what Dee BELIEVED was happening; Casaubon’s hostile frame and Laycock’s later linguistic verdict are both presented.'],
          chapters: [
            { ref: 'Preface', title: 'Casaubon’s hostile preface', gist: 'A primary source for 17th-century skepticism — the book was published as a warning.', siteMapping: [m('chronology/library.html', 'The chronology library')] },
            { ref: 'Diaries', title: 'The spirit-action diaries, 1583 onward', gist: 'Dated séance records with Kelley scrying: the angelic conversations, the Enochian receptions, the continental journey (Kraków, Prague), the notorious "cross-matching" episode.', siteMapping: [m('chronology/index.html', 'The 26 March 1583 reception (cast, noon-default flagged)')], toolsCharts: 'The dated séances are timestamps the historical-calculation layer can cast.' },
          ],
        },
        {
          id: 'dee-enochian',
          title: 'The Enochian system: the 48 Calls, the tables, and their publication history',
          year: 1584,
          unit: 'Component',
          edition: 'Received (per the diaries) 1583–1584, largely at Kraków 1584; Dee’s fair copy is Sloane MS 3191 ("48 Claves Angelicae"); partial print Casaubon 1659; GD adaptation c. 1888–1900; Crowley, Liber Chanokh (Equinox I:7–8, 1912).',
          quoteSafe: true,
          pdStatus: 'The 16th–17th-c. sources (Sloane/Cotton MSS, Casaubon 1659) and Crowley’s 1912 Liber Chanokh are PD. Laycock (1978), Regardie (1937–40), and modern editions (Whitby, Peterson, Leitch) are NOT PD — cite-only. Quote the Calls from Casaubon 1659 or Liber Chanokh (1912), never from a modern edited text.',
          pdSources: [
            m('https://sacred-texts.com/oto/lib84.htm', 'sacred-texts.com — Liber Chanokh (Equinox I:7–8, 1912)'),
            m('https://archive.org/', 'archive.org — Casaubon 1659'),
          ],
          flags: ['Presented strictly AS THE DIARIES RECORD IT: the angelic origin is Dee’s and Kelley’s claim; Kelley’s role as sole scryer is stated; the GD’s revised Enochian differs from the diaries’ — the two layers are kept distinct. Laycock’s analysis (the "language" as glossolalia, not natural language) is the standing linguistic verdict.'],
          chapters: [
            { ref: 'Alphabet + Loagaeth', title: 'The 21-letter alphabet and the 49×49 tables', gist: 'The Enochian alphabet and Liber Loagaeth’s letter-tables.' },
            { ref: '48 Calls', title: 'The 48 Calls / Keys', gist: 'The bilingual Calls (Enochian + Dee’s English), the "first call" unspoken per the diaries.', siteMapping: [m('chronology/rituals.html', 'The rituals page')] },
            { ref: 'Great Table', title: 'The four Watchtowers + angelic-name grid', gist: 'Name-derivation by letter-position — a mechanical, displayable procedure.', siteMapping: [m('kabbalah.html', 'Kabbalah')] },
            { ref: 'Heptarchia + Aethyrs', title: 'The Heptarchial kings and the 30 Aethyrs', gist: 'The planetary kings and princes; the 30 Aethyrs with their governors — a described parallel to the site’s planetary-hour and kamea layers.', siteMapping: [m('chronology/index.html', 'The 1583 reception + Laycock 1978 on the timeline')] },
          ],
        },
        {
          id: 'dee-praeface',
          title: 'The Mathematicall Praeface to the Elements of Geometrie of Euclid',
          year: 1570,
          unit: 'Section',
          edition: 'London: John Day, 1570 — preface to Henry Billingsley’s first English translation of Euclid.',
          quoteSafe: true,
          pdStatus: 'PD everywhere; Project Gutenberg #22062 hosts the full text including the Groundplat.',
          pdSources: [m('https://gutenberg.org/ebooks/22062', 'Project Gutenberg #22062 — full text + the Groundplat chart')],
          flags: ['Dee’s belief in astrological influence is his; his insistence that the mathematics be learned and checked is the part the site shares.'],
          chapters: [
            { ref: 'Address', title: 'To the "unlatined" reader', gist: 'A manifesto that mathematics belongs to everyone — "common artificers" included, in English not Latin.', siteMapping: [m('handcalc.html', 'Cast a chart by hand — the math-advocacy companion')] },
            { ref: 'Groundplat', title: 'The Groundplat: a tree-chart of the mathematical arts', gist: 'Arithmetike and Geometrie as trunks, then nineteen derived arts — Perspective, Astronomie, Astrologie (defined by Dee as an "Arte Mathematicall"), Navigation, Thaumaturgike, Archemastrie.', siteMapping: [m('cycles.html', 'Astronomie/Astrologie branches'), m('transits.html', 'The chart engines')], toolsCharts: 'The Groundplat itself — a single-diagram map of 1570 applied mathematics.' },
          ],
        },
      ],
    },

    // ======================================================================
    //  HEINRICH CORNELIUS AGRIPPA
    // ======================================================================
    {
      id: 'agrippa',
      name: 'Heinrich Cornelius Agrippa von Nettesheim',
      dates: '1486–1535',
      glyph: '♁',
      who: 'The Renaissance synthesis of natural, celestial and ceremonial magic — the single largest source behind the site’s Picatrix-wing tools.',
      line: 'German polymath whose Three Books of Occult Philosophy (Latin 1533; English "J.F." 1651) gathered natural, ' +
        'celestial and ceremonial magic into one system. Its planetary squares, decan images, mansion images, ' +
        'Behenian stars and geomantic figures are exactly what the site’s Picatrix tools compute. The spurious ' +
        'Fourth Book — denounced as fake by Agrippa’s own student Weyer c. 1563 — is kept apart, flagged.',
      studyPath: [
        { text: 'I.1–14 — the three-worlds theory that justifies everything downstream; read as a historical worldview, not a claim.', tools: [m('how-it-works.html', 'How it’s calculated')] },
        { text: 'I.22–34 — planetary correspondences side-by-side with the site’s cited tables.', tools: [m('picatrix/correspondences.html', 'Planetary correspondences')] },
        { text: 'II.1–21 (numbers and scales) with the Tree — the sphere-ladder overlap (II.13) is already cited there.', tools: [m('kabbalah.html', 'Kabbalah')] },
        { text: 'II.22 — verify each planetary square’s row/column/diagonal sums with the live engine; the mathematics is real and checkable even though the attributions are symbolic.', tools: [m('picatrix/kameas.html', 'The kameas — checksum-verified')] },
        { text: 'II.29–34 — planetary hours and timing doctrine against the live election finder and moment scanner.', tools: [m('picatrix/election.html', 'Election'), m('moments.html', 'Moment Scanner')] },
        { text: 'II.35–47 — the image catalogs against the site’s flagged data (Picatrix divergences already in-data).', tools: [m('picatrix/faces.html', 'Faces/decans'), m('picatrix/mansions.html', 'Lunar mansions'), m('picatrix/stars.html', 'Behenian stars'), m('picatrix/talisman.html', 'Planetary images')] },
        { text: 'II.48–52 — cast a geomantic chart with the live engine and compare Agrippa’s figure attributions to the encoded set.', tools: [m('geomancy.html', 'Geomancy')] },
        { text: 'III.1–17 — the ceremonial frame, read historically; III.10–12 — sephiroth and divine names against the Tree explorer.', tools: [m('chronology/rituals.html', 'The rituals page'), m('kabbalah.html', 'The Tree explorer')] },
        { text: 'III.24–33 read-only — spirit-name calculation and seals; compare method (not results) with the kamea sigil-tracing the site already does.', tools: [m('picatrix/kameas.html', 'Kamea sigil-tracing')] },
        { text: 'Last: the spurious Fourth Book, with its flag firmly attached — the tradition’s most famous attribution problem.' },
      ],
      works: [
        {
          id: 'three-books',
          title: 'De occulta philosophia libri tres / Three Books of Occult Philosophy',
          year: 1533,
          unit: 'Chapters',
          edition: 'Complete Latin, Cologne 1533 (partial 1531); English "J.F.", London: Gregory Moule, 1651.',
          quoteSafe: true,
          pdStatus: 'The 1533 Latin and the 1651 English ("J.F.") are PD and quotable. The Perrone Compagni Latin critical edition (Brill 1992), Tyson’s annotated edition (Llewellyn 1993) and Purdue’s translation (Inner Traditions 2021) are copyrighted — cite-only. Cite Peterson (esotericarchives.com) as editor/host when deep-linking.',
          pdSources: [
            m('https://esotericarchives.com/agrippa/agrippa1.htm', 'esotericarchives.com — Peterson’s transcription of the 1651 "J.F." English (Books I–III)'),
            m('https://archive.org/', 'archive.org — 1533 Latin scans'),
          ],
          flags: [
            'CONTESTED translator identity: Peterson’s note says "likely John French rather than J. Freake"; Tyson’s edition gives James Freake. Stored as "J.F." with both candidates flagged — not resolved.',
          ],
          spellsMagic: [
            'The ceremonial apparatus of Book III — the calculation of spirit names from celestial positions (III.24–27) and the characters and seals of spirits (III.28–33) — is described as historical method, never prescribed; the method (not any result) is what the site’s kamea sigil-tracing already parallels.',
          ],
          chapters: [
            // Book I — 74 chapters (natural magic)
            { ref: 'I.1–2', title: 'The three worlds; what magic is', gist: 'The elementary, celestial and intellectual worlds; what magic is and who may study it.', siteMapping: [m('how-it-works.html', 'How it’s calculated — the worldview')] },
            { ref: 'I.3–9', title: 'The four elements and their correspondences', gist: 'The elements, their qualities, threefold consideration, and elemental correspondences of stones, metals, plants, animals.', siteMapping: [m('picatrix/correspondences.html', 'Correspondences')] },
            { ref: 'I.10–14', title: 'Occult virtues and the spirit of the world', gist: 'Their origin in the ideas, the world-soul, and the spiritus mundi.' },
            { ref: 'I.15–21', title: 'Finding virtues by similitude, friendship and enmity', gist: 'Testing virtues; species vs individual virtues.' },
            { ref: 'I.22–34', title: 'What is under which planet, sign and fixed star', gist: 'How to draw down celestial virtues onto inferior things.', siteMapping: [m('picatrix/correspondences.html', 'Planetary correspondences'), m('picatrix/stars.html', 'Fixed stars')] },
            { ref: 'I.35–50', title: 'Applied natural magic', gist: 'Mixtures, bindings, suffumigations (I.43–44), collyries and unctions, rings, light and colours, fascination.', siteMapping: [m('picatrix/correspondences.html', 'Suffumigations & correspondences')] },
            { ref: 'I.51–60', title: 'Divination', gist: 'Physiognomy/chiromancy (I.52), auguries; geomancy-hydromancy-aeromancy-pyromancy (I.57); dreams and frenzy.' },
            { ref: 'I.61–68', title: 'The passions of the mind as magical agent', gist: 'How passion alters the body; imagination; timing passions by the heavens; binding through will.' },
            { ref: 'I.69–74', title: 'Words, names, incantations, and the letter-division', gist: 'The virtue of words (I.69–72), of writing (I.73), and I.74: the division of the letters among signs, planets and elements, with the table.', siteMapping: [m('kabbalah.html', 'The Agrippa-division dispute (I.74)')], flag: 'I.74 gives a DIFFERENT 3/7/12 letter-division from the Sefer Yetzirah standard — already flagged in-site as dispute "agrippa-division"; kept unresolved.' },
            // Book II — 60 chapters (celestial / mathematical)
            { ref: 'II.1–3', title: 'The necessity of mathematics; the power of number', gist: 'Why the celestial magic is mathematical.' },
            { ref: 'II.4–14', title: 'The Scales of the Numbers (1–12)', gist: 'The correspondence tables of the whole system — one through ten (II.4–13), eleven and twelve (II.14).', siteMapping: [m('kabbalah.html', 'The sphere-ladder (II.13) is cited here')], toolsCharts: 'The master correspondence apparatus (describable-only — no live engine yet).' },
            { ref: 'II.15–21', title: 'Numbers above twelve; number-notations', gist: 'Gesture, Roman, Greek, Hebrew/Chaldean notations; the numbers of the gods and elements.' },
            { ref: 'II.22', title: 'The Tables of the Planets (kameas)', gist: 'Saturn 3×3 through the Moon 9×9, their seals, divine names, intelligences and spirits — computed and checksum-verified on the site.', siteMapping: [m('picatrix/kameas.html', 'The kameas — LIVE, checksum-verified')] },
            { ref: 'II.23–28', title: 'Geometry, music and celestial harmony', gist: 'Geometrical figures; music and harmony; the proportion of the human body and soul.' },
            { ref: 'II.29–34', title: 'Celestial observation and timing', gist: 'Planetary considerations, fixed stars, Sun and Moon, the 28 lunar mansions (II.33), planetary hours.', siteMapping: [m('picatrix/election.html', 'Election'), m('moments.html', 'Moment Scanner'), m('handcalc.html', 'Planetary hours by hand')] },
            { ref: 'II.35–45', title: 'Talismanic images', gist: 'How images receive celestial virtue; images of the zodiac signs; of the faces/decans (II.37); of each planet Saturn through the Moon (II.38–44); of the lunar nodes (II.45).', siteMapping: [m('picatrix/faces.html', 'The 36 decan faces (II.37)'), m('picatrix/talisman.html', 'Planetary images (II.38–44)')], flag: 'The planet-image chapters are II.38–44 (Saturn=38, Jupiter=39, Mars=40, Sun=41, Venus=42, Mercury=43, Moon=44); an earlier off-by-one was corrected here.' },
            { ref: 'II.46–47', title: 'Images of the mansions and the Behenian stars', gist: 'Images of the 28 lunar mansions (II.46); images of the Behenian fixed stars (II.47).', siteMapping: [m('picatrix/mansions.html', 'Lunar mansions (II.46)'), m('picatrix/stars.html', 'Behenian stars (II.47)')] },
            { ref: 'II.48–52', title: 'Geomantic figures and characters', gist: 'Geomantic figures as the middle between images and characters (II.48); characters deduced from them (II.51).', siteMapping: [m('geomancy.html', 'Geomancy — the 16 figures')] },
            { ref: 'II.53–60', title: 'Astrology, lots, and the soul of the world', gist: 'Divination; lots; the soul of the world; celestial souls and their names; planetary governors; the mind’s ascent.' },
            // Book III — 65 chapters (ceremonial / religious)
            { ref: 'III.1–6', title: 'Religion, secrecy, and the dignification of the operator', gist: 'Love, Hope and Faith; the preparation of the magician.', siteMapping: [m('chronology/rituals.html', 'The rituals page')] },
            { ref: 'III.7–13', title: 'God, the Trinity, the sephiroth and divine names', gist: 'The ten sephiroth and divine names (III.10) and the power of divine names (III.11–12).', siteMapping: [m('kabbalah.html', 'Sephiroth & divine names (III.10)')] },
            { ref: 'III.14–17', title: 'Celestial souls, angels and spirits', gist: 'Intelligences, angels and spirits; infernal and subterranean spirits (III.16).' },
            { ref: 'III.18–27', title: 'Orders of spirits; finding spirit names', gist: 'Guardian genii; the names of spirits and their imposition (III.24); FINDING SPIRIT NAMES from the disposition of celestial bodies (III.26) and by cabalistic calculation (III.27).', spellsMagic: 'The spirit-name calculation (III.24–27) — described as historical method, never prescribed.' },
            { ref: 'III.28–33', title: 'Characters and seals; invoking and binding', gist: 'Characters and seals of spirits; invoking and binding by adjuration.', spellsMagic: 'Characters and seals of spirits (III.28–33) — described, never prescribed.' },
            { ref: 'III.34–44', title: 'The animastic order; the soul after death', gist: 'Heroes; man as image of God; the soul’s descent; the soul after death; necromancy; imagination, reason and mind.' },
            { ref: 'III.45–58', title: 'The four frenzies; preparation for oracles', gist: 'Soothsaying and the frenzies (Muses, Dionysus, Apollo, Venus); rapture; prophetic dreams; the disciplines of cleanliness, abstinence, fasting, solitude, expiation.' },
            { ref: 'III.59–65', title: 'Sacrifices, consecrations; the Conclusion', gist: 'Sacrifices, oblations, consecrations, observances; III.65 "The Conclusion of the whole Work".' },
          ],
        },
        {
          id: 'fourth-book',
          title: 'Fourth Book of Occult Philosophy (pseudo-Agrippa) — SPURIOUS',
          year: 1559,
          unit: 'Item',
          spurious: true,
          edition: 'Latin at "Marpurgum" (Marburg), 1559, per Peterson’s source text (its status as the absolute first printing is unverified); English by Robert Turner, London, 1655.',
          quoteSafe: true,
          pdStatus: 'The Turner 1655 English is PD and quotable — but the work is NOT by Agrippa (see flag).',
          pdSources: [m('https://esotericarchives.com/agrippa/agrippa4.htm', 'esotericarchives.com — Peterson’s edition (with the spurious-authorship introduction)')],
          flags: [
            'CRITICAL — NOT by Agrippa. Denounced as spurious by Agrippa’s own student Johann Weyer c. 1563 (De praestigiis daemonum), a verdict rarely questioned since. Thomas Willard has proposed Jacques Gohory (1520–1576) as author; Stephen Skinner’s 1978 facsimile introduction dissents. Presented ONLY with this flag — never as Agrippa’s work; the site’s worked example of why provenance is flagged.',
          ],
          chapters: [
            { ref: 'Of Geomancy', title: 'Of Geomancy (genuine Agrippa, bundled 1655)', gist: 'The one genuine Agrippa treatise inside Turner’s 1655 collection.', siteMapping: [m('geomancy.html', 'Geomancy — the live engine')] },
            { ref: '4th Book + al.', title: 'The Fourth Book proper + the Heptameron + the Arbatel', gist: 'Turner’s 1655 collection bundles the spurious Fourth Book (spirit natures, characters, pentacles, crystallomancy) with the Heptameron (pseudo-Abano), Gerard "Cremonensis" astronomical geomancy, Pictorius’ Isagoge, and the Arbatel of Magic.', siteMapping: [m('chronology/rituals.html', 'The rituals page (context only)')], flag: 'Describable-only; no engine, none planned. "Gerard Cremonensis" is the bundle’s attribution, not settled authorship.' },
          ],
        },
      ],
    },

    // ======================================================================
    //  THE KINDRED — Lévi, Ficino, Iamblichus, Regardie
    // ======================================================================
    {
      id: 'levi',
      name: 'Éliphas Lévi (Alphonse-Louis Constant)',
      dates: '1810–1875',
      glyph: '⚹',
      who: 'The 19th-century revival — the influential tarot–Hebrew-letter key.',
      line: 'French magus of the Romantic revival whose Dogme et rituel de la haute magie printed an influential ' +
        'letter-by-letter tarot–Hebrew-alphabet scheme (Magician=Aleph ascending, Fool=Shin between XX and XXI). ' +
        'A. E. Waite’s 1896 English translation is PD. He is already on the site’s chronology timeline and behind ' +
        'the Tree’s "levi-fool" dispute.',
      studyPath: [
        { text: 'Dogme ch. 1–5 with the chronology timeline — where Lévi sits in the transmission chain.', tools: [m('chronology/index.html', 'The Hermetic Chronology')] },
        { text: 'The paired-chapter structure itself with the paths table — 22 chapters against 22 paths/letters.', tools: [m('kabbalah.html', 'The 22 paths')] },
        { text: 'The Fool=Shin placement against the site’s "levi-fool" dispute — the cleanest demonstration that the attributions are constructed, not discovered.', tools: [m('kabbalah.html', 'The levi-fool dispute')] },
        { text: 'Rituel’s planetary chapters with the planetary correspondences — compare his correspondences with Agrippa’s.', tools: [m('picatrix/correspondences.html', 'Correspondences')] },
      ],
      works: [
        {
          id: 'dogme-et-rituel',
          title: 'Dogme et rituel de la haute magie',
          subtitle: 'Waite: "Transcendental Magic: Its Doctrine and Ritual"',
          year: 1854,
          unit: 'Volume',
          edition: 'Paris, 2 vols., 1854–56; A. E. Waite (trans.), London: George Redway, 1896.',
          quoteSafe: true,
          pdStatus: 'The French original (1854–56) is PD (Lévi d. 1875), and Waite’s 1896 English is PD in the US (pre-1930) and worldwide (Waite d. 1942). Both quotable — but Waite’s rendering is free in places, so quote with the French at hand for load-bearing passages.',
          pdSources: [
            m('https://gallica.bnf.fr/', 'Gallica (BnF) — the French original, 1854–56'),
            m('https://archive.org/', 'archive.org — Waite’s 1896 "Transcendental Magic"'),
          ],
          flags: [
            'NOT "the first printed tarot–Hebrew-letter linkage": Comte de Mellet’s essay in Court de Gébelin’s Monde primitif (1781) printed an earlier reverse-order correspondence 73 years before Lévi. Lévi’s is the first INFLUENTIAL letter-by-letter scheme. (The site itself carries the same overclaim on the Kabbalah side — a repo correction candidate.)',
            'The site’s tarot page/deck encode the GD scheme only; the Lévi variant is flagged solely on the Kabbalah side ("levi-fool") — which the study wing cross-links.',
          ],
          spellsMagic: [
            'The pentagram and "tetragram" figures and the so-called Baphomet frontispiece — catalogued as Lévi’s iconography, never prescribed.',
          ],
          chapters: [
            { ref: 'Dogme (I–XXII)', title: 'The Doctrine — 22 chapters keyed to the Hebrew letters', gist: 'Designed to be read in pairs with the Ritual (Dogme ch. N with Rituel ch. N). Carries the "astral light" doctrine — his re-theorized spiritus mundi — and the great-arcanum framing.', siteMapping: [m('kabbalah.html', 'The 22 paths + the levi-fool dispute')] },
            { ref: 'Rituel (I–XXII)', title: 'The Ritual — 22 chapters keyed to the Hebrew letters', gist: 'The tarot–letter key with Lévi’s own sequence (Magician=Aleph, Fool=Shin between trumps XX and XXI — differs from the later Golden Dawn scheme by one throughout).', siteMapping: [m('tarot.html', 'Tarot (GD scheme; Lévi variant flagged on the Kabbalah side)'), m('picatrix/correspondences.html', 'Compare his correspondences with Agrippa’s')], flag: 'Verify the chapter-title list against the 1896 scan before encoding titles.' },
          ],
        },
      ],
    },
    {
      id: 'ficino',
      name: 'Marsilio Ficino',
      dates: '1433–1499',
      glyph: '♃',
      who: 'The Hermetic revival’s engine and the astrological-medicine layer.',
      line: 'Florentine priest-philosopher who translated the Corpus Hermeticum in 1463 (already an event on the site’s ' +
        'chronology) and wrote De vita libri tres — astrological medicine, planetary music, and cautiously-hedged ' +
        'talismans drawn from the Picatrix. The one author in this wing with NO quotable English text: paraphrase ' +
        'with citation, or short Latin only.',
      studyPath: [
        { text: 'Chronology first — why 1463/1489 Florence matters and what Casaubon 1614 later showed.', tools: [m('chronology/hermetica.html', 'Hermetica — the Ficino/Casaubon story')] },
        { text: 'Books I–II as historical medicine — described never prescribed; the medical content is obsolete and flagged as such.' },
        { text: 'Book III alongside the Talisman Workshop and correspondences — Ficino as the respectable Christian re-packaging of Picatrix material, with his own disclaimers preserved.', tools: [m('picatrix/talisman.html', 'Talisman Workshop'), m('picatrix/correspondences.html', 'Correspondences')] },
        { text: 'Compare Ficino’s hedged image-doctrine with Agrippa II.35–47’s unhedged catalogs — a built-in lesson in how the same material shifts register.', tools: [m('picatrix/faces.html', 'Agrippa’s image catalogs')] },
      ],
      works: [
        {
          id: 'de-vita',
          title: 'De vita libri tres / Three Books on Life',
          year: 1489,
          unit: 'Book',
          edition: 'Florence, 1489 (Latin). Kaske & Clark (1989) and Boer (1980) are the modern translations.',
          quoteSafe: true,
          pdStatus: 'The 1489 Latin is PD (Latin quotation only). CRITICAL: NO complete public-domain ENGLISH translation exists — Kaske & Clark (1989) and Boer (1980) are both copyrighted, cite-only. English treatment must be paraphrase-with-citation or short Latin quotation.',
          pdSources: [m('https://archive.org/', 'archive.org / European digital-library scans of early Latin editions')],
          flags: [
            'The one author in the wing with no quotable English text — the "pd gap": paraphrase-and-cite, or quote the 1489 Latin.',
            'Book III chapter titles/counts were not encoded here — verify against Kaske & Clark before use (numbers only; quote nothing).',
          ],
          spellsMagic: [
            'Planetary images/talismans (Book III) — reported cautiously and semi-disavowed by Ficino himself; the site preserves his hedging (even the source hedges). Planetary music — matching song and tone to planet — is described, never prescribed.',
          ],
          chapters: [
            { ref: 'I', title: 'De vita sana — the health of scholars', gist: 'The melancholy of the studious and its regimen.', flag: 'Historical medicine — obsolete; described never prescribed.' },
            { ref: 'II', title: 'De vita longa — prolonging life', gist: 'Diet, habit, and planetary regimen for the old.', flag: 'Historical medicine — obsolete.' },
            { ref: 'III', title: 'De vita coelitus comparanda — "obtaining life from the heavens"', gist: 'Spiritus mundi, planetary images/talismans (with Ficino’s own hedging), planetary music and Orphic singing, astrological medicine — drawing on the Picatrix.', siteMapping: [m('picatrix/talisman.html', 'Talisman Workshop — the upstream source Ficino used'), m('picatrix/correspondences.html', 'Correspondences')] },
          ],
        },
      ],
    },
    {
      id: 'iamblichus',
      name: 'Iamblichus of Chalcis',
      dates: 'c. 245 – c. 325 CE',
      glyph: '✡',
      who: 'Theurgy’s philosophical defense — why late-antique Platonists thought ritual reaches the gods.',
      line: 'Neoplatonist whose De mysteriis (the reply of "Abamon" to Porphyry’s Letter to Anebo) is the THEORY of ' +
        'ritual: the taxonomy of superior beings, the classification of divination, the defense of material rites, and ' +
        'the doctrine of the personal daimon — the deep background for the site’s hermetica and rituals pages. ' +
        'Taylor’s 1821 and Wilder’s 1911 translations are PD.',
      studyPath: [
        { text: 'Porphyry’s questions first (the Letter to Anebo frame), then Books I–II — what the debate was actually about.', tools: [m('chronology/hermetica.html', 'Hermetica — the theurgy background')] },
        { text: 'Book III with the site’s oracle pages — a late-antique insider’s taxonomy of the very practices the site catalogs (dreams, oracles, inspiration vs technical inference).', tools: [m('tarot.html', 'Tarot'), m('iching.html', 'I Ching'), m('runes.html', 'Runes'), m('geomancy.html', 'Geomancy')] },
        { text: 'Books IV–VII with the rituals page — the defense of material rites that Renaissance magic later leans on.', tools: [m('chronology/rituals.html', 'The rituals page')] },
        { text: 'Books IX–X with Agrippa III — the daimon doctrine as it resurfaces in III.21–27.', tools: [m('chronology/index.html', 'The Harran-to-Florence transmission')] },
      ],
      works: [
        {
          id: 'de-mysteriis',
          title: 'De mysteriis (Reply of Abamon to Porphyry)',
          year: 'c. 300 CE',
          unit: 'Book',
          edition: 'Ancient text; Thomas Taylor (trans.), 1821 (2nd ed. 1895); Alexander Wilder (trans.), "Theurgia, or the Egyptian Mysteries", 1911.',
          quoteSafe: true,
          pdStatus: 'Taylor 1821/1895 and Wilder 1911 are PD and quotable (Taylor’s English is archaic and interpretive — quote with that caution). Clarke, Dillon & Hershbell (SBL, 2003) is the standard modern translation — cite-only.',
          pdSources: [m('https://archive.org/', 'archive.org — Taylor (1821/1895) and Wilder (1911) scans')],
          flags: [
            'The 10-book division is EDITORIAL, not authorial — devised by Scutelli for the 1556 Rome edition, perpetuated to the present, and only undone by Saffrey–Segonds (Budé, 2013). Wilder’s 1911 text uses its OWN numbering, so any section reference must name which edition’s division it uses.',
          ],
          chapters: [
            { ref: 'I–II', title: 'The gods and classes of superior beings; their apparitions', gist: 'The taxonomy of divine and daimonic beings and how they appear.' },
            { ref: 'III', title: 'Divination — dreams, oracles, inspiration', gist: 'A period-native classification of divination (dreams, oracles, divine inspiration vs technical inference) — set beside the site’s four oracles as history.', siteMapping: [m('tarot.html', 'Tarot'), m('iching.html', 'I Ching'), m('runes.html', 'Runes'), m('geomancy.html', 'Geomancy')] },
            { ref: 'IV–VII', title: 'Sacrifice and Egyptian rites', gist: 'The rationale of sacrifice; Egyptian rites and symbolism — the defense of material rites.', siteMapping: [m('chronology/rituals.html', 'The rituals page')] },
            { ref: 'VIII–X', title: 'Egyptian theology; the personal daimon; theurgic union', gist: 'First causes; the personal daimon (Book IX — pairs with Agrippa III.21–22 on guardian genii); happiness and union.' },
          ],
        },
      ],
    },
    {
      id: 'regardie',
      name: 'Israel Regardie',
      dates: '1907–1985',
      glyph: '✧',
      who: 'The 20th-century documenter who printed the Golden Dawn corpus.',
      line: 'Occultist and one-time Crowley secretary who published the Golden Dawn corpus that fixed the modern form of ' +
        'the tree, the tarot attributions, and the rituals the site cites. His The Golden Dawn (Aries Press, 1937–40) ' +
        'is CITE-ONLY here — its US renewal status could not be verified, and Llewellyn asserts copyright.',
      studyPath: [
        { text: 'Historical frame first: the chronology and the Cipher-Manuscripts entry (c. 1887–1900) — what the GD invented vs inherited.', tools: [m('chronology/index.html', 'The Hermetic Chronology')] },
        { text: 'The tree material against the Kabbalah page — the site’s dispute entries (Daath, the doubles’ planetary spread, Lévi-vs-GD tarot) are the working examples.', tools: [m('kabbalah.html', 'Kabbalah — the disputes')] },
        { text: 'Book T against the tarot page — the deck data already matches GD attributions with variants flagged.', tools: [m('tarot.html', 'Tarot')] },
        { text: 'GD geomancy against the Shield — figures identical, method differences described.', tools: [m('geomancy.html', 'Geomancy')] },
        { text: 'Throughout: paraphrase and cite the Llewellyn 6th ed.; quote nothing until the renewal question is settled.' },
      ],
      works: [
        {
          id: 'the-golden-dawn',
          title: 'The Golden Dawn (4 vols.)',
          year: 1937,
          unit: 'Volume',
          edition: 'Chicago: Aries Press, 4 vols., 1937–1940; Llewellyn 6th ed., 1989 (the edition the site cites).',
          quoteSafe: false,
          pdStatus: 'CITE-ONLY — treat as NOT PD. The US renewal status of the 1937–40 volumes could not be verified (the renewal window 1964–68 coincides with the 1968 copyright purchase ahead of Llewellyn’s 1969 2nd edition); Llewellyn asserts copyright through the 6th ed. (1989). Archive.org scans exist but are not proof of PD. No quoting — cite and describe only. (The shorter 1936 "What You Should Know About the Golden Dawn" is reported PD, but that does not transfer to these volumes.)',
          pdSources: [m('https://archive.org/details/IsraelRegardie-thegoldenDawn-vol1-1937', 'archive.org — vol. 1 scan (a verification pointer, NOT proof of PD)')],
          flags: [
            'CRITICAL — US renewal unverified; treat as in-copyright, cite-only, no quoting until a renewal search (Catalog of Copyright Entries, 1964–68) settles it.',
          ],
          chapters: [
            { ref: 'Knowledge lectures', title: 'The knowledge lectures + Outer Order rituals', gist: 'The GD Tree of Life diagrams and path attributions — the scheme the site’s tree explorer encodes and flags.', siteMapping: [m('kabbalah.html', 'The Tree explorer (cited, not quoted)')] },
            { ref: 'Inner Order', title: 'The Inner Order (R.R. et A.C.) — Adeptus Minor + the Z documents', gist: 'The Adeptus Minor ceremony and the Z documents.', siteMapping: [m('chronology/rituals.html', 'The rituals page (LBRP, Middle Pillar — described)')] },
            { ref: 'Divination', title: 'The divination corpus: Book T, the Opening of the Key, geomancy, tattwa', gist: 'Book T tarot and the five-operation "Opening of the Key" spread; GD geomancy over the same 16 figures the site casts.', siteMapping: [m('tarot.html', 'Tarot (Book T)'), m('geomancy.html', 'Geomancy (same 16 figures; GD house-method described)')] },
            { ref: 'Enochian', title: 'The Enochian material', gist: 'The GD’s revised Enochian — distinct from Dee’s diaries (the two layers are kept apart in this wing).' },
          ],
        },
      ],
    },
  ],
};
