# The nine samidha of the navagraha — compiler's notes

**Track:** `samidha-navagraha` · **Compiled** 2026-08-01 · **Companion data:** `graha-samidha.json`

Every claim below carries a snippet id (`sid`) from the fetcher ledger persisted in
`graha-samidha.json → ledgerSources`. **No source outside that ledger was consulted and no citation
was written from the compiler's own knowledge.** 61 snippets, 22 parent sources, 11 recorded fetch
failures. Validated mechanically before writing: every `snippetIds` value in the dossier resolves to
a ledger sid; no row ships without one.

---

## 1 · What this is, and the three things it is not

A **samidh** is fuel — a stick fed to the fire. This dossier records which samidh the texts assign to
which graha in the navagraha homa (grahayajña / grahaśānti), the Sanskrit name, the botanical
identification where the ledger supports one, and the locus.

It is **not** a list of nakṣatra trees. It is **not** a list of incense. It is **not** the navagraha
vāṭikā. Those are three separate things and merging them into one "Vedic plants" column is the single
error that would make this round worthless.

**The anti-conflation evidence is inside one witness, seven verses apart.** Yājñavalkya prescribes
nine different samidhs, graha by graha, at Yj 1.302 (`yajn-s1`) — and a *single, undifferentiated*
incense for the entire rite at Yj 1.299a: `dhūpo deyaś ca gugguluḥ`, guggulu alone (`yajn-s4`). Nine
woods, one dhūpa, same passage. Any table that prints a nine-fold incense column beside this
nine-fold samidha column has not got it from here.

The third conflation is live in the current literature and is flagged rather than used. A 2026 paper
tabulates nine planets against nine plants with a **direction of planting** for each (`ijcrt-s1`,
`ijcrt-s2`) — the navagraha **vāṭikā**, a garden. Its own bullet text says Ketu's plant is *"planted
in North West Direction"* (`ijcrt-s4`). That is about what goes in the ground, not what goes in the
fire, and it cites no Sanskrit locus for any assignment (`ijcrt-s5`). It is the most plausible-looking
source a future round will reach for, and it is the wrong one.

---

## 2 · The mainstream sequence — four Tier A witnesses, one verse

The same śloka, with trivial orthographic variation, in four independent texts:

| Witness | Locus | sid |
|---|---|---|
| Yājñavalkyasmṛti | Yj 1.302, §12 *grahaśāntiprakaraṇam* | `yajn-s1` |
| Matsyapurāṇa | MatsP 93.27 | `mats-s1` |
| Agnipurāṇa | AP 164.8 | `agni-s1` |
| Agnipurāṇa *again* | AP 167.6cd–7ab — a second, independently transmitted occurrence | `agni-s3` |
| Garuḍapurāṇa | GarP 1.101.9 | `garu-s1` |

> arkaḥ palāśaḥ khadira apāmārgo 'tha pippalaḥ / udumbaraḥ śamī dūrvā kuśāś ca samidhaḥ kramāt
> — Yj 1.302 (`yajn-s1`). *Sanskrit text ancient/PD; GRETIL e-text CC BY-NC-SA 4.0.*

`kramāt` — "in order" — refers back to a graha list, and both traditions supply it explicitly:
Yj 1.296 (`yajn-s2`) and AP 164.2 (`agni-s4`) both run **Sun · Moon · Mars · Mercury · Jupiter ·
Venus · Saturn · Rāhu · Ketu**. The Mitākṣarā gloss on v. 302 says the same in as many words —
the samidhs are "for the nine planets beginning with Sūrya in their respective order" (`vidya-s3`) —
and the translator's rubric above it names the subject as the woods the fire-sticks are made from
(`vidya-s4`), under a printed heading *"The Samidh fuel."*

So the assignment is not reconstructed. It is stated, in a public-domain 1918 translation, graha by
graha (`vidya-s1`, `vidya-s2`), and again in Dutt's 1908 Garuḍa Purāṇa (`gdutt-s1`).

**The brief's assumed sequence was right in eight places and wrong in one.**

---

## 3 · The finding that matters most: Jupiter is **pippala**, not aśvattha

Every Tier A witness in this ledger reads **pippala** at position 5 — `yajn-s1`, `mats-s1`,
`agni-s1`, `agni-s3`, `garu-s1`. Not one reads *aśvattha*. The sequence as commonly printed today
substitutes aśvattha, and the brief carried that substitution too.

Aśvattha *does* appear in a navagraha samidh verse — but in the **divergent** Atharvavedapariśiṣṭa
list, at position 7, with no graha named (`avp-s2`). That is a different list.

**And no binomial ships for Jupiter's row.** This is the place where the round could most easily have
fabricated. Everyone knows the answer. But:

- the Cologne Monier-Williams fetch for the headword **pippala** returned HTTP 429, then 403, and the
  wisdomlib mirror was not obtained for it either;
- this ledger carries *Ficus religiosa* **only** under the different headword **aśvattha**
  (`mw-asvattha`; also `bod-s5`);
- **nothing in the ledger equates pippala with aśvattha.**

Filling the cell from the aśvattha entry is completion-by-inference — the A-2 failure — on the one row
where it would be invisible. The field is left empty and says why. The PD translator's own word,
"Peepal" (`vidya-s1`), is carried in `english`, because that *is* sourced.

---

## 4 · The divergent Tier A sequence — Atharvavedapariśiṣṭa 26

Pariśiṣṭa 26 is titled **samillakṣaṇam**, "the characteristics of samidhs" (`avp-s3`), and its
planetary passage closes as a response to graha and nakṣatra affliction (`avp-s4`). Its list
(`avp-s1`, `avp-s2`):

> arkaḥ palāśo madhuko nyagrodhodumbaras tathā / plakṣo 'śvattho gomayānikuśāś ca samidhaḥ kramāt |
> yathākrameṇa samidha ādityādigraheṣu ca
> — AVPariś 26.5.6cd–5.7. *PD; Bolling & von Negelein 1909–10; GRETIL e-text CC BY-NC-SA 4.0.*

| Position | Mainstream four | AV-Pariśiṣṭa 26 |
|---|---|---|
| 1 | arka | arka |
| 2 | palāśa | palāśa |
| 3 | khadira | **madhuka** |
| 4 | apāmārga | **nyagrodha** |
| 5 | pippala | **udumbara** |
| 6 | udumbara | **plakṣa** |
| 7 | śamī | **aśvattha** |
| 8 | dūrvā | **gomaya (?)** |
| 9 | kuśa | kuśa |

Both are Tier A. Both are for the grahas. **Both ship.** Which is older, or whether either depends on
the other, is not stated by any source in this ledger and is not asserted.

### Three cautions on that table, all of them mine

**(a) No per-graha assignment beyond position 1.** The text says only *"in order, for the grahas
beginning with Āditya"* (`avp-s2`). This ledger holds **no** Atharvavedapariśiṣṭa verse enumerating
the nine grahas. Writing "Mars → madhuka" would mean importing the graha order from Yājñavalkya or
the Agnipurāṇa — a different text — into a cell this witness left unnamed. That is completion from a
parallel. So the eight rows below position 1 carry `forWhat: "position N … the graha is not
enumerated in this witness"` and mean it.

**(b) The word division is mine.** The e-text prints `gomayānikuśāś ca` as one undivided string. Read
as *gomayāni* + *kuśāḥ* it yields exactly nine items for nine grahas, which is why it is so read —
but no source in this ledger performs the division. If it is wrong, the list has eight items and the
whole alignment shifts.

**(c) On that reading, position 8 is cow-dung.** Not a tree, not a grass. "The nine sacred *woods*"
is a convenient English label that this witness breaks outright — and the mainstream list breaks it
too at positions 8 and 9, where MW glosses dūrvā as bent/panic grass (`mw-durva`) and kuśa as a
ceremonial grass (`mw-kusa`), and Dutt's translation calls them "blades" rather than twigs
(`gdutt-s1`).

**And the divergence itself is my own reading.** Geslani 2018 — the standard peer-reviewed monograph
on grahaśānti — was searched for and located only as bookseller and review pages. It was **not
obtained.** No published scholarship in this ledger compares these two sequences. The side-by-side
above is a reading of two primary e-texts by the compiler, and the fetcher explicitly instructed that
it be presented as such. It must not be cited onward as a scholarly finding.

The four fig-family woods at AVP positions 4–7 (nyagrodha, udumbara, plakṣa, aśvattha) happen to be
the same four Boddupalli & Sastri call the "naiyagrōdha samidhas" of Taittirīya Saṃhitā 3-4-8.4
(`bod-s1`), a chapter they say carries no planetary assignment (`bod-s3`). **That is an observation
about two cited lists and nothing more.** No scholar here draws the connection; no direction of
borrowing is claimed or implied.

---

## 5 · Botanical identification — where the sources disagree, both are kept

| Sanskrit | Identifications carried | Tier(s) |
|---|---|---|
| arka | *Calotropis gigantea* (`mw-arka`) | A |
| palāśa | *Butea frondosa* (`mw-palasa`) **/** *Butea monosperma* (`bod-s6`) | A / B |
| khadira | *Mimosa catechu* (`mw-khadira`) **/** *Acacia catechu* (`bod-s4`) **/** *Senegalia catechu* (`ijcrt-s2`) | A / B / C |
| apāmārga | *Achyranthes aspera* (`mw-apamarga`) | A |
| pippala | **none — see §3** | — |
| udumbara | *Ficus glomerata* (`mw-udumbara`) **/** *Ficus racemosa* (`bod-s5`) | A / B |
| śamī | *Prosopis spicigera* **or** *Mimosa suma* — MW prints both and does not choose (`mw-sami`) | A |
| dūrvā | *Panicum dactylon* (`mw-durva`) | A |
| kuśa | *Poa cynosuroides* Retz. (`mw-kusa`); MW adds "the Brāhmaṇas commonly call it darbha" | A |
| madhuka · nyagrodha · plakṣa · gomaya | **none — not obtained** | — |

Nothing here is resolved. Khadira's three names all carry the epithet *catechu* — that is an
observation about the strings, and **no source in this ledger states the three denote one taxon**, so
all three stay. Same for the two Butea names and the two Ficus names. Śamī is contested *inside
Monier-Williams itself*, and the dictionary's own hedge is preserved rather than tidied away.

Kuśa is the interesting one. MW gives *Poa cynosuroides* and notes the Brāhmaṇas call it darbha
(`mw-kusa`); the 2026 vāṭikā paper gives Ketu's plant as *Imperata cylindrica*, calling it "Darbha or
Thatch Grass" (`ijcrt-s3`, `ijcrt-s4`). Different taxon, lower tier — and, decisively, **a different
practice**: planted, not burned.

---

## 6 · Safety, stated at the limit of what the ledger supports

**arka only.** Basak et al. 2009 report that Calotropis latex contains alkaloids described as caustic
and considered poisonous (`basak-s1`), and that every affected eye in their series showed mild to
severe corneal oedema with Descemet's folds (`basak-s2`).

Two limits on that flag, both carried in-field so a renderer cannot strip them:

- **The species do not match.** The study is of *Calotropis procera*; Monier-Williams identifies arka
  as *C. gigantea* (`mw-arka`). The ledger records that both are called arka/madār and does not merge
  them.
- **Nothing in this ledger speaks to smoke, combustion or inhalation.** The finding is about latex and
  ocular contact. Extending it to a burning stick would be a claim no source here makes.

**No other row carries a toxicity flag** — which means *no source in this ledger reports on the other
eight*, not that they are safe. Empty is empty.

**No protection status ships for any row.** This ledger contains no CITES appendix, no IUCN record and
no conservation database of any kind. What can be observed from the lists themselves: none of the nine
samidha in any witness here is one of the CITES-listed aromatics the brief named — agarwood,
sandalwood, red sanders. **Those are dhūpa materials.** No witness in this ledger puts them in a
samidha list, which is one more reason the two categories stay apart.

**Carried by rule, not oversight:** no quantity, no count, no measure, no timing, no process
parameter, no efficacy or medical or life-outcome claim anywhere in the dossier.

---

## 7 · Confirmed gaps — with the evidence that someone looked

The brief named two candidate textual homes. **Both come back negative**, and that is a result.

### Bṛhat Saṃhitā — `confirmed-absent`

The full GRETIL e-text was downloaded and the complete 106-adhyāya heading list inspected. **There is
no navagraha-homa or grahaśānti chapter** (`bs-s2`). The work's only samidh list is at BS 43.12,
inside chapter 43 *nīrājanādhyāyaḥ* — the army-lustration rite — and it names **five** woods, not
nine, with no graha assignment (`bs-s1`). The passage that most resembles a per-tree effect table sits
in chapter 84, *dantakāṣṭhalakṣaṇādhyāyaḥ*, and is about **tooth-sticks** (`bs-s3`). A future round
that finds "Bṛhat Saṃhitā tree list" in a search result has found one of those two, not this one.

### The gṛhyasūtra literature — `probably-absent`, and the hedge is load-bearing

Seven gṛhyasūtras downloaded in full and grepped: **zero** hits for *grahayajña*, *navagraha*,
*grahaśānti*, *grahamakha* across all seven (`gs-sweep-s1`). The sole apāmārga hit in Āśvalāyana is at
2.7.6, non-planetary (`gs-sweep-s2`).

Śāṅkhāyana 4.17.3 *does* contain a **nine-plant handful** — śamī, palāśa, madhūka, iṣīkā, apāmārga,
śirīṣa, udumbara, kuśa, taruṇa-badarī (`sgs-s1`) — sharing six items with the navagraha lists. It
belongs to the **Āgrahāyaṇī** rite (`sgs-s2`) and carries no planetary assignment whatever. This is
the near-miss most likely to be mistaken for a hit.

**Why "probably", not "confirmed":** Pāraskara, Gobhila and Hiraṇyakeśi returned 404 from GRETIL, and
**Baudhāyana — the most-named candidate home for grahayajña — exists only as a Devanagari scan whose
OCR produced no searchable Sanskrit at all.** It could be neither confirmed nor excluded. The sweep
covers seven texts, not the corpus, and must not be reported as exhaustive.

### Other gaps recorded in the JSON

- **A nine-fold per-graha dhūpa list in the Yājñavalkya grahaśānti section** — `confirmed-absent`;
  guggulu alone (`yajn-s4`). §1 above.
- **Binomials for pippala, madhuka, nyagrodha, plakṣa** — `could-not-determine`. Cologne returned
  429/403 for ten of twelve headwords even on a throttled retry at 9–12 s spacing. **A fetch failure,
  not a finding about the lexicon.**
- **Tier B scholarship on the divergence** — `could-not-determine`. Geslani 2018 not obtained.
- **Viṣṇudharmottara, Bhaviṣya, Devī Purāṇas** — `could-not-determine`. All three 404 from GRETIL, no
  other route tried. **Their silence is untested, not established.**
- **Nakṣatra-vanaspati** — `could-not-determine`, and honestly so: *the question was never asked*.
  This track searched only for samidha. Recorded so no reader mistakes this dossier's silence for
  evidence.
- **Conservation status** — `could-not-determine`. No such source was fetched.

---

## 8 · The Tier C stratum — what it does to the list

Tier C is allowed here and a great deal of this material is Tier C. It is also, on the evidence
gathered, **lossy in both directions**, and the ledger caught it doing both.

**It drops items.** The Kanchi Kamakoti paraphrase of the Matsya Purāṇa navagraha-yajña prints
**eight** woods — and **śamī is the missing one** (`kkm-s1`), though MatsP 93.27, the verse being
paraphrased, has it (`mats-s1`). A Hindi ritual portal heads a section *"the nine plants of the
navagraha"* and then names only **eight grahas**, omitting the **Moon**, and lists Śani before Śukra
(`pp-s2`) — while the same page's samagri section carries all nine woods in the mainstream order
(`pp-s1`). One page, two lists, disagreeing with each other.

**It adds items — to a different list.** A second Kanchi Kamakoti compilation gives Arka, Palāśa,
Apāmārga, Peepul, Gular, Śamī, Dūrvā, **Bel** and **Vata** (`kst-s1`). Bel and Vata are in no Tier A
navagraha verse here; khadira is absent; and the ledger's own note records this as a **general** homa
list, not graha-assigned. Recorded as a conflation hazard, not as a variant of the navagraha nine.

**And one Tier C source documents its own unreliability, in its own words.** A ritual-guide page
instructs its writers to quote *Bṛhat Parāśara Horā Śāstra* 23.1-17 or the *Navagraha Kalpa-druma*
**"to include authority and SEO value"** (`shl-s1`) — and elsewhere asserts nine specific samidhs
without naming a single one (`shl-s2`). That is direct evidence about how citations get generated on
this stratum. **It is why no row in this dossier rests on a Tier C source alone.**

**This is a living rite, and that is also Tier C evidence.** A commercial homam set advertises that
each type of wood is associated with a particular graha — without naming which (`giri-s1`); another
vendor sells the nine as one packet; a Hindi portal states that different plants' wood and leaves are
used for each graha's śānti pūjā (`pp-s3`). Millions of people transact this. None of these sources
names a text.

---

## 9 · Manuscript variants, kept

Mitra's own footnote to Agnipurāṇa 164.8 records that mss *ga*, *gha* and *ña* read
`khadiras tv apāmārgo 'tha` against his printed `khadiro hy apāmārgotha` (`agni-s2`) — and the
Garuḍapurāṇa e-text prints **that same variant reading** (`garu-s1`). The variant is a sandhi/particle
difference; it moves no plant to a different graha. Noting that the two e-texts agree here is my
observation, not a published collation.

Lesser orthographic splits, all recorded rather than normalised: `palāśakhadirau` as a dual compound
at MatsP 93.27 against `palāśaḥ khadira` at Yj 1.302; `pālāśa` at AP 164.8; the vṛddhi **audumbara**
at MatsP 93.27 and GarP 1.101.9 against plain **udumbara** at Yj 1.302 and AP 164.8 / 167.7.

---

## 10 · Provenance quality, per source

**Byte-exact local extraction** (curl/grep or pypdf, no summarising model in the path): all GRETIL
e-texts (`yajn-*`, `mats-*`, `agni-*`, `garu-*`, `avp-*`, `bs-*`, `sgs-*`, `gs-sweep-*`), the
Vidyarnava 1918 archive.org OCR (`vidya-*`), three Cologne MW headwords (`mw-apamarga`,
`mw-udumbara`, `mw-durva`), both kamakoti PDFs (`kkm-s1`, `kst-s1`), the Boddupalli PDF (`bod-*`), the
IJCRT PDF (`ijcrt-*`), and the purabpashchim page (`pp-*`).

**Model-mediated transcription** — one remove further from the page, and flagged as such: the six
wisdomlib MW headwords (`mw-arka`, `mw-palasa`, `mw-khadira`, `mw-kusa`, `mw-sami`, `mw-asvattha`),
Dutt 1908 (`gdutt-s1`), Basak 2009 (`basak-*`), the Giri listing (`giri-s1`), the wisdomlib samidh
page (`wsam-s1`), and `agang-s1`.

**One source is quarantined.** `agang-s1` — Gangadharan's translation of Agni Purāṇa 167.7 — is **in
copyright**. Its 20-word snippet stays in the persisted ledger for verification only, **is cited by no
row**, and must not reach shipped data. The same locus is covered by public-domain Sanskrit at
`agni-s3`.

**One passage is cited by locus with no text reproduced.** Atharvavedapariśiṣṭa 36.7.1 (`avp-s5`) uses
khadira and udumbara samidhs in a **vaśīkaraṇa** rite. It is referenced only to show that these woods
are not graha-specific in the corpus. Its text appears in no dossier field, because FRAMING §5 C-5
forbids reproducing the operative sequence of a coercive rite.

---

## 11 · One note on the Devanagari

Every `devanagari` value in the JSON is a **mechanical transliteration** of the IAST the cited e-texts
print. It carries **no sid and is attributed to no source**, because GRETIL, Monier-Williams and both
public-domain translations are romanised throughout. The only byte-exact Devanagari in this ledger is
the **Hindi vernacular** naming at `pp-s1` and `pp-s2`, which sits in the `variants` fields with its
sid attached. A renderer that needs a *sourced* Devanagari form for the Sanskrit does not have one
here. This is stated in-file at `graha-samidha.json → devanagariNote` so the caveat travels with the
field rather than beside it.

---

## 12 · What a future round should do next

1. **Get Baudhāyana.** It is the most-named candidate home for grahayajña and the one text this round
   could not read. A non-DLI edition, or the TITUS text behind the Sanskrit Library catalogue record,
   would settle the gṛhya question either way.
2. **Get Geslani 2018.** Without it, the central finding of this dossier — the two-sequence divergence
   — has no scholarly backing and is flagged on every row as the compiler's own reading.
3. **Re-fetch four MW headwords** (pippala, madhūka, nyagrodha, plakṣa) once Cologne stops rate-
   limiting. Four rows currently ship without a binomial for no better reason than HTTP 429.
4. **Do not** fill Jupiter's binomial from the aśvattha entry. That is the one cell where the right
   answer and the sourced answer come apart, and it is exactly the shape of failure this protocol
   exists to catch.
