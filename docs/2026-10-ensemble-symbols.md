# Symbol methods: three-round ensemble evidence

This is the symbolic-art member's record for the six-agent ensemble beginning at `3be3d464a718d4562d3d1eb0254f90b706a7327f`. The participants are model agents using source and implementation profiles; they are not historical authors, human occult practitioners or independent empirical confirmation of magical effects.

## Round 1 — source, defect and implementation

Read the shared `observatory-source-contract`, `source-work-agrippa-three-books` and `accuracy-check` profiles, then the actual `symbols.js`, `kamea.js`, `sigil-design.js`, studio UI and tests. The inherited engine exports reproducible numeric JSON, but its UI had no way to replay it. A safe import also needs to distinguish numeric validation from authenticated historical provenance, and private-control restoration from ordinary viewing.

### Actual source reading

- **Work:** Heinrich Cornelius Agrippa, *Three Books of Occult Philosophy*, II.22. Complete Latin edition 1533; English “J.F.” edition 1651, digital text hosted/edited by Joseph H. Peterson. The disputed attribution of “J.F.” to John French or James Freake remains unresolved.
- **Retrieved:** <https://www.esotericarchives.com/agrippa/agripp2b.htm>, HTTP 200 on 2026-10-29; 80,123 bytes; SHA-256 `6ea46658e01c44f3106aea4bdd25ea4d0b942973abe196d02b206413046b3250`. Temporary working copy: `/tmp/ensemble-agrippa-0.html`.
- **Depth:** selected II.22 prose describing the seven planetary tables and the passage withholding the derivation of seals. This is not a full-book reading or a fresh transcription/collation of all square images.
- **Observed qualification:** the Mars prose says “square of four”, then describes twenty-five numbers, five on each side, line sum 65 and total 325. Record the internal inconsistency; retain the existing tested 5×5 table without claiming a new textual correction.
- **Independent access attempt:** the University of Michigan EEBO II.22 URL `https://quod.lib.umich.edu/e/eebo/A26565.0001.001/1:16.22?rgn=div2&view=fulltext` returned HTTP 403. No reading or verification is claimed for that endpoint.
- **Rights:** the historical editions are public-domain sources. No modern copyrighted annotated edition or translation was copied. The digital host and edition remain identified.

The selected prose gives line sums and totals consistent with the inherited arithmetic: Saturn 15/45, Jupiter 34/136, Mars 65/325, Sun 111/666, Venus 175/1225, Mercury 260/2080 and Moon 369/3321. Numerical consistency does not establish historical plate identity or ritual efficacy. The existing Latin/Hebrew letter paths remain labelled modern reconstructions; the intention-wheel and radial rosette remain contemporary art methods.

### Accepted implementation contract

`inspectSigilRecipeJSON(text)` accepts at most 512 KiB of UTF-8 JSON. It validates the version, supported numeric primitives, finite bounds, named palette, source records and field allowlists. It accepts no supplied SVG or HTML. Unknown primitives/attributes, duplicate source IDs, credentials in source URLs and malformed or oversized files fail before rendering.

The independent “Replay a saved recipe” panel renders only validated numeric primitives. Imported SVG includes a locally generated **unverified-file provenance** annotation and unique accessible IDs. Its drawing geometry matches the stored recipe; its provenance metadata deliberately differs from an ordinary locally generated SVG. The existing generator and default reproduction remain byte-reproducible.

The replay panel can download SVG, PNG and a new validated public JSON recipe. The export removes `privateInputs` and `privateStudySetup`; numeric paths and file-supplied source text can still disclose information. It is not an anonymity guarantee. Source labels are displayed as plain unverified file data, without fetching them.

Default public recipes replay their geometry but cannot recover the phrase, full controls or observer. For a file containing private inputs, the engine regenerates the drawing and compares its actual rendered geometry. Only matching inputs can be restored, and only after the user selects a separate consent checkbox. Supplied study prose is discarded; source context and study text are recalculated. The source-book selector is a reading lens, not a new historical construction method. Private export returns to off after restoration.

Invalid files and mismatched private inputs preserve the current drawing and controls. File edits, navigation, design edits during an asynchronous read and stale PNG callbacks cannot replace a newer replay or initiate its download. No model, network request, account, persistent storage or automatic upload is introduced.

### UI and API selectors

| Purpose | Selector/API |
| --- | --- |
| Select and inspect file | `#sg-recipe-file`, `#sg-recipe-inspect` |
| Status/error | `#sg-recipe-status`, `#sg-recipe-error` |
| Independent preview/provenance | `#sg-recipe-result`, `#sg-recipe-preview`, `#sg-recipe-caption` |
| Plain source records | `#sg-recipe-sources` |
| Export replay | `#sg-recipe-svg`, `#sg-recipe-png`, `#sg-recipe-json` |
| Explicit restore | `#sg-recipe-restore-help`, `#sg-recipe-consent`, `#sg-recipe-restore` |
| Pure inspection/restoration | `inspectSigilRecipeJSON`, `restoreSigilRecipeInputs` |

The public envelope remains `schemaVersion:1`, `kind:"sigil-drawing-recipe"`, `algorithmVersion:"1.0"`, with `mode`, `planet` (null outside planetary mode), named `style`, integer `seed`, bounded `geometry`, `sourceIds`, `sources`, `claimStatus` and `privacy`. Private exports additionally contain the two explicitly named private fields. This feature does not add an arbitrary markup import format.

### Executed validation

- Initial expanded pure suite: 14 groups passed. Independent R2 review increased this to 15, and the additional typed-palette regression below to **16 groups passed**.
- `node --check assets/js/app/sigil-studio.js` passed.
- Real Chromium run: **19 checks passed**, with real SVG/JSON/PNG downloads, successful consent-based private restoration, mismatched/invalid/oversized preservation, delayed file-read and PNG cancellation, distinct accessible SVG IDs, and no whole-page overflow at 320, 390 and 1365 pixels. Zero runtime errors and zero external requests. The 390-pixel screenshot was visually inspected.
- Runtime test input: 2026-10-29T12:00:00Z, 28.6139°N/77.209°E, Asia/Kolkata, Mars, Latin trace, `CLEAR INTENT`, seed 99, Newton reading lens and Hebrew civil calendar. The canonical engine normalized the zone to `Asia/Calcutta` and the instant to `2026-10-29T12:00:00.000Z`; the test was corrected to compare normalized values.
- Browser receipt: `/tmp/ensemble-symbol-browser-report.json`; screenshot `/tmp/ensemble-symbol-import-390.png`. Five owned source files were hashed before/after and unchanged during that run. The later typed-palette change affects validation only; the browser receipt does not claim that later core hash was tested. Integration verification covers the final candidate separately.

## Round 2 — independent challenges and corrections

The AI-explanations member found that a nonplanetary recipe could carry an arbitrary object in `planet`; this was escaped data, but it violated the strict public-field schema and could preserve undeclared private metadata. Accepted and fixed: nonplanetary `planet` must be null; planetary mode requires one of seven names. Regression probes reject nested objects, strings, arrays and numbers in intention/mandala recipes and verify the private sentinel is absent from accepted output.

A follow-up local schema audit found that JavaScript property lookup coerced `['ink']` to a palette identifier. Both generation and import now require a string palette. Tests reject coercible arrays, nested arrays, objects and numbers. The pure suite passes 16 groups after these corrections.

For the independent review of AI explanations, inspected `calendar-study-packet.js`, `calendar-assistant.js` and the MCP additions. The guidance path recomputed canonical rules, preserved edition/verification qualifications, excluded private recipe/phrase fields and temporal-hour context without location, and produced equal geocentric packets for different observers. The ten-group packet suite passed at review time. One inherited boundary defect was reproduced: opt-in location packets copied caller-supplied civil-row text/method under calculated provenance. A private sentinel and false primary-source assertion survived. The owner changed this to canonical civil-row recomputation. Independently repeated the exact forged text/method case for location-only and location-plus-guidance packets: both equal the genuine canonical packet and exclude the sentinel. This R2 correction was accepted on packet SHA-256 `ddcdb60eee7d3f71b608d04fbaea1afbe0da09e2f7ea4daba556c0c76bd8ed90`.

Reviewed AI candidate hashes: packet `1852b90e9f384f11af2886eb5e582b3651c4db3b44a8d412620b6b9e008204b3`; assistant `33111c9a121276c32a183081839e6f902bc6e481de8e3ecb6244154af2fab318`; MCP toolkit `6e439e3780026f61a93a41cf09a904f53c223f1b75c9b3826e8c73281c2fd290`.

## Round 3 — final retest

**ACCEPT** the bounded recipe replay/restoration and corrected AI handoff for their disclosed implementation scope. No blocker remains in this member's review. After the formal R3 trigger, reran `node scripts/tests/sigil-design.mjs` (**16 groups passed**) and `node scripts/tests/calendar-study-packet.mjs` (**11 groups passed**). Re-read the canonical civil-row recomputation; it uses validated explicit context and no longer copies caller-supplied rows. The R2 exact-case independent forgery retest remains passing on the held packet hash. No product changes or additional browser process were made during R3; the UX member runs the final integration browser suite.

Held source hashes:

| File | SHA-256 |
| --- | --- |
| `assets/js/core/sigil-design.js` | `db83e4f81a6f17c447275068806d42cb39ff1f08ef8af8bdad92f49c6928e190` |
| `assets/js/app/sigil-studio.js` | `10fb9ba30096fa50804036af60de77c9ffb057579f50aa890c03ac1c96e9b3ea` |
| `assets/css/sigil-studio.css` | `8acac5fd025004f187be51741c5b75e2785c7b008d8711f05052f949ab14fb75` |
| `pages/sigil-studio.html` | `a0ede50812ab57f8ae18479a0f7f88f28b0efb5f065b44ba6c725202e33e5a57` |
| `scripts/tests/sigil-design.mjs` | `097499099dac80e059e98637b85594e9b839fc1c2ff9db5d64624f6f23b8e3a4` |
| `assets/js/core/calendar-study-packet.js` | `ddcdb60eee7d3f71b608d04fbaea1afbe0da09e2f7ea4daba556c0c76bd8ed90` |
| `assets/js/app/calendar-assistant.js` | `33111c9a121276c32a183081839e6f902bc6e481de8e3ecb6244154af2fab318` |
| `mcp/toolkit.mjs` | `6e439e3780026f61a93a41cf09a904f53c223f1b75c9b3826e8c73281c2fd290` |

Remaining limits are intentional and visible: file-source authenticity is unverified; numeric geometry can reveal phrase information; reconstruction is not a unique inverse of a phrase; imported public recipes cannot recover omitted inputs; only selected Agrippa prose was newly read and the EEBO access failure remains; no complete manuscript collation, historical-author participation, empirical magical validation, model inference or remote account connection is claimed. Final browser receipts, CI and publication are recorded by the release coordinator rather than inferred from this specialist acceptance.
