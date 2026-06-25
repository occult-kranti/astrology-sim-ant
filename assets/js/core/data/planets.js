// ============================================================================
//  planets.js — The seven traditional planets as Lilly describes them in
//  Christian Astrology, Book 1 (chapters VIII–XV). Significations transcribed
//  and condensed from Lilly's own text (1647).
// ============================================================================

export const PLANETS = {
  Saturn: {
    name: 'Saturn', glyph: '♄', order: 0,
    title: 'The Greater Infortune',
    nature: 'Cold and Dry, Melancholic, Earthy, Masculine, Diurnal',
    sect: 'diurnal', benefic: false,
    houses: 'Capricorn (night) & Aquarius (day)',
    exaltation: 'Libra 21°', fall: 'Aries 21°', detriment: 'Cancer & Leo', joy: '12th house',
    triplicity: 'Air by day',
    orb: 9,
    wellDignified: 'Profound in imagination, severe in act, reserved and patient in labour, sober, austere, studious, grave in disputing; a keeper of secrets.',
    illDignified: 'Envious, covetous, jealous and mistrustful, timorous, sordid, dissembling, sluggish, suspicious, stubborn, a contemner of women; a close liar, malicious, never contented.',
    corporature: 'Middle stature; pale, swarthy or muddy complexion; small black downward-looking eyes; broad forehead; black or sad hard hair; thick lips and nose; thin beard; a lumpish, unpleasant countenance; broad crooked shoulders; lank belly; lean thighs.',
    men: 'Husbandmen, day-labourers, old men, fathers, grandfathers, monks; miners, tinners, potters, plumbers, brick-makers, chimney-sweeps, sextons, scavengers, colliers, carters, gardeners, ditchers, dyers of black, herdsmen.',
    diseases: 'The spleen; melancholy and quartan agues; consumptions, black jaundice, palsies, tremblings, dropsy, gout in hands and feet, apoplexies; deafness, toothache, all cold chronic ailments.',
    associations: 'Metal: lead. Colour: black. Stone: sapphire, lapis lazuli. Day: Saturday. Angel: Cassiel. Years (greater/mean/least): 57 / 43½ / 30.',
    summary: 'Saturn signifies what is old, heavy, slow, deep, cold and constraining — time, limitation, endings, the dead, deep study, and great age.'
  },
  Jupiter: {
    name: 'Jupiter', glyph: '♃', order: 1,
    title: 'The Greater Fortune',
    nature: 'Temperately Hot and Moist, Airy, Sanguine, Masculine, Diurnal',
    sect: 'diurnal', benefic: true,
    houses: 'Sagittarius (day) & Pisces (night)',
    exaltation: 'Cancer 15°', fall: 'Capricorn 15°', detriment: 'Gemini & Virgo', joy: '11th house',
    triplicity: 'Fire by night',
    orb: 9,
    wellDignified: 'Magnanimous, faithful, modest, aspiring honourably; wise and prudent, just and charitable, liberal, religious, affable; indulgent to wife and children.',
    illDignified: 'Wastes his patrimony, easily cozened, careless, hypocritically religious, tenacious of false tenets, ignorant, gross and dull, schismatical.',
    corporature: 'Upright tall stature; brown ruddy and lovely complexion; oval full face; high forehead; large grey eyes; soft auburn-brown hair; much beard; large deep belly; strong thighs and legs.',
    men: 'Judges, senators, councillors, churchmen, bishops, priests, cardinals, chancellors; civil lawyers, scholars and students; clothiers and woollen-drapers.',
    diseases: 'The liver and the blood; pleurisies, inflammations of the lungs, apoplexies, cramps, quinsies, and all ailments of corrupt blood.',
    associations: 'Metal: tin. Colour: sea-green, blue, purple. Stone: amethyst, emerald, topaz. Day: Thursday. Angel: Zadkiel. Years: 79 / 45½ / 12.',
    summary: 'Jupiter signifies increase, abundance, law, religion, mercy, wealth, and good fortune — the great benefic.'
  },
  Mars: {
    name: 'Mars', glyph: '♂', order: 2,
    title: 'The Lesser Infortune',
    nature: 'Hot and Dry, Choleric and Fiery, Masculine, Nocturnal',
    sect: 'nocturnal', benefic: false,
    houses: 'Aries (day) & Scorpio (night)',
    exaltation: 'Capricorn 28°', fall: 'Cancer 28°', detriment: 'Libra & Taurus', joy: '6th house',
    triplicity: 'Water by day and night',
    orb: 7,
    wellDignified: 'Invincible in courage, scorning to be exceeded; bold, confident, immovable, valiant; a lover of war and hazard, prudent in his own affairs.',
    illDignified: 'A prattler without modesty, a lover of slaughter and quarrels, a murderer, thief, promoter of sedition, treacherous, perjured, obscene, rash, furious and violent.',
    corporature: 'Middle stature, strong body with big bones, rather lean; brown ruddy high colour; round visage; red or sandy-flaxen (often curling) hair; sharp hazel piercing eyes; a bold confident countenance; active and fearless.',
    men: 'Generals, colonels, captains, soldiers; physicians, surgeons, apothecaries, alchemists; gunners, butchers, marshals, sergeants, hangmen, thieves; smiths, bakers, armourers, cutlers, barbers, cooks, carpenters, tanners.',
    diseases: 'The gall; tertian and pestilent burning fevers, carbuncles, plague-sores, burnings, shingles, frenzies, yellow jaundice, bloody flux, fistulas, the stone, all hurts by iron.',
    associations: 'Metal: iron. Colour: red, iron colour. Stone: bloodstone, jasper, loadstone. Day: Tuesday. Angel: Samael. Years: 66 / 40 / 15.',
    summary: 'Mars signifies cutting, burning, war, strife, courage and danger — the lesser malefic, hot and quick to violence.'
  },
  Sun: {
    name: 'Sun', glyph: '☉', order: 3,
    title: 'The Light of Day',
    nature: 'Hot and Dry (more temperate than Mars), Masculine, Diurnal',
    sect: 'diurnal', benefic: null,
    houses: 'Leo', exaltation: 'Aries 19°', fall: 'Libra 19°', detriment: 'Aquarius', joy: '9th house',
    triplicity: 'Fire by day',
    orb: 15,
    wellDignified: 'Very faithful, keeping his promises; of incomparable judgment and great majesty; industrious for honour; speaks deliberately, secret and trusty; affable, humane, magnificent in spirit.',
    illDignified: 'Arrogant, proud, disdainful; boasting of pedigree; restless, troublesome, domineering, expensive, foolish, a spendthrift.',
    corporature: 'Large strong body; yellow or saffron complexion; round large forehead; large sharp piercing eyes; well-composed body; yellowish hair (soon bald); ruddy and high-minded.',
    men: 'Kings, princes, emperors, dukes, magistrates, gentlemen, courtiers, justices, mayors, sheriffs; goldsmiths, braziers, coppersmiths, minters of money.',
    diseases: 'The heart, brain and right eye; palpitations and tremblings, swoonings, eye infirmities, mouth diseases, catarrhs, rotten fevers.',
    associations: 'Metal: gold. Colour: yellow, gold, scarlet. Stone: hyacinth, chrysolite, ruby. Day: Sunday. Angel: Michael. Always direct (never retrograde). Has no terms. Years: 120 / 69½ / 19.',
    summary: 'The Sun signifies life, vitality, authority, kings, the father, honour and the very principle of light and rule.'
  },
  Venus: {
    name: 'Venus', glyph: '♀', order: 4,
    title: 'The Lesser Fortune',
    nature: 'Temperately Cold and Moist, Feminine, Nocturnal',
    sect: 'nocturnal', benefic: true,
    houses: 'Taurus (night) & Libra (day)',
    exaltation: 'Pisces 27°', fall: 'Virgo 27°', detriment: 'Aries & Scorpio', joy: '5th house',
    triplicity: 'Earth by day',
    orb: 7,
    wellDignified: 'Quiet, not given to law or contention; pleasant, neat, loving mirth; cleanly, musical, delighting in baths and merry meetings; cheerful and virtuous.',
    illDignified: 'Riotous, expensive, given wholly to lust and company-keeping; careless of reputation, an atheist, a tavern-haunter, lazy, faithless.',
    corporature: 'Fair, not tall; white complexion tending a little to darkness (the more lovely); fair black-grey eyes; round face; smooth light-brown hair; lovely cherry mouth; a well-shaped, delightful body, rather short.',
    men: 'Musicians, gamesters, silk-men, mercers, linen-drapers, painters, jewellers, players, embroiderers, perfumers, glovers; wives, mothers, virgins.',
    diseases: 'The womb and members of generation; the reins, belly, back and navel; diseases arising from inordinate lust.',
    associations: 'Metal: copper. Colour: white, milky sky-colour. Stone: cornelian, white & red coral, beryl. Day: Friday. Angel: Anael. Years: 82 / 45 / 8.',
    summary: 'Venus signifies love, pleasure, beauty, music, ornament, women and harmony — the lesser benefic.'
  },
  Mercury: {
    name: 'Mercury', glyph: '☿', order: 5,
    title: 'The Convertible Planet',
    nature: 'Of his own nature Cold and Dry, Melancholy; but CONVERTIBLE — good with the good, ill with the ill',
    sect: 'either', benefic: null,
    houses: 'Gemini (day) & Virgo (night)',
    exaltation: 'Virgo 15°', fall: 'Pisces 15°', detriment: 'Sagittarius & Pisces', joy: '1st house',
    triplicity: 'Air by night',
    orb: 7,
    wellDignified: 'A subtle and politic brain; an excellent disputant and logician; eloquent; a searcher into mysteries and learning; sharp and witty, learning anything without a teacher; ambitious in every science.',
    illDignified: 'A troublesome wit; a tongue and pen against everyone; a great liar, boaster, prattler, busybody and tale-carrier; given to wicked arts; a news-monger and trifler.',
    corporature: 'High stature, straight thin spare body; high forehead, long narrow face, long nose; fair eyes; thin lips; little beard, much dark hair; long arms and fingers; olive or chestnut complexion. He strongly partakes of the nature of any planet he is joined to.',
    men: 'Philosophers, mathematicians, astrologers, merchants, secretaries, scriveners, diviners, sculptors, poets, orators, advocates, schoolmasters, stationers, printers, accountants, attorneys; sometimes thieves.',
    diseases: 'The brain, tongue and memory; vertigos, lethargies, madness, stammering, hoarseness, dry coughs, all defects of fancy and intellect.',
    associations: 'Metal: quicksilver. Colour: grey, mixed many colours. Stone: agate, topaz, marcasite. Day: Wednesday. Angel: Raphael. Never more than 27° from the Sun. Years: 76 / 48 / 20.',
    summary: 'Mercury signifies mind, speech, writing, commerce, messengers and learning — taking the colour of whatever he touches.'
  },
  Moon: {
    name: 'Moon', glyph: '☽', order: 6,
    title: 'The Light of Night',
    nature: 'Cold, Moist and Phlegmatic, Feminine, Nocturnal',
    sect: 'nocturnal', benefic: null,
    houses: 'Cancer', exaltation: 'Taurus 3°', fall: 'Scorpio 3°', detriment: 'Capricorn', joy: '3rd house',
    triplicity: 'Earth by night',
    orb: 12,
    wellDignified: 'Of composed manners; a soft, tender creature; a lover of honest sciences; a searcher into and delighter in novelties; naturally inclined to remove and shift; timorous, prodigal, loving peace.',
    illDignified: 'A mere vagabond, idle, hating labour; a drunkard, a sot; of no spirit or forecast; content in no condition of life.',
    corporature: 'Fair stature, whitely coloured; round face; grey eyes (a little lowering); much hair; one eye usually a little larger; short fleshy hands; a fleshy, plump, phlegmatic body.',
    men: 'Queens, countesses, ladies and all women; the common people; travellers, pilgrims, sailors, fishermen, brewers, tapsters, vintners, midwives, nurses, watermen, millers.',
    diseases: 'Apoplexies, palsy, the colic; diseases of the left side, the bladder and the menses; cold rheumatic diseases, dropsies, fluxes, the falling-sickness.',
    associations: 'Metal: silver. Colour: white, pale spotted. Stone: selenite, crystals. Day: Monday. Angel: Gabriel. Never retrograde (but slow ≈ debilitated). Has no terms. Years: 108 / 66 / 25.',
    summary: 'The Moon signifies the body, the common people, the mother, change, travel, and the flow of all matters — the swift co-significator in every question.'
  }
};

export const PLANET_LIST = Object.values(PLANETS).sort((a, b) => a.order - b.order);
