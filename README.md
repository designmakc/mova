# mova

**A language-learning workspace run by your AI coding agent.** You pick the language and the
goal; the agent teaches, drills, tracks every word and error, and builds you a personal
dashboard — all in plain files you own, on your machine.

*mova* (мова) is Ukrainian for "language". This template is the generalized descendant of
**limba**, a Romanian exam workspace that grew these mechanics
over months of real daily use: a spaced-repetition system with nothing to drift, teaching
rules calibrated by measured recall, answer-leak detection, and a test suite that fails when
the workspace's own records stop being trustworthy.

## First five minutes

1. **Install an AI coding agent** — one of: [Claude Code](https://claude.com/claude-code),
   [opencode](https://opencode.ai), [Codex](https://openai.com/codex), or
   [Antigravity](https://antigravity.google).
2. **Copy this repository** — the green **Use this template** button on GitHub (or download
   the zip and unpack it anywhere).
3. **Open the folder in your agent and say: "set up my workspace".**

The agent interviews you — your languages, your goal, your time — and builds everything:
your profile, your curriculum, your study plan. You never run a command yourself; the agent
operates all tooling. Then just show up and say **"lesson"**.

> **Requirements**: Node.js ≥ 20 and git. Your agent will check for both during setup and
> install what it can. They power the workspace's quality machinery — scheduling, integrity
> checks, the contract tests that keep your records honest.

## What you get

- **Lessons that remember.** Every word and grammar pattern goes into a ledger; a
  spaced-repetition queue decides what to review, derived fresh every day — no stored
  schedule to corrupt.
- **Honest measurement.** Answer-leak detection, re-exposure labelling, and append-only
  logs — the workspace guards against the ways a score can lie.
- **A visual per lesson.** Self-contained HTML pages (audio embedded, works offline forever)
  in a consistent design system — plus a dashboard showing taught vs. retained, never blended.
- **Your scenario, not ours.** Exam with a date, a target level, or just "I want to talk to
  my in-laws" — the interview builds a goal contract that keeps every session on-scope.
  Working with a tutor? The workspace preps your tutor sessions and ingests their corrections.
- **Any agent.** The whole workspace is markdown + zero-dependency scripts. Instructions live
  in `AGENTS.md`; per-agent command shims are generated at setup.

## Status

Under construction — the engine is being extracted from limba. See [CHANGELOG.md](CHANGELOG.md).

## For maintainers

`upstream/map.md` maps every limba file to its mova destination; `playbooks/sync-upstream.md`
ports limba's ongoing changes via its porting log. See [AGENTS.md](AGENTS.md) for the
operational guide.
