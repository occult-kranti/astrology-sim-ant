// ============================================================================
//  kuta.js — the PURE scorer for Vedic marriage matching: the aṣṭakūṭa
//  (36-guṇa milāpa) of the North and the ten porutham of the South. No DOM,
//  no astronomy — it takes two SIDEREAL Moon longitudes, derives each Moon's
//  nakṣatra (via nakshatraOf) and rāśi (floor(sid/30)), and applies the cited
//  tables in data/kuta-data.js. The naisargika friendship table NATURAL_RELATION
//  (BPHS 3.55–57) is imported from vedic-data.js and reused for graha-maitrī and
//  rāśyādhipati.
//
//  SENSITIVE DOMAIN. Every result is "what the tradition computes", never advice
//  about a real relationship. Contested values are surfaced, never resolved:
//    • both graha-maitrī grids + the gaṇa grid switch on opts.variantSet;
//    • varṇa carries both air/earth tables (variantSet selects, dispute flagged);
//    • bhakūṭa reports the cancellation AND the points-restoration dispute;
//    • nāḍī reports BOTH exempt-star lists;
//    • the North bhakūṭa 5/9 doṣa and the South rāśi 5/9-is-good verdict are
//      reported side by side.
//  Astrology has no demonstrated validity — described, never prescribed.
// ============================================================================
import { RASHIS, NAKSHATRAS, nakshatraOf, NATURAL_RELATION } from './data/vedic-data.js';
import {
  ASHTAKUTA_META, VARNA, VASHYA, TARA, YONI, GRAHA_MAITRI, GANA, BHAKUTA, NADI,
  PORUTHAM_META, DINA_TAMIL, MAHENDRA, STRI_DIRGHA, RASI_SOUTH, RASYADHIPATI,
  RAJJU, VEDHA, KUTA_FRAMING,
} from './data/kuta-data.js';

const norm360 = x => ((x % 360) + 360) % 360;

// --- small derivations -------------------------------------------------------
function rashiIndexOf(sidLon) { return Math.floor(norm360(sidLon) / 30); }
function nakInfoOf(sidLon) { const n = nakshatraOf(sidLon); return { num: n.num, name: n.name, sanskrit: n.sanskrit, pada: n.pada }; }
function signName(i) { return RASHIS[i].name; }
function signSanskrit(i) { return RASHIS[i].sanskrit; }
function signLord(i) { return RASHIS[i].lord; }

// inclusive forward count from nakṣatra a → b (1..27)
function nakCount(a, b) { return ((b - a + 27) % 27) + 1; }
// inclusive forward count from rāśi index a → b (1..12)
function rashiCount(a, b) { return ((b - a + 12) % 12) + 1; }

// naisargika relation of graha a toward b (NATURAL_RELATION is BPHS 3.55–57)
function natRel(a, b) {
  const r = NATURAL_RELATION[a];
  if (!r) return 'neutral';
  if (r.friend.includes(b)) return 'friend';
  if (r.enemy.includes(b)) return 'enemy';
  return 'neutral';
}
// the six maitrī categories from the two directional relations
function maitriCategory(relAB, relBA) {
  const f = [relAB, relBA].filter(x => x === 'friend').length;
  const e = [relAB, relBA].filter(x => x === 'enemy').length;
  const n = [relAB, relBA].filter(x => x === 'neutral').length;
  if (f === 2) return 'bothFriends';
  if (f === 1 && n === 1) return 'friendNeutral';
  if (n === 2) return 'bothNeutral';
  if (f === 1 && e === 1) return 'friendEnemy';
  if (n === 1 && e === 1) return 'neutralEnemy';
  return 'bothEnemies';
}
function which(map, num) { for (const k of Object.keys(map)) if (map[k].includes(num)) return k; return null; }

// yoni animal that carries a nakṣatra number
function yoniAnimalOf(num) {
  const a = YONI.animalsByNakshatraNum;
  for (const animal of Object.keys(a)) { if (a[animal].M === num || a[animal].F === num) return animal; }
  throw new Error(`kuta: no yoni animal for nakṣatra ${num}`);
}
// gaṇa of a nakṣatra number
function ganaOf(num) { const g = which(GANA.byNakshatraNum, num); if (!g) throw new Error(`kuta: no gaṇa for nakṣatra ${num}`); return g; }
// nāḍī of a nakṣatra number
function nadiOf(num) { const n = which(NADI.byNakshatraNum, num); if (!n) throw new Error(`kuta: no nāḍī for nakṣatra ${num}`); return n; }
// rajju group + direction of a nakṣatra number
function rajjuOf(num) {
  const group = which(RAJJU.groupsByNakshatraNum, num);
  if (!group) throw new Error(`kuta: no rajju group for nakṣatra ${num}`);
  const direction = (RAJJU.aroha[group] || []).includes(num) ? 'aroha' : 'avaroha';
  return { group, direction, label: RAJJU.groupLabels[group] };
}

// vaśya class of a Moon-sign (throws on Sagittarius when completion disabled)
function vashyaClassOf(signIdx, degInSign, useSagCompletion) {
  if (signIdx === 9) return degInSign < 15 ? VASHYA.capricornSplit.firstHalf : VASHYA.capricornSplit.secondHalf; // Capricorn
  if (signIdx === 8) { // Sagittarius — saravali omits it
    if (!useSagCompletion) {
      throw new Error('kuta: Sagittarius Moon is unclassifiable under the bare saravali vaśya table (it omits Sagittarius). Enable the flagged Sagittarius completion (opts.vashyaSagCompletion) to score it, or the engine refuses to mis-score.');
    }
    return degInSign < 15 ? VASHYA.sagittariusCompletion.firstHalf : VASHYA.sagittariusCompletion.secondHalf;
  }
  const cls = VASHYA.classBySign_saravali[signName(signIdx)];
  if (!cls) throw new Error(`kuta: no vaśya class for ${signName(signIdx)}`);
  return cls;
}

// ---------------------------------------------------------------------------
//  ashtakuta(boyMoonSidLon, girlMoonSidLon, opts) — the 36-guṇa breakdown.
//  Boy = groom, girl = bride (matrices are keyed rows = bride, cols = groom).
//  opts.variantSet: 'saravali' (default) | 'common'.
//  opts.vashyaSagCompletion: default true — the flagged Sagittarius completion.
// ---------------------------------------------------------------------------
export function ashtakuta(boyMoonSidLon, girlMoonSidLon, opts = {}) {
  const variantSet = opts.variantSet === 'common' ? 'common' : 'saravali';
  const useSag = opts.vashyaSagCompletion !== false;

  // groom = boy, bride = girl
  const groom = deriveParty(boyMoonSidLon);
  const bride = deriveParty(girlMoonSidLon);

  const kutas = [
    kVarna(bride, groom, variantSet),
    kVashya(bride, groom, useSag),
    kTara(bride, groom),
    kYoni(bride, groom),
    kGrahaMaitri(bride, groom, variantSet),
    kGana(bride, groom, variantSet),
    kBhakuta(bride, groom),
    kNadi(bride, groom),
  ];
  const total = kutas.reduce((s, k) => s + k.points, 0);

  return {
    system: 'ashtakuta', variantSet,
    groom: partyPublic(groom), bride: partyPublic(bride),
    kutas, total, max: ASHTAKUTA_META.total,
    band: {
      bands: ASHTAKUTA_META.threshold.bands, minimum: ASHTAKUTA_META.threshold.minimum,
      ramanSchool: ASHTAKUTA_META.threshold.ramanSchool,
      contested: true, note: ASHTAKUTA_META.threshold.bandsNote,
    },
    classicalAnchor: ASHTAKUTA_META.classicalAnchor,
    framing: KUTA_FRAMING,
    citations: kutas.map(k => k.cite).filter((c, i, a) => a.indexOf(c) === i),
    notes: 'Boy = groom, girl = bride. Contested cells (varṇa · graha-maitrī · gaṇa) follow variantSet="' + variantSet + '"; the bhakūṭa points-restoration and the nāḍī exempt-star lists are shown as disputes, never resolved.',
  };
}

function deriveParty(sidLon) {
  const ri = rashiIndexOf(sidLon);
  const nak = nakInfoOf(sidLon);
  return { sidLon: norm360(sidLon), rashiIndex: ri, degInSign: norm360(sidLon) - ri * 30, nak };
}
function partyPublic(p) {
  return {
    moonSidLon: +p.sidLon.toFixed(4),
    nakshatraNum: p.nak.num, nakshatra: p.nak.name, nakshatraSanskrit: p.nak.sanskrit, pada: p.nak.pada,
    rashiIndex: p.rashiIndex, rashi: signName(p.rashiIndex), rashiSanskrit: signSanskrit(p.rashiIndex), rashiLord: signLord(p.rashiIndex),
  };
}

// --- 1 · varṇa ---------------------------------------------------------------
function kVarna(bride, groom, variantSet) {
  const table = variantSet === 'common' ? VARNA.bySign_variantB_common : VARNA.bySign_variantA_saravali;
  const brideV = table[signName(bride.rashiIndex)], groomV = table[signName(groom.rashiIndex)];
  const points = VARNA.rank[groomV] >= VARNA.rank[brideV] ? 1 : 0;
  return {
    key: 'varna', name: 'Varṇa', max: 1, points,
    detail: `Bride ${signName(bride.rashiIndex)} = ${brideV}, groom ${signName(groom.rashiIndex)} = ${groomV}. Groom's rank ${points ? '≥' : '<'} bride's → ${points}.`,
    doshas: [], cancellations: [], contested: true, contestedNote: VARNA.contestedNote,
    variantUsed: variantSet, cite: VARNA.cite,
  };
}

// --- 2 · vaśya ---------------------------------------------------------------
function kVashya(bride, groom, useSag) {
  const brideCls = vashyaClassOf(bride.rashiIndex, bride.degInSign, useSag);
  const groomCls = vashyaClassOf(groom.rashiIndex, groom.degInSign, useSag);
  const col = VASHYA.cols.indexOf(groomCls);
  const points = VASHYA.grid_rowsBride_colsGroom[brideCls][col];
  const sagFlag = (bride.rashiIndex === 8 || groom.rashiIndex === 8);
  return {
    key: 'vashya', name: 'Vaśya', max: 2, points,
    detail: `Bride class ${brideCls} × groom class ${groomCls} (rows = bride) → ${points}.`,
    doshas: [], cancellations: [],
    contested: !!sagFlag,
    contestedNote: sagFlag ? VASHYA.sagittariusCompletion.note : VASHYA.orientationFlag,
    cite: VASHYA.cite,
  };
}

// --- 3 · tārā ----------------------------------------------------------------
function kTara(bride, groom) {
  const cGB = nakCount(groom.nak.num, bride.nak.num);   // groom → bride
  const cBG = nakCount(bride.nak.num, groom.nak.num);   // bride → groom
  const bad = r => TARA.badRemainders.includes(r % 9);
  const p1 = bad(cGB) ? 0 : TARA.half;
  const p2 = bad(cBG) ? 0 : TARA.half;
  const points = p1 + p2;
  return {
    key: 'tara', name: 'Tārā (Dina)', max: 3, points,
    detail: `Groom→bride count ${cGB} (rem ${cGB % 9}) → ${p1}; bride→groom count ${cBG} (rem ${cBG % 9}) → ${p2}.`,
    doshas: points < 3 ? ['tārā-doṣa (a Vipat/Pratyari/Vadha tārā in one or both directions)'] : [],
    cancellations: [], cite: TARA.cite,
  };
}

// --- 4 · yoni ----------------------------------------------------------------
function kYoni(bride, groom) {
  const brideA = yoniAnimalOf(bride.nak.num), groomA = yoniAnimalOf(groom.nak.num);
  const col = YONI.colOrder.indexOf(groomA);
  const points = YONI.matrix[brideA][col];
  const enemy = YONI.swornEnemyZeroPairs.some(([a, b]) => (a === brideA && b === groomA) || (a === groomA && b === brideA));
  const quality = points === 4 ? 'same yoni' : points === 3 ? 'friendly' : points === 2 ? 'neutral' : points === 1 ? 'hostile' : 'sworn enemy';
  return {
    key: 'yoni', name: 'Yoni', max: 4, points,
    detail: `Bride ${brideA} × groom ${groomA} (rows = bride) → ${points} (${quality}).`,
    doshas: enemy ? [`yoni sworn-enemy pair (${brideA}–${groomA})`] : [],
    cancellations: [], cite: YONI.cite,
  };
}

// --- 5 · graha-maitrī --------------------------------------------------------
function kGrahaMaitri(bride, groom, variantSet) {
  const bl = signLord(bride.rashiIndex), gl = signLord(groom.rashiIndex);
  const grid = variantSet === 'common' ? GRAHA_MAITRI.grid_variantB_common : GRAHA_MAITRI.grid_variantA_saravali;
  let points, cat, detail;
  if (bl === gl) {
    points = GRAHA_MAITRI.sameLord; cat = 'sameLord';
    detail = `Both Moon-signs ruled by ${bl} (same lord) → ${points}.`;
  } else {
    const relBG = natRel(bl, gl), relGB = natRel(gl, bl);
    cat = maitriCategory(relBG, relGB);
    points = grid[cat];
    detail = `Bride lord ${bl} (${relBG} of ${gl}) & groom lord ${gl} (${relGB} of ${bl}) → ${cat} → ${points}.`;
  }
  return {
    key: 'grahaMaitri', name: 'Graha-maitrī', max: 5, points, category: cat, detail,
    doshas: [], cancellations: [],
    contested: true, contestedNote: GRAHA_MAITRI.contestedNote, variantUsed: variantSet,
    cite: GRAHA_MAITRI.cite,
  };
}

// --- 6 · gaṇa ----------------------------------------------------------------
function kGana(bride, groom, variantSet) {
  const bg = ganaOf(bride.nak.num), gg = ganaOf(groom.nak.num);
  const grid = variantSet === 'common' ? GANA.grid_rowsBride_colsGroom_common : GANA.grid_rowsBride_colsGroom_saravali;
  const col = GANA.cols.indexOf(gg);
  const points = grid[bg][col];
  return {
    key: 'gana', name: 'Gaṇa', max: 6, points,
    detail: `Bride ${bg} × groom ${gg} (rows = bride) → ${points}.`,
    doshas: (bg === 'Rakshasa' || gg === 'Rakshasa') && bg !== gg ? ['gaṇa mismatch (a Rākṣasa with a non-Rākṣasa)'] : [],
    cancellations: [],
    contested: true, contestedNote: GANA.contestedNote, variantUsed: variantSet, cite: GANA.cite,
  };
}

// --- 7 · bhakūṭa -------------------------------------------------------------
function kBhakuta(bride, groom) {
  const cBG = rashiCount(bride.rashiIndex, groom.rashiIndex);
  const cGB = rashiCount(groom.rashiIndex, bride.rashiIndex);
  const pairSet = [cBG, cGB].sort((a, b) => a - b);
  const forbidden = BHAKUTA.forbiddenPairs.some(([x, y]) => (pairSet[0] === x && pairSet[1] === y));
  const bl = signLord(bride.rashiIndex), gl = signLord(groom.rashiIndex);
  const lordsFriendly = bl === gl || natRel(bl, gl) === 'friend' || natRel(gl, bl) === 'friend';
  const cancelled = forbidden && lordsFriendly;
  const points = forbidden ? 0 : 7; // software convention: points stay 0 even if cancelled
  const cancellations = cancelled
    ? [`bhakūṭa-doṣa CANCELLED — rāśi lords ${bl}/${gl} are ${bl === gl ? 'the same planet' : 'naturally friendly'}. (Points stay 0 by software convention; whether the 7 points are RESTORED is itself disputed — ⚑ see note.)`]
    : [];
  return {
    key: 'bhakuta', name: 'Bhakūṭa (Rāśi)', max: 7, points,
    detail: `Mutual counts ${pairSet[0]}/${pairSet[1]} → ${forbidden ? 'bhakūṭa-doṣa (0)' : '7'}.`,
    doshas: forbidden ? [`bhakūṭa-doṣa (${pairSet[0]}/${pairSet[1]})`] : [],
    cancellations,
    contested: forbidden, contestedNote: forbidden ? BHAKUTA.pointsNote : undefined,
    cite: BHAKUTA.cite,
  };
}

// --- 8 · nāḍī ----------------------------------------------------------------
function kNadi(bride, groom) {
  const bn = nadiOf(bride.nak.num), gn = nadiOf(groom.nak.num);
  const same = bn === gn;
  const points = same ? 0 : 8;
  // cancellation facts (displayed, never used to alter the points)
  const cancellations = [];
  if (same) {
    const sameNak = bride.nak.num === groom.nak.num;
    const sameRashi = bride.rashiIndex === groom.rashiIndex;
    if (sameRashi && !sameNak) cancellations.push('same rāśi + different nakṣatra → doṣa cancelled by one rule (points stay 0 by convention).');
    if (sameNak && bride.pada !== groom.pada) cancellations.push('same nakṣatra + different pāda → doṣa cancelled by one rule (points stay 0).');
    if (sameNak && !sameRashi) cancellations.push('same nakṣatra + different rāśi (junction star) → doṣa cancelled by one rule (points stay 0).');
    if (bride.rashiIndex !== groom.rashiIndex && signLord(bride.rashiIndex) === signLord(groom.rashiIndex)) cancellations.push('same rāśi lord → doṣa cancelled by one rule (points stay 0).');
  }
  const inExemptA = same && (NADI.exemptList_A.includes(bride.nak.num) || NADI.exemptList_A.includes(groom.nak.num));
  const inExemptB = same && (NADI.exemptList_B.includes(bride.nak.num) || NADI.exemptList_B.includes(groom.nak.num));
  return {
    key: 'nadi', name: 'Nāḍī', max: 8, points,
    detail: `Bride ${bn}, groom ${gn} → ${same ? 'same nāḍī (nāḍī-doṣa, 0)' : 'different nāḍī (8)'}.`,
    doshas: same ? [`nāḍī-doṣa (both ${bn})`] : [],
    cancellations,
    exempt: same ? { listA: inExemptA, listB: inExemptB, listANames: NADI.exemptList_A_names, listBNames: NADI.exemptList_B_names, note: NADI.exemptNote } : null,
    contested: same, contestedNote: same ? NADI.exemptNote : undefined,
    cite: NADI.cite,
  };
}

// ---------------------------------------------------------------------------
//  porutham10(boyMoonSidLon, girlMoonSidLon, opts) — the ten South-Indian
//  poruthams as pass / fail / marginal, with rajju & vedhā vetoes and the
//  North/South rāśi contradiction reported BOTH ways.
// ---------------------------------------------------------------------------
export function porutham10(boyMoonSidLon, girlMoonSidLon, opts = {}) {
  const useSag = opts.vashyaSagCompletion !== false;
  const boy = deriveParty(boyMoonSidLon);   // groom
  const girl = deriveParty(girlMoonSidLon); // bride
  const poruthams = [
    pDina(girl, boy),
    pGana(girl, boy),
    pMahendra(girl, boy),
    pStriDirgha(girl, boy),
    pYoni(girl, boy),
    pRasi(girl, boy),
    pRasyadhipati(girl, boy),
    pVashya(girl, boy, useSag),
    pRajju(girl, boy),
    pVedha(girl, boy),
  ];
  const vetoes = poruthams.filter(p => p.veto && p.status === 'fail').map(p => p.name);
  const passCount = poruthams.filter(p => p.status === 'pass').length;
  const contradictions = poruthams.filter(p => p.contradiction).map(p => ({ porutham: p.key, ...p.contradiction }));
  return {
    system: 'porutham10',
    groom: partyPublic(boy), bride: partyPublic(girl),
    poruthams, passCount, total: PORUTHAM_META.total,
    vetoes, vetoed: vetoes.length > 0,
    contradictions,
    classicalAnchor: PORUTHAM_META.classicalAnchor,
    scoring: PORUTHAM_META.scoring,
    framing: KUTA_FRAMING,
    citations: poruthams.map(p => p.cite).filter((c, i, a) => a.indexOf(c) === i),
    notes: 'Counts run girl → boy (bride → groom) inclusive per the Tamil convention. Rajju and vedhā are hard vetoes. The rāśi porutham reports the South verdict AND the North bhakūṭa verdict where they contradict (5/9).',
  };
}

// girl → boy inclusive count (the Tamil direction)
function gbCount(girl, boy) { return nakCount(girl.nak.num, boy.nak.num); }

function pDina(girl, boy) {
  const count = gbCount(girl, boy);
  const sameStar = girl.nak.num === boy.nak.num;
  let pass;
  if (sameStar) pass = DINA_TAMIL.sameStarApprovedNums.includes(girl.nak.num);
  else pass = DINA_TAMIL.auspiciousCounts.includes(count);
  const padaException = DINA_TAMIL.padaExceptionCounts.includes(count);
  // northern tārā (mod-9) — for the divergence report
  const taraBoth = (!TARA.badRemainders.includes(gbCount(girl, boy) % 9) ? 1.5 : 0) + (!TARA.badRemainders.includes(nakCount(boy.nak.num, girl.nak.num) % 9) ? 1.5 : 0);
  return {
    key: 'dina', name: 'Dina', status: pass ? 'pass' : padaException ? 'marginal' : 'fail', veto: false,
    detail: `Girl→boy count ${count} — ${pass ? 'in' : 'not in'} the Tamil list {${DINA_TAMIL.auspiciousCounts.join(',')}}${sameStar ? ' (same-star rule)' : ''}${padaException ? '; pāda-level exception at this count' : ''}.`,
    divergence: `Northern tārā (mod-9) would score ${taraBoth}/3 here — the Tamil dina and the northern tārā are different rules. ⚑`,
    cite: DINA_TAMIL.cite,
  };
}

function pGana(girl, boy) {
  const gg = ganaOf(girl.nak.num), bg = ganaOf(boy.nak.num);
  let status;
  if (gg === bg) status = 'pass';
  else if (bg === 'Deva' && gg === 'Manushya') status = 'pass'; // Deva boy + Manushya girl acceptable
  else if (gg === 'Rakshasa' || bg === 'Rakshasa') status = 'fail';
  else status = 'marginal';
  return {
    key: 'gana', name: 'Gaṇa', status, veto: false,
    detail: `Girl ${gg}, boy ${bg} → ${status === 'pass' ? 'same gaṇa or Deva-boy/Manuṣya-girl' : status}.`,
    cite: GANA.cite,
  };
}

function pMahendra(girl, boy) {
  const count = gbCount(girl, boy);
  const pass = MAHENDRA.counts.includes(count);
  return {
    key: 'mahendra', name: 'Mahendra', status: pass ? 'pass' : 'fail', veto: false,
    detail: `Girl→boy count ${count} — ${pass ? 'in' : 'not in'} {${MAHENDRA.counts.join(',')}}.`,
    signifies: MAHENDRA.signifies, cite: MAHENDRA.cite,
  };
}

function pStriDirgha(girl, boy) {
  const count = gbCount(girl, boy);
  const uttamam = count > STRI_DIRGHA.uttamamThreshold;
  const madhyamam = !uttamam && count > STRI_DIRGHA.madhyamamThreshold;
  return {
    key: 'striDirgha', name: 'Strī-dīrgha', status: uttamam ? 'pass' : madhyamam ? 'marginal' : 'fail', veto: false,
    detail: `Girl→boy count ${count} — ${uttamam ? '> 13 (uttamam)' : madhyamam ? '> 7 (madhyamam per the flagged variant ⚑)' : '≤ 7'}.`,
    cite: STRI_DIRGHA.cite,
  };
}

function pYoni(girl, boy) {
  const girlA = yoniAnimalOf(girl.nak.num), boyA = yoniAnimalOf(boy.nak.num);
  const col = YONI.colOrder.indexOf(boyA);
  const val = YONI.matrix[girlA][col];
  const status = val === 0 ? 'fail' : val === 1 ? 'marginal' : 'pass';
  return {
    key: 'yoni', name: 'Yoni', status, veto: false,
    detail: `Girl ${girlA} × boy ${boyA} = ${val} (${val === 4 ? 'same' : val >= 2 ? 'friendly/neutral' : val === 1 ? 'hostile' : 'sworn enemy'}).`,
    cite: YONI.cite,
  };
}

function pRasi(girl, boy) {
  const count = rashiCount(girl.rashiIndex, boy.rashiIndex); // from girl
  const good = count === RASI_SOUTH.bestCount || RASI_SOUTH.goodCounts.includes(count);
  const bad = RASI_SOUTH.badCounts.includes(count);
  const status = count === RASI_SOUTH.bestCount ? 'pass' : good ? 'pass' : bad ? 'fail' : 'marginal';
  // North bhakūṭa on the same pair, for the contradiction
  const cBG = rashiCount(girl.rashiIndex, boy.rashiIndex), cGB = rashiCount(boy.rashiIndex, girl.rashiIndex);
  const pairSet = [cBG, cGB].sort((a, b) => a - b);
  const northForbidden = BHAKUTA.forbiddenPairs.some(([x, y]) => pairSet[0] === x && pairSet[1] === y);
  const contradiction = (good && northForbidden) ? {
    south: `${count === 7 ? '7th (best)' : count + 'th'} from the girl — auspicious (South).`,
    north: `${pairSet[0]}/${pairSet[1]} — bhakūṭa-doṣa, 0 points (North).`,
    note: RASI_SOUTH.contradictionFlag,
  } : null;
  return {
    key: 'rasi', name: 'Rāśi', status, veto: false,
    detail: `${count === 7 ? '7th (best)' : count + 'th'} rāśi from the girl → ${status} (South).`,
    contradiction, cite: RASI_SOUTH.cite,
  };
}

function pRasyadhipati(girl, boy) {
  const gl = signLord(girl.rashiIndex), bl = signLord(boy.rashiIndex);
  let status, detail;
  if (gl === bl) { status = 'pass'; detail = `Both Moon-signs ruled by ${gl} (same lord).`; }
  else {
    const r1 = natRel(gl, bl), r2 = natRel(bl, gl);
    if (r1 === 'friend' && r2 === 'friend') { status = 'pass'; detail = `${gl} & ${bl} mutual friends (uttamam).`; }
    else if (r1 === 'enemy' && r2 === 'enemy') { status = 'fail'; detail = `${gl} & ${bl} mutual enemies.`; }
    else if (r1 === 'friend' || r2 === 'friend' || (r1 === 'neutral' && r2 === 'neutral')) { status = 'marginal'; detail = `${gl}/${bl}: one-sided friendship or neutral (madhyamam).`; }
    else { status = 'fail'; detail = `${gl}/${bl}: enmity present.`; }
  }
  return { key: 'rasyadhipati', name: 'Rāśyādhipati', status, veto: false, detail, cite: RASYADHIPATI.cite };
}

function pVashya(girl, boy, useSag) {
  const girlCls = vashyaClassOf(girl.rashiIndex, girl.degInSign, useSag);
  const boyCls = vashyaClassOf(boy.rashiIndex, boy.degInSign, useSag);
  // girl's rāśi within boy's vaśya → the grid cell (rows = bride = girl)
  const col = VASHYA.cols.indexOf(boyCls);
  const val = VASHYA.grid_rowsBride_colsGroom[girlCls][col];
  return {
    key: 'vashya', name: 'Vaśya', status: val >= 1.5 ? 'pass' : val > 0 ? 'marginal' : 'fail', veto: false,
    detail: `Girl class ${girlCls} × boy class ${boyCls} → grid ${val}.`,
    cite: VASHYA.cite,
  };
}

function pRajju(girl, boy) {
  const gr = rajjuOf(girl.nak.num), br = rajjuOf(boy.nak.num);
  const same = gr.group === br.group;
  const sameDir = same && gr.direction === br.direction;
  const status = same ? 'fail' : 'pass';
  return {
    key: 'rajju', name: 'Rajju', status, veto: true,
    detail: same
      ? `BOTH ${gr.label} (${sameDir ? 'same direction, ' + gr.direction : gr.direction + ' vs ' + br.direction}) → same rajju: VETO. Tradition's stated consequence: ${RAJJU.traditionalConsequences[gr.group]}.`
      : `Girl ${gr.label}/${gr.direction}, boy ${br.label}/${br.direction} → different rajju (clear).`,
    directionVariant: same && !sameDir ? RAJJU.directionToleranceVariant : undefined,
    consequencesNote: same ? RAJJU.consequencesNote : undefined,
    cite: RAJJU.cite,
  };
}

function pVedha(girl, boy) {
  const g = girl.nak.num, b = boy.nak.num;
  const inPair = VEDHA.pairsByNum.some(([x, y]) => (x === g && y === b) || (x === b && y === g));
  const inTriple = VEDHA.mutualTriple.includes(g) && VEDHA.mutualTriple.includes(b) && g !== b;
  const hit = inPair || inTriple;
  return {
    key: 'vedha', name: 'Vedhā', status: hit ? 'fail' : 'pass', veto: true,
    detail: hit ? `Nakṣatras ${g} & ${b} are mutually vedhā → reject (VETO).` : `Nakṣatras ${g} & ${b} carry no vedhā (clear).`,
    cite: VEDHA.cite,
  };
}

// ---------------------------------------------------------------------------
//  yoniMatrixInvariants() — a self-check helper (used by the engine test):
//  the 14 diagonal cells, the 7 sworn-enemy zero-pairs both ways, and the
//  count of asymmetric off-diagonal pairs.
// ---------------------------------------------------------------------------
export function yoniMatrixInvariants() {
  const order = YONI.colOrder, M = YONI.matrix;
  const diagonalAll4 = order.every(a => M[a][order.indexOf(a)] === 4);
  const enemyZeros = YONI.swornEnemyZeroPairs.every(([a, b]) =>
    M[a][order.indexOf(b)] === 0 && M[b][order.indexOf(a)] === 0);
  let asymmetric = 0;
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) {
    if (M[order[i]][j] !== M[order[j]][i]) asymmetric++;
  }
  return { diagonalAll4, enemyZeros, asymmetricPairs: asymmetric };
}
