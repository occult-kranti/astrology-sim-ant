// ============================================================================
//  practitioners.js — THE PRACTITIONERS' LIBRARY. An expert deep-dive catalog
//  of the people and books behind every practice the Workbench describes:
//  Western traditional astrology, the Indian systems, and the divination /
//  esoteric arts. One record per practitioner-or-source, grouped by practice
//  and graded by a PRACTITIONER-RECOGNITION tier (canon · respected · niche ·
//  academic — see TIER_DEFS). Each record names who they are, their verified
//  works (title / year / publisher), any journal papers, and — where a named
//  published work teaches one — the step-by-step METHOD as its author teaches
//  it, in reportive voice ("as taught in …"), never as instruction to the
//  reader.
//
//  HONEST FRAME (locked): these are the people and the books; the methods are
//  THEIRS, DESCRIBED as historical/contemporary practice — no claim of
//  demonstrated validity is made or implied. Belief context and efficacy
//  assertions are flagged (`flags`). Every record cites where the person↔work
//  pairing was verified (`verified`) and carries a bibliographic citation
//  (`cite`).
//
//  Built 2026-07-16 by live web-verification of every person↔work pairing
//  against publisher pages, ISBN records, the practitioners' own sites and
//  scholarly catalogs, then an adversarial fabrication check with every
//  correction applied and every refuted/unverifiable entry dropped (e.g.
//  "Bruce Robertson"). See LIBRARY_METHOD_NOTE.
//
//  Pure data: no DOM, no network, no randomness.
//
//  Record shape:
//    { domain:'western'|'indian'|'esoteric', practice, name, years,
//      tier:'canon'|'respected'|'niche'|'academic', tierNote?, school, line,
//      works:[{title, year?, publisher?}], papers?:[{title, journal, year}],
//      methodSource?, methodSteps?:[ordered strings], flags?:[strings],
//      verified, cite }
// ============================================================================

// --- The tier vocabulary. These tiers grade PRACTITIONER-RECOGNITION — how a
//     working community places a figure — NOT scholarly weight or truth. A
//     towering scholar can read as "niche" to practitioners and a self-taught
//     teacher as "respected"; the labels track visibility inside a craft, and
//     the honest frame (no validity claims) is the same across all four.
export const TIER_DEFS = [
  { key: 'canon', label: 'Canon',
    def: 'The historical sources — the foundational authors and texts a practice is built on, in their standard modern editions and translations.' },
  { key: 'respected', label: 'Respected modern',
    def: 'Widely-recognized contemporary teachers — the figures a practitioner community reads, cites and trains under today.' },
  { key: 'niche', label: 'Niche',
    def: 'Genuine lesser-known practitioner voices — real, verifiable teachers who are simply less visible. This is practitioner-recognition, not scholarly weight: a "niche" tag never means minor.' },
  { key: 'academic', label: 'Academic',
    def: 'Scholarship, not practice — historians and philologists who study a system. Cataloged for what the record shows, with method_type = scholarship; they describe the art, they do not prescribe it.' },
];

// A standing note on the vocabulary, surfaced on the index page. It carries the
// two stature caveats the fabrication check flagged: Michael Dummett and Stuart
// Kaplan read as far more than "niche/reference" within tarot — the tiers below
// track recognition inside a craft, not importance.
export const TIER_VOCAB_NOTE =
  'The four tiers grade practitioner-recognition, not scholarly weight or truth. "Niche" means lesser-known to a working community, never minor: Michael Dummett — the pre-eminent historian of tarot — sits on the scholarship shelf that most card-readers never open, and Stuart Kaplan, who published the Rider–Waite–Smith deck for fifty years, is a central figure of the tarot world however a practitioner tier reads. Each record carries a tierNote where the label needs that context.';

// --- Journals & resources per domain (verified 2026-07-16). ------------------
export const JOURNALS = {
  western: [
    { name: 'skyscript.co.uk', note: "Deborah Houlding's library — the standard free research archive for traditional & horary astrology; hosts Wade Caves' In Mundo desk and the field's major book reviews." },
    { name: 'The Mountain Astrologer', note: 'The leading practitioner magazine (est. 1987); carries Nina Gryphon’s Magical Elections column and Eve Dembowski’s articles.' },
    { name: 'Culture and Cosmos', note: 'The only peer-reviewed journal on the history of astrology; founded 1997, ed. Nicholas Campion, Sophia Centre Press / University of Wales Trinity Saint David (cultureandcosmos.org).' },
    { name: 'NCGR Geocosmic Journal', note: 'The member journal of the National Council for Geocosmic Research (geocosmic.org).' },
  ],
  indian: [
    { name: 'The Astrological Magazine', note: 'Restarted 1936 by B.V. Raman (a predecessor run was edited by his grandfather), Bangalore; the century’s paper of record for jyotiṣa, closed December 2007.' },
    { name: 'Journal of Astrology', note: "K.N. Rao's Bharatiya-Vidya-Bhavan-school journal (journalofastrology.com)." },
    { name: 'The Jyotish Digest', note: 'Sanjay Rath / Sagittarius Publications — the Sri Jagannath Center school.' },
    { name: 'Saptarishis Astrology', note: 'The niche free digital magazine & archive (saptarishisastrology.com); publishes lesser-known Indian authors (Bisaria, and others).' },
    { name: 'Gochara', note: 'The journal of the British Association for Vedic Astrology (BAVA), ed. Andrew Foss.' },
    { name: 'History of Science in South Asia (HSSA)', note: 'Open-access academic journal (journals.library.ualberta.ca/hssa) — where the Mak, Geslani and Wujastyk papers live.' },
  ],
  esoteric: [
    { name: 'The Playing-Card', note: 'Journal of the International Playing-Card Society (IPCS, i-p-c-s.org), since 1972; Depaulis and Dummett published tarot history here.' },
    { name: 'Ambix', note: 'Journal of the Society for the History of Alchemy and Chemistry (SHAC), since 1937 (Taylor & Francis); Principe, Newman and Nummedal publish here.' },
    { name: 'Aries: Journal for the Study of Western Esotericism', note: 'Brill, since 2001; the journal of the ESSWE, plus the Aries Book Series.' },
    { name: 'Correspondences: Journal for the Study of Esotericism', note: 'Open access, correspondencesjournal.com, since 2013.' },
  ],
};

export const LIBRARY_CITATION =
  "The Practitioners' Library — a verified expert catalog of the Western, Indian and divination/esoteric traditions. "
  + 'Every person↔work pairing was checked on 2026-07-16 against publisher pages, ISBN records (Amazon/AbeBooks/Biblio), '
  + 'the practitioners’ own sites and scholarly catalogs (Brill, Chicago, Princeton, Stanford, Routledge, OUP, HSSA), '
  + 'then adversarially fact-checked for fabrication; corrections were applied and unverifiable entries dropped.';

export const LIBRARY_METHOD_NOTE =
  'How this catalog was built (2026-07-16): a two-pass, adversarial process. First, an expert catalog of each domain’s '
  + 'practitioners, works and step-by-step methods was compiled from named published sources only. Second, an independent '
  + 'reviewer re-checked every person↔work pairing by live web search against publisher/bookseller records and the '
  + 'figures’ own sites, hunting specifically for invented people or books. Every confirmed correction was applied '
  + '(title, year, publisher, translator, tier and framing fixes), anything refuted or unverifiable was removed '
  + '(e.g. "Bruce Robertson"), and every method is catalogued as its author teaches it — described, never prescribed, with '
  + 'no claim of validity. Each record names where it was verified.';

export const PRACTITIONERS = [
  // ==========================================================================
  //  WESTERN TRADITIONAL ASTROLOGY
  //  practices: Horary · Electional · Natal (Hellenistic/Medieval/Renaissance)
  //             · Mundane · Astrological Magic (Picatrix)
  // ==========================================================================

  // --- HORARY --------------------------------------------------------------
  {
    domain: 'western', practice: 'Horary', name: 'William Lilly', years: '1602–1681',
    tier: 'canon', school: 'English horary; the site’s core computational source',
    line: 'The foremost English horary astrologer, whose Christian Astrology (1647) is the Workbench’s primary Lilly source.',
    works: [
      { title: 'Christian Astrology', year: 1647, publisher: 'London; Regulus Publishing facsimile 1985 (instigated by Olivia Barclay); Astrology Classics reprints' },
    ],
    verified: 'sue-ward.co.uk; skyscript.co.uk/rev_lilly.html; en.wikipedia.org/wiki/Olivia_Barclay (Barclay obtained a 1647 copy in 1980, arranged the 1985 facsimile).',
    cite: 'William Lilly, Christian Astrology (London, 1647; Regulus facsimile 1985).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Guido Bonatti', years: '13th c.',
    tier: 'canon', school: 'Medieval Italian; Liber Astronomiae',
    line: 'The great medieval Italian master; his Liber Astronomiae treats horary questions exhaustively.',
    works: [
      { title: 'The Book of Astronomy (Liber Astronomiae)', year: 2007, publisher: 'trans. Benjamin Dykes, Cazimi Press — first complete translation, from the 1491/1550 Latin' },
      { title: 'Bonatti on Horary (Treatise 6, 100+ questions)', year: 2010, publisher: 'Cazimi Press (ISBN 9781934586082)' },
    ],
    verified: 'skyscript.co.uk/rev_bonatti.html (Houlding review); bendykes.com product pages; Amazon ISBN records.',
    cite: 'Guido Bonatti, The Book of Astronomy, trans. Benjamin Dykes (Cazimi Press, 2007).',
  },
  {
    domain: 'western', practice: 'Horary', name: "Māshā’allāh & Sahl ibn Bishr", years: 'c. 740–815 / 9th c.',
    tier: 'canon', school: 'Early Arabic-era horary doctrine',
    line: 'The early Arabic-era sources of horary doctrine — Māshā’allāh’s On Reception and Sahl’s Fifty Judgments.',
    works: [
      { title: "Works of Sahl & Māshā’allāh", year: 2008, publisher: 'trans. Benjamin Dykes, Cazimi Press' },
    ],
    verified: 'bendykes.com/product/works-of-sahl-mashaallah; AbeBooks Cazimi Press listings.',
    cite: "Works of Sahl & Māshā’allāh, trans. Benjamin Dykes (Cazimi Press, 2008).",
  },
  {
    domain: 'western', practice: 'Horary', name: 'Olivia Barclay', years: '1919–2001',
    tier: 'respected', school: 'Lilly revival; founder of the Qualified Horary Practitioner (QHP) diploma (1984)',
    line: 'The driving force of the modern Lilly revival, who owned an original 1647 Christian Astrology and founded the QHP diploma.',
    works: [
      { title: 'Horary Astrology Rediscovered', year: 1990, publisher: 'Whitford Press (ISBN 9780914918998)' },
    ],
    methodSource: 'Horary Astrology Rediscovered (1990)',
    methodSteps: [
      'Return to Lilly’s Christian Astrology as the primary text (Barclay drove its 1985 facsimile republication).',
      'Cast the chart for the moment the astrologer receives and understands the question, in Regiomontanus houses as Lilly used.',
      'Check radicality and the considerations before judgment: a very early/late Ascendant, the Moon in via combusta, Saturn in the 7th.',
      'Assign the querent to the 1st-house ruler and the Moon; assign the quesited by house rulership.',
      'Judge the essential dignity and accidental strength of the significators from Lilly’s tables.',
      'Seek perfection: applying aspect, translation of light, or collection of light.',
      'Note prohibition, frustration and refranation as denials.',
      'Derive timing from the degrees of application, converted by sign quality and angularity.',
    ],
    verified: 'AbeBooks/Biblio ISBN records; qhpastrology.co.uk (QHP history: Barclay bequeathed the QHP to Barbara Dunn, 2001).',
    cite: 'Olivia Barclay, Horary Astrology Rediscovered (Whitford Press, 1990).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'John Frawley', years: 'contemporary',
    tier: 'respected', school: 'Traditional (Lilly-based) horary, London; Apprentice Books (launched 2001)',
    line: 'A leading traditional horary teacher whose plain-spoken, Lilly-based textbooks defined the modern revival.',
    works: [
      { title: 'The Real Astrology', year: 2000, publisher: 'Apprentice Books (Spica Award, International Book of the Year 2001)' },
      { title: 'The Real Astrology Applied', year: 2002, publisher: 'Apprentice Books' },
      { title: 'The Horary Textbook', year: 2005, publisher: 'Apprentice Books; revised edition 2014' },
      { title: 'Sports Astrology', year: 2007, publisher: 'Apprentice Books' },
    ],
    methodSource: 'The Horary Textbook (2005, rev. 2014)',
    methodSteps: [
      'Clarify exactly what is being asked, and what would count as a "yes", before touching the chart.',
      'Cast for the time and place the astrologer understands the question.',
      'Assign houses: querent = 1st ruler; quesited by the house governing the matter (with derived houses where needed).',
      'Take the Moon as co-significator of the querent (unless it signifies the quesited).',
      'Assess the essential dignities and debilities of the significators to judge power and inclination.',
      'Weigh the receptions between significators to read attitude and desire.',
      'Seek perfection of the matter: applying aspect, translation of light, or collection of light.',
      'Check the impediments: prohibition, refranation, frustration, combustion.',
      'Time the event from the degrees to perfection, scaled by cardinal/fixed/mutable signs and angular/succedent/cadent houses.',
      'Deliver the judgment in plain language, answering the question actually asked.',
    ],
    verified: 'johnfrawley.com; en.wikipedia.org/wiki/John_Frawley_(astrologer); Apprentice Books ISBN records (9780953977406, …413, …437/…475, …420).',
    cite: 'John Frawley, The Horary Textbook (Apprentice Books, 2005; rev. 2014).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Deborah Houlding', years: 'contemporary',
    tier: 'respected', school: 'School of Traditional Astrology (STA); founder of skyscript.co.uk',
    line: 'Founder of skyscript.co.uk and author of the STA horary certification, who stresses historical house meaning and context over rule-stacking.',
    works: [
      { title: 'The Houses: Temples of the Sky', year: 2006, publisher: 'Wessex Astrologer, revised ed. (orig. 1998; ISBN 9781902405209)' },
      { title: 'The STA Practitioners’ Level Horary Certification course (author; delivered 24+ years)', year: 'ongoing', publisher: 'sta.co' },
      { title: 'skyscript.co.uk (editor/founder) — the field’s main free research library', year: '2000s–present', publisher: 'web' },
    ],
    methodSource: 'The STA horary course + The Houses: Temples of the Sky',
    methodSteps: [
      'Establish the historical meaning of each house from ancient sources before assigning the quesited.',
      'Verify the chart is radical and the question mature.',
      'Assign significators by house rulership, with the Moon as universal co-significator.',
      'Judge planetary condition via essential dignity and accidental state (angularity, speed, combustion).',
      'Examine reception and applying aspects for perfection or denial.',
      'Set the judgment within the question’s realistic context — context over mechanical rule-stacking.',
    ],
    flags: ['The "24+ years" figure for the course rests on wadecaves.com/courses, as cited.'],
    verified: 'skyscript.co.uk; sta.co course pages; wadecaves.com/courses; en.wikipedia.org/wiki/Deborah_Houlding (Charles Harvey Award 2010, UAC Regulus Award 2018).',
    cite: 'Deborah Houlding, The Houses: Temples of the Sky (Wessex Astrologer, rev. 2006).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Barbara Dunn', years: 'contemporary',
    tier: 'respected', school: 'QHP principal (inherited from Olivia Barclay, 2001)',
    line: 'The QHP principal, whose source-grounded horary organizes every judgment around whether the matter is possible or impossible.',
    works: [
      { title: 'Horary Astrology Re-Examined: The Possibility or Impossibility of the Matter Propounded', year: 2009, publisher: 'Wessex Astrologer (ISBN 9781902405353)' },
    ],
    methodSource: 'Horary Astrology Re-Examined (2009)',
    methodSteps: [
      'Ground every judgment in the Greek, Arabic and Latin source doctrine of planetary strength.',
      'Compute the essential dignities rigorously, including almutens, before judging.',
      'Test first whether the matter propounded is possible or impossible — her organizing question.',
      'Judge perfection or denial via application, translation, collection and prohibition.',
      'Confirm against 50+ documented example questions with known outcomes.',
    ],
    verified: 'wessexastrologer.com; qhpastrology.co.uk/barbara-dunn; AbeBooks ISBN 9781902405353 (exact subtitle).',
    cite: 'Barbara Dunn, Horary Astrology Re-Examined (Wessex Astrologer, 2009).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'J. Lee Lehman', years: 'contemporary',
    tier: 'respected', school: 'Classical studies; Kepler College professor/VP; PhD Botany, Rutgers',
    line: 'A classical scholar-practitioner who reconstructed the full essential-dignity and rulership apparatus behind traditional judgment.',
    works: [
      { title: 'Essential Dignities', year: 1989, publisher: 'Whitford Press (ISBN 9780924608032)' },
      { title: 'The Book of Rulerships', year: 1992, publisher: 'Whitford Press' },
      { title: 'The Martial Art of Horary Astrology', year: 2002, publisher: 'Whitford Press' },
      { title: 'Traditional Medical Astrology', year: 2011, publisher: 'Schiffer (ISBN 9780764339448)' },
    ],
    methodSource: 'The Martial Art of Horary Astrology (2002)',
    methodSteps: [
      'Treat each question as a disciplined engagement: classify it precisely by house before judging.',
      'Select significators from the house-rulership tables assembled from classical sources (The Book of Rulerships).',
      'Score significator strength with the full essential-dignity system she reconstructed (Essential Dignities).',
      'Analyze applying aspects, reception and impediments for perfection.',
      'Blend technique with cultivated judgment — her "martial art" framing of practice discipline.',
    ],
    verified: 'Amazon/AbeBooks ISBN records; leelehman.com; openlibrary.org/authors/OL354468A.',
    cite: 'J. Lee Lehman, The Martial Art of Horary Astrology (Whitford Press, 2002).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Anthony Louis', years: 'contemporary',
    tier: 'respected', school: 'Horary; psychiatrist-astrologer and prolific reviewer',
    line: 'A psychiatrist-astrologer whose horary books and long-running blog read the Moon’s story and time events by degrees of application.',
    works: [
      { title: 'Horary Astrology: The History and Practice of Astro-Divination', year: 1991, publisher: 'Llewellyn (ISBN 9780875423944; revised 1996)' },
      { title: 'Horary Astrology Plain & Simple', year: 1998, publisher: 'Llewellyn (ISBN 9781567184013; later printings 2002/2005/2022)' },
      { title: 'tonylouis.wordpress.com — active review & technique blog', year: 'ongoing', publisher: 'web' },
    ],
    methodSource: 'Horary Astrology Plain & Simple',
    methodSteps: [
      'Formulate a sincere, pressing question and note the moment of understanding.',
      'Determine the querent’s and quesited’s houses; check the strictures before judgment.',
      'Read the Moon’s last and next aspects as the story of the matter.',
      'Judge perfection between significators with dignity and reception.',
      'Convert the applying degrees to time units for prediction.',
    ],
    verified: 'Amazon/Biblio ISBN records; Llewellyn listings; tonylouis.wordpress.com/about. (Correction applied: Plain & Simple first published 1998, not 2002.)',
    cite: 'Anthony Louis, Horary Astrology Plain & Simple (Llewellyn, 1998).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Sue Ward', years: 'contemporary',
    tier: 'respected', school: 'Lilly-line traditional horary; Traditional Horary Course (est. 1993)',
    line: 'A traditional horary teacher of the Lilly line whose long-running course reached print, and who co-wrote a study of Lilly himself.',
    works: [
      { title: 'The Traditional Horary Course', year: 2021, publisher: 'published in book form (ISBN 9798477494156); a 21-essay collection accompanies it' },
      { title: 'William Lilly: The Last Magician, Adept & Astrologer (with Peter Stockinger)', year: 2014, publisher: 'Mandrake of Oxford (ISBN 9781906958626)' },
    ],
    methodSource: 'The Traditional Horary Course',
    methodSteps: [
      'Work strictly from Lilly’s own doctrine, teaching the source rules before any shortcut.',
      'Cast for the moment the question is understood; test radicality and the considerations.',
      'Assign significators by house and the Moon; weigh essential dignity and reception.',
      'Judge perfection and its denials, timing the matter from the applying degrees.',
    ],
    verified: 'sue-ward.co.uk; Amazon/AbeBooks ISBN records; skyscript.co.uk/rev_lilly.html.',
    cite: 'Sue Ward, The Traditional Horary Course (2021); Ward & Stockinger, William Lilly: The Last Magician (Mandrake, 2014).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Wade Caves', years: 'contemporary',
    tier: 'respected', school: 'Horary/electional consultant; STA Dip. HMA; STA tutor',
    line: 'An STA tutor and consultant who edited a 300th-anniversary edition of Lilly’s autobiography and publishes the In Mundo series.',
    works: [
      { title: "William Lilly, History of His Life and Times (300th-anniversary edition, editor & annotator)", year: 2015, publisher: 'Rubedo Press' },
      { title: 'The In Mundo article series', year: '2010s–present', publisher: 'skyscript.co.uk/inmundo' },
      { title: 'wadecaves.com — consultancy & webinars ("Finding Fortuna", "The Lunar Nodes in Practice")', year: 'ongoing', publisher: 'web' },
    ],
    methodSource: 'The STA horary certification (Houlding curriculum) as delivered by Caves',
    methodSteps: [
      'Quantify the question and its context with the querent.',
      'Cast the chart and test radicality.',
      'Assign significators; judge essential and accidental condition.',
      'Weigh reception and the routes to perfection; deliver a concrete, dated judgment.',
    ],
    verified: 'wadecaves.com/about (fetched 2026-07-16); sta.co tutor directory; skyscript.co.uk/inmundo.',
    cite: 'Wade Caves (ed.), William Lilly: History of His Life and Times, 300th-anniversary ed. (Rubedo Press, 2015).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Eve Dembowski', years: 'contemporary',
    tier: 'niche', school: 'Horary; STA master diploma, Zoller medieval certificate; Melbourne, Australia',
    line: 'An STA master-diploma tutor (the first to take the horary course online) known for derived-house work and chart-work without birth times.',
    works: [
      { title: 'Articles in the FAA Journal, The Mountain Astrologer, Astrolog', year: 'ongoing', publisher: 'print journals' },
      { title: '"Making Sense of Derived Houses"', year: 'ongoing', publisher: 'Astrology University' },
      { title: 'Co-convener, Regulus Traditional Astrology Conference', year: '2009–2010', publisher: 'Australia' },
    ],
    methodSource: 'The STA horary course (which she first adapted for online delivery, tutoring since 2013)',
    methodSteps: [
      'Run the standard STA horary sequence: question intake, radicality, significators, dignity, reception, perfection, timing.',
      'Add her distinctive emphases from her lectures: derived-house analysis, and judging charts without a birth time.',
    ],
    verified: 'sta.co tutors page; astrologyuniversity.com; vicastrology.net lecture records (2016, 2019, 2025).',
    cite: 'Eve Dembowski, STA horary tuition & lectures (Melbourne; sta.co).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Alphee Lavoie', years: 'professional since 1965',
    tier: 'niche', school: 'Horary + astrology software; Dell Horoscope horary columnist for 25 years; founder of AIR Software (1979)',
    line: 'A career horary astrologer and software author who taught "the language of astrology" through hundreds of delineated client charts.',
    works: [
      { title: 'Horary at its Best', year: 'contemporary', publisher: 'AIR Software (ISBN 9780964562110)' },
      { title: "Alphee’s Horary Astrology: The Master’s Work Book", year: 2020, publisher: 'AIR Software (ISBN 9780964562141)' },
      { title: 'Horary Lectures (his first horary book)', year: 'contemporary', publisher: 'AIR Software (ISBN 9780964562158)' },
    ],
    methodSource: 'Horary at its Best',
    methodSteps: [
      'Teach "the language of astrology" first: pick the correct house for the matter asked.',
      'Cast for the question moment; assign the querent (1st + Moon) and the quesited significators.',
      'Judge aspect perfection and denial across 38–50 fully delineated client charts.',
      'Apply his timing rules to date the outcome.',
      'Verify the method against recorded outcomes — his stated practice.',
    ],
    flags: ['Asserts efficacy: presents horary predictions as verified against real-world results.'],
    verified: 'alphee.com/books; Amazon ISBN records. (Correction applied: The Master’s Work Book published 2020.)',
    cite: "Alphee Lavoie, Alphee’s Horary Astrology: The Master’s Work Book (AIR Software, 2020).",
  },
  {
    domain: 'western', practice: 'Horary', name: 'Ema Kurent', years: 'contemporary',
    tier: 'niche', school: 'Horary; QHP, DFAstrolS, ISAR CAP; Ljubljana, Slovenia; 25+ years',
    line: 'A Slovenian horary practitioner whose Lilly-line textbook pairs theory with 124 worked example cases from her own files.',
    works: [
      { title: 'Horary Astrology: Your Ultimate Horary Textbook with 124 Example Cases', year: 2019, publisher: 'Stella, Ljubljana (ISBN 9789619463703; Slovenian orig. Horarna astrologija, 2015)' },
    ],
    methodSource: 'Horary Astrology (2019)',
    methodSteps: [
      'Teach the theory in the Lilly line: strictures, significators, dignities, receptions, perfection, timing.',
      'Then judge 124 example charts from her own files, nearly all with known outcomes, step by step.',
    ],
    verified: 'emakurent.com; Amazon/Goodreads ISBN records; Anthony Louis review (tonylouis.wordpress.com, 2019-03-25).',
    cite: 'Ema Kurent, Horary Astrology: Your Ultimate Horary Textbook with 124 Example Cases (Stella, 2019).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Ryhan Butler', years: 'contemporary',
    tier: 'niche', school: 'Medieval astrology, horary & talismans; New Mexico; studying classical technique since 2009',
    line: 'The author of the Medieval Astrology Guide, a free reference site walking through dignities, horary and talisman elections in the Bonatti/Arabic-era line.',
    works: [
      { title: 'medievalastrologyguide.com — reference site for medieval theory & technique', year: '2010s–present', publisher: 'web' },
      { title: 'Lectures & podcast appearances (OPA, Arnemancy, Kelly Surtees)', year: 'ongoing', publisher: 'web' },
    ],
    methodSource: 'The Medieval Astrology Guide articles',
    methodSteps: [
      'Follow his free, sourced articles through dignities and house rulership.',
      'Apply them to horary judgment and to talisman elections in the Bonatti/Arabic-era line.',
    ],
    verified: 'medievalastrologyguide.com/about; patreon.com/ryhanbutlerastro; arnemancy.com appearances.',
    cite: 'Ryhan Butler, Medieval Astrology Guide (medievalastrologyguide.com).',
  },
  {
    domain: 'western', practice: 'Horary', name: 'Peter Stockinger', years: 'contemporary',
    tier: 'niche', school: 'Traditional astrology; The Astrological Society / traditionalastrology.wordpress.com',
    line: 'A traditional astrologer who co-authored, with Sue Ward, a study of William Lilly as magician, adept and astrologer.',
    works: [
      { title: 'William Lilly: The Last Magician, Adept & Astrologer (with Sue Ward)', year: 2014, publisher: 'Mandrake of Oxford (ISBN 9781906958626)' },
    ],
    verified: 'Amazon/AbeBooks ISBN 9781906958626; skyscript.co.uk/rev_lilly.html.',
    cite: 'Ward & Stockinger, William Lilly: The Last Magician, Adept & Astrologer (Mandrake, 2014).',
  },

  // --- ELECTIONAL ----------------------------------------------------------
  {
    domain: 'western', practice: 'Electional', name: 'Dorotheus of Sidon', years: '1st c. CE',
    tier: 'canon', school: 'Hellenistic; Carmen Astrologicum',
    line: 'Book V of the Carmen Astrologicum is the fountainhead of electional doctrine.',
    works: [
      { title: 'Carmen Astrologicum', year: 2017, publisher: 'trans. Benjamin Dykes, Cazimi Press (2nd ed. 2019); earlier David Pingree trans. 1976' },
    ],
    verified: 'bendykes.com; standard scholarly record (Pingree Teubner 1976).',
    cite: 'Dorotheus of Sidon, Carmen Astrologicum, trans. Benjamin Dykes (Cazimi Press, 2017; 2nd ed. 2019).',
  },
  {
    domain: 'western', practice: 'Electional', name: 'Benjamin Dykes', years: 'contemporary',
    tier: 'respected', school: 'Translator-practitioner; PhD philosophy; the field’s central translation engine',
    line: 'The translator whose Cazimi Press editions rebuilt the medieval/Persian library in English, and who wrote the modern electional synthesis.',
    works: [
      { title: 'Choices & Inceptions: Traditional Electional Astrology', year: 2012, publisher: 'Cazimi Press' },
      { title: 'The Book of the Nine Judges', year: 2011, publisher: 'Cazimi Press' },
      { title: 'Traditional Astrology for Today: An Introduction', year: 2011, publisher: 'Cazimi Press' },
      { title: 'Persian Nativities I–III', year: '2009–2010', publisher: 'Cazimi Press' },
      { title: 'Introductions to Traditional Astrology: Abū Ma’shar & al-Qabīsī', year: 2010, publisher: 'Cazimi Press' },
    ],
    methodSource: 'Choices & Inceptions (2012)',
    methodSteps: [
      'Define the undertaking and its natural significator houses.',
      'Fortify the Ascendant and its lord (dignity, angularity, freedom from affliction).',
      'Fortify the Moon: waxing, dignified, applying to benefics, clear of via combusta and combustion.',
      'Place the house lord of the matter strongly and joined favorably to the Ascendant lord.',
      'Harmonize the election with the client’s nativity where known (radix support).',
      'Cross-check against the compiled election rules of Dorotheus, Sahl and al-Rijāl that the volume translates.',
    ],
    verified: 'Amazon Cazimi Press record (Choices and Inceptions, June 2012); bendykes.com; AbeBooks Cazimi publisher listing.',
    cite: 'Benjamin Dykes, Choices & Inceptions: Traditional Electional Astrology (Cazimi Press, 2012).',
  },
  {
    domain: 'western', practice: 'Electional', name: 'Nina Gryphon', years: 'contemporary',
    tier: 'respected', school: 'Electional + astrological magic; JD/MA Stanford; Frawley Horary Apprenticeship; STA horary diploma',
    line: 'The author of the Mountain Astrologer’s Magical Elections column, who scans for a strongly-dignified significator and times it to the planetary hour.',
    works: [
      { title: 'The "Magical Elections" monthly column', year: 'ongoing', publisher: 'The Mountain Astrologer' },
      { title: 'Magical Elections monthly guide + the STA Magical Elections course', year: 'ongoing', publisher: 'ninagryphon.com; sta.co/me' },
    ],
    methodSource: 'The Magical Elections column & course (as publicly described)',
    methodSteps: [
      'Identify the client’s concrete aim (marriage, filing, surgery, launch) and its ruling houses.',
      'Scan ephemeris windows for the significator planet in strong essential dignity and angular placement.',
      'Time it to the planetary day/hour and lunar condition appropriate to the aim.',
      'For magical elections, add talisman-grade requirements (significator strongly dignified, unafflicted, culminating or rising) with consecration guidance.',
      'Deliver dated election windows with explicit rationale.',
    ],
    flags: ['Asserts efficacy: presents elections (and magical elections) as producing outcomes.'],
    verified: 'ninagryphon.com/pages/about-nina-gryphon; sta.co/me; Kepler College store author page.',
    cite: 'Nina Gryphon, "Magical Elections" (The Mountain Astrologer; ninagryphon.com).',
  },

  // --- NATAL (Hellenistic / Medieval / Renaissance) ------------------------
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Claudius Ptolemy', years: '2nd c. CE',
    tier: 'canon', school: 'Hellenistic; the theoretical spine',
    line: 'The Tetrabiblos is the theoretical spine of Western astrology.',
    works: [
      { title: 'Tetrabiblos', year: 1940, publisher: 'trans. F. E. Robbins, Loeb Classical Library' },
    ],
    verified: 'standard Loeb record.',
    cite: 'Ptolemy, Tetrabiblos, trans. F. E. Robbins (Loeb, 1940).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Vettius Valens', years: '2nd c. CE',
    tier: 'canon', school: 'Hellenistic; the practicing astrologer’s Anthology',
    line: 'The Anthology is the practicing astrologer’s counterweight to Ptolemy, dense with worked charts.',
    works: [
      { title: 'Anthology (Anthologiae)', year: '1993–2001', publisher: 'trans. Robert Schmidt, Project Hindsight Greek Track, Golden Hind Press, ed. Robert Hand; also a free scholarly Mark Riley PDF' },
    ],
    verified: 'weiserantiquarian Project Hindsight volume records; projecthindsight.net.',
    cite: 'Vettius Valens, Anthology, trans. Robert Schmidt (Project Hindsight / Golden Hind Press, 1993–2001).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: "Abū Ma’shar", years: '787–886',
    tier: 'canon', school: 'Persian-Arabic; the Great Introduction',
    line: 'The Great Introduction and On the Revolutions of the Nativities are pillars of the Persian-Arabic natal tradition.',
    works: [
      { title: 'On the Revolutions of the Nativities (Persian Nativities III)', year: 2010, publisher: 'trans. Benjamin Dykes, Cazimi Press' },
      { title: 'The Great Introduction (al-Madkhal al-kabīr)', year: 2019, publisher: 'ed./trans. Keiji Yamamoto & Charles Burnett, Brill' },
    ],
    verified: 'bendykes.com; Brill scholarly record.',
    cite: "Abū Ma’shar, On the Revolutions of the Nativities, trans. Benjamin Dykes (Cazimi Press, 2010).",
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Al-Bīrūnī', years: '973–1048',
    tier: 'canon', school: 'Persian polymath; the Book of Instruction',
    line: 'The Book of Instruction in the Elements of the Art of Astrology is a lucid medieval summa of the technical vocabulary.',
    works: [
      { title: 'The Book of Instruction in the Elements of the Art of Astrology', year: 1934, publisher: 'trans. R. Ramsay Wright; reprints by Astrology Classics' },
    ],
    verified: 'standard scholarly record.',
    cite: 'Al-Bīrūnī, The Book of Instruction in the Elements of the Art of Astrology, trans. R. Ramsay Wright (1934).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Jean-Baptiste Morin (Morinus)', years: '1583–1656',
    tier: 'canon', school: 'Renaissance; Astrologia Gallica',
    line: 'Astrologia Gallica is the summit of Renaissance natal method.',
    works: [
      { title: 'Astrologia Gallica (individual books)', year: 1661, publisher: 'trans. James Herschel Holden, American Federation of Astrologers (AFA)' },
    ],
    verified: 'AFA catalog record (standard).',
    cite: 'J.-B. Morin, Astrologia Gallica, trans. J. H. Holden (AFA).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Chris Brennan', years: 'contemporary',
    tier: 'respected', school: 'Hellenistic revival; The Astrology Podcast; studied at Kepler & Project Hindsight',
    line: 'The Hellenistic-revival teacher whose textbook and podcast reintroduced sect, profections and zodiacal releasing to a wide audience.',
    works: [
      { title: 'Hellenistic Astrology: The Study of Fate and Fortune', year: 2017, publisher: 'Amor Fati Publications' },
      { title: 'The Astrology Podcast (500+ episodes)', year: '2012–present', publisher: 'theastrologypodcast.com' },
      { title: 'The Hellenistic Astrology Course', year: 'ongoing', publisher: 'theastrologyschool.com' },
    ],
    methodSource: 'Hellenistic Astrology (2017), the timing chapters',
    methodSteps: [
      'Use whole-sign houses as the Hellenistic default.',
      'Establish each planet’s condition: sect status, sign, angularity, bonification/maltreatment.',
      'Compute annual profections: age mod 12 steps the Ascendant one sign per year; the profected sign’s ruler is Lord of the Year.',
      'Prioritize transits involving the Lord of the Year and the profected sign over all others.',
      'Layer zodiacal releasing from the Lot of Spirit (career/action) or Fortune (body/fortune) to find peak and transitional periods.',
      'Read the solar-return chart as a supplemental annual filter.',
      'Synthesize: the activated topics are the profected house topics, timed by transit contacts.',
    ],
    verified: 'theastrologypodcast.com; Amor Fati edition on bookseller records.',
    cite: 'Chris Brennan, Hellenistic Astrology: The Study of Fate and Fortune (Amor Fati, 2017).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Demetra George', years: 'contemporary',
    tier: 'respected', school: 'Hellenistic/mythic; MA Classics',
    line: 'A Hellenistic-and-mythic teacher whose two-volume Ancient Astrology assesses each planet’s condition before delineating meaning.',
    works: [
      { title: 'Ancient Astrology in Theory and Practice, Vol. I: Assessing Planetary Condition', year: 2019, publisher: 'Rubedo Press (622 pp.)' },
      { title: 'Ancient Astrology in Theory and Practice, Vol. II: Delineating Planetary Meaning', year: 2022, publisher: 'Rubedo Press (ISBN 9780995124554)' },
      { title: 'Astrology and the Authentic Self', year: 2008, publisher: 'Ibis Press' },
      { title: 'Asteroid Goddesses (with Douglas Bloch)', year: 1986, publisher: 'ACS; Ibis reprints' },
    ],
    methodSource: 'Ancient Astrology in Theory and Practice, Vol. I–II',
    methodSteps: [
      'Work planet by planet, not house by house.',
      'Assess condition first: sect membership, solar phase (under beams/cazimi/rising), lunar applications, essential dignity, angularity, aspects from benefics/malefics.',
      'Score whether each planet can deliver its significations — its "capacity to produce effects".',
      'Only then delineate meaning: the planet as topic-ruler through its houses (the Vol. II procedure).',
      'Practice through the workbook exercises attached to every chapter.',
    ],
    verified: 'rubedo.press/ancient-astrology + /ancient-astrology-volume-two; demetra-george.com; Amazon ISBN record.',
    cite: 'Demetra George, Ancient Astrology in Theory and Practice, Vols I–II (Rubedo Press, 2019, 2022).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Robert Hand', years: 'contemporary',
    tier: 'respected', school: 'Bridge figure: modern psychological → traditional revival; co-founder Project Hindsight (1993); founder ARHAT',
    line: 'The bridge between modern and traditional astrology, who reintroduced sect and whole-sign houses and co-founded Project Hindsight.',
    works: [
      { title: 'Planets in Transit', year: 1976, publisher: 'Para Research (later Whitford/Schiffer reprints)' },
      { title: 'Horoscope Symbols', year: 1981, publisher: 'Para Research (later Whitford/Schiffer reprints)' },
      { title: 'Night & Day: Planetary Sect in Astrology', year: 1995, publisher: 'ARHAT' },
      { title: 'Whole Sign Houses: The Oldest House System', year: 2000, publisher: 'ARHAT' },
    ],
    methodSource: 'Horoscope Symbols + the ARHAT monographs',
    methodSteps: [
      'Read symbols as core principles, not keyword lists (the Horoscope Symbols framework).',
      'Reintroduce sect: classify the chart as day/night and re-weight the benefics and malefics accordingly (Night & Day).',
      'Use whole-sign houses for topics and quadrant houses for strength (his ARHAT position).',
      'Layer transits with his cookbook-but-principled delineations (Planets in Transit).',
    ],
    verified: 'projecthindsight.net/about; openlibrary/bookseller records. (Correction applied: Planets in Transit & Horoscope Symbols originally Para Research.)',
    cite: 'Robert Hand, Horoscope Symbols (Para Research, 1981).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Robert Zoller', years: '1947–2020',
    tier: 'respected', school: 'Medieval (Bonatti-line) predictive astrology',
    line: 'A medieval-revival predictive astrologer of the Bonatti line, who rebuilt the Arabic Parts and the Almuten Figuris for a diploma course.',
    works: [
      { title: 'The Arabic Parts in Astrology: A Lost Key to Prediction', year: 1989, publisher: 'Inner Traditions (orig. The Lost Key to Prediction, 1980)' },
      { title: 'Tools & Techniques of the Medieval Astrologer', year: 1981, publisher: 'privately circulated monograph (written 1981); New Library' },
      { title: 'Diploma Course in Medieval Astrology', year: '1990s–2000s', publisher: 'New Library / academyofpredictiveastrology' },
    ],
    methodSource: 'The Diploma Course / The Arabic Parts in Astrology',
    methodSteps: [
      'Compute the temperament from the Ascendant, its ruler, the Moon and the season.',
      'Find the Hyleg and Alcocoden for the vitality assessment (described historically).',
      'Compute the Almutem Figuris — the ruling planet of the whole figure.',
      'Deploy the Arabic Parts: Part = Ascendant + planet B − planet A (reversed by night for many parts).',
      'Predict by Firdaria periods, primary directions and solar revolutions in the medieval sequence.',
    ],
    verified: 'jyotishbooks course listing pairing both titles; Inner Traditions edition on bookseller records; sta.co (Dembowski holds a Zoller certificate).',
    cite: 'Robert Zoller, The Arabic Parts in Astrology: A Lost Key to Prediction (Inner Traditions, 1989).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Austin Coppock', years: 'contemporary',
    tier: 'respected', tierNote: 'Raised from niche on review: 36 Faces is a field-standard reference and he was among the most visible astrologers of the revival.',
    school: 'Decanic natal + magical astrology; co-editor of The Celestial Art (with Daniel Schulke)',
    line: 'The decans specialist whose 36 Faces reconstructed each ten-degree face for natal delineation and image magic.',
    works: [
      { title: '36 Faces: The History, Astrology and Magic of the Decans', year: 2014, publisher: 'Three Hands Press (illus. Bob Eames; reissue ISBN 9781945147067)' },
      { title: 'Annual astrological almanacs + austincoppock.com', year: '2010s–present', publisher: 'web/self' },
    ],
    methodSource: '36 Faces (2014)',
    methodSteps: [
      'Locate each natal planet’s decan (10-degree face) by degree.',
      'Read the decan’s reconstructed image-meaning, traced from Egyptian through Indian and European sources.',
      'Refract the decan through each of the 7 traditional planets for natal delineation ("natal power").',
      'For image magic, use the decan images historically catalogued for talismans (described, never prescribed).',
    ],
    verified: 'threehandspress.com/shop/36-faces; austincoppock.com; weiserantiquarian 2014 first-edition records.',
    cite: 'Austin Coppock, 36 Faces: The History, Astrology and Magic of the Decans (Three Hands Press, 2014).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Robert Schmidt & Ellen Black', years: '1950–2018 / d. 2023',
    tier: 'respected', tierNote: 'Raised from niche on review: Project Hindsight was the source-translation engine of the entire Hellenistic revival.',
    school: 'Project Hindsight — the Greek-track translation project (founded 1993 with Robert Hand)',
    line: 'The couple behind Project Hindsight, whose Greek-track translations recovered the Hellenistic system as a coherent whole.',
    works: [
      { title: 'Project Hindsight Greek Track (Valens’ Anthology I–VII, Paulus, Antiochus, Hephaistio, etc.)', year: '1993–2001', publisher: 'The Golden Hind Press (founded 1985)' },
      { title: 'The So-Called Problem of House Division / TARES lectures', year: '2000s–2010s', publisher: 'projecthindsight.net; robertschmidtastrology.com' },
    ],
    methodSource: 'Schmidt’s conceptual-reconstruction lectures',
    methodSteps: [
      'Reconstruct the Hellenistic system as a coherent philosophical whole from the Greek technical vocabulary outward — translation as system-recovery, not merely text-recovery.',
    ],
    verified: 'projecthindsight.net/about-robert-schmidt; astro.com astrowiki; weiserantiquarian Golden Hind volume records.',
    cite: 'Robert Schmidt (Project Hindsight), Greek Track translations (Golden Hind Press, 1993–2001).',
  },
  {
    domain: 'western', practice: 'Natal (Hellenistic / Medieval / Renaissance)', name: 'Charlie Obert', years: 'contemporary',
    tier: 'niche', school: 'Traditional natal pedagogy; Minneapolis; Kepler College required-text author',
    line: 'A traditional-natal teacher whose working guide gives an explicit step-by-step outline for reading a nativity.',
    works: [
      { title: 'Introduction to Traditional Natal Astrology: A Complete Working Guide for Modern Astrologers', year: 2015, publisher: 'Almuten Press (ISBN 9780986418709; a Kepler College required text)' },
      { title: 'The Cycle of the Year: Traditional Predictive Astrology', year: 2018, publisher: 'Almuten Press (ISBN 9780986418723)' },
      { title: 'studentofastrology.com', year: 'ongoing', publisher: 'web' },
    ],
    methodSource: 'Introduction to Traditional Natal Astrology (2015)',
    methodSteps: [
      'Learn the traditional worldview and the number/geometry symbolism first.',
      'Master dignities, sect, houses and the rulership networks.',
      'Follow his printed step-by-step natal outline: chart overview, sect, Ascendant + ruler, the luminaries, house-by-house via the rulers, synthesis.',
      'Work the fully-delineated example charts.',
      'Extend to prediction with profections and solar returns (The Cycle of the Year).',
    ],
    verified: 'studentofastrology.com; Amazon/B&N ISBN records; Kepler College required-text note.',
    cite: 'Charlie Obert, Introduction to Traditional Natal Astrology (Almuten Press, 2015).',
  },

  // --- MUNDANE -------------------------------------------------------------
  {
    domain: 'western', practice: 'Mundane', name: "Abū Ma’shar (mundane)", years: '787–886',
    tier: 'canon', school: 'Persian-Arabic mundane; the great-conjunction doctrine',
    line: 'On the Great Conjunctions founded the Jupiter–Saturn cycle doctrine that governs mundane astrology.',
    works: [
      { title: 'On the Great Conjunctions (On Historical Astrology)', year: 2000, publisher: 'ed./trans. Keiji Yamamoto & Charles Burnett, Brill' },
    ],
    verified: 'standard Brill scholarly record.',
    cite: "Abū Ma’shar, On the Great Conjunctions, ed. Yamamoto & Burnett (Brill, 2000).",
  },
  {
    domain: 'western', practice: 'Mundane', name: 'Nicholas Campion', years: 'contemporary',
    tier: 'respected', school: 'Mundane astrology + academic history of astrology; director, the Sophia Centre (UWTSD)',
    line: 'A mundane astrologer and academic historian who compiled the standard national-chart reference and founded Culture and Cosmos.',
    works: [
      { title: 'Mundane Astrology: An Introduction to the Astrology of Nations and Groups (with Michael Baigent & Charles Harvey)', year: 1984, publisher: 'Aquarian Press; Thorsons reprint (ISBN 9781855381407)' },
      { title: 'The Book of World Horoscopes', year: 1988, publisher: 'Aquarian; revised eds. Wessex Astrologer — the standard national-chart reference' },
      { title: 'Culture and Cosmos (founder-editor)', year: '1997–present', publisher: 'Sophia Centre Press' },
    ],
    methodSource: 'Mundane Astrology (1984)',
    methodSteps: [
      'Establish the national chart from documented founding moments (his birth-data research program).',
      'Track outer-planet cycles, especially the Jupiter–Saturn conjunction cycle, against the national charts.',
      'Read ingresses, eclipses and lunations against the national chart’s angles and luminaries.',
      'Interpret within historical/political context rather than as isolated omens.',
    ],
    verified: 'Google Books/Amazon records for Mundane Astrology; en.wikipedia.org/wiki/Nicholas_Campion; cultureandcosmos.org.',
    cite: 'Campion, Baigent & Harvey, Mundane Astrology (Aquarian Press, 1984).',
  },

  // --- ASTROLOGICAL MAGIC (PICATRIX) ---------------------------------------
  {
    domain: 'western', practice: 'Astrological Magic (Picatrix)', name: 'Picatrix (Ghāyat al-Ḥakīm)', years: '10th–11th c.',
    tier: 'canon', school: 'The grand grimoire of astrological magic; the site’s talisman-content source',
    line: 'The grand grimoire of astrological magic — the source of the Workbench’s talisman content.',
    works: [
      { title: 'The Complete Picatrix', year: 2011, publisher: 'trans. Christopher Warnock & John Michael Greer, Adocentyn Press (from the Latin)' },
      { title: 'Picatrix (Latin critical edition)', year: 1986, publisher: 'ed. David Pingree, Warburg Institute' },
    ],
    verified: 'renaissanceastrology.com; miskatonicbooks Illustrated Picatrix record; Warburg record for Pingree.',
    cite: 'Picatrix (Ghāyat al-Ḥakīm), trans. Warnock & Greer, The Complete Picatrix (Adocentyn Press, 2011).',
  },
  {
    domain: 'western', practice: 'Astrological Magic (Picatrix)', name: 'Cornelius Agrippa', years: '1486–1535',
    tier: 'canon', school: 'Renaissance synthesis of astrological magic',
    line: 'The Three Books of Occult Philosophy are the Renaissance synthesis of astrological magic underpinning the site’s correspondences.',
    works: [
      { title: 'Three Books of Occult Philosophy', year: 2021, publisher: 'trans. Eric Purdue, Inner Traditions (3 vols; first complete new English translation since 1651)' },
    ],
    verified: 'innertraditions.com; standard Inner Traditions record.',
    cite: 'Cornelius Agrippa, Three Books of Occult Philosophy, trans. Eric Purdue (Inner Traditions, 2021).',
  },
  {
    domain: 'western', practice: 'Astrological Magic (Picatrix)', name: 'Christopher Warnock', years: 'contemporary',
    tier: 'respected', school: 'Renaissance astrological-magic revival; attorney-astrologer; renaissanceastrology.com',
    line: 'A founding figure of the modern astrological-magic revival, who co-translated the Picatrix and teaches its election-and-talisman procedure.',
    works: [
      { title: 'The Complete Picatrix (trans. with John Michael Greer)', year: 2011, publisher: 'Adocentyn Press' },
      { title: 'Secrets of Planetary Magic', year: 2010, publisher: 'Renaissance Astrology, 3rd ed. (ISBN 9780557366262)' },
      { title: 'The Mansions of the Moon: A Lunar Zodiac for Astrology & Magic', year: 2019, publisher: 'Renaissance Astrology, rev. ed. (28 mansion images by Nigel Jackson)' },
    ],
    methodSource: 'Secrets of Planetary Magic + the Astrological Magic Course (as he teaches it, catalogued descriptively)',
    methodSteps: [
      'Define the aim and select the celestial patron: the planet, lunar mansion or fixed star whose significations match.',
      'Find an election where that significator is essentially dignified (rulership/exaltation), unafflicted (no combustion, no malefic aspect) and angular — ideally rising or culminating.',
      'Require the Moon fortified: waxing, dignified, applying to benefics, clear of via combusta and eclipse.',
      'Time the working to the planetary day and planetary hour of the significator.',
      'At the elected moment, create the talisman with the image and inscription specified in the Picatrix (or the mansion image per his Mansions of the Moon).',
      'Suffumigate with the planet’s incense and recite the Picatrix orations for consecration.',
      'Historically, the talisman was then treated as a live tie to its celestial patron — kept, honored, or ritually deconstructed.',
    ],
    flags: ['Asserts efficacy: his method steps read closest to instructions ("suffumigate… recite…"). On this site they are catalogued as DESCRIBED historical practice, never prescribed — no talisman has demonstrated validity.'],
    verified: 'renaissanceastrology.com (site + course pages); Amazon ISBN records for Secrets of Planetary Magic; idolastellarum.com profile.',
    cite: 'Christopher Warnock, Secrets of Planetary Magic, 3rd ed. (Renaissance Astrology, 2010).',
  },
  {
    domain: 'western', practice: 'Astrological Magic (Picatrix)', name: 'John Michael Greer (Picatrix translation)', years: 'contemporary',
    tier: 'niche', school: 'Co-translator of the Complete Picatrix; prolific occult historian',
    line: 'The co-translator, with Warnock, of the Complete and Illustrated Picatrix — catalogued here for that translation pairing.',
    works: [
      { title: 'The Complete Picatrix (co-trans. with Christopher Warnock)', year: 2011, publisher: 'Adocentyn Press' },
      { title: 'The Illustrated Picatrix (co-trans.)', year: '2015–2020', publisher: 'Adocentyn Press' },
    ],
    verified: 'miskatonicbooks.com product record; renaissanceastrology.com.',
    cite: 'Warnock & Greer (trans.), The Complete Picatrix (Adocentyn Press, 2011).',
  },
  {
    domain: 'western', practice: 'Astrological Magic (Picatrix)', name: 'Gordon White', years: '1981–2026',
    tier: 'niche', tierNote: 'Adjacent voice — chaos-magic and star-lore, NOT a traditional astrologer; included as a bridge figure, with an explicit framing flag.',
    school: 'Chaos-magic-adjacent star-lore & practical enchantment; Rune Soup (runesoup.com)',
    line: 'A chaos-magic-adjacent writer and podcaster whose relevance here is star-lore history (Star.Ships), not chart-judgment method.',
    works: [
      { title: 'Star.Ships: A Prehistory of the Spirits', year: 2016, publisher: 'Scarlet Imprint' },
      { title: 'The Chaos Protocols', year: 2016, publisher: 'Llewellyn (ISBN 9780738744711)' },
      { title: 'Ani.Mystic: Encounters With A Living Cosmos', year: 2022, publisher: 'Scarlet Imprint' },
    ],
    flags: [
      'Adjacent voice: chaos-magic / animist practice, not traditional astrology — no chart-judgment method; catalogued for star-lore history only.',
      'Reported deceased 13 May 2026 (family message via runesoup.com).',
    ],
    verified: 'runesoup.com/books; Amazon ISBN record; Goodreads author page. (Corrections applied: born 1981; death 13 May 2026.)',
    cite: 'Gordon White, Star.Ships: A Prehistory of the Spirits (Scarlet Imprint, 2016).',
  },

  // ==========================================================================
  //  INDIAN SYSTEMS (Jyotiṣa)
  //  practices: Parāśarī (natal) · Jaimini · Nakṣatra · KP (Krishnamurti
  //  Paddhati) · Tājika (varṣaphala) · Muhūrta · Praśna · Nāḍī, plus three
  //  scholarship shelves (history of jyotiṣa · Rasaśāstra & alchemy · Yoga).
  //  Academics are scholarship, NOT practice.
  // ==========================================================================

  // --- PARĀŚARĪ (natal) : canon --------------------------------------------
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Parāśara (attrib.)', years: 'compiled by early med. period',
    tier: 'canon', school: 'The root Parāśarī compendium',
    line: 'The Bṛhat Parāśara Horā Śāstra (BPHS) is the root Parāśarī compendium every modern jyotiṣa curriculum keys to.',
    works: [
      { title: 'Bṛhat Parāśara Horā Śāstra (BPHS), 2 vols', year: 1984, publisher: 'trans. R. Santhanam, Ranjan Publications, Delhi; also Girish Chand Sharma trans., Sagar Publications' },
    ],
    methodSource: 'Bṛhat Parāśara Horā Śāstra',
    methodSteps: [
      'Erect the lagna-based rāśi chart.',
      'Derive the 16 divisional charts (ṣoḍaśavarga).',
      'Read the graha avasthās and compute ṣaḍbala.',
      'Identify the yogas.',
      'Run the Viṁśottarī daśā (with the conditional daśās where indicated).',
      'Prescribe the remedial measures (the upāya chapters).',
    ],
    verified: 'standard bibliographic record; both Santhanam (Ranjan) and Sharma (Sagar) editions ubiquitously cited.',
    cite: 'Parāśara, Bṛhat Parāśara Horā Śāstra, trans. R. Santhanam (Ranjan, 1984).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Varāhamihira', years: '6th c. CE (Ujjain)',
    tier: 'canon', school: 'The template-setting jātaka digests',
    line: 'The 6th-century master whose Bṛhat Jātaka and Bṛhat Saṁhitā set the template for every later natal digest.',
    works: [
      { title: 'Bṛhat Saṁhitā, 2 vols', year: 1981, publisher: 'trans. M. Ramakrishna Bhat, Motilal Banarsidass (1981–82)' },
      { title: 'Bṛhat Jātaka', year: 'c. 550 CE', publisher: 'trans. B. Suryanarain Rao (reprints ed. B. V. Raman); also N. Chidambaram Iyer, 19th c.' },
    ],
    verified: 'standard bibliographic record; dating treated in Bill Mak’s and Geslani’s papers.',
    cite: 'Varāhamihira, Bṛhat Jātaka & Bṛhat Saṁhitā (trans. Bhat, Motilal, 1981–82).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Kalyāṇa Varma', years: 'c. 800 CE',
    tier: 'canon', school: 'The great post-Varāhamihira natal digest',
    line: 'The Sārāvalī is the great post-Varāhamihira natal digest, universally cited in Santhanam’s edition.',
    works: [
      { title: 'Sārāvalī, 2 vols', year: 1983, publisher: 'trans. R. Santhanam, Ranjan Publications' },
    ],
    verified: 'standard bibliographic record.',
    cite: 'Kalyāṇa Varma, Sārāvalī, trans. R. Santhanam (Ranjan, 1983).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Vaidyanātha Dīkṣita', years: 'c. 15th–16th c.',
    tier: 'canon', school: 'Jātaka Pārijāta',
    line: 'The author of the Jātaka Pārijāta, a much-used classical natal manual.',
    works: [
      { title: 'Jātaka Pārijāta', year: 1932, publisher: 'trans. V. Subrahmanya Sastri (2 vols in the 1932–33 original; 3-vol modern reprints)' },
    ],
    flags: ['The specific modern-reprint publisher attribution (Ranjan) is left soft — unconfirmed at verification.'],
    verified: 'standard bibliographic record. (Correction applied: 2 vols in the 1932–33 original; 3-vol modern reprints.)',
    cite: 'Vaidyanātha Dīkṣita, Jātaka Pārijāta, trans. V. Subrahmanya Sastri (1932).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Mantreśvara', years: 'disputed (13th–16th c.)',
    tier: 'canon', school: 'South India; Phaladīpikā',
    line: 'The author of the Phaladīpikā ("lamp of results"), prized for its house-lord results and kārakatva lists.',
    works: [
      { title: 'Phaladīpikā', year: 'c. 13th–16th c.', publisher: 'trans. G. S. Kapoor, Ranjan Publications' },
    ],
    verified: 'standard bibliographic record. (Correction applied: Mantreśvara’s date is disputed, 13th–16th c.)',
    cite: 'Mantreśvara, Phaladīpikā, trans. G. S. Kapoor (Ranjan Publications).',
  },

  // --- PARĀŚARĪ (natal) : respected ----------------------------------------
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'B. V. Raman', years: '1912–1998 (Bangalore)',
    tier: 'respected', school: 'The 20th-century public face of jyotiṣa; founder-editor of The Astrological Magazine',
    line: 'The 20th century’s public face of jyotiṣa, whose quantitative bala method and long-lived magazine shaped the modern field.',
    works: [
      { title: 'Hindu Predictive Astrology', year: 'contemporary', publisher: 'Motilal Banarsidass / UBS / IBH' },
      { title: 'How to Judge a Horoscope, 2 vols', publisher: 'Motilal Banarsidass' },
      { title: 'Three Hundred Important Combinations', publisher: 'Motilal Banarsidass' },
      { title: 'Prasna Marga, 2 vols (trans.)', publisher: 'Motilal Banarsidass' },
      { title: 'The Astrological Magazine (founder-editor)', year: 1936, publisher: 'Bangalore (restarted 1936; closed December 2007)' },
    ],
    methodSource: 'How to Judge a Horoscope',
    methodSteps: [
      'Assess the ascendant and the Moon.',
      'Compute the ṣaḍbala / bhāva bala quantitatively (Graha and Bhava Balas gives the arithmetic).',
      'Judge each bhāva via its lord, kāraka, occupants and aspects.',
      'Weigh the named yogas (Three Hundred Important Combinations).',
      'Run the Viṁśottarī daśā with gochara (transit) confirmation.',
    ],
    verified: 'standard bibliographic record; Hindu Predictive Astrology circulates in full text online.',
    cite: 'B. V. Raman, How to Judge a Horoscope (Motilal Banarsidass).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'K. N. Rao', years: 'b. 1931 (Delhi)',
    tier: 'respected', school: 'Bharatiya Vidya Bhavan Institute of Astrology; founder, Journal of Astrology',
    line: 'The Bhavan-school teacher whose signature is a Parāśarī reading double-checked against a Jaimini chara-daśā reading of the same question.',
    works: [
      { title: 'Learn Hindu Astrology Easily', year: 'contemporary', publisher: 'Vani Publications (ISBN 9788189221065)' },
      { title: "Predicting Through Jaimini’s Chara Dasha", publisher: 'Vani Publications' },
      { title: 'Planets and Children', publisher: 'Vani Publications' },
      { title: 'Astrology, Destiny and the Wheel of Time', publisher: 'Vani Publications' },
      { title: 'Yogis, Destiny and the Wheel of Time', publisher: 'Vani Publications' },
    ],
    methodSource: 'The Bharatiya Vidya Bhavan curriculum (his "composite approach")',
    methodSteps: [
      'Work from a verified birth time with the full varga set prepared.',
      'Read from three reference points — lagna, Moon and Sun.',
      'Find the yogas in the rāśi chart.',
      'Confirm each promise in the relevant divisional chart (D-9 marriage, D-10 career, D-24 education…).',
      'Use the Viṁśottarī daśā as the primary clock.',
      'Independently confirm through a Jaimini chara-daśā reading of the same question — the signature double-check.',
      'Trigger events by the Saturn–Jupiter double-transit rule on the relevant house/lord.',
    ],
    verified: 'journalofastrology.com "our astrologers" page; standard bibliographic record. (Correction applied: the book is "Learn Hindu Astrology Easily", Vani — NOT "…Systematically", which does not exist.)',
    cite: 'K. N. Rao, Learn Hindu Astrology Easily (Vani Publications).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Hart de Fouw & Robert Svoboda', years: 'contemporary',
    tier: 'respected', school: 'Graha-centred synthesis for a Western audience',
    line: 'The authors of Light on Life, long the standard Western-audience introduction, who read the chart as a dialogue of significators inside its Vedic container.',
    works: [
      { title: 'Light on Life: An Introduction to the Astrology of India', year: 1996, publisher: 'Penguin Arkana; Lotus Press 2003' },
    ],
    methodSource: 'Light on Life',
    methodSteps: [
      'Read the grahas as kārakas first — the planets as significators.',
      'Treat the chart as a dialogue of those significators.',
      'Weigh strengths (avasthās / dignity) before house-lord mechanics.',
      'Frame the whole inside its Vedic cultural container (Svoboda’s Āyurveda/tantra context).',
    ],
    verified: 'standard bibliographic record; continuously cited as the standard Western-audience introduction.',
    cite: 'Hart de Fouw & Robert Svoboda, Light on Life (Penguin Arkana, 1996).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'James Braha', years: 'contemporary',
    tier: 'respected', school: 'Sidereal prediction rebuilt for Western astrologers; Florida',
    line: 'The author of Ancient Hindu Astrology for the Modern Western Astrologer, who rebuilt the house-lord cookbook for a Western readership.',
    works: [
      { title: 'Ancient Hindu Astrology for the Modern Western Astrologer', year: 1986, publisher: 'Hermetician Press' },
      { title: 'How to Predict Your Future: Secrets of Eastern and Western Astrology', publisher: 'Hermetician Press' },
    ],
    methodSource: 'Ancient Hindu Astrology for the Modern Western Astrologer',
    methodSteps: [
      'Delineate each of the 144 house-lord placements from his cookbook.',
      'Fix the functional benefics/malefics by lagna.',
      'Time with the daśās and gochara.',
      'Explicitly bridge the tropical-Western psychological reading with sidereal prediction.',
    ],
    verified: 'standard bibliographic record.',
    cite: 'James Braha, Ancient Hindu Astrology for the Modern Western Astrologer (Hermetician Press, 1986).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'David Frawley (Vāmadeva Śāstrī)', years: 'contemporary',
    tier: 'respected', school: 'Jyotiṣa integrated with Āyurveda & yoga; American Institute of Vedic Studies',
    line: 'The teacher who integrated jyotiṣa with Āyurveda and yoga, presenting the gem/mantra/deity upāyas as the traditional remedial layer.',
    works: [
      { title: 'Astrology of the Seers', year: 1990, publisher: 'Lotus Press' },
      { title: 'Ayurvedic Astrology', year: 2005, publisher: 'Lotus Press' },
    ],
    methodSource: 'Astrology of the Seers',
    methodSteps: [
      'Read the chart with attention to the planetary doṣas (its Āyurvedic constitution).',
      'Integrate the yoga and Āyurveda context.',
      'Present the gem/mantra/deity upāyas as the traditional remedial layer (catalogued as described practice).',
    ],
    flags: ['Presents remedial measures (gems, mantras, deities) as a working tradition — catalogued as described practice, no validity claimed.'],
    verified: 'standard bibliographic record; American Institute of Vedic Studies (vedanet.com).',
    cite: 'David Frawley, Astrology of the Seers (Lotus Press, 1990).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'P. V. R. Narasimha Rao', years: 'contemporary',
    tier: 'respected', school: 'Author of the free Jagannātha Hora (JHora) software — the de-facto research standard',
    line: 'The engineer who wrote the free Jagannātha Hora software and an "integrated approach" built on computational exactness.',
    works: [
      { title: 'Vedic Astrology: An Integrated Approach', year: 2001, publisher: 'Sagar Publications' },
      { title: 'Jagannātha Hora (JHora) software + free lessons/papers', year: 'ongoing', publisher: 'vedicastrologer.org' },
    ],
    methodSource: 'Vedic Astrology: An Integrated Approach',
    methodSteps: [
      'Rectify / verify the birth time.',
      'Take a lagna + Moon overview in the rāśi chart.',
      'Route every question to its proper varga and read that varga as a full chart.',
      'Read the arudha padas alongside.',
      'Compute the Viṁśottarī plus the narrower conditional daśās exactly (his software exists to make this precise).',
      'Bring in transits last, as triggers — with emphasis on computational exactness (true sunrise, precise ayanāṁśa).',
    ],
    verified: 'vedicastrologer.org; standard bibliographic record.',
    cite: 'P. V. R. Narasimha Rao, Vedic Astrology: An Integrated Approach (Sagar, 2001).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Marc Boney', years: 'contemporary',
    tier: 'respected', school: 'K. N. Rao school; faculty, American College of Vedic Astrology; San Diego',
    line: 'A K. N. Rao–trained ACVA faculty member (Jyotish Navaratna Award, 2024) who teaches the Bhavan composite method through biographical case studies.',
    works: [
      { title: 'Jyotisha For Beginners', year: 2017, publisher: 'CreateSpace / Amazon' },
      { title: '100+ case-study articles', year: 'ongoing', publisher: 'marcboney.com and journals' },
    ],
    methodSource: 'His case-study method (the K. N. Rao school)',
    methodSteps: [
      'Establish the rāśi promise.',
      'Confirm it in the relevant varga.',
      'Double-check with the Viṁśottarī and a chara daśā.',
      'Confirm the trigger by the Saturn–Jupiter double transit — delivered through biographical case studies.',
    ],
    verified: 'marcboney.com/about; Goodreads author list; Amazon.',
    cite: 'Marc Boney, Jyotisha For Beginners (2017).',
  },

  // --- PARĀŚARĪ (natal) : niche --------------------------------------------
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Freedom Cole', years: 'contemporary',
    tier: 'niche', school: 'Sanskrit-literate; Rath lineage; Nevada City',
    line: 'A Sanskrit-literate teacher of the Rath lineage whose Science of Light course walks BPHS chapter by chapter with Jaimini tools inside a Parāśarī frame.',
    works: [
      { title: 'Science of Light: An Introduction to Vedic Astrology, Vol. 1', year: 'contemporary', publisher: 'Science of Light LLC (ISBN 0978844785)' },
      { title: 'Science of Light, Vol. 2', publisher: 'Science of Light LLC (ISBN 9780985012205)' },
    ],
    methodSource: 'The Science of Light practitioner course',
    methodSteps: [
      'Proceed through BPHS chapter by chapter, in Sanskrit terms: grahas / devatā, then rāśi / bhāva.',
      'Assess strengths and avasthās.',
      'Bring in bhāva-pada and argala (Jaimini tools inside the Parāśarī frame — his Rath inheritance).',
      'Read the nakṣatras, then the daśās and vargas.',
      'Close with upāya and the pañcāṅga.',
    ],
    verified: 'Amazon listings; scienceoflight.net; shrifreedom.org. (Correction applied: Vol. 2 ISBN 9780985012205.)',
    cite: 'Freedom Cole, Science of Light, Vol. 1 (Science of Light LLC).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'Ryan Kurczak', years: 'contemporary',
    tier: 'niche', school: 'Kriya-Yoga lineage of Roy Eugene Davis; Asheville Vedic Astrology',
    line: 'A meditation-first jyotiṣa teacher whose foundation course frames chart study as sādhana, with a large free video curriculum.',
    works: [
      { title: 'The Art and Science of Vedic Astrology: The Foundation Course (with Richard Fish)', year: 2012, publisher: 'ISBN 9781475267655' },
      { title: 'The Art and Science of Vedic Astrology, Volume 2: Intermediate Principles', year: 2013, publisher: 'ISBN 9781493773114' },
    ],
    methodSource: 'The Foundation Course',
    methodSteps: [
      'Frame chart study as sādhana — meditation first.',
      'Work the sequence: planets → planetary condition → houses → aspects → yogas → vargas → Viṁśottarī → transits.',
      'Tie in Āyurveda and the remedial measures.',
      'Hold the Yoga Sūtras as the interpretive ethic.',
    ],
    verified: 'Amazon; ashevillevedicastrology.wordpress.com.',
    cite: 'Ryan Kurczak & Richard Fish, The Art and Science of Vedic Astrology: The Foundation Course (2012).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'V. P. Goel', years: 'contemporary',
    tier: 'niche', school: 'Daśā-systems specialist; Delhi; Sagar Publications author',
    line: 'A conditional-daśā specialist whose monographs cover the rarer time-lord systems.',
    works: [
      { title: 'Shasti Hayani Dasha', year: 'contemporary', publisher: 'Sagar Publications' },
      { title: 'Shodashottary Dasha', publisher: 'Sagar Publications' },
      { title: 'Yogini Dasha se Phalit', publisher: 'Sagar Publications' },
      { title: 'Predict with Trishamsa', publisher: 'Sagar Publications' },
    ],
    methodSource: 'His conditional-daśā monographs',
    methodSteps: [
      'Select the appropriate conditional daśā for the chart (Shashṭi-hāyanī, Ṣoḍaśottarī, Yoginī, etc.).',
      'Compute its sequence and periods precisely.',
      'Read events through the daśā lords, confirmed by transit.',
    ],
    flags: ['Correction applied: the widely-mis-attributed "Wonders of Ashtakavarga" is NOT a V. P. Goel work — his verified oeuvre contains no aṣṭakavarga title. Aṣṭakavarga is anchored on C. S. Patel instead (see next record).'],
    verified: 'saptarishisshop.com author category; bookkish.com; AbeBooks author page.',
    cite: 'V. P. Goel, conditional-daśā monographs (Sagar Publications).',
  },
  {
    domain: 'indian', practice: 'Parāśarī (natal)', name: 'C. S. Patel', years: 'contemporary',
    tier: 'niche', school: 'Aṣṭakavarga (with C. A. Subramania Aiyar)',
    line: 'The author of the standard modern Aṣṭakavarga classic — the correct anchor for that technique.',
    works: [
      { title: 'Ashtakavarga (with C. A. Subramania Aiyar)', year: 'contemporary', publisher: 'Sagar Publications (ISBN 8170821878)' },
    ],
    methodSource: 'Ashtakavarga',
    methodSteps: [
      'Score the bindus per sign from each graha’s benefic points.',
      'Total the sarvāṣṭakavarga to rank the houses/signs.',
      'Screen transits — planets crossing low-bindu signs deliver poorly.',
      'Refine with the kakṣyā sub-divisions.',
    ],
    verified: 'Amazon/AbeBooks ISBN 8170821878. (Anchor record per the aṣṭakavarga correction.)',
    cite: 'C. S. Patel & C. A. Subramania Aiyar, Ashtakavarga (Sagar Publications).',
  },

  // --- JAIMINI -------------------------------------------------------------
  {
    domain: 'indian', practice: 'Jaimini', name: 'Sanjay Rath', years: 'b. 1963 (Puri lineage)',
    tier: 'respected', school: 'Founder, Sri Jagannath Center (SJC); publisher of The Jyotish Digest',
    line: 'The founder of the Sri Jagannath Center, whose Jaimini Scholar Program teaches the chara-kāraka / arudha / chara-daśā sequence.',
    works: [
      { title: 'Crux of Vedic Astrology: Timing of Events', year: 'contemporary', publisher: 'Sagar Publications' },
      { title: "Jaimini Maharishi’s Upadesa Sutra (trans./commentary)", publisher: 'Sagar Publications' },
      { title: 'Vedic Remedies in Astrology', publisher: 'Sagar Publications' },
      { title: 'Brihat Nakshatra', publisher: 'Sagittarius Publications' },
    ],
    methodSource: 'The SJC / Jaimini Scholar Program',
    methodSteps: [
      'Fix the seven/eight chara kārakas, the Ātmakāraka first as the soul-significator.',
      'Take the kārakāṁśa (the AK’s navāṁśa sign) for the iṣṭa-devatā and life direction.',
      'Read the arudha lagna and the bhāva-padas for the perceived/material life, distinct from lagna reality.',
      'Run argala (intervention) analysis on the key positions.',
      'Apply rāśi dṛṣṭi (sign aspects) throughout, not graha dṛṣṭi alone.',
      'Time with chara daśā and nārāyaṇa daśā.',
      'Judge rāja-yoga from the AK–AmK links.',
    ],
    verified: 'standard bibliographic record; SJC / Sagittarius imprints; srath.com.',
    cite: 'Sanjay Rath, Crux of Vedic Astrology: Timing of Events (Sagar Publications).',
  },
  {
    domain: 'indian', practice: 'Jaimini', name: 'Andrew Foss, PhD', years: 'contemporary',
    tier: 'niche', school: 'Creator of Shri Jyoti Star; founding president, BAVA; editor, Gochara',
    line: 'A physicist-turned-astrologer, creator of the Shri Jyoti Star software and a Certified Jaimini Scholar, who pairs Jaimini technique with mantra remediation.',
    works: [
      { title: 'Shri Jyoti Star software', year: 'ongoing', publisher: 'vedicsoftware.com' },
      { title: 'Yoga of the Planets series (108 names/mantras per graha)', publisher: 'yogaoftheplanets.com' },
    ],
    methodSource: 'The Jaimini-Scholar-programme technique set (Rath lineage) + the 108-names corpus',
    methodSteps: [
      'Apply the Jaimini Scholar technique set (chara kārakas, arudhas, chara daśā).',
      'Add mantra remediation via the 108-names corpus — catalogued as described tradition.',
    ],
    flags: ['Presents mantra remediation as a working practice — catalogued as described tradition, no validity claimed.'],
    verified: 'jyotish.com/andrew-foss; vedicsoftware.com.',
    cite: 'Andrew Foss, Yoga of the Planets (yogaoftheplanets.com).',
  },
  {
    domain: 'indian', practice: 'Jaimini', name: 'Irangaṇṭi Rangāchārya', years: 'b. 1927 (Andhra)',
    tier: 'niche', school: 'The senior Jaimini textualist; sutra-first method',
    line: 'The senior living Jaimini textualist, who establishes kārakas, arudhas and rāśi-aspect rules strictly from the sūtras.',
    works: [
      { title: 'A Manual of Jaimini Astrology', year: 'contemporary', publisher: 'Sagar Publications (ISBN 9788170820727)' },
      { title: 'Jaimini Sutramritam (Sanskrit commentary + English)', year: 1991, publisher: 'Sanskrit–Telugu ed.' },
      { title: 'Jyotisha Phala Ratna Mala (trans. of Krishna Mishra)', publisher: 'iranganti.com/books' },
    ],
    methodSource: 'A Manual of Jaimini Astrology / Jaimini Sutramritam',
    methodSteps: [
      'Establish the kārakas, arudhas and argala strictly from the sūtras, with vṛddha-kārikā support.',
      'Apply the rāśi-aspect rules from the sūtras.',
      'Then read the āyur-daśās and phalita-daśās — positioned against later conflations.',
    ],
    verified: 'iranganti.com; Amazon; astrodevam. (Verify-or-omit resolved as VERIFIED.)',
    cite: 'Irangaṇṭi Rangāchārya, A Manual of Jaimini Astrology (Sagar Publications).',
  },

  // --- NAKṢATRA ------------------------------------------------------------
  {
    domain: 'indian', practice: 'Nakṣatra', name: 'Komilla Sutton', years: 'contemporary',
    tier: 'respected', school: 'Co-founder, British Association for Vedic Astrology (BAVA)',
    line: 'A BAVA co-founder whose nakṣatra- and pañcāṅga-first reading treats the Moon’s nakṣatra as the psychic base.',
    works: [
      { title: 'The Essentials of Vedic Astrology', year: 1999, publisher: 'The Wessex Astrologer' },
      { title: 'The Nakshatras: The Stars Beyond the Zodiac', year: 2014, publisher: 'The Wessex Astrologer' },
      { title: 'Personal Panchanga and the Five Sources of Light', publisher: 'The Wessex Astrologer' },
    ],
    methodSource: 'The Nakshatras / Personal Panchanga',
    methodSteps: [
      'Take the Moon’s nakṣatra as the psychic base of the reading.',
      'Read the personal pañcāṅga limbs as five daily "lights".',
      'Then lay the standard Parāśarī structure over that base.',
    ],
    verified: 'standard bibliographic record; Wessex Astrologer catalogue.',
    cite: 'Komilla Sutton, The Nakshatras: The Stars Beyond the Zodiac (Wessex Astrologer, 2014).',
  },
  {
    domain: 'indian', practice: 'Nakṣatra', name: 'Dennis Harness', years: 'contemporary',
    tier: 'respected', school: 'Ph.D. psychology; American Council/College of Vedic Astrology circles; Sedona',
    line: 'A psychologist whose Nakshatras delineates each lunar mansion archetypally (deity, śakti, symbol) over a counseling practice.',
    works: [
      { title: 'The Nakshatras: The Lunar Mansions of Vedic Astrology', year: 1999, publisher: 'Lotus Press' },
    ],
    methodSource: 'The Nakshatras (1999)',
    methodSteps: [
      'Delineate each nakṣatra archetypally: its deity, śakti and symbol.',
      'Layer that psychological/archetypal reading onto Western counseling practice.',
    ],
    verified: 'standard bibliographic record.',
    cite: 'Dennis Harness, The Nakshatras: The Lunar Mansions of Vedic Astrology (Lotus Press, 1999).',
  },
  {
    domain: 'indian', practice: 'Nakṣatra', name: 'Corey Dowds', years: 'contemporary',
    tier: 'niche', school: 'Eye of the Veda; student of Kurczak and Ernst Wilhelm; Charleston, SC',
    line: 'A nakṣatra-driven teacher whose manual delineates each mansion then applies it across natal, muhūrta and praśna use.',
    works: [
      { title: 'The Nakshatra Manual (400+ pp.)', year: 2025, publisher: 'Eye of the Veda' },
      { title: 'Courses at Eye of the Veda University', year: 'ongoing', publisher: 'eye-of-the-veda-university.teachable.com' },
    ],
    methodSource: 'The Nakshatra Manual',
    methodSteps: [
      'Delineate each nakṣatra in depth.',
      'Apply the mansion across natal, muhūrta and praśna work, per the manual’s structure.',
    ],
    verified: 'eyeoftheveda.com/about-corey. (Verify-or-omit resolved as VERIFIED; manual is a 400+ pp., Dec-2025 publication.)',
    cite: 'Corey Dowds, The Nakshatra Manual (Eye of the Veda, 2025).',
  },

  // --- KP (KRISHNAMURTI PADDHATI) ------------------------------------------
  {
    domain: 'indian', practice: 'KP (Krishnamurti Paddhati)', name: 'K. S. Krishnamurti', years: '1908–1972 (Madras)',
    tier: 'canon', school: 'Founder of Krishnamurti Paddhati (KP)',
    line: 'The founder of KP, whose 249 sub-lords and cuspal-sub-lord rule turned Placidus stellar astrology into a decisive yes/no system.',
    works: [
      { title: 'KP Readers I–VI (Casting; Fundamental Principles; Predictive Stellar Astrology; Marriage, Married Life and Children; Transit; Horary)', year: 'c. 1960s–70s', publisher: 'Krishnan & Co., Madras' },
    ],
    methodSource: 'The six KP Readers',
    methodSteps: [
      'Cast Placidus cusps with the KP ayanāṁśa.',
      'Divide each nakṣatra into 9 unequal sub-lords by Viṁśottarī proportion (the 249 subs).',
      'Let the CUSPAL SUB-LORD of the relevant house decide whether the matter is promised.',
      'Build the significator hierarchy: planet in the star of the occupant > occupant > planet in the star of the owner > owner.',
      'Take the Ruling Planets at the moment of judgment as a cross-check.',
      'Time events by the daśā-bhukti-antara of the significators, confirmed by transit.',
      'Horary variant: the querent picks a number 1–249, which fixes the ascendant sub.',
    ],
    verified: 'standard KP corpus, continuously in print via Krishnan & Co.',
    cite: 'K. S. Krishnamurti, KP Readers I–VI (Krishnan & Co., Madras).',
  },
  {
    domain: 'indian', practice: 'KP (Krishnamurti Paddhati)', name: 'S. P. Khullar', years: 'contemporary',
    tier: 'niche', school: 'KP-variant builder (Cuspal Interlink / sub-sub theory); Delhi',
    line: 'A retired telecom GM who extended KP a level deeper into sub-sub lords and cuspal-interlink theory.',
    works: [
      { title: 'Horary Astrology and Cuspal Interlinks', year: 'contemporary', publisher: 'ISBN 9788170820697' },
      { title: 'True Astrology: Basic and Traditional Concepts', publisher: 'Khullar Astro Research Institute' },
      { title: 'Kalamsa and Cuspal Interlinks; Key to Learn Sub Sub and Cuspal Interlinks Theory', publisher: 'Khullar Astro Research Institute' },
    ],
    methodSource: 'Cuspal Interlinks / Sub-Sub theory',
    methodSteps: [
      'Extend KP’s 249 subs one level down to SUB-SUB lords.',
      'A house matter fructifies only when the cuspal sub-sub lords INTERLINK the relevant cusps.',
      'Apply the Kalāṁśa correction to the positions.',
      'Time through the interlinked significators with a nāḍī-flavoured method.',
    ],
    verified: 'vedicbooks.net; AbeBooks; archive.org copies.',
    cite: 'S. P. Khullar, Horary Astrology and Cuspal Interlinks (ISBN 9788170820697).',
  },

  // --- TĀJIKA (varṣaphala) -------------------------------------------------
  {
    domain: 'indian', practice: 'Tājika (varṣaphala)', name: 'Nīlakaṇṭha Daivajña', years: 'fl. 1587 (Varanasi)',
    tier: 'canon', school: 'The standard tājika / varṣaphala digest',
    line: 'The author of the Tājika Nīlakaṇṭhī — the standard digest of the Perso-Arabic annual-chart tradition in Sanskrit.',
    works: [
      { title: 'Tājika Nīlakaṇṭhī (Saṁjñā, Varṣa, Praśna tantras)', year: 'c. 1587', publisher: 'Prasna Tantra portion trans. B. V. Raman (IBH/UBS reprints)' },
    ],
    methodSource: 'Tājika Nīlakaṇṭhī',
    methodSteps: [
      'Cast the solar-return (varṣa-praveśa) chart.',
      'Compute the muntha progression.',
      'Elect the year-lord (varṣeśvara) from the five office-holder candidates.',
      'Judge the 16 tājika yogas (ithāsāla, īsarāpha, kambūla, …) — the sixteen Perso-Arabic aspect-configurations.',
      'Read the sahamas (Arabic-style lots) for topics.',
      'Time within the year by the mudda (progressed Viṁśottarī) daśā.',
    ],
    verified: 'B. V. Raman’s Prasna Tantra is a standard title; Nīlakaṇṭha’s date and centrality confirmed in Gansten’s Hayanaratna scholarship (brill.com/display/title/57015).',
    cite: 'Nīlakaṇṭha Daivajña, Tājika Nīlakaṇṭhī (Prasna Tantra trans. B. V. Raman).',
  },
  {
    domain: 'indian', practice: 'Tājika (varṣaphala)', name: 'Ernst Wilhelm', years: 'contemporary',
    tier: 'respected', school: 'Kala Occult Publishers; author of the Kala software; vedic-astrology.net',
    line: 'A software author and teacher whose tājika year-reading judges the sixteen yogas with exact orbs — taught, notably, in a tropical-zodiac framing.',
    works: [
      { title: 'Classical Muhurta', year: 'contemporary', publisher: 'Kala Occult Publishers' },
      { title: 'Graha Sutras; Vault of the Heavens; Core Yogas', publisher: 'Kala Occult Publishers' },
      { title: 'The Kala software + tājika/varṣaphala course materials', year: 'ongoing', publisher: 'vedic-astrology.net' },
    ],
    methodSource: 'His tājika/varṣaphala course',
    methodSteps: [
      'Cast the varṣa-praveśa.',
      'Read the muntha sign and its lord.',
      'Elect the year-lord from the five office-holders.',
      'Judge the sixteen tājika yogas with exact orbs (ithāsāla applying, īsarāpha separating, kambūla with the Moon…).',
      'Read the sahamas for topics.',
      'Time with the mudda daśā inside the year.',
    ],
    flags: ['Teaches a tropical zodiac with sidereal nakṣatras — a deliberate minority stance, catalogued as his documented position.'],
    verified: 'vedic-astrology.net product pages.',
    cite: 'Ernst Wilhelm, tājika/varṣaphala course materials (Kala Occult Publishers).',
  },
  {
    domain: 'indian', practice: 'Tājika (varṣaphala)', name: 'K. S. Charak', years: 'contemporary',
    tier: 'respected', school: 'Delhi; practicing surgeon (M.S.); Uma Publications; editor, Vedic Astrology journal',
    line: 'A surgeon-astrologer whose Textbook of Varshaphala is the modern English manual of the Nīlakaṇṭha school.',
    works: [
      { title: 'A Textbook of Varshaphala: Vedic Technique of the Tajika or Annual Horoscopy', year: 'contemporary', publisher: 'Uma Publications' },
      { title: 'Elements of Vedic Astrology, 2 vols; Yogas in Astrology; Subtleties of Medical Astrology', publisher: 'Uma Publications' },
    ],
    methodSource: 'A Textbook of Varshaphala',
    methodSteps: [
      'Follow the Nīlakaṇṭha-school sequence: varṣa-praveśa → muntha → year-lord → the sixteen yogas → sahamas → mudda daśā.',
      'Work it through fully-delineated example charts.',
      'Apply the same disciplined case-format to his praśna and medical-astrology work.',
    ],
    verified: 'standard bibliographic record; Uma Publications imprints.',
    cite: 'K. S. Charak, A Textbook of Varshaphala (Uma Publications).',
  },
  {
    domain: 'indian', practice: 'Tājika (varṣaphala)', name: 'Martin Gansten', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice — the leading historian of tājika astrology.',
    school: 'Lund University; Sanskritist & historian of religion (PhD 2003)',
    line: 'The tājika scholar, whose critical edition of Balabhadra’s Hayanaratna is the first scholarly edition of a tājika text.',
    works: [
      { title: 'The Jewel of Annual Astrology: A Parallel Sanskrit–English Critical Edition of Balabhadra’s Hayanaratna', year: 2020, publisher: 'Brill, Sir Henry Wellcome Asian Series 19 (open access on OAPEN)' },
      { title: 'Patterns of Destiny: Hindu Nadi Astrology', year: 2003, publisher: 'Lund (the scholarly study of leaf-nāḍī practice)' },
      { title: "Primary Directions: Astrology’s Old Master Technique", year: 2009, publisher: 'The Wessex Astrologer' },
    ],
    papers: [
      { title: 'Samarasiṃha and the Early Transmission of Tājika Astrology', journal: 'Journal of South Asian Intellectual History 1.1: 79–132', year: 2018 },
      { title: 'Sahl and the Tājika Yogas: Indian Transformations of Arabic Astrology (with Ola Wikander)', journal: 'Annals of Science 68.4: 531–546', year: 2011 },
    ],
    flags: ['Scholarship, not practice: documents that tājika = Sanskritized Perso-Arabic astrology transmitted via the 13th-c. Samarasiṃha.'],
    verified: 'brill.com/display/title/57015; oapen.org; astrology.martingansten.com/books. (Corrections applied: Samarasiṃha paper JSAIH 1.1 (2018): 79–132; Sahl paper Annals of Science 68.4 (2011): 531–546.)',
    cite: 'Martin Gansten (ed./trans.), The Jewel of Annual Astrology: Balabhadra’s Hayanaratna (Brill, 2020).',
  },

  // --- MUHŪRTA -------------------------------------------------------------
  {
    domain: 'indian', practice: 'Muhūrta', name: 'Rāma Daivajña', years: 'fl. c. 1600 (Varanasi)',
    tier: 'canon', school: 'The standard muhūrta manual',
    line: 'The author of the Muhūrta Cintāmaṇi with its Pīyūṣadhārā commentary — the standard election manual.',
    works: [
      { title: 'Muhūrta Cintāmaṇi (with the Pīyūṣadhārā commentary)', year: 'c. 1600', publisher: 'trans. Girish Chand Sharma, Sagar Publications; a second Sagar trans. by S. K. Chadha (2019)' },
    ],
    methodSource: 'Muhūrta Cintāmaṇi',
    methodSteps: [
      'Fix the pañcāṅga five limbs (tithi, vāra, nakṣatra, yoga, karaṇa).',
      'Screen the 21 mahādoṣas.',
      'Check the tārābala and candrabala for the client.',
      'Fix a clean lagna with benefic support.',
      'Apply the event-specific chapters (marriage, travel, foundation-laying, upanayana).',
    ],
    verified: 'standard bibliographic record. (Correction applied: translator = Girish Chand Sharma; plus S. K. Chadha, Sagar, 2019.)',
    cite: 'Rāma Daivajña, Muhūrta Cintāmaṇi, trans. Girish Chand Sharma (Sagar Publications).',
  },

  // --- PRAŚNA --------------------------------------------------------------
  {
    domain: 'indian', practice: 'Praśna', name: 'Pṛthuyaśas', years: '7th c. (son of Varāhamihira)',
    tier: 'canon', school: 'The classical praśna source',
    line: 'The son of Varāhamihira, whose 56-verse Ṣaṭpañcāśikā is the classical praśna (horary) text.',
    works: [
      { title: 'Ṣaṭpañcāśikā (56-verse praśna classic)', year: 'c. 7th c.', publisher: 'multiple editions' },
      { title: 'Horāsāra (natal)', year: 'c. 7th c.', publisher: 'trans. R. Santhanam, Ranjan Publications' },
    ],
    verified: 'standard bibliographic record; Horāsāra ed. left specified, Ṣaṭpañcāśikā edition unpinned.',
    cite: 'Pṛthuyaśas, Ṣaṭpañcāśikā & Horāsāra (trans. R. Santhanam).',
  },
  {
    domain: 'indian', practice: 'Praśna', name: 'Deepak Bisaria', years: 'contemporary',
    tier: 'niche', school: 'Faculty, Institute of Astrology, Bharatiya Vidya Bhavan (since 1997); Delhi',
    line: 'A Bhavan-school praśna and career specialist who applies K. N. Rao’s composite method through published case studies.',
    works: [
      { title: 'R. K. Dalmia: The Visionary Industrialist (astro-biographical study)', year: 2008, publisher: 'Journal of Astrology / Saptarishis Astrology' },
      { title: 'Marriage-astrology research (Indian Marriage in Modern Urban Educated Society)', publisher: 'Saptarishis Astrology' },
    ],
    methodSource: 'The Bhavan-school composite method (K. N. Rao’s sequence)',
    methodSteps: [
      'Apply Rao’s composite sequence (rāśi promise → varga confirmation → Viṁśottarī + chara-daśā double-check → double transit).',
      'Focus it on marriage and career praśna, with published case sketches.',
    ],
    flags: ['Correction applied: the Dalmia work is an article/study (Journal of Astrology, 2008; via Saptarishis), not a standalone monograph.'],
    verified: 'clickastro.com profile; saptarishisastrology.com; journalofastrology.com.',
    cite: 'Deepak Bisaria, "R. K. Dalmia: The Visionary Industrialist" (Journal of Astrology, 2008).',
  },

  // --- NĀḌĪ ----------------------------------------------------------------
  {
    domain: 'indian', practice: 'Nāḍī', name: 'R. G. Rao', years: 'contemporary (Bangalore)',
    tier: 'niche', school: 'Nāḍī-technique systematizer (Bhṛgu Nandi style)',
    line: 'A systematizer of the Bhṛgu Nandi nāḍī technique, which reads from planet-combinations progressing by transit, largely ignoring houses.',
    works: [
      { title: 'Bhrigu Nandi Nadi', year: 'contemporary', publisher: 'Ranjan Publications' },
      { title: 'Core of Nadi Astrology', publisher: 'Ranjan Publications' },
    ],
    methodSource: 'Bhrigu Nandi Nadi',
    methodSteps: [
      'Read from planet-combinations, especially Jupiter as the jīva-kāraka.',
      'Progress the reading by transit, largely ignoring the houses.',
    ],
    flags: ['Traditional leaf-nāḍī (thumbprint → leaf-matching) is catalogued elsewhere only as a practice CLAIM, documented critically in Gansten’s Patterns of Destiny.'],
    verified: 'standard bibliographic record; Bhrigu Nandi Nadi = Ranjan confirmed; Core of Nadi Astrology imprint one glance short.',
    cite: 'R. G. Rao, Bhrigu Nandi Nadi (Ranjan Publications).',
  },

  // --- HISTORY OF JYOTIṢA (scholarship) ------------------------------------
  {
    domain: 'indian', practice: 'History of jyotiṣa (scholarship)', name: 'Audrius Beinorius', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'Vilnius University; professor of Indian studies',
    line: 'A historian of the social world of the Indian astrologer — the sources and status of the jyotiṣī.',
    works: [
      { title: '(scholarly articles — see papers)', year: 2003, publisher: '—' },
    ],
    papers: [
      { title: 'The Followers of the Stars: On the Early Sources and Historical Development of Indian Astrology', journal: 'Acta Orientalia Vilnensia, vol. 4', year: 2003 },
      { title: 'On the Social and Religious Status of an Indian Astrologer at the Royal Court', journal: 'academia.edu / ResearchGate', year: 2016 },
    ],
    flags: ['Scholarship, not practice: social history of the jyotiṣī.'],
    verified: 'en.wikipedia.org/wiki/Audrius_Beinorius; fsf.vu.lt staff page. (Correction applied: "Followers of the Stars" = Acta Orientalia Vilnensia vol. 4, 2003.)',
    cite: 'Audrius Beinorius, "The Followers of the Stars" (Acta Orientalia Vilnensia 4, 2003).',
  },
  {
    domain: 'indian', practice: 'History of jyotiṣa (scholarship)', name: 'Marko Geslani', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of South Carolina',
    line: 'A historian of the astrologer-priest’s śānti (appeasement) rites — the deep background of muhūrta and remedial practice.',
    works: [
      { title: 'Rites of the God-King: Śānti and Ritual Change in Early Hinduism', year: 2018, publisher: 'Oxford University Press (ISBN 9780190862886)' },
    ],
    papers: [
      { title: 'Garga and Early Astral Science in India (with Bill Mak, Michio Yano, Kenneth Zysk)', journal: 'History of Science in South Asia 5.1', year: 2017 },
    ],
    flags: ['Scholarship, not practice: the śānti-rite background of remedial jyotiṣa.'],
    verified: 'global.oup.com; journals.library.ualberta.ca/hssa article 21.',
    cite: 'Marko Geslani, Rites of the God-King (Oxford University Press, 2018).',
  },
  {
    domain: 'indian', practice: 'History of jyotiṣa (scholarship)', name: 'Bill M. Mak', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'Historian of Buddhist/Indian astral science',
    line: 'A historian of jyotiṣa transmission (Greek → Sanskrit → East Asia) who reopened the dating of the Greek-Indian horoscopy conduit.',
    works: [
      { title: '(scholarly articles — see papers)', year: 2013, publisher: '—' },
    ],
    papers: [
      { title: "The Date and Nature of Sphujidhvaja's Yavanajātaka Reconsidered in the Light of Some Newly Discovered Materials", journal: 'History of Science in South Asia 1: 1–20', year: 2013 },
      { title: 'Garga and Early Astral Science in India (with Geslani, Yano, Zysk)', journal: 'History of Science in South Asia 5.1', year: 2017 },
    ],
    flags: ['Scholarship, not practice: overturned Pingree’s dating of the Yavanajātaka.'],
    verified: 'journals.library.ualberta.ca/hssa; researchmap.jp/billmak.',
    cite: 'Bill M. Mak, "The Date and Nature of Sphujidhvaja’s Yavanajātaka Reconsidered" (HSSA 1, 2013).',
  },

  // --- RASAŚĀSTRA & ALCHEMY (scholarship) ----------------------------------
  {
    domain: 'indian', practice: 'Rasaśāstra & alchemy (scholarship)', name: 'Dominik Wujastyk', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of Alberta; Singhmar Chair; co-founder of HSSA',
    line: 'The reference point for the site’s rasa/alchemy wing — a Sanskrit medical & alchemical philologist.',
    works: [
      { title: 'The Roots of Ayurveda', year: 2003, publisher: 'Penguin Classics (rev. ed.)' },
    ],
    papers: [
      { title: 'An Alchemical Ghost: The Rasaratnākara by Nāgārjuna', journal: 'Ambix 31.2: 70–83', year: 1984 },
    ],
    flags: ['Scholarship, not practice: Sanskrit medical/alchemical philology.'],
    verified: 'standard bibliographic record; University of Alberta. (Correction applied: Ambix 31.2 (1984): 70–83.)',
    cite: 'Dominik Wujastyk, The Roots of Ayurveda (Penguin Classics, rev. 2003).',
  },
  {
    domain: 'indian', practice: 'Rasaśāstra & alchemy (scholarship)', name: 'Dagmar Wujastyk', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of Alberta; PI of the ERC AyurYog project (2015–2020)',
    line: 'The historian who led the AyurYog project on the entangled histories of yoga, Āyurveda and alchemy in South Asia.',
    works: [
      { title: 'Well-Mannered Medicine', year: 2012, publisher: 'Oxford University Press' },
      { title: 'AyurYog project (ERC grant 639363; ayuryog.org)', year: '2015–2020', publisher: 'University of Vienna / Alberta' },
    ],
    papers: [
      { title: 'Acts of Improvement: On the Use of Tonics and Elixirs in Sanskrit Medical and Alchemical Literature', journal: 'History of Science in South Asia 5.2: 1–36', year: 2017 },
    ],
    flags: ['Scholarship, not practice: history of rasāyana and elixirs.'],
    verified: 'ayuryog.org; cordis.europa.eu/project/id/639363; ualberta.academia.edu/DagmarWujastyk.',
    cite: 'Dagmar Wujastyk, "Acts of Improvement" (HSSA 5.2, 2017).',
  },
  {
    domain: 'indian', practice: 'Rasaśāstra & alchemy (scholarship)', name: 'Gudrun Bühnemann', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of Wisconsin–Madison; Sanskritist',
    line: 'A scholar of maṇḍala and yantra in the Hindu traditions — a backstop for the site’s yantra pages.',
    works: [
      { title: 'Mandalas and Yantras in the Hindu Traditions', year: 2003, publisher: 'Brill' },
    ],
    flags: ['Scholarship, not practice: the maṇḍala/yantra reference.'],
    verified: 'standard bibliographic record (Brill catalogue).',
    cite: 'Gudrun Bühnemann, Mandalas and Yantras in the Hindu Traditions (Brill, 2003).',
  },
  {
    domain: 'indian', practice: 'Rasaśāstra & alchemy (scholarship)', name: 'David Gordon White', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of California, Santa Barbara',
    line: 'The historian of the Siddha alchemical body — the scholarly treatment of medieval Indian mercury-alchemy behind the rasa wing.',
    works: [
      { title: 'The Alchemical Body: Siddha Traditions in Medieval India', year: 1996, publisher: 'University of Chicago Press' },
    ],
    flags: ['Scholarship, not practice: the history of rasa/siddha alchemy.'],
    verified: 'standard bibliographic record (University of Chicago Press catalogue).',
    cite: 'David Gordon White, The Alchemical Body (University of Chicago Press, 1996).',
  },

  // --- YOGA (scholarship) --------------------------------------------------
  {
    domain: 'indian', practice: 'Yoga (scholarship)', name: 'James Mallinson & Mark Singleton', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'SOAS / Oxford; the Haṭha Yoga Project',
    line: 'The editors of Roots of Yoga, the sourcebook of translated yoga texts behind the site’s yoga wing.',
    works: [
      { title: 'Roots of Yoga', year: 2017, publisher: 'Penguin Classics' },
      { title: 'The Khecarīvidyā of Ādinātha (Mallinson)', year: 2007, publisher: 'Routledge' },
      { title: 'Yoga Body: The Origins of Modern Posture Practice (Singleton)', year: 2010, publisher: 'Oxford University Press' },
    ],
    flags: ['Scholarship, not practice: yoga textual history (the Haṭha Yoga Project context).'],
    verified: 'standard bibliographic record (Penguin/OUP/Routledge catalogues).',
    cite: 'James Mallinson & Mark Singleton, Roots of Yoga (Penguin Classics, 2017).',
  },
  {
    domain: 'indian', practice: 'Yoga (scholarship)', name: 'Jason Birch', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'SOAS; the Haṭha Yoga Project',
    line: 'A philologist of the haṭha corpus, best known for tracing what haṭha meant in early haṭhayoga.',
    works: [
      { title: '(scholarly articles — see papers)', year: 2011, publisher: '—' },
    ],
    papers: [
      { title: 'The Meaning of haṭha in Early Haṭhayoga', journal: 'Journal of the American Oriental Society 131.4: 527–554', year: 2011 },
    ],
    flags: ['Scholarship, not practice: haṭha-corpus philology.'],
    verified: 'ora.ox.ac.uk; philpapers.org/rec/BIRTMO-12.',
    cite: 'Jason Birch, "The Meaning of haṭha in Early Haṭhayoga" (JAOS 131.4, 2011).',
  },
  {
    domain: 'indian', practice: 'Yoga (scholarship)', name: 'Philipp A. Maas', years: 'contemporary',
    tier: 'academic', tierNote: 'Scholarship, not practice.',
    school: 'University of Leipzig',
    line: 'The editor whose critical work argues the Yoga Sūtra and its Bhāṣya form one authored Pātañjalayogaśāstra — anchoring the site’s Yoga Sūtras pages.',
    works: [
      { title: 'Samādhipāda: Das erste Kapitel des Pātañjalayogaśāstra … kritisch ediert', year: 2006, publisher: 'Aachen: Shaker' },
    ],
    papers: [
      { title: 'A Concise Historiography of Classical Yoga Philosophy (in E. Franco, ed., Periodization and Historiography of Indian Philosophy, pp. 53–90)', journal: 'Vienna: Sammlung de Nobili', year: 2013 },
    ],
    flags: ['Scholarship, not practice: the Yoga Sūtra text-history.'],
    verified: 'philpapers.org/rec/MAAACH; modernyogaresearch.org profile.',
    cite: 'Philipp A. Maas, "A Concise Historiography of Classical Yoga Philosophy" (2013).',
  },

  // ==========================================================================
  //  DIVINATION & ESOTERIC SYSTEMS
  //  practices: Tarot · Geomancy · I Ching · Runes · Kabbalah · Alchemy ·
  //  Jung & divination. Each practice pairs a HISTORY shelf (academic) with a
  //  PRACTICE shelf; cautionary exhibits of invented systems are flagged.
  // ==========================================================================

  // --- TAROT : canon -------------------------------------------------------
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Arthur Edward Waite', years: '1857–1942',
    tier: 'canon', school: 'Occult tarot (with historical pretensions); the Waite–Smith deck',
    line: 'The designer of the Waite–Smith deck, whose Pictorial Key gave the modern default its "Ancient Celtic" spread.',
    works: [
      { title: 'The Pictorial Key to the Tarot', year: 1911, publisher: 'London: Rider (full text on sacred-texts.com)' },
      { title: 'The Waite–Smith deck (with artist Pamela Colman Smith)', year: 1909, publisher: 'Rider' },
    ],
    methodSource: 'The Pictorial Key to the Tarot, Part III ("An Ancient Celtic Method of Divination")',
    methodSteps: [
      'Choose a Significator card for the querent; the querent shuffles while concentrating on the question.',
      'Lay card 1 on the Significator — "this covers him" (the atmosphere).',
      'Lay card 2 crosswise — "this crosses him" (the obstacle).',
      'Lay card 3 above — "this crowns him" (the aim/ideal); card 4 below — "this is beneath him" (the foundation).',
      'Lay card 5 behind (what is passing) and card 6 before (what is coming).',
      'Lay cards 7–10 in a vertical line: himself, his house/environment, his hopes and fears, and "what will come" (the outcome).',
      'Read the outcome card in light of all the others; if ambiguous, repeat using the outcome card as a new Significator.',
    ],
    flags: ['Waite claimed an ancient pedigree that Dummett showed is an 18th–19th-c. occult construction; his method is catalogued as he taught it, with Dummett cited for the corrective history.'],
    verified: 'sacred-texts.com/tarot/pkt (exact phrases "This covers him"/"This crosses him" confirmed); standard record.',
    cite: 'A. E. Waite, The Pictorial Key to the Tarot (Rider, 1911).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Pamela Colman Smith', years: '1878–1951',
    tier: 'canon', school: 'Illustrator of the 1909 Waite–Smith deck',
    line: 'The artist whose pictorial minor arcana made the Waite–Smith deck the modern default; she left no method text of her own.',
    works: [
      { title: 'The 1909 Waite–Smith deck (illustrator)', year: 1909, publisher: 'Rider' },
    ],
    verified: 'Kaplan et al., Pamela Colman Smith: The Untold Story (U.S. Games, 2018).',
    cite: 'Pamela Colman Smith, illustrator, the Waite–Smith Tarot (Rider, 1909).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Aleister Crowley', years: '1875–1947',
    tier: 'canon', school: 'Thelemic; the Thoth deck',
    line: 'The author of The Book of Thoth and 777, whose Thoth deck reads by the Golden Dawn "Opening of the Key".',
    works: [
      { title: 'The Book of Thoth (with the Thoth deck painted by Lady Frieda Harris, 1938–43)', year: 1944, publisher: 'The Equinox III:5 (200 signed copies)' },
      { title: '777', year: 1909, publisher: 'correspondence tables' },
    ],
    flags: ['Thelemic religious context — flagged plainly. Uses the Golden Dawn "Opening of the Key".'],
    verified: 'en.wikipedia.org/wiki/The_Book_of_Thoth_(Crowley); standard record.',
    cite: 'Aleister Crowley, The Book of Thoth (The Equinox III:5, 1944).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'The Golden Dawn corpus (Book T; Israel Regardie, ed.)', years: '1888–1940',
    tier: 'canon', school: 'Hermetic Order of the Golden Dawn; the order’s tarot papers',
    line: 'The order’s tarot papers (Book T), documented by Regardie, source of the five-operation "Opening of the Key".',
    works: [
      { title: 'The Golden Dawn (contains Book T)', year: 1937, publisher: 'ed. Israel Regardie, Aries Press (4 vols, 1937–40; 6th ed. Llewellyn)' },
    ],
    methodSource: 'Book T — "Opening of the Key" (as documented by Regardie, described historically)',
    methodSteps: [
      'First Operation: shuffle, cut into four IHVH piles, find the Significator’s pile, and read the "horseshoe" of cards around it by counting and pairing.',
      'Second Operation: deal into the 12 astrological houses and read the Significator’s house.',
      'Third Operation: deal into the 12 signs.',
      'Fourth Operation: deal the 36 decans.',
      'Fifth Operation: deal onto the Tree of Life’s 10 sephiroth — each stage refining the previous answer.',
    ],
    verified: 'archive.org/details/IsraelRegardie-thegoldenDawn-vol1-1937; independent sources confirm the five-operation structure.',
    cite: 'Israel Regardie (ed.), The Golden Dawn (Aries Press, 1937–40) — Book T.',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Etteilla (Jean-Baptiste Alliette)', years: '1738–1791',
    tier: 'canon', school: 'The first professional cartomancer',
    line: 'The first professional cartomancer, who designed the first deck made specifically for divination — and launched the "Egyptian Book of Thoth" founding fiction.',
    works: [
      { title: 'Manière de se récréer avec le jeu de cartes nommées tarots', year: '1783–85', publisher: 'Paris (four cahiers); the "Grand Etteilla" deck' },
    ],
    flags: ['His "ancient Egyptian Book of Thoth" claim is the founding fiction of occult tarot — catalogued as such, per Dummett/Decker/Depaulis.'],
    verified: 'gallica.bnf.fr; Wellcome & Morgan Library copies; en.wikipedia.org/wiki/Etteilla.',
    cite: 'Etteilla, Manière de se récréer avec le jeu de cartes nommées tarots (Paris, 1783–85).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Papus (Gérard Encausse)', years: '1865–1916',
    tier: 'canon', school: 'Kabbalistic-Tetragrammaton tarot theory',
    line: 'The author of Le Tarot des Bohémiens, whose Kabbalistic "Gypsy/Egyptian origin" thesis is historically false but doctrinally influential.',
    works: [
      { title: 'Le Tarot des Bohémiens', year: 1889, publisher: 'Paris' },
      { title: 'The Tarot of the Bohemians (English, trans. A. P. Morton)', year: 1892, publisher: 'Chapman and Hall, London' },
    ],
    flags: ['The "Gypsy/Egyptian origin" thesis is historically false (per Dummett) — catalogued as influential doctrine, not history.'],
    verified: 'archive.org/details/tarotofbohemians00papu; sacred-texts.com/tarot/tob.',
    cite: 'Papus, Le Tarot des Bohémiens (Paris, 1889).',
  },

  // --- TAROT : respected ---------------------------------------------------
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Rachel Pollack', years: '1945–2023',
    tier: 'respected', school: 'Literate, psychological tarot',
    line: 'The author of Seventy-Eight Degrees of Wisdom, who reads the spread’s pictures and patterns as a psychological mirror, not a fixed prediction.',
    works: [
      { title: 'Seventy-Eight Degrees of Wisdom: A Tarot Journey to Self-Awareness', year: 1980, publisher: '2 vols 1980/1983; single-vol revisions; new Weiser ed. 2019' },
      { title: 'Tarot Wisdom: Spiritual Teachings and Deeper Meanings', year: 2008, publisher: 'Llewellyn' },
    ],
    methodSource: 'Seventy-Eight Degrees of Wisdom',
    methodSteps: [
      'Formulate an open question — "what do I need to understand about X", not yes/no.',
      'Shuffle while holding the question, then lay a spread (she teaches the Celtic Cross re-read, plus small custom spreads).',
      'Before consulting book meanings, look at the pictures — describe what is literally happening in each image.',
      'Read each card through its position.',
      'Look for patterns across the spread: repeated numbers, dominant suits, the majors-vs-minors ratio.',
      'Synthesize into a single narrative answer, treated as a psychological mirror.',
    ],
    verified: 'redwheelweiser.com; AbeBooks. (Correction applied: the 2019 Weiser third edition subtitle is "A Tarot Journey to Self-Awareness".)',
    cite: 'Rachel Pollack, Seventy-Eight Degrees of Wisdom (1980; Weiser 3rd ed. 2019).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Mary K. Greer', years: 'contemporary',
    tier: 'respected', school: 'Self-reading; feminist-therapeutic tarot',
    line: 'The author of 21 Ways to Read a Tarot Card, whose method runs a single card through twenty-one successive operations.',
    works: [
      { title: 'Tarot for Your Self: A Workbook for Personal Transformation', year: 1984, publisher: 'Newcastle (rev. eds.)' },
      { title: '21 Ways to Read a Tarot Card', year: 2006, publisher: 'Llewellyn' },
      { title: "Mary K. Greer's Tarot Blog", year: 'ongoing', publisher: 'marykgreer.com' },
    ],
    methodSource: '21 Ways to Read a Tarot Card',
    methodSteps: [
      '1. Name — name the card.',
      '2. Description — describe the image objectively.',
      '3. Emotion — state the emotion it evokes.',
      '4. Story — tell the picture’s story.',
      '5. Number — consider its number.',
      '6. Mode / Suit / Element — consider its mode, suit and element.',
      '7. Synthesis — synthesize the foundational facts so far.',
      '8. Metaphor — turn the description into a metaphor ("this is like…").',
      '9. Query & Snapshots — query the card and take snapshot answers.',
      '10. Meanings — consult the book meanings.',
      '11. Range — establish the range from positive to negative.',
      '12. Modification — modify by the elemental dignities of neighboring cards.',
      '13. Symbols — explore the individual symbols.',
      '14. Dignity & Theme — read its dignity and theme.',
      '15. Dialogs — dialogue with a figure in the card.',
      '16. Drawing — sketch the card.',
      '17. Embodiment — embody the posture of a figure.',
      '18. Imagination — enter the card through active imagination.',
      '19. Myth & Archetypes — find the myth and archetype.',
      '20. Deck Comparison — compare versions of the card across decks.',
      '21. The Possible Self — synthesize into the Possible Self, a final statement and an action.',
    ],
    verified: 'marykgreer.com/2009/09/06/finding-meaning-21-ways-to-read-a-tarot-card; Llewellyn 2006. (Correction applied: her REAL published step names — "Synthesis" is step 7; "Dignity & Theme" is 14; "The Possible Self" is 21 — replacing the earlier condensed paraphrase.)',
    cite: 'Mary K. Greer, 21 Ways to Read a Tarot Card (Llewellyn, 2006).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Robert M. Place', years: 'contemporary',
    tier: 'respected', school: 'Deck creator + serious historian',
    line: 'A deck creator and historian who grounds tarot allegory in Neoplatonic ascent and reads a three-card linear narrative.',
    works: [
      { title: 'The Tarot: History, Symbolism, and Divination', year: 2005, publisher: 'TarcherPenguin (history aligned with Dummett’s findings)' },
      { title: 'The Alchemical Tarot (with Rosemary Ellen Guiley)', year: 1995, publisher: 'Thorsons / HarperCollins (later editions self-published)' },
    ],
    methodSource: 'The Tarot: History, Symbolism, and Divination',
    methodSteps: [
      'State the question.',
      'Draw three cards left to right.',
      'Read them as one continuous picture/sentence (beginning-middle-end or body-soul-spirit), letting the figures’ gazes and gestures connect the cards.',
      'Treat the emergent story as the answer — grounded in Neoplatonic ascent, not a fake Egyptian history.',
    ],
    flags: ['A practicing deck creator and diviner who lectures on tarot as a spiritual tool — belief context noted for consistency.'],
    verified: 'robertmplacetarot.com; LibraryThing/AbeBooks. (Correction applied: the 1995 first edition was Thorsons/HarperCollins.)',
    cite: 'Robert M. Place, The Tarot: History, Symbolism, and Divination (TarcherPenguin, 2005).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Camelia Elias', years: 'contemporary',
    tier: 'respected', school: 'Former professor, now full-time cartomancer; Marseille "cunning-folk" method',
    line: 'A former professor turned cartomancer whose anti-esoteric Marseille method reads only what the eyes see and answers in a sentence.',
    works: [
      { title: 'Marseille Tarot: Towards the Art of Reading', year: 2014, publisher: 'EyeCorner Press' },
      { title: 'Read Like the Devil: The Essential Course in Reading the Marseille Tarot', year: 2021, publisher: 'EyeCorner Press (Divination series)' },
    ],
    methodSource: 'Read Like the Devil / Marseille Tarot',
    methodSteps: [
      'Take a precise, concrete question.',
      'Cut/draw three Marseille cards in a line.',
      'Read ONLY what the eyes see — direction of gaze, objects, numbers, colors — with no memorized keyword lists.',
      'Make logical inferences card-to-card as one visual sentence.',
      'Deliver a direct, falsifiable answer in one or two sentences — then stop, no padding.',
    ],
    flags: ['Rhetorically "reads like the devil" but methodologically anti-esoteric (a semiotics of the image) — flagged as pedagogy.'],
    verified: 'eyecorner.press/books/marseille-tarot; eyecorner.press/catalogue/read-like-the-devil-marseille (fetched 2026-07-16).',
    cite: 'Camelia Elias, Marseille Tarot: Towards the Art of Reading (EyeCorner Press, 2014).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Stuart R. Kaplan', years: '1932–2021',
    tier: 'respected', tierNote: 'A central tarot-world figure (founder of U.S. Games Systems, publisher of the Rider–Waite–Smith deck for fifty years), catalogued as reference — not "niche".',
    school: 'Publisher-collector; U.S. Games Systems',
    line: 'The publisher of the Rider–Waite–Smith deck for fifty years and author of the standard iconographic Encyclopedia of Tarot.',
    works: [
      { title: 'The Encyclopedia of Tarot, Vols I–IV', year: 1978, publisher: 'U.S. Games Systems (1978–2005; Vol. IV with Jean Huets)' },
      { title: 'Pamela Colman Smith: The Untold Story (with M. K. Greer, E. F. O’Connor, M. B. Parsons)', year: 2018, publisher: 'U.S. Games Systems' },
    ],
    verified: 'usgamesinc.com; weiserantiquarian (4-vol set). (Correction applied: the PCS biography is co-authored with Greer, O’Connor and Parsons; tier raised from "niche" to respected/reference.)',
    cite: 'Stuart R. Kaplan, The Encyclopedia of Tarot, Vols I–IV (U.S. Games Systems, 1978–2005).',
  },

  // --- TAROT : academic (the history shelf) --------------------------------
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Michael Dummett', years: '1925–2011',
    tier: 'academic', tierNote: 'The pre-eminent historian of tarot — "niche" only in the sense of lesser-known to practitioners; on the scholarship shelf he is the anchor for the honest frame.',
    school: 'Analytical philosopher (Wykeham Professor of Logic, Oxford); the historian of tarot',
    line: 'The philosopher whose histories proved tarot was a trick-taking card game for ~350 years before any occult use — the citation that lets the site describe occult tarot honestly.',
    works: [
      { title: 'The Game of Tarot: from Ferrara to Salt Lake City (with the assistance of Sylvia Mann)', year: 1980, publisher: 'London: Duckworth' },
      { title: 'A Wicked Pack of Cards: The Origins of the Occult Tarot (with Ronald Decker & Thierry Depaulis)', year: 1996, publisher: 'Duckworth (UK) / St. Martin’s (US)' },
      { title: 'A History of the Occult Tarot 1870–1970 (with Ronald Decker)', year: 2002, publisher: 'Duckworth' },
      { title: 'The Visconti-Sforza Tarot Cards', year: 1986, publisher: 'George Braziller' },
    ],
    flags: ['Scholarship only: documents the game rules and the historiography — occult origin-claims are demonstrably 18th-century inventions.'],
    verified: 'St. Martin’s/Duckworth ISBN records; Braziller record. (Correction applied: the 1980 title page reads "with the assistance of Sylvia Mann" — she is an assistant, not full co-author.)',
    cite: 'Michael Dummett, The Game of Tarot (with the assistance of Sylvia Mann) (Duckworth, 1980).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Ronald Decker', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Former curator of antique cards at the United States Playing Card Company',
    line: 'The co-author of the two Dummett history volumes and a curator of antique playing cards.',
    works: [
      { title: 'A Wicked Pack of Cards (with Dummett & Depaulis)', year: 1996, publisher: 'Duckworth / St. Martin’s' },
      { title: 'The Esoteric Tarot', year: 2013, publisher: 'Quest Books' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'foreword reviews / Quest record. (Correction applied: curator at the United States Playing Card Company — NOT U.S. Games Systems, which is Kaplan’s firm.)',
    cite: 'Ronald Decker, The Esoteric Tarot (Quest, 2013).',
  },
  {
    domain: 'esoteric', practice: 'Tarot', name: 'Thierry Depaulis', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Card historian; The Playing-Card (IPCS)',
    line: 'A card historian and co-author of A Wicked Pack of Cards, prolific in the IPCS journal.',
    works: [
      { title: 'A Wicked Pack of Cards (with Dummett & Decker)', year: 1996, publisher: 'Duckworth / St. Martin’s' },
      { title: 'Tarot, jeu et magie (Bibliothèque nationale exhibition catalogue)', year: 1984, publisher: 'Paris (preface by Dummett; full text on Gallica)' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'gallica.bnf.fr; nla.gov.au catalog.',
    cite: 'Thierry Depaulis, Tarot, jeu et magie (Bibliothèque nationale, 1984).',
  },

  // --- GEOMANCY ------------------------------------------------------------
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'The Latin/Arabic geomantic tradition', years: '12th–17th c.',
    tier: 'canon', school: 'The historical source-texts of Western geomancy',
    line: 'The source-texts of Western geomancy, from Hugh of Santalla’s earliest Latin handbook to Cattan and Fludd.',
    works: [
      { title: 'Hugh of Santalla, Ars geomantiae (earliest Latin geomancy, from the Arabic)', year: 'c. 12th c.', publisher: 'MS tradition' },
      { title: 'Christopher Cattan, The Geomancie of Maister Christopher Cattan (trans. Francis Sparry)', year: 1591, publisher: 'London: John Wolfe' },
      { title: 'Robert Fludd, Fasciculus geomanticus', year: 1687, publisher: '"Verona" [false imprint — actually Frankfurt am Main, Zunner]; a compilation incl. Henri de Pisis' },
    ],
    methodSource: 'The traditional house-chart judgment (per Cattan / Fludd)',
    methodSteps: [
      'Cast the shield (the sixteen figures).',
      'Place the four Mothers, Daughters and Nieces (and in some authors the Witnesses/Judge) into the 12 astrological houses.',
      'Assign the querent to the 1st-house figure and the quesited to the house ruling the question.',
      'Judge "perfection" (occupation, conjunction, mutation, translation) between them.',
      'Weigh the figures’ natures and the Judge for the verdict.',
    ],
    flags: ['Correction applied: Fludd’s Fasciculus geomanticus "Verona 1687" is a false imprint — printed at Frankfurt (Zunner) — and the volume is a compilation including De Pisis.'],
    verified: 'wellcomecollection.org (Cattan/Sparry 1591); AbeBooks (Verona d.i. Frankfurt, Zunner); en.wikipedia.org/wiki/Hugh_of_Santalla.',
    cite: 'Cattan, The Geomancie (London, 1591); Fludd, Fasciculus geomanticus ("Verona" [Frankfurt], 1687).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'John Michael Greer', years: 'contemporary',
    tier: 'respected', school: 'Practicing Druid (past AODA Grand Archdruid) who writes careful history',
    line: 'The author of The Art and Practice of Geomancy, whose shield-chart method is the standard modern teaching of the art.',
    works: [
      { title: 'The Art and Practice of Geomancy', year: 2009, publisher: 'Weiser' },
      { title: 'Earth Divination, Earth Magic: A Practical Guide to Geomancy (first translation of Pietro d’Abano’s handbook)', year: 1999, publisher: 'Llewellyn' },
      { title: 'Ecosophia blog', year: 'ongoing', publisher: 'ecosophia.net' },
    ],
    methodSource: 'The Art and Practice of Geomancy',
    methodSteps: [
      'Formulate one clear question; make 16 lines of marks right-to-left without counting, in a meditative state.',
      'Count each line — odd gives one point, even gives two; each group of four lines yields one figure: the four MOTHERS.',
      'Derive the four DAUGHTERS by transposition (heads of the Mothers → Daughter 1, necks → 2, bodies → 3, feet → 4).',
      'Derive the four NIECES by adding adjacent pairs (Mothers, then Daughters).',
      'Add the Nieces pairwise for the two WITNESSES, then add the Witnesses for the JUDGE.',
      'Read the Judge for the overall answer, the Right Witness as querent/past, the Left Witness as quesited/outcome.',
      'If unclear, cast a RECONCILER (Judge + First Mother).',
      'For detail, transfer the figures to the 12-house chart and judge perfection (occupation, conjunction, mutation, translation); denial if none.',
    ],
    flags: ['Greer is a practicing Druid (past Grand Archdruid, AODA) — belief context flagged.'],
    verified: 'weiser record; search-confirmed subtitle for Earth Divination, Earth Magic.',
    cite: 'John Michael Greer, The Art and Practice of Geomancy (Weiser, 2009).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Stephen Skinner', years: 'contemporary',
    tier: 'respected', school: 'Historian-practitioner; the art’s Arabic-to-Latin transmission',
    line: 'The author of Terrestrial Astrology, the standard history of geomancy’s Arabic-to-Latin transmission (khaṭṭ al-raml sand-cutting origins).',
    works: [
      { title: 'Terrestrial Astrology: Divination by Geomancy', year: 1980, publisher: 'Routledge & Kegan Paul' },
      { title: 'Geomancy in Theory and Practice (expanded reissue)', year: 2011, publisher: 'Golden Hoard' },
    ],
    methodSource: 'The same shield/house procedure from the historical sources',
    methodSteps: [
      'Teach the traditional shield-and-house procedure from the historical sources.',
      'Frame it with the transmission history — the khaṭṭ al-raml sand-cutting origins.',
    ],
    flags: ['Historian-practitioner (both roles).'],
    verified: 'Cambridge Core review (Medical History); AbeBooks (Golden Hoard 2011).',
    cite: 'Stephen Skinner, Terrestrial Astrology: Divination by Geomancy (RKP, 1980).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Dr. Alexander Cummins', years: 'contemporary',
    tier: 'respected', school: 'PhD historian (Bristol) + practicing sorcerer',
    line: 'A PhD historian of early-modern magic who teaches traditional 16th–17th-c. English geomancy in course form.',
    works: [
      { title: 'The Starry Rubric: Seventeenth-Century English Astrology and Magic', year: 2012, publisher: 'Hadean Press (ISBN 9781907881213)' },
      { title: 'A Book of the Magi (folk necromancy / Magi devotion — NOT geomancy)', year: 2018, publisher: 'Revelore Press (Folk Necromancy in Transmission, vol. 3)' },
      { title: 'Geomancy teaching: courses, lectures & papers', year: 'ongoing', publisher: 'alexandercummins.com' },
    ],
    methodSource: 'Traditional 16th–17th-c. English geomancy (Cattan/Heydon lineage), taught in course form',
    methodSteps: [
      'Teach the traditional Cattan/Heydon-lineage English geomancy in course form (shield + house judgment).',
    ],
    flags: [
      'Dual identity flagged: academic historian AND practitioner of folk necromancy.',
      'Correction applied: he has NO geomancy monograph — his geomancy output is courses/lectures; do not cite an invented book. (A Book of the Magi is folk necromancy, not geomancy.)',
    ],
    verified: 'alexandercummins.com; revelore.press/product/a-book-of-the-magi (fetched 2026-07-16); Amazon (Starry Rubric).',
    cite: 'Alexander Cummins, The Starry Rubric (Hadean Press, 2012); geomancy courses at alexandercummins.com.',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Sam Block ("polyphanes", The Digital Ambler)', years: 'contemporary',
    tier: 'niche', school: 'Hermetic magician & Lukumí priest; the largest open geomancy resource online',
    line: 'The author of The Digital Ambler — the largest open geomancy resource online — plus two self-published geomantic works.',
    works: [
      { title: 'The Digital Ambler blog (incl. "An Overview of Geomantic Literature" and a full geomancy course)', year: 'ongoing', publisher: 'digitalambler.com' },
      { title: 'Secreti Geomantici (geomantic ritual, prayers & magic)', year: 2018, publisher: 'self-published PDF ebook' },
      { title: 'Lectura Geomantiae (translation of a 15th-c. Latin geomantic manuscript)', publisher: 'self-published' },
    ],
    methodSource: 'The Digital Ambler geomancy course',
    methodSteps: [
      'Follow and document the full traditional shield + house procedure with extensive worked examples.',
      'Add the devotional/magical use of the 16 figures (his innovation).',
    ],
    flags: ['Openly a practitioner-priest (Hermetic magician, Lukumí priest); his textual scholarship (translations) is nonetheless real and checkable. Works are self-published ebooks.'],
    verified: 'digitalambler.com/books; digitalambler.com (Secreti Geomantici post, 2018).',
    cite: 'Sam Block, Secreti Geomantici (self-published, 2018); The Digital Ambler (digitalambler.com).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Eric Purdue', years: 'contemporary',
    tier: 'niche', school: 'Translator-practitioner',
    line: 'The translator of the first complete new English Agrippa in over 350 years — the modern check on the error-ridden 1651 text the occult revival relied on.',
    works: [
      { title: 'Heinrich Cornelius Agrippa, Three Books of Occult Philosophy (trans.)', year: 2021, publisher: 'Inner Traditions (3 vols; from the 1533 Latin; ISBN 9781644114162)' },
    ],
    flags: ['Cited as the modern check on the error-ridden 1651 English Agrippa (relevant to the site’s Agrippa citations: Behenian stars, dignities, magic squares).'],
    verified: 'innertraditions.com; simonandschuster.com (published 23 Nov 2021).',
    cite: 'Agrippa, Three Books of Occult Philosophy, trans. Eric Purdue (Inner Traditions, 2021).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Les Cross', years: 'contemporary',
    tier: 'niche', tierNote: 'Cautionary exhibit — a contemporary INVENTION, not tradition; useful precisely as an example of how new systems are created and marketed.',
    school: 'Modern innovator (geomancy + astrology + gemstones)',
    line: 'The author of Astrogem Geomantic Divination, a self-published modern hybrid of geomancy, astrology and gemstones ("geomes").',
    works: [
      { title: 'Astrogem Geomantic Divination', year: 2014, publisher: 'Lulu (ISBN 9781291864700)' },
    ],
    flags: ['Cautionary exhibit: a modern invention, explicitly not tradition (the promotional "most ground-breaking advance in geomancy since the Renaissance" blurb is Richard Webster’s foreword).'],
    verified: 'lulu.com; Amazon; digitalambler.com review (treats it as a modern invention).',
    cite: 'Les Cross, Astrogem Geomantic Divination (Lulu, 2014).',
  },
  {
    domain: 'esoteric', practice: 'Geomancy', name: 'Thérèse Charmasson', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'The standard academic monograph on medieval Western geomancy',
    line: 'The author of the standard academic study of geomancy in the medieval West, based on 155 manuscripts.',
    works: [
      { title: 'Recherches sur une technique divinatoire: la géomancie dans l’Occident médiéval', year: 1980, publisher: 'Geneva: Droz / Paris: Champion' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'persee.fr review; droz.org catalogue.',
    cite: 'Thérèse Charmasson, La géomancie dans l’Occident médiéval (Droz/Champion, 1980).',
  },

  // --- I CHING -------------------------------------------------------------
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Richard Wilhelm / Cary F. Baynes', years: '1873–1930 / 1883–1977',
    tier: 'canon', school: 'The 20th-century Western I Ching (with Jung’s foreword)',
    line: 'The translators of the 20th century’s standard Western I Ching, with C. G. Jung’s foreword — the coin and yarrow oracles.',
    works: [
      { title: 'The I Ching or Book of Changes', year: 1950, publisher: 'trans. Cary F. Baynes; Bollingen Series XIX, Pantheon Books (New York, 2 vols); later Princeton University Press' },
    ],
    methodSource: 'The consultation appendix',
    methodSteps: [
      'COIN ORACLE: frame the question; throw three coins six times (inscribed side = 3, other = 2); totals 6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing).',
      'Build the hexagram bottom line first; read the Judgment and Image.',
      'Read only the changing lines’ texts, then transform the changing lines into their opposites to obtain the second hexagram — the situation’s tendency.',
      'YARROW-STALK ORACLE: from 50 stalks (one set aside), three countings-through per line (divide the heap, remove remainders of 4), producing 6/7/8/9 with the traditional unequal probabilities; build six lines bottom-up.',
    ],
    verified: 'AbeBooks first-edition record; press.princeton.edu Bollingen Series. (Correction applied: 1950 first English edition = Pantheon, Bollingen XIX; Princeton UP later.)',
    cite: 'Wilhelm / Baynes, The I Ching or Book of Changes (Bollingen XIX, Pantheon, 1950).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'James Legge', years: '1815–1897',
    tier: 'canon', school: 'The Victorian scholarly translation',
    line: 'The Victorian scholar whose Sacred Books of the East translation was made explicitly without belief in the oracle — useful for framing.',
    works: [
      { title: 'The Yî King (Sacred Books of the East, vol. XVI)', year: 1882, publisher: 'Oxford (2nd ed. 1899; full text on sacred-texts.com)' },
    ],
    flags: ['Scholarship: Legge’s own preface records his skepticism toward the oracle.'],
    verified: 'standard record; sacred-texts.com SBE16.',
    cite: 'James Legge, The Yî King (Sacred Books of the East XVI, Oxford, 1882).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Stephen Karcher', years: 'contemporary',
    tier: 'respected', school: 'Divination-forward; the Eranos lineage',
    line: 'A divination-forward translator (Eranos lineage) who reads the Yijing as a living oracle of mythic images.',
    works: [
      { title: 'I Ching: The Classic Chinese Oracle of Change (with Rudolf Ritsema)', year: 1994, publisher: 'Element / Eranos' },
      { title: 'Total I Ching: Myths for Change', year: 2003, publisher: 'Time Warner' },
      { title: 'How to Use the I Ching', year: 1997, publisher: 'Element' },
    ],
    methodSource: 'How to Use the I Ching / Total I Ching',
    methodSteps: [
      'Turn the trouble into a question of the form "What about doing X?" or "How do I approach X?" — never yes/no.',
      'Quiet the mind and hold the question as an image; cast three coins six times (or the 16-token method), noting 6/7/8/9.',
      'Build the Primary Hexagram bottom-up.',
      'Enter the hexagram’s "mythic field" — read its core image words as dream-like symbols, not commands.',
      'Read each changing line as a specific voice within the situation.',
      'Form the Relating/Outcome Hexagram from the transformed lines — the direction the situation flows.',
      'Return to the question and state what the images suggest doing or not doing.',
    ],
    flags: ['Treats the Yijing as a living oracle and "psychic ecology" — belief-based practice, contrasted with Rutt/Shaughnessy.'],
    verified: 'Amazon (Element/Eranos); biroco.com/yijing/ritsema; archive.org.',
    cite: 'Ritsema & Karcher, I Ching: The Classic Chinese Oracle of Change (Element, 1994).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Richard Rutt', years: '1925–2011',
    tier: 'academic', tierNote: 'History shelf — the I Ching equivalent of Dummett, cited for what the text historically was.',
    school: 'Anglican bishop and sinologist',
    line: 'The translator of the Zhouyi as a Bronze Age divination document, stripped of later Confucian and Jungian accretions.',
    works: [
      { title: 'The Book of Changes (Zhouyi): A Bronze Age Document', year: 1996, publisher: 'Curzon Press (later Routledge/Durham East Asia Series)' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'biroco.com/yijing/ruttzhouyi; archive.org; biblio.com (9780700704675).',
    cite: 'Richard Rutt, The Book of Changes (Zhouyi): A Bronze Age Document (Curzon, 1996).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Edward L. Shaughnessy', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Creel Distinguished Service Professor of Early China, University of Chicago',
    line: 'The scholar of the excavated I Ching manuscripts — the Mawangdui silk and the recently-recovered bamboo texts.',
    works: [
      { title: 'I Ching: The Classic of Changes (the Mawangdui manuscript)', year: 1996, publisher: 'Ballantine' },
      { title: 'Unearthing the Changes: Recently Discovered Manuscripts of the Yi Jing', year: 2014, publisher: 'Columbia University Press' },
      { title: 'The Origin and Early Development of the Zhou Changes', year: 2022, publisher: 'Brill (Prognostication in History 9)' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'brill.com/display/title/61350; ealc.uchicago.edu.',
    cite: 'Edward L. Shaughnessy, Unearthing the Changes (Columbia University Press, 2014).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Margaret J. Pearson', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Historian; Skidmore College',
    line: 'A historian whose translation reads the Book of Changes in its Bronze Age context and de-genders later commentary.',
    works: [
      { title: 'The Original I Ching: An Authentic Translation of the Book of Changes', year: 2011, publisher: 'Tuttle' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'Cambridge Core (Early China review); Amazon.',
    cite: 'Margaret J. Pearson, The Original I Ching (Tuttle, 2011).',
  },
  {
    domain: 'esoteric', practice: 'I Ching', name: 'Richard J. Smith', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Rice University',
    line: 'The historian of the Yijing’s reception, including its Western and Jungian afterlife.',
    works: [
      { title: 'Fathoming the Cosmos and Ordering the World: The Yijing and Its Evolution in China', year: 2008, publisher: 'University of Virginia Press' },
      { title: 'The I Ching: A Biography', year: 2012, publisher: 'Princeton University Press' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'upress.virginia.edu; press.princeton.edu.',
    cite: 'Richard J. Smith, The I Ching: A Biography (Princeton University Press, 2012).',
  },

  // --- RUNES ---------------------------------------------------------------
  {
    domain: 'esoteric', practice: 'Runes', name: 'The primary rune sources', years: 'c. 98 CE – 1915',
    tier: 'canon', school: 'The rune poems and Tacitus',
    line: 'The thin historical base of all rune divination: the three Rune Poems and Tacitus’s account of Germanic lot-casting.',
    works: [
      { title: 'The three Rune Poems (Old English in Bruce Dickins, Runic and Heroic Poems of the Old Teutonic Peoples)', year: 1915, publisher: 'Cambridge; plus the Norwegian & Icelandic poems' },
      { title: 'Tacitus, Germania, ch. 10 (the lot-casting passage)', year: 'c. 98 CE', publisher: 'Loeb / Perseus' },
    ],
    methodSource: 'Tacitus, Germania ch. 10 (catalogued with caveat)',
    methodSteps: [
      'Cut a branch of a fruit/nut-bearing tree into slips; mark the slips with signs (notae).',
      'Scatter them on a white cloth.',
      'The priest (public matters) or the father of the family (private) prays, looks to the sky, and draws three slips one at a time.',
      'Interpret according to the signs.',
    ],
    flags: ['Required caveat: Tacitus’s "notae" are NOT provably runes, and no ancient source gives rune-reading meanings — every modern rune-divination system is a 20th-century construction on this thin base (cite Page and Plowright).'],
    verified: 'standard record (Cambridge UP 1915); Plowright’s Rune Primer.',
    cite: 'Tacitus, Germania 10; the Rune Poems (Dickins, 1915).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'R. I. Page', years: '1924–2012',
    tier: 'academic', tierNote: 'History shelf — the honest-framing anchor, famously skeptical of "imaginative runology".',
    school: 'Elrington and Bosworth Professor of Anglo-Saxon, Cambridge',
    line: 'The runologist who policed the boundary between the runic record and modern invention.',
    works: [
      { title: 'An Introduction to English Runes', year: 1973, publisher: 'Methuen (2nd ed. Boydell, 1999)' },
      { title: 'Runes (Reading the Past series)', year: 1987, publisher: 'British Museum Press' },
      { title: 'Runes and Runic Inscriptions (collected papers)', year: 1995, publisher: 'Boydell' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'runology bibliographies (raa.se; academia.edu runic-studies lists).',
    cite: 'R. I. Page, An Introduction to English Runes, 2nd ed. (Boydell, 1999).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'Klaus Düwel', years: '1935–2020',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'The standard German handbook of runology',
    line: 'The author of Runenkunde, the standard German handbook of runology.',
    works: [
      { title: 'Runenkunde (Sammlung Metzler 72)', year: 2008, publisher: 'Stuttgart: Metzler (4th rev. ed.; 5th ed. 2023 with Robert Nedoma)' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'runology bibliography search results (Metzler editions).',
    cite: 'Klaus Düwel, Runenkunde, 4th ed. (Metzler, 2008).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'Edred Thorsson (Stephen E. Flowers, PhD)', years: 'contemporary',
    tier: 'respected', school: 'Founder of the Rune-Gild; deep Ásatrú/esoteric context; PhD, UT Austin',
    line: 'The founder of the Rune-Gild, whose rune-casting system openly reconstructs (and invents) on the poem-lore.',
    works: [
      { title: 'Futhark: A Handbook of Rune Magic', year: 1984, publisher: 'Weiser' },
      { title: 'Runelore: A Handbook of Esoteric Runology', year: 1987, publisher: 'Weiser' },
      { title: 'At the Well of Wyrd (reissued as Runecaster’s Handbook: The Well of Wyrd, 1999)', year: 1988, publisher: 'Weiser' },
      { title: 'Runes and Magic (as Stephen E. Flowers; his UT Austin dissertation)', year: 1986, publisher: 'Peter Lang' },
    ],
    methodSource: 'At the Well of Wyrd (catalogued as a modern construction)',
    methodSteps: [
      'Cut and mark 24 Elder Futhark lots (or use staves); lay a white cloth and orient the working.',
      'Frame the question to the Norns / wyrd.',
      'Cast the lots onto the cloth.',
      'Select a fixed number (e.g. three, or his nine-lot "Yggdrasill" layouts) with eyes averted.',
      'Read each stave’s lore-meaning (from the rune poems as he glosses them) in its position.',
      'Synthesize as a reading of wyrd (conditioning tendencies), not fixed fate.',
    ],
    flags: ['His system explicitly reconstructs/invents; deep Ásatrú/esoteric context. Plowright and Page document where it exceeds the evidence — present all three together.'],
    verified: 'Amazon (At the Well of Wyrd; Runecaster’s Handbook 1999); en.wikipedia.org/wiki/Stephen_E._Flowers.',
    cite: 'Edred Thorsson, At the Well of Wyrd (Weiser, 1988).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'Diana L. Paxson', years: 'contemporary',
    tier: 'respected', school: 'Heathen (Troth); study-then-divine method',
    line: 'The author of Taking Up the Runes, whose method internalizes the poem-lore over months of paired study before divining.',
    works: [
      { title: 'Taking Up the Runes: A Complete Guide to Using Runes in Spells, Rituals, Divination, and Magic', year: 2005, publisher: 'Weiser (Weiser Classics reissue 2021 adds a divination chapter)' },
    ],
    methodSource: 'Taking Up the Runes',
    methodSteps: [
      'Study the runes in paired order over months — one pair per session.',
      'For each: read the three rune poems’ stanzas, journal associations, chant the rune’s name (galdr), meditate on the shape.',
      'Make or consecrate your own rune set.',
      'To divine: ground, state the question, draw three runes (e.g. situation / obstacle / outcome), read via the poem-lore you internalized.',
      'Record and review outcomes in the journal.',
    ],
    flags: ['Openly religious (Heathen/Troth); her sourcing of the poems is honest about the gaps.'],
    verified: 'redwheelweiser.com; archive.org.',
    cite: 'Diana L. Paxson, Taking Up the Runes (Weiser, 2005).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'Sweyn Plowright', years: 'contemporary',
    tier: 'niche', tierNote: 'Honest-framing anchor on the practitioner side — a practitioner who polices his own tradition’s myths.',
    school: 'Down-to-earth runic scholarship',
    line: 'The author of The Rune Primer, who traces popular rune "meanings" back to their recent inventors.',
    works: [
      { title: 'The Rune Primer: A Down-to-Earth Guide to the Runes', year: 2006, publisher: 'Lulu (ISBN 9781847282460)' },
    ],
    methodSource: 'The Rune Primer',
    methodSteps: [
      'Give plain-English translations of the three rune poems.',
      'Trace popular rune "meanings" (e.g. Ralph Blum’s 1982 blank rune, "Odinic" correspondences) to their recent inventors.',
      'Review Thorsson, Blum et al. for accuracy against the evidence.',
    ],
    flags: ['Ideal for this site: a practitioner who polices his tradition’s myths. Companion cautionary exhibit: Ralph Blum, The Book of Runes (St. Martin’s, 1982) — catalogued ONLY as the famous example of a wholly invented system (the blank rune).'],
    verified: 'Amazon; northvegr.org review; archive.org.',
    cite: 'Sweyn Plowright, The Rune Primer (Lulu, 2006).',
  },
  {
    domain: 'esoteric', practice: 'Runes', name: 'Ralph Blum', years: '1932–2016',
    tier: 'niche', tierNote: 'Cautionary exhibit only — a wholly invented divination system, catalogued to show how such systems are made (per Plowright/Page).',
    school: 'The invented "blank rune" system',
    line: 'The author of The Book of Runes — catalogued only as the famous example of an invented rune system (the blank rune).',
    works: [
      { title: 'The Book of Runes', year: 1982, publisher: "St. Martin's Press" },
    ],
    flags: ['Cautionary exhibit: a 20th-century invention (the blank rune and its "Odinic" correspondences have no historical basis) — included as an exhibit of system-invention, not as tradition.'],
    verified: 'standard record; Plowright’s Rune Primer and Page document the invention.',
    cite: 'Ralph Blum, The Book of Runes (St. Martin’s, 1982) — a cautionary exhibit.',
  },

  // --- KABBALAH ------------------------------------------------------------
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'The Golden Dawn corpus & Israel Regardie', years: '1887–1938',
    tier: 'canon', school: 'Hermetic Qabalah (a Renaissance-to-Victorian synthesis, distinct from Jewish Kabbalah)',
    line: 'The Hermetic-Qabalah source shelf — Regardie, Westcott, Crowley and Fortune — of Tree-of-Life correspondence work.',
    works: [
      { title: 'Israel Regardie, The Golden Dawn', year: 1937, publisher: 'Aries Press (1937–40; 6th ed. Llewellyn)' },
      { title: 'Israel Regardie, A Garden of Pomegranates', year: 1932, publisher: 'Rider' },
      { title: 'Israel Regardie, The Middle Pillar', year: 1938, publisher: 'Aries Press (Chicago) — see flag' },
      { title: 'Dion Fortune, The Mystical Qabalah', year: 1935, publisher: 'Williams & Norgate' },
      { title: 'W. W. Westcott (trans.), Sepher Yetzirah', year: 1887, publisher: 'London' },
      { title: 'Aleister Crowley, 777', year: 1909, publisher: 'London' },
    ],
    methodSource: 'GD-style Tree work (catalogued)',
    methodSteps: [
      'Memorize the 10 sephiroth and the 22 lettered paths.',
      'Build the correspondence tables (777-style).',
      'Practice the Middle Pillar exercise (vibrating god-names at body stations).',
      'Pathwork — a guided visionary ascent, path by path, from Malkuth upward.',
    ],
    flags: [
      'Hermetic Qabalah is a Renaissance-to-Victorian Christian/occultist synthesis, historically distinct from Jewish Kabbalah — stated on the shelf label (cite Scholem and Hanegraaff).',
      'Spot-check kept flagged: The Middle Pillar’s 1938 first publisher — standard records say Aries Press (Chicago), one source says Rider (London); the year 1938 is solid either way.',
    ],
    verified: 'archive.org (The Golden Dawn vol. 1, 1937); en.wikipedia.org/wiki/Israel_Regardie; Google Books (The Mystical Qabalah).',
    cite: 'Israel Regardie, The Golden Dawn (Aries Press, 1937–40); Dion Fortune, The Mystical Qabalah (1935).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Gershom Scholem', years: '1897–1982',
    tier: 'academic', tierNote: 'History shelf — the founder of the academic field of Jewish mysticism.',
    school: 'Hebrew University; founder of the academic study of Kabbalah',
    line: 'The founder of the academic study of Jewish Kabbalah, kept visibly separate from the Hermetic-Qabalah shelf.',
    works: [
      { title: 'Major Trends in Jewish Mysticism', year: 1941, publisher: 'Schocken (from 1938 lectures)' },
      { title: 'On the Kabbalah and Its Symbolism', year: 1965, publisher: 'Schocken' },
      { title: 'Kabbalah', year: 1974, publisher: 'Keter' },
      { title: 'Sabbatai Sevi: The Mystical Messiah', year: 1973, publisher: 'Princeton / Bollingen (trans. R. J. Z. Werblowsky)' },
    ],
    flags: ['Scholarship only (Jewish-Kabbalah history shelf) — distinct from Hermetic Qabalah.'],
    verified: 'en.wikipedia.org/wiki/Major_Trends_in_Jewish_Mysticism; press.princeton.edu.',
    cite: 'Gershom Scholem, Major Trends in Jewish Mysticism (Schocken, 1941).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Moshe Idel', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Hebrew University; the great revision of Scholem',
    line: 'The author of Kabbalah: New Perspectives, the major revision of Scholem.',
    works: [
      { title: 'Kabbalah: New Perspectives', year: 1988, publisher: 'Yale University Press' },
      { title: 'Golem', year: 1990, publisher: 'SUNY Press' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'Cambridge Core (AJS Review); Yale UP catalogue.',
    cite: 'Moshe Idel, Kabbalah: New Perspectives (Yale University Press, 1988).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Arthur Green', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Hebrew College; Zohar scholarship',
    line: 'The author of A Guide to the Zohar and a Kabbalah for a contemporary readership.',
    works: [
      { title: 'A Guide to the Zohar', year: 2004, publisher: 'Stanford University Press' },
      { title: 'Ehyeh: A Kabbalah for Tomorrow', year: 2003, publisher: 'Jewish Lights' },
    ],
    flags: ['Scholarship (history shelf).'],
    verified: 'sup.org catalogue.',
    cite: 'Arthur Green, A Guide to the Zohar (Stanford University Press, 2004).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Daniel C. Matt', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'The Zohar: Pritzker Edition',
    line: 'The lead translator of the definitive annotated English Zohar (the Pritzker Edition).',
    works: [
      { title: 'The Zohar: Pritzker Edition (12 vols; Matt trans. vols 1–9, Nathan Wolski & Joel Hecker vols 10–12)', year: 2017, publisher: 'Stanford University Press (2004–2017)' },
      { title: 'The Essential Kabbalah', year: 1995, publisher: 'HarperOne' },
    ],
    flags: ['Scholarship (history shelf).'],
    verified: 'sup.org (Zohar Pritzker Edition); newbooksnetwork. (Correction applied: vols 10–12 translated by Wolski & Hecker; final vol. June 2017.)',
    cite: 'Daniel C. Matt et al., The Zohar: Pritzker Edition, 12 vols (Stanford University Press, 2004–2017).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Lon Milo DuQuette', years: 'contemporary',
    tier: 'respected', school: 'Hermetic/Thelemic; self-deprecating and honest about it',
    line: 'The author of The Chicken Qabalah, who teaches the Tree as a "universal filing cabinet" through a pseudepigraphic Rabbi.',
    works: [
      { title: 'The Chicken Qabalah of Rabbi Lamed Ben Clifford', year: 2001, publisher: 'Weiser' },
      { title: "Understanding Aleister Crowley's Thoth Tarot", year: 2003, publisher: 'Weiser' },
    ],
    methodSource: 'The Chicken Qabalah (as taught)',
    methodSteps: [
      'Learn the 22 Hebrew letters as living symbols (shape, name-meaning, number).',
      'Learn gematria basics — words sharing a number share an idea.',
      'Learn the 10 sephiroth as a diagram of emanation; trace the "flash of lightning" descent.',
      'Map the four Qabalistic worlds onto the four letters of the Tetragrammaton.',
      'Place the 22 letters on the 22 paths.',
      'Use the Tree as a universal filing cabinet: drop any tarot card, planet or experience onto its address.',
      'Pathwork / meditate station to station.',
    ],
    flags: ['Thelemic context, flagged. Correction applied: he frames the whole system through the INVENTED Rabbi Lamed Ben Clifford — a pseudepigraphic device, the foreword joking that the Rabbi is a figment of his imagination and the system a useful fiction. That framing is DESCRIBED here rather than quoted, since no verbatim "made it all up" sentence is verifiable in the text.'],
    verified: 'redwheelweiser.com; archive.org/details/chickenqabalahof00lonm (full text).',
    cite: 'Lon Milo DuQuette, The Chicken Qabalah of Rabbi Lamed Ben Clifford (Weiser, 2001).',
  },
  {
    domain: 'esoteric', practice: 'Kabbalah', name: 'Colin Low', years: 'contemporary',
    tier: 'niche', school: 'Hermetic, online-first',
    line: 'The author of the classic free internet text of Hermetic Kabbalah, a sephira-by-sephira curriculum.',
    works: [
      { title: 'Notes on Kabbalah (issued as A Depth of Beginning: Notes on Kabbalah)', year: 2001, publisher: 'digital-brilliance.com (serialized from the early 1990s)' },
      { title: 'The Hermetic Kabbalah', publisher: 'digital-brilliance.com' },
    ],
    methodSource: 'Notes on Kabbalah',
    methodSteps: [
      'Study one sephira’s symbolism, then its klippah (shadow), then its practical exercises and ritual.',
      'Study the connecting paths.',
      'Culminate in Tree-as-map-of-consciousness work.',
    ],
    flags: ['Explicitly Hermetic, not Jewish scholarship — open about the distinction.'],
    verified: 'digital-brilliance.com/kab/nok. (Correction applied: first posted to the Internet 1990–92; collected as "A Depth of Beginning", 2001.)',
    cite: 'Colin Low, A Depth of Beginning: Notes on Kabbalah (digital-brilliance.com, 2001).',
  },

  // --- ALCHEMY -------------------------------------------------------------
  {
    domain: 'esoteric', practice: 'Alchemy', name: 'The alchemical classics', years: '12th–17th c.',
    tier: 'canon', school: 'The primary source-texts of Western alchemy',
    line: 'The source-texts of Western alchemy, from the Emerald Tablet and pseudo-Geber to the great emblem books.',
    works: [
      { title: 'The Emerald Tablet (Tabula Smaragdina)', year: 'c. 8th–12th c.', publisher: 'trans. in Principe, The Secrets of Alchemy' },
      { title: 'Pseudo-Geber, Summa perfectionis (critical ed./trans. William R. Newman)', year: 1991, publisher: 'Brill' },
      { title: 'Michael Maier, Atalanta fugiens (emblems + fugues)', year: 1617, publisher: 'Oppenheim' },
      { title: 'Splendor Solis (study edition: Skinner, Prinke, Hedesan, Godwin)', year: 2019, publisher: 'Watkins' },
    ],
    verified: 'watkinspublishing.com (Splendor Solis, 2019, ISBN 9781786782052); Brill (Newman, Summa perfectionis, 1991).',
    cite: 'The Emerald Tablet; pseudo-Geber, Summa perfectionis, ed. W. R. Newman (Brill, 1991).',
  },
  {
    domain: 'esoteric', practice: 'Alchemy', name: 'Lawrence M. Principe', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf — the honest-framing anchor; his lab-replication is a genuine step-by-step method.',
    school: 'Johns Hopkins; chemist-historian',
    line: 'The historian who demolished the "alchemy was really spiritual psychology" myth and who replicates alchemical recipes in a modern lab.',
    works: [
      { title: 'The Secrets of Alchemy', year: 2013, publisher: 'University of Chicago Press' },
      { title: 'The Aspiring Adept: Robert Boyle and His Alchemical Quest', year: 1998, publisher: 'Princeton University Press' },
      { title: 'Alchemy Tried in the Fire (with William R. Newman)', year: 2002, publisher: 'University of Chicago Press' },
    ],
    papers: [
      { title: 'Alchemy vs. Chemistry: The Etymological Origins of a Historiographic Mistake (with W. R. Newman)', journal: 'Early Science and Medicine 3.1: 32–65', year: 1998 },
    ],
    methodSource: 'The Secrets of Alchemy (the replication method)',
    methodSteps: [
      'Take a historical recipe.',
      'Decode its Decknamen (cover-names) via the author’s other texts ("the eagle" = sal ammoniac, etc.).',
      'Source period-authentic impure materials.',
      'Replicate the procedure in a modern lab.',
      'Compare the product to the text’s description (e.g. growing the Philosophers’ Tree from a gold amalgam).',
      'Revise the reading and repeat — showing the texts encode real chemistry, not allegory alone.',
    ],
    flags: ['Scholarship, with laboratory practice as method (history shelf).'],
    verified: 'brill.com/view/journals/esm/3/1; press.uchicago.edu; host.jhu.edu (Principe).',
    cite: 'Lawrence M. Principe, The Secrets of Alchemy (University of Chicago Press, 2013).',
  },
  {
    domain: 'esoteric', practice: 'Alchemy', name: 'William R. Newman', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Indiana University; the Chymistry of Isaac Newton project',
    line: 'The historian of "chymistry" whose critical editions and Newton project ground alchemy in real laboratory science.',
    works: [
      { title: 'Promethean Ambitions: Alchemy and the Quest to Perfect Nature', year: 2004, publisher: 'University of Chicago Press' },
      { title: 'Atoms and Alchemy', year: 2006, publisher: 'University of Chicago Press' },
      { title: "Newton the Alchemist", year: 2019, publisher: 'Princeton University Press' },
      { title: 'Gehennical Fire: The Lives of George Starkey', year: 1994, publisher: 'Harvard University Press' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'press.uchicago.edu; press.princeton.edu; webapp1.dlib.indiana.edu/newton.',
    cite: 'William R. Newman, Newton the Alchemist (Princeton University Press, 2019).',
  },
  {
    domain: 'esoteric', practice: 'Alchemy', name: 'Tara Nummedal', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'Brown University',
    line: 'A historian of alchemy, authority and gender in the Holy Roman Empire.',
    works: [
      { title: 'Alchemy and Authority in the Holy Roman Empire', year: 2007, publisher: 'University of Chicago Press' },
      { title: "Anna Zieglerin and the Lion's Blood: Alchemy and End Times in Reformation Germany", year: 2019, publisher: 'University of Pennsylvania Press' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'pennpress.org; vivo.brown.edu.',
    cite: 'Tara Nummedal, Alchemy and Authority in the Holy Roman Empire (University of Chicago Press, 2007).',
  },
  {
    domain: 'esoteric', practice: 'Alchemy', name: 'Dennis William Hauck', years: 'contemporary',
    tier: 'respected', tierNote: 'Practitioner — flag strongly; his reading is the very "spiritual alchemy" Principe historicizes.',
    school: 'Spiritual (psychological) alchemy',
    line: 'The author of The Emerald Tablet, whose seven-operations "ladder" is a modern psychological reinterpretation of alchemy.',
    works: [
      { title: 'The Emerald Tablet: Alchemy for Personal Transformation', year: 1999, publisher: 'Penguin / Compass' },
      { title: "The Complete Idiot's Guide to Alchemy", year: 2008, publisher: 'Alpha' },
    ],
    methodSource: 'The Emerald Tablet (the seven-operations ladder — catalogued explicitly as a MODERN psychological reinterpretation)',
    methodSteps: [
      'Calcination — burn the ego.',
      'Dissolution — release into the unconscious.',
      'Separation — sift what is essential.',
      'Conjunction — reunite the opposites.',
      'Fermentation — spiritual inspiration after putrefaction.',
      'Distillation — purify repeatedly.',
      'Coagulation — embody the new self ("the Stone").',
    ],
    flags: ['Flag: a modern psychological reinterpretation, the exact reading Principe historicizes as a 19th-century invention — pair every citation of Hauck with Principe’s chapter on spiritual alchemy.'],
    verified: 'penguinrandomhouse.com; archive.org.',
    cite: 'Dennis William Hauck, The Emerald Tablet: Alchemy for Personal Transformation (Penguin, 1999).',
  },

  // --- JUNG & DIVINATION ---------------------------------------------------
  {
    domain: 'esoteric', practice: 'Jung & divination', name: 'C. G. Jung', years: '1875–1961',
    tier: 'canon', school: 'The psychologist engaging the practices',
    line: 'The psychologist whose foreword to the Wilhelm/Baynes I Ching frames the oracle through synchronicity, and whose alchemy books read alchemy as projected psychology.',
    works: [
      { title: 'Foreword to the Wilhelm/Baynes I Ching', year: 1950, publisher: 'Bollingen / Pantheon' },
      { title: 'Synchronicity: An Acausal Connecting Principle (CW 8)', year: 1952, publisher: 'Bollingen / Princeton' },
      { title: 'Psychology and Alchemy (CW 12)', year: 1944, publisher: 'Bollingen / Princeton' },
      { title: 'Mysterium Coniunctionis (CW 14)', year: 1955, publisher: 'Bollingen / Princeton' },
    ],
    methodSource: 'The I Ching foreword (Jung’s own approach, catalogued)',
    methodSteps: [
      'Treat the moment of casting as meaningful.',
      'Ask the question seriously, as if addressing a person.',
      'Read the resulting hexagram as a portrait of the psychic situation of the moment, not a causal prediction.',
      'Judge the "validity" only by the felt fit and subsequent reflection.',
    ],
    flags: ['His alchemy books read alchemy as projected psychology — historically corrected by Principe/Newman; present both.'],
    verified: 'standard Bollingen/Princeton Collected Works records; AbeBooks (1950 Pantheon/Bollingen).',
    cite: 'C. G. Jung, foreword to The I Ching (Bollingen XIX, 1950); Synchronicity (CW 8, 1952).',
  },
  {
    domain: 'esoteric', practice: 'Jung & divination', name: 'Marie-Louise von Franz', years: '1915–1998',
    tier: 'respected', school: 'Jungian; Jung’s closest collaborator on divination theory',
    line: 'Jung’s closest collaborator on divination theory, whose On Divination and Synchronicity is the key Jungian treatment.',
    works: [
      { title: 'On Divination and Synchronicity: The Psychology of Meaningful Chance', year: 1980, publisher: 'Inner City Books' },
      { title: 'Number and Time', year: 1974, publisher: 'Northwestern University Press' },
    ],
    flags: ['Jungian belief-frame: reads chance as psychologically meaningful — catalogued as her documented position.'],
    verified: 'innercitybooks.net; archive.org.',
    cite: 'Marie-Louise von Franz, On Divination and Synchronicity (Inner City Books, 1980).',
  },
  {
    domain: 'esoteric', practice: 'Jung & divination', name: 'Roderick Main', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf.',
    school: 'University of Essex; Psychosocial & Psychoanalytic Studies',
    line: 'The scholar of Jung on synchronicity and the paranormal.',
    works: [
      { title: 'Jung on Synchronicity and the Paranormal (ed., with introduction)', year: 1997, publisher: 'Princeton University Press' },
      { title: 'Revelations of Chance: Synchronicity as Spiritual Experience', year: 2007, publisher: 'SUNY Press' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'press.princeton.edu; Amazon.',
    cite: 'Roderick Main (ed.), Jung on Synchronicity and the Paranormal (Princeton University Press, 1997).',
  },
  {
    domain: 'esoteric', practice: 'Jung & divination', name: 'Liz Greene', years: 'contemporary',
    tier: 'academic', tierNote: 'The academic wing of a famous practitioner — these titles are Routledge scholarship; dual role flagged.',
    school: 'Famous astrologer + scholar (doctorates in psychology and history)',
    line: 'A famous astrologer whose Routledge scholarship studies Jung’s own engagement with astrology.',
    works: [
      { title: 'Jung’s Studies in Astrology: Prophecy, Magic, and the Qualities of Time', year: 2018, publisher: 'Routledge (IAJS best-book award 2018)' },
      { title: 'The Astrological World of Jung’s Liber Novus', year: 2018, publisher: 'Routledge' },
    ],
    flags: ['Dual role flagged: a practicing astrologer; these two titles are academic (Routledge) scholarship.'],
    verified: 'routledge.com (both 2018 titles).',
    cite: 'Liz Greene, Jung’s Studies in Astrology (Routledge, 2018).',
  },
  {
    domain: 'esoteric', practice: 'Jung & divination', name: 'Wouter J. Hanegraaff', years: 'contemporary',
    tier: 'academic', tierNote: 'History shelf — the founder-figure of academic esotericism studies.',
    school: 'University of Amsterdam (chair in History of Hermetic Philosophy)',
    line: 'The meta-historian of Western esotericism, cited for the field’s critical distance and the "rejected knowledge" frame.',
    works: [
      { title: 'New Age Religion and Western Culture: Esotericism in the Mirror of Secular Thought', year: 1996, publisher: 'Brill' },
      { title: 'Esotericism and the Academy: Rejected Knowledge in Western Culture', year: 2012, publisher: 'Cambridge University Press' },
      { title: 'Western Esotericism: A Guide for the Perplexed', year: 2013, publisher: 'Bloomsbury' },
    ],
    flags: ['Scholarship only (history shelf).'],
    verified: 'brill.com/display/title/1474; academia.edu; en.wikipedia.org/wiki/Wouter_Hanegraaff.',
    cite: 'Wouter J. Hanegraaff, Esotericism and the Academy (Cambridge University Press, 2012).',
  },
];

// A convenience index by domain (used by the per-domain pages).
export const PRACTITIONERS_BY_DOMAIN = PRACTITIONERS.reduce((acc, p) => {
  (acc[p.domain] || (acc[p.domain] = [])).push(p);
  return acc;
}, {});
