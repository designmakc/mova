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
  - THE TARGET VOLUME LINE IS NOT OPTIONAL. docs/consequential.test.ts arms on
    `**Target volume**: ~L–H` plus the plan's `~N study blocks` — it is the workspace's
    only numbers-versus-numbers check, and without the line it skips forever. A goal with
    no date has nothing else keeping its arithmetic honest, which is exactly why this kind
    needs it. Run the ceiling arithmetic (queue cap × blocks/week ÷ 7 × top interval)
    BEFORE committing to the number. (Found generating an Italian-native vocabulary-only
    instance, 2026-08-15: the check had never once armed on this goal kind.)
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

**Target volume**: ~{{LOW}}–{{HIGH}} ledger items to carry these {{COUNT}} scenarios
`(assumed at setup — recalibrate at review)`. Derive it from the scenarios themselves —
the domains they span, and what each needs to run unassisted — never from a syllabus.

## Deadline

**This goal has no deadline, and that is a feature, not a gap.** The review verb
therefore measures **volume and streak — scenarios passed against the list, sessions held
against the {{BLOCKS}}-blocks/week budget, ledger growth against the target volume above —
never pace-vs-date.** No session may invent a date to motivate with; urgency theater
against a fictional deadline is how no-deadline instances rot.

<!-- If the interview DID surface a soft date ("before the in-laws visit in May"), use
the soft-date block from goal-level.template.md instead of the paragraph above, and set
goal_date in the profile. -->

## Assessment

A **mock** is a **scenario run**: one scenario from the table simulated end-to-end,
unrehearsed — the agent plays the counterpart (waiter, landlord, the message thread) —
scored **pass / assisted / fail** per the scenario's probe, frozen as a snapshot with its
"Not exercised:" list. A scenario counts **owned** after two cold passes on separate
days. Runs happen at phase gates and whenever the learner asks to "test me".

**The verb that runs it:** {{ASSESSMENT_VERB — `mock` where the focus mode keeps mock
active; otherwise the carrier verb from
[setup/scenarios/focus_modes.md](../../setup/scenarios/focus_modes.md), which is `drill`
under `drill` and `vocab`. Write the actual verb name here — this file is what a session
reads}}. The instrument never changes with the verb; only who carries it does.

## Non-goals

- Completeness — grammar and vocabulary enter only when a scenario needs them; a
  syllabus-shaped detour is scope creep here by definition.
- {{FURTHER_NON_GOALS}}

<!-- ## Tuition — include this H2 only in the tuition scenario; delete otherwise. Same
clause as goal-exam.template.md. -->
