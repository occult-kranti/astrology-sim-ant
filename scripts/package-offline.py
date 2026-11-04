"""Package the verified static inventory; no account, backend or installed dependencies."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
assert not (root / 'assets').is_symlink() and not (root / 'assets/offline-manifest.json').is_symlink()
inventory = json.loads((root / 'assets/offline-manifest.json').read_text())
assert set(inventory) == {'schemaVersion','version','totalBytes','files'} and inventory['schemaVersion'] == 1
assert isinstance(inventory['files'],list) and 0 < len(inventory['files']) <= 1500
assert type(inventory['totalBytes']) is int and 0 < inventory['totalBytes'] <= 100 * 1024 * 1024
assert hashlib.sha256(json.dumps(inventory['files'],separators=(',',':'),ensure_ascii=False).encode()).hexdigest() == inventory['version']
allowed={'.html','.js','.mjs','.css','.json','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.otf','.webmanifest'}
def regular_file(name):
    assert isinstance(name,str) and re.fullmatch('[A-Za-z0-9_./-]+',name) and not name.startswith('/')
    parts=name.split('/')
    assert all(part and not part.startswith('.') and part != 'node_modules' for part in parts)
    assert name in ('index.html','manifest.webmanifest','sw.js') or parts[0] in ('pages','assets')
    assert Path(name).suffix in allowed
    path=root
    for part in parts:
        path=path / part
        assert not path.is_symlink(), name
    assert path.is_file() and path.resolve().is_relative_to(root)
    return path
entries = []
names=set()
for row in inventory['files']:
    assert set(row) == {'path','bytes','sha256'}
    name = row['path']
    assert name not in names and name not in ('sw.js','assets/offline-manifest.json')
    names.add(name)
    assert type(row['bytes']) is int and 0 <= row['bytes'] <= 32 * 1024 * 1024
    assert isinstance(row['sha256'],str) and re.fullmatch('[0-9a-f]{64}',row['sha256'])
    path=regular_file(name)
    data = path.read_bytes()
    assert len(data) == row['bytes'] and hashlib.sha256(data).hexdigest() == row['sha256'], name
    entries.append((name, data))
assert len(entries) <= 1500 and sum(len(data) for _, data in entries) == inventory['totalBytes']
assert names >= {'index.html','manifest.webmanifest'}
assert [row['path'] for row in inventory['files']] == sorted(names)
for name in ['sw.js', 'assets/offline-manifest.json']:
    entries.append((name, regular_file(name).read_bytes()))
readme = '''THE ASTROLOGER'S WORKBENCH — PORTABLE STATIC EDITION

1. Extract this ZIP into a folder.
2. Open a terminal in that folder and run:
       python3 -m http.server 8000 --bind 127.0.0.1
   On Windows, use: py -m http.server 8000 --bind 127.0.0.1
3. Open http://localhost:8000/pages/desktop.html in your browser.
   The existing private birth reader remains available at:
       http://localhost:8000/pages/birth-reading.html
   The original collection homepage is http://localhost:8000/.

No internet or backend account is needed for local calculations. This command
serves static files on your own computer only. Modern browsers require an HTTP
origin for JavaScript modules and workers; double-clicking the application's
HTML files is not equivalent. A downloaded private HTML reading is self-contained
and can be opened directly without this local server.

Includes the public pages, local calculation engines, charts and reference data.
The desktop research assistant searches included source passages offline.
Generated AI answers additionally need the companion ZIP or repository checkout,
its local model runtime, or an explicitly configured external model provider.
External books, websites, live information and hosted AI/MCP services require
their own network connection. No personal birth data is included in this ZIP.
In the desktop studio, Import JSON accepts an exported chart library. A study
JSON is calculated evidence, not a chart-library backup. Delete removes a saved
chart from that browser; keep personal exports in a private folder.

The optional 'Make available offline' feature stores this edition in the browser
for this localhost origin. Browser storage can be cleared or evicted; keep this
ZIP and your private exports separately. Stop the server with Ctrl+C.
'''
entries.append(('READ-ME-OFFLINE.txt', readme.encode()))
output = Path(args.output).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for name, data in sorted(entries):
        info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
print(json.dumps({'path':str(output),'files':len(entries),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'manifestVersion':inventory['version']}))
