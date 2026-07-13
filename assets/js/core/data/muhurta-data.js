// ============================================================================
//  muhurta-data.js — the cited data for the MUHŪRTA (Indian electional) tool:
//    • the 30 muhūrtas of the sunrise-to-sunrise day (15 day + 15 night),
//      names Rudra → Samudra with per-slot classical quality;
//    • the weekday octant tables for Rāhu-kāla / Yamaghaṇṭa / Gulika-kāla;
//    • the pañcāṅga quality screens (tithi / yoga / karaṇa / nakṣatra).
//
//  PROVENANCE DISCIPLINE (project policy): every record carries a `.cite`;
//  genuinely contested values carry a `contested` flag with BOTH positions and
//  are never silently resolved. All claims below were adversarially verified
//  against at least two independent sources plus recomputation (2026-07-13),
//  including a same-day live pañcāṅga check (Ujjain, Monday 2026-07-13).
//
//  ATTRIBUTION CORRECTION (verified): the Rudra→Samudra 30-name list is NOT
//  the Taittirīya-Brāhmaṇa list — TB III.10.1's actual 15 day-muhūrta names
//  (saṁjñānam … bhūtam) are an entirely different set, and the cited tables
//  attach no primary source. The list is stored as LATER JYOTIṢA TRADITION,
//  unattributed in the cited sources.
//
//  HONEST FRAMING: these are the classical rules, described — never
//  prescribed. No timing quality here has any demonstrated empirical validity.
// ============================================================================

// --- shared citation strings -------------------------------------------------
export const MUHURTA_NAMES_SOURCE =
  'Wikipedia, "Muhurta" — 30-muhūrta table (later jyotiṣa tradition; unattributed in the source: it is NOT the ' +
  'Taittirīya-Brāhmaṇa III.10.1 list, whose fifteen day-names saṁjñānam…bhūtam are entirely different), ' +
  'cross-checked name-by-name against veda.harekrsna.cz/encyclopedia/astrotables.htm; verified 2026-07-13.';

const N_CITE = MUHURTA_NAMES_SOURCE;

const TITHI_CITE =
  'myzodiaq.in, "The muhūrat formula — the Nandā/Bhadrā/Jayā/Riktā/Pūrṇā cycle" (fetched & verified); ' +
  'vedictime.com tithi categories (CITATION-HEALTH FLAG: returned HTTP 403 / bot-blocked at verification — ' +
  'kept only alongside the accessible source). Standard pañcāṅga classification; the fetched pages do not ' +
  'themselves cite Muhūrta Cintāmaṇi by name.';

const YOGA_CITE =
  'drikpanchang.com, "Prohibited marriage yogas" (exactly these nine of the 27 nitya-yogas); ghaṭī grading per ' +
  'julenelouis.com nitya-yoga table and the B. V. Raman Muhurtha rule ("first 3 ghatis of Vishkambha and Vajra; ' +
  'first half of Parigha; first 5 ghatis of Shula; first 6 ghatis of Ganda and Atiganda; first 9 ghatis of ' +
  'Vyaghata"). One ghaṭī = 24 minutes.';

const KARANA_CITE =
  'astrosight.ai, "Panchang elements" — 7 movable karaṇas (Bava…Viṣṭi) repeating 8× per lunar month + 4 fixed ' +
  '(Śakuni, Catuṣpāda, Nāga, Kiṁstughna) at the month’s junction; "Vishti (Bhadra): most avoided karana". ' +
  'Slot enumeration recomputed at verification (muhurta-check.mjs).';

const NAKSHATRA_CITE =
  'drikpanchang.com, "Nakshatra seven-fold classification" (membership lists + activity assignments; the page ' +
  'does NOT itself cite Muhūrta Cintāmaṇi); weekday-of-strength row per psychologicallyastrology.com ALONE, ' +
  'which quotes Muhūrta Cintāmaṇi for it.';

const KALA_RAHU_CITE =
  'veda.harekrsna.cz astrotables + shubhpanchang.com (two independent, identical weekday tables); live-verified ' +
  'Ujjain Mon 2026-07-13: Rāhu-kāla 07:32–09:12 = exactly the 2nd 100-minute octant of the 05:52–19:12 day ' +
  '(astroica.com, fetched same-day).';

const KALA_YAMA_CITE =
  'shubhpanchang.com + astroica.com (live Ujjain Mon 2026-07-13: 10:52–12:32 = 4th octant). SOURCE-TYPO FLAG: ' +
  'veda.harekrsna.cz prints Saturday Yamaghaṇṭa 14:30–16:00, which lies on NO octant boundary of a 06:00–18:00 ' +
  'day; shubhpanchang gives 13:30–15:00 (the 6th octant). That 14:30 is a typo is the natural INFERENCE, not a ' +
  'sourced statement — flagged, not silently resolved.';

const KALA_GULIKA_CITE =
  'veda.harekrsna.cz + shubhpanchang.com (identical descending 7…1 tables); live Ujjain Mon 2026-07-13: ' +
  '14:12–15:52 = 6th octant (astroica.com, same-day). Derivation: the day-arc is cut into 8 parts, the first ' +
  'SEVEN lorded from the weekday’s ruler onward in weekday order (the 8th part lordless); Gulika-kāla = ' +
  'Saturn’s part (astroshastra.com "Gulika and Mandi"; indastro.com) — the rule reproduces the table for ' +
  'all seven weekdays.';

// ---------------------------------------------------------------------------
//  THE 30 MUHŪRTAS — one sunrise-to-sunrise day. Nos. 1–15 divide the day arc
//  (sunrise→sunset) into fifteen equal parts; nos. 16–30 divide the night arc
//  (sunset→next sunrise) likewise. The night names are simply positions 16–30
//  of the same 30-name cycle — not a separately named list.
//  quality: 'auspicious' | 'inauspicious' | 'mixed' (classical grading only).
//  contested: { flag, positions:[{source, value}] } — both positions kept.
// ---------------------------------------------------------------------------
export const MUHURTA_NAMES = [
  { num: 1,  name: 'Rudra',        quality: 'inauspicious', cite: N_CITE },
  { num: 2,  name: 'Āhi',          quality: 'inauspicious', cite: N_CITE },
  { num: 3,  name: 'Mitra',        quality: 'auspicious',   cite: N_CITE },
  { num: 4,  name: 'Pitṝ',         quality: 'inauspicious', cite: N_CITE },
  { num: 5,  name: 'Vasu',         quality: 'auspicious',   cite: N_CITE },
  { num: 6,  name: 'Vārāha',       quality: 'auspicious',
    variants: 'VEDA table: "Vara"; some published lists give Ambu/Āpaḥ for this slot (ganeshmitra.co.in, instaastro.com).',
    cite: N_CITE },
  { num: 7,  name: 'Viśvedevā',    quality: 'auspicious',   cite: N_CITE },
  { num: 8,  name: 'Abhijit',      quality: 'auspicious',
    variants: 'The Wikipedia/Brāhmaṇa-derived table names slot 8 "Vidhi"; in muhūrta practice it is universally the Abhijit muhūrta (drikpanchang).',
    condition: 'auspicious with a CONTESTED weekday exception — see contested.',
    contested: {
      flag: 'The weekday exception for muhūrta 8 / Abhijit is itself contested across the verified sources.',
      positions: [
        { source: 'Wikipedia 30-muhūrta table & veda.harekrsna.cz', value: 'auspicious EXCEPT Mondays and Fridays' },
        { source: 'drikpanchang.com abhijit-muhurat', value: 'Abhijit is malefic on WEDNESDAY (and unsuitable for marriage/upanayana generally)' },
      ],
    },
    cite: N_CITE + ' Abhijit designation & Wednesday rule: drikpanchang.com/muhurat/daily/abhijit-muhurat.html.' },
  { num: 9,  name: 'Sutamukhī',    quality: 'auspicious',
    variants: 'VEDA table: "Satamukhī".', cite: N_CITE },
  { num: 10, name: 'Puruhūta',     quality: 'inauspicious', cite: N_CITE },
  { num: 11, name: 'Vāhinī',       quality: 'inauspicious', cite: N_CITE },
  { num: 12, name: 'Naktanakarā',  quality: 'inauspicious',
    variants: 'Also transliterated Naktañcara.', cite: N_CITE },
  { num: 13, name: 'Varuṇa',       quality: 'auspicious',   cite: N_CITE },
  { num: 14, name: 'Aryaman',      quality: 'auspicious',
    condition: 'except Sundays (Wikipedia 30-muhūrta table).', cite: N_CITE },
  { num: 15, name: 'Bhaga',        quality: 'inauspicious', cite: N_CITE },
  // --- night: positions 16–30 of the same cycle -----------------------------
  { num: 16, name: 'Girīśa',       quality: 'inauspicious',
    contested: {
      flag: 'QUALITY CONTESTED between the two verified sources — encoded per VEDA, the dissent kept in full.',
      positions: [
        { source: 'veda.harekrsna.cz astrotables', value: 'inauspicious (BAD)' },
        { source: 'Wikipedia 30-muhūrta table', value: 'auspicious' },
      ],
    },
    cite: N_CITE },
  { num: 17, name: 'Ajapāda',      quality: 'inauspicious', cite: N_CITE },
  { num: 18, name: 'Ahir-Budhnya', quality: 'auspicious',   cite: N_CITE },
  { num: 19, name: 'Puṣya',        quality: 'auspicious',
    variants: 'Also given as Pūṣā.', cite: N_CITE },
  { num: 20, name: 'Aśvinī',       quality: 'auspicious',   cite: N_CITE },
  { num: 21, name: 'Yama',         quality: 'inauspicious', cite: N_CITE },
  { num: 22, name: 'Agni',         quality: 'inauspicious',
    contested: {
      flag: 'QUALITY CONTESTED between the two verified sources — encoded per VEDA, the dissent kept in full.',
      positions: [
        { source: 'veda.harekrsna.cz astrotables', value: 'inauspicious (BAD)' },
        { source: 'Wikipedia 30-muhūrta table', value: 'auspicious' },
      ],
    },
    cite: N_CITE },
  { num: 23, name: 'Vidhātṛ',      quality: 'auspicious',   cite: N_CITE },
  { num: 24, name: 'Kaṇḍa',        quality: 'auspicious',
    variants: 'Also given as Caṇḍa.', cite: N_CITE },
  { num: 25, name: 'Aditi',        quality: 'auspicious',   cite: N_CITE },
  { num: 26, name: 'Jīva',         quality: 'auspicious',
    variants: 'Also named Amṛta; Wikipedia grades this slot "Very Auspicious" where VEDA has plain GOOD — a minor grade variance, flagged.',
    cite: N_CITE },
  { num: 27, name: 'Viṣṇu',        quality: 'auspicious',   cite: N_CITE },
  { num: 28, name: 'Dyumadgadyuti', quality: 'auspicious',
    variants: 'VEDA prints "Yumigadyuti" — read here as a corruption of Dyumadgadyuti (same slot, initial Dyu→Yu mangling). That it is a corruption is a well-grounded INFERENCE; no source states it explicitly.',
    cite: N_CITE },
  { num: 29, name: 'Brahma',       quality: 'auspicious',
    variants: 'Graded "Very Auspicious" (Wikipedia) / VERY GOOD (VEDA) — the Brāhma muhūrta of daily practice.',
    cite: N_CITE },
  { num: 30, name: 'Samudra',      quality: 'auspicious',   cite: N_CITE },
];

// ---------------------------------------------------------------------------
//  ABHIJIT & BRĀHMA — the two named windows the tradition singles out.
// ---------------------------------------------------------------------------
export const ABHIJIT = {
  dayMuhurta: 8,
  rule: 'The 8th of the 15 day-muhūrtas: sunrise + 7·(D/15) → sunrise + 8·(D/15), D = day length. Its midpoint '
    + 'is ALWAYS the mid-day point sunrise + D/2 (local apparent noon) — an algebraic identity — i.e. noon ± 24 '
    + 'minutes on a mean 06:00–18:00 day.',
  tradition: 'Said to destroy doṣas (associated with Viṣṇu’s Sudarśana) — the famous default-auspicious window.',
  contested: MUHURTA_NAMES[7].contested,   // the weekday-exception dispute (Mon/Fri vs Wednesday)
  cite: 'drikpanchang.com/muhurat/daily/abhijit-muhurat.html (middle 8th of 15 sunrise→sunset parts, noon ± 24 min, '
    + 'not suitable on Wednesday); Wikipedia "Muhurta" row 8 (11:36–12:24 on the mean day); midpoint identity '
    + 'recomputed at verification.',
};

export const BRAHMA = {
  overallMuhurta: 29,
  rule: 'The 29th of the 30 muhūrtas (2nd-to-last of the night): it runs from sunrise − 2·(N/15) to '
    + 'sunrise − N/15, N = night length — 04:24–05:12 on the mean day (1h36m to 48m before sunrise).',
  cite: 'Wikipedia "Muhurta" (Brahma = muhūrta No. 29, 04:24–05:12, beginning 96 min = 2 muhūrtas before sunrise); '
    + 'corroborated by veda.harekrsna.cz astrotables row 29 ("BRAHMA — VERY GOOD").',
};

// ---------------------------------------------------------------------------
//  THE THREE KĀLAS — weekday octant tables. Each kāla = one EIGHTH of the
//  sunrise→sunset arc; octants counted 1–8 from sunrise. Array index =
//  weekday Sunday..Saturday (Date#getUTCDay order, 0..6) of the
//  SUNRISE-BOUNDED day (the vāra), not the civil-UTC weekday.
//  These are the DAY tables — the standard practical scope. Nocturnal
//  variants (night arc ÷ 8, different indices) exist in the sources and are
//  deliberately NOT encoded here.
// ---------------------------------------------------------------------------
export const OCTANT_TABLES = {
  note: 'DAY tables only (kāla = day-arc/8, octants 1–8 from sunrise; index = sunrise-bounded weekday Sun..Sat). '
    + 'Nocturnal Rāhu/Gulika variants exist (calcatools.com day-vs-night Gulika; prokerala.com) but are out of '
    + 'scope by design.',
  rahu:   [8, 2, 7, 5, 6, 4, 3],   // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  yama:   [5, 4, 3, 2, 1, 7, 6],
  gulika: [7, 6, 5, 4, 3, 2, 1],
  cites: {
    rahu: KALA_RAHU_CITE,
    yama: KALA_YAMA_CITE,
    gulika: KALA_GULIKA_CITE,
  },
  cite: 'Composite of the three per-kāla citations (see .cites); every index verified against two independent '
    + 'published tables plus the live Ujjain 2026-07-13 pañcāṅga and full recomputation.',
};

// ---------------------------------------------------------------------------
//  TITHI SCREEN — the fivefold Nandā/Bhadrā/Jayā/Riktā/Pūrṇā cycle within each
//  paksha. groups[(n−1) % 5] where n = tithi within the paksha (1..15).
//  Riktā (4/9/14; kṛṣṇa 19/24/29) is the classical avoid class.
// ---------------------------------------------------------------------------
export const TITHI_SCREEN = {
  note: 'The fivefold cycle repeats in kṛṣṇa paksha; amāvāsyā (tithi 30) is additionally avoided for auspicious '
    + 'elections generally (kept for ancestral rites), overriding its Pūrṇā group.',
  groups: [ // index = (tithi-within-paksha − 1) % 5
    { name: 'Nandā', meaning: 'joy', shukla: [1, 6, 11], krishna: [16, 21, 26], verdict: 'favourable',
      detail: 'joyful class — held fit for festivities and pleasant beginnings', cite: TITHI_CITE },
    { name: 'Bhadrā', meaning: 'auspicious / welfare', shukla: [2, 7, 12], krishna: [17, 22, 27], verdict: 'favourable',
      detail: 'welfare class — held fit for works of health and prosperity', cite: TITHI_CITE },
    { name: 'Jayā', meaning: 'victory', shukla: [3, 8, 13], krishna: [18, 23, 28], verdict: 'favourable',
      detail: 'victory class — held fit for contests and undertakings needing success', cite: TITHI_CITE },
    { name: 'Riktā', meaning: 'empty', shukla: [4, 9, 14], krishna: [19, 24, 29], verdict: 'avoid',
      detail: 'the classical AVOID class for auspicious/material beginnings; held suitable instead for '
        + 'destructive or clearing acts (fasting, debt-clearance)', cite: TITHI_CITE },
    { name: 'Pūrṇā', meaning: 'full / complete', shukla: [5, 10, 15], krishna: [20, 25, 30], verdict: 'favourable',
      detail: 'completion class — held fit for finishing works (but see the amāvāsyā override for tithi 30)',
      cite: TITHI_CITE },
  ],
  amavasya: { num: 30, verdict: 'avoid',
    detail: 'amāvāsyā (the new-moon tithi) is generally avoided for auspicious elections; traditionally kept for '
      + 'ancestral rites', cite: TITHI_CITE },
  cite: TITHI_CITE,
};

// ---------------------------------------------------------------------------
//  YOGA SCREEN — the NINE avoided nitya-yogas (verified: nine, not six).
//  Severity tiers: Vyatīpāta (17) & Vaidhṛti (27) — the two mahā-doṣa yogas —
//  are avoided WHOLE-duration; for the other seven, a sourced VARIANT holds
//  that many authorities avoid only the opening ghaṭīs listed (1 ghaṭī=24 min).
// ---------------------------------------------------------------------------
export const YOGA_SCREEN = {
  note: 'Nine avoided nitya-yogas of the 27. VARIANT (flagged, sourced): the classical Raman-style rule avoids '
    + 'only the OPENING ghaṭīs of the seven lesser yogas, while Vyatīpāta and Vaidhṛti are avoided for their '
    + 'whole duration. The engine reports the rule descriptively — the pañcāṅga here is an instantaneous '
    + 'snapshot with no yoga end-times, so the opening-ghaṭī window is stated, not computed.',
  avoid: [
    { num: 1,  name: 'Viṣkambha', scope: 'opening', ghatis: 3,  cite: YOGA_CITE },
    { num: 6,  name: 'Atigaṇḍa',  scope: 'opening', ghatis: 6,  cite: YOGA_CITE },
    { num: 9,  name: 'Śūla',      scope: 'opening', ghatis: 5,  cite: YOGA_CITE },
    { num: 10, name: 'Gaṇḍa',     scope: 'opening', ghatis: 6,  cite: YOGA_CITE },
    { num: 13, name: 'Vyāghāta',  scope: 'opening', ghatis: 9,  cite: YOGA_CITE },
    { num: 15, name: 'Vajra',     scope: 'opening', ghatis: 3,
      cite: YOGA_CITE + ' VERIFIER CORRECTION: Vajra takes the first 3 ghaṭīs (grouped with Viṣkambha), NOT 9 — '
        + 'both julenelouis.com and the Raman rule give 3; no source found giving 9. Only Vyāghāta takes 9.' },
    { num: 17, name: 'Vyatīpāta', scope: 'whole',
      cite: YOGA_CITE + ' Vyatīpāta: whole duration ("all 60 ghatis", julenelouis) — one of the two mahā-doṣa yogas.' },
    { num: 19, name: 'Parigha',   scope: 'opening', ghatis: 30,
      detail: 'the first HALF of the yoga (30 of 60 ghaṭīs)', cite: YOGA_CITE },
    { num: 27, name: 'Vaidhṛti',  scope: 'whole',
      cite: YOGA_CITE + ' Vaidhṛti: whole duration ("all 60 ghatis", julenelouis) — one of the two mahā-doṣa yogas.' },
  ],
  cite: YOGA_CITE,
};

// ---------------------------------------------------------------------------
//  KARAṆA SCREEN — Viṣṭi (Bhadrā), the standard karaṇa avoid.
// ---------------------------------------------------------------------------
export const KARANA_SCREEN = {
  avoid: { name: 'Viṣṭi', alias: 'Bhadrā', verdict: 'avoid',
    detail: 'no auspicious beginnings during Viṣṭi (Bhadrā) — the most-avoided karaṇa', cite: KARANA_CITE },
  structure: {
    note: 'Of the 11 karaṇas, the 7 movable (Bava, Bālava, Kaulava, Taitila, Gara, Vaṇija, Viṣṭi) cycle 8× per '
      + 'lunar month through half-tithi slots 2–57; the 4 fixed sit at the month’s junction (Kiṁstughna = 1st '
      + 'half of śukla 1; Śakuni = 2nd half of kṛṣṇa 14; Catuṣpāda & Nāga = the two amāvāsyā halves). VERIFIER '
      + 'CORRECTION: Viṣṭi falls on half-tithi slots 8, 15, 22, 29, 36, 43, 50, 57 — every SEVENTH slot (the '
      + 'movable cycle is 7 long), first at the 2nd half of śukla 4; NOT "every 8th slot". It does recur 8 times '
      + 'per month.',
    vishtiSlots: [8, 15, 22, 29, 36, 43, 50, 57],
    cite: KARANA_CITE,
  },
  cite: KARANA_CITE,
};

// ---------------------------------------------------------------------------
//  NAKṢATRA SEVENFOLD CLASSIFICATION — Muhūrta Cintāmaṇi tradition.
//  Members are keyed by the standard 1..27 nakṣatra number (Aśvinī = 1),
//  matching nakshatraOf() in data/vedic-data.js.
// ---------------------------------------------------------------------------
export const NAKSHATRA_CLASSES = [
  { key: 'dhruva', name: 'Dhruva (Sthira)', meaning: 'fixed', verdict: 'favourable', weekday: 'Sunday',
    uses: 'permanent works — foundation-laying, coronation, planting trees, digging wells',
    members: [{ num: 4, name: 'Rohiṇī' }, { num: 12, name: 'Uttara-Phalgunī' }, { num: 21, name: 'Uttarāṣāḍhā' },
      { num: 26, name: 'Uttara-Bhādrapadā' }],
    cite: NAKSHATRA_CITE },
  { key: 'cara', name: 'Cara', meaning: 'movable', verdict: 'favourable', weekday: 'Monday',
    uses: 'travel, journeys, vehicles',
    members: [{ num: 7, name: 'Punarvasu' }, { num: 15, name: 'Svātī' }, { num: 22, name: 'Śravaṇa' },
      { num: 23, name: 'Dhaniṣṭhā' }, { num: 24, name: 'Śatabhiṣā' }],
    cite: NAKSHATRA_CITE },
  { key: 'ugra', name: 'Ugra', meaning: 'fierce', verdict: 'avoid', weekday: 'Tuesday',
    uses: 'AVOIDED for auspicious works; held fit for harsh acts',
    members: [{ num: 2, name: 'Bharaṇī' }, { num: 10, name: 'Maghā' }, { num: 11, name: 'Pūrva-Phalgunī' },
      { num: 20, name: 'Pūrvāṣāḍhā' }, { num: 25, name: 'Pūrva-Bhādrapadā' }],
    cite: NAKSHATRA_CITE },
  { key: 'mishra', name: 'Miśra', meaning: 'mixed', verdict: 'mixed', weekday: 'Wednesday',
    uses: 'mixed / ordinary works',
    members: [{ num: 3, name: 'Kṛttikā' }, { num: 16, name: 'Viśākhā' }],
    cite: NAKSHATRA_CITE },
  { key: 'kshipra', name: 'Kṣipra (Laghu)', meaning: 'swift', verdict: 'favourable', weekday: 'Thursday',
    uses: 'trade, opening shops, learning, travel',
    members: [{ num: 1, name: 'Aśvinī' }, { num: 8, name: 'Puṣya' }, { num: 13, name: 'Hasta' }],
    note: 'The sources also place the intercalary Abhijit (the "28th nakṣatra") in this class; it lies outside '
      + 'the 27-fold cycle this engine computes, so it can never match here — noted, not encoded.',
    cite: NAKSHATRA_CITE },
  { key: 'mridu', name: 'Mṛdu', meaning: 'soft', verdict: 'favourable', weekday: 'Friday',
    uses: 'marriage, music, fine arts, new clothes, friendship',
    members: [{ num: 5, name: 'Mṛgaśirā' }, { num: 14, name: 'Citrā' }, { num: 17, name: 'Anurādhā' },
      { num: 27, name: 'Revatī' }],
    cite: NAKSHATRA_CITE },
  { key: 'tikshna', name: 'Tīkṣṇa', meaning: 'sharp', verdict: 'avoid', weekday: 'Saturday',
    uses: 'AVOIDED for auspicious works; held fit for sharp/harsh acts',
    members: [{ num: 6, name: 'Ārdrā' }, { num: 9, name: 'Āśleṣā' }, { num: 18, name: 'Jyeṣṭhā' },
      { num: 19, name: 'Mūla' }],
    cite: NAKSHATRA_CITE },
];

// ---------------------------------------------------------------------------
//  Classical-source provenance (for the About page & report citations).
// ---------------------------------------------------------------------------
export const MUHURTA_CLASSICAL_SOURCE =
  'Muhūrta Cintāmaṇi of Rāma Daivajña (Kāśī, Śaka 1522 / VS 1657 = 1600 CE) — the standard classical muhūrta '
  + 'text, organized in prakaraṇas on the śuddhi (purity screens) of tithi/nakṣatra/yoga/karaṇa/vāra; Sanskrit '
  + 'with Pt. Kapileshvar Shastri’s commentary (Haridas Sanskrit Series, archive.org) and G. C. Sharma’s '
  + 'English translation (Sagar Publications). The screens above are encoded from verified modern pañcāṅga '
  + 'summaries of that tradition (each record cites its own fetched sources); verse-level MC citations should '
  + 'replace them if the Archive.org scan is collated.';
