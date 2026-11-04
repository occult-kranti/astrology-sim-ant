#!/usr/bin/env python3
"""Fetch pinned Apache-2.0 Qwen training source outside Git using inherited proxy/CA."""
import argparse,concurrent.futures,hashlib,json,pathlib,urllib.request
REPO='Qwen/Qwen3-0.6B'
REV='c1899de289a04d12100db370d81485cdf75e47ca'
p=argparse.ArgumentParser();p.add_argument('--directory',default=str(pathlib.Path.home()/'.cache/astrology-workbench-model-lab/base'));a=p.parse_args()
out=pathlib.Path(a.directory).resolve();out.mkdir(parents=True,exist_ok=True)
with urllib.request.urlopen(f'https://huggingface.co/api/models/{REPO}/tree/{REV}',timeout=30) as response:tree=json.load(response)
def acquire(item):
 name=item['path']
 if '/' in name or name.startswith('.'):return None
 dest=out/name;expected=item.get('lfs',{}).get('oid')
 def sha(path):
  h=hashlib.sha256()
  with path.open('rb') as stream:
   for block in iter(lambda:stream.read(1024*1024),b''):h.update(block)
  return h.hexdigest()
 if dest.is_file() and dest.stat().st_size==item['size'] and (not expected or sha(dest)==expected):return {'file':name,'bytes':dest.stat().st_size,'sha256':sha(dest)}
 partial=dest.with_suffix(dest.suffix+'.partial');h=hashlib.sha256();size=0
 try:
  request=urllib.request.Request(f'https://huggingface.co/{REPO}/resolve/{REV}/{name}',headers={'User-Agent':'WorkbenchModelLab/1'})
  with urllib.request.urlopen(request,timeout=60) as response,partial.open('wb') as stream:
   while block:=response.read(1024*1024):
    size+=len(block)
    if size>item['size']:raise RuntimeError('Pinned size exceeded')
    stream.write(block);h.update(block)
  if size!=item['size'] or (expected and h.hexdigest()!=expected):raise RuntimeError('Pinned file verification failed')
  partial.replace(dest)
  return {'file':name,'bytes':size,'sha256':h.hexdigest()}
 except Exception:
  partial.unlink(missing_ok=True);raise
with concurrent.futures.ThreadPoolExecutor(2) as pool:files=[x for x in pool.map(acquire,tree) if x]
receipt={'repository':REPO,'revision':REV,'license':'Apache-2.0','files':files,'scope':'Original instruct-model source for an experimental CPU LoRA; no capability or accuracy claim.'}
(out/'download-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt,indent=2))
