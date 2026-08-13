<!-- mova:engine -->
# Session format — the five-part lesson and the close-out ritual

> One session = one committed unit of progress. A session that isn't logged didn't happen.
>
> **Provenance** ([README.md](README.md)). Incidents cited as `SES-NNN` / `ERR-NNN` and every
> Romanian example in this file are limba's — the reference implementation this engine was
> extracted from. The five parts and their time boxes are **default (measured on limba's
> learner — recalibrate)** — and even there they began as scaffold guesses; part 2 was
> widened once because a guess did not survive contact. The **part 3/4 order is derived from
> limba SES-005**, where running the check first visibly worked. The **repair loop's
> diagnosis step is derived from SES-007 and SES-009**; its score arc is **retracted** — see
> the ⚠️ under the loop below. The **calibration split** and the **part-1 box rule** are
> derived from SES-004. Question the boxes freely; the derived rules need evidence of the
> same kind that produced them.
>
> ⚠️ **Any score quoted in this file predating 2026-08-09 may be inflated by answer leakage**
> — limba's leak audit (2026-08-09) found sets where most answers were printed in other
> items' prompts. The rules that audit produced live below; the audit itself is limba
> history.

## The five parts (full lesson, 60–75 min)

| # | Part | Time | What happens |
| --- | --- | --- | --- |
| 1 | SRS review | ~10′ | `node scripts/queue.mjs` → quiz due items **at the mode their tier calls for** (recognition at tier 1, bare production at 2, the full package as the tier-3 gate, sweep at 4–5 — [srs.md](srs.md)); grammar items via one production sentence each → update `tier`/`last` |
| 2 | New material | ~30′ | Current unit ([../curriculum.md](../curriculum.md)): **10–20 new vocab items** with the pack's per-item facts + transfer hooks; 1 grammar point — built per [teaching.md](teaching.md), all eight beats, **split chat/visual per its table** (paradigms and word lists live in the visual, chat carries the contrast) |
| 3 | Graded check | ~10′ | 10 questions over today's + due material, **sampling at least 3 of the day's new words** (see below); score recorded in the session log |
| 4 | Applied practice | ~15′ | Short reading or guided dialogue that forces due + new items into use, **aimed at what part 3 just missed**; goal-adjacent formats preferred |
| 5 | Close-out | ~5′ | The ritual below |

The drill variant (10–15′) is parts 1 + 3 only, with error-pattern items mixed in
(→ [playbooks/drill.md](../../playbooks/drill.md)). Time boxes flex; the order doesn't.

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

## The orient ritual (every session, every playbook)

Added in limba, 2026-08-07, after its housekeeping audit found the shared steps living in one
playbook out of six: `rename` and `topics.md` appeared only in the lesson playbook,
`git status` in none. The cost was not theoretical — a skipped rename the learner had to ask
for, two rounds of untaught material scored (both caught by the learner mid-exercise), and a
draft visual overwritten because nothing looked for it. **Playbooks stay thin by invoking
this block, not by omitting it.**

1. **Read [../reference/profile.md](../reference/profile.md).** Who is on the other side —
   the language ranking a contrast must come from (`contrast_ranking`), the input method that
   is never an error (the pack's `normalize.mjs` — [verification.md](verification.md)), and
   what has already been settled. Skipping it is how a keyboard preference spent five days in
   limba's error tally shaping what got drilled.
2. **Run `date`.** Never take today's date from context — it may be stale, and every date
   here is load-bearing (SRS due-ness, pacing, snapshot order). One wrong date propagated
   across five files (limba, 2026-07-31).
3. **Run `git status --short work/`.** Untracked or modified artifacts are the residue of a
   session that never closed out. **Read any such file before writing near it** — in limba an
   unindexed draft visual was overwritten unread (2026-08-03).
4. **Run `node scripts/queue.mjs --counts`** and read the last `SES-NNN` entry's **Next**
   pointer in [../logs/session_log.md](../logs/session_log.md). **Identify "last" by heading,
   and cross-check it against git** — entries run 70+ lines, so a `head -n` of the file can
   show the *second* entry and read as the first:

   ```
   grep -n "^## " docs/logs/session_log.md | head -1   # the newest entry, by structure
   git log --oneline -1                                # its SES-NNN, independently
   ```

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

## Placement — every session, every section

The learner runs many sessions and returns cold. **State position before content:**

- **Session opener** — which unit of the curriculum, which phase, what it opens or closes,
  and what the learner will and will not be able to do afterwards.
- **Every teaching section** — the Placement beat from [teaching.md](teaching.md) ①,
  derived from [../reference/topics.md](../reference/topics.md), never improvised.

## Media moves (in parts 2–3)

Per [media.md](media.md), capability-gated by the profile: **sounds are played, not
described** (`scripts/speak.sh` inline, native links for the tricky ones); **systems get a
visual** with **embedded playable audio** (`node scripts/tts-embed.mjs`) — generate or reuse
from `work/visuals/`, check its index first, and **surface it in the response**, sent inline
and named by repo path; **listening runs through `afplay`**, proctored by the session. Every
link shown comes from, or gets appended to,
[../reference/resources.md](../reference/resources.md).

## Session titles in the app

Format: **`SES-NNN · <compact identifier>`** — limba's read `SES-003 · U01 sounds & a fi`,
`SES-007 · drill ART-DEF`, `SES-012 · mock R`. The prefix maps a tab straight to its
[session log](../logs/session_log.md) entry.

A session **cannot rename itself** — the rename tool refuses the current session. So each
session renames the **previous** one at orient, from the last `SES-NNN` log entry it already
reads. One session of lag; the learner can always rename the live tab by hand.

## The repair loop — test, diagnose, repair, retest

Added in limba, 2026-08-07. **The learner invented this shape** — *"test → answers →
analysis + explanations of what was wrong + correction material → new test that covers what
was wrong before"* — and ran it unprompted in SES-007.

⚠️ **limba's 43% → 63% → 86% arc is retracted as evidence (audited 2026-08-09).** SES-007's
second test re-asked SES-007's first test with the answer key printed **in the same
message**: 11 of 12 items in section A, all four question-word items, and every register flip
were identical prompts whose answers had just been published. The third round then re-asked,
for a third time, the items that had failed twice. The arc measures re-reading two answer
keys, not repair.

**What survives the audit, and it is the important half:**

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

So run the loop for its diagnosis, and **retest on genuinely new items or do not report a
number**. Step 5 already said "not a re-run of the same paper"; SES-007 wrote that rule and
had already broken it, which is why the check below is a script.

Every other shape here is **single-pass** — teach then check once, run the queue once, measure
once. Nothing re-tested the same material later in the same sitting, which is exactly the move
that produced durable gains. This is not SRS: the interval is **minutes, not days**, and the
second exposure is **aimed at the specific miss**, not at the item's schedule.

**The cycle:**

1. **Test** — a bounded set over the target material. Bounded means counted before it is
   asked (see the size rule below).
2. **Key** — mark it and show the correct answers plainly, all at once.
3. **Diagnose by cause, not by item.** Group the misses. *Why* did each fail? This is the
   step that carries the loop: SES-007's grouping revealed 4/4 correct on the two verbs ever
   taught as full paradigms and **0/4** on the three handed over as dictionary entries — a
   **missing table**, not a memory failure, after two sessions had logged it as the latter.
4. **Build the correction material** the diagnosis calls for — usually a visual
   ([media.md](media.md)), and note that a repair artifact is exactly where the marking rule
   in [teaching.md](teaching.md) pays off.
5. **Retest** — *new* items over the same ground, targeting the diagnosed causes. Not a
   re-run of the same paper; recognising a question is not knowing the answer.
6. **Loop or exit**, per below.

**Exit conditions — decide before starting, say which one fired:**

- **Cleared** — the retest reaches ~80% on the material that failed. Stop; the repair held.
- **Stalled** — two consecutive loops with no improvement. Stop. The problem is not drillable
  today; name it and route it to a lesson. Grinding a third time teaches frustration.
- **Boxed** — the time is spent. Stop mid-loop if you must, but **record what is still broken
  in the Next pointer** — an abandoned loop that leaves no trace is worse than not starting.
- **Hard cap: 3 loops.** limba SES-007 stabilised on the third.

Available to any playbook. The drill playbook may run it as the whole session; the lesson
playbook uses it when part 1 collapses (below); the write playbook uses it when one error
code dominates a correction pass.

## Repair vs new material — the line the drill playbook may not cross

Two limba sessions invented this distinction independently and neither could point at a rule
(ERR-009 for a pair of look-alike verb endings; SES-007 for the present tense), so here it
is. **[../reference/topics.md](../reference/topics.md) is the arbiter, not the ledger.**

- **Repair** — anything topics.md marks `covered`. Re-explain it, re-drill it, rebuild its
  artifact, run a repair loop over it. Always allowed, in any session type.
- **New material** — anything topics.md marks `pending`, **even when its vocabulary is
  already sitting in the ledger at tier 1**. A word being in `state/vocab.md` is not the same
  as its grammar having been taught. This is the trap SES-007 fell into: six verbs were in the
  ledger, so their conjugation *felt* like completion rather than instruction — but the present
  tense sat two units out, and scoring it produced a number that was simply wrong.
- **Fixed chunks already taught are repair**, whatever their system's status — consistent with
  srs.md's bound on production.

**When a drill runs into a `pending` system that is blocking progress:** build the reference
material so the learner is not left stuck, then **stop, name it, and route the teaching to a
lesson via the Next pointer.** Do not teach it and then score it. SES-007's verb sheet was the
right artifact and became the correct Next pointer; teaching *and grading* the paradigm inside
a drill is the half that went wrong.

## Difficulty calibration

**A collapse in part 1 and a collapse in part 3 mean opposite things and must not share a
rule.** In limba they did, until 2026-08-07 — the single `< 50%` rule below was written for
the graded check and silently applied to whatever failed. SES-004 hit 30% on part 1, had no
rule to follow, and improvised.

The band's numbers are **default (measured on limba's learner — recalibrate)**.

| Where it failed | What it means | What to do |
| --- | --- | --- |
| **Part 3 — graded check** | *Today's material* was too hard. | Target is **60–70%** — the challenge sweet spot. Two consecutive sessions **> 80%** → pace up (more items, denser texts) at the next review. **< 50%** → pace down and drill the gap before new material. |
| **Part 1 — SRS review** | *Retention of already-taught material has failed.* The intake volume or the interval is wrong. | **< 50% → do not teach a full part 2 on top of it.** Cut the new intake hard or drop it entirely, spend the reclaimed time on a **repair loop** over the misses, and flag it for the review playbook — this is evidence about the ladder and the intake number, not about today's unit. |
| **Part 1, second session the same day** | *Nothing.* Those rows were answered hours ago; tier 1 is a zero-day interval, so the queue reports them due again. | **The band does not apply.** Run part 1 as declared re-exposure — no score, no tier movement, report a pattern instead of a number ([srs.md](srs.md), "Due when the row was already reviewed today"). Reading a low number here as failed retention would cut the day's new material for the opposite reason. |
| **A drill's SRS pass** | *Nothing to calibrate.* | **A drill has no target score.** The band is calibrated for ten questions on the day's new material; a drill measures retention of old material, where the same number means the opposite thing. Report the number, do not grade the session against it. limba SES-010 scored 61% and SES-009's blocks 71% and 67%, and all three came close to being read against a band that was never fitted to them. |

Teaching new material onto failed retention is how a backlog compounds: the queue grows while
the part of it that is already shaky never gets fixed.

### What the graded check must sample (limba, 2026-08-12)

limba SES-016 taught 12 new words and one grammar point. Its 10-item check spent 6 items on
the grammar and 4 on vocabulary, and **only 3 of the 12 new words appeared in it at all**.
That was not a wrong decision — the grammar was the day's target and words get their real
read-out at the spaced interval — but it was not a decision either. Nothing said anything
about the balance, so it fell out of how the items happened to be written.

- **Sample at least 3 of the day's new words**, whatever else the check covers. Fewer means the
  session has no first-exposure number for its own intake.
- **If the grammar genuinely needs all ten items**, run a separate **unscored first-exposure
  sweep** of the remaining new words before close-out. It is not a measurement, so it does not
  collide with the re-exposure rules, and it costs a minute.
- **Why this matters whenever the intake number is on trial:** in limba, 16 words taught on
  2026-08-10 returned 2 at 48 hours, which is why its intake was cut to 12. The read-out is
  the 48-hour retest, and a retest with no first-exposure baseline for nine of twelve words
  cannot say much.

### Part 1's time box against the queue

`queue.mjs` caps at **55**; part 1 is boxed at **~10′** (both defaults from limba's learner).
Those numbers agree *only* because of the review-mode split ([srs.md](srs.md)) — production
items run ~20 seconds, recognition sweeps ~3. A queue that is mostly **tier 1–2 is all
production**, so 40 due items is already ~13 minutes, over the box.

**Take the oldest items that fit the box and let the rest surface next session** — the queue is
oldest-first precisely so this is safe. **Never speed-run production items to make the count.**

#### This box is lesson-scoped. It does not bind the drill playbook. (limba, 2026-08-09)

The rule above exists because part 1 competes with four other parts for one hour. **On a drill
the queue is the entire session and nothing competes with it**, so the box was being applied
where its own reason does not hold. limba's learner found this after SES-009 left 53 items
unreviewed and asked why a drill would ever aim at anything but zero.

Two facts make the answer clearer than a preference:

- **The interval ladder cannot be tuned from a queue that never empties.** The rungs are
  defaults awaiting this learner's recall data. An item nominally on a 3-day interval that
  is actually seen every 6 days is not testing a 3-day interval. The backlog does not merely
  defer review — it corrupts the one measurement the schedule design is waiting on.
- **Zero is not reachable, and should not be the target.** Tier 1 is a *zero-day* interval, so an
  item reviewed and held at tier 1 is due again the same instant. Items leave the queue only by
  **promotion**. limba SES-010 reviewed all 30 unseen items and the counter still read 41. The
  honest target is **"nothing left unseen today"**, and a session should report it that way.

**What a drill does with a genuinely large backlog** — 100+ items, or a queue after a two-week
break — was decided in limba's 2026-08-12 housekeeping pass, on the evidence in
[srs.md](srs.md)'s cost model:

- **Count in blocks, not items.** A block — roughly ten items in one round trip — is the real
  unit of cost, because most of the cost is fixed per block: composing the set, `leakcheck`, the
  learner reading and typing, marking, publishing the sheet, the diagnosis. Per-item arithmetic
  under-predicted a 73-item drill by about **5×**.
- **Agree a block budget before the first set**, out loud, and hold the running total across the
  whole session — not per set. limba SES-014's individual sets were each reasonable and the
  session still ran past two hours.
- **Above the budget, the learner chooses**: split across days, or extend deliberately. A drill
  that silently becomes a two-hour mock has stopped being the thing that was agreed to.
- **Then clear what is unseen inside the budget** and say plainly what it could not reach. Zero
  is still not the target — tier-1 items are due again the instant they are reviewed, so the
  honest target is *nothing left unseen today*.

Rushing them destroys the only measurement part 1 produces, and a wrong tier decision costs
more than an unreviewed item.

## Grade everything the learner produces (limba, 2026-08-09)

**Every piece of learner output is graded and recorded, whether or not it is what the exercise
was measuring.** limba's learner asked for this rule after a gender-and-plural drill: they
attached a translation to all fourteen answers, and the session scored only the gender and the
plural. Thirteen correct translations went unrecorded — real evidence, volunteered, thrown away
because it was off-target.

- An exercise has a *target*, not a *scope*. The target decides what gets taught and retested;
  it does not decide what counts as data.
- This is how the **meaning-versus-form split** becomes visible at all. limba SES-009 read 9/10
  and 13/14 on meaning against 55% on written production — a diagnosis that only exists because
  both halves were counted. Grading the target alone would have reported one number and hidden
  the finding.
- It applies in both directions: an unprompted correct form is a promotion, and a slip inside
  an answer that was otherwise right is still an error. Volunteered output is not a free move.
- Cost is near zero — the learner already produced it. The only work is looking at it.

### Publish the whole marked sheet, not just the misses (limba, 2026-08-09)

**Every scored set comes back to the learner in full — one row per item, in the order it was
asked.** Requested by limba's learner after three consecutive marked sets that listed only what
went wrong. A miss-only table hides two things: how much was right (there is no sense of
proportion in "here are your four errors"), and *where inside the answer* it broke.

Each row carries five things:

| Part | Rule |
| --- | --- |
| **What was asked** | The prompt itself, restated in a few words — `mulțumesc → EN`, `"to work" → RO`, `nume: article + plural`. **Not an index number.** The learner reads the sheet cold, often after the questions have scrolled away; a row that says only "7" forces them back up the transcript to find out what 7 was. Added at the learner's request (limba, 2026-08-09), one exchange after the sheet itself. |
| **The learner's own answer** | Quoted back verbatim, with the failing segment **bolded inside it**. Seeing `ing`**`e`**`ner` is not the same as being told the answer is *inginer* — one shows the break, the other replaces it. |
| **Status** | ✅ correct · 🟡 partly correct · ❌ wrong. One glyph, scannable down the column. |
| **The correct form** | Only when the answer was not ✅. |
| **Why** | Only where it adds something. A ✅ needs no paragraph, and a wrong ending that has already been explained twice needs a pointer, not a re-explanation. |

- **Multi-part items get per-part marks**, not one verdict for the line. An item that asks two
  forms of two verbs is four answers; scoring it ❌ throws away the one that was right.
- **🟡 is not a soft ❌.** Use it where a real component landed — right stem wrong ending, right
  gender wrong plural, right meaning wrong register — because that split is the diagnosis.
- **Fold the learner's input-method look-alikes before marking.** The folding table is the
  pack's `normalize.mjs`; the principle — **an input-method artifact is never a language
  error** — is engine ([verification.md](verification.md)). They never appear as an error in
  the sheet, not even as a 🟡 (limba's case: `ǎ ş ţ` from a legacy keyboard layout). A
  *missing* diacritic still does.
- The per-item sheet is the marking; the **grouped diagnosis** ([the repair loop](#the-repair-loop--test-diagnose-repair-retest) step 3)
  still follows it. The sheet says what happened, the diagnosis says why — do not let the table
  replace the grouping.

## Posing a set — the instrument is part of the measurement (limba, 2026-08-12)

The answer-leak rules below cover one way a set can measure the wrong thing. These cover the
rest. All of them come from sets that were leak-checked clean and still produced a number about
the layout rather than the learner.

### The operation goes inside the item, never in a parallel column

limba SES-016's graded check was a table: the words to combine in one cell, the operation —
*"plural phrase, with the number two"* — in the next. **Five of ten items came back with the
left cell answered and the right cell ignored**, and two of those five were flawless singular
phrases. The target language was right; the instruction simply never executed. The reported
score was **31%**; on the five items that had no second column to miss, it was **86%**.

It is structural, not a slip: the same session's warm-up had already found the learner answering
what a table's first column asks. **A table is read as a list of operands.** Anything that is not
an operand has to be where the eye is already going.

> Write `frate + mic → the plural phrase`, in one reading unit. A parallel column may carry a
> translation or a hint — **never the thing the learner must do**.

### A multi-part ask is one line per part

limba SES-014 opened by asking *article + singular + plural* on one line and got **no plurals
at all** for ten nouns. The learner: *"plurals missed because I didn't notice it in the
instruction."* Scoring that as written would have recorded 0/10 on the plural for someone who
was never asked in a way they registered. This file already says multi-part items get per-part
**marks**; nothing said how to **ask** them.

### The split probe — ask the word, then ask the form with the word supplied

The repair for the above became the session's whole instrument, and it is now the standing move
for anything with a retrieval half and a form half:

1. **Retrieval probe** — meta→target, the base form (limba's nouns: article + singular). No
   inflected form.
2. **Form probe** — the base form is **given**; only the inflected form is asked.

Same session, same rule, same learner: the form probe read **89%** on securely-known words and
**75%** on ten carrier nouns, while retrieval on the newest intake read **17%**. Nothing else in
that session could have separated those, and they have **opposite repairs** — one needs the word
met again, the other needs the rule. A combined question returns one number that blends them,
which is how a large share of limba's top error code turned out not to be a gender problem at
all.

- **Use the form probe before demoting a ledger row** on a tier-3 miss ([srs.md](srs.md)): only
  retrieval failure is evidence against the word.
- **Say which variable is isolated, and score only that.** Already required for items that carry
  a translation to isolate one variable; it generalises to every probe.

### Declare whether the item is asked in a frame or alone

limba's *cine*, *cum* and *unde* scrambled as bare items and came back correct inside full
questions ten minutes later, with nothing taught in between (ERR-018). The two are **different
measurements**, and a set that does not say which it ran cannot be compared with one that ran
the other. A chunk test will keep reporting success while the free-standing item stays broken —
plausibly what had been happening to limba's interrogatives for weeks.

### Carrier words are declared

A set may test a rule over vocabulary the learner has never met, to isolate the rule from
retrieval. Say so, translate them, and **do not enter them in the ledger** — full rule in
[srs.md](srs.md).

### Tidy and valid pull in opposite directions, and tidy keeps winning

Not a rule, a standing bias to correct for. limba's leaked register drill was built as mirror
pairs **because mirror pairs make a clean two-column table**. The recognition block came after
the production block **because that reads well**. A gender gate was given an exit **because an
ordered four-gate procedure is elegant**, and it had to lie to have one. A "10–15′" heading sat
above a 118-item session. Every one of those was a formatting instinct beating a measurement.
When a set looks pleasing, that is the moment to ask what the shape is costing.

### Do not hand the learner the answer inside the question

**A test item never carries the translation of the word it is testing** — only of a word
genuinely new on that line. Teaching material is the opposite: it always carries the
translation, per the translation rules in [teaching.md](teaching.md).

That rule — *the translation stays while an item is tier 1–2* — was written for teaching and
silently applied to testing, where it hands over the retrieval being measured. limba's learner
caught it mid-drill (2026-08-09). When a test item needs the translation to isolate one
variable (scoring gender without also scoring recall), say that out loud, and score only the
variable you isolated.

### And not anywhere else in the set either (limba, 2026-08-09)

The rule above is **per item**. That is not enough, and the gap cost a whole session's finding
on the day it was written.

A 16-item register drill was built as **mirror pairs** — each row showed one register and asked
for the other. Every row therefore printed its partner's answer. A recognition block then asked
the learner to label forms that the first block had displayed *with their labels attached*, and
a phrase block asked for phrases already sitting in earlier prompts. **14 of the 16 answers were
on the page.** The two that were not were the only two the learner got wrong. The session
reported **88%** and concluded the zone was repaired — for a zone that had produced nothing but
errors for six days. The learner spotted it: *"almost all of the answers were obvious from the
other questions in the same exercise."*

The rule was obeyed item by item while the set as a whole leaked. So:

> **No item's answer may appear anywhere else in the same message** — not in its own prompt, not
> in another item's prompt, not in an example.

**The scope is one message, and deliberately no wider** (set by limba's learner, 2026-08-09).
Re-asking something after its key was published is **re-exposure, and re-exposure teaches** —
the learner's words: *being asked about it is what makes me remember it*. Banning it would
delete the most useful thing a repair session does. What must never happen is **reporting a
re-exposure score as if it were a measurement**; see *Re-exposure* below.

⚠️ **A target-language prompt is not a leak.** The constraint is answer-overlap, nothing else.
A whole block of recognition items — target language shown, translation wanted — is clean, and
stays available, *unless* some other item in the same message asks for one of those same words.
The rule bans a **collision**, not a language. An earlier draft over-generalised to
"meta-language prompts only", which would have removed a question type that carries real value.

**Three shapes, all of them found in limba's own history:**

| Shape | What it looks like |
| --- | --- |
| **Mirror** | Item N's prompt is item M's answer. Symmetric pairs are the usual cause — **a tidy table and a valid test pull in opposite directions**, and the tidy one wins unless something checks. |
| **Display** | A classify/recognise item over a form an earlier item printed with its label attached. `Tu **ești** student` answers "is *ești* tu or dumneavoastră?" for free. |
| **Reuse** | A production item whose answer already appeared as scaffolding, an example, or a translation elsewhere in the same message. |

### Re-exposure — allowed, never scored as new (limba, 2026-08-09)

A set whose answers were published earlier **in the same sitting** is a legitimate exercise and
an illegitimate measurement. Run it freely. Then:

- **Label the score `same-day, post-key`** wherever it is written down, and never compare it to
  a cold score.
- **Every score that enters a log, a ledger note or a claim carries `same-day` or `held`** —
  `held` reserved for a result at or beyond the item's own interval. Three separate places in
  limba reported a within-session improvement as if it were retention: SES-005's
  last-twenty-minutes repair (all four items wrong two days later), SES-007's 43→63→86 arc,
  SES-011's interrogatives at 5/5 five hours after scoring 0/3. Only the third labelled itself,
  and one of the other two became that repo's most-cited number. The repair loop's retest and
  the SRS interval measure different things, and one vocabulary for both is what let them be
  confused.
- **It cannot drive a promotion.** A tier moves on evidence at or beyond the item's own
  interval, not on a re-read minutes old.
- `node scripts/leakcheck.mjs <set>.json --prior <key>` reports these as advisory. **It does not
  fail** — that is the point of the split.

This is the exact half that broke. SES-007 was right to re-ask; it was wrong to report the
result as 43% → 63% → 86% and let a design rule be derived from it.

**The check that runs, because remembering did not.** Write the answers as a flat list *before*
presenting the set, then:

```
node scripts/leakcheck.mjs <set>.json                    # mirror / display / reuse / nested
node scripts/leakcheck.mjs <set>.json --prior <key>.md   # adds the re-exposure advisory
```

**Ask the item straight.** Name the form you want — `a avea · tu`, `a fi · dumneavoastră` — or
give the target-language frame with a gap. **Do not dress the target in a persona** ("talking
to your landlord", "asked of a child"): limba's learner asked for these dropped (2026-08-09) as
*simply distracting*, and they cost a line of reading for nothing the marking uses. A situation
is worth writing only when the *situation itself* is the thing being tested.

It folds diacritics before matching (limba's `cati` in a prompt gives away `câți`), reports one
line per item, and ends with the only number that matters: **how many items actually measure
retrieval**. Exit 1 on any HIGH finding. On the drill above it reads *"14 of 16 items give
their answer away. This set measures retrieval on 2 items."*

**What to do when a set cannot avoid a leak** — sometimes the material is small enough that any
honest item names a neighbour. Then say so in the marking, and **do not report a percentage over
the leaked items**. A score computed across contaminated items is worse than no score, because it
gets written into the ledgers, the log and the learner profile as evidence.

## Correction policy

- Always correct, briefly — never let an error pass to keep flow.
- Every correction: the fix, one-line why, the error code
  (`error_taxonomy.md`, generated at setup for this language pair), and the interference
  source when there is one — ranked per the profile's `contrast_ranking`.
- Recurring errors (3+ occurrences) get logged to
  [../logs/error_log.md](../logs/error_log.md); one-off slips are corrected but not logged.

## The close-out ritual (every session, every playbook)

1. Update the `state/` ledgers (tiers, `last`, new rows). **Edit the rows you touched, never
   rewrite the file.** limba SES-014 rewrote 81 rows in one whole-file write; had a concurrent
   session moved a tier in that window, one set of moves would have been lost with **nothing in
   CI able to see it** — tiers have no ordering contract to violate, unlike the logs.
2. Flip every aspect taught today to `covered YYYY-MM-DD` in
   [../reference/topics.md](../reference/topics.md) — the coverage map is only trustworthy
   if it is updated by the session that changed it. **And if the unit is finished**, flip its
   `status:` in [../curriculum.md](../curriculum.md) to `covered YYYY-MM-DD` in the same step.
3. **Check every causal claim before you write it down.** For each claim in the entry you are
   about to write, name the file that would falsify it — **and open it.** For a claim about
   words, `state/vocab.md`. About coverage, `topics.md`. About what a past session did, the log.
   Most claims survive and the cost is a grep.
   **Why this is a step and not advice.** limba SES-014's headline finding was that the three
   words surviving 48 hours were *"the three with a transfer anchor"*. The retro checked the
   ledger fifteen minutes later: **all sixteen rows already carried a hook**, written by the
   session that taught them. The claim had already reached the session log, a repair page, a
   scheduling proposal and the learner before one `grep` withdrew it. The workspace has
   mechanical guards for the two ways a *score* can lie — `leakcheck.mjs` and the re-exposure
   label — and had nothing for the way an *explanation* lies: a real pattern, an untested story
   about its cause, published with the same confidence as the number. **A wrong score gets
   re-measured next session; a wrong explanation gets built on.**
4. Append the `SES-NNN` entry to [../logs/session_log.md](../logs/session_log.md) —
   type, covered, SRS counts, score, **duration**, next pointer, **open questions**.
   - **Duration** is wall-clock, learner-facing time. It exists because the size rule's rates
     under-predicted a real drill by ~5× and nobody could re-fit them: the logs had no durations
     to fit to ([srs.md](srs.md), the cost model). Recording one is how that gets fixed — and
     how this learner's own constants replace limba's defaults.
   - **Open questions** is any question put to the learner that they did not answer. limba
     SES-016 asked whether a misspelling was a slip; the session closed unanswered, and the
     *observation* survived in a ledger note while the **pending decision vanished** — the next
     session would read a neutral description and never know one was owed. This is not rare:
     the learner-authority rule tells sessions to ask, and asking opens a window that can
     close. The Next pointer is for work the next session can *do*; this is something it must
     **ask**. Write the line even if it is `none`.
5. Append any `ERR-NNN` entries with **`node scripts/log-append.mjs error --file <body>.md`** —
   it takes a lock, re-reads the log inside it, and derives the ID there. Two limba sessions
   took `ERR-033` in the same seconds on 2026-08-12; CI caught that duplicate, but it cannot
   see a whole-file rewrite that drops the other writer's entry entirely.
6. **Save every scored set into `work/`** — the items, the key, and the marked sheet. The page
   the learner reads is the deliverable; this is the repo's own record of it. limba's leak
   audit had to reconstruct past sets from agent transcript files, and **one session's
   transcript was already gone** — the one mechanism that can check a historical claim had
   silently lost a session.
7. Index any visual created or updated in `work/visuals/README.md`
   ([media.md](media.md) → Delivering a visual), **with the date it reached the learner.**
   A page built outside a numbered session leaves no other trace: limba SES-009 credited a
   recovery to an unlogged side session and had to dig through `git log` to find it. The
   workspace decides what to build next from what it believes worked, so *when* a page arrived
   is part of the record, not metadata.
8. **Account for every artifact this session created.** Run `git status --short work/`
   again: each file is either indexed and committed, or deleted. Nothing survives the
   session untracked — an untracked artifact is invisible to the next session, which is how
   one got overwritten unread. `docs/visuals.index.test.ts` enforces the indexed half.
9. **Regenerate the deck and the hub.** If this session added vocabulary, run
   `node scripts/tts-warm.mjs` first — it is the only script that reaches the network for
   audio, and without it the new rows ship mute (`deck.mjs` warns when any do). Then
   `node scripts/deck.mjs` rebuilds
   [../../work/visuals/deck.html](../../work/visuals/deck.html) from the ledgers this
   session just updated — the drill surface is only honest if the session that moved a tier
   rebuilds it (limba, 2026-08-10; its frozen first-unit deck is why this is a step and not a
   choice). Then `node scripts/hub.mjs`. It rebuilds
   [../../work/visuals/index.html](../../work/visuals/index.html) from the ledgers, the
   topic map, the curriculum, the logs and the visuals index, so the learner's one bookmark
   is current. **Commit both like any other page** — with local delivery there is nothing else
   to do; an instance with a `publishing:` capability adds its own republish step
   ([media.md](media.md) → Delivering a visual).
   **These two files are generated and cannot hold an edit** — every number in them comes from a
   repo file, and both carry a `GENERATED … do not edit` banner. So a conflict in either is
   never a merge: *regenerate and overwrite*, and the newer generation wins by construction.
10. `npm test` if `docs/plan.md`, `docs/curriculum.md`, `docs/reference/topics.md`, or
    `docs/projects/` changed (the ledger and log tests run in the full suite anyway — run it
    when in doubt). **A failure in a file this session did not touch is probably another
    session mid-edit** — say so and leave it; do not fix it.
11. `git commit` — message `SES-NNN: <one-line summary>`, **naming the paths this session
    wrote**. The tree is shared; `git add -A` sweeps another session's unfinished work into
    your commit.
12. **Say it plainly.** Steps 1–11 write for a future session that greps this repo; they are
    dense, coded and full of paths **by design**. The learner reads something else: what they
    can now do that they could not this morning, what broke and what it means, what happens
    next — no error codes, no tier numbers, no file paths, no `SES-NNN`. In limba a close-out
    summary quoted "0.71× headroom" and the learner had to ask twice for plain language
    (2026-08-03). This step is the one the learner actually reads; the log entry is not a
    substitute for it, and neither is a rewording of it.

### A session that continues after its own close-out opens a new `SES-NNN` (limba, 2026-08-09)

limba SES-009 completed the ritual and committed; the learner then asked to keep going, and 30
more items were reviewed. The continuation was opened as **SES-010** — a judgement made on the
spot with nothing in the mechanics behind it. It is the right call and now it is a rule: the
log is append-only, so the closed entry cannot grow, and a second entry keeps the IDs clean,
the pacing arithmetic honest and the SRS counts attributable. Re-run the close-out for the new
ID; do not amend the old one.
