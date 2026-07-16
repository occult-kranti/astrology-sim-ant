# Playlist Inventory — "Astrology Classes" (Vasishtha Astrologer)

**Prepared for:** The Astrologer's Workbench, R28 planning round (inventory deliverable, plan-only — nothing written to the repo)
**Date compiled:** 2026-07-16
**Playlist URL:** https://www.youtube.com/playlist?list=PLhW2FBQMfxKBRvThR7xqe3mwY7ZNU0Iki

---

## 1. Identification

| Field | Value | Evidence |
|---|---|---|
| Playlist title | **"Astrology Classes"** | `pageTitle` in `ytInitialData` of the playlist page (fetched 2026-07-16) |
| Channel | **Vasishtha Astrologer** (`@vasishthaastrologer583`, channel ID `UCRQAp5DbT6ZvpZGArXHPeOw`) | playlist header metadata ("by Vasishtha Astrologer") in `ytInitialData` |
| Teacher | **"Dr. Vasishtha"** — self-described "specialization- Mathematics, Astrology & Vastu". No fuller name, credentials, institution, or verifiable biography is published anywhere I could find. | channel About text, quoted in full in §2 |
| Channel stats | 27.3K subscribers; 3,734,728 total views; 157 videos on the channel; joined Aug 12, 2014 | `aboutChannelViewModel` in channel About page `ytInitialData` (2026-07-16) |
| Contact | vasishthastrologyclasses@gmail.com | description of the promo video "Learn Astrology" (`EjJwno-BxRQ`, playlist position 42) |
| Other presence | Facebook page "Vasishtha Astrology Classes" (@vasishthastrolger) | [facebook.com/vasishthastrolger](https://www.facebook.com/vasishthastrolger/), surfaced by web search |
| Playlist size **now** | **132 videos** at enumeration (2026-07-16). **VERIFIER CORRECTION (adversarial pass, 2026-07-16, later fetch):** the live playlist page now reports **133 videos** — one entry beyond the 132 enumerated. The most plausible extra is the un-numbered channel short "Retrograde planets in a birth chart #astrology#horoscope" (uploaded 2026-03-15, visible in the channel uploads feed but absent from the table below); its playlist position is unverified. (The task brief said 113 — the playlist has simply grown; the first 113 entries are included in the 132 recovered.) | full enumeration below; count re-checked against the live playlist page by the verifier |

**Recovery score: 132 of 132 entries recovered as of the 2026-07-16 enumeration snapshot, including all of the original 113 — but the live count is now 133 (see the verifier correction above), so the table currently covers 132/133 ≈ 99.2% of the playlist.** No titles below are invented; every title is quoted verbatim from YouTube metadata.

> **VERIFIER SPOT-CHECK (adversarial pass, 2026-07-16):** 10 of 10 sampled video IDs — positions 1 (`kY0mU8ycYIU`), 7 (`36RT3IlLqlk`), 33 (`bKIAAB6DnKA`), 42 (`EjJwno-BxRQ`), 72 (`-ya08gHSlj0`), 113 (`xonO9ZJT1gE`), 114 (`W9clb6Q6jQQ`), 122 (`HEDFM4XgxpM`), 126 (`u5ltbnnCQrc`), 132 (`QUqqelTAn28`) — returned exactly the titles listed below (verbatim, including the "Yogkarka" typo and the double space in "Classes -  6" per the playlist RSS feed). oEmbed attributes the checked videos to **"Vasishtha Astrologer"** (`@vasishthaastrologer583`); the playlist page title "Astrology Classes", channel ID `UCRQAp5DbT6ZvpZGArXHPeOw`, and the channel's 2014-08-12 join date were all re-confirmed. Note: several videos return HTTP 401 from oEmbed (embedding disabled), which explains the inventory's oEmbed failure — their titles were verified from the watch pages instead. No invented titles found.

### How the list was recovered (method, reproducible)

1. `curl` of the playlist page → `ytInitialData` JSON embedded in the HTML → 100 `lockupViewModel` entries (positions 1–100) with exact titles, video IDs, and durations.
2. The embedded continuation token was POSTed to the public InnerTube endpoint (`/youtubei/v1/browse`) → the remaining 32 entries (positions 101–132). No further continuation token was returned, confirming the list is complete.
3. YouTube's oEmbed endpoint returned HTTP 401 for the playlist URL (strategy 1 failed); strategies 2's raw-HTML parse succeeded, so forum/syllabus reconstruction (strategies 3–4) was not needed for the list itself.
4. For the 48 videos whose titles are generic ("Vedic Astrology Classes - N"), each video's **watch page** was fetched and its `shortDescription` extracted — the teacher consistently writes "Session N — <topic>" in the description, which recovers the lesson topic from the teacher's own words. These topics are quoted in the table (column 5) and are **metadata quotes, not inferences**. Only two entries required inference (flagged in §5).

---

## 2. The teacher's school / lineage / system

**Assessment: a generalist modern North-Indian Parāśari (BPHS-derived) presentation — not KP, not Jaimini, not Nadi, not a named lineage.** This is an **inference from the technical vocabulary of the course**, since the teacher nowhere states a lineage, guru, or source text. Evidence:

- The channel's full About text (quoted verbatim): *"Vedic Astrology is not only interesting but it also helps in solving a no. of complicated issues related to human life. This 'Astrology Channel' is set up by Dr. Vasishtha (specialization- Mathematics, Astrology & Vastu) to share with you lessons in Vedic Astrology. These lessons are designed in simple, systematic & easy to learn format, using a no. of examples and case studies for better understanding and decision making. Certain important tips are also shared which are otherwise hard to find in astrology books or tutorials. Watch, learn & experience the joy of unfolding the mysteries."* — no lineage claim, and note the marketing framing ("solving… complicated issues", "unfolding the mysteries") which the Workbench's honest-science layer must not reproduce as fact.
- The syllabus is the classical Parāśara curriculum in the standard modern order: grahas → karakatvas (karak grahas) → rāśis → bhāvas → house lords → graha bala (exaltation/debilitation, combustion, retrogression) → naisargika maitrī (natural friendship) → planet-in-house delineations for all 12 houses → house classifications (kendra/trikoṇa, trika, triṣaḍāya/upachaya, māraka, kendrādhipati doṣa) → yogas (Budha-Āditya, Gaja-Kesarī, Dhana, Rāja, Vipreet Rāja incl. Harṣa/Sarala/Vimala, Nīca-bhaṅga).
- Every one of those categories is a chapter topic of *Bṛhat Parāśara Horā Śāstra* and its modern derivative literature (e.g. B.V. Raman's and KN Rao-school primers). None of the marker vocabulary of rival systems appears anywhere in 132 titles + 48 descriptions: no KP sub-lords/Placidus/ruling planets, no Jaimini chara karakas/arudhas/rashi drishti, no nadi-leaf claims, no Lal Kitab remedial framing.
- Both **North Indian and South Indian chart formats** are taught (sessions 22–24), and the sign/planet attributions taught (varṇas, tridoṣas, gemstones/metals/colours, day/number/tree rulerships in sessions 4–6) are the standard popular-Jyotiṣa correspondence sets.
- CONTESTED note for later encoding: several of the course's core doctrines are themselves contested inside the tradition (e.g. exact rules of kendrādhipati doṣa, whether Gaja-Kesarī requires additional strength conditions — the teacher's own session 124 "Is Gajkesari Yoga Effective…" signals he engages that debate; nīca-bhaṅga cancellation conditions differ across BPHS, Phaladīpika and Jātaka Pārijāta). Any Workbench module sourced to this playlist must cite the primary texts, not the videos, and flag those disagreements.

## 3. The teacher's stated sources / books

**None discoverable.** No video description among the 48 fetched cites any text, edition, or author; the channel About cites none; web search for a published syllabus or book by this teacher found only the channel itself, its Facebook page, and unrelated similarly-named businesses ([Vasishtha Astro Guide](https://vasishthaastroguide.com/) and [Vasista Samsthaan](https://kumarvasist.com/) appear to be **different, unaffiliated** operations — no evidence links them to this channel). The teacher explicitly positions the videos as an alternative to books ("tips… otherwise hard to find in astrology books"). For Workbench purposes this playlist is therefore a **teaching-order witness only** — every factual claim needs independent grounding in citable editions (BPHS trans. R. Santhanam, Ranjan Publications; Phaladīpika trans. S.S. Sareen; B.V. Raman, *How to Judge a Horoscope*, etc.).

---

## 4. Full recovered inventory (132/132)

Column 1 is the **playlist position**; the teacher's own class/session number is embedded in the title and drifts from position between positions 33–42 (see §5). Column 5 quotes the topic line from the video's own description where the title alone is uninformative (empty = title is already descriptive).

| # | Exact YouTube title | Video ID | Length | Topic (from the video's own description, where the title is generic) |
|---|---|---|---|---|
| 1 | Vedic Astrology Classes - 1 | `kY0mU8ycYIU` | 8:45 | Session 1 - Introduction to Vedic Astrology/Hindu Astrology/Indian Astrology/Jyotish Shastra |
| 2 | Vedic Astrology Classes - 2 | `v903QcfeKgo` | 6:37 | Vedic Astrology  / Session 2 - Planets, Stars and Rashis |
| 3 | Vedic Astrology Classes - 3 | `C7USR_Tdaa4` | 7:17 | Vedic Astrology Classes / Session 3 - Planetary motion and characteristics of planets |
| 4 | Vedic Astrology Classes - 4 | `8Ehj81bqKdM` | 4:01 | Vedic Astrology  / Session 4 - Varnas, Elements, Gender and Tridoshas |
| 5 | Vedic Astrology Classes - 5 | `zNZUAxjnNnY` | 3:58 | Vedic Astrology Classes / Session 5 - Movable planets, numbers/days/trees ruled by planets |
| 6 | Vedic Astrology Classes -  6 | `vNrL3bugOnw` | 3:45 | Vedic Astrology Classes / Session 6 - Colour, stones and metals |
| 7 | Planets and Humans - Vedic Astrology Classes - 7 | `36RT3IlLqlk` | 3:05 | Vedic Astrology Classes / Session 7 - Planet governance and human relations |
| 8 | Vedic Astrology Classes - 8 | `StOMlKOr8_k` | 6:04 | Vedic Astrology  / Session 8 - Natural Behaviour of Planets |
| 9 | Vedic Astrology Classes - 9 | `pNoYXy-xgos` | 7:08 | Vedic Astrology / Session 9, Planets as Significators (Karak Grahas) |
| 10 | Vedic Astrology Classes - 10 | `mgUcaWkmLEo` | 7:38 | Session 10, Planets as Significators (Karak Grahas) contd |
| 11 | Vedic Astrology Classes - 11 | `7vhdfTuhAVA` | 4:31 | Session 11, Planets as Significators (Karak Grahas) Venus & Saturn contd |
| 12 | Vedic Astrology Classes  - 12 | `uggSf0K4LVc` | 5:36 | Vedic Astrology / Session 12, Planets as Significators (Karak Grahas) Venus & Saturn contd |
| 13 | Vedic Astrology Classes - 13 | `fvugtaTahbk` | 12:31 | Vedic Astrology / Session 13, Twelve rashis in vedic astrology |
| 14 | Vedic Astrology Classes - 14 | `SMnlUT0AZYk` | 5:31 | Vedic Astrology / Session 14, Important Characteristics of Rashis |
| 15 | Vedic Astrology Classes - 15 | `bhhzWug83gA` | 5:06 | Vedic Astrology / Session 15, Important Characteristics of Rashis contd.(Signs & elements, Castes) |
| 16 | Vedic Astrology Classes - 16 | `KW9stZySe_w` | 4:51 | Learn Astrology / Session 16, Important Characteristics of Rashis contd.(Signs & body type, benefic & malefic signs) |
| 17 | Vedic Astrology Classes - 17 | `pv0YxVrV27U` | 4:11 | Vedic Astrology Lessons / Session 17,.Divabali & Ratribali /Shirshodaya &Prishthodaya/ Dwipad & Chatushpad Rashis |
| 18 | Vedic Astrology Classes - 18 | `jRl4RmREWos` | 4:43 | Learn Astrology / Session 18, Sun in 12 signs (rashis) |
| 19 | Vedic Astrology Classes - 19 | `OLeDR3eCdF4` | 6:49 | Vedic Astrology Lessons / Session 19,Sun Sign, Ascendant and moon Sign. lagna & rashi |
| 20 | Vedic Astrology Classes - 20 | `mAENo-PXk5Q` | 5:55 | Vedic Astrology Lessons / Session 20, Names assigned to 12 houses in vedic astrology |
| 21 | Vedic Astrology Classes - 21 | `XxRgNYFR82w` | 3:52 | Vedic Astrology Lessons / Session 21, Names assigned to 12 houses in vedic astrology |
| 22 | Vedic Astrology Classes - 22 | `SHmlLfohc_I` | 5:52 | How to read birth chart in Vedic Astrology(North Indian) / Session 22, |
| 23 | Vedic Astrology Classes - 23 | `Z1ODswO3G_A` | 4:16 | How to read birth chart in Vedic Astrology(South Indian). / Session 23 |
| 24 | Vedic Astrology Classes - 24 | `PpNO8jAxnTw` | 6:49 | Major differences between N. Indian and S. Indian Birth Charts / Session 24 |
| 25 | Vedic Astrology Classes - 25 | `R0jXfm3dpwI` | 6:44 | Lords of 12 houses in a birth chart. / Session 25 |
| 26 | Vedic Astrology Classes - 26 | `gk5GTZ2O0L8` | 5:15 | How to address Lords of 12 houses in a birth chart. / Session 26 |
| 27 | Vedic Astrology Classes - 27 | `6S14DCj1b78` | 8:01 | Exaltation & Debilitation of planets in Vedic Astrology. / Session 27 |
| 28 | Vedic Astrology Classes - 28 | `jEd06DjsIIs` | 6:22 | Strong and Weak planets in Vedic Astrology. / Session 28 |
| 29 | Vedic Astrology Classes - 29 | `d-RedDHVuTQ` | 5:55 | Strong and Weak planets in Vedic Astrology-Combust Planets. / Session 29 |
| 30 | Vedic Astrology Classes - 30 | `XVNRmHhNsPI` | 6:13 | Retrograde Planets. Strong and Weak planets in Vedic Astrology / Session 30 |
| 31 | Vedic Astrology Classes - 31 | `A6z6D4UMtcs` | 5:53 | Astrology / Session 31. Naisargic Mitra |
| 32 | Vedic Astrology Classes - 32 | `cAaR2WJfZPc` | 8:46 | Session 32 |
| 33 | Vedic Astrology Classes - 34 First House of a birth chart | `bKIAAB6DnKA` | 7:25 |  |
| 34 | Vedic Astrology Classes - 35 Sun in First House of a birth chart | `N1sQGCPJiBA` | 8:26 |  |
| 35 | Vedic Astrology Classes - 36 | `A8w6ZPTwY_s` | 5:00 | Mercury, Jupiter and Venus in First House / Session 36 |
| 36 | Vedic Astrology Classes - 37 | `7QnQEq_J5N0` | 6:47 | Astrology - Session 37. Saturn, Rahu & Ketu in first house |
| 37 | Second House in Astrology Vedic Astrology Classes - 38 | `DRTntqD0wgA` | 4:03 |  |
| 38 | Vedic Astrology Classes - 39 | `65KeJNpSsvI` | 6:47 | Sun in Second House in Astrology, Moon in second house in Astrology ... / Session 39 |
| 39 | Vedic Astrology Classes - 40 | `osD5LHPvth0` | 4:13 | Jupiter in Second House / Session 40 |
| 40 | Vedic Astrology Classes - 41 | `bPnXGi2AggM` | 3:36 | Saturn in Second House / Session 41 |
| 41 | Vedic Astrology Classes - 42 | `TdwdlB2n2fs` | 4:00 | Third House in Astrology / Session 42 |
| 42 | Learn Astrology | `EjJwno-BxRQ` | 0:23 | The most convenient and simple way to learn Astrology-  Vedic Astrology/Hindu Astrology/Indian Astrology/Jyotish Shastra. / Email ID - vasishthastrologyclasses@gmail.com |
| 43 | Vedic Astrology Classes - 43 | `8yR4jVMu57c` | 5:45 | Third House in Birth Chart / Session 43 |
| 44 | Vedic Astrology Classes - 44 | `QdQr5o3D-kk` | 6:54 | Session 44. Mars in third house. Mercury in third house |
| 45 | Vedic Astrology Classes - 45 | `Xl1vV9LUR0g` | 5:12 | Jupiter in Third House / Session 45 |
| 46 | Vedic Astrology Classes - 46 | `DobDPchUcI4` | 3:48 | Session 46. Rahu & Ketu in third house in astrology |
| 47 | Vedic Astrology Classes - 47 Fourth House of a birth chart | `B5Ky1_mXivc` | 2:38 |  |
| 48 | Vedic Astrology Classes - 48 Fourth House | `uAvNGFNQhz8` | 6:43 |  |
| 49 | Vedic Astrology Classes - 49 Fourth House | `kLkXRLxJNtw` | 5:27 |  |
| 50 | Vedic Astrology Classes - 50 Fourth House | `wv8ivwUl7L8` | 5:53 |  |
| 51 | Vedic Astrology Classes - 51 Fourth House | `0xCzbyQr1PM` | 4:58 |  |
| 52 | Vedic Astrology Classes - 52 Fifth House | `nbL06w-z7HE` | 2:21 |  |
| 53 | Vedic Astrology Classes - 53 Fifth House | `sTsnim1nGqg` | 5:30 |  |
| 54 | Vedic Astrology Classes - 54 Fifth House | `38dZuvKvKgY` | 6:27 |  |
| 55 | Vedic Astrology Classes - 55 Fifth House | `jIbiF6GzG2M` | 7:24 |  |
| 56 | Vedic Astrology Classes - 56 Fifth House | `EOu6_t-paWs` | 7:42 |  |
| 57 | Vedic Astrology Classes - 57 Sixth House | `IgebOGXLrvc` | 3:13 |  |
| 58 | Vedic Astrology Classes - 58 Sixth House | `UAT-xi1IgXQ` | 6:01 |  |
| 59 | Vedic Astrology Classes - 59 Sixth House | `QNkntgfmscw` | 6:02 |  |
| 60 | Vedic Astrology Classes - 60 Sixth House | `zEGCGd-vEqw` | 5:53 |  |
| 61 | Vedic Astrology Classes - 61 Sixth House | `pAntMiTacNQ` | 5:26 |  |
| 62 | Vedic Astrology Classes - 62 Sixth House | `WVBT3N_TbPI` | 5:39 |  |
| 63 | Seventh House in Astrology/Vedic Astrology Classes - 63 | `KHsEV1qAuLM` | 6:25 |  |
| 64 | Vedic Astrology Classes - 64 Seventh House in Astrology | `ermZ86HTO3s` | 4:32 |  |
| 65 | Vedic Astrology Classes - 65 Seventh House | `tPAKd8s9V4U` | 4:25 |  |
| 66 | Vedic Astrology Classes - 66 Seventh House | `Uw3w9fM3UJk` | 6:37 |  |
| 67 | Vedic Astrology Classes - 67 | `wFfpQSn6km8` | 5:25 | Mercury in Seventh House / Session 67 |
| 68 | Vedic Astrology Classes - 68 | `hj5NkrIK3UY` | 4:14 | Jupiter in Seventh House / Session 68 |
| 69 | Vedic Astrology Classes - 69 | `GliChnTQMtA` | 4:59 | Venus in Seventh House / Session 69 |
| 70 | Vedic Astrology Classes - 70 | `B8lRjIghcuM` | 4:45 | Saturn in Seventh House / Session 70 |
| 71 | Vedic Astrology Classes - 71 | `2UL_hEqzPdg` | 5:00 | Rahu in seventh house. Ketu in seventh house / Session 71 |
| 72 | Eighth House in Astrology/Vedic Astrology Classes - 72 | `-ya08gHSlj0` | 4:49 |  |
| 73 | Sun in Eighth House in Astrology/Vedic Astrology Classes - 73 | `V0qAo8TLG7Y` | 3:14 |  |
| 74 | Moon in Eighth House in Astrology/Vedic Astrology Classes - 74 | `mZNv6UUe4I4` | 3:48 |  |
| 75 | Mars in Eighth House in Astrology/Vedic Astrology Classes - 75 | `9D5XGBM14jI` | 7:02 |  |
| 76 | Mercury in Eighth House in Astrology/Vedic Astrology Classes - 76 | `--QWqLGSdys` | 4:25 |  |
| 77 | Jupiter in Eighth House in Astrology/Vedic Astrology Classes - 77 | `_lL5qn7cwIE` | 6:25 |  |
| 78 | Venus in Eighth House in Astrology/Vedic Astrology Classes - 78 | `JgTogGO4RTU` | 5:36 |  |
| 79 | Saturn in Eighth House in Astrology/Vedic Astrology Classes - 79 | `OOvIhXmcW3o` | 5:30 |  |
| 80 | Rahu in Eighth House in Astrology/Vedic Astrology Classes - 80 | `H81uFkA3aA0` | 6:11 |  |
| 81 | Ketu in Eighth House in Astrology/Vedic Astrology Classes - 81 | `HoPu5ujvnKU` | 4:23 |  |
| 82 | Ninth House in Astrology/Vedic Astrology Classes - 82 | `pI1KDb9xFXE` | 3:43 |  |
| 83 | Ninth House in Astrology/Vedic Astrology Classes - 83 | `qyPtIGTSQxA` | 2:05 |  |
| 84 | Moon in Ninth House in Astrology/Vedic Astrology Classes - 84 | `yLclW7KjQgg` | 7:44 |  |
| 85 | Vedic Astrology Classes - 85 Ninth House in Astrology | `45FQkpR-298` | 6:19 |  |
| 86 | Vedic Astrology Classes - 86 Ninth house in Astrology | `JlfGX_53edo` | 6:28 |  |
| 87 | Vedic Astrology Classes - 87 Ninth House in Astrology | `_aDpo9vhWVI` | 8:41 |  |
| 88 | Venus in 9th House in Astrology. Vedic Astrology Classes - 88/Ninth House | `YycyWqzHSgw` | 8:21 |  |
| 89 | Saturn in 9th House in Birth Chart. Vedic Astrology Classes - 89 | `RZJjRQDCdN0` | 7:09 |  |
| 90 | Rahu in 9th House in Astrology. Vedic Astrology Classes - 90 | `ag4VHwEit3M` | 4:13 |  |
| 91 | Ketu in 9th House in Astrology, Ninth House/Navam Bhava. Vedic Astrology Classes - 91 | `-2GQMSAYlmQ` | 5:15 |  |
| 92 | 10th House in Astrology(Tenth House), Dasham Bhava(Karma Bhava). Vedic Astrology Classes - 92 | `v0rmdzWeuEc` | 5:10 |  |
| 93 | Sun in 10th House in Astrology Sun in tenth house in a Birth Chart, Vedic Astrology Classes - 93 | `RI4ehoeP9Vg` | 5:54 |  |
| 94 | Moon in 10th House Moon in tenth House in Astrology in a Birth Chart. Vedic Astrology Classes - 94 | `Kb5GASC3VU8` | 7:39 |  |
| 95 | Mars in 10th/Tenth House: Vedic Astrology Classes - 95. Mars in tenth house in horoscope | `x7KvYhm5YiQ` | 6:24 |  |
| 96 | Mercury in 10th House, Mercury in Tenth House in Birth Chart Vedic Astrology Classes - 96 | `FmqS_n_6gtY` | 6:48 |  |
| 97 | Jupiter in 10th House, Jupiter in Tenth house in Birth Chart Vedic Astrology Classes - 97 | `-YupPn8EYpE` | 7:08 |  |
| 98 | Venus in 10th House in Birth Chart Venus in 10th house Venus in  Vedic Astrology Classes - 98 | `NMRbP5LrKac` | 7:28 |  |
| 99 | Saturn in10th House in Birth Chart Saturn in Tenth House Vedic Astrology Classes - 99 | `YrKig3plEQY` | 9:52 |  |
| 100 | Rahu in 10th House, Rahu in tenth house Vedic Astrology Classes - 100 | `uCuj2o9yiVI` | 8:53 |  |
| 101 | Ketu in 10th House, Ketu in tenth house Vedic Astrology Classes - 101 | `v-tJ_MWU5BM` | 8:19 |  |
| 102 | Eleventh House in Vedic Astrology. Vedic Astrology Classes - 102 | `mougbG_vsrQ` | 3:24 |  |
| 103 | Sun in Eleventh House in Vedic Astrology. Vedic Astrology Classes - 103 | `PT5aPcZsSbY` | 9:27 |  |
| 104 | Moon in Eleventh House in Vedic Astrology. Vedic Astrology Classes - 104#horoscope #birthchart | `3XIIldGIpSI` | 10:32 |  |
| 105 | Mars in Eleventh House in Vedic Astrology.Vedic Astrology Classes -105, Mars in 11th house Astrology | `f5mWAMsBBM0` | 8:25 |  |
| 106 | Mercury in Eleventh House, Mercury in Eleventh House in Vedic Astrology Vedic Astrology Classes -106 | `WLKkX0Sa2Q0` | 8:11 |  |
| 107 | Jupiter in Eleventh House in Astrology, Jupiter in 11th House, Vedic Astrology Classes -107 | `8Fer6sJ5ZH0` | 14:01 |  |
| 108 | Venus in Eleventh House in Astrology. #Venus in Astrology. Vedic Astrology Classes - 108 #horoscope | `gV676DJQQg8` | 12:14 |  |
| 109 | Saturn in Eleventh House in Astrology. #Saturn in Astrology. Vedic Astrology Classes- 109 #horoscope | `Tkhhajyg1i8` | 11:41 |  |
| 110 | Rahu in Eleventh House  Astrology. Vedic Astrology Classes -110#horoscope #birthchart#lagnachrt | `94hgChxb17w` | 12:57 |  |
| 111 | Ketu in Eleventh House. Vedic Astrology Classes -111.#astro #indianastrology #horoscope #birthchart | `ZCQfKQZKqNg` | 10:36 |  |
| 112 | Twelfth House in Astrology, Twelfth House in Birth Chart, Vedic Astrology Classes -112#birthchart | `kGTjg5TYKak` | 17:49 |  |
| 113 | Kendras and Trikona Houses,Vedic Astrology Classes -113,Kendras-Trines in  Birth Chart#horoscope | `xonO9ZJT1gE` | 14:14 |  |
| 114 | Yogkarak Planets in Birth Chart,Vedic Astrology Classes -114, Yogkarka#indianastrology #horoscope | `W9clb6Q6jQQ` | 14:08 |  |
| 115 | Aspects of Planets in Horoscope, Vedic Astrology Classes -115,#vedicastrology #horoscope #kundli | `RL40iqkKCdM` | 12:31 |  |
| 116 | Trik Houses and Trik Lords in a Birth Chart, Vedic Astrology Classes -116, Trik Bhava in Horoscope | `DGyx29soh7E` | 17:13 |  |
| 117 | Trishadaya Houses   in Vedic Astrology Classes -117, Upachaya houses in  Birth Chart | `iNIPx_LzsQ4` | 16:54 |  |
| 118 | Marak Graha- Marak Planet in Birth Chart, Vedic Astrology Classes -118, Rules for Marak Grahas | `mC8y7VoUhKM` | 11:41 |  |
| 119 | Kendradhipati Dosha in Birth Chart, Vedic Astrology Classes -119, Kendra Lords in Astrology | `kLvypTx8o5A` | 13:17 |  |
| 120 | Yogas in Birth Chart, Vedic Astrology classes-120 | `v9GvoB5KK6k` | 5:05 |  |
| 121 | Budha Aditya Yoga in Birth Chart,Vedic Astrology Classes -121 | `74ZQw9ufn2M` | 14:36 |  |
| 122 | Gaj Kesari Yoga in a Birth Chart, Vedic Astrology Classes -122#horoscope | `HEDFM4XgxpM` | 7:14 |  |
| 123 | Conjunction of Planets in a Birth Chart,Vedic Astrology Classes -123#astrology #horoscope | `1zDC8xZSQ7k` | 9:02 |  |
| 124 | Is Gajkesari Yoga Effective in your Birth Chart, Vedic Astrology Classes -124#horoscope #astrology | `JEuroO1STQw` | 10:49 |  |
| 125 | Analyse a Horoscope ,Vedic Astrology Classes -125#analysis of birth chart#vedicastrology #horoscope | `9pdG7whaQqM` | 14:47 |  |
| 126 | Analyse your Birth Chart- Step by StepVedic Astrology Classes -126, Horoscope Reading#horoscope | `u5ltbnnCQrc` | 26:11 |  |
| 127 | Dhana Yoga, Vedic Astrology Classes -127, Wealth giving planets , Wealth Yoga#astrology #yoga | `RrBRXzwnufY` | 16:50 |  |
| 128 | Rajyoga in a birth chart, Vedic Astrology Classes -128, #rajyoga #horoscope #astrology | `_-_Czfl-tQI` | 14:58 |  |
| 129 | Vipreet Rajyoga in Vedic Astrology,  Vipreet Rajyoga in Birth Chart, Vedic Astrology Classes -129 | `wXtnFo7MkHU` | 9:17 |  |
| 130 | Harsha, Saral, Vimal-Vipreet Rajyoga in horoscope,Vedic Astrology Classes -130#astrology #horoscope | `JQPscBu7Ucg` | 12:33 |  |
| 131 | Retrograde planets in a horoscope, Vedic Astrology Classes -131, Vakri Grahas in birth chart | `1ndsZVgkcmU` | 17:53 |  |
| 132 | Neech Bhanga Rajyoga in horoscope, Vedic Astrology Classes - 132 #astrology #horoscope | `QUqqelTAn28` | 16:12 |  |


---

## 5. Anomalies, gaps, and inferences (flagged honestly)

1. **"Class 33" does not exist in the playlist.** Position 32 is "Vedic Astrology Classes - 32"; position 33 jumps to "…Classes - 34 First House of a birth chart". Either the teacher never published a class 33, removed it, or left it out of the playlist. **Not recovered; existence unknown.** Given class 31 covers Naisargic Mitra (natural planetary friendship) and class 34 begins the houses, the missing 33 — *if it existed* — plausibly covered temporary friendship / composite (pañcadhā) maitrī or an houses introduction. **This is an inference, not a recovered fact.**
2. **Class 32's topic is unstated.** Its description says only "Session 32." Following class 31 (Naisargic Mitra), it plausibly continues planetary friendship (e.g. tātkālika/pañcadhā maitrī). **Inference — the video would need watching to confirm.**
3. **Position 42, "Learn Astrology" (0:23),** is a channel promo/trailer, not a lesson (its description is the course advert + contact email). The course itself therefore has **131 lessons** currently.
4. **Numbering drift:** positions 33–41 carry class numbers 34–42 (offset +1 caused by the missing 33); the promo at position 42 re-aligns everything, so from position 43 onward position = class number exactly.
5. **Titles with house names but unlisted planet coverage** (positions 47–66: 4th–7th house blocks): the titles confirm the house; which planets each covers was recovered only where fetched descriptions state it (e.g. 36 = Mercury/Jupiter/Venus in 1st; 44 = Mars+Mercury in 3rd). The blocks are consistent with the same intro-then-planets pattern that is explicit in the 8th–11th house blocks. Pattern extrapolation = inference.
6. **Sparse coverage at the edges:** 2nd house gets only 4 videos (no Mars/Mercury/Venus/Rahu-Ketu titles recovered — possibly folded into "Sun in Second House… Moon in second house **…**" per its ellipsized description), and the 12th house gets a single 17:49 overview (no planet-in-12th videos exist in the playlist). Dashas, nakshatras, divisional charts, transits, and remedial measures do **not appear anywhere** in the 132 recovered titles/descriptions — the course (so far) is strictly grahas → rāśis → bhāvas → yogas.
7. **The "113 videos" of the task brief** corresponds to the playlist as of an earlier date; entry 113 is "Kendras and Trikona Houses… -113". Everything after (114–132, the house-classification and yoga material, dated by upload to the most recent period) is the growth since.

## 6. Course structure map (for later Workbench use)

| Block | Positions | Content |
|---|---|---|
| Foundations | 1–12 | intro; planets/stars/rāśis; planetary motion & characteristics; varṇas/elements/gender/tridoṣas; rulerships (numbers/days/trees); colours/stones/metals; planet–human governance; natural benefic/malefic; karak grahas (4 sessions) |
| Rāśis | 13–19 | 12 rāśis; characteristics (elements, castes, body types, benefic/malefic signs); divābalī/rātribalī, śīrṣodaya/pṛṣṭhodaya, dwipad/chatuṣpad; Sun through 12 signs; sun sign vs lagna vs moon sign |
| Chart mechanics | 20–26 | names of the 12 houses; reading North Indian and South Indian charts; differences; house lords and how to address them |
| Graha bala | 27–32 | exaltation/debilitation; strong/weak planets; combustion; retrogression; naisargika maitrī (+ unconfirmed session 32) |
| Planets in houses | 33–112 | house-by-house: 1st (34–37), 2nd (38–41), 3rd (42–46), 4th (47–51), 5th (52–56), 6th (57–62), 7th (63–71), 8th (72–81, one video per graha), 9th (82–91), 10th (92–101), 11th (102–111), 12th (112, overview only) |
| House classifications | 113–119 | kendra/trikoṇa; yogakāraka; graha dṛṣṭi (aspects); trika houses/lords; triṣaḍāya/upachaya; māraka; kendrādhipati doṣa |
| Yogas & synthesis | 120–132 | yogas intro; Budha-Āditya; Gaja-Kesarī (+ effectiveness critique); conjunctions; two full chart-analysis walkthroughs; Dhana yoga; Rājayoga; Vipreet Rājayoga (incl. Harṣa/Sarala/Vimala); retrogrades revisited; Nīca-bhaṅga Rājayoga |

**Workbench invariant note (for whichever Opus round consumes this):** if this syllabus seeds a "learn Jyotiṣa in course order" pathway or a yoga-detection module, the build must follow the locked framing — the playlist is a *historical/pedagogical witness* to how popular modern Jyotiṣa is taught, not an authority; all rules must be re-cited to BPHS/Phaladīpika editions via the accuracy-check skill, contested rules (kendrādhipati, Gaja-Kesarī conditions, nīca-bhaṅga conditions) flagged CONTESTED with both positions, remedial/gemstone material (sessions 5–6) DESCRIBED never prescribed, and any new tool wired through registry + engine-test + glossary + AI-assistant integration with core/** pure and DOM only in app/**.

## 7. Sources

- Playlist page ytInitialData, fetched 2026-07-16: https://www.youtube.com/playlist?list=PLhW2FBQMfxKBRvThR7xqe3mwY7ZNU0Iki
- InnerTube browse continuation (public endpoint, same fetch date) for positions 101–132
- 48 individual watch pages (video IDs in table) for session topics, fetched 2026-07-16
- Channel About: https://www.youtube.com/@vasishthaastrologer583/about (`UCRQAp5DbT6ZvpZGArXHPeOw`)
- [Vasishtha Astrology Classes on Facebook](https://www.facebook.com/vasishthastrolger/) — corroborates channel identity
- Web searches (2026-07-16) for "Vasishtha Astrologer", the playlist ID, and a published syllabus: no book, external syllabus, or lineage statement found; [Vasishtha Astro Guide](https://vasishthaastroguide.com/) and [Vasista Samsthaan](https://kumarvasist.com/) judged unaffiliated (name similarity only)
