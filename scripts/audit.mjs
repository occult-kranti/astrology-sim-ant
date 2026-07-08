// audit.mjs — dependency-free static check: internal links + ES-module imports.
// Run from repo root: `node scripts/audit.mjs`  → exits non-zero on any broken ref.
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';
const ROOT = process.cwd();
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (['.git', 'node_modules', '.cache'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const files = walk(ROOT);
const htmls = files.filter(f => f.endsWith('.html'));
const jss = files.filter(f => f.endsWith('.js'));
let problems = 0;

// HTML href/src must resolve (skip external, data:, #, and ${…} template literals).
const attrRe = /(?:href|src)\s*=\s*"([^"]+)"/g;
for (const h of htmls) {
  const txt = readFileSync(h, 'utf8');
  let m;
  while ((m = attrRe.exec(txt))) {
    const url = m[1];
    if (/^(https?:|data:|mailto:|#|javascript:)/.test(url)) continue;
    if (url.includes('${')) continue; // JS template literal inside an inline <script>
    const path = url.split('#')[0].split('?')[0];   // a link may carry a query string (e.g. the golden-case share link)
    if (!path) continue;
    if (!existsSync(resolve(dirname(h), path))) { console.log(`BROKEN LINK  ${relative(ROOT, h)} -> ${url}`); problems++; }
  }
}
// JS relative imports must resolve.
const impRe = /(?:import|export)[^'"]*from\s*['"]([^'"]+)['"]/g;
for (const j of jss) {
  const txt = readFileSync(j, 'utf8');
  let m;
  while ((m = impRe.exec(txt))) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue;
    if (!existsSync(resolve(dirname(j), spec))) { console.log(`BROKEN IMPORT ${relative(ROOT, j)} -> ${spec}`); problems++; }
  }
}
console.log(`[audit] ${htmls.length} HTML, ${jss.length} JS scanned. Problems: ${problems}`);
process.exit(problems ? 1 : 0);
