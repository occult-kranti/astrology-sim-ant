#!/usr/bin/env python3
"""Run frozen public evaluation requests on the original CPU model or PEFT adapter."""
import argparse,hashlib,json,pathlib,time,resource
p=argparse.ArgumentParser();p.add_argument('--config',required=True);a=p.parse_args()
cp=pathlib.Path(a.config).resolve();cfg=json.loads(cp.read_text())
import torch
from transformers import AutoModelForCausalLM,AutoTokenizer
from peft import PeftModel
seed=int(cfg.get('seed',20261104));torch.manual_seed(seed);torch.set_num_threads(4);torch.set_num_interop_threads(1)
tokenizer=AutoTokenizer.from_pretrained(cfg['base'],local_files_only=True)
model=AutoModelForCausalLM.from_pretrained(cfg['base'],local_files_only=True,torch_dtype=torch.bfloat16,attn_implementation='eager')
if cfg.get('adapter'):model=PeftModel.from_pretrained(model,cfg['adapter'],is_trainable=False)
model.eval();jobs_path=pathlib.Path(cfg['requestsJSON']);jobs=json.loads(jobs_path.read_text());results=[]
maxnew=int(cfg.get('maxNewTokens',192));output=pathlib.Path(cfg['output']);output.parent.mkdir(parents=True,exist_ok=True)
for job in jobs:
 prompt=tokenizer.apply_chat_template(job['messages'],tokenize=False,add_generation_prompt=True,enable_thinking=False)
 inputs=tokenizer(prompt,return_tensors='pt',add_special_tokens=False)
 if inputs['input_ids'].numel()>int(cfg.get('maxInputTokens',4096)):raise ValueError('Frozen request exceeds context bound; no implicit truncation allowed')
 t=time.monotonic()
 with torch.inference_mode():tokens=model.generate(**inputs,max_new_tokens=maxnew,do_sample=False,pad_token_id=tokenizer.eos_token_id)
 generated=tokens[0][inputs['input_ids'].shape[-1]:]
 row={'id':job['id'],'split':job['split'],'promptSHA256':hashlib.sha256(prompt.encode()).hexdigest(),'requestSHA256':hashlib.sha256(json.dumps(job,sort_keys=True,ensure_ascii=False).encode()).hexdigest(),'inputTokens':inputs['input_ids'].numel(),'outputTokens':generated.numel(),'seconds':round(time.monotonic()-t,3),'text':tokenizer.decode(generated,skip_special_tokens=True),'maxNewTokensReached':generated.numel()>=maxnew}
 results.append(row)
 receipt={'kind':'actual-cpu-model-generation','config':cfg,'configSHA256':hashlib.sha256(cp.read_bytes()).hexdigest(),'requestsSHA256':hashlib.sha256(jobs_path.read_bytes()).hexdigest(),'torch':torch.__version__,'precision':'bfloat16','device':'cpu','results':results,'maxRSSKiB':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'scope':'Raw sampled outputs; no automated score establishes semantic accuracy.'}
 output.write_text(json.dumps(receipt,indent=2,ensure_ascii=False)+'\n');print(json.dumps({'id':job['id'],'seconds':row['seconds'],'tokens':row['outputTokens'],'output':str(output)}),flush=True)
