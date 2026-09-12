<!-- mova:instance -->
# Topic map — what each grammar system is, and which units cover it

> [../curriculum.md](../curriculum.md) is **unit-first**: it answers "what happens in
> U04?". This file is **topic-first**: it answers "how much of the article system do I
> actually know, and where does the rest arrive?" — a question the curriculum cannot
> answer, because every real system is scattered across many units.
>
> **This file is the arbiter for repair-vs-new-material**: a session deciding whether an
> error means re-teaching checks here first — a `pending` aspect was never taught and is
> intake, not repair; a `covered` aspect that fails is repair and routes by the error
> tally. Every teaching block's placement statement ("this covers 2 of 7 aspects; the
> rest arrives in U08") is **derived from this file**, never improvised.
>
> Conventions, enforced by `docs/topics.test.ts`:
>
> - Every row: `| id | aspect | unit | exam | status |`; unit is exactly one `UNN` that
>   exists in the curriculum.
> - **`id` is `T-NNNN`, unique, monotonically assigned, never reused, never renumbered**
>   — the `state/` ledgers address aspects by it.
> - `status:` is `pending` or `covered YYYY-MM-DD` — flipped at close-out by the session
>   that taught it.
> - Exam letters: **R** Reading · **W** Writing · **L** Listening.
> - Every unit appears at least once.
>
> Unit assignments seeded `(assumed)` at setup, 2026-09-12 — re-sequencing at phase entry
> is expected; renumbering is forbidden. Systems drawn from `packs/en/notes.md` § Grammar
> system inventory, trimmed to what this functional goal's units actually reach (no
> speaking-related system — see goal.md § Non-goals).

## Sound & spelling system

English's low sound-to-spelling reliability is the direct target of this learner's stated
weak point (intake snapshot) — expect this system's aspects to carry unusually high
traffic in the error tally relative to a learner without that self-reported gap.

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0001 | Sound-to-spelling mismatch overview (why English spelling isn't phonemic the way Russian/Ukrainian mostly is) | U01 | R | pending |
| T-0002 | Common irregular spelling patterns (silent letters, doubled consonants) | U11 | W | pending |
| T-0003 | Homophones and near-homographs (e.g. resin/resign) | U11 | W | pending |

## The article system

No analogue in either held language (transfer.md § Morphology traps) — expect the densest
early error traffic here.

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0004 | Articles: a/an vs the (definiteness) | U01 | R W | covered 2026-09-12 |
| T-0005 | Zero article with plurals and uncountables | U03 | R | pending |
| T-0006 | Article use in technical documentation (generic reference) | U08 | R | pending |

## The noun system

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0007 | Regular plurals (-s / -es / -ies) | U02 | R W | pending |
| T-0008 | Irregular plurals (mouse/mice, analysis/analyses) | U03 | R | pending |
| T-0009 | Count vs mass nouns (advice, information) | U06 | R W | pending |

## The verb system

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0010 | Present simple and third-person -s | U02 | R W | pending |
| T-0011 | Past simple, regular -ed | U05 | W | pending |
| T-0012 | Irregular verb principal parts (packs/en's required_fact) | U05 | W | pending |
| T-0013 | Present perfect vs past simple — the aspect-mapping gap | U09 | W | pending |
| T-0014 | Present/past continuous (progressive -ing) | U09 | W | pending |

## Negation & question formation

No structural anchor in either held language (transfer.md § Syntax order) — this system is
pure pattern-drilling from nothing, not correcting an existing instinct.

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0015 | Do-support in negation | U07 | W | pending |
| T-0016 | Subject-auxiliary inversion in questions | U07 | W L | pending |

## Adjectives & comparison

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0017 | Regular comparison (-er / -est) | U03 | R | pending |
| T-0018 | Irregular comparison (good/better/best) | U03 | R | pending |
| T-0019 | Periphrastic more/most | U08 | R | pending |

## Prepositions

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0020 | Verb + preposition collocations (depends on, agrees with) | U06 | R W | pending |
| T-0021 | Common preposition confusions (different from/than) | U06 | W | pending |

## Word order & sentence structure

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0022 | Basic SVO sentence structure | U01 | R W | covered 2026-09-12 |
| T-0023 | Adverb placement | U07 | W | pending |

## Register

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0024 | Work-chat (Slack) register vs formal register | U04 | W | pending |
| T-0025 | Technical/UX-article register conventions | U08 | R | pending |

## Reading strategies

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0026 | Skimming for gist | U03 | R | pending |
| T-0027 | Scanning for specific facts in documentation | U08 | R | pending |
| T-0028 | Summarizing an article's main argument | U08 | R | pending |

## Writing practice & spelling drill

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0029 | Composing a clear 3-5 sentence Slack message | U04 | W | pending |
| T-0030 | Spelling recall from dictation/memory | U11 | W | pending |

## Listening (secondary strand)

Explicitly lower priority per the goal contract's own scenario ranking — one unit, not a
recurring strand.

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0031 | Extracting key points from a short spoken excerpt | U10 | L | pending |

## Consolidation & assessment

| ID | Aspect | Unit | Exam | Status |
| --- | --- | --- | --- | --- |
| T-0032 | Full scenario-run mock across reading, writing and listening | U12 | R W L | pending |
