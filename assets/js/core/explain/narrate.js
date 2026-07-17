// ============================================================================
//  core/explain/narrate.js — "read this chart aloud", the guided reading order.
//  PURE (no DOM, no Date, no randomness): given a fullReading (core/reading.js),
//  returns the canonical Western-wheel READING SEQUENCE as an array of steps —
//
//      [{ el, title, say }, …]
//
//  where `el` is the wheel's `data-el` stamp (a string, or an array of them for a
//  step that lights several bodies), `title` names the step, and `say` is ONE
//  attributed-voice sentence built from the computed reading ("the tradition reads
//  this as…", "Lilly takes…") — never second-person destiny. The say-strings are
//  BANNED_PHRASES-clean (grep-tested in scripts/tests/r29-narrate.mjs) and every
//  `el` id references a stamp that core/chart.js actually draws (planet-<Name>,
//  cusp-<n>, aspect-<from>-<to>-<Aspect>).
//
//  Canonical cast-chart order (chart-ux.md §6): the Ascendant → the chart ruler →
//  the Sun → the Moon → the sect light → the angular planets → the tightest aspect
//  → the Part of Fortune. The app (app/narrate.js) steps through the sequence,
//  lighting each step's wheel element; the SAME array is serialized into the
//  reading for the AI assistant and the Markdown export.
// ============================================================================
import { tightestAspects } from './util.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const ANGLES = new Set([1, 4, 7, 10]);
const low = s => String(s || '').toLowerCase();

// English ordinal for a house number: 1 → "1st", 2 → "2nd", …
function ord(n) {
  const v = Number(n) || 0;
  const s = ['th', 'st', 'nd', 'rd'], r = v % 100;
  return v + (s[(r - 20) % 10] || s[r] || s[0]);
}

// Join a list into "A", "A and B", "A, B and C".
function joinAnd(list) {
  const a = list.filter(Boolean);
  if (!a.length) return '';
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
}

// The Moon's next applying contact among the seven (from the reading's aspect
// list) — or null when she is void of course (no applying aspect within orb).
function moonNextApplication(reading) {
  let best = null;
  for (const a of (reading.aspects && reading.aspects.list) || []) {
    const involvesMoon = a.from === 'Moon' || a.to === 'Moon';
    if (!involvesMoon || !a.applying) continue;
    if (!best || a.orb < best.orb) {
      best = { other: a.from === 'Moon' ? a.to : a.from, aspect: a.aspect, orb: a.orb };
    }
  }
  return best;
}

// A body's position clause, e.g. "12°34' Aries in the 3rd house, retrograde".
function place(p) {
  if (!p) return '';
  return `${p.label} in the ${ord(p.house)} house${p.retrograde ? ', retrograde' : ''}`;
}

// ---------------------------------------------------------------------------
//  narrateChart(reading) -> [{ el, title, say }]
//  The canonical guided reading order for a cast Western chart. Deterministic;
//  every step's `el` references a real core/chart.js data-el stamp.
// ---------------------------------------------------------------------------
export function narrateChart(reading) {
  if (!reading || !reading.moment) return [];
  const m = reading.moment;
  const P = m.planets || {};
  const asc = m.angles && m.angles.asc;
  const steps = [];

  // 1 — the frame: the Ascendant (east on the left)
  if (asc) {
    steps.push({
      el: 'cusp-1',
      title: 'The Ascendant',
      say: `East is on the left of the wheel: ${asc.label} was rising at this moment. Lilly's tradition takes the Ascendant for the doorway of the whole figure, read before anything else.`,
    });
  }

  // 2 — the chart ruler: the Lord of the Ascendant
  const lordAsc = reading.cautions && reading.cautions.lordAsc;
  if (lordAsc && P[lordAsc]) {
    steps.push({
      el: `planet-${lordAsc}`,
      title: 'The chart ruler',
      say: `The lord of the Ascendant — the figure's chief significator — is ${lordAsc}, here at ${place(P[lordAsc])}. The tradition weighs this planet's condition first.`,
    });
  }

  // 3 — the Sun
  if (P.Sun) {
    steps.push({
      el: 'planet-Sun',
      title: 'The Sun',
      say: `The Sun stands at ${place(P.Sun)}. As the greater light, the tradition reads it for the vitality and the animating spirit of the figure.`,
    });
  }

  // 4 — the Moon (her condition & next application — Lilly's habit)
  if (P.Moon) {
    const next = moonNextApplication(reading);
    const clause = next
      ? `she next applies to a ${low(next.aspect)} of ${next.other} (orb ${next.orb.toFixed(1)}°). The tradition follows the Moon as the swift carrier of the matter.`
      : `she completes no further aspect before leaving her sign — void of course, which the tradition reads as "nothing coming of the matter".`;
    steps.push({
      el: 'planet-Moon',
      title: 'The Moon',
      say: `The Moon is at ${place(P.Moon)}; ${clause}`,
    });
  }

  // 5 — the sect light (the Sun by day, the Moon by night)
  const light = m.isDay ? 'Sun' : 'Moon';
  if (P[light]) {
    steps.push({
      el: `planet-${light}`,
      title: 'The sect light',
      say: `This is a ${m.isDay ? 'day' : 'night'} chart, so the ${light} is the sect light — the luminary of its own sect, the body the tradition weighs most for the figure's overall temper.`,
    });
  }

  // 6 — the angular planets (the strongest seats: houses 1, 4, 7, 10)
  const angular = PLANETS7.filter(n => P[n] && ANGLES.has(P[n].house));
  steps.push(angular.length
    ? {
      el: angular.map(n => `planet-${n}`),
      title: 'The angular planets',
      say: `On the angles — the 1st, 4th, 7th and 10th houses, the tradition's strongest seats — stand ${joinAnd(angular)}. A reader marks these as the most active bodies of the figure.`,
    }
    : {
      el: [],
      title: 'The angular planets',
      say: `No planet occupies an angle here; the tradition would then read the figure's strength from the succedent and cadent houses instead.`,
    });

  // 7 — the tightest aspect (the testimony weighed first)
  const top = tightestAspects((reading.aspects && reading.aspects.list) || [], 1)[0];
  steps.push(top
    ? {
      el: `aspect-${top.from}-${top.to}-${top.aspect}`,
      title: 'The tightest aspect',
      say: `The closest contact among the seven is ${top.from} ${top.applying ? 'applying to' : 'separating from'} a ${low(top.aspect)} of ${top.to} (orb ${top.orb.toFixed(1)}°). The tradition weighs the tightest aspect first among the testimonies.`,
    }
    : {
      el: [],
      title: 'The tightest aspect',
      say: `No two of the seven planets fall within orb of an aspect in this figure, so the tradition would rest the reading on the Moon and the significators instead.`,
    });

  // 8 — the Part of Fortune
  const fort = P.Fortune;
  if (fort) {
    steps.push({
      el: 'planet-Fortune',
      title: 'The Part of Fortune',
      say: `The Part of Fortune — reckoned Ascendant + Moon − Sun — falls at ${place(fort)}. The tradition takes this Lot for the body and the material fortunes of the native, a historical reckoning offered for study.`,
    });
  }

  return steps;
}

export default narrateChart;
