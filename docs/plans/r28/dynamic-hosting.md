# R28 PLAN — The Dynamic-Site Deep Dive: what going dynamic would gain, risk, and cost — and exactly how to host it

**Status: PLAN ONLY. Nothing in this document has been written into the repo.**
**Repo audited:** `c:/Users/mehta/OneDrive/Documents/github/2026/astrology-sim-ant` (branch `main`, HEAD `d12500f`, R25 state).
**Date:** 2026-07-16. All prices verified against July-2026 sources; every price is cited in §9.

---

## 0. The one-paragraph verdict (full memo in §7)

This site should **stay static** for the foreseeable future, and the next rung on the ladder is **rung (a): PWA + Pagefind + the learn/handcalc integration** — all three of which run on the exact architecture the site already has, cost $0/month, and *strengthen* the site's three identity pillars (offline-first, readable-source, privacy-absolute) rather than trade against them. A backend should be built **only when a concrete, observed need appears** (a real study group asking for shared libraries; real users losing charts to cleared localStorage), and when it is built it should be **rung (b) — a tiny sync backend** (Hono + SQLite + passkeys, ~200 lines, E2E-encrypted blobs) — never rungs (c)/(d), which would destroy more identity than they add features. The full argument, with the honest counter-case, is §7.

---

## 1. WHERE IT STANDS — precise audit of the current architecture

### 1.1 What the repo is, measured

| Fact | Value (measured 2026-07-16) |
|---|---|
| Total deployable size | **~6.1 MB apparent** (248 files: `index.html` + `pages/` 961 KB + `assets/` ~3.6 MB) |
| Engine (`assets/js/core/`) | **2.4 MB**, 52 modules + 36 data modules — pure ES modules, zero DOM except `chart.js` (SVG renderer, explicitly flagged as the only DOM-touching core file) |
| Vendored astronomy | `assets/js/lib/astronomy.js` — astronomy-engine, **MIT**, 412 KB, ≈1 arc-minute accuracy |
| Page logic (`assets/js/app/`) | 676 KB, 55 modules |
| Build step | **None.** `python3 -m http.server` is the entire toolchain. |
| Capability registry | `core/registry.js` — **64 capabilities**, 12 marked `callable: true`, each with `module`, `exportName`, typed `inputs[]`, `outputShape`, citation, pages, glossary terms. An anti-drift test asserts every export/page/anchor actually exists. |
| Isomorphism — already proven | `scripts/engine-test.mjs` imports `castChart`, `essentialDignity`, `chartCautions`, `planetaryHour`… **directly into Node** and runs the full engine headless. The same files served to browsers run server-side *unchanged, today*. This is the single most important architectural fact in this document: **a backend for this site requires writing zero new astronomy — only transport.** |
| LLM | BYOK, browser-direct: `app/llm-core.js` calls `api.anthropic.com/v1/messages` with the user's own key and `anthropic-dangerous-direct-browser-access` (plus a Groq/OpenAI-shape option). No proxy, no server, no key ever leaves the user's machine except to the provider they chose. |
| Persistence | localStorage only: learn progress (`awb-learn-progress-v1`), workbench auto-save, local config. |
| Sharing | `app/state.js` — `encodeState`/`decodeState` pack tool inputs into the **URL query string**; permalinks already exist, serverlessly, for anything whose state fits a URL. |
| Hosting | GitHub Pages via `.github/workflows/pages.yml`. |
| Identity (LOCKED) | Honest-science framing: historical symbolic systems, no demonstrated validity, described-never-prescribed, everything cited, contested facts flagged both-ways and never resolved. |

### 1.2 What "dynamic" could concretely add — the full candidate list, honestly assessed

Each row: what it is, what it genuinely requires a server for, and whether a static equivalent already exists or could.

| # | Feature | What a server buys | Static alternative that exists/is possible | Honest need level for a *study* site |
|---|---|---|---|---|
| D1 | **Accounts + saved-chart libraries** | Durable, named storage of casted charts; survives cleared browser data | localStorage auto-save (exists); JSON/Markdown export (exists — "download the report to keep it"); File System Access API could add save-to-folder | **Low-medium.** The real pain is localStorage fragility, which export already mitigates. Becomes medium only if users accumulate dozens of study charts. |
| D2 | **Cross-device sync** | Same library on phone + desktop | Manual: export on one device, import on other; URL-state for single charts | **Low-medium.** Genuine convenience; the only D-feature that *cannot* be fully faked statically. |
| D3 | **Shareable permalinks with server-rendered previews / OG images** | Link unfurls in chat/social with a rendered chart wheel; short URLs | URL-state permalinks exist and work; OG image is impossible statically *per-chart* (crawlers don't run JS). A static generic OG image per page is possible today. | **Low.** Nice for evangelism, irrelevant for study. Note: `core/chart.js` renders SVG — an OG endpoint would be ~30 lines around it (see §3.5). |
| D4 | **Heavier ephemeris precision server-side** (Swiss Ephemeris, full VSOP87/DE441) | Arc-second positions, wider date ranges (8000 yr), asteroids, true node options | astronomy-engine is ≈1′ — already **better than any historical table Lilly used**, and the site's pedagogy (handcalc deltas) treats small divergences as *content*. WASM Swiss Ephemeris could even run client-side. | **Very low** for the mission — and it carries the AGPL trap analyzed in §5.6. |
| D5 | **Server PDF/report generation** | Typographically rich PDF of `fullReading()` | Browser print CSS (partially exists via export); client-side paged rendering | **Low.** Print stylesheet closes 90% of the gap for $0. |
| D6 | **Community layers** — annotations, study groups, shared readings | Multi-user state, moderation, identity | giscus embeds GitHub Discussions on static pages with zero backend (§5.3); Hypothes.is overlays annotations on any URL | **Low now, the most plausible future medium.** Community is the one thing that is *definitionally* multi-user. But it imports moderation duty, PII exposure, and abuse surface — see §3.4. |
| D7 | **Usage analytics** | Know which pages/lessons are used | None statically without a collector — but a *privacy-clean self-hosted counter* (GoatCounter/Plausible CE) is near-static in weight (§5.2). CF Pages also gives request analytics with **zero** client-side script. | **Low-medium** (author curiosity, curriculum tuning). Must never be third-party. |
| D8 | **Full-text search** | Search across ~90 pages + glossary + registry | **Pagefind — fully static**, WASM + sharded index, no server at all (§5.1). This is the poster child for "you thought you needed a backend." | **Medium-high need, ZERO server required.** Do it now. |
| D9 | **Location/timezone atlas** (the JHora-style 2.5M-city gap) | Type "Ujjain" → lat/lon/tz without the user knowing coordinates | GeoNames `cities500.txt` is ~230k rows; a trimmed 25–40k-city subset (pop ≥ 15k + all admin capitals) with IANA tz gzips to **~1–2 MB static JSON**, searchable client-side. The *full* 2.5M-place atlas is the only version that wants a server (or a lazily-fetched sharded static index — Pagefind's own trick, applicable here). | **Medium.** Real usability gap today (users must type lat/lon). The static 25k-city tier closes most of it; historical-timezone edge cases (LMT before standard time) are *content for the handcalc pedagogy*, not a bug. |
| D10 | **Streaming AI proxy** (BYOK stays optional) | Users without keys get AI features; author pays per token; key never in browser | BYOK exists and matches the identity perfectly. A proxy inverts the privacy story: readings (which contain birth data!) transit *your* server. | **Low, and identity-negative** unless E2E framing is impossible — see §3.4/§4.6. |

**The pattern the table exposes:** of the ten "dynamic" candidates, only **D2 (sync)** and **D6 (community)** are essentially impossible statically, and the two highest-value items (**D8 search, D9 atlas-tier-1**) require no server at all. That asymmetry drives the whole recommendation.

---

## 2. THE ARCHITECTURE LADDER — four rungs, specced

Effort figures assume one experienced developer familiar with the repo. "Identity cost" scores against the locked pillars: offline-first / readable-source / privacy-absolute / no-build.

### Rung (a) — Stay static + PWA (service worker, installable, offline-first strengthened)

**What it is.** Add `manifest.webmanifest` + one hand-written `sw.js` (readable-source demands no Workbox): versioned precache of the ~6.1 MB site on first visit, cache-first with background revalidation, an offline fallback page, and an in-app "new version available — reload" toast. The site becomes installable (Add to Home Screen / Windows app) and works **fully offline forever after one visit** — including the entire engine, all calculators, the whole curriculum, and (post-Pagefind) search, since Pagefind's index shards are just static files the SW can cache.

- **UI/UX gained:** install icon; instant loads (everything local); *the strongest possible expression of the site's identity* — "the whole observatory in your pocket, no network, no account, no telemetry." Astronomy calculation offline is genuinely useful (fieldwork, travel, teaching without wifi).
- **Effort:** 2–4 days. ~250 lines: manifest, SW with a build-less cache manifest (a tiny `scripts/gen-precache.mjs` that globs files into a JS array — run manually like `engine-test.mjs`, so the no-build rule survives as "no build *required to develop*; one optional script regenerates the precache list before deploy," same category as the existing verify scripts).
- **Cost:** $0. Works on GitHub Pages unchanged.
- **Risk (honest):** SW cache-staleness is the classic footgun — a bad SW can pin users to an old version. Mitigations: version-stamped cache names, `skipWaiting` only on user consent (the toast), a kill-switch (`sw.js` that self-unregisters) kept ready. Also: the BYOK LLM calls and the `now.html`-style live pages need network; the SW must pass API origins through untouched (network-only for `api.anthropic.com` etc.).
- **Is this honestly the right next rung?** **Yes — with one caveat.** The caveat: for a *study site* visited in a desktop browser, PWA installability itself is a minority feature; the real wins are (1) offline permanence, (2) speed, (3) the identity statement. Those are worth 2–4 days. It would *not* be worth it if it required adopting a bundler — the hand-written-SW constraint is load-bearing.
- **Identity cost: negative (it pays identity).**

### Rung (b) — Static + tiny sync backend (auth + KV for saved charts only)

**What it is.** The static site stays exactly as-is on static hosting. One small, separate service (`api.<domain>`) does exactly three things: **passkey auth, encrypted-blob storage, blob listing**. No server rendering, no server astronomy, no community. The client treats it as optional — everything still works logged-out, and the sync client is a progressive enhancement in `app/state.js`'s style.

- **UI/UX gained:** "Sign in with a passkey → your chart library follows you." Solves D1+D2 and nothing else. For a study site this is the *only* account feature with a defensible cost/benefit: an account that is a passkey (no email, no password, no name — credential ID + ciphertext, that's the whole user record) barely dents the privacy identity, **if and only if** charts are E2E-encrypted (§4.5) so the operator cannot read birth data in normal operation (see §4.5 for the honest limits of browser-delivered E2E).
- **Effort:** 1.5–3 weeks including the client UI, E2E crypto, GDPR plumbing (export/delete endpoints), deployment, backups, monitoring.
- **Cost:** $0–5/mo (Cloudflare Workers free tier or a €3.79 Hetzner VPS — §4.2/§5).
- **Risk:** now you operate a service: uptime duty, dependency patching, breach surface (mitigated to "ciphertext + credential IDs" by E2E), the psychological shift from "artifact" to "product." **The biggest real risk is unforced scope creep** — the tiny backend that grows a comment table, then a proxy, then moderation.
- **Identity cost: small but nonzero** — the README's "no backend" sentence dies; honesty requires a visible privacy page stating exactly what the server stores (it can be one short table, which is itself a flex).

### Rung (c) — Hybrid SSR (server-rendered chart pages + static shell)

**What it is.** Keep static pages, add a server that renders chart permalinks (`/c/{id}` → full HTML reading + OG image via `core/chart.js` server-side), maybe the atlas API and search API. The isomorphic core makes this *technically trivial* — `fullReading()` in a Hono handler is ~15 lines — which is exactly why it's seductive.

- **UI/UX gained over (b):** links that unfurl with a chart wheel (D3); readings visible with JS disabled; crawlable/sharable chart pages.
- **Effort:** 4–8 weeks (routing, caching, template parity with client rendering — now two render paths to keep honest, the classic SSR tax).
- **Cost:** $5–20/mo + operational attention.
- **Risk:** **the parity trap** — every future engine change must be verified in two runtimes and two render paths; the verify-site harness would need a server in CI; offline-first now has an asterisk ("except shared charts"). And the actual beneficiary is *social sharing*, which is marginal for study.
- **Identity cost: high.** Not recommended at any foreseeable point. If OG images ever matter, do them as a *pure function endpoint* bolted onto rung (b) — stateless `GET /og?state=<encoded>` reusing the existing URL-state encoding, no stored charts, no second render path for humans (the human still lands on the static page).

### Rung (d) — Full dynamic app (accounts everywhere, community, server-first)

**What it is.** The conventional modern rewrite: framework, database-backed everything, feeds, notifications, moderation.

- **UI/UX gained:** study groups with shared libraries and threaded annotations on chapters (the one genuinely new capability class); admin dashboards; every D-feature at once.
- **Effort:** 4–6+ months, then permanent product operation. Moderation of user content on an astrology site inside an honest-science frame is a *content-integrity* problem, not just an ops one: user annotations asserting predictive validity would sit inside pages whose locked framing denies it. You'd need moderation *policy*, not just tooling.
- **Cost:** $20–100+/mo plus your attention forever.
- **Risk/identity cost: fatal.** Offline-first dies, readable-source dies (a framework arrives), privacy-absolute dies (accounts + community PII), no-build dies. **Rejected outright;** included only to mark the ladder's top. If community ever truly beckons, giscus (static, §5.3) is the experiment to run first — it will reveal whether anyone actually wants to talk, for zero rungs climbed.

### Ladder summary

| Rung | Effort | $/mo | Solves | Identity cost | Verdict |
|---|---|---|---|---|---|
| (a) PWA | 2–4 days | 0 | offline permanence, speed, installs | **negative** | **Do now** (with Pagefind + learn integration) |
| (b) tiny sync | 1.5–3 wk | 0–5 | D1, D2 | small (bounded by E2E) | **Build only on observed need**; design now (§4), so scope is pre-frozen |
| (c) hybrid SSR | 4–8 wk | 5–20 | +D3 | high | No. OG-only stateless endpoint if ever needed. |
| (d) full dynamic | 4–6+ mo | 20–100+ | +D6 etc. | fatal | Never. giscus is the community experiment instead. |

---

## 3. UI/UX PER RUNG — what actually improves for a *study* site (the four-hats pass)

**System designer's note.** A study site's UX currency is: time-to-answer, trust, and continuity of practice. Accounts serve only the third.

### 3.1 Rung (a) UX specifics
- Install prompt appears **only** from an unobtrusive "⤓ install this workbench" item on the tools page — never a modal. (Respect: this site never nags; the identity is anti-dark-pattern.)
- Offline indicator: a small chip in the shared chrome ("● offline — everything still works") that flips state via `navigator.onLine` + SW events. This is an identity *advertisement*, not just status.
- Update toast: "A new edition is cached — reload to open it," dismissible, never auto-reloads (a student mid-calculation must never lose state).
- Search (Pagefind, §5.1) gets a `/` keyboard shortcut and a header slot in the shared chrome — the single largest daily-use UX win available at any rung.

### 3.2 Rung (b) UX specifics — what accounts honestly add vs. cost
- **Add:** a "library" drawer in the workbench: named charts, tags ("Lilly ex. 32", "my 1990 test chart"), last-opened; a sync dot (synced / local-only / offline-queued). Passkey sign-in is one biometric tap — no forms ever.
- **Cost, stated honestly in-product:** a first-run panel: "Sync stores a blob encrypted on your device, plus your passkey ID. The server holds only ciphertext. That's the entire record. Local-only mode remains complete." If that sentence ever stops being true, rung (b) has failed its design. (Do not phrase it as an absolute "we *cannot* read your data" — see the §4.5 caveat on what browser-delivered E2E can and cannot promise; the privacy page must carry that caveat.)
- **What accounts do NOT add for study:** no personalization of content, no gating, no profiles, no streaks/gamification (the learn page's medallions are self-tracked craft, not engagement mechanics — keep it that way).

### 3.3 Rung (c)/(d) UX — for completeness
- (c) adds: pasted links that show the chart. Real but small; study happens in the tool, not in the chat preview.
- (d) adds: shared study-group libraries + margin discussions. Genuinely new, genuinely valuable *if a community exists* — which giscus can test for ~an afternoon of static work.

### 3.4 Cross-cutting UX truths
- **The AI proxy (D10) is a UX regression in disguise:** BYOK's setup friction is real, but a hosted proxy converts "your birth data goes only where you point it" into "your birth data transits our server" — a trust downgrade a privacy-first study site cannot narrate away. Keep BYOK primary; at most, ship better BYOK onboarding (provider picker with free-tier notes — Groq's free tier already exists in `llm-core.js`).
- **Analytics UX:** if added (rung-independent), it must be visible: a public stats page (GoatCounter and Plausible both offer public dashboards) plus a footer line "self-hosted, cookieless, IP-anonymized counter — see the live dashboard." Invisible analytics would breach the identity even if technically clean; **Cloudflare Pages' server-side request counts need no script at all** and may be enough (§5.2).

---

## 4. BACKEND DESIGN — the rung-(b) service, fully specced (extends to (c) if ever needed)

Designed so that a competent dev could build it from this section without questions. **Nothing here is to be built yet.**

### 4.1 Stack decision

| Choice | Pick | Why (against alternatives) |
|---|---|---|
| Runtime/framework | **Hono** on whichever host is chosen | Web-standards only (Request/Response), ~14 KB, MIT, runs *unchanged* on Cloudflare Workers, Deno, Bun, and Node — meaning the hosting decision (§5) stays reversible. Fastify is excellent but Node-locked and plugin-heavy; it would marry us to a VPS. Hono is also the closest philosophical cousin to the repo: small, readable, standard, no build required (Deno/Bun run TS/ESM natively; on Node, plain-JS Hono needs no transpile). |
| Deno vs Node | **Either; prefer whatever the host natively runs.** | The repo's own modules are runtime-agnostic ESM (already proven in Node via `engine-test.mjs`; Deno runs them identically). Do not fork code per runtime. |
| Database | **SQLite** (better-sqlite3 on VPS / **D1** on Workers / **libSQL-Turso** if managed-serverless) | The data model is one table of small blobs — Postgres is a tractor for a flowerpot. SQLite file + **Litestream** streaming backup to R2/B2 is the proven solo-operator pattern (Litestream stable and maintained; LiteFS Cloud sunset Oct 2024 — avoid LiteFS). Turso free tier: 5 GB, 500M row-reads/mo; Developer $4.99/mo. D1 free: 5 GB, 5M rows-read/day. All three speak SQL; schema below ports verbatim. |
| Auth | **Passkeys first** (SimpleWebAuthn, MIT — `@simplewebauthn/server` runs on Node/Deno/Workers) **+ optional GitHub OAuth** as fallback for passkey-less devices | Passkeys = no password DB, no email requirement, phishing-proof, and the *minimum possible identity*: the user record is a credential public key. OAuth-only would leak "who studies astrology" to a third party as a hard requirement; as an *optional* fallback it's acceptable (GitHub is already in the project's orbit). **No magic-link email** — it forces collecting emails, the exact PII we refuse. |
| Engine reuse | `assets/js/core/**` imported **verbatim** — the server repo vendors or submodules the same files; the anti-drift test runs in server CI too. No port, no wrapper, no second implementation, ever. |

### 4.2 Data model (entire schema)

```sql
-- users: a passkey IS the account.
CREATE TABLE users (
  id            TEXT PRIMARY KEY,          -- uuidv7
  created_at    INTEGER NOT NULL,
  -- NOTHING ELSE. No email, no name, no picture.
  kdf_salt      BLOB,                      -- for passphrase-derived E2E key (nullable if PRF used)
  e2e_mode      TEXT NOT NULL DEFAULT 'passphrase'  -- 'passphrase' | 'prf' | 'none'
);
CREATE TABLE credentials (                 -- WebAuthn credentials, 1..n per user
  id            TEXT PRIMARY KEY,          -- credential ID (base64url)
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key    BLOB NOT NULL,
  counter       INTEGER NOT NULL,
  transports    TEXT
);
CREATE TABLE charts (                      -- the ONLY payload table
  id            TEXT PRIMARY KEY,          -- uuidv7
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  updated_at    INTEGER NOT NULL,          -- ms epoch; last-write-wins sync
  deleted       INTEGER NOT NULL DEFAULT 0,-- tombstone for sync
  label_ct      BLOB,                      -- AES-GCM ciphertext of the label (searchable client-side only)
  payload_ct    BLOB NOT NULL,             -- AES-GCM ciphertext of {inputs, notes} — NEVER plaintext birth data
  iv            BLOB NOT NULL
);
CREATE INDEX charts_user_updated ON charts(user_id, updated_at);
```

Deliberate absences: no analytics tables, no sessions table (stateless signed cookies / short-lived JWT in an httpOnly cookie), no admin flags, no soft "profile."

### 4.3 API surface

**Sync API (the whole rung-(b) product):**

```
POST   /v1/auth/register-options      → WebAuthn registration challenge
POST   /v1/auth/register              → verify attestation, create user+credential
POST   /v1/auth/login-options         → assertion challenge
POST   /v1/auth/login                 → verify assertion, set session cookie
POST   /v1/auth/logout
GET    /v1/charts?since=<ms>          → delta list [{id,updated_at,deleted,iv,label_ct,payload_ct}]
PUT    /v1/charts/:id                 → upsert (client-generated uuidv7; 409 if server updated_at newer — client merges by LWW)
DELETE /v1/charts/:id                 → tombstone
GET    /v1/export                     → the user's complete record as one JSON file (GDPR Art. 20)
DELETE /v1/account                    → hard-delete user + cascade (GDPR Art. 17), immediate
```

**Registry-derived compute API (rung (c) only — specced, not recommended now):** `core/registry.js` is already a machine catalog with typed `inputs[]` and `outputShape` per capability, and 12 entries flagged `callable: true` (the same flag that feeds `buildToolSchema()` for the LLM). A ~60-line generic handler turns it into REST *mechanically*:

```
POST /v1/cap/:id        body = inputs per REGISTRY[id].inputs   → the export's return value
GET  /v1/cap            → the registry itself (it already IS the OpenAPI-shaped catalog)
```

One handler validates `body` against `inputs[]` (types + enum values are already declared), dynamically imports `module`, calls `exportName`. The anti-drift test already guarantees the mapping can't rot. Add per-IP rate limiting (e.g. 60 req/min) and cache `GET`-able pure results by input hash. **This is the payoff of the registry discipline: the API is a projection, not a project.**

### 4.4 Privacy as a design constraint (non-negotiable requirements)

Birth data (date + time + place of birth) is **identifying PII** — the classic re-identification triple — and in an astrology context it additionally *implies belief/worldview*, adjacent to GDPR Art. 9 special categories. Treat it at the highest tier:

1. **Data minimization as architecture, not policy:** the schema above physically cannot store an email or name. The server never sees plaintext birth data in normal operation (E2E, §4.5). Logs: no bodies, IPs truncated to /24 (or dropped), 7-day retention.
2. **GDPR basics:** lawful basis = contract (the sync service itself) — no consent banners needed because there is nothing else to consent to; Art. 15/20 via `/v1/export`; Art. 17 via `/v1/account` DELETE (instant, hard); a plain-language privacy page enumerating the *entire* stored record (it fits in five lines — publish the schema itself); EU hosting (Hetzner Falkenstein/Nuremberg or Cloudflare with EU jurisdiction settings) simplifies transfer questions.
3. **No third-party anything in the served pages:** no CDN fonts, no tag managers, no error-reporting SaaS, no third-party analytics script — the site already complies; the backend must not regress it. Self-hosted analytics only, if at all (§5.2).
4. **Security floor:** TLS only (HSTS), httpOnly/SameSite=Strict session cookies, CSRF token on mutations, per-account rate limits, WebAuthn origin pinning, dependency count kept near-zero (Hono + SimpleWebAuthn + better-sqlite3 is the whole tree — auditable by one person in one sitting, the backend equivalent of readable-source).

### 4.5 E2E-encrypted saved charts (the option that makes rung (b) identity-safe — make it the default)

- **Key derivation, default path:** user sets a *sync passphrase* (distinct from auth); key = PBKDF2-SHA-256 (WebCrypto-native, ≥600k iterations, per-user salt) → AES-256-GCM. Pure WebCrypto, zero dependencies, works everywhere. (Argon2id would be preferable but needs WASM; acceptable v2.)
- **Progressive path:** the WebAuthn **PRF extension** derives the key from the passkey itself — no passphrase to forget — where supported (broad platform-authenticator support as of 2025–26); fall back to passphrase elsewhere. `users.e2e_mode` records the choice.
- **Consequence to state in the UI, honestly:** "If you lose your passphrase/passkey, your synced charts are unrecoverable — export backups. We can delete your data; we are architected not to read it." That sentence *is* the product (see the E2E-limits bullet below for why "architected not to" is the honest verb, not "can never").
- **Server plaintext mode (`e2e_mode='none'`):** do not offer it. One mode, no downgrade path, no support burden, no breach story.
- **The honest limit of browser-delivered E2E (state it; never market past it):** the encryption code is JavaScript the server ships on every page load. "E2E" here is therefore honest against a curious operator, a subpoena of the database, and a data breach — the stored record is ciphertext — but it is **not** a guarantee against a malicious or compromised code-server, which could serve key-exfiltrating script. The privacy page must say exactly this ("encrypted so the server stores only ciphertext; you are still trusting the code we serve — read it"). Mitigations that reduce but do not eliminate the gap: readable unminified source (already the site's identity), a versioned/pinned sync client, SRI where applicable. Any absolute "we can never read your data" claim would be an overpromise; the honest sentence is "we can delete your data but are architected not to read it."

### 4.6 What the backend explicitly will NOT do (scope freeze, written now so future-us can't creep)
No AI proxy (BYOK stays browser-direct; readings contain birth data and must not transit the operator). No community/comments (giscus handles that statically if wanted). No server astronomy for browsers that can compute locally (the engine ships to the client; the server computes only for rung-(c) previews if that day ever comes). No emails of any kind.

---

## 5. HOSTING & DOMAINS — step-by-step, with July-2026 prices (all cited in §9)

### 5.1 Static hosting (rung (a) — the current need)

| Host | Free tier (2026) | Fit |
|---|---|---|
| **GitHub Pages** (current) | 100 GB/mo soft bandwidth cap, 1 GB site, no overage charges (throttles instead) | Already wired via `pages.yml`. Fine until traffic grows; ~6 MB site ⇒ ~16k *fully-uncached* visits/mo before the soft cap, and real repeat traffic is far lighter (immutable assets + the PWA cache slash it). |
| **Cloudflare Pages** | **Unlimited bandwidth and requests on free**, 500 builds/mo, 100 custom domains | **The upgrade path**: keep GH as source of truth, connect the repo — no build command needed (output dir = repo root). Free server-side analytics without any script. Global CDN with proper cache headers for the big modules (below). |
| **Netlify** | **CORRECTED 2026-07-16:** Netlify moved to credit-based pricing (April-2026 pricing update) — free plan ≈300 credits (≈ ~15 GB bandwidth at 20 credits/GB ≈ $0.13/GB); the old "100 GB free + ~$55/100 GB overage" model is legacy and should not be cited as current | No advantage here; least generous free bandwidth of the three. Skip. |

**Step-by-step (static, recommended):**
1. Keep GitHub as canonical repo; keep GH Pages live during migration.
2. Cloudflare dashboard → Workers & Pages → Create → connect repo → framework preset "None", build command empty, output `/`. Deploys on push.
3. Cache tuning via `_headers` file at repo root (Pages honors it): `assets/js/lib/astronomy.js` and `assets/js/core/data/*` → `Cache-Control: public, max-age=31536000, immutable` **only if** filenames become versioned; otherwise `max-age=3600, stale-while-revalidate=86400`. HTML → `max-age=0, must-revalidate`. (The PWA SW makes client caching robust regardless; these headers serve the CDN.)
4. Custom domain: Pages → Custom domains → add `astrologersworkbench.example` → automatic TLS.

### 5.2 Serverless (rung (b) candidates)

| Platform | 2026 pricing | Fit for the tiny sync service |
|---|---|---|
| **Cloudflare Workers + D1/KV/R2** | Free: 100k req/day, 10 ms CPU/req; D1 5 GB + 5M rows-read/day; KV 1 GB; R2 10 GB. **Paid $5/mo**: 10M req + 30M CPU-ms; KV 10M reads then $0.50/M; R2 zero egress fees | **Best fit.** Hono is Workers-native; SimpleWebAuthn runs on Workers; D1 is SQLite-dialect (schema ports verbatim); R2 holds Litestream-style D1 exports. The free tier likely covers the site *forever* at study-site scale. Same dashboard as Pages. |
| **Deno Deploy** | **CORRECTED 2026-07-16** (deno.com/deploy/pricing): Free = 1M req/mo, **20 GB egress** (the 100 GB figure is stale), 1 GiB KV; first paid tier is Pro **$20/mo** (5M req, 200 GB). The "paused, not billed, on overrun" behavior is no longer stated on the pricing page — **UNVERIFIED; confirm before relying on it as a cost cap** | Second choice at best now: Hono runs unchanged, but free egress is thin and the pause-on-overrun safety net could not be re-verified. |
| **Fly.io** | No meaningful free tier anymore; smallest machine ~$2.02/mo, realistic small app $8–25/mo | Fine, but you're operating a VM-ish thing anyway — at that point Hetzner is cheaper and simpler. |
| **Railway** | $5 Hobby credit; realistic $10–27/mo | Comfortable DX, dearer than the need. |
| **Render** | Free static + $7 web service + $7 Postgres ⇒ ~$21–28/mo realistic | Over-provisioned for a blob store. |

### 5.3 VPS (rung (b) self-host alternative, and the analytics/monitoring home)

| Provider | 2026 price | Spec |
|---|---|---|
| **Hetzner CX22** | **CORRECTED 2026-07-16: ~€4.35–4.49/mo (≈$5)** — the €3.79 figure is stale. Mid-2026 sources (vpsfor.dev CX22 guide, updated 2026-05-21) list CX22 at ~€4.35/mo; Hetzner's 15-June-2026 price-adjustment page (docs.hetzner.com) shows its cloud table now starting at CX23 and prices Arm CAX11 at **€5.99/mo excl. IPv4** (up from €4.49) — so CAX11 is no longer the cheap alternative. **Verify exact SKU + price at order time** | 2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic, EU DCs |
| **Contabo** | from ~$4.50–4.95/mo | 4 vCPU, 8 GB, 200 GB NVMe — more metal, historically noisier neighbors/support; fine for non-critical |

A CX22 comfortably runs: Caddy (auto-TLS) + the Hono sync service + SQLite + Litestream + GoatCounter + Uptime Kuma — the *entire* rung-(b) estate plus observability, ~€45/yr.

**VPS hardening checklist (execute top-to-bottom on first boot):**
1. Create non-root sudo user; SSH keys only (`PasswordAuthentication no`, `PermitRootLogin no`); move SSH off 22 if you like tidy logs (not security).
2. `ufw default deny incoming; allow 80,443,<ssh>`; enable.
3. `fail2ban` (sshd jail) or SSH behind Tailscale entirely (then close the SSH port publicly).
4. Unattended-upgrades (security channel) + needrestart.
5. Caddy as the only listener; every service else binds 127.0.0.1.
6. systemd units with `DynamicUser=yes`, `ProtectSystem=strict`, `ReadWritePaths=` for the data dir.
7. Litestream → Cloudflare R2 (10 GB free, zero egress) with a **restore drill in the calendar** (quarterly: `litestream restore` to a scratch dir, run the engine-test against it).
8. Nightly `sqlite3 .backup` + `tar` of `/etc/caddy` to a second location (restic to B2 or Hetzner Storage Box).
9. Uptime Kuma (MIT, self-hosted) on the same box monitors the *public* URLs + a dead-man's-switch check from a free external ping (e.g., a Cloudflare Worker cron hitting Kuma's push monitor) — a monitor on the box can't see the box die.
10. Journald log limits (`SystemMaxUse=200M`); no request-body logging anywhere (§4.4).

### 5.4 Domain, DNS, TLS, email — step by step

**Registrar comparison (.com, 2026):** Cloudflare Registrar **$10.44/yr at cost** (requires using Cloudflare DNS; no markup ever); Porkbun **$11.08/yr** (porkbun.com/tld/com, checked 2026-07-16; registration = renewal, free WHOIS privacy); Namecheap $5.98 first year but **$13.98 renewal** — first-year bait, skip. All three include WHOIS privacy free. **Pick:** Porkbun if you want registrar-DNS independence; Cloudflare if you're on CF Pages/Workers anyway (one dashboard, at-cost forever). Given §5.1's recommendation, **Cloudflare**.

1. Register domain (Cloudflare → Domain Registration → search → pay $10.44; WHOIS redaction automatic).
2. DNS: zone auto-created. `CNAME @ → <project>.pages.dev` (CF flattens apex CNAMEs), `CNAME www → @`, later `CNAME api → <worker route or VPS A record>`.
3. TLS: automatic on Pages/Workers. On a VPS, Caddy issues Let's Encrypt on first request — zero config beyond the domain in the Caddyfile. Set CF SSL mode **Full (strict)** if proxying to the VPS.
4. **Email forwarding (no mailbox needed):** Cloudflare Email Routing — free, unlimited forwarding `hello@domain → whatswrong.inc@gmail.com`; add the auto-generated MX/SPF records with one click. (Porkbun equivalently offers free email forwarding.) **Never send** from the domain (no SMTP to secure, no DMARC saga) — the backend sends no email by design (§4.6).
5. Set registrar auto-renew ON + calendar reminder; enable registrar transfer-lock; enable DNSSEC (one click on CF).

### 5.5 Cost tables — three traffic tiers (monthly, USD, July-2026 prices)

Tier definitions: **T1 hobby** ≈ 100 visits/day; **T2 study-community** ≈ 2k visits/day; **T3 spike/popular** ≈ 20k visits/day (a HN/Reddit month).

**Rung (a) — static + PWA + Pagefind:**

| Item | T1 | T2 | T3 |
|---|---|---|---|
| Hosting (CF Pages free / GH Pages) | $0 | $0 | $0 (unlimited bandwidth on CF free) |
| Domain (amortized $10.44/yr) | $0.87 | $0.87 | $0.87 |
| **Total** | **$0.87** | **$0.87** | **$0.87** |

**Rung (b) — + tiny sync backend, serverless (CF Workers + D1 + R2):**

| Item | T1 | T2 | T3 |
|---|---|---|---|
| Workers/D1/R2 | $0 (free tier) | $0–5 (paid plan if >100k req/day bursts) | $5 (+pennies of overage) |
| Domain | $0.87 | $0.87 | $0.87 |
| **Total** | **$0.87** | **$0.87–5.87** | **~$6–8** |

**Rung (b) — self-hosted variant (Hetzner CX22 + R2 backups + Kuma + GoatCounter):**

| Item | T1 | T2 | T3 |
|---|---|---|---|
| CX22 | ~$5 (€4.35–4.49, post-2026 adjustments) | ~$5 | ~$5 (20 TB traffic ≫ need) |
| R2/B2 backup storage | $0 (≤10 GB free) | $0 | $0–1 |
| Domain | $0.87 | $0.87 | $0.87 |
| **Total** | **~$5.90** | **~$5.90** | **~$7** |

(Rung (c) would add $5–20; rung (d) $20–100+; both rejected in §2.)

### 5.6 CDN/caching notes for the big modules
The heavy files are `lib/astronomy.js` (412 KB) and `core/data/*` (~1.5 MB aggregate). On CF Pages they're edge-cached automatically; the wins available *without* any bundler: (1) ensure long `max-age` via `_headers` (§5.1); (2) the PWA SW makes repeat loads zero-network; (3) if first-visit weight ever matters, `modulepreload` hints in the shared chrome for the critical chain — still no build step. **Do not** introduce hashing/bundling for this; the site is 6 MB total, smaller than one average news article.

---

## 6. BEST OPEN TOOLS — licence / self-hostable / fit

### 6.1 Search — **Pagefind: adopt NOW, while static** ✅
MIT-licensed CLI; runs *after* any build (here: over the checked-out HTML itself), emits `pagefind/` — a lazy-loading WASM searcher + sharded index; full-text search of all of MDN costs <300 KB transferred, so this ~90-page site will be tens of KB per query. **Zero servers, works offline once the SW caches the shards.** Fits the no-build rule the same way `gen-precache.mjs` would: an optional pre-deploy script (`npx pagefind --site .`), or run in the Pages CI step. Integration: a search box in the shared chrome (`app/shared.js`) + `/` hotkey; index `data-pagefind-body` on the prose containers so tool UIs don't pollute results; glossary terms get `data-pagefind-meta`. **Later, if ever dynamic:** Meilisearch (MIT, self-hostable, ~easy ops) over Typesense (GPL-3.0, also fine) — but Pagefind likely suffices permanently at this corpus size.

### 6.2 Analytics — only if curiosity demands, and self-hosted only
- **GoatCounter** — EUPL-1.2, single Go binary, SQLite, runs in ~nothing, public dashboard option, no cookies. **Best fit** if analytics are wanted (pairs with the VPS; or its hosted free tier for non-commercial use).
- **Umami** — MIT, Node + Postgres; heavier, prettier.
- **Plausible CE** — AGPL, needs ClickHouse + Postgres (~2 GB RAM floor) — over-spec here.
- **Zeroth option (prefer):** Cloudflare Pages' request analytics = zero scripts, zero PII decisions, answers "which pages get read." Start there; add GoatCounter only if page-level referrer detail proves necessary. Whatever is chosen: public dashboard + footer disclosure (§3.4).

### 6.3 Comments/annotations — the community experiment without a backend
- **giscus** — MIT, self-hostable, stores threads in the repo's **GitHub Discussions**; no database, no tracking; commenting requires GitHub OAuth (a real barrier, but this audience overlaps GitHub heavily). Fit: enable on `library/`, `greatworks/`, and chapter hubs as a low-stakes experiment; loads lazily so offline pages simply omit it. This is the **canary for rung (d)**: if Discussions stay empty for six months, community demand is answered.
- **Hypothes.is** — client BSD-2-Clause, self-hostable server (complex); the public service overlays annotations on any URL *without site cooperation* — worth a "study-group tip" note in the docs rather than an embed (embedding adds a third-party iframe, breaching the no-third-party rule).

### 6.4 Image pipeline + open image sources (for the learn diagrams, §6.6/§7)
- **Tools:** sharp (Apache-2.0, libvips-based) for raster resize/AVIF; **SVGO** (MIT) for the SVG diagrams the site should prefer; libvips (LGPL-2.1+) directly if batch-processing scans. All as optional pre-deploy scripts, never a build dependency.
- **Sources (all license-clean for a cited site):**
  - **Wikimedia Commons** — per-file licenses (favor PD/CC0/CC-BY): historical ephemeris pages, Regiomontanus/Lilly portraits, armillary spheres.
  - **The Met Open Access** — CC0, ~492k images: astrolabes, celestial globes, zodiac artifacts.
  - **Cleveland Museum of Art Open Access** — CC0 (~37k+ images): manuscript leaves, talismanic objects.
  - **Rijksmuseum** — public-domain images, free high-res via Rijksstudio/API: celestial cartography (their atlas holdings are superb).
  - **Internet Archive** — scans of Lilly 1647, DeVore, Michelsen-era table books, AFA lessons where PD — *primary-source screenshots for the handcalc lessons*, each with the citation string the site's discipline already mandates.
  - **Public-domain star atlases** (Urania's Mirror via Commons) for M2's celestial-sphere plates.
- **Generated line-art strategy:** the site already renders SVG chart wheels (`core/chart.js`) — extend the same visual voice (thin strokes, the existing CSS custom-property palette so diagrams follow light/dark themes, serif labels) into a small `assets/img/diagrams/*.svg` set, hand-written or scripted via the engine itself (e.g., the combustion-zones diagram is *generated from the actual orb constants in the code* — diagrams that cannot drift from the engine, the visual analog of the registry anti-drift test).

### 6.5 Location/timezone atlas — GeoNames + IANA tzdb
GeoNames: **CC-BY 4.0** (attribution required — add to the citations page), 25M names / 4.8M populated places; `cities500`, `cities15000` extracts; each row carries the IANA timezone id. **Static tier (recommended now-ish):** trim to name/ascii/lat/lon/country/admin1/tz/population for cities ≥15k + all admin seats ⇒ ~25–40k rows, ~1–2 MB gzipped JSON shard set, client-side prefix search; historical-LMT caveats become handcalc *content* ("before zones, clocks were local mean time — compute the offset from longitude, as the old books teach"). **Dynamic tier (rung b+):** full 2.5M places in SQLite FTS5 behind `GET /v1/atlas?q=` — one table, one endpoint, fits the same tiny backend. Timezone *history* (pre-1970 offsets) needs tzdb's full ruleset: client-side via the compiled IANA data in a ~30 KB slice, or punt with the documented LMT method — flag both positions, per the site's discipline.

### 6.6 Swiss Ephemeris — the honest licence analysis
Swiss Ephemeris is **dual-licensed: AGPL-3.0 or a paid professional licence**. **CORRECTED 2026-07-16:** astro.com's current price list (astro.com/swisseph/swephprice_e.htm) sells a single **unlimited Professional Edition licence at CHF 700** (one-time; signed licence contract, software downloaded from the public GitHub repo). The older "CHF 750 first / CHF 400 each additional / CHF 1550 unlimited; 99-year term" tiering no longer appears on the price page — do not cite it. Consequences, honestly:
- **Client-side WASM use:** distributing it makes the combined work AGPL-encumbered; this repo's identity is MIT-friendly readable-source, and grafting AGPL onto a teaching codebase muddies what students may copy.
- **Server-side use is exactly what AGPL §13 targets:** serving computations over a network triggers the source-offer obligation for the whole service. Compliance is *possible* (the site is source-open anyway) but it entangles every future file with AGPL analysis, and the professional licence (CHF 700) buys out a problem the site doesn't have.
- **The decisive fact is precision economics:** astronomy-engine's ≈1 arc-minute already exceeds every historical table the curriculum teaches from; the handcalc pedagogy *celebrates* small deltas. Swiss Ephemeris' arc-seconds would improve nothing a student can perceive. **Recommendation: stay on astronomy-engine (MIT). Revisit only if the site ever needs asteroids/8000-year spans, and then prefer the paid licence over AGPL contamination — or better, JPL's public ephemeris data directly.**

### 6.7 Decap CMS — if content editing ever needs a UI
MIT, static-admin panel (`/admin`) committing to git via GitHub OAuth. Honest assessment: this repo's content is hand-crafted HTML with heavy cross-linking and an autolinker — a CMS would fight the architecture. **Skip unless a non-technical co-author joins.** (Noted for completeness because the question will recur.)

---

## 7. LEARN-THE-MATH × CAST-IT-YOURSELF INTEGRATION — deep plan (works fully static; flagged as such throughout)

**Everything in this section runs on the current architecture. No server. It is the highest-value work available to the project right now.** The raw materials already exist: `core/handcalc.js` (382 lines, pure, delta-checking — "the deltas ARE the pedagogy"), `pages/learn.html` (8 modules, 62 lessons, localStorage ticks via `app/learn.js`), `pages/handcalc.html`, the workbench, and 64 registry capabilities with typed inputs.

### 7.1 Guided cast-alongs — the spine feature
A new page-mode (`pages/learn/cast-along.html?ex=A&step=3` — URL-state via the existing `encodeState`) that walks one chart from clock-time to finished figure in ~9 stations, where **the student computes each station by hand and the engine checks their delta**:

1. Clock → UT (zone, DST, the longitude/15 rule for pre-zone dates)
2. UT → LST (midnight-ephemeris method: ST@midnight + interval + acceleration ± longitude/15 — already in `handcalc.js` with the 9.8565 vs 9.8333 s/h discrepancy flagged)
3. LST → RAMC → Asc/MC (book-of-tables double interpolation vs `astro.js` trig)
4. House cusps (Regiomontanus/Placidus table lookup vs engine)
5. Planet positions by linear interpolation (`plog` addition vs multiplication — DeVore's .22034/.50035 → 4°34′ example is already pinned in the code)
6. The Moon's 2–3′ interpolation error — *measured live* by the student
7. Node, Part of Fortune, sect
8. Dignity ledger for one planet (against `essentialDignity`)
9. The finished wheel vs the engine's wheel, overlaid, with every per-station delta summarized

**Interaction contract per station:** input field(s) in the units the old books use (h m s / ° ′) → "check" → the engine shows `your value / engine value / Δ / verdict` where the verdict is *graded honestly*: green "within book tolerance" (each station's tolerance is a cited constant, e.g., Moon interpolation ±3′), amber "arithmetic slip — here's the step that diverged" (the engine recomputes with the student's intermediate to localize the error), red "method error — reread the rule." The divergence *explanation* is the teaching moment and reuses handcalc's existing delta framing. Worked examples A, B-Moon, B-Sun, D are **already pinned as vectors in `engine-test.mjs`** — the cast-alongs inherit verified ground truth for free.

### 7.2 Step-revealing worked examples
For each cast-along station, a `<details>`-ladder: attempt → hint (the rule restated) → the full worked line (as the old books typeset it) → the engine's modern equivalent → "why they differ." Progressive disclosure, no JS required for the reveal (native `<details>` — consistent with learn.js's progressive-enhancement stance).

### 7.3 Drill generators with deterministic seeds
A new pure module `core/drills.js` (headless-testable like everything in core): `makeDrill(type, seed)` → `{prompt, inputsShown, answerFn}` using a tiny seeded PRNG (mulberry32; seed = hash of `type:date:n` so "today's drills" are shared/reproducible and a permalink `?drill=dignity&seed=2026-07-16:3` reconstructs exactly — the site's URL-state pattern again). Drill types, each checkable by an *existing* engine export:

| Drill | Checks against | Registry capability |
|---|---|---|
| Dignity ledger for random planet/lon/sect | `essentialDignity` | `essential-dignity` |
| LST from random date/place | `handcalc` LST chain | (handcalc) |
| plog interpolation (random daily motion + interval) | `plog` helpers | (handcalc) |
| Aspect + orb + applying/separating from two positions | `aspects.js` | aspects capability |
| House placement from cusps + lon | `houses` | `positions` |
| Ayanāṁśa arithmetic (tropical→sidereal) | `vedic.js` | vedic capability |
| Planetary hour for random moment | `planetaryHour` | planetary-hours capability |

Wrong answers get the localize-the-slip treatment where the computation is multi-step. **Every drill cites the rule's source** (the data modules already carry citations — surface them in the drill footer).

### 7.4 Progress model — localStorage now, sync-shaped for later
Extend to `awb-learn-progress-v2`:
```js
{ v: 2, updated_at: 1720000000000,           // ms epoch — the future LWW sync key
  lessons: { "m4-plog": { done: true, at: … } },
  drills:  { "dignity": { attempts: 12, correct: 9, streakBest: 5, lastSeed: "…" } },
  casts:   { "ex-A": { station: 6, deltas: {…}, completedAt: null } } }
```
Migration shim reads v1 ticks forward. The record is deliberately one JSON blob with a top-level `updated_at` — **exactly the ciphertext payload shape of §4.2's `charts` table**, so if rung (b) ever arrives, learn-progress sync is the same PUT with a different label. Include export/import buttons on learn.html now (a JSON file) — cross-device "sync" by hand, today, and the GDPR-export habit before there's even a server.

### 7.5 Diagrams per learn module — the named list (built per §6.4's generated-line-art strategy; static SVGs, engine-generated where constants are involved)

| Module | Diagrams needed |
|---|---|
| **M1 Orientation** | (1) The two-layer diagram: "verifiable astronomy" layer vs "interpretive claims" layer with the honesty boundary drawn as a literal line; (2) site map as a constellation chart (pages as stars, links as asterism lines). |
| **M2 Sphere & math I** | (3) Celestial sphere cutaway: equator, ecliptic, obliquity angle, equinox points; (4) the LST clock-face: solar vs sidereal day, the 3m56s gain; (5) chart-wheel anatomy exploded view (ring by ring); (6) horizon/meridian → Asc/MC on the sphere. |
| **M3 The chart** | (7) zodiac ring with domicile rulers as chords (the classic Thema Mundi symmetry); (8) the twelve houses as mundane wedges with angular/succedent/cadent shading; (9) aspect polygons inscribed in the circle (trine triangle, square square…) with Lilly's moiety-orbs as shaded bands. |
| **M4 Math II** | (10) an annotated ephemeris page facsimile (Internet Archive scan + overlay callouts); (11) the plog curve — log10(1440/min) plotted, with DeVore's worked lookup drawn on it; (12) Regiomontanus cusp construction: celestial equator divided, house circles through north/south points; (13) ΔT over 2000 years (engine-plottable); (14) the interpolation-error diagram: the Moon's true arc vs the chord (why 2–3′). |
| **M5 Judgement grammars** | (15) the dignity ledger as a stacked scoring bar; (16) combustion zones: cazimi/combust/under-beams as concentric arcs around the Sun *generated from the engine's orb constants*; (17) the planetary-hours week grid (Chaldean order spiral); (18) perfection flows: translation & collection as three-planet timeline diagrams; (19) the election checklist as the flowmap style the CSS already has; (20) hyleg hunt flowchart. |
| **M6 The other zodiac** | (21) the two zodiacs as concentric rings rotating apart, ayanāṁśa as the growing angle (engine-generated for any date); (22) the 27-nakṣatra ring overlaid on the 12 signs; (23) a Vimśottarī daśā timeline bar for a sample life; (24) D1→D9 varga mapping diagram. |
| **M7 Symbol systems** | (25) kamea construction animation-as-steps (3×3 Saturn square, the knight's-move fill); (26) Tree of Life with the planetary sephirot highlighted (kabbalah.js data already encodes this); (27) a decan strip: one sign → three faces with the Picatrix image text beside open-access artifact photos; (28) oracle probability trees: I Ching three-coin (1/8,3/8,3/8,1/8) vs yarrow, tarot draw-without-replacement. |
| **M8 Research layer** | (29) the Gauquelin key-sectors histogram, real shape vs null (the honest-science centerpiece — actual published data, cited); (30) Jupiter–Saturn conjunction triangle (the ~800-yr trigon rotation) for the cycles module; (31) the scanner/orchestrator dataflow: registry → engines → confluence, drawn from the registry itself. |

Diagram build order: 16, 11, 14, 21, 28 first (they're engine-generated and serve the drills directly), then M2's sphere set (they unblock the earliest lessons), then the rest.

### 7.6 Wiring into existing pages
- `learn.html` lesson nodes gain "⚒ practice this" links → drill permalinks; module medallions count drills as well as ticks (v2 model).
- `handcalc.html` gains the cast-along mode toggle (its engine already computes everything; the new work is staging + the per-station check UI).
- The workbench gains "study mode": hovering any panel shows "compute this by hand — M4·L3" links back into the curriculum (the registry's `pages` + `howItWorks` fields already encode the mapping — again the catalog pays out).

---

## 8. DECISION MEMO (§7 of the task) — the recommendation, argued

**Recommendation: Path A — stay static. Ship, in order: (1) Pagefind search, (2) the PWA, (3) the learn×handcalc integration (§7), (4) the static GeoNames atlas tier, (5) optionally giscus on library pages as the community canary. Design rung (b) is done (this document, §4); build it only on an observed trigger.**

**The argument, not the assumption:**
- *For going dynamic now:* sync (D2) is a real convenience; a chart library that survives browser resets is genuinely kinder; OG previews aid discovery; an atlas API is the JHora-parity gap. These are real, not strawmen.
- *Why they still lose:* (1) Every high-frequency user need — search, offline, practice, atlas-for-humans — has a **zero-server solution of equal or better quality** (§1.2's asymmetry). (2) The identity is the product: "no account, no server, nothing leaves your machine" is a *feature users can verify by reading the source*, and it is this site's rarest property; rung (b) spends some of it, rungs (c)/(d) spend all of it. (3) The cost of being wrong is asymmetric: building the backend later costs the same 2–3 weeks it costs now (§4 is pre-designed; the isomorphic core guarantees no rot), but building it *early* costs an operations tax forever on a site with zero observed demand for it. (4) The learn integration (§7) is worth more study-value per hour than any rung of the ladder — and it's static.
- **Triggers that would justify building rung (b)** (write them down so the decision is mechanical, not moody): ≥3 unsolicited user requests for cross-device sync or recovered-chart help; or a study group of ≥5 people actually forms (giscus canary); or the author personally loses meaningful chart data to localStorage eviction twice. Until a trigger fires, the answer is no.
- **Migration order when a trigger fires:** domain + CF Pages first (they're rung-(a) improvements anyway) → Workers+D1 sync service per §4 (scope-frozen, E2E-default) → learn-progress sync (same blob shape, §7.4) → stop. Re-argue anything further from scratch against this memo.

**What must NEVER change, whatever rung is ever reached (the invariants):**
1. **Offline-first:** every calculator and lesson fully functional with the network cable cut. Server features may only ever be additive conveniences with graceful absence.
2. **Readable-source:** no build step required to develop or to understand; optional pre-deploy scripts only (`engine-test.mjs`'s existing category); no framework; a student can View-Source their way to comprehension.
3. **Privacy-absolute:** no third-party scripts/fonts/trackers on any page, ever; birth data never stored server-side in plaintext (E2E or nothing); BYOK stays browser-direct; any analytics self-hosted, disclosed, and public.
4. **The honest-science frame:** locked, at every rung — including moderation policy if community ever exists, and including marketing copy on any future landing page.
5. **The isomorphic pure core with the cited-data discipline and the registry anti-drift test** — it is what makes every branch of this document cheap; it must never grow a DOM or a network dependency.

---

## 9. SOURCES

**Hosting & platform pricing (July 2026):**
- Cloudflare Workers pricing (paid $5/mo, 10M req; free 100k req/day; KV/D1/R2 tiers): https://developers.cloudflare.com/workers/platform/pricing/ ; https://www.cloudflare.com/plans/developer-platform/ ; https://developers.cloudflare.com/kv/platform/pricing/ ; corroborated by https://www.srvrlss.io/provider/cloudflare/
- Cloudflare Pages free: 500 builds/mo + 100 custom domains/project, no bandwidth limit stated (VERIFIED 2026-07-16 https://developers.cloudflare.com/pages/platform/limits/); GitHub Pages 100 GB/mo soft cap + 1 GB site (VERIFIED https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); Netlify: credit-based plans since April 2026, ~20 credits/GB — legacy "$55/100 GB" no longer current (https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/ ; https://www.netlify.com/pricing/)
- Deno Deploy free tier (VERIFIED 2026-07-16: 1M req/mo, **20 GB egress** — 100 GB figure stale; Pro $20/mo; pause-on-overrun no longer stated, UNVERIFIED): https://deno.com/deploy/pricing ; https://docs.deno.com/deploy/pricing_and_limits/
- Fly.io / Railway / Render 2026 comparisons ($2.02 smallest Fly machine; Railway ~$10–27; Render $7+$7): https://hostim.dev/blog/render-vs-railway-vs-fly-pricing/ ; https://expresstech.io/render-vs-railway-vs-fly-io-2026-pricing-showdown/ ; https://techsy.io/en/blog/railway-vs-render-vs-fly-io
- Hetzner CX22 **~€4.35–4.49/mo after the 2026 adjustments** (VERIFIED 2026-07-16: the 15-June-2026 adjustment page's cloud table starts at CX23 and lists CAX11 at €5.99/mo excl. IPv4; CX22 ~€4.35 per vpsfor.dev, updated 2026-05-21 — the €3.79 figure is stale): https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ ; https://vpsfor.dev/posts/hetzner-cx22-pricing-2026/ ; https://www.hetzner.com/cloud/regular-performance
- Contabo entry VPS ~$4.50–4.95/mo, 4 vCPU/8 GB/200 GB NVMe: https://contabo.com/en-us/vps/ ; https://cybernews.com/best-web-hosting/contabo-review/pricing/
- Turso/libSQL pricing (free 5 GB/500M reads; Developer $4.99): https://turso.tech/pricing ; Litestream status & LiteFS Cloud sunset: https://suparbase.com/blog/sqlite-at-the-edge-2026 ; https://solodevstack.com/blog/sqlite-vs-turso-solo-developers

**Domains:**
- Cloudflare Registrar $10.44/yr at-cost ($10.26 Verisign wholesale + $0.18 ICANN; VERIFIED 2026-07-16, registration = renewal); Porkbun **$11.08** flat (VERIFIED https://porkbun.com/tld/com); Namecheap $5.98/$13.98 first/renewal (secondary sources only — spot-check at order time): https://cfdomainpricing.com/ ; https://domaindetails.com/registrars/cheapest ; https://porkbun.com/products/domains

**Tools & licences:**
- Pagefind (MIT; MDN <300 KB; sharded WASM index): https://pagefind.app/ ; https://cloudcannon.com/blog/introducing-pagefind/ ; https://staticsignal.io/posts/static-site-search-with-pagefind/
- Analytics — Plausible CE (AGPL, ClickHouse+Postgres, ~2 GB RAM), Umami (MIT, Postgres), GoatCounter (EUPL-1.2, single binary, SQLite): https://openpanel.dev/articles/self-hosted-web-analytics ; https://aaronjbecker.com/posts/umami-vs-plausible-vs-matomo-self-hosted-analytics/ ; https://makerstack.co/reviews/goatcounter-review/ ; https://dasroot.net/posts/2026/03/privacy-preserving-analytics-plausible-umami-goatcounter/
- giscus (MIT, GitHub Discussions backend, self-hostable, no tracking): https://github.com/giscus/giscus ; https://giscus.app/
- Hono (MIT, web-standards, 14 KB, Workers/Deno/Bun/Node) vs Fastify (Node-locked): https://hono.dev/ ; https://kanopylabs.com/blog/hono-vs-express-vs-fastify ; https://encore.dev/articles/nestjs-vs-fastify-vs-hono
- SimpleWebAuthn (MIT, browser+server, Node/Deno/Workers): https://github.com/MasterKale/SimpleWebAuthn ; https://simplewebauthn.dev/
- Swiss Ephemeris dual licence — AGPL-3.0 or professional; **current price list = CHF 700 unlimited licence, one-time** (VERIFIED 2026-07-16 https://www.astro.com/swisseph/swephprice_e.htm — the 750/400/1550 + 99-yr tiering is no longer listed): https://www.astro.com/swisseph/swephinfo_e.htm ; https://github.com/aloistr/swisseph/blob/master/LICENSE
- GeoNames CC-BY 4.0, 25M names / 4.8M populated places, IANA tz per place: https://www.geonames.org/export/ ; https://www.geonames.org/about.html
- Open-access image sources: Met Open Access (CC0) https://www.metmuseum.org/about-the-met/policies-and-documents/open-access ; Cleveland Museum Open Access (CC0) https://www.clevelandart.org/open-access ; Rijksmuseum https://www.rijksmuseum.nl/en/research/conduct-research/data ; Wikimedia Commons https://commons.wikimedia.org ; Internet Archive https://archive.org
- Uptime Kuma (MIT, self-hosted monitoring): https://github.com/louislam/uptime-kuma ; sharp (Apache-2.0) https://sharp.pixelplumbing.com ; SVGO (MIT) https://github.com/svg/svgo ; libvips (LGPL-2.1+) https://www.libvips.org ; Meilisearch (MIT) https://github.com/meilisearch/meilisearch ; Typesense (GPL-3.0) https://github.com/typesense/typesense ; Decap CMS (MIT) https://decapcms.org

**Repo facts:** measured directly from the working tree at `d12500f` (file counts, sizes, registry/callable counts, learn module inventory, `engine-test.mjs` Node imports, `llm-core.js` BYOK endpoints, `state.js` URL-state, `learn.js` localStorage model).

**Adversarial verification pass (2026-07-16) — confirmed as stated:** Cloudflare Workers free 100k req/day + 10 ms CPU, paid $5/mo with 10M req + 30M CPU-ms, KV free 1 GB / paid 10M reads then $0.50/M (developers.cloudflare.com/workers/platform/pricing/); Turso free 5 GB + 500M row-reads/mo, Developer $4.99/mo (turso.tech/pricing); Fly smallest machine ~$1.94–2.32/mo, no free tier for new orgs; Pagefind MIT (github.com/Pagefind/pagefind); Plausible CE AGPL-3.0-or-later, tracker script separately MIT (github.com/plausible/analytics); GeoNames CC-BY with attribution required (geonames.org/export/); astronomy-engine MIT — verified in the vendored file header `assets/js/lib/astronomy.js` lines 1–33. **Corrected this pass:** Swiss Ephemeris professional price, Hetzner CX22 price, Deno Deploy egress, Netlify pricing model, Porkbun cents — see the annotated lines above and §5/§6.
