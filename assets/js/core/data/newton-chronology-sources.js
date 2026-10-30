// Selected Newton primary-text chronology. Bounds remain conditional and year-only.
// Acquisition receipts: /workspace/analysis/newton-calendar/; method: docs/2026-10-newton-sources.md.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const NEWTON_CHRONOLOGY_SOURCES = freeze([
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
    "readingStatus": "selected-primary-text-transcription-passages-checked",
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
      "Post-1700 is the catalogue’s broad dating, not an exact composition date for this folio. A 1704 date is not asserted by this module."
    ]
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
    "readingStatus": "selected-primary-text-transcription-passages-checked",
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
      "No manuscript photograph was collated. The edition and its TEI were checked at the cited passages; this is not a complete-unit reading."
    ]
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
    "readingStatus": "selected-primary-text-transcription-passages-checked",
    "accessStatus": "accessible",
    "sha256": "903912191fd8475a21bcd853dc9b9beeec7a8d824bc780a4f794da36768f8fcb",
    "readingScope": "Selected interpretive dictionary distinguishing natural imagery from bodies politic; symbolic days-for-years wording.",
    "sourceFamily": "NC-OBS-1733-I-II",
    "views": [],
    "rights": "Newton’s historical text is public domain; the modern Newton Project edition and editorial apparatus retain their stated rights. Only short quotations, metadata and original paraphrases are included here.",
    "limitations": [
      "This is a posthumously printed theological work, not a physics experiment or a universal Christian rule.",
      "The natural-world imagery is explained within Newton’s political and religious interpretation; it is not a modern ephemeris or proof of literal planetary causation.",
      "The chapter does not supply a year 2060 forecast; it supports the stated interpretive context only."
    ]
  },
  {
    "id": "NC-OBS-1733-I-VII",
    "title": "Observations upon the Prophecies of Daniel, Part I, Chapter VII: Of the eleventh horn of Daniel’s fourth Beast (THEM00201)",
    "author": "Isaac Newton",
    "institution": "Newton Project, University of Oxford; manuscript custodian National Library of Israel where applicable",
    "url": "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00201",
    "edition": "London 1733 posthumous edition, Newton Project normalized transcription",
    "locator": "Printed pp. 74–83, especially p. 79 (755), p. 80 (773/774) and pp. 82–83 (799 and following year)",
    "source": "Isaac Newton, Observations upon the Prophecies of Daniel, Part I, Chapter VII: Of the eleventh horn of Daniel’s fourth Beast (THEM00201); London 1733 posthumous edition, Newton Project normalized transcription; Printed pp. 74–83, especially p. 79 (755), p. 80 (773/774) and pp. 82–83 (799 and following year); https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00201.",
    "accessedAt": "2026-10-30",
    "retrievedAt": "2026-10-30T15:33:22.725668+00:00",
    "readingStatus": "selected-primary-text-transcription-passages-checked",
    "accessStatus": "accessible",
    "sha256": "a937baaed3f79f5a306e959ebbf0a004339a0ace0e6aa2514f5c2369850ad269",
    "readingScope": "Selected historical-anchor narrative: stages in Newton’s account of papal temporal power; no modern terminal-year calculation added.",
    "sourceFamily": "NC-OBS-1733-I-VII",
    "views": [],
    "rights": "Newton’s historical text is public domain; the modern Newton Project edition and editorial apparatus retain their stated rights. Only short quotations, metadata and original paraphrases are included here.",
    "limitations": [
      "This chapter’s retrospective political and theological identifications are attributed to Newton, not adopted as a neutral present-day account or universal doctrinal statement.",
      "The checked text gives 755 for the first acquisition stage and 773/774 for the second. These are not written terminal years 2016 or 2034.",
      "Different historical stages must not be substituted into the f. 13v complete-conquest anchor without declaring a new modern hypothesis."
    ]
  }
]);

export const NEWTON_CHRONOLOGY_SCENARIOS = freeze([
  {
    "id": "newton-2060-lower-bound",
    "title": "2060: conditional lower-bound argument",
    "kind": "conditional-chronology",
    "calculationEligible": true,
    "sourceIds": [
      "NC-YAHUDA-7-3G"
    ],
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437.",
    "locator": "Yahuda 7.3g f. 13v, active par.81, l1170–l1180",
    "readingStatus": "active-locus-checked-in-normalized-and-diplomatic-views",
    "anchor": {
      "year": 800,
      "era": "CE",
      "meaning": "Newton’s proposed date for the complete conquest of the three kings in his account of papal temporal power.",
      "status": "conditional"
    },
    "periodYears": 1260,
    "resultYear": 2060,
    "bound": "not-before",
    "arithmetic": {
      "expression": "800 + 1260 = 2060",
      "resultYear": 2060,
      "status": "checked-addition-of-source-stated-year-labels"
    },
    "symbolicPeriod": {
      "times": 3.5,
      "monthsPerTime": 12,
      "daysPerMonth": 30,
      "symbolicDays": 1260,
      "equivalence": "3.5 × 12 × 30 = 42 × 30 = 1260",
      "interpretation": "Newton explicitly maps days of short-lived beasts to years of long-lived kingdoms. This interpretive step is not supplied by arithmetic.",
      "physicalDayDuration": null
    },
    "originalTerms": [
      "time times & half a time",
      "42 months",
      "1260 days",
      "A.C. 800"
    ],
    "shortQuoteView": "Newton Project normalized transcription, active paragraph 81",
    "shortQuote": "It may end later, but I see no reason for its ending sooner.",
    "referent": "The 1260-year period in Newton’s interpretation of the reign of the woman/beast and the temporal dominion he identifies with Rome.",
    "calendarAssumptions": [
      "A.C. year labels are retained as positive CE year labels for this arithmetic display; no month, day, civil time, time zone or UTC instant is supplied.",
      "Year-label addition is not a conversion between Gregorian, Julian, Hebrew, Islamic or other calendars, and is not a count of physical solar days.",
      "The two encoded scenarios remain within the CE era; no year-zero crossing, inclusive ancient-year reconstruction or calendar-reform boundary is needed or inferred.",
      "Twelve 30-day months form the symbolic 360-day scheme in the passage; it is not the length of a Gregorian or astronomical year."
    ],
    "qualifications": [
      "The arithmetic is conditional on both the day-for-year interpretation and the 800 anchor.",
      "Newton explicitly says he mentions this not to assert when the time of the end shall be, but to resist recurrent failed date-setting.",
      "This is not a precise end-of-world date, a guaranteed minimum lifetime of the planet, or a validated forecast.",
      "The lower-bound wording remains attached to this particular 1260-year argument; it is not merged with the different 2300-year upper bound."
    ],
    "outcomePrediction": false,
    "eventDate": null,
    "eventClock": null
  },
  {
    "id": "newton-2370-upper-bound",
    "title": "2370: upper bound in the 2300-year argument",
    "kind": "conditional-chronology",
    "calculationEligible": true,
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "locator": "Yahuda 7.3o f. 8r, proposition 2 and paragraph 41 (l181–l182)",
    "readingStatus": "selected-locus-checked-in-normalized-and-diplomatic-views",
    "anchor": {
      "year": 70,
      "era": "CE",
      "meaning": "Newton’s stated latest commencement: destruction of Jerusalem and the Temple by the Romans, A.C. 70, within his 2300-day interpretation.",
      "status": "conditional"
    },
    "periodYears": 2300,
    "resultYear": 2370,
    "bound": "not-after",
    "arithmetic": {
      "expression": "70 + 2300 = 2370",
      "resultYear": 2370,
      "status": "checked-addition-of-source-stated-year-labels"
    },
    "symbolicPeriod": null,
    "originalTerms": [
      "2300 prophetick days",
      "A.C. 70",
      "2300 years",
      "nor after 2370"
    ],
    "shortQuoteView": "Newton Project normalized transcription, paragraph 41",
    "shortQuote": "Therefore the 2300 years do not end before the year 2132 nor after 2370.",
    "referent": "The 2300-year period discussed separately from the time-times-and-half period in this manuscript leaf.",
    "calendarAssumptions": [
      "A.C. year labels are retained as positive CE year labels for this arithmetic display; no month, day, civil time, time zone or UTC instant is supplied.",
      "Year-label addition is not a conversion between Gregorian, Julian, Hebrew, Islamic or other calendars, and is not a count of physical solar days.",
      "The two encoded scenarios remain within the CE era; no year-zero crossing, inclusive ancient-year reconstruction or calendar-reform boundary is needed or inferred."
    ],
    "qualifications": [
      "A.C. 70 is a proposed upper bound on commencement, not an exact demonstrated starting instant.",
      "The same conclusion also writes a 2132 lower bound, but this leaf does not supply its numeric commencement year; that lower calculation remains unresolved.",
      "This 2370 bound is not an alternative exact apocalypse date and must not be combined with 2060 into one asserted interval.",
      "The nearby 1290-day line is internally problematic and is retained separately without repair."
    ],
    "outcomePrediction": false,
    "eventDate": null,
    "eventClock": null
  }
]);

export const NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS = freeze([
  {
    "id": "newton-1290-unresolved-line",
    "title": "2090 and 1374: unresolved 1290-day line",
    "kind": "source-only-text",
    "calculationEligible": false,
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "locator": "f. 8r, paragraph 43; preceding propositions 5–6",
    "readingStatus": "literal-line-and-premises-checked-in-both-editorial-views",
    "literalTextView": "Normalized and diplomatic transcriptions agree at this line",
    "literalText": "The 1290 days do not begin before 2090 nor after 1374",
    "textualNumbers": [
      1290,
      2090,
      1374
    ],
    "reasonUnavailable": "The text says begin rather than end, gives a later not-before number than its not-after number, and does not agree arithmetically with the preceding 842/1084 commencement bounds. No digit, verb or ordering is silently repaired.",
    "proposedRepair": null,
    "anchor": null,
    "resultYear": null,
    "bound": null
  },
  {
    "id": "newton-2132-unreconstructed-lower-bound",
    "title": "2132: written lower bound, unreconstructed anchor",
    "kind": "source-only-text",
    "calculationEligible": false,
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "locator": "f. 8r, proposition 1 and paragraph 41",
    "readingStatus": "selected-locus-checked-in-both-editorial-views",
    "literalTextView": "Newton Project normalized transcription",
    "literalText": "Therefore the 2300 years do not end before the year 2132 nor after 2370.",
    "textualNumbers": [
      2300,
      2132,
      2370
    ],
    "reasonUnavailable": "The first proposition names the rise of the little horn without a numeric commencement year on this leaf. Subtracting 2300 from 2132 would invent an anchor and a BCE/CE year-count convention not established by this reading. The separately grounded 2370 upper bound remains its own scenario.",
    "proposedRepair": null,
    "anchor": null,
    "resultYear": null,
    "bound": null
  },
  {
    "id": "newton-2060-unfinished-upper-bound",
    "title": "2060 line with an unfinished upper bound",
    "kind": "source-only-text",
    "calculationEligible": false,
    "sourceIds": [
      "NC-YAHUDA-7-3O"
    ],
    "source": "Isaac Newton, Miscellaneous historical and apocalyptic jottings, Yahuda Ms. 7.3o (THEM00430); Newton Project diplomatic and normalized transcriptions; mixed scraps and reused papers; f. 8r, paragraphs 34–43: propositions 1–7 and three concluding lines; paragraph 41 at l181–l182; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00430.",
    "locator": "f. 8r, paragraph 42",
    "readingStatus": "unfinished-line-checked-in-both-editorial-views",
    "literalTextView": "Normalized and diplomatic transcriptions agree at this line",
    "literalText": "The time times & half time do not end before 2060 nor after",
    "textualNumbers": [
      2060
    ],
    "reasonUnavailable": "The line ends without an upper-bound year. Although a preceding proposition mentions 1084, the module does not fill the blank with 1084 + 1260 or attribute that completion to Newton.",
    "proposedRepair": null,
    "anchor": null,
    "resultYear": null,
    "bound": null
  },
  {
    "id": "newton-deleted-1260-years-draft",
    "title": "Deleted draft versus active 1260-day wording",
    "kind": "source-only-text",
    "calculationEligible": false,
    "sourceIds": [
      "NC-YAHUDA-7-3G"
    ],
    "source": "Isaac Newton, Fragments on the rise of the papacy and Revelation, Yahuda Ms. 7.3g (THEM00437); Newton Project diplomatic and normalized transcriptions; catalogue dates the unit post-1700; f. 13v, active paragraph 81, line anchors l1170–l1180; deleted draft paragraph 78 checked separately; https://www.newtonproject.ox.ac.uk/view/texts/diplomatic/THEM00437.",
    "locator": "Diplomatic paragraph 78, editorial blockstrike-n; compare active paragraph 81, f. 13v",
    "readingStatus": "paragraph-identity-and-editorial-deletion-markup-checked",
    "literalTextView": "Diplomatic editorial deletion markup; no unqualified quotation",
    "literalText": null,
    "textualNumbers": [
      1260,
      800,
      2060
    ],
    "reasonUnavailable": "An earlier block marked deleted in the diplomatic edition says period of 1260 years; the active paragraph says 1260 days and explicitly maps days to years. Flattened extraction can mix these states. This is not an active normalized/diplomatic disagreement or an additional independent forecast.",
    "proposedRepair": null,
    "anchor": null,
    "resultYear": null,
    "bound": null
  }
]);

export const NEWTON_CHRONOLOGY_LIMITS = freeze([
  "This is a selected primary-text study of Newton’s theological chronology, not a complete reading of his manuscripts, the 1733 book, or all Christian eschatology.",
  "Correct addition does not establish the interpretive day-year premise, historical identification, chosen anchor or claimed future event.",
  "The 1260 and 2300-year arguments have separate textual referents. Their numerical bounds are not combined into one forecast interval or ranked by predictive validity.",
  "The 30-day symbolic month and 360-day symbolic year are textual conventions; they are not asserted physical lengths of months or years.",
  "No event day, clock, observer, time zone or astronomical configuration is provided by a year-only conclusion. Calendar exploration requires separately explicit inputs.",
  "Normalized and diplomatic views are two representations of the same manuscript. Deleted drafts, additions, incomplete lines and unresolved numbers remain qualified.",
  "The selected passages did not verify 2016 or 2034 as Newton-stated terminal years. Historical anchors from other stages are not substituted to manufacture those attributions.",
  "The 1733 work was published after Newton’s death. Catalogue date labels for mixed manuscript units do not establish exact dates for every constituent scrap.",
  "No empirical confirmation, secret affiliation, military application, or timing recommendation follows from this corpus."
]);

const sourceIds = new Set(NEWTON_CHRONOLOGY_SOURCES.map(source => source.id));
if (sourceIds.size !== NEWTON_CHRONOLOGY_SOURCES.length) throw new TypeError('Newton source IDs must be unique.');
const recordIds = new Set();
for (const row of [...NEWTON_CHRONOLOGY_SCENARIOS, ...NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS]) {
  if (!row.id || recordIds.has(row.id) || !row.source || !row.locator || !row.readingStatus || !row.sourceIds.length || row.sourceIds.some(id => !sourceIds.has(id))) throw new TypeError('Newton records need unique IDs and explicit, resolvable source provenance.');
  if (row.calculationEligible) {
    if (!Number.isInteger(row.anchor.year) || !Number.isInteger(row.periodYears) || !Number.isInteger(row.resultYear) || row.anchor.year <= 0 || row.periodYears <= 0 || row.anchor.year + row.periodYears !== row.resultYear || !['not-before', 'not-after'].includes(row.bound)) throw new TypeError('Only verified positive-CE conditional year arithmetic is encoded.');
    if (row.eventDate !== null || row.eventClock !== null || row.outcomePrediction !== false) throw new TypeError('Newton year bounds must not become dated event predictions.');
  } else if (row.anchor !== null || row.resultYear !== null || row.bound !== null || row.proposedRepair !== null) throw new TypeError('Unresolved Newton text must not acquire a repaired calculation.');
  recordIds.add(row.id);
}
