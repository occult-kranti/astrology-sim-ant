// ============================================================================
//  scripts/opgraph-eig.mjs — THE ROADMAP, COMPUTED FROM THE GRAPH.
//
//  The operator doctrine this implements (MASTER SETUP DOC v2 §5): "EIG-ranked
//  experiment selection: rank the roadmap by expected information gain computed
//  from DATA STATISTICS, not from model-stated confidence." It was the last
//  §5 mandate still marked QUEUED.
//
//  It is also amendment C applied to planning: the next round is PRINTED, not
//  remembered. Every figure below is re-derived from tracked state on each run,
//  so nothing here is hearsay (amendment E).
//
//  HONESTY ABOUT THE METRIC — read this before trusting a rank.
//  True expected information gain needs a posterior we do not have. What this
//  computes is a stated PROXY:
//
//        score = affected × headroom × leverage / cost
//
//    · affected  — how many nodes the action can touch (counted, not guessed).
//    · headroom  — how much of the weight rubric the action can actually move,
//                  in rubric units. The rubric is witness × primary × contest,
//                  so an action that cannot raise any of those three has
//                  headroom 0 no matter how appealing it sounds.
//    · leverage  — 2.0 if the action unblocks a STRUCTURAL claim the graph
//                  currently cannot make at all, 1.0 if it improves an existing
//                  one. Structural gaps are worth more than polish.
//    · cost      — a coarse ordinal (1 cheap desk-check … 5 a research round).
//                  Hand-set per action KIND and printed, because pretending to
//                  compute effort would be the dishonest part.
//
//  The proxy's weakness, stated: `cost` is a judgement, so the ranking is only
//  as good as those five integers. They are printed with the output precisely
//  so a reader can disagree with the ranking without having to re-derive the
//  statistics underneath it. The statistics are the contribution; the ordering
//  is an argument.
//
//  Usage:  node scripts/opgraph-eig.mjs            (print the ranked queue)
//          node scripts/opgraph-eig.mjs --write    (also regenerate NEXT.md)
// ============================================================================
import { writeFileSync } from 'node:fs';
import { OPGRAPH_NODES, OPGRAPH_META } from '../assets/js/core/data/opgraph.js';

const N = OPGRAPH_NODES;
const works = N.filter(n => n.type === 'work');
const claims = N.filter(n => n.type === 'procedure-claim');
const rels = N.filter(n => n.type === 'relation-claim');
const FLOOR = OPGRAPH_META.admissionFloor ?? 0.40;

const witCount = x => (Array.isArray(x.witnesses) ? x.witnesses.length : x.witnesses ? 1 : 0);
const num = x => (typeof x.weight === 'number' ? x.weight : null);

// ── THE MEASUREMENTS (all re-derived; none carried from a previous round) ────
const M = {
  nodes: N.length,
  works: works.length,
  claims: claims.length,
  rels: rels.length,
  singleWitnessClaims: claims.filter(c => witCount(c) <= 1).length,
  singleWitnessWorks: works.filter(w => witCount(w) <= 1).length,
  genreNormBasis: claims.filter(c => c.completenessBasis === 'genre-norm').length,
  readBasis: claims.filter(c => c.completenessBasis && c.completenessBasis !== 'genre-norm').length,
  nearFloor: [...works, ...claims].filter(x => num(x) !== null && x.weight < FLOOR + 0.10).length,
  weighted: [...works, ...claims].filter(x => num(x) !== null).length,
  workLevelRels: rels.filter(r => !r.procedureLevel).length,
  procedureLevelRels: rels.filter(r => r.procedureLevel).length,
  atlasNeeded: works.filter(w => w.atlasNeeded).length,
  unverified: claims.filter(c => c.unverified).length,
  retypePending: claims.filter(c => c.retypePending).length,
  pdUnresolved: works.reduce((n, w) => n + (w.editions || []).filter(e => !e.pd || e.pd === 'unresolved').length, 0),
  editions: works.reduce((n, w) => n + (w.editions || []).length, 0),
};

// ── THE CANDIDATE ACTIONS ───────────────────────────────────────────────────
// headroom is in rubric units: the witness term is the only one a corroboration
// pass can move, and it is pinned at its floor across the whole graph today.
const CANDIDATES = [
  {
    id: 'A · second witness',
    what: 'Add one INDEPENDENT second witness to the highest-weight nodes.',
    why: `Every node in the graph is single-witness (${M.singleWitnessClaims}/${M.claims} claims, ${M.singleWitnessWorks}/${M.works} works). The rubric multiplies a witness term that is therefore at its floor everywhere, which is why ${M.nearFloor}/${M.weighted} weighted nodes sit within 0.10 of the ${FLOOR} admission floor. This is the only action that can move that term at all.`,
    affected: M.singleWitnessClaims + M.singleWitnessWorks,
    headroom: 0.30, leverage: 1.0, cost: 3,
  },
  {
    id: 'B · basis upgrade',
    what: 'Replace derived `genre-norm` completeness bases with read evidence.',
    why: `${M.genreNormBasis} of ${M.claims} claims rest on the generator's weakest default; only ${M.readBasis} rest on something read. The round deliberately under-claimed — this is the debt that created.`,
    affected: M.genreNormBasis,
    headroom: 0.15, leverage: 1.0, cost: 4,
  },
  {
    id: 'C · procedure-level relations',
    what: 'Upgrade work-level relation-claims to procedure-level where evidence allows.',
    why: `${M.procedureLevelRels} of ${M.rels} relation-claims are procedure-level. "Where did this SEQUENCE come from?" is the one question this graph asks that no other resource does, and it is currently answered ${M.procedureLevelRels} times. The other ${M.workLevelRels} assert only that two works are related.`,
    affected: M.workLevelRels,
    headroom: 0.10, leverage: 2.0, cost: 4,
  },
  {
    id: 'D · atlas join',
    what: 'Link the works flagged `atlasNeeded` to their Confluence atlas slugs.',
    why: `${M.atlasNeeded} works want an atlas counterpart. The join key already exists; this is the cheapest structural win on the board and it makes the two graphs answer each other.`,
    affected: M.atlasNeeded,
    headroom: 0.05, leverage: 2.0, cost: 1,
  },
  {
    id: 'E · desk-check queue',
    what: 'Clear the flagged rows: unverified claims, retype-pending, unresolved edition PD.',
    why: `${M.unverified} unverified · ${M.retypePending} retype-pending · ${M.pdUnresolved}/${M.editions} editions with unresolved public-domain status. PD status gates quotability, so this one has a direct downstream consequence.`,
    affected: M.unverified + M.retypePending + M.pdUnresolved,
    headroom: 0.08, leverage: 1.0, cost: 1,
  },
  {
    id: 'F · a silent culture',
    what: 'Open one culture the graph currently has zero coverage of.',
    why: 'The data ceiling names them: Mesoamerican, sub-Saharan African, Mesopotamian, Shintō/Shugendō, Slavic. A zero is not a small number — it is a different kind of claim, and the graph says so itself.',
    affected: 0, headroom: 0.0, leverage: 2.0, cost: 5,
    note: 'affected=0 by construction: the nodes do not exist yet. The proxy CANNOT rank this action — a metric built on existing rows is structurally blind to absence. Ranked by hand, deliberately, and flagged as the proxy\'s known blind spot.',
  },
];

for (const c of CANDIDATES) c.score = c.affected * c.headroom * c.leverage / c.cost;
const ranked = [...CANDIDATES].sort((a, b) => b.score - a.score);

// ── OUTPUT ──────────────────────────────────────────────────────────────────
const L = [];
L.push('# The next round, computed — not chosen');
L.push('');
L.push('> GENERATED by `scripts/opgraph-eig.mjs` from the shipped graph. Do not hand-edit:');
L.push('> re-run it. Every figure is re-derived from tracked state on each run.');
L.push('');
L.push(`Graph state: **${M.nodes} nodes** — ${M.works} works · ${M.claims} procedure-claims · ${M.rels} relation-claims.`);
L.push('');
L.push('## The ranking');
L.push('');
L.push('`score = affected × headroom × leverage / cost` — a stated proxy, not true EIG. The');
L.push('statistics are the contribution; the ordering is an argument you may disagree with.');
L.push('');
L.push('| # | action | affected | headroom | lev | cost | score |');
L.push('|---|---|---:|---:|---:|---:|---:|');
ranked.forEach((c, i) => L.push(`| ${i + 1} | ${c.id} | ${c.affected} | ${c.headroom} | ${c.leverage} | ${c.cost} | **${c.score.toFixed(1)}** |`));
L.push('');
for (const c of ranked) {
  L.push(`### ${c.id}`);
  L.push('');
  L.push(`**${c.what}**`);
  L.push('');
  L.push(c.why);
  if (c.note) { L.push(''); L.push(`> ⚠ ${c.note}`); }
  L.push('');
}
L.push('## What this metric cannot see');
L.push('');
L.push('It ranks over rows that exist. An entire tradition absent from the corpus has');
L.push('`affected = 0` and scores zero — so the proxy is structurally blind to exactly the');
L.push('gap the data ceiling calls the graph\'s silence. Action F is therefore ranked by hand');
L.push('and kept on the board rather than allowed to fall off it. A ranking that only ever');
L.push('promotes filling in what is already started will never open a new shelf.');
L.push('');

const out = L.join('\n');
console.log(out);
if (process.argv.includes('--write')) {
  writeFileSync(new URL('../docs/plans/opgraph/NEXT.md', import.meta.url), out);
  console.log('\n[eig] wrote docs/plans/opgraph/NEXT.md');
}
