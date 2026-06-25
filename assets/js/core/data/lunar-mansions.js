// ============================================================================
//  lunar-mansions.js — The 28 Lunar Mansions (Mansions of the Moon), TROPICAL,
//  Mansion 1 (Al Sharatain) beginning at 0° Aries, each mansion a uniform
//  12°51′26″ = 360/28 = 12.857142857° arc of the ecliptic.
//
//  Sources (all cross-checked; see /pages/about and research/SOURCE-DATA.md §1):
//   • Cornelius Agrippa, "Three Books of Occult Philosophy" Bk II ch.33 — the
//     brief magical "use" of each mansion (esotericarchives.com/agrippa).
//   • Picatrix Bk I.4 — expands Agrippa's uses (image/spirit/suffumigation to be
//     added in a second pass).
//   • Christopher Warnock / Renaissance Astrology — modern authority, matches.
//
//  IMPORTANT fidelity notes:
//   • TROPICAL scheme: Al-Sharatain fixed at 0° Aries, each 12°51′26″, confirmed
//     across Picatrix / Agrippa / Warnock. A SIDEREAL lunar-zodiac variant also
//     exists (the mansions tied to the stars rather than 0° tropical Aries) —
//     this module deliberately uses the tropical scheme.
//   • Numeric `start`/`end` are COMPUTED from the uniform-arc formula
//     start(n) = (n−1) × MANSION_ARC; `signSpan` carries the human sign-degree
//     form for display. The "Start" column of the source table is the same value
//     rounded to the arc-minute.
//   • SPELLINGS vary by source (Al Sharatain / Alnath; Al Jubana / Az Zubana).
//     A canonical `name` is stored plus common `aliases`.
//   • `indicator` is the indicator/marker star of the mansion where commonly
//     given, else "".
// ============================================================================

// One mansion = 360°/28 = 12°51′26″ = 12.857142857142858°.
export const MANSION_ARC = 360 / 28;

// ---------------------------------------------------------------------------
//  The 28 mansions. `start`/`end` are ecliptic longitude in degrees [0,360).
//  `use` is Agrippa Bk II.33 (brief); Picatrix Bk I.4 expands it.
// ---------------------------------------------------------------------------
export const LUNAR_MANSIONS = [
  { num: 1,  start: 0 * MANSION_ARC,  end: 1 * MANSION_ARC,
    name: 'Al Sharatain', aliases: ['Alnath', 'Al Sharatan'],
    signSpan: '0°00′ Aries – 12°51′ Aries', indicator: 'β Arietis (Sheratan)',
    use: 'journeys; discord/medicines',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 2,  start: 1 * MANSION_ARC,  end: 2 * MANSION_ARC,
    name: 'Al Butain', aliases: ['Allothaim', 'Al Butayn'],
    signSpan: '12°51′ Aries – 25°43′ Aries', indicator: '',
    use: 'finding treasure; reconciliation',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 3,  start: 2 * MANSION_ARC,  end: 3 * MANSION_ARC,
    name: 'Al Thurayya', aliases: ['Pleiades', 'Athoray'],
    signSpan: '25°43′ Aries – 8°34′ Taurus', indicator: 'Alcyone (η Tauri / Pleiades)',
    use: 'good fortune; alchemy/hunting',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 4,  start: 3 * MANSION_ARC,  end: 4 * MANSION_ARC,
    name: 'Al Dabaran', aliases: ['Aldebaran', 'Aldebaram'],
    signSpan: '8°34′ Taurus – 21°26′ Taurus', indicator: 'Aldebaran (α Tauri)',
    use: 'revenge, separation, enmity',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 5,  start: 4 * MANSION_ARC,  end: 5 * MANSION_ARC,
    name: "Al Haq'ah", aliases: ['Alhecega', 'Al Hakah'],
    signSpan: '21°26′ Taurus – 4°17′ Gemini', indicator: 'λ Orionis (Meissa)',
    use: 'favour of kings; business',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 6,  start: 5 * MANSION_ARC,  end: 6 * MANSION_ARC,
    name: "Al Han'ah", aliases: ['Alhanna', 'Al Hena'],
    signSpan: '4°17′ Gemini – 17°09′ Gemini', indicator: 'γ Geminorum (Alhena)',
    use: 'love between two',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 7,  start: 6 * MANSION_ARC,  end: 7 * MANSION_ARC,
    name: 'Al Dhira', aliases: ['Aldimiach', 'Al Dhira’a'],
    signSpan: '17°09′ Gemini – 0°00′ Cancer', indicator: 'Castor & Pollux (α/β Geminorum)',
    use: 'gain; friendship; protection',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 8,  start: 7 * MANSION_ARC,  end: 8 * MANSION_ARC,
    name: 'Al Nathrah', aliases: ['Alnaza', 'Al Nathra'],
    signSpan: '0°00′ Cancer – 12°51′ Cancer', indicator: 'Praesepe (M44, the Beehive)',
    use: 'victory in war; (banishing)',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 9,  start: 8 * MANSION_ARC,  end: 9 * MANSION_ARC,
    name: 'Al Tarf', aliases: ['Archaam', 'Al Tarph'],
    signSpan: '12°51′ Cancer – 25°43′ Cancer', indicator: 'κ Cancri',
    use: 'sickness/affliction (malefic)',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 10, start: 9 * MANSION_ARC,  end: 10 * MANSION_ARC,
    name: 'Al Jabhah', aliases: ['Algebh', 'Al Jabha'],
    signSpan: '25°43′ Cancer – 8°34′ Leo', indicator: 'Algieba (γ Leonis)',
    use: 'love; childbirth/healing',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 11, start: 10 * MANSION_ARC, end: 11 * MANSION_ARC,
    name: 'Al Zubrah', aliases: ['Azobra', 'Al Zubra'],
    signSpan: '8°34′ Leo – 21°26′ Leo', indicator: 'Zosma (δ Leonis)',
    use: 'fear, reverence; besieging',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 12, start: 11 * MANSION_ARC, end: 12 * MANSION_ARC,
    name: 'Al Sarfah', aliases: ['Alzarpha', 'Al Sarfa'],
    signSpan: '21°26′ Leo – 4°17′ Virgo', indicator: 'Denebola (β Leonis)',
    use: 'separation of lovers; harvests',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 13, start: 12 * MANSION_ARC, end: 13 * MANSION_ARC,
    name: 'Al Awwa', aliases: ['Alhaire', 'Al ‘Awwa'],
    signSpan: '4°17′ Virgo – 17°09′ Virgo', indicator: 'β/γ/δ/ε Virginis',
    use: 'concord of married couples',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 14, start: 13 * MANSION_ARC, end: 14 * MANSION_ARC,
    name: 'Al Simak', aliases: ['Achureth', 'Spica', 'Al Simak al A‘zal'],
    signSpan: '17°09′ Virgo – 0°00′ Libra', indicator: 'Spica (α Virginis)',
    use: 'divorce/separation; healing',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 15, start: 14 * MANSION_ARC, end: 15 * MANSION_ARC,
    name: 'Al Ghafr', aliases: ['Agrapha', 'Al Ghafer'],
    signSpan: '0°00′ Libra – 12°51′ Libra', indicator: 'ι/κ/λ Virginis',
    use: 'friendship & goodwill; treasure',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 16, start: 15 * MANSION_ARC, end: 16 * MANSION_ARC,
    name: 'Al Jubana', aliases: ['Azubene', 'Az Zubana', 'Al Zubana'],
    signSpan: '12°51′ Libra – 25°43′ Libra', indicator: 'Zubenelgenubi (α Librae)',
    use: 'merchandising/gain; (freeing captives)',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 17, start: 16 * MANSION_ARC, end: 17 * MANSION_ARC,
    name: 'Al Iklil', aliases: ['Alchil', 'Al Iklil al Jabhah'],
    signSpan: '25°43′ Libra – 8°34′ Scorpio', indicator: 'β/δ/π Scorpii',
    use: 'protection vs thieves; lasting love',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 18, start: 17 * MANSION_ARC, end: 18 * MANSION_ARC,
    name: 'Al Qalb', aliases: ['Alchas', 'Antares', 'Al Qalb al Aqrab'],
    signSpan: '8°34′ Scorpio – 21°26′ Scorpio', indicator: 'Antares (α Scorpii)',
    use: 'against fevers; victory',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 19, start: 18 * MANSION_ARC, end: 19 * MANSION_ARC,
    name: 'Al Shaulah', aliases: ['Allatha', 'Al Shaula'],
    signSpan: '21°26′ Scorpio – 4°17′ Sagittarius', indicator: 'Shaula & Lesath (λ/υ Scorpii)',
    use: 'birth/healing; catch fugitives',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 20, start: 19 * MANSION_ARC, end: 20 * MANSION_ARC,
    name: "Al Na'am", aliases: ['Abnahaya', 'Al Na‘a’im'],
    signSpan: '4°17′ Sagittarius – 17°09′ Sagittarius', indicator: 'γ/δ/ε/η Sagittarii',
    use: 'taming beasts/hunting',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 21, start: 20 * MANSION_ARC, end: 21 * MANSION_ARC,
    name: 'Al Baldah', aliases: ['Abeda', 'Al Balda'],
    signSpan: '17°09′ Sagittarius – 0°00′ Capricorn', indicator: 'π Sagittarii',
    use: 'destruction/ruin; separate spouses',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 22, start: 21 * MANSION_ARC, end: 22 * MANSION_ARC,
    name: 'Al Sa’d al Dhabih', aliases: ['Sadahacha', 'Al Sad al Dhabih'],
    signSpan: '0°00′ Capricorn – 12°51′ Capricorn', indicator: 'α/β Capricorni (Algedi/Dabih)',
    use: 'security of fugitives; discord',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 23, start: 22 * MANSION_ARC, end: 23 * MANSION_ARC,
    name: 'Al Sa’d al Bula', aliases: ['Zabadola', 'Al Sad al Bula‘'],
    signSpan: '12°51′ Capricorn – 25°43′ Capricorn', indicator: 'ε/μ/ν Aquarii',
    use: 'destruction & wasting; healing',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 24, start: 23 * MANSION_ARC, end: 24 * MANSION_ARC,
    name: 'Al Sa’d al Su’ud', aliases: ['Sadabath', 'Al Sad al Su‘ud'],
    signSpan: '25°43′ Capricorn – 8°34′ Aquarius', indicator: 'β Aquarii (Sadalsuud)',
    use: 'multiplying herds; goodwill',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 25, start: 24 * MANSION_ARC, end: 25 * MANSION_ARC,
    name: 'Al Sa’d al Akhbiyah', aliases: ['Sadalabra', 'Al Sad al Akhbiya'],
    signSpan: '8°34′ Aquarius – 21°26′ Aquarius', indicator: 'γ Aquarii (Sadachbia)',
    use: 'preserve trees/harvests; separate',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 26, start: 25 * MANSION_ARC, end: 26 * MANSION_ARC,
    name: 'Al Fargh al Muqaddam', aliases: ['Alpharg', 'Al Fargh al Awwal', 'Al Fargh al Mukdim'],
    signSpan: '21°26′ Aquarius – 4°17′ Pisces', indicator: 'α/β Pegasi (Markab/Scheat)',
    use: 'love & favour',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 27, start: 26 * MANSION_ARC, end: 27 * MANSION_ARC,
    name: "Al Fargh al Mu'akhkhar", aliases: ['Alcharya', 'Al Fargh al Thani', 'Al Fargh al Mu‘akhkhar'],
    signSpan: '4°17′ Pisces – 17°09′ Pisces', indicator: 'γ Pegasi & α Andromedae',
    use: 'destroy springs; obstruct building',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' },
  { num: 28, start: 27 * MANSION_ARC, end: 28 * MANSION_ARC,
    name: 'Al Batn al Hut', aliases: ['Albotham', 'Al Risha', 'Al Batn al Hoot'],
    signSpan: '17°09′ Pisces – 0°00′ Aries', indicator: 'β Andromedae (Mirach)',
    use: 'gather fish; concord of married',
    source: 'Agrippa, Three Books II.33; Picatrix I.4 (see research/SOURCE-DATA.md §1)' }
];

// ---------------------------------------------------------------------------
//  Lookup: which mansion contains a given ecliptic longitude?
//  Normalizes to [0,360), then index = floor(norm / MANSION_ARC).
//  Returns mansion #1 for 0, #28 for 359.9.
// ---------------------------------------------------------------------------
export function mansionOf(moonLon) {
  const norm = ((moonLon % 360) + 360) % 360; // → [0,360)
  const idx = Math.floor(norm / MANSION_ARC); // 0..27
  return LUNAR_MANSIONS[idx];
}
