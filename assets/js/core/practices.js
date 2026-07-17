// ============================================================================
//  core/practices.js — pure, DOM-free lookups over the mudrā catalog.
//  Node-testable (no DOM / Date / random). Presentation lives in app/practices*.
// ============================================================================
import { HATHA_MUDRAS, MUDRA_GROUPS, PRACTICES_CAVEAT, PRACTICES_CITATION, PRACTICES_META } from './data/practices/mudras.js';

export { HATHA_MUDRAS, MUDRA_GROUPS, PRACTICES_CAVEAT, PRACTICES_CITATION, PRACTICES_META };

const byId = new Map(HATHA_MUDRAS.map(r => [r.id, r]));

/** All mudrā records from one source text: 'gheranda' (25) | 'hyp' (10). */
export function mudrasBySource(src) {
  return HATHA_MUDRAS.filter(r => r.source === src);
}

/** One record by id, or null. */
export function mudraById(id) {
  return byId.get(id) || null;
}

/** The paired record(s) across texts for a given id (its crosswalk), resolved. */
export function crosswalkOf(id) {
  const r = byId.get(id);
  if (!r || !Array.isArray(r.crosswalk)) return [];
  return r.crosswalk.map(cid => byId.get(cid)).filter(Boolean);
}

/** Catalog totals for the hub. */
export function practicesStats() {
  return {
    total: HATHA_MUDRAS.length,
    bySource: {
      gheranda: HATHA_MUDRAS.filter(r => r.source === 'gheranda').length,
      hyp: HATHA_MUDRAS.filter(r => r.source === 'hyp').length,
    },
    withHarmNote: HATHA_MUDRAS.filter(r => r.harmNote).length,
    contested: HATHA_MUDRAS.filter(r => r.contested).length,
    groups: MUDRA_GROUPS.length,
    builtGroups: MUDRA_GROUPS.filter(g => g.built).length,
  };
}

/** Diacritic-folded free-text search over name/iast/description/purpose. */
export function searchPractices(q, { source } = {}) {
  const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const needle = fold(q).trim();
  let rows = HATHA_MUDRAS;
  if (source && source !== 'all') rows = rows.filter(r => r.source === source);
  if (!needle) return rows.slice();
  return rows.filter(r => fold([r.name, r.iast, r.description, r.purpose].join(' ')).includes(needle));
}
