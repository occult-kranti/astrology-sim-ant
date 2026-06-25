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
// opts: { hourRuler } — pass the planetary-hour ruler for the radicality test.
export function chartCautions(chart, { hourRuler = null } = {}) {
  const isDay = chart.isDay;
  const con = considerations(chart, hourRuler);     // Lilly's considerations
  const moon = moonCautions(chart);                 // the Moon's election state
  const planets = {};
  for (const name of PLANETS7) planets[name] = planetFlags(name, chart, isDay);

  // a flat, de-duplicated global list (considerations + Moon), severity-sorted
  const global = [...con.advisories, ...moon]
    .sort((a, b) => RANK[b.severity] - RANK[a.severity]);

  // verdict from the worst signals across global + per-planet flags
  const allSeverities = [
    ...global.map(a => a.severity),
    ...Object.values(planets).flatMap(p => p.flags.map(f => f.severity))
  ];
  const bad = allSeverities.filter(s => s === 'bad').length;
  const caution = allSeverities.filter(s => s === 'caution').length;
  let verdict = 'green', label = 'Few impediments — a clean figure.';
  if (bad >= 1 || caution >= 3) { verdict = 'red'; label = 'Strongly impeded — judge or elect with great care.'; }
  else if (caution >= 1) { verdict = 'amber'; label = 'Some cautions stand — weigh them before judging.'; }

  return { verdict, label, lordAsc: con.lordAsc, global, planets, counts: { bad, caution } };
}
