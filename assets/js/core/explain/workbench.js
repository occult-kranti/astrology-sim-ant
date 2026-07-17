// ============================================================================
//  core/explain/workbench.js — the "In plain words" text-model builders for the
//  Workbench (pages/workbench.html). PURE: reads a `fullReading` (core/reading.js)
//  slice and returns a computed, cited text model in the attributed voice — never
//  interpretation-as-truth (chart-ux.md §4.3). No DOM. Headless-testable.
//
//  Exports:
//    explainWorkbench(reading)  — the whole-reading synthesis mounted under the
//                                 chart-health verdict banner (the flagship block).
//    explainDignities(reading)  — the dignity ledger, with Lilly's scale anchored.
//    explainCautions(reading)   — the chart-health verdict in plain words.
// ============================================================================
import { model, mkTerm, esc, sgn, tightestAspects, dignityExtremes, verdictTone } from './util.js';

const A_AN = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ');
const low = s => String(s || '').toLowerCase();

// One tightest-aspect clause, e.g. "Venus and the Moon in an applying trine (orb 0.4°)".
function aspectClause(a) {
  if (!a) return '';
  const flow = a.applying ? 'applying' : 'separating';
  return `${a.from} and ${a.to} in ${A_AN(flow)}${flow} ${low(a.aspect)} (orb ${a.orb.toFixed(1)}°)`;
}

// ---------------------------------------------------------------------------
//  explainWorkbench — the flagship, whole-reading plain-words synthesis.
// ---------------------------------------------------------------------------
export function explainWorkbench(reading) {
  const m = reading.moment, c = reading.cautions;
  const asc = m.angles.asc.label;
  const sect = m.isDay ? 'a day chart (the Sun above the horizon)' : 'a night chart (the Sun below the horizon)';
  const hour = m.planetaryHour ? `, in the planetary hour of ${m.planetaryHour.ruler}` : '';

  const ext = dignityExtremes(reading.dignities.perPlanet);
  const log = reading.dignities.lordOfGeniture;

  // The tightest aspect, if any.
  const top = tightestAspects(reading.aspects.list, 1)[0];

  const verdict = c.verdict, tone = verdictTone(verdict);
  const health = verdict === 'green' ? 'sound — few impediments stand against it'
    : verdict === 'amber' ? 'mixed — some cautions stand and want weighing'
    : verdict === 'red' ? 'strongly impeded — the testimonies weigh against it'
    : 'to be judged on its own terms';
  const affl = (c.afflictedSignificators || []);

  const parts = [];
  parts.push(`The tradition reads this figure as ${sect}, with ${asc} rising${hour}.`);
  if (ext) {
    parts.push(`By essential dignity ${ext.strongest.name} sits strongest here (${sgn(ext.strongest.total)}) and ${ext.weakest.name} the most afflicted (${sgn(ext.weakest.total)}); Lilly takes ${log.planet} for the Lord of the Geniture, the most dignified body over the whole figure.`);
  }
  if (top) parts.push(`The closest contact between the seven is ${aspectClause(top)} — the testimony a reader would weigh first.`);
  parts.push(`On the site's crude tally its chart health reads ${health}${affl.length ? `, and the significators of the matter (${affl.join(', ')}) are among the afflicted` : ''}.`);
  parts.push(`All of this describes what Lilly's system computes for the moment — a historical reckoning, not a forecast.`);

  const terms = [
    mkTerm('Ascendant'), mkTerm('Sect (Diurnal / Nocturnal)'), mkTerm('Essential Dignity'),
    mkTerm('Lord of the Geniture'), mkTerm('Chart Health'),
  ];
  if (top) terms.push(mkTerm('Applying / Separating'), mkTerm('Aspect'));

  return model({
    anchorId: 'wb-explain',
    text: parts.join(' '),
    terms,
    tone,
    mechanics: {
      summary: 'What the tradition computes here',
      html: `<p>Positions come from a verified astronomical engine (~1′); the Ascendant, Midheaven and houses are erected in the ${esc(m.system || 'Regiomontanus')} system. `
        + `Essential dignity scores each body on Lilly's ledger — domicile ${sgn(5)}, exaltation ${sgn(4)}, triplicity ${sgn(3)}, term ${sgn(2)}, face ${sgn(1)}, detriment ${sgn(-5)}, fall ${sgn(-4)}, peregrine ${sgn(-5)} — so a total above roughly ${sgn(4)} is "strong" and a negative total is a debilitated, wandering placement. `
        + `The <b>chart-health verdict</b> is a significator-weighted count of impediments (the considerations before judgement, combustion, retrogradation, the void Moon, the Via Combusta), not a measurement of anything in the world.</p>`,
      citation: 'Lilly, Christian Astrology, Bk I (essential & accidental dignity) & Bk II (the considerations before judgement).',
      contested: [],
    },
  });
}

// ---------------------------------------------------------------------------
//  explainDignities — anchors Lilly's scale and names the extremes only.
// ---------------------------------------------------------------------------
export function explainDignities(reading) {
  const ext = dignityExtremes(reading.dignities.perPlanet);
  const log = reading.dignities.lordOfGeniture;
  const parts = [];
  if (ext) {
    parts.push(`On Lilly's essential scale (from ${sgn(5)} for a body in its own domicile to ${sgn(-5)} for a peregrine one), ${ext.strongest.name} stands most dignified in this figure (${sgn(ext.strongest.total)}) and ${ext.weakest.name} the most debilitated (${sgn(ext.weakest.total)}).`);
  }
  parts.push(`Summing essential and accidental strength together, the tradition would call ${log.planet} the Lord of the Geniture — "the most powerful and predominant" body of the figure.`);
  parts.push(`These are bookkeeping totals in a historical scheme, described for study, not a rating of worth.`);
  return model({
    anchorId: 'wb-explain-dignities',
    text: parts.join(' '),
    terms: [mkTerm('Essential Dignity'), mkTerm('Peregrine'), mkTerm('Lord of the Geniture'), mkTerm('Almuten')],
    tone: null,
    mechanics: {
      summary: 'How the dignity ledger is scored',
      html: `<p>Each body earns points for the sign and degree it holds — domicile ${sgn(5)}, exaltation ${sgn(4)}, triplicity ${sgn(3)}, term ${sgn(2)}, face ${sgn(1)} — and loses them in detriment ${sgn(-5)} or fall ${sgn(-4)}; a body with no dignity anywhere in its place is peregrine ${sgn(-5)}. Accidental dignity adds the strength of situation (house, motion, freedom from the Sun). The Lord of the Geniture is simply the greatest combined total.</p>`,
      citation: 'Lilly, Christian Astrology, Bk I, pp. 101–116 (the table of essential dignities & debilities).',
      contested: [],
    },
  });
}

// ---------------------------------------------------------------------------
//  explainCautions — the chart-health verdict, in plain words.
// ---------------------------------------------------------------------------
export function explainCautions(reading) {
  const c = reading.cautions;
  const tone = verdictTone(c.verdict);
  const sig = (c.significators && c.significators.primary) || [];
  const affl = c.afflictedSignificators || [];
  const word = c.verdict === 'green' ? 'few impediments stand — the figure is fit to judge'
    : c.verdict === 'amber' ? 'the impediments are mixed — weigh them before judging'
    : 'the impediments stand strongly against a clear judgement';
  const parts = [
    `Weighing the considerations before judgement, ${word}.`,
    sig.length ? `The significators of the matter are ${sig.join(', ')}${affl.length ? `, and of these ${affl.join(', ')} ${affl.length === 1 ? 'is' : 'are'} afflicted` : ', none of them gravely afflicted'}.` : '',
    `The verdict is a quick count, weighted toward the significators — a summary the tradition would still test against the actual figure, never a substitute for it.`,
  ];
  return model({
    anchorId: 'wb-explain-cautions',
    text: parts.filter(Boolean).join(' '),
    terms: [mkTerm('Chart Health'), mkTerm('Considerations before Judgement'), mkTerm('Significator'), mkTerm('Verdict (green / amber / red)')],
    tone,
    mechanics: {
      summary: 'How chart health is counted',
      html: `<p>The engine walks Lilly's considerations before judgement (an early or late Ascendant, the Moon void of course or in the Via Combusta, Saturn in the 1st or 7th, a combust or retrograde significator, and the rest), weights each by how central its planet is to the matter, and rolls the sum into a green / amber / red badge.</p>`,
      citation: 'Lilly, Christian Astrology, Bk II — the considerations before judgement and the Moon’s condition.',
      contested: [],
    },
  });
}
