// Independent acceptance checks for the public historical study and MCP boundary.
// These checks validate software semantics and retained provenance, not historical
// truth, historical timezone accuracy, or predictive efficacy.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { getCountryHistoryCatalogue, buildCountryHistoryStudy } from '../../assets/js/core/country-history.js';
import { COUNTRY_HISTORY_MCP_TOOL } from '../../mcp/country-history-adapters.mjs';
import { TOOLS, callTool } from '../../mcp/toolkit.mjs';

const fixedDates = {
  'usa-independence-resolution-1776':'1776-07-02', 'usa-declaration-adopted-1776':'1776-07-04', 'usa-constitution-signed-1787':'1787-09-17',
  'israel-declaration-1948':'1948-05-14', 'israel-provisional-authority-1948':'1948-05-15', 'israel-un-admission-1949':'1949-05-11',
  'palestine-pnc-declaration-1988':'1988-11-15', 'palestine-un-observer-state-2012':'2012-11-29',
  'india-independence-1947':'1947-08-15', 'india-constitution-adoption-1949':'1949-11-26', 'india-constitution-commencement-1950':'1950-01-26',
  'russia-sovereignty-declaration-1990':'1990-06-12', 'russia-constitution-adoption-1993':'1993-12-12',
  'iran-republic-referendum-conclusion-1979':'1979-03-31', 'iran-republic-proclamation-1979':'1979-04-01', 'iran-constitution-commencement-1979':'1979-12-03',
};
const forbidden = new Set(['rank','ranking','score','objective','objectives','prediction','outcome','natalChart','birthChart','planetaryPositions']);
function forbiddenPaths(value, path='') {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key,item]) => [...(forbidden.has(key)?[path+'.'+key]:[]), ...forbiddenPaths(item,path+'.'+key)]);
}
export async function run() {
  let count=0; const failures=[];
  const check=(label,fn)=>{count++;try{fn();}catch(e){failures.push(label+': '+e.message);}};
  const c=getCountryHistoryCatalogue(), ids=c.records.map(r=>r.id), valid={recordIds:[ids[3]]};
  check('fixed historical coverage and dates',()=>assert.deepEqual(Object.fromEntries(c.records.map(r=>[r.id,r.date])),fixedDates));
  check('exact six entity identifiers',()=>assert.deepEqual(c.countries.map(x=>x.id),['usa','israel','india','russia','iran','palestine']));
  check('past-only fixed cutoff and explicit selection bound',()=>assert.ok(c.asOf==='2026-10-30'&&c.maxRecords===6&&c.records.every(r=>r.date<=c.asOf)));
  check('one actual toolkit registration',()=>assert.equal(TOOLS.filter(t=>t.name==='workbench_country_history').length,1));
  const schema=COUNTRY_HISTORY_MCP_TOOL.inputSchema;
  check('MCP schema has only curated selection and historical options',()=>assert.deepEqual(Object.keys(schema.properties).sort(),['houseSystem','includeDaySensitivity','recordIds']));
  check('MCP schema rejects additional properties and admits exactly all curated IDs',()=>assert.ok(schema.additionalProperties===false&&JSON.stringify(schema.properties.recordIds.items.enum)===JSON.stringify(ids)&&schema.properties.recordIds.maxItems===6&&schema.properties.recordIds.minItems===1&&schema.properties.recordIds.uniqueItems));
  for (const record of c.records) {
    const s=buildCountryHistoryStudy({recordIds:[record.id],includeDaySensitivity:true}), item=s.records[0], sourceMap=new Map(s.sources.map(x=>[x.id,x]));
    check(record.id+' retains exact source record and date-only precision',()=>{assert.deepEqual(item.record,record);assert.equal(record.time.status,'date-only');assert.equal(record.time.localTime,null);assert.ok(item.coverage.warnings.includes(record.time.qualification));});
    check(record.id+' all source and method identifiers resolve',()=>{const declared=[...record.sourceIds,...item.civilComparison.rows.flatMap(r=>r.sourceIds),...item.daySensitivity.sourceIds];assert.ok(declared.every(id=>sourceMap.has(id)));assert.ok(record.sourceIds.every(id=>record.source.includes(sourceMap.get(id).url)));});
    check(record.id+' source evidence metadata is exported without rewrite',()=>{for(const source of s.sources.filter(x=>record.sourceIds.includes(x.id))){assert.deepEqual(source,c.sources.find(x=>x.id===source.id));assert.ok(source.readingStatus&&source.rights&&source.locator);}});
    check(record.id+' carries no ranking, objective, or exact event chart',()=>assert.deepEqual(forbiddenPaths(s),[]));
    if (record.date<'1900-01-01') {
      check(record.id+' retains unavailable date with no replacement calculation',()=>{assert.equal(item.civilComparison.status,'unavailable');assert.equal(item.civilComparison.reference,null);assert.deepEqual(item.civilComparison.rows,[]);assert.deepEqual(item.daySensitivity.samples,[]);assert.match(item.civilComparison.reason,/1900|range/i);});
    } else {
      check(record.id+' noon is an explicit separate assumption',()=>{const r=item.civilComparison.reference;assert.equal(r.localDate,record.date);assert.equal(r.localTime,'12:00:00');assert.equal(r.timeStatus,'declared-reference-assumption');assert.match(r.assumption,/not a sourced event time/);assert.ok(item.civilComparison.rows.every(row=>row.kind==='calculated-civil'&&row.validation&&row.method&&row.limitations.length));});
      check(record.id+' every sample is assumed and stays within its documented civil day',()=>{const d=item.daySensitivity;assert.equal(d.samples.length,25);assert.equal(d.clockSlots.length,24);assert.ok(d.samples.every(x=>x.assumption===true&&x.localDate===record.date&&x.cusps.length===12&&x.cusps.every(n=>Number.isFinite(n)&&n>=0&&n<360)));assert.ok(d.samples.every((x,i)=>!i||Date.parse(x.dateISO)>Date.parse(d.samples[i-1].dateISO)));});
    }
  }
  for (const houseSystem of ['regiomontanus','placidus','whole','equal']) {
    const selection={recordIds:ids.filter(id=>!id.startsWith('usa-')).slice(0,6),houseSystem,includeDaySensitivity:true}, canonical=buildCountryHistoryStudy(selection), response=callTool('workbench_country_history',selection);
    check(houseSystem+' toolkit response equals complete canonical output',()=>assert.deepEqual(response.data,canonical));
    check(houseSystem+' six records and full 150-sample response fit bounds',()=>{assert.equal(response.data.records.length,6);assert.equal(response.data.records.reduce((n,r)=>n+r.daySensitivity.samples.length,0),150);assert.ok(Buffer.byteLength(JSON.stringify(response))<1500000);});
    check(houseSystem+' samples identify actual and requested system and all cusps',()=>assert.ok(response.data.records.every(r=>r.daySensitivity.samples.every(s=>s.requestedHouseSystem===houseSystem&&s.houseSystem===houseSystem&&s.cusps.length===12))));
  }
  const attacks=[null,[],{}, {recordIds:[]},{recordIds:ids.slice(0,7)},{recordIds:[ids[0],ids[0]]},{recordIds:['future-2031']},{recordIds:[1]},
    {...valid,date:'2031-01-01'},{...valid,startDate:'2031-01-01'},{...valid,endDate:'2031-12-31'},{...valid,objective:'military operation'},
    {...valid,objectives:['attack']},{...valid,country:'usa'},{...valid,chart:{}},{...valid,privateNotes:'secret'},{...valid,houseSystem:'koch'},
    {...valid,includeDaySensitivity:'true'},{...valid,includeDaySensitivity:1},{...valid,includeDaySensitivity:null},
    {recordIds:Array(1)},Object.assign(Object.create({recordIds:[ids[0]]}),{}),Object.defineProperty({...valid},'date',{value:'2031-01-01'}),{...valid,[Symbol('objective')]:'attack'}];
  const inherited=Array(1);Object.setPrototypeOf(inherited,Object.assign(Object.create(Array.prototype),{0:ids[0]}));attacks.push({recordIds:inherited});
  for (const [i,args] of attacks.entries()) for(const [name,fn] of [['core',buildCountryHistoryStudy],['adapter',x=>COUNTRY_HISTORY_MCP_TOOL.calculate(x)],['toolkit',x=>callTool('workbench_country_history',x)]]) check(name+' rejects malformed/future/objective payload '+i,()=>assert.throws(()=>fn(args)));
  check('null-prototype ordinary JSON-shaped selection remains valid',()=>assert.deepEqual(buildCountryHistoryStudy(Object.assign(Object.create(null),valid)),buildCountryHistoryStudy(valid)));
  return {pass:!failures.length,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(JSON.stringify(r,null,2));process.exitCode=r.pass?0:1;}
