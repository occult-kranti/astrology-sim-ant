// ============================================================================
//  glossary.js — a dictionary of the terms of art in Lilly's Christian
//  Astrology. Each entry: { term, cat (category), def, see (optional link) }.
//  `see` is a path relative to the site root used to deep-link the concept.
// ============================================================================
export const GLOSSARY = [
  // — Foundations —
  { term: 'Ascendant', cat: 'Angles', def: 'The degree of the ecliptic rising on the eastern horizon; the cusp of the 1st house. Signifies the querent or native — body, life and self.', see: 'pages/book1/reference.html#houses' },
  { term: 'Midheaven (Medium Coeli, MC)', cat: 'Angles', def: 'The degree culminating on the meridian; the cusp of the 10th house. Signifies honour, career, the mother and authority.', see: 'pages/book1/reference.html#houses' },
  { term: 'Descendant', cat: 'Angles', def: 'The western point opposite the Ascendant; cusp of the 7th house — the other party, the spouse, the open enemy.' },
  { term: 'Imum Coeli (IC)', cat: 'Angles', def: 'The lowest point opposite the MC; cusp of the 4th — the father, land, home and the end of the matter.' },
  { term: 'Cusp', cat: 'Foundations', def: 'The beginning (boundary) of a house. A planet near a cusp partakes of that house.' },
  { term: 'Angular / Succedent / Cadent', cat: 'Houses', def: 'The three house strengths. Angular (1,4,7,10) = strongest, acting swiftly; succedent (2,5,8,11) = moderate; cadent (3,6,9,12) = weakest, delaying.' },

  // — The lights, sect —
  { term: 'Luminaries', cat: 'Planets', def: 'The Sun and Moon, the two "lights." The Sun rules the day, the Moon the night.', see: 'pages/book1/reference.html#planets' },
  { term: 'Sect (Diurnal / Nocturnal)', cat: 'Dignity', def: 'Whether a chart is of the day (Sun above the horizon) or night. Sect determines which triplicity ruler applies and suits diurnal planets (Saturn, Jupiter, Sun) by day, nocturnal (Mars, Venus, Moon) by night.' },
  { term: 'Fortunes & Infortunes', cat: 'Planets', def: 'Jupiter is the Greater Fortune, Venus the Lesser; Saturn the Greater Infortune, Mars the Lesser. The Sun, Moon and Mercury are neutral; Mercury is "convertible."' },

  // — Essential dignity —
  { term: 'Essential Dignity', cat: 'Dignity', def: "A planet's strength by virtue of the sign and degree it occupies: domicile (+5), exaltation (+4), triplicity (+3), term (+2), face (+1).", see: 'pages/book1/dignities.html' },
  { term: 'Domicile (House)', cat: 'Dignity', def: 'The sign(s) a planet rules and is most at home in (e.g. Mars rules Aries and Scorpio). The strongest essential dignity, +5.', see: 'pages/book1/dignities.html' },
  { term: 'Exaltation', cat: 'Dignity', def: 'A sign (and exact degree) where a planet is honoured as an exalted guest (e.g. the Sun at 19° Aries). +4.', see: 'pages/book1/dignities.html' },
  { term: 'Triplicity', cat: 'Dignity', def: 'Rulership of one of the four elements. Lilly uses two rulers — one for day, one for night — with Mars ruling Water both day and night. +3.', see: 'pages/book1/dignities.html' },
  { term: 'Term (Bound)', cat: 'Dignity', def: 'Unequal subdivisions of a sign ruled by the five non-luminary planets. Lilly uses the Ptolemaic terms. +2.', see: 'pages/book1/dignities.html' },
  { term: 'Face (Decan)', cat: 'Dignity', def: 'A 10° third of a sign, ruled in the Chaldean order beginning with Mars at 0° Aries. The weakest dignity, +1 — its chief use is to keep a planet from being wholly peregrine.', see: 'pages/book1/dignities.html' },
  { term: 'Detriment', cat: 'Dignity', def: 'The sign opposite a planet’s domicile, where it is ill at ease. −5.', see: 'pages/book1/dignities.html' },
  { term: 'Fall', cat: 'Dignity', def: 'The sign opposite a planet’s exaltation, where it is dejected. −4.', see: 'pages/book1/dignities.html' },
  { term: 'Peregrine', cat: 'Dignity', def: '"Wandering" — a planet with no essential dignity of its own anywhere in its place, like a stranger with no standing. −5.', see: 'pages/book1/dignities.html' },
  { term: 'Almuten', cat: 'Dignity', def: 'The planet with the most essential dignity at a given degree — the "victor" or lord of that degree.', see: 'pages/book1/dignities.html' },
  { term: 'Verdict (green / amber / red)', cat: 'This site', def: "The site's chart-health and election badge: a traffic-light scale for the GRAVITY of the judgement. Green = few impediments / favourable; amber = mixed, weigh the cautions; red = strongly impeded / unfavourable. Red marks SEVERITY only — it is NOT the planetary or talisman colour red (e.g. Mars's red garment), which is a separate ritual correspondence.", see: 'pages/now.html' },
  { term: 'Dispositor', cat: 'Dignity', def: 'The planet that rules (by domicile) the sign another planet occupies; it "disposes of" the guest.' },

  // — Accidental dignity —
  { term: 'Accidental Dignity', cat: 'Dignity', def: "A planet's strength of situation: its house, motion (direct/swift), freedom from the Sun, and contacts with benefics, malefics and fixed stars.", see: 'pages/book1/dignities.html' },
  { term: 'Oriental / Occidental', cat: 'Motion', def: 'Oriental = rising before the Sun (eastern); occidental = setting after it (western). Saturn, Jupiter, Mars are fortified oriental; Mercury and Venus occidental.' },
  { term: 'Retrograde', cat: 'Motion', def: 'Apparent backward motion through the zodiac — a strong debility (−5); the planet is hesitant, undoing, contrary.' },
  { term: 'Combust', cat: 'Sun', def: 'Within 8°30′ of the Sun (same sign) — gravely weakened, "burnt up." −5.' },
  { term: 'Cazimi', cat: 'Sun', def: 'Within 17′ of the Sun’s exact body — "in the heart of the Sun," a great fortitude. +5.' },
  { term: 'Under the Sunbeams', cat: 'Sun', def: 'Within 17° of the Sun but beyond combustion — obscured and weakened. −4.' },
  { term: 'Besieged', cat: 'Motion', def: 'A planet hemmed between the bodies of Saturn and Mars (or, favourably, between Jupiter and Venus).' },

  // — Aspects —
  { term: 'Aspect', cat: 'Aspects', def: 'A significant angular relationship between two planets. Lilly uses the five Ptolemaic aspects.', see: 'pages/book1/index.html#aspects' },
  { term: 'Conjunction (☌)', cat: 'Aspects', def: '0° apart — union; good or ill according to the planets joined.' },
  { term: 'Sextile (⚹)', cat: 'Aspects', def: '60° apart — an aspect of friendship and ease.' },
  { term: 'Square (□)', cat: 'Aspects', def: '90° apart — an aspect of imperfect enmity, obstruction, effort.' },
  { term: 'Trine (△)', cat: 'Aspects', def: '120° apart — the strongest aspect of love and ease.' },
  { term: 'Opposition (☍)', cat: 'Aspects', def: '180° apart — an aspect of perfect hatred, separation, open conflict.' },
  { term: 'Orb', cat: 'Aspects', def: 'The "body of light" around a planet within which an aspect operates. Lilly assigns orbs to PLANETS, not to aspects.', see: 'pages/book1/index.html#aspects' },
  { term: 'Moiety', cat: 'Aspects', def: 'Half of a planet’s orb. Two planets are within a platic aspect when their distance from exactitude is less than the sum of their two moieties.', see: 'pages/book1/index.html#aspects' },
  { term: 'Partile / Platic', cat: 'Aspects', def: 'Partile = an aspect exact to the degree (very strong); platic = within orb but not exact.' },
  { term: 'Dexter / Sinister', cat: 'Aspects', def: 'Dexter ("right") aspects are cast against the order of the signs and are more forcible; sinister ("left") with the order.' },
  { term: 'Applying / Separating', cat: 'Horary', def: 'An aspect is applying when the faster planet moves toward exactitude (the matter is coming about) and separating when moving away (past, or denied).', see: 'pages/book2/horary.html' },

  // — Horary technique —
  { term: 'Horary Astrology', cat: 'Horary', def: 'Answering a specific question from a chart cast for the moment it is understood — the subject of Lilly’s Book II.', see: 'pages/book2/index.html' },
  { term: 'Querent', cat: 'Horary', def: 'The person who asks the question — signified by the 1st house, its ruler, and the Moon.', see: 'pages/book2/index.html' },
  { term: 'Quesited', cat: 'Horary', def: 'The person or matter asked about — signified by the relevant house and its ruler.', see: 'pages/book2/houses.html' },
  { term: 'Significator', cat: 'Horary', def: 'A planet that stands for a person or matter in the question (e.g. the lord of the 1st for the querent).', see: 'pages/book2/index.html' },
  { term: 'Radical / Radicality', cat: 'Horary', def: 'Whether a figure is "fit to be judged." Tested by the considerations before judgement.', see: 'pages/book2/considerations.html' },
  { term: 'Considerations before Judgement', cat: 'Horary', def: 'Lilly’s cautions for deciding whether a chart is radical — early/late Ascendant, void Moon, Via Combusta, Saturn in the 1st/7th, etc.', see: 'pages/book2/considerations.html' },
  { term: 'Void of Course', cat: 'Horary', def: 'When the Moon makes no further aspect before leaving her sign — "nothing will come of the matter," though she "performs somewhat" in Taurus, Cancer, Sagittarius, Pisces.', see: 'pages/book2/considerations.html' },
  { term: 'Via Combusta', cat: 'Horary', def: 'The "combust way," 15° Libra to 15° Scorpio; Lilly counsels care when the Moon is here.', see: 'pages/book2/considerations.html' },
  { term: 'Perfection', cat: 'Horary', def: 'The completing of a matter — by conjunction or aspect of the significators, or by translation, collection, or reception of light.', see: 'pages/book2/index.html' },
  { term: 'Translation of Light', cat: 'Horary', def: 'A swift planet separates from one significator and applies to the other, carrying virtue between them — often a go-between who brings the matter about.', see: 'pages/book2/index.html' },
  { term: 'Collection of Light', cat: 'Horary', def: 'Two significators that do not aspect each other both apply to a heavier planet which receives them, "collecting" the matter to perfection.', see: 'pages/book2/index.html' },
  { term: 'Reception', cat: 'Horary', def: 'When a planet sits in another’s dignity, it is "received." Mutual reception (each in the other’s dignity) is the strongest help and can perfect a matter through a hard aspect.', see: 'pages/book2/index.html' },
  { term: 'Prohibition', cat: 'Horary', def: 'A third planet perfects an aspect with a significator before the two significators can join, blocking the matter.', see: 'pages/book2/index.html' },
  { term: 'Refranation', cat: 'Horary', def: 'A significator turns retrograde before the awaited aspect completes — the matter "will never be effected."', see: 'pages/book2/index.html' },
  { term: 'Frustration', cat: 'Horary', def: 'A swift planet hastening to a significator is forestalled because that significator joins another planet first.', see: 'pages/book2/index.html' },
  { term: 'Turning the Chart', cat: 'Horary', def: 'Reading a third party’s affairs by treating their house as a new Ascendant (e.g. the 2nd from the 7th = the spouse’s money).', see: 'pages/book2/houses.html' },
  { term: 'Significator', cat: 'Horary', def: 'The planet that stands for a person or matter in a question — the lord of the 1st (and the Moon) for the querent, the lord of the house of the matter for the quesited. The judgement turns on the significators’ condition and how they perfect.', see: 'pages/book2/houses.html' },

  // — Points & special —
  { term: 'Part of Fortune (⊕)', cat: 'Points', def: 'A computed point, Ascendant + Moon − Sun, marking material well-being. Lilly uses the same formula by day and night.', see: 'pages/book2/horary.html' },
  { term: 'Dragon’s Head (☊, North Node)', cat: 'Points', def: 'The Moon’s ascending node; benefic, increasing. Lilly found it equivalent to a fortune.' },
  { term: 'Dragon’s Tail (☋, South Node)', cat: 'Points', def: 'The Moon’s descending node; malefic, diminishing.' },
  { term: 'Antiscion', cat: 'Points', def: 'A point’s "shadow" reflected across the 0° Cancer–0° Capricorn (solstitial) axis; a hidden connection acting like a soft aspect.', see: 'pages/book1/master.html' },
  { term: 'Hyleg (Apheta)', cat: 'Nativities', def: 'The "giver of life" or prorogator in a nativity — the Sun by day or Moon by night in a hylegiacal place, else the Ascendant.', see: 'pages/book3/index.html' },
  { term: 'Alcocoden', cat: 'Nativities', def: 'The "giver of years" — the planet ruling the hyleg’s place, indicating possible length of life by its planetary years.', see: 'pages/book3/index.html' },
  { term: 'Lord of the Geniture', cat: 'Nativities', def: 'The planet with the most essential and accidental dignity in a nativity — the most powerful and predominant influence.', see: 'pages/book3/nativity.html' },
  { term: 'Temperament', cat: 'Nativities', def: 'The humoral balance (choleric, melancholic, sanguine, phlegmatic) of a nativity, judged from the Ascendant, the lights and the season.', see: 'pages/book3/nativity.html' },
  { term: 'Rectification', cat: 'Nativities', def: 'Correcting an uncertain birth time so the chart agrees with known events or rules. Contested; the Workbench offers the Animodar and the Trutine of Hermes, shown only with their assumptions — never as a measurement.', see: 'pages/book3/master.html' },
  { term: 'Animodar', cat: 'Nativities', def: 'Ptolemy’s rectification (Tetrabiblos III.2): take the almuten of the pre-natal New or Full Moon; the degree it holds within its sign should be the degree of the nearest angle (Ascendant or Midheaven). Contested.', see: 'pages/book3/master.html' },
  { term: 'Trutine of Hermes', cat: 'Nativities', def: 'The Trutina Hermetis: the Moon’s degree at conception equals the Ascendant at birth, and the Ascendant at conception equals the birth Moon (or its opposite), over a ~273-day gestation. Used as a check on the birth time; contested.', see: 'pages/book3/master.html' },
  { term: 'Profection', cat: 'Nativities', def: 'An annual time-lord technique that advances the chart one whole sign for each completed year of life; the ruler of the arrived-at sign becomes the Lord of the Year.', see: 'pages/book3/master.html' },
  { term: 'Profected Sign', cat: 'Nativities', def: 'The whole sign a profection reaches for a given age — the natal Ascendant sign counted forward one sign per completed year.', see: 'pages/book3/master.html' },
  { term: 'Lord of the Year', cat: 'Nativities', def: 'The annual time-lord: the domicile ruler of the profected sign. Its natal condition (dignity, house, aspects) colours the affairs of the year.', see: 'pages/book3/master.html' },
  { term: 'Solar Return (Revolution)', cat: 'Nativities', def: 'The chart for the instant the Sun returns to its exact natal longitude each year — Lilly’s “Revolution”, read as the keynote of the year against the radix.', see: 'pages/book3/master.html' },
  { term: 'Sect Light', cat: 'Nativities', def: 'The luminary that governs a chart by sect — the Sun in a day chart (Sun above the horizon), the Moon in a night chart. It is a primary significator of the native.', see: 'pages/book3/master.html' },
  { term: 'Almuten Figuris', cat: 'Nativities', def: 'The almuten of the WHOLE chart — the planet with the greatest summed essential dignity over the hylegiacal places (Ascendant, Sun, Moon, Part of Fortune, pre-natal syzygy). Identified with the planet of the Perfect Nature; the talisman planet Picatrix III.5 wants matched to the native.', see: 'pages/workbench.html' },
  { term: 'Naibod Key', cat: 'Time', def: 'The rate Valentine Naibod used to turn directional arc into time — the Sun’s mean daily motion, ≈0.9856° of arc per year of life.', see: 'pages/book3/master.html' },
  { term: 'Election (Electional Astrology)', cat: 'Time', def: 'Choosing an auspicious moment to begin an undertaking by casting and weighing charts in advance, so the heavens favour the start. The core method of Picatrix talismanic magic.', see: 'pages/picatrix/election.html' },
  { term: 'Lot / Arabic Part', cat: 'Points', def: 'A computed point found by projecting from the Ascendant the arc between two other points: Lot = Ascendant + (B − C). The Part of Fortune is the best known.', see: 'pages/workbench.html' },
  { term: 'Lot of Spirit', cat: 'Points', def: 'The Hermetic lot complementary to Fortune — Ascendant + Sun − Moon by day (reversed by night). Where Fortune signifies body and circumstance, Spirit signifies mind, will and action.', see: 'pages/workbench.html' },
  { term: 'Lot of Eros', cat: 'Points', def: 'One of the seven Hermetic lots, governing desire and love; built from the Lot of Spirit and Venus (Ascendant + Venus − Spirit by day).', see: 'pages/workbench.html' },
  { term: 'Decumbiture', cat: 'Horary', def: 'A medical chart cast for the moment a patient takes to their bed (or a urine sample is brought), judged for the course and crisis of an illness.', see: 'pages/book2/houses.html' },
  { term: 'Suffumigation', cat: 'Magic', def: 'The fumigation or incense burned in a Picatrix rite — a smoke of herbs, resins and substances proper to a planet (some historical recipes are toxic and recorded for study only).', see: 'pages/picatrix/talisman.html' },
  { term: 'Behenian Fixed Stars', cat: 'Magic', def: 'Fifteen fixed stars of the Hermes/Agrippa canon (Algol, Aldebaran, the Pleiades, Regulus, Spica, etc.) held to carry special virtues for talismans.', see: 'pages/picatrix/stars.html' },
  { term: 'Joys (Planetary)', cat: 'General', def: 'The houses where each planet rejoices and acts most fittingly: Mercury in the 1st, Moon the 3rd, Venus the 5th, Mars the 6th, Sun the 9th, Jupiter the 11th, Saturn the 12th.' },

  // — Time & motion —
  { term: 'Planetary Hours', cat: 'Time', def: 'The division of day and night each into twelve unequal hours, ruled by the planets in the Chaldean order, beginning at sunrise with the lord of the weekday.', see: 'pages/book1/planetary-hours.html' },
  { term: 'Chaldean Order', cat: 'Time', def: 'The planets from slowest to fastest: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon — the order of the planetary hours and the faces.' },
  { term: 'Lunar Mansions', cat: 'Magic', def: 'The 28 divisions of the Moon’s monthly path (≈12°51′ each), each with its own magical virtues — central to electional and Picatrix magic.' },
  { term: 'Planetary Prayer (Picatrix)', cat: 'Magic', def: 'The seven invocations of Picatrix III.7 — a Sabian/Harranian rite addressing each planet by its epithets and names in several tongues. Historical text recorded for study, never prescribed.', see: 'pages/picatrix/prayers.html' },
  { term: 'Planetary Spirits (Picatrix)', cat: 'Magic', def: 'The Picatrix III.9 spirit-names (from the Liber Antimaquis): a master spirit per planet plus six directional spirits and a spirit of its motion. Kept distinct from the III.7 prayer-angels and the Agrippa Angel/Intelligence/Spirit triad. Historical doctrine only.', see: 'pages/picatrix/prayers.html' },
  { term: 'Perfect Nature', cat: 'Magic', def: 'Al-Ṭibāʿ al-Tāmm (Picatrix III.6) — the practitioner’s personal celestial guardian or genius, linked to the planet ruling his nativity; invoked by four names (Meegius, Betzahuech, Vacdez, Nufeneguediz). The closest medieval analogue to the later "Holy Guardian Angel." Historical doctrine only.', see: 'pages/picatrix/prayers.html' },

  // — Houses systems —
  { term: 'Regiomontanus', cat: 'Houses', def: "The quadrant house system Lilly used, dividing the celestial equator into equal arcs. This site's default.", see: 'pages/about/index.html#debates' },
  { term: 'Triplicity / Quadruplicity', cat: 'Signs', def: 'Triplicity = the four elemental groups of three signs; quadruplicity = the three modal groups of four (movable, fixed, common).', see: 'pages/book1/reference.html#signs' },

  // — Vedic (Jyotiṣa) — a SEPARATE, sidereal system (Jagannath Hora) —
  { term: 'Sidereal Zodiac', cat: 'Vedic (Jyotiṣa)', def: 'The zodiac measured against the fixed stars rather than the equinox. Vedic astrology is sidereal: a planet’s sidereal longitude = its tropical longitude − the ayanāṁśa. This is the chief computational difference from Lilly’s tropical system.', see: 'pages/vedic/index.html' },
  { term: 'Ayanāṁśa', cat: 'Vedic (Jyotiṣa)', def: 'The accumulated offset between the tropical and sidereal zodiacs from precession (≈24.2° today). This site uses the Lahiri (Citrāpakṣa) ayanāṁśa, the Indian government standard and historic Jagannath Hora default.', see: 'pages/vedic/index.html' },
  { term: 'Rāśi', cat: 'Vedic (Jyotiṣa)', def: 'A sign of the sidereal zodiac (Meṣa/Aries … Mīna/Pisces); also the D1 divisional chart (the rāśi chart). Each rāśi has a planetary lord, as in the Western scheme.', see: 'pages/vedic/index.html' },
  { term: 'Lagna', cat: 'Vedic (Jyotiṣa)', def: 'The Vedic Ascendant — the sidereal degree rising in the east. The 1st bhāva and the foundation of the whole-sign house scheme.', see: 'pages/vedic/index.html' },
  { term: 'Graha', cat: 'Vedic (Jyotiṣa)', def: 'A "seizer" / planet of Jyotiṣa — the seven of Lilly plus the two lunar nodes Rāhu and Ketu (the navagraha, nine grahas).', see: 'pages/vedic/index.html' },
  { term: 'Nakṣatra', cat: 'Vedic (Jyotiṣa)', def: 'One of the 27 lunar mansions (13°20′ each) of the sidereal zodiac, each ruled by a graha and a deity. The Moon’s nakṣatra seeds the Vimśottarī daśā. (Distinct from the Picatrix’s 28 lunar mansions.)', see: 'pages/vedic/index.html' },
  { term: 'Pada', cat: 'Vedic (Jyotiṣa)', def: 'A "quarter" — one of the four 3°20′ sub-divisions of a nakṣatra, mapping to a navāṁśa sign.', see: 'pages/vedic/index.html' },
  { term: 'Vimśottarī Daśā', cat: 'Vedic (Jyotiṣa)', def: 'The principal Vedic timing system: a 120-year cycle of planetary periods (mahādaśā) and sub-periods (antardaśā), apportioned from the Moon’s birth nakṣatra. The running daśā lord colours the period.', see: 'pages/vedic/index.html' },
  { term: 'Pañcāṅga', cat: 'Vedic (Jyotiṣa)', def: 'The "five limbs" of the Vedic almanac for a moment: tithi (lunar day), vāra (weekday), nakṣatra, yoga and karaṇa — the basis of muhūrta (Vedic election).', see: 'pages/vedic/index.html' },
  { term: 'Tithi', cat: 'Vedic (Jyotiṣa)', def: 'A lunar day — one of 30 in a synodic month, each 12° of Moon-minus-Sun elongation; waxing (śukla) or waning (kṛṣṇa).', see: 'pages/vedic/index.html' },
  { term: 'Vāra', cat: 'Vedic (Jyotiṣa)', def: 'The weekday and its ruling graha — the same Chaldean weekday-lord scheme as Lilly’s planetary days, and the anchor of the day’s traditional observance (vrata) and mantra.', see: 'pages/vedic/index.html' },
  { term: 'Varga', cat: 'Vedic (Jyotiṣa)', def: 'A divisional (harmonic) chart, Dn, that re-maps each sign into n parts to examine a life area — D9 navāṁśa (marriage/dharma), D10 daśāṁśa (career), etc. This site computes D1–D60.', see: 'pages/vedic/index.html' },
  { term: 'Navāṁśa', cat: 'Vedic (Jyotiṣa)', def: 'The D9 varga (ninth-divisions): the most-used divisional chart, read for marriage, dharma and the inner strength of each graha.', see: 'pages/vedic/index.html' },
  { term: 'Aṣṭakavarga', cat: 'Vedic (Jyotiṣa)', def: 'A bindu (point) scoring system: each graha contributes benefic points to the signs, giving its Bhinnāṣṭakavarga; summed across grahas it gives the Sarvāṣṭakavarga (SAV), whose grand total is always 337.', see: 'pages/vedic/index.html' },
  { term: 'Ṣaḍbala', cat: 'Vedic (Jyotiṣa)', def: 'The "six-fold strength" of a graha — Sthāna (positional), Dig (directional), Kāla (temporal), Ceṣṭā (motional), Naisargika (natural) and Dṛk (aspectual) bala, summed in rūpas and weighed against a required minimum. (BPHS Ch. 27.)', see: 'pages/vedic/index.html' },
  { term: 'Bhāva', cat: 'Vedic (Jyotiṣa)', def: 'A Vedic house. This site uses whole-sign bhāvas: the Lagna’s whole sign is the 1st, the next sign the 2nd, and so on.', see: 'pages/vedic/index.html' },
  { term: 'Kāraka', cat: 'Vedic (Jyotiṣa)', def: 'A natural significator — each graha "shows" certain matters (the Sun the soul and father, Jupiter wisdom and children, Venus love and art, etc.).', see: 'pages/vedic/index.html' },
  { term: 'Bīja Mantra', cat: 'Vedic (Jyotiṣa)', def: 'A "seed" mantra — a tāntric syllable-formula addressed to a graha (e.g. Oṁ Hrāṁ Hrīṁ Hrauṁ Saḥ Sūryāya Namaḥ for the Sun). Recorded here as historical/cultural practice, never prescribed.', see: 'pages/vedic/index.html' },
  { term: 'Yantra', cat: 'Vedic (Jyotiṣa)', def: 'A geometric diagram — for the grahas, a planetary magic square (the Sun’s is the 3×3 summing to 15; each graha’s constant steps by 3). Recorded as cultural practice, not prescribed.', see: 'pages/vedic/index.html' },

  // — Geomancy (ʿilm al-raml) —
  { term: 'Geomancy', cat: 'Geomancy', def: 'ʿilm al-raml, "the science of the sand" — a divinatory art (Agrippa called it the "daughter of astrology") in which four randomly-cast figures generate, by pure algebra, a whole Shield Chart that is then judged. A historical art of no demonstrated validity.', see: 'pages/geomancy.html' },
  { term: 'Geomantic Figure', cat: 'Geomancy', def: 'One of sixteen tetragrams — four lines, each a single (·) or double (:) point (head/neck/body/feet = fire/air/water/earth). The sixteen are exactly the 2⁴ patterns, each with a planet, sign, element and meaning.', see: 'pages/geomancy.html' },
  { term: 'Shield Chart', cat: 'Geomancy', def: 'The geomantic figure: four Mothers (cast at random) generate four Daughters (by transposition), four Nieces, two Witnesses, a Judge and a Reconciler — every one derived by line-by-line parity addition.', see: 'pages/geomancy.html' },
  { term: 'Mothers, Daughters & Nieces', cat: 'Geomancy', def: 'The first twelve figures of the Shield. The four Mothers are cast; the Daughters are read columnwise from the Mothers; each Niece is the parity-sum of two figures above it.', see: 'pages/geomancy.html' },
  { term: 'Witnesses & Judge', cat: 'Geomancy', def: 'The Right Witness (the querent / the past) and Left Witness (the quesited / what follows) add to the Judge, which gives the outcome. The Judge always has an even number of points — geomancy’s built-in checksum.', see: 'pages/geomancy.html' },
  { term: 'Reconciler (Geomancy)', cat: 'Geomancy', def: 'An optional clarifying figure, the parity-sum of the Judge and the first Mother, read when the Judge is doubtful.', see: 'pages/geomancy.html' },
  { term: 'Perfection (Geomancy)', cat: 'Geomancy', def: 'Whether the querent’s and quesited’s figures truly meet in the House Chart — by occupation (sharing a house), conjunction (lying adjacent), mutation, or translation (a third figure carrying between them).', see: 'pages/geomancy.html' },
  { term: 'House Chart (Geomancy)', cat: 'Geomancy', def: 'The twelve generated figures laid into the twelve astrological houses (Mothers 1–4, Daughters 5–8, Nieces 9–12) and read by the house the question falls under, exactly as in horary.', see: 'pages/geomancy.html' },

  // — Tarot —
  { term: 'Tarot', cat: 'Tarot', def: 'A 78-card deck used for cartomancy in the Rider–Waite–Smith / Golden Dawn tradition: 22 Major Arcana and 56 Minor Arcana in four suits. A historical divinatory art of no demonstrated validity; its correspondences are a late-Victorian synthesis.', see: 'pages/tarot.html' },
  { term: 'Major Arcana', cat: 'Tarot', def: 'The 22 trump cards (0 The Fool – XXI The World), each carrying a Golden Dawn Hebrew-letter and astrological attribution. A preponderance of them in a spread is read as great, fated forces at work.', see: 'pages/tarot.html' },
  { term: 'Minor Arcana', cat: 'Tarot', def: 'The 56 suit cards: Wands (Fire), Cups (Water), Swords (Air), Pentacles (Earth), each Ace–Ten plus the four Court Cards (Page, Knight, Queen, King).', see: 'pages/tarot.html' },
  { term: 'Court Cards', cat: 'Tarot', def: 'The sixteen Page, Knight, Queen and King cards — read as people, or as the elemental sub-aspect of their suit (e.g. the Queen of Cups = the watery part of Water).', see: 'pages/tarot.html' },
  { term: 'Elemental Dignities', cat: 'Tarot', def: 'The Golden Dawn rule by which adjacent cards modify one another by element: like reinforces like; Fire+Air and Water+Earth are friendly (strengthen); Fire+Water and Air+Earth are contrary (weaken).', see: 'pages/tarot.html' },
  { term: 'Reversal (Tarot)', cat: 'Tarot', def: 'A card dealt upside-down, read by many (esp. post-Golden Dawn) as a blocked, weakened, internalised or shadow form of its upright meaning — a dimmer-switch, not automatically a negation. Some traditions ignore orientation.', see: 'pages/tarot.html' },
  { term: 'Celtic Cross', cat: 'Tarot', def: 'A. E. Waite’s famous ten-card spread: a cross of six (the situation, its crossing, foundation, past, crown and near future) and a staff of four (the querent, environment, hopes & fears, and outcome).', see: 'pages/tarot.html' },
  { term: 'Significator (Tarot)', cat: 'Tarot', def: 'A card chosen to stand for the querent or the matter at the centre of a spread (in the Celtic Cross, the first card, which the crossing card covers).', see: 'pages/tarot.html' },

  // — I Ching (the Book of Changes) —
  { term: 'I Ching', cat: 'I Ching', def: 'The Yijing, the Book of Changes — a Chinese divinatory classic that answers a question with a hexagram cast at the moment of asking. A historical art of no demonstrated validity; the structure is exact mathematics, the meanings are the tradition’s.', see: 'pages/iching.html' },
  { term: 'Hexagram', cat: 'I Ching', def: 'One of the 64 figures of six lines (each yin/broken or yang/solid), read bottom to top — the lower trigram beneath the upper. The 64 are exactly the 2⁶ combinations, numbered in the King Wen sequence.', see: 'pages/iching.html' },
  { term: 'Trigram', cat: 'I Ching', def: 'One of the eight three-line figures (bagua) — Heaven, Lake, Fire, Thunder, Wind, Water, Mountain, Earth — from which the hexagrams are built (an upper over a lower trigram).', see: 'pages/iching.html' },
  { term: 'Moving (Changing) Lines', cat: 'I Ching', def: 'Lines cast as "old" (old yin 6 or old yang 9) rather than "young" (7, 8). They are the pivots of the reading, and flipping them to their opposite yields the relating hexagram.', see: 'pages/iching.html' },
  { term: 'Relating Hexagram', cat: 'I Ching', def: 'The second hexagram obtained by flipping every moving line of the primary — the direction the situation tends toward.', see: 'pages/iching.html' },
  { term: 'Nuclear Hexagram', cat: 'I Ching', def: 'The inner hexagram built from the middle lines of the primary (lines 2–4 as the lower, 3–5 as the upper) — read as the hidden core of the matter.', see: 'pages/iching.html' },
  { term: 'King Wen Sequence', cat: 'I Ching', def: 'The traditional order of the 64 hexagrams (1 The Creative, 2 The Receptive, … 64 Before Completion), attributed to King Wen of Zhou.', see: 'pages/iching.html' },

  // — Jung & astrology —
  { term: 'Synchronicity', cat: 'Jung', def: 'Jung’s "acausal connecting principle" (1952): a meaningful coincidence between an inner, psychic state and an outer event, connected by meaning rather than cause. Jung classed astrology’s apparent hits here — not as astral causation.', see: 'pages/jung/theory.html' },
  { term: 'Archetype', cat: 'Jung', def: 'In Jung’s psychology, an inherited, formal disposition of the collective unconscious that shapes images and behaviour — the planetary "gods" of astrology being, on his reading, archetypal images projected onto the sky.', see: 'pages/jung/theory.html' },
  { term: 'Collective Unconscious', cat: 'Jung', def: 'Jung’s stratum of the psyche common to humankind, the home of the archetypes; astrology, he argued, is the psychology of antiquity written into the heavens by projection.', see: 'pages/jung/theory.html' },
  { term: 'Anima / Animus', cat: 'Jung', def: 'Jung’s contra-sexual soul-images: the inner feminine of a man’s psyche (anima) and inner masculine of a woman’s (animus). Astrologically the era-bound scheme read the anima through Moon and Venus, the animus through Sun and Mars.', see: 'pages/jung/tool.html' },
  { term: 'Individuation', cat: 'Jung', def: 'Jung’s name for the life-long integration of the personality around the Self — imaged in alchemy (and in a chart-reading after him) by the Sol–Luna coniunctio, the union of conscious and unconscious.', see: 'pages/jung/theory.html' },
  { term: 'Coniunctio', cat: 'Jung', def: 'The alchemical "marriage" of Sol and Luna that Jung (Mysterium Coniunctionis) read as the great image of psychic union — the very motif his marriage experiment’s Sun–Moon aspects embody.', see: 'pages/jung/tool.html' },
  { term: 'Synastry', cat: 'Jung', def: 'Chart-comparison: the aspects computed BETWEEN two nativities. Jung’s 1952 experiment tallied fifty cross-aspects — the conjunctions and oppositions of Sun, Moon, Mars, Venus and the Ascendant–Descendant axis between spouses (the MC/IC deliberately omitted — CW 8 §878 n. 3).', see: 'pages/jung/tool.html' },
  { term: 'Platonic Month (Aeon)', cat: 'Jung', def: 'One twelfth of the ~25,800-year precessional cycle — ≈ 2,148 years, the time the vernal point takes to cross one sign. Jung’s Aion reads the Christian aeon against the vernal point’s passage through Pisces.', see: 'pages/jung/tool.html' },
  { term: 'Age of Pisces / Aquarius', cat: 'Jung', def: 'The precessional "ages". There is no fact about when one ends: Jung himself put the beginning of the next aeon "between AD 2000 and AD 2200", depending on the starting point selected (Aion, n. to §149); the equal-sign sidereal reckoning gives ≈ 2440, the IAU constellation boundary ≈ 2600. The precession is real; the boundaries are conventions.', see: 'pages/jung/tool.html' },
  { term: 'Marriage Experiment (Jung)', cat: 'Jung', def: 'Jung’s one formal statistical test of astrology (Synchronicity, CW 8): 483 married pairs, 50 cross-aspects. The classic marriage aspects topped each batch — at rates chance alone produces, as the Fierz correction showed and Jung conceded.', see: 'pages/jung/experiment.html' },

  // — Kameas & sigils —
  { term: 'Kamea (Magic Square)', cat: 'Picatrix & Magic', def: 'A planetary "table": an n×n square of the numbers 1…n² whose every row, column and diagonal sums alike (Saturn 3×3 to the Moon 9×9, Agrippa II.22). Real, checkable mathematics that the tradition read as the planets’ divine numbers and engraved as talismans.', see: 'pages/picatrix/kameas.html' },
  { term: 'Sigil', cat: 'Picatrix & Magic', def: 'A character formed by tracing a name, letter by letter, through the cells of a kamea — a circle where the line begins, a bar where it ends. The historical method worked on Hebrew names via gematria (Agrippa III.30).', see: 'pages/picatrix/kameas.html' },
  { term: 'Aiq Bekar (Nine Chambers)', cat: 'Picatrix & Magic', def: 'The kabbalistic reduction that lays the Hebrew alphabet on nine "chambers" — units 1–9, tens 10–90, hundreds 100–900 — so any letter-value collapses into the range of a square (300 → 3). The key Agrippa leaves for deriving sigils from the kameas.', see: 'pages/picatrix/kameas.html' },
  { term: 'Intelligence & Spirit (of a planet)', cat: 'Picatrix & Magic', def: 'The paired names Agrippa assigns each planet — the Intelligence its benevolent mover, the Spirit its raw daemon — with gematria values keyed to the planet’s square (e.g. the Sun: Nachiel 111, the line-sum; Sorath 666, the total).', see: 'pages/picatrix/kameas.html' }
];

export const GLOSSARY_CATEGORIES = [...new Set(GLOSSARY.map(g => g.cat))].sort();
