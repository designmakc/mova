<!-- mova:engine -->
---
verb: mock
summary: Timed mock of one assessment section, scored and frozen as a snapshot.
triggers: mock, test me, timed practice, exam rehearsal
requires: node, audio, git
scenarios: full writing
---

# mock — a timed assessment section under real conditions

Purpose: ground truth. A timed, proctored, scored run of one section of the goal contract's
assessment instrument ([docs/reference/goal.md](../docs/reference/goal.md) §Assessment —
that section defines the sections, task types, and timing), frozen as a snapshot so progress
is measured against the same bar every time. Cadence and section rotation live in
docs/plan.md.

**Reads**: docs/reference/goal.md (section format + timing), `materials/` (real past papers
preferred), docs/plan.md (which mock is due), the docs/snapshots/README.md conventions,
docs/mechanics/media.md (audio playback for listening-type sections).

**Writes**: `docs/snapshots/YYYY-MM-DD_mock_<section>.md`, ERR entries (harvested errors),
SES entry, docs/plan.md (repair findings → current phase or Discovered, annotated) — then
`npm test`, commit.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session. The flow below is what happens *between* them. Orient's date step is load-bearing
here: a snapshot is named by its date and frozen, so a wrong one is expensive to correct.

## Flow

0. **Orient ritual** (session_format.md) — every step. A mock deliberately tests beyond what
   has been taught, so topics.md is read here to **report** coverage honestly in the
   snapshot's "Not exercised" list, not to restrict the paper.
1. **Choose the section** (user's call, or what the plan says is due). Check `materials/`
   for a real sample of that section from the assessment's issuing body — **real papers
   outrank generated ones**. If generating: match the section's task types, counts, and
   timing exactly, and mark the snapshot's Method as generated-in-format.
2. **Proctor**: state the time budget, run timed, no help, no corrections mid-flight.
   Listening-type sections: the session plays the audio itself per media.md's
   capability-gated toolbox, pausing between tasks per the paper's structure (manual
   playback is the fallback). Speaking-type sections run as a typed simulation unless a
   tutor mock is arranged (see the tutor-prep playbook).
3. **Score** against the section's task structure; report per-task, total, and pass-margin
   judgment plainly — against the pass bar the goal contract states.
4. **Debrief**: every error → taxonomy code → error log; patterns → repair items.
5. **Freeze the snapshot**: date-named, with `## Method` (exactly what was exercised,
   source of the paper, timing) and a **"Not exercised:"** list. Update the snapshots
   README index table.
6. **Feed the plan**: repair items into docs/plan.md (annotated, one line each); `npm test`.
7. **Close-out ritual** (session_format.md) — every step, including the plain-language
   summary. After a mock that is the step the learner cares about most: say what the score
   means for readiness against the goal in words, not in section percentages.
