// ============================================================================
//  og-framing.mjs — the framing blocker's regression pins + the ledger's asserts.
//  Exports `async run() -> {pass, failures[]}` and `DRIVES`, the repo contract.
//
//  It pins two things that are easy to get right once and lose quietly:
//
//  1. BLOCKER B1 (docs/FRAMING.md §3.1, §5 A-3, §9.14). `core/talisman.js` used
//     to generate a numbered IMPERATIVE protocol, personalised to the reader's
//     own time and place, naming a controlled substance, handed to the assistant
//     as a callable tool returning `steps` — on a site whose covenant is that its
//     own voice never instructs. These assertions are the fix's teeth: the mood
//     grep, the attributing-frame requirement, the operable-triple ceiling, and
//     the tool surface. Each one carries a POSITIVE CONTROL where a bare "does
//     not match" would otherwise pass on a regex that matches nothing.
//
//  2. THE LEDGER (PLAN.md §6, amendments C and E). That the stop condition is
//     COMPUTED — proven by feeding `stopConditions()` a synthetic history in
//     which C1 must trip, which no hard-coded sentence can pass — and that
//     rounds.jsonl parses and is append-only-shaped.
//
//  Determinism: every assertion here is a pure function of shipped modules and
//  one fixed chart. No network, no clock beyond a fixed Date, no DOM.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const rd = p => readFileSync(join(ROOT, p), 'utf8');

// ---------------------------------------------------------------------------
//  The lint vocabulary. FRAMING §3.2 V1 names `IMPERATIVE_OPENERS`; if a later
//  round gives it a single home in `core/quoted.js` this test consumes that one
//  instead of keeping a second copy, because two copies of a rule is how a rule
//  rots — a round tightens one and no test notices the other.
// ---------------------------------------------------------------------------
const LOCAL_IMPERATIVE_OPENERS = [
  'Choose', 'Elect', 'Set', 'Prepare', 'Name', 'Engrave', 'Inscribe', 'Carve',
  'Consecrate', 'Kindle', 'Light', 'Burn', 'Speak', 'Recite', 'Chant', 'Pray',
  'Perform', 'Cast', 'Take', 'Use', 'Add', 'Mix', 'Grind', 'Boil', 'Heat',
  'Pour', 'Apply', 'Rub', 'Cut', 'Pierce', 'Draw', 'Wear', 'Place', 'Put',
  'Bury', 'Bind', 'Hold', 'Breathe', 'Inhale', 'Exhale', 'Sit', 'Stand',
  'Face', 'Call', 'Invoke', 'Summon', 'Offer', 'Fast', 'Repeat', 'Begin',
  'Wait', 'Avoid', 'Write', 'Do',
];

async function imperativeOpeners() {
  try {
    const m = await import('../../assets/js/core/quoted.js');
    if (Array.isArray(m.IMPERATIVE_OPENERS) && m.IMPERATIVE_OPENERS.length) return m.IMPERATIVE_OPENERS;
  } catch { /* not shipped yet — use the local list */ }
  return LOCAL_IMPERATIVE_OPENERS;
}

const openerRe = list => new RegExp(`^\\s*(?:${list.join('|')})\\b`, 'i');
// Sentence-initial, anywhere in the string: the audit's own example ("Consecrate
// at the elected hour: …") sat mid-object, not at index 0, so a start-anchored
// test alone would have missed the sentence that caused the blocker.
const midSentenceOpenerRe = list => new RegExp(`(?:^|[.;:]\\s+|\\n)(?:${list.join('|')})\\b`, '');

const SECOND_PERSON = /\b(you|your|yours|yourself)\b/i;
// C-1: no modernised unit may appear in a harm-flagged record's site voice.
// "hour"/"hours" is the planetary hour, a position in the sky, not a duration —
// only the measured-duration words are banned.
const MODERN_UNITS = /(\b\d+\s*(?:g|mg|kg|ml|l)\b)|(°\s?[CF]\b)|(\b\d+\s*(?:minutes?|seconds?|grams?|millilitres?|milliliters?)\b)/i;

// Every attested entry must open with a frame that says WHO instructs WHOM.
const ATTRIBUTING_FRAME = /^(Picatrix|Agrippa|Lilly|In Picatrix|In Agrippa|The tradition|The text|The texts|The sources|The materials recorded|According to)\b/;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };
  const OPENERS = await imperativeOpeners();
  const startsImperative = openerRe(OPENERS);
  const hasImperativeSentence = midSentenceOpenerRe(OPENERS);

  // ==========================================================================
  //  PART 1 — BLOCKER B1: the talisman generator's voice
  // ==========================================================================
  const { castChart } = await import('../../assets/js/core/astro.js');
  const { talismanRecipe, allRecipes, ATTESTED_VOICE_NOTE } = await import('../../assets/js/core/talisman.js');
  const { OPERATIONS } = await import('../../assets/js/core/election.js');
  const { PLANETARY_MAGIC, harmNoteFor, isOperableTriple } = await import('../../assets/js/core/data/planetary-magic.js');

  const FIXED = new Date(Date.UTC(2024, 2, 20, 3, 6));
  const chart = castChart(FIXED, 51.5074, -0.1278, 'regiomontanus');
  const recipes = allRecipes(chart);

  ok(recipes.length === OPERATIONS.length, `allRecipes covers every operation (${recipes.length} vs ${OPERATIONS.length})`);

  // --- 1a. The key `steps` is gone from the engine and from the tool surface.
  for (const r of recipes) {
    ok(r.steps === undefined, `B1: talismanRecipe("${r.operationKey}") still exposes a \`steps\` key`);
    ok(Array.isArray(r.attestedSequence) && r.attestedSequence.length >= 6,
      `B1: talismanRecipe("${r.operationKey}") has no attestedSequence of >= 6 entries`);
    for (const k of ['procedure', 'instructions', 'recipe', 'protocol'])
      ok(r[k] === undefined, `B1: talismanRecipe("${r.operationKey}") exposes a forbidden key "${k}"`);
  }

  // --- 1b. Mood: no site-voice string in the output is in the imperative.
  //     Checked over EVERY string the recipe carries, at every operation, so a
  //     re-voiced first entry cannot hide an imperative in the eighth.
  const siteVoiceStrings = (r) => {
    const out = [];
    for (const s of r.attestedSequence) { out.push(s.text); if (s.harmNote) out.push(s.harmNote); }
    out.push(r.design, r.voice, r.disclaimer);
    for (const n of r.harmNotes || []) out.push(n);
    const mt = r.materials && r.materials.suffumigationMateria;
    if (mt && mt.withheldReason) out.push(mt.withheldReason);
    return out.filter(x => typeof x === 'string');
  };
  for (const r of recipes) {
    for (const s of siteVoiceStrings(r)) {
      ok(!startsImperative.test(s), `B1 mood: a site-voice string opens in the imperative — "${s.slice(0, 90)}…"`);
      ok(!hasImperativeSentence.test(s), `B1 mood: a site-voice sentence opens in the imperative — "${s.slice(0, 120)}…"`);
      ok(!SECOND_PERSON.test(s), `B1 person: a site-voice string addresses the reader in the second person — "${s.slice(0, 90)}…"`);
    }
  }

  // --- 1c. Positive control for 1b. Without this, a typo in the regex list
  //     turns the whole mood grep into a test of nothing that always passes.
  const CONTROL_IMPERATIVE = "Consecrate at the elected hour: kindle Saturn's suffumigation (opium, etc.) and speak the petition over your engraving WHILE the smoke rises.";
  ok(startsImperative.test(CONTROL_IMPERATIVE), 'positive control: the mood grep fails to match the exact sentence that caused blocker B1');
  ok(hasImperativeSentence.test('The tradition records this. Kindle the suffumigation.'), 'positive control: the mid-sentence imperative grep matches nothing');
  ok(SECOND_PERSON.test(CONTROL_IMPERATIVE), 'positive control: the second-person grep matches nothing');

  // --- 1d. Every attested entry names who instructed whom.
  for (const r of recipes) {
    for (const s of r.attestedSequence) {
      ok(typeof s.attributedTo === 'string' && s.attributedTo.length > 0,
        `B1: an attestedSequence entry of "${r.operationKey}" carries no attributedTo`);
      ok(typeof s.cite === 'string' && s.cite.length > 0,
        `B1: an attestedSequence entry of "${r.operationKey}" carries no citation`);
      ok(ATTRIBUTING_FRAME.test(s.text),
        `B1: an attestedSequence entry does not open with an attributing frame — "${s.text.slice(0, 80)}…"`);
    }
  }

  // --- 1e. The exact strings the hostile audit quoted must be gone from the
  //     shipped module. A named regression, not a general one.
  // Comments are stripped first, deliberately: the module's header RECORDS the
  // imperative sentences it replaced, because a fix that erases the evidence of
  // what was wrong cannot be reviewed. The ban is on shipped strings, not on the
  // repo's memory of its own defect.
  const stripComments = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const talismanSrc = stripComments(rd('assets/js/core/talisman.js'));
  const bannedLiterals = [
    'Choose the aim:', 'Elect the time:', 'Set the Moon well:', 'Prepare the materials:',
    'Name the powers', 'Consecrate at the elected hour', 'speak the petition over',
  ];
  for (const lit of bannedLiterals)
    ok(!talismanSrc.includes(lit), `B1 regression: core/talisman.js still contains the imperative literal "${lit}"`);
  ok(!/\bsteps\s*[,:]/.test(talismanSrc),
    'B1 regression: core/talisman.js still declares or returns a `steps` field outside comments');
  ok(typeof ATTESTED_VOICE_NOTE === 'string' && /never directs the reader/i.test(ATTESTED_VOICE_NOTE),
    'B1: ATTESTED_VOICE_NOTE is missing or no longer states the rule it exists to state');

  // --- 1f. C-1, the operable triple — enforced where the data lives.
  for (const [planet, m] of Object.entries(PLANETARY_MAGIC)) {
    ok(m.suffumigationMateria, `C-1: ${planet} carries no typed suffumigationMateria record`);
    if (!m.suffumigationMateria) continue;
    ok(!isOperableTriple(m.suffumigationMateria),
      `C-1: ${planet}'s materia carries all three of {substance, quantity, processParam} in site voice`);
    ok(m.suffumigationMateria.normalised === false,
      `C-1: ${planet}'s materia is missing the required literal normalised:false`);
    ok(typeof m.suffumigationMateria.withheldReason === 'string' && m.suffumigationMateria.withheldReason.length > 20,
      `C-1: ${planet}'s materia withholds a field without stating why`);
    ok(typeof m.harmFlag === 'boolean', `C-1: ${planet} carries no harmFlag`);
    if (m.harmFlag) {
      ok(typeof m.harmNote === 'string' && m.harmNote.length > 80,
        `C-1: ${planet} is harm-flagged but carries no substantive harm note`);
      // The four-part shape's first requirement: state the MECHANISM, not "be careful".
      ok(/depress|toxic|poison|pathogen|kills|infect|absorb/i.test(m.harmNote || ''),
        `C-1: ${planet}'s harm note does not state a mechanism`);
      ok(!MODERN_UNITS.test(m.harmNote || ''),
        `C-1: ${planet}'s harm note normalises a measure into modern units`);
    } else {
      ok(m.harmNote === null, `C-1: ${planet} is not harm-flagged but carries a harm note anyway`);
    }
  }
  ok(harmNoteFor('Saturn') && /opium/i.test(harmNoteFor('Saturn')),
    'C-1: harmNoteFor("Saturn") no longer names the flagged material');
  ok(harmNoteFor('Venus') === null, 'C-1: harmNoteFor returns a note for an unflagged planet');
  ok(isOperableTriple({ substance: 'x', quantity: '1', processParam: 'hot' }),
    'positive control: isOperableTriple fails to detect an actual triple');

  // --- 1g. The harm note travels IN THE SAME OBJECT as the material (A-5).
  const saturnRecipe = talismanRecipe(chart, 'binding');
  ok(saturnRecipe.planet === 'Saturn', 'fixture: the binding aim no longer rules to Saturn');
  ok(Array.isArray(saturnRecipe.harmNotes) && saturnRecipe.harmNotes.length === 1,
    'A-5: the Saturn recipe does not carry its harm note in the same object');
  const materialEntry = saturnRecipe.attestedSequence.find(s => /suffumigation of/i.test(s.text));
  ok(materialEntry && typeof materialEntry.harmNote === 'string' && materialEntry.text.includes(materialEntry.harmNote),
    'A-5: the entry naming the flagged material does not carry its harm note inside its own text');
  ok(saturnRecipe.materials.harmFlagged === true && saturnRecipe.materials.normalised === false,
    'C-1: the Saturn recipe materials object is missing harmFlagged / normalised:false');
  const venusRecipe = talismanRecipe(chart, 'love');
  ok(venusRecipe.harmNotes.length === 0 && venusRecipe.materials.harmFlagged === false,
    'C-1: an unflagged recipe reports a harm flag it does not have');
  for (const r of recipes) for (const s of siteVoiceStrings(r))
    ok(!MODERN_UNITS.test(s), `C-1/A-4: a site-voice string normalises a measure — "${s.slice(0, 90)}…"`);

  // --- 1h. Determinism: same chart in, byte-identical record out.
  ok(JSON.stringify(talismanRecipe(chart, 'love')) === JSON.stringify(talismanRecipe(chart, 'love')),
    'talismanRecipe is not deterministic for a fixed chart');

  // ==========================================================================
  //  PART 2 — the assistant surface: no executable steps for talismans
  // ==========================================================================
  const { runTool, buildOperationPrompt } = await import('../../assets/js/core/llm-context.js');
  const toolOut = runTool('talismanRecipe', { operationKey: 'binding' }, { chart });
  ok(toolOut.steps === undefined, 'A-3: runTool("talismanRecipe") still returns a `steps` key to the model');
  for (const k of ['procedure', 'instructions', 'recipe', 'protocol'])
    ok(toolOut[k] === undefined, `A-3: runTool("talismanRecipe") returns a forbidden key "${k}"`);
  ok(Array.isArray(toolOut.attestedSequence) && toolOut.attestedSequence.length >= 6,
    'A-3: runTool("talismanRecipe") returns no attestedSequence');
  for (const s of toolOut.attestedSequence) {
    ok(!startsImperative.test(s.text) && !hasImperativeSentence.test(s.text),
      `A-3: a model-facing entry is in the imperative — "${s.text.slice(0, 90)}…"`);
    ok(!SECOND_PERSON.test(s.text), `A-3: a model-facing entry addresses the reader — "${s.text.slice(0, 90)}…"`);
    ok(typeof s.attributedTo === 'string' && s.attributedTo.length > 0, 'A-3: a model-facing entry is unattributed');
  }
  ok(Array.isArray(toolOut.harmNotes) && toolOut.harmNotes.length === 1,
    'A-3: the flagged material reaches the model without its harm note in the same object');
  // The whole tool payload, serialised, must survive the mood grep — the model
  // is handed the object, not the fields we happened to iterate.
  const toolBlob = JSON.stringify(toolOut);
  ok(!/"steps"/.test(toolBlob), 'A-3: the serialised tool payload contains a "steps" key');

  // The operation prompt no longer commands a procedure (FRAMING §9.11, pin F5).
  const { fullReading } = await import('../../assets/js/core/reading.js');
  const reading = fullReading(chart, { operationKey: 'love' });
  const prompt = buildOperationPrompt(reading, 'how did the tradition make a talisman for concord?');
  ok(!/A practitioner asks/.test(prompt), 'F5: buildOperationPrompt still addresses "a practitioner"');
  ok(!/THE HISTORICAL PROCEDURE the tradition would follow/.test(prompt),
    'F5: buildOperationPrompt still commands "THE HISTORICAL PROCEDURE the tradition would follow"');
  ok(/never a recommendation to act/.test(prompt), 'F5: buildOperationPrompt dropped the honest caveat');
  ok(/not a set of instructions/i.test(prompt), 'F5: buildOperationPrompt does not say the answer is not instructions');
  ok(/in the third person and attributed/i.test(prompt), 'F5: buildOperationPrompt does not require third-person attribution');
  ok(/Do not restate any of it as a step for the reader/i.test(prompt), 'F5: buildOperationPrompt does not forbid restating as steps');

  // ==========================================================================
  //  PART 3 — the ledger: the stop condition is COMPUTED, not hard-coded
  // ==========================================================================
  const ledger = await import('../round-ledger.mjs');
  const telemetry = await import('../round-telemetry.mjs');

  const mkRound = (id, domain, tooling, extra = {}) => ({
    round: id, date: '2026-01-01', gates: {}, gates_verified: false,
    claims: { domain_claims_survived: domain, tooling_only: tooling, verified: false }, ...extra,
  });

  // C1 must TRIP on a history where it should, and the printed sentence must
  // carry that history's own round ids and its own tooling sum. A hard-coded
  // string cannot pass both of the next two blocks.
  const drift = ledger.stopConditions([mkRound('A', 5, 1), mkRound('B', 0, 4), mkRound('C', 0, 5), mkRound('D', 0, 2)]);
  ok(drift.c1.tripped === true, 'amendment C: C1 did not trip on a 3-round window of 0 domain / 11 tooling');
  ok(drift.exit === 3, `amendment C: C1 tripped but the exit code is ${drift.exit}, not 3`);
  const c1line = drift.lines.find(l => l.startsWith('STOP-CONDITION C1 TRIPPED'));
  ok(!!c1line, 'amendment C: C1 tripped without printing the stop instruction');
  ok(c1line && /rounds B–D/.test(c1line), 'amendment C: the C1 sentence does not name the window it was computed over');
  ok(c1line && /11 tooling items/.test(c1line), 'amendment C: the C1 sentence does not carry the computed tooling sum');
  ok(c1line && /MUST be domain-only/.test(c1line), 'amendment C: the C1 sentence does not print the stop instruction');

  const drift2 = ledger.stopConditions([mkRound('A', 0, 1), mkRound('B', 0, 2), mkRound('C', 0, 3)]);
  const c1line2 = drift2.lines.find(l => l.startsWith('STOP-CONDITION C1 TRIPPED'));
  ok(c1line2 && /rounds A–C/.test(c1line2) && /6 tooling items/.test(c1line2),
    'amendment C: the C1 sentence is the same for two different histories — it is hard-coded, not computed');

  // C1 must NOT trip where domain survived, and must NOT trip on silence.
  const healthy = ledger.stopConditions([mkRound('A', 0, 3), mkRound('B', 1, 9), mkRound('C', 0, 4)]);
  ok(healthy.c1.tripped === false && healthy.exit === 0, 'amendment C: C1 tripped on a window containing a domain claim');
  ok(healthy.c2.tripped === true && healthy.lines.some(l => l.startsWith('WARN C2')),
    'amendment C: C2 did not warn at a trailing-3 ratio of 0.06');
  const silent = ledger.stopConditions([mkRound('A', 3, 3), { round: 'B', date: '2026-01-01', claims: { domain_claims_survived: null, tooling_only: null, verified: false } }]);
  ok(silent.c1.evaluable === false && silent.exit === 0,
    'amendment C: a round with no claim counts was scored as zero domain — absence of data is not evidence of zero');
  ok(silent.lines.some(l => /excluded from every window/.test(l)),
    'amendment C: unscorable rounds are dropped without saying so');

  // C3 may never pass by default.
  ok(healthy.c3.evaluable === false && healthy.lines.some(l => l.startsWith('C3 NOT EVALUABLE')),
    'amendment C: C3 reported a verdict without the census it needs');

  // ==========================================================================
  //  PART 4 — rounds.jsonl parses and is append-only-shaped
  // ==========================================================================
  const jsonlRel = 'docs/telemetry/rounds.jsonl';
  ok(existsSync(join(ROOT, jsonlRel)), `${jsonlRel} does not exist — run node scripts/round-telemetry.mjs seed`);
  if (existsSync(join(ROOT, jsonlRel))) {
    const raw = rd(jsonlRel);
    ok(raw.endsWith('\n'), 'rounds.jsonl does not end in a newline — the next append would glue two objects onto one line');
    const lines = raw.split('\n').filter(l => l.trim());
    let rows = [];
    try { rows = lines.map(l => JSON.parse(l)); }
    catch (e) { ok(false, `rounds.jsonl does not parse line-by-line: ${e.message}`); }
    ok(rows.length === lines.length && rows.length > 0, 'rounds.jsonl is empty or a line failed to parse');
    for (const [i, r] of rows.entries()) {
      ok(r && typeof r === 'object' && !Array.isArray(r), `rounds.jsonl line ${i + 1} is not a single JSON object`);
      ok(typeof r.round === 'string' && /^R\d+[a-z]?$/.test(r.round), `rounds.jsonl line ${i + 1} has no well-formed round id`);
      ok(/^\d{4}-\d{2}-\d{2}$/.test(r.date || ''), `rounds.jsonl line ${i + 1} has no ISO date`);
      ok(r.claims && typeof r.claims === 'object', `rounds.jsonl line ${i + 1} carries no claims block`);
      ok('domain_claims_survived' in r.claims && 'tooling_only' in r.claims,
        `rounds.jsonl line ${i + 1} is missing one of the two columns`);
      ok(r.claims.verified === false || r.claims.verified === true,
        `rounds.jsonl line ${i + 1} does not declare whether its claim counts are verified (amendment E)`);
    }
    // Amendment E is load-bearing: every seeded row must SAY it is unverified.
    const seeded = rows.filter(r => ['R28', 'R29', 'R30', 'R31', 'R32', 'R33', 'R33r'].includes(r.round));
    ok(seeded.length >= 7, `the historical seed is incomplete (${seeded.length} of 7 rounds)`);
    for (const r of seeded)
      ok(r.claims.verified === false && r.gates_verified === false,
        `amendment E: seeded round ${r.round} claims to be verified, but nothing in this round re-derived it`);
    // The reader (used by the ledger) must agree with a naive line-by-line parse.
    ok(telemetry.readRounds().length === rows.length, 'readRounds() and a naive line parse disagree about rounds.jsonl');
    ok(telemetry.latestPerRound(rows).length <= rows.length, 'latestPerRound() invented rows');
  }

  // ==========================================================================
  //  PART 5 — ROUND-LEDGER.md is generated from the JSONL, and says so
  // ==========================================================================
  const ledgerRel = 'docs/ROUND-LEDGER.md';
  ok(existsSync(join(ROOT, ledgerRel)), `${ledgerRel} does not exist — run node scripts/round-ledger.mjs`);
  if (existsSync(join(ROOT, ledgerRel))) {
    const md = rd(ledgerRel);
    ok(/GENERATED FILE\. Do not hand-edit\./.test(md), 'ROUND-LEDGER.md does not declare itself generated');
    ok(/domain_claims_survived/.test(md) && /tooling_only/.test(md), 'ROUND-LEDGER.md is missing one of the two columns');
    ok(/The tie goes against us/.test(md), 'ROUND-LEDGER.md dropped the tie-breaking rule that keeps it honest');
    ok(/\(unverified\)/.test(md), 'ROUND-LEDGER.md carries no (unverified) marks — amendment E is not being applied');
    ok(/C1 — instrument drift/.test(md) && /C2 — thinning/.test(md) && /C3 — rubber-stamp gate/.test(md),
      'ROUND-LEDGER.md does not carry all three stop conditions');
    ok(/This run computed:/.test(md), 'ROUND-LEDGER.md does not print what the stop condition actually computed');
    // Generated means generated: the table must match a fresh render of the file.
    const all = telemetry.readRounds();
    const rows = telemetry.latestPerRound(all);
    const fresh = ledger.renderLedger(rows, ledger.stopConditions(rows), { superseded: all.length - rows.length });
    const strip = t => t.split('\n').filter(l => !l.startsWith('Generated ')).join('\n');
    ok(strip(fresh) === strip(md), 'ROUND-LEDGER.md is stale or hand-edited — it does not match a fresh render of rounds.jsonl');
  }

  return { pass: failures.length === 0, failures };
}

// browser-verify's structured drive vocabulary. This module is headless by
// nature — every assertion is over pure modules and two tracked text files — so
// it documents rather than drives, on the shipped prose-descriptor precedent.
export const DRIVES = [
  'PROSE: core/talisman.js emits `attestedSequence`, not `steps`; every entry is third-person, opens with an attributing frame, and names its citation.',
  'PROSE: pages/picatrix/talisman.html §2 renders that sequence under the heading "What the sources record, in order", preceded by the voice note.',
  'PROSE: a Saturn (binding) recipe renders the opium harm note inside the same list entry that names the material, never adjacent to it.',
  'PROSE: docs/ROUND-LEDGER.md is regenerated by scripts/round-ledger.mjs and its C1 line is arithmetic over docs/telemetry/rounds.jsonl.',
];
