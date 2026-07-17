// ============================================================================
//  core/explain/nativity.js — the "In plain words" text model for the Nativity
//  calculator (pages/book3/nativity.html). PURE: reads a `fullReading` plus the
//  page's computed temperament tally and states what Lilly's Book III apparatus
//  makes of the figure — in the attributed voice, never as a verdict on a person
//  (chart-ux.md §7.4, §4.3). No DOM. Headless-testable.
//
//  Exports: explainNativity(reading, { temperament }) -> text model.
//    temperament (optional) = { hot: number, dry: number, dominant: string } —
//    the humoral tally the page already computes (book3.js). When absent, the
//    temperament sentence is simply omitted.
// ============================================================================
import { model, mkTerm, esc, sgn, dignityExtremes } from './util.js';

const HUMOUR_TERM = { Choleric: 'Choleric', Melancholic: 'Melancholic', Sanguine: 'Sanguine', Phlegmatic: 'Phlegmatic' };

export function explainNativity(reading, opts = {}) {
  const m = reading.moment;
  const asc = m.angles.asc.label;
  const birth = m.isDay ? 'a day birth (the Sun above the horizon)' : 'a night birth (the Sun below the horizon)';
  const log = reading.dignities.lordOfGeniture;
  const ext = dignityExtremes(reading.dignities.perPlanet);
  const t = opts.temperament || null;

  const parts = [];
  parts.push(`The tradition reads this nativity as ${birth}, with ${asc} rising.`);
  if (log && log.planet) {
    parts.push(`Weighing every essential and accidental strength, Lilly would take ${log.planet} for the Lord of the Geniture (total ${sgn(log.score)}) — the body he calls "the most powerful and predominant" in the figure, the one that colours the whole disposition.`);
  }
  if (ext) {
    parts.push(`By essential dignity ${ext.strongest.name} is the most fortified body here and ${ext.weakest.name} the most afflicted.`);
  }
  const terms = [mkTerm('Ascendant'), mkTerm('Sect (Diurnal / Nocturnal)'), mkTerm('Lord of the Geniture'), mkTerm('Essential Dignity')];

  if (t) {
    const hotWord = t.hot > 0 ? 'hot' : t.hot < 0 ? 'cold' : 'balanced between hot and cold';
    const dryWord = t.dry > 0 ? 'dry' : t.dry < 0 ? 'moist' : 'balanced between dry and moist';
    parts.push(`Tallying the qualities of the Ascendant, the two lights and the Lord of the Geniture, the humoral scheme leans ${hotWord} and ${dryWord} — a predominantly ${t.dominant.toLowerCase()} temperament in the old physiology.`);
    terms.push(mkTerm('Temperament'));
    if (HUMOUR_TERM[t.dominant]) terms.push(mkTerm(HUMOUR_TERM[t.dominant]));
  }
  parts.push(`Every line describes how Lilly's Book III would reckon the figure — a historical method of study, never a judgement of the person born.`);

  return model({
    anchorId: 'n-explain',
    text: parts.join(' '),
    terms,
    tone: null,
    mechanics: {
      summary: 'What Book III computes here',
      html: `<p>The Lord of the Geniture is the body with the greatest combined dignity — essential (sign and degree) plus accidental (house, motion, freedom from the Sun). The temperament is a tally of the hot/cold and dry/moist qualities carried by the elements of the Ascendant sign, the Moon's sign, the Sun's sign and the Lord of the Geniture's sign; Fire is hot-and-dry (choleric), Earth cold-and-dry (melancholic), Air hot-and-moist (sanguine), Water cold-and-moist (phlegmatic). This is a simplified rendering — Lilly also weighs the planets aspecting the Ascendant, the Moon's phase and the season (${esc('CA Bk III')}).</p>`,
      citation: 'Lilly, Christian Astrology, Bk III — the Lord of the Geniture and the humoral temperament; Galenic four-humour physiology.',
      contested: [],
    },
  });
}
