// ============================================================================
//  transits.js — TRANSITS TO A NATAL CHART. The single predictive technique
//  both Catherine Urban and Patrick Watson lean on daily, which the rest of the
//  engine lacked: for a nativity and a date window, find the EXACT-HIT instants
//  at which a transiting planet perfects a Ptolemaic aspect (conjunction,
//  sextile, square, trine, opposition) to a natal point — with applying vs
//  separating, retrograde re-hits (the 1-or-3 pass structure), the body's
//  stations & ingresses in the window, and the PROFECTION-ACTIVATED overlay
//  (transits BY the Lord of the Year, or TO the Lord of the Year / the profected
//  sign — the modern-Hellenistic "time-lord activated" filter).
//
//  CLASSICAL SOURCES (each rule cited; described, never prescribed):
//   • Dorotheus of Sidon, Carmen Astrologicum IV.1 (Pingree, Teubner 1976) —
//     the year is judged from the profected sign, its lord, AND the transits
//     to/from these places at the revolution.
//   • Vettius Valens, Anthologies Bk IV (Riley trans., 2010) — transits are
//     subordinate to the operative chronocrators (time-lords).
//   • Abū Maʿshar, On the Revolutions of the Years of Nativities (Dykes,
//     Persian Nativities IV, 2019) — the four-fold hierarchy direction →
//     profection → revolution → transit.
//   • Ptolemy, Tetrabiblos IV.10 (Robbins, Loeb 1940) — the "ingresses which are
//     made to the places of the times" (the classical transit-to-place idea).
//   • Lilly, Christian Astrology Bk III (1647), pp.715-746 — the revolution
//     judged with profections and "the transit of the Planets".
//  The AMPLIFICATION rule (a transit counts fully only when its planet is a
//  current time-lord) is the MODERN-HELLENISTIC RECONSTRUCTION of C. Brennan,
//  Hellenistic Astrology (2017) — labelled as such, never asserted as ancient.
//
//  HONEST FRAMING: astrology has no demonstrated predictive validity. This finds
//  real astronomical hit-dates inside a historical symbolic grammar — a study of
//  how the tradition timed a life, not a forecast.
//
//  PURE MODULE — no DOM, no network, no randomness; dates are passed in.
//  Positions come from the same engine the rest of the site uses (astro.js /
//  astronomy-engine, geocentric apparent true-equinox-of-date longitudes,
//  ≈1 arc-minute). A light single-vector longitude (the cycles.js idiom) drives
//  the coarse day-by-day scan; bodyPosition() (with speed) is used only at each
//  located instant for the retrograde flag — so a 2-year sweep stays fast.
// ============================================================================

import { bodyPosition, signOf, formatLon, norm360, SIGNS, PLANET_GLYPHS } from './astro.js';
import { ASPECTS } from './aspects.js';
import { moiety } from './data/dignities-data.js';
import { annualProfection } from './profections.js';
import { ageFromDates } from './progressions.js';
import {
  Body, GeoVector, Rotation_EQJ_ECT, RotateVector, SphereFromVector,
} from '../lib/astronomy.js';

const DAY_MS = 86400000;
const MAX_WINDOW_DAYS = 731; // ~2 years — the transit search is capped here.

// The largest time gap (days) between two crossings of the SAME natal target
// that still counts as one retrograde EPISODE (a 1-or-3 pass loop). A retrograde
// loop spans at most a few months; the next orbital lap is far larger — for the
// slow planets a lap is years, so a generous cut cleanly separates episodes.
// The Sun never retrogrades (0 → always single passes).
const EPISODE_GAP_DAYS = { Sun: 0, Moon: 5, Mercury: 60, Venus: 120, Mars: 260, Jupiter: 260, Saturn: 300 };

// Signed wrapped difference → (−180, 180].
const wrap180 = x => ((x % 360) + 540) % 360 - 180;

const BODY = {
  Sun: Body.Sun, Moon: Body.Moon, Mercury: Body.Mercury, Venus: Body.Venus,
  Mars: Body.Mars, Jupiter: Body.Jupiter, Saturn: Body.Saturn,
};

// Light of-date ecliptic longitude — one GeoVector, no speed (astro.js's
// bodyPosition triples that cost). Same GeoVector → Rotation_EQJ_ECT path.
function lonOfDate(name, date) {
  const vec = GeoVector(BODY[name], date, true);        // EQJ, aberration-corrected
  const sph = SphereFromVector(RotateVector(Rotation_EQJ_ECT(date), vec));
  return norm360(sph.lon);
}

// The transiting bodies offered. The Moon is DELIBERATELY EXCLUDED by default:
// at ~13°/day it perfects dozens of exact aspects a month, drowning a daily
// timeline — its transits belong to a monthly/lunar-return view, not here.
// Enable it with opts.includeMoon (a 6-hour sub-step then resolves its hits).
export const TRANSIT_BODIES_DEFAULT = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
export const TRANSIT_BODIES_ALL = ['Moon', ...TRANSIT_BODIES_DEFAULT];

// The natal points a transit may strike. The natal MOON is a valid TARGET (it
// is the transiting Moon that is fast, not the fixed natal degree).
export const NATAL_POINTS_DEFAULT = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Ascendant', 'Midheaven'];

export const TRANSITS_CITATION =
  'Transits judged with the profection: Dorotheus, Carmen IV.1 (Pingree 1976); Valens, Anthologies IV (Riley 2010); '
  + 'Abū Maʿshar, Revolutions (Dykes, Persian Nativities IV, 2019); Ptolemy, Tetrabiblos IV.10 (Robbins 1940); '
  + 'Lilly, Christian Astrology Bk III (1647), pp.715-746. The time-lord AMPLIFICATION filter (a transit counts fully '
  + 'only when its planet is a current time-lord) is the modern-Hellenistic reconstruction of C. Brennan, Hellenistic '
  + 'Astrology (2017) — labelled as reconstruction, not asserted as classical.';

// Each Ptolemaic aspect → the signed offset(s) whose zero-crossing is an exact
// hit. Conjunction/opposition are single-target; the others are cast from both
// sides (the dexter and sinister aspect), so both are searched.
function targetsFor(aspect) {
  if (aspect.angle === 0) return [0];
  if (aspect.angle === 180) return [180];
  return [aspect.angle, -aspect.angle];
}

// The longitude(s) of a natal point in a chart, keyed by display name.
export function natalPointLongitudes(chart) {
  const m = {};
  for (const n of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    if (chart.planets[n]) m[n] = chart.planets[n].lon;
  }
  if (chart.planets.NorthNode) m.NorthNode = chart.planets.NorthNode.lon;
  if (chart.planets.SouthNode) m.SouthNode = chart.planets.SouthNode.lon;
  if (chart.planets.Fortune) m.Fortune = chart.planets.Fortune.lon;
  m.Ascendant = chart.asc; m.Midheaven = chart.mc;
  m.Descendant = norm360(chart.asc + 180); m.IC = norm360(chart.mc + 180);
  return m;
}

// Refine a bracketed sign-change of d(t)=wrap180(lon−natal−τ) to the second.
function bisectHit(name, natalLon, tau, aMs, bMs) {
  let fa = wrap180(lonOfDate(name, new Date(aMs)) - natalLon - tau);
  for (let i = 0; i < 50 && bMs - aMs > 500; i++) { // 0.5 s floor
    const m = (aMs + bMs) / 2;
    const fm = wrap180(lonOfDate(name, new Date(m)) - natalLon - tau);
    if (fm === 0) { aMs = bMs = m; break; }
    if (fa * fm < 0) bMs = m; else { aMs = m; fa = fm; }
  }
  return Math.round((aMs + bMs) / 2);
}

// ---------------------------------------------------------------------------
//  transitTimeline(natalChart, startDate, endDate, opts?)
//
//  opts:
//    bodies       transiting bodies (default TRANSIT_BODIES_DEFAULT — no Moon)
//    includeMoon  add the Moon (fine 6-hour step)               [false]
//    natalPoints  which natal points to strike (default NATAL_POINTS_DEFAULT)
//    aspects      aspect angles to search (default [0,60,90,120,180])
//    profection   include the Lord-of-the-Year overlay          [true]
//
//  Returns {
//    window:{startISO,endISO,days}, bodies, natalPoints, aspects,
//    events:[{
//      transitingBody, natalPoint, natalPointLon, aspect, glyph, angle, target,
//      exactInstant(Date), exactISO, transitLon, transitLabel, orb,
//      retrograde, motion, passIndex, passCount, passNote,
//      timeLordActivated, timeLordReason,
//      profection:{age, profectedSign, lordOfYear} | null
//    }],                                             // sorted by instant
//    stations:[{body, instant, station:'retrograde'|'direct', lon, label}],
//    ingresses:[{body, instant, sign, lon}],
//    profectionsInWindow:[{age, profectedSign, lordOfYear, fromISO}],
//    citation
//  }
// ---------------------------------------------------------------------------
export function transitTimeline(natalChart, startDate, endDate, opts = {}) {
  if (!(startDate instanceof Date) || isNaN(startDate) || !(endDate instanceof Date) || isNaN(endDate)) {
    throw new Error('transitTimeline: startDate and endDate must be valid Dates');
  }
  if (endDate.getTime() <= startDate.getTime()) {
    throw new Error('transitTimeline: endDate must be after startDate');
  }
  const days = (endDate.getTime() - startDate.getTime()) / DAY_MS;
  if (days > MAX_WINDOW_DAYS) {
    throw new Error(`transitTimeline: window ${days.toFixed(0)} days exceeds the ${MAX_WINDOW_DAYS}-day (~2-year) cap — narrow the range`);
  }

  const bodies = (opts.bodies || TRANSIT_BODIES_DEFAULT)
    .concat(opts.includeMoon ? ['Moon'] : [])
    .filter((b, i, a) => BODY[b] && a.indexOf(b) === i);
  const pointMap = natalPointLongitudes(natalChart);
  const pointNames = (opts.natalPoints || NATAL_POINTS_DEFAULT).filter(n => pointMap[n] != null);
  const angleSet = opts.aspects || ASPECTS.map(a => a.angle);
  const aspects = ASPECTS.filter(a => angleSet.includes(a.angle));
  const doProfection = opts.profection !== false;

  const birth = natalChart.date instanceof Date ? natalChart.date : null;

  // Profection in force at an instant (age = completed tropical years at that
  // instant). Consumes profections.js output; it is NOT recomputed here.
  const profCache = new Map();
  function profectionAt(when) {
    if (!doProfection || !birth) return null;
    const age = Math.floor(ageFromDates(birth, when));
    if (age < 0) return null;
    if (!profCache.has(age)) {
      const p = annualProfection(natalChart, age);
      profCache.set(age, { age, profectedSignIndex: p.profectedSignIndex, profectedSign: p.profectedSign, lordOfYear: p.lordOfYear });
    }
    return profCache.get(age);
  }

  const t0 = startDate.getTime(), t1 = endDate.getTime();
  const events = [];
  const stations = [];
  const ingresses = [];

  for (const body of bodies) {
    const stepMs = (body === 'Moon' ? 0.25 : (opts.stepDays || 1)) * DAY_MS;

    // Sample the light longitude once per step across the whole window; reuse
    // the grid for every natal point / aspect / target of this body.
    const times = [];
    const lons = [];
    for (let t = t0; t <= t1 + 1; t += stepMs) {
      const tt = Math.min(t, t1);
      times.push(tt);
      lons.push(lonOfDate(body, new Date(tt)));
      if (tt === t1) break;
    }

    // Aspect hits: zero-crossings of d = wrap180(lon − natalLon − τ), guarding
    // the ±180 wrap (a real crossing steps by the body's daily motion, ≪90°).
    for (const pn of pointNames) {
      const natalLon = pointMap[pn];
      for (const asp of aspects) {
        for (const tau of targetsFor(asp)) {
          let prevD = wrap180(lons[0] - natalLon - tau);
          for (let i = 1; i < times.length; i++) {
            const d = wrap180(lons[i] - natalLon - tau);
            if ((prevD === 0 || prevD * d < 0) && Math.abs(d - prevD) < 90) {
              const ms = bisectHit(body, natalLon, tau, times[i - 1], times[i]);
              const when = new Date(ms);
              const pos = bodyPosition(body, when);
              const orb = Math.abs(wrap180(pos.lon - natalLon - tau));
              events.push({
                transitingBody: body, natalPoint: pn, natalPointLon: natalLon,
                aspect: asp.name, glyph: asp.glyph, nature: asp.nature, angle: asp.angle, target: tau,
                exactInstant: when, exactISO: when.toISOString(),
                transitLon: pos.lon, transitLabel: formatLon(pos.lon),
                orb, retrograde: pos.retrograde, motion: pos.retrograde ? 'retrograde' : 'direct',
                _groupKey: `${body}|${pn}|${asp.name}|${tau}`,
              });
            }
            prevD = d;
          }
        }
      }
    }

    // Stations: the finite-difference speed changes sign (retrograde ↔ direct).
    // Ingresses: the sign index changes. Both are read off the same grid and
    // refined; they are the "Dates + Degrees" context of the window.
    for (let i = 1; i < times.length - 1; i++) {
      const vPrev = wrap180(lons[i] - lons[i - 1]);
      const vNext = wrap180(lons[i + 1] - lons[i]);
      if (vPrev === 0 || vPrev * vNext < 0) {
        const when = new Date(Math.round((times[i - 1] + times[i + 1]) / 2));
        const pos = bodyPosition(body, when);
        stations.push({ body, instant: when, instantISO: when.toISOString(), station: pos.retrograde ? 'retrograde' : 'direct', lon: pos.lon, label: formatLon(pos.lon) });
      }
      const sPrev = Math.floor(norm360(lons[i - 1]) / 30);
      const sHere = Math.floor(norm360(lons[i]) / 30);
      if (sPrev !== sHere) {
        // bisect the boundary crossing for a cleaner instant
        let aMs = times[i - 1], bMs = times[i], entered = sHere;
        for (let k = 0; k < 40 && bMs - aMs > 60000; k++) {
          const mMs = (aMs + bMs) / 2;
          const s = Math.floor(norm360(lonOfDate(body, new Date(mMs))) / 30);
          if (s === sPrev) aMs = mMs; else { bMs = mMs; entered = s; }
        }
        const when = new Date(Math.round((aMs + bMs) / 2));
        ingresses.push({ body, instant: when, instantISO: when.toISOString(), signIndex: entered, sign: SIGNS[entered], lon: lonOfDate(body, when) });
      }
    }
  }

  // Retrograde re-hit passes: number each hit 1..m within one RETROGRADE
  // EPISODE — the classic 1-or-3 pass structure of a planet crossing a natal
  // degree through a single retrograde loop. Crossings of the same target in
  // DIFFERENT orbital laps (e.g. Venus re-crossing a trine point a lap later)
  // are separate single passes, NOT one triple — so consecutive crossings are
  // grouped into an episode only when their time gap is below the body's
  // retrograde-loop scale (a whole lap is far larger than a retrograde loop).
  events.sort((a, b) => a.exactInstant - b.exactInstant);
  const groups = new Map();
  for (const e of events) { const g = groups.get(e._groupKey) || []; g.push(e); groups.set(e._groupKey, g); }
  for (const g of groups.values()) {
    g.sort((a, b) => a.exactInstant - b.exactInstant);
    let episode = [];
    const flush = () => {
      episode.forEach((e, i) => {
        e.passIndex = i + 1; e.passCount = episode.length;
        e.passNote = episode.length === 1 ? 'single pass'
          : i === 0 ? `pass 1 of ${episode.length} (direct)`
            : i === episode.length - 1 ? `pass ${episode.length} of ${episode.length} (direct)`
              : `pass ${i + 1} of ${episode.length} (retrograde)`;
      });
      episode = [];
    };
    for (const e of g) {
      if (episode.length && (e.exactInstant - episode[episode.length - 1].exactInstant) / DAY_MS > EPISODE_GAP_DAYS[e.transitingBody]) flush();
      episode.push(e);
    }
    flush();
  }

  // Profection-activation overlay, evaluated at each event's own instant.
  for (const e of events) {
    const prof = profectionAt(e.exactInstant);
    e.profection = prof;
    let activated = false, reason = null;
    if (prof) {
      if (e.transitingBody === prof.lordOfYear) { activated = true; reason = 'by-LOTY'; }
      else if (e.natalPoint === prof.lordOfYear) { activated = true; reason = 'to-LOTY'; }
      else if (signOf(e.natalPointLon).index === prof.profectedSignIndex) { activated = true; reason = 'to-profected-sign'; }
    }
    e.timeLordActivated = activated; e.timeLordReason = reason;
    delete e._groupKey;
  }

  stations.sort((a, b) => a.instant - b.instant);
  ingresses.sort((a, b) => a.instant - b.instant);

  // The distinct profection years spanning the window (a window can straddle a
  // birthday, changing the Lord of the Year mid-stream).
  const profectionsInWindow = [];
  if (doProfection && birth) {
    const seen = new Set();
    for (let t = t0; t <= t1; t += DAY_MS) {
      const p = profectionAt(new Date(t));
      if (p && !seen.has(p.age)) { seen.add(p.age); profectionsInWindow.push({ ...p, fromISO: new Date(t).toISOString() }); }
    }
  }

  return {
    window: { startISO: startDate.toISOString(), endISO: endDate.toISOString(), days: Math.round(days) },
    bodies, natalPoints: pointNames, aspects: aspects.map(a => a.angle),
    events, stations, ingresses, profectionsInWindow,
    moonExcludedByDefault: !opts.includeMoon,
    citation: TRANSITS_CITATION,
  };
}

// ---------------------------------------------------------------------------
//  currentTransits(natalChart, date, opts?) — the SNAPSHOT: every transiting
//  aspect IN ORB to a natal point at a single instant, with the platic orb and
//  applying/separating (the state the exact-hit timeline cannot show, since an
//  exact hit is by definition neither). Reuses aspectBetween's Lilly moieties;
//  natal angles (Asc/MC…) carry no moiety, so an angle contact is judged by the
//  transiting planet's orb alone (flagged in the returned note).
//
//  Returns { date, contacts:[{transitingBody, natalPoint, aspect, glyph, orb,
//    applying, separating, retrograde, timeLordActivated, timeLordReason}],
//    profection, note }.
// ---------------------------------------------------------------------------
export function currentTransits(natalChart, date, opts = {}) {
  if (!(date instanceof Date) || isNaN(date)) throw new Error('currentTransits: date must be a valid Date');
  const bodies = (opts.bodies || TRANSIT_BODIES_ALL).filter(b => BODY[b]);
  const pointMap = natalPointLongitudes(natalChart);
  const pointNames = (opts.natalPoints || NATAL_POINTS_DEFAULT).filter(n => pointMap[n] != null);
  const angleSet = opts.aspects || ASPECTS.map(a => a.angle);
  const aspects = ASPECTS.filter(a => angleSet.includes(a.angle));

  const birth = natalChart.date instanceof Date ? natalChart.date : null;
  let prof = null;
  if (opts.profection !== false && birth) {
    const age = Math.floor(ageFromDates(birth, date));
    if (age >= 0) { const p = annualProfection(natalChart, age); prof = { age, profectedSignIndex: p.profectedSignIndex, profectedSign: p.profectedSign, lordOfYear: p.lordOfYear }; }
  }

  const contacts = [];
  for (const body of bodies) {
    const p = bodyPosition(body, date);
    for (const pn of pointNames) {
      const natalLon = pointMap[pn];
      const sepFromExact = aspects.map(asp => {
        const distance = Math.abs(wrap180(p.lon - natalLon));
        return { asp, orbOff: Math.abs(distance - asp.angle) };
      });
      const allowance = moiety(body) + (moiety(pn) || 0);
      const angleAllow = allowance === moiety(body) ? moiety(body) : allowance; // angle: planet's orb only
      for (const { asp, orbOff } of sepFromExact) {
        const allow = (pn === 'Ascendant' || pn === 'Midheaven' || pn === 'Descendant' || pn === 'IC') ? Math.max(angleAllow, moiety(body)) : allowance;
        if (orbOff <= allow) {
          // applying/separating: is the separation-from-exact shrinking?
          const dt = 0.02;
          const fut = norm360(p.lon + (p.speed || 0) * dt);
          const futOff = Math.abs(Math.abs(wrap180(fut - natalLon)) - asp.angle);
          const applying = futOff < orbOff;
          let activated = false, reason = null;
          if (prof) {
            if (body === prof.lordOfYear) { activated = true; reason = 'by-LOTY'; }
            else if (pn === prof.lordOfYear) { activated = true; reason = 'to-LOTY'; }
            else if (signOf(natalLon).index === prof.profectedSignIndex) { activated = true; reason = 'to-profected-sign'; }
          }
          contacts.push({
            transitingBody: body, natalPoint: pn, natalPointLon: natalLon,
            aspect: asp.name, glyph: asp.glyph, nature: asp.nature, angle: asp.angle,
            transitLon: p.lon, transitLabel: formatLon(p.lon),
            orb: orbOff, allowance: allow, applying, separating: !applying,
            retrograde: p.retrograde, motion: p.retrograde ? 'retrograde' : 'direct',
            timeLordActivated: activated, timeLordReason: reason,
          });
        }
      }
    }
  }
  contacts.sort((a, b) => a.orb - b.orb);
  return {
    date, dateISO: date.toISOString(), contacts, profection: prof,
    note: 'Orbs are Lilly’s planetary moieties (aspects.js). Natal angles carry no moiety, so an angle contact is judged by the transiting planet’s orb alone. Modern practice would use tighter aspect-based orbs.',
    citation: TRANSITS_CITATION,
  };
}

export const PLANET_GLYPH = p => PLANET_GLYPHS[p] || '';
