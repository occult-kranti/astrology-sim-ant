# HORARIUM — the per-hour, per-materia, per-location table

> **What it is.** One page that answers, live and for your location: *what hour
> is it in the Western and Vedic reckonings, what rules it in each, and what
> plant or material does each tradition put with that ruler?*
>
> Narrower than Horae Mundi (which compares seven systems). This is two
> traditions, deep, with the materia column Horae Mundi does not have. It is the
> piece that can ship first, and it is a component of the larger instrument
> rather than a competitor to it.

Ordered by [LOOP.md](../LOOP.md). Protocol: [RESEARCH-PROTOCOL.md](RESEARCH-PROTOCOL.md).

---

## 1 · The honest feasibility table

Written before any design, because two of five columns do not exist and a plan
that hides that would produce a page with invented cells.

| column | state | what it needs |
|---|---|---|
| location + live refresh | **BUILT** | `mountMomentPicker`, `hoursTable(date, lat, lon)` |
| Western hour + Chaldean ruler | **BUILT** | `planetary-hours.js` — `planetaryHour`, `hoursTable`, `dayRuler` |
| Western materia per ruler | **PARTIAL** | `planetary-magic.js` ships it — but see §4, it has a live defect |
| **Vedic horā** | **ABSENT** | its arithmetic is contested; v2 research is settling it. **Do not guess it.** |
| **Vedic materia per ruler** | **ABSENT** | nothing in the repo. `vedic-remedies.js` carries mantras, devatās, japa counts, āsana — no herb, tree or samidha data. Needs its own research round. |

**Consequence: this ships in three stages, not one.** Anything else means
inventing the two missing columns, which is exactly the failure the protocol
round was called to fix.

---

## 2 · The stages

### Stage 1 — Western, complete and live  *(no blockers; can start now)*

The table for a chosen location, refreshing as the hour turns:

- 24 unequal hours, sunrise→sunrise, from `hoursTable()`.
- Chaldean ruler per hour; hour 1 = the day's ruler (already asserted by the
  existing structural tests).
- The materia column from `planetary-magic.js`, **rendered from the typed
  fields, never flattened into prose** — see §3, this is a framing constraint
  and not a style preference.
- Location via the existing moment-picker; timezone named on screen.
- The current hour marked, and the row advancing without a reload.

### Stage 2 — Vedic horā  *(blocked on research v2)*

Adds the horā ruler column beside the Chaldean one. **The blocker is not code —
it is that the horā's division rule is a genuinely contested point.** The two
live readings are (a) 24 equal clock-hours from sunrise in Chaldean order, and
(b) unequal hours on the same seasonal division as the Western hour. These give
*different answers for the same moment*, so the page cannot pick one silently.

Ships only when the research names the convention with a snippet behind it, and
the page then states which convention it uses and offers the other as an option
if both are attested. If they turn out to be the same arithmetic, that
convergence is itself worth a callout — but only if a source says so.

### Stage 3 — Vedic materia  *(needs a research round)*

The plant/wood/material column on the Vedic side. Candidate territory, none of
it currently in the repo: the graha samidha (the nine woods of the navagraha
homa), nakṣatra-vanaspati (the tree per lunar mansion), and graha-specific herbs
in the remedial literature. **Each has a live practitioner tradition and a
citable textual layer, and they are not the same thing** — the round must keep
them apart rather than merge them into one "Vedic plants" column.

Runs under the hardened protocol: fetcher/compiler split, snippet-required,
gap-burden. It is a living tradition, so precision, not decoration.

---

## 3 · The constraint that shapes the materia column

`planetary-magic.js` is already built around **FRAMING §5 carve-out C-1, the
operable triple**: for any harm-flagged materia the site may carry at most TWO
of {substance · quantity · process parameter}. The three facts live in three
named, typed fields — `substance`, `quantity`, `processParam` — specifically so
that the third *has nowhere to live and there is no regex to defeat*.

**The page must render those fields, not a sentence.** A template that
interpolates them into prose re-creates the triple in free text and defeats the
whole design. `normalised: false` is a required literal: archaic measures are
never converted, because a converted number would be a fabricated number
carrying this site's authority on exactly the substances where a wrong number is
dangerous.

Where `harmFlag` is true the `harmNote` travels **in the same object** as the
material name — so it cannot be rendered without it.

---

## 4 · The defect this page must not ship

`planetary-magic.js` gives Saturn's suffumigation as **`'opium, etc.'`**, cited
to Picatrix III.7, with a harm note describing opium's alkaloids and route.

Two problems, both live:

1. **The citation is queued as suspect.** `docs/plans/accuracy/70-PATCHSET.md`
   already carries a Picatrix **III.3-vs-III.7 conflation** in this exact module.
   What III.7 actually lists for Saturn is unresolved.
2. **Agrippa I.xliv names black poppy *seed*, not opium** — and those are
   pharmacologically different: poppy seed is essentially opiate-free, opium is
   the dried latex of the unripe capsule. The Horae materials dossier found this
   correctly, then aimed it at the wrong target (it read the repo's
   Picatrix-cited value as if it were Agrippa's). **Both texts may legitimately
   say different things** — that is the keep-both rule, not an error to resolve.

**Resolve before Stage 1 ships**, because this row is the page's most prominent
harm-flagged cell. Agrippa's *Three Books* in the 1651 Freake translation is
public domain and directly checkable; the Picatrix side is licence-blocked and
may have to ship as "cite-only, unresolved" — which is an acceptable outcome and
a visible one.

---

## 5 · UI

Extends the existing nocturne tokens; no new design system.

```
HORARIUM            Mumbai  18.98°N 72.83°E   IST (UTC+5:30)   [change]

  now  ▸ hour 9 of 12 (day)      14:12–15:07      ← advances live

  #   span            Western          Vedic horā      materia (Western)
  ─────────────────────────────────────────────────────────────────────
  8   13:17–14:12     ☿ Mercury        ☿ Mercury       cloves, cumin, myrtle
▸ 9   14:12–15:07     ♀ Venus          ♀ Venus         aloes, mastic, roses
  10  15:07–16:02     ♄ Saturn         ♄ Saturn        ⚠ see harm note
  ─────────────────────────────────────────────────────────────────────
        night hours continue to sunrise

  ⚠ Saturn — the substance as the text names it. No quantity and no
    process parameter are carried. [harm note] [source: unresolved]
```

- Stage 1 ships **without** the Vedic column. It is not greyed out or filled
  with placeholders — it is absent, and a line says why and what would fill it.
- Mobile-first; WCAG AA; full keyboard; `prefers-reduced-motion` respected on the
  hour-advance transition.
- Deep-linkable via URL params; localStorage for the saved location.
- Zero external requests — Astronomy Engine is already vendored.

---

## 6 · Verification, before any UI

Per the standing gate:

1. `hoursTable()` already has structural tests (24 hours tile sunrise→sunrise;
   hour 1 = weekday ruler; unbroken Chaldean chain). Reuse them, do not restate.
2. **The live-refresh path needs its own test.** An hour boundary is a race:
   assert that the marked row changes when the clock crosses a boundary, driven
   by an injected instant rather than by waiting. `core/**` is pure and takes an
   explicit instant — the DOM layer owns the tick.
3. Materia rendering: assert that a harm-flagged row **cannot** render without
   its `harmNote`, and that `quantity` and `processParam` never both appear.
4. Chromium drive: the marked row advances, the location control round-trips,
   and the Vedic absence line is present. **Load-green is not done.**

---

## 7 · What this page must never do

It names what traditions burned and when. It does not tell anyone to burn
anything. No quantity beside a process parameter, no conversion of archaic
measures, no efficacy claim, and no medical claim — the harm-flagged rows are
records, and the page says so in its own voice rather than in a footer.
