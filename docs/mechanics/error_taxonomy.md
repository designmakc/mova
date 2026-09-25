<!-- mova:instance -->
# Error taxonomy — codes for the error log

> Coded errors make weakness computable: the drill and review verbs read the tally
> (`node scripts/tally.mjs`) and drill the top of it. **New codes are appended to this
> table in the same session that first uses them.**
>
> **Provenance:** codes seeded at setup, 2026-09-12 — every one `(assumed)` until this
> learner's log cites it. The token grammar below is engine doctrine (derived from
> limba's SES-005/SES-007, where a surface code out-counted its own cause for three
> sessions and sent drilling at the symptom).

## Codes

12 codes seeded (above the 6-10 typical count) — justified by a genuinely rich contrast
here: two held languages (Russian, Ukrainian) that both differ from English in the same
structural ways (no articles, aspect instead of tense, free word order), plus this
learner's own stated weak point (spelling) earning its own dedicated code rather than
being absorbed into a general "orthography" drain. Re-ranked from `packs/en/notes.md`
for this specific learner, not ported wholesale.

| Code | Zone | Example error |
| --- | --- | --- |
| ART-MISS | article omission | ✗ *I opened design file* → I opened a design file (assumed) |
| ART-CHOICE | a/an/the misselection once attempted | ✗ *I sent a feedback to a team* → I sent the feedback to the team (assumed) |
| SPELL-MEM | spelling not reliably retained | ✗ *recieve* → receive (assumed) |
| VRB-3SG | third-person -s dropped | ✗ *she design the layout* → she designs the layout (assumed) |
| VRB-TENSE | tense/aspect substitution | ✗ *I work on this project since March* → I have been working on this project since March (assumed) |
| VRB-PRINPART | irregular verb principal parts wrong | ✗ *I writed the spec* → I wrote the spec (assumed) |
| VRB-AUX | dropped copula/auxiliary in a continuous (or other periphrastic) construction | ✗ *The team testing a new feature* → The team is testing a new feature (added SES-002, 2026-09-13) |
| PREP | preposition selection | ✗ *depends of the design* → depends on the design (assumed) |
| WO-ADV | adverb placement | ✗ *I read always the documentation* → I always read the documentation (assumed) |
| WO-QINV | missing question inversion/do-support | ✗ *You have read this article?* → Have you read this article? (assumed) |
| LEX-FF | false friend | ✗ *actual* meant as "current" → current (assumed) |
| NOUN-COUNT | count/mass noun mismatch | ✗ *give me an advice* → give me advice (assumed) |
| REG | register mismatch | ✗ *I would be most grateful if you could kindly advise* (in a casual Slack thread) → could you take a look? (assumed) |

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
tatsächlich`. (Found in the generated German instance, 2026-08-15.) The LEX-FF row above
follows this: `✗ *actual* meant as "current"` puts the false friend and its intended
meaning together on the ✗ side, and `→ current` is the target-language repair.

## Scope rulings

- **ART-MISS vs ART-CHOICE**: no article attempted at all is ART-MISS; a wrong article
  once one is attempted is ART-CHOICE. Expect ART-MISS to dominate early — it reflects a
  total structural absence in both held languages, not a confusion between two options.
  (assumed)
- **VRB-TENSE vs VRB-PRINPART**: a wrong irregular form (*writed* for *wrote*) is a
  memorisation gap the pack's `required_fact` exists to catch — code VRB-PRINPART. A wrong
  tense/aspect CHOICE (simple past where present perfect was needed) is a system-mapping
  gap with no memorisation fix — code VRB-TENSE. Conflating them sends a memorisation
  problem to grammar drilling and vice versa. (assumed)
- **Cyrillic/Latin keyboard homoglyphs are never coded here at all.** `packs/en/normalize.mjs`
  folds them silently before anything reaches the log — the same rule Romanian's
  ORTH-DIA/normalize.mjs split states: input method is never a language error. (assumed)
- **SPELL-MEM vs VRB-PRINPART**: a wrong irregular verb form is coded VRB-PRINPART even
  though it is also, mechanically, a spelling failure — the repair route (memorise this
  specific closed list) differs from general SPELL-MEM's repair route (spaced writing
  practice across the whole vocabulary), so they stay separate codes despite both being
  "the learner didn't remember how to write this". (assumed)
- **WO-ADV vs WO-QINV**: both are word-order errors but repair in opposite ways — WO-ADV
  is correcting an over-application of Russian/Ukrainian's freer placement (the learner
  produces a real but non-native order), while WO-QINV is filling a total gap (no
  do-support/inversion instinct exists to over-apply). One is "constrain an existing
  instinct", the other is "install a new pattern from nothing" — different remedies, kept
  as separate codes. (assumed)
- **PREP stays one broad code for now**, deliberately not split into per-verb sub-codes —
  English preposition choice is idiomatic collocation rather than rule-governed, and a
  finer split should wait for real session data on which specific pairs this learner
  actually confuses, rather than guessing a taxonomy ahead of evidence. (assumed)
- **PREP currently covers both omission and misselection, unlike ART-MISS/ART-CHOICE's
  split.** SES-002 (2026-09-13) hit an omission case — "a component system" for "a
  component *of* the system", the linking preposition dropped entirely rather than a
  wrong one substituted — and no PREP-MISS code exists to hold it separately. Coded PREP
  for now rather than forcing ART-MISS's omission logic onto a different word class; flagged
  here as a real gap, not a considered ruling — a PREP-MISS/PREP-CHOICE split should be
  made if omission cases keep recurring.
- **VRB-3SG covers BOTH directions, ruled SES-004 (2026-09-24).** The code's own row reads
  "third-person -s dropped" — omission only — and SES-004's graded check produced the other
  two shapes on the same paper: the ending ADDED after a plural subject ("We designers" for
  "We design", item 4) and no finite form built at all ("The designer to finish", item 7),
  alongside the ordinary omission (item 5). Nothing in the table held either. The ruling is
  to widen this one code rather than open VRB-3SG-OVER, because the repair-loop diagnosis
  found a single cause under all three: the subject decision is not being made, and the
  direction of the resulting error is noise. A one-code tally therefore says something true
  ("the agreement decision is not running"), where a split would have scattered one mechanism
  across three lines. Reconsider only if over-marking ever appears WITHOUT under-marking in
  the same learner-week — that would be a different mechanism and would earn its own code,
  per "Sibling zones are not a hierarchy" below.
- **PREP's omission/misselection gap now has one real instance of each (SES-004,
  2026-09-24).** ERR-006 flagged the split as missing with only omissions in hand; SES-004's
  free production supplied the first misselection — "The team works of a new feature" for
  "works on", a wrong preposition chosen rather than a linker dropped (ERR-013). Still coded
  PREP, and the gap is still open — but it is now a measured gap rather than a predicted one,
  and a PREP-MISS/PREP-CHOICE split has the evidence a taxonomy change should wait for.
- **VRB-AUX added SES-002 (2026-09-13)** for a dropped copula/auxiliary in a continuous
  construction ("The team testing" for "The team is testing") — distinct from VRB-3SG
  (a wrong verb form once one is produced) and from VRB-TENSE (a wrong tense/aspect
  choice): here no auxiliary was attempted at all, an omission rather than a substitution,
  same shape as the ART-MISS/ART-CHOICE split but for the auxiliary slot.

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
  English-only instance, 2026-08-14.) **For this learner, expect ART-MISS, WO-QINV and
  VRB-PRINPART to mostly be "none identified" — Russian/Ukrainian have no article system,
  no do-support, and no equivalent closed irregular-verb list to blame, so these are gap
  errors, not interference errors, and drilling is the only repair.**

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
