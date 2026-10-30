# Interactive sky, interpretation and calendar alignment

30 October 2026. Baseline `fb656a8047e93b8d49227d92aa9edc3e9b1fce50`, branch `feat/mobile-calendar-observatory`, draft PR #5. This pass extends the existing atlas; the preceding five-round atlas review remains separate history.

## User tasks and delivery boundary

1. Choose an instant and observer, inspect a deeper circular chart, select a body, and read the calculation and named-source interpretation together.
2. Switch between the zodiac chart, the retained Sun–Moon plate and a rotatable projection of actual heliocentric coordinates. Distinguish astronomical frames, display scaling and low-precision fixed-star markers.
3. Calculate a bounded past/future timeline, normally five years either side of its centre; select a sample or event and cast that actual instant. Computation, sampling resolution, cancellation and incomplete event coverage remain explicit.
4. Overlay supported angular conventions and compare the selected calendar labels. See same-instant agreement, different boundaries, unavailable methods and differing rules. Compare another time zone at the same UTC or deliberately at the same wall clock; a valid zone is not proof of geographic zone matching.
5. Read an attributed interpretation, inspect its inputs and source locator, and prepare a previewable AI question. A concise source-cited explanation is the output; private chain-of-thought is not a product feature.
6. Discover each registered tool's actual inputs, outputs and browser/MCP availability. Extend real read-only MCP calculations and supply a local retrieval reference pack. Supabase is optional infrastructure only if a configured project is available and it improves retrieval; neither a migration file nor a successful local test is a hosted deployment.

Keep all existing routes, calculations, public export boundaries, optional birth flows and saved-record formats. The static site remains usable without a provider account. External sends are explicit, source excerpts are untrusted data, and the model does not invent ephemerides or infer unknown birth details. Civil calendars do not acquire an unsupported auspiciousness score. Source interpretation is distinct from outcome validation.

## Six independent agent roles and ownership

| Role | Owner | Principal surface |
| --- | --- | --- |
| Astronomy and timeline | `sky_dynamics` | Pure sky snapshot, bounded timeline, worker, numerical tests |
| Historical interpretation and source research | `interpretation_sources` | Source-addressable readings, selected passages and reference chunks |
| Calendar alignment and boundaries | `calendar_alignment` | Overlay geometry, same-instant/wall-clock comparison, study-event interchange |
| Product design and interaction | `orbital_experience` | Atlas chart views, body inspector, timeline and comparison controls |
| AI, MCP and retrieval | `ai_tooling` | Tool coverage, prompt examples, allowlisted transport, local retrieval and optional database schema |
| Independent verification | `sky_quality` | Critical acceptance checks, actual browser journeys, exported-byte/source binding |

The root integrates shared navigation, registries generated from their sources, documentation, release gates and review-branch delivery. These are AI-agent perspectives, not human tradition authorities or observed participants. Owners send APIs before editing dependent surfaces. No more than two Chromium processes run at once.

## Review process and completion checks

Round 1 diagnoses the baseline and implements the first integrated instrument. Round 2 challenges the changed calculations, interpretations and workflows, then implements corrections. Round 3 reviews a corrected candidate and verifies acceptance. Further correction rounds reopen real unresolved findings rather than generating approvals for an unchanged artifact. Stop when all six roles accept their tested scope and all required gates pass, while retaining explicit unavailable/externally unconfigured scope.

Acceptance requires actual numerical and edge-case tests; selected-source reading with locators and rights; keyboard, narrow/wide layouts, reduced-motion, stale-state and cancellation journeys; real downloaded artifact inspection; existing atlas and site regressions; exact product/driver hashes; official MCP HTTP/stdio checks; generator freshness; and clean review-branch CI. Do not merge or claim production or hosted MCP deployment from a draft PR run.

## Initial decisions

- Preserve the engraving palette and make the interactive chart the primary work surface. The original plate remains an accessible view with its existing export contract.
- Reuse the vendored astronomy engine. Geocentric apparent-of-date coordinates, heliocentric J2000 vectors and approximate historical fixed-star longitudes are separate named data products.
- Calendar circles represent genuine angular partitions only. Civil dates remain aligned labels; agreement caused by shared Sun/Moon inputs is a dependency.
- Keep useful reading text close to the chart, with evidence and precision expandable. Record disagreements between a historical passage and an inherited implementation instead of silently repairing either.
- A capability guide covers registered tools honestly; remote invocation is limited to implemented validated handlers. RAG is retrieval, not fine-tuning.
