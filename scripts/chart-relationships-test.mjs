// Independent bounded adapter checks. Synthetic angles are fixtures, not observations.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { buildChartRelationshipModel, CHART_RELATIONSHIP_LIMITS } from '../assets/js/core/chart-relationships.js';
import { buildSkySnapshot } from '../assets/js/core/sky-dynamics.js';
import { buildCalendarTimelineFrame } from '../assets/js/core/calendar-timeline.js';
import { relationPresentation, calendarRingColor } from '../assets/js/app/chart-relationships.js';

const ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const angles = { conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 };
const context = { dateISO: '2026-10-30T12:00:00.000Z', lat: 51.5074, lon: -.1278, timeZone: 'Europe/London' };
const wrap = n => (n % 360 + 360) % 360;
// atan2 supplies an independent circular distance oracle, not the adapter's modulo formula.
const distance = (a, b) => Math.abs(Math.atan2(Math.sin((b-a)*Math.PI/180), Math.cos((b-a)*Math.PI/180))*180/Math.PI);
const near = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual-expected) <= tolerance, `${actual} != ${expected}`);
function skyFixture(longitudes, aspectOrb = 3) {
  return { context: { ...context }, bodies: longitudes.map((longitude, i) => ({ id: ids[i], longitude: wrap(longitude), speedDegreesPerDay: i + 1 })), aspects: [], aspectOrb, sources: [] };
}
function pairFixture(type, separation, allowance = 3, rotation = 0) {
  const sky = skyFixture([rotation, rotation+separation], allowance);
  const actual = distance(sky.bodies[0].longitude, sky.bodies[1].longitude);
  // Rounding only removes trig noise in fixtures with exactly representable angles.
  const sep = Math.abs(actual-Math.round(actual)) < 1e-12 ? Math.round(actual) : actual;
  sky.aspects = [{ bodyA: 'Sun', bodyB: 'Moon', type, angle: angles[type], separation: sep, orb: Math.abs(sep-angles[type]), allowedOrb: allowance, applying: false }];
  return sky;
}
const geometric = model => model.relations.filter(r => r.methodId === 'geometry');

export async function run() {
  let count = 0, syntheticCases = 0; const failures = [];
  const check = (label, fn) => { count++; try { fn(); } catch (e) { failures.push(label + ': ' + e.message); } };
  check('Source-only state honestly makes every method unavailable', () => {
    const result = buildChartRelationshipModel(); assert.equal(result.context, null); assert.equal(result.relations.length, 0); assert.ok(result.methods.every(m => !m.available && m.reason));
    assert.throws(() => buildChartRelationshipModel({ sky: null, comparison: { context } }));
  });
  check('Five angles retain exact, inclusive boundary and outside-orb semantics across wrap and reversal', () => {
    for (const [type, angle] of Object.entries(angles)) for (const allowance of [0, 3, 10]) for (const error of [0, Math.max(0, allowance-1e-5), allowance, allowance+1e-5]) for (const rotation of [0, 359, 173.25]) {
      const sep = angle === 180 ? angle-error : angle+error;
      const sky = pairFixture(type, sep, allowance, rotation); syntheticCases++;
      if (error > allowance) { assert.throws(() => buildChartRelationshipModel({ sky })); continue; }
      const result = buildChartRelationshipModel({ sky }), r = geometric(result)[0];
      near(r.separationDegrees, distance(...sky.bodies.map(b => b.longitude))); near(r.orbDegrees, error); assert.equal(r.classification, 'neutral'); assert.equal(r.type, type);
      const reversed = structuredClone(sky); [reversed.aspects[0].bodyA, reversed.aspects[0].bodyB] = ['Moon','Sun']; reversed.bodies.reverse();
      assert.deepEqual(geometric(buildChartRelationshipModel({ sky: reversed })), geometric(result));
      assert.equal(result.methods.find(m => m.id === 'lilly').available, false);
    }
  });
  check('Zero and coincident angles are exact; equal relative motion is steady; missing motion is undetermined', () => {
    for (const [error, applying, speeds, expected] of [[0,false,[1,1],'exact'],[1,false,[1,1],'steady'],[1,null,[1,2],'undetermined'],[1,true,[1,2],'applying'],[1,false,[1,2],'separating']]) {
      const sky = pairFixture('conjunction', error); sky.aspects[0].applying = applying; sky.bodies.forEach((b,i) => b.speedDegreesPerDay = speeds[i]);
      assert.equal(geometric(buildChartRelationshipModel({ sky }))[0].phase, expected);
    }
  });
  check('Malformed and inconsistent contacts reject instead of producing plausible graphics', () => {
    const mutations = [s => s.bodies[0].longitude = NaN, s => s.bodies[0].longitude = 360, s => s.bodies[0].speedDegreesPerDay = Infinity, s => s.bodies[1].id = 'Sun', s => s.bodies[1].id = 'Sirius', s => s.aspectOrb = 11,
      s => s.aspects[0].bodyB = 'Sun', s => s.aspects[0].bodyB = 'Pluto', s => s.aspects[0].type = 'danger', s => s.aspects[0].angle = 61, s => s.aspects[0].separation = 61, s => s.aspects[0].orb = 1, s => s.aspects[0].allowedOrb = 4, s => s.aspects[0].applying = 'yes', s => s.aspects.push({ ...s.aspects[0], bodyA:'Moon',bodyB:'Sun' }), s => s.context.dateISO = '2026-10-30'];
    for (const mutate of mutations) { const sky = pairFixture('sextile', 60); mutate(sky); assert.throws(() => buildChartRelationshipModel({ sky })); }
    assert.throws(() => buildChartRelationshipModel({ sky: skyFixture(Array(11).fill(0)) }));
    assert.throws(() => buildChartRelationshipModel({ sky: skyFixture([]) }));
    assert.throws(() => buildChartRelationshipModel({ sky: skyFixture([0]), birth: { name:'private' } }));
  });
  check('Complete coincident catalogue has exactly 45 distinct geometric pairs and remains bounded', () => {
    const sky = skyFixture(Array(10).fill(0));
    for (let a=0;a<10;a++) for (let b=a+1;b<10;b++) sky.aspects.push({ bodyA:ids[a],bodyB:ids[b],type:'conjunction',angle:0,separation:0,orb:0,allowedOrb:3,applying:null });
    const result = buildChartRelationshipModel({ sky }); assert.equal(geometric(result).length,45); assert.equal(new Set(result.relations.map(r=>r.id)).size,result.relations.length); assert.ok(result.relations.length <= CHART_RELATIONSHIP_LIMITS.relations);
    assert.ok(result.relations.every(r => r.bodyIds.length===2 && r.bodyIds[0]!==r.bodyIds[1]));
    sky.aspects.push({ ...sky.aspects[0] }); assert.throws(() => buildChartRelationshipModel({ sky }));
  });
  check('Lilly uses distinct planetary moieties, never relabels the uniform geometry orb', () => {
    const sky = skyFixture([0, 8, 45, 130, 215, 265, 310]); const result = buildChartRelationshipModel({ sky });
    assert.equal(geometric(result).length,0); const r = result.relations.find(r => r.methodId==='lilly' && r.bodyIds.join(',')==='Sun,Moon');
    assert.ok(r); near(r.allowedOrbDegrees, 13.5); near(r.orbDegrees,8); assert.equal(r.classification,'neutral'); assert.ok(r.limitations.some(s=>s.includes('not the uniform')));
    assert.equal(result.methods.find(m=>m.id==='reception').available,false);
  });
  check('Every attached frame binds the explicit instant and applicable observer', () => {
    const sky=skyFixture([0,60]);
    for (const field of ['comparison','reading','alignment']) {
      assert.throws(()=>buildChartRelationshipModel({sky,[field]:{context:{...context,dateISO:'2026-10-31T12:00:00Z'}}}));
      assert.throws(()=>buildChartRelationshipModel({sky,[field]:{context:{...context,lon:0}}}));
      assert.doesNotThrow(()=>buildChartRelationshipModel({sky,[field]:{context:{...context,dateISO:'2026-10-30T13:00:00+01:00'}}}));
    }
  });
  check('Independent whole-sign Vedic enumeration preserves directions and unavailable tropical nodes', () => {
    const sky=skyFixture([0,30,65,130,181,244,300]);
    const vedicIds=[...ids.slice(0,7),'Rahu','Ketu']; const vedicPlanets=vedicIds.map((id,i)=>({id,longitude:wrap(i*43),signIndex:Math.floor(wrap(i*43)/30)}));
    const result=buildChartRelationshipModel({sky,vedicPlanets,vedicContext:context}), expected=[];
    const specials={Mars:[4,8],Jupiter:[5,9],Saturn:[3,10]};
    for(const a of vedicPlanets)for(const b of vedicPlanets){if(a===b)continue;const signDistance=((b.signIndex-a.signIndex+12)%12)+1;if(signDistance===7||specials[a.id]?.includes(signDistance))expected.push(a.id+'>'+b.id);}
    const actual=result.relations.filter(r=>r.methodId==='vedic'); assert.deepEqual(actual.map(r=>r.bodyIds.join('>')).sort(),expected.sort()); assert.ok(actual.every(r=>r.directed&&r.phase==='not-applicable'&&r.allowedOrbDegrees===null));
    for(const id of ['Rahu','Ketu'])assert.equal(result.bodies.find(b=>b.id===id).tropicalLongitude,null);
    for(const patch of [{vedicContext:null},{vedicContext:{...context,dateISO:'2026-10-31T12:00:00Z'}},{vedicPlanets:vedicPlanets.slice(0,8)},{vedicPlanets:vedicPlanets.map((p,i)=>i? p:{...p,signIndex:11})},{vedicPlanets:vedicPlanets.map((p,i)=>i? p:{...p,id:'Uranus'})}])assert.throws(()=>buildChartRelationshipModel({sky,vedicPlanets,vedicContext:context,...patch}));
  });
  check('Calendar output comparisons and source testimony remain separate qualified records', () => {
    const sky=skyFixture([0,60]), statuses=['equal-output','different-output','unavailable'];
    const alignment={context,differences:statuses.map((relationship,i)=>({id:'calendar-'+i,label:'Calendar',relationship,sourceIds:[],explanation:'Output equality is not outcome agreement.'}))};
    const reading={context,differences:[{id:'source',title:'Different rules',text:'Conventions differ',sourceIds:[],ruleIds:[]}],lenses:[{id:'example',rules:[{id:'rule',title:'Named rule',reading:'Source classification',classification:'caution',sourceIds:[]}]}]};
    const result=buildChartRelationshipModel({sky,alignment,reading}); assert.deepEqual(result.calendarComparisons.map(c=>c.relationship),statuses); assert.equal(result.sourceComparisons.length,1); assert.equal(result.ruleTestimonies[0].classification,'caution'); assert.ok(result.relations.every(r=>r.classification==='neutral'));
    alignment.differences[0].relationship='danger'; assert.throws(()=>buildChartRelationshipModel({sky,alignment}));
  });
  check('Adapter does not mutate held inputs or retain undeclared private metadata', () => {
    const sky=pairFixture('square',90); sky.privateNotes='PRIVATE_QA_SENTINEL'; sky.context.birth='PRIVATE_QA_SENTINEL'; sky.bodies[0].name='PRIVATE_QA_SENTINEL';
    const before=JSON.stringify(sky), first=buildChartRelationshipModel({sky}), second=buildChartRelationshipModel({sky}); assert.equal(JSON.stringify(sky),before); assert.deepEqual(first,second); assert.ok(!JSON.stringify(first).includes('PRIVATE_QA_SENTINEL'));
  });
  check('Real held frames at both coverage boundaries and leap day preserve numerical contact data', () => {
    for(const dateISO of ['1900-01-01T12:00:00Z','2000-02-29T12:00:00Z','2100-12-31T12:00:00Z']) {
      const sky=buildSkySnapshot({...context,dateISO,timeZone:'UTC'},{includeCatalogStars:false}); const before=JSON.stringify(sky),result=buildChartRelationshipModel({sky}); assert.equal(JSON.stringify(sky),before); assert.equal(result.context.dateISO,new Date(dateISO).toISOString()); assert.equal(geometric(result).length,sky.aspects.length);
      for(const r of geometric(result)){const bodies=r.bodyIds.map(id=>sky.bodies.find(b=>b.id===id));near(r.separationDegrees,distance(...bodies.map(b=>b.longitude)),1e-7);}
    }
  });
  check('Actual timeline frame enables all four methods without another ephemeris calculation', () => {
    const frame=buildCalendarTimelineFrame({startDate:'2026-10-30',endDate:'2026-10-30',time:'12:00',timeZone:'Europe/London',lat:context.lat,lon:context.lon,system:'regiomontanus'},0);
    const before=JSON.stringify(frame),result=buildChartRelationshipModel({sky:frame.sky,comparison:frame.comparison,vedicPlanets:frame.charts.vedic.planets,vedicContext:frame.context}); assert.ok(result.methods.every(m=>m.available)); assert.equal(JSON.stringify(frame),before); assert.ok(result.sources.every(s=>s.id&&s.title));
    assert.ok(result.relations.every(r=>r.sourceIds.every(id=>result.sources.some(s=>s.id===id))));
  });
  check('Visual identities have labels and distinct line patterns; calendar colors do not depend on ordering', () => {
    const styles=Object.keys(angles).map(relationPresentation); assert.equal(new Set(styles.map(s=>s.dash)).size,5); assert.ok(styles.every(s=>s.label&&s.glyph&&/^#[0-9a-f]{6}$/i.test(s.color)));
    const rings=['tropical-zodiac','sidereal-zodiac','nakshatra','solar-terms','western-whole'];const expected=rings.map(calendarRingColor); assert.deepEqual(rings.toReversed().map(calendarRingColor).reverse(),expected); assert.notEqual(expected[0],expected[1]);
  });
  return { count, syntheticCases, failures, pass: failures.length===0 };
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) { const result=await run(); console.log(JSON.stringify(result,null,2)); if(!result.pass)process.exitCode=1; }
