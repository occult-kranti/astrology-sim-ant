# Sky explorer design contract

2026-10-30 · Design Partner `redesign` / `interaction` in the existing static, native-JavaScript application. Baseline `fb656a8047e93b8d49227d92aa9edc3e9b1fce50`. This extends the engraved calendar atlas and preserves its original Sun–Moon plate, method ledger, birth form and export routes.

## Primary job and invariant

The user chooses a moment, reads the actual arrangement, compares source conventions and travels through calculated past or future positions. The circle is the working instrument. It is not merely a decorative zodiac, a physical sky photograph or a numerical verdict about a person's future.

The new main view is **Deep chart**. The original plate remains available under **Sun–Moon plate**. **Orbital space** changes the coordinate frame, using actual heliocentric J2000 vectors projected onto the page. The mode labels, units, scale and limitations stay beside the drawing; orbital grid circles are not presented as calculated trajectories. Linear AU scaling is the default, with a separately labelled square-root compression option. Symbol sizes are enlarged for reading.

## Composition and interaction

- Retain warm paper, green-black ink, restrained copper, fine graduations and serif reading text. Planetary data and interpretations create the visual identity; no generic card grid or decorative 3D particles.
- A large circle and a narrower selected-body inspector form the desktop spread. The inspector places a source-attributed reading summary alongside measured longitude, latitude, distance, apparent motion and geometric horizon information.
- Native body selection duplicates clickable/keyboard-operable SVG marks. Keyboard activation restores focus on the replacement marker after a calculated redraw.
- Equal zodiac signs, sidereal origin, nakṣatra partitions and houses use actual angular boundaries. Civil calendars remain labelled rows rather than acquiring invented circle coordinates. The eight-ring visual cap is separate from the complete selected-method ledger.
- Catalogue stars and the inherited historical star-marker layer are visibly distinct. The latter is off by default. A star marker does not receive an invented Lilly or Agrippa interpretation.
- A timeline is built only after an explicit action. The default is a dynamically calculated ±5-year window; narrower hourly and daily windows support inspection. Workers are bounded and cancelled on request or invalidating edits. Changing a sampling setting clears the old result rather than silently exporting it under the new controls.
- Sample selection uses its original UTC instant and recomputes the parent atlas. Longitude lines break at the 360° boundary. Coarse-sampling and Moon aliasing limits appear above the plot, not only inside a disclosure.
- All buttons and clock inputs retain focus, error, busy, cancellation and unavailable states. Local two-dimensional charts scroll within named keyboard regions. Narrow layouts recompose rather than shrink the desktop spread.

## Time and calendar synchronization

“Same UTC instant” and “same local clock reading” are distinct choices. Their base/comparison UTC times, local dates, offsets and elapsed difference are displayed. Ambiguous/nonexistent local times require an explicit choice or correction. Matching IANA zone names is not a geographic polygon verification.

The product calls this internal alignment. External calendar providers remain disconnected. A separate calendar-file preview precedes manual ICS download; public observer/context inclusion defaults off. Downloading a file is not a subscription or automatic provider synchronization.

## Reading and AI

The local interpretation uses named Lilly, Agrippa and Jyotiṣa rule modules. Computed facts, historical classifications, source locators, shared inputs and unresolved conditions remain inspectable. Complete books, complete elections and personal outcome accuracy are not claimed. The separate AI handoff uses the same current casting and selection; a star selection does not silently become a Moon reading.

SVG exports carry UTC, frame, geometry and a birth-exclusion flag. The explicitly disclosed local JSON includes the displayed public observer and relevant horizon/reading evidence. Neither includes the separate birth form. AI transmission is a separate preview flow with its own default exclusion of location-dependent context.

## Verification ledger

Initial implementation received an independent code-level QA review. Corrected before browser testing: double-applied sidereal origin; numeric worker job ID mismatch; retained old-zone timeline; changed sampling parameters with old results; hidden sampling warnings; inaccurate altitude wording; lost SVG keyboard focus. These are R1 corrections. Browser layout, fonts, actual exports and full journeys remain to be recorded against the integrated candidate.

## Artwork inspection

Inspected the actual main object image for [The Met astrolabe, object 444408](https://www.metmuseum.org/art/collection/search/444408), dated 690 AH / 1291 CE. Its engraved circumferential graduations, layered rete and star pointers informed the original interface geometry. [Image inspected](https://collectionapi.metmuseum.org/api/collection/v1/iiif/444408/898284/main-image); source page identifies the image as public domain. The image is not embedded as a product asset and the new wheel is not a reconstruction of the historical instrument. No visual claim rests only on metadata.

### R1 rendered refinements

Actual Chromium 145 inspection retained the circular composition and corrected orbital label collisions with leader-line callouts to unchanged vector positions. Dense rule workings moved into nested disclosures. The rendered plate now fits a short desktop viewport without cropping its square geometry. Catalogue-star geometric frames, the inherited marker approximation and the diagram's uniform 3° aspect allowance are shown distinctly from the historical reading conventions. Coarse Moon timeline samples use points and a direct daily zoom, avoiding an interpolated aliasing curve. Executed checks and screenshots are recorded in [the experience ledger](../docs/2026-10-sky-experience.md).
