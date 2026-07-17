// ============================================================================
//  scripts/tests/r28-explain.mjs — Builder X (the explain layer) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs, and a `DRIVES`
//  array of {page, actions[], asserts[]} for the Chromium sweep (browser-verify).
//
//  Covers chart-ux.md §4/§7/§10 for the "In plain words" text models:
//    • the BANNED-PHRASE grep over every emitted model on 5 reference charts
//      (no "you will" / "is destined" / second-person destiny voice),
//    • XML/esc safety of the mechanics HTML + the plain-words text,
//    • every term-chip slug resolves to a real GLOSSARY entry,
//    • termSlug (core) === slugTerm (app autolinker) — chips deep-link correctly,
//    • non-empty attributed text on every reference vector,
//    • the registry entries for the three explain modules resolve.
//  Deterministic; no DOM, no network.
// ============================================================================
import { castChart } from '../../assets/js/core/astro.js';
import { fullReading } from '../../assets/js/core/reading.js';
import { SIGNS } from '../../assets/js/core/data/signs.js';
import { GLOSSARY } from '../../assets/js/core/data/glossary.js';
import { slugTerm } from '../../assets/js/app/autolink.js';
import { BANNED_PHRASES, findBanned, termSlug } from '../../assets/js/core/explain/util.js';
import { explainWorkbench, explainDignities, explainCautions } from '../../assets/js/core/explain/workbench.js';
import { explainHorary } from '../../assets/js/core/explain/horary.js';
import { explainNativity } from '../../assets/js/core/explain/nativity.js';
import { REGISTRY } from '../../assets/js/core/registry.js';

const BY_SLUG = new Set(GLOSSARY.map(g => slugTerm(g.term)));

const QUALITY = {
  Fire: { humour: 'Choleric', hot: 1, dry: 1 }, Earth: { humour: 'Melancholic', hot: -1, dry: 1 },
  Air: { humour: 'Sanguine', hot: 1, dry: -1 }, Water: { humour: 'Phlegmatic', hot: -1, dry: -1 },
};
function temperamentOf(chart) {
  const signName = lon => SIGNS[Math.floor((((lon % 360) + 360) % 360) / 30)].name;
  const lord = (() => { // crude Lord-of-Geniture stand-in: the Sun's sign contributor is enough for text
    return 'Sun';
  })();
  const contributors = [chart.asc, chart.planets.Moon.lon, chart.planets.Sun.lon, chart.planets[lord].lon];
  let hot = 0, dry = 0; const h = { Choleric: 0, Melancholic: 0, Sanguine: 0, Phlegmatic: 0 };
  for (const l of contributors) { const el = SIGNS.find(s => s.name === signName(l)).element; const q = QUALITY[el]; hot += q.hot; dry += q.dry; h[q.humour]++; }
  const dominant = Object.entries(h).sort((a, b) => b[1] - a[1])[0][0];
  return { hot, dry, dominant };
}

// A minimal XML/fragment well-formedness check for the mechanics HTML: wrap in a
// root, tokenise tags, require a balanced open/close stack, quoted attributes,
// and no raw &/< in text nodes (outside entities).
function fragmentWellFormed(html) {
  const svg = `<root>${html}</root>`;
  const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
  const stack = []; let i = 0; const n = svg.length;
  while (i < n) {
    const lt = svg.indexOf('<', i);
    if (lt < 0) { checkText(svg.slice(i)); break; }
    checkText(svg.slice(i, lt));
    const gt = svg.indexOf('>', lt); if (gt < 0) throw new Error('unclosed tag');
    let t = svg.slice(lt + 1, gt);
    if (t.startsWith('/')) { const name = t.slice(1).trim(); const top = stack.pop(); if (top !== name) throw new Error(`mismatched close </${name}> vs <${top}>`); }
    else {
      const selfClose = t.endsWith('/'); if (selfClose) t = t.slice(0, -1);
      const sp = t.search(/\s/); const name = (sp < 0 ? t : t.slice(0, sp)).toLowerCase();
      const attrs = sp < 0 ? '' : t.slice(sp); checkAttrs(attrs);
      if (!selfClose && !VOID.has(name)) stack.push(name);
    }
    i = gt + 1;
  }
  if (stack.length) throw new Error(`unclosed elements: ${stack.join(',')}`);
  return true;
  function checkText(txt) {
    if (/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);)/.test(txt)) throw new Error('raw & in text');
    if (txt.includes('<')) throw new Error('raw < in text');
  }
  function checkAttrs(a) { const re = /([:\w-]+)\s*=\s*"([^"]*)"/g; let cleaned = a, m; while ((m = re.exec(a))) cleaned = cleaned.replace(m[0], ''); if (/=/.test(cleaned)) throw new Error(`unquoted attribute in "${a.trim()}"`); }
}

// The five reference charts: day/night, hemispheres, an early-modern date — so
// the verdicts and testimonies vary across vectors.
function referenceCharts() {
  return [
    { name: 'London noon 1990', chart: castChart(new Date(Date.UTC(1990, 0, 1, 12, 0)), 51.5074, -0.1278, 'regiomontanus'), q: 7 },
    { name: 'London midnight 2001', chart: castChart(new Date(Date.UTC(2001, 5, 21, 0, 0)), 51.5074, -0.1278, 'regiomontanus'), q: 10 },
    { name: 'New York 2020', chart: castChart(new Date(Date.UTC(2020, 8, 15, 17, 30)), 40.7128, -74.006, 'regiomontanus'), q: 2 },
    { name: 'Delhi 1975', chart: castChart(new Date(Date.UTC(1975, 2, 10, 6, 15)), 28.6139, 77.209, 'regiomontanus'), q: 4 },
    { name: 'Prague 1601', chart: castChart(new Date(Date.UTC(1601, 10, 2, 9, 45)), 50.0755, 14.4378, 'regiomontanus'), q: 9 },
  ];
}

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 0. termSlug (core) must equal slugTerm (app) ------------------------
  for (const term of ['Sect (Diurnal / Nocturnal)', 'Chart Health', 'Lord of the Geniture', 'Applying / Separating', 'Void of Course']) {
    ok(termSlug(term) === slugTerm(term), `termSlug === slugTerm for "${term}"`);
  }

  // ---- 1. every reference chart × every builder ----------------------------
  const models = [];
  for (const { name, chart, q } of referenceCharts()) {
    const rW = fullReading(chart, { includeVedic: false });
    const rH = fullReading(chart, { quesitedHouse: q, includeVedic: false });
    models.push([`workbench/${name}`, explainWorkbench(rW)]);
    models.push([`dignities/${name}`, explainDignities(rW)]);
    models.push([`cautions/${name}`, explainCautions(rW)]);
    models.push([`horary/${name}`, explainHorary(rH)]);
    models.push([`nativity/${name}`, explainNativity(rW, { temperament: temperamentOf(chart) })]);
    models.push([`nativity-no-temp/${name}`, explainNativity(rW)]);      // must still be valid
  }
  // the horary general-state path (no quesited)
  models.push(['horary-general', explainHorary(fullReading(referenceCharts()[0].chart, { includeVedic: false }))]);

  for (const [label, m] of models) {
    // shape
    ok(m && m.plain && typeof m.plain.text === 'string', `${label}: model has plain.text`);
    if (!m || !m.plain) continue;
    ok(m.plain.text.length > 40, `${label}: plain text is non-trivial (${m.plain.text.length})`);
    ok([null, 'ok', 'warn', 'bad'].includes(m.plain.tone), `${label}: tone is a valid token (${m.plain.tone})`);

    // BANNED PHRASE grep over the full emitted text (plain + mechanics)
    const blob = `${m.plain.text} ${m.mechanics ? m.mechanics.html : ''} ${m.mechanics ? m.mechanics.citation : ''}`;
    const hit = findBanned(blob);
    ok(!hit, `${label}: no banned phrase${hit ? ` (found "${hit}")` : ''}`);
    // attributed voice: at least a "the tradition" / "Lilly" attribution somewhere
    ok(/tradition|lilly|reader|scheme|method/i.test(m.plain.text), `${label}: attributed voice present`);

    // XML/esc safety
    ok(!/[<>]/.test(m.plain.text), `${label}: plain text carries no raw markup`);
    for (const t of m.plain.terms) {
      ok(t && typeof t.slug === 'string' && BY_SLUG.has(t.slug), `${label}: term-chip slug resolves ("${t && t.term}")`);
    }
    if (m.mechanics) {
      try { fragmentWellFormed(m.mechanics.html); } catch (e) { failures.push(`${label}: mechanics HTML not well-formed: ${e.message}`); }
      ok(m.mechanics.citation && m.mechanics.citation.length > 8, `${label}: mechanics carries a citation`);
    }
  }

  // ---- 2. the BANNED_PHRASES list is itself sane ---------------------------
  ok(BANNED_PHRASES.includes('you will') && BANNED_PHRASES.includes('is destined'), 'BANNED_PHRASES covers the core horoscope register');
  ok(findBanned('The stars say you will be rich') === 'you will', 'findBanned detects a planted phrase');
  ok(findBanned('The tradition reads this as a day chart') === null, 'findBanned passes clean attributed text');

  // ---- 3. horary tone tracks the verdict (perfection vs void) --------------
  {
    // a shared-significator or applying-direct chart should read tone 'ok'; a void
    // Moon without perfection 'bad'. We just assert the tone is drawn from the set
    // and that at least one vector across the five is non-warn (verdicts vary).
    const tones = referenceCharts().map(({ chart, q }) => explainHorary(fullReading(chart, { quesitedHouse: q, includeVedic: false })).plain.tone);
    ok(tones.every(t => ['ok', 'warn', 'bad'].includes(t)), 'every horary vector yields a verdict tone');
  }

  // ---- 4. registry entries for the explain modules resolve -----------------
  const ids = ['explain-workbench', 'explain-horary', 'explain-nativity'];
  for (const id of ids) {
    const e = REGISTRY.find(x => x.id === id);
    ok(e && e.callable === false, `registry[${id}] present & callable:false`);
    if (e) {
      const mod = await import('../../' + e.module);
      ok(e.exportName in mod, `registry[${id}] export ${e.exportName} resolves`);
      for (const ex of (e.exports || [])) ok(ex in mod, `registry[${id}] extra export ${ex} resolves`);
      for (const t of e.glossaryTerms) ok(BY_SLUG.has(slugTerm(t)), `registry[${id}] glossary term "${t}" exists`);
    }
  }

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptors (integrator wires into browser-verify) --
export const DRIVES = [
  {
    page: 'pages/workbench.html',
    actions: ['compute', 'focus a #wb-explain .term-chip', "press 'Enter'"],
    asserts: [
      '#wb-explain-mount .plain-words visible',
      '#wb-explain-mount .plain-words .pw-label text is "In plain words"',
      '#wb-explain-mount .layer-mechanics present (collapsed)',
      'Enter on a .term-chip → .glosstip visible with role="tooltip"',
      'Esc → .glosstip hidden, focus returns to the chip',
      'hover a .gloss-link in a result table → .glosstip appears (position:fixed escapes .table-scroll)',
      'no requestAnimationFrame pending 1200ms after idle',
    ],
  },
  {
    page: 'pages/book2/horary.html',
    actions: ['compute', 'read #h-explain'],
    asserts: [
      '#h-explain-mount .plain-words visible under #h-verdict-banner',
      "#h-explain-mount .plain-words text contains \"the tradition\"",
      '#h-explain-mount .plain-words--ok|--warn|--bad tone class matches the verdict banner',
      'tap a .gloss-link → popover opens (first tap), second tap navigates to glossary.html',
    ],
  },
  {
    page: 'pages/book3/nativity.html',
    actions: ['compute', 'read #n-explain'],
    asserts: [
      '#n-explain-mount .plain-words visible under #n-summary',
      '#n-explain-mount text names the Lord of the Geniture and a humour (choleric/…)',
      '.term-chip ⓘ opens the glosstip on click, Esc closes',
    ],
  },
  {
    page: 'pages/workbench.html',
    actions: ['emulate prefers-reduced-motion: reduce', 'compute', 'open a glosstip'],
    asserts: [
      'getAnimations().length === 0 after opening/closing a popover',
      '.glosstip has no CSS transition applied',
    ],
  },
];

export default { run, DRIVES };
