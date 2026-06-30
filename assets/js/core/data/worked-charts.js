// ============================================================================
//  worked-charts.js — William Lilly's OWN horary charts, with their PRINTED
//  positions, so the engine can read the very figures that made Christian
//  Astrology famous (see app/worked-charts.js + core/chart-from-positions.js).
//
//  SOURCING & HONESTY. Each `figure` holds the positions as printed in Lilly's
//  1647 woodcut (read from the Internet Archive scans) and cross-checked against
//  the standard analyses (Frawley, Houlding/skyscript, Anthony Louis). Lilly's
//  PROSE usually names only the signs and house-roles; the degrees come from the
//  woodcut, which is not always legible — so each entry carries explicit
//  `caveats`, and a planet whose reading is uncertain is flagged there. Old-Style
//  (Julian) dates are noted as Lilly gives them.
//
//  Astrology has no demonstrated predictive validity; these are shown to teach
//  Lilly's METHOD and its history — described, never prescribed.
// ============================================================================

export const WORKED_CHARTS = [
  {
    key: 'stolen-fish',
    title: 'Fish stolen — “who took them, and shall I recover them?”',
    tag: '7th house · theft · the peregrine planet in an angle',
    technique: 'theft: the thief as the peregrine planet in an angle',
    dateNote: '10 February 1637/8 (Old Style), 8:45 a.m.',
    place: 'Walton-on-Thames / London, ≈51°N',
    completeness: 'full-figure',
    querentHouse: 1,
    quesitedHouse: 7,
    figure: {
      asc: '27 Taurus 3', mc: '14 Capricorn 0',
      planets: [
        { name: 'Saturn',  sign: 'Aquarius', degree: 1,  minute: 46, retrograde: false, house: 11 },
        { name: 'Jupiter', sign: 'Scorpio',  degree: 5,  minute: 3,  retrograde: true,  house: 7 },
        { name: 'Mars',    sign: 'Scorpio',  degree: 29, minute: 51, retrograde: false, house: 7 },
        { name: 'Sun',     sign: 'Pisces',   degree: 1,  minute: 0,  retrograde: false, house: 12 },
        { name: 'Mercury', sign: 'Pisces',   degree: 18, minute: 0,  retrograde: false, house: 12 },
        { name: 'Venus',   sign: 'Pisces',   degree: 18, minute: 20, retrograde: false, house: 12 },
        { name: 'Moon',    sign: 'Taurus',   degree: 15, minute: 6,  retrograde: false, house: 1 },
      ],
    },
    question: 'Lilly, living in the country, had bought fish in London for his Lent provision; it came down by barge to Walton, where a waterman told him the warehouse had been robbed overnight and the fish stolen. He took the moment he first heard the report and erected a figure to learn who took the goods and whether they could be recovered.',
    significators: 'The querent is Venus (lady of Taurus rising) with the Moon, exalted in Taurus on the Ascendant, as co-significatrix; the stolen goods are the 2nd house and its lord Mercury; the thief is the 7th house — and Lilly fixes on the only peregrine planet in an angle, Jupiter on the cusp of the 7th.',
    reasoning: 'Every relevant significator stands in a water sign — Jupiter in Scorpio (the thief), Mercury (the goods) in Pisces, the Moon watery and earthy on the Ascendant — so the thief lives upon the water (a fisherman) and the goods are in a moist, low place. Mars, lord of the 7th, was departing his own sign Scorpio, showing a man who had lately moved house; the description from Mars and Jupiter gave a tall, thick, full-bodied, fair man with red or yellowish hair. For recovery, the Moon (lady of the goods’ fortune) applies to Mercury, lord of the 2nd — so the goods would be heard of — but Mercury is weak in Pisces (his fall and detriment), so only part would be regained.',
    verdict: 'Lilly judged the thief a waterman/fisherman of that description, living near the Thames, who had lately changed dwelling; the fish hidden in a moist, low place; and the goods heard of and PARTLY — not wholly — recovered, because the significator of the substance was weak though applied to by the Moon.',
    outcome: 'A fisherman of exactly that description was found by the Thames, lately moved house. With a warrant kept private until the Sunday following, Lilly searched that one house with a constable: he found part of the fish — some in water, some already eaten — and the man confessed all. The partial recovery the figure promised came to pass.',
    sources: 'William Lilly, Christian Astrology (London, 1647), Book II, ch. LIV “Fish Stolen”, pp. 397–398 (prose + woodcut figure, centre “10 Feb 1638, 8:45 a.m.”), read from the 1647 first-edition scan on the Internet Archive. Analysis & reconstruction: John Frawley, “Where is my fish?” (astrologiaoraria.com); Deborah Houlding’s annotated CA index (skyscript.co.uk/CA.html).',
    caveats: 'Degrees are from the woodcut, not the prose. Two readings are uncertain: the Moon’s exact minute is not legibly printed (15 Taurus 06 from the modern recomputation; Lilly treats it as on the Ascendant, exalted, though by equal houses from 27 Taurus it would fall in the 12th), and VENUS is the largest discrepancy — the woodcut clusters Venus near 18 Pisces in the 12th with the Sun and Mercury, but the modern recomputation puts Venus at 18 Aquarius in the 11th. Jupiter’s retrograde is inferred from the recomputation, not an R-mark in the woodcut. The wheel is drawn with equal houses from the printed Ascendant; the engine’s “thief = lord of the 7th (Mars)” differs from Lilly’s special theft rule (the peregrine planet in an angle, Jupiter) — that special rule is the lesson here.',
  },

  {
    key: 'ship-at-sea',
    title: 'A ship at sea — “if sunk, or living?”',
    tag: '1st house · the body of the ship',
    technique: 'reading a thing by its own significator (the Ascendant = the ship)',
    dateNote: '28 December 1644 (Old Style), 3:20 p.m.',
    place: 'London',
    completeness: 'full-figure',
    querentHouse: 1,
    quesitedHouse: 1,
    figure: {
      asc: '11 Gemini 33', mc: '14 Taurus 31',
      planets: [
        { name: 'Moon',    sign: 'Taurus',  degree: 16, minute: 49, retrograde: false, house: 11 },
        { name: 'Jupiter', sign: 'Taurus',  degree: 24, minute: 21, retrograde: true,  house: 11 },
        { name: 'Mars',    sign: 'Gemini',  degree: 19, minute: 26, retrograde: true,  house: 12 },
        { name: 'Saturn',  sign: 'Aries',   degree: 14, minute: 31, retrograde: false, house: 12 },
        { name: 'Sun',     sign: 'Capricorn', degree: 17, minute: 10, retrograde: false, house: 7 },
        { name: 'Mercury', sign: 'Capricorn', degree: 17, minute: 33, retrograde: false, house: 7 },
        { name: 'Venus',   sign: 'Sagittarius', degree: 4, minute: 39, retrograde: false, house: 8 },
      ],
    },
    question: 'A London merchant had sent a ship to the coast of Spain; after great storms (in which many ships were wrecked) the report of her loss was so general that no insurer would touch her, even at 60 per cent. A friend asked Lilly what he thought — “if sunk, or living?”',
    significators: 'Gemini ascending (11°33′): the Ascendant is the body of the ship, and the Moon — lady of the Ascendant — is the ship’s life and her company. The Moon stood exalted in Taurus in the 11th, the house of comfort, bodily near to Jupiter.',
    reasoning: 'The Moon, in her exaltation in the 11th and “no manner of way impedited”, applied to the fortune Jupiter, and all the significators stood above the earth, with no infortunes in the angles — “if the Moon apply to the Fortunes, there is reason we hope well.” Saturn cast his square from a cardinal sign (Aries) near the ascending degrees, and fixed stars of Saturn’s nature rose with Gemini, so the ship was “of the nature of Saturn — a sluggish, heavy one, of no good speed,” that had taken some bruise or leak. But the Moon interposed her sextile to the ascending degree between the Ascendant and the dangerous opposition of the Sun and Mercury in the 7th — “all opposite aspects to the Ascendant in this judgement are dangerous.”',
    verdict: '“I gave my opinion that the ship was not lost, but did live, and though of late in some danger, yet was now recovered.” She lay to the south-west, on the English coast, put into a harbour to mend her rents; news or letters would come that night or within two days.',
    outcome: 'It proved true — “she was in the west, and in a harbour,” and word arrived within the day or two Lilly had named.',
    sources: 'Lilly, Christian Astrology (1647), Book II, “Of a Ship at Sea, her safety or destruction,” pp. 157–165 (the worked figure pp. 162–163), read from the 1647 first-edition scan on the Internet Archive; discussion at skyscript.co.uk/shiphorary.html. Longitudes cross-checked against the Swiss Ephemeris for 28 Dec 1644 O.S.',
    caveats: 'Old Style (Julian): 28 Dec 1644 O.S. ≈ 7 Jan 1645 N.S. Lilly’s 17th-century tables run up to ~3° off a modern recompute (e.g. Jupiter printed 24°21′ Taurus vs modern 21°28′), but every planet’s sign, retrograde state and house agree. VENUS is the one low-confidence position (its printed degree could not be read cleanly off the woodcut; the modern value, Sag 4°39′ in the 8th, is shown). The wheel is drawn with equal houses from the printed Ascendant.',
  },

  {
    key: 'marriage',
    title: 'A lady — “shall she marry the gentleman desired?”',
    tag: '7th house · marriage · translation of light',
    technique: 'translation of light (a benefic third planet carries the matter)',
    dateNote: '17 June 1646 (Old Style), ≈7:33 a.m. (Lilly’s header prints “16 June”)',
    place: 'London',
    completeness: 'full-figure',
    querentHouse: 1,
    quesitedHouse: 7,
    judgeSense: 'affirms',
    figure: {
      asc: '17 Leo 11', mc: '1 Taurus 0',
      planets: [
        { name: 'Sun',     sign: 'Cancer',      degree: 5,  minute: 31, retrograde: false, house: 11 },
        { name: 'Moon',    sign: 'Sagittarius', degree: 28, minute: 9,  retrograde: false, house: 5 },
        { name: 'Mercury', sign: 'Gemini',      degree: 16, minute: 23, retrograde: false, house: 11 },
        { name: 'Venus',   sign: 'Taurus',      degree: 20, minute: 21, retrograde: false, house: 10 },
        { name: 'Mars',    sign: 'Taurus',      degree: 17, minute: 43, retrograde: false, house: 10 },
        { name: 'Jupiter', sign: 'Cancer',      degree: 14, minute: 40, retrograde: false, house: 11 },
        { name: 'Saturn',  sign: 'Taurus',      degree: 14, minute: 53, retrograde: false, house: 10 },
      ],
    },
    question: 'A lady who had earlier refused a long-time suitor now passionately wished the match back on, and asked whether it could be effected.',
    significators: 'Leo ascending (17°11′): the lady is the Sun (lord of the 1st) with the Moon as co-significatrix; the gentleman is Saturn (lord of the 7th, Aquarius), standing in the 10th conjunct Mars. The key third party is Jupiter, in his exaltation in Cancer in the 11th.',
    reasoning: 'The Sun (the lady) applied to a sextile of Saturn (the man), showing her renewed desire — but without reception, so “that application gave little hope” of itself; and the Moon, void of course, applied by opposition to the Sun with reception, “a small argument” that the man had little inclination of his own accord. The main testimony was the translation: Jupiter, exalted and fortunate, applying by a dexter sextile to Saturn (lord of the 7th) and then perfecting his conjunction with the Sun (lord of the 1st) on 29 June with “no prohibition, abscission or frustration,” carries the light of the man to the lady — a person of quality who would broker the match.',
    verdict: 'The match would be brought to pass, chiefly through the Jupiter-figure (a person of quality intimately acquainted with the gentleman). Lilly advised the lady to address her suit through that person and to make haste before the Saturn–Sun sextile perfected, naming 19 June for the gentleman to re-open the matter; and he reassured her the man would not instead marry the rival (Venus), since Mars stood between Venus and Saturn.',
    outcome: 'The match was effected — “by the gentleman’s means the business was revived, the match effected, and all within twenty days following.” A textbook success by translation of light.',
    sources: 'Lilly, Christian Astrology (1647), Book II, ch. LIX, “A Lady, if marry the Gentleman desired?”, pp. 385–388, via Deborah Houlding’s annotated retype (skyscript.co.uk/CA/CA_DH.pdf) and Anthony Louis (tonylouis.wordpress.com); positions cross-checked with the project’s astronomy-engine for 17 Jun 1646 O.S.',
    caveats: 'Old Style: 17 Jun 1646 O.S. ≈ 27 Jun N.S.; Lilly’s printed header reads “16 June”, one day off the figure he actually cast. Printed positions Saturn 14°53′ Taurus and Jupiter 14°40′ Cancer are confirmed; the Moon/Venus/Mars/Mercury minutes are less crisply legible and fall back to the cross-checked computed value. The wheel is drawn with equal houses from the printed Ascendant.',
  },

  {
    key: 'dog',
    title: 'A dog missing — “where is he, and shall I recover him?”',
    tag: '6th house · lost beast · direction & timing',
    technique: 'locating by the significator’s sign & quarter; timing by an applying aspect',
    dateNote: '29 August 1646 (Old Style), 4:05 p.m.',
    place: 'Temple Bar, London',
    completeness: 'full-figure',
    querentHouse: 1,
    quesitedHouse: 6,
    judgeSense: 'affirms',
    figure: {
      asc: '16 Capricorn 16', mc: '21 Virgo 27',
      planets: [
        { name: 'Sun',     sign: 'Virgo',  degree: 15, minute: 57, retrograde: false, house: 10 },
        { name: 'Moon',    sign: 'Virgo',  degree: 5,  minute: 43, retrograde: false, house: 9 },
        { name: 'Mercury', sign: 'Libra',  degree: 12, minute: 3,  retrograde: false, house: 9 },
        { name: 'Venus',   sign: 'Leo',    degree: 8,  minute: 17, retrograde: false, house: 8 },
        { name: 'Mars',    sign: 'Cancer', degree: 6,  minute: 12, retrograde: false, house: 7 },
        { name: 'Jupiter', sign: 'Leo',    degree: 0,  minute: 24, retrograde: false, house: 8 },
        { name: 'Saturn',  sign: 'Taurus', degree: 17, minute: 55, retrograde: true,  house: 4 },
      ],
    },
    question: 'A querent living at Temple Bar had lost a dog, and asked in what part of the City to search for him, and whether he would ever be recovered.',
    significators: 'Capricorn ascending (16°16′): the querent is Saturn (lord of the 1st). The lost dog — a small beast of the 6th house — is signified by Mercury, lord of the 6th, in Libra (an airy, western sign), with the Moon as co-significatrix of the fugitive. (It is Mercury, not Venus, that signifies the dog; Venus here is at 8° Leo and plays no part.)',
    reasoning: 'Mercury (the dog) in Libra is a western sign tending to the south-west, and the Moon in Virgo is a south-west sign verging on the western angle — “the plurality signify the West,” so the dog lay westward of Temple Bar, about Long Acre or the upper part of Drury Lane. Mercury in airy Libra put the dog “in some chamber or upper room, kept privately,” reinforced by the Moon under the Sun’s beams. For timing, the Sun applied by a dexter trine to Saturn (lord of the Ascendant) on the Monday following, and the Moon applied to Mars (exalted in Capricorn, the very ascending sign) — so recovery, or news, would come on that Monday.',
    verdict: 'The dog was westward — about Long Acre or upper Drury Lane — alive and kept privately in an upper room within the city; and the querent would recover him, or hear of him, on the Monday following.',
    outcome: 'True on every point: that Monday a gentleman of the querent’s acquaintance, by accident visiting a friend in Long Acre, found the dog chained under a table, knew it for the querent’s, and sent it home about ten in the morning — “to my very great credit.”',
    sources: 'Lilly, Christian Astrology (1647), Book II, ch. LXII, “A Dog missing, where?”, pp. 393–394, via Deborah Houlding’s annotated retype (skyscript.co.uk/CA/CA_DH.pdf); every planet confirmed to the arc-minute by an independent astronomy-engine recompute for 29 Aug 1646 O.S.',
    caveats: 'Old Style: 29 Aug 1646 O.S. ≈ 8 Sep N.S. The common retelling that “Venus in Libra signifies the dog” is a misattribution — the dog’s significator is Mercury, lord of the 6th, in Libra. The wheel is drawn with equal houses from the printed Ascendant; the lost-beast question is a recovery question, so the engine reads it in the ordinary (affirmative) sense, not the inverted sickness sense of the 6th.',
  },
];
