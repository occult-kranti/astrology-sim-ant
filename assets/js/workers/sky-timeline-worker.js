// One cancellable timeline at a time; job IDs let the UI discard stale results.
import {buildSkyTimeline} from '../core/sky-dynamics.js';
export function createSkyTimelineWorkerController(postMessage){
 let active=null;
 const send=(type,jobId,extra={})=>postMessage({type,jobId,...extra});
 const reject=(jobId,message,code='INVALID_MESSAGE')=>send('error',jobId,{error:{name:'RangeError',message,code}});
 async function handleMessage(data){
  if(!data||typeof data!=='object'||Array.isArray(data)||typeof data.jobId!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(data.jobId)){reject(null,'Supply a bounded alphanumeric job ID.');return;}
  const{type,jobId}=data;
  if(type==='cancel'){if(active?.jobId===jobId)active.cancelled=true;else reject(jobId,'No matching active sky job.','NO_ACTIVE_JOB');return;}
  if(type!=='start'){reject(jobId,'Choose start or cancel.');return;}
  if(active){reject(jobId,'A sky timeline is already running. Cancel it or use a new worker.','BUSY');return;}
  const token={jobId,cancelled:false};active=token;
  try{const result=await buildSkyTimeline(data.request,{shouldCancel:()=>token.cancelled,onProgress:progress=>send('progress',jobId,{progress}),yieldControl:()=>new Promise(resolve=>setTimeout(resolve,0))});if(token.cancelled)send('cancelled',jobId);else send('result',jobId,{result});}
  catch(error){if(token.cancelled||error?.code==='CANCELLED')send('cancelled',jobId);else send('error',jobId,{error:{name:error?.name||'Error',message:error?.message||'Sky calculation failed.',code:error?.code||'CALCULATION_ERROR'}});}
  finally{if(active===token)active=null;}
 }
 return{handleMessage,cancelAll(){if(active)active.cancelled=true;},get activeJobId(){return active?.jobId??null;}};
}
if(typeof self!=='undefined'&&typeof self.postMessage==='function'&&typeof document==='undefined'){
 const controller=createSkyTimelineWorkerController(message=>self.postMessage(message));self.addEventListener('message',event=>{void controller.handleMessage(event.data);});
}
