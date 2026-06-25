// ============================================================================
//  planet-images.js — the talismanic IMAGE per planet (HISTORICAL STUDY).
//  DESCRIBED, NOT PRESCRIBED (see data/planetary-magic.js framing). Materials are
//  HISTORICAL-ONLY where flagged. Planet keys match planetary-magic.js.
//
//  CITATION NOTE: Agrippa's planetary FIGURES are in II.38–44 (one chapter per
//  planet) — NOT II.22 (the numerical tables / kameas / seals chapter, no
//  figures). Picatrix parallels: Book II.10 (planetary rings/images) & III.3–9.
//  Agrippa gives several images per planet "according to divers authors"; the
//  first/best-attested is given, with key alternates noted.
//  SOURCES: Agrippa, Three Books II.38–44; Picatrix II.10 & III, Greer–Warnock.
// ============================================================================

export const PLANET_IMAGES = {
  Saturn: {
    image: "A man with a hart's (stag's) head and camel's feet, seated on a chair or a dragon, a sickle in his right hand and a dart in his left (alt.: an old man on a high chair, hands raised, a sickle in hand, a black cloth on his head).",
    purpose: 'Prolongation of life and increase of power; (alt.) against the stone and diseases of the kidneys.',
    material: 'Engraved on a loadstone (magnet) or a sapphire; Saturn’s metal is lead.',
    citation: 'Agrippa II.44; Picatrix II.10 & III.3',
  },
  Jupiter: {
    image: 'A crowned man in saffron garments riding an eagle or a dragon, a dart in his right hand (alt.: a naked crowned man, hands joined in prayer, in a four-footed chair borne by four winged boys).',
    purpose: 'Increases felicity, riches and honour; confers benevolence and prosperity, and frees from enemies.',
    material: 'A clear white stone, especially crystal; Jupiter’s metal is tin.',
    citation: 'Agrippa II.41; Picatrix II.10 & III.4',
  },
  Mars: {
    image: 'An armed man riding a lion, a naked drawn sword erect in his right hand and the head of a man in his left (alt.: an armed, crowned soldier girt with a sword, a long lance in his right hand).',
    purpose: 'Renders a man powerful, feared by all; boldness, courage and good fortune in wars and contentions.',
    material: 'A martial stone, especially diamond; Mars’s metal is iron.',
    citation: 'Agrippa II.42; Picatrix II.10 & III.5',
  },
  Sun: {
    image: 'A crowned king seated on a chair, a raven in his bosom and a globe under his feet, in saffron garments (alt.: a crowned woman dancing in a four-horse chariot, a mirror in her right hand, a staff in her left, a flame on her head).',
    purpose: 'Renders men invincible and honourable; drives away vain dreams; prevalent against fevers and plague.',
    material: 'On a balanite stone or a ruby; the Sun’s metal is gold.',
    citation: 'Agrippa II.41; Picatrix II.10 & III.7',
  },
  Venus: {
    image: 'A woman with the head of a bird and the feet of an eagle, holding a dart (alt.: a naked maid with flowing hair, a mirror in her hand and a chain about her neck, beside a young man and a little winged boy).',
    purpose: 'Favour and benevolence; to gain the love of women; makes men pleasant, cheerful and gives beauty.',
    material: 'On lapis lazuli (the love image); Venus’s metal is copper.',
    citation: 'Agrippa II.43; Picatrix II.10 & III.6',
  },
  Mercury: {
    image: 'A handsome bearded young man with winged feet, a caduceus (a rod with a serpent twined about it) in his left hand and a dart in his right (alt.: a man riding a peacock, with eagle’s feet and a crest on his head).',
    purpose: 'Confers knowledge, eloquence and gain in trade; begets peace and concord; cures fevers.',
    material: 'Mercury’s metal is quicksilver / “fixed mercury” (HISTORICAL-ONLY, toxic).',
    citation: 'Agrippa II.39; Picatrix II.10 & III.8',
  },
  Moon: {
    image: 'A horned woman riding a bull (or a seven-headed dragon, or a crab), a dart in her right hand and a mirror in her left, clothed in white or green, two horned serpents on her head (alt.: a man leaning on a staff, a bird on his head, a flourishing tree before him).',
    purpose: 'Increase of the fruits of the earth; against poisons and infirmities of children; (alt.) for travellers, against weariness.',
    material: 'The Moon’s metal is silver.',
    citation: 'Agrippa II.38; Picatrix II.10 & III.9',
  },
};
export const PLANET_IMAGES_SOURCE = 'Agrippa, Three Books of Occult Philosophy II.38–44 (the images of the planets) + Picatrix II.10 & III, Greer–Warnock. Several images per planet exist "according to divers authors"; the best-attested is given. Historical text for study, described — never prescribed.';

// The talismanic image for a planet, or null.
export function planetImage(planet) { return PLANET_IMAGES[planet] || null; }
