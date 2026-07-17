// ============================================================================
//  scripts/tests/r32-east-core.mjs — R32 (B-EAST-DATA) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs.
//  Deterministic; no DOM, no network.
//
//  Covers assets/js/core/data/greatworks-east.js (GREAT_WORKS_EAST) — the
//  Eastern Greats extension of the Great Works wing, in the EXACT
//  GREAT_WORKS.authors[] schema. The spine is the licence discipline:
//    • 3 authors; every work carries pdStatus + ≥1 pdSource; every mapping path
//      resolves under pages/;
//    • Varāhamihira: Bṛhajjātaka = 28 chapters, quoteSafe:true, both PD
//      translations named (Iyer/Aiyar + Sastri 1929);
//    • Yogananda: Autobiography 1946 = 48 chapters, quoteSafe:true, ONLY on the
//      1946 first edition (later 1951+/ch.49/Second Coming copyrighted, cite-only);
//      every miracle chapter carries a claim-flag; the Kriya Yoga vs kriyā-yoga
//      (YS II.1) disambiguation string is present;
//    • Vivekananda: Raja Yoga 1896 quoteSafe:true; the post-1929 Complete Works
//      reset is cite-only;
//    • contested blocks carry ≥2 positions (Varāhamihira dates; De Michelis vs
//      traditionalist).
// ============================================================================
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { GREAT_WORKS_EAST, EG_CITATION, EG_METHOD_NOTE } from '../../assets/js/core/data/greatworks-east.js';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const pageExists = p => existsSync(resolve(REPO, 'pages', p.split('#')[0]));

// a chapter "carries the claim-flag" iff it has a flag framing it as a claim.
const CLAIM_FLAG = /claim|never endorsed|contested/i;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  const byId = id => GREAT_WORKS_EAST.find(a => a.id === id);
  const workById = (a, id) => (a.works || []).find(w => w.id === id);

  // ---- 1. top-level shape -------------------------------------------------
  ok(Array.isArray(GREAT_WORKS_EAST) && GREAT_WORKS_EAST.length === 3,
    `3 author records (got ${Array.isArray(GREAT_WORKS_EAST) ? GREAT_WORKS_EAST.length : 'not-array'})`);
  ok(['varahamihira', 'yogananda', 'vivekananda'].every(byId), 'the 3 expected author ids present');
  ok(typeof EG_CITATION === 'string' && EG_CITATION.length > 50, 'EG_CITATION exported');
  ok(typeof EG_METHOD_NOTE === 'string' && /1946/.test(EG_METHOD_NOTE) && /kriyā-yoga/.test(EG_METHOD_NOTE),
    'EG_METHOD_NOTE exported and states the 1946 + kriyā-yoga verdicts');

  // ---- 2. schema conformance across every author/work/chapter -------------
  for (const a of GREAT_WORKS_EAST) {
    for (const k of ['id', 'name', 'dates', 'glyph', 'who', 'line']) {
      ok(typeof a[k] === 'string' && a[k].length, `${a.id}: author.${k} is a non-empty string`);
    }
    ok(Array.isArray(a.works) && a.works.length >= 1, `${a.id}: has works`);
    ok(Array.isArray(a.studyPath) && a.studyPath.length >= 1, `${a.id}: has a studyPath`);
    for (const w of a.works) {
      ok(typeof w.id === 'string' && w.id.length, `${a.id}: work id present`);
      ok(typeof w.quoteSafe === 'boolean', `${a.id}/${w.id}: quoteSafe is boolean`);
      // every work has pdStatus + ≥1 pdSource.
      ok(typeof w.pdStatus === 'string' && w.pdStatus.length > 10, `${a.id}/${w.id}: pdStatus present`);
      ok(Array.isArray(w.pdSources) && w.pdSources.length >= 1, `${a.id}/${w.id}: ≥1 pdSource`);
      ok((w.pdSources || []).every(s => s && typeof s.path === 'string' && typeof s.label === 'string'),
        `${a.id}/${w.id}: pdSources are {path,label}`);
      ok(Array.isArray(w.chapters) && w.chapters.length >= 1, `${a.id}/${w.id}: has chapters`);
      for (const c of w.chapters) {
        ok(typeof c.ref === 'string' && typeof c.title === 'string' && typeof c.gist === 'string',
          `${a.id}/${w.id}/${c.ref}: chapter ref/title/gist strings`);
      }
    }
  }

  // ---- 3. every mapping path resolves under pages/ ------------------------
  let badPath = '';
  for (const a of GREAT_WORKS_EAST) {
    for (const l of (a.siteLinks || [])) if (!pageExists(l.path)) badPath ||= `${a.id} siteLink ${l.path}`;
    for (const s of (a.studyPath || [])) for (const t of (s.tools || [])) if (!pageExists(t.path)) badPath ||= `${a.id} tool ${t.path}`;
    for (const w of a.works) for (const c of w.chapters) for (const sm of (c.siteMapping || [])) if (!pageExists(sm.path)) badPath ||= `${a.id}/${w.id}/${c.ref} ${sm.path}`;
  }
  ok(!badPath, `every siteMapping/siteLink/tool path resolves under pages/ (first bad: ${badPath})`);

  // ---- 4. Varāhamihira — Bṛhajjātaka 28 ch, both PD translations ----------
  {
    const v = byId('varahamihira');
    const bj = workById(v, 'brihajjataka');
    ok(bj && bj.chapters.length === 28, `Bṛhajjātaka 28 chapters (got ${bj && bj.chapters.length})`);
    ok(bj && bj.quoteSafe === true, 'Bṛhajjātaka quoteSafe:true');
    const ed = (bj && bj.edition + ' ' + bj.pdStatus) || '';
    ok(/Iyer|Aiyar/.test(ed) && /Sastri/.test(ed), 'Bṛhajjātaka names BOTH PD translations (Iyer/Aiyar + Sastri)');
    ok(/1885/.test(ed) && /1929/.test(ed), 'Bṛhajjātaka cites the 1885 and 1929 PD editions');
    ok(bj && /public domain/i.test(bj.pdStatus), 'Bṛhajjātaka pdStatus states US public domain');
    // all three Varāhamihira works are PD/quote-safe.
    ok(v.works.every(w => w.quoteSafe === true), 'all 3 Varāhamihira works quoteSafe:true');
    // the chapter spine is I..XXVIII (Roman), 28 distinct refs.
    ok(bj && new Set(bj.chapters.map(c => c.ref)).size === 28, 'Bṛhajjātaka 28 distinct chapter refs');
    // contested block #1: the traditional-vs-modern dates, ≥2 positions (folded into work flags).
    const varFlags = (bj.flags || []).join(' ');
    ok(/traditional/i.test(varFlags) && /(6th cent|modern scholarship|not documented)/i.test(varFlags),
      'Varāhamihira dates contested both ways (traditional Śaka reckoning vs modern 6th-c. consensus)');
  }

  // ---- 5. Yogananda — 1946 Autobiography quote discipline -----------------
  {
    const y = byId('yogananda');
    const auto = workById(y, 'autobiography-of-a-yogi-1946');
    ok(auto && auto.chapters.length === 48, `Autobiography 1946 = 48 chapters (got ${auto && auto.chapters.length})`);
    ok(auto && auto.quoteSafe === true, 'Autobiography 1946 quoteSafe:true');
    // the first edition ends at ch.48; no ch.49.
    ok(auto && auto.chapters[47].ref === '48', 'Autobiography last chapter ref is 48');
    ok(auto && !auto.chapters.some(c => c.ref === '49'), 'no ch.49 in the 1946 first edition');
    ok(auto && auto.chapters[47].flag && /49/.test(auto.chapters[47].flag), 'ch.48 flag notes ch.49 belongs to later copyrighted editions');
    // 1951+ revisions marked copyrighted in the work's own text.
    const autoText = `${auto.edition} ${auto.pdStatus} ${(auto.flags || []).join(' ')}`;
    ok(/1951/.test(autoText) && /(copyright|never quote)/i.test(autoText),
      'the 1951+ revised editions are recorded as copyrighted / never-quote');
    ok(/9th Cir|206 F\.3d/.test(auto.pdStatus), 'Autobiography pdStatus cites SRF v. Ananda (9th Cir.)');

    // quoteSafe:true ONLY on the 1946 first edition among 1946-or-later works;
    // every other quote-safe Yogananda work is a pre-1930 publication.
    for (const w of y.works) {
      if (w.quoteSafe === true) {
        const yr = typeof w.year === 'number' ? w.year : parseInt(String(w.year), 10);
        ok(w.id === 'autobiography-of-a-yogi-1946' || yr < 1930,
          `${w.id}: quoteSafe:true only for the 1946 Autobiography or a pre-1930 work (year ${w.year})`);
      }
    }
    // the copyrighted posthumous compilation is cite-only.
    const scc = workById(y, 'second-coming-of-christ-2004');
    ok(scc && scc.quoteSafe === false, 'The Second Coming of Christ (2004) is cite-only (quoteSafe:false)');
    ok(scc && /copyright|cite-only/i.test(scc.pdStatus), 'Second Coming pdStatus marks it in-copyright/cite-only');

    // EVERY miracle chapter carries a claim-flag.
    const MIRACLE_REFS = ['1', '2', '3', '5', '6', '7', '10', '13', '14', '16', '17', '18', '19',
      '21', '22', '25', '28', '30', '32', '33', '34', '35', '36', '39', '42', '43', '46'];
    let unflagged = [];
    for (const ref of MIRACLE_REFS) {
      const c = auto.chapters.find(ch => ch.ref === ref);
      if (!c) { unflagged.push(`${ref}(missing)`); continue; }
      if (!(typeof c.flag === 'string' && CLAIM_FLAG.test(c.flag))) unflagged.push(ref);
    }
    ok(unflagged.length === 0, `every miracle chapter carries a claim-flag (unflagged: ${unflagged.join(',') || 'none'})`);
    ok(MIRACLE_REFS.length === 27, `miracle-chapter set covered (${MIRACLE_REFS.length})`);

    // the Kriya Yoga vs kriyā-yoga (YS II.1) disambiguation string is present.
    const ch26 = auto.chapters.find(c => c.ref === '26');
    ok(ch26 && /Kriya Yoga/.test(ch26.gist) && /kriyā-yoga/.test(ch26.gist) && /II\.1/.test(ch26.gist) && /NOT|not the same/i.test(ch26.gist),
      'ch.26 gist disambiguates Yogananda’s Kriya Yoga from Patañjali’s kriyā-yoga (YS II.1)');
    ok(ch26 && ch26.flag && /collision|disambiguation/i.test(ch26.flag), 'ch.26 flag calls out the term collision');
    // and the disambiguation is reachable via a glossary siteLink.
    ok((y.siteLinks || []).some(l => /glossary/.test(l.path)) || auto.chapters.some(c => (c.siteMapping || []).some(m => /glossary/.test(m.path))),
      'the required glossary disambiguation is cross-linked from the Yogananda data');
    // the astrology chapter maps to the vedic wing (museum-piece remedy framing).
    const ch16 = auto.chapters.find(c => c.ref === '16');
    ok(ch16 && (ch16.siteMapping || []).some(m => /vedic/.test(m.path)), 'ch.16 "Outwitting the Stars" maps to the Vedic wing');
  }

  // ---- 6. Vivekananda — Raja Yoga PD, Complete Works cite-only ------------
  {
    const vk = byId('vivekananda');
    const ry = workById(vk, 'raja-yoga');
    const yr = typeof ry.year === 'number' ? ry.year : parseInt(String(ry.year), 10);
    ok(ry && yr === 1896 && ry.quoteSafe === true, 'Raja Yoga 1896 quoteSafe:true');
    ok(ry && ry.chapters.length === 15, `Raja Yoga 15 chapters (got ${ry && ry.chapters.length})`);
    // post-1929 Complete Works reset is cite-only (gated in pdStatus).
    const cw = workById(vk, 'the-yogas-and-complete-works');
    ok(cw && /cite-only/i.test(cw.pdStatus), 'the modern Complete Works reset is cite-only');
    ok(cw && /(1930|post-1929|1929)/.test(cw.pdStatus), 'the Complete Works cite-only gate is pinned to the post-1929 reset');
    // contested block #2: De Michelis "Modern Yoga" vs traditionalist, ≥2 positions
    // (folded from the JSON hazards into the primary work flags).
    const vkFlags = (ry.flags || []).join(' ');
    ok(/De Michelis/i.test(vkFlags) && /traditionalist/i.test(vkFlags),
      'Vivekananda reception contested both ways (De Michelis "Modern Yoga" vs traditionalist)');
    // the kriyā-yoga (YS sense) note is present and distinguished from the lineage technique.
    const ii2 = ry.chapters.find(c => c.ref === 'II.2');
    ok(ii2 && /kriyā-yoga/.test(ii2.gist + (ii2.gist || '')) && /Yoga Sūtras|II\.1|Yogananda-lineage|Lahiri/i.test(ii2.gist),
      'Raja Yoga II.2 carries the kriyā-yoga (YS sense) note distinct from the lineage Kriya Yoga');
  }

  return { pass: failures.length === 0, failures };
}

export default { run };
