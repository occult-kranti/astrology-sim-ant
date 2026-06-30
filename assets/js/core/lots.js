// ============================================================================
//  lots.js — the Arabic Parts / Hermetic LOTS. A Lot is the affine point
//  Lot = Asc + A − B (mod 360). This module computes the seven Hermetic Lots of
//  the planets (Fortune, Spirit, Eros, Necessity, Courage, Victory, Nemesis,
//  after Paulus Alexandrinus ch.23 / al-Bīrūnī) plus the most-used natal TOPIC
//  Lots (Marriage, Children, Father, Mother), built on Fortune & Spirit.
//
//  SECT. The five planetary Lots and the topic Lots reverse their two added
//  points by night in the standard Hermetic scheme. Fortune & Spirit reverse
//  too in the Ptolemaic/Hermetic rule — but LILLY prints the Part of Fortune the
//  SAME by day and night. So `sectAware` is a toggle:
//    • sectAware:false (default, Lilly) — every Lot uses its DAY formula in both
//      sects (matches how Lilly casts ⊕);
//    • sectAware:true  (Ptolemy/Hermetic) — Lots reverse by night.
//  The fork is surfaced honestly in the UI; both are real positions in the text.
//
//  PURE — no DOM, headless-testable. Mirrors astro.js conventions.
// ============================================================================
import { norm360, signOf, formatLon } from './astro.js';

// Each Lot: Asc + A − B by day; by night (when sectAware) Asc + B − A.
// A/B name one of: 'Asc', a planet, or a previously-computed lot 'Fortune'/'Spirit'.
export const LOTS = [
  { key: 'fortune',   name: 'Fortune',           glyph: '⊕', planet: 'Moon',    cat: 'hermetic', a: 'Moon',    b: 'Sun',     topic: 'the body, fortune & material life — “where the Moon’s light falls from the Sun, projected from the Ascendant.”' },
  { key: 'spirit',    name: 'Spirit (Daimon)',   glyph: '☼', planet: 'Sun',     cat: 'hermetic', a: 'Sun',     b: 'Moon',    topic: 'the mind, spirit, action & career — the reflection of Fortune.' },
  { key: 'eros',      name: 'Eros (Love)',       glyph: '♡', planet: 'Venus',   cat: 'hermetic', a: 'Venus',   b: 'Spirit',  topic: 'desire, love & what one longs for; built from Spirit and Venus.' },
  { key: 'necessity', name: 'Necessity',         glyph: '⚷', planet: 'Mercury', cat: 'hermetic', a: 'Fortune', b: 'Mercury', topic: 'constraint, enmity & what one must endure; built from Fortune and Mercury.' },
  { key: 'courage',   name: 'Courage (Valour)',  glyph: '⚔', planet: 'Mars',    cat: 'hermetic', a: 'Fortune', b: 'Mars',    topic: 'boldness, daring & force; built from Fortune and Mars.' },
  { key: 'victory',   name: 'Victory',           glyph: '🏆', planet: 'Jupiter', cat: 'hermetic', a: 'Jupiter', b: 'Spirit',  topic: 'success, faith & what one attains; built from Spirit and Jupiter.' },
  { key: 'nemesis',   name: 'Nemesis',           glyph: '☄', planet: 'Saturn',  cat: 'hermetic', a: 'Fortune', b: 'Saturn',  topic: 'fate, retribution, the hidden & endings; built from Fortune and Saturn.' },
  // topic lots (natal) — built on Fortune/Spirit-style affine points; contested formulas flagged.
  { key: 'marriageMen',   name: 'Marriage (men)',   cat: 'topic', a: 'Venus',  b: 'Saturn',  topic: 'a man’s marriage / wife (Paulus).', confidence: 'medium' },
  { key: 'marriageWomen', name: 'Marriage (women)', cat: 'topic', a: 'Saturn', b: 'Venus',   topic: 'a woman’s marriage / husband (Paulus).', confidence: 'medium' },
  { key: 'children',      name: 'Children',         cat: 'topic', a: 'Saturn', b: 'Jupiter', topic: 'children & issue (Paulus).', confidence: 'high' },
  { key: 'father',        name: 'Father',           cat: 'topic', a: 'Sun',    b: 'Saturn',  topic: 'the father (Paulus; by night Asc + Saturn − Sun).', confidence: 'medium' },
  { key: 'mother',        name: 'Mother',           cat: 'topic', a: 'Moon',   b: 'Venus',   topic: 'the mother (Paulus).', confidence: 'medium' },
];

export const LOTS_CITATION =
  'The seven Hermetic Lots: Paulus Alexandrinus, Introduction ch.23; al-Bīrūnī, Book of Instruction §476. ' +
  'Topic Lots (Marriage/Children/Father/Mother): Paulus / Vettius Valens — formulas vary by author (flagged). ' +
  'A Lot is the affine point Asc + A − B (mod 360); sect-aware Lots reverse A and B by night.';

// Compute every Lot for a chart. opts: { sectAware:boolean }.
export function computeLots(chart, opts = {}) {
  const sectAware = !!opts.sectAware;
  const isDay = chart.isDay;
  const reverse = sectAware && !isDay;          // swap A and B by night, only when sect-aware
  const asc = chart.asc;

  const base = name => {
    if (name === 'Asc') return asc;
    const p = chart.planets[name];
    return p ? p.lon : null;
  };
  const computed = {};                           // resolve 'Fortune'/'Spirit' references
  const resolve = name => (name === 'Fortune' || name === 'Spirit') ? computed[name] : base(name);

  const out = [];
  for (const L of LOTS) {
    const A = resolve(L.a), B = resolve(L.b);
    if (A == null || B == null) continue;
    const lon = reverse ? norm360(asc + B - A) : norm360(asc + A - B);
    if (L.name === 'Fortune') computed.Fortune = lon;
    if (L.name.startsWith('Spirit')) computed.Spirit = lon;
    const s = signOf(lon);
    const formula = reverse ? `Asc + ${L.b} − ${L.a} (night)` : `Asc + ${L.a} − ${L.b}${sectAware ? ' (day)' : ''}`;
    out.push({
      key: L.key, name: L.name, glyph: L.glyph || '', planet: L.planet || null, cat: L.cat,
      lon, label: formatLon(lon), sign: s.name, degInSign: s.degInSign,
      formula, topic: L.topic, confidence: L.confidence || 'high',
      house: typeof chart.cusps === 'object' ? houseOfLon(lon, chart.cusps) : null,
    });
  }
  return { sectAware, lots: out, citation: LOTS_CITATION };
}

// Local house lookup (same span rule as astro.js houseOf), so this module needs
// nothing from astro beyond norm360/signOf/formatLon.
function houseOfLon(lon, cusps) {
  if (!cusps) return null;
  lon = norm360(lon);
  for (let i = 1; i <= 12; i++) {
    const a = cusps[i], b = cusps[i === 12 ? 1 : i + 1];
    if (a == null || b == null) return null;
    const span = norm360(b - a), off = norm360(lon - a);
    if (off < span || span === 0) return i;
  }
  return 1;
}

// Convenience: a map keyed by lot key → the computed lot.
export function lotsByKey(chart, opts) {
  const r = computeLots(chart, opts);
  const m = {};
  for (const l of r.lots) m[l.key] = l;
  return m;
}
