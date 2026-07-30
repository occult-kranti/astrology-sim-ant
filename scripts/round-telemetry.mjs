#!/usr/bin/env node
// ============================================================================
//  round-telemetry.mjs — the round recorder. Dependency-free, node built-ins only.
//
//  WHAT IT IS. Every MASTER-PLAN.md round heading already carries real numbers —
//  "(verified: audit 0 · engine-test all passed · Chromium sweep 38 pages 0
//  errors)". That IS telemetry; it is simply hand-typed into a 122 KB markdown
//  file, so it is neither machine-readable nor trendable. This script writes the
//  same numbers as one JSON object per round, appended to docs/telemetry/rounds.jsonl.
//
//  WHAT IT DOES NOT DO — and this is the whole design. It COMPUTES NOTHING. It
//  shells the three gates that already exist and parses their existing stdout:
//
//      node scripts/audit.mjs           →  "[audit] 98 HTML, 188 JS scanned. Problems: 0"
//      node scripts/engine-test.mjs     →  "✓ …" / "✗ …" lines + "[engine-test] all passed"
//      node scripts/browser-verify.mjs  →  "[browser-verify] 98 pages, 0 errors"
//
//  A telemetry script that computes its own numbers is a second source of truth,
//  and a second source of truth is how a ledger starts lying. If a gate changes
//  its output format, THIS script must fail loudly rather than invent a number:
//  an unparsable gate is recorded as `null`, never as `0`.
//
//  AMENDMENT E (docs/plans/opgraph/PLAN.md). Any figure that cannot be re-derived
//  from a script in the round that records it is marked `"verified": false` and
//  renders "(unverified)" in the ledger. That applies to the two claim columns,
//  which are hand-entered by the round agent by construction, and to every row
//  back-filled from prose.
//
//  APPEND-ONLY. One line per round, never rewritten, never reordered. The file
//  survives merges because a JSONL append is the one edit that does not conflict.
//  Re-recording an existing round id requires --force, and the reason is that a
//  ledger you can quietly overwrite is not a ledger.
//
//  USAGE
//    node scripts/round-telemetry.mjs record --round R34 \
//         --domain 2 --tooling 12 [--date 2026-07-30] [--note "…"]
//         [--skip-browser] [--skip-graph] [--dry-run] [--force]
//    node scripts/round-telemetry.mjs seed          # write the historical rows (idempotent)
//    node scripts/round-telemetry.mjs show          # print the file, parsed
//
//  `--skip-browser` exists because browser-verify needs a served site and a real
//  Chromium; when it is skipped the browser fields are `null` and the row says so.
//  The `graph` block (PLAN §6.2 — the stop-condition-C3 curation census) is READ
//  OUT OF the shipped data module at record time, not typed in: a round is not
//  asked to self-report how much its own gate refused. `--skip-graph` forces it
//  null. It is null anyway wherever no graph module exists, and NULL IS NOT ZERO
//  — the ledger prints C3 as NOT EVALUABLE rather than passing it by default.
// ============================================================================
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '..');
export const JSONL_PATH = join(REPO_ROOT, 'docs', 'telemetry', 'rounds.jsonl');

// ---------------------------------------------------------------------------
//  The parsers. One per gate, each a pure function of the gate's stdout, each
//  exported so the framing test can prove it against a fixture rather than
//  against a live run. `null` means "this gate did not tell me", and null is
//  never silently coerced to zero anywhere downstream.
// ---------------------------------------------------------------------------
export function parseAudit(out) {
  const m = /\[audit\]\s+(\d+)\s+HTML,\s+(\d+)\s+JS scanned\.\s+Problems:\s+(\d+)/.exec(out || '');
  if (!m) return { audit_html: null, audit_js: null, audit_problems: null, parsed: false };
  return { audit_html: +m[1], audit_js: +m[2], audit_problems: +m[3], parsed: true };
}

export function parseEngineTest(out) {
  const txt = out || '';
  const tail = /\[engine-test\]\s+(all passed|(\d+)\s+FAILED)/.exec(txt);
  if (!tail) return { engine_test_checks: null, engine_test_fails: null, parsed: false };
  const checks = (txt.match(/^[✓✗]/gm) || []).length;
  return {
    engine_test_checks: checks || null,
    engine_test_fails: tail[1] === 'all passed' ? 0 : +tail[2],
    parsed: true,
  };
}

export function parseBrowserVerify(out) {
  const txt = out || '';
  const tail = /\[browser-verify\]\s+(\d+)\s+pages,\s+(\d+)\s+errors/.exec(txt);
  if (!tail) return { browser_pages: null, browser_errors: null, drive_warnings: null, parsed: false };
  const warn = /assertion warnings:\s*(\d+)/.exec(txt);
  return {
    browser_pages: +tail[1],
    browser_errors: +tail[2],
    drive_warnings: warn ? +warn[1] : null,
    parsed: true,
  };
}

// ---------------------------------------------------------------------------
//  Shelling out. Never throws on a non-zero exit — a FAILING gate is a datum,
//  and a telemetry script that dies when the round is red records nothing about
//  the rounds most worth recording.
// ---------------------------------------------------------------------------
function shell(cmdArgs, { timeout = 600000 } = {}) {
  try {
    const out = execFileSync(process.execPath, cmdArgs, {
      cwd: REPO_ROOT, encoding: 'utf8', timeout, stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { out: String(out), code: 0 };
  } catch (e) {
    return { out: String((e.stdout || '') + (e.stderr || '')), code: e.status == null ? -1 : e.status };
  }
}

// ---------------------------------------------------------------------------
//  The curation census (PLAN §6.2 `graph` block), READ OUT OF THE SHIPPED DATA
//  rather than typed in. Stop condition C3 asks whether the gate is still
//  refusing things — a number nobody would ever volunteer against themselves,
//  so it is derived. Read in a child process so a corrupt or absent data module
//  leaves the census null instead of killing the telemetry run; a round with no
//  graph is a round with no census, which is a fact, not a zero.
// ---------------------------------------------------------------------------
function graphCensus() {
  if (!existsSync(resolve(REPO_ROOT, 'assets/js/core/data/opgraph.js'))) return null;
  const probe =
    "import {OPGRAPH_NODES as N, OPGRAPH_EDGES as E, OPGRAPH_META as M} from './assets/js/core/data/opgraph.js';"
    + "const g = M.gate || {};"
    + "console.log(JSON.stringify({nodes:N.length, edges:E.length, admitted:g.admitted ?? null,"
    + " excluded:g.excluded ?? null, ejected:g.ejected ?? null, byType:M.counts ?? null,"
    + " weightMean:(M.weight&&M.weight.mean) ?? null, admissionFloor:M.admissionFloor ?? null,"
    + " rubricVersion:M.rubricVersion ?? null, generator:M.generator ?? null}));";
  const r = shell(['--input-type=module', '-e', probe]);
  if (r.code !== 0) return null;
  try {
    const c = JSON.parse(r.out.trim().split('\n').pop());
    return { ...c, source: 'read from assets/js/core/data/opgraph.js at record time', verified: true };
  } catch { return null; }
}

function gitShortHead() {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'],
      { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
}

function todayISO() {
  // The date the round is recorded. Deliberately the system date and not a
  // constant: this is the one place the file is allowed to know what day it is.
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
//  The file.
// ---------------------------------------------------------------------------
export function readRounds(path = JSONL_PATH) {
  if (!existsSync(path)) return [];
  const rows = [];
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//')) continue;
    try { rows.push(JSON.parse(line)); }
    catch (e) { throw new Error(`rounds.jsonl line ${i + 1} is not valid JSON: ${e.message}`); }
  }
  return rows;
}

// APPEND-ONLY, AND CORRECTABLE. The two are not in tension: the file is a log,
// and a log may contain a correction. Re-recording a round id appends a new row
// carrying `supersedes`, and the ledger renders only the newest row per id while
// stating how many superseded rows are behind it. Nothing is ever rewritten, and
// a wrong number can still be fixed — which is the only way a wrong number ever
// gets fixed rather than lived with.
export function latestPerRound(rows) {
  const byId = new Map();
  for (const r of rows) byId.set(r.round, r);      // later line wins
  return rows.filter(r => byId.get(r.round) === r);
}

function appendRound(obj, { dryRun = false, force = false } = {}) {
  const existing = readRounds();
  if (existing.some(r => r.round === obj.round)) {
    if (!force)
      throw new Error(`round "${obj.round}" is already recorded. rounds.jsonl is append-only — pass --force to append a SUPERSEDING correction row.`);
    obj = { ...obj, supersedes: obj.round, supersededAt: todayISO() };
  }
  const line = JSON.stringify(obj);
  if (dryRun) { console.log(line); return line; }
  mkdirSync(dirname(JSONL_PATH), { recursive: true });
  // A newline BEFORE nothing and AFTER every row: the file always ends in \n, so
  // the next append can never glue two objects onto one line.
  appendFileSync(JSONL_PATH, line + '\n', 'utf8');
  console.log(`[round-telemetry] appended ${obj.round} to docs/telemetry/rounds.jsonl`);
  return line;
}

// ---------------------------------------------------------------------------
//  record — run the gates, build the row, append it.
// ---------------------------------------------------------------------------
export function recordRound(opts = {}) {
  const round = opts.round;
  if (!round) throw new Error('--round is required (e.g. --round R34)');

  const gates = {
    audit_html: null, audit_js: null, audit_problems: null,
    engine_test_checks: null, engine_test_fails: null,
    browser_pages: null, browser_errors: null, drive_warnings: null,
  };
  const ran = {};

  if (!opts.skipGates) {
    console.log('[round-telemetry] shelling scripts/audit.mjs …');
    const a = shell(['scripts/audit.mjs']);
    Object.assign(gates, (({ parsed, ...rest }) => rest)(parseAudit(a.out)));
    ran.audit = { exit: a.code, parsed: parseAudit(a.out).parsed };

    console.log('[round-telemetry] shelling scripts/engine-test.mjs …');
    const e = shell(['scripts/engine-test.mjs']);
    Object.assign(gates, (({ parsed, ...rest }) => rest)(parseEngineTest(e.out)));
    ran.engineTest = { exit: e.code, parsed: parseEngineTest(e.out).parsed };

    if (opts.skipBrowser) {
      ran.browserVerify = { exit: null, parsed: false, skipped: true };
      console.log('[round-telemetry] browser-verify SKIPPED (--skip-browser): its fields stay null.');
    } else {
      console.log('[round-telemetry] shelling scripts/browser-verify.mjs …');
      const b = shell(['scripts/browser-verify.mjs']);
      Object.assign(gates, (({ parsed, ...rest }) => rest)(parseBrowserVerify(b.out)));
      ran.browserVerify = { exit: b.code, parsed: parseBrowserVerify(b.out).parsed };
    }
  }

  const gatesVerified = !opts.skipGates &&
    ran.audit && ran.audit.parsed && ran.engineTest && ran.engineTest.parsed;

  const row = {
    round,
    date: opts.date || todayISO(),
    commit: opts.commit || gitShortHead(),
    title: opts.title || null,
    gates,
    gates_verified: !!gatesVerified,
    gates_run: ran,
    // The C3 census. Derived, never argued: `null` where there is no graph to
    // count, which the ledger reports as NOT EVALUABLE rather than as zero.
    graph: opts.skipGraph ? null : graphCensus(),
    claims: {
      // Hand-entered by the round agent against the §6.3 definitions. There is no
      // script that can classify a change as knowledge or instrument, so these
      // are `verified: false` BY CONSTRUCTION and the ledger says so on every row.
      domain_claims_survived: opts.domain == null ? null : Number(opts.domain),
      tooling_only: opts.tooling == null ? null : Number(opts.tooling),
      granularity: opts.granularity || 'coarse-statements',
      verified: false,
      basis: opts.basis || 'hand-classified by the round agent against docs/plans/opgraph/PLAN.md §6.3',
    },
    notes: opts.note ? [opts.note] : [],
  };
  appendRound(row, { dryRun: opts.dryRun, force: opts.force });
  return row;
}

// ---------------------------------------------------------------------------
//  seed — the historical rows, back-filled from MASTER-PLAN.md.
//
//  READ THE `verified` FIELD BEFORE READING THE NUMBERS. Not one figure in this
//  block was produced by a script in the round that records it. The gate numbers
//  are transcribed from MASTER-PLAN.md round headings where a heading states them
//  and are `null` where it does not — R29 through R33 simply never wrote one.
//  The claim counts are a hand classification of prose, at the COARSE granularity
//  the plan's own worked example uses: PLAN §6.3 scores R32 at 9 domain / 4
//  tooling, counting "2 atlas person-nodes, 4 documented edges, 102 chapter
//  mappings and the SRF v. Ananda PD determination" as ~9 statements and NOT as
//  109 records. Every other row here is classified to match that, because a
//  ledger whose rows count different things is a ledger with no column.
//
//  Ambiguous items count as tooling_only. The tie goes against us. That is the
//  only defence this ledger has, and it is applied here against our own history:
//  R30's competitor survey is 28 sourced product records about SOFTWARE, not
//  about the subject matter, so it scores as tooling.
//
//  The two rounds dated 2026-07-30 are a real collision in the source: MASTER-PLAN
//  R33 is the Vedic AI layer, while PLAN.md §6.3/§8.2 calls the opgraph research
//  round R33. They are recorded as R33 and R33r, and the collision is stated
//  rather than silently resolved.
// ---------------------------------------------------------------------------
const NULL_GATES = {
  audit_html: null, audit_js: null, audit_problems: null,
  engine_test_checks: null, engine_test_fails: null,
  browser_pages: null, browser_errors: null, drive_warnings: null,
};

const HISTORICAL = [
  {
    round: 'R28', date: '2026-07-16',
    title: 'the surfaced Vedic engine, the explain layer, graded journeys & the installable site',
    gates: { ...NULL_GATES, audit_html: 98, audit_js: 188, audit_problems: 0, engine_test_fails: 0, browser_pages: 98, browser_errors: 0 },
    claims: { domain: 11, tooling: 8 },
    note: 'Gate figures transcribed from the MASTER-PLAN R28 gate line ("audit 98 HTML / 188 JS, 0 problems · Chromium 98 pages 0 errors"); engine-test check count not stated there, so null. Domain: the yoga-rule set, the bhava-phala two-witness set, the Rahu/Ketu single-witness absence finding, the panchadha maitri, the graha-drsti both-schemes presentation, the combustion flags, the 151 atlas edge labels, the Kybalion debunked-arc determination, the Vipreet-trio citation correction, the Saravali ch.30 correction, the contested-never-a-boolean invariant as a doctrinal claim. Tooling: the explain layer, glosstip, service worker, manifest, search index, nav integration, five test suites, the atlas visual-polish pass.',
  },
  {
    round: 'R29', date: '2026-07-17',
    title: 'the Vedic course, narrate mode & the first library quick-wins (incl. the plan-only esoteric-libraries addendum)',
    gates: { ...NULL_GATES },
    claims: { domain: 8, tooling: 5 },
    note: 'No gate line in MASTER-PLAN for this round: every gate field is null, not zero. Domain: the nine-unit Parasari citation set, the maraka/hyleg framing, the CONTESTED register, the Era Legis contested year-start carried both ways, the four Liber Resh stations with their 1911 adoration names, and from the plan-only addendum the 384-work per-edition PD catalogue, its two corrected dates and its one narrowed licence verdict. Tooling: narrate engine + rail, the course page, the thelemic page, the test suites, the glossary additions.',
  },
  {
    round: 'R30', date: '2026-07-17',
    title: 'the Buddhist scriptures wing & the honest comparison',
    gates: { ...NULL_GATES },
    claims: { domain: 4, tooling: 6 },
    note: 'No gate line in MASTER-PLAN. Domain: the 213-record Tier-1 corpus with its reconstruction invariant, the per-layer licence determinations (cc0 197 / pd-age 16), the three Heart Sutra contested cruxes including the Nattier apocryphon debate, and the Metta colophon carried honestly as null. The 28-product landscape survey, the 25x14 matrix and the novelty claims are about SOFTWARE and not about the subject matter, so under the section-6.3 definition they score as tooling — the tie goes against us.',
  },
  {
    round: 'R31', date: '2026-07-17',
    title: 'the Practices wing (the mudra museum) & the Dhammapada',
    gates: { ...NULL_GATES },
    claims: { domain: 6, tooling: 6 },
    note: 'No gate line in MASTER-PLAN. Domain: the 35-record mudra/bandha set, the khecari refutation (the plan\'s "GS omits cutting" claim is wrong — a corrected attribution), the vajroli/vajroni same-name-different-practice split, the Gherahda edition-and-locus resolution, the Dhammapada 1-75 corpus, and the four cruxes carried both ways in notes. Tooling: the wing renderer, the stroke-SVG figures, the crosswalk table, the page CSS, the tests, the registry/glossary wiring.',
  },
  {
    round: 'R32', date: '2026-07-17',
    title: 'the Eastern Greats wing (E1) & the atlas\'s modern yoga-Vedanta figures',
    gates: { ...NULL_GATES },
    claims: { domain: 9, tooling: 4 },
    note: 'The one row taken verbatim from a document rather than classified here: PLAN.md section 6.3\'s worked example scores R32 at 9 domain / 4 tooling / ratio 0.69, itemising 2 atlas person-nodes, 4 documented edges, 102 chapter mappings and the SRF v. Ananda PD determination against renderer reuse via 5 exported helpers, a registry entry, a new test file and count-assert updates. It sets the granularity every other row here is matched to.',
  },
  {
    round: 'R33', date: '2026-07-30',
    title: 'the Vedic reading\'s explain assistant',
    gates: { ...NULL_GATES },
    claims: { domain: 7, tooling: 9 },
    note: 'No gate line in MASTER-PLAN. NOTE THE ROUND-NUMBER COLLISION: this is MASTER-PLAN R33; the opgraph research round is also numbered R33 in PLAN.md and is recorded here as R33r. Domain: the units codebook checked 20/20 against core/vedic.js, the five-named-edition citation contract, the contested ledger, the canonical nine-step reading order, the refusals doctrine, the ayanamsa-fragility finding, and the engine\'s own declared simplifications stated as the SITE\'s limit rather than the tradition\'s. Tooling: the three context builders, the slimVedic hoist, the page wiring, the six chips, two test suites, the browser-verify wiring, the spine-preserving trim fix, the r28-atlas-labels staleness fix, the LOCAL-LLM doc update.',
  },
  {
    round: 'R33r', date: '2026-07-30',
    title: 'the opgraph research round — 105 works / 459 edge rows, post-hostile-audit',
    gates: { ...NULL_GATES },
    claims: { domain: 48, tooling: 4 },
    note: 'Taken from PLAN.md section 8.2, which is the hostile auditor\'s own figure: substantive sourced statements about the operative corpus only (slice 01 -> 1, 10 -> 9, 11 -> 10, 12 -> 11, 13 -> 8, 14 -> 9). The plan deliberately does NOT claim the round\'s 8 ejections (+8) or its 6 corrected attributions (+6), which would make it 62, because they were produced by auditing this same round\'s output and counting them risks double-entry. The 4 tooling items are the closed-corpus inventory (about the repo, therefore tooling by definition), the Karpathy-reference resolution, the v2 mandate map, and the plan itself. Roughly 30 of the 306 procedure rows carry (unverified) and are NOT among the 48.',
  },
];

export function seed({ dryRun = false } = {}) {
  const existing = new Set(readRounds().map(r => r.round));
  let n = 0;
  for (const h of HISTORICAL) {
    if (existing.has(h.round)) continue;
    const row = {
      round: h.round, date: h.date, commit: null, title: h.title,
      gates: h.gates,
      gates_verified: false,
      gates_run: { audit: null, engineTest: null, browserVerify: null },
      claims: {
        domain_claims_survived: h.claims.domain,
        tooling_only: h.claims.tooling,
        granularity: 'coarse-statements',
        verified: false,
        basis: 'back-filled from MASTER-PLAN.md prose (and PLAN.md sections 6.3/8.2 where stated); hand-classified, not script-derived — amendment E',
      },
      notes: [h.note],
    };
    appendRound(row, { dryRun });
    n++;
  }
  if (!n) console.log('[round-telemetry] seed: nothing to do, every historical round is already recorded.');
  return n;
}

// ---------------------------------------------------------------------------
//  CLI
// ---------------------------------------------------------------------------
function parseArgv(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > -1) { o[a.slice(2, eq)] = a.slice(eq + 1); continue; }
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { o[a.slice(2)] = next; i++; }
      else o[a.slice(2)] = true;
    } else o._.push(a);
  }
  return o;
}

const INVOKED_DIRECTLY = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (INVOKED_DIRECTLY) {
  const a = parseArgv(process.argv.slice(2));
  const cmd = a._[0] || 'record';
  try {
    if (cmd === 'seed') seed({ dryRun: !!a['dry-run'] });
    else if (cmd === 'show') {
      const rows = readRounds();
      for (const r of rows) console.log(`${r.round}\t${r.date}\tdomain ${r.claims.domain_claims_survived}\ttooling ${r.claims.tooling_only}\tgates_verified ${r.gates_verified}`);
      console.log(`[round-telemetry] ${rows.length} rounds recorded.`);
    } else if (cmd === 'record') {
      recordRound({
        round: a.round, date: a.date, commit: a.commit, title: a.title,
        domain: a.domain, tooling: a.tooling, granularity: a.granularity,
        basis: a.basis, note: a.note,
        skipBrowser: !!a['skip-browser'], skipGates: !!a['skip-gates'], skipGraph: !!a['skip-graph'],
        dryRun: !!a['dry-run'], force: !!a.force,
      });
    } else {
      console.error(`unknown command "${cmd}" — expected record | seed | show`);
      process.exit(2);
    }
  } catch (e) {
    console.error(`[round-telemetry] ${e.message}`);
    process.exit(1);
  }
}
