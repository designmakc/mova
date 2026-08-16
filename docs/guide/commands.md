<!-- mova:engine -->
# Every command, and when to say it

> The full list of what you can say to your agent: what each one does, what it costs you in
> time, and what it leaves behind. What happens *inside* a session is in
> [how-sessions-run.md](how-sessions-run.md); the step-by-step flows the agent follows are in
> [../../playbooks/](../../playbooks/). Where this page and a playbook disagree, the playbook
> wins.

## Chat is the only thing you operate

You say a verb; your agent follows the playbook behind it and operates everything else —
every script, every file, every check. That is a rule of the workspace, not a convenience.
Your job is to answer questions and study.

The hub and the deck are surfaces too, but you only ever read them: both are regenerated
from your own files at every close-out, and nothing on either page takes input.

**The verbs are ordinary words, matched on meaning.** "Let's study", "quick practice", "test
me" all route. If your agent supports auto-invoked commands, setup writes a one-line shim per
verb, so `/lesson` works too. The shims hold no rules — they are pointers, so nothing can
drift out of sync with the playbook.

**One session, one chat.** Start each lesson or drill in a fresh conversation. Every session
opens by reading your files and ends by writing them, so nothing you need is carried in the
chat itself — and a conversation left open across days makes your agent read past an old
transcript to find today's work.

## At a glance

| Say… | What it is | How long |
| --- | --- | --- |
| **lesson** | The full session on the current unit | ~1 hour |
| **drill** | The due queue plus your weak spots. No new material | 10–15′ |
| **review** | The weekly replan | Weekly, whenever suits you |
| **write** | A composition in your goal's genre, corrected | One genre task |
| **mock** | One section of your goal's assessment, timed | The real section's time |
| **vocab** | One word captured into the ledger | Under a minute |
| **retro** | A fix for something the workspace itself got wrong | Minutes |
| **tutor-prep** | A pack to bring your tutor, and an ingest pass after | Minutes each side |
| **update** | Template improvements, decided change by change | Minutes |

`setup` runs once, before any of these exist. Not every workspace answers to all of them —
see [focus modes](#not-every-workspace-answers-to-all-of-them) at the end.

## The three that carry an ordinary week

### `lesson` — the full session

**Say:** "lesson", "let's study", or just show up ready to work. **About an hour.**

Five parts in a fixed order: everything due, then one unit's vocabulary batch and one grammar
point, then a ten-question graded check, then practice aimed at exactly what the check missed,
then close-out. The review block stands down when the queue holds nothing it could actually
measure, and you can wave it off yourself and go straight to the teaching — the rows stay
due and roll into the next session.

The check sits **before** practice deliberately: it measures what the teaching alone landed,
which turns practice into targeted repair instead of generic use.

**You end up with:** new words and patterns in the ledger, a study page that is yours to keep,
a recorded score, and the hub and deck rebuilt.

### `drill` — the short-day session

**Say:** "drill", "quick practice", "I'm short on time", "review only". **10–15 minutes.**

Everything due, asked at the level each item's tier calls for, plus your top error patterns.
**Never new material** — that is what makes it safe to run tired. Ask for a loop on one weak
spot ("loop on this until it sticks") and it runs test → repair → retest on that spot instead
of sweeping the queue.

**You end up with:** tier movements on everything you were asked, error log entries, and the
hub and deck rebuilt.

### `review` — the weekly replan

**Say:** "review", "weekly review", "how am I doing". **Once a week.**

Reads the last seven days of logs, your live error tally, the queue and the plan, then decides
in the open: pace up or down against your deadline, what next week's drills aim at, which
milestones are closed. It is also the place for standing changes — your focus mode, the
deadline, the goal itself. And once about ten sessions carry recorded durations and scores, it
stops using the shipped scheduling defaults and re-fits the intervals to your own data,
marking each number it moved as measured rather than assumed.

**You end up with:** an updated plan, next week's drill targets, and the numbers behind every
decision said out loud.

## The rest

### `write` — composition practice

**Say:** "write", "writing practice".

A task in one of the genres your goal contract names, corrected code by code against your own
error taxonomy, with a model answer at your target level. Reusable chunks from your own
sentences are harvested into the vocabulary ledger.

**You end up with:** the piece and its corrections in `work/writing/`, error log entries, and
new ledger rows.

### `mock` — a timed assessment section

**Say:** "mock", "test me", "exam rehearsal".

One section of your goal's assessment instrument, run under real conditions and timing, scored
and frozen as a dated snapshot. Each snapshot carries what it did **not** exercise, so a good
score is never read wider than it was earned. A real past paper you drop into `materials/`
outranks anything the agent generates.

**You end up with:** a snapshot in `docs/snapshots/` to compare against later, harvested
errors, and repair work routed into the plan.

### `vocab` — capture a word

**Say:** "add this word", "what does X mean" — when you want it kept.

A capture, not a session. A word or phrase from a podcast, a sign, a tutor or a conversation
is deduped against the ledger, enriched with the facts your target language requires — gender,
plural, aspect, whatever the language pack demands — and appended at tier 1, in under a
minute.

**You end up with:** one ledger row that joins the review rotation the same day. No session
log: this is the only verb exempt from the session rituals, deliberately.

### `retro` — fix the workspace itself

**Say:** "retro", "what did we learn".

For when the *workspace* misbehaved: a rule that misfired, a correction you had to give twice,
friction that should have been free. Not for "the language was hard" — that is a ledger note.
It fixes what has an obvious home and files the rest for a housekeeping pass, so your friction
becomes the next version of the workspace instead of dying with the transcript.

**You end up with:** fixes where they belong, and an intake entry for everything else.

### `tutor-prep` — before and after a tutor session

**Say:** "prep my tutor session", "back from my tutor".

Live only if you told setup you work with a tutor. Going in, it builds a pack to bring them:
what is due, what is shaky, and the facts the workspace has marked unverified so a human can
settle them. Coming back, an ingest pass puts their corrections into the same error log as
everything else. A tutor is the only source that can confirm a language fact outright, so
those minutes are worth compounding.

**You end up with:** a file to bring, and their corrections in your own records.

### `update` — take template improvements

**Say:** "anything new?" for the read-only check, "update the workspace" for the full pass.

Your workspace is a fork of the template plus your own content, with no shared git history, so
an update is never a git merge. The agent fetches the current template, walks the changelog in
plain language, and then, for every engine file you have modified, offers the choice: keep
yours, take the new one, or combine them. Your ledgers, logs, goal, profile and pages are out
of bounds by construction. The check changes nothing until you say yes — and your weekly
`review` runs it for you, so you can also just wait for it to come up.

### `setup` — once, at the beginning

**Say:** "set up my workspace".

The onboarding interview — six short numbered topics: your languages, your goal, your time —
followed by the build: profile, curriculum, plan, language pack, and the first version of the
hub. It ends with a short tour and names the one word to say when you are ready to begin.
Everything on this page exists because setup generated it.

## Not every workspace answers to all of them

The interview asks how wide you want this. The answer sets your **focus mode**, and a verb
that is inactive in your mode is refused with a one-line pointer rather than run silently.

| Focus | Live verbs |
| --- | --- |
| `full` | lesson · drill · write · mock · review · vocab · retro · update |
| `drill` | drill · vocab · review · retro · update |
| `vocab` | vocab · drill · review · retro · update |
| `writing` | write · mock · vocab · review · retro · update |

`tutor-prep` is added to any mode when your goal contract has a tuition section. Widening a
narrow workspace into the full program — or narrowing it — is a `review` decision.

Two rituals survive every mode and ride whichever verb is live in yours:

- **Placement.** Your first session probes what you already have instead of teaching, and
  freezes the result. It rides `lesson` under `full`, `drill` under `drill` and `vocab`, and
  `write` under `writing` — setup tells you which word to say. You may decline it; the
  workspace then records in writing that your starting level is a guess, so no later session
  reads it as a measurement.
- **The goal's assessment instrument** — an exam section, a descriptor sweep, a scenario run,
  or a ledger audit, whichever your goal defines. A goal no live verb can measure has no way
  to close.

`review`, `vocab`, `retro` and `update` are live in every mode: the record is the product, and
the verbs that keep it honest are never pruned.

## What you say inside a session

Verbs start sessions; sentences steer them. "Shorter today", "this is too easy", "explain that
through Spanish", "stop drilling this" all land mid-session, and anything you say about *how
you work* is written into your profile so the next session does not re-derive it from your
behaviour.

→ [Adjusting it](adjusting-it.md) — every lever, from a sentence mid-lesson to swapping the
goal outright, plus the scripts the agent runs on your behalf.
