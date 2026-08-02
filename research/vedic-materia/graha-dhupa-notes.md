# GRAHA DHŪPA — incense and fragrant substances per planet

**Round:** Vedic materia, 2026-08-01 · **Role:** COMPILER · **Data:** `graha-dhupa.json`
**Governing documents:** `docs/FRAMING.md` §11 (documented-practice amendment) and §5 C-1 (the operable
triple); `docs/plans/horae/RESEARCH-PROTOCOL.md` §3 C1–C4.

Every row in the JSON carries at least one snippet id from the fetcher's ledger. The ledger is persisted
inside the JSON at `ledgerSources` — 23 fetched sources with 104 snippets, plus 11 attempted-and-failed
retrievals — so the evidence chain can be re-walked from that file alone. A validator run at compile time
confirmed that **every** `L##-s#` string appearing anywhere in the dossier, including inside prose notes,
resolves to a snippet that exists in the persisted ledger. It is recorded at `ledgerIntegrity`.

---

## 1 · The finding, in one paragraph

**The classical layer has one dhūpa cell, not nine.** In the grahaśānti passage that four texts share —
Yājñavalkyasmṛti 1.299, Agni Purāṇa 164.5, Nārada Purāṇa I.51.83, Garuḍa Purāṇa I.101.6 — the incense is a
single substance, **guggulu**, given to all the grahas; Vijñāneśvara's Mitākṣarā makes the distributive
reading explicit ("the all planets should be offered … incense as well as Guggulu"). The Matsya Purāṇa
recension of the same rite names **no substance at all**, only *surabhi*, "fragrant". Meanwhile, in every
one of those texts, the **samidha are enumerated graha by graha within a few verses of the dhūpa line**. One
column differentiated, the other not, one verse apart.

So the honest answer to "what incense does jyotiṣa assign to each graha?" is: **the texts read for this
round assign one incense to all of them.** The nine-cell per-planet incense grid exists only in
21st-century commercial and astrologer's web copy, which cites no text and contradicts itself.

---

## 2 · What differentiates, and what does not

| Column | Per-graha in the Tier A texts? | Evidence |
|---|---|---|
| **Dhūpa** (incense) | **No** — one substance for all nine | L01-s1, L02-s1, L02-s2, L03-s1, L04-s1, L07-s1, L08-s1 |
| Dhūpa, Matsya recension | **No** — and no substance named | L06-s1 |
| **Gandha** (scent) | **By COLOUR only**, never by substance | L01-s3, L02-s3, L03-s3, L07-s2, L08-s4 |
| **Samidha** (homa woods) | **Yes** — nine woods, in order | L01-s4, L03-s4, L06-s4, L08-s3 · *contrast only, not dhūpa* |
| **Naivedya** (food) | **Yes** (Matsya) | L06-s3 · *contrast only* |
| **Image metals** | **Yes** (BPHS, Tier C) | L11-s4 · *contrast only* |

The table is the argument. A tradition that itemises woods, foods, metals and colours graha by graha, and
does not itemise incense, is not being vague — it is telling you which distinctions it makes.

---

## 3 · Anti-conflation — three things kept apart

This round exists because merging them would make it worthless.

1. **Samidha ≠ dhūpa.** The sources separate them; so does the modern trade (a commercial navagraha
   samagrī list puts "Incense sticks" and "Havan Samidha Sticks" on *different lines* — L22-s1, L22-s2).
   In this dossier, samidha snippet ids appear **only inside notes, as named contrasts, and never in a
   row's `snippetIds`**. No homa wood is in an incense cell.
2. **Nakṣatra-vanaspati ≠ dhūpa.** Mansion trees were not in scope and none entered.
3. **Gandha ≠ dhūpa.** The classical verse names both in one line. The fullest modern "per-planet" list
   (L16) is a *perfume/scent* list, not an incense list; that is flagged on every row derived from it.

**The trap that was flagged and not walked into.** Matsya P. 93.143 (L06-s5) names candana, aguru and
kuṅkuma — but as substances *anointing palāśa sticks* in a vaśya/uccāṭana appendix, with no planetary
assignment. It is the single easiest verse in the corpus to misread as "Tier A sandalwood incense", and it
is not read as one here.

**The conflation exemplar, named so it can be recognised again.** Astroshastra's "Plants and Planets in
Indian Astrology" merges Culpeper-style European herbal magic (dragon's blood, belladonna, henbane) with
Ayurvedic material under one "Vedic" heading (L19-s1, L19-s2). It is not an entry in this dossier. Its
companion "Aroma Oils and Planets" page enumerates **Neptune, Uranus and Pluto** (L18-s3, L18-s4) and puts
Palo Santo in the Ketu cell (L18-s5) — Western correspondence under graha names. Also not an entry.

---

## 4 · The rows

**23 entries: 3 Tier A, 20 Tier C. No Tier B row, because no Tier B source in this ledger makes an
assignment.**

- **Tier A (3):** guggulu for all nine (Yājñavalkya family); the Matsya *surabhi* variant, shipped
  unmerged beside it; gandha-by-colour, which is the only genuinely per-graha fragrant cell the classical
  layer has.
- **Tier C, collective (2):** BPHS ch. 84 (sandal + guggul, undifferentiated, colour per graha) and Drik
  Panchang's modern vidhi (one dhūpa to all nine). Both *agree with the Tier A shape* — which is why they
  earn rows.
- **Tier C, per-graha (18):** the two circulating modern lists, atomised one row per source per graha, so
  no row merges two sources. Eight from the astrologer's fragrance list (Rāhu and Ketu share a cell there),
  nine from the incense manufacturer, plus one **negative cell** (substances said to displease Venus),
  kept separate because a prohibition is not an assignment.

**Ruthless about the tier, as instructed.** Every per-graha row in this dossier is C. Not one of the modern
lists names a text, an author or a locus for any cell — that is a confirmed gap with the search recorded.

---

## 5 · Where the modern lists disagree

| Graha | Cycle Pure Agarbathi (L17) | Gemstone Universe (L16) |
|---|---|---|
| Sun | sandalwood | saffron + rose |
| Moon | mogra (jasmine) | jasmine + ratrani ← **the only convergence** |
| Mars | agar / oud | red sandalwood |
| Mercury | tulasī | cardamom + champa |
| Jupiter | guggal | saffron + kevaḍā + yellow flowers |
| Venus | kastūrī (musk) | white flowers + sandalwood + camphor |
| Saturn | lavanch (vetiver) | musk + frankincense + fennel |
| Rāhu | jaṭāmāṃsī | *(merged with Ketu)* black cow ghee + musk |
| Ketu | mahua | *(merged with Rāhu)* |

They disagree about substances and about **how many cells there are**. Neither is preferred; both ship.

Two further points that bear on how much weight this layer can carry:

- **L16 contradicts itself.** It assigns rose to the Sun, jasmine to the Moon and champa to Mercury, then
  says Venus is angered by champa, jasmine and rose (L16-s7).
- **L17 gives guggal to Jupiter alone** — the substance the classical texts give to *all nine*. A grid
  that put guggulu in the Jupiter cell would reproduce a product line while appearing to reproduce a
  classical assignment. No source connects the two and this dossier does not either.

A practitioner page speaking from inside the tradition states the variance outright rather than resolving
it (L20-s1, L20-s2). That is the most honest sentence in the Tier C layer.

---

## 6 · Confirmed gaps (9), and what could still overturn this

**Confirmed absent, with the search recorded:**

- A per-graha dhūpa anywhere in the five grahaśānti passages read (four of them in full).
- Any citation, of any text, by any circulating modern per-planet list.
- Open-access Tier B scholarship on graha-worship *materials* specifically. The Tier B layer here is two
  items and neither is on this question: Bühnemann treats dhūpa as an **upacāra slot**, not a
  deity-keyed substance (L12-s2, L12-s3); the Īśānaśivagurudevapaddhati summary gives one *daśāṅga*
  incense for the deity generally and says the navagraha pūjā follows ordinary pūjā procedure
  (L13-s1, L13-s4).
- The per-graha **colours** — the one thing the Tier A layer really does differentiate. The *rule* is
  attested repeatedly; the *list* was not fetched. **A colour cell must not be filled from this dossier.**

**Probably absent:** the Bṛhatsaṃhitā (which has a whole perfumery chapter with no planetary reference,
refers the reader elsewhere for the graha rite, and differentiates incense by *class of being* rather than
by graha — L09-s1 … L09-s6); the Atharvavedapariśiṣṭas (grahayāga named, no incense list — L10-s4).

**Could not determine — the real holes:**

- **Viṣṇudharmottarapurāṇa** — GRETIL 404 on both paths. The largest unchecked text of the round.
- **Śāradātilaka, Mantramahodadhi, Bhaviṣyapurāṇa** — not in the GRETIL corpustei set. This is the layer
  *most likely* to differentiate dhūpa, because deity-specific dhūpa is routine in tantric paddhati.
- **Navagraha Vidhāna Paddhati (1857)** — public domain by date, page images online, Devanagari OCR
  unusable. **The most tractable gap in the round**: it needs a human or a working OCR pass, not a licence
  and not a paywall.

Any of these could carry a per-graha dhūpa. The headline finding is a finding about the texts that **were
read**, not about "the tradition".

---

## 7 · Contested, and kept contested

- **Dating.** Bühnemann states the Yājñavalkyasmṛti's graha chapter (vv. 270ff.) is not original to the
  work (L12-s1) — which puts the dossier's anchor verse in question at its root.
- **How many witnesses?** The Garuḍa colophon calls the passage "the grahaśānti spoken by Yājñavalkya"
  (L08-s2). This dossier uses the conservative reading: **one passage in four transmissions**, not four
  independent attestations. Frequency of attestation is evidence about transmission, never about efficacy.
- **guggulu vs surabhi.** Both ship, attributed, unmerged.
- **Is guggulu a *graha* incense at all?** The Atharvavedapariśiṣṭas use guggulu (usually with kuṣṭha) as
  the standard śānti incense in rites with no planetary content (L10-s1–s3), and the Nārada Purāṇa uses
  guggulu alone as a general dhūpa outside the graha chapter (L07-s3). On that reading the graha rite
  **inherits** the ordinary śānti incense rather than being assigned one — which would make even the
  single Tier A cell weaker than it looks. Geslani's abstract supports the general framing that
  astrological ritual adapts Atharvan śānti (L14-s1), **but only the abstract was read** (L14-s3) and he
  is cited for nothing more. Open question, not resolved.

---

## 8 · Safety, protection, and what is deliberately absent

**Three protected or threatened species sit in one nine-cell commercial list** — Aquilaria agarwood
(CITES II), musk-deer musk (CITES I/II by population, usually synthetic in commercial agarbatti) and
*Nardostachys jatamansi* (CITES II, IUCN Critically Endangered). All three flags come from the **fetcher's
annotations** at L17-s3, L17-s6 and L17-s8 — the product page itself carries no conservation notice at all.
Every other conservation or toxicity flag in the JSON is **compiler-supplied and marked UNVERIFIED IN THIS
LEDGER**: sandalwood, guggulu, red sanders (conditional on an identification the source does not make), and
camphor's ingestion toxicity. Each must be checked against a real conservation source before any shipped
page states it.

Also flagged: the conflation-exemplar page lists **belladonna and henbane** with no warning of any kind
(L19-s2).

**Deliberately absent from this file:** no quantity and no process parameter anywhere (FRAMING §5 C-1 — and
the sources read give none for the dhūpa either, so nothing was withheld that they supply); no efficacy,
medical or life-outcome claim (several Tier C sources make them; the *fact* that they do is recorded, the
claims are not); no timing or day-of-week assignment, although two Tier C sources supply them; no botanical
resolution of genuinely ambiguous vernacular names ("red sandalwood", "champa", "frankincense"), because
resolving them would manufacture precision the sources lack — and in the red-sandalwood case would also
decide whether a CITES species is involved.

---

## 9 · If this is rendered

1. **The Vedic dhūpa cell is not nine cells.** If the site renders a per-planet Vedic incense column from
   Tier A, every cell reads *guggulu* — which is truthful but visually implies nine assignments. A single
   spanning cell, or a plain sentence, is the honest form. **The asymmetry against the Western column is
   the teaching, not a defect to design around.**
2. **Nothing here may be reproduced verbatim on the site** except the Sanskrit mūla and the 1918 Vidyarnava
   English (PD by date, published Allahabad 1918). Gangadharan, Santhanam, Bühnemann and Prajith are in
   copyright and are verification-only fair quotation in the ledger; the BPHS scan is additionally of
   doubtful legitimacy as an upload.
3. **If any Tier C row ships, its label ships with it in the same field** — not adjacent to it. The whole
   point of recording the commercial lists is that the site's incense column will otherwise be filled from
   copy exactly like this, unlabelled.
4. **Do not fill a colour cell from this dossier.** The rule is attested; the list is not in this ledger.

---

## 10 · Files

- `research/vedic-materia/graha-dhupa.json` — the dossier, with the fetcher ledger persisted at
  `ledgerSources` and the sid-integrity report at `ledgerIntegrity`.
- `research/vedic-materia/graha-dhupa-notes.md` — this file.
