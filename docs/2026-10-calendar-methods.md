# Calendars, prayer times, and direction calculations

Implementation and research date: **2026-10-03 UTC**. Entry point: `pages/calendars.html`. Runtime modules: `assets/js/core/cultural-calendars.js` and `assets/js/app/cultural-calendars.js`. This page adds an organized calculator surface to the existing Workbench; it does not replace existing Jyotisha tools or imply one universal religious calendar.

## Input contracts and supported functions

| Function | Inputs / units | Engine and convention | Range / limitations |
|---|---|---|---|
| Gregorian ↔ Julian ↔ JD | Calendar date `YYYY-MM-DD`, named input calendar, decimal UTC hour 0≤h<24, or numeric JD | Existing `core/calendar.js` Fliegel/Van Flandern + Richards arithmetic; Gregorian proleptic, Julian proleptic | Gregorian output years 1–9999 CE; validated month/day and calendar-specific leap rule. No regional adoption gap or BCE form. JD changes at noon; UTC approximated as uniform days, no leap seconds or TT conversion. |
| Civil calendar display | Exact UTC date/time plus explicit IANA display zone | Native `Intl.DateTimeFormat`; requires resolved calendar ID match | Interface range 1900–2100; browser/ICU data determines calendar and historical-zone behavior. Tested reference dates do not establish all-year accuracy. Dates use civil midnight, not sunset. |
| Gregorian Easter | Integer year | Meeus/Jones/Butcher Gregorian ecclesiastical computus | 1583–4099. Tabular ecclesiastical Moon, not astronomical full moon. |
| Julian Easter | Integer year | Julian ecclesiastical computus, then shared JDN conversion | 1583–4099. Both original Julian and Gregorian civil dates shown; no assertion about every church's adopted convention. |
| Qibla | Latitude degrees north, longitude degrees east | Spherical initial great-circle bearing to 21.4225241°N, 39.8261818°E | Full globe excluding poles and a ~6 m singular region around Kaaba/antipode. Clockwise from true north, not magnetic compass heading. Numerical output only, no sensor alignment. |
| Prayer times | Local Gregorian civil day, lat/lon, explicit IANA location zone, method, Asr, high-latitude rule, extra Isha minutes | Pinned MIT Adhan 4.4.6 source snapshot, UTC civil-date adaptation | 1900–2100. Method-specific parameters and adjustments; minute rounding; no terrain/elevation correction. Polar resolution remains explicitly unresolved. Date-line seed correction and skipped civil-date rejection. |

The UTC calendar form intentionally does not ask a browser to guess a local clock's offset. All display zones are validated. Coordinates do not imply a civil time zone: preset places include a named zone; device location only proposes the device's current zone, which the interface asks users to check. The date-only prayer form is separate from the instant-based civil-calendar form.

## Calendar IDs and boundaries

- `hebrew`: Hebrew **civil** date display. Religious sunset boundary, Israel/diaspora observances, and festival policies are not calculated.
- `islamic-civil`: arithmetic tabular Islamic civil calendar, not observed crescent sightings.
- `islamic-umalqura`: browser-provided Umm al-Qura data. Observational/local-authority determinations may differ; values outside runtime table coverage may use implementation fallback rules. Runtime support is not evidence of religious authority.
- `chinese`: Chinese lunisolar calendar, retaining `relatedYear`, textual month, and leap-month names rather than assuming a numeric Gregorian-style year/month. This does not claim Korean/Vietnamese equivalence.
- `buddhist`: modern Thai Buddhist civil era; not a Buddhist observance calculator or a historical Thai new-year reconstruction.
- `indian`: Indian national Saka solar calendar; not a generic Hindu lunar calendar.

Unsupported calendars explicitly report unavailable. The library is not silently allowed to fall back to Gregorian. The page does not calculate regional sunset boundaries for these civil date displays. Existing Muhūrta instantaneous elements are linked without presenting them as full local Panchang or festival decisions. Jain, Sikh, regional Hindu, and full community observance calendars need identified rules and authoritative fixtures before numerical outputs can be added.

## Prayer conventions actually exposed

| Method | Fajr / Isha basis | Built-in changes inherited from Adhan |
|---|---|---|
| Muslim World League | 18° / 17° solar depression | Dhuhr +1 minute |
| North America / ISNA | 15° / 15° | Dhuhr +1 minute |
| Egyptian | 19.5° / 17.5° | Dhuhr +1 minute |
| Karachi | 18° / 18° | Dhuhr +1 minute |
| Umm al-Qura | 18.5° / 90 minutes after sunset | No automatic Ramadan change. Explicit +30 Isha input can implement a selected 120-minute policy. |
| Moonsighting Committee | Seasonal twilight method; upstream special high-latitude behavior | Dhuhr +5, Maghrib +3 minutes; see retained METHODS.md |
| Turkey | 18° / 17° | Sunrise −7, Dhuhr +5, Asr +4, Maghrib +7 minutes |

Asr choices are shadow factor 1 (Shafi and others) and factor 2 (Hanafi). Twilight limits are half-night, one-seventh-night, or angle/60 portion. The method's own seasonal rules may supersede the generic limit. Missing sunrise/sunset events are not replaced with invented midnight values or a different location/day; unresolved events report “No calculable time with this method.” Dhuhr can remain calculable during a polar day. Extra Isha adjustment is explicit and limited to ±120 minutes.

The vendored library uses UTC civil getters consistently so a phone configured for Honolulu does not change prayer instants for Istanbul. Dhuhr must map to the requested observer-zone civil date; this resolves longitude versus civil date-line differences. See `assets/vendor/adhan/PROVENANCE.md` and reproducible rebuild script for exact upstream version and adaptation.

## Verification and evidence

Run `node scripts/tests/cultural-calendars.mjs`. It exports `run()` for the repository engine gate and runs standalone. **58 checks passed** on Node v24.19.0 / runtime ICU, both with `TZ=UTC` and with `TZ=Pacific/Honolulu`. The suite also switches host TZ between UTC/Honolulu/Apia and compares exact prayer event output.

Independent or independently originated references:

1. [USNO calendar chapter](https://aa.usno.navy.mil/downloads/c15_usb_online.pdf): J2000 JD 2451545 at noon; MJD epoch; 1582 and British 1752 conversion boundaries. Gregorian century leap exceptions are checked.
2. [USNO Islamic calendar](https://aa.usno.navy.mil/faq/islamic): civil epoch 16 July 622 Julian. The fixture validates date conversion only; native calendar display is intentionally limited to 1900–2100.
3. [USNO Easter](https://aa.usno.navy.mil/faq/easter): exact Gregorian 2010-04-04, 1962-04-22, 1954-04-18 examples; Julian/Gregorian coincidence in 2010.
4. [Hebcal HDate example](https://hebcal.github.io/api/hdate/index.html): 2008-11-13 = 15 Cheshvan 5769; [Hebcal converter](https://www.hebcal.com/converter?gd=3&gm=10&gy=2026&g2h=1): 2026-10-03 = 22 Tishrei 5787 in daytime civil conversion.
5. [Hong Kong Observatory 2026 table](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2026e.pdf): 2026-02-17 is first day of first Chinese lunar month, checked in Asia/Shanghai (UTC+8).
6. [Adhan Qibla tests](https://github.com/batoulapps/adhan-js/blob/a2c4bda71352f43355b23448c6329df150ca0ec3/test/qibla.test.ts): London 118.987°, New York 58.4817°, Sydney 277.4996°, tolerance 0.001°. Our bearing implementation is separate from the vendored Qibla function.
7. [Retained Ankara reference](https://github.com/batoulapps/adhan-js/blob/a2c4bda71352f43355b23448c6329df150ca0ec3/Shared/Times/Ankara-Turkey.json): Yeni Safak's independently originated Ankara 2019 timetable transcription for January 1 and June 1. Inputs: 39.939382°N, 32.819713°E, Europe/Istanbul, Turkey method, Shafi, middle-of-night. All six times are tested within the source's two-minute tolerance. The original dated news URL was no longer retrievable during this execution; this is retained-source validation, not fresh primary-timetable retrieval.

Additional behavioral tests cover invalid calendar dates, invalid zones, UTC year 0099, unsupported method detection, pole/antipode bearing singularities, polar summer unavailable prayer events, Isha adjustment, Asr convention, requested local dates in Kiritimati and Apia, and rejected Samoa skipped civil date 2011-12-30. These checks do not establish visual mobile quality; the lead's browser release workflow verifies responsive and keyboard journeys separately.

## Licensing, data, and maintenance

Calendar arithmetic reuses the existing project module. Native Intl adds no shipped third-party code or remote service. Prayer source is MIT-licensed Adhan with copyright/license retained in `assets/vendor/adhan/LICENSE`; no Swiss Ephemeris or Hebcal GPL package is bundled. Small factual reference values are cited; protected tables/artwork are not redistributed. No personal input, location coordinates, or calculation requests are transmitted by these calculator modules. Device geolocation uses the browser's permission-controlled location service only after the location button is pressed.

No recurring timer, motion listener, camera access, or worker is created by this page. Calculations run on explicit submit and initial example render. Location calls are one-shot with a ten-second timeout; page-hide callbacks do not update inactive output. Existing shared site chrome remains responsible for its own lifecycle and optional services.
