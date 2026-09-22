<!-- mova:instance -->
# Error log

> One entry per recurring or goal-critical error, newest first, coded per
> [../mechanics/error_taxonomy.md](../mechanics/error_taxonomy.md) (generated at setup).
> Tallied by **`node scripts/tally.mjs`**, which resolves `Root:`/`Reroots:` causation and
> drops `Retires:` findings — a plain grep of `Code:` gives the surface count only, and in
> the reference instance counted a symptom above its own cause for three sessions.
> Conventions: [README.md](README.md). Append via
> `node scripts/log-append.mjs error --file <body>`.

## 2026-09-13 — ERR-007

- **Error.** ✗ "a new future of the product" (meant "feature") → "a new feature of the product". Code: SPELL-MEM ×1.
- **Interference.** none identified — a visual/phonetic near-miss between two unrelated English words ("future"/"feature"), not a transfer error from either held language.
- **Context.** lesson U01 SES-002, part 4 applied practice, free-production sentence 3. Observed only, not scored as a taught-material miss — spelling recall (T-0002/T-0003, U11) is still `pending` in topics.md and has not been drilled, same convention SES-001/ERR-003 used for a pre-instruction observation. Flagged as a data point for this learner's stated weak point (spelling) and for whenever U11 opens.

## 2026-09-13 — ERR-006

- **Error.** ✗ "The Button is a component system" → "The button is a component of the system". Code: PREP ×1.
- **Interference.** Russian genitive case ("компонент системы") marks the possession/component relation with a noun-case suffix and no separate word; English always needs an explicit "of", it never drops — the omission mirrors the source language having no equivalent free-standing preposition to transfer.
- **Context.** lesson U01 SES-002, SRS review, G-0001/G-0002 production prompt 2 (translate "Кнопка — это компонент системы"). Corrected live and taught explicitly afterward as the general "X of Y" pattern; re-tested correctly in part-4 practice sentences 1 and 2 (see session log). Flagged in `error_taxonomy.md`'s scope rulings this session: this is an omission, not a misselection, and PREP currently has no ART-MISS/ART-CHOICE-style split to hold that distinction — coded PREP for now rather than forcing a bad fit.

## 2026-09-13 — ERR-005

- **Error.** ✗ "Designer testing a new function" / "The Team testing a new future of the product" → "The designer is testing…" / "The team is testing…". Code: VRB-AUX ×2.
- **Interference.** none identified — Russian/Ukrainian have no copula in the present tense at all ("Дизайнер тестирует" has no "is"), so the omission is a total structural gap the held languages give no reason to fill, not a wrong choice among competing forms.
- **Context.** lesson U01 SES-002 — first occurrence in the SRS review's G-0001/G-0002 production prompt 1; second occurrence in part-4 applied practice, free-production sentence 3 ("Команда тестирует новую функцию продукта"). Both corrected live. New code, added to `docs/mechanics/error_taxonomy.md` this session — no prior code covered a dropped continuous auxiliary (VRB-3SG covers a wrong 3sg form once produced, VRB-TENSE a wrong tense/aspect choice; neither fits an omitted "is").

## 2026-09-13 — ERR-004

- **Error.** ✗ "Designer testing a new function" → "The designer is testing a new feature". Code: ART-MISS ×1.
- **Interference.** none identified — Russian/Ukrainian have no article system at all, so this is a total structural gap, not a misselection once one is attempted (consistent with the taxonomy's scope ruling on ART-MISS vs ART-CHOICE).
- **Context.** lesson U01 SES-002, SRS review, G-0001 production prompt 1 (translate "Дизайнер тестирует новую функцию"). Same sentence also dropped the continuous auxiliary — logged separately as ERR-005 (VRB-AUX), a different production slot with a different repair.

## 2026-09-12 — ERR-003

- **Error.** ✗ "The team build a screen" → "The team builds a screen". Code: VRB-3SG ×1.
- **Interference.** none identified — Russian/Ukrainian fully conjugate every person, so the risk is under-marking English's one uniquely-marked form (transfer.md), consistent with the placement snapshot's predicted risk.
- **Context.** lesson U01 SES-001, part 4 applied practice (free writing) — observed only, not scored as a U01 error: third-person -s is T-0010/U02 material, still `pending` in topics.md, so nothing here was taught yet to miss. Logged as an observed-but-not-yet-taught data point confirming the placement snapshot's predicted VRB-3SG risk ahead of U02.

## 2026-09-12 — ERR-002

- **Error.** ✗ "an feature" (indefinite, new-information form) → "The feature" (definite, known referent). Code: ART-CHOICE ×1.
- **Interference.** none identified — error_taxonomy.md has no more specific code for "indefinite used where a known referent required the definite article"; scored under ART-CHOICE per its own scope ruling ("a wrong article once one is attempted").
- **Context.** lesson U01 SES-001, part 3 graded check, item 10 — "feature" had already been mentioned earlier in the check and should have taken "the".

## 2026-09-12 — ERR-001

- **Error.** ✗ "an project" / "a element" / "the user" (new) / "an system" → "a project" / "an element" / "a user" / "a system". Code: ART-CHOICE ×4.
- **Interference.** none identified — items 2/3/9 are the sound-axis mistake (wrong-direction consonant/vowel judgment on an otherwise correctly-attempted article); item 4 is the known/new axis (definite "the" used for brand-new information). Right concept, wrong execution under a combined-judgment fill-in-blank format — confirmed by the same-day repair loop, which isolated each axis and scored 4/5 (80%).
- **Context.** lesson U01 SES-001, part 3 graded check (work/sets/2026-09-12_u01-check.json), items 2, 3, 4, 9.
