<!-- mova:engine -->
---
verb: review
summary: Weekly progress review and replan - error tallies, pace against the goal, plan updates, SRS recalibration.
triggers: review, weekly review, replan, how am I doing
requires: node, git
scenarios: all
---

# review — the weekly replan

Purpose: the only routine writer of the hub file. Turns a week of session logs into pace
decisions, drill priorities, and plan.md truth — so the plan never drifts from reality.

**Reads**: last 7 days of SES entries, the error tally (`node scripts/tally.mjs` — read both
the root and surface tallies; a gap between them is itself a finding worth reporting),
`node scripts/queue.mjs --counts`, docs/plan.md, docs/curriculum.md,
docs/reference/goal.md (deadline math or the no-deadline rule), docs/reference/profile.md
(the config block — `goal_date` gates the pace branch below).

**Writes**: docs/plan.md (milestones, Discovered triage, phase status), optionally
docs/mechanics/srs.md (the recalibration checkpoint below), optionally a snapshot — then
`npm test`, SES entry, commit.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session. The flow below is what happens *between* them.

## Flow

0. **Orient ritual** (session_format.md) — every step. Orient's `git status work/` sweep is
   review-relevant beyond the usual: leftovers there are the visible trace of sessions that
   ended without closing out, which is pace evidence.
1. **Evidence first**: sessions run vs planned, graded-check score trend vs the 60–70%
   target, top error codes, units covered vs the pace the goal needs:
   - **If the profile sets `goal_date`** — work backward from docs/reference/goal.md's
     deadline math: units remaining vs weeks remaining, and say the margin plainly.
   - **If there is no `goal_date`** — pace-vs-date does not exist; measure volume and streak
     per goal.md §Deadline instead (sessions per week vs the profile's stated rhythm, and
     whether the streak is holding). Never invent a date to make the arithmetic possible.
2. **Decide**: pace up/down (per session_format.md calibration rules), what the next
   week's drills target, whether any Discovered item gets promoted or closed.
3. **Update plan.md**: check off done milestones (drop their annotations!), adjust the
   current-phase paragraph, triage the Discovered bin. Keep completed items inline — the
   plan is a record, not a to-do list.
4. **Every ~4 weeks or at a phase boundary**: write a level self-assessment snapshot
   (Method + "Not exercised:") and conclude the phase in plan.md if its exit criteria are
   met — recording any criterion NOT met as written, rather than quietly dropping it.
5. **The recalibration checkpoint** — this playbook is the named owner of the numbers in
   [docs/mechanics/srs.md](../docs/mechanics/srs.md) marked
   **default (measured on limba's learner — recalibrate)**: the interval ladder, the queue
   cap, and the cost-model constants. They are real measurements taken on the reference
   learner, not on this one. **Once ~10 sessions carry recorded durations and scores**
   (close-out step: wall-clock duration; part-1 scores in the SES entries), re-fit them
   against this learner's own data and check each marker:
   - a number the data confirms or corrects → update it and promote the marker to
     **measured** (date + what was measured, per docs/mechanics/README.md's marker table);
   - a number still without enough data → leave the default marker in place and say so.
   **Count the part-1 skips in the same pass.** Session entries carry `skipped — <reason>`
   when the block did not run (session_format.md); an entry with no score is not evidence of
   bad retention, and a re-fit that treats it as one is wrong in the direction of shortening
   every interval. **Three or more declines in a row is a finding about the schedule, not
   about the learner** — the intake, the interval ladder, or the session cadence is asking
   for a review block nobody wants. Say which, and act on it here.
   Keep the copies in sync when a number moves: the interval table lives in srs.md
   (canonical) + `scripts/queue.mjs` + `state/ledgers.test.ts`, and `scripts/hub.mjs`
   parses the cost-model constants out of srs.md's own paragraph — edit them together, then
   `npm test`. Before the checkpoint has data, treat any pace arithmetic built on these
   numbers as order-of-magnitude only.
6. **Template check** — read-only, best-effort, one line. Run the **check-only** half of
   [update.md](update.md): fetch the template's `VERSION` and compare it with the profile's
   `template_version`. Same ⇒ say nothing at all. Newer ⇒ **one sentence on what is new and
   one question — take it now, or not?** A "no" is recorded nowhere and comes back next
   week, which is the whole reason this sits on a weekly cadence instead of in a
   notification. **Skip it silently** on no network, no `template_source`, or any error:
   this check never blocks a review and never hands the learner a plumbing problem. Never
   run the full update from here — a yes routes to [update.md](update.md) step 6, and that
   is a session of its own. (Added after the first real onboarding run, 2026-08-15: nothing
   in the workspace ever looked upstream on its own, so an instance improved only when its
   learner thought to ask.)
7. `npm test` (plan.md changed — always), then the **close-out ritual**
   (session_format.md) — every step. The plain-language summary matters most here: a review
   produces pace arithmetic and tier decisions, and none of that is what the learner needs to
   hear. Say what changes about how they study, in words.
