#!/usr/bin/env python3
"""Optional loopback OpenAI-compatible CPU runner for the explicitly supplied adapter.
No model downloads, model switching, tool execution or private-chart persistence.
"""
import argparse,json,pathlib,threading,time
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
p=argparse.ArgumentParser();p.add_argument('--base',required=True);p.add_argument('--adapter',required=True);p.add_argument('--port',type=int,default=8846);p.add_argument('--model-id',default='workbench-lab-qwen3-0.6b-lora');a=p.parse_args()
if not 1024<=a.port<=65535:raise ValueError('Use a high local port')
import torch
from transformers import AutoModelForCausalLM,AutoTokenizer,StoppingCriteria,StoppingCriteriaList
from peft import PeftModel
torch.set_num_threads(4);torch.set_num_interop_threads(1)
tokenizer=AutoTokenizer.from_pretrained(a.base,local_files_only=True)
model=PeftModel.from_pretrained(AutoModelForCausalLM.from_pretrained(a.base,local_files_only=True,torch_dtype=torch.bfloat16,attn_implementation='eager'),a.adapter,is_trainable=False);model.eval();lock=threading.Lock()
class Deadline(StoppingCriteria):
 def __init__(self):self.end=time.monotonic()+90;self.expired=False
 def __call__(self,input_ids,scores,**kwargs):self.expired=time.monotonic()>self.end;return self.expired
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def reply(self,status,data):
  body=json.dumps(data).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.end_headers()
  try:self.wfile.write(body)
  except (BrokenPipeError,ConnectionResetError):pass
 def valid_host(self):return self.headers.get('Host') in (f'127.0.0.1:{a.port}',f'localhost:{a.port}')
 def do_GET(self):
  if not self.valid_host():return self.reply(403,{'error':{'message':'Loopback host required'}})
  if self.path!='/v1/models':return self.reply(404,{'error':{'message':'Unknown route'}})
  self.reply(200,{'object':'list','data':[{'id':a.model_id,'object':'model','owned_by':'local-experimental-adapter'}]})
 def do_POST(self):
  if not self.valid_host():return self.reply(403,{'error':{'message':'Loopback host required'}})
  if self.headers.get('Origin'):return self.reply(403,{'error':{'message':'Use the local companion; direct browser origins are not accepted'}})
  if self.path!='/v1/chat/completions':return self.reply(404,{'error':{'message':'Unknown route'}})
  try:
   size=int(self.headers.get('Content-Length','0'))
   if not 0<size<=65536:raise ValueError('Request must be at most 64 KiB')
   req=json.loads(self.rfile.read(size));messages=req['messages']
   if req.get('model')!=a.model_id or req.get('stream'):raise ValueError('Choose the configured model with stream:false')
   if not isinstance(messages,list) or not 1<=len(messages)<=16 or any(not isinstance(m,dict) or set(m)!={'role','content'} or m['role'] not in ('system','user','assistant') or not isinstance(m['content'],str) for m in messages):raise ValueError('Send bounded plain-text chat messages')
   maximum=int(req.get('max_tokens',192))
   if not 1<=maximum<=512:raise ValueError('Set RAG_MAX_TOKENS to 512 or less for this CPU experiment')
   prompt=tokenizer.apply_chat_template(messages,tokenize=False,add_generation_prompt=True,enable_thinking=False);inputs=tokenizer(prompt,return_tensors='pt',add_special_tokens=False)
   if inputs['input_ids'].numel()>4096:raise ValueError('Request exceeds 4096 input tokens')
  except (ValueError,KeyError,TypeError,json.JSONDecodeError) as e:return self.reply(400,{'error':{'message':str(e)}})
  if not lock.acquire(blocking=False):return self.reply(429,{'error':{'message':'One CPU request is already running'}})
  try:
   deadline=Deadline()
   with torch.inference_mode():result=model.generate(**inputs,max_new_tokens=maximum,do_sample=False,pad_token_id=tokenizer.eos_token_id,stopping_criteria=StoppingCriteriaList([deadline]))
   generated=result[0][inputs['input_ids'].shape[-1]:];text=tokenizer.decode(generated,skip_special_tokens=True)
   self.reply(200,{'id':'local-adapter-response','object':'chat.completion','model':a.model_id,'choices':[{'index':0,'message':{'role':'assistant','content':text},'finish_reason':'length' if len(generated)>=maximum or deadline.expired else 'stop'}],'usage':{'prompt_tokens':inputs['input_ids'].numel(),'completion_tokens':len(generated),'total_tokens':inputs['input_ids'].numel()+len(generated)},'experimental':True,'sampling':'deterministic greedy','deadlineReached':deadline.expired})
  except Exception:self.reply(500,{'error':{'message':'Local adapter inference failed'}})
  finally:lock.release()
server=ThreadingHTTPServer(('127.0.0.1',a.port),Handler)
print(json.dumps({'ready':True,'model':a.model_id,'url':f'http://127.0.0.1:{a.port}/v1/','experimental':True}),flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
