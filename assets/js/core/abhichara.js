// ============================================================================
//  abhichara.js — the ṢAṬKARMAN TIMING SCREEN (pure engine).
//
//  Given a moment, a place and one of the six acts, this reads off the tantric
//  correspondence tables the "fit" moment the tradition PRESCRIBED (season,
//  day-part, lunar fortnight, colour, mat, mudrā, rosary, finger, hand) and
//  checks the current moment against them. It is read-only CALENDAR / DIRECTION
//  ARITHMETIC only — a correspondence lookup plus a "does now match?" check. It
//  reuses the existing engines wholesale:
//    • castChart + castVedic  → the Sun’s sidereal rāśi (⇒ ṛtu) and the pañcāṅga
//      paksha (the lunar fortnight);
//    • planetaryHour          → the sunrise/sunset that bound the day, for the
//      ghaṭikā-cycle (scheme A) and the day-part thirds (scheme B).
//
//  PURE — no DOM, no network, no randomness; headless-testable.
//
//  LOCKED HONEST FRAMING: this DESCRIBES what the abhicāra tradition prescribed,
//  as religious history. It NEVER prescribes. No act’s output contains any
//  operational instruction. None of these timing correspondences has any
//  demonstrated validity, and computing the screen changes nothing real.
// ============================================================================
import { castChart } from './astro.js';
import { castVedic } from './vedic.js';
import { planetaryHour } from './planetary-hours.js';
import {
  SHATKARMAN, RITU, RITU_BY_RASHI, RITU_SOURCE,
  GHATIKA_CYCLE, DAY_PARTS, CORRESPONDENCES,
} from './data/abhichara-data.js';

export const SHATKARMAN_CAVEAT =
  'This screen describes only what the abhicāra tradition PRESCRIBED as the fit season, day-part, lunar '
  + 'fortnight, colour and implement for each act — a correspondence lookup on a real calendar, reproduced as '
  + 'religious history. It asserts nothing about efficacy: none of these rites has any demonstrated power, '
  + 'nothing here is an instruction, and computing the screen changes nothing in the world.';

const ACT_KEYS = SHATKARMAN.map(a => a.key);
const rituByKey = k => RITU.find(r => r.key === k) || null;
const actMeta = k => SHATKARMAN.find(a => a.key === k) || null;

// --- helpers -----------------------------------------------------------------

// The calendar ṛtu (season) from the Sun’s SIDEREAL rāśi. The Indian ṛtu spans
// two solar months (rāśis); convention documented in RITU_SOURCE.
function rituOf(vedic) {
  const rashiIndex = vedic.grahas.Sun.rashiIndex;      // 0..11 (Meṣa..Mīna)
  const key = RITU_BY_RASHI[rashiIndex];
  const r = rituByKey(key);
  return {
    key, translit: r ? r.translit : key, gloss: r ? r.gloss : '',
    rashiIndex, rashi: vedic.grahas.Sun.rashi, rashiSanskrit: vedic.grahas.Sun.rashiSanskrit,
    prescribesAct: GHATIKA_CYCLE.seasonAct[key] || null,   // Table C: season → act
    source: RITU_SOURCE,
  };
}

// The ghaṭikā-cycle block (scheme A): from sunrise, six 4-hour season-blocks
// (ten 24-min ghaṭikās each) cycle the six seasons spring→…→cool.
function ghatikaBlock(instant, sunrise) {
  const blockMs = GHATIKA_CYCLE.ghatikasPerBlock * GHATIKA_CYCLE.unitMinutes * 60000; // 4 h
  const elapsed = instant.getTime() - sunrise.getTime();
  const idx = ((Math.floor(elapsed / blockMs) % 6) + 6) % 6;
  const seasonKey = GHATIKA_CYCLE.order[idx];
  const r = rituByKey(seasonKey);
  const sinceSunriseMin = Math.max(0, Math.round(elapsed / 60000));
  return {
    index: idx, seasonKey, translit: r ? r.translit : seasonKey, gloss: r ? r.gloss : '',
    prescribesAct: GHATIKA_CYCLE.seasonAct[seasonKey] || null,
    ghatikaNumber: Math.floor(sinceSunriseMin / GHATIKA_CYCLE.unitMinutes) + 1,   // 1-based ghaṭikā since sunrise
    blockStartMs: sunrise.getTime() + Math.floor(elapsed / blockMs) * blockMs,
    source: GHATIKA_CYCLE.cite,
  };
}

// The day-part (scheme B, BPK 3.6-7): day arc (sunrise→sunset) in thirds
// (pūrvāhṇa | madhyāhna | parāhṇa); night arc (sunset→next sunrise) in thirds
// (sandhyā | ardharātra | prabhāta). Boundaries are equal thirds of the
// measured arcs — a modelling convention (the texts name the parts; the clock
// bounds are approximated), documented in the returned `boundsNote`.
function dayPart(instant, sunrise, sunset, nextSunrise) {
  const t = instant.getTime();
  const parts = DAY_PARTS.bpk.parts;
  let idx;
  if (t < sunset.getTime()) {
    const third = (sunset.getTime() - sunrise.getTime()) / 3;
    idx = Math.min(2, Math.max(0, Math.floor((t - sunrise.getTime()) / third)));   // 0..2 → day parts
  } else {
    const third = (nextSunrise.getTime() - sunset.getTime()) / 3;
    idx = 3 + Math.min(2, Math.max(0, Math.floor((t - sunset.getTime()) / third))); // 3..5 → night parts
  }
  const p = parts[idx];
  return {
    index: idx, key: p.key, translit: p.translit, gloss: p.gloss, arc: p.arc,
    season: p.season, prescribesActs: p.acts.slice(),
    boundsNote: 'Day-part bounds = equal thirds of the measured day arc (sunrise→sunset) and night arc (sunset→next sunrise) — a modelling convention; the texts name the six parts but not their exact clock boundaries.',
    source: DAY_PARTS.bpk.cite,
  };
}

// The lunar fortnight (paksha) from castVedic’s pañcāṅga.
function fortnightOf(vedic) {
  const paksha = vedic.panchanga.tithi.paksha;           // 'Śukla (waxing)' | 'Kṛṣṇa (waning)'
  const isDark = /Kṛṣṇa/.test(paksha);
  return {
    paksha, isDark,
    half: isDark ? 'dark (kṛṣṇa)' : 'bright (śukla)',
    tithiNum: vedic.panchanga.tithi.num, tithiName: vedic.panchanga.tithi.name,
    source: 'castVedic pañcāṅga (tithi.paksha); ' + CORRESPONDENCES.fortnight.cite,
  };
}

// Assemble the prescriptions for one act from the tables.
function prescriptionsFor(actKey) {
  const C = CORRESPONDENCES;
  // the act’s prescribed season (scheme A / Table C): invert seasonAct
  const seasonKey = Object.keys(GHATIKA_CYCLE.seasonAct).find(s => GHATIKA_CYCLE.seasonAct[s] === actKey) || null;
  const seasonR = seasonKey ? rituByKey(seasonKey) : null;
  // the act’s prescribed day-part (scheme B / BPK): first part listing the act
  const bpkPart = DAY_PARTS.bpk.parts.find(p => p.acts.includes(actKey)) || null;
  // the U 1.28 day-part (the intra-Uḍḍīśatantra variant) — e.g. māraṇa at twilight
  const u128Part = DAY_PARTS.u128.parts.find(p => p.acts.includes(actKey)) || null;
  // fortnight
  const fortDark = C.fortnight.darkActs.includes(actKey);
  const fortBright = C.fortnight.brightActs.includes(actKey);
  return {
    season: seasonKey ? { key: seasonKey, translit: seasonR.translit, gloss: seasonR.gloss } : null,
    seasonCite: C.seasons.schemeA.cite,
    dayPartBPK: bpkPart ? { key: bpkPart.key, translit: bpkPart.translit, gloss: bpkPart.gloss } : null,
    dayPartCite: DAY_PARTS.bpk.cite,
    dayPartU128: u128Part ? { key: u128Part.key, translit: u128Part.translit, gloss: u128Part.gloss } : null,
    dayPartU128Cite: DAY_PARTS.u128.cite,
    fortnight: fortDark ? 'dark (kṛṣṇa) half' : fortBright ? 'bright (śukla) half' : 'no fortnight rule recorded for this act',
    fortnightCite: C.fortnight.cite,
    color: C.colors.byAct[actKey] || null, colorCite: C.colors.cite,
    matUddisha: C.mats.uddisha.byAct[actKey] || null,
    matBhairava: C.mats.bhairavapadmavati.byAct[actKey] || null,
    matCite: C.mats.uddisha.cite + ' | ' + C.mats.bhairavapadmavati.cite,
    mudra: C.mudras.byAct[actKey] || null, mudraCite: C.mudras.cite,
    rosary: C.rosaries.byAct[actKey] || null, rosaryCite: C.rosaries.cite,
    finger: C.fingers.byAct[actKey] || null, fingerCite: C.fingers.cite,
    hand: actKey === 'vasya' ? 'the LEFT (vāma) hand' : 'the right hand',
    handCite: C.handRule.cite,
  };
}

// --- the screen --------------------------------------------------------------
//  shatkarmanScreen(date, lat, lon, act) → the timing read-out for one act.
//  `date` is a Date (UTC instant); `act` is one of the six act keys
//  (santi, vasya, stambhana, vidvesana, uccatana, marana).
export function shatkarmanScreen(date, lat, lon, act = 'santi') {
  const actKey = ACT_KEYS.includes(act) ? act : 'santi';
  const meta = actMeta(actKey);

  const chart = castChart(date, lat, lon);
  const vedic = castVedic(chart);
  const ph = planetaryHour(date, lat, lon);
  if (!ph || !ph.sunrise || !ph.sunset || !ph.nextSunrise) {
    return {
      act: actKey, error: 'The sunrise/sunset for this date & place could not be computed (polar day/night, or an unusual latitude).',
      caveat: SHATKARMAN_CAVEAT,
    };
  }

  const ritu = rituOf(vedic);
  const ghatika = ghatikaBlock(date, ph.sunrise);
  const part = dayPart(date, ph.sunrise, ph.sunset, ph.nextSunrise);
  const fortnight = fortnightOf(vedic);
  const prescriptions = prescriptionsFor(actKey);

  // matches: which prescribed slots does the current moment satisfy for this act?
  const matches = [];
  matches.push({
    slot: 'season (calendar ṛtu, scheme A / Table C)',
    prescribed: prescriptions.season ? `${prescriptions.season.translit} (${prescriptions.season.gloss})` : '—',
    current: `${ritu.translit} (${ritu.gloss})`,
    match: !!prescriptions.season && ritu.key === prescriptions.season.key,
    cite: prescriptions.seasonCite,
  });
  matches.push({
    slot: 'ghaṭikā-cycle block (scheme A, within the day)',
    prescribed: prescriptions.season ? `${prescriptions.season.translit} block` : '—',
    current: `${ghatika.translit} block (ghaṭikā ${ghatika.ghatikaNumber} after sunrise)`,
    match: ghatika.prescribesAct === actKey,
    cite: ghatika.source,
  });
  matches.push({
    slot: 'day-part (scheme B, BPK 3.6-7)',
    prescribed: prescriptions.dayPartBPK ? `${prescriptions.dayPartBPK.translit} (${prescriptions.dayPartBPK.gloss})` : '—',
    current: `${part.translit} (${part.gloss})`,
    match: part.prescribesActs.includes(actKey),
    cite: part.source,
  });
  matches.push({
    slot: 'lunar fortnight (paksha)',
    prescribed: prescriptions.fortnight,
    current: `${fortnight.half} half — tithi ${fortnight.tithiNum} (${fortnight.tithiName})`,
    match: CORRESPONDENCES.fortnight.darkActs.includes(actKey) ? fortnight.isDark
      : CORRESPONDENCES.fortnight.brightActs.includes(actKey) ? !fortnight.isDark
        : null,   // no rule → not scored
    cite: fortnight.source,
  });

  return {
    act: actKey,
    actLabel: meta ? `${meta.translit} — ${meta.gloss}` : actKey,
    actClass: meta ? meta.cls : null,
    prescriptions,
    currentMoment: {
      instant: date.toISOString(),
      ritu, ghatikaSeason: ghatika, dayPart: part, fortnight,
      sunrise: ph.sunrise, sunset: ph.sunset, nextSunrise: ph.nextSunrise,
      sunRashi: vedic.grahas.Sun.rashi, ayanamsa: vedic.ayanamsa,
    },
    matches,
    conflictNote: DAY_PARTS.conflictNote,
    caveat: SHATKARMAN_CAVEAT,
  };
}
