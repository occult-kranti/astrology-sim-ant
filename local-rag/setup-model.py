#!/usr/bin/env python3
"""Download pinned CPU runtime/model outside Git; verify bytes before extraction.
Uses Python's normal proxy/CA configuration. Linux x86_64 runtime only.
"""
import argparse, concurrent.futures, hashlib, json, os, pathlib, platform, tarfile, urllib.request
p=argparse.ArgumentParser();p.add_argument('--directory',default=str(pathlib.Path.home()/'.cache'/'astrology-workbench'));a=p.parse_args()
if platform.system()!='Linux' or platform.machine() not in ('x86_64','amd64'):raise SystemExit('This pinned runtime is Linux x86_64. Configure another local OpenAI-compatible model server on your platform.')
root=pathlib.Path(a.directory).resolve();root.mkdir(parents=True,exist_ok=True)
repo=pathlib.Path(__file__).resolve().parent
manifest=json.loads((repo/'model-manifest.json').read_text())
def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def acquire(item):
 name=item.get('file',item.get('asset'));dest=root/name
 if dest.exists() and dest.stat().st_size==item['bytes'] and digest(dest)==item['sha256']:return str(dest)
 partial=dest.with_suffix(dest.suffix+'.part')
 request=urllib.request.Request(item['url'],headers={'User-Agent':'AstrologyWorkbenchLocalRAG/1'})
 try:
  with urllib.request.urlopen(request,timeout=60) as response,partial.open('wb') as output:
   h=hashlib.sha256();total=0
   while True:
    block=response.read(1024*1024)
    if not block:break
    total+=len(block)
    if total>item['bytes']:raise ValueError('Download exceeded pinned size')
    h.update(block);output.write(block)
  if total!=item['bytes'] or h.hexdigest()!=item['sha256']:raise ValueError('Pinned size/SHA-256 verification failed: '+name)
  partial.replace(dest);return str(dest)
 except Exception:
  partial.unlink(missing_ok=True);raise
with concurrent.futures.ThreadPoolExecutor(2) as pool:
 runtime,model=list(pool.map(acquire,[manifest['runtime'],manifest['model']]))
runtimeDir=root/'runtime'
with tarfile.open(runtime,'r:gz') as archive:archive.extractall(runtimeDir,filter='data')
binaries=list(runtimeDir.rglob('llama-server'))
if len(binaries)!=1:raise RuntimeError('Expected one llama-server binary')
binaries[0].chmod(binaries[0].stat().st_mode|0o111)
receipt={'runtime':str(binaries[0]),'model':model,'manifest':manifest,'directory':str(root)}
(root/'setup-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'status':'verified','runtime':str(binaries[0]),'model':model,'receipt':str(root/'setup-receipt.json')},indent=2))
