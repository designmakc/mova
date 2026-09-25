<!-- mova:instance -->
# Plan — phases, scope, and routing

> The single source of truth for what's in scope right now. The goal contract holds the
> *what for* ([reference/goal.md](reference/goal.md)); the curriculum holds the unit
> detail ([curriculum.md](curriculum.md)); this file holds the *when* and the index.

**Current phase: Phase 0 — Setup and placement** (opened 2026-09-12). Phase targets are
computed from the interview's time budget (~4 blocks/week), assume zero slippage, and get
re-checked at every review.

> **Routing legend** — every open milestone carries `— <readiness> <complexity> ·
> <agent>`, on one line (milestones never wrap — the annotations test reads single
> lines):
>
> - Readiness: 🟢 ready now · 🟡 needs a small decision first · 🟠 blocked on research
>   or an external fact · 🔴 blocked hard.
> - Complexity: Low / Med / High (human-kept, not machine-checked).
> - Agent — what kind of session tackles it: 🧠 full lesson/study block · ⚙️ drill or
>   short practice slot · 🔧 admin/logistics (booking, downloading, tooling).
>
> Completed `[x]` items drop the annotation. `npm test` after every edit to this file.

## Projects index

### Skill tracks

| Project | Status | Summary |
| --- | --- | --- |

### Exam & assessment

| Project | Status | Summary |
| --- | --- | --- |

### Workspace infrastructure

| Project | Status | Summary |
| --- | --- | --- |
| [workspace_setup](projects/workspace_setup.md) | done | Interview record and generation decisions — how this instance came to be |

---

## Phase 0 — Setup and placement (2026-09-12 – placement) (current)

Goal: the workspace exists and is trusted; the first placement snapshot replaces the
interview's guesses with data.

- [x] Workspace generated and smoke-tested — 2026-09-12.
- [x] **Placement calibration session.** Probed 2026-09-12 across U01-U03 —
  `docs/snapshots/2026-09-12_placement.md`. Confirms true-beginner production (article
  omission, missing 3sg -s, unknown irregular plurals) with stronger-than-expected reading
  comprehension; U01 confirmed as the right starting unit.
- [ ] First scenario baseline — run all 5 goal scenarios once, unrehearsed, to see where each one actually starts — 🟢 Med · ⚙️
- [ ] Acquire first reading materials into untracked `materials/` (one design-system doc page, one UX article) — 🟡 Low · 🔧

### Pacing table

| Phase | Units | Weeks | Ends | Weekly load |
| --- | --- | --- | --- | --- |
| 0 | setup | 1 | placement complete | ~1 lesson |
| 1 | U01-U03 | 5 | U03 covered | ~3 lessons + 1 write |
| 2 | U04-U08 | 8 | U08 covered | ~3 lessons + 1 write |
| 3 | U09-U12 | 6 | U12 covered (goal gate) | ~2 lessons + 1 write + 1 mock |

### Pacing

- **~4 study blocks (≈1.5 h) weekly** — the interview's budget, 2026-09-12; the number
  this plan rests on. If it doesn't hold in practice, the volume target moves (fewer or
  slower units per phase), not the unit count — this goal has no deadline to protect.
- 12 units over an estimated ~20 weeks at this pace, assuming zero slippage; re-checked at
  every review against actual sessions held (`docs/logs/`) and ledger growth against the
  goal's ~300-500 target volume.

## Phase 1 — Foundations (U01-U03)

Goal: the learner can produce a grammatically complete sentence with a correctly-placed
article most of the time, and can skim a short technical passage for gist. Target: U03
covered.

- [x] U01 — articles and basic sentence structure
- [x] U02 — present tense and everyday verbs — covered 2026-09-25 (SES-003 taught, SES-004 measured and closed).
- [ ] U03 — reading short technical text; adjectives — 🟢 Med · 🧠
- [ ] Phase 1 gate: scenario 1 re-run, scored against its probe — 🟡 Low · ⚙️

## Phase 2 — Writing at work; past tense; prepositions; questions (U04-U08)

Goal: the learner can write a clear short work-chat message and read a real UX article
for its main point. Target: U08 covered.

- [ ] Detail U04-U08 at phase entry, informed by the Phase 1 error log — 🟡 Low · 🧠
- [ ] Phase 2 gate: scenarios 2 and 3 re-run, scored against their probes — 🟡 Low · ⚙️

## Phase 3 — Aspect, listening, spelling, consolidation (U09-U12)

Goal: all 5 scenarios pass cold at least once; the goal's assessment instrument (mock)
runs clean. Target: U12 covered — the goal's endgame.

- [ ] Detail U09-U12 at phase entry, informed by the Phase 2 error log — 🟡 Low · 🧠
- [ ] Full scenario-run mock across all 5 scenarios (U12's gate) — 🟡 Low · 🧠

## Discovered / unscheduled

> Don't let items rot here — promote to a phase or a `docs/projects/` file, or close
> them. Every bullet here carries the routing annotation like any open milestone.

- Revisit `packs/en/dictionary.mjs` once network reachability is confirmed stable (see `packs/en/pack.md` § Dictionary reachability) — 🟠 Med · 🔧
- U06 pressure: countability (T-0009) and verb+preposition (T-0020) hit 4× in free production across SES-003/004, ahead of their unit. Resequencing was offered to the learner on 2026-09-25 and **declined — stay on plan, U03 next**. Keep the tally; `review` re-weighs it with more data, and does not re-ask before then — 🟢 Low · 🧠

## Standing rules across all phases

Mirror of AGENTS.md "Hard invariants" — if they drift, AGENTS.md wins and this list gets
fixed:

- **The scenario list is the spec.** Work that serves no part of the goal contract is
  scope creep, however enriching.
- State lives only in `state/` ledgers and `docs/logs/`; every session ends with the
  close-out ritual; a session that isn't logged didn't happen.
- Logs are append-only, newest-first, IDs strictly increasing; never edit or renumber an
  old entry.
- `npm test` after edits to this file, `docs/projects/`, `docs/curriculum.md`,
  `docs/reference/topics.md`, or `state/`. The agent runs all tooling; the learner never
  has to.
- No copyrighted content in the repo; `materials/` contents stay untracked.
- Every language fact is dictionary-verified, tutor-confirmed, or visibly marked
  unverified — and every correction names the interference when there is one.
