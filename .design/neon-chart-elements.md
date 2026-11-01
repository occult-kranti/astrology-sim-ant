# Neon chart elements

Baseline: published `6ac1bcd93721ece1fa2bd621451cc3504d5cbcd0`. The user requests black chart elements and interiors, neon paths and planets, and a more realistic visual treatment.

The instrument remains a calculated chart. Add illustrative planetary surface shading and brighter categorical rims without changing calculated centers, longitudes, phases, frames, house cusps or canonical JSON/CSV. Keep symbolic-size and radial-distance disclosures. Do not add decorative points that could be mistaken for catalogue stars. Surface lighting is illustration, not a new physical observation.

## Delivery

- Actual chart panels, toolbars, inspectors and drawing previews use black or near-black interiors in Black appearance.
- Planet markers gain SVG-native shading, distinct rims and restrained depth. Their existing glyphs, body names and numerical tables remain available.
- Orbital paths, aspect connectors and calendar rings use readable neon paints. Unselected relationships remain discoverable; the selected pair is strongest. Preserve line patterns and text cues.
- Replace the remaining cream Sigil preview and pale export controls in Black with theme-aware drawing paint and controls. Parchment/Mineral and print remain usable.
- Keep gradients, clips and any paint references self-contained in downloaded SVG/PNG files. Avoid external images, whole-chart inversion and animated effects.
- Preserve held chart state, selection, keyboard behavior, privacy boundaries, every route and all CI gates.

## Panel and verification

Six AI engineering perspectives cover integration, palette, chart rendering, traditional/drawing renderers, browser verification and independent review. These are implementation reviews, not human usability research.

Round 1 inspected exact-baseline screenshots. It identified the cream Sigil preview and weak export controls, dim traditional glyphs/connectors, flat small planetary markers and barely visible unselected pairs. Round 2 inspected fourteen implementation captures and actual standalone output, correcting glyph contrast, parent-surface specificity and PNG canvas paint. Round 3 independently bound the final 192-check neon and 239-check Black suites to both frozen drivers, reviewed 24 screenshots and verified 30 downloads. Actual SVG definitions are self-contained; all tested text/line thresholds remain intact. Release integration verifies the published commit separately.

Run the existing Black-chart and full theme gates, numerical/static/generator/ledger checks, and all-page load sweep. Add bounded visual/export checks for the shaded surfaces, resolved references and black component interiors. Planned tests are not passing evidence. Capture and review actual mobile and desktop images.
