# mova

**A language-learning workspace run by your AI coding agent.** You pick the language and
the goal; the agent teaches, drills, tracks every word and every error, and keeps a
dashboard current — all in plain files you own, on your machine.

*mova* (мова) is Ukrainian for "language".

![The hub: days to the exam, units done, topics taught, items due today, and what to do next](docs/assets/hub.png)

<sub>Every screenshot here comes from one workspace — an English speaker learning Spanish,
six weeks in, 63 days from a B1 exam. The pages are what the scripts in this repo actually
produce; the learner is invented.</sub>

## First five minutes

1. **Install an AI coding agent** — one of: [Claude Code](https://claude.com/claude-code),
   [opencode](https://opencode.ai), [Codex](https://openai.com/codex), or
   [Antigravity](https://antigravity.google). Never installed one, or would rather not pay
   for one? See [Starting from zero, without paying](docs/guide/free-setup.md).
2. **Take a copy of this repository** — the green **Use this template** button on GitHub,
   or download the zip and unpack it anywhere. Or simply give your agent the URL of this
   repo and ask it to make you a copy.
3. **Open that copy in your agent** — the folder you just unpacked or it just cloned — and
   say: **"set up my workspace"**.

The agent interviews you — six short topics, numbered so you can see the end from the
start: your languages, your goal, your time. Then it builds everything on its own: your
profile, your curriculum, your study plan. Expect a few minutes of questions and 5–15
minutes of building. It finishes with a short tour of what it made and how to use it, and
one word to say when you're ready to begin.

> **Requirements**: Node.js ≥ 20 and git. Your agent checks for both during setup and
> installs what it can. They power the scheduling, the integrity checks, and the contract
> tests that keep your records honest.

## How you use it

**Chat is the only interface.** You say a verb; your agent runs the playbook behind it and
operates everything else — every script, every file, every check. Your job is to answer
questions and study.

| Say… | You get |
| --- | --- |
| **lesson** | The full session: review, new material, a graded check, then practice aimed at what the check missed, and close-out |
| **drill** | Short practice — the due queue plus your top error patterns. Never new material |
| **write** | A composition in your goal's genre, corrected code by code, with a model answer |
| **mock** | One section of your goal's assessment, timed and frozen as a snapshot |
| **review** | The weekly replan: pace, drill targets, plan updates, schedule recalibration |
| **vocab** | A word captured into the ledger, deduped and enriched, in under a minute |
| **retro** | The workspace improved from what a session just learned about it |
| **update** | Template improvements pulled in, decided change by change |

Setup asks how wide you want this. A narrow workspace — drills only, vocabulary only,
writing only — answers to fewer verbs and refuses the rest politely. Working with a tutor
adds **tutor-prep**: a pack to bring them, and a pass that ingests their corrections.

**Three surfaces.** The chat itself. **The hub** (`work/visuals/index.html`), your one
bookmark — regenerated at the end of every session from the files that own each number:
days to your goal, what you hold, what is due, and every unit with *taught* and *retained*
drawn as two separate bars. **The deck** (`work/visuals/deck.html`), the drillable view of
everything you know, filterable by unit, tier and part of speech. Study pages are
self-contained HTML with the audio embedded — they work offline, forever.

![The deck: every known word and pattern, filtered by unit, tier and part of speech, each row with audio](docs/assets/deck.png)

![A study page: the whole system in one table with the changing endings marked, and the contrast with the language you already speak](docs/assets/study-page.png)

<sub>A study page is built for one thing, then kept. The endings that change are marked so
the pattern is visible without reading; the `?` is the verification marker — that form is
the agent's word until a source or a tutor confirms it.</sub>

→ [How sessions run](docs/guide/how-sessions-run.md) — every verb, the focus modes, the
five parts of a lesson, and where each file lands.

## What it tracks

- **A profile of you** — your languages ranked into a contrast ladder that decides which
  language an explanation is drawn from, your real time budget, your keyboard. It keeps
  what was *assumed* apart from what was *measured*.
- **Two ledgers** holding every word and grammar pattern, on a tier ladder that runs from
  same-day review out to 60 days. Due-ness is computed from the last date, never stored, so
  there is no schedule to corrupt. Each tier asks a harder question than the one below, and
  tier 3 is a gate: nothing counts as owned until you have produced it whole.
- **Coverage and retention, never blended.** What has been taught and what you actually
  hold are separate numbers, because the gap between them is the finding.

  ![One unit on the hub board: taught and retained as two separate bars, the pages that taught it, and the items still shaky](docs/assets/unit-board.png)
- **Your mistakes, coded and counted.** A taxonomy generated for your language pair, an
  append-only error log, and a tally that follows causes rather than symptoms and drops
  zones you have since re-tested clean. That tally is what the next drill aims at.
- **Honest measurement.** Every scored set is machine-checked for answers hidden in its own
  prompts; every set comes back as a full marked sheet; a repeat look at the same material
  the same day is labelled re-exposure and scores nothing; every language fact is verified,
  tutor-confirmed, or visibly marked unverified.
- **A goal contract** — an exam, a level, a list of scenarios in your own words, or a word
  count — whose spec sentence is the tie-breaker for every scope question.

→ [What it tracks](docs/guide/what-it-tracks.md) — the tier table, the tally semantics, the
measurement guards, and the four goal shapes.

## Adjusting it as you go

Most changes are one sentence in chat: shorter today, too easy, explain that through
Spanish, stop drilling this. Standing changes — pace, focus, deadline, the goal itself —
belong to the weekly `review`, which is also where the scheduler stops using its shipped
defaults and re-fits itself to your own recorded data. `retro` turns friction with the
workspace into a fix. `update` pulls template changes in as a conversation, never a merge —
ask **"anything new?"** for a read-only check that changes nothing, or let the weekly
`review` raise it for you.

Yours to steer directly: `materials/` for your own books and past papers, the link
registry, the theme, and your language pack — including the table that says which
characters your keyboard mangles, so they never count as mistakes.

→ [Adjusting it](docs/guide/adjusting-it.md) — every lever, plus the scripts the agent runs
on your behalf.

## Under the hood

Markdown and zero-dependency Node scripts in your own git repository. Nothing is in a
database, and nothing leaves your machine except dictionary lookups and text-to-speech.
[AGENTS.md](AGENTS.md) is the operational guide every agent reads; `docs/mechanics/` holds
the rules in force, each stating whether it is a guess, a response to something that
happened, or a measurement; `playbooks/` holds one flow per verb. `npm test` is the
contract suite, and it fails when the workspace's own records stop being trustworthy.
[CHANGELOG.md](CHANGELOG.md) records what changed and when.

## For maintainers

`upstream/map.md` is the porting contract from the workspace this engine was extracted
from, and `playbooks/sync-upstream.md` pulls its ongoing changes. See
[AGENTS.md](AGENTS.md) for the operational guide.
