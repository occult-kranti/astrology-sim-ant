// Selected source-led tradition evidence, with separate date roles and typed links.
// Public source passages and inherited receipts; not all books, traditions or groups.
// Dates are display/order metadata. No forecast, causal network or moral score.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};

export const ESCHATOLOGY_TRADITION_ENTITIES = freeze([
  {
    "id": "TR-E-JEWISH-KABBALAH",
    "label": "Jewish Kabbalah · selected textual traditions",
    "kind": "tradition",
    "familyId": "jewish-kabbalah",
    "description": "A scoped label for the Jewish texts and practices described in the selected sources; not a single institution or unanimous eschatology.",
    "sourceIds": [
      "TRS-PICO-SEP",
      "EC-SEFER-YETZIRAH"
    ],
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/ | Anonymous; Sefaria community translator, Sefer Yetzirah, chapter 1, Sefaria Community Translation, API version metadata, 1:1, 1:5 and 1:7; https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en",
    "limitations": [
      "Later messianic traditions, recensions and communities are not comprehensively surveyed."
    ]
  },
  {
    "id": "TR-E-SEFER-YETZIRAH",
    "label": "Sefer Yetzirah",
    "kind": "work",
    "familyId": "jewish-kabbalah",
    "description": "Named Jewish work received through differing recensions and later translations; Pike’s spelling Sephar Yezirah is a bibliographic variant.",
    "sourceIds": [
      "EC-SEFER-YETZIRAH",
      "TRS-WESTCOTT-SY"
    ],
    "source": "Anonymous; Sefaria community translator, Sefer Yetzirah, chapter 1, Sefaria Community Translation, API version metadata, 1:1, 1:5 and 1:7; https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en | W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm",
    "limitations": [
      "No full-book, original-language or manuscript collation in this atlas."
    ]
  },
  {
    "id": "TR-E-ZOHAR",
    "label": "Zohar",
    "kind": "work",
    "familyId": "jewish-kabbalah",
    "description": "Named Jewish textual corpus; the Mathers title names three selections, and Pike’s Sohar spelling does not identify a particular edition.",
    "sourceIds": [
      "TRS-MATHERS-TITLE",
      "TRS-MATHERS-PREFACE"
    ],
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page | M. MacGregor Mathers (Moina Mathers), The Kabbalah Unveiled, Preface to the New Edition, Undated later-edition preface on a site whose title is labeled [1912], Opening paragraphs: late husband’s death in 1918; first edition in 1887; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "limitations": [
      "Named corpus only: no complete Zohar reading or authenticated composition date is claimed."
    ]
  },
  {
    "id": "TR-E-PICO",
    "label": "Giovanni Pico della Mirandola",
    "kind": "person",
    "familyId": "christian-kabbalah",
    "description": "Author discussed by Copenhaver as adapting selected Jewish material into Christian Kabbalah.",
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "limitations": []
  },
  {
    "id": "TR-E-PICO-CONCLUSIONS",
    "label": "Pico’s Conclusions",
    "kind": "work",
    "familyId": "christian-kabbalah",
    "description": "The 900 Conclusions printed in 1486; selected Kabbalist propositions discussed through modern scholarship.",
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "limitations": [
      "The original printed Conclusions were not newly read."
    ]
  },
  {
    "id": "TR-E-PICO-HEPTAPLUS",
    "label": "Pico’s Heptaplus",
    "kind": "work",
    "familyId": "christian-kabbalah",
    "description": "Pico’s 1489 Genesis commentary; selected discussion of Kabbalist allegory and cyclical symbolism.",
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "limitations": [
      "No numerical cosmic-cycle epoch or endpoint is supplied by this module."
    ]
  },
  {
    "id": "TR-E-KNORR-DENUDATA",
    "label": "Knorr von Rosenroth’s Kabbala Denudata",
    "kind": "work",
    "familyId": "christian-kabbalah",
    "description": "Latin intermediary expressly named on Mathers’s translation title.",
    "sourceIds": [
      "TRS-MATHERS-TITLE"
    ],
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "limitations": [
      "The Latin volumes were not retrieved or read in this atlas lane."
    ]
  },
  {
    "id": "TR-E-MATHERS-UNVEILED",
    "label": "Mathers’s Kabbalah Unveiled",
    "kind": "work",
    "familyId": "hermetic-qabalah",
    "description": "English occult reception through a named Latin intermediary; the retrieved site combines inconsistent edition-date metadata.",
    "sourceIds": [
      "TRS-MATHERS-TITLE",
      "TRS-MATHERS-PREFACE"
    ],
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page | M. MacGregor Mathers (Moina Mathers), The Kabbalah Unveiled, Preface to the New Edition, Undated later-edition preface on a site whose title is labeled [1912], Opening paragraphs: late husband’s death in 1918; first edition in 1887; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "limitations": []
  },
  {
    "id": "TR-E-WESTCOTT-YETZIRAH",
    "label": "Westcott’s Sepher Yetzirah translation",
    "kind": "work",
    "familyId": "hermetic-qabalah",
    "description": "English translation presented under an 1887 heading; an occult reception distinct from all Jewish recensions.",
    "sourceIds": [
      "TRS-WESTCOTT-SY"
    ],
    "source": "W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm",
    "limitations": []
  },
  {
    "id": "TR-E-BAAL-TITLE",
    "label": "Baal · a title with several referents",
    "kind": "term",
    "familyId": "ancient-ugaritic",
    "description": "A scholarly distinction between the title lord/master and particular local divine names.",
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": [
      "Not a named modern institution, a nation’s secret religion or a synonym for every use of Satan."
    ]
  },
  {
    "id": "TR-E-BAAL-HADDU",
    "label": "Baal Haddu in Ugaritic stories",
    "kind": "deity-in-text",
    "familyId": "ancient-ugaritic",
    "description": "The deity discussed in the selected scholarly account of Ugaritic stories, distinct from every local bearer of the title Baal.",
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": []
  },
  {
    "id": "TR-E-UGARIT-CORPUS",
    "label": "Ugaritic Baal narratives · selected scholarly account",
    "kind": "textual-corpus",
    "familyId": "ancient-ugaritic",
    "description": "Ancient stories discussed through Ballentine’s article; no new tablet translation or prophecy date.",
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": []
  },
  {
    "id": "TR-E-BALLENTINE-BAAL",
    "label": "Ballentine’s Baal article",
    "kind": "publication",
    "familyId": "ancient-ugaritic",
    "description": "A modern scholarly article dated 17 November 2015, separate from the ancient material it describes.",
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": []
  },
  {
    "id": "TR-E-COS",
    "label": "Church of Satan",
    "kind": "organization",
    "familyId": "church-of-satan",
    "description": "A specific modern organization whose own pages describe atheism, symbolic Satan and a 1966 founding-era claim.",
    "sourceIds": [
      "TRS-COS-ORGANIZATION",
      "TRS-COS-BELIEFS"
    ],
    "source": "Church of Satan, F.A.Q. About the Organization, Current official webpage; no publication date established, Opening What is the Church of Satan? answer; https://www.churchofsatan.com/faq-about-the-organization/ | Church of Satan, F.A.Q. Fundamental Beliefs, Current official webpage; no publication date established, Opening belief and Satan-as-symbol paragraphs; atheism in sacrifice answer; https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "limitations": [
      "Its self-definition is not adopted as neutral taxonomy for all Satanism."
    ]
  },
  {
    "id": "TR-E-TST",
    "label": "The Satanic Temple",
    "kind": "organization",
    "familyId": "satanic-temple",
    "description": "A separate modern organization whose official pages describe nontheistic symbolism and seven tenets.",
    "sourceIds": [
      "TRS-TST-FAQ",
      "TRS-TST-TENETS"
    ],
    "source": "The Satanic Temple, Frequently Asked Questions, Current official webpage; no publication date established, Do you worship Satan? and What does Satan mean to TST? answers; https://thesatanictemple.com/pages/faq | The Satanic Temple, About Us / Seven Fundamental Tenets, Current official webpage; no publication date established, Mission paragraph and Seven Fundamental Tenets; https://thesatanictemple.com/pages/about-us",
    "limitations": [
      "No common leadership, identity or shared institution with the Church of Satan is inferred."
    ]
  },
  {
    "id": "TR-E-THELEMA",
    "label": "Thelema · U.S. O.T.O. description",
    "kind": "tradition",
    "familyId": "thelema",
    "description": "A named Thelemic institutional description, including a religious epoch and an equinox-based calendar.",
    "sourceIds": [
      "TRS-OTO-THELEMA",
      "TRS-OTO-CALENDAR"
    ],
    "source": "U.S. Grand Lodge, Ordo Templi Orientis, Thelema, Current official webpage, Opening paragraph: founding in 1904 and difficulty of blanket statements; https://oto-usa.org/thelema/ | U.S. Grand Lodge, Ordo Templi Orientis, Thelemic Calendar, Current official webpage, Opening four paragraphs: 1904 epoch, equinox boundary, zero-based 22-year docosades and 1996 example; https://oto-usa.org/thelema/calendar/",
    "limitations": []
  },
  {
    "id": "TR-E-LIBER-AL",
    "label": "Liber AL vel Legis",
    "kind": "work",
    "familyId": "thelema",
    "description": "Crowley’s religious text, with a separately inherited selected reading of I:49 and III:34.",
    "sourceIds": [
      "EC-LIBER-AL"
    ],
    "source": "Aleister Crowley; revelation attributed by Crowley to Aiwass, Liber AL vel Legis / The Book of the Law, Sacred-texts online transcription; exact base printing not established in this pass, I:49 and III:34; https://sacred-texts.com/oto/engccxx.htm",
    "limitations": [
      "The exact base printing of the inherited transcription was not established."
    ]
  },
  {
    "id": "TR-E-NEWTON",
    "label": "Isaac Newton · selected chronology",
    "kind": "person",
    "familyId": "christian-newton",
    "description": "Newton as author of the selected historical theological arguments, separate from modern scientific validation.",
    "sourceIds": [
      "NC-YAHUDA-7-3G",
      "NC-OBS-1733-I-II"
    ],
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437. | Isaac Newton, Observations upon the Prophecies of Daniel, Part I, Chapter II: Of the Prophetic Language (THEM00196); London 1733 posthumous edition, Newton Project normalized transcription; Printed pp. 16–23, especially pp. 16–17 political-world analogy and pp. 21–22 days-for-years passage; https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196.",
    "limitations": []
  },
  {
    "id": "TR-E-NEWTON-YAHUDA-7-3G",
    "label": "Newton, Yahuda Ms.7.3g",
    "kind": "manuscript",
    "familyId": "christian-newton",
    "description": "The manuscript unit containing the active conditional 2060 lower-bound paragraph.",
    "sourceIds": [
      "NC-YAHUDA-7-3G"
    ],
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437.",
    "limitations": []
  },
  {
    "id": "TR-E-NEWTON-YAHUDA-7-3O",
    "label": "Newton, Yahuda Ms.7.3o",
    "kind": "manuscript",
    "familyId": "christian-newton",
    "description": "A different manuscript unit with the separate 2300-year argument and unresolved textual lines.",
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "limitations": []
  },
  {
    "id": "TR-E-NEWTON-OBSERVATIONS",
    "label": "Newton’s Observations, Part I chapter II",
    "kind": "work",
    "familyId": "christian-newton",
    "description": "Selected chapter from the 1733 posthumous publication on prophetic language.",
    "sourceIds": [
      "NC-OBS-1733-I-II"
    ],
    "source": "Isaac Newton, Observations upon the Prophecies of Daniel, Part I, Chapter II: Of the Prophetic Language (THEM00196); London 1733 posthumous edition, Newton Project normalized transcription; Printed pp. 16–23, especially pp. 16–17 political-world analogy and pp. 21–22 days-for-years passage; https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196.",
    "limitations": []
  }
]);

export const ESCHATOLOGY_TRADITION_CLAIMS = freeze([
  {
    "id": "TR-C-SY-UNDATED",
    "familyId": "jewish-kabbalah",
    "kind": "attributed-report",
    "title": "Beginning and end in selected Sefer Yetzirah passages",
    "text": "The selected passages describe beginning/end as cosmological dimensions and an end joined to a beginning. They do not supply a modern event date.",
    "subjectIds": [
      "TR-E-SEFER-YETZIRAH",
      "TR-E-JEWISH-KABBALAH"
    ],
    "sourceIds": [
      "EC-SEFER-YETZIRAH",
      "TRS-WESTCOTT-SY"
    ],
    "locator": "Sefer Yetzirah 1:5 and 1:7; Westcott chapter1 paragraphs5 and7",
    "source": "Anonymous; Sefaria community translator, Sefer Yetzirah, chapter 1, Sefaria Community Translation, API version metadata, 1:1, 1:5 and 1:7; https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en | W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm",
    "reading": {
      "status": "mixed-fresh-and-inherited-selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": null,
    "supports": "A named textual comparison with differing translations.",
    "cannotEstablish": "A universal Kabbalist eschatology, an elapsed-year formula or a target date.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "EC-SEFER-YETZIRAH",
        "originSourceId": "EC-SEFER-YETZIRAH",
        "sourceFamily": "EC-SEFER-YETZIRAH",
        "dependencyType": "reproduction",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      },
      {
        "sourceId": "TRS-WESTCOTT-SY",
        "originSourceId": "TRS-WESTCOTT-SY",
        "sourceFamily": "TRS-WESTCOTT-SY",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "No critical recension or original composition date is selected."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-PICO-1486",
    "familyId": "christian-kabbalah",
    "kind": "attributed-report",
    "title": "1486: Pico’s Conclusions and Christian adaptation",
    "text": "Copenhaver dates the printing of Pico’s Conclusions to the end of 1486 and describes his transformation of selected Jewish Kabbalist material into Christian claims.",
    "subjectIds": [
      "TR-E-PICO",
      "TR-E-PICO-CONCLUSIONS",
      "TR-E-JEWISH-KABBALAH"
    ],
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "locator": "Sections1 and2.3",
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1486",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "documented",
        "label": "Conclusions printed in Rome",
        "qualifier": "Year only; no month, day or clock is supplied.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "printed in Rome at the end of 1486",
    "supports": "A scholarly account of publication and textual reception.",
    "cannotEstablish": "Agreement of Jewish and Christian doctrine, institutional coordination or direct reading of the original theses.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-PICO-SEP",
        "originSourceId": "TRS-PICO-SEP",
        "sourceFamily": "TRS-PICO-SEP",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "No month/day is manufactured from end of 1486."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-PICO-1489",
    "familyId": "christian-kabbalah",
    "kind": "attributed-report",
    "title": "1489: Heptaplus and an unanchored allegorical cycle",
    "text": "Copenhaver dates the Heptaplus to 1489 and discusses Kabbalist cyclical imagery as part of Pico’s allegory of mystical union. This does not date a future cosmic event.",
    "subjectIds": [
      "TR-E-PICO",
      "TR-E-PICO-HEPTAPLUS"
    ],
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "locator": "Section2.3, opening and Great Jubilee/final-age discussion",
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1489",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "documented",
        "label": "Heptaplus publication",
        "qualifier": "Year only; no month, day or clock is supplied.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "Heptaplus (1489)",
    "supports": "The publication year and a scholarly interpretation of named textual symbolism.",
    "cannotEstablish": "An independently read primary passage, physical cosmic period, fixed epoch or target date.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-PICO-SEP",
        "originSourceId": "TRS-PICO-SEP",
        "sourceFamily": "TRS-PICO-SEP",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "Symbolic cycle numbers are not exposed as a date-rule calculator."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-MATHERS-1887",
    "familyId": "hermetic-qabalah",
    "kind": "attributed-report",
    "title": "1887 first edition reported by a later preface",
    "text": "Moina Mathers’s later preface says the first edition appeared in 1887. The title identifies the English work as translated through Knorr von Rosenroth’s Latin version and names three Zohar selections.",
    "subjectIds": [
      "TR-E-MATHERS-UNVEILED",
      "TR-E-KNORR-DENUDATA",
      "TR-E-ZOHAR"
    ],
    "sourceIds": [
      "TRS-MATHERS-PREFACE",
      "TRS-MATHERS-TITLE"
    ],
    "locator": "Preface opening paragraphs; title translation statement",
    "source": "M. MacGregor Mathers (Moina Mathers), The Kabbalah Unveiled, Preface to the New Edition, Undated later-edition preface on a site whose title is labeled [1912], Opening paragraphs: late husband’s death in 1918; first edition in 1887; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface | S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1887",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "claimed",
        "label": "First edition as reported by Moina Mathers",
        "qualifier": "Retrospective preface report; original 1887 printing not inspected.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "Since the year 1887, when the first edition of the Qabalah Unveiled appeared",
    "supports": "A later author’s first-edition report and an explicit translation/citation route.",
    "cannotEstablish": "An inspected 1887 imprint, complete Zohar reading, direct identity of religious traditions or verified unseen teachers.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-MATHERS-PREFACE",
        "originSourceId": "TRS-MATHERS-PREFACE",
        "sourceFamily": "TRF-MATHERS-COMPOSITE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      },
      {
        "sourceId": "TRS-MATHERS-TITLE",
        "originSourceId": "TRS-MATHERS-TITLE",
        "sourceFamily": "TRF-MATHERS-COMPOSITE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "A translation route is not evidence of covert organizational control."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-MATHERS-EDITION-CONFLICT",
    "familyId": "hermetic-qabalah",
    "kind": "documentary-fact",
    "title": "A mixed-edition dating problem in the retrieved Mathers text",
    "text": "The website title labels its edition [1912], while the attached preface speaks of Mathers’s death at the end of 1918. That preface cannot be dated 1912 from this title label.",
    "subjectIds": [
      "TR-E-MATHERS-UNVEILED"
    ],
    "sourceIds": [
      "TRS-MATHERS-TITLE",
      "TRS-MATHERS-PREFACE"
    ],
    "locator": "Title imprint; Preface to the New Edition, first paragraph",
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page | M. MacGregor Mathers (Moina Mathers), The Kabbalah Unveiled, Preface to the New Edition, Undated later-edition preface on a site whose title is labeled [1912], Opening paragraphs: late husband’s death in 1918; first edition in 1887; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "year",
        "value": "1912",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "disputed",
        "label": "Website title edition label [1912]",
        "qualifier": "Applies to the displayed title label; it cannot establish the date of the post-1918 preface.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Preface postdates the referenced death in1918",
        "qualifier": "Internal lower-bound evidence only; no exact year assigned.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "since his death at the end of 1918",
    "supports": "An internal mismatch between the displayed title metadata and the later preface.",
    "cannotEstablish": "The exact publication year of that preface, fraudulent intent, or a resolved critical edition.",
    "contraryEvidence": [
      "The title’s [1912] metadata is not applied to the entire composite text."
    ],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-MATHERS-TITLE",
        "originSourceId": "TRS-MATHERS-TITLE",
        "sourceFamily": "TRF-MATHERS-COMPOSITE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      },
      {
        "sourceId": "TRS-MATHERS-PREFACE",
        "originSourceId": "TRS-MATHERS-PREFACE",
        "sourceFamily": "TRF-MATHERS-COMPOSITE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-WESTCOTT-1887",
    "familyId": "hermetic-qabalah",
    "kind": "attributed-report",
    "title": "1887 translation label on Westcott’s Sepher Yetzirah",
    "text": "The retrieved text identifies Westcott’s translation with 1887 and presents a Book of Creation text. This is a named English reception, not every Jewish recension.",
    "subjectIds": [
      "TR-E-WESTCOTT-YETZIRAH",
      "TR-E-SEFER-YETZIRAH"
    ],
    "sourceIds": [
      "TRS-WESTCOTT-SY"
    ],
    "locator": "Heading; chapter1",
    "source": "W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1887",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "claimed",
        "label": "Translation year stated by online heading",
        "qualifier": "Base printing and first-publication status not independently verified.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "W.W. Wescott, tr. (1887)",
    "supports": "The website’s stated translation date and identification.",
    "cannotEstablish": "An independently verified first edition, full manuscript collation or a dated prophecy.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-WESTCOTT-SY",
        "originSourceId": "TRS-WESTCOTT-SY",
        "sourceFamily": "TRS-WESTCOTT-SY",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-BAAL-CONTEXT",
    "familyId": "ancient-ugaritic",
    "kind": "attributed-report",
    "title": "Ancient Ugaritic stories, described in a 2015 scholarly article",
    "text": "Ballentine discusses Baal Haddu’s conflicts with Yamm and Mot in a Late Bronze Age Ugaritic context. The article dates that context 1550–1200 BCE; the story itself is not assigned an event date.",
    "subjectIds": [
      "TR-E-BAAL-HADDU",
      "TR-E-UGARIT-CORPUS",
      "TR-E-BALLENTINE-BAAL"
    ],
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "locator": "Final substantive paragraph and article byline/date",
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "day",
        "value": "2015-11-17",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Ballentine article publication",
        "qualifier": "Date-only representation in this atlas; the embedded webpage publication timestamp is not used as an ancient event instant.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "year-range",
        "value": null,
        "startYear": -1550,
        "endYear": -1200,
        "calendar": null,
        "status": "documented",
        "label": "1550–1200 BCE · corpus context",
        "qualifier": "Historical BCE labels; no year zero. Source’s Late Bronze Age range, not the date of a narrated divine battle or a future event. Display/order only.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      }
    },
    "shortExtract": "Late Bronze Age (1550–1200 B.C.E.) Ugarit",
    "supports": "A scholarly cultural/corpus range and the article’s own publication date.",
    "cannotEstablish": "An ancient tablet reading, a seasonal timetable, an apocalypse date or a modern group’s belief.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-BAAL-BALLENTINE",
        "originSourceId": "TRS-BAAL-BALLENTINE",
        "sourceFamily": "TRS-BAAL-BALLENTINE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "The publication date belongs to the modern article; the BCE range belongs to its ancient context."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-BAAL-TITLE",
    "familyId": "ancient-ugaritic",
    "kind": "attributed-report",
    "title": "Baal is a title with several historical referents",
    "text": "Ballentine explains baal as lord/master and distinguishes several local divine referents. A shared title alone does not identify one deity, institution or modern religious group.",
    "subjectIds": [
      "TR-E-BAAL-TITLE",
      "TR-E-BAAL-HADDU"
    ],
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "locator": "Paragraph beginning How can Baal be so many gods?",
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "word “baal” means “master” or “lord.”",
    "supports": "The scholarly distinction between title and particular referents.",
    "cannotEstablish": "A hidden national religion, an equation with modern Satanism or a shared organization.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-BAAL-BALLENTINE",
        "originSourceId": "TRS-BAAL-BALLENTINE",
        "sourceFamily": "TRS-BAAL-BALLENTINE",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "Biblical polemic is discussed as an ancient authorial perspective, not adopted as a modern judgment."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-COS-1966",
    "familyId": "church-of-satan",
    "kind": "attributed-report",
    "title": "1966: Church of Satan’s self-reported Year One",
    "text": "The organization’s official FAQ says it was established in 1966 and that LaVey designated that entire year Year One. This is an institutional era claim, not a predicted end date.",
    "subjectIds": [
      "TR-E-COS"
    ],
    "sourceIds": [
      "TRS-COS-ORGANIZATION"
    ],
    "locator": "Opening What is the Church of Satan? answer",
    "source": "Church of Satan, F.A.Q. About the Organization, Current official webpage; no publication date established, Opening What is the Church of Satan? answer; https://www.churchofsatan.com/faq-about-the-organization/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "year",
        "value": "1966",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "claimed",
        "label": "Founding and Year One reported by Church of Satan",
        "qualifier": "First-party retrospective statement; no exact day or clock assigned.",
        "clock": null
      }
    },
    "shortExtract": "We were established in 1966 C.E.",
    "supports": "A first-party founding-year and era-description statement.",
    "cannotEstablish": "An independently verified legal incorporation date, an exact founding clock or an eschatological target.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-COS-ORGANIZATION",
        "originSourceId": "TRS-COS-ORGANIZATION",
        "sourceFamily": "TRF-COS-SELF-DESCRIPTION",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-COS-BELIEFS",
    "familyId": "church-of-satan",
    "kind": "attributed-report",
    "title": "Church of Satan’s selected atheist self-description",
    "text": "The official FAQ describes an atheist organization and Satan as a symbol. It is one organization’s position, not a neutral definition of all Satanism or all Left-Hand Path traditions.",
    "subjectIds": [
      "TR-E-COS"
    ],
    "sourceIds": [
      "TRS-COS-BELIEFS"
    ],
    "locator": "Opening belief paragraphs and sacrifice answer",
    "source": "Church of Satan, F.A.Q. Fundamental Beliefs, Current official webpage; no publication date established, Opening belief and Satan-as-symbol paragraphs; atheism in sacrifice answer; https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "We are atheists.",
    "supports": "The selected current first-party statement.",
    "cannotEstablish": "The beliefs of every member or group, a date of doctrinal adoption, or a universal moral classification.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-COS-BELIEFS",
        "originSourceId": "TRS-COS-BELIEFS",
        "sourceFamily": "TRF-COS-SELF-DESCRIPTION",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "No retrieved publication date is established; access time is not statement time."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-TST-BELIEFS",
    "familyId": "satanic-temple",
    "kind": "attributed-report",
    "title": "The Satanic Temple’s separate nontheistic self-description",
    "text": "The Satanic Temple says it does not believe in a personal Satan or the supernatural and publishes its own seven tenets. This identifies a separate organizational account, not common leadership or identity with the Church of Satan.",
    "subjectIds": [
      "TR-E-TST"
    ],
    "sourceIds": [
      "TRS-TST-FAQ",
      "TRS-TST-TENETS"
    ],
    "locator": "FAQ Do you worship Satan?; About Us mission and seven tenets",
    "source": "The Satanic Temple, Frequently Asked Questions, Current official webpage; no publication date established, Do you worship Satan? and What does Satan mean to TST? answers; https://thesatanictemple.com/pages/faq | The Satanic Temple, About Us / Seven Fundamental Tenets, Current official webpage; no publication date established, Mission paragraph and Seven Fundamental Tenets; https://thesatanictemple.com/pages/about-us",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "No, nor do we believe in the existence of Satan or the supernatural.",
    "supports": "These specific official descriptions and values.",
    "cannotEstablish": "An audited history of its activities, a verified founding date from this packet, common institutional control or a future end date.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-TST-FAQ",
        "originSourceId": "TRS-TST-FAQ",
        "sourceFamily": "TRF-TST-SELF-DESCRIPTION",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      },
      {
        "sourceId": "TRS-TST-TENETS",
        "originSourceId": "TRS-TST-TENETS",
        "sourceFamily": "TRF-TST-SELF-DESCRIPTION",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "Attempted fact-sheet and IRS-story routes were unavailable; no date is filled from memory."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-THELEMA-ERA",
    "familyId": "thelema",
    "kind": "attributed-report",
    "title": "1904 religious epoch and an equinox-based calendar",
    "text": "U.S. O.T.O. describes Thelema as founded in 1904 and its calendar as starting years at the northern vernal equinox, counted in zero-based 22-year docosades. These are named calendar conventions, not an aeon-ending forecast.",
    "subjectIds": [
      "TR-E-THELEMA",
      "TR-E-LIBER-AL"
    ],
    "sourceIds": [
      "TRS-OTO-THELEMA",
      "TRS-OTO-CALENDAR"
    ],
    "locator": "Thelema opening; Thelemic Calendar first four paragraphs",
    "source": "U.S. Grand Lodge, Ordo Templi Orientis, Thelema, Current official webpage, Opening paragraph: founding in 1904 and difficulty of blanket statements; https://oto-usa.org/thelema/ | U.S. Grand Lodge, Ordo Templi Orientis, Thelemic Calendar, Current official webpage, Opening four paragraphs: 1904 epoch, equinox boundary, zero-based 22-year docosades and 1996 example; https://oto-usa.org/thelema/calendar/",
    "reading": {
      "status": "selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "year",
        "value": "1904",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "claimed",
        "label": "Religious founding/epoch in U.S. O.T.O. account",
        "qualifier": "First-party attribution; no specific reception day or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "Both are zero-based",
    "supports": "A first-party religious epoch and stated calendrical convention.",
    "cannotEstablish": "Independent authentication of revelation, an astronomical fixture set, a universal Thelemic rule or the date an aeon will end.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "TRS-OTO-THELEMA",
        "originSourceId": "TRS-OTO-THELEMA",
        "sourceFamily": "TRF-OTO-USGL",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      },
      {
        "sourceId": "TRS-OTO-CALENDAR",
        "originSourceId": "TRS-OTO-CALENDAR",
        "sourceFamily": "TRF-OTO-USGL",
        "dependencyType": "original",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "The equinox instant must not be replaced by an automatic March 20 midnight.",
      "No new conversion implementation is supplied by this reference dataset."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-LIBER-AL-UNDATED",
    "familyId": "thelema",
    "kind": "attributed-report",
    "title": "An undated succession in Liber AL",
    "text": "The inherited selected reading of I:49 and III:34 describes the Equinox of the Gods and a later succession without a modern calendar deadline.",
    "subjectIds": [
      "TR-E-LIBER-AL"
    ],
    "sourceIds": [
      "EC-LIBER-AL"
    ],
    "locator": "Liber AL I:49 and III:34",
    "source": "Aleister Crowley; revelation attributed by Crowley to Aiwass, Liber AL vel Legis / The Book of the Law, Sacred-texts online transcription; exact base printing not established in this pass, I:49 and III:34; https://sacred-texts.com/oto/engccxx.htm",
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": null,
    "supports": "The selected source’s undated religious language.",
    "cannotEstablish": "A calibrated astronomical-precession threshold, physical mechanism or verified event date.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "EC-LIBER-AL",
        "originSourceId": "EC-LIBER-AL",
        "sourceFamily": "EC-LIBER-AL",
        "dependencyType": "reproduction",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-NEWTON-2060",
    "familyId": "christian-newton",
    "kind": "attributed-report",
    "title": "2060 conditional lower bound for a particular period",
    "text": "Newton’s active Yahuda 7.3g paragraph gives 2060 as a conditional lower bound for his interpreted 1260-year period and explicitly allows a later end. It does not state an exact date or a guaranteed planetary lifetime.",
    "subjectIds": [
      "TR-E-NEWTON",
      "TR-E-NEWTON-YAHUDA-7-3G"
    ],
    "sourceIds": [
      "NC-YAHUDA-7-3G"
    ],
    "locator": "f.13v active paragraph81; deleted paragraph78 separate",
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437.",
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "year",
        "value": "2060",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "conditional",
        "label": "Conditional lower bound,1260-year argument",
        "qualifier": "Not-before wording; may end later. Target year of an attributed argument, not an exact prophecy date.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "It may end later, but I see no reason for its ending sooner.",
    "supports": "The conditional year-level argument in the inherited scholarly transcription.",
    "cannotEstablish": "A physical-year conversion, certain event, source-supplied day/clock or combined2060–2370 interval.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "NC-YAHUDA-7-3G",
        "originSourceId": "NC-YAHUDA-7-3G",
        "sourceFamily": "NC-YAHUDA-7-3G",
        "dependencyType": "reproduction",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [
      "Composition date remains unknown here; broad post-1700 catalogue dating is not converted into a fabricated range."
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-NEWTON-2370",
    "familyId": "christian-newton",
    "kind": "attributed-report",
    "title": "2370 upper bound in a separate 2300-year argument",
    "text": "In Yahuda 7.3o Newton states an upper bound 2370 for a separate 2300-year interpretation. Its associated 2132 lower-bound anchor and other unfinished/inconsistent lines remain unresolved.",
    "subjectIds": [
      "TR-E-NEWTON",
      "TR-E-NEWTON-YAHUDA-7-3O"
    ],
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "locator": "f.8r proposition2 and paragraph41",
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "year",
        "value": "2370",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "conditional",
        "label": "Conditional upper bound,2300-year argument",
        "qualifier": "Different textual referent from2060; no exact day or clock.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": "nor after 2370",
    "supports": "The separate upper-bound statement with its source qualifications.",
    "cannotEstablish": "An alternative exact apocalypse date, a repaired missing anchor or an interval merged with 2060.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "NC-YAHUDA-7-3O",
        "originSourceId": "NC-YAHUDA-7-3O",
        "sourceFamily": "NC-YAHUDA-7-3O",
        "dependencyType": "reproduction",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  },
  {
    "id": "TR-C-NEWTON-1733",
    "familyId": "christian-newton",
    "kind": "documentary-fact",
    "title": "1733 posthumous publication and interpretive context",
    "text": "The inherited selected chapter from Newton’s Observations uses natural-world imagery in a political/religious interpretive dictionary and describes days-for-years. Its 1733 publication is distinct from manuscript composition and target years.",
    "subjectIds": [
      "TR-E-NEWTON",
      "TR-E-NEWTON-OBSERVATIONS"
    ],
    "sourceIds": [
      "NC-OBS-1733-I-II"
    ],
    "locator": "PartI chapterII, printedpp16–23; especially21–22",
    "source": "Isaac Newton, Observations upon the Prophecies of Daniel, Part I, Chapter II: Of the Prophetic Language (THEM00196); London 1733 posthumous edition, Newton Project normalized transcription; Printed pp. 16–23, especially pp. 16–17 political-world analogy and pp. 21–22 days-for-years passage; https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196.",
    "reading": {
      "status": "inherited-selected-passages",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1733",
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "documented",
        "label": "Posthumous Observations publication",
        "qualifier": "Year only; no month, day or clock is supplied.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Not established in the inspected sources",
        "qualifier": "No date or clock inferred.",
        "clock": null
      }
    },
    "shortExtract": null,
    "supports": "Publication metadata and the inherited selected interpretive passage.",
    "cannotEstablish": "An experimental physical law, empirical prophecy validation, or a 2060 forecast in this chapter.",
    "contraryEvidence": [],
    "evidenceDependencies": [
      {
        "sourceId": "NC-OBS-1733-I-II",
        "originSourceId": "NC-OBS-1733-I-II",
        "sourceFamily": "NC-OBS-1733-I-II",
        "dependencyType": "reproduction",
        "notes": "Original here means the acquired publication is the cited origin for this bounded statement, not that all historical subject matter is independently verified."
      }
    ],
    "limitations": [],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check"
  }
]);

export const ESCHATOLOGY_TRADITION_EDGES = freeze([
  {
    "id": "TR-R-JEWISH-PICO",
    "fromId": "TR-E-JEWISH-KABBALAH",
    "toId": "TR-E-PICO-CONCLUSIONS",
    "type": "influence",
    "claimIds": [
      "TR-C-PICO-1486"
    ],
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "asserted": true,
    "label": "Selected Jewish texts adapted by Pico · scholarly account",
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "limitations": [
      "The source names particular intermediaries and adaptations; not all Jewish views or a shared organization.",
      "A documented textual reception is not political coordination or universal doctrinal agreement."
    ]
  },
  {
    "id": "TR-R-PICO-WORKS",
    "fromId": "TR-E-PICO-CONCLUSIONS",
    "toId": "TR-E-PICO-HEPTAPLUS",
    "type": "comparison",
    "claimIds": [
      "TR-C-PICO-1486",
      "TR-C-PICO-1489"
    ],
    "sourceIds": [
      "TRS-PICO-SEP"
    ],
    "asserted": false,
    "label": "Modern comparison of two differently dated Pico works",
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/",
    "limitations": [
      "Editorial comparison only; this edge itself asserts no causal influence or institutional relationship."
    ]
  },
  {
    "id": "TR-R-MATHERS-KNORR",
    "fromId": "TR-E-MATHERS-UNVEILED",
    "toId": "TR-E-KNORR-DENUDATA",
    "type": "citation",
    "claimIds": [
      "TR-C-MATHERS-1887"
    ],
    "sourceIds": [
      "TRS-MATHERS-TITLE"
    ],
    "asserted": true,
    "label": "Title names a Latin translation intermediary",
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "limitations": [
      "Reports the title’s stated route; the Latin edition and claimed collation were not independently read."
    ]
  },
  {
    "id": "TR-R-MATHERS-ZOHAR",
    "fromId": "TR-E-MATHERS-UNVEILED",
    "toId": "TR-E-ZOHAR",
    "type": "citation",
    "claimIds": [
      "TR-C-MATHERS-1887"
    ],
    "sourceIds": [
      "TRS-MATHERS-TITLE"
    ],
    "asserted": true,
    "label": "Title names three Zohar selections",
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "limitations": [
      "Selected textual reception, not identity between Jewish Kabbalah and Hermetic Qabalah or a full-corpus reading."
    ]
  },
  {
    "id": "TR-R-WESTCOTT-SY",
    "fromId": "TR-E-WESTCOTT-YETZIRAH",
    "toId": "TR-E-SEFER-YETZIRAH",
    "type": "citation",
    "claimIds": [
      "TR-C-WESTCOTT-1887"
    ],
    "sourceIds": [
      "TRS-WESTCOTT-SY"
    ],
    "asserted": true,
    "label": "Named English translation of Sefer Yetzirah",
    "source": "W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm",
    "limitations": [
      "No claim that one English text settles the Jewish recensions or a date-setting method."
    ]
  },
  {
    "id": "TR-R-BAAL-ARTICLE-CORPUS",
    "fromId": "TR-E-BALLENTINE-BAAL",
    "toId": "TR-E-UGARIT-CORPUS",
    "type": "citation",
    "claimIds": [
      "TR-C-BAAL-CONTEXT"
    ],
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "asserted": true,
    "label": "Scholarly article discusses Ugaritic stories",
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": [
      "A modern account of an ancient corpus; not a newly authenticated primary tablet."
    ]
  },
  {
    "id": "TR-R-BAAL-TITLE-REFERENT",
    "fromId": "TR-E-BAAL-TITLE",
    "toId": "TR-E-BAAL-HADDU",
    "type": "comparison",
    "claimIds": [
      "TR-C-BAAL-TITLE"
    ],
    "sourceIds": [
      "TRS-BAAL-BALLENTINE"
    ],
    "asserted": false,
    "label": "Modern distinction between a title and one referent",
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "limitations": [
      "Editorial comparison, not a causal relationship; the title has multiple historical referents."
    ]
  },
  {
    "id": "TR-R-COS-TST",
    "fromId": "TR-E-COS",
    "toId": "TR-E-TST",
    "type": "comparison",
    "claimIds": [
      "TR-C-COS-BELIEFS",
      "TR-C-TST-BELIEFS"
    ],
    "sourceIds": [
      "TRS-COS-BELIEFS",
      "TRS-TST-FAQ",
      "TRS-TST-TENETS"
    ],
    "asserted": false,
    "label": "Compare separate organizational self-descriptions",
    "source": "Church of Satan, F.A.Q. Fundamental Beliefs, Current official webpage; no publication date established, Opening belief and Satan-as-symbol paragraphs; atheism in sacrifice answer; https://www.churchofsatan.com/faq-fundamental-beliefs/ | The Satanic Temple, Frequently Asked Questions, Current official webpage; no publication date established, Do you worship Satan? and What does Satan mean to TST? answers; https://thesatanictemple.com/pages/faq | The Satanic Temple, About Us / Seven Fundamental Tenets, Current official webpage; no publication date established, Mission paragraph and Seven Fundamental Tenets; https://thesatanictemple.com/pages/about-us",
    "limitations": [
      "Modern descriptive comparison only: no common ownership, leadership, historical affiliation or causal influence asserted.",
      "Shared vocabulary does not merge these organizations or represent all Satanism."
    ]
  },
  {
    "id": "TR-R-THELEMA-LIBER",
    "fromId": "TR-E-THELEMA",
    "toId": "TR-E-LIBER-AL",
    "type": "citation",
    "claimIds": [
      "TR-C-THELEMA-ERA",
      "TR-C-LIBER-AL-UNDATED"
    ],
    "sourceIds": [
      "TRS-OTO-CALENDAR",
      "EC-LIBER-AL"
    ],
    "asserted": true,
    "label": "Official calendar account names Liber AL reception",
    "source": "U.S. Grand Lodge, Ordo Templi Orientis, Thelemic Calendar, Current official webpage, Opening four paragraphs: 1904 epoch, equinox boundary, zero-based 22-year docosades and 1996 example; https://oto-usa.org/thelema/calendar/ | Aleister Crowley; revelation attributed by Crowley to Aiwass, Liber AL vel Legis / The Book of the Law, Sacred-texts online transcription; exact base printing not established in this pass, I:49 and III:34; https://sacred-texts.com/oto/engccxx.htm",
    "limitations": [
      "Religious attribution and calendar description; no revelation authentication or future target date."
    ]
  },
  {
    "id": "TR-R-NEWTON-BOUNDS",
    "fromId": "TR-E-NEWTON-YAHUDA-7-3G",
    "toId": "TR-E-NEWTON-YAHUDA-7-3O",
    "type": "comparison",
    "claimIds": [
      "TR-C-NEWTON-2060",
      "TR-C-NEWTON-2370"
    ],
    "sourceIds": [
      "NC-YAHUDA-7-3G",
      "NC-YAHUDA-7-3O"
    ],
    "asserted": false,
    "label": "Compare distinct 1260-year and 2300-year arguments",
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437. | Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "limitations": [
      "Modern comparison only; bounds must not be merged into one 2060–2370 forecast interval."
    ]
  }
]);

export const ESCHATOLOGY_TRADITION_SOURCES = freeze([
  {
    "id": "TRS-PICO-SEP",
    "sourceId": "TRS-PICO-SEP",
    "title": "Giovanni Pico della Mirandola",
    "author": "Brian Copenhaver",
    "publisher": "Stanford Encyclopedia of Philosophy",
    "url": "https://plato.stanford.edu/entries/pico-della-mirandola/",
    "requestedUrl": "https://plato.stanford.edu/entries/pico-della-mirandola/",
    "finalUrl": "https://plato.stanford.edu/entries/pico-della-mirandola/",
    "publishedAt": "2024-08-21",
    "accessedAt": "2026-10-30T16:34:09.584548+00:00",
    "retrievedAt": "2026-10-30T16:34:09.584548+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Selected paragraphs in Life and Christian Kabbalah and the Heptaplus read; not the full article, Pico manuscripts or all cited scholarship.",
    "fullWorkRead": false,
    "edition": "First published 2008-06-03; substantive revision 2024-08-21",
    "version": "First published 2008-06-03; substantive revision 2024-08-21",
    "locator": "Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah",
    "sourceKind": "scholarly-reference",
    "sourceFamily": "TRS-PICO-SEP",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/pico-stanford.html",
    "sha256": "a4d98826a33f8b973df19de5795ad1b1f2088f1e5a9ed19aff8fe17e22cb062e",
    "contentSHA256": "a4d98826a33f8b973df19de5795ad1b1f2088f1e5a9ed19aff8fe17e22cb062e",
    "mimeType": "text/html",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "a4d98826a33f8b973df19de5795ad1b1f2088f1e5a9ed19aff8fe17e22cb062e",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.057657+00:00",
        "outputSHA256": "9bc92fc016578197debdfe4e8d0caabe493ae9d6d8846c54ec5ecbb299e043c2",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/pico-stanford.txt"
      }
    ],
    "limitations": [
      "Modern scholarly interpretation; cited primary works and translations were not independently collated.",
      "Named Jewish textual transmission and Christian adaptation are not a single shared religion or evidence of covert coordination."
    ],
    "source": "Brian Copenhaver, Giovanni Pico della Mirandola, First published 2008-06-03; substantive revision 2024-08-21, Sections 1 and 2.3: Conclusions publication, Heptaplus and Christianized Kabbalah; https://plato.stanford.edu/entries/pico-della-mirandola/"
  },
  {
    "id": "TRS-WESTCOTT-SY",
    "sourceId": "TRS-WESTCOTT-SY",
    "title": "Sepher Yetzirah / The Book of Creation",
    "author": "W. W. Westcott (site heading spells Wescott)",
    "publisher": "Internet Sacred Text Archive",
    "url": "https://sacred-texts.com/jud/yetzirah.htm",
    "requestedUrl": "https://sacred-texts.com/jud/yetzirah.htm",
    "finalUrl": "https://sacred-texts.com/book/sepher-yetzirah-or-the-book-of-creation/sepher-yetzirah",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:34:09.585551+00:00",
    "retrievedAt": "2026-10-30T16:34:09.585551+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Heading and selected chapter 1 passages read; no complete work or Latin/Hebrew collation.",
    "fullWorkRead": false,
    "edition": "Online text headed W.W. Wescott, tr. (1887); base printing not independently identified",
    "version": "Online text headed W.W. Wescott, tr. (1887); base printing not independently identified",
    "locator": "Heading and chapter 1, paragraphs 1, 5 and 7",
    "sourceKind": "historical-text-transcription",
    "sourceFamily": "TRS-WESTCOTT-SY",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "Retrieved historical-text transcription; original printing/manuscript images were not collated in this lane.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/yetzirah-westcott.html",
    "sha256": "4d3459b0095673f786797c76be11312abaf501bb92128d20d58c1ed0fe893487",
    "contentSHA256": "4d3459b0095673f786797c76be11312abaf501bb92128d20d58c1ed0fe893487",
    "mimeType": "text/html",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "4d3459b0095673f786797c76be11312abaf501bb92128d20d58c1ed0fe893487",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:16.899940+00:00",
        "outputSHA256": "77a701a42e52e6eadf557a7695c854a8b34254fbd0a18aa47a42265db6ac7efb",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/yetzirah-westcott.txt"
      }
    ],
    "limitations": [
      "1887 is the website’s stated translation date; no title-page image or independent first-publication fixture was inspected.",
      "This English occult reception does not represent every Jewish recension."
    ],
    "source": "W. W. Westcott (site heading spells Wescott), Sepher Yetzirah / The Book of Creation, Online text headed W.W. Wescott, tr. (1887); base printing not independently identified, Heading and chapter 1, paragraphs 1, 5 and 7; https://sacred-texts.com/jud/yetzirah.htm"
  },
  {
    "id": "TRS-MATHERS-TITLE",
    "sourceId": "TRS-MATHERS-TITLE",
    "title": "The Kabbalah Unveiled, title page",
    "author": "S. L. MacGregor Mathers; online redactor J. B. Hare",
    "publisher": "Internet Sacred Text Archive",
    "url": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "requestedUrl": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "finalUrl": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:37:03.770372+00:00",
    "retrievedAt": "2026-10-30T16:37:03.770372+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Complete short title transcription read; no printing image or whole book.",
    "fullWorkRead": false,
    "edition": "Site title text: New York, Theosophical Pub. Co., [1912]",
    "version": "Site title text: New York, Theosophical Pub. Co., [1912]",
    "locator": "Title: translated through Knorr von Rosenroth; three named Zohar sections",
    "sourceKind": "historical-text-transcription",
    "sourceFamily": "TRF-MATHERS-COMPOSITE",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "Retrieved historical-text transcription; original printing/manuscript images were not collated in this lane.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/mathers-title.html",
    "sha256": "b0e35ba2107476c49e1ea20af745ffd9cc1658649257dda5710b72cefbc68541",
    "contentSHA256": "b0e35ba2107476c49e1ea20af745ffd9cc1658649257dda5710b72cefbc68541",
    "mimeType": "text/html",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "b0e35ba2107476c49e1ea20af745ffd9cc1658649257dda5710b72cefbc68541",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:37:04.757578+00:00",
        "outputSHA256": "331557e0f634563b1b5439a55123c1bdab6b9c1d0f4b11d05b3245b3dd37487a",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/mathers-title.txt"
      }
    ],
    "limitations": [
      "The attached preface refers to Mathers’s death in 1918, so the [1912] title label cannot date all material on this composite website.",
      "The title’s claim of collation with Chaldee/Hebrew is reported, not independently verified."
    ],
    "source": "S. L. MacGregor Mathers; online redactor J. B. Hare, The Kabbalah Unveiled, title page, Site title text: New York, Theosophical Pub. Co., [1912], Title: translated through Knorr von Rosenroth; three named Zohar sections; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/title-page"
  },
  {
    "id": "TRS-MATHERS-PREFACE",
    "sourceId": "TRS-MATHERS-PREFACE",
    "title": "The Kabbalah Unveiled, Preface to the New Edition",
    "author": "M. MacGregor Mathers (Moina Mathers)",
    "publisher": "Internet Sacred Text Archive",
    "url": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "requestedUrl": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "finalUrl": "https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:37:03.771257+00:00",
    "retrievedAt": "2026-10-30T16:37:03.771257+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Opening paragraphs and signing author read; no complete preface or verification of her occult-teacher and affiliation claims.",
    "fullWorkRead": false,
    "edition": "Undated later-edition preface on a site whose title is labeled [1912]",
    "version": "Undated later-edition preface on a site whose title is labeled [1912]",
    "locator": "Opening paragraphs: late husband’s death in 1918; first edition in 1887",
    "sourceKind": "historical-text-transcription",
    "sourceFamily": "TRF-MATHERS-COMPOSITE",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "Retrieved historical-text transcription; original printing/manuscript images were not collated in this lane.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/mathers-preface.html",
    "sha256": "4205fe6fc535614c7eb1f5e63b0f89a11474b43180dc55da36b529ff30ff0d85",
    "contentSHA256": "4205fe6fc535614c7eb1f5e63b0f89a11474b43180dc55da36b529ff30ff0d85",
    "mimeType": "text/html",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "4205fe6fc535614c7eb1f5e63b0f89a11474b43180dc55da36b529ff30ff0d85",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:37:05.231896+00:00",
        "outputSHA256": "7f9fa7c8d70a4935c7326954bfb51037d916f5b20710bfcbbc611e422d242ca9",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/mathers-preface.txt"
      }
    ],
    "limitations": [
      "The first-edition year is the later preface author’s retrospective report, not an independently inspected 1887 imprint.",
      "Post-1918 internal wording conflicts with applying the title’s [1912] label to this preface.",
      "No unseen teachers, powers or secret affiliations are authenticated by this quotation."
    ],
    "source": "M. MacGregor Mathers (Moina Mathers), The Kabbalah Unveiled, Preface to the New Edition, Undated later-edition preface on a site whose title is labeled [1912], Opening paragraphs: late husband’s death in 1918; first edition in 1887; https://sacred-texts.com/book/kabbala-denudata-the-kabbalah-unveiled/preface"
  },
  {
    "id": "TRS-BAAL-BALLENTINE",
    "sourceId": "TRS-BAAL-BALLENTINE",
    "title": "Baal",
    "author": "Debra Scoggins Ballentine",
    "publisher": "Bible Odyssey / Society of Biblical Literature",
    "url": "https://www.bibleodyssey.org/articles/baal/",
    "requestedUrl": "https://www.bibleodyssey.org/articles/baal/",
    "finalUrl": "https://www.bibleodyssey.org/articles/baal/",
    "publishedAt": "2015-11-17",
    "accessedAt": "2026-10-30T16:34:09.586582+00:00",
    "retrievedAt": "2026-10-30T16:34:09.586582+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Named-title discussion, Ugaritic context, bibliography and byline/date read. No ancient tablet or cited monograph was newly read.",
    "fullWorkRead": false,
    "edition": "Article dated 2015-11-17",
    "version": "Article dated 2015-11-17",
    "locator": "Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit",
    "sourceKind": "scholarly-reference",
    "sourceFamily": "TRS-BAAL-BALLENTINE",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/baal-bibleodyssey.html",
    "sha256": "9da1f3458ac95ee5075e90d96009454dc577baf32e1dfb9fc39671c424f369c2",
    "contentSHA256": "9da1f3458ac95ee5075e90d96009454dc577baf32e1dfb9fc39671c424f369c2",
    "mimeType": "text/html; charset=UTF-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "9da1f3458ac95ee5075e90d96009454dc577baf32e1dfb9fc39671c424f369c2",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.558695+00:00",
        "outputSHA256": "a4c35e505197e1aece56a4be0c854c1356c6b5a20fa63452b33a8ad86ddc068e",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/baal-bibleodyssey.txt"
      }
    ],
    "limitations": [
      "A modern scholarly account, not a new primary Ugaritic transcription or translation.",
      "The 1550–1200 BCE range dates a cultural/corpus context, not a narrated divine battle or a future event.",
      "Do not identify all local uses of the title with a single deity or a modern organization."
    ],
    "source": "Debra Scoggins Ballentine, Baal, Article dated 2015-11-17, Paragraphs on baal as title and final substantive paragraph on Late Bronze Age Ugarit; https://www.bibleodyssey.org/articles/baal/",
    "publicationMetadataTimestamp": "2015-11-17T20:48:44-05:00"
  },
  {
    "id": "TRS-COS-ORGANIZATION",
    "sourceId": "TRS-COS-ORGANIZATION",
    "title": "F.A.Q. About the Organization",
    "author": "Church of Satan",
    "publisher": "Church of Satan",
    "url": "https://www.churchofsatan.com/faq-about-the-organization/",
    "requestedUrl": "https://www.churchofsatan.com/faq-about-the-organization/",
    "finalUrl": "https://churchofsatan.com/faq-about-the-organization/",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:37:03.771763+00:00",
    "retrievedAt": "2026-10-30T16:37:03.771763+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Opening organizational definition and 1966/Year One statement read; not a complete institutional history.",
    "fullWorkRead": false,
    "edition": "Current official webpage; no publication date established",
    "version": "Current official webpage; no publication date established",
    "locator": "Opening What is the Church of Satan? answer",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-COS-SELF-DESCRIPTION",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/cos-organization.html",
    "sha256": "08f82007d47837d69654a7831e42b997a5ff2aa782c0078fd96904d40dd7d50c",
    "contentSHA256": "08f82007d47837d69654a7831e42b997a5ff2aa782c0078fd96904d40dd7d50c",
    "mimeType": "text/html; charset=UTF-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "08f82007d47837d69654a7831e42b997a5ff2aa782c0078fd96904d40dd7d50c",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:37:04.857511+00:00",
        "outputSHA256": "dde8a01a700d9b3ee3699c766ec96c488e987979241a9860088a499241221bf6",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/cos-organization.txt"
      }
    ],
    "limitations": [
      "Self-reported institutional history; no legal incorporation record or independent founding-day evidence acquired.",
      "The same answer’s historical etymology and polemic about other religions are not adopted as neutral scholarship."
    ],
    "source": "Church of Satan, F.A.Q. About the Organization, Current official webpage; no publication date established, Opening What is the Church of Satan? answer; https://www.churchofsatan.com/faq-about-the-organization/"
  },
  {
    "id": "TRS-COS-BELIEFS",
    "sourceId": "TRS-COS-BELIEFS",
    "title": "F.A.Q. Fundamental Beliefs",
    "author": "Church of Satan",
    "publisher": "Church of Satan",
    "url": "https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "requestedUrl": "https://www.churchofsatan.com/faq-fundamental-beliefs/",
    "finalUrl": "https://churchofsatan.com/faq-fundamental-beliefs/",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:34:09.817873+00:00",
    "retrievedAt": "2026-10-30T16:34:09.817873+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Selected self-description paragraphs read. Exclusionary definitions of other Satanists are not adopted as neutral taxonomy.",
    "fullWorkRead": false,
    "edition": "Current official webpage; no publication date established",
    "version": "Current official webpage; no publication date established",
    "locator": "Opening belief and Satan-as-symbol paragraphs; atheism in sacrifice answer",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-COS-SELF-DESCRIPTION",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/cos-beliefs.html",
    "sha256": "dfa74ef922cbb75d83a3f6bc6624f24bb5563f9809a3b3c1598eca516ef7c09e",
    "contentSHA256": "dfa74ef922cbb75d83a3f6bc6624f24bb5563f9809a3b3c1598eca516ef7c09e",
    "mimeType": "text/html; charset=UTF-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "dfa74ef922cbb75d83a3f6bc6624f24bb5563f9809a3b3c1598eca516ef7c09e",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.891731+00:00",
        "outputSHA256": "cb1b9f73fa5ecde39a683d12a27f24f43c5e4d69d1d2d1de7bb9d577407d7fb8",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/cos-beliefs.txt"
      }
    ],
    "limitations": [
      "One organization’s position, not all Satanism, Left-Hand Path groups or modern esotericism.",
      "No date of adoption or eschatological deadline is established by this page."
    ],
    "source": "Church of Satan, F.A.Q. Fundamental Beliefs, Current official webpage; no publication date established, Opening belief and Satan-as-symbol paragraphs; atheism in sacrifice answer; https://www.churchofsatan.com/faq-fundamental-beliefs/"
  },
  {
    "id": "TRS-TST-FAQ",
    "sourceId": "TRS-TST-FAQ",
    "title": "Frequently Asked Questions",
    "author": "The Satanic Temple",
    "publisher": "The Satanic Temple",
    "url": "https://thesatanictemple.com/pages/faq",
    "requestedUrl": "https://thesatanictemple.com/pages/faq",
    "finalUrl": "https://thesatanictemple.com/pages/faq",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:34:10.057765+00:00",
    "retrievedAt": "2026-10-30T16:34:10.057765+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Selected first-party belief answers read; no founding document, IRS letter or complete organizational history inspected.",
    "fullWorkRead": false,
    "edition": "Current official webpage; no publication date established",
    "version": "Current official webpage; no publication date established",
    "locator": "Do you worship Satan? and What does Satan mean to TST? answers",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-TST-SELF-DESCRIPTION",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/tst-faq.html",
    "sha256": "7ee03f66b69488fbf75e7f4fba949a4828ac0b1e5c9b015626e5cee868fbfe83",
    "contentSHA256": "7ee03f66b69488fbf75e7f4fba949a4828ac0b1e5c9b015626e5cee868fbfe83",
    "mimeType": "text/html; charset=utf-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "7ee03f66b69488fbf75e7f4fba949a4828ac0b1e5c9b015626e5cee868fbfe83",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.593569+00:00",
        "outputSHA256": "560d3c3204b074d96c7326018c45896ccd6d6823cd9f4ca00ee9a5952223cc9f",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/tst-faq.txt"
      }
    ],
    "limitations": [
      "No verified founding date was found in the inspected passages; retrieval time is not the date the beliefs originated.",
      "One organization’s self-description, not a definition of all modern Satanism."
    ],
    "source": "The Satanic Temple, Frequently Asked Questions, Current official webpage; no publication date established, Do you worship Satan? and What does Satan mean to TST? answers; https://thesatanictemple.com/pages/faq"
  },
  {
    "id": "TRS-TST-TENETS",
    "sourceId": "TRS-TST-TENETS",
    "title": "About Us / Seven Fundamental Tenets",
    "author": "The Satanic Temple",
    "publisher": "The Satanic Temple",
    "url": "https://thesatanictemple.com/pages/about-us",
    "requestedUrl": "https://thesatanictemple.com/pages/about-us",
    "finalUrl": "https://thesatanictemple.com/pages/about-us",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:34:09.857336+00:00",
    "retrievedAt": "2026-10-30T16:34:09.857336+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Mission and tenets read, including compassion/reason and conformity of beliefs with scientific understanding. No full site history read.",
    "fullWorkRead": false,
    "edition": "Current official webpage; no publication date established",
    "version": "Current official webpage; no publication date established",
    "locator": "Mission paragraph and Seven Fundamental Tenets",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-TST-SELF-DESCRIPTION",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/tst-about.html",
    "sha256": "25f6dbbcdb2d8e84f0cc92c832a1bfc106a3c5e2dc1d990a6392a9632819cc05",
    "contentSHA256": "25f6dbbcdb2d8e84f0cc92c832a1bfc106a3c5e2dc1d990a6392a9632819cc05",
    "mimeType": "text/html; charset=utf-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "25f6dbbcdb2d8e84f0cc92c832a1bfc106a3c5e2dc1d990a6392a9632819cc05",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.387032+00:00",
        "outputSHA256": "49d1011ebe0f12462cc1013188a69a03d16e3958a7201ace19154f037324c282",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/tst-about.txt"
      }
    ],
    "limitations": [
      "Institutional self-description; activities claimed on the page are not independently audited here.",
      "No enactment date or final cosmic event follows from these principles."
    ],
    "source": "The Satanic Temple, About Us / Seven Fundamental Tenets, Current official webpage; no publication date established, Mission paragraph and Seven Fundamental Tenets; https://thesatanictemple.com/pages/about-us"
  },
  {
    "id": "TRS-OTO-THELEMA",
    "sourceId": "TRS-OTO-THELEMA",
    "title": "Thelema",
    "author": "U.S. Grand Lodge, Ordo Templi Orientis",
    "publisher": "U.S. Grand Lodge O.T.O.",
    "url": "https://oto-usa.org/thelema/",
    "requestedUrl": "https://oto-usa.org/thelema/",
    "finalUrl": "https://oto-usa.org/thelema/",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:34:10.387169+00:00",
    "retrievedAt": "2026-10-30T16:34:10.387169+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Opening definition and scope paragraphs read; no complete Crowley history or all Thelemic groups surveyed.",
    "fullWorkRead": false,
    "edition": "Current official webpage",
    "version": "Current official webpage",
    "locator": "Opening paragraph: founding in 1904 and difficulty of blanket statements",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-OTO-USGL",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/thelema-oto.html",
    "sha256": "28fb4ad64bedc23b58003a11058f7c017229449ceed69615a52d0fd8f7575c38",
    "contentSHA256": "28fb4ad64bedc23b58003a11058f7c017229449ceed69615a52d0fd8f7575c38",
    "mimeType": "text/html; charset=UTF-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "28fb4ad64bedc23b58003a11058f7c017229449ceed69615a52d0fd8f7575c38",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:34:10.936043+00:00",
        "outputSHA256": "897063ead5577560d5b2a3b69d508f3f5551d8e222ab169f42696199e2fddef6",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/thelema-oto.txt"
      }
    ],
    "limitations": [
      "Official community attribution, not independent authentication of revelation or universal Thelemic consensus."
    ],
    "source": "U.S. Grand Lodge, Ordo Templi Orientis, Thelema, Current official webpage, Opening paragraph: founding in 1904 and difficulty of blanket statements; https://oto-usa.org/thelema/"
  },
  {
    "id": "TRS-OTO-CALENDAR",
    "sourceId": "TRS-OTO-CALENDAR",
    "title": "Thelemic Calendar",
    "author": "U.S. Grand Lodge, Ordo Templi Orientis",
    "publisher": "U.S. Grand Lodge O.T.O.",
    "url": "https://oto-usa.org/thelema/calendar/",
    "requestedUrl": "https://oto-usa.org/thelema/calendar/",
    "finalUrl": "https://oto-usa.org/thelema/calendar/",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:37:03.781976+00:00",
    "retrievedAt": "2026-10-30T16:37:03.781976+00:00",
    "accessResult": "accessible",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-read",
    "readingScope": "Named calendar-description paragraphs and feast list read; examples were not independently tested against astronomical fixtures.",
    "fullWorkRead": false,
    "edition": "Current official webpage",
    "version": "Current official webpage",
    "locator": "Opening four paragraphs: 1904 epoch, equinox boundary, zero-based 22-year docosades and 1996 example",
    "sourceKind": "official-community-self-description",
    "sourceFamily": "TRF-OTO-USGL",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "Retrieved from the named institutional publisher; this authenticates the publisher attribution, not every factual or theological assertion.",
    "itemIntegrity": "hash-recorded",
    "localOriginal": "/workspace/analysis/eschatology-atlas/traditions/oto-calendar.html",
    "sha256": "ea256f6fa2bc6162699990c7c46d53e70b1802093932639f0b4e68f925103ca6",
    "contentSHA256": "ea256f6fa2bc6162699990c7c46d53e70b1802093932639f0b4e68f925103ca6",
    "mimeType": "text/html; charset=UTF-8",
    "rights": "Original concise paraphrases and short attributed extracts only. Modern translation, commentary and website rights remain with their holders; no full-book republication or training licence is inferred.",
    "licenseOrAccessLimit": "Publicly accessible selected pages; no account, paywall circumvention or protected-book crawl.",
    "derivatives": [
      {
        "inputSHA256": "ea256f6fa2bc6162699990c7c46d53e70b1802093932639f0b4e68f925103ca6",
        "tool": "Python standard-library html.parser; retained fetch.py",
        "settings": "Text extraction excluding script/style; structural line breaks; original HTML retained.",
        "generatedAt": "2026-10-30T16:37:04.477152+00:00",
        "outputSHA256": "88c68357e92f35f0e81b1a8c640bc8ddb36ec5c3f494fe8b4023fdc107c7e6ad",
        "transformation": "HTML to extracted UTF-8 text",
        "localPath": "/workspace/analysis/eschatology-atlas/traditions/oto-calendar.txt"
      }
    ],
    "limitations": [
      "Reference description only in this evidence module; no new calendar or prediction implementation.",
      "Year-boundary instant requires a selected astronomical convention; a generic March 20 midnight is not the source’s rule.",
      "The date/time precision claimed by the example is not independently validated here."
    ],
    "source": "U.S. Grand Lodge, Ordo Templi Orientis, Thelemic Calendar, Current official webpage, Opening four paragraphs: 1904 epoch, equinox boundary, zero-based 22-year docosades and 1996 example; https://oto-usa.org/thelema/calendar/"
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
    "readingStatus": "inherited-selected-passages",
    "readingDepth": "Selected English segments 1, 5 and 7 read; translator notes distinguished from base translation. No full work or manuscript collation.",
    "fullWorkRead": false,
    "rights": "API translation metadata declares CC0; original paraphrase retained with attribution.",
    "limitations": [
      "Community translation, not a critical edition or representative survey of later Kabbalah.",
      "The API declares CC0 for this translation. The original paraphrase does not require republication of its long notes.",
      "Reused selected-passage receipt; no new retrieval or full-work reading in this atlas lane."
    ],
    "source": "Anonymous; Sefaria community translator, Sefer Yetzirah, chapter 1, Sefaria Community Translation, API version metadata, 1:1, 1:5 and 1:7; https://www.sefaria.org/api/texts/Sefer_Yetzirah.1?lang=en",
    "underlyingSourceId": "EC-SEFER-YETZIRAH",
    "inheritedFrom": "assets/js/core/data/eschatology-comparisons.js"
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
    "readingStatus": "inherited-selected-passages",
    "readingDepth": "Read I:49 and III:34 concerning the Equinox of the Gods and a subsequent change; no full-work or manuscript collation.",
    "fullWorkRead": false,
    "rights": "Original paraphrase only. Edition and website rights remain with their holders; no full-text reuse or training licence is inferred.",
    "limitations": [
      "Unestablished base printing: paraphrase only, no edition-level textual-variant claim.",
      "Religious revelation is reported as attribution, not independently established causation.",
      "Reused selected-passage receipt; no new retrieval or full-work reading in this atlas lane."
    ],
    "source": "Aleister Crowley; revelation attributed by Crowley to Aiwass, Liber AL vel Legis / The Book of the Law, Sacred-texts online transcription; exact base printing not established in this pass, I:49 and III:34; https://sacred-texts.com/oto/engccxx.htm",
    "underlyingSourceId": "EC-LIBER-AL",
    "inheritedFrom": "assets/js/core/data/eschatology-comparisons.js"
  },
  {
    "id": "NC-YAHUDA-7-3G",
    "title": "Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437)",
    "author": "Isaac Newton",
    "institution": "Newton Project, University of Oxford; manuscript custodian National Library of Israel where applicable",
    "url": "https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437",
    "edition": "Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700",
    "locator": "f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately",
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437.",
    "accessedAt": "2026-10-30",
    "retrievedAt": "2026-10-30T15:30:50.020359+00:00",
    "readingStatus": "inherited-selected-passages",
    "accessStatus": "accessible",
    "sha256": "1b43ad85c9721378d676d2b9a3fde7e22401482555dfed012bcf07fabc577318",
    "readingScope": "Active f. 13v symbolic periods, conditional A.C. 800 anchor, 2060 result and anti-date-setting qualification; editorial deletion markup of earlier paragraph 78.",
    "sourceFamily": "NC-YAHUDA-7-3G",
    "views": [
      {
        "view": "normalized",
        "url": "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00437",
        "retrievedAt": "2026-10-30T15:30:50.019594+00:00",
        "sha256": "dc41b3509f4a0079222f001ea65816263df03c335f3a9d8efca9851726fddbfa",
        "readingStatus": "selected-passages-checked"
      },
      {
        "view": "diplomatic",
        "url": "https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437",
        "retrievedAt": "2026-10-30T15:30:50.020359+00:00",
        "sha256": "1b43ad85c9721378d676d2b9a3fde7e22401482555dfed012bcf07fabc577318",
        "readingStatus": "selected-passages-checked"
      }
    ],
    "rights": "Newton’s historical text is public domain; the modern Newton Project edition and editorial apparatus retain their stated rights. Only short quotations, metadata and original paraphrases are included here.",
    "limitations": [
      "Two editorial views of one manuscript are not independent historical witnesses. The same author’s related drafts are not empirical confirmation of a prediction.",
      "The active normalized and diplomatic paragraph 81 both say1260 days and explicitly map days to years. The wording1260 years in diplomatic paragraph 78 belongs to an editorially marked deleted block.",
      "No manuscript photograph or independent paleographical collation was obtained; interpretation of deletions follows the scholarly edition’s markup.",
      "Post-1700 is the catalogue’s broad dating, not an exact composition date for this folio. A 1704 date is not asserted by this module.",
      "Reused selected-passage receipt; no new retrieval or full-work reading in this atlas lane."
    ],
    "underlyingSourceId": "NC-YAHUDA-7-3G",
    "inheritedFrom": "assets/js/core/data/newton-chronology-sources.js",
    "fullWorkRead": false
  },
  {
    "id": "NC-YAHUDA-7-3O",
    "title": "Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430)",
    "author": "Isaac Newton",
    "institution": "Newton Project, University of Oxford; manuscript custodian National Library of Israel where applicable",
    "url": "https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430",
    "edition": "Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers",
    "locator": "f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182",
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "accessedAt": "2026-10-30",
    "retrievedAt": "2026-10-30T15:30:50.021532+00:00",
    "readingStatus": "inherited-selected-passages",
    "accessStatus": "accessible",
    "sha256": "6ba4273ae9d37e0d2b17ce7d2029925e26b813416e8aa8cc79391ea8039f2d30",
    "readingScope": "Numeric anchor 70, proposed anchors 800/1084/842, stated 2132/2370 bounds, unfinished2060 line, and literal 2090/1374 wording; f. 7r reused dated notice inspected for dating caution.",
    "sourceFamily": "NC-YAHUDA-7-3O",
    "views": [
      {
        "view": "normalized",
        "url": "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00430",
        "retrievedAt": "2026-10-30T15:30:50.020924+00:00",
        "sha256": "e63379dff87977ed03b3108062dfcf5bfedac19164c578c762c83824b4e1053c",
        "readingStatus": "selected-passages-checked"
      },
      {
        "view": "diplomatic",
        "url": "https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430",
        "retrievedAt": "2026-10-30T15:30:50.021532+00:00",
        "sha256": "6ba4273ae9d37e0d2b17ce7d2029925e26b813416e8aa8cc79391ea8039f2d30",
        "readingStatus": "selected-passages-checked"
      }
    ],
    "rights": "Newton’s historical text is public domain; the modern Newton Project edition and editorial apparatus retain their stated rights. Only short quotations, metadata and original paraphrases are included here.",
    "limitations": [
      "Normalized and diplomatic views preserve the same unresolved 2090/1374 concluding wording. No correction to begin/end, digit, or reversed bounds is silently made.",
      "The catalogue labels the unit c.1675–80, while f. 7r contains a reused printed notice dated 1716/17. These metadata do not establish an exact composition date for f. 8r.",
      "The numeric start for the written 2132 lower bound is not specified in f. 8r; no negative-year anchor is reverse-engineered and attributed to Newton.",
      "No manuscript photograph was collated. The edition and its TEI were checked at the cited passages; this is not a complete-unit reading.",
      "Reused selected-passage receipt; no new retrieval or full-work reading in this atlas lane."
    ],
    "underlyingSourceId": "NC-YAHUDA-7-3O",
    "inheritedFrom": "assets/js/core/data/newton-chronology-sources.js",
    "fullWorkRead": false
  },
  {
    "id": "NC-OBS-1733-I-II",
    "title": "Observations upon the Prophecies of Daniel, Part I, Chapter II: Of the Prophetic Language (THEM00196)",
    "author": "Isaac Newton",
    "institution": "Newton Project, University of Oxford; manuscript custodian National Library of Israel where applicable",
    "url": "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196",
    "edition": "London 1733 posthumous edition, Newton Project normalized transcription",
    "locator": "Printed pp. 16–23, especially pp. 16–17 political-world analogy and pp. 21–22 days-for-years passage",
    "source": "Isaac Newton, Observations upon the Prophecies of Daniel, Part I, Chapter II: Of the Prophetic Language (THEM00196); London 1733 posthumous edition, Newton Project normalized transcription; Printed pp. 16–23, especially pp. 16–17 political-world analogy and pp. 21–22 days-for-years passage; https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00196.",
    "accessedAt": "2026-10-30",
    "retrievedAt": "2026-10-30T15:29:36.514454+00:00",
    "readingStatus": "inherited-selected-passages",
    "accessStatus": "accessible",
    "sha256": "903912191fd8475a21bcd853dc9b9beeec7a8d824bc780a4f794da36768f8fcb",
    "readingScope": "Selected interpretive dictionary distinguishing natural imagery from bodies politic; symbolic days-for-years wording.",
    "sourceFamily": "NC-OBS-1733-I-II",
    "views": [],
    "rights": "Newton’s historical text is public domain; the modern Newton Project edition and editorial apparatus retain their stated rights. Only short quotations, metadata and original paraphrases are included here.",
    "limitations": [
      "This is a posthumously printed theological work, not a physics experiment or a universal Christian rule.",
      "The natural-world imagery is explained within Newton’s political and religious interpretation; it is not a modern ephemeris or proof of literal planetary causation.",
      "The chapter does not supply a year 2060 forecast; it supports the stated interpretive context only.",
      "Reused selected-passage receipt; no new retrieval or full-work reading in this atlas lane."
    ],
    "underlyingSourceId": "NC-OBS-1733-I-II",
    "inheritedFrom": "assets/js/core/data/newton-chronology-sources.js",
    "fullWorkRead": false
  }
]);

export const ESCHATOLOGY_TRADITION_LIMITS = freeze([
  "Selected 21 entities and 16 claims, not an exhaustive survey of religions, Kabbalah, ancient Near Eastern cults, Satanism or esoteric organizations.",
  "Publication, claimed-document, statement, transmission, target and historical-context dates have distinct roles; retrieval dates are not inserted as source statements.",
  "Unknown dates stay null; year-only bounds never becomeJanuary 1. No event clocks or personal/national birth times are inferred.",
  "The signed BCE context range uses historical-no-year-zero labels solely for display/order, never Date/JD arithmetic or chart geometry.",
  "A mythic narrative is not automatically a seasonal timetable or an eschatological prediction. Unanchored cycles remain unanchored.",
  "Graph citation/influence edges name their supporting claim and source. Modern comparison edges assert no causal or historical relationship.",
  "Ancient Baal material is not connected to modern Satanist organizations through similarity of labels. No hidden national religion or universal good/dark classification is inferred.",
  "First-party organizational descriptions establish what the page says, not every member’s conduct, a neutral taxonomy or independent verification of all historical claims.",
  "The Mathers website has a mixed-edition conflict: its [1912] title label does not date its post-1918 preface. No silent repair is made.",
  "No new source-reading, full-book or expert/community endorsement follows from an inherited receipt or bibliography.",
  "No event score, predicted religious fulfillment, military application or mechanism of physical causation is supplied."
]);
