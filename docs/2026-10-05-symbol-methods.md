# Live symbol methods and export contract

Implemented and reviewed **2026-10-05 UTC**. The Live Symbol Studio, historical kamea page and MCP adapter share `core/symbols.js` and `core/viz/symbol-svg.js`. These modules are deterministic, DOM-free and network-free. They do not introduce an ephemeris, a general algebra parser, a mandala construction tradition or a second set of historical tables.

## Inputs, identities and bounds

`createSymbolResult({kind, planet, text, method})` supports:

| Kind | Catalogue choices | Method IDs | Default |
|---|---|---|---|
| `kamea` | Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon | `latin`, `aiq`, `hebrew-standard`, `hebrew-gadol` | Saturn, `latin`, empty text |
| `yantra` | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu | `navagraha` | Sun, `navagraha`, empty text |

Planet names match the existing catalogues; yantra also accepts the existing Sanskrit aliases. Canonical output planet names are English catalogue identifiers. Arbitrary planet names, methods and unsupported combinations fail explicitly. Empty name input produces **square only**, with `trace: null`. Punctuation-only text fails instead of pretending to produce a sigil. Navagraha mode does not invent a name-tracing method.

Text is limited to **256 Unicode code points**, at most **256 letter trace records**, and the existing squares have orders 3–9. The renderer accepts 240–2048 viewBox units and an integer construction step from zero to the number of collapsed path steps. Invalid, nonfinite or out-of-square coordinates fail before serialization. These limits also bound MCP output and playback work.

## Alphabet normalization

Input is normalized to NFC. Latin methods accept **ASCII A–Z**, converting lowercase letters to uppercase. Hebrew methods accept the existing 22-letter table plus its five final forms. Whitespace and punctuation are ignored with explicit records; Hebrew vowel/cantillation marks are likewise recorded and ignored. Foreign letters, digits, symbols and guessed transliterations are rejected. Accented Latin names require an explicit user-supplied A–Z spelling rather than an invented transliteration.

The result carries `{original,nfc,alphabet,normalized,changes,unsupported}`. Unsupported-input errors carry the same details, plus a stable `.code`. The UI retains the entered text and disables stale exports. A normalization record's index is a code-point index in the NFC string. Hebrew tracing follows **logical input order**, not a visual reversal introduced by right-to-left display.

## Values, reduction and historical scope

- `latin`: A=1 through Z=26. This remains the existing **modern Latin adaptation**.
- `aiq`: the existing Latin analogue of the 1–9 / 10–90 / 100–800 ladder. It is not relabeled as authentic Hebrew text.
- `hebrew-standard`: uses `core/kabbalah.js` `gematria()` and its sourced alphabet. Finals retain their medial values.
- `hebrew-gadol`: explicitly selects the existing variant where final forms count 500–900. It is never inferred from the word or selected silently.

For each letter separately, the shared `reduceToCell()` removes trailing powers of ten while the value exceeds the largest cell. If still out of range without a trailing zero, it sums decimal digits until in range. Thus **300 → 3** for Saturn's 1–9 grid, **300 → 30** for the Sun's 1–36 grid, and **45 → 9** for Saturn. The digit-sum fallback and full combined tracing procedure are disclosed as a **modern computational reconstruction**. Letter-value arithmetic does not authenticate a historical printed seal.

`sigilFromValues()` produces both the uncollapsed `letterTrace` and the collapsed `steps`. Consecutive visits to the same cell become one path step with a repeat count. The presentation uses a start circle, terminal bar and repeat wave. A partial playback frame does not display a terminal bar until the whole trace is shown. The word's total gematria is reported separately and is **not substituted for the sequence of letter values**.

The inherited sources are recorded per result:

- Agrippa, *Three Books of Occult Philosophy* II.22 and III.30, Peterson edition: <https://www.esotericarchives.com/agrippa/agripp2b.htm> and <https://www.esotericarchives.com/agrippa/agripp3c.htm>. Existing `data/kameas.js` retains its printing-error and reconstruction notes.
- The existing Hebrew letter table and final-value variant citations in `data/kabbalah-data.js`. No second alphabet table was transcribed for this feature.
- G. P. H. Styan, *An introduction to Yantra magic squares and Agrippa-type magic matrices* (2012), <https://www.math.mcgill.ca/styan/Beamer1-18jan12-opt.pdf>, as already cited in `data/rasa-data.js`.

These are inherited repository source transcriptions, not a claim that every original printed plate was newly collated in this release. New tests verify the computation and explicit reference cases below. No magical effectiveness, guaranteed outcome or universal tradition is inferred from a correct sum.

## Square validation and traditions

Kameas use `validateKamea()`: a bijection of 1…n², every row, column and both main diagonals sharing a constant. Navagraha uses the existing `validateYantra()` without imposing that bijection; its shifted integer sets are intentional. The nine navagraha plates are labeled **modern printed tradition**, not newly dated classical sources. Their planetary mapping differs from Agrippa's: the 3×3 sum-15 square belongs to Sun in this set and Saturn in the Western set.

No new classical square arrangements are invented. Existing historical entries with no asserted grid remain without one. No mandala or Śrī Yantra claim is made by these renderers.

## Result, rendering and playback

`createSymbolResult()` returns a serializable `schemaVersion: 1` object with canonical inputs, grid, validation, trace, normalization, method, source strings, limits, units, caveat and a text model. Grid integers are dimensionless; SVG coordinates use viewBox units.

`renderSymbolSVG(result,{size:480,traceStep:null})` returns `{svg,textModel,geometry,construction}`. `geometry.cells` and `geometry.trace` carry explicit finite coordinates; `construction` identifies visible and total path steps. `traceStep: null` renders the full result, while zero shows the square before tracing. Renderers do not own a clock or animation loop. UI playback is opt-in and must stop or settle when paused/hidden or reduced motion is requested. Calculation results remain independent of animation time.

SVG contains literal colors, title, description and JSON metadata with the actual inputs, method, sources, validation and construction frame. There are no CSS variable, network, external image, generated artwork or animation dependencies. Label text and metadata are XML-escaped through the existing SVG helper. The accompanying text model reports every row and every letter-to-cell operation.

## Export and saved-data recovery

The historical page and Studio reuse `app/state.js` for downloads. For attached diagrams, SVG export snapshots computed paint properties and removes page stylesheet dependencies while preserving geometric attributes. Already self-contained SVG can serialize without a live style context. Unresolvable styles fail explicitly. PNG uses the serialized SVG at scale 1–4, bounded to **16 megapixels**, with the existing parchment background. SVG and JSON retain methods; PNG is a raster graphic, so download its method JSON as the structured provenance companion.

The generic exporter does not invent a chart date from graphics. Chart callers attach the frozen shared calculation context's inputs/methods as SVG metadata or retain them in the matching JSON export. Changing an input must invalidate a prior snapshot before it can be presented as current.

Reading/person collections validate parsed JSON roots and individual records. Malformed roots become an empty list; valid siblings survive malformed entries. Read recovery is in-memory and does not overwrite the original storage. Saved reading states retain additive flat primitive fields, including zone/fold/sect keys. Invalid nested state records cannot break restoration. Person records require a string ID/name; calculation-specific date/location validation remains at the shared calculation boundary. Storage denial or quota errors preserve local calculations.

## Verification

`node scripts/tests/live-symbols.mjs` contains **11 passing grouped tests** for:

- The published Saturn grid `[[4,9,2],[3,5,7],[8,1,6]]`, standard `אחד = 13` and `יהוה = 26`, plus fixed row/column paths.
- Standard versus gadol final values and the independent reduction examples above.
- Existing GABRIEL Latin values and repeated-cell behavior.
- Unicode normalization, unsupported mixed alphabets, punctuation-only input and bounded work.
- All seven existing kameas and nine navagraha grids with source and method preservation.
- Fixed SVG reference centers, partial/full construction, escaping and deterministic serialization.
- Malformed collection roots, mixed valid/invalid siblings, retained timezone state, blocked storage and invalid export scale.

Browser screenshot, SVG-style and PNG raster checks are separate release gates; headless string tests do not prove their appearance. The broader engine suite and deployment evidence are recorded in the release verification document.
