// ============================================================================
//  scripts/tests/r28-vedic-core.mjs — R28 V1 (vedic data + engines) headless
//  tests. Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a
//  `DRIVES` array for the Chromium sweep. Deterministic; no DOM, no network.
//
//  Covers: the two GENERATED data modules (counts + verbatim spot-checks vs the
//  byte-locked source), the data-driven yoga detector (targeted vectors incl.
//  Gaja-Kesarī bare-vs-conditioned and Kāla-Sarpa sign-vs-degree), the three
//  surfacing exports, and the PIN-FIRST ṣaḍbala equality guard (3 fixed charts).
// ============================================================================
import { createHash } from 'node:crypto';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic, compoundRelations, grahaDrishti, combustion } from '../../assets/js/core/vedic.js';
import { detectYogas, yogaStats } from '../../assets/js/core/yogas.js';
import { YOGA_RULES, YOGA_FAMILIES, YOGA_META } from '../../assets/js/core/data/yoga-rules.js';
import { BHAVA_PHALA, BHAVA_PHALA_META, bhavaPhala } from '../../assets/js/core/data/bhava-phala.js';
import { RASHIS } from '../../assets/js/core/data/vedic-data.js';
import { REGISTRY } from '../../assets/js/core/registry.js';

const sha = s => createHash('sha256').update(s).digest('hex').slice(0, 16);

// PIN-FIRST reference hashes — ṣaḍbala output captured from the pre-refactor
// engine (git HEAD) and confirmed byte-identical after the R28 surfacing
// refactor. Any future change that perturbs ṣaḍbala will break these.
const SHADBALA_PIN = {
  '1990-05-15T10:30:00.000Z@28.61,77.2': '7f622ad2070d575f',
  '1975-12-02T06:15:00.000Z@19.07,72.87': '4b08d8c2c3208782',
  '2001-08-23T23:45:00.000Z@51.51,-0.13': '6472c9a3e603c194',
};

// Build a synthetic castVedic-shaped reading with EXACT sidereal placements, so
// yoga vectors are deterministic and independent of ayanāṁśa/date. `placements`
// maps a graha → { sign:0..11, deg?, dignity?, retro? }.
const STATE = { own: 'Own sign', exalted: 'Exalted', debilitated: 'Debilitated', moolatrikona: 'Mūlatrikoṇa', neutral: 'Neutral' };
function synthReading({ lagnaSign, placements, paksha = 'Śukla (waxing)' }) {
  const grahas = {};
  for (const g of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    const p = placements[g] || { sign: 0, deg: 0 };
    const lon = ((p.sign % 12) * 30 + (p.deg || 0) + 360) % 360;
    grahas[g] = {
      lon, rashiIndex: p.sign % 12, deg: p.deg || 0,
      retrograde: !!p.retro,
      dignity: { state: STATE[p.dignity || 'neutral'] },
    };
  }
  return {
    grahas,
    lagna: { rashiIndex: lagnaSign, lord: RASHIS[lagnaSign].lord },
    panchanga: { tithi: { paksha } },
  };
}

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. data module: yoga-rules counts & shape --------------------------
  ok(YOGA_RULES.length === 36, `YOGA_RULES has 36 records (got ${YOGA_RULES.length})`);
  ok(YOGA_META.recordCount === 36, 'YOGA_META.recordCount === 36');
  ok(new Set(YOGA_RULES.map(r => r.id)).size === 36, 'yoga ids are unique');
  ok(YOGA_RULES.every(r => r.conditions && r.conditions.length && r.fruit && r.sources), 'every yoga has conditions/fruit/sources');
  ok(YOGA_RULES.every(r => YOGA_FAMILIES[r.family]), 'every yoga family has a YOGA_FAMILIES description');
  ok(YOGA_RULES.filter(r => r.contested && r.contested.flag).length === 15, 'exactly 15 contested yoga records');
  // verbatim spot-checks vs the byte-locked source (pin distinctive substrings)
  const gaja = YOGA_RULES.find(r => r.id === 'gaja-kesari');
  ok(gaja.sources[0] === 'Phaladipika (tr. Sareen) 6.14 (bare definition, sharing the verse with Shakata; effects at 6.16)', 'gaja-kesari source[0] verbatim');
  ok(gaja.contested.positions.length === 4, 'gaja-kesari carries 4 contested positions');
  const harsha = YOGA_RULES.find(r => r.id === 'harsha');
  ok(/Phaladipika \(tr\. Sareen\) 6\.57/.test(harsha.sources[0]) && /6\.63/.test(harsha.sources[0]), 'Harṣa cites Phaladīpikā 6.57/6.63 (corrected loci, not BPHS 36)');
  const kala = YOGA_RULES.find(r => r.id === 'kala-sarpa');
  ok(kala.family === 'modern' && /Absent from BPHS/.test(kala.sources[0]), 'Kāla-Sarpa flagged modern with the absence citation');

  // ---- 2. data module: bhava-phala counts & shape -------------------------
  ok(BHAVA_PHALA.length === 108, `BHAVA_PHALA has 108 records (got ${BHAVA_PHALA.length})`);
  ok(BHAVA_PHALA_META.recordCount === 108, 'BHAVA_PHALA_META.recordCount === 108');
  const GR = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  ok(GR.every(g => BHAVA_PHALA.filter(r => r.graha === g).length === 12), 'every graha has exactly 12 bhāva records');
  ok(new Set(BHAVA_PHALA.map(r => `${r.graha}/${r.bhava}`)).size === 108, 'no dangling / duplicate (graha,bhava) keys');
  ok(BHAVA_PHALA.every(r => r.phaladipika.locus && r.phaladipika.summary), 'every record has a Phaladīpikā witness');
  // nodes are single-witness with an honest absence note
  const nodeRecs = BHAVA_PHALA.filter(r => r.graha === 'Rahu' || r.graha === 'Ketu');
  ok(nodeRecs.length === 24 && nodeRecs.every(r => r.saravali.locus === null && r.saravali.note && r.agreement === null), 'all 24 node records are single-witness (Sārāvalī absent, agreement null)');
  ok(BHAVA_PHALA.filter(r => r.saravali.locus != null).every(r => r.agreement), 'two-witness records all carry an agreement class');
  // verbatim spot-checks
  ok(bhavaPhala('Sun', 1).phaladipika.locus === '8.1', 'Sun/1 Phaladīpikā locus 8.1');
  ok(bhavaPhala('Sun', 1).phaladipika.summary.startsWith('The Sun rising gives scanty hair'), 'Sun/1 Phaladīpikā summary verbatim opening');
  ok(bhavaPhala('Sun', 11).agreement === 'contradict', 'Sun/11 is the flagged contradiction');
  ok(bhavaPhala('Saturn', 1).saravali.locus === '30.74', 'Saturn/1 Sārāvalī locus 30.74');
  ok(bhavaPhala('Rahu', 1).saravali.note && /no Rāhu bhava|node/i.test(bhavaPhala('Rahu', 1).saravali.note), 'Rahu/1 absence note present');

  // ---- 3. yogaStats --------------------------------------------------------
  const stats = yogaStats();
  ok(stats.total === 36 && stats.contested === 15, 'yogaStats totals');
  ok(stats.byFamily.mahapurusha === 5 && stats.byFamily.raja === 8 && stats.byFamily.lunar === 8, 'yogaStats family counts');

  // ---- 4. detector: real reading is well-formed ---------------------------
  const v = castVedic(castChart(new Date(Date.UTC(1990, 4, 15, 10, 30)), 28.61, 77.2, 'regiomontanus'));
  const yy = detectYogas(v);
  ok(yy.length === 36, `detectYogas returns all 36 rules (got ${yy.length})`);
  ok(yy.every(y => ['met', 'conditional', 'not-met'].includes(y.status)), 'every result has a valid status');
  ok(yy.every(y => Array.isArray(y.conditionResults) && y.conditionResults.length), 'every result carries its conditionResults');
  // THE load-bearing rule: contested yogas NEVER emit a bare met, and ALWAYS carry positions
  const contested = yy.filter(y => y.rule.contested && y.rule.contested.flag);
  ok(contested.length === 15, '15 contested results present');
  ok(contested.every(y => y.status !== 'met'), 'no contested yoga is ever reported "met" (never a bare boolean)');
  ok(contested.every(y => Array.isArray(y.positions) && y.positions.length >= 2), 'every contested yoga surfaces ≥2 positions');
  ok(contested.every(y => y.contestedNote), 'every contested yoga carries a contestedNote');
  ok(detectYogas(v).every(y => y.sensitiveNote !== undefined), 'sensitiveNote is surfaced (null where absent)');

  // ---- 5. VECTOR: Gaja-Kesarī conditioned MET but bare NOT-MET -------------
  // Lagna Gemini(2); Jupiter own in Pisces(11) = 10th from Lagna (kendra) but
  // 12th from Moon in Aries(0) (NOT a kendra from the Moon); Venus conjoins
  // Jupiter (benefic association); Sun far → Jupiter not combust.
  const gk = synthReading({
    lagnaSign: 2,
    placements: {
      Sun: { sign: 2, deg: 10 }, Moon: { sign: 0, deg: 5 }, Mars: { sign: 4, deg: 10 },
      Mercury: { sign: 2, deg: 20 }, Jupiter: { sign: 11, deg: 15, dignity: 'own' },
      Venus: { sign: 11, deg: 16 }, Saturn: { sign: 8, deg: 10 },
      Rahu: { sign: 3, deg: 0 }, Ketu: { sign: 9, deg: 0 },
    },
  });
  const gkRes = detectYogas(gk).find(y => y.id === 'gaja-kesari');
  const barePos = gkRes.positions.find(p => /Bare rule/.test(p.label));
  const condPos = gkRes.positions.find(p => /Conditioned rule/.test(p.label));
  ok(barePos && barePos.outcome === 'not-met', 'Gaja-Kesarī BARE (Phaladīpikā 6.14) is not-met here');
  ok(condPos && condPos.outcome === 'met', 'Gaja-Kesarī CONDITIONED (BPHS 36.3–4) IS met here');
  ok(gkRes.status === 'not-met', 'the bare trigger fails so the headline status is not-met — but both positions are shown');

  // ---- 6. VECTOR: Kāla-Sarpa sign-based MET but degree-based NOT-MET -------
  // Rāhu Aries 25°, Ketu Libra 25°; Saturn Aries 20° sits in Rāhu's sign (sign
  // arc OK) but 5° BEHIND Rāhu by longitude (outside the 180° forward arc).
  const ks = synthReading({
    lagnaSign: 0,
    placements: {
      Sun: { sign: 1, deg: 10 }, Moon: { sign: 2, deg: 10 }, Mars: { sign: 3, deg: 10 },
      Mercury: { sign: 4, deg: 10 }, Jupiter: { sign: 5, deg: 10 }, Venus: { sign: 6, deg: 5 },
      Saturn: { sign: 0, deg: 20 }, Rahu: { sign: 0, deg: 25 }, Ketu: { sign: 6, deg: 25 },
    },
  });
  const ksRes = detectYogas(ks).find(y => y.id === 'kala-sarpa');
  const signPos = ksRes.positions.find(p => /Sign-based/.test(p.label));
  const degPos = ksRes.positions.find(p => /Degree-based/.test(p.label));
  ok(signPos && signPos.outcome === 'met', 'Kāla-Sarpa SIGN-based hemming is met (all seven in the nodal signs)');
  ok(degPos && degPos.outcome === 'not-met', 'Kāla-Sarpa DEGREE-based hemming is not-met (Saturn behind Rāhu)');
  ok(ksRes.kalaSarpa && ksRes.kalaSarpa.signArc.length === 7, 'Kāla-Sarpa reports the 7-sign arc');
  ok(ksRes.status === 'conditional', 'Kāla-Sarpa is reported conditional (both modes surfaced, neither resolved)');

  // ---- 7. VECTOR: a clean Pañca-Mahāpuruṣa (Ruchaka) ----------------------
  // Lagna Aries(0); Mars in own sign Aries in the 1st (a kendra) → Ruchaka met.
  const ruc = synthReading({
    lagnaSign: 0,
    placements: {
      Sun: { sign: 5, deg: 10 }, Moon: { sign: 7, deg: 10 }, Mars: { sign: 0, deg: 10, dignity: 'own' },
      Mercury: { sign: 5, deg: 10 }, Jupiter: { sign: 8, deg: 10 }, Venus: { sign: 6, deg: 10 },
      Saturn: { sign: 10, deg: 10 }, Rahu: { sign: 2, deg: 0 }, Ketu: { sign: 8, deg: 0 },
    },
  });
  ok(detectYogas(ruc).find(y => y.id === 'ruchaka').status === 'met', 'Ruchaka (Mars own in a kendra) is met');

  // ---- 8. VECTOR: Kemadruma cancellation is evaluated (not a bare boolean) -
  // A graha in a kendra from the Moon breaks the isolation — the detector must
  // report the cancellation, not silently claim the yoga.
  const kem = detectYogas(v).find(y => y.id === 'kemadruma');
  ok(Array.isArray(kem.cancellations) && kem.cancellations.length === 4, 'Kemadruma carries its 4 cancellation clauses');
  ok(kem.cancellations.filter(c => c.status === 'classical').length === 3, 'three classical Kemadruma cancellations, one modern');

  // ---- 9. surfacing exports -----------------------------------------------
  const cr = compoundRelations(v);
  ok(cr.matrix.Sun.Mars && ['friend', 'enemy', 'neutral'].includes(cr.matrix.Sun.Mars.natural), 'compoundRelations gives natural relation');
  ok(['great friend', 'friend', 'neutral', 'enemy', 'great enemy'].includes(cr.matrix.Sun.Moon.compound), 'compoundRelations gives a five-fold compound label');
  ok(typeof cr.matrix.Sun.Moon.tierVirupa === 'number', 'compoundRelations carries the saptavargaja tier virūpa');
  const gd = grahaDrishti(v);
  ok(gd.grahas.length === 9 && gd.modes.includes('sphuta'), 'grahaDrishti is a 9-graha grid with the sphuṭa mode');
  ok(gd.grid.Sun.Moon !== undefined && gd.grid.Moon.Sun !== undefined, 'grahaDrishti grid populated for every ordered pair');
  // deterministic drishti geometry on a synthetic reading: Sun→7th sign (full),
  // Mars→4th sign (special), Venus→4th sign (partial, no special aspect).
  const dz = synthReading({
    lagnaSign: 0,
    placements: {
      Sun: { sign: 0, deg: 0 }, Moon: { sign: 6, deg: 0 }, Mars: { sign: 0, deg: 0 },
      Mercury: { sign: 3, deg: 0 }, Jupiter: { sign: 8, deg: 0 }, Venus: { sign: 0, deg: 0 },
      Saturn: { sign: 9, deg: 0 }, Rahu: { sign: 1, deg: 0 }, Ketu: { sign: 7, deg: 0 },
    },
  });
  const dzg = grahaDrishti(dz).grid;
  ok(dzg.Sun.Moon.houseDist === 7 && dzg.Sun.Moon.full && dzg.Sun.Moon.type === 'full', 'Sun casts the full 7th aspect on the Moon (7 signs away)');
  ok(dzg.Mars.Mercury.houseDist === 4 && dzg.Mars.Mercury.special && dzg.Mars.Mercury.full, 'Mars casts its special 4th aspect (full)');
  ok(dzg.Venus.Mercury.houseDist === 4 && !dzg.Venus.Mercury.special && !dzg.Venus.Mercury.full, 'Venus has NO special 4th aspect (partial only)');
  const cb = combustion(v);
  ok(!('Sun' in cb.perGraha) && cb.notApplicable.includes('Sun'), 'combustion excludes the Sun (the source) and the nodes');
  ok(Object.keys(cb.perGraha).length === 6 && Object.values(cb.perGraha).every(x => typeof x.is === 'boolean' && typeof x.sep === 'number'), 'combustion gives a per-graha {is,sep,arc} for the 6 grahas');
  ok(cb.contested === true, 'combustion arcs flagged contested');
  // retrograde arc actually used when a graha is retrograde
  const cbR = combustion(synthReading({ lagnaSign: 0, placements: { Sun: { sign: 0, deg: 0 }, Mercury: { sign: 0, deg: 13, retro: true } } }));
  ok(cbR.perGraha.Mercury.arc === 12 && cbR.perGraha.Mercury.usingRetroArc, 'retrograde Mercury uses the 12° combustion arc');

  // ---- 10. PIN-FIRST: ṣaḍbala byte-equality across the refactor ------------
  const pinCharts = [
    [new Date(Date.UTC(1990, 4, 15, 10, 30)), 28.61, 77.2],
    [new Date(Date.UTC(1975, 11, 2, 6, 15)), 19.07, 72.87],
    [new Date(Date.UTC(2001, 7, 23, 23, 45)), 51.51, -0.13],
  ];
  for (const [d, la, lo] of pinCharts) {
    const key = `${d.toISOString()}@${la},${lo}`;
    const h = sha(JSON.stringify(castVedic(castChart(d, la, lo, 'regiomontanus')).shadbala));
    ok(h === SHADBALA_PIN[key], `ṣaḍbala pin holds for ${key} (got ${h}, want ${SHADBALA_PIN[key]})`);
  }

  // ---- 11. registry: the three new entries resolve ------------------------
  for (const [id, callable] of [['yoga-detector', true], ['bhava-phala', true], ['vedic-graha-bala', false]]) {
    const e = REGISTRY.find(x => x.id === id);
    ok(e && e.callable === callable, `registry[${id}] present with callable:${callable}`);
    if (e) {
      const mod = await import('../../' + e.module);
      ok(e.exportName in mod && (e.exports || []).every(x => x in mod), `registry[${id}] exports resolve`);
    }
  }

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptors (integrator wires into browser-verify) --
// The V1 engines are pure/data; their UI lands on the Vedic wing (V2). This
// descriptor asserts the host page loads clean once the tools are wired.
export const DRIVES = [
  {
    page: 'pages/vedic/index.html',
    actions: ['compute'],
    asserts: [
      'no console error / pageerror',
      'the reading renders (grahas table present)',
    ],
  },
];

export default { run, DRIVES };
