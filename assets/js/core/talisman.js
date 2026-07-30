// ============================================================================
//  talisman.js — assembles the ATTESTED SEQUENCE of a historically-sourced
//  talisman for an aim at a given moment, by composing the engines already built:
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
//
//  ── THE VOICE RULE (docs/FRAMING.md §3, blocker B1) ────────────────────────
//  Until 2026-07-30 this module emitted `steps`: a NUMBERED IMPERATIVE PROTOCOL,
//  personalised to the reader's own time and place — "Choose the aim…", "Elect
//  the time…", "Prepare the materials…", "Consecrate at the elected hour: kindle
//  Saturn's suffumigation (opium, etc.) and speak the petition over the engraving
//  WHILE the smoke rises." That is the site instructing a reader, on a site whose
//  covenant is that its own voice never instructs, and it was returned to the
//  assistant as a callable `steps` array. The hostile audit recorded it as a
//  shipping blocker and FRAMING §9.14 specified the fix.
//
//  The fix is a VOICE fix, not a censorship pass. NOTHING historical is removed:
//  the aim, the election, the mansion, the materials, the named powers, the
//  design, the consecration and the fixed-star contact are all still here, and
//  still cited. What changed is the grammatical mood and person. Every entry of
//  `attestedSequence` is third-person and opens with an ATTRIBUTING FRAME — it
//  says who instructed whom — because "describing how people do something is
//  description; instructing the reader in the imperative mood is not" is a
//  testable criterion and "is this tasteful" is not.
//
//    was:  `Consecrate at the elected hour: kindle …, speak the petition …`
//    now:  `In Picatrix III the consecration is the fumigation and the prayer
//           together: the text describes the smoke as concurrent with the
//           inscription rather than preparatory to it.`
//
//  The output key is `attestedSequence`, never `steps` — FRAMING §5 A-3 forbids
//  any capability in the registry returning an ordered, imperative, personalised
//  sequence of operative steps, and a key named `steps` is the thing the tool
//  surface hands to a model. `scripts/tests/og-framing.mjs` pins all of it.
//
//  Harm-flagged materia (C-1): where a named material carries a harm flag, its
//  harm note is carried IN THE SAME OBJECT — `materials.harmNotes` and the
//  matching `attestedSequence` entry — never adjacent to it, so no prefix-
//  truncated extraction can take the material without the note.
// ============================================================================
import { electionScore, findNextElection, operationByKey, OPERATIONS } from './election.js';
import { PLANETARY_MAGIC, harmNoteFor } from './data/planetary-magic.js';
import { faceOf } from './data/decan-faces.js';
import { DECAN_FACES } from './data/decan-faces.js';

export const TALISMAN_DISCLAIMER =
  'Presented as historical magical practice for study, not instruction. Astrology and talismanic ' +
  'magic have no demonstrated efficacy; materials named in historical recipes may be toxic or illegal ' +
  'and are recorded, never recommended.';

// The register every entry of `attestedSequence` is written in. Exported so the
// framing test and any future renderer share ONE statement of the rule rather
// than two that can drift apart.
export const ATTESTED_VOICE_NOTE =
  'What the sources record, in the third person and attributed: the site reports what the texts direct ' +
  'their own operator to do, and never directs the reader to do anything.';

// A face ruled by the operation's planet (the tradition prefers engraving in such a face).
function preferredFace(planet) {
  return DECAN_FACES.find(f => f.ruler === planet) || null;
}

// Build the full record for `operationKey` at the moment/place of `chart`.
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

  // The harm note of the ruling planet's materia, if it carries one. It is put
  // into the materials object itself so it cannot be separated from the material.
  const harmNote = harmNoteFor(op.ruler);

  const materials = {
    suffumigation: m.suffumigation, colour: m.colour, metal: m.metal, stone: m.stone,
    spirits: {
      picatrixPrayerAngel: m.picatrixPrayerAngel || '(none — the planet is addressed directly)',
      agrippa: m.agrippa,
    },
    // C-1, the operable triple in three named typed fields: at most two of
    // {substance, quantity, processParam} are ever non-null on a harm-flagged
    // record, and nothing is normalised into modern units.
    suffumigationMateria: m.suffumigationMateria || null,
    harmFlagged: !!m.harmFlag,
    harmNotes: harmNote ? [harmNote] : [],
    normalised: false,
  };

  const design =
    `Agrippa (Three Books II.22–46) gives ${op.ruler}'s own talismanic image, engraved upon ${m.metal} ` +
    `in the day and hour of ${op.ruler} with the Moon well placed. ` +
    (pf ? `(A related decan image — the face of ${op.ruler}, ${pf.sign} face ${pf.decan}, a DIFFERENT image-set from the planetary images — is described as: ${pf.image})` :
          `The tradition asks for the planet strong and dignified.`);

  // ── The attested sequence: what the sources record, third-person, cited. ──
  // Each entry opens with an attributing frame naming WHO instructs WHOM. No
  // entry is addressed to the reader and no entry is in the imperative mood.
  const attestedSequence = [
    { text: `Picatrix III assigns the aim "${op.label}" to ${op.ruler}.`,
      attributedTo: 'Picatrix', cite: `Picatrix III / ${op.book}` },

    { text: `The tradition elects the day and hour of ${op.ruler}` +
            `${e.hour ? ` (at this moment it is the hour of ${e.hour.ruler}, on a ${e.hour.dayRuler} day)` : ''}, ` +
            `with ${op.ruler} dignified and free of the malefics and the Moon ${op.polarity === 'increase' ? 'waxing and swift' : 'waning'}, ` +
            `neither void of course nor in the via combusta.`,
      attributedTo: 'The tradition', cite: 'Lilly CA pp.121-123; SOURCE-DATA §5' },

    { text: `Agrippa II.33 and Picatrix I.4 place the Moon by mansion: she stands in Mansion ${e.moon.mansion.num} (${e.moon.mansion.name}), which those texts assign to “${e.moon.mansion.use}”` +
            `${op.keywords.some(k => (e.moon.mansion.use || '').toLowerCase().includes(k)) ? ' — a use the sources would count as fitting this aim' : ''}.`,
      attributedTo: 'Agrippa', cite: 'Agrippa II.33 / Picatrix I.4' },

    { text: `The materials recorded for ${op.ruler} are a suffumigation of ${m.suffumigation}, the colour ${m.colour}, ` +
            `the metal ${m.metal} and the stone ${m.stone}. ` +
            (harmNote || 'The archaic measures are not reliably convertible and are not converted here.'),
      attributedTo: 'The materials recorded', cite: `Picatrix III / Agrippa II (planetary-magic, ${m.source})`,
      harmNote: harmNote || null },

    { text: `Picatrix III.7 and Agrippa II name the powers in two systems the sources keep distinct: ` +
            `the Picatrix prayer-angel is ${materials.spirits.picatrixPrayerAngel}, while Agrippa's triad for ${op.ruler} is ` +
            `Angel ${m.agrippa.angel}, Intelligence ${m.agrippa.intelligence}, Spirit ${m.agrippa.spirit}.`,
      attributedTo: 'Picatrix', cite: 'Picatrix III.7; Agrippa II' },

    { text: design, attributedTo: 'Agrippa', cite: 'Agrippa, Three Books II.22–46 (planetary images); II.37 (faces)' },

    { text: `In Picatrix III the consecration is the fumigation and the prayer together: the text describes the smoke as ` +
            `concurrent with the inscription rather than preparatory to it, and it is that concurrence which the book says ` +
            `"draws the spirit" into the image. The site reports the structure of the rite and does not reproduce its working.`,
      attributedTo: 'Picatrix', cite: 'Picatrix III (the suffumigation & prayer as the consecrating act)' },

    star
      ? { text: `Agrippa II records the Behenian fixed stars as strengthening such a work; at this moment ${star.star} stands within ${star.sep.toFixed(1)}° of ${star.planet}.`,
          attributedTo: 'Agrippa', cite: 'Agrippa II (Behenian stars)' }
      : { text: `Agrippa II records the Behenian fixed stars as strengthening such a work; at this moment none is conjunct the significator, and the tradition would wait for one where a star was wanted.`,
          attributedTo: 'Agrippa', cite: 'Agrippa II (Behenian stars)' },
  ];

  const citations = [...new Set(attestedSequence.map(s => s.cite))];

  return {
    aim: op.label, operationKey: op.key, planet: op.ruler, book: op.book,
    when: chart.date, where: { lat: chart.latitude, lon: chart.longitude },
    verdict: e.verdict, verdictLabel: e.label, score: e.score,
    hour: e.hour, window,
    moon: e.moon, sunFace: e.sunFace,
    materials, design, stars: e.stars, star,
    // FRAMING §9.14: `steps` is gone. This key is deliberately NOT named
    // steps / procedure / instructions / recipe.
    attestedSequence, voice: ATTESTED_VOICE_NOTE, citations,
    harmNotes: materials.harmNotes,
    disclaimer: TALISMAN_DISCLAIMER,
  };
}

// Convenience: the attested record for every aim at one moment (for an overview).
export function allRecipes(chart, opts = {}) {
  return OPERATIONS.map(o => talismanRecipe(chart, o.key, opts));
}
