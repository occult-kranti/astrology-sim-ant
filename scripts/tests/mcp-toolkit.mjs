import assert from 'node:assert/strict';
import { callTool, TOOLS } from '../../mcp/toolkit.mjs';
export function run() {
  const failures = []; let passed = 0;
  const test = (name, fn) => { try { fn(); passed++; } catch (e) { failures.push(`${name}: ${e.message}`); } };
  test('strict schemas before calculations', () => {
    for (const args of [{text:'SOL',bogus:true},{text:8},{text:'A'.repeat(513)},{planet:'Pluto'},{method:'unknown'}]) assert.throws(() => callTool('workbench_symbol', args));
    for (const args of [{dateISO:'2026-10-05',lat:0,lon:0},{dateISO:'2026-02-30T12:00Z',lat:0,lon:0},{dateISO:'2026-01-01T00:00Z',lat:NaN,lon:0},{dateISO:'2026-01-01T00:00Z',lat:91,lon:0}]) assert.throws(()=>callTool('workbench_chart',args));
    assert.throws(()=>callTool('__proto__',{}));
  });
  test('published arithmetic and computus references', () => {
    assert.equal(callTool('workbench_gematria',{text:'חי'}).data.total,18);
    assert.equal(callTool('workbench_gematria',{text:'אמן',method:'gadol'}).data.total,741);
    assert.deepEqual(callTool('workbench_easter',{year:2024}).data.gregorian,{y:2024,m:3,d:31});
    assert.equal(callTool('workbench_julian_day',{date:'2000-01-01',utcHours:12}).data.jd,2451545);
  });
  test('symbol SVG provenance and rejected alphabets',()=>{
    const r=callTool('workbench_symbol',{planet:'Sun',text:'SOL'}).data;
    assert.equal(r.validation.constant,111); assert.match(r.presentation.svg,/<svg/); assert.ok(r.sources.length); assert.ok(r.textModel.length);
    assert.throws(()=>callTool('workbench_symbol',{text:'शुक्र'}));
    assert.throws(()=>callTool('workbench_gematria',{text:'Latin'}));
  });
  test('deterministic context and no guessed unknown time',()=>{
    const input={dateISO:'2024-03-20T03:06:00Z',lat:51.5,lon:0,includeVedic:false};
    assert.deepEqual(callTool('workbench_chart',input),callTool('workbench_chart',input));
    const result=callTool('workbench_chart',input).data;
    const lon=result.chart.planets.Sun.lon; assert.ok(lon<1||lon>359); assert.equal(result.reading,null);
    assert.throws(()=>callTool('workbench_chart',{...input,birth:{...input,timeKnown:false}}));
  });
  test('scan limit validation, zero horizon and discoverable catalogue',()=>{
    const input={dateISO:'2026-01-01T00:00Z',lat:0,lon:0,operationKey:'love'};
    for(const extra of [{hoursAhead:169},{stepMinutes:0},{hoursAhead:168,stepMinutes:1}])assert.throws(()=>callTool('workbench_election',{...input,...extra}));
    assert.throws(()=>callTool('workbench_election',{...input,dateISO:'3000-12-31T23:59Z',hoursAhead:168,stepMinutes:1440}));
    assert.throws(()=>callTool('workbench_katapayadi',{text:'शुक्र'}));
    assert.ok(Array.isArray(callTool('workbench_election',{...input,hoursAhead:0}).data.windows));
    assert.equal(new Set(TOOLS.map(t=>t.name)).size,11);
    assert.ok(callTool('workbench_catalogue',{}).data.capabilities.length>=81);
  });
  return {pass:!failures.length,passed,failures};
}
if(process.argv[1]?.endsWith('mcp-toolkit.mjs')){const r=run();console.log(r);if(!r.pass)process.exitCode=1;}
