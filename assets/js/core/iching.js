// ============================================================================
//  iching.js — the I Ching (Yijing, the Book of Changes) oracle engine. Six
//  lines are cast (each young/old yin or yang); the six static lines form the
//  PRIMARY hexagram, any OLD (changing) lines are flipped to give the RELATING
//  hexagram, and the inner lines give the NUCLEAR hexagram — all pure structure
//  over the 64 King Wen figures (data/iching-hexagrams.js). The oracle reads the
//  primary hexagram, the moving lines, and the relating hexagram as the tendency
//  of change.
//
//  PURE — no DOM and NO randomness. The caller (app/iching.js) throws the coins;
//  this module only computes, so it is headless-testable and deterministic.
//
//  HONEST FRAMING: divination has no demonstrated validity. This reproduces the
//  tradition's PROCEDURE and imagery for study — a structured mirror for
//  reflection, never a prediction. Described, never prescribed. The line texts
//  are concise ORIGINAL paraphrases (after Legge, public domain), not the
//  copyrighted Wilhelm–Baynes translation.
// ============================================================================
import { HEXAGRAMS, TRIGRAMS, hexagramByLines, hexagramByNum, trigramByLines } from './data/iching-hexagrams.js';

const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'));

// --- casting (pure) ---------------------------------------------------------
// The three-coin method yields, per line (bottom→top), one of 6/7/8/9:
//   6 = old yin  (a broken, CHANGING line → becomes yang)
//   7 = young yang (a solid, stable line)
//   8 = young yin  (a broken, stable line)
//   9 = old yang (a solid, CHANGING line → becomes yin)
// linesFromThrows maps six such values to the static lines (1=yang, 0=yin) and a
// changing-flag per line.
export function linesFromThrows(throws) {
  if (!Array.isArray(throws) || throws.length !== 6) throw new Error('iching: need 6 line throws (each 6,7,8,9)');
  const lines = [], changing = [];
  for (const t of throws) {
    if (![6, 7, 8, 9].includes(t)) throw new Error('iching: a line throw must be 6, 7, 8 or 9');
    lines.push(t === 7 || t === 9 ? 1 : 0);   // 7,9 → yang; 6,8 → yin
    changing.push(t === 6 || t === 9);         // 6,9 → changing
  }
  return { lines, changing };
}

// The three trigrams' lines of a hexagram, bottom→top: [l0,l1,l2,l3,l4,l5].
export function trigramsOf(lines) {
  return { lower: trigramByLines(lines.slice(0, 3)), upper: trigramByLines(lines.slice(3, 6)) };
}

// The relating hexagram: flip every changing line of the primary.
export function relatingHexagram(lines, changing) {
  if (!changing || !changing.some(Boolean)) return null;
  const flipped = lines.map((l, i) => (changing[i] ? (l ? 0 : 1) : l));
  return hexagramByLines(flipped);
}

// The nuclear (inner) hexagram: lower = lines 2–4, upper = lines 3–5 (1-indexed).
export function nuclearHexagram(lines) {
  const nuc = [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]];
  return hexagramByLines(nuc);
}

// ---------------------------------------------------------------------------
//  castReading(lines, changing) — the full reading. `lines`: 6 static values
//  (1=yang/0=yin, bottom→top). `changing`: 6 booleans (the moving lines).
// ---------------------------------------------------------------------------
export function castReading(lines, changing = [false, false, false, false, false, false]) {
  if (!Array.isArray(lines) || lines.length !== 6) throw new Error('iching: need 6 lines');
  const primary = hexagramByLines(lines);
  if (!primary) throw new Error('iching: no hexagram for lines ' + lines.join(''));
  const tri = trigramsOf(lines);
  const nuclear = nuclearHexagram(lines);
  const relating = relatingHexagram(lines, changing);
  const movingIdx = changing.map((c, i) => (c ? i : -1)).filter(i => i >= 0);
  const movingLines = movingIdx.map(i => ({
    line: i + 1, position: ord(i + 1), yang: !!lines[i],
    text: (primary.lineTexts && primary.lineTexts[i]) || '',
  }));

  // The traditional emphasis: no moving line → the Judgment stands; one → that
  // line is the pivot; several → weigh them, and the relating hexagram shows the
  // tendency of the change (many schools read the relating Judgment as the outcome).
  let guidance;
  if (!movingIdx.length) guidance = 'No moving lines — the situation is stable; the Judgment and Image of the hexagram stand as the whole answer.';
  else if (movingIdx.length === 1) guidance = `One moving line (the ${ord(movingIdx[0] + 1)}) — it is the pivot of the reading; the hexagram is changing into ${relating.name}.`;
  else guidance = `${movingIdx.length} moving lines — the situation is in flux; weigh the moving lines and read ${relating ? relating.name : 'the relating hexagram'} as the tendency the change moves toward.`;

  const lines_out = [];
  lines_out.push(`Primary hexagram — ${primary.num}. ${primary.name} (${primary.pinyin}): ${tri.upper.name} over ${tri.lower.name}.`);
  lines_out.push(`Judgment: ${primary.judgment}`);
  lines_out.push(`Image: ${primary.image}`);
  for (const m of movingLines) lines_out.push(`Moving ${m.position} line (${m.yang ? 'old yang 9' : 'old yin 6'}): ${m.text}`);
  lines_out.push(`Nuclear hexagram (the inner situation): ${nuclear.num}. ${nuclear.name}.`);
  if (relating) lines_out.push(`Relating hexagram (where it tends): ${relating.num}. ${relating.name} — ${relating.judgment}`);

  return {
    lines, changing,
    primary, trigrams: tri, nuclear, relating,
    moving: movingLines, movingCount: movingIdx.length,
    guidance, lines_out,
    note: 'The I Ching answers by a hexagram cast at the moment of asking: the primary figure is the situation, the moving lines its pivots, the nuclear hexagram its hidden core, and the relating hexagram the direction of change. A mirror for reflection — never a fixed prediction.',
    cite: 'The Yijing (Book of Changes); James Legge, The I Ching (SBE XVI, 1899, public domain); the King Wen sequence & the received tradition.',
  };
}

export { HEXAGRAMS, TRIGRAMS, hexagramByNum };
