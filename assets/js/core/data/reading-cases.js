/** Public, source-pinned examples. Numeric matches validate only listed fields.
 * Historical frameworks and practical scenarios are not outcome predictions.
 * Source ledger: research/reading-lab/source-ledger.json. */
export const READING_SOURCES = [
  {
    "id": "rl-egypt-ucl",
    "title": "UCL Digital Egypt: Calendar",
    "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/calendar.html",
    "retrievedAt": "2026-11-04",
    "locator": "Opening comparison of Egyptian and Coptic calendars; twelve-month table and epagomenal days",
    "evidenceQuality": "institutional historical reference",
    "readingDepth": "Full short page and month table read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Ancient Egyptian civil year: twelve thirty-day months plus five additional days.",
      "Coptic/Alexandrian intercalation is a later reform; it must not be silently applied to the wandering civil year."
    ],
    "limitations": [
      "This source supplies calendar structure, not personal horoscopes or a unique ancient epoch."
    ]
  },
  {
    "id": "rl-coptic-calendar",
    "title": "CopticChurch.net: Calendar of Martyrs",
    "url": "https://www.copticchurch.net/calendar",
    "retrievedAt": "2026-11-04",
    "locator": "Quick facts; month table; Calendar of Martyrs chronology",
    "evidenceQuality": "community institutional calendar reference",
    "readingDepth": "Selected calendar-structure and chronology sections read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Coptic calendar has twelve thirty-day months and a short thirteenth month; its leap convention differs from the ancient wandering year."
    ],
    "limitations": [
      "Historical origin claims are not independently adopted; no current-date widget was treated as an external fixture."
    ]
  },
  {
    "id": "rl-maya-converter",
    "title": "Smithsonian NMAI Living Maya Time: Maya Calendar Converter",
    "url": "https://maya.nmai.si.edu/calendar/maya-calendar-converter",
    "retrievedAt": "2026-11-04",
    "locator": "Reading the Maya Calendar: explicit December 20, 2012 example",
    "evidenceQuality": "institutional worked calendar example",
    "readingDepth": "Main explanation and printed worked example read; converter not automated",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "2012-12-20 corresponds to 12.19.19.17.19, 3 Kawak, 2 K’ank’in in the displayed correlation.",
      "Long Count units are 20 kin, 18 uinal, 20 tun and 20 katun."
    ],
    "limitations": [
      "Correlation convention is part of the result; different correlations produce different Gregorian dates.",
      "Glyph artwork and site implementation are not copied."
    ]
  },
  {
    "id": "rl-maya-2012",
    "title": "Smithsonian NMAI: 2012, Resetting the Count",
    "url": "https://maya.nmai.si.edu/2012-resetting-count",
    "retrievedAt": "2026-11-04",
    "locator": "Main introduction and Maya-perspective discussion",
    "evidenceQuality": "institutional cultural contextualization",
    "readingDepth": "Main explanatory section read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "A Long Count cycle transition is not evidence for an apocalypse."
    ],
    "limitations": [
      "This is a selected institutional explanation, not coverage of every Maya community or interpretation."
    ]
  },
  {
    "id": "rl-lilly",
    "title": "William Lilly: Christian Astrology, Book I, modern transcription",
    "url": "https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf",
    "retrievedAt": "2026-11-04",
    "locator": "Printed pp. 101–105 essential dignities; pp. 113–114 combustion and cazimi",
    "evidenceQuality": "primary historical text through modern transcription",
    "readingDepth": "Selected definitions, worked examples and table read; not full book",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "The text treats dignity and solar proximity as distinct traditional judgments.",
      "The eight-degree-thirty-minute combustion definition conflicts with its second ten-degree example.",
      "The printed cazimi example places Sun at 15°30′ Taurus and Mercury at 15°25′ Taurus."
    ],
    "limitations": [
      "Transcription glyphs can be corrupted; primary scan checking is needed before exact table extraction.",
      "Historical descriptions are not validated forecasts of events."
    ]
  },
  {
    "id": "rl-usccb-2024",
    "title": "USCCB: Liturgical Calendar for the Dioceses of the United States of America, 2024",
    "url": "https://www.usccb.org/resources/2024cal.pdf",
    "retrievedAt": "2026-11-04",
    "locator": "Principal celebrations table (PDF p. 6); March 31 entry",
    "evidenceQuality": "official denominational calendar",
    "readingDepth": "Principal dates table and dated Easter entry read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Gregorian Easter Sunday is March 31, 2024 for this Catholic calendar."
    ],
    "limitations": [
      "Denominational calendar, not a universal statement of Christian astrology."
    ]
  },
  {
    "id": "rl-coptic-feasts",
    "title": "CopticChurch.net: Coptic Feasts for 2024",
    "url": "https://www.copticchurch.net/calendar/feasts/2024",
    "retrievedAt": "2026-11-04",
    "locator": "Seven Major Feasts: Easter, May 5th",
    "evidenceQuality": "community institutional liturgical calendar",
    "readingDepth": "Entire short 2024 list read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Coptic Easter is May 5, 2024."
    ],
    "limitations": [
      "Source states its calculator range is 1902–2037; the fixture does not validate other years."
    ]
  },
  {
    "id": "rl-rao",
    "title": "P. V. R. Narasimha Rao: Vedic Astrology, An Integrated Approach",
    "url": "https://www.vedicastrologer.org/articles/vedic_astro_textbook.pdf",
    "retrievedAt": "2026-11-04",
    "locator": "§1.3.8.1 and Example 2, printed pp.13–14; §1.3.11, p.17; §1.3.13 Ayanamsa, p.18",
    "evidenceQuality": "author-published worked textbook examples",
    "readingDepth": "Selected tithi, hora and ayanamsha definitions and worked examples read; not full book",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Example 2: Moon 84°12′, Sun 227°46′; positive difference 216°26′; tithi 19, Krishna Chaturthi.",
      "Wednesday 21:40 with sunrise 06:10: the worked hora example identifies the sixteenth hour and Moon ruler.",
      "§1.3.13 explains precession, the changing tropical/sidereal offset, subtracting ayanamsha and the chosen Chitrapaksha/Lahiri convention."
    ],
    "limitations": [
      "The hora passage uses an equal-hour approximation; unequal seasonal planetary hours are a different convention.",
      "Modern textbook synthesis does not represent every Vedic school.",
      "No independently published outcome follows from these arithmetic examples."
    ]
  },
  {
    "id": "rl-hko-2024",
    "title": "Hong Kong Observatory: Gregorian–Lunar Calendar Conversion Table of 2024",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2024e.pdf",
    "retrievedAt": "2026-11-04",
    "locator": "Single-page table, February row, Gregorian day 10",
    "evidenceQuality": "official astronomical calendar table",
    "readingDepth": "February row and year heading read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "February 10, 2024 is the first day of the first lunar month."
    ],
    "limitations": [
      "Use Chinese civil calendar convention; neither a full BaZi reading nor an auspiciousness score."
    ]
  },
  {
    "id": "rl-hko-2023",
    "title": "Hong Kong Observatory: Gregorian–Lunar Calendar Conversion Table of 2023",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2023e.pdf",
    "retrievedAt": "2026-11-04",
    "locator": "Single-page table, February day 20 and March day 22: repeated second lunar month",
    "evidenceQuality": "official astronomical calendar table",
    "readingDepth": "February and March month starts compared",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "February 20 starts the second lunar month; March 22 starts a second instance of lunar month two in 2023."
    ],
    "limitations": [
      "Leap identity follows the repeated second-month sequence; PDF text extraction does not explicitly spell out the word leap."
    ]
  },
  {
    "id": "rl-hko-calendar",
    "title": "Hong Kong Observatory: Gregorian–Lunar Calendar Conversion Table information",
    "url": "https://www.hko.gov.hk/en/gts/time/calendarinfo.htm",
    "retrievedAt": "2026-11-04",
    "locator": "Calendar introduction and explanatory links",
    "evidenceQuality": "official astronomical calendar explanation",
    "readingDepth": "Full short page read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Gregorian and Chinese lunar calendar conversion is an explicit calendrical operation."
    ],
    "limitations": [
      "Calendar conversion does not establish personal fate or validate religious predictions."
    ]
  },
  {
    "id": "rl-hebcal-convert",
    "title": "Hebcal Converter API: October 3, 2024",
    "url": "https://www.hebcal.com/converter?cfg=json&gy=2024&gm=10&gd=3&g2h=1",
    "retrievedAt": "2026-11-04",
    "locator": "JSON fields gy,gm,gd,afterSunset,hy,hm,hd",
    "evidenceQuality": "independent specialist conversion service",
    "readingDepth": "Complete JSON response read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "2024-10-03 before sunset maps to 1 Tishrei 5785."
    ],
    "limitations": [
      "Intl labels this month Tishri; the spelling alias is declared, not silently scored as different.",
      "This is a selected external service comparison, not exhaustive independent validation."
    ]
  },
  {
    "id": "rl-hebcal-day",
    "title": "Hebcal Converter API: October 2, 2024, before sunset",
    "url": "https://www.hebcal.com/converter?cfg=json&gy=2024&gm=10&gd=2&g2h=1",
    "retrievedAt": "2026-11-04",
    "locator": "JSON afterSunset=false,hy,hm,hd",
    "evidenceQuality": "independent specialist conversion service",
    "readingDepth": "Complete JSON response read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "2024-10-02 before sunset maps to 29 Elul 5784."
    ],
    "limitations": [
      "No location or solar time is supplied."
    ]
  },
  {
    "id": "rl-hebcal-sunset",
    "title": "Hebcal Converter API: October 2, 2024, after sunset",
    "url": "https://www.hebcal.com/converter?cfg=json&gy=2024&gm=10&gd=2&g2h=1&gs=on",
    "retrievedAt": "2026-11-04",
    "locator": "JSON afterSunset=true,hy,hm,hd",
    "evidenceQuality": "independent specialist conversion service",
    "readingDepth": "Complete JSON response read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "2024-10-02 after sunset maps to 1 Tishrei 5785."
    ],
    "limitations": [
      "The explicit sunset flag changes the religious date; this is not an observed sunset calculation."
    ]
  },
  {
    "id": "rl-hebcal-rh",
    "title": "Hebcal: Rosh Hashana 2024 / 5785",
    "url": "https://www.hebcal.com/holidays/rosh-hashana-2024",
    "retrievedAt": "2026-11-04",
    "locator": "Opening date interval and description",
    "evidenceQuality": "independent specialist holiday calendar",
    "readingDepth": "Opening holiday dates and explanation read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Rosh Hashana 5785 begins on the evening of October 2, 2024."
    ],
    "limitations": [
      "Local observance and exact sunset time require a location and community convention."
    ]
  },
  {
    "id": "rl-dee-monas",
    "title": "John Dee: Monas Hieroglyphica (1564), Hamilton-Jones translation (1947)",
    "url": "https://esotericarchives.com/dee/monad.htm",
    "retrievedAt": "2026-11-04",
    "locator": "Main body Theorems I–VI; title and translation attribution",
    "evidenceQuality": "primary historical treatise in later translation",
    "readingDepth": "Selected I–VI passages and edition attribution read; not full treatise",
    "rights": "1564 Latin is historical public-domain material; the 1947 English translation has separate rights. Original short paraphrases only; no translation or diagrams redistributed.",
    "claims": [
      "Theorems III–VI assemble a central point and solar circle, lunar semicircle and right-angled cross as a symbolic monad."
    ],
    "limitations": [
      "The table of contents duplicates a theorem label; body headings were used.",
      "Not a birth-date calendar, a physical mechanism or proof of supernatural efficacy."
    ]
  },
  {
    "id": "rl-jung-primary",
    "title": "C. G. Jung: Psychological Types, H. G. Baynes translation (1923), archived OCR",
    "url": "https://archive.org/download/psychological_types/psychological_types_djvu.txt",
    "retrievedAt": "2026-11-04",
    "locator": "Definitions: Feeling, printed pp. 543–545; Individuation, printed pp. 561–563",
    "evidenceQuality": "primary historical psychology text via OCR",
    "readingDepth": "Selected definitions read, including surrounding page markers; not full book",
    "rights": "1923 English edition is public domain in the United States; jurisdiction may differ. OCR is not redistributed; original paraphrases are supplied.",
    "claims": [
      "Feeling is described as valuation, acceptance or rejection, and is not simply emotion.",
      "Individuation is differentiated development that retains collective relationship, not mere isolation."
    ],
    "limitations": [
      "OCR errors and historical psychological claims need contextual reading.",
      "No typology, diagnosis or life outcome can be computed from a birth date with these definitions."
    ]
  },
  {
    "id": "rl-jung-feeling",
    "title": "Society of Analytical Psychology: Typology, Fiona Ross",
    "url": "https://www.thesap.org.uk/articles-on-jungian-psychology-2/about-analysis-and-therapy/typology/",
    "retrievedAt": "2026-11-04",
    "locator": "Psychological Functions section",
    "evidenceQuality": "specialist secondary interpretation",
    "readingDepth": "Psychological-functions section and attribution read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Thinking and feeling are described as judging functions; sensation and intuition as perceptive functions."
    ],
    "limitations": [
      "A specialist interpretation supplements the primary text; it is not an independent clinical validation."
    ]
  },
  {
    "id": "rl-jung-individuation",
    "title": "Society of Analytical Psychology: Individuation, Martin Schmidt",
    "url": "https://www.thesap.org.uk/articles-on-jungian-psychology-2/about-analysis-and-therapy/individuation/",
    "retrievedAt": "2026-11-04",
    "locator": "Collective and personal section",
    "evidenceQuality": "specialist secondary interpretation",
    "readingDepth": "Selected collective/personal discussion read",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Individuation involves both personal and collective dimensions."
    ],
    "limitations": [
      "This is contextual interpretation, not an automated assessment."
    ]
  },
  {
    "id": "rl-plato-republic",
    "title": "Plato: Republic, Book X, Benjamin Jowett translation",
    "url": "https://classics.mit.edu/Plato/republic.11.x.html",
    "retrievedAt": "2026-11-04",
    "locator": "Myth of Er, Stephanus 617d–618a and 620d–621a; lot/choice passages",
    "evidenceQuality": "primary philosophical text in historical translation",
    "readingDepth": "Selected choice, responsibility and daimon passages read; not entire Republic",
    "rights": "Ancient text and Jowett translation are public-domain works; site formatting is not copied. Original paraphrases only.",
    "claims": [
      "The lot determines order of choosing lives; responsibility is attributed to the chooser.",
      "The daimon in this myth is not a natal longitude formula."
    ],
    "limitations": [
      "Stephanus locators identify the standard passage; the MIT page is not line-numbered."
    ]
  },
  {
    "id": "rl-plato-timaeus",
    "title": "Plato: Timaeus, Benjamin Jowett translation",
    "url": "https://classics.mit.edu/Plato/timaeus.html",
    "retrievedAt": "2026-11-04",
    "locator": "Stephanus 90a–d, paragraph beginning And we should consider",
    "evidenceQuality": "primary philosophical text in historical translation",
    "readingDepth": "Selected rational/divine-principle passage read; not entire dialogue",
    "rights": "Ancient text and Jowett translation are public-domain works; site formatting is not copied. Original paraphrases only.",
    "claims": [
      "The highest part of the soul is linked to a divine principle and the cultivation of understanding."
    ],
    "limitations": [
      "This cosmological philosophy is distinct from an astrological Lot of Spirit and is not a predictive calculator."
    ]
  },
  {
    "id": "rl-lilly-dog-figure",
    "title": "William Lilly, Christian Astrology (1647), original dog-question figure",
    "url": "https://ia903103.us.archive.org/BookReader/BookReaderImages.php?zip=/10/items/b30338724/b30338724_jp2.zip&file=b30338724_jp2/b30338724_0426.jp2&id=b30338724&scale=2&rotate=0",
    "retrievedAt": "2026-11-04",
    "locator": "Printed p.392, chapter LXII; archive b30338724, image leaf 426",
    "evidenceQuality": "primary printed chart, visually inspected",
    "readingDepth": "Full printed p392 image visually inspected, selected four clear planetary positions transcribed; adjacent narrative checked through OCR",
    "rights": "1647 printed work is public domain; this app links the scan and republishes factual values with original commentary, not the scan image.",
    "claims": [
      "Printed Sun 15°45′ Virgo, Moon 4°10′ Virgo, Mercury 12°20′ Libra and Saturn 18°15′ Taurus differ from the inherited reconstruction.",
      "Figure header reads29 August 1646 at 4:05 P.M.; historical OldStyle is retained."
    ],
    "limitations": [
      "Only four unambiguously legible positions enter the reference checks. Other planetary degrees/minutes, cusp values and house assignments are not certified.",
      "A printed figure comparison is not independent ephemeris validation. The reported recovery is Lilly’s narrative, not independently verified outcome data."
    ]
  },
  {
    "id": "rl-lilly-primary",
    "title": "William Lilly, Christian Astrology (1647), archive OCR",
    "url": "https://archive.org/download/b30338724/b30338724_djvu.txt",
    "retrievedAt": "2026-11-04",
    "locator": "Chapter LXII, A Dogge missing, where?; printed pp.392–394 as verified against pageimage",
    "evidenceQuality": "primary historical text through fallible OCR",
    "readingDepth": "Selected dog-question narrative and surrounding chapter read; not entire book",
    "rights": "1647 printed work is public domain; no full OCR redistribution.",
    "claims": [
      "The narrative discusses significator choice, direction and the author’s reported recovery of the missing dog."
    ],
    "limitations": [
      "OCR page numbers and astrological glyphs are unreliable; the image supplies the four numerical reference fields.",
      "The author’s favorable outcome report is not independent ground truth."
    ]
  },
  {
    "id": "rl-swiss-general",
    "title": "Astrodienst: Swiss Ephemeris general documentation",
    "url": "https://www.astro.com/swisseph/swisseph.htm",
    "retrievedAt": "2026-11-04",
    "locator": "§2.8.1 zodiac definition; §6.2.1 Placidus; §6.2.5 equal and whole-sign houses; §6.4 polar limits",
    "evidenceQuality": "maintainer technical documentation",
    "readingDepth": "Selected zodiac, house-definition and polar-limit sections read; not full manual",
    "rights": "Reference and original paraphrase only; linked material is not redistributed and no training licence is inferred.",
    "claims": [
      "Tropical zero Aries is the vernal point; sidereal zero is selected relative to stars and depends on an ayanamsha convention.",
      "Whole-sign houses begin at the start of the rising zodiac sign; equal houses from the Ascendant begin at the Ascendant degree.",
      "Placidus cusps use divisions of semidiurnal and seminocturnal arcs."
    ],
    "limitations": [
      "A technical definition does not validate a personal interpretation.",
      "Placidus definition is checked in this maintained technical source; no independent second publisher was successfully retrieved in this pass."
    ]
  }
];

export const READING_METHOD_NOTES = [
  {
    "id": "RL-METHOD-HOUSE-ORIGINS",
    "title": "Whole-sign versus equal houses: different origins",
    "sourceIds": [
      "rl-swiss-general"
    ],
    "locator": "Swiss Ephemeris general documentation §6.2.5",
    "text": "Whole-sign houses assign the entire zodiac sign containing the Ascendant to house one: its cusp is 0° of that sign. Equal houses from the Ascendant divide the ecliptic into twelve 30° houses beginning at the actual Ascendant degree. For a synthetic Ascendant of 18° Taurus, whole-sign house one starts at 0° Taurus, while equal house one starts at 18° Taurus. The sky positions do not change when the house convention changes; a planet near a boundary can change house. This is a method definition and synthetic illustration, not an external worked birth example.",
    "limitations": [
      "Not every system called equal houses uses the Ascendant; name the variant explicitly.",
      "A house-placement disagreement does not by itself establish that either interpretation predicts an outcome."
    ]
  },
  {
    "id": "RL-METHOD-PLACIDUS",
    "title": "Placidus: time arcs and high-latitude limits",
    "sourceIds": [
      "rl-swiss-general"
    ],
    "locator": "Swiss Ephemeris general documentation §§6.2.1 and 6.4",
    "text": "Placidus houses divide semidiurnal and seminocturnal arcs: the arcs of apparent daily motion from horizon to meridian above and below the horizon. Its intermediate cusps are ecliptic points satisfying the specified fractions of their own arcs. It is not simply twelve equal zodiac sectors or a trisection of an ecliptic quadrant. Latitude and local time matter. In polar situations the required rising or setting geometry may be absent; a fallback system must be labelled rather than silently called Placidus.",
    "limitations": [
      "Definition checked in the maintainer technical manual; second independent publisher retrieval was unsuccessful.",
      "Software parity and the interpretation of a house require separate evidence."
    ]
  },
  {
    "id": "RL-METHOD-ZODIAC-FRAMES",
    "title": "Tropical versus sidereal: origin, stars and precession",
    "sourceIds": [
      "rl-swiss-general",
      "rl-rao"
    ],
    "locator": "Swiss Ephemeris general documentation §2.8.1; Rao §1.3.13,printed p.18",
    "text": "The tropical zodiac sets 0° Aries at the vernal equinox on the ecliptic. A sidereal zodiac selects its origin relative to a stellar reference; different ayanamsha conventions choose different offsets. Precession changes the equinox relative to the stars, so tropical and sidereal longitude labels slowly diverge. In the usual offset method, sidereal longitude equals tropical longitude minus the chosen ayanamsha, normalized to 0–360°. This is not a fixed celestial-equator reference, and neither zodiac is identical to the unequal modern IAU constellation boundaries. The same observed planet may have different sign labels without the planet moving.",
    "limitations": [
      "The app uses a named linear Lahiri approximation, not exact universal sidereal or JHora parity.",
      "A frame difference is not evidence for different physical influences."
    ]
  },
  {
    "id": "RL-METHOD-READING-CHAIN",
    "title": "From a checked calculation to a conditional everyday reading",
    "sourceIds": [
      "rl-lilly",
      "rl-rao",
      "rl-jung-primary",
      "rl-plato-republic"
    ],
    "locator": "Worked examples and distinctions in the selected passages; application structure is authored for this app",
    "text": "Keep five layers visible: (1) supplied input and convention; (2) reproducible calculated fact; (3) the named source rule, including conflicts; (4) a conditional everyday scenario explicitly authored as a reflective application; (5) a low-risk action and observations that would support or weaken its usefulness. A matching date or angle validates that field only. Shared Moon/Sun inputs do not make two symbolic methods independent evidence. Do not infer diagnosis, guaranteed fortune, war, disasters or a person’s beliefs from the reading.",
    "limitations": [
      "The scenario-to-outcome link has not been validated by the source-field checks.",
      "Use practical evidence for consequential decisions."
    ]
  }
];

export const READING_CASES = [
  {
    "id": "egyptian-civil-structure",
    "traditionId": "egyptian",
    "methodId": "ancient-civil-vs-coptic",
    "title": "Egyptian civil year: twelve months and five extra days",
    "kind": "textual-method",
    "sourceIds": [
      "rl-egypt-ucl",
      "rl-coptic-calendar"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "Twelve thirty-day months plus five additional days make a 365-day ancient civil year. Coptic intercalation belongs to a later reform.",
      "sourceLocator": "UCL month table and opening calendar comparison",
      "scenarios": [
        "If organizing a historical exhibit, preserve its civil-calendar convention instead of replacing it with today’s Coptic date.",
        "For a recurring personal review, a calendar anniversary can be a chosen reminder without implying a favorable cosmic event."
      ],
      "questions": [
        "Which historical period and epoch is intended?",
        "Is the date civil Egyptian, Alexandrian/Coptic or a modern reconstruction?"
      ],
      "actions": [
        "Record the epoch and leap convention beside any conversion.",
        "Use ordinary scheduling needs to choose an anniversary activity."
      ],
      "supportChecks": [
        "The stated structure sums to 365 days.",
        "The selected source distinguishes intercalation from the earlier civil year."
      ],
      "refuteChecks": [
        "A result silently inserts a sixth epagomenal day into an unreformed ancient year.",
        "A modern Coptic conversion is labelled a verified ancient Egyptian horoscope."
      ],
      "limits": [
        "No independent Gregorian-to-ancient-Egyptian epoch fixture is supplied; this case is not counted as conversion accuracy."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "mayan-nmai-2012-12-20",
    "traditionId": "mayan",
    "methodId": "long-count-gmt584283",
    "title": "Smithsonian worked Maya date: December 20, 2012",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-maya-converter",
      "rl-maya-2012"
    ],
    "input": {
      "dateISO": "2012-12-20",
      "timeZone": "UTC"
    },
    "expected": [
      {
        "field": "frameworks.mayan.facts.longCount",
        "value": "12.19.19.17.19",
        "basis": "Smithsonian printed worked example"
      },
      {
        "field": "frameworks.mayan.facts.tzolkin.number",
        "value": 3,
        "basis": "Same example"
      },
      {
        "field": "frameworks.mayan.facts.tzolkin.name",
        "value": "Kawak",
        "basis": "Same example"
      },
      {
        "field": "frameworks.mayan.facts.haab.day",
        "value": 2,
        "basis": "Same example"
      },
      {
        "field": "frameworks.mayan.facts.haab.month",
        "value": "K’ank’in",
        "basis": "Source apostrophe spelling normalized explicitly to this display label"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "The Long Count counts elapsed days in unequal place-value units; the Tzolk’in and Haab are parallel cycles.",
      "sourceLocator": "NMAI Reading the Maya Calendar, December 20 example",
      "scenarios": [
        "If a deadline looks symbolically important because a cycle ends, use the transition to review completed work and next steps.",
        "A community calendar observance should follow that community’s practice rather than a generic catastrophe narrative."
      ],
      "questions": [
        "Which correlation constant is in use?",
        "What evidence beyond a calendar label supports the proposed real-world claim?"
      ],
      "actions": [
        "Compare the printed date with the displayed fields.",
        "Write a practical retrospective and a reversible next step."
      ],
      "supportChecks": [
        "All five displayed date fields match the external example."
      ],
      "refuteChecks": [
        "Switching the correlation changes the Gregorian mapping.",
        "A cycle boundary is used as evidence of a disaster."
      ],
      "limits": [
        "This fixture checks one published conversion, not all Maya calendrical traditions or outcomes."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "lilly-cazimi-example",
    "traditionId": "lilly",
    "methodId": "historical-solar-proximity",
    "title": "Lilly’s printed cazimi example: a five-minute separation",
    "kind": "worked-chart",
    "sourceIds": [
      "rl-lilly"
    ],
    "input": {
      "planetLongitude": 45.416666666666664,
      "sunLongitude": 45.5
    },
    "expected": [
      {
        "field": "frameworks.lilly.facts.solarProximity.separationDegrees",
        "value": 0.08333333333333333,
        "basis": "Printed Sun 15°30′ Taurus and Mercury15°25′ Taurus",
        "tolerance": 1e-10
      },
      {
        "field": "frameworks.lilly.facts.solarProximity.textualCategory",
        "value": "cazimi",
        "basis": "Printed example explicitly classed as cazimi"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Published positions and selected historical rule only; not independent ephemeris, complete horoscope or outcome validation."
    },
    "interpretation": {
      "rule": "Lilly’s example has Sun at 15°30′ Taurus and Mercury at 15°25′ Taurus: five arcminutes apart, within his seventeen-arcminute cazimi limit.",
      "sourceLocator": "Christian Astrology I, printed p.113, Cazimi",
      "scenarios": [
        "As a historical-reading exercise, first check the angular arithmetic, then label the traditional positive judgment separately.",
        "If using the image of concentration as a journaling prompt, choose a short focused work session and observe whether it helps."
      ],
      "questions": [
        "Are the two positions in the same sign and frame?",
        "Is a practical benefit observed, or only assumed from the label?"
      ],
      "actions": [
        "Keep source arithmetic separate from claims about success.",
        "Try one brief, measurable focus block without changing a major commitment."
      ],
      "supportChecks": [
        "The difference between the printed positions is five arcminutes."
      ],
      "refuteChecks": [
        "The model interprets five arcminutes as five degrees.",
        "A historical dignity label is asserted to guarantee an outcome."
      ],
      "limits": [
        "Only the two printed positions and their named classification are checked; no birth date, observer, ephemeris accuracy or outcome is inferred."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "lilly-combustion-disagreement",
    "traditionId": "lilly",
    "methodId": "historical-rule-conflict",
    "title": "Lilly combustion: preserve a source contradiction",
    "kind": "textual-method",
    "sourceIds": [
      "rl-lilly"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "The stated same-sign combustion threshold is 8°30′. The first example is separated by 8°; the next is separated by 10° yet is also called combust. The discrepancy remains visible.",
      "sourceLocator": "Christian Astrology I, printed pp.113–114, Combustion",
      "scenarios": [
        "When two rules disagree, pause an interpretation and record which rule the software actually implements.",
        "For an everyday decision, treat the contradiction as a reason to seek ordinary evidence, not as a hidden danger signal."
      ],
      "questions": [
        "Was the prose definition or conflicting example selected?",
        "Can a primary scan or another edition resolve a transcription issue?"
      ],
      "actions": [
        "Label the contradiction in notes.",
        "Do not average incompatible rules into a new confidence score."
      ],
      "supportChecks": [
        "The two stated examples differ by 8° and 10°, respectively."
      ],
      "refuteChecks": [
        "The 10° example is silently changed to fit 8°30′.",
        "The disputed passage is presented as uniform agreement."
      ],
      "limits": [
        "No numerical accuracy credit: the source itself supplies incompatible classification evidence."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "christian-easter-2024",
    "traditionId": "lilly",
    "methodId": "christian-computus",
    "title": "Two 2024 Easter dates: March 31 and May 5",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-usccb-2024",
      "rl-coptic-feasts"
    ],
    "input": {
      "dateISO": "2024-01-01",
      "timeZone": "UTC"
    },
    "expected": [
      {
        "field": "frameworks.lilly.facts.computus.gregorianEaster",
        "value": "2024-03-31",
        "basis": "USCCB 2024 principal celebrations table"
      },
      {
        "field": "frameworks.lilly.facts.computus.julianEasterGregorian",
        "value": "2024-05-05",
        "basis": "CopticChurch.net Easter 2024 date"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "Gregorian and Julian Paschal calculations can identify different civil Sundays; the source calendars specify distinct Christian observances.",
      "sourceLocator": "USCCB 2024 table; CopticChurch.net Seven Major Feasts",
      "scenarios": [
        "If arranging a multi-community meal, the five-week difference can affect attendance and fasting practice.",
        "A calendar comparison can explain a scheduling mismatch without ranking one community’s date as spiritually stronger."
      ],
      "questions": [
        "Which community and calendar convention is involved?",
        "Are travel, worship and meal plans compatible with participants’ actual observance?"
      ],
      "actions": [
        "Confirm the observance with participants.",
        "Keep both dates visible when planning shared events."
      ],
      "supportChecks": [
        "The two named calendars publish these exact 2024 dates."
      ],
      "refuteChecks": [
        "A result treats all Christians as using a single date.",
        "A computus result is repurposed as a natal or geopolitical prediction."
      ],
      "limits": [
        "Lilly is the historical-Western navigation family; Christian computus is a separate method, not a rule from Lilly or a universal Christian horoscope."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "vedic-rao-tithi-example-2",
    "traditionId": "vedic",
    "methodId": "tithi-longitude-example",
    "title": "Rao Example 2: Krishna Chaturthi from supplied longitudes",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-rao"
    ],
    "input": {
      "sunLongitude": 227.76666666666668,
      "moonLongitude": 84.2,
      "frame": "Published same-frame longitudes; no birth date or observer"
    },
    "expected": [
      {
        "field": "frameworks.vedic.facts.elongationDegrees",
        "value": 216.43333333333334,
        "basis": "Rao printed p.14:216°26′",
        "tolerance": 1e-09
      },
      {
        "field": "frameworks.vedic.facts.tithiNumber",
        "value": 19,
        "basis": "Rao Example 2:19th tithi, Krishna Chaturthi"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "Subtract Sun from Moon, normalize to 0–360°, divide by 12°, and add one to the integer quotient. This gives lunar phase division, not personal destiny.",
      "sourceLocator": "§1.3.8.1, Example 2, printed pp.13–14",
      "scenarios": [
        "If checking an almanac, this arithmetic explains why a tithi can change independently of midnight.",
        "For a personal review routine, use a phase label as an optional reminder; determine workload from actual capacity."
      ],
      "questions": [
        "Were both longitudes expressed in the same reference frame?",
        "Does the local observance require the tithi at sunrise or another moment?"
      ],
      "actions": [
        "Reproduce the subtraction before interpreting the label.",
        "Consult a location-specific almanac for a real observance."
      ],
      "supportChecks": [
        "The normalized difference and nineteenth tithi match the published arithmetic."
      ],
      "refuteChecks": [
        "The case is assigned a fabricated birth time or location.",
        "A symbolic tithi is asserted to predict a specific event."
      ],
      "limits": [
        "No ephemeris accuracy is tested: the longitudes are supplied by the source. No outcome labels are available."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "vedic-rao-hora-example",
    "traditionId": "vedic",
    "methodId": "textbook-hora-convention",
    "title": "Rao’s Wednesday hora example and its convention",
    "kind": "textual-method",
    "sourceIds": [
      "rl-rao"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "For Wednesday 21:40 with sunrise 06:10, the textbook counts the running sixteenth hour from sunrise and assigns Moon in the repeating planetary order.",
      "sourceLocator": "§1.3.11 Hora, printed p.17",
      "scenarios": [
        "When two applications name different hour rulers, check whether one uses unequal daytime/nighttime hours and the other this equal-hour convention.",
        "A scheduled rest or reflection interval can be useful because it fits the person’s routine, independently of the ruler label."
      ],
      "questions": [
        "What sunrise and day-length convention was used?",
        "Are clocks and time zones the same?"
      ],
      "actions": [
        "Record the hora convention before comparing tools.",
        "Keep a routine only if it helps in practice."
      ],
      "supportChecks": [
        "15h30m elapsed falls in the running sixteenth hour under the worked convention."
      ],
      "refuteChecks": [
        "The example is claimed to validate unequal seasonal hours without a sunset input.",
        "A planetary-hour label overrides an urgent practical need."
      ],
      "limits": [
        "The example lacks a calendar date/location and sunset; it is not an external reference for the app’s seasonal-hours calculator."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "chinese-new-year-2024",
    "traditionId": "chinese",
    "methodId": "chinese-civil-lunisolar",
    "title": "HKO 2024: first day of the first lunar month",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-hko-2024",
      "rl-hko-calendar"
    ],
    "input": {
      "dateISO": "2024-02-10",
      "timeZone": "Asia/Hong_Kong"
    },
    "expected": [
      {
        "field": "frameworks.chinese.facts.month",
        "value": 1,
        "basis": "HKO February 10 cell:1st Lunar Month"
      },
      {
        "field": "frameworks.chinese.facts.day",
        "value": 1,
        "basis": "The cell denotes the first day of the month"
      },
      {
        "field": "frameworks.chinese.facts.isLeapMonth",
        "value": false,
        "basis": "First regular lunar month in HKO 2024 table"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "Chinese civil lunar dates follow astronomical month starts and calendar rules; the lunar date alone does not constitute BaZi or a task election.",
      "sourceLocator": "HKO 2024 single-page table, February row",
      "scenarios": [
        "For a family gathering or travel plan, this date identifies an observance whose practical impact depends on local closures and attendance.",
        "A new-year reflection can focus on a small commitment, without assuming the year animal determines personality."
      ],
      "questions": [
        "Which regional calendar/time-zone convention is intended?",
        "Which services or workplaces actually close?"
      ],
      "actions": [
        "Check local opening hours and travel demand.",
        "Confirm family observance instead of inferring it from nationality."
      ],
      "supportChecks": [
        "The table’s February 10 cell starts month1."
      ],
      "refuteChecks": [
        "The lunar year label is treated as a complete birth chart."
      ],
      "limits": [
        "Selected modern civil conversion; no BaZi pillars, auspiciousness judgments or all Chinese traditions are validated."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "chinese-leap-month-2023",
    "traditionId": "chinese",
    "methodId": "chinese-civil-lunisolar",
    "title": "HKO 2023: the second occurrence of lunar month two",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-hko-2023",
      "rl-hko-calendar"
    ],
    "input": {
      "dateISO": "2023-03-22",
      "timeZone": "Asia/Hong_Kong"
    },
    "expected": [
      {
        "field": "frameworks.chinese.facts.month",
        "value": 2,
        "basis": "HKO March 22 cell starts second lunar month again after February 20"
      },
      {
        "field": "frameworks.chinese.facts.day",
        "value": 1,
        "basis": "Month-start cell"
      },
      {
        "field": "frameworks.chinese.facts.isLeapMonth",
        "value": true,
        "basis": "Explicit inference from repeated second month in the official table; not an outcome label"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "A leap lunar month repeats a month number; matching only month and day can therefore confuse two distinct dates.",
      "sourceLocator": "HKO 2023 February 20 and March 22 month starts",
      "scenarios": [
        "If matching a lunar birthday or archive entry, preserve the leap-month flag to avoid selecting the wrong anniversary.",
        "When importing a calendar, test whether the application can distinguish regular and intercalary month two."
      ],
      "questions": [
        "Does the historical record specify leap month?",
        "Which anniversary convention does the person or community use?"
      ],
      "actions": [
        "Store leap-month identity alongside month/day.",
        "Ask the relevant person about anniversary practice."
      ],
      "supportChecks": [
        "The HKO table contains two successive month-two starts."
      ],
      "refuteChecks": [
        "The app discards leap status or equates both occurrences."
      ],
      "limits": [
        "Leap status is inferred from the official table sequence; the PDF text extractor omits a separate word leap."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "hebrew-tishri-2024",
    "traditionId": "hebrew",
    "methodId": "hebrew-civil-conversion",
    "title": "Hebcal: October 3, 2024 is 1 Tishrei 5785",
    "kind": "calendar-check",
    "sourceIds": [
      "rl-hebcal-convert",
      "rl-hebcal-rh"
    ],
    "input": {
      "dateISO": "2024-10-03",
      "timeZone": "UTC"
    },
    "expected": [
      {
        "field": "frameworks.hebrew.facts.year",
        "value": 5785,
        "basis": "Hebcal JSON hy"
      },
      {
        "field": "frameworks.hebrew.facts.month",
        "value": "Tishri",
        "basis": "Hebcal hm=Tishrei; declared Intl English alias Tishri"
      },
      {
        "field": "frameworks.hebrew.facts.day",
        "value": 1,
        "basis": "Hebcal JSON hd"
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Only the listed source fields are compared. No personal outcome is evaluated."
    },
    "interpretation": {
      "rule": "A civil-date conversion identifies a Hebrew calendar date under a before-sunset convention. Religious days begin in the preceding evening.",
      "sourceLocator": "Hebcal JSON fields and Rosh Hashana 2024 opening paragraph",
      "scenarios": [
        "For arranging a meeting, an observance may begin before the Gregorian date shown on a civil calendar.",
        "For a personal reflection, focus on accountability and plans only if this practice fits the person’s own commitments."
      ],
      "questions": [
        "Is the event before or after local sunset?",
        "Whose community practice is being followed?"
      ],
      "actions": [
        "Confirm the evening boundary with a local calendar.",
        "Avoid assigning religious observance from ancestry or residence."
      ],
      "supportChecks": [
        "Year/month/day match the external before-sunset response after the declared spelling alias."
      ],
      "refuteChecks": [
        "The spelling alias is treated as a date error.",
        "A civil-midnight display is claimed to calculate religious sunset."
      ],
      "limits": [
        "The example supplies no location or observed sunset; it does not validate Kabbalah, religious doctrine or personal predictions."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "hebrew-sunset-boundary-2024",
    "traditionId": "hebrew",
    "methodId": "religious-day-boundary",
    "title": "Same civil date, two Hebrew dates across sunset",
    "kind": "textual-method",
    "sourceIds": [
      "rl-hebcal-day",
      "rl-hebcal-sunset",
      "rl-hebcal-rh"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "Hebcal’s explicit flag maps October 2, 2024 before sunset to 29 Elul 5784 and after sunset to 1 Tishrei 5785. A location-free date cannot decide which applies at an instant.",
      "sourceLocator": "Paired converter JSON afterSunset=false/true",
      "scenarios": [
        "An evening invitation may already fall on the next religious day, even when a civil calendar still shows October2.",
        "When applications disagree, distinguish a missing sunset convention from a faulty arithmetic algorithm."
      ],
      "questions": [
        "Was the after-sunset flag set explicitly?",
        "Is the local horizon/time-zone context available?"
      ],
      "actions": [
        "Keep both the civil date and religious boundary convention visible.",
        "Use local community times when an observance matters."
      ],
      "supportChecks": [
        "The two retrieved JSON responses change year, month and day with the explicit flag."
      ],
      "refuteChecks": [
        "The app invents a sunset time from a date alone."
      ],
      "limits": [
        "Boundary demonstration is not scored numerically because the present date-only converter does not evaluate local sunset."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "dee-monas-symbolic-method",
    "traditionId": "dee",
    "methodId": "monas-symbolic-composition",
    "title": "Dee’s Monas: inspect a symbolic construction",
    "kind": "textual-method",
    "sourceIds": [
      "rl-dee-monas"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "Dee builds a symbolic monad from geometric and celestial signs; the work’s symbolic correspondences are distinct from a numerical natal calendar.",
      "sourceLocator": "Monas body Theorems I–VI, 1564; Hamilton-Jones 1947 translation",
      "scenarios": [
        "If designing a personal emblem, document which elements come from Dee and which express a modern intention.",
        "When a generated design claims historical authority, check its component explanation against the selected theorem before accepting it."
      ],
      "questions": [
        "Is this a faithful historical study or an original artwork?",
        "What action does the intended symbol remind the user to take?"
      ],
      "actions": [
        "Label modern additions and interpretation.",
        "Use the artwork as an optional reminder, without claims of guaranteed efficacy."
      ],
      "supportChecks": [
        "The cited theorem supports the named component or relationship."
      ],
      "refuteChecks": [
        "A design is described as a verified magical mechanism.",
        "A birth-date prediction is attributed to Monas without a stated algorithm."
      ],
      "limits": [
        "Selected textual and visual reasoning only; no supernatural efficacy, complete Dee system or calendar accuracy is claimed."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "jung-feeling-valuation",
    "traditionId": "jung",
    "methodId": "psychological-types-reflection",
    "title": "Jung: distinguish valuation from a mood",
    "kind": "textual-method",
    "sourceIds": [
      "rl-jung-primary",
      "rl-jung-feeling"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "In Jung’s definition, feeling assigns value through acceptance or rejection; this differs from treating every emotional episode as a personality type.",
      "sourceLocator": "Psychological Types (1923), Definitions Feeling, pp.543–545",
      "scenarios": [
        "If two jobs look equally plausible on paper, compare concrete values such as autonomy, learning and relationships; separately record anxiety or excitement.",
        "A disagreement may reveal different priorities rather than a fixed defect in either person."
      ],
      "questions": [
        "Which value is being accepted or rejected?",
        "Would the judgment change after rest or more information?"
      ],
      "actions": [
        "List the evidence, value judgment and current mood separately.",
        "Test one small decision and review its effects."
      ],
      "supportChecks": [
        "The explanation distinguishes valuation from raw emotional intensity."
      ],
      "refuteChecks": [
        "A birth chart is used to diagnose a Jungian type.",
        "An exercise is presented as a validated clinical assessment."
      ],
      "limits": [
        "Historical reflective framework, not diagnosis, psychometric scoring or a birth-date calculator."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "jung-individuation-relationship",
    "traditionId": "jung",
    "methodId": "individuation-reflection",
    "title": "Jung: differentiation with relationship",
    "kind": "textual-method",
    "sourceIds": [
      "rl-jung-primary",
      "rl-jung-individuation"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "Individuation concerns the development of individuality while retaining collective relationship; the selected definition explicitly rejects mere isolation.",
      "sourceLocator": "Psychological Types (1923), Definitions Individuation, pp.561–563",
      "scenarios": [
        "If work identity dominates home life, experiment with a role boundary while maintaining important relationships.",
        "A desire for independence can be examined alongside obligations and support rather than framed as withdrawal from everyone."
      ],
      "questions": [
        "Which role feels overused?",
        "Which relationships or responsibilities should remain supported?"
      ],
      "actions": [
        "Choose one reversible boundary and communicate it clearly.",
        "Review whether the change improves both autonomy and connection."
      ],
      "supportChecks": [
        "The exercise includes personal differentiation and relationship together."
      ],
      "refuteChecks": [
        "The model prescribes social withdrawal as Jung’s universal rule."
      ],
      "limits": [
        "A modern reflective application; no diagnosis or predicted developmental destiny."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "plato-er-choice",
    "traditionId": "plato",
    "methodId": "myth-of-er-reflection",
    "title": "Plato’s Myth of Er: the chooser and the lot",
    "kind": "textual-method",
    "sourceIds": [
      "rl-plato-republic"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "In the myth, lots establish order of choice, while the chooser remains responsible for selecting a life; this narrative lot is not a natal zodiac longitude.",
      "sourceLocator": "Republic X 617d–618a, 620d–621a",
      "scenarios": [
        "When choosing a city or course, compare the life each option would require rather than assuming a symbolic sign decides it.",
        "Limited options can be acknowledged while still identifying choices within those constraints."
      ],
      "questions": [
        "What daily activities would each option actually involve?",
        "Which trade-offs are being hidden by an attractive title or image?"
      ],
      "actions": [
        "Write the costs, responsibilities and reversible steps for each option.",
        "Use finances, safety, support and opportunity as decision evidence."
      ],
      "supportChecks": [
        "The reading preserves the difference between selection order and moral responsibility."
      ],
      "refuteChecks": [
        "The myth is converted into an unsupported birthday-based destiny calculation."
      ],
      "limits": [
        "Philosophical narrative and modern decision exercise; distinct from Hellenistic Lot of Spirit formulas."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "plato-timaeus-cultivation",
    "traditionId": "plato",
    "methodId": "rational-daimon-reflection",
    "title": "Plato’s Timaeus: cultivate understanding",
    "kind": "textual-method",
    "sourceIds": [
      "rl-plato-timaeus"
    ],
    "input": {},
    "expected": [],
    "evaluability": {
      "status": "textual-only",
      "reason": "Textual method comparison; no independent numerical prediction is claimed."
    },
    "interpretation": {
      "rule": "The selected passage connects the highest divine principle with cultivation of understanding; it is philosophical anthropology, not a numerical daimon placement.",
      "sourceLocator": "Timaeus 90a–d",
      "scenarios": [
        "If a symbolic reading creates worry, turn it into a study question that can be checked rather than treating it as an instruction.",
        "A regular learning practice can embody the passage’s emphasis on understanding without requiring assent to its ancient cosmology."
      ],
      "questions": [
        "What claim can be investigated with evidence?",
        "What small learning practice is sustainable?"
      ],
      "actions": [
        "Choose a short reading or observation session and note what changed in understanding.",
        "Separate the text’s cosmology from modern astronomy and personal action."
      ],
      "supportChecks": [
        "The interpretation identifies the passage’s emphasis on cultivated understanding."
      ],
      "refuteChecks": [
        "The passage is used to guarantee happiness or infer a supernatural identity."
      ],
      "limits": [
        "Selected philosophical passage; not a medical, religious-authority or destiny assessment."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  },
  {
    "id": "lilly-dog-printed-figure",
    "traditionId": "lilly",
    "methodId": "historical-printed-figure",
    "title": "Lilly’s missing-dog figure: four printed positions",
    "kind": "worked-chart",
    "sourceIds": [
      "rl-lilly-dog-figure",
      "rl-lilly-primary"
    ],
    "input": {
      "workedChartKey": "dog"
    },
    "expected": [
      {
        "field": "frameworks.lilly.facts.chart.planets.Sun.longitude",
        "value": 165.75,
        "basis": "Printed 15°45′ Virgo; read directly from the 1647 figure",
        "tolerance": 1e-09
      },
      {
        "field": "frameworks.lilly.facts.chart.planets.Moon.longitude",
        "value": 154.16666666666666,
        "basis": "Printed 4°10′ Virgo; read directly from the 1647 figure",
        "tolerance": 1e-09
      },
      {
        "field": "frameworks.lilly.facts.chart.planets.Mercury.longitude",
        "value": 192.33333333333334,
        "basis": "Printed 12°20′ Libra; read directly from the 1647 figure",
        "tolerance": 1e-09
      },
      {
        "field": "frameworks.lilly.facts.chart.planets.Saturn.longitude",
        "value": 48.25,
        "basis": "Printed 18°15′ Taurus; read directly from the 1647 figure",
        "tolerance": 1e-09
      }
    ],
    "evaluability": {
      "status": "external-reference",
      "reason": "Four directly transcribed printed fields only. The initial inherited reconstruction mismatched all four; before/after values are retained in the source ledger. No ephemeris or outcome validation."
    },
    "interpretation": {
      "rule": "Compare a reconstruction with the actual printed figure before interpreting it. The four reference positions are transcriptions, not modern recomputed ephemeris values.",
      "sourceLocator": "Christian Astrology (1647), printed p.392; narrative pp.393–394",
      "scenarios": [
        "If a historical software example differs from its source, inspect the source before choosing which representation to study.",
        "In an actual missing-pet situation, use searches, neighbours, shelters and identification records; the historical narrative is not a substitute for those steps."
      ],
      "questions": [
        "Which positions are directly legible in the source?",
        "Is a value a printed position, modern recomputation or an approximate reconstruction?"
      ],
      "actions": [
        "Keep a per-field source status and record corrections.",
        "Treat the reported recovery as an author’s account, without an accuracy rate."
      ],
      "supportChecks": [
        "The four angular fields match the independently inspected print after any documented correction."
      ],
      "refuteChecks": [
        "Recomputed values are called printed values.",
        "A selected success narrative is used as proof of predictive validity."
      ],
      "limits": [
        "Only four planet positions are reference checked. Remaining planet data, cusps, houses and speeds retain inherited reconstruction uncertainty.",
        "Historical date:29 August 1646 Old Style corresponds to8 September 1646 Gregorian; no new timed ephemeris calculation is tested.",
        "The printed positions and narrative do not independently establish when or why a real dog was recovered."
      ],
      "applicationBasis": "The practical scenarios and actions below are modern, conditional exercises, not quotations or tested predictions from the historical source."
    }
  }
];
