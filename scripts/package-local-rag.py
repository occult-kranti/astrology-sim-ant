"""Package public static files plus the optional local companion; never weights/secrets."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import subprocess
import tempfile
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
tracked = set(subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0'))
extra = {'README.md', 'package.json', 'LICENSE', 'LICENSE.md', 'THIRD-PARTY-NOTICES.md'} & tracked
# Public companion source is explicit: never sweep future auth/cache JSON into ZIPs.
companion = {
    'local-rag/.env.example', 'local-rag/README.md', 'local-rag/server.mjs',
    'local-rag/chatgpt-login.mjs', 'local-rag/provider-http.mjs',
    'local-rag/model-manifest.json', 'local-rag/package.json',
    'local-rag/package-lock.json', 'local-rag/setup-model.py',
    'local-rag/start-model.mjs', 'local-rag/model-prompt.mjs',
}
# Optional experimental Python model lab: recipes only, never environments,
# checkpoints, training caches or model weights. Installing the companion's Node
# dependencies does not install or execute these opt-in Python recipes.
model_lab = {
    'local-rag/model-lab/README.md', 'local-rag/model-lab/requirements.txt',
    'local-rag/model-lab/python-lock.txt', 'local-rag/model-lab/setup-base.py',
    'local-rag/model-lab/train-adapter.py', 'local-rag/model-lab/generate.py',
    'local-rag/model-lab/serve-adapter.py', 'local-rag/model-lab/evaluate.py',
    'local-rag/model-lab/test-evaluator.py', 'local-rag/model-lab/summarize.py',
    'local-rag/model-lab/freeze-requests.mjs', 'local-rag/model-lab/generate-llama.mjs',
}
# Frozen public model experiment fixtures and receipts, published after the
# independent final-set review. An explicit list excludes any future cache or
# private file; these datasets are not installed as or automatically used for training.
model_research = {
    'research/model-lab/base-model-download.json',
    'research/model-lab/challenger-download.json',
    'research/model-lab/evaluation-cases.json',
    'research/model-lab/final-freeze.json',
    'research/model-lab/hardware.json',
    'research/model-lab/heldout-unseal.json',
    'research/model-lab/independent-review.json',
    'research/model-lab/load-probe.json',
    'research/model-lab/post-evaluation-integrity.json',
    'research/model-lab/probe-config.json',
    'research/model-lab/results-summary.json',
    'research/model-lab/rounds/heldout-4b-config.json',
    'research/model-lab/rounds/heldout-4b-content-signals-v2.json',
    'research/model-lab/rounds/heldout-4b.json',
    'research/model-lab/rounds/heldout-adapter-config.json',
    'research/model-lab/rounds/heldout-adapter-content-signals-v2.json',
    'research/model-lab/rounds/heldout-adapter.json',
    'research/model-lab/rounds/heldout/cases.snapshot.json',
    'research/model-lab/rounds/heldout/freeze.json',
    'research/model-lab/rounds/heldout/model-prompt.snapshot.txt',
    'research/model-lab/rounds/heldout/requests.json',
    'research/model-lab/rounds/round-1-4b-config.json',
    'research/model-lab/rounds/round-1-4b-content-signals-v2.json',
    'research/model-lab/rounds/round-1-4b-signals.json',
    'research/model-lab/rounds/round-1-4b.json',
    'research/model-lab/rounds/round-1-small-base-config.json',
    'research/model-lab/rounds/round-1-small-base-content-signals-v2.json',
    'research/model-lab/rounds/round-1-small-base-signals.json',
    'research/model-lab/rounds/round-1-small-base.json',
    'research/model-lab/rounds/round-1/cases.snapshot.json',
    'research/model-lab/rounds/round-1/freeze.json',
    'research/model-lab/rounds/round-1/model-prompt.snapshot.txt',
    'research/model-lab/rounds/round-1/requests.json',
    'research/model-lab/rounds/round-2-4b-config.json',
    'research/model-lab/rounds/round-2-4b-content-signals-v2.json',
    'research/model-lab/rounds/round-2-4b-signals.json',
    'research/model-lab/rounds/round-2-4b.json',
    'research/model-lab/rounds/round-2-adapter-config.json',
    'research/model-lab/rounds/round-2-adapter-content-signals-v2.json',
    'research/model-lab/rounds/round-2-adapter-signals.json',
    'research/model-lab/rounds/round-2-adapter.json',
    'research/model-lab/rounds/round-2-training-config.json',
    'research/model-lab/rounds/round-2-training.json',
    'research/model-lab/rounds/round-2/cases.snapshot.json',
    'research/model-lab/rounds/round-2/freeze.json',
    'research/model-lab/rounds/round-2/model-prompt.snapshot.txt',
    'research/model-lab/rounds/round-2/requests.json',
    'research/model-lab/rounds/round-3-4b-config.json',
    'research/model-lab/rounds/round-3-4b-content-signals-v2.json',
    'research/model-lab/rounds/round-3-4b-signals.json',
    'research/model-lab/rounds/round-3-4b.json',
    'research/model-lab/rounds/round-3-adapter-config.json',
    'research/model-lab/rounds/round-3-adapter-content-signals-v2.json',
    'research/model-lab/rounds/round-3-adapter-signals.json',
    'research/model-lab/rounds/round-3-adapter.json',
    'research/model-lab/rounds/round-3-challenger-config.json',
    'research/model-lab/rounds/round-3-challenger-content-signals-v2.json',
    'research/model-lab/rounds/round-3-challenger.json',
    'research/model-lab/rounds/round-3-training-config.json',
    'research/model-lab/rounds/round-3-training.json',
    'research/model-lab/rounds/round-3/cases.snapshot.json',
    'research/model-lab/rounds/round-3/challenger-requests.json',
    'research/model-lab/rounds/round-3/freeze.json',
    'research/model-lab/rounds/round-3/model-prompt.snapshot.txt',
    'research/model-lab/rounds/round-3/requests.json',
    'research/model-lab/sources.json',
    'research/model-lab/training-probe.json',
    'research/model-lab/training-token-lengths.json',
    'research/model-lab/training-v3.json',
}
public_reading = {
    'scripts/build-reading-lab-database.mjs', 'scripts/test-reading-lab-db.mjs',
    'scripts/test-reading-lab-protocol.mjs', 'scripts/tests/reading-lab.mjs',
    'research/reading-lab/source-ledger.json',
    'supabase/migrations/202611040002_reading_lab.sql',
}
public_astrocartography = {
    'scripts/tests/timeline-search.mjs',
    'scripts/tests/timeline-statistics.mjs',
    'scripts/tests/timeline-search-independent.mjs',
    'scripts/tests/calendar-format-cache.mjs',
    'scripts/test-timeline-search-protocol.mjs',
    'scripts/run-timeline-search-study.mjs',
    'research/timeline-search/independent-fixtures.json',
    'research/timeline-search/statistical-sources.json',
    'research/timeline-search/public-study-freeze.json',
    'research/timeline-search/public-three-year-summary.json',
    'scripts/tests/astrocartography.mjs', 'scripts/tests/astrocartography-independent.mjs',
    'scripts/test-astrocartography-protocol.mjs',
    'research/astrocartography/source-ledger.json',
    'research/astrocartography/independent-fixtures.json',
}
for name in tracked:
    parts = name.split('/')
    if not name or any(p == 'node_modules' for p in parts):
        continue
    if name in companion or name in model_lab or name in model_research or name in public_reading or name in public_astrocartography:
        extra.add(name)
    elif parts[0] == 'mcp' and name.endswith(('.mjs', '.md', '.json')) and not any(p.startswith('.') for p in parts):
        extra.add(name)
    elif parts[0] == 'docs' and len(parts) == 2 and name.endswith(('.md', '.json')) and not any(p.startswith('.') for p in parts):
        extra.add(name)
    elif name in {
        'scripts/tests/local-rag-server.mjs', 'scripts/tests/chatgpt-login.mjs',
        'scripts/tests/workbench-rag.mjs', 'scripts/tests/workbench-chat-actions.mjs',
        'scripts/tests/reading-lab.mjs', 'scripts/test-workbench-rag-db.mjs',
        'scripts/tests/model-lab-fixtures.mjs',
        'scripts/build-workbench-rag.mjs', 'scripts/export-workbench-rag-sql.mjs',
        'research/workbench-rag/manifest.json', 'research/workbench-rag/coverage.json',
        'research/workbench-rag/chunks.jsonl',
        'supabase/migrations/202611040001_workbench_rag.sql',
    }:
        extra.add(name)
assert companion <= extra, 'Stage every deliberate companion source file before packaging.'
assert model_lab <= extra, 'Stage the complete optional model-lab recipe set before packaging.'
assert public_reading <= extra, 'Stage the complete public reading database recipe and tests before packaging.'
assert public_astrocartography <= extra, 'Stage the public astrocartography source fixtures and tests before packaging.'
assert model_research <= extra, 'Stage the frozen public model experiment fixtures and receipts before packaging.'
entries = {}
with tempfile.TemporaryDirectory(prefix='workbench-local-rag-') as temporary:
    static = Path(temporary) / 'static.zip'
    subprocess.run(['python3', str(root / 'scripts/package-offline.py'), '--output', str(static)], check=True, capture_output=True)
    with zipfile.ZipFile(static) as archive:
        entries.update({name: archive.read(name) for name in archive.namelist()})
for name in sorted(extra):
    path = root
    for part in name.split('/'):
        assert part and part not in ('.', '..')
        path /= part
        assert not path.is_symlink(), name
    assert path.resolve().is_relative_to(root) and path.is_file()
    data = path.read_bytes()
    assert len(data) <= 32 * 1024 * 1024
    if name == 'local-rag/.env.example':
        for line in data.decode().splitlines():
            if '=' not in line or line.lstrip().startswith('#'):
                continue
            key, value = line.split('=', 1)
            if re.search(r'(?:^|_)(?:API_KEY|ACCESS_TOKEN|REFRESH_TOKEN|SECRET|PASSWORD)$', key.strip()):
                assert not value.strip(), 'Credential examples must have empty values.'
    entries[name] = data
# Unlike whole-repository research commands, this optional public database recipe
# is complete: every explicitly hashed generator input must be in the package.
reading_database = json.loads(entries['assets/data/reading-lab-examples.json'])
for source in reading_database['sourceFiles']:
    assert source['file'] in entries, f"Missing public reading generator input: {source['file']}"
    assert hashlib.sha256(entries[source['file']]).hexdigest() == source['sha256'], f"Stale public reading input: {source['file']}"
entries['START-LOCAL-ASSISTANT.txt'] = b'''ASTROLOGY WORKBENCH - LOCAL RAG COMPANION

Extract this archive into a folder. In a terminal in that folder:
  npm ci --prefix local-rag --ignore-scripts
  python3 local-rag/setup-model.py
  node local-rag/start-model.mjs
In a second terminal in the same folder:
  npm start --prefix local-rag
Open http://127.0.0.1:8844/pages/desktop.html and choose Research chat.
For source examples and calendar comparisons, open:
  http://127.0.0.1:8844/pages/reading-lab.html

The pinned model setup is tested on Linux x86_64, Node22+, Python3.12+.
It downloads model/runtime files to your own cache. Check model-manifest.json
for pinned download sizes and allow extra space for extraction and cache.
Models are not inside this archive. Other platforms can configure their own
OpenAI-compatible local server; see local-rag/README.md for exact options.
Reference search and chart calculations work without a model or account.
Generated responses are optional and can be inaccurate. Review source passages.

OpenAI API and official local ChatGPT login are optional distinct providers.
Keep credentials on the companion; do not put them into the webpage or Git.
The public RAG and Reading Lab Supabase migrations are included; no remote
project has been configured. Reading Lab's public JSON, source ledger, generator
and database tests are included. They contain authored public examples only.
No personal chart, conversation, access token or model weight is included.

The optional local-rag/model-lab/ directory contains isolated experimental Python
recipes, pinned requirements and an environment lock. They are not installed or
run by npm ci or by the normal companion. Read its README before explicitly
creating the separate environment. Its small 0.6B LoRA adapter requires its own
pinned base and is experimental; it is not the default 4B model. No experiment
or adapter is enabled automatically. The frozen public model fixtures, original
training examples and published evaluation receipts are under research/model-lab.
Keep training, development and the final evaluation split separate; do not train
on the published evaluation answers. See docs/2026-11-model-training.md for the
independent review and observed failures. The PostgreSQL test additionally needs
an explicit external PGlite package; see docs/2026-11-workbench-supabase.md.

This is a runtime and source-study distribution, not a complete Git checkout.
Top-level method/setup documents and public corpus sources are included. Full
research archives outside the named public model/reading study, repository
automation, .git history and unrelated test/build inputs are not bundled. Some developer commands in retained repository documents
require the complete source checkout from:
  https://github.com/occult-kranti/astrology-sim-ant
Use the repository when reproducing the entire CI/research pipeline.
'''
for name in entries:
    parts = name.split('/')
    assert all(part not in ('..', '.git', 'node_modules', 'private-birth-reading') for part in parts), name
    assert not name.endswith(('.gguf', '.safetensors', '.pem', '.key', '.env')), name
    assert not name.startswith(('docs/evidence/', 'research/downloads/', 'test-results/')), name
assert len(entries) <= 2500 and sum(map(len, entries.values())) <= 150 * 1024 * 1024
package_manifest = {
    'schemaVersion': 1,
    'kind': 'public-workbench-local-companion-runtime',
    'completeRepositoryCheckout': False,
    'offlineManifestVersion': json.loads(entries['assets/offline-manifest.json'])['version'],
    'modelWeightsIncluded': False,
    'runtimeCredentialsIncluded': False,
    'experimentalModelLabRecipesIncluded': True,
    'publicReadingDatabaseRecipeComplete': True,
    'publicModelExperimentFiles': len(model_research),
    'pythonDependenciesInstalledAutomatically': False,
    'files': [{'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()} for name, data in sorted(entries.items())],
}
entries['LOCAL-ASSISTANT-PACKAGE.json'] = (json.dumps(package_manifest, indent=2) + '\n').encode()
output = Path(args.output).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for name, data in sorted(entries.items()):
        info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
receipt = {'path': str(output), 'files': len(entries), 'bytes': output.stat().st_size, 'sha256': hashlib.sha256(output.read_bytes()).hexdigest(), 'modelWeightsIncluded': False, 'credentialsIncluded': False, 'completeRepositoryCheckout': False, 'offlineManifestVersion': package_manifest['offlineManifestVersion'], 'publicFileManifestSHA256': hashlib.sha256(entries['LOCAL-ASSISTANT-PACKAGE.json']).hexdigest()}
output.with_suffix('.receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt))
