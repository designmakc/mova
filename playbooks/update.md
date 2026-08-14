<!-- mova:engine -->
---
verb: update
summary: Pull template changes into this instance — an agent-driven three-way update, never a git merge.
triggers: "update the workspace", "pull template updates", "is my workspace up to date"
requires: network access to the template source; a clean git tree before starting
scenarios: all
---

# /update — bring this instance up to the current template

Purpose: an instance is a fork of the mova template plus personal content, with no shared
git history to merge across. This playbook answers "what did the template change since I
was generated" mechanically — via `upstream/manifest.json`, the engine-file hash manifest —
and applies the answer conversationally. **Never `git merge`, never `git pull` from the
template.** Personal content (ledgers, logs, goal contract, generated pages) interleaves
engine files in the same tree; a git merge would either clobber it or drown the human in
conflicts they cannot judge. The agent does the diffing and asks in plain language.

**Reads**: `docs/reference/profile.md` (config: `template_version`, `template_source`),
`upstream/manifest.json` (the OLD manifest — the engine baseline this instance last synced
to), the fetched template's `VERSION`, `CHANGELOG.md`, and `upstream/manifest.json`.

**Writes**: engine files it replaces, `upstream/manifest.json` (adopted from the fetched
template), the profile config block (`template_version`, and `template_source` on first
run), one commit.

## Flow

1. **Preconditions.** The profile exists (otherwise this is the template — nothing to
   update). The git tree is clean; commit or stash first. Read `template_version` from the
   profile config block.

2. **Resolve the template source.** The profile config key **`template_source`** (optional)
   holds the template's URL — a git remote or a GitHub repo. If it is absent, ask the human
   for the URL **once** and add the key to the profile config block; every later update
   reads it silently. This key is the instance's provenance record.

3. **Fetch the template** into a scratch directory — `git clone --depth 1 <template_source>`,
   or download the GitHub zip when git is unavailable. Never fetch into the instance's tree.

4. **Compare versions.** Fetched `VERSION` equal to the profile's `template_version` ⇒
   report "already current" and stop. Older ⇒ something is wrong (a stale mirror?); stop
   and say so.

5. **Walk the CHANGELOG.** Read the fetched `CHANGELOG.md` entries **newer than
   `template_version`**, newest last. Summarize them to the human in plain language before
   touching anything — each entry's `instance-impact:` line is the contract for step 8.

6. **Diff every engine file.** For each path in the **fetched** template's
   `upstream/manifest.json`:
   - **Not present in the instance** ⇒ a new engine file; copy it in.
   - **Instance hash equals the OLD manifest's entry** ⇒ the instance never touched it;
     replace it with the fetched version silently (skip if the fetched hash is identical).
   - **Instance hash differs from the OLD manifest's entry** ⇒ locally modified. Hold a
     **plain-language three-way conversation**: what changed *here* (old baseline vs the
     instance's copy), what changed *upstream* (old baseline vs fetched), then offer
     **keep** (the local version stays), **take** (upstream wins), or **merge** (the agent
     combines both and shows the result). Never resolve this silently in either direction.
   - **In the OLD manifest but absent from the fetched one** ⇒ the template retired it;
     say so, and delete it unless it was locally modified (then ask).

7. **Never touch instance-owned files.** Anything *not* in the manifest — `state/`,
   `docs/logs/`, `docs/reference/` content, `work/`, generated pages and adapter shims,
   files marked `mova:instance` — is the learner's and is out of bounds. The manifest is
   the allowlist, not a suggestion.

8. **Apply instance-impact steps.** For each CHANGELOG entry walked in step 5, run its
   named regeneration step (e.g. "re-run setup step N", "regenerate the hub"). `none` and
   "engine files auto-update" need nothing beyond step 6.

9. **Verify and record.** Run `npm test` (must be green) and the checks in
   `setup/smoke.md`. Copy the **fetched** template's `upstream/manifest.json` over the
   instance's — the new baseline must carry the *template's* hashes, so a file the human
   chose to **keep** in step 6 stays visibly divergent and is asked about again next
   update, instead of being silently overwritten the update after. (For the same reason,
   do **not** regenerate the manifest locally with `scripts/manifest.mjs` here — that
   would bless local modifications as the baseline and make the *next* update clobber
   them without asking. That script is for the template repo's release ritual.)
   Bump `template_version` in the profile config block to the fetched `VERSION`.
   Commit: `update: template <old> → <new>`, naming the paths touched.

10. **Report.** Tell the human, cold-reader style: what the workspace now does differently,
    what was kept local and why it will come up again, and anything step 8 changed about
    their material.
