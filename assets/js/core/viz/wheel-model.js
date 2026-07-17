// ============================================================================
//  core/viz/wheel-model.js — the chart wheel's DATA-side models (pure). Reads
//  the existing castChart / allAspects / reading objects; recomputes nothing.
//  Consumed by app/viz/wheel-interact.js and app/wheel-rotate.js. [dataviz §3.8]
// ============================================================================
import { signOf, SIGN_GLYPHS, PLANET_GLYPHS, norm360 } from '../astro.js';

const PLANET_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'NorthNode', 'SouthNode', 'Fortune'];
const ASPECT_GLYPH = { Conjunction: '☌', Sextile: '⚹', Square: '□', Trine: '△', Opposition: '☍' };
const ASPECT_NATURE = { Conjunction: 'asp-conj', Sextile: 'asp-soft', Trine: 'asp-soft', Square: 'asp-hard', Opposition: 'asp-hard' };

const degLabel = lon => {
  const s = signOf(lon);
  return `${Math.floor(s.degInSign)}°${SIGN_GLYPHS[s.index]}`;
};

// wheelSnapTargets — every rest point the rotate-to-inspect gesture can land on,
// with a longitude, a human label and a tie-break priority (planet > angle >
// cusp > sign). Sorted by longitude (the ‹prev/next› stepping order). [dataviz §4.5]
export function wheelSnapTargets(chart, aspects = []) {
  const out = [];
  for (const name of PLANET_ORDER) {
    const p = chart.planets && chart.planets[name];
    if (!p) continue;
    out.push({
      kind: 'planet', id: `planet-${name}`, lon: norm360(p.lon), priority: 3,
      label: `${name} ${degLabel(p.lon)}${p.house ? ` · house ${p.house}` : ''}`,
    });
  }
  const angles = [['ASC', chart.asc], ['MC', chart.mc], ['DSC', chart.desc], ['IC', chart.ic]];
  for (const [nm, lon] of angles) {
    if (typeof lon !== 'number') continue;
    out.push({ kind: 'angle', id: `angle-${nm}`, lon: norm360(lon), priority: 2, label: `${nm} ${degLabel(lon)}` });
  }
  if (chart.cusps) {
    for (let h = 1; h <= 12; h++) {
      const lon = chart.cusps[h];
      if (typeof lon !== 'number') continue;
      out.push({ kind: 'cusp', id: `cusp-${h}`, lon: norm360(lon), priority: 1, label: `House ${h} cusp ${degLabel(lon)}` });
    }
  }
  for (let s = 0; s < 12; s++) {
    out.push({ kind: 'sign', id: `sign-${s}`, lon: s * 30, priority: 0, label: `${signOf(s * 30).name} 0°` });
  }
  // stable sort by longitude, then by descending priority for co-located points
  return out.sort((a, b) => (a.lon - b.lon) || (b.priority - a.priority));
}

// wheelLegendModel — only the encodings actually present in THIS chart; legends
// never list absent channels. [dataviz §3.8 / chart-ux F-NO-LEGEND]
export function wheelLegendModel(chart, aspects = []) {
  const rows = [];
  const kinds = new Set(aspects.map(a => ASPECT_NATURE[a.aspect]));
  if (kinds.has('asp-soft')) rows.push({ swatchClass: 'lg-soft', label: 'trine / sextile (soft)' });
  if (kinds.has('asp-hard')) rows.push({ swatchClass: 'lg-hard', label: 'square / opposition (hard)' });
  if (kinds.has('asp-conj')) rows.push({ swatchClass: 'lg-conj', label: 'conjunction' });
  if (aspects.some(a => a.separating || a.applying === false)) rows.push({ glyph: '– –', label: 'dashed = separating' });
  if (aspects.some(a => ASPECT_NATURE[a.aspect] === 'asp-hard')) rows.push({ glyph: '●', label: 'midpoint dot = hard aspect' });
  const retro = Object.values(chart.planets || {}).some(p => p && p.retrograde);
  if (retro) rows.push({ glyph: '℞', label: 'retrograde' });
  const hasAngles = typeof chart.asc === 'number';
  if (hasAngles) rows.push({ glyph: '▲', label: 'gold ▲ = angles (ASC/MC/DSC/IC)' });
  return rows;
}

// Parse an element id (planet-Sun / aspect-Sun-Moon-Trine / cusp-12 / angle-ASC / sign-3)
export function parseWheelEl(elId = '') {
  const m = String(elId).match(/^(planet|aspect|cusp|angle|sign)-(.+)$/);
  if (!m) return { kind: null, id: elId };
  const [, kind, rest] = m;
  if (kind === 'aspect') {
    const parts = rest.split('-');
    return { kind, from: parts[0], to: parts[1], aspect: parts[2] };
  }
  if (kind === 'cusp' || kind === 'sign') return { kind, n: Number(rest) };
  return { kind, name: rest };
}

// wheelInspectModel(reading, elId) — assembles a pin card model from the reading
// object the host already built. Recomputes nothing; degrades if fields absent.
export function wheelInspectModel(reading = {}, elId) {
  const chart = reading.chart || reading;
  const el = parseWheelEl(elId);
  const glossTerms = [];
  if (el.kind === 'planet') {
    const p = (chart.planets || {})[el.name] || {};
    const s = signOf(p.lon ?? 0);
    const rows = [];
    if (typeof p.lon === 'number') rows.push({ k: 'Position', v: `${PLANET_GLYPHS[el.name] || ''} ${Math.floor(s.degInSign)}° ${s.name}${p.retrograde ? ' ℞' : ''}` });
    if (typeof p.house === 'number') rows.push({ k: 'House', v: String(p.house) });
    if (typeof p.speed === 'number') rows.push({ k: 'Speed', v: `${p.speed.toFixed(2)}°/day${p.retrograde ? ' (retrograde)' : ''}` });
    const dig = reading.dignities && (reading.dignities[el.name] || (reading.dignities.byPlanet && reading.dignities.byPlanet[el.name]));
    if (dig && Array.isArray(dig.rows)) {
      for (const r of dig.rows) rows.push({ k: r.kind, v: `${r.score > 0 ? '+' : ''}${r.score}` });
      if (typeof dig.total === 'number') rows.push({ k: 'Essential total', v: `${dig.total > 0 ? '+' : ''}${dig.total} (of Lilly's −5…+5 essential)` });
      glossTerms.push('Essential Dignity');
    }
    return { title: `${el.name} ${degLabel(p.lon ?? 0)}`, rows, glossTerms, plainLine: (reading.plain && reading.plain[el.name]) || '' };
  }
  if (el.kind === 'aspect') {
    const a = (reading.aspects || chart.aspects || []).find(x => x.from === el.from && x.to === el.to && x.aspect === el.aspect)
           || (reading.aspects || []).find(x => x.aspect === el.aspect && ((x.from === el.from && x.to === el.to) || (x.from === el.to && x.to === el.from)));
    const rows = [];
    if (a) {
      rows.push({ k: 'Aspect', v: `${el.from} ${ASPECT_GLYPH[el.aspect] || ''} ${el.to}` });
      if (typeof a.orb === 'number') rows.push({ k: 'Orb', v: `${a.orb.toFixed(1)}°` });
      rows.push({ k: 'Motion', v: a.applying ? 'applying' : 'separating' });
      if (a.nature) rows.push({ k: 'Nature', v: a.nature });
    }
    glossTerms.push('Aspect', 'Orb', 'Applying / Separating');
    return { title: `${el.from} ${ASPECT_GLYPH[el.aspect] || el.aspect} ${el.to}`, rows, glossTerms, plainLine: '' };
  }
  if (el.kind === 'cusp') {
    const inHouse = Object.entries(chart.planets || {}).filter(([, p]) => p && p.house === el.n).map(([n]) => n);
    const lon = chart.cusps ? chart.cusps[el.n] : null;
    const rows = [];
    if (typeof lon === 'number') rows.push({ k: 'Cusp', v: `${degLabel(lon)} ${signOf(lon).name}` });
    rows.push({ k: 'Occupants', v: inHouse.length ? inHouse.join(', ') : 'empty' });
    const meaning = reading.houseTopics && reading.houseTopics[el.n];
    if (meaning) rows.push({ k: 'Signifies', v: meaning });
    return { title: `House ${el.n} cusp`, rows, glossTerms, plainLine: '' };
  }
  if (el.kind === 'angle') {
    const lonMap = { ASC: chart.asc, MC: chart.mc, DSC: chart.desc, IC: chart.ic };
    const lon = lonMap[el.name];
    return { title: `${el.name} ${typeof lon === 'number' ? degLabel(lon) : ''}`.trim(), rows: [{ k: 'Angle', v: typeof lon === 'number' ? `${Math.floor(signOf(lon).degInSign)}° ${signOf(lon).name}` : '' }], glossTerms, plainLine: '' };
  }
  if (el.kind === 'sign') {
    return { title: signOf(el.n * 30).name, rows: [{ k: 'Sign', v: `${el.n + 1} of 12` }], glossTerms, plainLine: '' };
  }
  return { title: elId || '', rows: [], glossTerms, plainLine: '' };
}
