// ============================================================================
//  app/practices-art.js — the SVG figure builder for the mudrā catalog.
//
//  DOM/presentation layer (core/ stays DOM-free and stores only `artId`). Every
//  figure is inline, stroke-only schematic line-art in the yoga wing's style
//  (viewBox 0 0 120 140, currentColor/token strokes, no fills, no animation —
//  reduced-motion-first is trivially met). role="img" + a descriptive aria-label
//  on every figure; the aria-label DESCRIBES the diagram, it never instructs.
//
//  Framing rule honoured in the art: a seal is drawn only as schematically as
//  the source supports. Where a precise anatomical depiction is uncertain or the
//  content is sensitive (khecarī's cutting, vajrolī), the figure is a labelled
//  schematic or an honest "not diagrammed" panel + the note — never invented
//  anatomically-specific detail the source does not give.
//
//  Robust-by-design: the figure is resolved from the record's stable `id` first
//  (with `artId` as an optional forward-compatible hint, then a family default),
//  so it renders correctly whatever artId the data layer assigns.
// ============================================================================

const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// A shared seated base (head + spine + arms + crossed legs), yoga-wing grammar.
const SEATED_HEAD = '<circle cx="60" cy="22" r="11"/>';
const SEATED_SPINE = '<line x1="60" y1="33" x2="60" y2="78"/>';
const SEATED_ARMS = '<path d="M60 46 L38 66"/><path d="M60 46 L82 66"/>';
const SEATED_LEGS = '<path d="M30 104 Q48 84 60 86 Q72 84 90 104"/><path d="M42 100 L80 112"/><path d="M78 100 L40 112"/>';
const seated = (extra = '') => SEATED_HEAD + SEATED_SPINE + SEATED_ARMS + SEATED_LEGS + extra;

// A head shown in profile (for the tongue / gaze / beak seals).
const PROFILE_HEAD = '<path d="M78 14 Q44 12 44 34 Q44 54 66 56 L80 56" />';

// The five pañca-dhāraṇā element glyphs beside a seated figure.
function elementFig(glyph) {
  return seated('') + '<g class="pr-elem">' + glyph + '</g>';
}
const ELEM = {
  earth: '<rect x="92" y="30" width="20" height="20"/>',                         // yellow square
  water: '<path d="M92 46 Q102 60 112 46"/>',                                    // white crescent (down-arc)
  fire: '<path d="M102 28 L112 50 L92 50 Z"/>',                                  // red triangle
  air: '<circle cx="102" cy="40" r="10"/>',                                      // smoky circle
  ether: '<circle cx="102" cy="40" r="2.4"/><path d="M102 28 v-4 M102 56 v-4 M90 40 h-4 M114 40 h4 M93 31 l-3 -3 M111 31 l3 -3 M93 49 l-3 3 M111 49 l3 3"/>', // point + radiance
};

// Each figure: { label (the aria-label = a DESCRIPTION), svg (inner markup) }.
const FIG = {
  'seated-forward-fold': {
    label: 'Schematic seated figure folding forward over one extended leg, both hands reaching toward the foot.',
    svg: '<circle cx="48" cy="40" r="10"/><path d="M48 50 Q54 64 64 72"/>'
      + '<line x1="64" y1="80" x2="106" y2="86"/><path d="M106 86 L102 92 M106 86 L110 90"/>'
      + '<path d="M64 80 L44 92 L60 78"/>'
      + '<path d="M50 52 L100 84"/><path d="M48 56 L98 88"/>',
  },
  'seated-lock': {
    label: 'Schematic seated cross-legged figure with the chin drawn toward the chest — a bodily lock held with the breath.',
    svg: seated('<path d="M60 33 Q60 40 55 45"/>'),
  },
  'seated-strike': {
    label: 'Schematic seated figure raised on both hands, indicating the seated body lifted and set down again.',
    svg: SEATED_HEAD + SEATED_SPINE + '<path d="M60 46 L40 74"/><path d="M60 46 L80 74"/>'
      + '<path d="M40 74 L40 96"/><path d="M80 74 L80 96"/>'
      + SEATED_LEGS + '<path d="M60 118 v10 M56 124 l4 4 4 -4"/>',
  },
  'abdominal-lock': {
    label: 'Schematic seated figure with the abdomen drawn inward toward the spine — the abdominal "flying-up" lock.',
    svg: SEATED_HEAD + '<path d="M60 33 Q52 55 60 78"/>' + SEATED_ARMS + SEATED_LEGS
      + '<path class="pr-dash" d="M63 50 Q57 60 63 70"/>',
  },
  'throat-lock': {
    label: 'Schematic head and upper chest with the chin pressed down toward the chest — the throat ("net-holding") lock.',
    svg: '<circle cx="60" cy="40" r="14"/><path d="M60 54 Q60 64 52 70"/>'
      + '<path d="M34 92 Q60 78 86 92"/>',
  },
  'root-lock': {
    label: 'Schematic seated figure with an upward arrow at the pelvic base — the root lock drawing the lower breath upward.',
    svg: seated('<path d="M60 100 L60 84"/><path d="M55 90 L60 84 L65 90"/>'),
  },
  'tongue-palate': {
    label: 'Schematic head in profile with the tongue turned upward toward the palate.',
    svg: PROFILE_HEAD + '<circle cx="58" cy="30" r="1.6"/>'
      + '<path d="M52 46 Q60 40 64 32"/>',
  },
  'gaze-brow': {
    label: 'Schematic head in profile with the gaze directed to the point between the eyebrows.',
    svg: PROFILE_HEAD + '<circle cx="58" cy="32" r="1.8"/>'
      + '<path class="pr-dash" d="M56 30 L40 22"/><circle cx="40" cy="22" r="2"/>',
  },
  'inverted': {
    label: 'Schematic inverted figure — head below and legs raised above — the reversed ("upside-down") posture.',
    svg: '<circle cx="60" cy="116" r="11"/><line x1="60" y1="105" x2="60" y2="62"/>'
      + '<path d="M60 92 L40 74"/><path d="M60 92 L80 74"/>'
      + '<line x1="60" y1="62" x2="52" y2="20"/><line x1="60" y1="62" x2="68" y2="20"/>',
  },
  'arm-balance': {
    label: 'Schematic arm-balance: both palms on the ground, the legs raised into the air, the head held off the ground.',
    svg: '<path d="M36 108 L52 84"/><path d="M84 108 L68 84"/>'
      + '<circle cx="60" cy="86" r="9"/><path d="M60 78 L52 58"/><path d="M60 78 L68 58"/>'
      + '<line x1="52" y1="58" x2="46" y2="22"/><line x1="68" y1="58" x2="74" y2="22"/>'
      + '<line x1="34" y1="108" x2="86" y2="108"/>',
  },
  'six-gates': {
    label: 'Schematic seated figure with both hands raised to the face, closing the openings of the head.',
    svg: SEATED_HEAD + SEATED_SPINE + '<path d="M60 46 L50 30"/><path d="M60 46 L70 30"/>'
      + '<circle cx="50" cy="28" r="2.4"/><circle cx="70" cy="28" r="2.4"/>' + SEATED_LEGS,
  },
  'serpent-coil': {
    label: 'Schematic seated figure with a coiled spiral at the base of the spine — the "sleeping serpent-power".',
    svg: seated('<path class="pr-dash" d="M60 96 q-7 -3 -3 -10 q4 -6 10 -1 q5 4 1 10 q-4 5 -10 2"/>'),
  },
  'folded-legs': {
    label: 'Schematic outline figure with the legs folded up behind the neck — an extreme folding posture, shown only in outline.',
    svg: '<circle cx="60" cy="30" r="11"/><path d="M60 41 Q46 66 60 78"/>'
      + '<path d="M60 78 Q34 70 40 44 Q44 30 56 30"/>'
      + '<path d="M60 78 Q86 70 80 44 Q76 30 64 30"/>',
  },
  'crow-beak': {
    label: 'Schematic head in profile with the lips pursed forward like a beak.',
    svg: PROFILE_HEAD + '<circle cx="58" cy="30" r="1.6"/>'
      + '<path d="M44 40 L34 37 L44 44"/>',
  },
  'standing-water': {
    label: 'Schematic standing figure immersed to the neck, shown by a horizontal water line at the shoulders.',
    svg: '<circle cx="60" cy="24" r="10"/><line x1="60" y1="34" x2="60" y2="86"/>'
      + '<path d="M60 48 L44 66"/><path d="M60 48 L76 66"/>'
      + '<line x1="60" y1="86" x2="48" y2="118"/><line x1="60" y1="86" x2="72" y2="118"/>'
      + '<path class="pr-water" d="M20 40 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0"/>',
  },
  'element-earth': { label: 'Schematic seated figure beside a square — the earth-element concentration diagram.', svg: elementFig(ELEM.earth) },
  'element-water': { label: 'Schematic seated figure beside a crescent — the water-element concentration diagram.', svg: elementFig(ELEM.water) },
  'element-fire': { label: 'Schematic seated figure beside a triangle — the fire-element concentration diagram.', svg: elementFig(ELEM.fire) },
  'element-air': { label: 'Schematic seated figure beside a circle — the air-element concentration diagram.', svg: elementFig(ELEM.air) },
  'element-ether': { label: 'Schematic seated figure beside a radiant point — the space/ether-element concentration diagram.', svg: elementFig(ELEM.ether) },
};

// The honest "not diagrammed" archetype — no body is drawn (sensitive/complex).
const NOT_DIAGRAMMED = {
  label: 'No schematic diagram is drawn for this record; the practice is described in words only.',
};

export const ART_ARCHETYPES = Object.keys(FIG).concat(['not-diagrammed']);

// record.id -> archetype (kept here too, so the figure resolves even if the data
// layer's artId is absent or differs). Mirrors the data generator.
const ID_TO_ART = {
  'gs-mahamudra': 'seated-forward-fold', 'hyp-mahamudra': 'seated-forward-fold',
  'gs-mahabandha': 'seated-lock', 'hyp-mahabandha': 'seated-lock',
  'gs-mahavedha': 'seated-strike', 'hyp-mahavedha': 'seated-strike',
  'gs-uddiyana-bandha': 'abdominal-lock', 'hyp-uddiyana-bandha': 'abdominal-lock',
  'gs-tadagi': 'abdominal-lock',
  'gs-jalandhara-bandha': 'throat-lock', 'hyp-jalandhara-bandha': 'throat-lock',
  'gs-mulabandha': 'root-lock', 'hyp-mulabandha': 'root-lock', 'gs-asvini': 'root-lock',
  'gs-khecari': 'tongue-palate', 'hyp-khecari': 'tongue-palate',
  'gs-nabho-mudra': 'tongue-palate', 'gs-manduki': 'tongue-palate', 'gs-bhujangini': 'tongue-palate',
  'gs-sambhavi': 'gaze-brow',
  'gs-viparitakarani': 'inverted', 'hyp-viparitakarani': 'inverted',
  'gs-vajroni': 'arm-balance',
  'gs-yoni-mudra': 'six-gates',
  'gs-sakticalani': 'serpent-coil', 'hyp-saktichalana': 'serpent-coil',
  'gs-pasini': 'folded-legs',
  'gs-kaki': 'crow-beak',
  'gs-matangini': 'standing-water',
  'gs-parthivi-dharana': 'element-earth', 'gs-ambhasi-dharana': 'element-water',
  'gs-agneyi-dharana': 'element-fire', 'gs-vayavi-dharana': 'element-air',
  'gs-akasi-dharana': 'element-ether',
  'hyp-vajroli': 'not-diagrammed',
};

/** Resolve the figure archetype for a record (id first, then artId hint). */
export function artIdFor(rec) {
  if (!rec) return 'seated-lock';
  if (ID_TO_ART[rec.id] && (FIG[ID_TO_ART[rec.id]] || ID_TO_ART[rec.id] === 'not-diagrammed')) return ID_TO_ART[rec.id];
  if (rec.artId && (FIG[rec.artId] || rec.artId === 'not-diagrammed')) return rec.artId;
  return 'seated-lock';                                              // family default (all P1 records are seated seals)
}

/**
 * Build the schematic figure for a mudrā record.
 * Returns an HTML <figure> string: an inline stroke-only SVG (role=img +
 * descriptive aria-label) + a caption stating the diagram is generated, not
 * from the source. For the 'not-diagrammed' archetype, returns an honest
 * text panel instead of an invented figure.
 */
export function mudraFigure(rec, { caption = true } = {}) {
  const key = artIdFor(rec);
  if (key === 'not-diagrammed') {
    return '<figure class="pr-fig pr-fig--none">'
      + '<div class="pr-noart" role="img" aria-label="' + esc(NOT_DIAGRAMMED.label) + '">'
      + '<span class="pr-noart-mark" aria-hidden="true">—</span>'
      + '<span class="pr-noart-txt">Not diagrammed</span></div>'
      + (caption ? '<figcaption class="pr-cap">No schematic is drawn for this record — the practice is described in words only, not depicted.</figcaption>' : '')
      + '</figure>';
  }
  const fig = FIG[key] || FIG['seated-lock'];
  return '<figure class="pr-fig">'
    + '<svg viewBox="0 0 120 140" role="img" aria-label="' + esc(fig.label) + '">' + fig.svg + '</svg>'
    + (caption ? '<figcaption class="pr-cap">Schematic diagram generated for this site — not from the source text.</figcaption>' : '')
    + '</figure>';
}

export default { mudraFigure, artIdFor, ART_ARCHETYPES };
