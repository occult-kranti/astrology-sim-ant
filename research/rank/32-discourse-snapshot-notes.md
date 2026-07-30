# The contemporary discourse snapshot — notes

**Slice:** the "online discussed" axis.
**Captured:** 2026-07-30. **Pageview window:** 2025-07-01 → 2026-06-30 (12 months).
**Deliverable:** `32-discourse-snapshot.json` (34 families). Capture scripts and raw TSVs ship beside it.

---

## 0 · The one sentence that governs this file

**This is a reception metric. It measures the internet, not the material.**

Nothing in this dataset ranks, scores or implies how well anything works. There is no efficacy axis here and no
field of it can be rendered as one. Every system surveyed has no demonstrated predictive or operative validity
(FRAMING.md §1.1), and a family's position on this axis leaves that untouched in both directions — a marginal
number is not a debunking and a mass number is not a credential.

The honest framing for the page: *"how much the anglophone internet currently talks about this, measured on a
stated date by a stated method, and nothing else."*

---

## 1 · The ranking hazard, stated first because it is the finding

> Discourse volume tracks **accessibility, recency and English-language popularity** — not importance.

The brief supplied the worked example. It survived contact with the data, and it is stronger than expected:

| | Entry points | 12-month en-wiki pageviews |
|---|---|---|
| **Lemegeton / Goetia** | Lesser Key of Solomon + Ars Goetia + Goetia | **347,142** |
| **Śāradātilaka** | — | **no English Wikipedia article exists** |
| **Mantra Mahodadhi** | — | **no English Wikipedia article exists** |

Verified 2026-07-30 via `action=query&titles=Sharadatilaka|Mantra%20Mahodadhi` — both return `missing`, not a
redirect, not a stub. **The ratio is not large. It is undefined, because the denominator is zero.**

The Lemegeton is late, short, in Latin and English, out of copyright since Mathers, and absorbed into games and
metal albums. The Śāradātilaka is a foundational Sanskrit tantric ritual compendium with no public-domain
English translation. What the numbers above measure is the difference between those two sentences. They measure
nothing about either text.

### Five further distortions, all measured rather than asserted

1. **Celebrity over doctrine.** Aleister Crowley 1,513,619 · Thelema 510,195 · *The Book of the Law* 110,062.
   The man outdraws his own scripture **13.8 : 1**.
2. **Author over work.** Manly P. Hall 136,597 · *The Secret Teachings of All Ages* 5,991 — **22.8 : 1**, and
   the wrong way round for a man known for one book. Same shape, smaller, for Agrippa (1.8 : 1) and Dee (2.7 : 1).
3. **Practice over originator.** Sigil discourse 217,312 · Austin Osman Spare 78,399 — **2.8 : 1**.
4. **Popular parent over technical corpus.** Ayurveda 459,412 · rasaśāstra 873 — **526 : 1**.
5. **Language of origin.** Western "Alchemy" 656,769 · the *Cantong qi*, the foundational text of Chinese
   alchemy, 5,068 — **130 : 1**. Same subject, different source language. This is the cleanest measurable form
   of the hazard in the whole set.

### And the control row

`manifestation-loa` is in the dataset **with `siteWings: []`** — the site has no wing for it. It is there as a
control. Manifestation / Law of Attraction draws **941,736** combined annual lookups and **621k** combined
subreddit members, on a body of material with **no historical corpus at all** (its oldest layer is 19th-century
New Thought). It outranks the Picatrix, Agrippa's *Three Books*, the Lemegeton, the *Cantong qi* and the entire
Sanskrit ritual literature **combined** (166,839 — and three of those contribute zero because they have no
article).

If a reader is ever tempted to read this axis as importance, that row is the answer, and it should stay in the
data for exactly that reason.

---

## 2 · Method, and why it is split in two

Two components, deliberately **never combined into one score**.

### Component A — Wikipedia pageviews *(the only part that should carry weight)*

```
https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/
  {ARTICLE}/monthly/2025070100/2026063000
```

`agent=user` — **spiders and bots excluded by the API's own filter**. Exact, integer, and fully reproducible:
anyone can paste the URL stored in the record and get the same number for the same window. Script: `wiki-pv.sh`.
Raw: `wiki-pv.tsv`, `wiki-pv2.tsv` (93 articles queried).

A verification pass re-read every one of the 34 families' figures back out of the JSON and diffed them against
the raw TSVs: **all figures match the raw capture**, and **every tier follows the published threshold rule
mechanically** with no hand-placed exceptions.

### Component B — subreddit membership *(an estimate, and labelled one)*

Reddit's `/r/{sub}/about.json` is **closed to unauthenticated clients** — both `www.reddit.com` and
`old.reddit.com` were tested on 2026-07-30 and return the SPA shell with no subscriber figure anywhere in the
markup. There is no first-party route without an API key and this survey did not use one.

So counts come from **gummysearch.com**, a third-party tracker (page stamp: "Last updated: July 30, 2026").
Two consequences recorded in-data:

- **It rounds.** "422k" is two or three significant figures. Precision is ±1k at best.
- **Its coverage is incomplete.** On 2026-07-30 it returned no page for r/Kabbalah, r/Golden_Dawn, r/Jyotish,
  r/Enochian, r/neidan, r/horary, r/sigils or r/Demonology — **all of which exist on Reddit**. These are stored
  `verified: false`, never `0`, never absent. *A gap in a tracker is not a fact about a community.*

**Why the two are not merged into one number:** folding an incompletely-covered estimate into a derived tier
would convert a coverage gap into an apparent fact. Tier is therefore computed from Component A alone, by a
published threshold rule, and the Reddit figure sits beside it uncombined.

### Component C — popular presence *(illustrative only; must not be sorted on)*

Named, sourced examples only. This is the weakest field in the file and says so in the file: *which* book or
channel counts as representative is a compiler's selection, not a measurement, and the search was not exhaustive.

**A caught error worth recording:** YouTube channel pages embed the subscriber counts of *recommended* channels
alongside their own. A first pass took the first match and produced obvious nonsense ("Doug's Dharma — 416
subscribers", "Alan Watts — 000"). Re-extracting all matches showed 7–13 candidate figures per page. **Every
ambiguous number was discarded rather than guessed**; only three unambiguous single-value captures survive
(KRSchannel 622K, The Astrology Podcast 269K, Sadhguru 6.41M).

---

## 3 · The `anchor` / `corpusAnchor` split — the schema decision that matters

Two families broke a single-number design outright, and rather than pick a side the record carries both:

| Family | `anchor` (the popular topic) | `corpusAnchor` (the text the site treats) |
|---|---|---|
| Tantric ritual manuals | Tantra — **364,228** → *mass* | Śāradātilaka — **no article** → *absent* |
| Atharvaveda & abhicāra | Atharvaveda — **119,423** → *broad* | abhicāra — **no article** → *absent* |

A single figure would be a lie in either direction: 364,228 credits the Śāradātilaka with a mass audience it
does not have; 0 hides that the surrounding subject is enormous. **Both render; collapsing them is forbidden in
the rendering rules.** The `reception-not-text` flag carries the reason — English-language "Tantra" denotes a
modern sexuality genre with essentially no relationship to the Sanskrit ritual corpus, and r/Tantra (34k) is
substantially a neotantra community.

This is the same move the brief asked for on chaos-magic sigils vs Spare, Goetia-as-pop-culture, and
"manifestation" vs any historical corpus. All four are flagged `reception-not-text` and all four have the
measurement to back the flag.

---

## 4 · Anchor selection is load-bearing, and every choice is disputable in-record

The biggest single correction in the survey:

- **"Runes" = 422,589** — but the en-wiki article is about *the Germanic writing system* (verified 2026-07-30:
  *"Runes are the letters in a set of related alphabets…"*). Anchoring there would put runic divination in the
  **mass** tier on the strength of people looking up an alphabet.
- **"Runic magic" = 44,724** is the right anchor. The correction costs the family **377,865 views and a whole
  tier**, and it is recorded with its reason so a reviewer can overrule it.

Other scope checks made and recorded:

- **"Solomon's Key" (19,025) excluded** — it is a 1986 Tecmo video game, not the *Clavicula*. Would have
  inflated that family by 11%.
- **"Geomancy" (100,392) flagged `homonym-diluted`** — the article's scope is earth-divination broadly and
  explicitly includes feng shui; the Arabic–Latin sixteen-figure art the site computes is a subsection. The 2k
  subreddit is probably the truer signal.
- **"Golden Dawn" checked and clean** — the Greek far-right party is a separate article and does not contaminate
  the 385,445.
- **"Sigil (magic)" is a redirect to "Sigil"** — verified, so the two are *not* summed. Easy double-count avoided.

---

## 5 · A finding the site should probably say out loud

**Encyclopedic interest and community are different quantities, and this dataset separates them.**

| Family | Annual lookups | Community | Ratio |
|---|---|---|---|
| I Ching | 478,080 | ~10k | **48 : 1** |
| Vajrayāna | 279,878 | ~13k | **21 : 1** |
| Alchemy | 656,769 | ~54k | **12 : 1** |
| Tarot | 833,581 | ~621k | **1.3 : 1** |
| Modern astrology | 442,094 | ~2.1M | **0.2 : 1** |

Canonical status produces *readers*; a live consumer practice produces *forums*. Astrology and tarot are the
only families where the community outweighs the encyclopedia — that inversion is what a live trend looks like,
and it is why the JSON keeps `trend` separate from `tier`.

Two more worth a line on the page:

- **r/Meditation (3.6M) is the largest community in the survey**, sitting against *Ānāpānasati* at 36,326 —
  roughly 100 community members per annual lookup of the sutta the practice descends from.
- **r/yoga (3.4M) is the second largest**, and is almost entirely about modern postural practice. Attributing it
  to the *Yoga Sūtras* would be the worst misreading available in this dataset, so the record says so in-place.

---

## 6 · Where the site's own material lands — stated because it is uncomfortable

- **Horary astrology — 17,220.** The system this site is built on runs at about **1/26th** of the traffic of
  "Astrology". A specialist interest.
- **Khecarī mudrā — 351/year**, under one lookup a day. The practice the site handles with its most careful harm
  apparatus (FRAMING.md §C-2, the ratified worked example) is among the least-discussed things in the survey.
- **Rasaśāstra — 873/year**, and it carries the site's heaviest documented-harm apparatus (§C-1).
- **The Book of Abramelin — 546/year.** A major Mathers translation of real weight inside the tradition, very
  nearly invisible on this axis.

**The ordering above is a coincidence of accessibility, not a safety finding.** Low discourse volume is not
safety and high volume is not risk; the harm apparatus is a separate axis with a separate evidence base and the
two must not be read against each other. Worth pinning, because the inverse correlation is visible in the data
and a reader will notice it.

---

## 7 · Honest gaps — what was attempted and not obtained

- **Discord**: no sizes captured at all. Discord publishes member counts only for Discovery-enabled servers and
  there is no general index. Sampling an unrepresentative handful would have been worse than nothing.
- **Podcast downloads**: none obtained. Podscan / Rephonic / Listen Notes all gate their figures. The single
  podcast metric in the file is a *YouTube subscriber count*, which is a different quantity, and is labelled as
  such.
- **Google Trends**: deliberately not used — it returns relative indices, not counts, and is not stable enough
  across captures to ship as static data.
- **Long-running forums** (Skyscript, Lily-Beth, Solomonic, Dharma Wheel): not captured. No consistent public
  member-count surface across them; a per-forum manual read would not have been comparable.
- **Non-English anything.** The systematic effect is to understate jyotiṣa, Daoist alchemy, rasaśāstra and the
  tantric corpus most of all. **No correction factor was applied because there is no honest one.**

---

## 8 · Shipping shape — matches `pages/compare.html`

The site is offline-first, so this ships as dated static data, following the pattern already in
`assets/js/core/data/competitors.js` + `pages/compare.html`:

- **`SURVEY_STAMP = '2026-07'`** page-level, rendered via `data-survey-stamp`, plus a per-record `capturedAt` —
  exactly compare.html's two-level stamp.
- **The staleness badge is computed in the app layer, never in the data module** — amber ≥12 months, red ≥24 —
  precisely as `competitors.js` delegates that to `app/compare.js` and keeps itself pure and deterministic.
- **`verified: false` renders as compare.html's `?` glyph** — never `0`, never a blank, never an em dash that
  reads as "none". This is compare.html's own rule ("where a fact could not be confirmed from a public page it is
  shown as **?**, never guessed") carried across unchanged.
- **`absent: true` renders as a positive statement** — "No English Wikipedia article". Per the brief, absence is
  a first-class value and never an empty cell.
- **A flagged number never renders bare** — the `flags` text renders beside it.
- **`popularPresence` is never sortable** and carries its illustrative-only caveat.
- **The axis label is "Online discussed"**, adjacent to a one-line restatement of the ranking hazard, and must
  never use a word implying quality, standing or importance.

A `resurveyChecklist` is in the JSON, modelled on competitors.js's own re-survey block — including the
instruction that **if an English article ever appears for the Śāradātilaka or abhicāra, the headline worked
example must be rewritten, not quietly repointed.**

---

## 9 · Files

| File | What |
|---|---|
| `32-discourse-snapshot.json` | The dataset — 34 families, method, hazard, tier rule, rendering rules, limits, re-survey checklist |
| `32-discourse-snapshot-notes.md` | This file |
| `wiki-pv.sh` | Pageview capture script (reproducible) |
| `gs.sh` | Subreddit capture script (reproducible) |
| `wiki-pv.tsv`, `wiki-pv2.tsv` | Raw pageview captures, 93 articles queried (2 returned "no article") |
| `gs.tsv`, `gs2.tsv` | Raw subreddit captures, 53 attempts |
| `arts.txt`, `arts2.txt`, `subs.txt`, `subs2.txt` | Input lists |

---

## 10 · The two things a reviewer should push back on

1. **Anchor selection.** It decides tiers. The runic case moves a full tier on one judgement call. Every choice
   is recorded with its reason precisely so it can be overruled — but they *are* judgements, and calling them
   measurement would be dishonest.
2. **Component C is decorative and should possibly be cut.** Named bestsellers and channels are real facts, but
   which ones "represent" a family is not measured. It is fenced with a must-not-sort rule and an
   illustrative-only label; if a reviewer would rather drop it than fence it, that is a defensible call and the
   dataset loses nothing quantitative.
