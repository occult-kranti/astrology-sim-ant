// ============================================================================
//  considerations.js — Lilly's "Considerations before Judgement" (CA Bk 2,
//  pp.121-123): the cautions that tell the astrologer whether a horary figure
//  is radical (fit to be judged). Lilly intends these as flags for reflection,
//  NOT as automatic bars to judgement — so we report them as advisories.
// ============================================================================
import { norm360, signOf } from './astro.js';
import { aspectBetween } from './aspects.js';
import { DOMICILE } from './data/dignities-data.js';

const VOC_EXCEPTION = ['Taurus', 'Cancer', 'Sagittarius', 'Pisces']; // Moon "performs somewhat" here

// Is the Moon void of course? — makes no more applying Ptolemaic aspect to a
// planet before leaving her present sign.
export function moonVoidOfCourse(chart) {
  const moon = chart.planets.Moon;
  const degLeft = 30 - signOf(moon.lon).degInSign; // degrees until sign change
  for (const name of ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const a = aspectBetween('Moon', moon, name, chart.planets[name]);
    if (a && a.applying && a.orb <= degLeft + 0.5) return false; // perfects before leaving sign
  }
  // also consider applying aspects that will perfect within the remaining arc
  return true;
}

// Via combusta: Moon between 15° Libra and 15° Scorpio (195°–225°).
export function moonInViaCombusta(chart) {
  const l = chart.planets.Moon.lon;
  return l >= 195 && l <= 225;
}

// Run the full set of considerations. Returns advisories with severity.
export function considerations(chart, planetaryHourRuler) {
  const out = [];
  const asc = chart.asc, ascDeg = signOf(asc).degInSign;
  const lordAsc = DOMICILE[signOf(asc).index];

  // 1. Early ascendant — matter not yet ripe
  if (ascDeg < 3)
    out.push({ severity: 'caution', text: `Few degrees ascend (${ascDeg.toFixed(0)}° on the cusp) — the matter may not be ripe for judgement, or is too early to read.` });
  // 2. Late ascendant — matter elapsed / querent already committed
  if (ascDeg > 27)
    out.push({ severity: 'caution', text: `Late degrees ascend (${ascDeg.toFixed(0)}°) — the matter may be already decided or out of the querent's hands.` });

  // 3. Moon void of course
  if (moonVoidOfCourse(chart)) {
    const sign = signOf(chart.planets.Moon.lon).name;
    const soft = VOC_EXCEPTION.includes(sign);
    out.push({ severity: soft ? 'note' : 'caution',
      text: `The Moon is void of course${soft ? ` — though in ${sign} she still "performs somewhat", per Lilly` : ' — ordinarily "nothing will come of the matter"'}.` });
  }
  // 4. Via combusta
  if (moonInViaCombusta(chart))
    out.push({ severity: 'caution', text: 'The Moon is in the Via Combusta (15° Libra–15° Scorpio) — Lilly counsels care in judging.' });

  // 5. Saturn in the 1st (esp. retrograde)
  const sat = chart.planets.Saturn;
  if (sat.house === 1)
    out.push({ severity: 'caution', text: `Saturn is in the 1st house${sat.retrograde ? ' and retrograde' : ''} — "the matter seldom comes to good."` });
  // 6. Saturn (or a malefic) in the 7th — reflects on the astrologer
  if (sat.house === 7)
    out.push({ severity: 'caution', text: 'Saturn is in the 7th house — Lilly warns this "corrupts the judgement of the Astrologer"; judge with humility.' });

  // 7. Lord of the Ascendant combust
  const lord = chart.planets[lordAsc];
  if (lord) {
    const fromSun = Math.min(norm360(lord.lon - chart.planets.Sun.lon), norm360(chart.planets.Sun.lon - lord.lon));
    if (fromSun <= 8.5 && lordAsc !== 'Sun')
      out.push({ severity: 'caution', text: `The Lord of the Ascendant (${lordAsc}) is combust — "neither will the question take, nor the querent be regulated."` });
  }

  // 8. Radicality: Lord of the hour and Lord of the Ascendant agree
  if (planetaryHourRuler) {
    const agree = planetaryHourRuler === lordAsc || sameTriplicity(planetaryHourRuler, lordAsc);
    out.push({ severity: agree ? 'good' : 'note',
      text: agree
        ? `Radical: the Lord of the Hour (${planetaryHourRuler}) agrees with the Lord of the Ascendant (${lordAsc}) — a sign the figure is fit to judge.`
        : `The Lord of the Hour (${planetaryHourRuler}) and Lord of the Ascendant (${lordAsc}) are not of one triplicity or nature — a weaker testimony of radicality.` });
  }

  if (!out.some(o => o.severity === 'caution'))
    out.unshift({ severity: 'good', text: 'No strong considerations stand against judging this figure.' });
  return { lordAsc, advisories: out };
}

// crude triplicity-agreement test for the radicality consideration
const TRIP = {
  Fire: ['Sun', 'Jupiter'], Earth: ['Venus', 'Moon'], Air: ['Saturn', 'Mercury'], Water: ['Mars']
};
function sameTriplicity(a, b) {
  return Object.values(TRIP).some(set => set.includes(a) && set.includes(b));
}
