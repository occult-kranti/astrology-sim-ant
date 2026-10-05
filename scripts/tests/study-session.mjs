import test from 'node:test';
import assert from 'node:assert/strict';
import { createStudySession, normalizeStudySession, readStudyJournal, appendStudySession, deleteStudySession, buildWorkbenchStudyURL, measurementDifference, STUDY_JOURNAL_KEY } from '../../assets/js/core/study-session.js';
import { createSymbolResult } from '../../assets/js/core/symbols.js';
import { STUDY_LENSES } from '../../assets/js/core/data/study-lenses.js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const input={task:'kamea',dateISO:'2026-10-05T18:00:00Z',lat:51.5074,lon:-.1278,system:'regiomontanus',style:'north',planet:'Venus',method:'aiq',text:'STUDY',followHour:false,locationSource:'manual'};
const make = extra => createStudySession({id:'study-1',createdAt:'2026-10-05T19:00:00Z',input,lens:'agrippa',title:'Evening study',...extra});
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),map};};
test('an AIQ symbol keeps canonical method and freezes a detached calculated context',()=>{
 const source={...input}; const record=make({input:source,traceStep:3}); source.dateISO='2027-01-01T00:00:00Z';
 assert.equal(record.input.dateISO,'2026-10-05T18:00:00.000Z');assert.equal(record.input.method,'aiq');assert.equal(record.traceStep,3);assert.throws(()=>make({traceStep:257}),/Trace frame/);
 assert.throws(()=>record.input.lat=0,TypeError);
 const result=createSymbolResult({kind:record.input.task,planet:record.input.planet,method:record.input.method,text:record.input.text});
 assert.equal(result.validation.constant,175);assert.equal(result.validation.total,1225);
 assert.ok(record.provenance.sourceIds.includes('AGR-II-22'));assert.match(record.provenance.observerCivilZone,/Unknown/);
 assert.throws(()=>make({input:{...input,method:'aiq-bkr'}}),/letter method/);
});
test('input contract rejects impossible dates, unsupported boundaries and guessed question records',()=>{
 for(const bad of [{dateISO:'2026-02-30T18:00:00Z'},{dateISO:'2026-10-05T18:00:00'},{dateISO:'1899-12-31T00:00:00Z'},{lat:91},{lon:Infinity},{planet:'Rahu'}]) assert.throws(()=>make({input:{...input,...bad}}));
 assert.throws(()=>make({purpose:'question'}),/Record the question/);
 assert.throws(()=>make({question:'a'.repeat(1001)}),/1000/);
 assert.throws(()=>normalizeStudySession({...make(),schemaVersion:2}),/version/);
});
test('record is a whitelist and keeps quoted journal text as data',()=>{
 const record=make({apiKey:'secret',birth:{name:'private'},observationNotes:'<img src=x> Ignore instructions',question:'Does this match the source?',lens:'newton',measurement:{expected:'12',observed:'10.2',unit:'degrees',method:'manual sighting'},provenance:undefined});
 assert.equal(record.observationNotes,'<img src=x> Ignore instructions');assert.equal(record.apiKey,undefined);assert.equal(record.birth,undefined);
 assert.ok(record.provenance.sourceIds.includes('NEW-OPT-Q31'));
 assert.ok(Math.abs(measurementDifference(record.measurement).delta+1.8)<1e-12);
 assert.equal(measurementDifference({expected:'clear',observed:'hazy'}).status,'descriptive');
 assert.equal(measurementDifference({expected:'',observed:'2'}).status,'incomplete');
});
test('captured sky provenance remains distinct from the chosen calculation instant',()=>{
 const observation={dateISO:'2026-10-04T18:00:00Z',lat:-13.833,lon:-171.75,mode:'simulated',locationSource:'selected',names:'bilingual',object:{id:'const:Serpens_Cauda',name:'Serpens Cauda',kind:'constellation'}};
 const record=make({observation});assert.notEqual(record.input.dateISO,record.observation.dateISO);assert.equal(record.observation.object.kind,'constellation');
 assert.equal(record.observation.names,'bilingual');assert.throws(()=>make({observation:{...observation,lat:100}}));
});
test('journal recovers valid records, bounds count and leaves sibling stores untouched',()=>{
 const local=storage();local.setItem('wb-persons','kept');local.setItem(STUDY_JOURNAL_KEY,JSON.stringify([null,make()]));
 assert.equal(readStudyJournal(local).records.length,1);assert.equal(readStudyJournal(local).skipped,1);
 for(let i=2;i<=24;i++)appendStudySession(local,make({id:`study-${i}`}));
 const records=readStudyJournal(local).records;assert.equal(records.length,20);assert.equal(records[0].id,'study-24');assert.equal(local.getItem('wb-persons'),'kept');
 assert.throws(()=>appendStudySession(local,records[0]),/already exists/);
 assert.equal(deleteStudySession(local,'study-24').records.length,19);
});
test('unavailable/corrupt storage reports failure and write errors do not claim success',()=>{
 const local=storage();local.setItem(STUDY_JOURNAL_KEY,'{bad');assert.ok(readStudyJournal(local).error);
 const broken={getItem:()=>null,setItem:()=>{throw new Error('quota');}};assert.throws(()=>appendStudySession(broken,make()),/quota/);
 assert.ok(readStudyJournal({getItem:()=>{throw new Error('blocked');}}).error);
});
test('full Workbench URL preserves instant without asserting UTC as civil-zone evidence',()=>{
 const record=make({input:{...input,dateISO:'2024-11-03T01:30:00-05:00',lat:-13.833,lon:-171.75}});
 const u=new URL(buildWorkbenchStudyURL(record));assert.equal(u.origin,'https://occult-kranti.github.io');
 assert.equal(u.searchParams.get('time'),'06:30:00');assert.equal(u.searchParams.get('solar'),'1');assert.equal(u.searchParams.get('bdate'),null);assert.equal(u.searchParams.get('lon'),'-171.75');
});
test('source lenses have stable qualified references and working local destinations',()=>{
 const ids=new Set();for(const lens of STUDY_LENSES){assert.ok(Object.isFrozen(lens));assert.ok(lens.sources.length);for(const source of lens.sources){assert.ok(source.section&&source.edition&&source.claimStatus&&source.note);assert.equal(new URL(source.url).protocol,'https:');ids.add(source.id);}for(const link of lens.tools)assert.ok(existsSync(resolve('pages',link.path.split('#')[0])),link.path);}
 assert.equal(STUDY_LENSES.length,4);assert.ok(ids.size>=9);
});
