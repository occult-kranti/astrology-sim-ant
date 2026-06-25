// ============================================================================
//  vedic-data.js — the cited reference data for the VEDIC (Jyotiṣa / sidereal)
//  system, modelled on Jagannath Hora (JHora, P.V.R. Narasimha Rao). It is a
//  SEPARATE system from the Western/tropical engine: sidereal zodiac (tropical −
//  ayanāṁśa), the 27 nakṣatras, the Vimśottarī daśā, the Pañcāṅga, the
//  divisional charts (vargas), and the Parāśarī dignities.
//
//  SOURCES (every contested value cites one): Parāśara, Bṛhat Parāśara Horā
//  Śāstra (BPHS); P.V.R. Narasimha Rao, "Vedic Astrology: An Integrated
//  Approach"; the Lahiri (Citrāpakṣa) ayanāṁśa of the Indian Astronomical
//  Ephemeris. Presented as a historical/cultural calculation system for study —
//  astrology has no demonstrated predictive validity.
// ============================================================================
const norm360 = x => ((x % 360) + 360) % 360;

// --- The Lahiri (Chitrapaksha) ayanamsa --------------------------------------
// We use LAHIRI (Citrāpakṣa) — the Indian government standard and the historic
// JHora default. (Note: current JHora/PyJHora defaults to "True Puṣya", and
// "True Citra" is another option; all three sit within ~1′ of Lahiri, far below
// the 13°20′ nakṣatra / 3°20′ pada resolution at which a placement changes.)
// Linear model anchored at J2000.0 = 23.8531° (23°51′11″, ICRC value) with the
// precessional rate ≈50.2877″/yr — accurate to ~1″ for modern dates.
// Source: Lahiri ayanamsa, Indian Astronomical Ephemeris; Swiss Ephemeris;
// P.V.R. Narasimha Rao (JHora). True-Puṣya/True-Citra are flagged alternatives.
export const AYANAMSA_J2000 = 23.8531;          // degrees at 2000-01-01 12:00 TT
export const AYANAMSA_RATE = 50.2877 / 3600;    // degrees/year
export function lahiriAyanamsa(date) {
  const jd = (date instanceof Date ? date.getTime() : new Date(date).getTime()) / 86400000 + 2440587.5;
  const years = (jd - 2451545.0) / 365.25;
  return AYANAMSA_J2000 + AYANAMSA_RATE * years;
}
// sidereal = tropical − ayanamsa
export function toSidereal(tropicalLon, date) { return norm360(tropicalLon - lahiriAyanamsa(date)); }

// --- The 12 rāśis (signs) ----------------------------------------------------
// lord = sign ruler (Parāśarī); element + mode for reference. Index 0 = Meṣa/Aries.
export const RASHIS = [
  { name: 'Aries', sanskrit: 'Meṣa', lord: 'Mars', element: 'Fire', mode: 'Movable' },
  { name: 'Taurus', sanskrit: 'Vṛṣabha', lord: 'Venus', element: 'Earth', mode: 'Fixed' },
  { name: 'Gemini', sanskrit: 'Mithuna', lord: 'Mercury', element: 'Air', mode: 'Dual' },
  { name: 'Cancer', sanskrit: 'Karka', lord: 'Moon', element: 'Water', mode: 'Movable' },
  { name: 'Leo', sanskrit: 'Siṁha', lord: 'Sun', element: 'Fire', mode: 'Fixed' },
  { name: 'Virgo', sanskrit: 'Kanyā', lord: 'Mercury', element: 'Earth', mode: 'Dual' },
  { name: 'Libra', sanskrit: 'Tulā', lord: 'Venus', element: 'Air', mode: 'Movable' },
  { name: 'Scorpio', sanskrit: 'Vṛścika', lord: 'Mars', element: 'Water', mode: 'Fixed' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', lord: 'Jupiter', element: 'Fire', mode: 'Dual' },
  { name: 'Capricorn', sanskrit: 'Makara', lord: 'Saturn', element: 'Earth', mode: 'Movable' },
  { name: 'Aquarius', sanskrit: 'Kumbha', lord: 'Saturn', element: 'Air', mode: 'Fixed' },
  { name: 'Pisces', sanskrit: 'Mīna', lord: 'Jupiter', element: 'Water', mode: 'Dual' },
];
export const RASHI_SOURCE = 'BPHS — the twelve rāśis and their lords.';

// --- The 27 nakṣatras (lunar mansions) + Vimśottarī lord ---------------------
// 13°20′ each from 0° sidereal Aries (Aśvinī). Source: BPHS; Rao.
export const NAKSHATRA_ARC = 360 / 27; // 13.3333°
export const NAKSHATRAS = [
  { num: 1, name: 'Ashwini', sanskrit: 'Aśvinī', lord: 'Ketu', deity: 'Aśvins' },
  { num: 2, name: 'Bharani', sanskrit: 'Bharaṇī', lord: 'Venus', deity: 'Yama' },
  { num: 3, name: 'Krittika', sanskrit: 'Kṛttikā', lord: 'Sun', deity: 'Agni' },
  { num: 4, name: 'Rohini', sanskrit: 'Rohiṇī', lord: 'Moon', deity: 'Brahmā' },
  { num: 5, name: 'Mrigashira', sanskrit: 'Mṛgaśīrṣa', lord: 'Mars', deity: 'Soma' },
  { num: 6, name: 'Ardra', sanskrit: 'Ārdrā', lord: 'Rahu', deity: 'Rudra' },
  { num: 7, name: 'Punarvasu', sanskrit: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { num: 8, name: 'Pushya', sanskrit: 'Puṣya', lord: 'Saturn', deity: 'Bṛhaspati' },
  { num: 9, name: 'Ashlesha', sanskrit: 'Āśleṣā', lord: 'Mercury', deity: 'Nāgas' },
  { num: 10, name: 'Magha', sanskrit: 'Maghā', lord: 'Ketu', deity: 'Pitṛs' },
  { num: 11, name: 'Purva Phalguni', sanskrit: 'Pūrva Phalgunī', lord: 'Venus', deity: 'Bhaga' },
  { num: 12, name: 'Uttara Phalguni', sanskrit: 'Uttara Phalgunī', lord: 'Sun', deity: 'Aryaman' },
  { num: 13, name: 'Hasta', sanskrit: 'Hasta', lord: 'Moon', deity: 'Savitṛ' },
  { num: 14, name: 'Chitra', sanskrit: 'Citrā', lord: 'Mars', deity: 'Tvaṣṭṛ' },
  { num: 15, name: 'Swati', sanskrit: 'Svātī', lord: 'Rahu', deity: 'Vāyu' },
  { num: 16, name: 'Vishakha', sanskrit: 'Viśākhā', lord: 'Jupiter', deity: 'Indrāgni' },
  { num: 17, name: 'Anuradha', sanskrit: 'Anurādhā', lord: 'Saturn', deity: 'Mitra' },
  { num: 18, name: 'Jyeshtha', sanskrit: 'Jyeṣṭhā', lord: 'Mercury', deity: 'Indra' },
  { num: 19, name: 'Mula', sanskrit: 'Mūla', lord: 'Ketu', deity: 'Nirṛti' },
  { num: 20, name: 'Purva Ashadha', sanskrit: 'Pūrva Āṣāḍhā', lord: 'Venus', deity: 'Āpas' },
  { num: 21, name: 'Uttara Ashadha', sanskrit: 'Uttara Āṣāḍhā', lord: 'Sun', deity: 'Viśvedevas' },
  { num: 22, name: 'Shravana', sanskrit: 'Śravaṇa', lord: 'Moon', deity: 'Viṣṇu' },
  { num: 23, name: 'Dhanishtha', sanskrit: 'Dhaniṣṭhā', lord: 'Mars', deity: 'Vasus' },
  { num: 24, name: 'Shatabhisha', sanskrit: 'Śatabhiṣā', lord: 'Rahu', deity: 'Varuṇa' },
  { num: 25, name: 'Purva Bhadrapada', sanskrit: 'Pūrva Bhādrapadā', lord: 'Jupiter', deity: 'Aja Ekapāda' },
  { num: 26, name: 'Uttara Bhadrapada', sanskrit: 'Uttara Bhādrapadā', lord: 'Saturn', deity: 'Ahir Budhnya' },
  { num: 27, name: 'Revati', sanskrit: 'Revatī', lord: 'Mercury', deity: 'Pūṣan' },
];
export const NAKSHATRA_SOURCE = 'BPHS — the 27 nakṣatras and their Vimśottarī lords.';

// nakshatra (1..27) + pada (1..4) of a sidereal longitude
export function nakshatraOf(siderealLon) {
  const l = norm360(siderealLon);
  const idx = Math.floor(l / NAKSHATRA_ARC);
  const within = l - idx * NAKSHATRA_ARC;
  const pada = Math.floor(within / (NAKSHATRA_ARC / 4)) + 1;
  const n = NAKSHATRAS[idx];
  return { num: n.num, name: n.name, sanskrit: n.sanskrit, lord: n.lord, deity: n.deity, pada, fraction: within / NAKSHATRA_ARC };
}

// --- Vimśottarī daśā: order + years (total 120) ------------------------------
// Source: BPHS — the Vimśottarī daśā (120-year cycle).
export const VIMSHOTTARI = [
  { lord: 'Ketu', years: 7 }, { lord: 'Venus', years: 20 }, { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 }, { lord: 'Mars', years: 7 }, { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 }, { lord: 'Saturn', years: 19 }, { lord: 'Mercury', years: 17 },
];
export const VIMSHOTTARI_TOTAL = 120;
export const VIMSHOTTARI_SOURCE = 'BPHS — Vimśottarī daśā order & year-spans (Ketu 7 … Mercury 17 = 120).';

// --- Exaltation / debilitation / own / mūlatrikoṇa (Parāśarī) ----------------
// deg = exact exaltation degree. Debilitation is the opposite sign, same degree.
// Source: BPHS — exaltation/debilitation of the grahas.
// Rahu/Ketu: JHora & P.V.R. Rao use Rahu↑Gemini, Ketu↑Sagittarius (a competing
// BPHS-translation camp uses Taurus/Scorpio — flagged, not used here).
export const EXALTATION = {
  Sun: { sign: 0, deg: 10 }, Moon: { sign: 1, deg: 3 }, Mars: { sign: 9, deg: 28 },
  Mercury: { sign: 5, deg: 15 }, Jupiter: { sign: 3, deg: 5 }, Venus: { sign: 11, deg: 27 },
  Saturn: { sign: 6, deg: 20 }, Rahu: { sign: 2, deg: null }, Ketu: { sign: 8, deg: null },
};
// own signs (rāśis a graha rules)
export const OWN_SIGNS = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11],
  Venus: [1, 6], Saturn: [9, 10], Rahu: [], Ketu: [],
};
// mūlatrikoṇa sign (a graha's strongest non-exaltation zone). Source: BPHS.
export const MOOLATRIKONA = { Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10 };
export const DIGNITY_SOURCE = 'BPHS — exaltation, debilitation, own sign & mūlatrikoṇa.';

// --- The grahas (with karaka significations) ---------------------------------
// Source: BPHS — the natural significations (kāraka) of the nine grahas.
export const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
export const GRAHA_SANSKRIT = { Sun: 'Sūrya', Moon: 'Candra', Mars: 'Maṅgala', Mercury: 'Budha', Jupiter: 'Guru', Venus: 'Śukra', Saturn: 'Śani', Rahu: 'Rāhu', Ketu: 'Ketu' };
export const KARAKAS = {
  Sun: 'soul, father, authority, vitality, the king',
  Moon: 'mind, mother, emotions, the public, fluids',
  Mars: 'energy, courage, siblings, land, conflict',
  Mercury: 'intellect, speech, commerce, learning',
  Jupiter: 'wisdom, children, wealth, dharma, the guru',
  Venus: 'love, marriage, art, luxury, vehicles',
  Saturn: 'discipline, longevity, sorrow, labour, delay',
  Rahu: 'obsession, foreignness, illusion, sudden rise',
  Ketu: 'detachment, mokṣa, the past, the headless',
};

// --- Pañcāṅga names ----------------------------------------------------------
// Source: BPHS / classical pañcāṅga.
export const TITHIS = ['Pratipadā', 'Dvitīyā', 'Tṛtīyā', 'Caturthī', 'Pañcamī', 'Ṣaṣṭhī', 'Saptamī', 'Aṣṭamī', 'Navamī', 'Daśamī', 'Ekādaśī', 'Dvādaśī', 'Trayodaśī', 'Caturdaśī', 'Pūrṇimā/Amāvāsyā'];
export const YOGAS = ['Viṣkambha', 'Prīti', 'Āyuṣmān', 'Saubhāgya', 'Śobhana', 'Atigaṇḍa', 'Sukarman', 'Dhṛti', 'Śūla', 'Gaṇḍa', 'Vṛddhi', 'Dhruva', 'Vyāghāta', 'Harṣaṇa', 'Vajra', 'Siddhi', 'Vyatīpāta', 'Variyān', 'Parigha', 'Śiva', 'Siddha', 'Sādhya', 'Śubha', 'Śukla', 'Brahma', 'Aindra', 'Vaidhṛti'];
export const KARANAS_MOVABLE = ['Bava', 'Bālava', 'Kaulava', 'Taitila', 'Gara', 'Vaṇija', 'Viṣṭi']; // repeat
export const KARANAS_FIXED = ['Śakuni', 'Catuṣpāda', 'Nāga', 'Kiṁstughna']; // the 4 fixed
export const VARA_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']; // Sun=Sunday … (getUTCDay 0..6)
export const VARA_NAMES = ['Ravivāra', 'Somavāra', 'Maṅgalavāra', 'Budhavāra', 'Guruvāra', 'Śukravāra', 'Śanivāra'];
export const PANCHANGA_SOURCE = 'Classical pañcāṅga — tithi, vāra, nakṣatra, yoga, karaṇa.';

// --- Divisional charts (vargas): the sign a sidereal longitude maps to -------
// Implements the standard Parāśarī rules for the common vargas. Returns the
// 0-based sign index of the planet in the Dn chart. Source: BPHS (ṣoḍaśavarga).
const movFixDual = si => si % 3; // 0 movable, 1 fixed, 2 dual
export function vargaSign(siderealLon, n) {
  const l = norm360(siderealLon);
  const si = Math.floor(l / 30);            // rāśi index
  const deg = l - si * 30;                  // degrees in sign (0..30)
  const part = Math.floor(deg / (30 / n));  // 0-based division index within the sign
  switch (n) {
    case 1: return si;                                            // D1 Rāśi
    case 2: { // D2 Horā — odd signs: 0–15 Sun(Leo)/15–30 Moon(Cancer); even reversed
      const odd = si % 2 === 0;             // si even index = odd sign (Aries=1)
      const firstHalf = deg < 15;
      return (odd === firstHalf) ? 4 /*Leo*/ : 3 /*Cancer*/;
    }
    case 3: return (si + part * 4) % 12;                          // D3 Drekkāṇa: same/5th/9th
    case 4: return (si + part * 3) % 12;                          // D4 Caturthāṁśa: same/4th/7th/10th
    case 7: { // D7 Saptāṁśa: odd from same sign, even from the 7th
      const start = (si % 2 === 0) ? si : (si + 6) % 12;
      return (start + part) % 12;
    }
    case 9: { // D9 Navāṁśa: from movable→same, fixed→9th, dual→5th
      const start = [si, (si + 8) % 12, (si + 4) % 12][movFixDual(si)];
      return (start + part) % 12;
    }
    case 10: { // D10 Daśāṁśa: odd from same, even from the 9th
      const start = (si % 2 === 0) ? si : (si + 8) % 12;
      return (start + part) % 12;
    }
    case 12: return (si + part) % 12;                             // D12 Dvādaśāṁśa: from the sign itself
    case 16: { const start = [0, 4, 8][movFixDual(si)]; return (start + part) % 12; } // D16 from Aries/Leo/Sag
    case 20: { const start = [0, 8, 4][movFixDual(si)]; return (start + part) % 12; } // D20 from Aries/Sag/Leo
    case 24: { const start = (si % 2 === 0) ? 4 : 3; return (start + part) % 12; }     // D24 odd→Leo, even→Cancer
    case 27: { const start = [0, 3, 6, 9][si % 4]; return (start + part) % 12; }       // D27 Bhāṁśa by element
    case 30: { // D30 Triṁśāṁśa: unequal 5/5/8/7/5 ruled Mars/Sat/Jup/Merc/Venus (odd); reversed even
      const odd = si % 2 === 0;
      const bounds = odd ? [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]]   // [upper°, signIndex] Mars/Sat/Jup/Merc/Ven
                         : [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]];   // reversed for even signs
      for (const [up, sign] of bounds) if (deg < up) return sign;
      return bounds[4][1];
    }
    case 60: return (si + part) % 12;                            // D60 Ṣaṣṭyāṁśa (sign cycle; deity table omitted)
    default: return (si + part) % 12;
  }
}
export const VARGA_SOURCE = 'BPHS — the divisional charts (ṣoḍaśavarga); Parāśarī computation rules.';
export const VARGA_LIST = [
  { n: 1, key: 'D1', name: 'Rāśi (body)' }, { n: 2, key: 'D2', name: 'Horā (wealth)' },
  { n: 3, key: 'D3', name: 'Drekkāṇa (siblings)' }, { n: 4, key: 'D4', name: 'Caturthāṁśa (fortune/home)' },
  { n: 7, key: 'D7', name: 'Saptāṁśa (children)' }, { n: 9, key: 'D9', name: 'Navāṁśa (spouse/dharma)' },
  { n: 10, key: 'D10', name: 'Daśāṁśa (career)' }, { n: 12, key: 'D12', name: 'Dvādaśāṁśa (parents)' },
  { n: 16, key: 'D16', name: 'Ṣoḍaśāṁśa (vehicles/comfort)' }, { n: 20, key: 'D20', name: 'Viṁśāṁśa (worship)' },
  { n: 24, key: 'D24', name: 'Caturviṁśāṁśa (learning)' }, { n: 27, key: 'D27', name: 'Bhāṁśa (strengths)' },
  { n: 30, key: 'D30', name: 'Triṁśāṁśa (misfortune)' }, { n: 60, key: 'D60', name: 'Ṣaṣṭyāṁśa (past karma)' },
];

// --- Aṣṭakavarga (bindu tables) ----------------------------------------------
// For planet P's Bhinnāṣṭakavarga (BAV): each contributor (the 7 grahas + Lagna)
// gives a bindu to the houses (counted 1-indexed forward from the CONTRIBUTOR's
// own rāśi) listed below. SAV = sign-by-sign sum of the 7 planetary BAVs; its
// grand total is the universal checksum 337 (48+49+39+54+56+52+39).
// Source: BPHS Ch.66–67 (Sun cell-verified); the other six pass their bindu-sum
// checksums (vedastro.org / roxyapi). Diff against JHora as the gold standard.
export const ASHTAKAVARGA = {
  Sun: { Sun: [1, 2, 4, 7, 8, 9, 10, 11], Moon: [3, 6, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11], Mercury: [3, 5, 6, 9, 10, 11, 12], Jupiter: [5, 6, 9, 11], Venus: [6, 7, 12], Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Asc: [3, 4, 6, 10, 11, 12] },
  Moon: { Sun: [3, 6, 7, 8, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [2, 3, 5, 6, 9, 10, 11], Mercury: [1, 3, 4, 5, 7, 8, 10, 11], Jupiter: [1, 4, 7, 8, 10, 11, 12], Venus: [3, 4, 5, 7, 9, 10, 11], Saturn: [3, 5, 6, 11], Asc: [3, 6, 10, 11] },
  Mars: { Sun: [3, 5, 6, 10, 11], Moon: [3, 6, 11], Mars: [1, 2, 4, 7, 8, 10, 11], Mercury: [3, 5, 6, 11], Jupiter: [6, 10, 11, 12], Venus: [6, 8, 11, 12], Saturn: [1, 4, 7, 8, 9, 10, 11], Asc: [1, 3, 6, 10, 11] },
  Mercury: { Sun: [5, 6, 9, 11, 12], Moon: [2, 4, 6, 8, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11], Mercury: [1, 3, 5, 6, 9, 10, 11, 12], Jupiter: [6, 8, 11, 12], Venus: [1, 2, 3, 4, 5, 8, 9, 11], Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Asc: [1, 2, 4, 6, 8, 10, 11] },
  Jupiter: { Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11], Moon: [2, 5, 7, 9, 11], Mars: [1, 2, 4, 7, 8, 10, 11], Mercury: [1, 2, 4, 5, 6, 9, 10, 11], Jupiter: [1, 2, 3, 4, 7, 8, 10, 11], Venus: [2, 5, 6, 9, 10, 11], Saturn: [3, 5, 6, 12], Asc: [1, 2, 4, 5, 6, 7, 9, 10, 11] },
  Venus: { Sun: [8, 11, 12], Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12], Mars: [3, 5, 6, 9, 11, 12], Mercury: [3, 5, 6, 9, 11], Jupiter: [5, 8, 9, 10, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11], Saturn: [3, 4, 5, 8, 9, 10, 11], Asc: [1, 2, 3, 4, 5, 8, 9, 11] },
  Saturn: { Sun: [1, 2, 4, 7, 8, 10, 11], Moon: [3, 6, 11], Mars: [3, 5, 6, 10, 11, 12], Mercury: [6, 8, 9, 10, 11, 12], Jupiter: [5, 6, 11, 12], Venus: [6, 11, 12], Saturn: [3, 5, 6, 11], Asc: [1, 3, 4, 6, 10, 11] },
};
export const ASHTAKAVARGA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
export const ASHTAKAVARGA_SOURCE = 'BPHS Ch.66–67 — Bhinnāṣṭakavarga bindu tables; SAV grand total = 337.';

// --- Ṣaḍbala reference data (FULL six-fold — see vedic.js shadbala()) ---------
// Everything below is in BPHS Ch.27 terms. The Ṣaḍbala engine works in VIRŪPAS
// (1 rūpa = 60 virūpas) and divides by 60 at the end. Source: BPHS Ch.27;
// P.V.R. Narasimha Rao (Jagannath Hora).

// Naisargika (natural) bala in VIRŪPAS = 60 × rank/7. Source: BPHS 27.33.
export const NAISARGIKA_VIRUPA = { Sun: 60, Moon: 51.43, Venus: 42.86, Jupiter: 34.29, Mercury: 25.71, Mars: 17.14, Saturn: 8.57 };
// (kept in rūpas too for back-compat / display)
export const NAISARGIKA_BALA = { Sun: 1.0, Moon: 0.857, Venus: 0.714, Jupiter: 0.571, Mercury: 0.429, Mars: 0.286, Saturn: 0.143 };

// Dig (directional) bala: the kendra of full strength → its OPPOSITE point is the
// powerless point. Offset (from the Lagna longitude, zodiacally) to the powerless
// point: Sun/Mars powerless at +90° (4th), Jup/Merc at +180° (7th), Moon/Venus at
// +270° (10th), Saturn at +0° (Lagna). Source: BPHS 27.13–15.
export const DIG_POWERLESS_OFFSET = { Sun: 90, Mars: 90, Jupiter: 180, Mercury: 180, Moon: 270, Venus: 270, Saturn: 0 };
// (legacy whole-sign strong-house map, retained for reference)
export const DIG_BALA_STRONG_HOUSE = { Sun: 10, Moon: 4, Mars: 10, Mercury: 1, Jupiter: 1, Venus: 4, Saturn: 7 };

// Natural (naisargika) friendship — BPHS 3.55–57. Others (not listed) = neutral.
export const NATURAL_RELATION = {
  Sun: { friend: ['Moon', 'Mars', 'Jupiter'], enemy: ['Venus', 'Saturn'] },
  Moon: { friend: ['Sun', 'Mercury'], enemy: [] },
  Mars: { friend: ['Sun', 'Moon', 'Jupiter'], enemy: ['Mercury'] },
  Mercury: { friend: ['Sun', 'Venus'], enemy: ['Moon'] },
  Jupiter: { friend: ['Sun', 'Moon', 'Mars'], enemy: ['Mercury', 'Venus'] },
  Venus: { friend: ['Mercury', 'Saturn'], enemy: ['Sun', 'Moon'] },
  Saturn: { friend: ['Mercury', 'Venus'], enemy: ['Sun', 'Moon', 'Mars'] },
};
// Saptavargaja dignity tiers (virūpas), BPHS 27.7–9.
export const SAPTAVARGA_TIER = { moolatrikona: 45, own: 30, greatFriend: 22.5, friend: 15, neutral: 7.5, enemy: 3.75, greatEnemy: 1.875 };
export const SAPTAVARGA_VARGAS = [1, 2, 3, 7, 9, 12, 30];   // the 7 vargas for Saptavargaja

// Drekkāṇa (decanate) gender groups — BPHS 27.12 (15 virūpas if matched).
export const DREKKANA_GROUPS = [['Sun', 'Mars', 'Jupiter'], ['Saturn', 'Mercury'], ['Moon', 'Venus']];
// Benefics / malefics for Pakṣa & Dṛk bala (Mercury & Moon counted benefic — simplified, flagged).
export const SHADBALA_BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
export const SHADBALA_MALEFICS = ['Sun', 'Mars', 'Saturn'];
// Nathonnata: "nata" (nocturnal-strong) vs "unnata" (diurnal-strong); Mercury always 60.
export const NATA_GRAHAS = ['Moon', 'Mars', 'Saturn'];
export const UNNATA_GRAHAS = ['Sun', 'Jupiter', 'Venus'];
// Tribhāga lords of the three parts of day / night — BPHS 27.18 (+ Jupiter always 60).
export const TRIBHAGA_DAY = ['Mercury', 'Sun', 'Saturn'];
export const TRIBHAGA_NIGHT = ['Moon', 'Venus', 'Mars'];
// Ayana (declination) bala: north-strong grahas (Mercury counts both, handled in code).
export const AYANA_NORTH_STRONG = ['Sun', 'Mars', 'Jupiter', 'Venus'];
// Mean daily motion (°/day, sidereal) for Ceṣṭā bala — Sun/Moon handled specially.
export const MEAN_SPEED = { Sun: 0.9856, Moon: 13.176, Mars: 0.524, Mercury: 1.383, Jupiter: 0.083, Venus: 1.602, Saturn: 0.034 };
// Special full (60-virūpa) aspects by house-distance for Dṛk bala — BPHS.
export const SPECIAL_ASPECTS = { Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10] };

// Minimum required total Ṣaḍbala (Rūpas) for a graha to be "strong". BPHS 27.48–49.
export const SHADBALA_REQUIRED = { Sun: 6.5, Moon: 6.0, Mars: 5.0, Mercury: 7.0, Jupiter: 6.5, Venus: 5.5, Saturn: 5.0 };
export const SHADBALA_SOURCE = 'BPHS Ch.27 (graha-bala) — the full six-fold Ṣaḍbala (Sthāna, Dig, Kāla, Ceṣṭā, Naisargika, Dṛk) in virūpas; required minimums 27.48–49; cross-checked with Jagannath Hora (P.V.R. Narasimha Rao).';
