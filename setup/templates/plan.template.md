<!-- mova:template -->
<!--
  GENERATES: docs/plan.md — the single source of truth for what's in scope right now.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - ANNOTATION CONTRACT (docs/plan.annotations.test.ts): every OPEN milestone — any
    `- [ ]` checkbox anywhere, plus every top-level bullet in the Discovered section —
    carries `— <readiness> <complexity> · <agent>` ON ONE LINE (milestones never
    wrap). Completed `[x]` milestones DROP the annotation entirely (no readiness
    glyph may survive on the line). The test requires at least one open AND at least
    one completed milestone — the seeds below provide both; keep them.
  - PROJECTS INDEX CONTRACT (docs/projects.index.test.ts): the `## Projects index`
    section binds the moment plan.md exists. Every file in docs/projects/ needs
    exactly one row, as a markdown link, under the `### ` sub-header matching its
    frontmatter kind, status cell matching its frontmatter. Setup seeds ONE project —
    the workspace-generation record (playbooks/setup.md writes it) — so the index
    starts truthful and non-empty. The three sub-headers below are the test's exact
    labels; keep all three even when empty.
  - PACING: the `~N study blocks` phrase is load-bearing — docs/consequential.test.ts
    reads it for the SRS-ceiling arithmetic, against the goal's `**Target volume**` line.
    Derive phases from the goal contract and the interview's time budget; a no-deadline
    goal gets volume/streak targets, not dates.
  - PLACEMENT ROUTING: the seeded placement milestone names a VERB. Use the carrier verb
    for this instance's focus mode (setup/scenarios/focus_modes.md § Placement and
    assessment run in every mode) — `lesson` under `full`, `drill` under `drill`/`vocab`,
    `write` under `writing` — and match the agent glyph to it. A milestone routed to a
    verb this instance refuses is a milestone nobody can run. (Found generating an
    Italian-native vocabulary-only instance, 2026-08-15.)
-->
# Plan — phases, scope, and routing

> The single source of truth for what's in scope right now. The goal contract holds the
> *what for* ([reference/goal.md](reference/goal.md)); the curriculum holds the unit
> detail ([curriculum.md](curriculum.md)); this file holds the *when* and the index.

**Current phase: Phase 0 — {{PHASE_0_TITLE}}** (opened {{DATE}}). Phase targets are
computed from the interview's time budget ({{BLOCKS}} blocks/week), assume zero
slippage, and get re-checked at every review.

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

## Phase 0 — {{PHASE_0_TITLE}} ({{DATE_RANGE}})

Goal: the workspace exists and is trusted; the first placement snapshot replaces the
interview's guesses with data.

- [x] Workspace generated and smoke-tested — {{DATE}}.
- [ ] **Placement calibration session.** The first {{PLACEMENT_VERB — the focus mode's carrier verb}} probes instead of working through material: establish the real starting level against the intake snapshot, write `docs/snapshots/` placement with Method + "Not exercised:", update this file's pacing — 🟢 Med · {{GLYPH — 🧠 for a lesson, ⚙️ for a drill or write}}
  <!-- This box stays OPEN when the learner declines the probe. A decline is legitimate and
       the session records the level as GUESSED in the placement snapshot's Method
       (docs/mechanics/session_format.md § The placement calibration) — but a guessed level
       is a debt, not a measurement, and the first real measurement is what closes this box.
       Do not tick it because a session happened. (Found 2026-08-15: a learner skipped the
       probe to get material quickly, which the agent handled well; nothing recorded that
       the curriculum's starting point now rested on a guess.) -->
- [ ] {{GOAL_LOGISTICS_MILESTONE — exam: TO-CONFIRM research + registration; level/functional: first descriptor sweep or scenario baseline; keep it one line}} — 🟠 Med · 🔧
- [ ] {{MATERIALS_MILESTONE — acquire what the goal contract's assessment section names, into untracked materials/}} — 🟡 Low · 🔧

### Pacing

<!-- The load-bearing arithmetic. With a goal_date: units ÷ weeks, phase end dates, the
     weekly load. Without one: the volume/streak commitment. Either way the `~N study
     blocks` phrase appears exactly once, with the real number. -->

- **~{{BLOCKS}} study blocks (≈{{HOURS}} h) weekly** — the interview's budget,
  {{DATE}}; the number this plan rests on. If it doesn't hold in practice,
  {{WHAT_MOVES — the date moves / the volume target moves}}, not the unit count.
- {{PACE_DERIVATION — units/week vs weeks remaining, or streak targets}}

## Phase 1 — {{PHASE_TITLE}} ({{UNIT_RANGE}})

Goal: {{PHASE_GOAL}}. Target: {{DATES_OR_VOLUME}}.

- [ ] {{MILESTONE}} — 🟢 Med · 🧠
- [ ] {{MILESTONE}} — 🟢 Med · ⚙️

<!-- …further phases mirror the curriculum's phase structure; the final phase is the
     goal's endgame (mock cycles / descriptor sweeps / scenario runs). Every phase gets
     a gate milestone that writes a snapshot. -->

## Discovered / unscheduled

> Don't let items rot here — promote to a phase or a `docs/projects/` file, or close
> them. Every bullet here carries the routing annotation like any open milestone.

## Standing rules across all phases

Mirror of AGENTS.md "Hard invariants" — if they drift, AGENTS.md wins and this list gets
fixed:

- **{{SPEC_SENTENCE — copy from goal.md verbatim}}** Work that serves no part of the
  goal contract is scope creep, however enriching.
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
