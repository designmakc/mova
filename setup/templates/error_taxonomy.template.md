<!-- mova:template -->
<!--
  GENERATES: docs/mechanics/error_taxonomy.md — instance-owned, engine-shaped: the
  code table is this learner's; the token grammar is the engine's (scripts/tally.mjs
  reads it — its docblock is the parser's contract, read it before changing anything
  here).
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}} IN PROSE. The fenced log-entry-format block below is the standing
    exception: its {{WRONG}} / {{RIGHT}} / {{CODE}} tokens are the format being
    demonstrated, not slots to fill, and they ship verbatim — see playbooks/setup.md § 2
    Generation, "The placeholder rule stops at a fenced block".
  - SEED THE ZONES THIS LEARNER'S LOG WILL ACTUALLY HIT, all marked (assumed): take the
    pack's notes.md taxonomy reference (earned codes for this target) and re-rank for
    THIS learner's held languages — the zones their languages cannot see come first. Do
    not port a reference code the pair makes irrelevant, and do not invent codes ahead of
    data: codes accrete in the session that first needs them.
  - HOW MANY: 6–10 is the usual count and NOT a cap. What decides is a per-code test, not
    arithmetic — a code earns a seed slot when all three hold: (a) high traffic — this
    learner meets the zone in the first weeks; (b) codeable — you can state its boundary
    against its neighbours in one line (that line is its Scope ruling); (c) not a drain
    every slip flows into. Zones that fail (b) wait for the session that first needs
    them. A fourth test decides whether a NEAR-NEIGHBOUR deserves its own code rather than
    a note: **it earns one when its repair route differs.** Two codes that drill the same
    way are one code; two that send the session to opposite remedies must never be fused,
    however alike the errors look on the page. Never pad to reach six, and never fuse two genuinely distinct zones to stay
    under ten — a fused code's tally points nowhere, which is the failure this whole file
    exists to prevent. A close pair or a three-anchor ladder legitimately produces more:
    eleven, on a German/English/French → Romanian instance. (Found generating a
    German-native level goal with a tutor, 2026-08-15.)
  - CODE FORMAT: CAPS or CAPS-CAPS — uppercase letters (any alphabet; the tally is
    Unicode-aware) plus dash, zone first, aspect second (ART-DEF, VRB-TENSE). Short,
    unambiguous, never renamed once entries cite them.
  - Keep every engine-doctrine block below verbatim (tokens table, entry format — tokens
    included, per the placeholder exception above — and the scope-section convention);
    they carry limba's incident costs and the tally's parsing contract.
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

<!-- Seed rows per the selection rule above (6–10 typical, more when the pair earns it).
     Zone = plain-language area; Example = a plausible error for THIS pair, marked ✗,
     with the correction — generate real examples, not schemas.
     THE CONTRAST RULE BELOW IS NOT ADVICE. Check each row you write against it before
     moving on, and check every row you carried over from the pack's notes.md — the pack
     is where these came from and the pack is where they were broken. Four rows in the
     first agent-generated pack failed it and two reached the generated instance
     unchanged. `node scripts/packcheck.mjs <code>` lints the pack side; this file is
     generated after that check runs, so the last reader is you. -->

| Code | Zone | Example error |
| --- | --- | --- |
| {{CODE}} | {{ZONE}} | ✗ {{EXAMPLE}} → {{CORRECTION}} (assumed) |

**Every example row shows a contrast.** The ✗ marks the wrong form, the correction follows
`→`, and the two are different strings. A row where they are identical, where the same form
sits on both sides, or where the ✗ marks a form the row itself calls correct teaches the
learner nothing and gives the tally a code with no worked example — and it is the shape a
row takes when it was ported without being understood. A code whose contrast you cannot
write is a code you do not yet own: leave it out and let the data earn it. (Found in the
first agent-generated language pack, 2026-08-15.)

**A false-friend row corrects into the target language.** `→` names the form the learner
should have written, so a row that points it at the held-language partner corrects a word
into a translation: `✗ *aktuell* (current) → actual` passes every rule above and still
teaches nothing, because `actual` is the false friend, not the repair. The meaning goes in
quotes on the ✗ side, the target form after the arrow — `✗ *aktuell* meant as "actual" →
tatsächlich`. (Found in the generated German instance, 2026-08-15.)

## Scope rulings

<!-- The convention that keeps codes sharp: each code's boundary against its neighbours,
     one bullet per ruling, added when a mis-filed entry shows the boundary is unclear.
     Seed ONLY rulings the seed codes already need (e.g. which code owns a missing
     diacritic vs an input-method look-alike — the pack's normalize.mjs owns look-alikes
     and they are NEVER coded). A deliberately narrow code beats a drain code every slip
     flows into — a drain's tally points nowhere. -->

- {{RULING}} (assumed)

**Sibling zones are not a hierarchy.** Where one production path can break in two ways —
two letter classes, two morphological slots — the split is worth two codes, because a run
of one with none of the other means something a merged tally cannot say. limba found the
second half of exactly this hole three months in: it had a code for vowel-order errors and
none for consonants, and a single session produced six of these, half of them uncountable
(2026-08-19).

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
- **"none identified" is a value, not a shrug** — and the distinction it draws decides how
  the error gets repaired. An error a held language *caused* (its pattern pushed the wrong
  form through) is repaired by contrast: name the source, show the two systems side by
  side, and it can stop today. An error a held language merely *failed to prevent* — the
  target has a system the learner's languages do not, so nothing filled the slot — has no
  contrast to draw and is repaired only by drilling the system itself. Recording them the
  same way sends the second kind to the first kind's remedy, which does nothing. Expect
  the second kind to dominate when the contrast ladder is short. (Found generating an
  English-only instance, 2026-08-14.)

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
