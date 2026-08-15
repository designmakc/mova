<!-- mova:engine -->
# What the workspace tracks

> Your guide to the records this workspace keeps about you, and why each one is shaped the
> way it is. The canonical rules live in [../mechanics/](../mechanics/) —
> [srs.md](../mechanics/srs.md) for the schedule, [session_format.md](../mechanics/session_format.md)
> for how a session measures, [verification.md](../mechanics/verification.md) for how a
> language fact earns its place. Where a number here and a number there disagree, that one
> wins.

## Your profile

`docs/reference/profile.md`, written from the setup interview and read at the start of
every single session. It holds three different kinds of thing.

**A config block** — the one machine-readable surface in the workspace. Your target and
explanation languages, goal kind and label, the deadline (or no line at all when there is
none), how many units, your focus mode, and what this machine can actually do: audio,
text-to-speech, dictionary, publishing, and whether the contract tests can run.

**The contrast ladder** — every language you hold, ranked, each rung saying *why* it sits
there and what kind of anchor it is. Explanations are drawn from the top of the ladder:
structure from your strongest structural anchor, vocabulary from your strongest lexical
one, which are often different languages. One anchor per point — a second is noise and a
third is a lecture. A language you only half-hold can help you *recognize* things but never
supplies a model for what you *produce*: you cannot trust your own output in a language you
half-hold.

**How you work** — your real time budget, your keyboard, anything settled once so that no
session has to re-derive it from your behaviour. Derivation from behaviour cannot tell
"can't" from "chose not to", and the cost is real: a keyboard preference read as a language
mistake will quietly shape what you get drilled on.

The profile keeps **assumed** and **measured** apart. The measured section starts empty and
only ever accretes evidence — each bullet dated, with the session that produced it. That
separation is what stops a setup-day guess from hardening into a fact about you.

## Progression — the ledgers and the tier ladder

Two markdown tables are the workspace's memory: `state/vocab.md` and `state/grammar.md`.
One row per word or pattern, carrying its meaning, its tier, when it was last seen, the
topic it is scored under, and its memory hooks.

**Due-ness is computed, never stored.** There is no schedule file, so there is nothing to
corrupt: an item is due when today minus its last date reaches its tier's interval.

| Tier | Meaning | Comes back after | And is asked… |
| --- | --- | --- | --- |
| 0 | Seeded, not taught yet | never, until its unit delivers it | not at all |
| 1 | New / shaky | same day | recognition only — what does this word mean |
| 2 | Building | 3 days | produce the bare word from your language |
| 3 | Solid | 7 days | **the full package** — the word plus every fact its row carries |
| 4 | Owned | 21 days | recognition sweep |
| 5 | Cold storage | 60 days | recognition sweep |

Clean recall moves an item up a rung; a miss or a hesitation moves it down. Each rung asks
a harder question than the one below it, which is the opposite of the obvious design —
demanding full production of your shakiest items measures almost nothing and teaches less.

Four rules keep the ladder honest:

- **Tier 3 is a gate, not a sweep.** Nothing becomes "owned" without being produced whole
  at least once. This is what stops a comfortable recognition-first ladder from quietly
  skipping the half your goal actually grades.
- **A row moves at most once per calendar day.** The first session of the day owns the
  measurement. A second session runs its review as declared *re-exposure* — no score, no
  tier movement, a pattern reported instead of a number — because looking again two hours
  later measures nothing.
- **The queue is capped**, oldest first, so a backlog after a break is eaten over several
  sessions instead of one crushing review. A session takes the items that fit its box and
  lets the rest surface next time rather than speed-running them.
- **Nothing is retired.** Tier 5 keeps cycling until your goal is met.

The intervals, the cap and the time estimates are **defaults measured on one learner, not
on you**. They are marked as such, and the `review` verb re-fits them to your own recorded
data once about ten sessions carry it.

### Taught and retained are never the same number

`docs/reference/topics.md` records what has been *delivered*. The tier spread of the items
filed under a topic records what is *held*. The workspace never averages the two, because
the gap between them is the finding — a unit can be finished and still be shaky, which a
single "covered" label could never show. The hub draws them as two bars for that reason.

Production is also bounded by coverage, not by the ledger: a word can sit in your ledger
long before the grammar that inflects it is taught, and until that system is delivered only
its dictionary form and any taught chunk are scoreable. Scoring untaught morphology
produces a number that is simply wrong.

## Mistakes

Every error is corrected on the spot — the fix, a one-line why, a **taxonomy code**, and
the name of the language that pushed the wrong form through, when one did. Nothing is let
past to keep the conversation flowing.

The taxonomy is generated at setup **for your specific language pair**, seeded with the
zones your own languages cannot see, and it grows a code in the session that first needs
one. A pattern worth recording — three-plus sightings, or a zone your goal grades — becomes
an entry in the append-only error log. One-off slips are corrected and let go.

What makes that log more than a diary is the **tally** that the drill and review verbs read:

- **It counts occurrences, not entries.** Diagnosing nine sightings cleanly in one entry
  used to score lower than logging them as nine sloppy ones. Now it does not.
- **It follows cause links.** An entry can declare itself a manifestation of another, and
  its count moves to the real cause — so a spelling code stops out-ranking the sound that
  produces it, and drilling goes at the cause.
- **It counts what is still live.** Re-test a zone on a clean, leak-checked set and the
  score is banked: everything logged before that measurement stops counting as live.
  Nothing is deleted — the all-time tally keeps it all, and the discount is printed with
  the score behind it — but the drill list stops sending you at a weakness you already
  fixed.
- **It shows sibling groups.** Two codes that are one mechanism in two systems rank low
  apart and high together.

Two things are deliberately **not** errors. Characters your input method mangles into
look-alikes are folded before marking and never coded — they route to your language pack's
normalization table instead. And a form from a system the curriculum has not delivered yet
is a gap in the material, not a mistake of yours.

## Measurement you can trust

A workspace that scores you is only worth having if the scores are real.

- **Answer-leak detection.** Every scored set is checked mechanically, before you see it,
  for answers printed inside other items' prompts. A tidy table and a valid test pull in
  opposite directions, and tidy keeps winning — so this is a script, not a good intention.
- **The whole marked sheet, every time.** One row per item in the order asked, your own
  answer quoted back with the failing part marked inside it, ✅ / 🟡 / ❌, the correct form,
  and a why only where it adds something. Not a list of your four mistakes: you cannot see
  proportion in that, or where inside the answer it broke.
- **Everything you produce is graded**, not only what the exercise was targeting. Volunteer
  a translation alongside the form you were asked for and it counts, both ways.
- **Different failures get different rules.** A collapse in the graded check means today's
  material was too hard. A collapse in review means retention has failed — and then the
  session cuts new intake and repairs instead of teaching on top of it.
- **Snapshots carry a "Not exercised:" list**, so a frozen score never implies more
  coverage than it had.
- **Causal claims get checked before they are written down.** For each claim, the session
  names the file that would falsify it and opens it. A wrong score gets re-measured next
  week; a wrong explanation gets built on.
- **Every language fact is verified, tutor-confirmed, or visibly marked unverified.** Where
  a dictionary adapter exists for your language, facts are checked at capture and swept in
  batches. Where none does, the workspace says so instead of pretending, and a tutor can
  clear the marked list in minutes.
- **Every rule states its provenance** — assumed, derived from a specific session, or
  measured with a date. You can see at a glance which rules are somebody's guess and which
  have a number behind them.

## The goal contract

`docs/reference/goal.md` names what "done" means for you, and one marked **spec sentence**
in it is the tie-breaker for every scope question the workspace will ever face. Work that
serves no part of it is scope creep, however enriching.

It takes one of four shapes:

| Kind | What it names |
| --- | --- |
| **exam** | The sections, the task types, the pass bar, the date |
| **level** | A can-do list at a target level on a stated scale |
| **functional** | Five to ten scenarios in your own words — "read my in-laws' messages" |
| **ledger** | A volume target, and what it is for |

With a date, `review` does deadline arithmetic against it and tells you the margin plainly.
Without one, it measures volume and streak instead, and never invents a date to make the
arithmetic possible.
