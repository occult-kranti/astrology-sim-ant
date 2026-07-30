# Slice 13 — East Asian operative literature: working notes

Companion to `13-east-asian.json`. Round date per brief: 2026-07-17.
Repo read-only; nothing written outside the scratchpad.

---

## 1. What the slice actually contains

17 work nodes, 49 work×procedure-type rows, 36 edge rows (34 real + 2 deliberate
negative-result rows). Seven works reuse an atlas slug that already ships; ten are new.

| group | works |
|---|---|
| Daoist alchemy & self-cultivation | `baopuzi`, `cantong-qi`, `huangting-jing`, `ea:dadong-zhenjing`, `zhengao`, `wuzhen-pian`, `secret-of-the-golden-flower` |
| Daoist morality tract | `ea:taishang-ganying-pian` |
| Daoist liturgy & talisman corpora | `ea:wushang-huanglu-dazhai-lichengyi` (DZ 508), `ea:daofa-huiyuan` (DZ 1220) |
| Chinese Buddhist | `ea:tuoluoni-jijing` (T.901), `ea:xiuyao-jing` (T.1299), `ea:mohe-zhiguan` (T.1911) |
| Japanese mikkyō | `ea:shingon-shido-kegyo` |
| Divination procedure | `yijing` (Xici milfoil locus), `ea:yixue-qimeng`, `ea:meihua-yishu` |

Completeness: **complete 9 / partial 19 / referenced 19 / fragmentary 2**.

---

## 2. Corrections to the brief and to the repo (read these first)

1. **The Xiuyao jing is NOT atlas-linked.** The slice brief says it is. Verified this round:
   zero matches for `Xiuyao` or `Kūkai` anywhere in `assets/js/core/data/confluence.js`.
   Both appear only in `docs/plans/r28/eastern-greats.md` (#22, Tier D+, "atlas entry + one strong
   edge; Library stub") and `docs/plans/r28/ROADMAP.md:95`. Another planned≠shipped case, exactly
   as the inventory agent warned. Node minted as `ea:xiuyao-jing`.

2. **The Taishang ganying pian is not a ritual manual.** The brief groups it with
   "ritual manuals"; it is a *shanshu* morality tract. Its operative offspring is the
   merit-and-demerit ledger (*gongguoge*) genre, which I did not examine. Graded `referenced`
   with an explicit vocabulary gap, not fudged into a ritual type.

3. **`zhengao` carries `technique: null`** (confluence.js:1073) — one of the inventory agent's
   99 nulls. Filled structurally here, and graded `fragmentary`, which is more interesting than
   filling it with prose would have been.

4. **The atlas's Daoist lane has no liturgy at all.** It runs philosophical → alchemical →
   visionary (Daodejing, Neiye, Zhuangzi, Cantong qi, Baopuzi, Huangting jing, Zhen'gao,
   Wuzhen pian, Golden Flower, Yijing). There is no *zhai/jiao* node, no ritual-manual node,
   no talisman-corpus node. That is the largest structural hole this slice found, and it is
   the one that most distorts what the site currently implies Daoism *is*.

5. **The `yijing` technique field is quietly misleading.** It says the yarrow procedure
   "is described in the Great Commentary." It is described there *insufficiently to perform* —
   which is why Zhu Xi reconstructed it in 1188 and why his version, not the Xici's, is what
   everyone has used for 800 years. This is the single cheapest accuracy fix in my slice.

6. **Only `person-ge-hong` exists** among East Asian person nodes. No person-zhang-boduan,
   person-tao-hongjing, person-zhiyi, person-kukai, person-shao-yong, person-zhu-xi,
   person-yang-xi, person-amoghavajra. Eight author nodes need minting.

---

## 3. The completeness dimension — what this corpus teaches

The brief calls completeness the round's key domain variable. East Asia turns out to be an
unusually good test bed for it, because the corpus contains **four structurally different
reasons a procedure is incomplete**, and flattening them would destroy the variable.

**(a) Constitutive reticence — the text was never going to tell you.**
The *Wuzhen pian* is the exemplar: allusive regulated verse, no posture, no session structure,
no duration, no success criterion. The evidence that this is deliberate rather than accidental
is the commentarial apparatus it immediately grew — Weng Baoguang's *Wuzhen zhizhi xiangshuo
sansheng biyao* and, six centuries later, Liu Yiming's *Wuzhen zhizhi*, both titled as though
supplying what the base text withholds, and both still symbolic. Graded `referenced`.
The *Cantong qi* is the same case one step further back: it supplies an emblematic *grammar*
(trigrams, lunar-cycle fire phases) and no operations at all.

**(b) Damaged transmission — the text lost it.**
The *Zhen'gao* is the exemplar and the only clean one: Tao Hongjing physically recovered
scattered autograph manuscripts, authenticated them by handwriting, and arranged what survived.
The methods are excerpts embedded in dictations and letters. Graded `fragmentary`.

**(c) Gated transmission — the text has it but you are not initiated.**
Shingon *shidō kegyō*, the *Dadong zhenjing*'s jade formulae, the *Daofa huiyuan*'s keys,
and the officiant's silent *neilian* inside the Yellow Register liturgy. In every case the
structure is public and the content is not. This is where the operative-content razor and the
tradition's own restriction point the same direction, which is worth saying on the site: the
site is not censoring anything the tradition itself publishes.

**(d) Authorial truncation — the author stopped.**
The *Mohe zhiguan* is the exemplar and it is a beautiful case. Verified this round: seven
chapters in ten fascicles; four frameworks (25 preparatory expedients, four samādhis, ten
objects of contemplation, ten modes of contemplation). The standard account is that the ten
modes are worked out in full against only the *first* of the ten objects — a 10×10 matrix
executed in one row. Donner & Stevenson (1993) translate chapter **one** only; a complete
English translation waited until Swanson 2018. I marked the "ten chapters projected, three never
delivered" figure `(unverified)` because I did not re-derive it this round; the
7-chapters/10-fascicles figure IS verified.

**Recommendation to the synthesizer:** do not merge (a) and (b). A schema field
`incompletenessKind: constitutive | damaged | gated | truncated` alongside the grade would
carry almost all the analytic value of this round at negligible cost.

---

## 4. The strongest edges I can defend

The inventory agent found exactly one genuine procedure-propagation edge in the whole repo
(amrtasiddhi→dattatreyayogasastra, Mallinson 2020) and set it as the schema exemplar. Measured
against it, three of my edges qualify and the rest should stay work-level:

1. **`ea:du-guangting-liturgical-corpus` → `ea:wushang-huanglu-dazhai-lichengyi`.**
   Schipper & Verellen document the manual as compiled *on* the Tang liturgists Zhang Wanfu
   (fl. 711) and Du Guangting (850–933) plus the Song master Liu Yongguang. The inherited thing
   is ritual *programmes*, not doctrine. That is what makes it procedural.
2. **`ea:mahavairocana-sutra` → `ea:shingon-shido-kegyo`.** Kūkai built the three-mysteries
   practice on the Mahāvairocana-sūtra and the Vajraśekhara/Tattvasaṃgraha, which are also the
   scriptural bases of the Taizōkai and Kongōkai rites — two of the four trainings. The
   dependency is on ritual systems.
3. **`cantong-qi` → `wuzhen-pian`** (already shipped as a work-level atlas edge). My addition:
   the borrowed thing is specifically the *fire-phase timing schema*, i.e. procedural grammar,
   so this shipped edge can be legitimately upgraded rather than left as influence.

And the cross-cultural one the repo's own plan asked for:
**`ea:xiuyao-jing` → `ea:sukuyodo`**, via Kūkai's 806 import. Sukuyōdō is *named after* the
Xiuyao jing; the Japanese recension family traces back to Kūkai's copy; it competed with the
older Onmyōdō. This is the join between the site's existing jyotiṣa/nakṣatra lane and East Asia,
and it is currently missing entirely.

**Two negative-result rows are in the JSON on purpose** (`status: NEGATIVE-RESULT-ROW`):
Tuoluoni jijing→Xiuyao jing, and Baopuzi→Daofa huiyuan. Both are edges a plausible-sounding
later pass would invent. Neither is supported. They are recorded so nobody has to rediscover
that they don't exist.

---

## 5. Harm and ethics notes attached (razor compliance)

Every sensitive row carries a named harm kind. The hazard *kinds* used, which the repo currently
has no taxonomy for (inventory agent's gap #4):

- `toxic-substance` — Baopuzi, Cantong qi (mercury, arsenic, lead; documented Tang-emperor deaths,
  which the atlas already carries as an edge citing Ho & Needham).
- `allegory-misread-as-recipe` — a hazard specific to neidan and, I think, new: the *Wuzhen pian*
  itself rejects mineral elixirs as a "side gate", and the historical harm came from readers taking
  its emblems literally. The text is safer than its readership was.
- `breath-retention-hypoxia` — neidan fire phases read as breath work.
- `sleep-deprivation` + `ascetic-regimen` — the *Mohe zhiguan*'s constantly-walking and
  constantly-sitting samādhis are multi-day regimens without lying down.
- `coercion/ritual-aggression` — *Daofa huiyuan* thunder rites (subjugation/exorcism directed at
  identified malign agents). Handled on the repo's abhicāra-wing precedent: named, described,
  not reproduced, no efficacy claimed.
- `living-tradition-sensitivity` — Shingon (explicit secrecy, initiation gating; the r28 plan
  already flags "Shingon institutional sensitivity"), Zhengyi/Quanzhen liturgy, T.901 initiation.
- `mortuary-sensitivity` — Yellow Register retreat, Zhen'gao netherworld material.
- `fire-hazard` — goma.
- `reception-distortion` — the Golden Flower's Wilhelm/Jung reframing (the atlas already has
  `event-golden-flower-1929`; the inventory agent notes it duplicates the work's technique field).

Nothing in the JSON reproduces: mantra or dhāraṇī syllables, elixir ingredient quantities or
firing schedules, talisman graphs or seal designs, mudrā execution, yarrow arithmetic, or any
second-person instruction. Structure, stage counts, stage names, and citation loci only.

---

## 6. Public-domain verdicts (this round)

**PD and usable:**
- Legge, *The Yî King*, SBE 16 (1882) — the site's usable Yijing base text.
- Legge, *The Texts of Taoism* Part II, SBE 40 (1891) — contains the Taishang ganying pian.
- Suzuki & Carus, *T'ai-Shang Kan-Ying P'ien* (Open Court, 1906).
- All Chinese base texts (Daozang, Taishō source texts) as texts.

**In copyright — cite-only:**
- Ware 1966 (Baopuzi) — and note Kroll's criticism; not a neutral base text.
- Pregadio's editions (Cantong qi 2011, Wuzhen pian 2009, Great Clarity 2006).
- Kohn (ed.), *The Yellow Court Scripture* vols 1–3 (2023–25).
- Bokenkamp 2021 and Smith 2013 (Zhen'gao).
- Donner & Stevenson 1993; Swanson 2018 (Mohe zhiguan).
- Hakeda 1972 (Kūkai) — "no PD English, say so" verdict **inherited** from the r28 plan, not re-derived.
- Yano, *Mikkyō senseijutsu* (Japanese).
- Adler 2002 (Yixue qimeng) — author-hosted PDF at kenyon.edu is citable.
- Wilhelm/Baynes 1950 (I Ching) — do not quote at length.

**Unresolved:** Wilhelm 1929 German Golden Flower and Baynes 1931 English — US renewal status
not checked this round, marked `(unverified)`. Wu & Davis 1935 / Davis & Ch'en 1941 partial
Baopuzi translations — probably PD as pre-1964 periodical matter, renewal unchecked.

---

## 7. Where I am weakest (declare before the auditor does)

- **`ea:meihua-yishu` is the weakest node in the file.** Repeated searches returned only
  commercial divination sites, a GitHub LLM-prompt repo, and a Baidu-derived encyclopedia.
  I found *no* scholarly treatment of the text's compilation history. The Shao Yong attribution
  is recorded as contested with two positions, but I could not source the sceptical position to
  a named scholar this round. **Ship this node marked thin, or hold it.**
- **Brill 403'd** on Mak's chapter on the two Xiuyao jing recensions; MDPI 403'd on Kotyk's
  mikkyō-astronomy article. Both are cited from search abstracts plus corroborating sources.
  The 759/764 dates, Shi Yao and Yang Jingfeng, T.1299, and Kūkai's 806 import are corroborated
  across more than one result; the recension *details* are not.
- **DZ numbers**: DZ 508 and DZ 1220 are verified this round; the Huangting jing and Dadong
  zhenjing DZ numbers are marked `(unverified)` because I did not re-derive them.
- **T.901 coercive rites** are graded `referenced (unverified)` with a prospective harm flag.
  The four/fivefold ritual-aim classification (pacifying, increasing, subjugating…) is standard
  in dhāraṇī literature, but I did not verify that T.901 specifically sets out subjugation rites.
  Flagged so a later pass cannot ship it without the note.
- **Chinaknowledge.de SSL-handshake-failed**, so the Baopuzi chapter list rests on Wikipedia
  (tertiary). The 20 titles are trivially cross-checkable and I would not defend anything more
  than the list from that source.

---

## 8. Not covered — the honest remainder of my slice

- **Tendai proper beyond the Mohe zhiguan**: no Taimitsu node, no Ennin/Enchin, no *shikan* manuals.
- **Zhiyi's shorter meditation manuals** (*Xiao zhiguan*, *Liumiao famen*) — where much of the
  Mohe zhiguan's missing practical apparatus actually lives. A real gap in my grading.
- **The *gongguoge* ledger literature** — the operative half of the Taishang ganying pian's story.
- **Lingbao *wufu xu*** and the early talisman-and-register literature; **Zhengyi ordination
  registers (lu)** — the whole initiation layer that the liturgical manuals presuppose.
- **Shangqing subsidiaries**: *Ziyang zhenren neizhuan*, *Laozi zhongjing*.
- **Neidan between the Wuzhen pian and the Golden Flower**: Zhong-Lü corpus, *Zhonghe ji*,
  Quanzhen patriarchal writings.
- **Chinese Buddhist dhāraṇī sūtras individually** — Nīlakaṇṭha/Great Compassion, Uṣṇīṣavijayā,
  Mahāpratisarā. I modelled only the T.901 compendium.
- **Shugendō, Onmyōdō, Nichiren daimoku, Pure Land nianfo, Chan/Zen sitting manuals**
  (Zongze's *Zuochan yi*, Dōgen's *Fukanzazengi*) — the last of these is adjacent to atlas
  material the repo already has via Dōgen and should be checked against a neighbouring slice
  before anyone mints it here.
- **Chinese divination beyond the three I took**: *Liuren*, *Qimen dunjia*, *Ziwei doushu*,
  *Taiyi*, bone/turtle-shell pyromancy, the *Jiaobei* moon blocks. The site already computes
  some divination engines (inventory agent's `div:` namespace); a de-duplication pass against
  those is needed before any of this ships.

---

## 9. One framing suggestion for the site

The East Asian material makes a point the site's "described never prescribed" framing can
actually *use*, rather than merely comply with. Across this slice, the texts that look most like
manuals mostly are not: the *Cantong qi* is a grammar, the *Wuzhen pian* is poetry, the
*Huangting jing* is a chanted inventory, the *Xici* is elliptical enough that Zhu Xi had to
rebuild it. The genuinely complete procedures in my slice are a Song funeral liturgy, a Tang
dhāraṇī compendium's altar rites, and a Neo-Confucian's reconstruction of a divination method —
none of them the texts a Western reader expects. "The famous esoteric classics mostly withhold
their procedures, and the tradition says so itself" is both true and better history than the
usual framing, and it is arrived at from the evidence rather than asserted as policy.
