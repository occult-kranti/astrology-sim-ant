# Chart relationships — implementation plan

Baseline: `bf27046dd646ac1f7cc25db8770e8dd00ecbb0de`; branch `feat/chart-relationships`. The user requests clearer chart colors and paired/aligned/opposed highlighting, source/calendar-specific explanations, optimization and stress verification.

## Product direction

Keep the engraved circle, warm paper and readable serif hierarchy. Make relationships operable: selecting or focusing a listed pair emphasizes both endpoints and its connector; an inline inspector names the method, separation, allowed margin and source. Color is reinforced by names, glyphs and line patterns. Geometric opposition does not automatically supply an unfavorable traditional verdict.

Use one stable calendar-ring identity palette across SVG, controls and comparison rows. Preserve exact equal/different/unavailable output classifications under the existing clock comparison. Civil calendars retain date labels and boundaries, rather than invented zodiac positions.

## Work and ownership

| Owner | Surface | Acceptance |
| --- | --- | --- |
| Domain role | Pure relationship presentation model over held canonical outputs | Explicit geometry/Lilly/reception/directional Vedic conventions, source/precision limits, no new ephemeris or stored private data |
| UX role | Shared inline inspector, filters and semantic palette | Keyboard/touch controls, stable pin/preview behavior, 44px important controls, readable narrow/zoomed layout |
| Atlas role | Deep chart, family routes, orbital-mode distinction and calendar overlays | Selected pair coordinates unchanged; stable ring colors; actual rendered ring IDs distinguished from selected IDs; no geocentric edges in heliocentric space |
| Page role | Shared timeline plate and Newton/eschatology integrations; country scope | Same held frame and stale/cancel states; sidereal coordinates applied once; cusp-only country view retains its actual scope |
| QA role | Independent numerical, component, page and bounded stress checks | Orb/angle boundaries, stable IDs, direction, focus, actual exports, unchanged geometry and bounded presentation work |
| Independent review role | Source/frame/performance challenge | Evidence-based findings and exact corrected-artifact checks |
| Root | Integration, design decisions, docs, required gates and publication | Frozen candidate, all inherited gates, actual CI/deployed-source/live verification |

These are AI-agent review roles, not human research participants or professional endorsements.

## Three review loops

1. Inspect the published artifact and current source; choose the shared contract and implement the working chart interaction.
2. Challenge the integrated artifact with independent source/state/layout reviews; fix demonstrated defects.
3. Freeze the corrected candidate, run required tests and inspect actual screenshots/downloads; publish only the checked candidate and confirm the live source identity.

## Invariants and verification bounds

Existing numerical engines, canonical exports, private-birth boundaries, date bookmarks, explicit observer/time-zone context and source qualifications remain authoritative. Hover/focus must update presentation without casting, starting workers, storing data or transmitting context. No traditional rules are invented for unsupported bodies, stars or calendars. Directed Vedic contacts and receptions are distinct relationship types.

Test the five geometric angles at exact/inside/boundary/outside allowances, 0°/360° wrap, reversed pairs, whole-turn rotations, coincident positions and nonfinite inputs. Use a bounded set of actual casts across the supported range, with calendar clock/date-line/fold/gap cases. Exercise approximately 200 presentation transitions and record timing without hardware-dependent performance promises. Preserve all existing suites; add focused coverage rather than another full ephemeris scan.

The verification target is meaningful bounded coverage, not an exhaustive proof of every possible input, a screen-reader certification, or predictive validity. Keep at most two actual Chromium processes active.
