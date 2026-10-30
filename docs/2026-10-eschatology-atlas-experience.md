# Eschatology evidence atlas experience

Owned surface: `pages/eschatology-atlas.html`, `assets/js/app/eschatology-atlas.js`, `assets/css/eschatology-atlas.css`. This task applies the panel-led product redesign workflow, Design Partner create/verification guidance and repository observatory source contract. Reviewers are model agents; no human religious-authority review or user study is claimed.

## Round one: audit and first implementation decisions

The existing Newton chronology offers strong separation between source argument, conditional year arithmetic and assumed modern samples. The existing chronology page presents linear cards. The operative corpus graph has a specialized procedure DAG and cannot faithfully stand in for a graph of these distinct claims and documents. This is a code-derived design audit, not a new browser finding.

The new explorer keeps one selected claim synchronized across a relationship map, a qualified date axis and a sortable evidence ledger. These three views use native tabs so the table and dates remain useful without a large graph occupying the page. A persistent selected-record inspector exposes evidence assessment, every date role, reading scope, source locator, qualifications and typed relations. Query, family and assessment filters share one visible claim set.

The graph defaults to the selected claim and its records, with an explicit whole-filtered-collection view. It uses deterministic presentation geometry, typed nodes and edges, zoom controls, native scrolling and a complete keyboard-readable graph list. Catalogue-index links say “record concerns” or “claim cites source”; spatial proximity, node size and line length do not assert historical transmission, affiliation or a hidden organization.

The date role is explicit: source publication, statement, transmission, attributed document, claimed target or historical context. Unknown dates remain inspectable; partial dates do not acquire a fabricated day. Historical negative year labels are BCE with no year zero. The source-date calculation path is limited to canonical eligibility. A separate study-date path requires an explicit date and retains the selected source claim independently.

The calculation flow reuses one canonical frame and three named rule lenses through a worker. It will retain stale results under their original source/date/observer labels, disable dependent exports until fresh, terminate obsolete workers and reject stale responses. Calculated labels and rule readings do not provide independent support for a textual claim or a prediction.

The first owned HTML/CSS structure follows the established engraved paper, green ink and copper direction, with a compact headline, scoped native controls, local table scrolling, 44px targets and 16px mobile inputs. Runtime, source and browser acceptance are pending implementation of the agreed canonical schema.

## Round-one rendered evidence

The first Chromium attempt encountered an offline local server; no product was loaded or accepted from that attempt. After starting the static server, the owner pass loaded the real page at 1440, 390 and 320px. It found 28 claim rows, the default seven-node/nine-edge Pike neighborhood, no document overflow, no buttons below 44px, and zero runtime/console errors. A source-only request retained null geometry, then an explicitly entered 2060-07-01 London noon sample produced thirteen calendar rows and three named lenses at 11:00 UTC.

Evidence: `/tmp/eschatology-ui-r1-receipt.json`; images `/tmp/eschatology-r1-map-1440.png`, `/tmp/eschatology-r1-map-390.png`, `/tmp/eschatology-r1-dates-1440.png`, `/tmp/eschatology-r1-ledger-390.png`, with matching top/map/date/table captures at 320px. The owner and root directly inspected the cited images. Root accepted the visual hierarchy and year-bin disclosure but found graph text small and mobile endpoints difficult to discover.

## Round two: readable relations and truthful filtered state

Graph node and edge typography was enlarged. Curated same-column relations now route through the outer gutter, reducing overlap with catalogue subject links. Explicit Subjects / Selected claim / Sources pan controls and a named-neighbor summary make the mobile map usable without assuming a user discovers sideways panning. The table and date axis now state their local sideways-scroll behavior. All graph content remains available through the same keyboard list.

Independent core review found that a selected edge could survive in the inspector after filtering removed one supporting claim. The renderer now validates the selected record against the recomputed graph and falls back to the still-visible selected claim before painting or exporting. Filtered edges are withheld as whole records when any supporting claim is excluded. The visible-ledger CSV uses the complete locally visible graph, independently of the map’s focused neighborhood, and carries its actual withheld-edge disclosure and a view manifest. The evidence JSON explicitly retains the full canonical catalogue alongside its separate current-view manifest. Reading JSON/CSV directly use the canonical held-result serializers.

Source review prompted a neutral “Source transmission” label, explicit support/cannot-establish/contrary-evidence/dependency fields, authentication/access metadata, and qualified links to the existing separate Era Legis tool for relevant Thelemic records. The link does not add a fourth reading lens or calculate an end-date. Dynamically generated position-table headers now carry column/row scopes. Keyboard record activation moves focus to the inspected heading.

Independent code/geometry checks accepted the revised UI/core property mapping and 207 graph cases across family/all/focused scopes, including finite deterministic geometry and complete endpoint/support references. Browser QA and the paired editorial-view display improvement remain separate next steps; no final acceptance is claimed here yet.

## Round three: source-view lineage and complete fit behavior

Source review identified that the inherited Newton records retained both normalized and diplomatic editorial receipts in JSON but did not expose those paired views in the inspector. The source card now offers a collapsed list with each view’s URL, reading status, retrieval time and SHA-256, alongside an explicit warning that these represent one source lineage, not independent witnesses. The source reviewer accepted this display correction in the stated code/source scope.

Current owner screenshots at 1440, 390 and 320px confirmed the larger labels, named-neighbor summary and functional column-pan controls without page overflow, short buttons or runtime errors. Evidence: `/tmp/eschatology-r3-map-1440.png`, `/tmp/eschatology-r3-map-390.png`, `/tmp/eschatology-r3-subjects-390.png`, `/tmp/eschatology-r3-subjects-320.png`, and `/tmp/eschatology-ui-r3-receipt.json`.

That owner run found a concrete whole-collection fit defect: the old 25% minimum kept a 982px-high SVG in a 488px viewport. The fit action now uses the actual viewport/model ratio without that lower clamp. Manual zoom controls retain their ordinary limits; an explicit fit can use a smaller overview scale. Independent QA is exercising the corrected actual bounding boxes. No source or canonical calculation changed.

Candidate identities after this correction:

- HTML: `0599dcf154d6b6aa34c6abdb7178bbd966feb022427a452c00c71adc9c8535bb`
- App: `17b4ca08a052da6ec44d1d261c7ee76f95fb8cf9f796123eff3d92845cafddda`
- CSS: `a92dbb199528755fa0f515502f492060c6033b2ee4b08e653b1c853d067799a0`

The final independent browser, actual-download, fallback-font and visual acceptance remains pending at this checkpoint. Earlier owner and code checks are not substituted for that held-candidate result.

### Bounded type-styling correction before final hold

A final static check found a concrete category bug: a substring match on “text” colored `deity-in-text` as a document, while `publication` and `manuscript` fell through to the tradition/organization color. Although literal node labels were already correct, the visual legend was not. The renderer now uses an explicit document-kind set, preserves person and tradition/organization categories, and gives terms or figures in texts a separate neutral reference color and legend entry. A deterministic SVG check confirmed the Baal figure differs from its textual corpus and modern article; no relationship or source data changed.

The three product files are frozen at:

- HTML: `f88f6ac82692f2a3b706c3509a172def43a8c59084269c9a180e009948ae2dfe`
- App: `2686700cd4a8de55a033f1e2dd5f5127e5d8a66cc4da5bc79304b88ff34e328e`
- CSS: `8eba7c466540b7ff6158574e3b8c9741f655dbdd0bf5243fbaa7445d10be54fb`

Independent QA received these exact identities for the final four-width run, including a bounded node-kind/color membership assertion. Previous owner screenshots predate only this explicit category/legend correction and are not described as the final held visual receipt.

## Final independent acceptance

The exact held four-width refresh after the source file’s EOF-only normalization passed 631 browser checks, 275 independent semantic checks, and 64 actual parsed downloads, with zero browser errors and `acceptanceEligible: true`. Tests covered graph/list/inspector synchronization, whole-map fitting, typed node categories, source-only and explicit-date paths, source/target separation, visible-ledger/view-manifest exports, canonical reading JSON/CSV parity, stale/cancelled/reordered worker replies, unsupported clocks, keyboard access and fallback-font layouts.

All 44 final PNGs were accepted in the combined visual review. Newly changed captures were directly inspected; byte-identical captures were bound to the already inspected images by SHA-256. The review does not treat an automated layout check alone as visual acceptance.

Retained evidence is under `/workspace/setup-validation/eschatology-atlas/quality/round3/`: `browser/receipt.json`, `semantic.json`, `visual-review.json`, and their associated screenshots/downloads. The three owned product hashes remain those listed in the final hold above. Earlier checkpoint statements that acceptance was pending are superseded by this section.

No remaining UI finding is recorded in the accepted scope. Historical authentication, source-access gaps, named-tradition coverage and calculated outcomes retain their stated limitations; a passing UI test does not resolve those historical or interpretive questions. Publication, repository integration and exact live-release identity remain the parent task’s responsibility.
