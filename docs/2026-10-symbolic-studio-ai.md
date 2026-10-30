# Symbolic Design Studio: construction, sources and image AI

2026-10-29. Branch: `feat/mobile-calendar-observatory`. The new [Sigil & Mandala Studio](../pages/sigil-studio.html) is additive: existing Live Symbol Studio, planetary squares, talisman pages, calculators and saved records remain in place.

## Working flow

Choose a construction, enter or omit text as its method permits, adjust drawing parameters, choose a frozen moment/calendar/source lens, then **Draw this design**. The figure, six-part paper-only study sheet and source details update together. SVG, PNG and JSON exports use that same current result. Every input edit invalidates the old result, clears its image prompt and disables exports until redraw. The previous visible figure is labelled as previous work.

The current phrase and exact observer remain in memory. There is no automatic localStorage record, geolocation request, external model call, account connection or upload. A comparison deep link can supply `at`, `lat`, `lon` and `zone`; invalid inputs are reported rather than replaced by silently guessed values. ISO time must include `Z` or an explicit UTC offset. The thirteen-calendar comparison supports 1900–2100, with its own runtime, day-boundary and authority caveats.

## Three explicitly different constructions

| Construction | Implemented algorithm | Provenance and limits |
| --- | --- | --- |
| Intention sigil | NFC Latin A–Z normalization; uppercase; remove A/E/I/O/U; keep each remaining consonant once in first-occurrence order. Connect the corresponding positions on a 26-position alphabet wheel. Seeded radii and a small seeded angular offset vary the artwork. A circle marks the start and a bar marks the end. | Contemporary editorial art algorithm. It is not presented as an exact quotation, a historical plate or a universal sigil method. Unsupported characters error visibly; no transliteration is guessed. At least one consonant is required. |
| Planetary square | Reuses `createSymbolResult`, the existing seven Agrippa square tables and strict Latin/Hebrew mapping. Consecutive duplicate cells collapse in the existing trace. Existing reduction, normalization and square validation are retained. | Agrippa, *Three Books of Occult Philosophy* II.22 supplies the sourced square tables. Latin A=1–Z=26 and the Latin nine-chamber analogue are modern adaptations; Hebrew values and the resulting reconstructed path keep their method notes. This is not a facsimile of Agrippa's finished seals. |
| Geometric mandala | Seeded cubic Bézier petal rings, 3–24 rotational repetitions, 1–6 rings, optional polygon guide and circular borders. | Contemporary nonsectarian radial rosette. It is not a lineage-specific Hindu/Buddhist ritual mandala. Personal theme text does not alter this geometry. |

The seven sourced squares are Saturn 3×3, Jupiter 4×4, Mars 5×5, Sun 6×6, Venus 7×7, Mercury 8×8 and Moon 9×9. Every row, column and principal diagonal must meet the original validator's arithmetic constant, with the exact 1…n² cell set. A corrupt table cannot be accepted through this studio.

A fixed seed reproduces modern geometric variation. It does not alter a sourced planetary grid or its text-to-cell path. Rotation, line weight and palette change the presentation. Construction marks can be hidden without deleting the underlying recipe. No planet, seed, text, grid or calendar is assigned a magical-effect score.

## Reproducibility and exports

`assets/js/core/sigil-design.js` is a pure ES module. It exports:

```js
createSigilDesign(input)
makeSigilRecipe(result, { includePrivate: false })
reproduceSigilRecipe(recipe)
buildSigilImagePrompt(result, { includePrivate: false })
```

The renderer accepts finite, bounded numeric primitives, enumerated inks and modes, validated source identifiers and source records. It does not execute or insert user/model SVG. Input text is never concatenated into drawing markup. Source text in SVG metadata is XML-escaped. The SVG has a title, description, source metadata and a fixed 640×640 viewBox; raster export renders that same SVG to 1280×1280 PNG locally.

A default JSON drawing recipe contains all numeric geometry, style, seed, construction mode and source records needed for byte-identical SVG reproduction. It does not need the original phrase or exact observer:

```js
const result = createSigilDesign(input);
const recipe = makeSigilRecipe(result);
reproduceSigilRecipe(recipe) === result.svg; // verified true
```

An explicit checkbox additionally includes the original inputs and full study context in JSON and the image prompt. SVG and PNG continue to omit the original plaintext and exact observer. **Omitting the phrase does not anonymize the drawing:** its deterministic path, grid or inferred letter positions can reveal information about the input. The UI states that limitation beside export and AI handoff. The JSON is a drawing recipe rather than a promise that a third-party editor can restore every private input.

Pending PNG work has a result-version guard. An input edit or page hide cancels image loading and prevents a late raster callback from downloading the previous design. Clipboard feedback likewise does not overwrite the status of a newer drawing. An already downloaded or copied file cannot be recalled.

## Moment, books and the paper-only study sheet

The moment is calculated through the existing `compareMoment` engine. It supplies the selected civil-calendar label, declared day boundary, geocentric Moon phase, and available sunrise-based planetary hour. Polar unavailable states remain unavailable. These context labels do not automatically change the drawing or establish an auspicious time.

The existing source-study lenses—Agrippa, Lilly, Hermetic texts and Newton—supply named books, section locators, editions, source qualifications and questions. They are separate approaches rather than interchangeable occult authorities. Source section and edition are retained on screen, in the default drawing recipe and in SVG metadata. In particular, the Lilly edition qualification, Mead's 1906 translation and Newton's 1730 *Opticks* must not disappear behind a generic book title.

Newton is an observation/revision lens, not an invented Newtonian astrology or sigil algorithm. A Hermetic source lens is not evidence that a modern rosette is an ancient Egyptian diagram. Agrippa's sourced square is distinguished from a modern name trace. Source context is not a license to invent a passage that has not been supplied.

The complete study sheet contains:

1. Ordinary art materials: paper, pencil or a digital drawing app, and the generated figure.
2. The explicit UTC instant, selected observer, IANA zone and civil-calendar convention.
3. The selected source-reading approach and its limits.
4. The actual construction method and, for a square, its arithmetic check.
5. Moon/temporal-hour labels with no outcome or favorable-day verdict.
6. A record separating geometry, sourced text, personal interpretation and actual observation.

This is a modern paper-only art and reading workflow. It does not import the historic talisman module's potentially harmful materia or generate an operative ritual protocol. No substances, smoke, flames, ingestion or physical consecration recipe is supplied. Existing historical descriptions remain in their dedicated pages with their original source and harm notes.

## Actual AI example versus procedural drawings

`assets/img/studio/ai-geometric-study.png` is an image actually rendered through the available image-generation tool during development. Its provenance is maintained beside the asset by the integration workstream. The page loads it lazily in a separate example gallery, labels it as AI-generated contemporary illustration and offers a PNG download. It is not used as a source for the calculated squares, seed geometry, calendar labels or source verification.

The studio's own live figure is procedurally rendered SVG. No hosted model is called when its controls change. The example does not establish exact symmetry, historically canonical imagery, successful model reproduction of a numbered square, authenticated end-user generation or a functioning hosted API.

## Optional image-model handoff

**Prepare image prompt** displays the exact outgoing text. Its default omits the original phrase and exact observer; the private-data checkbox is an explicit separate choice. The prompt describes a contemporary illustration and asks the user to attach the exported SVG or PNG as the exact reference. It warns that a model may change letters, numbers, geometry or cultural details.

**Open ChatGPT** opens only `https://chatgpt.com/`; it contains no prompt query, credentials or conversation identifier. The user copies, attaches and explicitly sends in their own chat. This page cannot inherit the current ChatGPT conversation, log into an account or assert that an image model is available to that account. A chat service controls its own retention, model access and billing. The existing MCP connection is separate from image generation.

## Optional protected server adapter

`mcp/sigil-image-provider.mjs` implements a bounded, independently hosted adapter. It is not mounted by the static frontend, added to the MCP allowlist, deployed or connected by this branch. A host can call its exported factory with server-only configuration:

```js
import { createSigilImageProvider } from './sigil-image-provider.mjs';
let handler;
export default {
  fetch(request, env) {
    handler ??= createSigilImageProvider({
      apiKey: env.OPENAI_API_KEY,
      accessToken: env.SIGIL_IMAGE_ACCESS_TOKEN,
      model: env.SIGIL_IMAGE_MODEL,
      hostname: env.SIGIL_IMAGE_HOSTNAME,
    });
    return handler.fetch(request);
  },
};
```

The exact endpoint is `https://<configured-host>/api/sigil-image`, accepting only an authenticated JSON `POST` with `{"prompt":"..."}`. The bearer token must be a separate secret of at least 32 characters. Host, HTTPS, path, query, Origin, content type, input fields and sizes are checked before provider access. There is no permissive CORS header. Pages hosted at a different origin cannot simply call it from their browser; an authenticated same-origin application/gateway must deliberately integrate it.

The provider destination is fixed to the official OpenAI Images API; redirects are refused and the incoming media type must be exactly application/json (optional parameters allowed). Model selection is exclusively server-side; a caller cannot inject a model, destination URL, quality, count or output format. The configured model must actually support the requested parameters. The adapter requests one 1024×1024 PNG at low quality, limits prompts to 12000 characters and JSON bodies to 64 KiB, allows one in-flight request and four requests per minute per handler, has a 60-second ceiling, propagates cancellation and bounds the returned PNG/base64 size. Upstream errors are summarized without copying provider bodies, keys or prompts into errors. Responses are `no-store`.

**Cost and deployment remain explicit:** each authorized request can incur provider charges. The in-memory limit is per handler/isolate, not a global quota across distributed workers. Production hosting must add account-level authentication, distributed rate limits, provider budget caps and audit/retention choices before opening access. The adapter is not an authorization to spend from an unconfigured account. No real key or paid provider call was used in its tests.

The official [OpenAI image-generation guide](https://developers.openai.com/api/docs/guides/image-generation) was fetched successfully over verified HTTPS on 2026-10-29. It currently illustrates a newer image model and states that `gpt-image-1` was shut down on October 23, 2026. This adapter therefore has no stale default model or claim that an arbitrary account can access the latest one. Consult the current provider documentation and available server account model list when configuring it.

## Executed verification and panel boundaries

- Ten numerical/security/privacy test groups in `scripts/tests/sigil-design.mjs` passed: three-mode deterministic replay, strict normalization, seven square validators, seed behavior, default/private export fields, malformed recipes, bounds, source/edition continuity, explicit prompt disclosure and zero local fetch calls.
- Six adapter groups in `scripts/tests/sigil-image-provider.mjs` passed using a fake transport only: required configuration, preflight guards with zero provider calls, exact fixed request, bounded PNG response, upstream error redaction, concurrency/rate bounds and cancellation. These are adapter tests, not model inference or deployment tests.
- Author Chromium checks passed at 320, 390 and1365 CSS px with no root overflow or page errors; SVG and actual PNG download paths ran; an invalid Hebrew/Latin pairing disabled stale exports; mode changes and prompt invalidation ran; the actual AI example loaded after scrolling into view.
- Round1 established the sourced-square/modern-art boundary and implemented the first candidate. Round2 source review identified missing edition/section metadata; those fields were restored on screen, in JSON and SVG metadata. Round3 contract review tightened the optional adapter to reject application/jsonx and refuse provider redirects; the adapter tests passed after those changes. Independent final-round findings and release checks are recorded by the coordinating panel.

This is AI-agent technical/design review and browser automation, not a human tradition-expert endorsement, a participant usability study, a screen-reader certification or validation of magical effects. The optional hosted adapter and the user's authenticated ChatGPT connection remain separate deployment/connection tasks.
