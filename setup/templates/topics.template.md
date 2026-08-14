<!-- mova:template -->
<!--
  GENERATES: docs/reference/topics.md — the topic-first coverage map, and the arbiter
  for repair-vs-new-material decisions.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - TABLE CONTRACT (docs/topics.test.ts): every section holds a 5-column table with
    header exactly `| ID | Aspect | Unit | Exam | Status |` and ≥1 row. `id` is
    T-NNNN, unique, monotonically assigned, NEVER reused or renumbered — the state/
    ledgers' topic column points at it, so an id is a permanent address. `Unit` is
    exactly one UNN that exists in curriculum.md. `Exam` is a space-separated subset
    of the profile's `sections:` letters. `Status` is `pending` at generation —
    covered dates are measurements.
  - EVERY UNIT in curriculum.md must appear in at least one row — a unit absent from
    this map is a unit whose contribution nobody can state. Generate topics and
    curriculum against each other and run npm test when both exist.
  - Sections = the target language's grammar systems: start from the pack's notes.md
    system inventory, keep systems the goal's level band actually reaches, and give
    each 3–15 aspect rows at the granularity a session can flip to covered in one
    teaching block. Aspect assignment to units is `(assumed)` sequencing — say so once
    in the header, not per row.
-->
# Topic map — what each grammar system is, and which units cover it

> [../curriculum.md](../curriculum.md) is **unit-first**: it answers "what happens in
> U{{NN}}?". This file is **topic-first**: it answers "how much of the {{EXAMPLE_SYSTEM}}
> do I actually know, and where does the rest arrive?" — a question the curriculum cannot
> answer, because every real system is scattered across many units.
>
> **This file is the arbiter for repair-vs-new-material**: a session deciding whether an
> error means re-teaching checks here first — a `pending` aspect was never taught and is
> intake, not repair; a `covered` aspect that fails is repair and routes by the error
> tally. Every teaching block's placement statement ("this covers 2 of 7 aspects; the
> rest arrives in U{{NN}}") is **derived from this file**, never improvised.
>
> Conventions, enforced by `docs/topics.test.ts`:
>
> - Every row: `| id | aspect | unit | exam | status |`; unit is exactly one `UNN` that
>   exists in the curriculum.
> - **`id` is `T-NNNN`, unique, monotonically assigned, never reused, never renumbered**
>   — the `state/` ledgers address aspects by it.
> - `status:` is `pending` or `covered YYYY-MM-DD` — flipped at close-out by the session
>   that taught it.
> - Exam letters: {{LETTER_LEGEND}}.
> - Every unit appears at least once.
>
> Unit assignments seeded `(assumed)` at setup, {{DATE}} — re-sequencing at phase entry
> is expected; renumbering is forbidden.

## {{SYSTEM_NAME}}

<!-- One H2 per grammar system. Optional one-line intro when the system needs framing
     for THIS pair (e.g. "no analogue in any held language — expect the densest error
     traffic here"). -->

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0001 | {{ASPECT}} | U{{NN}} | {{LETTERS}} | pending |

## {{NEXT_SYSTEM}}

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| {{T-NNNN}} | {{ASPECT}} | U{{NN}} | {{LETTERS}} | pending |
