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
    bhashya: "Yoga is not perfected in one who is not self-castigated; tapas alone thins the beginningless impurity bred of the hindrances and of karma. Study (svādhyāya) is the repetition of purifying formulae such as the sacred syllable Om or the reading of books on liberation, and devotion to the Īśvara is the offering up of all one's actions to the Supreme Teacher and the renouncing of their fruit.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Given earnest attention, the yoga of action cultivates concentration and thins the hindrances to the point where, like seeds burned by the fire of Elevation, they can no longer germinate. The subtle insight that discriminates the sattva from the Self, no longer touched by them, then stands ready, its task done, for inverse-propagation.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The so-called hindrances are the five misconceptions; flowing out, they stiffen the sway of the guṇas, make mutation more fixed, and swell the stream of cause and effect. Interdependent and aiding one another, they bring about the fruition of karma.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Avidyā is the field or propagative soil of the other four, which occur in four states — dormant (a mere seed in the mind, roused by its object, yet burned to sterility in one who has reached Elevation), attenuated (overpowered by cultivating their opposites), intercepted (one suppressed while another is active, as anger is unfelt while love is felt), and sustained (fixed full upon its object). All are varieties of avidyā, which pervades them; when it dwindles, they dwindle too.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Avidyā is fourfold: taking the impermanent (earth, moon, stars, the gods) for permanent, the impure and repulsive body for pure, pain for pleasure, and the not-self — outer aids, body and mind — for the self. It is the root of the whole unbroken series of hindrances and karma; and, like the words 'foe' or 'trackless forest,' it is no mere absence of knowledge but a positive thing, a kind of thinking that is the reverse of knowledge.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The Self is the power of seeing and the thinking-substance the power by which one sees; the feeling-of-personality is the seeming fusion of these two utterly distinct powers into a single essence. So long as the enjoyer is not distinguished from the enjoyed, worldly experience is at hand; when each recovers its own nature, there is Isolation.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Passion is the greed, thirst, or desire that, in one who has known pleasure, follows on the memory of it and reaches out for that pleasure or for the means of gaining it.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Aversion is the repulsion, wrath, or anger that, in one who has known pain, follows on the memory of it and is directed against that pain or against whatever leads to it.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "In every living being the craving 'May I not cease to be! May I live!' rises ceaselessly, and it could only come from having already undergone death in former births. This fear of death, sweeping on by its own force and not learnt in this life through perception, inference, or teaching, is found alike in the most witless worm and in the wise.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When the five hindrances have become like burned seeds, they come to rest together with the mind-stuff as it is resolved back into its own cause, primary matter.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The coarse active fluctuations of the hindrances, once thinned by the yoga of action, are to be got rid of by Elevated contemplation until they are subtilized into burned seeds — just as a coarse stain on cloth is first shaken off and the finer stain then removed with effort and by proper means.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The deposit of karma, meritorious or demeritorious, springs from lust, greed, infatuation, or anger, and may be felt in a birth seen or in one unseen. Karma of keen intensity — from sacred formulae, self-castigation, and worship, or from repeated contempt shown to the helpless — ripens swiftly, as when Nandīśvara was raised to godhood and Nahuṣa cast down into a beast.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "So long as the hindrances remain as its root, the karma-deposit bears fruit, but not once that root is cut — just as unhusked, unburned rice-grains germinate while winnowed chaff or scorched seed cannot. This fruition is threefold — birth, length of life, and kind of experience — the accumulated karma of a lifetime being compacted at death into a single new existence.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Birth, length of life, and kind of experience yield pleasure when their cause is merit and pain when their cause is demerit. And because pleasure itself is counteractive, for the yogin even a moment of pleasure in an object is nothing but pain.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "To the discriminating all is pain — through the pain of mutation (pleasure breeds passion and never quenches thirst but only inflames it), the pain of anxiety, and the pain of subliminal-impressions (each pleasure or pain deposits a trace that renews the endless stream), and through the ceaseless mutual opposition of the guṇas that keeps the mind in flux. Sensitive as an eyeball, the yogin alone feels this and takes refuge in focused insight; and the system, like medicine, has four parts — the round of rebirth, its cause, release, and the means of release.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Past pain is gone beyond experience and present pain is already being felt, so neither can be avoided; only pain not yet come — which afflicts the yogin, sensitive as an eyeball — can still be so altered that it may be escaped.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The Seer is the Self made conscious by reflection of the thinking-substance, and the objects-of-sight are all the aspects that strike its sattva and, like a magnet acting by mere nearness, become the property of the Self whose nature is seeing. The beginningless correlation of these two powers is the cause of pain; and, as with knowing thorn, scratch, and sandal, once its cause is understood the pain can be prevented.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Sattva is disposed to brightness, rajas to activity, tamas to inertia; these guṇas together are the primary-cause, the object-of-sight, which mutates into the elements (earth and the rest, gross and subtle) and the organs. It works only for the Self's sake, serving two ends — experience (the ascertaining of desirable and undesirable things) and liberation (the ascertaining of the enjoyer himself) — and bondage and release, though really of the thinking-substance, are ascribed to the Self as victory or defeat is ascribed to a commander.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The four stages of the guṇas: the particularized forms are the five gross elements and the eleven organs, evolved from the six unparticularized forms — the five subtle elements (tanmātra) and the feeling-of-personality; these rest on the resoluble Great Substance (mahat), which rests on the irresoluble, unmanifest primary-cause. The unmanifest, effected by no purpose of the Self, is permanent, while the other three stages, produced for the Self's sake, are impermanent.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The Seer is nothing but the pure power of seeing, untouched by qualifications, who becomes conscious by reflection of the thinking-substance — neither wholly the same as it nor wholly other. The thinking-substance mutates (its object now known, now not) and exists for another's sake, whereas the Self does not mutate and always knows its object; yet, pure though he is, he beholds the presented-ideas and so seems to be what he is not.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The object-of-sight exists only for the Self's sake, as that on which his seeing acts; once it has accomplished the Self's purposes of experience and liberation, it is no longer seen by him. Thus it ceases as far as that Self is concerned, yet does not utterly cease to be.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The object-of-sight ceases only for the one Self whose purpose is accomplished; it does not cease to be, since it is common to all the other, unliberated Selves, for whom it remains something to be seen. Both powers being permanent, their conjunction is said to be beginningless.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Correlation is the Self, as proprietor, joined for the sake of sight with the object-of-sight as his property; the resulting apperception of the object is experience, and the apperception of the Seer himself is liberation. Since correlation lasts until right sight arises, sight is the cause of discorrelation and non-sight (avidyā) the instrumental cause of correlation — after which the bhāṣya surveys eight theories of what this non-sight may be.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The cause of the correlation is avidyā, the subliminal trace of erroneous thinking; a thinking-substance steeped in such traces never reaches the discernment of the Self and returns again with its task unfinished, whereas one that ends in that discernment, its work done and non-sight suppressed, does not return, since the cause of bondage is gone. Answering a scoffer's tale of the impotent man, the bhāṣya holds that release is the ceasing of the thinking-substance once its purpose is served.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When non-sight no longer exists there is no correlation of thinking-substance and Self, and bondage ends completely; this ending is the escape, the Isolation of the Seer — the Self's unmixed state, never again joined to the guṇas, established in his own self.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The means of escape is the discernment of the difference between the sattva and the Self; while erroneous perception is unrepressed this discernment wavers, but once that perception is burned to a seed that cannot sprout, the stream of discriminating ideas — in a sattva cleansed of the rajas of the hindrances — flows stainless, and this unwavering discernment is the path to release.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "For the yogin in whom discernment has arisen the insight is sevenfold — a fourfold release of insight (the thing to be escaped is understood, its causes have dwindled, the escape is directly seen in restriction, and the means has been cultivated, none needing to be done again) and a threefold release of the mind-stuff (the thinking-substance's task is ended; the guṇas, like boulders fallen from a peak, sink of themselves toward dissolution; and the Self, cut off from them and lit by himself alone, stands stainless and isolated).",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Practised, the eight aids to yoga wear away the fivefold misconception, and as the impurity dwindles the light of perception grows until it reaches the discriminative discernment that distinguishes the guṇas from the Self. This practice works like an axe that severs impurity and, like right conduct producing happiness, as the cause that attains discernment; the bhāṣya adds a scheme of the nine kinds of cause.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The eight aids are to be followed up in due succession, each to be described in what follows.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Non-injury is abstaining from malice toward all creatures in every way and at all times, and the other abstentions are rooted in it, serving to perfect it. Truthfulness is speech and thought that match the thing and serve all beings without ruining them; non-theft is refusing the unauthorized taking of others' valuables; continence is control of the generative organ; and non-acceptance-of-gifts is refusing possessions, seeing the harm in getting, keeping, losing, or clinging to them.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The abstentions may be limited by species (a fisherman harms only fish), by place ('not in a holy spot'), by time ('not on a sacred day'), or by exigency (the warrior's 'only in battle'); but kept universally, unqualified by any of these and covering every case, they become the Great Vow.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Cleanliness is outer (by earth, water, and pure food) and inner (the washing away of the mind's blemishes); contentment is not coveting beyond the means at hand; self-castigation is enduring extremes such as hunger, cold, and heat and observing fasts and penances; study is reciting books on release and repeating the sacred syllable; and devotion to the Īśvara is the offering up of all one's actions to the Supreme Teacher.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When perverse thoughts such as 'I will kill, lie, or steal from him who wrongs me' inflame the mind, the yogin should cultivate their opposites — reflecting that, baked on the coals of rebirth, he had taken refuge in yoga by protecting every creature, and that to return to such thoughts is to go back like a dog to its own vomit.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Perverse-considerations like injury are done, caused, or approved; spring from greed, anger, or infatuation; and are mild, moderate, or vehement — so twenty-seven kinds, subdivided to eighty-one and beyond number, and likewise for falsehood and the rest. Because they end without fail in pain and unwisdom — the injurer himself reaping weakened powers, torment in hells and beast-births, and a life ever at the point of death — one should cultivate their opposites.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The suspension of enmity is on the part of all living creatures: in the presence of one grounded in non-injury, even creatures of naturally hostile kinds give up their hostility.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When he is grounded in truthfulness his word governs act and consequence: if he tells a man 'Be righteous,' the man becomes righteous, and if he says 'Attain heaven,' the man attains it — whatever he says comes true.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When he is grounded in non-stealing, jewels approach him from every direction to become his.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When he is grounded in continence the yogin gains energy (vīrya), by which his unhindered powers increase; and once perfected he is able to transmit his knowledge to his pupils.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When established in non-acceptance-of-gifts, a full illumination of the conditions of birth becomes his: the desire to know 'Who was I? How was I? What shall I become, and how?' — his own state in past, future, and intervening times — is of itself fulfilled.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "As a result of cleanliness the yogin, seeing his body's offensiveness, grows disgusted with it, ceases to be attached, and becomes an ascetic; and perceiving its true nature and finding no purity even in his own washed body, he shrinks from bodily intercourse with others.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "From inner cleanliness there arise, in sequence, purity of sattva, then gentleness, then singleness of intent, then mastery of the senses, and finally the thinking-substance's fitness for the sight of the self.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "From contentment comes an unsurpassed happiness; as the saying goes, neither the pleasure of love in this world nor the supreme pleasure of heaven is worth a sixteenth part of the joy that comes when craving has dwindled away.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Self-castigation, as it perfects itself, destroys the defilement that veils in impurity, and from its removal come perfection of the body — powers such as shrinking to atomic size — and perfection of the organs, such as hearing and seeing at a distance.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "As a result of study the chosen deity is brought near: gods, sages, and perfected beings come within the yogin's sight and lend their aid to his work.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "One who surrenders his whole being to the Īśvara attains perfection of concentration, by which he knows, exactly as it is, whatever he wishes to know in other places, bodies, and times; thereafter his insight sees things as they truly are.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The sūtra names no single posture; the bhāṣya offers examples — the lotus-posture (padmāsana), the hero-posture (vīrāsana), the auspicious-posture, the staff-posture, the seated curlew, elephant, and camel, the even arrangement, and 'others of the same kind' — any seat that is steady and easy.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The posture is perfected when effort is relaxed, so that the body is no longer agitated, or when the mind-stuff enters a state of balance fixed upon Ananta, the endless serpent who upholds the earth upon his hoods.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Once the postures are mastered the yogin is no longer overcome by the pairs of opposites — cold and heat and the rest.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When posture is secured, breath-restraint follows: inspiration is the drawing in of the outer air and expiration the expelling of the inner air, and prāṇāyāma is the cutting off of the flow of both.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "Breath-restraint takes three forms — external (no flow after expiration), internal (no flow after inspiration), and the suppressed (both stopped at once by a single effort, like water vanishing on a scorching stone); each is regulated by place, time, and number, and so becomes protracted and subtle.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The fourth breath-restraint transcends both the external and the internal object: having, through gradual mastery of the stages, made out the spheres of expiration and inspiration, it passes beyond both and rests without flow. It differs from the third (the suppressed), which comes by a single effort with no regard to objects, whereas the fourth is reached by many efforts after attending to place, time, and number.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "By the practice of breath-restraint the karma that veils discriminative thinking is made powerless and dwindles moment by moment; as it is said, there is no austerity higher than prāṇāyāma, for from it come purity from defilement and the clear shining of thought.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "By the mere practice of breath-restraint the mind becomes fit for the fixed attentions, in keeping with the earlier teaching that steadiness may be gained by the expulsion and retention of breath.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "When the senses cease contact with their objects and, as it were, imitate the mind-stuff itself, they become restricted along with it, needing no separate effort — just as bees fly up and settle down after the king-bee. This following of the restricted mind-stuff by the organs is the withdrawal of the senses.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
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
    bhashya: "The bhāṣya reviews several views of mastery of the senses — absence of desire for objects, taking only what is unforbidden, contact with objects at will, or freedom from passion and aversion — but endorses Jaigīṣavya's: through the mind-stuff's singleness of intent the organs cease to engage objects, so that when the mind is restricted they are restricted with it, needing no further effort; and this singleness of intent is the complete mastery.",
    bhashyaSrc: 'after the Vyāsa-bhāṣya, trans. Woods (1914)',
    src: SRC
  }
];
