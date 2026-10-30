// Selected-source provenance. Allegations, work editions and calendar date roles stay distinct.
const freeze = value => { if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

export const ESCHATOLOGY_PIKE_SOURCES = freeze([
  {
    "id": "PIKE-S-CORNELL",
    "title": "Morals and Dogma — Cornell library scan",
    "publisher": "Cornell University Library; Internet Archive",
    "institution": "Cornell University Library; Internet Archive",
    "url": "https://archive.org/download/cu31924030324978/cu31924030324978.pdf",
    "requestedUrl": "https://archive.org/download/cu31924030324978/cu31924030324978.pdf",
    "finalUrl": "https://dn760107.eu.archive.org/0/items/cu31924030324978/cu31924030324978.pdf",
    "edition": "Charleston edition catalogued 1871; title prints A.M. 5632; copyright leaf says 1871",
    "locator": "PDF pp.7–10 (title, copyright, preface iii–iv); PDF p.331 = printed p.321, XIX Grand Pontiff",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:36:42.167679+00:00",
    "retrievedAt": "2026-10-30T16:36:42.167679+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "pdf-visual",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Title, copyright, preface and selected p.321 passage read. Title, preface iv and p.321 visually checked; no complete-book reading.",
    "fullWorkRead": false,
    "sourceFamily": "pike-morals-dogma",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "1d3fa0e3d30758e73fbcc29219d877dd3cdc661b9064d81bfe444ec0ecedbf15",
    "mimeType": "application/pdf",
    "version": "Charleston edition catalogued 1871; title prints A.M. 5632; copyright leaf says 1871",
    "licenseOrAccessLimit": "Historical text is public domain in the United States; library scan states no known US copyright restrictions. Only short extracts and original paraphrases are shipped.",
    "rights": "Historical text is public domain in the United States; library scan states no known US copyright restrictions. Only short extracts and original paraphrases are shipped.",
    "limitations": [
      "The library catalogue and copyright leaf identify a year, not an exact publication day. A.M.5632 is retained as printed, without inventing a civil-calendar conversion.",
      "The work concerns the stated Scottish Rite jurisdiction; it does not establish a doctrine or belief held by every Freemason.",
      "OCR misreads the title year as 5633; the inspected image reads 5632."
    ]
  },
  {
    "id": "PIKE-S-GUTENBERG",
    "title": "Morals and Dogma — Project Gutenberg transcription",
    "publisher": "Project Gutenberg",
    "institution": "Project Gutenberg",
    "url": "https://www.gutenberg.org/cache/epub/19447/pg19447.txt",
    "requestedUrl": "https://www.gutenberg.org/cache/epub/19447/pg19447.txt",
    "finalUrl": "https://www.gutenberg.org/cache/epub/19447/pg19447.txt",
    "edition": "Ebook 19447; transcribed front matter includes 1871 and 1906 copyright entries and February 1944 reprint",
    "locator": "Preface; XIX Grand Pontiff, paragraph beginning “The Apocalypse is, to those who receive the nineteenth Degree”",
    "source": "Albert Pike, Morals and Dogma, Project Gutenberg ebook 19447, preface and XIX; transcription of a later reprint whose front matter says “Reprinted, February, 1944”; https://www.gutenberg.org/cache/epub/19447/pg19447.txt.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:32:38.601289+00:00",
    "retrievedAt": "2026-10-30T16:32:38.601289+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Selected front matter, preface and matching Lucifer/Apocalypse passage; not full work.",
    "fullWorkRead": false,
    "sourceFamily": "pike-morals-dogma",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "270516c289238c6008cdfd563544933ecb0cd0a95b5fe78d6dbdad64ca4d69a6",
    "mimeType": "text/plain",
    "version": "Ebook19447; transcribed front matter includes 1871 and1906 copyright entries and February1944 reprint",
    "licenseOrAccessLimit": "Project Gutenberg terms apply to its ebook packaging; underlying historical text public domain in the United States. Short extracts only.",
    "rights": "Project Gutenberg terms apply to its ebook packaging; underlying historical text public domain in the United States. Short extracts only.",
    "limitations": [
      "A later transcription/reprint, not a separately inspected 1871 original.",
      "The Cornell scan and this transcription share the same work lineage, not independent confirmation of an eschatological claim."
    ]
  },
  {
    "id": "PIKE-S-CARR-PAWNS",
    "title": "Pawns in the Game — later webprint reproduction",
    "publisher": "Internet Archive community upload; reproduced yamaguchy.netfirms.com pages",
    "institution": "Internet Archive community upload; reproduced yamaguchy.netfirms.com pages",
    "url": "https://archive.org/download/PawnsInTheGameWilliamGuyCarr1958/Pawns%20in%20the%20Game%2C%20William%20Guy%20Carr%20%281958%29.pdf",
    "requestedUrl": "https://archive.org/download/PawnsInTheGameWilliamGuyCarr1958/Pawns%20in%20the%20Game%2C%20William%20Guy%20Carr%20%281958%29.pdf",
    "finalUrl": "https://dn760000.eu.archive.org/0/items/PawnsInTheGameWilliamGuyCarr1958/Pawns%20in%20the%20Game%2C%20William%20Guy%20Carr%20%281958%29.pdf",
    "edition": "Upload labelled 1958; PDF consists of modern webprint pages bearing 2006 footer timestamps",
    "locator": "Introduction, webprint pages 7–8 of 13 (pawns_00.html); paragraphs beginning “Between 1859” through the alleged letter quotation",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:33:44.227012+00:00",
    "retrievedAt": "2026-10-30T16:33:44.227012+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Selected introduction and quotation boundary checked in PDF-derived/OCR text; this is not a collated contemporary printed edition.",
    "fullWorkRead": false,
    "sourceFamily": "carr-pawns-webprint",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "b2e5080cdb00ff04036eb93de3626c08efde0b43186a5ec59eeeb6cbf6334501",
    "mimeType": "application/pdf",
    "version": "Upload labelled1958; PDF consists of modern webprint pages bearing2006 footer timestamps",
    "licenseOrAccessLimit": "Copyright status of this later reproduction is not established. Retained for research; ship only short critical extracts, metadata and links.",
    "rights": "Copyright status of this later reproduction is not established. Retained for research; ship only short critical extracts, metadata and links.",
    "limitations": [
      "The 1958 label is uploader/reproduction metadata, not verified publication dating of these PDF bytes.",
      "The footer date format 5.4.2006 is ambiguous by locale; only 2006 is encoded.",
      "Carr’s claims about secret world control are allegations, not established historical facts.",
      "No original 1871 letter, shelfmark, signature or contemporary transmission record is reproduced at the inspected locus."
    ]
  },
  {
    "id": "PIKE-S-CARR-SATAN",
    "title": "Satan, Prince of This World — composite electronic reproduction",
    "publisher": "Internet Archive community upload; ThreeWorldWars.com electronic edition",
    "institution": "Internet Archive community upload; ThreeWorldWars.com electronic edition",
    "url": "https://archive.org/download/Satan--PrinceOfThisWorldWilliamGuyCarr1959/Satan%E2%80%94Prince%20of%20This%20World%2C%20William%20Guy%20Carr%20%281959%29.pdf",
    "requestedUrl": "https://archive.org/download/Satan--PrinceOfThisWorldWilliamGuyCarr1959/Satan%E2%80%94Prince%20of%20This%20World%2C%20William%20Guy%20Carr%20%281959%29.pdf",
    "finalUrl": "https://dn760007.eu.archive.org/0/items/Satan--PrinceOfThisWorldWilliamGuyCarr1959/Satan%E2%80%94Prince%20of%20This%20World%2C%20William%20Guy%20Carr%20%281959%29.pdf",
    "edition": "Upload labelled 1959; son’s preface signed 1966-06-02; publisher postscript and later webmaster note included",
    "locator": "PDF printed pp.4–5 (preface/postscript/webmaster note); printed p.22 footnote 9",
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:33:44.228050+00:00",
    "retrievedAt": "2026-10-30T16:33:44.228050+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Selected front matter and footnote 9 read; no original manuscript or first printed edition acquired.",
    "fullWorkRead": false,
    "sourceFamily": "carr-satan-composite",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "dbd331f71f15dad3a62b1988db1e4a70c7daeb5b1791d07dc00b1ad1e88e9482",
    "mimeType": "application/pdf",
    "version": "Upload labelled1959; son’s preface signed1966-06-02; publisher postscript and later webmaster note included",
    "licenseOrAccessLimit": "Copyright status of this composite reproduction is not established. Short critical extracts only; no book redistribution.",
    "rights": "Copyright status of this composite reproduction is not established. Short critical extracts only; no book redistribution.",
    "limitations": [
      "Uploader metadata 1959 is not established publication date. The preface explicitly says the work was unfinished at the author’s death and edited later.",
      "The postscript literally says “In June 1966, thirty years almost to the day” after the preface dated June 2,1966. This internal inconsistency is retained, not repaired to 1996.",
      "The webmaster’s additions are separate from Carr’s text.",
      "Footnote 9 reports a Keeper’s response, but the response itself was not acquired."
    ]
  },
  {
    "id": "PIKE-S-BCY-REBUTTAL",
    "title": "Albert Pike’s correspondence with Giuseppe Mazzini: a fraud",
    "publisher": "Grand Lodge of British Columbia and Yukon",
    "institution": "Grand Lodge of British Columbia and Yukon",
    "url": "https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "requestedUrl": "https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "finalUrl": "https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html",
    "edition": "Institutional rebuttal webpage; displayed updated 2007-05-17",
    "locator": "Opening paragraphs; three-war blocks; numbered notes 1–3; update footer",
    "source": "Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:33:49.431744+00:00",
    "retrievedAt": "2026-10-30T16:33:49.431744+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Article, reproduced claim wording and references inspected. Its quoted museum report was not independently obtained.",
    "fullWorkRead": false,
    "sourceFamily": "bcy-pike-rebuttal",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "3bac378a70b69ea45dc52c6d5e39508ff054e4a42c1d50c2ecff0aa9953d678a",
    "mimeType": "text/html",
    "version": "Institutional rebuttal webpage; displayed updated2007-05-17",
    "licenseOrAccessLimit": "Modern webpage rights retained by publisher. Short extracts and paraphrase only.",
    "rights": "Modern webpage rights retained by publisher. Short extracts and paraphrase only.",
    "limitations": [
      "A Masonic institution’s published position, not a British Museum or British Library archival finding.",
      "Its museum-possession assertion cites threeworldwars.com accessed 2007-05-12. That is a dependent report, not the custodian’s original response.",
      "The page treats the three-war paragraphs as alleged quotations; the inspected Carr webprint presents those paragraphs as narration before a separately introduced quotation.",
      "Its broad authorship/fabrication conclusions exceed what the independently acquired original records in this packet can settle."
    ]
  },
  {
    "id": "PIKE-S-TAXIL-TRANSLATION",
    "title": "The Confession of Léo Taxil — selected translated passage",
    "publisher": "Scottish Rite Research Society; reproduced by Grand Lodge of British Columbia and Yukon",
    "institution": "Scottish Rite Research Society; reproduced by Grand Lodge of British Columbia and Yukon",
    "url": "https://freemasonry.bcy.ca/texts/taxil_confessed.html",
    "requestedUrl": "https://freemasonry.bcy.ca/texts/taxil_confessed.html",
    "finalUrl": "https://freemasonry.bcy.ca/texts/taxil_confessed.html",
    "edition": "Alain Bernheim, A.William Samii and Eric Serejski translation; Heredom 5(1997),137–168; wrapper identifies LeFrondeur 1897-04-25 transcript",
    "locator": "Introduction/bibliographic note; passage admitting a circular dated July 14,1889 was written in Paris",
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:36:48.669966+00:00",
    "retrievedAt": "2026-10-30T16:36:48.669966+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Translation introduction and specific circular-admission passage checked. Original French newspaper and full speech not collated.",
    "fullWorkRead": false,
    "sourceFamily": "taxil-conference1897-translated",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "a6b3ef8f9c64e9430d281467f7412779cb654f5e8c85dcbe3646a6e144978754",
    "mimeType": "text/html",
    "version": "Alain Bernheim, A.William Samii and Eric Serejski translation; Heredom5(1997),137–168; wrapper identifies LeFrondeur1897-04-25 transcript",
    "licenseOrAccessLimit": "©1997 Scottish Rite Research Society; host states reprinted with permission. Only a short critical quotation is shipped.",
    "rights": "©1997 Scottish Rite Research Society; host states reprinted with permission. Only a short critical quotation is shipped.",
    "limitations": [
      "This is a modern English translation, despite the external acquisition filename ending “french”.",
      "Taxil’s admitted fabrication here concerns a circular dated 1889-07-14; it is not the alleged 1871-08-15 letter or the whole three-war narrative.",
      "No direct genealogical proof linking every circulating 1871 letter version to this circular is supplied by the selected passage."
    ]
  },
  {
    "id": "PIKE-S-ILLUSTRATION",
    "title": "A hoax — report of Taxil’s meeting",
    "publisher": "L’Illustration; translated/reproduced by Grand Lodge of British Columbia and Yukon",
    "institution": "L’Illustration; translated/reproduced by Grand Lodge of British Columbia and Yukon",
    "url": "https://freemasonry.bcy.ca/texts/taxil_confession.html",
    "requestedUrl": "https://freemasonry.bcy.ca/texts/taxil_confession.html",
    "finalUrl": "https://freemasonry.bcy.ca/texts/taxil_confession.html",
    "edition": "Edmond Frank, L’Illustration,1897-05-01,no.2827; SuzanneD’Aoust English translation,Vancouver 1997",
    "locator": "Bibliographic opening; paragraph beginning “Last April 19 th”; concluding description of hoax",
    "source": "Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "publishedAt": null,
    "accessedAt": "2026-10-30T16:32:38.930932+00:00",
    "retrievedAt": "2026-10-30T16:32:38.930932+00:00",
    "accessResult": 200,
    "accessStatus": "available",
    "accessDepth": "full-text",
    "readingStatus": "selected-passages-inspected",
    "readingScope": "Selected translated article paragraphs and archival wrapper checked; original magazine clipping not visually collated.",
    "fullWorkRead": false,
    "sourceFamily": "illustration-taxil-report1897",
    "underlyingSourceId": null,
    "authenticationStatus": "supported",
    "authenticationBasis": "See edition, reading scope and limitations; access and a recorded hash do not authenticate every allegation in the text.",
    "itemIntegrity": "hash-recorded",
    "sha256": "43c25aeaf70aecb18a47d874f0c98299a9f6715f0cc2a8c8a3d59711b1999258",
    "mimeType": "text/html",
    "version": "Edmond Frank, L’Illustration,1897-05-01,no.2827; SuzanneD’Aoust English translation,Vancouver1997",
    "licenseOrAccessLimit": "Historical French report is public domain in the United States; modern translation rights not determined. Short paraphrases only.",
    "rights": "Historical French report is public domain in the United States; modern translation rights not determined. Short paraphrases only.",
    "limitations": [
      "The host describes a clipping in its own library; the original clipping is not separately acquired here.",
      "A different reported text from the confession translation, but both online reproductions share the same institutional host.",
      "The article does not establish authorship or authenticity of an 1871 Pike–Mazzini letter."
    ]
  },
  {
    "id": "PIKE-S-ALLEGED-LETTER",
    "title": "Alleged Pike-to-Mazzini letter dated 1871-08-15 — original unavailable",
    "publisher": null,
    "institution": null,
    "url": null,
    "requestedUrl": null,
    "finalUrl": null,
    "edition": "Original not acquired",
    "locator": "Unavailable; no verified archival shelfmark in acquired packet",
    "source": "Alleged Albert Pike letter to Giuseppe Mazzini dated 15 August 1871, as attributed in later Carr/BCY materials; no original, verified shelfmark or contemporary copy acquired.",
    "publishedAt": null,
    "accessedAt": null,
    "retrievedAt": null,
    "accessResult": "not-acquired",
    "accessStatus": "unavailable",
    "accessDepth": "unavailable",
    "readingStatus": "not-read",
    "readingScope": "No original was obtained. References to this item are attributed reports only.",
    "fullWorkRead": false,
    "sourceFamily": "alleged-pike1871-original-unknown",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "No original acquired.",
    "itemIntegrity": "not-checked",
    "sha256": null,
    "mimeType": null,
    "version": null,
    "licenseOrAccessLimit": "Unknown; nothing reproduced.",
    "rights": "Unknown; no original reproduced.",
    "limitations": [
      "An unavailable original is not proof that no correspondence could ever have existed.",
      "The alleged date is a claimed document date, not a world-war target date."
    ]
  },
  {
    "id": "PIKE-S-KEEPER-REPLY",
    "title": "Keeper of Manuscripts reply reported by Carr — original unavailable",
    "publisher": null,
    "institution": null,
    "url": null,
    "requestedUrl": null,
    "finalUrl": null,
    "edition": "Original not acquired",
    "locator": "Unavailable; no verified archival shelfmark in acquired packet",
    "source": "Unacquired Keeper of Manuscripts response reported in the electronic reproduction of Carr, Satan, Prince of This World,p.22,note 9.",
    "publishedAt": null,
    "accessedAt": null,
    "retrievedAt": null,
    "accessResult": "not-acquired",
    "accessStatus": "unavailable",
    "accessDepth": "unavailable",
    "readingStatus": "not-read",
    "readingScope": "No original was obtained. References to this item are attributed reports only.",
    "fullWorkRead": false,
    "sourceFamily": "reported-keeper-reply-unknown",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "No original acquired.",
    "itemIntegrity": "not-checked",
    "sha256": null,
    "mimeType": null,
    "version": null,
    "licenseOrAccessLimit": "Unknown; nothing reproduced.",
    "rights": "Unknown; no original reproduced.",
    "limitations": [
      "Carr’s footnote is the acquired evidence; no signed or dated custodian response was checked."
    ]
  },
  {
    "id": "PIKE-S-HAUPT-REPLY",
    "title": "Museum reply reportedly received by Michael Haupt — original unavailable",
    "publisher": null,
    "institution": null,
    "url": null,
    "requestedUrl": null,
    "finalUrl": null,
    "edition": "Original not acquired",
    "locator": "Unavailable; no verified archival shelfmark in acquired packet",
    "source": "Unacquired museum response reported by the Grand Lodge of British Columbia and Yukon through threeworldwars.com, accessed there 2007-05-12.",
    "publishedAt": null,
    "accessedAt": null,
    "retrievedAt": null,
    "accessResult": "not-acquired",
    "accessStatus": "unavailable",
    "accessDepth": "unavailable",
    "readingStatus": "not-read",
    "readingScope": "No original was obtained. References to this item are attributed reports only.",
    "fullWorkRead": false,
    "sourceFamily": "reported-haupt-reply-unknown",
    "underlyingSourceId": null,
    "authenticationStatus": "not-checked",
    "authenticationBasis": "No original acquired.",
    "itemIntegrity": "not-checked",
    "sha256": null,
    "mimeType": null,
    "version": null,
    "licenseOrAccessLimit": "Unknown; nothing reproduced.",
    "rights": "Unknown; no original reproduced.",
    "limitations": [
      "The Grand Lodge article and the quoted report are dependent for this claim; they are not two direct custodian confirmations."
    ]
  }
]);

export const ESCHATOLOGY_PIKE_ENTITIES = freeze([
  {
    "id": "PIKE-E-PIKE",
    "label": "Albert Pike",
    "kind": "person",
    "familyId": "pike-masonic-provenance",
    "description": "Attributed author/compiler of the inspected Morals and Dogma; alleged author of a separate unacquired letter.",
    "sourceIds": [
      "PIKE-S-CORNELL",
      "PIKE-S-ALLEGED-LETTER"
    ],
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978. Alleged Albert Pike letter to Giuseppe Mazzini dated 15 August 1871, as attributed in later Carr/BCY materials; no original, verified shelfmark or contemporary copy acquired.",
    "limitations": [
      "A shared name does not authenticate another document."
    ]
  },
  {
    "id": "PIKE-E-MAZZINI",
    "label": "Giuseppe Mazzini",
    "kind": "person",
    "familyId": "pike-masonic-provenance",
    "description": "Claimed recipient named in the later letter attribution.",
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "limitations": [
      "No original correspondence to him was acquired in this packet."
    ]
  },
  {
    "id": "PIKE-E-MORALS",
    "label": "Morals and Dogma",
    "kind": "work",
    "familyId": "pike-masonic-provenance",
    "description": "Published Scottish Rite text; selected 1871 scan passages and a later reprint transcription inspected.",
    "sourceIds": [
      "PIKE-S-CORNELL",
      "PIKE-S-GUTENBERG"
    ],
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978. Albert Pike, Morals and Dogma, Project Gutenberg ebook 19447, preface and XIX; transcription of a later reprint whose front matter says “Reprinted, February, 1944”; https://www.gutenberg.org/cache/epub/19447/pg19447.txt.",
    "limitations": []
  },
  {
    "id": "PIKE-E-SUPREME-COUNCIL",
    "label": "Scottish Rite Supreme Council, Southern Jurisdiction",
    "kind": "organization",
    "familyId": "pike-masonic-provenance",
    "description": "The jurisdiction named on the inspected book’s title and preface.",
    "sourceIds": [
      "PIKE-S-CORNELL"
    ],
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "limitations": [
      "This node does not stand for all Freemasonry worldwide."
    ]
  },
  {
    "id": "PIKE-E-ALLEGED-LETTER",
    "label": "Alleged 1871 Pike–Mazzini letter",
    "kind": "document",
    "familyId": "pike-masonic-provenance",
    "description": "Unacquired document attributed in later accounts; its authorship and wording are disputed.",
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-ALLEGED-LETTER"
    ],
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. Alleged Albert Pike letter to Giuseppe Mazzini dated 15 August 1871, as attributed in later Carr/BCY materials; no original, verified shelfmark or contemporary copy acquired.",
    "limitations": []
  },
  {
    "id": "PIKE-E-CARR",
    "label": "William Guy Carr",
    "kind": "person",
    "familyId": "pike-masonic-provenance",
    "description": "Author attributed by the acquired later reproductions; allegations remain attributed.",
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-CARR-SATAN"
    ],
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "limitations": []
  },
  {
    "id": "PIKE-E-PAWNS",
    "label": "Pawns in the Game — inspected reproduction",
    "kind": "work",
    "familyId": "pike-masonic-provenance",
    "description": "Modern webprint with a three-war narrative and a separately introduced alleged-letter quotation.",
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "limitations": []
  },
  {
    "id": "PIKE-E-SATAN",
    "label": "Satan, Prince of This World — composite reproduction",
    "kind": "work",
    "familyId": "pike-masonic-provenance",
    "description": "Electronic edition combines attributed manuscript text, a 1966 preface and later notes.",
    "sourceIds": [
      "PIKE-S-CARR-SATAN"
    ],
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "limitations": []
  },
  {
    "id": "PIKE-E-BCY",
    "label": "Grand Lodge of British Columbia and Yukon",
    "kind": "organization",
    "familyId": "pike-masonic-provenance",
    "description": "Publisher of the acquired rebuttal and host of two translated Taxil-era texts.",
    "sourceIds": [
      "PIKE-S-BCY-REBUTTAL",
      "PIKE-S-TAXIL-TRANSLATION",
      "PIKE-S-ILLUSTRATION"
    ],
    "source": "Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html. Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html. Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "limitations": []
  },
  {
    "id": "PIKE-E-TAXIL",
    "label": "Léo Taxil",
    "kind": "person",
    "familyId": "pike-masonic-provenance",
    "description": "Speaker to whom the translated 1897 confession is attributed.",
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION",
      "PIKE-S-ILLUSTRATION"
    ],
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html. Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "limitations": []
  },
  {
    "id": "PIKE-E-1889-CIRCULAR",
    "label": "Purported Pike circular dated 1889-07-14",
    "kind": "document",
    "familyId": "pike-masonic-provenance",
    "description": "A different alleged document: Taxil’s translated speech says he wrote it in Paris.",
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION"
    ],
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html.",
    "limitations": [
      "Must not be merged with the alleged 1871 letter."
    ]
  },
  {
    "id": "PIKE-E-CONFESSION",
    "label": "Taxil’s reported 1897 conference",
    "kind": "document",
    "familyId": "pike-masonic-provenance",
    "description": "Speech known here through a 1997 English translation and a translated contemporary report.",
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION",
      "PIKE-S-ILLUSTRATION"
    ],
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html. Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "limitations": []
  }
]);

export const ESCHATOLOGY_PIKE_CLAIMS = freeze([
  {
    "id": "PIKE-C-AUTHENTIC-WORK",
    "familyId": "pike-masonic-provenance",
    "kind": "documentary-fact",
    "title": "An authentic published work is a separate object",
    "text": "The Cornell scan identifies Morals and Dogma as prepared for and published by the Supreme Council for the Southern Jurisdiction. Its copyright leaf says 1871; this is distinct from the unacquired letter attributed to the same author.",
    "subjectIds": [
      "PIKE-E-PIKE",
      "PIKE-E-MORALS",
      "PIKE-E-SUPREME-COUNCIL"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL",
      "PIKE-S-GUTENBERG"
    ],
    "locator": "Cornell PDF 7–10; Gutenberg front matter",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978. Albert Pike, Morals and Dogma, Project Gutenberg ebook 19447, preface and XIX; transcription of a later reprint whose front matter says “Reprinted, February, 1944”; https://www.gutenberg.org/cache/epub/19447/pg19447.txt.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1871",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Library-catalogued edition year",
        "qualifier": "Catalogue year and copyright leaf; no exact publication day. Title A.M.5632 retained separately.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "Entered according to Act of Congress, in the year 1871",
    "supports": "The edition, named institutional scope and identity of the inspected work.",
    "cannotEstablish": "Authenticity of an unrelated letter, a precise publication day, or universal Masonic doctrine.",
    "contraryEvidence": [],
    "limitations": [
      "The later Gutenberg transcription includes 1944 reprint front matter; the two editions are one work lineage."
    ],
    "sourceFamilies": [
      "pike-morals-dogma"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CORNELL",
        "originSourceId": "PIKE-S-CORNELL",
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "original",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-GUTENBERG",
        "originSourceId": null,
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-PREFACE",
    "familyId": "pike-masonic-provenance",
    "kind": "documentary-fact",
    "title": "The preface permits disagreement",
    "text": "The inspected preface says its compiler combined others’ words with his own, distinguishes speculative discussion from doctrine, and permits readers to reject what seems untrue or unsound.",
    "subjectIds": [
      "PIKE-E-MORALS",
      "PIKE-E-SUPREME-COUNCIL"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL",
      "PIKE-S-GUTENBERG"
    ],
    "locator": "Cornell printed prefaceiv / PDF 10; Gutenberg Preface",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978. Albert Pike, Morals and Dogma, Project Gutenberg ebook 19447, preface and XIX; transcription of a later reprint whose front matter says “Reprinted, February, 1944”; https://www.gutenberg.org/cache/epub/19447/pg19447.txt.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1871",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Library-catalogued edition year",
        "qualifier": "Catalogue year and copyright leaf; no exact publication day. Title A.M.5632 retained separately.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "Every one is entirely free to reject and dissent",
    "supports": "What this particular preface says about the readings.",
    "cannotEstablish": "Every member’s private beliefs, modern organizational practice, or a binding creed shared by all Freemasons.",
    "contraryEvidence": [],
    "limitations": [],
    "sourceFamilies": [
      "pike-morals-dogma"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CORNELL",
        "originSourceId": "PIKE-S-CORNELL",
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "original",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-GUTENBERG",
        "originSourceId": null,
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-APOCALYPSE-CONTEXT",
    "familyId": "pike-masonic-provenance",
    "kind": "documentary-fact",
    "title": "Pike’s apocalyptic language retains its surrounding text",
    "text": "Printed p.321 discusses the Apocalypse, Lucifer as light-bearer, the Sohar and Sephar Yezirah in a symbolic comparison. The surrounding sentence describes faith that aspires to God alone and despises the pomps and works of Lucifer. The passage supplies no dated third-world-war forecast.",
    "subjectIds": [
      "PIKE-E-MORALS",
      "PIKE-E-PIKE"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL",
      "PIKE-S-GUTENBERG"
    ],
    "locator": "Cornell printed 321 / PDF 331, XIX Grand Pontiff; matching Gutenberg XIX",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978. Albert Pike, Morals and Dogma, Project Gutenberg ebook 19447, preface and XIX; transcription of a later reprint whose front matter says “Reprinted, February, 1944”; https://www.gutenberg.org/cache/epub/19447/pg19447.txt.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "year",
        "value": "1871",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Library-catalogued edition year",
        "qualifier": "Catalogue year and copyright leaf; no exact publication day. Title A.M.5632 retained separately.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "and despises all the pomps and works of Lucifer",
    "supports": "The actual selected wording and named textual comparisons.",
    "cannotEstablish": "Secret worship by a population, shared institutional control, a whole-book eschatological system or a future war date.",
    "contraryEvidence": [],
    "limitations": [
      "Names of Jewish works in a comparative passage do not identify a specific edition read or equate Jewish Kabbalah with Masonry."
    ],
    "sourceFamilies": [
      "pike-morals-dogma"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CORNELL",
        "originSourceId": "PIKE-S-CORNELL",
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "original",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-GUTENBERG",
        "originSourceId": null,
        "sourceFamily": "pike-morals-dogma",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-ALLEGED-DATE",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-allegation",
    "title": "1871-08-15 is an alleged letter date",
    "text": "The inspected Carr webprint attributes a letter to Pike addressed to Mazzini on August 15,1871. No original, verified shelfmark or contemporary copy is present in the acquired packet. This date labels the alleged document, not a future war.",
    "subjectIds": [
      "PIKE-E-ALLEGED-LETTER",
      "PIKE-E-PIKE",
      "PIKE-E-MAZZINI",
      "PIKE-E-PAWNS"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-ALLEGED-LETTER"
    ],
    "locator": "Pawns introduction, webprint 8/13, paragraph introducing the quotation",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. Alleged Albert Pike letter to Giuseppe Mazzini dated 15 August 1871, as attributed in later Carr/BCY materials; no original, verified shelfmark or contemporary copy acquired.",
    "reading": {
      "status": "selected-loci-inspected",
      "fullWorkRead": false
    },
    "assessment": "unresolved",
    "dates": {
      "claimedDocument": {
        "precision": "day",
        "value": "1871-08-15",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "claimed",
        "label": "Alleged letter date",
        "qualifier": "Date asserted by a later reproduction; not authenticated and not a target date.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "year",
        "value": "2006",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Year visible in webprint footer",
        "qualifier": "Modern reproduction year only; footer day/month order not resolved.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "On August 15, 1871, Pike told Mazzini",
    "supports": "That the inspected later reproduction makes this attribution.",
    "cannotEstablish": "Existence, authorship, dispatch, receipt or exact wording of an 1871 original.",
    "contraryEvidence": [
      "The same corpus contains Carr’s reported not-catalogued footnote and a later Grand Lodge rebuttal."
    ],
    "limitations": [
      "Lack of an acquired original is a bounded evidence gap, not proof that all correspondence between these people was impossible."
    ],
    "sourceFamilies": [
      "alleged-pike1871-original-unknown",
      "carr-pawns-webprint"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-PAWNS",
        "originSourceId": null,
        "sourceFamily": "carr-pawns-webprint",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-ALLEGED-LETTER",
        "originSourceId": null,
        "sourceFamily": "alleged-pike1871-original-unknown",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-QUOTE-BOUNDARY",
    "familyId": "pike-masonic-provenance",
    "kind": "analytical-inference",
    "title": "The three-war narrative and quoted block are different",
    "text": "In the inspected Pawns webprint, the WW 1/WW 2/WW 3 paragraphs are Carr’s narration. A subsequent sentence introduces the “We shall unleash…” block as alleged letter words. The later BCY page reproduces circulating three-war paragraphs as purported quotations. These versions must not be merged into an authenticated Pike quotation.",
    "subjectIds": [
      "PIKE-E-PAWNS",
      "PIKE-E-ALLEGED-LETTER",
      "PIKE-E-BCY"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-BCY-REBUTTAL"
    ],
    "locator": "Pawns webprint 7–8/13; BCY paragraph “Carr claimed the following” and three-war blocks",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "year",
        "value": "2006",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Inspected Carr webprint year",
        "qualifier": "Year of this later webprint, not earliest publication of the account.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "We quote his own written words",
    "supports": "A quotation-boundary difference between the two acquired reproductions.",
    "cannotEstablish": "Who first composed every circulating version, or that the later whole block is an 1871 transcript.",
    "contraryEvidence": [],
    "limitations": [
      "Earliest located in this inspected packet does not mean first ever published.",
      "The original 1950 s edition and cited earlier Caro/Miller passages were not collated in this batch."
    ],
    "sourceFamilies": [
      "bcy-pike-rebuttal",
      "carr-pawns-webprint"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-PAWNS",
        "originSourceId": null,
        "sourceFamily": "carr-pawns-webprint",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-BCY-REBUTTAL",
        "originSourceId": "PIKE-S-BCY-REBUTTAL",
        "sourceFamily": "bcy-pike-rebuttal",
        "dependencyType": "original",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-CENTURY-FRAME",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-allegation",
    "title": "Carr gives a broad twentieth-century frame",
    "text": "The webprint says the alleged blueprint was intended to reach its final stage “during the twentieth century.” This is Carr’s broad retrospective framing of an alleged plan, not an exact year or day for a third world war and not an authenticated Pike prediction.",
    "subjectIds": [
      "PIKE-E-PAWNS",
      "PIKE-E-ALLEGED-LETTER"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "locator": "Pawns introduction webprint 7/13, paragraph beginning “Between 1859,and 1871”",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "reading": {
      "status": "selected-loci-inspected",
      "fullWorkRead": false
    },
    "assessment": "unresolved",
    "dates": {
      "claimedDocument": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "year-range",
        "value": null,
        "startYear": 1901,
        "endYear": 2000,
        "calendar": "gregorian",
        "status": "claimed",
        "label": "Carr’s claimed blueprint final-stage century",
        "qualifier": "The phrase twentieth century is normalized to 1901–2000; it dates the alleged plan’s broad final stage, not a precise WW 3 event.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "during the twentieth century",
    "supports": "The presence of a century-level phrase in the inspected account.",
    "cannotEstablish": "A validated deadline, a future war date, or evidence of the claimed blueprint.",
    "contraryEvidence": [
      "The alleged document itself remains unacquired."
    ],
    "limitations": [],
    "sourceFamilies": [
      "carr-pawns-webprint"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-PAWNS",
        "originSourceId": null,
        "sourceFamily": "carr-pawns-webprint",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-MUSEUM-REPORT",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-report",
    "title": "A not-catalogued reply is reported, not independently acquired",
    "text": "Footnote 9 of the composite Satan reproduction reports that the Keeper of Manuscripts told the author the letter was not catalogued in the British Museum Library. The main text above still asserts that it is catalogued. Both statements and the missing original reply remain visible.",
    "subjectIds": [
      "PIKE-E-SATAN",
      "PIKE-E-ALLEGED-LETTER"
    ],
    "sourceIds": [
      "PIKE-S-CARR-SATAN",
      "PIKE-S-KEEPER-REPLY"
    ],
    "locator": "Printed p.22, main paragraph and footnote 9",
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959. Unacquired Keeper of Manuscripts response reported in the electronic reproduction of Carr, Satan, Prince of This World,p.22,note 9.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "this letter is NOT catalogued in the British Museum Library",
    "supports": "That this reproduction reports a negative catalogue response and contains an internal contradiction.",
    "cannotEstablish": "An independently authenticated custodian finding, the date of that reply, or a complete archive search.",
    "contraryEvidence": [],
    "limitations": [],
    "sourceFamilies": [
      "carr-satan-composite",
      "reported-keeper-reply-unknown"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-SATAN",
        "originSourceId": "PIKE-S-KEEPER-REPLY",
        "sourceFamily": "reported-keeper-reply-unknown",
        "dependencyType": "cites",
        "notes": "Original reply unavailable; acquired evidence is Carr-attributed footnote only."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-COMPOSITE-DATES",
    "familyId": "pike-masonic-provenance",
    "kind": "documentary-fact",
    "title": "The electronic edition contains different date layers",
    "text": "The acquired Satan reproduction has a preface signed W.J.Carr,Jr.,Lima,Peru,June 2,1966. Its postscript says “In June 1966, thirty years almost to the day” after that preface. This conflicts internally; the uploader’s 1959 label, the 1966 preface and the later webmaster additions are not one verified publication date.",
    "subjectIds": [
      "PIKE-E-SATAN",
      "PIKE-E-CARR"
    ],
    "sourceIds": [
      "PIKE-S-CARR-SATAN"
    ],
    "locator": "Printed pp.4–5, preface signature, publisher postscript and webmaster note",
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "day",
        "value": "1966-06-02",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Date written on the son’s preface",
        "qualifier": "A textual preface date; not established book publication date or eschatological target.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "June 2, 1966",
    "supports": "What the composite reproduction prints in its front matter.",
    "cannotEstablish": "An exact first-publication date, a corrected 1996 date, or authentication of every passage as Carr’s final wording.",
    "contraryEvidence": [],
    "limitations": [
      "The source’s “June 1966 / thirty years” inconsistency is not silently corrected."
    ],
    "sourceFamilies": [
      "carr-satan-composite"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-SATAN",
        "originSourceId": null,
        "sourceFamily": "carr-satan-composite",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-BCY-POSITION",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-report",
    "title": "The Grand Lodge rejects the letter attribution",
    "text": "The Grand Lodge of British Columbia and Yukon calls the correspondence a fabrication. Its report of a museum response to Michael Haupt cites threeworldwars.com, not a custodian letter acquired here. Its position and dependence are preserved without treating it as independent archival authentication.",
    "subjectIds": [
      "PIKE-E-BCY",
      "PIKE-E-ALLEGED-LETTER"
    ],
    "sourceIds": [
      "PIKE-S-BCY-REBUTTAL",
      "PIKE-S-HAUPT-REPLY"
    ],
    "locator": "Article opening/conclusion; note 1; update footer",
    "source": "Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html. Unacquired museum response reported by the Grand Lodge of British Columbia and Yukon through threeworldwars.com, accessed there 2007-05-12.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "day",
        "value": "2007-05-17",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Displayed webpage update",
        "qualifier": "Page update date, not date of alleged letter or verified date of museum response.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "not supported by any documentation",
    "supports": "The named institution’s published rebuttal and cited dependency.",
    "cannotEstablish": "A direct museum statement, first creation date of all versions, or proof that every variant has one author.",
    "contraryEvidence": [],
    "limitations": [],
    "sourceFamilies": [
      "bcy-pike-rebuttal",
      "reported-haupt-reply-unknown"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-BCY-REBUTTAL",
        "originSourceId": "PIKE-S-HAUPT-REPLY",
        "sourceFamily": "reported-haupt-reply-unknown",
        "dependencyType": "cites",
        "notes": "BCY note 1 cites threeworldwars.com accessed 2007-05-12; original custodian response unavailable."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-TAXIL-CIRCULAR",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-report",
    "title": "Taxil’s admission concerns a different 1889 circular",
    "text": "In the selected English translation of his reported 1897 conference, Taxil says he wrote a circular in Paris, dated it July 14,1889, and presented it as a document by Pike. This supports a specific attributed admission; it does not identify who composed the alleged 1871 three-war letter.",
    "subjectIds": [
      "PIKE-E-TAXIL",
      "PIKE-E-1889-CIRCULAR",
      "PIKE-E-CONFESSION",
      "PIKE-E-PIKE"
    ],
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION"
    ],
    "locator": "Translated speech, paragraph beginning “We saw indeed some Masonic journals” / circular datedJuly 14,1889; introductory date/edition note",
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html.",
    "reading": {
      "status": "selected-loci-inspected",
      "fullWorkRead": false
    },
    "assessment": "supported",
    "dates": {
      "claimedDocument": {
        "precision": "day",
        "value": "1889-07-14",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "claimed",
        "label": "Date assigned to the purported circular",
        "qualifier": "Distinct from the 1871 alleged letter.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "statement": {
        "precision": "day",
        "value": "1897-04-19",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Reported conference date",
        "qualifier": "Date given by the translation’s introduction; original newspaper not collated.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "publication": {
        "precision": "year",
        "value": "1997",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "English translation publication year",
        "qualifier": "Heredom 5,pp 137–168; not the speech date.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": "a circular dated July 14, 1889, written by myself in Paris",
    "supports": "The specific admission as transmitted in the named translation.",
    "cannotEstablish": "That Taxil wrote every later letter variant, or that this 1889 circular is the alleged 1871 document.",
    "contraryEvidence": [],
    "limitations": [
      "The source wrapper reports a transcript in LeFrondeur,1897-04-25; that newspaper issue was not acquired."
    ],
    "sourceFamilies": [
      "taxil-conference1897-translated"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-TAXIL-TRANSLATION",
        "originSourceId": null,
        "sourceFamily": "taxil-conference1897-translated",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-TAXIL-REPORT",
    "familyId": "pike-masonic-provenance",
    "kind": "attributed-report",
    "title": "A contemporary report describes the 1897 disclosure",
    "text": "The acquired English translation of Edmond Frank’s L’Illustration article describes Taxil’s public disclosure at the Geographic Society on April 19,1897. This is a distinct reported text, accessed through the same modern Masonic host as the confession translation.",
    "subjectIds": [
      "PIKE-E-TAXIL",
      "PIKE-E-CONFESSION"
    ],
    "sourceIds": [
      "PIKE-S-ILLUSTRATION"
    ],
    "locator": "L’Illustration no 2827 bibliography; “Last April 19 th” and “Act Four” paragraphs",
    "source": "Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "day",
        "value": "1897-05-01",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Original article date stated by wrapper",
        "qualifier": "Original clipping not visually collated; English translation dated 1997.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "day",
        "value": "1897-04-19",
        "startYear": null,
        "endYear": null,
        "calendar": "gregorian",
        "status": "documented",
        "label": "Reported public meeting",
        "qualifier": "Reported historical event, not prediction.",
        "clock": null,
        "yearNumbering": "historical-no-year-zero"
      }
    },
    "shortExtract": null,
    "supports": "A separate contemporaneous reporting lineage as described by its modern translation.",
    "cannotEstablish": "Authenticity or authorship of the alleged 1871 letter; whole-speech accuracy.",
    "contraryEvidence": [],
    "limitations": [
      "Shared hosting is not independent institutional custody verification."
    ],
    "sourceFamilies": [
      "illustration-taxil-report1897"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-ILLUSTRATION",
        "originSourceId": null,
        "sourceFamily": "illustration-taxil-report1897",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  },
  {
    "id": "PIKE-C-TARGET-UNKNOWN",
    "familyId": "pike-masonic-provenance",
    "kind": "analytical-inference",
    "title": "No exact WW 3 target date is supplied by these passages",
    "text": "The selected Carr three-war narration and separately introduced alleged-letter block provide no exact year or civil day for a third world war. The 1871 alleged-letter date,1889 circular date,1966 preface and 2007 webpage update are dates of different objects. Carr’s broad century framing remains a separate, unverified claim.",
    "subjectIds": [
      "PIKE-E-PAWNS",
      "PIKE-E-ALLEGED-LETTER",
      "PIKE-E-SATAN",
      "PIKE-E-1889-CIRCULAR"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-CARR-SATAN",
      "PIKE-S-TAXIL-TRANSLATION",
      "PIKE-S-BCY-REBUTTAL"
    ],
    "locator": "Selected loci identified in the preceding claims; no full-corpus absence claim",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959. Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html. Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html.",
    "reading": {
      "status": "selected-loci-inspected",
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
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "statement": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "publication": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "transmission": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "target": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Exact WW 3 target date not supplied",
        "qualifier": "No date value encoded.",
        "clock": null
      },
      "historicalContext": {
        "precision": "unknown",
        "value": null,
        "startYear": null,
        "endYear": null,
        "calendar": null,
        "status": "unknown",
        "label": "Date not established",
        "qualifier": "No date value encoded.",
        "clock": null
      }
    },
    "shortExtract": null,
    "supports": "A bounded negative finding for the inspected passages.",
    "cannotEstablish": "Proof about every edition or circulating version, or any future conflict prediction.",
    "contraryEvidence": [],
    "limitations": [
      "Calendar conversion requires a separately chosen study date; an unknown target cannot be converted into a prophetic instant."
    ],
    "sourceFamilies": [
      "bcy-pike-rebuttal",
      "carr-pawns-webprint",
      "carr-satan-composite",
      "taxil-conference1897-translated"
    ],
    "evidenceDependencies": [
      {
        "sourceId": "PIKE-S-CARR-PAWNS",
        "originSourceId": null,
        "sourceFamily": "carr-pawns-webprint",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-CARR-SATAN",
        "originSourceId": null,
        "sourceFamily": "carr-satan-composite",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-TAXIL-TRANSLATION",
        "originSourceId": null,
        "sourceFamily": "taxil-conference1897-translated",
        "dependencyType": "reproduction",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      },
      {
        "sourceId": "PIKE-S-BCY-REBUTTAL",
        "originSourceId": "PIKE-S-BCY-REBUTTAL",
        "sourceFamily": "bcy-pike-rebuttal",
        "dependencyType": "original",
        "notes": "Original acquired artifact; historical underlying text and edition limits remain as specified in its source record."
      }
    ],
    "reviewStatus": "unreviewed",
    "reviewMode": "self-check",
    "updatedAt": "2026-10-30",
    "supersedes": null
  }
]);

export const ESCHATOLOGY_PIKE_EDGES = freeze([
  {
    "id": "PIKE-X-AUTHOR",
    "fromId": "PIKE-E-PIKE",
    "toId": "PIKE-E-MORALS",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-AUTHENTIC-WORK"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL"
    ],
    "asserted": true,
    "label": "Named author/compiler of the inspected work",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "limitations": []
  },
  {
    "id": "PIKE-X-AUTHORITY",
    "fromId": "PIKE-E-MORALS",
    "toId": "PIKE-E-SUPREME-COUNCIL",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-AUTHENTIC-WORK",
      "PIKE-C-PREFACE"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL"
    ],
    "asserted": true,
    "label": "Title and preface name this publishing authority",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "limitations": [
      "One jurisdiction; no worldwide coordination inferred."
    ]
  },
  {
    "id": "PIKE-X-LETTER-AUTHOR",
    "fromId": "PIKE-E-ALLEGED-LETTER",
    "toId": "PIKE-E-PIKE",
    "type": "disputed-attribution",
    "claimIds": [
      "PIKE-C-ALLEGED-DATE"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS",
      "PIKE-S-ALLEGED-LETTER"
    ],
    "asserted": true,
    "label": "Later account attributes the unacquired letter to Pike",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958. Alleged Albert Pike letter to Giuseppe Mazzini dated 15 August 1871, as attributed in later Carr/BCY materials; no original, verified shelfmark or contemporary copy acquired.",
    "limitations": [
      "Attribution is unresolved; not a verified act."
    ]
  },
  {
    "id": "PIKE-X-LETTER-RECIPIENT",
    "fromId": "PIKE-E-ALLEGED-LETTER",
    "toId": "PIKE-E-MAZZINI",
    "type": "disputed-attribution",
    "claimIds": [
      "PIKE-C-ALLEGED-DATE"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "asserted": true,
    "label": "Later account names Mazzini as recipient",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "limitations": [
      "No dispatch or receipt record acquired."
    ]
  },
  {
    "id": "PIKE-X-CARR-PAWNS",
    "fromId": "PIKE-E-CARR",
    "toId": "PIKE-E-PAWNS",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-QUOTE-BOUNDARY"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "asserted": true,
    "label": "Reproduction attributes the work to Carr",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "limitations": []
  },
  {
    "id": "PIKE-X-PAWNS-LETTER",
    "fromId": "PIKE-E-PAWNS",
    "toId": "PIKE-E-ALLEGED-LETTER",
    "type": "citation",
    "claimIds": [
      "PIKE-C-ALLEGED-DATE",
      "PIKE-C-QUOTE-BOUNDARY"
    ],
    "sourceIds": [
      "PIKE-S-CARR-PAWNS"
    ],
    "asserted": true,
    "label": "Narrates wars, then introduces an alleged-letter quotation",
    "source": "William Guy Carr, Pawns in the Game, later yamaguchy.netfirms.com webprint reproduction uploaded as a 1958 item, introduction webprint 7–8/13; https://archive.org/details/PawnsInTheGameWilliamGuyCarr1958.",
    "limitations": [
      "Citation does not authenticate the cited item."
    ]
  },
  {
    "id": "PIKE-X-CARR-SATAN",
    "fromId": "PIKE-E-CARR",
    "toId": "PIKE-E-SATAN",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-COMPOSITE-DATES"
    ],
    "sourceIds": [
      "PIKE-S-CARR-SATAN"
    ],
    "asserted": true,
    "label": "Composite edition attributes unfinished text to Carr",
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "limitations": [
      "Later preface, postscript and webmaster notes remain separate."
    ]
  },
  {
    "id": "PIKE-X-SATAN-LETTER",
    "fromId": "PIKE-E-SATAN",
    "toId": "PIKE-E-ALLEGED-LETTER",
    "type": "citation",
    "claimIds": [
      "PIKE-C-MUSEUM-REPORT"
    ],
    "sourceIds": [
      "PIKE-S-CARR-SATAN"
    ],
    "asserted": true,
    "label": "Reports contradictory catalogue statements",
    "source": "William Guy Carr, Satan, Prince of This World, later ThreeWorldWars.com electronic reproduction, pp.4–5 and p.22 note 9; https://archive.org/details/Satan--PrinceOfThisWorldWilliamGuyCarr1959.",
    "limitations": [
      "Reported reply, not independently acquired custodian correspondence."
    ]
  },
  {
    "id": "PIKE-X-BCY-LETTER",
    "fromId": "PIKE-E-BCY",
    "toId": "PIKE-E-ALLEGED-LETTER",
    "type": "disputed-attribution",
    "claimIds": [
      "PIKE-C-BCY-POSITION"
    ],
    "sourceIds": [
      "PIKE-S-BCY-REBUTTAL"
    ],
    "asserted": true,
    "label": "Institution publishes a rebuttal of the attribution",
    "source": "Grand Lodge of British Columbia and Yukon, “Albert Pike’s correspondence with Giusseppe Mazzini: a fraud”, updated 2007-05-17, opening and notes 1–3; https://freemasonry.bcy.ca/anti-masonry/pike_mazzini.html.",
    "limitations": [
      "This edge records a published position, not an archive-wide finding."
    ]
  },
  {
    "id": "PIKE-X-TAXIL-CIRCULAR",
    "fromId": "PIKE-E-TAXIL",
    "toId": "PIKE-E-1889-CIRCULAR",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-TAXIL-CIRCULAR"
    ],
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION"
    ],
    "asserted": true,
    "label": "Translation reports his admission of fabrication",
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html.",
    "limitations": [
      "A different 1889 circular, not proof of authorship of 1871 versions."
    ]
  },
  {
    "id": "PIKE-X-CIRCULAR-PIKE",
    "fromId": "PIKE-E-1889-CIRCULAR",
    "toId": "PIKE-E-PIKE",
    "type": "disputed-attribution",
    "claimIds": [
      "PIKE-C-TAXIL-CIRCULAR"
    ],
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION"
    ],
    "asserted": true,
    "label": "Circular was falsely attributed to Pike in the reported admission",
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html.",
    "limitations": []
  },
  {
    "id": "PIKE-X-TAXIL-SPEECH",
    "fromId": "PIKE-E-TAXIL",
    "toId": "PIKE-E-CONFESSION",
    "type": "attribution",
    "claimIds": [
      "PIKE-C-TAXIL-CIRCULAR",
      "PIKE-C-TAXIL-REPORT"
    ],
    "sourceIds": [
      "PIKE-S-TAXIL-TRANSLATION",
      "PIKE-S-ILLUSTRATION"
    ],
    "asserted": true,
    "label": "Speech and disclosure attributed to Taxil",
    "source": "Léo Taxil, reported conference of 1897-04-19, translated by Alain Bernheim, A.William Samii and Eric Serejski, Heredom 5(1997),137–168, circular-admission passage; https://freemasonry.bcy.ca/texts/taxil_confessed.html. Edmond Frank, L’Illustration no.2827,1897-05-01, English translation by SuzanneD’Aoust(1997), selected account of 1897-04-19 meeting; https://freemasonry.bcy.ca/texts/taxil_confession.html.",
    "limitations": []
  },
  {
    "id": "PIKE-X-TEXT-ZOHAR",
    "fromId": "PIKE-E-MORALS",
    "toId": "TR-E-ZOHAR",
    "type": "citation",
    "claimIds": [
      "PIKE-C-APOCALYPSE-CONTEXT"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL"
    ],
    "asserted": true,
    "label": "Pike names this work in a symbolic comparison",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "limitations": [
      "Names and compares the work, not proof of a particular edition read, shared worship, Jewish Kabbalah=Masonry, or institutional coordination."
    ]
  },
  {
    "id": "PIKE-X-TEXT-YETZIRAH",
    "fromId": "PIKE-E-MORALS",
    "toId": "TR-E-SEFER-YETZIRAH",
    "type": "citation",
    "claimIds": [
      "PIKE-C-APOCALYPSE-CONTEXT"
    ],
    "sourceIds": [
      "PIKE-S-CORNELL"
    ],
    "asserted": true,
    "label": "Pike names this work in a symbolic comparison",
    "source": "Albert Pike, Morals and Dogma (Charleston, catalogued 1871), Cornell University Library scan, title/copyright, preface iii–iv and printed p.321 (PDF p.331); https://archive.org/details/cu31924030324978.",
    "limitations": [
      "Names and compares the work, not proof of a particular edition read, shared worship, Jewish Kabbalah=Masonry, or institutional coordination."
    ]
  }
]);

export const ESCHATOLOGY_PIKE_LIMITS = freeze([
  "A bounded provenance study, not a complete history of Freemasonry, Taxil, Carr or every circulating letter version.",
  "Typed edges record citation, attribution or dispute. They are not clandestine coordination, causal influence, shared worship or secret government affiliation.",
  "The 1871 and 1889 dates label distinct alleged documents; the 1966 date is a preface; no exact WW 3 target date is supplied by the selected passages.",
  "Carr’s world-control allegations are not endorsed. They do not establish control by Jews, Muslims, Freemasons or any other population.",
  "The original alleged 1871 letter and reported custodian replies were not acquired. Three failed guessed URLs remain in the acquisition manifest; failures do not prove nonexistence.",
  "Different electronic reproductions and translations can share one underlying work; source count is not independent confirmation.",
  "A calendar or chart at a separately selected instant does not authenticate a document or validate its allegation.",
  "R 1 source findings and independent selected-locus challenge precede implementation. Later review rounds must record actual changed artifacts and hashes."
]);
