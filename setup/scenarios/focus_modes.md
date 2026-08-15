<!-- mova:engine -->
# Scenario: focus modes — which verbs the workspace answers to

**Orthogonal to the goal scenarios.** Topic 5's answer sets `focus:` in the profile
config (extension key — `full` is the default and the only mode the reference instance
ever ran; the narrow modes are **assumed** shapes, recalibrate on real use).

**The authority is each playbook's own frontmatter**: a playbook's `scenarios:` line
names the focus modes it is active in (`all` = every mode). The table below is the
derived view — if it ever disagrees with a frontmatter line, the frontmatter wins and
this table gets fixed.

| Mode | Active verbs | Inactive verbs answer with |
| --- | --- | --- |
| `full` | lesson · drill · write · mock · review · vocab · retro · update (+ tutor-prep under tuition) | — |
| `drill` | drill · vocab · review · retro · update | "this workspace is drill-only — say 'review' to widen it" |
| `vocab` | vocab · drill · review · retro · update | same pattern |
| `writing` | write · mock · vocab · review · retro · update | same pattern |

Notes on the assignments:

- **lesson runs only in `full`** — it is the intake engine, and the narrow modes exist
  precisely to skip structured intake.
- **drill is active in `vocab` mode** — captured words need the review loop, and drill
  is the verb that eats the queue. The two modes share a verb set and differ in center
  of gravity: `drill` assumes material arrives by drilling what exists; `vocab` assumes
  it arrives by capture.
- **mock is active in `writing` mode** — a timed composition against the goal's rubric
  is exactly what a writing-focused learner means by "test me". It stays inactive in
  `drill`/`vocab`, where no verb produces mock-shaped work — but the goal's own
  assessment instrument still runs there, on the carrier verb below. A goal whose
  instrument no live verb can run has no way to close.
- review, vocab, retro, and update run in every mode: the record is the product, and the
  verbs that keep it honest are never pruned.

An inactive verb is refused politely with the one-line pointer above — never silently
run. Widening the focus is a review-verb decision: update `focus:` and the plan in the
same session.

Per-mode generation deltas:

- **full** — everything is generated as the templates describe. No deltas.
- **drill** — curriculum still generated (drills need a coverage order) but coarse:
  titles + status lines only, no per-unit detail beyond the first. Plan phases are
  streak-shaped ("N drill blocks/week"), not unit-paced. Intake happens through vocab
  capture, not lessons — say so in the plan.
- **vocab** — **the curriculum is generated, always** — in every mode, no exceptions:
  `docs/topics.test.ts` cannot arm without `docs/curriculum.md`, setup step 6 is
  unconditional, and `units:` is a required config key with no null value. What a narrow
  focus changes is what the curriculum is *for*: here it **orders capture** rather than
  being walked. Units are the domains capture moves through (household, work, the news) —
  each a bucket the ledger fills — and no session opens a unit and teaches it. Keep them
  coarse (title, status line, one line of domain), and let the ledger cap and tier
  distribution carry the plan's pacing numbers. With no lesson verb to flip a unit
  `covered`, name the verb that does in the curriculum's own conventions line — the review
  verb, at the weekly replan, when that domain's rows genuinely hold. Goal is usually
  `ledger` kind. (Found generating an Italian-native vocabulary-only instance, 2026-08-15.)
- **writing** — curriculum organized by **genres**, not grammar systems; every unit's
  assessment is a corrected composition scored as a mock. Error taxonomy gets its
  writing-zone codes seeded most densely.

All modes keep: the goal contract (no mode is goalless), both ledgers, the error log,
the session log, review, and retro — the record is the product; the modes only change
which activities feed it.

## Placement and assessment run in every mode — on whichever verb is live

Two rituals are **not optional in any focus mode**: the **placement** that replaces the
interview's guesses with measured data, and the **goal's own assessment instrument**,
whatever §Assessment calls it. Neither belongs to the verb that normally carries it. When
that verb is inactive here, the ritual rides the **carrier verb** below — the ritual is
unchanged, only the verb that runs it changes.

| Ritual | `full` | `drill` | `vocab` | `writing` |
| --- | --- | --- | --- | --- |
| **Placement** — the first session probes instead of teaching, and freezes a snapshot | lesson | drill | drill | write |
| **The goal's assessment instrument** — exam section · descriptor sweep · scenario run · ledger audit | mock | drill | drill | mock |

Nothing else moves: the probe is still a probe rather than a first lesson, the snapshot
still carries `## Method` and its "Not exercised:" list
([../../docs/snapshots/README.md](../../docs/snapshots/README.md)), and the instrument is
still exactly what the goal contract defines. A carrier verb runs the ritual under its own
name and its own rules — a drill carrying a placement still refuses to teach new material.

**Who must cite this table, and how:**

- [../../playbooks/setup.md](../../playbooks/setup.md) § Handoff — it names the verb the
  learner is told to say first, and that verb must be one this instance answers to.
- [../smoke.md](../smoke.md) § 4 — the dry run proves the carrier verb would start.
- the placement milestone in [../templates/plan.template.md](../templates/plan.template.md).
- **each goal template's §Assessment** — the only one of the four a *running* instance ever
  reads. Write the carrier verb into the generated `docs/reference/goal.md` **by name**;
  a pointer back to this setup-time file is not readable from a session.

A handoff that promises a verb the focus mode refuses fails on the learner's very first
message: under `focus: vocab` the instance answers "this workspace is vocabulary-only" to
the one instruction setup just gave it. (Found generating an Italian-native vocabulary-only
instance, 2026-08-15.)
