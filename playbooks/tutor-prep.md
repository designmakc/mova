<!-- mova:engine -->
---
verb: tutor-prep
summary: Build the prep pack before a tutor session and ingest the tutor's corrections after it.
triggers: "prep my tutor session", "tutor session tomorrow", "back from my tutor", "ingest tutor feedback"
requires: goal.md §Tuition — this verb exists only for instances in the tuition scenario
scenarios: all
---

# /tutor-prep — make tutor minutes compound

Purpose: a human who has the language is the workspace's only **state-2 source**
(tutor-confirmed, `docs/mechanics/verification.md`) and its only external check on typed
practice. This playbook converts each tutor session into workspace state twice: a **prep
pack** going in, an **ingest pass** coming back. It realizes the design limba specified but
never built (`docs/projects/speaking_prep.md`: answer bank over improvisation, prep pack
per session, external errors enter the same error log).

**Activation rule.** `scenarios: all`, but the verb is live only when the goal contract has
a `## Tuition` section — that section existing *is* the tuition scenario. Setup and the
agent adapters generate a shim for this verb **only then**, and `docs/agents.test.ts`
requires the adapter only then. No tutor, no verb.

**Reads**: `docs/reference/goal.md` §Tuition, `docs/curriculum.md` (current unit),
`docs/plan.md`, `state/` ledgers (due + shaky + `?`-marked rows), `docs/logs/error_log.md`,
`docs/reference/transfer.md`, the error taxonomy.

**Writes**: `work/tutor/YYYY-MM-DD_prep.md`, every Nth session
`work/tutor/spotcheck-NNN.md`, and on ingest: `state/` ledgers, `docs/logs/error_log.md`,
`work/feedback/` entries, verification trails.

## Before the session — the prep pack

Write `work/tutor/YYYY-MM-DD_prep.md` (date = the tutor session's), containing:

1. **Topic** — from the current unit and the plan's phase; one line on what the unit is
   mid-way through, so the tutor pushes the same material the workspace is teaching.
2. **Structures to force** — the unit's grammar targets plus the top open error-taxonomy
   codes; the tutor should engineer situations that require them.
3. **10 ledger items to actually use** — due and shaky (tier ≤ 2) rows first. Not a list to
   review: a list to smuggle into conversation.
4. **The current `?` list** — every unverified fact in the ledgers, printed for bulk
   clearing; the tutor is the one person who clears these in minutes.
5. **A feedback section** — blank, structured fields (corrections heard / new words that
   came up / facts confirmed or contradicted / tutor's own notes) that the after-pass
   ingests. Give the human the file to bring; the pack is useless in the repo alone.

## After the session — the ingest pass

Work through the pack's feedback section (or the human's retelling):

- **Corrections** → `docs/logs/error_log.md`, coded per the error taxonomy, each naming its
  interference source when there is one — externally-heard errors enter the same log as
  typed ones.
- **New items** → the vocab flow (`playbooks/vocab.md`): captured, dictionary-checked,
  appended with provenance.
- **Confirmed facts** → promote per `docs/mechanics/verification.md`: remove the `?`,
  append the trail (`tutor-confirmed YYYY-MM-DD`). **Contradicted facts** → correct the
  cell *and* leave the trail saying what changed on whose word; if a taught claim was
  retired, run teaching.md's artifact sweep in the same session.

## Every Nth session — the spot-check (default N = 5)

Count the prep packs in `work/tutor/`; when this one makes the count a multiple of N, also
emit `work/tutor/spotcheck-NNN.md` (NNN increments): **10 sampled ledger rows** (mix of
tiers, favoring rows whose trails name no source) and **5 sampled transfer/taxonomy
claims** (`docs/reference/transfer.md` claims still `(assumed)`, taxonomy codes' stated
causes), each as a mark-it line the tutor can tick or correct in a minute. Returns flow
through the `work/feedback/` intake like any retro material; the next session applies them
as promote/demote provenance moves per verification.md. The spot-check is the workspace
auditing *itself* through the tutor — the one loop that catches what the dictionary and
the agent both miss.
