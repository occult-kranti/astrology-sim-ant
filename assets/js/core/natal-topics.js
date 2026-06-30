// ============================================================================
//  natal-topics.js — Lilly's Book III, read house by house. For a nativity it
//  judges each of the twelve topics (life & temperament, wealth, siblings,
//  parents & land, children, sickness & servants, marriage, death, religion &
//  travel, honour & profession, friends, enemies) from THREE testimonies the
//  tradition weighs together:
//    1. the LORD of the house (its sign on the cusp) and that lord's condition;
//    2. the NATURAL SIGNIFICATOR of the topic (e.g. Venus for marriage) and its
//       condition;
//    3. the PLANETS occupying the house (benefic strengthens, malefic afflicts).
//  These reduce to a favourable / mixed / afflicted tone, with the cited rule.
//
//  HONEST FRAMING: this reproduces Lilly's judgement *procedure* for study. It
//  is a historical, pseudoscientific method with no demonstrated validity, and
//  is described, never prescribed. The tone is a crude weighing of testimonies —
//  not a prediction about a person's life.
//
//  PURE — no DOM. Composes dignities.js + the chart; nothing is re-derived.
// ============================================================================
import { signOf, formatLon, PLANET_GLYPHS } from './astro.js';
import { essentialDignity, accidentalDignity } from './dignities.js';
import { DOMICILE } from './data/dignities-data.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const BENEFIC = new Set(['Jupiter', 'Venus']);
const MALEFIC = new Set(['Mars', 'Saturn']);
const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'));

// The twelve topics, their natural significators and Lilly's headline rule.
// Citations are to Christian Astrology Book III, by topic.
export const NATAL_TOPICS = [
  { house: 1, label: 'Life, body & temperament', natural: ['Sun', 'Moon'],
    rule: 'The Ascendant, its lord, the Moon and the planets in the 1st show the body, health and complexion of the native; a strong, free lord of the 1st gives vitality.',
    cite: 'Lilly CA Bk III — of the body & life.' },
  { house: 2, label: 'Wealth & estate', natural: ['Jupiter'],
    rule: 'The 2nd, its lord, the planets there, the Part of Fortune and Jupiter (natural significator of substance) show riches or want. A fortunate, well-aspected lord of the 2nd promises estate.',
    cite: 'Lilly CA Bk III — of riches.' },
  { house: 3, label: 'Brethren, kindred & short journeys', natural: ['Mercury', 'Mars'],
    rule: 'The 3rd and its lord judge brethren, neighbours and short removings; benefics there or aspecting the lord show concord, malefics discord.',
    cite: 'Lilly CA Bk III — of brethren.' },
  { house: 4, label: 'Parents, land & inheritance', natural: ['Saturn', 'Sun'],
    rule: 'The 4th, its lord and Saturn (and the Sun by day) signify the father, lands and patrimony, and the END of matters; a strong 4th gives inheritance and a good estate of ground.',
    cite: 'Lilly CA Bk III — of the father & lands.' },
  { house: 5, label: 'Children & pleasure', natural: ['Jupiter', 'Venus'],
    rule: 'The 5th, its lord, Jupiter and Venus, and fruitful signs on the cusp, show issue; barren signs and afflicting malefics deny or endanger children.',
    cite: 'Lilly CA Bk III — of children.' },
  { house: 6, label: 'Sickness, servants & small cattle', natural: ['Mars', 'Saturn'],
    rule: 'The 6th and its lord show diseases, their cause and the native’s servants; malefics here or afflicting the lord of the 1st threaten infirmity.',
    cite: 'Lilly CA Bk III — of sickness & servants.' },
  { house: 7, label: 'Marriage & partners', natural: ['Venus', 'Mars'],
    rule: 'The 7th, its lord, Venus (the wife/marriage) and Mars (the husband) judge marriage and partnership; reception and good aspect between the lords of the 1st and 7th promise concord.',
    cite: 'Lilly CA Bk III — of marriage.' },
  { house: 8, label: 'Death, dowry & legacies', natural: ['Saturn'],
    rule: 'The 8th, its lord and Saturn show the kind of death, the partner’s substance and legacies; this is a contested, grave topic — read it soberly, never as a fixed sentence.',
    cite: 'Lilly CA Bk III — of death.' },
  { house: 9, label: 'Religion, learning & long journeys', natural: ['Jupiter'],
    rule: 'The 9th, its lord and Jupiter show religion, the mind’s higher learning, voyages and dreams; a strong 9th gives devotion and success in far travel.',
    cite: 'Lilly CA Bk III — of journeys & religion.' },
  { house: 10, label: 'Honour, office & profession', natural: ['Sun', 'Jupiter', 'Mars'],
    rule: 'The 10th, its lord, the Sun, Jupiter and the Part of Spirit show honour, magistracy and the trade the native is fit for; the planet near the MC or rising before the Sun often shows the profession.',
    cite: 'Lilly CA Bk III — of magistracy & profession.' },
  { house: 11, label: 'Friends & hopes', natural: ['Jupiter'],
    rule: 'The 11th, its lord, Jupiter and the Part of Fortune show friends, the favour of the great and whether the native’s hopes are attained.',
    cite: 'Lilly CA Bk III — of friends & hopes.' },
  { house: 12, label: 'Enemies, prisons & self-undoing', natural: ['Saturn'],
    rule: 'The 12th, its lord and Saturn show secret enemies, imprisonment, great cattle and self-undoing; malefics here, ill-aspecting the 1st, threaten private harm.',
    cite: 'Lilly CA Bk III — of private enemies.' },
];

function conditionOf(chart, planet) {
  const p = chart.planets[planet];
  if (!p) return null;
  const ed = essentialDignity(planet, p.lon, chart.isDay);
  const ad = accidentalDignity(planet, chart);
  const combust = ad.rows.some(r => r.kind === 'Combust');
  const cazimi = ad.rows.some(r => /Cazimi/.test(r.kind));
  const dignities = ed.rows.filter(r => r.score > 0).map(r => r.kind);
  const debilities = ed.rows.filter(r => r.score < 0).map(r => r.kind);
  return {
    planet, glyph: PLANET_GLYPHS[planet] || '', label: formatLon(p.lon),
    house: p.house, retrograde: !!p.retrograde, combust, cazimi,
    essential: ed.total, accidental: ad.total, peregrine: ed.peregrine,
    dignities, debilities,
  };
}

// Read one topic.
function readTopic(chart, topic) {
  const cuspLon = chart.cusps[topic.house];
  const sign = signOf(cuspLon);
  const ruler = DOMICILE[sign.index];
  const rulerCond = conditionOf(chart, ruler);
  const naturalConds = topic.natural.map(n => conditionOf(chart, n)).filter(Boolean);
  const occupants = PLANETS7
    .filter(p => chart.planets[p] && chart.planets[p].house === topic.house)
    .map(p => conditionOf(chart, p));

  // Weigh the testimonies into a tone.
  let fav = 0, aff = 0;
  if (rulerCond) {
    if (rulerCond.essential > 0) fav++; else if (rulerCond.essential < 0) aff++;
    if (rulerCond.accidental > 0) fav++; else if (rulerCond.accidental < 0) aff++;
    if (rulerCond.retrograde) aff++;
    if (rulerCond.combust) aff++;
    if ([6, 8, 12].includes(rulerCond.house)) aff++;          // lord in a "dark" house
    if ([1, 10, 7, 4].includes(rulerCond.house)) fav++;        // lord angular
  }
  for (const nc of naturalConds) {
    if (nc.essential > 0 && nc.accidental >= 0) fav++;
    if (nc.essential < 0 || nc.retrograde || nc.combust) aff++;
  }
  for (const oc of occupants) {
    if (BENEFIC.has(oc.planet)) fav++;
    if (MALEFIC.has(oc.planet) && oc.essential <= 0) aff++;     // an afflicted malefic in the house
  }
  const tone = fav >= aff + 2 ? 'favourable' : aff >= fav + 2 ? 'afflicted' : 'mixed';

  // Build cited reading lines.
  const lines = [];
  lines.push(`The ${ord(topic.house)} house has ${sign.glyph} ${sign.name} on the cusp, ruled by ${rulerCond.glyph} ${ruler}.`);
  lines.push(`Its lord ${ruler} is ${rulerCond.label} in the ${ord(rulerCond.house)} house` +
    `${rulerCond.retrograde ? ', retrograde' : ''}${rulerCond.combust ? ', combust' : ''}` +
    ` (essential ${sgn(rulerCond.essential)}, accidental ${sgn(rulerCond.accidental)}` +
    `${rulerCond.peregrine ? ', peregrine' : ''}${rulerCond.dignities.length ? '; ' + rulerCond.dignities.join(', ').toLowerCase() : ''}).`);
  if (naturalConds.length) {
    lines.push('Natural significator' + (naturalConds.length > 1 ? 's' : '') + ': ' +
      naturalConds.map(nc => `${nc.glyph} ${nc.planet} (${nc.label}, ess. ${sgn(nc.essential)}${nc.combust ? ', combust' : ''}${nc.retrograde ? ', ℞' : ''})`).join('; ') + '.');
  }
  lines.push(occupants.length
    ? 'In the house: ' + occupants.map(oc => `${oc.glyph} ${oc.planet} (ess. ${sgn(oc.essential)})`).join(', ') + '.'
    : 'No planet occupies the house.');
  lines.push(topic.rule);

  return {
    house: topic.house, label: topic.label,
    sign: sign.name, signGlyph: sign.glyph,
    ruler, rulerGlyph: rulerCond.glyph, ruler_condition: rulerCond,
    naturalSignificators: naturalConds, occupants,
    tone, lines, cite: topic.cite,
  };
}

const sgn = n => (n >= 0 ? '+' : '') + n;

// ---------------------------------------------------------------------------
//  natalTopicReading(chart) — read all twelve topics.
// ---------------------------------------------------------------------------
export function natalTopicReading(chart) {
  return {
    topics: NATAL_TOPICS.map(t => readTopic(chart, t)),
    caveat: 'Each topic weighs three testimonies (the house lord, the natural significator, and the planets in the house) into a crude favourable / mixed / afflicted tone. This is Lilly’s Book III procedure, shown for study — a historical, pseudoscientific method with no demonstrated validity, described never prescribed.',
    citation: 'Lilly, Christian Astrology, Book III — the judgement of nativities, house by house.',
  };
}
