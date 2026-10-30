import assert from 'node:assert/strict';
import { callTool, TOOLS } from '../../mcp/toolkit.mjs';
import { buildDayGuidance } from '../../assets/js/core/day-guidance.js';
import { exportCalendarAtlas } from '../../assets/js/core/calendar-atlas.js';
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
  test('remaining tool contracts preserve conventions and unavailable states',()=>{
    assert.equal(callTool('workbench_katapayadi',{text:'śa'}).data.value,'5');
    const calendar=callTool('workbench_calendar',{dateISO:'2024-04-23T12:00Z',calendar:'hebrew',timeZone:'UTC'}).data;
    assert.equal(calendar.boundary,'civil-midnight'); assert.match(calendar.text,/5784/);
    assert.equal(callTool('workbench_qibla',{lat:90,lon:0}).data.available,false);
    const prayer=callTool('workbench_prayer_times',{date:'2026-01-01',latitude:51.5,longitude:0,timeZone:'Europe/London',method:'Karachi',asr:'Hanafi'}).data;
    assert.equal(prayer.times.length,6);assert.equal(prayer.method,'Karachi');assert.equal(prayer.asr,'Hanafi');
    assert.throws(()=>callTool('workbench_prayer_times',{date:'2026-02-30',latitude:0,longitude:0,timeZone:'UTC'}));
  });
  test('scan limit validation, zero horizon and discoverable catalogue',()=>{
    const input={dateISO:'2026-01-01T00:00Z',lat:0,lon:0,operationKey:'love'};
    for(const extra of [{hoursAhead:169},{stepMinutes:0},{hoursAhead:168,stepMinutes:1}])assert.throws(()=>callTool('workbench_election',{...input,...extra}));
    assert.throws(()=>callTool('workbench_election',{...input,dateISO:'3000-12-31T23:59Z',hoursAhead:168,stepMinutes:1440}));
    assert.throws(()=>callTool('workbench_katapayadi',{text:'शुक्र'}));
    assert.ok(Array.isArray(callTool('workbench_election',{...input,hoursAhead:0}).data.windows));
    assert.equal(callTool('workbench_election',{...input,dateISO:'2026-10-05T13:00:00+13:00',lat:-13.8333,lon:-171.75,hoursAhead:0}).data.inputs.utcOffset,13);
    assert.equal(new Set(TOOLS.map(t=>t.name)).size,TOOLS.length);
    assert.ok(callTool('workbench_catalogue',{}).data.capabilities.length>=81);
  });
  test('cross-calendar tools preserve explicit context, privacy and finite horizons',()=>{
    const input={dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London'};
    const result=callTool('workbench_compare_moment',input);
    assert.equal(result.data.context.dateISO,'2026-10-29T12:00:00.000Z');
    assert.deepEqual(result,callTool('workbench_compare_moment',input));
    for(const extra of [{dateISO:'2026-10-29'},{timeZone:'Not/AZone'},{lat:91},{unknown:true}])assert.throws(()=>callTool('workbench_compare_moment',{...input,...extra}));
    for(const days of [0,15,1.1,Infinity])assert.throws(()=>callTool('workbench_calendar_outlook',{...input,days}));
    assert.throws(()=>callTool('workbench_compare_moment',{dateISO:input.dateISO,lat:0,lon:0}));
    const outlook=callTool('workbench_calendar_outlook',{...input,dateISO:'2026-10-31T12:00Z',timeZone:'America/New_York',lat:40.71,lon:-74,days:14});
    assert.equal(outlook.data.rows.length,14);
    assert.ok(new TextEncoder().encode(JSON.stringify(outlook)).length<1500000);
    const legacy=['workbench_catalogue','workbench_chart','workbench_symbol','workbench_gematria','workbench_katapayadi','workbench_calendar','workbench_julian_day','workbench_easter','workbench_qibla','workbench_prayer_times','workbench_election'];
    for(const name of legacy)assert.ok(TOOLS.some(t=>t.name===name),name);
    for(const name of ['workbench_compare_moment','workbench_calendar_outlook','workbench_explain_guidance','workbench_calendar_atlas'])assert.ok(TOOLS.some(t=>t.name===name),name);
    assert.equal(new Set(TOOLS.map(t=>t.name)).size,TOOLS.length);
    assert.ok(TOOLS.every(t=>t.inputSchema.additionalProperties===false));
  });
  test('guidance tool reuses canonical rules with explicit observer and bounded source evidence',()=>{
    const input={dateISO:'2026-10-29T12:00:00Z',lat:28.61391,lon:77.20901,timeZone:'Asia/Kolkata'};
    const result=callTool('workbench_explain_guidance',input);
    assert.deepEqual(result.data,buildDayGuidance(input));
    const rules=result.data.traditions.flatMap(t=>t.items);
    assert.equal(rules.length,11);
    const yoga=rules.find(r=>r.id==='DG-J-YOGA');
    assert.equal(yoga.classification,'unavailable');assert.equal(yoga.computed.applicableAtInstant,null);
    assert.equal(yoga.thresholds.openingTimingComputed,false);assert.match(yoga.sourceStatus,/primary-passage verification pending/);
    assert.ok(rules.every(r=>r.wholeDayValidity===false));
    assert.ok(new TextEncoder().encode(JSON.stringify(result)).length<1500000);
    for(const extra of [{dateISO:'2026-10-29'},{dateISO:'2026-02-30T12:00Z'},{timeZone:'Not/AZone'},{lat:91},{lon:Infinity},{apiKey:'never-read'},{days:14}])assert.throws(()=>callTool('workbench_explain_guidance',{...input,...extra}));
    assert.throws(()=>callTool('workbench_explain_guidance',{dateISO:input.dateISO,lat:0,lon:0}));
    const oldFetch=globalThis.fetch;let calls=0;
    globalThis.fetch=()=>{calls++;throw new Error('No network allowed');};
    try {callTool('workbench_explain_guidance',input);assert.equal(calls,0);}finally{globalThis.fetch=oldFetch;}
  });
  test('atlas tool preserves selected source methods and excludes private inputs',()=>{
    const input={dateISO:'2026-10-29T12:00:00Z',lat:51.5,lon:0,timeZone:'Europe/London'};
    const result=callTool('workbench_calendar_atlas',{...input,family:'jewish'});
    assert.deepEqual(result.data,exportCalendarAtlas(input,{familyIds:['jewish']}));
    assert.equal(Object.hasOwn(result.data,'comparison'),false);
    assert.ok(result.data.rows.every(row=>row.familyId==='jewish'));
    const single=callTool('workbench_calendar_atlas',{...input,variant:'julian'}).data;
    assert.deepEqual(single.rows.map(row=>row.id),['julian']);
    assert.equal(Object.hasOwn(single,'comparison'),false);
    const prayerInput={...input,prayerMethod:'Karachi',asr:'Hanafi',highLatitude:'TwilightAngle'};
    assert.deepEqual(callTool('workbench_calendar_atlas',{...prayerInput,variant:'prayer-timetable'}).data,exportCalendarAtlas(prayerInput,{variantIds:['prayer-timetable']}));
    for(const extra of [{prayerMethod:'invented'},{asr:'invented'},{highLatitude:'invented'}])assert.throws(()=>callTool('workbench_calendar_atlas',{...input,...extra}));
    for(const extra of [{family:'invented'},{variant:'invented'},{family:['jewish']},{birth:{date:'2000-01-01'}},{notes:'private'},{dateISO:'2026-02-30T12:00Z'},{timeZone:'No/SuchZone'}])assert.throws(()=>callTool('workbench_calendar_atlas',{...input,...extra}));
    const before=globalThis.fetch;globalThis.fetch=()=>{throw new Error('Atlas must stay local');};
    try{assert.deepEqual(callTool('workbench_calendar_atlas',input).data,exportCalendarAtlas(input));}finally{globalThis.fetch=before;}
    assert.ok(new TextEncoder().encode(JSON.stringify(result)).length<1500000);
  });
  return {pass:!failures.length,passed,failures};
}
if(process.argv[1]?.endsWith('mcp-toolkit.mjs')){const r=run();console.log(r);if(!r.pass)process.exitCode=1;}
