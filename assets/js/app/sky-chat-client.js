// Explicit, caller-owned transport. Reuses the site's provider implementation;
// this module never reads stored keys, browser records or the ChatGPT account.
import { streamChat } from './llm-core.js';
export function normalizeSkyProvider(raw) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).some(k=>!['kind','endpoint','model','key'].includes(k)))throw new TypeError('Use provider kind, endpoint, model and optional key only.');
  if(!['openai','anthropic'].includes(raw.kind))throw new RangeError('Choose OpenAI-compatible or Anthropic transport.');
  if(typeof raw.endpoint!=='string'||raw.endpoint.length>1000)throw new RangeError('Enter a bounded endpoint URL.');
  let endpoint;try{endpoint=new URL(raw.endpoint);}catch{throw new RangeError('Enter the complete provider endpoint URL.');}
  if(endpoint.username||endpoint.password||endpoint.search||endpoint.hash)throw new RangeError('Endpoint URLs cannot contain credentials, queries or fragments.');
  const loopback=['localhost','127.0.0.1','[::1]'].includes(endpoint.hostname);
  if(endpoint.protocol!=='https:'&&!(endpoint.protocol==='http:'&&loopback))throw new RangeError('Use HTTPS, or HTTP only for a loopback local model.');
  if(typeof raw.model!=='string'||!raw.model.trim()||raw.model.length>160)throw new RangeError('Enter a model available at your endpoint.');
  const key=raw.key??'';if(typeof key!=='string'||key.length>4096||/[\r\n]/.test(key))throw new RangeError('Invalid provider key.');
  return {kind:raw.kind,endpoint:endpoint.href,model:raw.model.trim(),key};
}
export async function sendSkyInterpretation({prompt,provider,signal,onDelta=()=>{},timeoutMs=90000},transport=streamChat) {
  const config=normalizeSkyProvider(provider);
  if(!prompt||typeof prompt.system!=='string'||typeof prompt.user!=='string'||new TextEncoder().encode(prompt.system+prompt.user).length>180000)throw new RangeError('Prepare a bounded prompt before sending.');
  if(typeof transport!=='function'||typeof onDelta!=='function'||!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>120000)throw new TypeError('Invalid request controls.');
  const controller=new AbortController(),abort=()=>controller.abort(signal?.reason);
  if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
  if(controller.signal.aborted){signal?.removeEventListener('abort',abort);throw new DOMException('Request cancelled.','AbortError');}
  const timer=setTimeout(()=>controller.abort(new DOMException('Provider timed out.','TimeoutError')),timeoutMs);
  try {
    const result=await transport({provider:{kind:config.kind,url:config.endpoint},url:config.endpoint,model:config.model,key:config.key,system:prompt.system,messages:[{role:'user',content:prompt.user}],maxTokens:3072,signal:controller.signal,onDelta:text=>{
      if(controller.signal.aborted)return;
      if(typeof text!=='string'||text.length>60000){controller.abort();throw new RangeError('Provider output exceeds 60,000 characters.');}
      onDelta(text);
    }});
    if(controller.signal.aborted)throw new DOMException('Request cancelled or timed out.','AbortError');
    if(typeof result!=='string'||result.length>60000)throw new RangeError('Provider returned an invalid response.');
    return result;
  } finally {clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
