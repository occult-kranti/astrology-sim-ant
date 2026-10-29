# Studio standards, source contracts and reusable specialists

Task date: 2026-10-29. Feature branch: `feat/mobile-calendar-observatory`. Page: [Standards & working examples](../pages/standards.html). This is a bounded software/source review, not a standards-certification claim, new human expert panel or full reading of every book.

## What actually runs

The standards page contains **16 curated examples**. All calculations and exports are local. The shared explicit timestamp, IANA zone and coordinates are visible before an example runs; changing them clears previous results, downloads and prepared task packets. No API request, account sign-in, database connection or model inference occurs on this page.

| Example | Actual implementation / status | Working artifact and boundary |
|---|---|---|
| RFC 3339 | Shared strict explicit-instant parser | Normalized UTC and selected-zone clock. Rejects invalid overflow, implicit-local and leap-second notation; application subset/range are explicit. |
| IANA / Temporal-style DST policy | Existing Intl/tzdb resolver; no new Temporal polyfill | Actual 2024 New York repeated-clock earlier/later results and nonexistent-clock rejection. Native Temporal availability is reported separately. |
| Intl / ICU calendars | Existing comparison engine, 13 named civil rows | Selected moment’s labels, method, midnight boundary, support and fixture status. New/religious/unimplemented scope stays distinct. |
| Astronomy Engine | Existing MIT vendored numerical engine | Sun/Moon longitudes, elongation and illumination; not camera observation or predictive validation. |
| Adhan | Existing pinned MIT snapshot | Actual selected local-day timetable with explicit default Muslim World League/Shafi/middle-of-night choices; polar unavailable is retained. |
| SVG / PNG | Native deterministic vector + Canvas raster | Actual downloaded SVG and PNG from the same computed longitudes, with text alternative. An illustration is not a historical plate or sky photograph. |
| JSON Schema | Draft2020-12 schema + local record-specific semantic checks | Downloaded schema; one valid and deliberately invalid record. No general-purpose validator library/conformance is claimed. |
| iCalendar | Local RFC5545 VEVENT export | UTC start/end, explicit generation DTSTAMP, CRLF, text escaping and UTF-8 75-octet folding. One study appointment, no account sync/holiday prediction. |
| Provenance | Application-authored PROV-inspired envelope | Entity/activity/derivation/source roles in JSON; explicitly not RDF/PROV-O conformance or evidence of a claim’s truth. |
| SQLite | Executable strict-table SQL adapter | Schema + selected-record INSERT + SELECT download. The actual downloaded SQL was executed in a local in-memory SQLite engine and returned the selected values. Browser does not bundle SQLite/WASM. |
| PostgreSQL | Concrete DDL + parameterized insert shape | Downloaded table DDL and displayed parameters. No server contacted. Store IANA zone separately from timestamptz. |
| Supabase | Proposed private-sync adapter, concrete RLS SQL | Owner-scoped SELECT/INSERT/UPDATE/DELETE policies. No project or auth/policy deployment; anonymous/two-user tests remain required before real use. |
| MCP | Existing separate official-SDK server; request builder | Actual JSON-RPC tools/call fixture for `workbench_compare_moment`; no transport initialization or remote call on this page. |
| OpenAI Responses/MCP | Server-side request adapter | Reviewable body, configurable model placeholder, authenticated MCP endpoint field, restricted tool and approval. No secret field or assumed ChatGPT login/API access. |
| OpenAI Image API | Server-side request adapter | Reviewable image request + editable editorial prompt and model placeholder. No image model called by this page. Model availability, account rights and billing remain unverified. |
| Source/edition rights | Existing Agrippa study-lens record | Real II.34 section/edition/status/note and distinction between implemented temporal hours, unimplemented alternative and modern reconstruction. No complete new book reading implied. |

Adapter and request examples deliberately have a different status from running local calculations. They are concrete artifacts to review/use in a configured host, not badges claiming a backend has been deployed. GitHub Pages serves static files; MCP, provider secrets and database authorization belong to separately configured processes/services.

## Actual source access and reading depth

All retrieval used the inherited managed proxy and verified HTTPS. The following primary technical documentation was fetched and selected relevant sections/metadata inspected. Large specifications were not read cover to cover. Hashes identify response bytes, not permanent content or scientific endorsement. Existing calendar/book research remains in [the comparison research ledger](2026-10-calendar-observatory-research.md).

| Source | Actual access / response SHA256 | Use and reading boundary |
|---|---|---|
| [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html) | HTTP200,44,033B; `c53b2d121b9f284e2cb28e2989c907470ae26a9db441bcd8a3236c6004a60bee` | Timestamp syntax/explicit-offset sections; app accepts a documented narrower subset. |
| [RFC5545](https://www.rfc-editor.org/rfc/rfc5545.html) | HTTP200,409,705B; `8787267ca21cfbe6ae7290a0548336fb06506f90e06ba8cdd878e75b6dea6053` | §3.1 folding/escaping and event/UTC/DTSTAMP contracts. No complete recurrence engine implemented. |
| [IANA zones](https://www.iana.org/time-zones) | HTTP200,8,120B; `8e6c9d3f1b99ffb1d56950539353ca30c71bb58eaa1c604afd0778bd7cb5254f` | Runtime zone-data provenance. This page does not ship a new tzdb. |
| [Temporal current specification](https://tc39.es/proposal-temporal/#sec-temporal-zoneddatetime-static-from) | HTTP200,2,467,725B; `fc35bf6d3ae565bd8984f44b1f5740ec8024743215f82af818f0f48ad57ef22e` | Explicit disambiguation contract. The formerly cited `/docs/ambiguity.html` returned **404**; the current specification was used instead. |
| [JSON Schema2020-12 core](https://json-schema.org/draft/2020-12/json-schema-core) | HTTP200,342,931B; `dbf38c4e2816ffd10376736fe99f8a1a63ee1995c064947ebe0f33efd6df9e60` | Schema dialect/annotation scope. Local hand-written record checks are not a general validator. |
| [MCP2025-11-25 transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) | HTTP200,175,110B; `1acc85180aa2095a5e6349a36c7cf58cc2ddd242e5e5d812888b70fc52a21135` | Stdio/StreamableHTTP and security/session boundaries; source tests vs actual remote authorization remain separate. |
| [OpenAI image guide](https://developers.openai.com/api/docs/guides/image-generation) | HTTP200,1,257,999B; `0a1c0468f3c4fbaf4fed852b8dbc57459cfb6be022deaf1ff6ac741962be62ad` | API distinction/model parameter and output workflows. The fetched body explicitly names `gpt-image-2.5-sunburst`/`gpt-image-2.5-flare`; the UI still uses **MODEL_ENABLED_FOR_YOUR_ACCOUNT**, because documentation is not proof of account access. No “latest/SOTA” claim. |
| [OpenAI MCP guide](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) | HTTP200,801,005B; `9c46a94f359c01e630cf0f64c192f623cd7bcb5589ff313cd68718d0679bd1c3` | Remote MCP server/auth/approval adapter. Does not grant access to this ChatGPT conversation. |
| [Responses reference](https://developers.openai.com/api/reference/resources/responses/methods/create) | HTTP200; **first3,000,000B only**, prefix SHA `c63e41c85ef35ec94ddff62c95481ec0ea4e0482d8cee6bb72c41940e644a2b5` | Selected visible request fields; prefix retrieval is not a full response or whole reference reading. |
| [SVG2](https://www.w3.org/TR/SVG2/) | HTTP200,72,652B; `14b38cf71a2e49bbb9e5671580e42ffe36ba1602c2737b7ad5b1c95825d0d225` | Native vector/document structure; no claim of full spec compliance suite. |
| [PNG](https://www.w3.org/TR/png/) | HTTP200,656,574B; `a3ac82bb9eb8664b93961a2a9ff6def3d70e3a9f63d92721143c1f391d04edec` | Native browser raster output format; no new encoder imported. |
| [PROV-O](https://www.w3.org/TR/prov-o/) | HTTP200,464,179B; `6b96671ab84faf12ce3f041aca12c3f93a6df2ed242348810743179a68e69555` | Entity/activity/derivation concepts. Example expressly PROV-inspired, not an RDF implementation. |
| [SQLite CREATE TABLE](https://www.sqlite.org/lang_createtable.html) | HTTP200,744,208B; `76396a8a82203639387f766fbd59ef2a5b131e43cb4ebabe4516c3a39ce5074c` | Table/constraint adapter; strict table and JSON checks exercised in actual local SQLite. No browser dependency. |
| [PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) | HTTP200,132,039B; `a237971aeee16aa1b6da68f20ee2798989b4dc4118bd8d0afc836a8da7da8209` | Typed storage request/schema shape. No actual PostgreSQL execution claimed. |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | HTTP200,860,192B; `53cbe2cc2c54aa24cbdd9c6bcec15f49e15cb35e676bb1b47cb5fed3d9b8b569` | Owner-policy shape, enabled RLS and public/service-role distinctions; no actual project/user-policy validation. |

### Fresh book passage review

[Agrippa II.29 and II.34](https://esotericarchives.com/agrippa/agripp2c.htm) returned HTTP200,105,914B, SHA `3b2a63d41c2b54196e94305bbc0bd361568d846cba6ea5d650e7738c3e306608`. The complete short II.29 chapter and relevant II.34 hour passages were inspected. II.29 describes positions, motions, aspects, signs/degrees, observer latitude and selecting the planet/Moon/day/hour. II.34 reports both temporal sunrise/sunset division and another ascension-based account. These support source-labelled historical timing context; they **do not** establish Lilly’s numeric cazimi/combust/beams thresholds, a fixed mean lunar-speed cutoff, personal outcomes or efficacy.

The fresh [Wikisource Lilly request](https://en.wikisource.org/wiki/Christian_Astrology) returned **403**. [Skyscript’s annotated index](https://www.skyscript.co.uk/CA.html) returned HTTP200,34,574B, SHA `8cc0e801d08278baccc4c95c34a68e10225f08a20413a00bfcedb1d5ae268150`; its descriptions explicitly distinguish commentary/uncertain definitions. The linked selected PDFs for CA69–86 and105–114 both returned **403**. Thus no fresh primary-Lilly numerical-threshold collation is claimed. Existing project transcriptions/fixtures remain inherited and qualified. No access restriction was bypassed.

## 58 specialist skills and two reusable agent templates

The repository now contains **13 implemented civil-calendar family skills** and **45 named book/source profiles**. The latter comprise **34 existing Great Works catalogue records plus11 additional source families** (Lilly, Picatrix, BPHS, Muhūrta Cintāmaṇi, Newton/Opticks method, Yoga Sūtras, Buddhist text families, Yijing, Tarot, runes and Kabbalah). This is not a claim that45 complete books were read or that58 expert agents are running.

Every profile reads the shared [source contract](../.claude/skills/observatory-source-contract/SKILL.md). Calendar skills name the actual algorithm/Intl ID, boundary, fixture status, unimplemented authority and verification commands. Book skills retain author/attribution, exact existing edition/locator, copyright/variant flags, canonical record and an explicit inherited-reading status. Bibliographic presence, checked passage, modern adaptation and working implementation remain separate. No generated profile is a credential, fine-tuned model, external service or historical-author persona.

Two repository agent templates instantiate a selected profile ID: `.claude/agents/calendar-method-reviewer.md` and `.claude/agents/book-source-reviewer.md`. Each registry record supplies `agentRole`, `agentTemplate`, `skillPath` and a bounded task contract with **input, method, references, verification, output and launch prompt**. The standards page prepares a reviewable task packet for any of the58 profiles, with copy/download actions. A calendar packet explicitly includes the selected example observer; a book packet requires a supplied exact passage/edition. Preparing/copying a packet does not start an agent. A compatible coding host must activate the repository instructions; they are not automatically installed ChatGPT plugins.

Generation is reproducible:

```sh
node scripts/build-specialist-profiles.mjs
node scripts/build-specialist-profiles.mjs --check
node scripts/tests/observatory-standards.mjs
```

The generator reads canonical `greatworks.js` / `greatworks-east.js` plus authored `.claude/skills/observatory-source-contract/profiles.json`. It emits58 skill files and the marked browser-registry block; `--check` is read-only and reports drift/stale specialist directories. The common contract and generic agent templates are authored inputs. The generator does not fetch books, infer rights, run a model or upgrade validation status.

## Verification and corrected review findings

Owner checks executed: **337 Node checks passed** for strict record/ICS boundaries, overflow/date-only/implicit-time rejection, separate creation DTSTAMP, UTC offset and host-zone invariance, escaping/injection resistance, Unicode line folding, manifests, source contracts and actual agent/skill paths. Reproducible generator `--check` passed with0 changes.

In actual Chromium at390px:16/16 examples ran;7 real downloads succeeded (JSON schema, ICS, SQLite SQL, PostgreSQL SQL, Supabase policy SQL, SVG, PNG); PNG had the real signature; the downloaded SQLite schema/insert/select executed and returned the exact selected instant/zone/coordinates/source count. Time-category filter, empty search, Hebrew profile task preview and changed-context invalidation passed. No page exception, whole-page horizontal overflow or external request was observed. This is not a physical-phone or screen-reader test.

Independent review found two real defects before correction: the ICS helper originally accepted JavaScript-overflow/implicit dates and used event time as DTSTAMP; the new helper now requires strict explicit event and generation instants. A PNG could finish after context changed; the corrected renderer checks the initiating revision after both image loading and `toBlob` and before download/status writes. The owner then deliberately delayed the actual Canvas `toBlob` callback, edited the observer context, and released the old callback: **zero downloads**, unchanged stale-context status and zero page exceptions were observed. Source review also required sigil-study exports/UI to retain **edition and section**, and the new method-doc link to point at the actual feature branch instead of an absent `main` document. Final review evidence identifies the tested candidate; it is separate from eventual merge/deployment.

Provider calls, actual Supabase/PostgreSQL deployments, live remote MCP OAuth/client authorization, physical-device interaction, screen-reader behavior and human tradition-specific review remain separate checks. Their absence is not replaced with an adapter preview or an “expert” label.

### Round3 cross-domain source check

The corrected Sigil Studio was opened at390px with the Newton lens. Its visible source card retained **Opticks,1730 fourth English edition, Query31 pp.404–405**, the method-vs-astrology qualification and the separate uncertain manuscript date. The SG-ALGORITHM link used the feature-branch methods document. The screenshot was inspected; no full-book or historical-author participation claim appeared. The modern intention algorithm, nonsectarian rosette, sourced-square/reconstructed-path distinction and separate actual AI illustration remained explicit.

Candidate SHA256 bindings for that affected-surface check: standards app `f4f8b02c5e52dcd3b8ac4d8d860b5038677a1484a976b10ab04bdecb3f505379`; standards data `327ac9f278680a398bd59d8dcbf696524f6a7526e9ef03a685c8a418fcb7ef8f`; sigil core `ed80cdf6523050cc302a119f5c400999128e23fb9fdd552b64fef694919224c0`; sigil app `7a9bfc3a1ae4514121beefc8af92fc2c7ced60deaaa70b624a076c1d921edc43`. These identify the tested files while other squads continued work; they do not assert a frozen release or deployed source revision.

### Round4 final source/provenance acceptance

**PASS within the source and provenance review scope.** The final catalogue still has13 implemented civil-family profiles and45 named book/source profiles, instantiated through two bounded agent templates rather than58 running experts. All16 standards distinguish local execution, record-specific validation, exported artifacts and unconnected request/SQL adapters. The image model remains an account-configurable placeholder. The actual AI artwork’s recorded hash matches the file; it remains separate from the deterministic SVG/PNG generator and the undeployed provider adapter.

Daily rules retain the fresh selected Agrippa chapter reading separately from inherited Lilly transcriptions, project speed/phase heuristics and modern secondary Pañcāṅga summaries. Measurements, thresholds, sampled-instant scope, optional editorial actions and unresolved opening-portion timing remain explicit. Hourly samples do not imply exact event searches or whole-day validity. This final review does not expand numerical or historical validation claims.

A fresh Chromium check used a real `/astrology-sim-ant/` HTTP subpath: the homepage’s four rendered local daily-source URLs retained that prefix and each returned200; the standards page rendered16 cards and58 profiles without a page exception. A suspected URL-base issue was disconfirmed: this daily module creates its own trailing-slash URL object, so no product correction was justified. Unchanged337-check/generator results are earlier evidence, not newly repeated tests.

Final source-review bindings: standards page `4d0875968cb07979638d86038bfa0b83880f6cd3fef314a093492c472c50e43d`; standards data `327ac9f278680a398bd59d8dcbf696524f6a7526e9ef03a685c8a418fcb7ef8f`; standards app `f4f8b02c5e52dcd3b8ac4d8d860b5038677a1484a976b10ab04bdecb3f505379`; sigil core/app retain the Round3 hashes above; daily core `452800185b54ffe64d337b767279af5f726d5d0df64981c599cc563d8f71e00b`; daily app `021c31f9195ea4e60cdf2718e4b4ce174be46eecf7307d54977194a7fbf13b0a`. The sorted58 skill path/content aggregate is `db2d8edd6e0ded123c960bd0938b6a577905a9da6192515306cde6fcd1fb7cc9` (each path plus newline, followed by its file bytes).

No remaining source/provenance blocker was found. Independent full-page browser/engine gates, merge/Pages publication, actual provider/remote-MCP/database authorization, human tradition-specific review and physical assistive-device checks are separate acceptance states. This recommendation is not evidence that those later states are complete.
