import { pathToFileURL } from 'node:url';
import { ORACLE_MCP_TOOLS } from '../../mcp/oracle-adapters.mjs';
import { castFromTallies, geomanticJudgement, geomancyHouses } from '../../assets/js/core/geomancy.js';
import { tarotReading, SPREADS } from '../../assets/js/core/tarot.js';
import { DECK_IDS } from '../../assets/js/core/data/tarot-deck.js';
import { linesFromThrows, castReading } from '../../assets/js/core/iching.js';
import { castFromDraws } from '../../assets/js/core/runes.js';
import { jungianReading, crossAspects, jungAspectHits, aeonClock, JUNG_EXPERIMENT } from '../../assets/js/core/jung.js';
import { castChart } from '../../assets/js/core/astro.js';
import { prayerFor } from '../../assets/js/core/data/picatrix-prayers.js';
import { mansionImage } from '../../assets/js/core/data/mansion-images.js';
import { planetImage } from '../../assets/js/core/data/planet-images.js';
import { WORKED_CHARTS } from '../../assets/js/core/data/worked-charts.js';

export async function run() {
  let count = 0; const failures = [];
  const ok = (test, label) => { count++; if (!test) failures.push(label); };
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const throws = (fn, label) => { try { fn(); ok(false, label); } catch { ok(true, label); } };
  const tool = name => ORACLE_MCP_TOOLS.find(x => x.name === name);
  const call = (name, args) => tool(name).calculate(args);
  const tallies = Array.from({ length: 16 }, (_, i) => i + 1);
  const input = { dateISO: '2026-10-30T12:00:00Z', lat: 51.5, lon: -.12, timeZone: 'Europe/London' };
  const valid = {
    workbench_geomancy: { tallies, quesitedHouse: 7 },
    workbench_tarot: { spreadKey: 'single', draws: [{ id: 'the-fool', reversed: false }] },
    workbench_iching: { throws: [6, 7, 8, 9, 7, 8] },
    workbench_runes: { indices: [0, 7, 23], methodId: 'three' },
    workbench_jung: input,
    workbench_source_lookup: { capabilityId: 'worked-charts', id: 'stolen-fish' },
  };
  ok(ORACLE_MCP_TOOLS.length === 6 && new Set(ORACLE_MCP_TOOLS.map(x => x.name)).size === 6 && ORACLE_MCP_TOOLS.every(t => t.inputSchema.additionalProperties === false), 'Six fixed, distinct adapters with closed object schemas');
  for (const [name, args] of Object.entries(valid)) {
    const r = call(name, args);
    ok(r.capabilityId && r.source && r.sourceStatus.includes('not a new') && r.limitations.some(x => x.includes('not a forecast')) && JSON.stringify(r).length < 200000, name + ' returns bounded source-qualified output');
    throws(() => call(name, { ...args, chart: { forged: true } }), name + ' rejects supplied chart/undeclared data');
    throws(() => call(name, { ...args, question: 'PRIVATE QUESTION' }), name + ' does not implicitly accept or export private free text');
    throws(() => call(name, null), name + ' rejects non-object input');
    throws(() => call(name, Object.assign(Object.create({ inherited: true }), args)), name + ' rejects a custom prototype');
  }
  for (const quesitedHouse of [1, 7, 12]) {
    const r = call('workbench_geomancy', { tallies, quesitedHouse }), s = castFromTallies(tallies);
    ok(eq(r.result, { shield: s, houses: geomancyHouses(s), judgement: geomanticJudgement(s, quesitedHouse, { querentHouse: 1 }) }), `Geomancy canonical parity with topic house ${quesitedHouse}`);
    ok(r.result.shield.judge.points % 2 === 0 && r.randomDrawPerformed === false, 'Geomantic even-Judge checksum with no random draw');
  }
  const rotated = call('workbench_geomancy', { tallies, quesitedHouse: 4, querentHouse: 10 });
  ok(rotated.result.judgement.querentHouse === 10 && rotated.result.judgement.quesitedHouse === 4, 'Explicit querent/topic houses preserved without clamp/coercion');
  for (const patch of [{ tallies: tallies.slice(1) }, { tallies: [...tallies, 17] }, { tallies: [0, ...tallies.slice(1)] }, { tallies: [-1, ...tallies.slice(1)] }, { tallies: [1.5, ...tallies.slice(1)] }, { tallies: ['1', ...tallies.slice(1)] }, { tallies: [1000001, ...tallies.slice(1)] }, { quesitedHouse: 13 }, { querentHouse: 0 }]) throws(() => call('workbench_geomancy', { ...valid.workbench_geomancy, ...patch }), 'Reject invalid geomantic tally/house ' + JSON.stringify(patch));
  for (const [spreadKey, spread] of Object.entries(SPREADS)) {
    const draws = DECK_IDS.slice(0, spread.count).map((id, i) => ({ id, reversed: i % 2 === 1 }));
    const r = call('workbench_tarot', { spreadKey, draws });
    ok(eq(r.result, tarotReading(spreadKey, draws)), `Tarot canonical parity: ${spreadKey}`);
    if (spreadKey === 'celticCross') ok(r.inputs.draws[1].reversed === true && r.result.cards[1].reversed === false && r.reversalConvention.includes('upright'), 'Celtic crossing reversal override remains explicit and reproducible');
  }
  for (const draws of [[{ id: 'the-fool', reversed: 'false' }], [{ id: 'the-fool' }], [{ id: 'unknown', reversed: false }], [{ id: 'the-fool', reversed: false, privateNote: 'SECRET' }], new Array(1)]) throws(() => call('workbench_tarot', { spreadKey: 'single', draws }), 'Tarot rejects malformed, private or sparse draw');
  throws(() => call('workbench_tarot', { spreadKey: 'three', draws: Array.from({length: 3}, () => ({ id: 'the-fool', reversed: false })) }), 'Tarot rejects duplicate card identifiers, not only duplicate object identity');
  throws(() => call('workbench_tarot', { spreadKey: 'three', draws: valid.workbench_tarot.draws }), 'Tarot rejects mismatched spread length');
  for (const lineThrows of [[7,7,7,7,7,7], [8,8,8,8,8,8], [6,9,6,9,6,9], [6,7,8,9,7,8]]) {
    const mapped = linesFromThrows(lineThrows), r = call('workbench_iching', { throws: lineThrows });
    ok(eq(r.result, castReading(mapped.lines, mapped.changing)) && r.result.movingCount === lineThrows.filter(x => x === 6 || x === 9).length, 'Yijing primary/relating/nuclear/moving-line canonical parity: ' + lineThrows.join(','));
  }
  const noMoving = call('workbench_iching', { throws: [7,8,7,8,7,8] }).result;
  ok(noMoving.relating === null && noMoving.moving.length === 0, 'Stable Yijing draw does not invent a relating hexagram');
  for (const lineThrows of [[6,7,8,9,7], [6,7,8,9,7,8,9], [6,7,8,9,7,'8'], [6,7,8,9,7,10], new Array(6)]) throws(() => call('workbench_iching', { throws: lineThrows }), 'Yijing rejects malformed line throws');
  for (const [methodId, indices] of [['single',[23]], ['three',[0,7,23]], ['tacitus',[1,9,18]]]) {
    const r = call('workbench_runes', { indices, methodId });
    ok(eq(r.result, castFromDraws(indices, methodId)) && r.result.staves.every(x => x.modernMeaning && x.poems), `Runes canonical parity and separate poem/modern meaning: ${methodId}`);
    if (methodId === 'tacitus') ok(r.result.method.dispute && r.result.method.historicity === 'prototype', 'Tacitus attribution dispute is not erased');
  }
  for (const args of [{ indices:[0,0,2],methodId:'three' }, { indices:[24],methodId:'single' }, { indices:[-1],methodId:'single' }, { indices:['1'],methodId:'single' }, { indices:[1,2],methodId:'three' }, { indices:[1],methodId:'tacitus' }, { indices:[1],methodId:'invented' }]) throws(() => call('workbench_runes', args), 'Runes reject invalid indices/method/count ' + JSON.stringify(args));
  const chart = castChart(new Date(input.dateISO), input.lat, input.lon), j = call('workbench_jung', input);
  ok(eq(j.result.reading, jungianReading(chart)) && !('aeonClock' in j.result) && !('synastry' in j.result), 'Jung primary reading parity with optional data absent');
  const partner = { dateISO: '1990-05-05T18:00:00+05:30', lat: 28.61, lon: 77.21, timeZone: 'Asia/Kolkata', system: 'whole' }, pc = castChart(new Date(partner.dateISO), partner.lat, partner.lon, partner.system);
  const pair = call('workbench_jung', { ...input, partner, includeAeonClock: true });
  ok(eq(pair.result.synastry.crossAspects, crossAspects(chart, pc, { orb: JUNG_EXPERIMENT.orb })) && eq(pair.result.synastry.historicalAspectDisplay, jungAspectHits(chart, pc, { orb: JUNG_EXPERIMENT.orb })), 'Jung partner charts and both synastry displays match canonical results');
  ok(eq(pair.result.aeonClock, aeonClock(chart.date)) && pair.result.synastry.outcomeProbability === null && pair.calculationContext.partner.dateISO === '1990-05-05T12:30:00.000Z', 'Aeon uses explicit date, partner offset normalizes, and no outcome probability is inferred');
  const fallback = call('workbench_jung', { ...input, lat: 69.6492, lon: 18.9553, system: 'placidus' });
  ok(fallback.calculationContext.primary.requestedHouseSystem === 'placidus' && fallback.calculationContext.primary.actualHouseSystem === 'regiomontanus' && fallback.calculationContext.primary.houseWarning, 'Jung discloses actual polar house fallback');
  const noZone = call('workbench_jung', { dateISO: input.dateISO, lat: input.lat, lon: input.lon });
  ok(noZone.calculationContext.primary.timeZone === null && noZone.calculationContext.primary.clockConvention.includes('not a guessed'), 'No coordinate-to-zone inference');
  for (const patch of [{ dateISO:'2026-10-30T12:00:00' }, { lat:NaN }, { lat:91 }, { lon:'-.12' }, { timeZone:'Not/AZone' }, { synastryOrb:3 }, { includeAeonClock:'true' }, { partner:{ ...partner, chart:{ forged:true } } }, { partner, synastryOrb:16 }, { timeKnown:false }]) throws(() => call('workbench_jung', { ...input, ...patch }), 'Jung rejects malformed time/location/options/partner ' + JSON.stringify(patch));
  const lookups = [
    ['picatrix-prayers','Sun',prayerFor('Sun')], ['planet-images','Saturn',planetImage('Saturn')],
    ['mansion-images','1',mansionImage(1)], ['mansion-images','22',mansionImage(22)], ['mansion-images','28',mansionImage(28)],
    ...WORKED_CHARTS.map(x => ['worked-charts',x.key,x]),
  ];
  for (const [capabilityId,id,expected] of lookups) {
    const r = call('workbench_source_lookup', { capabilityId,id });
    ok(eq(r.result,expected) && r.staticLookup && r.interpretationScope, `Source record parity: ${capabilityId}/${id}`);
  }
  for (const args of [{capabilityId:'mansion-images',id:'29'}, {capabilityId:'mansion-images',id:'Sun'}, {capabilityId:'mansion-images',id:1}, {capabilityId:'planet-images',id:'stolen-fish'}, {capabilityId:'worked-charts',id:'Sun'}, {capabilityId:'__proto__',id:'Sun'}, {capabilityId:'picatrix-prayers',id:'../../secret'}]) throws(() => call('workbench_source_lookup',args), 'Static lookup rejects wrong-catalogue key, coercion or path input');
  const record = call('workbench_source_lookup',{capabilityId:'mansion-images',id:'22'});record.result.name='MUTATED';
  ok(call('workbench_source_lookup',{capabilityId:'mansion-images',id:'22'}).result.name !== 'MUTATED' && mansionImage(22).name !== 'MUTATED', 'Lookup response cannot mutate the canonical source record');
  const previousRandom = Math.random, previousNow = Date.now;
  try { Math.random=()=>{throw new Error('Unexpected randomness');};Date.now=()=>{throw new Error('Unexpected current clock');}; for(const [name,args]of Object.entries(valid))call(name,args);ok(true,'All six adapters operate without Math.random or current-clock reads'); }
  catch(error){ok(false,error.message);}finally{Math.random=previousRandom;Date.now=previousNow;}
  const savedTZ = process.env.TZ;
  try {process.env.TZ='Pacific/Honolulu';const a=JSON.stringify(call('workbench_jung',{...input,partner,includeAeonClock:true}));process.env.TZ='Asia/Tokyo';ok(a===JSON.stringify(call('workbench_jung',{...input,partner,includeAeonClock:true})),'Jung adapter is independent of host timezone');}
  finally{if(savedTZ===undefined)delete process.env.TZ;else process.env.TZ=savedTZ;}
  return { pass: !failures.length, count, failures };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(`${r.pass?'PASS':'FAIL'} oracle MCP adapters: ${r.count} checks`);r.failures.forEach(x=>console.error(x));process.exitCode=r.pass?0:1;}
