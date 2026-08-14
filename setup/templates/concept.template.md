<!-- mova:template -->
<!--
  GENERATES: docs/concept.md — the why, read when a session needs motivation-level
  context, not operational detail.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - THE SUMMARY, NOT THE RECORD: this file points at the files that own the detail
    (goal.md owns the goal, profile.md owns the learner) and never duplicates their
    content — a second copy is a future contradiction. Keep every section short.
-->
# Concept — why this workspace exists

> One learner, one goal. Everything else is out of scope.

## Problem

<!-- 2–4 sentences: what the learner needs, why now, and why generic tools don't fit —
     ground the second half in THIS learner's actual assets and constraints, not a
     generic apps-vs-tutors essay. -->

{{PROBLEM}}

Generic tools don't fit the job: {{WHY_NOT — apps train streaks, not this goal; tutors
don't accumulate an error record; courses are blind to what this learner's held
languages make cheap}}.

## Core idea

A goal-driven learning workspace where the agent is tutor, examiner, and registrar:
sessions generate material on demand, calibrated to the current unit and the error
record; all state is greppable text under CI; **the error log drives the drilling** —
what gets practiced is what the record says is weak, not what a syllabus says comes
next.

## The governing principle

**{{SPEC_SENTENCE — copy the bolded spec sentence from goal.md verbatim}}** The full
contract, with the deadline math and the assessment instrument, is
[reference/goal.md](reference/goal.md) — this paragraph is the summary, not the record.

- ✅ {{IN_SCOPE_EXAMPLE — one concrete activity and the goal part it serves}}
- ❌ {{OUT_OF_SCOPE_EXAMPLE — one enriching-but-out activity and why it parks}}

## Persona

Exactly one learner: {{NAME}}. {{TWO_SENTENCES — held languages and the one or two
assets that shape everything; how they work with this agent}}.

**The full profile — language ranking, operational facts, what is already settled —
lives in [reference/profile.md](reference/profile.md) and is read at orient.** This
paragraph is the summary, not the record.

## What this is not

<!-- Keep the engine defaults; add learner-specific exclusions from the interview and
     the goal's Non-goals (cite, don't copy). -->

- Not a general-fluency course — {{GOAL_LABEL}}, then re-contract.
- Not an app — no gamification, no streak theater; the plan and the logs are the
  motivation.
- Not a content library — copyrighted material is cited by reference and lives untracked
  in `materials/`.
- Not a language-tech project — building tooling is scope creep unless a session's
  friction demands it.
- {{FURTHER_EXCLUSIONS}}
