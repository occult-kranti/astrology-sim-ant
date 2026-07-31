// ============================================================================
//  scripts/pristine-check.mjs — RUN THE GATE AGAINST WHAT A CLONE WOULD GET.
//
//  WHY THIS EXISTS. The anti-drift checks compare tracked bytes against
//  generator output. Run in a working tree where the generator has just been
//  executed, they pass trivially. The question they are supposed to answer is
//  different and stronger:
//
//      can someone who clones this repo reproduce the shipped artifacts?
//
//  For a while the answer was NO and every check said yes. The generators write
//  LF; git checked out CRLF on Windows; so a fresh clone held bytes that could
//  never equal the generator's output. The bug was invisible to every test in
//  the suite because every test ran in a tree that had already been normalised
//  by whoever last ran the generator. It was found by hand, once, by exporting
//  HEAD and running the gate against the export. This script is that procedure,
//  written down so it stops depending on someone remembering it.
//
//  WHY A WORKTREE AND NOT `git archive`. `git worktree add --detach` performs a
//  real checkout, applying exactly the smudge and eol rules a fresh clone would
//  apply — including .gitattributes. That is the situation being simulated. It
//  also checks out HEAD only, so uncommitted work in the main tree cannot leak
//  in and mask a failure. That isolation IS the test.
//
//  WHAT IT DOES NOT PROVE. It runs on this machine, with this git config and
//  this node. A checkout on a different platform can still differ; the honest
//  scope of this check is "reproducible from tracked state HERE", which is
//  strictly more than the working-tree run proved and strictly less than CI.
//
//  Usage:  node scripts/pristine-check.mjs          (gate HEAD)
//          node scripts/pristine-check.mjs --ref X  (gate any commit-ish)
//          node scripts/pristine-check.mjs --keep   (leave the checkout for triage)
// ============================================================================

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const KEEP = argv.includes('--keep');
const refIx = argv.indexOf('--ref');
const REF = refIx >= 0 ? argv[refIx + 1] : 'HEAD';

const git = (...a) => spawnSync('git', a, { cwd: REPO, encoding: 'utf8' });
const die = (msg) => { console.error(`[pristine] ${msg}`); process.exit(1); };

// The checks to run inside the pristine checkout. Each must be reproducible
// from tracked state alone — that is the whole point, so nothing here may
// depend on a file the repo does not track.
const CHECKS = [
  ['engine-test', ['scripts/engine-test.mjs'], 'all passed'],
  ['audit', ['scripts/audit.mjs'], 'Problems: 0'],
];

const head = git('rev-parse', REF);
if (head.status !== 0) die(`cannot resolve ref "${REF}": ${(head.stderr || '').trim()}`);
const sha = head.stdout.trim();

// Warn — do not fail — when the working tree is dirty. A dirty tree is normal
// mid-round; the point is that this check ignores it, and the operator should
// know that uncommitted work is NOT being tested.
const dirty = git('status', '--porcelain').stdout.trim();
if (dirty) {
  const n = dirty.split('\n').length;
  console.log(`[pristine] NOTE: ${n} uncommitted change(s) in the working tree are NOT`);
  console.log('[pristine]       part of this check. It gates committed state only.');
}

const tmp = mkdtempSync(join(tmpdir(), 'pristine-'));
const wt = join(tmp, 'wt');
let failed = 0;

try {
  const add = git('worktree', 'add', '--detach', '--quiet', wt, sha);
  if (add.status !== 0) die(`worktree add failed: ${(add.stderr || '').trim()}`);

  console.log(`[pristine] gating ${REF} (${sha.slice(0, 7)}) in a fresh checkout`);

  for (const [name, args, needle] of CHECKS) {
    if (!existsSync(join(wt, args[0]))) {
      console.log(`  ✗ ${name}: ${args[0]} is not tracked at this ref`);
      failed++;
      continue;
    }
    const r = spawnSync(process.execPath, args, { cwd: wt, encoding: 'utf8' });
    const out = `${r.stdout || ''}${r.stderr || ''}`;
    const ok = r.status === 0 && out.includes(needle);
    console.log(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : ` — expected "${needle}"`}`);
    if (!ok) {
      failed++;
      // Print the tail: on a reproducibility failure the byte counts are the
      // diagnostic, and they are the last thing the checks emit.
      console.log(out.split('\n').filter(Boolean).slice(-12).map(l => `      ${l}`).join('\n'));
    }
  }
} finally {
  if (KEEP) {
    console.log(`[pristine] --keep: checkout left at ${wt}`);
  } else {
    git('worktree', 'remove', '--force', wt);
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* best effort */ }
    git('worktree', 'prune');
  }
}

if (failed) {
  console.log('');
  console.log(`[pristine] ${failed} check(s) FAILED from tracked state while the working tree`);
  console.log('[pristine] may well be green. That gap is the bug: the shipped artifacts are');
  console.log('[pristine] not reproducible by someone who clones this repo. Fix it before');
  console.log('[pristine] pushing — a green local run is not evidence here.');
  process.exit(1);
}
console.log('[pristine] reproducible from tracked state.');
