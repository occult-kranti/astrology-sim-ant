# Source data — preserved & accuracy-validated reference

This file **preserves the embedded research data** carried in the parallel handoff bundle
(`updatehandoff.bundle`, commit `ae86f52`, §7) so it survives the ephemeral container, and
adds an **accuracy-validation pass** (web-sourced, June 2026) for the highest-risk items.

Each dataset below becomes a **cited JS data module** in `assets/js/core/data/` during
Phase 1 (see `ROADMAP.md`). **Rule: every value carries provenance; discrepancies between
sources are flagged in-data, never silently resolved** (the discipline already used for the
pitted/azimene degrees in `degree-tables.js`).

> Primary sources for this whole file: Renaissance Astrology / Christopher Warnock
> (mansions, Picatrix, Behenian), Cornelius Agrippa *Three Books of Occult Philosophy* II
> (esotericarchives.com), Wikipedia "Behenian fixed star", Greer–Warnock and
> Attrell–Porreca *Picatrix* translations. Caveats below are **load-bearing — keep them.**

---

## 0. Accuracy-validation summary (this session, web-checked)

| Item | Finding | Action for the build |
|---|---|---|
| **Behenian: Alkaid vs Fomalhaut** | Alkaid **is** the canonical 15th (Agrippa/Hermes). Fomalhaut is a **Royal star**, not a Behenian; Polaris substitution is also wrong. | Ship the 15 with **Alkaid**. Offer Fomalhaut only as a clearly-flagged optional 16th (modern practice). |
| **Behenian longitudes** | Stars precess ~1°/72 yr (≈50.29″/yr). A "2020 snapshot" goes stale. | **Compute live**: store J2000 catalog longitudes, apply precession to the ecliptic of date. Don't hardcode one epoch. |
| **Star natures vary by source** | e.g. Sirius given as Jupiter+Mars *or* Venus depending on source. | Store the nature with its source; flag variants in-data. |
| **28 mansions scheme** | Tropical, **Al-Sharatain at 0° Aries**, each **12°51′26″** — confirmed across Picatrix/Agrippa/Warnock. | `mansionOf(lon)=floor(lon/12.857143)+1`. Use tropical; note the sidereal lunar-zodiac variant exists. |
| **Mansion uses** | Agrippa II.33 (brief) expanded by Picatrix I.4; Warnock is the modern authority and matches our sources. | Encode Agrippa's use + cite; add Picatrix expansion where it differs. |
| **Via combusta bounds** | Common = **15° Libra–15° Scorpio**; traditional variants 8°Lib–3°Sco. **Spica (~24° Libra) is an exception** (benefic oasis); Libra-exaltation degree likewise. | Make bounds **configurable** (default 15–15, as current code); **add the Spica exception**. |
| **Election: Moon's dispositor** | Best practice: the **ruler of the Moon's sign signifies the outcome**; weigh its condition, not just the Moon's. | Add to `election.js` checklist. |
| **Election philosophy** | "Optimization, not perfection" — a perfect chart is impossible; rank windows. | Election finder returns ranked green/amber/red windows, never demands perfection. |
| **Ephemeris adequacy** | astronomy-engine (~1′) is Swiss-Ephemeris-comparable for sign/dignity/house/aspect/cazimi. | Keep astronomy-engine. For fixed stars use proper precession; for future primary directions, Naibod is itself an approximation, so ~1′ suffices. |

Sources: [Wikipedia — Behenian fixed star](https://en.wikipedia.org/wiki/Behenian_fixed_star) ·
[Renaissance Astrology — Mansions of the Moon](https://www.renaissanceastrology.com/mansionsmoon.html) ·
[Kepler College — The Burning Way (Via Combusta)](https://library.keplercollege.org/via-combusta/) ·
[Ancient Astrology — Five Tragic Mistakes (elections)](https://www.ancientastrology.com/articles-/five-tragic-mistakes) ·
[AstroClock — Swiss Ephemeris accuracy](https://astroclock.ch/swiss-ephemeris).

---

## 1. The 28 Lunar Mansions (tropical; Mansion 1 = 0° Aries; each 12°51′26″ = 12.857143°)

`mansionOf(moonLon) = floor(moonLon / 12.857143) + 1`. Start degree of mansion *n* =
(n−1) × 12.857143°. Magical use = Agrippa Bk II.33 (Picatrix Bk I.4 expands).

| # | Start | Name | Agrippa use (brief) |
|--|--|--|--|
|1|0°00′ Ari|Al Sharatain|journeys; discord/medicines|
|2|12°51′ Ari|Al Butain|finding treasure; reconciliation|
|3|25°43′ Ari|Al Thurayya (Pleiades)|good fortune; alchemy/hunting|
|4|8°34′ Tau|Al Dabaran|revenge, separation, enmity|
|5|21°26′ Tau|Al Haq'ah|favour of kings; business|
|6|4°17′ Gem|Al Han'ah|love between two|
|7|17°09′ Gem|Al Dhira|gain; friendship; protection|
|8|0°00′ Can|Al Nathrah|victory in war; (banishing)|
|9|12°51′ Can|Al Tarf|sickness/affliction (malefic)|
|10|25°43′ Can|Al Jabhah|love; childbirth/healing|
|11|8°34′ Leo|Al Zubrah|fear, reverence; besieging|
|12|21°26′ Leo|Al Sarfah|separation of lovers; harvests|
|13|4°17′ Vir|Al Awwa|concord of married couples|
|14|17°09′ Vir|Al Simak (Spica)|divorce/separation; healing|
|15|0°00′ Lib|Al Ghafr|friendship & goodwill; treasure|
|16|12°51′ Lib|Al Jubana|merchandising/gain; (freeing captives)|
|17|25°43′ Lib|Al Iklil|protection vs thieves; lasting love|
|18|8°34′ Sco|Al Qalb (Antares)|against fevers; victory|
|19|21°26′ Sco|Al Shaulah|birth/healing; catch fugitives|
|20|4°17′ Sag|Al Na'am|taming beasts/hunting|
|21|17°09′ Sag|Al Baldah|destruction/ruin; separate spouses|
|22|0°00′ Cap|Al Sa'd al Dhabih|security of fugitives; discord|
|23|12°51′ Cap|Al Sa'd al Bula|destruction & wasting; healing|
|24|25°43′ Cap|Al Sa'd al Su'ud|multiplying herds; goodwill|
|25|8°34′ Aqu|Al Sa'd al Akhbiyah|preserve trees/harvests; separate|
|26|21°26′ Aqu|Al Fargh al Muqaddam|love & favour|
|27|4°17′ Pis|Al Fargh al Mu'akhkhar|destroy springs; obstruct building|
|28|17°09′ Pis|Al Batn al Hut|gather fish; concord of married|

**Caveat:** spellings vary (Al Sharatain/Alnath; Al Jubana/Az Zubana). Store a canonical name
+ common aliases. Add Picatrix I.4 image/spirit/suffumigation per mansion in a second pass.

---

## 2. The 36 Decan Faces

**Rulers already exist** in `dignities-data.js` (`FACES`, Chaldean order from Mars at Aries-1).
Only the **image text** must be added (Agrippa Bk II.37 / Picatrix Bk II.11,
esotericarchives.com/agrippa/agripp2c.htm). Examples: Aries-1 (Mars) a dark man, red eyes,
standing, angry → boldness/fortitude; Aries-2 (Sun) a woman in red & white → dominion;
Cancer-1 (Venus) a crowned virgin → love/subtlety; Scorpio-1 (Mars) a woman troubled by two
men → strife/deceit. **Caveat:** Picatrix and Agrippa diverge on ~6 faces — store both with
sources and flag the variant.

---

## 3. The 15 Behenian Fixed Stars (Hermes/Agrippa canon; Alkaid is 15th, NOT Fomalhaut)

Longitudes below are ~2020 **starting points** — the module must **precess them to the chart
date** (≈50.29″/yr from a J2000 base; the ~2020 values are a cross-check). A planet within
~6° (Algol wider) = the star is "active". Natures vary by source — store with provenance.

| Star | ~2020 long | Nature | Stone | Plant | Use |
|--|--|--|--|--|--|
|Algol|26°Tau26′|Sat+Jup|diamond|black hellebore, mugwort|protection, courage; most malefic|
|Pleiades/Alcyone|0°Gem16′|Moon+Mars|rock crystal|fennel|eyesight; summon spirits; reveal secrets|
|Aldebaran|10°Gem04′|Mars+Ven|ruby/garnet|milk thistle|riches & honours; remedy for afflicted Venus|
|Capella|22°Gem08′|Jup+Sat|sapphire|horehound|honours, royal favour|
|Sirius|14°Can21′|Ven (/Jup+Mars)|beryl|savine juniper|favour of men & spirits; honour|
|Procyon|26°Can03′|Mer+Mars|agate|buttercup|favour; magical power; protection|
|Regulus|0°Vir06′|Jup+Mars|garnet|mugwort/celandine|royal favour, courage; remedy afflicted Sun|
|Alkaid|27°Vir12′|Ven+Moon|lodestone|chicory|protection vs enchantment; travel; binding|
|Algorab|13°Lib43′|Sat+Mars|onyx|burdock|repel demons; daring; destructive work|
|Spica|24°Lib06′|Ven+Mer|emerald|sage|riches, favour, success; wins lawsuits|
|Arcturus|24°Lib30′|Mars+Jup|jasper|plantain|carries away fevers; gain|
|Alphecca|12°Sco34′|Ven+Mars|topaz|rosemary|chastity, friendship, honour|
|Antares|10°Sag01′|Mars+Jup|sardonyx/amethyst|birthwort|memory; banish demons; remedy afflicted Mars|
|Vega|15°Cap34′|Mer+Ven|chrysolite|winter savory|favour with beasts & superiors; vs fear|
|Deneb Algedi|23°Aqu48′|Sat+Mer|chalcedony|marjoram|favour in lawsuits; secures home; riches|

**Optional 16th (flagged, NOT in the historical 15):** Fomalhaut ~3–4° Pisces — a Royal star
used as a modern Behenian substitute. Offer behind a clear "modern" flag.

---

## 4. Per-planet Picatrix talisman correspondences (compact)

Keep **THREE spirit-name systems separate** (do not merge): Picatrix prayer-angels (Bk III.7),
Picatrix Mirror angels, Agrippa Angel/Intelligence/Spirit. Colours = the ritual garments.

| Planet | Governs (petition) | Suffumigation | Colour | Metal | Stone | Picatrix prayer-angel | Agrippa Angel/Intel/Spirit |
|--|--|--|--|--|--|--|--|
|Saturn|binding, long-term, secret knowledge, endings|opium, etc.|black|lead|onyx/turquoise|Heylil|Zaphkiel / Agiel / Zazel|
|Jupiter|wealth, favour of great men, law, peace|storax, frankincense|yellow/white|tin|sapphire/chalcedony|Raucayehil|Zadkiel / Iophiel / Hismael|
|Mars|victory in war, vengeance, discord|aloes wood, (blood, hist.)|red|iron|bloodstone|Raucahehil|Camael / Graphiel / Bartzabel|
|Sun|honour, kingship, high office|"hermits'" 31-spice; saffron|gold/yellow|gold|diamond|(none; Sun direct)|Raphael / Nakhiel / Sorath|
|Venus|love, concord, friendship, beauty|aloes, mastic, roses|white(/gold)|copper|emerald/coral|Beyteyl|Haniel / Hagiel / Kedemel|
|Mercury|knowledge, eloquence, commerce|cloves, cumin, myrtle|mixed (scribe)|fixed mercury|agate/emerald|Arquyl|Michael / Tiriel / Taphthartharath|
|Moon|journeys, messages, beginnings|28-component lunar|silver/white|silver|crystal/pearl|Celan|Gabriel / Malka betharsisim / Hasmodai|

**Framing (non-negotiable):** present strictly as historical magical practice, not instruction;
note that some historical recipes name substances that are toxic or illegal — describe, never
recommend.

---

## 5. The Election checklist (encode in `election.js`)

For a **benefic** operation via planet P:
- P **dignified** (domicile/exaltation/triplicity/term), **direct**, **not combust**, **not
  cadent**, oriental/angular, free of a Mars/Saturn square.
- Operate in P's **day & planetary hour**.
- **Moon:** waxing (growth) / waning (release); speed ≥ ~12°/day; **not combust / under-beams
  (±12°)**; **not in via combusta** (configurable; **+ Spica exception**); **not void of
  course**; not conjunct/applying to a malefic; not cadent from the MC; in an
  operation-appropriate **mansion**; applying by trine/sextile to the relevant benefic.
- **Moon's dispositor** (ruler of her sign) well-placed — it signifies the outcome. *(added this session)*
- Keep malefics off the **angles**; Lord of the Ascendant unafflicted.
- **Rescue clause:** Jupiter or Venus on the Ascendant/MC "rectifies an unfortunate Moon."
- **Invert** the polarity for malefic/banishing work.
- Output a **ranked** verdict (green/amber/red) — optimization, not perfection. Windows are
  often only ~30–60 min; the finder scans forward and returns the best upcoming windows.

This reuses `cautions.js` (already built) + `dignities.js` + `planetary-hours.js` +
`lunar-mansions.js`. Do **not** re-implement Moon/dignity logic.
