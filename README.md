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
   [Antigravity](https://antigravity.google). Never installed one, or don't want to pay for
   one? See [Starting from zero, without paying](#starting-from-zero-without-paying).
2. **Copy this repository** — the green **Use this template** button on GitHub (or download
   the zip and unpack it anywhere).
3. **Open the folder in your agent and say: "set up my workspace".**

The agent interviews you — your languages, your goal, your time — and builds everything:
your profile, your curriculum, your study plan. You never run a command yourself; the agent
operates all tooling. Then just show up and say **"lesson"**.

> **Requirements**: Node.js ≥ 20 and git. Your agent will check for both during setup and
> install what it can. They power the workspace's quality machinery — scheduling, integrity
> checks, the contract tests that keep your records honest.

## Starting from zero, without paying

**This section is for you if** you have never installed a local AI tool, you know AI as
ChatGPT or Gemini in a browser tab, and you'd rather not pay a subscription to find out
whether this workspace suits you.

**Read this part first.** The mainstream paid tools — [Claude Code](https://claude.com/claude-code)
on Claude Pro, [Codex](https://openai.com/codex) on ChatGPT Plus, or
[Antigravity](https://antigravity.google) on a Google AI plan — are easier to install, steadier
in the middle of a lesson, and better teachers. Around $20 a month, all of them. If the money
isn't the obstacle, take one of those and skip the rest of this section. The free path below
genuinely works, but you keep it running yourself.

### One app, two free engines

1. **Install [opencode Desktop](https://opencode.ai/download)** — free, open source, runs on
   macOS, Windows and Linux, and reads mova's instructions without any configuration.
2. **Pick your engines — one is already there.** Switching between them is one click in the
   model picker, and that is the whole point: when one is slow or its free window closes, you
   keep working.
   - **DeepSeek V4 Flash (Free)** is in the picker the moment you install. No account, no key,
     no card — it is built in. This is the best free model there is at running the workspace's
     scripts and recovering from its own mistakes.
   - **Gemini 3.7 Flash** is the one worth adding. Get a free key at
     [Google AI Studio](https://aistudio.google.com) — no credit card, roughly 1,500 requests
     a day — and paste it into opencode's settings. Stronger at explaining language, so prefer
     it for lessons.
3. **Go back to [First five minutes](#first-five-minutes).** When the setup interview asks
   which agent is running, answer `opencode`.

Already comfortable in VS Code? [Cline](https://cline.bot) or [Kilo Code](https://kilo.ai) take
the same free Gemini key — answer `other` at the interview.

### Two things to know before you start

- **Free means your content trains their models.** Google's free API tier and every free
  opencode Zen model may use what you send to improve the model; the paid tiers of both do not.
  This workspace holds a profile about you, your error history and your own writing. If that
  bothers you, it is a better reason to pay than any feature is.
- **Free tiers vanish without notice.** Four of them closed between April and June 2026 alone.
  Keep both engines connected so a lesson never stops because one provider changed its mind.

*Checked August 2026. If a link or an allowance has moved by the time you read this, the shape
of the advice still holds: one agent app, two free engines, switch when one runs dry.*

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
