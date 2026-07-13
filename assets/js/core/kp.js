// ============================================================================
//  kp.js — KP (Krishnamurti Paddhati): the 249-entry sub-lord table and the
//  KP layer over the Workbench's sidereal (Vedic) chart. PURE — no DOM, no
//  network, no randomness.
//
//  THE TABLE IS A SELF-VERIFIABLE ARITHMETIC OBJECT (like the magic squares):
//  the zodiac = 27 nakṣatras of 13°20′ (48 000″) each, lords cycling
//  Ketu→Venus→Sun→Moon→Mars→Rāhu→Jupiter→Saturn→Mercury from Aśvinī at
//  0° sidereal Aries. Each nakṣatra is cut into NINE SUBS proportional to the
//  Vimśottarī daśā years (sub arc = years × 400″; the nine arcs sum to exactly
//  48 000″), the sub sequence STARTING from the nakṣatra's own star-lord and
//  proceeding in Vimśottarī order. 27 × 9 = 243 sub-arcs; the six rāśi (sign)
//  boundaries that fall mid-sub (0° Taurus/Cancer/Virgo/Scorpio/Capricorn/
//  Pisces) split their sub in two, giving EXACTLY 249 numbered entries with
//  exactly 6 split subs — the Rāhu sub in the Sun-ruled boundary nakṣatras
//  (Kṛttikā, U.Phalgunī, U.Āṣāḍhā) and the Moon sub in the Jupiter-ruled ones
//  (Punarvasu, Viśākhā, P.Bhādrapadā). The Mars-ruled boundary nakṣatras never
//  split: Mars+Rāhu+Jupiter+Saturn arcs = exactly 400′, so the sign line falls
//  exactly on the Saturn|Mercury sub junction. All arithmetic here is integer
//  arc-seconds, so every boundary is exact — no floating point drift.
//
//  SOURCES: K. S. Krishnamurti, KP Reader IV (sub-lord theory) and KP Reader VI
//  "Horary Astrology" (the querent's number 1–249 fixes the horary ascendant;
//  remaining cusps Placidus for the time & place of judgment) — the readers are
//  scanned at archive.org/details/kp-readers; the published 1–249 chart at
//  jyotishportal.com/KPResource/KP1-249.aspx is the table witness (all sampled
//  rows verified verbatim against this generator); sub proportions are the BPHS
//  Vimśottarī years already encoded in ./data/vedic-data.js. KP, like all
//  astrology, has no demonstrated predictive validity — the table is described
//  as Krishnamurti's method, never prescribed.
// ============================================================================
import { VIMSHOTTARI, VIMSHOTTARI_TOTAL, NAKSHATRAS, RASHIS, nakshatraOf } from './data/vedic-data.js';

const norm360 = x => ((x % 360) + 360) % 360;

const NAK_SEC = 48000;      // 13°20′ in arc-seconds
const SIGN_SEC = 108000;    // 30° in arc-seconds
const YEAR_SEC = NAK_SEC / VIMSHOTTARI_TOTAL; // 400″ of arc per Vimśottarī year

export const KP_CITATION = 'K. S. Krishnamurti, KP Reader VI "Horary Astrology" (number 1–249 → the horary ascendant; Placidus cusps for the time & place of judgment) and KP Reader IV (sub-lord theory), archive.org/details/kp-readers; table witness: the published 1–249 chart, jyotishportal.com/KPResource/KP1-249.aspx; sub proportions = the BPHS Vimśottarī years. The table is self-verifiable: 27 nakṣatras × 9 subs (years × 400″), sub sequence from each nakṣatra’s own lord, split at rāśi boundaries → exactly 249 entries.';

// In-data discrepancy flags — stored, never silently resolved.
export const KP_FLAGS = [
  'House cusps: KP proper uses PLACIDUS cusps (KP Reader VI) computed sidereally; this page reckons the 12 cusps whole-sign from the praśna lagna, the convention of this site’s Vedic wing. Beyond the lagna itself, KP software would give different cusp sub-lords.',
  'Ayanāṁśa: chart positions here use Lahiri (Citrāpakṣa); Krishnamurti’s own ayanāṁśa (with published "old KP"/"new KP" variants) differs by ~5–6′, enough to flip a star- or sub-lord near a boundary. The 1–249 TABLE itself is ayanāṁśa-independent — a pure partition of the sidereal circle from 0° Aries.',
  'Published tables sometimes print a row’s start 1″ above the previous row’s end (e.g. JyotishPortal No. 76 "18°33′21″" vs the exact boundary 18°33′20″ Cancer) — an anti-overlap display convention, not a different value. This table uses the exact boundaries.',
  'A published explainer (RoxyAPI) attributes the 6 extra entries to "nakshatra boundary" splits — arithmetically impossible, since each nakṣatra’s nine subs sum to exactly its own 800′ span; the splits are at rāśi (sign) boundaries, as this generator proves.',
  'Horary-number ascendant degree: taking the START of the chosen sub-arc as the ascendant is the standard implemented software convention, not a verbatim quoted KP Reader VI passage — flagged as convention.',
  'Nodes: this site’s Vedic chart uses the MEAN node for Rāhu/Ketu; KP practitioners conventionally use the true node. Near-boundary star/sub lords of the nodes may differ.',
];

// ---------------------------------------------------------------------------
//  buildSubLordTable() — generate (and memoize) the 249-entry table.
//  Entry: { num (1–249), fromDeg, toDeg (absolute sidereal °), fromSec, toSec,
//           sign, signSanskrit, signIndex, signLord, nakshatra,
//           nakshatraSanskrit, nakshatraNum, starLord, subLord, split }
//  `split` marks BOTH halves of a sub cut by a rāśi boundary (6 subs → 12
//  flagged entries). Arcs partition [0°, 360°) exactly.
// ---------------------------------------------------------------------------
let _table = null;
export function buildSubLordTable() {
  if (_table) return _table;
  const entries = [];
  let num = 1;
  for (let n = 0; n < 27; n++) {
    const nak = NAKSHATRAS[n];
    const startIdx = VIMSHOTTARI.findIndex(v => v.lord === nak.lord); // = n % 9 by construction
    let pos = n * NAK_SEC;
    for (let j = 0; j < 9; j++) {
      const sub = VIMSHOTTARI[(startIdx + j) % 9];
      const from = pos, to = pos + sub.years * YEAR_SEC;
      const push = (a, b, split) => {
        const si = Math.floor(a / SIGN_SEC);
        entries.push({
          num: num++, fromDeg: a / 3600, toDeg: b / 3600, fromSec: a, toSec: b,
          sign: RASHIS[si].name, signSanskrit: RASHIS[si].sanskrit, signIndex: si,
          signLord: RASHIS[si].lord,
          nakshatra: nak.name, nakshatraSanskrit: nak.sanskrit, nakshatraNum: nak.num,
          starLord: nak.lord, subLord: sub.lord, split,
        });
      };
      // a rāśi boundary strictly inside this sub splits it in two numbered entries
      const boundary = (Math.floor(from / SIGN_SEC) + 1) * SIGN_SEC;
      if (boundary < to) { push(from, boundary, true); push(boundary, to, true); }
      else push(from, to, false);
      pos = to;
    }
  }
  _table = entries;
  return _table;
}

// ---------------------------------------------------------------------------
//  subLordOf(siderealLon) — the star-lord / sub-lord of a sidereal longitude.
//  Binary search over the exact integer-arc-second boundaries.
// ---------------------------------------------------------------------------
export function subLordOf(siderealLon) {
  const t = buildSubLordTable();
  let sec = norm360(siderealLon) * 3600; // in [0, 1 296 000)
  // snap float noise onto exact boundaries: table boundaries are integers, and
  // repeating-decimal degrees (e.g. 18°33′20″ Cancer = 108.5̅5°) can land a
  // hair below their own arc-second value
  const snapped = Math.round(sec);
  if (Math.abs(sec - snapped) < 1e-6) sec = snapped;
  if (sec >= 1296000) sec = 0;
  let lo = 0, hi = t.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (t[mid].toSec <= sec) lo = mid + 1; else hi = mid;
  }
  const entry = t[lo];
  return { starLord: entry.starLord, subLord: entry.subLord, signLord: entry.signLord, entry };
}

// ---------------------------------------------------------------------------
//  kpForNumber(n) — the KP horary-number convention (KP Reader VI): the
//  QUERENT (not the astrologer) picks a number 1–249; that number's sub-arc
//  fixes the praśna/horary ASCENDANT (No. 1 = 0° Aries Aśvinī Ketu/Ketu;
//  No. 249 = the last sub of Revatī). The ascendant degree is taken at the
//  start of the arc (implemented software convention — see KP_FLAGS). The
//  planets are computed for the time of judgment as usual.
// ---------------------------------------------------------------------------
export function kpForNumber(n) {
  const num = Math.round(Number(n));
  if (!Number.isFinite(num) || num < 1 || num > 249) return null;
  const entry = buildSubLordTable()[num - 1];
  return {
    number: num, entry, ascLon: entry.fromDeg,
    convention: 'KP horary (KP Reader VI): the querent picks a number 1–249; the number’s sub-arc fixes the ascendant (degree taken at the start of the arc — implemented convention), while the planets stand for the moment of judgment.',
    cite: KP_CITATION,
  };
}

// ---------------------------------------------------------------------------
//  kpSignificators(vedicChart) — the KP layer over a castVedic() result:
//  the lagna's star/sub lords, the 12 cusp sub-lords (whole-sign: cusp 1 = the
//  lagna degree itself; cusps 2–12 = 0° of each following rāśi — a flagged
//  departure from KP's Placidus, see KP_FLAGS), and each graha's star/sub.
//  In KP doctrine the cuspal sub-lord is the claimed "final judge" of a
//  house's matter (sign lord = context, star lord = flow, sub-lord = verdict)
//  — reported here as Krishnamurti's method, never as a working truth.
// ---------------------------------------------------------------------------
export function kpSignificators(vedicChart) {
  const v = vedicChart;
  const lagnaLon = v.lagna.lon;
  const lagnaS = subLordOf(lagnaLon);
  const cusps = [];
  for (let h = 1; h <= 12; h++) {
    const signIndex = (v.lagna.rashiIndex + h - 1) % 12;
    const lon = h === 1 ? lagnaLon : signIndex * 30;
    const s = subLordOf(lon);
    cusps.push({
      house: h, sign: RASHIS[signIndex].name, signSanskrit: RASHIS[signIndex].sanskrit,
      lon, signLord: s.signLord, starLord: s.starLord, subLord: s.subLord,
    });
  }
  const planets = Object.keys(v.grahas).map(p => {
    const g = v.grahas[p];
    const s = subLordOf(g.lon);
    return {
      planet: p, lon: g.lon, house: g.house, sign: g.rashi,
      nakshatra: nakshatraOf(g.lon).name, starLord: s.starLord, subLord: s.subLord,
    };
  });
  return {
    lagna: { lon: lagnaLon, sign: v.lagna.rashi, signLord: lagnaS.signLord, starLord: lagnaS.starLord, subLord: lagnaS.subLord, entryNum: lagnaS.entry.num },
    moon: planets.find(p => p.planet === 'Moon') || null,
    cusps, planets,
    cuspNote: KP_FLAGS[0],
    citation: KP_CITATION,
    flags: KP_FLAGS,
  };
}
