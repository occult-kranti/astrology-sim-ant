// Build the pinned Adhan source snapshot after obtaining it via authorized access.
// Usage: node assets/vendor/adhan/rebuild.mjs /path/to/adhan-js/src
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Provide the pinned Adhan src directory. See PROVENANCE.md.');
const outputDir = fileURLToPath(new URL('.', import.meta.url));
for (const name of (await readdir(sourceDir)).filter(name => name.endsWith('.ts')).sort()) {
  const source = await readFile(resolve(sourceDir, name), 'utf8');
  let js = stripTypeScriptTypes(source, { mode: 'transform' });
  js = js.replace(/^import \{ ValueOf \} from '\.\/TypeUtils\.js';\n/gm, '');
  js = js.replace(/\.get(FullYear|Month|Date|Hours|Minutes|Seconds)\(/g, '.getUTC$1(').replace(/\.setDate\(/g, '.setUTCDate(');
  js = js.replace('new Date(year, month, day, hours, minutes, seconds)', 'new Date(Date.UTC(year, month, day, hours, minutes, seconds))');
  await writeFile(resolve(outputDir, name.replace(/\.ts$/, '.js')), '// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.\n' + js);
}
