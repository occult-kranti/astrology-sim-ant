// ============================================================================
//  scripts/tests/r30-compare.mjs — B-COMPARE headless tests for the honest
//  comparison dataset (core/data/competitors.js). Exports
//  `async run() -> {pass, failures[]}` for engine-test.mjs, plus a `DRIVES`
//  array of {page, actions[], asserts[]} for the Chromium sweep.
//
//  Enforces the honesty bar of docs/plans/r28/comparison.md §3.2.5:
//    • every competitor has a known category, a non-empty betterAtThanUs, >=1
//      https source, and a valid `surveyed` ISO date not in the future;
//    • every FEATURE_MATRIX cell key is a real feature id, every column id is
//      `site` or a real competitor id, every cell value ∈ {full,partial,none,
//      unknown}, and every column is covered on every row;
//    • every NOVELTY_CLAIMS entry has a non-empty claim / verify / qualifier;
//    • a SUPERLATIVE GREP over ALL rendered/claim strings bans unqualified
//      best/first/most/unmatched/unrivalled and bare "only" (must be
//      survey-qualified — "…only … we found … in our <date> survey");
//    • the callable compareTools() dispatcher is pure & deterministic.
//  Deterministic; no DOM, no network, no wall-clock staleness assertion (the
//  staleness badge is a rendered app concern, never a test failure).
// ============================================================================
import {
  SURVEY_STAMP, CATEGORIES, COMPETITORS, FEATURE_MATRIX, MATRIX_COLUMNS,
  NOVELTY_CLAIMS, HUMILITY_SUMMARY, competitorById, competitorsByCategory, compareTools,
} from '../../assets/js/core/data/competitors.js';

const CAT_IDS = new Set(CATEGORIES.map(c => c.id));
const CELL_STATES = new Set(['full', 'partial', 'none', 'unknown']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// The superlative grep. Bare best/first/most/unmatched/unrivall(ed) are banned
// outright; "only" is allowed ONLY in the sanctioned survey-qualified form
// (…only … we found/found none/found no … survey…). See comparison.md §3.4.
const BANNED = /\b(best|first|most|unmatched|unrivall?ed|world[- ]?class)\b/i;
const HAS_ONLY = /\bonly\b/i;
const ONLY_OK = /\bonly\b[^.]{0,80}\bsurvey\b/i;   // "…only … survey" in the same sentence

function superlativeMiss(s) {
  if (typeof s !== 'string' || !s) return null;
  if (BANNED.test(s)) return `banned superlative "${(s.match(BANNED) || [])[0]}"`;
  if (HAS_ONLY.test(s) && !ONLY_OK.test(s)) return 'unqualified "only" (must be "…only … survey")';
  return null;
}

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ── survey-level shape ─────────────────────────────────────────────────────
  ok(/^\d{4}-\d{2}$/.test(SURVEY_STAMP), `SURVEY_STAMP is YYYY-MM (got ${SURVEY_STAMP})`);
  ok(COMPETITORS.length >= 25, `>=25 competitors surveyed (got ${COMPETITORS.length})`);
  ok(CATEGORIES.length >= 8, `>=8 categories (got ${CATEGORIES.length})`);

  // A future-date guard uses "now" ONLY to reject impossible records — it never
  // asserts staleness (that is a rendered badge, not a failure).
  const now = new Date();
  const ids = new Set();

  for (const c of COMPETITORS) {
    const at = `competitor ${c.id || '(no id)'}`;
    ok(c.id && !ids.has(c.id), `${at}: id present and unique`);
    ids.add(c.id);
    ok(typeof c.name === 'string' && c.name.length > 1, `${at}: has a name`);
    ok(CAT_IDS.has(c.category), `${at}: category "${c.category}" is a known category`);
    ok(typeof c.what === 'string' && c.what.length > 20, `${at}: has a factual description`);

    // MANDATORY non-empty better-than-us column
    ok(Array.isArray(c.betterAtThanUs) && c.betterAtThanUs.length >= 1
       && c.betterAtThanUs.every(x => typeof x === 'string' && x.length > 3),
       `${at}: non-empty betterAtThanUs (the mandatory column)`);

    // >=1 https source
    ok(Array.isArray(c.sources) && c.sources.length >= 1
       && c.sources.every(u => /^https?:\/\//.test(u)),
       `${at}: >=1 http(s) source URL`);

    // valid surveyed ISO date, not in the future
    ok(ISO_DATE.test(c.surveyed), `${at}: surveyed is an ISO date (got ${c.surveyed})`);
    const d = new Date(c.surveyed + 'T00:00:00Z');
    ok(!isNaN(d) && d.getTime() <= now.getTime() + 86400000, `${at}: surveyed date is not in the future`);

    // the three honesty axes are present & in-enum
    ok(['yes', 'partial', 'no'].includes(c.explains), `${at}: explains axis in {yes,partial,no} (got ${c.explains})`);
    ok(['yes', 'partial', 'rare', 'no'].includes(c.cites), `${at}: cites axis in {yes,partial,rare,no} (got ${c.cites})`);
    ok(typeof c.statesValidity === 'boolean', `${at}: statesValidity is boolean`);
    ok(Array.isArray(c.platforms) && c.platforms.length >= 1, `${at}: has >=1 platform`);
  }

  // The honesty gap the page documents: NONE of the surveyed products state
  // validity (this is the pattern that licenses the page — assert it holds).
  ok(COMPETITORS.every(c => c.statesValidity === false),
     'no surveyed competitor states astrology’s empirical validity (the honesty gap)');

  // ── the feature matrix ─────────────────────────────────────────────────────
  const featureIds = new Set(FEATURE_MATRIX.features.map(f => f.id));
  ok(FEATURE_MATRIX.features.length >= 20, `>=20 feature rows (got ${FEATURE_MATRIX.features.length})`);
  ok(featureIds.size === FEATURE_MATRIX.features.length, 'feature ids are unique');

  for (const f of FEATURE_MATRIX.features) {
    ok(typeof f.label === 'string' && f.label.length > 3, `feature ${f.id}: has a label`);
    ok(typeof f.cite === 'string' && /^https?:\/\//.test(f.cite), `feature ${f.id}: has an http(s) citation`);
    ok(typeof f.rowNote === 'string' && f.rowNote.length > 5, `feature ${f.id}: has a rowNote`);
  }

  const colIds = MATRIX_COLUMNS.map(c => c.id);
  const legalCols = new Set(colIds);
  ok(colIds[0] === 'site', 'first matrix column is `site` (the sticky column)');
  ok(colIds.length >= 10 && colIds.length <= 15, `matrix column count capped ~14 (got ${colIds.length}, Risk 7)`);
  // every non-site column resolves to a real competitor id
  ok(colIds.slice(1).every(id => ids.has(id)), 'every non-site matrix column is a real competitor id');
  // matrix columns are chart software only (never oracle/kabbalah/teaching/atlas)
  ok(colIds.slice(1).every(id => ['western', 'vedic', 'traditional', 'ai'].includes(competitorById(id).category)),
     'no oracle/kabbalah/teaching/atlas product appears as a matrix column (Risk 6)');

  // every cell key is a real feature id; every column present; every value in-enum
  const cellKeys = Object.keys(FEATURE_MATRIX.cells);
  ok(cellKeys.length === featureIds.size, `every feature has a cells row (${cellKeys.length}/${featureIds.size})`);
  for (const key of cellKeys) {
    ok(featureIds.has(key), `cells key "${key}" is a real feature id`);
    const rowObj = FEATURE_MATRIX.cells[key];
    const rowCols = Object.keys(rowObj);
    ok(rowCols.length === colIds.length && rowCols.every(cid => legalCols.has(cid)),
       `cells[${key}]: exactly the ${colIds.length} declared columns`);
    ok(colIds.every(cid => CELL_STATES.has(rowObj[cid])),
       `cells[${key}]: every value in {full,partial,none,unknown}`);
  }
  // the site column is self-assessment; the honesty-signature rows must be `full`
  for (const sig of ['validity-stated', 'contested-flags', 'per-rule-citations', 'byok-ai', 'atlas-timeline', 'handcalc-live']) {
    ok(FEATURE_MATRIX.cells[sig] && FEATURE_MATRIX.cells[sig].site === 'full',
       `cells[${sig}].site === 'full' (a claimed differentiator)`);
  }

  // ── novelty claims ─────────────────────────────────────────────────────────
  ok(NOVELTY_CLAIMS.length === 11, `11 novelty claims (got ${NOVELTY_CLAIMS.length})`);
  for (const [i, n] of NOVELTY_CLAIMS.entries()) {
    ok(typeof n.claim === 'string' && n.claim.length > 15, `claim ${i}: non-empty claim`);
    ok(typeof n.verify === 'string' && n.verify.length > 10, `claim ${i}: non-empty verify (executable)`);
    ok(typeof n.qualifier === 'string' && n.qualifier.length > 10, `claim ${i}: non-empty qualifier`);
  }

  // ── the SUPERLATIVE GREP over every claim/rendered string ──────────────────
  const strings = [];
  const push = (s, where) => { if (typeof s === 'string') strings.push([s, where]); };
  for (const c of COMPETITORS) {
    push(c.what, `${c.id}.what`); push(c.notes, `${c.id}.notes`); push(c.name, `${c.id}.name`);
    (c.betterAtThanUs || []).forEach((x, i) => push(x, `${c.id}.betterAtThanUs[${i}]`));
    (c.unverified || []).forEach((x, i) => push(x, `${c.id}.unverified[${i}]`));
  }
  for (const f of FEATURE_MATRIX.features) { push(f.label, `feature.${f.id}.label`); push(f.rowNote, `feature.${f.id}.rowNote`); }
  for (const [i, n] of NOVELTY_CLAIMS.entries()) { push(n.claim, `claim[${i}].claim`); push(n.verify, `claim[${i}].verify`); push(n.qualifier, `claim[${i}].qualifier`); }
  for (const [i, h] of HUMILITY_SUMMARY.entries()) { push(h.area, `humility[${i}].area`); push(h.text, `humility[${i}].text`); }
  for (const [s, where] of strings) {
    const miss = superlativeMiss(s);
    ok(!miss, `superlative grep — ${where}: ${miss || ''}`);
  }
  // guard the grep is not a no-op
  ok(superlativeMiss('this is the best site') !== null, 'superlative grep catches a planted "best"');
  ok(superlativeMiss('the only interactive checker we found in our 2026-07 survey') === null, 'superlative grep passes the sanctioned "only … survey" form');
  ok(superlativeMiss('we are the only ones') !== null, 'superlative grep catches an unqualified "only"');

  // ── the callable dispatcher (pure & deterministic) ─────────────────────────
  const byId = compareTools({ id: 'solar-fire' });
  ok(byId.found === true && byId.id === 'solar-fire' && Array.isArray(byId.betterAtThanUs) && byId.betterAtThanUs.length >= 1,
     'compareTools({id}) returns the record with betterAtThanUs');
  ok(typeof byId.note === 'string' && /survey date/i.test(byId.note), 'compareTools stamps the survey-date caveat');
  ok(compareTools({ id: 'nope' }).found === false, 'compareTools({id:unknown}).found === false');
  const byCat = compareTools({ category: 'vedic' });
  ok(byCat.count === competitorsByCategory('vedic').length && byCat.count >= 1, 'compareTools({category}) counts that category');
  const summary = compareTools({});
  ok(summary.surveyStamp === SURVEY_STAMP && Array.isArray(summary.noveltyClaims) && summary.noveltyClaims.length === 11,
     'compareTools({}) returns the survey summary with all 11 claims');
  ok(JSON.stringify(compareTools({ id: 'jhora' })) === JSON.stringify(compareTools({ id: 'jhora' })), 'compareTools is deterministic');
  ok(competitorById('astro-com') && competitorById('zzz') === null, 'competitorById hydrates a real id and returns null otherwise');

  // no summary string carries a banned superlative either
  ok(superlativeMiss(summary.honestyGap) === null, 'summary.honestyGap is superlative-clean');

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptors (integrator wires into browser-verify) --
export const DRIVES = [
  {
    page: 'pages/compare.html',
    actions: ['load'],
    asserts: [
      "#method visible and shows the SURVEY_STAMP '2026-07'",
      '#matrix .cmp-matrix-scroll is an overflow-x:auto container (the wide table scrolls inside it, the body never scrolls sideways)',
      '#matrix table caption present; first column th[scope="row"] is sticky (position:sticky, left:0)',
      '#matrix cell glyphs render one of ● ◐ ○ ? per cell',
      '#landscape .cmp-card count equals COMPETITORS.length',
      "every #landscape .cmp-card contains a 'What it does better than this site' heading with >=1 item",
      'each .cmp-card .cmp-staleness badge shows "surveyed N months ago" (computed client-side from surveyed date)',
      '#claims renders 11 .cmp-claim blocks, each with a .cmp-verify and .cmp-qualifier',
      '#humility renders the aggregated better-than-us summary last',
      '0 console errors / pageerrors / failed requests',
      'the site chrome (header.site + footer .disclaimer) is injected (mountChrome ran)',
    ],
  },
  {
    page: 'pages/compare.html',
    actions: ["click '.cmp-filter[data-cat=\"vedic\"]'"],
    asserts: [
      "clicking a category filter shows only .cmp-card[data-cat='vedic'] and hides the rest",
      "clicking '.cmp-filter[data-cat=\"all\"]' restores every card",
      'the active filter button carries aria-pressed="true"',
    ],
  },
  {
    page: 'pages/compare.html',
    actions: ['emulate prefers-reduced-motion: reduce', 'load'],
    asserts: [
      'getAnimations().length === 0 (the page uses no motion at all)',
      'the layout is clean at 390px wide — the page body has no horizontal scrollbar',
    ],
  },
];

export default { run, DRIVES };
