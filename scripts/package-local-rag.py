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
    'local-rag/start-model.mjs',
}
for name in tracked:
    parts = name.split('/')
    if not name or any(p == 'node_modules' for p in parts):
        continue
    if name in companion:
        extra.add(name)
    elif parts[0] == 'mcp' and name.endswith(('.mjs', '.md', '.json')) and not any(p.startswith('.') for p in parts):
        extra.add(name)
    elif parts[0] == 'docs' and len(parts) == 2 and name.endswith(('.md', '.json')) and not any(p.startswith('.') for p in parts):
        extra.add(name)
    elif name in {
        'scripts/tests/local-rag-server.mjs', 'scripts/tests/chatgpt-login.mjs',
        'scripts/tests/workbench-rag.mjs', 'scripts/tests/workbench-chat-actions.mjs',
        'scripts/build-workbench-rag.mjs', 'scripts/export-workbench-rag-sql.mjs',
        'research/workbench-rag/manifest.json', 'research/workbench-rag/coverage.json',
        'research/workbench-rag/chunks.jsonl',
        'supabase/migrations/202611040001_workbench_rag.sql',
    }:
        extra.add(name)
assert companion <= extra, 'Stage every deliberate companion source file before packaging.'
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
entries['START-LOCAL-ASSISTANT.txt'] = b'''ASTROLOGY WORKBENCH - LOCAL RAG COMPANION

Extract this archive into a folder. In a terminal in that folder:
  npm ci --prefix local-rag --ignore-scripts
  python3 local-rag/setup-model.py
  node local-rag/start-model.mjs
In a second terminal in the same folder:
  npm start --prefix local-rag
Open http://127.0.0.1:8844/pages/desktop.html and choose Research chat.

The pinned model setup is tested on Linux x86_64, Node22+, Python3.12+.
It downloads model/runtime files to your own cache. Check model-manifest.json
for pinned download sizes and allow extra space for extraction and cache.
Models are not inside this archive. Other platforms can configure their own
OpenAI-compatible local server; see local-rag/README.md for exact options.
Reference search and chart calculations work without a model or account.
Generated responses are optional and can be inaccurate. Review source passages.

OpenAI API and official local ChatGPT login are optional distinct providers.
Keep credentials on the companion; do not put them into the webpage or Git.
The Supabase migration is included but no remote project has been configured.
No personal chart, conversation, access token or model weight is included.

This is a runtime and source-study distribution, not a complete Git checkout.
Top-level method/setup documents and public corpus sources are included. Full
research evidence, repository automation, .git history and unrelated test/build
inputs are not bundled. Some developer commands in retained repository documents
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
