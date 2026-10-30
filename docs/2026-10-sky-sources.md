# Source-led sky interpretation — 30 October 2026

The new sky reading explains one recomputed moment through three explicitly named lenses: Lilly’s selected dignity and testimony conventions, Agrippa’s selected celestial conditions, and a Jyotiṣa lunar-partition view. A fact-led summary is followed by a source-linked ledger. The ledger contains computed inputs, thresholds, source identifiers, and limitations for each conclusion. There is no combined luck score, forecast confidence, automatic natal judgment, or complete electional judgment.

This is the source/interpretation member’s work in the six-agent panel, not human tradition-authority endorsement. Baseline: `fb656a8047e93b8d49227d92aa9edc3e9b1fce50`. Source reading and implementation are new work; inherited quality tables retain their earlier validation limits.

## What was actually read

Network requests used the environment’s inherited proxy and TLS verification. No blocked source was accessed through a bypass. Downloaded PDFs and full HTML are temporary research material in `/workspace/setup-validation/sky-sources/`, outside the repository. The repository stores original paraphrases, source metadata, and methods rather than redistributing books.

| Source | Selected material actually inspected | Scope and rights |
|---|---|---|
| [Lilly, Christian Astrology, Book I](https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf) | Printed pp.101–104 on essential dignities, Peregrine paragraph p.112, pp.113–114 solar proximity and motion, p.115 fortitudes table; selected examples, not every numerical table cell | **Modern transcription**, marked ©2003 World Astrology Network, of a historical work first published in 1647. Not a facsimile and not a fresh edition-wide collation. Original paraphrases only. |
| [Agrippa, II.29](https://esotericarchives.com/agrippa/agripp2c.htm#chap29) | Whole selected chapter: celestial positions, motions, aspects, observer relations, dignities, Moon/Mercury, planetary day/hour, broad solar conjunction warning | 1651 English “J.F.” translation, Peterson digital edition. Historical translation public domain; editor/host credited. Translator identity remains disputed. |
| [Agrippa, II.31](https://esotericarchives.com/agrippa/agripp2c.htm#chap31) | Whole selected chapter, including the greater Dog star’s “Venereal” attribution | Historical nature statements and historical degree positions are distinct from present-day astrometry. |
| [Agrippa, II.34](https://esotericarchives.com/agrippa/agripp2c.htm#chap34) | Whole selected chapter: twelve daylight/twelve night divisions and the competing 15° ecliptic-ascension convention | The latter alternative is described but not implemented. |
| [P.V.R. Narasimha Rao, Vedic Astrology: An Integrated Approach](https://www.vedicastrologer.org/articles/vedic_astro_textbook.pdf) | §1.3.6 pp.10–11, §1.3.8.1 pp.12–14 and Example 2, §1.3.11 p.17, §1.3.13 p.18; title and 2010 retrospective preface | ©author, first published 2000. Author-hosted free download is not an open model-training licence. The preface says concepts/calculations were subsequently refined. Original short factual paraphrases and arithmetic examples only. |
| [ESA/Hubble heic0516a](https://esahubble.org/images/heic0516a/) | Title, object description and Canis Major identification of Sirius | Supports the modern Dog Star name identification, not historical planetary natures or new coordinate validation. |
| [The Met astrolabe, object 444408](https://www.metmuseum.org/art/collection/search/444408) | Object metadata, instrument explanation and public-domain image designation | Yemen, 690 AH / 1291 CE; brass and silver. An instrument/art reference. The UI owner separately inspects the actual image; metadata reading alone is not visual inspection. |

The [Skyscript texts directory](https://www.skyscript.co.uk/texts.html) and [Astrodienst ephemeris page](https://www.astro.com/swisseph/swepha_e.htm) were retrieved for discovery only. No fresh numerical ephemeris fixture is claimed from their existence. A [Science Museum Group armillary-sphere search](https://collection.sciencemuseumgroup.org.uk/search/objects?q=armillary%20sphere) was retrieved as a design directory; it is not an inspected individual artwork or a calculation authority. An alternate Sacred Texts Agrippa page was retrieved but is not counted as an independently authored source or as fresh chapter-level collation.

Access failures retained: `https://www.skyscript.co.uk/CA/CA-I.pdf` returned 404; Skyscript `gl/combust.html`, `gl/cazimi.html`, and `temple1.html` returned 403; an attempted NASA `asset/hubble/sirius-a-and-b/` URL returned 404. These do not establish that the source is unavailable to everyone, only that these requests failed. The successful World Astrology Network transcription did not magically become a facsimile or resolve every textual ambiguity.

## Findings that changed the implementation

### A real source-versus-calculator difference

The newly inspected Lilly transcription states a **same-sign condition** for combustion, with the selected 8°30′ distance. Its beams and cazimi paragraphs give 17° and 17′ respectively. The existing `accidentalDignity` implementation uses separation alone and omits the combustion same-sign condition. The new reading does not rewrite all legacy calculators: `compareLillySolarConventions()` explicitly returns both `textualCategory` and `legacyCategory`, the actual separation, `sameSign`, thresholds, and a `differs` flag.

The synthetic example 29° Aries Sun / 1° Taurus planet is 2° apart. The named textual rule gives under-beams; the legacy angular-only rule gives combustion. It is identified as a **synthetic method example**, not a historical worked chart. Inclusive numerical bounds follow the existing table values; numerical uncertainty and exact-boundary limits remain visible.

The transcription itself also gives Jupiter at 28° and the Sun at 18° in the same sign as a combustion example. That is a 10° difference and conflicts with its stated 8°30′ rule. The new function follows the stated rule and **retains the inconsistency** in the source record and output. An independent period facsimile collation remains pending. This is not an assertion that every later astrologer uses the same same-sign rule.

The narrative keeps Agrippa II.29’s broad Sun-conjunction warning separate. That chapter gives neither the same numerical orb nor Lilly’s numerical cazimi exception. It would be misleading to insert Lilly’s exception into Agrippa or to classify a broad conjunction statement using an undisclosed invented threshold. The Agrippa row therefore reports the actual angle without an invented binary warning.

### Two calculated kinds of planetary hour

Rao §1.3.11 divides sunrise to next sunrise into **24 equal parts**. Agrippa II.34 reports **12 daylight and 12 night parts** and then describes a different ecliptic-ascension alternative. The new `compareSunriseHourConventions()` computes the first two methods from the same canonical sunrise boundaries and preserves:

- named method, ruler, ordinal hour and actual start/end;
- actual interval duration, which is not silently assumed to be 60 minutes;
- the common sunrise-day ruler and whether rulers/hour numbers agree;
- a polar unavailable result when the enclosing sunrise day cannot be computed.

The before-sunrise sample belongs to the preceding sunrise day. At an exact serialized sunrise instant, the canonical sunrise search can return unavailable because the physical solution has finer precision than the serialized boundary. The comparison preserves that unavailable state and does not change the instant by a millisecond to invent an answer. Different rulers can arise from **different divisions**, even when UTC instant, location and time zone match. A matching ruler does not make the methods identical or count as independent corroboration. Rao’s named convention does not stand for every Jyotiṣa tradition or current Jagannatha Hora setting. The third, ecliptic-ascension method remains unavailable.

### A bad inherited source example was challenged

The `accuracy-check` skill contained an illustrative claim assigning Jupiter/Mars to Sirius in Agrippa. Directly reading II.31 instead finds the greater Dog star described as Venereal. The inherited Behenian data’s Venus attribution agrees with this selected passage. ESA/Hubble separately supports the Dog Star/Sirius identification. The root agent was notified to correct the misleading skill example; this member did not modify the legacy star dataset.

The chapter’s historical seventh degree of Cancer is not used as a modern longitude. The source text’s symbolic nature is not stellar physics. An alternative Jupiter/Mars attribution to other authors was not newly verified here and remains separate.

### Actual worked interpretation examples

`skyReadingWorkedExamples()` exposes three reproducible examples:

1. **Lilly’s Sun in Aries by day/night.** Exaltation persists; the Sun’s triplicity dignity changes with sect. The source gives the sign, while the code’s illustrative 10° is explicitly synthetic. This demonstrates rule dependence rather than inventing a historical date.
2. **The synthetic cross-sign combustion comparison** above, preserving both conventions.
3. **Rao Example 2, p.14.** Moon 84°12′ and Sun 227°46′ yield 216°26′ elongation and tithi 19, Krishna Chaturthi. The arithmetic is independently reproduced; no real event/outcome is inferred.

The Rao reading freshly supports the partition formulas. It does **not** promote the inherited Muhūrta quality tables to primary-text validation. Those rows retain their existing secondary-transcription and unresolved opening-portion qualifications.

## API and interpretation flow

`buildSkyInterpretation(input, options)` recomputes through canonical engine functions. Input uses the existing exact ISO instant / IANA zone / observer contract. Options are `lensIds`, `planet`, `purpose`, and `includeObserver`. Unknown options and invalid choices are rejected.

The output has a concise `summary`, astronomical `facts`, named `lenses[].rules`, `differences`, `sharedInputs`, `optionalReflection`, selected `sources`, and `sourceCoverage`. Each rule contains a stable ID, readable conclusion, computed inputs, thresholds, source IDs, limitations, and `observerDependent`. Solar proximity, source alternatives, phase and lunar partitions remain distinct. Existing essential dignity points are identified as conventional points; there is no combined score across sources.

The selected outer planets can be displayed by the sky engine, but the Lilly/Agrippa/classical Jyotiṣa interpretation is explicitly unavailable. General lunar context remains calculable. No old fixed-star longitude or historical nature is used to issue a current personal interpretation. A current moment is not quietly promoted to a birth chart or a horary question.

Changing `purpose` between study, beginning and completion changes only the optional **modern editorial reflection**; historical facts and classifications remain identical. There is no health, financial, political-outcome or other consequential recommendation generated from these rules.

### AI and retrieval boundary

`includeObserver:false` retains only `dateISO` in the context, omits houses and both hour conventions, and withholds sect-dependent triplicity, peregrine status and dignity totals. Observer-independent dignity rows remain labelled as a subset. Across different observer locations/zones at the same instant, this output is identical. The AI integration can use this output without exposing location-derived results or pretending that a default coordinate is the user’s location.

`SKY_READING_CHUNKS` contains bounded original paraphrases with one source ID, title, exact locator, URL, claim type, reading status, rights, tags and lens IDs. It is a retrieval reference corpus, **not a fine-tuned model**, a full-text book collection, or proof of an open licence to train on modern PDFs. The AI owner implements retrieval, prompting, citation checks and optional server integration separately. Retrieved text is source data rather than executable instructions. Prompts should request a brief, source-linked explanation of facts and rules, not disclose hidden model reasoning or invent missing testimony.

Source discovery, reading, citation availability, mathematical checks, human historical expertise, empirical predictive validity and deployment are separate statuses.

## Verification at the first implemented candidate

`node scripts/tests/sky-interpretation.mjs` passed **61 checks**. Tests include source-link resolution, real canonical positions, lens/body filtering, unsupported outer-planet interpretation, no fabricated caller-supplied facts, observer-free invariance, purpose independence, same-sign/wrap/threshold cases, the inconsistent printed example, three worked examples, real summer daylight/night differences, before/after/exact-serialized-sunrise boundaries, actual ruler mismatch, polar unavailability, input rejection, frozen source metadata and host-zone independence.

The first rendered candidate revealed that the Agrippa lead repeated “Moon” when Moon was the selected body and began with an instruction to inspect rather than a result. The correction deduplicates the position sentence and leads with the actual dignity-condition result, explicitly identifying the borrowed Lilly table. Technical dignity names receive short plain-language explanations. This is a documented source/UX correction, not evidence that a human user study occurred.

This is an engine/source receipt. Browser rendering, AI retrieval, full-site regressions and later panel rounds are recorded by their owners; they are not claimed passed by this document merely because this module’s tests pass.

### Retrieved-file fingerprints

These hashes identify research bytes, not independent validation or a redistribution licence:

| Research response | SHA-256 |
|---|---|
| Lilly transcription PDF | `94bbce66c8e2c509a7d9ef56fb3378538dea44b549de500034d7ac2734b5b4ae` |
| Agrippa II.29–45 HTML | `3b2a63d41c2b54196e94305bbc0bd361568d846cba6ea5d650e7738c3e306608` |
| Rao textbook PDF | `1cafa828f34764ed5e85816882df2e8f0bc014c5c57ccdb27169416e117fd4db` |
| ESA/Hubble Sirius HTML | `30642f384e90800432d5e6c34b4c47eb8c18d9b27253d64ffc57cce6799f4d14` |
| Met object page HTML | `f3bb511a1d7491832f432e06fcde157e35d425152b7909536775183b3af83933` |
