#!/usr/bin/env python3
"""Bounded CPU LoRA experiment. Only explicit training records are consumed.
Writes adapters/logs outside Git; no test-set access, cloud credentials or downloads.
"""
import argparse,hashlib,json,pathlib,random,time,resource,os
p=argparse.ArgumentParser();p.add_argument('--config',required=True);a=p.parse_args()
config_path=pathlib.Path(a.config).resolve();cfg=json.loads(config_path.read_text())
import torch
from transformers import AutoModelForCausalLM,AutoTokenizer
from peft import LoraConfig,get_peft_model,PeftModel
seed=int(cfg.get('seed',20261104));random.seed(seed);torch.manual_seed(seed);torch.set_num_threads(4);torch.set_num_interop_threads(1)
output=pathlib.Path(cfg['output']).resolve()
if output.exists() and any(output.iterdir()):raise ValueError('Training output must be fresh; preserve existing checkpoints and receipts')
output.mkdir(parents=True,exist_ok=True)
repo=pathlib.Path(__file__).resolve().parents[2]
if output.is_relative_to(repo):raise ValueError('Write model weights outside the repository')
train_path=pathlib.Path(cfg['trainingJSONL']).resolve();records=[json.loads(x) for x in train_path.read_text().splitlines() if x.strip()]
if not records or any(r.get('split')!='training' for r in records):raise ValueError('Every record must explicitly identify the training split')
tokenizer=AutoTokenizer.from_pretrained(cfg['base'],local_files_only=True)
model=AutoModelForCausalLM.from_pretrained(cfg['base'],local_files_only=True,torch_dtype=torch.bfloat16,attn_implementation='eager')
model.config.use_cache=False
if cfg.get('resumeAdapter'):model=PeftModel.from_pretrained(model,cfg['resumeAdapter'],is_trainable=True)
else:model=get_peft_model(model,LoraConfig(r=int(cfg.get('rank',4)),lora_alpha=int(cfg.get('alpha',8)),lora_dropout=0.0,target_modules=['q_proj','v_proj'],bias='none',task_type='CAUSAL_LM'))
model.train()
params=[p for p in model.parameters() if p.requires_grad]
initial={k:v.detach().float().clone() for k,v in model.named_parameters() if v.requires_grad}
model.save_pretrained(output/'initial',safe_serialization=True)
def parameter_digest(values):
 h=hashlib.sha256()
 for name,value in sorted(values.items()):h.update(name.encode());h.update(value.detach().float().cpu().numpy().tobytes())
 return h.hexdigest()
initial_hash=parameter_digest(initial)
optimizer=torch.optim.AdamW(params,lr=float(cfg.get('learningRate',2e-4)),weight_decay=0.0)
maxlen=int(cfg.get('maxLength',256));encoded=[]
for record in records:
 messages=record['messages'];answer=messages[-1]
 if answer['role']!='assistant':raise ValueError('Training target must be the final assistant message')
 prefix=tokenizer.apply_chat_template(messages[:-1],tokenize=False,add_generation_prompt=True,enable_thinking=False)
 pt=tokenizer(prefix,add_special_tokens=False)['input_ids'];alltokens=tokenizer(prefix+answer['content']+tokenizer.eos_token,add_special_tokens=False)['input_ids']
 if len(alltokens)>maxlen:raise ValueError(f"Training record {record['id']} has {len(alltokens)} tokens, exceeding fixed {maxlen}; do not silently truncate source/target")
 ids=torch.tensor([alltokens]);labels=ids.clone();labels[:,:len(pt)]=-100
 encoded.append((record['id'],ids,labels))
started=time.monotonic();rows=[];steps=int(cfg['steps']);wall_limit=float(cfg.get('maxWallSeconds',900))
for step in range(steps):
 if time.monotonic()-started>wall_limit:raise TimeoutError('Bounded training wall clock limit exceeded')
 rid,ids,labels=encoded[step%len(encoded)];t=time.monotonic();optimizer.zero_grad(set_to_none=True)
 loss=model(input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels).loss
 if not torch.isfinite(loss):raise FloatingPointError('Training loss is non-finite')
 loss.backward();norm=torch.nn.utils.clip_grad_norm_(params,1.0);optimizer.step()
 row={'step':step+1,'recordId':rid,'tokens':ids.numel(),'loss':float(loss.detach()),'gradientNorm':float(norm),'seconds':round(time.monotonic()-t,3)};rows.append(row)
 with (output/'steps.jsonl').open('a') as f:f.write(json.dumps(row)+'\n')
 print(json.dumps(row),flush=True)
model.save_pretrained(output,safe_serialization=True)
delta=sum(float((v.detach().float()-initial[k]).square().sum()) for k,v in model.named_parameters() if k in initial)**0.5
files=[{'file':x.name,'bytes':x.stat().st_size,'sha256':hashlib.sha256(x.read_bytes()).hexdigest()} for x in sorted(output.glob('adapter*')) if x.is_file()]
receipt={'kind':'actual-cpu-lora-training','config':cfg,'configSHA256':hashlib.sha256(config_path.read_bytes()).hexdigest(),'trainingDataSHA256':hashlib.sha256(train_path.read_bytes()).hexdigest(),'torch':torch.__version__,'device':'cpu','precision':'bfloat16 frozen base, trainable adapter as supplied by PEFT','trainableParameters':sum(x.numel() for x in params),'initialParameterSHA256':initial_hash,'finalParameterSHA256':parameter_digest({k:v for k,v in model.named_parameters() if v.requires_grad}),'steps':len(rows),'seconds':round(time.monotonic()-started,3),'adapterDeltaL2':delta,'nonzeroParameterUpdate':delta>0,'maxRSSKiB':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'lossRows':rows,'artifacts':files,'scope':'Training loss and nonzero updates are not an accuracy result. Only training-split originals were used.'}
(output/'training-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'completed':True,'seconds':receipt['seconds'],'adapterDeltaL2':delta,'receipt':str(output/'training-receipt.json')}),flush=True)
