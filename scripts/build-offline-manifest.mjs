// The optional offline library is a deterministic, public, static-file inventory.
// Never include profiles, exported readings, credentials, research downloads or CI evidence.
import {lstat, readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname, extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination='assets/offline-manifest.json';
const allowed=new Set(['.html','.js','.mjs','.css','.json','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.otf','.webmanifest']);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function regularPublicFile(path){
  if(!/^[A-Za-z0-9_./-]+$/.test(path)||path.includes('//')||path.split('/').some(part=>!part||part.startsWith('.')))throw Error('Invalid offline path: '+path);
  let current=root;
  for(const part of path.split('/')){
    current=resolve(current,part);
    if((await lstat(current)).isSymbolicLink())throw Error('Offline inventory cannot follow symlinks: '+path);
  }
  if(!(await lstat(current)).isFile())throw Error('Offline entry is not a regular file: '+path);
}
// Only deliberate Git additions are public. Untracked imports/exports are excluded.
const tracked=execFileSync('git',['ls-files','--cached','-z','--','index.html','manifest.webmanifest','pages','assets'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const paths=tracked.filter(path=>path!==destination&&allowed.has(extname(path))&&!path.split('/').some(part=>part.startsWith('.')||part==='node_modules')).sort();
if(!paths.includes('index.html')||!paths.includes('manifest.webmanifest'))throw Error('Required public root files are not tracked.');
if(new Set(paths).size!==paths.length||paths.length>1500)throw Error('Unexpected offline file inventory.');
const files=await Promise.all(paths.map(async path=>{await regularPublicFile(path);const bytes=await readFile(resolve(root,path));if(bytes.length>32*1024*1024)throw Error('Offline file exceeds 32 MiB: '+path);return{path,bytes:bytes.length,sha256:hash(bytes)};}));
const totalBytes=files.reduce((sum,file)=>sum+file.bytes,0);
if(totalBytes>100*1024*1024)throw Error('Offline library exceeds the reviewed 100 MiB limit.');
const manifest={schemaVersion:1,version:hash(JSON.stringify(files)),totalBytes,files};
const result=JSON.stringify(manifest,null,2)+'\n';
if(process.argv.includes('--check')){
  if(await readFile(resolve(root,destination),'utf8')!==result)throw Error('Offline inventory is stale. Run node scripts/build-offline-manifest.mjs after public asset changes.');
  console.log(`Offline manifest current: ${files.length} public files, ${totalBytes} bytes, ${manifest.version}.`);
}else{
  await writeFile(resolve(root,destination),result);
  console.log(`Built ${destination}: ${files.length} public files, ${(totalBytes/1048576).toFixed(1)} MiB.`);
}
