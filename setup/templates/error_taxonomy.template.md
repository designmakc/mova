<!-- mova:template -->
<!--
  GENERATES: docs/mechanics/error_taxonomy.md — instance-owned, engine-shaped: the
  code table is this learner's; the token grammar is the engine's (scripts/tally.mjs
  reads it — its docblock is the parser's contract, read it before changing anything
  here).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - SEED 6–10 STARTER CODES, all marked (assumed): take the pack's notes.md taxonomy
    reference (earned codes for this target) and re-rank for THIS learner's held
    languages — the zones their languages cannot see come first. Do not port a
    reference code the pair makes irrelevant, and do not invent codes ahead of data:
    codes accrete in the session that first needs them.
  - CODE FORMAT: CAPS or CAPS-CAPS — uppercase letters (any alphabet; the tally is
    Unicode-aware) plus dash, zone first, aspect second (ART-DEF, VRB-TENSE). Short,
    unambiguous, never renamed once entries cite them.
  - Keep every engine-doctrine block below verbatim (tokens table, entry format, the
    scope-section convention) — they carry limba's incident costs and the tally's
    parsing contract.
-->
# Error taxonomy — codes for the error log

> Coded errors make weakness computable: the drill and review verbs read the tally
> (`node scripts/tally.mjs`) and drill the top of it. **New codes are appended to this
> table in the same session that first uses them.**
>
> **Provenance:** codes seeded at setup, {{DATE}} — every one `(assumed)` until this
> learner's log cites it. The token grammar below is engine doctrine (derived from
> limba's SES-005/SES-007, where a surface code out-counted its own cause for three
> sessions and sent drilling at the symptom).

## Codes

<!-- 6–10 seed rows. Zone = plain-language area; Example = a plausible error for THIS
     pair, marked ✗, with the correction — generate real examples, not schemas. -->

| Code | Zone | Example error |
| --- | --- | --- |
| {{CODE}} | {{ZONE}} | ✗ {{EXAMPLE}} → {{CORRECTION}} (assumed) |

## Scope rulings

<!-- The convention that keeps codes sharp: each code's boundary against its neighbours,
     one bullet per ruling, added when a mis-filed entry shows the boundary is unclear.
     Seed ONLY rulings the seed codes already need (e.g. which code owns a missing
     diacritic vs an input-method look-alike — the pack's normalize.mjs owns look-alikes
     and they are NEVER coded). A deliberately narrow code beats a drain code every slip
     flows into — a drain's tally points nowhere. -->

- {{RULING}} (assumed)

## Log entry format (docs/logs/error_log.md)

```markdown
## YYYY-MM-DD — ERR-NNN
- **Error.** ✗ „{{WRONG}}" → „{{RIGHT}}". Code: {{CODE}}.
- **Interference.** {{HELD_LANGUAGE_SOURCE — or "none identified"}}.
- **Context.** {{VERB_AND_UNIT}}, {{ACTIVITY}}.
```

- One entry per *pattern worth recording* (3+ repetitions or an assessment-critical
  zone), not per slip and not per sighting — the sighting count goes in `×N`.
- The `Code:` token must match the table above exactly — the tally reads it.
- Entries are append-only, newest-first, IDs strictly increasing (log test enforces).
- Every correction names the interference when there is one, per the contrast ranking —
  and that claim follows `docs/mechanics/verification.md` like any other.

## The tokens the tally reads

A flat list of codes cannot say that one finding *causes* another. These tokens fix
that without breaking append-only; `scripts/tally.mjs` is the parser and its docblock
the contract.

| Token | Meaning | Effect on the tally |
| --- | --- | --- |
| `Code: XXX ×N` | this entry's surface code, N sightings | counts N; `×N` omitted means 1 |
| `Root: ERR-NNN` | this entry is a **manifestation** of that one | its count moves to the root's code |
| `Reroots: ERR-A → ERR-B` | a *later* entry declaring that link retroactively | same, applied to an entry that cannot be edited |
| `Retires: ERR-NNN` | that finding is out of scope | it leaves the tally entirely |
| `Counts: ERR-NNN ×N` | a *later* entry setting an older entry's occurrence count | as if that entry had written `×N` itself |
| `Siblings: ERR-A, ERR-B` | one mechanism in two systems, neither causing the other | both keep their counts; combined weight printed too |
| `Measured: CODE DATE P%` | that zone re-tested on DATE, scored P% | occurrences strictly before DATE stop counting as live |

- An entry that only re-attributes or retires carries no `Code:` of its own.
- Writing *about* a token: wrap it in backticks — the tally strips inline-code spans,
  so quoted tokens are discussion, not declarations (limba's ERR-012 counted itself).
- What earns a `Measured:`: a real scored set, leak-checked, on items that test that
  zone, with the session named — not an impression, not a same-sitting retest.
