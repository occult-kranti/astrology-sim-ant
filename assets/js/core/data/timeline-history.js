// Source-qualified historical civil-date markers. No event clock, forecast or ranking.
// Selected passages, access receipts and limitations: docs/2026-10-calendar-timeline-history.md.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const TIMELINE_HISTORY_SOURCES = freeze([
  {
    "id": "timeline-loc-versailles",
    "title": "Today in History — June 28: World War I",
    "institution": "Library of Congress",
    "url": "https://www.loc.gov/item/today-in-history/june-28/",
    "finalUrl": "https://www.loc.gov/item/today-in-history/june-28/",
    "locator": "World War I section: Versailles signature paragraph and armistice paragraph",
    "sourceFamily": "loc-wwi-retrospective",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-passages-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "bf579216bd291c03e2da5f1eb8e499c68865a40ebb0e62f9e55fbcf7ccc2de68",
    "shortExtract": "Germany eventually sought an armistice that went into effect on November 11, 1918.",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "The separate November 11 page conflates signature with the 11 a.m. cessation clock. This catalogue uses the June 28 page for the armistice effective day and certifies no clock.",
      "The phrase formally ending World War I in this retrospective account is not imported as a universal legal-effect date."
    ]
  },
  {
    "id": "timeline-nara-un-charter",
    "title": "United Nations Charter (1945)",
    "institution": "U.S. National Archives and Records Administration",
    "url": "https://www.archives.gov/milestone-documents/united-nations-charter",
    "finalUrl": "https://www.archives.gov/milestone-documents/united-nations-charter",
    "locator": "Record Group 11 citation; introduction signing paragraph; paragraph on October 24 ratification threshold",
    "sourceFamily": "nara-charter-commentary",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-passages-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "cc4808645ed534f14c638d4c064fffc6128b2dc1228b0f21ad97862a91a9563b",
    "shortExtract": "The required number of nations ratified the charter on October 24, 1945",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Archival commentary and a document transcript; only selected passages checked. Signing and the later coming into existence of the organization are separate markers."
    ]
  },
  {
    "id": "timeline-state-un",
    "title": "The Formation of the United Nations, 1945",
    "institution": "U.S. Department of State, Office of the Historian",
    "url": "https://history.state.gov/milestones/1937-1945/un",
    "finalUrl": "https://history.state.gov/milestones/1937-1945/un",
    "locator": "Final paragraph: Charter ratification and UN coming into existence",
    "sourceFamily": "state-un-history",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-passages-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "b8b150e4b5f11ab352d241654b9a0325efea94e0d2875b4583d1a559e010a753",
    "shortExtract": "The United Nations came into existence on October 24, 1945",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Retrospective institutional history; the Milestones series is retired and no longer maintained."
    ]
  },
  {
    "id": "timeline-un-charter-pdf",
    "title": "Charter of the United Nations — certified true copy",
    "institution": "United Nations Treaty Collection",
    "url": "https://treaties.un.org/doc/publication/ctc/uncharter.pdf",
    "finalUrl": "https://treaties.un.org/doc/publication/ctc/uncharter.pdf",
    "locator": "PDF page 54: certification of signature in San Francisco on June 26, 1945",
    "sourceFamily": "un-charter-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-pdf-passages-and-image-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "37ceb122b52dfaee7581f9abc3aed3c8ccd4f3e999ff38f98e0df2060eaab483",
    "shortExtract": "signed in San Francisco, California, on June 26, 1945",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Selected certification paragraph visually checked against the scanned page. This is not a claim to have read the complete Charter and ICJ Statute or all language versions."
    ]
  },
  {
    "id": "timeline-un-simla-volume",
    "title": "UNTS volume 858, No. 12308: Agreement on bilateral relations",
    "institution": "United Nations Treaty Series",
    "url": "https://treaties.un.org/doc/Publication/UNTS/Volume%20858/v858.pdf",
    "finalUrl": "https://treaties.un.org/doc/Publication/UNTS/Volume%20858/v858.pdf",
    "locator": "PDF pages 81–83 / printed pages 71–73: registration heading, article 5, attestation and entry-into-force footnote",
    "sourceFamily": "simla-agreement-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-pdf-passages-and-image-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "9ea261e3229f60afd3a5ee8c86dd0383bd408f5fe8bbd5d7cc8f1c16a2d18387",
    "shortExtract": "Signed at Simla on 2 July 1972",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Registration heading visually checked; selected English treaty text and ratification footnote extracted and read. Indian ministry pages did not expose usable treaty text; independent second lineage remains unresolved."
    ]
  },
  {
    "id": "timeline-state-campdavid",
    "title": "The Camp David Accords and the Arab-Israeli Peace Process",
    "institution": "U.S. Department of State, Office of the Historian",
    "url": "https://history.state.gov/milestones/1977-1980/camp-david",
    "finalUrl": "https://history.state.gov/milestones/1977-1980/camp-david",
    "locator": "Opening March 1979 context; concluding negotiation paragraph ending with March 26 formal signature",
    "sourceFamily": "state-campdavid-history",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-passages-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "f7d21b50bfec51a8ff00e04e6dd33a467fff99b3e378af7a1688e426de9c4bae",
    "shortExtract": "Treaty was formally signed on March 26.",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "1979 is supplied by the surrounding paragraph and opening historical context, not by the quoted fragment alone. Retired institutional historical series."
    ]
  },
  {
    "id": "timeline-un-egypt-volume",
    "title": "UNTS volume 1138, No. 17855: Treaty of Peace",
    "institution": "United Nations Treaty Series",
    "url": "https://treaties.un.org/doc/Publication/UNTS/Volume%201138/v1138.pdf",
    "finalUrl": "https://treaties.un.org/doc/Publication/UNTS/Volume%201138/v1138.pdf",
    "locator": "PDF page 77 / printed page 59: signed-at-Washington heading; PDF page 90 / printed page 72: article I and ratification footnote",
    "sourceFamily": "egypt-israel-treaty-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-pdf-passages-and-image-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "867f61ec452f3caf623e0adbf38ff55f8e7903c9e5ee0d92e1b80e00ee672970",
    "shortExtract": "Came into force on 25 April 1979 by the exchange of the instruments of ratification",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Entry-into-force footnote visually checked; selected English pages only. The registration entry is No. 17855, not the different Egyptian registration No. 17813 mentioned in its note."
    ]
  },
  {
    "id": "timeline-avalon-egypt-israel",
    "title": "Peace Treaty Between Israel and Egypt, March 26, 1979 — transcription",
    "institution": "Yale Law School, Lillian Goldman Law Library, Avalon Project",
    "url": "https://avalon.law.yale.edu/20th_century/isregypt.asp",
    "finalUrl": "https://avalon.law.yale.edu/20th_century/isregypt.asp",
    "locator": "Document date heading and articles I and IX",
    "sourceFamily": "egypt-israel-treaty-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "primary-document-transcription-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "7c9bcd894ede5eb6a20d3018da72124c9a55ed514009f35bf265cdffebd0ea22",
    "shortExtract": "This Treaty shall enter into force upon exchange of instruments of ratification.",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "The page also contains a misleading 1973 heading; the treaty heading says March 26, 1979 and agrees with the official UN record. Same underlying treaty as UNTS; not an independent witness."
    ]
  },
  {
    "id": "timeline-un-jordan-pdf",
    "title": "UNTS volume 2042, No. 35325: Treaty of peace between Israel and Jordan",
    "institution": "United Nations Treaty Series",
    "url": "https://treaties.un.org/doc/Publication/UNTS/Volume%202042/v2042.pdf",
    "finalUrl": "https://treaties.un.org/doc/Publication/UNTS/Volume%202042/v2042.pdf",
    "locator": "PDF page 375 / printed page 351: registration metadata; PDF page 427 / printed page 403: article 27 and signature attestation",
    "sourceFamily": "israel-jordan-treaty-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-pdf-passages-and-image-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "8d9c35d48933dad336d1e7169c7cfdc41204e02e59f43614133ce183c14f7265",
    "shortExtract": "Entry into force: 10 November 1994 by the exchange of instruments of ratification",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Both selected pages visually checked. Official attestation gives Heshvan 21st, 5755 and Jumada Al-Ula 21st, 1415 with 26 October 1994. These are source labels, not independently recomputed conversions."
    ]
  },
  {
    "id": "timeline-avalon-jordan-israel",
    "title": "Treaty of Peace Between Israel and Jordan, October 26, 1994 — transcription",
    "institution": "Yale Law School, Lillian Goldman Law Library, Avalon Project",
    "url": "https://avalon.law.yale.edu/20th_century/jordan_treaty.asp",
    "finalUrl": "https://avalon.law.yale.edu/20th_century/jordan_treaty.asp",
    "locator": "Title, article 1, article 27 and concluding attestation",
    "sourceFamily": "israel-jordan-treaty-original",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "primary-document-transcription-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "0dc2f4d50fee7e2e8d738693b5252488763c04021402a367e71006e62730f67f",
    "shortExtract": "which corresponds to 26th October, 1994",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "The closing Hebrew year reads 5775 in this transcription; the official UN scan reads 5755. The discrepancy is preserved, not used as a calendar-conversion assertion. Same underlying treaty as UNTS."
    ]
  },
  {
    "id": "timeline-govuk-belfast",
    "title": "The Belfast Agreement",
    "institution": "United Kingdom Northern Ireland Office",
    "url": "https://www.gov.uk/government/publications/the-belfast-agreement",
    "finalUrl": "https://www.gov.uk/government/publications/the-belfast-agreement",
    "locator": "Opening signature statement and What’s in the Agreement? paragraph on referendum and entry into force",
    "sourceFamily": "uk-nio-belfast-summary",
    "accessedAt": "2026-10-30",
    "accessStatus": "accessible",
    "readingStatus": "selected-passages-checked",
    "sourceDateQuality": "event-date-in-selected-passage",
    "publishedAt": null,
    "sha256": "bd0adf1644ef59e26d2fad5fb6536fcf9f5793cbe5ab3f2fca0341c669ca2d53",
    "shortExtract": "was signed on 10 April 1998",
    "authenticationStatus": "supported",
    "authenticationBasis": "Fetched from the named institutional HTTPS host using inherited proxy and verified TLS.",
    "itemIntegrity": "hash-recorded",
    "rights": "Source links, metadata, short extracts and factual paraphrases retained. Full fetched works and page renders stay outside the repository.",
    "notes": [
      "Institutional summary only. The linked 36-page scan was fetched but its treaty text was not read in this pass. Irish-government corroboration was inaccessible."
    ]
  }
]);

export const TIMELINE_HISTORY_EVENTS = freeze([
  {
    "id": "armistice-1918-effective",
    "date": "1918-11-11",
    "title": "Armistice with Germany takes effect",
    "eventType": "armistice-effective",
    "category": "historical",
    "scope": "multilateral",
    "countries": [
      "germany"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-loc-versailles"
    ],
    "source": "Library of Congress — Today in History — June 28: World War I (World War I section: Versailles signature paragraph and armistice paragraph)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "loc-wwi-retrospective"
    ],
    "summary": "The armistice with Germany went into effect on 11 November 1918.",
    "scopeNote": "An armistice effective day, not a peace-treaty signature or an end date for every conflict. Country tags are not a complete list of parties.",
    "notes": [
      "One institutional retrospective lineage supports the day. The 11 a.m. clock mentioned on a different Library of Congress page is not certified here."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "versailles-1919-signed",
    "date": "1919-06-28",
    "title": "Treaty of Versailles signed",
    "eventType": "treaty-signature",
    "category": "historical",
    "scope": "multilateral",
    "countries": [
      "germany"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-loc-versailles"
    ],
    "source": "Library of Congress — Today in History — June 28: World War I (World War I section: Versailles signature paragraph and armistice paragraph)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "loc-wwi-retrospective"
    ],
    "summary": "Germany and the Allies signed the Treaty of Versailles on 28 June 1919.",
    "scopeNote": "Signature only. No claim that all legal effects or all postwar fighting ended on this day. Country tags are not a complete list of signatories.",
    "notes": [
      "One institutional retrospective lineage supports the date; a primary treaty attestation was not read in this bounded pass."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "un-charter-1945-signed",
    "date": "1945-06-26",
    "title": "United Nations Charter signed",
    "eventType": "charter-signature",
    "category": "historical",
    "scope": "multilateral",
    "countries": [],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "San Francisco, California, United States",
      "precision": "city",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-charter-pdf",
      "timeline-nara-un-charter"
    ],
    "source": "United Nations Treaty Collection — Charter of the United Nations — certified true copy (PDF page 54: certification of signature in San Francisco on June 26, 1945); U.S. National Archives and Records Administration — United Nations Charter (1945) (Record Group 11 citation; introduction signing paragraph; paragraph on October 24 ratification threshold)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "un-charter-original"
    ],
    "summary": "The UN Charter was signed at San Francisco on 26 June 1945.",
    "scopeNote": "Charter signature; entry into force is a separate marker. The empty country list marks a multilateral event and avoids treating historical signatories as modern country identities.",
    "notes": [
      "The UN certified copy and NARA archival description refer to the same signed original. Two hosts or institutions do not constitute independent primary witness records for this signature."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "un-charter-1945-effective",
    "date": "1945-10-24",
    "title": "United Nations Charter enters into force",
    "eventType": "charter-entry-into-force",
    "category": "historical",
    "scope": "multilateral",
    "countries": [],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-state-un",
      "timeline-nara-un-charter"
    ],
    "source": "U.S. Department of State, Office of the Historian — The Formation of the United Nations, 1945 (Final paragraph: Charter ratification and UN coming into existence); U.S. National Archives and Records Administration — United Nations Charter (1945) (Record Group 11 citation; introduction signing paragraph; paragraph on October 24 ratification threshold)",
    "sourceStatus": "multiple-institutional-lineages",
    "sourceFamilies": [
      "state-un-history",
      "nara-charter-commentary"
    ],
    "summary": "The United Nations came into existence on 24 October 1945 after the Charter ratification threshold was met.",
    "scopeNote": "Legal-effect milestone, distinct from the June signature. No claim of universal peace or successful implementation.",
    "notes": [],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "simla-1972-signed",
    "date": "1972-07-02",
    "title": "Simla Agreement signed",
    "eventType": "agreement-signature",
    "category": "historical",
    "scope": "bilateral",
    "countries": [
      "india",
      "pakistan"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Simla (Shimla), India",
      "precision": "city",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-simla-volume"
    ],
    "source": "United Nations Treaty Series — UNTS volume 858, No. 12308: Agreement on bilateral relations (PDF pages 81–83 / printed pages 71–73: registration heading, article 5, attestation and entry-into-force footnote)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "simla-agreement-original"
    ],
    "summary": "India and Pakistan signed the Agreement on bilateral relations at Simla on 2 July 1972.",
    "scopeNote": "Signature only. Article 5 makes effect depend on exchanged ratifications; the UNTS footnote gives 4 August 1972 as entry into force.",
    "notes": [
      "Single treaty lineage. Separate Indian ministry links returned a page shell or error page; neither counts as corroborating treaty text."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "egypt-israel-1979-signed",
    "date": "1979-03-26",
    "title": "Egypt–Israel peace treaty signed",
    "eventType": "treaty-signature",
    "category": "historical",
    "scope": "bilateral",
    "countries": [
      "egypt",
      "israel"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Washington, D.C., United States",
      "precision": "city",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-egypt-volume",
      "timeline-state-campdavid",
      "timeline-avalon-egypt-israel"
    ],
    "source": "United Nations Treaty Series — UNTS volume 1138, No. 17855: Treaty of Peace (PDF page 77 / printed page 59: signed-at-Washington heading; PDF page 90 / printed page 72: article I and ratification footnote); U.S. Department of State, Office of the Historian — The Camp David Accords and the Arab-Israeli Peace Process (Opening March 1979 context; concluding negotiation paragraph ending with March 26 formal signature); Yale Law School, Lillian Goldman Law Library, Avalon Project — Peace Treaty Between Israel and Egypt, March 26, 1979 — transcription (Document date heading and articles I and IX)",
    "sourceStatus": "multiple-institutional-lineages",
    "sourceFamilies": [
      "egypt-israel-treaty-original",
      "state-campdavid-history"
    ],
    "summary": "Egypt and Israel signed the peace treaty at Washington on 26 March 1979.",
    "scopeNote": "Signature only. Articles I and IX attach peace and entry into force to the exchange of ratifications, recorded separately on 25 April.",
    "notes": [
      "UNTS and Avalon reproduce the same treaty lineage; the State Department account supplies a second institutional narrative. The Avalon page’s stray 1973 heading is not used."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "egypt-israel-1979-effective",
    "date": "1979-04-25",
    "title": "Egypt–Israel peace treaty enters into force",
    "eventType": "treaty-entry-into-force",
    "category": "historical",
    "scope": "bilateral",
    "countries": [
      "egypt",
      "israel"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Om-Khosheib, Egypt (UNTS spelling)",
      "precision": "source-named-locality",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-egypt-volume"
    ],
    "source": "United Nations Treaty Series — UNTS volume 1138, No. 17855: Treaty of Peace (PDF page 77 / printed page 59: signed-at-Washington heading; PDF page 90 / printed page 72: article I and ratification footnote)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "egypt-israel-treaty-original"
    ],
    "summary": "The treaty entered into force on 25 April 1979 by exchange of instruments of ratification.",
    "scopeNote": "Ratification exchange and legal effect; not the March signature or proof of the absence of subsequent violence.",
    "notes": [
      "Exact effective day has one accessible treaty-registration lineage. No coordinates or venue clock are assigned."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "israel-jordan-1994-signed",
    "date": "1994-10-26",
    "title": "Israel–Jordan peace treaty signed",
    "eventType": "treaty-signature",
    "category": "historical",
    "scope": "bilateral",
    "countries": [
      "israel",
      "jordan"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Arava/Araba Crossing Point (source wording)",
      "precision": "source-named-venue",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-jordan-pdf",
      "timeline-avalon-jordan-israel"
    ],
    "source": "United Nations Treaty Series — UNTS volume 2042, No. 35325: Treaty of peace between Israel and Jordan (PDF page 375 / printed page 351: registration metadata; PDF page 427 / printed page 403: article 27 and signature attestation); Yale Law School, Lillian Goldman Law Library, Avalon Project — Treaty of Peace Between Israel and Jordan, October 26, 1994 — transcription (Title, article 1, article 27 and concluding attestation)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "israel-jordan-treaty-original"
    ],
    "summary": "Israel and Jordan signed the treaty at the Arava/Araba Crossing Point on 26 October 1994.",
    "scopeNote": "Signature only. Article 27 makes entry into force depend on exchange of ratifications; 10 November is a separate marker.",
    "notes": [
      "Both hosts reproduce the same treaty lineage. The official attestation has Hebrew year 5755; Avalon transcribes 5775. Only the checked Gregorian day is indexed."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "israel-jordan-1994-effective",
    "date": "1994-11-10",
    "title": "Israel–Jordan peace treaty enters into force",
    "eventType": "treaty-entry-into-force",
    "category": "historical",
    "scope": "bilateral",
    "countries": [
      "israel",
      "jordan"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-un-jordan-pdf"
    ],
    "source": "United Nations Treaty Series — UNTS volume 2042, No. 35325: Treaty of peace between Israel and Jordan (PDF page 375 / printed page 351: registration metadata; PDF page 427 / printed page 403: article 27 and signature attestation)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "israel-jordan-treaty-original"
    ],
    "summary": "The treaty entered into force on 10 November 1994 by exchange of instruments of ratification.",
    "scopeNote": "Legal effect, distinct from signature on 26 October 1994 and UN registration on 11 November 1998.",
    "notes": [
      "One accessible treaty-registration lineage supports the exact effective day. The signature venue is not borrowed as the ratification-exchange venue."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "belfast-1998-signed",
    "date": "1998-04-10",
    "title": "Belfast / Good Friday Agreement signed",
    "eventType": "agreement-signature",
    "category": "historical",
    "scope": "multi-party",
    "countries": [
      "united-kingdom",
      "ireland"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-govuk-belfast"
    ],
    "source": "United Kingdom Northern Ireland Office — The Belfast Agreement (Opening signature statement and What’s in the Agreement? paragraph on referendum and entry into force)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "uk-nio-belfast-summary"
    ],
    "summary": "The Belfast Agreement, also known as the Good Friday Agreement, was signed on 10 April 1998.",
    "scopeNote": "Agreement signature, distinct from referendum approval and later legal effect. The institutional summary covers both the Multi-Party and British-Irish agreements.",
    "notes": [
      "Single accessible institutional summary. Exact venue and event clock are unverified here."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "belfast-1998-approved",
    "date": "1998-05-22",
    "title": "Belfast Agreement approved by voters",
    "eventType": "referendum-approval",
    "category": "historical",
    "scope": "multi-party",
    "countries": [
      "united-kingdom",
      "ireland"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-govuk-belfast"
    ],
    "source": "United Kingdom Northern Ireland Office — The Belfast Agreement (Opening signature statement and What’s in the Agreement? paragraph on referendum and entry into force)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "uk-nio-belfast-summary"
    ],
    "summary": "The Northern Ireland Office records voter approval on 22 May 1998.",
    "scopeNote": "Referendum-approval day, not a signature or entry-into-force date. No vote totals or poll closing time are encoded.",
    "notes": [
      "One institutional summary supports the day; individual electoral returns were not acquired."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  },
  {
    "id": "belfast-1999-effective",
    "date": "1999-12-02",
    "title": "Belfast Agreement enters into force",
    "eventType": "agreement-entry-into-force",
    "category": "historical",
    "scope": "multi-party",
    "countries": [
      "united-kingdom",
      "ireland"
    ],
    "datePrecision": "day",
    "originalCalendar": "Gregorian date stated in the checked source; no historical clock or alternate-calendar conversion inferred.",
    "time": {
      "status": "date-only",
      "localTime": null,
      "timeZone": null,
      "instant": null,
      "qualification": "Event clock and historical UTC offset are unverified. This date is a historical civil-date label, not midnight, noon or an astronomical instant."
    },
    "eventPlace": {
      "label": "Venue not established by the checked passage",
      "precision": "unknown",
      "zone": null,
      "coordinates": null
    },
    "sourceIds": [
      "timeline-govuk-belfast"
    ],
    "source": "United Kingdom Northern Ireland Office — The Belfast Agreement (Opening signature statement and What’s in the Agreement? paragraph on referendum and entry into force)",
    "sourceStatus": "single-lineage",
    "sourceFamilies": [
      "uk-nio-belfast-summary"
    ],
    "summary": "The Northern Ireland Office dates entry into force to 2 December 1999.",
    "scopeNote": "Legal-effect milestone in the government summary, separate from signature and referendum approval. The full treaty’s provision-by-provision implementation was not audited.",
    "notes": [
      "Single accessible institutional summary. The linked original scan was fetched but not read; Irish-government access failed."
    ],
    "assessment": "supported",
    "claimKind": "documentary-fact"
  }
]);

export const TIMELINE_HISTORY_COVERAGE = freeze({
  "asOf": "2026-10-30",
  "catalogueStart": "1900-01-01",
  "catalogueEnd": "2026-10-30",
  "firstEvent": "1918-11-11",
  "lastEvent": "1999-12-02",
  "eventCount": 12,
  "selection": "Bounded editorial sample of documented armistice, peace-agreement and international-cooperation dates.",
  "regions": [
    "Europe",
    "South Asia",
    "Middle East",
    "Multilateral"
  ],
  "complete": false,
  "representative": false,
  "statisticalValidation": false,
  "futurePredictions": false,
  "countryTags": [
    "egypt",
    "germany",
    "india",
    "ireland",
    "israel",
    "jordan",
    "pakistan",
    "united-kingdom"
  ],
  "unrepresentedCountryFocus": [
    "usa",
    "russia",
    "iran",
    "palestine"
  ],
  "note": "A multilateral marker has an empty countries array. The catalogue does not promise an event for every country or year; no selected marker postdates 1999."
});

export const TIMELINE_HISTORY_LIMITS = freeze([
  "Selected past peace and cooperation milestones only, frozen as of 2026-10-30; no future conflict or peace forecasts, timing recommendations, probabilities or country rankings.",
  "The twelve markers are an editorial convenience sample, not an exhaustive or representative event database. Absence of a marker means no selected record, not peace, conflict or missing history.",
  "No matched comparison population, conflict outcome labels, exposure definition or statistical test was built. Visual coincidence with astronomical or calendar values establishes neither association nor causation and does not validate astrology.",
  "All records are day-only civil labels. This dataset does not verify historical clocks, UTC offsets or astronomical instants; no midnight or noon is imputed to an event.",
  "Signing, referendum approval, ratification exchange, entry into force and implementation are distinct. A treaty title or declared purpose is not evidence that violence ceased or peace endured.",
  "Country tags name selected parties for navigation; they are not complete treaty membership lists, judgments about borders, current legal status or national birth dates.",
  "Multiple hosts of the same treaty are one source lineage. Single-lineage records and access failures remain explicit; source hashes identify retrieved bytes and do not prove historical truth.",
  "Reading was limited to named passages and selected scan pages. Whole books, treaty volumes, linked attachments and complete collections were not read."
]);

const sourceIds = new Set(TIMELINE_HISTORY_SOURCES.map(source => source.id));
const eventIds = new Set();
if (sourceIds.size !== TIMELINE_HISTORY_SOURCES.length) throw new TypeError('Timeline history sources need distinct IDs.');
for (const event of TIMELINE_HISTORY_EVENTS) {
  const date = event.date;
  if (!event.id || eventIds.has(event.id) || event.category !== 'historical') throw new TypeError('Timeline history needs unique historical markers.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < TIMELINE_HISTORY_COVERAGE.catalogueStart || date > TIMELINE_HISTORY_COVERAGE.asOf || Number.isNaN(Date.parse(date + 'T12:00:00Z')) || new Date(date + 'T12:00:00Z').toISOString().slice(0, 10) !== date) throw new RangeError('Timeline history needs valid past Gregorian date labels.');
  if (!event.source || !event.sourceIds.length || event.sourceIds.some(id => !sourceIds.has(id))) throw new TypeError('Timeline historical markers need resolvable sources.');
  if (event.time.status !== 'date-only' || event.time.localTime !== null || event.time.timeZone !== null || event.time.instant !== null) throw new TypeError('Timeline historical clocks must remain unknown.');
  eventIds.add(event.id);
}
