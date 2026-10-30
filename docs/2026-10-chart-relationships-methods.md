# Chart relationships — methods and presentation

This change adds a presentation adapter over the existing calculation engines. It does not replace the astronomical model or introduce a predictive scoring model. The adapter is `assets/js/core/chart-relationships.js`; the inspector is `assets/js/app/chart-relationships.js`.

## Distinct conventions

| Inspector method | Authoritative input | Meaning and limits |
| --- | --- | --- |
| Geometric aspects | Held `buildSkySnapshot` bodies and aspects | Five named angular contacts with the snapshot's uniform allowance. Positions are apparent geocentric ecliptic longitudes of date. Membership uses the supplied strict allowance. |
| Lilly moieties | Existing `allAspects`, using the same held planetary coordinates and sampled speeds | Planetary moieties differ from a uniform geometric allowance. The existing 0.05-day linear lookahead and ±6-hour sampled speeds remain explicit. This is not an independent high-precision motion integration. |
| Mutual reception | Existing `mutualReception` and dignity rulers with the held day/night context | A dignity relationship can exist without an angular aspect. Missing matching sect/context makes this method unavailable. |
| Directed Jyotiṣa contacts | Existing `grahaDrishti` on actual held canonical sidereal rows | Direction matters. The existing whole-sign versus sphuṭa and lunar-node qualifications remain visible. The atlas lists only pairs whose two bodies are actually plotted, so its unplotted Rahu/Ketu contacts are omitted. The nine-graha sidereal timeline can show its supported node contacts. |

The sidereal plate uses its actual held longitudes once. Rounded public ayanamsa fields are not used to reconstruct them. Lilly aspects and receptions retain their tropical rule context even when their connectors are displayed between the corresponding sidereal markers. The chart note states this explicitly. Geocentric contacts do not appear on the heliocentric orbital projection.

## What the colors mean

Conjunction, sextile, square, trine and opposition each have a named color, glyph and connector pattern. Directed contacts also show arrows. A pointer/focus preview highlights both endpoints; explicit activation pins the pair. Clearing or leaving a preview restores the held pin or neutral view. Ordinary list buttons provide alternatives to thin SVG targets. Source details are inline so they do not cover the chart.

The relation's geometry is neutral. Separately named canonical testimonies may carry their original favorable/caution classification, convention and limitations. An opposition or square does not itself establish danger, a hostile actor, an event outcome or a universally unfavorable day. Exact, steady, applying, separating and undetermined describe the declared angular motion convention; legacy flags remain diagnostic and are not allowed to call a static exact contact motion apart.

Calendar-ring identity colors are stable by method ID. Matching, different and unavailable rows refer to the existing comparison of the same named calculation under explicit clock choices. They do not measure agreement between religions or validate outcomes. Civil labels without angular geometry remain civil labels. Metadata distinguishes all selected overlays from the eight actually drawn rings.

Country sensitivity wheels contain assumed house cusps, rather than held planetary positions. They therefore explain their scope instead of manufacturing relationship connectors. Availability labels identify computed civil outputs and retain unknown historical event-clock qualifications.

## State, computation and privacy

Hover/focus changes DOM presentation only. It does not cast charts, start workers, write storage or send requests. Optional atlas Vedic support holds at most one complete current-frame result, keyed by the explicit study date, observer, zone and calculation settings. Date/clock edits invalidate the inspector alongside the existing exports. New frames cannot combine old calendar alignment with new sky data.

Lists render at most eight rows per page. The pure adapter bounds body, relation and comparison counts and rejects nonfinite coordinates, inconsistent supplied angles/orbs, unknown IDs and mismatched contexts. External links use the existing source registry and safe HTTP(S) policy. Source text is rendered as text.

Canonical reading/Timeline/Newton/source-atlas JSON serializers stay unchanged. The actual SVG download preserves its displayed pair state, connector styles and public calculation instant without adding observer coordinates or private birth data. No relationship pin is saved to local storage. Existing explicit date bookmarks and separate AI-disclosure controls retain their own contracts.

The review reuses existing repository source records and numerical engines. It is not a fresh collation of complete historical books, a human usability study, an accessibility certification or a validation of astrological predictions. See the [review ledger](2026-10-chart-relationships-panel.md) for demonstrated defects and corrections.
