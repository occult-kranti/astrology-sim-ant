// ============================================================================
//  decan-faces.js — The 36 decan faces (10° each) with their TRADITIONAL
//  MAGICAL IMAGES from Cornelius Agrippa, "Three Books of Occult Philosophy",
//  Book II, ch. 37 ("Of the Images of the Faces, and of those Images which are
//  without the Zodiack"), the J. Freake 1651 English translation. Picatrix
//  Book II.11 carries a parallel image-set; where Picatrix notably DIVERGES
//  from Agrippa the variant is stored in `imageAlt` and flagged in `source`.
//
//  Sources:
//   • Agrippa, Three Books of Occult Philosophy II.37
//     (esotericarchives.com/agrippa/agripp2c.htm; cross-checked vs the Freake
//     transcription mirrored at mr-kaplan.com/Astrology/Decans).
//   • Picatrix (Ghayat al-Hakim) Book II, ch. 11 — for the flagged variants.
//
//  Fidelity notes / caveats (load-bearing — keep them):
//   • RULERS ARE NOT RECOMPUTED HERE. Each face's planetary ruler is taken
//     verbatim from `FACES` in dignities-data.js (Chaldean order from Mars at
//     0° Aries). This module only adds the IMAGE text.
//   • Agrippa and Picatrix agree on most faces but DIVERGE on several (the two
//     traditions descend from different recensions of the Greek/Arabic decan
//     lore). Divergent faces store both: Agrippa in `image`, Picatrix in
//     `imageAlt`. We do NOT silently resolve the divergence.
//   • Image text is tightly paraphrased from Agrippa's own wording, one concise
//     sentence per face, preserving the figure + the virtue it signifies.
//   • Framing: this is HISTORICAL magical iconography, described not prescribed.
// ============================================================================

import { FACES } from './dignities-data.js';
import { SIGNS } from '../astro.js';

// ---------------------------------------------------------------------------
//  Per-face image data, in zodiac order: Aries d1,d2,d3, Taurus d1,d2,d3, …
//  Each row: [image (Agrippa II.37), keywords, imageAlt (Picatrix II.11 if it
//  notably differs, else null)].
// ---------------------------------------------------------------------------
const FACE_IMAGES = [
  // ----- Aries -----
  ['A black man, restless, in a white garment, large-bodied and strong, with red eyes — boldness, fortitude and loftiness.',
    'boldness, fortitude', null],
  ['A woman clad in a red garment over white, raising one foot — nobility, height of a kingdom and greatness of dominion.',
    'dominion, nobility', null],
  ['A pale-white man with reddish hair, in a red garment, holding a golden bracelet and a wooden staff — restless, wit, meekness, joy and beauty.',
    'wit, beauty', null],

  // ----- Taurus -----
  ['A naked man, an archer, harvester or husbandman sowing and ploughing — granting the dividing of the earth by geometric rule.',
    'tilling, husbandry', null],
  ['A naked man holding a key — power, nobility and dominion over people.',
    'power, dominion', null],
  ['A man holding a serpent and a dart — the image of necessity and profit, and also of misery and slavery.',
    'necessity, slavery', null],

  // ----- Gemini -----
  ['A man holding a rod and serving another — wisdom, and the knowledge of numbers and of arts in which there is no profit.',
    'knowledge, service', null],
  ['A man with a pipe, and another digging the earth — infamous and dishonest agility, and painful, fruitless searchings.',
    'toil, vain searching', null],
  ['A man seeking arms, and a fool holding a bird and a pipe — forgetfulness, wrath, boldness, jests, scurrility and unprofitable words.',
    'folly, idle words', null],

  // ----- Cancer -----
  ['A young crowned virgin in fine clothes — acuteness of senses, subtlety of wit, and the love of men.',
    'love, subtlety',
    'Picatrix: a man with crooked fingers and a horse-like face, white feet, his body hung with fig-leaves — disputation, learning and love.'],
  ['A man in comely apparel, or a couple seated at a table playing — riches, mirth, gladness and the love of women.',
    'riches, mirth', null],
  ['A hunter with lance and horn leading dogs — contention, the pursuit of fugitives, and the taking of things by force of arms.',
    'pursuit, chase', null],

  // ----- Leo -----
  ['A man riding upon a lion — boldness, violence, cruelty, wickedness, lust and hard labours endured.',
    'boldness, violence', null],
  ['A crowned man with a drawn sword and a buckler, hands raised — hidden contentions, unknown victories, quarrels and battles.',
    'victory, contention', null],
  ['A young man holding a whip beside a very sorrowful man — love and society, and the loss of one’s right to avoid strife.',
    'love, concession', null],

  // ----- Virgo -----
  ['A good maiden, and a man casting seeds — the getting of wealth, ordering of diet, ploughing, sowing and peopling.',
    'gain, cultivation', null],
  ['A black man clothed in a skin, and a man with bushy hair holding a bag — gain, the scraping together of wealth and covetousness.',
    'wealth, covetousness', null],
  ['A white deaf woman, or an old man leaning on a staff — weakness, infirmity, loss of limbs, ruin of trees and depopulation of lands.',
    'weakness, decay', null],

  // ----- Libra -----
  ['An angry man with a pipe, and a man reading in a book — justifying and helping the weak and wretched against the powerful and wicked.',
    'justice, defence', null],
  ['Two furious men, and a comely man seated in a chair — indignation against evil, and quietness and security of life with plenty.',
    'security, plenty', null],
  ['A violent man with a bow, a naked man, and a man holding bread and a cup of wine — wicked lusts, singing, sport and gluttony.',
    'lust, gluttony', null],

  // ----- Scorpio -----
  ['A beautiful woman with two men striking her — comeliness and beauty, but also strife, treachery, deceit, detraction and ruin.',
    'strife, deceit',
    'Picatrix: a man holding a spear in his right hand and a serpent in his left — deceit and discord.'],
  ['A naked man, a naked woman, and a man holding two fighting dogs — impudence, deceit and false dealing, and stirring mischief and strife.',
    'deceit, discord', null],
  ['A man kneeling, and a woman striking him with a staff — drunkenness, fornication, wrath, violence and strife.',
    'violence, excess', null],

  // ----- Sagittarius -----
  ['An armed man holding a naked sword — boldness, malice and liberty.',
    'boldness, liberty', null],
  ['A woman, covered and weeping — sadness and fear concerning one’s own body.',
    'sorrow, fear', null],
  ['A man gold-coloured, or an idle man leaning on a staff — following one’s own will with obstinacy, and activity in evil, contention and horrible matters.',
    'obstinacy, contention', null],

  // ----- Capricorn -----
  ['A woman, and a man carrying full bags — going forth to gain and to lose, with weakness and baseness.',
    'gain and loss', null],
  ['Two women, and a man looking toward a bird flying in the air — seeking things that cannot be done and things that cannot be known.',
    'vain seeking', null],
  ['A chaste, wise woman, and a banker gathering money — governing in prudence, in covetousness of money and in avarice.',
    'prudence, avarice', null],

  // ----- Aquarius -----
  ['A prudent man, and a woman spinning — thought and labour for gain, in poverty and baseness.',
    'labour, poverty', null],
  ['A man with a long beard — understanding, meekness, modesty, liberty and good manners.',
    'understanding, manners', null],
  ['A black, angry man — insolence and impudence.',
    'insolence, impudence', null],

  // ----- Pisces -----
  ['A well-clothed man carrying burdens — journeys, change of place, and carefulness in getting wealth and clothes.',
    'journeys, getting', null],
  ['A well-adorned woman of good countenance — desiring and undertaking high and great matters.',
    'ambition, aspiration', null],
  ['A naked youth, and a beautiful maiden crowned with flowers — rest, idleness, delight, fornication and the embraces of women.',
    'rest, indulgence', null],
];

// ---------------------------------------------------------------------------
//  Assemble the 36 face records, reusing FACES for the rulers.
// ---------------------------------------------------------------------------
export const DECAN_FACES = (() => {
  const out = [];
  for (let s = 0; s < 12; s++) {
    for (let d = 0; d < 3; d++) {
      const [image, keywords, imageAlt] = FACE_IMAGES[s * 3 + d];
      const start = s * 30 + d * 10;
      const rec = {
        sign: SIGNS[s],
        signIndex: s,
        decan: d + 1,
        start,
        end: start + 10,
        ruler: FACES[s][d],
        image,
        keywords,
        source: imageAlt
          ? 'Agrippa, Three Books II.37; Picatrix II.11'
          : 'Agrippa, Three Books II.37'
      };
      if (imageAlt) rec.imageAlt = imageAlt;
      out.push(rec);
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
//  Lookup: the decan face containing an ecliptic longitude (degrees).
//  Returns the full record (image + ruler together). Pure.
// ---------------------------------------------------------------------------
export function faceOf(lon) {
  const norm = ((lon % 360) + 360) % 360;
  return DECAN_FACES[Math.floor(norm / 10)];
}
