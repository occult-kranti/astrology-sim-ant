// ============================================================================
//  geomancy.js — Western/Arabic geomancy (ʿilm al-raml, "the science of the
//  sand"), the divinatory art Agrippa called "the daughter of astrology." The
//  whole Shield Chart is BOOLEAN ALGEBRA over the sixteen four-line figures:
//  four Mothers are cast at random, and everything else — the Daughters, the
//  Nieces, the two Witnesses, the Judge and the Reconciler — is DERIVED with two
//  pure operations (transposition + line-by-line parity addition). The Judge
//  carries a built-in checksum (it always has an even number of points), so a
//  mis-cast chart is detectable. The twelve generated figures are then laid into
//  the twelve astrological houses (data/houses.js) and judged by the topic's
//  house, exactly as horary-judge.js judges a Lilly figure.
//
//  PURE — no DOM and NO randomness. The caller (app/geomancy.js) supplies the
//  random marks; this module only computes. That keeps it headless-testable and
//  lets the engine-test assert the algebra (the Judge-is-even theorem) directly.
//
//  HONEST FRAMING: this reproduces the tradition's PROCEDURE for study. Geomancy
//  has no demonstrated validity; the verdict is a structured weighing of a
//  historical art, never a prediction. Described, never prescribed.
// ============================================================================
import { GEOMANTIC_FIGURES, figureByRows } from './data/geomantic-figures.js';
import { HOUSES } from './data/houses.js';

const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'));

// --- the two pure operations ------------------------------------------------

// ADD two figures line by line. The points of each line are summed; an EVEN sum
// yields a double point (2), an ODD sum a single point (1). (Equivalently: the
// lines agree → 2, disagree → 1.) This is the engine of the whole shield.
export function addFigures(a, b) {
  const rows = [0, 1, 2, 3].map(i => ((a.rows[i] + b.rows[i]) % 2 === 0) ? 2 : 1);
  return figureByRows(rows);
}

// Build the four MOTHERS from 16 lines of random marks: each line's mark-count,
// odd → a single point (1), even → a double point (2). tallies[0..3] = Mother 1,
// [4..7] = Mother 2, and so on (head-to-foot within each mother).
export function mothersFromTallies(tallies) {
  if (!Array.isArray(tallies) || tallies.length < 16) throw new Error('geomancy: need 16 tallies for the four Mothers');
  const mothers = [];
  for (let m = 0; m < 4; m++) {
    const rows = [0, 1, 2, 3].map(i => (Math.abs(Math.trunc(tallies[m * 4 + i])) % 2 === 0) ? 2 : 1);
    mothers.push(figureByRows(rows));
  }
  return mothers;
}

// ---------------------------------------------------------------------------
//  castShield — from the four Mothers, derive the entire Shield Chart.
//   • Daughters: by TRANSPOSITION — Daughter j is built from the j-th line of
//     each Mother in turn (Daughter 1 = the four heads, Daughter 2 = the necks…).
//   • Nieces (Nephews): Niece 1 = M1+M2, Niece 2 = M3+M4, Niece 3 = D1+D2,
//     Niece 4 = D3+D4.
//   • Witnesses: Right = N1+N2, Left = N3+N4.
//   • Judge = Right + Left  (always an even figure — the checksum).
//   • Reconciler (Sentinel) = Judge + Mother 1 (optional clarifier).
// ---------------------------------------------------------------------------
export function castShield(mothers) {
  if (!Array.isArray(mothers) || mothers.length !== 4) throw new Error('geomancy: castShield needs four Mothers');
  const M = mothers;
  const daughters = [0, 1, 2, 3].map(j => figureByRows([M[0].rows[j], M[1].rows[j], M[2].rows[j], M[3].rows[j]]));
  const nieces = [
    addFigures(M[0], M[1]),
    addFigures(M[2], M[3]),
    addFigures(daughters[0], daughters[1]),
    addFigures(daughters[2], daughters[3]),
  ];
  const right = addFigures(nieces[0], nieces[1]);
  const left = addFigures(nieces[2], nieces[3]);
  const judge = addFigures(right, left);
  const reconciler = addFigures(judge, M[0]);
  return {
    mothers: M, daughters, nieces,
    witnesses: { right, left },
    judge, reconciler,
    // the twelve houses are populated in order: Mothers → 1-4, Daughters → 5-8,
    // Nieces → 9-12 (the classical House Chart from the Shield).
    houseFigures: [...M, ...daughters, ...nieces],
  };
}

// Convenience: cast a whole shield straight from 16 random marks.
export function castFromTallies(tallies) { return castShield(mothersFromTallies(tallies)); }

// ---------------------------------------------------------------------------
//  geomancyHouses — lay the twelve generated figures into the twelve houses.
// ---------------------------------------------------------------------------
export function geomancyHouses(shield) {
  return shield.houseFigures.map((f, i) => ({
    house: i + 1, figure: f,
    name: HOUSES[i].name, signifies: HOUSES[i].signifies, angle: HOUSES[i].angle,
  }));
}

// Which houses (1-12) a figure occupies in the House Chart.
function occupiedHouses(houses, key) {
  return houses.filter(h => h.figure.key === key).map(h => h.house);
}
const adjacent = (a, b) => Math.abs(a - b) === 1 || Math.abs(a - b) === 11; // 12↔1 wraps

// ---------------------------------------------------------------------------
//  geomanticJudgement — judge a question after the tradition (Agrippa II;
//  Pietro d'Abano; JMG Greer). The querent is the 1st house; the quesited is the
//  topic house. The matter "perfects" by one of the classical modes, and the
//  JUDGE gives the overall outcome (favourable / unfavourable figures), tempered
//  by the topic-house figure and the two Witnesses. Returns the same tone shape
//  as horary-judge.js (affirmed / qualified / denied) so the UI is uniform.
// ---------------------------------------------------------------------------
export function geomanticJudgement(shield, quesitedHouse = 7, opts = {}) {
  const houses = geomancyHouses(shield);
  const qH = Math.min(12, Math.max(1, quesitedHouse | 0));
  const querentHouse = opts.querentHouse || 1;

  const querentFig = houses[querentHouse - 1].figure;
  const quesitedFig = houses[qH - 1].figure;
  const judge = shield.judge;
  const right = shield.witnesses.right, left = shield.witnesses.left;

  const querentHomes = occupiedHouses(houses, querentFig.key);
  const quesitedHomes = occupiedHouses(houses, quesitedFig.key);

  // --- the modes of perfection -------------------------------------------
  // A SELF-QUESTION (the question is about the querent's own house, e.g. the 1st)
  // has no second party: querent and quesited are the same figure, so the
  // perfection tests (which assume two distinct houses) would fire spuriously.
  // We skip them and judge on the Judge + the house figure alone.
  const selfQuestion = qH === querentHouse;
  const modes = [];
  if (!selfQuestion) {
    const sameFigure = querentFig.key === quesitedFig.key;
    // Occupation: the querent's figure also stands in the quesited's house (or the
    // two significators are the very same figure) — the strongest perfection.
    if (sameFigure || quesitedHomes.includes(querentHouse) || querentHomes.includes(qH))
      modes.push({ name: 'occupation', note: 'the significators occupy one another’s house — the matter comes to pass directly.' });
    // Conjunction: a significator passes into a house adjacent to the other.
    if (querentHomes.some(h => adjacent(h, qH)) || quesitedHomes.some(h => adjacent(h, querentHouse)))
      modes.push({ name: 'conjunction', note: 'a significator moves beside the other — the parties are brought together.' });
    // Mutation: the two significators appear together in some other adjacent pair.
    for (const a of querentHomes) for (const b of quesitedHomes) if (adjacent(a, b) && !(a === querentHouse && b === qH))
      { modes.push({ name: 'mutation', note: 'the significators meet elsewhere in the figure — the matter perfects by exchange.' }); break; }
    // Translation: a third, identical figure stands beside both significators.
    for (const h of houses) {
      if (h.figure.key === querentFig.key || h.figure.key === quesitedFig.key) continue;
      const beside = occupiedHouses(houses, h.figure.key);
      if (beside.length >= 2 && beside.some(x => adjacent(x, querentHouse)) && beside.some(x => adjacent(x, qH)))
        { modes.push({ name: 'translation', note: `${h.figure.english} carries the light between the significators.` }); break; }
    }
  }
  // de-duplicate by name
  const seen = new Set(); const perfection = modes.filter(m => !seen.has(m.name) && seen.add(m.name));
  const perfects = perfection.length > 0;

  // --- weigh the tone -----------------------------------------------------
  // the Judge is decisive; the topic-house figure colours it; perfection turns a
  // neutral chart; an unfavourable Judge denies even a perfecting matter.
  const fav = f => f.nature === 'favorable' ? 1 : f.nature === 'unfavorable' ? -1 : 0;
  // a self-question is judged on the Judge + the house figure alone (no perfection term)
  const score = selfQuestion ? fav(judge) * 2 + fav(quesitedFig) : fav(judge) * 2 + fav(quesitedFig) + (perfects ? 1 : -1);
  let tone, toneText;
  if (selfQuestion) {
    tone = score >= 2 ? 'affirmed' : score <= -2 ? 'denied' : 'qualified';
    toneText = `The question concerns the querent themselves (the ${ord(qH)} house), so there is no second party to perfect with — the tradition reads it by the Judge (${judge.english}, ${judge.nature}) and the figure of the house (${quesitedFig.english}, ${quesitedFig.nature}).`;
  } else if (score >= 2) {
    tone = 'affirmed';
    toneText = `The Judge is ${judge.english} (${judge.nature})${perfects ? ' and the matter perfects' : ', and though the significators make no perfecting contact the testimonies favour the matter'} — the tradition reads the question favourably.`;
  } else if (score <= -2) {
    tone = 'denied';
    toneText = `The Judge is ${judge.english} (${judge.nature})${perfects ? '' : ' and the significators make no perfecting contact'} — the tradition reads against the matter.`;
  } else {
    tone = 'qualified';
    toneText = `The Judge is ${judge.english} (${judge.nature}); the testimonies are mixed — weigh the Witnesses and the figure of the ${ord(qH)} house.`;
  }

  // --- cited lines --------------------------------------------------------
  const lines = [];
  if (selfQuestion) {
    lines.push(`The question concerns the querent themselves — the ${ord(qH)} house (${(houses[qH - 1].signifies || '').split(';')[0]}) holds ${quesitedFig.english} (${quesitedFig.latin}), ${quesitedFig.nature}: ${quesitedFig.meaning}`);
  } else {
    lines.push(`Querent — the ${ord(querentHouse)} house holds ${querentFig.english} (${querentFig.latin}), ${querentFig.nature}: ${querentFig.meaning}`);
    lines.push(`Quesited — the ${ord(qH)} house (${(houses[qH - 1].signifies || '').split(';')[0]}) holds ${quesitedFig.english} (${quesitedFig.latin}), ${quesitedFig.nature}: ${quesitedFig.meaning}`);
    if (perfection.length) for (const m of perfection) lines.push(`Perfection by ${m.name}: ${m.note}`);
    else lines.push('No mode of perfection joins the significators — the matter does not come about of itself.');
  }
  lines.push(`Right Witness ${right.english} (the querent’s side / what is past) and Left Witness ${left.english} (the quesited’s side / what is to come) add to the Judge.`);
  lines.push(`Judge — ${judge.english} (${judge.latin}), ${judge.nature}, ${judge.points} points (an even figure — the chart checks out): ${judge.meaning}`);
  if (shield.reconciler) lines.push(`Reconciler — ${shield.reconciler.english}, added to clarify a doubtful Judge.`);

  return {
    quesitedHouse: qH, querentHouse,
    querentFigure: querentFig, quesitedFigure: quesitedFig,
    judge, witnesses: { right, left }, reconciler: shield.reconciler,
    perfection, perfects, tone, toneText, lines,
    topic: (houses[qH - 1].signifies || '').split(';')[0],
    note: 'In geomancy the Judge gives the outcome, the Witnesses the road to it (right = the querent and the past, left = the quesited and what follows), and the figure of the topic house the matter itself; perfection (occupation, conjunction, mutation, translation) shows whether the parties truly meet.',
    cite: 'Agrippa, Three Books of Occult Philosophy II.48–53; Pietro d’Abano; J. M. Greer, The Art and Practice of Geomancy.',
  };
}

// The whole 16-figure catalogue, for the reference panel.
export { GEOMANTIC_FIGURES };
