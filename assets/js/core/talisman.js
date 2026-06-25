// ============================================================================
//  talisman.js — assembles a complete, historically-sourced talisman "recipe"
//  for an aim at a given moment, by composing the engines already built:
//    • election.js          — the aim, its ruling planet, the elected verdict & window
//    • data/planetary-magic — suffumigation, colour, metal, stone, spirits (Bk III)
//    • data/lunar-mansions  — the Moon's mansion & its use (Bk I)
//    • data/decan-faces     — the decan face & its talismanic image (Bk II)
//    • data/behenian-stars  — fixed-star contacts to strengthen the work (Bk II)
//
//  PRESENTED STRICTLY AS HISTORICAL PRACTICE — described, never prescribed.
//  Some historical recipes name toxic or illegal materials; they are recorded
//  for study only, never recommended. Astrology/talismanic magic has no
//  demonstrated efficacy. Sources: Picatrix (Greer–Warnock / Attrell–Porreca),
//  Agrippa *Three Books* II, and research/SOURCE-DATA.md.
// ============================================================================
import { electionScore, findNextElection, operationByKey, OPERATIONS } from './election.js';
import { PLANETARY_MAGIC } from './data/planetary-magic.js';
import { faceOf } from './data/decan-faces.js';
import { DECAN_FACES } from './data/decan-faces.js';

export const TALISMAN_DISCLAIMER =
  'Presented as historical magical practice for study, not instruction. Astrology and talismanic ' +
  'magic have no demonstrated efficacy; materials named in historical recipes may be toxic or illegal ' +
  'and are recorded, never recommended.';

// A face ruled by the operation's planet (the tradition prefers engraving in such a face).
function preferredFace(planet) {
  return DECAN_FACES.find(f => f.ruler === planet) || null;
}

// Build the full recipe for `operationKey` at the moment/place of `chart`.
// opts.scanHours > 0 also scans forward for the best upcoming window (slower).
export function talismanRecipe(chart, operationKey, opts = {}) {
  const op = operationByKey(operationKey);
  if (!op) throw new Error(`unknown operation: ${operationKey}`);
  const e = electionScore(chart, op.key, opts);
  const m = PLANETARY_MAGIC[op.ruler];

  // optional forward scan for the best window in the next opts.scanHours
  let window = null;
  if (opts.scanHours && opts.scanHours > 0) {
    try {
      const wins = findNextElection(op.key, chart.date, chart.latitude, chart.longitude,
        { hoursAhead: opts.scanHours, stepMinutes: opts.stepMinutes || 30 });
      window = wins[0] || null;
    } catch { window = null; }
  }

  // Only a star RELEVANT to this operation strengthens it — never an unrelated
  // (possibly contrary) star that merely happens to be in aspect right now.
  const star = e.stars.find(s => op.stars.includes(s.star)) || null;
  const pf = preferredFace(op.ruler);

  const materials = {
    suffumigation: m.suffumigation, colour: m.colour, metal: m.metal, stone: m.stone,
    spirits: {
      picatrixPrayerAngel: m.picatrixPrayerAngel || '(none — the planet is addressed directly)',
      agrippa: m.agrippa,
    },
  };

  const design =
    `Engrave ${op.ruler}'s own talismanic image (the planetary images of Agrippa, Three Books II.22–46) upon ${m.metal}, ` +
    `in the day and hour of ${op.ruler} while the Moon is well placed. ` +
    (pf ? `(A related decan image — the face of ${op.ruler}, ${pf.sign} face ${pf.decan}, a DIFFERENT image-set from the planetary images — is: ${pf.image})` :
          `Set the planet strong and dignified.`);

  // The numbered, cited working steps.
  const steps = [
    { text: `Choose the aim: ${op.label}. Its ruling planet is ${op.ruler}.`, cite: `Picatrix III / ${op.book}` },
    { text: `Elect the time: act in the day AND hour of ${op.ruler}` +
            `${e.hour ? ` (now it is the hour of ${e.hour.ruler}, day of ${e.hour.dayRuler})` : ''}, ` +
            `with ${op.ruler} dignified and free of the malefics, and the Moon ${op.polarity === 'increase' ? 'waxing & swift' : 'waning'}, ` +
            `not void of course nor in the via combusta.`, cite: 'Lilly CA pp.121-123; SOURCE-DATA §5' },
    { text: `Set the Moon well: she is in Mansion ${e.moon.mansion.num} (${e.moon.mansion.name}) — “${e.moon.mansion.use}”` +
            `${op.keywords.some(k => (e.moon.mansion.use || '').toLowerCase().includes(k)) ? ' — fitting this work' : ''}.`,
      cite: 'Agrippa II.33 / Picatrix I.4' },
    { text: `Prepare the materials: suffumigation of ${m.suffumigation}; the colour ${m.colour}; ` +
            `the metal ${m.metal}; the stone ${m.stone}.`, cite: `Picatrix III / Agrippa II (planetary-magic, ${m.source})` },
    { text: `Name the powers (kept in their distinct systems): Picatrix prayer-angel ${materials.spirits.picatrixPrayerAngel}; ` +
            `Agrippa Angel ${m.agrippa.angel}, Intelligence ${m.agrippa.intelligence}, Spirit ${m.agrippa.spirit}.`,
      cite: 'Picatrix III.7; Agrippa II' },
    { text: design, cite: 'Agrippa, Three Books II.22–46 (planetary images); II.37 (faces)' },
    { text: `Consecrate at the elected hour: kindle ${op.ruler}'s suffumigation (${m.suffumigation}) and speak the petition over the engraving WHILE the smoke rises — the smoke is concurrent with the inscription, not a preparatory step. In Picatrix III the fumigation and prayer are the act that "draws the spirit" into the image.`,
      cite: 'Picatrix III (the suffumigation & prayer as the consecrating act)' },
    star ? { text: `If available, strengthen with the fixed star ${star.star} (${star.planet} within ${star.sep.toFixed(1)}°).`, cite: 'Agrippa II (Behenian stars)' }
         : { text: `No Behenian fixed star is conjunct the significator now; the tradition would wait for one if a star is desired.`, cite: 'Agrippa II (Behenian stars)' },
  ];

  const citations = [...new Set(steps.map(s => s.cite))];

  return {
    aim: op.label, operationKey: op.key, planet: op.ruler, book: op.book,
    when: chart.date, where: { lat: chart.latitude, lon: chart.longitude },
    verdict: e.verdict, verdictLabel: e.label, score: e.score,
    hour: e.hour, window,
    moon: e.moon, sunFace: e.sunFace,
    materials, design, stars: e.stars, star,
    steps, citations,
    disclaimer: TALISMAN_DISCLAIMER,
  };
}

// Convenience: recipes for every aim at one moment (for an overview).
export function allRecipes(chart, opts = {}) {
  return OPERATIONS.map(o => talismanRecipe(chart, o.key, opts));
}
