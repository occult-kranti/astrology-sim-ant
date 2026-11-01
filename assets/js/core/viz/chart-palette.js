// Presentation only. These tokens inherit the selected site theme, so changing
// appearance repaints an existing instrument without recasting its positions.
// Literal fallbacks keep DOM-free diagrams usable outside the site stylesheet.
// Browser downloads use state.svgToString() to freeze the computed paint.
export const CHART_PAINT = Object.freeze({
  background: 'var(--chart-bg, #f6f1e7)',
  surface: 'var(--chart-surface, #fbf8ef)',
  ink: 'var(--chart-ink, #263b36)',
  muted: 'var(--chart-muted, #60695d)',
  grid: 'var(--chart-grid, #c8c5b6)',
  line: 'var(--chart-line, #a6ae9a)',
  strong: 'var(--chart-strong, #89917e)',
  accent: 'var(--chart-accent, #9a482e)',
  focus: 'var(--chart-focus, #286a81)',
  star: 'var(--chart-star, #263b36)',
});

const BODY_FALLBACKS = Object.freeze({
  Sun: '#9a482e', Moon: '#263b36', Mercury: '#566f76', Venus: '#76586c',
  Mars: '#a04434', Jupiter: '#776123', Saturn: '#385e51', Uranus: '#3c6b78',
  Neptune: '#5b608b', Pluto: '#795d48', Earth: '#385e51', Rahu: '#76586c', Ketu: '#795d48',
});

// Identity, rather than enumeration order, connects the marker, guide, timeline
// and legend. Earth therefore keeps its own color in the heliocentric view.
export function chartBodyColor(id, fallback = CHART_PAINT.ink) {
  return Object.hasOwn(BODY_FALLBACKS, id)
    ? `var(--chart-body-${id.toLowerCase()}, ${BODY_FALLBACKS[id]})`
    : fallback;
}
