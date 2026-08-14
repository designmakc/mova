<!-- mova:template -->
<!--
  GENERATES: docs/reference/goal.md (goal_kind: functional). Scenario deltas:
  setup/scenarios/functional.md (+ tuition.md when a tutor exists).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - STRUCTURE IS THE CONTRACT, enforced by docs/goal.test.ts: H1 `# Goal contract`,
    then H2s in this exact order — `## The spec` (containing exactly ONE bolded line
    matching /\*\*The .+ is the spec\.\*\*/), `## Deadline`, `## Assessment`,
    `## Non-goals`, then optionally `## Tuition`.
  - The scenarios are the interview's elicited list, 5–10 of them, in the learner's OWN
    WORDS — do not paraphrase them into curriculum-speak. Every scenario carries a
    measurable probe; a scenario without one is a mood, not a spec.
-->
# Goal contract

> What "done" means for this learner, and the tie-breaker for every scope question.
> Generated at setup, {{DATE}}.

## The spec

**The scenario list is the spec.** {{COUNT}} scenarios, in the learner's words — each
with the probe that decides whether it is owned:

<!-- 5–10 rows. Probe = one line stating what a pass looks like, concrete enough to
     score: "order a two-course meal, handle one unexpected question, no translation
     help". Skills = the section letters this scenario exercises (⊆ profile sections). -->

| # | Scenario (learner's words) | Probe — a pass looks like | Skills |
| --- | --- | --- | --- |
| 1 | {{SCENARIO}} | {{PROBE}} | {{LETTERS}} |

Every session activity must serve at least one scenario; work that serves none is scope
creep, however enriching. An eleventh scenario is the **next** goal contract — renew via
the review verb, don't accrete.

## Deadline

**This goal has no deadline, and that is a feature, not a gap.** The review verb
therefore measures **volume and streak — scenarios passed against the list, sessions
held against the {{BLOCKS}}-blocks/week budget, ledger growth — never pace-vs-date.** No
session may invent a date to motivate with; urgency theater against a fictional deadline
is how no-deadline instances rot.

<!-- If the interview DID surface a soft date ("before the in-laws visit in May"), use
the soft-date block from goal-level.template.md instead of the paragraph above, and set
goal_date in the profile. -->

## Assessment

A **mock** is a **scenario run**: one scenario from the table simulated end-to-end,
unrehearsed — the agent plays the counterpart (waiter, landlord, the message thread) —
scored **pass / assisted / fail** per the scenario's probe, frozen as a snapshot with its
"Not exercised:" list. A scenario counts **owned** after two cold passes on separate
days. Runs happen at phase gates and whenever the learner asks to "test me".

## Non-goals

- Completeness — grammar and vocabulary enter only when a scenario needs them; a
  syllabus-shaped detour is scope creep here by definition.
- {{FURTHER_NON_GOALS}}

<!-- ## Tuition — include this H2 only in the tuition scenario; delete otherwise. Same
clause as goal-exam.template.md. -->
