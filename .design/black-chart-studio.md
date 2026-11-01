# Black chart studio

Request: a true black site theme, color-coded charts and deeper chart interaction. This request supersedes the earlier instruction to retain light chart plates in Midnight. The existing `midnight` preference token now means **Black**; explicit Parchment and Mineral preferences remain valid. New, invalid and unavailable preferences recover to Black.

## Implementation contract

- Use #000 canvas and neutral near-black surfaces. Repaint actual SVGs with semantic CSS paint roles; do not invert diagrams or alter their positions.
- Keep body, aspect, calendar-ring and source-category identities stable across views, filters and exports. Retain text, glyphs and line patterns as redundant cues. Color identifies a category, not an outcome or probability.
- Add relationship motion filtering, supplied-orb/body sorting, filter counts/reset, clickable legend, previous/next pair navigation and keyboard traversal. Render at most eight relationship rows per page. Missing phases/orbs stay explicit.
- Preserve canonical calculations, held UTC/location, geometry, pin continuity, source qualifications, private-input boundaries and JSON/CSV bytes. Theme and inspector changes do not recast charts.
- Standalone SVG downloads freeze the visible computed paint, selected pair and existing metadata without requiring the site's styles.
- Keep every existing route and CI gate. Add a bounded ten-journey Black chart regression gate; test the entire site separately for loading failures.

## Agent review ledger

These are AI engineering perspectives, not human usability research. Root integrates and releases; separate agents implement palette, chart rendering, inspector controls and browser verification. An independent agent reviews source and rendered artifacts.

1. Source review: actual SVG backgrounds, stable identity colors, standalone export paint, missing-phase/orb semantics, filtered pin behavior and redundant visual cues became explicit acceptance requirements.
2. Render review: inspected desktop/mobile charts; corrected the light overlay button, low-contrast selected timeline legend and nonpaint export-token handling. Diagnostic receipts remain distinct from final acceptance.
3. Held-candidate review: independently viewed all eleven Black-gate PNGs, verified all 546 source hashes and actual download bytes, and confirmed five canonical JSON pairs are identical. Release integration retains every existing workflow gate and adds the ten-journey Black gate; publication checks follow local acceptance.

See [verification](../docs/2026-10-black-chart-verification.md) for observed results and limitations.
