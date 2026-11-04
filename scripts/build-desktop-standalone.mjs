#!/usr/bin/env node
// Single-file chart studio export. Build-only dependencies live outside the app.
// npm install --prefix /tmp/desktop-standalone-tools --no-save --package-lock=false esbuild@0.25.11 parse5@7.3.0
// node scripts/build-desktop-standalone.mjs --tools /tmp/desktop-standalone-tools/node_modules --out /workspace/artifacts/desktop-workbench
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),options={tools:'/tmp/desktop-standalone-tools/node_modules',out:'/workspace/artifacts/desktop-workbench'};
for(let i=0;i<args.length;i+=2){const key=args[i]?.replace(/^--/,'');assert.ok(['tools','out'].includes(key)&&args[i+1], 'Use --tools <node_modules path> and/or --out <artifact directory>.');options[key]=args[i+1];}
const tools=resolve(options.tools),out=resolve(options.out);
const {build,version:esbuildVersion}=await import(pathToFileURL(resolve(tools,'esbuild/lib/main.js')));
const {parse,parseFragment,serialize}=await import(pathToFileURL(resolve(tools,'parse5/dist/index.js')));
assert.equal(esbuildVersion,'0.25.11','Use the pinned build-only esbuild version.');
const parse5Package=JSON.parse(await readFile(resolve(tools,'parse5/package.json'),'utf8'));
assert.equal(parse5Package.version,'7.3.0','Use the pinned build-only HTML parser version.');
const siteRoot='https://occult-kranti.github.io/astrology-sim-ant/';
const pageURL=new URL('pages/desktop.html',siteRoot).href;
const moduleURL=new URL('assets/js/app/desktop-workbench.js',siteRoot).href;
const sha=b=>createHash('sha256').update(b).digest('hex');
const sourcePaths=new Set(['pages/desktop.html','scripts/build-desktop-standalone.mjs','assets/js/core/data/desktop-tools.js','assets/js/app/desktop-workbench.js']);
const toRelative=p=>relative(root,p).split(sep).join('/');
const absoluteLink=href=>{const u=new URL(href,pageURL);if(u.href===pageURL)return '#dw-app';if(u.pathname.endsWith('/docs/2026-11-desktop-research.md'))return 'https://github.com/occult-kranti/astrology-sim-ant/blob/feat/desktop-astrology-workbench/docs/2026-11-desktop-research.md';return u.href;};

const offlineStub=`
export function mountOfflineLibrary(container){
 container.innerHTML='<h2>This chart studio works offline.</h2><p>This single HTML file includes the chart calculator, single and comparison wheels, position tables, aspect grids, time navigation, chart-library controls and local cited reference search. Open it in a current desktop browser. No server, installation or sign-in is required for these functions.</p><p>Saving charts depends on your browser allowing storage for local files. Keep a JSON export as your backup; renaming or moving this file may change which saved library the browser exposes. Study, SVG and library exports remain explicit actions.</p><p>Specialist pages, reference documents and hosted AI services require an internet connection. They open in another tab; no birth record is attached to those links. For the complete collection offline, use the full portable ZIP with its local-server instructions.</p><p>The accompanying full-library ZIP is a separate download supplied with this edition. Follow its README to run all included workspaces offline through a local server.</p><p>The research assistant retrieves its included public-source passages offline. Optional generated answers need the local companion and a running model, or a deliberately configured provider. Model weights are a separate download. The AI study packet is also created locally; copying or downloading it does not send it to an AI service.</p>';
}
`;
const cataloguePath=resolve(root,'assets/js/core/data/desktop-tools.js');
const {DESKTOP_TOOLS,DESKTOP_CATEGORIES}=await import(pathToFileURL(cataloguePath));
const catalogueCode=`export const DESKTOP_TOOLS=${JSON.stringify(DESKTOP_TOOLS.map(item=>({...item,href:absoluteLink(item.href)})))};\nexport const DESKTOP_CATEGORIES=${JSON.stringify(DESKTOP_CATEGORIES)};`;

const bundle=await build({
 absWorkingDir:root,
 stdin:{contents:`import {initDesktopWorkbench} from './assets/js/app/desktop-workbench.js';initDesktopWorkbench();`,resolveDir:root,sourcefile:'standalone-entry.js'},
 bundle:true,write:false,format:'iife',platform:'browser',target:['chrome110','firefox115','safari16.4'],
 minify:true,legalComments:'inline',charset:'utf8',metafile:true,treeShaking:true,
 define:{'import.meta.url':JSON.stringify(moduleURL)},
 plugins:[{name:'portable-desktop-only',setup(plugin){
  plugin.onResolve({filter:/\/offline-library\.js$/},args=>({path:'offline-library',namespace:'standalone'}));
  plugin.onLoad({filter:/^offline-library$/,namespace:'standalone'},()=>({contents:offlineStub,loader:'js'}));
  plugin.onLoad({filter:/[/\\]core[/\\]data[/\\]desktop-tools\.js$/},()=>({contents:catalogueCode,loader:'js'}));
  plugin.onLoad({filter:/[/\\]app[/\\]desktop-workbench\.js$/},async args=>{
   let contents=await readFile(args.path,'utf8');
   const target="link.href='birth-reading.html';";
   assert.equal(contents.split(target).length,2,'Review the runtime inspector-link transformation after app changes.');
   contents=contents.replace(target,`link.href=${JSON.stringify(new URL('pages/birth-reading.html',siteRoot).href)};`);
   const toolTarget="a.href=item.href;a.target='_blank';";assert.equal(contents.split(toolTarget).length,2,'Review tool target rewriting after app changes.');contents=contents.replace(toolTarget,"a.href=item.href;a.target=item.href.startsWith('#')?'_self':'_blank';");
   return{contents,loader:'js',resolveDir:dirname(args.path)};
  });
 }}]
});
assert.equal(bundle.outputFiles.length,1,'Export must contain a single JavaScript bundle.');
for(const [name,info]of Object.entries(bundle.metafile.inputs)){
 if(name==='standalone-entry.js'||name.startsWith('standalone:'))continue;
 sourcePaths.add(toRelative(resolve(root,name)));
 for(const imported of info.imports)assert.ok(!imported.external,'All calculation dependencies must be bundled.');
}
const js=bundle.outputFiles[0].text;
assert.match(js,/Copyright \(c\) 2019-2023 Don Cross/,'Retain the bundled astronomy copyright notice.');
assert.match(js,/Permission is hereby granted, free of charge/,'Retain the bundled MIT license text.');
assert.ok(!js.includes('import.meta'),'No runtime module metadata is left in the classic script.');
assert.ok(!/serviceWorker\.register\s*\(/.test(js),'Portable edition must not install a service worker.');
assert.ok(!bundle.metafile.inputs['assets/js/app/shared.js'],'Shared network-capable chrome is excluded.');

const document=parse(await readFile(resolve(root,'pages/desktop.html'),'utf8'));
const getAttr=(n,name)=>n.attrs?.find(a=>a.name===name)?.value;
const setAttr=(n,name,value)=>{n.attrs??=[];const a=n.attrs.find(a=>a.name===name);if(a)a.value=value;else n.attrs.push({name,value});};
const walk=(n,fn)=>{fn(n);for(const child of n.childNodes||[])walk(child,fn);};
const find=tag=>{let match;walk(document,n=>{if(n.tagName===tag&&!match)match=n;});return match;};
const html=find('html'),head=find('head'),body=find('body');
assert.ok(html&&head&&body,'Full HTML document required.');
setAttr(html,'data-ui-theme','midnight');
setAttr(body,'class',(getAttr(body,'class')||'')+' observatory-shell standalone-desktop');
const stylesheetPaths=[],staticLinks=[];
function rewrite(parent){
 parent.childNodes=(parent.childNodes||[]).filter(n=>{
  if(n.tagName==='script')return false;
  if(n.tagName==='link'){
   const rel=getAttr(n,'rel')||'',href=getAttr(n,'href')||'';
   if(rel==='stylesheet'){
    assert.ok(!/^(?:[a-z]+:|\/\/)/i.test(href),'Stylesheets must be local build inputs.');
    stylesheetPaths.push(toRelative(resolve(root,'pages',href)));return false;
   }
   if(rel==='manifest'||rel==='preload'||rel==='prefetch'||rel==='preconnect'||rel==='dns-prefetch')return false;
   assert.ok(href.startsWith('data:')||href.startsWith('#'),'Remaining head resource must be embedded.');
  }
  if(n.tagName==='a'){
   const href=getAttr(n,'href');
   if(href&&!href.startsWith('#')&&!/^(?:data:|blob:|mailto:)/i.test(href)){
    const rewritten=absoluteLink(href);setAttr(n,'href',rewritten);setAttr(n,'target','_blank');setAttr(n,'rel','noopener noreferrer');staticLinks.push(rewritten);
   }
  }
  rewrite(n);return true;
 });
}
rewrite(document);
assert.equal(stylesheetPaths.length,8,'Review stylesheet coverage if the source page changes.');
const styles=[];
for(const path of stylesheetPaths){
 sourcePaths.add(path);
 let css=await readFile(resolve(root,path),'utf8');
 // Font files are deliberately omitted: the original system-font fallbacks are
 // retained. A remote CSS import is an error, not an automatic build fetch.
 css=css.replace(/@font-face\s*\{[^}]*\}/gi,'');
 assert.ok(!/@import\s/i.test(css),`${path}: inline nested styles explicitly.`);
 for(const m of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi))assert.ok(/^(?:data:|#)/i.test(m[2]),`${path}: embed or remove automatic resource ${m[2]}`);
 assert.ok(!/<\/style/i.test(css),'Styles cannot escape their HTML element.');
 styles.push(`/* ${path} */\n${css}`);
}
const portableCSS=`
.standalone-desktop{padding-bottom:0!important}.standalone-desktop .dw-portable-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 24px;background:#0d141a;border-bottom:1px solid #29333c;font:12px/1.5 system-ui,sans-serif;color:#b8c6d1}.standalone-desktop .dw-portable-bar a{color:#a7e6e0;text-decoration:none}.standalone-desktop .dw-portable-bar nav{display:flex;gap:18px;flex-wrap:wrap}.standalone-desktop .dw-portable-bar strong{font-weight:600;color:#e4ebef}.standalone-desktop .dw-portable-status{font:11px/1.5 system-ui,sans-serif;padding:8px 24px;margin:0;color:#a3b2bd;background:#080e13;border-bottom:1px solid #26313a}.standalone-desktop .dw-portable-status a{color:#9ee6dd}.standalone-desktop .dw-portable-bar a:focus-visible{outline:2px solid #83e2db;outline-offset:4px}.standalone-desktop .dw-offline p{max-width:850px}.standalone-desktop .dw-offline a{color:#83e2db}@media(max-width:600px){.standalone-desktop .dw-portable-bar{flex-wrap:wrap;padding:12px 16px}.standalone-desktop .dw-portable-status{padding:8px 16px}.standalone-desktop .dw-portable-bar nav{gap:12px}}@media print{.dw-portable-bar,.dw-portable-status{display:none!important}}
`;
function attach(parent,nodes,before=false){for(const n of nodes)n.parentNode=parent;before?parent.childNodes.unshift(...nodes):parent.childNodes.push(...nodes);}
attach(head,parseFragment(`<style data-standalone-styles>${styles.join('\n')}\n${portableCSS}</style>`).childNodes);
const header=`<a class="skip-link" href="#dw-app">Skip to chart studio</a><header class="site dw-portable-bar"><strong>The Astrologer's Workbench</strong><nav class="main" aria-label="Primary"><a href="#dw-app" aria-current="page">Chart studio</a><a href="#dw-toolbox">All tools</a><a href="#dw-offline">Offline guide</a></nav><span>STANDALONE DESKTOP EDITION</span></header><p class="dw-portable-status">This chart studio works offline. Specialist pages and source links open online in another tab. <a href="#dw-offline">Edition details</a></p>`;
attach(body,parseFragment(header).childNodes,true);
const escapedJS=js.replace(/<\/script/gi,'<\\/script');
attach(body,parseFragment(`<script data-standalone-bundle>${escapedJS}</script>`).childNodes);
// Update the catalogue introduction so the online/offline boundary is visible
// before selecting a specialist route, including after catalogue filtering.
walk(document,n=>{
 if(n.tagName==='section'&&getAttr(n,'id')==='dw-toolbox'){
  const header=n.childNodes.find(c=>c.tagName==='header');
  let paragraphs=[];walk(header,c=>{if(c.tagName==='p'&&getAttr(c,'class')!=='dw-eyebrow')paragraphs.push(c);});
  if(paragraphs[0])paragraphs[0].childNodes=[{nodeName:'#text',value:'Specialist pages open on the published website and require internet. The full portable ZIP includes those tools for offline use with its local-server instructions. This file keeps the chart studio and your unsaved inputs local.',parentNode:paragraphs[0]}];
 }
});
let result=serialize(document)+'\n';
const verification=parse(result);let scripts=0;
walk(verification,n=>{
 if(n.tagName==='script'){scripts++;assert.ok(!getAttr(n,'src'),'No external script resource.');assert.notEqual(getAttr(n,'type'),'module','Classic bundle must run from file://.');}
 if(n.tagName==='link')assert.ok((getAttr(n,'href')||'').startsWith('data:'),'No automatic external links.');
 if(['img','iframe','video','audio','source','embed'].includes(n.tagName))assert.ok(!getAttr(n,'src')||getAttr(n,'src').startsWith('data:'),'No automatic media resource.');
});
assert.equal(scripts,1,'Only the bundled initializer is executable.');
await mkdir(out,{recursive:true});
const artifact=resolve(out,'desktop-chart-studio.html');await writeFile(artifact,result);
const inputs=[];for(const path of [...sourcePaths].sort()){const bytes=await readFile(resolve(root,path));inputs.push({path,bytes:bytes.length,sha256:sha(bytes)});}
let commit='unavailable';try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}catch{}
const receipt={kind:'single-file-desktop-studio-build',schemaVersion:1,sourceCommit:commit,sourceInputsDigest:sha(JSON.stringify(inputs)),inputs,output:{name:'desktop-chart-studio.html',bytes:Buffer.byteLength(result),sha256:sha(result)},buildTools:{esbuild:esbuildVersion,parse5:parse5Package.version},stylesheets:stylesheetPaths,canonicalSpecialistBase:siteRoot,catalogueLinks:DESKTOP_TOOLS.length,rewrittenStaticLinks:staticLinks.length,format:'classic inline IIFE and inline CSS',offlineScope:'Chart studio and included reference retrieval; generated answers need a separate companion/model, and specialist tools and source links are explicit online navigation.',omitted:['Shared chrome and hosted integrations','Service-worker registration and offline installer','Automatic external fonts and resources'],privateData:'Only the committed public Greenwich example; no personal charts are embedded.',runtimeVerification:'Separate actual file:// browser verification required.'};
await writeFile(resolve(out,'standalone-build-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({artifact,bytes:receipt.output.bytes,sha256:receipt.output.sha256,sourceInputs:inputs.length,stylesheets:stylesheetPaths.length,catalogueLinks:DESKTOP_TOOLS.length},null,2));
