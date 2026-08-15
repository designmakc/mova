<!-- mova:engine -->
# How sessions run

> The learner's guide to using the workspace: what you say, what happens, and where it
> lands. The rules these sessions obey are in [../mechanics/](../mechanics/) and the
> step-by-step flows in [../../playbooks/](../../playbooks/) — this page is the map, those
> are the territory. Where they disagree, they win.

## Chat is the only interface

You say a verb; your agent follows the playbook behind it and operates everything else —
every script, every file, every check. That is a rule of the workspace, not a convenience.
Your job is to answer questions and study.

Verbs are ordinary words, matched on meaning: "let's study", "quick practice", "test me"
all route. If your agent supports auto-invoked commands, setup writes a one-line shim per
verb, so `/lesson` works too. The shims hold no rules — they are pointers, so nothing can
drift out of sync with the playbook.

## The verbs

| Verb | What it does | What you end up with |
| --- | --- | --- |
| **lesson** | The full five-part session on the current unit | New words and patterns in the ledger, a study page, a score |
| **drill** | Short practice: the due queue plus your top error patterns. Never new material | Tier movements, a repair loop on one weak zone if you ask for it |
| **write** | A composition task in your goal's genre | Coded corrections, a model answer at your target level, reusable chunks captured |
| **mock** | One section of your goal's assessment, timed and proctored | A frozen, dated snapshot you can compare against later |
| **review** | The weekly replan | An updated plan, next week's drill targets, pace decisions |
| **vocab** | Ad-hoc capture of a word or phrase | One enriched, deduped ledger row, in under a minute |
| **retro** | Harvest what a session learned about the workspace itself | Fixes where they belong, plus an intake entry for the rest |
| **tutor-prep** | Prep pack before a tutor session, ingest pass after | A file to bring your tutor; their corrections in your logs |
| **update** | Pull template improvements into your workspace | A change-by-change conversation, never a git merge |

`setup` runs once, before any of these exist.

### Not every workspace answers to all of them

The interview asks how wide you want this. The answer sets `focus`, and an inactive verb is
refused with a one-line pointer rather than run silently.

| Focus | Live verbs |
| --- | --- |
| `full` | lesson · drill · write · mock · review · vocab · retro · update |
| `drill` | drill · vocab · review · retro · update |
| `vocab` | vocab · drill · review · retro · update |
| `writing` | write · mock · vocab · review · retro · update |

Two rituals survive every mode and ride whichever verb is live:

- **Placement.** Your first session probes what you already have instead of teaching, and
  freezes the result. Everything after it is built on what it finds.
- **The goal's assessment instrument** — an exam section, a descriptor sweep, a scenario
  run, or a ledger audit, whichever your goal defines.

`review`, `vocab`, `retro` and `update` are live in every mode: the record is the product,
and the verbs that keep it honest are never pruned.

## The shape of a session

Every session of every verb opens with an **orient ritual** — read your profile, get the
real date, check for unfinished work from last time, read the due queue and the previous
session's next-pointer — and closes with a **close-out ritual**: update the ledgers, flip
the coverage map, log the session, save every artifact, regenerate the deck and the hub,
run the tests, commit, and then say plainly what changed for you today, without codes or
file paths. A session that is not logged did not happen.

A full lesson between those two runs about an hour:

| # | Part | Time | What happens |
| --- | --- | --- | --- |
| 1 | Review | ~10′ | Everything due, each item asked at the level its tier calls for |
| 2 | New material | ~30′ | One unit's vocabulary batch and one grammar point, taught in eight fixed beats |
| 3 | Graded check | ~10′ | Ten questions over today's and due material, scored and recorded |
| 4 | Applied practice | ~15′ | Reading or dialogue aimed at exactly what the check just missed |
| 5 | Close-out | ~5′ | The ritual above |

The check sits **before** practice deliberately: it measures what the teaching alone
landed, and practice then becomes targeted repair instead of generic use.

A drill is parts 1 and 3 only. Time boxes flex; the order does not.

### Teaching happens in eight beats

Every new system is delivered the same way — placement first (where this sits, what it
opens), then the whole system, then what must be memorized versus what follows from it,
then the contrast with the languages you already hold, worked examples, a guided attempt,
and a compressed rule at the end. System before contrast, never the reverse: the shortcut
of "it's like X but…" only works for someone who already holds the map.

Paradigm tables and word lists go into a study page; the chat carries the contrast, the
trap, and the interaction. See [../mechanics/teaching.md](../mechanics/teaching.md).

## The three surfaces you look at

- **The chat.** Teaching, questions, the full marked sheet after every scored set, and the
  plain-language close-out.
- **The hub** — `work/visuals/index.html`, your one bookmark. Regenerated at every
  close-out from the files that own each number, never hand-written: days to your goal,
  units done, what you hold, what is due today, a board of every unit with **taught** and
  **retained** drawn as two separate bars, a confidence panel, and every study page ever
  built for you.
- **The deck** — `work/visuals/deck.html`, the drillable view of your ledgers. Filter by
  unit, tier or part of speech, sort the same ways, hide either side, reveal a row at a
  time, play the audio.

Study pages are self-contained HTML with the audio embedded. They open from disk, work
offline, and keep working forever.

## Where things land

| Directory | What lives there |
| --- | --- |
| `state/` | The two ledgers — every word and grammar pattern you hold |
| `docs/logs/` | Append-only session and error logs |
| `docs/snapshots/` | Frozen, dated assessments, each with what it did *not* exercise |
| `docs/reference/` | Your profile, goal contract, coverage map, transfer notes, link registry |
| `docs/curriculum.md`, `docs/plan.md` | What is being taught, and in what order and pace |
| `work/` | What sessions produce: study pages, scored sets, your writing, tutor packs |
| `materials/` | Your own books, papers and audio — untracked, never committed |

Nothing is in a database. Nothing leaves your machine except dictionary lookups and
text-to-speech, both of which your agent tells you about.
