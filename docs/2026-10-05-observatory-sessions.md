# Observatory sessions — connected practice roadmap

Date: 2026-10-05. Baseline Workbench code `ce8534b`, release candidate `cae1f4d`; SkyLens released main `c63139c`. This follows the independently verified Studio/MCP release rather than replacing it. Current work is isolated on `feat/observatory-sessions-2026-10`.

## Product decision and panel

Evolve the existing Live Symbol Studio into one session workspace: **Observe → Cast → Compare → Symbol → Journal**. Preserve its route, six calculators, saved snapshots and all dedicated tools. SkyLens remains the live camera/orientation experience. Transfer an explicitly captured instant, observer and selected object; never camera frames, sensor permissions, saved births or another app's local storage. Imported moments start frozen. A sky handoff is not a live stream or visual recognition.

Independent AI-agent perspectives: source/domain (`research_products`), camera/state architecture (`camera_advisor`), UI/accessibility (`ux_advisor`), AI privacy/transport (`calendar_research`), release QA (`remote_release_audit`), moderated by lead. These are AI engineering perspectives, not historical-person participation or observed human research. Applied skills: panel-led-product-redesign, Impeccable, resonance-research-advisor and historical-physics-panel. Source assertions require actual passages; unavailable supplementary skill references do not count as reviewed sources.

Historical lenses have different jobs: Lilly supports attributed question/chart reasoning; Agrippa supports sourced planetary correspondences and squares; Hermetic texts support attributed comparison/reflection; Newton supports observation/hypothesis/result notebooks. They do not become interchangeable ephemerides or guaranteed predictions. Existing ordinary planetary hours divide sunrise-to-sunset and sunset-to-sunrise into12parts each; Agrippa II.34 discusses more than one convention.

## Contract before implementation

- Shared context remains `calculation-context.js`; no new ephemeris. Preserve exact UTC instant, geographic degrees, requested/actual house methods and warnings. Observer civil zone remains unknown unless explicitly supplied; UTC display is not a civil-zone claim.
- A versioned, bounded URL fragment carries only `skyV=1`, `skyAt`, `lat`, `lon`, `skyMode=current|simulated`, `skyLoc=demo|selected`, optional canonical object identity/name/kind, and `skyNames=en|hi|bilingual`. Destinations are fixed project URLs, never arbitrary input. Whole-second instant;1900–2100 common range. Duplicate/malformed fields fail visibly. Explicit sharing discloses browser-history coordinates; fragments are not sent in HTTP requests.
- Session records are versioned, bounded local snapshots with separate question, observation notes, hypothesis and reflection. Saving is explicit. Existing storage is untouched; no per-tick journal writes. Export captures input, lens/source IDs and method provenance.
- AI receives an immutable previewed packet, with selected facts/source IDs. Personal notes and exact coordinates are excluded by default. No provider call before Send; no automatic tool calls. Provider/model/disclosure/context changes cancel and invalidate requests; late chunks cannot update a newer session. Copy/export works without an account. Browser BYOK and private MCP are distinct connections.
- The symbol stage reuses actual square/trace geometry and alphabet validation. Selected stars/constellations/satellites are contextual observations, not silently substituted for the seven classical planets.

## Bounded acceptance ledger

| ID / priority | Problem → expected behavior | Owner / files | Validation | Status |
|---|---|---|---|---|
| H1 P1 | Sky and chart are disconnected → explicit frozen round trip | Camera; SkyLens handoff/main/ui/index; Workbench core/sky-handoff.js | Shared fixtures, DST/date-line, names, unknown object, camera-off; actual browser round trip | Implemented;7handoffgroups +6sharedfixtures and browser round trip pass |
| S1 P1 | Tools lack a coherent working session → five-stage Studio | UX; studio.html, app/studio.js, studio.css | Same moment through chart/comparison/symbol/journal; preserve current calculators, mobile/keyboard journey | Implemented; original six calculators and five session stages pass at320/390/1280 |
| J1 P1 | Notes lack reproducible context → local versioned session journal | Lead; core/study-session.js + tests | Strict bounds, corrupt-record recovery, immutable saves, input/source/export parity | Implemented;8pure journal groups + browser restoration/export/frame checks pass |
| L1 P1 | Historical inspiration is disconnected from tools → source-linked study lenses | Domain; core/data/study-lenses.js + dated source ledger | Actual passages, relevant tool links, clear convention/claim boundaries | Implemented;4lenses,9qualified sources,16existing tool links validated |
| A1 P1 | AI receives excessive history → explicit minimal snapshot study | AI; app/session-study.js + pure packet/controller module | No network before Send, preview equality, exclusion checks, cancellation/401/429/offline, safe text | Implemented;10packet/controller groups and mocked provider browser checks pass |
| Q1 P0 | New bridge may regress released workflows → focused new tests + existing gates | QA/lead; browser and pure suites | Original118-page release baseline preserved; added cross-app/session journeys and bounded visual pass | Complete locally;118-page release sweep, five new groups, engine/audit/graph gates pass; physical checks separate |
| D1 P0 | Local result is not publication → tested commits and both Pages sites | Lead/release; workflows/docs | Deploy receiving adapter before outgoing handoff, exactSHA/live URL checks; MCP backend only redeployed if its controlled graph changes | SkyLensPR10 published for pinned cross-app CI; receiver-first deployment remains the release gate |

## Review and completion boundary

Pass1 is the source/architecture/UX panel above. Pass2 challenges working calculations, captured state, disclosure and recovery. Pass3 verifies integrated UI and actual releases. Fix material defects; at most one batched visual repair confirmation. P2 extensions (cross-session outcome analysis, source retrieval with citations, more MCP tools, encrypted sync, sophisticated election planning) require separate contracts and sources. No mandatory paid service, unverified magical efficacy, invented religious outputs or toxic historical recipes are introduced.

Verification, measured source-size costs and remaining external checks: [release evidence](2026-10-05-observatory-verification.md).
