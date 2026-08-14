<!-- mova:engine -->
# setup/smoke.md — post-setup verification

> The last act of [playbooks/setup.md](../playbooks/setup.md). Run every check, in
> order, on the freshly generated instance. **Every failure names the generation step to
> redo** (the step numbers are setup.md's) — fix there, then re-run this file from the
> top. The learner sees none of this unless something cannot be fixed; setup is not done
> until the sweep is clean.
>
> Skip nothing. A fresh instance that fails a check today fails it in the learner's
> face next week — this file exists because the whole workspace is generated content,
> and generated content that was never executed is a claim, not a workspace.

## 1 · The contract tests

```
npm test
```

**Must pass in full — the same tests the reference instance lives under, now armed by
the instance's own files.** A fresh instance has no waiver; a red test is a
mis-generated file, and the failing file names the step:

| Failing suite | Redo step |
| --- | --- |
| goal contract structure | 3 (goal) |
| curriculum units | 6 (curriculum) — or 1 if the `units:` counts disagree |
| topics coverage | 5 (topics) — or 6 if a unit reference is the stale side |
| plan annotations / projects index | 7 (plan + seed project) |
| consequential: SRS ceiling | 3 + 7 together — the volume target and the pace disagree; fix the numbers, never the test |
| consequential: future dates | whichever generated file carries the date — you typed a date from stale context; run `date` and fix |
| agents adapters | 8 (adapters) |
| ledgers / logs / insights | none of these are generated — if one fails, you edited an engine or state file; revert it |

## 2 · Scripts run on the empty instance

Each command must exit 0, on ledgers that are still header-only — a script that needs
data to not-crash is a script the first session cannot run.

| Command | Pass looks like | On failure redo |
| --- | --- | --- |
| `node scripts/queue.mjs --counts` | one summary line, zero due | 1 (profile) if it refuses to parse; otherwise an engine bug — do not ship around it, report it |
| `node scripts/deck.mjs` | `work/visuals/deck.html` generated | 1 (profile) / 4 (pack) — deck reads both |
| `node scripts/hub.mjs` | `work/visuals/index.html` generated; the confidence panel renders (it may honestly say the instance runs unattested — the null adapter is loud, never silent) | 1 (profile), 3 (goal), 7 (plan) — the hub reads all three |
| `node scripts/visualcheck.mjs --all` | every page passes | 9 (theme/tokens) — or the generated page the message names |

## 3 · Adapters exist for the configured agent

The profile's `agent:` names a directory under `agents/`; its README says what an
adapter installation looks like. Verify those files exist and contain **pointers to
playbooks, never rule text** (a rule copied into an adapter is a future contradiction —
the agents test also checks this). Failure → redo step 8.

## 4 · Lesson-preconditions dry run

The handoff promises "say lesson when ready" — prove the lesson verb would actually
start:

- **Profile parses**: `node -e "import('./scripts/profile.mjs').then(m => { m.loadProfile().require('pack'); console.log('ok'); })"` → `ok`. Failure → redo 1.
- **Goal readable**: `docs/reference/goal.md` exists, spec sentence greppable
  (`grep -E '\*\*The .+ is the spec\.\*\*' docs/reference/goal.md`). Failure → redo 3.
- **Current unit resolvable**: the first `status: pending` line in `docs/curriculum.md`
  exists and sits under a `## U` heading — that unit is what the first lesson opens
  (after its placement half). Failure → redo 6.
- **Placement will have its baseline**: the intake snapshot exists in `docs/snapshots/`.
  Failure → redo 2.
- **The verb table routes**: every playbook the focus mode activates
  ([scenarios/focus_modes.md](scenarios/focus_modes.md)) exists in `playbooks/`.
  A missing playbook is an engine gap — report it; do not generate one.

## 5 · Close

All green: commit the sweep (`setup: smoke clean`, when git exists), then return to
[playbooks/setup.md](../playbooks/setup.md) § Handoff. Any check that cannot be made
green by redoing its step is reported to the maintainer path (an issue against the
template), stated plainly to the learner, and the workspace ships only if the failure
is capability-shaped (no audio, null dictionary) rather than contract-shaped — a red
contract test never ships.
