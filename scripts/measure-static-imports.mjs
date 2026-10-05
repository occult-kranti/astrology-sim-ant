// Static ESM source graph, not a bundle, network transfer or load-time benchmark.
import {execFileSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
import {posix} from 'node:path';
const revision=process.argv[2]||'HEAD';
const commit=execFileSync('git',['rev-parse',revision],{encoding:'utf8'}).trim();
const cache=new Map();
function source(path){if(!cache.has(path))cache.set(path,execFileSync('git',['show',`${commit}:${path}`],{encoding:'utf8'}));return cache.get(path);}
const pattern=/(?:^|\n)\s*(?:import\s+(?!\()[^;]*?\bfrom\s*|import\s*|export\s+\{[^}]*\}\s*from\s*|export\s*\*\s*from\s*)['"]([^'"]+)['"]/g;
function graph(entry){
 const seen=new Set();
 function dependencies(code,path){for(const match of code.matchAll(pattern)){if(!match[1].startsWith('.'))continue;const next=posix.normalize(posix.join(posix.dirname(path),match[1]));if(next.startsWith('../'))throw Error('Dependency escapes repository');visit(next);}}
 function visit(path){if(seen.has(path))return;seen.add(path);dependencies(source(path),path);}
 if(entry.endsWith('.html')){
   for(const match of source(entry).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
     const src=/\bsrc=["']([^"']+)["']/.exec(match[1]);
     if(src && !/^(https?:|data:)/.test(src[1]))visit(posix.normalize(posix.join(posix.dirname(entry),src[1])));
     dependencies(match[2],entry);
   }
 }else visit(entry);
 let raw=0,gzip=0;for(const path of seen){const code=source(path);raw+=Buffer.byteLength(code);gzip+=gzipSync(code,{level:9}).length;}
 return{entry,modules:seen.size,sourceBytes:raw,summedGzip9Bytes:gzip,files:[...seen].sort()};
}
console.log(JSON.stringify({commit,condition:'Literal static ESM imports/re-exports from page script entries including shared chrome; excludes HTML bytes, dynamic imports, CSS/fonts, HTTP/cache and actual browser timings; summed per-file gzip level9.',graphs:['pages/workbench.html','pages/studio.html'].map(graph)},null,2));
