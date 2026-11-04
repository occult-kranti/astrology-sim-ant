# Reading Lab: sources, worked examples and comparison limits

Updated 4 November 2026. This is a bounded study of nine named families, with selected numerical examples and selected textual methods. It does not cover every tradition, religious community, house system or possible reading. The source ledger records retrieval outcomes, byte hashes, passage locators, reading depth and rights notes; the browser data contains original paraphrases and factual reference values, not redistributed books.

## What the examples establish

A matched source field checks a calendar conversion, supplied-angle arithmetic or reconstruction of a printed figure. It does not establish the accuracy of an interpretation, a predicted event or an entire astrological tradition. Source values were transcribed before running the application comparison. Textual cases have no numerical expected fields and receive no numerical accuracy credit.

| Family / method | External example or selected passage | What can be checked | What remains outside this example |
|---|---|---|---|
| Egyptian civil / Coptic distinction | UCL Digital Egypt calendar structure and CopticChurch.net calendar explanation | Twelve 30-day months plus five additional days; distinguish later intercalation | No independently sourced ancient-Egyptian epoch conversion or personal horoscope |
| Maya | Smithsonian NMAI’s **20 December 2012** worked example | `12.19.19.17.19`, `3 Kawak`, `2 K’ank’in` | Other correlations, every community’s names, apocalypse claims |
| Lilly: solar proximity | *Christian Astrology* I, printed p. 113 | Sun 15°30′ Taurus, Mercury 15°25′ Taurus: separation 5′ and the printed cazimi category | Ephemeris accuracy, a complete horoscope or personal outcomes |
| Lilly: printed dog figure | Original 1647 scan, printed p. 392, archive leaf 426 | Four directly legible Sun, Moon, Mercury and Saturn positions | Remaining reconstructed fields, independent ephemeris accuracy and the author’s reported outcome |
| Lilly: disputed rule | Same book, pp. 113–114 | The prose 8°30′ combustion limit conflicts with the second 10° example | A fabricated consensus or silently repaired historical text |
| Christian computus | USCCB 2024 principal celebrations; CopticChurch.net 2024 feasts | Gregorian Easter 31 March; Coptic Easter 5 May | A universal Christian horoscope, community authority or predictive efficacy |
| Jyotiṣa: tithi | P. V. R. Narasimha Rao, Example 2, printed p. 14 | Moon 84°12′ minus Sun 227°46′, normalized to 216°26′; tithi 19, Krishna Chaturthi | Ephemeris testing, invented date/time, all schools or outcome prediction |
| Jyotiṣa: hora | Rao §1.3.11, printed p. 17 | Wednesday 21:40 with sunrise 06:10: running sixteenth hour, Moon ruler under the example’s convention | Validation of unequal daytime/nighttime seasonal hours without sunset |
| Chinese civil calendar | HKO official 2024 and 2023 PDF tables | 10 February 2024 month 1/day 1; 22 March 2023 repeated month 2/day 1 | Complete BaZi, electional rules, religious identity or favorable-day scoring |
| Hebrew civil date | Hebcal JSON converter | 3 October 2024 before sunset = 1 Tishrei 5785, with declared Intl spelling alias `Tishri` | Exact local sunset, Kabbalistic prescriptions or every observance policy |
| Hebrew religious boundary | Paired Hebcal JSON with explicit before/after-sunset flag | 2 October 2024 changes from 29 Elul 5784 to 1 Tishrei 5785 | Location-specific solar calculation; this case is textual, not scored |
| Dee | *Monas Hieroglyphica* body Theorems I–VI, Hamilton-Jones 1947 translation | Whether a description reflects the selected symbolic construction | A natal calendar, verified magical mechanism or proof of efficacy |
| Jung | *Psychological Types*, Baynes 1923, Definitions: Feeling pp. 543–545; Individuation pp. 561–563 | Valuation versus emotion; differentiation with collective relationship | Diagnosis, birthday-derived personality or validated psychometric score |
| Plato | *Republic* X 617d–618a/620d–621a; *Timaeus* 90a–d, Jowett | Choice/responsibility and philosophical cultivation of understanding | A numerical astrological Lot of Spirit or proof of a personal supernatural entity |

The Chinese leap-month flag is explicitly an inference from the official table’s repeated second-month sequence: February 20 and March 22 both start a second lunar month. The PDF text extraction does not separately spell out “leap.” This provenance is visible rather than attributing a nonexistent JSON field to HKO.

The Christian computus example sits within the historical-Western navigation family (`lilly`) but has its own `methodId`. It is neither derived from Lilly’s chart judgments nor presented as the doctrine of all Christians. Likewise, Coptic reform is distinguished from the ancient Egyptian wandering year, and a Hebrew civil-midnight conversion is distinguished from an evening religious-day boundary.

## A source comparison that found an actual error

The original 1647 scan of Lilly’s missing-dog figure was retrieved and visually inspected independently by the source, engine and QA agents. The inherited repository example described every planet as confirmed to the arcminute, but four directly legible printed positions disagreed with it:

| Body | Inherited reconstruction | Printed figure |
|---|---|---|
| Sun | 15°57′ Virgo | 15°45′ Virgo |
| Moon | 5°43′ Virgo | 4°10′ Virgo |
| Mercury | 12°03′ Libra | 12°20′ Libra |
| Saturn | 17°55′ Taurus | 18°15′ Taurus |

The new case first returned **0/4 matching fields**. The source ledger retains that before-state, the print-derived expectations, three independent visual reviews, and scan SHA-256 `0245b83baf50febaabeb17eb0acdf4375c2aac8b3cd319b9ca4e551e9fe2cbc9`. The completed correction is limited to the four unambiguous fields and the misleading provenance claim. The bounded comparison now returns **4/4 matching fields**. The remaining planet, cusp, house and speed values retain explicit reconstruction uncertainty. In particular, the apparent printed axes need further collation before being described as verified.

The header’s 29 August 1646 is Old Style (Julian), corresponding to 8 September 1646 Gregorian. This comparison does not recalculate a timed chart or validate Lilly’s reported recovery. A printed ephemeris position may itself differ from a modern ephemeris; faithful transcription and astronomical accuracy are different questions.

## How a practical reading is written

Each case identifies the input/convention, a named rule and passage, conditional everyday scenarios, questions, low-risk actions, support checks, refutation checks and limits. The practical scenarios are authored applications. They are not quotations, predictions or outcomes observed in the source.

For example, a difference between two Easter dates can affect attendance at a shared meal; the next useful action is to confirm the participants’ actual observance. A leap lunar month can cause an anniversary import error; retaining the leap flag prevents that ambiguity. Jung’s distinction between valuation and mood can structure a decision journal, but it cannot diagnose the reader. A historical astrological classification can be examined as a source claim while ordinary evidence guides consequential decisions.

Calendar agreement is not automatically independent evidence. Tithi, Moon phase and other lunar labels reuse the same solar/lunar geometry. Their dependence must stay visible when comparing traditions. No combined “good/bad” or danger probability is created from these examples.

## Mechanism notes for retrieval

`READING_METHOD_NOTES` supplies concise context for the local retriever, beyond individual example cards:

- Whole-sign houses begin at 0° of the rising sign; equal houses from the Ascendant begin at the actual Ascendant degree. A synthetic 18° Taurus Ascendant makes the distinction concrete without pretending to be a published birth example.
- Placidus uses semidiurnal and seminocturnal arcs. It is not twelve equal ecliptic sectors. High-latitude geometric limitations and any fallback must be labelled. The maintained Swiss Ephemeris manual was read; unsuccessful attempts to retrieve a second publisher are recorded, so independent corroboration is not claimed.
- Tropical 0° Aries is the vernal equinox. A sidereal zodiac selects a stellar reference and ayanamsha; precession changes the relation. A “fixed celestial equator” is not the definition. Swiss Ephemeris §2.8.1 and Rao §1.3.13 were read for this distinction.
- A calculation → named rule → conditional scenario → observation/action chain keeps factual and interpretive claims separate.

These notes are not model answer keys or hidden evaluation prompts. They are public source explanations. Evaluation questions and model outputs belong to the separate model-review lane.

## Retrieval units and bounded context

The corpus assigns a separate retrieval unit to each Reading Lab case, bibliography record and method note. Continuation chunks share that unit, so the existing two-chunk diversity limit applies to one record rather than this entire bundled JavaScript file. File hashes and original locations remain intact. Each unit also retains its bibliographic source IDs: two cases using Jung or Lilly are still dependent on the same underlying work, not independent corroboration. The manifest distinguishes source-file count from retrieval-unit count.

Retrieval tests check the actual returned passages for the named example or mechanism, alongside preserved source locators, rights, reading depth and scenario authorship. Every returned case carries an untruncated header stating that its scenarios, questions and actions are project-authored conditional exercises, not historical quotations or validated predictions, with its bibliographic IDs. A smaller evidence budget can still omit the needed case or a later limitations paragraph. Indexed availability alone does not mean every necessary passage reached a model. Inspect the selected excerpts and obtain the missing context before making a claim; a nearby calendar date or related historical rule is not an acceptable substitute.

## Retrieval and rights

The ledger includes successful and unsuccessful URLs. HTTP 200 by itself is insufficient: the guessed Chabad Rosh Hashana URL redirected to an unrelated Yom Kippur page, and several Astro.com articles returned a JavaScript preparation/challenge page. Neither was used as substantive evidence. USNO 503, Skyscript 403 and missing PDF 404 responses remain failed retrievals.

Only the specified sections were read. There is no claim to have read every book in full. The1947 English Dee translation has rights distinct from the 1564 Latin original; only original paraphrases are included. The author-published Rao PDF is not assumed to carry a training or redistribution licence. Jung’s 1923 English edition is public domain in the United States, with possible jurisdiction differences; its OCR is not bundled. The archive and other source files remain temporary research inputs outside the published application.

## Review rounds

1. **Baseline source audit:** extracted 16 public cases across 9 families, then compared the six cases with numerical/date expectations against the engine. All 18 listed reference fields matched. Ten textual cases were excluded from the numerical denominator. The source audit found explicit limits for Egyptian epochs, Hebrew sunset and historical worked-chart reconstructions.
2. **Correction and mechanism pass:** promoted Lilly’s genuinely printed cazimi example to a bounded arithmetic/category comparison; added the original dog-figure comparison, exposing four mismatches before correction; kept the contradictory combustion example textual; read the primary 1923 Jung definitions alongside the specialist interpretation; added the house/zodiac mechanism notes and rejected irrelevant HTTP 200/challenge responses. The source arithmetic adapter is separate from date/time charts.
3. **Acceptance review:** independent QA re-fetched nine source URLs and confirmed the selected calendar/textual passages, then independently agreed with the four dog-figure transcriptions. The final registered comparison contains **17 cases, eight with reference fields; all 24 listed fields match**. The dog case moved from **0/4 to 4/4** after the documented correction. Nine textual cases receive no numerical accuracy credit. Every case and method-note source ID resolves. Unverified dog angles, houses, sect-dependent dignity, motion flags and automatic judgment are withheld from the Reading Lab result; the partial reconstruction is not certified as a complete chart.

Reproduce the current registered comparisons with `compareReadingCases()` from `assets/js/core/reading-lab.js`. `scripts/tests/reading-lab.mjs` checks the engine; the source ledger and this report explain what those checks can and cannot establish.
