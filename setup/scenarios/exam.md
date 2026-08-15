<!-- mova:engine -->
# Scenario: exam — a certificate with a date

The reference scenario (limba's own). Applies when Topic 2 named a specific exam.

| Decision | Ruling |
| --- | --- |
| Goal template | [../templates/goal-exam.template.md](../templates/goal-exam.template.md) |
| `goal_kind` | `exam` |
| Spec sentence | `**The exam is the spec.**` — the exam's sections define done |
| `sections` | The exam's real section letters (e.g. `R W L S`). Research the actual format in the goal step; a guessed section list mis-scopes every unit |
| `goal_date` | Set when a date exists (registered, legal, or the learner's locked decision — label which, in the Deadline section). Omit the config line only when the exam is genuinely undated |
| "Mock" means | A timed exam section (or full paper) in the exam's own format, scored against its rubric, frozen as a snapshot. **Real past papers outrank generated material** — the goal step lists where to get them |
| Active verbs | **The focus mode decides** ([focus_modes.md](focus_modes.md); playbook frontmatter is the authority). Under `full` — the usual pairing for an exam — all of them: lesson, drill, write, mock, review, vocab, retro (+ tutor-prep under tuition). Under a narrower focus the timed section still gets run, on the carrier verb |
| Review measures | Pace vs `goal_date`: units remaining ÷ weeks remaining vs observed rate; mock-score trend vs the pass threshold |

Generation notes:

- The Deadline section carries limba's **deadline arithmetic** shape: certificate-by
  date → results turnaround → target sitting → retake buffer (state whether the target
  date spends it), plus a **TO-CONFIRM** list for every fact not yet verified with the
  provider (session calendar, pass threshold, registration mechanics). Unresearched
  logistics go on the TO-CONFIRM list as tasks with owners, never as silent guesses.
- Sections drive the curriculum: every unit names which section letters it serves, and
  the topics map's Exam column uses the same letters (`npm test` enforces the subset).
- Set a `**Target volume**: ~L–H` vocabulary line only if the exam genuinely implies one;
  `npm test` then checks the SRS ceiling can sustain it at the learner's pace. This is the
  one goal kind where the line is optional — the exam date keeps the arithmetic honest by
  itself. The dateless kinds (level, functional, ledger) always carry one.
