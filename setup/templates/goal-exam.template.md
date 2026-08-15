<!-- mova:template -->
<!--
  GENERATES: docs/reference/goal.md (goal_kind: exam). Scenario deltas:
  setup/scenarios/exam.md (+ tuition.md when a tutor exists).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - STRUCTURE IS THE CONTRACT, enforced by docs/goal.test.ts: H1 `# Goal contract`,
    then H2s in this exact order — `## The spec` (containing exactly ONE bolded line
    matching /\*\*The .+ is the spec\.\*\*/), `## Deadline`, `## Assessment`,
    `## Non-goals`, then optionally `## Tuition`.
  - Every fact about the exam is verified against the provider's published material or
    goes on the TO-CONFIRM list. A guessed section format mis-scopes every unit.
  - If you set a Target volume line, `npm test` checks the SRS ceiling sustains it at
    the learner's pace — run the arithmetic before you commit to the number.
-->
# Goal contract

> What "done" means for this learner, and the tie-breaker for every scope question.
> Generated at setup, {{DATE}}; facts verified then unless marked **TO CONFIRM**.

## The spec

**The exam is the spec.** {{EXAM_NAME}} ({{PROVIDER}}) — its sections define done:

<!-- One row per real exam section. The letters are the profile's `sections:` and the
     topics map's Exam column vocabulary — they must match exactly. -->

| Letter | Section | Time | What it demands |
| --- | --- | --- | --- |
| {{L}} | {{SECTION_NAME}} | {{TIME}} | {{DEMANDS}} |

Every session activity must serve at least one section's score; work that serves none is
scope creep, however enriching. **Target volume**: ~{{LOW}}–{{HIGH}} ledger items by exam
day `(assumed at setup — recalibrate at review)`. <!-- Delete the Target volume sentence
if the exam implies no vocabulary count. -->

## Deadline

<!-- limba's deadline-arithmetic shape. Work BACKWARD from the hardest date. State what
     kind each date is: provider-published, legal, or the learner's decision — a decided
     date stops the plan moving but must never be read as provider-confirmed. -->

**Target exam date: {{GOAL_DATE}}** — {{KIND: published sitting | legal deadline drives
it | learner's locked decision}}. Every pace number derives from this line; change it
here and nowhere else (the profile's `goal_date` mirrors it).

```
{{CERT_BY_DATE}}   certificate needed by ({{WHY}})
  − {{RESULTS_WEEKS}} wk   results turnaround  ⇒ last viable sitting ~{{LAST_SITTING}}
{{GOAL_DATE}}   target first attempt
  ⇒ retake buffer: {{RETAKE_MATH — state plainly whether the target date spends it}}
  ⇒ exam-ready (passing full mocks comfortably): ~{{READY_DATE}}
  ⇒ runway from {{TODAY}}: ~{{WEEKS}} weeks ⇒ ~{{UNITS_PER_WEEK}} units/week needed
```

**TO CONFIRM** (registration tasks with owners, not blockers — the plan runs on the
arithmetic above while these close):

- {{OPEN_FACT — session calendar, pass threshold, registration mechanics, technical
  requirements…}}

## Assessment

A **mock** is a timed exam section (or full paper) in the exam's own format, scored
against its rubric, frozen as a snapshot with its "Not exercised:" list. **Real past
papers outrank generated material** — sources: {{SAMPLE_TEST_SOURCES — from the pack's
notes.md materials section}}. Mocks graduate: single sections at phase gates → full
four-section papers in the final phase. Results feed the plan the same session.

**The verb that runs it:** {{ASSESSMENT_VERB — `mock` where the focus mode keeps mock
active; otherwise the carrier verb from
[setup/scenarios/focus_modes.md](../../setup/scenarios/focus_modes.md), which is `drill`
under `drill` and `vocab`. Write the actual verb name here — this file is what a session
reads}}. The instrument never changes with the verb; only who carries it does.

## Non-goals

<!-- What this workspace deliberately does not do, so future sessions can refuse scope
     creep by citation. Keep the exam-flavored defaults; add learner-specific ones. -->

- General fluency beyond what the sections test — park it for after the certificate.
- {{FURTHER_NON_GOALS}}

<!-- ## Tuition — include this H2 only in the tuition scenario; delete otherwise.

**Tutor:** {{WHO_AND_CHANNEL}}, {{MEETING_CADENCE — how often you two actually meet; the
ONLY cadence this clause states}}. Live speaking practice and oral mocks run there under
real timing. **Spot-check agreement:** each tutor-prep pack carries the current
unverified-fact list, uncapped, and every Nth pack adds a sampled spot-check — both
cadences belong to `playbooks/tutor-prep.md`, which is the file that runs them; do not
restate either as a number here. What the tutor confirms or corrects returns through the
feedback intake and clears `?` markers with a `tutor-confirmed <date>` trail
(docs/mechanics/verification.md). -->
