<!-- mova:engine -->
# Scenario: tuition — a human tutor exists

**Orthogonal to the goal scenarios** — combines with exam, level, functional, or ledger.
Applies when Topic 6 found a tutor (or a firm plan to get one).

| Decision | Ruling |
| --- | --- |
| Goal template delta | Add the optional `## Tuition` section to whichever goal variant is in use (each template carries the clause commented-out) |
| Config | No key — tuition lives in the goal contract's Tuition section (who, cadence, spot-check agreement) |
| "Mock" delta | Speaking/oral assessment can run live with the tutor under real timing — a tutor mock outranks an agent-simulated one for the speaking section |
| Active verbs | Adds **tutor-prep**: before each tutor visit, build the pack — current unit context, error-tally hot zones, and the current unverified-fact (`?`) list for spot-checking |
| Review measures | Unchanged, plus: `?`-marks cleared per tutor cycle (the confidence panel's number should move after each visit) |

Generation notes:

- The Tuition clause records: tutor's name/channel, cadence, what runs live there
  (speaking practice, oral mocks), and the **spot-check agreement** — the tutor is the
  workspace's state-2 verification source (`docs/mechanics/verification.md`); their
  confirmations come back through the feedback intake and clear `?` markers with a
  `tutor-confirmed <date>` trail.
- **No tutor → no Tuition section.** Never generate a placeholder tutor clause; the
  tutor-prep verb then answers "no tutor is configured — say so and point at this file"
  rather than pretending.
- If the learner plans a tutor "later": note it as an open milestone in the plan
  (Discovered bin), not as a Tuition clause.
