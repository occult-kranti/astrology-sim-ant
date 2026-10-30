// Reconstruct drawn angles from actual SVG coordinates without a browser.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { calendarTimelinePlateSVG } from '../../../../assets/js/app/calendar-timeline.js';
import { buildCalendarTimelineFrame } from '../../../../assets/js/core/calendar-timeline.js';
const files = ['assets/js/app/calendar-timeline.js', 'assets/js/core/calendar-timeline.js'];
const root = new URL('../../../../', import.meta.url);
const hashes = () => Object.fromEntries(files.map(path => [path, crypto.createHash('sha256').update(fs.readFileSync(new URL(path, root))).digest('hex')]));
const before = hashes(), checks = [], cases = [];
const check = (label, passed) => checks.push({ label, passed: !!passed });
const norm = x => (x % 360 + 360) % 360;
const angle = (x, y) => norm(Math.atan2(y - 300, x - 300) * 180 / Math.PI + 90);
const close = (a, b) => Math.abs(norm(a - b + 180) - 180) < 1e-9;
const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
for (const [day, system, latitude] of [['2026-10-30', 'regiomontanus', 51.5074], ['1947-08-15', 'whole', 28.6139], ['2030-06-21', 'placidus', 69.6492], ['1994-10-26', 'equal', -33.8688]]) {
  const frame = buildCalendarTimelineFrame({ startDate: day, endDate: day, time: '12:00', timeZone: 'UTC', lat: latitude, lon: 0, system, includeGuidance: false }, 0);
  for (const mode of ['tropical', 'sidereal']) {
    const label = `${day}/${system}/${mode}`, svg = calendarTimelinePlateSVG(frame, mode), chart = mode === 'tropical' ? frame.charts.tropical : frame.charts.vedic;
    const canonical = mode === 'tropical' ? frame.sky.bodies : chart.planets;
    const bodies = [...svg.matchAll(/<g data-body="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)].map(m => {
      const circle = attrs(m[2].match(/<circle\b[^>]+>/)[0]);
      return { id: m[1], angle: angle(+circle.cx, +circle.cy) };
    });
    const cuspLines = [...svg.matchAll(/<line\b[^>]+>/g)].map(m => attrs(m[0])).filter(a => Math.abs(Math.hypot(+a.x1 - 300, +a.y1 - 300) - 73) < 1e-9);
    check(label + ': actual body circles encode canonical longitudes', bodies.length === canonical.length && bodies.every(b => close(b.angle, canonical.find(p => p.id === b.id).longitude)));
    check(label + ': actual twelve cusp lines encode canonical longitudes', cuspLines.length === 12 && cuspLines.every((line, i) => close(angle(+line.x2, +line.y2), chart.cusps[i])));
    check(label + ': displayed cusp direction sectors total360', Math.abs(chart.cusps.reduce((sum, cusp, i) => sum + norm(chart.cusps[(i + 1) % 12] - cusp), 0) - 360) < 1e-9);
    check(label + ': same-instant label and nonphysical-radius caveat', svg.includes(`data-date-iso="${frame.context.dateISO}"`) && svg.includes('not distance'));
    cases.push({ day, requestedSystem: system, actualSystem: frame.charts.tropical.actualSystem, mode, bodyCount: bodies.length, cuspCount: cuspLines.length });
  }
}
const unresolved = buildCalendarTimelineFrame({ startDate: '2011-12-30', endDate: '2011-12-30', time: '12:00', timeZone: 'Pacific/Apia', lat: -13.8333, lon: -171.75, system: 'whole' }, 0);
check('unavailable frame creates no tropical or sidereal geometry', calendarTimelinePlateSVG(unresolved) === '' && calendarTimelinePlateSVG(unresolved, 'sidereal') === '');
const after = hashes();
check('held source files unchanged while checking SVG', JSON.stringify(before) === JSON.stringify(after));
const receipt = { schemaVersion: 1, kind: 'independent-drawn-coordinate-review', generatedAt: new Date().toISOString(), environment: { node: process.version }, before, after, cases, checks, limitation: 'Headless SVG-coordinate reconstruction checks drawn direction and scope, not CSS layout, text collision, keyboard usability or screen-reader experience; those require the quality lane browser receipts.' };
fs.writeFileSync(new URL(process.argv[2] || 'render-review.json', import.meta.url), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ checks: checks.length, failed: checks.filter(x => !x.passed), cases }, null, 2));
if (checks.some(x => !x.passed)) process.exitCode = 1;
