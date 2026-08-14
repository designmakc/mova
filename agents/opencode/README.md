<!-- mova:engine -->
# agents/opencode/ — the opencode adapter

How setup instantiates mova's verbs for `agent: opencode`. opencode reads AGENTS.md
natively (project rules), so the verb table already works with no shims; what this adapter
adds is **explicit slash commands** — one generated command file per active verb, each a
pointer and nothing else.

## What setup generates (into the INSTANCE, never this repo)

For each active verb (same activation rules as every adapter — see
`agents/claude-code/README.md` "Which verbs are active" and `docs/agents.test.ts`), write
`.opencode/command/mova-<verb>.md` from [command.template.md](command.template.md):

- Copy the template **from line 2** (line 1 is this repo's `mova:engine` marker; the
  generated shim is instance content, and the YAML frontmatter must start at line 1).
- `{{VERB}}` ← frontmatter `verb:`, `{{SUMMARY}}` ← frontmatter `summary:` (single line —
  it becomes the command's TUI description).
- The playbook's `triggers:` are NOT used here: opencode commands are explicitly invoked
  (`/mova-<verb>`), there is no description-based auto-routing to feed them into. Natural
  phrasing still routes via the AGENTS.md verb table.
- The body stays the pointer plus `$ARGUMENTS` (opencode substitutes whatever the human
  typed after the command). No rule text — same drift argument as every adapter.

## Format notes — what is verified vs assumed

Verified against opencode's docs (opencode.ai/docs/commands, checked 2026-08-13): custom
commands are markdown files with YAML frontmatter (`description`, optional `agent`,
`model`, `subtask`), body = prompt template, `$ARGUMENTS` placeholder; the filename is the
command name. **Caveat:** docs of different vintages show the project directory as
`.opencode/command/` (singular) and `.opencode/commands/` (plural). This adapter uses the
singular, which `docs/agents.test.ts` also checks; if the installed opencode expects the
plural, generate into both — the shim is 7 lines, duplication costs nothing and holds no
rules.
