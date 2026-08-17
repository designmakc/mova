<!-- mova:engine -->
---
verb: feedback
summary: Send a workspace defect back to the template — the agent writes the report, the learner approves every word, and nothing leaves the machine without a yes.
triggers: report a bug, send feedback, this is wrong, the workspace got this wrong, tell the maintainer, report this upstream
requires: git; a network exit only at the moment the human approves one
scenarios: all
---

# feedback — the report that leaves this machine

Purpose: carry an **engine-shaped** finding back to the template it came from. Every other
channel in this workspace points inward — [retro.md](retro.md) files findings into this
instance, [update.md](update.md) pulls the template's changes in — and until this verb
existed a defect found here died here. AGENTS.md has always said *report what you find*
and named no mechanism.

**The valuable reporter is usually you, not the learner.** A learner cannot report that a
compressed rule was backwards, or that a drill's size rule under-predicted by 5×; they do
not know those were wrong. The session that wrote them does. So this verb is yours to
*offer*, not only theirs to ask for — offer it once, plainly, when a finding is
engine-shaped, and drop it if the answer is no.

**Reads**: docs/reference/profile.md (config only — `template_version`, `template_source`,
`agent`, `mode`, `focus`, `pack`, capability flags), `work/feedback/insights.md` (findings
already filed locally), `work/feedback/outbound/` (what has already been sent),
[../docs/mechanics/narration.md](../docs/mechanics/narration.md).

**Writes**: `work/feedback/outbound/YYYY-MM-DD_<slug>.md` — the exact payload, kept so the
same defect is not reported twice and so the learner keeps a copy of what they sent. One
commit. **Nothing else in the instance changes**, and a declined report still leaves the
file.

## Is this feedback, or is it a retro?

Wrong channel is the common failure, and the two are not interchangeable — a retro changes
*this* workspace, a feedback changes *every future* workspace.

| The finding | Channel |
| --- | --- |
| A fact about this learner, their errors, their transfer hooks, their pace | [retro.md](retro.md) — it has a home here |
| A rule in `docs/mechanics/` that misfired, an engine script that failed, a playbook step that could not be followed | **here**, and a retro note locally if this instance needs a workaround now |
| A generated file that came out wrong at setup — a bad compressed rule, a false-friend table that is thin, a pack fact that is wrong | **here**. Setup is the same code for everyone; a mis-generation is a template defect wearing an instance's clothes |
| A missing feature, a verb that should exist | **here**, marked as a wish rather than a defect |
| "The workspace and I disagree about how I should study" | retro first. If the disagreement is with a *rule* rather than with this instance's settings, then here |

A finding can be both. File the local half first, then run this — and say in the report that
the instance has already worked around it, because that changes how urgent it is.

## The payload — what may leave, and what may never

**This is the rule the verb exists to keep.** The product's promise is that nothing leaves
the machine except dictionary lookups and speech; a feedback verb that quietly ships a study
record breaks the one thing that makes the workspace trustworthy. The report is about the
**engine**, so it needs nothing personal to be useful.

**May go — all of it structural:**

- `template_version`, the agent kind, the OS, node's major version, `mode`, `focus`
- `goal_kind` (the **kind**: `exam` | `level` | `functional` | `ledger` — never the goal)
- the pack code and the contrast-ranking **codes** (`uk > ru > en`), which are what make a
  language-pair defect reproducible
- capability flags: audio, tts, dictionary reachable, publishing
- what happened, what you expected, the engine file and section, and how to reproduce it
- a **minimal synthetic example** where one is needed — invent the word, never lift the
  learner's

**May never go, whatever it would add:**

- the goal contract's text, the scenario list, or anything in the learner's own words
- **the open-floor answers from setup** — the most personal thing the interview collects
- ledger rows, error-log entries, session-log entries, snapshots, their writing, their
  tutor's corrections
- names, places, employers, family, anything from `materials/`
- file paths that carry a person's name — abbreviate the home directory

**When a defect cannot be shown without personal content, say so in the report and describe
the shape instead.** A reproduction the maintainer cannot run is still worth more than a
learner's paragraph they never meant to publish.

## Flow

1. **Establish it is engine-shaped** (the table above). If it is not, run [retro.md](retro.md)
   instead and say why.
2. **Check it is not already known.** Read `work/feedback/outbound/` — the same defect
   reported twice from one instance is noise. If the template has moved since this instance
   was generated, run [update.md](update.md)'s check first: a defect already fixed upstream
   is an update, not a report.
3. **Draft the report** to `work/feedback/outbound/YYYY-MM-DD_<slug>.md`, using the
   headings the template's issue form asks for: what happened · what you expected · the
   engine file · how to reproduce · the structural context block. Keep it short. **Write it
   as context, not as an implementation** — an over-specified report caps the maintainer at
   this session's first guess, the same rule `upstream/backports/` states for the other
   direction.
4. **Show the learner the whole thing and ask.** Not a summary of it, not a description of
   it — **the payload, verbatim, every line that would leave their machine**. Then one plain
   question. **"No" is a complete and correct ending**: the file stays, nothing is sent, and
   you do not ask again this session. Never send on an inferred yes, and never treat an
   earlier "yes, report that" as covering a second report.
5. **Send it, by the first exit that works.** The destination is the profile's
   `template_source`; with no such line, ask for the repo URL once or stop at exit 3.

   | # | Exit | When |
   | --- | --- | --- |
   | 1 | `gh issue create --repo <template_source> --title "…" --body-file <the file>` | `gh auth status` exits 0. One command, no browser |
   | 2 | A **prefilled issue link**, handed over as a clickable URL on its own line: `<template_source>/issues/new?labels=workspace-defect&title=<urlencoded>&body=<urlencoded>` | no `gh`. The learner clicks, reads it again in GitHub's own form, and presses submit. **Falls back to exit 3 when the encoded URL exceeds ~6,000 characters** — a truncated report is worse than a pasted one |
   | 3 | The file itself: name it, hand it over, and say it can be pasted into an issue, an email, or anywhere else | no GitHub account, no network, or the learner would rather send it themselves |

   **Exit 2 and exit 3 both require a GitHub account to actually file**, and that is worth
   one honest sentence rather than a discovery at the sign-in wall. A learner without one has
   still lost nothing: the report is on their disk in full.
6. **Record and commit.** The outbound file, plus the issue URL when there is one, appended
   to the file's own header. Commit the named path. Then stop — no summary of the summary
   ([../docs/mechanics/narration.md](../docs/mechanics/narration.md) § 8).

## What this verb never does

- **Never sends anything without an explicit yes to this specific report.** Not on a
  standing permission, not because a previous report was approved, not because the learner
  said "report bugs" once in the interview.
- **Never batches.** One finding, one report, one decision. A queue that drains itself is a
  telemetry channel with extra steps.
- **Never sends a digest of how this instance is used** unless the learner asked for exactly
  that and read it first. This verb reports defects.
- **Never fabricates a reproduction.** If you cannot reproduce it, the report says so — the
  reference implementation's own history is full of defects that survived because a
  plausible story outranked a checked one.
