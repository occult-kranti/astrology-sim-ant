# Reproducible CPU adapter experiment

This laboratory changes real model parameters using a small LoRA adapter. It is separate from the production Qwen3-4B GGUF provider, prompt changes and lexical retrieval. The adapter is experimental; weight updates and lower training loss do not establish useful or accurate answers.

The experiment uses the original Apache-2.0 `Qwen/Qwen3-0.6B` instruct model pinned in `setup-base.py`, 24 original CC0 training examples, four development cases per round, and a separately sealed final set. No copyrighted full books, private charts, conversations or held-out answers are training inputs. The selected development cases are intentionally reused for tuning and are never called held-out accuracy.

## Install outside the repository

Use Linux x86_64, Python 3.12, about 6 GB free disk for the isolated training environment/base model and at least 8 GiB available RAM. The executed host had four CPU cores of quota, 32 GiB memory, AVX512-BF16 support and no GPU. Other CPU/platform performance is unverified.

```bash
python3 -m venv "$HOME/.cache/astrology-workbench-model-lab/venv"
"$HOME/.cache/astrology-workbench-model-lab/venv/bin/pip" install torch==2.6.0 --index-url https://download.pytorch.org/whl/cpu
"$HOME/.cache/astrology-workbench-model-lab/venv/bin/pip" install -r local-rag/model-lab/requirements.txt
python3 local-rag/model-lab/setup-base.py --directory "$HOME/.cache/astrology-workbench-model-lab/base"
```

The download recipe honors inherited proxy/CA configuration and checks pinned revision, size and available LFS SHA256 values. `python-lock.txt` records the actual complete environment. Base weights and adapters remain outside Git.

## Reproduce training and evaluation

The JSON configuration receipts under `research/model-lab/rounds/` record the exact executed paths and settings. Copy a configuration to your own directory, change its base/training/output paths, and run:

```bash
python local-rag/model-lab/train-adapter.py --config /path/to/training-config.json
python local-rag/model-lab/generate.py --config /path/to/generation-config.json
```

Use the isolated environment's Python executable. Training JSONL rows must explicitly carry `split:"training"` and end with an assistant target in `messages`. The script rejects overlong sequences instead of silently discarding evidence/labels, refuses a nonempty output directory, saves initial and final safetensors, and records parameter hashes, L2 updates, losses, elapsed time and memory. After the first adapter regressed on development cases, the final stage reset the untouched base, lowered the learning rate and used a separately frozen correction to training-only citation/grounding targets. It did not continue the regressed checkpoint or add development answers.

`freeze-requests.mjs` captures exact prompt source, selected cases, supplied evidence and resulting messages before evaluation. `generate-llama.mjs` evaluates an already-running loopback model; `generate.py` runs the same HF base/tokenizer/precision with or without an adapter. The actual 4B runtime uses JSON grammar while the HF runner does not; format outcomes are therefore configuration comparisons. `evaluate.py` reports separate numeric-pattern, citation-ID, quote-substring, prohibited-pattern, format, truncation and coverage signals. These checks are not a semantic judge or an aggregate accuracy score.

## Use an exported adapter experimentally

An adapter is not a standalone model. Download the pinned base first, then supply the extracted final adapter directory explicitly:

```bash
python local-rag/model-lab/serve-adapter.py --base /path/to/pinned/base --adapter /path/to/adapter --port 8846
```

In another terminal, configure the local companion:

```bash
RAG_LOCAL_BASE_URL=http://127.0.0.1:8846/v1/ RAG_LOCAL_MODEL=workbench-lab-qwen3-0.6b-lora RAG_MAX_TOKENS=192 node local-rag/server.mjs
```

The runner binds 127.0.0.1, accepts one request at a time, requires the exact model name, uses deterministic greedy generation, bounds input/output and generation time, and does not accept direct browser origins. It never executes proposed actions. Use the companion UI for reviewed action proposals. This adapter route is optional; it does not replace the 4B default or the browser's source-excerpt mode.

The website itself remains static. No base model is embedded in HTML or shipped in Git, and no untested WebGPU capability is claimed. Real ChatGPT or API inference still requires the user's separate authorized provider connection.
