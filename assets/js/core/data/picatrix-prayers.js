// ============================================================================
//  picatrix-prayers.js — the Picatrix BOOK III & IV planetary prayers, spirits,
//  the Perfect Nature, and a Book IV summary. HISTORICAL TEXT RECORDED FOR STUDY
//  of medieval astral magic — DESCRIBED, NEVER PRESCRIBED. The invocations
//  address planetary "spirits"; this records the doctrine, it does NOT endorse
//  or instruct it. Toxic / animal / poisonous ingredients are flagged
//  HISTORICAL-ONLY and must never be made. Astrology/magic have no demonstrated
//  efficacy. Excerpts are deliberately SHORT (a sentence or two) — historical
//  voice, not full ritual liturgy.
//
//  Three SEPARATE spirit-name systems are kept distinct (per the Picatrix's own
//  structure): the III.7 prayer-angel (`prayerAngel`), the III.9 directional
//  spirits from the Liber Antimaquis (`spirit`), and — elsewhere in the codebase
//  (data/planetary-magic.js) — the Agrippa Angel/Intelligence/Spirit triad. They
//  do not overlap and are never merged.
//
//  SOURCES: Greer & Warnock (trans.), The Picatrix: Liber Rubeus Edition
//  (Adocentyn Press / Renaissance Astrology, 2010–11) — quoted throughout; Arabic
//  forms from their footnotes (after Ritter & Plessner). Cross-checked with
//  Attrell & Porreca (Penn State, 2019) and Atallah/Kiesel (Ouroboros, Arabic).
//  Citations are stable at book.chapter: prayers III.7, spirits III.9, the
//  Perfect Nature III.6, Book IV items IV.1–IV.9.
// ============================================================================

export const PICATRIX_PRAYERS_FRAMING =
  'Historical text recorded for the STUDY of medieval astral magic (the Picatrix, Books III–IV). ' +
  'Astrology and magic have no demonstrated efficacy; this is described, never prescribed. The prayers ' +
  'invoke planetary "spirits" — recorded as the historical doctrine, never endorsed or instructed. ' +
  'Some Book IV recipes name toxic, poisonous or animal-derived ingredients: they are flagged ' +
  'HISTORICAL-ONLY and must never be made or used.';

// The seven planetary prayers (III.7) + their directional spirits (III.9).
export const PLANETARY_PRAYERS = {
  Saturn: {
    prayerExcerpt: 'O exalted lord whose name is great and who stands above the heaven of every other planet… You are the lord Saturn, cold and dry, shadowy, the author of good, faithful in your friendships, true to your word… author of good and of evil.',
    address: 'The exalted father and lord — cold, dry, shadowy, ancient, wise and solitary; author of good and evil. The operator robes in black "in the fashion of the Jews."',
    names: 'Zohal (Ar.) · Saturnus (Lat.) · Keyhven (Pers.) · Kronos (Gk.) · Sanasara (Ind.)',
    prayerAngel: { latin: 'Heylil', arabic: 'Isbil' },
    spirit: { master: 'Redimez', masterArabic: 'Barimas', directions: { above: 'Toz', below: 'Corez', right: 'Deytyz', left: 'Deriuz', front: 'Talyz', behind: 'Daruz' }, motion: 'Tahaytuc' },
    citation: 'Picatrix III.7 (prayer) & III.9 (spirits) — Greer–Warnock',
  },
  Jupiter: {
    prayerExcerpt: 'May God bless you, Jupiter, blessed lord, who is the greater fortune, warm and moist, equitable in all your works, affable, beautiful, wise, truthful, lord of truth and equality, far from all evil, merciful…',
    address: 'The blessed lord, the greater fortune — warm, moist, equitable, merciful, lover of religion. The operator robes in yellow/white "in the manner of hermits and Christians."',
    names: 'Mustari (Ar.) · Jupiter (Lat.) · Birgis (Pers.) · Zeus (Gk.) · Huazfat (Ind.)',
    prayerAngel: { latin: 'Raucayehil', arabic: 'Rufija’il' },
    spirit: { master: 'Demehuz', masterArabic: 'Damahas', directions: { above: 'Dermez', below: 'Matiz', right: 'Maz', left: 'Deriz', front: 'Tamiz', behind: 'Foruz' }, motion: 'Dehydez' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
  },
  Mars: {
    prayerExcerpt: 'O Mars, honored lord, hot and dry, mighty, firm of heart, spiller of blood and giver of illnesses; you are strong, hardy, daring… the lord of battles, pains, wounds, prisons and sorrows.',
    address: 'The honored lord — hot, dry, mighty; "spiller of blood," lord of wars and lawsuits. The operator robes in red, armed as a soldier.',
    names: 'Mirrih (Ar.) · Mars (Lat.) · Bahram (Pers.) · Ares (Gk.) · Angara (Ind.)',
    prayerAngel: { latin: 'Raucahehil', arabic: 'Rubija’il' },
    spirit: { master: 'Deharayuz', masterArabic: 'Dagdijus', directions: { above: 'Heheydiz', below: 'Heydeyuz', right: 'Maharaz', left: 'Ardauz', front: 'Hondehoyuz', behind: 'Meheyediz' }, motion: 'Dehydemez' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
    flag: 'Mars’s rite and suffumigation name human blood and the killing of animals — HISTORICAL-ONLY, never to be made. A "vengeance" variant is an explicit curse, recorded as doctrine, not endorsed.',
  },
  Sun: {
    prayerExcerpt: 'You who are the foundation of heaven, exalted above all the stars and planets, holy and reverend… You are the light of the world and its illumination; you stand in the middle of the planets.',
    address: 'The light of the world, honored king over all the stars — foundation of heaven, lord of the six planets. The operator robes in royal gold "in the manner of the Chaldeans." No intermediary angel is named (the Sun is addressed directly).',
    names: 'Shams (Ar.) · Sol (Lat.) · Mihr (Pers.) · Helios (Gk.) · Aditya (Ind.)',
    prayerAngel: { latin: '', arabic: '' },
    spirit: { master: 'Beydeluz', masterArabic: 'Bandalus', directions: { above: 'Dehymez', below: 'Eydulez', right: 'Deheyfuz', left: 'Azuhafez', front: 'Mahabeyuz', behind: 'Hadyz' }, motion: 'Letahaymeriz' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
  },
  Venus: {
    prayerExcerpt: 'May God bless you, O Venus, you who are queen and fortune, cold and moist, equitable in your effects… You are the lady of adornment, of gold and silver; you delight in love, joy, ornaments, songs and music.',
    address: 'The queen and fortune, lady of adornment, love, music and delight. The operator dresses as an exalted figure, or fully as a woman (mirror and comb in hand).',
    names: 'Zuhara (Ar.) · Venus (Lat.) · Anahid (Pers.) · Aphrodite (Gk.) · Surfa (Ind.)',
    prayerAngel: { latin: 'Beyteyl', arabic: 'Bita’il' },
    spirit: { master: 'Deydez', masterArabic: 'Didas', directions: { above: 'Heyluz', below: 'Cahyluz', right: 'Diruez', left: 'Ableymez', front: 'Teyluz', behind: 'Arzuz' }, motion: 'Dehataryz' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
  },
  Mercury: {
    prayerExcerpt: 'May God bless you, good lord Mercury, truthful, perceptive, intelligent, the sage and instructor of every kind of writing, arithmetic and science… You have concealed yourself by your subtlety so that no one can know your nature.',
    address: 'The good and noble lord — scribe and instructor of writing, number and science; eloquence, geometry, divination. "Fortunate with fortunes, unfortunate with infortunes." The operator dresses as a notary/scribe.',
    names: 'Utarid (Ar.) · Mercurius (Lat.) · Tir (Pers.) · Hermes (Gk.) · Budha (Ind.)',
    prayerAngel: { latin: 'Arquyl', arabic: 'Harqil' },
    spirit: { master: 'Merhuyez', masterArabic: 'Barhujas', directions: { above: 'Amirez', below: 'Hytyz', right: 'Cehuz', left: 'Deriz', front: 'Maylez', behind: 'Dehedyz' }, motion: 'Mehendiz' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
  },
  Moon: {
    prayerExcerpt: 'May God bless you, O Moon, blessed lady, fortunate, cold and moist, equitable and lovely. You are the chief and the key of all the other planets, swift in your motion… lady of ambassadors and messengers and the concealer of secrets.',
    address: 'The blessed lady, "the chief and the key of all the other planets," lady of messengers and secrets; "the beginning of all things and the end thereof." The operator dresses "as though a child."',
    names: 'Qamar (Ar.) · Luna (Lat.) · Mah (Pers.) · Selene (Gk.) · Soma (Ind.)',
    prayerAngel: { latin: 'Celan', arabic: 'Silija’il' },
    spirit: { master: 'Harnuz', masterArabic: 'Garnus', directions: { above: 'Hediz', below: 'Marayuz', right: 'Meletaz', left: 'Timez', front: 'Hueyez', behind: 'Meyneluz' }, motion: 'Dahanuz' },
    citation: 'Picatrix III.7 & III.9 — Greer–Warnock',
  },
};

// The Perfect Nature (al-Ṭibāʿ al-Tāmm), Picatrix III.6 — the practitioner's
// personal celestial guardian/genius. Recorded as historical doctrine.
export const PERFECT_NATURE = {
  what: 'The "Perfect Nature" (al-Ṭibāʿ al-Tāmm) — the practitioner’s personal celestial guardian or genius, the spirit linking the sage to the planet that governed his nativity; "that which opens the closed places of knowledge." Socrates: "Perfect Nature is the Sun of the wise and its root is light." The closest medieval analogue to the later "Holy Guardian Angel."',
  namesLatin: ['Meegius', 'Betzahuech', 'Vacdez', 'Nufeneguediz'],
  namesArabic: ['Tamāghīs', 'Baghdīswād', 'Waghdās', 'Nūfānāghādīs'],
  rite: 'Hermes, seeking the secrets of the world, met in a dream "a beautiful man of imperial authority" who told him to shield a candle in a glass lantern, lower it into a dark pit, and "draw out the secrets of Perfect Nature." Asked his name, the figure replied: "I am Perfect Nature; if you wish to speak to me, call me by my proper name." The annual rite (Moon at 0° Aries; offerings at the four quarters; frankincense, mastic and aloeswood) invokes the four names seven times with the petition to "strengthen me with your knowledge so that I may understand that which I do not understand."',
  uncertainty: 'Sources differ on whether the four names are FOUR spirits or ONE spirit with four powers (the Latin reads as four; the Arabic framing as one). The Arabic reconstructions and etymology (likely older non-Arabic forms) are debated. Recorded with both readings, not silently resolved.',
  citation: 'Picatrix III.6 (per the Liber Antimaquis) — Greer–Warnock; Arabic forms cross-checked with Atallah/Kiesel & Attrell/Porreca',
};

// Book IV — short cited summaries. Toxic/dangerous items flagged HISTORICAL-ONLY.
export const BOOK_IV = [
  { ch: 'IV.1', title: 'The nature of spirit & soul', summary: 'A philosophical preamble on how spirit proceeds, and the properties of spirit, body, sense, intellect and soul. No recipes.' },
  { ch: 'IV.2', title: 'The Moon as transmitter; per-sign prayers', summary: 'The doctrine that the Moon "pours out and transmits" the influences of the other planets, with a separate prayer-rite for the Moon in each of the 12 signs (its own place, garments and barbarous-name formulae).', flag: 'Each rite involves animal sacrifice — historical-only.' },
  { ch: 'IV.3', title: 'Chaldean secrets', summary: 'A brief account of what "the Chaldeans held to be the profundities of this science."' },
  { ch: 'IV.4', title: 'Images and reasonings', summary: 'Talismanic-image theory that "greatly furthers" the art.' },
  { ch: 'IV.5', title: 'The ten sciences; natural & alchemical magic', summary: 'Lists the ten sciences the art requires (its foundation being astrology), framing magic’s relation to natural philosophy and alchemy.' },
  { ch: 'IV.6', title: 'Suffumigations of the planets', summary: 'Seven planetary incense compounds, each made while reciting that planet’s prayer and stored in a vessel of its metal.', flag: 'HISTORICAL-ONLY — never to be made: dominated by animal brains/blood and toxic botanicals (mandrake, henbane, asafoetida).' },
  { ch: 'IV.7', title: 'The Nabatean Agriculture & Ibn Waḥshiyya', summary: 'Magical material excerpted from the "Chaldean (Nabatean) Agriculture": plant magic and talking-tree vignettes, with an embedded section from Ibn Waḥshiyya’s Book of Poisons.', flag: 'DANGEROUS, HISTORICAL-ONLY — contains explicit deadly-poison recipes (aconite/monkshood, lead compounds). The translators note it is "not good advice to follow." Never to be made or attempted.' },
  { ch: 'IV.8', title: 'Natural virtues', summary: 'The virtues "which Nature does by her own properties" — natural (non-astral) magic and marvels.' },
  { ch: 'IV.9', title: 'Marvelous images & final rules', summary: 'Talismanic images "found in the church of Coredib and the book of Queen Folopedre," and the closing rules for working with magical images.' },
];

export const PICATRIX_PRAYERS_SOURCE = 'Picatrix (Ghāyat al-Ḥakīm) Books III–IV: prayers III.7, directional spirits III.9 (Liber Antimaquis), the Perfect Nature III.6, Book IV IV.1–IV.9. Greer–Warnock translation; cross-checked with Attrell–Porreca and Atallah/Kiesel.';

// Convenience: the prayer/spirit for a planet (used to link a calculation's
// ruling planet to its historical prayer). Returns null for non-planets.
export function prayerFor(planet) { return PLANETARY_PRAYERS[planet] || null; }
