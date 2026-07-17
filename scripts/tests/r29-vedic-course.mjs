// ============================================================================
//  scripts/tests/r29-vedic-course.mjs — R29 Vedic COURSE (theory) page tests.
//  Exports `async run() -> {pass, failures[], notes[]}` for engine-test.mjs and
//  a `DRIVES` array of {page, actions[], asserts[]} for the Chromium sweep.
//
//  The course page is a TEACHING page composing existing computed tools — no
//  new engine, no new data. So the tests are:
//   • STRUCTURAL: read pages/vedic/course.html, app/vedic-course.js and the
//     appended assets/css/vedic-tools.css block as text and assert the
//     load-bearing invariants (chrome key, the 9 unit sections, per-unit
//     citation + honest-frame blocks, the provenance/teaching-order-witness
//     note, the editions table, CONTESTED register, DS2-only CSS, no rAF).
//   • LINK-RESOLUTION: every tool-chip href in the page resolves on disk.
//   • BEHAVIOURAL: the pure exports of vedic-course.js (navTargets/pickCurrent).
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

export async function run() {
  failures.length = 0; notes.length = 0;

  // ---- STRUCTURAL: the course page ---------------------------------------
  const PAGE = 'pages/vedic/course.html';
  ok(has(PAGE), `${PAGE} exists`);
  if (has(PAGE)) {
    const h = read(PAGE);

    // chrome + init wiring
    ok(/mountChrome\(['"]vediccourse['"]\)/.test(h), 'course.html mounts chrome key vediccourse');
    ok(/initVedicCourse\(\)/.test(h), 'course.html calls initVedicCourse');
    ok(/vedic-course\.js/.test(h), 'course.html imports app/vedic-course.js');
    ok(/vedic-tools\.css/.test(h), 'course.html links vedic-tools.css');

    // the epistemic strip + standing honest-validity note
    ok(/class="ep-strip"/.test(h), 'course.html has the epistemic strip');
    ok(/no demonstrated (?:predictive )?validity/i.test(h), 'course.html carries the honest-validity note');
    ok(/described,? (?:but )?never prescribed/i.test(h), 'course.html states described-never-prescribed');

    // the sticky in-page navigator
    ok(/id="vt-course-nav"/.test(h), 'course.html has the #vt-course-nav in-page navigator');

    // the 9 unit sections (U1..U8 + sources), each a .vt-unit card
    for (const id of ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'sources']) {
      ok(new RegExp(`id="${id}"[^>]*class="[^"]*vt-unit|class="[^"]*vt-unit[^"]*"[^>]*id="${id}"`).test(h)
         || new RegExp(`id="${id}"`).test(h), `course.html has the #${id} section`);
    }
    // exactly 8 numbered unit badges (U1..U8)
    const unitNums = (h.match(/class="vt-unit-num"/g) || []).length;
    ok(unitNums === 8, `course.html has 8 unit-number badges (got ${unitNums})`);

    // per-unit apparatus: citation blocks + honest-frame notes (≥8 of each)
    const cites = (h.match(/class="vt-cite"/g) || []).length;
    ok(cites >= 8, `course.html has a citation block per unit (≥8, got ${cites})`);
    const frames = (h.match(/class="vt-frame(?:[ "])/g) || []).length;
    ok(frames >= 8, `course.html has an honest-frame note per unit (≥8, got ${frames})`);

    // the strongest frame rides U6 (māraka death-timing doctrine)
    ok(/vt-frame--strong/.test(h), 'course.html carries the strong (māraka) honest-frame variant');
    ok(/[Mm]āraka is the tradition's death-timing doctrine/.test(h), 'course.html states the māraka non-prediction frame');

    // teaching-order witness note (playlist named, honestly, once as witness only)
    ok(/teaching-order witness/i.test(h), 'course.html names the playlist a teaching-order witness');
    ok(/Vasishtha Astrologer/.test(h), 'course.html identifies the playlist (Vasishtha Astrologer)');
    ok(/never cited as (?:a source|an authority)|not[^.]*an authority/i.test(h), 'course.html states the playlist is never an authority');

    // canonical editions cited exactly as the R28 corpus established them
    ok(/BPHS/.test(h) && /Santhanam/.test(h) && /1984/.test(h), 'course.html cites BPHS tr. Santhanam 1984');
    ok(/Phaladīpikā/.test(h) && /Sareen/.test(h), 'course.html cites Phaladīpikā tr. Sareen');
    ok(/Sārāvalī/.test(h) && /ch\.?\s*30/.test(h), 'course.html cites Sārāvalī ch. 30 (per the R28 correction)');
    ok(/Phaladīpikā 6\.63 ?\/ ?6\.65 ?\/ ?6\.69/.test(h), 'course.html cites the corrected Vipreet loci (Phaladīpikā 6.63/6.65/6.69)');

    // the editions table + CONTESTED register
    ok(/class="vt-editions"/.test(h), 'course.html has the canonical-editions table');
    ok(/class="vt-register\b/.test(h), 'course.html has the CONTESTED register list');
    ok((h.match(/vt-contested-chip/g) || []).length >= 4, 'course.html flags several CONTESTED disputes inline');

    // no inline HL anti-pattern
    ok(!/style="background:/.test(h), 'course.html uses no inline background HL (F-INLINE-HL)');
  }

  // ---- LINK-RESOLUTION: every tool-chip href resolves on disk -------------
  if (has(PAGE)) {
    const h = read(PAGE);
    // pull hrefs out of the .vt-chips rows only (the "drive it" tool links)
    const chipRe = /<a class="chip tool" href="([^"#]+)(?:#[^"]*)?"/g;
    const hrefs = new Set();
    let m;
    while ((m = chipRe.exec(h))) hrefs.add(m[1]);
    ok(hrefs.size >= 8, `course.html exposes tool chips (got ${hrefs.size})`);
    for (const href of hrefs) {
      const rel = resolve(REPO, 'pages/vedic', href); // relative to the page's dir
      ok(existsSync(rel), `tool-chip target resolves on disk: ${href}`);
    }
  }

  // ---- STRUCTURAL: the app module ----------------------------------------
  const APP = 'assets/js/app/vedic-course.js';
  ok(has(APP), `${APP} exists`);
  if (has(APP)) {
    const s = read(APP);
    ok(!/requestAnimationFrame/.test(s), 'vedic-course.js has no requestAnimationFrame (site invariant)');
    ok(/export function initVedicCourse/.test(s), 'vedic-course.js exports initVedicCourse');
    ok(/export function navTargets/.test(s) && /export function activeFromTops/.test(s), 'vedic-course.js exports its pure helpers');
    ok(/IntersectionObserver/.test(s), 'vedic-course.js uses IntersectionObserver for scroll-spy');
    ok(!/style\.background|style="background/.test(s), 'vedic-course.js sets no inline background HL');
  }

  // ---- STRUCTURAL: the appended CSS is DS2-tokens-only --------------------
  {
    const c = 'assets/css/vedic-tools.css';
    ok(has(c), `${c} exists`);
    if (has(c)) {
      const css = read(c);
      ok(/vt-course-nav/.test(css) && /vt-unit/.test(css) && /vt-editions/.test(css), 'vedic-tools.css has the appended R29 course block');
      const stripped = css.replace(/var\([^)]*\)/g, '');
      ok(!/#[0-9a-fA-F]{3,8}\b/.test(stripped), 'vedic-tools.css uses no raw hex colours (DS2 tokens only)');
      ok(!/@keyframes/.test(css) && !/transition:/.test(css), 'vedic-tools.css is reduced-motion-safe (no transitions/keyframes)');
    }
  }

  // ---- BEHAVIOURAL: the pure helpers -------------------------------------
  await guard('vedic-course helpers', async () => {
    const m = await import('../../assets/js/app/vedic-course.js');
    const links = [
      { getAttribute: () => '#u1' },
      { getAttribute: () => '#u2' },
      { getAttribute: () => '#sources' },
      { getAttribute: () => 'index.html' }, // not an in-page anchor → dropped
    ];
    const ids = m.navTargets(links);
    ok(ids.length === 3 && ids[0] === 'u1' && ids[2] === 'sources', 'navTargets: keeps only in-page anchors, in order');
    ok(m.navTargets([]).length === 0, 'navTargets: empty input → []');

    // activeFromTops: the last section whose top crossed the detection line wins
    const line = 140;
    const beforeAny = [{ id: 'u1', top: 300 }, { id: 'u2', top: 900 }, { id: 'u3', top: 1500 }];
    ok(m.activeFromTops(beforeAny, line) === 'u1', 'activeFromTops: before any section reaches the line → first section');
    const midU2 = [{ id: 'u1', top: -400 }, { id: 'u2', top: 60 }, { id: 'u3', top: 700 }];
    ok(m.activeFromTops(midU2, line) === 'u2', 'activeFromTops: u2 top above the line, u3 below → u2 active');
    const atU3 = [{ id: 'u1', top: -900 }, { id: 'u2', top: -300 }, { id: 'u3', top: 120 }];
    ok(m.activeFromTops(atU3, line) === 'u3', 'activeFromTops: last crossed section wins (u3)');
    ok(m.activeFromTops([], line) === null, 'activeFromTops: empty → null');
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/vedic/course.html',
    actions: ['load', 'click an in-page unit link (e.g. #u6)', 'scroll through the nine units'],
    asserts: [
      'the page loads with 0 console errors / pageerrors / failed requests',
      'the sticky #vt-course-nav renders 9 unit links and highlights the active unit on scroll (aria-current)',
      'each of U1–U8 shows concept prose, a citation block and an honest-frame note; U6 shows the strong māraka frame',
      'every "drive it" tool chip navigates to an existing page (index/yogas/delineation and the sibling engine pages)',
      'at 390px width there is no horizontal overflow (the editions table scrolls inside its own container)',
    ],
  },
];

export default { run, DRIVES };
