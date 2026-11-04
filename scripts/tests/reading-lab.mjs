import assert from 'node:assert/strict';
import { READING_FRAMEWORKS, normalizeReadingLabInputs, calculateReadingLab, calculateMayaDate, evaluateReadingCase, compareReadingCases, exportReadingLab, exportReadingCase } from '../../assets/js/core/reading-lab.js';
import { READING_CASES } from '../../assets/js/core/data/reading-cases.js';
import { panchangaFromLongitudes } from '../../assets/js/core/vedic.js';
import { WORKED_CHARTS } from '../../assets/js/core/data/worked-charts.js';

let assertions = 0;
const eq = (a, b, message) => { assert.deepEqual(a, b, message); assertions++; };
const ok = (value, message) => { assert.ok(value, message); assertions++; };
const fail = (fn, matcher) => { assert.throws(fn, matcher); assertions++; };
const base = { dateISO: '2024-03-20', timeZone: 'UTC' };
eq(READING_FRAMEWORKS.map(r => r.id), ['egyptian', 'mayan', 'dee', 'lilly', 'vedic', 'chinese', 'hebrew', 'jung', 'plato']);
for (const bad of [null, [], 'today', { ...base, hidden: 1 }, { ...base, dateISO: '2024-02-30' }, { ...base, dateISO: '1900-02-29' }, { ...base, time: '' }, { ...base, time: '25:00' }, { ...base, timeZone: 'Mars/Olympus' }, { ...base, frameworks: [] }, { ...base, frameworks: ['maya'] }, { ...base, frameworks: ['mayan', 'mayan'] }, { ...base, lat: 0 }, { ...base, lat: NaN, lon: 0 }, { ...base, lat: 91, lon: 0 }, { ...base, lat: 0, lon: 181 }, { ...base, system: 'invented' }, { ...base, purpose: 'war' }, { ...base, disambiguation: 'compatible' }, { ...base, dateISO: '1899-12-31' }, { ...base, dateISO: '2101-01-01' }, { ...base, instantISO: '2024-03-20T00:00:00Z' }]) fail(() => normalizeReadingLabInputs(bad));
let getterRan = false;
const getter = { ...base }; Object.defineProperty(getter, 'time', { enumerable: true, get() { getterRan = true; return '12:00'; } });
fail(() => normalizeReadingLabInputs(getter)); eq(getterRan, false);
fail(() => normalizeReadingLabInputs(Object.assign(Object.create({ inherited: true }), base)));
fail(() => normalizeReadingLabInputs({ ...base, frameworks: new Array(1) }));
const arrayGetter = []; Object.defineProperty(arrayGetter, '0', { get() { getterRan = true; return 'mayan'; } });
fail(() => normalizeReadingLabInputs({ ...base, frameworks: arrayGetter })); eq(getterRan, false);
const customIterator = ['mayan']; customIterator[Symbol.iterator] = () => { getterRan = true; return [][Symbol.iterator](); };
fail(() => normalizeReadingLabInputs({ ...base, frameworks: customIterator })); eq(getterRan, false);
eq(normalizeReadingLabInputs({ ...base, dateISO: '2000-02-29' }).dateISO, '2000-02-29');
fail(() => normalizeReadingLabInputs({ ...base, dateISO: '2100-02-29' }));
fail(() => normalizeReadingLabInputs({ dateISO: '2011-12-30', timeZone: 'Pacific/Apia' }), /does not exist/);
const shortDay = calculateReadingLab({ dateISO: '2018-11-04', timeZone: 'America/Sao_Paulo', frameworks: ['hebrew'] });
eq(shortDay.context.timeKnown, false); eq(shortDay.context.instantISO, null);
for (const disambiguation of ['reject', 'earlier', 'later']) fail(() => normalizeReadingLabInputs({ dateISO: '2024-03-10', time: '02:30', timeZone: 'America/New_York', disambiguation }), /does not exist/);
fail(() => normalizeReadingLabInputs({ dateISO: '2024-11-03', time: '01:30', timeZone: 'America/New_York' }), /occurs twice/);
const fold = ['earlier', 'later'].map(disambiguation => calculateReadingLab({ dateISO: '2024-11-03', time: '01:30', timeZone: 'America/New_York', disambiguation, frameworks: ['mayan'] }));
eq(new Date(fold[1].context.instantISO) - new Date(fold[0].context.instantISO), 3600000);
ok(fold.every(r => r.context.ambiguous)); eq(fold[0].frameworks.mayan.facts, fold[1].frameworks.mayan.facts);

// External worked fixture: Smithsonian NMAI, Reading the Maya Calendar:
// 20 Dec 2012, 12.19.19.17.19, 3 Kawak, 2 K'ank'in. No generated gold values.
const smithsonian = calculateMayaDate('2012-12-20');
eq(smithsonian.longCount, '12.19.19.17.19'); eq(smithsonian.tzolkin, { number: 3, name: 'Kawak' }); eq(smithsonian.haab.day, 2); eq(smithsonian.haab.month, 'K’ank’in');
eq(calculateMayaDate('2012-12-21').longCount, '13.0.0.0.0');
eq(calculateMayaDate('-003113-08-11').longCount, '0.0.0.0.0');
eq(calculateMayaDate('-003113-08-11').tzolkin, { number: 4, name: 'Ajaw' });
eq(calculateMayaDate('-003113-08-11').haab.day, 8);
fail(() => calculateMayaDate('-003113-08-10'));
fail(() => calculateMayaDate('+010000-01-01'));
eq(calculateReadingLab({ dateISO: '-003113-08-11', timeZone: 'UTC', frameworks: ['mayan'] }).context.timeKnown, false);
fail(() => calculateReadingLab({ dateISO: '-003113-08-11', timeZone: 'UTC' }));
eq(calculateMayaDate('0000-02-29').dateISO, '0000-02-29'); // astronomical year zero, not 0 CE
// Independent elapsed-day arithmetic via ECMAScript Date, not the JDN engine.
for (let offset = -900; offset <= 900; offset++) {
  const dateISO = new Date(Date.UTC(2012, 11, 20) + offset * 86400000).toISOString().slice(0, 10), m = calculateMayaDate(dateISO);
  eq(m.daysSinceEpoch - smithsonian.daysSinceEpoch, offset);
  const u = m.units; eq(u.baktun * 144000 + u.katun * 7200 + u.tun * 360 + u.uinal * 20 + u.kin, m.daysSinceEpoch);
  ok(u.katun >= 0 && u.katun < 20 && u.tun >= 0 && u.tun < 20 && u.uinal >= 0 && u.uinal < 18 && u.kin >= 0 && u.kin < 20);
  ok(m.tzolkin.number >= 1 && m.tzolkin.number <= 13 && m.haab.day < (m.haab.monthIndex === 18 ? 5 : 20));
}
const roundAfter = calculateMayaDate(new Date(Date.UTC(2012, 11, 20) + 18980 * 86400000).toISOString().slice(0, 10));
eq(roundAfter.tzolkin, smithsonian.tzolkin); eq(roundAfter.haab, smithsonian.haab);

const dayOnly = calculateReadingLab(base);
eq(dayOnly.context.timeKnown, false); eq(dayOnly.context.instantISO, null); eq(dayOnly.frameworks.lilly.facts.chart, undefined); eq(dayOnly.frameworks.vedic.facts.panchanga, undefined); eq(dayOnly.frameworks.jung.facts.elementTally, undefined);
ok(dayOnly.frameworks.hebrew.limitations.some(s => /Sunset/.test(s)));
eq(dayOnly.frameworks.egyptian.facts.ancientCivil.status, 'unimplemented');
for (const id of ['dee', 'plato']) { eq(dayOnly.frameworks[id].status, 'textual-only'); eq(dayOnly.frameworks[id].facts, {}); }
eq(dayOnly.frameworks.lilly.facts.computus.gregorianEaster, '2024-03-31');
eq(dayOnly.frameworks.lilly.facts.computus.julianEasterGregorian, '2024-05-05');
// External Hebcal (2024-10-03 daytime) and HKO 2024 New Year day.
const hebrew = calculateReadingLab({ dateISO: '2024-10-03', timeZone: 'UTC', frameworks: ['hebrew'] }).frameworks.hebrew.facts;
eq([hebrew.year, hebrew.month, hebrew.day], [5785, 'Tishri', 1]);
const chinese = calculateReadingLab({ dateISO: '2024-02-10', timeZone: 'Asia/Hong_Kong', frameworks: ['chinese'] }).frameworks.chinese.facts;
eq([chinese.relatedYear, chinese.month, chinese.day, chinese.isLeapMonth], [2024, 1, 1, false]);
const chineseLeap = calculateReadingLab({ dateISO: '2023-03-22', timeZone: 'Asia/Hong_Kong', frameworks: ['chinese'] }).frameworks.chinese.facts;
eq([chineseLeap.relatedYear, chineseLeap.month, chineseLeap.day, chineseLeap.isLeapMonth], [2023, 2, 1, true]);
// Civil-midnight implementation must not silently claim a sunset date.
const hEvening = ['12:00', '23:00'].map(time => calculateReadingLab({ dateISO: '2024-10-03', time, timeZone: 'Asia/Jerusalem', frameworks: ['hebrew'] }).frameworks.hebrew.facts);
eq([hEvening[0].year, hEvening[0].month, hEvening[0].day], [hEvening[1].year, hEvening[1].month, hEvening[1].day]);
for (const dateISO of ['1900-01-01', '2100-12-31']) for (const timeZone of ['Pacific/Kiritimati', 'Etc/GMT+12', 'Asia/Kolkata']) {
  const row = calculateReadingLab({ dateISO, timeZone, frameworks: ['hebrew', 'chinese', 'egyptian'] });
  eq(row.context.dateISO, dateISO); ok(Object.values(row.frameworks).every(f => f.status === 'partial'));
}
// Published longitude arithmetic, P.V.R. Narasimha Rao, An Integrated Approach,
// Example 2 p.14: Sun 227°46', Moon84°12', elongation216°26', tithi19.
const p = panchangaFromLongitudes(227 + 46 / 60, 84 + 12 / 60); eq(p.tithi.num, 19); eq(p.vara.lord, null);
for (let tithi = 1; tithi <= 30; tithi++) {
  eq(panchangaFromLongitudes(0, (tithi - 1) * 12).tithi.num, tithi);
  eq(panchangaFromLongitudes(0, tithi * 12 - 1e-7).tithi.num, tithi);
}
for (const lon of [-1, 360, NaN, Infinity, '20']) fail(() => panchangaFromLongitudes(lon, 12));

const equinox = { instantISO: '2024-03-20T03:06:00Z', timeZone: 'Europe/London', lat: 51.5074, lon: -0.1278 };
const now = calculateReadingLab(equinox), chart = now.frameworks.lilly.facts.chart;
ok(Math.min(chart.planets.Sun.longitude, 360 - chart.planets.Sun.longitude) < 0.02, 'Public equinox fixture: tropical Sun close to 0 Aries');
eq(chart.houses.length, 12); eq(Object.keys(chart.planets).length, 7);
eq(Object.values(now.frameworks.jung.facts.elementTally).reduce((a, b) => a + b, 0), 10);
eq(now.frameworks.vedic.facts.tithiNumber, Math.floor(now.frameworks.vedic.facts.elongationDegrees / 12) + 1);
eq(calculateReadingLab({ instantISO: equinox.instantISO, timeZone: 'UTC', frameworks: ['lilly'] }).frameworks.lilly.facts.chart, undefined);
const pole = calculateReadingLab({ ...equinox, lat: 90 }); eq(pole.frameworks.lilly.facts.chart, undefined); eq(pole.frameworks.chinese.status, 'partial');
const polar = calculateReadingLab({ ...equinox, lat: 78, system: 'placidus' });
eq(polar.frameworks.lilly.facts.chart.actualSystem, 'regiomontanus'); ok(polar.warnings.some(s => /Placidus/.test(s)));
// Deterministic grid checks geometry, methods and finite quantities. These are
// invariants, explicitly separate from independent source accuracy fixtures.
let chartCasts = 0;
for (const year of [1900, 2000, 2100]) for (const lat of [-65, 0, 65]) for (const system of ['regiomontanus', 'placidus', 'whole', 'equal']) {
  const row = calculateReadingLab({ dateISO: `${year}-06-21`, time: '12:00', timeZone: 'UTC', lat, lon: 15, system, frameworks: ['lilly', 'vedic', 'jung'] });
  const c = row.frameworks.lilly.facts.chart; chartCasts++;
  eq(c.actualSystem, system); ok(c.houses.every(v => Number.isFinite(v) && v >= 0 && v < 360));
  for (const p of Object.values(c.planets)) { ok(Number.isFinite(p.longitude) && p.longitude >= 0 && p.longitude < 360); ok(p.house >= 1 && p.house <= 12); }
  ok(row.frameworks.vedic.facts.tithiNumber >= 1 && row.frameworks.vedic.facts.tithiNumber <= 30);
}

ok(READING_CASES.length >= 9 && READING_CASES.length <= 24);
for (const c of READING_CASES) {
  const evaluated = evaluateReadingCase(c.id);
  eq(evaluated.outcomeEvaluable, false);
  eq(evaluated.matched, evaluated.total, `${c.id}: ${JSON.stringify(evaluated.checks.filter(c => !c.match))}`);
  for (const check of evaluated.checks) { ok(!check.missing); ok(typeof check.basis === 'string' && check.basis.length > 0); }
  if (!evaluated.total) eq(evaluated.status, 'not-numerically-evaluable');
}
const comparison = compareReadingCases();
eq(comparison.matchedFields, comparison.referenceFields); eq(comparison.outcomeEvaluable, false);
fail(() => evaluateReadingCase('unregistered')); fail(() => compareReadingCases([])); fail(() => compareReadingCases(Array(25).fill(READING_CASES[0].id)));
fail(() => compareReadingCases([READING_CASES[0].id, READING_CASES[0].id]), /duplicate|distinct/);
fail(() => compareReadingCases([READING_CASES[0], { id: READING_CASES[0].id }]), /duplicate|distinct/);
fail(() => compareReadingCases(new Array(1)));
const caseGetter = { get id() { getterRan = true; return READING_CASES[0].id; } };
fail(() => evaluateReadingCase(caseGetter)); eq(getterRan, false);
eq(JSON.stringify(calculateReadingLab(equinox)), JSON.stringify(now));
const compact = exportReadingLab(equinox);
ok(new TextEncoder().encode(JSON.stringify(compact)).length <= 25000);
for (const id of Object.keys(now.frameworks)) eq(compact.frameworks[id].facts, now.frameworks[id].facts, 'Compact export must preserve computed facts');
for (const c of READING_CASES) { const report = exportReadingCase(c.id); ok(new TextEncoder().encode(JSON.stringify(report)).length <= 25000); eq(report.checks, evaluateReadingCase(c.id).checks); }
fail(() => exportReadingLab({ ...equinox, facts: { fake: true } }));
// The new source check changes the old worked-chart surface too: verified
// longitudes are shown, but known-unverified angles cannot drive a judgment.
const dog = evaluateReadingCase('lilly-dog-printed-figure');
eq(dog.matched, 4); eq(dog.total, 4);
eq(dog.result.frameworks.lilly.status, 'partial-source-reconstruction');
eq(dog.result.frameworks.lilly.facts.chart.ascendant, undefined);
for (const p of Object.values(dog.result.frameworks.lilly.facts.chart.planets)) { eq(p.house, undefined); eq(p.dignity, undefined); eq(p.retrograde, undefined); }
eq(dog.result.frameworks.lilly.facts.chart.planets.Mercury.longitudeVerification, 'printed-field-checked');
eq(dog.result.frameworks.lilly.facts.chart.planets.Venus.longitudeVerification, 'inherited-unverified');
eq(WORKED_CHARTS.filter(c => c.verification?.status === 'partial-source-check').map(c => c.key), ['dog']);
ok(dog.result.warnings.some(s => /partial reconstruction/.test(s)));
// Exercise the actual public page initializer with a minimal DOM sink; this
// catches accidental restoration of an overall verdict despite partial data.
const originalDocument = globalThis.document, sections = [];
try {
  globalThis.document = { getElementById: id => id === 'wc-list' ? { appendChild: node => sections.push(node) } : null, createElement: () => ({ style: {}, innerHTML: '', querySelector: () => null }) };
  const { initWorkedCharts } = await import('../../assets/js/app/worked-charts.js');
  initWorkedCharts();
  eq(sections.length, WORKED_CHARTS.length);
  const dogHTML = sections.find(s => s.id === 'wc-dog').innerHTML;
  ok(dogHTML.includes('Partial reconstruction · four printed positions checked'));
  ok(dogHTML.includes('chart wheel, dignity ledger and automated full judgment are withheld'));
  ok(!dogHTML.includes('The engine reads the same figure'));
  ok(!dogHTML.includes('verdict green') && !dogHTML.includes('wc-wheel-dog'));
  eq((dogHTML.match(/Printed longitude checked/g) ?? []).length, 4);
  eq((dogHTML.match(/Inherited; unverified/g) ?? []).length, 3);
  ok(dogHTML.includes('Lilly’s reported outcome'));
  ok(sections.find(s => s.id === 'wc-marriage').innerHTML.includes('wc-wheel-marriage'));
} finally { if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument; }
console.log(JSON.stringify({ status: 'pass', assertions, chartCasts, cases: READING_CASES.length, referenceFields: comparison.referenceFields, fullExampleBytes: JSON.stringify(now).length }));
