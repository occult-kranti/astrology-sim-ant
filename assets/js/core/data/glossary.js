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

  // — Points & special —
  { term: 'Part of Fortune (⊕)', cat: 'Points', def: 'A computed point, Ascendant + Moon − Sun, marking material well-being. Lilly uses the same formula by day and night.', see: 'pages/book2/horary.html' },
  { term: 'Dragon’s Head (☊, North Node)', cat: 'Points', def: 'The Moon’s ascending node; benefic, increasing. Lilly found it equivalent to a fortune.' },
  { term: 'Dragon’s Tail (☋, South Node)', cat: 'Points', def: 'The Moon’s descending node; malefic, diminishing.' },
  { term: 'Antiscion', cat: 'Points', def: 'A point’s "shadow" reflected across the 0° Cancer–0° Capricorn (solstitial) axis; a hidden connection acting like a soft aspect.', see: 'pages/book1/master.html' },
  { term: 'Hyleg (Apheta)', cat: 'Nativities', def: 'The "giver of life" or prorogator in a nativity — the Sun by day or Moon by night in a hylegiacal place, else the Ascendant.', see: 'pages/book3/index.html' },
  { term: 'Alcocoden', cat: 'Nativities', def: 'The "giver of years" — the planet ruling the hyleg’s place, indicating possible length of life by its planetary years.', see: 'pages/book3/index.html' },
  { term: 'Lord of the Geniture', cat: 'Nativities', def: 'The planet with the most essential and accidental dignity in a nativity — the most powerful and predominant influence.', see: 'pages/book3/nativity.html' },
  { term: 'Temperament', cat: 'Nativities', def: 'The humoral balance (choleric, melancholic, sanguine, phlegmatic) of a nativity, judged from the Ascendant, the lights and the season.', see: 'pages/book3/nativity.html' },

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
  { term: 'Yantra', cat: 'Vedic (Jyotiṣa)', def: 'A geometric diagram — for the grahas, a planetary magic square (the Sun’s is the 3×3 summing to 15; each graha’s constant steps by 3). Recorded as cultural practice, not prescribed.', see: 'pages/vedic/index.html' }
];

export const GLOSSARY_CATEGORIES = [...new Set(GLOSSARY.map(g => g.cat))].sort();
