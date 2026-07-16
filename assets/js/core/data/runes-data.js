// ============================================================================
//  runes-data.js — the ELDER FUTHARK: 24 staves in three ættir of eight, the
//  cited reference dataset behind the runes oracle (core/runes.js, app/runes.js,
//  pages/runes.html). The Elder Futhark was first of all a WRITING system
//  (roughly c. 150–700/800 CE); every "divinatory meaning" is a 20th-century
//  construction. What IS attested — the three medieval rune poems — is stored as
//  concise ORIGINAL paraphrases (built on Bruce Dickins 1915, public domain, the
//  same method the site uses for the I Ching after Legge), kept clearly ABOVE the
//  flagged "modern meaning" keyword. Disputes are flagged in-data, never resolved.
//
//  PURE DATA + tiny derivations — no engine imports, no DOM, no randomness. The
//  Unicode chars are derived from the verified codepoints so a glyph can never
//  drift from its codepoint (gebo is U+16B7 — NOT U+16B3, which is the Anglo-Saxon
//  futhorc letter CEN and must never appear in an Elder Futhark table).
//
//  HONEST FRAMING: a historical divinatory practice of NO demonstrated validity,
//  recorded for study — described, never prescribed. No blank rune ships in the
//  24-stave data (Ralph Blum's 1982/83 invention — see FRAMING.blankRune).
// ============================================================================

// Poem-source citation strings (the transmission is spelt out in POEMS below).
const OE_CITE = 'Old English Rune Poem (sole MS Cotton Otho B.x, burned 1731; surviving only via George Hickes 1705, Wanley transcript) — concise paraphrase after Dickins 1915';
const NO_CITE = 'Old Norwegian Rune Poem (13th c., surviving in a 17th-c. copy of a lost MS) — concise paraphrase after Dickins 1915';
const IS_CITE = 'Old Icelandic Rune Poem (c. 1500; four Arnamagnæan MSS, oldest AM 687 d 4°) — concise paraphrase after Dickins 1915';
const ETYM_CITE = 'Düwel, Runenkunde (4th ed., 2008); R. I. Page, Runes (1987) & An Introduction to English Runes (1999); Wikipedia, Elder Futhark';
const NORSE_GAP = 'no Norse stanza — the Younger Futhark dropped this stave (its meaning rests on the Old English stanza + the name-etymology; the divinatory reading is modern regardless)';

// ---------------------------------------------------------------------------
//  The 24 staves, in the standard modern order. `cp` is the VERIFIED Runic-block
//  codepoint; `char` is derived from it. `variants` are Unicode-distinct
//  Anglo-Saxon (futhorc) letters kept only as DISPLAY alternatives, not separate
//  Elder staves. `oe` is present for all 24; `no`/`is` for exactly 16 (the eight
//  with `no:null` carry an explicit norseNote). `contested` flags the 7 disputed
//  name/meaning rows plus the two order variances (ï/p on #13–14, dagaz/oþala on
//  #23–24), each with its own citation — never averaged, never resolved.
// ---------------------------------------------------------------------------
const RUNES_RAW = [
  {
    id: 'fehu', pos: 1, name: '*fehu', cp: 0x16A0, translit: 'f',
    attestedNames: { oe: 'feoh', no: 'fé', is: 'fé' },
    etymMeaning: 'cattle; movable wealth', modernMeaning: 'wealth',
    oe: 'Wealth is a comfort to all, yet each must deal it out freely if he would win favour before the Lord.',
    no: 'Wealth is a source of discord among kinsmen; the wolf lives in the forest.',
    is: 'Wealth is the strife of kinsmen, the fire of the flood-tide, and the road of the serpent.',
  },
  {
    id: 'uruz', pos: 2, name: '*uruz', cp: 0x16A2, translit: 'u',
    attestedNames: { oe: 'ur', no: 'úr', is: 'úr' },
    etymMeaning: 'aurochs (OE tradition)', modernMeaning: 'strength',
    oe: 'The aurochs is fierce and great-horned, a bold moor-treader that fights with its horns — a proud beast.',
    no: 'Dross comes from bad iron; the reindeer often races over the frozen snow.',
    is: 'Drizzle is the lamentation of the clouds, the ruin of the hay-harvest, and the abomination of the herdsman.',
    contested: {
      type: 'name',
      note: 'Three divergent name-meanings across the poems, not to be averaged: Old English "aurochs" (wild ox), Old Norwegian "dross/slag from bad iron", Old Icelandic "drizzle/lamentation of the clouds" — three different words.',
      cite: 'Halsall 1981; Dickins 1915; Düwel, Runenkunde (2008)',
    },
  },
  {
    id: 'thurisaz', pos: 3, name: '*þurisaz', cp: 0x16A6, translit: 'þ',
    attestedNames: { oe: 'þorn', no: 'þurs', is: 'þurs' },
    etymMeaning: 'giant, ogre', modernMeaning: 'a hostile force',
    oe: 'The thorn is exceedingly sharp, an evil thing to grasp, harsh to any who rest among the thorns.',
    no: 'The giant causes anguish to women; misfortune makes few men cheerful.',
    is: 'The giant is the torment of women, the dweller in the cliffs, and the husband of the giantess Vörð.',
    contested: {
      type: 'name',
      note: 'The Old English poem renames the stave "þorn" (thorn) — a likely Christian-era renaming — where the Norse tradition keeps "þurs" (giant/ogre).',
      cite: 'Halsall 1981; Dickins 1915; Düwel, Runenkunde (2008)',
    },
  },
  {
    id: 'ansuz', pos: 4, name: '*ansuz', cp: 0x16A8, translit: 'a',
    attestedNames: { oe: 'os', no: 'óss', is: 'óss' },
    etymMeaning: 'a god (of the Æsir)', modernMeaning: 'a message',
    oe: 'The mouth is the source of all speech, the pillar of wisdom and a comfort to the wise — a blessing to every home.',
    no: 'The estuary is the way of most journeys; but the scabbard is that of swords.',
    is: 'The god is the aged Gautr (Odin) and prince of Ásgarðr, the lord of Valhalla.',
    contested: {
      type: 'name',
      note: 'The name diverges four ways: reconstructed *ansuz "a god (of the Æsir)"; the Old English "os" stanza reads it through Latin os "mouth" (source of speech); Old Norwegian "óss" = river-mouth/estuary; Old Icelandic "óss" = the aged Gautr (Odin).',
      cite: 'Halsall 1981; Dickins 1915; Düwel, Runenkunde (2008)',
    },
  },
  {
    id: 'raido', pos: 5, name: '*raidō', cp: 0x16B1, translit: 'r',
    attestedNames: { oe: 'rad', no: 'reið', is: 'reið' },
    etymMeaning: 'ride, journey', modernMeaning: 'a journey',
    oe: 'Riding seems easy to a warrior in the hall, and strenuous indeed to one astride a stout horse over the long miles.',
    no: 'Riding is said to be the worst thing for horses; Reginn forged the finest of swords.',
    is: 'Riding is the joy of horsemen, a speedy journey, and the toil of the steed.',
  },
  {
    id: 'kauna', pos: 6, name: '*kauną', cp: 0x16B2, translit: 'k',
    attestedNames: { oe: 'cen', no: 'kaun', is: 'kaun' },
    etymMeaning: 'sore, ulcer (Norse); OE name "cen" means torch', modernMeaning: 'a fever / a beacon',
    oe: 'The torch is known to all the living by its flame; it burns bright and clear where noble folk rest within.',
    no: 'The ulcer is fatal to children; death makes a corpse pale.',
    is: 'The ulcer is the bane of children, a painful spot, and the abode of mortification.',
    contested: {
      type: 'name',
      note: 'Two name traditions: Old Norse "kaun" = sore/ulcer, Old English "cen" = torch. Even the reconstructed Proto-Germanic form is contested (*kauną "sore" vs *kenaz "torch").',
      cite: 'Düwel, Runenkunde (2008); Halsall 1981',
    },
  },
  {
    id: 'gebo', pos: 7, name: '*gebō', cp: 0x16B7, translit: 'g',
    attestedNames: { oe: 'gyfu', no: null, is: null },
    etymMeaning: 'gift', modernMeaning: 'a gift',
    oe: 'Giving brings credit and honour, upholds a man’s dignity; and to the destitute it is help and sustenance where all else fails.',
    no: null, is: null, norseNote: NORSE_GAP,
  },
  {
    id: 'wunjo', pos: 8, name: '*wunjō', cp: 0x16B9, translit: 'w',
    attestedNames: { oe: 'wynn', no: null, is: null },
    etymMeaning: 'joy', modernMeaning: 'joy',
    oe: 'Joy comes to one who knows few troubles, pains and sorrows, and who himself has power and blessedness and a good enough house.',
    no: null, is: null, norseNote: NORSE_GAP,
  },
  {
    id: 'hagalaz', pos: 9, name: '*hagalaz', cp: 0x16BA, translit: 'h',
    variants: [{ cp: 0x16BB, note: 'ᚻ U+16BB (RUNIC LETTER HAEGL H) — a Unicode-distinct Anglo-Saxon futhorc variant of the same hail-rune; a display alternative only.' }],
    attestedNames: { oe: 'hægl', no: 'hagall', is: 'hagall' },
    etymMeaning: 'hail', modernMeaning: 'sudden disruption',
    oe: 'Hail is the whitest of grains; it whirls down from the height of heaven, is tossed by gusts of wind, and then turns to water.',
    no: 'Hail is the coldest of grains; Christ shaped the world of old.',
    is: 'Hail is a cold grain, a shower of sleet, and the sickness of serpents.',
  },
  {
    id: 'naudiz', pos: 10, name: '*naudiz', cp: 0x16BE, translit: 'n',
    attestedNames: { oe: 'nyd', no: 'nauðr', is: 'nauð' },
    etymMeaning: 'need, constraint', modernMeaning: 'need',
    oe: 'Need is oppressive to the heart, yet often it turns to a help and a salvation for the children of men, if they heed it in time.',
    no: 'Constraint gives scant choice; the naked man is chilled by the frost.',
    is: 'Constraint is the grief of the bond-maid, a state of oppression, and toilsome work.',
  },
  {
    id: 'isaz', pos: 11, name: '*īsaz', cp: 0x16C1, translit: 'i',
    attestedNames: { oe: 'is', no: 'íss', is: 'íss' },
    etymMeaning: 'ice', modernMeaning: 'a standstill',
    oe: 'Ice is very cold and immeasurably slippery; it glistens clear as glass, most like to gems — a floor wrought of frost, fair to look upon.',
    no: 'Ice we call the broad bridge; the blind man must be led.',
    is: 'Ice is the bark of rivers, the roof of the wave, and a danger to doomed men.',
  },
  {
    id: 'jera', pos: 12, name: '*jēra-', cp: 0x16C3, translit: 'j',
    attestedNames: { oe: 'ger', no: 'ár', is: 'ár' },
    etymMeaning: '(good) year, harvest', modernMeaning: 'the harvest',
    oe: 'The season of harvest is a joy to men, when God, the holy king of heaven, lets the earth bring forth her bright fruits for rich and poor alike.',
    no: 'Plenty is a boon to men; I say that Fróði was open-handed.',
    is: 'Plenty is a boon to men, a good summer, and thriving crops.',
  },
  {
    id: 'eihwaz', pos: 13, name: '*ī(h)waz / *eihaz', cp: 0x16C7, translit: 'ï',
    attestedNames: { oe: 'eoh', no: 'ýr', is: 'ýr' },
    etymMeaning: 'yew tree', modernMeaning: 'endurance',
    oe: 'The yew is a rough-barked tree, hard and fast in the earth, a keeper of fire, upheld by its roots — a joy on the estate.',
    no: 'Yew is the greenest of trees in winter; when it burns it is wont to crackle.',
    is: 'Yew is a bent bow, brittle iron, and the giant of the arrow.',
    norseCite: 'Norse stanzas listed under "ýr" — attached to this stave by name-meaning (yew), with the caveat below',
    contested: {
      type: 'name+order',
      note: 'A double tangle. (1) The Norse "ýr" stanzas (yew — "greenest of trees in winter"; "bent bow, brittle iron") match this stave by name-meaning, but the Younger-Futhark ᛦ shape actually descends from *algiz (#15); its Norse coverage is stored here only with that caveat. (2) The #13/#14 (ï/p) order varies between the earliest rows: the Kylver stone has p before ï, the Vadstena/Grumpan bracteates ï before p (the modern convention followed here).',
      cite: 'Page, An Introduction to English Runes (1999); Wikipedia, Algiz; Wikipedia, Elder Futhark (Kylver vs bracteates)',
    },
  },
  {
    id: 'pertho', pos: 14, name: '*perþō', cp: 0x16C8, translit: 'p',
    attestedNames: { oe: 'peorð', no: null, is: null },
    etymMeaning: 'UNKNOWN (game-piece? dice-cup? — all readings speculative)', modernMeaning: 'a secret / chance',
    oe: 'Peorð is ever a source of recreation and amusement to the proud, where warriors sit merrily together in the beer-hall.',
    no: null, is: null, norseNote: NORSE_GAP,
    contested: {
      type: 'name+order',
      note: 'The meaning is unknown to all scholarship — even the reconstructed Proto-Germanic form is guesswork; the sole Old English stanza only says it brings "recreation and amusement in the beer-hall" (a game-piece? a dice-cup?). Also part of the #13/#14 (ï/p) order variance (Kylver p-ï vs bracteate ï-p).',
      cite: 'Halsall 1981; Dickins 1915; Wikipedia, Elder Futhark',
    },
  },
  {
    id: 'algiz', pos: 15, name: '*algiz', cp: 0x16C9, translit: 'z',
    attestedNames: { oe: 'eolhx', no: null, is: null },
    etymMeaning: 'elk (disputed — back-formed from OE eolh-secg)', modernMeaning: 'protection',
    oe: 'The elk-sedge dwells most often in the fen, growing in the water; it wounds grimly, and burns with blood every man who lays a hand upon it.',
    no: null, is: null, norseNote: NORSE_GAP,
    contested: {
      type: 'name',
      note: '"Algiz/elk" is most likely NOT the historical name — it is a back-formation from Old English eolh(x)-secg "elk-sedge" (proposed by Wilhelm Grimm, 1821); the z/ʀ phoneme never occurs word-initially, so the rune could not have been named acrophonically. The original name is genuinely uncertain. (The Younger-Futhark descendant of this shape was renamed "ýr" — see *eihwaz #13.)',
      cite: 'Wikipedia, Algiz; Page, An Introduction to English Runes (1999); Düwel, Runenkunde (2008)',
    },
  },
  {
    id: 'sowilo', pos: 16, name: '*sōwilō', cp: 0x16CA, translit: 's',
    variants: [{ cp: 0x16CB, note: 'ᛋ U+16CB (RUNIC LETTER SIGEL LONG-BRANCH-SOL S) — a Unicode-distinct Anglo-Saxon futhorc variant of the same sun-rune; a display alternative only.' }],
    attestedNames: { oe: 'sigel', no: 'sól', is: 'sól' },
    etymMeaning: 'sun', modernMeaning: 'success',
    oe: 'The sun is ever a joy to seafarers when they journey over the fishes’ bath, until the sea-steed brings them to land.',
    no: 'The sun is the light of the world; I bow to the divine decree.',
    is: 'The sun is the shield of the clouds, a shining ray, and the destroyer of ice.',
  },
  {
    id: 'tiwaz', pos: 17, name: '*tīwaz', cp: 0x16CF, translit: 't',
    attestedNames: { oe: 'tir', no: 'Týr', is: 'Týr' },
    etymMeaning: 'the god *Tīwaz (Týr)', modernMeaning: 'victory / justice',
    oe: 'Tir is a guiding star; it keeps faith well with princes, and never fails on its course through the mists of night.',
    no: 'Týr is the one-handed god; the smith has often to blow the bellows.',
    is: 'Týr is the one-handed god, the leavings of the wolf, and the ruler of temples.',
    nameNote: 'The Old English "tir" reads the name as "glory / a guiding star" rather than the god-name *Tīwaz / Týr kept in the Norse tradition — a divergence, though a lighter one than the fully contested rows.',
  },
  {
    id: 'berkanan', pos: 18, name: '*berkanan', cp: 0x16D2, translit: 'b',
    attestedNames: { oe: 'beorc', no: 'bjarkan', is: 'bjarkan' },
    etymMeaning: 'birch', modernMeaning: 'growth / new beginnings',
    oe: 'The birch bears no fruit, yet it puts forth shoots without seed; its branches are splendid, high in its spreading crown, finely arrayed.',
    no: 'Birch is the greenest-leaved of shrubs; Loki was fortunate in his deceit.',
    is: 'Birch is a leafy twig, a little tree, and a fresh young shrub.',
  },
  {
    id: 'ehwaz', pos: 19, name: '*ehwaz', cp: 0x16D6, translit: 'e',
    attestedNames: { oe: 'eh', no: null, is: null },
    etymMeaning: 'horse', modernMeaning: 'partnership / movement',
    oe: 'The horse is a joy to princes in the pride of its hoofs, when wealthy riders trade words about it — and to the restless it is ever a comfort.',
    no: null, is: null, norseNote: NORSE_GAP,
  },
  {
    id: 'mannaz', pos: 20, name: '*mannaz', cp: 0x16D7, translit: 'm',
    attestedNames: { oe: 'mann', no: 'maðr', is: 'maðr' },
    etymMeaning: 'man, human being', modernMeaning: 'the self / humankind',
    oe: 'Man in his mirth is dear to his kindred, yet each must one day fail the other, for the Lord, by his decree, commits the frail flesh to the earth.',
    no: 'Man is an augmentation of the dust; great is the talon-span of the hawk.',
    is: 'Man is the delight of man, an augmentation of the dust, and the adorner of ships.',
  },
  {
    id: 'laguz', pos: 21, name: '*laguz', cp: 0x16DA, translit: 'l',
    attestedNames: { oe: 'lagu', no: 'lögr', is: 'lögr' },
    etymMeaning: 'water, lake, sea', modernMeaning: 'the unconscious / flow',
    oe: 'The ocean seems unending to men who must venture on a heaving ship; the waves terrify them, and the sea-steed heeds not the bridle.',
    no: 'A waterfall is a river that falls from a mountainside; but ornaments are of gold.',
    is: 'Water is an eddying stream, a broad geyser, and the land of the fish.',
  },
  {
    id: 'ingwaz', pos: 22, name: '*ingwaz', cp: 0x16DC, translit: 'ŋ',
    variants: [{ cp: 0x16DD, note: 'ᛝ U+16DD (RUNIC LETTER ING) — a Unicode-distinct Anglo-Saxon futhorc variant of the same Ing-rune; a display alternative only.' }],
    attestedNames: { oe: 'Ing', no: null, is: null },
    etymMeaning: 'the god/hero Ing (Yngvi-Freyr)', modernMeaning: 'gestation / a completed cycle',
    oe: 'Ing was first seen by men among the East-Danes, till he departed eastward over the wave, his wagon rolling behind him — so the Heardings named the hero.',
    no: null, is: null, norseNote: NORSE_GAP,
  },
  {
    id: 'dagaz', pos: 23, name: '*dagaz', cp: 0x16DE, translit: 'd',
    attestedNames: { oe: 'dæg', no: null, is: null },
    etymMeaning: 'day', modernMeaning: 'daybreak / breakthrough',
    oe: 'Day is the Lord’s messenger, dear to men, the great light of the Ruler — a joy and a hope to rich and poor, and of service to all.',
    no: null, is: null, norseNote: NORSE_GAP,
    contested: {
      type: 'order',
      note: 'The final pair *dagaz / *ōþala varies in order between the earliest complete rows: the Kylver stone (c. 400 CE) runs …d o (dagaz then ōþala — the modern convention followed here); the Vadstena / Mariedamm / Grumpan bracteates invert them to …o d. Flagged, not resolved.',
      cite: 'Wikipedia, Elder Futhark; Wikipedia, Vadstena bracteate',
    },
  },
  {
    id: 'othala', pos: 24, name: '*ōþala-', cp: 0x16DF, translit: 'o',
    attestedNames: { oe: 'eþel', no: null, is: null },
    etymMeaning: 'inherited estate, ancestral property', modernMeaning: 'heritage / home',
    oe: 'An ancestral home is exceedingly dear to every man, if he may there enjoy in his house whatever is right and proper, in constant prosperity.',
    no: null, is: null, norseNote: NORSE_GAP,
    contested: {
      type: 'order',
      note: 'The final pair *ōþala / *dagaz varies in order between the earliest rows — see *dagaz (#23): the Kylver stone has d-o, the Vadstena/Grumpan bracteates o-d. Flagged, not resolved.',
      cite: 'Wikipedia, Elder Futhark; Wikipedia, Vadstena bracteate',
    },
  },
];

// ---------------------------------------------------------------------------
//  Materialise the records: derive char from codepoint (so a glyph can never
//  drift from its codepoint), the ætt (three groups of eight) and ætt-position,
//  attach citations, and normalise the poems into a { oe, no, is } block with an
//  explicit `norseNote` on the eight OE-only staves.
// ---------------------------------------------------------------------------
export const RUNES = RUNES_RAW.map(r => {
  const aett = Math.floor((r.pos - 1) / 8) + 1;             // 1..3
  const aettPosition = ((r.pos - 1) % 8) + 1;              // 1..8
  const variants = (r.variants || []).map(v => ({ char: String.fromCodePoint(v.cp), codepoint: v.cp, note: v.note }));
  const poems = {
    oe: { name: r.attestedNames.oe, stanzaGist: r.oe, cite: OE_CITE },
    no: r.no ? { name: r.attestedNames.no, stanzaGist: r.no, cite: NO_CITE } : null,
    is: r.is ? { name: r.attestedNames.is, stanzaGist: r.is, cite: IS_CITE } : null,
  };
  return {
    id: r.id,
    position: r.pos,
    aett, aettPosition,
    name: r.name,                       // reconstructed Proto-Germanic, asterisked
    nameReconstructed: true,            // NO Elder-period rune name is directly attested
    attestedNames: { ...r.attestedNames },
    char: String.fromCodePoint(r.cp),
    codepoint: r.cp,
    displayVariants: variants.length ? variants : null,
    variantNote: variants.length ? 'The variant(s) are Unicode-distinct Anglo-Saxon (futhorc) letters, kept only as display alternatives — not separate Elder staves.' : null,
    translit: r.translit,
    etymMeaning: r.etymMeaning,
    poems,
    norseNote: r.no ? null : (r.norseNote || NORSE_GAP),
    hasNorse: !!r.no,
    modernMeaning: r.modernMeaning,     // one keyword — a 20th-century construction
    modern: true,                       // the "modern meaning" is flagged modern, always
    nameNote: r.nameNote || null,
    contested: r.contested || null,
    cite: ETYM_CITE,
  };
});

// ---------------------------------------------------------------------------
//  The three ættir. The names "Freyr's / Hagall's / Týr's ætt" are LATER
//  Icelandic tradition, not attested for the Elder period — the original group
//  names are unknown. The 3×8 division itself IS attested (Vadstena & Grumpan
//  bracteates, c. 500 CE).
// ---------------------------------------------------------------------------
const AETT_NAME_NOTE = 'The names "Freyr’s / Hagall’s / Týr’s ætt" are a later Icelandic tradition, not attested for the Elder period — the original group names are unknown. The three-fold division itself IS attested on the Vadstena and Grumpan bracteates (c. 500 CE).';
export const AETTIR = [
  { num: 1, name: 'Freyr’s ætt', firstStave: 'fehu', lastStave: 'wunjo', staves: RUNES.filter(r => r.aett === 1).map(r => r.id), nameNote: AETT_NAME_NOTE, cite: 'Düwel, Runenkunde (2008); Wikipedia, Vadstena bracteate & Grumpan bracteate' },
  { num: 2, name: 'Hagall’s ætt', firstStave: 'hagalaz', lastStave: 'sowilo', staves: RUNES.filter(r => r.aett === 2).map(r => r.id), nameNote: AETT_NAME_NOTE, cite: 'Düwel, Runenkunde (2008); Wikipedia, Vadstena bracteate & Grumpan bracteate' },
  { num: 3, name: 'Týr’s ætt', firstStave: 'tiwaz', lastStave: 'othala', staves: RUNES.filter(r => r.aett === 3).map(r => r.id), nameNote: AETT_NAME_NOTE, cite: 'Düwel, Runenkunde (2008); Wikipedia, Vadstena bracteate & Grumpan bracteate' },
];

// ---------------------------------------------------------------------------
//  The three medieval rune poems (transmission + coverage). Their stanzas are
//  the ONLY medieval verse attached to the rune names; every gist above is a
//  concise paraphrase built on Dickins 1915 (public domain). Halsall 1981 is the
//  modern critical edition of the OE poem (in copyright — cited, not quoted).
// ---------------------------------------------------------------------------
export const POEMS = [
  { id: 'oe', name: 'Old English Rune Poem', date: '8th–9th c.', runes: 24,
    covers: 'cognates of all 24 Elder staves (its 29 stanzas add 5 futhorc-only extras — ac, æsc, yr, ior, ear — which are NOT Elder staves and are excluded here)',
    transmission: 'sole MS Cotton Otho B.x, destroyed in the Cottonian fire of 1731; survives only via George Hickes’ 1705 facsimile (Wanley transcript). The rune-name glosses may be Hickes’ or Wanley’s own additions.',
    edition: 'Halsall 1981 (critical edition); Dickins 1915 (public-domain translation, the paraphrase base here)' },
  { id: 'no', name: 'Old Norwegian Rune Poem', date: '13th c.', runes: 16,
    covers: 'the 16 Younger Futhark runes only',
    transmission: 'a 17th-c. copy of a lost 13th-c. manuscript',
    edition: 'Dickins 1915' },
  { id: 'is', name: 'Old Icelandic Rune Poem', date: 'c. 1500', runes: 16,
    covers: 'the 16 Younger Futhark runes only',
    transmission: 'four Arnamagnæan manuscripts, oldest AM 687 d 4°',
    edition: 'Dickins 1915' },
];

// ---------------------------------------------------------------------------
//  Casting methods. The Tacitus scatter-cast is the DEFAULT precisely because it
//  lets the page quote the one detailed ancient source and its dispute. Single
//  and three-rune draws are flagged MODERN. No blank rune (see FRAMING).
// ---------------------------------------------------------------------------
export const CASTING_METHODS = [
  {
    id: 'tacitus', label: 'Tacitus scatter-cast', default: true, drawCount: 3,
    positions: ['first lot', 'second lot', 'third lot'],
    procedure: 'Scatter all 24 lots "carelessly and at random" over a white cloth; then, looking upward, take up three, one at a time, and read each by the mark upon it.',
    quote: 'They cut off a branch from a nut-bearing tree, and slice it into strips; these they mark with certain signs and throw, as random chance will have it, on to a white cloth. Then the priest of the state, if it be a public consultation, or the father of the family if private, after invoking the gods and with eyes turned to heaven, takes up three strips, one at a time, and reads their meaning from the signs previously marked upon them.',
    quoteCite: 'Tacitus, Germania 10 (98 CE), trans. after A. J. Church & W. J. Brodribb',
    latinKey: '"notis quibusdam discretos" — "distinguished by certain signs" (notae). Tacitus never says the marks were letters, and never says runes.',
    dispute: 'Germania 10 is the only DETAILED ancient description of the lot-casting procedure — but Caesar, De Bello Gallico 1.50 (c. 58 BCE), also briefly attests Germanic lot-divination (matrons declaring by sortes whether to give battle). Whether the notae were runes is disputed and probably unanswerable: the earliest secure runic inscriptions (Vimose comb, c. 150–160 CE) postdate Tacitus, and R. I. Page is explicitly skeptical. Shown ONLY as the prototype of scattered-lot divination — never as evidence that runes carried divinatory meanings.',
    historicity: 'prototype',
    cite: 'Tacitus, Germania 10 (Church & Brodribb); Caesar, De Bello Gallico 1.50 (Loeb); R. I. Page, An Introduction to English Runes (1999)',
  },
  {
    id: 'single', label: 'Single draw', default: false, drawCount: 1,
    positions: ['the stave'],
    procedure: 'Draw one of the 24 staves.',
    historicity: 'modern', modern: true,
    note: 'Modern practice — there is no ancient attestation of rune-meaning divination.',
    cite: 'Page, Runes (1987); Wikipedia, Runic magic',
  },
  {
    id: 'three', label: 'Three-rune spread', default: false, drawCount: 3,
    positions: ['past', 'present', 'future'],
    procedure: 'Draw three distinct staves and read them as, e.g., past / present / future.',
    historicity: 'modern', modern: true,
    note: 'Modern convention, popularized by Ralph Blum (1982).',
    cite: 'Blum, The Book of Runes (1982); Page, Runes (1987)',
  },
];

// ---------------------------------------------------------------------------
//  The honest framing block. Every field carries its own citation.
// ---------------------------------------------------------------------------
export const FRAMING = {
  writingSystem: {
    text: 'The Elder Futhark was first and foremost a WRITING system, used for the Germanic languages roughly c. 150–700/800 CE. The earliest datable inscription is the Vimose comb (c. 150–160 CE, reading harja); the earliest complete 24-rune row is the Kylver stone, Gotland (c. 400 CE); the 3×8 division into ættir is attested on the Vadstena and Grumpan bracteates (c. 500 CE).',
    cite: 'Düwel, Runenkunde (2008); Page, Runes (1987); Wikipedia, Elder Futhark / Vimose inscriptions',
  },
  epigraphicMagic: {
    text: 'Magical use IS attested epigraphically — the charm-word "alu" (on the Elgesem stone, the Lindholm amulet and many bracteates), "laukaz" ("leek") and "laþu" on bracteates, and non-lexical rune sequences such as the Lindholm amulet’s. But that is inscription-magic; it is not a divination table.',
    cite: 'Wikipedia, Alu (runic); Düwel, Runenkunde (2008), bracteate chapter',
  },
  noMeaningTable: {
    text: 'No ancient or medieval source gives a rune-by-rune divinatory MEANING table. The neat "each rune = one meaning" oracle is a 20th-century construction, assembled from the rune poems and the name-etymologies. Every "modern meaning" keyword in this dataset is flagged accordingly; the poem stanzas are what is actually attested.',
    cite: 'Page, Runes (1987); Wikipedia, Runic magic',
  },
  tacitus: {
    text: 'Tacitus, Germania 10 (98 CE) gives the only DETAILED ancient description of the lot-casting procedure. Caesar, De Bello Gallico 1.50 (c. 58 BCE) also briefly attests Germanic lot-divination. Neither says the marks were runes, and the earliest runic inscriptions postdate Tacitus — so the cast is presented only as the prototype of scattered-lot divination.',
    cite: 'Tacitus, Germania 10 (Church & Brodribb); Caesar, De Bello Gallico 1.50 (Loeb)',
  },
  page: {
    text: 'R. I. Page is explicitly skeptical that Tacitus’ notae were runes: "Our earliest inscriptions in runes date perhaps from the late second century AD" — after Tacitus wrote.',
    cite: 'R. I. Page, An Introduction to English Runes (2nd ed., Boydell 1999)',
  },
  blankRune: {
    text: 'The modern pop rune oracle was created by Ralph Blum, The Book of Runes (St. Martin’s, 1982; mass printing 1983; 900,000+ copies). Blum derived his keyword meanings via the I Ching (not Germanic sources), scrambled the futhark order, and ADDED a 25th "blank rune" ("Odin’s rune", "the Unknowable"). The blank rune was first DOCUMENTED in Blum 1982/83 — Blum himself claimed a blank tile was already in a rune set he bought in England in the 1970s, so the physical blank may slightly predate the book — but it has NO ancient attestation. It is EXCLUDED from the 24-stave data here. Its reception is a practitioner split: traditionalists reject it outright, while some pragmatist readers keep it.',
    cite: 'us.macmillan.com (St. Martin’s, 900,000+ copies); groveandgrotto.com, on the blank rune’s history; Blum, The Book of Runes (1982)',
  },
  keepOut: {
    text: 'Deliberately excluded: Guido von List’s "Armanen runes" (1908, 18 runes) — a separate esoteric invention carrying völkisch / Nazi-era baggage, NOT the Elder Futhark — and Blum’s copyrighted, I-Ching-derived keyword meanings. Reversed ("merkstave") readings are likewise modern and unattested (and 9 staves are rotation-symmetric, so they cannot invert).',
    cite: 'Page, Runes (1987); groveandgrotto.com',
  },
  poemsCritical: {
    text: 'The stanza gists here are concise ORIGINAL paraphrases built on Bruce Dickins, Runic and Heroic Poems of the Old Teutonic Peoples (Cambridge, 1915, public domain) — the same public-domain-base method the site uses for the I Ching (after Legge). Maureen Halsall, The Old English Rune Poem: A Critical Edition (Toronto, 1981) is the modern critical edition (in copyright — cited, not quoted).',
    cite: 'Dickins 1915; Halsall 1981',
  },
  cite: 'Klaus Düwel, Runenkunde (2008); R. I. Page, Runes (1987) & An Introduction to English Runes (1999); Bruce Dickins, Runic and Heroic Poems (1915); Maureen Halsall, The Old English Rune Poem (1981); Tacitus, Germania 10; Caesar, De Bello Gallico 1.50; Ralph Blum, The Book of Runes (1982); groveandgrotto.com.',
};

// A compact source line for footers / exports.
export const RUNES_SOURCES = 'Klaus Düwel, Runenkunde (4th ed., 2008); R. I. Page, Runes (1987) & An Introduction to English Runes (1999); Bruce Dickins, Runic and Heroic Poems of the Old Teutonic Peoples (1915, public domain — paraphrase base); Maureen Halsall, The Old English Rune Poem: A Critical Edition (1981); Tacitus, Germania 10 & Caesar, De Bello Gallico 1.50; the Kylver, Vadstena & Grumpan inscriptions; Ralph Blum, The Book of Runes (1982) & groveandgrotto.com (the blank-rune history).';

// --- tiny lookups (pure) ----------------------------------------------------
const BY_ID = new Map(RUNES.map(r => [r.id, r]));
const BY_TRANSLIT = new Map(RUNES.map(r => [r.translit, r]));
export function runeById(id) { return BY_ID.get(id) || null; }
export function runeByTranslit(t) { return BY_TRANSLIT.get(t) || null; }
