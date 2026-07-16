// ============================================================================
//  pada1.js — Pātañjala Yoga-sūtra, Book I: the SAMĀDHI-PĀDA, all 51 sūtras,
//  word-by-word, from public-domain sources.
//
//  Each record:
//    { pada, num, devanagari, iast, words:[{sa,gloss}], translation,
//      bhashya, bhashyaSrc, note, src }
//
//  `bhashya` — a 1-3 sentence English gist of the classical Vyāsa-bhāṣya on the
//  sūtra, an original paraphrase after James Haughton Woods's translation of the
//  Comment (HOS 17, 1914; public domain). `bhashyaSrc` labels its provenance.
//
//  Sources (per record, see `src`):
//   • Devanāgarī — sanskritdocuments.org (doc_yoga/yogasuutra.html). The source
//     carries Vedic svara accents (udātta U+0951, anudātta U+0952); ALL such
//     accent marks have been stripped here. Avagraha (ऽ), anusvāra, visarga and
//     virāma are preserved.
//   • Word-by-word glosses — Rama Prasada, "Patanjali's Yoga Sutras with the
//     Commentary of Vyasa and the Gloss of Vachaspati Misra" (SBH IV, Pāṇini
//     Office, Allahabad, 1912; per-sūtra pages via wisdomlib). Lightly
//     normalized IAST; sense preserved.
//   • Whole-sūtra translation — James Haughton Woods, "The Yoga-System of
//     Patañjali" (Harvard Oriental Series 17, 1914). BODY-TEXT sūtra renderings
//     (not the truncated Analytical-Summary forms). Labelled "Woods (1914)" when
//     verbatim, "after Woods (1914)" when his archaic transliteration (Īçvara →
//     Īśvara) or a bracket/footnote artifact was adjusted — see `src`.
//
//  Flagged variants / discrepancies live in the per-record `note`.
// ============================================================================

const SRC = 'Devanāgarī: sanskritdocuments.org; glosses: Rama Prasada (1912); trans.: Woods (1914)';
const SRC_AFTER = 'Devanāgarī: sanskritdocuments.org; glosses: Rama Prasada (1912); trans.: after Woods (1914)';
const BHASHYA_SRC = 'after the Vyāsa-bhāṣya, trans. Woods (1914)';

export const PADA1 = [
  {
    pada: 1, num: 1,
    devanagari: 'अथ योगानुशासनम्',
    iast: 'atha yogānuśāsanam',
    words: [
      { sa: 'atha', gloss: 'now' },
      { sa: 'yoga', gloss: 'of Yoga, or concentration, contemplation (samādhi)' },
      { sa: 'anuśāsanam', gloss: 'a revised text, or explanation' }
    ],
    translation: 'Now the exposition of yoga [is to be made].',
    bhashya: 'The word "atha" (now) signals that a distinct, authoritative teaching of yoga here begins. Yoga is concentration, a quality found in all five stations of the mind-stuff — restless (kṣipta), infatuated (mūḍha), distracted (vikṣipta), single-in-intent (ekāgra), and restricted (niruddha) — yet only the last two yield yoga: the one-pointed state gives the concentration conscious of an object, the restricted state the concentration not conscious of an object.',
    bhashyaSrc: BHASHYA_SRC,
    note: "anuśāsana glossed 'exposition' by Woods but 'a revised text' (an authoritative text-book) by Prasada.",
    src: SRC
  },
  {
    pada: 1, num: 2,
    devanagari: 'योगश्चित्तवृत्तिनिरोधः',
    iast: 'yogaścittavṛttinirodhaḥ',
    words: [
      { sa: 'yogaḥ', gloss: 'yoga' },
      { sa: 'citta', gloss: 'of the mind, mental' },
      { sa: 'vṛtti', gloss: 'of the modifications, changes, various forms' },
      { sa: 'nirodhaḥ', gloss: 'restraint' }
    ],
    translation: 'Yoga is the restriction of the fluctuations of mind-stuff.',
    bhashya: 'The word "all" is deliberately omitted so that conscious concentration too falls under yoga. Mind-stuff has three aspects — a bent toward vividness (sattva), activity (rajas), and inertia (tamas); as the covering of error dwindles, sattva rises to the discriminative discernment of the difference between itself and the Self, and when even that Insight is restricted the mind passes over into subliminal-impressions alone. Hence yoga, the restriction of the fluctuations, is two-fold: conscious and not conscious of an object.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 3,
    devanagari: 'तदा द्रष्टुः स्वरूपेऽवस्थानम्',
    iast: 'tadā draṣṭuḥ svarūpe\'vasthānam',
    words: [
      { sa: 'tadā', gloss: 'then, at that time, at the time of concentration' },
      { sa: 'draṣṭuḥ', gloss: 'of the seer, of the soul' },
      { sa: 'svarūpe', gloss: 'in his own nature, or state' },
      { sa: 'avasthānam', gloss: 'resting, standing, remaining, lying' }
    ],
    translation: 'Then the Seer [that is, the Self,] abides in himself.',
    bhashya: 'Then, in the restricted state, the Energy of Intellect is grounded in its own self, just as it is in the state of Isolation. When the mind-stuff is emergent, the Seer, though really the same, does not seem so.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 4,
    devanagari: 'वृत्तिसारूप्यमितरत्र',
    iast: 'vṛttisārūpyamitaratra',
    words: [
      { sa: 'vṛtti', gloss: 'with modifications' },
      { sa: 'sārūpyam', gloss: 'identification' },
      { sa: 'itaratra', gloss: 'at other times, elsewhere' }
    ],
    translation: 'At other times it [the Self] takes the same form as the fluctuations [of mind-stuff].',
    bhashya: 'At other times, in the emergent state, the Self is not distinguished from the fluctuations of the mind-stuff and appears to take their very form. The mind-stuff is like a magnet, serving the Self merely by its nearness, so that their relation is that of property to proprietor; and the Self experiences the fluctuations by virtue of its beginningless correlation with the thinking-substance.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 5,
    devanagari: 'वृत्तयः पञ्चतय्यः क्लिष्टाऽक्लिष्टाः',
    iast: 'vṛttayaḥ pañcatayyaḥ kliṣṭākliṣṭāḥ',
    words: [
      { sa: 'vṛttayaḥ', gloss: 'modifications' },
      { sa: 'pañcatayyaḥ', gloss: 'five-fold, of five kinds' },
      { sa: 'kliṣṭa', gloss: 'painful' },
      { sa: 'akliṣṭāḥ', gloss: 'not painful' }
    ],
    translation: 'The fluctuations are of five kinds and are hindered or unhindered.',
    bhashya: 'The five-fold fluctuations are either hindered (kliṣṭa) — sprung from the afflictions and feeding the store of karma — or unhindered (akliṣṭa) — having discriminative discernment for their object; each kind persists even in the midst of the other. Fluctuations and subliminal-impressions ceaselessly generate one another, and this wheel of the two rolls on until the highest concentration is won.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 6,
    devanagari: 'प्रमाणविपर्ययविकल्पनिद्रास्मृतयः',
    iast: 'pramāṇaviparyayavikalpanidrāsmṛtayaḥ',
    words: [
      { sa: 'pramāṇa', gloss: 'real cognition, right knowledge' },
      { sa: 'viparyaya', gloss: 'unreal cognition, indiscrimination' },
      { sa: 'vikalpa', gloss: 'imagination, verbal delusion' },
      { sa: 'nidrā', gloss: 'deep sleep' },
      { sa: 'smṛtayaḥ', gloss: 'and memory' }
    ],
    translation: 'Sources-of-valid-ideas and misconceptions and predicate-relations and sleep and memory.',
    bhashya: 'Here the five fluctuations are simply announced by their technical names — sources-of-valid-ideas, misconceptions, predicate-relations, sleep, and memory. The qualification "of five kinds" fixes their number at exactly five and no more.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 7,
    devanagari: 'प्रत्यक्षानुमानागमाः प्रमाणानि',
    iast: 'pratyakṣānumānāgamāḥ pramāṇāni',
    words: [
      { sa: 'pratyakṣa', gloss: 'direct perception' },
      { sa: 'anumāna', gloss: 'inference' },
      { sa: 'āgamāḥ', gloss: 'and verbal cognition, competent evidence' },
      { sa: 'pramāṇāni', gloss: 'kinds of real cognition (or proofs)' }
    ],
    translation: 'Sources-of-valid-ideas are perception and inference and verbal-communication.',
    bhashya: 'The sources of valid ideas are three. Perception is the fluctuation that arises when the mind-stuff is affected by an external thing through the sense-channels, fixing chiefly on the particular; inference turns on a relation present in things of the same class and absent from others (thus the moon and stars are known to move because, like a walking man, they pass from place to place); and verbal-communication is the fluctuation aroused in a hearer by the word of a trustworthy person who has himself seen or inferred the thing.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 8,
    devanagari: 'विपर्ययो मिथ्याज्ञानमतद्रूपप्रतिष्ठम्',
    iast: 'viparyayo mithyājñānamatadrūpapratiṣṭham',
    words: [
      { sa: 'viparyayaḥ', gloss: 'unreal cognition' },
      { sa: 'mithyā', gloss: 'of the unreal' },
      { sa: 'jñānam', gloss: 'knowing' },
      { sa: 'atad', gloss: 'not its own' },
      { sa: 'rūpa', gloss: 'form' },
      { sa: 'pratiṣṭham', gloss: 'occupying, standing, possessing' }
    ],
    translation: 'Misconception is an erroneous idea (jñāna) not based on that form [in respect of which the misconception is entertained].',
    bhashya: 'Misconception is erroneous knowledge that does not rest on the true form of its object; it is no source of valid ideas because it is annulled by valid cognition, as the sight of two moons is annulled by the sight of the one real moon. This fluctuation is the five-jointed nescience — the very afflictions known technically as Obscurity, Infatuation, Extreme Infatuation, Darkness, and Blind-Darkness.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 9,
    devanagari: 'शब्दज्ञानानुपाती वस्तुशून्यो विकल्पः',
    iast: 'śabdajñānānupātī vastuśūnyo vikalpaḥ',
    words: [
      { sa: 'śabda', gloss: 'by verbal expression' },
      { sa: 'jñāna', gloss: 'by knowledge' },
      { sa: 'anupātī', gloss: 'followed in sequence' },
      { sa: 'vastu', gloss: 'reality, an objective substratum' },
      { sa: 'śūnyaḥ', gloss: 'devoid of' },
      { sa: 'vikalpaḥ', gloss: 'imagination' }
    ],
    translation: 'The predicate-relation (vikalpa) is without any [corresponding perceptible] object and follows as a result of perceptions or of words.',
    bhashya: 'The predicate-relation follows upon words or ideas though it has no corresponding perceptible object, so it is neither valid cognition nor misconception. Thus "the nature of the Self is intelligence" grammatically joins a subject to a predicate although the two are one; so too "the arrow comes to a stand-still" or "the Self is that which does not come into existence" — mere verbal constructions.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 10,
    devanagari: 'अभावप्रत्ययालम्बना वृत्तिर्निद्रा',
    iast: 'abhāvapratyayālambanā vṛttirnidrā',
    words: [
      { sa: 'abhāva', gloss: 'of non-existence, of voidness' },
      { sa: 'pratyaya', gloss: 'the cause, the feeling' },
      { sa: 'ālambanā', gloss: 'substratum; i.e., having for its substratum or support' },
      { sa: 'vṛttiḥ', gloss: 'modification' },
      { sa: 'nidrā', gloss: 'deep sleep' }
    ],
    translation: 'Sleep is a fluctuation [of mind-stuff] supported by the cause (pratyaya, that is tamas) of the [transient] negation [of the waking and the dreaming fluctuations].',
    bhashya: 'Sleep is a fluctuation resting on the cause (tamas) that negates the waking and dreaming presented-ideas. That it is a real experience and not a mere blank is proved by the memory on waking — "I have slept well," "I have slept poorly," "I have slept in deep stupor"; being a fluctuation, sleep too must be restricted in concentration.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 11,
    devanagari: 'अनुभूतविषयासम्प्रमोषः स्मृतिः',
    iast: 'anubhūtaviṣayāsaṃpramoṣaḥ smṛtiḥ',
    words: [
      { sa: 'anubhūta', gloss: 'the objective mental, perceived' },
      { sa: 'viṣaya', gloss: 'impressions, subjects' },
      { sa: 'asaṃpramoṣaḥ', gloss: 'not stealing away, not slipping away' },
      { sa: 'smṛtiḥ', gloss: 'memory' }
    ],
    translation: 'Memory (smṛti) is not-adding-surreptitiously (asampramoṣa) to a once experienced object.',
    bhashya: 'Memory is the not-slipping-away of an object once experienced. A presented-idea, affected by its object, deposits a subliminal-impression that later gives rise to a memory bearing both the object-known and the process-of-knowing, the object-form predominating; memory is two-fold, of things imagined (as in dream) or not imagined (as in waking), and it arises from any of the other four fluctuations — all of which must be restricted.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 12,
    devanagari: 'अभ्यासवैराग्याभ्यां तन्निरोधः',
    iast: 'abhyāsavairāgyābhyāṃ tannirodhaḥ',
    words: [
      { sa: 'abhyāsa', gloss: 'by practice' },
      { sa: 'vairāgyābhyām', gloss: 'by desirelessness, unattachment' },
      { sa: 'tad', gloss: 'their' },
      { sa: 'nirodhaḥ', gloss: 'restraint, control' }
    ],
    translation: 'The restriction of them is by [means of] practice and passionlessness.',
    bhashya: 'The mind-stuff is a river flowing both ways — toward good, down to discrimination and Isolation, and toward evil, down to non-discrimination and the round of existence. Passionlessness dams the stream that runs to objects, and practice opens the flood-gate to discrimination; the restriction of the mind depends on both together.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 13,
    devanagari: 'तत्र स्थितौ यत्नोऽभ्यासः',
    iast: 'tatra sthitau yatno\'bhyāsaḥ',
    words: [
      { sa: 'tatra', gloss: 'of these, there' },
      { sa: 'sthitau', gloss: 'as regards the steadiness, keeping them perfectly restrained' },
      { sa: 'yatnaḥ', gloss: 'the effort, continuous struggle' },
      { sa: 'abhyāsaḥ', gloss: '(is) what is called practice' }
    ],
    translation: 'Practice (abhyāsa) is [repeated] exertion to the end that [the mind-stuff] shall have permanence in this [restricted state].',
    bhashya: 'Practice is the repeated effort directed at permanence — the steady, undisturbed, one-pointed flow of the mind-stuff once freed of the fluctuations of rajas and tamas. It is a persevering struggle, undertaken with the desire to make that permanence firm.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 14,
    devanagari: 'स तु दीर्घकालनैरन्तर्यसत्कारासेवितो दृढभूमिः',
    iast: 'sa tu dīrghakālanairantaryasatkārāsevito dṛḍhabhūmiḥ',
    words: [
      { sa: 'saḥ', gloss: 'that, this' },
      { sa: 'tu', gloss: 'and' },
      { sa: 'dīrgha-kāla', gloss: 'for a long time' },
      { sa: 'nairantarya', gloss: 'without interruption' },
      { sa: 'satkāra', gloss: 'with devotion' },
      { sa: 'āsevitaḥ', gloss: 'being well-attended to' },
      { sa: 'dṛḍha-bhūmiḥ', gloss: 'firmly rooted, of firm ground, well fixed' }
    ],
    translation: 'But this [practice] becomes confirmed when it has been cultivated for a long time and uninterruptedly and with earnest attention.',
    bhashya: 'This practice becomes firmly grounded only when it has been cultivated for a long time, without interruption, and with earnest attention — that is, with self-discipline, continence, knowledge, and faith. Only then is it not suddenly overrun by an emergent subliminal-impression; so one must never fail to persevere.',
    bhashyaSrc: BHASHYA_SRC,
    note: 'Variant: satkāra-āsevito (this reading) vs the satkāra-ādara-āsevito reading of Iyengar-lineage editions.',
    src: SRC
  },
  {
    pada: 1, num: 15,
    devanagari: 'दृष्टानुश्रविकविषयवितृष्णस्य वशीकारसंज्ञा वैराग्यम्',
    iast: 'dṛṣṭānuśravikaviṣayavitṛṣṇasya vaśīkārasaṃjñā vairāgyam',
    words: [
      { sa: 'dṛṣṭa', gloss: 'perceptible' },
      { sa: 'anuśravika', gloss: 'scriptural' },
      { sa: 'viṣaya', gloss: 'enjoyments' },
      { sa: 'vitṛṣṇasya', gloss: 'of him who is free from thirst for' },
      { sa: 'vaśīkāra', gloss: 'supremacy' },
      { sa: 'saṃjñā', gloss: 'consciousness' },
      { sa: 'vairāgyam', gloss: 'desirelessness' }
    ],
    translation: 'Passionlessness is the consciousness of being master on the part of one who has rid himself of thirst for either seen or revealed objects.',
    bhashya: 'Passionlessness is the mastering-consciousness of one who has rid himself of thirst both for objects that are seen (such as women, food and drink, and power) and for objects revealed in scripture (such as heaven, the discarnate state, and resolution into primary-matter). Aware through Elevation of the inadequacy of all objects, he has nothing left to reject or to receive.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 16,
    devanagari: 'तत्परं पुरुषख्यातेर्गुणवैतृष्ण्यम्',
    iast: 'tatparaṃ puruṣakhyāterguṇavaitṛṣṇyam',
    words: [
      { sa: 'tat', gloss: 'that' },
      { sa: 'param', gloss: 'is higher' },
      { sa: 'puruṣa', gloss: 'of the Puruṣa' },
      { sa: 'khyāteḥ', gloss: 'due to the knowledge' },
      { sa: 'guṇa', gloss: 'to the qualities' },
      { sa: 'vaitṛṣṇyam', gloss: 'indifference' }
    ],
    translation: 'This [passionlessness] is highest when discernment of the Self results in thirstlessness for qualities [and not merely for objects].',
    bhashya: 'This passionlessness is highest when, through the vision of the Self, thirst ceases even for the guṇas themselves and not merely for objects. His thinking-substance satiated with the perfect discrimination between the guṇas and the Self, the yogin grows passionless toward all qualities perceptible or not — a mere undisturbed calm of perception; thus passionlessness is of two kinds, and this is the higher.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 17,
    devanagari: 'वितर्कविचारानन्दास्मितारूपानुगमात् सम्प्रज्ञातः',
    iast: 'vitarkavicārānandāsmitārūpānugamātsaṃprajñātaḥ',
    words: [
      { sa: 'vitarka', gloss: 'of philosophical curiosity' },
      { sa: 'vicāra', gloss: 'of meditation' },
      { sa: 'ānanda', gloss: 'of elation' },
      { sa: 'asmitā', gloss: 'egoism' },
      { sa: 'rūpa', gloss: 'appearances' },
      { sa: 'anugamāt', gloss: 'by the accompaniment of, being accompanied by' },
      { sa: 'saṃprajñātaḥ', gloss: 'the cognitive trance' }
    ],
    translation: '[Concentration becomes] conscious [of its object] by assuming forms either of deliberation [upon coarse objects] or of reflection [upon subtile objects] or of joy or of the sense-of-personality.',
    bhashya: 'Conscious concentration takes four forms according to what accompanies it: deliberation (vitarka), the coarse direct-experience of the object; reflection (vicāra), the subtile direct-experience; joy (ānanda); and the sense-of-personality (asmitā). These are reached by successive subtraction — deliberation carries all four, reflection drops deliberation, joy drops reflection, the bare sense-of-personality drops joy — and each still rests upon a supporting object.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 18,
    devanagari: 'विरामप्रत्ययाभ्यासपूर्वः संस्कारशेषोऽन्यः',
    iast: 'virāmapratyayābhyāsapūrvaḥ saṃskāraśeṣo\'nyaḥ',
    words: [
      { sa: 'virāma', gloss: 'of cessation' },
      { sa: 'pratyaya', gloss: 'the notion' },
      { sa: 'abhyāsa', gloss: 'practice' },
      { sa: 'pūrvaḥ', gloss: 'preceded by (i.e., preceded by the practice of the notion of cessation)' },
      { sa: 'saṃskāra-śeṣaḥ', gloss: 'in which remain only the (śeṣa) residual potencies or impressions (saṃskāra)' },
      { sa: 'anyaḥ', gloss: 'the other' }
    ],
    translation: 'The other [concentration which is not conscious of objects] consists of subliminal-impressions only [after objects have merged], and follows upon that practice which effects the cessation [of fluctuations].',
    bhashya: 'The other concentration, not conscious of objects, is the restriction in which only subliminal-impressions remain after every fluctuation has ceased; it is reached through the higher passionlessness and follows on the practice of the notion of cessation. Its supporting-object is one that effects that cessation and has no perceptible object, so the mind-stuff seems as if it were itself non-existent — this is the seedless concentration.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 19,
    devanagari: 'भवप्रत्ययो विदेहप्रकृतिलयानाम्',
    iast: 'bhavapratyayo videhaprakṛtilayānām',
    words: [
      { sa: 'bhava', gloss: 'the objective existence' },
      { sa: 'pratyayaḥ', gloss: 'the cause; i.e., caused by objective existence' },
      { sa: 'videha-prakṛtilayānām', gloss: 'to the Videhas (the gods) and the prakṛtilayas, those merged (laya) in nature (prakṛti)' }
    ],
    translation: '[Concentration not conscious of objects] caused by worldly [means] is the one to which the discarnate attain and to which those [whose bodies] are resolved into primary-matter attain.',
    bhashya: 'The concentration caused by worldly means (bhava-pratyaya) is what the discarnate — the gods — and those resolved into primary-matter attain. Living on their own subliminal-impressions they enjoy a quasi-Isolation, but when the fruit of those impressions ripens, their task still unfinished, they must return to the world; so it is no true liberation.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 20,
    devanagari: 'श्रद्धावीर्यस्मृतिसमाधिप्रज्ञापूर्वक इतरेषाम्',
    iast: 'śraddhāvīryasmṛtisamādhiprajñāpūrvaka itareṣām',
    words: [
      { sa: 'śraddhā', gloss: 'faith' },
      { sa: 'vīrya', gloss: 'energy' },
      { sa: 'smṛti', gloss: 'memory' },
      { sa: 'samādhi', gloss: 'trance' },
      { sa: 'prajñā', gloss: 'discernment' },
      { sa: 'pūrvakaḥ', gloss: 'having before, preceded by' },
      { sa: 'itareṣām', gloss: 'for others' }
    ],
    translation: '[Concentration not conscious of objects,] which follows upon belief [and] energy [and] mindfulness [and] concentration [and] insight, is that to which the others [the yogins] attain.',
    bhashya: 'For yogins the concentration comes through a chain of means: faith (śraddhā) — which guards the yogin like a good mother — leads on to energy (vīrya), then to mindfulness (smṛti), then to concentration (samādhi), then to insight (prajñā), by which he perceives things as they really are. Through these means and the passionlessness directed to this end, the concentration not conscious of objects finally arises.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 21,
    devanagari: 'तीव्रसंवेगानामासन्नः',
    iast: 'tīvrasaṃvegānāmāsannaḥ',
    words: [
      { sa: 'tīvra', gloss: 'keen' },
      { sa: 'saṃvega', gloss: 'the consciousness of supremacy' },
      { sa: 'tīvrasaṃvegānām', gloss: 'for those having consciousness of supremacy, for the extremely energetic' },
      { sa: 'āsannaḥ', gloss: 'proximate, speedy' }
    ],
    translation: 'For the keenly intense, [concentration] is near.',
    bhashya: 'For those of keen intensity, concentration — and its fruit — is near; the more vehement the intensity, the sooner it comes. The result of conscious concentration is the concentration not conscious of an object, and the result of that is Isolation.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 22,
    devanagari: 'मृदुमध्याधिमात्रत्वात् ततोऽपि विशेषः',
    iast: 'mṛdumadhyādhimātratvāttato\'pi viśeṣaḥ',
    words: [
      { sa: 'mṛdu', gloss: 'mild' },
      { sa: 'madhya', gloss: 'middling' },
      { sa: 'adhimātra', gloss: 'intense' },
      { sa: 'mṛdumadhyādhimātratvāt', gloss: 'by mild, middle and intense natures' },
      { sa: 'tataḥ', gloss: 'thence, further' },
      { sa: 'api', gloss: 'also, further' },
      { sa: 'viśeṣaḥ', gloss: 'differentiation' }
    ],
    translation: 'Because [this keenness] is gentle or moderate or keen, there is a [concentration] superior (viśeṣa) even to this [near kind].',
    bhashya: 'Since that keenness is itself gentle, moderate, or vehement, there is a further gradation even within the "near": concentration is near for the mildly keen, nearer for the moderately keen, and nearest for the vehemently keen — nine kinds of yogin in all.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 23,
    devanagari: 'ईश्वरप्रणिधानाद्वा',
    iast: 'īśvarapraṇidhānādvā',
    words: [
      { sa: 'īśvara', gloss: 'of God' },
      { sa: 'praṇidhāna', gloss: 'feeling the omnipresence of, worship, devotion' },
      { sa: 'īśvarapraṇidhānāt', gloss: 'by feeling the omnipresence of God' },
      { sa: 'vā', gloss: 'or' }
    ],
    translation: 'Or [concentration] is attained by devotion to the Īśvara.',
    bhashya: 'Or concentration is attained by devotion to the Īśvara. By a special adoration — mental, verbal, or bodily — the Īśvara inclines toward the yogin and favours him for his profound longing, and by this alone concentration and its fruit, Isolation, become most near.',
    bhashyaSrc: BHASHYA_SRC,
    note: 'Īśvara modernized from Woods\'s Īçvara.',
    src: SRC_AFTER
  },
  {
    pada: 1, num: 24,
    devanagari: 'क्लेशकर्मविपाकाशयैरपरामृष्टः पुरुषविशेष ईश्वरः',
    iast: 'kleśakarmavipākāśayairaparāmṛṣṭaḥ puruṣaviśeṣa īśvaraḥ',
    words: [
      { sa: 'kleśa', gloss: 'of affliction' },
      { sa: 'karma', gloss: 'of action' },
      { sa: 'vipāka', gloss: 'of fruition' },
      { sa: 'āśayaiḥ', gloss: 'by the vehicles' },
      { sa: 'aparāmṛṣṭaḥ', gloss: 'not touched' },
      { sa: 'puruṣaviśeṣaḥ', gloss: 'a distinct Puruṣa' },
      { sa: 'īśvaraḥ', gloss: 'God' }
    ],
    translation: 'Untouched by hindrances or karmas or fruition or by latent-deposits the Īśvara is a special kind of Self.',
    bhashya: 'The Īśvara is a distinct kind of Self, untouched by the afflictions, by karmas good or evil, by their fruition, or by the latent-deposits — which, though lodged in the central-organ, are ascribed to the Self as victory or defeat is ascribed to the lord of the combatants. Unlike ordinary liberated selves, who once had a starting-point of bondage before cutting it away, His freedom is eternal: He was never bound and never will be.',
    bhashyaSrc: BHASHYA_SRC,
    note: 'Īśvara modernized from Woods\'s Īçvara.',
    src: SRC_AFTER
  },
  {
    pada: 1, num: 25,
    devanagari: 'तत्र निरतिशयं सर्वज्ञबीजम्',
    iast: 'tatra niratiśayaṃ sarvajñabījam',
    words: [
      { sa: 'tatra', gloss: 'in Him' },
      { sa: 'niratiśayam', gloss: 'such as is not exceeded' },
      { sa: 'sarvajña', gloss: 'of the omniscient' },
      { sa: 'bījam', gloss: 'the seed' }
    ],
    translation: 'In this [Īśvara] the germ of the omniscient is at its utmost excellence.',
    bhashya: 'In the Īśvara the germ of omniscience reaches its utmost, unexcelled excellence. Our knowledge of the supersensuous — past, future, or present, small or great — admits degrees like any ascending scale, and He in whom this seed reaches its uttermost limit is the omniscient, a distinct kind of Self.',
    bhashyaSrc: BHASHYA_SRC,
    note: 'Īśvara modernized from Woods\'s Īçvara.',
    src: SRC_AFTER
  },
  {
    pada: 1, num: 26,
    devanagari: 'स पूर्वेषामपि गुरुः कालेनानवच्छेदात्',
    iast: 'sa pūrveṣāmapi guruḥ kālenānavacchedāt',
    words: [
      { sa: 'saḥ', gloss: 'that, He' },
      { sa: 'eṣaḥ', gloss: 'this, here' },
      { sa: 'pūrveṣām', gloss: 'of the ancients' },
      { sa: 'api', gloss: 'too' },
      { sa: 'guruḥ', gloss: 'the teacher' },
      { sa: 'kālena', gloss: 'by time' },
      { sa: 'anavacchedāt', gloss: 'owing to the non-limitation, not being limited by' }
    ],
    translation: 'Teacher of the Primal [Sages] also, forasmuch as [with Him] there is no limitation by time.',
    bhashya: 'He is the teacher even of the Primal Sages, for, unlike them, He is not limited by time. Ever-perfect, He stood in this same perfection at the beginning of the present creation and of every past creation alike.',
    bhashyaSrc: BHASHYA_SRC,
    note: "Prasada's text reads 'sa eṣa…' (hence the eṣaḥ gloss); the sanskritdocuments Devanāgarī omits एष.",
    src: SRC
  },
  {
    pada: 1, num: 27,
    devanagari: 'तस्य वाचकः प्रणवः',
    iast: 'tasya vācakaḥ praṇavaḥ',
    words: [
      { sa: 'tasya', gloss: 'Him' },
      { sa: 'vācakaḥ', gloss: 'connoting' },
      { sa: 'praṇavaḥ', gloss: 'the Sacred word, Om' }
    ],
    translation: 'The word-expressing Him is the Mystic-syllable (praṇava).',
    bhashya: 'The word expressing Him is the praṇava (Om), of which the Īśvara is the object signified. The bond between the expressive word and the thing expressed is fixed and permanent — like that of father and son — and is merely made manifest by usage; the Īśvara revives, in each creation, the expressive power the word held in creations before.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 28,
    devanagari: 'तज्जपस्तदर्थभावनम्',
    iast: 'tajjapastadarthabhāvanam',
    words: [
      { sa: 'tad', gloss: 'its' },
      { sa: 'japaḥ', gloss: 'repetition' },
      { sa: 'tad', gloss: 'its' },
      { sa: 'artha', gloss: 'meaning' },
      { sa: 'bhāvanam', gloss: 'the understanding of' }
    ],
    translation: 'Repetition of it and reflection upon its meaning [should be made].',
    bhashya: 'One should make repetition (japa) of the syllable and reflection upon its meaning, the Īśvara. For the yogin who does so, the mind-stuff attains one-pointedness and comes to rest in the One Exalted, who then bestows concentration and its fruit — as the verse says, "Through study let him practise yoga; through yoga let him meditate on study."',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 29,
    devanagari: 'ततः प्रत्यक्चेतनाधिगमोऽप्यन्तरायाभावश्च',
    iast: 'tataḥ pratyakcetanādhigamo\'pyantarāyābhāvaśca',
    words: [
      { sa: 'tataḥ', gloss: 'thence' },
      { sa: 'pratyak', gloss: 'the individual' },
      { sa: 'cetana', gloss: 'Soul' },
      { sa: 'adhigamaḥ', gloss: 'understanding' },
      { sa: 'api', gloss: 'also, too' },
      { sa: 'antarāya', gloss: 'of obstacles' },
      { sa: 'abhāvaḥ', gloss: 'absence' },
      { sa: 'ca', gloss: 'and' }
    ],
    translation: 'Thereafter comes the right-knowledge of him who thinks in an inverse way, and the removal of obstacles.',
    bhashya: 'Thereafter comes the inward-turned right-knowledge of his own real self and the removal of every obstacle — disease and the rest — by devotion to the Īśvara. The yogin comes to see that, as the Īśvara is a Self undefiled, undisturbed, isolated, and exempt from accidents, so he too is a Self, conscious by reflection of its thinking-substance.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 30,
    devanagari: 'व्याधिस्त्यानसंशयप्रमादालस्याविरतिभ्रान्तिदर्शनालब्धभूमिकत्वानवस्थितत्वानि चित्तविक्षेपास्तेऽन्तरायाः',
    iast: 'vyādhistyānasaṃśayapramādālasyāviratibhrāntidarśanālabdhabhūmikatvānavasthitatvāni cittavikṣepāste\'ntarāyāḥ',
    words: [
      { sa: 'vyādhi', gloss: 'disease' },
      { sa: 'styāna', gloss: 'languor' },
      { sa: 'saṃśaya', gloss: 'indecision' },
      { sa: 'pramāda', gloss: 'carelessness' },
      { sa: 'ālasya', gloss: 'sloth' },
      { sa: 'avirati', gloss: 'sensuality, want of non-attachment' },
      { sa: 'bhrānti-darśana', gloss: 'mistaken notion' },
      { sa: 'alabdha-bhūmikatva', gloss: 'missing the point, not reaching a stage just seen' },
      { sa: 'anavasthitatva', gloss: 'instability' },
      { sa: 'citta-vikṣepāḥ', gloss: 'distractions of the mind' },
      { sa: 'te', gloss: 'these are' },
      { sa: 'antarāyāḥ', gloss: 'the obstacles' }
    ],
    translation: 'Sickness and languor and doubt and heedlessness and listlessness and worldliness (avirati) and erroneous perception and failure to attain any stage [of concentration] and instability in the state [when attained]—these distractions of the mind-stuff are the obstacles.',
    bhashya: 'The nine obstacles are distractions of the mind-stuff that arise together with its fluctuations: sickness (a disorder of the bodily humours), languor (mental inactivity), doubt (thought that touches both alternatives), heedlessness (no reflection on the means), sloth (want of effort from heaviness of body or mind), worldliness (greed for sense-objects), erroneous perception, failure to reach any stage of concentration, and instability in a stage once reached — the nine foes of yoga.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 31,
    devanagari: 'दुःखदौर्मनस्याङ्गमेजयत्वश्वासप्रश्वासा विक्षेपसहभुवः',
    iast: 'duḥkhadaurmanasyāṅgamejayatvaśvāsapraśvāsā vikṣepasahabhuvaḥ',
    words: [
      { sa: 'duḥkha', gloss: 'pain' },
      { sa: 'daurmanasya', gloss: 'despair, dejection' },
      { sa: 'aṅgamejayatva', gloss: 'shakiness' },
      { sa: 'śvāsa', gloss: 'inspiration' },
      { sa: 'praśvāsāḥ', gloss: 'and expiration' },
      { sa: 'vikṣepa', gloss: 'of distraction' },
      { sa: 'saha-bhuvaḥ', gloss: 'companions' }
    ],
    translation: 'Pain and despondency and unsteadiness of the body and inspiration and expiration are the accompaniments of the distractions.',
    bhashya: 'Pain, despondency (agitation of mind at a thwarted desire), unsteadiness of the body, and involuntary inspiration and expiration are the accompaniments of the distractions — the last two being opposed to the voluntary breathing that aids concentration. All occur in the distracted mind, not in the concentrated.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 32,
    devanagari: 'तत्प्रतिषेधार्थमेकतत्त्वाभ्यासः',
    iast: 'tatpratiṣedhārthamekatattvābhyāsaḥ',
    words: [
      { sa: 'tat', gloss: 'their' },
      { sa: 'pratiṣedha', gloss: 'prevention' },
      { sa: 'artham', gloss: 'for' },
      { sa: 'eka', gloss: 'of one' },
      { sa: 'tattva', gloss: 'truth or subject' },
      { sa: 'abhyāsaḥ', gloss: 'habituation' }
    ],
    translation: 'To check them [let there be] practice upon a single entity.',
    bhashya: 'To check them, let the yogin practise the mind-stuff by making it rest upon a single entity (eka-tattva). Only a persisting, single mind-stuff can become one-pointed — which refutes those who hold the mind to be merely momentary, a bare succession of ideas.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 33,
    devanagari: 'मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम्',
    iast: 'maitrīkaruṇāmuditopekṣāṇāṃ sukhaduḥkhapuṇyāpuṇyaviṣayāṇāṃ bhāvanātaścittaprasādanam',
    words: [
      { sa: 'maitrī', gloss: 'friendliness' },
      { sa: 'karuṇā', gloss: 'compassion, mercy' },
      { sa: 'muditā', gloss: 'gladness, complacency' },
      { sa: 'upekṣā', gloss: 'indifference (of all these)' },
      { sa: 'sukha', gloss: 'happiness' },
      { sa: 'duḥkha', gloss: 'misery' },
      { sa: 'puṇya', gloss: 'virtue' },
      { sa: 'apuṇya', gloss: 'vice' },
      { sa: 'viṣayāṇām', gloss: 'regarding the subjects (respectively)' },
      { sa: 'bhāvanātaḥ', gloss: 'by cultivating habits, by constant thinking' },
      { sa: 'citta', gloss: 'of the mind' },
      { sa: 'prasādanam', gloss: 'purification' }
    ],
    translation: 'By the cultivation of friendliness towards happiness and compassion towards pain and joy towards merit and indifference towards demerit [the yogin should attain] the undisturbed calm of the mind-stuff.',
    bhashya: 'By cultivating friendliness toward the happy, compassion toward those in pain, gladness toward the meritorious, and indifference toward the demeritorious, the taints of envy, cruelty, jealousy, and wrath fall away; the white, sattva quality arises, and the purified mind-stuff becomes calm, one-pointed, and stable.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 34,
    devanagari: 'प्रच्छर्दनविधारणाभ्यां वा प्राणस्य',
    iast: 'pracchardanavidhāraṇābhyāṃ vā prāṇasya',
    words: [
      { sa: 'pracchardana', gloss: 'by the expulsion' },
      { sa: 'vidhāraṇābhyām', gloss: 'and by the retention' },
      { sa: 'vā', gloss: 'optionally, or' },
      { sa: 'prāṇasya', gloss: 'of breath' }
    ],
    translation: 'Or [he gains stability] by expulsion and retention of breath.',
    bhashya: 'Or he gains stability by the expulsion and retention of breath — ejecting the abdominal air through the nostrils by a special effort, then restraining it and holding it outside. By this the body grows light and the central-organ steady.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 35,
    devanagari: 'विषयवती वा प्रवृत्तिरुत्पन्ना मनसः स्थितिनिबन्धिनी',
    iast: 'viṣayavatī vā pravṛttirutpannā manasaḥ sthitinibandhinī',
    words: [
      { sa: 'viṣayavatī', gloss: 'of the sense-objects, bringing sense-perceptions' },
      { sa: 'vā', gloss: 'or' },
      { sa: 'pravṛttiḥ', gloss: 'higher activity' },
      { sa: 'utpannā', gloss: 'appearing' },
      { sa: 'manasaḥ', gloss: 'of the mind, mental' },
      { sa: 'sthiti', gloss: 'steadiness' },
      { sa: 'nibandhinī', gloss: 'causing' }
    ],
    translation: 'Or [he gains stability when] a sense-activity (pravṛtti) arises connected with an object [and] bringing the central-organ into a relation of stability.',
    bhashya: 'Or stability comes when a sense-activity arises fastened on an object: fixed attention on the tip of the nose yields a consciousness of supernormal odour, on the tongue-tip of taste, on the palate of colour, on the middle of the tongue of touch, and on its root of sound — such vivid sense-experience holds the central-organ steady.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 36,
    devanagari: 'विशोका वा ज्योतिष्मती',
    iast: 'viśokā vā jyotiṣmatī',
    words: [
      { sa: 'viśokā', gloss: 'the painless state, the concentration on the painless' },
      { sa: 'vā', gloss: 'or' },
      { sa: 'jyotiṣmatī', gloss: 'the bright, effulgent state, the concentration on luminous objects' }
    ],
    translation: 'Or an undistressed [and] luminous [sense-activity when arisen brings the central-organ into a relation of stability].',
    bhashya: 'Or a sorrowless, luminous sense-activity gives stability: fixing attention on the Lotus of the Heart, the sattva of the thinking-substance grows resplendent as the sun, moon, or gems; and the mind, coming into balance with the mere sense-of-personality, becomes waveless as the great sea, peaceful and infinite.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 37,
    devanagari: 'वीतरागविषयं वा चित्तम्',
    iast: 'vītarāgaviṣayaṃ vā cittam',
    words: [
      { sa: 'vīta-rāga', gloss: 'one who is desireless' },
      { sa: 'viṣaya', gloss: 'an object' },
      { sa: 'vītarāgaviṣayam', gloss: 'having the desireless for its object' },
      { sa: 'vā', gloss: 'or' },
      { sa: 'cittam', gloss: 'the mind' }
    ],
    translation: 'Or the mind-stuff [reaches the stable state] by having as its object [a mind-stuff] freed from passion.',
    bhashya: 'Or the mind-stuff reaches the stable state by taking as its object a mind freed from passion — such as that of a sage like Kṛṣṇa-dvaipāyana; resting upon such a passion-free mind, it grows steady.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 38,
    devanagari: 'स्वप्ननिद्राज्ञानालम्बनं वा',
    iast: 'svapnanidrājñānālambanaṃ vā',
    words: [
      { sa: 'svapna', gloss: 'of dream' },
      { sa: 'nidrā', gloss: 'of deep sleep' },
      { sa: 'jñāna', gloss: 'the knowledge' },
      { sa: 'ālambanam', gloss: 'taking for its object, resorting to, meditating on' },
      { sa: 'vā', gloss: 'or' }
    ],
    translation: 'Or [the mind-stuff reaches the stable state] by having as the supporting-object a perception in dream or in sleep.',
    bhashya: 'Or the mind-stuff reaches stability by taking as its support a perception in dream or in sleep — as when the yogin, having adored in a dream the moonlit image of Maheśvara, reflects on it on waking with mind in calm; or the sattva-natured sleep from which he wakes with the memory "I have slept well," in which his central-organ had become one-pointed.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 39,
    devanagari: 'यथाभिमतध्यानाद्वा',
    iast: 'yathābhimatadhyānādvā',
    words: [
      { sa: 'yathā-abhimata', gloss: 'according to one\'s own choice, according to one\'s predilection' },
      { sa: 'dhyānāt', gloss: 'by meditating on' },
      { sa: 'vā', gloss: 'or' }
    ],
    translation: 'Or [the mind-stuff reaches the stable state] by contemplation upon any such an object as is desired.',
    bhashya: 'Or the mind-stuff reaches stability by contemplation upon whatever object is desired — whichever deity or thing he prefers. Having gained stability there, it gains stability elsewhere too.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 40,
    devanagari: 'परमाणु परममहत्त्वान्तोऽस्य वशीकारः',
    iast: 'paramāṇuparamamahattvānto\'sya vaśīkāraḥ',
    words: [
      { sa: 'paramāṇu', gloss: 'the minutest atom' },
      { sa: 'parama', gloss: 'greatest' },
      { sa: 'mahattva', gloss: 'infinity' },
      { sa: 'antaḥ', gloss: 'end' },
      { sa: 'paramāṇuparamamahattvāntaḥ', gloss: 'reaching down to the minutest and up to the largest' },
      { sa: 'asya', gloss: 'of this yogin' },
      { sa: 'vaśīkāraḥ', gloss: 'power, mastery' }
    ],
    translation: 'His mastery extends from the smallest atom to the greatest magnitude.',
    bhashya: 'His mastery then extends from the smallest atom to the greatest magnitude: entering a subtile thing the mind reaches stability down to the atom, entering a coarse thing up to the greatest bulk. This unobstructed range in both directions is complete mastery, and the mind so filled needs no further purification by practice.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 41,
    devanagari: 'क्षीणवृत्तेरभिजातस्येव मणेर्ग्रहीतृग्रहणग्राह्येषु तत्स्थतदञ्जनता समापत्तिः',
    iast: 'kṣīṇavṛtterabhijātasyeva maṇergrahītṛgrahaṇagrāhyeṣu tatsthatadañjanatā samāpattiḥ',
    words: [
      { sa: 'kṣīṇa', gloss: 'disappearing, powerless' },
      { sa: 'vṛtti', gloss: 'modification of the mind' },
      { sa: 'kṣīṇavṛtteḥ', gloss: 'of that mind whose modifications have disappeared' },
      { sa: 'abhijātasya', gloss: 'of a transparent' },
      { sa: 'iva', gloss: 'like' },
      { sa: 'maṇeḥ', gloss: 'of a crystal' },
      { sa: 'grahītṛ', gloss: 'the knower' },
      { sa: 'grahaṇa', gloss: 'knowing' },
      { sa: 'grāhya', gloss: 'the knowable' },
      { sa: 'tat-stha', gloss: 'remaining in it, what is presented to it' },
      { sa: 'tadañjanatā', gloss: 'taking the tinge of that object, appearing in the shape of any object' },
      { sa: 'samāpattiḥ', gloss: 'the power of thought-transformation, concentration and oneness' }
    ],
    translation: '[The mind-stuff] from which, as from a precious gem, fluctuations have dwindled away, is, with reference either to the knower or to the process-of-knowing or to the object-to-be-known, in the state of resting upon [one] of these [three] and in the state of being tinged by [one] of these [three], and [thus] is in the balanced-state.',
    bhashya: 'The mind-stuff whose fluctuations have dwindled is like a clear precious gem: as a crystal takes on the colour of whatever lies next to it and seems to become that thing, so the mind, resting upon and tinged by the knower, or the process-of-knowing, or the object-to-be-known, takes on the form of that thing — this is the balanced-state (samāpatti).',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 42,
    devanagari: 'तत्र शब्दार्थज्ञानविकल्पैः सङ्कीर्णा सवितर्का समापत्तिः',
    iast: 'tatra śabdārthajñānavikalpaiḥ saṃkīrṇā savitarkā samāpattiḥ',
    words: [
      { sa: 'tatra', gloss: 'there' },
      { sa: 'śabda', gloss: 'of words' },
      { sa: 'artha', gloss: 'of meaning' },
      { sa: 'jñāna', gloss: 'of idea' },
      { sa: 'vikalpaiḥ', gloss: 'with options' },
      { sa: 'saṃkīrṇā', gloss: 'mixed up' },
      { sa: 'savitarkā', gloss: 'indistinct, deliberative' },
      { sa: 'samāpattiḥ', gloss: 'the thought-transformation' }
    ],
    translation: 'Of these [balanced-states] the state-balanced with deliberation is confused by reason of predicate-relations between words and intended-objects and ideas.',
    bhashya: 'In the deliberative balanced-state, word, intended-object, and idea are confused together by predicate-relation. Thus the word "cow," the object cow, and the idea cow are really distinct, with distinct levels of existence, yet in ordinary knowing they appear undivided; this mingling marks the savitarkā state.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 43,
    devanagari: 'स्मृतिपरिशुद्धौ स्वरूपशून्येवार्थमात्रनिर्भासा निर्वितर्का',
    iast: 'smṛtipariśuddhau svarūpaśūnyevārthamātranirbhāsā nirvitarkā',
    words: [
      { sa: 'smṛti', gloss: 'of memory' },
      { sa: 'pariśuddhau', gloss: 'on the purification, or cessation' },
      { sa: 'svarūpa', gloss: 'its own nature' },
      { sa: 'śūnyā', gloss: 'devoid of' },
      { sa: 'iva', gloss: 'as it were' },
      { sa: 'artha', gloss: 'the object' },
      { sa: 'mātra', gloss: 'alone' },
      { sa: 'nirbhāsā', gloss: 'shining' },
      { sa: 'nirvitarkā', gloss: 'super-deliberative (wordless)' }
    ],
    translation: 'When the memory is quite purified, [that balanced-state]—which is, as it were, empty of itself and which brightens [into conscious knowledge] as the intended object and nothing more—is super-deliberative.',
    bhashya: 'When memory is purified of the predicate-relations that come from words and from things heard or inferred, the balanced-state, as it were emptied of itself, shines forth as the intended-object and nothing more; the insight throws off its own form as a knowing-process and becomes the thing in itself — this is the super-deliberative (nirvitarkā) state.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 44,
    devanagari: 'एतयैव सविचारा निर्विचारा च सूक्ष्मविषया व्याख्याता',
    iast: 'etayaiva savicārā nirvicārā ca sūkṣmaviṣayā vyākhyātā',
    words: [
      { sa: 'etayā', gloss: 'by this' },
      { sa: 'eva', gloss: 'also' },
      { sa: 'savicārā', gloss: 'the reflective' },
      { sa: 'nirvicārā', gloss: 'the super-reflective' },
      { sa: 'ca', gloss: 'and' },
      { sa: 'sūkṣma-viṣayā', gloss: 'having the subtle for their objects' },
      { sa: 'vyākhyātā', gloss: 'are described' }
    ],
    translation: 'By this same [balanced-state] the reflective and the super-reflective [balanced-states] are explained as having subtile objects.',
    bhashya: 'By this same account the reflective (savicāra) and super-reflective (nirvicāra) balanced-states are explained, taking subtile objects. The reflective rests on a subtile element as characterized by place, time, and cause; the super-reflective rests on it free of all such characterization — quiescent, uprisen, or indeterminable — the insight again emptied of itself and become the object alone.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 45,
    devanagari: 'सूक्ष्मविषयत्वं चालिङ्गपर्यवसानम्',
    iast: 'sūkṣmaviṣayatvaṃ cāliṅgaparyavasānam',
    words: [
      { sa: 'sūkṣma', gloss: 'of the subtle' },
      { sa: 'viṣayatvam', gloss: 'the quality of having the subtle for its object' },
      { sa: 'ca', gloss: 'and' },
      { sa: 'ā', gloss: 'up to' },
      { sa: 'liṅga', gloss: 'the noumenal' },
      { sa: 'paryavasānam', gloss: 'ending, extremity' },
      { sa: 'āliṅgaparyavasānam', gloss: 'reaching up to the noumenal' }
    ],
    translation: 'The subtile object likewise terminates in unresoluble-primary-matter (aliṅga).',
    bhashya: 'The subtile object of these states ascends by stages and terminates in unresoluble-primary-matter (aliṅga): the fine elements (tanmātras) are the subtile causes of the atoms, the personality-substance the cause of those, the resoluble-primary-matter (the Great Principle) the cause of that, and primary-matter the cause of that — beyond which there is nothing subtile. The Self too is subtile, yet only as the instrumental, not the material, cause.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 46,
    devanagari: 'ता एव सबीजः समाधिः',
    iast: 'tā eva sabījaḥ samādhiḥ',
    words: [
      { sa: 'tāḥ', gloss: 'they' },
      { sa: 'eva', gloss: 'only' },
      { sa: 'sabījaḥ', gloss: 'seeded' },
      { sa: 'samādhiḥ', gloss: 'trance' }
    ],
    translation: 'These same [balanced-states] are the seeded concentration.',
    bhashya: 'These same four balanced-states are the seeded concentration (sabīja samādhi), for they rest on external, perceptible things as their seed — the deliberative pair on coarse objects, the reflective pair on subtile.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 47,
    devanagari: 'निर्विचारवैशारद्येऽध्यात्मप्रसादः',
    iast: 'nirvicāravaiśāradye\'dhyātmaprasādaḥ',
    words: [
      { sa: 'nirvicāra', gloss: 'of the super-reflective' },
      { sa: 'vaiśāradye', gloss: 'when there is the undisturbed, pure flow' },
      { sa: 'adhyātma', gloss: 'subjective, spiritual' },
      { sa: 'prasādaḥ', gloss: 'luminosity, the fixedness of the mind' }
    ],
    translation: 'When there is the clearness of the super-reflective [balanced-state, the yogin gains] internal undisturbed calm.',
    bhashya: 'When the super-reflective balanced-state attains its clearness — the sattva of the thinking-substance, freed of the taint of rajas and tamas, flowing pellucid and steady — the yogin gains internal undisturbed calm: the flash of insight that does not pass through the usual serial order and takes the thing as it truly is for its object. As one who has climbed the crag sees those on the plain below, so the man of insight, himself escaped from pain, beholds all creatures in their pain.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 48,
    devanagari: 'ऋतम्भरा तत्र प्रज्ञा',
    iast: 'ṛtaṃbharā tatra prajñā',
    words: [
      { sa: 'ṛtaṃbharā', gloss: 'full of truth, full of essence, essential cognition' },
      { sa: 'tatra', gloss: 'therein' },
      { sa: 'prajñā', gloss: 'the faculty of cognition' }
    ],
    translation: 'In this [calm] the insight is truth-bearing.',
    bhashya: 'In this calm the insight is truth-bearing (ṛtambharā): it carries truth and nothing else, without even a trace of misconception.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 49,
    devanagari: 'श्रुतानुमानप्रज्ञाभ्यामन्यविषया विशेषार्थत्वात्',
    iast: 'śrutānumānaprajñābhyāmanyaviṣayā viśeṣārthatvāt',
    words: [
      { sa: 'śruta', gloss: 'heard, verbal' },
      { sa: 'anumāna', gloss: 'inferential' },
      { sa: 'prajñābhyām', gloss: 'from those of cognition' },
      { sa: 'anya', gloss: 'different' },
      { sa: 'viṣaya', gloss: 'object' },
      { sa: 'anyaviṣayā', gloss: 'having objects different from' },
      { sa: 'viśeṣārthatvāt', gloss: 'because it refers to particulars (viśeṣa)' }
    ],
    translation: 'Has an object other than the insight resulting from things heard or from inferences inasmuch as its intended-object is a particular.',
    bhashya: 'This insight has an object other than that of knowledge from words or from inference, because its object is a particular. Words and inferences reach only generic objects — no particular can be conveyed by them, nor can a subtile, hidden, or remote particular be grasped by ordinary perception; the particular, whether of a subtile element or of the Self, is apprehended by the concentrated insight alone.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 50,
    devanagari: 'तज्जः संस्कारोऽन्यसंस्कारप्रतिबन्धी',
    iast: 'tajjaḥ saṃskāro\'nyasaṃskārapratibandhī',
    words: [
      { sa: 'tajjaḥ', gloss: 'born therefrom' },
      { sa: 'saṃskāraḥ', gloss: 'residual potency, impression' },
      { sa: 'anya', gloss: 'other' },
      { sa: 'saṃskāra', gloss: 'residual potencies, impressions' },
      { sa: 'pratibandhī', gloss: 'impeding' }
    ],
    translation: 'The subliminal-impression produced by this [super-reflective balanced-state] is hostile to other subliminal-impressions.',
    bhashya: 'The subliminal-impression born of this truth-bearing insight is hostile to other, emergent subliminal-impressions: once these are repressed, their presented-ideas cease, and concentration, insight, and fresh insight-born impressions follow in turn, again and again. These insight-born impressions set the mind no new task, for they cause the afflictions to dwindle and bring its movement to rest at discernment.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  },
  {
    pada: 1, num: 51,
    devanagari: 'तस्यापि निरोधे सर्वनिरोधान्निर्बीजः समाधिः',
    iast: 'tasyāpi nirodhe sarvanirodhānnirbījaḥ samādhiḥ',
    words: [
      { sa: 'tasya', gloss: 'of that' },
      { sa: 'api', gloss: 'too' },
      { sa: 'nirodhe', gloss: 'by the suppression' },
      { sa: 'sarva', gloss: 'of all' },
      { sa: 'nirodhāt', gloss: 'owing to the suppression' },
      { sa: 'nirbījaḥ', gloss: 'seedless' },
      { sa: 'samādhiḥ', gloss: 'trance' }
    ],
    translation: 'When this [subliminal-impression] also is restricted, since all is restricted, [the yogin gains] seedless concentration.',
    bhashya: 'When even that insight-born impression is restricted, then, since all is restricted, the yogin gains seedless concentration (nirbīja samādhi); the restriction-born impression inhibits even the concentration-born ones. With all impressions restricted, the mind-stuff, its task ended, resolves back into its own primary-matter, and the Self abides in himself — pure and liberated.',
    bhashyaSrc: BHASHYA_SRC,
    note: '',
    src: SRC
  }
];
