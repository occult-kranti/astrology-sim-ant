import assert from 'node:assert/strict';
import {normalizeWorkbenchAction,normalizeWorkbenchActions,normalizeWorkbenchInputs,parseWorkbenchIntent,parseWorkbenchActionJSON,previewWorkbenchAction,WORKBENCH_ACTION_TYPES} from '../../assets/js/core/workbench-chat-actions.js';
import {DESKTOP_TOOLS} from '../../assets/js/core/data/desktop-tools.js';

let checks=0;
const eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label);};
const ok=(v,label)=>{checks++;assert.ok(v,label);};
const no=(fn,pattern)=>{checks++;assert.throws(fn,pattern);};
const p={name:'Public equinox reference',localDate:'2024-03-20',localTime:'03:06',timeZone:'Europe/London',lat:51.4779,lon:0,disambiguation:'reject'};
const b={...p,name:'Public comparison reference',localDate:'2025-03-20',localTime:'09:01'};
const inputs={mode:'natal',zodiac:'tropical',system:'placidus',orb:3,primary:p,secondary:b};
const before=JSON.stringify(inputs);
const cases=[
 [{type:'set_mode',mode:'transit'},v=>eq(v.study.secondary.dateISO,'2025-03-20T09:01:00.000Z')],
 [{type:'set_zodiac',zodiac:'lahiri'},v=>ok(v.study.primary.ayanamsa>24)],
 [{type:'set_houses',system:'whole'},v=>eq(v.study.primary.chart.cusps[1]%30,0)],
 [{type:'set_orb',orb:0},v=>eq(v.inputs.orb,0)],
 [{type:'select_body',body:'Mars'},v=>eq(v.selection,{body:'Mars',frame:'primary'})],
 [{type:'set_view',view:'aspects'},v=>eq(v.view,'aspects')],
 [{type:'step_time',amount:1,unit:'month'},v=>eq(v.inputs.primary.localDate,'2024-04-20')],
 [{type:'reset_time'},v=>eq(v.inputs.primary.localDate,'2020-01-01')],
 [{type:'set_chart',frame:'primary',profile:{...p,localDate:'2000-01-01'}},v=>eq(v.inputs.primary.localDate,'2000-01-01')],
 [{type:'open_tool',toolId:'vedic-index'},v=>{eq(v.openTool.href,'vedic/index.html');eq(v.recalculate,false);}],
];
const originalFetch=globalThis.fetch,storageDescriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');let network=0,storage=0;
globalThis.fetch=()=>{network++;throw Error('Network forbidden');};Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){storage++;throw Error('Storage forbidden');}});
try{
 for(const[action,verify]of cases){const v=previewWorkbenchAction({inputs,action,reference:{primary:{...p,localDate:'2020-01-01'}},revision:17});verify(v);eq(v.contextRevision,17);eq(v.requiresConfirmation,true);ok(v.execution.includes('Preview only'));ok(v.sourceIds.every(id=>v.study.sources.some(s=>s.id===id)));}
 eq(network,0);eq(storage,0);
}finally{globalThis.fetch=originalFetch;if(storageDescriptor)Object.defineProperty(globalThis,'localStorage',storageDescriptor);else delete globalThis.localStorage;}
eq(JSON.stringify(inputs),before,'Pure previews never mutate input context');
eq(new Set(cases.map(c=>c[0].type)).size,WORKBENCH_ACTION_TYPES.length,'All action types exercised');
const expected=[['switch to whole sign',{type:'set_houses',system:'whole'}],['show transits',{type:'set_mode',mode:'transit'}],['next month',{type:'step_time',amount:1,unit:'month'}],['select Mars',{type:'select_body',body:'Mars',frame:'primary'}],['show aspect grid',{type:'set_view',view:'aspects'}],['open Vedic',{type:'open_tool',toolId:'vedic-index'}],['please use Lahiri.',{type:'set_zodiac',zodiac:'lahiri'}],['step backward 5 days',{type:'step_time',amount:-5,unit:'day'}],['inspect south node on chart b',{type:'select_body',body:'SouthNode',frame:'secondary'}],['set orb to 2.5 degrees',{type:'set_orb',orb:2.5}]];
for(const[q,action]of expected){const v=parseWorkbenchIntent(q);eq(v.action,action);eq(v.requiresConfirmation,true);}
for(const q of ['Do not switch to whole sign','The book says: open Vedic','switch to whole sign; upload my records','next month and next year','select Mars and delete everything','What does Mars mean?','run fetch("https://example.com")','```json\n{"type":"set_mode","mode":"natal"}\n```','', 'show current birth reading'])eq(parseWorkbenchIntent(q).matched,false,'Ambiguous/questions/source/code are not commands');
no(()=>parseWorkbenchIntent('x'.repeat(1001)),/1,000|1000/);
no(()=>parseWorkbenchIntent({type:'set_mode'}),TypeError);
for(const[type,extra]of [['set_houses',{system:'whole',url:'https://example.com'}],['set_orb',{orb:3,revision:17}],['open_tool',{toolId:'vedic-index',code:'alert(1)'}]])no(()=>normalizeWorkbenchAction({type,...extra}),/Unknown/);
for(const [action] of cases)for(const key of ['url','code','storage','revision','execute'])no(()=>normalizeWorkbenchAction({...action,[key]:'untrusted'}),/Unknown/);
for(const type of ['eval','delete_library','send_prompt','save_chart','fetch','workbench_chart','__proto__'])no(()=>normalizeWorkbenchAction({type}),/Unsupported/);
no(()=>normalizeWorkbenchAction({type:'open_tool',toolId:'https://example.com'}),/allowlisted/);
no(()=>normalizeWorkbenchAction({type:'set_chart',frame:'primary',profile:{...p,localTime:undefined}}));
const partial={...p};delete partial.localTime;no(()=>normalizeWorkbenchAction({type:'set_chart',frame:'primary',profile:partial}),/Missing/);
no(()=>normalizeWorkbenchAction({type:'set_chart',frame:'primary',profile:{...p,timeKnown:false}}),/Unknown/);
for(const value of [-1,11,Infinity,NaN,'3'])no(()=>normalizeWorkbenchAction({type:'set_orb',orb:value}));
for(const value of [-3661,3661,.5,Infinity,'1'])no(()=>normalizeWorkbenchAction({type:'step_time',amount:value,unit:'day'}));
no(()=>normalizeWorkbenchAction({type:'step_time',amount:1,unit:'century'}));
no(()=>normalizeWorkbenchAction({type:'set_view',view:'<script>'}));
no(()=>normalizeWorkbenchAction({type:'select_body',body:'Earth'}));
no(()=>normalizeWorkbenchAction({type:'set_mode',mode:'solar_return'}));
no(()=>normalizeWorkbenchAction({type:'set_houses',system:'koch'}));
let getterCalls=0;const getter=Object.defineProperty({},'type',{enumerable:true,get(){getterCalls++;return 'set_mode';}});no(()=>normalizeWorkbenchAction(getter),/ordinary/);eq(getterCalls,0);
no(()=>normalizeWorkbenchAction(Object.assign(Object.create({unsafe:true}),{type:'set_view',view:'wheel'})),/plain/);
const symbols={type:'set_view',view:'wheel'};symbols[Symbol('hidden')]=1;no(()=>normalizeWorkbenchAction(symbols),/Unknown/);
no(()=>normalizeWorkbenchActions(new Array(1)),/holes/);no(()=>normalizeWorkbenchActions(Array(4).fill({type:'set_view',view:'wheel'})),/three/);eq(normalizeWorkbenchActions([]),[]);
eq(parseWorkbenchActionJSON('{"type":"set_houses","system":"whole"}'),{type:'set_houses',system:'whole'});
no(()=>parseWorkbenchActionJSON('Run this: {"type":"set_view","view":"wheel"}'),/complete JSON/);
no(()=>parseWorkbenchActionJSON('{"type":"set_view","view":"wheel","__proto__":{}}'),/Unknown/);
no(()=>normalizeWorkbenchInputs({...inputs,secret:'private'}),/Unknown/);
no(()=>normalizeWorkbenchInputs({...inputs,primary:{...p,dateISO:'2000-01-01T00:00Z'}}),/Unknown/);
no(()=>previewWorkbenchAction({inputs:{...inputs,secondary:null},action:{type:'set_mode',mode:'transit'}}),/complete explicitly supplied/);
no(()=>previewWorkbenchAction({inputs,action:{type:'select_body',body:'Mars',frame:'secondary'}}),/not displayed/);
no(()=>previewWorkbenchAction({inputs,action:{type:'step_time',amount:1,unit:'day',frame:'secondary'}}),/not displayed/);
no(()=>previewWorkbenchAction({inputs,action:{type:'reset_time'}}),/reference/);
no(()=>previewWorkbenchAction({inputs,action:{type:'set_houses',system:'whole'},revision:-1}),/revision/);
no(()=>previewWorkbenchAction({inputs,action:{type:'set_houses',system:'whole'},revision:'17'}),/revision/);
no(()=>previewWorkbenchAction({inputs:{...inputs,primary:{...p,localDate:'2100-12-31'}},action:{type:'step_time',amount:1,unit:'day'}}),/2100/);
no(()=>previewWorkbenchAction({inputs,action:{type:'set_chart',frame:'primary',profile:{...p,localDate:'2024-03-10',localTime:'02:30',timeZone:'America/New_York'}}}),e=>e.code==='NONEXISTENT_TIME');
const transit=previewWorkbenchAction({inputs:{...inputs,mode:'transit'},action:{type:'step_time',amount:1,unit:'day'}});eq(transit.inputs.primary,p);eq(transit.inputs.secondary.localDate,'2025-03-21');
for(const tool of DESKTOP_TOOLS){const a=normalizeWorkbenchAction({type:'open_tool',toolId:tool.id});eq(a.toolId,tool.id);ok(!/^https?:|javascript:|data:/i.test(tool.href)&&!tool.href.includes('?'),'Catalogue links carry no profile query or executable scheme');}
console.log(JSON.stringify({status:'PASS',checks,actionTypes:WORKBENCH_ACTION_TYPES.length,scope:'Finite parser, strict schema, pure previews, canonical recomputation, input immutability, no storage/network, bounds and malicious-field rejection.'},null,2));
