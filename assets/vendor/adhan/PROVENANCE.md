# Adhan source snapshot

Retrieved through the authorized GitHub connector on 2026-10-03.

- Upstream: https://github.com/batoulapps/adhan-js
- Pinned commit: `a2c4bda71352f43355b23448c6329df150ca0ec3` (develop snapshot)
- Upstream package.json version: `4.4.6`; this is a pinned source snapshot, not a claim to an untouched npm distribution.
- License: MIT, copyright Batoul Apps; full original text in [LICENSE](LICENSE).
- Original method documentation is retained in [METHODS.md](METHODS.md).
- No runtime package manager, external CDN, API key, or network calculation is required.

## Reproducible transformation

Source files are upstream `src/*.ts` at the pinned commit. The local environment supplied Node v24.19.0. The script below uses Node's TypeScript transformer, with no downloaded build dependency. Only the following adaptations are applied:

1. Remove TypeScript annotations and transform constructor parameter properties with `stripTypeScriptTypes(source, {mode: 'transform'})`.
2. Remove the type-only `ValueOf` import from `TypeUtils.js`, which that transformer otherwise preserves. No runtime value is removed.
3. Change civil-date field access from host-local getters to UTC getters, and change the civil-day construction in `DateUtils.dateByAddingDays` to `Date.UTC`. `PolarCircleResolution`'s date setter is also UTC. This permits the wrapper to pass a date-only UTC anchor regardless of the device's time zone. Astronomical formulas, prayer convention parameters, rounding, and event timestamps are unchanged.
4. Prefix each generated file with attribution and this adaptation notice.

To rebuild, obtain the pinned upstream source through authorized access, then run:

```sh
node assets/vendor/adhan/rebuild.mjs /path/to/adhan-js/src
node scripts/tests/cultural-calendars.mjs
TZ=Pacific/Honolulu node scripts/tests/cultural-calendars.mjs
```

The wrapper additionally chooses among solar-date anchors −1/0/+1 to make Dhuhr land on the requested observer civil date. This is necessary around the date line (Apia/Kiritimati). A skipped civil day, such as 2011-12-30 in Pacific/Apia, is rejected. Prayer events that legitimately spill into an adjacent civil date retain their date labels.

## Reference provenance

Qibla fixture numbers come from upstream `test/qibla.test.ts`; our numerical spherical-bearing implementation is separate. Prayer tests use the independently originated Yeni Safak Ankara January/June 2019 timetable transcription retained in upstream `Shared/Times/Ankara-Turkey.json`, with upstream's two-minute tolerance. The original dated newspaper URL could not be retrieved during this execution, so these are explicitly retained-source fixtures, not fresh direct timetable verification. No universal local-minute accuracy is claimed from them.
