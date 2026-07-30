// ============================================================================
//  scripts/tests/r33-vedic-ai.mjs — R33 (B1, the AI layer) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs, plus a
//  `DRIVES` array of Chromium-sweep descriptors for browser-verify.mjs.
//
//  Covers the NEW 'vedic' assistant kind — the AI layer for the site's full
//  Jyotiṣa reading (pages/vedic/index.html):
//    • assets/js/core/llm-context.js — buildVedicContext / buildVedicInterpretPrompt
//      / vedicDataBlock (the codebook trio, mirroring the vedicyogas trio);
//    • assets/js/app/divination-assistant.js — 'vedic' registered in ALL FOUR
//      maps (CTX / PROMPT / DATABLOCK / SUBJECT), SUBJECT === 'sidereal reading'.
//
//  THE FRAMING LAW this file enforces (the mission is EXPLANATION, not prophecy):
//    1. compare-never-merge with the Western chart;
//    2. the ayanāṁśa is a CHOICE (Lahiri is a default, not the true zodiac);
//    3. described never prescribed — the refusals (remedies, medical/legal/
//       financial/marital, lifespan/death, muhūrta for a real decision,
//       "what will happen") are in the codebook;
//    4. cite-the-rule with the canonical editions named;
//    5. contested stays contested;
//    6. no demonstrated validity, said ONCE.
//  Plus a BANNED-REGISTER grep proving the assistant is never itself written in
//  prescriptive/predictive voice (imperative/predictive CONSTRUCTIONS are
//  banned — the codebook may legitimately DESCRIBE remedial doctrine).
//
//  Fully deterministic and offline: the reference reading is cast headlessly
//  with an explicit currentDate; NOTHING here requires an API key or a network
//  call (the gate runs with no key).
// ============================================================================
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { buildVedicContext, buildVedicInterpretPrompt, vedicDataBlock } from '../../assets/js/core/llm-context.js';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = p => readFileSync(resolve(REPO, p), 'utf8');

// --- the FIXED reference reading (no wall-clock anywhere) --------------------
const BIRTH = new Date('1990-05-15T12:00:00Z');
const NOW = new Date('2026-01-01T00:00:00Z');
const LAT = 51.5074, LON = -0.1278;

function referenceReport() {
  const chart = castChart(BIRTH, LAT, LON, 'whole');
  const v = castVedic(chart, { currentDate: NOW });
  return {
    v, chart,
    moment: { dateISO: BIRTH.toISOString(), offset: 0, lat: LAT, lon: LON, place: 'London, United Kingdom' },
    conclusions: v.conclusions,
  };
}

// The banned REGISTER: prescriptive / predictive CONSTRUCTIONS. The word
// "remedy" is deliberately NOT banned — describing the remedial doctrine is the
// assistant's job; instructing anyone to act on it is not.
const BANNED = [
  [/\byou will\b/i, '"you will" (predictive second person)'],
  [/\byou'll\b/i, '"you\'ll" (predictive second person)'],
  [/\byou should\b/i, '"you should" (prescriptive)'],
  [/\bwe recommend\b/i, '"we recommend" (prescriptive)'],
  [/\bi recommend\b/i, '"I recommend" (prescriptive)'],
  [/\bwear a\b/i, '"wear a" (remedy instruction)'],
  [/\bis destined\b/i, '"is destined" (fatalistic)'],
  [/\bguarantee(d|s)?\b/i, '"guaranteed" (certainty claim)'],
  [/\bwill definitely\b/i, '"will definitely" (certainty claim)'],
];

// Mojibake: the classic UTF-8-read-as-latin1 signatures. Built from escapes so
// this file can scan ITSELF without matching its own pattern literal.
const MB_LEAD = String.fromCharCode(0xc3, 0xc2, 0xe2);              // the A-tilde / A-circumflex / a-circumflex leads
const MB_CONT = String.fromCharCode(0x80) + '-' + String.fromCharCode(0xbf);  // the continuation-byte range
const MOJIBAKE = new RegExp(`[${MB_LEAD}][${MB_CONT}]|${String.fromCharCode(0xfffd)}`);

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ========================================================================
  //  1. divination-assistant.js — 'vedic' in ALL FOUR maps
  // ========================================================================
  const da = src('assets/js/app/divination-assistant.js');
  // the three builders must be imported by name
  for (const n of ['buildVedicContext', 'buildVedicInterpretPrompt', 'vedicDataBlock']) {
    ok(new RegExp(`\\b${n}\\b`).test(da.slice(0, da.indexOf("from '../core/llm-context.js'"))),
      `divination-assistant imports ${n} from core/llm-context.js`);
  }
  // pull each map literal out by name, then look for a BARE `vedic:` key inside
  // it (never matching vedicyogas: / vedicdelineation:).
  const mapBody = name => {
    const i = da.indexOf(`const ${name} = {`);
    if (i < 0) return null;
    const j = da.indexOf('};', i);
    return j < 0 ? null : da.slice(i, j);
  };
  const bareVedic = /(?:^|[{,\s])vedic:\s*([A-Za-z0-9_'\- ]+)/m;
  const MAPS = [
    ['CTX', 'buildVedicContext'],
    ['PROMPT', 'buildVedicInterpretPrompt'],
    ['DATABLOCK', 'vedicDataBlock'],
    ['SUBJECT', "'sidereal reading'"],
  ];
  for (const [name, expect] of MAPS) {
    const body = mapBody(name);
    ok(!!body, `divination-assistant has a ${name} map`);
    if (!body) continue;
    const m = body.match(bareVedic);
    ok(!!m, `${name} map registers the bare 'vedic' kind (not only vedicyogas/vedicdelineation)`);
    if (m) ok(m[1].trim() === expect.trim(), `${name}.vedic === ${expect} (got "${m && m[1].trim()}")`);
  }
  // SUBJECT is load-bearing for the panel copy ("Cast the sidereal reading…")
  const subjBody = mapBody('SUBJECT') || '';
  ok(/vedic:\s*'sidereal reading'/.test(subjBody), "SUBJECT.vedic === 'sidereal reading'");

  // ========================================================================
  //  2. the three builders exist and produce non-empty strings
  // ========================================================================
  ok(typeof buildVedicContext === 'function', 'buildVedicContext is exported as a function');
  ok(typeof buildVedicInterpretPrompt === 'function', 'buildVedicInterpretPrompt is exported as a function');
  ok(typeof vedicDataBlock === 'function', 'vedicDataBlock is exported as a function');

  let report = null, ctx = null, prompt = '', block = '';
  try { report = referenceReport(); } catch (e) { failures.push(`the reference reading could not be cast headlessly: ${e && e.message}`); }
  if (!report) return { pass: false, failures };

  try { ctx = buildVedicContext(report); } catch (e) { failures.push(`buildVedicContext threw: ${e && e.message}`); }
  try { prompt = buildVedicInterpretPrompt(); } catch (e) { failures.push(`buildVedicInterpretPrompt threw: ${e && e.message}`); }
  try { block = vedicDataBlock(report); } catch (e) { failures.push(`vedicDataBlock threw: ${e && e.message}`); }
  if (!ctx) return { pass: false, failures };

  const system = ctx.system || '';
  ok(typeof system === 'string' && system.length > 3000, `buildVedicContext returns a substantial system string (got ${system.length} chars)`);
  ok(Array.isArray(ctx.facts) && ctx.facts.length >= 25, `the context carries a full fact table (got ${Array.isArray(ctx.facts) ? ctx.facts.length : 'none'})`);
  ok(Array.isArray(ctx.glossary) && ctx.glossary.length >= 10, `the context carries the Jyotiṣa glossary (got ${Array.isArray(ctx.glossary) ? ctx.glossary.length : 'none'})`);
  ok(ctx.facts.every(f => f && typeof f.text === 'string' && f.text.length), 'every fact has text');
  ok(ctx.facts.filter(f => f.cite).length >= ctx.facts.length - 2, 'essentially every fact carries a citation');
  ok(typeof prompt === 'string' && prompt.length > 1500, `buildVedicInterpretPrompt returns a substantial prompt (got ${prompt.length} chars)`);
  ok(typeof block === 'string' && block.length > 800, `vedicDataBlock returns a substantial JSON block (got ${block.length} chars)`);

  // an empty / null report must degrade, never throw
  try {
    const empty = buildVedicContext(null);
    ok(typeof empty.system === 'string' && empty.system.length > 1000, 'buildVedicContext(null) still returns the codebook (honest degradation)');
    ok(Array.isArray(empty.facts) && empty.facts.length === 0, 'buildVedicContext(null) carries no facts');
    ok(vedicDataBlock(null) === '', 'vedicDataBlock(null) returns the empty string');
    ok(vedicDataBlock({}) === '', 'vedicDataBlock({}) returns the empty string');
  } catch (e) { failures.push(`the builders threw on an empty report: ${e && e.message}`); }

  // ========================================================================
  //  3. THE FRAMING LAW — each invariant must be stated IN the codebook
  // ========================================================================
  // (1) compare, never merge
  ok(/COMPARE, NEVER MERGE/.test(system), 'the codebook states the COMPARE, NEVER MERGE rule');
  ok(/SECOND, INDEPENDENT/.test(system), 'the codebook names this a SECOND, INDEPENDENT system');
  ok(/never (?:merged|to merge|merge)/i.test(system), 'the codebook forbids merging the two systems');
  ok(/never average them/i.test(system), 'the codebook forbids averaging the two readings');
  // (2) the ayanāṁśa is a choice
  ok(/AYANĀṀŚA IS A CHOICE/.test(system), 'the codebook states that the ayanāṁśa is a CHOICE, not a fact');
  ok(/Lahiri/.test(system) && /Fagan–Bradley/.test(system) && /Rāman/.test(system) && /Krishnamurti|K\.P\./.test(system),
    'the codebook names the competing ayanāṁśas (Lahiri, Fagan–Bradley, Rāman, K.P.)');
  ok(/never present the sidereal frame as objectively correct/i.test(system), 'the codebook forbids presenting the sidereal frame as objectively correct');
  // (6) no demonstrated validity, said once
  ok(/no demonstrated predictive validity/i.test(system), 'the codebook states the no-demonstrated-validity line');
  ok(/do NOT repeat it in every paragraph/i.test(system), 'the codebook says the honest frame is stated ONCE, not repeated');
  // (4) cite the rule
  ok(/CITE THE RULE/.test(system), 'the codebook states the CITE THE RULE contract');
  for (const ed of ['Bṛhat Parāśara Horā Śāstra', 'Santhanam', 'Phaladīpikā', 'Sārāvalī', 'Laghu Parāśarī']) {
    ok(system.includes(ed), `the cite contract names the canonical edition/text "${ed}"`);
  }
  ok(/do not settle this|SAY SO/i.test(system), 'the cite contract tells the model to say so when no rule can be cited');
  // (5) contested stays contested
  ok(/CONTESTED STAYS CONTESTED/.test(system), 'the codebook states CONTESTED STAYS CONTESTED');
  for (const c of ['Nīca-bhaṅga', 'Kendrādhipati doṣa', 'Gaja-Kesarī', 'Combustion', 'Varga conventions']) {
    ok(system.includes(c), `the contested ledger names "${c}"`);
  }
  ok(/resolve NONE/i.test(system), 'the contested ledger says to resolve NONE of the positions');
  // (3) the refusals
  ok(/WHAT THIS ASSISTANT DOES NOT DO/.test(system), 'the codebook carries the refusals section');
  for (const [re, label] of [
    [/gemstone/i, 'gemstone remedies'],
    [/bīja mantra/i, 'mantra remedies'],
    [/MEDICAL, LEGAL, FINANCIAL OR MARITAL/i, 'medical/legal/financial/marital advice'],
    [/māraka/i, 'the māraka lifespan doctrine'],
    [/Never time a death/i, 'no death-timing'],
    [/MUHŪRTA FOR A REAL DECISION/i, 'no muhūrta for a real decision'],
    [/WHAT IS GOING TO HAPPEN/i, 'no telling the user what will happen'],
  ]) ok(re.test(system), `the refusals cover ${label}`);
  ok(/DESCRIBES that logic and does not prescribe it/i.test(system), 'the remedy refusal DESCRIBES the doctrine rather than banning the topic');
  ok(/no lectures|No lectures/i.test(system) || /Refuse briefly, in voice/.test(system), 'the refusals are written as short in-voice redirections, not a legal notice');

  // ========================================================================
  //  4. THE UNITS-AND-THRESHOLDS KEY (the numbers made meaningful)
  // ========================================================================
  ok(/UNITS & THRESHOLDS/.test(system), 'the codebook carries the units-and-thresholds key');
  ok(/rūpa/i.test(system), 'the units key names the rūpa');
  ok(/One rūpa = 60 virūpas/.test(system), 'the units key gives 1 rūpa = 60 virūpas');
  ok(/BPHS ch\. 27|BPHS 27\.48–49|Ch\.27/.test(system), 'the units key cites BPHS ch. 27 for the Ṣaḍbala minimums');
  ok(/Mercury 7/.test(system) && /Saturn 5/.test(system), 'the units key gives the per-graha required minimums');
  ok(/bindu/i.test(system), 'the units key names the bindu');
  ok(/0–8/.test(system), 'the units key gives the 0–8 per-sign BAV range');
  ok(/337/.test(system), 'the units key gives the 337 SAV checksum');
  ok(/about 28|≈28|~28/.test(system), 'the units key gives the ~28 per-sign SAV mean');
  ok(/120-year/.test(system), 'the units key gives the 120-year Vimśottarī cycle');
  ok(/BALANCE AT BIRTH/.test(system), 'the units key explains the balance at birth');
  ok(/13°20′/.test(system), 'the units key gives the 13°20′ nakṣatra arc');
  ok(/Exalted, Mūlatrikoṇa, Own sign, Neutral, Debilitated/.test(system), 'the units key gives the dignity ladder');
  ok(/sidereal longitude = tropical longitude − ayanāṁśa/i.test(system), 'the units key gives the ayanāṁśa subtraction');
  ok(/50″ a year|precession/.test(system), 'the units key explains the ayanāṁśa growing by precession');

  // ========================================================================
  //  5. THE READING ORDER (canonical sequence, not free association)
  // ========================================================================
  ok(/THE READING ORDER/.test(system), 'the codebook carries the canonical reading order');
  const orderIdx = ['THE LAGNA AND ITS LORD', 'THE MOON AND ITS NAKṢATRA', 'THE PAÑCĀṄGA', 'THE GRAHAS BY BHĀVA',
    'THE YOGAS PRESENT', 'STRENGTH (ṢAḌBALA)', 'THE PROMISE CROSS-CHECKED IN THE VARGAS', 'THE TIMING LAYER', 'THE SAV']
    .map(s => system.indexOf(s));
  ok(orderIdx.every(i => i > 0), 'every step of the reading order is present');
  ok(orderIdx.every((n, i) => i === 0 || n > orderIdx[i - 1]), 'the reading order steps appear in the canonical sequence');
  ok(/free-associate/i.test(system), 'the reading order forbids free association');

  // ========================================================================
  //  6. THE FACTS — the real computed reading is in the context
  // ========================================================================
  const factText = ctx.facts.map(f => `${f.text} [${f.cite}]`).join('\n');
  ok(/THE LAGNA:/.test(factText), 'the facts state the Lagna');
  ok(/Ayanāṁśa: /.test(factText) && /Lahiri \(Citrāpakṣa\)/.test(factText), 'the facts state the ayanāṁśa VALUE and NAME');
  ok(new RegExp(String(report.v.ayanamsa)).test(factText), 'the facts carry the computed ayanāṁśa figure itself');
  ok(/THE MOON \(kāraka of the mind/.test(factText), 'the facts state the Moon and its nakṣatra');
  ok(/PAÑCĀṄGA \(the five limbs/.test(factText), 'the facts state the pañcāṅga');
  ok(/ṢAḌBALA \(six-fold strength, in rūpas/.test(factText), 'the facts state the Ṣaḍbala with its unit');
  ok(/rūpas against a required .* → ratio/.test(factText), 'each Ṣaḍbala row quotes total, required AND ratio');
  ok(/SARVĀṢṬAKAVARGA \(bindus/.test(factText), 'the facts state the SAV with its unit');
  ok(/SAV counted BY BHĀVA from the Lagna/.test(factText), 'the facts give the SAV read by bhāva');
  ok(/RUNNING PERIOD: /.test(factText) && /THE BALANCE AT BIRTH/.test(factText), 'the facts give the running daśā AND the balance at birth that produced it');
  ok(/NAVĀṀŚA \(D9\)/.test(factText), 'the facts give the D9 varga cross-check');
  ok(/AYANĀṀŚA-FRAGILE|No graha lies within 1\.5°/.test(factText), 'the facts flag (or clear) ayanāṁśa-fragile placements');
  ok(/CONCLUSION — /.test(factText), 'the facts carry the page’s computed conclusions');
  ok(/Declared engine simplifications|Engine notes & declared simplifications/.test(factText), 'the facts declare the engine’s own simplifications');
  ok(/YOGAS/.test(factText), 'the facts report the yogas checked');
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'])
    ok(new RegExp(`^${p} \\(`, 'm').test(factText), `the facts place ${p} by bhāva`);

  // a tight fact budget (the free-tier path) must still work and stay bounded
  try {
    const lean = buildVedicContext(report, { maxFacts: 14, maxGlossary: 4 });
    ok(lean.facts.length === 14, `a lean context honours maxFacts (got ${lean.facts.length})`);
    ok(lean.glossary.length === 4, `a lean context honours maxGlossary (got ${lean.glossary.length})`);
    ok(/COMPARE, NEVER MERGE/.test(lean.system), 'the codebook survives a lean fact budget intact');
    ok(lean.facts.every(f => Object.keys(f).join() === 'text,cite'), 'a trimmed fact keeps the plain {text, cite} shape');
  } catch (e) { failures.push(`the lean context threw: ${e && e.message}`); }

  // THE BUDGET SPINE (R33 verifier). groq — a FREE kind — is the site's DEFAULT
  // provider, so the shipped path sends maxFacts 14 (an ad-hoc question) or 22
  // (Interpret), and the free path sends NO JSON data block. The facts are pushed
  // in reading order, so a naive slice() dropped every number at the tail while
  // buildVedicInterpretPrompt() still commanded §7 Ṣaḍbala, §9 the timing layer and
  // §10 the Aṣṭakavarga — asking the model to explain figures it had never seen,
  // against a codebook whose one hard rule is "never invent a bindu or a rūpa".
  // Every budget the shipped panel can use must therefore carry the whole spine.
  for (const budget of [14, 22, 28, 45, 110]) {
    let lean = null;
    try { lean = buildVedicContext(report, { maxFacts: budget, maxGlossary: 4 }); }
    catch (e) { failures.push(`buildVedicContext threw at maxFacts=${budget}: ${e && e.message}`); continue; }
    const t = lean.facts.map(f => f.text).join('\n');
    for (const [label, re] of [
      ['the ayanāṁśa value', /Ayanāṁśa: /],
      ['the compare-never-merge frame', /SECOND, INDEPENDENT/],
      ['the Lagna', /THE LAGNA:/],
      ['the Moon & its nakṣatra', /THE MOON \(/],
      ['the Ṣaḍbala ranking (prompt §7)', /ṢAḌBALA \(six-fold/],
      ['the Ṣaḍbala total/required/ratio triples (prompt §7)', /Totals as rūpas\/required→ratio: .*→/],
      ['the D9 cross-check (prompt §8)', /NAVĀṀŚA \(D9\)/],
      ['the balance at birth (prompt §9)', /THE BALANCE AT BIRTH/],
      ['the running daśā (prompt §9)', /RUNNING PERIOD:/],
      ['the SAV bindus (prompt §10)', /SARVĀṢṬAKAVARGA/],
      ['the SAV by bhāva (prompt §10)', /SAV counted BY BHĀVA/],
      ['the yogas (prompt §6)', /YOGAS/],
    ]) ok(re.test(t), `at maxFacts=${budget} the context still carries ${label}`);
  }

  // ========================================================================
  //  7. THE INTERPRET PROMPT — the EXPLAIN task
  // ========================================================================
  ok(/EXPLANATION, NOT PROPHECY/.test(prompt), 'the interpret prompt declares the mission as explanation, not prophecy');
  ok(/canonical order|THE WALK/.test(prompt), 'the interpret prompt sets the canonical walk');
  ok(/unit and its threshold/i.test(prompt), 'the interpret prompt demands unit + threshold for every number');
  ok(/name the classical rule/i.test(prompt), 'the interpret prompt demands the rule behind each line');
  ok(/resolving NONE/i.test(prompt), 'the interpret prompt demands every contested point be left unresolved');
  ok(/does NOT claim/.test(prompt), 'the interpret prompt ends with what the reading does NOT claim');
  ok(/never merged/i.test(prompt), 'the interpret prompt restates compare-never-merge');
  ok(/ayanāṁśa is a/i.test(prompt) && /CHOICE/.test(prompt), 'the interpret prompt restates the ayanāṁśa-is-a-choice line');
  ok(/rūpa/.test(prompt) && /bindu/.test(prompt) && /BALANCE AT BIRTH/.test(prompt), 'the interpret prompt names the three units it must explain');
  ok(/In plain words/.test(prompt), 'the interpret prompt carries the shared PLAIN_CODA');

  // ========================================================================
  //  8. THE BANNED REGISTER — the assistant is never written in prescriptive
  //     or predictive voice. (The word "remedy" is NOT banned: describing the
  //     remedial doctrine is the job.)
  // ========================================================================
  for (const [re, label] of BANNED) {
    const hitC = system.match(re), hitP = prompt.match(re);
    ok(!hitC, `the context is free of the banned construction ${label}${hitC ? ` (found "${hitC[0]}")` : ''}`);
    ok(!hitP, `the interpret prompt is free of the banned construction ${label}${hitP ? ` (found "${hitP[0]}")` : ''}`);
  }
  // the positive control: the register test would actually catch a violation
  ok(BANNED.some(([re]) => re.test('you will find great wealth')), 'the banned-register patterns actually match a prescriptive/predictive sentence');
  // and "remedy"/"remedial" IS allowed — the doctrine is described
  ok(/remedial/i.test(system), 'the codebook is still free to DESCRIBE the remedial doctrine (the word is not banned)');

  // ========================================================================
  //  9. vedicDataBlock — deterministic, complete, reusing slimVedic
  // ========================================================================
  const b1 = vedicDataBlock(report), b2 = vedicDataBlock(referenceReport());
  ok(b1 === b2, 'vedicDataBlock is deterministic across two independent casts of the same fixed moment');
  ok(b1 === vedicDataBlock(report), 'vedicDataBlock is deterministic across two calls on the same report');
  const jsonStart = b1.indexOf('{');
  let dig = null;
  try { dig = JSON.parse(b1.slice(jsonStart)); } catch (e) { failures.push(`the data block is not valid JSON: ${e && e.message}`); }
  if (dig) {
    // the slimVedic spine (NOT a second flattener)
    for (const k of ['system', 'ayanamsa', 'lagna', 'grahas', 'panchanga', 'dasha', 'yogas', 'sarvashtakavarga', 'shadbala'])
      ok(k in dig, `the data block carries the slimVedic key "${k}"`);
    ok(/sidereal/.test(dig.system), 'the data block declares itself the sidereal system');
    ok(typeof dig.lagna === 'string' && /lord/.test(dig.lagna), 'the data block carries the lagna with its lord');
    ok(dig.ayanamsaName === report.v.ayanamsaName, 'the data block carries the ayanāṁśa NAME');
    ok(dig.ayanamsa === report.v.ayanamsa, 'the data block carries the ayanāṁśa VALUE');
    ok(/CHOICE/.test(dig.ayanamsaNote || ''), 'the data block restates that the ayanāṁśa is a choice');
    ok(dig.moment && dig.moment.dateISO === BIRTH.toISOString(), 'the data block carries the moment');
    ok(dig.moment && dig.moment.place === 'London, United Kingdom', 'the data block carries the place');
    ok(dig.dasha && dig.dasha.maha === report.v.vimshottari.currentMaha, 'the data block carries the RUNNING mahādaśā');
    ok(dig.dasha && dig.dasha.balanceYears === report.v.vimshottari.balanceYears, 'the data block carries the balance at birth');
    ok(dig.dashaBirth && dig.dashaBirth.moonNakshatra === report.v.vimshottari.nakshatra.name, 'the data block carries the birth Moon nakṣatra behind the daśā');
    ok(/120-year/.test(dig.dashaUnits || ''), 'the data block carries the daśā unit key');
    ok(dig.shadbala && dig.shadbala.rupas && Object.keys(dig.shadbala.rupas).length === 7, 'the data block carries seven ṣaḍbala rūpa figures');
    ok(dig.shadbalaDetail && Object.values(dig.shadbalaDetail).every(s => 'required' in s && 'ratio' in s && 'clearsItsBar' in s),
      'every ṣaḍbala row carries its required minimum, ratio and pass/fail');
    ok(/rūpa/.test(dig.shadbalaUnits || ''), 'the data block carries the ṣaḍbala unit key');
    ok(Array.isArray(dig.sarvashtakavarga.bySign) && dig.sarvashtakavarga.bySign.length === 12, 'the data block carries the 12 SAV sign totals');
    ok(dig.sarvashtakavarga.total === 337, 'the SAV total in the data block is the 337 checksum');
    ok(/337/.test(dig.ashtakavargaUnits || ''), 'the data block carries the aṣṭakavarga unit key');
    ok(dig.savByBhavaFromLagna && Object.keys(dig.savByBhavaFromLagna).length === 12, 'the data block carries the SAV by bhāva');
    ok(dig.grahas && Object.keys(dig.grahas).length === 9, 'the data block carries all nine grahas');
    ok(Object.values(dig.grahas).every(g => g.bhava && g.nakshatra && g.dignity), 'every graha carries bhāva, nakṣatra and dignity');
    ok(dig.panchanga && dig.panchanga.tithi && dig.panchanga.vara, 'the data block carries the pañcāṅga');
    ok(dig.vargaD9 && dig.vargaD9.lagna, 'the data block carries the D9 varga');
    ok(Array.isArray(dig.yogasChecked) && dig.yogasChecked.length >= 4, 'the data block carries the yogas checked (present and absent)');
    ok(Array.isArray(dig.conclusions) && dig.conclusions.length >= 5, 'the data block carries the computed conclusions');
    ok(/never merge/i.test(dig.contract || ''), 'the data block restates compare-never-merge');
    ok(/never prescribed|Described, never prescribed/i.test(dig.contract || ''), 'the data block restates described-never-prescribed');
    ok(/conflate/i.test(dig.note || ''), 'the slimVedic note against conflating the two zodiacs survives');
  }

  // ========================================================================
  //  10. slimVedic is REUSED, not duplicated
  // ========================================================================
  const lc = src('assets/js/core/llm-context.js');
  const slimDefs = (lc.match(/(?:function|const)\s+slimVedic\b/g) || []).length;
  ok(slimDefs === 1, `slimVedic is defined exactly ONCE and shared (found ${slimDefs} definitions)`);
  ok(/function slimVedic\(v\)/.test(lc), 'slimVedic is hoisted to module scope so both the tool layer and vedicDataBlock use it');
  ok(/const base = slimVedic\(v\)/.test(lc), 'vedicDataBlock reuses slimVedic rather than writing a second flattener');
  // the pre-existing trio must be undisturbed
  for (const n of ['buildVedicYogasContext', 'buildVedicYogasInterpretPrompt', 'vedicYogasDataBlock',
    'buildVedicDelineationContext', 'buildVedicDelineationInterpretPrompt', 'vedicDelineationDataBlock'])
    ok(new RegExp(`export function ${n}\\b`).test(lc), `the pre-existing export ${n} is undisturbed`);
  for (const n of ['buildVedicContext', 'buildVedicInterpretPrompt', 'vedicDataBlock'])
    ok(new RegExp(`export function ${n}\\b`).test(lc), `${n} is exported from core/llm-context.js`);
  // the new core block: DOM-free, wall-clock-free, randomness-free
  const vedicBlock = lc.slice(lc.indexOf('const VEDIC_FRAME'), lc.indexOf('//  x = currentMuhurtaReport()'));
  ok(vedicBlock.length > 5000, 'the new vedic block was located in core/llm-context.js');
  ok(!/\bdocument\b|\bwindow\b|requestAnimationFrame|localStorage/.test(vedicBlock), 'the new core code is DOM-free');
  ok(!/Date\.now\(|Math\.random\(|new Date\(\)/.test(vedicBlock), 'the new builders use no wall-clock and no randomness');
  ok(!/\bfetch\(|XMLHttpRequest/.test(vedicBlock), 'the new core code makes no network call (the gate runs offline, keyless)');

  // ========================================================================
  //  11. no mojibake anywhere in the shipped strings or the touched sources
  // ========================================================================
  for (const [label, text] of [['the context', system], ['the interpret prompt', prompt], ['the data block', b1],
    ['core/llm-context.js', lc], ['app/divination-assistant.js', da], ['this test', src('scripts/tests/r33-vedic-ai.mjs')]]) {
    const hit = text.match(MOJIBAKE);
    ok(!hit, `${label} is free of mojibake${hit ? ` (found "${hit[0]}")` : ''}`);
  }
  // the diacritics that MUST be intact (a mojibake canary)
  for (const s of ['ayanāṁśa', 'Ṣaḍbala', 'Aṣṭakavarga', 'Vimśottarī', 'nakṣatra', 'bhāva', 'Lagna'])
    ok(system.includes(s) || system.includes(s.toUpperCase()), `the diacritics of "${s}" are intact in the context`);

  return { pass: failures.length === 0, failures };
}

// ---------------------------------------------------------------------------
//  DRIVES — the Chromium sweep descriptors (browser-verify.mjs). Everything
//  here is exercisable with NO API key: the panel mounts, previews the grounded
//  facts, and copies the prompt without ever firing a request.
// ---------------------------------------------------------------------------
export const DRIVES = [
  {
    page: 'pages/vedic/index.html',
    actions: ['load (the page casts on init)', 'open the "Ask the Jyotiṣī" panel', 'expand “What the model is told (the grounded facts)”',
      'recast with a different date/place', 'press Interpret with NO key'],
    asserts: [
      '#dv-assistant mounts under the reading and renders the provider/model/key fieldset',
      'the grounded-facts preview lists numbered [F#] facts including the Lagna, the ayanāṁśa value + name, the running daśā and the Ṣaḍbala rūpas',
      'recasting the chart refreshes the preview in place (subscribeReading fires)',
      'with no API key, Interpret degrades honestly — the status line asks for a key and NO network request fires',
      'the panel’s empty-state reads “Cast the sidereal chart above first.” before a cast',
      'no console error / pageerror / failed request',
    ],
  },
];

export default { run, DRIVES };
