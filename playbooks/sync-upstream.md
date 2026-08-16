<!-- mova:engine -->
---
verb: sync-upstream
summary: Maintainer only — port limba's newest machinery changes into the template via the map, then release.
triggers: "sync upstream", "pull limba's changes", "port from limba"
requires: maintainer mode (no profile); a checkout of limba at ~/Projects/limba
scenarios: none
maintainer: true
---

# /sync-upstream — consume limba's porting feed

**MAINTAINER ONLY.** This playbook runs in the template repo, never in an instance —
`scenarios: none` plus `maintainer: true` mean adapters never generate a shim for it, and
`docs/agents.test.ts` treats any `maintainer: true` playbook as never-active. If a profile
exists in this tree, stop: you are in an instance and this verb does not exist for you.

Purpose: limba (`~/Projects/limba`) is the living reference implementation this engine was
extracted from. Every change to its machinery lands as a `PORT-NNN` entry in its
`docs/logs/porting_log.md`; this playbook drains that feed into mova and cuts a release the
instances' `/update` can consume.

**Reads**: limba's `docs/logs/porting_log.md`, `upstream/limba.lock` (last synced PORT id +
limba commit), `upstream/map.md` (the porting contract), `CHANGELOG.md`, `VERSION`.

**Writes**: ported engine/pack files, `upstream/map.md` (new rows when limba adds files),
`VERSION`, `CHANGELOG.md`, `upstream/limba.lock`, `upstream/manifest.json`.

## Flow

1. **Find the new entries.** Read `upstream/limba.lock` (`last-synced: PORT-NNN`), then
   collect every `porting_log.md` entry newer than it, oldest first — they apply in order.

2. **Resolve each entry via the map.** For every file the entry's `Files:` line names, look
   it up in `upstream/map.md`. **A limba file absent from the map is a sync ERROR, not a
   judgment call** — stop, decide its row (destination + transform) with the human if
   needed, add the row, then proceed. The map stays total; that is its whole value.

3. **Apply the transforms.** Port per the file's map row — `verbatim`, `param` (specifics
   → profile config or pack), `split`, `template` (shape → `setup/templates/`),
   `design-input` (no file; update the named feature), `skip`. The entry's `Kind:` is a
   shortcut: `learner` and `infra` entries usually resolve to skips; `generic` and
   `ro-pack` carry the work. Keep engine markers (`mova:engine` first line) on everything
   ported into the engine.

4. **Verify.** `npm test` green. If a ported change touched the pack, `node
   scripts/packcheck.mjs` and the golden fixtures must still pass.

5. **Release.** Bump `VERSION` (semver — breaking engine-file shape changes are minor
   bumps pre-1.0, by this repo's convention so far). Add a `CHANGELOG.md` entry describing
   what changed, **with its `instance-impact:` line** — that line is what `/update`
   executes downstream, so write it as an instruction, not a description. Update
   `upstream/limba.lock` (new `last-synced:` PORT id, `limba-commit:` sha of limba's HEAD
   at sync time, date). Run `node scripts/manifest.mjs` last, so the manifest hashes the
   released files.

6. **The reverse channel.** Porting regularly finds bugs that exist in limba too (the
   CHANGELOG's "not yet upstreamed" list; the coordinator tracks them). Each such fix goes
   *back* to limba as a commit/PR in limba's own conventions — and limba records it with a
   PORT entry like any machinery change, which this playbook then recognizes on the next
   sync as already ported. Never let a fix live only downstream: the fork's health is the
   feed's health.

   **The statement waits in [`upstream/backports/`](../upstream/backports/README.md)** — one
   file per owed change, deleted by the commit that names limba's `PORT-NNN`. A file there is
   a debt this playbook has not paid yet; read the directory before declaring a sync done.
