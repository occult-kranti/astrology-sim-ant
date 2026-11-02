# Private comparative birth reading

`pages/birth-reading.html` is a reusable reading instrument. Birth fields begin empty. Inputs, derived positions and private reports remain in browser memory until the user explicitly downloads a copy. No birth record is embedded in the repository, URL, local storage, worker URL or an external AI request. The calculation worker receives the explicitly entered profile locally and is terminated when inputs change. An imported report is recalculated from its bounded input envelope; archived prose and positions are not trusted.

## Reading scope

The page compares three chart frames: tropical Regiomontanus, tropical whole-sign and linear-Lahiri sidereal whole-sign. It provides seven classical planets, mean lunar nodes, twelve house topics, source-linked traditional interpretations and all 32 named Atlas variants (25 available, seven explicitly unavailable). It retains the implemented 14 Vedic divisional charts and their model qualifications. Civil calendars, regional observance and natal divination are different capabilities; no unavailable BaZi, Kabbalistic, ancient Egyptian or Mayan natal method is invented.

The step-by-step explanation follows explicit clock resolution, the observer's horizon, zodiac and house choices, planet/ruler conditions, calendar boundaries and time methods. Five birth-clock scenarios demonstrate sensitivity without assuming an error in the supplied record. This is especially important near a sidereal ascendant boundary. The inherited raw Fortune position is omitted because its non-sect-reversed convention would otherwise obscure a nighttime alternative.

## Time study

Annual profections use completed civil age at the recorded birthday clock. February 29 uses February 28 in non-leap years, explicitly distinct from a solar return. Vimśottarī retains the canonical 365.2425-day model year; the selected Rao §16.2 passage prefers 360 days, and the report exposes this disagreement. Node exaltations are named as a contested table choice.

The default future window is three years. The existing solver locates Jupiter/Saturn contacts to the natal Sun, Moon, Ascendant and Midheaven for five named aspects, in bounded windows of at most 700 days with duplicate boundaries removed. Solar returns and the next tropical lunar-longitude return use their canonical solvers. These are selected astronomical contacts, not a complete catalogue or probabilities of biographical events. Past symbolic periods do not establish a person's history.

## Sources and exports

Twenty curated source records retain author/work, locator, edition, reading depth and limitations; Atlas source records remain attached to its results. Newly inspected material includes selected Lilly passages and Rao's nakshatra, ayanamsha and Vimśottarī chapters. Ptolemy access failed during this pass and remains explicitly bibliography-only. No source list claims all books were read in full.

JSON exports contain the private input and complete calculated report. HTML exports contain a self-contained static reading with resolved SVG colors, expanded evidence and no executable script or remote assets. Both contain personal birth details and should be shared deliberately.

## Verification

The pure module has synthetic checks registered in the engine suite. `scripts/browser-birth-reading.mjs` exercises actual calculations, all three frames, method coverage, source anchors, private exports/imports, invalidation, clearing, mobile reflow and keyboard/print behavior. It retains source hashes, screenshots and actual download bytes. The Pages workflow preserves all prior gates and adds this focused reading gate. Production identity remains available through `release.json` and the workflow's browser artifacts.
