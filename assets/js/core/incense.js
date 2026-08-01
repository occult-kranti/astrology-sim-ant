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
import {
  MATERIA_TOKENS, MATERIA, AMBIGUITIES, MATERIA_SOURCE, PRACTITIONER_TABLE,
} from './data/incense-materia.js';

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

/**
 * THE TWO TABLES, SIDE BY SIDE — the textual (Tier A/B, Picatrix III.7 +
 * Agrippa) against the modern practitioner set (Tier C).
 *
 * `agrees` is deliberately CONSERVATIVE: it is true only when a practitioner
 * material appears as a token in the textual entry. Anything else counts as a
 * divergence, because a near-miss ("rose" vs "roses", "aloes" vs "aloeswood")
 * is exactly the kind of thing a looser comparison would call agreement and be
 * wrong about — see the aloes-pair ambiguity.
 */
export function tableComparison() {
  return PLANET_ORDER.map(p => {
    const textual = byPlanet().find(r => r.planet === p);
    const prac = PRACTITIONER_TABLE[p] || null;
    const tokens = textual ? textual.tokens.map(t => t.label.toLowerCase()) : [];
    const pracMain = prac && prac.main ? prac.main.toLowerCase() : '';
    const agrees = Boolean(pracMain) && tokens.some(t => t === pracMain);

    // A bare "7 of 7 diverge" would overstate it, because two of the seven are
    // not real disagreements about materials:
    //   · a singular/plural or wording difference for the SAME substance;
    //   · a material the texts do assign — but to a DIFFERENT planet, which is
    //     a reassignment rather than a substitution and is far more interesting.
    let nearMiss = null;
    if (!agrees && pracMain) {
      const loose = tokens.find(t =>
        t.startsWith(pracMain) || pracMain.startsWith(t)
        || t.replace(/s$/, '') === pracMain.replace(/s$/, ''));
      if (loose) {
        nearMiss = { kind: 'wording', body: `The texts give "${loose}" and the practitioner table "${pracMain}" — `
          + 'almost certainly the same material under a different form, not a disagreement.' };
      } else {
        const elsewhere = PLANET_ORDER.filter(q => q !== p).find(q => {
          const other = byPlanet().find(r => r.planet === q);
          return other && other.tokens.some(t => t.label.toLowerCase() === pracMain);
        });
        if (elsewhere) {
          nearMiss = { kind: 'reassigned', body: `The texts DO name "${pracMain}" — but they give it to `
            + `${elsewhere}, not ${p}. The practitioner table has reassigned it, which is a different `
            + 'claim from substituting something new.' };
        }
      }
    }

    return {
      planet: p,
      nearMiss,
      textual: textual ? textual.substance : null,
      textualTier: 'A/B — Picatrix III.7 · Agrippa II',
      practitioner: prac ? prac.main : null,
      practitionerAlt: prac ? prac.alt : null,
      practitionerTier: 'C — modern working table',
      substitution: Boolean(prac && prac.substitution),
      substitutionNote: prac && prac.substitutionNote ? prac.substitutionNote : null,
      agrees,
    };
  });
}

/**
 * The materia a given planetary ruler is ASSIGNED by the cited texts.
 *
 * Pure: takes a ruler name, returns the record. It deliberately does NOT take a
 * clock — `core/**` may not read `Date`, so the caller supplies the hour and
 * this module supplies only what the books say about its ruler.
 *
 * NOTE THE VERB, because it is the whole of FRAMING §11.5. The earlier
 * instrument rendered this as "Burn dragon's blood" — an imperative addressed
 * to the reader. This returns what a TEXT ASSIGNS to a ruler. The page states
 * the assignment; it never tells anyone to light anything.
 */
export function materiaForRuler(ruler) {
  const r = byPlanet().find(x => x.planet === ruler);
  if (!r) return null;
  return {
    planet: r.planet,
    substance: r.substance,
    materia: r.materia,
    harmFlag: r.harmFlag,
    harmNote: r.harmNote,
    tokens: r.tokens,
    truncatedInSource: r.truncatedInSource,
    truncationNote: r.truncationNote,
    source: r.source,
    governs: r.governs,
  };
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
