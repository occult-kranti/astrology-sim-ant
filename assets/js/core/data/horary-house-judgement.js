// ============================================================================
//  horary-house-judgement.js — Lilly's Book II judged house by house. For each
//  of the twelve houses: which house signifies the matter, the natural
//  significators, what perfection between the significators MEANS for that
//  topic, the testimonies that affirm and that deny, and Lilly's own note —
//  the reference layer behind the live judgement reader (horary-judge.js).
//
//  Sourced from Christian Astrology Book II, with Lilly's chapter ranges. A
//  historical, pseudoscientific method, described for study, never prescribed.
// ============================================================================

export const HORARY_HOUSE_JUDGEMENT = [
  { n: 1, topic: 'The querent — life, health, journeys, self-undertakings',
    quesitedRule: 'The 1st house, its lord, the Ascendant degree and the Moon always signify the QUERENT and the body. For a pure self-question (Shall I live long? Am I in danger?), the 1st is also the quesited and is read against the malefic houses (6th sickness, 8th death) rather than a second party.',
    naturalSignificators: ['Sun', 'Moon'],
    perfectionMeaning: 'For a self-question, “perfection” is the lord of the 1st and the Moon coming to a good aspect of a fortune (Jupiter, Venus, or the well-dignified Sun) and AWAY from the lords of the 6th and 8th. Joining a benefic affirms safety; joining the lord of the 8th or being besieged denies it.',
    affirmative: ['Lord of the 1st strong, direct, swift and free from combustion', 'Lord of the 1st angular or in the 1st/10th/11th', 'Ascendant, its lord, and the Moon separating from a malefic and applying to a fortune', 'A benefic in the 1st, or a fortune casting a sextile/trine to the Ascendant'],
    negative: ['Lord of the 1st combust, retrograde, cadent (6th/8th/12th) or peregrine unreceived', 'Lord of the 1st applying to the lord of the 8th or to a malefic without reception', 'Saturn/Mars in the 1st or close hard aspect to the Ascendant; South Node on the Ascendant', 'Moon void of course, combust, or afflicted in the via combusta'],
    lillyNote: 'Lilly begins every figure by judging whether it is fit to be judged and the radical strength of the querent — the Ascendant, its lord and the Moon are the querent’s body and mind, and their condition colours the whole question.',
    citation: 'Lilly, Christian Astrology Book II, ch. XV & the general method of the 1st house.' },

  { n: 2, topic: 'Wealth, money lent, profit & loss, recovery of goods',
    quesitedRule: 'The 2nd, its lord, the planets in it, the Part of Fortune and the Moon signify the querent’s substance and movable goods. For money LENT, the borrower is the lord of the 7th and the money his 2nd (the radical 8th); recovery is the lord of the 1st/2nd receiving the light back.',
    naturalSignificators: ['Jupiter', 'Part of Fortune'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 2nd (or the Moon translating the lord of the 2nd to the lord of the 1st) means the money comes to hand. A strong applying aspect with reception promises it fully; a hard aspect with reception, with labour; no contact, the substance slips away.',
    affirmative: ['Lords of the 1st and 2nd applying by sextile/trine/conjunction, especially with mutual reception', 'Part of Fortune well placed and aspected by Jupiter or its dispositor strong', 'The Moon translating light from the lord of the 2nd to the lord of the 1st', 'A fortune in the 2nd, or the lord of the 2nd in the 1st/10th/11th'],
    negative: ['Lord of the 2nd combust, retrograde, cadent or in the 6th/8th/12th unreceived', 'Part of Fortune combust or with the malefics; the lord of the 2nd weak and afflicted', 'Prohibition or refranation cutting off the aspect of the two lords', 'Moon void of course, or applying to the lords of the 8th/12th (debt and enemies eat up the estate)'],
    lillyNote: 'Lilly judges riches from the 2nd, its lord, the planets there, the Part of Fortune and the Moon — looking always for whether the lords of the 1st and 2nd, or the Moon, join in good aspect with reception, the surest token the money comes home.',
    citation: 'Lilly, Christian Astrology Book II, ch. XVI–XVII (of money & money lent).' },

  { n: 3, topic: 'Brethren, kindred, neighbours, short journeys, rumours & letters',
    quesitedRule: 'The 3rd and its lord signify brethren, kindred, neighbours, short inland journeys, letters and rumours. For a NAMED sibling the matter may be turned to that person’s house. A rumour’s truth is read from the Moon, Mercury and the angularity/stability of the significators.',
    naturalSignificators: ['Mercury', 'Moon'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 3rd shows agreement with the brother/neighbour and a safe short journey; a good aspect with reception affirms concord, a hard aspect shows it bought with strife.',
    affirmative: ['Lords of the 1st and 3rd in sextile/trine or mutual reception — concord', 'A benefic in the 3rd, or the lord of the 3rd strong, angular and direct — a safe journey', 'For a rumour: significators (esp. Moon & Mercury) in fixed signs, well-placed and direct — the report is TRUE'],
    negative: ['Lords of the 1st and 3rd in square/opposition without reception — discord with kindred', 'A malefic in the 3rd ill-dignified, or the lord of the 3rd combust/retrograde — quarrels or a troubled journey', 'For a rumour: significators in movable signs, swift, cadent, or the Moon void with Mercury combust — the report is FALSE'],
    lillyNote: 'Lilly reads agreement among kindred from the aspect and reception between the lords of the 1st and 3rd, and judges a rumour true when the significators are fixed, angular and strong, false when movable, cadent and the Moon is void.',
    citation: 'Lilly, Christian Astrology Book II, ch. XVIII (of brethren, short journeys, rumours).' },

  { n: 4, topic: 'Fathers, lands & houses, buying/selling estate, hidden things, the END of any matter',
    quesitedRule: 'The 4th, its lord and the planets there signify the father, lands, houses, inheritances, the quality of ground, and the END of every question. For buying land: 1st = buyer, 7th = seller, 10th = price, 4th = the land. For a thing hidden, the 4th shows the place.',
    naturalSignificators: ['Saturn', 'Sun'],
    perfectionMeaning: 'In a purchase, perfection between the lord of the 1st (buyer) and the lord of the 4th (the land), or the Moon translating to it, means the querent obtains the estate. Where the question is the END of a matter, the lord of the 4th and the planet there show how it concludes — well if a fortune, ill if an afflicted malefic.',
    affirmative: ['Lords of the 1st and 4th applying by good aspect with reception — the land is obtained and held', 'A benefic in the 4th, or the lord of the 4th strong and angular — good ground', 'For buying: lords of the 1st, 7th, 10th and 4th in agreement and the Part of Fortune well placed'],
    negative: ['Lord of the 4th combust, retrograde, peregrine or afflicted — bad ground, defective title', 'Saturn/Mars ill-dignified in the 4th — barren land or a ruinous end of the matter', 'Lords of the 1st and 4th in hard aspect without reception, or prohibited — the purchase fails'],
    lillyNote: 'Lilly takes the 4th for lands, the father, and the end of all things; in buying he sets buyer to the 1st, seller to the 7th, price to the 10th and land to the 4th, and looks for agreement among their lords. The 4th always declares how the question finally ends.',
    citation: 'Lilly, Christian Astrology Book II, ch. XIX–XXI (of the father, lands, things hidden).' },

  { n: 5, topic: 'Children, pregnancy, the sex & time of delivery; messengers, pleasures, gaming',
    quesitedRule: 'The 5th, its lord, Jupiter and Venus, the Moon, and fruitful/barren signs on the cusp signify children and conception. Whether a woman is with child, the sex, and the time of delivery are judged from the 5th, the Moon and the fruitfulness of the signs. The 5th is also the father’s wealth (2nd from the 4th).',
    naturalSignificators: ['Jupiter', 'Venus', 'Moon'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 5th (or the Moon joining the lord of the 5th, Jupiter or Venus) with fruitful signs argues children come, or the woman has conceived. Barren signs, a weak lord of the 5th, or no perfection argue no issue or peril to the child.',
    affirmative: ['Fruitful signs (Cancer, Scorpio, Pisces) on the Ascendant or 5th, with the Moon or its lord there', 'Lords of the 1st and 5th in good aspect with reception; Jupiter or Venus in the 1st/5th well-dignified', 'The Moon strong, increasing, applying to Jupiter, Venus or the lord of the 5th'],
    negative: ['Barren signs (Gemini, Leo, Virgo) on the Ascendant and 5th — denial of children', 'Saturn/Mars in the 5th ill-dignified or afflicting the lord of the 5th and the Moon', 'Lord of the 5th combust, retrograde, cadent; the Moon applying to the lords of the 8th/12th — miscarriage'],
    lillyNote: 'Lilly judges issue from the 5th, its lord, Jupiter and Venus and the Moon, weighing heavily whether the signs on the angles and the 5th are fruitful or barren.',
    citation: 'Lilly, Christian Astrology Book II, ch. XXII–XXIII (of children, of a woman with child).' },

  { n: 6, topic: 'Sickness — its nature, cause & curability (the decumbiture); servants & small cattle',
    quesitedRule: 'In sickness the 1st and its lord and the Moon are the SICK PARTY (body and vitality), the 6th and its lord and the planets there are the DISEASE, and the 8th is death. The 4th shows the end (grave or recovery), the 10th the physician, the 7th the cure. For a servant or small beast, the 6th is that directly.',
    naturalSignificators: ['Mars', 'Saturn'],
    perfectionMeaning: 'Here perfection is INVERTED: a hard application of the lord of the 6th (the disease) onto the lord of the 1st or the Moon, joining the patient to the malady, argues the sickness takes hold. RECOVERY is shown when the lord of the 1st and the Moon are strong and free and SEPARATE from the lord of the 6th and the malefics, applying instead to a fortune or the lord of the 10th (the medicine).',
    affirmative: ['Lord of the 1st strong, direct, free, separating from the lord of the 6th — RECOVERY', 'Moon strong, increasing, applying to a fortune or to the lord of the 10th (physician/medicine)', 'Lord of the 6th (the disease) weak, cadent, retrograde or combust — the malady abates'],
    negative: ['Lord of the 1st combust, retrograde, cadent, or applying to the lord of the 8th — danger of death', 'Lord of the 6th strong and overcoming the lord of the 1st, or joining the Moon by hard aspect', 'Moon void, combust, in via combusta, or applying to the lords of the 6th/8th/12th'],
    lillyNote: 'In the decumbiture Lilly sets the sick to the Ascendant, its lord and the Moon, the disease to the 6th, death to the 8th — recovery follows when the lord of the 1st and the Moon are strong and free and turn AWAY from the malefics. He warns the judge to be tender, never to pronounce death rashly.',
    citation: 'Lilly, Christian Astrology Book II, ch. XXIV–XXXVII (of sickness, servants, cattle).' },

  { n: 7, topic: 'Marriage & love; lawsuits & open enemies; theft & the thief; war; fugitives',
    quesitedRule: 'The 7th, its lord and the Moon signify whoever the querent contends with or seeks: the spouse/beloved (Venus for the woman, Mars/Sun for the man), the open enemy, the defendant, the opposing army, the thief, the seller in trade, the physician, the absent/fugitive party.',
    naturalSignificators: ['Venus', 'Mars', 'Moon'],
    perfectionMeaning: 'For MARRIAGE & love, perfection between the lords of the 1st and 7th (or the Moon translating), especially with mutual reception, affirms the match; a hard aspect with reception makes it with strife, none denies it. For a CONTEST (lawsuit, enemy, war, theft) perfection only JOINS the parties — victory goes to the STRONGER significator, better dignified, angular, and aspecting the angles.',
    affirmative: ['MARRIAGE: lords of the 1st and 7th applying with mutual reception, or the Moon translating; Venus strong', 'MARRIAGE: a benefic in the 7th, loving signs on the angles, the two lords in trine/sextile', 'CONTEST: the lord of the 1st stronger by dignity, angular, direct, aspecting the 10th and 1st — the querent prevails'],
    negative: ['MARRIAGE: lords of the 1st and 7th in square/opposition without reception, or prohibition — the match breaks off', 'MARRIAGE: a malefic in the 7th ill-dignified, Venus combust, the Moon void or with the South Node', 'CONTEST: the lord of the 7th the stronger and better placed — the adversary prevails'],
    lillyNote: 'Lilly’s 7th is the great house of partnership and contention; for marriage he requires perfection and prizes mutual reception, which “maketh love and concord though by hard aspect.” In lawsuits, war and theft he reverses the sense: perfection only brings the parties to grips, and victory belongs to the stronger, better-placed significator.',
    citation: 'Lilly, Christian Astrology Book II, ch. XXXVIII–XLVII (marriage, war, things lost & stolen, fugitives).' },

  { n: 8, topic: 'Death & its kind; the partner’s estate, dowry, legacies; the absent alive or dead; fear & anguish',
    quesitedRule: 'The 8th, its lord, Saturn and the Moon signify death, its manner, fear and anguish, wills and legacies, and the partner’s money (the 2nd from the 7th — the dowry). For “is the absent alive or dead?” read the absent person’s significator — its strength argues life, its fall into the 8th or affliction by the lord of the 8th argues death.',
    naturalSignificators: ['Saturn', 'Moon'],
    perfectionMeaning: 'Perfection is INVERTED and grave: the party’s significator applying to the lord of the 8th, falling into the 8th, or combust and besieged, argues death; remaining strong, angular, direct and free argues the party LIVES. For a legacy, perfection between the lord of the 1st and the lord of the 8th means the inheritance is obtained.',
    affirmative: ['FOR LIFE: the party’s significator strong, angular, direct, free from the lord of the 8th and the malefics', 'FOR LEGACY: lords of the 1st and 8th in good aspect with reception, or the Moon translating to the lord of the 8th', 'The lord of the 8th weak and cadent in a life-question — death is remote'],
    negative: ['FOR DEATH: the significator combust, falling into the 8th, or applying to the lord of the 8th by hard aspect', 'FOR DEATH: Saturn or the lord of the 8th afflicting the lord of the 1st and the Moon; the significator besieged', 'FOR LEGACY: the lord of the 8th combust/retrograde, or hard-aspecting the lord of the 1st without reception'],
    lillyNote: 'Lilly reads the 8th for death, the manner of dying, and the wife’s portion. He cautions gravity above all — death is judged from the significator falling under the lord of the 8th or into the 8th, but the judge must weigh every testimony and never pronounce a sentence of death lightly.',
    citation: 'Lilly, Christian Astrology Book II, ch. XLVIII–XLIX (of death, the dowry, the absent).' },

  { n: 9, topic: 'Long voyages overseas; religion & the clergy; learning & science; dreams; church livings',
    quesitedRule: 'The 9th, its lord, Jupiter and the Moon signify long sea voyages, religion and churchmen, learning, dreams, and church livings. For a benefice the 9th is the living and its lord the gift; for a voyage the 1st and Moon are the traveller and the 9th the journey.',
    naturalSignificators: ['Jupiter', 'Sun'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 9th (or the Moon joining the lord of the 9th or Jupiter) affirms a prosperous voyage, a benefice obtained, or success in learning. For a dream, the lord of the 9th and the Moon strong argue the vision is TRUE, weak and afflicted, vain.',
    affirmative: ['Lords of the 1st and 9th in good aspect with reception; Jupiter strong, aspecting the 9th', 'The lord of the 9th angular, direct, swift, free — a prosperous voyage and safe return', 'For a dream: significators in fixed signs, the Moon and the lord of the 9th strong — the dream is TRUE'],
    negative: ['Lord of the 9th combust, retrograde, cadent, or in the 6th/8th/12th — a dangerous or fruitless voyage', 'A malefic in the 9th afflicting the lord of the 1st and the Moon — peril at sea, failure', 'For a dream: movable signs, the Moon void or afflicted, Mercury combust — the dream is FALSE'],
    lillyNote: 'Lilly judges long voyages from the 1st and the Moon (the traveller) and the 9th and its lord (the journey), looking that all be strong and free for a happy return; a dream he calls true when the significators are fixed, strong and well-placed.',
    citation: 'Lilly, Christian Astrology Book II, ch. L–LI (of long journeys, religion, dreams).' },

  { n: 10, topic: 'Honour, office, dignity & preferment; the profession; the mother; kings & magistrates',
    quesitedRule: 'The 10th, its lord, the Sun (honour and kings) and Jupiter, with the Moon, signify dignity, office, preferment, command, the trade one is fit for, and the mother. The lord of the 10th, the planet near the MC, or the planet rising before the Sun, show the profession.',
    naturalSignificators: ['Sun', 'Jupiter'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 10th (or the Moon translating to the lord of the 10th or the Sun) — the significators strong and ANGULAR — means the querent obtains the office. The stronger the lord of the 10th and the Sun, the greater and more lasting the dignity.',
    affirmative: ['Lords of the 1st and 10th applying by good aspect with reception, both angular and strong', 'The Sun and/or Jupiter strong, angular, aspecting the 10th; a fortune in the 10th', 'The Moon translating light to the lord of the 10th or the Sun — the dignity is conferred'],
    negative: ['Lord of the 10th combust, retrograde, cadent, or peregrine unreceived — the office is denied or soon lost', 'A malefic in the 10th ill-dignified afflicting the lord of the 1st; the Sun combust', 'Lords of the 1st and 10th in hard aspect without reception, or prohibition cutting the suit off'],
    lillyNote: 'Lilly judges preferment from the lords of the 1st and 10th, the Sun and Jupiter, requiring the significators strong and angular for the dignity to be obtained and to last. The planet upon or nearest the Midheaven, or rising just before the Sun, declares the trade the querent is fitted for.',
    citation: 'Lilly, Christian Astrology Book II, ch. LII–LIII (of preferment, office, profession, the mother).' },

  { n: 11, topic: 'Friends & friendship; the thing hoped or wished for; the favour of the great',
    quesitedRule: 'The 11th, its lord, Jupiter, the Part of Fortune and the Moon signify friends, the trust placed in them, and the thing HOPED for. For “shall I obtain my hope?” the 11th is the hope itself; for “is this a true friend?” read the lord of the 11th and its aspect to the lord of the 1st.',
    naturalSignificators: ['Jupiter', 'Part of Fortune'],
    perfectionMeaning: 'Perfection between the lords of the 1st and 11th (or the Moon joining the lord of the 11th, Jupiter or the Part of Fortune) means the hope is ATTAINED and the friend is true. A good aspect with reception affirms it fully; a hard aspect, with trouble; no perfection denies the hope or shows the friend false.',
    affirmative: ['Lords of the 1st and 11th in good aspect with reception, or in the same sign — the hope is obtained', 'Jupiter or the Part of Fortune strong and well placed, aspecting the 11th; a fortune in the 11th', 'The Moon translating light to the lord of the 11th or Jupiter — the wish is granted'],
    negative: ['Lord of the 11th combust, retrograde, cadent, or afflicted — the hope fails, the friend is false', 'Lords of the 1st and 11th in hard aspect without reception, or prohibition — the wish miscarries', 'A malefic in the 11th ill-dignified, or the Part of Fortune afflicted — disappointed hope, treachery'],
    lillyNote: 'Lilly reads hopes and friends from the 11th, its lord, Jupiter and the Part of Fortune, and judges the hope attained when the lords of the 1st and 11th, or the Moon, perfect by good aspect with reception.',
    citation: 'Lilly, Christian Astrology Book II, ch. LIV (of friends and the thing hoped for).' },

  { n: 12, topic: 'Secret (unnamed) enemies; imprisonment & deliverance; witchcraft; great cattle; self-undoing',
    quesitedRule: 'The 12th, its lord, Saturn and the Moon signify private and unnamed enemies, imprisonment, witchcraft, great cattle, tribulation, and self-undoing. For a NAMED secret enemy the matter is turned to that person’s house. For a prisoner: the 1st and its lord and the Moon are the prisoner, the 12th the restraint.',
    naturalSignificators: ['Saturn', 'Mars'],
    perfectionMeaning: 'Perfection is INVERTED: the lord of the 12th (the secret enemy or the imprisonment) applying to or overcoming the lord of the 1st and the Moon argues the private harm takes hold, or the captivity continues. DELIVERANCE is shown when the lord of the 1st and the Moon are strong, free, and SEPARATE from the lord of the 12th and the malefics.',
    affirmative: ['Lord of the 1st strong, direct, angular, separating from the lord of the 12th and the malefics — escape', 'The Moon strong, free, applying to a fortune or to an angle — release from prison or trouble', 'The lord of the 12th (the enemy) weak, cadent, combust, retrograde — powerless to harm'],
    negative: ['The lord of the 12th overcoming the lord of the 1st, or joining the Moon by hard aspect — the harm prevails', 'Lord of the 1st combust, retrograde, cadent, or in the 12th — captivity, sorrow, self-undoing', 'Saturn/Mars ill-dignified in the 12th afflicting the lord of the 1st and the Moon — danger from hidden foes'],
    lillyNote: 'Lilly’s 12th is the house of secret enemies, imprisonment, witchcraft and self-undoing; deliverance is read when the lord of the Ascendant and the Moon are strong and free and separate from the lord of the 12th and the infortunes toward a fortune or an angle.',
    citation: 'Lilly, Christian Astrology Book II, ch. LV (of secret enemies, a prisoner, great cattle).' },
];

export const byHouse = n => HORARY_HOUSE_JUDGEMENT.find(h => h.n === n);
