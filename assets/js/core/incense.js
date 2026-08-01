// ============================================================================
//  incense.js — the suffumigation materia, read BOTH WAYS.
//
//  PURE: no DOM, no network, no RNG, no Date. Every export is a function of its
//  inputs and the two tracked data modules.
//
//  The per-PLANET view already existed (planetary-magic.js is organised that
//  way). The contribution here is the per-MATERIAL view — one substance, every
//  planet that names it — which is the question a comparison corpus can answer
//  and a single grimoire cannot.
//
//  WHAT THIS MODULE REFUSES TO DO:
//   · It does not split substance strings. The tokenisation lives in
//     incense-materia.js as a reviewable judgement (see that file's header for
//     why a parser would fabricate here).
//   · It does not expand composites. The 31-spice and the 28-component lunar
//     compound are ONE material each, because this site cannot cite their
//     ingredient lists.
//   · It does not merge look-alike materials. "aloes wood" and "aloes" stay
//     apart, and the reason travels with them as an ambiguity record.
//   · It carries NO quantity and NO process parameter, ever. Those fields live
//     on planetary-magic.js's typed `suffumigationMateria` and are deliberately
//     null on the harm-flagged rows (FRAMING §5, C-1).
// ============================================================================

import { PLANETARY_MAGIC } from './data/planetary-magic.js';
import { MATERIA_TOKENS, MATERIA, AMBIGUITIES, MATERIA_SOURCE } from './data/incense-materia.js';

/** Chaldean order — the order the tradition itself uses, not alphabetical. */
export const PLANET_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

/**
 * The per-planet view. Returns the record as the sources give it, with the
 * TYPED materia object passed through untouched — callers must render its
 * fields, never re-flatten them into a sentence.
 */
export function byPlanet() {
  return PLANET_ORDER.filter(p => PLANETARY_MAGIC[p]).map(p => {
    const d = PLANETARY_MAGIC[p];
    const tok = MATERIA_TOKENS[p] || { tokens: [], readFrom: null };
    return {
      planet: p,
      governs: d.governs || null,
      substance: d.suffumigationMateria ? d.suffumigationMateria.substance : d.suffumigation,
      materia: d.suffumigationMateria || null,          // TYPED — render fields, do not flatten
      harmFlag: Boolean(d.harmFlag),
      harmNote: d.harmNote || null,
      colour: d.colour || null,
      metal: d.metal || null,
      stone: d.stone || null,
      source: d.source || null,
      tokens: (tok.tokens || []).map(id => ({ id, ...(MATERIA[id] || { label: id, kind: 'unknown' }) })),
      truncatedInSource: Boolean(tok.truncatedInSource),
      truncationNote: tok.truncationNote || null,
      tokenNote: tok.note || null,
      readFrom: tok.readFrom || null,
    };
  });
}

/**
 * The per-material view — the one the corpus is for.
 * One row per material, listing every planet that names it.
 */
export function byMaterial() {
  const index = new Map();
  for (const p of PLANET_ORDER) {
    const tok = MATERIA_TOKENS[p];
    if (!tok) continue;
    for (const id of tok.tokens || []) {
      if (!index.has(id)) {
        index.set(id, { id, ...(MATERIA[id] || { label: id, kind: 'unknown' }), planets: [] });
      }
      index.get(id).planets.push(p);
    }
  }
  // Attach the ambiguity record to every material it touches, so a renderer
  // cannot show the material without the reason it is not merged.
  for (const row of index.values()) {
    const keys = [row.ambiguity, row.disputed].filter(Boolean);
    row.ambiguities = keys.map(k => AMBIGUITIES[k]).filter(Boolean);
  }
  // Stable order: shared materials first (they are the comparison), then by label.
  return [...index.values()].sort((a, b) =>
    (b.planets.length - a.planets.length) || a.label.localeCompare(b.label));
}

/**
 * Materials named by more than one planet. Empty today — and that emptiness is
 * a FINDING, not a gap: on this corpus the seven suffumigations share no
 * material once the aloes pair is correctly kept apart. A page should say so
 * rather than render a blank panel.
 */
export function convergences() {
  return byMaterial().filter(m => m.planets.length > 1);
}

/** Every unresolved question this data carries. Rendered, never buried. */
export function openQuestions() {
  return Object.entries(AMBIGUITIES).map(([id, a]) => ({ id, ...a }));
}

/**
 * Counts, each declaring its unit in the same object as the number (rule B13 —
 * a count without its unit is how two correct measurements start an argument).
 */
export function census() {
  const mats = byMaterial();
  return {
    planetsWithSuffumigation: { n: byPlanet().length, unit: 'planet records' },
    distinctMaterials: { n: mats.length, unit: 'material tokens' },
    composites: { n: mats.filter(m => m.kind === 'composite').length, unit: 'material tokens' },
    componentsNotCarried: {
      n: mats.filter(m => m.kind === 'composite').reduce((s, m) => s + (m.componentCount || 0), 0),
      unit: 'ingredients inside composites that this site does NOT enumerate',
    },
    harmFlagged: { n: mats.filter(m => m.harm).length, unit: 'material tokens' },
    sharedAcrossPlanets: { n: convergences().length, unit: 'material tokens named by >1 planet' },
    openQuestions: { n: openQuestions().length, unit: 'unresolved ambiguities' },
  };
}

export const INCENSE_SOURCE = MATERIA_SOURCE;

export const INCENSE_FRAMING =
  'Historical materia recorded for the STUDY of astral magic — described, never prescribed. '
  + 'This page names what the texts assign; it carries no quantity, no preparation and no process '
  + 'parameter, and it is not an instruction to make or burn anything. Several entries name toxic '
  + 'or animal-derived substances and are marked as records rather than recipes. Astrology and '
  + 'talismanic magic have no demonstrated efficacy.';
