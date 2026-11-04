// Keep the managed environment's proxy/CA path for remote providers. Loopback
// inference remains direct. This module never logs URLs with auth or tokens.
import {fetch as undiciFetch,EnvHttpProxyAgent} from 'undici';
let proxyAgent;
export function providerFetch(url,options={}){
 const u=new URL(url);
 if(['127.0.0.1','localhost','[::1]'].includes(u.hostname))return fetch(u,options);
 if(u.protocol!=='https:')throw new TypeError('Remote providers require HTTPS.');
 proxyAgent??=new EnvHttpProxyAgent();
 return undiciFetch(u,{...options,dispatcher:proxyAgent});
}
export async function closeProviderHTTP(){if(proxyAgent){await proxyAgent.close();proxyAgent=null;}}
