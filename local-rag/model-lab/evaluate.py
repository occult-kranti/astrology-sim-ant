#!/usr/bin/env python3
"""Separate mechanical evaluation signals; no holistic accuracy score or semantic judge."""
import argparse,json,re,pathlib,hashlib
p=argparse.ArgumentParser();p.add_argument('--outputs',required=True);p.add_argument('--cases',required=True);p.add_argument('--split',default='development');p.add_argument('--expected-ids');p.add_argument('--normalize-outer-fences',action='store_true');p.add_argument('--output',required=True);a=p.parse_args()
cases_file=pathlib.Path(a.cases);rawcases=json.loads(cases_file.read_text());cases=rawcases[a.split] if isinstance(rawcases,dict) else rawcases
byid={x['id']:x for x in cases};raw=json.loads(pathlib.Path(a.outputs).read_text());rows=raw if isinstance(raw,list) else raw.get('results',[])
expected_ids=a.expected_ids.split(',') if a.expected_ids else list(byid)
actual_ids=[x['id'] for x in rows]
coverage={'expected':expected_ids,'actual':actual_ids,'missing':sorted(set(expected_ids)-set(actual_ids)),'unexpected':sorted(set(actual_ids)-set(expected_ids)),'duplicates':sorted({x for x in actual_ids if actual_ids.count(x)>1})}
coverage['complete']=not any(coverage[x] for x in ['missing','unexpected','duplicates'])
if any(x not in byid for x in actual_ids):raise ValueError('Output contains an unknown case ID')
results=[]
for row in rows:
 case=byid[row['id']];text=row.get('text',row.get('answer',''));parsed=None
 try:parsed=json.loads(text)
 except (json.JSONDecodeError,TypeError):pass
 strict_object=isinstance(parsed,dict)
 if a.normalize_outer_fences and not strict_object and isinstance(text,str):
  cleaned=re.sub(r'^```(?:json)?\s*','',text.strip(),flags=re.I);cleaned=re.sub(r'\s*```$','',cleaned)
  try:parsed=json.loads(cleaned)
  except (json.JSONDecodeError,TypeError):pass
 answer_available=isinstance(parsed,dict) and isinstance(parsed.get('answer'),str)
 answer=parsed['answer'] if answer_available else ('' if a.normalize_outer_fences else text)
 expected=case.get('expected',{});facts=[];numeric=[];forbidden=[]
 for field,dest in [('facts',facts),('numeric',numeric)]:
  for item in expected.get(field,[]):dest.append({'id':item['id'],'matchedExpectedPattern':any(re.search(pattern,answer,re.I) for pattern in item.get('anyOf',[])),'description':item.get('description'),'expectedValue':item.get('value'),'tolerance':item.get('tolerance')})
 for item in expected.get('forbiddenClaims',[]):
  matches=[m.group(0) for pattern in item.get('patterns',[]) for m in re.finditer(pattern,answer,re.I)]
  forbidden.append({'id':item['id'],'matchedForbiddenPattern':bool(matches),'matches':matches,'requiresManualContextReview':bool(matches)})
 allowed={x['id'] for x in case.get('evidence',[])};structured=parsed.get('citations',[]) if isinstance(parsed,dict) else []
 inline=re.findall(r'\[((?:EVAL|WRAG)-[^\]\s]+)\]',answer)
 quotes=[]
 for entry in parsed.get('grounding',[]) if isinstance(parsed,dict) and isinstance(parsed.get('grounding'),list) else []:
  evidence=next((x for x in case.get('evidence',[]) if x['id']==entry.get('sourceId')),None) if isinstance(entry,dict) else None
  quote=entry.get('quote') if isinstance(entry,dict) else None
  quotes.append({'sourceId':entry.get('sourceId') if isinstance(entry,dict) else None,'exactSubstring':bool(evidence and isinstance(quote,str) and quote.strip() and quote in evidence['text']),'characters':len(quote) if isinstance(quote,str) else None,'within180Characters':isinstance(quote,str) and len(quote)<=180})
 results.append({'id':row['id'],'jsonObject':strict_object,'normalizedJSONObject':isinstance(parsed,dict),'answerAvailable':answer_available,'factsPatternSignals':facts,'numericPatternSignals':numeric,'forbiddenClaimSignals':forbidden,'sourceIdentifiers':{'required':expected.get('requiredCitationIds',[]),'inline':inline,'structured':structured,'unknown':[x for x in inline+structured if not isinstance(x,str) or x not in allowed] if isinstance(structured,list) else ['invalid structured citation array'],'allRequiredInline':all(x in inline for x in expected.get('requiredCitationIds',[]))},'exactQuoteSignals':quotes,'scenarioCriteriaForManualReview':expected.get('scenarioCriteria',[]),'abstentionExpectation':expected.get('abstention'),'actionsEmpty':parsed.get('actions')==[] if isinstance(parsed,dict) else False,'truncated':row.get('maxNewTokensReached',False),'seconds':row.get('seconds'),'manualSemanticReview':'Required; regex signals and citation identity do not establish supported meaning.'})
report={'kind':'mechanical-evaluation-signals-v2' if a.normalize_outer_fences else 'mechanical-evaluation-signals','split':a.split,'coverage':coverage,'contentPolicy':'Only parsed answer content is evaluated; outer Markdown fences may be removed, no other JSON repair. Strict JSON compliance remains separate.' if a.normalize_outer_fences else 'Original strict parser; malformed output requires manual review.','evaluatorSHA256':hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),'casesSHA256':hashlib.sha256(cases_file.read_bytes()).hexdigest(),'outputsSHA256':hashlib.sha256(pathlib.Path(a.outputs).read_bytes()).hexdigest(),'results':results,'scope':'Report numeric, format, citation, quote and prohibited-pattern signals separately. No aggregate accuracy claim; negatives may require contextual interpretation.'}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'evaluated':len(results),'output':a.output}))
