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
  `drill`/`vocab`, where no verb produces mock-shaped work.
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
- **vocab** — curriculum optional: generate only if the goal implies a coverage order;
  otherwise a one-phase plan (capture + review cadence + ledger targets). The ledger cap
  and tier distribution become the plan's pacing numbers. Goal is usually `ledger` kind.
- **writing** — curriculum organized by **genres**, not grammar systems; every unit's
  assessment is a corrected composition scored as a mock. Error taxonomy gets its
  writing-zone codes seeded most densely.

All modes keep: the goal contract (no mode is goalless), both ledgers, the error log,
the session log, review, and retro — the record is the product; the modes only change
which activities feed it.
