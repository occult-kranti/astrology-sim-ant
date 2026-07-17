// ============================================================================
//  scripts/tests/r30-buddhist-core.mjs — R30 (B-bud-data) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a
//  `DRIVES` array for the Chromium sweep. Deterministic; no DOM, no network.
//
//  Covers core/buddhist.js + core/data/buddhist/*:
//    • the RECONSTRUCTION INVARIANT over all 213 records (the spine): for every
//      record, reconstruct(rec) === (rec.pali ?? rec.sanskrit), incl. all 49
//      MN 118 refrain-uses after template expansion;
//    • live counts (segments / glossed words / peyyāla tallies) match the frozen
//      corpus metrics (metta 43/138, heart 16/132, mn118 154 = 105+49 / 6 refrains);
//    • the contract shape (words[].w/gloss, translation:{text,source}|null, notes);
//    • licence tags ∈ {cc0, pd-age, original}; verbatim translation spot-checks;
//    • refrain referential integrity + substitution-slot validity;
//    • null translation accepted on the Metta colophon; NFC hygiene;
//    • search (diacritic-folded) + heart CONTESTED blocks (≥2 positions each).
//
//  DRIVES is empty: this builder owns no pages (the pages/buddhist/* reading
//  rooms are driven by the wing builder's test module).
// ============================================================================
import {
  BUDDHIST_TEXTS, BUDDHIST_CITATION,
  textById, recordsFor, expandRefrain, reconstruct, buddhistStats, searchBuddhist,
  MN118_REFRAINS, MN118_RECORDS, MN118_SUBSTITUTION_GLOSSES,
  METTA_RECORDS, HEART_RECORDS,
} from '../../assets/js/core/buddhist.js';

const LICENCE_TAGS = new Set(['cc0', 'pd-age', 'original']);
const isNFC = s => typeof s !== 'string' || s === s.normalize('NFC');
const VEDIC = /[॒॑]/;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. wing shape / counts --------------------------------------------
  // R31 added the Dhammapada (vaggas 1–5, Dhp 1–75) as a 4th text.
  ok(BUDDHIST_TEXTS.length === 4, `4 texts (got ${BUDDHIST_TEXTS.length})`);
  ok(BUDDHIST_TEXTS.map(t => t.id).join(',') === 'metta,heart,mn118,dhammapada', 'text ids metta,heart,mn118,dhammapada in order');
  const metta = textById('metta'), heart = textById('heart'), mn = textById('mn118'), dhp = textById('dhammapada');
  ok(metta && metta.segments === 43 && metta.words === 138, `metta 43 segments / 138 words (got ${metta && metta.segments}/${metta && metta.words})`);
  ok(heart && heart.segments === 16 && heart.words === 132, `heart 16 segments / 132 words (got ${heart && heart.segments}/${heart && heart.words})`);
  ok(mn && mn.segments === 154 && mn.words === 1184, `mn118 154 segments / 1184 full-record words (got ${mn && mn.segments}/${mn && mn.words})`);
  ok(mn.fullRecords === 105 && mn.refrainUseRecords === 49 && mn.refrains === 6, `mn118 105 full + 49 refrain-use / 6 refrains (got ${mn.fullRecords}+${mn.refrainUseRecords}/${mn.refrains})`);
  ok(dhp && dhp.segments === 395 && dhp.words === 957, `dhammapada 395 segments / 957 words (got ${dhp && dhp.segments}/${dhp && dhp.words})`);
  ok(metta.lang === 'pi' && heart.lang === 'sa' && mn.lang === 'pi' && dhp.lang === 'pi', 'lang pi/sa/pi/pi');
  ok(textById('nope') === undefined, 'textById unknown id → undefined');
  ok(recordsFor('metta').length === 43 && recordsFor('dhammapada').length === 395 && recordsFor('nope').length === 0, 'recordsFor resolves / [] for unknown');

  // ---- 2. buddhistStats (live) -------------------------------------------
  const st = buddhistStats();
  ok(st.texts === 4 && st.segments === 43 + 16 + 154 + 395, `stats: 4 texts / ${43 + 16 + 154 + 395} segments (got ${st.segments})`);
  ok(st.glossedWords === 138 + 132 + 1184 + 957, `stats: glossedWords ${138 + 132 + 1184 + 957} (got ${st.glossedWords})`);
  ok(st.refrains === 6 && st.refrainUseRecords === 49, 'stats: 6 refrains / 49 refrain-uses');
  ok(st.byLicence.cc0 === 43 + 154 + 395 && st.byLicence['pd-age'] === 16, `stats byLicence cc0=${43 + 154 + 395}, pd-age=16 (got ${st.byLicence.cc0}/${st.byLicence['pd-age']})`);
  ok(st.glossLicence === 'original', 'stats: glossLicence original');
  ok(JSON.stringify(st) === JSON.stringify(buddhistStats()), 'buddhistStats deterministic (two calls deep-equal)');

  // ---- 3. THE RECONSTRUCTION INVARIANT — over all 608 records ------------
  let reFail = 0, reFirst = '', reTotal = 0;
  for (const t of BUDDHIST_TEXTS) {
    for (const rec of recordsFor(t.id)) {
      reTotal++;
      const surface = rec.pali ?? rec.sanskrit;
      if (reconstruct(rec) !== surface) { reFail++; if (!reFirst) reFirst = `${t.id} ${rec.ref}`; }
    }
  }
  ok(reTotal === 43 + 16 + 154 + 395, `608 total records across the wing (got ${reTotal})`);
  ok(reFail === 0, `reconstruction invariant holds on all 608 records (${reFail} fail; first: ${reFirst})`);

  // spot: a full record and a refrain-use, explicitly
  const mfull = MN118_RECORDS.find(r => r.ref === 'mn118:8.3');
  ok(reconstruct(mfull) === mfull.pali, 'mn118:8.3 (full) reconstructs to pali');
  const muse = MN118_RECORDS.find(r => r.ref === 'mn118:18.3');
  ok(muse.kind === 'refrain-use' && reconstruct(muse) === muse.pali, 'mn118:18.3 (refrain-use) expands+reconstructs to pali');

  // ---- 4. refrain referential integrity + slot validity ------------------
  const refIds = new Set(MN118_REFRAINS.map(r => r.id));
  const uses = MN118_RECORDS.filter(r => r.kind === 'refrain-use');
  ok(uses.length === 49 && uses.every(r => refIds.has(r.refrain)), 'every refrain-use.refrain resolves to a real refrain');
  let slotBad = 0;
  for (const r of uses) {
    const rf = MN118_REFRAINS.find(x => x.id === r.refrain);
    const slots = new Set(rf.template.filter(t => t.slot !== undefined).map(t => t.slot));
    for (const k of Object.keys(r.substitutions || {})) if (!slots.has(k)) slotBad++;
  }
  ok(slotBad === 0, `every substitution slot is a real template slot (${slotBad} bad)`);
  // expandRefrain contract
  ok(expandRefrain(mfull).length === 0, 'expandRefrain([full record]) === [] (only refrain-uses expand)');
  const exp = expandRefrain(muse);
  ok(exp.length > 0 && exp.every(w => 'w' in w && 'gloss' in w), 'expandRefrain returns {w,gloss,gram,ped} tokens');
  ok(exp.map(w => w.w).join(' ') === muse.pali, 'expandRefrain(muse) tokens rejoin to pali');
  ok(MN118_SUBSTITUTION_GLOSSES.length === 13, `13 substitution glosses (got ${MN118_SUBSTITUTION_GLOSSES.length})`);

  // ---- 5. null translation accepted on the colophon ----------------------
  const colophon = METTA_RECORDS.find(r => r.ref === 'snp1.8:10.5');
  ok(colophon && colophon.translation === null, 'metta snp1.8:10.5 colophon has translation === null');
  ok(METTA_RECORDS.filter(r => r.translation === null).length === 1, 'exactly one null translation across metta');
  // reconstruction still holds on the null-translation record
  ok(reconstruct(colophon) === colophon.pali, 'colophon still reconstructs despite null translation');

  // ---- 6. verbatim translation spot-checks (byte-exact incl. spacing) -----
  ok(METTA_RECORDS.find(r => r.ref === 'snp1.8:0.1').translation.text === 'Anthology of Discourses 1.8 ',
    'metta snp1.8:0.1 translation verbatim (trailing space preserved)');
  ok(HEART_RECORDS.find(r => r.ref === 'hrdaya:0').translation.text === 'Adoration to the Omniscient!',
    'heart hrdaya:0 translation verbatim (Müller SBE 49)');
  ok(MN118_RECORDS.find(r => r.ref === 'mn118:0.1').translation.text === 'Middle Discourses 118',
    'mn118:0.1 translation verbatim (Sujato)');
  // Sujato folds 9 segments into neighbours → their translation.text === "" (preserved, not nulled)
  ok(MN118_RECORDS.filter(r => r.translation && r.translation.text === '').length === 9,
    'mn118: 9 folded segments keep an empty-string translation (not null)');

  // ---- 7. contract shape + licence tags ----------------------------------
  let shapeBad = 0, srcBad = 0, licBad = 0;
  for (const t of BUDDHIST_TEXTS) {
    // per-text layer licences
    for (const v of Object.values(t.licence)) if (!LICENCE_TAGS.has(v)) licBad++;
    for (const rec of recordsFor(t.id)) {
      const surface = rec.pali ?? rec.sanskrit;
      if (typeof surface !== 'string' || !surface.length) shapeBad++;
      // words[] entries (absent on refrain-use)
      if (rec.words) for (const w of rec.words) {
        if (typeof w.w !== 'string' || typeof w.gloss !== 'string') shapeBad++;
        if (!(w.ped === null || typeof w.ped === 'string')) shapeBad++;
      }
      // translation stamp (source present whenever a translation exists)
      if (rec.translation !== null) {
        if (!rec.translation || typeof rec.translation.text !== 'string' || !rec.translation.source) srcBad++;
      }
      // mn118 records carry per-record licence tags
      if (rec.licence) for (const v of Object.values(rec.licence)) if (!LICENCE_TAGS.has(v)) licBad++;
    }
  }
  ok(shapeBad === 0, `contract shape holds on every record/word (${shapeBad} bad)`);
  ok(srcBad === 0, `every non-null translation carries a source stamp (${srcBad} bad)`);
  for (const rf of MN118_REFRAINS) for (const v of Object.values(rf.licence || {})) if (!LICENCE_TAGS.has(v)) licBad++;
  ok(licBad === 0, `every licence tag ∈ {cc0, pd-age, original} (${licBad} bad)`);

  // ---- 8. NFC hygiene / no Vedic accents ---------------------------------
  let nfcBad = 0, vedicBad = 0;
  for (const t of BUDDHIST_TEXTS) for (const rec of recordsFor(t.id)) {
    const surface = rec.pali ?? rec.sanskrit;
    if (!isNFC(surface)) nfcBad++;
    if (VEDIC.test(surface)) vedicBad++;
    if (rec.translation && !isNFC(rec.translation.text)) nfcBad++;
    if (rec.words) for (const w of rec.words) { if (!isNFC(w.w) || !isNFC(w.gloss)) nfcBad++; }
  }
  for (const rf of MN118_REFRAINS) for (const w of (rf.words || [])) if (!isNFC(w.w)) nfcBad++;
  ok(nfcBad === 0, `all strings NFC-normalized (${nfcBad} bad)`);
  ok(vedicBad === 0, `no Vedic-accent codepoints in any root string (${vedicBad} bad)`);

  // ---- 9. search (diacritic-folded) --------------------------------------
  ok(searchBuddhist('mindfulness').some(h => h.id === 'mn118'), "searchBuddhist('mindfulness') hits mn118");
  ok(searchBuddhist('anapanassati').some(h => h.id === 'mn118'), "folded 'anapanassati' matches ānāpānassati (mn118)");
  ok(searchBuddhist('love').some(h => h.id === 'metta'), "searchBuddhist('love') hits metta");
  ok(searchBuddhist('emptiness').some(h => h.id === 'heart'), "searchBuddhist('emptiness') hits heart");
  ok(searchBuddhist('').length === 0, 'empty query → []');

  // ---- 10. CONTESTED ledger (both positions, never resolved) -------------
  ok(Array.isArray(heart.contested) && heart.contested.length === 3, `heart carries 3 contested blocks (got ${heart.contested && heart.contested.length})`);
  ok(heart.contested.every(c => Array.isArray(c.positions) && c.positions.length >= 2), 'each heart contested block has ≥2 positions');
  ok(heart.contested.some(c => c.id === 'heart-origins' && /Nattier/.test(JSON.stringify(c.positions))), 'heart-origins block cites Nattier');
  ok(metta.contested.length === 0 && mn.contested.length === 0, 'metta/mn118 keep cruxes in record notes (no structured blocks)');

  // ---- 11. citation ------------------------------------------------------
  ok(typeof BUDDHIST_CITATION === 'string' && /Sujato/.test(BUDDHIST_CITATION) && /Müller/.test(BUDDHIST_CITATION), 'BUDDHIST_CITATION names the sources');

  return { pass: failures.length === 0, failures };
}

// This builder owns no pages; the pages/buddhist/* reading rooms are driven by
// the wing builder's Chromium test module.
export const DRIVES = [];

export default { run, DRIVES };
