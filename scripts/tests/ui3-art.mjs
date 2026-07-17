// ============================================================================
//  ui3-art.mjs — Builder 3 (chrome, home & the art layer) test module.
//  Exports `async run() -> {pass, failures[]}` (the integrator wires it into
//  engine-test.mjs) and a `DRIVES` array of {page, actions, asserts} the
//  integrator translates into browser-verify.mjs steps.
//
//  Covers: skyart edge cases + determinism (moon / dial / starfield), the
//  frontispiece law G3 (≤1 gold fill) + tag balance + a11y, and the icon sprite
//  (≥40 i-* symbols, viewBox 24, four pattern defs).
// ============================================================================
import { moonPhaseSVG, hourDialSVG, starfieldSVG, mulberry32 } from '../../assets/js/core/skyart.js';
import { ICON_SPRITE, ICON_IDS, injectIcons } from '../../assets/js/app/art/icons.js';
import { FRONTISPIECES, frontispiece, cornerOrnament, ruleFleuron, ruleDeckle } from '../../assets/js/app/art/engravings.js';
import { hoursTable } from '../../assets/js/core/planetary-hours.js';

// ---- helpers ---------------------------------------------------------------
const stripStyle = s => s.replace(/<style>[\s\S]*?<\/style>/g, '');

// A small tag-balance checker: tokenise tags, assert a well-nested stack.
function tagsBalanced(svg) {
  const s = stripStyle(svg);
  const toks = s.match(/<\/?[a-zA-Z][^>]*?>/g) || [];
  const stack = [];
  for (const t of toks) {
    if (/^<\//.test(t)) {
      const name = t.replace(/[<\/>]/g, '').split(/\s/)[0];
      if (stack.pop() !== name) return false;
    } else if (/\/>$/.test(t)) {
      /* self-closing */
    } else {
      stack.push(t.replace(/[<>]/g, '').split(/\s/)[0]);
    }
  }
  return stack.length === 0;
}
const countEl = (svg, tag) => (stripStyle(svg).match(new RegExp('<' + tag + '[\\s>]', 'g')) || []).length;
const goldFills = svg => (stripStyle(svg).match(/class="pivot"/g) || []).length;

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // -- 1. moonPhaseSVG edge cases ------------------------------------------
  for (const f of [0, 0.5, 1, 0.27, 0.73, 0.99]) {
    const svg = moonPhaseSVG(f, f < 0.5);
    ok(!/A\s*0[, ]/.test(stripStyle(svg)), `moon frac ${f}: no invalid rx=0 arc`);
    ok(tagsBalanced(svg), `moon frac ${f}: tags balance`);
    ok(/role="img"/.test(svg) && /aria-label=/.test(svg), `moon frac ${f}: role+aria`);
  }
  ok(!/class="lit"/.test(moonPhaseSVG(0, true)), 'moon frac 0: no lit path');
  ok(/class="lit"/.test(moonPhaseSVG(1, true)), 'moon frac 1: lit path present');
  ok(/L 0,-44/.test(moonPhaseSVG(0.5, true)), 'moon frac .5: straight terminator (no zero-arc)');
  ok(moonPhaseSVG(0.4, true) === moonPhaseSVG(0.4, true), 'moon deterministic');
  // options-object form works too
  ok(/72% illuminated, waning/.test(moonPhaseSVG({ frac: 0.72, waxing: false, label: 'The Moon' })), 'moon options-form aria');

  // -- 2. hourDialSVG (golden J2000 London vector, real hoursTable) ---------
  let table = null;
  try { table = hoursTable(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)), 51.5074, -0.1278); } catch (e) { /* fall through */ }
  if (!table) {
    // synthetic 24-row fallback (deterministic) if the engine can't rise/set.
    const CH = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
    const base = Date.UTC(2000, 0, 1, 8, 0, 0); let t = base; const rows = [];
    for (let h = 0; h < 24; h++) { const night = h >= 12; rows.push({ hour: h + 1, night, start: new Date(t), ruler: CH[h % 7] }); t += (night ? 55 : 65) * 60000; }
    table = { rows, sunrise: new Date(base), sunset: new Date(base + 12 * 65 * 60000), nextRise: new Date(t), dayRuler: 'Sun' };
  }
  const now = new Date(table.rows[3].start.getTime() + 60000);
  const dial = hourDialSVG(table, now);
  ok(countEl(dial, 'path') >= 24 && (stripStyle(dial).match(/class="sec-/g) || []).length === 24, 'dial has 24 sectors');
  ok((stripStyle(dial).match(/class="hd-needle"/g) || []).length === 1, 'dial has exactly one gold needle');
  ok((stripStyle(dial).match(/hd-now(?!-)/g) || []).length === 1, 'dial has exactly one current sector');
  const curPlanet = table.rows[3].ruler;
  ok(new RegExp('aria-label="[^"]*' + curPlanet).test(dial), `dial aria-label carries the current planet (${curPlanet})`);
  ok(tagsBalanced(dial), 'dial tags balance');
  ok(hourDialSVG(table, now) === dial, 'dial deterministic');

  // -- 3. starfieldSVG -----------------------------------------------------
  const sf = starfieldSVG({ w: 800, h: 300, seed: 271828 });
  ok(sf === starfieldSVG({ w: 800, h: 300, seed: 271828 }), 'starfield byte-identical across calls');
  ok((countEl(sf, 'circle') + countEl(sf, 'path')) <= 90, 'starfield ≤90 nodes');
  ok(tagsBalanced(sf), 'starfield tags balance');
  ok(mulberry32(9)() === mulberry32(9)(), 'mulberry32 deterministic');

  // -- 4. frontispieces (all 15 names; law G3) -----------------------------
  const names = Object.keys(FRONTISPIECES);
  ok(names.length === 15, `15 frontispiece emblems (got ${names.length})`);
  for (const name of names) {
    const svg = frontispiece(name);
    ok(!!svg, `frontispiece ${name} renders`);
    ok(tagsBalanced(svg), `frontispiece ${name}: tags balance`);
    ok(/role="img"/.test(svg) && /aria-label=/.test(svg), `frontispiece ${name}: role+aria`);
    ok(goldFills(svg) <= 1, `frontispiece ${name}: ≤1 gold fill (law G3, got ${goldFills(svg)})`);
    ok(countEl(svg, 'path') + countEl(svg, 'circle') + countEl(svg, 'line') + countEl(svg, 'polygon') + countEl(svg, 'rect') + countEl(svg, 'ellipse') + countEl(svg, 'text') <= 40, `frontispiece ${name}: ≤40 marks`);
  }
  ok(frontispiece('vedic').includes('sidereal'), 'frontispiece alias vedic → sidereal-wheel');
  ok(frontispiece('unknown-wing') === '', 'unknown frontispiece name → empty (emoji fallback kept)');
  ok(tagsBalanced(cornerOrnament()) && tagsBalanced(ruleFleuron()) && tagsBalanced(ruleDeckle(600, 7)), 'furniture builders balance');
  ok(ruleDeckle(600, 7) === ruleDeckle(600, 7), 'deckle deterministic');

  // -- 5. icon sprite ------------------------------------------------------
  const symbolCount = (ICON_SPRITE.match(/<symbol /g) || []).length;
  const iPrefixed = (ICON_SPRITE.match(/<symbol id="i-/g) || []).length;
  const vb24 = (ICON_SPRITE.match(/viewBox="0 0 24 24"/g) || []).length;
  ok(symbolCount >= 40, `icon sprite ≥40 symbols (got ${symbolCount})`);
  ok(iPrefixed === symbolCount, 'every symbol id is i-prefixed');
  ok(vb24 === symbolCount, 'every symbol viewBox is 24');
  ok((ICON_SPRITE.match(/<pattern /g) || []).length === 4, 'four <pattern> defs (pat-shade/ep-disp/ep-con/stipple)');
  ok(/id="pat-ep-disp"/.test(ICON_SPRITE) && /id="pat-ep-con"/.test(ICON_SPRITE), 'atlas pat-ep-* fills present');
  ok(ICON_IDS.includes('i-search') && ICON_IDS.includes('i-cast'), 'core control icons present');
  ok(typeof injectIcons === 'function', 'injectIcons exported');

  return { pass: failures.length === 0, failures };
}

// Browser-sweep descriptors (integrator translates into browser-verify steps).
// Each assert: {exists} a selector must exist, {count:{selector,n}} exact count,
// {absent} selector must not exist.
export const DRIVES = [
  { page: '/index.html', actions: [], asserts: [
    { exists: '#ds3-icon-sprite' },
    { exists: 'button.cmdk-btn' },
    { count: { selector: '.doors .door', n: 3 } },
    { exists: '.door .door-kicker' }
  ] },
  { page: '/pages/workbench.html', actions: [], asserts: [
    { exists: '#ds3-icon-sprite' },
    { exists: 'button.cmdk-btn' }
  ] },
  { page: '/pages/yoga/index.html', actions: [], asserts: [
    { exists: '#ds3-icon-sprite' },
    { exists: '.wing-hero .fp' }
  ] },
  { page: '/pages/geomancy.html', actions: [], asserts: [
    { exists: '#ds3-icon-sprite' },
    { exists: 'button.cmdk-btn' }
  ] }
];

// Allow `node scripts/tests/ui3-art.mjs` to run standalone.
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`) {
  run().then(r => {
    for (const f of r.failures) console.log('✗ ' + f);
    console.log(r.pass ? `\nui3-art: all passed (${0} failures)` : `\nui3-art: ${r.failures.length} FAILURES`);
    process.exit(r.pass ? 0 : 1);
  });
}
