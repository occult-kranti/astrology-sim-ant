import assert from 'node:assert/strict';
import { createSigilDesign, makeSigilRecipe, reproduceSigilRecipe, buildSigilImagePrompt, inspectSigilRecipeJSON, restoreSigilRecipeInputs, SIGIL_RECIPE_MAX_BYTES, SIGIL_PLANETS } from '../../assets/js/core/sigil-design.js';
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
 test('public imported recipes replay geometry without inferring absent private inputs',()=>{
  for(const mode of ['intention','planetary','mandala']){
   const r=createSigilDesign({...base,mode}),i=inspectSigilRecipeJSON(JSON.stringify(makeSigilRecipe(r)));
   assert.equal(i.svg.slice(i.svg.indexOf('<rect ')),r.svg.slice(r.svg.indexOf('<rect ')));assert.match(i.svg,/Imported numeric drawing/);assert.match(i.svg,/Unverified file provenance/);
   assert.equal(i.containsPrivateInputs,false);assert.equal(i.canRestoreInputs,false);assert.equal(i.recipe.privateInputs,undefined);assert.ok(Object.isFrozen(i.recipe.geometry));assert.throws(()=>restoreSigilRecipeInputs(i));
  }
 });
 test('private restoration requires inputs that reproduce the numerical drawing',()=>{
  for(const planet of SIGIL_PLANETS){const r=createSigilDesign({...base,mode:'planetary',planet}),full=makeSigilRecipe(r,{includePrivate:true}),i=inspectSigilRecipeJSON(JSON.stringify(full));assert.equal(i.canRestoreInputs,true);assert.deepEqual(restoreSigilRecipeInputs(i),r.inputs);assert.equal(i.recipe.privateInputs,undefined);assert.equal(i.recipe.privateStudySetup,undefined);}
  const r=createSigilDesign(base),full=makeSigilRecipe(r,{includePrivate:true});full.privateInputs.text='OTHER PHRASE';const mismatch=inspectSigilRecipeJSON(JSON.stringify(full));assert.equal(mismatch.canRestoreInputs,false);assert.throws(()=>restoreSigilRecipeInputs(mismatch));
  full.privateInputs.text=base.text;full.privateStudySetup={text:'Untrusted instruction and invented observer'};const recovered=inspectSigilRecipeJSON(JSON.stringify(full));assert.equal(recovered.canRestoreInputs,true);assert.ok(!JSON.stringify(recovered).includes('Untrusted instruction'));
 });
 test('JSON import enforces byte and schema bounds before rendering',()=>{
  assert.throws(()=>inspectSigilRecipeJSON('x'.repeat(SIGIL_RECIPE_MAX_BYTES+1)),/512/);assert.throws(()=>inspectSigilRecipeJSON('é'.repeat(SIGIL_RECIPE_MAX_BYTES/2+1)),/512/);assert.throws(()=>inspectSigilRecipeJSON('<svg/>'),/JSON/);
  const recipe=makeSigilRecipe(createSigilDesign(base));
  for(const altered of [{...recipe,svg:'<svg onload="alert(1)"/>'},{...recipe,style:{...recipe.style,onclick:'alert(1)'}},{...recipe,geometry:[{...recipe.geometry[0],onload:'alert(1)'}]},{...recipe,sourceIds:[...recipe.sourceIds,recipe.sourceIds[0]]},{...recipe,sources:[...recipe.sources,recipe.sources[0]]}])assert.throws(()=>inspectSigilRecipeJSON(JSON.stringify(altered)));
  const proto=JSON.stringify(recipe).replace('{','{"__proto__":{"polluted":true},');assert.throws(()=>inspectSigilRecipeJSON(proto));assert.equal({}.polluted,undefined);
 });
 test('imported source labels are bounded escaped data and URLs cannot carry credentials',()=>{
  const recipe=makeSigilRecipe(createSigilDesign(base));recipe.sources[0].title='</metadata><script>alert(1)</script>';const i=inspectSigilRecipeJSON(JSON.stringify(recipe));assert.ok(!i.svg.includes('<script>'));assert.ok(i.svg.includes('&lt;script&gt;'));assert.match(i.sourceStatus,/not authenticated/);
  for(const url of ['javascript:alert(1)','https://user:secret@example.org/path','https://']){recipe.sources[0].url=url;assert.throws(()=>inspectSigilRecipeJSON(JSON.stringify(recipe)));}
 });
 test('nonplanetary recipes reject arbitrary planet metadata',()=>{
  for(const mode of ['intention','mandala']){
   const recipe=makeSigilRecipe(createSigilDesign({...base,mode}));
   for(const planet of [{privateInputs:{exactAddress:'SENTINEL_PRIVATE_FIELD'}},'SENTINEL_PRIVATE_FIELD',[],1])assert.throws(()=>inspectSigilRecipeJSON(JSON.stringify({...recipe,planet})),/null planet/);
   assert.ok(!JSON.stringify(inspectSigilRecipeJSON(JSON.stringify(recipe))).includes('SENTINEL_PRIVATE_FIELD'));
  }
 });
 test('palette identifiers cannot be coercible arrays in imported or private controls',()=>{
  const recipe=makeSigilRecipe(createSigilDesign(base));
  for(const palette of [['ink'],[['ink']],{},1]){
   assert.throws(()=>inspectSigilRecipeJSON(JSON.stringify({...recipe,style:{...recipe.style,palette}})),/Unsupported/);
   assert.throws(()=>createSigilDesign({...base,palette}),/palette/);
  }
 });
 test('all local operations stay offline',()=>{
  const old=globalThis.fetch;let calls=0;globalThis.fetch=()=>{calls++;throw Error('network');};try{const r=createSigilDesign(base);makeSigilRecipe(r);buildSigilImagePrompt(r);assert.equal(calls,0);}finally{globalThis.fetch=old;}
 });
 return {pass:!failures.length,passed,failures};
}
if(process.argv[1]?.endsWith('sigil-design.mjs')){const r=run();console.log(r);if(!r.pass)process.exitCode=1;}
