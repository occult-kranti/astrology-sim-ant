// ============================================================================
//  core/viz/grid-model.js — the aspect-grid heat model (synastry & transit
//  snapshot). Pure model only; the grid stays an HTML <table> (the right a11y
//  primitive) built by the host, stamped from this model. [dataviz §3.5]
// ============================================================================

const NATURE = {
  Conjunction: 'asp-conj', Sextile: 'asp-soft', Trine: 'asp-soft',
  Square: 'asp-hard', Opposition: 'asp-hard',
};
// moiety-based band stays the engine's; here we bucket by absolute orb.
const bandOf = orb => (orb < 1 ? 'partile' : orb <= 2 ? 'tight' : 'wide');

// aspectGridModel(aspects, rowIds, colIds)
//   aspects: [{from, to, aspect, orb, applying}]  (from ∈ rows, to ∈ cols; also
//            matched symmetrically so caller order never drops a contact)
//   rowIds/colIds: ordered id arrays (e.g. planet names for A and B)
// → { cells:[{r,c,aspect,orb,applying,band,cls}], strongest:[≤5 by tightest orb] }
export function aspectGridModel(aspects = [], rowIds = [], colIds = []) {
  const rowSet = new Set(rowIds), colSet = new Set(colIds);
  const cells = [];
  for (const a of aspects) {
    let r, c;
    if (rowSet.has(a.from) && colSet.has(a.to)) { r = a.from; c = a.to; }
    else if (rowSet.has(a.to) && colSet.has(a.from)) { r = a.to; c = a.from; }
    else continue;
    const orb = typeof a.orb === 'number' ? a.orb : 0;
    cells.push({
      r, c, aspect: a.aspect, orb, applying: !!a.applying,
      band: bandOf(orb), cls: NATURE[a.aspect] || 'asp-conj',
    });
  }
  const strongest = cells.slice().sort((x, y) => x.orb - y.orb).slice(0, 5);
  return { cells, strongest };
}
