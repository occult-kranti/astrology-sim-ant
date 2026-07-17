// ============================================================================
//  scripts/tests/r29-narrate.mjs — B-NARRATE headless tests for the "read this
//  chart aloud" narrative order (core/explain/narrate.js). Exports
//  `async run() -> {pass, failures[]}` for engine-test.mjs, plus a `DRIVES` array
//  of {page, actions[], asserts[]} for the Chromium sweep (browser-verify).
//
//  Covers chart-ux.md §6 for the PURE step model:
//    • BANNED-PHRASE grep over every emitted `say` string on 3 reference charts
//      (no second-person destiny voice), on top of an attributed-voice check;
//    • every step's `el` references a REAL core/chart.js data-el stamp
//      (cusp-<n> / planet-<drawable> / aspect-<from>-<to>-<Aspect>);
//    • the canonical order (Ascendant first; the sect light tracks day/night);
//    • determinism (identical output across two calls).
//  Deterministic; no DOM, no network.
// ============================================================================
import { castChart } from '../../assets/js/core/astro.js';
import { fullReading } from '../../assets/js/core/reading.js';
import { findBanned, BANNED_PHRASES } from '../../assets/js/core/explain/util.js';
import { narrateChart } from '../../assets/js/core/explain/narrate.js';

// The bodies core/chart.js will actually stamp as planet-<Name> (its `order`
// list, filtered to those present in chart.planets).
const DRAWABLE = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'NorthNode', 'SouthNode', 'Fortune'];

function referenceCharts() {
  return [
    { name: 'London noon 1990 (day)', chart: castChart(new Date(Date.UTC(1990, 0, 1, 12, 0)), 51.5074, -0.1278, 'regiomontanus') },
    { name: 'London midnight 2001 (night)', chart: castChart(new Date(Date.UTC(2001, 5, 21, 0, 0)), 51.5074, -0.1278, 'regiomontanus') },
    { name: 'New York 2020', chart: castChart(new Date(Date.UTC(2020, 8, 15, 17, 30)), 40.7128, -74.006, 'regiomontanus') },
  ];
}

// Build the set of legal data-el ids for a given reading + chart.
function legalIds(reading, chart) {
  const ids = new Set();
  for (let h = 1; h <= 12; h++) if (chart.cusps[h] != null) ids.add(`cusp-${h}`);
  for (const name of DRAWABLE) if (chart.planets[name]) ids.add(`planet-${name}`);
  for (const a of (reading.aspects && reading.aspects.list) || []) ids.add(`aspect-${a.from}-${a.to}-${a.aspect}`);
  return ids;
}

const asArray = el => (Array.isArray(el) ? el : (el == null ? [] : [el]));

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  for (const { name, chart } of referenceCharts()) {
    const reading = fullReading(chart, { includeVedic: false });
    const steps = narrateChart(reading);
    const ids = legalIds(reading, chart);

    // shape & volume
    ok(Array.isArray(steps) && steps.length >= 7, `${name}: at least 7 steps (${steps.length})`);

    // canonical order: the Ascendant leads
    ok(steps[0] && steps[0].el === 'cusp-1' && /Ascendant/i.test(steps[0].title), `${name}: first step is the Ascendant (cusp-1)`);

    // the sect light tracks day/night
    const sect = steps.find(s => /sect light/i.test(s.title));
    ok(sect && sect.el === (chart.isDay ? 'planet-Sun' : 'planet-Moon'), `${name}: sect-light step targets the ${chart.isDay ? 'Sun' : 'Moon'}`);

    let attributedSeen = false;
    for (const [i, s] of steps.entries()) {
      const at = `${name} step ${i} (${s && s.title})`;
      ok(s && typeof s.title === 'string' && s.title.length > 2, `${at}: has a title`);
      ok(s && typeof s.say === 'string' && s.say.length > 30, `${at}: has a non-trivial say`);
      if (!s || typeof s.say !== 'string') continue;

      // no horoscope / second-person destiny register
      const hit = findBanned(s.say);
      ok(!hit, `${at}: no banned phrase${hit ? ` (found "${hit}")` : ''}`);
      // no raw markup leaks into the say string
      ok(!/[<>]/.test(s.say), `${at}: say carries no raw markup`);
      if (/tradition|lilly|reader/i.test(s.say)) attributedSeen = true;

      // every el id references a REAL wheel stamp
      for (const id of asArray(s.el)) {
        ok(ids.has(id), `${at}: el "${id}" is a real data-el stamp`);
      }
    }
    ok(attributedSeen, `${name}: the attributed voice ("the tradition…"/"Lilly…") appears`);

    // determinism
    ok(JSON.stringify(steps) === JSON.stringify(narrateChart(reading)), `${name}: narrateChart is deterministic`);
  }

  // the banned-phrase detector itself is sane (guards against a no-op grep)
  ok(BANNED_PHRASES.length > 0 && findBanned('the stars say you will be rich') === 'you will', 'findBanned detects a planted phrase');
  ok(findBanned('The tradition takes the Ascendant for the doorway of the figure') === null, 'findBanned passes clean attributed text');

  // an empty / malformed reading must not throw (defensive purity)
  ok(Array.isArray(narrateChart(null)) && narrateChart(null).length === 0, 'narrateChart(null) → []');
  ok(Array.isArray(narrateChart({})) && narrateChart({}).length === 0, 'narrateChart({}) → []');

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptors (integrator wires into browser-verify) --
export const DRIVES = [
  {
    page: 'pages/workbench.html',
    actions: ['compute', "click '.narrate-toggle'"],
    asserts: [
      '#wb-narrate-mount .narrate-rail visible (not [hidden])',
      '#wb-narrate-mount .narrate-step count matches the step list',
      "click '.narrate-toggle' → .chart-wheel gets .narrate-active and step 1 lights a [data-el].narrate-lit",
      "press 'ArrowRight' → .narrate-current advances and the newly-lit [data-el] changes",
      '.narrate-live role="status" text updates to "Step N of M: …"',
      "press 'Escape' → .narrate-rail hidden, no [data-el].narrate-lit remains, focus returns to .narrate-toggle",
      'no requestAnimationFrame pending 1200ms after idle',
    ],
  },
  {
    page: 'pages/workbench.html',
    actions: ['emulate prefers-reduced-motion: reduce', 'compute', "click '.narrate-toggle'"],
    asserts: [
      '#wb-narrate-mount .narrate-steps ol shows the full numbered static list',
      'getAnimations().length === 0 after opening the rail and stepping',
      '.chart-wheel.narrate-active [data-el] has no CSS transition applied',
    ],
  },
];

export default { run, DRIVES };
