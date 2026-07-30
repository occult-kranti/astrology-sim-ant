// ============================================================================
//  planetary-magic.js — Per-planet Picatrix/Agrippa talisman correspondences.
//
//  HISTORICAL PRACTICE, DESCRIBED — NOT PRESCRIBED. This module records the
//  planetary talisman correspondences of Renaissance/medieval astral magic
//  exactly as they appear in the historical sources. It is reference material
//  for STUDY of the texts, not instruction. Astrology and talismanic magic
//  have no demonstrated validity.
//
//  SAFETY/FRAMING (non-negotiable): some historical recipes name substances
//  that are toxic or illegal (e.g. opium; "blood" in martial recipes). These
//  are reproduced because the historical texts list them — they are DESCRIBED,
//  never RECOMMENDED. Do not attempt any historical recipe.
//
//  Sources (see research/SOURCE-DATA.md §4 for the authoritative table):
//   • Picatrix (Ghayat al-Hakim), Book III.7 — planetary prayer-angels,
//     suffumigations, colours, metals, stones.
//   • Cornelius Agrippa, "Three Books of Occult Philosophy" Book II — the
//     Angel / Intelligence / Spirit triad of each planet (esotericarchives.com).
//
//  IMPORTANT fidelity note: spirit-names come from DIFFERENT source-systems that
//  must NOT be conflated. This module represents TWO of them and keeps them
//  separate; a third (the Picatrix "Mirror of the planets" angels) is noted but
//  not yet included:
//   • picatrixPrayerAngel  — Picatrix Bk III.7 prayer-angel (Sun has none). [system 1]
//   • agrippa.{angel, intelligence, spirit} — Agrippa's ONE triad per planet:
//     the Angel, its Intelligence (good genius), and its Spirit (the "demon"
//     name). These three are roles WITHIN a single system, not three systems. [system 2]
//   • (not included) the Picatrix "Mirror" angels — a distinct further set. [system 3]
//  Planet names follow the codebase convention:
//   Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.
//
//  THE OPERABLE TRIPLE (docs/FRAMING.md §5, carve-out C-1). For any harm-flagged
//  materia the site may carry at most TWO of {substance · quantity · process
//  parameter (temperature, duration, cycle count, route)} in its own voice. The
//  three facts therefore live in three NAMED, TYPED fields on `suffumigationMateria`
//  and never in free prose, so the third has nowhere to live and there is no regex
//  to defeat. `normalised: false` is a required literal: archaic measures are never
//  converted, because a converted number would be a fabricated number carrying this
//  site's authority on exactly the substances where a wrong number is dangerous.
//  Where `harmFlag` is true the record carries its own `harmNote`, and every
//  generated output that names the material must carry that note in the SAME object.
// ============================================================================

const SOURCE = 'Picatrix III.7; Agrippa, Three Books II (see research/SOURCE-DATA.md §4)';

// A materia record for a suffumigation that is NOT harm-flagged: the substance as
// the text names it, no quantity, no process parameter, nothing normalised.
const plainMateria = (substance) => ({
  substance,
  quantity: null,
  processParam: null,
  withheldReason: 'The site carries the substance as the text names it and no quantity or process parameter; the historical measures are archaic, regionally variable and not reliably convertible.',
  normalised: false,
});

export const PLANETARY_MAGIC = {
  Saturn: {
    governs: 'binding, long-term, secret knowledge, endings',
    suffumigation: 'opium, etc.',
    colour: 'black',
    metal: 'lead',
    stone: 'onyx/turquoise',
    picatrixPrayerAngel: 'Heylil',
    agrippa: { angel: 'Zaphkiel', intelligence: 'Agiel', spirit: 'Zazel' },
    source: SOURCE,
    harmFlag: true,
    harmNote: 'Harm note (C-1). Opium is the dried latex of Papaver somniferum and a controlled substance in most jurisdictions. Its principal alkaloids — morphine, codeine, thebaine — are respiratory depressants, and the smoke of a burning preparation is a route of administration, not an inert perfume: respiratory depression is the mechanism by which opioid poisoning kills. The site records the material because Picatrix III.7 lists it among Saturn\'s suffumigants; it carries no quantity and no process parameter for it, and converts nothing.',
    suffumigationMateria: {
      substance: 'opium, etc.',
      quantity: null,
      processParam: null,
      withheldReason: 'Harm-flagged (C-1): the substance is named because the source names it; the quantity and the process parameter are null so that the operable triple cannot be assembled from this record.',
      normalised: false,
    },
  },
  Jupiter: {
    governs: 'wealth, favour of great men, law, peace',
    suffumigation: 'storax, frankincense',
    colour: 'yellow/white',
    metal: 'tin',
    stone: 'sapphire/chalcedony',
    picatrixPrayerAngel: 'Raucayehil',
    agrippa: { angel: 'Zadkiel', intelligence: 'Iophiel', spirit: 'Hismael' },
    source: SOURCE,
    harmFlag: false,
    harmNote: null,
    suffumigationMateria: plainMateria('storax, frankincense'),
  },
  Mars: {
    governs: 'victory in war, vengeance, discord',
    suffumigation: 'aloes wood, (blood, hist.)',
    colour: 'red',
    metal: 'iron',
    stone: 'bloodstone',
    picatrixPrayerAngel: 'Raucahehil',
    agrippa: { angel: 'Camael', intelligence: 'Graphiel', spirit: 'Bartzabel' },
    source: SOURCE,
    harmFlag: true,
    harmNote: 'Harm note (C-1). Picatrix III.7 lists blood among the martial suffumigants. Blood of unknown origin is a bloodborne-pathogen exposure route — hepatitis B, hepatitis C and HIV are transmitted by contact with infected blood through broken skin or mucous membrane — and burning it aerosolises that material. The sourcing and disposal of animal blood is separately regulated in many jurisdictions. The site records the ingredient because the text lists it, carries no quantity and no process parameter for it, and converts nothing.',
    suffumigationMateria: {
      substance: 'aloes wood, (blood, hist.)',
      quantity: null,
      processParam: null,
      withheldReason: 'Harm-flagged (C-1): the substances are named because the source names them; the quantity and the process parameter are null so that the operable triple cannot be assembled from this record.',
      normalised: false,
    },
  },
  Sun: {
    governs: 'honour, kingship, high office',
    suffumigation: '"hermits\'" 31-spice; saffron',
    colour: 'gold/yellow',
    metal: 'gold',
    stone: 'diamond',
    picatrixPrayerAngel: '', // (none; Sun direct) per SOURCE-DATA §4
    agrippa: { angel: 'Raphael', intelligence: 'Nakhiel', spirit: 'Sorath' },
    source: SOURCE,
    harmFlag: false,
    harmNote: null,
    suffumigationMateria: plainMateria('"hermits\'" 31-spice; saffron'),
  },
  Venus: {
    governs: 'love, concord, friendship, beauty',
    suffumigation: 'aloes, mastic, roses',
    colour: 'white(/gold)',
    metal: 'copper',
    stone: 'emerald/coral',
    picatrixPrayerAngel: 'Beyteyl',
    agrippa: { angel: 'Haniel', intelligence: 'Hagiel', spirit: 'Kedemel' },
    source: SOURCE,
    harmFlag: false,
    harmNote: null,
    suffumigationMateria: plainMateria('aloes, mastic, roses'),
  },
  Mercury: {
    governs: 'knowledge, eloquence, commerce',
    suffumigation: 'cloves, cumin, myrtle',
    colour: 'mixed (scribe)',
    metal: 'fixed mercury',
    stone: 'agate/emerald',
    picatrixPrayerAngel: 'Arquyl',
    agrippa: { angel: 'Michael', intelligence: 'Tiriel', spirit: 'Taphthartharath' },
    source: SOURCE,
    harmFlag: false,
    harmNote: null,
    suffumigationMateria: plainMateria('cloves, cumin, myrtle'),
  },
  Moon: {
    governs: 'journeys, messages, beginnings',
    suffumigation: '28-component lunar',
    colour: 'silver/white',
    metal: 'silver',
    stone: 'crystal/pearl',
    picatrixPrayerAngel: 'Celan',
    agrippa: { angel: 'Gabriel', intelligence: 'Malka betharsisim', spirit: 'Hasmodai' },
    source: SOURCE,
    harmFlag: false,
    harmNote: null,
    suffumigationMateria: plainMateria('28-component lunar'),
  }
};

export const MAGIC_DISCLAIMER = 'These planetary correspondences are presented strictly as historical magical practice for study, not as instruction, and astrology has no demonstrated validity.';

export function magicFor(planet) {
  return PLANETARY_MAGIC[planet];
}

// The harm note that MUST travel in the same object as any generated output
// naming this planet's materia (FRAMING §5, A-3). Returns null where the record
// carries no harm flag — an absent note is a stated fact, never an omission.
export function harmNoteFor(planet) {
  const m = PLANETARY_MAGIC[planet];
  return m && m.harmFlag ? m.harmNote : null;
}

// True where a record would put all three of {substance, quantity, processParam}
// in the site's own voice. It must be false for every shipped record; the test
// asserts it, so the C-1 ceiling is checked where the data lives and not only
// where it renders.
export function isOperableTriple(materia) {
  if (!materia) return false;
  return materia.substance != null && materia.quantity != null && materia.processParam != null;
}
