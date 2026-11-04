# Single-file desktop chart studio

The downloadable `desktop-chart-studio.html` is a self-contained edition of the new desktop chart studio. Open it directly from disk in a current desktop browser. Its calculations, natal and comparison wheels, position tables, aspect grid, chart editor, time navigator, explicit chart-library controls and exports run without a local server or internet connection.

This artifact is a downloadable application file. It is not a ChatGPT-hosted website, and it does not establish that the feature branch has been deployed to GitHub Pages. Chat applications may preview, download or restrict executable HTML differently; verification covers opening the downloaded file in a browser.

## Scope and privacy

- The bundle contains the committed public Greenwich example. It contains no personal birth reading or chart from the conversation.
- A classic inline JavaScript bundle and seven inline stylesheets supply the working studio. No runtime modules, remote fonts or automatic network resources are needed.
- The original calculation engines remain authoritative. The bundler substitutes only the offline installer and navigation delivery; it does not substitute chart calculations.
- Chart saving depends on browser policy for `file://` storage. Moving or renaming the file may change the library exposed by that browser. Save a JSON library export as a portable backup. Unsupported storage leaves casting and study exports available.
- The AI study packet is prepared locally and remains editable. Sharing with a model is a deliberate later action. No model, API key or signed-in ChatGPT session is built into the file.
- Specialist pages and reference links open the published website in a new tab and require internet. The new research note points to the published GitHub feature branch; the navigation link to the studio stays in this file. No profile data is appended to links.
- The accompanying full-library ZIP is a separate artifact. Follow its local-server instructions to use the complete collection offline. The single file does not contain every specialist tool.

## Reproduce the artifact

The application remains dependency-free at runtime. Install the two pinned **build-only** tools outside the repository:

```bash
npm install --prefix /tmp/desktop-standalone-tools --no-save --package-lock=false esbuild@0.25.11 parse5@7.3.0
node scripts/build-desktop-standalone.mjs \
  --tools /tmp/desktop-standalone-tools/node_modules \
  --out /workspace/artifacts/desktop-workbench
```

Use a different `--tools` or `--out` directory as needed. `--tools` names the directory containing the installed `esbuild` and `parse5` packages, typically `node_modules`. Node 22 is the repository's verification runtime.

The builder emits:

- `desktop-chart-studio.html` — the actual application.
- `standalone-build-receipt.json` — exact source-input hashes, output hash, byte count, stylesheet inventory, bundler/parser versions and scope boundaries.

The receipt records the current Git commit and separately hashes the actual working input files. It therefore identifies uncommitted input changes without pretending that the Git commit alone describes the artifact. A successful build is not a substitute for runtime browser verification.

The HTML parser removes the source page's script and resource links, embeds local CSS, installs a minimal semantic navigation header, rewrites explicit navigation, and inserts the classic bundle. The bundle retains Astronomy Engine's Don Cross copyright and full MIT license. Its source URLs use an explicit canonical module base, avoiding `import.meta.url` failures on a bundled local file. The shared site chrome, service-worker installer and hosted integration code are excluded.

The generator rejects a changed stylesheet inventory, an unexpected inspector/tool-link implementation, an external bundle dependency, a remote CSS resource, or missing license notices so that future source changes require review instead of silently creating a partially online export.

## Verification

The separate `scripts/browser-desktop-standalone.mjs` gate opens the actual exported HTML over `file://` with the browser offline. Its verification note records exercised controls, downloads, navigation, storage limitations and viewport coverage. The full site's existing browser gates continue to verify the normal ES-module website independently.
