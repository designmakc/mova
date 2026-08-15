<!-- mova:engine -->
# Adjusting it as you go

> The workspace is meant to be argued with. This page lists every lever you have, from a
> sentence mid-lesson to swapping the goal outright. The flows behind them live in
> [../../playbooks/](../../playbooks/).

## Say it in the moment

"Shorter today." "This is too easy." "Explain that through Spanish, not English." "Stop
drilling this, I have it." "Keep going, I'm on a roll."

Sessions are built to take this. They agree a budget out loud before a long set and hand
the decision back to you when it overruns, rather than discovering at the end that a drill
became a two-hour mock. Anything you say about *how you work* — not about the language — is
written into your profile, dated, so the next session does not re-derive it from behaviour.

A question a session asks and you never answer is recorded too, as an open question, so it
does not vanish when the session closes.

## Say `review` to change the plan rather than the session

The weekly replan is the verb that changes standing decisions:

- **Pace** — up when the graded check keeps landing above the target band, down when it
  keeps landing below it, based on your logged scores rather than a feeling.
- **What next week drills** — read off your live error tally, not the all-time one.
- **The plan itself** — milestones closed, phases concluded, discovered work triaged.
- **Your focus mode** — widening drills-only into the full program, or narrowing it. The
  focus key and the plan change together, in one session.
- **The goal** — moving a deadline, revising the target, adding a tutor. Changing the goal
  contract changes what every later session considers in scope, so it is a deliberate act.
- **The schedule itself.** Once about ten sessions carry recorded durations and scores,
  `review` re-fits the intervals, the queue cap and the session cost estimates to your own
  data, and marks each number it moved as measured rather than assumed.

## Say `retro` when the workspace itself misbehaved

Not "the language was hard" — that is a ledger note. This is for a rule that misfired, a
correction you had to give twice, friction that should have been free, a place where the
workspace did not behave the way it describes itself. It fixes what has an obvious home and
files the rest for a housekeeping pass, so your friction becomes the next version of the
workspace instead of dying with the transcript.

## Files that are yours to steer

| File or directory | What you change there |
| --- | --- |
| `materials/` | Drop in your textbook, past papers, audio. Untracked, never committed — and a real past paper outranks anything the agent generates |
| `docs/reference/resources.md` | The link registry. Everything shown to you lands here, and it is checked before anything is searched for |
| `docs/reference/profile.md` | Capabilities and preferences — audio, voices, publishing, focus, your keyboard |
| `docs/visual/tokens.css` | The theme for all your study pages. Set once, never per page |
| `packs/<code>/` | Your language pack: grammar tables, the normalization table for your keyboard, dictionary adapter, voices |
| `docs/mechanics/` | The rules in force. Each carries its provenance, so you can see which are guesses and which have a number behind them |

A guess is fair to overturn on argument. A measured rule needs evidence of the same kind
that produced it.

## Say `update` to take template improvements

Your workspace is a fork of the template plus your own content, with no shared git history
— so an update is never a git merge. The agent fetches the current template, walks the
changelog in plain language, and then, for every engine file you have modified, offers you
the choice: keep yours, take the new one, or combine them. Files that are yours — ledgers,
logs, goal, profile, your pages — are out of bounds by construction.

## What the agent runs on your behalf

You never need these. They are listed so you know what the machinery is; every one is
zero-dependency Node or shell, and read-only apart from its single output.

| Command | What it does |
| --- | --- |
| `node scripts/queue.mjs [--counts]` | Today's due queue, derived from the ledgers |
| `node scripts/tally.mjs [--codes]` | The error tally — live and all-time, with causes and sibling groups |
| `node scripts/deck.mjs` | Rebuild the deck (`--due`, `--tier`, `--unit`, `--topic` narrow it) |
| `node scripts/hub.mjs` | Rebuild the hub from every file that owns a number |
| `node scripts/leakcheck.mjs <set.json>` | Refuse to ship a scored set that contains its own answers |
| `node scripts/factcheck.mjs` | Sweep the vocabulary ledger against the pack's dictionary |
| `node scripts/dictionary.mjs <word>` | One live lookup through the pack's adapter |
| `node scripts/tts-warm.mjs` · `tts-embed.mjs` | Voice new rows into the cache; embed audio into a study page |
| `scripts/speak.sh "<text>"` | Say it aloud in a neural voice (`--slow` for new sounds) |
| `scripts/pronounce.sh "<text>"` | Record you, transcribe locally, print target versus heard |
| `node scripts/log-append.mjs` · `scripts/feedback.sh` | Locked, ID-deriving appends to the shared logs |
| `node scripts/visualcheck.mjs --all` | The publish gate for a study page: renders, wires its audio, stays offline, hides its answers (runs the leak check), keeps its word lists drillable, shows how its facts were verified, and uses only your languages' scripts |
| `node scripts/packcheck.mjs <code>` | Validate a language pack against its golden fixtures |
| `npm test` | The contract suite — it fails when the workspace's own records stop being trustworthy |
