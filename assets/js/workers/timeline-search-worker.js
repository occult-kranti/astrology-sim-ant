import { buildTimelineSearch } from '../core/timeline-search.js';

/** One complete result per generation; cooperative cancel never emits a partial
 * success. Hosts may terminate and replace the worker for immediate replacement. */
export function createTimelineSearchWorkerController(postMessage) {
  let active=null;
  const send=(type,jobId,extra={})=>postMessage({type,jobId,...extra});
  const fail=(jobId,message,code='INVALID_MESSAGE')=>send('error',jobId,{error:{name:'RangeError',message,code}});
  function message(raw) {
    if(!raw||typeof raw!=='object'||![Object.prototype,null].includes(Object.getPrototypeOf(raw)))throw new TypeError('Use a plain worker message.');
    const data=Object.create(null);
    for(const key of Reflect.ownKeys(raw)){const d=Object.getOwnPropertyDescriptor(raw,key);if(typeof key!=='string'||!['type','jobId','request'].includes(key)||!d.enumerable||!Object.hasOwn(d,'value'))throw new TypeError('Unknown or accessor worker message field.');data[key]=d.value;}
    if(typeof data.jobId!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(data.jobId))throw new RangeError('Supply a bounded alphanumeric job ID.');
    if(!['start','cancel'].includes(data.type))throw new RangeError('Choose start or cancel.');
    if(data.type==='cancel'&&Object.hasOwn(data,'request'))throw new RangeError('Cancel messages have no calculation request.');
    if(data.type==='start'&&!Object.hasOwn(data,'request'))throw new RangeError('Start requires a calculation request.');
    return data;
  }
  async function handleMessage(raw) {
    let data;try{data=message(raw);}catch(e){fail(null,e.message);return;}
    const {type,jobId}=data;
    if(type==='cancel'){if(active?.jobId===jobId)active.cancelled=true;else fail(jobId,'No matching active job.','NO_ACTIVE_JOB');return;}
    if(active){fail(jobId,'A scan is already running. Cancel it or replace the worker.','BUSY');return;}
    const token={jobId,cancelled:false};active=token;
    try{
      const result=await buildTimelineSearch(data.request,{shouldCancel:()=>token.cancelled,onProgress:progress=>send('progress',jobId,{progress}),yieldControl:()=>new Promise(resolve=>setTimeout(resolve,0))});
      if(token.cancelled)send('cancelled',jobId);else send('result',jobId,{result});
    }catch(error){if(token.cancelled||error.name==='AbortError'||error.code==='CANCELLED')send('cancelled',jobId);else send('error',jobId,{error:{name:error.name??'Error',message:error.message??'Timeline scan failed.',code:error.code??'CALCULATION_ERROR'}});}
    finally{if(active===token)active=null;}
  }
  return {handleMessage,cancelAll(){if(active)active.cancelled=true;},get activeJobId(){return active?.jobId??null;}};
}
if(typeof self!=='undefined'&&typeof self.postMessage==='function'&&typeof document==='undefined'){
  const controller=createTimelineSearchWorkerController(message=>self.postMessage(message));
  self.addEventListener('message',event=>{void controller.handleMessage(event.data);});
}
