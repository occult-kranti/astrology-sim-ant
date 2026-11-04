// Finite chat proposal protocol. Pure: no DOM, storage, network, code evaluation
// or tool execution. Source text is evidence, never an instruction channel.
import { buildDesktopStudy, normalizeDesktopProfile, stepDesktopProfile, DESKTOP_MODES, DESKTOP_ZODIACS, DESKTOP_HOUSES } from './desktop-workbench.js';
import { DESKTOP_TOOLS } from './data/desktop-tools.js';

export const WORKBENCH_ACTION_TYPES = Object.freeze(['set_mode','set_zodiac','set_houses','set_orb','select_body','set_view','step_time','reset_time','set_chart','open_tool']);
export const WORKBENCH_ACTION_LIMITS = Object.freeze({ queryCharacters: 1000, jsonCharacters: 12000, actions: 3, maximumStep: 3660 });
export const WORKBENCH_BODY_IDS = Object.freeze(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','NorthNode','SouthNode']);
export const WORKBENCH_PROFILE_KEYS = Object.freeze(['name','localDate','localTime','timeZone','lat','lon','disambiguation']);
const frames=['primary','secondary'], views=['wheel','positions','aspects'], units=['hour','day','month','year'];
const ACTION_FIELDS={set_mode:['mode'],set_zodiac:['zodiac'],set_houses:['system'],set_orb:['orb'],select_body:['body','frame'],set_view:['view'],step_time:['amount','unit','frame'],reset_time:['frame'],set_chart:['frame','profile'],open_tool:['toolId']};
const error=(message)=>{throw new TypeError(message);};
function record(value, allowed, required, label) {
  if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))error(`${label} must be a plain JSON object.`);
  for(const key of Reflect.ownKeys(value)){
    if(typeof key!=='string'||!allowed.includes(key))error(`Unknown ${label} field.`);
    const descriptor=Object.getOwnPropertyDescriptor(value,key);
    if(!descriptor.enumerable||!Object.hasOwn(descriptor,'value'))error(`${label} must contain ordinary JSON fields.`);
  }
  for(const key of required)if(!Object.hasOwn(value,key))error(`Missing ${label}.${key}.`);
}
function choice(value, choices, label) { if(!choices.includes(value))throw new RangeError(`Unsupported ${label}.`);return value; }
function bounded(value,min,max,label,integer=false){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw new RangeError(`${label} must be ${integer?'an integer':'a number'} between ${min} and ${max}.`);return value;}
function profile(raw){record(raw,WORKBENCH_PROFILE_KEYS,WORKBENCH_PROFILE_KEYS,'profile');const p=normalizeDesktopProfile(raw);return Object.fromEntries(WORKBENCH_PROFILE_KEYS.map(k=>[k,p[k]]));}

/** Exact caller inputs, not caller-supplied planetary rows or a guessed profile. */
export function normalizeWorkbenchInputs(raw){
  record(raw,['mode','zodiac','system','orb','primary','secondary'],['mode','zodiac','system','orb','primary'],'inputs');
  const mode=choice(raw.mode,DESKTOP_MODES,'mode'),primary=profile(raw.primary),secondary=raw.secondary==null?null:profile(raw.secondary);
  if(mode!=='natal'&&!secondary)throw new RangeError('A comparison requires a complete explicitly supplied chart B; no time or location is inferred.');
  return {mode,zodiac:choice(raw.zodiac,DESKTOP_ZODIACS,'zodiac'),system:choice(raw.system,DESKTOP_HOUSES,'house system'),orb:bounded(raw.orb,0,10,'Aspect orb'),primary,secondary};
}

/** Validates one proposal. It does not execute it, even when valid. */
export function normalizeWorkbenchAction(raw){
  record(raw,['type',...new Set(Object.values(ACTION_FIELDS).flat())],['type'],'action');
  const type=choice(raw.type,WORKBENCH_ACTION_TYPES,'action type'),fields=ACTION_FIELDS[type];
  const required=fields.filter(k=>k!=='frame'||type==='set_chart');
  record(raw,['type',...fields],['type',...required],'action');
  switch(type){
    case 'set_mode':return {type,mode:choice(raw.mode,DESKTOP_MODES,'mode')};
    case 'set_zodiac':return {type,zodiac:choice(raw.zodiac,DESKTOP_ZODIACS,'zodiac')};
    case 'set_houses':return {type,system:choice(raw.system,DESKTOP_HOUSES,'house system')};
    case 'set_orb':return {type,orb:bounded(raw.orb,0,10,'Aspect orb')};
    case 'select_body':return {type,body:choice(raw.body,WORKBENCH_BODY_IDS,'body'),frame:choice(raw.frame??'primary',frames,'chart frame')};
    case 'set_view':return {type,view:choice(raw.view,views,'view')};
    case 'step_time':return {type,amount:bounded(raw.amount,-3660,3660,'Time step',true),unit:choice(raw.unit,units,'time unit'),...(raw.frame===undefined?{}:{frame:choice(raw.frame,frames,'chart frame')})};
    case 'reset_time':return {type,...(raw.frame===undefined?{}:{frame:choice(raw.frame,frames,'chart frame')})};
    case 'set_chart':return {type,frame:choice(raw.frame,frames,'chart frame'),profile:profile(raw.profile)};
    case 'open_tool':{const tool=DESKTOP_TOOLS.find(t=>t.id===raw.toolId);if(!tool)throw new RangeError('Choose an existing allowlisted tool ID. Arbitrary URLs are not accepted.');return {type,toolId:tool.id};}
  }
}
export function normalizeWorkbenchActions(raw){if(!Array.isArray(raw)||raw.length>3)throw new RangeError('Supply at most three separate action proposals.');for(let i=0;i<raw.length;i++)if(!Object.hasOwn(raw,i))throw new TypeError('Action proposals cannot contain holes.');return raw.map(normalizeWorkbenchAction);}
export function parseWorkbenchActionJSON(text){if(typeof text!=='string'||text.length>12000)throw new RangeError('Action JSON must be text of at most 12,000 characters.');let raw;try{raw=JSON.parse(text);}catch{throw new TypeError('Supply one complete JSON action object without surrounding prose or executable code.');}return normalizeWorkbenchAction(raw);}

function explanation(action, inputs){
  switch(action.type){
    case 'set_mode':return `Change the chart workspace to ${action.mode}. Comparison modes require the explicitly supplied chart B; a transit freezes A while B moves, and synastry supplies no applying/separating judgment.`;
    case 'set_zodiac':return `Use ${action.zodiac==='lahiri'?'the inherited linear Lahiri estimate':'the tropical zodiac'} and recompute positions and houses. A coordinate convention is not an outcome forecast.`;
    case 'set_houses':return `Recalculate with ${action.system==='whole'?'whole-sign':action.system} houses. The requested and actually used systems remain visible; polar Placidus fallback is disclosed.`;
    case 'set_orb':return `Use a uniform ${action.orb}° allowance for the five displayed aspect angles. This is an interface comparison rule, not Lilly’s planetary moieties.`;
    case 'select_body':return `Inspect ${action.body} in chart ${action.frame==='primary'?'A':'B'} using its already calculated position and source-qualified evidence. No chart input changes.`;
    case 'set_view':return `Show the ${action.view==='aspects'?'aspect grid':action.view==='positions'?'position and house tables':'chart wheel'}. No chart input changes.`;
    case 'step_time':return `Move chart ${(action.frame??(inputs.mode==='natal'?'primary':'secondary'))==='primary'?'A':'B'} by ${action.amount} ${action.unit}${Math.abs(action.amount)===1?'':'s'}. Hours/days are elapsed UTC time; months/years clamp to a valid UTC calendar day. Recompute the chart and preserve the explicit time zone.`;
    case 'reset_time':return `Restore chart ${(action.frame??(inputs.mode==='natal'?'primary':'secondary'))==='primary'?'A':'B'} to the explicitly supplied reference profile. No stored record is read.`;
    case 'set_chart':return `Replace chart ${action.frame==='primary'?'A':'B'} with the complete profile shown in this proposal. Its clock is resolved against the supplied IANA zone; missing or ambiguous details are rejected.`;
    case 'open_tool':return `Open “${DESKTOP_TOOLS.find(t=>t.id===action.toolId).title}” from the existing tool catalogue. No chart information is attached to its URL.`;
  }
}
const SOURCES={set_mode:['DESKTOP-ASPECTS'],set_zodiac:['DESKTOP-LAHIRI','DESKTOP-ASTRONOMY'],set_houses:['DESKTOP-HOUSES'],set_orb:['DESKTOP-ASPECTS'],select_body:['DESKTOP-ASTRONOMY'],set_view:[],step_time:['DESKTOP-TIME'],reset_time:['DESKTOP-TIME'],set_chart:['DESKTOP-TIME'],open_tool:[]};

/** Recompute a proposed next state. Caller must bind revision and require Apply. */
export function previewWorkbenchAction(raw){
  record(raw,['inputs','action','reference','revision'],['inputs','action'],'preview');
  const inputs=normalizeWorkbenchInputs(raw.inputs),action=normalizeWorkbenchAction(raw.action),revision=raw.revision===undefined?null:bounded(raw.revision,0,Number.MAX_SAFE_INTEGER,'Context revision',true);
  const next={...inputs,primary:{...inputs.primary},secondary:inputs.secondary?{...inputs.secondary}:null};
  let selection=null,view=null,openTool=null,recalculate=true;
  switch(action.type){
    case 'set_mode':next.mode=action.mode;break;
    case 'set_zodiac':next.zodiac=action.zodiac;break;
    case 'set_houses':next.system=action.system;break;
    case 'set_orb':next.orb=action.orb;break;
    case 'select_body':if(action.frame==='secondary'&&(next.mode==='natal'||!next.secondary))throw new RangeError('Chart B is not displayed. Choose a comparison mode with an explicit chart B first.');selection={body:action.body,frame:action.frame};recalculate=false;break;
    case 'set_view':view=action.view;recalculate=false;break;
    case 'open_tool':{const tool=DESKTOP_TOOLS.find(t=>t.id===action.toolId);openTool={id:tool.id,title:tool.title,href:tool.href};recalculate=false;break;}
    case 'set_chart':next[action.frame]={...action.profile};break;
    case 'step_time':case 'reset_time':{
      const frame=action.frame??(next.mode==='natal'?'primary':'secondary');
      if(frame==='secondary'&&(next.mode==='natal'||!next.secondary))throw new RangeError('Chart B is not displayed. Choose a comparison mode with an explicit chart B first.');
      if(action.type==='step_time'){const shifted=stepDesktopProfile(next[frame],action.amount,action.unit);next[frame]=profile(Object.fromEntries(WORKBENCH_PROFILE_KEYS.map(k=>[k,shifted[k]])));}
      else {record(raw.reference,['primary','secondary'],[frame],'reference');next[frame]=profile(raw.reference[frame]);}
      break;
    }
  }
  const normalized=normalizeWorkbenchInputs(next),study=buildDesktopStudy(normalized),sourceIds=SOURCES[action.type];
  return {schemaVersion:1,kind:'workbench-action-preview',requiresConfirmation:true,contextRevision:revision,action,explanation:explanation(action,inputs),sourceIds,sources:study.sources.filter(s=>sourceIds.includes(s.id)),inputs:normalized,recalculate,selection,view,openTool,study,
    execution:'Preview only. The client must check the current context revision and require an explicit Apply action. No DOM, storage, network or tool execution occurred.'};
}

/** Anchored finite grammar: never treat cited prose or partial phrases as commands. */
export function parseWorkbenchIntent(query){
  if(typeof query!=='string')throw new TypeError('Command text must be a string.');if(query.length>1000)throw new RangeError('Command text must be at most 1,000 characters.');
  const q=query.trim().toLowerCase().replace(/^please\s+/,'').replace(/[.!]$/,'').replace(/\s+/g,' ');
  let action=null,m;
  const houses={'whole sign':'whole','whole-sign':'whole','whole':'whole',placidus:'placidus',regiomontanus:'regiomontanus',equal:'equal','equal house':'equal'};
  if((m=/^(?:switch to|use|set houses to|set house system to) (whole sign|whole-sign|whole|placidus|regiomontanus|equal|equal house)(?: houses)?$/.exec(q)))action={type:'set_houses',system:houses[m[1]]};
  else if((m=/^(?:show|use|switch to) (natal|transit|transits|synastry)(?: chart| charts)?$/.exec(q)))action={type:'set_mode',mode:m[1]==='transits'?'transit':m[1]};
  else if((m=/^(?:use|switch to|set zodiac to) (tropical|lahiri|sidereal lahiri)(?: zodiac)?$/.exec(q)))action={type:'set_zodiac',zodiac:m[1]==='tropical'?'tropical':'lahiri'};
  else if((m=/^(?:set|use) (?:an? )?orb(?: of| to)? (\d+(?:\.\d+)?)\s*(?:degrees?|°)?$/.exec(q)))action={type:'set_orb',orb:Number(m[1])};
  else if((m=/^(?:select|inspect) (sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|north node|south node)(?: (?:in|on) chart ([ab]))?$/.exec(q))){const body=WORKBENCH_BODY_IDS.find(x=>x.toLowerCase()===m[1].replace(/ /g,''));action={type:'select_body',body,frame:m[2]==='b'?'secondary':'primary'};}
  else if((m=/^(?:show|open) (?:the )?(wheel|chart wheel|positions|position table|aspect grid|aspects)$/.exec(q)))action={type:'set_view',view:m[1].includes('aspect')?'aspects':m[1].includes('position')?'positions':'wheel'};
  else if((m=/^(next|previous|last) (hour|day|month|year)$/.exec(q)))action={type:'step_time',amount:m[1]==='next'?1:-1,unit:m[2]};
  else if((m=/^(?:move|step) (forward|back|backward) (\d+) (hours?|days?|months?|years?)$/.exec(q)))action={type:'step_time',amount:Number(m[2])*(m[1]==='forward'?1:-1),unit:m[3].replace(/s$/,'')};
  else if(/^(?:reset time|reset timeline|return to reference)$/.test(q))action={type:'reset_time'};
  else if((m=/^open (vedic|vedic studies|calendar atlas|calendar timeline|date search|birth reader|jung|mcp|tools)$/.exec(q))){const map={vedic:'vedic-index','vedic studies':'vedic-index','calendar atlas':'calendar-atlas','calendar timeline':'calendar-timeline','date search':'calendar-search','birth reader':'birth-reading',jung:'jung-tool',mcp:'mcp',tools:'tools'};action={type:'open_tool',toolId:map[m[1]]};}
  else if((m=/^open tool ([a-z0-9-]+)$/.exec(q)))action={type:'open_tool',toolId:m[1]};
  if(!action)return {matched:false,action:null,requiresConfirmation:false,explanation:'No single unambiguous supported command matched. Ask a reference question or use the chart controls; no action was proposed.'};
  const normalized=normalizeWorkbenchAction(action);
  return {matched:true,action:normalized,requiresConfirmation:true,explanation:'Recognized one explicit chart-workspace command. Review the calculated preview and select Apply; this parser never executes it.'};
}
