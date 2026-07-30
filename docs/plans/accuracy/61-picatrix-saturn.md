# accuracy-check 61 — Picatrix, suffumigation of Saturn ("opium, etc." @ III.7)

## Claim under test
`assets/js/core/data/planetary-magic.js` (line 39) and `research/SOURCE-DATA.md` §4 (line 130)
give Saturn's suffumigation as **"opium, etc."** cited to **Picatrix III.7**.
The blind re-audit says III.7's own list is "all things that smell bad, asafoetida, gum arabic,
bdellium, hemlock and similar things" and that opium appears elsewhere.

## Editions consulted
1. **Greer & Warnock**, *The Complete Picatrix* (Liber Atratus ed., Adocentyn/Renaissance
   Astrology), Books 3–4 — full text (archive.org item `arshistoria`, Picatrix-books-3-4.pdf),
   text-extracted and searched exhaustively for "opium" and "suffumigation of Saturn".
2. **Attrell & Porreca**, *Picatrix: A Medieval Treatise on Astral Magic* (Penn State UP 2019,
   from Pingree's Latin) — full text (archive.org item
   `picatrix-a-medieval-treatise-on-astral-magic`, djvu.txt), same searches.
3. Cross-check: Joseph Peterson's Picatrix outline (esotericarchives.com/picatrix.htm),
   confirming chapter contents (III.3 = robes + fumigations of the planets; III.7 = Sabian
   planetary prayers with their incenses).
   (Ritter & Plessner 1962 German and Pingree 1986 Latin not directly accessible; A&P is
   translated from Pingree's Latin, so the Latin is represented at one remove.)

## What the text actually says — the two loci

### Locus A — the plain planetary-correspondence list is in Book III **chapter 3**, not 7
- **Greer & Warnock, III.3** (after the garment colours): "Now we will discuss the
  suffumigations of the planets. The suffumigation of Saturn is **all things that smell bad,
  asafoetida, gum arabic, bdellium, hemlock and similar things**; Jupiter's is all good and
  temperate odors and includes amber, lignum aloes…"
- **Attrell & Porreca, 3.3 §11**: "The suffumigation of Saturn comprises **all foul-smelling
  things, like asafoetida, gum, bdellium, hemlock, and the like**."
- Divergence between editions: G&W "**gum arabic**" vs A&P "**gum**". Otherwise identical.

### Locus B — Book III **chapter 7** ("How to speak with Saturn") has a compound ritual
confection that genuinely BEGINS WITH OPIUM
- **Greer & Warnock, III.7**: "Take **opium**, actarag (which is an herb), saffron, laurel
  seed, caraway, wormwood, lanolin, colocynth, and the head of a black cat, in equal parts.
  Grind up everything…, blend it with the urine of a black goat, and make pills…"
- **Attrell & Porreca, 3.7.16** (their intro, p. 28–29, cites this recipe as 3.7.16 and
  discusses its opium explicitly): "take equal parts of **opium**, storax (which is an herb),
  saffron, seed of laurel, carob, wormwood, lanolin, colocynth, and the head of a black cat…
  mix everything together with the urine of a black she-goat…"
- Divergences between editions: "actarag" (G&W) vs "storax" (A&P); "caraway" (G&W) vs
  "carob" (A&P). Both agree opium is the first ingredient.

### Locus C — a third, different Saturn suffumigation exists at Book IV chapter 6
(G&W IV.6: mandrake fruit, dried olive leaves, black myrobalan, black pepper, dried brains of
black crows and cranes, dried blood of pigs and apes — **no opium**.) Opium also appears in
III.7's Sun and Venus confections, III.11's soporific confections, and IV.7/IV.9 marvels.

## Verdict on the re-audit
- **Substantively RIGHT**: "opium, etc." is wrong as *the* suffumigation correspondence of
  Saturn. The correspondence-table value in both editions is the foul-smelling list
  (asafoetida, gum [arabic], bdellium, hemlock).
- **One detail WRONG in the re-audit**: that list is in **III.3**, not III.7 (both editions;
  Peterson's outline concurs). And opium is not only "attributed elsewhere" — it is genuinely
  in III.7 itself, as the first ingredient of the Saturn conjuration confection (A&P 3.7.16).
  So the module's "III.7" citation was locus-accurate for the *ritual confection* but the
  value was pasted into the wrong conceptual slot (generic suffumigation).

## Corrected data record (paste-ready)
```js
suffumigation: 'foul-smelling things: asafoetida, gum arabic, bdellium, hemlock',
source: 'Picatrix III.3 (Greer & Warnock, Complete Picatrix, Liber Atratus ed.; Attrell & Porreca 2019, 3.3 §11)',
sourceNote: 'Editions diverge slightly: "gum arabic" (Greer–Warnock) vs "gum" (Attrell–Porreca). ' +
  'Distinct from the Picatrix III.7 Saturn-conjuration confection (Attrell–Porreca 3.7.16), which does begin with opium ' +
  '(opium, actarag/storax, saffron, laurel seed, caraway/carob, wormwood, lanolin, colocynth, head of a black cat, ' +
  'black-goat urine) — the source of the old "opium, etc." value — and from a third compound recipe at IV.6 (no opium). ' +
  'WARNING: hemlock (Conium maculatum) is severely poisonous, including its smoke; colocynth and opium in the III.7 ' +
  'confection are also toxic/controlled. Described, never recommended.'
```

## Harm-note consequence (explicit)
The corrected III.3 list is **still hazardous — because of hemlock**, not opium. Hemlock's
coniine is dangerous by ingestion and by inhalation of fumes. The module's safety framing
(line 11, "e.g. opium") must be re-anchored: hemlock for the correspondence value; opium (and
colocynth, wormwood, animal materia) only if the III.7 ritual confection is described.
`research/SOURCE-DATA.md` §4 line 130 carries the same wrong value and needs the same fix.

## Unresolved
- Ritter & Plessner (1962) German and Pingree (1986) Latin not directly checked (paywalled /
  not online); A&P stands in for Pingree's Latin.
- Arabic Ghāyat al-Ḥakīm (Atallah–Kiesel trans., vol. 2) not checked for the III.7 recipe.
- The module's OTHER planets' suffumigation values (e.g. Jupiter "storax, frankincense" vs
  III.3's "amber, lignum aloes") look like they were also drawn from mixed loci — they
  deserve the same audit.

## Sources
- https://ia803109.us.archive.org/13/items/arshistoria/Picatrix-books-3-4.pdf (Greer & Warnock, Complete Picatrix Liber Atratus, Books 3–4; full text searched)
- https://archive.org/download/picatrix-a-medieval-treatise-on-astral-magic/ (Attrell & Porreca 2019, Penn State UP; djvu.txt searched; intro pp. 28–29 on 3.7.16 opium)
- https://esotericarchives.com/picatrix.htm (Peterson's chapter outline: III.3 fumigations, III.7 Sabian prayers)
- https://books.google.com/books/about/Picatrix.html?id=S3DKDwAAQBAJ (A&P edition record)
- https://wellntruly.tumblr.com/post/165230560815/ and https://graycloakgrimoires.com/post/127830963075/ (secondary quotations of the G&W suffumigations list, corroborating wording)
