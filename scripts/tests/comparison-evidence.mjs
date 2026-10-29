import { pathToFileURL } from 'node:url';
import { buildComparisonEvidence, explainLunarPartitions } from '../../assets/js/core/comparison-evidence.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { nakshatraOf } from '../../assets/js/core/data/vedic-data.js';

export async function run() {
  const failures = []; let count = 0;
  const ok = (condition, message) => { count++; if (!condition) failures.push(message); };
  const throws = (fn, message) => { try { fn(); ok(false, message); } catch { ok(true, message); } };
  const near = (a,b,tolerance=1e-9) => Math.abs(a-b)<tolerance;
  const input = {dateISO:'2026-10-29T12:00:00Z',lat:28.6139,lon:77.209,timeZone:'Asia/Kolkata'};
  const report = buildComparisonEvidence(input);
  ok(JSON.stringify(report)===JSON.stringify(buildComparisonEvidence(input)), 'Explicit input is deterministic with no clock, requests or stored state');
  ok(report.schemaVersion===1 && report.kind==='calculation-dependency-explanation', 'Versioned output describes calculation dependencies');
  for (const dateISO of ['1900-01-02T12:00:00Z','2000-01-01T12:00:00Z','2024-04-08T18:17:00Z',input.dateISO,'2100-12-30T12:00:00Z']) {
    const sample = buildComparisonEvidence({...input,dateISO});
    ok(sample.frames.every(f=>near(f.circularResidualDegrees,0)), `${dateISO}: full-precision sidereal transform has zero circular residual`);
    ok(sample.quantities.filter(q=>'matchesCanonical' in q).every(q=>q.matchesCanonical), `${dateISO}: four explanatory partitions match the canonical engine`);
    ok(near(sample.sharedLunarGeometry.frameCancellationResidualDegrees,0), `${dateISO}: subtracting the same offset cancels in elongation`);
  }
  ok(report.linearAyanamshaDegrees!==report.displayedAyanamshaDegrees && near(report.linearAyanamshaDegrees,report.displayedAyanamshaDegrees,.000051), 'Residual calculation uses the full helper, not a four-decimal display');
  const wrap=explainLunarPartitions(350,2,24);
  ok(wrap.elongationDegrees===12 && wrap.tithi.number===2 && wrap.karana.halfTithiNumber===3, 'Longitude wrap retains the exact 12-degree tithi and 6-degree half-tithi boundaries');
  ok(wrap.phase.index===0 && wrap.phase.lowerDegrees===337.5 && wrap.phase.upperDegrees===22.5, 'New-phase display sector wraps through zero');
  ok(explainLunarPartitions(0,22.499,0).phase.index===0 && explainLunarPartitions(0,22.5,0).phase.index===1, 'Centered broad phase uses a half-open 22.5-degree boundary');
  ok(explainLunarPartitions(0,0,0).tithi.number===1 && explainLunarPartitions(0,359.999,0).tithi.number===30 && explainLunarPartitions(0,360,0).tithi.number===1, 'Tithi resets only at the normalized wrap');
  ok(explainLunarPartitions(0,180,0).tithi.number===16 && explainLunarPartitions(0,6,0).karana.halfTithiNumber===2, 'Full opposition and half-tithi exact boundaries use the correct slot');
  const f1=explainLunarPartitions(15,42,0), f2=explainLunarPartitions(15,42,24);
  ok(f1.elongationDegrees===f2.elongationDegrees && f1.tithi.number===f2.tithi.number && f1.karana.halfTithiNumber===f2.karana.halfTithiNumber, 'A changed reference frame cannot create a different elongation derivation');
  ok(f1.nakshatra.number!==f2.nakshatra.number && f1.yoga.number!==f2.yoga.number, 'Absolute lunar arc and sidereal sum can change when the reference origin changes');
  const exactArc=360/27;
  ok(explainLunarPartitions(0,exactArc,0).nakshatra.number===nakshatraOf(exactArc).num && /machine-precision boundaries/.test(report.lunarBoundaryPrecisionNote), 'Inherited machine-precision equal-arc behavior is reproduced and disclosed, not tolerance-snapped into a new canonical rule');
  throws(()=>explainLunarPartitions(NaN,0,24), 'Nonfinite synthetic angular input is rejected');
  throws(()=>explainLunarPartitions(0,Infinity,24), 'Infinite angular input is rejected');
  const distant=buildComparisonEvidence({...input,lat:21.3,lon:-157.8,timeZone:'Pacific/Honolulu'});
  ok(JSON.stringify(report.frames)===JSON.stringify(distant.frames) && JSON.stringify(report.sharedLunarGeometry)===JSON.stringify(distant.sharedLunarGeometry), 'Same-instant geocentric angles do not inherit observer latitude, longitude or civil date');
  const early=buildComparisonEvidence({...input,dateISO:'2026-10-28T21:00:00Z'});
  ok(early.boundaries.find(r=>r.id==='civil').value==='2026-10-29' && early.boundaries.find(r=>r.id==='vara').value==='Budhavāra', 'Before Delhi sunrise, Thursday civil date retains the previous Wednesday vāra');
  const polar=buildComparisonEvidence({...input,dateISO:'2026-06-21T12:00:00Z',lat:89,lon:0,timeZone:'UTC'});
  ok(['hours','vara'].every(id=>polar.boundaries.find(r=>r.id===id).status==='unavailable'), 'Missing polar solar interval does not fabricate a temporal hour or sunrise weekday');
  ok(polar.boundaries.find(r=>r.id==='prayer').status!=='available', 'Partial polar prayer schedule does not claim all methods became available');
  const snapshot=compareMoment(input); snapshot.astronomy.sunLongitude=1; snapshot.western.moon.longitude=2; snapshot.vedic.panchanga.tithi.name='Fabricated'; snapshot.context.attackerScore=100;
  ok(JSON.stringify(buildComparisonEvidence(snapshot))===JSON.stringify(report), 'Imported output poisoning and unknown context metadata cannot override canonical reconstruction');
  const nodeIds=new Set(report.graph.nodes.map(n=>n.id)),sourceIds=new Set(report.sources.map(s=>s.id));
  ok(nodeIds.size===report.graph.nodes.length && report.graph.edges.every(e=>nodeIds.has(e.from)&&nodeIds.has(e.to)&&e.kind), 'Every dependency edge has a typed relation and resolves distinct stable nodes');
  ok([...report.frames,...report.quantities,...report.boundaries,...report.sourceDifferences].every(row=>row.sourceIds.length&&row.sourceIds.every(id=>sourceIds.has(id))), 'Every quantitative or cultural distinction has resolvable named sources');
  ok(report.sources.some(s=>s.id==='CE-LILLY'&&/1659 second edition/.test(s.edition)&&/OCR/.test(s.readingStatus)), 'Lilly selected reading preserves its edition and transcription qualification');
  ok(report.sources.some(s=>s.id==='CE-MUHURTA'&&/primary-passage collation remains pending/.test(s.readingStatus)), 'Secondary Muhūrta screens are not promoted to a fresh primary-text reading');
  ok(!('score' in report)&&!('probability' in report)&&report.limitations.some(s=>/not an empirical correlation/.test(s)), 'No consensus, probability or empirical correlation is fabricated from shared inputs');
  ok(JSON.stringify(JSON.parse(JSON.stringify(report)))===JSON.stringify(report), 'Export object survives JSON roundtrip without nonfinite quantities');
  throws(()=>buildComparisonEvidence({...input,dateISO:undefined}), 'Missing explicit instant is rejected');
  throws(()=>buildComparisonEvidence({...input,dateISO:'2026-10-29T12:00:00'}), 'Implicit local timestamp is rejected');
  throws(()=>buildComparisonEvidence({...input,dateISO:'2026-02-30T12:00:00Z'}), 'Impossible date is rejected');
  throws(()=>buildComparisonEvidence({...input,dateISO:'2101-01-01T12:00:00Z'}), 'Unsupported range is rejected');
  const previous=process.env.TZ;
  try {process.env.TZ='Pacific/Honolulu';ok(JSON.stringify(buildComparisonEvidence(input))===JSON.stringify(report),'Host timezone cannot change explicit context calculations');}
  finally {if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
  return {pass:failures.length===0,failures,count};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=await run();console.log(`${result.pass?'PASS':'FAIL'} comparison evidence: ${result.count} checks`);result.failures.forEach(f=>console.error(f));process.exitCode=result.pass?0:1;}
