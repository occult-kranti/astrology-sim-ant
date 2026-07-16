# The R28+ Roadmap — "The Deep Study Program"

**Plan-only round, synthesized 2026-07-16.** Eleven Fable research agents across two verified
workflows produced the eight plan documents in this folder (plus two adversarial verification
reports; 88 claims web-checked, 23 corrections applied in place before anything ships).
Execution model: **Opus codes phase N while Fable researches phase N+1** — each build round
below names both tracks. Every build round ends at the standing verify gate
(engine-test · audit · Chromium sweep · menu-drive · interaction drives).

The plan documents (the specs Opus builds from):

| doc | what it specs |
|---|---|
| [playlist-inventory.md](playlist-inventory.md) | the 132-video Vasishtha curriculum, 100% enumerated (live count now 133), teacher/school identified, every topic recovered from metadata |
| [playlist-curriculum.md](playlist-curriculum.md) | Vedic course page (9 sections) + 18-tool build list T1–T18, every rule re-grounded to BPHS/Phaladīpikā editions, do-NOT-build list |
| [chart-ux.md](chart-ux.md) | the three-layer output standard for all ~24 charts/reports, glossary popovers, narrate mode, 6 build phases (~20 coder-days) |
| [comparison.md](comparison.md) | pages/compare.html — ~30 products surveyed & cited, 11 qualifier-phrased novelty claims, mandatory "what they do better" column, staleness machinery |
| [buddhist-canon.md](buddhist-canon.md) | the Buddhist scriptures wing — CC0/PD licensing audit (verified), tiered word-by-word scope, refrain/peyyāla model, measured effort (~7× the Yoga Sūtras wing) |
| [practices-wing.md](practices-wing.md) | the Practices wing — 8 practice groups, ~60-mudrā catalog with SVG hand/body art, 8 complete-book modules, descriptive-voice lint |
| [atlas-ui.md](atlas-ui.md) | the Confluence atlas upgrade — 13 designs surveyed, 11 work packages, Histomap lanes rejected with argument, data-growth contract |
| [dynamic-hosting.md](dynamic-hosting.md) | the architecture ladder (PWA → tiny sync → SSR → full dynamic), stay-static decision memo with mechanical build-triggers, hosting/domain economics (July-2026 prices), learn×handcalc cast-along spec |
| [eastern-greats.md](eastern-greats.md) | 25 ranked Eastern figures in 5 clusters, exact PD verdicts per work, tier A–D treatment, ~26 atlas additions, the PD-flip calendar |
| [verification-report.md](verification-report.md) · [verification-dynamic-eastern.md](verification-dynamic-eastern.md) | the adversarial verification logs — read the BLOCKERS sections before building |

---

## R28 — Surface the hidden engine (build) ∥ rule-data research (Fable)

**Opus builds** (highest value, zero new research needed):
1. **Vedic tools, the surfacing tranche** (playlist-curriculum §4, T1–T8): the North/South-Indian
   chart renderer (the single biggest display gap — the engine computes everything, no figure exists),
   pañcadhā-maitrī friendship matrix + graha-dṛṣṭi grid (both computed-but-hidden inside
   `shadbala()` — refactor + surface, engine-test pins outputs first), graha-bala snapshot with the
   missing combustion flag, bhāveśa mapper, house-classification analyzer.
2. **Chart-UX phases 1–2** (chart-ux §4–§5): `app/glosstip.js` hover/tap popovers over the 247-term
   glossary, the `title=`-attribute sweep (~14 places), `app/explain-block.js` + the first
   "In plain words" layers (workbench, horary, nativity), the banned-phrase engine test.
3. **Atlas quick wins** (atlas-ui WP-2, WP-4 + spec completions): search-with-fly-to (core
   `filterEntries` already accepts `q` — toolbar input missing), ambient era pill, `.is-quiet`
   label policy actually applied.
4. **Stay-static now-items** (dynamic-hosting §6, §2a): Pagefind site search (MIT, pre-deploy
   index script classified with the existing gate scripts), the ~250-line versioned service
   worker (PWA — offline forever after one visit, consent-based update toast, kill-switch ready).

**Fable researches meanwhile**: the yoga-detector rule data (every yoga as data with variants +
BPHS/Phaladīpikā citations, accuracy-checked) · the ~216-record planet-in-bhāva delineation
data (Phaladīpikā Ch.8 backbone, Sārāvalī second witness, contradictions kept side-by-side) ·
the atlas edge epistemic-label pass (atlas-ui WP-3d, all 151 edges confirmed/cited).

## R29 — The Vedic course + the deep tools (build) ∥ Buddhist Tier-1 data (Fable)

**Opus builds**: `pages/vedic/course.html` (playlist-curriculum §3 — 9 sections, U1–U8 + sources,
the playlist used as teaching-order witness only, its gaps stated) · Vedic tools T9–T18 (the
data-driven yoga detector, vimśottarī daśā timeline UI, D40/D45 + vargottama + viṁśopaka varga
completion, aṣṭakavarga grid + transit overlay, avasthās, upagrahas, Jaimini chara kārakas
(7-vs-8 CONTESTED), ārūḍha padas, the delineation browser) · chart-UX phases 3–4 (the shared
period-strip SVG renderer for all five timing outputs; narrate mode) · ~28 new glossary terms.

**Fable researches meanwhile**: Buddhist Tier-1 encoding data — Metta (138 words), Heart Sūtra,
MN 118 glosses, every gloss PED-headword-pinned with the ≥15% adversarial sample
(buddhist-canon §6); the refrain/peyyāla model finalized on MN 118 first.

## R30 — The Buddhist wing phases A–B + the comparison page (build) ∥ Dhammapada + mudrā pinning (Fable)

**Opus builds**: `pages/buddhist/` wing infra + Metta + Heart + MN 118 word-by-word + the canon
map (Tier 3) with licence tags machine-checked by engine-test and the words[]-reconstructs-pali
invariant · `pages/compare.html` from the verified survey data (per-row citations + surveyed
dates, staleness badges, the superlative-grep acceptance test).

**Fable researches meanwhile**: Dhammapada per-vagga gloss tranches (26 vaggas, ~5,600 slots —
three tranches, never silently half-glossed) · the practices mudrā census pinned per record
(**blocker first**: resolve the Gheraṇḍa edition identity — scan b28140102 is the 1895 Bombay
edition, NOT the cited 1914–15 SBH printing; re-pin all verse numbering before any record ships).

## R31 — The Practices wing (build) ∥ Eastern E1 data (Fable)

**Opus builds**: the 8 practice groups (practices-wing §1), the ~60-mudrā catalog with
parameterized SVG hand/body figures (`app/practices-art.js`, extending the yoga wing's stroke-only
style), complete-book modules on the Great Works chapter pattern (HYP, Gheraṇḍa, Śiva Saṁhitā,
Way of a Pilgrim, Spiritual Exercises, Path of Purity II, Sefer Yetzirah, Mahānirvāṇa Tantra),
the descriptive-voice engine-test lint. Museum voice throughout; khecarī/vajrolī handled per the
plan's clauses; images default to cited CC0 links (local thumbnails = maintainer decision,
would be the repo's first binary assets).

**Fable researches meanwhile**: Eastern greats E1 — Varāhamihira (the flagship: two verified
US-PD Bṛhajjātaka translations), Yogananda 1946 first edition (PD verified via SRF v. Ananda,
quote-safe FIRST edition only), Vivekananda pre-1929 volumes; chapter maps + quote selects,
accuracy-checked.

## R32 — The Eastern Greats E1–E2 + atlas beauty (build) ∥ E3 + stories data (Fable)

**Opus builds**: `core/data/greatworks-east.js` (same schema; practitioners.js Library records
upgraded in place, never duplicated) — E1 Jyotiṣa masters + E2 Yoga & Vedānta · ~26 new
Confluence entries + cited edges (Buddhaghosa, Varāhamihira, Milarepa, Vivekananda, Yogananda,
the Kūkai↔Xiuyao-jing East-Asian-astrology edge, the SRF-v-Ananda ruling as an event) ·
atlas WP-1 minimap density strip, WP-3 edge-legibility program (braiding, ×0.6 labeled corridor
ribbons, edge epistemic labels from the R28 data pass), WP-5 density washes, WP-6 semantic-zoom
clustering, WP-7 rich hover cards.

**Fable researches meanwhile**: E3 Buddhist-shelf data · the four guided-tour stories' prose
(every claim accuracy-checked, schema forbids uncited facts) · remaining Dhammapada tranches.

## R33 — Completion: canon, greats, stories, poster (build)

Dhammapada complete + Tier-2 texts (SN 56.11, Diamond, Platform Sutra — Wong 1930 PD verified,
Visuddhimagga excerpts from Path of Purity I–II) · Eastern E3–E4 (Buddhist shelf; China +
flip-watch) · atlas WP-8 guided tours + WP-9 SVG poster export + WP-10 polish punch list ·
the pdCalendar export wired so date-gated quotes unlock mechanically.

## Standing tracks & decision points (the user's calls, not defaults)

- **PD-flip calendar**: 2027-01-01 unlocks Path of Purity vol III + Baynes's Golden Flower (1931);
  2028 unlocks Gradual Sayings; further flips through 2036 listed in eastern-greats §1. Nothing
  quotes early — engine-tested licence tags enforce it.
- **Hosting** (dynamic-hosting §8): the argued verdict is **stay static**; adopt PWA + Pagefind
  now (R28), move GitHub Pages → Cloudflare Pages opportunistically, buy the domain via
  Cloudflare Registrar (~$10.44/yr) when wanted. The tiny sync backend (Hono + D1 + passkeys +
  E2E blobs, ~$0–8/mo) is fully pre-designed but **trigger-gated**: build only on ≥3 unsolicited
  sync requests, a real study group via the giscus canary, or repeated localStorage loss.
  SSR and full-dynamic are rejected with argument. Swiss Ephemeris stays out (AGPL/CHF 700;
  astronomy-engine's MIT ~1′ is the right fit). BYOK AI stays browser-direct — readings contain
  birth data and must never transit an operator.
- **Yearly re-survey** of compare.html rows (staleness badges go amber at 12 months).
- **Blockers ledger** (from the verification reports — read before building): the Gheraṇḍa
  edition mismatch; "132 enumerated, playlist has since grown" phrasing; the four UNVERIFIED
  eastern facts stay flagged (Rao 1st ed., Sastri death year, Phaladīpikā 1937, PAAAS renewals);
  HathiTrust 006938775 needs a by-hand open; SRF-opinion quotes cite FindLaw pagination;
  Hetzner prices verified at order time; Sujato edition front matter captured at build.
