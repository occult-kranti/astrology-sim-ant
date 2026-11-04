// Source-qualified reading comparisons. Explicit inputs only; no provider, storage
// or browser execution. Textual examples cannot count as numerical validation.
import {exportReadingLab,exportReadingCase,compareReadingCases,READING_FRAMEWORKS,READING_PURPOSES} from '../assets/js/core/reading-lab.js';
import {READING_CASES,READING_SOURCES} from '../assets/js/core/data/reading-cases.js';
import {validateWorkbenchContract} from './workbench-rag-adapters.mjs';

const object=(properties,required=[])=>({type:'object',properties,required,additionalProperties:false});
const text=maxLength=>({type:'string',minLength:1,maxLength});
const choice=values=>({type:'string',enum:values});
const list=(items,maxItems)=>({type:'array',items,minItems:1,maxItems,uniqueItems:true});
export const readingLabInputSchema=object({dateISO:text(13),instantISO:text(40),time:text(8),timeZone:text(120),lat:{type:'number',minimum:-90,maximum:90},lon:{type:'number',minimum:-180,maximum:180},disambiguation:choice(['reject','earlier','later']),system:choice(['regiomontanus','placidus','whole','equal']),frameworks:list(choice(READING_FRAMEWORKS.map(x=>x.id)),9),purpose:choice([...READING_PURPOSES])},['timeZone']);
export const readingLabSchema=object({inputs:readingLabInputSchema,caseId:choice(READING_CASES.map(x=>x.id))});
export const readingExamplesSchema=object({caseIds:list(choice(READING_CASES.map(x=>x.id)),32)});
const disclosure={readOnly:true,networkUsed:false,modelUsed:false,privateRecordsRead:false,browserActionExecuted:false,note:'Explicit calculation inputs are visible to this MCP client. Source field agreement is not outcome prediction accuracy; no private chart library is accessed.'};
function finish(value){const data={...value,mcpDisclosure:disclosure};if(new TextEncoder().encode(JSON.stringify(data)).length>180000)throw new RangeError('Reading response exceeds180KB; select fewer cases.');return data;}
export function runReadingLab(args){
  validateWorkbenchContract(readingLabSchema,args);
  if(Object.hasOwn(args,'inputs')===Object.hasOwn(args,'caseId'))throw new TypeError('Supply exactly one explicit inputs object or public caseId.');
  return finish(args.caseId?exportReadingCase(args.caseId):exportReadingLab(args.inputs));
}
export function runReadingExamples(args){
  validateWorkbenchContract(readingExamplesSchema,args);
  const ids=args.caseIds||READING_CASES.map(c=>c.id),comparison=compareReadingCases(ids);
  const examples=ids.map(id=>{const item=READING_CASES.find(c=>c.id===id),result=exportReadingCase(id);return{caseId:id,title:item.title,traditionId:item.traditionId,methodId:item.methodId,kind:item.kind,input:item.input,sourceIds:item.sourceIds,status:result.status,checks:result.checks,matched:result.matched,total:result.total,evaluability:result.evaluability,outcomeEvaluable:false,interpretation:item.interpretation};});
  const used=new Set(examples.flatMap(x=>x.sourceIds));
  return finish({kind:'public-reading-example-comparison',examples,summary:comparison.summary||{cases:examples.length,matchedFields:examples.reduce((n,x)=>n+x.matched,0),comparedFields:examples.reduce((n,x)=>n+x.total,0)},sources:READING_SOURCES.filter(s=>used.has(s.id)),limits:['Source-method examples have no numerical accuracy denominator.','Recreated printed fields, calendar conversions and original conditional exercises are distinct evidence types.','No measured future outcome or universal auspiciousness score is supplied.']});
}
export const READING_LAB_MCP_TOOLS=Object.freeze([
  {name:'workbench_reading_lab',description:'Calculate or replay one explicit Reading Lab study across nine typed families: Egyptian/Coptic, Maya GMT584283, Dee, historical Western/Lilly with separate Christian computus, Vedic, Chinese, Hebrew, Jung and Plato. Exactly one inputs or public caseId. Date-only never invents a birth clock. Common frame1900–2100; isolated Maya date-only supports its declared BCE epoch. Textual frameworks and missing methods remain explicit. Returns bounded canonical facts, conditional source-qualified exercises and limitations; no prediction accuracy or browser execution.',inputSchema:readingLabSchema,calculate:runReadingLab},
  {name:'workbench_reading_examples',description:'Compare selected registered public worked examples with their independently sourced expected fields and preserve unmatched or unevaluable cases. Optional distinct caseIds; defaults to the curated catalogue. Return source reading depth, convention, exact check values and conditional everyday exercises. Matching a calendar or printed position does not validate an author’s reported life outcome. No free-form expected values, private profiles, model calls or external requests.',inputSchema:readingExamplesSchema,calculate:runReadingExamples}
]);
export const READING_LAB_MCP_COVERAGE=Object.freeze({'reading-lab':{mcpTools:['workbench_reading_lab','workbench_reading_examples'],outputPaths:['data.context','data.frameworks','data.checks','data.examples','data.sources','data.limits'],scope:'Nine source-qualified families, explicit date/moment inputs and registered public examples; calendar arithmetic, partial chart methods and textual reflection stay distinct. No universal outcome score, private records or automatic browser actions.'}});
