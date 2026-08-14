<!-- mova:engine -->
# agents/codex/ — the Codex adapter

**The verb table in AGENTS.md is the adapter.** Codex reads a repo's `AGENTS.md` natively;
mova's canonical file is already `AGENTS.md`, and its verb table maps every phrase to its
playbook. An instance configured `agent: codex` therefore needs **no generated files** —
setup generates nothing here, and `docs/agents.test.ts` checks instead that AGENTS.md's
verb table links every active playbook.

## Optional prompt-file shims — user-global, not generated

Codex supports custom prompts as slash commands: top-level markdown files in
`~/.codex/prompts/` (frontmatter: `description`, `argument-hint`; placeholders `$1`–`$9`,
`$ARGUMENTS`), invoked as `/<filename>`. Two reasons setup does not generate them:

1. The directory is **user-global, outside the repo** — an instance cannot carry it, and
   writing outside the workspace is not setup's to do silently.
2. OpenAI's docs mark custom prompts **deprecated in favor of skills** (as of 2026) — a
   generated format already scheduled for retirement is a bad sync-stability bet.

A human who wants `/mova-lesson` anyway can hand-create
`~/.codex/prompts/mova-<verb>.md` with the same pointer body every adapter uses:
*Follow playbooks/<verb>.md in this repo. All rules live there and in `docs/mechanics/` —
this file deliberately holds none.* Keep it a pointer; rules in a shim drift.

## What is verified vs assumed

Verified against OpenAI's Codex docs (developers.openai.com/codex/custom-prompts, checked
2026-08-13): AGENTS.md support, the `~/.codex/prompts/` location and its deprecation
notice. Not verified: any per-repo prompt/skill directory — none is documented, which is
exactly why AGENTS.md carries this agent.
