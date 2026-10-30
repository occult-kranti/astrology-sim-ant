# Calendar Observatory: source and method research

Task date: 2026-10-29. Baseline inspected: `5f030c0` on `main`; implementation branch: `feat/mobile-calendar-observatory`. This is an AI engineering and source-analysis contribution. It is not human practitioner endorsement, a new critical edition, an exhaustive account of every culture, or evidence that astrology predicts events.

## What was inspected

The baseline contains **117 HTML routes** (home plus 116 under `pages/`), **135 core JavaScript modules** including data and visualization modules, and **91 app modules**. A separate `docs/LOCAL-LLM.html` is the 118th tracked HTML document, not an application route. The full application-route inventory is below. Reading covered the README/handoff/product/design contracts, cultural-calendar and Julian/Gregorian modules, the central registry, MCP contracts, Vedic data and source lenses, domain methods, calendar methods, existing scholarly/research matrices, and representative book/catalogue data. Route names and module inventories establish scope; they do not establish that every paragraph of every book or every possible calculator state was independently reviewed.

The project is a static, local-calculation application with a large historical-text catalogue. Existing tools include Western charts and house systems, horary, nativities and timing, Jyotiṣa charts and instantaneous Pañcāṅga elements, election/muhūrta scans, planetary hours, symbols and letter-number methods, divination demonstrations, cultural civil calendars, prayer calculations and Qibla. These functions are not interchangeable forms of a calendar.

### Preserve the domain distinctions

1. **An instant** is an exact UTC timestamp. A displayed civil date depends on an explicit IANA zone. Latitude/longitude do not determine an IANA civil zone.
2. **A calendar** labels days/months/years using a specified convention. Gregorian, Julian, and Japanese era labels can describe the same civil day without offering competing predictions.
3. **An astronomical quantity** is a computed Sun/Moon/planet position, phase, elongation, or rise/set event with a coordinate frame and model.
4. **A traditional rule** derives a named hour, mansion, tithi, dignity or interpretive testimony. Its source, convention, and approximation must remain attached.
5. **A community observance** can require an authority, region, sunset/sunrise policy, lunar sighting, diaspora rule or festival decision. Civil display alone does not implement that policy.
6. **A reading** is a source-labelled interpretation or study prompt. A computed geometry does not establish predictive, therapeutic, religious or ritual efficacy.

## Implemented baseline and expansion boundaries

The new engine owner's implementation and tests determine what actually ships. This table is a method contract, not a blanket accuracy certificate. Existing selected reference tests are documented in `2026-10-calendar-methods.md`. For civil displays, inherited selected fixtures cover Hebrew, Chinese, Thai Buddhist and Indian national Saka; the two Islamic display IDs have runtime support but no independently checked display-date fixtures in this release. The five additional Intl families below likewise have no new independent numerical fixture validation in this source lane. Gregorian/Julian/JD arithmetic has separate inherited fixtures. A USNO Islamic epoch reference does not by itself validate a 1900–2100 Intl Islamic display wrapper.

| Family / workflow | Baseline or proposed implementation | Exact scope and boundary |
|---|---|---|
| Gregorian / Julian / JD | Existing local arithmetic, reused | Proleptic conversions; JD changes at noon. No universal historical adoption date, no unannounced Gregorian-to-Julian gap. Modern comparison interface range may be narrower than the underlying arithmetic. |
| Hebrew | Existing runtime-checked Intl `hebrew` | Civil-midnight display in chosen zone. Not sunset-to-sunset religious date, holiday policy, Israel/diaspora rules, or local rabbinic authority. |
| Islamic arithmetic | Existing Intl `islamic-civil` | Named tabular civil convention; not observed crescent or generic universal Hijri determination. |
| Islamic Umm al-Qura | Existing Intl `islamic-umalqura` | Runtime data/convention and coverage. Table/fallback behavior can differ by implementation; not a local crescent declaration. |
| Chinese lunisolar | Existing Intl `chinese` | Preserve `relatedYear`, named/leap months and runtime support. HKO provides an independent UTC+8 reference for selected dates. Do not silently equate Korean, Vietnamese or historical Japanese lunar rules. |
| Thai Buddhist civil | Existing Intl `buddhist` | Modern Thai civil era. Not a pan-Buddhist observance calendar or historical Thai new-year reconstruction. |
| Indian national Saka | Existing Intl `indian` | Indian national solar civil calendar. Not a generic Hindu lunar or festival calendar. |
| Persian civil | Proposed Intl `persian` | Runtime-derived civil display only. Do not claim independently validated Iranian authority policy or equivalence of astronomical and arithmetic variants. |
| Coptic civil | Proposed Intl `coptic` | Runtime civil-calendar conversion, not a complete Coptic feast/fast calendar. |
| Ethiopic civil | Proposed Intl `ethiopic` | Named Ethiopic era, distinct from `ethiopic-amete-alem`. Not a validated complete Ethiopian/Eritrean liturgical policy. |
| Japanese era civil | Proposed Intl `japanese` | Era labels with modern Gregorian month/day conventions; not the premodern lunisolar calendar. Era coverage depends on runtime data. |
| ROC / Minguo civil | Proposed Intl `roc` | Taiwan civil era with Gregorian month/day structure; a different era is not an independent astronomical system. |
| Tropical / sidereal zodiac | Existing astronomy + Vedic wrappers | Same geocentric sky, two coordinate conventions. Expose numeric ayanāṁśa; linear Lahiri approximation is not exact JHora or Swiss equivalence. |
| Instant Pañcāṅga | Existing Vedic elements | Tithi/pakṣa from elongation; nakṣatra/yoga depend on sidereal convention; karana follows sourced special cases. Not a full regional daily/festival Panchang. |
| Planetary hours | Existing local sunrise/sunset division | Planetary day begins at preceding local sunrise, not UTC midnight. Polar missing intervals stay unavailable. Agrippa also reports a different oblique-ascension convention; that method is not implemented. |
| Prayer times / Qibla | Existing Adhan snapshot and local bearing | Explicit calculation method, Asr and high-latitude choice; true-north bearing. No claim of magnetic/sensor calibration or local religious authority. |
| Christian Easter | Existing Gregorian/Julian computus | Ecclesiastical tabular Moon; not an astronomical full-Moon calculation or proof every church uses the same policy. |
| BaZi / Zi Wei Dou Shu / Tibetan astrology | No complete validated calculator established in inspected baseline | Do not manufacture a reading from a Chinese civil date. Require named school, astronomical/day boundaries, source/rights review and independent fixtures. |
| Jain / Sikh / regional South Asian observances | Catalogue/research or partial neighbouring tools only | Choose an actual calendar version, authority and regional rule before numerical observance outputs. Nanakshahi/Bikrami are not one interchangeable policy. |
| Baháʼí / Maya / Aztec / Balinese / Babylonian / historical Egyptian | Research backlog for conversion and source-linked study | Epochs/correlation constants, day boundaries and historical variants need explicit choices. Existing historical prose is not a ready calendar engine. No invented fallback row. |
| Indigenous/community-specific seasonal systems | Not universalized or numerically implemented here | Community permission, geographical ecology, language and source stewardship can matter. A “global occult expert” persona is not a substitute for those relationships. |

For Intl-based rows, instantiate the requested calendar and check `resolvedOptions().calendar`; unavailable calendars must stay unavailable. Preserve `formatToParts` fields rather than treating all calendars as Gregorian numeric year/month/day. Record runtime calendar support and application version in exports. The same ID matching is necessary but does not prove independent numerical accuracy across 1900–2100.

## Fresh source access and reading depth

All HTTPS access used the inherited managed proxy and verified TLS. No mirror/proxy bypass, provider API key or protected book redistribution was used. Source bodies were inspected in this session; only metadata, small factual findings and links are retained. HTTP responses and hashes identify what was fetched, not historical truth or permanent URL stability.

| Source | Access and actual reading | Supports / limit |
|---|---|---|
| [Reingold, Calendar Papers/Code](https://www.reingold.co/calendars.shtml) | HTTP 200; full author-page descriptions read. 10,876 bytes; SHA256 `81012990cb087a1a59a14b8c596ed103038458410c980d64838c6747866b6c67`. | Metadata for Dershowitz/Reingold, *Calendrical Calculations: The Ultimate Edition* (Cambridge, 2018), more than three dozen calendar variants, and related papers. The entire book was **not** read or imported. Its list distinguishes astronomical/arithmetic Persian and Baháʼí and old/modern/astronomical Hindu variants. |
| [Dershowitz & Reingold, Indian Calendrical Calculations](https://www.cs.tau.ac.il/~nachum/papers/IndianCalendricalCalculations.pdf) | HTTP 200; PDF extracted; abstract, scope and regional critical-time passages inspected. 590,478 bytes; SHA256 `a6547d0d9f61822d353508ad24bcce78e5c7ddbafd9a53d2743fc79d826515b8`. | Academic analysis of Indian solar/lunisolar calendars, sunrise and holidays; e.g. Tamil critical time at current-day sunset and different Malayali rule. This directly rules out equating an instant tithi with all regional observances. Not a full new formula implementation or line-by-line proof review. |
| [Hong Kong Observatory 2026 Gregorian–Lunar table](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2026e.pdf) | HTTP 200; table text extracted and January/February/solar-term rows inspected. 222,576 bytes; SHA256 `f74b6da727e8025896b8c370f45a9f9da935aa48604680381bd5cf22bb525224`. | Independent selected Chinese-calendar date facts: February 17 begins first lunar month in the table's convention. Full protected table artwork is not shipped. Does not validate every regional East Asian calendar. |
| [ICU Calendar Services](https://unicode-org.github.io/icu/userguide/datetime/calendar/) | HTTP 200; calendar support/list and API scope inspected. 63,860 bytes; SHA256 `79f4798a1cfd5e6484a598d8aa43243a53ca855b60f9c334080e35f7c1788293`. | Runtime calendar services include Buddhist, Chinese, Coptic, Ethiopic, Hebrew, Indian, Islamic, Japanese and Persian. Support is distinct from tradition-specific religious observances. |
| [ECMA-402 DateTimeFormat](https://tc39.es/ecma402/#sec-intl-datetimeformat-constructor) | HTTP 200; locale/calendar negotiation and resolved-option contract inspected. 1,115,161 bytes; SHA256 `cfc7d0f08687dbf6e4d50bd3fbe58db1363291315c6a299bdd8eea72ab21e026`. | Calendar support/fallback and locale negotiation are runtime behavior. A formatter does not supply a complete observance decision engine. This was the live draft, not a version-pinned implementation. |
| [JHora official features](https://www.vedicastrologer.org/jh/features.htm) | HTTP 200; date input, Panchang and sunrise/hora convention descriptions inspected. 21,001 bytes; SHA256 `36dd33d6ee137fe3288bbecaeb78aafd736995f9ae7671789887d3629144ae07`. | Real specialist software exposes multiple ayanāṁśas, house models, sunrise/day conventions and more. Workflow inspiration only; freeware does not establish an open-source license or our numerical equivalence. |
| [Adhan upstream license](https://raw.githubusercontent.com/batoulapps/adhan-js/master/LICENSE) | HTTP 200, MIT text read; SHA256 `60ff1bbadcc093e0d224364b6ed1a439e9b8f8f05a4dd59c45c91d340b728136`. | MIT notice for the upstream package. The repository's pinned adaptation/provenance remains authoritative for actually bundled code. |
| [Hebcal HDate upstream license](https://raw.githubusercontent.com/hebcal/hdate-js/main/LICENSE) | HTTP 200, GPL version 2 text inspected; SHA256 `8177f97513213526df2cf6184d8ff986c675afb514d4e68a404010521b880643`. | Do not label this dependency permissive or silently bundle it. A separate code-license decision is required for any future package integration. |
| [OpenAI remote MCP guide](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) | HTTP 200 after official redirect; guide scope inspected. 801,005 bytes; SHA256 `fe132e74877bb531e97fab5aa086118c95b6fe74b63557775d95871f8fbf8b96`. | API remote-MCP is a tool integration using separately configured API/client authorization. It does not give a static website access to this signed-in ChatGPT conversation or account. Live authenticated connection is a separate check. |
| [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) | HTTP 200; security scope inspected. 859,387 bytes; SHA256 `ecd7b24b4dcc31d6b44a5b2c4b6668c86db1b6d1827ed2daa32b1c611cd3d6cd`. | Optional future record sync requires enabled RLS and explicit per-user policy. No Supabase project, database or authorization was established by reading documentation. |
| USNO [calendars](https://aa.usno.navy.mil/faq/calendars), [Islamic calendar](https://aa.usno.navy.mil/faq/islamic), [Easter](https://aa.usno.navy.mil/faq/easter) | **Three HTTP 503 responses this session**. No new page-reading claim. | Prior cited fixtures/methods in `2026-10-calendar-methods.md` remain inherited evidence, not fresh successful retrieval. No repeated unchanged retry or alternate egress was used. |

### Existing book corpus and what it can legitimately support

Keep existing edition/copyright/attribution fields. None of these entire works was newly read in this lane. The repository's prior source ledger remains a deeper account of what was actually read.

| Source family | Existing local records and legitimate role | Do not infer |
|---|---|---|
| Lilly, *Christian Astrology* (1647; separate 1659 source lens) | `read.html`, Books I–III, dignity/horary/nativity data; inherited 1659 opening/contents lens with exact edition flags | A 1659 transcription is not a newly collated 1647 source. Horary, question time and nativity are different tasks. |
| Parāśara/BPHS; Rao, *Vedic Astrology: An Integrated Approach*; Varāhamihira, *Bṛhajjātaka* | Existing Vedic source records, course, yogas/delineations and Eastern Great Works; compare named study rules with exposed approximate Lahiri model | The same rules across every school, exact JHora results, a universal Hindu festival calendar or settled authorship/date for composite traditional texts. |
| *Picatrix*, scholarly Attrell/Porreca/Pingree transmission | Existing election/mansion/correspondence/prayer pages and modern source citations | Copyright permission for the modern translation, or canonical status of the app's editorial election weights. |
| Agrippa, *Three Books* II.22/29/34 and III.30 | Existing source lenses and kamea/hour methods; chapter-linked arithmetic/history | That a modern Latin/Hebrew trace is an authenticated historical seal, or all hour methods are identical. |
| *Corpus Hermeticum*, Emerald Tablet, Newton manuscript/Opticks | Existing explicitly separate textual sources and observation/journal lens | A physical “as above, so below” law, a Newton astrology engine, or identity of distinct textual transmissions. |
| *Yijing*, Tarot, runes, Kabbalah; Buddhist texts/Yoga Sūtras | Existing historical study/divination and text-study pages; independent reading/exercise flows | Calendar conversion or scientifically verified personal forecasts merely because they are in the same library. |
| Reingold/Dershowitz calendrical scholarship | Book metadata and selected article passages newly inspected; roadmap for distinct implementations | Permission to copy all book code, full protected tables, or evidence that all named systems are implemented now. |

## Cross-tradition comparison protocol

A comparison record should preserve: exact UTC instant; IANA zone and local date; latitude/longitude; input certainty; requested calendar IDs and supported status; astronomical frame/engine; ayanāṁśa and house/hour/prayer conventions; generated-at time; software revision; source IDs and limitations. Date-only studies must say that an instant was chosen as a representative sample. Unknown birth time cannot yield an exact ascendant or house.

Show four adjacent layers on a phone: **shared moment → calendar labels → computed sky/traditional divisions → interpretive notes and differences**. A single compact explanation can say what is shared and why: tropical/sidereal signs derive from the same longitudes with an offset; a tithi and lunar illumination both depend on Sun–Moon geometry but are different quantities; solar prayers/hours share local solar events but use different rules. This is a dependency explanation, not independent corroboration.

Useful numerical comparisons include circular longitude differences, exact civil-day labels, named boundary changes, selected rule activations, and event-time offsets under explicitly chosen methods. Avoid a common “good/bad energy” score, averaging unrelated dignity/prayer/calendar values, a vote of calendars, or a probability of personal outcomes. Sources can disagree; display the disagreement instead of generating a synthetic universal tradition.

### Correlation and connection experiments: proposed, not executed here

- Build a dated feature table from explicitly sampled instants: astronomical numeric features, calendar categorical labels, and each named rule's output in separate columns. Give cadence, date range, missingness and method versions.
- A 14-day display sampled once per day describes those samples; it does not discover every exact tithi, mansion, ingress, prayer or lunar-phase transition. Exact-event timelines require bounded root-finding and independent event fixtures.
- Circular statistics are appropriate for angular quantities. Treat cyclic calendar positions as cyclic; ordinary Pearson correlation on raw month numbers can be misleading.
- Shared-engine deterministic quantities are mathematically dependent. Their association is expected and cannot validate predictive interpretations. Compare incremental information after known solar/lunar dependence rather than counting duplicated features as independent agreements.
- Any claim about observed outcomes needs a predeclared outcome, comparison/baseline model, held-out times, uncertainty, multiple-testing control and an ethics/consent plan if personal records are used. No such outcome study has been run by this implementation.
- A source relation graph should distinguish **textual borrowing**, **shared calculation**, **interpretive analogy**, **documented historical contact**, and **unverified proposed link**. Co-occurrence of names or similar symbols alone does not establish historical transmission.

## Integration decisions

| Candidate | Decision for this branch | Why / future gate |
|---|---|---|
| Existing Astronomy Engine + Vedic wrappers + Adhan + native Intl | Reuse, no duplicate ephemeris or calendar package | Already local and sourced; expose source/method/range and preserve unavailable states. Independent downstream wrapper tests remain necessary. |
| Additional Intl civil calendars | Add only runtime-checked named conversions | Small/no shipped dependency; additional cultural/authority interpretations remain unimplemented. Independent fixtures for extra five are future work. |
| JHora | Research/reference workflow only | Official feature page is not an open-source license; do not copy proprietary/freeware code or claim parity. |
| Swiss Ephemeris | Keep as documented reference unless separate license decision | AGPL/professional-license obligations require deliberate integration review. Existing reference fixtures are not runtime bundling. |
| Hebcal | Reference now; full observances need separate approved implementation/licensing | HDate is GPL-2.0; sunset/Israel/diaspora/authority choices and fixtures required. |
| Reingold calendrical code/ports | Research backlog, not automatic import | Check the exact artifact's license and edition; a GitHub port's declared license does not erase original-source obligations. |
| ChatGPT/MCP | Explicit copy/export or authenticated MCP client handoff; shared deterministic tool schemas | GitHub Pages cannot host server-side secrets or borrow this conversation's login. Publicly advertised older MCP deployment is not evidence the new branch tools are deployed there. |
| Optional server AI endpoint | Separate configured backend, explicit payload preview/send, source-linked response | No embedded secrets, silent coordinate transfer or invented live-provider success. Model text must preserve source status and supported/unsupported distinction. |
| Supabase | Not required for local comparisons, live refresh or weekly calculations | Optional personal saved-session sync needs real project setup, auth, RLS, per-user tests, retention/deletion/export rules and explicit opt-in. Do not claim connected when no project credentials/authorized tool exists. |
| Scheduled automation | Recalculate from current time on page load/resume/explicit live state; optional public derived fixture workflow | A closed static page is not a background worker. A GitHub schedule can be delayed and must show generated-at/stale status; never publish personal births/locations in generated assets. |

## Remaining domain-review gates

A knowledgeable reviewer from each newly implemented tradition should inspect terminology, selected convention, independent reference fixtures and boundary cases before stronger claims. This is a contribution opportunity, not a claim that such reviewers participated. In particular: extra five civil-calendar dates, community observance rules, local authority timetables, historical eras, polar boundaries and regional Panchang remain distinct validation tasks. Preserve the existing scientific framing: astronomical calculations are reproducible; astrology has no demonstrated predictive validity.

## Implemented-candidate source review

**Round 2, rendered candidate:** an independent source-analysis agent opened the running homepage and comparison page in Chromium at 390 × 844 CSS px, with service workers blocked and reduced motion. The comparison used `2026-10-29T12:00:00Z`, 28.6139° N, 77.209° E, `Asia/Kolkata` (the runtime canonically displayed `Asia/Calcutta`). Both pages returned HTTP 200, document width remained 390 px, and no page runtime exception was observed. Screenshots were visually inspected; this is browser/AI evidence, not a physical-phone or human practitioner test. All 117 baseline application files were independently confirmed present; the broader browser regression owner supplies route/function evidence.

The 13 civil rows displayed the one instant, midnight boundary and correct validation distinction: selected inherited fixtures for four old Intl displays, pending independent display-date fixtures for the two Islamic rows and the five newly added Intl families. Source links and unimplemented-method qualifications remained visible. The home clearly separated computed sky and zodiac conventions from a named traditional study classification and disclosed secondary sources.

Two material corrections were requested from the implementation owner: expose the comparison card's incomplete primary-text verification/modern-secondary-source limitation before its collapsed provenance, and avoid presenting an unqualified active “Avoid” verdict for an opening-portion yoga when limb start/end times are not computed. Expanded provenance showed why the first distinction matters: inherited tithi, yoga, karaṇa and nakṣatra rules cite modern websites/summaries, carry a blocked-source flag or single-source weekday qualification, and are not a new collation of *Muhūrta Cintāmaṇi*. Those inherited flags must survive the redesign and export.

**Round 3, corrected rendered candidate:** the source-analysis agent repeated the same Delhi instant in Chromium at 390 × 844 CSS px after the owner revisions. The historical-quality card now exposes “Primary-text verification is incomplete” and identifies modern secondary summaries before any disclosure is opened. Parigha displays “Opening-portion rule · timing unresolved” and explicitly states that no active avoidance judgment is applied. Other limb values are prefixed as historical classifications. The engine retains the inherited rule verdict separately, assigns opening rules a timing-unresolved applicability, and computes no active outcome verdict. All 13 calendar rows still rendered, width remained 390 px, and no page exception was observed; the corrected screenshot was inspected. These two requested domain corrections are resolved in the reviewed candidate. No claim of verse-level primary verification, all-book reading, tradition-specific human review or predictive validity is added.

Reviewed implementation SHA256 bindings: `assets/js/core/calendar-observatory.js` = `a3b181262b66c33360a405a599ae627d2fa859aef268595ba4d8dae7065346e9`; `assets/js/app/calendar-observatory.js` = `088651937bb81438aa4ad57c32d3c583957bebdb15cce086a4aadb09f4711298`; `assets/js/app/observatory-home.js` = `6b2f7144d000843d4987c5881c57421c4a7d14ce84e5b1ab85f1158448d5cbfb`. Later revisions require their own affected-surface verification; these hashes identify this source review rather than asserting a deployed release.

## Baseline route inventory

The following exact baseline list was generated from `index.html` and `pages/**/*.html` at `5f030c0`. New routes on the redesign branch are additive and tracked in the release evidence. All old routes and fragment targets should remain available; redirect-only master aliases are still part of compatibility.

| Route | Existing primary page title |
|---|---|
| `index.html` | The Astrologer's Workbench |
| `pages/abhichara/atharvan.html` | The Atharvan roots — the oldest layer |
| `pages/abhichara/index.html` | Abhicāra & the ṣaṭkarman — the Indian ritual-magic traditions, described |
| `pages/abhichara/six-acts.html` | The six acts, one by one |
| `pages/abhichara/sources.html` | The texts & the scholarship |
| `pages/about/index.html` | About, Sources & Scientific Context |
| `pages/autopilot.html` | The Grand Orchestrator 🜍 |
| `pages/basics.html` | The Basics — every concept, explained |
| `pages/book1/degrees.html` | The Degree Tables & the Body-Parts Grid |
| `pages/book1/dignities.html` | Essential Dignity Calculator |
| `pages/book1/index.html` | Book I — An Introduction to Astrology |
| `pages/book1/master.html` | Book I — Master Tool |
| `pages/book1/planetary-hours.html` | Planetary Hours |
| `pages/book1/reference.html` | Signs, Planets & Houses |
| `pages/book2/considerations.html` | Considerations before Judgement |
| `pages/book2/examples.html` | Lilly's Worked Charts — read live |
| `pages/book2/horary.html` | Horary Chart Calculator |
| `pages/book2/houses.html` | Horary, House by House |
| `pages/book2/index.html` | Book II — The Resolution of All Manner of Questions |
| `pages/book3/index.html` | Book III — An Easie and Plaine Method How to Judge upon Nativities |
| `pages/book3/master.html` | Book III Master Tool — the Nativity |
| `pages/book3/nativity.html` | Nativity Calculator |
| `pages/buddhist/dhammapada.html` | The Dhammapada — Dhammapada, vaggas 1–5 (Dhp 1–75) |
| `pages/buddhist/heart.html` | The Heart Sūtra — Prajñāpāramitā-hṛdaya (shorter) |
| `pages/buddhist/index.html` | The Buddhist scriptures — word by word |
| `pages/buddhist/metta.html` | The Metta Sutta — Karaṇīyametta Sutta, Snp 1.8 |
| `pages/buddhist/mn118.html` | The Ānāpānassati Sutta — mindfulness of breathing, MN 118 |
| `pages/buddhist/sources.html` | The editions & the licensing |
| `pages/calendars.html` | Calendars & directions |
| `pages/chronology/alchemy.html` | Alchemy, the magnum opus |
| `pages/chronology/field-guide.html` | A field guide to practice reported folklore |
| `pages/chronology/hermetica.html` | The practice of the Hermetica |
| `pages/chronology/index.html` | The Hermetic Chronology — as above, so below |
| `pages/chronology/library.html` | The library |
| `pages/chronology/rituals.html` | Starter practices |
| `pages/compare.html` | How this site compares — an honest survey of the landscape |
| `pages/confluence.html` | The Great Confluence — a map of books and their journeys |
| `pages/contents.html` | Master Index & Concept Map |
| `pages/cycles.html` | Cycles of History — great conjunctions & eclipses |
| `pages/experiment.html` | Test it yourself — the falsification demo |
| `pages/geomancy.html` | Geomancy — the Shield Chart, cast & judged |
| `pages/glossary.html` | Glossary & Dictionary |
| `pages/greatworks/agrippa.html` | Heinrich Cornelius Agrippa — Three Books of Occult Philosophy |
| `pages/greatworks/crowley.html` | Aleister Crowley — the system of "Magick" |
| `pages/greatworks/dee.html` | John Dee — the mathematician among the angels |
| `pages/greatworks/east.html` | The Great Works — Eastern masters |
| `pages/greatworks/hall.html` | Manly P. Hall — The Secret Teachings of All Ages |
| `pages/greatworks/hermetica.html` | The Hermetica — the philosophical dialogues of "Hermes" |
| `pages/greatworks/index.html` | The Great Works — author → book → chapter study guides |
| `pages/greatworks/kin.html` | The Kindred — Lévi · Ficino · Iamblichus · Regardie |
| `pages/greatworks/varahamihira.html` | Varāhamihira — Bṛhajjātaka |
| `pages/greatworks/vivekananda.html` | Swami Vivekananda — Raja Yoga |
| `pages/greatworks/yogananda.html` | Paramahansa Yogananda — Autobiography of a Yogi |
| `pages/handcalc.html` | Cast a chart by hand — the ephemeris & tables method |
| `pages/how-it-works.html` | How it's calculated — step by step |
| `pages/iching.html` | I Ching — the Book of Changes, cast & read |
| `pages/incense.html` | Incense & Suffumigation |
| `pages/interpret.html` | Reading your results — a reference guide |
| `pages/jung/experiment.html` | The astrological marriage experiment — and its honest re-run |
| `pages/jung/index.html` | Jung & astrology — the psychologist among the horoscopes |
| `pages/jung/sources.html` | Sources & reading — where the astrology is in Jung |
| `pages/jung/theory.html` | Jung's theory of astrology — what he claimed, and what he did not |
| `pages/jung/timeline.html` | The timeline — fifty years among the horoscopes |
| `pages/jung/tool.html` | The Jung chart tool — the charts he actually made |
| `pages/kabbalah.html` | Kabbalah — the Tree of Life explorer & gematria |
| `pages/kuta.html` | Kūṭa matching — the aṣṭakūṭa & the ten porutham |
| `pages/learn.html` | Learn astrology & the mathematics behind it |
| `pages/library/esoteric.html` | Divination & esoteric systems — the practitioners |
| `pages/library/index.html` | The Practitioners' Library |
| `pages/library/indian.html` | The Indian systems (Jyotiṣa) — the practitioners |
| `pages/library/western.html` | Western traditional astrology — the practitioners |
| `pages/master.html` | The Master Tool is now the Workbench |
| `pages/mcp.html` | Connect the calculation tools |
| `pages/moments.html` | The Moment Scanner — every rulebook, one timeline |
| `pages/muhurta.html` | Muhūrta — the Indian election of the moment |
| `pages/now.html` | Right Now — the live sky |
| `pages/opgraph.html` | The Operative Corpus — what these books tell an operator to do |
| `pages/picatrix/correspondences.html` | Planetary Magic — Correspondences |
| `pages/picatrix/election.html` | Election — choosing the moment |
| `pages/picatrix/faces.html` | The 36 Decan Faces |
| `pages/picatrix/index.html` | Picatrix — Astrological Magic |
| `pages/picatrix/kameas.html` | The planetary kameas — seven magic squares & their sigils |
| `pages/picatrix/mansions.html` | The 28 Mansions of the Moon |
| `pages/picatrix/prayers.html` | Planetary Prayers & Spirits — Picatrix Books III & IV |
| `pages/picatrix/stars.html` | The 15 Behenian Fixed Stars |
| `pages/picatrix/talisman.html` | The Talisman Workflow |
| `pages/practices/index.html` | Practices — the museum of methods |
| `pages/practices/mudras.html` | The mudrā catalog — the seals, text by text |
| `pages/prasna.html` | Praśna — Indian horary & the KP sub-lords |
| `pages/rasa.html` | Rasaśāstra & yantra-mathematics — the mercury alchemy and the magic squares of India |
| `pages/read.html` | Read the Original — chapter by chapter |
| `pages/roadmap.html` | The Roadmap — planned tools & wings |
| `pages/runes.html` | Elder Futhark Runes — cast & read |
| `pages/structure.html` | Structure & patterns — the hidden symmetry |
| `pages/studio.html` | Live Symbol Studio |
| `pages/synastry.html` | Synastry — the chart-to-chart aspect grid |
| `pages/tajika.html` | Tājika varṣaphala — the Indo-Persian annual chart |
| `pages/tarot.html` | Tarot — the spread, laid & read |
| `pages/thelemic-times.html` | Thelemic times — Era Legis & Liber Resh |
| `pages/timelords.html` | Time-lords & progressions — who "rules" the years of a life |
| `pages/tithi-pravesha.html` | Tithi-praveśa — the Vedic annual tithi return |
| `pages/tools.html` | Tools & Calculators |
| `pages/trajectory.html` | Life Trajectory — one nativity, the whole arc of a life |
| `pages/transits.html` | Transits to a natal chart |
| `pages/vedic/course.html` | The Parāśarī course — Jyotiṣa as it is actually taught |
| `pages/vedic/delineation.html` | Bhāva delineations — the two-witness browser |
| `pages/vedic/index.html` | Jagannath Hora — the Vedic (sidereal) reading |
| `pages/vedic/yogas.html` | Vedic yogas — the detector |
| `pages/workbench.html` | The Workbench — every calculation, linked in one tool |
| `pages/workflow.html` | Chapter Map & Workflows |
| `pages/yoga/index.html` | The Yoga Sūtras of Patañjali — the study wing |
| `pages/yoga/pada1.html` | Samādhi-pāda — Book I, on concentration (51 sūtras) |
| `pages/yoga/pada2.html` | Sādhana-pāda — Book II, the means (55 sūtras) |
| `pages/yoga/pada3.html` | Vibhūti-pāda — Book III, the powers (55 / 56 sūtras) |
| `pages/yoga/pada4.html` | Kaivalya-pāda — Book IV, isolation (34 sūtras) |
| `pages/yoga/sources.html` | The editions & the method |
| `pages/yoga/theory.html` | The eight limbs, the āsana honesty layer & the powers |
