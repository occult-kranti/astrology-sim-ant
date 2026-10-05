# Domain methods, source review and bounded improvements

Research and implementation date: **2026-10-05 UTC**. Repository: `occult-kranti/astrology-sim-ant`, branch `feat/live-studio-mcp-2026-10`. This is the domain-method panel's contribution to the [release roadmap](2026-10-05-live-studio-roadmap.md). It distinguishes reproducible calculations, historical rule systems and contemporary designs. Numerical consistency is not evidence of divinatory or ritual efficacy.

## Evidence and research scope

The panel inspected existing chart, election, Vedic, planetary-hour, Hebrew, kamea, yantra and Rasa modules and their tests before proposing additions. A separate read-only symbolic audit checked numerical grids, letter references and source warnings. Five diverse Exa searches returned 25 candidate hits; these are discovery results, not 25 validated authorities. Direct source reading covered Agrippa's two relevant chapters, Spare's text transcription, the official Jagannatha Hora site/features, the Picatrix publisher and a mathematical navagraha presentation. Search snippets alone did not establish method authority. Sources below were read on 2026-10-05 unless explicitly marked as inherited references.

| Source | What it supports | What it does not establish / rights |
|---|---|---|
| [Agrippa, *Three Books*, II.22](https://www.esotericarchives.com/agrippa/agripp2b.htm) | Seven planetary number tables, orders 3–9, their row/column constants and totals; inspectable historical attribution | Not a universal method for every later Latin/Hebrew path transform. Historical translation and modern editorial transcription/notes have different rights; no modern plate copied into the new renderer. |
| [Agrippa, *Three Books*, III.30](https://esotericarchives.com/agrippa/agripp3c.htm) | Hebrew letter-number classes, nine chambers and characters assembled from letters | Does not prove that an arbitrary digit-reduced modern path is a facsimile of a historical seal. Cite chapter and disclose the selected reconstruction. |
| [A. O. Spare, *The Book of Pleasure* (1913), text transcription](http://www.chaosmatrix.org/library/chaos/spare/pleasure.txt) | Describes sigils made from simplified combined letters and monograms of thought | Text transcription omits the illustrated plates. It does not establish compulsory vowel/remnant/repeated-letter removal as Spare's universal rule. No artwork or extended text imported; edition/territory rights must be checked before redistributing images. |
| [Jagannatha Hora official features](https://www.vedicastrologer.org/jh/features.htm), [official homepage](https://www.vedicastrologer.org/jh/) | Real implementation offers multiple ayanamshas, node models, varga variants, sunrise definitions and day-boundary conventions | Freeware availability is not a reusable open-source license. Our approximation choices are not numerical equivalence to JHora. Search results at similarly named domains are not evidence of affiliation with P. V. R. Narasimha Rao's official project. |
| [Penn State University Press, *Picatrix*, Attrell/Porreca edition](https://www.psupress.org/books/titles/978-0-271-08213-4.html) | Modern scholarly translation based on Pingree's Latin edition and a complex textual transmission | Does not specify this application's numerical weights, green/amber/red thresholds or 11 named-aim groupings. Modern translation is copyrighted; cite/paraphrase rather than import protected passages. |
| [G. P. H. Styan, magic-square presentation, 2012](https://www.math.mcgill.ca/styan/Beamer1-18jan12-opt.pdf) | Inspectable modern mathematical presentation of planetary/navagraha squares and the composite total 729 | A modern printed arrangement is not proof of one ancient universal religious design. Promotional religious claims appearing in a slide are not mathematical evidence of outcomes. No slide artwork imported. |
| [Kaṭapayādi overview](https://en.wikipedia.org/wiki/Katapayadi_system), inherited repository reference | Existing consonant table, right-to-left rule, common musical prefixes and the quoted π mnemonic | Secondary reference, not a newly inspected critical edition. The current change repairs Unicode equivalence; it does not settle historical dating, every regional orthography or every encoding convention. |
| [Astronomy Engine documentation/source](https://github.com/cosinekitty/astronomy), inherited vendored engine | Local deterministic celestial positions and solar rise/set, MIT license | Upstream model target is not a proof of every downstream astrological rule. Existing independent position/house fixtures remain in [calculation methods](2026-10-calculation-methods.md). |

No new calculation dependency, proprietary asset or copied source implementation was added by this domain lane. Mathematical facts and small test examples are attributed. Existing data-file citations remain visible. The full application's third-party/license inventory remains authoritative for bundled code.

## Capability and decision matrix

Priorities: P0 incorrect/broken core behavior; P1 requested central workflow; P2 valuable sourced extension; P3 speculative or unvalidated expansion. “Existing” describes inspected code, not blanket independent validation.

| User task / tradition | Existing module and actual capability | Current decision / priority | Inputs, method, validation and limitations |
|---|---|---|---|
| Inspect a Western chart | `core/astro.js`, aspects, chart pages: tropical apparent geocentric positions, Regiomontanus/Placidus/Whole/Equal houses, comparisons and unknown-time flow | Preserve and reuse, P1 | UTC instant, geographic degrees, explicitly chosen house system. Existing independent Astrodienst planet and Swiss house fixtures; unknown birth time cannot justify a precise ascendant/house. |
| Choose a planetary day/hour | `core/planetary-hours.js` already supplied a sunrise interval; `election.js` and `app/rasa.js` incorrectly used UTC weekday in consumers | **Fixed**, P0 | Reuse the local weekday of the preceding sunrise. Explicit IANA zone preferred, then offset hours east, then disclosed longitude/15 mean-solar fallback. Polar missing interval stays unavailable. |
| Compare historical electional conditions | `core/election.js`: 11 named aims, essential/accidental conditions, mansion/phase, fixed-star contacts, interval scan | **Improve existing**, P0/P1 | One astronomy engine; scan bounded before ephemeris work. `scoreMethod` explicitly labels editorial weights/mappings/thresholds, not a canonical Picatrix/Lilly algorithm, probability or guarantee. Regional/textual variations remain. |
| Draw planetary kameas | `core/kamea.js`: seven tables with orders 3–9; number paths from text | Preserve validated arithmetic; shared renderer/symbol contract assigned to graphics lane, P1 | Independently check bijection 1…n² and both diagonal/row/column sums. Agrippa II.22 anchors numerical attribution. A path is method-dependent, not an authoritative historical seal. |
| Trace Hebrew letter values | `core/kabbalah.js` already supplies standard and final-letter-expanded values | Compose existing values with a disclosed kamea reduction in graphics lane, P1 | Preserve final-letter convention and full trace. `אחד=13`, `אהבה=13`, `חי=18`, `יהוה=26`; standard `אמן=91`, expanded finals `אמן=741`. Digit reduction is a selected reconstruction, not a primary-source facsimile. |
| Use modern Latin sigil paths | Existing A1Z26 and AIQ-style numerical paths | Preserve with explicit normalization/rejected characters and source labels; graphics lane, P1 | Actual letter mapping, original values and reduced cell values should be inspectable. Unsupported alphabets must not silently disappear. |
| Inspect Indian number squares | `core/yantra.js`, `data/rasa-data.js`: nine 3×3 navagraha forms, Chautisa and Varāhamihira grids | Preserve, reuse arithmetic validator, P1 | Navagraha constants 15…39 in steps of 3 and total 729 refer to this modern printed family. Not interchangeable with Western planetary assignments. Chautisa has unique 1…16 and opposite pairs 17; Varāhamihira grid is not a normal unique 1…16 square. |
| Decode Kaṭapayādi | `core/yantra.js`: IAST clusters, last consonant before vowel, right-to-left digits, string precision | **Fixed NFC/NFD equivalence**, P0 | Normalize to NFC before tokenization; retain original input in output. Only the existing IAST convention is supported. Sanskrit-script transliteration and regional variants are separate work. Musical examples use the first two syllables, not an entire rāga name. |
| Inspect Sarvatobhadra | `app/rasa.js`, `core/yantra.js`: 81 cells, graha placements, tithi groups and computable vedha reconstruction | **Fixed weekday/offset consumer and visible source warnings**, P0 | The same pañcāṅga vāra drives the grid and summary. Ring-2 consonants and weekday↔tithi mapping remain explicitly weakly sourced. No geometry silently changed. |
| Study Vedic charts/strengths | `core/vedic.js`: linear Lahiri approximation, whole-sign houses, mean nodes, instant pañcāṅga, vargas, Vimśottarī, Aṣṭakavarga and six-fold strength components | Preserve; **remove unvalidated JHora equivalence/ranking claim**, P0 | Existing conventions: Vimśottarī uses 365.2425-day years; strength uses declared speed/declination/year-month-lord/benefic simplifications. Reference fixtures do not establish full JHora parity or invariant ranking near ties. |
| Compare calendar/practice traditions | Existing calendar/calculator pages, Vedic practice descriptions, Buddhist/Jain and historical material | Preserve and cross-link; do not replace with a universal ritual output, P1 | Calendar calculation is distinct from locally observed dates, authority decisions and prescriptive practice. See [calendar methods](2026-10-calculation-methods.md) and release research for method-specific limits. |
| Work at a live or frozen instant | Scattered calculators previously resolve time independently | Shared calculation context and Live Symbol Studio assigned to integration lanes, P1 | UTC instant, location, zone/fold, house/ayanamsha conventions and selected method must travel together. Refresh calculation by clock interval, not animation frame. Frozen outputs retain exact provenance. |
| Use results through MCP | Browser assistant schemas existed, not a complete server protocol | Bounded read-only wrappers assigned to lead/backend, P1 | Reuse the same core functions and limits; validate all enums/text/numbers, disclose method/source/engine context; no implicit transfer of saved birth records or chat. Remote hosting is separately evidenced, not implied by Pages. |
| Generate letter-monogram art | No validated universal historical procedure | P2 bounded contemporary design, only after explicit transforms and renderer tests | Label as contemporary art inspired by a tradition. No invented “recognition,” potency score or hidden mandatory letter deletion. |
| Draw a traditional Śrī Yantra / alter Sarvatobhadra geometry | Insufficient plate-level validation for a new construction or an orientation correction | Defer geometry changes, P2 | Need named edition/plate, coordinate/intersection and orientation checks; do not label arbitrary intersecting triangles authentic. Sarvatobhadra front-reflection semantics need an authoritative plate before correction. |
| Automatically “calibrate” spiritual efficacy or rectify a birth time | No empirical calibration target in these engines | Exclude outcome claim, P3 | Supported calibration means checking inputs, astronomical references and rendering/method conventions. No hidden adjustment toward a desired personal outcome. |

## Corrected method contracts

### Sunrise day and consumer consistency

`electionScore(chart,key,opts)` and `rankNow(chart,opts)` now obtain day ruler from the same `planetaryHour` result used for hour ruler. Options override chart `timeZone`/`utcOffset`; IANA zone takes precedence over offset. If neither exists, `weekdayMethod` identifies the local mean-solar date. A supplied `planetaryHour: null` means already-computed unavailable timing, not permission to invent a UTC weekday. Missing sunrise-bounded intervals produce a caution with zero timing score and `hour: null`.

Returned election hour metadata includes weekday index, weekday method and sunrise. `scoreMethod` describes editorial weighting. Consumers should show that method next to an election score; the domain module does not claim that the legacy interface already renders every newly returned field.

Rasa's explicit-offset form carries the offset into the tropical chart passed to `castVedic`. The computed `panchanga.vara.lord` determines the highlighted weekday; the summary and grid therefore cannot disagree about UTC versus local sunrise. Blank/nonfinite/out-of-range coordinates or offset block output and clear prior results. At polar unavailable dates, tithi and astronomical positions may still be shown; no weekday cell is assigned. A cell can still be highlighted for its independently calculated tithi group. The existing ring-2 and weekday/tithi source warnings are both shown under the grid.

### Bounded election searches

Both `findNextElection` and `nextAuspiciousTime` use the exported frozen `ELECTION_SCAN_LIMITS`:

| Field | Accepted range / default |
|---|---|
| `hoursAhead` | Finite numeric 0…168. Defaults: 72 for election, 48 for next-improvement. |
| `stepMinutes` | Finite numeric 1…1440. Defaults: 30 for election, 20 for next-improvement. |
| Sample budget | `floor(hoursAhead × 60 / stepMinutes) + 1 ≤ 2048`, including the initial sample/baseline. |
| Start/location | Valid JavaScript `Date`, finite latitude −90…90°, longitude −180…180°; finite Date end. Existing ephemeris/date accuracy limits still apply. |
| Clock context | Valid IANA zone when supplied; finite numeric offset −24…24 hours. This broad legacy offset range is an input convention, not a claim every value is a current legal civil zone. |

Invalid range or clock input raises `RangeError` before any scan. Zero hours is a valid one-instant election; the next-improvement function has no later sample and returns `null`. Steps never run past the requested horizon. A cached single-instant hour is ignored during a multi-instant scan. Existing unknown operation keys still return an immediate empty array for compatibility; new public/MCP wrappers should reject them using the existing operation enum. These scans sample a coarse grid: they do not solve exact opening/closing boundaries or promise the globally optimal instant. An empty scan remains “no sampled qualifying result,” not proof that no interval exists.

### Text and strength claims

Kaṭapayādi now normalizes NFC before matching multi-character IAST consonants. Original input remains retained; digit strings avoid precision loss. The rules and original reference vectors are unchanged. This is a Unicode consistency fix, not broader transliteration support.

Ṣaḍbala component formulas, numerical output and ordering are unchanged. Its note now names this implementation's approximations and states that numerical equivalence to Jagannatha Hora has not been validated. Approximation/convention choices can affect rankings near ties or thresholds. Existing three-chart byte pins previously included inaccurate explanatory prose: restoring **only** that prose reproduces all three old hashes exactly (`7f622ad2070d575f`, `4b08d8c2c3208782`, `6472c9a3e603c194`). The test now pins every remaining field while excluding only `note`; this preserves the calculation regression gate.

## Verification and remaining uncertainty

`node scripts/tests/symbolic-methods.mjs` passes **11 groups**, using production core code and a minimal-DOM execution of the actual Rasa controller. This is a headless integration check, not a screenshot/browser test.

| Reference/regression | Expected result and boundary |
|---|---|
| Tokyo 2026-01-07 23:00 UTC, +9 | Local Thursday after sunrise: Jupiter day; UTC is still Wednesday. All ranked operations share it. |
| Tokyo 2026-01-07 20:00 UTC | Before Thursday sunrise: preceding Wednesday/Mercury day. |
| New York 2026-10-06 01:00 UTC, −4 | Monday evening: Moon day despite Tuesday UTC. |
| Delhi 2026-10-05 05:30 local, +5.5 | Before sunrise: preceding Sunday vāra; the actual Rasa summary and weekday cell agree. |
| Apia 2026-10-05 00:00 UTC, +13 | Monday civil sunrise day; longitude/15 alone would use Sunday. Explicit offset/zone wins in scoring, scans and Rasa. |
| Svalbard 2026-06-21 noon UTC | Polar continuous daylight has no complete sunrise/sunset interval; null timing, zero timing score, no invented weekday. |
| Kaṭapayādi `śa`, `ṣa`, `dhīra`, `meca` | Exact values 5, 6, 29, 65 for NFC and NFD. Values are fixed table/mnemonic references, not decode→encode round-trip-only evidence. |
| Quoted π mnemonic | Exact string `314159265358979324` for NFC/NFD; no JavaScript integer rounding. Inherited secondary textual reference, not a critical-edition claim. |
| Scan invalid/work-limit fixtures | Zero/negative/nonfinite/string/oversized steps and horizons rejected; excessive sample count rejected before work; zero horizon preserved; no end overshoot. |
| Rasa source/error states | Both inherited source warnings visible; invalid/blank offset cannot become UTC; polar partial results are labeled. |

The weekday expectations are independent Gregorian/civil-day facts and intentionally well away from sunrise except the explicitly pre-sunrise cases; they catch the UTC-consumer bug, not independent minute-level validation of Astronomy Engine's solar event model. Existing `scripts/tests/2026-10-calculations.mjs` also passes **15 groups**, including six independent Astrodienst positions (<0.02°), 72 independent Swiss house cusps (<0.001°), DST/gaps, unknown time and polar boundaries. Astronomy references and tolerances are recorded in [calculation methods](2026-10-calculation-methods.md).

`node scripts/engine-test.mjs` completed with **all passed**, including the revised numerical strength pins; all four changed application/core JavaScript files also pass `node --check`. Browser/mobile integration and final deployment are lead/QA release gates; no local headless result is described as deployed. No new performance claim is made for this lane. The mathematical squares retain their existing geometry; historical Sarvatobhadra orientation, full JHora parity, all regional practices and ritual effectiveness remain unverified, not silently inferred from passing tests.
