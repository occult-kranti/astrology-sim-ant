// Curated study passages reviewed 2026-10-05. No network, calculation or persona.
// These records describe historical sources; their presence does not establish
// predictive validity. Tool paths resolve relative to pages/studio.html.
// Reading depth and source qualifications: docs/2026-10-05-study-sources.md.

const lenses = [
  {
    id: 'lilly',
    title: 'Lilly: read a figure',
    shortTitle: 'Lilly',
    summary: 'Read a frozen chart through the stated conventions of Christian Astrology. Keep a moment, a question and a nativity distinct; show computed testimony and historical interpretation separately.',
    prompts: [
      'Identify this session’s chart purpose, exact instant, location and house system. Explain which inputs are known and which are missing before discussing a question or nativity; cite LIL-CA-1659-SCOPE.',
      'Explain the available significators and testimonies using the computed facts and the selected question topic. Separate calculation from Lilly’s interpretive tradition, name the convention, and report unavailable evidence instead of inventing a judgment.',
      'Compare a selected worked figure with this session only if its data are supplied. Preserve printed-position discrepancies, approximate houses and source caveats; a recorded historical outcome is not independent proof of predictive validity.',
    ],
    sources: [
      {
        id: 'LIL-CA-1659-SCOPE',
        title: 'William Lilly, Christian Astrology',
        section: 'Title page, To the Reader, and contents of Books I–III',
        url: 'https://en.wikisource.org/wiki/Christian_Astrology',
        edition: '1659 second edition, John Macock; Wikisource transcription',
        claimStatus: 'Historical scope and edition evidence',
        note: 'The title page separates introductory calculation, questions and nativities. Opening matter and contents were read; this is not a fresh collation of the repository’s 1647 woodcut figures. The page’s misleading “First published” label must not replace its explicit second-edition statement.',
      },
      {
        id: 'LIL-CA-I-METHOD',
        title: 'William Lilly, Christian Astrology: erecting and reading a figure',
        section: 'Book I contents: chart erection pp.33–44; considerations p.121; significators p.123; perfection p.124',
        url: 'https://en.wikisource.org/wiki/Christian_Astrology',
        edition: '1659 second edition; contents references, with existing engine citations to 1647',
        claimStatus: 'Source map; calculation rules require their own validation',
        note: 'These page references were checked in the transcribed contents, not each complete chapter. The application uses modern Astronomy Engine positions and named house/orb rules. A source link does not establish that every historical technique or uncertain printed degree is reproduced.',
      },
    ],
    tools: [
      { label: 'Chart and testimony', path: 'workbench.html' },
      { label: 'Horary questions', path: 'book2/horary.html' },
      { label: 'Lilly’s worked figures', path: 'book2/examples.html' },
      { label: 'Dignity calculations', path: 'how-it-works.html#hiw-dignity' },
    ],
  },
  {
    id: 'agrippa',
    title: 'Agrippa: timing and symbolic construction',
    shortTitle: 'Agrippa',
    summary: 'Connect a stated celestial moment with sourced planetary squares and symbolic diagrams. Inspect the arithmetic and timing convention while retaining the distinction between historical claims and modern reconstruction.',
    prompts: [
      'Explain the computed planetary day and hour, if available, and name the sunrise/sunset division used here. Compare that convention with the alternative reported in AGR-II-34; do not imply that the alternative has been calculated.',
      'For this session’s selected symbolic diagram, show the square’s line sum, total and actual letter-to-cell trace when supplied. Cite AGR-II-22, and identify the chosen alphabet, normalization and modern reconstruction instead of claiming a facsimile historical seal.',
      'Compare supplied candidate times by their reported reasons and limitations. Distinguish the celestial observations discussed in AGR-II-29 from the application’s editorial scoring; an empty scan is not permission to invent a favorable time or an outcome guarantee.',
    ],
    sources: [
      {
        id: 'AGR-II-22',
        title: 'Agrippa, Three Books of Occult Philosophy',
        section: 'Book II, chapter 22: tables of the planets',
        url: 'https://esotericarchives.com/agrippa/agripp2b.htm',
        edition: '1651 English “J.F.” translation; Joseph H. Peterson digital edition, updated 2019',
        claimStatus: 'Primary historical passage; arithmetic separately testable',
        note: 'Read the chapter’s table account, including Saturn’s order three, line sum fifteen and total forty-five. The author’s efficacy claims are historical assertions. Current Latin/Hebrew tracing and reduction are disclosed reconstructions, not authenticated copies of finished seals. “J.F.” translator identity remains disputed.',
      },
      {
        id: 'AGR-II-29',
        title: 'Agrippa, Three Books of Occult Philosophy',
        section: 'Book II, chapter 29: observation of celestials',
        url: 'https://esotericarchives.com/agrippa/agripp2c.htm',
        edition: '1651 English “J.F.” translation; Joseph H. Peterson digital edition',
        claimStatus: 'Primary historical timing doctrine',
        note: 'Read the passage on position, motion, aspects, degrees and observer latitude, and the role assigned to the Moon. It motivates a source-based study flow; it does not validate magical efficacy or the application’s numeric election weights.',
      },
      {
        id: 'AGR-II-34',
        title: 'Agrippa, Three Books of Occult Philosophy',
        section: 'Book II, chapter 34: motions and planetary hours',
        url: 'https://esotericarchives.com/agrippa/agripp2c.htm',
        edition: '1651 English “J.F.” translation; Joseph H. Peterson digital edition',
        claimStatus: 'Primary evidence of competing hour conventions',
        note: 'Read the ordinary twelve daylight and twelve night divisions and the contrasting account of fifteen-degree ecliptic ascensions using oblique-ascension tables. This app implements sunrise/sunset division, not that alternative. Polar intervals can be unavailable; no universal Agrippa timing method is implied.',
      },
    ],
    tools: [
      { label: 'Planetary hours', path: 'book1/planetary-hours.html' },
      { label: 'Compare election times', path: 'picatrix/election.html' },
      { label: 'Planetary squares and name traces', path: 'picatrix/kameas.html' },
      { label: 'Agrippa source catalogue', path: 'greatworks/agrippa.html' },
    ],
  },
  {
    id: 'hermetic',
    title: 'Hermetic texts: compare sources and symbols',
    shortTitle: 'Hermetic texts',
    summary: 'Study the seven-sphere cosmology and its later reception alongside the actual sky. Distinguish the Corpus Hermeticum, the Emerald Tablet and later interpretations rather than treating them as one calculation system.',
    prompts: [
      'Compare the seven rulers and zones described in HER-CH-I with the supplied planetary-order display. Separate historical cosmology from calculated positions and identify any correspondence that is interpretation rather than an explicit statement in the passage.',
      'Explain why the Corpus Hermeticum and the Emerald Tablet are separate sources using HER-CH-I and HER-ET-K28. Preserve edition and attribution notes; do not turn “as above, so below” into a physical law or a numerical calculation.',
      'Help write a source-linked reflection about this session. Label personal meaning as interpretation, quote only text actually supplied, and identify what the selected passages leave unanswered.',
    ],
    sources: [
      {
        id: 'HER-CH-I',
        title: 'Corpus Hermeticum I: Poimandres',
        section: 'Sections 9 and 25–26: seven rulers and ascent through the zones',
        url: 'https://sacred-texts.com/gno/th2/th202.htm',
        edition: 'G. R. S. Mead, Thrice-Greatest Hermes, volume II, 1906',
        claimStatus: 'Primary text in a dated translation; historical cosmology',
        note: 'The cited sections were read. “Hermes” is the text’s literary attribution, not a participating historical advisor. Mead’s Theosophical commentary is period interpretation. The passage does not supply the application’s ephemeris, an election score or evidence of physical planetary influences.',
      },
      {
        id: 'HER-ET-K28',
        title: 'Emerald Tablet in Newton’s Keynes MS28',
        section: 'English translation ff.2r–v; Latin copy f.6r; commentary ff.6v–7r',
        url: 'https://webapp1.dlib.indiana.edu/newton/mss/dipl/ALCH00017',
        edition: 'The Chymistry of Isaac Newton, edited by William R. Newman; electronic edition June 2010',
        claimStatus: 'Manuscript translation and reception evidence',
        note: 'Manuscript description, English translation and commentary were inspected. This is a separate alchemical text, not a Corpus Hermeticum treatise or an ancient Egyptian inscription verified by this manuscript. Newton’s copy documents reception, not endorsement of the app’s astrological calculations.',
      },
    ],
    tools: [
      { label: 'Hermetic texts and editions', path: 'greatworks/hermetica.html' },
      { label: 'Hermetic source study', path: 'chronology/hermetica.html' },
      { label: 'Transmission timeline', path: 'chronology/index.html' },
      { label: 'Compare historical rulebooks', path: 'moments.html' },
    ],
  },
  {
    id: 'newton',
    title: 'Newton: observation and revision',
    shortTitle: 'Newton',
    summary: 'Use an observation journal to separate an expected quantity, a measurement and a symbolic interpretation. Newton’s writings provide a historical method lens, not an invented natal, horary or electional rule set.',
    prompts: [
      'Help structure a journal entry with an expected value, observed value, units, measurement method, uncertainty and a stated acceptance criterion. Use supplied measurements only; mark missing observations or uncertainties as unknown and distinguish camera alignment from astronomical-position accuracy.',
      'Using NEW-OPT-Q31 as a historical method reference, propose one comparison that could reveal a mistake in this session. Name the quantity, what stays fixed and what changes; separate a repeatable calculation check from evidence of a physical or personal effect.',
      'Summarize what was computed, what was independently observed, what disagreed and what remains unresolved. Retain failed checks. NEW-K28-CATALOGUE documents Newton’s textual work; do not invent a Newtonian astrology method from the Emerald Tablet.',
    ],
    sources: [
      {
        id: 'NEW-OPT-Q31',
        title: 'Isaac Newton, Opticks',
        section: 'Book III, Query 31, pp.404–405: analysis and synthesis',
        url: 'https://www.gutenberg.org/files/33504/33504-h/33504-h.htm',
        edition: 'Fourth English edition, William Innys, London, 1730; Project Gutenberg transcription',
        claimStatus: 'Primary methodological passage; modern journal application',
        note: 'Read the passage on experiments, observations, induction, exceptions and checking explanations. The proposed expected/observed/uncertainty journal is a modern implementation inspired by this method, not a historical Newton astrology calculator or proof of any symbolic claim.',
      },
      {
        id: 'NEW-K28-CATALOGUE',
        title: 'Newton Project catalogue: Keynes MS28, Hermes',
        section: 'ALCH00017, Contents and Notes',
        url: 'https://www.newtonproject.ox.ac.uk/catalogue/record/ALCH00017',
        edition: 'Critical online manuscript catalogue, consulted 2026-10-05',
        claimStatus: 'Critical catalogue; translation chronology and attribution',
        note: 'The independent source reviewer read the complete catalogue page. It reports Dobbs’s proposed late-1680s or early-1690s date for the English translation, with some annotations possibly after 1700. The manuscript is evidence of translation/commentary, not a Newton-authored horary rule set.',
      },
    ],
    tools: [
      { label: 'Calculation methods and checks', path: 'how-it-works.html' },
      { label: 'Planetary hours by hand', path: 'handcalc.html' },
      { label: 'Freeze a chart for comparison', path: 'workbench.html' },
      { label: 'Historical alchemy context', path: 'chronology/alchemy.html' },
    ],
  },
];

// Immutable shared source records prevent a UI or AI consumer from silently
// rewriting attribution for the rest of the session.
export const STUDY_LENSES = Object.freeze(lenses.map(lens => Object.freeze({
  ...lens,
  prompts: Object.freeze(lens.prompts),
  sources: Object.freeze(lens.sources.map(source => Object.freeze(source))),
  tools: Object.freeze(lens.tools.map(tool => Object.freeze(tool))),
})));

export function getStudyLens(id) {
  return STUDY_LENSES.find(lens => lens.id === id) || null;
}
