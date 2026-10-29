import assert from 'node:assert/strict';
import { createSigilDesign, makeSigilRecipe, reproduceSigilRecipe, buildSigilImagePrompt, SIGIL_PLANETS } from '../../assets/js/core/sigil-design.js';
export function run() {
 const failures=[];let passed=0;
 const test=(name,fn)=>{try{fn();passed++;}catch(e){failures.push(`${name}: ${e.message}`);}};
 const base={text:'I CREATE WITH CLARITY',moment:{dateISO:'2026-10-29T12:00:00Z',lat:51.50741,lon:-0.12781,timeZone:'Europe/London'}};
 test('three construction modes deterministically reproduce exact SVG',()=>{
  for(const mode of ['intention','planetary','mandala']){const r=createSigilDesign({...base,mode});assert.deepEqual(r,createSigilDesign({...base,mode}));assert.equal(reproduceSigilRecipe(makeSigilRecipe(r)),r.svg);assert.equal(reproduceSigilRecipe(JSON.parse(JSON.stringify(makeSigilRecipe(r)))),r.svg);assert.ok(r.studySetup.sections.length===6);assert.ok(Object.isFrozen(r.geometry));assert.match(r.svg,/role="img"/);}
 });
 test('modern intention rule is explicit, stable and strict',()=>{
  const r=createSigilDesign({...base,text:'Clear clear aim!'});assert.equal(r.construction.retainedConsonants,'CLRM');assert.match(r.method.status,/Contemporary/);assert.throws(()=>createSigilDesign({...base,text:'ātmā'}),/Unsupported/);assert.throws(()=>createSigilDesign({...base,text:'AEIOU'}),/consonant/);assert.throws(()=>createSigilDesign({...base,text:'A'.repeat(161)}),/160/);
 });
 test('all seven sourced squares remain arithmetically valid and trace methods distinct',()=>{
  for(const planet of SIGIL_PLANETS){const r=createSigilDesign({...base,mode:'planetary',planet});assert.equal(r.square.validation.ok,true);assert.equal(r.square.grid.length,r.square.validation.order);assert.ok(r.sources.some(s=>s.id==='SG-AGRIPPA-II-22'));}
  const hebrew=createSigilDesign({...base,mode:'planetary',text:'חי',method:'hebrew-standard'});assert.equal(hebrew.construction.normalizedText,'חי');assert.throws(()=>createSigilDesign({...base,mode:'planetary',text:'Latin',method:'hebrew-standard'}));
  const square=createSigilDesign({...base,mode:'planetary',text:''});assert.equal(square.construction.pointCount,0);
 });
 test('seed changes modern art while sourced square stays fixed',()=>{
  for(const mode of ['intention','mandala'])assert.notEqual(createSigilDesign({...base,mode,seed:1}).svg,createSigilDesign({...base,mode,seed:2}).svg);
  const a=createSigilDesign({...base,mode:'planetary',seed:1}),b=createSigilDesign({...base,mode:'planetary',seed:2});assert.deepEqual(a.geometry,b.geometry);
  assert.equal(createSigilDesign({...base,mode:'mandala',symmetry:24,rings:6}).construction.pointCount,144);
 });
 test('default recipe and SVG omit raw private fields, but disclosure warns about encoded paths',()=>{
  const r=createSigilDesign(base),recipe=makeSigilRecipe(r),text=JSON.stringify(recipe);
  for(const value of [base.text,String(base.moment.lat),String(base.moment.lon),base.moment.timeZone]){assert.ok(!text.includes(value));assert.ok(!r.svg.includes(value));}
  assert.match(recipe.privacy,/encode information/);assert.equal(recipe.privateInputs,undefined);
  const full=makeSigilRecipe(r,{includePrivate:true});assert.equal(full.privateInputs.text,base.text);assert.equal(full.privateInputs.moment.lat,base.moment.lat);assert.equal(reproduceSigilRecipe(full),r.svg);
  assert.throws(()=>makeSigilRecipe(r,{includePrivate:'yes'}));
 });
 test('untrusted markup cannot enter numerical SVG and malformed recipes fail',()=>{
  assert.throws(()=>createSigilDesign({...base,text:'<script>alert(1)</script>'}));
  const recipe=makeSigilRecipe(createSigilDesign(base));
  for(const geometry of [[{kind:'script',role:'primary',width:1}], [{kind:'circle',role:'primary',width:1,center:[NaN,4],radius:3}], [{kind:'number',role:'primary',width:1,center:[2,3],size:12,value:'<svg>'}]])assert.throws(()=>reproduceSigilRecipe({...recipe,geometry}));
  assert.throws(()=>reproduceSigilRecipe({...recipe,sourceIds:['<script>']}));assert.throws(()=>reproduceSigilRecipe({...recipe,style:{...recipe.style,palette:'__proto__'}}));
 });
 test('geometry knobs and moment conventions have real bounds',()=>{
  for(const extra of [{seed:-1},{seed:1.5},{symmetry:25},{rings:0},{rotation:360},{stroke:NaN},{palette:'purple'},{book:'invented'},{calendar:'universal'},{unknown:true}])assert.throws(()=>createSigilDesign({...base,...extra}));
  assert.throws(()=>createSigilDesign({...base,moment:{...base.moment,dateISO:'2026-02-30T12:00Z'}}));assert.throws(()=>createSigilDesign({...base,moment:{...base.moment,timeZone:'Invalid/Zone'}}));
 });
 test('book/calendar/moment setup retains source status without a ritual recipe',()=>{
  const r=createSigilDesign({...base,calendar:'hebrew',book:'newton'});assert.equal(r.studySetup.context.calendarId,'hebrew');assert.match(r.studySetup.context.dayBoundary,/midnight/);assert.ok(r.studySetup.sections.some(s=>/Newton/.test(s.text)));assert.match(r.studySetup.status,/no operative/);const source=r.sources.find(s=>s.id==='NEW-OPT-Q31');assert.match(source.edition,/1730/);assert.match(source.section,/Query 31/);assert.ok(r.svg.includes('1730'));assert.ok(makeSigilRecipe(r).sources.some(s=>s.edition?.includes('1730')));assert.match(JSON.stringify(r.studySetup),/no substances/);
 });
 test('image prompt never claims a provider call and disclosure is explicit',()=>{
  const r=createSigilDesign(base),p=buildSigilImagePrompt(r);assert.equal(p.rendererCalled,false);assert.ok(!p.text.includes(base.text));assert.ok(!p.text.includes(String(base.moment.lat)));assert.match(p.text,/can alter letters/);assert.match(p.text,/attach the exported SVG or PNG/);assert.ok(buildSigilImagePrompt(r,{includePrivate:true}).text.includes(base.text));
 });
 test('all local operations stay offline',()=>{
  const old=globalThis.fetch;let calls=0;globalThis.fetch=()=>{calls++;throw Error('network');};try{const r=createSigilDesign(base);makeSigilRecipe(r);buildSigilImagePrompt(r);assert.equal(calls,0);}finally{globalThis.fetch=old;}
 });
 return {pass:!failures.length,passed,failures};
}
if(process.argv[1]?.endsWith('sigil-design.mjs')){const r=run();console.log(r);if(!r.pass)process.exitCode=1;}
