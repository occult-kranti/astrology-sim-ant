// Pin and verify the companion app at release time; it is never copied into Pages.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseSkyHandoff, buildSkyHandoff } from '../assets/js/core/sky-handoff.js';
const skyRoot=resolve(process.env.SKY_LENS_ROOT || '../skylens');
assert.equal(await readFile(new URL('../assets/js/core/sky-handoff.js',import.meta.url),'utf8'),await readFile(resolve(skyRoot,'js/handoff.js'),'utf8'),'Both deployed applications must agree on the bridge contract.');
const {cases}=JSON.parse(await readFile(resolve(skyRoot,'tests/fixtures/sky-handoff-v1.json'),'utf8'));
for(const value of cases) for(const destination of ['studio','skylens']) assert.deepEqual(parseSkyHandoff(new URL(buildSkyHandoff(value,destination)).hash),value);
console.log(`Sky handoff parity: matching adapter source and ${cases.length} fixtures at both destinations.`);
