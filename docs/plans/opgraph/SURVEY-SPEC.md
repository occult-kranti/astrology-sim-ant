# SURVEY-SPEC — the quoted-primary-text survey wing, implementation spec

**Governing document:** [`docs/FRAMING.md`](../../FRAMING.md). Every clause number below (§2.4, §4.5, C-2,
A-3, …) refers to it. Where this spec and FRAMING.md disagree, FRAMING.md governs and this spec is the bug.

**Scope.** The data schema, the DOM contract, the generation-time gate, the aggregation guard, the assistant
changes and the complete engine-test assertion list for the new wing at `pages/quoted/`. No prose or design
decisions live here; they live in FRAMING.md.

**Shipping precondition.** Nothing in this spec ships until the four blockers in FRAMING.md §10 land in the
same commit as the first quotation: `talismanRecipe()` re-voiced (B1), the refusal-coaching string removed
(B2), C-2 narrowed and the mudrās note corrected (B3), §2.4 accepted as written (B4).

**Design principle, applied everywhere below.** *Make the field structure carry the rule, so there is nothing
to defeat.* A record that must not hold a payload is given nowhere to put it. Regex tripwires exist only as
anti-vacuity backstops on text the schema already permits, never as the primary gate.

---

## 1. The QUOTED-TEXT RECORD

### 1.1 Where it lives

| Path | Contents |
|---|---|
| `assets/js/core/quoted.js` | **NEW, pure, no DOM.** The contract: enums, predicates, caps, screens, `quoteFaults()`, `rowFaults()`, `IMPERATIVE_OPENERS`, `PD_VERDICTS`, `QUOTE_CLASS`, `QUOTE_ATTRS`, `countWords`, `countCodepoints`, `detectScript`. Imported by the data modules, the renderer **and** the test, so they cannot disagree. |
| `assets/js/core/data/quoted/<corpus>.js` | One module per corpus (`pgm.js`, `solomonic.js`, `tantric.js`, `hatha.js`, `rasa.js`, `waidan.js`). Each record is produced by `defineQuoted()` (§3). |
| `assets/js/core/data/quoted/works.js` | The work registry: `workSlug → { title, corpus, edition, workExtent, locusScheme }`. |
| `assets/js/core/data/quoted/parallels.js` | The parallel edges, each with a mandatory `claimedBy`. |
| `assets/js/app/quoted.js` | The renderer. Emits **only** `figure.quoted-primary`; refuses non-reproducible records structurally. |
| `assets/css/quoted.css` | `.quoted-primary`, `.qp-harm`, `.qp-attrib`, `.qp-pd`, print rules. |
| `scripts/tests/r33-quoted-texts.mjs` | The gate. Every assertion in §6. |
| `docs/quoted-refusals.md` | The append-only refusal log (§3.4). |

### 1.2 The record

The thirteen named fields below are **normative**. A record missing any of them, or carrying an
undocumented extra top-level key, does not build.

```js
{
  // ── identity ──────────────────────────────────────────────────────────────
  id: 'pgm-iv-1928',              // stable slug, unique wing-wide
  workSlug: 'pgm-iv',             // FK into works.js — the "work" for the per-work cap (§4.5 cap 4)
  corpus: 'pgm',                  // text-family; the ONLY act-adjacent facet permitted is NOT this one —
                                  // corpus IS a permitted facet (§5 A-1)

  // ── the passage itself ────────────────────────────────────────────────────
  text: 'ἐπικαλοῦμαί σε …',       // THE VERBATIM PASSAGE. Never linted for voice. Never indexed. Never
                                  // sent to the assistant. Absent entirely when reproduction is refused.
  language: 'grc',                // ISO 639-3 of `text`. Declared, not inferred.
  script: 'Grek',                 // ISO 15924 of `text`. SELECTS THE CODEPOINT CAP. Asserted to equal
                                  // detectScript(text) — an author mistypes `lang`, and no test catches it,
                                  // so the declared value is checked against the dominant Unicode block.

  translation: {                  // a SEPARATELY LICENSED WORK. null when none is reproduced.
    text: '…', language: 'en', script: 'Latn',
    translator: 'Preisendanz', year: 1928,
    pdBasis: { /* its own, independent of the original's */ },
  } | null,

  // ── who made this text ────────────────────────────────────────────────────
  edition: {                      // the EDITION ACTUALLY QUOTED, not "a" translation
    label: 'Preisendanz, Papyri Graecae Magicae I (Teubner, 1928)',
    publisher: 'Teubner',
    volume: 'I',
    url: 'https://archive.org/details/…',   // where a reader goes for the complete text (§4.4)
  },
  translator: null,               // string | null — null when `text` is the original language
  year: 1928,                     // integer, the year of `edition`. Drives the PD arithmetic.

  // ── may we reproduce it ───────────────────────────────────────────────────
  pdBasis: {
    verdict: 'pd-us',             // 'pd-us' | 'cc0' | 'cc-by' | 'cite-only'   (PD_VERDICTS + CITE_ONLY)
    ground:  'US public domain: published 1928; 95-year term expired 1 Jan 2024.',
    sources: [{ label: 'Duke CSPD, Public Domain Day 2026', url: 'https://…' }],  // ≥1, all https:
    jurisdiction: 'US',           // literal 'US'. The site issues no other verdict (§4.2).
  },

  // ── where it sits ─────────────────────────────────────────────────────────
  locus: {
    label: 'PGM IV.1928–2005',    // citation-grade display string
    book: 'IV',
    from: 1928, to: 2005,         // integers where the edition numbers numerically
    parsable: true,               // false ⇒ this work is capped at 3 records (§4.5 cap 5)
  },

  // ── what kind of thing it is ──────────────────────────────────────────────
  procedureType: 'consecration',  // enum, §1.3. USED BY THE GATE TO SELECT SCREENS.
                                  // NEVER a UI facet, never rendered as a filter (§5 A-1).

  carveOutStatus: {
    carveOut: 'toxic',            // 'none' | 'toxic' | 'mutilation' | 'hypoxia' | 'hostile-target'
                                  //        | 'self-injury-method' | 'branded-regimen'
    disposition: 'quoted-with-harm-note',
                                  // 'quoted-with-harm-note' | 'summary-only' | 'not-transcribed'
    reason: 'C-1: the passage names substance, quantity and process; permitted inside the container, '
          + 'unnormalised, with a bound harm note.',
  },

  harmNote: {                     // null only when carveOut === 'none' AND harmFlag === false
    mechanism: '…',               // (1) what goes wrong, physiologically or socially — never "be careful"
    source:    '…',               // (2) a citation for (1)
    dissent:   '…',               // (3) the tradition's OWN internal dissent, noting who had done it
    injuries:  '…' | null,        // (4) documented injuries, where attested
  } | null,

  quoteBounds: {
    words: 84,                    // recomputed and asserted equal
    codepoints: 512,              // NFC codepoints, recomputed and asserted equal
    pairWords: 171,               // text + translation together
    pairCodepoints: 861,
    capApplied: 'words',          // which cap bound: 'words' | 'codepoints' | 'unspaced-codepoints'
    unitExtent: { of: 78, quoted: '1–22' },   // the OPERATIVE UNIT, as the edition numbers it, and the
                                              // span quoted from it. quoted-span < of, strictly (§4.5 cap 3)
  },

  // ── the site's own prose (LINTED as site voice) ───────────────────────────
  siteVoice: {
    summary:  'The papyrus directs the operator to …',   // mandatory; no orphan quotations (§4.6)
    whatItIs: '…',
    note:     '…' | null,
  },

  // ── the operable triple, typed so it cannot be free prose (C-1) ───────────
  substance:    'cinnabar' | null,
  quantity:     { value: 3, unit: 'māṣa', archaic: true } | null,
  processParam: { kind: 'cycles', value: 7 } | null,
  normalised: false,              // REQUIRED LITERAL false on every harm-flagged record
  harmFlag: true,

  // ── the argument, which is never ours (§2.4) ──────────────────────────────
  parallels: ['sol-hyg-i-12'],    // reciprocal; every edge resolves in parallels.js and carries claimedBy
  contested: { positions: [ {…}, {…} ] } | null,   // ≥2 positions when present
  cite: 'Preisendanz, PGM I (1928), IV.1928–2005',
}
```

**Field-by-field notes that are load-bearing:**

- **`text` is the only place an imperative may appear.** It is excluded from the voice lint, from the search
  index, and from the assistant context. It is present *only* when `pdBasis.verdict ∈ PD_VERDICTS` **and**
  `carveOutStatus.disposition === 'quoted-with-harm-note'`. In every other case the key is **absent**, not
  empty — the schema check is `!('text' in record)`.
- **`script` selects the cap, `language` does not.** Scripts without word spacing —
  `Hani|Hans|Hant|Hira|Kana|Thai|Laoo|Khmr|Mymr|Tibt` — get **300 codepoints and no word cap**. Everything
  else gets 120 words AND 700 codepoints, whichever binds first. `script` is asserted equal to
  `detectScript(text)`, computed from the dominant Unicode block, so a wrong declaration fails the build
  rather than silently raising the cap by a factor of a thousand.
- **`pdBasis.verdict` is `pd-us`, never `pd`.** The rendered chip reads "Public domain in the United States."
  A bare "public domain" chip is a claim the site cannot support (§4.2).
- **`translator` and `year` are top-level for the original, and repeated inside `translation` for the
  translation, because they are two separately licensed works** and a PD Greek original with an in-copyright
  English translation must render the Greek and not the English. That is expressed structurally:
  `translation.pdBasis.verdict === 'cite-only'` ⇒ `translation.text` absent.
- **`procedureType` is deliberately not a facet.** It exists so the generation gate knows which carve-out
  screens to run. Exposing it as a filter control would rebuild the purpose index the site promises never to
  build (§7.5, §5 A-1). Assertion B-A5 pins the facet whitelist against it.
- **`carveOutStatus.reason` is prose the reader sees**, not an internal comment. When the disposition is
  `summary-only` or `not-transcribed`, the reason is rendered: the site says *that* it withheld and *why*
  (C-4 disclosure).
- **`quoteBounds.unitExtent` is the cap that actually matters.** Most PGM spells and Atharvan charms are
  under 120 words in their entirety, so the word cap alone licenses a complete working rite. A record that
  cannot state where its passage sits inside the operative unit does not know what it is quoting and does not
  ship.

### 1.3 The enums, all exported from `core/quoted.js`

```js
export const PD_VERDICTS  = ['pd-us', 'cc0', 'cc-by'];      // reproducible
export const CITE_ONLY    = 'cite-only';                     // never reproduced
export const ALL_VERDICTS = [...PD_VERDICTS, CITE_ONLY];

export const CARVE_OUTS = ['none', 'toxic', 'mutilation', 'hypoxia',
                           'hostile-target', 'self-injury-method', 'branded-regimen'];

export const DISPOSITIONS = ['quoted-with-harm-note', 'summary-only', 'not-transcribed'];

export const PROCEDURE_TYPES = [
  'consecration', 'suffumigation', 'invocation', 'materia-preparation', 'purification',
  'breath', 'posture', 'seal-mudra', 'amulet-talisman', 'hostile-act', 'coercive-act',
  'divination', 'fasting', 'initiation', 'other',
];

export const FACETS = ['corpus', 'date', 'language', 'scholar'];   // the WHOLE list (§5 A-1)

export const UNSPACED_SCRIPTS = ['Hani','Hans','Hant','Hira','Kana','Thai','Laoo','Khmr','Mymr','Tibt'];

export const CAPS = {
  words: 120, codepoints: 700,
  unspacedCodepoints: 300,
  pairWords: 180, pairCodepoints: 900,
  perWorkRecords: 20, perWorkFraction: 0.05,
  perWorkNoExtent: 5,          // workExtent undeclared
  perWorkUnparsableLocus: 3,   // locus.parsable === false
};

// Moved here from the two divergent test copies (34 alternates vs 10) so one list governs.
export const IMPERATIVE_OPENERS =
  /^(Sit|Breathe|Hold|Place|Press|Repeat|Inhale|Exhale|Visualize|Visualise|Recite|Cut|Draw|Close|Contract|Fix|Raise|Throw|Purse|Extend|Make|Fold|Move|Rub|Insert|Turn|Grasp|Stand|Apply|Keep|Practise|Practice|Do|Choose|Elect|Prepare|Consecrate|Kindle|Speak|Engrave|Take|Mix|Boil|Grind|Bury|Write|Chant|Perform)\b/;
```

### 1.4 The licence-vocabulary merge (X7)

Three enums for one concept is how a rule rots. `core/quoted.js` becomes the single source and declares a
**total** mapping, asserted exhaustive:

```js
export const LICENCE_MAP = {          // legacy value → PD_VERDICTS value
  'quoteSafe:true':  'pd-us',
  'quoteSafe:false': 'cite-only',
  'cc0':             'cc0',
  'pd-age':          'pd-us',
  'original':        null,            // per-record: resolves to 'cc-by' or 'cc0'; null forces a decision
};
export const resolveLicence = (legacyValue, record) => { /* throws on an unmapped value */ };
```

The Buddhist wing's `licence` field is **migrated** through this map, not left as a parallel dialect
(assertion X-1). `greatworks`' `quoteSafe`/`pdStatus` records resolve through it too (X-2).

---

## 2. The marked-container contract

**This is the exact shape the lint keys on. There is no second permitted shape.**

```html
<figure class="quoted-primary"
        data-record="pgm-iv-1928"
        data-locus="PGM IV.1928–2005"
        data-edition="Preisendanz, Papyri Graecae Magicae I (1928)"
        data-pd="pd-us"
        lang="grc">
  <div class="qp-harm">…the four-part harm note, in site voice…</div>   <!-- REQUIRED when harm-flagged -->
  <blockquote>…verbatim…</blockquote>
  <figcaption class="qp-attrib">
    <cite>Papyri Graecae Magicae IV.1928–2005</cite>
    <span class="qp-edition">Preisendanz (1928)</span>
    <span class="qp-pd qp-pd-pd-us">Public domain in the United States</span>
  </figcaption>
</figure>
```

**The contract, clause by clause:**

| Rule | Lint key |
|---|---|
| Verbatim operative text appears **only** inside `figure.quoted-primary` | `QUOTE_CLASS = 'quoted-primary'`; no `<blockquote>` in `pages/quoted/**` outside it (D4) |
| The element is a `<figure>`, never a bare `<blockquote>` or `<div>` | opener count `/<figure[^>]*class="[^"]*\bquoted-primary\b/g` === `<figcaption>` count (D1) |
| Four data attributes, all non-empty | `QUOTE_ATTRS = ['data-record','data-locus','data-edition','data-pd']` (D2) |
| `data-pd` ∈ `PD_VERDICTS` — **never `cite-only` in the DOM** | (D3) |
| `data-record` resolves to a real record `id`, and `data-locus` equals that record's `locus.label` | the DOM↔data anti-drift check (D5) |
| `<figcaption class="qp-attrib">` is **mandatory and machine-parsed** | (D1) |
| The PD chip text reads "Public domain in the United States" | (D8) |
| **The harm note is a `div.qp-harm` INSIDE the figure and PRECEDES the `<blockquote>`** | (D9) |
| The standing note appears before the first figure in source order | (D6) |
| The wing's pages carry `/no demonstrated validity/i` and an amended described-never-prescribed string | (D7) |

**Why `div.qp-harm` sits inside the figure and before the quote.** `scripts/build-search-index.mjs` does not
index records — it regex-strips `<main>` to flat text and truncates at `BODY_CHARS = 1800`. **There are no
fields**, so "the harm note travels in the same indexed field" describes a structure that does not exist. DOM
order is the only mechanism that survives prefix truncation: put the note first and any extraction that
reaches the quotation has already carried the note. §9.16 additionally removes quotation bodies from the index
altogether, but D9 holds regardless, because the index is not the only extractor.

`blockquote.lilly` elsewhere on the site is untouched — Lilly 1647 is public domain and its existing uses are
non-operative. The new container is scoped to the survey wing plus any page that adopts it explicitly.

---

## 3. The GENERATION-TIME gate

> **The generator imports the carve-out rules and refuses to emit a forbidden record. The refusal is logged.**

A post-hoc scan for "does this text contain a dosage" is unwinnable — you cannot regex your way to "is this a
usable quantity." So the gate runs at construction, before the record exists.

### 3.1 The factory

Every record in `assets/js/core/data/quoted/*.js` is produced by `defineQuoted()`. There is no other way to
create one; a raw object literal exported from a data module fails assertion G-1.

```js
// assets/js/core/quoted.js
import { REFUSALS } from './quoted-refusals.js';   // append-only, in-memory during build

export function defineQuoted(draft) {
  const faults = quoteFaults(draft);               // the complete rule set, §3.2
  if (faults.length) {
    logRefusal(draft, faults);                     // §3.4 — ALWAYS, before anything else
    if (faults.some(f => f.severity === 'refuse')) {
      return redact(draft, faults);                // §3.3 — a record that CANNOT hold the payload
    }
    throw new Error(`quoted: ${draft.id} — ${faults.map(f => f.code).join(', ')}`);
  }
  return Object.freeze(draft);
}
```

Two outcomes, and the difference matters:

- **Refusal (`severity: 'refuse'`)** — a carve-out or licence rule forbids reproduction. The record is
  **redacted, not rejected**: it still ships, carrying locus, work, edition, site-voice summary, harm note,
  parallels and a rendered statement of what was withheld and why. Silence is not honest; the diffusion point
  usually survives, because the point was the structure and the structure is in the summary.
- **Fault (`severity: 'fault'`)** — the author made a mistake (a missing `unitExtent`, a mismatched `script`,
  a `pdBasis.ground` with no year). The build **throws**. There is no redaction path for an error; it is
  fixed.

### 3.2 `quoteFaults(record)` — the rule set the generator imports

Grouped by the FRAMING.md clause each implements. Every entry returns
`{ code, clause, severity, field, message }`.

**Licence gates (run first — copyright is assessed before harm):**

| Code | Rule | Severity |
|---|---|---|
| `L-VERDICT` | `pdBasis.verdict ∈ ALL_VERDICTS` | fault |
| `L-CITEONLY` | `verdict === 'cite-only'` ⇒ `text` and `translation.text` **absent** | **refuse** |
| `L-GROUND` | `verdict === 'pd-us'` ⇒ ground matches `/(95-year\|renewal\|not renewed\|URAA\|term expired\|published (in )?1[89]\d\d)/i` **and** `/\b1[89]\d\d\b/`. The phrase "public domain" is **not** an accepted ground | fault |
| `L-SOURCES` | `verdict ∈ PD_VERDICTS` ⇒ `pdBasis.sources.length ≥ 1`, every `url` `https:` | fault |
| `L-JURIS` | `pdBasis.jurisdiction === 'US'` | fault |
| `L-TRANS` | `translation.pdBasis.verdict === 'cite-only'` ⇒ `translation.text` absent | **refuse** (translation only) |
| `L-YEAR` | `year ≤ 1930` for a `pd-us` verdict grounded on age; volume-level, not corpus-level (Preisendanz vol. 1 1928 passes, vol. 2 1931 does not until 2027-01-01) | fault |

**Bounds (§4.5):**

| Code | Rule | Severity |
|---|---|---|
| `B-SCRIPT` | `script === detectScript(text)` | fault |
| `B-WORDS` | spaced scripts: `words ≤ 120`; unspaced: word cap not applied | **refuse** |
| `B-CHARS` | spaced: `codepoints ≤ 700`; unspaced: `codepoints ≤ 300` | **refuse** |
| `B-PAIR` | `pairWords ≤ 180` **and** `pairCodepoints ≤ 900` | **refuse** |
| `B-COUNTS` | declared counts equal recomputed counts | fault |
| `B-UNIT` | `unitExtent` present, and the quoted span is **strictly** less than `unitExtent.of` | **refuse** |
| `B-LOCUS` | within a `workSlug`, no two `locus` ranges overlap, and consecutive ranges are separated by **at least their own combined length** | **refuse** |
| `B-ONCE` | one locus, one record, one edition — no duplicate `(workSlug, locus.label)` | **refuse** |
| `B-WORKCAP` | records per `workSlug` ≤ `min(20, 0.05 × workExtent.total)`; `workExtent` undeclared ⇒ 5; `locus.parsable === false` ⇒ 3 | **refuse** |

**Carve-out gates (C-1 … C-6):**

| Code | Rule | Severity |
|---|---|---|
| `C-ENUM` | `carveOut ∈ CARVE_OUTS`, `disposition ∈ DISPOSITIONS` | fault |
| `C-TRIPLE` | `harmFlag === true` ⇒ **at most two** of `substance`/`quantity`/`processParam` non-null; the third is `null` with a reason in `carveOutStatus.reason` (C-1) | **refuse** |
| `C-NORM` | `harmFlag === true` ⇒ `normalised === false` literal, **and** no `/\b(g\|mg\|kg\|ml\|°C\|°F\|minutes?\|hours?)\b/` token in any site-voice field (A-4) | fault |
| `C-REGIMEN` | `carveOut === 'mutilation'` ⇒ `text` contains no graded-regimen token: `/\b(every (day\|week\|month\|monday)\|each (day\|week)\|daily\|weekly\|for \w+ (days\|weeks\|months)\|(first\|second\|third) (session\|sitting)\|repeat .{0,20}times\|gradually increas)/i` (C-2, **narrowed**: instrument and emollient are permitted) | **refuse** |
| `C-HYPOXIA-WATER` | `procedureType === 'breath'` ⇒ `text` contains no `/\b(water\|submerg\|submers\|bath\|bathe\|river\|tank\|pool\|immers)/i` (C-3.2) | **refuse** |
| `C-HYPOXIA-GOAL` | no unconsciousness-as-goal token: `/\b(until (you\|he\|one) (faint\|swoon\|black\s?out\|lose consciousness)\|to the point of (fainting\|unconsciousness)\|blackout)/i`; and `year > 1900` blackout protocols are `not-transcribed` outright (C-3.3) | **refuse** |
| `C-HYPOXIA-VOICE` | no timing or ratio token in **site-voice** fields for `procedureType === 'breath'` (C-3.4) | fault |
| `C-SELFINJURY` | `carveOut === 'self-injury-method'` ⇒ `disposition === 'not-transcribed'`, `text` **absent**, and `harmNote` includes crisis signposting (C-4) | **refuse** |
| `C-SLOT` | `text` containing a target slot `/\b(NN\|so-and-so\|so and so\|N\.N\.\|amuka\|whom I wish\|the enemy\|name of the (victim\|enemy\|person))\b/i` **and** an operative sequence (≥2 `IMPERATIVE_OPENERS` matches at sentence starts, or an ordered-step marker) ⇒ `carveOut = 'hostile-target'`, `disposition = 'summary-only'` (C-5) | **refuse** |
| `C-HOSTILE-SET` | "hostile" covers the ṣaṭkarman hostile set — `māraṇa`, `uccāṭana`, `vidveṣaṇa`, `stambhana`, `vaśīkaraṇa` as applied to a person — not `māraṇa` alone. Detection is by `procedureType ∈ ['hostile-act','coercive-act']`, declared in data, **not** inferred from the text | fault |
| `C-BRANDED` | `carveOut === 'branded-regimen'` ⇒ `disposition === 'not-transcribed'`, `text` absent (C-6) | **refuse** |
| `C-HARMNOTE` | `carveOut !== 'none'` **or** `harmFlag === true` ⇒ `harmNote` present with all four parts non-empty (`injuries` may be `null` only when none is attested, and then `harmNote.injuries === null` is explicit, not missing) | fault |
| `C-HARMWORDS` | the note names the specific harm, per category: `toxic → /(toxic\|poison\|mercur\|arsenic\|lead\|lethal)/i`; `mutilation → /(cut\|incis\|sever\|haemorrhage\|hemorrhage)/i`; `hypoxia → /(hypox\|hypocapn\|asphyx\|blackout\|faint\|unconscious)/i`; `hostile-target → /(harm\|coerc\|accus\|violence\|third party)/i`; `self-injury-method → /(self-injur\|self-harm\|crisis)/i`; `branded-regimen → /(starvation\|refeeding\|death)/i` | fault |
| `C-DISCLOSE` | `disposition !== 'quoted-with-harm-note'` ⇒ `siteVoice.summary` matches `/(not (transcribed\|reproduced)\|withheld\|deliberately omitted)/i` **and** `carveOutStatus.reason` is non-empty. The site says *that* it withheld and *why*; silent omission is not honest | fault |

**Attribution gates (§2.4):**

| Code | Rule | Severity |
|---|---|---|
| `A-CLAIMEDBY` | every `parallels` edge resolves in `parallels.js` and carries `claimedBy: {author, work, year, locus}`, all non-empty. **An edge without it does not render** | fault |
| `A-RECIPROCAL` | every edge is reciprocal, and joins two different `corpus` values or carries `intraCorpus: true` with a reason | fault |
| `A-DIRECTION` | an edge asserting a direction carries `direction`, and where `direction !== 'unknown'` a `contested` block with ≥2 positions | fault |
| `A-PRIORITY` | a site-voice string matching `/\b(earliest\|first\|oldest\|originat\w*)\b/i` must also match `/(attested\|extant\|surviving\|known)/i`, carry a `cite` or `contested`, **and** carry a non-empty `claimedBy.author` (§8.3) | fault |

**Voice and framing:**

| Code | Rule | Severity |
|---|---|---|
| `V-IMPERATIVE` | no `SITE_VOICE_FIELDS` string begins with an `IMPERATIVE_OPENERS` alternate | fault |
| `V-BANNED` | `findBannedInSiteVoice(record, SITE_VOICE_FIELDS) === null` | fault |
| `V-FRAME` | `siteVoice.summary` starts with an attributing frame: `/^(The (text\|papyrus\|manuscript\|recipe\|rite\|verse\|commentary)\|[A-ZĀ-Ž][^.]{0,60} (records\|prescribes\|instructs\|gives\|directs\|has\|dates))\b/` | fault |
| `V-ORPHAN` | `text` present ⇒ `siteVoice.summary` non-empty (§4.6) | fault |
| `V-SECONDPERSON` | no `/\b(you\|your\|yours\|yourself)\b/i` in any site-voice field | fault |

### 3.3 `redact(draft, faults)` — what a refused record becomes

Redaction is **key deletion, not blanking**, so the schema check `!('text' in record)` is decisive and no
downstream consumer can find an empty string where a passage used to be:

```js
function redact(draft, faults) {
  const { text, translation, ...rest } = draft;
  return Object.freeze({
    ...rest,
    carveOutStatus: {
      ...rest.carveOutStatus,
      disposition: worstOf(faults) === 'L-CITEONLY' ? 'summary-only' : dispositionFor(faults),
      reason: rest.carveOutStatus.reason || refusalProse(faults),
    },
    quoteBounds: { ...rest.quoteBounds, words: 0, codepoints: 0, pairWords: 0, pairCodepoints: 0 },
    withheld: faults.map(f => ({ code: f.code, clause: f.clause })),   // rendered, not hidden
  });
}
```

The renderer reads `withheld` and prints the disclosure line. A redacted record still appears in the
comparison view — as its site-voice summary — because the withholding is part of the record, not a hole in it.

### 3.4 The refusal log

Refusals are the single most useful audit artefact this wing produces: they are the evidence that the gate
runs, and the anti-vacuity proof that it is not a no-op.

- `logRefusal()` appends to `docs/quoted-refusals.md`, one row per refusal, at build time:
  `| date | record id | workSlug | clause | code | what was withheld |`
- The log is **committed**. It is a public record of what the site declined to print and under which clause —
  the machine-readable form of "where something is withheld, the page says so and why."
- The log never contains the refused text. It contains the record id, the clause and a word count.
- **Assertion G-4** requires the log to be non-empty and to contain at least one entry per severity-`refuse`
  code that the fixture suite plants. A gate that has never refused anything has not been shown to work.

### 3.5 Anti-vacuity fixtures (G-5)

Every `refuse`-severity code is planted against a fixture in `r33-quoted-texts.mjs` and asserted to fire, in
the style the repo already uses for its banned-phrase tripwires. A rule that has never been observed to fire
is a rule that does not exist.

---

## 4. The AGGREGATION guard

> **No comparison view may assemble a protocol out of individually compliant parts.**

This is the guard that matters, because every carve-out above scores an availability baseline of
approximately zero: single-passage quotation adds almost nothing, and the assembled row adds everything.

### 4.1 The rule

The single-record tests are re-run **over the union of everything simultaneously on screen**:

```js
// assets/js/core/quoted.js
export function unionOf(records) {
  return {
    text:         records.map(r => r.text || '').join('\n'),
    substances:   records.map(r => r.substance).filter(Boolean),
    quantities:   records.map(r => r.quantity).filter(Boolean),
    processParams:records.map(r => r.processParam).filter(Boolean),
    procedureTypes: [...new Set(records.map(r => r.procedureType))],
    carveOuts:    [...new Set(records.map(r => r.carveOutStatus.carveOut))],
  };
}

// Runs C-TRIPLE, C-SLOT, C-HYPOXIA-WATER, C-HYPOXIA-GOAL and C-REGIMEN against the union
// AS IF IT WERE ONE DOCUMENT. Any test that fires on the union fires on the view.
export function rowFaults(records) { /* → [] or faults */ }
```

Three scopes, all asserted:

1. **The row.** Every comparison row is unioned before render.
2. **The rendered page.** Every set of `figure.quoted-primary` figures on one page whose records share a
   `carveOut` or a hostile `procedureType` is unioned. *"Row" is a rendering accident*; whatever is
   simultaneously on screen is the document.
3. **Any filter state the controls can produce.** The test enumerates the cartesian product of the declared
   facet values and unions each resulting result set. This is finite because the facets are finite — which is
   the reason the facet list is closed (§4.3).

### 4.2 What happens when the union trips

The row renders with the offending cell replaced by its `siteVoice.summary`, plus a stated line:

> *Withheld here because of what stands beside it: this passage is reproduced elsewhere in the survey, but not
> in a view that also carries [the slot / the sequence / the third term of the triple]. See [record link].*

The withholding is disclosed, and the diffusion point survives — because the point was the structure, and the
structure is in the summary.

### 4.3 Filters cannot compose

| Rule | Enforcement |
|---|---|
| **Facets are exactly `corpus`, `date`, `language`, `scholar`.** Never `purpose`, `act`, `aim`, `procedureType`, `carveOut`, `substance` | `FACETS` is a frozen export; the filter definitions live in data and are asserted `⊆ FACETS` (A-5) |
| No filter combination may narrow the wing to a single act or purpose across corpora | falls out of the facet whitelist, and is re-checked by the enumeration in §4.1(3) |
| No free-text search box over the wing's quotation bodies | quotation bodies excluded from `assets/search-index.json` (§9.16, assertion S-1) |
| No field that accepts a person's name | no `<input>`/`<textarea>` in `pages/quoted/**` except the facet `<select>`s (A-6) |
| No "cast", "generate", "perform" affordance | string check over `pages/quoted/**` and `assets/js/app/quoted.js` (A-7) |
| Not callable | the registry entry for the wing is `callable: false`, pinned by the existing anti-drift test (A-8) |

### 4.4 Empty cells are never filled

`A-2`: an empty comparative cell renders the literal string **"Not attested in this witness."** and is never
populated from a parallel. §2.4's `claimedBy` requirement makes inference-filling structurally impossible as
well — there is no cell for the site's own inference to occupy — but the renderer assertion stays, because
belt and braces is cheap here and the failure mode is the site's worst.

### 4.5 The site-wide interface invariant (A-3)

Beyond the survey wing, and binding today:

> **No capability anywhere in the registry may return an ordered, imperative, personalised sequence of
> operative steps.**

Asserted as N-1: for every `callable: true` registry entry, invoke it against the reference charts and assert
that no returned key named `steps`/`procedure`/`instructions`/`recipe` holds strings beginning with an
`IMPERATIVE_OPENERS` alternate. This currently fails on `talismanRecipe()` and is the reason B1 is a blocker.

---

## 5. The AI-assistant changes

### 5.1 What is structural, and what is not

Stated here so no reader of this spec mistakes a preamble for a control. The assistant is **browser-direct
and bring-your-own-key**: the user picks the provider, supplies the key, and may point at any
OpenAI-compatible base URL; the offered models include small open-weight ones; the system prompt is
client-side JavaScript on a static site; and the page displays the passage anyway.

| Protection | Real? |
|---|---|
| Quoted text never enters the context | **Structural.** Assertion F-8 |
| The tool surface cannot compose survey data | **Structural.** Assertions A-8, N-1 |
| Preamble rules 3–6 | **Default-shaping only.** Checkable for presence, not for obedience |

### 5.2 The instruction changes

Four edits, specified in FRAMING.md §9.9–§9.13 and reproduced here only where the exact string is
load-bearing:

1. **`HONEST_SYSTEM_PREAMBLE` rules 3–6** (§9.9). The critical repair: the old rule 3 told the model it "may
   quote it back" while the context deliberately withholds the passage — inviting the model to supply it from
   training data, which rule 4 forbids in the next sentence. The two rules pointed the model in opposite
   directions on the one question that matters. Rule 3 now distinguishes *supplied in this conversation* from
   *not supplied*, and prescribes a different behaviour for each.
2. **`QUOTED_TEXT_CONTRACT`**, a new export beside `CITE_CONTRACT`, injected in `assembleSystem()` — not
   pasted into each persona, because injection at the assembly point is the only way it provably reaches all
   five personas (§9.10).
3. **`buildOperationPrompt`** rewritten, not appended to (§9.11).
4. **Four persona clauses** and the `PLAIN_STRUCTURE`/`PLAIN_CODA` bullet (§9.12–§9.13).

### 5.3 The exact refusal language

Three refusals. These strings are pinned by tests, so they are the strings, not a paraphrase of them.

**(a) Conversion-to-instruction refused** — the reader asks the assistant to turn a displayed quotation into
steps, a dose, a schedule, or a second-person restatement:

```
I won't turn this passage into instructions. It is on this page as the object of study, not as a procedure:
what I can do is tell you what it says, who translated it and when, where it sits in the edition, how it
differs from the parallel passages, and what scholars have argued about it. What I won't do is restate it in
the second person, adapt or complete it, modernise a unit or supply a dose, or answer "how do I do this."
The complete text is in %EDITION%, at %LOCUS%, if you want to read it in full.
```

**(b) A withheld category requested** — the reader asks for something the site deliberately does not
transcribe, or asks the assistant to fill the gap from its own knowledge:

```
This site withholds that deliberately, and I don't supply it from my own knowledge. The category is
%CARVEOUT%, and the reason is %REASON%. What the site does carry — and what I can go through with you — is
the text's date, its locus, its editions, its reception, and what the scholarship says about how it
travelled. The edition that carries the full text is %EDITION%.
```

**(c) No passage in hand** — the reader asks about a passage the page did not supply:

```
I don't have that text in front of me. This site doesn't send quoted passages to the assistant, and I won't
reproduce one from memory — a half-remembered edition is worse than no edition. It is %LOCUS%, in %EDITION%.
Open the record and the passage will be on the page, and then I can gloss it with you.
```

**(d) And the string that replaces the refusal-coaching message** (blocker B2), in
`assets/js/app/llm-core.js` ×2 and `assets/js/app/autopilot.js`:

```
(The model declined to answer. This site does not work around a provider's refusal; the page itself carries
the citation and the edition.)
```

*The message it replaces read "— try the recommended Opus 4.8 model, or rephrase," which is user-facing
coaching to defeat a safety refusal. Sitting one panel away from reproduced operative ritual text, it is the
single sentence a hostile reviewer would screenshot, and the reviewer would be right.*

### 5.4 The one behavioural assertion

**F-8** — for every reading kind, `buildContext(reading).system` and `assembleSystem(kind, …)` contain **no
≥12-word substring** of any shipped `text` or `translation.text`. Computed by shingling every quoted passage
into 12-word windows (NFC-normalised, whitespace-collapsed, punctuation-stripped) and asserting no window
appears in either string.

That is a real test of a real property. F-1 … F-7 are presence checks — they assert that the author's own
sentence exists in the author's own string — and they are labelled as such below.

---

## 6. The ENGINE-TEST ASSERTION LIST

All of it lands in `scripts/tests/r33-quoted-texts.mjs`, except the `F-*` and `N-*` families which extend
`scripts/engine-test.mjs` directly (they test constants and registry behaviour, not wing data). The new module
is appended to the child-process module list in `scripts/engine-test.mjs` or it will never run.

Every row names the FRAMING.md clause it makes checkable. **A policy clause with no row here is a clause that
will rot**, and the four in the "explicitly unenforceable" table at the end are declared as such rather than
pretended into the list.

### 6.1 Voice (§3)

| ID | Assertion |
|---|---|
| **V-1** | No `SITE_VOICE_FIELDS` string in any record begins with an `IMPERATIVE_OPENERS` alternate |
| **V-2** | `findBannedInSiteVoice(record, SITE_VOICE_FIELDS) === null` for every record |
| **V-3** | Every `siteVoice.summary` opens with an attributing frame (the `V-FRAME` regex) |
| **V-4** | Anti-vacuity: `V-1` fails on the planted string "Recite the formula thrice" and passes on "The papyrus directs the operator to recite the formula thrice" |
| **V-5** | **The exclusion is narrow, not broad.** At least one shipped record's `text` *would* fail V-1/V-2 if linted, and the suite passes — proving the quote fields are skipped and nothing else is |
| **V-6** | **The strip test is executed.** Read each wing page, delete every `figure.quoted-primary` subtree, assert the remaining `<main>` text passes V-1, V-2 and V-3 |
| **V-7** | No `/\b(you\|your\|yours\|yourself)\b/i` in the wing's rendered `<main>` after removing `figure.quoted-primary` subtrees **and** the standing-note callout (both exempt by construction) |
| **V-8** | `IMPERATIVE_OPENERS` is imported from `core/quoted.js` by `r31-practices-core.mjs` and `r31-practices-ui.mjs` — the 34-vs-10-alternate divergence is gone |

### 6.2 The record and its provenance (§4)

| ID | Assertion |
|---|---|
| **Q-1** | Every record has a non-empty `locus.label` (citation-grade: contains `/[IVXLCDM\d]/`, ≥4 chars) and a `workSlug` resolving in `works.js` |
| **Q-2** | `edition.label` non-empty; `year` an integer; `translator` a string or `null` (never undefined) |
| **Q-3** | `pdBasis.verdict ∈ ALL_VERDICTS`; no other value anywhere |
| **Q-4** | `verdict === 'cite-only'` ⇒ `'text' in record === false` **and** `translation === null`. The hard edge: a copyrighted passage is never reproduced, however important to the argument |
| **Q-5** | `verdict ∈ PD_VERDICTS` ⇒ `pdBasis.ground` ≥40 chars and `pdBasis.sources.length ≥ 1`, every URL `https:` |
| **Q-6** | `verdict === 'pd-us'` ⇒ ground matches the mechanism alternation **and** contains a four-digit 18xx/19xx year. **"public domain" is not an accepted ground** — the earlier alternation containing it matched every `pdStatus` by definition and was vacuous |
| **Q-7** | `pdBasis.jurisdiction === 'US'` on every record; the rendered chip reads "Public domain in the United States"; no bare "public domain" chip anywhere in the wing |
| **Q-8** | `translation` present ⇒ it carries its own `translator`, `year` and `pdBasis`; `translation.pdBasis.verdict === 'cite-only'` ⇒ `'text' in translation === false` |
| **Q-9** | **No orphan quotations:** `'text' in record` ⇒ `siteVoice.summary` non-empty |
| **Q-10** | `parallels` reciprocal, cross-corpus (or `intraCorpus: true` with a reason), and every edge resolves |
| **Q-11** | Every `contested` block has `positions.length ≥ 2` |
| **Q-12** | NFC hygiene on every string field, Greek and Sanskrit included |
| **Q-13** | `script === detectScript(text)` for every record carrying `text` |
| **Q-14** | No record carries an undocumented top-level key (the schema is closed) |

### 6.3 Bounds (§4.5)

| ID | Assertion |
|---|---|
| **B-1** | Spaced scripts: `quoteBounds.words ≤ 120` **and** `codepoints ≤ 700` |
| **B-2** | Unspaced scripts (`UNSPACED_SCRIPTS`): `codepoints ≤ 300`; the word cap is not applied |
| **B-3** | `pairWords ≤ 180` **and** `pairCodepoints ≤ 900` — the pair is capped, not each half |
| **B-4** | Declared counts equal recomputed counts (`countWords`, `countCodepoints` from core) |
| **B-5** | `unitExtent` present on every record carrying `text`, and the quoted span is **strictly** less than `unitExtent.of` — no quotation is a complete operative unit |
| **B-6** | Per `workSlug`: record count ≤ `min(20, 0.05 × workExtent.total)`; `workExtent` undeclared ⇒ ≤5; `locus.parsable === false` ⇒ ≤3 |
| **B-7** | Within a work, no two `locus` ranges overlap, **and** consecutive ranges are separated by at least their own combined length |
| **B-8** | No duplicate `(workSlug, locus.label)` pair — one locus, one record, one edition |
| **B-9** | `works.js`: every entry declares `workExtent: {unit, total, source}` or is explicitly marked undeclared; "work" is the bibliographic unit at which the edition numbers loci (`PGM IV`, not `PGM`) — asserted by requiring `locusScheme` on every work |

### 6.4 Carve-outs (§5)

| ID | Assertion |
|---|---|
| **C-1** | `carveOut ∈ CARVE_OUTS`, `disposition ∈ DISPOSITIONS` |
| **C-2** | `carveOut ∈ ['self-injury-method','branded-regimen']` ⇒ `disposition === 'not-transcribed'` ⇒ `'text' in record === false`. **The schema, not the reviewer, is the gate** |
| **C-3** | `harmFlag === true` ⇒ at most two of `substance`/`quantity`/`processParam` non-null (C-1 operable triple) |
| **C-4** | `harmFlag === true` ⇒ `normalised === false` literal, and no unit token (`g\|mg\|kg\|ml\|°C\|°F\|minutes\|hours`) in any site-voice field |
| **C-5** | The renderer never emits `substance`, `quantity` and `processParam` as three columns of one table row; the column set is read from data, not chosen in the template |
| **C-6** | `carveOut !== 'none' \|\| harmFlag` ⇒ four-part `harmNote` present, each part non-empty (`injuries` explicitly `null` where none attested) |
| **C-7** | Per-category harm-word check (`C-HARMWORDS` regexes) |
| **C-8** | `disposition !== 'quoted-with-harm-note'` ⇒ `siteVoice.summary` discloses the withholding **and** `carveOutStatus.reason` is non-empty |
| **C-9** | Tripwire screens fire on planted fixtures: the toxic quantity-adjacent-to-substance screen, the hypoxia duration-adjacent-to-retention screen, the mutilation graded-regimen screen, the slot+sequence screen |
| **C-10** | `procedureType === 'breath'` ⇒ no water/submersion token in `text`, and no unconsciousness-as-goal token; `year > 1900` blackout protocols are `not-transcribed` |
| **C-11** | `carveOut === 'mutilation'` ⇒ no graded-regimen token in `text`. **Instrument and emollient tokens are NOT checked** — C-2 was narrowed, and `gs-khecari` (which ships "fresh butter" and "an iron instrument" in site voice) is the ratified worked example |
| **C-12** | `gs-khecari` still ships, unmodified, and its `harmNote` still matches `/cut/i` — the ratification is pinned, so a future round cannot retract it by drift |

### 6.5 The generation gate (§3)

| ID | Assertion |
|---|---|
| **G-1** | Every record in `data/quoted/*.js` is frozen and was produced by `defineQuoted()` (checked by a build-stamp symbol the factory sets; a raw literal fails) |
| **G-2** | `quoteFaults(record) === []` for every shipped record — the gate ran and found nothing left |
| **G-3** | A planted forbidden draft (each `refuse`-severity code, one fixture apiece) causes `defineQuoted()` to redact, and the returned object has **no `text` key** — not an empty string |
| **G-4** | `docs/quoted-refusals.md` exists, is non-empty, and contains at least one entry per planted refusal code. **A gate that has never refused anything has not been shown to work** |
| **G-5** | The refusal log contains no ≥8-word run of any refused passage — the log records the refusal, never the payload |
| **G-6** | A planted `fault`-severity draft **throws** rather than redacting; there is no silent-repair path for an author error |

### 6.6 Aggregation (§5, C-7)

| ID | Assertion |
|---|---|
| **A-1** | `rowFaults(union) === []` for every comparison row as assembled |
| **A-2** | Empty cells render the literal "Not attested in this witness." and no cell value is ever sourced from a parallel record |
| **A-3** | **Page-level union.** For each wing page, every set of records sharing a `carveOut` or a hostile `procedureType` is unioned and run through `rowFaults`. This is the assertion that makes the site-wide hostile-rite promise (§9.5) true |
| **A-4** | **Filter-state union.** The cartesian product of declared facet values is enumerated, each result set unioned, each union run through `rowFaults`. Finite because `FACETS` is closed |
| **A-5** | The filter definitions in data satisfy `facets ⊆ FACETS`; `purpose`, `act`, `aim`, `procedureType`, `carveOut` and `substance` appear in no facet definition |
| **A-6** | No `<input>` or `<textarea>` in `pages/quoted/**` other than the facet controls — no field accepts a person's name |
| **A-7** | No `/\b(cast\|generate\|perform)\b/i` affordance label in `pages/quoted/**` or `assets/js/app/quoted.js` |
| **A-8** | The registry entry for the wing exists and is `callable: false`; the existing anti-drift test pins module, export, pages, `howItWorks` and glossary terms |

### 6.7 The DOM (§2 of this spec)

| ID | Assertion |
|---|---|
| **D-1** | Every `quoted-primary` occurrence is a `<figure>` with a `<figcaption>`; opener count === figcaption count |
| **D-2** | Every figure carries all four of `data-record`, `data-locus`, `data-edition`, `data-pd`, each non-empty |
| **D-3** | `data-pd ∈ PD_VERDICTS` — **never `cite-only` in the DOM** |
| **D-4** | No `<blockquote>` in `pages/quoted/**` outside a `figure.quoted-primary` |
| **D-5** | Every `data-record` resolves to a real record id, and `data-locus` equals that record's `locus.label` |
| **D-6** | The standing note appears before the first `quoted-primary` figure in source order on every wing page |
| **D-7** | Every wing page carries `/no demonstrated validity/i` and an amended described-never-prescribed string |
| **D-8** | Every `.qp-pd` chip reads "Public domain in the United States", "CC0" or "CC BY" — never bare "public domain" |
| **D-9** | **Within every harm-flagged figure, the `div.qp-harm` node precedes the `<blockquote>` node.** DOM order guarantees co-extraction under prefix truncation |
| **D-10** | Every wing page links back to the wing that contextualises each record (§8.4) |

### 6.8 Attribution and philological vocabulary (§2.4, §8.3)

| ID | Assertion |
|---|---|
| **P-1** | Any site-voice string matching `/\b(earliest\|first\|oldest\|originat\w*)\b/i` also matches `/(attested\|extant\|surviving\|known)/i`, carries a `cite` or `contested`, **and** carries a non-empty `claimedBy.author` |
| **P-2** | Every directional parallel edge carries `direction`; where `!== 'unknown'`, a `contested` block with ≥2 positions |
| **P-3** | **Every parallel edge carries `claimedBy: {author, work, year, locus}`, all non-empty.** An edge without it is absent from the render output — asserted by rendering and counting |
| **P-4** | No parallel edge exists whose `claimedBy.author` is the site, the repo, or empty. **Where no scholar has made the comparison, there is no row** |
| **P-5** | The superlative grep in `r30-compare.mjs` is still scoped to `competitors.js` and does not run over the wing |

### 6.9 The licence-vocabulary merge (X7)

| ID | Assertion |
|---|---|
| **X-1** | Every licence-bearing record in the repo — `greatworks`, `greatworks-east`, the Buddhist wing, the survey wing — resolves through `LICENCE_MAP` to a `PD_VERDICTS` value or `cite-only`; an unmapped value throws |
| **X-2** | `LICENCE_MAP` is total over the legacy value space (asserted by enumerating the values actually present in the repo) |
| **X-3** | The Buddhist wing's `licence` field has been migrated, not duplicated: `r30-buddhist-core.mjs` imports from `core/quoted.js` |
| **X-4** | Parity fix on the old type: every `quoteSafe: true` work also carries `pdSources.length ≥ 1` |
| **X-5** | `picatrix-prayers.js`: every prayer record carries `pdBasis`; any record with `verdict === 'cite-only'` has no verbatim excerpt; the assistant injection is gated on `verdict !== 'cite-only'` |

### 6.10 The assistant (§5 of this spec)

| ID | Kind | Assertion |
|---|---|---|
| **F-1** | presence | `HONEST_FRAMING` matches `/object of study/i` and `/never this site instructing/i` |
| **F-2** | presence | `HONEST_SYSTEM_PREAMBLE` matches `/never convert quoted text into instruction/i` and `/explain the text; you never operate it/i` |
| **F-3** | presence | `QUOTED_TEXT_CONTRACT` is exported, non-empty, and is a substring of both `buildContext().system` and `assembleSystem()`'s output for at least one divination kind |
| **F-4** | presence | `HONEST_SYSTEM_PREAMBLE` matches `/(do not reconstruct\|never reconstruct) a withheld/i` |
| **F-5** | presence | `buildOperationPrompt()` no longer matches `/A practitioner asks/` or `/THE HISTORICAL PROCEDURE the tradition would follow/`; does match `/never a recommendation to act/` and `/not a set of instructions/i` |
| **F-6** | presence | `PLAIN_STRUCTURE` and `PLAIN_CODA` each match `/never a step drawn from a quoted/i` |
| **F-7** | presence | Rule 3 resolves the old contradiction: it matches `/do not have the text/i` and does **not** match `/you may quote it back/i` unconditionally — the permission is scoped to a supplied passage |
| **F-8** | **behavioural** | For every reading kind, `buildContext().system` and `assembleSystem()` contain **no ≥12-word substring** of any shipped `text` or `translation.text` |
| **F-9** | presence | Each of `DIVINER`, `HISTORIAN`, `JYOTISHI`, `CONFLUENCE` preambles carries its quoted-text clause |

*F-1 … F-7 and F-9 assert that the author's own sentence exists in the author's own string. They are labelled
"presence" so nobody mistakes them for behaviour checks. F-8 is the only behavioural assertion in the
assistant section, and it is real.*

### 6.11 The blockers (§10)

| ID | Assertion |
|---|---|
| **N-1** | **B1.** No `callable: true` registry capability returns a `steps`/`procedure`/`instructions`/`recipe` key whose string values begin with an `IMPERATIVE_OPENERS` alternate. `talismanRecipe()` returns `attestedSequence`, and every harm-flagged material it names carries its harm note **in the same returned object** |
| **N-2** | **B2.** The strings `try the recommended` and `or rephrase` appear nowhere under `assets/js/app/`; the replacement string is present at all three sites |
| **N-3** | **B3.** `pages/practices/mudras.html` carries the narrowed C-2 wording (`/no graded regimen/i`, `/no recommended interval/i`) and does **not** claim that instrument specifications or aftercare are withheld — because the page renders both |
| **N-4** | **B3/X5.** `pages/abhichara/index.html` carries the site-wide clause `/no hostile rite is reproduced as a working sequence anywhere on this site/i`, and A-3 above is what makes it true |
| **N-5** | **B4.** P-3 and P-4 pass — §2.4 is in force at the data layer, not only in prose |

### 6.12 Search index and offline surface

| ID | Assertion |
|---|---|
| **S-1** | No ≥8-word run of any shipped `text` or `translation.text` appears anywhere in `assets/search-index.json` |
| **S-2** | Every wing page appears in the index by its `siteVoice.summary`, so search finds the record and the reader arrives where the frame is intact |
| **S-3** | Every new page is in the service-worker precache list and the index is regenerated |

### 6.13 The removal route (§7.6)

| ID | Assertion |
|---|---|
| **R-1** | The contact string exists on `pages/about/index.html` and states an acknowledgement window and take-down-while-considering |
| **R-2** | Every wing footer links to it in one click, and the link resolves |

**If R-1/R-2 cannot be satisfied, §7.6 is deleted from FRAMING.md in the same commit.** A site with no door
does not get credit for saying it would open one.

### 6.14 Explicitly NOT asserted, and why

Declared rather than pretended into the list above, because an unenforceable clause that looks enforceable is
worse than one that admits it:

| Clause | Why it cannot be asserted | Disposition |
|---|---|---|
| "What remains must read as a museum label" | A mood. §3.1 says moods are not lintable | **Demoted to a heuristic.** The strip test IS V-1 ∧ V-3 ∧ D-4 ∧ V-6, and nothing else |
| The assistant obeys rules 3–6 | Client-side prompt, user-chosen model and base URL | **Labelled.** F-2/F-4/F-7 are presence checks; F-8 is the only real one |
| "The reader will not paste the passage elsewhere" | Not a property of this repo | Never claimed |
| Global (non-US) public-domain status | The site is not competent to determine it | **Scoped.** `jurisdiction: 'US'`, and the About page says so |

---

## 7. Files

### New

| File | What it is |
|---|---|
| `assets/js/core/quoted.js` | the contract: enums, caps, screens, `defineQuoted`, `quoteFaults`, `rowFaults`, `unionOf`, `detectScript`, `IMPERATIVE_OPENERS`, `LICENCE_MAP` |
| `assets/js/core/data/quoted/works.js` | work registry with `workExtent` and `locusScheme` |
| `assets/js/core/data/quoted/parallels.js` | parallel edges, every one carrying `claimedBy` |
| `assets/js/core/data/quoted/*.js` | per-corpus record modules |
| `assets/js/app/quoted.js` | the renderer |
| `assets/css/quoted.css` | container styling incl. print rules |
| `pages/quoted/*.html` | the wing |
| `scripts/tests/r33-quoted-texts.mjs` | §6, plus `export const DRIVES` for the browser sweep |
| `docs/quoted-refusals.md` | the committed refusal log |

### Modified

| File | Change |
|---|---|
| `assets/js/core/reading.js` | `HONEST_FRAMING` — FRAMING.md §9.1 |
| `assets/js/core/talisman.js` | **B1** — re-voice `talismanRecipe()`, `steps` → `attestedSequence`, harm notes in-object (§9.14) |
| `assets/js/core/data/planetary-magic.js` | harm-flag the materia so `talismanRecipe` can resolve notes for them |
| `assets/js/core/llm-context.js` | rules 3–6; `QUOTED_TEXT_CONTRACT`; `CITE_CONTRACT` clause; `assembleSystem()` injection; `buildOperationPrompt` rewrite; four persona clauses; `PLAIN_STRUCTURE`/`PLAIN_CODA`; gate the Picatrix prayer injection |
| `assets/js/app/llm-core.js` | **B2** — refusal message ×2 |
| `assets/js/app/autopilot.js` | **B2** — refusal message |
| `assets/js/core/explain/util.js` | add `findBannedInSiteVoice(record, fields)`; leave `BANNED_PHRASES`/`findBanned` intact |
| `assets/js/core/data/picatrix-prayers.js` | add `pdBasis`; re-source to PD/Latin or mark `cite-only` and drop the verbatim text |
| `assets/js/core/registry.js` | add the wing entry, `callable: false` |
| `assets/js/core/data/buddhist/*` | migrate `licence` through `LICENCE_MAP` |
| `scripts/engine-test.mjs` | add F-1…F-9, N-1…N-5, X-1…X-5; append `'r33-quoted-texts'` to the module list; comment the abhicāra verb ban as site-voice-scoped by construction; parity fix `pdSources` on `quoteSafe:true` works |
| `scripts/tests/r31-practices-core.mjs` | import `IMPERATIVE_OPENERS` from core (kills the 34-vs-10 divergence); keep the `gs-khecari` pins (C-12) |
| `scripts/tests/r31-practices-ui.mjs` | same import |
| `scripts/tests/r30-compare.mjs` | unchanged; add a header comment scoping it to `competitors.js` |
| `scripts/tests/r30-buddhist-core.mjs` | import the licence enum from core |
| `scripts/build-search-index.mjs` | strip `figure.quoted-primary` subtrees before extraction; index the summary instead (§9.16) |
| `pages/about/index.html` | §9.2 covenant, §9.3 per-wing paragraph, §9.4 abhicāra paragraph, §9.17 contact route |
| `pages/abhichara/index.html` | §9.5 — the site-wide clause + the accusation-violence harm note |
| `pages/practices/mudras.html` | §9.6 — the rewritten standing note |
| `pages/rasa.html` | §9.7 — the corrected toxicity callout |
| every wing footer template | §9.17 — the removal-route link |
| `sw.js`, `manifest.webmanifest`, `assets/search-index.json` | new pages precached; index regenerated |

### The gate is unchanged in shape

`Skill: verify-site` → serve + Chromium sweep + `node scripts/audit.mjs` + `node scripts/engine-test.mjs`.
The new module runs inside `engine-test` via the module list. No new tooling.

---

## 8. Build order

1. **Blockers first, alone, in one commit** — B1 (`talisman.js` re-voicing + N-1), B2 (refusal string + N-2),
   B3 (mudrās note + abhicāra clause + N-3/N-4). No quotation data in this commit. The site must be able to
   pass "the site's voice never instructs" *before* it claims it beside a quotation.
2. **`core/quoted.js` + `LICENCE_MAP` migration** — X-1…X-5, V-8. Still no quotation data.
3. **`defineQuoted` + the fixture suite** — G-1…G-6, C-9. The gate is proven to refuse before it is given
   anything to refuse.
4. **The first corpus module, one work, three records** — Q-*, B-*, C-*, P-*.
5. **The renderer and one page** — D-*, V-6, V-7, A-1…A-8.
6. **The assistant edits** — F-1…F-9.
7. **Search index + service worker** — S-1…S-3.
8. **§7.6's door, or §7.6's deletion** — R-1/R-2.

---

## 9. Open questions for the maintainer

Listed here rather than resolved, because each one changes what gets built:

1. **The wing's URL and name.** `pages/quoted/` is assumed throughout. If it becomes `pages/opgraph/` or
   sits inside the Confluence atlas, D-*, S-3 and the registry entry change.
2. **Whether §7.6 ships at all.** It needs a contact route the maintainer is willing to publish and staff.
   Absent that, it is deleted from FRAMING.md — the clause and its assertions go together.
3. **Whether `talismanRecipe()` is re-voiced or the "never instructs" claim is narrowed.** FRAMING.md §3.1
   argues for re-voicing. The other option is available and must be taken explicitly, in prose, if taken.
4. **The first corpus.** PGM is the natural showcase and the hardest licence case (Preisendanz vol. 2 is not
   PD in the US until 2027-01-01). The haṭha corpus is easier and already has a shipped record to anchor to.
5. **Whether the survey wing gets its own assistant persona** (`PHILOLOGIST_PREAMBLE`, based on
   `CONFLUENCE_PREAMBLE`) or reuses Confluence.
