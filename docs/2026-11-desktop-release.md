# Desktop workbench: release preparation

Date: 2026-11-04. Source branch: `feat/desktop-astrology-workbench`. Baseline: `39d622394bed9f8d370695502a9e753478695434`, equal to remote `main` when checked. The new entry is `pages/desktop.html`; the original homepage and specialist routes remain in the artifact.

## Publication plan

GitHub Pages hosts one site for this repository. Publishing the feature branch replaces that site with the complete tested branch snapshot; it does not create a separate branch hostname and does not merge the branch into `main`. Existing routes are retained in that snapshot. The intended new entry is:

<https://occult-kranti.github.io/astrology-sim-ant/pages/desktop.html>

This is an intended destination, not a claim that this revision is already live. The root completion handoff must record the actual commit, workflow result and published `release.json` identity.

The workflow accepts pushes from `main` and the exact desktop branch, as well as its existing manual dispatch. Artifact construction, upload and deployment each require a non-pull-request event and one of those exact refs. All inherited engine, protocol, source, browser and horizon-stress gates remain; the desktop numerical/library checks and desktop browser journey are additional. Deployment still depends on every required job. A live route check for the desktop page supplements the existing release and route checks.

The web app manifest preserves its `start_url` and adds Desktop workbench and Calendar Atlas shortcuts. The service worker cache version advances for this edition. Its curated shell adds the desktop page, stylesheet and five new modules; their shared canonical dependencies remain lazy-cached. Prepare the explicit full offline library for complete static-tool coverage, rather than assuming an unvisited tool is available offline from installation alone. The existing public-only offline inventory generator requires deliberate Git additions and excludes private profiles, local exports, credentials and untracked research materials. The portable archive now recommends the desktop entry while retaining directions to the private birth reader and original homepage.

## Observed GitHub access

- Normal `gh` authentication succeeds; remote Git read access succeeds. A `git push --dry-run` to the exact feature branch succeeds; it does not create the remote branch.
- Pages reports `build_type: workflow`, HTTPS enabled, and the existing site URL above. Its legacy source field still names `main`; workflow deployment is the active publication mechanism.
- The `github-pages` environment has a custom deployment branch policy allowing only `main`.
- An authorized attempt to add the exact `feat/desktop-astrology-workbench` branch via the supported GitHub REST deployment-branch-policy endpoint failed with **HTTP 403: Resource not accessible by integration**. The policy was reread and remains unchanged. This is a GitHub integration permission limitation, not an automatic approval-review rejection.
- Repository permission metadata reports administrative permissions for the account, but the active integration does not authorize this administrative endpoint. No credential contents were inspected or exposed.

## Required owner setting for feature-branch deployment

Open repository **Settings → Environments → github-pages → Deployment branches and tags → Add deployment branch rule**. Add the exact branch:

```text
feat/desktop-astrology-workbench
```

Keep the existing `main` rule. No broad wildcard or change of deployment environment is needed. The tested workflow may then be rerun or dispatched for the feature branch.

The source branch can be pushed and verified before this administrative setting is changed. Successful verification/artifact upload alone does not mean publication succeeded. Do not report deployment complete until the environment accepts the job and the live `release.json` commit matches the verified candidate.

## Release commands after the candidate is committed and checked

```bash
git push -u origin feat/desktop-astrology-workbench
gh run list --repo occult-kranti/astrology-sim-ant --branch feat/desktop-astrology-workbench --limit 5
# After enabling the exact branch in the environment, rerun the relevant run:
gh run rerun <run-id> --repo occult-kranti/astrology-sim-ant --failed
# Or dispatch the retained workflow on the feature branch:
gh workflow run pages.yml --repo occult-kranti/astrology-sim-ant --ref feat/desktop-astrology-workbench
```

The deployment job already checks HTTPS, matching release identity, the desktop route, retained Studio, calendar comparison and MCP catalogue.

## Preparation checks

The modified workflow parses as YAML. Every inherited named step and Node/npm/Python command remains; the added browser step and two numerical commands are present. All four artifact/deployment condition sites retain pull-request exclusion and the exact two-branch allowlist. The manifest parses as JSON and retains its original start URL. Service-worker JavaScript and portable-packager Python syntax checks pass. Actual application and release verification are recorded separately by the integrating agent.
