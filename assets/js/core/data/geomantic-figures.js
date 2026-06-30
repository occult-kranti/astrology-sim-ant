// ============================================================================
//  geomantic-figures.js — the sixteen figures of Western/Arabic geomancy
//  (ʿilm al-raml), each a tetragram of four lines (Fire/head, Air/neck,
//  Water/body, Earth/feet), every line either a SINGLE point (1) or a DOUBLE
//  point (2). The sixteen are exactly the 2⁴ = 16 patterns — a complete,
//  provably-distinct set. Four are palindromic (their own upside-down image:
//  Via, Populus, Carcer, Coniunctio); the other twelve form six reverse-pairs
//  (Acquisitio/Amissio, Fortuna Maior/Minor, Puer/Puella, Albus/Rubeus,
//  Laetitia/Tristitia, Caput/Cauda Draconis).
//
//  PURE DATA + tiny helpers — no engine imports. The dot patterns were derived
//  by exhaustive bijection (anchored on Via=1111, Populus=2222, the four
//  palindromes, the planetary rulers and the even/odd point parity) and
//  cross-checked against Agrippa (Three Books II.48–53) and J. M. Greer (The Art
//  and Practice of Geomancy). The "even" figures (an even total of points) are
//  the only eight that can stand as Judge — geomancy's built-in checksum.
//
//  HONEST FRAMING: a historical divinatory art of NO demonstrated validity,
//  recorded for study — described, never prescribed.
// ============================================================================

// [key, Latin, English, [Fire,Air,Water,Earth], planet, sign, element, nature, reversedOf, goodHouses, meaning]
const RAW = [
  ['via', 'Via', 'The Way', [1, 1, 1, 1], 'Moon', 'Cancer', 'Water', 'neutral', 'via', [3, 5, 7, 11],
    'Movement, journeys and change — nothing stays as it was. Favourable for travel and transformation, unfavourable for whatever one wishes to keep unchanged.'],
  ['populus', 'Populus', 'The People', [2, 2, 2, 2], 'Moon', 'Cancer', 'Water', 'neutral', 'populus', [3, 7, 10, 11],
    'A crowd or gathering, passive and reflective like still water — it takes its quality from the figures and houses around it.'],
  ['carcer', 'Carcer', 'The Prison', [1, 2, 2, 1], 'Saturn', 'Capricorn', 'Earth', 'unfavorable', 'carcer', [4, 12],
    'Confinement, restriction, delay and isolation — doors shut, movement blocked. Favourable only where binding or holding fast is wanted.'],
  ['coniunctio', 'Coniunctio', 'Conjunction', [2, 1, 1, 2], 'Mercury', 'Virgo', 'Air', 'neutral', 'coniunctio', [3, 5, 7],
    'A coming-together: meetings, partnerships, the recovery of what was lost. It takes much of its quality from the figures it joins.'],
  ['acquisitio', 'Acquisitio', 'Gain', [1, 2, 1, 2], 'Jupiter', 'Sagittarius', 'Fire', 'favorable', 'amissio', [2, 5, 8, 10, 11],
    'Gain, profit and obtaining what is sought — what comes in exceeds what goes out. One of the most fortunate figures, especially for money and increase.'],
  ['amissio', 'Amissio', 'Loss', [2, 1, 2, 1], 'Venus', 'Taurus', 'Earth', 'unfavorable', 'acquisitio', [12],
    'Loss — things slip away, what goes out exceeds what comes in. Unfavourable for gain, but favourable where release is wanted (escape, being rid of an ill).'],
  ['fortunaMaior', 'Fortuna Maior', 'Greater Fortune', [1, 1, 2, 2], 'Sun', 'Leo', 'Fire', 'favorable', 'fortunaMinor', [1, 5, 10, 11],
    'Great good fortune won by one’s own strength, like the Sun at the zenith — lasting, substantial success. Highly favourable, above all for power and honour.'],
  ['fortunaMinor', 'Fortuna Minor', 'Lesser Fortune', [2, 2, 1, 1], 'Sun', 'Leo', 'Fire', 'favorable', 'fortunaMaior', [1, 5, 10],
    'Good fortune gained swiftly or with outside help, like the Sun descending — real but quick and unstable. Good for matters needing speed, less for permanence.'],
  ['puer', 'Puer', 'The Boy', [1, 1, 2, 1], 'Mars', 'Aries', 'Fire', 'mixed', 'puella', [1, 6, 7],
    'A young man — rash, energetic, martial; bold and good at beginnings but lacking foresight. Favourable for war, contention and love, unfavourable where patience is needed.'],
  ['puella', 'Puella', 'The Girl', [1, 2, 1, 1], 'Venus', 'Libra', 'Air', 'favorable', 'puer', [5, 7, 11],
    'A young woman — harmony, beauty, pleasure and concord. Favourable in most questions, especially love and friendship; a figure of peace, though sometimes fickle.'],
  ['albus', 'Albus', 'White', [2, 2, 1, 2], 'Mercury', 'Gemini', 'Air', 'favorable', 'rubeus', [3, 7, 9, 11],
    'White, peaceful wisdom — clear thought, sound counsel, slow but sure progress. Favourable for learning, beginnings undertaken in peace, and lasting settlements.'],
  ['rubeus', 'Rubeus', 'Red', [2, 1, 2, 2], 'Mars', 'Scorpio', 'Water', 'unfavorable', 'albus', [6, 8],
    'Red — passion, blood, violence and deceit. An ill figure in most questions, favourable only where strong, ruthless force is the very thing asked about.'],
  ['laetitia', 'Laetitia', 'Joy', [2, 1, 1, 1], 'Jupiter', 'Pisces', 'Water', 'favorable', 'tristitia', [1, 5, 9, 10, 11],
    'Joy, health and rising fortune — a figure that "points upward." Favourable in nearly all questions, especially hope, health, building and religion.'],
  ['tristitia', 'Tristitia', 'Sorrow', [1, 1, 1, 2], 'Saturn', 'Aquarius', 'Air', 'unfavorable', 'laetitia', [4, 12],
    'Sorrow, damage and sinking down — a figure that "points downward." Unfavourable in most questions; good only for matters of digging, foundations and what must go deep.'],
  ['caputDraconis', 'Caput Draconis', 'The Dragon’s Head', [1, 2, 2, 2], 'North Node', 'Sagittarius', 'Earth', 'favorable', 'caudaDraconis', [1, 4, 10, 11],
    'The threshold of entry — beginnings, gateways, and increase of whatever it touches (good with the good, ill with the ill). Generally favourable; a figure of opening.'],
  ['caudaDraconis', 'Cauda Draconis', 'The Dragon’s Tail', [2, 2, 2, 1], 'South Node', 'Scorpio', 'Fire', 'unfavorable', 'caputDraconis', [6, 8, 12],
    'The threshold of exit — endings, departures and decrease. Generally unfavourable, save where leaving, completing or being rid of something is the aim.'],
];

const sum = rows => rows.reduce((a, b) => a + b, 0);

export const GEOMANTIC_FIGURES = RAW.map(([key, latin, english, rows, planet, sign, element, nature, reversedOf, goodHouses, meaning]) => ({
  key, latin, english, rows: rows.slice(),
  fire: rows[0], air: rows[1], water: rows[2], earth: rows[3],
  points: sum(rows), even: sum(rows) % 2 === 0,
  planet, sign, element, nature, reversedOf, goodHouses, meaning,
  citation: 'Agrippa, Three Books of Occult Philosophy II.48–53; J. M. Greer, The Art and Practice of Geomancy.',
}));

const BY_BITS = new Map(GEOMANTIC_FIGURES.map(f => [f.rows.join(''), f]));
const BY_KEY = new Map(GEOMANTIC_FIGURES.map(f => [f.key, f]));

export function figureByRows(rows) {
  const f = BY_BITS.get(rows.join(''));
  if (!f) throw new Error('geomancy: no figure for rows ' + rows.join(','));
  return f;
}
export function figureByKey(key) { return BY_KEY.get(key) || null; }

// The eight EVEN figures — the only ones that can stand as the Judge.
export const EVEN_FIGURES = GEOMANTIC_FIGURES.filter(f => f.even).map(f => f.key);

// A small ASCII glyph (·=single, :=double, top→bottom) — handy for text output.
export function figureGlyph(f) { return f.rows.map(r => (r === 1 ? '·' : ':')).join(' '); }
