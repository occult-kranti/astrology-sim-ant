# World events: source and UX decision ledger

Reference date for this research pass: **2026-10-29 UTC**. This document starts at panel round 1; implementation and verification receipts are appended only after they execute.

## Round 1 — inspected evidence and decision

The existing Calendar Observatory compares one explicit instant and observer. Its civil calendar rows do not establish religious observances, and its Pañcāṅga screens are secondary-source historical classifications with primary-passage verification pending. The new agenda must preserve those boundaries. The existing mobile form repair in baseline `a170499` remains unchanged.

**Decision:** add a separately labelled international event agenda. Its default horizon is two calendar months from a user-controlled Gregorian reference date. Distinguish public event dates from a reader's chosen chart-study sample. A date-only election is never converted into an alleged poll-opening instant or an election-result forecast. To compute context, the reader explicitly selects an observer and acknowledges a local-noon study sample; the same instant is then passed to the existing engine.

**Scope:** coverage is a source ledger, not a completeness badge. The major-coverage set is the G20's 19 sovereign member countries, plus separate European Union and African Union institutional entries. Additional countries can appear when a verified source supports a dated event. “No verified event in this curated snapshot” means that the dataset has no supported entry; it does not mean there is no election, holiday or other event in that jurisdiction. National/subnational scope, provisional schedules and annual observances remain separate.

**Sources:** prioritize official election authorities and official UN/agency observance pages. Record request status, final URL, retrieval time, short exact support excerpts and whether a date is annually recurrent, fixed in 2026 or provisional. A successful HTTP response alone does not verify a claim. Failed access remains failed access. Source freshness is separate from the dynamic agenda window: changing the reference date does not refresh the underlying research.

## Acceptance ledger

| Finding / risk | Decision and owner | Observable acceptance | Round / status |
|---|---|---|---|
| A rolling 60-day list differs from two calendar months | Agenda core uses clamped civil-month arithmetic and an explicit end-exclusive boundary | January/February, leap-year and year-rollover vectors | R1 / pending |
| Date-only event can be mistaken for an event-time chart | Keep `date`/precision in data and exports; require explicit local-noon observer sample for context | No context shown before acknowledgement; sampled UTC/local clock and source event date visible afterward | R1 / pending |
| Elections invite unsupported outcome inference | Display historical method context only; no winner, party persuasion, probability or causal claim | Source review and browser task check | R1 / pending |
| Globally curated list may imply full national coverage | Visible country/institution ledger with unknown/curated status and source limits | All G20 entries remain available even when filtered event count is zero | R1 / pending |
| Source availability is not date verification | Retain request/reading status and exact support alongside dates | Independent source/date joins and failed-source distinctions | R1 / pending |
| Dynamic dates can disguise stale data | Separate source-review time, calendar-window reference and client computation time | Frozen reference and current modes labelled; expiry/age warning inspectable | R1 / pending |
| Calendar export can misstate date precision or inject lines | RFC5545 TEXT escaping, UTF-8 line folding, stable UIDs, date-only DTSTART and exclusive next-day DTEND | Golden export edge vectors and parseable line structure | R1 / pending |
| Narrow forms or dense agenda can clip input | Reuse project tokens; single-column controls on phones; local disclosure for details | 320/390px reflow, visible native date/time values, keyboard/filter/export flows | R1 / pending |

## Research receipt — executed source pass

The source snapshot in [`assets/data/world-events.json`](../assets/data/world-events.json) was reviewed at **2026-10-29T22:17:04.277Z**. It retains **38 request/source records**: 17 with inspected date support, one with conflicting page elements, 12 failed accesses and eight received responses without usable date support. Received responses include challenge pages and a soft 404; they are not counted as date evidence. The election squad's more detailed bounded receipt is [`research/elections-2026-10-sources.json`](../research/elections-2026-10-sources.json), with 15 official requests and 54 source/hash/date checks.

The implemented dataset has **16 public-date records**: six dated elections, one explicitly conditional runoff, eight annual international-day rules and one dated campaign range. The default window from 29 October 2026 contains **15** because the conditional runoff is excluded unless requested. National, local and state elections are not conflated.

| Supported date / rule | Public record | Primary issuing source and qualification |
|---|---|---|
| 1 November 2026 | Bulgaria presidential/vice-presidential second round | [CEC decision 425, 29 October](https://www.cik.bg/bg/decisions/425/2026-10-29); the inspected Bulgarian subject and date-relevant paragraphs name 1 November. AI translation, not certified translation; no result extracted. |
| 1 November 2026 | Peru populated-centre local elections | [ONPE release, 28 October](https://www.gob.pe/institucion/onpe/noticias/1464686-asistencia-tecnica-de-la-onpe-permitira-que-mas-de-dos-mil-centros-poblados-elijan-sus-autoridades); 2,262 populated centres. This is not the regional-governor runoff. |
| 3 November 2026 | United States congressional general election | [FEC 2026 congressional schedule](https://www.fec.gov/resources/cms-content/documents/2026pdates.pdf), header `General Election Date 11/03/2026`. The document's own data date is 18 May and it says dates are subject to change; retrieval is not a fresh state-by-state confirmation. |
| 28 November 2026 | Victoria state election, Australia | [Victorian Electoral Commission](https://www.vec.vic.gov.au/voting/2026-state-election); explicitly a state election, not federal. Published opening hours are not converted to a shared event instant. |
| 28 November 2026 | Taiwan local public-office elections | [CEC public calendar](https://web.cec.gov.tw/central), inspected embedded public `calendarList` record 56 with `date: 20261128` and title `115年地方公職人員選舉投票`. No remote script execution or new hidden API call was used; this is a local-election date, not a presidential election. |
| 5 December 2026 | The Gambia presidential election | [IEC event](https://iec.gm/event/presidential-election-day/) and [dated preparations notice](https://iec.gm/iec-officials-discuss-electoral-preparations-ahead-of-december-5-2026-presidential-election/) agree on the date. Unzoned opening hours are not used as a nationwide event instant. |
| 12 December 2026, **if necessary** | Louisiana United States House runoff | The same FEC table explicitly labels the runoff column “IF NECESSARY.” This snapshot does not establish that a runoff will occur; the record is optional and exports as tentative. |
| Every 10 November | World Science Day for Peace and Development | [UNESCO](https://www.unesco.org/en/days/science-peace-development), explicit annual date. |
| Every 14 November | World Diabetes Day | [WHO](https://www.who.int/campaigns/world-diabetes-day), explicit annual date. No medical guidance is derived. |
| Every 16 November | International Day for Tolerance | [UNESCO](https://www.unesco.org/en/days/tolerance), date and UN resolution 51/95 described. |
| Third Thursday of November; 19 November in 2026 | World Philosophy Day | [UNESCO](https://www.unesco.org/en/days/philosophy) body states the annual rule and a dated 19 November 2026 programme. The page heading says 20 November and carries an older programme. This conflict remains visible: calculate from the explicit rule, rather than treating the heading as a fixed annual date. |
| Every 25 November | International Day for the Elimination of Violence against Women | [UNESCO](https://www.unesco.org/en/days/elimination-violence-against-women), explicit date and historical establishment. |
| 25 November–10 December 2026, inclusive | 16 Days of Activism | [UN Women 2026 programme](https://www.unwomen.org/en/what-we-do/ending-violence-against-women/unite/theme), both endpoints and year explicitly stated. |
| Every 1 December | World AIDS Day | [WHO](https://www.who.int/campaigns/world-aids-day), explicit annual date; no 2026 theme invented from an older programme. |
| Every 3 December | International Day of Persons with Disabilities | [WHO](https://www.who.int/campaigns/international-day-of-persons-with-disabilities), explicit annual rule. |
| Every 10 December | Human Rights Day | [OHCHR about-page](https://www.ohchr.org/en/about-us/human-rights-day), explicit annual rule. The generic campaign URL redirected to an older themed page and is not the date source. |

Annual projections deliberately start in 2026; earlier historical observance coverage is not represented. Campaign and annual-day records can overlap because they are different public calendar records. Their overlap is not independent astrological evidence.

### Coverage and access limits

The interface exposes 27 jurisdiction/institution rows: the named 19-country major cohort, EU and African Union institutional targets, five additional attempted/researched jurisdictions (Bulgaria, The Gambia, Peru, Taiwan and New Zealand), and worldwide observances. Seventeen major-cohort countries received no independent election-authority source check in this bounded pass. Australia's inspected date is only Victoria; a federal calendar request returned a soft 404. No empty jurisdiction row certifies an absence of events.

Two New Zealand official requests returned small human-verification pages despite HTTP 200. A proposed 7 November date remains unverified in this dataset and is excluded. Six main UN observance URLs returned HTTP 403; UNICEF guesses returned 404, and UNV/IOM requests failed. Those failed responses remain in the ledger; independent official agency pages supply only the dates actually listed above. Brazil's G20 membership page returned a human-verification body, and the Australian DFAT G20 page returned 503. The coverage cohort is explicitly named; these requests do not certify contemporary membership changes. No challenge solving, credential extraction, alternate egress or proxy bypass occurred.

### Date precision, interpretation and exports

All public records are **date-only**. The study tool requires an explicit acknowledgement of **12:00 local noon at the selected observer** and resolves that clock through the existing IANA/DST boundary. A campaign can select a study day within its published range. No capital is silently chosen, no poll clock is inferred, and changing the observer or campaign day clears prior study/AI output. The reused Calendar Observatory and day-guidance engines retain their own source and approximation limits; election-date sources do not validate a symbolic reading or an outcome forecast.

ICS exports use `DTSTART;VALUE=DATE`, exclusive next-day/end-range `DTEND`, stable occurrence UIDs, CRLF, RFC5545 TEXT escaping and UTF-8 75-octet folding. A 25 November–10 December campaign ends at exclusive 11 December in the export. Provisional dates use `STATUS:TENTATIVE`. Exports include public source/date context and exclude the selected observer/chart. An imported file is a snapshot, not an auto-updating calendar subscription.

### Automation and source-health boundary

While the page is open in current-date mode, its UTC reference date and two-calendar-month window can advance. A user-entered reference stays frozen. The end boundary is exclusive and month arithmetic clamps month-end dates; the window is not a hard-coded 60 days. Hidden/closed pages do not keep an active source-research job running.

The source-review warning uses an editorial **14-day review interval**, not a guarantee from an issuing authority. `scripts/refresh-world-events.py` makes one bounded normal-TLS availability request per selected source and writes a new local receipt. It never rewrites dates, marks facts verified or renews the public research timestamp. Changed source content requires inspection before editing the ledger.

```bash
python3 scripts/refresh-world-events.py \
  --source EL-fec2026 \
  --output /tmp/world-events-availability-receipt.json
```

This command was executed against the FEC source: HTTP 200, 226,820 bytes, captured-body SHA-256 match. That verifies the checker and byte comparison; it does not independently re-confirm every election rule. No scheduled source refresh, cloud job, external calendar subscription or new server deployment is claimed.

## Executed implementation checks

- `node scripts/tests/world-events.mjs`: **56** meaningful checks, including civil-month/leap/year boundaries, evidence joins, source failures, rule-derived Philosophy Day, country and conditional filters, campaign overlap, freshness warnings, explicit noon/zone resolution and ICS precision/escaping/folding/injection cases.
- `node scripts/browser-world-events.mjs`: **38** focused real Chromium checks under the GitHub Pages project subpath, with actual filtered ICS downloads, acknowledgement, observer/campaign invalidation, 320/390px native-input width, UTC date rollover, frozen-reference preservation and local-only requests. It confirms the underlying JSON is requested once; rolling the window does not masquerade as source revalidation. The independent release panel tests these flows separately.
- `node --check assets/js/app/world-events.js`: syntax passed.
- The source squad executed 54 receipt/hash/excerpt/metadata checks on its 15 election-source requests.

These are AI-agent technical checks, not observed human usability research, a physical-phone test, a screen-reader test, a certified translation, an external calendar import test or tradition-expert endorsement. Independent panel findings and final publication state are recorded by the coordinator.

## Final owner acceptance — round 4

The round-1 acceptance risks above are addressed by the executed core/browser checks and explicit product limits. Source failures, scoped country coverage and the Philosophy Day page conflict remain visible data qualifications, rather than silently converted into verified dates. The owner inspected the 320px and 390px first-view screenshots: the native date value is fully visible. A final visual review caught the inherited glossary treating political “election” as astrological “election”; the event page now uses the project's existing `no-autolink` boundary. The 38 browser checks and 56 core checks passed again after that correction. No existing calculator or comparison file was changed for this agenda.

Owner product files are on hold pending any independently confirmed release blocker. Local evidence is under `/workspace/setup-validation/world-events/`; that workspace path is an execution receipt location, not a public or permanent storage promise. Public deployment and whole-site regression results are separate coordinator evidence.
