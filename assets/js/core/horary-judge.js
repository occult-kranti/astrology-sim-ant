// ============================================================================
//  horary-judge.js — a house-by-house horary JUDGEMENT reader, after Lilly's
//  Christian Astrology Book II. Given a figure and the house the question falls
//  under, it identifies the querent's and quesited's significators, weighs their
//  condition, finds how (or whether) the matter perfects between them — direct
//  aspect, translation, collection, reception, prohibition, refranation — reads
//  the Moon as co-significator, brings in the topic's natural significator, and
//  reduces it to an affirmed / qualified / denied tone with the cited rule.
//
//  It powers (a) Lilly's own worked charts (read from their printed figures via
//  chart-from-positions.js) and (b) a deeper house-aware judgement in the tools.
//
//  HONEST FRAMING: this reproduces Lilly's *procedure* for study. Horary has no
//  demonstrated validity; the tone is a structured weighing of testimonies, not
//  a prediction. Described, never prescribed.
//
//  PURE — no DOM. Composes perfection.js + aspects.js + dignities.js.
// ============================================================================
import { signOf, formatLon, PLANET_GLYPHS, norm360, antiscion, contraAntiscion } from './astro.js';
import { essentialDignity, accidentalDignity, dignityRulersAt } from './dignities.js';
import { aspectBetween } from './aspects.js';
import { modesOfPerfection, timeToPerfection } from './perfection.js';
import { DOMICILE } from './data/dignities-data.js';
import { HOUSES } from './data/houses.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'));
const sgn = n => (n >= 0 ? '+' : '') + n;

// Per-topic natural significators + the SENSE of perfection for that house, and
// Lilly's Book II note. `perfectionSense`:
//   'affirms'  — perfection of L1↔Lx brings the matter to pass (most questions);
//   'contact'  — perfection only joins the parties; who prevails turns on strength
//                (contests, lawsuits, open enemies, theft — the 7th's hard side);
//   'inverted' — perfection of L1↔Lx is the DISEASE/peril joining the querent, so
//                it argues AGAINST recovery (sickness 6th, death 8th, prison 12th).
export const HORARY_TOPICS = {
  1: { natural: [], perfectionSense: 'affirms',
    note: 'The querent themselves — the lord of the 1st, the Ascendant and the Moon show the querent’s body, mind and state.',
    cite: 'Lilly CA Bk II — the querent.' },
  2: { natural: ['Jupiter'], perfectionSense: 'affirms',
    note: 'Money and movable goods: the lord of the 2nd, the planets there, the Part of Fortune and the Moon. Perfection between the lords of the 1st and 2nd, or the Moon translating to the lord of the 2nd, promises the money.',
    cite: 'Lilly CA Bk II — of money lent or to be gained.' },
  3: { natural: ['Mercury'], perfectionSense: 'affirms',
    note: 'Brethren, neighbours, short journeys and rumours: the lord of the 3rd and the Moon. A good aspect with reception affirms concord or a safe journey; a rumour is true if the significators are fixed and well-placed.',
    cite: 'Lilly CA Bk II — of brethren, journeys & rumours.' },
  4: { natural: ['Saturn'], perfectionSense: 'affirms',
    note: 'Fathers, lands, houses and the END of any matter; in lost-property questions the 4th shows the place a thing is hidden. The lord of the 4th and the Moon carry the judgement.',
    cite: 'Lilly CA Bk II — of lands, houses & things hidden.' },
  5: { natural: ['Jupiter', 'Venus'], perfectionSense: 'affirms',
    note: 'Children, pregnancy and pleasures: the lord of the 5th, Jupiter, Venus and the Moon, with fruitful signs on the angles. Perfection promises issue; barren signs and afflicting malefics deny it.',
    cite: 'Lilly CA Bk II — of children & pregnancy.' },
  6: { natural: ['Mars', 'Saturn'], perfectionSense: 'inverted',
    note: 'Sickness and servants: the 1st & its lord (the sick), the 6th & its lord (the disease), the Moon, and the 8th (death). Here a strong, free lord of the 1st and the Moon applying to a benefic argue RECOVERY; the lord of the 6th overcoming the lord of the 1st, or the Moon falling to the lord of the 8th, argues danger.',
    cite: 'Lilly CA Bk II — of sickness (the decumbiture).' },
  7: { natural: ['Venus', 'Mars'], perfectionSense: 'contact',
    note: 'Marriage, love, lawsuits, open enemies, theft and war: the lords of the 1st and 7th, with Venus/Mars and the Moon. For MARRIAGE & love, perfection with reception affirms; for a CONTEST (lawsuit, enemy, battle) perfection only joins the parties — the STRONGER significator, better placed and aspecting the angles, prevails.',
    cite: 'Lilly CA Bk II — of marriage, contention, theft & war.' },
  8: { natural: ['Saturn'], perfectionSense: 'inverted',
    note: 'Death, dowry, legacies and the partner’s estate: the lord of the 8th, Saturn and the Moon. Read this topic soberly; the engine reports the testimonies, not a sentence of death.',
    cite: 'Lilly CA Bk II — of death & legacies.' },
  9: { natural: ['Jupiter'], perfectionSense: 'affirms',
    note: 'Long voyages, religion, learning and dreams: the lord of the 9th, Jupiter and the Moon. Perfection and good aspect promise a prosperous voyage or a true dream.',
    cite: 'Lilly CA Bk II — of voyages, religion & dreams.' },
  10: { natural: ['Sun', 'Jupiter'], perfectionSense: 'affirms',
    note: 'Honour, office, preferment and trade: the lord of the 10th, the Sun, Jupiter and the Moon. Perfection between the lords of the 1st and 10th, with the significators strong and angular, promises the office.',
    cite: 'Lilly CA Bk II — of preferment & office.' },
  11: { natural: ['Jupiter'], perfectionSense: 'affirms',
    note: 'Friends and the thing hoped for: the lord of the 11th, Jupiter, the Part of Fortune and the Moon. Perfection promises the hope is attained.',
    cite: 'Lilly CA Bk II — of hopes & friends.' },
  12: { natural: ['Saturn'], perfectionSense: 'inverted',
    note: 'Secret enemies, imprisonment, great cattle and self-undoing: the lord of the 12th, Saturn and the Moon. Perfection of the lord of the 12th with the lord of the 1st argues the private harm takes hold; the lord of the 1st strong and free argues escape.',
    cite: 'Lilly CA Bk II — of imprisonment & secret enemies.' },
};

function conditionOf(chart, planet) {
  const p = chart.planets[planet];
  if (!p) return null;
  const ed = essentialDignity(planet, p.lon, chart.isDay);
  const ad = accidentalDignity(planet, chart);
  return {
    planet, glyph: PLANET_GLYPHS[planet] || '', label: formatLon(p.lon), lon: p.lon,
    house: p.house, retrograde: !!p.retrograde,
    combust: ad.rows.some(r => r.kind === 'Combust'),
    essential: ed.total, accidental: ad.total, peregrine: ed.peregrine,
  };
}

// The Moon's next applying Ptolemaic aspect among the seven (void if none).
function moonNext(chart) {
  const moon = chart.planets.Moon;
  let best = null;
  for (const name of PLANETS7) {
    if (name === 'Moon') continue;
    const a = aspectBetween('Moon', moon, name, chart.planets[name]);
    if (a && a.applying && (!best || a.orb < best.orb)) best = { to: name, aspect: a.aspect, glyph: a.glyph, orb: a.orb, nature: a.nature };
  }
  return best;
}

// ---------------------------------------------------------------------------
//  horaryJudgement(chart, quesitedHouse, opts)
// ---------------------------------------------------------------------------
export function horaryJudgement(chart, quesitedHouse, opts = {}) {
  const querentHouse = opts.querentHouse || 1;
  const isDay = chart.isDay;
  const baseTopic = HORARY_TOPICS[quesitedHouse] || { natural: [], perfectionSense: 'affirms', note: '', cite: 'Lilly CA Bk II.' };
  // A house can host different question-types (the 6th is sickness AND lost
  // beasts/servants; the 7th is marriage AND lawsuits). `opts.sense` lets the
  // caller pick the right reading-sense when it differs from the default.
  const topic = opts.sense ? { ...baseTopic, perfectionSense: opts.sense } : baseTopic;

  const lordAsc = DOMICILE[signOf(chart.cusps[querentHouse]).index];
  const lordQ = DOMICILE[signOf(chart.cusps[quesitedHouse]).index];
  const shared = lordAsc === lordQ;

  const querent = conditionOf(chart, lordAsc);
  const quesited = conditionOf(chart, lordQ);

  // perfection between the significators
  const modes = shared ? {} : modesOfPerfection(chart, lordAsc, lordQ, l => dignityRulersAt(l, isDay));
  let timing = null;
  if (modes.direct && modes.direct.applying && querent) timing = timeToPerfection(modes.direct.orb, querent.lon, querent.house);

  // antiscia — a hidden contact when one significator sits on the other's
  // antiscion (acts like a conjunction) or contra-antiscion (like an opposition).
  // Lilly judges by these; the engine now weaves them into the search.
  const angDist = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  const ANT_ORB = 1.5;
  const antisciaContacts = [];
  if (!shared && querent && quesited) {
    if (angDist(querent.lon, antiscion(quesited.lon)) <= ANT_ORB) antisciaContacts.push({ kind: 'antiscion', note: 'a hidden conjunction (equal declination)' });
    if (angDist(querent.lon, contraAntiscion(quesited.lon)) <= ANT_ORB) antisciaContacts.push({ kind: 'contra-antiscion', note: 'a hidden opposition' });
  }

  // the Moon co-significator
  const moon = chart.planets.Moon;
  const mn = moonNext(chart);
  const moonInfo = {
    label: formatLon(moon.lon), sign: signOf(moon.lon).name, house: moon.house,
    voidOfCourse: !mn, nextAspect: mn,
  };

  // natural significators of the topic and how they touch the principals
  const naturalSignificators = (topic.natural || []).map(n => {
    const c = conditionOf(chart, n);
    if (!c) return null;
    const aL1 = lordAsc !== n ? aspectBetween(n, chart.planets[n], lordAsc, chart.planets[lordAsc]) : null;
    const aLx = lordQ !== n ? aspectBetween(n, chart.planets[n], lordQ, chart.planets[lordQ]) : null;
    return { ...c, touchesQuerent: !!aL1, touchesQuesited: !!aLx };
  }).filter(Boolean);

  // --- weigh a tone --------------------------------------------------------
  const perfects = shared || !!(modes.direct && modes.direct.applying) || !!modes.translation || !!modes.collection
    || antisciaContacts.some(c => c.kind === 'antiscion');
  const moonCarries = mn && (mn.to === lordQ || mn.to === lordAsc);
  const blocked = !!modes.prohibition || !!modes.refranation;
  const moonVoid = moonInfo.voidOfCourse;

  let tone, toneText;
  if (topic.perfectionSense === 'inverted') {
    // sickness / death / prison: perfection of L1↔Lx is the peril joining the querent
    const querentStrong = querent && (querent.essential >= 0 && !querent.retrograde && !querent.combust);
    if (perfects && !querentStrong) { tone = 'denied'; toneText = 'The affliction applies to join the querent’s significator while it is weak — the tradition reads this as danger, not relief.'; }
    else if (querentStrong && !perfects && !moonVoid) { tone = 'affirmed'; toneText = 'The querent’s significator is strong and free and the affliction does not perfect upon it — the tradition reads escape or recovery.'; }
    else { tone = 'qualified'; toneText = 'The testimonies are mixed — weigh the strength of the lord of the 1st and the Moon against the afflicting significator.'; }
  } else if (topic.perfectionSense === 'contact') {
    // contest: who is stronger and better placed prevails
    const qScore = (querent ? querent.essential + querent.accidental : 0);
    const xScore = (quesited ? quesited.essential + quesited.accidental : 0);
    if (!perfects && !moonCarries) { tone = 'qualified'; toneText = 'The significators make no perfecting contact within orb — the matter hangs; read the Moon and any translation of light.'; }
    else if (qScore >= xScore + 3) { tone = 'affirmed'; toneText = 'The parties come to contact and the querent’s significator is the stronger and better placed — the tradition gives the querent the advantage.'; }
    else if (xScore >= qScore + 3) { tone = 'denied'; toneText = 'The parties come to contact but the quesited’s significator is the stronger — the tradition gives the advantage to the other side.'; }
    else { tone = 'qualified'; toneText = 'The parties come to contact but the significators are near-equal in strength — the outcome is close; weigh reception and the angles.'; }
  } else {
    // ordinary affirmative question
    if (blocked) { tone = 'denied'; toneText = modes.prohibition ? 'A third planet perfects first — prohibition cuts the matter off.' : 'A significator refranates (turns retrograde before perfecting) — the matter comes undone.'; }
    else if (perfects || moonCarries) { tone = 'affirmed'; toneText = shared ? 'Querent and quesited share one significator — a strong, often affirmative testimony.' : 'The significators perfect (by aspect, translation, collection, or the Moon carrying the light) — the tradition reads the matter brought to pass.'; }
    else if (moonVoid) { tone = 'denied'; toneText = 'No perfection within orb and the Moon is void of course — “nothing will come of the matter.”'; }
    else { tone = 'qualified'; toneText = 'No direct perfection within orb, but the matter is not cut off — look to reception, the Moon’s next application, and translation of light.'; }
  }
  if (modes.reception && tone === 'qualified') toneText += ' Reception between the significators eases the matter.';

  // --- cited lines ---------------------------------------------------------
  const lines = [];
  lines.push(`Querent — the lord of the ${ord(querentHouse)} is ${querent.glyph} ${lordAsc} at ${querent.label} in the ${ord(querent.house)} house (essential ${sgn(querent.essential)}, accidental ${sgn(querent.accidental)}${querent.retrograde ? ', ℞' : ''}${querent.combust ? ', combust' : ''}), with the Moon as co-significator.`);
  if (shared) {
    lines.push(`The quesited (${ord(quesitedHouse)} house) is ruled by the SAME planet, ${lordQ} — querent and matter share one significator.`);
  } else {
    lines.push(`Quesited — the ${ord(quesitedHouse)} house (${(HOUSES[quesitedHouse - 1].signifies || '').split(';')[0]}) is ruled by ${quesited.glyph} ${lordQ} at ${quesited.label} in the ${ord(quesited.house)} house (essential ${sgn(quesited.essential)}, accidental ${sgn(quesited.accidental)}${quesited.retrograde ? ', ℞' : ''}${quesited.combust ? ', combust' : ''}).`);
  }
  if (modes.direct) lines.push(`Direct ${modes.direct.aspect.toLowerCase()} of the significators — ${modes.direct.applying ? 'applying' : 'separating'} (orb ${modes.direct.orb.toFixed(1)}°).`);
  if (modes.translation) lines.push(`Translation of light: ${modes.translation.carrier} carries the light from ${modes.translation.from} to ${modes.translation.to}.`);
  if (modes.collection) lines.push(`Collection of light: ${modes.collection.collector} collects both significators${modes.collection.received ? ', receiving them' : ''}.`);
  if (modes.reception) lines.push(`Reception: ${modes.reception.mutual ? 'mutual' : 'one-way'} reception between the significators.`);
  if (modes.prohibition) lines.push(`Prohibition: ${modes.prohibition.planet} perfects with ${modes.prohibition.target} first.`);
  if (modes.refranation) lines.push(`Refranation: ${modes.refranation.planet} turns retrograde before perfecting.`);
  for (const c of antisciaContacts) lines.push(`Antiscia: the querent's significator sits on the quesited's ${c.kind} — ${c.note}, a hidden contact Lilly weighs.`);
  lines.push(moonInfo.voidOfCourse
    ? 'The Moon is void of course — she makes no further applying aspect before leaving her sign.'
    : `The Moon next applies to a ${mn.aspect.toLowerCase()} of ${mn.to} (orb ${mn.orb.toFixed(1)}°).`);
  if (timing) lines.push(`Timing: ${timing.text} (Lilly proportions a mean — an estimate).`);

  return {
    querentHouse, quesitedHouse, topic: HOUSES[quesitedHouse - 1].signifies.split(';')[0],
    querent, quesited, sharedSignificator: shared,
    moon: moonInfo, perfection: { modes, timing }, reception: modes.reception || null,
    antiscia: antisciaContacts,
    naturalSignificators, tone, toneText,
    note: topic.note, cite: topic.cite,
    lines,
  };
}
