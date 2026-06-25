// ============================================================================
//  behenian-stars.js — The 15 Behenian fixed stars (Hermes/Agrippa canon)
//  with LIVE PRECESSION to the chart date. Pure data + pure helpers, NO DOM.
//
//  Sources (see research/SOURCE-DATA.md §3 for the full table + caveats):
//   • Cornelius Agrippa, Three Books of Occult Philosophy II.47 (Hermes on the
//     15 stars), via esotericarchives.com.
//   • Renaissance Astrology / Christopher Warnock (Behenian stars & talismans).
//   • Wikipedia "Behenian fixed star" (cross-check of the canonical 15).
//
//  IMPORTANT fidelity / accuracy notes (load-bearing — see SOURCE-DATA §0):
//   • The canonical 15th star is ALKAID (Hermes/Agrippa), NOT Fomalhaut.
//     Fomalhaut is a Royal star, only a MODERN Behenian substitute — it is
//     included here ONLY as a 16th entry flagged `modern: true`.
//   • Fixed-star longitudes precess ~50.29″/yr (≈1°/72yr). The ~2020 catalog
//     longitudes (`lon2020`) are STARTING POINTS — call `behenianLongitude()`
//     to precess to the chart date. Never treat one epoch as "now".
//   • Star NATURES vary by source. Where a source disagrees, the variant is
//     stored in `natureAlt` + `sourceNote`; we never silently pick one.
//
//  Longitude convention matches dignities-data.js FIXED_STARS: ecliptic
//  longitude 0..360 where 0 = 0°Aries, 30 = 0°Taurus, 60 = 0°Gemini, etc.
//
//  Framing: the magical "use" of each star is HISTORICAL practice, described
//  not prescribed. Some historical plants/recipes name toxic substances (e.g.
//  black hellebore) — these are recorded for fidelity, never recommended.
// ============================================================================

import { norm360 } from '../astro.js';

// General precession in ecliptic longitude (arcsec/yr → degrees/yr).
export const PRECESSION_DEG_PER_YEAR = 50.29 / 3600;

// Catalog epoch (year) for the `lon2020` longitudes below.
export const BEHENIAN_EPOCH = 2020;

const SRC = 'Agrippa/Hermes (see research/SOURCE-DATA.md §3)';

// ---------------------------------------------------------------------------
//  The 15 canonical Behenian stars (Alkaid as #15) + Fomalhaut (modern:true).
//  lon2020 = ecliptic longitude at ~2020, converted from the sign-degree value.
// ---------------------------------------------------------------------------
export const BEHENIAN_STARS = [
  {
    name: 'Algol', lon2020: 56.4333,          // 26°Tau26′
    nature: 'Saturn + Jupiter',
    stone: 'diamond', plant: 'black hellebore, mugwort',
    use: 'protection, courage; reputedly the most malefic of stars',
    modern: false, source: SRC
  },
  {
    name: 'Pleiades (Alcyone)', lon2020: 60.2667, // 0°Gem16′
    nature: 'Moon + Mars',
    stone: 'rock crystal', plant: 'fennel',
    use: 'eyesight; summon spirits; reveal secrets',
    modern: false, source: SRC
  },
  {
    name: 'Aldebaran', lon2020: 70.0667,      // 10°Gem04′
    nature: 'Mars + Venus',
    stone: 'ruby/garnet', plant: 'milk thistle',
    use: 'riches & honours; remedy for an afflicted Venus',
    modern: false, source: SRC
  },
  {
    name: 'Capella', lon2020: 82.1333,        // 22°Gem08′
    nature: 'Jupiter + Saturn',
    stone: 'sapphire', plant: 'horehound',
    use: 'honours, royal favour',
    modern: false, source: SRC
  },
  {
    name: 'Sirius', lon2020: 104.35,          // 14°Can21′
    nature: 'Venus',
    natureAlt: 'Jupiter + Mars',
    stone: 'beryl', plant: 'savine juniper',
    use: 'favour of men & spirits; honour',
    modern: false, source: SRC,
    sourceNote: 'Nature contested: Venus (Agrippa/Hermes) vs Jupiter+Mars (other sources).'
  },
  {
    name: 'Procyon', lon2020: 116.05,         // 26°Can03′
    nature: 'Mercury + Mars',
    stone: 'agate', plant: 'buttercup',
    use: 'favour; magical power; protection',
    modern: false, source: SRC
  },
  {
    name: 'Regulus', lon2020: 150.1,          // 0°Vir06′
    nature: 'Jupiter + Mars',
    stone: 'garnet', plant: 'mugwort/celandine',
    use: 'royal favour, courage; remedy for an afflicted Sun',
    modern: false, source: SRC
  },
  {
    name: 'Alkaid', lon2020: 177.2,           // 27°Vir12′ — the canonical 15th
    nature: 'Venus + Moon',
    stone: 'lodestone', plant: 'chicory',
    use: 'protection against enchantment; travel; binding',
    modern: false, source: SRC,
    sourceNote: 'Alkaid is the canonical 15th Behenian star (Hermes/Agrippa), NOT Fomalhaut.'
  },
  {
    name: 'Algorab', lon2020: 193.7167,       // 13°Lib43′
    nature: 'Saturn + Mars',
    stone: 'onyx', plant: 'burdock',
    use: 'repel demons; daring; destructive work',
    modern: false, source: SRC
  },
  {
    name: 'Spica', lon2020: 204.1,            // 24°Lib06′
    nature: 'Venus + Mercury',
    stone: 'emerald', plant: 'sage',
    use: 'riches, favour, success; wins lawsuits',
    modern: false, source: SRC
  },
  {
    name: 'Arcturus', lon2020: 204.5,         // 24°Lib30′
    nature: 'Mars + Jupiter',
    stone: 'jasper', plant: 'plantain',
    use: 'carries away fevers; gain',
    modern: false, source: SRC
  },
  {
    name: 'Alphecca', lon2020: 222.5667,      // 12°Sco34′
    nature: 'Venus + Mars',
    stone: 'topaz', plant: 'rosemary',
    use: 'chastity, friendship, honour',
    modern: false, source: SRC
  },
  {
    name: 'Antares', lon2020: 250.0167,       // 10°Sag01′
    nature: 'Mars + Jupiter',
    stone: 'sardonyx/amethyst', plant: 'birthwort',
    use: 'memory; banish demons; remedy for an afflicted Mars',
    modern: false, source: SRC
  },
  {
    name: 'Vega', lon2020: 285.5667,          // 15°Cap34′
    nature: 'Mercury + Venus',
    stone: 'chrysolite', plant: 'winter savory',
    use: 'favour with beasts & superiors; against fear',
    modern: false, source: SRC
  },
  {
    name: 'Deneb Algedi', lon2020: 323.8,     // 23°Aqu48′
    nature: 'Saturn + Mercury',
    stone: 'chalcedony', plant: 'marjoram',
    use: 'favour in lawsuits; secures the home; riches',
    modern: false, source: SRC
  },
  // ---- Optional 16th: NOT one of the historical 15 (modern practice only) ----
  {
    name: 'Fomalhaut', lon2020: 333.5,        // ~3°30′ Pis
    nature: 'Venus + Mercury',
    stone: 'topaz/chrysolite', plant: 'fennel',
    use: 'a Royal star used as a modern Behenian substitute',
    modern: true, source: SRC,
    sourceNote: 'Fomalhaut is a Royal star, NOT a historical Behenian. Modern substitute only.'
  }
];

// ---------------------------------------------------------------------------
//  Lookups & live precession
// ---------------------------------------------------------------------------

// Fractional UTC year of a Date (year + month/12 is accurate enough for ~50″/yr).
function yearOf(date) {
  return date.getUTCFullYear() + date.getUTCMonth() / 12;
}

// Smallest circular separation (0..180°) between two ecliptic longitudes.
function circSep(a, b) {
  const d = Math.abs(norm360(a) - norm360(b));
  return d > 180 ? 360 - d : d;
}

// Ecliptic longitude of a Behenian star, precessed to `date`.
// Returns undefined for an unknown name.
export function behenianLongitude(name, date) {
  const star = BEHENIAN_STARS.find(s => s.name === name);
  if (!star) return undefined;
  return norm360(star.lon2020 + PRECESSION_DEG_PER_YEAR * (yearOf(date) - BEHENIAN_EPOCH));
}

// Behenian stars in aspect (conjunction within `orb`) to any planet in a chart.
// chart.planets = { Sun: {lon}, Moon: {lon}, ... }; chart.date drives precession.
// Only the canonical (non-modern) stars are checked.
export function starsInAspect(chart, orb = 6) {
  const hits = [];
  const date = chart.date;
  const planets = chart.planets || {};
  for (const star of BEHENIAN_STARS) {
    if (star.modern) continue;
    const lon = behenianLongitude(star.name, date);
    for (const [planet, body] of Object.entries(planets)) {
      if (!body || typeof body.lon !== 'number') continue;
      const sep = circSep(body.lon, lon);
      if (sep <= orb) hits.push({ star: star.name, planet, sep, lon });
    }
  }
  return hits;
}
