<!-- mova:template -->
<!--
  GENERATES: docs/reference/goal.md (goal_kind: level). Scenario deltas:
  setup/scenarios/level.md (+ tuition.md when a tutor exists).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - STRUCTURE IS THE CONTRACT, enforced by docs/goal.test.ts: H1 `# Goal contract`,
    then H2s in this exact order — `## The spec` (containing exactly ONE bolded line
    matching /\*\*The .+ is the spec\.\*\*/), `## Deadline`, `## Assessment`,
    `## Non-goals`, then optionally `## Tuition`.
  - The can-do descriptors come from the scale's published material — cite it. A
    paraphrase you cannot source is `(assumed)`.
  - THE TARGET VOLUME LINE IS NOT OPTIONAL. docs/consequential.test.ts arms on
    `**Target volume**: ~L–H` plus the plan's `~N study blocks` — it is the workspace's
    only numbers-versus-numbers check, and without the line it skips forever. A level goal
    with no date has nothing else keeping its arithmetic honest. Run the ceiling
    arithmetic (queue cap × blocks/week ÷ 7 × top interval) BEFORE committing to the
    number; an unsustainable target fails npm test, which is the point. (Found generating
    a German-native level goal with a tutor, 2026-08-15: that instance shipped with the
    check permanently inert.)
-->
# Goal contract

> What "done" means for this learner, and the tie-breaker for every scope question.
> Generated at setup, {{DATE}}.

## The spec

**The {{LEVEL}} can-do list is the spec.** {{LEVEL}} on the {{SCALE — e.g. CEFR}} scale,
in {{TARGET_LANGUAGE}} — the descriptors enumerated under Assessment define done, across
these skill areas (the profile's `sections:` letters):

| Letter | Skill area |
| --- | --- |
| {{L}} | {{AREA}} |

Every session activity must move at least one descriptor toward "met"; work that moves
none is scope creep, however enriching.

**Target volume**: ~{{LOW}}–{{HIGH}} ledger items at {{LEVEL}}
`(assumed at setup — recalibrate at review)` — from the scale's published vocabulary
expectation where one exists (cite it), otherwise your own estimate for the rung, marked
`(assumed)`.

## Deadline

<!-- Exactly one of the two blocks below survives generation. -->

<!-- WITH a soft date: -->
**Soft target: {{GOAL_DATE}}** ({{WHY — "before the move", the learner's own words}}).
Not a sitting and not a legal date — the review verb projects pace against it and says
plainly when the projection slips, but a slip moves the date, never the bar.

```
{{GOAL_DATE}}   soft target
  ⇒ runway from {{TODAY}}: ~{{WEEKS}} weeks ⇒ ~{{UNITS_PER_WEEK}} units/week at the
    interview's {{BLOCKS}}-blocks/week budget
```

<!-- WITHOUT a date — the no-deadline rule, verbatim engine doctrine: -->
**This goal has no deadline, and that is a feature, not a gap.** The review verb
therefore measures **volume and streak — units covered, descriptors newly met, ledger
growth against the target volume above, sessions held against the {{BLOCKS}}-blocks/week
budget — never pace-vs-date.** No session may invent a date to motivate with; urgency
theater against a fictional deadline is how no-deadline instances rot.

## Assessment

A **mock** is a **descriptor sweep**: a sample of the list below tested under realistic
conditions — unrehearsed text, real-time listening, timed writing — each descriptor
scored met / partial / not-met, frozen as a snapshot with its "Not exercised:" list.
Sweeps run at phase gates. A descriptor counts **met** when it passes cold, on a later
day than it was practiced.

The can-do list ({{SOURCE — scale document, cited}}):

<!-- Enumerate the level's descriptors — this IS the section list the units must
     collectively exhaust. One line each, plain meta-language. -->

- [ ] {{DESCRIPTOR}}
- [ ] {{DESCRIPTOR}}

**The verb that runs it:** {{ASSESSMENT_VERB — `mock` where the focus mode keeps mock
active; otherwise the carrier verb from
[setup/scenarios/focus_modes.md](../../setup/scenarios/focus_modes.md), which is `drill`
under `drill` and `vocab`. Write the actual verb name here — this file is what a session
reads}}. The instrument never changes with the verb; only who carries it does.

## Non-goals

- The next level up — {{LEVEL}} is the contract; re-run setup's goal step to renew it.
- Certificate logistics — no exam body is party to this goal.
- {{FURTHER_NON_GOALS}}

<!-- ## Tuition — include this H2 only in the tuition scenario; delete otherwise. Same
clause as goal-exam.template.md. -->
