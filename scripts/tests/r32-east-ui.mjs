// ============================================================================
//  scripts/tests/r32-east-ui.mjs — R32 (B-EAST-WING) Great Works · Eastern
//  masters wing UI headless tests. Exports `async run() -> {pass, failures[],
//  notes[]}` for engine-test.mjs and a `DRIVES` array for the Chromium sweep.
//
//  Two tiers (the parallel-builder pattern from r30-buddhist-ui):
//   • STRUCTURAL (always runnable): read the four new page HTMLs + the new app
//     module + the edited hub index as text and assert the load-bearing
//     invariants — mountChrome('greatworks'), initGreatWorksEast wiring, the
//     #gw-root data-gw modes, the renderer reuse (imports from greatworks.js),
//     no stray requestAnimationFrame, the Kriya-Yoga disambiguation callout on
//     the Yogananda + Vivekananda pages, the miracle-claims framing callout, and
//     the Eastern-masters section wired into the greatworks hub.
//   • BEHAVIOURAL (guarded): dynamically import B-east-data's pure data contract
//     (core/data/greatworks-east.js) and assert the data↔wing contract this UI
//     codes against — GREAT_WORKS_EAST is an author ARRAY of the 3 expected ids
//     in the GREAT_WORKS.authors[] shape, every work has chapters the renderer
//     will draw, and every siteMapping/siteLink/tool path resolves under pages/.
//     When the module is absent (B-east-data integrates in parallel) the block
//     is SKIPPED and noted, never failed.
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

  // ---- STRUCTURAL: the four new pages ------------------------------------
  const pages = {
    'pages/greatworks/east.html': 'east',
    'pages/greatworks/varahamihira.html': 'varahamihira',
    'pages/greatworks/yogananda.html': 'yogananda',
    'pages/greatworks/vivekananda.html': 'vivekananda',
  };
  for (const [p, mode] of Object.entries(pages)) {
    ok(has(p), `${p} exists`);
    if (!has(p)) continue;
    const h = read(p);
    ok(/mountChrome\(['"]greatworks['"]\)/.test(h), `${mode}: mounts chrome key greatworks`);
    ok(/initGreatWorksEast\(\)/.test(h), `${mode}: calls initGreatWorksEast()`);
    ok(/from '\.\.\/\.\.\/assets\/js\/app\/greatworks-east\.js'/.test(h), `${mode}: imports the east app module`);
    ok(new RegExp(`id="gw-root"[^>]*data-gw="${mode}"`).test(h), `${mode}: #gw-root data-gw="${mode}"`);
    ok(/style\.css/.test(h), `${mode}: links style.css`);
    ok(/crumb/.test(h) && /Great Works/.test(h), `${mode}: has the Great Works breadcrumb`);
  }

  // the three per-author pages breadcrumb up through the east hub
  for (const p of ['pages/greatworks/varahamihira.html', 'pages/greatworks/yogananda.html', 'pages/greatworks/vivekananda.html']) {
    if (!has(p)) continue;
    ok(/href="east\.html"/.test(read(p)), `${p}: breadcrumbs through east.html`);
  }

  // Kriya-Yoga disambiguation callout — REQUIRED on Yogananda (primary) + Vivekananda
  for (const p of ['pages/greatworks/yogananda.html', 'pages/greatworks/vivekananda.html']) {
    if (!has(p)) continue;
    const h = read(p).replace(/\s+/g, ' ');
    ok(/Kriya Yoga/.test(h) && /kriyā-yoga/.test(h), `${p}: names both Kriya Yoga and kriyā-yoga`);
    ok(/II\.1/.test(h) && /tapas/.test(h) && /īśvarapraṇidhāna/.test(h), `${p}: cites YS II.1 (tapas…īśvarapraṇidhāna)`);
    ok(/collision, not an identity/.test(h) || /two[^<]*different things/i.test(h), `${p}: frames the term as a collision, not identity`);
    ok(/glossary\.html/.test(read(p)), `${p}: links the glossary disambiguation`);
  }

  // Yogananda page: miracle-claims framing + the 1946-only PD case study
  if (has('pages/greatworks/yogananda.html')) {
    const h = read('pages/greatworks/yogananda.html').replace(/\s+/g, ' ');
    ok(/never endorsed/.test(h) && /book's claim/.test(h), 'yogananda: miracle chapters framed as the book\'s claims, never endorsed');
    ok(/1946 first edition/.test(h) && /206 F\.3d 1322/.test(h), 'yogananda: the 1946-first-edition PD / SRF v. Ananda case study is present');
    ok(/museum piece/i.test(h), 'yogananda: the ch.16 gem-remedy museum-piece framing is present');
  }

  // Varāhamihira page: the two-PD-translations flagship note
  if (has('pages/greatworks/varahamihira.html')) {
    const h = read('pages/greatworks/varahamihira.html').replace(/\s+/g, ' ');
    ok(/Iyer/.test(h) && /Sastri/.test(h) && /1885/.test(h) && /1929/.test(h), 'varahamihira: names both PD translations (Iyer 1885, Sastri 1929)');
    ok(/1996 reprint/.test(h), 'varahamihira: warns the "2nd ed." scan is a non-PD 1996 reprint');
  }

  // ---- STRUCTURAL: the hub index gained the Eastern-masters section -------
  if (has('pages/greatworks/index.html')) {
    const h = read('pages/greatworks/index.html');
    ok(/id="eastern-masters"/.test(h), 'greatworks index: has the Eastern-masters section');
    for (const t of ['east.html', 'varahamihira.html', 'yogananda.html', 'vivekananda.html']) {
      ok(new RegExp(`href="${t.replace('.', '\\.')}"`).test(h), `greatworks index: links ${t}`);
    }
  }

  // ---- STRUCTURAL: the new app module reuses the Western renderer ---------
  {
    const a = 'assets/js/app/greatworks-east.js';
    ok(has(a), `${a} exists`);
    if (has(a)) {
      const s = read(a);
      ok(!/requestAnimationFrame/.test(s), 'greatworks-east.js has no requestAnimationFrame (site invariant)');
      ok(/from '\.\.\/core\/data\/greatworks-east\.js'/.test(s), 'greatworks-east.js imports the GREAT_WORKS_EAST data contract');
      ok(/GREAT_WORKS_EAST/.test(s), 'greatworks-east.js consumes GREAT_WORKS_EAST');
      ok(/from '\.\/greatworks\.js'/.test(s) && /authorSection/.test(s) && /workRail/.test(s) && /wireFilter/.test(s) && /wireRail/.test(s) && /injectCss/.test(s),
        'greatworks-east.js reuses the Western renderer (authorSection/workRail/wireFilter/wireRail/injectCss)');
      ok(/export function initGreatWorksEast/.test(s), 'greatworks-east.js exports initGreatWorksEast');
      ok(/Array\.isArray\(GREAT_WORKS_EAST\)/.test(s), 'greatworks-east.js accepts the bare-array data shape (B-east-data\'s contract)');
    }
  }

  // ---- STRUCTURAL: the Western renderer additively exports its pieces -----
  {
    const g = 'assets/js/app/greatworks.js';
    if (has(g)) {
      const s = read(g);
      for (const fn of ['injectCss', 'authorSection', 'workRail', 'wireRail', 'wireFilter']) {
        ok(new RegExp(`export function ${fn}\\b`).test(s), `greatworks.js exports ${fn} (trivially-additive reuse hook)`);
      }
    }
  }

  // ---- BEHAVIOURAL: B-east-data's pure data contract (guarded) ------------
  await guard('core/data/greatworks-east.js contract', async () => {
    const mod = await import('../../assets/js/core/data/greatworks-east.js');
    const raw = mod.GREAT_WORKS_EAST;
    const authors = Array.isArray(raw) ? raw : (raw && raw.authors) || [];
    ok(authors.length === 3, `GREAT_WORKS_EAST has 3 authors (got ${authors.length})`);
    ok(['varahamihira', 'yogananda', 'vivekananda'].every(id => authors.some(a => a.id === id)), 'the 3 expected author ids present');
    ok(typeof mod.EG_CITATION === 'string' && typeof mod.EG_METHOD_NOTE === 'string', 'EG_CITATION + EG_METHOD_NOTE exported (the hub renders them)');

    // Every author renders: glyph/name/dates/who + ≥1 work with ≥1 chapter, and
    // a studyPath the renderer draws.
    for (const a of authors) {
      ok(['id', 'name', 'dates', 'glyph', 'who', 'line'].every(k => typeof a[k] === 'string' && a[k].length), `${a.id}: has the renderable author header fields`);
      ok(Array.isArray(a.works) && a.works.length >= 1 && a.works.every(w => Array.isArray(w.chapters) && w.chapters.length >= 1), `${a.id}: every work has ≥1 chapter`);
      ok(Array.isArray(a.studyPath) && a.studyPath.length >= 1, `${a.id}: has a studyPath`);
      ok(a.works.every(w => typeof w.quoteSafe === 'boolean' && typeof w.pdStatus === 'string'), `${a.id}: every work has quoteSafe boolean + pdStatus (the PD badge + box)`);
    }

    // Both quote-safe AND cite-only badges must appear across the wing so the
    // renderer's two badge states are both exercised.
    const allWorks = authors.flatMap(a => a.works);
    ok(allWorks.some(w => w.quoteSafe === true), 'at least one quote-safe work (PD badge)');
    ok(allWorks.some(w => w.quoteSafe === false), 'at least one cite-only work (cite badge)');

    // Every siteMapping / siteLink / studyPath tool path resolves under pages/
    // (the chips must not 404 — the audit would fail otherwise).
    const pageOk = p => existsSync(resolve(REPO, 'pages', String(p).split('#')[0]));
    let bad = 0, checked = 0, firstBad = '';
    for (const a of authors) {
      for (const l of (a.siteLinks || [])) { checked++; if (!pageOk(l.path)) { bad++; firstBad ||= `${a.id} siteLink ${l.path}`; } }
      for (const s of (a.studyPath || [])) for (const t of (s.tools || [])) { checked++; if (!pageOk(t.path)) { bad++; firstBad ||= `${a.id} tool ${t.path}`; } }
      for (const w of a.works) for (const c of w.chapters) for (const sm of (c.siteMapping || [])) { checked++; if (!pageOk(sm.path)) { bad++; firstBad ||= `${a.id}/${w.id}/${c.ref} ${sm.path}`; } }
    }
    ok(bad === 0, `every chip path resolves under pages/ (${checked} checked, ${bad} bad; first: ${firstBad || 'none'})`);

    // The Kriya-Yoga disambiguation must survive into the rendered chapter data
    // (Yogananda ch.26 gist), so the page shows it even without the callout.
    const y = authors.find(a => a.id === 'yogananda');
    const auto = y && y.works.find(w => w.id === 'autobiography-of-a-yogi-1946');
    const ch26 = auto && auto.chapters.find(c => c.ref === '26');
    ok(ch26 && /Kriya Yoga/.test(ch26.gist) && /kriyā-yoga/.test(ch26.gist), 'Yogananda ch.26 gist carries the Kriya Yoga vs kriyā-yoga disambiguation');
  });

  return { pass: failures.length === 0, failures, notes };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs).
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/greatworks/east.html',
    actions: ['load'],
    asserts: [
      'the Eastern-masters hub renders 3 author cards (Varāhamihira, Vivekananda, Yogananda) with work/chapter counts',
      'the quote-safe vs cite-only vs claims legend renders; the method note + citation render',
      '390px: no horizontal overflow; reduced-motion: no animation',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/greatworks/varahamihira.html',
    actions: ['load', 'expand the Bṛhajjātaka work', 'filter chapters by a term'],
    asserts: [
      'the Bṛhajjātaka chapter map renders 28 adhyāyas with siteMapping chips into the Vedic wing / praśna',
      'the PD · quote-safe badge shows; the two-PD-translations flagship callout is present',
      'the chapter filter narrows the table; the work rail jumps to each work',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/greatworks/yogananda.html',
    actions: ['load', 'expand the 1946 Autobiography work'],
    asserts: [
      'the 48-chapter map renders; miracle chapters carry the ⚑ claim flag; ch.16 chips into the Vedic wing',
      'the Kriya-Yoga vs kriyā-yoga disambiguation callout is present and links the glossary',
      'the Second Coming of Christ (2004) work shows the Cite-only badge (both badge states visible)',
      'the SRF v. Ananda 1946-only PD case-study callout renders',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/greatworks/vivekananda.html',
    actions: ['load', 'expand the Raja Yoga work'],
    asserts: [
      'the Raja Yoga chapter map renders with pāda chips into the Yoga Sūtras wing (labelled his rendering)',
      'the kriyā-yoga (YS sense) callout distinguishes it from Yogananda\'s Kriya Yoga; the De Michelis both-ways note is present',
      'the PD · quote-safe badge shows on Raja Yoga',
      'no console error / pageerror / failed request',
    ],
  },
  {
    page: 'pages/greatworks/index.html',
    actions: ['load'],
    asserts: [
      'the Eastern-masters section renders and links east.html + the 3 author pages',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
