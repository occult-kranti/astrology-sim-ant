// Explicit static content download. This module never reads birth inputs,
// calculator outputs, localStorage, profiles or provider credentials.
const ROOT = new URL('../../../', import.meta.url);
const WORKER = new URL('sw.js', ROOT);
const STYLES = new URL('../../css/offline-library.css', import.meta.url);
const ZIP = new URL('offline-workbench.zip', ROOT);
const formatBytes = n => Number.isFinite(n) ? `${(n / 1048576).toFixed(1)} MB` : 'unavailable';
const bounded = (promise, milliseconds, message) => new Promise((resolve,reject) => {
  const timer=setTimeout(()=>reject(Error(message)),milliseconds);
  Promise.resolve(promise).then(v=>{clearTimeout(timer);resolve(v);},e=>{clearTimeout(timer);reject(e);});
});

export function mountOfflineLibrary(container) {
  if (!(container instanceof HTMLElement)) throw TypeError('Choose a container for the offline library.');
  if (container.__offlineLibrary) return container.__offlineLibrary;
  if (!document.querySelector('link[data-offline-library-style]')) {
    const link=document.createElement('link');link.rel='stylesheet';link.href=STYLES.href;link.dataset.offlineLibraryStyle='';document.head.appendChild(link);
  }
  container.classList.add('offline-library');
  container.innerHTML=`<div class="offline-library-heading"><div><p class="offline-library-kicker">Keep the tools with you</p><h2>Read and calculate offline</h2></div><span class="offline-library-connection" data-offline-connection></span></div>
    <p>Download the static workbench to this browser once. Its calendar pages, charts and local calculators can then open without a connection. Your birth inputs and calculated readings are not part of this download.</p>
    <p class="offline-library-scope">Linked books, external websites and web AI still need internet access. After a site update, check and download the new offline edition. Your browser may evict saved files when storage is low.</p>
    <div class="offline-library-status"><span class="offline-library-dot" aria-hidden="true"></span><p data-offline-status role="status" aria-live="polite" aria-atomic="true">Checking this browser’s offline files…</p></div>
    <progress data-offline-progress max="1" value="0" aria-label="Offline file download progress" hidden></progress>
    <p class="offline-library-details" data-offline-details></p><p class="offline-library-storage" data-offline-storage>Browser storage estimate: checking…</p>
    <div class="offline-library-actions"><button type="button" data-offline-action="prepare">Make available offline</button><button type="button" data-offline-action="cancel" hidden>Cancel download</button><button type="button" data-offline-action="refresh">Check offline files</button><button type="button" data-offline-action="clear">Remove offline pack</button></div>
    <details class="offline-library-portable"><summary>Use a portable copy on another computer</summary><p><a data-offline-zip download>Download portable ZIP</a>. Unzip it, open a terminal in that folder and run <code>python -m http.server 8000</code>. Then open <code>http://localhost:8000</code> in your browser. The local server runs on your computer and needs no internet connection.</p><p>The app’s calculator modules need a local server; opening their HTML files directly cannot run them. A separately exported personal HTML report opens directly as a static reading.</p></details>`;
  const status=container.querySelector('[data-offline-status]'),progress=container.querySelector('[data-offline-progress]'),details=container.querySelector('[data-offline-details]'),storage=container.querySelector('[data-offline-storage]'),connection=container.querySelector('[data-offline-connection]');
  const button=name=>container.querySelector(`[data-offline-action="${name}"]`);
  container.querySelector('[data-offline-zip]').href=ZIP.href;
  let destroyed=false,busy=false,revision=0,state={phase:'idle',complete:false},activePort=null,poll=null;
  const supported=window.isSecureContext && location.protocol!=='file:' && 'serviceWorker' in navigator && 'caches' in window && 'MessageChannel' in window;
  const online=()=>{connection.textContent=navigator.onLine?'Browser reports online':'Browser reports offline';connection.dataset.online=String(navigator.onLine);};
  const render=next=>{
    if(destroyed)return;state={...state,...next};container.dataset.state=state.phase;container.dataset.complete=String(state.complete===true);
    const texts={idle:'Offline pack not installed in this edition.',preparing:'Downloading and verifying offline files…',ready:'Offline pack ready. Local pages and calculators are saved.',cancelled:'Download cancelled. Partial offline files were removed.',cancelling:'Cancelling the offline download…',error:'Offline download is incomplete. Reconnect and retry.',unavailable:'Browser offline storage needs HTTPS or localhost and service-worker support. You can use the portable ZIP instead.'};
    status.textContent=state.message || texts[state.phase] || texts.idle;
    const total=Number.isSafeInteger(state.total)?state.total:0,done=Number.isSafeInteger(state.completed)?state.completed:0;
    progress.hidden=!['preparing','cancelling','ready'].includes(state.phase);progress.max=Math.max(1,total);progress.value=done;
    details.textContent=total?`${done} of ${total} files · ${formatBytes(state.downloadedBytes||0)} of ${formatBytes(state.totalBytes)}${state.completedAt?` · saved ${new Date(state.completedAt).toLocaleString()}`:''}`:'';
    const downloading=state.phase==='preparing'||state.phase==='cancelling';
    button('prepare').disabled=!supported||busy||downloading||state.complete===true;button('prepare').textContent=state.phase==='error'||state.phase==='cancelled'?'Retry offline download':'Make available offline';
    button('cancel').hidden=!downloading;button('cancel').disabled=state.phase==='cancelling';button('refresh').disabled=!supported||busy;button('clear').disabled=!supported||busy||downloading;
    clearTimeout(poll);if(!busy&&['preparing','cancelling'].includes(state.phase))poll=setTimeout(()=>void refresh(),1500);
  };
  async function estimate(){
    try{const e=await navigator.storage?.estimate?.();if(!destroyed)storage.textContent=e&&Number.isFinite(e.quota)?`This browser origin uses about ${formatBytes(e.usage)} of ${formatBytes(e.quota)} available quota. The estimate includes other stored workbench data.`:'Browser storage quota is not reported here.';}
    catch{if(!destroyed)storage.textContent='Browser storage quota is not available; a download will report any storage failure.';}
  }
  async function worker(register=false){
    let reg=await navigator.serviceWorker.getRegistration(ROOT.href);
    if(!reg||reg.scope!==ROOT.href){if(!register)return null;reg=await navigator.serviceWorker.register(WORKER.href,{scope:ROOT.href});}
    if(!reg.active&&register){await bounded(navigator.serviceWorker.ready,15000,'The offline worker did not activate. Reload this page and retry.');reg=await navigator.serviceWorker.getRegistration(ROOT.href);}
    return reg?.active||null;
  }
  function send(target,type,onProgress){
    return new Promise((resolve,reject)=>{
      const channel=new MessageChannel();let timer,closed=false;
      const finish=(error,value)=>{if(closed)return;closed=true;clearTimeout(timer);channel.port1.close();if(activePort===channel.port1)activePort=null;error?reject(error):resolve(value);};
      const arm=()=>{clearTimeout(timer);timer=setTimeout(()=>finish(Error(type==='OFFLINE_PREPARE'?'The worker stopped reporting progress. Check the offline files before retrying.':'This worker does not support the offline download controls yet. If an update notice is shown, apply it and reload, then retry.')),type==='OFFLINE_PREPARE'?65000:8000);};
      channel.port1.onmessage=event=>{const result=event.data;if(!result||result.protocolVersion!==1)return;arm();onProgress?.(result);if(result.done===true)finish(null,result);};
      channel.port1.onmessageerror=()=>finish(Error('The offline worker response could not be read. Reload and retry.'));
      if(type==='OFFLINE_PREPARE')activePort=channel.port1;arm();target.postMessage({type},[channel.port2]);
    });
  }
  async function refresh(){
    if(destroyed||busy)return;const mine=++revision;
    if(!supported){render({phase:'unavailable',complete:false});return;}
    try{const target=await worker();const result=target?await send(target,'OFFLINE_STATUS'): {phase:'idle',complete:false,completed:0,total:0};if(!destroyed&&mine===revision)render({...result,message:result.message||null});}
    catch(error){if(!destroyed&&mine===revision)render({phase:'error',complete:false,message:error.message});}
    await estimate();
  }
  async function prepare(){
    if(busy||!supported)return;const mine=++revision;busy=true;render({phase:'preparing',complete:false,completed:0,total:0,message:null});
    try{const target=await worker(true);if(!target)throw Error('The offline worker is not active. Reload and retry.');const result=await send(target,'OFFLINE_PREPARE',s=>{if(mine===revision)render({...s,message:s.message||null});});if(mine===revision)render({...result,message:result.message||null});}
    catch(error){if(mine===revision)render({phase:'error',complete:false,message:error.message});}
    finally{if(mine===revision){busy=false;render(state);await estimate();}}
  }
  async function cancel(){
    if(!busy&&!['preparing','cancelling'].includes(state.phase))return;render({phase:'cancelling',complete:false,message:null});
    try{const target=await worker();if(target)await send(target,'OFFLINE_CANCEL');else throw Error('Offline worker unavailable. Reload and check the saved files.');}
    catch(error){render({phase:'error',complete:false,message:error.message});}
  }
  async function clear(){
    if(busy||!supported)return;const mine=++revision;busy=true;render(state);
    try{const target=await worker();const result=target?await send(target,'OFFLINE_CLEAR'):{phase:'idle',complete:false,completed:0,total:0};if(mine===revision)render({...result,message:result.message||null});}
    catch(error){if(mine===revision)render({phase:'error',complete:false,message:error.message});}
    finally{if(mine===revision){busy=false;render(state);await estimate();}}
  }
  const click=e=>{const action=e.target.closest('[data-offline-action]')?.dataset.offlineAction;if(action==='prepare')void prepare();if(action==='cancel')void cancel();if(action==='refresh')void refresh();if(action==='clear')void clear();};
  const controllerChanged=()=>{if(!busy)void refresh();};
  container.addEventListener('click',click);window.addEventListener('online',online);window.addEventListener('offline',online);navigator.serviceWorker?.addEventListener('controllerchange',controllerChanged);
  online();void refresh();void estimate();
  const api={refresh,destroy(){destroyed=true;revision++;clearTimeout(poll);activePort?.close();container.removeEventListener('click',click);window.removeEventListener('online',online);window.removeEventListener('offline',online);navigator.serviceWorker?.removeEventListener('controllerchange',controllerChanged);delete container.__offlineLibrary;}};
  container.__offlineLibrary=api;return api;
}
