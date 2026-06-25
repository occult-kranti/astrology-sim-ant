---
name: ship-bundle
description: Ship this repo's changes so they apply cleanly for the maintainer/next model. Use when asked to push, hand off, bundle, or deliver changes. Prefers a direct push to origin/main (which works in this container); if push is ever blocked, produces a git bundle that fast-forwards from the current origin/main tip — the procedure that avoids the merge conflicts earlier rounds hit.
---

# ship-bundle — deliver changes without merge pain

## 0. Pre-flight
Run the **verify-site** skill first. Never ship a red gate. Ensure `*.bundle` is gitignored
(it is) so bundles never get committed.

## 1. Commit
```bash
git config user.email "noreply@anthropic.com"; git config user.name "Claude"
git add -A
git -c commit.gpgsign=false commit -m "<concise message>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do **not** `--amend`/`rebase` already-shared commits — it changes SHAs and breaks any bundle
prerequisite. The "Unverified" badge (no SSH signing here) is cosmetic; ignore it.

## 2. Preferred: direct push (works in this container)
```bash
git fetch origin
git push origin main        # if on main; else open a PR from your branch
```
Confirm with `git ls-remote --heads origin`.

## 3. Fallback: a clean fast-forwarding bundle (only if push is blocked)
Always build the bundle against the **current remote tip** so it fast-forwards:
```bash
git fetch origin
git bundle create update-<phase>.bundle origin/main..HEAD
git bundle verify update-<phase>.bundle   # must list origin/main as a required ref
```
Hand the `.bundle` to the maintainer with these apply instructions:
```bash
git fetch <bundle> 'refs/heads/<branch>:refs/remotes/bundle/<phase>'
git merge --no-edit bundle/<phase> && git push origin main
```

## 4. Branching for the NEXT model (so its bundle won't conflict)
Tell the next session to branch from the **current** `origin/main`:
```bash
git fetch origin && git switch -c <branch> origin/main
# …work…
git bundle create update.bundle origin/main..<branch>
```
This is the single most important step for conflict-free handoffs.
