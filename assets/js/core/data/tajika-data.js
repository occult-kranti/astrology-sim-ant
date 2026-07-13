// ============================================================================
//  tajika-data.js — the cited reference data for TĀJIKA VARṢAPHALA, the
//  Indo-Persian annual-chart system (the "sidereal solar return" of Jyotiṣa).
//
//  PRIMARY WITNESS: Balabhadra's Hāyanaratna (1649), the critical edition of
//  Martin Gansten, "The Jewel of Annual Astrology" (Brill, Sir Henry Wellcome
//  Asian Series 19, 2020; open access, full translation mirrored at
//  wisdomlib.org). Balabhadra systematically quotes Samarasiṃha (Tājikasāra /
//  Saṃjñātantra, 13th c.), Nīlakaṇṭha (Tājika-nīlakaṇṭhī, 1587), Yādava, Tuka
//  and Gaṇeśa — which makes him the best single witness for the tradition's
//  INTERNAL disagreements. Cross-checked: B. V. Raman, "Varshaphala or the
//  Hindu Progressed Horoscope".
//
//  PROJECT DISCIPLINE (locked): every record carries a `.cite`; wherever the
//  tradition disagrees with itself the fork is flagged IN-DATA (`contested`),
//  never silently resolved. Astrology has no demonstrated predictive validity;
//  everything here is a historical calculation grammar — described, never
//  prescribed. Pure data: no DOM, no astronomy.
// ============================================================================

export const TAJIKA_CITATION =
  'Balabhadra, Hāyanaratna (1649), trans. M. Gansten, The Jewel of Annual Astrology (Brill 2020); ' +
  'Nīlakaṇṭha, Tājika-nīlakaṇṭhī (1587); B. V. Raman, Varshaphala or the Hindu Progressed Horoscope.';

// ---------------------------------------------------------------------------
//  Deeptāṁśa — the "orbs of light" of the seven planets, in degrees.
//  Verified verbatim from TWO independent primary texts quoted by Balabhadra:
//  "the sun aspects within an orb of light of fifteen degrees, the moon within
//  twelve, Mars within eight, Venus and Mercury within seven, and Jupiter and
//  Saturn within nine."
// ---------------------------------------------------------------------------
export const DEEPTAMSA = { Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9 };

export const DEEPTAMSA_RECORD = {
  orbs: DEEPTAMSA,
  cite: 'Daivajñālaṃkṛti 8.9 = Tājikasāra 88, both quoted in Balabhadra, Hāyanaratna ch.3 §1, trans. M. Gansten, The Jewel of Annual Astrology (Brill 2020).',
  variants: [{
    planet: 'Rahu', orb: 12, flagged: true,
    cite: 'Praśnavaiṣṇava only — "In the Praśnavaiṣṇava, Rāhu, too, is assigned an orb of twelve degrees" (Hāyanaratna ch.3 §1, trans. Gansten, Brill 2020). Not used by default.',
  }],
  knownErrors: [{
    source: 'vedastro.org, "Varshaphala Part 3"', value: 'Mars = 12°',
    note: 'A transcription error: contradicted by BOTH independent primary texts (Daivajñālaṃkṛti 8.9 and Tājikasāra 88 give Mars 8°) and by Raman’s own table.',
    cite: 'Hāyanaratna ch.3 §1 (Gansten, Brill 2020) against vedastro.org Varshaphala Part-3.',
  }],
  // How two orbs combine when judging a configuration (yoga):
  combinationRule: {
    primary: 'within their own orbs of light, or within twelve degrees',
    operational: 'A configuration is active when the in-sign gap lies within BOTH planets’ own orbs of light, OR within twelve degrees (the text’s stated alternative). Both flags are reported so the disjunctive-vs-cap reading of the clause stays visible.',
    cite: 'Hāyanaratna ch.3 §3 (trans. Gansten, Brill 2020) — the text’s own combination rule, verbatim.',
    halfSum: {
      contested: true,
      note: 'A HALF-SUM mutual orb ((orbA+orbB)/2) is often attributed to modern practice (Bhat/Raman-derived software), but the formula was NOT verified in any cited source — the one forum thread cited for it never states it. It is, however, mathematically identical to this site’s Lilly moiety rule (assets/js/core/aspects.js: moiety(A)+moiety(B) with moiety = half-orb). Shown for comparison only; never asserted as the Tājika texts’ rule.',
      cite: 'Unverified in sources (adversarial check, 2026); repo-internal precedent: assets/js/core/aspects.js (Lilly, Christian Astrology Bk I — orbs & moieties).',
    },
  },
};

// ---------------------------------------------------------------------------
//  Tājika aspects — SIGN-BASED, counted inclusively from each planet's sign
//  (1 = same sign … 7 = opposite). Friendly: 3/11 (secret) and 5/9 (open);
//  inimical: 4/10 (secret) and 7 (open); the conjunction is a full aspect
//  "similar to the mutual aspect on the seventh", quality by dignity.
//  Strengths per Vāmana: 3/11 quarter, 4/10 half, 5/9 three-quarter, 7 full.
// ---------------------------------------------------------------------------
export const TAJIKA_ASPECT_CLASSES = [
  { key: 'conjunction', offsets: [1], name: 'Conjunction (same sign)', friendly: null, strength: 1.0,
    note: 'A full aspect "similar to the mutual aspect on the seventh"; its quality depends on the planets’ dignity.',
    cite: 'Hāyanaratna ch.2 §1 (quoting Samarasiṃha), trans. Gansten (Brill 2020).' },
  { key: 'secret-friend', offsets: [3, 11], name: 'Secret friendship (3rd/11th)', friendly: true, strength: 0.25,
    note: 'Quarter strength; "perfects every matter".',
    cite: 'Hāyanaratna ch.2 §1 (Samarasiṃha) with Vāmana’s strength values in §3, trans. Gansten (Brill 2020).' },
  { key: 'secret-enemy', offsets: [4, 10], name: 'Secret enmity (4th/10th)', friendly: false, strength: 0.5,
    note: 'Half strength.',
    cite: 'Hāyanaratna ch.2 §1 (Samarasiṃha) with Vāmana’s strength values in §3, trans. Gansten (Brill 2020).' },
  { key: 'open-friend', offsets: [5, 9], name: 'Open friendship (5th/9th)', friendly: true, strength: 0.75,
    note: 'Three-quarter strength.',
    cite: 'Hāyanaratna ch.2 §1 (Samarasiṃha) with Vāmana’s strength values in §3, trans. Gansten (Brill 2020).' },
  { key: 'open-enemy', offsets: [7], name: 'Open enmity (7th)', friendly: false, strength: 1.0,
    note: 'Full strength.',
    cite: 'Hāyanaratna ch.2 §1 (Samarasiṃha) with Vāmana’s strength values in §3, trans. Gansten (Brill 2020).' },
];
export const TAJIKA_ASPECT_SOURCE =
  'Hāyanaratna ch.2 §1 "The Various Aspects (dṛś)" quoting Samarasiṃha, and §3 (Vāmana’s strength values), trans. Gansten (Brill 2020). Maps onto sextile/trine friendly, square/opposition inimical, conjunction neutral-by-dignity.';

// ---------------------------------------------------------------------------
//  The Tājika triplicity lords (tri-rāśi-pati) — the system's OWN day/night
//  table, distinct from sign rulership AND from the Dorothean triplicities of
//  the Western wing. Elements: fire (Aries/Leo/Sag), earth (Tau/Vir/Cap),
//  air (Gem/Lib/Aqu), water (Can/Sco/Pis).
// ---------------------------------------------------------------------------
export const TAJIKA_TRIPLICITY = {
  day: { Fire: 'Sun', Earth: 'Venus', Air: 'Saturn', Water: 'Venus' },
  night: { Fire: 'Jupiter', Earth: 'Moon', Air: 'Mercury', Water: 'Mars' },
  cite: 'Hāyanaratna ch.5 (the triplicity-lord section preceding "Finding the Ruler of the Year"; wisdomlib doc1500935), trans. Gansten (Brill 2020) — day: Sun/Venus/Saturn/Venus, night: Jupiter/Moon/Mercury/Mars for fire/earth/air/water. Distinct from sign rulership.',
  variant: {
    flagged: true,
    note: 'Samarasiṃha also records an alternative triplicity system with "constant rulers" alongside the day/night rulers — flagged, not encoded.',
    cite: 'Hāyanaratna ch.5 (doc1500935), trans. Gansten (Brill 2020).',
  },
};
export const SIGN_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water']; // element = SIGN_ELEMENTS[signIndex % 4]

// ---------------------------------------------------------------------------
//  Munthā — the progressed ascendant-sign of the year.
// ---------------------------------------------------------------------------
export const MUNTHA_RECORD = {
  rule: 'munthā sign = (natal ascendant sign index + COMPLETED years of age) mod 12; at age 0 the munthā is the natal ascendant sign itself.',
  quote: 'Dividing the total years elapsed from the nativity by twelve, taking the remainder and counting from the ascendant, [the sign] where it finds rest will be the munthahā.',
  quoteBy: 'Samarasiṃha, as quoted by Balabhadra',
  ageConvention: 'COMPLETED years. Popular "(Asc + age − 1) mod 12" formulations use the RUNNING (current) year number — the same rule under a different age convention, since running = completed + 1.',
  monthlyMotion: {
    note: 'Sub-annual progression ≈ 2.5°/month — one sign spread over the year. Strictly: "Dividing the degrees comprising a house by twelve gives its monthly increment" — i.e. the actual house extent / 12, which equals 2.5° only for equal 30° houses.',
    attribution: 'Tājikamuktāvali, as quoted by Balabhadra (not Balabhadra’s own dictum).',
    cite: 'Tājikamuktāvali as quoted in Hāyanaratna ch.5 §1 (doc1500929), trans. Gansten (Brill 2020).',
  },
  houseReading: 'The munthā’s house placement in the annual chart (and its lord’s condition) sets the year’s focus — read house by house.',
  cite: 'Hāyanaratna ch.5 §1 (doc1500929, Samarasiṃha’s rule) and §2 (doc1500930, "General Results of the Munthahā"), trans. Gansten (Brill 2020).',
};

// ---------------------------------------------------------------------------
//  Varṣeśvara — the ruler of the year, chosen from EXACTLY FIVE candidates
//  (pañcādhikārin). The ASPECT PRECONDITION is primary; the no-aspect case is
//  a documented four-way dispute, flagged in-data.
// ---------------------------------------------------------------------------
export const VARSHESHVARA_RECORD = {
  candidates: [
    { role: 'Munthā lord', how: 'lord of the munthā sign' },
    { role: 'Natal lagneśa', how: 'lord of the natal ascendant sign (janma-lagneśa)' },
    { role: 'Annual lagneśa', how: 'lord of the annual ascendant sign (varṣa-lagneśa)' },
    { role: 'Tri-rāśi-pati', how: 'the TĀJIKA day/night triplicity lord of the annual ascendant sign — NOT the sign ruler' },
    { role: 'Dina-rātri-pati', how: 'lord of the sign occupied by the Sun if the varṣa-praveśa falls by day, by the Moon if by night ("the word sun means the ruler of the sign occupied by the sun")' },
  ],
  candidatesCite: 'Listed identically by Samarasiṃha (Tājikaśāstra), Tejaḥsiṃha (Daivajñālaṃkṛti 14.1), Maṇittha (Varṣaphala 7–8) and Yādava (Tājikayogasudhānidhi 7.3–4), all quoted in Hāyanaratna ch.5 §8 (doc1500936), trans. Gansten (Brill 2020).',
  aspectPrecondition: {
    quote: 'even [a planet] without strength, aspecting the ascendant, is ruler of the year; one not aspecting [the ascendant], although strong, is not',
    by: 'Yādava, as quoted by Balabhadra',
    note: 'The aspect to the annual lagna is PRIMARY — bare "strongest of five" popularizations omit it and are wrong on the sources.',
    cite: 'Hāyanaratna ch.5 §8 (doc1500936), trans. Gansten (Brill 2020).',
  },
  tieChain: {
    chain: ['greatest Tājika aspect to the annual lagna', 'greater strength', 'more claims among the five dignities (pañcavargī)', 'the munthā lord'],
    by: 'Tājikakaustubha, as quoted by Balabhadra',
    note: 'The quoted selection rule — "The planet that aspects the ascendant with a great aspect is ruler of the year; if the aspects are equal, the one of greater strength is ruler" — continues with two further tie-breakers: more claims among the five dignities, then the munthā lord.',
    implementationNote: 'The "more claims among the five dignities (pañcavargī)" step is documented but NOT computed here (no pañcavargīya-bala module); ties past strength fall directly to the munthā lord, and the report says so.',
    cite: 'Tājikakaustubha as quoted in Hāyanaratna ch.5 §8 (doc1500936), trans. Gansten (Brill 2020).',
  },
  noAspectDispute: {
    contested: true,
    question: 'When NO candidate aspects the annual lagna, who rules the year?',
    positions: [
      { authority: 'Yādava', rule: 'the munthā lord' },
      { authority: 'Tuka Jyotirvid', rule: 'the annual-lagna lord (varṣalagneśa)' },
      { authority: 'Gaṇeśa Daivajña', rule: 'whichever candidate aspected the annual-ascendant sign in the NATIVITY' },
      { authority: 'Balabhadra (his verdict — implemented default)', rule: 'the strongest in sixfold strength (ṣaḍbala); if all are equal in strength, the munthā lord' },
    ],
    implemented: 'Balabhadra’s verdict (strongest in ṣaḍbala, final tie → munthā lord), with the four-way dispute surfaced whenever this fallback fires.',
    cite: 'Hāyanaratna ch.5 §8 (doc1500936), trans. Gansten (Brill 2020) — the four positions verbatim.',
  },
  strengthNote: 'The texts’ tie-breaking "strength" is pañcavargīya bala; this site uses its existing Ṣaḍbala engine (assets/js/core/vedic.js) as the available strength measure — a documented substitution, matching Balabhadra’s own ṣaḍbala verdict in the no-aspect case.',
  cite: 'Hāyanaratna ch.5 §8 "Finding the Ruler of the Year (Varṣeśa)" (doc1500936), trans. Gansten (Brill 2020).',
};

// ---------------------------------------------------------------------------
//  The Tājika yogas (configurations). Canonical order of the sixteen per
//  Hāyanaratna ch.3; the seven load-bearing ones are defined for computation.
//  The names are Sanskritized Arabic: itthaśāla = ittiṣāl (application),
//  īsarāpha = inṣirāf (separation), nakta = naql, yamayā = jamʿ, kambūla =
//  qabūl — the SAME Arabic horary doctrine Lilly inherited in the West.
// ---------------------------------------------------------------------------
export const TAJIKA_YOGA_ORDER_16 = {
  names: ['Ikkavāla', 'Induvāra', 'Itthaśāla', 'Īsarāpha', 'Nakta', 'Yamayā', 'Maṇaū', 'Kambūla',
    'Gairikambūla', 'Khallāsara', 'Radda', 'Duḥphālikuttha', 'Dutthotthadabīra', 'Tambīra', 'Kuttha', 'Duruḥpha'],
  note: '"Induvāra" is the Hāyanaratna’s spelling; "Anduvāra" is a variant. The nine compounds/negations (Maṇaū … Duruḥpha) reuse the same primitives and are documented, not computed, here.',
  cite: 'Hāyanaratna ch.3 (doc1500902–1500918), trans. Gansten (Brill 2020).',
};

export const TAJIKA_YOGAS = [
  {
    key: 'ikkavala', name: 'Ikkavāla',
    def: 'If all the planets are in an angle or a succedent house [kendra/paṇaphara], that is ikkavāla, causing attainment of dominion and happiness.',
    kind: 'house-placement',
    variant: {
      flagged: true,
      note: 'Yādava (Tājikayogasudhānidhi 6.5) reduces ikkavāla and induvāra to two-planet aspect configurations (ikkavāla = aspect between planets in two angles). The Saṃjñātantra all-planets rule is encoded as primary; Yādava is the flagged variant.',
      cite: 'Tājikayogasudhānidhi 6.5 as quoted in Hāyanaratna ch.3 §2 (doc1500904), trans. Gansten (Brill 2020).',
    },
    cite: 'Saṃjñātantra 2.17 as quoted in Hāyanaratna ch.3 §2 (doc1500904), trans. Gansten (Brill 2020).',
  },
  {
    key: 'induvara', name: 'Induvāra',
    def: 'If the planets are [all] in a cadent house [apoklima], that is induvāra, never praised as good.',
    kind: 'house-placement',
    cite: 'Saṃjñātantra 2.17 as quoted in Hāyanaratna ch.3 §2 (doc1500904), trans. Gansten (Brill 2020).',
  },
  {
    key: 'itthasala', name: 'Itthaśāla (ittiṣāl — applying)',
    def: 'When the swifter planet is less than the slower planet in degrees of longitude, equal or just slightly less, then the configuration is called itthaśāla — the faster planet behind the slower, within the orbs of light (or within twelve degrees), in a Tājika aspect.',
    kind: 'aspect',
    grades: {
      vartamana: 'ongoing application (the computed default)',
      purna: 'perfected — within about half a minute of arc of exactness; immediate full result',
      bhavishyat: 'future — the swifter planet at the end of its sign, about to apply across the sign boundary; delayed result',
    },
    arabic: 'ittiṣāl (application) — the same applying doctrine Lilly inherited; cf. assets/js/core/aspects.js.',
    cite: 'Hāyanaratna ch.3 §3 (doc1500905), trans. Gansten (Brill 2020).',
  },
  {
    key: 'isarapha', name: 'Īsarāpha (inṣirāf — separating)',
    def: 'When the swifter [planet] moves in front of the slower planet by one degree, that is an īsarāpha — declared to give evil results; effects dissolve or deny the matter.',
    kind: 'aspect',
    carveOut: {
      rule: 'Past exactness by LESS than one full degree still counts as itthaśāla: "By [merely] passing beyond its minutes of arc, without completing one degree, [the swifter planet still forms] an itthaśāla configuration: so says the ancient commentator."',
      by: '"the ancient commentator" as quoted by Balabhadra in his discussion of Tājikabhūṣaṇa 4.10',
      divergence: 'NOTE: this diverges from the Western applying flag in assets/js/core/aspects.js for that sliver — a pair past exactness by under 1° is separating (applying=false) to Lilly’s engine but still itthaśāla to the Tājika rule. Both verdicts are shown.',
      cite: 'Hāyanaratna ch.3 §4 (doc1500906) quoting the ancient commentator on Tājikabhūṣaṇa 4.10, trans. Gansten (Brill 2020).',
    },
    cite: 'Tājikabhūṣaṇa 4.10 as quoted in Hāyanaratna ch.3 §4 (doc1500906), trans. Gansten (Brill 2020).',
  },
  {
    key: 'nakta', name: 'Nakta (naql — translation of light)',
    def: 'If there is no aspect between the ruler of the ascendant and the ruler of the matter sought, but a swifter planet, placed between them, takes the light from [the planet] placed behind [it] and commits it to the other one, this is nakta — outcome achieved through an intermediary.',
    kind: 'aspect',
    western: 'Exactly Lilly’s translation of light.',
    cite: 'Hāyanaratna ch.3 §5 (doc1500907), trans. Gansten (Brill 2020).',
  },
  {
    key: 'yamaya', name: 'Yamayā (jamʿ — collection of light)',
    def: 'A slower [planet] within its [orb of light] aspects a pair of [planets] lacking a mutual aspect and, taking the [light] from the swifter, gives it to the slower — a HEAVIER planet receives the application of both.',
    kind: 'aspect',
    western: 'Exactly Lilly’s collection of light.',
    cite: 'Tājikabhūṣaṇa 4.13 as quoted in Hāyanaratna ch.3 §6 (doc1500908), trans. Gansten (Brill 2020).',
  },
  {
    key: 'kambula', name: 'Kambūla (qabūl — Moon-assisted itthaśāla)',
    def: 'When there is an itthaśāla between the rulers of the ascendant and the matter sought, a kambūla is said [to arise] from an itthaśāla [of the two planets] here with the moon.',
    kind: 'aspect',
    grading: '4×4 = 16 subdivisions by the Moon’s dignity (superior: own house/exaltation; middling: own haddā/decan/navāṁśa; inferior: fall/enemy sign; neutral: none) crossed with the significators’ dignity — DOCUMENTED here, not computed (no haddā table in this module).',
    cite: 'Saṃjñātantra 2.36 as quoted in Hāyanaratna ch.3 §8 (doc1500910), trans. Gansten (Brill 2020).',
  },
];

// ---------------------------------------------------------------------------
//  Sahams (Arabic sahm, "lot/part") — the Tājika lots. General form:
//  saham = minuend A − subtrahend B + added point C (usually the Lagna;
//  Venus for Mitra; Sun/Moon for Gaurava). At NIGHT the minuend and
//  subtrahend swap unless the formula is stated "same by day and night".
//  THE +30° CORRECTION: if C does not lie in the zodiacal arc measured FROM
//  the subtrahend forward TO the minuend, add one sign (30°).
// ---------------------------------------------------------------------------
export const SAHAM_CORRECTION_RECORD = {
  rule: 'If the ascendant is not [placed] between the signs of the subtrahend and the minuend, it is declared that one sign should be added to this.',
  operational: 'If the ADDED point C (usually the Asc; Venus for Mitra; Sun by day / Moon by night for Gaurava) does not lie in the zodiacal arc measured from the subtrahend forward to the minuend, add 30°. At night the minuend and subtrahend swap first (unless the formula says otherwise); the between-check then runs on the swapped roles.',
  general: 'The correction is GENERAL (Balabhadra and Raman both state it for the sahams as a class); Adawal’s encyclopedia bakes a flat +30° into the Roga formula only — same operational effect there, but the rule is not Roga-specific.',
  cite: 'Saṃjñātantra 3.5 with Balabhadra’s gloss ("the space beginning with the sign and so on of the subtrahend planet and ending with the sign and degree of the minuend planet"), Hāyanaratna ch.4 §2 (doc1500922) and §3 (doc1500923), trans. Gansten (Brill 2020); B. V. Raman, Varshaphala ch.8 (same general rule).',
  contested: {
    visvanatha: {
      contested: true,
      note: 'Viśvanātha Daivajña (Prakāśikā commentary on the Saṃjñātantra, 1629) REJECTS the one-sign addition entirely: "no statement in support of this notion is found anywhere, nor is there any adding of one [sign] in the school of the Yavanas." The correction is contested WITHIN the tradition; it is implemented as the operational default (Balabhadra + Raman) with this dissent always displayed.',
      cite: 'Viśvanātha Daivajña, Prakāśikā (1629), as quoted in Hāyanaratna ch.4 §2 (doc1500922), trans. Gansten (Brill 2020).',
    },
    granularity: {
      contested: true,
      note: 'The verbatim rule says between the SIGNS of subtrahend and minuend, and Balabhadra’s gloss admits a sign-granular reading alongside the degree-granular one. Both give identical results on this module’s verified test vectors; the degree-granular reading is used operationally and each computed saham records whether the two readings agree.',
      cite: 'Hāyanaratna ch.4 §2 gloss (doc1500922), trans. Gansten (Brill 2020).',
    },
  },
};

// The verified CORE DOZEN. Fields: minuend/subtrahend/added are 'Asc', a
// planet name, 'punya' (the computed Puṇya saham), or 'lagnaLord' (the planet
// ruling the annual ascendant sign). nightReverses: swap minuend/subtrahend
// by night. dayNight: explicit separate night formula (Gaurava only).
export const SAHAMS = [
  {
    key: 'punya', name: 'Puṇya (Fortune)',
    minuend: 'Moon', subtrahend: 'Sun', added: 'Asc', nightReverses: true,
    note: 'The Tājika Lot of Fortune — the first and reference saham; several others are built from it.',
    cite: 'Saṃjñātantra 3.5 as quoted in Hāyanaratna ch.4 §2 (doc1500922), trans. Gansten (Brill 2020).',
  },
  {
    key: 'guru', name: 'Guru (Teacher)',
    minuend: 'Sun', subtrahend: 'Moon', added: 'Asc', nightReverses: true,
    note: 'Verbatim: "The reverse of this [Fortune] is the calculation of (2) Teacher and (3) Learning" — Guru and Vidyā SHARE one formula (the reverse of Puṇya).',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'vidya', name: 'Vidyā (Learning)',
    minuend: 'Sun', subtrahend: 'Moon', added: 'Asc', nightReverses: true,
    note: 'Same formula as Guru (Teacher), per the verbatim "The reverse of this is the calculation of (2) Teacher and (3) Learning".',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'yashas', name: 'Yaśas (Fame)',
    minuend: 'Jupiter', subtrahend: 'punya', added: 'Asc', nightReverses: true,
    note: 'Verbatim: "Jupiter less by Fortune by day, the reverse by night, projected as before" — i.e. Jupiter − Puṇya-saham + Asc.',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'mitra', name: 'Mitra (Friend)',
    minuend: 'Jupiter', subtrahend: 'punya', added: 'Venus', nightReverses: true,
    contested: {
      phrasing: {
        contested: true,
        note: 'Gansten renders the source "subtract the lot of fortune from the LOT OF THE TEACHER … added to Venus". Since "Teacher (guru)" is itself saham #2, a literalist could read Mitra = Guru-SAHAM − Puṇya + Venus rather than JUPITER − Puṇya + Venus. Unanimous practice (Raman, Adawal) reads Jupiter — encoded as Jupiter with the phrasing flagged. The Venus between-check point is verbatim either way.',
        cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020); Raman, Varshaphala ch.8; Adawal.',
      },
    },
    note: 'The ADDED point (and therefore the between-check point) is VENUS, not the Lagna — verbatim.',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'mahatmya', name: 'Māhātmya (Greatness)',
    minuend: 'punya', subtrahend: 'Mars', added: 'Asc', nightReverses: true,
    note: 'Verbatim: "subtract Mars from Fortune … By night the reverse".',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'samarthya', name: 'Sāmarthya (Ability)',
    minuend: 'Mars', subtrahend: 'lagnaLord', added: 'Asc', nightReverses: true,
    exception: {
      when: 'Mars itself rules the Lagna',
      formula: 'Jupiter − Mars + Asc "at all times" (no day/night reversal)',
      cite: 'Hāyanaratna ch.4 §3 (doc1500923) — "subtracted from Jupiter at all times", trans. Gansten (Brill 2020).',
    },
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'bhratri', name: 'Bhrātṛ (Brothers)',
    minuend: 'Jupiter', subtrahend: 'Saturn', added: 'Asc', nightReverses: false,
    note: 'NO night reversal: the Hāyanaratna states no reversal clause ("from Jupiter, less by Saturn"), and Raman and Adawal agree — same by day and night.',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020); Raman, Varshaphala ch.8; Adawal.',
  },
  {
    key: 'gaurava', name: 'Gaurava (Honour)',
    dayNight: {
      day: { minuend: 'Jupiter', subtrahend: 'Moon', added: 'Sun' },
      night: { minuend: 'Jupiter', subtrahend: 'Sun', added: 'Moon' },
    },
    nightReverses: false, // the night form is EXPLICIT, not a mechanical swap
    betweenCheck: 'Sun by day / Moon by night (the added point) — verbatim.',
    contested: {
      nightForm: {
        contested: true,
        note: 'Raman’s mechanical reversal (Moon − Jupiter + Sun) yields a DIFFERENT point; the Hāyanaratna night form (Jupiter − Sun + Moon) and Adawal’s (Moon − Sun + Jupiter) are value-identical (both = Jupiter + Moon − Sun). The night-form contest is Raman vs everyone; the between-check point also differs across the three. Encoded: the Hāyanaratna’s explicit forms.',
        cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020); Raman, Varshaphala ch.8; Adawal.',
      },
      name: {
        contested: true,
        note: 'The critical text prints the name as "Honour (guru)[?]" with an editorial query — the familiar name "gaurava" is not certain in the critical edition.',
        cite: 'Gansten, The Jewel of Annual Astrology (Brill 2020), Hāyanaratna ch.4 §3 apparatus.',
      },
    },
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'rajya-pitri', name: 'Rājya / Pitṛ (Dominion / Father)',
    minuend: 'Saturn', subtrahend: 'Sun', added: 'Asc', nightReverses: true,
    note: 'One formula yields both: verbatim "(11) Dominion (rājya) and (12) Father (tāta)" from Saturn − Sun, reversed by night.',
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'matri', name: 'Mātṛ (Mother)',
    minuend: 'Moon', subtrahend: 'Venus', added: 'Asc', nightReverses: true,
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
  {
    key: 'putra', name: 'Putra (Children)',
    minuend: 'Jupiter', subtrahend: 'Moon', added: 'Asc', nightReverses: false,
    contested: {
      reversal: {
        contested: true,
        note: 'The Hāyanaratna is verbatim: "(14) Children (suta) [by subtracting] the moon from Jupiter BY DAY OR NIGHT" — NOT reversed. Raman-derived tables reverse it by night; flagged, not followed.',
        cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020); Raman variant per Varshaphala ch.8.',
      },
    },
    cite: 'Hāyanaratna ch.4 §3 (doc1500923), trans. Gansten (Brill 2020).',
  },
];
export const SAHAM_COUNTS_NOTE = {
  note: 'Counts differ by authority: Nīlakaṇṭha lists ~50 sahamas, Raman presents 35, Balabhadra’s compilation reaches 75. The dozen encoded here are the verified core, each checked verbatim against the critical edition.',
  cite: 'Gansten, The Jewel of Annual Astrology (Brill 2020), Hāyanaratna ch.4 §3 (list numbered through 75); Raman, Varshaphala ch.8.',
};

// ---------------------------------------------------------------------------
//  Varṣa-praveśa — the annual revolution is SIDEREAL.
// ---------------------------------------------------------------------------
export const VARSHA_PRAVESHA_RECORD = {
  rule: 'The annual chart is cast for the instant the Sun "attains the same sign, degree, minute and second" as at birth, measured in the SIDEREAL zodiac.',
  yearLength: 'The Hāyanaratna uses the sidereal year constant 365d 15gh 31pa 30vp (= 365.25875 days, the Sūrya-siddhānta value) and treats precession only as a correction — confirming the target is the natal sidereal Sun longitude.',
  drift: 'The sidereal return lands later than the tropical return by ≈ (365.25636 − 365.24219) d ≈ 20.4 minutes per year of age (cumulative).',
  ayanamsaNote: 'This site computes the sidereal frame with the Lahiri (Citrāpakṣa) ayanāṁśa — a MODERN convention, flagged: Balabhadra’s own constants are Sūrya-siddhānta era.',
  cite: 'Hāyanaratna ch.1 §6 "Calculating the Time of the Annual Revolution" (doc1500887), trans. Gansten (Brill 2020).',
};

// ---------------------------------------------------------------------------
//  The transmission claim — why this page cross-links two wings of the site.
// ---------------------------------------------------------------------------
export const TRANSMISSION_NOTE = {
  note: 'Tājika is the historical Indo-Persian bridge: itthaśāla/īsarāpha/nakta/yamayā/kambūla ARE the Arabic ittiṣāl/inṣirāf/naql/jamʿ/qabūl — the same horary doctrine of application and separation that Lilly inherited in the West. The same return, two rulebooks: the Book III solar revolution reads the tropical return with Lilly’s grammar; the varṣaphala reads the sidereal return with Samarasiṃha’s.',
  cite: 'Gansten, The Jewel of Annual Astrology (Brill 2020) — the transmission claim; cf. Lilly, Christian Astrology Bk III (this site, pages/book3/master.html).',
};
