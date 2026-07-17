// ============================================================================
//  core/explain/horary.js — the "In plain words" judgement assembly for the
//  Horary calculator (pages/book2/horary.html) and the Workbench horary card.
//  PURE: reads a `fullReading` slice (reading.horary + reading.cautions) and
//  states the buried judgement as ONE attributed sentence — "the tradition's
//  answer here is …" — never as a second-person prediction (chart-ux.md §7.3).
//  No DOM. Headless-testable.
//
//  Exports: explainHorary(reading) -> text model (or a general-state model when
//  no quesited house is set).
// ============================================================================
import { model, mkTerm, esc, verdictTone } from './util.js';

const low = s => String(s || '').toLowerCase();

// Does the matter perfect? (Shared significator, an applying direct aspect,
// translation or collection of light.) Mirrors the page's verdict banner.
function perfectsFrom(h) {
  const M = (h.perfection && h.perfection.modes) || {};
  return !!(h.sharedSignificator || (M.direct && M.direct.applying) || M.translation || M.collection);
}

// ---------------------------------------------------------------------------
//  explainHorary — the one-sentence judgement + its testimonies for and against.
// ---------------------------------------------------------------------------
export function explainHorary(reading) {
  const h = reading.horary;

  // No quesited house chosen — the general state of play (querent + Moon).
  if (!h) {
    const lordAsc = reading.cautions.lordAsc;
    const moon = reading.moment.planets.Moon;
    return model({
      anchorId: 'h-explain',
      text: `No specific house is chosen, so the tradition reads only the general state of play: the querent is signified by ${lordAsc || 'the lord of the Ascendant'} and by the Moon, now in ${moon.sign}. Choose the house the question is about to have the tradition assemble a judgement — this describes a historical method, not a forecast.`,
      terms: [mkTerm('Querent'), mkTerm('Significator')],
      tone: null,
      mechanics: null,
    });
  }

  const M = (h.perfection && h.perfection.modes) || {};
  const forT = [], againstT = [];
  if (h.sharedSignificator) forT.push('querent and quesited share one significator');
  if (M.direct && M.direct.applying) forT.push(`an applying ${low(M.direct.aspect)} of the significators`);
  if (M.translation) forT.push(`translation of light by ${M.translation.carrier}`);
  if (M.collection) forT.push(`collection of light by ${M.collection.collector}`);
  if (M.reception) forT.push(`${M.reception.mutual ? 'mutual' : 'one-way'} reception between them`);
  if (M.direct && !M.direct.applying) againstT.push(`a separating ${low(M.direct.aspect)} (the matter past or denied)`);
  if (M.prohibition) againstT.push(`prohibition by ${M.prohibition.planet}`);
  if (M.refranation) againstT.push(`refranation of ${M.refranation.planet}`);
  if (h.moonCoSignificator && h.moonCoSignificator.voidOfCourse) againstT.push('the Moon void of course');

  const perfects = perfectsFrom(h);
  const answer = perfects ? 'yes — the matter perfects'
    : (h.moonCoSignificator && h.moonCoSignificator.voidOfCourse && !perfects) ? 'no — nothing comes of it'
    : 'unclear — no clean perfection stands';
  const tone = perfects ? 'ok'
    : (h.moonCoSignificator && h.moonCoSignificator.voidOfCourse && !perfects) ? 'bad' : 'warn';

  const reason = perfects
    ? (h.sharedSignificator ? 'one planet rules both sides, a strong affirmative testimony'
      : (M.direct && M.direct.applying) ? 'the significators apply to a direct aspect'
      : M.translation ? 'a third planet carries the light between them'
      : 'a weightier planet collects both significators')
    : (h.moonCoSignificator && h.moonCoSignificator.voidOfCourse) ? 'the Moon makes no further aspect before leaving her sign'
    : 'the significators cast no completing aspect within orb — the Moon must be read for the drift';

  const timing = h.perfection && h.perfection.timing;
  const parts = [
    `For the ${h.quesitedHouse}${ord(h.quesitedHouse)} house, the tradition weighs the testimonies:`,
    forT.length ? `in favour — ${forT.join('; ')}.` : 'nothing stands clearly in favour.',
    againstT.length ? `Against — ${againstT.join('; ')}.` : 'Nothing stands clearly against.',
    `On balance a horary reader would answer: ${answer}, because ${reason}.`,
    timing ? `Should it come about, Lilly would proportion the time at roughly ${timing.text} — his rough estimate, never a date.` : '',
    `This states how the seventeenth-century method reckons the question; it has no demonstrated power to predict the outcome.`,
  ];

  const terms = [mkTerm('Querent'), mkTerm('Quesited'), mkTerm('Significator'), mkTerm('Perfection')];
  if (M.translation) terms.push(mkTerm('Translation of Light'));
  if (M.collection) terms.push(mkTerm('Collection of Light'));
  if (M.reception) terms.push(mkTerm('Reception'));
  if (M.prohibition) terms.push(mkTerm('Prohibition'));
  if (M.refranation) terms.push(mkTerm('Refranation'));
  if (h.moonCoSignificator && h.moonCoSignificator.voidOfCourse) terms.push(mkTerm('Void of Course'));

  return model({
    anchorId: 'h-explain',
    text: parts.filter(Boolean).join(' '),
    terms,
    tone,
    mechanics: {
      summary: 'How the judgement is assembled',
      html: `<p>The querent is signified by the lord of the 1st (${esc(h.querent.lordAsc || '—')}) and the Moon; the quesited by the lord of the ${esc(String(h.quesitedHouse))}${ord(h.quesitedHouse)} house (${esc(h.quesited.lordQ || '—')}). The matter "perfects" when those significators come together — by a shared ruler, an applying conjunction or aspect, or the translation or collection of a third planet — unless prohibition, refranation or a void Moon intervenes. Timing, when offered, proportions the degrees-to-perfection by the mode of the sign and the strength of the house — Lilly's own admitted guess.</p>`,
      citation: 'Lilly, Christian Astrology, Bk II — significators, the modes of perfection, and the resolution of the question.',
      contested: [],
    },
  });
}

const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
function ord(n) { return (n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'); }
