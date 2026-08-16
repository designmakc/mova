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
the instance's own files.**

> `vitest: command not found` is not a mis-generation — dependencies were never installed
> (the zip-download path ships no `node_modules/`). Run `npm install`, then this step
> again, and add it to the environment probe next time
> ([setup/interview.md](interview.md) Topic 7). It is the one failure here that is yours,
> not the generated files'. A fresh instance has no waiver; a red test is a
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

**A skipped suite is not a passed suite.** `consequential: SRS ceiling` is the one check
that reads two independently generated numbers against each other, and it arms only when
`docs/reference/goal.md` carries `**Target volume**: ~L–H` *and* `docs/plan.md` carries the
`~N study blocks` phrase. Read a skip like this:

| Goal kind | A skip means |
| --- | --- |
| level · functional · ledger | **A defect — redo the step.** These templates always emit a volume target: a skip says the line is missing from goal.md (redo 3) or the pacing phrase is missing from plan.md (redo 7). These are the goal kinds with no date to keep the arithmetic honest, so the skip removes the only check they had |
| exam | Legitimate **only** when the exam genuinely implies no vocabulary count and you deliberately deleted the line ([scenarios/exam.md](scenarios/exam.md)). Otherwise read it as the row above |

Check the skip line in vitest's output, not just the green summary. (Found generating an
Italian-native vocabulary-only instance and a German-native level goal, 2026-08-15: both
goal kinds had shipped with this check permanently inert.)

## 2 · Scripts run on the empty instance

Each command must exit 0, on ledgers that are still header-only — a script that needs
data to not-crash is a script the first session cannot run.

| Command | Pass looks like | On failure redo |
| --- | --- | --- |
| `node scripts/queue.mjs --counts` | a summary line reading zero due, then `⇒ part 1: nothing due — the block does not run` | 1 (profile) if it refuses to parse; otherwise an engine bug — do not ship around it, report it |
| `node scripts/deck.mjs` | `work/visuals/deck.html` generated | 1 (profile) / 4 (pack) — deck reads both |
| `node scripts/hub.mjs` | `work/visuals/index.html` generated; the confidence panel renders (it may honestly say the instance runs unattested — the null adapter is loud, never silent) | 1 (profile), 3 (goal), 7 (plan) — the hub reads all three |
| `node scripts/visualcheck.mjs --all` | every page passes | 9 (theme/tokens) — or the generated page the message names |

## 3 · Adapters exist for the configured agent

The profile's `agent:` names a directory under `agents/`; its README says what an
adapter installation looks like. Verify those files exist and contain **pointers to
playbooks, never rule text** (a rule copied into an adapter is a future contradiction —
the agents test also checks this). Failure → redo step 8.

## 4 · First-session preconditions dry run

The handoff promises a verb — **whichever one carries placement in this focus mode**
(`lesson` under `full`, `drill` under `drill`/`vocab`, `write` under `writing`;
[scenarios/focus_modes.md](scenarios/focus_modes.md) § Placement and assessment run in
every mode). Prove *that* verb would actually start:

- **Profile parses**: `node -e "import('./scripts/profile.mjs').then(m => { m.loadProfile().require('pack'); console.log('ok'); })"` → `ok`. Failure → redo 1.
- **Goal readable**: `docs/reference/goal.md` exists, spec sentence greppable
  (`grep -E '\*\*The .+ is the spec\.\*\*' docs/reference/goal.md`). Failure → redo 3.
- **Current unit resolvable**: the first `status: pending` line in `docs/curriculum.md`
  exists and sits under a `## U` heading — that unit is where the first session lands
  (after its placement half). True in every focus mode: the curriculum is always
  generated, and under a narrow focus it orders capture instead of being walked.
  Failure → redo 6.
- **The promised verb is live**: the playbook the handoff will name has this instance's
  `focus:` (or `all`) in its frontmatter `scenarios:` line, and its adapter shim exists.
  Failure → the handoff is about to promise a verb the instance refuses; redo the carrier
  lookup, not the shim.
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
