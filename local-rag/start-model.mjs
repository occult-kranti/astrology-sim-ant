#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {homedir} from 'node:os';
import {spawn} from 'node:child_process';
const args=process.argv.slice(2);
if(args.length&&!(args.length===2&&args[0]==='--directory'))throw new Error('Use --directory <verified setup directory>.');
const directory=resolve(args[1]||process.env.WORKBENCH_MODEL_DIR||resolve(homedir(),'.cache/astrology-workbench'));
const receipt=JSON.parse(await readFile(resolve(directory,'setup-receipt.json'),'utf8'));
const manifest=JSON.parse(await readFile(new URL('./model-manifest.json',import.meta.url),'utf8'));
if(receipt.manifest?.model?.sha256!==manifest.model.sha256||receipt.manifest?.runtime?.sha256!==manifest.runtime.sha256)throw new Error('This setup receipt belongs to another model/runtime version. Run setup-model.py again before starting.');
if(![receipt.runtime,receipt.model].every(p=>typeof p==='string'&&resolve(p).startsWith(directory+sep)))throw new Error('Runtime and model must remain inside the verified setup directory.');
const child=spawn(receipt.runtime,['--model',receipt.model,'--host','127.0.0.1','--port','8845','--ctx-size','8192','--threads','4','--parallel','1','--jinja','--reasoning','off','--no-webui','--cors-origins','http://127.0.0.1:8844','--no-cors-credentials','--alias','workbench-qwen3-4b-q4'],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('error',e=>{console.error('Model runtime could not start:',e.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
