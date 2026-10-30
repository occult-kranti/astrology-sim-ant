// Small, deterministic local retrieval corpus. No embeddings, network or model training.
import { SKY_READING_CHUNKS, SKY_READING_SOURCES } from './data/sky-reading-sources.js';
const STOP=new Set('a an and are as at be by can do does for from how i in is it of on or that the their these this to was what when which with would you your'.split(' '));
const LENSES=['lilly','agrippa','jyotisha','astronomy'];
export const SKY_RETRIEVAL_METHOD=Object.freeze({id:'sky-local-bm25-v1',kind:'lexical-retrieval',k1:1.2,b:0.75,titleWeight:2,tagWeight:2,corpusScope:'Selected, original source paraphrases; not full books, embeddings or a fine-tuned model.',relevance:'Scores rank lexical overlap in this small corpus; not confidence, truth or prediction probability.'});
function words(text){return text.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter(x=>x.length>1&&!STOP.has(x))||[];}
function checkOptions(options){if(!options||typeof options!=='object'||Array.isArray(options)||Object.keys(options).some(k=>!['limit','lensIds'].includes(k)))throw new TypeError('Use only limit and lensIds retrieval options.');const limit=options.limit??4;if(!Number.isInteger(limit)||limit<1||limit>8)throw new RangeError('Retrieve 1–8 source chunks.');const lensIds=options.lensIds??[];if(!Array.isArray(lensIds)||lensIds.length>4||new Set(lensIds).size!==lensIds.length||lensIds.some(x=>!LENSES.includes(x)))throw new RangeError('Choose distinct supported source lenses.');return{limit,lensIds};}
const documents=SKY_READING_CHUNKS.map(chunk=>{const tokens=words(`${chunk.title} ${chunk.title} ${chunk.tags.join(' ')} ${chunk.tags.join(' ')} ${chunk.text}`);const tf=new Map();tokens.forEach(x=>tf.set(x,(tf.get(x)||0)+1));return{chunk,length:tokens.length,tf};});
const averageLength=documents.reduce((s,x)=>s+x.length,0)/Math.max(1,documents.length);
const frequency=new Map();for(const doc of documents)for(const token of doc.tf.keys())frequency.set(token,(frequency.get(token)||0)+1);
export function retrieveSkySources(query,options={}) {
  if(typeof query!=='string'||query.length>1000)throw new TypeError('Source query must be text of at most 1,000 characters.');
  const{limit,lensIds}=checkOptions(options),terms=[...new Set(words(query))].slice(0,64);
  const ranked=documents.filter(({chunk})=>!lensIds.length||chunk.lensIds.some(id=>lensIds.includes(id))).map(doc=>{
    const matches=terms.filter(t=>doc.tf.has(t));let score=0;
    for(const term of matches){const tf=doc.tf.get(term),df=frequency.get(term),idf=Math.log(1+(documents.length-df+.5)/(df+.5));score+=idf*tf*2.2/(tf+1.2*(.25+.75*doc.length/averageLength));}
    return {doc,score,matches};
  }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||a.doc.chunk.id.localeCompare(b.doc.chunk.id));
  const rows=ranked.slice(0,limit).map(({doc,score,matches})=>({...doc.chunk,score:Number(score.toFixed(6)),matchedTerms:matches}));
  const ids=new Set(rows.map(x=>x.sourceId));
  return {schemaVersion:1,kind:'sky-source-retrieval',query,terms,lensIds,found:rows.length>0,matched:ranked.length,returned:rows.length,corpusChunks:documents.length,method:SKY_RETRIEVAL_METHOD,rows,sources:SKY_READING_SOURCES.filter(s=>ids.has(s.id)),note:rows.length?'Read the retrieved source status and edition; retrieval does not validate an interpretation.':'No lexical source match. Do not invent a citation or treat an empty result as proof that no relevant literature exists.'};
}
export function exportSkyReferenceCorpus(){return {schemaVersion:1,kind:'sky-reference-corpus',method:SKY_RETRIEVAL_METHOD,chunks:SKY_READING_CHUNKS,sources:SKY_READING_SOURCES,trainingStatus:'Reference material for retrieval. No fine-tuning or embedding model has been trained or run. Review the rights of each underlying edition before any expanded training corpus.'};}
