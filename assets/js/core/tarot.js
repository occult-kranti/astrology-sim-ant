// ============================================================================
//  tarot.js — the Tarot reading engine in the Rider–Waite–Smith / Hermetic Order
//  of the Golden Dawn tradition. The 78-card deck lives in data/tarot-deck.js;
//  this module holds the METHOD: the canonical spreads (their named positions and
//  layout), the Golden Dawn ELEMENTAL DIGNITIES between adjacent cards, and a
//  structured reading that pairs each drawn card (upright or reversed) with its
//  position's meaning and reports the spread's balance.
//
//  PURE — no DOM and NO randomness. The shuffle/cut/draw happens in the app
//  layer (app/tarot.js); this module receives the already-drawn cards so it is
//  headless-testable and deterministic.
//
//  HONEST FRAMING: Tarot cartomancy has no demonstrated predictive validity. The
//  reading is a structured presentation of a historical symbolic system for
//  study — described, never prescribed; never advice or a forecast.
// ============================================================================
import { TAROT_DECK, cardById, SUITS } from './data/tarot-deck.js';

// ---------------------------------------------------------------------------
//  The canonical spreads. Each position carries a normalized layout point
//  (x,y in 0..1) so the UI can place the cards, and `neighbors` lists the pairs
//  whose elemental dignity is read (the cards that "speak to" each other).
// ---------------------------------------------------------------------------
export const SPREADS = {
  single: {
    key: 'single', name: 'Single card', count: 1,
    description: 'One card for the question or the day — the simplest draw.',
    positions: [{ n: 1, label: 'The card', meaning: 'The heart of the matter as the deck shows it.', x: 0.5, y: 0.5 }],
    neighbors: [],
  },
  three: {
    key: 'three', name: 'Three-card — Past / Present / Future', count: 3,
    description: 'The classic linear spread: how the matter came to be, where it stands, and where it tends.',
    positions: [
      { n: 1, label: 'Past', meaning: 'The roots of the matter — what has led here.', x: 0.2, y: 0.5 },
      { n: 2, label: 'Present', meaning: 'The matter as it now stands.', x: 0.5, y: 0.5 },
      { n: 3, label: 'Future', meaning: 'Where the matter tends if unchanged.', x: 0.8, y: 0.5 },
    ],
    neighbors: [[0, 1], [1, 2]],
  },
  horseshoe: {
    key: 'horseshoe', name: 'Horseshoe (five cards)', count: 5,
    description: 'A five-card arc: the past, the present, hidden influences, the obstacle, and the likely outcome.',
    positions: [
      { n: 1, label: 'Past', meaning: 'The background the matter grows from.', x: 0.12, y: 0.62 },
      { n: 2, label: 'Present', meaning: 'The present situation.', x: 0.30, y: 0.34 },
      { n: 3, label: 'Hidden influences', meaning: 'What is unseen or unacknowledged.', x: 0.50, y: 0.22 },
      { n: 4, label: 'Obstacle', meaning: 'The difficulty or what must be reckoned with.', x: 0.70, y: 0.34 },
      { n: 5, label: 'Likely outcome', meaning: 'Where the matter tends as it stands.', x: 0.88, y: 0.62 },
    ],
    neighbors: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  celticCross: {
    key: 'celticCross', name: 'The Celtic Cross (ten cards)', count: 10,
    description: 'A.E. Waite’s ten-card method — a cross of six (the situation) and a staff of four (the querent, the world, hopes & fears, the outcome).',
    positions: [
      { n: 1, label: 'The present', meaning: 'The matter, and the querent, at the heart of the question.', x: 0.30, y: 0.50 },
      { n: 2, label: 'The crossing', meaning: 'What crosses it — the immediate obstacle or aid (read upright either way).', x: 0.30, y: 0.50, rotated: true },
      { n: 3, label: 'The foundation', meaning: 'The basis of the matter, beneath it — its deep cause.', x: 0.30, y: 0.74 },
      { n: 4, label: 'The recent past', meaning: 'What is passing away, behind the querent.', x: 0.14, y: 0.50 },
      { n: 5, label: 'The crown', meaning: 'The conscious aim, or what may come — above.', x: 0.30, y: 0.26 },
      { n: 6, label: 'The near future', meaning: 'What approaches, before the querent.', x: 0.46, y: 0.50 },
      { n: 7, label: 'The querent', meaning: 'The querent’s own stance and attitude.', x: 0.72, y: 0.80 },
      { n: 8, label: 'The environment', meaning: 'House, others, the world around the matter.', x: 0.72, y: 0.60 },
      { n: 9, label: 'Hopes & fears', meaning: 'What the querent most hopes for — and most dreads (often one thing).', x: 0.72, y: 0.40 },
      { n: 10, label: 'The outcome', meaning: 'The sum of the others — where the matter resolves.', x: 0.72, y: 0.20 },
    ],
    // the famous crossing pair, plus the temporal axis of the cross
    neighbors: [[0, 1], [3, 0], [0, 5], [2, 0], [0, 4]],
  },
};

export const SPREAD_KEYS = Object.keys(SPREADS);

// ---------------------------------------------------------------------------
//  Elemental dignities (Golden Dawn). Two cards beside one another modify each
//  other by element: like strengthens like; the two active elements (Fire, Air)
//  are friendly, as are the two passive (Water, Earth); Fire⇄Water and Air⇄Earth
//  are contrary and weaken; the cross-pairs (Fire/Earth, Air/Water) are neutral.
// ---------------------------------------------------------------------------
const FRIEND = new Set(['Fire|Air', 'Air|Fire', 'Water|Earth', 'Earth|Water']);
const ENEMY = new Set(['Fire|Water', 'Water|Fire', 'Air|Earth', 'Earth|Air']);
export function elementalDignity(a, b) {
  if (!a || !b) return { relation: 'neutral', note: 'no shared elemental relation.' };
  if (a === b) return { relation: 'reinforce', note: `both ${a} — they powerfully reinforce one another, for good or ill.` };
  const k = a + '|' + b;
  if (FRIEND.has(k)) return { relation: 'strengthen', note: `${a} and ${b} are friendly (both ${a === 'Fire' || a === 'Air' || b === 'Fire' ? 'active' : 'passive'}) — they strengthen each other.` };
  if (ENEMY.has(k)) return { relation: 'weaken', note: `${a} and ${b} are contrary — they weaken and unsettle one another.` };
  return { relation: 'neutral', note: `${a} and ${b} are neither friends nor enemies — neutral.` };
}

// ---------------------------------------------------------------------------
//  drawSpread — pair an array of draws with a spread's positions.
//  draws: [{ id, reversed }] of length spread.count (supplied by the app's
//  shuffle). Returns the laid-out cards + the elemental dignities between the
//  spread's declared neighbours.
// ---------------------------------------------------------------------------
export function drawSpread(spreadKey, draws) {
  const spread = SPREADS[spreadKey];
  if (!spread) throw new Error(`tarot: unknown spread "${spreadKey}"`);
  if (!Array.isArray(draws) || draws.length !== spread.count) throw new Error(`tarot: ${spread.name} needs ${spread.count} cards`);
  const laid = draws.map((d, i) => {
    const card = cardById(d.id);
    if (!card) throw new Error(`tarot: unknown card "${d.id}"`);
    const pos = spread.positions[i];
    // a rotated position (the Celtic Cross "crossing") is read upright either way
    const reversed = pos.rotated ? false : !!d.reversed;
    return {
      n: pos.n, position: pos.label, positionMeaning: pos.meaning, x: pos.x, y: pos.y, rotated: !!pos.rotated,
      card, reversed,
      text: (reversed ? card.reversed : card.upright) || [],
      meaning: reversed ? (card.reversedMeaning || card.meaning) : card.meaning,
    };
  });
  const dignities = spread.neighbors.map(([i, j]) => ({
    between: [laid[i].card.name, laid[j].card.name],
    positions: [laid[i].position, laid[j].position],
    ...elementalDignity(laid[i].card.element, laid[j].card.element),
  }));
  return { spread: { key: spread.key, name: spread.name, description: spread.description }, cards: laid, dignities };
}

// ---------------------------------------------------------------------------
//  tarotReading — the structured reading: the laid spread, the dignities, and a
//  balance summary (the dominant element/suit, the weight of the Major Arcana,
//  the count of reversals) the UI and the AI assistant narrate.
// ---------------------------------------------------------------------------
export function tarotReading(spreadKey, draws, opts = {}) {
  const drawn = drawSpread(spreadKey, draws);
  const cards = drawn.cards;
  const elements = {};
  const suits = {};
  let majors = 0, reversed = 0;
  for (const c of cards) {
    if (c.card.element) elements[c.card.element] = (elements[c.card.element] || 0) + 1;
    if (c.card.arcana === 'major') majors++; else if (c.card.suit) suits[c.card.suit] = (suits[c.card.suit] || 0) + 1;
    if (c.reversed) reversed++;
  }
  const top = obj => Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
  const domEl = top(elements), domSuit = top(suits);
  const balance = {
    elements, suits, majors, minors: cards.length - majors, reversed,
    dominantElement: domEl ? domEl[0] : null,
    dominantSuit: domSuit ? domSuit[0] : null,
    majorsHeavy: majors >= Math.ceil(cards.length / 2) && cards.length > 1,
  };
  const summaryLines = [];
  if (balance.majorsHeavy) summaryLines.push(`The Major Arcana dominate (${majors} of ${cards.length}) — the tradition reads great, fated forces at work, beyond the querent’s ordinary control.`);
  if (balance.dominantSuit) summaryLines.push(`${SUITS[balance.dominantSuit] ? SUITS[balance.dominantSuit].name : balance.dominantSuit} (${SUITS[balance.dominantSuit] ? SUITS[balance.dominantSuit].element : ''}) is the leading suit — the matter turns on ${SUITS[balance.dominantSuit] ? SUITS[balance.dominantSuit].of : 'its affairs'}.`);
  if (balance.dominantElement) summaryLines.push(`${balance.dominantElement} is the leading element of the spread.`);
  if (reversed) summaryLines.push(`${reversed} card${reversed > 1 ? 's are' : ' is'} reversed — that energy is blocked, internalised, or delayed.`);
  const strong = drawn.dignities.filter(d => d.relation === 'strengthen' || d.relation === 'reinforce');
  const weak = drawn.dignities.filter(d => d.relation === 'weaken');
  if (strong.length) summaryLines.push(`${strong.length} elementally friendly pair${strong.length > 1 ? 's' : ''} — those cards reinforce one another.`);
  if (weak.length) summaryLines.push(`${weak.length} contrary pair${weak.length > 1 ? 's' : ''} — those cards undercut one another.`);

  return {
    question: opts.question || '',
    spread: drawn.spread, cards, dignities: drawn.dignities, balance,
    summaryLines,
    note: 'A Tarot reading lays a symbolic story: each position frames a card, reversals soften or block it, and the Golden Dawn elemental dignities show which neighbours strengthen or contradict each other. The reader weaves these into one narrative — never a fixed prediction.',
    cite: 'A. E. Waite, The Pictorial Key to the Tarot (1911); the Hermetic Order of the Golden Dawn, Book T; Mary K. Greer, Tarot for Your Self.',
  };
}

export { TAROT_DECK };
