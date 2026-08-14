<!-- mova:template -->
<!--
  GENERATES: docs/reference/goal.md (goal_kind: ledger). Usually pairs with the vocab
  focus mode (setup/scenarios/focus_modes.md; + tuition.md when a tutor exists).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - STRUCTURE IS THE CONTRACT, enforced by docs/goal.test.ts: H1 `# Goal contract`,
    then H2s in this exact order — `## The spec` (containing exactly ONE bolded line
    matching /\*\*The .+ is the spec\.\*\*/), `## Deadline`, `## Assessment`,
    `## Non-goals`, then optionally `## Tuition`.
  - The Target volume line is load-bearing: docs/consequential.test.ts checks the SRS
    ceiling (queue cap × blocks/week ÷ 7 × top interval) sustains the upper number at
    the learner's pace. Run that arithmetic BEFORE committing to the numbers; an
    unsustainable target fails npm test, which is the point.
-->
# Goal contract

> What "done" means for this learner, and the tie-breaker for every scope question.
> Generated at setup, {{DATE}}.

## The spec

**The ledger target is the spec.** **Target volume**: ~{{LOW}}–{{HIGH}} items in warm
rotation, for {{PURPOSE — the learner's words: "reading the news", "vocabulary floor
under a later course"}}, with this tier distribution at target:

<!-- Tier vocabulary from docs/mechanics/srs.md. The distribution says what "held" means
     — a ledger of tier-1 rows is intake, not knowledge. Defaults below are `default
     (measured on limba's learner — recalibrate)`. -->

| Tiers | Meaning | Target share |
| --- | --- | --- |
| 4–5 | owned — long-interval recognition | ≥ {{SHARE}}% |
| 3 | gated — full package produced once | {{SHARE}}% |
| 1–2 | intake — still being installed | ≤ {{SHARE}}% |

Every session activity must grow or consolidate the ledger toward this shape; work that
does neither is scope creep, however enriching. Sections in play (profile `sections:`):
{{LETTERS — usually R, plus W if production is part of the purpose}}.

## Deadline

**This goal has no deadline, and that is a feature, not a gap.** The review verb
therefore measures **volume and streak — net items added, tier-distribution drift toward
the target shape, review blocks held against the {{BLOCKS}}-blocks/week budget — never
pace-vs-date.** No session may invent a date to motivate with.

<!-- If the volume has a real by-when, use the soft-date block from
goal-level.template.md instead, set goal_date, and let consequential.test.ts check the
pace can physically deliver the volume. -->

## Assessment

A **mock** is a **ledger audit**: a leak-checked sample across tiers — recognition at
high tiers, production at the gate tier per docs/mechanics/srs.md — scored per tier,
frozen as a snapshot with its "Not exercised:" list. It answers "does the ledger's tier
column tell the truth", which is the only claim this goal makes. Runs every ~{{N}} weeks.

## Non-goals

- Grammar coverage as a program — grammar rows enter the ledger when words drag them in,
  not on a syllabus.
- Fluency claims — this contract promises a truthful ledger, nothing more.
- {{FURTHER_NON_GOALS}}

<!-- ## Tuition — include this H2 only in the tuition scenario; delete otherwise. Same
clause as goal-exam.template.md. -->
