// Selected source-qualified date facts. Source bodies are not redistributed.
// See docs/2026-10-horizon-observances.md and the committed retrieval receipt.
const freeze = value => { if(value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
export const HORIZON_OBSERVANCE_SOURCES = freeze([
  {
    "id": "HOBS-OCA-NATIVITY",
    "title": "Nativity commemoration",
    "publisher": "Orthodox Church in America",
    "url": "https://www.oca.org/saints/lives/2027/12/25/103638-the-nativity-of-our-lord-god-and-savior-jesus-christ",
    "sourceKind": "official-community-calendar",
    "locator": "Heading: commemorated on December 25",
    "retrievedAt": "2026-10-30T04:38:42.665002+00:00",
    "httpStatus": 200,
    "sha256": "ce5c1b06c909ccf820a3847f1dd365b21d0c303adb8c8825720e90a99b0f6cfd",
    "readingDepth": "Selected heading and feast introduction read. Native fixed feast date; project Gregorian/Julian arithmetic is separate from the church website calendar choice.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-OCA-THEOPHANY",
    "title": "Theophany commemoration",
    "publisher": "Orthodox Church in America",
    "url": "https://www.oca.org/saints/lives/2027/01/06/100106-feast-of-the-theophany-of-our-lord-and-savior-jesus-christ",
    "sourceKind": "official-community-calendar",
    "locator": "Heading: commemorated on January 6",
    "retrievedAt": "2026-10-30T04:38:42.664391+00:00",
    "httpStatus": 200,
    "sha256": "b20b75136677c7fb0e3736a4d9f8660190a3eb0fcfe075d22ae20eb0a1a1093f",
    "readingDepth": "Selected heading and feast introduction read; no local service hour or Sunday transfer inferred.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HEBCAL-2027-DIASPORA",
    "title": "Hebcal 2027 Diaspora date records",
    "publisher": "Hebcal",
    "url": "https://www.hebcal.com/hebcal?v=1&cfg=json&year=2027&maj=on&min=on&mod=off&nx=off&ss=off&mf=off&c=off&geo=none",
    "sourceKind": "community-software-calendar",
    "locator": "Selected title/date/hdate records for Purim, Pesach, Shavuot, Tishri holidays and Chanukah",
    "retrievedAt": "2026-10-30T04:38:42.666069+00:00",
    "httpStatus": 200,
    "sha256": "f1220b5bc2d66160bc518915d83d172b77177d642045a75d7f77161a9a7ced86",
    "readingDepth": "JSON factual date rows read; evening candle dates distinguished from daytime Hebrew date labels.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HEBCAL-2027-ISRAEL",
    "title": "Hebcal 2027 Israel date records",
    "publisher": "Hebcal",
    "url": "https://www.hebcal.com/hebcal?v=1&cfg=json&year=2027&maj=on&min=on&mod=off&nx=off&ss=off&mf=off&c=off&geo=none&i=on",
    "sourceKind": "community-software-calendar",
    "locator": "Selected title/date/hdate records and absence of eighth Pesach/second Shavuot day",
    "retrievedAt": "2026-10-30T04:38:42.666414+00:00",
    "httpStatus": 200,
    "sha256": "71018bfe972218cb9bab22c69d7d2f231e99d18e50c7181a379e8576f95f3ff0",
    "readingDepth": "Selected factual dates compared with the separate Diaspora response; both share one publisher/engine.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-OCA",
    "title": "Orthodox Church in America, Lenten and Paschal Cycle",
    "publisher": "OCA",
    "url": "https://www.oca.org/fs/paschal-cycle",
    "sourceKind": "official-community-calendar",
    "locator": "Christian calendar table: Pascha, Western Easter, Ascension and Pentecost for 2026–2030",
    "retrievedAt": "2026-10-30T04:21:53.108346+00:00",
    "httpStatus": 200,
    "sha256": "d95eef24b7df69abb60e3ea1a6ae7227d72f77feb30d9c01e88540ecf47a697b",
    "readingDepth": "Selected complete year/date rows read; issuing church table, not universal fixed-feast policy.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-USCCB-2027",
    "title": "USCCB Liturgical Calendar 2027",
    "publisher": "United States Conference of Catholic Bishops",
    "url": "https://www.usccb.org/resources/2027cal.pdf",
    "sourceKind": "official-community-calendar",
    "locator": "Principal celebrations and introductory Ascension transfer note; Christmas entries",
    "retrievedAt": "2026-10-30T04:24:19.553704+00:00",
    "httpStatus": 200,
    "sha256": "d7997b57de96fdbf6433af917a65597b108c720c930f3c39356bf0f5058074ce",
    "readingDepth": "Selected dates and jurisdiction-specific transfer note read; not a full liturgical calendar implementation.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-USCCB-2028",
    "title": "USCCB Liturgical Calendar 2028",
    "publisher": "United States Conference of Catholic Bishops",
    "url": "https://www.usccb.org/resources/2028cal.pdf",
    "sourceKind": "official-community-calendar",
    "locator": "Principal celebrations: Easter, Ascension, Pentecost",
    "retrievedAt": "2026-10-30T04:24:19.554311+00:00",
    "httpStatus": 200,
    "sha256": "2115e0240517c8d2ba1f0b684ab809921e1fe9cc67fa25ae20a7d98261663116",
    "readingDepth": "Selected dates read as independent Western computus fixtures.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HEBCAL",
    "title": "Jewish holidays, 5786–5791",
    "publisher": "Hebcal",
    "url": "https://www.hebcal.com/holidays/",
    "sourceKind": "community-software-calendar",
    "locator": "Major holiday table, Diaspora/Israel selector and sunset/nightfall explanation",
    "retrievedAt": "2026-10-30T04:21:53.108901+00:00",
    "httpStatus": 200,
    "sha256": "a89e2524141e23d5c8e83611826befdcd0555d889be4eb1678c244d910be1b77",
    "readingDepth": "Selected holiday dates and boundary explanation read; Hebcal and Chabad are separate publications, not independent astronomical engines.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-CHABAD-2027",
    "title": "Jewish Holidays in 2027",
    "publisher": "Chabad.org",
    "url": "https://www.chabad.org/holidays/default_cdo/year/2027/jewish/holidays-2027.htm",
    "sourceKind": "official-community-calendar",
    "locator": "Purim, Passover, Shavuot, Rosh Hashanah, Yom Kippur, Sukkot and Chanukah entries",
    "retrievedAt": "2026-10-30T04:21:53.109297+00:00",
    "httpStatus": 200,
    "sha256": "3e7e4fd60a32c1e6ddfdcc46af206108311520e3f7b7d0cc342fd8d6c5d25b43",
    "readingDepth": "Selected dates, Diaspora qualifications and sunset/nightfall wording read.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-GOVHK-2027",
    "title": "General holidays for 2027",
    "publisher": "Hong Kong Government",
    "url": "https://www.gov.hk/en/about/abouthk/holiday/2027.htm",
    "sourceKind": "official-community-calendar",
    "locator": "Gazetted table: Lunar New Year, Ching Ming, Buddha birthday, Tuen Ng, day after Mid-Autumn, Chung Yeung",
    "retrievedAt": "2026-10-30T04:23:19.356964+00:00",
    "httpStatus": 200,
    "sha256": "4b70538d2edfe9c676304a7ff0477193f1019805f149e4356a44179e01aa333b",
    "readingDepth": "Selected dates read; replacement public holidays are not confused with festival dates.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-SINGAPORE-MOM",
    "title": "Public holidays, 2026 and 2027",
    "publisher": "Singapore Ministry of Manpower",
    "url": "https://www.mom.gov.sg/employment-practices/public-holidays",
    "sourceKind": "official-community-calendar",
    "locator": "2026 Vesak and Deepavali; 2027 Vesak, Deepavali and Hari Raya rows",
    "retrievedAt": "2026-10-30T04:23:19.356541+00:00",
    "httpStatus": 200,
    "sha256": "b7df3968880cbc1682498a4e2cf64ef623f066e47869a11c39d5bca245750b5d",
    "readingDepth": "Published regional civil-holiday dates read; not a global Hindu/Buddhist calendar.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-MUIS-2027",
    "title": "Key Islamic dates 2027 / 1448–1449H",
    "publisher": "Islamic Religious Council of Singapore (MUIS)",
    "url": "https://isomer-user-content.by.gov.sg/48/286285a9-1dbd-4c2c-80a8-773c23e32b13/Key%20Islamic%20dates%202027.pdf",
    "sourceKind": "official-community-calendar",
    "locator": "One-page month-start and Islamic-events tables",
    "retrievedAt": "2026-10-30T04:30:25.388163+00:00",
    "httpStatus": 200,
    "sha256": "0ed7d3a7f1bfdb6d5098106d8fada339f4291617e46b538541fbc5b1ba822362",
    "readingDepth": "Both tables read. The Islamic New Year heading says 1448H while its native-date column says 1 Muharram 1449H; use the explicit native date and record the source typo.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-MUIS-CALENDAR-2027",
    "title": "Islamic Calendar 2027M",
    "publisher": "MUIS",
    "url": "https://isomer-user-content.by.gov.sg/48/58bf9c81-404a-4475-b0b3-5075480abfae/Islamic%20Calendar%202027M.pdf",
    "sourceKind": "official-community-calendar",
    "locator": "Calendar month/date grid",
    "retrievedAt": "2026-10-30T04:30:25.388963+00:00",
    "httpStatus": 200,
    "sha256": "0d3b3ac23d2b945c08bdb96ea44aa24d7122e26fd98f4498a5cf4d148123ab44",
    "readingDepth": "Grid retrieved and selected dates inspected; same issuing authority as the key-date sheet, not an independent authority.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-BAHAI",
    "title": "The Bahá’í Calendar",
    "publisher": "Worldwide Bahá’í Community",
    "url": "https://www.bahai.org/action/devotional-life/calendar",
    "sourceKind": "official-community-calendar",
    "locator": "Introduction, sunset rule and selected 2026 holy-day display",
    "retrievedAt": "2026-10-30T04:21:53.498442+00:00",
    "httpStatus": 200,
    "sha256": "7af7d1216791c838d9bc9216bd54918c2c7fb1c54266a2baffc0a48df90ac0f2",
    "readingDepth": "Selected explanatory paragraphs and published table read; no claim to have read all source books.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-BAHAI-DATA",
    "title": "Published Bahá’í calendar year data and date rules",
    "publisher": "Worldwide Bahá’í Community",
    "url": "https://www.bahai.org/component---src-pages-languages-json-language-action-devotional-life-calendar-tsx-5ff8cfaf9cd8f7d1bd14.js",
    "sourceKind": "official-community-calendar",
    "locator": "Calendar component JSON records for 182–187 BE; named holy-day date mapping",
    "retrievedAt": "2026-10-30T04:24:19.552993+00:00",
    "httpStatus": 200,
    "sha256": "7d8ee1464363af7c8cf178ceedabd0064c3ea51e235e722756e4a6204914c077",
    "readingDepth": "Selected official client-side factual date records and mapping inspected without executing downloaded code. Only factual dates are retained; source application code is not copied.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-BAHAI-UHJ",
    "title": "Universal House of Justice, 10 July 2014",
    "publisher": "Universal House of Justice",
    "url": "https://www.bahai.org/library/authoritative-texts/the-universal-house-of-justice/messages/20140710_001/1",
    "sourceKind": "official-community-calendar",
    "locator": "Implementation of the Badí‘ calendar; Tehran, equinox and Twin Birthdays",
    "retrievedAt": "2026-10-30T04:25:28.167512+00:00",
    "httpStatus": 200,
    "sha256": "9647bd5cf0ad1f76e315e20e9a1c70d202937ea8a5cd4b2e4e1f1d18e92ca49c",
    "readingDepth": "Selected calendar-method paragraphs read; same tradition authority as the official calendar, not independent date validation.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-AVESTA-CALENDAR",
    "title": "The Zoroastrian Religious Calendar",
    "publisher": "Avesta.org / Joseph H. Peterson",
    "url": "https://www.avesta.org/zcal.html",
    "sourceKind": "community-reference",
    "locator": "Fasli, Shahanshahi and Qadimi descriptions",
    "retrievedAt": "2026-10-30T04:21:55.213262+00:00",
    "httpStatus": 200,
    "sha256": "63a6c257a295ea4908355baa98bcb25a36dfb8d9357c7314b679adfaded88fab",
    "readingDepth": "Selected modern-calendar definitions read. Only this source’s expressly fixed 21 March Fasli variant is encoded.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-IRANICA-CALENDAR",
    "title": "Calendars IV: Other Modern Calendars",
    "publisher": "Encyclopaedia Iranica",
    "url": "https://www.iranicaonline.org/articles/calendars/calendars-iv-other-modern-calendars/",
    "sourceKind": "academic-reference",
    "locator": "Modern Zoroastrian calendars, first paragraphs; published 15 December 1990",
    "retrievedAt": "2026-10-30T04:30:25.389382+00:00",
    "httpStatus": 200,
    "sha256": "f8beda0257c295383a1c3c4bc9051d250421c52d123d4b487c5885b3676f0263",
    "readingDepth": "Selected historical account of distinct communities and Gregorian-like Fasli reform read; does not independently validate every future 21 March observance.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-SGPC-CALENDAR",
    "title": "Nanakshahi Calendar official download page",
    "publisher": "Shiromani Gurdwara Parbandhak Committee",
    "url": "https://sgpc.net/nanakshahi-calendar/",
    "sourceKind": "official-publication-metadata",
    "locator": "2026–27 calendar and Jantri links",
    "retrievedAt": "2026-10-30T04:21:53.287382+00:00",
    "httpStatus": 200,
    "sha256": "184735a1d46760a24236e0916b017e877f13bc3706ded742d336a2411e7babda",
    "readingDepth": "Download-page metadata read. The linked Punjabi PDF was retrieved but no dated passage translated/verified; no dates are encoded from it.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-JAINWORLD",
    "title": "Jain Festivals",
    "publisher": "Jainworld",
    "url": "https://jainworld.com/societies-sanghs/jain-festivals/",
    "sourceKind": "community-reference",
    "locator": "Paryushan, Mahavir birthday and Diwali paragraphs",
    "retrievedAt": "2026-10-30T04:25:28.183851+00:00",
    "httpStatus": 200,
    "sha256": "80c9ff060a0ff7e4f738622847b13c8001ba45c1db4eee2ca69ebe3da1101c4a",
    "readingDepth": "Selected community descriptions read; regional lunar month/day rules do not supply verified future Gregorian dates here.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-JINJA",
    "title": "Matsuri",
    "publisher": "Jinja Honcho",
    "url": "https://www.jinjahoncho.or.jp/en/shinto/matsuri/",
    "sourceKind": "official-community-explanation",
    "locator": "Seasonal festivals and local shrine diversity",
    "retrievedAt": "2026-10-30T04:28:15.448729+00:00",
    "httpStatus": 200,
    "sha256": "4606cb1f56f69215ba10f22c888a0d31468a73bbc0975a615699bf95bfc3e082",
    "readingDepth": "Selected official explanatory text read; no universal dated shrine schedule is asserted.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2026",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2026",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2026e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.126705+00:00",
    "httpStatus": 200,
    "sha256": "29ef9c43977a69681ef770d0c264e4226692f21f3febc3d16a4ee5c8aa06c60c",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2027",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2027",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2027e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.143524+00:00",
    "httpStatus": 200,
    "sha256": "3754bb79f07ea3dc0d355c7e5da1770bc9bb02ac26bf2e7633692703177f9a17",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2028",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2028",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2028e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.147587+00:00",
    "httpStatus": 200,
    "sha256": "22384e96b87353363be3c4c0d11d4c14988ab4f15335ce2b5cfdb0c411fbed65",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2029",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2029",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2029e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.151519+00:00",
    "httpStatus": 200,
    "sha256": "7aaab28de4a750dea991f6308a69e9361e8219827f53dfce225ff5f7f6b77e0a",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2030",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2030",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2030e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.155558+00:00",
    "httpStatus": 200,
    "sha256": "6235122d90c2934cb6aef2f5702988ec13c03d4fd4459e1b160dc15d49788423",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-HKO-2031",
    "title": "Gregorian–Lunar Calendar Conversion Table of 2031",
    "publisher": "Hong Kong Observatory",
    "url": "https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2031e.txt",
    "sourceKind": "official-calendar-table",
    "locator": "Daily Gregorian/lunar date rows and Bright & Clear solar term",
    "retrievedAt": "2026-10-30T04:25:28.159508+00:00",
    "httpStatus": 200,
    "sha256": "20ae7b108634f677e6283c920fd5106964b8b5fba2aecd16bba07b0b3533f295",
    "readingDepth": "Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.",
    "rights": "Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed."
  },
  {
    "id": "HOBS-CIVIL",
    "title": "Canonical civil calendar methods",
    "publisher": "Astrologer’s Workbench",
    "url": "docs/2026-10-calendar-methods.md",
    "sourceKind": "inherited-project-method",
    "locator": "calendar-observatory.js civilRows; cultural-calendars.js; calendar.js",
    "readingDepth": "Actual 13-converter implementation and selected existing tests inspected; no full-range religious authority claim.",
    "rights": "Project implementation and documentation licence applies."
  }
]);
export const HORIZON_OBSERVANCE_COVERAGE = freeze([
  {
    "id": "christian-western",
    "familyId": "christian",
    "label": "Selected Western Christian computus and fixed dates",
    "status": "partial",
    "methods": "Canonical Gregorian Easter; selected Easter-relative days and Gregorian Christmas/Epiphany.",
    "limitations": "Not every feast, church, local transfer or obligation; Ascension Thursday and Sunday-transfer conventions remain separate.",
    "sourceIds": [
      "HOBS-OCA",
      "HOBS-USCCB-2027",
      "HOBS-USCCB-2028"
    ]
  },
  {
    "id": "christian-eastern",
    "familyId": "christian",
    "label": "Selected Eastern Julian computus and fixed dates",
    "status": "partial",
    "methods": "Canonical Julian Pascha converted to Gregorian; selected relative days and Julian Christmas/Epiphany.",
    "limitations": "Not a claim that all Eastern churches use Julian fixed feasts; revised-Julian/Gregorian communities differ.",
    "sourceIds": [
      "HOBS-OCA"
    ]
  },
  {
    "id": "jewish-fixed",
    "familyId": "jewish",
    "label": "Selected fixed Hebrew holiday dates",
    "status": "partial",
    "methods": "Canonical Hebrew civil date labels, selected month/day rules; Israel/Diaspora duration variants.",
    "limitations": "Daytime Gregorian date only. Sunset/nightfall not calculated; postponed fasts, all 8 Hanukkah days and local observance decisions not implemented.",
    "sourceIds": [
      "HOBS-HEBCAL",
      "HOBS-CHABAD-2027"
    ]
  },
  {
    "id": "islamic-civil",
    "familyId": "islamic",
    "label": "islamic-civil projected observance labels",
    "status": "projection",
    "methods": "Selected native month/day rules on the named runtime calendar.",
    "limitations": "Not an observed-crescent or local-authority determination; religious sunset boundaries are not calculated.",
    "sourceIds": [
      "HOBS-MUIS-2027",
      "HOBS-CIVIL"
    ]
  },
  {
    "id": "islamic-umalqura",
    "familyId": "islamic",
    "label": "islamic-umalqura projected observance labels",
    "status": "projection",
    "methods": "Selected native month/day rules on the named runtime calendar.",
    "limitations": "Not an observed-crescent or local-authority determination; religious sunset boundaries are not calculated.",
    "sourceIds": [
      "HOBS-MUIS-2027",
      "HOBS-CIVIL"
    ]
  },
  {
    "id": "islamic-muis",
    "familyId": "islamic",
    "label": "Selected MUIS 2027 published dates",
    "status": "published-subset",
    "methods": "Named dated rows from the Singapore authority.",
    "limitations": "Regional publication only; later years not extrapolated from this sheet.",
    "sourceIds": [
      "HOBS-MUIS-2027"
    ],
    "publishedThrough": "2027-12-31"
  },
  {
    "id": "chinese-hko",
    "familyId": "chinese",
    "label": "Selected Chinese festivals and Qingming",
    "status": "published-derived-subset",
    "methods": "HKO 2026–2031 daily tables plus named regular-month rules corroborated in GovHK 2027.",
    "limitations": "Hong Kong convention. Runtime Chinese label mismatch is retained. Intercalary month is excluded; not all East Asian traditions.",
    "sourceIds": [
      "HOBS-GOVHK-2027",
      "HOBS-HKO-2026",
      "HOBS-HKO-2027",
      "HOBS-HKO-2028",
      "HOBS-HKO-2029",
      "HOBS-HKO-2030",
      "HOBS-HKO-2031"
    ]
  },
  {
    "id": "hindu-regional",
    "familyId": "hindu",
    "label": "Selected regional Hindu public dates",
    "status": "published-subset",
    "methods": "Singapore Deepavali 2026/2027.",
    "limitations": "Indian national Saka does not calculate Hindu festivals; regional tithi/sunrise rules and 2028–2030 dates remain unavailable.",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM"
    ],
    "publishedThrough": "2027-12-31"
  },
  {
    "id": "buddhist-regional",
    "familyId": "buddhist",
    "label": "Selected regional Buddhist public dates",
    "status": "published-subset",
    "methods": "Singapore Vesak 2026/2027 and Hong Kong Buddha birthday 2027.",
    "limitations": "Distinct communities/dates retained. Thai Buddhist era does not calculate Buddhist observances; broader future calendars remain unavailable.",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM",
      "HOBS-GOVHK-2027"
    ],
    "publishedThrough": "2027-12-31"
  },
  {
    "id": "sikh-community",
    "familyId": "sikh",
    "label": "Sikh community observance schedules",
    "status": "unavailable",
    "methods": "SGPC calendar publication identified.",
    "limitations": "No independently checked translated festival date or selected Nanakshahi/Bikrami implementation; no future dates inferred.",
    "sourceIds": [
      "HOBS-SGPC-CALENDAR"
    ]
  },
  {
    "id": "jain-community",
    "familyId": "jain",
    "label": "Jain community observance schedules",
    "status": "unavailable",
    "methods": "Selected community festival descriptions only.",
    "limitations": "Svetambara/Digambara and regional lunar-month rules require a named engine and authoritative Gregorian fixtures.",
    "sourceIds": [
      "HOBS-JAINWORLD"
    ]
  },
  {
    "id": "bahai-official",
    "familyId": "bahai",
    "label": "Official Bahá’í calendar dates",
    "status": "published-derived-subset",
    "methods": "Official 182–187 BE year anchors, Twin Birthdays, intercalary ranges and selected holy-day mapping.",
    "limitations": "Sunset-to-sunset boundaries; exact sunset not calculated. Not an independently implemented Tehran equinox/new-moon solver.",
    "sourceIds": [
      "HOBS-BAHAI",
      "HOBS-BAHAI-DATA",
      "HOBS-BAHAI-UHJ"
    ]
  },
  {
    "id": "zoroastrian-fasli",
    "familyId": "zoroastrian",
    "label": "Avesta.org-described fixed 21 March Fasli Naw Ruz",
    "status": "source-rule-subset",
    "methods": "Only explicitly named fixed-date source convention.",
    "limitations": "Shahanshahi, Qadimi and astronomical-equinox variants are not supplied; no Persian civil-date substitution. Independent future fixture validation remains pending.",
    "sourceIds": [
      "HOBS-AVESTA-CALENDAR",
      "HOBS-IRANICA-CALENDAR"
    ]
  },
  {
    "id": "shinto-local",
    "familyId": "shinto",
    "label": "Local Shinto shrine festivals",
    "status": "unavailable",
    "methods": "Official Jinja Honcho account of seasonal and local variation.",
    "limitations": "No universal shrine schedule or future dates inferred from Japanese era labels.",
    "sourceIds": [
      "HOBS-JINJA"
    ]
  },
  {
    "id": "civil-gregory",
    "familyId": "civil",
    "label": "gregory canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "gregory",
    "kind": "civil-converter"
  },
  {
    "id": "civil-julian",
    "familyId": "civil",
    "label": "julian canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "julian",
    "kind": "civil-converter"
  },
  {
    "id": "civil-hebrew",
    "familyId": "civil",
    "label": "hebrew canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "hebrew",
    "kind": "civil-converter"
  },
  {
    "id": "civil-islamic-civil",
    "familyId": "civil",
    "label": "islamic-civil canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "islamic-civil",
    "kind": "civil-converter"
  },
  {
    "id": "civil-islamic-umalqura",
    "familyId": "civil",
    "label": "islamic-umalqura canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "islamic-umalqura",
    "kind": "civil-converter"
  },
  {
    "id": "civil-chinese",
    "familyId": "civil",
    "label": "chinese canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "chinese",
    "kind": "civil-converter"
  },
  {
    "id": "civil-buddhist",
    "familyId": "civil",
    "label": "buddhist canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "buddhist",
    "kind": "civil-converter"
  },
  {
    "id": "civil-indian",
    "familyId": "civil",
    "label": "indian canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "indian",
    "kind": "civil-converter"
  },
  {
    "id": "civil-persian",
    "familyId": "civil",
    "label": "persian canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "persian",
    "kind": "civil-converter"
  },
  {
    "id": "civil-coptic",
    "familyId": "civil",
    "label": "coptic canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "coptic",
    "kind": "civil-converter"
  },
  {
    "id": "civil-ethiopic",
    "familyId": "civil",
    "label": "ethiopic canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "ethiopic",
    "kind": "civil-converter"
  },
  {
    "id": "civil-japanese",
    "familyId": "civil",
    "label": "japanese canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "japanese",
    "kind": "civil-converter"
  },
  {
    "id": "civil-roc",
    "familyId": "civil",
    "label": "roc canonical civil converter",
    "status": "inherited-civil-conversion",
    "methods": "Existing compareMoment calendar row; no duplicate converter.",
    "limitations": "Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.",
    "sourceIds": [
      "HOBS-CIVIL"
    ],
    "calendarId": "roc",
    "kind": "civil-converter"
  }
]);
export const HKO_OBSERVANCE_DATES = freeze([
  {
    "date": "2026-02-17",
    "key": "lunar-new-year",
    "title": "Lunar New Year",
    "month": 1,
    "day": 1,
    "leap": false,
    "sourceId": "HOBS-HKO-2026"
  },
  {
    "date": "2026-04-05",
    "key": "ching-ming",
    "title": "Ching Ming / Qingming solar-term date",
    "month": 2,
    "day": 18,
    "leap": false,
    "sourceId": "HOBS-HKO-2026"
  },
  {
    "date": "2026-06-19",
    "key": "tuen-ng",
    "title": "Tuen Ng / Dragon Boat Festival",
    "month": 5,
    "day": 5,
    "leap": false,
    "sourceId": "HOBS-HKO-2026"
  },
  {
    "date": "2026-09-25",
    "key": "mid-autumn",
    "title": "Mid-Autumn Festival",
    "month": 8,
    "day": 15,
    "leap": false,
    "sourceId": "HOBS-HKO-2026"
  },
  {
    "date": "2026-10-18",
    "key": "chung-yeung",
    "title": "Chung Yeung Festival",
    "month": 9,
    "day": 9,
    "leap": false,
    "sourceId": "HOBS-HKO-2026"
  },
  {
    "date": "2027-02-06",
    "key": "lunar-new-year",
    "title": "Lunar New Year",
    "month": 1,
    "day": 1,
    "leap": false,
    "sourceId": "HOBS-HKO-2027"
  },
  {
    "date": "2027-04-05",
    "key": "ching-ming",
    "title": "Ching Ming / Qingming solar-term date",
    "month": 2,
    "day": 29,
    "leap": false,
    "sourceId": "HOBS-HKO-2027"
  },
  {
    "date": "2027-06-09",
    "key": "tuen-ng",
    "title": "Tuen Ng / Dragon Boat Festival",
    "month": 5,
    "day": 5,
    "leap": false,
    "sourceId": "HOBS-HKO-2027"
  },
  {
    "date": "2027-09-15",
    "key": "mid-autumn",
    "title": "Mid-Autumn Festival",
    "month": 8,
    "day": 15,
    "leap": false,
    "sourceId": "HOBS-HKO-2027"
  },
  {
    "date": "2027-10-08",
    "key": "chung-yeung",
    "title": "Chung Yeung Festival",
    "month": 9,
    "day": 9,
    "leap": false,
    "sourceId": "HOBS-HKO-2027"
  },
  {
    "date": "2028-01-26",
    "key": "lunar-new-year",
    "title": "Lunar New Year",
    "month": 1,
    "day": 1,
    "leap": false,
    "sourceId": "HOBS-HKO-2028"
  },
  {
    "date": "2028-04-04",
    "key": "ching-ming",
    "title": "Ching Ming / Qingming solar-term date",
    "month": 3,
    "day": 10,
    "leap": false,
    "sourceId": "HOBS-HKO-2028"
  },
  {
    "date": "2028-05-28",
    "key": "tuen-ng",
    "title": "Tuen Ng / Dragon Boat Festival",
    "month": 5,
    "day": 5,
    "leap": false,
    "sourceId": "HOBS-HKO-2028"
  },
  {
    "date": "2028-10-03",
    "key": "mid-autumn",
    "title": "Mid-Autumn Festival",
    "month": 8,
    "day": 15,
    "leap": false,
    "sourceId": "HOBS-HKO-2028"
  },
  {
    "date": "2028-10-26",
    "key": "chung-yeung",
    "title": "Chung Yeung Festival",
    "month": 9,
    "day": 9,
    "leap": false,
    "sourceId": "HOBS-HKO-2028"
  },
  {
    "date": "2029-02-13",
    "key": "lunar-new-year",
    "title": "Lunar New Year",
    "month": 1,
    "day": 1,
    "leap": false,
    "sourceId": "HOBS-HKO-2029"
  },
  {
    "date": "2029-04-04",
    "key": "ching-ming",
    "title": "Ching Ming / Qingming solar-term date",
    "month": 2,
    "day": 21,
    "leap": false,
    "sourceId": "HOBS-HKO-2029"
  },
  {
    "date": "2029-06-16",
    "key": "tuen-ng",
    "title": "Tuen Ng / Dragon Boat Festival",
    "month": 5,
    "day": 5,
    "leap": false,
    "sourceId": "HOBS-HKO-2029"
  },
  {
    "date": "2029-09-22",
    "key": "mid-autumn",
    "title": "Mid-Autumn Festival",
    "month": 8,
    "day": 15,
    "leap": false,
    "sourceId": "HOBS-HKO-2029"
  },
  {
    "date": "2029-10-16",
    "key": "chung-yeung",
    "title": "Chung Yeung Festival",
    "month": 9,
    "day": 9,
    "leap": false,
    "sourceId": "HOBS-HKO-2029"
  },
  {
    "date": "2030-02-03",
    "key": "lunar-new-year",
    "title": "Lunar New Year",
    "month": 1,
    "day": 1,
    "leap": false,
    "sourceId": "HOBS-HKO-2030"
  },
  {
    "date": "2030-04-05",
    "key": "ching-ming",
    "title": "Ching Ming / Qingming solar-term date",
    "month": 3,
    "day": 3,
    "leap": false,
    "sourceId": "HOBS-HKO-2030"
  },
  {
    "date": "2030-06-05",
    "key": "tuen-ng",
    "title": "Tuen Ng / Dragon Boat Festival",
    "month": 5,
    "day": 5,
    "leap": false,
    "sourceId": "HOBS-HKO-2030"
  },
  {
    "date": "2030-09-12",
    "key": "mid-autumn",
    "title": "Mid-Autumn Festival",
    "month": 8,
    "day": 15,
    "leap": false,
    "sourceId": "HOBS-HKO-2030"
  },
  {
    "date": "2030-10-05",
    "key": "chung-yeung",
    "title": "Chung Yeung Festival",
    "month": 9,
    "day": 9,
    "leap": false,
    "sourceId": "HOBS-HKO-2030"
  }
]);
export const BAHAI_PUBLISHED_YEARS = freeze([
  {
    "bahaiEra": 182,
    "calendarYearStart": 2025,
    "nawRuz": "2025-03-20",
    "birthOfBab": "2025-10-22",
    "birthOfBahaullah": "2025-10-23",
    "ayyamStart": "2026-02-25",
    "ayyamEnd": "2026-03-01"
  },
  {
    "bahaiEra": 183,
    "calendarYearStart": 2026,
    "nawRuz": "2026-03-21",
    "birthOfBab": "2026-11-10",
    "birthOfBahaullah": "2026-11-11",
    "ayyamStart": "2027-02-26",
    "ayyamEnd": "2027-03-01"
  },
  {
    "bahaiEra": 184,
    "calendarYearStart": 2027,
    "nawRuz": "2027-03-21",
    "birthOfBab": "2027-10-30",
    "birthOfBahaullah": "2027-10-31",
    "ayyamStart": "2028-02-26",
    "ayyamEnd": "2028-02-29"
  },
  {
    "bahaiEra": 185,
    "calendarYearStart": 2028,
    "nawRuz": "2028-03-20",
    "birthOfBab": "2028-10-19",
    "birthOfBahaullah": "2028-10-20",
    "ayyamStart": "2029-02-25",
    "ayyamEnd": "2029-02-28"
  },
  {
    "bahaiEra": 186,
    "calendarYearStart": 2029,
    "nawRuz": "2029-03-20",
    "birthOfBab": "2029-11-07",
    "birthOfBahaullah": "2029-11-08",
    "ayyamStart": "2030-02-25",
    "ayyamEnd": "2030-02-28"
  },
  {
    "bahaiEra": 187,
    "calendarYearStart": 2030,
    "nawRuz": "2030-03-20",
    "birthOfBab": "2030-10-28",
    "birthOfBahaullah": "2030-10-29",
    "ayyamStart": "2031-02-25",
    "ayyamEnd": "2031-03-01"
  }
]);
export const REGIONAL_OBSERVANCE_DATES = freeze([
  {
    "date": "2026-05-31",
    "key": "vesak",
    "title": "Vesak Day — Singapore published holiday",
    "familyId": "buddhist",
    "variantId": "singapore-published",
    "region": "Singapore",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM"
    ]
  },
  {
    "date": "2026-11-08",
    "key": "deepavali",
    "title": "Deepavali — Singapore published holiday",
    "familyId": "hindu",
    "variantId": "singapore-published",
    "region": "Singapore",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM"
    ]
  },
  {
    "date": "2027-10-28",
    "key": "deepavali",
    "title": "Deepavali — Singapore published holiday",
    "familyId": "hindu",
    "variantId": "singapore-published",
    "region": "Singapore",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM"
    ]
  },
  {
    "date": "2027-05-20",
    "key": "vesak",
    "title": "Vesak Day — Singapore published holiday",
    "familyId": "buddhist",
    "variantId": "singapore-published",
    "region": "Singapore",
    "sourceIds": [
      "HOBS-SINGAPORE-MOM"
    ]
  },
  {
    "date": "2027-05-13",
    "key": "buddha-birthday",
    "title": "Birthday of the Buddha — Hong Kong published holiday",
    "familyId": "buddhist",
    "variantId": "hong-kong-published",
    "region": "Hong Kong",
    "sourceIds": [
      "HOBS-GOVHK-2027"
    ],
    "native": {
      "month": 4,
      "day": 8,
      "leap": false
    }
  },
  {
    "date": "2027-02-08",
    "key": "ramadan-start",
    "title": "Ramadan begins — MUIS published date",
    "familyId": "islamic",
    "variantId": "singapore-muis-published",
    "region": "Singapore / MUIS calendar",
    "sourceIds": [
      "HOBS-MUIS-2027"
    ],
    "native": {
      "month": "Ramadan",
      "day": 1
    }
  },
  {
    "date": "2027-03-10",
    "key": "eid-fitr",
    "title": "Eid al-Fitr / Hari Raya Aidilfitri — MUIS published date",
    "familyId": "islamic",
    "variantId": "singapore-muis-published",
    "region": "Singapore / MUIS calendar",
    "sourceIds": [
      "HOBS-MUIS-2027",
      "HOBS-SINGAPORE-MOM"
    ],
    "native": {
      "month": "Shawwal",
      "day": 1
    }
  },
  {
    "date": "2027-05-17",
    "key": "eid-adha",
    "title": "Eid al-Adha / Hari Raya Aidiladha — MUIS published date",
    "familyId": "islamic",
    "variantId": "singapore-muis-published",
    "region": "Singapore / MUIS calendar",
    "sourceIds": [
      "HOBS-MUIS-2027",
      "HOBS-SINGAPORE-MOM"
    ],
    "native": {
      "month": "Dhuʻl-Hijjah",
      "day": 10
    }
  },
  {
    "date": "2027-06-06",
    "key": "hijri-new-year",
    "title": "Islamic New Year — MUIS published date",
    "familyId": "islamic",
    "variantId": "singapore-muis-published",
    "region": "Singapore / MUIS calendar",
    "sourceIds": [
      "HOBS-MUIS-2027"
    ],
    "native": {
      "month": "Muharram",
      "day": 1
    }
  },
  {
    "date": "2027-06-15",
    "key": "ashura",
    "title": "Ashura / Asyura — MUIS published date",
    "familyId": "islamic",
    "variantId": "singapore-muis-published",
    "region": "Singapore / MUIS calendar",
    "sourceIds": [
      "HOBS-MUIS-2027"
    ],
    "native": {
      "month": "Muharram",
      "day": 10
    }
  }
]);
