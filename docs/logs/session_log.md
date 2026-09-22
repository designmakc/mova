<!-- mova:instance -->
# Session log

> One entry per session, newest first. Format: date + `SES-NNN` heading; body lines
> **Type / Covered / SRS / Errors / Next**. Conventions: [README.md](README.md).
> Append via `node scripts/log-append.mjs session --file <body>` — the script assigns
> the ID under a lock.

## 2026-09-13 — SES-002

- **Type.** lesson — continuing U01, no new material (SRS + targeted repair + applied practice only).
- **Covered.** SRS reinforcement of G-0001, G-0002 (both `covered` since SES-001). Two repair sub-points folded under existing topics, no new T-numbers (topics.md's unit-level granularity): "X of Y" possession under T-0004; silent-h a/an exception under T-0001's named scope. T-0004 confirmed `covered 2026-09-12`, unchanged. **T-0001 stays `pending`** — today's silent-h bit was a reactive patch, not T-0001's structured overview run through teaching.md's eight beats; flipping it now would overclaim, against the closing prompt's lean.
- **SRS.** 15/15 vocab (recognition, clean) · 2/2 grammar rows, production mode, held at tier 1 — see state/grammar.md for the promotion-gate ambiguity (srs.md's "two clean passes" gate is written for vocab's recognition mode; grammar's production mode has no defined analogue, so neither row was promoted, including G-0002's clean word-order run).
- **Score.** grammar — no graded check today. <!-- no-graded-check: SRS/repair/practice-only session, no part 2/3 --> vocabulary none.
- **Errors.** ERR-004 (ART-MISS), ERR-005 (VRB-AUX, new code added to error_taxonomy.md), ERR-006 (PREP, omission case flagged as a taxonomy gap), ERR-007 (SPELL-MEM, observed only, not taught-material — same convention as ERR-003).
- **Applied practice.** 4 free-production sentences, escalating: last one clean, combining silent-h + continuous aux + "of" pattern first-try.
- **Duration.** not recorded — reported-after-the-fact close-out, no live wall-clock capture.
- **Curriculum.** U01 → `covered 2026-09-13`. Across SES-001/002 the learner repeats correct articles once corrected, has internalized "of", and produced one clean sentence combining articles + "of" + silent-h. Meets U01's can-do, scored on T-0004/T-0022 (both `covered`) — not on T-0001, which stays pending as a carried-forward gap, not swept under the close.
- **Next.** Open U02 (present tense, 3sg -s — ERR-003's predicted risk is now live). Give T-0001 a real structured lesson rather than counting today's patch. Watch ERR-007 (future/feature) recurring at U11.
- **Open questions.** none.

## 2026-09-12 — SES-001

<!-- long-entry: first taught session — the 40% vs 80% split and the U01 close/no-close call both need the full reasoning on the record. -->
- **Type.** lesson
- **Covered.** U01: a/an/the two-step (T-0004, full teaching); basic SVO (T-0022, full teaching); 15 core product-design nouns (design, interface, layout, component, feature, project, team, button, screen, user, product, tool, system, page, element) — all V-0001..V-0015, tier 1, unverified (`?`, null dictionary adapter). T-0001 (sound-to-spelling overview) was named/framed only, not drilled — left `pending`, first contact.
- **SRS.** skipped — nothing due (first taught session; ledgers were empty before today).
- **Duration.** not recorded — this entry is a close-out of a session reported after the fact, with no wall-clock capture taken live.
- **Score.** grammar 4/10 = 40% · vocabulary none. Repair-loop retest (same-day, post-key, new items, cannot promote): known/new axis 2/2, sound axis 2/3 — 4/5 = 80%.
- **Repair loop.** One cycle, cleared. Diagnosis: the graded-check misses (items 2,3,4,9,10 — see ERR-001, ERR-002) clustered around running both article judgments (known/new AND sound) at once under a cold fill-in-blank format, not a failure of either judgment alone. Split retest isolating each judgment scored 80% combined, so the 40% is read as first-exposure/format noise, not a conceptual gap in the two-step system. Genuine gap found: the silent-h exception ("an hour") was missed 1/1 — a first-contact hole outside today's teaching, not a repair-loop failure; see Next.
- **Applied practice.** Free-writing sample: "The team build a screen fora design system." Marked live: "The team" (known referent, correct), "a screen" (new/consonant, correct), "a design system" (new/consonant, correct once the "fora"/"for a" spacing typo is separated out), "build" → should be "builds" (VRB-3SG, U02 material, not yet taught — logged as an observed-not-taught data point, ERR-003, confirming the placement snapshot's predicted VRB-3SG risk). Model given: "The team builds a screen for a design system."
- **Errors.** ERR-001 (ART-CHOICE ×4, items 2/3/4/9), ERR-002 (ART-CHOICE ×1, item 10), ERR-003 (VRB-3SG ×1, observed pre-instruction).
- **Curriculum.** U01 stays `pending`. Its can-do asks for an article "more often than not" across produced sentences; today gives exactly one applied-practice sentence, and T-0001 (part of U01's own grammar list) is only first-contact, not covered. One sample is not enough evidence for the can-do, and topics.md itself isn't fully covered — closing the unit now would overclaim both. U01 needs at least one more session with more applied-practice volume, and a decision on whether T-0001 needs real teaching or can close on framing alone.
- **Next.** Give the silent-h a/an exception ("an hour") explicit teaching — it was the one genuine first-contact gap the repair loop surfaced. Run more U01 applied-practice sentences to get real can-do evidence before deciding whether U01 closes or needs another session; decide T-0001's fate (teach in full vs. accept as framing-only) at that same session. Watch for VRB-3SG recurring once U02 opens — ERR-003 is a leading indicator, not yet a taught-material error.
- **Open questions.** none.
