// ============================================================================
//  incense-materia.js — THE MATERIALS, AS TOKENS, WITH THEIR AMBIGUITIES.
//
//  WHAT THIS IS FOR. planetary-magic.js records each planet's suffumigation as
//  the source names it — one string per planet. That is the right shape for a
//  per-PLANET view and useless for a per-MATERIAL one, which is the question
//  only this corpus can answer: *frankincense is assigned where, by whom?*
//
//  WHY THIS IS HAND-AUTHORED AND NOT PARSED. Splitting those strings on commas
//  would be fabrication dressed as processing:
//    · "opium, etc." — the "etc." is the SOURCE's ellipsis. The list is
//      truncated in the text; a parser would silently report a list of one.
//    · "\"hermits'\" 31-spice" is ONE composite recipe of 31 ingredients that
//      this site does not carry. Expanding it would invent 31 materials.
//    · "28-component lunar" is the same problem at 28.
//    · "aloes wood" (Mars) and "aloes" (Venus) LOOK like the same word and are
//      very likely two different plants — see AMBIGUITIES below. A parser
//      would merge them and produce a false convergence, which is the single
//      most damaging error a comparison view can make.
//
//  So the tokenisation is a JUDGEMENT, recorded here, reviewable, and never
//  computed. Every token names the substance string it was read out of, so the
//  derivation can be checked by eye against planetary-magic.js.
//
//  THE OPERABLE TRIPLE (FRAMING §5, C-1) IS NOT RELAXED HERE. This module
//  carries identity and provenance only — no quantity, no process parameter,
//  no preparation. The harm-flagged rows keep pointing at planetary-magic.js's
//  `suffumigationMateria`, which is where the typed fields live and where the
//  third fact has deliberately been given nowhere to sit.
//
//  SOURCE: Picatrix III.7 and Agrippa, Three Books II, as recorded by
//  planetary-magic.js. The Picatrix chapter attribution is UNDER REVIEW — see
//  docs/plans/accuracy/70-PATCHSET.md on a suspected III.3/III.7 conflation —
//  and every row here inherits that doubt rather than hiding it.
// ============================================================================

/**
 * The tokens read out of each planet's `suffumigationMateria.substance`.
 * `readFrom` is that string verbatim, so a reader can check the split.
 */
export const MATERIA_TOKENS = {
  Saturn: {
    readFrom: 'opium, etc.',
    tokens: ['opium'],
    truncatedInSource: true,
    truncationNote: 'The "etc." is the source\'s own ellipsis, not an omission by this site. '
      + 'Saturn\'s list is longer than the one substance recorded here, and the remainder is not carried.',
  },
  Jupiter: { readFrom: 'storax, frankincense', tokens: ['storax', 'frankincense'] },
  Mars: {
    readFrom: 'aloes wood, (blood, hist.)',
    tokens: ['aloeswood', 'blood-animal'],
    note: 'The parenthesis and "hist." are the record\'s own marking that the blood element is '
      + 'reported historically rather than carried as a live instruction.',
  },
  Sun: { readFrom: '"hermits\'" 31-spice; saffron', tokens: ['hermits-31-spice', 'saffron'] },
  Venus: { readFrom: 'aloes, mastic, roses', tokens: ['aloes-resin', 'mastic', 'roses'] },
  Mercury: { readFrom: 'cloves, cumin, myrtle', tokens: ['cloves', 'cumin', 'myrtle'] },
  Moon: { readFrom: '28-component lunar', tokens: ['lunar-28'] },
};

/**
 * The materials themselves. `kind`:
 *   simple    — one identifiable material
 *   composite — a named multi-ingredient recipe this site does NOT enumerate
 *   animal    — animal-derived; carried as record, never as instruction
 */
export const MATERIA = {
  opium: {
    label: 'Opium',
    kind: 'simple',
    botanical: 'the dried latex of Papaver somniferum',
    harm: true,
    harmRef: 'planetary-magic.js → Saturn.suffumigationMateria',
    disputed: 'opium-vs-poppy-seed',
  },
  storax: { label: 'Storax', kind: 'simple', botanical: 'balsam of Liquidambar orientalis / Styrax spp.' },
  frankincense: { label: 'Frankincense', kind: 'simple', botanical: 'oleoresin of Boswellia spp.' },
  aloeswood: {
    label: 'Aloeswood',
    kind: 'simple',
    botanical: 'resinous heartwood of Aquilaria spp. (agarwood, oud)',
    ambiguity: 'aloes-pair',
  },
  'aloes-resin': {
    label: 'Aloes',
    kind: 'simple',
    botanical: 'most likely the bitter resin of Aloe spp. (socotrine aloes) — NOT the same plant as aloeswood',
    ambiguity: 'aloes-pair',
  },
  'blood-animal': {
    label: 'Blood',
    kind: 'animal',
    harm: true,
    harmRef: 'planetary-magic.js → Mars.suffumigationMateria',
    note: 'Recorded because the text names it. Raw animal tissue is a bloodborne-pathogen exposure route; '
      + 'it is carried here as a historical record and as nothing else.',
  },
  'hermits-31-spice': {
    label: "The “hermits’” 31-spice compound",
    kind: 'composite',
    componentCount: 31,
    note: 'A named compound of thirty-one ingredients. This site does not carry the ingredient list, so the '
      + 'compound is indexed as ONE material rather than expanded into thirty-one it cannot cite.',
  },
  saffron: { label: 'Saffron', kind: 'simple', botanical: 'stigmas of Crocus sativus' },
  mastic: { label: 'Mastic', kind: 'simple', botanical: 'resin of Pistacia lentiscus' },
  roses: { label: 'Roses', kind: 'simple', botanical: 'Rosa spp.' },
  cloves: { label: 'Cloves', kind: 'simple', botanical: 'flower buds of Syzygium aromaticum' },
  cumin: { label: 'Cumin', kind: 'simple', botanical: 'seed of Cuminum cyminum' },
  myrtle: { label: 'Myrtle', kind: 'simple', botanical: 'Myrtus communis' },
  'lunar-28': {
    label: 'The 28-component lunar compound',
    kind: 'composite',
    componentCount: 28,
    note: 'Twenty-eight components, plausibly one per lunar mansion — but this site does not carry the list, '
      + 'and the mansion correspondence is NOT asserted here because no source in this repo states it.',
  },
};

/**
 * Ambiguities and disputes that a naive index would erase. These are the point
 * of the page, not footnotes to it.
 */
export const AMBIGUITIES = {
  'aloes-pair': {
    title: 'Two different “aloes”',
    affects: ['aloeswood', 'aloes-resin'],
    body: 'Mars is given "aloes wood" and Venus "aloes". These read as the same word and are almost '
      + 'certainly two unrelated plants: aloeswood is the resinous heartwood of Aquilaria (agarwood/oud), '
      + 'while "aloes" in a Renaissance materia list usually means the bitter resin of Aloe. This index '
      + 'keeps them SEPARATE. If they were merged, the page would report a Mars–Venus convergence that '
      + 'no source states — the most damaging error a comparison view can make.',
    status: 'kept-apart pending a source that settles it',
  },
  'opium-vs-poppy-seed': {
    title: 'Saturn: opium, or black poppy seed?',
    affects: ['opium'],
    body: 'This repo records Saturn\'s suffumigation as "opium, etc." and cites Picatrix III.7. Agrippa I.xliv '
      + 'gives the SEED OF BLACK POPPY, which is a different material: poppy seed is essentially free of '
      + 'opiates, while opium is the dried latex of the unripe capsule. Two texts may legitimately name two '
      + 'different substances, so both are recorded. What is NOT settled is whether the Picatrix citation is '
      + 'right: docs/plans/accuracy/70-PATCHSET.md carries a suspected III.3/III.7 conflation in this exact '
      + 'module, so the chapter attribution is under review.',
    status: 'unresolved — both readings carried, citation under review',
  },
};

// ============================================================================
//  THE PRACTITIONER TABLE — a SECOND assignment set, and it disagrees.
//
//  The maintainer's earlier instrument ("The Week of Unequal Hours",
//  planetary_hours.html) shipped its own per-planet incense table, described in
//  its own footer as "the multi-source table of this project". It is a MODERN
//  PRACTITIONER assignment — Tier C — and it is not the Picatrix/Agrippa table
//  above. On five of seven planets the two disagree outright.
//
//  That disagreement is the most interesting thing either table contains, so
//  both ship, attributed, and neither is corrected into the other. The v1 table
//  is also unusually honest about itself: it marks Saturn's myrrh as a modern
//  STAND-IN and says plainly that "Saturn's classical fumes are deliberately
//  harsh" — i.e. it substituted a safe resin for the historical material. That
//  is a substitution, not a reading of a text, and it is recorded as one.
//
//  DO NOT MERGE THE COLUMNS. A reader choosing between "frankincense for the
//  Sun" (practitioner) and "the 31-spice compound and saffron" (Picatrix) is
//  choosing between a living practice and a historical text, and the site's job
//  is to make that choice visible rather than to make it for them.
// ============================================================================
export const PRACTITIONER_TABLE = {
  _meta: {
    tier: 'C',
    label: 'Superseded working table (not a source)',
    source: 'The Week of Unequal Hours (planetary_hours.html), this project\'s own earlier instrument, '
      + 'whose footer calls it "the multi-source table of this project" without naming the sources.',
    status: 'SUPERSEDED. NOT AN AUTHORITY FOR THIS SITE.',
    caution: 'MAINTAINER RULING (2026-08-01): the site\'s assignments come from the BOOKS, cited — '
      + 'Picatrix III.7 and Agrippa, Three Books II — and not from this project\'s own earlier '
      + 'combinations. This table is retained ONLY as a documented contrast, because a comparison '
      + 'corpus should show where its own past working assumptions diverged from its texts rather '
      + 'than quietly delete them. Nothing on this site is derived from it, and no page presents it '
      + 'as a tradition\'s assignment.',
  },
  Sun: { main: 'frankincense', alt: 'cinnamon' },
  Moon: { main: 'oud / aloeswood', alt: 'camphor' },
  Mercury: { main: 'mastic', alt: 'cinnamon sticks' },
  Venus: { main: 'rose', alt: 'sandalwood' },
  Mars: { main: "dragon's blood", alt: 'pepper (classical)' },
  Jupiter: { main: 'saffron', alt: 'nutmeg' },
  Saturn: {
    main: 'myrrh',
    alt: null,
    substitution: true,
    substitutionNote: 'The v1 table marks this a modern STAND-IN and states that Saturn\'s classical '
      + 'fumes are deliberately harsh. It is a substitution for the historical material, not a '
      + 'reading of it — which is exactly the honest thing to do and exactly the thing that must be '
      + 'labelled rather than passed off as the tradition\'s own assignment.',
  },
};

export const MATERIA_SOURCE =
  'Tokens read from assets/js/core/data/planetary-magic.js, whose own source line is '
  + '"Picatrix III.7; Agrippa, Three Books II". The tokenisation is hand-authored and reviewable; '
  + 'it is never parsed from the strings.';
