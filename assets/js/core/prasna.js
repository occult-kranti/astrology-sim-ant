// ============================================================================
//  prasna.js — PRAŚNA (Indian horary): judge a question from the sidereal
//  chart of the moment it is asked. PURE — no DOM, no network, no randomness.
//
//  The engine consumes a castVedic() result (Lahiri sidereal, whole-sign
//  bhāvas) and applies the VERIFIED ruleset of the Ṣaṭpañcāśikā of Pṛthuyaśas,
//  the Daivajña Vallabha and the Praśna Mārga (see ./data/prasna-data.js for
//  every citation and every stored discrepancy): the Bṛhat Jātaka II.5
//  benefic/malefic classification, the lagna master rule (with the śīrṣodaya
//  clause restored), the kendra/trikoṇa configuration WITH its exclusion
//  clause (malefics must be clear of the angles and the 8th), the Moon's-house
//  verdict, bhāva fortification of the quesited, the lagna-lord and
//  quesited-lord condition, the retrograde-7th-lord return rule, and the
//  corrected lost-item rule (full Moon IN THE LAGNA, not "a strong Moon").
//
//  The praśna chart is judged exactly as a nativity (Praśna Mārga I.47), from
//  the lagna itself — the Ṣaṭpañcāśikā mode; the ārūḍha (PM II.7–11) is
//  computable ONLY from a supplied physical direction and is never inferred.
//  The optional KP horary number (1–249, KP Reader VI) fixes the lagna from
//  the querent's chosen sub-arc via ./kp.js.
//
//  HONEST FRAMING (locked): a historical symbolic grammar with no demonstrated
//  predictive validity — every testimony carries its citation; the layers the
//  texts demand that no engine can compute (omens, breath, betel leaves, the
//  diviner's steady mind) are declared out of scope, not silently dropped.
// ============================================================================
import { RASHIS, SPECIAL_ASPECTS, nakshatraOf } from './data/vedic-data.js';
import { kpForNumber } from './kp.js';
import {
  CLASSIFICATION, SHIRSHODAYA, PRISHTODAYA, UBHAYODAYA, SHIRSHODAYA_CITE,
  KENDRAS, TRIKONAS, MALEFIC_GOOD_HOUSES,
  MOON_FAVOURABLE_HOUSES, MOON_ADVERSE_HOUSES, MOON_HOUSE_CITE, MOON_8TH_FLAG,
  QUESITED_HOUSES, QUESITED_CITE, ARUDHA_DIRECTIONS, ARUDHA_CITE, ARUDHA_FLAGS,
  OUT_OF_SCOPE, EDITION_FLAGS, PRASNA_CAVEAT, PRASNA_SOURCES,
} from './data/prasna-data.js';

const norm360 = x => ((x % 360) + 360) % 360;
const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// ---------------------------------------------------------------------------
//  classifyGrahas(vedicChart) — Bṛhat Jātaka II.5 (as verified): malefics are
//  the waning Moon, the Sun, Mars, Saturn, and Mercury when joined (same rāśi)
//  with any of these; benefics are Jupiter, Venus, the waxing Moon and
//  unafflicted Mercury (benefic list from the translator notes — flagged).
//  Rāhu/Ketu are malefic only under the flagged Phaladīpikā extension, kept in
//  a separate list so the source layering is never merged.
// ---------------------------------------------------------------------------
export function classifyGrahas(vedicChart) {
  const g = vedicChart.grahas;
  const elongation = norm360(g.Moon.lon - g.Sun.lon);
  const waxing = elongation < 180; // Śukla pakṣa (see CLASSIFICATION.flags for Sastri's stored variant)
  const coreMalefics = ['Sun', 'Mars', 'Saturn'].concat(waxing ? [] : ['Moon']);
  const mercuryAfflicted = coreMalefics.some(m => g[m] && g[m].rashiIndex === g.Mercury.rashiIndex);
  const malefics = coreMalefics.concat(mercuryAfflicted ? ['Mercury'] : []);
  const benefics = ['Jupiter', 'Venus'].concat(waxing ? ['Moon'] : []).concat(mercuryAfflicted ? [] : ['Mercury']);
  return {
    waxing, paksha: waxing ? 'Śukla (waxing)' : 'Kṛṣṇa (waning)', elongation,
    mercuryAfflicted, benefics, malefics,
    maleficsWithNodes: malefics.concat(['Rahu', 'Ketu']),
    cite: CLASSIFICATION.cite, nodesCite: CLASSIFICATION.nodesCite, flags: CLASSIFICATION.flags,
  };
}

// ---------------------------------------------------------------------------
//  arudhaFromDirection(direction) — PM II.7–11: the sign(s) of the compass
//  direction the querent faces. An external physical datum: null when no
//  direction is supplied — NEVER inferred from the chart.
// ---------------------------------------------------------------------------
export function arudhaFromDirection(direction) {
  if (!direction) return null;
  const key = String(direction).trim().toLowerCase();
  const idxs = ARUDHA_DIRECTIONS[key];
  if (!idxs) return null;
  return {
    direction: key,
    rashis: idxs.map(i => RASHIS[i].name),
    rashiIndexes: idxs.slice(),
    cite: ARUDHA_CITE,
    note: 'Houses are reckoned from the ārūḍha or the lagna, whichever is stronger (PM IX.29). ' + ARUDHA_FLAGS[0],
    flags: ARUDHA_FLAGS,
  };
}

// whole-sign graha dṛṣṭi: does `planet` aspect the given rāśi? All grahas
// aspect the 7th from themselves; Mars adds 4/8, Jupiter 5/9, Saturn 3/10
// (BPHS special aspects, from the Vedic wing's own data). Rāhu/Ketu cast no
// dṛṣṭi here (their aspects are themselves a contested layer — flagged).
function aspectsRashi(vedicChart, planet, targetRashiIndex) {
  const g = vedicChart.grahas[planet];
  if (!g || planet === 'Rahu' || planet === 'Ketu') return false;
  const dist = ((targetRashiIndex - g.rashiIndex + 12) % 12) + 1;
  return dist === 7 || !!(SPECIAL_ASPECTS[planet] && SPECIAL_ASPECTS[planet].includes(dist));
}

// ---------------------------------------------------------------------------
//  prasnaJudgement(vedicChart, opts)
//  opts: { quesitedHouse = 7, question = '', kpNumber = null, direction = null }
//  → { question, quesitedHouse, quesited, lagna, moon, classification, arudha,
//      kpNumber, testimonies:[{rule, verdict:'for'|'against'|'neutral',
//      detail, cite}], counts, leaning:'favourable'|'unfavourable'|'mixed',
//      caveat, outOfScope, editionFlags, citations }
// ---------------------------------------------------------------------------
export function prasnaJudgement(vedicChart, opts = {}) {
  const v = vedicChart;
  const question = opts.question || '';
  let qh = Math.round(Number(opts.quesitedHouse));
  if (!Number.isFinite(qh) || qh < 1 || qh > 12) qh = 7;

  // the lagna — optionally fixed by the KP horary number (KP Reader VI)
  let lagnaLon = v.lagna.lon, kpNumber = null, kpEntry = null;
  if (opts.kpNumber != null && opts.kpNumber !== '') {
    const k = kpForNumber(opts.kpNumber);
    if (k) { lagnaLon = k.ascLon; kpNumber = k.number; kpEntry = k.entry; }
  }
  const lagnaIdx = Math.floor(norm360(lagnaLon) / 30);
  const lagnaSign = RASHIS[lagnaIdx];
  const houseOf = p => ((v.grahas[p].rashiIndex - lagnaIdx + 12) % 12) + 1;

  const cls = classifyGrahas(v);
  const T = [];
  const add = (rule, verdict, detail, cite) => T.push({ rule, verdict, detail, cite });

  // --- 1 · the lagna master rule (ṢPŚ I.4; DV II.19/20) ---------------------
  const inLagnaB = cls.benefics.filter(p => houseOf(p) === 1);
  const inLagnaM = cls.maleficsWithNodes.filter(p => houseOf(p) === 1);
  if (inLagnaB.length) add('Benefic in the lagna', 'for',
    `${inLagnaB.join(', ')} in the rising sign — "when a saumya graha occupies the lagna… there will be success".`,
    'Ṣaṭpañcāśikā I.4; Daivajña Vallabha II.19/20 (dual-numbered in the archive trans.).');
  if (inLagnaM.length) add('Malefic in the lagna', 'against',
    `${inLagnaM.join(', ')} in the rising sign — the failure clause of the master rule.` +
    (inLagnaM.some(p => p === 'Rahu' || p === 'Ketu') ? ' (Rāhu/Ketu counted malefic only under the flagged Phaladīpikā extension.)' : '') +
    ' Contest questions invert this: a malefic in the praśna lagna gives victory to the QUERENT, in the 7th to the opponent (Prasna Bhūṣaṇa).',
    'Ṣaṭpañcāśikā I.4; Prasna Bhūṣaṇa (via Rangacharya, Saptarishis); nodes per Phaladīpikā — flagged layering.');
  if (!inLagnaB.length && !inLagnaM.length) add('The lagna is empty', 'neutral',
    'No graha in the rising sign; the master rule then leans on the rising sign’s class (śīrṣodaya, below) and the bhāva testimony.',
    'Ṣaṭpañcāśikā I.4.');

  // --- 2 · śīrṣodaya rising (the clause most summaries drop) ----------------
  if (SHIRSHODAYA.includes(lagnaSign.name)) add('Śīrṣodaya sign rising', 'for',
    `${lagnaSign.name} (${lagnaSign.sanskrit}) rises by the head — itself a success testimony of the master rule.`,
    `Ṣaṭpañcāśikā I.4 (śīrṣodaya clause restored per verification); DV II.19/20; ${SHIRSHODAYA_CITE}`);
  else add('Rising sign class', 'neutral',
    `${lagnaSign.name} (${lagnaSign.sanskrit}) is ${UBHAYODAYA.includes(lagnaSign.name) ? 'ubhayodaya (rising both ways)' : 'pṛṣṭhodaya (back-rising)'} — the śīrṣodaya success clause does not fire; the texts do not make this alone a failure.`,
    SHIRSHODAYA_CITE);

  // --- 3 · the kendra/trikoṇa configuration (DV II.20/21 + III.3) -----------
  const kendraCite = 'Daivajña Vallabha II.20/21 (dual-numbered) incl. the exclusion clause; DV III.3 (the inverse).';
  const bInKT = cls.benefics.filter(p => KENDRAS.includes(houseOf(p)) || TRIKONAS.includes(houseOf(p)));
  const mInKendraOr8 = cls.maleficsWithNodes.filter(p => KENDRAS.includes(houseOf(p)) || houseOf(p) === 8);
  const mIn3611 = cls.maleficsWithNodes.filter(p => MALEFIC_GOOD_HOUSES.includes(houseOf(p)));
  if (bInKT.length) add('Benefics in kendras/trikoṇas', 'for',
    `${bInKT.map(p => `${p} (house ${houseOf(p)})`).join(', ')} — "all the desired objects are achieved if the benefics occupy the quadrants and the trikona houses".`, kendraCite);
  else add('No benefic in kendra or trikoṇa', 'against',
    '"If they are situated otherwise… they do not produce any gain" (DV III.3).', kendraCite);
  if (mInKendraOr8.length) add('Malefics in the angles or the 8th', 'against',
    `${mInKendraOr8.map(p => `${p} (house ${houseOf(p)})`).join(', ')} — the success configuration requires that malefics "do not occupy the angular house (1, 4, 7 & 10) and the 8th house" (the exclusion clause the shorter quotations truncate).`, kendraCite);
  else if (mIn3611.length) add('Malefics confined to 3, 6 & 11', 'for',
    `${mIn3611.map(p => `${p} (house ${houseOf(p)})`).join(', ')} — malefics in the upacaya houses 3/6/11, clear of the angles and the 8th, complete the success configuration.`, kendraCite);

  // --- 4 · the Moon's testimony (Moon = the querent's mind) -----------------
  const moonHouse = houseOf('Moon');
  const moonRashi = v.grahas.Moon.rashiIndex;
  const moonBeneficAspects = cls.benefics.filter(p => p !== 'Moon' && aspectsRashi(v, p, moonRashi));
  const moonMaleficAspects = cls.malefics.filter(p => p !== 'Moon' && aspectsRashi(v, p, moonRashi));
  const moonAspectsHouse = ((moonHouse + 5) % 12) + 1; // the 7th from the Moon (whole-sign dṛṣṭi)
  if (moonHouse === 8) add('Moon in the 8th', 'against',
    `The Moon (the querent’s mind) occupies the 8th — "the Moon in the 8th also indicates some obstacle". ${MOON_8TH_FLAG}`,
    `Praśna Mārga XVII.15 (Raman Vol. II — marriage context, generalized by the tradition); ${MOON_HOUSE_CITE}`);
  if (MOON_FAVOURABLE_HOUSES.includes(moonHouse) && moonBeneficAspects.length)
    add('Moon well-housed & benefic-aspected', 'for',
      `Moon in house ${moonHouse} (of the favourable set 2/3/6/7/10/11) aspected by ${moonBeneficAspects.join(', ')} — DV promises good results, specifically "gains through the help of a woman" (the promised result is narrower than generic success — stored as found).`,
      MOON_HOUSE_CITE);
  if (MOON_ADVERSE_HOUSES.includes(moonHouse) && moonHouse !== 8 && moonMaleficAspects.length)
    add('Moon ill-housed & malefic-aspected', 'against',
      `Moon in house ${moonHouse} (of the adverse set 1/3/5/8/9) aspected by ${moonMaleficAspects.join(', ')} — "he will cause fear". (House 3 sits on both DV lists; the aspecting planets disambiguate.)`,
      MOON_HOUSE_CITE);
  if (moonHouse !== 8 && !(MOON_FAVOURABLE_HOUSES.includes(moonHouse) && moonBeneficAspects.length)
    && !(MOON_ADVERSE_HOUSES.includes(moonHouse) && moonMaleficAspects.length))
    add('The Moon’s place', 'neutral',
      `Moon in house ${moonHouse}, ${v.grahas.Moon.nakshatra.sanskrit} nakṣatra, aspecting house ${moonAspectsHouse} — neither DV III.2 list fires cleanly; the Moon is the querent’s mind (manas) and its nakṣatra is praśna’s own data layer.`,
      MOON_HOUSE_CITE);

  // --- 5 · bhāva fortification of the quesited (ṢPŚ I.3; DV II.2) -----------
  const fortCite = 'Ṣaṭpañcāśikā I.3 ("whichever bhāva is aspected or conjoined by its lord or by saumya grahas, its prosperity is assured… by pāpa grahas, it suffers destruction"); Daivajña Vallabha II.2 concurs.';
  const qIdx = (lagnaIdx + qh - 1) % 12;
  const qSign = RASHIS[qIdx];
  const qLord = qSign.lord;
  const qMeta = QUESITED_HOUSES[qh - 1];
  const lordSupports = v.grahas[qLord] && (v.grahas[qLord].rashiIndex === qIdx || aspectsRashi(v, qLord, qIdx));
  const bSupport = cls.benefics.filter(p => v.grahas[p].rashiIndex === qIdx || aspectsRashi(v, p, qIdx));
  const mAfflict = cls.maleficsWithNodes.filter(p => v.grahas[p].rashiIndex === qIdx || aspectsRashi(v, p, qIdx));
  if (lordSupports) add(`Quesited ${qh}th fortified by its own lord`, 'for',
    `${qLord}, lord of ${qSign.name}, ${v.grahas[qLord].rashiIndex === qIdx ? 'occupies' : 'aspects'} the quesited bhāva — its prosperity is assured.`, fortCite);
  if (bSupport.length) add(`Benefics on the quesited ${qh}th`, 'for',
    `${bSupport.join(', ')} conjoin/aspect the quesited bhāva (${qSign.name}).`, fortCite);
  if (mAfflict.length) add(`Malefics on the quesited ${qh}th`, 'against',
    `${mAfflict.join(', ')} conjoin/aspect the quesited bhāva (${qSign.name}) — the destruction clause.` +
    (mAfflict.some(p => p === 'Rahu' || p === 'Ketu') ? ' (Nodes counted under the flagged Phaladīpikā extension; they cast no dṛṣṭi here — occupation only.)' : ''), fortCite);
  if (!lordSupports && !bSupport.length && !mAfflict.length)
    add(`The quesited ${qh}th stands alone`, 'neutral',
      `No graha conjoins or aspects ${qSign.name}; the bhāva’s fate rests on its lord’s condition (below).`, fortCite);

  // --- 6 · the lagna-lord & quesited-lord condition (PM I.47) ---------------
  const condCite = 'Praśna Mārga I.47 ("As Prasna Lagna is similar to Janma Lagna, all events should be read from Prasna as you would do in a horoscope" — stanza verified); ṢPŚ I.3; BPHS dignities. A synthesis rule, so labelled.';
  const lordCondition = (planet, label) => {
    const g = v.grahas[planet];
    if (!g) return;
    const h = houseOf(planet);
    const dig = g.dignity && g.dignity.state ? g.dignity.state : 'Neutral';
    const strong = ['Exalted', 'Own sign', 'Mūlatrikoṇa'].includes(dig);
    const wellHoused = KENDRAS.includes(h) || TRIKONAS.includes(h);
    const illHoused = [6, 8, 12].includes(h);
    let verdict = 'neutral';
    if ((strong || wellHoused) && !illHoused && dig !== 'Debilitated') verdict = 'for';
    if (dig === 'Debilitated' || (illHoused && !strong)) verdict = 'against';
    add(label, verdict,
      `${planet} — ${dig.toLowerCase()} in ${g.rashi} (house ${h}${wellHoused ? ', a kendra/trikoṇa' : illHoused ? ', a duḥsthāna (6/8/12)' : ''})${g.retrograde && planet !== 'Rahu' && planet !== 'Ketu' ? ', retrograde (vakra)' : ''}.`,
      condCite);
  };
  lordCondition(lagnaSign.lord, `Lagna lord (${lagnaSign.lord}) — the querent`);
  if (qLord !== lagnaSign.lord) lordCondition(qLord, `Quesited lord (${qLord}) — the matter`);
  else add(`Quesited lord = lagna lord (${qLord})`, 'neutral',
    'The same graha signifies querent and matter — the tradition reads this as the matter lying in the querent’s own hands.', condCite);

  // --- 7 · the retrograde 7th-lord return rule (DV IV.10; IX.5) -------------
  const retroCite = 'Daivajña Vallabha IV.10 ("when the lord of the 7th house from the ascendant of query becomes retrograde, the person in exile returns"); DV IX.5 (the negative: "If the planet is not retrograde the person will not return").';
  const retroNote = 'In praśna, vakra (retrogression) of the significator reads as return/reversal of motion toward the querent. Lilly’s horary ALSO uses a retrograde significator as return in fugitive/lost-goods questions even while scoring retrogradation −5 as a debility — a difference of default emphasis, not opposition.';
  if (qh === 7) {
    const seventhLordRetro = !!(v.grahas[qLord] && v.grahas[qLord].retrograde);
    if (seventhLordRetro) add('7th lord retrograde — the absent returns', 'for',
      `${qLord}, lord of the 7th, is retrograde — the return-of-the-absent testimony (genre: return/recovery questions). ${retroNote}`, retroCite);
    else add('7th lord direct', 'neutral',
      `${qLord}, lord of the 7th, is direct — for return-of-the-absent questions DV IX.5 reads this as "the person will not return"; for other 7th-house matters it is no testimony. ${retroNote}`, retroCite);
  } else if (v.grahas[qLord] && v.grahas[qLord].retrograde && qLord !== 'Rahu' && qLord !== 'Ketu') {
    add(`Quesited lord (${qLord}) retrograde`, 'neutral',
      `The tradition generalizes vakra as return/reversal of the matter toward the querent (the text’s own case is the 7th lord — the generalization is flagged as an extension). ${retroNote}`, retroCite);
  }

  // --- 8 · recovery of the lost (ṢPŚ I.5 — the CORRECTED antecedent) --------
  const lostCite = 'Ṣaṭpañcāśikā I.5 as verified: the antecedent is the FULL Moon ("with its full 16 digits") OCCUPYING THE LAGNA and aspected by Jupiter or Venus — not merely "a strong Moon" (the shorthand refuted in verification); independent parallel DV IX.13. Second clause: a strong benefic in the 11th (Lābha) → recovery.';
  const fullMoon = v.panchanga && v.panchanga.tithi && v.panchanga.tithi.num === 15;
  const jvAspectMoon = ['Jupiter', 'Venus'].some(p => aspectsRashi(v, p, moonRashi));
  if (fullMoon && moonHouse === 1 && jvAspectMoon)
    add('Full Moon in the lagna, aspected by Jupiter/Venus', 'for',
      'The restoration-of-the-lost testimony (genre: lost/missing things) — all three verified conditions hold: Pūrṇimā Moon, in the lagna, with Jupiter or Venus aspecting.', lostCite);
  const strongBeneficIn11 = cls.benefics.filter(p => {
    const g = v.grahas[p];
    return g && houseOf(p) === 11 && g.dignity && ['Exalted', 'Own sign', 'Mūlatrikoṇa'].includes(g.dignity.state);
  });
  if (strongBeneficIn11.length)
    add('Strong benefic in the 11th (Lābha)', 'for',
      `${strongBeneficIn11.join(', ')} — dignified benefic in the house of gains: the recovery testimony (genre: lost/missing things).`, lostCite);

  // --- the leaning ------------------------------------------------------------
  const counts = {
    for: T.filter(t => t.verdict === 'for').length,
    against: T.filter(t => t.verdict === 'against').length,
    neutral: T.filter(t => t.verdict === 'neutral').length,
  };
  const leaning = counts.for > counts.against ? 'favourable'
    : counts.against > counts.for ? 'unfavourable' : 'mixed';

  return {
    question, quesitedHouse: qh,
    quesited: { house: qh, sign: qSign.name, sanskrit: qSign.sanskrit, lord: qLord, name: qMeta.name, meaning: qMeta.meaning, cite: QUESITED_CITE },
    lagna: {
      lon: lagnaLon, sign: lagnaSign.name, sanskrit: lagnaSign.sanskrit, lord: lagnaSign.lord,
      nakshatra: nakshatraOf(lagnaLon),
      shirshodaya: SHIRSHODAYA.includes(lagnaSign.name),
      overriddenByKpNumber: kpNumber != null,
    },
    moon: {
      house: moonHouse, sign: v.grahas.Moon.rashi, nakshatra: v.grahas.Moon.nakshatra,
      tithi: v.panchanga ? v.panchanga.tithi : null, paksha: cls.paksha,
      aspectedByBenefics: moonBeneficAspects, aspectedByMalefics: moonMaleficAspects,
      aspectsHouse: moonAspectsHouse,
    },
    classification: cls,
    arudha: arudhaFromDirection(opts.direction),
    kpNumber, kpEntry,
    testimonies: T, counts, leaning,
    caveat: PRASNA_CAVEAT,
    outOfScope: OUT_OF_SCOPE,
    editionFlags: EDITION_FLAGS,
    citations: [PRASNA_SOURCES.spsh, PRASNA_SOURCES.dv, PRASNA_SOURCES.pm, PRASNA_SOURCES.bj, PRASNA_SOURCES.phaladipika],
  };
}
