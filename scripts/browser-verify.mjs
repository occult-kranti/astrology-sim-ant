// browser-verify.mjs — load every page in a real Chromium and fail on any console
// error / pageerror / failed request, and assert the chrome is injected.
//
// Needs puppeteer (ephemeral; install in /tmp). Pass its entry via env:
//   PUPPETEER_PKG=/tmp/node_modules/puppeteer/lib/puppeteer/puppeteer.js \
//   BASE=http://localhost:8003 node scripts/browser-verify.mjs
// The `verify-site` skill sets these up. Chromium also needs system libs (see the skill).
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
const PKG = process.env.PUPPETEER_PKG;
const BASE = process.env.BASE || 'http://localhost:8003';
if (!PKG) { console.error('Set PUPPETEER_PKG to puppeteer\'s entry (…/lib/puppeteer/puppeteer.js)'); process.exit(2); }
const puppeteer = (await import(PKG)).default;

function walk(d, o = []) {
  for (const e of readdirSync(d)) {
    if (['.git', 'node_modules', '.cache'].includes(e)) continue;
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, o); else if (e.endsWith('.html')) o.push(p.replace(process.cwd(), ''));
  }
  return o;
}
const pages = walk(process.cwd()).sort();
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
let tot = 0;
for (const rel of pages) {
  const url = BASE + rel.replace(/\\/g, '/');
  const pg = await b.newPage();
  const errs = [];
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
  pg.on('requestfailed', r => errs.push('REQFAIL: ' + r.url() + ' ' + (r.failure()?.errorText)));
  try {
    await pg.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise(r => setTimeout(r, 400));
    const hdr = (await pg.$('header.site')) ? 'hdr✓' : 'hdr✗';
    if (hdr === 'hdr✗') { errs.push('chrome not injected (no header.site)'); }
    console.log(`${errs.length ? '✗ ' + errs.length + ' err' : '✓ clean'} ${hdr}  ${rel}`);
    errs.forEach(e => console.log('     · ' + e.slice(0, 140)));
    tot += errs.length;
  } catch (e) { console.log('✗ NAVFAIL ' + rel + ': ' + e.message.slice(0, 80)); tot++; }
  await pg.close();
}
await b.close();
console.log(`\n[browser-verify] ${pages.length} pages, ${tot} errors`);
process.exit(tot ? 1 : 0);
