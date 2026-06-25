// ============================================================================
//  vedic-remedies.js — Cited correspondence tables for STUDY of the traditional
//  Jyotiṣa remedial / devotional system: navagraha bīja & nāma mantras + japa
//  counts, vāra (weekday) observances, nakṣatra devatās, the graha→āsana
//  ("astro-yoga") map, and the graha yantra / metal / gem table.
//
//  HISTORICAL & CULTURAL PRACTICE, DESCRIBED — NOT PRESCRIBED.
//  Astrology is a pseudoscience with no demonstrated predictive validity. The
//  mantras, fasts (vrata), āsanas, yantras and gemstone "remedies" below are
//  recorded because the cultural/textual tradition lists them — they are
//  reference material for study, NOT instruction, recommendation, or medical/
//  spiritual advice. Nothing here is endorsed as efficacious.
//
//  CLASSICAL vs MODERN — the load-bearing distinction for this file:
//   • classical:true   — attested in the standard Jyotiṣa / tantra / pañcāṅga
//     corpus (BPHS, Mantra Mahodadhi, the Navagraha Stotra, the graha-yantra
//     tradition, the dharmaśāstra/Purāṇic vrata calendar).
//   • classical:false  — MODERN / SYNCRETIC. The graha→āsana map in particular
//     is a 20th–21st-c. "astro-yoga"/yoga-therapy correspondence with NO
//     classical Jyotiṣa basis; it is included only so the tool can show it,
//     clearly labelled as modern eclectic practice.
//
//  Planet keys follow the codebase convention: Sun, Moon, Mars, Mercury,
//  Jupiter, Venus, Saturn, Rahu, Ketu (see vedic-data.js GRAHAS).
//
//  SOURCES (per-record `source` cites one; see also "REMEDIES_SOURCES" at end):
//   • BPHS — Bṛhat Parāśara Horā Śāstra, R. Santhanam tr. (remedial chapters,
//     graha devatās, gem/metal indications).
//   • Mantra Mahodadhi of Mahīdhara (the navagraha bīja-mantra family).
//   • Navagraha Stotra (Vyāsa) — the nāma/dhyāna ślokas & "main deity".
//   • The graha-yantra tradition (magic-square constants 15,18,…,39 step 3).
//   • Dharmaśāstra / Purāṇic vāra-vrata calendar (Śiva Purāṇa Vratakhaṇḍa etc.).
//   Several deity assignments DIFFER BY LINEAGE; variants are flagged in-data
//   (deityAlt / note / sourceNote) rather than silently resolved.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. NAVAGRAHA BĪJA + NĀMA MANTRAS  (CLASSICAL — Mantra Mahodadhi family)
// ---------------------------------------------------------------------------
//  • bijaIAST / bijaDeva — the tāntric bīja ("seed") mantra. The seed-syllable
//    pattern is Oṁ <Bīja>āṁ <Bīja>īṁ <Bīja>auṁ Saḥ <dative graha-name> Namaḥ.
//  • namaIAST / namaDeva — the simpler nāma mantra "Oṁ <dative> Namaḥ".
//  • japa — the traditional puraścaraṇa repetition count (widely-published
//    standard; flagged japaStandardised). Ketu = 17000 (NOT 7000 — common error).
//  • mainDeity — the graha's own presiding deity per the Navagraha Stotra / BPHS.
export const GRAHA_MANTRAS = {
  Sun: {
    sanskrit: 'Sūrya',
    bijaIAST: 'Oṁ Hrāṁ Hrīṁ Hrauṁ Saḥ Sūryāya Namaḥ',
    bijaDeva: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    namaIAST: 'Oṁ Sūryāya Namaḥ', namaDeva: 'ॐ सूर्याय नमः',
    japa: 7000, japaStandardised: true,
    mainDeity: 'Śiva (Sūrya as Śiva); Agni in the adhidevatā set',
    classical: true,
    source: 'Mantra Mahodadhi (bīja family); Navagraha Stotra (nāma); japa 7000 per common puraścaraṇa tables',
  },
  Moon: {
    sanskrit: 'Candra',
    bijaIAST: 'Oṁ Śrāṁ Śrīṁ Śrauṁ Saḥ Candrāya Namaḥ',
    bijaDeva: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    namaIAST: 'Oṁ Candrāya Namaḥ', namaDeva: 'ॐ चन्द्राय नमः',
    japa: 11000, japaStandardised: true,
    mainDeity: 'Pārvatī / Umā; Apas (the cosmic waters) in the adhidevatā set',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 11000 per common tables',
  },
  Mars: {
    sanskrit: 'Maṅgala',
    bijaIAST: 'Oṁ Krāṁ Krīṁ Krauṁ Saḥ Bhaumāya Namaḥ',
    bijaDeva: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    namaIAST: 'Oṁ Aṅgārakāya Namaḥ', namaDeva: 'ॐ अङ्गारकाय नमः',
    japa: 10000, japaStandardised: true,
    mainDeity: 'Skanda / Subrahmaṇya (Kārttikeya)',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 10000. Mars named Bhauma/Aṅgāraka/Maṅgala — all attested',
  },
  Mercury: {
    sanskrit: 'Budha',
    bijaIAST: 'Oṁ Brāṁ Brīṁ Brauṁ Saḥ Budhāya Namaḥ',
    bijaDeva: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    namaIAST: 'Oṁ Budhāya Namaḥ', namaDeva: 'ॐ बुधाय नमः',
    japa: 9000, japaStandardised: true,
    mainDeity: 'Viṣṇu (Mahāviṣṇu)',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 9000',
  },
  Jupiter: {
    sanskrit: 'Guru / Bṛhaspati',
    bijaIAST: 'Oṁ Grāṁ Grīṁ Grauṁ Saḥ Gurave Namaḥ',
    bijaDeva: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    namaIAST: 'Oṁ Bṛhaspataye Namaḥ', namaDeva: 'ॐ बृहस्पतये नमः',
    japa: 19000, japaStandardised: true,
    mainDeity: 'Brahmā (Indra in some lists)',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 19000',
  },
  Venus: {
    sanskrit: 'Śukra',
    bijaIAST: 'Oṁ Drāṁ Drīṁ Drauṁ Saḥ Śukrāya Namaḥ',
    bijaDeva: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    namaIAST: 'Oṁ Śukrāya Namaḥ', namaDeva: 'ॐ शुक्राय नमः',
    japa: 16000, japaStandardised: true,
    mainDeity: 'Indrāṇī (Śacī) / Lakṣmī',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 16000',
  },
  Saturn: {
    sanskrit: 'Śani',
    bijaIAST: 'Oṁ Prāṁ Prīṁ Prauṁ Saḥ Śanaiścarāya Namaḥ',
    bijaDeva: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    namaIAST: 'Oṁ Śanaiścarāya Namaḥ', namaDeva: 'ॐ शनैश्चराय नमः',
    japa: 23000, japaStandardised: true,
    mainDeity: 'Brahmā (main deity); Yama in the adhidevatā set',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 23000',
  },
  Rahu: {
    sanskrit: 'Rāhu',
    bijaIAST: 'Oṁ Bhrāṁ Bhrīṁ Bhrauṁ Saḥ Rāhave Namaḥ',
    bijaDeva: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    namaIAST: 'Oṁ Rāhave Namaḥ', namaDeva: 'ॐ राहवे नमः',
    japa: 18000, japaStandardised: true,
    mainDeity: 'Durgā (Kāla / the serpent Nāga in some lists)',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 18000',
  },
  Ketu: {
    sanskrit: 'Ketu',
    bijaIAST: 'Oṁ Srāṁ Srīṁ Srauṁ Saḥ Ketave Namaḥ',
    bijaDeva: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    namaIAST: 'Oṁ Ketave Namaḥ', namaDeva: 'ॐ केतवे नमः',
    japa: 17000, japaStandardised: true,
    mainDeity: 'Gaṇeśa (Citragupta in some lists)',
    classical: true,
    source: 'Mantra Mahodadhi; Navagraha Stotra; japa 17000 (NOT 7000 — common transcription error)',
  },
};
// japa-count quick table (puraścaraṇa standard). Sums to 130000.
export const GRAHA_JAPA = { Sun: 7000, Moon: 11000, Mars: 10000, Mercury: 9000, Jupiter: 19000, Venus: 16000, Saturn: 23000, Rahu: 18000, Ketu: 17000 };
export const GRAHA_MANTRA_SOURCE = 'Mantra Mahodadhi (bīja family) + Navagraha Stotra (nāma & main deity); japa counts per the common puraścaraṇa tables. Flagged japaStandardised — minor lineage variants exist.';

// ---------------------------------------------------------------------------
// 1b. ADHIDEVATĀ / PRATYADHIDEVATĀ  (CLASSICAL but LINEAGE-VARIANT — flag it)
// ---------------------------------------------------------------------------
//  BPHS gives each graha a three-tier deity stack: the graha-devatā (the planet
//  itself), the adhidevatā ("presiding"), and the pratyadhidevatā ("co-presiding").
//  THE ASSIGNMENTS DIFFER BETWEEN PUBLISHED LINEAGES — do NOT present as fixed.
export const GRAHA_DEVATAS = {
  Sun:     { adhi: 'Agni',    pratyadhi: 'Śiva / Rudra',  note: 'Agni/Śiva widely listed' },
  Moon:    { adhi: 'Apas (the waters)', pratyadhi: 'Umā / Gaurī', note: '' },
  Mars:    { adhi: 'Skanda (some lineages: Vīrabhadra/Kṣetrapāla)', pratyadhi: 'Pṛthivī / Bhūmi (some: Skanda)', note: 'Skanda placed as adhi OR pratyadhi depending on source' },
  Mercury: { adhi: 'Viṣṇu',   pratyadhi: 'Nārāyaṇa / Viṣṇu (some: Kubera as adhi)', note: 'Viṣṇu vs Kubera split across lineages' },
  Jupiter: { adhi: 'Brahmā (some: Indra)', pratyadhi: 'Indra (some: Brahmā / Dakṣiṇāmūrti)', note: 'Brahmā↔Indra swapped between sources' },
  Venus:   { adhi: 'Indra / Śacī (Indrāṇī)', pratyadhi: 'Indrāṇī / Lakṣmī', note: '' },
  Saturn:  { adhi: 'Yama',    pratyadhi: 'Prajāpati / Brahmā (some: Śiva)', note: '' },
  Rahu:    { adhi: 'Kāla / Durgā', pratyadhi: 'Sarpa (Nāga) / Durgā', note: 'Pitṛ/Paśu in some lists' },
  Ketu:    { adhi: 'Citragupta (some: Nirṛti)', pratyadhi: 'Brahmā / Gaṇeśa', note: '' },
};
export const GRAHA_DEVATA_SOURCE = 'BPHS (R. Santhanam tr.) graha/adhi/pratyadhi devatā chapters. WARNING: assignments differ between published lineages; variants flagged — never present as a single fixed table.';

// ---------------------------------------------------------------------------
// 2. VĀRA (WEEKDAY) OBSERVANCES  (CLASSICAL — Purāṇic / dharmaśāstra calendar)
// ---------------------------------------------------------------------------
//  Index 0..6 = JS getUTCDay (Sunday..Saturday). lord aligns with vedic-data.js
//  VARA_LORDS. Some pairings (esp. Tuesday→Hanumān, Friday→Santoṣī Mā) are
//  POPULAR/later rather than ancient — flagged `popular:true`.
export const VARA = [
  { idx: 0, name: 'Sunday',    sanskrit: 'Ravivāra',     lord: 'Sun',     deity: 'Sūrya (also Śiva)', vrata: 'Ravivāra / Āditya vrata', colour: 'red',          offering: 'wheat, jaggery, red flowers', classical: true, source: 'Purāṇic vāra-vrata calendar' },
  { idx: 1, name: 'Monday',    sanskrit: 'Somavāra',     lord: 'Moon',    deity: 'Śiva (Soma)',       vrata: 'Somavāra vrata (Śiva Purāṇa Vratakhaṇḍa)', colour: 'white',        offering: 'milk, raw rice, bilva leaves, white flowers', classical: true, source: 'Śiva Purāṇa Vratakhaṇḍa' },
  { idx: 2, name: 'Tuesday',   sanskrit: 'Maṅgalavāra',  lord: 'Mars',    deity: 'Hanumān (also Skanda / Durgā)', vrata: 'Maṅgalavāra vrata', colour: 'red',          offering: 'red flowers, jaggery, sindūr (to Hanumān)', classical: true, popular: true, source: 'Popular Purāṇic practice; Hanumān pairing is later/devotional' },
  { idx: 3, name: 'Wednesday', sanskrit: 'Budhavāra',    lord: 'Mercury', deity: 'Viṣṇu / Kṛṣṇa (also Budha)', vrata: 'Budhavāra vrata', colour: 'green',        offering: 'green gram (mūṅg), green cloth', classical: true, source: 'Purāṇic vāra-vrata calendar' },
  { idx: 4, name: 'Thursday',  sanskrit: 'Guruvāra',     lord: 'Jupiter', deity: 'Viṣṇu / Bṛhaspati (Dattātreya; Sāī)', vrata: 'Guruvāra / Bṛhaspativāra vrata', colour: 'yellow', offering: 'chana dāl, banana, turmeric, yellow sweets', classical: true, source: 'Purāṇic vāra-vrata calendar' },
  { idx: 5, name: 'Friday',    sanskrit: 'Śukravāra',    lord: 'Venus',   deity: 'Lakṣmī / the Devī (also Santoṣī Mā)', vrata: 'Śukravāra / Vaibhava-Lakṣmī vrata', colour: 'white', offering: 'milk, rice, coconut, white sweets', classical: true, popular: true, source: 'Lakṣmī classical; Santoṣī Mā is a modern (20th-c.) cult — flagged' },
  { idx: 6, name: 'Saturday',  sanskrit: 'Śanivāra',     lord: 'Saturn',  deity: 'Śani (also Hanumān)', vrata: 'Śanivāra vrata', colour: 'black/dark blue', offering: 'sesame (til), sesame oil, black gram (urad), black cloth', classical: true, source: 'Purāṇic vāra-vrata calendar; Śani Mahātmya' },
];
export const VARA_SOURCE = 'Purāṇic / dharmaśāstra vāra-vrata calendar (Śiva Purāṇa Vratakhaṇḍa etc.). Tuesday→Hanumān and Friday→Santoṣī Mā are later/popular devotional pairings — flagged popular:true.';

// ---------------------------------------------------------------------------
// 3. NAKṢATRA DEVATĀS + significance  (CLASSICAL — Taittirīya/BPHS tradition)
// ---------------------------------------------------------------------------
//  Keyed by num to merge with vedic-data.js NAKSHATRAS. The significance lines
//  are the net-new content. Source: TS 4.4.10 as carried in BPHS / pañcāṅga.
export const NAKSHATRA_INFO = [
  { num: 1,  name: 'Aśvinī',            lord: 'Ketu',    deity: 'Aśvins (Aśvinī Kumāras)', significance: 'Swift healing, fresh starts, the divine physicians; speed & vitality.' },
  { num: 2,  name: 'Bharaṇī',          lord: 'Venus',   deity: 'Yama',                    significance: 'Bearing/gestation, restraint, the threshold of death & transformation.' },
  { num: 3,  name: 'Kṛttikā',          lord: 'Sun',     deity: 'Agni',                    significance: 'The cutting flame; purification, sharpness, nourishing fire (Kārttikeya).' },
  { num: 4,  name: 'Rohiṇī',           lord: 'Moon',    deity: 'Brahmā (Prajāpati)',      significance: 'Growth, fertility, beauty, abundance; the Moon’s favourite.' },
  { num: 5,  name: 'Mṛgaśīrṣa',        lord: 'Mars',    deity: 'Soma (Candra)',           significance: 'The searching deer’s-head; questing, curiosity, gentle seeking.' },
  { num: 6,  name: 'Ārdrā',            lord: 'Rahu',    deity: 'Rudra',                   significance: 'The storm/teardrop; destruction-for-renewal, intensity, breakthrough.' },
  { num: 7,  name: 'Punarvasu',        lord: 'Jupiter', deity: 'Aditi',                   significance: 'Return of the light/goods; renewal, safety, boundless nurturing.' },
  { num: 8,  name: 'Puṣya',            lord: 'Saturn',  deity: 'Bṛhaspati',               significance: 'Nourishment, the most auspicious nakṣatra; spiritual sustenance.' },
  { num: 9,  name: 'Āśleṣā',           lord: 'Mercury', deity: 'Nāgas (serpents)',        significance: 'The coiling embrace; kuṇḍalinī, cunning, hypnotic, binding.' },
  { num: 10, name: 'Maghā',            lord: 'Ketu',    deity: 'Pitṛs (ancestors)',       significance: 'Throne & lineage; ancestral power, status, honouring forebears.' },
  { num: 11, name: 'Pūrva Phalgunī',   lord: 'Venus',   deity: 'Bhaga',                   significance: 'Enjoyment, union, fortune, rest & pleasure; the marriage-bed.' },
  { num: 12, name: 'Uttara Phalgunī',  lord: 'Sun',     deity: 'Aryaman',                 significance: 'Patronage, contracts, friendship, generous union; lasting bonds.' },
  { num: 13, name: 'Hasta',            lord: 'Moon',    deity: 'Savitṛ (Sūrya)',          significance: 'The skilled hand; craft, dexterity, grasping what is sought.' },
  { num: 14, name: 'Citrā',            lord: 'Mars',    deity: 'Tvaṣṭṛ (Viśvakarman)',    significance: 'The bright jewel; design, brilliance, artful form-making.' },
  { num: 15, name: 'Svātī',            lord: 'Rahu',    deity: 'Vāyu',                    significance: 'Independent wind; self-going movement, trade, scattering & flexibility.' },
  { num: 16, name: 'Viśākhā',          lord: 'Jupiter', deity: 'Indrāgni (Indra & Agni)', significance: 'Forked goal-focus; determined purpose, dual power, triumph.' },
  { num: 17, name: 'Anurādhā',         lord: 'Saturn',  deity: 'Mitra',                   significance: 'Friendship & devotion; cooperation, success through alliance.' },
  { num: 18, name: 'Jyeṣṭhā',          lord: 'Mercury', deity: 'Indra',                   significance: 'The eldest/chief; seniority, protection, occult power, responsibility.' },
  { num: 19, name: 'Mūla',             lord: 'Ketu',    deity: 'Nirṛti',                  significance: 'The root; getting to the bottom, dissolution, fierce inquiry.' },
  { num: 20, name: 'Pūrva Āṣāḍhā',     lord: 'Venus',   deity: 'Āpas (the waters)',       significance: 'Early invincibility; declaration, purification, building force.' },
  { num: 21, name: 'Uttara Āṣāḍhā',    lord: 'Sun',     deity: 'Viśvedevas',              significance: 'Later/unchallengeable victory; lasting achievement, integrity.' },
  { num: 22, name: 'Śravaṇa',          lord: 'Moon',    deity: 'Viṣṇu',                   significance: 'The ear; listening, learning, connection, fame through hearing.' },
  { num: 23, name: 'Dhaniṣṭhā',        lord: 'Mars',    deity: 'Vasus',                   significance: 'The drum of wealth; rhythm, music, prosperity, group power.' },
  { num: 24, name: 'Śatabhiṣā',        lord: 'Rahu',    deity: 'Varuṇa',                  significance: 'The hundred-healers/veiling circle; secrets, healing, cosmic order.' },
  { num: 25, name: 'Pūrva Bhādrapadā', lord: 'Jupiter', deity: 'Aja Ekapāda',             significance: 'The one-footed fiery serpent; passion, asceticism, transformation.' },
  { num: 26, name: 'Uttara Bhādrapadā',lord: 'Saturn',  deity: 'Ahir Budhnya',            significance: 'The deep serpent; depth, restraint, kuṇḍalinī, steady wisdom.' },
  { num: 27, name: 'Revatī',           lord: 'Mercury', deity: 'Pūṣan',                   significance: 'The safe-shepherd; nourishment, safe journeys, completion, mokṣa.' },
];
export const NAKSHATRA_INFO_SOURCE = 'Taittirīya Saṁhitā nakṣatra-devatā list (TS 4.4.10) as carried in BPHS / standard pañcāṅga. Significance lines are conventional summaries.';

// ---------------------------------------------------------------------------
// 4. GRAHA → YOGA ĀSANA  (MODERN / SYNCRETIC — classical:false, NON-NEGOTIABLE)
// ---------------------------------------------------------------------------
//  IMPORTANT HONESTY FLAG: there is NO classical Jyotiṣa text that maps grahas to
//  haṭha-yoga āsanas. This entire table is a MODERN "astro-yoga"/yoga-therapy
//  syncretism. SHOW WITH A "modern syncretic" LABEL. Do not present as Jyotiṣa.
export const GRAHA_ASANA = {
  Sun:     { primaryIAST: 'Sūrya Namaskāra',  primaryEN: 'Sun Salutation',     also: ['Bhastrikā prāṇāyāma', 'Kapālabhāti'], classical: false, source: 'Modern astro-yoga / yoga-therapy. Sūrya Namaskāra itself is early-20th-c. codified; the graha framing is modern.' },
  Moon:    { primaryIAST: 'Candra Namaskāra', primaryEN: 'Moon Salutation',    also: ['Bhujaṅgāsana (Cobra)', 'Anuloma-Viloma prāṇāyāma'], classical: false, source: 'Modern astro-yoga. Candra Namaskāra is a modern variant of Sūrya Namaskāra.' },
  Mars:    { primaryIAST: 'Vīrabhadrāsana',   primaryEN: 'Warrior Pose',       also: ['Navāsana (Boat)', 'Bhastrikā'], classical: false, source: 'Modern astro-yoga (Mars=warrior/heat correspondence).' },
  Mercury: { primaryIAST: 'Ardha Matsyendrāsana', primaryEN: 'Half Spinal Twist', also: ['Garuḍāsana (Eagle)', 'Brāmarī prāṇāyāma'], classical: false, source: 'Modern astro-yoga (Mercury=nervous system/communication).' },
  Jupiter: { primaryIAST: 'Padmāsana',        primaryEN: 'Lotus Pose',         also: ['Vṛkṣāsana (Tree)', 'Sukhāsana for meditation'], classical: false, source: 'Modern astro-yoga (Jupiter=expansion/wisdom/meditation).' },
  Venus:   { primaryIAST: 'Baddha Koṇāsana',  primaryEN: 'Bound-Angle (Butterfly)', also: ['Naṭarājāsana (Dancer)', 'Uṣṭrāsana (Camel)'], classical: false, source: 'Modern astro-yoga (Venus=beauty/grace/hips).' },
  Saturn:  { primaryIAST: 'Paścimottānāsana', primaryEN: 'Seated Forward Bend', also: ['Halāsana (Plough)', 'Bhrāmarī prāṇāyāma'], classical: false, source: 'Modern astro-yoga (Saturn=discipline/restriction/structure).' },
  Rahu:    { primaryIAST: 'Śīrṣāsana',        primaryEN: 'Headstand',          also: ['Kapālabhāti', 'meditation on the breath'], classical: false, source: 'Modern astro-yoga (Rahu=head/obsession) — least standardised; varies by author.' },
  Ketu:    { primaryIAST: 'Śavāsana',         primaryEN: 'Corpse Pose',        also: ['Yoga Nidrā', 'silent meditation'], classical: false, source: 'Modern astro-yoga (Ketu=detachment/mokṣa) — least standardised; varies by author.' },
};
// Per-weekday practice (derives from the weekday lord → GRAHA_ASANA[lord]). ALL modern.
export const VARA_ASANA = [
  { idx: 0, day: 'Sunday',    lord: 'Sun',     asana: 'Sūrya Namaskāra (Sun Salutation)' },
  { idx: 1, day: 'Monday',    lord: 'Moon',    asana: 'Candra Namaskāra (Moon Salutation)' },
  { idx: 2, day: 'Tuesday',   lord: 'Mars',    asana: 'Vīrabhadrāsana (Warrior)' },
  { idx: 3, day: 'Wednesday', lord: 'Mercury', asana: 'Ardha Matsyendrāsana (Spinal Twist)' },
  { idx: 4, day: 'Thursday',  lord: 'Jupiter', asana: 'Padmāsana (Lotus, for meditation)' },
  { idx: 5, day: 'Friday',    lord: 'Venus',   asana: 'Baddha Koṇāsana (Bound-Angle)' },
  { idx: 6, day: 'Saturday',  lord: 'Saturn',  asana: 'Paścimottānāsana (Forward Bend)' },
];
export const GRAHA_ASANA_SOURCE = 'MODERN / SYNCRETIC astro-yoga & yoga-therapy correspondence (no classical Jyotiṣa basis). classical:false on every record. There is NO traditional graha→āsana or nakṣatra→āsana / daśā-lord→āsana mapping; per-Moon-nakṣatra or per-daśā-lord practice is derived from that lord via GRAHA_ASANA and LABELLED MODERN.';

// ---------------------------------------------------------------------------
// 5. GRAHA → YANTRA / METAL / GEM  (CLASSICAL gem/metal; yantra = magic-square)
// ---------------------------------------------------------------------------
//  yantraConstant — the planetary magic-square sum: Sun 15, +3 per graha
//  (15,18,21,24,27,30,33,36,39). gem/gemAlt/metal = classical ratna convention.
export const GRAHA_YANTRA = {
  Sun:     { yantraName: 'Sūrya yantra',   yantraConstant: 15, yantraNote: '3×3 magic square; every row, column & diagonal sums to 15.', gem: 'ruby (māṇikya)',      gemAlt: 'red garnet / red spinel', metal: 'copper / gold', tantricNote: 'Worn/installed for solar vitality; energised on a Sunday at sunrise in the tradition.', classical: true, source: 'BPHS gem indications; graha-yantra (magic-square) tradition' },
  Moon:    { yantraName: 'Candra yantra',  yantraConstant: 18, yantraNote: 'Planetary magic square with constant 18.', gem: 'pearl (muktā)',        gemAlt: 'moonstone',               metal: 'silver',        tantricNote: 'Associated with emotional/mental calm; energised on a Monday in the tradition.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Mars:    { yantraName: 'Maṅgala yantra', yantraConstant: 21, yantraNote: 'Planetary magic square with constant 21.', gem: 'red coral (pravāḷa/mūṅgā)', gemAlt: 'carnelian',          metal: 'copper / gold', tantricNote: 'Associated with courage/energy; Tuesday energisation in the tradition.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Mercury: { yantraName: 'Budha yantra',   yantraConstant: 24, yantraNote: 'Planetary magic square with constant 24.', gem: 'emerald (marakata/pannā)', gemAlt: 'green tourmaline / peridot', metal: 'gold / bronze', tantricNote: 'Associated with intellect/speech; Wednesday energisation.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Jupiter: { yantraName: 'Guru yantra',    yantraConstant: 27, yantraNote: 'Planetary magic square with constant 27.', gem: 'yellow sapphire (puṣparāga/pukhrāj)', gemAlt: 'yellow topaz / citrine', metal: 'gold',          tantricNote: 'Associated with wisdom/fortune; Thursday energisation.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Venus:   { yantraName: 'Śukra yantra',   yantraConstant: 30, yantraNote: 'Planetary magic square with constant 30.', gem: 'diamond (vajra/hīraka)', gemAlt: 'white sapphire / white zircon', metal: 'silver / platinum', tantricNote: 'Associated with love/luxury/art; Friday energisation.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Saturn:  { yantraName: 'Śani yantra',    yantraConstant: 33, yantraNote: 'Planetary magic square with constant 33.', gem: 'blue sapphire (nīlam)', gemAlt: 'amethyst / blue spinel', metal: 'iron / steel / pañcaloha', tantricNote: 'Associated with discipline/longevity; Saturday energisation; the most "cautioned" gem in the tradition.', classical: true, source: 'BPHS gem indications; graha-yantra tradition' },
  Rahu:    { yantraName: 'Rāhu yantra',    yantraConstant: 36, yantraNote: 'Planetary magic square with constant 36.', gem: 'hessonite garnet (gomeda)', gemAlt: 'orange zircon', metal: 'lead / mixed-metal (aṣṭadhātu)', tantricNote: 'Associated with the shadowy/foreign; tantric node-propitiation.', classical: true, source: 'jyotiṣa ratna tradition (nodes); graha-yantra tradition' },
  Ketu:    { yantraName: 'Ketu yantra',    yantraConstant: 39, yantraNote: 'Planetary magic square with constant 39.', gem: 'cat’s-eye (vaiḍūrya/lehsunia)', gemAlt: 'chrysoberyl', metal: 'mixed-metal (aṣṭadhātu)', tantricNote: 'Associated with detachment/mokṣa; tantric node-propitiation.', classical: true, source: 'jyotiṣa ratna tradition (nodes); graha-yantra tradition' },
};
export const GRAHA_YANTRA_SOURCE = 'BPHS gem/metal indications + the graha-yantra (planetary magic-square) tradition: constants 15,18,21,24,27,30,33,36,39 (Sun 15, +3 per graha). Gem/metal = well-attested classical ratna convention; tantric notes recorded as cultural practice, not prescribed.';

// ---------------------------------------------------------------------------
//  CONSOLIDATED SOURCES + FRAMING
// ---------------------------------------------------------------------------
export const REMEDIES_SOURCES = [
  'Bṛhat Parāśara Horā Śāstra (BPHS), R. Santhanam translation — remedial chapters, graha devatās, gem & metal indications.',
  'Mantra Mahodadhi of Mahīdhara — the navagraha bīja-mantra family (Oṁ Hrāṁ Hrīṁ Hrauṁ Saḥ Sūryāya Namaḥ etc.).',
  'Navagraha Stotra (attr. Vyāsa) — nāma mantras, dhyāna ślokas, the graha "main deity".',
  'The graha-yantra / planetary magic-square tradition — constants 15…39 (step 3).',
  'Purāṇic & dharmaśāstra vāra-vrata calendar (Śiva Purāṇa Vratakhaṇḍa etc.) — weekday deity/fast/colour/offering.',
  'Taittirīya Saṁhitā 4.4.10 — the nakṣatra-devatā list (as carried in BPHS / pañcāṅga).',
  'Modern "astro-yoga" / yoga-therapy literature — graha→āsana correspondences (flagged classical:false; NO classical Jyotiṣa basis).',
];
export const REMEDIES_FRAMING = 'Pseudoscience, described not prescribed. All mantras, vratas, āsanas, yantras and gemstone "remedies" are recorded as historical/cultural/devotional practice for study only — not instruction, recommendation, or medical/spiritual advice, and not endorsed as efficacious. classical:false marks modern syncretic items (the entire graha→āsana map). Several deity assignments differ by lineage and are flagged in-data.';
