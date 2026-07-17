// ============================================================================
//  bhava-phala.js — the planet-in-bhāva delineation corpus (the U5 / T17 data).
//  GENERATED from the three verified, byte-locked delineation JSONs
//  (scratchpad/r28data/delineation-{1,2,3}.json) by
//  scratchpad/r28build/gen-bhava-phala.mjs — DO NOT hand-edit record bodies.
//
//  108 records = 9 grahas × 12 bhāvas. Two witnesses PER record, kept SIDE BY
//  SIDE and NEVER merged: Phaladīpikā ch. 8 (Mantreśvara, the backbone) and
//  Sārāvalī ch. 30 (Kalyāṇavarman, the second witness). Sārāvalī ch. 30 covers
//  only the Sun through Saturn; the Rāhu/Ketu records are therefore SINGLE-
//  WITNESS (Phaladīpikā 8.25–33) with an honest {locus:null,...,note} absence
//  object and agreement:null. Every 'summary' is ORIGINAL PROSE reporting what
//  the text claims — a historical symbolic system with NO demonstrated validity;
//  the harsh deterministic judgments are reproduced unsoftened for fidelity to
//  the sources and describe nothing about any actual person.
//
//  Record shape: { graha, bhava, phaladipika:{locus,summary},
//    saravali:{locus,summary}|{locus:null,summary:null,note},
//    agreement:'agree'|'partial'|'contradict'|null, contradictionNote,
//    sensitiveNote, sources:[...] }.
// ============================================================================

export const BHAVA_PHALA_META = {
  witnesses: {
    phaladipika: 'Mantreśvara, Phaladīpikā adhyāya 8 — S.S. Sareen trans. (working edition); numbering per the Sastri/wisdomlib scheme, cross-checked G.S. Kapoor.',
    saravali: 'Kalyāṇavarman, Sārāvalī ch. 30 "Effects of Planets in Bhavas" — R. Santhanam trans., Ranjan Publications 1983; covers Sun through Saturn only (no node-in-bhāva verses).',
  },
  agreementValues: ['agree', 'partial', 'contradict', null],
  recordCount: 108,
  note: 'Framing: historical doctrine, described never prescribed, no demonstrated validity. Sārāvalī does not treat the nodes in houses; those records are single-witness by the text\'s own scope.',
};

export const BHAVA_PHALA = [
  {
    "graha": "Sun",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.1",
      "summary": "The Sun rising gives scanty hair, a lazy yet hot and impetuous temper, a tall lean body, soiled eyes, cruelty, impatience and valour. The same verse adds sign-riders: eye disease if Aries rises, cataract in Cancer, night-blindness in Leo, and poverty with loss of children in Libra."
    },
    "saravali": {
      "locus": "30.2",
      "summary": "The rising Sun makes the native thin-haired, lazy, wrathful, imposing in personality but coarse-bodied and weak-sighted, honourable, courageous, impatient and unkind. Sign-riders follow: swollen eyes in Cancer, weak sight in Aries, night-blindness in Leo, and poverty with loss of children in Libra."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert loss of children under the Libra condition and impaired sight under others. These are historical doctrinal claims with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.1 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.2 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.2",
      "summary": "A curt, wholly negative verdict on the house of wealth and speech: the native is devoid of learning, shameless, and afflicted with stammering speech. The text concedes nothing favourable at all to this placement of the Sun."
    },
    "saravali": {
      "locus": "30.3",
      "summary": "The native is endowed with servants and quadrupeds, but suffers diseases of the face, is deprived of happiness and wealth, and loses his money through the king's displeasure or through thieves — comfort conceded, then stripped away."
    },
    "agreement": "partial",
    "contradictionNote": "Phaladipika attacks speech and learning (stammering, shamelessness, no education); Saravali instead attacks wealth and the face (facial disease, losses to king and thieves) while granting servants and cattle. The two harms occupy different domains, sharing only the negative overall verdict.",
    "sensitiveNote": "The claims of facial disease and financial ruin are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.2 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.3 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.2",
      "summary": "Strength, valour, wealth and generosity are granted, but the native has hostile relations with his own kinsmen — the third-house Sun empowers the person at the expense of the sibling relationships the house itself governs."
    },
    "saravali": {
      "locus": "30.4",
      "summary": "Valorous, strong, dear to people, good-looking, very learned, a conqueror of his enemies — yet he loses his co-born: every personal excellence is granted while the siblings signified by the house are destroyed."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Saravali's claim of the loss of siblings (and Phaladipika's of enmity with kin) is a historical doctrinal statement with no demonstrated validity, reproduced for fidelity to the sources; it describes nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.2 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.4 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.2",
      "summary": "The native is bereft of happiness and comfort, of relations, lands, friends and house; he enters the king's (government) service and squanders away whatever ancestral property comes down to him."
    },
    "saravali": {
      "locus": "30.5",
      "summary": "Devoid of conveyances and relatives, the native suffers heart disease, destroys his paternal house and wealth, and serves a bad king — the fourth-house comforts of home and inheritance are dismantled one by one."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Saravali adds a claim of heart disease. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.2 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.5 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.3",
      "summary": "Short-tempered and deprived of happiness, wealth and children, the native is nonetheless intelligent; he wanders in forest regions — the putra-bhava Sun strips away the very significations of the house it occupies."
    },
    "saravali": {
      "locus": "30.6",
      "summary": "Bereft of happiness, sons and wealth, the native lives by husbandry, moves among hills and fortresses, and is fickle-minded, scholarly, devoid of bodily strength — and short-lived."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "The texts assert deprivation of children and (in Saravali) a short life. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.3 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); 5th-house inclusion in sloka 3 verified in the 1961 KRI printing of the Sastri translation (archive.org); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.6 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.3",
      "summary": "An emphatically favourable placement: the native becomes a king, earns renown, is equipped with praiseworthy qualities, grows wealthy, and is fully capable of overcoming his enemies in the house of enemies."
    },
    "saravali": {
      "locus": "30.7",
      "summary": "The native is very libidinous, has powerful digestive fire, and is strong, affluent and famous for his virtues; he becomes either a king or the chief of an army."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.3 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.7 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.3",
      "summary": "The native suffers the wrath of the king, has a deformed body, wanders, and endures humiliation from others; he is without a wife — the marriage house is judged wholly afflicted by the Sun."
    },
    "saravali": {
      "locus": "30.8",
      "summary": "Poor and insulted, the native suffers bodily diseases, royal displeasure and even imprisonment; he takes to bad ways and is not well-disposed toward his own wife."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "The texts assert marital deprivation or discord, bodily affliction and (in Saravali) imprisonment. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.3 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.8 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.3",
      "summary": "The native is deprived of wealth and friends, is short-lived, and suffers defective eyesight — he can be blind altogether. The verdict is brief and unrelievedly harsh, with no compensating clause."
    },
    "saravali": {
      "locus": "30.9",
      "summary": "Deformed eyes, deprivation of wealth and happiness, a short life, and separation from his relatives — the eighth-house Sun receives one of the chapter's starkest condemnations."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert a short life and damaged or lost eyesight. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.3 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.9 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.4",
      "summary": "The native is likely to suffer the loss of his father, but he keeps children and relations, and shows due reverence for gods and Brahmins — bereavement of the father set beside intact piety and progeny."
    },
    "saravali": {
      "locus": "30.10",
      "summary": "Endowed with wealth, children and friends, the native is deeply interested in worshipping gods and Brahmins, but is not well-disposed toward his father and his wife, and is never calm."
    },
    "agreement": "partial",
    "contradictionNote": "Both witnesses grant children and piety and both turn the placement against the father — but differently: Phaladipika asserts the father's early loss, while Saravali asserts the native's ill-disposition toward a living father (and toward the wife). Bereavement in one text, estrangement in the other.",
    "sensitiveNote": "Phaladipika's claim of the father's loss is a historical doctrinal statement with no demonstrated validity, reproduced for fidelity to the sources; it describes nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.4 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.10 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.4",
      "summary": "A grand verdict: blessed with sons and the comfort of conveyances, praised for his good conduct, endowed with intelligence, wealth, strength and fame — the native becomes a king."
    },
    "saravali": {
      "locus": "30.11",
      "summary": "Extremely intelligent, rich and strong, the native is endowed with conveyances, relatives and sons, succeeds in his undertakings, and is valorous, unconquerable and great — an unqualified triumph."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.4 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.11 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.4",
      "summary": "The native is made very wealthy and long-lived; he becomes a king with everlasting happiness and no sorrow — the gain-house Sun receives royal, sorrowless splendour in this text."
    },
    "saravali": {
      "locus": "30.12",
      "summary": "The native is interested in gathering money and is strong, modest and successful in his undertakings — but he hates others, lacks servants, is himself a servant, and is devoid of affection."
    },
    "agreement": "contradict",
    "contradictionNote": "A genuine clash. Phaladipika promises kingship, great wealth and a sorrowless long life; Saravali concedes money-gathering and success but makes the native a servant without servants of his own, affectionless and hating others. The eleventh-house Sun is glowing in one witness and soured in the other — both positions stand.",
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.4 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.12 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Sun",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.4",
      "summary": "The native bears hatred toward his father, suffers defective eyesight, and is devoid of both wealth and children — losses of sight, substance and lineage delivered together in the house of loss."
    },
    "saravali": {
      "locus": "30.13",
      "summary": "Deformed in physique, one-eyed and morally fallen, the native marries a barren woman, is inimical to his father, and remains weak and mean — the chapter's harshest terms for the Sun."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "The texts assert childlessness — Saravali via the claim of marriage to a barren woman — and damaged sight. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.4 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.13 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.5",
      "summary": "A waxing Moon rising gives a strong constitution, long life, fearlessness, power and wealth; a waning Moon reverses all of it. The lunar phase — not the sign — is this text's hinge for the judgment."
    },
    "saravali": {
      "locus": "30.14",
      "summary": "The Moon rising in Cancer, Taurus or Aries makes the native liberal, beautiful, rich and pleasure-enjoying; rising in any other sign it makes him intensely passionate, base, deaf, dumb, distressed and declining — the sign decides."
    },
    "agreement": "partial",
    "contradictionNote": "A genuine methodological split, worth CONTESTED display: Phaladipika conditions the first-house Moon on waxing versus waning, Saravali on the rising sign (Cancer/Taurus/Aries versus all others). The favourable and unfavourable effect-lists resemble one another, but the rule that selects between them is different in kind.",
    "sensitiveNote": "Saravali's unfavourable branch asserts deafness and muteness. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.5 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.14 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.5",
      "summary": "The native is rich, very learned and soft-tongued, and a sensualist — but defective of some limb: the text grants prosperity of wealth and speech while attaching a bodily defect to the bargain."
    },
    "saravali": {
      "locus": "30.15",
      "summary": "The native enjoys incomparable happiness and friends and is wealthy; if the Moon there is full, he is very affluent and speaks little. No affliction of any kind is recorded."
    },
    "agreement": "partial",
    "contradictionNote": "Both grant wealth, but Phaladipika's limb-defect and sensuality have no counterpart in Saravali's wholly benign verse; Saravali instead adds a full-Moon rider (greater affluence, sparing speech) that Phaladipika lacks.",
    "sensitiveNote": "Phaladipika's claim of a defective limb is a historical doctrinal statement with no demonstrated validity, reproduced for fidelity to the sources; it describes nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.5 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.15 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.5",
      "summary": "The native has brothers and is strong and powerful, but lascivious and very miserly — sibling fortune and bodily vigour set against a grasping, indulgent character in this text's reading."
    },
    "saravali": {
      "locus": "30.16",
      "summary": "The native protects his co-born, is always delighted and valorous, and is endowed with learning, robes and food — an unbrokenly favourable verse for the Moon in the third house."
    },
    "agreement": "partial",
    "contradictionNote": "Both texts favour siblings and grant strength, but Phaladipika ends on 'very miserly' and lasciviousness while Saravali's verse is delight, learning and abundance throughout — a real difference of moral colouring.",
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.5 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.16 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.6",
      "summary": "Happy and indulging in sensual pleasures, the native is liberal in gifts, possesses good friends and the comfort of conveyances, and enjoys a high reputation among his people."
    },
    "saravali": {
      "locus": "30.17",
      "summary": "Endowed with relatives, paraphernalia and conveyances, the native is charitable and fond of travelling by water — but is neither very happy nor miserable: comfort granted without felicity."
    },
    "agreement": "partial",
    "contradictionNote": "Phaladipika grants outright happiness and renown in the Moon's own directional house; Saravali pointedly withholds the verdict — 'neither very happy nor miserable' — while agreeing on conveyances, kin and generosity.",
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.6 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.17 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.6",
      "summary": "The native walks gently, is brilliant and intelligent, and has good sons; such a person becomes the minister of a king — intellect, progeny and office granted together."
    },
    "saravali": {
      "locus": "30.18",
      "summary": "Timid in disposition, the native earns learning, clothes and food, has many sons and friends, and is a passionate scholar — gains of mind and progeny with a soft temperament."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.6 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.18 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.6",
      "summary": "The native is short-lived, ignorant, a sufferer of stomach ailments, and faces humiliation — an unconditional four-fold affliction for the Moon in the house of disease."
    },
    "saravali": {
      "locus": "30.19",
      "summary": "The native suffers stomachial diseases; and if the Moon there is weak, he is short-lived — the fatal clause is conditional in this text, reserved for the weak Moon alone."
    },
    "agreement": "partial",
    "contradictionNote": "Both assert stomach disease, but Phaladipika pronounces short life unconditionally and adds stupidity and humiliation, while Saravali reserves the short-life clause for a weak (waning) Moon only — a conditioned versus unconditioned death-claim.",
    "sensitiveNote": "Both texts assert illness and a short life (Saravali conditionally). These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.6 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.19 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.6",
      "summary": "The native is agreeable to look at and exceedingly lovely, and is loved by a beautiful, faithful and illustrious wife — the marriage house receives a wholly benign lunar verdict here."
    },
    "saravali": {
      "locus": "30.20",
      "summary": "Amiable, happy, sensuous and of good physique — but the verse carries a rider: if the Moon there is weak, the native is instead pitiable and weak."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.6 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.20 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.7",
      "summary": "The verdict is bare and grim: the person will suffer from diseases and be short-lived. Nothing else is offered for the Moon in the house of death."
    },
    "saravali": {
      "locus": "30.21",
      "summary": "The native is very intelligent and very splendorous but suffers from diseases; if the Moon is weak he is short-lived — brilliance granted alongside affliction, the death-clause again conditional."
    },
    "agreement": "partial",
    "contradictionNote": "Both assert disease, but Phaladipika's verdict is bare affliction with an unconditional short life, while Saravali grants intelligence and splendour and again makes the short life conditional on a weak Moon.",
    "sensitiveNote": "Both texts assert sickliness and a short life (Saravali conditionally). These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.7 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.21 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.7",
      "summary": "Prosperous, virtuous and blessed with children, the native is victorious, and his undertakings are crowned with success from the very beginning — fortune, piety and progeny granted together."
    },
    "saravali": {
      "locus": "30.22",
      "summary": "Devoted to divine and paternal assignments, the native is endowed with happiness, wealth, intelligence and sons, and attracts the fair sex — duty and enjoyment jointly granted."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.7 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.22 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.7",
      "summary": "The native does good acts and is helpful to the virtuous; the Kapoor rendering adds victory over enemies and success in all ventures — active virtue and worldly success in the karma-bhava."
    },
    "saravali": {
      "locus": "30.23",
      "summary": "Grief itself is excluded outright: the native knows no sorrow, does his duty, and prospers in whatever he undertakes; the text further credits him with affluence, purity, unusual strength, valour and a charitable hand."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.7 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.23 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.7",
      "summary": "High-minded and long-lived, the native is endowed with riches, children and the comfort of servants — the gain house here delivers longevity, progeny and attendance without any qualification."
    },
    "saravali": {
      "locus": "30.24",
      "summary": "Wealthy, with many sons and a long life, the native is served by attendants and is intelligent, sharp, valorous and splendorous — the same unqualified favour as the parallel witness."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.7 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.24 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Moon",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.7",
      "summary": "The native is odious to others, suffers misery, endures insult, and is of the utmost indolence — humiliation and lethargy filling the house of loss, with nothing granted in return."
    },
    "saravali": {
      "locus": "30.25",
      "summary": "Odious, morally fallen and mean, the native suffers eye diseases, is indolent and distressed, is said to be born of another's loins, and is insulted at all times."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Saravali adds claims of eye disease and illegitimate birth ('born of another's loins'). These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.7 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.25 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.8",
      "summary": "The native's body is bruised or a limb injured; he is short-lived, very cruel and adventurous — the ascendant Mars wounds the very body it animates with courage."
    },
    "saravali": {
      "locus": "30.26",
      "summary": "Cruel, adventurous, dull-witted and short-lived, the native is nonetheless honourable, courageous and attractive in appearance despite an injured physique, yet fickle-minded — valour and bodily damage inseparably mixed."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert bodily injury and a short life. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.8 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.26 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.8",
      "summary": "Ugly-faced, devoid of learning and wealth, the native is dependent on and serves low people — penury, ignorance and degrading service pronounced in the house of wealth and speech."
    },
    "saravali": {
      "locus": "30.27",
      "summary": "The native is poor and eats bad food; his face is ugly, he joins bad men, and he is bereft of learning — deprivation stated without any mitigation."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert penury in flatly deterministic terms. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.8 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.27 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.8",
      "summary": "The native possesses good qualities, wealth, bravery and happiness, and cannot be subdued by others — but he is deprived of the happiness of brothers: the house's own signification destroyed."
    },
    "saravali": {
      "locus": "30.28",
      "summary": "Courageous, unconquerable, delighted, endowed with all virtues and famous — yet bereft of his co-born: as in the parallel witness, personal triumph is paid for with the siblings the house governs."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert the loss of siblings. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.8 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.28 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.8",
      "summary": "The native is bereft of mother, friends, lands, happiness, house and conveyances — the fourth-house significations of home, comfort and the mother are struck down one by one."
    },
    "saravali": {
      "locus": "30.29",
      "summary": "Devoid of relatives, paraphernalia and conveyances, the native is very miserable and distressed and lives in the houses of others — homelessness pronounced in the very house of home."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Phaladipika asserts the loss of the mother. This is a historical doctrinal statement with no demonstrated validity, reproduced for fidelity to the sources; it describes nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.8 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.29 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.9",
      "summary": "The native is unhappy and without children, faces many disasters and reverses, and is a backbiting talebearer without much intelligence — progeny, fortune and character all condemned together."
    },
    "saravali": {
      "locus": "30.30",
      "summary": "Devoid of happiness, wealth and sons, the native is fickle-minded, a talebearer, wicked, distressed and mean, and incurs evils — the putra-bhava verdict is wholly unfavourable."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert childlessness. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.9 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.30 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.9",
      "summary": "The native is exceedingly smitten with love and very sensuous, but wealthy, generous and famous, capable of vanquishing his enemies, with splendour like a king's — victorious in battle."
    },
    "saravali": {
      "locus": "30.31",
      "summary": "Highly libidinous and possessed of powerful digestive fire, the native is beautiful, tall and strong, and becomes great among his relatives — the enemy-house Mars turned to vigour and standing."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.9 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.31 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.9",
      "summary": "The native does improper acts, suffers affliction through disease, and wanders the roads; he loses his wife — one working translation renders the clause as the wife dying prematurely."
    },
    "saravali": {
      "locus": "30.32",
      "summary": "The native loses his wife, suffers from diseases, takes to bad ways, and is miserable, sinful, devoid of wealth, distressed and emaciated — marital loss compounded with bodily decline."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert the loss — in one rendering the premature death — of the spouse; this verse family underlies the tradition's later seventh-house-Mars (mangala-dosha) anxieties. These are historical doctrinal claims with no demonstrated validity, reproduced for fidelity to the sources; they predict nothing about any actual person or marriage.",
    "sources": [
      "Mantresvara, Phaladipika 8.9 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.32 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.9",
      "summary": "A deformed body, poverty, a short life, and the curses of the people — the eighth-house Mars receives four condemnations and no relief whatsoever in this text."
    },
    "saravali": {
      "locus": "30.33",
      "summary": "The native suffers from diseases and is short-lived, possesses an ugly or deformed body, does base acts, and suffers grief — affliction of body, conduct and spirit together."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts assert a short life and bodily deformity. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.9 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.33 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.10",
      "summary": "Though a friend of the sovereign, the native is hated by others; he is fatherless — losing his father prematurely — and commits homicide or oppresses other people."
    },
    "saravali": {
      "locus": "30.34",
      "summary": "The native is unskillful in his acts, odious, without virtue and very sinful, and kills living beings — yet he is honoured by the king: violence and royal favour paired."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "The texts assert the father's early loss (Phaladipika) and homicidal violence alongside royal honour (both). These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.10 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.34 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.10",
      "summary": "The native, though cruel by nature, is charitable and like a king; he is valiant and is extolled even by great personalities — martial rulership praised at the chart's zenith."
    },
    "saravali": {
      "locus": "30.35",
      "summary": "Proficient in his acts, valorous and unconquerable, the native serves important people and is endowed with sons, happiness and great courage — excellence in action, but in service."
    },
    "agreement": "partial",
    "contradictionNote": "Phaladipika crowns the native — a king, praised by the great; Saravali has him serve the great instead. The martial excellence is shared, the rank is inverted: rulership in one witness, distinguished service in the other.",
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.10 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.35 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.10",
      "summary": "The native is endowed with riches and happiness, is brave, has no sorrow, and possesses good character — the gain-house Mars is wholly favourable in this text."
    },
    "saravali": {
      "locus": "30.36",
      "summary": "Virtuous, happy and courageous, the native is endowed with wealth, grains and sons, and is devoid of sorrow — agreement with the parallel witness is complete."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantresvara, Phaladipika 8.10 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.36 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mars",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.10",
      "summary": "The native has deformed eyes, is cruel and without a wife, and is a slanderer and a mean wretch — sight, marriage and character all condemned in the house of loss."
    },
    "saravali": {
      "locus": "30.37",
      "summary": "With diseased eyes and fallen morals, the native kills his wife, bears tales, is fierce, and contracts humiliation and imprisonment — the grimmest wife-clause in either witness."
    },
    "agreement": "partial",
    "contradictionNote": "Both give diseased eyes, slander and cruelty, but where Phaladipika leaves the native merely wifeless, Saravali has him kill his wife and adds imprisonment — the second witness is decisively grimmer, and the two claims about the wife are not the same claim.",
    "sensitiveNote": "The texts assert wifelessness (Phaladipika) and wife-killing with imprisonment (Saravali) — among the harshest deterministic claims in this corpus. These are historical doctrinal statements with no demonstrated validity, reproduced for fidelity to the sources; they describe and predict nothing about any actual person.",
    "sources": [
      "Mantresvara, Phaladipika 8.10 — S.S. Sareen trans., Sagar Publications, New Delhi (working edition); verse numbering per the Sastri/wisdomlib scheme (V. Subrahmanya Sastri trans. 1950, wisdomlib.org doc1621580); content cross-checked against G.S. Kapoor trans., Ranjan Publications, New Delhi, ch. 8.",
      "Kalyanavarman, Saravali 30.37 (ch. 30, 'Effects of Planets in Bhavas') — R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1983; verse number verified in two independent reproductions of the Santhanam translation."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.11",
      "summary": "Wholly favourable: the native is long-lived, speaks sweetly and cleverly, and understands the meaning of all the shastras. Mantreshvara attaches no adverse clause to Mercury rising in the lagna."
    },
    "saravali": {
      "locus": "30.38",
      "summary": "The native's physique is flawless; he is intelligent, knows the fitting place and moment for action, is well versed in poetry and mathematics, speaks skilfully and sweetly, and lives long."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.11 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.38 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.11",
      "summary": "Wealth is earned through the native's own intelligence; he becomes a poet whose speech is pure and pleasing, and he eats sweet, sumptuous food. The verse records only benefits for Mercury in the second."
    },
    "saravali": {
      "locus": "30.39",
      "summary": "Wealth comes through the native's own wisdom; he enjoys food and drink, his speech is auspicious, and his course of conduct is good — a compact, wholly favourable delineation."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.11 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.39 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.11",
      "summary": "A mixed verdict: the native is brave and enjoys good brothers, but the text fixes his life at a middling span and adds that he is weighed down by toil and dejection."
    },
    "saravali": {
      "locus": "30.40",
      "summary": "The native toils hard without cease and is deprived of his near and dear ones; he is skilful and endowed with brothers, but also very cunning and fickle-minded."
    },
    "agreement": "partial",
    "contradictionNote": "Both give siblings and hardship, but Phaladipika calls the native brave and fixes a middling lifespan, while Saravali omits lifespan, deprives him of near and dear ones, and calls him cunning and fickle-minded.",
    "sensitiveNote": "Contains a deterministic lifespan claim ('a middling span of life'). This is the tradition's own assertion, recorded as textual history — not a prediction about anyone.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.11 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.40 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.11",
      "summary": "The native is learned and happy, with witty, flattering speech, and enjoys friends, lands, grain and wealth — the fourth-house comforts that Mercury is said to deliver in full."
    },
    "saravali": {
      "locus": "30.41",
      "summary": "Money, relatives and good fortune attend the native, with conveyances, full paraphernalia and great learning — Kalyanavarman's fourth-house Mercury is comfort and scholarship together, without qualification."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.11 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.41 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.12",
      "summary": "Learning, happiness, courage and a good number of children are promised, and the native is said to be conversant with charms and spells — occult skill sitting beside progeny in one verse."
    },
    "saravali": {
      "locus": "30.42",
      "summary": "The native is an expert both in mantras and in abhichara, the hostile rites; he has many sons and is endowed with learning, happiness, efficacy and constant delight."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.12 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.42 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.12",
      "summary": "The native is made angry through disputes, is harsh in speech and idle; the single benefit the verse records is that he destroys the power of his enemies."
    },
    "saravali": {
      "locus": "30.43",
      "summary": "Always successful in litigations and disputes, the native nevertheless contracts diseases, is indolent and much insulted; he speaks harshly but, the text specifies, is not given to anger."
    },
    "agreement": "partial",
    "contradictionNote": "Head-on clash on temperament: Phaladipika makes the native angry through disputes; Saravali says expressly that he is not given to anger. Saravali alone adds diseases and insult; both give harsh speech, indolence and success against opponents.",
    "sensitiveNote": "Attributes disease and public insult to a planetary placement. Recorded as what the text claims; the tradition's pathology talk is historical doctrine, neither medical nor predictive.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.12 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.43 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.12",
      "summary": "The native is learned, dresses beautifully and possesses greatness, and the marriage clause is material: he obtains a rich wife. Mantreshvara records nothing adverse for Mercury in the seventh."
    },
    "saravali": {
      "locus": "30.44",
      "summary": "The verse describes the wife: very learned, beautiful and affluent, yet not of good descent and a promoter of quarrels. The native himself is said to be very great."
    },
    "agreement": "partial",
    "contradictionNote": "Both make the wife rich and the native great, but Saravali adds judgments Phaladipika lacks — the wife is learned and beautiful but of low descent and quarrel-promoting — while Phaladipika dwells on the native's own learning and dress.",
    "sensitiveNote": "Both texts pass judgments on a hypothetical spouse (descent, temperament). These are the tradition's social attitudes on record, not guidance about marriage.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.12 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.44 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.12",
      "summary": "Against the eighth house's usual grimness, Mercury here is emphatically good: wide renown, long life, support of the whole family, and rank as a lord and commander of an army."
    },
    "saravali": {
      "locus": "30.45",
      "summary": "The native wins famous titles, is strong and long-lived, supports his family, and stands equal to a king — or becomes a justice. The eighth house here confers rank, not ruin."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.12 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.45 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.13",
      "summary": "Learning joined with wealth, good conduct, religious-mindedness, familiarity with everything and great eloquence — the ninth-house Mercury native collects the text's favourite virtues without any qualification."
    },
    "saravali": {
      "locus": "30.46",
      "summary": "Very affluent, scholarly and virtuous, the native has good conduct and habits, eloquent speech, and skill of a great order — an unreservedly favourable ninth-house delineation."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.13 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.46 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.13",
      "summary": "Every undertaking succeeds; the native has learning, strength, intelligence and happiness, performs good acts and is truthful. The tenth-house placement is presented as unreservedly excellent."
    },
    "saravali": {
      "locus": "30.47",
      "summary": "Distinguished intelligence issuing in distinguished acts: the native's undertakings reach fruition, he is very learned, courageous and strong, and he is adorned with ornaments of many kinds."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.13 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.47 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.13",
      "summary": "The native is long-lived and true to his word, very rich, happy and attended by servants — the gains of the eleventh delivered without any negative rider."
    },
    "saravali": {
      "locus": "30.48",
      "summary": "The native is rich, learned, happy and famous, works amicably, enjoys wide pleasures and lives long — the eleventh house multiplying Mercury's gifts without restriction."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.13 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.48 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Mercury",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.13",
      "summary": "An unrelievedly harsh verdict: the native is miserable, devoid of learning, suffers humiliation, and is cruel and inactive. Mantreshvara concedes nothing positive to Mercury in the twelfth."
    },
    "saravali": {
      "locus": "30.49",
      "summary": "A contradictory portrait: the native keeps his promises, speaks well and is learned, yet he is indolent, humiliated, pitiable and cruel — virtue and wretchedness in one verse."
    },
    "agreement": "partial",
    "contradictionNote": "Direct clash on learning and speech: Phaladipika strips the native of learning; Saravali makes him learned, a good speaker and true to his promises. They agree on humiliation, cruelty, indolence and general wretchedness.",
    "sensitiveNote": "Attributes misery, cruelty and humiliation deterministically. Encoded for fidelity to the sources; this describes a historical doctrine and prescribes nothing.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.13 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.49 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Mercury occupies verses 38-49). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.14",
      "summary": "Jupiter rising is thoroughly benign: the native is handsome, fortunate, long-lived and fearless, and is blessed with children. No qualification or adverse clause is attached."
    },
    "saravali": {
      "locus": "30.50",
      "summary": "Attractive in appearance, energetic and long-lived, the native acts only after assessing consequences, and is learned, courageous and great — deliberation singled out as the mark of Jupiter rising."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.14 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.50 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.14",
      "summary": "The native is eloquent and a connoisseur of good food, has a lovely face, and is wealthy and learned — second-house Jupiter delivering wealth and refined speech together."
    },
    "saravali": {
      "locus": "30.51",
      "summary": "The native is rich, enjoys good food, speaks eloquently, and is fortunate and charitable, with a beautiful body and face — wealth and generosity paired in the second."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.14 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.51 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.14",
      "summary": "Sharply negative despite Jupiter's benefic nature: the native is treated with disrespect, is miserly and wickedly disposed and commits sins; the one bright clause is a renowned brother."
    },
    "saravali": {
      "locus": "30.52",
      "summary": "Greatly humiliated and vile, with deficient digestion, defeated by women and sinful in his acts — yet the verse inserts that he is ever successful, an odd bright clause amid condemnation."
    },
    "agreement": "partial",
    "contradictionNote": "Both condemn the placement (disrespect or humiliation, sin, wickedness or vileness), but their concessions differ: Phaladipika's only positive is a renowned brother, adding miserliness; Saravali's is 'ever successful', adding digestive weakness and defeat by women.",
    "sensitiveNote": "Carries moral condemnation in both witnesses (sinful, wicked, vile) plus Saravali's clauses on digestive weakness and defeat by women. The tradition's own judgments, recorded as historical doctrine — not a verdict on anyone.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.14 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.52 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.14",
      "summary": "The native lives happily surrounded by his mother, friends, attendants, sons, wife and corn; Mantreshvara reads fourth-house Jupiter as domestic abundance pure and simple, with no adverse rider."
    },
    "saravali": {
      "locus": "30.53",
      "summary": "Endowed with relatives, paraphernalia, conveyance, happiness, intelligence, pleasures and wealth, the native is great and a source of misery to his enemies — abundance stated without reservation."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.14 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.53 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.15",
      "summary": "The significator of children placed in the children's house brings distress through sons — the text's stark clause — though the native is intelligent and becomes a king's adviser."
    },
    "saravali": {
      "locus": "30.54",
      "summary": "Abundant happiness, many sons and friends: the native is learned, courageous, wealthy and always happy. Kalyanavarman reads Jupiter in the fifth as progeny multiplied, not endangered."
    },
    "agreement": "contradict",
    "contradictionNote": "Flat contradiction on children: Phaladipika says the native suffers distress through sons; Saravali promises many sons and abundant happiness. Only intelligence or learning and high standing (king's adviser; wealthy and courageous) roughly align.",
    "sensitiveNote": "Touches distress concerning children — a deterministic claim of the tradition, kept side by side with its opposite from the second witness; recorded as textual history, never as a prediction.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.15 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.54 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.15",
      "summary": "The native is very inactive and suffers disrespect, yet he destroys his enemies and is clever in charms and exorcism; humiliation and enemy-destruction sit side by side in this verse."
    },
    "saravali": {
      "locus": "30.55",
      "summary": "The native lacks digestive fire and virility, and is humiliated, weak and indolent; yet he destroys his enemies and becomes widely famous — fame arriving, the text says, on account of women."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Attributes loss of digestive fire and virility, weakness and humiliation to a planetary placement. Recorded as what the texts claim; the tradition's pathology talk is historical doctrine, neither medical nor predictive.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.15 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.55 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.15",
      "summary": "A good wife and sons, great amiability, and munificence exceeding the father's: seventh-house Jupiter is read as marital and generational good fortune without any negative clause."
    },
    "saravali": {
      "locus": "30.56",
      "summary": "Charming and superior, the native acquires a beautiful wife, exceeds his father, and is an eloquent speaker, a poet, learned and famous — the seventh house at its most generous."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.15 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.56 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.15",
      "summary": "Grim despite longevity: the native is poor and earns his livelihood as a menial, and he is sinful — the long life granted is spent in penury and servitude."
    },
    "saravali": {
      "locus": "30.57",
      "summary": "The native is insulted and pitiable, a servant who serves his own people, and has unions with unclean women; the single concession is long life amid the degradation."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Asserts lifelong penury and servitude. A grim deterministic claim of the tradition, kept verbatim-in-substance; described as historical doctrine, never applied to anyone.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.15 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.57 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.16",
      "summary": "The native becomes a famous minister, endowed with wealth and children, and is eager to perform virtuous acts — ninth-house Jupiter given the text's fullest endorsement of dharma and rank."
    },
    "saravali": {
      "locus": "30.58",
      "summary": "Attached to divine and paternal duties, the native is learned and fortunate and becomes a king's minister, a leader or a chief — dharma and rank conferred together."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.16 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.58 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.16",
      "summary": "The native follows right conduct and is renowned for his virtues, becomes very rich, and is a friend of the king; tenth-house Jupiter joins morality to worldly success."
    },
    "saravali": {
      "locus": "30.59",
      "summary": "Undertakings begin successfully; the native is honourable and effortful, endowed with abundant welfare, happiness, wealth, relatives, conveyances and fame — the tenth house answering Jupiter with unqualified prosperity."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.16 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.59 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.16",
      "summary": "The native is wealthy, fearless and long-lived and travels in vehicles, but the verse inserts one deterministic restriction amid the gains: he will have only a few children."
    },
    "saravali": {
      "locus": "30.60",
      "summary": "Many gains, many conveyances and many servants come to the virtuous native, but the verse withholds two things by name: his education will be limited and his sons few."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Contains a deterministic claim about the number of a person's children — in both witnesses. Recorded because the texts say it; the Workbench does not predict family outcomes.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.16 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.60 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Jupiter",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.16",
      "summary": "Wholly condemning: the native is hated by others, foul-mouthed, childless, sinful, idle and a menial — the great benefic in the twelfth stripped of every one of its usual gifts."
    },
    "saravali": {
      "locus": "30.61",
      "summary": "The native is indolent and odious, deprived alike of speech and luck, and will in all probability live in servitude — a short verse offering no mitigation whatever."
    },
    "agreement": "agree",
    "contradictionNote": "The verdicts coincide (odious, idle, servile), with one nuance: Phaladipika's native is foul-mouthed and expressly childless; Saravali's is deprived of speech altogether and childlessness is not stated.",
    "sensitiveNote": "Asserts childlessness and lifelong servitude. The tradition's harshest register, preserved for fidelity; nothing here is a statement about any living person.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.16 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.61 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Jupiter occupies verses 50-61). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.17",
      "summary": "Venus in the lagna gives a healthy and beautiful body, happiness and endowment with long life; the delineation is short and purely favourable, with no qualification of any kind."
    },
    "saravali": {
      "locus": "30.62",
      "summary": "Beautiful in eyes, face and physique, the native is happy and long-lived, and is attractive to women — with one qualification, that he is timid by disposition."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.17 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.62 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.17",
      "summary": "The native becomes a poet and is endowed with riches of various kinds — the second house of wealth and speech answered with exactly those two gifts, and nothing adverse."
    },
    "saravali": {
      "locus": "30.63",
      "summary": "Abundant food, drink and wealth, with excellent pleasures: the native's speech is good and he amasses great wealth — the second house of accumulation answered in full."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.17 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.63 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.17",
      "summary": "One of the text's harshest Venus verdicts: the native is wifeless, unhappy, poor, miserly and unpopular — deprivation of spouse, wealth and affection stated without any mitigation."
    },
    "saravali": {
      "locus": "30.64",
      "summary": "A tangled verdict: the native is happy and rich, yet conquered by women, vile, of little enthusiasm, and bereft of luck and paraphernalia — prosperity granted while fortune is denied."
    },
    "agreement": "contradict",
    "contradictionNote": "Near-total opposition: Phaladipika's native is wifeless, unhappy, poor and miserly; Saravali's is happy and rich, though vile, woman-dominated, unenthusiastic and luckless. The witnesses share only a generally diminished, unlucky tone.",
    "sensitiveNote": "Asserts wifelessness and poverty (in one witness). The text's claim is preserved unsoftened as historical doctrine — not advice, not prognosis.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.17 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.64 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.17",
      "summary": "Fourth-house Venus furnishes the material comforts of home: good vehicles, a good house, jewels, clothes and scents. The verse is a plain inventory of luxuries, entirely favourable."
    },
    "saravali": {
      "locus": "30.65",
      "summary": "The native is endowed with relatives, friends and happiness, is splendorous and beautiful, rich and fortunate, and possesses conveyances and paraphernalia — domestic plenty without any adverse clause."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.17 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 1-4 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.65 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.18",
      "summary": "The native owns immense wealth, protects others, is very wise and is blessed with children — fifth-house Venus joining riches, progeny and wisdom in a single favourable clause."
    },
    "saravali": {
      "locus": "30.66",
      "summary": "Happiness, sons and friends attend the native, who is fond of sexual union, very affluent and complete in everything, and becomes a minister or a justice."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.18 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.66 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.18",
      "summary": "A double-edged verse: the native has no enemies but also no riches; he is corrupted by young women and afflicted by grief — poverty and moral compromise despite the peace."
    },
    "saravali": {
      "locus": "30.67",
      "summary": "The marriage clause is stark: the native greatly dislikes his wife. He has many foes, is devoid of wealth, is easily alarmed and is mean — misery on every count."
    },
    "agreement": "partial",
    "contradictionNote": "Direct clash on enemies: Phaladipika says the native has no enemies; Saravali gives him many foes and alone adds that he greatly dislikes his wife. They agree that he is wealthless and troubled through women or grief.",
    "sensitiveNote": "Touches marriage misery (aversion to the wife) and poverty. Recorded as the tradition's deterministic teaching; described, never prescribed.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.18 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.67 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.18",
      "summary": "The native obtains a good wife yet carries on intrigues with bad women, and the text states plainly that he will lose his wife; he will nonetheless be wealthy."
    },
    "saravali": {
      "locus": "30.68",
      "summary": "Very beautiful and fortunate, the native is happy with his wife, enjoys great riches and is free of quarrels — a marriage read as harmonious and untroubled throughout."
    },
    "agreement": "contradict",
    "contradictionNote": "Opposite marital outcomes: Phaladipika grants a good wife but adds intrigues with bad women and the loss of the wife (the Sanskrit is mṛtakalatra, 'whose wife is dead'); Saravali describes unbroken happiness with the wife and freedom from quarrels. Both agree the native is wealthy.",
    "sensitiveNote": "Phaladipika's clause is the death of the spouse. A death claim of the historical tradition, encoded for fidelity and shown beside a witness that says the opposite; the site's standing frame applies — this is the tradition, not a prediction.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.18 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.68 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.18",
      "summary": "Contrary to the eighth house's reputation, Venus here is entirely fortunate: the native is long-lived and rich and becomes a ruler of the earth — no adverse clause at all."
    },
    "saravali": {
      "locus": "30.69",
      "summary": "Long-lived and very rich, enjoying incomparable happiness, the native stands equal to a king and feels delight from moment to moment — the eighth house at its most glowing."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.18 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 5-8 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.69 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.19",
      "summary": "Blessed with wife, friends and children, the native prospers through royal favour — ninth-house Venus read as fortune flowing from family and the sovereign's goodwill alike."
    },
    "saravali": {
      "locus": "30.70",
      "summary": "The native's physique is spotless and broad; he is endowed with wealth, charity, wife, sexual pleasures and friendship, and honours gods, guests and preceptors — piety and plenty together."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.19 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.70 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.19",
      "summary": "The native is widely renowned, possesses friends, and is a lord happily employed — tenth-house Venus giving fame, social support and contented authority, with nothing negative recorded."
    },
    "saravali": {
      "locus": "30.71",
      "summary": "Success in litigations heads the list; the native is endowed with happiness, sexual unions, honour, wealth, fame and great wisdom — the tenth house delivering victory and repute together."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.19 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.71 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.19",
      "summary": "The native is rich and endowed with many comforts, but the verse adds that he is fond of the company of women other than his wife — gain shadowed by infidelity."
    },
    "saravali": {
      "locus": "30.72",
      "summary": "Obedient servants, freedom from every kind of misery, and abundant gains: Kalyanavarman's eleventh-house Venus is short and wholly favourable, carrying no moral or material qualification of any kind."
    },
    "agreement": "partial",
    "contradictionNote": "Not a head-on contradiction but an asymmetry of the kind marked partial elsewhere in this tranche (cf. Mercury/7): Phaladipika alone attaches the other-women clause; Saravali's delineation is purely material and untroubled.",
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.19 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.72 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Venus",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.19",
      "summary": "Venus in the house of loss is read positively: sexual enjoyment, wealth and splendour — expenditure transmuted into pleasure, with no condemnation attached in this text."
    },
    "saravali": {
      "locus": "30.73",
      "summary": "The native is indolent, corpulent and fallen in moral sense, yet happy; he eats cleansed food, is skilful in providing beds and attendants, and is won over by women."
    },
    "agreement": "partial",
    "contradictionNote": "Both read the twelfth sensually — pleasure, comfort, women — but Phaladipika is purely positive (enjoyment, wealth, splendour) while Saravali adds indolence, corpulence and a fall in moral sense.",
    "sensitiveNote": "Carries one witness's moral condemnation ('fallen in moral sense'). Preserved as the tradition's own judgment; the Workbench records it and does not moralize.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.19 (adhyāya 8, 'Effects of the Sun and other planets in the 12 Bhavas'; one śloka spans bhavas 9-12 for this graha). Working translation: S.S. Sareen, Sagar Publications, New Delhi; locus and substance verified against V. Subrahmanya Sastri's 1950 translation and the printed Sanskrit verse markers as digitized at wisdomlib.org (Phaladeepika text-and-translation, ch. 8, OCR pp. 120-128).",
      "Kalyāṇavarman, Sārāvalī 30.73 (adhyāya 30, 'Effects of Planets in Bhavas' — a single continuously numbered chapter; Venus occupies verses 62-73). Working translation: R. Santhanam, Ranjan Publications, Delhi 1983 (2 vols.); full text witnessed at archive.org item KalyanaVarmasSaravali_201707 and verse numbering cross-checked against independent quotations of Santhanam's rendering (e.g. Mars-in-lagna 30.26, Venus-in-lagna 30.62)."
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.20",
      "summary": "Saturn exalted or in its own sign in the lagna raises the native to a king's equal, a chief or the mayor of a city; rising in any other sign it decrees sorrow, misery and indigence from childhood, with a slovenly, indolent bearing."
    },
    "saravali": {
      "locus": "30.74",
      "summary": "In an ascendant identical with Saturn's exaltation or own house, the native equals a king in status or heads a country or city; in any other rāśi the planet gives misery in boyhood, a dirty disposition and indolence."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts deterministically assign lifelong misery and penury to most ascendants. This is the tradition's historical formula, reproduced faithfully for the record; it has no demonstrated validity and predicts nothing about any person.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.20; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.74; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.21",
      "summary": "An ugly face, want of wealth and a bent toward unjust courses mark the early life; in later years the native quits his homeland, settles in a foreign country, and there gains money, conveyances and the enjoyments of life."
    },
    "saravali": {
      "locus": "30.75",
      "summary": "The native has an ugly face yet enjoys worldly prosperity; he is deserted by his own people, renders justice, and later in the course of his life goes to other countries, where he earns money and conveyances."
    },
    "agreement": "contradict",
    "contradictionNote": "Both witnesses give the ugly face and the late-life foreign gains, but they flatly disagree on the early state: Phaladīpikā makes the native wealthless and given to unjust ways; Sārāvalī makes him worldly-prosperous and a renderer of justice. Both positions stand; neither is resolved.",
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.21; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.75; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.21",
      "summary": "Saturn in the third gives great intelligence, liberality in gifts and happiness in the company of the wife; yet the same verse leaves the native inactive and overcome with sorrow — gains of mind and home shadowed by lethargy."
    },
    "saravali": {
      "locus": "30.76",
      "summary": "Kalyāṇavarman describes a dark-complexioned native who keeps his body clean yet is judged base; he is served by indolent attendants and is himself courageous, charitable and endowed with great intelligence."
    },
    "agreement": "partial",
    "contradictionNote": "The witnesses meet on intelligence and open-handedness. Phaladīpikā adds marital happiness weighed down by indolence and sorrow; Sārāvalī instead adds courage, baseness and a dark complexion. Different judgments side by side, not direct opposites.",
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.21; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.76; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.22",
      "summary": "Saturn in the fourth makes the native unhappy and houseless, without vehicles, deprives him of his mother, and keeps him sickly through his early years — the bhāva's domestic significations are denied one by one."
    },
    "saravali": {
      "locus": "30.77",
      "summary": "The native suffers heart disease or a broken heart, is devoid of relatives, conveyances, wealth, intelligence and happiness, passes his boyhood in sickness, and bears prominent nails and hair — Sārāvalī's fourth-house list is wholly adverse."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Both texts deterministically assign loss of the mother or kin, childhood sickness and heart disease. Recorded as the tradition's claim, verbatim in substance; it is not a prediction, diagnosis or statement about any person.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.22; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.77; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.22",
      "summary": "Saturn in the fifth sends the native roaming with his reason lost; he is stripped of children, wealth and happiness, and the text pronounces him perfidious and evil-minded — one of the chapter's harshest fifth-house verdicts."
    },
    "saravali": {
      "locus": "30.78",
      "summary": "Should Saturn hold the fifth bhāva, the native is bereft of happiness, sons, friends, intelligence and kindness; he remains agitated in mind and lives in poverty — every fifth-house signification is withdrawn."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": "Deterministic denial of children, sanity and wealth is what these texts say. It is encoded for fidelity to the sources as historical doctrine, never as fate or counsel; no validity is claimed.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.22; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.78; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.22",
      "summary": "The native eats voraciously, is wealthy, stubborn and self-regarding. On the enemy clause the verse's translators split: Sastri reads him harassed or subdued by his enemies, Kapoor reads him vanquishing them — the same śloka, opposite renderings."
    },
    "saravali": {
      "locus": "30.79",
      "summary": "Saturn in the sixth, in Kalyāṇavarman's account, makes the native very licentious yet beautiful and courageous; he eats abundantly, is crooked in his dealings, and conquers many of his enemies."
    },
    "agreement": "partial",
    "contradictionNote": "Sārāvalī unambiguously has the native conquer his enemies. Phaladīpikā's enemy clause is contested between its own translations (subdued by enemies vs. vanquishing them), so the two texts either agree or directly oppose depending on which reading is taken. Both readings are preserved.",
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.22; S.S. Sareen trans. (Sagar Publications); Sastri trans. 1950 (wisdomlib.org) reads 'subdued by his enemies', Kapoor trans. (Ranjan) reads 'will vanquish his enemies'",
      "Kalyāṇavarman, Sārāvalī 30.79; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.22",
      "summary": "Saturn in the seventh yokes the native to a bad wife — Kapoor's rendering, liaisons with women of questionable character — and leaves him poor, wandering the roads and distressed; the marriage house is spoiled rather than emptied."
    },
    "saravali": {
      "locus": "30.80",
      "summary": "The native is perpetually subjected to ill health, loses his wife outright, is bereft of wealth, presents an ugly appearance, and is given over to sin and to very mean acts."
    },
    "agreement": "partial",
    "contradictionNote": "Both witnesses ruin the seventh house, but differently: Phaladīpikā gives a bad or disreputable spouse who remains, Sārāvalī gives outright loss of the wife plus chronic ill health. The severity differs; the grimness does not.",
    "sensitiveNote": "Marital misery and loss of a spouse are asserted deterministically by these texts. The claims are the tradition's own, kept verbatim in substance; nothing here is guidance or prediction about anyone's marriage.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.22; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.80; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.23",
      "summary": "The eighth-house Saturn yields an unclean, wealthless native who suffers from piles, is cruel-minded, goes pinched with hunger, and is despised even by his own friends — poverty, disease and contempt in a single verse."
    },
    "saravali": {
      "locus": "30.81",
      "summary": "Saturn in the eighth brings leprosy and fistula of the anus or genitals, a short span of life, and failure in whatever the native undertakes — disease, early death and defeat stated without qualification."
    },
    "agreement": "partial",
    "contradictionNote": "Both texts assign disease of the lower body (piles in Phaladīpikā; fistula and leprosy in Sārāvalī). Sārāvalī alone shortens the life and dooms all undertakings; Phaladīpikā alone adds hunger, poverty and social contempt.",
    "sensitiveNote": "Disease and — in Sārāvalī — a short life are asserted outright. The record preserves the doctrine as history; it makes no medical or longevity claim and must never be read as one.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.23; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.81; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.24",
      "summary": "Saturn in the ninth strips away fortune, wealth, children, father and religious merit together, and the text pronounces the native wicked — a sweeping denial of everything the dharma house signifies."
    },
    "saravali": {
      "locus": "30.82",
      "summary": "The native is devoid of religious merit, holds little wealth, is bereft of siblings, sons and happiness, and himself becomes a cause of sorrow to others — Kalyāṇavarman's ninth-house Saturn spares nothing."
    },
    "agreement": "agree",
    "contradictionNote": "Substantively concordant lists of loss; the family member denied differs at the margin — Phaladīpikā names the father, Sārāvalī the siblings — while both deny sons, wealth and religious merit.",
    "sensitiveNote": "Loss of father, siblings and children is asserted as fixed outcome by these texts. Recorded as the tradition's deterministic formula, for fidelity only; it predicts nothing about any person.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.24; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.82; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.24",
      "summary": "Here Saturn turns favourable in substance: the native becomes a king or a king's minister, devotes himself to agriculture, and is brave, rich and renowned — the karma house rewards the karmic planet."
    },
    "saravali": {
      "locus": "30.83",
      "summary": "Saturn in the tenth gives wealth, learning and valour, and public office besides — the native becomes a minister or a justice, or the leader of a group, a city or a village."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.24; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.83; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.24",
      "summary": "Saturn in the eleventh grants a long span of life, lasting wealth and a steady income; the native is brave, free from disease and well moneyed — the gain house yields Saturn its full favour."
    },
    "saravali": {
      "locus": "30.84",
      "summary": "The native is long-lived and endowed with lasting riches; he is courageous, versed in the arts, free of sickness, and surrounded by money, people and property — Kalyāṇavarman's list is entirely favourable."
    },
    "agreement": "agree",
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.24; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.84; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Saturn",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.24",
      "summary": "The twelfth-house Saturn makes the native impudent and indigent, childless, defective in a limb, stupid, and at the last driven out by his enemies — the loss house compounds every Saturnine denial."
    },
    "saravali": {
      "locus": "30.85",
      "summary": "Saturn in the twelfth yields a distressed, morally fallen and talkative native with defective eyesight; he is unkind and shameless, spends heavily, and suffers insult — misery itemized across purse, body and reputation."
    },
    "agreement": "partial",
    "contradictionNote": "Uniformly grim on both sides, but the counts differ: Phaladīpikā itemizes childlessness, a limb defect, stupidity and expulsion by enemies; Sārāvalī itemizes bad eyesight, shamelessness, heavy spending and insult. Neither list contradicts the other; neither confirms it.",
    "sensitiveNote": "Childlessness and bodily defect are stated as fixed outcomes by the text. Recorded as the tradition's claim for the historical record; no validity is asserted and nothing is predicted.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.24; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Kalyāṇavarman, Sārāvalī 30.85; R. Santhanam trans., Ranjan Publications, Delhi 1983"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.25",
      "summary": "Rāhu in the lagna decrees a short life, yet grants wealth and bodily strength; diseases settle in the upper limbs — the head and the face. The text sets the lifespan verdict and the gains side by side, unsoftened."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The short-life clause is reproduced exactly as the tradition states it — a historical deterministic lifespan claim with no demonstrated validity. It is a quotation-in-substance from a 16th-century text, never a prediction.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.25; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.25",
      "summary": "The native's speech is insincere, carrying double meanings; disease afflicts the mouth or face; wealth arrives through the sovereign's favour; and both translators set wrath and a tender heart side by side in the same native, who is nonetheless counted happy."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The mouth- and face-disease clause is a deterministic illness claim belonging to the text, kept for fidelity to the source; it carries no medical meaning and no validity is asserted.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.25; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.25",
      "summary": "Rāhu in the third makes the native proud and hostile to his own brothers, yet strong-willed, long-lived and wealthy — the pattern the tradition expects of a malefic seated in an upachaya house."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.25; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.25",
      "summary": "A short span of life and only occasional happiness. Sastri's rendering adds that the native is a fool who causes sorrow yet keeps friends — epithets Kapoor's translation of the same verse omits; both readings are preserved here."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "A deterministic short-life claim, reproduced as the text states it. It is the tradition's formula on record — not a prediction, and without demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.25; S.S. Sareen trans. (Sagar Publications); Sastri trans. 1950 (wisdomlib.org) and Kapoor trans. (Ranjan) diverge on this verse's epithets as noted",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.26",
      "summary": "The native speaks through the nose, remains childless and hard-hearted, and suffers pain of the belly — Mantreśvara offers the fifth-house Rāhu nothing kinder, denying progeny, warmth and health in one clause each."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Childlessness and bodily affliction are asserted deterministically. The claim belongs to the text and is recorded as history, never as fate; no validity is claimed.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.26; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.26",
      "summary": "Trouble comes from enemies and from oppression by malefic planets, with an ulcerous disease of the anus; yet the native is wealthy and long-lived — the text states the afflictions and the gains together, unreconciled."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The disease clause is the text's own deterministic illness claim, preserved for fidelity; it has no medical meaning and no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.26; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.26",
      "summary": "Wealth drains away through intrigues with women; the native is separated from or outlives his spouse — Kapoor renders it widowerhood — loses his virility, and is self-willed and dull. Every seventh-house signification is wrecked."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Loss of spouse and virility are the text's own deterministic claims, kept verbatim in substance for the record. They are statements of a historical doctrine, not about any living person, and carry no validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.26; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.26",
      "summary": "A short life, impure acts, a defective limb, few children, and wind-disease — vāta affliction, which Kapoor renders as rheumatism. Every clause of the eighth-house verse is an affliction; the text offers no counterweight."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Short life, bodily defect and disease are asserted as fixed outcomes. This is the tradition's death-adjacent formula, recorded faithfully as history; it predicts nothing and has no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.26; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.27",
      "summary": "The native speaks in opposition and harshly, commits unrighteous deeds, and yet rises to head a clan, a village or a city — authority gained without piety is the verse's exact bargain for the dharma house."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.27; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.27",
      "summary": "Fame and fearlessness come, but with few children, engagement in other men's business, and no good acts performed — the text grants the tenth house's renown while withholding both its virtue and its progeny."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The limited-progeny clause is a deterministic family claim belonging to the text; it is recorded as tradition, not as fate, and no validity is asserted.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.27; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.27",
      "summary": "The native prospers, lives long and grows wealthy, but has few children and suffers a disease of the ear — the eleventh house's gains delivered with two fixed deductions, stated in the same breath."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The ear-disease and limited-progeny clauses are the text's deterministic claims, preserved for fidelity; they carry no medical or personal meaning and no validity is claimed.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.27; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Rahu",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.27",
      "summary": "The native commits sinful acts in secret, spends excessively, and suffers a water-disease — rendered dropsy by Kapoor. All three clauses are afflictions; Mantreśvara grants the twelfth-house Rāhu no compensating gain."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Rāhu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The water-disease clause is a deterministic illness claim belonging to the text; it is preserved as historical doctrine, without medical meaning or demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.27; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 1,
    "phaladipika": {
      "locus": "8.28",
      "summary": "Ketu rising yields an ungrateful, unhappy tale-bearer, fallen from his position and an outcaste, deformed in body and keeping company with the wicked — among the harshest lagna verdicts in the whole chapter."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Bodily deformity and social ruin are asserted deterministically, and the caste-outcaste language reflects the text's social world. Preserved verbatim in substance as history; described, never endorsed or predicted.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.28; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 2,
    "phaladipika": {
      "locus": "8.28",
      "summary": "Learning and riches are both denied; the native's speech is vile in quality, his look sinister, and he eats forever at other men's tables — dependence on others' food is the verse's closing image."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Penury and lifelong dependence on others for food are asserted deterministically. The claim is the text's own historical formula, preserved for fidelity; it predicts nothing about any person and has no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.28; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 3,
    "phaladipika": {
      "locus": "8.29",
      "summary": "A favourable placement with one cut: long life, strength, wealth and fame, happiness in the wife's company and good food — but the native loses a brother, the third house's own signification turned against itself."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The loss-of-a-brother clause is a deterministic family-death claim. It is recorded as what the text says, for the historical record only; it asserts nothing about anyone.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.29; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 4,
    "phaladipika": {
      "locus": "8.29",
      "summary": "Lands, vehicles, mother and happiness are all lost; the native leaves his birthplace to dwell in a foreign land and lives on another man's bounty — the home house is emptied and then exiled."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Loss of the mother is asserted as a fixed outcome by the text. The tradition's deterministic formula is preserved faithfully; it is not a prediction and has no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.29; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 5,
    "phaladipika": {
      "locus": "8.30",
      "summary": "Children are lost, the belly is diseased, and goblins — piśāca, evil spirits — torment the native, who himself becomes evil-minded and wicked; progeny, body and mind are afflicted together in a single verse."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Loss of children and disease are asserted deterministically, alongside the text's demonological frame (piśāca affliction). All of it is the tradition's historical claim, described and never endorsed; no validity is asserted.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.30; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 6,
    "phaladipika": {
      "locus": "8.30",
      "summary": "Ketu's best house in this chapter: the native is magnanimous and of the finest qualities, wins lasting fame, firmness and high authority, crushes his enemies, and attains what he desires — iṣṭa-siddhi, in the text's own term."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.30; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 7,
    "phaladipika": {
      "locus": "8.31",
      "summary": "Humiliation and liaisons with unworthy women; disease seats itself in the bowels; and the native loses both his wife and his virility — the verse dismantles each seventh-house signification it touches, one by one."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Loss of spouse and virility are the text's own deterministic claims about marital ruin, kept verbatim in substance for fidelity; they say nothing about any living person and carry no validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.31; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 8,
    "phaladipika": {
      "locus": "8.31",
      "summary": "A short life passed in separation from dear friends and in quarrels; injury comes by a weapon, and every undertaking ends in disappointment — the eighth-house Ketu is denied even partial success."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Short life and weapon injury are deterministic claims of the text — the tradition's death-adjacent register, recorded faithfully as history. Nothing here predicts anything; no validity is claimed.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.31; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 9,
    "phaladipika": {
      "locus": "8.32",
      "summary": "The native follows a sinful, unrighteous course, is deprived of his father, and lives unlucky and indigent, slandering the good — the dharma house's significations inverted point by point by the text."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "Loss of the father and penury are asserted as fixed outcomes. The tradition's deterministic formula is preserved for the record; it is never a prediction and has no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.32; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 10,
    "phaladipika": {
      "locus": "8.32",
      "summary": "Good works meet obstruction and the native's acts are impure and vile; yet he is energetic, bold and widely renowned — capacity and corruption granted together, the tenth house's fame without its merit."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.32; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 11,
    "phaladipika": {
      "locus": "8.33",
      "summary": "Wholly favourable: wealth is amassed and hoarded, good qualities abound, and enjoyment runs high; whatever goods or ends the native pursues, the text has him equipped for and obtaining — the gain house gives without deduction."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": null,
    "sources": [
      "Mantreśvara, Phaladīpikā 8.33; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  },
  {
    "graha": "Ketu",
    "bhava": 12,
    "phaladipika": {
      "locus": "8.33",
      "summary": "Sins are committed in secret and money destroyed on vile things; the native's conduct is forbidden and his eyes fall diseased — the loss house doubles Ketu's dissipations of wealth, conduct and sight."
    },
    "saravali": {
      "locus": null,
      "summary": null,
      "note": "Sārāvalī has no Ketu bhava delineations: its planets-in-bhavas chapter (ch. 30) runs from the Sun to Saturn only (vv. 2-85) and closes there by colophon; the chapter index of Santhanam's translation confirms the scope. Recorded as absent rather than supplied from another text."
    },
    "agreement": null,
    "contradictionNote": null,
    "sensitiveNote": "The eye-disease clause is the text's deterministic illness claim, preserved for fidelity to the source; it carries no medical meaning and no demonstrated validity.",
    "sources": [
      "Mantreśvara, Phaladīpikā 8.33; S.S. Sareen trans. (Sagar Publications), numbering verified in V. Subrahmanya Sastri trans. 1950 (wisdomlib.org) and G.S. Kapoor trans. (Ranjan Publications)",
      "Absence witness: Kalyāṇavarman, Sārāvalī ch. 30 colophon and chapter index; R. Santhanam trans., Ranjan Publications, Delhi 1983 — coverage is Sun through Saturn only"
    ]
  }
];

// Convenience lookup: bhavaPhala(graha, bhava) -> record | null.
export function bhavaPhala(graha, bhava) {
  return BHAVA_PHALA.find(r => r.graha === graha && r.bhava === bhava) || null;
}

export default { BHAVA_PHALA, BHAVA_PHALA_META, bhavaPhala };
