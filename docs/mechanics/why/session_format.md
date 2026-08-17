<!-- mova:engine -->
# Why — session_format.md

> The provenance of [../session_format.md](../session_format.md): the incidents, audits and
> measurements each rule was bought with. **A study session does not read this file.**
> `playbooks/retro.md` and the housekeeping pass read both, and new provenance is written
> here — not back into the rule file.
>
> The rule keeps its marker (*assumed* / *derived from …* / *measured*) where a session
> reads it; that tag is what tells a session whether it may question the rule. Only the
> story moves. Nothing here was summarised: every paragraph was moved verbatim.

## What each rule was bought with — the markers

Moved out of the rule file's header (2026-08-17), which had accumulated a central list of
provenance markers while telling every reader that provenance belongs here. The rules that
carry a marker at the point of use keep it; this is the part no single rule owned.

- **The five parts and their time boxes** began as scaffold guesses, not measurements. Part 2
  was widened once because a guess did not survive contact with a real session.
- **The part 3/4 order is derived from limba SES-005**, where running the graded check before
  the repair loop visibly worked.
- **The repair loop's diagnosis step is derived from SES-007 and SES-009.** Its score arc is
  retracted — see *The repair loop* below.
- **The calibration split and the part-1 box rule are derived from SES-004.**
- ⚠️ **Any score in either file predating 2026-08-09 may be inflated by answer leakage.**
  limba's leak audit that day found sets where most answers were printed in other items'
  prompts. The rules the audit produced are in the rule file; the audit itself is limba
  history.

## The deck is rebuilt by the session that moved a tier

limba, 2026-08-10: its first-unit deck sat frozen while the ledgers moved underneath it, so the
drill surface showed tiers that were no longer true. That is why close-out step 9 regenerates
the deck rather than offering it as a choice.

**Hard cap of 3 repair loops**: limba SES-007 stabilised on the third.

## The drill's 10–15′ box, and why it is not a prediction

**limba measured three drills against that heading: 15′, 36′ and 55′** — a 3.7× spread, and the
55′ run is the one that also produced a 56-slot diagnostic, a 46-slot retest and 16 more items
before anything noticed (PORT-016, 2026-08-17). The heading was a scaffold guess, and its own
record contradicts it.

**limba deliberately did not re-fit the number**, and mova follows: three points justify stopping
the quote, not replacing it with a different quote. Its `/review` verb owns the re-fit once ~10
sessions of one learner's data exist. What changed instead is the framing — the box is a budget
the learner agrees and the set is sized to fit it (`playbooks/drill.md` § The size rule), and the
hub prices the actual queue from `srs.md`'s cost model rather than repeating a figure measured on
nobody (0.14.0).

**The learner-facing surfaces followed in 0.14.0.** `README.md` and `docs/guide/commands.md` had
carried "10–15 minutes" as a plain fact about the reader. They now name the work and say what the
reference workspace actually measured, because a person deciding whether to adopt this needs a
time and a person already studying has a hub that computes theirs.

## A drill's SRS pass has no band

limba SES-010 scored 61%, and SES-009's blocks 71% and 67%. All three came close to being read
against the part-3 band, which was fitted to ten questions on a day's new material and means
something else entirely on a pass over old rows.

## Part 1's box does not bind a drill

limba's learner found this after SES-009 left 53 items unreviewed, and asked why a drill would
ever aim at anything but zero.

## A block budget is held across the session, not per set

limba SES-014's individual sets were each reasonable and the session still ran past two hours.

## The five parts

**Parts 3 and 4 swapped** (limba SES-006 / 2026-08-03), after SES-005 ran them in this order
at the learner's request. Two reasons it stays: the check now measures **what the teaching
alone landed**, uncontaminated by a practice round, and practice becomes **targeted repair**
instead of generic use. It visibly worked — three items missed in SES-005's check were
produced correctly in practice twenty minutes later, including one broken since SES-003.

⚠️ **Scores are not comparable across such a change.** limba's SES-003 and SES-004 (5.5, 7.0)
were post-practice; SES-005 onward (7.25) were pre-practice and read a few points lower for
the same knowledge. The 60–70% band below is calibrated on the *new* measurement — when this
instance changes where the check sits, expect the same discontinuity and do not read the
trend across it as a smooth line.

Part 2 went 15′ → 30′ (limba, 2026-07-30): eight beats plus 10–20 vocabulary items does not
fit in less, and limba's first unit session proved what happens when it is attempted. Real
durations get measured over this learner's sessions and the pacing table recalibrated at a
review ([playbooks/review.md](../../playbooks/review.md)) — not guessed.

## The orient ritual

Added in limba, 2026-08-07, after its housekeeping audit found the shared steps living in one
playbook out of six: `rename` and `topics.md` appeared only in the lesson playbook,
`git status` in none. The cost was not theoretical — a skipped rename the learner had to ask
for, two rounds of untaught material scored (both caught by the learner mid-exercise), and a
draft visual overwritten because nothing looked for it. **Playbooks stay thin by invoking
this block, not by omitting it.**

   Added in limba, 2026-08-12, after a lesson took its Next pointer from `SES-014` while
   `SES-015` was the newest entry and was already the HEAD commit. It cost a mid-session
   correction and a renumbered session. Two cheap commands disagree loudly when this happens;
   one `head` does not. **On a day with several sessions this matters more, not less** — the
   newest entry may be minutes old.
5. **Rename the previous session** to `SES-NNN · <compact identifier>` per §Session titles
   below — the current session cannot rename itself.
6. **Check [../reference/topics.md](../reference/topics.md) before testing or scoring any
   form.** Production is bounded by the topic map, not by the ledger tier
   ([srs.md](srs.md)) — an item whose inflection is still `pending` is scorable only in its
   dictionary form and taught chunks. Two limba sessions scored untaught morphology and
   reported deflated scores because nothing in the flow said to look.
7. **Announce placement** — per the section below.

## The repair loop

Added in limba, 2026-08-07. **The learner invented this shape** — *"test → answers →
analysis + explanations of what was wrong + correction material → new test that covers what
was wrong before"* — and ran it unprompted in SES-007.

⚠️ **limba's 43% → 63% → 86% arc is retracted as evidence (audited 2026-08-09).** SES-007's
second test re-asked SES-007's first test with the answer key printed **in the same
message**: 11 of 12 items in section A, all four question-word items, and every register flip
were identical prompts whose answers had just been published. The third round then re-asked,
for a third time, the items that had failed twice. The arc measures re-reading two answer
keys, not repair.

**What survived that audit, and it is the important half** (moved out of the rule file
2026-08-16, to pay for § Part 1 runs only when it can produce something):

- **The diagnosis step is the loop's real product.** SES-007's grouping found that four verbs
  had never been given as paradigms — a missing table, after two sessions had logged it as a
  memory failure. SES-009's grouping found that every noun corrected last session came back
  right and every uncorrected one went wrong — *storing corrections, not running the rule*.
  Neither discovery depended on a score, and neither was reachable any other way.
- **SES-009 is the one loop whose retest used genuinely new items** — 12 different nouns — and
  it went **71% → 67%**. Flat. That is what an uncontaminated retest looks like, and it is the
  honest baseline for what the shape delivers in one sitting.
- SES-005's single-pass repair remains a real negative result: all four items it "fixed" were
  wrong again two days later. SES-007 said the same thing about its own predecessor.
  **Nothing in this machinery's history has ever demonstrated that a same-sitting gain
  survives to the next session** — the loop's retest number and SES-005's both measure
  minutes-old exposure.

Step 5's "not a re-run of the same paper" was written by SES-007, which had already broken it.
That is why the check is a script and not an instruction.

## Part 1 runs only when it can produce something

Added 2026-08-16, from the learner's observation that a lesson sometimes opens with a review
block nobody needs: the first lesson after a placement, a lesson the learner asked to start at
the teaching, and the second or third lesson inside one afternoon.

**The rule was already half-written and never finished.** limba, 2026-08-12, established both
halves of the premise — a row moves tier at most once per calendar day, and the calibration
band does not apply to a same-day repeat — and then told the session to run the block anyway,
as declared re-exposure. That is a block with no tier move and no usable number holding a ~10′
box inside a 60–75′ lesson. `queue.mjs --counts` had even been taught to print the overlap
(`N of those reviewed today`) so a session could see it without computing it; nothing
downstream acted on what it printed.

**Why "skip" rather than "run it degraded".** Two facts in this repo point the same way. The
loop section above: no same-sitting gain has ever been shown to survive to the next session.
And srs.md's cost model: a block is ~6 minutes of real time, so this is not a rounding error.
Against them stands one genuine counter-fact — limba's learner, 2026-08-09: *being asked about
it is what makes me remember it*. Re-exposure has learner-reported value and no measured
durable value, which is exactly the profile of something that should be **offered and cheap**
rather than **mandatory and boxed**. Hence the offer in the middle row of the gate table.

**Why the gate reads the queue and not the session number.** "First lesson ever" was the
learner's own framing, and it is not the condition. A placement that ran three days ago and
seeded twenty rows leaves those rows genuinely due at a real interval, and part 1 should run.
The queue already knows this; the calendar does not. Same for "second lesson today" — what
makes it skippable is the same-day overlap the queue prints, not the count of sessions.

**Why the reclaimed time may not go to part 2.** limba cut its intake from 16 to 12 on a
48-hour retest. An intake number that moves because part 1 happened to be empty is an intake
number no review can re-fit.

**Why the log needs a token.** The review playbook re-fits the interval ladder from session
entries. A skipped part 1 and a collapsed part 1 both leave the SRS field without a score, and
they mean opposite things — one is nothing to measure, the other is retention failing.

## Repair vs new material

Two limba sessions invented this distinction independently and neither could point at a rule
(ERR-009 for a pair of look-alike verb endings; SES-007 for the present tense), so here it
is. **[../reference/topics.md](../reference/topics.md) is the arbiter, not the ledger.**

## What the graded check must sample

limba SES-016 taught 12 new words and one grammar point. Its 10-item check spent 6 items on
the grammar and 4 on vocabulary, and **only 3 of the 12 new words appeared in it at all**.
That was not a wrong decision — the grammar was the day's target and words get their real
read-out at the spaced interval — but it was not a decision either. Nothing said anything
about the balance, so it fell out of how the items happened to be written.

## Posing a set — the operation inside the item

limba SES-016's graded check was a table: the words to combine in one cell, the operation —
*"plural phrase, with the number two"* — in the next. **Five of ten items came back with the
left cell answered and the right cell ignored**, and two of those five were flawless singular
phrases. The target language was right; the instruction simply never executed. The reported
score was **31%**; on the five items that had no second column to miss, it was **86%**.

It is structural, not a slip: the same session's warm-up had already found the learner answering
what a table's first column asks. **A table is read as a list of operands.** Anything that is not
an operand has to be where the eye is already going.

## Posing a set — one line per part

limba SES-014 opened by asking *article + singular + plural* on one line and got **no plurals
at all** for ten nouns. The learner: *"plurals missed because I didn't notice it in the
instruction."* Scoring that as written would have recorded 0/10 on the plural for someone who
was never asked in a way they registered. This file already says multi-part items get per-part
**marks**; nothing said how to **ask** them.

## The split probe

Same session, same rule, same learner: the form probe read **89%** on securely-known words and
**75%** on ten carrier nouns, while retrieval on the newest intake read **17%**. Nothing else in
that session could have separated those, and they have **opposite repairs** — one needs the word
met again, the other needs the rule. A combined question returns one number that blends them,
which is how a large share of limba's top error code turned out not to be a gender problem at
all.

## Frame or alone

limba's *cine*, *cum* and *unde* scrambled as bare items and came back correct inside full
questions ten minutes later, with nothing taught in between (ERR-018). The two are **different
measurements**, and a set that does not say which it ran cannot be compared with one that ran
the other. A chunk test will keep reporting success while the free-standing item stays broken —
plausibly what had been happening to limba's interrogatives for weeks.

## Tidy vs valid

Not a rule, a standing bias to correct for. limba's leaked register drill was built as mirror
pairs **because mirror pairs make a clean two-column table**. The recognition block came after
the production block **because that reads well**. A gender gate was given an exit **because an
ordered four-gate procedure is elegant**, and it had to lie to have one. A "10–15′" heading sat
above a 118-item session. Every one of those was a formatting instinct beating a measurement.
When a set looks pleasing, that is the moment to ask what the shape is costing.

## Answer leak — per item

That rule — *the translation stays while an item is tier 1–2* — was written for teaching and
silently applied to testing, where it hands over the retrieval being measured. limba's learner
caught it mid-drill (2026-08-09). When a test item needs the translation to isolate one
variable (scoring gender without also scoring recall), say that out loud, and score only the
variable you isolated.

## Answer leak — set-wide

A 16-item register drill was built as **mirror pairs** — each row showed one register and asked
for the other. Every row therefore printed its partner's answer. A recognition block then asked
the learner to label forms that the first block had displayed *with their labels attached*, and
a phrase block asked for phrases already sitting in earlier prompts. **14 of the 16 answers were
on the page.** The two that were not were the only two the learner got wrong. The session
reported **88%** and concluded the zone was repaired — for a zone that had produced nothing but
errors for six days. The learner spotted it: *"almost all of the answers were obvious from the
other questions in the same exercise."*

## Re-exposure

This is the exact half that broke. SES-007 was right to re-ask; it was wrong to report the
result as 43% → 63% → 86% and let a design rule be derived from it.

## The close-out ritual

Measured in limba: the close-out is ~31% of a session's agent-active time, and about a third
of those turns were the agent re-reading a document to recall a FORMAT. The steps below are
still the contract — the script does not replace them, it stops you paying a model round-trip
to remember each one. **It never commits and it never writes a log**: `log-append.mjs` owns
the IDs inside its lock, and a script that commits will eventually sweep a sibling session's
unfinished work into your commit.

## A session that continues past its close-out

limba SES-009 completed the ritual and committed; the learner then asked to keep going, and 30
more items were reviewed. The continuation was opened as **SES-010** — a judgement made on the
spot with nothing in the mechanics behind it. It is the right call and now it is a rule: the
log is append-only, so the closed entry cannot grow, and a second entry keeps the IDs clean,
the pacing arithmetic honest and the SRS counts attributable. Re-run the close-out for the new
ID; do not amend the old one.
