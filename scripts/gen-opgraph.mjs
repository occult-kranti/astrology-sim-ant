#!/usr/bin/env node
// ============================================================================
//  scripts/gen-opgraph.mjs — THE GRAPH REFRESH ARTERY.
//
//  TRACKED. DEPENDENCY-FREE. IDEMPOTENT. DETERMINISTIC.
//  No Date, no Math.random, no network, no hard-coded path separator, no
//  absolute scratchpad path. The same inputs give the same bytes on any machine.
//
//  WHY THIS FILE EXISTS AT ALL. Every other generated data module in this repo
//  points at an UNTRACKED, SESSION-SCOPED generator that no longer exists:
//    confluence.js            -> scratchpad/r28build/gen-data.mjs
//    practices/mudras.js      -> scratchpad/r31build/gen-practices-data.mjs
//    bhava-phala.js           -> scratchpad/r31build/...
//    yoga-rules.js            -> scratchpad/r31build/...
//    greatworks-east.js       -> scratchpad/r32build/gen-greatworks-east.mjs
//  `git ls-files` contains none of them. The flagship 190-node / 155-edge atlas
//  dataset CANNOT be reproduced from anything in the repo. That is a severed
//  artery, and the wound is committed. This round does not repeat it.
//
//  INPUTS (all tracked):
//    research/opgraph/gate.json            the curation gate — the graph's conscience
//    research/opgraph/gate-decisions.json  the hand-authored judgements behind it
//    research/opgraph/vocab.json           53 controlled procedure-type terms
//    research/opgraph/vocab-map.json       total typeAsFiled -> typeTerm map
//    research/opgraph/slices/1{0..4}-*.json  the five audited research slices
//
//  OUTPUT:
//    assets/js/core/data/opgraph.js        GENERATED — never hand-edited
//
//  MODES:
//    node scripts/gen-opgraph.mjs           rebuild on disk + print the diff
//    node scripts/gen-opgraph.mjs --check   rebuild to memory; exit 1 on drift
//
//  AMENDMENT B — THE GENERATOR STRIPS AT WRITE TIME.
//  gate.json is read FIRST. Excluded and ejected ids are never written to disk
//  at all. The engine-test scan for ejected ids in shipped data is the BACKSTOP,
//  not the mechanism: a struck record cannot reach the runtime module even if a
//  test is skipped or a test file is deleted.
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const R = (...p) => join(ROOT, ...p);

export const OUT_PATH = R('assets', 'js', 'core', 'data', 'opgraph.js');
export const ROUND_ID = 'R33';
export const ADMISSION_FLOOR = 0.40;
export const RUBRIC_VERSION = 1;

export const SLICE_FILES = [
  '10-indian-tantra', '11-greco-egyptian', '12-solomonic-western',
  '13-east-asian', '14-abrahamic-esoteric',
];

// Fields whose values LOOK like source keys ("S1".."S6") but are not.
// Slice 12 uses S1..S6 as the labels of its six-stage Solomonic anatomy.
const SOURCE_KEY_BLOCKLIST = { '12-solomonic-western': new Set(['anatomyStages']) };

const GRADES = ['complete', 'partial', 'referenced', 'fragmentary', 'unstable-plural'];
const INCOMPLETE_GRADES = new Set(['partial', 'referenced', 'fragmentary']);
const BASES = ['slot-inventory', 'comparative-recension', 'self-contained-table',
  'editorial-statement', 'genre-norm', 'arithmetic-verification'];
const INCOMPLETENESS_KINDS = ['constitutive', 'damaged', 'gated', 'truncated'];
const PD_VERDICTS = ['us-pd', 'in-copyright', 'open-access-in-copyright', 'unresolved'];
const CLAIM_RELATIONS = ['TRANSMITS_TO', 'PARALLELS', 'COMMENTS_ON', 'FOUND_WITH',
  'RECORDS_TEACHING_OF', 'NON_EDGE', 'RECONSTRUCTED_THROUGH'];
const EDGE_KINDS = ['CONTAINS', 'OF_TYPE', 'REL_FROM', 'REL_TO',
  'BELONGS_TO', 'AUTHORED_BY', 'HAS_PART', 'SEGMENT_OF'];
const NODE_TYPES = ['work', 'author', 'culture', 'procedure-type',
  'procedure-claim', 'relation-claim'];

// The five modules whose generators evaporated. Blocker B12: a NAMED deferral.
// Verified against each module's own header this round. NOTE TWO CORRECTIONS to the
// list as PLAN §4.1 states it: bhava-phala.js and yoga-rules.js name r28build
// generators of their own (gen-bhava-phala.mjs, gen-yoga-rules.mjs), not the r31
// practices generator; and greatworks-east.js names its generator WITHOUT the
// 'scratchpad/' prefix, which is why a naive grep for that word under-reports the
// debt by one module. The debt is worse-documented than the plan assumed, not smaller.
export const ORPHANED_MODULES = [
  { module: 'assets/js/core/data/confluence.js', generator: 'scratchpad/r28build/gen-data.mjs', round: 'R28' },
  { module: 'assets/js/core/data/practices/mudras.js', generator: 'scratchpad/r31build/gen-practices-data.mjs', round: 'R31' },
  { module: 'assets/js/core/data/bhava-phala.js', generator: 'scratchpad/r28build/gen-bhava-phala.mjs', round: 'R28' },
  { module: 'assets/js/core/data/yoga-rules.js', generator: 'scratchpad/r28build/gen-yoga-rules.mjs', round: 'R28' },
  { module: 'assets/js/core/data/greatworks-east.js', generator: 'r32build/gen-greatworks-east.mjs', round: 'R32' },
];

// ---------------------------------------------------------------------------
// small pure helpers
// ---------------------------------------------------------------------------
const nfc = s => (typeof s === 'string' ? s.normalize('NFC') : s);
const readJSON = p => JSON.parse(readFileSync(p, 'utf8'));
const clean = s => (s == null ? null : String(s).normalize('NFC').replace(/\s+/g, ' ').trim() || null);
const uniq = a => [...new Set(a)];
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const by = (...keys) => (x, y) => { for (const k of keys) { const c = cmp(k(x), k(y)); if (c) return c; } return 0; };
const round2 = n => Math.round(n * 100) / 100;

/** id-safe slug: lowercase, ':' and any non [a-z0-9-] collapse to '-'. */
export const slugify = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** W1's endpoint hygiene rule, as a predicate. */
export const idIsClean = id => typeof id === 'string' && id.length > 0
  && !/[\\/#\s]/.test(id) && !/\.js/.test(id);

// ---------------------------------------------------------------------------
// 1 · READ THE TRACKED INPUTS
// ---------------------------------------------------------------------------
export function readInputs({ withGate = true } = {}) {
  const dir = R('research', 'opgraph');
  const slices = {};
  for (const name of SLICE_FILES) slices[name] = readJSON(join(dir, 'slices', `${name}.json`));
  const gatePath = join(dir, 'gate.json');
  return {
    dir,
    slices,
    priorArt: readJSON(join(dir, '01-repo-closed-corpus.json')),
    vocab: readJSON(join(dir, 'vocab.json')),
    vocabMap: readJSON(join(dir, 'vocab-map.json')),
    decisions: readJSON(join(dir, 'gate-decisions.json')),
    gate: withGate && existsSync(gatePath) ? readJSON(gatePath) : null,
  };
}

// ---------------------------------------------------------------------------
// 2 · WITNESSES — how a citation becomes a countable, tiered witness
// ---------------------------------------------------------------------------
/**
 * Slices 10-12 cite by source key ("S12, S13"). Slices 13-14 cite in prose
 * ("Pregadio, Great Clarity (2006)"). Both must resolve to a DECLARED source
 * with a DECLARED tier, or they are not witnesses at all.
 *
 * The prose resolver uses ANCHOR TOKENS that are UNIQUE within one slice's own
 * source list. A token shared by two sources is discarded rather than guessed —
 * an ambiguous citation resolves to nothing, which lowers the weight. The bias
 * is deliberately toward under-counting: a weight argued upward by a regex is
 * exactly the failure the rubric exists to prevent.
 */
const ANCHOR_STOP = new Set(['The', 'This', 'That', 'From', 'With', 'And', 'For', 'Its', 'Not',
  'Vol', 'Bd', 'Press', 'University', 'Univ', 'Studies', 'Study', 'Text', 'Texts', 'Trans',
  'Edition', 'Editions', 'Series', 'Book', 'Books', 'Journal', 'Repo', 'Note', 'Also', 'New',
  'Magical', 'Magic', 'Ritual', 'Chinese', 'English', 'German', 'Greek', 'Latin', 'Arabic',
  'Jewish', 'Islamic', 'Daoist', 'Buddhist', 'Sanskrit', 'Hebrew', 'Papyri', 'Papyrus',
  'CITE', 'ONLY', 'PUBLIC', 'DOMAIN', 'OPEN', 'ACCESS', 'AUDIT', 'CORRECTED']);

export function sourceTable(sliceName, slice, decisions) {
  const raw = slice.meta.sources;
  const entries = Array.isArray(raw)
    ? raw.map((s, i) => [typeof s === 'object' && s ? (s.key || s.id || `S${i + 1}`) : `S${i + 1}`, s])
    : Object.entries(raw);
  const tiers = decisions.sourceTiers[sliceName] || {};
  const sources = entries.map(([key, s]) => {
    const cite = clean(typeof s === 'string' ? s : (s.cite || s.label || JSON.stringify(s))) || '';
    const tier = tiers[key];
    if (!tier) throw new Error(`gen-opgraph: ${sliceName} source ${key} has no declared tier in gate-decisions.json (sourceTiers)`);
    return { key, cite, tier, slice: sliceName };
  });
  // anchors: capitalised tokens (>=4 chars) unique across the slice's sources
  const seen = new Map();
  for (const s of sources) {
    for (const t of uniq(s.cite.slice(0, 160).match(/\b[A-Z][A-Za-z'’-]{3,}\b/g) || [])) {
      if (ANCHOR_STOP.has(t)) continue;
      seen.set(t, seen.has(t) ? ' AMBIGUOUS' : s.key);
    }
  }
  const anchors = new Map();
  for (const [tok, key] of seen) if (key !== ' AMBIGUOUS') anchors.set(tok, key);
  return { sources, byKey: new Map(sources.map(s => [s.key, s])), anchors };
}

/** Collect citation-ish text from a record, honouring the per-slice blocklist. */
function citeText(record, sliceName) {
  const block = SOURCE_KEY_BLOCKLIST[sliceName] || new Set();
  const out = [];
  const walk = (v, key) => {
    if (v == null) return;
    if (block.has(key)) return;
    if (typeof v === 'string') { out.push(v); return; }
    if (Array.isArray(v)) { v.forEach(x => walk(x, key)); return; }
    if (typeof v === 'object') { for (const [k, x] of Object.entries(v)) walk(x, k); }
  };
  walk(record, null);
  return out.join('  ').normalize('NFC');
}

export function witnessesFor(record, sliceName, table) {
  const text = citeText(record, sliceName);
  const keys = new Set();
  for (const m of text.match(/\bS\d{1,2}\b/g) || []) if (table.byKey.has(m)) keys.add(m);
  if (!keys.size) {
    for (const [tok, key] of table.anchors) if (text.includes(tok)) keys.add(key);
  }
  return [...keys].sort(by(k => Number(k.slice(1)))).map(k => {
    const s = table.byKey.get(k);
    return { key: k, slice: sliceName, cite: s.cite, tier: s.tier };
  });
}

// ---------------------------------------------------------------------------
// 3 · THE WEIGHT RUBRIC — computed, never argued into existence
// ---------------------------------------------------------------------------
/**
 * weight = witness x primaryFactor x contestFactor x flagFactor   (2dp)
 * admission floor 0.40.
 *
 * flagFactor is the plan's one addition to the frame's rubric and the most
 * important line in it: a flag only works if the next round HONOURS it rather
 * than laundering it through restatement. One secondary-scholarly witness,
 * uncontested, carrying "(unverified)" -> 0.5 x 0.85 x 1.0 x 0.7 = 0.30 ->
 * BELOW FLOOR -> excluded automatically. The blockers become arithmetic.
 */
// `allInherited` may be supplied explicitly by a caller that cannot see the
// per-witness flags. The anti-drift test is exactly that caller: it rebuilds a
// node's witness list from OPGRAPH_META.sources, and a SOURCE record carries no
// notion of inheritance — inheritance is a property of the claim's relation to
// the source, not of the source. Without this the test recomputes an uncapped
// weight and reports drift that is not there.
export function computeWeight({ witnesses = [], label = 'documented', contested = null, flags = [], allInherited: allInheritedIn } = {}) {
  const n = witnesses.length;
  const tiers = witnesses.map(w => w.tier);
  const witnessRaw = n === 0 ? 0.0
    : n === 1 ? 0.5
      : n === 2 ? 0.8
        : (tiers.includes('primary') ? 1.0 : 0.8);

  // ---- THE INHERITANCE CAP ------------------------------------------------
  // A procedure-claim with no citation of its own inherits its WORK's whole
  // witness list (see the fallback where claims are built). Before this cap
  // those inherited witnesses scored exactly like the claim's own evidence,
  // and the result inverted the rubric: 117 of 246 claims (47.6%) were
  // inherited, and they OUTRANKED claims carrying their own evidence — mean
  // 0.634 against 0.556, with 40 at weight >= 0.8. proc:baopuzi-3 reached
  // weight 1.00 while the very work it was extracted from sat at 0.60.
  //
  // The rubric's witness term asks "how many independent witnesses attest THIS
  // assertion". Inherited witnesses attest the WORK — that a book is well
  // attested is not evidence that one procedure inside it is. So a claim whose
  // witnesses are ALL inherited is treated as single-witness at best: it keeps
  // its provenance and its place in the graph, and it can no longer outscore a
  // claim that was actually cited.
  const allInherited = allInheritedIn !== undefined
    ? Boolean(allInheritedIn) && n > 0
    : (n > 0 && witnesses.every(w => w && w.inherited));
  const witness = allInherited ? Math.min(witnessRaw, 0.5) : witnessRaw;
  const primaryFactor = tiers.includes('tertiary') ? 0.6
    : tiers.includes('primary') ? 1.0
      : n ? 0.85 : 0.0;
  const contestFactor = label === 'debunked' ? 0.2
    : label === 'disputed' ? 0.5
      : (contested && Array.isArray(contested.positions) && contested.positions.length >= 2) ? 0.9
        : 1.0;
  const flagFactor = flags.includes('do-not-quote') ? 0.0
    : flags.includes('unverified') ? 0.7
      : 1.0;
  return {
    witness, primaryFactor, contestFactor, flagFactor,
    // Recorded so the gate's reason string can SAY the cap applied, rather than
    // leaving a reader to wonder why a four-witness claim scored like a one.
    witnessCappedByInheritance: allInherited && witnessRaw > 0.5 ? witnessRaw : undefined,
    weight: round2(witness * primaryFactor * contestFactor * flagFactor),
  };
}

const FLAG_UNVERIFIED = /\(unverified\)|\bunverified\b/i;
const FLAG_DNQ = /UNVERIFIED-DO-NOT-QUOTE/;
/**
 * THE FLAG IS A PROPERTY OF THE ASSERTION, NOT OF THE PAGE IT SITS ON.
 * `scope` names the fields that carry the record's own claim, so a slice's
 * META-LANGUAGE about its conventions ("figures not re-derived this round are
 * written '(unverified)'") is not read as a flag on every record in the file.
 * DO-NOT-QUOTE is scanned unscoped: it is a hard block, not a discount.
 */
function flagsOf(record, sliceName, scope) {
  const scoped = scope
    ? citeText(Object.fromEntries(scope.filter(k => record && record[k] !== undefined).map(k => [k, record[k]])), sliceName)
    : citeText(record, sliceName);
  const f = [];
  if (FLAG_DNQ.test(scoped)) f.push('do-not-quote');
  if (record && record.unverified) f.push('unverified');
  else if (FLAG_UNVERIFIED.test(scoped)) f.push('unverified');
  return uniq(f);
}
const CLAIM_FLAG_FIELDS = ['evidence', 'completenessEvidence', 'cite', 'citation', 'unverified', 'evidenceStrength'];
const RELATION_FLAG_FIELDS = ['cite', 'citation', 'claim', 'evidence', 'confidence', 'basis', 'strength', 'certainty', 'unverified'];
const WORK_FLAG_FIELDS = ['unverified', 'sourceQuality', 'confidence'];

// ---------------------------------------------------------------------------
// 4 · DERIVATIONS THAT MUST BE CONSERVATIVE
// ---------------------------------------------------------------------------
/**
 * completenessBasis is MANDATORY on every graded claim (audit recommendation 3)
 * and NO SLICE WROTE IT. It is therefore derived from the evidence prose by the
 * cue table below, and every derived value carries completenessBasisDerived:true
 * plus the cue that matched, so a reviewer can audit the derivation row by row.
 *
 * THE DEFAULT IS `genre-norm` — the WEAKEST basis, which renders hatched and is
 * excluded from every headline count on the page. Under-claiming is the safe
 * direction: "a grade whose basis field would have to read 'the book looks
 * finished' would never have been written."
 */
const BASIS_CUES = [
  ['arithmetic-verification', /magic (constant|square)|arithmetic|sums? to|magic-constant/i],
  ['comparative-recension', /recension|synoptic|collat|manuscript tradition|\bMSS\b|witnesses? (are |were )?compar|variant readings/i],
  ['editorial-statement', /the (editor|preface|introduction)|editor'?s? (own )?(statement|note|preface)|kept out of the treatment|the edition (states|says|prints|omits)|breaks off|avowedly|admits that/i],
  ['self-contained-table', /parameter table|second-order|table of|tabulat|no discrete rit|nineteen variables|closed enumerat/i],
  ['slot-inventory', /slot|enumerates and terminates|the text (names|lists|enumerates)|stage-kind|anatomy|inventory of|names the stages/i],
];
function deriveBasis(evidence) {
  const t = evidence || '';
  for (const [basis, re] of BASIS_CUES) if (re.test(t)) return { basis, cue: basis };
  return { basis: 'genre-norm', cue: 'default' };
}

/**
 * incompletenessKind is MANDATORY when the grade is not `complete`, and no
 * slice wrote it either. Same discipline. The DEFAULT is `constitutive` — the
 * text was never going to tell you — which is the honest default for this
 * corpus: slice 14 reports ZERO fragmentary rows in 23 works and shows that is
 * a substantive result, because the characteristic defect here is instability
 * and reticence, not damage. Do not merge `constitutive` and `damaged`.
 */
const KIND_CUES = [
  ['truncated', /breaks off|stops (short|at)|unfinished|only the first|never (completed|finished)|worked out .{0,40}only/i],
  ['damaged', /damag|lacuna|lost|torn|missing (leaves|folios|columns)|fragmentar|preservation|survives only (as|in) (quotation|fragment)/i],
  ['gated', /initiat|oral (transmission|instruction)|withheld|deliberately not|secret|lineage|from a teacher|silent|not published|encode/i],
];
function deriveIncompletenessKind(evidence) {
  const t = evidence || '';
  for (const [kind, re] of KIND_CUES) if (re.test(t)) return { kind, cue: kind };
  return { kind: 'constitutive', cue: 'default' };
}

/** pd verdict from the slice's own prose. `unresolved` is a legal answer. */
function pdVerdict(raw) {
  if (raw === true) return 'us-pd';
  if (raw === false) return 'in-copyright';
  const t = String(raw == null ? '' : raw);
  if (!t.trim()) return 'unresolved';
  if (/open[- ]access/i.test(t)) return 'open-access-in-copyright';
  if (/\bNOT\b.{0,40}(PD|public domain)|not yet PD|in copyright|cite[- ]only|copyright/i.test(t)) return 'in-copyright';
  if (/public domain|\bPD\b|US-PD/i.test(t)) return 'us-pd';
  return 'unresolved';
}

/** sortYear: null is legal and means "no date I trust" (the Kulārṇava). */
function sortYear(dateText) {
  const t = String(dateText || '');
  if (!t) return null;
  let m = t.match(/\bc?\.?\s?(\d{3,4})\s*[-–]\s*(\d{3,4})\s*(BCE|BC)\b/i);
  if (m) return -Math.round((Number(m[1]) + Number(m[2])) / 2);
  m = t.match(/\b(\d{3,4})\s*(BCE|BC)\b/i);
  if (m) return -Number(m[1]);
  m = t.match(/\b(\d{1,2})(?:st|nd|rd|th)\s*[-–]\s*(\d{1,2})(?:st|nd|rd|th)?\s*c\b/i);
  if (m) return (Number(m[1]) - 1) * 100 + 50;
  m = t.match(/\b(\d{1,2})(?:st|nd|rd|th)\s*c\b/i);
  if (m) return (Number(m[1]) - 1) * 100 + 50;
  m = t.match(/\b(1[0-9]{3}|[2-9][0-9]{2})\b/);
  if (m) return Number(m[1]);
  return null;
}

// ---------------------------------------------------------------------------
// 5 · BUILD THE CANDIDATE GRAPH (gate-independent)
// ---------------------------------------------------------------------------
/**
 * Produces EVERY candidate node and edge the slices support, with its witness
 * list and its computed weight — before the gate is consulted. The seeder writes
 * gate.json from this; the generator filters this by gate.json. One code path,
 * so the two files cannot describe different graphs.
 */
export function buildCandidates(inputs) {
  const { slices, vocab, vocabMap, decisions } = inputs;
  const diag = {
    warnings: [], editionsSynthesised: 0, contestedDropped: 0,
    basisDerived: 0, kindDerived: 0, harmNoteDerived: 0,
    endpointsResolved: { mint: 0, atlasRef: 0, note: 0, procType: 0, null: 0 },
    reconciliations: [], zeroWitness: 0, razorRedactions: [], demotedProcedureLevel: [],
  };
  const nodes = new Map();       // id -> node
  const edges = [];
  const tables = {};
  const held = new Set(Object.keys(decisions.heldWorks).filter(k => k !== '_note'));
  const atlasRef = decisions.endpointDispositions.atlasRef;
  const endpointNotes = decisions.endpointDispositions.note;
  const mintCulture = new Set(decisions.endpointDispositions.mintCulture);
  const mintAuthor = new Set(decisions.endpointDispositions.mintAuthor);
  const procEndpoints = vocabMap.endpointMap;
  const roles = decisions.workRoles;
  const excludedIds = new Set((decisions.excluded || []).map(e => e.id));
  const nonEdgeIds = new Set((decisions.excluded || []).filter(e => e.shipsAsNonEdge).map(e => e.id));
  const ejectedIds = new Set((decisions.ejected || []).map(e => e.id));

  // ---- declared ids -------------------------------------------------------
  const declared = new Set();
  for (const name of SLICE_FILES) {
    const s = slices[name];
    tables[name] = sourceTable(name, s, decisions);
    for (const w of s.works) declared.add(w.id);
    for (const a of s.authors || []) declared.add(a.id);
    for (const c of s.cultures || []) declared.add(c.id);
    for (const c of s.collections || []) declared.add(c.id);
  }

  // ---- endpoint resolution (write-invariant W1) ---------------------------
  const endpointUse = new Map();     // minted id -> [{sliceName, workId, prose}]
  const seenEndpoint = new Set();
  const countOnce = (ep, bucket) => { const k = `${bucket}|${ep}`; if (!seenEndpoint.has(k)) { seenEndpoint.add(k); diag.endpointsResolved[bucket] += 1; } };
  const resolveEndpoint = ep => {
    if (ep == null) { countOnce('<null>', 'null'); return { kind: 'drop', why: 'null endpoint' }; }
    if (declared.has(ep)) return { kind: 'node', id: ep };
    if (Object.prototype.hasOwnProperty.call(procEndpoints, ep)) { countOnce(ep, 'procType'); return { kind: 'proc', term: procEndpoints[ep] }; }
    if (mintCulture.has(ep)) { countOnce(ep, 'mint'); return { kind: 'mint', id: ep, nodeType: 'culture' }; }
    if (mintAuthor.has(ep)) { countOnce(ep, 'mint'); return { kind: 'mint', id: ep, nodeType: 'author' }; }
    if (Object.prototype.hasOwnProperty.call(atlasRef, ep)) { countOnce(ep, 'atlasRef'); return { kind: 'atlas', slug: atlasRef[ep] }; }
    if (Object.prototype.hasOwnProperty.call(endpointNotes, ep)) { countOnce(ep, 'note'); return { kind: 'note', note: endpointNotes[ep] }; }
    throw new Error(`gen-opgraph: UNRESOLVED ENDPOINT "${ep}" — every endpoint must have a disposition in gate-decisions.json (blocker B10). No endpoint is resolved by inventing a node.`);
  };

  // ---- pass 1: works ------------------------------------------------------
  const workSlice = new Map();
  for (const name of SLICE_FILES) {
    const s = slices[name], table = tables[name];
    for (const w of s.works) {
      workSlice.set(w.id, name);
      if (held.has(w.id)) continue;
      const cfg = roles[w.id] || {};
      const editions = normEditions(w, name);
      if (editions.synth) diag.editionsSynthesised++;
      const contested = normContested(w.contested, name);
      if (w.contested && !contested) diag.contestedDropped++;
      const witnesses = witnessesFor(
        { cite: w.cite, editions: w.editions, notes: w.notes, dedupWith: w.dedupWith,
          structuralNote: w.structuralNote, bestEdition: w.bestEdition, pdStatus: w.pdStatus,
          structure: w.structure, repoState: w.repoState, atlasStatus: w.atlasStatus,
          attributionNote: w.attributionNote, sourceQuality: w.sourceQuality,
          scholarlyStatus: w.scholarlyStatus, criticalNote: w.criticalNote,
          contested: w.contested, commentaries: w.commentaries, gating: w.gating },
        name, table);
      const dateText = clean(w.date || w.dateClaim || w.dateText);
      nodes.set(w.id, {
        id: w.id, type: 'work', label: clean(w.title) || w.id,
        kind: cfg.kind || sliceWorkKind(w),
        // A SLUG IS A CLAIM THAT THE ATLAS HAS THIS ENTRY, and the page turns it
        // straight into a live <a href="confluence.html#slug">. So a slug the
        // atlas does not carry is not a cosmetic mismatch — it ships a dead
        // link and asserts a join that was never built. Twelve did.
        //
        // `atlasSlugExists: false` in a slice means "this is the slug I WOULD
        // want, and the atlas has no such entry": it moves to proposedAtlasSlug
        // and raises atlasNeeded, so the page takes its honest branch ("not
        // present, and it arguably deserves an entry") instead of linking into
        // nothing. The wanted slug is kept, because it is the thing to create.
        atlasSlug: (w.atlasSlugExists === false ? null : clean(w.atlasSlug || w.parentAtlasSlug)) || null,
        proposedAtlasSlug: (w.atlasSlugExists === false ? clean(w.atlasSlug || w.parentAtlasSlug) : null) || null,
        atlasNeeded: Boolean(w.proposedSlug || w.proposedId) || w.atlasSlugExists === false,
        titleOriginal: clean(w.titleOriginal) || null,
        dateText, sortYear: sortYear(dateText),
        cultureIds: [], authorIds: [],
        editions: editions.list,
        role: cfg.role === undefined ? null : cfg.role,
        roleBasis: cfg.role === undefined ? null : (cfg.basis || 'curator-assigned'),
        contested,
        harm: [], notes: assembleNotes(w, name),
        sliceFile: name,
        witnesses, flags: flagsOf(w, name, WORK_FLAG_FIELDS),
        label_: undefined,
      });
    }
  }
  // held works recorded, not deleted
  for (const id of held) if (!workSlice.has(id)) diag.warnings.push(`heldWorks names ${id}, which no slice declares`);

  // ---- pass 1b: DECLARED culture and author nodes -------------------------
  // They must exist before the edge pass, or every BELONGS_TO and AUTHORED_BY
  // that points at a slice-declared node is silently dropped and 13 cultures and
  // 19 authors vanish from a graph that declares them. Unused ones are removed
  // again by the cascade, which is the right place for that decision.
  for (const name of SLICE_FILES) {
    const s = slices[name], table = tables[name];
    for (const c of s.cultures || []) {
      nodes.set(c.id, { id: c.id, type: 'culture', label: clean(c.label) || c.id,
        region: decisions.cultureRegions[c.id] || null,
        periodText: clean(c.span) || null, variantLabels: [],
        sliceFile: name, witnesses: witnessesFor(c, name, table), flags: [] });
    }
    for (const a of s.authors || []) {
      nodes.set(a.id, { id: a.id, type: 'author', label: clean(a.label) || a.id,
        kind: decisions.declaredAuthorKinds[a.id] || 'person',
        attributionNote: clean(a.note) || null, variantLabels: [],
        sliceFile: name, witnesses: witnessesFor(a, name, table), flags: [] });
    }
  }

  // ---- pass 2: node splits (decisions D8) ---------------------------------
  const splits = decisions.nodeSplits;
  const extraRelations = [];
  for (const [srcId, spec] of Object.entries(splits)) {
    if (srcId === '_note') continue;
    const base = nodes.get(srcId);
    if (!base) continue;
    if (spec.into) {
      for (const part of spec.into) {
        nodes.set(part.id, {
          ...base, id: part.id, label: base.label + part.titleSuffix,
          role: part.role, roleBasis: 'curator-assigned',
          notes: [base.notes, part.note].filter(Boolean).join(' — '),
          splitFrom: srcId,
        });
      }
      nodes.delete(srcId);
      if (spec.relation) extraRelations.push({ ...spec.relation, sliceFile: '12-solomonic-western' });
    }
    if (spec.segments) {
      for (const seg of spec.segments) {
        nodes.set(seg.id, {
          ...base, id: seg.id, label: seg.title, kind: 'work-segment',
          role: seg.role, roleBasis: 'curator-assigned',
          notes: seg.note, segmentOf: srcId, splitFrom: srcId,
        });
      }
    }
  }
  const splitOf = new Map();   // old id -> [new ids] for edge rewiring
  for (const [srcId, spec] of Object.entries(splits)) {
    if (srcId === '_note' || !spec.into) continue;
    splitOf.set(srcId, spec.into.map(p => p.id));
  }

  // ---- pass 3: procedure-claims (the op-node) -----------------------------
  const claimIds = new Set();
  const containsSeen = new Map();
  for (const name of SLICE_FILES) {
    const s = slices[name], table = tables[name];
    for (const w of s.works) {
      if (held.has(w.id)) continue;
      const owner = nodes.has(w.id) ? w.id : (splitOf.get(w.id) || [])[0];
      if (!owner) continue;
      (w.procedures || []).forEach((p, i) => {
        const filed = nfc(p.type);
        const mapping = vocabMap.map[filed];
        if (!mapping) throw new Error(`gen-opgraph: UNMAPPED typeAsFiled "${filed}" in ${name}/${w.id} — vocab-map.json must be total (blocker B11). The generator never silently retypes.`);
        const retype = mapping.retypePending && mapping.retypePending.slices.includes(name)
          ? mapping.retypePending : null;
        const evidence = clean(p.evidence || p.completenessEvidence) || '';
        const text = clean(p.textCompleteness ?? p.completeness ?? p.workCompleteness);
        const grade = text && GRADES.includes(text) ? text : null;
        const witnessRaw = clean(p.pdWitnessCompleteness);
        const witnessGrade = witnessRaw && GRADES.includes(witnessRaw.toLowerCase())
          ? witnessRaw.toLowerCase() : null;
        const b = grade ? deriveBasis(evidence) : null;
        if (b) diag.basisDerived++;
        const ik = grade && INCOMPLETE_GRADES.has(grade) ? deriveIncompletenessKind(evidence) : null;
        if (ik) diag.kindDerived++;
        const harm = normHarm(p, vocabMap);
        let harmNote = clean(p.harmNote || (p.harm && p.harm.note)) || null;
        let harmNoteDerived = false;
        if (harm.length && !harmNote) {
          harmNote = harm.map(h => vocabMap.harmKindGlosses[h]).filter(Boolean).join(' ');
          harmNoteDerived = true; diag.harmNoteDerived++;
        }
        const witnesses = witnessesFor(p, name, table).length
          ? witnessesFor(p, name, table)
          : nodes.get(owner).witnesses.map(x => ({ ...x, inherited: true }));
        const flags = flagsOf(p, name, CLAIM_FLAG_FIELDS);
        const id = uniqueId(`proc:${slugify(owner)}-${i + 1}`, claimIds);
        nodes.set(id, {
          id, type: 'procedure-claim', label: `${nodes.get(owner).label} · ${mapping.term}`,
          workId: owner, typeTerm: mapping.term, typeAsFiled: filed,
          retypePending: Boolean(retype), retypeTarget: retype ? retype.target : null,
          subject: clean(p.subject || p.subtype) || null,
          structure: clean(p.structure || p.structureOfProcedure) || null,
          anatomyStages: Array.isArray(p.anatomyStages) ? p.anatomyStages.map(clean) : null,
          anatomyStagesInferred: p.anatomyStagesInferred === true,
          repoCoverage: normRepoCoverage(p.repoCoverage),
          textCompleteness: grade,
          witnessCompleteness: witnessGrade,
          witnessGradeWithheld: witnessRaw && !witnessGrade
            ? (/^none$/i.test(witnessRaw) ? 'No public-domain witness exists for this work.' : witnessRaw)
            : null,
          completenessBasis: b ? b.basis : null,
          completenessBasisDerived: Boolean(b),
          completenessBasisCue: b ? b.cue : null,
          completenessEvidence: evidence || (grade ? '' : 'Grade withheld; see gradeWithheld.'),
          gradeWithheld: grade ? null : (clean(p.gradeWithheld)
            || 'No grade is asserted. The round did not inspect the text at the level a grade would require.'),
          incompletenessKind: ik ? ik.kind : null,
          incompletenessKindDerived: Boolean(ik),
          harm, harmNote, harmNoteDerived,
          unverified: flags.includes('unverified'),
          doNotQuote: flags.includes('do-not-quote'),
          cite: clean(p.cite || p.citation) || (witnesses[0] ? witnesses[0].cite : ''),
          sliceFile: name, witnesses, flags,
        });
        edges.push({ kind: 'CONTAINS', from: owner, to: id, asserted: true });
        edges.push({ kind: 'OF_TYPE', from: id, to: `type:${mapping.term}`, asserted: true });
        const key = `${w.id}|${filed}`;
        containsSeen.set(key, (containsSeen.get(key) || 0) + 1);
      });
    }
  }

  // A WORK'S WITNESSES INCLUDE THE WITNESSES OF THE CLAIMS MADE ABOUT IT.
  // Symmetric with the culture rollup below, and for the same reason: several
  // slices cite their sources on the procedure row rather than on the work
  // header, and reading only the header would call a parsing artefact a
  // curation result. Claims that had no citation of their own already inherited
  // the work's, above, so this pass cannot feed itself.
  for (const n of nodes.values()) {
    if (n.type !== 'procedure-claim') continue;
    const w = nodes.get(n.workId);
    if (!w) continue;
    w.witnesses = dedupeWitnesses([...(w.witnesses || []), ...n.witnesses.filter(x => !x.inherited)]);
  }

  // ---- B9: cross-check procedures[] against CONTAINS_PROCEDURE edges ------
  const named = new Map();
  for (const [sl, list] of Object.entries(decisions.reconciliations)) {
    if (sl === '_note') continue;
    for (const r of list) named.set(`${sl}|${r.workId}|${r.typeAsFiled}`, r);
  }
  for (const name of SLICE_FILES) {
    const edgeCount = new Map();
    for (const e of slices[name].edges) {
      if (e.type !== 'CONTAINS_PROCEDURE') continue;
      const t = String(e.to).replace(/^proc:/, '');
      const k = `${e.from}|${nfc(t)}`;
      edgeCount.set(k, (edgeCount.get(k) || 0) + 1);
    }
    const keys = uniq([...edgeCount.keys(), ...[...containsSeen.keys()]]);
    for (const k of keys.sort()) {
      const [wid, filed] = k.split('|');
      if (workSlice.get(wid) !== name) continue;
      if (held.has(wid)) continue;
      const rows = containsSeen.get(k) || 0;
      const eds = edgeCount.get(k) || 0;
      if (rows === eds || eds === 0 && !slices[name].edges.some(e => e.type === 'CONTAINS_PROCEDURE')) continue;
      if (rows !== eds) {
        const r = named.get(`${name}|${wid}|${filed}`);
        if (!r) throw new Error(`gen-opgraph: UNRECONCILED procedure count — ${name} ${wid} "${filed}": ${rows} rows vs ${eds} CONTAINS_PROCEDURE edges (blocker B9). Add a named reconciliation to gate-decisions.json or fix the slice.`);
        diag.reconciliations.push(`${name} ${wid} "${filed}" ${rows} rows / ${eds} edges — ${r.resolution}`);
      }
    }
  }

  // ---- pass 4: bookkeeping edges + relation-claims ------------------------
  const relIds = new Set();
  const allEdgeRows = [];
  for (const name of SLICE_FILES) {
    for (const e of slices[name].edges) allEdgeRows.push({ e, name });
  }
  for (const { e, name } of allEdgeRows) {
    if (e.type === 'CONTAINS_PROCEDURE') { resolveEndpoint(e.to); continue; }   // consumed by the claim machinery
    const table = tables[name];
    const rawId = e.id || `${e.from}->${e.to === null ? 'NULL' : e.to}`;
    const fromR = resolveEndpoint(e.from);
    const toR = resolveEndpoint(e.to);

    // held works take their edges with them
    if (held.has(e.from) || held.has(e.to)) continue;

    if (e.type === 'BELONGS_TO' || e.type === 'AUTHORED_BY' || e.type === 'HAS_PART' || e.type === 'SEGMENT_OF') {
      if (fromR.kind !== 'node' && fromR.kind !== 'mint') continue;
      if (toR.kind !== 'node' && toR.kind !== 'mint') continue;
      const froms = splitOf.get(fromR.id) || [fromR.id];
      const tos = splitOf.get(toR.id) || [toR.id];
      if (toR.kind === 'mint') {
        const use = endpointUse.get(toR.id) || [];
        const w = slices[name].works.find(x => x.id === e.from);
        use.push({ prose: clean(e.type === 'BELONGS_TO' ? (w && w.culture) : (w && w.author)) || toR.id,
          witnesses: witnessesFor(e, name, table), sliceFile: name });
        endpointUse.set(toR.id, use);
        if (!nodes.has(toR.id)) {
          nodes.set(toR.id, { id: toR.id, type: toR.nodeType, label: toR.id, minted: true,
            sliceFile: name, witnesses: [], flags: [] });
        }
      }
      for (const f of froms) for (const t of tos) {
        if (!nodes.has(f) || !nodes.has(t)) continue;
        const dk = decisions.debunkedAttributions[`${f}|${t}`];
        edges.push({ kind: e.type, from: f, to: t, asserted: true,
          label: dk ? 'debunked' : 'documented', note: dk || null });
        if (e.type === 'BELONGS_TO') nodes.get(f).cultureIds.push(t);
        if (e.type === 'AUTHORED_BY') nodes.get(f).authorIds.push(t);
      }
      continue;
    }

    if (!CLAIM_RELATIONS.includes(e.type)) { diag.warnings.push(`unknown edge type ${e.type} in ${name}`); continue; }

    // --- a claim-bearing relation becomes an OP-NODE ---
    const audited = e.VOIDED_BY_AUDIT || e.crossReferenceOnly;
    if (audited || ejectedIds.has(rawId)) continue;                 // struck: tombstoned in the gate, never shipped
    const isNegative = /NEGATIVE-RESULT-ROW/.test(String(e.status || ''));
    if (excludedIds.has(rawId) && !nonEdgeIds.has(rawId)) continue;  // blocked by a decision
    if (fromR.kind !== 'node' && fromR.kind !== 'mint') continue;
    if (toR.kind !== 'node' && toR.kind !== 'mint') continue;
    const fromId = (splitOf.get(fromR.id) || [fromR.id])[0];
    const toId = (splitOf.get(toR.id) || [toR.id])[0];
    if (!nodes.has(fromId) || !nodes.has(toId)) continue;
    const relation = isNegative ? 'NON_EDGE' : e.type;
    const asserted = !(e.ASSERTED === false || isNegative || relation === 'NON_EDGE');
    const witnesses = witnessesFor(e, name, table);
    const flags = flagsOf(e, name, RELATION_FLAG_FIELDS);
    const label = clean(e.label) || (/(^|\W)disputed/i.test(String(e.confidence || '')) ? 'disputed' : 'documented');
    const id = uniqueId(`rel:${slugify(fromId)}--${slugify(relation)}--${slugify(toId)}`, relIds);
    nodes.set(id, {
      id, type: 'relation-claim',
      label: `${nodes.get(fromId).label} → ${nodes.get(toId).label}`,
      relation, fromId, toId, asserted,
      notAssertedReason: asserted ? null
        : clean(e.VOIDED_BY_AUDIT || e.status || e.note || 'Recorded as NOT DRAWN by the slice author.'),
      reassertIf: asserted ? null : (decisions.excluded.find(x => x.id === rawId) || {}).revisitIf || null,
      label_: label,
      ...propagation(e, fromId, toId),
      bestCitation: clean(e.cite || e.citation) || (witnesses[0] ? witnesses[0].cite : ''),
      note: clean(e.claim || e.note || e.evidence) || '',
      confusedBy: relation === 'NON_EDGE' ? clean(e.note || e.evidence || e.status) : null,
      sliceFile: name, witnesses, flags,
      contested: normContested(e.contested, name),
    });
    edges.push({ kind: 'REL_FROM', from: fromId, to: id, asserted });
    edges.push({ kind: 'REL_TO', from: id, to: toId, asserted });
  }

  // ---- the Dee inversion relation, minted by decision D8 ------------------
  for (const rel of extraRelations) {
    if (!nodes.has(rel.from) || !nodes.has(rel.to)) continue;
    const table = tables[rel.sliceFile];
    const witnesses = (rel.witnesses || []).map(w => {
      const s = table.byKey.get(w.key);
      return { key: w.key, slice: rel.sliceFile, cite: s.cite, tier: s.tier };
    });
    const id = uniqueId(`rel:${slugify(rel.from)}--${slugify(rel.relation)}--${slugify(rel.to)}`, relIds);
    nodes.set(id, {
      id, type: 'relation-claim', label: `${nodes.get(rel.from).label} → ${nodes.get(rel.to).label}`,
      relation: rel.relation, fromId: rel.from, toId: rel.to, asserted: true,
      notAssertedReason: null, reassertIf: null, label_: rel.label,
      procedureLevel: rel.procedureLevel === true, propagatedTypeTerm: rel.propagatedTypeTerm || null,
      bestCitation: rel.bestCitation, note: rel.note, confusedBy: null,
      sliceFile: rel.sliceFile, witnesses, flags: [], contested: null, mintedByDecision: 'D8',
    });
    edges.push({ kind: 'REL_FROM', from: rel.from, to: id, asserted: true });
    edges.push({ kind: 'REL_TO', from: id, to: rel.to, asserted: true });
  }

  // ---- PDM xiv segments (decision D8) ------------------------------------
  for (const [srcId, spec] of Object.entries(splits)) {
    if (srcId === '_note' || !spec.segments) continue;
    for (const seg of spec.segments) {
      if (nodes.has(seg.id) && nodes.has(srcId)) edges.push({ kind: 'SEGMENT_OF', from: seg.id, to: srcId, asserted: true, label: 'documented', note: null });
    }
  }

  // ---- pass 5: minted culture / author labels ----------------------------
  // A CULTURE OR AUTHOR NODE'S WITNESSES ARE THE WITNESSES OF THE WORKS ASSIGNED
  // TO IT. The BELONGS_TO edge often carries no citation of its own, because the
  // assertion lives in the work record's own culture/author field — so taking the
  // edge's citation as the whole evidence would zero out 40 of the 45 cultures and
  // call that a curation result. It is not one; it is a parsing artefact.
  for (const [id, uses] of endpointUse) {
    const n = nodes.get(id);
    if (!n) continue;
    const proseSorted = uniq(uses.map(u => u.prose).filter(Boolean)).sort(by(x => x.length, x => x));
    n.label = proseSorted[0] || id;
    n.variantLabels = proseSorted.slice(1);
    n.witnesses = dedupeWitnesses([...(n.witnesses || []), ...uses.flatMap(u => u.witnesses)]);
    if (n.type === 'culture') {
      n.region = decisions.cultureRegions[id] || null;
      n.periodText = null;
    } else {
      n.kind = decisions.mintedAuthorKinds[id] || 'person';
      n.attributionNote = n.variantLabels.length ? n.variantLabels.join(' | ') : null;
    }
  }
  // ...and only now roll the works' witnesses up onto their culture and author nodes.
  for (const e of edges) {
    if (e.kind !== 'BELONGS_TO' && e.kind !== 'AUTHORED_BY') continue;
    const t = nodes.get(e.to), w = nodes.get(e.from);
    if (!t || !w) continue;
    t.witnesses = dedupeWitnesses([...(t.witnesses || []), ...(w.witnesses || [])]);
  }

  // ---- pass 6: procedure-type nodes (occupied only) ----------------------
  const occupancy = new Map();
  for (const n of nodes.values()) if (n.type === 'procedure-claim') occupancy.set(n.typeTerm, (occupancy.get(n.typeTerm) || 0) + 1);
  for (const t of vocab.terms) {
    if (!occupancy.get(t.term)) continue;
    const claims = [...nodes.values()].filter(n => n.type === 'procedure-claim' && n.typeTerm === t.term);
    nodes.set(`type:${t.term}`, {
      id: `type:${t.term}`, type: 'procedure-type', label: t.term,
      term: t.term, family: t.family,
      familyLabel: (vocab.families.find(f => f.id === t.family) || {}).label || t.family,
      gloss: t.gloss, occupancy: occupancy.get(t.term), warrant: t.warrant,
      // THE `inherited` MARKER IS STRIPPED ON THE WAY UP, and it has to be.
      //
      // A procedure-type node is an AGGREGATE: its witnesses are by construction
      // the union of its member claims' witnesses. "Inherited" is a statement
      // about a CLAIM's relation to its work — it means "this claim has no
      // citation of its own". It is meaningless for an aggregate, whose whole
      // evidence IS its members'.
      //
      // Leaving the marker on made the inheritance cap fire on type nodes, and
      // that is a category error with teeth: type:divination-procedure computed
      // witness 0.5 x primary 0.6 = 0.30, fell under the 0.40 floor, and was
      // excluded — while six live claims still carried its term. That is the
      // whole of the cascade (22 op-node violations + 4 artery failures) and it
      // is fixed here rather than by relaxing the floor or special-casing the
      // invariant, because the defect was never in either of those.
      witnesses: dedupeWitnesses(claims.flatMap(c => c.witnesses))
        .map(({ inherited, ...w }) => w).slice(0, 8),
      flags: [],
    });
  }

  // ---- pass 6b: THE RAZOR REDACTIONS (strike R1's rule, applied at write time)
  // The slices stay as the audit left them; the removal happens here, is
  // tombstoned in the gate, and FAILS LOUDLY if a redaction no longer matches —
  // a stale redaction is how a razor rule quietly stops running.
  for (const rx of decisions.razorRedactions.entries) {
    const n = nodes.get(rx.id);
    if (!n) { diag.warnings.push(`razor redaction targets ${rx.id}, which is not in the graph`); continue; }
    const cur = n[rx.field];
    if (typeof cur !== 'string' || !cur.includes(rx.find)) {
      throw new Error(`gen-opgraph: STALE RAZOR REDACTION — ${rx.id}.${rx.field} no longer contains the text this round removed. Re-check the slice before relaxing the rule.`);
    }
    n[rx.field] = cur.split(rx.find).join(rx.replace);
    diag.razorRedactions.push(`${rx.id}.${rx.field} — ${rx.why}`);
  }

  // ---- pass 7: propagate harm up to works, compute weights ---------------
  for (const n of nodes.values()) {
    if (n.type !== 'procedure-claim') continue;
    const w = nodes.get(n.workId);
    if (w) w.harm = uniq([...w.harm, ...n.harm]).sort();
  }
  for (const n of nodes.values()) {
    if (n.type === 'work') { n.cultureIds = uniq(n.cultureIds).sort(); n.authorIds = uniq(n.authorIds).sort(); }
    const r = computeWeight({
      witnesses: n.witnesses, label: n.label_ || 'documented',
      contested: n.contested || null, flags: n.flags || [],
    });
    Object.assign(n, { weight: r.weight, weightParts: r, gateRound: ROUND_ID });
    if (!n.witnesses.length) diag.zeroWitness++;
  }

  return { nodes, edges, diag, tables, splitOf };

  // --- local helpers ------------------------------------------------------
  function sliceWorkKind(w) {
    const k = String(w.kind || w.nodeKind || '');
    if (/work-segment/i.test(k)) return 'work-segment';
    if (/corpus|collection/i.test(k)) return 'collection';
    return 'work';
  }
  function assembleNotes(w, name) {
    const bits = [w.structuralNote, w.criticalNote, w.notes, w.structure, w.repoState,
      w.atlasStatus, w.dedupWith, w.attributionNote, w.notResolved, w.transmissionFinding,
      w.structuralFinding, w.pdNote, w.scholarlyStatus]
      .map(clean).filter(Boolean);
    for (const [ep, note] of Object.entries(endpointNotes)) {
      if (String(note).includes(w.id)) bits.push(`RETAINED NOTE (endpoint ${ep} not drawn): ${note}`);
    }
    for (const t of decisions.ejected) {
      if (t.retainedAsNote && String(t.retainedAsNote).startsWith(w.id + '.')) {
        bits.push(`RETAINED NOTE (${t.strike}, ${t.reasonCode}): ${t.reason}`);
      }
    }
    return uniq(bits).join(' — ');
  }
  function normEditions(w, name) {
    const src = Array.isArray(w.editions) ? w.editions : [];
    const list = src.map(e => {
      const cite = clean(e.cite || e.label || e.edition || e.ref) || '';
      const pd = pdVerdict(e.pd);
      return { cite, pd, quoteSafe: pd === 'us-pd', locus: clean(e.locus || e.note) || null };
    }).filter(e => e.cite);
    if (list.length) return { list, synth: false };
    const cite = clean(w.bestEdition) || clean(w.cite && String(w.cite)) || `No edition named by the slice for ${w.id}.`;
    return { list: [{ cite, pd: pdVerdict(w.pdStatus), quoteSafe: pdVerdict(w.pdStatus) === 'us-pd', locus: null, derived: true }], synth: true };
  }
  function normContested(c, name) {
    if (!c || !Array.isArray(c.positions)) return null;
    const positions = c.positions
      .map(p => ({ source: clean(p.source || p.holder) || '', value: clean(p.value || p.claim) || '', cite: clean(p.cite) || null }))
      .filter(p => p.source && p.value);
    if (positions.length < 2) return null;
    return { question: clean(c.question || c.flag) || null, positions, resolution: clean(c.resolution) || null };
  }
  function normRepoCoverage(v) {
    const t = clean(v);
    if (!t) return null;
    const first = t.toLowerCase().split(/[\s—-]/)[0];
    return GRADES.includes(first) ? first : (/^none/i.test(t) ? null : null);
  }
  function normHarm(p, vm) {
    const raw = p.harm;
    let list = [];
    if (Array.isArray(raw)) list = raw;
    else if (raw && typeof raw === 'object') list = raw.kinds || (raw.kind ? [raw.kind] : []);
    else if (typeof raw === 'string') list = [raw];
    const out = [];
    for (const h of list) {
      const k = vm.harmMap[String(h)];
      if (!k) throw new Error(`gen-opgraph: UNMAPPED harm kind "${h}" — vocab-map.json harmMap must be total.`);
      out.push(k);
    }
    return uniq(out).sort();
  }
  /**
   * THE MALLINSON STANDARD, enforced. procedureLevel is true ONLY if the claim
   * NAMES the propagated procedure with a controlled term. A flag the slice set
   * without naming one is DEMOTED to work-level and the demotion is printed —
   * the point of this graph is to add procedure-level claims without silently
   * upgrading the many edges that are merely work-level.
   */
  function propagation(e, fromId, toId) {
    if (e.procedureLevel !== true) return { procedureLevel: false, propagatedTypeTerm: null };
    const spec = decisions.propagatedTypes[`${fromId}|${toId}`];
    const term = spec ? spec.term
      : (vocabMap.endpointMap[String(e.propagatedType || '')] || propagatedFromNote(e, vocabMap));
    if (!term) {
      diag.demotedProcedureLevel.push(`${fromId} -> ${toId}: procedureLevel demoted to work-level — the claim names no propagated procedure`);
      return { procedureLevel: false, propagatedTypeTerm: null,
        procedureLevelDemoted: 'The slice flagged this as procedure-level but named no procedure. On the Mallinson standard that is a work-level influence claim, and it is recorded as one.' };
    }
    return { procedureLevel: true, propagatedTypeTerm: term,
      propagatedTypeBasis: spec ? 'named in gate-decisions.json' : 'named by the slice' };
  }
  function propagatedFromNote(e, vm) {
    const t = String(e.note || e.claim || '');
    for (const [k, term] of Object.entries(vm.endpointMap)) {
      if (k === '_note') continue;
      if (t.includes(k)) return term;
    }
    return null;
  }
}

function dedupeWitnesses(ws) {
  const seen = new Map();
  for (const w of ws) { const k = `${w.slice}|${w.key}`; if (!seen.has(k)) seen.set(k, w); }
  return [...seen.values()].sort(by(w => w.slice, w => Number(String(w.key).slice(1))));
}
function uniqueId(base, taken) {
  let id = base, i = 1;
  while (taken.has(id)) { i += 1; id = `${base}-${i}`; }
  taken.add(id);
  return id;
}

// ---------------------------------------------------------------------------
// 5b · THE CASCADE — a claim cannot outlive the record it is a claim about
// ---------------------------------------------------------------------------
/**
 * Admission is per-record, but the graph is not: when a work falls below the
 * floor, its procedure-claims are claims about nothing and its relation-claims
 * point into a hole. Removing the record and keeping the claim is how a graph
 * grows phantom nodes, so the removal cascades until it is stable — and every
 * cascaded record is recorded in the gate with the endpoint that took it, not
 * silently dropped.
 *
 * Shared by the seeder and the artery so the two cannot describe different graphs.
 */
export function cascade(nodesMap, seedLive) {
  const live = new Set(seedLive);
  const removed = new Map();
  const drop = (id, why) => { live.delete(id); if (!removed.has(id)) removed.set(id, why); };
  for (let pass = 0; pass < 12; pass += 1) {
    const before = live.size;
    for (const id of [...live].sort()) {
      const n = nodesMap.get(id);
      if (!n) { drop(id, 'no candidate record'); continue; }
      if (n.type === 'procedure-claim' && !live.has(n.workId)) drop(id, `its work ${n.workId} is not admitted`);
      if (n.type === 'relation-claim') {
        if (!live.has(n.fromId)) drop(id, `its from-endpoint ${n.fromId} is not admitted`);
        else if (!live.has(n.toId)) drop(id, `its to-endpoint ${n.toId} is not admitted`);
      }
      if (n.type === 'procedure-type') {
        const used = [...live].some(x => { const c = nodesMap.get(x); return c && c.type === 'procedure-claim' && c.typeTerm === n.term; });
        if (!used) drop(id, 'no admitted claim uses this term; an occupancy-0 term is not a node');
      }
      if (n.type === 'culture' || n.type === 'author') {
        const used = [...live].some(x => { const w = nodesMap.get(x); return w && w.type === 'work' && (w.cultureIds || []).concat(w.authorIds || []).includes(id); });
        if (!used) drop(id, 'no admitted work references it');
      }
    }
    if (live.size === before) break;
  }
  // occupancy is a fact about the SHIPPED graph, not the candidate graph
  for (const id of live) {
    const n = nodesMap.get(id);
    if (n && n.type === 'procedure-type') {
      n.occupancy = [...live].filter(x => { const c = nodesMap.get(x); return c && c.type === 'procedure-claim' && c.typeTerm === n.term; }).length;
    }
  }
  return { live, removed };
}

// ---------------------------------------------------------------------------
// 6 · APPLY THE GATE (Amendment B — strip at write time)
// ---------------------------------------------------------------------------
export function applyGate(candidates, gate) {
  const admitted = new Map(gate.admitted.map(a => [a.id, a]));
  const ejected = new Set(gate.ejected.map(e => e.id));
  const excluded = new Set(gate.excluded.map(e => e.id));
  const nodes = [];
  const dropped = { belowFloor: 0, notAdmitted: 0, ejected: 0, excluded: 0 };
  for (const n of candidates.nodes.values()) {
    if (ejected.has(n.id)) { dropped.ejected++; continue; }
    if (excluded.has(n.id)) { dropped.excluded++; continue; }
    const a = admitted.get(n.id);
    if (!a) { dropped.notAdmitted++; continue; }
    if (a.weight < ADMISSION_FLOOR) { dropped.belowFloor++; continue; }
    if (a.weight !== n.weight) {
      throw new Error(`gen-opgraph: STORED WEIGHT DISAGREES WITH COMPUTED WEIGHT for ${n.id} — gate says ${a.weight}, rubric computes ${n.weight}. A hand-written weight is a defect, not an override. Re-run scripts/seed-opgraph-gate.mjs.`);
    }
    nodes.push(n);
  }
  // the relation-claim's epistemic label moves from its build-time slot to its
  // shipped name here, so stats and emit read exactly one key.
  // INTEROP, stated because it is a real wart. The common envelope says `label`
  // is the display string, but the atlas's shipped convention — which the pure
  // engine follows — is that a claim's `label` IS its epistemic label
  // (documented / disputed / debunked / conspiracy), because that is what the
  // `--ep-*` token mapping keys on. Rather than invent a second visual
  // vocabulary, a relation-claim carries the epistemic label in BOTH `label` and
  // `epLabel`, and its human-readable endpoints move to `endpointsLabel`.
  for (const n of nodes) {
    if (n.label_ === undefined) { delete n.label_; continue; }
    n.epLabel = n.label_;
    n.endpointsLabel = n.label;
    n.label = n.label_;
    delete n.label_;
  }
  // procedure-type family: "F4 · Body" — the leading number is what the
  // vocabulary table sorts on, and the name is what a reader sees.
  for (const n of nodes) {
    if (n.type !== 'procedure-type') continue;
    n.familyId = n.family;
    n.family = `${n.familyId} · ${n.familyLabel}`;
  }
  const live = new Set(nodes.map(n => n.id));
  // occupancy is a fact about the SHIPPED graph, so it is recomputed after the
  // gate, not carried over from the candidate set.
  for (const n of nodes) {
    if (n.type !== 'procedure-type') continue;
    n.occupancy = nodes.filter(c => c.type === 'procedure-claim' && c.typeTerm === n.term).length;
  }
  const edges = candidates.edges.filter(e => live.has(e.from) && live.has(e.to));
  nodes.sort(by(n => NODE_TYPES.indexOf(n.type), n => n.id));
  edges.sort(by(e => EDGE_KINDS.indexOf(e.kind), e => e.from, e => e.to));
  return { nodes, edges, dropped };
}

// ---------------------------------------------------------------------------
// 7 · EMIT
// ---------------------------------------------------------------------------
const J = v => JSON.stringify(v);
export const sourceId = w => `${w.slice.slice(0, 2)}:${w.key}`;
function emitNode(n) {
  const o = { ...n };
  delete o.weightParts; delete o.label_;
  // The common envelope: `witnesses` is an INTEGER and `sources` is a list of ids
  // that resolve in OPGRAPH_META.sources. Carrying 700 full citation strings twice
  // (here and in gate.json) would triple this file for no fact the reader gains.
  o.sources = uniq((n.witnesses || []).map(sourceId)).sort();
  o.sourceTiers = uniq((n.witnesses || []).map(w => w.tier)).sort();
  // EVERY, not SOME. This flag is the input the weight cap keys on, so its
  // meaning must match the cap exactly: a claim with even one citation of its
  // own has its own evidence and is not capped. When the two used different
  // quantifiers, a mixed-witness claim shipped flagged-but-uncapped and the
  // anti-drift test could not reproduce its weight.
  o.witnessesInherited = ((n.witnesses || []).length > 0
    && (n.witnesses || []).every(w => w && w.inherited)) || undefined;
  o.witnesses = (n.witnesses || []).length;
  o.flags = n.flags && n.flags.length ? n.flags : undefined;
  const ordered = {};
  for (const k of Object.keys(o).sort()) if (o[k] !== undefined) ordered[k] = o[k];
  return '  ' + J(ordered);
}

export function emitModule({ nodes, edges, vocab, gate, stats, sources }) {
  const header = `// ============================================================================
//  opgraph.js — THE OPERATIVE-CONTENT GRAPH. PURE DATA, NO DOM.
//
//  GENERATED — do not hand-edit.
//  Source of truth: research/opgraph/gate.json + research/opgraph/slices/*.json
//  Regenerate:      node scripts/gen-opgraph.mjs
//  Anti-drift:      node scripts/gen-opgraph.mjs --check   (exit 1 on drift)
//
//  WHAT THIS GRAPH ANSWERS, and it is the one question the site could not answer
//  before: what does this text tell an operator to do, how completely does it
//  say it, and where did that sequence come from?
//
//  WHAT IT IS NOT. It is not the Great Confluence. The atlas plots INFLUENCE and
//  owns dating, place and the transmission claims; nothing here is written into
//  confluence.js. Where a work exists in both, the join is an atlasSlug and an
//  href — no data flows in either direction.
//
//  WHAT IT MAY NOT CONTAIN, by contract and by machine check: ordered executable
//  sub-steps; quantities, proportions, temperatures, durations, counts,
//  repetitions or timings; mantra, bīja, logos or voces magicae strings in any
//  script; drawable signs, charaktēres, seals or square-fillings; substance lists
//  for harm-capable material; second-person address or imperative mood.
//  Naming a stage is safe; ordering the sub-steps is not.
//
//  NO OPERATIVE TEXT IS QUOTED HERE AT ALL. This round maps THAT a work contains
//  a procedure — type, structure, completeness, evidence, citation — and
//  transcribes none of it.
//
//  EVERY TECHNIQUE IS DESCRIBED AS HISTORICAL PRACTICE, NEVER PRESCRIBED, and no
//  efficacy is asserted anywhere. Where a text claims a result, the claim is
//  attributed to the text and left there.
//
//  THE OP-NODE. There is never a work→work claim edge. A procedure-claim and a
//  relation-claim are NODES, so a grade is not a label on a hairline: it is a
//  thing you can cite, filter, weight and eject.
//
//  THE GATE. Every node passed research/opgraph/gate.json at weight >= 0.40,
//  where weight = witness × primaryFactor × contestFactor × flagFactor and is
//  COMPUTED from the witness list, never written by hand. Ejected and excluded
//  ids are stripped at write time and never reach this file.
// ============================================================================
`;
  const meta = {
    roundId: ROUND_ID,
    generatedFrom: ['research/opgraph/gate.json', 'research/opgraph/gate-decisions.json',
      'research/opgraph/vocab.json', 'research/opgraph/vocab-map.json',
      ...SLICE_FILES.map(f => `research/opgraph/slices/${f}.json`)],
    generator: 'scripts/gen-opgraph.mjs',
    rubricVersion: RUBRIC_VERSION,
    admissionFloor: ADMISSION_FLOOR,
    weightRubric: 'weight = witness × primaryFactor × contestFactor × flagFactor (2dp)',
    counts: stats.counts,
    grades: stats.grades,
    bases: stats.bases,
    incompletenessKinds: stats.kinds,
    labels: stats.labels,
    weight: stats.weight,
    derivedFields: {
      note: 'THREE FIELDS ARE DERIVED, NOT SOURCED, AND EVERY RECORD SAYS SO. No slice wrote completenessBasis or incompletenessKind, and both are mandatory under the write-invariants; both are derived from the evidence prose by a printed cue table whose DEFAULT IS THE WEAKEST VALUE (genre-norm; constitutive). harmNote is derived from a standing repo gloss only where a slice typed a hazard class and wrote no note. A derived value is never presented as a source statement.',
      completenessBasisDerived: stats.derived.basis,
      incompletenessKindDerived: stats.derived.kind,
      harmNoteDerived: stats.derived.harmNote,
    },
    sources,
    sourcesNote: 'Every node\'s sources[] id resolves here. `tier` is hand-declared in research/opgraph/gate-decisions.json, never inferred from the string: primary = an edition, translation or manuscript catalogue; secondary-scholarly = a monograph, article or dissertation; tertiary = an encyclopaedia, a digest, or THIS REPO CITING ITSELF, because a site is not an independent witness to its own claims.',
    harmKinds: stats.harmKinds,
    harmKindsAddedByData: ['psychological-destabilisation'],
    harmKindsNote: 'PLAN §2.6 closes the harm enum at 14 terms. Eight rows in slices 12 and 14 type psychological-destabilisation explicitly and no term in the 14 covers it. The enum is extended to 15 rather than the rows laundered into ascetic-fasting; the addition is named here so it is a visible deviation and not a silent one.',
    vocabulary: { terms: vocab.terms.length, families: vocab.families.length,
      occupied: stats.counts['procedure-type'] || 0,
      declaredEmpty: vocab.terms.length - (stats.counts['procedure-type'] || 0) },
    gate: {
      admitted: gate.admitted.length, excluded: gate.excluded.length, ejected: gate.ejected.length,
      note: 'gate.ejected is a TOMBSTONE LIST. A record is never deleted; it is moved, with its strike id, its reason code and the round that ejected it. The list of what was considered and rejected is part of the record.',
    },
    orphanedGenerators: ORPHANED_MODULES,
    orphanedGeneratorsNote: 'BLOCKER B12, A NAMED DEFERRAL. These five shipped data modules each name a generator in an untracked, session-scoped scratchpad directory that no longer exists, so they cannot be reproduced from repo state. This round puts opgraph.js behind a tracked artery and does NOT retrofit them: reconstructing four scratchpad generators from their outputs is a whole round of work and doing it badly would rewrite byte-stable shipped data.',
    dataCeiling: [
      'Whether anything works. Efficacy is not a field and never will be.',
      'How to perform anything. By contract — and even a "complete" recipe was not a closed algorithm to its own users.',
      'The date of several of its own nodes. sortYear null means "no date this round trusts".',
      'Any of the contested questions it carries. Resolving one breaks a locked rule.',
      'Any grade whose only accessible witness is redacted — which is exactly what witnessCompleteness exists to make visible.',
      'The Latin channel from the Ghāya to Agrippa. The repo\'s seven arithmetically-verified planetary squares still have no upstream, and this round does not give them one (blocker B1).',
      'Anything in a culture with zero coverage — Mesoamerican, sub-Saharan African, Mesopotamian, Shintō/Shugendō, Slavic, and more. THE GRAPH\'S SILENCE THERE IS NOT EVIDENCE OF ABSENCE.',
    ],
  };
  const vocabOut = vocab.terms.map(t => ({
    term: t.term,
    family: `${t.family} · ${(vocab.families.find(f => f.id === t.family) || {}).label || t.family}`,
    familyId: t.family,
    familyLabel: (vocab.families.find(f => f.id === t.family) || {}).label || t.family,
    gloss: t.gloss, warrant: t.warrant,
    occupancy: (nodes.find(n => n.id === `type:${t.term}`) || {}).occupancy || 0,
  }));
  const gateSummary = {
    admitted: gate.admitted.length, excluded: gate.excluded.length, ejected: gate.ejected.length,
    reasonCodes: stats.reasonCodes,
    ejectedRecords: gate.ejected.map(e => ({
      id: e.id, kind: e.kind, strike: e.strike || null, ejectedBy: e.ejectedBy,
      reasonCode: e.reasonCode, supersededBy: e.supersededBy || null,
      retainedAsNote: e.retainedAsNote || null, ejectedRound: e.ejectedRound, reason: e.reason,
    })),
    excludedRecords: gate.excluded.map(e => ({
      id: e.id, kind: e.kind, reasonCode: e.reasonCode, blocker: e.blocker || null,
      reason: e.reason, revisitIf: e.revisitIf || null,
    })),
  };
  const body = [
    header,
    `export const OPGRAPH_META = ${JSON.stringify(meta, null, 2)};`,
    '',
    '// The controlled procedure-type vocabulary. An occupancy of 0 is legal ONLY with a',
    '// warrant: an empty term is the reason a later round does not force PGM',
    '// logos-recitation into `mantra-recitation`.',
    `export const OPGRAPH_VOCAB = [\n${vocabOut.map(v => '  ' + J(v)).join(',\n')}\n];`,
    '',
    '// Six node types. `procedure-claim` and `relation-claim` are the OP-NODES: the',
    '// relation is a first-class node carrying its own evidence, grade and citation.',
    `export const OPGRAPH_NODES = [\n${nodes.map(emitNode).join(',\n')}\n];`,
    '',
    '// Bookkeeping edges only. All claim content lives in the op-nodes.',
    `export const OPGRAPH_EDGES = [\n${edges.map(e => '  ' + J(e)).join(',\n')}\n];`,
    '',
    '// The gate, published. Most projects of this kind ship only their survivors.',
    `export const OPGRAPH_GATE_SUMMARY = ${JSON.stringify(gateSummary, null, 2)};`,
    '',
    'export default { OPGRAPH_META, OPGRAPH_VOCAB, OPGRAPH_NODES, OPGRAPH_EDGES, OPGRAPH_GATE_SUMMARY };',
    '',
  ].join('\n');
  return body;
}

// ---------------------------------------------------------------------------
// 8 · STATS + STRUCTURE CHECKS
// ---------------------------------------------------------------------------
export function statsFor(nodes, edges, gate, diag, vocabMap) {
  const counts = {};
  for (const t of NODE_TYPES) counts[t] = nodes.filter(n => n.type === t).length;
  const edgeCounts = {};
  for (const k of EDGE_KINDS) edgeCounts[k] = edges.filter(e => e.kind === k).length;
  const claims = nodes.filter(n => n.type === 'procedure-claim');
  const rels = nodes.filter(n => n.type === 'relation-claim');
  const tally = (arr, key) => arr.reduce((a, x) => { const v = x[key] == null ? 'withheld' : x[key]; a[v] = (a[v] || 0) + 1; return a; }, {});
  const weights = nodes.map(n => n.weight);
  const reasonCodes = {};
  for (const e of [...gate.excluded, ...gate.ejected]) reasonCodes[e.reasonCode] = (reasonCodes[e.reasonCode] || 0) + 1;
  return {
    counts, edgeCounts,
    grades: tally(claims, 'textCompleteness'),
    bases: tally(claims.filter(c => c.textCompleteness), 'completenessBasis'),
    kinds: tally(claims.filter(c => c.incompletenessKind), 'incompletenessKind'),
    labels: tally(rels, 'epLabel'),
    relations: tally(rels, 'relation'),
    notAsserted: rels.filter(r => !r.asserted).length,
    procedureLevel: rels.filter(r => r.procedureLevel).length,
    weight: {
      mean: round2(weights.reduce((a, b) => a + b, 0) / (weights.length || 1)),
      min: weights.length ? Math.min(...weights) : 0,
      max: weights.length ? Math.max(...weights) : 0,
      belowFloor: weights.filter(w => w < ADMISSION_FLOOR).length,
    },
    derived: { basis: diag.basisDerived, kind: diag.kindDerived, harmNote: diag.harmNoteDerived },
    harmKinds: vocabMap.harmKinds,
    reasonCodes,
    structure: structureCheck(nodes, edges),
  };
}

export function structureCheck(nodes, edges) {
  const ids = new Set(nodes.map(n => n.id));
  const degree = new Map(nodes.map(n => [n.id, 0]));
  let dangling = 0, dirty = 0;
  for (const e of edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) { dangling++; continue; }
    if (!idIsClean(e.from) || !idIsClean(e.to)) dirty++;
    degree.set(e.from, degree.get(e.from) + 1);
    degree.set(e.to, degree.get(e.to) + 1);
  }
  const orphans = [...degree].filter(([, d]) => d === 0).map(([id]) => id).sort();
  // Acyclicity over the ASSERTED transmission DAG: TRANSMITS_TO plus the two
  // containment edges. A cycle here is A DATING ERROR, not a layout problem.
  //
  // COMMENTS_ON IS EXCLUDED FROM THE RANKING DAG, and finding out why is one of
  // this build's own results. Including it produced exactly two cycles, both of
  // the same shape: yijing --TRANSMITS_TO--> ea:yixue-qimeng --COMMENTS_ON-->
  // yijing, and gw:weyer-pseudomonarchia --TRANSMITS_TO--> gw:scot-discoverie
  // --COMMENTS_ON--> gw:weyer-pseudomonarchia. Neither is a dating error. A
  // commentary runs LATER -> EARLIER while a transmission runs EARLIER -> LATER,
  // so putting both in one ranking guarantees a cycle wherever a text and its
  // commentary are both modelled. That is decision D7 generalised a second time:
  // PHILOLOGICAL DEPENDENCY AND HISTORICAL TRANSMISSION RUN IN OPPOSITE
  // DIRECTIONS AND NEED TWO ARROWS. COMMENTS_ON, PARALLELS, FOUND_WITH,
  // NON_EDGE and RECONSTRUCTED_THROUGH all draw as cross-links, never as rank.
  const RANKING = new Set(['TRANSMITS_TO']);
  const adj = new Map(nodes.filter(n => n.type === 'work').map(n => [n.id, []]));
  for (const n of nodes) {
    if (n.type !== 'relation-claim' || !n.asserted || !RANKING.has(n.relation)) continue;
    if (adj.has(n.fromId)) adj.get(n.fromId).push(n.toId);
  }
  for (const e of edges) {
    if (e.kind !== 'HAS_PART' && e.kind !== 'SEGMENT_OF') continue;
    if (adj.has(e.from)) adj.get(e.from).push(e.to);
  }
  const cycles = [];
  const state = new Map();
  const stack = [];
  const dfs = u => {
    state.set(u, 1); stack.push(u);
    for (const v of (adj.get(u) || []).slice().sort()) {
      if (!adj.has(v)) continue;
      if (state.get(v) === 1) cycles.push([...stack.slice(stack.indexOf(v)), v]);
      else if (!state.get(v)) dfs(v);
    }
    stack.pop(); state.set(u, 2);
  };
  for (const u of [...adj.keys()].sort()) if (!state.get(u)) dfs(u);
  // rank inversions: an asserted TRANSMITS_TO whose endpoints are both dated and run backwards
  const byId = new Map(nodes.map(n => [n.id, n]));
  let inversions = 0, unknownDirection = 0;
  for (const n of nodes) {
    if (n.type !== 'relation-claim' || !n.asserted || n.relation !== 'TRANSMITS_TO') continue;
    const a = byId.get(n.fromId), b = byId.get(n.toId);
    if (!a || !b || a.sortYear == null || b.sortYear == null) { unknownDirection++; continue; }
    if (a.sortYear > b.sortYear) inversions++;
  }
  return { orphans: orphans.length, orphanIds: orphans.slice(0, 12), cycles: cycles.length,
    cycleSample: cycles.slice(0, 3), dangling, dirtyEndpoints: dirty,
    rankInversions: inversions, directionUnknown: unknownDirection };
}

// ---------------------------------------------------------------------------
// 9 · MAIN — build, diff, write or check
// ---------------------------------------------------------------------------
export function build() {
  const inputs = readInputs();
  if (!inputs.gate) throw new Error('gen-opgraph: research/opgraph/gate.json is missing. Run: node scripts/seed-opgraph-gate.mjs');
  const candidates = buildCandidates(inputs);
  const { nodes, edges, dropped } = applyGate(candidates, inputs.gate);
  const stats = statsFor(nodes, edges, inputs.gate, candidates.diag, inputs.vocabMap);
  const used = new Set(nodes.flatMap(n => (n.witnesses || []).map(sourceId)));
  const sources = {};
  for (const name of SLICE_FILES) {
    for (const s of candidates.tables[name].sources) {
      const id = sourceId({ slice: name, key: s.key });
      if (used.has(id)) sources[id] = { cite: s.cite, tier: s.tier, slice: name, key: s.key };
    }
  }
  const source = emitModule({ nodes, edges, vocab: inputs.vocab, gate: inputs.gate, stats, sources });
  return { inputs, candidates, nodes, edges, dropped, stats, source };
}

function printDiff(built, prev) {
  const { stats, dropped, candidates, inputs, nodes, edges } = built;
  const before = prev ? countPrev(prev) : { nodes: 0, edges: 0 };
  const L = [];
  L.push(`[gen-opgraph] rebuilt from research/opgraph/gate.json (rubricVersion ${RUBRIC_VERSION})`);
  L.push('');
  L.push(`  NODES  ${before.nodes} → ${nodes.length}   (+${nodes.length} admitted, -${dropped.ejected + dropped.excluded + dropped.belowFloor + dropped.notAdmitted} withheld)`);
  for (const t of NODE_TYPES) L.push(`    ${(t + '  ').padEnd(18)}${String(stats.counts[t]).padStart(4)}`);
  L.push('');
  L.push(`  EDGES  ${before.edges} → ${edges.length}   ` + EDGE_KINDS.map(k => `${k} ${stats.edgeCounts[k]}`).join(' · '));
  L.push('');
  L.push(`  GRADES  ${Object.entries(stats.grades).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  L.push(`  BASES   ${Object.entries(stats.bases).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  L.push(`          ALL ${stats.derived.basis} bases are DERIVED from evidence prose (default genre-norm, the weakest);`);
  L.push('          genre-norm grades draw hatched and are excluded from every headline count on the page.');
  L.push(`  KINDS   ${Object.entries(stats.kinds).sort().map(([k, v]) => `${k} ${v}`).join(' · ')} (all derived, default constitutive)`);
  L.push(`  LABELS  ${Object.entries(stats.labels).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  L.push(`  RELATIONS ${Object.entries(stats.relations).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  L.push(`            asserted:false ${stats.notAsserted} (drawn struck, never hidden) · procedureLevel ${stats.procedureLevel}`);
  L.push(`  WEIGHT  mean ${stats.weight.mean}  min ${stats.weight.min}  max ${stats.weight.max}  below-floor ${stats.weight.belowFloor}`);
  L.push(`          gate: admitted ${inputs.gate.admitted.filter(a => a.kind === 'node').length} nodes + ${inputs.gate.admitted.filter(a => a.kind === 'edge').length} edges · excluded ${inputs.gate.excluded.length} · ejected ${inputs.gate.ejected.length}`);
  L.push(`          withheld at write time: below-floor ${dropped.belowFloor} · not-admitted ${dropped.notAdmitted} · ejected ${dropped.ejected} · excluded ${dropped.excluded}`);
  L.push('');
  L.push('  EJECTED (tombstoned — never deleted, never shipped)');
  for (const e of inputs.gate.ejected) {
    L.push(`    - ${e.id.padEnd(52).slice(0, 52)} ${(e.strike || '--').padEnd(3)} ${e.reasonCode.padEnd(24)} ${e.retainedAsNote ? 'note kept' : ''}`);
  }
  L.push(`  REASON CODES  ${Object.entries(stats.reasonCodes).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  L.push('');
  const st = stats.structure;
  L.push(`  STRUCTURE  orphans ${st.orphans} · cycles ${st.cycles} · dangling ${st.dangling} · dirty-endpoints ${st.dirtyEndpoints} · rank-inversions ${st.rankInversions} · direction-unknown ${st.directionUnknown}`);
  if (st.orphans) L.push(`             orphan sample: ${st.orphanIds.join(', ')}`);
  if (st.cycles) L.push(`             CYCLE: ${st.cycleSample.map(c => c.join(' → ')).join(' | ')}   A CYCLE IS A DATING ERROR.`);
  L.push(`  ENDPOINTS  minted ${candidates.diag.endpointsResolved.mint} · atlas-ref ${candidates.diag.endpointsResolved.atlasRef} · note ${candidates.diag.endpointsResolved.note} · procedure-type ${candidates.diag.endpointsResolved.procType} · null ${candidates.diag.endpointsResolved.null}`);
  L.push(`  DERIVED    editions synthesised ${candidates.diag.editionsSynthesised} · contested blocks dropped for unnamed positions ${candidates.diag.contestedDropped} · harmNotes from standing gloss ${candidates.diag.harmNoteDerived}`);
  for (const r of candidates.diag.reconciliations) L.push(`  RECONCILED ${r}`);
  for (const w of candidates.diag.warnings) L.push(`  WARN       ${w}`);
  L.push(`  RAZOR      no operative text is transcribed by this round at all; the scan lives in scripts/tests/og-artery.mjs`);
  L.push('');
  return L.join('\n');
}
function countPrev(src) {
  const n = (src.match(/^  \{"/gm) || []).length;
  const nodesBlock = src.split('OPGRAPH_NODES = [')[1] || '';
  const edgesBlock = src.split('OPGRAPH_EDGES = [')[1] || '';
  return {
    nodes: (nodesBlock.split('];')[0].match(/^  \{/gm) || []).length,
    edges: (edgesBlock.split('];')[0].match(/^  \{/gm) || []).length,
    total: n,
  };
}

export function main(argv = process.argv.slice(2)) {
  const check = argv.includes('--check');
  const built = build();
  const prev = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, 'utf8') : null;
  if (check) {
    if (prev === null) { process.stderr.write('[gen-opgraph] --check FAILED: assets/js/core/data/opgraph.js does not exist.\n'); return 1; }
    if (prev !== built.source) {
      process.stderr.write('[gen-opgraph] --check FAILED: the committed module is NOT this generator\'s output.\n');
      process.stderr.write(`  committed ${prev.length} bytes, regenerated ${built.source.length} bytes.\n`);
      process.stderr.write('  Hand-editing a generated file is a test failure. Run: node scripts/gen-opgraph.mjs\n');
      return 1;
    }
    process.stdout.write('[gen-opgraph] --check OK — the committed module is exactly this generator\'s output.\n');
    return 0;
  }
  process.stdout.write(printDiff(built, prev) + '\n');
  if (prev === built.source) {
    process.stdout.write(`  NO CHANGE  ${OUT_PATH.replace(ROOT, '').replace(/\\/g, '/')} is already byte-identical.\n`);
  } else {
    writeFileSync(OUT_PATH, built.source);
    // Buffer.byteLength, not String.length: the module is full of non-ASCII
    // (Sanskrit, Chinese, Greek, em dashes), so the UTF-16 code-unit count
    // under-reports the file on disk by ~6 KB. A build log that misstates its
    // own output size is a small lie in the one place that must not have any.
    process.stdout.write(`  WROTE assets/js/core/data/opgraph.js  (${built.source.split('\n').length} lines, ${Buffer.byteLength(built.source, 'utf8')} bytes)\n`);
  }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try { process.exit(main()); }
  catch (err) { process.stderr.write(`[gen-opgraph] FAILED: ${err.message}\n`); process.exit(1); }
}
