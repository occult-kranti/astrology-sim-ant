// ============================================================================
//  scripts/tests/incense.mjs — the incense materia index.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs.
//  Deterministic; no DOM, no network.
//
//  WHAT THIS DEFENDS. The materia data is the site's most safety-sensitive
//  table, and the invariants are not stylistic:
//
//   1. THE OPERABLE TRIPLE (FRAMING §5, C-1). A harm-flagged material may carry
//      at most two of {substance · quantity · process parameter}. The three
//      live in three typed fields so the third has nowhere to sit. If a future
//      edit fills quantity AND processParam on a harm-flagged row, that is the
//      triple assembled, and this test is what stops it shipping.
//   2. A HARM-FLAGGED ROW NEVER TRAVELS WITHOUT ITS NOTE.
//   3. NO COMPOSITE IS EXPANDED. The 31-spice and 28-component compounds are
//      one material each. Expanding them would invent 59 ingredients this site
//      cannot cite.
//   4. THE LOOK-ALIKE MATERIALS STAY APART. "aloes wood" and "aloes" must not
//      merge into one token — a false convergence is the worst error a
//      comparison view can make, and it is one careless normalisation away.
//   5. TOKENS ARE READ FROM THE RECORDED STRING. Every token's planet must
//      actually have that substance string, so the hand-authored tokenisation
//      cannot drift from planetary-magic.js unnoticed.
// ============================================================================

import { PLANETARY_MAGIC } from '../../assets/js/core/data/planetary-magic.js';
import { MATERIA_TOKENS, MATERIA, AMBIGUITIES } from '../../assets/js/core/data/incense-materia.js';
import { byPlanet, byMaterial, convergences, census, openQuestions } from '../../assets/js/core/incense.js';

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  const planets = byPlanet();
  const mats = byMaterial();

  // ---- 1 · the operable triple ------------------------------------------
  for (const r of planets) {
    if (!r.harmFlag) continue;
    const m = r.materia || {};
    const hasQ = m.quantity != null && m.quantity !== '';
    const hasP = m.processParam != null && m.processParam !== '';
    ok(!(hasQ && hasP),
      `${r.planet} is harm-flagged and carries BOTH quantity and processParam — that is the operable `
      + 'triple assembled (FRAMING §5, C-1). One of them must be null.');
    ok(m.normalised === false,
      `${r.planet}.suffumigationMateria.normalised must be the literal false — archaic measures are `
      + 'never converted, because a converted number would be a fabricated number carrying this '
      + "site's authority on exactly the substances where a wrong number is dangerous.");
  }

  // ---- 2 · harm note travels with the harm flag --------------------------
  for (const r of planets) {
    if (!r.harmFlag) continue;
    ok(typeof r.harmNote === 'string' && r.harmNote.trim().length > 20,
      `${r.planet} is harm-flagged but carries no usable harmNote; a harm-flagged material may never `
      + 'be rendered without it.');
  }
  for (const m of mats) {
    if (!m.harm) continue;
    ok(typeof m.harmRef === 'string' && m.harmRef.length > 0,
      `material "${m.id}" is harm-flagged but names no harmRef back to the typed record`);
  }

  // ---- 3 · composites are not expanded -----------------------------------
  const composites = mats.filter(m => m.kind === 'composite');
  ok(composites.length >= 2, 'expected at least the 31-spice and 28-component compounds as composites');
  for (const c of composites) {
    ok(typeof c.componentCount === 'number' && c.componentCount > 1,
      `composite "${c.id}" must state how many components it stands for`);
    ok(c.planets.length >= 1, `composite "${c.id}" is indexed against no planet`);
  }
  const notCarried = census().componentsNotCarried;
  ok(notCarried.n === composites.reduce((s, c) => s + c.componentCount, 0),
    'componentsNotCarried must equal the sum of composite component counts');
  ok(/does NOT enumerate/i.test(notCarried.unit),
    'the componentsNotCarried unit must say plainly that the site does not enumerate them');

  // ---- 4 · the look-alikes stay apart ------------------------------------
  const ids = new Set(mats.map(m => m.id));
  ok(ids.has('aloeswood') && ids.has('aloes-resin'),
    'aloeswood and aloes-resin must both exist as SEPARATE tokens — merging them would report a '
    + 'Mars-Venus convergence that no source states');
  const aloesRows = mats.filter(m => m.ambiguity === 'aloes-pair');
  ok(aloesRows.length === 2, 'both aloes tokens must carry the aloes-pair ambiguity');
  for (const r of aloesRows) {
    ok((r.ambiguities || []).length > 0,
      `${r.id} must surface its ambiguity record, so a renderer cannot show it without the reason`);
  }

  // ---- 5 · tokens are read from the recorded string ----------------------
  for (const [planet, tok] of Object.entries(MATERIA_TOKENS)) {
    const d = PLANETARY_MAGIC[planet];
    ok(Boolean(d), `MATERIA_TOKENS names planet "${planet}" which planetary-magic.js does not have`);
    if (!d) continue;
    const actual = (d.suffumigationMateria && d.suffumigationMateria.substance) || d.suffumigation;
    ok(tok.readFrom === actual,
      `${planet}: tokenisation was read from ${JSON.stringify(tok.readFrom)} but planetary-magic.js now `
      + `says ${JSON.stringify(actual)}. The hand-authored split has drifted from its source.`);
    for (const id of tok.tokens || []) {
      ok(Boolean(MATERIA[id]), `${planet} names token "${id}" which MATERIA does not define`);
    }
  }

  // ---- 6 · the convergence claim is honest -------------------------------
  const conv = convergences();
  for (const c of conv) {
    ok(c.planets.length > 1, `convergences() returned "${c.id}" with ${c.planets.length} planet(s)`);
  }
  ok(census().sharedAcrossPlanets.n === conv.length,
    'the census shared-material count must equal what convergences() returns');

  // ---- 7 · every count declares its unit (rule B13) -----------------------
  for (const [k, v] of Object.entries(census())) {
    ok(v && typeof v.n === 'number' && typeof v.unit === 'string' && v.unit.length > 2,
      `census().${k} must carry both a number and a stated unit — a count without its unit is how two `
      + 'correct measurements start an argument');
  }

  // ---- 8 · open questions are surfaced, not buried ------------------------
  const qs = openQuestions();
  ok(qs.length === Object.keys(AMBIGUITIES).length, 'openQuestions() must surface every ambiguity');
  for (const q of qs) {
    ok(txtLen(q.body) > 60 && txtLen(q.status) > 3,
      `ambiguity "${q.id}" needs a substantive body and a status`);
  }

  return { pass: failures.length === 0, failures };
}

const txtLen = s => (typeof s === 'string' ? s.trim().length : 0);
