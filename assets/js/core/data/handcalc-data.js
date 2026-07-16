// ============================================================================
//  handcalc-data.js — the cited reference kit for the "Cast a chart by hand"
//  teaching tool. PURE DATA; every record carries its source. The honest
//  framing is locked: these are the reference books and the documented historical
//  pitfalls of manual chart calculation, reproduced for study. Contested or
//  unverified points are flagged in-record, never presented as settled fact.
//
//  Sources consulted (see each record's `source`/`cite`):
//   • The Astrology Podcast ep. 396 "Calculating Astrology Charts by Hand"
//     (Urban + Watson, 5 Apr 2023) — episode page + full transcript.
//   • Patrick Watson, "Should Astrologers Know How to Calculate Natal Charts by
//     Hand?" (advocacy essay; the worked arithmetic is quoted from ep. 396).
//   • Catherine Urban, "Chart Calculations for the Apocalypse" (8-h workshop).
//   • Lauran Fowks & Lynn Sellon, Simply Math (Twelfth House Press, 2005).
//   • The American Ephemeris 1950–2050 at Midnight (Michelsen & Pottenger).
//   • The American Atlas (Thomas G. Shanks).
//   • The Michelsen Book of Tables (Koch & Placidus; incl. Hand & Brackett,
//     "How to Cast a Natal Horoscope").
//   • Nicholas DeVore, Encyclopedia of Astrology — "Logarithms" (prop-log defn).
// ============================================================================

// The worked example the page prefills — the research's Vector A/B/D nativity.
export const DEFAULT_EXAMPLE = {
  label: '1990-06-15, 08:30 EDT, New York',
  date: '1990-06-15',
  time: '08:30',
  offset: -4,                 // EDT = UT−4 (the atlas step: DST in effect)
  utLabel: '12:30 UT, 1990-06-15',
  lat: 40.75, lon: -73.95,    // New York, 40°45'N 73°57'W
  latLabel: "40°45'N", lonLabel: "73°57'W",
  cite: 'Vectors A/B/D, all recomputed against this repo’s astro.js (gast/bodyPosition/houses).',
};

// STEP 1 — the American Atlas honesty step. Why a 152,000-place atlas exists,
// and the documented pitfalls that make "clock time → UT" the hard part.
export const ATLAS_PITFALLS = [
  {
    id: 'war-time',
    title: 'Nationwide "War Time" 1942–45',
    text: 'Year-round DST across the United States from 9 February 1942 to 30 September 1945; the zones were renamed "Eastern War Time", "Pacific War Time", etc. A birth in that window is on DST even in midwinter.',
    source: 'history.com "This Day in History — DST instituted" + en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States',
  },
  {
    id: 'chicago-standard',
    title: 'Chicago recorded births in Standard Time to 1959',
    text: 'An Illinois/Chicago hospital rule in force until 1959 required births to be recorded in STANDARD time even while DST was observed — "if a baby was born when the clocks read 12:00 PM, the birth was to be recorded as occurring at 11 AM." The certificate can therefore already be corrected for DST.',
    source: 'astro.com/faq/fq_hp_atlas_e.htm + cafeastrology.com/historical-time-zones.html',
  },
  {
    id: 'state-chaos',
    title: '1961–66: DST decided town by town',
    text: 'Before the Uniform Time Act (1966), DST start/end dates were set state-by-state or locally. "In 1965 there were 23 different pairs of start and end dates in Iowa alone." Reconstruction from memory is hopeless — hence the atlas.',
    source: 'astro.com/faq/fq_hp_atlas_e.htm; The American Atlas (Shanks) provenance',
  },
  {
    id: 'early-dst',
    title: '1920–1940 local DST is hard to confirm',
    text: 'Many jurisdictions observed (or dropped) DST in ways poorly documented before the atlas compiled 1883-onward records for 152,000+ US locations.',
    source: 'The American Atlas (Shanks, Expanded 5th ed.); archive.org/details/americanatlasusl0000shan (borrow-only)',
  },
];

// STEP 2 — the acceleration constant, reconciled (a contested value shown three
// ways). rate is seconds of sidereal gain per hour of clock time.
export const ACCEL_CONSTANTS = [
  {
    rate: 10, key: 'book', label: '10 s/hour (the book rule)',
    origin: 'Simply Math / AFA teaching lesson — computed as (hours×10 + minutes÷6) s.',
    verdict: 'teach', note: 'The published hand rule. Over a 12.5-h interval it costs ~+1.8 s of sidereal time vs the exact rate (≈0.45′ on the MC — harmless for sign/house placement).',
    source: 'astrologyjournal.substack.com/p/calculating-the-interval-and-acceleration (Ellen Mangan, 22 Aug 2023; cites an AFA handout)',
  },
  {
    rate: 9.8565, key: 'exact', label: '9.8565 s/hour (exact mean)',
    origin: '236.5554 s of sidereal gain per solar day ÷ 24.',
    verdict: 'exact', note: 'Reproduces this engine’s LST to ~0.0 s on the worked vector. The "exact" column of the page.',
    source: 'derived; engine daily gain measured 236.55 s on 1990-06-15→16 (verify-handcalc.mjs vs astro.js gast()).',
  },
  {
    rate: 9.8333, key: 'imprecise', label: '9.8333 s/hour (imprecise)',
    origin: 'Rounding the daily gain to 3m56s (236 s) ÷ 24.',
    verdict: 'flag', note: 'Found in some secondary sources; imprecise — flagged, not used.',
    source: 'tonylouis.wordpress.com/2019/07/29/musings-on-days-and-sidereal-time/ (prints 9.8333 & sidereal day 23h56m4.0905s)',
  },
];

// STEP 3 — the DeVore printed proportional-logarithm check (the historical
// anchor: our plog() must reproduce the book's own 5-decimal table values).
export const DEVORE_PLOG_CHECK = {
  motion: { label: "14°27' / day", minutes: 867, printedPlog: 0.22034 },
  interval: { label: '7h 35m', minutes: 455, printedPlog: 0.50035 },
  sumPrinted: 0.72069,
  resultPrinted: "4°34'",
  tableTopConstant: { label: 'plog(0h01m) = log10(1440)', value: 3.1584, note: 'the first entry of the printed tables' },
  rule: '"Add this to the Moon’s longitude on the previous noon or midnight, and you have the position for the desired moment."',
  napier: 'Attributed by DeVore to Napier (1614). The invented-for-astrology claim is historically dubious — it stays attributed to DeVore, not asserted.',
  warning: 'Distinct from the NAUTICAL proportional logarithm log10(10800/seconds) (first entry 4.0334) found in many scanned "Table of Proportional Logarithms" PDFs — a different constant, not the astrological table.',
  source: 'astrologysoftware.com/community/learn/dictionary/logarithms.html (DeVore, Encyclopedia of Astrology) + an independent scanned astrological table, archive.org table-of-proportional-logarithms-chart (first entry 3.1584).',
};

// Persistent hedges that must stay hedged in the copy.
export const CAVEATS = [
  {
    id: 'row-spacing',
    text: 'The Michelsen Book of Tables 4-minute sidereal-time row spacing is documented in the Michelsen Koch/Placidus table family (AstroAmerica sample page: blocks at 22h24m, 22h28m, 22h32m…, "for Latitudes 0° to 60° North"), but the sample is from The Michelsen Book of Houses rather than the 168-page Book of Tables itself — a light hedge remains.',
    source: 'astroamerica.com/michelsen.pdf; retailer listings (Amazon/AbeBooks/Goodreads), ISBN 9780935127607.',
  },
  {
    id: 'koch-not-implemented',
    text: 'The physical Book of Tables tabulates BOTH Placidus and Koch. This engine implements Placidus (and Regiomontanus, Whole, Equal) but NOT Koch, so this demo is Placidus-only — which also matches Urban’s workshop, taught in Placidus.',
    source: 'astro.js implements placidusCusp/regioCusp; no Koch routine. Michelsen title: "Koch and Placidus Tables of Houses".',
  },
  {
    id: 'noon-variant',
    text: 'The older British method (Margaret Hone’s Modern Text-Book lineage) uses a NOON ephemeris and an LMT interval with an extra small acceleration on the longitude equivalent. It is a genuine variant; its exact interior wording was not independently verified (borrow-only scans), so it is noted, not taught as primary.',
    source: 'archive.org/details/bwb_P8-AKQ-785 (Hone, borrow-only) — wording NOT independently verified.',
  },
  {
    id: 'moon-extremes',
    text: 'The Moon travels roughly 12–15°/day (astronomical extremes ≈ 11°46′–15°24′/day) — a general-knowledge figure, unverified to the arc-minute here.',
    source: 'general knowledge; hedge retained.',
  },
];

// STEP 5 — the verification-culture quotes (why Urban & Watson teach this).
export const VERIFICATION_CULTURE = [
  {
    who: 'Patrick Watson (ep. 396)',
    quote: 'Natal chart calculations are tedious and the steps must be followed exactly… the math itself is not actually that hard, there’s just a lot of it.',
    gloss: 'He learned hand calculation from Urban’s course for the NCGR-PAA Level I exam, and describes an "embodied connection with the chart" (echoing Demetra George).',
    source: 'theastrologypodcast.com/transcripts/tap-ep-396-transcript-calculating-astrology-charts-by-hand/',
  },
  {
    who: 'Watson’s longitude arithmetic (ep. 396)',
    quote: 'You multiply the degrees of longitude by 3,600. You multiply the minutes of longitude by 60. You add those together to get the number of seconds, and then you divide those by 15.',
    gloss: 'The longitude/15 term, done in seconds — exactly the arithmetic this tool checks against the engine.',
    source: 'ep. 396 transcript (verbatim).',
  },
  {
    who: 'The diagnostic (ep. 396)',
    quote: 'When two online calculators disagree, usually the reason is a time-zone issue where one is calculating Daylight Saving Time and the other is saying that it wasn’t.',
    gloss: 'The atlas step (Step 1) is where charts actually go wrong — not the trigonometry.',
    source: 'ep. 396 transcript; Urban’s own Mexico-DST wedding-election near-miss.',
  },
  {
    who: 'The framing',
    quote: 'the first generation of astrologers in history who don’t need to know how to calculate charts in order to practice astrology.',
    gloss: 'The thesis of this tool: every hand step is CHECKED against the exact engine with the delta shown — the deltas are the pedagogy, not an embarrassment.',
    source: 'ep. 396 (Urban/Watson); patrickwatsonastrology.com/should-astrologers-know-how-to-calculate-natal-charts-by-hand/',
  },
];

// The reference kit, for the sources panel.
export const REFERENCE_KIT = [
  { title: 'Simply Math: A Comprehensive Guide to Easy & Accurate Chart Calculation', author: 'Lauran Fowks & Lynn Sellon', pub: 'Twelfth House Press, 2005', note: '30 lessons; ep. 396 calls it "the best book… if you want to learn chart calculation." Chapters 1–14 cover the NCGR Level I math.', source: 'books.google.com/books/about/Simply_Math.html + ep. 396' },
  { title: 'The American Ephemeris for 1950–2050 at Midnight (Trans-Century Edition)', author: 'Neil F. Michelsen & Rique Pottenger', pub: 'ACS', note: 'Midnight edition required — "all the formulas for chart calculations use the midnight positions."', source: 'ep. 396 (Brennan)' },
  { title: 'The American Atlas', author: 'Thomas G. Shanks', pub: 'ACS (Expanded 5th ed.)', note: 'Time changes & zones for 152,000+ US locations from 1883 — Step 1’s ground truth.', source: 'archive.org/details/americanatlasusl0000shan' },
  { title: 'The Michelsen Book of Tables (Koch & Placidus Tables of Houses)', author: 'Neil F. Michelsen & Rique Pottenger', pub: 'ACS, ISBN 9780935127607, 168 pp.', note: 'Merges the American Book of Tables + Koch Book of Tables; latitudes 0–60°N; includes Rob Hand & Joshua Brackett, "How to Cast a Natal Horoscope," diurnal-motion, Delta-T & interpolation tables.', source: 'AbeBooks/Amazon/Goodreads listings; astroamerica.com/michelsen.pdf sample' },
  { title: 'Chart Calculations for the Apocalypse (8-h workshop)', author: 'Catherine Urban', pub: 'catherine-urban.squarespace.com', note: 'Teaches positions "down to the seconds of a degree" + MC/ASC/Placidus cusps; NCGR Level I prep.', source: 'catherine-urban.squarespace.com/courses-and-webinars/chart-calculations-for-the-apocalypse' },
  { title: '"Should Astrologers Know How to Calculate Natal Charts by Hand?"', author: 'Patrick Watson', pub: 'patrickwatsonastrology.com', note: 'Advocacy/philosophy (no worked arithmetic — that is quoted from ep. 396).', source: 'patrickwatsonastrology.com/should-astrologers-know-how-to-calculate-natal-charts-by-hand/' },
  { title: 'The Astrology Podcast, ep. 396 — "Calculating Astrology Charts by Hand"', author: 'Chris Brennan with Catherine Urban & Patrick Watson', pub: '5 April 2023', note: 'Episode page + full transcript — the method’s primary accessible source.', source: 'theastrologypodcast.com/2023/04/05/calculating-astrology-charts-by-hand/ + /transcripts/tap-ep-396-transcript-calculating-astrology-charts-by-hand/' },
  { title: 'Encyclopedia of Astrology — "Logarithms"', author: 'Nicholas DeVore', pub: 'astrologysoftware.com dictionary', note: 'The proportional-logarithm definition & printed values (.22034 / .50035 → 4°34′).', source: 'astrologysoftware.com/community/learn/dictionary/logarithms.html' },
];
