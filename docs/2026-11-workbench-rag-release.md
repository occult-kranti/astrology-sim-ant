# RAG integration verification and delivery

This update extends `feat/desktop-astrology-workbench`. The source-only assistant and static chart tools remain usable offline. A separate localhost companion supplies optional model generation and official local-app ChatGPT authorization. The exact public corpus has **3,327 chunks from 188 source files**, SHA-256 `91bd1dc12078430a9ac2737054d6eab2e58f9328a5fc79e135d22d3eaf31a8b6`.

## Local gates

| Gate | Result and scope |
|---|---|
| Full inherited engine | 743 top-level checks passed, zero failures; includes the new corpus/action integrations and generator checks |
| Corpus/retrieval | 37,492 assertions; ten calibration and eight held-out source-location queries; lexical engineering fixtures |
| Chart actions | 456 checks across ten strict finite action types |
| Retained desktop engine/library | 7,427 adapter checks and 599 library checks |
| New MCP protocol | 194 checks through the actual official-SDK HTTP handler and spawned stdio process |
| Supabase | 104 local PGlite/SQL/client checks; expected source file in the top five for 8/10 authored queries |
| Local companion | 56 HTTP/mock-provider checks, including session-invalidation races |
| ChatGPT OAuth | 124 assertions across 28 generated-RSA/mock-HTTP scenarios; no live user authorization |
| Chat browser | 83 checks across real HTTP mock requests, 320px layout and the actual offline HTML |
| Retained desktop browser | 124 checks on a frozen final public-source inventory |
| Standalone browser | 53 original chart/library/export checks against the new file, in addition to the new assistant's offline checks |
| Static audit | 136 HTML documents and 346 JS modules, zero problems |
| All-page browser gate | 136 pages loaded with zero errors; inherited motion, narrow layout and print checks also passed |

These counts describe individual assertion suites, not independent scientific experiments. Citation-ID validity does not establish semantic support, astrological prediction accuracy or model reliability. The small initial 0.6B model failed sampled factual explanations despite successful inference. The optional default now uses pinned Qwen3-4B-Instruct-2507 Q4_K_M. It copied the supplied public Sun facts correctly and improved citation formatting, but its sampled house and zodiac explanations still contained unsupported or inaccurate details. Both model and prompt changed, so this is not a controlled model-only comparison or validated interpretation. The [public model-evaluation record](workbench-local-model-evaluation.json) retains bounded requests, raw answer text, latencies and manual findings for reproduction. Actual model evidence and the stronger-configuration follow-up are recorded separately in [the chatbot verification report](2026-11-workbench-chat-verification.md) and `local-rag/README.md`.

The initial standalone attempt using the system browser could not open `file://` under that browser's administrative policy and completed zero product checks. The passing file-origin verification used the installed Playwright Chromium binary; its receipt records the actual browser. This is not an all-browser claim. The independent chat browser also opened the same actual artifact offline, and both its file and source hashes stayed unchanged during their accepted runs.

The final chart bridge also fixes navigation when the standalone catalogue contains absolute URLs. Both HTTP and file-origin assistant tests now apply a reviewed MCP-page navigation and verify its exact destination, absence of chart query data and opener isolation.

The horizon integration initially failed because three new MCP tools had no reviewed batch classification. The authored coverage source now explicitly labels source retrieval and context-dependent previews; the complete preset was regenerated and the inherited gate rerun successfully. No ranking assertion was removed and no new tool was falsely labelled as executed by the horizon scan.

## Downloadable artifacts

The current single-file chart-and-reference app is **4,955,297 bytes**, SHA-256 `c75ad73bdf93e91f601f4b2a29417e05c2e08a8254331d774b1ec00eb105aa96`. Its build receipt binds 53 source inputs and eight stylesheets. The static offline inventory includes **542 public files / 57,831,721 bytes**, with inventory digest `83b86b3634e204277e272166c4e87e64136ade55230bdcfa85b07933d70fa5f6`.

The separate companion ZIP includes a deterministic per-file manifest, explicit runtime source, public reference inputs, setup instructions and the model-download recipe. It excludes model weights, installed dependencies, credentials, private chart exports and Git history. It is a runtime/source-study distribution, not the complete research or CI checkout. An extracted-package review checks installation, public HTTP routes and negative private-path cases. Model files remain in the user's own cache.

Supabase artifacts comprise the SQL migration, the deterministic public-source seed and local verification receipts. No remote project or database was created. Optional OpenAI API and ChatGPT plan adapters remain unconfigured until the user supplies their own authorized setup; mocked OAuth tests do not prove live eligibility or inference.

## Publication state

The preceding desktop commit's GitHub verification, MCP and horizon jobs passed; its deployment was rejected by the existing Pages environment branch restriction. The user deferred changing that restriction. Feature-branch pushes now run all existing verification and artifact builds without automatically requesting that deployment. A manual workflow input can request feature deployment after the owner configures the branch rule; ordinary main publication is retained.

The localhost test service is not a public URL. Downloadable HTML/ZIP files are not a new ChatGPT-hosted site. The current session has no publication tool that can establish such a hosted URL. Future publication must verify the deployed commit and live routes separately from these local artifacts.
