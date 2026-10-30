// Exercise actual SDK HTTP and spawned stdio evidence/date-role contracts.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHttpHandler } from '../mcp/http-handler.mjs';
import { ESCHATOLOGY_ATLAS_MCP_TOOLS } from '../mcp/eschatology-atlas-adapters.mjs';
const [catalogue, frame] = ESCHATOLOGY_ATLAS_MCP_TOOLS;
const init = { jsonrpc:'2.0', id:1, method:'initialize', params:{ protocolVersion:'2025-11-25', capabilities:{}, clientInfo:{name:'eschatology-evidence-protocol-review',version:'1.0.0'} } };
const ordinary = {claimId:'TR-C-NEWTON-2060',dateRole:'target',selection:'study-date',date:'2060-07-01',time:'12:00',timeZone:'Europe/London',lat:51.5074,lon:-.1278,system:'regiomontanus',disambiguation:'reject'};
const source = overrides => {const r={...ordinary,selection:'source-date',...overrides};delete r.date;return r;};
let checks=0;
const ok=(condition,label)=>{assert.ok(condition,label);checks++;};
async function exercise(rpc) {
 const initialized=await rpc(init);ok(initialized.result.serverInfo.name==='astrologers-workbench','SDK server initialization');
 const list=(await rpc({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})).result.tools;
 for(const tool of ESCHATOLOGY_ATLAS_MCP_TOOLS){const item=list.find(t=>t.name===tool.name);ok(item,'Tool listed');assert.deepEqual(item.inputSchema,tool.inputSchema);checks++;ok(item.annotations.readOnlyHint===true,'Read-only annotation');}
 let id=3;
 async function call(tool,args){const r=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name:tool.name,arguments:args}});ok(!r.error&&!r.result?.isError,'Complete successful transport response');const e=r.result.structuredContent;ok(e.tool===tool.name,'Named envelope');assert.deepEqual(JSON.parse(r.result.content.find(c=>c.type==='text').text),e);checks++;assert.deepEqual(e.data,tool.calculate(args));checks++;return e.data;}
 const all=await call(catalogue,{});ok(all.claims.length>20&&all.graph.inferredEdges===false,'Source catalogue with no inferred edges');ok(all.graph.edges.filter(e=>e.provenance==='catalogue-index').every(e=>e.historicalRelationshipClaim===false),'Index links preserve nonhistorical status');
 const filtered=await call(catalogue,{familyId:'christian-newton',dateRole:'target',datedOnly:true});ok(filtered.claims.every(c=>c.familyId==='christian-newton')&&filtered.timeline.every(t=>t.dateRole==='target'&&t.date.precision!=='unknown'),'Filtered timeline preserves date roles');
 const partial=await call(frame,source({}));ok(partial.status==='source-only'&&partial.frame===null&&partial.readings===null,'Newton year does not become January1');
 const alleged=await call(frame,source({claimId:'PIKE-C-ALLEGED-DATE',dateRole:'claimedDocument'}));ok(alleged.status==='source-only'&&alleged.selection.sourceDate.value==='1871-08-15'&&alleged.frame===null,'Alleged letter date retained without authenticated geometry');
 const documented=await call(frame,source({claimId:'PIKE-C-COMPOSITE-DATES',dateRole:'statement'}));ok(documented.status==='available'&&documented.selection.selectedGregorianDate==='1966-06-02'&&documented.selection.historicalEventInstantEstablished===false,'Dated preface with assumed observer is not target or event clock');
 const study=await call(frame,ordinary);ok(study.status==='available'&&study.scope.civilCalendarRows===13&&study.scope.namedReadingLenses===3&&study.scope.outcomeScoreCalculated===false,'Thirteen civil rows and three named lenses');
 const gap=await call(frame,{...ordinary,date:'2026-03-08',time:'02:30',timeZone:'America/New_York'});ok(gap.status!=='available'&&gap.readings===null,'Skipped local clock has no reading');
 for(const [tool,args] of [
 [catalogue,{dateRole:'war'}],[catalogue,{familyId:'invented'}],[catalogue,{datedOnly:'true'}],[catalogue,{secretAffiliation:true}],
 [frame,{...ordinary,objective:'military timing'}],[frame,{...ordinary,country:'usa'}],[frame,{...ordinary,birth:{}}],[frame,{...ordinary,date:'2060-02-30'}],[frame,{...ordinary,date:'2101-01-01'}],
 [frame,{...ordinary,selection:'source-date'}],[frame,{...source({}),selection:'study-date'}],[frame,{...ordinary,claimId:'invented'}],[frame,{...ordinary,dateRole:'war'}],[frame,{...ordinary,includeCatalogStars:'true'}],
 [frame,Object.fromEntries(Object.entries(ordinary).filter(([k])=>k!=='time'))],
 ]){const r=await rpc({jsonrpc:'2.0',id:id++,method:'tools/call',params:{name:tool.name,arguments:args}});ok(r.error||r.result?.isError,'Unknown context or malformed selection rejected');}
}

const handler = createHttpHandler();
try {
  await exercise(async body => {
    const response = await handler.fetch(new Request('http://127.0.0.1:3001/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' }, body: JSON.stringify(body) }));
    assert.equal(response.status, 200);
    const text = await response.text();
    return response.headers.get('content-type')?.includes('text/event-stream') ? JSON.parse(text.split('\n').filter(line => line.startsWith('data: ')).map(line => line.slice(6)).join('\n')) : JSON.parse(text);
  });
} finally { await handler.close(); }

const child = spawn(process.execPath, [fileURLToPath(new URL('../mcp/stdio.mjs', import.meta.url))], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = '', stderr = '';
const pending = new Map();
child.stderr.on('data', data => { stderr += data; });
child.stdout.on('data', data => {
  buffer += data;
  while (buffer.includes('\n')) {
    const cut = buffer.indexOf('\n'), line = buffer.slice(0, cut); buffer = buffer.slice(cut + 1); if (!line.trim()) continue;
    try { const message = JSON.parse(line); pending.get(message.id)?.resolve(message); pending.delete(message.id); }
    catch (error) { for (const request of pending.values()) request.reject(error); }
  }
});
child.on('error', error => { for (const request of pending.values()) request.reject(error); });
child.on('exit', code => { for (const request of pending.values()) request.reject(new Error('stdio exited ' + code + ': ' + stderr)); });
const send = body => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(body.id); reject(new Error('Eschatology atlas stdio response timed out')); }, 15000);
  pending.set(body.id, { resolve: value => { clearTimeout(timer); if (body.method === 'initialize') child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  child.stdin.write(JSON.stringify(body) + '\n');
});
try { await exercise(send); } finally { child.stdin.end(); child.kill('SIGTERM'); }
console.log(JSON.stringify({ pass: true, checks, transports: ['official-SDK HTTP handler', 'actual child-process stdio'], liveProviderUsed: false, hostedDeploymentVerified: false }));
