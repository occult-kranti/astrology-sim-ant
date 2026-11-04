// Read-only desktop/RAG adapters. No browser state, model requests, account,
// storage, arbitrary URL or dynamic tool dispatch. Only explicit caller input.
import { buildDesktopStudy } from '../assets/js/core/desktop-workbench.js';
import { normalizeWorkbenchInputs, previewWorkbenchAction, WORKBENCH_ACTION_TYPES, WORKBENCH_BODY_IDS } from '../assets/js/core/workbench-chat-actions.js';
import { buildWorkbenchEvidence } from '../assets/js/core/workbench-rag.js';
import { DESKTOP_TOOLS } from '../assets/js/core/data/desktop-tools.js';

const object=(properties,required=[])=>({type:'object',properties,required,additionalProperties:false});
const text=maxLength=>({type:'string',minLength:1,maxLength});
const choice=values=>({type:'string',enum:[...values]});
const number=(minimum,maximum,integer=false)=>({type:integer?'integer':'number',minimum,maximum});
const frame=choice(['primary','secondary']);
export const workbenchProfileSchema=object({name:text(100),localDate:text(10),localTime:text(8),timeZone:text(120),lat:number(-90,90),lon:number(-180,180),disambiguation:choice(['reject','earlier','later'])},['name','localDate','localTime','timeZone','lat','lon','disambiguation']);
export const workbenchInputsSchema=object({mode:choice(['natal','transit','synastry']),zodiac:choice(['tropical','lahiri']),system:choice(['regiomontanus','placidus','whole','equal']),orb:number(0,10),primary:workbenchProfileSchema,secondary:{...workbenchProfileSchema,description:'Optional complete chart B; omit this property rather than passing null. Required for transit or synastry.'}},['mode','zodiac','system','orb','primary']);
// The finite runtime additionally validates the exact field set for each type.
export const workbenchActionSchema=object({type:choice(WORKBENCH_ACTION_TYPES),mode:choice(['natal','transit','synastry']),zodiac:choice(['tropical','lahiri']),system:choice(['regiomontanus','placidus','whole','equal']),orb:number(0,10),body:choice(WORKBENCH_BODY_IDS),frame,view:choice(['wheel','positions','aspects']),amount:number(-3660,3660,true),unit:choice(['hour','day','month','year']),profile:workbenchProfileSchema,toolId:choice(DESKTOP_TOOLS.map(t=>t.id))},['type']);
export const workbenchRagSearchSchema=object({query:text(1000),limit:number(1,8,true),maxTokens:number(256,6000,true),categories:{type:'array',items:text(80),maxItems:12,minItems:0,uniqueItems:true}},['query']);
export const workbenchDesktopChartSchema=object({inputs:workbenchInputsSchema},['inputs']);
export const workbenchActionPreviewSchema=object({inputs:workbenchInputsSchema,action:workbenchActionSchema,reference:object({primary:workbenchProfileSchema,secondary:workbenchProfileSchema}),revision:number(0,Number.MAX_SAFE_INTEGER,true)},['inputs','action']);

const disclosure=Object.freeze({readOnly:true,storedRecordsRead:false,browserActionExecuted:false,modelUsed:false,networkUsed:false,note:'Only the supplied arguments are read. Chart inputs and returned calculations are visible to this MCP client. An action preview cannot control a browser, save data or send a prompt.'});
function validate(schema,value,path='arguments'){
  if(schema.type==='object'){
    if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw new TypeError(`${path} must be a plain JSON object.`);
    for(const key of Reflect.ownKeys(value)){if(typeof key!=='string'||!Object.hasOwn(schema.properties,key))throw new TypeError(`Unknown ${path} field.`);const d=Object.getOwnPropertyDescriptor(value,key);if(!d.enumerable||!Object.hasOwn(d,'value'))throw new TypeError(`${path} accepts ordinary JSON fields only.`);}
    for(const key of schema.required)if(!Object.hasOwn(value,key))throw new TypeError(`Missing ${path}.${key}.`);
    for(const[key,v]of Object.entries(value))validate(schema.properties[key],v,`${path}.${key}`);return;
  }
  if(schema.type==='array'){if(!Array.isArray(value)||value.length>(schema.maxItems??64)||value.length<(schema.minItems??0))throw new RangeError(`${path} has an invalid length.`);if(schema.uniqueItems&&new Set(value).size!==value.length)throw new RangeError(`${path} must be distinct.`);for(let i=0;i<value.length;i++){if(!Object.hasOwn(value,i))throw new TypeError(`${path} cannot have holes.`);validate(schema.items,value[i],`${path}[${i}]`);}return;}
  if(schema.type==='integer'?!Number.isInteger(value):typeof value!==schema.type)throw new TypeError(`${path} must be ${schema.type}.`);
  if(schema.enum&&!schema.enum.includes(value))throw new RangeError(`${path} has an unsupported value.`);
  if(typeof value==='number'&&(!Number.isFinite(value)||value<schema.minimum||value>schema.maximum))throw new RangeError(`${path} is out of bounds.`);
  if(typeof value==='string'&&(value.length<(schema.minLength??0)||value.length>schema.maxLength))throw new RangeError(`${path} has an invalid length.`);
}
function finish(data){const value={...data,mcpDisclosure:disclosure};const encoded=JSON.stringify(value);if(new TextEncoder().encode(encoded).length>1300000)throw new RangeError('Desktop/RAG response exceeds its 1.3 MB bound. Narrow the request.');return JSON.parse(encoded);}
export function runWorkbenchRagSearch(args){validate(workbenchRagSearchSchema,args);const{query,...options}=args;return finish(buildWorkbenchEvidence(query,options));}
export function runWorkbenchDesktopChart(args){validate(workbenchDesktopChartSchema,args);return finish(buildDesktopStudy(normalizeWorkbenchInputs(args.inputs)));}
export function runWorkbenchActionPreview(args){validate(workbenchActionPreviewSchema,args);return finish(previewWorkbenchAction(args));}
export const WORKBENCH_RAG_MCP_TOOLS=Object.freeze([
  {name:'workbench_rag_search',description:'Retrieve a bounded public local-reference evidence packet from the explicitly curated workbench corpus. Return exact citation IDs, source files/locators, reading depth and rights scope. Deterministic lexical retrieval only; no embedding model, training, full-book coverage, web request or personal chart access.',inputSchema:workbenchRagSearchSchema,calculate:runWorkbenchRagSearch},
  {name:'workbench_desktop_chart',description:'Recompute an explicit desktop natal, transit or synastry study using canonical local engines. Ten planetary bodies plus mean nodes, four declared house systems and tropical or linear Lahiri display; UTC and local dates1900–2100. All profile clocks, zones and locations must be supplied. No unknown-time inference or saved browser context. Omit secondary rather than passing null for a natal-only request.',inputSchema:workbenchDesktopChartSchema,calculate:runWorkbenchDesktopChart},
  {name:'workbench_desktop_action_preview',description:'Validate one strictly allowlisted chart/view/tool proposal and recompute its proposed result. Read-only: never applies the action, opens a URL, changes browser state, saves a profile or sends a model request. The UI must bind the context revision and obtain explicit Apply. Changing to comparison requires explicit chart B; reset requires an explicit reference profile. Unknown fields, arbitrary URLs/code and unsupported actions are rejected.',inputSchema:workbenchActionPreviewSchema,calculate:runWorkbenchActionPreview},
]);
export const WORKBENCH_RAG_MCP_COVERAGE=Object.freeze({
  'desktop-workbench':{mcpTools:['workbench_desktop_chart','workbench_desktop_action_preview'],outputPaths:['data.primary','data.secondary','data.crossAspects','data.methods','data.action','data.inputs'],scope:'Canonical explicit-input chart calculation and read-only action previews; no browser execution, unknown-time inference, provider request or saved records.'},
  'workbench-rag':{mcpTools:['workbench_rag_search'],outputPaths:['data.rows','data.citations','data.context','data.method','data.note'],scope:'Bounded deterministic local retrieval over public source-qualified chunks; no full-book/model training or private chart data.'},
});
