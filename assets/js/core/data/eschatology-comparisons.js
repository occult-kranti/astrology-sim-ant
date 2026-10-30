// Selected eschatology and chronology comparisons: attributed texts, not forecasts.
// Historical textual quantities have no measured physical epoch or mechanism here.
// Source editions, reading depth, variants and unavailable dates remain explicit.
// Pure data + pure lookup only. Downloaded source bodies stay outside the repository.
import { NEWTON_CHRONOLOGY_SOURCES } from './newton-chronology-sources.js';

const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const newtonPrimary = NEWTON_CHRONOLOGY_SOURCES.find(item => item.id === 'NC-YAHUDA-7-3G');
if (!newtonPrimary) throw new Error('Missing Newton primary source NC-YAHUDA-7-3G');

const COMPARISON_SOURCES = [
  {
    "id": "HTR-CHRISTIAN-MARK",
    "title": "Mark 13:32–37",
    "publisher": "United States Conference of Catholic Bishops",
    "edition": "New American Bible, Revised Edition, online chapter",
    "locator": "Mark 13:32–37; associated chapter note on 13:3–37",
    "readingDepth": "Selected verses and associated note read on 2026-10-30; not a complete Bible or commentary reading.",
    "sourceKind": "primary-text-translation",
    "rights": "Copyright or edition-specific rights retained by the publisher/translator. This module stores an original short paraphrase, not the source text; no expanded training licence is inferred.",
    "limitations": [
      "The note distinguishes the temple narrative and parousia; a chapter excerpt is not a survey of Christian interpretations.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://bible.usccb.org/bible/mark/13",
    "retrievalURL": "https://bible.usccb.org/bible/mark/13",
    "retrievedAt": "2026-10-30T04:21:58.441619+00:00",
    "httpStatus": 200,
    "contentSHA256": "9b1fa0ebdddc79dfbd8b29b8f4f459e31ed0005fd030485e183a204172ca902a",
    "receiptId": "christian-usccb",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-CHRISTIAN-MARK",
    "source": "Mark 13:32–37, New American Bible, Revised Edition, online chapter, Mark 13:32–37; associated chapter note on 13:3–37; https://bible.usccb.org/bible/mark/13",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "HTR-JEWISH-SANHEDRIN",
    "title": "Babylonian Talmud, Sanhedrin 97b",
    "publisher": "Sefaria / William Davidson Edition",
    "edition": "William Davidson Edition English; API declares CC-BY-NC",
    "locator": "Sanhedrin 97b:1–2, 5–10 and 14; especially 97b:9",
    "readingDepth": "Selected English segments read on 2026-10-30, including conflicting calculations and criticism of failed end-date setting; not the complete tractate.",
    "sourceKind": "primary-text-translation",
    "rights": "Sefaria API declares CC-BY-NC for this English edition. Only an original factual paraphrase is stored; attribution is retained and no unrestricted training/republication licence is claimed.",
    "limitations": [
      "Multiple speakers and disputed expectations must not be collapsed into one unanimous timetable.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://www.sefaria.org/Sanhedrin.97b.9?lang=bi",
    "retrievalURL": "https://www.sefaria.org/api/texts/Sanhedrin.97b?lang=en",
    "retrievedAt": "2026-10-30T04:21:58.442994+00:00",
    "httpStatus": 200,
    "contentSHA256": "554ceb71321df697e0d2e4dbaeeb0562a12240b07ad03bc3146c1cc042dabf67",
    "receiptId": "jewish-sefaria",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-JEWISH-SANHEDRIN",
    "source": "Babylonian Talmud, Sanhedrin 97b, William Davidson Edition English; API declares CC-BY-NC, Sanhedrin 97b:1–2, 5–10 and 14; especially 97b:9; https://www.sefaria.org/Sanhedrin.97b.9?lang=bi",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "HTR-JEWISH-MAIMONIDES",
    "title": "Mishneh Torah, Kings and Wars 12",
    "publisher": "Sefaria / Moznaim",
    "edition": "Eliyahu Touger translation, Jerusalem, Moznaim, c1986–2007; API declares CC-BY-NC",
    "locator": "Chapter 12:1–2 and 12:4–5",
    "readingDepth": "Selected chapter sections read on 2026-10-30, including ordinary natural order, disputed sequence and rejection of calculating the appointed time.",
    "sourceKind": "primary-text-translation",
    "rights": "English edition metadata declares CC-BY-NC. Original paraphrase only; underlying edition rights are not generalized.",
    "limitations": [
      "This is Maimonides’ formulation, not an exhaustive statement of all Jewish messianic or afterlife traditions.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://www.sefaria.org/Mishneh_Torah%2C_Kings_and_Wars.12.2?lang=bi",
    "retrievalURL": "https://www.sefaria.org/api/texts/Mishneh_Torah%2C_Kings_and_Wars.12?lang=en",
    "retrievedAt": "2026-10-30T04:22:59.034298+00:00",
    "httpStatus": 200,
    "contentSHA256": "f9171f8d9fd67427dce9ee38b8b69f240d5a291bb59243299ebdcaeff9067118",
    "receiptId": "jewish-mishneh",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-JEWISH-MAIMONIDES",
    "source": "Mishneh Torah, Kings and Wars 12, Eliyahu Touger translation, Jerusalem, Moznaim, c1986–2007; API declares CC-BY-NC, Chapter 12:1–2 and 12:4–5; https://www.sefaria.org/Mishneh_Torah%2C_Kings_and_Wars.12.2?lang=bi",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "HTR-ISLAM-QURAN-7",
    "title": "Qur’an 7:187",
    "publisher": "Quran.com / Quran Foundation",
    "edition": "Mustafa Khattab, The Clear Quran, displayed English translation",
    "locator": "Sūrat al-Aʿrāf 7:187",
    "readingDepth": "The displayed verse translation read on 2026-10-30; the abbreviated tafsir preview is not treated as a full commentary reading.",
    "sourceKind": "primary-text-translation",
    "rights": "Copyright or edition-specific rights retained by the publisher/translator. This module stores an original short paraphrase, not the source text; no expanded training licence is inferred.",
    "limitations": [
      "The selected verse does not supply a civil date or resolve all Sunni/Shia eschatological differences.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://quran.com/en/al-araf/187",
    "retrievalURL": "https://quran.com/en/al-araf/187",
    "retrievedAt": "2026-10-30T04:21:58.443354+00:00",
    "httpStatus": 200,
    "contentSHA256": "e212b7c3b6f58f60a5eee5e47f7ce942da738b6c5af766c16241ce258ded4767",
    "receiptId": "islamic-quran",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-ISLAM-QURAN-7",
    "source": "Qur’an 7:187, Mustafa Khattab, The Clear Quran, displayed English translation, Sūrat al-Aʿrāf 7:187; https://quran.com/en/al-araf/187",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "HTR-ISLAM-QURAN-31",
    "title": "Qur’an 31:34",
    "publisher": "Quran.com / Quran Foundation",
    "edition": "Mustafa Khattab, The Clear Quran, displayed English translation",
    "locator": "Sūrat Luqmān 31:34",
    "readingDepth": "The displayed verse translation read on 2026-10-30.",
    "sourceKind": "primary-text-translation",
    "rights": "Copyright or edition-specific rights retained by the publisher/translator. This module stores an original short paraphrase, not the source text; no expanded training licence is inferred.",
    "limitations": [
      "A second verse from the same text and translation is not an independent calendar fixture.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://quran.com/en/luqman/34",
    "retrievalURL": "https://quran.com/en/luqman/34",
    "retrievedAt": "2026-10-30T04:21:58.443977+00:00",
    "httpStatus": 200,
    "contentSHA256": "de0dcf29c0c72b6529a8638b8bf82f96807b378c7e4e9d0a09f732c5423554e7",
    "receiptId": "islamic-quran31",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-ISLAM-QURAN-31",
    "source": "Qur’an 31:34, Mustafa Khattab, The Clear Quran, displayed English translation, Sūrat Luqmān 31:34; https://quran.com/en/luqman/34",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "HTR-HINDU-BHAGAVATA",
    "title": "Śrīmad-Bhāgavatam, canto 12, chapter 2",
    "publisher": "Bhaktivedanta Book Trust / Vedabase",
    "edition": "BBT English Vaiṣṇava translation, chapter overview",
    "locator": "12.2.18–24, especially Kalki/renewal in 18–23 and the celestial condition in 24",
    "readingDepth": "Selected verse translations 18–24 read on 2026-10-30; no whole Purāṇa or cross-recension collation claimed.",
    "sourceKind": "primary-text-translation",
    "rights": "Copyright or edition-specific rights retained by the publisher/translator. This module stores an original short paraphrase, not the source text; no expanded training licence is inferred.",
    "limitations": [
      "12.2.24 describes Sun, Moon and Bṛhaspati in Karkaṭa/Puṣya; no unique Gregorian date, chosen ayanāṃśa, exact contact definition or validated application algorithm is supplied.",
      "A recurring modern angular configuration is not proof of the narrative’s fulfilment.",
      "Inherited passage receipt; this comparison task did not newly retrieve or read the underlying work."
    ],
    "url": "https://vedabase.io/en/library/sb/12/2/",
    "retrievalURL": "https://vedabase.io/en/library/sb/12/2/",
    "retrievedAt": "2026-10-30T04:21:58.449830+00:00",
    "httpStatus": 200,
    "contentSHA256": "676fe078cd0dfc414442612fb6e2a82601092c4a3966e23605647e9cebbaaf28",
    "receiptId": "hindu-bhagavata",
    "receiptPath": "docs/evidence/horizon/traditions/source-receipt.json",
    "accessStatus": "selected-passage-read",
    "claimType": "attributed-reference",
    "fullWorkRead": false,
    "supportsCalendarCalculation": false,
    "readingStatus": "inherited-selected-passages",
    "sourceLineage": "HTR-HINDU-BHAGAVATA",
    "source": "Śrīmad-Bhāgavatam, canto 12, chapter 2, BBT English Vaiṣṇava translation, chapter overview, 12.2.18–24, especially Kalki/renewal in 18–23 and the celestial condition in 24; https://vedabase.io/en/library/sb/12/2/",
    "inheritedFrom": "assets/js/core/data/horizon-traditions.js"
  },
  {
    "id": "EC-SEFER-YETZIRAH",
    "title": "Sefer Yetzirah, chapter 1",
    "author": "Anonymous; Sefaria community translator",
    "edition": "Sefaria Community Translation, API version metadata",
    "locator": "1:1, 1:5 and 1:7",
    "url": "https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en",
    "retrievalURL": "https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en",
    "retrievedAt": "2026-10-30T15:31:56.169206+00:00",
    "contentSHA256": "51d6b696932b3aa341c39e55cdc0cb6519bf77f32c1f6f90248287ff3f4f29e2",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-SEFER-YETZIRAH",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Selected English segments 1, 5 and 7 read; translator notes distinguished from base translation. No full work or manuscript collation.",
    "fullWorkRead": false,
    "rights": "API translation metadata declares CC0; original paraphrase retained with attribution.",
    "limitations": [
      "Community translation, not a critical edition or representative survey of later Kabbalah.",
      "The API declares CC0 for this translation. The original paraphrase does not require republication of its long notes."
    ],
    "source": "Anonymous; Sefaria community translator, Sefer Yetzirah, chapter 1, Sefaria Community Translation, API version metadata, 1:1, 1:5 and 1:7; https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en"
  },
  {
    "id": "EC-BHAGAVATA-DURATIONS",
    "title": "Śrīmad-Bhāgavatam, canto 3, chapter 11",
    "author": "Attributed to Vyāsa; Bhaktivedanta Book Trust translation",
    "edition": "Vedabase BBT English chapter overview",
    "locator": "3.11.18–22",
    "url": "https://vedabase.io/en/library/sb/3/11/",
    "retrievalURL": "https://vedabase.io/en/library/sb/3/11/",
    "retrievedAt": "2026-10-30T15:30:52.742719+00:00",
    "contentSHA256": "9dafb765b0319bc00fcf6ae329748a26108bab10c0b7be4e64eca2cff02dfd3e",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-BHAGAVATA-DURATIONS",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read verse translations 18–22 on the chapter page; no complete Purāṇa reading.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "A named Vaiṣṇava translation; not every Hindu cosmological system."
    ],
    "source": "Attributed to Vyāsa; Bhaktivedanta Book Trust translation, Śrīmad-Bhāgavatam, canto 3, chapter 11, Vedabase BBT English chapter overview, 3.11.18–22; https://vedabase.io/en/library/sb/3/11/"
  },
  {
    "id": "EC-VISHNU-DURATIONS",
    "title": "The Vishnu Purana, Book I, chapter III",
    "author": "Attributed to Parāśara; H. H. Wilson translator",
    "edition": "Wilson 1840 English translation, online transcription",
    "locator": "Printed pp.22–25, especially p.23 on divine years and yuga transitions",
    "url": "https://sacred-texts.com/hin/vp/vp037.htm",
    "retrievalURL": "https://sacred-texts.com/book/the-vishnu-purana/chapter-iii",
    "retrievedAt": "2026-10-30T15:31:56.168714+00:00",
    "contentSHA256": "6da3cdfc179f59559aa65c8bb6ff35c792b4556e8da652f3841cd31246264260",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-VISHNU-DURATIONS",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the main translated time-measure passage pp.22–25; selected calculation note inspected but its typographical anomalies are not adopted.",
    "fullWorkRead": false,
    "rights": "Wilson 1840 translation is public domain; site formatting and later editorial material have separate rights. Original paraphrase only.",
    "limitations": [
      "The old English translation is not a fresh Sanskrit collation.",
      "The excerpt supplies durations, not a selected Julian/Gregorian epoch."
    ],
    "source": "Attributed to Parāśara; H. H. Wilson translator, The Vishnu Purana, Book I, chapter III, Wilson 1840 English translation, online transcription, Printed pp.22–25, especially p.23 on divine years and yuga transitions; https://sacred-texts.com/hin/vp/vp037.htm"
  },
  {
    "id": "EC-MAYA-CALENDAR",
    "title": "The Calendar System",
    "author": "Smithsonian National Museum of the American Indian",
    "edition": "Living Maya Time, current retrieved English page",
    "locator": "Long Count introduction; Haab; Tzolk’in; Calendar Round; example January 1, 2000",
    "url": "https://maya.nmai.si.edu/calendar/calendar-system",
    "retrievalURL": "https://maya.nmai.si.edu/calendar/calendar-system",
    "retrievedAt": "2026-10-30T15:30:52.743891+00:00",
    "contentSHA256": "39cbffb6957a250b29c9fba2f30203f5854247b45ac5624f4233700c5cae74ea",
    "sourceKind": "museum-interpretation",
    "sourceLineage": "smithsonian-nmai",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the named calendar explanation sections, including its Gregorian correspondence; no primary inscription decipherment.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "The Gregorian correlation is reported by this museum source; not independently validated here.",
      "Do not adopt broad biological or astronomical analogies on the page as calibrated measurements."
    ],
    "source": "Smithsonian National Museum of the American Indian, The Calendar System, Living Maya Time, current retrieved English page, Long Count introduction; Haab; Tzolk’in; Calendar Round; example January 1, 2000; https://maya.nmai.si.edu/calendar/calendar-system"
  },
  {
    "id": "EC-MAYA-2012",
    "title": "The Meaning of 2012",
    "author": "Smithsonian National Museum of the American Indian",
    "edition": "Living Maya Time, current retrieved English page",
    "locator": "Opening paragraphs on the 13-baktun completion and Quiriguá/Tortuguero inscriptions",
    "url": "https://maya.nmai.si.edu/2012-resetting-count/meaning-of-2012",
    "retrievalURL": "https://maya.nmai.si.edu/2012-resetting-count/meaning-of-2012",
    "retrievedAt": "2026-10-30T15:32:49.139335+00:00",
    "contentSHA256": "55139432e48e0e38a2c816ccf1612ffcb15eddaa72a8e19ecc5f8ff6f13f7348",
    "sourceKind": "museum-interpretation",
    "sourceLineage": "smithsonian-nmai",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read opening paragraphs and their distinction between cycle completion and catastrophe; no independent inscription reading.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "Same issuing institution as EC-MAYA-CALENDAR, not an independent fixture.",
      "The page’s historic claim that only one inscription was known is not propagated as a current exhaustive inventory."
    ],
    "source": "Smithsonian National Museum of the American Indian, The Meaning of 2012, Living Maya Time, current retrieved English page, Opening paragraphs on the 13-baktun completion and Quiriguá/Tortuguero inscriptions; https://maya.nmai.si.edu/2012-resetting-count/meaning-of-2012"
  },
  {
    "id": "EC-ASCLEPIUS-LAMENT",
    "title": "Asclepius / The Perfect Sermon",
    "author": "Attributed to Hermes Trismegistus; G. R. S. Mead translator",
    "edition": "Thrice-Greatest Hermes, vol.II (1906), Part IX",
    "locator": "XXIV–XXVI, printed pp.351–357",
    "url": "https://sacred-texts.com/gno/th2/th245.htm",
    "retrievalURL": "https://sacred-texts.com/book/thrice-greatest-hermes-vol-2/part-ix",
    "retrievedAt": "2026-10-30T15:32:49.138758+00:00",
    "contentSHA256": "2c28b297cdfe58667d9b971d15c178dfb83f229e583f2d005b5013aadd4c0a73",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-ASCLEPIUS-LAMENT",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read XXIV–XXVI on the lament for Egypt and restoration; not the whole Asclepius or a Latin/Coptic collation.",
    "fullWorkRead": false,
    "rights": "1906 translation is public domain; modern site material retains its own rights. Original paraphrase only.",
    "limitations": [
      "Late-antique Greco-Egyptian Hermetic dialogue; not a survey of pharaonic Egyptian religions.",
      "Mead’s bracketed expansions and philosophical terminology are features of this translation."
    ],
    "source": "Attributed to Hermes Trismegistus; G. R. S. Mead translator, Asclepius / The Perfect Sermon, Thrice-Greatest Hermes, vol.II (1906), Part IX, XXIV–XXVI, printed pp.351–357; https://sacred-texts.com/gno/th2/th245.htm"
  },
  {
    "id": "EC-HESIOD-AGES",
    "title": "Works and Days",
    "author": "Hesiod; Hugh G. Evelyn-White translator",
    "edition": "Hesiod, the Homeric Hymns, and Homerica (1914), Project Gutenberg 348",
    "locator": "Works and Days lines 109–201; especially 170–201",
    "url": "https://www.gutenberg.org/files/348/348-h/348-h.htm",
    "retrievalURL": "https://www.gutenberg.org/files/348/348-h/348-h.htm",
    "retrievedAt": "2026-10-30T15:30:52.745155+00:00",
    "contentSHA256": "8f2159f4eeb830b6dbca7cfaf8d298de3cb4306df0883afb52747a82b1b7372a",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-HESIOD-AGES",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the five-races passage, including the iron race and its narrated end condition; not the whole collection.",
    "fullWorkRead": false,
    "rights": "1914 English translation is public domain in the United States. Original paraphrase only.",
    "limitations": [
      "One poem; not a uniform Greek religious creed."
    ],
    "source": "Hesiod; Hugh G. Evelyn-White translator, Works and Days, Hesiod, the Homeric Hymns, and Homerica (1914), Project Gutenberg 348, Works and Days lines 109–201; especially 170–201; https://www.gutenberg.org/files/348/348-h/348-h.htm"
  },
  {
    "id": "EC-OVID-AGES",
    "title": "Metamorphoses, Book I",
    "author": "Ovid; Samuel Garth, John Dryden et al. translators",
    "edition": "Internet Classics Archive English text",
    "locator": "Headings The Golden Age, The Silver Age, The Brazen Age, The Iron Age and The Deluge",
    "url": "https://classics.mit.edu/Ovid/metam.1.first.html",
    "retrievalURL": "https://classics.mit.edu/Ovid/metam.1.first.html",
    "retrievedAt": "2026-10-30T15:30:52.745708+00:00",
    "contentSHA256": "9764b48be68ef34dfdfbf6567063bc01bd1b55459e1f21ed914915caf8ff700a",
    "sourceKind": "primary-text-translation",
    "sourceLineage": "EC-OVID-AGES",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the metal-age sequence and flood narrative in Book I; not the complete Metamorphoses.",
    "fullWorkRead": false,
    "rights": "Historical translation is public domain; site presentation retains separate rights. Original paraphrase only.",
    "limitations": [
      "The English poetic translation and Ovid’s literary framing are not a universal Roman doctrine."
    ],
    "source": "Ovid; Samuel Garth, John Dryden et al. translators, Metamorphoses, Book I, Internet Classics Archive English text, Headings The Golden Age, The Silver Age, The Brazen Age, The Iron Age and The Deluge; https://classics.mit.edu/Ovid/metam.1.first.html"
  },
  {
    "id": "EC-PIKE-PREFACE",
    "title": "Morals and Dogma of the Ancient and Accepted Scottish Rite of Freemasonry",
    "author": "Albert Pike / Supreme Council, Southern Jurisdiction",
    "edition": "1871 work, online preface transcription",
    "locator": "Preface, printed pp.iii–iv: jurisdiction and freedom to reject teachings",
    "url": "https://sacred-texts.com/mas/md/md01.htm",
    "retrievalURL": "https://sacred-texts.com/book/morals-and-dogma/preface",
    "retrievedAt": "2026-10-30T15:31:56.167287+00:00",
    "contentSHA256": "cb8e9472f1221b13f1cb386f78152cfd3d98ea85e3331a4013b5bb3d06a7133d",
    "sourceKind": "primary-text",
    "sourceLineage": "EC-PIKE-PREFACE",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the preface including compilation, jurisdiction and non-dogmatic teaching qualifications; no full-book reading.",
    "fullWorkRead": false,
    "rights": "1871 work is public domain; modern site material retains its own rights. Original paraphrase only.",
    "limitations": [
      "Does not authorize a claim about every Masonic body.",
      "No future-war timetable is present in the inspected preface; other parts of the book were not exhaustively searched."
    ],
    "source": "Albert Pike / Supreme Council, Southern Jurisdiction, Morals and Dogma of the Ancient and Accepted Scottish Rite of Freemasonry, 1871 work, online preface transcription, Preface, printed pp.iii–iv: jurisdiction and freedom to reject teachings; https://sacred-texts.com/mas/md/md01.htm"
  },
  {
    "id": "EC-PIKE-LETTER-PROVENANCE",
    "title": "Pike and Mazzini",
    "author": "Grand Lodge of British Columbia and Yukon",
    "edition": "Institutional criticism, page updated 17 May 2007",
    "locator": "Opening provenance discussion; closing paragraph on lack of documentation; notes 1–3",
    "url": "https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "retrievalURL": "https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "retrievedAt": "2026-10-30T15:30:53.166500+00:00",
    "contentSHA256": "3bac378a70b69ea45dc52c6d5e39508ff054e4a42c1d50c2ecff0aa9953d678a",
    "sourceKind": "institutional-provenance-criticism",
    "sourceLineage": "EC-PIKE-LETTER-PROVENANCE",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the page’s provenance allegations, quotations and notes; no purported autograph, archive catalogue or original Carr/Miller volume inspected.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "An interested Masonic institution, not an independent archive catalogue.",
      "Its reported British Museum reply is secondhand in this evidence set.",
      "The page cannot serve as authentication of the alleged letter or independent proof of every step in its proposed genealogy."
    ],
    "source": "Grand Lodge of British Columbia and Yukon, Pike and Mazzini, Institutional criticism, page updated 17 May 2007, Opening provenance discussion; closing paragraph on lack of documentation; notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html"
  },
  {
    "id": "EC-LIBER-AL",
    "title": "Liber AL vel Legis / The Book of the Law",
    "author": "Aleister Crowley; revelation attributed by Crowley to Aiwass",
    "edition": "Sacred-texts online transcription; exact base printing not established in this pass",
    "locator": "I:49 and III:34",
    "url": "https://sacred-texts.com/oto/engccxx.htm",
    "retrievalURL": "https://sacred-texts.com/book/the-book-of-the-law-liber-al-vel-legis-sub-figura-ccxx/the-book-of-the-law",
    "retrievedAt": "2026-10-30T15:30:53.303854+00:00",
    "contentSHA256": "a4973183b6b24628b41a6db1e729974138311aedbfb6ac596230ad4405b7b994",
    "sourceKind": "primary-text-transcription",
    "sourceLineage": "EC-LIBER-AL",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read I:49 and III:34 concerning the Equinox of the Gods and a subsequent change; no full-work or manuscript collation.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "Unestablished base printing: paraphrase only, no edition-level textual-variant claim.",
      "Religious revelation is reported as attribution, not independently established causation."
    ],
    "source": "Aleister Crowley; revelation attributed by Crowley to Aiwass, Liber AL vel Legis / The Book of the Law, Sacred-texts online transcription; exact base printing not established in this pass, I:49 and III:34; https://sacred-texts.com/oto/engccxx.htm"
  },
  {
    "id": "EC-COS-FAQ",
    "title": "F.A.Q. Fundamental Beliefs",
    "author": "Church of Satan",
    "edition": "Current official organizational webpage",
    "locator": "Opening What do you believe? discussion and Satan-as-symbol paragraph",
    "url": "https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "retrievalURL": "https://churchofsatan.com/faq-fundamental-beliefs/",
    "retrievedAt": "2026-10-30T15:30:53.304418+00:00",
    "contentSHA256": "490ee1a53fe4745daee7f61fa776983bc4344934ef45bb40c52aa3d9a27566e2",
    "sourceKind": "official-community-self-description",
    "sourceLineage": "EC-COS-FAQ",
    "accessStatus": "selected-passage-read",
    "readingStatus": "selected-passages",
    "readingDepth": "Read the opening belief answers; later polemics about who may use the term Satanism are not adopted as neutral taxonomy.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "One organization’s atheist self-description; it cannot stand for all Satanism, all Left-Hand Path groups or theistic currents.",
      "The selected page is not an eschatological calendar treatise."
    ],
    "source": "Church of Satan, F.A.Q. Fundamental Beliefs, Current official organizational webpage, Opening What do you believe? discussion and Satan-as-symbol paragraph; https://www.churchofsatan.com/faq-fundamental-beliefs/"
  }
];

export const ESCHATOLOGY_COMPARISON_SOURCES = freeze([...COMPARISON_SOURCES, newtonPrimary]);

export const ESCHATOLOGY_COMPARISONS = freeze([
  {
    "id": "EC-NEWTON-CHRISTIAN",
    "familyId": "christian",
    "label": "Newton’s Christian chronology",
    "claimType": "historical-source-assertion",
    "summary": "Newton’s selected argument gives 2060 as a conditional lower bound for his interpreted 1,260-year period and explicitly allows that period to end later. This is a private theological chronology, alongside Christian texts that withhold a known day or hour.",
    "calendarChronology": {
      "kind": "historical-prophetic-year-arithmetic",
      "description": "The chronology calculation belongs to Newton’s named manuscript assumptions. It is not Gregorian feast computation or a date derived from planetary positions."
    },
    "dateClaim": {
      "precision": "year",
      "value": "2060",
      "start": null,
      "end": null,
      "calendar": "Anno Domini year; no month or day supplied",
      "qualifier": "Conditional lower bound for the selected 1,260-year argument; the period may end later. Not an exact-event or physical-world ending prediction."
    },
    "authority": {
      "scope": "Newton’s manuscript interpretation and Mark 13:32–37; not a shared Christian timetable.",
      "communityConsensus": false
    },
    "variants": [
      "Mark 13:32–37 withholds the known day/hour; Newton’s chronological hypothesis is not substituted for that text."
    ],
    "reading": {
      "status": "mixed-source-owner-and-inherited-selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "NC-YAHUDA-7-3G",
      "HTR-CHRISTIAN-MARK"
    ],
    "source": "Isaac Newton, Yahuda Ms.7.3g, f.13v, paragraph 81 (Newton Project THEM00437); Mark 13:32–37, NABRE; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437#par81 ; https://bible.usccb.org/bible/mark/13",
    "limitations": [
      "A year-level lower bound is not an exact day, a probability, a physical-world ending or a verified outcome.",
      "Other manuscript arguments concern distinct periods and bounds; this row is not their merged result.",
      "Newton source reading belongs to the separately named source-owner receipt; Mark receipt is inherited.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-JEWISH-RABBINIC",
    "familyId": "jewish",
    "label": "Jewish messianism · selected rabbinic limits",
    "claimType": "historical-source-assertion",
    "summary": "The selected Talmudic discussion preserves competing expectations and criticism of failed deadlines. Maimonides cautions against calculating the appointed time.",
    "calendarChronology": {
      "kind": "undated-messianic-discussion",
      "description": "Hebrew civil-year and festival calculations are separate from these debates about redemption."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Sanhedrin 97b and Maimonides, Kings and Wars 12; not all Jewish beliefs.",
      "communityConsensus": false
    },
    "variants": [
      "Multiple Talmudic speakers and Maimonides are not a single unanimous chronological method."
    ],
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "HTR-JEWISH-SANHEDRIN",
      "HTR-JEWISH-MAIMONIDES"
    ],
    "source": "Babylonian Talmud, Sanhedrin 97b, especially 97b:9; Maimonides, Mishneh Torah, Kings and Wars 12:1–2; https://www.sefaria.org/Sanhedrin.97b.9 ; https://www.sefaria.org/Mishneh_Torah%2C_Kings_and_Wars.12.2",
    "limitations": [
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-JEWISH-YETZIRAH",
    "familyId": "jewish",
    "label": "Sefer Yetzirah · symbolic beginning and end",
    "claimType": "historical-source-assertion",
    "summary": "The selected passages describe creation through letters and sefirot, depths of beginning and end, and an end joined to a beginning. They do not furnish a dated messianic deadline.",
    "calendarChronology": {
      "kind": "symbolic-cosmology",
      "description": "Symbolic number and letter structure is not itself an elapsed-year chronology. No gematria-to-event-date rule is implemented."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Selected Sefer Yetzirah passages; a precursor text received in later Kabbalah, not all Jewish or Hermetic Kabbalah.",
      "communityConsensus": false
    },
    "variants": [
      "The community translation notes textual variants; this comparison does not select a critical recension.",
      "Later Jewish Kabbalah and Hermetic Qabalah require distinct sources and are not collapsed into this excerpt."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-SEFER-YETZIRAH"
    ],
    "source": "Sefer Yetzirah 1:1, 1:5, 1:7, Sefaria Community Translation; https://www.sefaria.org/Sefer_Yetzirah.1",
    "limitations": [
      "Single community translation inspected; no independent manuscript or later messianic Kabbalah survey.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-HINDU-YUGA",
    "familyId": "hindu",
    "label": "Hindu yuga durations · selected Purāṇic accounts",
    "claimType": "historical-source-assertion",
    "summary": "The checked passages describe four ages totaling 12,000 divine years, with Kali accounting for 1,200 including its transitions. The renewal narrative does not become a near-term Gregorian deadline.",
    "calendarChronology": {
      "kind": "unanchored-cosmological-duration",
      "description": "Viṣṇu Purāṇa I.3 distinguishes divine years and mortal time and includes transitional portions. Bhāgavata 3.11.18–20 states the same four-age total; Bhāgavata 12.2.18–24 supplies a separate renewal narrative. No epoch or day boundary is selected here."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Two named Purāṇic translations; not every Hindu school or modern yuga reinterpretation.",
      "communityConsensus": false
    },
    "variants": [
      "Wilson explicitly separates the age from its dawn and twilight; the BBT totals include these transitions.",
      "Different modern shorter-cycle schemes have not been authenticated in this reading and are not substituted."
    ],
    "reading": {
      "status": "mixed-selected-and-inherited-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-BHAGAVATA-DURATIONS",
      "EC-VISHNU-DURATIONS",
      "HTR-HINDU-BHAGAVATA"
    ],
    "source": "Śrīmad-Bhāgavatam 3.11.18–22 and 12.2.18–24; Viṣṇu Purāṇa I.3, Wilson (1840), pp.22–25; https://vedabase.io/en/library/sb/3/11/ ; https://sacred-texts.com/hin/vp/vp037.htm",
    "limitations": [
      "No verified Kali epoch, regional chronology or Gregorian endpoint is encoded.",
      "The Bhāgavata 12.2.24 celestial condition remains an attributed, unimplemented textual condition.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false,
    "textualQuantities": [
      {
        "label": "Four-yuga aggregate including transitions",
        "value": 12000,
        "unit": "divine-years",
        "epoch": null,
        "sourceIds": [
          "EC-BHAGAVATA-DURATIONS",
          "EC-VISHNU-DURATIONS"
        ],
        "source": "Bhāgavata 3.11.18–20; Viṣṇu Purāṇa I.3, Wilson p.23."
      },
      {
        "label": "Kali-yuga including transitions",
        "value": 1200,
        "unit": "divine-years",
        "epoch": null,
        "sourceIds": [
          "EC-BHAGAVATA-DURATIONS",
          "EC-VISHNU-DURATIONS"
        ],
        "source": "Bhāgavata 3.11.19–20; Viṣṇu Purāṇa I.3, Wilson p.23: 1000 +100 +100."
      }
    ]
  },
  {
    "id": "EC-MAYA-LONG-COUNT",
    "familyId": "maya",
    "label": "Maya Long Count · cycle completion",
    "claimType": "historical-source-assertion",
    "summary": "The Smithsonian dates a 13-baktun completion to 21 December 2012 and distinguishes that calendar milestone from catastrophic interpretations. This is a reported historical correspondence.",
    "calendarChronology": {
      "kind": "reported-calendar-cycle",
      "description": "Long Count, Haab, Tzolk’in and Calendar Round are distinct interlocking counts. This comparison reports the museum’s correspondence; it does not provide an independently validated Long Count converter."
    },
    "dateClaim": {
      "precision": "exact-date",
      "value": "2012-12-21",
      "start": null,
      "end": null,
      "calendar": "Gregorian date reported by Smithsonian NMAI",
      "qualifier": "Historical calendar-cycle correspondence, not an apocalypse or a newly calculated conversion."
    },
    "authority": {
      "scope": "Smithsonian NMAI interpretation with named Maya calendrical contexts; not all Maya communities.",
      "communityConsensus": false
    },
    "variants": [
      "Two museum pages share one institutional lineage; they are not independent conversion fixtures.",
      "Correlation constants and community day-boundary variants are not silently selected."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-MAYA-CALENDAR",
      "EC-MAYA-2012"
    ],
    "source": "Smithsonian NMAI, Living Maya Time, The Calendar System and The Meaning of 2012; https://maya.nmai.si.edu/calendar/calendar-system ; https://maya.nmai.si.edu/2012-resetting-count/meaning-of-2012",
    "limitations": [
      "No primary glyphs were independently translated in this task.",
      "No modern conversion or future catastrophe rule is implemented.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-EGYPT-HERMETIC",
    "familyId": "egyptian",
    "label": "Egypt · the Hermetic lament and renewal",
    "claimType": "historical-source-assertion",
    "summary": "Asclepius describes Egypt’s cultic decline and a divine restoration of the cosmos. The selected passage provides a narrative sequence, without a civil date for its fulfillment.",
    "calendarChronology": {
      "kind": "undated-decline-and-renewal",
      "description": "The text’s set course of time is not an explicit day-count, epoch or historical Egyptian civil-calendar conversion."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Late-antique Greco-Egyptian Hermetic dialogue in Mead’s translation; pharaonic Egyptian traditions are not represented by this alone.",
      "communityConsensus": false
    },
    "variants": [
      "A text attributed to Hermes is not a recovered statement by one historical Egyptian author.",
      "Mead’s bracketed interpretive additions remain translation features."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-ASCLEPIUS-LAMENT"
    ],
    "source": "Asclepius XXIV–XXVI, in G. R. S. Mead, Thrice-Greatest Hermes II (1906), pp.351–357; https://sacred-texts.com/gno/th2/th245.htm",
    "limitations": [
      "Only this late-antique text is represented; no pharaonic calendar or universal Egyptian eschatology is inferred.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-GRECO-ROMAN-AGES",
    "familyId": "greco-roman",
    "label": "Greek and Roman ages · different literary sequences",
    "claimType": "historical-source-assertion",
    "summary": "Hesiod describes five races including heroes and the iron race; Ovid describes four metal ages followed by a flood narrative. These are distinct literary accounts, not a common dated world-cycle formula.",
    "calendarChronology": {
      "kind": "literary-age-sequences",
      "description": "The selected poems give no shared epoch or calibrated duration that can place the narrated transformations on a modern calendar."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Hesiod, Works and Days, and Ovid, Metamorphoses I; not all Greek and Roman philosophies or cults.",
      "communityConsensus": false
    },
    "variants": [
      "Hesiod includes a heroic race; Ovid’s metal-age sequence omits that corresponding stage.",
      "Stoic conflagration and other philosophical cycles are outside this selected comparison."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-HESIOD-AGES",
      "EC-OVID-AGES"
    ],
    "source": "Hesiod, Works and Days 109–201, Evelyn-White (1914); Ovid, Metamorphoses I, metal ages and Deluge, Garth/Dryden et al.; https://www.gutenberg.org/files/348/348-h/348-h.htm ; https://classics.mit.edu/Ovid/metam.1.first.html",
    "limitations": [
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-ISLAMIC-HOUR",
    "familyId": "islamic",
    "label": "Islam · knowledge of the Hour",
    "claimType": "historical-source-assertion",
    "summary": "The selected Qur’anic verses reserve knowledge of the Hour to God. They do not reveal a humanly calculated deadline.",
    "calendarChronology": {
      "kind": "undated-eschatological-knowledge",
      "description": "Hijri year/month conversion, observed crescents and projected observances do not supply the Hour’s date."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Qur’an 7:187 and 31:34, Mustafa Khattab translation; detailed Sunni and Shia traditions not surveyed.",
      "communityConsensus": false
    },
    "variants": [
      "Two verses in one text and translation are not independent date fixtures.",
      "Mahdi and sign traditions require their own named sources and are not synthesized here."
    ],
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "HTR-ISLAM-QURAN-7",
      "HTR-ISLAM-QURAN-31"
    ],
    "source": "Qur’an 7:187 and 31:34, Mustafa Khattab, The Clear Quran; https://quran.com/en/al-araf/187 ; https://quran.com/en/luqman/34",
    "limitations": [
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-MASONIC-PIKE",
    "familyId": "masonic",
    "label": "Pike · authentic text and an unsupported letter",
    "claimType": "historical-source-assertion",
    "summary": "The authentic Morals and Dogma preface identifies its Southern Jurisdiction setting and allows readers to reject teachings. The alleged three-world-wars letter has no authenticated primary document in this evidence set.",
    "calendarChronology": {
      "kind": "provenance-gap-no-timetable",
      "description": "No calendar, war sequence or future date is derived from the alleged letter. The authentic preface does not establish such a chronology."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Pike’s preface plus a Grand Lodge provenance criticism; neither speaks for every Masonic body.",
      "communityConsensus": false
    },
    "variants": [
      "The institutional criticism is not itself the alleged letter or an independent archival response."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-PIKE-PREFACE",
      "EC-PIKE-LETTER-PROVENANCE"
    ],
    "source": "Albert Pike, Morals and Dogma (1871), Preface pp.iii–iv; Grand Lodge of British Columbia and Yukon, Pike and Mazzini (updated 2007); https://sacred-texts.com/mas/md/md01.htm ; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "limitations": [
      "No autograph, archival shelfmark, original Carr/Miller passage or independently inspected British Museum reply was established.",
      "No inference about hidden national deities, secret control, collective guilt or planned modern wars follows.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false,
    "provenanceGap": {
      "claim": "Purported Pike–Mazzini three-world-wars letter",
      "status": "unauthenticated-primary-document-not-established",
      "authenticatedDocumentURL": null,
      "archiveIdentifier": null,
      "supportsEventPrediction": false,
      "sourceIds": [
        "EC-PIKE-LETTER-PROVENANCE"
      ],
      "source": "Grand Lodge of BC and Yukon, Pike and Mazzini; checked institutional criticism only, not original correspondence."
    }
  },
  {
    "id": "EC-WESTERN-THELEMA",
    "familyId": "western-esoteric",
    "label": "Thelema · an undated aeon succession",
    "claimType": "historical-source-assertion",
    "summary": "Liber AL I:49 and III:34 describe the Equinox of the Gods and a later succession. The selected verses give no calendar deadline for that future change.",
    "calendarChronology": {
      "kind": "religious-aeon-language",
      "description": "The text’s Great Equinox is not assigned an astronomical precession threshold or a reproducible civil date in this comparison."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "Selected Crowley scripture as a Thelemic source; not all Western esotericism or all Left-Hand Path currents.",
      "communityConsensus": false
    },
    "variants": [
      "The exact base printing of this transcription was not established; no manuscript-level variant is settled.",
      "Religious aeon terminology and measured astronomical precession are separate claims."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-LIBER-AL"
    ],
    "source": "Aleister Crowley, Liber AL vel Legis I:49 and III:34, inspected online transcription; https://sacred-texts.com/oto/engccxx.htm",
    "limitations": [
      "No duration of the aeon or forecast from the Egyptian divine names is inferred.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  },
  {
    "id": "EC-LHP-SELECTED",
    "familyId": "western-esoteric",
    "label": "Left-Hand Path comparison · one Satanist self-description",
    "claimType": "historical-source-assertion",
    "summary": "The Church of Satan describes itself as atheist and Satan as a symbol. The inspected belief answers provide no end-time calendar; this limited example does not define all Left-Hand Path traditions.",
    "calendarChronology": {
      "kind": "no-timetable-in-selected-source",
      "description": "No common Left-Hand Path calendar or eschatological algorithm is established by this source."
    },
    "dateClaim": {
      "precision": "unknown",
      "value": null,
      "start": null,
      "end": null,
      "calendar": null,
      "qualifier": "No modern calendar date is established by the selected passages."
    },
    "authority": {
      "scope": "One organization’s current self-description; the wider Left-Hand Path label and theistic groups remain unassessed.",
      "communityConsensus": false
    },
    "variants": [
      "The organization’s exclusionary definition of Satanism is not adopted as neutral taxonomy.",
      "Thelema, atheistic Satanism and other Left-Hand Path currents are not treated as interchangeable."
    ],
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "sourceIds": [
      "EC-COS-FAQ"
    ],
    "source": "Church of Satan, F.A.Q. Fundamental Beliefs, opening belief answers; https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "limitations": [
      "No good/dark moral scale is assigned to religions, populations or countries.",
      "This one webpage is not a survey of Left-Hand Path eschatology.",
      "Selected textual comparison, not an exhaustive account of this tradition.",
      "Calendar labels and textual quantities do not establish predictive validity or a physical mechanism."
    ],
    "calculatorRule": null,
    "contributesToRanking": false,
    "physicalMechanism": false
  }
]);

export const ESCHATOLOGY_COMPARISON_COVERAGE = freeze({
  "kind": "selected-attributed-comparisons",
  "recordCount": 11,
  "familyIds": [
    "christian",
    "jewish",
    "hindu",
    "maya",
    "egyptian",
    "greco-roman",
    "islamic",
    "masonic",
    "western-esoteric"
  ],
  "completeReligionsSurvey": false,
  "fullWorksRead": false,
  "humanReligiousAuthorityReview": false,
  "contributesToRanking": false,
  "physicalMechanismEstablished": false,
  "dateRulesImplemented": 0,
  "selectedDateClaims": [
    "Newton’s conditional year-level lower bound; date arithmetic is owned by the separate Newton chronology engine.",
    "Smithsonian’s reported historical Maya cycle correspondence; no independent Long Count converter is supplied."
  ],
  "notAssessed": [
    "Pharaonic Egyptian source traditions beyond the explicitly late-antique Hermetic example",
    "Later Jewish messianic Kabbalah and competing recensions beyond selected Sefer Yetzirah segments",
    "All Hindu schools and modern shorter-yuga interpretations",
    "Maya inscription decipherment, independent epoch fixtures and community boundary variants",
    "Stoic and other Greco-Roman philosophical cycles",
    "Detailed Sunni/Shia eschatological traditions",
    "Masonic jurisdictions beyond the selected Pike preface and institutional criticism",
    "Theistic and other Left-Hand Path currents beyond the named organizational example",
    "Religions and Indigenous traditions outside this requested selected sample"
  ],
  "source": "Project-authored coverage statement; docs/2026-10-eschatology-comparisons.md."
});

export function eschatologyComparisonById(id) {
  return typeof id === 'string' ? ESCHATOLOGY_COMPARISONS.find(item => item.id === id) || null : null;
}
