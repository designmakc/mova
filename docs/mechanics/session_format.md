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
> diagnosis step is derived from SES-007 and SES-009**; its score arc is **retracted**
> ([why/session_format.md](why/session_format.md)). The **calibration split** and the **part-1 box rule** are
> derived from SES-004. Question the boxes freely; the derived rules need evidence of the
> same kind that produced them.
>
> ⚠️ **Any score quoted in this file predating 2026-08-09 may be inflated by answer leakage**
> — limba's leak audit (2026-08-09) found sets where most answers were printed in other
> items' prompts. The rules that audit produced live below; the audit itself is limba
> history.

> **Rules live here; the story lives in [why/session_format.md](why/session_format.md).** This file is what a
> session reads before it teaches. The incidents, audits and measurements that bought
> each rule moved to `why/` — a retro reads both, a lesson reads only this one. New
> provenance goes to `why/`, never back into this file.

## The five parts (full lesson, 60–75 min)

| # | Part | Time | What happens |
| --- | --- | --- | --- |
| 1 | SRS review | ~10′ | `node scripts/queue.mjs` → quiz due items **at the mode their tier calls for** (recognition at tier 1, bare production at 2, the full package as the tier-3 gate, sweep at 4–5 — [srs.md](srs.md)); grammar items via one production sentence each → update `tier`/`last`. **Conditional — see § Part 1 runs only when it can produce something** |
| 2 | New material | ~30′ | Current unit ([../curriculum.md](../curriculum.md)): **10–20 new vocab items** with the pack's per-item facts + transfer hooks; 1 grammar point — built per [teaching.md](teaching.md), all eight beats, **split chat/visual per its table** (paradigms and word lists live in the visual, chat carries the contrast) |
| 3 | Graded check | ~10′ | 10 questions over today's + due material, **sampling at least 3 of the day's new words** (see below); score recorded in the session log |
| 4 | Applied practice | ~15′ | Short reading or guided dialogue that forces due + new items into use, **aimed at what part 3 just missed**; goal-adjacent formats preferred |
| 5 | Close-out | ~5′ | The ritual below |

The drill variant (10–15′) is parts 1 + 3 only, with error-pattern items mixed in
(→ [playbooks/drill.md](../../playbooks/drill.md)). Time boxes flex; the order doesn't.

## The orient ritual (every session, every playbook)

1. **Read [../reference/profile.md](../reference/profile.md).** Who is on the other side —
   the language ranking a contrast must come from (`contrast_ranking`), the input method that
   is never an error (the pack's `normalize.mjs` — [verification.md](verification.md)), and
   what has already been settled. Skipping it is how a keyboard preference spent five days in
   limba's error tally shaping what got drilled.
2. **Run `date`.** Never take today's date from context — it may be stale, and every date
   here is load-bearing (SRS due-ness, pacing, snapshot order). One wrong date propagated
   across five files (limba, 2026-07-31).
3. **Run `node scripts/closeout.mjs --start`** — it answers this step (the `work/` audit,
   computed) and the next one, and it records which files were **already dirty before this
   session touched anything**. That snapshot is what lets the close-out name paths instead of
   running `git add -A` and sweeping a sibling's work into your commit. Orient is the only
   moment the snapshot is true; taken later it disowns the session's own work as someone
   else's. Without the script: **run `git status --short work/`, then read the index in
   `work/visuals/README.md`.** An
   artifact you did not create is one of **two** things, and they need opposite responses.
   **Prepared material** — a page with an index row, no Date and `Built —` opening its
   Teaches cell — is finished teaching material waiting for a session to teach it: open it,
   teach from it, date its delivery at close-out, and do **not** rebuild the unit it names.
   **Residue** — untracked and in no index — is what a session that reached neither exit left
   behind. **A row whose file is untracked is the third case**: pages are indexed and put on
   the hub the moment they pass the gate (rule 3 in [media.md](media.md)), so the session
   that built this one may still be running. Read it, reuse it, never overwrite it — and if
   its unit is the one you are about to teach, say so to the learner before you build a
   second page. **Read any such file before writing near it** either way — in limba an unindexed
   draft visual was overwritten unread (2026-08-03). Reading prepared material as residue
   costs the opposite mistake: the next session rebuilds a page that already exists (found in
   the first generated lesson pages, 2026-08-15).
4. **Run `node scripts/queue.mjs --counts`** and read the last `SES-NNN` entry's **Next**
   pointer in [../logs/session_log.md](../logs/session_log.md). **Identify "last" by heading,
   and cross-check it against git** — entries run 70+ lines, so a `head -n` of the file can
   show the *second* entry and read as the first:

   ```
   grep -n "^## " docs/logs/session_log.md | head -1   # the newest entry, by structure
   git log --oneline -1                                # its SES-NNN, independently
   ```

## Placement — every session, every section

The learner runs many sessions and returns cold. **State position before content:**

- **Session opener** — which unit of the curriculum, which phase, what it opens or closes,
  and what the learner will and will not be able to do afterwards.
- **Every teaching section** — the Placement beat from [teaching.md](teaching.md) ①,
  derived from [../reference/topics.md](../reference/topics.md), never improvised.

## The placement calibration — the first session probes instead of teaching

Not the placement *announcement* above. This is the one-time probe that replaces the
interview's guesses with measured data, and it rides **whichever verb carries placement in
this instance's focus mode** — lesson under `full`, drill under `drill`/`vocab`, write under
`writing` (`setup/scenarios/focus_modes.md` § Placement and assessment run in every mode).
The carrier verb runs it under its own rules: a drill carrying a placement still teaches
nothing.

**The condition is one command, and it names the snapshot the placement itself produces:**

```
ls docs/snapshots/*_placement.md    # nothing listed ⇒ the placement is still owed
```

**Gate on the placement snapshot, never on "no snapshot exists."** Setup always writes
`docs/snapshots/<date>_intake.md` — kind **Intake**, a different row of the kind table in
[../snapshots/README.md](../snapshots/README.md) — so a guard worded that way is false at the
exact moment it has to be true and can never fire (found in the first generated lesson pages,
2026-08-15). `docs/plan.md`'s Phase 0 placement milestone is the **cross-check, not the
gate**: the snapshot is evidence, the checkbox is a claim. When they disagree, say so and
believe the file.

**Offer it, price it in one sentence, and take the answer.** The learner may decline — wanting
a page today rather than a probe is a real choice, and one generated instance handled this
well before any rule existed (found in the first generated lesson pages, 2026-08-15). Say the
cost plainly first — *without a measured starting level I pick the unit by guess, and we may
have to move you later* — then:

- **Probed** — probe across the curriculum's early units instead of working through material
  (limba's placement probed the first half), write `docs/snapshots/YYYY-MM-DD_placement.md`
  with `## Method` and its "Not exercised:" list, then tick the plan's placement milestone and
  update its pacing at close-out.
- **Declined** — write the same snapshot anyway, and make the guess legible in it:
  `Level: GUESSED — the learner declined the probe` in `## Method`, with
  `Not exercised: everything`. **Leave the plan's placement milestone open** — its routing
  annotation stays, and its line says the starting point is guessed and the first real
  measurement corrects it. A guessed starting level is honest and workable; an *unrecorded*
  one lets every later session read a guess as data. Do not amend the intake snapshot to carry
  this: snapshots are frozen once written (snapshots README), and the placement snapshot is
  the file this gate reads anyway.

The decision is recorded either way, so the next session does not re-open it. **The debt lives
in the milestone**, and the first genuine measurement — the goal's assessment instrument, or a
placement offered again — is what closes it.

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

**The loop's product is the diagnosis, not the retest number.** Grouping the misses by cause
found a missing paradigm table, and separately a learner storing corrections instead of
running the rule — neither reachable from a score. And **nothing in this machinery's history
has ever shown a same-sitting gain surviving to the next session**, so **retest on genuinely
new items or report no number** ([why/session_format.md](why/session_format.md)).

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

## Part 1 runs only when it can produce something

Part 1's two products are a **retention number** and a **tier move**. When the queue can
yield neither, the block is ten minutes of pure cost — and [srs.md](srs.md) already concedes
it can: a row moves tier at most once per calendar day, and a same-day look carries no score
and no retention claim. **The gate is the queue, not the session number**, and orient already
runs it:

```
node scripts/queue.mjs --counts
```

| What it reports | Part 1 |
| --- | --- |
| **Nothing due** | **Does not run.** Say so in a line, go to part 2. A first lesson lands here only when the ledgers are empty or the placement seeded them today. |
| **Every due row also reviewed today** | **Does not run as a block.** No tier can move, no score is valid. Offer a short unscored sweep — re-exposure teaches — but the learner accepts it; it is not the default. |
| **Some rows dated today, some not** | **Runs on the rest.** The queue sorts oldest `last` first, so today's rows are its tail: part 1 stops where the tail starts. |

**The learner may also decline it** — *no drill today, just teach me*. Take the answer and
price it in one sentence with the number: *N rows stay due and roll into the next session.*
Same shape as declining the placement probe.

**The reclaimed time does not become more new material.** The intake volume is a calibrated
constant; inflating it here corrupts the measurement the ladder is waiting on. Give it to
part 4, or end early and say so.

**A skipped part 1 and a collapsed one must not look alike in the log**: the entry's SRS
field takes `skipped — <reason>` in place of counts, because the review playbook re-fits the
ladder from these entries. **Three declines in a row is evidence about the schedule, not
about the learner** — route it to review through the Next pointer.

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
| **Part 1, second session the same day** | *Nothing.* Those rows were answered hours ago; tier 1 is a zero-day interval, so the queue reports them due again. | **The band does not apply, and the block itself usually does not run** — § Part 1 runs only when it can produce something. Reading a low number here as failed retention would cut the day's new material for the opposite reason. |
| **A drill's SRS pass** | *Nothing to calibrate.* | **A drill has no target score.** The band is calibrated for ten questions on the day's new material; a drill measures retention of old material, where the same number means the opposite thing. Report the number, do not grade the session against it. limba SES-010 scored 61% and SES-009's blocks 71% and 67%, and all three came close to being read against a band that was never fitted to them. |

Teaching new material onto failed retention is how a backlog compounds: the queue grows while
the part of it that is already shaky never gets fixed.

### What the graded check must sample (limba, 2026-08-12)

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

> Write `frate + mic → the plural phrase`, in one reading unit. A parallel column may carry a
> translation or a hint — **never the thing the learner must do**.

### A multi-part ask is one line per part

### The split probe — ask the word, then ask the form with the word supplied

The repair for the above became the session's whole instrument, and it is now the standing move
for anything with a retrieval half and a form half:

1. **Retrieval probe** — meta→target, the base form (limba's nouns: article + singular). No
   inflected form.
2. **Form probe** — the base form is **given**; only the inflected form is asked.

- **Use the form probe before demoting a ledger row** on a tier-3 miss ([srs.md](srs.md)): only
  retrieval failure is evidence against the word.
- **Say which variable is isolated, and score only that.** Already required for items that carry
  a translation to isolate one variable; it generalises to every probe.

### Declare whether the item is asked in a frame or alone

### Carrier words are declared

A set may test a rule over vocabulary the learner has never met, to isolate the rule from
retrieval. Say so, translate them, and **do not enter them in the ledger** — full rule in
[srs.md](srs.md).

### Tidy and valid pull in opposite directions, and tidy keeps winning

### Do not hand the learner the answer inside the question

**A test item never carries the translation of the word it is testing** — only of a word
genuinely new on that line. Teaching material is the opposite: it always carries the
translation, per the translation rules in [teaching.md](teaching.md).

### And not anywhere else in the set either (limba, 2026-08-09)

The rule above is **per item**. That is not enough, and the gap cost a whole session's finding
on the day it was written.

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

**Run `node scripts/closeout.mjs --brief` before you write anything, and `--finish` when the
writing is done.** The brief prints every template this ritual needs — the session-entry
fields, the error body, the visuals index row, the `work/` audit computed rather than
eyeballed, the queue and the live tally, the ledger rows you touched. `--finish` regenerates
the deck and hub, runs the publish gate on the pages you changed, runs `npm test`, and prints
a **path-named** `git add` line.

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
7. **Confirm the index rows and date the deliveries.** Every visual this session created or
   updated was indexed and put on the hub **when it was built**, before it was taught
   ([media.md](media.md) → Delivering a visual, rule 3) — so this step is the audit, not the
   first write. Two things to do here: add any row that is missing, and **fill in the Date of
   every page this session actually delivered** — a page taught today whose row still opens
   `Built —` gets today's date and loses the marker. A page built and still not taught keeps
   `—`. **A page you built and then deleted loses its row in the same breath**: the index test
   fails on a row pointing at a file that is not there.
   The date matters because a page built outside a numbered session leaves no other trace:
   limba SES-009 credited a recovery to an unlogged side session and had to dig through
   `git log` to find it. The workspace decides what to build next from what it believes
   worked, so *when* a page arrived is part of the record, not metadata.
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
   choice). Then `node scripts/hub.mjs` **again** — a page built this session already put
   itself on the hub (step 7), but every *number* on it moved afterwards. It rebuilds
   [../../work/visuals/index.html](../../work/visuals/index.html) from the ledgers, the
   topic map, the curriculum, the logs and the visuals index, so the learner's one bookmark
   is current. **Commit both like any other page** — with local delivery there is nothing else
   to do; an instance with a `publishing:` capability adds its own republish step
   ([media.md](media.md) → Delivering a visual).
   **These two files are generated and cannot hold an edit** — every number in them comes from a
   repo file, and both carry a `GENERATED … do not edit` banner. So a conflict in either is
   never a merge: *regenerate and overwrite*, and the newer generation wins by construction.
   **Then hand the hub over as a clickable `file://` link in the close-out message**
   ([media.md](media.md) → Delivering a visual). A bookmark the learner has to assemble out
   of a repo path is not a bookmark, and this is the one step of the ritual whose entire
   product is a page they are meant to open.
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

### The materials-prepared exit — built, not taught (2026-08-15)

**A session that produced teaching material and taught none of it takes this exit, not the
close-out.** The workspace modelled two states — *in flight* and *closed out* — and this is a
legitimate third. Both first generated lesson pages ended in it and had nowhere to land: the
page stayed untracked, so `docs/visuals.index.test.ts` read it as work in flight and ignored
it by design; the hub was never rebuilt, so the learner's one bookmark could not reach the
page; the unit stayed `pending`, so the next session would build it again; and the index row
could only be written by dating a delivery that never happened (found in the first generated
lesson pages, 2026-08-15).

Take it when the material is built and **nothing was taught or measured** — a request for a
page rather than a session, the time gone, the learner never arrived. Four steps:

1. **Check the row is there and says built** — **no Date** (`—`) and `Built —` opening its
   Teaches cell ([media.md](media.md) → Delivering a visual). Building the page already wrote
   this row (rule 3); write it here if something went wrong. That column means the day the
   page reached the learner; the day it was built is already in the filename.
2. **Commit the page, its row and the hub.** An untracked artifact is invisible to the next
   session, and the index test is deliberately blind to it.
3. **Regenerate the hub** — `node scripts/hub.mjs` — if anything changed since the page was
   built. An unlinked page is not reachable, whatever else is true of it. Give the learner
   the page's own clickable `file://` link in the response as well ([media.md](media.md) →
   Delivering a visual): material prepared and not taught is exactly the case where the only
   route to the page is the sentence you are writing now.
4. **Say where you stopped**, in the index row and in the response: which unit the material is
   for, what is built, what is not. **That row is this exit's Next pointer** — the next session
   checks the index before generating (media.md's reuse rule), and it is the only line
   guaranteed to be read.

**And nothing else. No ledger rows, no tier moves, no `covered` flip in topics.md or the
curriculum, no `SES-NNN` entry, no score, no deck rebuild.** Nothing was taught and nothing was
measured, so every one of those would be a claim about a session that did not happen — the
same lie as the delivery date. The session that later teaches the page runs the full close-out
and dates the delivery there.

### A session that continues after its own close-out opens a new `SES-NNN` (limba, 2026-08-09)
