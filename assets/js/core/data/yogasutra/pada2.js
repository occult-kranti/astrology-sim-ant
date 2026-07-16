// ============================================================================
//  yogasutra/pada2.js — Patanjali's YOGA SUTRAS, Book II (Sadhana-pada),
//  the "means of attainment": all 55 sutras, word-by-word.
//
//  PURE DATA. One record per sutra, cited per record via `.src`.
//  Sources (fixed for every record):
//    - Devanagari: sanskritdocuments.org (doc_yoga/yogasuutra.html), the
//      accent-free rendering — the Vedic svara marks (udatta U+0951,
//      anudatta U+0952, and the like) of the accented recension are stripped.
//      The source's own word-spacing is preserved (e.g. II.46 keeps the space
//      in 'स्थिरसुखम् आसनम्').
//    - Word-by-word glosses + IAST: Rama Prasada (1912), "Patanjali's Yoga
//      Sutras with the commentary of Vyasa and the gloss of Vachaspati Misra",
//      via each sutra's wisdomlib.org page.
//    - Whole-sutra translation: J. H. Woods (1914), "The Yoga-System of
//      Patanjali" (Harvard Oriental Series 17) — the running BODY-TEXT
//      renderings (not the Analytical Summary). Woods verbatim, with his own
//      bracketed completions kept; a few parenthetical Sanskrit words are given
//      in proper IAST (avidya -> avidyā, guna -> guṇa, Icvara -> Īśvara).
//
//  Record shape:
//    { pada, num, devanagari, iast, words: [{sa, gloss}], translation, note, src }
// ============================================================================

const SRC = 'Devanāgarī: sanskritdocuments.org; glosses: Rama Prasada (1912); trans.: Woods (1914)';

export const PADA2 = [
  {
    pada: 2, num: 1,
    devanagari: "तपःस्वाध्यायेश्वरप्रणिधानानि क्रियायोगः",
    iast: "tapaḥsvādhyāyeśvarapraṇidhānāni kriyāyogaḥ",
    words: [
      { sa: "tapaḥ", gloss: "purificatory action" },
      { sa: "svādhyāya", gloss: "study" },
      { sa: "īśvara-praṇidhāna", gloss: "worship of God, making God the motive of action" },
      { sa: "kriyā", gloss: "of action" },
      { sa: "yogaḥ", gloss: "the Yoga" }
    ],
    translation: "Self-castigation and study and devotion to the Īśvara are the Yoga of action.",
    note: "The three practices — tapas, svādhyāya and īśvara-praṇidhāna — form the kriyā-yoga (yoga of action) triad.",
    src: SRC
  },
  {
    pada: 2, num: 2,
    devanagari: "समाधिभावनार्थः क्लेशतनूकरणार्थश्च",
    iast: "samādhibhāvanārthaḥ kleśatanūkaraṇārthaśca",
    words: [
      { sa: "samādhi", gloss: "trance" },
      { sa: "bhāvana", gloss: "bringing about" },
      { sa: "arthaḥ", gloss: "for the purpose of" },
      { sa: "kleśa", gloss: "afflictions" },
      { sa: "tanūkaraṇārthaḥ", gloss: "for the purpose of attenuating" },
      { sa: "ca", gloss: "and" }
    ],
    translation: "For the cultivation of concentration and for the attenuation of the hindrances.",
    note: "States the twofold purpose of kriyā-yoga: to foster samādhi and to thin the kleśas.",
    src: SRC
  },
  {
    pada: 2, num: 3,
    devanagari: "अविद्यास्मितारागद्वेषाभिनिवेशाः क्लेशाः",
    iast: "avidyāsmitārāgadveṣābhiniveśāḥ kleśāḥ",
    words: [
      { sa: "avidyā", gloss: "nescience" },
      { sa: "asmitā", gloss: "egoism" },
      { sa: "rāga", gloss: "attachment" },
      { sa: "dveṣa", gloss: "aversion" },
      { sa: "abhiniveśa", gloss: "love of life" },
      { sa: "kleśāḥ", gloss: "afflictions" }
    ],
    translation: "Undifferentiated-consciousness (avidyā) and the feeling-of-personality and passion and aversion and the will-to-live are the five hindrances.",
    note: "Names the five kleśas (afflictions).",
    src: SRC
  },
  {
    pada: 2, num: 4,
    devanagari: "अविद्या क्षेत्रमुत्तरेषां प्रसुप्ततनुविच्छिन्नोदाराणाम्",
    iast: "avidyā kṣetramuttareṣāṃ prasuptatanuvicchinnodārāṇām",
    words: [
      { sa: "avidyā", gloss: "nescience" },
      { sa: "kṣetram", gloss: "field" },
      { sa: "uttareṣām", gloss: "for the others" },
      { sa: "prasupta", gloss: "dormant" },
      { sa: "tanu", gloss: "tenuous" },
      { sa: "vicchinna", gloss: "alternated" },
      { sa: "udārāṇām", gloss: "fully operative" }
    ],
    translation: "Undifferentiated-consciousness (avidyā) is the field for the others whether they be dormant or attenuated or intercepted or sustained.",
    note: "Avidyā is the field or seed-bed of the remaining four kleśas.",
    src: SRC
  },
  {
    pada: 2, num: 5,
    devanagari: "अनित्याशुचिदुःखानात्मसु नित्यशुचिसुखात्मख्यातिरविद्या",
    iast: "anityāśuciduḥkhānātmasu nityaśucisukhātmakhyātiravidyā",
    words: [
      { sa: "anitya", gloss: "non-eternal" },
      { sa: "aśuci", gloss: "impure" },
      { sa: "duḥkha", gloss: "painful" },
      { sa: "anātman", gloss: "not self" },
      { sa: "nitya", gloss: "eternal" },
      { sa: "śuci", gloss: "pure" },
      { sa: "sukha", gloss: "pleasurable" },
      { sa: "ātman", gloss: "soul" },
      { sa: "khyātiḥ", gloss: "taking to be, supposing" },
      { sa: "avidyā", gloss: "nescience" }
    ],
    translation: "The recognition of the permanent, of the pure, of pleasure, and of a self in what is impermanent, impure, pain, and not-self is undifferentiated-consciousness.",
    note: "Defines avidyā as mistaking the impermanent, impure, painful and not-self for their opposites.",
    src: SRC
  },
  {
    pada: 2, num: 6,
    devanagari: "दृग्दर्शनशक्त्योरेकात्मतेवास्मिता",
    iast: "dṛgdarśanaśaktyorekātmatevāsmitā",
    words: [
      { sa: "dṛk", gloss: "the subjective power of consciousness" },
      { sa: "darśana", gloss: "the instrumental power of seeing" },
      { sa: "śaktyoḥ", gloss: "of both these powers" },
      { sa: "ekātmatā", gloss: "identity" },
      { sa: "iva", gloss: "appearance" },
      { sa: "asmitā", gloss: "egoism" }
    ],
    translation: "When the power of seeing and the power by which one sees have the appearance (iva) of being a single-self, [this is] the feeling-of-personality.",
    note: "Defines asmitā (the feeling-of-personality).",
    src: SRC
  },
  {
    pada: 2, num: 7,
    devanagari: "सुखानुशयी रागः",
    iast: "sukhānuśayī rāgaḥ",
    words: [
      { sa: "sukha", gloss: "pleasure" },
      { sa: "anuśayī", gloss: "sequential attraction to" },
      { sa: "rāgaḥ", gloss: "attachment" }
    ],
    translation: "Passion is that which dwells upon pleasure.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 8,
    devanagari: "दुःखानुशयी द्वेषः",
    iast: "duḥkhānuśayī dveṣaḥ",
    words: [
      { sa: "duḥkha", gloss: "pain" },
      { sa: "anuśayī", gloss: "sequential repulsion" },
      { sa: "dveṣaḥ", gloss: "aversion" }
    ],
    translation: "Aversion is that which dwells upon pain.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 9,
    devanagari: "स्वरसवाही विदुषोऽपि तथारूढोऽभिनिवेशः",
    iast: "svarasavāhī viduṣo'pi tathārūḍho'bhiniveśaḥ",
    words: [
      { sa: "sva", gloss: "by its own potency" },
      { sa: "rasavāhī", gloss: "flowing" },
      { sa: "viduṣaḥ", gloss: "in the wise" },
      { sa: "api", gloss: "even" },
      { sa: "tathā", gloss: "all the same" },
      { sa: "rūḍhaḥ", gloss: "established" },
      { sa: "abhiniveśaḥ", gloss: "love of life" }
    ],
    translation: "The will-to-live (abhiniveśa) sweeping on [by the force of] its own nature exists in this form even in the wise.",
    note: "Abhiniveśa (the will-to-live) clings on even in the wise.",
    src: SRC
  },
  {
    pada: 2, num: 10,
    devanagari: "ते प्रतिप्रसवहेयाः सूक्ष्माः",
    iast: "te pratiprasavaheyāḥ sūkṣmāḥ",
    words: [
      { sa: "te", gloss: "these" },
      { sa: "prati-prasava", gloss: "along with the passing out of activity" },
      { sa: "heyāḥ", gloss: "that are destroyed" },
      { sa: "sūkṣmāḥ", gloss: "when but potential" }
    ],
    translation: "These [hindrances] [when they have become] subtile are to be escaped by the inverse-propagation.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 11,
    devanagari: "ध्यानहेयास्तद्वृत्तयः",
    iast: "dhyānaheyāstadvṛttayaḥ",
    words: [
      { sa: "dhyāna", gloss: "by meditation" },
      { sa: "heyāḥ", gloss: "that are destroyed" },
      { sa: "tad", gloss: "their" },
      { sa: "vṛttayaḥ", gloss: "modifications" }
    ],
    translation: "The fluctuations of these should be escaped by means of contemplation.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 12,
    devanagari: "क्लेशमूलः कर्माशयो दृष्टादृष्टजन्मवेदनीयः",
    iast: "kleśamūlaḥ karmāśayo dṛṣṭādṛṣṭajanmavedanīyaḥ",
    words: [
      { sa: "kleśa", gloss: "afflictions" },
      { sa: "mūla", gloss: "origin (having its origin in)" },
      { sa: "karma", gloss: "of actions" },
      { sa: "āśayaḥ", gloss: "the vehicle" },
      { sa: "dṛṣṭa", gloss: "visible" },
      { sa: "adṛṣṭa", gloss: "invisible" },
      { sa: "janma", gloss: "in births" },
      { sa: "vedanīyaḥ", gloss: "to be experienced" }
    ],
    translation: "The latent-deposit of karma has its root in the hindrances and may be felt in a birth seen or in a birth unseen.",
    note: "The karmāśaya (deposit of karma) is rooted in the kleśas.",
    src: SRC
  },
  {
    pada: 2, num: 13,
    devanagari: "सति मूले तद्विपाको जात्यायुर्भोगाः",
    iast: "sati mūle tadvipāko jātyāyurbhogāḥ",
    words: [
      { sa: "sati", gloss: "if existing" },
      { sa: "mūle", gloss: "be the root" },
      { sa: "tad", gloss: "its" },
      { sa: "vipākaḥ", gloss: "ripening" },
      { sa: "jāti", gloss: "life-state" },
      { sa: "āyuḥ", gloss: "life-time" },
      { sa: "bhogāḥ", gloss: "life-experience" }
    ],
    translation: "So long as the root exists, there will be fruition from it [that is] birth [and] length-of-life [and] kind-of-experience.",
    note: "Its threefold fruition is jāti (birth), āyus (life-span) and bhoga (experience).",
    src: SRC
  },
  {
    pada: 2, num: 14,
    devanagari: "ते ह्लादपरितापफलाः पुण्यापुण्यहेतुत्वात्",
    iast: "te hlādaparitāpaphalāḥ puṇyāpuṇyahetutvāt",
    words: [
      { sa: "te", gloss: "they" },
      { sa: "hlāda", gloss: "pleasure" },
      { sa: "paritāpa", gloss: "pain" },
      { sa: "phalāḥ", gloss: "fruits" },
      { sa: "puṇya", gloss: "virtue" },
      { sa: "apuṇya", gloss: "vice" },
      { sa: "hetutvāt", gloss: "because virtue and vice are their causes" }
    ],
    translation: "These [fruitions] have joy or extreme anguish as results in accordance with the quality of their causes whether merit or demerit.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 15,
    devanagari: "परिणामतापसंस्कारदुःखैर्गुणवृत्तिविरोधाच्च दुःखमेव सर्वं विवेकिनः",
    iast: "pariṇāmatāpasaṃskāraduḥkhairguṇavṛttivirodhācca duḥkhameva sarvaṃ vivekinaḥ",
    words: [
      { sa: "pariṇāma", gloss: "of change" },
      { sa: "tāpa", gloss: "anxiety" },
      { sa: "saṃskāra", gloss: "habituation" },
      { sa: "duḥkhaiḥ", gloss: "by reason of the pains" },
      { sa: "guṇa", gloss: "of the qualities" },
      { sa: "vṛttiḥ", gloss: "of the functionings" },
      { sa: "virodhāt", gloss: "by reason of the contrariety" },
      { sa: "ca", gloss: "and" },
      { sa: "duḥkham", gloss: "pain" },
      { sa: "eva", gloss: "indeed" },
      { sa: "sarvam", gloss: "all" },
      { sa: "vivekinaḥ", gloss: "to the discriminating" }
    ],
    translation: "As being the pains which are mutations and anxieties and subliminal-impressions, and by reason of the opposition of the fluctuations of the aspects (guṇa),—to the discriminating all is nothing but pain.",
    note: "'All is pain to the discriminating' — the pains of change, anxiety and habituation.",
    src: SRC
  },
  {
    pada: 2, num: 16,
    devanagari: "हेयं दुःखमनागतम्",
    iast: "heyaṃ duḥkhamanāgatam",
    words: [
      { sa: "heyam", gloss: "the avoidable" },
      { sa: "duḥkham", gloss: "pain" },
      { sa: "anāgatam", gloss: "not-yet-come" }
    ],
    translation: "That which is to be escaped is pain yet to come.",
    note: "Only pain not-yet-come can be avoided.",
    src: SRC
  },
  {
    pada: 2, num: 17,
    devanagari: "द्रष्टृदृश्ययोः संयोगो हेयहेतुः",
    iast: "draṣṭṛdṛśyayoḥ saṃyogo heyahetuḥ",
    words: [
      { sa: "draṣṭṛ", gloss: "of the knower" },
      { sa: "dṛśyayoḥ", gloss: "and of the knowable" },
      { sa: "saṃyogaḥ", gloss: "conjunction" },
      { sa: "heya", gloss: "of the avoidable pain" },
      { sa: "hetuḥ", gloss: "the cause" }
    ],
    translation: "The correlation of the Seer and the object-of-sight is the cause of that which is to be escaped.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 18,
    devanagari: "प्रकाशक्रियास्थितिशीलं भूतेन्द्रियात्मकं भोगापवर्गार्थं दृश्यम्",
    iast: "prakāśakriyāsthitiśīlaṃ bhūtendriyātmakaṃ bhogāpavargārthaṃ dṛśyam",
    words: [
      { sa: "prakāśa", gloss: "illumination" },
      { sa: "kriyā", gloss: "activity" },
      { sa: "sthiti", gloss: "inertia" },
      { sa: "śīlam", gloss: "nature" },
      { sa: "bhūta", gloss: "elements" },
      { sa: "indriya", gloss: "powers of sensation" },
      { sa: "ātmakam", gloss: "consisting of" },
      { sa: "bhoga", gloss: "experience" },
      { sa: "apavarga", gloss: "emancipation" },
      { sa: "artham", gloss: "object" },
      { sa: "dṛśyam", gloss: "knowable" }
    ],
    translation: "With a disposition to brightness and to activity and to inertia, and with the elements and the organs as its essence, and with its purpose the experience and the liberation [of the Self],—[this is] the object-of-sight.",
    note: "Describes the dṛśya (object-of-sight): the guṇas, elements and organs, serving experience and liberation.",
    src: SRC
  },
  {
    pada: 2, num: 19,
    devanagari: "विशेषाविशेषलिङ्गमात्रालिङ्गानि गुणपर्वाणि",
    iast: "viśeṣāviśeṣaliṅgamātrāliṅgāni guṇaparvāṇi",
    words: [
      { sa: "viśeṣa", gloss: "specialised" },
      { sa: "aviśeṣa", gloss: "unspecialised" },
      { sa: "liṅga-mātra", gloss: "undifferentiated phenomenal" },
      { sa: "aliṅgāni", gloss: "noumenal" },
      { sa: "guṇa", gloss: "of the qualities" },
      { sa: "parvāṇi", gloss: "stages" }
    ],
    translation: "The particularized and the unparticularized [forms] and the resoluble only [into primary matter] and irresoluble-primary-matter—are the divisions of the aspects (guṇa).",
    note: "The four stages (parvan) of the guṇas.",
    src: SRC
  },
  {
    pada: 2, num: 20,
    devanagari: "द्रष्टा दृशिमात्रः शुद्धोऽपि प्रत्ययानुपश्यः",
    iast: "draṣṭā dṛśimātraḥ śuddho'pi pratyayānupaśyaḥ",
    words: [
      { sa: "draṣṭā", gloss: "the seer" },
      { sa: "dṛśimātraḥ", gloss: "consciousness only" },
      { sa: "śuddhaḥ", gloss: "pure" },
      { sa: "api", gloss: "even though" },
      { sa: "pratyaya", gloss: "by imitation (ideas)" },
      { sa: "anupaśyaḥ", gloss: "cognizing ideas" }
    ],
    translation: "The Seer, who is nothing but [the power of] seeing, although undefiled (śuddha), looks upon the presented-idea.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 21,
    devanagari: "तदर्थ एव दृश्यस्यात्मा",
    iast: "tadartha eva dṛśyasyātmā",
    words: [
      { sa: "tad", gloss: "his" },
      { sa: "arthaḥ", gloss: "purpose (for his purpose)" },
      { sa: "dṛśyasya", gloss: "of the knowable" },
      { sa: "ātmā", gloss: "being, existence" }
    ],
    translation: "The being (ātman) of the object-of-sight is only for the sake of it [the Self].",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 22,
    devanagari: "कृतार्थं प्रति नष्टमप्यनष्टं तदन्यसाधारणत्वात्",
    iast: "kṛtārthaṃ prati naṣṭamapyanaṣṭaṃ tadanyasādhāraṇatvāt",
    words: [
      { sa: "kṛtārtham", gloss: "whose objects have been achieved" },
      { sa: "prati", gloss: "to him" },
      { sa: "naṣṭam", gloss: "destroyed" },
      { sa: "api", gloss: "although" },
      { sa: "anaṣṭam", gloss: "not destroyed" },
      { sa: "tad", gloss: "from that" },
      { sa: "anya", gloss: "to others" },
      { sa: "sādhāraṇatvāt", gloss: "owing to commonness" }
    ],
    translation: "Though it has ceased [to be seen] in the case of one whose purpose is accomplished, it has not ceased to be, since it is common to others [besides himself].",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 23,
    devanagari: "स्वस्वामिशक्त्योः स्वरूपोपलब्धिहेतुः संयोगः",
    iast: "svasvāmiśaktyoḥ svarūpopalabdhihetuḥ saṃyogaḥ",
    words: [
      { sa: "sva", gloss: "of being owned" },
      { sa: "svāmi", gloss: "of owning" },
      { sa: "śaktyoḥ", gloss: "of the powers of both" },
      { sa: "svarūpa", gloss: "of the natures" },
      { sa: "upalabdhi", gloss: "the recognition" },
      { sa: "hetuḥ", gloss: "that brings about" },
      { sa: "saṃyogaḥ", gloss: "conjunction" }
    ],
    translation: "The reason for the apperception of what the power of the property and of what the power of the proprietor are is correlation.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 24,
    devanagari: "तस्य हेतुरविद्या",
    iast: "tasya heturavidyā",
    words: [
      { sa: "tasya", gloss: "its" },
      { sa: "hetuḥ", gloss: "effective cause" },
      { sa: "avidyā", gloss: "nescience" }
    ],
    translation: "The reason for this [correlation] is undifferentiated-consciousness (avidyā).",
    note: "Avidyā is the cause of the saṃyoga (correlation).",
    src: SRC
  },
  {
    pada: 2, num: 25,
    devanagari: "तदभावात् संयोगाभावो हानं तद्दृशेः कैवल्यम्",
    iast: "tadabhāvāt saṃyogābhāvo hānaṃ taddṛśeḥ kaivalyam",
    words: [
      { sa: "tad", gloss: "its" },
      { sa: "abhāvāt", gloss: "on account of disappearance" },
      { sa: "saṃyoga-abhāvaḥ", gloss: "the disappearance of conjunction" },
      { sa: "hānam", gloss: "removal" },
      { sa: "tad", gloss: "that" },
      { sa: "dṛśeḥ", gloss: "of the knower" },
      { sa: "kaivalyam", gloss: "absolute freedom" }
    ],
    translation: "Since this [non-sight] does not exist, there is no correlation. This is the escape, the Isolation of the Seer.",
    note: "Kaivalya (Isolation) is the cessation of correlation once avidyā is gone.",
    src: SRC
  },
  {
    pada: 2, num: 26,
    devanagari: "विवेकख्यातिरविप्लवा हानोपायः",
    iast: "vivekakhyātiraviplavā hānopāyaḥ",
    words: [
      { sa: "viveka", gloss: "of discrimination" },
      { sa: "khyātiḥ", gloss: "knowledge" },
      { sa: "aviplavā", gloss: "undisturbed" },
      { sa: "hāna", gloss: "of the removal" },
      { sa: "upāyaḥ", gloss: "the means" }
    ],
    translation: "The means of attaining escape is unwavering discriminative discernment.",
    note: "Viveka-khyāti (unwavering discriminative discernment) is the means of escape.",
    src: SRC
  },
  {
    pada: 2, num: 27,
    devanagari: "तस्य सप्तधा प्रान्तभूमिः प्रज्ञा",
    iast: "tasya saptadhā prāntabhūmiḥ prajñā",
    words: [
      { sa: "tasya", gloss: "his" },
      { sa: "saptadhā", gloss: "sevenfold" },
      { sa: "prānta-bhūmiḥ", gloss: "final at each stage" },
      { sa: "prajñā", gloss: "discrimination" }
    ],
    translation: "For him [there is] insight seven-fold and advancing in stages to the highest.",
    note: "The insight (prajñā) is sevenfold, rising by stages.",
    src: SRC
  },
  {
    pada: 2, num: 28,
    devanagari: "योगाङ्गानुष्ठानादशुद्धिक्षये ज्ञानदीप्तिरा विवेकख्यातेः",
    iast: "yogāṅgānuṣṭhānādaśuddhikṣaye jñānadīptirā vivekakhyāteḥ",
    words: [
      { sa: "yoga", gloss: "of yoga" },
      { sa: "aṅga", gloss: "of the accessories" },
      { sa: "anuṣṭhānāt", gloss: "by the sustained practice" },
      { sa: "aśuddhi", gloss: "of impurity" },
      { sa: "kṣaye", gloss: "on the destruction" },
      { sa: "jñāna", gloss: "of wisdom" },
      { sa: "dīptiḥ", gloss: "the light" },
      { sa: "ā", gloss: "reaching up to" },
      { sa: "viveka", gloss: "of discrimination" },
      { sa: "khyāteḥ", gloss: "the knowledge" }
    ],
    translation: "After the aids to yoga have been followed up, when the impurity has dwindled, there is an enlightenment of perception reaching up to the discriminative discernment.",
    note: "Introduces the eight aids (aṣṭāṅga) whose practice destroys impurity.",
    src: SRC
  },
  {
    pada: 2, num: 29,
    devanagari: "यमनियमासनप्राणायामप्रत्याहारधारणाध्यानसमाधयोऽष्टावङ्गानि",
    iast: "yamaniyamāsanaprāṇāyāmapratyāhāradhāraṇādhyānasamādhayo'ṣṭāvaṅgāni",
    words: [
      { sa: "yama", gloss: "restraint" },
      { sa: "niyama", gloss: "observance" },
      { sa: "āsana", gloss: "posture" },
      { sa: "prāṇāyāma", gloss: "regulation of breath" },
      { sa: "pratyāhāra", gloss: "abstraction" },
      { sa: "dhāraṇā", gloss: "concentration" },
      { sa: "dhyāna", gloss: "meditation" },
      { sa: "samādhi", gloss: "trance" },
      { sa: "aṣṭau", gloss: "eight" },
      { sa: "aṅgāni", gloss: "accessories" }
    ],
    translation: "Abstentions and observances and postures and regulations-of-the-breath and withdrawal-of-the-senses and fixed attention and contemplation and concentration are the eight aids.",
    note: "Lists the eight limbs (aṣṭāṅga): yama, niyama, āsana, prāṇāyāma, pratyāhāra, dhāraṇā, dhyāna, samādhi.",
    src: SRC
  },
  {
    pada: 2, num: 30,
    devanagari: "अहिंसासत्यास्तेयब्रह्मचर्यापरिग्रहा यमाः",
    iast: "ahiṃsāsatyāsteyabrahmacaryāparigrahā yamāḥ",
    words: [
      { sa: "ahiṃsā", gloss: "abstinence from injury" },
      { sa: "satya", gloss: "veracity" },
      { sa: "asteya", gloss: "abstinence from theft" },
      { sa: "brahmacarya", gloss: "continence" },
      { sa: "aparigraha", gloss: "abstinence from avariciousness" },
      { sa: "yamāḥ", gloss: "restraints" }
    ],
    translation: "Abstinence from injury and from falsehood and from theft and from incontinence and from acceptance of gifts are the abstentions.",
    note: "Names the five yamas: ahiṃsā, satya, asteya, brahmacarya, aparigraha.",
    src: SRC
  },
  {
    pada: 2, num: 31,
    devanagari: "जातिदेशकालसमयानवच्छिन्नाः सार्वभौमा महाव्रतम्",
    iast: "jātideśakālasamayānavacchinnāḥ sārvabhaumā mahāvratam",
    words: [
      { sa: "jāti", gloss: "life-state" },
      { sa: "deśa", gloss: "space" },
      { sa: "kāla", gloss: "time" },
      { sa: "samaya", gloss: "circumstance" },
      { sa: "anavacchinnāḥ", gloss: "not limited by" },
      { sa: "sārva-bhaumāḥ", gloss: "universal" },
      { sa: "mahāvratam", gloss: "the great vow" }
    ],
    translation: "When they are unqualified by species or place or time or exigency and when [covering] all [these] classes—[under these circumstances exists] the Great Course-of-conduct.",
    note: "The yamas kept universally, unconditioned by birth, place, time or circumstance, are the mahāvrata (great vow).",
    src: SRC
  },
  {
    pada: 2, num: 32,
    devanagari: "शौचसन्तोषतपःस्वाध्यायेश्वरप्रणिधानानि नियमाः",
    iast: "śaucasantoṣatapaḥsvādhyāyeśvarapraṇidhānāni niyamāḥ",
    words: [
      { sa: "śauca", gloss: "cleanliness" },
      { sa: "santoṣa", gloss: "contentment" },
      { sa: "tapaḥ", gloss: "purificatory action" },
      { sa: "svādhyāya", gloss: "study" },
      { sa: "īśvara-praṇidhāna", gloss: "making of God the motive of all action" },
      { sa: "niyamāḥ", gloss: "observances" }
    ],
    translation: "Cleanliness and contentment and self-castigation and study and devotion to the Īśvara are the observances.",
    note: "Names the five niyamas: śauca, santoṣa, tapas, svādhyāya, īśvara-praṇidhāna.",
    src: SRC
  },
  {
    pada: 2, num: 33,
    devanagari: "वितर्कबाधने प्रतिपक्षभावनम्",
    iast: "vitarkabādhane pratipakṣabhāvanam",
    words: [
      { sa: "vitarka", gloss: "of the thoughts of sin" },
      { sa: "bādhane", gloss: "on the troubling of" },
      { sa: "pratipakṣa", gloss: "to the contrary" },
      { sa: "bhāvanam", gloss: "habituation" }
    ],
    translation: "If there be inhibition by perverse-considerations (vitarka), there should be cultivation of the opposites.",
    note: "Prescribes pratipakṣa-bhāvanā — cultivating the contrary thought.",
    src: SRC
  },
  {
    pada: 2, num: 34,
    devanagari: "वितर्का हिंसादयः कृतकारितानुमोदिता लोभक्रोधमोहपूर्वका मृदुमध्याधिमात्रा दुःखाज्ञानानन्तफला इति प्रतिपक्षभावनम्",
    iast: "vitarkā hiṃsādayaḥ kṛtakāritānumoditā lobhakrodhamohapūrvakā mṛdumadhyādhimātrā duḥkhājñānānantaphalā iti pratipakṣabhāvanam",
    words: [
      { sa: "vitarkāḥ", gloss: "thoughts of sin" },
      { sa: "hiṃsādayaḥ", gloss: "causing of injury to others and the rest" },
      { sa: "kṛta", gloss: "done" },
      { sa: "kārita", gloss: "caused to be done" },
      { sa: "anumoditāḥ", gloss: "permitted to be done" },
      { sa: "lobha", gloss: "desire" },
      { sa: "krodha", gloss: "anger" },
      { sa: "moha", gloss: "ignorance" },
      { sa: "pūrvakāḥ", gloss: "preceded by" },
      { sa: "mṛdu", gloss: "slight" },
      { sa: "madhya", gloss: "middling" },
      { sa: "adhimātrāḥ", gloss: "intense" },
      { sa: "duḥkha", gloss: "pain" },
      { sa: "ajñāna", gloss: "unwisdom" },
      { sa: "ananta", gloss: "infinite" },
      { sa: "phalāḥ", gloss: "fruits, result" },
      { sa: "iti", gloss: "thus" },
      { sa: "pratipakṣa", gloss: "to the contrary" },
      { sa: "bhāvanam", gloss: "thinking" }
    ],
    translation: "Since perverse-considerations such as injuries, whether done or caused to be done or approved, whether ensuing upon greed or anger or infatuation, whether mild or moderate or vehement, find their unending consequences in pain and in lack of thinking, there should be the cultivation of their opposites.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 35,
    devanagari: "अहिंसाप्रतिष्ठायां तत्सन्निधौ वैरत्यागः",
    iast: "ahiṃsāpratiṣṭhāyāṃ tatsannidhau vairatyāgaḥ",
    words: [
      { sa: "ahiṃsā", gloss: "of not causing injury" },
      { sa: "pratiṣṭhāyām", gloss: "on the confirmation of" },
      { sa: "tat", gloss: "his" },
      { sa: "sannidhau", gloss: "in presence" },
      { sa: "vairatyāgaḥ", gloss: "giving up of hostilities" }
    ],
    translation: "As soon as he is grounded in abstinence from injury, his presence begets a suspension of enmity.",
    note: "Siddhi of ahiṃsā: hostility ceases in the yogin's presence.",
    src: SRC
  },
  {
    pada: 2, num: 36,
    devanagari: "सत्यप्रतिष्ठायां क्रियाफलाश्रयत्वम्",
    iast: "satyapratiṣṭhāyāṃ kriyāphalāśrayatvam",
    words: [
      { sa: "satya", gloss: "of veracity" },
      { sa: "pratiṣṭhāyām", gloss: "in the confirmation" },
      { sa: "kriyā", gloss: "of action" },
      { sa: "phala", gloss: "of fruition" },
      { sa: "āśrayatvam", gloss: "the dependence of" }
    ],
    translation: "As soon as he is grounded in abstinence from falsehood, actions and consequences depend upon him.",
    note: "Siddhi of satya.",
    src: SRC
  },
  {
    pada: 2, num: 37,
    devanagari: "अस्तेयप्रतिष्ठायां सर्वरत्नोपस्थानम्",
    iast: "asteyapratiṣṭhāyāṃ sarvaratnopasthānam",
    words: [
      { sa: "asteya", gloss: "of not stealing" },
      { sa: "pratiṣṭhāyām", gloss: "in the confirmation of" },
      { sa: "sarva", gloss: "of all" },
      { sa: "ratna", gloss: "of jewels" },
      { sa: "upasthānam", gloss: "the approaching him of" }
    ],
    translation: "As soon as he is grounded in abstinence from theft, all jewels approach him.",
    note: "Siddhi of asteya.",
    src: SRC
  },
  {
    pada: 2, num: 38,
    devanagari: "ब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः",
    iast: "brahmacaryapratiṣṭhāyāṃ vīryalābhaḥ",
    words: [
      { sa: "brahmacarya", gloss: "continence" },
      { sa: "pratiṣṭhāyām", gloss: "in the confirmation" },
      { sa: "vīrya", gloss: "vigour" },
      { sa: "lābhaḥ", gloss: "obtaining" }
    ],
    translation: "As soon as he is grounded in abstinence from incontinence, he acquires energy.",
    note: "Siddhi of brahmacarya.",
    src: SRC
  },
  {
    pada: 2, num: 39,
    devanagari: "अपरिग्रहस्थैर्ये जन्मकथन्तासम्बोधः",
    iast: "aparigrahasthairye janmakathantāsambodhaḥ",
    words: [
      { sa: "aparigraha", gloss: "of non-covetousness" },
      { sa: "sthairye", gloss: "in the confirmation" },
      { sa: "janma-kathaṃtā", gloss: "of the how of births" },
      { sa: "saṃbodhaḥ", gloss: "the knowledge" }
    ],
    translation: "As soon as he is established in abstinence-from-acceptance-of-gifts, a thorough illumination upon the conditions of birth [becomes his].",
    note: "Siddhi of aparigraha; Woods' comment supplies '[becomes his]' to complete the sūtra.",
    src: SRC
  },
  {
    pada: 2, num: 40,
    devanagari: "शौचात् स्वाङ्गजुगुप्सा परैरसंसर्गः",
    iast: "śaucāt svāṅgajugupsā parairasaṃsargaḥ",
    words: [
      { sa: "śaucāt", gloss: "by cleanliness" },
      { sa: "svāṅga", gloss: "to one's own body" },
      { sa: "jugupsā", gloss: "disinclination" },
      { sa: "paraiḥ", gloss: "with others" },
      { sa: "asaṃsargaḥ", gloss: "cessation of contact" }
    ],
    translation: "As a result of cleanliness there is disgust at one's own body and no intercourse with others.",
    note: "Siddhi of śauca (outer purity).",
    src: SRC
  },
  {
    pada: 2, num: 41,
    devanagari: "सत्त्वशुद्धिसौमनस्यैकाग्र्येन्द्रियजयात्मदर्शनयोग्यत्वानि च",
    iast: "sattvaśuddhisaumanasyaikāgryendriyajayātmadarśanayogyatvāni ca",
    words: [
      { sa: "sattva", gloss: "of the essence" },
      { sa: "śuddhi", gloss: "on the purification" },
      { sa: "saumanasya", gloss: "high-mindedness" },
      { sa: "ekāgrya", gloss: "one-pointedness" },
      { sa: "indriya", gloss: "of the senses" },
      { sa: "jaya", gloss: "control" },
      { sa: "ātma", gloss: "of the self" },
      { sa: "darśana", gloss: "the knowledge" },
      { sa: "yogyatva", gloss: "fitness" },
      { sa: "ca", gloss: "and" }
    ],
    translation: "Purity of sattva and gentleness and singleness-of-intent and subjugation of the senses and fitness for the sight of the self [arise].",
    note: "Siddhi of śauca (inner); Woods notes the verb '[arise]' completes the sūtra.",
    src: SRC
  },
  {
    pada: 2, num: 42,
    devanagari: "सन्तोषादनुत्तमसुखलाभः",
    iast: "santoṣādanuttamasukhalābhaḥ",
    words: [
      { sa: "santoṣāt", gloss: "by contentment" },
      { sa: "anuttamaḥ", gloss: "excellent, extreme" },
      { sa: "sukha", gloss: "of happiness" },
      { sa: "lābhaḥ", gloss: "acquisition" }
    ],
    translation: "As a result of contentment there is an acquisition of superlative pleasure.",
    note: "Siddhi of santoṣa.",
    src: SRC
  },
  {
    pada: 2, num: 43,
    devanagari: "कायेन्द्रियसिद्धिरशुद्धिक्षयात् तपसः",
    iast: "kāyendriyasiddhiraśuddhikṣayāt tapasaḥ",
    words: [
      { sa: "kāya", gloss: "of the physical body" },
      { sa: "indriya", gloss: "of the senses" },
      { sa: "siddhiḥ", gloss: "the attainment" },
      { sa: "aśuddhi", gloss: "of impurity" },
      { sa: "kṣayāt", gloss: "owing to the removal" },
      { sa: "tapasaḥ", gloss: "through purificatory actions" }
    ],
    translation: "Perfection in the body and in the organs after impurity has dwindled as a result of self-castigation.",
    note: "Siddhi of tapas.",
    src: SRC
  },
  {
    pada: 2, num: 44,
    devanagari: "स्वाध्यायाद् इष्टदेवतासम्प्रयोगः",
    iast: "svādhyāyād iṣṭadevatāsamprayogaḥ",
    words: [
      { sa: "svādhyāyāt", gloss: "by study" },
      { sa: "iṣṭa-devatā", gloss: "with the desired deity" },
      { sa: "samprayogaḥ", gloss: "communion" }
    ],
    translation: "As a result of study there is communion with the chosen deity.",
    note: "Siddhi of svādhyāya.",
    src: SRC
  },
  {
    pada: 2, num: 45,
    devanagari: "समाधिसिद्धिरीश्वरप्रणिधानात्",
    iast: "samādhisiddhirīśvarapraṇidhānāt",
    words: [
      { sa: "samādhi", gloss: "of trance" },
      { sa: "siddhiḥ", gloss: "the attainment" },
      { sa: "īśvara-praṇidhānāt", gloss: "by making Īśvara the motive of all actions" }
    ],
    translation: "Perfection of concentration as a result of devotion to the Īśvara.",
    note: "Siddhi of īśvara-praṇidhāna: perfection of samādhi.",
    src: SRC
  },
  {
    pada: 2, num: 46,
    devanagari: "स्थिरसुखम् आसनम्",
    iast: "sthirasukham āsanam",
    words: [
      { sa: "sthira", gloss: "steady" },
      { sa: "sukham", gloss: "easy" },
      { sa: "āsanam", gloss: "posture" }
    ],
    translation: "Stable-and-easy posture.",
    note: "The sūtra names no posture; Vyāsa's bhāṣya lists about eleven (padmāsana, vīrāsana, etc.) — see the wing's theory page. sanskritdocuments prints 'स्थिरसुखम् आसनम्' with a space, kept here.",
    src: SRC
  },
  {
    pada: 2, num: 47,
    devanagari: "प्रयत्नशैथिल्यानन्तसमापत्तिभ्याम्",
    iast: "prayatnaśaithilyānantasamāpattibhyām",
    words: [
      { sa: "prayatna", gloss: "effort" },
      { sa: "śaithilya", gloss: "slackening" },
      { sa: "ananta", gloss: "infinite (also the serpent Ananta)" },
      { sa: "samāpattibhyām", gloss: "thought-transformation" }
    ],
    translation: "By relaxation of effort or by a [mental] state-of-balance with reference to Ananta [a posture results].",
    note: "The means of steadying āsana; Woods' comment supplies '[a posture results]'.",
    src: SRC
  },
  {
    pada: 2, num: 48,
    devanagari: "ततो द्वन्द्वानभिघातः",
    iast: "tato dvandvānabhighātaḥ",
    words: [
      { sa: "tataḥ", gloss: "then" },
      { sa: "dvandva", gloss: "from the pairs of opposites" },
      { sa: "anabhighātaḥ", gloss: "cessation of disturbance" }
    ],
    translation: "Thereafter he is unassailed by extremes.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 49,
    devanagari: "तस्मिन्सति श्वासप्रश्वासयोर्गतिविच्छेदः प्राणायामः",
    iast: "tasminsati śvāsapraśvāsayorgativicchedaḥ prāṇāyāmaḥ",
    words: [
      { sa: "tasmin", gloss: "that (the posture)" },
      { sa: "sati", gloss: "being (secured)" },
      { sa: "śvāsa", gloss: "of the inspiratory breath" },
      { sa: "praśvāsayoḥ", gloss: "of the expiratory breath" },
      { sa: "gati", gloss: "of the movements" },
      { sa: "vicchedaḥ", gloss: "stoppage" },
      { sa: "prāṇāyāmaḥ", gloss: "regulation of breath" }
    ],
    translation: "When there is this [stability of posture], the restraint of breath cutting off the flow of inspiration and expiration [follows].",
    note: "Defines prāṇāyāma as the cutting-off of the flow of in- and out-breath.",
    src: SRC
  },
  {
    pada: 2, num: 50,
    devanagari: "बाह्याभ्यन्तरस्तम्भवृत्तिर्देशकालसङ्ख्याभिः परिदृष्टो दीर्घसूक्ष्मः",
    iast: "bāhyābhyantarastambhavṛttirdeśakālasaṅkhyābhiḥ paridṛṣṭo dīrghasūkṣmaḥ",
    words: [
      { sa: "bāhya", gloss: "external" },
      { sa: "ābhyantara", gloss: "internal" },
      { sa: "stambha", gloss: "total restraint" },
      { sa: "vṛttiḥ", gloss: "manifestation" },
      { sa: "deśa", gloss: "place" },
      { sa: "kāla", gloss: "time" },
      { sa: "saṅkhyā", gloss: "number" },
      { sa: "paridṛṣṭaḥ", gloss: "regulated" },
      { sa: "dīrgha", gloss: "long" },
      { sa: "sūkṣmaḥ", gloss: "subtle" }
    ],
    translation: "External or internal or suppressed in fluctuation and is regulated in place and time and number and is protracted and subtile.",
    note: "The three regulated forms (external, internal, suppressed), measured by place, time and number.",
    src: SRC
  },
  {
    pada: 2, num: 51,
    devanagari: "बाह्याभ्यन्तरविषयाक्षेपी चतुर्थः",
    iast: "bāhyābhyantaraviṣayākṣepī caturthaḥ",
    words: [
      { sa: "bāhya", gloss: "the external" },
      { sa: "ābhyantara", gloss: "the internal" },
      { sa: "viṣaya", gloss: "region, spheres" },
      { sa: "ākṣepī", gloss: "passing beyond" },
      { sa: "caturthaḥ", gloss: "the fourth" }
    ],
    translation: "The fourth [restraint of the breath] transcends the external and the internal object.",
    note: "The fourth prāṇāyāma, transcending external and internal objects.",
    src: SRC
  },
  {
    pada: 2, num: 52,
    devanagari: "ततः क्षीयते प्रकाशावरणम्",
    iast: "tataḥ kṣīyate prakāśāvaraṇam",
    words: [
      { sa: "tataḥ", gloss: "then" },
      { sa: "kṣīyate", gloss: "is destroyed" },
      { sa: "prakāśa", gloss: "of light" },
      { sa: "āvaraṇam", gloss: "the cover" }
    ],
    translation: "As a result of this the covering of the light dwindles away.",
    note: "",
    src: SRC
  },
  {
    pada: 2, num: 53,
    devanagari: "धारणासु च योग्यता मनसः",
    iast: "dhāraṇāsu ca yogyatā manasaḥ",
    words: [
      { sa: "dhāraṇāsu", gloss: "for concentration" },
      { sa: "ca", gloss: "and" },
      { sa: "yogyatā", gloss: "the fitness" },
      { sa: "manasaḥ", gloss: "of the mind" }
    ],
    translation: "For fixed attentions also the central organ becomes fit.",
    note: "Prāṇāyāma fits the mind for dhāraṇā (fixed attention).",
    src: SRC
  },
  {
    pada: 2, num: 54,
    devanagari: "स्वविषयासम्प्रयोगे चित्तस्वरूपानुकार इवेन्द्रियाणां प्रत्याहारः",
    iast: "svaviṣayāsamprayoge cittasvarūpānukāra ivendriyāṇāṃ pratyāhāraḥ",
    words: [
      { sa: "sva", gloss: "their own" },
      { sa: "viṣaya", gloss: "objects" },
      { sa: "asamprayoge", gloss: "on not coming into contact with" },
      { sa: "cittasya", gloss: "of the mind" },
      { sa: "svarūpa", gloss: "the nature" },
      { sa: "anukāraḥ", gloss: "the following of" },
      { sa: "iva", gloss: "as it were" },
      { sa: "indriyāṇām", gloss: "of the senses" },
      { sa: "pratyāhāraḥ", gloss: "abstraction" }
    ],
    translation: "The withdrawal of the senses is as it were the imitation of the mind-stuff itself on the part of the organs by disjoining themselves from their objects.",
    note: "Defines pratyāhāra (withdrawal of the senses).",
    src: SRC
  },
  {
    pada: 2, num: 55,
    devanagari: "ततः परमा वश्यतेन्द्रियाणाम्",
    iast: "tataḥ paramā vaśyatendriyāṇām",
    words: [
      { sa: "tataḥ", gloss: "thence" },
      { sa: "paramā", gloss: "the highest" },
      { sa: "vaśyatā", gloss: "control" },
      { sa: "indriyāṇām", gloss: "of the senses" }
    ],
    translation: "As a result of this [withdrawal] there is complete mastery of the organs.",
    note: "Result of pratyāhāra: complete mastery of the senses.",
    src: SRC
  }
];
