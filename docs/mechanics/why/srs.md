<!-- mova:engine -->
# Why — srs.md

> The provenance of [../srs.md](../srs.md): the incidents, audits and measurements each rule
> was bought with. **A study session does not read this file.** `playbooks/retro.md` and the
> housekeeping pass read both, and new provenance is written here — not back into the rule file.
>
> The rule keeps its marker (*assumed* / *derived from …* / *measured*) where a session reads
> it; that tag is what tells a session whether it may question the rule. Only the story moves.
> Nothing here was summarised: every paragraph was moved verbatim.

## Tier 0

limba's scaffold seeded 12 vocabulary and 3 grammar rows at tier 1 so the ledger wasn't
empty. The queue duly reported them **due** — but *review* is the wrong verb for material
never taught. SES-002 had to deliberately **not** mark them reviewed to avoid falsifying the
ledger, and `G-0002` (the definite article, not taught until four units later) then surfaced
as due in **six consecutive sessions**, each of which skipped it. A row that is due but
unteachable is noise in the one signal part 1 produces.

## The ladder

Added in limba, 2026-08-03 (SES-006), **rebuilt 2026-08-12** by its housekeeping pass. The
original ladder asked tier 1 and 2 for **production, both directions** and swept tier 3+ for
recognition — that is, it demanded the hardest question of the weakest items and the easiest
of the strongest. The mode column above now runs the other way, one rung at a time.

**What the measurement showed** (limba SES-014 — the split is a property of that learner;
expect one like it, not this one). Eight leak-checked blocks in one session: recognition on
tier-3 words scored **100%**; the form probe with the base form supplied scored **89%** on
secure words and **75%** on ten words never met before; full-package production on **tier-1**
words scored **17%**. That 17% is partly the instrument — a tier-1 word was being asked the
tier-3 question — and a retrieval attempt that returns nothing teaches almost nothing. The
learner's own reading, mid-session: *"I have a progression and training while not failing too
much, e.g. faster pace, but more iterations."*

**The argument that had to be answered, because it is the load-bearing one.** Direction
transfer is asymmetric: practising production builds recognition as a by-product, while
practising recognition builds mostly itself. Check this learner's goal contract — in limba's,
two of the four exam sections are production. A recognition-first ladder feels better, moves
faster, and could quietly stop building the half the goal grades. That is what the promotion
gate below exists to prevent. This ladder **schedules** production; it does not reduce it.

**Throughput moves in the right direction, which was not obvious.** Tier 1 dominates any
session's queue because its interval is zero days, and in limba tier 1 went from ~20 s per
item to ~3 s under this ladder. Tier 3 got more expensive, but it is a 7-day rung and carries
far fewer items per session. The 55-row cap and the ~1,700-item ceiling in the tier-5 note
both still hold.

## The cost model

**Why there is a per-block term at all.** The old model was per-item only, and it
under-predicted a real chat drill by roughly **5×**: limba SES-014's 73 due items predicted
≈21 minutes and the session ran past two hours. The rates were not wrong about the learner;
they were wrong about the medium. A block in this workspace costs, once per block and
regardless of its item count: composing the set, running `leakcheck.mjs`, the learner reading
and typing, marking every item, publishing the whole sheet, and the grouped diagnosis. A
per-item rate cannot express any of that.

## Reviewed today

Three limba sessions ran on 2026-08-12. By the third, **every row the queue reported due
carried `last` = that day**. The count is not wrong — tier 1 has a zero-day interval, so
those rows genuinely are due — but a second look hours after the first measures nothing, and
`session_format.md`'s calibration table would read the low number as *retention has failed*
and cut the day's new material. That reading would be exactly backwards.

Three limba sessions invented this handling independently before it was written down (SES-015
and SES-016 both improvised it, hours apart, and said so in their logs).

## Carrier words

Used twice in limba before it had a name: to measure a rule when the entire ledger has just
been exposed, a session asks it over **fresh words the learner has never met** — supplying
the word class facts and the translation so that only the rule is scored. limba SES-015 ran
ten (*balcon, sertar, picior, ziar, castron, obiect, palton, borcan, motor, dosar*) and got
the only honest number available that session.

## The ceiling

limba's original ladder topped out at 21 days. At its learner's 5 study blocks a week and a
40-item cap that is **28.6 item-reviews/day**, which sustains a **ceiling of ~600 items even
if every item were mature** — against that goal contract's stated target of 1,500–2,000. The
ceiling was a property of the top interval, not of the learner's performance, so no amount of
good recall could have fixed it. A 60-day tier 5 raises the same arithmetic to **~1,700**,
and the cap at 55 raises it again. Re-run this arithmetic against **this** learner's goal
contract and session rhythm — every input to it is a default, and the method survives any of
them changing.
