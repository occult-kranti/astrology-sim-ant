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
// ============================================================================

const SOURCE = 'Picatrix III.7; Agrippa, Three Books II (see research/SOURCE-DATA.md §4)';

export const PLANETARY_MAGIC = {
  Saturn: {
    governs: 'binding, long-term, secret knowledge, endings',
    suffumigation: 'opium, etc.',
    colour: 'black',
    metal: 'lead',
    stone: 'onyx/turquoise',
    picatrixPrayerAngel: 'Heylil',
    agrippa: { angel: 'Zaphkiel', intelligence: 'Agiel', spirit: 'Zazel' },
    source: SOURCE
  },
  Jupiter: {
    governs: 'wealth, favour of great men, law, peace',
    suffumigation: 'storax, frankincense',
    colour: 'yellow/white',
    metal: 'tin',
    stone: 'sapphire/chalcedony',
    picatrixPrayerAngel: 'Raucayehil',
    agrippa: { angel: 'Zadkiel', intelligence: 'Iophiel', spirit: 'Hismael' },
    source: SOURCE
  },
  Mars: {
    governs: 'victory in war, vengeance, discord',
    suffumigation: 'aloes wood, (blood, hist.)',
    colour: 'red',
    metal: 'iron',
    stone: 'bloodstone',
    picatrixPrayerAngel: 'Raucahehil',
    agrippa: { angel: 'Camael', intelligence: 'Graphiel', spirit: 'Bartzabel' },
    source: SOURCE
  },
  Sun: {
    governs: 'honour, kingship, high office',
    suffumigation: '"hermits\'" 31-spice; saffron',
    colour: 'gold/yellow',
    metal: 'gold',
    stone: 'diamond',
    picatrixPrayerAngel: '', // (none; Sun direct) per SOURCE-DATA §4
    agrippa: { angel: 'Raphael', intelligence: 'Nakhiel', spirit: 'Sorath' },
    source: SOURCE
  },
  Venus: {
    governs: 'love, concord, friendship, beauty',
    suffumigation: 'aloes, mastic, roses',
    colour: 'white(/gold)',
    metal: 'copper',
    stone: 'emerald/coral',
    picatrixPrayerAngel: 'Beyteyl',
    agrippa: { angel: 'Haniel', intelligence: 'Hagiel', spirit: 'Kedemel' },
    source: SOURCE
  },
  Mercury: {
    governs: 'knowledge, eloquence, commerce',
    suffumigation: 'cloves, cumin, myrtle',
    colour: 'mixed (scribe)',
    metal: 'fixed mercury',
    stone: 'agate/emerald',
    picatrixPrayerAngel: 'Arquyl',
    agrippa: { angel: 'Michael', intelligence: 'Tiriel', spirit: 'Taphthartharath' },
    source: SOURCE
  },
  Moon: {
    governs: 'journeys, messages, beginnings',
    suffumigation: '28-component lunar',
    colour: 'silver/white',
    metal: 'silver',
    stone: 'crystal/pearl',
    picatrixPrayerAngel: 'Celan',
    agrippa: { angel: 'Gabriel', intelligence: 'Malka betharsisim', spirit: 'Hasmodai' },
    source: SOURCE
  }
};

export const MAGIC_DISCLAIMER = 'These planetary correspondences are presented strictly as historical magical practice for study, not as instruction, and astrology has no demonstrated validity.';

export function magicFor(planet) {
  return PLANETARY_MAGIC[planet];
}
