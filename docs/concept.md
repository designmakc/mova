<!-- mova:instance -->
# Concept — why this workspace exists

> One learner, one goal. Everything else is out of scope.

## Problem

This learner is a product designer who needs to read English design-system documentation
and UX articles fluently, and write clearly in English work chat — right now, for work,
not for an exam or a certificate. They never studied English seriously past school and
say plainly that they don't retain vocabulary or spelling well. Generic tools don't fit
the job: a gamified app trains streaks and general vocabulary, not this learner's specific
reading/writing-in-a-work-register goal; a tutor doesn't accumulate a searchable error
record across sessions; a general course is blind to the fact that this learner's held
languages (Russian, Ukrainian) share no article system with English at all — a generic
syllabus would spend weeks on material this pair-specific transfer map already flags as
the single highest-priority gap.

## Core idea

A goal-driven learning workspace where the agent is tutor, examiner, and registrar:
sessions generate material on demand, calibrated to the current unit and the error
record; all state is greppable text under CI; **the error log drives the drilling** —
what gets practiced is what the record says is weak, not what a syllabus says comes
next.

## The governing principle

**The scenario list is the spec.** The full contract, with the target volume and the
assessment instrument, is [reference/goal.md](reference/goal.md) — this paragraph is the
summary, not the record.

- ✅ Reading a real design-system doc page and drilling the article/preposition patterns
  it actually contains serves goal scenario 1 directly.
- ❌ A general conversational-fluency unit on ordering food or booking travel is
  enriching but serves no named scenario — it parks for the next goal contract, not this
  one.

## Persona

Exactly one learner. A native bilingual Russian/Ukrainian speaker (production language:
Russian) working in product design, who never studied English seriously beyond school
and reports poor retention of vocabulary and spelling as their main weak point. Their
biggest asset for this workspace is precision about what they actually need: five
concrete, self-named scenarios (read docs, read articles, write Slack messages,
understand calls, spell confidently) rather than a vague "get better at English".

**The full profile — language ranking, operational facts, what is already settled —
lives in [reference/profile.md](reference/profile.md) and is read at orient.** This
paragraph is the summary, not the record.

## What this is not

- Not a general-fluency course — reading & writing English for UX/UI work, then
  re-contract.
- Not an app — no gamification, no streak theater; the plan and the logs are the
  motivation.
- Not a content library — copyrighted material is cited by reference and lives untracked
  in `materials/`.
- Not a language-tech project — building tooling is scope creep unless a session's
  friction demands it.
- Not a speaking course — speaking was never named as a goal (goal.md § Non-goals); this
  instance has no `S` section and no speaking scenario at any point.
- Not an exam-prep track — the goal is functional and scenario-driven, not credentialed.
