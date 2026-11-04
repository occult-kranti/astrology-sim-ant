# Astrocartography implementation and review

Baseline: `152587b91f33d4e37961c76e68ef7314ab683afc`, on `feat/desktop-astrology-workbench`. The requested addition is a global map dashboard for planetary angular lines, crossings and location comparison under declared chart and calendar methods. Existing routes, offline operation and private chart boundaries remain intact.

Six separate AI-agent lanes cover source/geographical data, canonical geometry, independent numerical review, interface implementation, protocol/chat integration and browser QA. Their reviews are engineering/source perspectives, not human practitioner certification or a claim that locational astrology predicts outcomes.

## Acceptance contract

- Calculate ten named solar-system bodies at an explicitly known chart instant, using the declared geocentric equatorial-of-date convention and matching apparent sidereal time, with the library’s separate lunar GeoMoon path disclosed. Show rising/setting and upper/lower meridian lines separately.
- Render actual licensed geographic outlines locally, with latitude/longitude graticules, body colors and redundant angle styles. Support map and keyboard location selection, zoom/reset and a table alternative.
- Calculate angular-line crossings and shortest spherical distance to the specified line branch. Opposite rising/setting branches and upper/lower meridian semicircles must never collapse into one distance. Label tangencies, polar degeneracy and omitted geometry honestly.
- Rank a bounded declared city catalogue by inspectable editorial purpose/proximity rules. A numerical relevance score is not a probability, a guarantee or a ranking of every place on Earth. Arbitrary coordinates remain available through the inspector.
- Recompute the selected place's relocated chart and named calendar readings at the same UTC instant. An IANA zone affects civil display and observance context, not the physical location of the planetary angular lines. A zodiac convention changes sign labels, not this geometry.
- Never invent a missing birth clock, automatically read saved profiles, persist personal inputs in URLs or send them to a provider. Calendar/philosophical frameworks without an astrocartographic rule remain explicitly distinct.
- Provide bounded exports, source/rule inspection, optional source-first chat and read-only MCP. Rebuild navigation, search, RAG and offline distribution only after source contracts settle.
- Complete numerical, independent, protocol, database/server where changed, focused browser, full engine, all-page, generator and ledger checks before the authorized branch push. Pages remains deferred by the user.

## Loop 1: contract and initial implementation

| Finding | Decision | Owner / acceptance |
|---|---|---|
| Calendar labels and astrology systems do not each imply a physical map of different planetary lines | Share one explicitly framed astronomical map and display named calendar readings separately for a selected place | Geometry/source lanes; same-instant and zone invariance checks |
| Infinite great-circle distance can incorrectly make opposite angular branches equivalent | Use branch-aware spherical geometry and test synthetic cases independently | Geometry and numerical QA |
| Broad “best place” language can hide arbitrary priorities | Expose purpose weights, radius, selected bodies and per-place contributions | Source/UI lanes; inspect the exact score ledger |
| Browser map libraries and live map tiles would undermine offline use | Use a compact licensed static land outline and local SVG rendering | Source/UI; network-blocked browser checks |
| Reusing a natal-only chatbot contract would invent chart inputs for a location comparison | Introduce an inputs-only astrocartography context union and recompute on the companion | Protocol/chat lane; forged context and mixed-branch rejection |

## Loop 2: numerical, protocol and interaction review

| Observed issue | Implemented correction | Evidence |
|---|---|---|
| A naive distance to an entire great circle conflates opposite angular branches | Retained midpoint-classified semicircles; explicit endpoint and pole handling | 65,545 canonical checks and 11,304 independent checks |
| Celestial-pole endpoints and near-parallel plane intersections could select arbitrary longitudes | Added limiting-longitude handling and explicit degeneracy diagnostics | JPL-backed and synthetic half-arc/dateline/pole assertions |
| Initial default compact exports exceeded their 24 KiB contract | Removed duplicated facts and declared bounded summary scope (six catalogue rows / twelve crossings); full browser study remains available | Default map 20,367 bytes and Greenwich place 22,884 bytes; maximal UTF-8/year/polar/purpose stress checks |
| A natal-only backend context would not describe the map or selected destination | Added a mutually exclusive inputs-only astrocartography context with canonical recomputation | 382 actual SDK HTTP/stdio checks and 146 companion HTTP/mock checks |
| A derived map score could be mistaken for chart dignity or a calendar consensus | Kept editorial score, relocated houses/dignity and calendar facts separate | Source ledger and final independent review |

## Loop 3: frozen acceptance and release integration

The independent browser review found and corrected a redundant radius blur calculation that swallowed the first export click, a retained non-UTC bookmark labelled UTC, and a decimal score wrapping over two lines. The exact-pole inspector now withholds arbitrary nearest-line interpretation. Each correction has a targeted browser assertion. Final acceptance passed **126 checks**, with no runtime errors, outbound requests or public-source mutations; final 320/1440/1920 screenshots were inspected.

The full 138-page sweep passed with zero errors and two inherited descriptor warnings; the engine gate passed 751 checks. Existing chat (83), Reading Lab (185), direct-open standalone (53), public RAG database (104), retrieval (40,382), MCP map protocol (382), companion HTTP (175) and authentication (124) checks passed. The server's range-boundary regression retains valid map distances when relocated calendar facts are unavailable.

Actual local tokenization initially rejected the two default map contexts. A declared server-only projection reduced them to 5,601 and 6,885 prompt tokens; with 512 output tokens and 32 reserved tokens, both fit the unchanged 8,192 window. All selected distances and available calendar facts are retained; omitted prose and duplicate bibliography are declared. This is a context-fit measurement, not generated-answer validation. The frozen model prompt and weights were unchanged.

The previous baseline CI revealed an authored site-design ledger missing Reading Lab. The ledger now registers both Reading Lab and Astrocartography in their existing observatory family. This corrects release coverage rather than weakening the route-count assertion. The full site-design gate is recorded separately after that correction.

Six coarse domain groups for R41 are explicit time/frame geometry, half-arc/crossing degeneracy, same-instant relocation, purpose-weight scope, source/calendar distinctions and independent ephemeris samples. Six tooling groups are map interface/accessibility, saved-chart/session/export flow, MCP, RAG/server context, verification and offline/CI packaging. These manually classified counts are unverified bookkeeping, not empirical accuracy. C1/C2 pass; C3 remains not evaluable without a new operational-graph census.

See [independent verification](2026-11-astrocartography-verification.md) and [release evidence](evidence/astrocartography/). Pages remains deferred. No hosted publication, universal astrological system, guaranteed relocation outcome or new model-training result is claimed.
