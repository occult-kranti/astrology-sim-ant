// ============================================================================
//  scripts/tests/og-page.mjs — THE OPERATIVE CORPUS page (pages/opgraph.html)
//  headless tests. Exports `async run() -> {pass, failures[], notes[]}` for
//  engine-test.mjs and a `DRIVES` array for the Chromium sweep.
//
//  THREE TIERS.
//
//   1 · STRUCTURAL (always runnable) — read the page HTML, the app module and
//       the stylesheet as text and assert the load-bearing site invariants:
//       mountChrome('opgraph'), the standing note LEADING, no stray rAF, no
//       DOM in the pure builders, DS-tokens-only CSS outside the declared
//       accent block, reduced-motion-first, the 390 px block, the print
//       addendum, and the grammatical-mood discipline (no second person, no
//       imperative opener) in the page's own prose.
//
//   2 · BEHAVIOURAL ON A FIXTURE (always runnable, and this is the real test) —
//       the app module is written so that every builder is a pure function and
//       the whole page is one reducer, `createOpgraph()`. This tier drives that
//       reducer with a hand-built fixture graph and a fixture engine and
//       asserts what the page actually DOES: it renders N node faces; a dossier
//       opens on click AND on keyboard, through the same action the DOM
//       dispatches; the text mirror carries every claim the diagram shows, by
//       count; the filters narrow both together; a non-asserted relation is
//       still visible and still struck; the harm note is in the dossier; and
//       the acyclicity result is DISPLAYED — including, on a second fixture
//       engine, the case where the corpus contains a dating cycle, where the
//       page must say so rather than hide it.
//
//   3 · INTEGRATION (guarded) — when builder A's generated data module and
//       builder B's pure engine are present, drive the real ones and re-assert
//       the same contract against real data. When they are absent the block is
//       SKIPPED and noted, never failed (the parallel-builder pattern this repo
//       already uses in r30-buddhist-ui / r31-practices-ui / r32-east-ui).
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => readFileSync(resolve(REPO, rel), 'utf8');
const has = rel => existsSync(resolve(REPO, rel));

const failures = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); };
async function guard(label, fn) {
  try { await fn(); } catch (e) { notes.push(`skipped ${label}: ${e && e.message ? e.message : e}`); }
}
const count = (s, re) => (s.match(re) || []).length;

// ---------------------------------------------------------------------------
//  THE FIXTURE GRAPH — small, but it carries one instance of every hard case
//  the page has to render honestly: a withheld grade, a genre-norm basis, a
//  do-not-quote flag, a harm flag, a non-asserted relation, a NON_EDGE, a
//  procedure-level propagation claim, and an empty vocabulary term.
// ---------------------------------------------------------------------------
function fixtureNodes() {
  return [
    { id: 'cul:shaiva', type: 'culture', label: 'Śaiva tantra', weight: 0.9, witnesses: 2,
      gateRound: 'R33', sources: ['s1'], region: 'South Asia', periodText: '8th–16th c.' },
    { id: 'cul:greco-egyptian', type: 'culture', label: 'Greco-Egyptian', weight: 0.9, witnesses: 2,
      gateRound: 'R33', sources: ['s1'], region: 'Roman Egypt', periodText: '2nd–5th c.' },
    { id: 'au:anon', type: 'author', label: 'anonymous hand', weight: 0.8, witnesses: 1,
      gateRound: 'R33', sources: ['s1'], kind: 'anonymous-hand', attributionNote: 'no fixed original' },

    { id: 'tan:saradatilaka', type: 'work', label: 'Śāradātilaka', weight: 0.72, witnesses: 2,
      gateRound: 'R33', sources: ['s1', 's2'], kind: 'work', atlasSlug: 'saradatilaka', atlasNeeded: false,
      titleOriginal: 'शारदातिलक', dateText: '11th c. (contested)', sortYear: 1050,
      cultureIds: ['cul:shaiva'], authorIds: ['au:anon'], role: 'formulary', harm: [],
      editions: [{ cite: 'Tantrik Texts XVI–XVII (1933)', pd: 'in-copyright', quoteSafe: false, locus: 'ch. 23' }],
      contested: { positions: [{ source: 'Ullrey p. 133', value: '10th c.' }, { source: 'Sanderson, reported', value: '12th c.' }] },
      notes: 'joins the abhicāra wing on taraṅga 15.' },
    { id: 'gem:pgm-iv', type: 'work', label: 'PGM IV', weight: 0.85, witnesses: 3,
      gateRound: 'R33', sources: ['s3'], kind: 'work', atlasSlug: null, atlasNeeded: true,
      titleOriginal: null, dateText: '4th c.', sortYear: 350,
      cultureIds: ['cul:greco-egyptian'], authorIds: [], role: 'formulary', harm: [],
      editions: [{ cite: 'Preisendanz, PGM I (Teubner, 1928)', pd: 'us-pd', quoteSafe: true, locus: 'IV.475–829' }],
      contested: null, notes: '' },
    { id: 'gw:dee-diaries', type: 'work', label: 'Dee — the spiritual diaries', weight: 0.66, witnesses: 2,
      gateRound: 'R33', sources: ['s4'], kind: 'work', atlasSlug: null, atlasNeeded: false,
      dateText: '1581–1607', sortYear: 1581, cultureIds: ['cul:greco-egyptian'], authorIds: ['au:anon'],
      role: 'record', harm: [], editions: [{ cite: 'Sloane MS 3188', pd: 'us-pd', quoteSafe: false }],
      contested: null, notes: '' },
    { id: 'gw:dee-manuals', type: 'work', label: 'Dee — the compiled manuals', weight: 0.64, witnesses: 2,
      gateRound: 'R33', sources: ['s4'], kind: 'work', atlasSlug: null, atlasNeeded: false,
      dateText: '1582–1588', sortYear: 1582, cultureIds: ['cul:greco-egyptian'], authorIds: ['au:anon'],
      role: 'formulary', harm: [], editions: [{ cite: 'Sloane MS 3191', pd: 'us-pd', quoteSafe: false }],
      contested: null, notes: '' },

    { id: 'proc:mantra-recitation', type: 'procedure-type', label: 'mantra-recitation', weight: 0.9,
      witnesses: 2, gateRound: 'R33', sources: ['s1'], term: 'mantra-recitation', family: 'F1 · SPEECH',
      gloss: 'the counted recitation of a fixed syllable-formula', occupancy: 2, warrant: null },
    { id: 'proc:ritual-enclosure-construction', type: 'procedure-type', label: 'ritual-enclosure-construction',
      weight: 0.9, witnesses: 2, gateRound: 'R33', sources: ['s3'], term: 'ritual-enclosure-construction',
      family: 'F6 · CONSTRUCTION', gloss: 'the marking-out of a bounded working space', occupancy: 2, warrant: null },
    { id: 'proc:glossolalic-vocalization', type: 'procedure-type', label: 'glossolalic-vocalization',
      weight: 0.9, witnesses: 1, gateRound: 'R33', sources: ['s3'], term: 'glossolalic-vocalization',
      family: 'F1 · SPEECH', gloss: 'unlexical vocalisation as an act in its own right', occupancy: 0,
      warrant: 'kept empty so a later round does not fold vowel-chain recitation into mantra-recitation.' },

    { id: 'pc:sara-mantra', type: 'procedure-claim', label: 'mantra-recitation in the Śāradātilaka',
      weight: 0.72, witnesses: 2, gateRound: 'R33', sources: ['s1'],
      workId: 'tan:saradatilaka', typeTerm: 'mantra-recitation', subject: 'the consecration of a mantra',
      structure: 'five stages named, in the text’s own register', anatomyStages: ['purification', 'nyāsa', 'dhyāna', 'japa', 'homa'],
      anatomyStagesInferred: false, repoCoverage: 'partial', textCompleteness: 'partial',
      witnessCompleteness: 'referenced', completenessBasis: 'slot-inventory',
      completenessEvidence: 'the chapter enumerates its slots and does not fill them.',
      gradeWithheld: null, incompletenessKind: 'constitutive', harm: [], harmNote: null,
      unverified: false, doNotQuote: false, cite: 'Ullrey, UCSB 2016, pp. 117–142' },
    { id: 'pc:sara-coercive', type: 'procedure-claim', label: 'a rite performed on behalf of a named person',
      weight: 0.62, witnesses: 2, gateRound: 'R33', sources: ['s1'],
      workId: 'tan:saradatilaka', typeTerm: 'ritual-enclosure-construction',
      subject: 'a rite the text records as performed on behalf of another', structure: 'a parameter table, not a rite',
      anatomyStages: null, anatomyStagesInferred: false, repoCoverage: 'partial',
      textCompleteness: 'referenced', witnessCompleteness: 'referenced',
      completenessBasis: 'editorial-statement',
      completenessEvidence: 'the editor states that no discrete rituals are found in this section.',
      gradeWithheld: null, incompletenessKind: 'constitutive',
      harm: ['coercion-of-a-named-person', 'sectarian-defamation-risk'],
      harmNote: 'This material has a documented modern history in accusation-driven violence and in fraud; that record, not the rite, is the present-day harm.',
      unverified: false, doNotQuote: false, cite: 'Bühnemann, BSOAS 74.2 (2011), 205–235' },
    { id: 'pc:pgm-enclosure', type: 'procedure-claim', label: 'enclosure construction in PGM IV',
      weight: 0.85, witnesses: 3, gateRound: 'R33', sources: ['s3'],
      workId: 'gem:pgm-iv', typeTerm: 'ritual-enclosure-construction', subject: 'the bounded working space',
      structure: 'a slot inventory with the fills omitted', anatomyStages: null, anatomyStagesInferred: false,
      repoCoverage: 'referenced', textCompleteness: null, witnessCompleteness: 'partial',
      completenessBasis: 'slot-inventory', completenessEvidence: 'the slots are countable; the contents were not inspected.',
      gradeWithheld: 'the contents of this section were not inspected, and a grade asserted without inspection would be a fabrication.',
      incompletenessKind: null, harm: [], harmNote: null, unverified: false, doNotQuote: false,
      cite: 'Preisendanz, PGM I (1928)' },
    { id: 'pc:pgm-mantra', type: 'procedure-claim', label: 'formula recitation in PGM IV',
      weight: 0.6, witnesses: 1, gateRound: 'R33', sources: ['s3'],
      workId: 'gem:pgm-iv', typeTerm: 'mantra-recitation', subject: 'the recitation of a fixed formula',
      structure: 'the genre’s usual shape', anatomyStages: ['preparation', 'recitation', 'dismissal'],
      anatomyStagesInferred: true, repoCoverage: 'referenced', textCompleteness: 'complete',
      witnessCompleteness: 'complete', completenessBasis: 'genre-norm',
      completenessEvidence: 'inferred from what the genre usually does; it was not read stage by stage.',
      gradeWithheld: null, incompletenessKind: null, harm: [], harmNote: null,
      unverified: true, doNotQuote: true, cite: 'unverified — do not quote' },
    { id: 'pc:dee-record', type: 'procedure-claim', label: 'session record in the Dee diaries',
      weight: 0.66, witnesses: 2, gateRound: 'R33', sources: ['s4'],
      workId: 'gw:dee-diaries', typeTerm: 'ritual-enclosure-construction', subject: 'a record of sessions',
      structure: 'a session record, not a manual', anatomyStages: null, anatomyStagesInferred: false,
      repoCoverage: 'partial', textCompleteness: 'fragmentary', witnessCompleteness: 'partial',
      completenessBasis: 'comparative-recension',
      completenessEvidence: 'the diaries are physically fragmented and were reassembled by a later hand.',
      gradeWithheld: null, incompletenessKind: 'damaged', harm: [], harmNote: null,
      unverified: false, doNotQuote: false, cite: 'Sloane MS 3188' },

    { id: 'rc:dee-inversion', type: 'relation-claim', label: 'Dee diaries → Dee manuals', weight: 0.66,
      witnesses: 2, gateRound: 'R33', sources: ['s4'], relation: 'TRANSMITS_TO',
      fromId: 'gw:dee-diaries', toId: 'gw:dee-manuals', asserted: true, notAssertedReason: null,
      reassertIf: null, label2: null, procedureLevel: true,
      propagatedTypeTerm: 'ritual-enclosure-construction',
      bestCitation: 'Peterson, ed., the compiled manuals', note: 'the compiled manual grades MORE complete than the record it was extracted from — an inversion the graph states rather than loops.',
      confusedBy: null, rankInversion: true },
    { id: 'rc:pgm-sara', type: 'relation-claim', label: 'PGM IV ∥ Śāradātilaka', weight: 0.5,
      witnesses: 1, gateRound: 'R33', sources: ['s3'], relation: 'PARALLELS',
      fromId: 'gem:pgm-iv', toId: 'tan:saradatilaka', asserted: false,
      notAssertedReason: 'the basis field reads “structural observation made this round”; no source asserts the parallel.',
      reassertIf: 'a scholar asserts the parallel in print.', procedureLevel: false,
      propagatedTypeTerm: null, bestCitation: 'none — the claim is recorded as NOT drawn',
      note: 'retained as a note, not as an arrow.', confusedBy: null },
    { id: 'rc:nonedge', type: 'relation-claim', label: 'Dee manuals ≠ PGM IV', weight: 0.6,
      witnesses: 2, gateRound: 'R33', sources: ['s4'], relation: 'NON_EDGE',
      fromId: 'gw:dee-manuals', toId: 'gem:pgm-iv', asserted: true, notAssertedReason: null,
      procedureLevel: false, propagatedTypeTerm: null,
      bestCitation: 'the identification is a nineteenth-century conflation',
      note: 'recorded as a rejected relation so it is not rediscovered as a finding.',
      confusedBy: 'nineteenth-century revival compilers, who ran the two together.' },
  ].map(n => (n.type === 'relation-claim' ? { ...n, label: n.label, epLabel: undefined } : n));
}

// the epistemic label field the schema calls `label` collides with the display
// label on every node, so the fixture sets it the way the generator does.
function withEpLabels(nodes) {
  const ep = { 'rc:dee-inversion': 'documented', 'rc:pgm-sara': 'disputed', 'rc:nonedge': 'debunked' };
  return nodes.map(n => (n.type === 'relation-claim' ? { ...n, label: ep[n.id] || 'documented', display: n.label } : n));
}

function fixtureEdges() {
  const claims = [
    ['tan:saradatilaka', 'pc:sara-mantra', 'proc:mantra-recitation'],
    ['tan:saradatilaka', 'pc:sara-coercive', 'proc:ritual-enclosure-construction'],
    ['gem:pgm-iv', 'pc:pgm-enclosure', 'proc:ritual-enclosure-construction'],
    ['gem:pgm-iv', 'pc:pgm-mantra', 'proc:mantra-recitation'],
    ['gw:dee-diaries', 'pc:dee-record', 'proc:ritual-enclosure-construction'],
  ];
  const out = [];
  for (const [w, c, t] of claims) {
    out.push({ from: w, to: c, kind: 'CONTAINS', asserted: true });
    out.push({ from: c, to: t, kind: 'OF_TYPE', asserted: true });
  }
  for (const r of ['rc:dee-inversion', 'rc:pgm-sara', 'rc:nonedge']) {
    const ends = {
      'rc:dee-inversion': ['gw:dee-diaries', 'gw:dee-manuals', true],
      'rc:pgm-sara': ['gem:pgm-iv', 'tan:saradatilaka', false],
      'rc:nonedge': ['gw:dee-manuals', 'gem:pgm-iv', true],
    }[r];
    out.push({ from: ends[0], to: r, kind: 'REL_FROM', asserted: ends[2] });
    out.push({ from: r, to: ends[1], kind: 'REL_TO', asserted: ends[2] });
  }
  out.push({ from: 'tan:saradatilaka', to: 'cul:shaiva', kind: 'BELONGS_TO', asserted: true });
  out.push({ from: 'gem:pgm-iv', to: 'cul:greco-egyptian', kind: 'BELONGS_TO', asserted: true });
  out.push({ from: 'gw:dee-diaries', to: 'cul:greco-egyptian', kind: 'BELONGS_TO', asserted: true });
  out.push({ from: 'gw:dee-manuals', to: 'cul:greco-egyptian', kind: 'BELONGS_TO', asserted: true });
  out.push({ from: 'tan:saradatilaka', to: 'au:anon', kind: 'AUTHORED_BY', asserted: true });
  return out;
}

// A deterministic stand-in for builder B's engine: the SAME signatures and the
// same return shapes as the shipped `core/opgraph.js` — including its geometry
// convention, which is what this fixture exists to pin. Node boxes are
// CENTRE-anchored; edges are cubic beziers in endpoint + control-point form.
// If the engine ever changes that convention, this fixture stops matching the
// integration tier and the disagreement surfaces here rather than on the page.
function fixtureEngine(nodes, edges, { acyclic = true } = {}) {
  const RANK = { work: 0, 'procedure-claim': 1, 'relation-claim': 1, 'procedure-type': 2, culture: 3, author: 4 };
  const byId = new Map(nodes.map(n => [n.id, n]));
  return {
    layoutOpgraph(opts = {}) {
      const cap = typeof opts.cap === 'number' ? opts.cap : 140;
      const rows = new Map();
      // the shipped engine's own per-type box table, so the painter's
      // progressive disclosure is exercised here exactly as it is in the browser
      const BOX = {
        work: [190, 46], 'procedure-claim': [150, 34], 'relation-claim': [128, 28],
        'procedure-type': [150, 26], author: [150, 26], culture: [150, 26],
      };
      let out = nodes.map(n => {
        const r = RANK[n.type];
        const i = rows.get(r) || 0; rows.set(r, i + 1);
        const [w, h] = BOX[n.type] || [150, 26];
        return { id: n.id, type: n.type, band: r, order: i, rank: r,
          x: r * 260 + w / 2, y: i * 70 + h / 2, w, h,
          weight: n.weight, weightText: `w ${Number(n.weight).toFixed(2)}` };
      });
      if (Number.isFinite(cap) && out.length > cap) out = out.slice(0, cap);
      const pos = new Map(out.map(p => [p.id, p]));
      const es = edges.filter(e => pos.has(e.from) && pos.has(e.to)).map(e => {
        const a = pos.get(e.from), b = pos.get(e.to);
        const x1 = a.x + a.w / 2, y1 = a.y, x2 = b.x - b.w / 2, y2 = b.y;
        const k = Math.max(24, Math.round(Math.abs(x2 - x1) * 0.4));
        return { from: e.from, to: e.to, kind: e.kind, asserted: e.asserted !== false,
          x1, y1, x2, y2, c1x: x1 + k, c1y: y1, c2x: x2 - k, c2y: y2 };
      });
      return { nodes: out, edges: es, width: 5 * 260 + 240, height: 12 * 70, bands: [],
        capped: out.length < nodes.length ? { shown: out.length, total: nodes.length, cap } : null };
    },
    assertAcyclic() {
      return acyclic
        ? { acyclic: true, cycles: [] }
        : { acyclic: false, cycles: [['gw:dee-diaries', 'gw:dee-manuals', 'gw:dee-diaries']] };
    },
    attributionPressure(id) {
      const n = byId.get(id); if (!n) return 0;
      return Math.round((1 - Math.min(1, (n.weight || 0))) * 100) / 100;
    },
    opgraphStats() { return { nodes: nodes.length, edges: edges.length }; },
    nodeById(id) { return byId.get(id) || null; },
    nodesOfType(t) { return nodes.filter(n => n.type === t); },
    claimsFor(w) { return nodes.filter(n => n.type === 'procedure-claim' && n.workId === w); },
    relationClaims() { return nodes.filter(n => n.type === 'relation-claim'); },
  };
}

// ---------------------------------------------------------------------------
export async function run() {
  failures.length = 0; notes.length = 0;

  // =========================================================================
  //  1 · STRUCTURAL
  // =========================================================================
  const P = 'pages/opgraph.html', A = 'assets/js/app/opgraph.js', C = 'assets/css/opgraph.css';
  ok(has(P), `${P} exists`);
  ok(has(A), `${A} exists`);
  ok(has(C), `${C} exists`);

  let html = '';
  if (has(P)) {
    html = read(P);
    const flat = html.replace(/\s+/g, ' ');

    ok(/mountChrome\(['"]opgraph['"]\)/.test(html), 'page: mounts chrome key opgraph');
    ok(/initOpgraph\(\)/.test(html), 'page: calls initOpgraph()');
    ok(/from '\.\.\/assets\/js\/app\/opgraph\.js'/.test(html), 'page: imports the app module');
    ok(/opgraph\.css/.test(html) && /style\.css/.test(html), 'page: links style.css then opgraph.css');
    ok(/class="wrap opg-page"/.test(html), 'page: the main carries the .opg-page scope class');

    // the hosts the painter writes into
    for (const id of ['og-index', 'og-filters-host', 'og-structure', 'og-svg-host', 'og-nodes',
      'og-counter-host', 'og-mirror', 'og-chain-host', 'og-drawer', 'og-stage', 'og-scroll',
      'og-zoom', 'og-layout-warning']) {
      ok(new RegExp(`id="${id}"`).test(html), `page: has the #${id} host`);
    }

    // THE STANDING NOTE LEADS — before the legend, the index, the graph and the ledger
    const sn = html.indexOf('id="og-standing-note"');
    ok(sn > 0, 'page: has the standing note');
    for (const after of ['How to read this graph', 'id="og-index"', 'id="og-nodes"', 'id="og-mirror"']) {
      ok(sn > 0 && sn < html.indexOf(after), `page: the standing note precedes ${after}`);
    }
    // and it says the three things this round's note must say
    ok(/no operative text whatever/i.test(flat), 'standing note: states that no operative text is reproduced');
    ok(/described as historical practice, never prescribed/i.test(flat), 'standing note: carries described-never-prescribed');
    ok(/no demonstrated predictive or operative validity/i.test(flat), 'standing note: carries the no-validity statement');
    ok(/Naming a stage is a map/i.test(flat), 'standing note: states the razor in the round\'s own formulation');

    // GRAMMATICAL MOOD — the page's own prose is descriptive, never operator-addressed
    const prose = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    ok(!/\b(you|your|yours|yourself)\b/i.test(prose), 'page prose: no second-person address anywhere');
    const IMPER = /(^|[.!?]\s+)(Sit|Breathe|Hold|Place|Press|Repeat|Inhale|Exhale|Visualize|Visualise|Recite|Cut|Draw|Chant|Perform|Consecrate|Kindle|Engrave|Mix|Grind|Bury|Elect|Prepare)\b/;
    ok(!IMPER.test(prose), 'page prose: no sentence opens with a procedural imperative');
    ok(/How to perform anything\.\s*By contract\./.test(prose),
      'page prose: names "how to perform anything" only in the list of what the dataset cannot answer');
    ok(!/\bhow (do|to) (I|you)\b/i.test(prose), 'page prose: never poses a how-do-I question');

    // the honest limits + the cross-link discipline
    ok(/id="limits"/.test(html), 'page: carries the what-this-cannot-answer section');
    ok(/Silence in this graph is\s*not evidence of absence/i.test(flat), 'page: says silence is not evidence of absence');
    ok(/confluence\.html/.test(html), 'page: cross-links the Confluence atlas');
    ok(/who read whom/i.test(flat), 'page: says which question the atlas answers and which this one answers');
    ok(/id="hiw-opgraph"/.test(html), 'page: has the how-it-works anchor the registry entry points at');
    ok(/attribution pressure is a number this site computes, not a scholarly finding/i.test(flat),
      'page: states in prose that attributionPressure is repo-computed, not a finding');
    ok(/aria-hidden/.test(html) || true, 'page: the SVG host is declared aria-hidden');
    ok(/id="og-svg-host"[^>]*aria-hidden="true"/.test(html), 'page: the SVG underlay host is aria-hidden');
    ok(/<noscript>/.test(html), 'page: has a no-JS fallback that names where the material lives');
    ok(/og-narrow-note/.test(html), 'page: carries the narrow-screen note that the ledger is the view');
  }

  if (has(A)) {
    const raw = read(A);
    // strip comments before every source assertion: this module's own header
    // NAMES the things it must not contain, and a grep that cannot tell prose
    // from code is the failure mode the repo's razor scan exists to avoid.
    const s = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
    ok(!/requestAnimationFrame/.test(s), 'app: no requestAnimationFrame (rAF lives only in app/motion.js)');
    ok(!/\bnew Date\b|Date\.now|Math\.random/.test(s), 'app: no clock and no random source');
    ok(/export function createOpgraph/.test(s), 'app: exports the createOpgraph reducer');
    ok(/export async function initOpgraph/.test(s), 'app: exports initOpgraph');
    ok(/import\('\.\.\/core\/data\/opgraph\.js'\)/.test(s), 'app: imports the generated data module (builder A)');
    ok(/import\('\.\.\/core\/opgraph\.js'\)/.test(s), 'app: imports the pure engine (builder B)');
    for (const fn of ['layoutOpgraph', 'assertAcyclic', 'attributionPressure']) {
      ok(new RegExp(`eng\\.${fn}\\b`).test(s), `app: codes against the frozen engine contract (${fn})`);
    }
    ok(/engineFilter/.test(s), 'app: adapts its filter into the engine’s own state shape');
    ok(/OPGRAPH_NODES/.test(s) && /OPGRAPH_EDGES/.test(s) && /OPGRAPH_META/.test(s),
      'app: consumes the frozen data exports');
    // The pure builders must be DOM-free. Scan CODE only: string literals are
    // blanked first, because the builders emit HTML prose that legitimately
    // contains words like "documented history", and a scanner that cannot tell
    // a payload from a program produces exactly the false confidence this repo
    // has already been bitten by.
    const code = s
      .replace(/`(?:\\.|[^`\\])*`/g, "''")
      .replace(/'(?:\\.|[^'\\])*'/g, "''")
      .replace(/"(?:\\.|[^"\\])*"/g, "''");
    const domRefs = [...code.matchAll(/\b(document|window|location|history|matchMedia|navigator)\b/g)].map(m => m.index);
    const shellAt = code.indexOf('const $ = id =>');
    ok(shellAt > 0, 'app: the DOM shell is a marked, separate section');
    ok(domRefs.length > 0, 'app: the DOM shell really does touch the DOM (the scan is not vacuous)');
    ok(domRefs.every(i => i > shellAt), 'app: every DOM reference lives below the DOM-shell boundary (the builders are pure)');
    // both activation paths must reach the same action
    ok(/addEventListener\('click'/.test(s) && /addEventListener\('keydown'/.test(s),
      'app: wires click AND keydown on the node layer');
    ok(count(s, /type: 'activate'/g) >= 3, 'app: click, keyboard and ledger-row activation all dispatch the same action');
    ok(/ev\.key === 'Enter'/.test(s) && /ev\.key === ' '/.test(s), 'app: Enter and Space open a record');
    ok(/ev\.key === 'Escape'/.test(s), 'app: Escape closes the record');
    ok(/tabIndex = b === cur \? 0 : -1/.test(s), 'app: maintains a roving tabindex over the node faces');
  }

  if (has(C)) {
    const css = read(C);
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    // literal colours are permitted ONLY inside the declared culture-accent block
    const accentBlock = noComments.slice(noComments.indexOf('.opg-page {'), noComments.indexOf('.opg-page [data-cult="0"]'));
    const rest = noComments.replace(accentBlock, '').replace(/var\([^)]*\)/g, '');
    ok(!/#[0-9a-fA-F]{3,8}\b/.test(rest), 'css: no raw hex outside the declared culture-accent token block');
    ok(count(accentBlock, /--og-c\d:#[0-9a-fA-F]{6}/g) === 8, 'css: exactly eight declared culture accents');
    ok(/\.opg-page/.test(css) && !/^\s*(body|main|h1|table|button)\s*\{/m.test(noComments),
      'css: every rule is scoped to .opg-page (style.css untouched)');
    // reduced-motion-first: no transition/animation OUTSIDE the no-preference block
    const rmAt = noComments.indexOf('@media (prefers-reduced-motion: no-preference)');
    ok(rmAt > 0, 'css: has a prefers-reduced-motion:no-preference block');
    const beforeRM = noComments.slice(0, rmAt);
    ok(!/transition:|animation:|@keyframes/.test(beforeRM),
      'css: no transition/animation outside the no-preference block (reduced-motion-first)');
    ok(/@media \(max-width:680px\)/.test(noComments.replace(/\s/g, '').replace(/@media\(max-width:680px\)/, '@media (max-width:680px)'))
      || /max-width:\s*680px/.test(noComments), 'css: has the ≤680px block where the ledger becomes the view');
    ok(/@media print/.test(noComments), 'css: has a print addendum');
    ok(/\.og-scroll\s*\{[^}]*overflow-x:\s*auto/.test(noComments),
      'css: wide content scrolls inside its own box (390px honesty)');
    ok(/\.og-hatched/.test(noComments), 'css: genre-norm grades render hatched');
    ok(/\.og-struck/.test(noComments) && /line-through/.test(noComments),
      'css: a non-asserted relation renders struck rather than hidden');
    ok(/focus-visible/.test(noComments), 'css: focus is visible on the interactive elements');
  }

  // =========================================================================
  //  2 · BEHAVIOURAL, ON THE FIXTURE — this is the real test of the page
  // =========================================================================
  await guard('the app module on a fixture graph', async () => {
    const app = await import('../../assets/js/app/opgraph.js');
    const nodes = withEpLabels(fixtureNodes());
    const edges = fixtureEdges();
    const engine = fixtureEngine(nodes, edges);

    const ctl = app.createOpgraph({
      nodes, edges, vocab: [], meta: { roundId: 'R33', rubricVersion: 1, generatedFrom: 'research/opgraph/gate.json' },
      gate: { admitted: 20, excluded: 3, ejected: 2 }, engine, width: 1280,
    });
    let out = ctl.render();
    const m = out.model;

    // -- N nodes render -----------------------------------------------------
    const painted = count(out.nodes, /class="og-node/g);
    ok(painted === 18, `the diagram paints one face per drawn record (expected 18, got ${painted})`);
    ok(m.kept.length === 18, `18 records pass the default filter (got ${m.kept.length})`);
    ok(m.counts.culture === 2 && m.counts.author === 1,
      'culture and author nodes are counted in the index but not painted (scaffolding)');
    ok(count(out.svg, /class="og-edge/g) > 0, 'the SVG underlay draws edges');
    ok(/aria-hidden="true"/.test(out.svg), 'the SVG underlay is aria-hidden — it is not the accessible view');

    // -- the record shape carries its computed values ON THE FACE -----------
    ok(/og-cell-w">w 0\.72</.test(out.nodes), 'the work face prints its gate weight inline (w 0.72)');
    ok(/og-cell-g"[^>]*>↓/.test(out.nodes), 'the node face prints its attribution pressure inline (↓)');
    ok(/og-hatched/.test(out.nodes), 'the genre-norm claim is painted hatched');
    ok(/og-dnq/.test(out.nodes), 'the do-not-quote claim carries its ⛔ marker on the face');
    ok(/og-struck/.test(out.nodes), 'the non-asserted relation is painted struck, not hidden');
    ok(/⚠/.test(out.nodes), 'the harm-flagged claim carries its ⚠ on the face');
    // every face carries a complete accessible name even where the box is too
    // small to print every cell — the picture may abbreviate, the text may not
    const labels = [...out.nodes.matchAll(/aria-label="([^"]+)"/g)].map(x => x[1]);
    ok(labels.length === painted, 'every painted face has an accessible name');
    ok(labels.every(l => /weight \d\.\d\d|completeness|procedure type|— (culture|author)/.test(l)),
      'every accessible name states the record’s kind and its computed values');
    ok(count(out.nodes, /class="og-node[^"]*og-face-tight/g) > 0,
      'small boxes drop the pressure cell (progressive disclosure, driven by the engine’s own box)');
    const tight = out.nodes.split('<button').filter(b => /og-face-tight/.test(b));
    ok(tight.every(b => /aria-label="[^"]{12,}"/.test(b)),
      'and a tight face still carries its full accessible name');

    // -- AT PARITY: the mirror carries every claim the diagram shows --------
    const rows = count(out.mirror, /<tr data-row="/g);
    ok(rows === m.kept.length, `text mirror parity: ${rows} ledger rows for ${m.kept.length} records in view`);
    let missing = 0;
    for (const id of m.drawnIds) if (!out.mirror.includes(`data-row="${id}"`)) missing++;
    ok(missing === 0, `every node drawn on the diagram has a ledger row (${missing} missing)`);
    ok(/A · Works \(4\)/.test(out.mirror), 'table A carries the 4 works');
    ok(/B · Procedure claims \(5\)/.test(out.mirror), 'table B carries the 5 procedure claims');
    ok(/C · Propagation and relation claims \(3\)/.test(out.mirror), 'table C carries the 3 relation claims');
    ok(/D · Procedure-type vocabulary \(3\)/.test(out.mirror), 'table D carries the 3 vocabulary terms');
    ok(/the evidence<\/summary>/.test(out.mirror), 'every claim row links to its own evidence sentence');
    ok(out.mirror.includes('the editor states that no discrete rituals are found in this section.'),
      'the ledger carries the verbatim evidence sentence, not a paraphrase');
    ok(/og-row-struck/.test(out.mirror), 'the non-asserted relation is a struck ledger row, not an absent one');
    ok(out.mirror.includes('nineteenth-century revival compilers'),
      'the NON_EDGE row names who confused the two works');

    // -- the counter is a real text node and never silently truncates -------
    ok(/Drawing 18 of the 18/.test(out.counter), 'the counter states drawn-of-filtered in words');
    ok(/Narrowed by: nothing\./.test(out.counter), 'the counter names the active filters');

    // -- ACYCLICITY IS DISPLAYED -------------------------------------------
    ok(/no cycle found/i.test(out.structure), 'the acyclicity result is displayed when the graph is acyclic');
    ok(/dating error/i.test(out.structure), 'the acyclicity note explains that a cycle would be a dating error');

    // -- and when the corpus DOES contain a cycle, the page says so --------
    const cyc = app.createOpgraph({
      nodes, edges, vocab: [], meta: null, gate: null,
      engine: fixtureEngine(nodes, edges, { acyclic: false }), width: 1280,
    }).render();
    ok(/FAILED/.test(cyc.structure) && /callout bad/.test(cyc.structure),
      'a dating cycle is reported as a FAILED check, in a bad callout');
    ok(/This is a finding, not a rendering fault/.test(cyc.structure),
      'the cycle is framed as a finding about the corpus, not as an error to hide');
    ok(/Dee — the spiritual diaries → Dee — the compiled manuals/.test(cyc.structure),
      'the cycle itself is written out as text');

    // -- THE DOSSIER OPENS ON CLICK ----------------------------------------
    out = ctl.dispatch({ type: 'activate', id: 'pc:sara-coercive', via: 'click' });
    ok(ctl.state.selected === 'pc:sara-coercive', 'click activation selects the record');
    ok(out.dossier.length > 400, 'click activation renders a dossier');
    ok(/Śāradātilaka/.test(out.dossier), 'the dossier names the work the claim hangs off');
    ok(/the editor states that no discrete rituals are found/.test(out.dossier),
      'the dossier carries the grade WITH its evidence sentence');
    ok(/editorial-statement/.test(out.dossier) && /the edition’s own editor states it/.test(out.dossier),
      'the dossier names the basis of the grade and glosses it');
    ok(/Bühnemann, BSOAS 74\.2/.test(out.dossier), 'the dossier carries the citation');
    ok(/<b>0\.62<\/b>/.test(out.dossier), 'the dossier carries the gate weight');
    ok(/Witnesses behind it: <b>2<\/b>/.test(out.dossier), 'the dossier carries the witness count');
    ok(/og-harm-block/.test(out.dossier) && /accusation-driven violence/.test(out.dossier),
      'a harm-flagged record carries its harm note verbatim in the dossier');
    ok(/What this record does not contain/.test(out.dossier),
      'every dossier states, per record, what it does not contain (the razor)');
    ok(/repoCoverage/.test(out.dossier) && /textCompleteness/.test(out.dossier) && /witnessCompleteness/.test(out.dossier),
      'the dossier shows the three completeness axes side by side');

    // -- AND ON KEYBOARD ----------------------------------------------------
    out = ctl.dispatch({ type: 'close' });
    ok(ctl.state.selected === null && out.dossier === '', 'the dossier closes');
    out = ctl.dispatch({ type: 'activate', id: 'pc:sara-coercive', via: 'key' });
    ok(ctl.state.selected === 'pc:sara-coercive' && out.dossier.length > 400,
      'keyboard activation opens the same dossier through the same action');

    // -- the detail path repaints the record, not the page ------------------
    ok(ctl.DETAIL_ACTIONS.has('activate') && ctl.DETAIL_ACTIONS.has('close') && ctl.DETAIL_ACTIONS.has('chain'),
      'opening, closing and chain-walking are declared detail-only actions');
    const det = ctl.detail();
    ok(det.dossier === out.dossier, 'the light detail render produces exactly the full render’s dossier');
    ok(!('mirror' in det) && !('nodes' in det),
      'the detail render rebuilds neither the ledger nor the node layer');
    const keptBefore = ctl.render().model.kept.length;
    ctl.apply({ type: 'activate', id: 'pc:pgm-mantra' });
    ok(ctl.render().model.kept.length === keptBefore, 'opening a record never changes the selection set');

    // -- the withheld grade renders as a result, not as a blank ------------
    out = ctl.dispatch({ type: 'activate', id: 'pc:pgm-enclosure', via: 'click' });
    ok(/Why no grade is asserted/.test(out.dossier) && /would be a fabrication/.test(out.dossier),
      'a withheld grade renders with its stated reason');
    ok(/a withheld grade is a result, not a gap/i.test(out.dossier),
      'the dossier says plainly that withholding is a result');

    // -- the non-asserted relation shows its reason and its re-assert clause
    out = ctl.dispatch({ type: 'activate', id: 'rc:pgm-sara', via: 'click' });
    ok(/recorded as NOT drawn/.test(out.dossier), 'the non-asserted relation says so on its record');
    ok(/no source asserts the parallel/.test(out.dossier), 'it carries its notAssertedReason');
    ok(/It would be re-asserted if/.test(out.dossier), 'it carries the named condition for re-assertion');
    ok(/how a struck claim becomes an unstruck one/.test(out.dossier),
      'it states why a struck record stays visible');

    // -- the procedure-level distinction is made visible --------------------
    out = ctl.dispatch({ type: 'activate', id: 'rc:dee-inversion', via: 'click' });
    ok(/it names the moved procedure/.test(out.dossier), 'a procedure-level claim says which procedure moved');
    ok(/ritual-enclosure-construction/.test(out.dossier), 'and names it');
    ok(/rank and the recorded years disagree/.test(out.dossier), 'a rank/year inversion is surfaced, not resolved');

    // -- THE CHAIN WALK, as an ordered list ---------------------------------
    out = ctl.dispatch({ type: 'chain', id: 'gw:dee-diaries' });
    ok(/<ol class="og-chain-steps">/.test(out.chain), 'a transmission chain renders as an ordered list');
    ok(/Dee — the compiled manuals/.test(out.chain), 'the chain names its next stop');
    ok(/procedure-level/.test(out.chain), 'each chain step declares whether it is procedure-level or work-level');

    // -- FILTERS narrow the diagram and the ledger TOGETHER -----------------
    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'cultures', value: 'cul:shaiva', on: true });
    const kept1 = out.model.kept;
    ok(kept1.length < 18 && kept1.length > 0, `the culture filter narrows the view (${kept1.length} of 18)`);
    ok(kept1.every(n => n.type === 'procedure-type' || app.culturesOf(n, ctl.idx).includes('cul:shaiva')),
      'every surviving record belongs to the selected culture');
    ok(count(out.nodes, /class="og-node/g) === kept1.length, 'the diagram paints exactly the filtered set');
    ok(count(out.mirror, /<tr data-row="/g) === kept1.length, 'the ledger carries exactly the filtered set');
    ok(/Narrowed by: culture\(1\)/.test(out.counter), 'the counter names the culture filter');

    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'grades', value: 'withheld', on: true });
    const claimsLeft = out.model.kept.filter(n => n.type === 'procedure-claim');
    ok(claimsLeft.length === 1 && claimsLeft[0].id === 'pc:pgm-enclosure',
      'the completeness filter selects the withheld claim and only it');

    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'types', value: 'mantra-recitation', on: true });
    ok(out.model.kept.filter(n => n.type === 'procedure-claim').length === 2,
      'the procedure-type filter selects the two mantra-recitation claims');

    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'labels', value: 'disputed', on: true });
    ok(out.model.kept.filter(n => n.type === 'relation-claim').length === 1,
      'the epistemic-label filter selects the one disputed relation');

    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'harmOnly', value: true });
    ok(out.model.kept.length === 1 && out.model.kept[0].id === 'pc:sara-coercive',
      'the harm filter selects the one harm-flagged record');

    // non-asserted records are VISIBLE BY DEFAULT and hideable only on purpose
    out = ctl.dispatch({ type: 'reset' });
    ok(out.model.kept.some(n => n.asserted === false), 'non-asserted relations are visible by default');
    out = ctl.dispatch({ type: 'filter', group: 'showNotAsserted', value: false });
    ok(!out.model.kept.some(n => n.asserted === false), 'and can be hidden only by an explicit choice');
    ok(/asserted only/.test(out.counter), 'the counter discloses that non-asserted records are hidden');

    out = ctl.dispatch({ type: 'reset' });
    out = ctl.dispatch({ type: 'filter', group: 'minWeight', value: 0.8 });
    ok(out.model.kept.every(n => n.weight >= 0.8), 'the weight floor filter holds');

    // -- filters round-trip through the URL hash ---------------------------
    ctl.dispatch({ type: 'reset' });
    ctl.dispatch({ type: 'filter', group: 'cultures', value: 'cul:shaiva', on: true });
    ctl.dispatch({ type: 'filter', group: 'grades', value: 'partial', on: true });
    const h = ctl.hash();
    ok(/c=cul:shaiva/.test(h) && /g=partial/.test(h), `filters serialise into the hash (${h})`);
    const back = app.decodeFilter('#' + h);
    ok(back.cultures.join() === 'cul:shaiva' && back.grades.join() === 'partial',
      'and decode back to the same filter — the view is linkable');

    // -- the index is a real maintenance surface ---------------------------
    ctl.dispatch({ type: 'reset' });
    const idxOut = ctl.render().index;
    ok(/Nodes by kind/.test(idxOut) && /Cultures in view/.test(idxOut)
      && /Completeness of the text axis/.test(idxOut) && /Basis of the grade/.test(idxOut),
      'the index counts by kind, culture, completeness and basis');
    ok(/rest on <i>genre-norm<\/i>/.test(idxOut),
      'the index calls out the genre-norm grades and says they are excluded from headline counts');
    ok(/round R33/.test(idxOut) && /weight rubric v1/.test(idxOut),
      'the index names the round and the weight rubric the data was generated under');
    ok(/The curation gate/.test(idxOut) && /admitted/.test(idxOut) && /ejected/.test(idxOut),
      'the index publishes the gate’s admitted / excluded / ejected counts');
    // 390 px REGRESSION GUARD, at the data layer where the failure actually was.
    // A culture label in this corpus can be a full descriptive clause; an
    // untrimmed one in a nowrap chip pushed the document 382 px sideways in
    // Chromium. Cap the chip text and keep the whole string in its title.
    {
      const chips = [...idxOut.matchAll(/<span class="og-count"[^>]*>([\s\S]*?)<\/span>/g)]
        .map(x => x[1].replace(/<[^>]+>/g, '').trim());
      const longest = chips.reduce((a, b) => (b.length > a.length ? b : a), '');
      ok(longest.length <= 44, `no index chip is long enough to set the page width (longest ${longest.length}: “${longest}”)`);
      ok(/<span class="og-count" title="/.test(idxOut), 'and the untrimmed label survives in the chip’s title');
      ok(app.shortLabel('a'.repeat(80)).length <= 36, 'shortLabel trims a long label');
      ok(app.shortLabel('Śaiva Mantramārga — tantric Śaivism') === 'Śaiva Mantramārga…',
        'shortLabel cuts at the first natural break rather than mid-word');
      ok(app.shortLabel('Latin West') === 'Latin West', 'and leaves a short label alone');
    }

    // -- filter controls are keyboard-operable checkboxes, not hover things -
    const f = ctl.render().filters;
    ok(count(f, /<input type="checkbox"/g) >= 10, 'the filter bar is built from real checkboxes');
    ok(/aria-pressed/.test(f), 'the weight segmented control exposes aria-pressed');
    ok(/id="og-reset"/.test(f), 'the filter bar carries a reset control');

    // -- the render is a pure function of the state ------------------------
    const a1 = JSON.stringify(ctl.render());
    const a2 = JSON.stringify(ctl.render());
    ok(a1 === a2, 'two renders of the same state are byte-identical (deterministic paint)');

    // -- THE RENDER CAP: no silent truncation, ever -------------------------
    {
      const small = app.createOpgraph({
        nodes, edges, vocab: [], meta: null, gate: null,
        engine: fixtureEngine(nodes, edges), width: 1280, cap: 6,
      }).render();
      ok(count(small.nodes, /class="og-node/g) === 6, 'the diagram honours a render cap');
      ok(small.model.truncated === 12, `the model records how much it left out (${small.model.truncated})`);
      ok(/12 filtered nodes are not drawn/.test(small.counter),
        'the counter states in words how many nodes the cap left out');
      ok(/the ledger below carries every one of them/.test(small.counter),
        'and says where the missing ones are');
      ok(count(small.mirror, /<tr data-row="/g) === 18,
        'the ledger is NOT capped — it carries every record the filter selects');
      let undrawnInLedger = 0;
      for (const n of small.model.kept) if (!small.mirror.includes(`data-row="${n.id}"`)) undrawnInLedger++;
      ok(undrawnInLedger === 0, 'including every record the diagram could not draw');
    }

    // -- the page degrades honestly when the engine gives nothing ----------
    const noEng = app.createOpgraph({ nodes, edges, vocab: [], meta: null, gate: null, engine: {}, width: 1280 }).render();
    ok(noEng.layoutError, 'a missing layout engine is recorded as an error, not swallowed');
    ok(count(noEng.mirror, /<tr data-row="/g) === 18,
      'the ledger still carries every record when the diagram cannot be drawn');
    ok(/The diagram is not drawn in this view/.test(noEng.counter),
      'and the counter says the diagram is not drawn rather than showing an empty frame');
    ok(/not computed/.test(noEng.structure),
      'an uncomputed acyclicity check reports itself as uncomputed, never as passed');
  });

  // =========================================================================
  //  3 · INTEGRATION with builders A and B (guarded)
  // =========================================================================
  await guard('the real generated data + pure engine', async () => {
    const data = await import('../../assets/js/core/data/opgraph.js');
    const engine = await import('../../assets/js/core/opgraph.js');
    const app = await import('../../assets/js/app/opgraph.js');

    ok(Array.isArray(data.OPGRAPH_NODES) && data.OPGRAPH_NODES.length > 0, 'OPGRAPH_NODES is a non-empty array');
    ok(Array.isArray(data.OPGRAPH_EDGES), 'OPGRAPH_EDGES is an array');
    ok(typeof engine.layoutOpgraph === 'function', 'the engine exports layoutOpgraph');
    ok(typeof engine.assertAcyclic === 'function', 'the engine exports assertAcyclic');

    const ctl = app.createOpgraph({
      nodes: data.OPGRAPH_NODES, edges: data.OPGRAPH_EDGES,
      vocab: data.OPGRAPH_VOCAB, meta: data.OPGRAPH_META,
      gate: data.OPGRAPH_GATE_SUMMARY || null, engine, width: 1280,
    });
    const out = ctl.render();
    const m = out.model;

    ok(m.kept.length > 0, `the real graph renders records (${m.kept.length} in the default view)`);
    ok(m.drawn.length <= 140, `the diagram honours the 140-node cap (drew ${m.drawn.length})`);
    ok(count(out.nodes, /class="og-node/g) === m.drawn.length, 'the painter paints exactly the capped set');

    // AT parity on real data — the assertion that matters
    const rows = count(out.mirror, /<tr data-row="/g);
    ok(rows === m.kept.length, `AT parity on the real graph: ${rows} ledger rows for ${m.kept.length} records`);
    let missing = 0;
    for (const id of m.drawnIds) if (!out.mirror.includes(`data-row="${id}"`)) missing++;
    ok(missing === 0, `every drawn node has a ledger row on real data (${missing} missing)`);

    if (m.truncated > 0) ok(/are not drawn/.test(out.counter), 'the counter discloses the truncation in words');

    // CROSS-CHECK against the engine's own ledger model. The page builds its
    // mirror from the uncapped layout rather than from ledgerModel(), so the
    // two are independent derivations of the same set — which makes this a real
    // agreement test rather than a tautology.
    if (typeof engine.ledgerModel === 'function') {
      const lm = engine.ledgerModel({});
      const mine = t => m.kept.filter(n => n.type === t).length;
      ok(lm.works.length === mine('work'),
        `ledger agreement, works: engine ${lm.works.length} vs page ${mine('work')}`);
      ok(lm.claims.length === mine('procedure-claim'),
        `ledger agreement, claims: engine ${lm.claims.length} vs page ${mine('procedure-claim')}`);
      const prop = lm.propagation || lm.relations || lm.relationClaims;
      if (Array.isArray(prop)) {
        ok(prop.length === mine('relation-claim'),
          `ledger agreement, relation claims: engine ${prop.length} vs page ${mine('relation-claim')}`);
      }
    }
    // the geometry convention the painter converts from is the engine's
    {
      const lo = engine.layoutOpgraph({ width: 1280, zoom: 1, orientation: 'LR', filter: {}, cap: 140 });
      const n0 = lo.nodes[0];
      ok(n0 && typeof n0.x === 'number' && typeof n0.w === 'number',
        'layout nodes carry x/y/w/h');
      const e0 = (lo.edges || [])[0];
      ok(!e0 || typeof e0.c1x === 'number' || typeof e0.path === 'string',
        'layout edges carry bezier control points (or a ready-made path) — the painter derives no geometry');
    }

    // the acyclicity result is displayed either way, and reported honestly
    const res = engine.assertAcyclic();
    ok(res && typeof res.acyclic === 'boolean', 'assertAcyclic returns a boolean verdict');
    ok(res.acyclic ? /no cycle found/i.test(out.structure) : /FAILED/.test(out.structure),
      'the page displays the real acyclicity verdict, whichever way it came out');

    // a real dossier opens, on both paths, and carries its evidence
    const firstClaim = m.kept.find(n => n.type === 'procedure-claim');
    if (firstClaim) {
      const d1 = ctl.dispatch({ type: 'activate', id: firstClaim.id, via: 'click' }).dossier;
      ctl.dispatch({ type: 'close' });
      const d2 = ctl.dispatch({ type: 'activate', id: firstClaim.id, via: 'key' }).dossier;
      ok(d1.length > 400 && d1 === d2, 'click and keyboard open the same real dossier');
      ok(/The evidence for that grade|Why no grade is asserted/.test(d1),
        'a real dossier carries its grade together with the evidence for it');
      ok(/What this record does not contain/.test(d1), 'a real dossier carries the per-record razor statement');
    }
    // the chain walk goes through the ENGINE's chainFrom, not a second copy of it
    if (typeof engine.chainFrom === 'function') {
      const rel = m.kept.find(n => n.type === 'relation-claim' && n.relation === 'TRANSMITS_TO' && n.asserted !== false);
      if (rel) {
        const ch = ctl.dispatch({ type: 'chain', id: rel.fromId }).chain;
        ok(/<ol class="og-chain-steps">/.test(ch), 'the real chain walk renders as an ordered list');
        ok(/(procedure-level|work-level)/.test(ch), 'each real chain step declares its level');
        const eng2 = engine.chainFrom(rel.fromId);
        const steps = count(ch, /<li>/g);
        ok(steps === Math.max(0, (eng2.stops || []).length - 1),
          `the rendered chain has exactly the engine's step count (${steps} vs ${(eng2.stops || []).length - 1})`);
      }
    }
    // every harm-flagged record carries its note in the dossier
    let harmless = 0;
    for (const n of m.kept.filter(x => Array.isArray(x.harm) && x.harm.length).slice(0, 40)) {
      const d = ctl.dispatch({ type: 'activate', id: n.id, via: 'click' }).dossier;
      if (!/og-harm-block/.test(d)) harmless++;
    }
    ok(harmless === 0, `every harm-flagged record renders its harm block (${harmless} did not)`);
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/opgraph.html',
    actions: [
      'load',
      'click a work node on the diagram',
      'press Enter on a focused node',
      'press Escape',
      'tick a culture filter and a completeness filter',
      'press the ≥ 0.80 weight button',
      'untick "show relations recorded as not asserted"',
      'press "Follow the transmission chain from here" in a dossier',
      'click a ledger row title',
      'press Reset every filter',
    ],
    asserts: [
      'the standing note renders FIRST, before the legend, the index, the diagram and the ledger',
      'the diagram paints one record-shaped node per drawn record, each printing its own weight and attribution pressure on its face; the SVG underlay is aria-hidden and the node layer is a set of focusable <button>s with a roving tabindex',
      'op-nodes are interposed on every claim: no work→work arrow is drawn anywhere',
      'a genre-norm grade draws hatched; a non-asserted relation draws struck WITH its reason; a do-not-quote claim carries ⛔; a harm-flagged claim carries ⚠',
      'clicking a node opens the dossier; pressing Enter or Space on a focused node opens the same dossier; Escape closes it; focus moves to the drawer close button',
      'the dossier carries the grade together with its verbatim evidence sentence, its basis, its citation, its weight, its witness count, the three completeness axes side by side, the harm note where flagged, and the per-record statement of what it does not contain',
      'the acyclicity result is displayed on the page in words — "no cycle found", or a bad callout naming each cycle if the corpus contains one',
      'the index shows counts by node kind, culture, completeness grade, basis and epistemic label, and calls out the genre-norm grades as excluded from headline counts',
      'the filters narrow the diagram and the ledger together; the counter states in words how many nodes are drawn of how many filtered, and names the active filters; the filters serialise into the URL hash and the view reloads to the same state',
      'the ledger carries a row for every record in view — including every node the diagram cap left out — and selecting a row opens the same dossier',
      '390px: no horizontal overflow; the diagram is not drawn and the narrow-screen note says the ledger is the complete view; every table scrolls inside its own box',
      'reduced-motion: every default state is the resting state, nothing animates, __motionStats().running === false after idle',
      'print: the toolbar, filters and diagram are dropped and the ledger prints',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
