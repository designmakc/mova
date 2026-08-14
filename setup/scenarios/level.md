<!-- mova:engine -->
# Scenario: level — a rung on a scale, no exam body

Applies when Topic 2 named a target level (CEFR B1, JLPT N4-equivalent ability, "solid
conversational") without a certificate to sit.

| Decision | Ruling |
| --- | --- |
| Goal template | [../templates/goal-level.template.md](../templates/goal-level.template.md) |
| `goal_kind` | `level` |
| Spec sentence | `**The {{LEVEL}} can-do list is the spec.**` (e.g. "The B1 can-do list is the spec.") — the enumerated descriptors define done |
| `sections` | Letters for the skill areas the level's descriptors span — default `R W L S`; drop letters the learner explicitly excludes (e.g. no-writing → `R L S`) |
| `goal_date` | Only when the learner gave a soft deadline; label it "soft" in the Deadline section. Otherwise omit the line and use the no-deadline rule |
| "Mock" means | A **descriptor sweep**: a session testing a sample of the can-do list under realistic conditions (unrehearsed text, real-time listening, timed writing), each descriptor scored met / partial / not-met, frozen as a snapshot |
| Active verbs | All; mock runs as descriptor sweeps at phase gates rather than on a paper calendar |
| Review measures | With a soft date: pace vs date, stated as a projection, never as a countdown. Without: **volume and streak** — units covered, descriptors newly met, sessions held vs planned |

Generation notes:

- The Assessment section **enumerates the can-do descriptors** as the section list — one
  checkbox-style line each, in the learner's meta-language, sourced from the scale's
  published descriptors (cite the source; unverifiable paraphrases are `(assumed)`).
  These descriptors are what the curriculum's units must collectively exhaust.
- A level goal usually has no vocabulary target line; add one only if the learner stated
  a volume, and then the SRS-ceiling check binds.
