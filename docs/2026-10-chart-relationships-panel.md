# Chart relationships — review ledger

Baseline `bf27046dd646ac1f7cc25db8770e8dd00ecbb0de`. Six independent AI-agent roles and the integrating root review source semantics, design, primary/secondary chart integration, verification and performance. This is model-agent review, not a human study or professional endorsement.

## Round 1 — inspected baseline and implementation

Root and the design role inspected the actual previous live atlas PNGs at 390/1440px. All roles inspected the current code and applicable source/state contracts.

| Finding | Evidence | Decision and owner | Observable acceptance |
| --- | --- | --- | --- |
| All selected-body aspect connectors share one thin copper dashed treatment. | sky-explorer zodiac renderer and actual atlas images | Shared type color/pattern vocabulary; emphasize a chosen pair and both endpoints / UX and atlas | Five geometry types distinguishable by labels/patterns; pair emphasis keeps exact positions unchanged |
| Ring controls use the full index while SVG colors use a filtered index. | renderAlignment versus zodiacSVG | Stable ring-ID colors / atlas | Hide/reorder/re-enable rings without color/legend drift |
| Selected overlay metadata does not distinguish the eight actually drawn rings. | Existing SVG metadata/render cap | Preserve prior field and add drawn IDs / atlas | Export distinguishes selected and rendered layers |
| Geometry, Lilly moieties, reception and directed Vedic rules have different meanings. | Canonical source modules and independent probes | Pure adapter with distinct methods and explicit qualifiers / domain | No universal good/bad score; stable method-specific IDs and direction |
| Legacy exact/static Lilly results can report separating even at a strict zero deviation. | Canonical aspectBetween probes | Preserve legacy flags as diagnostics; show exact/steady/unknown semantics explicitly / domain | Exact and static fixtures do not claim physical motion apart |
| Public Vedic ayanamsa is rounded while actual sidereal longitudes use full precision. | Independent canonical probes; initial rounded-field probe rejected | Use actual held sidereal planet rows once / page role | No reconstructed or twice-subtracted coordinate shift |
| Country sensitivity wheel contains cusps, not held planetary pairs. | countryHousePlateSVG and sample schema | Retain cusp-only scope and explicit pair-support explanation / page role | No fabricated planetary/contact data or unknown-time natal claims |
| Hovering through the existing full body-selection path would recalculate readings. | selectBody/refresh state paths | Separate presentation callbacks and one current-frame calculation cache / atlas, UX, page roles | Repeated hover/filter stress causes no ephemeris/worker/storage/network calls |

## Round 2 — independent challenge and corrections

The independent reviewer tested canonical results across 1900, 2026, 2060 and 2100, wrapping/boundary fixtures, receptions and directed contacts. Nineteen canonical checks, ten adapter checks (including 1,000 deterministic repetitions) and three strict-orb follow-up checks passed after correction. The QA role's separate numerical suite passes thirteen groups spanning 180 synthetic cases. These counts describe their own fixtures, not independent astronomical validation.

| Demonstrated finding | Correction | Evidence / remaining check |
| --- | --- | --- |
| A numeric consistency tolerance could widen the authoritative aspect allowance. | Reject supplied orb values strictly above the declared allowance; retain tolerance only for copied numeric consistency. | Independent exact/outside/inflated-allowance probes pass. |
| Owner teardown during a callback could be followed by further callbacks. | Stop dispatch when the component is destroyed, including reentrant teardown. | Static review; explicit browser regression added. |
| Recasting while overlays remained on could bind the previous alignment to a new sky. | Clear held alignment before the first new-frame relationship sync. | Strict adapter rejects cross-frame mixes; actual recast regression added. |
| Restoring SVG focus after Escape could immediately recreate a preview. | Guard the programmatic focus restoration. | Static review; keyboard regression added. |
| A long expanded title overflowed the 320/390px fixture. | Allow the title flex child to shrink and wrap; keep the Clear target available. | Failed development receipt retained; corrected held browser run passes. |
| Existing country pages use some of the new component's short CSS class names. | Scope shared selectors to the relationship component. | Root collision search; all 117 selector branches scoped and held integration passes. |

The page-integration role's corrected development run passed 167 checks at 320/1440px for Timeline, Newton, Eschatology and country views, with zero runtime or missing-resource errors. Root directly inspected the actual tropical chart, narrow inspector and country sensitivity images. The first temporary driver had correctly encountered Newton's closed details; the driver was corrected to expand that existing control. Development runs during concurrent source edits remain diagnostic.

## Round 3 — held verification

The all-phase development run exposed a mobile select specificity conflict with Timeline host CSS; the scoped mobile rule now preserves 16px controls and 44px targets. A forced-colors test initially assumed keyboard focus modality after pointer use; its action sequence was corrected to actually press Tab, retaining the visibility assertion. Independent page review also strengthened tests to check connector endpoints rather than just finite paths, pin a real pair before invalidation, and assert Timeline's actual destroy-on-dirty contract. Failed receipts remain retained.

The frozen candidate passed 325 browser checks across eleven journeys, 320/390/1440/1920px fixtures, touch emulation, 200% CSS zoom and forced colors. Two hundred presentation transitions held the row count at eight and triggered no fetches or workers. This single run measured 34.8ms for that fixture; it is not a general device performance guarantee. Fifteen actual gzip-retained downloads and twenty-two PNGs accompany the receipt. Root directly inspected all twenty-two images and independently validated all compressed/expanded download bytes and parsed their JSON/SVG. All 541 source/driver manifest entries matched before, after and at root review.

Receipt: `/workspace/setup-validation/chart-relationships/qa-held-1/receipt.json`; SHA-256 `d4c7612bd428c753d228f6cf224db3e32be3beef45af2347735952368e6d7cc2`. Root audit: the same directory's `root-independent-audit.json`. The separate pure suite passes thirteen groups / 180 synthetic cases. See the verification record for the broader inherited gates and publication state. These are local results; no new CI or live deployment is inferred from them.


### Release follow-up — nested disclosure regression

Actual PR CI found an old Newton test selecting every descendant summary after the inspector introduced its own disclosures. The test now selects the outer direct child; its assertions and action are unchanged. A read-only audit found no analogous collision in the other affected drivers. All 1,294 Newton checks and 631 source-atlas checks pass locally after this test-only correction. The original failure, skipped later steps and actual artifacts remain retained rather than being counted as successful CI.
