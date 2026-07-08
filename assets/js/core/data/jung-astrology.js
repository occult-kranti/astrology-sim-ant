// ============================================================================
//  jung-astrology.js — the C. G. Jung & astrology reference data: the planetary
//  archetypes of a Jungian chart-reading, the element→function mapping (flagged
//  post-Jungian), the verified figures of the 1952 astrological marriage
//  experiment, the aeon datings from Aion, Jung's own nativity, and the dated
//  timeline of his engagement with astrology.
//
//  PURE DATA + provenance per record. Sourced by a multi-agent research pass
//  verified against the primary texts (CW paragraph numbers checked in the
//  full-text PDFs; the Freud/Jung letters checked verbatim; the experiment's
//  figures checked against CW 8 §§872–915 and its appendix).
//
//  HONEST FRAMING: Jung USED astrology as a psychological and interpretive
//  instrument; he never validated it — his own experiment failed statistically
//  and he said so plainly (CW 8 §§881, 883, 901). Everything here is recorded
//  history of ideas, described never prescribed. Where a doctrine is
//  post-Jungian (Greene, Arroyo, Hillman) rather than Jung's own, it says so.
// ============================================================================

// --- the planets as archetypal images ---------------------------------------
export const JUNG_PLANET_ARCHETYPES = [
  { planet: 'Sun', archetype: 'Sol — consciousness, the ego and the Self-axis',
    meaning: 'In the alchemical writings Jung mined, Sol is the light of consciousness and the kingly principle; in a chart-reading after him, the Sun figures the conscious standpoint and the ego’s line of development toward the Self.',
    cite: 'Jung, Mysterium Coniunctionis (CW 14) ch. III §2 “Sol”, §§110ff (alchemical, not natal, in Jung); the ego–Self axis after E. Edinger.' },
  { planet: 'Moon', archetype: 'Luna — the unconscious, the mother, the anima',
    meaning: 'Luna is Sol’s counterpart: the reflective, nocturnal psyche. A Jungian reading takes the Moon for the unconscious matrix — the mother-imago and, in a man’s psychology as Jung framed it, the anima.',
    cite: 'Jung, Mysterium Coniunctionis (CW 14) ch. III §4 “Luna”, §§154ff; CW 9i on the mother archetype.' },
  { planet: 'Mercury', archetype: 'Mercurius — the trickster-psychopomp of the work',
    meaning: 'Jung devoted a whole essay to the spirit Mercurius: the shape-shifting mediator, at once the lowest and highest, guide of souls and spirit of the unconscious (“Mercurius duplex”). Mercury in a chart is read as the mediating, translating function.',
    cite: 'Jung, “The Spirit Mercurius” (CW 13, §§239–303); “On the Psychology of the Trickster-Figure” (CW 9i).' },
  { planet: 'Venus', archetype: 'Eros — relatedness, value, the anima’s carrier',
    meaning: 'Venus carries the Eros principle — relatedness, attraction, the felt values that bind. Post-Jungian astrologers read her as one face of the anima and of the feeling-life.',
    cite: 'The principle: Jung, Aion (CW 9ii) §29 (anima/Eros vs animus/Logos — not an astrological text); the chart-usage is post-Jungian (L. Greene, Relating, 1977).' },
  { planet: 'Mars', archetype: 'Ares — will, aggression, the animus’ edge',
    meaning: 'Mars is the assertive, separating drive — desire and the will-to-assert. In the era-bound scheme, Mars in a woman’s chart was read toward the animus; post-Jungians read Mars as the fighting, initiating energy in any psyche.',
    cite: 'Post-Jungian: J. Hillman, A Terrible Love of War (2004) on Ares; L. Greene, Relating (1977); cf. Jung on the animus, CW 9ii §29.' },
  { planet: 'Jupiter', archetype: 'The wise king — meaning, expansion, the religious function',
    meaning: 'Jupiter figures the psyche’s drive toward meaning and wholeness of view — what Jung called the religious function. A dominant Jupiter is read as the philosophic, meaning-making bent.',
    cite: 'The religious function: Jung, Psychology and Religion (CW 11); the chart-usage is post-Jungian (S. Arroyo, 1978; L. Greene).' },
  { planet: 'Saturn', archetype: 'The senex — limit, time, the shadow’s weight',
    meaning: 'Saturn is the senex: age, structure, limitation and the weight of necessity — polar twin of the puer aeternus, and alchemical lead. Hard Saturn contacts to the lights are read, in post-Jungian practice, as the shadow pressing for integration.',
    cite: 'Post-Jungian, flagged: J. Hillman, “Senex and Puer” (1967); L. Greene, Saturn: A New Look at an Old Devil (1976).' },
];

// --- the four elements → the four psychological functions --------------------
// The mapping is POST-JUNGIAN. Jung tied astrology to his typology historically
// (CW 6 §933: the oldest classification attempts "were made by oriental
// astrologers who devised the so-called trigons of the four elements"), but the
// tidy fire=intuition / earth=sensation / air=thinking / water=feeling scheme
// was systematised by Stephen Arroyo (Astrology, Psychology and the Four
// Elements, 1975) and Liz Greene (Relating, 1977) — Greene herself noted the
// fit is imperfect.
export const ELEMENT_FUNCTIONS = [
  { element: 'Fire', function: 'Intuition', note: 'the possibility-seeing, future-leaping function', cite: 'post-Jungian (Arroyo 1975; Greene 1977), after Jung’s typology (CW 6)' },
  { element: 'Earth', function: 'Sensation', note: 'the fact-perceiving, embodied function', cite: 'post-Jungian (Arroyo 1975; Greene 1977), after CW 6' },
  { element: 'Air', function: 'Thinking', note: 'the ordering, conceptual function', cite: 'post-Jungian (Arroyo 1975; Greene 1977), after CW 6' },
  { element: 'Water', function: 'Feeling', note: 'the valuing, relating function', cite: 'post-Jungian (Arroyo 1975; Greene 1977), after CW 6' },
];

export const ANIMA_ANIMUS_NOTE =
  'The psychological doctrine is Jung’s: “the animus corresponds to the paternal Logos just as the anima corresponds to '
  + 'the maternal Eros” (Aion, CW 9ii §29, “The Syzygy”). The astrological translation — the anima read through the Moon '
  + 'and Venus of a man’s chart, the animus through the Sun and Mars of a woman’s — is the work of post-Jungian '
  + 'astrologers; modern practice reads these significators in any chart regardless of gender. Recorded as history of ideas.';

export const CONIUNCTIO_NOTE =
  'In Mysterium Coniunctionis (CW 14) Jung took the alchemists’ coniunctio Solis et Lunae — the “chymical wedding” of Sun '
  + 'and Moon, king and queen — as the master-image of the union of opposites: consciousness united with the unconscious, '
  + 'the goal-image of individuation. He noted in the Synchronicity essay that the very aspects his marriage experiment '
  + 'tallied (Sun–Moon, Moon–Moon) repeat this coniunctio motif (CW 8).';

// --- the astrological marriage experiment (Synchronicity, 1952) --------------
//  Every figure below verified against the full text of CW 8, ch. 2 ("An
//  Astrological Experiment", §§872–915) and its appendix.
export const JUNG_EXPERIMENT = {
  orb: 8,   // "8 degrees either way, clockwise and anticlockwise, extending beyond the sign" (§880)
  batches: [
    { n: 1, pairs: 180, topAspect: 'Sun ☌ Moon', pct: 10.0,
      note: 'The pilot batch (360 horoscopes). Top: the wife’s Moon conjunct the husband’s Sun — 18 of 180 pairs. Control: the same 180 men × 179 non-wives = 32,220 unmarried pairings, whose best aspect managed only 5.3%.' },
    { n: 2, pairs: 220, topAspect: 'Moon ☌ Moon', pct: 10.9,
      note: 'Collected over a year later and evaluated as it came in. Top: Moon conjunct Moon — 24 of 220 pairs. Merged with batch 1, the batch-1 maxima fell back toward the mean.' },
    { n: 3, pairs: 83, topAspect: 'Moon ☌ Ascendant', pct: 9.6,
      note: 'The final batch. Top: Moon conjunct Ascendant — 8 of 83 pairs — while the earlier maxima collapsed (Sun–Moon to 7.2%, Moon–Moon to 4.8%). Jung likened the decline across batches to the decline effect in Rhine’s ESP runs as his own interest cooled (§910).' },
  ],
  totalPairs: 483, totalHoroscopes: 966,
  aspectsExamined: 'Fifty cross-aspects between the spouses’ charts (§878): the conjunctions and oppositions of Sun, Moon, Mars, Venus, Ascendant and Descendant of one partner to those of the other. Squares, trines, sextiles and the MC/IC were deliberately omitted "so as not to make the exposition unduly complicated" (§878 n. 3).',
  method: 'Birth data for married couples were donated by "friendly donors in Zurich, London, Rome, and Vienna" (§872), piled up in the order the post brought them and split into three batches only by pauses in the mail. The horoscopes were computed and the fifty aspects tallied by Jung’s co-worker, the analyst Dr. Liliane Frey-Rohn (§§896, 989). Controls: 32,220 unmarried cross-pairings of batch 1 (best aspect 5.3%); 300 randomly stacked unmarried pairs (7.3%); 325 and 400 pairs drawn by lot (6.5%, 6.2%) — all well below the married batches’ ~10% maxima, but so is chance’s spread at those sample sizes.',
  initialOdds: 'In the ant-in-the-matchbox illustration Jung put the chance of the two lunar conjunctions coinciding at 1 : 2,500,000 and of all three classical aspects together at 1 : 62,500,000 (§904) — figures the Eranos version had run as high as 1 : 3×10¹¹ before correction.',
  fierz: 'The probability calculations were done by the theoretical physicist Markus Fierz of Basel (a former Pauli assistant), Jung being "not very well up in the higher mathematics" (§901). The corrections came in stages, each measuring a different thing. In the text: Fierz first put the chance of the two lunar-conjunction maxima at ~1:10,000 each and the third at ~1:1,300 (§901); rechecking, he caught his own error — six possible orderings, ×6 — bringing the joint figure for the first two down to about 1:1,500 (§901 n. 9); and "at the eleventh hour" he found he had been "deceived by the factor 5", reducing the improbability yet again, "though without reaching a degree which one could have described as probable" (§906). Separately, the editors’ appendix gives his checked per-batch tail probabilities for the three observed maxima — about 1:1,000 (18 of 180), 1:10,000 (24 of 220) and 1:50 (8 of 83) — and roughly 1:10,000 for the three classical conjunctions each topping a batch in turn. And Jung noted, damningly, that "the errors all tend to exaggerate the results in a way favourable to astrology" (§906).',
  pauli: 'Wolfgang Pauli was the interlocutor throughout: the monograph appeared jointly with Pauli’s Kepler essay (Naturerklärung und Psyche, 1952), and in a November 1950 letter Pauli pressed Jung that the decisive variable was the experimenters’ psychic state, not astrology (Atom and Archetype, ed. Meier).',
  conclusion: 'Jung’s verdict was explicit: "Calculations undertaken by a mathematician showed unmistakably that the average frequency of 10% in all three batches is far from representing a significant figure" (§881); "to a statistician, these figures cannot be used to confirm anything, and so are valueless" (§883). Yet out of fifty possibilities the maxima of three fortuitous batches fell, in turn, on the three classical lunar marriage aspects of the tradition — an arrangement one "could not have done more successfully" had one wanted to falsify the statistics in astrology’s favour (§895). His explanation was not astral causality but the psychic state of the experimenters — a "secret, mutual connivance" between the material and the researcher’s hope (§905), the archetype of the coniunctio constellating in the data exactly as it was looked for: "it is just what I call a synchronistic phenomenon" (§904). In 1958 he restated publicly that the experiment was never meant to prove astrology and that its statistics were unfavourable to any objective astrological claim.',
  cite: 'Jung, “An Astrological Experiment”, Synchronicity: An Acausal Connecting Principle (1952), CW 8 §§872–915 + appendix; “On Synchronicity” (Eranos 1951), CW 8 §§969–997; the 1958 clarification, CW 18 §§1174–1192 (Zeitschrift für Parapsychologie, 1958); Atom and Archetype: The Pauli/Jung Letters (ed. Meier, 2001).',
};

// --- Aion: the aeon datings ---------------------------------------------------
export const AEON = {
  datings: [
    { when: 'between AD 2000 and AD 2200', by: 'Jung’s own reckoning in Aion: "Astrologically the beginning of the next aeon, according to the starting point you select, falls between AD 2000 and AD 2200" — the spring-point entering Aquarius "in the course of the third millennium"', cite: 'Aion (CW 9ii), ch. VI "The Sign of the Fishes", n. to §149; cf. Flying Saucers, CW 10 §589f' },
    { when: '≈ AD 2440', by: 'the equal-sign sidereal reckoning (Lahiri ayanāṁśa = 30°) — computed live by this engine', cite: 'this site: lahiriAyanamsa()' },
    { when: '≈ AD 2597', by: 'the IAU constellation boundary of Pisces/Aquarius (the modern astronomical boundary, drawn 1928)', cite: 'IAU constellation boundaries (Delporte, 1930)' },
  ],
  note: 'There is no fact of the matter about when an "age" begins: constellation boundaries are conventions, the equal 30° signs another, and the fish-star reckonings a third — Jung himself stressed that the date depends on "the starting point you select". The precession itself — the vernal point drifting one Platonic month of ~2,148 years per sign — is real, verifiable astronomy.',
  cite: 'Jung, Aion (CW 9ii) ch. VI (§§127–149); the precession constant after IAU 2006 (50.28796″/yr).',
};

// --- Jung's own nativity ------------------------------------------------------
//  26 July 1875, Kesswil on Lake Constance (canton Thurgau), Switzerland. No
//  official birth time was recorded; his daughter Gret Baumann-Jung — a
//  practising astrologer who computed charts for his diagnostic use — worked
//  from the family report that he was born "when the last rays of the setting
//  sun lit the room" and used 7:32 p.m. local time, giving Sun in Leo, Moon in
//  Taurus and an Ascendant in the first degrees of Aquarius (so near the cusp
//  that a late-Capricorn rising has also been argued).
export const JUNG_BIRTH = {
  name: 'C. G. Jung', date: '1875-07-26', time: '19:32',
  lat: 47.596, lon: 9.3140, utcOffset: 0.62,     // local mean time at Kesswil (9.314°E ≈ UTC+0:37)
  note: 'Birth time per Gret Baumann-Jung (1975), a family reconstruction from "the last rays of the setting sun" — no official record exists, and the Ascendant is correspondingly uncertain (early Aquarius, on the argued Capricorn cusp).',
  cite: 'G. Baumann-Jung, “Some Reflections on the Horoscope of C. G. Jung”, Spring (1975), pp. 35–55.',
};

// --- the timeline -------------------------------------------------------------
//  From the verified research pass (dates, quotes and citations checked against
//  the primary texts). Rendered by pages/jung/timeline.html.
export const JUNG_TIMELINE = [
  { year: '1875', kind: 'life', title: 'Born at Kesswil — the chart his daughter later cast',
    text: 'Carl Gustav Jung is born on 26 July 1875 at Kesswil on Lake Constance. No official birth time was recorded; his daughter, the astrologer Gret Baumann-Jung, later used 7:32 p.m. — the family remembered him born "when the last rays of the setting sun lit the room" — giving Sun in Leo, Moon in Taurus, and an Ascendant in the first degrees of Aquarius, so near the cusp that a Capricorn rising has also been argued.',
    cite: 'G. Baumann-Jung, “Some Reflections on the Horoscope of C. G. Jung”, Spring (1975), pp. 35–55.' },
  { year: '1911-05', kind: 'letter', title: 'To Freud: astrology “indispensable” for mythology',
    text: 'On 8 May 1911 Jung tells Freud that occultism is a field psychoanalysis must conquer and that he is "looking into astrology", which seems to him indispensable for a proper understanding of mythology — the first documented notice of his astrological studies. Freud replies with wary indulgence, warning him not to stay too long in those exotic "colonies" of research.',
    cite: 'The Freud/Jung Letters, ed. McGuire (Princeton, 1974), letter 254 J, 8 May 1911.' },
  { year: '1911-06', kind: 'letter', title: '“My evenings are taken up very largely with astrology”',
    text: 'On 12 June 1911 Jung writes to Freud: "My evenings are taken up very largely with astrology. I make horoscopic calculations in order to find a clue to the core of psychological truth" — adding that astrology may one day yield "a good deal of knowledge that has been intuitively projected into the heavens." Even here the frame is projection: astrology as buried human psychology, not celestial causation.',
    cite: 'The Freud/Jung Letters, ed. McGuire (Princeton, 1974), letter 259 J, 12 June 1911.' },
  { year: '1911–1950s', kind: 'life', title: 'Horoscopes in the consulting room',
    text: 'From the Freud-letter period onward Jung cast (or had cast) natal charts of patients as an auxiliary diagnostic lens — in later years his daughter Gret computed them for him. He treated the horoscope as a symbolic portrait of the client’s psyche "from an entirely different angle", never a predictive instrument; in 1947 he could say he had been interested in astrology "for more than 30 years".',
    cite: 'Letter to B. V. Raman, 6 Sept 1947 (Letters I, pp. 475f); L. Greene, Jung’s Studies in Astrology (2018).' },
  { year: '1913–1930', kind: 'work', title: 'The Black Books & Liber Novus — an astrological cosmology',
    text: 'During his "confrontation with the unconscious", Jung’s private notebooks and the Red Book absorb astrological and aeonic imagery — the zodiac, the planetary spheres, and the coming transition between Platonic months that would resurface in Aion. Liz Greene’s study documents how densely the visionary material draws on the astrological and Mithraic symbolism he had researched since 1911.',
    cite: 'L. Greene, The Astrological World of Jung’s Liber Novus (2018); The Red Book: Liber Novus, ed. Shamdasani (2009).' },
  { year: '1921', kind: 'work', title: 'Psychological Types — astrology as the oldest typology',
    text: 'Jung frames his typology within the long history of attempts to classify character, a lineage he traces to astrology: the oldest known attempts "were made by oriental astrologers who devised the so-called trigons of the four elements — air, water, earth, and fire." Astrology as proto-psychology: an ancient system of typing people, valuable as history, not as science.',
    cite: 'Psychological Types (1921), CW 6; appendix “A Psychological Theory of Types”, CW 6 §933.' },
  { year: '1923', kind: 'life', title: 'The Tower at Bollingen',
    text: 'After his mother’s death Jung begins the stone tower at Bollingen — his lifelong retreat and the workshop of the alchemical and astrological-symbolic studies from which Aion and the synchronicity essay matured. In Memories, Dreams, Reflections he calls it a "representation in stone" of psychic wholeness.',
    cite: 'Memories, Dreams, Reflections, ed. Jaffé (1962), ch. VIII “The Tower”.' },
  { year: '1930-05', kind: 'work', title: 'The Wilhelm memorial — “the summation of all the psychological knowledge of antiquity”',
    text: 'In his memorial address for the sinologist Richard Wilhelm (Munich, 10 May 1930), Jung declares that "astrology represents the summation of all the psychological knowledge of antiquity." The context is his defence of Wilhelm’s I Ching: ancient divinatory systems encode real psychological observation in projected, symbolic form. His most-quoted sentence on astrology — praise of it as an archive of psychology, not an endorsement of prediction.',
    cite: '“Richard Wilhelm: In Memoriam” (1930), CW 15 §81.' },
  { year: '1932', kind: 'life', title: 'Wolfgang Pauli enters Jung’s orbit',
    text: 'The physicist Wolfgang Pauli, in personal crisis, approaches Jung, who studies his extraordinary dream series (used anonymously in Psychology and Alchemy). Their correspondence runs to Pauli’s death in 1958 and becomes the crucible of the synchronicity concept — with Pauli pressing Jung toward statistical and epistemological rigour, including on the astrology experiment.',
    cite: 'Atom and Archetype: The Pauli/Jung Letters 1932–1958, ed. Meier (2001).' },
  { year: '1933–41', kind: 'work', title: 'The ETH lectures — teaching students how a horoscope works',
    text: 'As lecturer (from 1935 titular professor) at the ETH Zürich, Jung devotes sessions to astrology, walking students through the horoscope’s construction — signs, houses, aspects — as the clearest example of "projected psychology": the psyche seen outside man and read in the stars.',
    cite: 'History of Modern Psychology: ETH Lectures vol. 1, 1933–34, ed. Falzeder (Philemon/Princeton, 2019).' },
  { year: '1936', kind: 'work', title: 'Bailey Island — Pauli’s dreams before an American audience',
    text: 'In September 1936 Jung presents Pauli’s anonymised dream series — including the famous "world clock" vision with its rotating cosmic circles — at Bailey Island, Maine (continued in New York, 1937). The material becomes Part II of Psychology and Alchemy, where astrological and alchemical symbols are read as spontaneous products of the modern unconscious.',
    cite: 'Dream Symbols of the Individuation Process, ed. S. Gieser (Philemon Series; Princeton, 2019); cf. CW 12, Part II.' },
  { year: '1936', kind: 'legacy', title: 'Rudhyar’s The Astrology of Personality',
    text: 'Dane Rudhyar publishes the first systematic fusion of Jungian depth psychology with natal astrology, reframing the chart as a map of individuation rather than fate — the fountainhead of "humanistic" and psychological astrology, through which Jung’s ideas flooded twentieth-century practice largely without his participation.',
    cite: 'D. Rudhyar, The Astrology of Personality (Lucis, 1936).' },
  { year: '1947-09', kind: 'letter', title: 'To B. V. Raman — the horoscope as diagnostic aid',
    text: 'To the Indian astrologer B. V. Raman: "In cases of difficult psychological diagnosis I usually get a horoscope in order to have a further point of view from an entirely different angle", adding that the astrological data often "elucidated certain points which I otherwise would have been unable to understand." In the same letter he leaves the mechanism carefully open — projection, synchronicity, or something unknown.',
    cite: 'Letter to B. V. Raman, 6 Sept 1947, C. G. Jung Letters vol. 1, pp. 475–476.' },
  { year: '1951', kind: 'work', title: 'Aion — the sign of the fishes',
    text: 'Jung reads two thousand years of Christian symbol-history against the precession of the spring equinox through the two fishes of Pisces — Christ and Antichrist as the aeon’s opposed poles — using the astrological ages as a symbolic chronology of the collective psyche. His dating of the next aeon: "according to the starting point you select, [it] falls between AD 2000 and AD 2200."',
    cite: 'Aion (1951), CW 9ii, ch. VI “The Sign of the Fishes”, §§127–149 (dating: n. to §149).' },
  { year: '1952', kind: 'experiment', title: 'Synchronicity and the marriage experiment — which failed, and he said so',
    text: 'In "Synchronicity: An Acausal Connecting Principle" Jung tests astrology statistically: 483 married pairs (966 horoscopes; batches of 180, 220 and 83) tallied over fifty cross-aspects. Each batch peaked on a different classical marriage aspect (Sun–Moon, Moon–Moon, Moon–Ascendant) — but after the physicist Markus Fierz corrected the probabilities, Jung conceded the maxima lay within chance and "cannot be used to confirm anything". He reinterpreted the suggestive run as a synchronistic effect of the experimenters’ own hopeful psyche — an honest negative result he never retracted.',
    cite: '“Synchronicity” (1952), CW 8 §§872–915 + appendix; The Interpretation of Nature and the Psyche (Jung & Pauli, 1952/1955).' },
  { year: '1954-05', kind: 'letter', title: 'To André Barbault — “a definite moment in the colloquy of the gods”',
    text: 'Answering the French astrologer’s questionnaire (26 May 1954), Jung writes that the horoscope "corresponds to a definite moment in the colloquy of the gods, that is to say the psychic archetypes", and attributes valid-seeming astrological results to synchronicity rather than causality — the fullest late statement of his considered position.',
    cite: 'Letter to A. Barbault, 26 May 1954, C. G. Jung Letters vol. 2, pp. 175–177.' },
  { year: '1958', kind: 'work', title: 'Flying Saucers — the turning of the aeon',
    text: 'Jung reads the UFO rumour as a symptom of "changes in the constellation of the psychic dominants, of the archetypes, or ‘gods’ as they used to be called", traced through the aeons of Taurus, Aries and Pisces: "We are now nearing that great change which may be expected when the spring-point enters Aquarius."',
    cite: 'Flying Saucers: A Modern Myth (1958), CW 10 §§589–590.' },
  { year: '1958', kind: 'experiment', title: '“An Astrological Experiment” — setting the record straight',
    text: 'Irritated that both astrologers and sceptics were misreading the 1952 study, Jung publishes a clarification: the experiment was never designed to prove or disprove astrology, and its statistical outcome was unfavourable to any objective astrological claim. What interested him was the psychology of the meaningful coincidence — including the experimenter’s own participation.',
    cite: '“Ein astrologisches Experiment”, Zeitschrift für Parapsychologie und Grenzgebiete der Psychologie I:2/3 (1958); in English CW 18 §§1174–1192.' },
  { year: '1961-06', kind: 'life', title: 'Death at Küsnacht',
    text: 'Jung dies on 6 June 1961 at Küsnacht on Lake Zurich, aged 85. He left no system of astrology and no endorsement of its predictive validity — a body of work treating the horoscope as a historically deep symbolic language of the psyche, plus one carefully reported failed experiment.',
    cite: 'Memories, Dreams, Reflections (1962), editor’s introduction; D. Bair, Jung: A Biography (2003).' },
  { year: '1962', kind: 'work', title: 'Memories, Dreams, Reflections',
    text: 'The posthumous autobiography (with Aniela Jaffé) recounts the break with Freud, the Tower, and — in "Late Thoughts" — returns to the aeon of the fishes and the transformation of the Christian eon, fixing the public image of Jung as an empiricist of the symbolic life.',
    cite: 'Memories, Dreams, Reflections, ed. Jaffé (1962), chs. “The Tower” and “Late Thoughts”.' },
  { year: '1975', kind: 'legacy', title: 'Gret Baumann-Jung publishes her father’s horoscope',
    text: 'Jung’s daughter (1906–1995), the astrologer who had computed charts for his diagnostic use, publishes her study of his nativity from the family’s 7:32 p.m. birth time — still the primary source for Jung’s birth data.',
    cite: '“Some Reflections on the Horoscope of C. G. Jung”, Spring (1975), pp. 35–55.' },
  { year: '1975', kind: 'legacy', title: 'Hillman and archetypal psychology',
    text: 'James Hillman — editor of Spring, which carried Baumann-Jung’s article that same year — publishes Re-Visioning Psychology, founding archetypal psychology. His polytheistic reading of the psyche’s images supplied post-Jungian astrology with much of its theoretical vocabulary, while remaining agnostic about astrology’s empirical claims.',
    cite: 'J. Hillman, Re-Visioning Psychology (1975); his 1997 address “Heaven Retains Within Its Sphere Half of All Bodies and Maladies”.' },
  { year: '1983', kind: 'legacy', title: 'Liz Greene and the Centre for Psychological Astrology',
    text: 'The Jungian analyst and astrologer Liz Greene — whose Saturn (1976) had recast a traditional malefic in depth-psychological terms — co-founds the Centre for Psychological Astrology in London with Howard Sasportas, institutionalising the Jungian approach to chart-work. Greene later wrote the major scholarly studies of Jung’s own astrological practice.',
    cite: 'L. Greene, Saturn (1976); Jung’s Studies in Astrology and The Astrological World of Jung’s Liber Novus (Routledge, 2018).' },
  { year: '2006', kind: 'legacy', title: 'Tarnas’s Cosmos and Psyche',
    text: 'Richard Tarnas argues from Jung’s concepts of archetype and synchronicity toward an "archetypal cosmology" correlating planetary cycles with cultural history — the most ambitious post-Jungian case for astrology’s meaningfulness, and, like Jung’s own claims, outside scientific acceptance: psychologically rich, empirically unproven.',
    cite: 'R. Tarnas, Cosmos and Psyche (Viking, 2006).' },
];
