// Public-repository allowlist -> reproducible local reference corpus.
// No filesystem traversal beyond the explicit page catalogue, no external fetches,
// no private profiles, source-book downloads, evidence dumps or model training.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DESKTOP_TOOLS } from '../assets/js/core/data/desktop-tools.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
const sha = text => createHash('sha256').update(text).digest('hex');
const MAX_TEXT = 1400;
const categories = ['charts','calendars','timing','vedic','symbols','books','research','software','tools','sources'];
const sourceRights = 'Existing public-repository material indexed as local reference. Underlying works retain their own rights; a citation or free download is not permission to reproduce or train on a whole work.';
const files = new Map(), chunks = [];
function read(file) {
  if (!/^(pages\/|docs\/[^/]+\.md$|assets\/js\/core\/data\/|mcp\/README\.md$|index\.html$)/.test(file) || /(?:private|evidence|telemetry|node_modules|vendor|workbench-rag-corpus)/i.test(file)) throw new Error(`Unapproved corpus file: ${file}`);
  const absolute = resolve(root, file);
  if (!absolute.startsWith(root)) throw new Error('Outside repository');
  const raw = readFileSync(absolute, 'utf8');
  files.set(file, { file, bytes: Buffer.byteLength(raw), sha256: sha(raw), chunks: 0 });
  return raw;
}
function entities(text) {
  const names = { amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',hellip:'…',rsquo:'’',lsquo:'‘',ldquo:'“',rdquo:'”',deg:'°',times:'×',minus:'−' };
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, value) => {
    if (value[0] !== '#') return names[value.toLowerCase()] ?? match;
    const n = value[1].toLowerCase() === 'x' ? parseInt(value.slice(2),16) : parseInt(value.slice(1),10);
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' ';
  });
}
function plain(text) {
  return entities(String(text).replace(/<(script|style|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ')
    .replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')).trim();
}
function sections(text) {
  const result=[];
  while (text.length > MAX_TEXT) {
    // Keep the final fragment meaningful instead of indexing a dangling few words.
    const target=Math.min(MAX_TEXT,text.length-140);
    let split = text.lastIndexOf('. ', target - 1);
    if (split < target * .5) split = text.lastIndexOf(' ', target);
    if (split < 1) split = MAX_TEXT;
    else split += 1;
    result.push(text.slice(0,split).trim()); text=text.slice(split).trim();
  }
  if (text) result.push(text);
  return result;
}
function add({file,title,locator,text,category='sources',readingDepth='reference-note',url=file,tags=[],rightsScope=sourceRights,sourceReadingDepth,sourceUnit}) {
  const clean=plain(text);
  if(clean.length < 35) return;
  for(const [i,part] of sections(clean).entries()) {
    const where=`${locator}${i ? ` · continuation ${i+1}` : ''}`;
    const id=`WRAG-${sha(`${file}\n${where}\n${part}`).slice(0,16)}`;
    if(chunks.some(c=>c.id===id)) continue;
    const sourceKey=sourceUnit ? `${file}\n${sourceUnit.exportName}\n${sourceUnit.recordId}` : file;
    chunks.push({id,sourceId:`WRS-${sha(sourceKey).slice(0,16)}`,...(sourceUnit?{sourceUnit}:{}),title:plain(title).slice(0,220),text:part,category,
      tags:[...new Set(tags.map(x=>plain(x)).filter(Boolean))].slice(0,16),file,locator:where,url,
      readingDepth,rightsScope,sourceReadingDepth:(sourceReadingDepth ? `Source-review scope: ${sourceReadingDepth}` : null) || (readingDepth==='full-text' ? 'Text of this project document only; referenced books and articles were not ingested in full.' : readingDepth==='metadata' ? 'Catalogue or tool metadata only; not the full referenced source.' : 'Existing project explanation or source note; not a new reading of the referenced work.'),
      textSHA256:sha(part),sourceFileSHA256:files.get(file).sha256});
    files.get(file).chunks++;
  }
}
function categoryFor(path) {
  if(/calendar|horizon-observance/.test(path))return 'calendars';
  if(/(?:mcp|standard|desktop|offline|sky-ai|tool-coverage)/.test(path))return 'software';
  if(/(?:vedic|muhurta|prasna|tajika|kuta|tithi|yoga-rules)/.test(path))return 'vedic';
  if(/(?:newton|eschatology|country|chronology|cycles|experiment)/.test(path))return 'research';
  if(/(?:greatworks|practitioner|library|buddhist|yogasutra|yoga\/|jung|confluence|read\.html)/.test(path))return 'books';
  if(/(?:picatrix|sigil|symbol|iching|tarot|rune|kabbalah|geomancy|rasa|incense|mansion|behenian)/.test(path))return 'symbols';
  if(/(?:timelord|transit|moment|trajectory|timing|planetary-hour|event)/.test(path))return 'timing';
  if(/(?:source|glossary|about)/.test(path))return 'sources';
  return 'charts';
}
// Static page whitelist is the existing navigation catalogue, plus the new desktop.
const pageFiles=[...new Set(DESKTOP_TOOLS.map(t=>relative(root,resolve(root,'pages',t.href))))].filter(p=>!p.includes('private'));
if(existsSync(resolve(root,'pages/desktop.html'))&&!pageFiles.includes('pages/desktop.html'))pageFiles.push('pages/desktop.html');
for(const file of pageFiles.sort()) {
  const raw=read(file), title=plain(/<title>([\s\S]*?)<\/title>/i.exec(raw)?.[1] || file);
  const body=/<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(raw)?.[1] || /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(raw)?.[1] || '';
  const safe=body.replace(/<(script|style|svg|nav|header|footer|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ');
  const parts=safe.split(/(<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>)/gi);
  let heading='Page introduction',anchor='';
  for(const part of parts) {
    if(/^<h[1-6]\b/i.test(part)){heading=plain(part);anchor=/\bid=["']([^"']+)/i.exec(part)?.[1] || '';continue;}
    add({file,title:`${title.split(' | ')[0]} · ${heading}`,locator:heading,text:part,category:categoryFor(file),url:file+(anchor?`#${anchor}`:''),tags:[file.split('/')[1]||'home']});
  }
}
const docFiles=[
 '2026-10-05-domain-methods.md','2026-10-05-study-sources.md','2026-10-05-symbol-methods.md',
 '2026-10-atlas-methods.md','2026-10-atlas-search-methods.md','2026-10-calculation-methods.md',
 '2026-10-calendar-alignment.md','2026-10-calendar-inverse-methods.md','2026-10-calendar-methods.md',
 '2026-10-calendar-observatory-ai.md','2026-10-calendar-observatory-research.md','2026-10-calendar-timeline-engine.md',
 '2026-10-calendar-timeline-methods.md','2026-10-chart-relationships-methods.md','2026-10-country-history-methods.md',
 '2026-10-ensemble-calendar.md','2026-10-eschatology-atlas-methods.md','2026-10-horizon-methods.md',
 '2026-10-horizon-ranking.md','2026-10-newton-chronology-methods.md','2026-10-newton-sources.md',
 '2026-10-sky-ai-rag.md','2026-10-sky-sources.md','2026-10-studio-sources-standards.md',
 '2026-10-world-events-sources.md','2026-11-chart-console-offline.md','2026-11-desktop-workbench.md',
 '2026-11-orbital-space-methods.md','2026-11-reading-lab-sources.md',
].map(f=>`docs/${f}`).concat('mcp/README.md');
for(const file of docFiles) {
  const raw=read(file).replace(/```[\s\S]*?```/g,'\n[Code example omitted from prose retrieval; inspect the linked document.]\n');
  let heading=file;
  for(const part of raw.split(/(^#{1,6} .+$)/m)) {
    if(/^#{1,6} /.test(part)){heading=part.replace(/^#+ /,'');continue;}
    add({file,title:heading,locator:heading,text:part,category:categoryFor(file),readingDepth:'full-text',url:file==='mcp/README.md'?'https://github.com/occult-kranti/astrology-sim-ant/blob/feat/desktop-astrology-workbench/mcp/README.md':file,tags:[file.split('/').at(-1).replace(/\.md$/,'')],rightsScope:'Full prose of this project-authored documentation is indexed; code blocks omitted. Underlying cited books and articles remain references, with their own rights.'});
  }
}
// Explicit exports, never arbitrary module discovery. Full modern book files are absent.
const modules={
 'sky-reading-sources':['SKY_READING_SOURCES','SKY_READING_CHUNKS'],
 'greatworks':['GW_METHOD_NOTE','GREAT_WORKS'],
 'greatworks-east':['EG_METHOD_NOTE','GREAT_WORKS_EAST'],
 'practitioners':['TIER_DEFS','TIER_VOCAB_NOTE','JOURNALS','LIBRARY_METHOD_NOTE','PRACTITIONERS'],
 'glossary':['GLOSSARY'],
 'jung-astrology':['JUNG_PLANET_ARCHETYPES','ELEMENT_FUNCTIONS','ANIMA_ANIMUS_NOTE','CONIUNCTIO_NOTE','JUNG_EXPERIMENT','AEON','JUNG_TIMELINE'],
 'chronology':['CHRONOLOGY_ERAS','CHRONOLOGY_ENTRIES'],
 'study-lenses':['STUDY_LENSES'],
 'reading-cases':['READING_CASES','READING_SOURCES','READING_METHOD_NOTES'],
 'mcp-tool-contracts':['MCP_TOOL_CONTRACTS'],
 'observatory-standards':['OBSERVATORY_STANDARDS'],
 'birth-reading-sources':['BIRTH_READING_SOURCES','BIRTH_COMPARISON_PRINCIPLES','BIRTH_METHOD_COMPARISONS','BIRTH_LIFE_DOMAINS'],
 'newton-chronology-sources':['NEWTON_CHRONOLOGY_SOURCES','NEWTON_CHRONOLOGY_SCENARIOS','NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS','NEWTON_CHRONOLOGY_LIMITS'],
 'eschatology-comparisons':['ESCHATOLOGY_COMPARISON_SOURCES','ESCHATOLOGY_COMPARISONS','ESCHATOLOGY_COMPARISON_COVERAGE'],
 'planets':['PLANETS'], 'houses':['HOUSES'], 'signs':['SIGNS'],
 'lunar-mansions':['LUNAR_MANSIONS'], 'behenian-stars':['BEHENIAN_STARS'],
 'vedic-data':['RASHIS','RASHI_SOURCE','NAKSHATRAS','NAKSHATRA_SOURCE','VIMSHOTTARI','VIMSHOTTARI_SOURCE','GRAHAS','KARAKAS','TITHIS','YOGAS','PANCHANGA_SOURCE','VARGA_LIST','VARGA_SOURCE','SHADBALA_SOURCE'],
 'muhurta-data':['MUHURTA_NAMES_SOURCE','MUHURTA_NAMES','ABHIJIT','BRAHMA','TITHI_SCREEN','YOGA_SCREEN','KARANA_SCREEN','NAKSHATRA_CLASSES','MUHURTA_CLASSICAL_SOURCE'],
 'horizon-traditions':['HORIZON_TRADITION_SOURCES','HORIZON_TRADITIONS','HORIZON_TRADITION_COVERAGE'],
 'yogasutra/meta':['YS_META'], 'buddhist/index':['BUDDHIST_TEXTS'],
};
const omit=new Set(['glyph','color','colour','svg','diagram','icon','agentTemplate','systemPrompt','prompt','sample','example','sql','code','implementationSource']);
function strings(value,prefix='',depth=0) {
  if(depth>12||value==null||typeof value==='function')return [];
  if(typeof value==='string')return value.trim()?[(prefix?`${prefix}: `:'')+plain(value)]:[];
  if(typeof value==='number'||typeof value==='boolean')return prefix?[`${prefix}: ${value}`]:[];
  if(Array.isArray(value))return value.flatMap((v,i)=>strings(v,typeof v==='object'?`${prefix} ${i+1}`:prefix,depth+1));
  return Object.entries(value).filter(([k])=>!omit.has(k)).flatMap(([k,v])=>strings(v,k.replace(/([a-z])([A-Z])/g,'$1 $2'),depth+1));
}
function record(file,exportName,value,path=exportName,parentTitle='') {
  if(value==null||typeof value==='function')return;
  if(Array.isArray(value)){value.forEach((v,i)=>record(file,exportName,v,`${path}[${i}]`,parentTitle));return;}
  if(typeof value!=='object'){
    add({file,title:parentTitle||exportName.replaceAll('_',' '),locator:path,text:strings(value).join(' '),category:categoryFor(file),tags:[exportName],readingDepth:'reference-note'});return;
  }
  const title=plain(value.title||value.name||value.term||value.planet||value.id||parentTitle||path);
  // Split authored book chapter trees without duplicating an entire catalogue per chunk.
  const nested=new Set(['authors','works','books','chapters','sections']);
  const scalar=Object.fromEntries(Object.entries(value).filter(([k])=>!nested.has(k)));
  const dictionary=!Object.keys(scalar).some(k=>['title','name','term','id','planet','text','def','description','summary','method','cite','meaning','source','note','notes','who'].includes(k));
  if(dictionary && Object.values(scalar).every(v=>v&&typeof v==='object')) {
    for(const [k,v] of Object.entries(scalar))record(file,exportName,v,`${path}.${k}`,`${parentTitle} ${k}`.trim());
  } else {
    // A bundled data file is not one authored passage. Keep continuation chunks
    // together while allowing distinct cases, references and methods to compete
    // under the existing diversity cap. These units are not independent evidence.
    const readingUnitKinds={READING_CASES:'case',READING_SOURCES:'reference',READING_METHOD_NOTES:'method'};
    const sourceUnit=file==='assets/js/core/data/reading-cases.js'&&readingUnitKinds[exportName] ? {
      kind:readingUnitKinds[exportName],exportName,recordId:value.id||path,
      bibliographicSourceIds:exportName==='READING_SOURCES'?[value.id]:[...(value.sourceIds||[])],
      scope:'Retrieval grouping only; shared bibliography does not imply independent corroboration.',
    }:undefined;
    const sourceReadingDepth=sourceUnit?.kind==='case'
      ? `Project worked example combining cited source facts with modern conditional exercises; scenarios/questions/actions are project-authored, not historical quotations or validated predictions. Source IDs: ${sourceUnit.bibliographicSourceIds.join(', ')}.`
      : typeof(value.readingDepth||value.readingStatus)==='string'?(value.readingDepth||value.readingStatus):undefined;
    add({file,title:`${parentTitle ? `${parentTitle} · ` : ''}${title}`,locator:path,text:strings(scalar).join(' '),category:categoryFor(file),tags:[exportName,value.id,value.domain,value.practice,value.cat].filter(Boolean),readingDepth:exportName==='MCP_TOOL_CONTRACTS'?'metadata':'reference-note',url: typeof value.url==='string' && /^(https?:|pages\/|docs\/)/.test(value.url)?value.url:file,
      rightsScope:typeof value.rights==='string'?value.rights:sourceRights,sourceReadingDepth,sourceUnit});
  }
  for(const key of nested)if(value[key])record(file,exportName,value[key],`${path}.${key}`,title);
}
for(const [name,exports] of Object.entries(modules)) {
  const file=`assets/js/core/data/${name}.js`;read(file);
  const module=await import(pathToFileURL(resolve(root,file)));
  for(const key of exports) {
    if(!(key in module))throw new Error(`Missing allowlisted export ${name}:${key}`);
    record(file,key,module[key]);
  }
}
// Navigation records expose all available tools even when a page renders its prose dynamically.
const catalogueFile='assets/js/core/data/desktop-tools.js';read(catalogueFile);
for(const tool of DESKTOP_TOOLS) add({file:catalogueFile,title:tool.title,locator:`DESKTOP_TOOLS.${tool.id}`,text:`${tool.title}. ${tool.description} Open the existing ${tool.category} tool at ${tool.href}. Availability and calculation limits are explained by that tool.`,category:'tools',readingDepth:'metadata',tags:[tool.category,tool.id],url:relative(root,resolve(root,'pages',tool.href))});
chunks.sort((a,b)=>a.file.localeCompare(b.file)||a.locator.localeCompare(b.locator)||a.id.localeCompare(b.id));
const jsonl=chunks.map(c=>JSON.stringify(c)).join('\n')+'\n';
const coverage={schemaVersion:1,scope:'Explicit public-repository allowlist; existing reference notes, project-document prose, page explanations, book catalogues and tool metadata.',
 categories:Object.fromEntries(categories.map(c=>[c,chunks.filter(x=>x.category===c).length])),
 readingDepth:Object.fromEntries(['full-text','reference-note','metadata'].map(d=>[d,chunks.filter(x=>x.readingDepth===d).length])),
 definition:{'full-text':'Project-document prose only, not full underlying books; code blocks omitted.','reference-note':'Existing original explanation, selected-source paraphrase or bibliographic/book study note.','metadata':'Tool/catalogue metadata; not the referenced source text.'},
 excluded:['Private chart libraries, prompts, birth data and reading reports','All files outside this repository','Downloaded third-party full books and external web pages','Evidence, telemetry, test artifacts, credentials and node_modules','Raw application code, vendored libraries and generated numerical datasets','Full scripture translations: only existing metadata and original study notes are indexed in this corpus'],
 inventories:{pageCount:pageFiles.length,documentationCount:docFiles.length,dataModuleCount:Object.keys(modules).length+1,sourceFileCount:files.size,chunkCount:chunks.length,retrievalUnitCount:new Set(chunks.map(c=>c.sourceId)).size},
 retrievalGrouping:'Reading Lab cases, source records and method notes have separate retrieval units; continuation chunks share their unit. Other files retain file-level grouping. Units sharing bibliography are not independent evidence.',
 sourceFiles:[...files.values()].sort((a,b)=>a.file.localeCompare(b.file)),
 limitations:['Indexing a repository note does not newly verify its source or license every referenced edition.','Bibliographic coverage is not proof that a whole book was read.','The browser corpus is lexical reference retrieval; no embeddings or fine-tuning are claimed.','The public corpus never supplies personal chart facts. Chart readings require separately computed, explicitly supplied chart context.']};
const manifest={schemaVersion:1,kind:'workbench-public-reference-corpus',generator:'scripts/build-workbench-rag.mjs',chunkCount:chunks.length,sourceCount:files.size,retrievalUnitCount:coverage.inventories.retrievalUnitCount,categories,
 corpusSHA256:sha(jsonl),coverageSHA256:sha(JSON.stringify(coverage)),sourceGraphSHA256:sha([...files.values()].sort((a,b)=>a.file.localeCompare(b.file)).map(x=>`${x.file}\t${x.sha256}`).join('\n')),
 maxChunkCharacters:MAX_TEXT,scope:coverage.scope,readingDepth:coverage.readingDepth,trainingPerformed:false,trainingScope:'This retrieval-corpus build performs no training. Separately documented experimental adapters use original, licensed training fixtures; their weights and evaluation sets are not indexed here.',externalBooksDownloaded:false,privateDataIncluded:false};
const js=`// Generated by scripts/build-workbench-rag.mjs. Do not hand edit.\n// Public reference notes and metadata, not full books or training data.\nexport const WORKBENCH_RAG_MANIFEST = Object.freeze(${JSON.stringify(manifest)});\nexport const WORKBENCH_RAG_CHUNKS = Object.freeze(${JSON.stringify(chunks)}.map(Object.freeze));\n`;
if(Buffer.byteLength(js)>5*1024*1024)throw new Error(`Corpus exceeds 5MiB: ${Buffer.byteLength(js)}`);
const outputs=new Map([['assets/js/core/data/workbench-rag-corpus.js',js],['research/workbench-rag/chunks.jsonl',jsonl],['research/workbench-rag/manifest.json',JSON.stringify({...manifest,browserCorpusBytes:Buffer.byteLength(js)},null,2)+'\n'],['research/workbench-rag/coverage.json',JSON.stringify(coverage,null,2)+'\n']]);
for(const [file,content]of outputs){const path=resolve(root,file);if(check){if(readFileSync(path,'utf8')!==content)throw new Error(`Stale RAG artifact: ${file}`);}else{mkdirSync(dirname(path),{recursive:true});writeFileSync(path,content);}}
console.log(JSON.stringify({mode:check?'check':'generate',chunks:chunks.length,sources:files.size,bytes:Buffer.byteLength(js),categories:coverage.categories,corpusSHA256:manifest.corpusSHA256},null,2));
