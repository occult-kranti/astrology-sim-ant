// ============================================================================
//  scripts/tests/r32-atlas-east.mjs — Builder B-ATLAS-EAST (R32 EASTERN GREATS)
//  headless test module. Exports:  async run() -> { pass, failures[] }  and
//  DRIVES[]. Wired into scripts/engine-test.mjs by the integrator.
//  Deterministic, dependency-free, DOM-free.
//
//  Covers the R32 Confluence-atlas append: two yoga-vedanta modern figures
//  (person-vivekananda 1863–1902, person-yogananda 1893–1952) and four
//  documented edges — person-vivekananda→{event-chicago-1893, raja-yoga-1896,
//  yoga-sutras} and person-yogananda→autobiography-of-a-yogi. Asserts the new
//  records' shape, honest-framing tokens (the required Kriya-Yoga vs kriyā-yoga
//  disambiguation), edge label/citation discipline, the commentary→base atlas
//  quirk, sorted-order invariants, cross-lane bookkeeping, the yoga-vedanta
//  modern-band capacity (< WARN), and layout determinism/placement.
// ============================================================================
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONFLUENCE_LANES, CONFLUENCE_ENTRIES, CONFLUENCE_EDGES } from '../../assets/js/core/data/confluence.js';
import { layoutConfluence, filterEntries, entryBySlug, confluenceStats } from '../../assets/js/core/confluence.js';

const LABEL_ENUM = new Set(['documented', 'disputed', 'debunked', 'conspiracy']);
const KIND_ENUM = new Set(['translation', 'influence', 'commentary', 'synthesis', 'refutation', 'adaptation']);
const bySlug = new Map(CONFLUENCE_ENTRIES.map(e => [e.slug, e]));
const edgeKey = g => g.from + '|' + g.to + '|' + g.kind;
const edgeByKey = new Map(CONFLUENCE_EDGES.map(g => [edgeKey(g), g]));

// WARN threshold from docs/plans/r28/atlas-ui.md §3.1 (≤30 working rule; WARN 70%)
const BAND_WARN = 21;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. THE TWO NEW ENTRIES EXIST, CORRECT SHAPE -------------------------
  const viv = bySlug.get('person-vivekananda');
  const yog = bySlug.get('person-yogananda');
  ok(!!viv, 'r32/atlas: person-vivekananda entry present');
  ok(!!yog, 'r32/atlas: person-yogananda entry present');

  if (viv) {
    ok(viv.lane === 'yoga-vedanta', 'r32/atlas: vivekananda in the yoga-vedanta lane');
    ok(viv.kind === 'person', 'r32/atlas: vivekananda kind=person');
    ok(viv.label === 'documented', 'r32/atlas: vivekananda label=documented');
    ok(viv.sortYear === 1863 && viv.sortYearEnd === 1902, 'r32/atlas: vivekananda dates 1863–1902');
    ok(viv.dateCertainty === 'year', 'r32/atlas: vivekananda dateCertainty=year');
    ok(viv.siteLink && viv.siteLink.href === 'greatworks/vivekananda.html', 'r32/atlas: vivekananda siteLink → greatworks/vivekananda.html');
    ok(Array.isArray(viv.sources) && viv.sources.length >= 2, 'r32/atlas: vivekananda ≥2 sources');
    // both-ways framing: the De Michelis / traditionalist debate is described, unresolved
    ok(/De Michelis/.test(viv.body) && /unresolved/.test(viv.body), 'r32/atlas: vivekananda body carries the both-ways (De Michelis, unresolved) framing');
  }
  if (yog) {
    ok(yog.lane === 'yoga-vedanta', 'r32/atlas: yogananda in the yoga-vedanta lane');
    ok(yog.kind === 'person', 'r32/atlas: yogananda kind=person');
    ok(yog.label === 'documented', 'r32/atlas: yogananda label=documented');
    ok(yog.sortYear === 1893 && yog.sortYearEnd === 1952, 'r32/atlas: yogananda dates 1893–1952');
    ok(yog.siteLink && yog.siteLink.href === 'greatworks/yogananda.html', 'r32/atlas: yogananda siteLink → greatworks/yogananda.html');
    ok(Array.isArray(yog.sources) && yog.sources.length >= 2, 'r32/atlas: yogananda ≥2 sources');
    // REQUIRED disambiguation: Kriya Yoga (lineage) vs kriyā-yoga (YS II.1)
    ok(/Kriya Yoga/.test(yog.body) && /kriya-yoga/.test(yog.body) && /II\.1/.test(yog.body),
      'r32/atlas: yogananda body carries the REQUIRED Kriya-Yoga vs kriyā-yoga (YS II.1) disambiguation');
    // miracle narratives framed as the book's claims, never endorsed
    ok(/claims/.test(yog.body) && /never endorsed/.test(yog.body), 'r32/atlas: yogananda miracle narratives framed as the book\'s claims, never endorsed');
  }

  // ---- 2. THE FOUR NEW EDGES -----------------------------------------------
  const NEW_EDGES = [
    { from: 'person-vivekananda', to: 'event-chicago-1893', kind: 'influence' },
    { from: 'person-vivekananda', to: 'raja-yoga-1896', kind: 'influence' },
    { from: 'person-vivekananda', to: 'yoga-sutras', kind: 'commentary' },
    { from: 'person-yogananda', to: 'autobiography-of-a-yogi', kind: 'influence' },
  ];
  for (const spec of NEW_EDGES) {
    const g = edgeByKey.get(spec.from + '|' + spec.to + '|' + spec.kind);
    ok(!!g, `r32/atlas: edge ${spec.from}→${spec.to} (${spec.kind}) present`);
    if (!g) continue;
    ok(bySlug.has(g.from) && bySlug.has(g.to), `r32/atlas: edge ${spec.from}→${spec.to} endpoints resolve (no dangling)`);
    ok(KIND_ENUM.has(g.kind), `r32/atlas: edge ${spec.from}→${spec.to} kind in enum`);
    ok(g.label === 'documented', `r32/atlas: edge ${spec.from}→${spec.to} label=documented`);
    ok(LABEL_ENUM.has(g.label), `r32/atlas: edge ${spec.from}→${spec.to} label in enum`);
    ok(typeof g.bestCitation === 'string' && g.bestCitation.trim().length > 0, `r32/atlas: edge ${spec.from}→${spec.to} carries bestCitation`);
    ok(typeof g.note === 'string' && g.note.trim().length > 0, `r32/atlas: edge ${spec.from}→${spec.to} carries note`);
    ok(typeof g.body === 'string' && Array.isArray(g.sources) && g.sources.length >= 1, `r32/atlas: edge ${spec.from}→${spec.to} has body + sources`);
  }
  // the commentary edge follows the atlas commentary→base-text quirk (from=commentator)
  {
    const c = edgeByKey.get('person-vivekananda|yoga-sutras|commentary');
    ok(c && entryBySlug(c.from).sortYear > entryBySlug(c.to).sortYear,
      'r32/atlas: commentary edge runs commentator(later)→base-text(earlier), the atlas data quirk');
    ok(c && /free translation/.test(c.body), 'r32/atlas: commentary edge body flags the "free translation" rendering layer');
  }

  // ---- 3. CROSS-LANE BOOKKEEPING -------------------------------------------
  // vivekananda→chicago and yogananda→autobiography are yoga-vedanta→confluence
  // crossings; the other two are same-lane (yoga-vedanta internal).
  {
    const cross = g => entryBySlug(g.from) && entryBySlug(g.to) && entryBySlug(g.from).lane !== entryBySlug(g.to).lane;
    ok(cross(edgeByKey.get('person-vivekananda|event-chicago-1893|influence')), 'r32/atlas: vivekananda→chicago-1893 is a cross-lane crossing');
    ok(cross(edgeByKey.get('person-yogananda|autobiography-of-a-yogi|influence')), 'r32/atlas: yogananda→autobiography is a cross-lane crossing');
    ok(!cross(edgeByKey.get('person-vivekananda|raja-yoga-1896|influence')), 'r32/atlas: vivekananda→raja-yoga is same-lane (yoga-vedanta)');
    ok(!cross(edgeByKey.get('person-vivekananda|yoga-sutras|commentary')), 'r32/atlas: vivekananda→yoga-sutras is same-lane (yoga-vedanta)');
  }

  // ---- 4. TOTALS + SORTED-ORDER INVARIANTS ---------------------------------
  ok(CONFLUENCE_ENTRIES.length === 190, `r32/atlas: 190 entries (${CONFLUENCE_ENTRIES.length})`);
  ok(CONFLUENCE_EDGES.length === 155, `r32/atlas: 155 edges (${CONFLUENCE_EDGES.length})`);
  // entries stay sorted by (sortYear, slug)
  let entriesSorted = true;
  for (let i = 1; i < CONFLUENCE_ENTRIES.length; i++) {
    const a = CONFLUENCE_ENTRIES[i - 1], b = CONFLUENCE_ENTRIES[i];
    if (a.sortYear > b.sortYear || (a.sortYear === b.sortYear && a.slug > b.slug)) entriesSorted = false;
  }
  ok(entriesSorted, 'r32/atlas: entries remain sorted by (sortYear, slug) after the append');
  // edges stay sorted by (from, to, kind)
  let edgesSorted = true;
  for (let i = 1; i < CONFLUENCE_EDGES.length; i++) {
    const a = edgeKey(CONFLUENCE_EDGES[i - 1]), b = edgeKey(CONFLUENCE_EDGES[i]);
    if (a > b) edgesSorted = false;
  }
  ok(edgesSorted, 'r32/atlas: edges remain sorted by (from, to, kind) after the append');
  // slug uniqueness holds
  ok(new Set(CONFLUENCE_ENTRIES.map(e => e.slug)).size === CONFLUENCE_ENTRIES.length, 'r32/atlas: entry slugs still unique');

  // ---- 5. DATA-GROWTH CONTRACT: yoga-vedanta modern band under WARN ---------
  // The two additions land in the modern (post-1800 "global") band. UI3
  // clustering ships, so the band absorbs; assert it stays under the WARN line.
  {
    const modern = CONFLUENCE_ENTRIES.filter(e => e.lane === 'yoga-vedanta' && e.sortYear >= 1800);
    ok(modern.length < BAND_WARN, `r32/atlas: yoga-vedanta modern band under WARN (${modern.length} < ${BAND_WARN})`);
  }

  // ---- 6. LAYOUT PLACES THE NEW NODES; DETERMINISM PRESERVED ---------------
  {
    const lo = layoutConfluence({ zoom: 1, width: 1280 });
    ok(lo.nodes.length === CONFLUENCE_ENTRIES.length && lo.edges.length === CONFLUENCE_EDGES.length,
      'r32/atlas: layout places every node + edge including the append');
    ok(lo.nodes.some(n => n.slug === 'person-vivekananda') && lo.nodes.some(n => n.slug === 'person-yogananda'),
      'r32/atlas: both new nodes appear in the layout');
    const lo2 = layoutConfluence({ zoom: 1, width: 1280 });
    ok(JSON.stringify(lo) === JSON.stringify(lo2), 'r32/atlas: layoutConfluence deterministic with the append');
    // stats totals stay internally consistent
    const st = confluenceStats();
    ok(st.entries === CONFLUENCE_ENTRIES.length && st.edges === CONFLUENCE_EDGES.length, 'r32/atlas: confluenceStats totals track the append');
    ok(filterEntries({}).length === CONFLUENCE_ENTRIES.length, 'r32/atlas: filterEntries({}) returns all entries');
  }

  // ---- 7. CROSS-BUILDER siteLink existence (soft; B-WING-EAST owns pages) ---
  // The greatworks author pages (greatworks/{vivekananda,yogananda}.html) are
  // B-WING-EAST's deliverable in the shared worktree; the engine-test / ui3 /
  // r28 siteLink-existSync asserts go green once those pages land. This module
  // asserts only the href STRING (above), never existence — so it stays green
  // standalone regardless of build ordering. (Console log for the operator.)
  for (const slug of ['person-vivekananda', 'person-yogananda']) {
    const e = bySlug.get(slug);
    if (e && e.siteLink && e.siteLink.href) {
      const p = resolve(process.cwd(), 'pages', e.siteLink.href.split('#')[0]);
      if (!existsSync(p)) console.warn(`[r32-atlas-east] note: ${slug} siteLink ${e.siteLink.href} not on disk yet (B-WING-EAST creates it)`);
    }
  }

  return { pass: failures.length === 0, failures };
}

// ============================================================================
//  DRIVES — Chromium sweep descriptors for the two new atlas nodes. The
//  integrator translates these into scripts/browser-verify.mjs steps.
// ============================================================================
export const DRIVES = [
  { page: '/pages/confluence.html', width: 1280, actions: ['load'],
    asserts: ['no console errors',
      '.cfl-node[data-slug="person-vivekananda"] present in the yoga-vedanta lane',
      '.cfl-node[data-slug="person-yogananda"] present in the yoga-vedanta lane'] },
  { page: '/pages/confluence.html#person-yogananda', width: 1280, actions: ['coldload'],
    asserts: ['drawer open', 'drawer shows the greatworks/yogananda.html siteLink',
      'Journeys list includes person-yogananda→autobiography-of-a-yogi with a documented epistemic badge'] },
  { page: '/pages/confluence.html#person-vivekananda', width: 1280, actions: ['coldload'],
    asserts: ['drawer open', 'drawer shows the greatworks/vivekananda.html siteLink',
      'Journeys list shows the three vivekananda edges (chicago-1893, raja-yoga-1896, yoga-sutras) each with an epistemic badge'] },
];
