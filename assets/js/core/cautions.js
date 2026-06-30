// ============================================================================
//  cautions.js — a single, reusable "chart-health" engine that consolidates
//  every caution Lilly and the electional tradition raise about a figure:
//
//   • Lilly's Considerations before Judgement (Bk II) — radicality flags;
//   • the accidental afflictions of each planet (combust, retrograde, cadent,
//     under the beams, peregrine, besieged by the malefics);
//   • the Moon's condition (void of course, Via Combusta, slow, waning, near
//     a node → eclipse risk) which the electional art weighs above all.
//
//  It reuses the existing dignity / aspect / considerations machinery (nothing
//  is duplicated) and is consumed by the Book I Master Tool today and the
//  Election Engine later. Output is a set of severity-tagged advisories plus a
//  green/amber/red verdict, all presented as study support — never as fate.
// ============================================================================
import { norm360, signOf } from './astro.js';
import { aspectBetween } from './aspects.js';
import { essentialDignity, accidentalDignity } from './dignities.js';
import { considerations, moonVoidOfCourse, moonInViaCombusta } from './considerations.js';
import { DOMICILE } from './data/dignities-data.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const MALEFICS = ['Mars', 'Saturn'];
const CADENT = [3, 6, 9, 12];
const MOON_MEAN = 13.176; // °/day; below ≈12 Lilly calls her "slow, like Saturn"

// severity rank for sorting / verdict
const RANK = { bad: 3, caution: 2, note: 1, good: 0 };

// --- Per-planet accidental afflictions, distilled from accidentalDignity ----
function planetFlags(name, chart, isDay) {
  const p = chart.planets[name];
  const ad = accidentalDignity(name, chart);
  const ed = essentialDignity(name, p.lon, isDay);
  const flags = [];
  const has = k => ad.rows.some(r => r.kind.startsWith(k));

  if (has('Cazimi')) flags.push({ severity: 'good', text: 'Cazimi — in the very heart of the Sun, greatly fortified.' });
  else if (has('Combust')) flags.push({ severity: 'bad', text: 'Combust — within 8°½ of the Sun and burnt up; gravely weakened.' });
  else if (has('Under the Sun')) flags.push({ severity: 'caution', text: 'Under the Sun’s beams (within 17°) — obscured and weakened.' });

  if (has('Retrograde')) flags.push({ severity: 'caution', text: 'Retrograde — going backward; perverse, irresolute, things undone or reversed.' });
  if (has('Slow in motion')) flags.push({ severity: 'note', text: 'Slow in motion — feeble and dilatory in action.' });
  if (CADENT.includes(p.house)) flags.push({ severity: 'caution', text: `Cadent (in the ${ord(p.house)} house) — weak, of little power to act.` });
  if (ed.peregrine) flags.push({ severity: 'caution', text: 'Peregrine — without any essential dignity; a planet "wandering", apt to mischief unless received.' });

  // Besieged: hemmed between the two malefics — applying to one, separating
  // from the other (or within orb of both Mars and Saturn at once).
  if (!MALEFICS.includes(name)) {
    const toMars = aspectBetween(name, p, 'Mars', chart.planets.Mars);
    const toSat = aspectBetween(name, p, 'Saturn', chart.planets.Saturn);
    if (toMars && toSat) {
      const sep = (toMars.separating && toSat.applying) || (toSat.separating && toMars.applying);
      if (sep || (toMars.applying && toSat.applying))
        flags.push({ severity: 'bad', text: 'Besieged by Mars and Saturn — caught between the two malefics; "in great affliction."' });
    }
  }
  return { flags, essential: ed, accidental: ad };
}

const ORD = { 1:'1st',2:'2nd',3:'3rd',4:'4th',5:'5th',6:'6th',7:'7th',8:'8th',9:'9th',10:'10th',11:'11th',12:'12th' };
const ord = n => ORD[n] || `${n}th`;

// --- The Moon's electional condition (weighed above all in elections) -------
function moonCautions(chart) {
  const out = [];
  const moon = chart.planets.Moon, sun = chart.planets.Sun;

  // waxing / waning
  const elong = norm360(moon.lon - sun.lon);
  if (elong < 180) out.push({ severity: 'good', text: 'The Moon is increasing in light (waxing) — favours beginnings, growth and increase.' });
  else out.push({ severity: 'note', text: 'The Moon is decreasing in light (waning) — favours endings, banishing and decrease.' });

  // speed — Lilly's mean Moon ≈ 13°11'/day; below ~12° the tradition calls her
  // "slow as Saturn" (a real caution); between the two, only slightly slow.
  const spd = Math.abs(moon.speed);
  if (spd < 12) out.push({ severity: 'caution', text: `The Moon is slow (${spd.toFixed(1)}°/day, under ~12°) — "slow as Saturn"; matters drag.` });
  else if (spd < MOON_MEAN) out.push({ severity: 'note', text: `The Moon is a little under her mean motion (${spd.toFixed(1)}°/day) — somewhat slow.` });
  else out.push({ severity: 'good', text: `The Moon is swift (${spd.toFixed(1)}°/day, above her mean) — matters move briskly.` });

  // combust / under beams handled per-planet, but echo here for the Moon's centrality
  const fromSun = Math.min(elong, 360 - elong);
  if (fromSun <= 0.28) out.push({ severity: 'note', text: 'The Moon is conjunct the Sun (New Moon) — a void, dark Moon; the electional tradition avoids it.' });
  else if (fromSun <= 12) out.push({ severity: 'caution', text: 'The Moon is under the Sun’s beams (within ~12°) — obscured; avoid for new undertakings.' });

  // eclipse risk: Moon near a node and near the Sun (solar) or opposition (lunar)
  const nodeDist = Math.min(
    Math.min(norm360(moon.lon - chart.planets.NorthNode.lon), norm360(chart.planets.NorthNode.lon - moon.lon)),
    Math.min(norm360(moon.lon - chart.planets.SouthNode.lon), norm360(chart.planets.SouthNode.lon - moon.lon))
  );
  if (nodeDist <= 12 && (fromSun <= 18 || Math.abs(fromSun - 180) <= 18))
    out.push({ severity: 'bad', text: 'The Moon is near a node at a luminary syzygy — an eclipse season; the tradition shuns elections then.' });

  // conjunct / applying to a malefic
  for (const m of MALEFICS) {
    const a = aspectBetween('Moon', moon, m, chart.planets[m]);
    if (a && a.applying && (a.aspect === 'Conjunction' || a.aspect === 'Square' || a.aspect === 'Opposition'))
      out.push({ severity: 'caution', text: `The Moon is applying to a hard aspect of ${m} — an affliction to the matter.` });
  }
  return out;
}

// --- The headline engine ----------------------------------------------------
//  SIGNIFICATOR-WEIGHTED chart health (Lilly Bk II): a caution is weighed by
//  whether it touches the ACTUAL significators of the matter, not counted flat.
//  opts:
//    hourRuler?           the planetary-hour ruler (for the radicality test);
//    quesitedHouse?       1..12 — adds the lord of that house as a PRIMARY sig;
//    naturalSignificators? planet names — the topic's natural significators
//                          (e.g. Venus for marriage), counted SECONDARY;
//    extraPrimary?        planet names forced into the primary set (e.g. the
//                          natal Lord of the Geniture for a nativity).
//  The Moon and the sect light are ALWAYS primary (Lilly makes the Moon
//  co-significatrix and weighs the chart's luminary). A 'bad'-severity affliction
//  on ANY primary significator is decisive (red), exactly as Lilly judges.
export function chartCautions(chart, opts = {}) {
  const { hourRuler = null, quesitedHouse = null, naturalSignificators = [], extraPrimary = [] } = opts;
  const isDay = chart.isDay;
  const con = considerations(chart, hourRuler);     // Lilly's considerations
  const moon = moonCautions(chart);                 // the Moon's election state
  const planets = {};
  for (const name of PLANETS7) planets[name] = planetFlags(name, chart, isDay);

  // --- significator sets ---------------------------------------------------
  const sectLight = isDay ? 'Sun' : 'Moon';
  const lordQ = (quesitedHouse && chart.cusps) ? DOMICILE[signOf(chart.cusps[quesitedHouse]).index] : null;
  const PRIMARY = new Set([con.lordAsc, 'Moon', sectLight, lordQ, ...extraPrimary].filter(Boolean));
  const SECONDARY = new Set(naturalSignificators.filter(n => !PRIMARY.has(n)));
  const roleOf = name => PRIMARY.has(name) ? 'primary' : SECONDARY.has(name) ? 'secondary' : 'other';
  const WEIGHT = { primary: 3, secondary: 1.75, other: 1 };
  const SEV = { bad: -5, caution: -2, note: -1, good: 2 };

  // a flat, de-duplicated global list (considerations + Moon), severity-sorted.
  // Lilly's considerations and the Moon's condition are SIGNIFICATOR-LEVEL by
  // nature (the Moon is primary; the considerations weigh the Asc/lord/hour), so
  // they all count against the primary set in the weighting below.
  const global = [...con.advisories, ...moon]
    .sort((a, b) => RANK[b.severity] - RANK[a.severity]);

  // --- weighted impediment + which significators are actually hit ----------
  let impediment = 0;
  let primaryBadHit = false;
  const afflicted = new Set();                       // significators carrying ≥ caution
  const primaryCautionSubjects = new Set();

  // global cautions weigh as primary (severity × 3)
  for (const a of global) {
    impediment += (SEV[a.severity] || 0) * WEIGHT.primary;
    if (a.severity === 'bad') { primaryBadHit = true; }
  }
  // per-planet flags weigh by the planet's role
  let keyBad = 0, keyCaution = 0, otherBad = 0, otherCaution = 0;
  for (const [name, p] of Object.entries(planets)) {
    const role = roleOf(name), w = WEIGHT[role];
    for (const f of p.flags) {
      impediment += (SEV[f.severity] || 0) * w;
      const onSig = role !== 'other';
      if (f.severity === 'bad') {
        if (onSig) { keyBad++; primaryBadHit = primaryBadHit || role === 'primary'; afflicted.add(name); if (role === 'primary') primaryCautionSubjects.add(name); }
        else otherBad++;
      } else if (f.severity === 'caution') {
        if (onSig) { keyCaution++; afflicted.add(name); if (role === 'primary') primaryCautionSubjects.add(name); }
        else otherCaution++;
      }
    }
  }

  // --- verdict: hard rule first, then the weighted thresholds --------------
  let verdict = 'green', label = 'Few impediments — the significators of the matter are sound.';
  if (primaryBadHit || primaryCautionSubjects.size >= 2 || impediment <= -14) {
    verdict = 'red';
    label = 'Strongly impeded — a primary significator (the Lord of the Ascendant, the Moon, the sect light, or the quesited’s lord) is gravely afflicted; judge or elect with great care.';
  } else if (keyCaution >= 1 || otherBad >= 1 || impediment <= -5) {
    verdict = 'amber';
    label = 'Some cautions stand — weigh them, above all any that fall on the significators of the matter.';
  }

  const bad = keyBad + otherBad, caution = keyCaution + otherCaution;
  return {
    verdict, label, lordAsc: con.lordAsc,
    significators: { primary: [...PRIMARY], secondary: [...SECONDARY] },
    afflictedSignificators: [...afflicted],
    impediment: Math.round(impediment * 10) / 10,
    global, planets,
    counts: { bad, caution, keyBad, keyCaution, otherBad, otherCaution },
  };
}
