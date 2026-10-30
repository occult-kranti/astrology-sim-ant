---
name: accuracy-check
description: Validate a contested astrological/historical data point against multiple authoritative sources before it is encoded into this Lilly/Picatrix site. Use before hardcoding any uncertain value — Behenian star longitudes/natures, decan-face images, lunar-mansion uses, via-combusta bounds, pitted/azimene/fortune degrees, dignity edge cases. Produces an agree/disagree verdict and the exact citation string to store in-data.
---

# accuracy-check — verify before you encode

The maintainer's standard: **verify every number; never hardcode an uncertain value as fact;
flag discrepancies in-data.** This skill operationalizes that.

## Procedure
1. **Identify** the claim precisely (e.g. "Sirius nature = Jupiter+Mars", "via combusta =
   15° Libra–15° Scorpio", "Behenian Algol longitude ~2020").
2. **Gather ≥2 authoritative sources.** Prefer, in order:
   - Primary period text: Lilly *Christian Astrology* (1647), Agrippa *Three Books* II
     (esotericarchives.com), the *Picatrix* (Greer–Warnock or Attrell–Porreca).
   - Specialist modern: Renaissance Astrology / Warnock; Constellations of Words; Skyscript.
   - Tertiary cross-check: Wikipedia, Kepler College library.
   Use `WebSearch` then `WebFetch` the best source; for big multi-source jobs use the
   `deep-research` skill.
3. **Compare.** Record agreement or the exact divergence (which source says what).
4. **Decide:**
   - **Agree** → encode with a `source` citation.
   - **Disagree** → encode the dominant/period value **and** the variant
     (`…Alt`, `sourceNote`), flagged — do not silently pick one.
   - **Time-varying** (star longitudes) → store a catalog epoch + compute live (precession
     ≈50.29″/yr); the snapshot is only a cross-check.
5. **Output**: a one-line verdict + the citation string to paste into the data record, e.g.
   `source: 'Agrippa, Three Books II.31 (esotericarchives), greater Dog-star'` and, if needed,
   `sourceNote: 'The selected II.31 passage calls the greater Dog-star Venereal; historical printed zodiacal positions are not current catalogue coordinates.'`.

   Source correction, 30 October 2026: the previous illustrative Sirius example
   attributed Jupiter+Mars to Agrippa and Venus to Lilly without a checked locator.
   Fresh reading of Agrippa II.31 contradicts that Agrippa attribution. Do not
   propagate the old example as a verified variant. The existing Behenian data's
   Venus association is retained; consult `docs/2026-10-sky-sources.md` for the
   actual passage and reading scope. A different author's association needs its
   own checked source before it becomes an encoded alternative.

## Known load-bearing caveats (already validated — keep these)
- **Behenian:** Alkaid is the canonical 15th; **Fomalhaut is a Royal star, not a Behenian**
  (offer only as a flagged modern 16th); Polaris substitution is wrong.
- **Via combusta:** default 15° Libra–15° Scorpio; configurable to 8°Lib–3°Sco; **Spica
  (~24° Libra) is a benefic exception.**
- **Mansions:** tropical, Al-Sharatain at 0° Aries, 12°51′26″ each.
- **Election:** weigh the **Moon's dispositor** (outcome); rank windows, don't demand perfection.

Always end by citing the URLs/sources you used.
