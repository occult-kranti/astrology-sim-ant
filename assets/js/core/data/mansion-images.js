// ============================================================================
//  mansion-images.js — the talismanic IMAGE per lunar mansion (HISTORICAL STUDY).
//
//  DESCRIBED, NOT PRESCRIBED. Medieval astral magic is a pseudoscience with no
//  demonstrated validity; this records the historical text for study only.
//  Materials flagged HISTORICAL-ONLY (animal parts, asafoetida, brimstone,
//  quicksilver/argent vive, etc.) are reproduced because the source lists them —
//  they are NOT to be made or used.
//
//  num/name match data/lunar-mansions.js (Mansion 1 = Al Sharatain / "Alnath" at
//  0° Aries). `image` = the figure the tradition says to engrave (1 sentence);
//  `purpose` = the stated effect; `material` = the suffumigation/material if named
//  (HISTORICAL-ONLY where flagged); `note` = where the two sources diverge.
//
//  SOURCES: Agrippa, Three Books of Occult Philosophy II.46 (primary, verbatim);
//  Picatrix (Ghāyat al-Ḥakīm) IV.9 (parallel), Greer–Warnock. Mansion images are
//  WELL-ATTESTED (Agrippa is translating the Picatrix here). Mansion 22 rests on
//  Agrippa alone (a lacuna in Picatrix) — flagged; Mansion 11 genuinely diverges.
// ============================================================================

export const MANSION_IMAGES = [
  { num: 1, name: 'Al Sharatain', image: 'A black man clothed in a hair garment and girdled, casting a small lance.', purpose: 'Destruction or discord against a person.', material: 'Suffumigation: liquid storax.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 2, name: 'Al Butain', image: 'A crowned king.', purpose: 'Against the wrath of a prince; reconciliation with him.', material: 'Suffumigation: lignum aloes (Picatrix: a figure of white wax & mastic).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 3, name: 'Al Thurayya', image: 'A well-clothed woman seated in a chair, her right hand raised to her head.', purpose: 'Gives good fortune and every good thing.', material: 'Suffumigation: musk, camphor, calamus aromaticus.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 4, name: 'Al Dabaran', image: 'A soldier seated on a horse, holding a serpent in his right hand.', purpose: 'Revenge, separation, enmity and ill will.', material: 'Suffumigation: red myrrh and storax.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 5, name: "Al Haq'ah", image: 'The head of a man (without a body).', purpose: 'Favour of kings and officers; good entertainment.', material: 'Suffumigation: sandalwood (Picatrix: an image in silver).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 6, name: "Al Han'ah", image: 'Two figures embracing one another.', purpose: 'Procure love between two.', material: 'Suffumigation: lignum aloes and amber.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 7, name: 'Al Dhira', image: 'A well-clothed man holding his hands up to heaven as if praying.', purpose: 'Obtain every good thing.', material: 'Suffumigation: sweet odours.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 8, name: 'Al Nathrah', image: 'An eagle having the face of a man.', purpose: 'Victory in war.', material: 'Suffumigation: brimstone (HISTORICAL-ONLY).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 9, name: 'Al Tarf', image: 'A man lacking his privy parts, covering his eyes with his hands.', purpose: 'Cause infirmities / weakness (malefic).', material: 'Suffumigation: rosin of the pine (Picatrix: an image of lead).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 10, name: 'Al Jabhah', image: 'The head of a lion.', purpose: 'Facilitate childbearing; cure the sick.', material: 'Suffumigation: amber (Picatrix: an image of gold or latten).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 11, name: 'Al Zubrah', image: 'A man riding a lion, gripping its ear in his left hand, holding forth a gold bracelet in his right.', purpose: 'Fear, reverence and worship.', material: 'Suffumigation: sweet odours and saffron.', citation: 'Agrippa II.46; Picatrix IV.9', note: 'DIVERGE: Agrippa = a gold bracelet in the right hand; Picatrix = a lance.' },
  { num: 12, name: 'Al Sarfah', image: 'A dragon fighting with a man.', purpose: 'Separation of lovers.', material: "Suffumigation: hairs of a lion and asafoetida (HISTORICAL-ONLY).", citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 13, name: 'Al Awwa', image: 'A man of red wax and a woman of white wax made to embrace one another.', purpose: 'Agreement of married couples; dissolving of charms.', material: 'Suffumigation: lignum aloes and amber.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 14, name: 'Al Simak', image: 'A dog biting its own tail.', purpose: 'Divorce / separation of man from woman.', material: 'Suffumigation: hair of a black dog and a black cat (HISTORICAL-ONLY).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 15, name: 'Al Ghafr', image: 'A man seated, writing or composing letters.', purpose: 'Obtain friendship and good will.', material: 'Suffumigation: frankincense and nutmeg.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 16, name: 'Al Jubana', image: 'A man seated on a chair, holding a balance (scales).', purpose: 'Gain much by merchandising.', material: 'Suffumigation: well-smelling spices (Picatrix: on a silver plate).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 17, name: 'Al Iklil', image: 'An ape.', purpose: 'Against thieves and robbers.', material: 'Suffumigation: hair of an ape (HISTORICAL-ONLY; Picatrix: an iron seal).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 18, name: 'Al Qalb', image: 'A snake holding its tail above its head.', purpose: 'Against fevers and pains of the belly.', material: "Suffumigation: hart's horn (HISTORICAL-ONLY; Picatrix: an image of wax).", citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 19, name: 'Al Shaulah', image: 'A woman holding her hands upon her face.', purpose: 'Facilitate birth; provoke the menses.', material: 'Suffumigation: liquid storax (Picatrix: a brass seal).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 20, name: "Al Na'am", image: 'A sagittary — half man, half horse (with a bow).', purpose: 'Hunting.', material: 'Suffumigation: head of a wolf (HISTORICAL-ONLY).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 21, name: 'Al Baldah', image: 'A man with a double countenance, before and behind.', purpose: 'Destruction or ruin of someone.', material: "Suffumigation: brimstone and jet (HISTORICAL-ONLY); kept in a brass box with the subject's hair.", citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 22, name: "Al Sa'd al Dhabih", image: 'A man with wings on his feet, bearing a helmet on his head (a Mercury-like figure).', purpose: 'Security and safety of runaways and fugitives.', material: 'Suffumigation: argent vive (quicksilver — HISTORICAL-ONLY, toxic).', citation: 'Agrippa II.46 (Picatrix lacuna)', note: 'UNCERTAIN: the Picatrix mansion text has a lacuna here; the image rests on Agrippa alone.' },
  { num: 23, name: "Al Sa'd al Bula", image: "A cat having a dog's head.", purpose: 'Destruction and wasting.', material: "Suffumigation: hairs of a dog's head (HISTORICAL-ONLY; Picatrix: an iron seal).", citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 24, name: "Al Sa'd al Su'ud", image: 'A woman giving suck to her son (nursing).', purpose: 'Multiplying of herds of cattle.', material: "Sealed in a ram's horn.", citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 25, name: "Al Sa'd al Akhbiyah", image: 'A man in the act of planting trees.', purpose: 'Preservation of trees and harvests.', material: 'Sealed in fig-tree wood; suffumigation: flowers of the fig-tree.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 26, name: 'Al Fargh al Muqaddam', image: 'A woman washing and combing her hair.', purpose: 'Love and favour.', material: 'Suffumigation: things smelling very sweet.', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 27, name: "Al Fargh al Mu'akhkhar", image: 'A winged man holding in his hand an empty, perforated vessel.', purpose: 'Destroy fountains, pits, medicinal waters and baths.', material: 'Suffumigation: asafoetida and liquid storax (HISTORICAL-ONLY).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
  { num: 28, name: 'Al Batn al Hut', image: 'A fish.', purpose: 'Gather fishes together.', material: 'Suffumigation: skin of a sea-fish (HISTORICAL-ONLY; Picatrix: a brass seal).', citation: 'Agrippa II.46; Picatrix IV.9', note: '' },
];
export const MANSION_IMAGES_SOURCE = 'Agrippa, Three Books of Occult Philosophy II.46 (the images of the mansions of the Moon) + Picatrix IV.9 (parallel), Greer–Warnock. Historical text recorded for study, described — never prescribed; flagged materials are HISTORICAL-ONLY.';

// The talismanic image for a mansion number (1..28), or null.
export function mansionImage(num) { return MANSION_IMAGES[(num - 1) % 28] || null; }
