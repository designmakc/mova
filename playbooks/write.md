<!-- mova:engine -->
---
verb: write
summary: Writing practice in the goal contract's genres - prompt, coded correction, model answer, chunk harvest.
triggers: write, writing practice, composition
requires: node, dictionary, git
scenarios: full write
---

# write — composition practice in the goal's genres

Purpose: train the goal contract's written-production assessment genre by genre, with
corrections that feed the error log and vocabulary that feeds the ledger. The genre list and
its timing come from [docs/reference/goal.md](../docs/reference/goal.md) §Assessment (in
limba: informal letter, formal letter, opinion text, 60 minutes); which genre is due comes
from docs/plan.md's routing.

**Reads**: current phase (docs/plan.md), docs/reference/goal.md (task formats + genre
progression), docs/reference/transfer.md, the instance's error taxonomy
(docs/mechanics/error_taxonomy.md), `node scripts/tally.mjs --codes` (for the blind-spot
re-read below).

**Writes**: `work/writing/YYYY-MM-DD_<slug>.md` (the artifact), state/vocab.md (harvested
chunks), SES + ERR log entries, commit.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session. The flow below is what happens *between* them.

## Flow

0. **Orient ritual** (session_format.md) — every step. The topics.md check bounds the
   correction pass too: a structure the curriculum has not delivered is a gap in the
   material, not a learner error to code.
1. **Prompt**: one assessment-realistic task in the due genre (length and register per the
   goal contract's writing tasks; timed once the plan says so — say the time budget up
   front).
2. **The user writes.** No help during (assessment conditions); questions allowed only in
   untimed warm-ups, while the plan still marks this genre untimed.
3. **Coded correction pass**: every error → fix + one-line why + taxonomy code +
   interference note (per the profile's language ranking and
   [docs/mechanics/verification.md](../docs/mechanics/verification.md)'s naming rule). Then
   the **blind-spot re-read** — one dedicated pass for the top root codes in this instance's
   error tally (`node scripts/tally.mjs --codes`): the errors the learner's held languages
   can't see. limba's case: a UA/RU speaker's articles (ART-DEF/ART-POSS) — invisible to
   eyes trained on languages with no articles at all, so a general pass kept missing them.
4. **Model version**: write the same task well, **at the goal contract's target level, not
   above it** — the compare is the lesson.
5. **Harvest**: 3–5 reusable chunks (collocations, connectors, formulas) into the vocab
   ledger via the vocab playbook's capture rules (verified per verification.md).
6. **Save the artifact** to work/writing/ — original, corrections, model, score-if-timed.
7. **Close-out ritual** (session_format.md) — every step, including the plain-language
   summary.
