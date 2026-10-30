// Module worker: one bounded operation at a time. All messages retain caller job
// IDs; cancellation yields between chunks, and Worker.terminate() is immediate.
import {searchCalendarDates,compareSearchStrategies,analyzeEventCalendarAssociation,buildEventCalendarSignature} from '../core/calendar-search.js';

export function createCalendarSearchWorkerController(postMessage){
 let active=null;
 const send=(type,jobId,rest={})=>postMessage({type,jobId,...rest});
 const error=(jobId,message,code='INVALID_MESSAGE')=>send('error',jobId,{error:{name:'RangeError',message,code}});
 async function handleMessage(data){
  if(!data||typeof data!=='object'||Array.isArray(data)||typeof data.jobId!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(data.jobId)){error(null,'Supply a bounded alphanumeric job ID.');return;}
  const{type,jobId}=data;
  if(type==='cancel'){if(active?.jobId===jobId)active.cancelled=true;else error(jobId,'No matching active job to cancel.','NO_ACTIVE_JOB');return;}
  if(type!=='start'){error(jobId,'Choose start or cancel.');return;}
  if(active){error(jobId,'A job is already running. Cancel it or use a new worker.','BUSY');return;}
  if(!['search','benchmark','association','signature'].includes(data.operation)){error(jobId,'Unknown calendar search operation.');return;}
  const token={jobId,cancelled:false};active=token;
  const hooks={mode:data.mode??'optimized',shouldCancel:()=>token.cancelled,onProgress:progress=>send('progress',jobId,{progress}),yieldControl:()=>new Promise(resolve=>setTimeout(resolve,0))};
  try{
   const result=data.operation==='search'?await searchCalendarDates(data.request,hooks):data.operation==='benchmark'?await compareSearchStrategies(data.request,hooks):data.operation==='association'?await analyzeEventCalendarAssociation(data.request,hooks):await buildEventCalendarSignature(data.request?.event,data.request);
   if(token.cancelled)send('cancelled',jobId);else send('result',jobId,{result});
  }catch(cause){if(token.cancelled||cause?.code==='CANCELLED')send('cancelled',jobId);else send('error',jobId,{error:{name:cause?.name||'Error',message:cause?.message||'The calendar job failed.',code:cause?.code||'CALCULATION_ERROR'}});}
  finally{if(active===token)active=null;}
 }
 return{handleMessage,cancelAll(){if(active)active.cancelled=true;},get activeJobId(){return active?.jobId??null;}};
}

if(typeof self!=='undefined'&&typeof self.postMessage==='function'&&typeof document==='undefined'){
 const controller=createCalendarSearchWorkerController(message=>self.postMessage(message));
 self.addEventListener('message',event=>{void controller.handleMessage(event.data);});
}
