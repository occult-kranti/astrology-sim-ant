// Independent QA: structural/metamorphic checks, not an independent ephemeris.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildHorizonAstronomy} from '../../assets/js/core/horizon-astronomy.js';
import {compareMoment} from '../../assets/js/core/calendar-observatory.js';
import {buildDayGuidance} from '../../assets/js/core/day-guidance.js';
import {evaluateHorizonPurposes,HORIZON_PURPOSES} from '../../assets/js/core/horizon-ranking.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const sources=['assets/js/core/horizon-astronomy.js','assets/js/core/horizon-ranking.js','assets/js/core/calendar-observatory.js','assets/js/core/day-guidance.js','assets/js/lib/astronomy.js'];
const hash=body=>createHash('sha256').update(body).digest('hex');
const manifest=async()=>Object.fromEntries(await Promise.all(sources.map(async p=>[p,hash(await readFile(resolve(root,p)))])));
const immediate={yieldControl:()=>Promise.resolve()};
const pair=input=>{const comparison=compareMoment(input);return{comparison,guidance:buildDayGuidance(comparison)};};
const clone=x=>JSON.parse(JSON.stringify(x));
// The native eclipse search's changing seed perturbs the shadow-axis distance
// by nanometres while preserving the emitted millisecond and classification.
// Keep all identity/interval/qualification fields exact; allow only 1 mm here.
function equalEvent(actual,expected){const a=clone(actual),b=clone(expected);if(Object.hasOwn(b.details,'globalShadowAxisDistanceKm')){assert.ok(Math.abs(a.details.globalShadowAxisDistanceKm-b.details.globalShadowAxisDistanceKm)<=1e-6,'shadow-axis distance stable within 1e-6 km');a.details.globalShadowAxisDistanceKm=b.details.globalShadowAxisDistanceKm;}assert.deepEqual(a,b);}

export async function run(){
 const receipt={schemaVersion:1,kind:'independent-horizon-review',startedAt:new Date().toISOString(),runtime:process.versions,sourceBefore:await manifest(),driverSHA256:hash(await readFile(fileURLToPath(import.meta.url))),checks:[],limits:['Metamorphic and contract checks reuse the bundled engine; they do not independently validate ephemerides or predictive effects.','This focused suite does not replace the full-horizon benchmark or real browser verification.']};
 const test=async(label,fn)=>{try{await fn();receipt.checks.push({label,pass:true});}catch(error){receipt.checks.push({label,pass:false,message:error.message});}};
 const full=await buildHorizonAstronomy({startUTC:'2027-01-01T00:00:00Z',endUTC:'2027-02-26T00:00:00Z'},immediate);
 const native=full.events.filter(e=>['lunar-phase','solar-eclipse','lunar-eclipse'].includes(e.kind));
 await test('Independent native-boundary fixture covers quarters and both eclipse solvers',()=>{assert.ok(native.some(e=>e.kind==='solar-eclipse'));assert.ok(native.some(e=>e.kind==='lunar-eclipse'));assert.deepEqual([...new Set(native.filter(e=>e.kind==='lunar-phase').map(e=>e.details.phase))].sort(),[0,1,2,3]);});
 for(const event of native)await test('Exact emitted native root belongs only to right half-open partition: '+event.id,async()=>{const ms=Date.parse(event.startUTC);const left=await buildHorizonAstronomy({startUTC:new Date(ms-3600000).toISOString(),endUTC:event.startUTC},immediate),right=await buildHorizonAstronomy({startUTC:event.startUTC,endUTC:new Date(ms+3600000).toISOString()},immediate);assert.equal(left.events.some(e=>e.id===event.id),false);equalEvent(right.events.find(e=>e.id===event.id),event);});
 await test('Non-grid subdivision preserves the complete meaningful event inventory',async()=>{const split='2027-01-19T03:11:45.123Z';const a=await buildHorizonAstronomy({startUTC:full.range.startUTC,endUTC:split},immediate),b=await buildHorizonAstronomy({startUTC:split,endUTC:full.range.endUTC},immediate);const joined=[...a.events,...b.events];assert.equal(joined.length,full.events.length);joined.forEach((event,i)=>equalEvent(event,full.events[i]));});
 await test('Cancellation at final progress yields no partial success and a later call recovers',async()=>{let cancel=false,observed=false;await assert.rejects(buildHorizonAstronomy({startUTC:'2027-01-01T00:00:00Z',endUTC:'2027-01-02T00:00:00Z'},{...immediate,shouldCancel:()=>cancel,onProgress:p=>{if(p.stage==='longitude-crossings'&&p.total===p.processed){cancel=true;observed=true;}}}),e=>e.name==='AbortError'&&e.code==='CANCELLED');assert.ok(observed);const recovered=await buildHorizonAstronomy({startUTC:'2027-01-01T00:00:00Z',endUTC:'2027-01-02T00:00:00Z'},immediate);assert.ok(recovered.stats.completeRequestedRange);});
 const input={dateISO:'2026-10-30T12:00:00Z',lat:51.5074,lon:-.1278,timeZone:'Europe/London'},baseline=pair(input),profiles=evaluateHorizonPurposes(baseline);
 await test('Same physical instant under a different clock retains geocentric profile results',()=>{const changed=evaluateHorizonPurposes(pair({...input,timeZone:'Asia/Kolkata'}));for(let i=0;i<3;i++){assert.equal(changed[i].scoreNumerator,profiles[i].scoreNumerator);assert.equal(changed[i].scoreDenominator,profiles[i].scoreDenominator);assert.deepEqual(changed[i].contributions,profiles[i].contributions);}});
 for(const definition of HORIZON_PURPOSES)await test('Every removed observation makes its entire selected profile unavailable: '+definition.id,()=>{for(const term of definition.contributions){const data=clone(baseline);for(const tradition of data.guidance.traditions)tradition.items=tradition.items.filter(r=>r.id!==term.ruleId);const actual=evaluateHorizonPurposes(data).find(p=>p.id===definition.id),expected=profiles.find(p=>p.id===definition.id);assert.equal(actual.rankable,false);assert.equal(actual.score,null);assert.equal(actual.scoreNumerator,null);assert.equal(actual.scoreDenominator,expected.scoreDenominator);assert.ok(actual.missing.some(row=>row.id===term.ruleId));}});
 await test('Complete geocentric evidence survives genuine polar-hour missingness without borrowing another observer',()=>{const data=pair({dateISO:'2027-06-21T12:00:00Z',lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo'}),result=evaluateHorizonPurposes(data);assert.ok(result[0].rankable&&result[1].rankable);assert.equal(result[3].rankable,false);assert.equal(result[3].score,null);assert.equal(data.comparison.context.lat,69.6492);});
 await test('Profile readings cannot become independent calendar votes or whole-day claims',()=>{for(const p of profiles){assert.equal(p.wholeDayValidity,false);assert.equal(p.scope,'sampled-instant');assert.ok(p.dependencyGroups.every(g=>g.independentEvidence===false));assert.equal(p.dependencyGroups.reduce((n,g)=>n+g.weight,0),p.scoreDenominator);}const data=clone(baseline);data.comparison.calendars.reverse();data.comparison.extraFestival={name:'Guaranteed success',score:100};assert.deepEqual(evaluateHorizonPurposes(data),profiles);});
 receipt.sourceAfter=await manifest();await test('Tested product files stayed unchanged during this focused run',()=>assert.deepEqual(receipt.sourceAfter,receipt.sourceBefore));receipt.completedAt=new Date().toISOString();receipt.pass=receipt.checks.every(c=>c.pass);receipt.count=receipt.checks.length;receipt.failures=receipt.checks.filter(c=>!c.pass).map(c=>c.label+': '+c.message);
 if(process.env.HORIZON_INDEPENDENT_RECEIPT){const p=resolve(process.env.HORIZON_INDEPENDENT_RECEIPT);await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(receipt,null,2)+'\n');}
 return receipt;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const r=await run();console.log(JSON.stringify({pass:r.pass,count:r.count,failures:r.failures},null,2));if(!r.pass)process.exitCode=1;}
