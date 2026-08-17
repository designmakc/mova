<!-- mova:engine -->
# Scenario: tuition — a human tutor exists

**Orthogonal to the goal scenarios** — combines with exam, level, functional, or ledger.
Applies when Topic 4 found a tutor (or a firm plan to get one).

| Decision | Ruling |
| --- | --- |
| Goal template delta | Add the optional `## Tuition` section to whichever goal variant is in use (each template carries the clause commented-out) |
| Config | No key — tuition lives in the goal contract's Tuition section (who, **meeting** cadence, spot-check agreement) |
| "Mock" delta | Speaking/oral assessment can run live with the tutor under real timing — a tutor mock outranks an agent-simulated one for the speaking section |
| Active verbs | Adds **tutor-prep**: before each tutor visit, build the pack — current unit context, error-tally hot zones, and the current unverified-fact (`?`) list for spot-checking |
| Review measures | Unchanged, plus: `?`-marks cleared per tutor cycle (the confidence panel's number should move after each visit) |

Generation notes:

- The Tuition clause records: tutor's name/channel, **the meeting cadence**, what runs
  live there (speaking practice, oral mocks), and the **spot-check agreement** — the tutor
  is the workspace's state-2 verification source (`docs/mechanics/verification.md`); their
  confirmations come back through the feedback intake and clear `?` markers with a
  `tutor-confirmed <date>` trail.

- **Three cadences exist; setup writes exactly one of them.**
  [../../playbooks/tutor-prep.md](../../playbooks/tutor-prep.md) is the authority for the
  other two — it is the file that actually runs.

  | Cadence | Number | Who owns it |
  | --- | --- | --- |
  | **Meetings** — how often learner and tutor sit down | the learner's answer to interview Topic 4 | the Tuition clause. The only number setup writes |
  | **The unverified-fact (`?`) list** — everything still unconfirmed, printed for bulk clearing | **every prep pack, uncapped** | tutor-prep.md § Before the session, item 4 |
  | **The spot-check** — 10 sampled ledger rows + 5 sampled transfer/taxonomy claims | **every Nth prep pack, default N = 5** | tutor-prep.md § Every Nth session |

  Write the meeting cadence; **cite** the other two, never restate them as numbers. A
  clause that fixes its own spot-check cadence contradicts the playbook that runs the
  spot-check, and neither file can see the other's number. If the learner genuinely wants
  a different N, set it in the clause and say in the same sentence that it overrides
  tutor-prep.md's default — an override that announces itself is not a contradiction.
  (Found generating a German-native level goal with a tutor, 2026-08-15: the scenario file
  demanded a cadence, supplied none, and the instance caught the collision by accident.)

- **No tutor → no Tuition section.** Never generate a placeholder tutor clause; the
  tutor-prep verb then answers "no tutor is configured — say so and point at this file"
  rather than pretending.
- If the learner plans a tutor "later": note it as an open milestone in the plan
  (Discovered bin), not as a Tuition clause.
