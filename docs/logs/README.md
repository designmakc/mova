<!-- mova:engine -->
# docs/logs/ — append-only field logs

**Conventions:**

- **Append-only, newest-first.** New entries go at the top, under the intro blockquote.
  Never edit or renumber an old entry — if an old entry was wrong, append a correcting one.
- **Numbered IDs per log**: `SES-NNN` (sessions), `ERR-NNN` (errors), strictly increasing.
  `docs/logs.entries.test.ts` enforces ID format, uniqueness, and newest-first ordering.
- **Entry heading format**: `## YYYY-MM-DD — SES-NNN` (one entry per heading).
- **A session entry's `Next` pointer states work, never counts.** Its numbers freeze at
  close-out while `queue.mjs` and `hub.mjs` recompute theirs every run, so a pointer that
  reports how many rows were due puts two totals for one queue on the same screen. Naming a
  set is fine ("the 14 city words"); measuring the queue is not. Gated by
  `../logs.entries.test.ts` from the date in its `POINTER.effectiveFrom`, and see
  [../mechanics/session_format.md](../mechanics/session_format.md) → *Which block to run*.
- **Append via `scripts/log-append.mjs`** — it takes a lock, derives the next ID inside it,
  and inserts at the top. Concurrent sessions writing by editor tool have silently lost
  entries before; the script exists so that cannot happen.
- Logs never reach `done` and are intentionally **not** in the Projects Index.

| Log | Entries | Written by |
| --- | --- | --- |
| [session_log.md](session_log.md) | one per session: type, covered, SRS counts, score, next | every playbook's close-out |
| [error_log.md](error_log.md) | one per recurring/critical error, coded per [../mechanics/error_taxonomy.md](../mechanics/error_taxonomy.md) | lesson, drill, write, mock |

Error entries: `**Error.**` / `**Interference.**` / `**Context.**` — the `Code:` token is
what the tally pipeline greps, keep it exact.
