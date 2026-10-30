import { retrieveSkySources } from '../assets/js/core/sky-source-retrieval.js';
const query=process.argv.slice(2).join(' ');
if(!query){console.error('Usage: node scripts/query-sky-reference.mjs "Why do tropical and sidereal signs differ?"');process.exitCode=2;}
else console.log(JSON.stringify(retrieveSkySources(query,{limit:4}),null,2));
