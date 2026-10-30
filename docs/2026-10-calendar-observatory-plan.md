# Calendar Observatory: product and integration plan

Task date: 2026-10-29. Branch: `feat/mobile-calendar-observatory`, forked from `5f030c0`. Companion [source and method research](2026-10-calendar-observatory-research.md) contains the 117-route baseline, actual sources read, method boundaries and integration/license decisions. This document defines the product flow and acceptance contract; release tests and panel decisions are tracked separately in [the panel ledger](2026-10-calendar-observatory-panel.md).

## Product decision

Keep The Astrologer's Workbench as a source-grounded study collection. Make the first phone screen answer **what moment/place is selected, what can be compared, and what changes over the next two weeks**. Preserve every existing route, engine, text wing, direct link, saved browser record and opt-in AI boundary. An additive comparison page and a shared visual shell are preferable to rewriting 117 pages or replacing working calculation engines.

The interface can present traditional readings and source-linked suggestions while clearly labeling them as historical/symbolic study. Weekly sky/calendar samples are computed forecasts of quantities, not validated predictions of personal events. The project cannot truthfully become an authority for every culture by renaming a generic calendar or requesting a universal-expert AI persona.

## Skills, plugins and actual external capability

This branch used the accessible **Design Partner** guidance for real-file redesign and mobile/accessibility checks, **Panel-led Product Redesign** for successive independent AI-agent review and implementation, and the **Cloud Environment runtime/onboarding** guidance for supported proxy/TLS, repository setup and reproducible verification. These are workflow instructions, not external human experts or new scientific validation. The **Superdesign CLI** was checked but was unauthenticated; its login waited for external authorization and was cancelled. No Superdesign canvas draft, credit use or design-model call occurred. The redesign therefore lives in real repository files and browser-verified artifacts. The available tool/skill catalogue was consulted as applicable; “all plugins” is not a claim that every installed skill or disconnected service was invoked. No authorized Supabase connection or live ChatGPT-account API access was established.

## Phone-first information architecture

Use a clear task hierarchy, shared across all page depths and the GitHub Pages project subpath:

- **Today / home:** current selected moment, explicit place and zone, main comparison action, this week's and next week's dated study outlook.
- **Compare:** date/time/location controls; named civil-calendar rows; shared sky; tropical/sidereal and instant Pañcāṅga context; planetary/prayer schedules; similarities, differences and unavailable methods.
- **Tools:** retain the complete calculator directory and search aliases; specialist pages remain directly reachable.
- **Study:** preserve books, source editions, workflow chapters, methods, glossary and libraries.
- **Assistant / connect:** optional local explanations, previewable study packet, explicit ChatGPT/MCP handoff and existing chosen-provider flows.

On a narrow screen, place the selected moment and primary action before the detailed catalogue. Use persistent labels, inputs of at least 16 CSS px, important touch controls approximately 44 px, visible keyboard focus, safe-area padding and reflow at 320 CSS px. Dense wheels/tables retain text alternatives and intentional local scrolling; they must not force the entire page horizontally. Advanced method settings can use disclosures without clearing their values or hiding an active status/error.

### Primary task: choose a reading for a date and place

1. Choose a named preset place or enter latitude/longitude and IANA zone. Device location is permission-controlled and only requested by an explicit action. A device zone is a suggestion, not the inferred zone for arbitrary coordinates.
2. Enter a local civil date and clock. Defaulting to noon is visibly a selected sample, not an inferred unknown birth time. Reject nonexistent DST clocks and identify repeated clocks; allow an explicit earlier/later occurrence where supported.
3. Calculate one normalized UTC instant. Every row receives that same instant and the same stated observer context. Retain inputs when validation fails and show a recovery message by the relevant field/status.
4. Inspect separate civil, astronomical and traditional sections. Put boundary/method/caveat information near the output. An unavailable calendar, polar solar event or unsupported observance stays unavailable.
5. Save/export the comparison with normalized inputs, sources, software/method versions and limitations. Downloading an explicit artifact is separate from sending data to a provider.
6. Optionally prepare a minimal study packet. Exact coordinates, zone and local date labels are a distinct opt-in disclosure. Preview before copying/exporting/sending. Plain geocentric coordinates and UTC instant can support a useful comparison without sharing a personal place.

### Primary task: this week and next week

The homepage should group **Monday–Sunday local civil weeks**, with an explicit sample clock, time zone, date range and generated/refresh status. A caller may also request consecutive selected-date groups; the engine must label those differently. Dates advance by civil-day arithmetic, resolving the same local sample clock independently; adding 24 UTC hours is incorrect across DST changes.

Each daily item shows actual computed lunar/calendar quantities and a short source-labelled study prompt. A user can open the exact sampled date/time/place in the comparison tool. Changes are between samples; do not label them exact ingress/tithi/nakṣatra event times or imply every transition was found. A 14-day sample set is not an exhaustive event search. A missing or ambiguous clock remains visibly unavailable rather than shifted silently.

The current/live state must be distinct from a frozen selected date. Opening the page, returning after it was hidden, an explicit refresh, and the relevant local-week rollover can update current context; historical selected moments should stay frozen. Avoid per-tick storage writes, unnecessary ephemeris work and hidden-tab timers. A closed Pages website does not run background calculations.

### Secondary task: understand a similarity or disagreement

Start with the shared input, then identify the relationship: same civil day/different era; same longitudes/different zodiac zero; shared Sun–Moon elongation/different partition; solar event/different religious or planetary rule; or genuinely not comparable. Show actual values and named assumptions. Do not combine dates, signs and prayers into a universal “auspiciousness,” agreement or truth score.

Source cards should retain title, section/edition, source URL, support scope and status. A claim from a historical book stays attributed to that book; a modern reconstruction stays labeled. The assistant must say what is absent rather than hallucinating a chapter passage or a complete unimplemented tradition.

## Parallel implementation boundaries

| Squad / owner | Surface | Contract and acceptance |
|---|---|---|
| Coordinator / homepage | `index.html`, dedicated homepage app/styles, common startup/release integration | Working selected-context entry and local-week outlook; old home destinations remain available; no hidden account requirement. |
| Calendar engine | New pure `core/calendar-observatory.js` and meaningful Node tests | One explicit instant, zone and observer; 13 named civil rows if runtime supports them; existing astronomy/Vedic/hour/prayer reuse; unavailable states; DST/civil-range safeguards; bounded 1–14 daily snapshots. |
| Comparison UI | New `pages/calendar-compare.html` and dedicated app/styles | Mobile form/results/source views; correct UTC normalization and export; loading/error/empty/unavailable and context-stale handling; no duplicate algorithms. |
| Shared mobile shell | Shared chrome and additive design tokens/styles | All 117 baseline pages keep functional routes and controls; project-subpath-safe links; accessible mobile navigation; tables/wheels/forms adapt without corrupting page-specific behavior. |
| AI / MCP | New minimal study-packet helper and existing server toolkit/connection surfaces | Explicit disclosure and local rule-based explanations; authenticated external handoff; strict bounded tool schemas; official protocol tests; no browser/server secret leakage. |
| Sources / research | This plan and companion research inventory | Actual-source reading-depth ledger, named tradition boundaries, license decisions and prioritized validation backlog. No product implementation or publication claims without release evidence. |
| Independent challenge | Panel ledger and browser/engine regression evidence | Review changed candidate, catch misleading states and regressions, implement corrections and verify again. AI review is not human usability research or tradition-authority endorsement. |

Shared files are coordinated through the root agent. No squad should mutate another's owned files without agreement. The user requested a new branch, so existing `main` remains untouched by local feature work; branch publication and any eventual merge are distinct release states.

## Automation and persistence architecture

**Required now:** local deterministic calculations. Page load/current-mode updates derive data from the actual current clock, an explicitly selected location/zone and existing engines. Cache only reusable calculations by all relevant inputs/methods; changing methods, zone or observer must not reuse stale rows. A current-week cache key must account for local Monday, selected zone, coordinates and relevant computational settings. Keep comparison/export state deterministic for a frozen instant.

**Optional public scheduled artifact:** a GitHub Actions workflow can compute a bounded sample outlook for one explicitly public/default place, validate its schema and publish derived JSON. Put `generatedAt`, requested span, source revision, method version and expiry beside the data. Hosted schedules may run late. A failed job does not make the previous artifact fresh. Do not place user births, private locations, questions, notes or API keys in public generated files. Runtime local recalculation remains the recovery path.

**Optional Supabase sync:** not needed for charts, civil calendars, a two-week outlook, local saved sessions or a local MCP process. Only add live sync after a real project and account authorization exist. A future schema can separate profiles, private study sessions, optional observations and nonpersonal public derived snapshots. Require row-level security on every exposed personal table, `auth.uid()`-scoped read/write policies, identity-bound tests for cross-user access, deletion/export, retention and migration/version rules. Service-role secrets belong only on a server. A public browser key alone is not a data-authorization model. No Supabase deployment or connection is implied by this plan.

## AI and this ChatGPT session

A static website cannot inherit this conversation's authentication, run the user's logged-in ChatGPT as an embedded API, or host a server-side secret. A truthful connection offers:

- Local deterministic explanations with a visible “no model called” status.
- A reviewable, source-labelled study prompt/JSON packet that a user explicitly copies/exports and pastes into ChatGPT or another client.
- An authenticated MCP client that calls the separately running official-SDK backend. Static Pages serves connection instructions, not the MCP process itself.
- Optionally a separately hosted, configured AI backend or the existing chosen-provider interface, with explicit request review/send, cancellation, source retention and a tested error path. Provider billing, access and retention remain external.

The previously documented remote Workbench MCP service uses an older deployed source. Adding local branch tools does not update that remote service automatically. Source/protocol tests, backend deployment, OAuth authorization and a real client tool call are separate claims. Keep tool allowlists, exact schemas, finite numeric/date validation, request limits and scan bounds. Treat book text, source labels and user questions as untrusted data; no arbitrary fetching or shell execution is necessary for these read-only calculators.

## Review rounds and acceptance ledger

The [panel ledger](2026-10-calendar-observatory-panel.md) owns actual findings, candidate revisions and test receipts. The requested swarm should make changes, not just produce reports about an unchanged mockup.

1. **Baseline and design decision:** inspect actual shared shell, main tasks, page inventory, engine/source contracts and current browser behavior. Select cohesive mobile direction and assign bounded implementation surfaces.
2. **Implemented-candidate challenge:** repeat date/place/weekly/compare/export/assistant tasks against the working result. Inspect source accuracy, DST/year boundaries, unsupported states, mobile reflow and old calculator regression. Fix meaningful defects before final checks.
3. **Release verification:** run meaningful Node engine/audit tests, official MCP protocol tests where configured and the full HTML browser sweep plus focused mobile journeys. Capture actual screenshots, inspect console/network, and distinguish local checks from published branch/preview/live evidence.

| Requirement | Observable acceptance gate | What does not satisfy it |
|---|---|---|
| Existing functions/pages retained | Baseline117-route compatibility inventory; old engine suite and browser sweep; representative complex calculators exercised | A new homepage or a CSS file by itself |
| Mobile-first full-site UI | Inspected narrow/medium/wide screenshots; 320px and 200% reflow; keyboard/menu/focus; no whole-page horizontal overflow | Class names claiming “responsive,” or desktop-only screenshots |
| Calendar comparison | Normalized single instant retained across all rows; explicit zone/location/methods; unavailable output and runtime-ID checks | Silently Gregorian-fallback formatting or fabricated unsupported readings |
| Local clock correctness | Known DST gap/fold, skipped-date, date-line and host-zone-independence checks; repeated-clock selection explicit | Device-local `new Date` parsing or fixed24h daily increments |
| Weekly automation | Correct local Monday alignment and next-week dates; stale/current labels; visibility/resume/refresh behavior verified | A hard-coded forecast date or an unexecuted workflow definition |
| Cultural/source integrity | Nearby boundary/approximation labels; extra-five validation limits; sources and unsupported catalogue preserved in exports/AI packets | A universal occult persona or a cross-tradition score |
| AI integration | Local explanation status; minimal payload preview; explicit transfer; no credentials in exports or Git; no unverified provider-success claim | Opening a ChatGPT tab and claiming it consumed the packet automatically |
| MCP integration | Exact new toolkit schemas + real initialize/list/call exchange in tested transport; remote deployment stated separately | Static page links or source-only unit tests presented as live OAuth success |
| Optional cloud storage | Actual authorized project/identity, per-user RLS tests and deployment receipts, if pursued | Supabase mentioned in docs or a fabricated connected badge |
| Release | Branch commit/push and review link if authorized; actual CI results; main/live status clearly separate | Local tests presented as a deployed redesign |

Physical-phone input/download behavior, screen-reader use and knowledgeable tradition-specific review are separate manual validation tasks. Automation can report what it actually checked; it must not claim those human checks or general accessibility certification.

## Expansion backlog: deliberately not hidden as delivered

| Priority | Next capability | Prerequisites |
|---|---|---|
| P1 | Independent fixtures for new Persian/Coptic/Ethiopic/Japanese/ROC civil rows | Named runtime/version, authority/reference facts at year/era/leap boundaries; current runtime support alone is insufficient. |
| P1 | More exact source-linked comparison explanations | Edition/section-specific curated source records, rights review, limited quoted text, preservation of disputed attribution. |
| P2 | Exact lunar/ingress/tithi event timeline | Bounded root-finding, timezone/local-date grouping, independent event fixtures, precision and interval-completeness statement. |
| P2 | Hebrew sunset dates and named observances | Sunset/horizon policy, Israel/diaspora and authority choices, GPL-compatible or independent implementation decision, independent fixtures. |
| P2 | Regional Hindu daily/festival calendars | Named amānta/pūrṇimānta and regional solar month rules, sunrise/sunset/critical-time definitions, skipped/repeated tithi and observance precedence fixtures. |
| P2 | Regional Islamic observance layer | Explicit calculation/authority/sighting distinction; local policy tables and publication/license/refresh contracts. |
| P2 | Tibetan, Jain, Sikh and other named regional calendars | Identified school/version/authority, licensed implementation or documented derivation, culture-specific terminology and reference tests. |
| P3 | Maya/Balinese/Baháʼí/historical civil reconstructions | Explicit epoch/correlation or equinox rules, culturally informed interpretation, independent reference and license/rights checks. |
| P3 | Empirical correlations with external outcomes | Predeclared outcome and null models, held-out data, dependency controls, uncertainty/multiple-testing, privacy/ethics and a separate research protocol. No efficacy inference from computed overlaps. |

Expand the matrix one named method at a time. “All cultures” is a research direction; it is not a claim that a finite current release has complete global cultural coverage.
