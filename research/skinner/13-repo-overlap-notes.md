# 13 — Repo overlap map for the Skinner page (companion notes)

Slice discipline: **repo-internal only**. Nothing here was researched externally; every claim
cites a file:line in `c:/Users/mehta/OneDrive/Documents/github/2026/astrology-sim-ant`.

## The one-screen table

| # | What Skinner touches | Where the repo already covers it | Link target | Verdict |
|---|---|---|---|---|
| R1 | Skinner himself (geomancy card) | practitioners.js:1762–1778 | pages/library/esoteric.html#x-stephen-skinner | **LINK-TO** (+1-line see-also EXTEND on the card) |
| R2 | Geomancy, the art | pages/geomancy.html; core/geomancy.js:197 | pages/geomancy.html | **LINK-TO** |
| R3 | Ars Notoria (Skinner & Clark 2019) | opgraph.js:1010; slice 12:205 | pages/opgraph.html → gw:ars-notoria | **LINK-TO** |
| R4 | Hygromanteia ancestry thesis | opgraph.js:1020; slice 12:84–91 | pages/opgraph.html → gw:hygromanteia | **LINK-TO** (contest stays unresolved) |
| R5 | Sepher Raziel (Karr & Skinner, Sourceworks 6) | slice 12:345 only — NOT shipped | none | **NEW** |
| R6 | Fourth Book 1978 facsimile dissent | greatworks.js:622 | pages/greatworks/agrippa.html#gw-w-fourth-book | **LINK-TO** |
| R7 | Dee diaries editions | greatworks.js:481–495; opgraph.js:1013–1014 | pages/greatworks/dee.html#gw-w-dee-true-faithful | **EXTEND** (conditional on sibling-slice verification) |
| R8 | Goetia / Dr Rudd | esoteric-libraries.md:456 (T12); opgraph.js:1009 | pages/opgraph.html → gw:ars-goetia | **LINK-TO** ruling; EXTEND deferred to T12 |
| R9 | Key of Solomon editions | opgraph.js:1021 | pages/opgraph.html → gw:key-of-solomon | **EXTEND** (conditional) |
| R10 | Splendor Solis 2019 study edition | practitioners.js:2207–2209 | pages/library/esoteric.html#x-the-alchemical-classics + confluence.html#splendor-solis | **LINK-TO** |
| R11 | Picatrix context | pages/picatrix/**; opgraph.js:1024 | pages/picatrix/index.html | **LINK-TO** (context only) |
| R12 | 'Grimoire' definition + chronology | glossary.js:200; chronology.js:178–183 | pages/glossary.html; pages/chronology/index.html | **LINK-TO** |
| R13 | Feng shui / 'geomancy' homonym | research/rank/32-discourse-snapshot-notes.md:154–156 | none shipped | **NEW** (Skinner page carries it) |
| R14 | Crowley diaries editing | greatworks.js:309–440 (no diaries record) | pages/greatworks/crowley.html#gw-a-crowley | **NEW** |
| R15 | PGM technique surveys | opgraph.js:1000–1003 (gem:pgm-*) | pages/opgraph.html → gem:pgm-* | **LINK-TO** (do not EXTEND — sourceTier bar) |

Checked and clean (no overlap, no row): pages/compare.html + competitors.js; confluence.js
(0 Skinner hits in 200 atlas entries); tarot/iching/runes pages; FRAMING.md; gate.json.

## The five places the repo ALREADY names Skinner

Repo-wide grep for `Skinner` hits exactly five files:

1. `assets/js/core/data/practitioners.js` — his geomancy card (1762–1778) and the Splendor
   Solis study edition (2207).
2. `assets/js/core/data/greatworks.js` — the Fourth Book flag (622): his 1978 facsimile
   introduction *dissents* from the spurious verdict; reported as a position, unadjudicated.
3. `assets/js/core/data/opgraph.js` — Ars Notoria editions (1010: "Skinner & Clark 2019")
   and the Hygromanteia contested block (1020: "Marathakis (2011) and Skinner, Sourceworks
   series").
4. `research/opgraph/slices/12-solomonic-western.json` — 87 (Hygromanteia position holder),
   205 (Ars Notoria bestEdition), 345 (Sepher Raziel bestEdition: "Don Karr & Stephen
   Skinner … Sourceworks of Ceremonial Magic 6" — research layer only, not shipped).
5. `docs/plans/r29/esoteric-libraries.md` — T12 (456): "Skinner/Rankine **cite-only**" for
   the Rudd 72-quinance material; "flag, don't resolve".

Every one of these already conforms to the living-person discipline: named positions, cite-only
editions, verified fields. The Skinner page's job is to *link* these, not restate them.

## What the Skinner page must NOT re-explain

- **Geomancy mechanics** — figures, shield algebra, houses: pages/geomancy.html owns it, with
  its own (pre-Skinner) citations. Skinner's history-of-the-art credit is already on his card.
- **Solomonic textual histories** — KOS recensions, Lemegeton stemma, Ars Notoria's
  Turner-omits-the-notae problem, the Hygromanteia ancestry contest: the operative graph
  carries all of it, and carries the contests *unresolved*. Re-telling any of it risks
  accidentally resolving what the graph refuses to resolve (E-CONTESTED-01).
- **Fourth Book authorship** — greatworks.js:622 is the site's worked example of provenance
  flagging; the Skinner page links it as "the site already reports his dissent".
- **Grimoire definition/chronology** — glossary + chronology (cited to Davies).
- **Picatrix content** — the wing; and the operative razor forbids tables anyway.
- **Dee's diaries anatomy** — the record/compiled-manual split with Sloane shelfmarks is done
  twice over (greatworks + opgraph split nodes).
- **Splendor Solis / alchemy background** — library card + chronology/alchemy.

## Linking mechanics (read before writing hrefs)

- Library cards: `#x-<slug(name)>` (library.js:94) → `#x-stephen-skinner`,
  `#x-the-alchemical-classics`; practice headers `#p-geomancy`, `#p-alchemy` (library.js:144).
- Greatworks: `#gw-w-<workId>` / `#gw-a-<authorId>` (app/greatworks.js:139,165).
- **opgraph.html's hash is a FILTER string** (app/opgraph.js:273–303) — `#ogn-<id>` anchors
  exist only post-render. Link the page and name the record; do not promise scroll-to.
- Confluence atlas: `confluence.html#<slug>`; live relevant slugs: `picatrix`,
  `event-picatrix-translation`, `splendor-solis`, `event-dee-angelic-conversations`,
  `de-occulta-philosophia`.

## Incidental defect found (report upstream, do not fix in this slice)

The Solomonic `atlasSlug` values in opgraph.js **dangle**: `key-of-solomon`, `lemegeton`,
`liber-juratus`, `abramelin`, `arbatel`, `heptameron-print`, `scot-discoverie`,
`steganographia`, `weyer-pseudomonarchia`, `sefer-ha-razim` have no entry among
confluence.js's 200 slugs, and `gw:agrippa-three-books` says `agrippa-occulta-philosophia`
where the atlas slug is `de-occulta-philosophia`. The opgraph drawer renders
`confluence.html#<slug>` links for all of these (app/opgraph.js:688) that scroll nowhere.
Consequence for the Skinner page: never copy an `atlasSlug` as a link target without checking
it against confluence.js first.

## Conditional-EXTEND rule (R7, R9)

This slice records that **no Skinner/Rankine edition of the Dee material or the Key of
Solomon exists anywhere in the repo**. Whether such editions exist in the world is a question
for the externally-researching sibling slices; only if they verify one from publisher or
library records should the opgraph editions cites gain a cite-only line. This map asserts no
external bibliography.
