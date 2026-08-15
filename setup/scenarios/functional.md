<!-- mova:engine -->
# Scenario: functional — a scenario list instead of a certificate

Applies when Topic 2 found no formal goal and elicited concrete scenarios instead. The
interview MUST have produced 5–10 of them, in the learner's own words — if it did not, go
back to the interview; this scenario cannot be generated from "just want to speak it".

| Decision | Ruling |
| --- | --- |
| Goal template | [../templates/goal-functional.template.md](../templates/goal-functional.template.md) |
| `goal_kind` | `functional` |
| Spec sentence | `**The scenario list is the spec.**` — the enumerated scenarios define done |
| `sections` | Letters for the skill areas the scenarios actually exercise (a reading-and-messaging list may be `R W`; "order in a restaurant" adds `S L`). Derive from the list; don't default to all four |
| `goal_date` | Almost always omitted — use the no-deadline rule: review measures **volume and streak**, never pace-vs-date |
| "Mock" means | A **scenario run**: one scenario simulated end-to-end, unrehearsed (the agent plays waiter / landlord / message thread), scored pass / assisted / fail per the scenario's probe, frozen as a snapshot. **Which verb runs it** is the focus mode's answer, not this file's: `mock` where mock is live, otherwise the carrier verb ([focus_modes.md](focus_modes.md)) |
| Active verbs | **The focus mode decides — this scenario adds none and removes none.** Each playbook's frontmatter `scenarios:` line is the authority, [focus_modes.md](focus_modes.md) the derived view. Under `full`: lesson · drill · write · mock · review · vocab · retro (+ tutor-prep under tuition). A functional goal pairs readily with `vocab` or `drill`, where lesson and mock are both inactive — the scenario runs then ride the carrier verb. (This row used to claim lesson is always active; a vocabulary-only functional instance found the assessment instrument had no live verb at all, 2026-08-15.) |
| Review measures | Scenarios passed vs total, sessions held vs planned, ledger growth. A scenario passed twice, cold, on separate days counts as owned |

Generation notes:

- Every scenario in the goal gets a **measurable probe** — one line stating what a pass
  looks like ("order a two-course meal and handle one unexpected question, no
  translation help"). A scenario without a probe is a mood, not a spec.
- **The goal carries a target-volume line** (`**Target volume**: ~L–H`), derived from the
  scenarios' own domains — the SRS-ceiling check binds on it, and without it the check never arms on a
  goal kind that has no deadline to keep it honest. (Found generating an Italian-native
  vocabulary-only instance, 2026-08-15.)
- Write the carrier verb **by name** into the generated goal contract's §Assessment. The
  running instance reads `docs/reference/goal.md`, never this file — "a scenario run" that
  does not say which verb performs it is a ritual with nobody assigned to it.
- The curriculum's units are built **from the scenarios**, not from a standard syllabus:
  each unit names which scenario(s) it serves, and grammar enters only when a scenario
  needs it. Cap the list at 10 — an eleventh scenario is the next goal contract, after
  these.
