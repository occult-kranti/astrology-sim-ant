// Historical country/calendar study reference material, reviewed 2026-10-30.
// Sources: selected Lilly Book I ch. VII; Herodotus II.4; named modern calendar,
// legal and textual sources below. These are descriptive, source-qualified
// comparisons, not a universal religious system or evidence of state nativities.
// No ephemeris, forecast, date election, DOM, network or private input is used.
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const COUNTRY_METHOD_SOURCES = freeze([
  {
    id: 'CHM-LILLY-HOUSES', title: 'Christian Astrology, Book I, chapter VII', author: 'William Lilly',
    url: 'https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf',
    sourceType: 'historical-primary-in-modern-transcription', locator: 'Printed pp.50–56: Of the twelve Houses, their Nature and Signification',
    edition: 'Historical work first published 1647; World Astrology Network transcription ©2003',
    accessDepth: 'Selected complete chapter and transcription title inspected from the retained PDF in this task; fresh request returned HTTP 406. No period-facsimile or full-book collation.',
    checkedAt: '2026-10-30', rights: 'Historical work public domain; modern transcription copyright retained. Original brief paraphrases only; no source pages redistributed.',
    note: 'First-house public-state language is specifically for eclipses, great conjunctions and Aries ingress. Tenth and eleventh include public offices/councils. This does not establish a unique national birth date.',
    source: 'Lilly, Christian Astrology I.VII, pp.50–56; World Astrology Network transcription (2003).',
  },
  {
    id: 'CHM-LILLY-SCOPE', title: 'Christian Astrology: title and contents', author: 'William Lilly',
    url: 'https://en.wikisource.org/wiki/Christian_Astrology', sourceType: 'inherited-source-scope',
    locator: 'Title page and contents; LIL-CA-1659-SCOPE in study-lenses.js', edition: '1659 second edition, John Macock; Wikisource transcription',
    accessDepth: 'Inherited opening/contents reading recorded in docs/2026-10-05-study-sources.md; the local source record was checked, not the whole work.',
    checkedAt: '2026-10-30', rights: 'Historical edition public domain; modern editorial/transcription rights remain separate.',
    note: 'The book title identifies Lilly’s work; it does not name a universal doctrine shared by Christian churches. Questions, nativities and introductory calculation are separate sections.',
    source: 'Lilly, Christian Astrology, 1659 title/contents; inherited LIL-CA-1659-SCOPE.',
  },
  {
    id: 'CHM-HERODOTUS', title: 'Histories, Book II', author: 'Herodotus; George Rawlinson translation',
    url: 'https://classics.mit.edu/Herodotus/history.2.ii.html', sourceType: 'historical-primary-in-translation',
    locator: 'II.4, opening Egyptian calendar account', edition: 'George Rawlinson translation, Internet Classics Archive web presentation',
    accessDepth: 'Fresh HTTP 200; attribution and selected II.4 paragraph read. The whole history was not read.',
    checkedAt: '2026-10-30', rights: 'Historical translation public domain; web presentation credits Daniel C. Stevenson/Web Atomics. Original paraphrase only.',
    note: 'Reports twelve thirty-day months plus five days. His seasonal-uniformity statement is a historical assertion, not a modern validation of a non-intercalated year or a reconstruction epoch.',
    source: 'Herodotus, Histories II.4, trans. George Rawlinson, Internet Classics Archive.',
  },
  {
    id: 'CHM-UCL-EGYPT', title: 'The Egyptian–Coptic calendar', author: 'University College London, Digital Egypt',
    url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/calendar.html', sourceType: 'academic-exhibit',
    locator: 'Opening paragraph, month table headed modern dates (Julian), epagomenal/intercalary notes', edition: '2003 web exhibit',
    accessDepth: 'Retained full short page inspected; fresh request returned HTTP 403. Its cited books were not read.',
    checkedAt: '2026-10-30', rights: '©2003 UCL, all rights reserved; original factual paraphrase and link only.',
    note: 'Distinguishes ancient civil structure from the intercalated Alexandrian/Coptic calendar. The table is Julian. Its reform chronology differs from the retained Britannica account; neither chronology is encoded here.',
    source: 'UCL Digital Egypt, The Egyptian–Coptic calendar (2003); retained passage.',
  },
  {
    id: 'CHM-BRITANNICA-EGYPT', title: 'Egyptian calendar', author: 'Encyclopaedia Britannica editors',
    url: 'https://www.britannica.com/science/Egyptian-calendar', sourceType: 'reference-article',
    locator: 'Civil-calendar and lunar-calendar paragraphs; final reform paragraph', edition: 'Retained web article reviewed for the calendar atlas',
    accessDepth: 'Retained selected paragraphs reread; fresh request returned HTTP 403.',
    checkedAt: '2026-10-30', rights: 'Copyright Encyclopaedia Britannica; original factual paraphrase and link only.',
    note: 'Independent agreement on twelve thirty-day civil months plus five days and a distinct lunar calendar. Compressed reform chronology conflicts with UCL and is not adopted.',
    source: 'Encyclopaedia Britannica, Egyptian calendar; retained selected paragraphs.',
  },
  {
    id: 'CHM-ICU', title: 'ICU User Guide: Calendar', author: 'Unicode ICU project',
    url: 'https://unicode-org.github.io/icu/userguide/datetime/calendar/', sourceType: 'software-documentation',
    locator: 'Calendar subclasses, locale/keyword selection and calendar-service scope', edition: 'Online guide retrieved 2026-10-30',
    accessDepth: 'Fresh HTTP 200; calendar support and selection passages read. Not an independent validation of all converted dates.',
    checkedAt: '2026-10-30', rights: 'Unicode documentation cited; no external code or tables imported.',
    note: 'Runtime support and a resolved calendar ID are technical properties, not religious authority or proof that every historical variant is implemented.',
    source: 'Unicode ICU User Guide, Date/Time Calendar services.',
  },
  {
    id: 'CHM-CIVIL-METHODS', title: 'Workbench civil-calendar methods and atlas qualifications', author: 'Workbench project',
    url: 'docs/2026-10-calendar-methods.md', sourceType: 'project-method-review',
    locator: 'Calendar IDs and boundaries; docs/2026-10-calendar-observatory-research.md and docs/2026-10-atlas-methods.md', edition: 'Existing documented canonical implementation',
    accessDepth: 'Local reports, civil-row implementation and relevant specialist profiles inspected. Selected fixtures are inherited; no new full-range validation.',
    checkedAt: '2026-10-30', rights: 'Project documentation; original explanations.',
    note: 'Indian means national Saka solar civil calendar; Hebrew and Islamic display rows use civil midnight; Persian/Coptic/Islamic display families retain pending independent-fixture limits. Gregorian/Julian computus is separate.',
    source: 'Workbench calendar methods, observatory research and atlas methods (October 2026).',
  },
  {
    id: 'CHM-MAIMONIDES', title: 'Mishneh Torah, Foreign Worship and Customs of the Nations', author: 'Moses Maimonides; translation by Eliyahu Touger',
    url: 'https://www.sefaria.org/Mishneh_Torah%2C_Foreign_Worship_and_Customs_of_the_Nations.11.9', sourceType: 'historical-primary-in-modern-translation',
    locator: '11:9', edition: 'Touger, Jerusalem: Moznaim, c1986–c2007, served by Sefaria',
    accessDepth: 'Fresh Sefaria API HTTP 200; one complete paragraph and version/licence metadata read. No full Mishneh Torah or survey of Jewish law claimed.',
    checkedAt: '2026-10-30', rights: '©Moznaim Publications; API labels translation CC BY-NC, commercial reuse requires publisher permission. No translated wording is redistributed; only a short original factual summary.',
    note: 'This passage rejects choosing conduct through astrology. It supplies a named counterexample to any claim that Judaism universally endorses astrological timing; it does not summarize every Jewish position.',
    source: 'Maimonides, Mishneh Torah, Foreign Worship and Customs of the Nations 11:9; Touger translation, Moznaim, via Sefaria.',
  },
  {
    id: 'CHM-KABBALAH', title: 'Named Kabbalah and Sefer Yetzirah source distinctions', author: 'Workbench source catalogue; cited recensions and scholarship',
    url: 'assets/js/core/data/kabbalah-data.js', sourceType: 'inherited-source-catalogue',
    locator: 'SY_PLANET_SPREAD, DISPUTES and QUOTES: Saadia V.5 / Gra chapter 4; Karr planetary-attribution appendix',
    edition: 'Inherited catalogue references Kaplan rev.1997, named Saadia/Gra recensions and Don Karr',
    accessDepth: 'Local variant records and provenance inspected; no new manuscript collation or full reading of Kaplan/Karr. A fresh Sacred Texts request failed HTTP 403 and is not evidence.',
    checkedAt: '2026-10-30', rights: 'Modern translations/commentary retain separate rights; no inherited quotations or correspondence table copied into this module.',
    note: 'The inherited ledger distinguishes Jewish textual recensions from later Hermetic/Golden Dawn schemes. Calendar conversion alone selects none of them.',
    source: 'Workbench kabbalah-data.js, named recension/edition records; inherited source status.',
  },
  {
    id: 'CHM-JYOTISHA', title: 'Vedic Astrology: An Integrated Approach, selected calendar partitions', author: 'P. V. R. Narasimha Rao',
    url: 'https://www.vedicastrologer.org/articles/vedic_astro_textbook.pdf', sourceType: 'inherited-named-author-method',
    locator: '§1.3.6 pp.10–11; §1.3.8.1 pp.12–14; §1.3.13 p.18; 2010 retrospective preface',
    edition: 'First published 2000; author-hosted PDF with 2010 qualification',
    accessDepth: 'Inherited selected-passage reading and limitations checked in docs/2026-10-sky-sources.md; no fresh whole-book reading.',
    checkedAt: '2026-10-30', rights: 'Copyright author. Free download is not an open reuse or model-training licence. No source prose redistributed.',
    note: 'Named tithi/nakshatra/ayanamsha conventions do not define every regional calendar or validate outcome predictions. The project’s linear Lahiri approximation remains explicit.',
    source: 'Rao, Vedic Astrology: An Integrated Approach, selected §§1.3.6, 1.3.8.1, 1.3.13; inherited SKY-RAO-PARTITIONS.',
  },
  {
    id: 'CHM-IRAN-CALENDAR', title: 'Constitution of the Islamic Republic of Iran', author: 'Iran; English text hosted by Constitute Project',
    url: 'https://www.constituteproject.org/constitution/Iran_1989?lang=en', sourceType: 'primary-law-in-translation',
    locator: 'Article 17', edition: '1979 Constitution, amendments through 1989; Constitute English rendering',
    accessDepth: 'Fresh HTTP 200; article 17 and page identity inspected, not the complete constitution or original Persian collation.',
    checkedAt: '2026-10-30', rights: 'Constitute translation/source rights retained; short original paraphrase and citation only.',
    note: 'Recognizes solar and lunar Islamic calendars and specifies solar calendar use by government offices. It does not identify the runtime Persian converter with every official equinox decision or endorse astrology.',
    source: 'Iran Constitution (1979, amended 1989), article 17, Constitute Project English rendering.',
  },
]);

export const COUNTRY_HISTORY_METHODS = freeze([
  {
    id: 'western-lilly', label: 'Western / Lilly and Christian calendars', scope: 'Named historical astrology and separate civil/ecclesiastical conventions',
    calendarIds: ['gregory', 'julian'], tradition: 'Lilly’s seventeenth-century English astrology; specified calendar conventions',
    summary: 'Christian Astrology is the title of Lilly’s book. Gregorian and Julian dates, church computus, horary questions and nativities describe different methods.',
    distinctions: ['A house system divides a chart; it does not establish which public event is a state’s birth.', 'Lilly’s selected chapter discusses public significations for particular mundane figures. An arbitrary anniversary chart does not become that historical figure.', 'Christian churches and communities are not represented by one universal astrological method.'],
    sourceIds: ['CHM-LILLY-HOUSES', 'CHM-LILLY-SCOPE', 'CHM-CIVIL-METHODS'],
    limitations: ['No complete electional or mundane judgment is implemented here.', 'Unknown historical clocks do not yield known event ascendants or houses.'],
    source: 'Lilly, Christian Astrology I.VII pp.50–56; 1659 title/contents; Workbench civil-calendar methods.',
  },
  {
    id: 'egyptian-coptic', label: 'Ancient Egyptian / Coptic distinctions', scope: 'Historical calendar comparison; ancient reconstruction unavailable',
    calendarIds: ['coptic'], tradition: 'Ancient Egyptian civil/lunar records and the distinct Alexandrian/Coptic calendar',
    summary: 'Ancient Egyptian civil reckoning and the intercalated Coptic calendar have related structures but different historical conventions. A modern Coptic label is not an ancient Egyptian conversion.',
    distinctions: ['Herodotus reports twelve thirty-day months plus five extra days; this is a historical account, not a complete conversion algorithm.', 'The retained UCL table uses Julian correspondences and describes Coptic intercalation. Its reform chronology differs from Britannica; neither date of reform is selected here.', 'Reconstructed Egyptian astrology needs an identified text, period, epoch and interpretation method. A Coptic date supplies none of those choices.'],
    sourceIds: ['CHM-HERODOTUS', 'CHM-UCL-EGYPT', 'CHM-BRITANNICA-EGYPT', 'CHM-ICU', 'CHM-CIVIL-METHODS'],
    limitations: ['No ancient civil/lunar epoch reconstruction or Egyptian astrology is computed.', 'Runtime Coptic support does not validate feasts, fasts or every historical date.'],
    source: 'Herodotus II.4; UCL Egyptian–Coptic calendar; Britannica Egyptian calendar; named runtime scope.',
  },
  {
    id: 'hebrew-kabbalah', label: 'Hebrew calendar / Jewish textual traditions', scope: 'Civil conversion and separate named textual positions',
    calendarIds: ['hebrew'], tradition: 'Hebrew calendar; named Jewish and later Hermetic source traditions kept distinct',
    summary: 'A Hebrew civil date does not calculate a Kabbalistic interpretation. Named Jewish sources also disagree about astrology; Maimonides 11:9 expressly rejects acting on astrological timing.',
    distinctions: ['This converter displays the selected zone’s civil date, while religious day boundaries and Israel/diaspora observance policies require additional rules.', 'Sefer Yetzirah recensions and later Hermetic correspondences need their own text and edition; the inherited catalogue records variants.', 'Neither a state’s population nor its civic anniversary establishes a single Jewish religious or mystical practice.'],
    sourceIds: ['CHM-MAIMONIDES', 'CHM-KABBALAH', 'CHM-CIVIL-METHODS', 'CHM-ICU'],
    limitations: ['No sunset observance decision, Kabbalistic reading or universal Jewish astrology is inferred.', 'The one Maimonides paragraph is not a survey of all Jewish authorities.'],
    source: 'Maimonides, Mishneh Torah, Foreign Worship 11:9; inherited named Kabbalah variants; Workbench Hebrew civil methods.',
  },
  {
    id: 'indian-jyotisha', label: 'Indian Saka / named Jyotisha methods', scope: 'National civil calendar and distinct astronomical/textual conventions',
    calendarIds: ['indian'], tradition: 'Indian national Saka solar calendar; selected named Jyotisha study methods',
    summary: 'The runtime Indian calendar means the national Saka civil calendar. Jyotisha partitions and regional Hindu calendars require additional astronomical and interpretive conventions.',
    distinctions: ['The civil Saka label is not a regional lunar festival calendar or the Balinese Saka calendar.', 'Tithi and nakshatra depend on named astronomical definitions; sidereal results also require an ayanamsha choice.', 'Sunrise, local observance priorities and regional month systems cannot be inferred from a single civil date label.'],
    sourceIds: ['CHM-CIVIL-METHODS', 'CHM-JYOTISHA', 'CHM-ICU'],
    limitations: ['Inherited selected fixtures do not establish every year or community policy.', 'No Muhurta recommendation, regional festival determination or complete Jyotisha judgment is produced.'],
    source: 'Workbench Indian-calendar profile and methods; Rao selected partition passages, with inherited reading limits; ICU calendar services.',
  },
  {
    id: 'islamic-persian', label: 'Islamic lunar / Persian solar context', scope: 'Distinct civil calendars and documented Iranian legal context',
    calendarIds: ['islamic-civil', 'islamic-umalqura', 'persian'], tradition: 'Named Islamic civil implementations and Persian solar-calendar context',
    summary: 'Iran’s constitution recognizes solar and lunar Islamic calendars and specifies solar-calendar use in government offices. Tabular Islamic, Umm al-Qura and runtime Persian dates remain separately named methods.',
    distinctions: ['An arithmetic lunar calendar is not an observed-crescent decision by a local authority.', 'Umm al-Qura is a distinct implementation; it is not substituted for Iranian authority.', 'The runtime Persian converter does not establish which official astronomical or tabular rule governed every historical date.', 'Calendar use and Islamic religious commitments do not amount to one endorsed astrological doctrine.'],
    sourceIds: ['CHM-IRAN-CALENDAR', 'CHM-CIVIL-METHODS', 'CHM-ICU'],
    limitations: ['Independent display fixtures remain pending for these runtime families in the inherited validation ledger.', 'No lunar observance ruling, prayer-time judgment or Persian/Islamic astrological election is computed.'],
    source: 'Iran Constitution article 17, Constitute English rendering; Workbench Islamic/Persian civil methods; ICU calendar services.',
  },
]);

const houseQualification = 'Selected descriptive topics from Lilly I.VII; this is not an exhaustive or universal house doctrine. A public-topic analogy does not establish a state birth or a known event house placement.';
const houseRows = [
  [1, 'Person and public body', 'Life, bodily appearance and the person asking a question or born.', 'Lilly explicitly extends this to the common people/general state for eclipses, great conjunctions and annual Aries ingress; that context is required.', '50–51'],
  [2, 'Resources and possessions', 'Estate, movable goods, money, profit and loss.', 'Lilly includes the people’s wealth in eclipse/conjunction figures. Public-resource study here is descriptive, without a prosperity forecast.', '51–52'],
  [3, 'Kinship and communication', 'Siblings, relatives, neighbours, short journeys, letters and messengers.', 'Local communication and neighbourhood life are an editorial civic analogy, not a national rule established by this passage.', '52'],
  [4, 'Land and foundations', 'Fathers in Lilly’s stated context, land, buildings, inheritance and the end of a matter.', 'The source includes towns and their land; civic land/heritage study is an analogy, not a claim about national destiny.', '52–53'],
  [5, 'Children and recreation', 'Children, celebrations, entertainment and representatives.', 'Cultural celebrations and public recreation are editorial civic topics; no demographic or diplomatic outcome is inferred.', '53'],
  [6, 'Work and care', 'Illness, servants and labourers in Lilly’s historical social categories, and small livestock.', 'Public work and care are modern civic analogies, not diagnoses or a source-validated national health forecast.', '53–54'],
  [7, 'Relationships and counterparties', 'Marriage, other parties and civil disputes among the selected topics.', 'Relations with other communities may be studied as an editorial analogy; no outcome or suitability ranking follows.', '54'],
  [8, 'Estates and inheritance', 'Estates of deceased people, wills, inheritances and anxiety among the selected topics.', 'Public legacy and shared obligations are editorial discussion prompts. No death, disaster or financial-loss forecast is made.', '54–55'],
  [9, 'Learning and belief', 'Books, learning, religious institutions, foreign countries and long journeys.', 'Education, religious institutions and cultural exchange are descriptive civic analogies; the source does not make one belief universal.', '55'],
  [10, 'Office and public authority', 'Rulers, magistrates, honour, office, profession, kingdoms and countries.', 'Public office is explicit in Lilly’s text. It does not identify a unique founding instant or validate a government outcome.', '55'],
  [11, 'Friends and councils', 'Friends, hope, advisers, associates and treasuries in specified contexts.', 'Lilly’s example associates London’s Common Council with this house. Applying it elsewhere remains a stated analogy.', '56'],
  [12, 'Confinement and adversity', 'Imprisonment, sorrow and concealed opposition among Lilly’s historical topics.', 'Institutional confinement and exclusion are editorial civic study topics; no hidden actor or adverse event is inferred.', '56'],
];
export const COUNTRY_HISTORY_HOUSES = freeze(houseRows.map(([number, label, description, mundaneAnalogy, pages]) => ({
  number, label, description, mundaneAnalogy, qualification: houseQualification,
  sourceIds: ['CHM-LILLY-HOUSES'], source: `Lilly, Christian Astrology I.VII, p${pages.includes('–') ? 'p' : ''}.${pages}; selected paraphrase; civic extensions marked explicitly.`,
})));

export const COUNTRY_HISTORY_TASKS = freeze([
  {
    id: 'anniversary', label: 'Historical anniversary', description: 'Document which event an anniversary commemorates and how its date is represented in named calendars.',
    requiredInformation: ['Curated event identifier and the exact event being commemorated', 'Source date, source calendar and stated precision', 'Location and civil-zone convention for any explicitly assumed display sample'],
    sourceRequirements: ['Primary declaration, official archive or issuing institution', 'Separate source for a later public-holiday rule if that is being discussed'],
    limits: 'The task explains a historical date. It does not select or rank a future celebration date.', sourceIds: ['CHM-CIVIL-METHODS'],
    source: 'Editorial civic study task derived from the Workbench source/precision contract; not a traditional timing rule.',
  },
  {
    id: 'constitutional-commemoration', label: 'Constitutional commemoration', description: 'Distinguish drafting, adoption, proclamation and legal commencement before comparing calendar labels.',
    requiredInformation: ['Named constitutional instrument and version', 'Which legal milestone is being studied', 'Original date wording and any amendment or commencement clause'],
    sourceRequirements: ['Official constitutional text, gazette or parliamentary archive', 'Translation and edition identity when the original is not being read'],
    limits: 'Different legal milestones may coexist. The module does not choose one as the country’s true birth.', sourceIds: ['CHM-IRAN-CALENDAR', 'CHM-CIVIL-METHODS'],
    source: 'Editorial archival task; legal-calendar context illustrated by Iran Constitution article 17. No astrological election rule.',
  },
  {
    id: 'public-ceremony', label: 'Public ceremony record', description: 'Prepare a source record for a documented peaceful civic ceremony and identify what its clock evidence can support.',
    requiredInformation: ['Event name, venue and historical date', 'Documented clock time, its source and zone, or an explicit unknown-time status', 'Distinction between ceremony, signing, announcement and legal effect'],
    sourceRequirements: ['Official programme, contemporary record, archive or dated proceedings', 'Independent corroboration for a precise clock where available'],
    limits: 'A sample clock is a display assumption. No preferred future hour or predicted ceremonial outcome is produced.', sourceIds: ['CHM-CIVIL-METHODS', 'CHM-LILLY-HOUSES'],
    source: 'Editorial evidence-recording task under the Workbench source/precision contract; no source-derived auspiciousness claim.',
  },
  {
    id: 'education-archive', label: 'Education and archive study', description: 'Compare how a named source, calendar and later interpretation describe the same documented event.',
    requiredInformation: ['Research question and curated historical records', 'Named source editions and selected passages', 'Explicit separation of conversion, historical claim and modern analogy'],
    sourceRequirements: ['Passage-level citations with actual access/reading depth', 'Rights notes and unresolved disagreements', 'Named calendar implementation and inherited validation limits'],
    limits: 'The output is a bounded comparison, not full-book expertise, religious authority or evidence of predictive validity.', sourceIds: ['CHM-LILLY-HOUSES', 'CHM-HERODOTUS', 'CHM-MAIMONIDES', 'CHM-CIVIL-METHODS'],
    source: 'Editorial comparative-study task; source examples are cited individually and do not define a merged tradition.',
  },
]);

/** Pure lookup: resolve only this module’s curated source identifiers. */
export function countryMethodSourcesFor(sourceIds) {
  if (!Array.isArray(sourceIds) || sourceIds.some(id => typeof id !== 'string')) throw new TypeError('Source identifiers must be an array of strings.');
  const ids = [...new Set(sourceIds)];
  return ids.map(id => {
    const record = COUNTRY_METHOD_SOURCES.find(source => source.id === id);
    if (!record) throw new RangeError(`Unknown country method source: ${id}.`);
    return record;
  });
}
