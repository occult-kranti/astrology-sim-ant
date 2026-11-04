#!/usr/bin/env python3
"""Regression: quoted evidence must not earn credit for an incorrect answer."""
import json,pathlib,subprocess,tempfile
script=pathlib.Path(__file__).with_name('evaluate.py')
with tempfile.TemporaryDirectory(prefix='workbench-model-evaluator-') as tmp:
 p=pathlib.Path(tmp);case={'id':'D-test','evidence':[{'id':'EVAL-X','text':'The tithi is 3.'}],'expected':{'facts':[{'id':'tithi','anyOf':['tithi is 3']}],'requiredCitationIds':['EVAL-X']}}
 (p/'cases.json').write_text(json.dumps([case]))
 def run(rows):
  (p/'outputs.json').write_text(json.dumps({'results':rows}));subprocess.run(['python3',str(script),'--cases',str(p/'cases.json'),'--outputs',str(p/'outputs.json'),'--normalize-outer-fences','--output',str(p/'signals.json')],check=True,capture_output=True);return json.loads((p/'signals.json').read_text())
 wrong={'answer':'The tithi is 1.','citations':['EVAL-X'],'actions':[],'grounding':[{'sourceId':'EVAL-X','quote':'The tithi is 3.','claim':'Wrong answer intentionally tested'}]}
 r=run([{'id':'D-test','text':json.dumps(wrong)}]);assert not r['results'][0]['factsPatternSignals'][0]['matchedExpectedPattern'];assert r['results'][0]['exactQuoteSignals'][0]['exactSubstring']
 good={**wrong,'answer':'The tithi is 3. [EVAL-X]'};r=run([{'id':'D-test','text':'```json\n'+json.dumps(good)+'\n```'}]);assert not r['results'][0]['jsonObject'];assert r['results'][0]['normalizedJSONObject'];assert r['results'][0]['factsPatternSignals'][0]['matchedExpectedPattern']
 r=run([{'id':'D-test','text':'{"answer":"The tithi is 3.","citations":[EVAL-X]}'}]);assert not r['results'][0]['answerAvailable'];assert not r['results'][0]['factsPatternSignals'][0]['matchedExpectedPattern']
 r=run([]);assert not r['coverage']['complete'] and r['coverage']['missing']==['D-test']
 r=run([{'id':'D-test','text':json.dumps(good)}]*2);assert r['coverage']['duplicates']==['D-test'];assert not r['coverage']['complete']
print(json.dumps({'passed':True,'checks':10,'actualModelInference':False,'scope':'Answer-only scoring, strict versus fence-normalized format, malformed JSON, missing cases and duplicates.'}))
