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

  // ---- 9 · the live panel's two load-bearing assumptions -----------------
  // The panel derives each hour's END from the next hour's START, because
  // hoursTable rows carry {hour, night, start, ruler} and NO `end`. That cost a
  // render to discover; it is pinned here so a shape change fails in Node
  // rather than as an empty panel in a browser.
  {
    const { hoursTable } = await import('../../assets/js/core/planetary-hours.js');
    const t = hoursTable(new Date('2026-08-01T18:00:00Z'), 40.71, -74.01);
    ok(Boolean(t && Array.isArray(t.rows)), 'hoursTable must return { rows: [...] }');
    if (t && Array.isArray(t.rows)) {
      ok(t.rows.length === 24, `hoursTable must return 24 hours, got ${t.rows.length}`);
      const r = t.rows[0];
      ok(r && 'start' in r && 'ruler' in r && 'night' in r,
        'an hour row must carry start/ruler/night — the panel reads all three');
      ok(!(r && 'end' in r),
        'hoursTable rows now carry an `end`: the panel derives it from the NEXT row\'s start and '
        + 'should be simplified to use the real field instead of shadowing it');
      ok(Boolean(t.nextRise), 'hoursTable must return nextRise — the last hour ends there');
    }
  }

  // materiaForRuler is what the live panel binds an hour's ruler to. It must
  // resolve for all seven, or the panel silently renders no assignment.
  {
    const { materiaForRuler } = await import('../../assets/js/core/incense.js');
    for (const p of ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']) {
      const m = materiaForRuler(p);
      ok(Boolean(m && m.substance), `materiaForRuler("${p}") must resolve to a substance`);
      if (m && m.harmFlag) {
        ok(typeof m.harmNote === 'string' && m.harmNote.length > 20,
          `materiaForRuler("${p}") is harm-flagged and must carry its note into the live panel`);
      }
    }
    ok(materiaForRuler('Nonesuch') === null, 'materiaForRuler must return null for an unknown ruler');
  }

  // The horā suite runs inside this one so a single registration covers both
  // and a Vedic failure cannot be silently unregistered.
  const v = await runVedicHora();
  for (const f of v.failures) failures.push('[vedic-hora] ' + f);

  return { pass: failures.length === 0, failures };
}

const txtLen = s => (typeof s === 'string' ? s.trim().length : 0);

// ---------------------------------------------------------------------------
//  The Vedic horā — a SEPARATE run() so a failure names the tradition it broke.
//
//  The load-bearing assertion is the CONVERGENCE. This site claims the horā and
//  the Western planetary hour are the same arithmetic, and it claims it because
//  al-Bīrūnī states it of the Indian system — not because two tables look alike.
//  If the two engines ever disagree, either the claim is wrong or one engine
//  drifted, and both are the kind of thing that must fail in Node rather than be
//  discovered by a reader.
// ---------------------------------------------------------------------------
export async function runVedicHora() {
  const failures = [];
  const ok = (c, m) => { if (!c) failures.push(m); };
  const { vedicHora, horaTable, HORA_ORDER } = await import('../../assets/js/core/vedic-hora.js');
  const { planetaryHour } = await import('../../assets/js/core/planetary-hours.js');

  ok(HORA_ORDER.join(',') === 'Saturn,Jupiter,Mars,Sun,Venus,Mercury,Moon',
    'the descending graha order must match the sources; got ' + HORA_ORDER.join(','));

  for (const [iso, lat, lon] of [
    ['2026-08-01T18:00:00Z', 40.71, -74.01],
    ['2026-01-15T03:00:00Z', 28.61, 77.21],
    ['2026-05-05T11:30:00Z', -33.87, 151.21],
  ]) {
    const d = new Date(iso);
    const h = vedicHora(d, lat, lon);
    ok(Boolean(h), `vedicHora returned null at ${iso} ${lat},${lon}`);
    if (!h) continue;
    const w = planetaryHour(d, lat, lon);
    ok(Boolean(w) && w.ruler === h.graha,
      `CONVERGENCE BROKEN at ${iso}: planetary hour says ${w && w.ruler}, horā says ${h.graha}. `
      + 'The site asserts these are the same arithmetic on al-Bīrūnī\'s authority; if they disagree '
      + 'the claim is wrong or an engine has drifted.');
    ok(h.indexInHalf === null || (h.indexInHalf >= 1 && h.indexInHalf <= 12),
      `horā index ${h.indexInHalf} is outside 1..12 at ${iso} ${lat},${lon}`);
    ok(h.materia === null && typeof h.materiaNote === 'string',
      'the horā must carry materia null WITH a note — silence would read as "no such tradition"');
    ok(h.tier === 'A' && typeof h.source === 'string' && h.source.length > 40,
      'the horā must ship its Tier A citation');
    const t = horaTable(d, lat, lon);
    ok(Boolean(t) && t.rows.length === 24, 'horaTable must return 24 horās');
    if (t) {
      ok(t.rows[0].graha === t.dayLord,
        `the first horā must be the day lord: got ${t.rows[0].graha}, day of ${t.dayLord}`);
      for (let i = 1; i < t.rows.length; i += 1) {
        ok(+t.rows[i].start === +t.rows[i - 1].end,
          `horā ${i + 1} does not begin where horā ${i} ends — the day must tile exactly`);
      }
    }
  }

  // Polar: undefined, not merely unavailable.
  ok(vedicHora(new Date('2026-06-21T12:00:00Z'), 78, 15) === null,
    'above the arctic circle in June the seasonal division is UNDEFINED and must return null '
    + 'rather than silently falling back to clock hours');

  return { pass: failures.length === 0, failures };
}
