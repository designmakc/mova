<!-- mova:engine -->
---
verb: drill
summary: Short practice - SRS queue plus the top error patterns, or a full test-repair-retest loop on one weak zone. No new material.
triggers: drill, quick practice, short on time, review only, loop on this until it sticks
requires: node, git
scenarios: full drill vocab
---

# drill — the short-day session

Purpose: keep the SRS rotation and the weak zones warm on days without time for a full
lesson. **No new material, ever** — that's what makes it safe to run tired.

**Reads**: `node scripts/queue.mjs`, the error tally (`node scripts/tally.mjs`),
docs/mechanics/srs.md + the instance's error taxonomy (docs/mechanics/error_taxonomy.md) +
session_format.md (the repair loop).

**Drill the LIVE tally — the first list `tally.mjs` prints.** Three of its four lists exist
because a top row was wrong before (limba, 2026-08):

- **not the surface tally** — in limba a written-diacritic code sat above the unproduced
  vowel that caused it for three sessions, so counts follow `Root:` links to the cause;
- **not the all-time tally** — it carries occurrences a later clean measurement has already
  answered. limba's `NOUN-GEN` held the top row for **four consecutive sessions** while the
  gender rule scored 90% cold, and all four sessions had to disobey this instruction by hand.
  The live list is the same count minus what `Measured:` has banked;
- **read the SIBLING GROUPS block too.** Two codes can be one mechanism in two systems — in
  limba the article and the adjective ending were, and separately they rank below what they
  add up to.

If the lists disagree, say so out loud and drill the live one. And when this session measures
a zone clean on a real leak-checked set, **write the `Measured:` token** — that is how the
list stays true for the next session (the instance's error taxonomy documents the token).

**Writes**: ledger rows touched (tier, `last`), a short SES entry, any new ERR entries,
commit.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session, not only to the lesson playbook. The flow below is only what happens *between*
them. Orient's topics.md step matters here more than anywhere: a drill scores forms, and a
drill that tests `pending` morphology reports a number that is simply wrong.

## Two modes — pick one and say which

| Mode | When | Shape |
| --- | --- | --- |
| **Sweep** (default) | routine upkeep, tired days | queue + 3–5 error-code exercises |
| **Loop** | one zone is genuinely broken, or the learner asks to work until it sticks | the **repair loop** from session_format.md, run on that zone |

Loop mode costs more than 15 minutes — **say so up front and agree the budget** rather than
discovering it at the end. Its value is the **diagnosis** step, not the retest number:
limba SES-007's grouping found a missing conjugation table, SES-009's found the learner
storing corrections instead of running the rule. ⚠️ limba's old claim here — *"the shape
that took SES-007 from 43% to 86%"* — is **retracted**; that arc re-asked its own questions
after publishing the key (limba's 2026-08-09 leak audit; its surviving rules live in
session_format.md's answer-leak sections). **Retest on genuinely new items, run
`node scripts/leakcheck.mjs` on the set first, or report no number at all.**

## The size rule — count before you ask

The time box is a **constraint, not a description**. limba's drill once ran a 56-slot
diagnostic, a 46-slot retest and 16 more items under a "10–15′" heading, and nothing in the
flow noticed until close-out.

**Before presenting any set: state its item count and the minutes it implies, out loud.**
Rates come from srs.md's cost model (recognition / bare production / full package, plus the
per-block fixed cost); a written exercise runs ~45s per item. If the number overruns the
agreed budget, cut it *before* asking, not after. A drill that silently becomes a mock has
stopped measuring what it claims to measure.

## The line you may not cross

**Repair vs new material** is defined in session_format.md and topics.md is the arbiter.
Briefly: `covered` is fair game; `pending` is not, **even when the vocabulary is already in
the ledger**. If a `pending` system is blocking progress, build the reference material so the
learner isn't stuck, then stop, name it, and route the teaching to a lesson through the Next
pointer. Never teach *and score* a pending system here.

## Flow

0. **Orient ritual** (session_format.md) — every step.
1. Run the queue; announce counts, the top 2–3 error codes, and **which mode** this is.
2. **SRS pass**: quiz due items oldest-first at the mode their tier calls for (srs.md),
   taking what fits the box — the remainder surfaces next session rather than being rushed.
   Promote/demote per srs.md.
3. **Then, by mode:**
   - **Sweep** — 3–5 targeted exercises on the top **live** tally codes (limba's example:
     ART-DEF → article the bare nouns in these sentences). If the error log is empty, drill
     the predicted high-alert zones from
     [docs/reference/transfer.md](../docs/reference/transfer.md) instead. If a
     `work/visuals/` artifact exists for the zone (check its README index), open it as the
     reference sheet.
   - **Loop** — run the repair loop: test → key → diagnose by cause → build the correction
     material → retest on new items. Honour its exit conditions and **name which one fired**
     (cleared / stalled / boxed / 3-loop cap).
4. **Close-out ritual** (session_format.md) — every step, including the plain-language
   summary. The SES entry is short for a drill; the ritual is not. If a loop ran, the entry
   records every loop's score, not just the last — the *shape* of the curve is the finding.

**First run special case — placement, when this verb is the one that carries it.** In
`focus: drill` and `focus: vocab` there is no lesson verb, so drill is the carrier for both
rituals that survive every focus mode (`setup/scenarios/focus_modes.md`). **The condition,
the offer, the decline and the snapshot are session_format.md's** — § The placement
calibration — and one command decides it: `ls docs/snapshots/*_placement.md`, nothing listed
means the placement is still owed. Do not re-derive it here; the wording it replaces ("no
snapshot exists in docs/snapshots/") could never fire, because setup always writes the
intake one (found in the first generated lesson pages, 2026-08-15). What is drill-specific:
**probe across the curriculum's early units instead of drilling a queue that has nothing in
it yet.** The same holds for the goal's assessment instrument — a scenario run, a descriptor
sweep, a ledger audit — when the plan says one is due and no mock verb exists to run it.
Probing is not teaching: the no-new-material rule stands unchanged, and a probe that starts
teaching has become a lesson this instance does not offer.

This is also the **only** waiver of "the line you may not cross" above, and it is narrow: a
placement or an assessment instrument may **score** `pending` systems, because measuring
what the learner already has is the entire point, and it still may not **teach** them. The
snapshot's "Not exercised:" list carries what the probe skipped. Routine drills keep the
line exactly where it is. (Found generating an Italian-native vocabulary-only instance,
2026-08-15: the handoff promised "say lesson" to an instance with no lesson verb.)
