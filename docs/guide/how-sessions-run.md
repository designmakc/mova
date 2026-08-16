<!-- mova:engine -->
# How sessions run

> The learner's guide to what a session actually does with your hour, and where its output
> lands. The rules these sessions obey are in [../mechanics/](../mechanics/) and the
> step-by-step flows in [../../playbooks/](../../playbooks/) — this page is the map, those
> are the territory. Where they disagree, they win.

## What starts a session

Chat is the only thing you operate: you say a verb, and your agent follows the playbook
behind it and operates everything else — every script, every file, every check. The hub and
the deck are read-only views of the same files. Your job is to answer questions and study.

→ [Every command](commands.md) — the nine verbs, the plain words that reach each one, what
each leaves behind, and which of them your focus mode keeps live. This page is what happens
*after* you say one.

## The shape of a session

Every session of every verb opens with an **orient ritual** — read your profile, get the
real date, check for unfinished work from last time, read the due queue and the previous
session's next-pointer — and closes with a **close-out ritual**: update the ledgers, flip
the coverage map, log the session, save every artifact, regenerate the deck and the hub,
run the tests, commit, and then say plainly what changed for you today, without codes or
file paths. A session that is not logged did not happen.

Your very first session is the one exception to what sits between them: it probes instead
of teaching — the placement calibration — and everything after it is built on what it
found.

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
- **The hub** — `work/visuals/index.html`, your one bookmark. Your agent hands it to you as
  a clickable `file://` link every time it rebuilds it, so you never go looking for the
  path. Regenerated from the files that own each number, never hand-written: days to your
  goal, units done, what you hold, what is due today, a **what to do next** block that
  prices a drill against a lesson, a board of every unit with **taught** and **retained**
  drawn as two separate bars, a confidence panel, and every study page ever built for you.
  A new page lands on it **as soon as it is built**, marked *not taught yet* until a
  session teaches it; the numbers are refreshed again at every close-out.
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
