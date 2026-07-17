// ============================================================================
//  scripts/tests/r31-practices-core.mjs — R31 (B-practices-data) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a `DRIVES`
//  array for the Chromium sweep. Deterministic; no DOM, no network.
//
//  Covers core/practices.js + core/data/practices/mudras.js — the haṭha-yogic
//  mudrā catalog (a MUSEUM RECORD, described never prescribed):
//    • the census: 35 records = 25 Gheraṇḍa + 10 Haṭhayogapradīpikā;
//    • crosswalk RECIPROCITY (every crosswalk resolves, points back, and joins
//      the two texts) + the crosswalkOf/mudraById/mudrasBySource contract;
//    • the FRAMING-SAFETY invariants (the non-negotiable ones): gs-khecari AND
//      hyp-khecari BOTH carry a frenum-cutting harmNote; hyp-vajroli carries a
//      CLINICAL genito-urinary harmNote; gs-vajroni is an inversion-kind figure
//      NOT a genito-urinary one, and does NOT share a figure with hyp-vajroli;
//      every contested block has ≥2 positions;
//    • the DESCRIPTIVE-VOICE lint over every description/purpose (museum voice,
//      no imperative-to-reader verb at the record start);
//    • artId hygiene (every artId a real figure archetype; crosswalk pairs share
//      a figure except the vajrolī/vajroṇī split) + practicesStats (live);
//    • NFC hygiene; the MUDRA_GROUPS taxonomy; the caveat + citation framing.
//
//  DRIVES is empty: this builder owns no pages (pages/practices/* is the wing
//  builder's; its pages are driven by the wing builder's test module).
// ============================================================================
import {
  HATHA_MUDRAS, MUDRA_GROUPS, PRACTICES_CAVEAT, PRACTICES_META, PRACTICES_CITATION,
  mudrasBySource, mudraById, crosswalkOf, practicesStats, searchPractices,
} from '../../assets/js/core/practices.js';

const isNFC = s => typeof s !== 'string' || s === s.normalize('NFC');
// The figure archetypes app/practices-art.js can draw (its ART_ARCHETYPES).
const ART_ARCHETYPES = new Set([
  'seated-forward-fold', 'seated-lock', 'seated-strike', 'abdominal-lock',
  'throat-lock', 'root-lock', 'tongue-palate', 'gaze-brow', 'inverted',
  'arm-balance', 'six-gates', 'serpent-coil', 'folded-legs', 'crow-beak',
  'standing-water', 'element-earth', 'element-water', 'element-fire',
  'element-air', 'element-ether', 'not-diagrammed',
]);
const INVERSION_ARCHETYPES = new Set(['inverted', 'arm-balance']);
// Imperative-to-reader openers that a museum record must never start with.
const IMPERATIVE = /^(Sit|Breathe|Hold|Place|Press|Repeat|Inhale|Exhale|Visualize|Visualise|Recite|Cut|Draw|Close|Contract|Fix|Raise|Throw|Purse|Extend|Make|Fold|Move|Rub|Insert|Turn|Grasp|Stand|Apply|Keep|Practise|Practice|Do)\b/;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };
  const byId = Object.fromEntries(HATHA_MUDRAS.map(r => [r.id, r]));

  // ---- 1. census ----------------------------------------------------------
  ok(HATHA_MUDRAS.length === 35, `35 records (got ${HATHA_MUDRAS.length})`);
  ok(mudrasBySource('gheranda').length === 25, `25 gheranda (got ${mudrasBySource('gheranda').length})`);
  ok(mudrasBySource('hyp').length === 10, `10 hyp (got ${mudrasBySource('hyp').length})`);
  ok(mudrasBySource('nope').length === 0, "mudrasBySource('nope') → []");
  ok(HATHA_MUDRAS.every(r => r.source === 'gheranda' || r.source === 'hyp'), 'every source ∈ {gheranda, hyp}');
  ok(HATHA_MUDRAS.every(r => r.family === 'hatha-mudra'), 'every family is hatha-mudra');
  ok(new Set(HATHA_MUDRAS.map(r => r.id)).size === 35, 'all 35 ids unique');

  // ---- 2. schema shape ----------------------------------------------------
  let shapeBad = 0;
  for (const r of HATHA_MUDRAS) {
    for (const k of ['id', 'name', 'iast', 'devanagari', 'locus', 'description', 'purpose']) {
      if (typeof r[k] !== 'string' || !r[k].length) shapeBad++;
    }
    if (!Array.isArray(r.crosswalk)) shapeBad++;
    if (!Array.isArray(r.sources) || !r.sources.length) shapeBad++;
    if (!(r.harmNote === null || typeof r.harmNote === 'string')) shapeBad++;
    if (!(r.contested === null || (r.contested && Array.isArray(r.contested.positions)))) shapeBad++;
    if (typeof r.artId !== 'string' || !ART_ARCHETYPES.has(r.artId)) shapeBad++;
  }
  ok(shapeBad === 0, `contract shape holds on every record (${shapeBad} bad)`);

  // ---- 3. mudraById -------------------------------------------------------
  ok(mudraById('gs-khecari') && mudraById('gs-khecari').name === 'Khecarī Mudrā', 'mudraById resolves gs-khecari');
  ok(mudraById('nope') === null, 'mudraById unknown → null');

  // ---- 4. crosswalk RECIPROCITY ------------------------------------------
  let xwBad = 0, xwFirst = '';
  for (const r of HATHA_MUDRAS) {
    for (const cid of r.crosswalk) {
      const tgt = byId[cid];
      if (!tgt) { xwBad++; if (!xwFirst) xwFirst = `${r.id}→${cid} unresolved`; continue; }
      if (!tgt.crosswalk.includes(r.id)) { xwBad++; if (!xwFirst) xwFirst = `${r.id}→${cid} not reciprocal`; }
      if (tgt.source === r.source) { xwBad++; if (!xwFirst) xwFirst = `${r.id}→${cid} same-source`; }
    }
  }
  ok(xwBad === 0, `crosswalk reciprocity holds both ways + joins the two texts (${xwBad} bad; first: ${xwFirst})`);
  // the 10 hyp records + 10 crosswalked gheranda names each carry exactly one pairing
  ok(mudrasBySource('hyp').every(r => r.crosswalk.length === 1), 'every hyp record crosswalks to a gheranda record');
  ok(mudrasBySource('gheranda').filter(r => r.crosswalk.length > 0).length === 10, '10 gheranda records are crosswalked (15 are singletons)');

  // crosswalkOf() contract — resolved array
  ok(Array.isArray(crosswalkOf('gs-khecari')) && crosswalkOf('gs-khecari')[0].id === 'hyp-khecari', 'crosswalkOf(gs-khecari) → [hyp-khecari]');
  ok(crosswalkOf('gs-nabho-mudra').length === 0, 'crosswalkOf(gs-nabho-mudra) → [] (singleton)');
  ok(crosswalkOf('nope').length === 0, 'crosswalkOf(unknown) → []');
  ok(crosswalkOf('gs-vajroni')[0].id === 'hyp-vajroli' && crosswalkOf('hyp-vajroli')[0].id === 'gs-vajroni', 'vajroṇī↔vajrolī crosswalk resolves both ways');

  // ---- 5. FRAMING-SAFETY invariants (non-negotiable) ----------------------
  ok(byId['gs-khecari'].harmNote && /cut/i.test(byId['gs-khecari'].harmNote), 'gs-khecari carries a frenum-cutting harmNote');
  ok(byId['hyp-khecari'].harmNote && /cut/i.test(byId['hyp-khecari'].harmNote), 'hyp-khecari carries a frenum-cutting harmNote');
  ok(byId['hyp-vajroli'].harmNote && /CLINICAL/.test(byId['hyp-vajroli'].harmNote)
    && /(urethral|bladder|urinary)/i.test(byId['hyp-vajroli'].harmNote), 'hyp-vajroli carries a clinical genito-urinary harmNote');
  // gs-vajroni is inversion-kind, NOT genito-urinary, and shares no figure with hyp-vajroli
  ok(INVERSION_ARCHETYPES.has(byId['gs-vajroni'].artId), `gs-vajroni is an inversion-kind figure (got '${byId['gs-vajroni'].artId}')`);
  ok(/inver/i.test(byId['gs-vajroni'].harmNote), 'gs-vajroni harmNote is an inversion caution');
  ok(/NOT the genito-urinary/i.test(byId['gs-vajroni'].harmNote), 'gs-vajroni harmNote explicitly disclaims the genito-urinary risk');
  ok(!/urethral|bladder|seminal|urinary-tract/i.test(byId['gs-vajroni'].harmNote), 'gs-vajroni harmNote names no genito-urinary instruction');
  ok(byId['gs-vajroni'].artId !== byId['hyp-vajroli'].artId, 'vajroṇī and vajrolī do NOT share a figure (same name, different practice)');
  // every contested block carries ≥2 positions
  const contestedRecs = HATHA_MUDRAS.filter(r => r.contested);
  ok(contestedRecs.length === 6, `6 records carry a contested block (got ${contestedRecs.length})`);
  ok(contestedRecs.every(r => r.contested.positions.length >= 2), 'every contested block has ≥2 positions');
  ok(['gs-khecari', 'hyp-khecari', 'gs-vajroni', 'hyp-vajroli', 'gs-yoni-mudra', 'gs-manduki'].every(id => byId[id].contested), 'the expected records carry contested blocks');

  // ---- 6. DESCRIPTIVE-VOICE lint -----------------------------------------
  let voiceBad = 0, voiceFirst = '';
  for (const r of HATHA_MUDRAS) {
    for (const [field, txt] of [['description', r.description], ['purpose', r.purpose]]) {
      if (IMPERATIVE.test(txt.trimStart())) { voiceBad++; if (!voiceFirst) voiceFirst = `${r.id}.${field} imperative`; }
      if (!/^The text\b/.test(txt.trimStart())) { voiceBad++; if (!voiceFirst) voiceFirst = `${r.id}.${field} not museum voice`; }
    }
  }
  ok(voiceBad === 0, `descriptive-voice lint: every description/purpose is museum voice (${voiceBad} bad; first: ${voiceFirst})`);

  // ---- 7. harmNote census + known-dangerous ids --------------------------
  const withHarm = HATHA_MUDRAS.filter(r => r.harmNote);
  ok(withHarm.length === 8, `8 records carry a harmNote (got ${withHarm.length})`);
  for (const id of ['gs-mahavedha', 'gs-khecari', 'gs-vajroni', 'gs-pasini', 'gs-matangini', 'hyp-mahavedha', 'hyp-khecari', 'hyp-vajroli']) {
    ok(!!byId[id].harmNote, `${id} carries a harmNote`);
  }

  // ---- 8. artId figure-sharing rules -------------------------------------
  let artBad = 0;
  for (const r of HATHA_MUDRAS) {
    for (const cid of r.crosswalk) {
      const shared = byId[cid] && byId[cid].artId === r.artId;
      const split = (r.id === 'gs-vajroni' || r.id === 'hyp-vajroli');
      if (split ? shared : !shared) artBad++;
    }
  }
  ok(artBad === 0, `crosswalk pairs share a figure except the vajrolī/vajroṇī split (${artBad} bad)`);
  // the shared-figure grouping is real (e.g. tongue-palate spans 4 tongue seals)
  ok(HATHA_MUDRAS.filter(r => r.artId === 'tongue-palate').length >= 4, 'the tongue-palate figure groups ≥4 tongue seals');

  // ---- 9. practicesStats (live) ------------------------------------------
  const st = practicesStats();
  ok(st.total === 35, `stats.total 35 (got ${st.total})`);
  ok(st.bySource.gheranda === 25 && st.bySource.hyp === 10, `stats.bySource 25/10 (got ${st.bySource.gheranda}/${st.bySource.hyp})`);
  ok(st.withHarmNote === 8, `stats.withHarmNote 8 (got ${st.withHarmNote})`);
  ok(st.contested === 6, `stats.contested 6 (got ${st.contested})`);
  ok(st.groups === 8 && st.builtGroups === 1, `stats.groups 8 / builtGroups 1 (got ${st.groups}/${st.builtGroups})`);
  ok(JSON.stringify(st) === JSON.stringify(practicesStats()), 'practicesStats deterministic (two calls deep-equal)');

  // ---- 10. searchPractices (diacritic-folded) ----------------------------
  ok(searchPractices('khecari').some(r => r.id === 'gs-khecari'), "folded 'khecari' matches khecarī");
  ok(searchPractices('tongue').some(r => r.id === 'hyp-khecari'), "searchPractices('tongue') hits a tongue seal");
  ok(searchPractices('kundalini', { source: 'hyp' }).every(r => r.source === 'hyp'), 'searchPractices source filter narrows to hyp');
  ok(searchPractices('').length === 35, 'empty query → full catalog');
  ok(searchPractices('', { source: 'gheranda' }).length === 25, 'empty query + source filter → 25');

  // ---- 11. NFC hygiene ----------------------------------------------------
  let nfcBad = 0;
  for (const r of HATHA_MUDRAS) {
    for (const k of ['name', 'iast', 'devanagari', 'locus', 'description', 'purpose', 'harmNote', 'textCaution']) {
      if (!isNFC(r[k])) nfcBad++;
    }
    for (const s of r.sources) if (!isNFC(s)) nfcBad++;
  }
  ok(nfcBad === 0, `all strings NFC-normalized (${nfcBad} bad)`);

  // ---- 12. MUDRA_GROUPS taxonomy -----------------------------------------
  ok(MUDRA_GROUPS.length === 8, `8 practice groups (got ${MUDRA_GROUPS.length})`);
  ok(MUDRA_GROUPS.filter(g => g.built).length === 1, 'exactly one built group');
  ok(MUDRA_GROUPS.find(g => g.id === 'mudra').built === true, 'the mudra group is built');
  ok(MUDRA_GROUPS.find(g => g.id === 'mudra').records === 35, 'the mudra group declares 35 records');
  ok(MUDRA_GROUPS.every(g => g.id && g.name && g.lede && g.status && typeof g.built === 'boolean'), 'every group has id/name/lede/status/built');

  // ---- 13. caveat + citation + meta --------------------------------------
  ok(typeof PRACTICES_CAVEAT === 'string' && /described, never prescribed/i.test(PRACTICES_CAVEAT) && /instruction to the reader/i.test(PRACTICES_CAVEAT), 'PRACTICES_CAVEAT carries the framing');
  ok(typeof PRACTICES_CITATION === 'string' && /Vasu/.test(PRACTICES_CITATION) && /Sinh/.test(PRACTICES_CITATION), 'PRACTICES_CITATION names the two editions');
  ok(PRACTICES_META && PRACTICES_META.census && PRACTICES_META.census.total === 35, 'PRACTICES_META carries the source census (35)');
  ok(PRACTICES_META.editionResolution && /b28140102/.test(JSON.stringify(PRACTICES_META.editionResolution)), 'PRACTICES_META carries the edition-resolution note');

  return { pass: failures.length === 0, failures };
}

// This builder owns no pages; pages/practices/* is the wing builder's, driven by
// the wing builder's Chromium test module.
export const DRIVES = [];

export default { run, DRIVES };
