<!-- mova:engine -->
# SRS — spaced repetition over the state/ ledgers

> Facts in the ledger, due-ness derived by script. No stored due dates → nothing to drift.
>
> **Provenance** ([README.md](README.md)). The *structure* here — the tier ladder, the
> review-mode-by-tier split, tier 0, the promotion gate, once-per-day movement — is engine,
> derived from the limba incidents cited inline. Every *number* — the 0/3/7/21/60 rungs, the
> cap of 55, the cost-model constants — is **default (measured on limba's learner —
> recalibrate)**: real arithmetic and real measurement, taken on one learner, not on this
> one. Treat each as a starting point; the review playbook re-fits the ladder once ~10
> sessions of this learner's own data exist. Romanian examples throughout are limba's, the
> reference implementation.

> **Rules live here; the story lives in [why/srs.md](why/srs.md).** This file is what a
> session reads before it teaches. The incidents, audits and measurements that bought
> each rule moved to `why/` — a retro reads both, a lesson reads only this one. New
> provenance goes to `why/`, never back into this file.

## Ledgers

Two markdown tables: [../../state/vocab.md](../../state/vocab.md) (`V-NNNN`) and
[../../state/grammar.md](../../state/grammar.md) (`G-NNNN`). Exactly 8 columns:

```
| id | target | translation | tier | added | last | topic | notes |
```

- **id** — `V-` or `G-` + 4 digits, unique, monotonically assigned, never reused.
- **target** — the target-language item. Vocab: dictionary form + essentials in parentheses —
  in limba's pack, nouns with gender and plural `prieten (m, prieteni)`, verbs with governed
  case/preposition `a mulțumi (+ dat.)`. Grammar: a short name of the pattern + micro-example.
- **Every vocab row must say what kind of word it is** — enforced by `state/ledgers.test.ts`,
  read by `scripts/pos.mjs`, which is how the deck types, filters and draws each row.
  **The pack declares the tag grammar** (`packs/<code>/pos-tables.mjs`): which labels are
  genders, which leading markers mean verb, and the closed tag list for the function words.
  Most rows say it without a tag — in limba's pack a gender means noun, a leading `a ` means
  verb, and anything with a space and no parenthetical is a phrase; the residue (bare
  function words, which look exactly like one-word phrases) takes a tag in the first slot of
  the same parenthetical (limba, 2026-08-10, added with the deck's type filter). The tag sits
  inside the parenthetical on purpose: every reader — the dedupe key, the audio cache key,
  the hub's chips — already cuts the cell at `" ("`, so nothing else moves.
- **Rows carry the pack's declared required fact in `notes` — required, not optional.** The
  pack names it in `pack.md` (`required_fact:`; blank means the pack declares none). The
  pattern it encodes: some word class has one fact that is not derivable from the citation
  form, is needed for every single production, and is free to store — Romanian's is the
  verb's `eu`-form (conjugation class is to a verb what gender is to a noun). limba's schema
  anticipated verbs needing an extra fact and picked the wrong one (governed case). The cost
  was measured: limba SES-007 scored **4/4** on the two verbs ever taught as full paradigms
  and **0/4** on three stored as bare infinitives — a missing fact, logged twice as a memory
  failure. limba writes it as `eu locuiesc (-i class, -esc- infix)`; `state/ledgers.test.ts`
  enforces its presence.
  **Full diacritics, NFC-normalized** (macOS paste often produces NFD — the ledger test
  rejects duplicates that differ only in normalization).
- **translation** — the meta-language gloss (profile `meta_language`); the learner's other
  held languages appear only inside notes.
- **tier** — 1–4 (below).
- **added / last** — ISO dates (`YYYY-MM-DD`); `added ≤ last ≤ today`.
- **topic** — one `T-NNNN` aspect id from [../reference/topics.md](../reference/topics.md),
  required, enforced by `state/ledgers.test.ts`. Added in limba, 2026-08-09. Before it the
  ledgers could say how solid an item was but not what system it belonged to, so nothing
  could tell *"the noun system was taught"* from *"the noun system is known"* — the first is
  topics.md's `status`, the second is the tier spread of the items filed under it.
  **Pick the aspect the item is scored under, not the one that will eventually repair it.**
  Those differ often and the difference is information: limba's *faci* is scored as a
  courtesy phrase, and its fix arrives with the present-tense paradigms two units later.
  topics.md already carries the second link through the aspect's own unit; this column must
  not duplicate it. An item may legitimately sit under a `pending` aspect — limba's `G-0003`
  was taught as a chunk long before reflexives opened, and `G-0002` was seeded at tier 0
  against a later unit's aspect. Both read correctly: material is running ahead of its system.
- **notes** — transfer hooks, false-friend flags, collocations, the required fact,
  verification trail ([verification.md](verification.md)). No `|` characters in any cell
  (breaks the table; test enforces).

## Tiers and intervals

All five intervals: **default (measured on limba's learner — recalibrate).**

| Tier | Meaning | Review interval | Review mode |
| --- | --- | --- | --- |
| 0 | Seeded, not yet taught | never — not due until its unit delivers it | not reviewed |
| 1 | New / shaky | every session (0 days) | **recognition only** (target→meta) — does the form→meaning link exist |
| 2 | Building | 3 days | **bare production** (meta→target) — the headword without its fact load |
| 3 | Solid | 7 days | **full package** (meta→target) — the headword plus every fact its row carries (limba's nouns: article + singular + plural) |
| 4 | Owned | 21 days | recognition sweep |
| 5 | Cold storage | 60 days | recognition sweep |

- **Due** when `today − last ≥ interval(tier)`. Computed by `scripts/queue.mjs`
  (**keep that script's interval table in sync with this one** — this file is canonical).
  A third copy lives in `state/ledgers.test.ts` (`validTiers`); all three move together.
- **Promotion**: clean recall during review → tier +1 (cap 5) and `last` = today.
- **Demotion**: miss or hesitant/partial recall → tier −1 (floor 1) and `last` = today.
- **No retirement.** Tier-5 items keep their 60-day cycle until the goal contract is met —
  goal-level vocabulary must stay warm, not archived.

### Tier 0 — seeded, not yet taught (limba, 2026-08-07)

- **Tier 0 is never due.** `queue.mjs` skips any tier absent from its interval table, so this
  needs no scheduling code — but say it out loud rather than relying on the accident.
- **Seed at tier 0**, not tier 1, whenever a row is entered ahead of the unit that teaches it.
- **The unit that teaches it promotes it to tier 1**, in the session that does the teaching —
  same close-out step as flipping topics.md.
- Anything in `state/` reads to a future session as **established knowledge**; that is exactly
  how limba's infinitive marker `a` came to be used for a week without ever being defined.
  Tier 0 is the marker that says otherwise.

### Review mode — why it is part of the schedule, not a style choice

**The promotion gate — the part that makes this safe.**

- **Two clean recognition passes promote a tier-1 item to tier 2**, and a session **may not
  hold an item at tier 1 on judgement**. Felt readiness is not a reason; the goal contract's
  clock is running, and a word cannot sit at tier 1 recognising itself indefinitely.
  ⚠️ **Nothing computes this gate — no ledger column holds the count.** Any workspace
  inheriting this ladder inherits the hole, so until something computes it: **a session that
  runs a clean tier-1 recognition pass writes `clean recognition pass 1 of 2` into `notes`**,
  in that exact wording, and a session that finds two markers **promotes without re-deriving
  anything**. Without the convention every session reinvents the bookkeeping, and the tier
  silts up — 41% of limba's ledger was sitting at tier 1 when this was written.
- **Tier 3 is a gate, not a sweep.** The full goal-shaped question — the item with every fact
  its row carries — is asked at tier 3 and must be passed to reach tier 4. Nothing becomes
  "owned" without producing it whole at least once.
- Tiers 4 and 5 stay recognition sweeps. Once an item has cleared the tier-3 gate it needs to
  stay warm, not be re-proved.

**On a tier-3 miss, find out which half failed before demoting.** Run the form probe from
[session_format.md](session_format.md) — supply the base form, ask only the inflected one. A
word the learner cannot retrieve and a rule they cannot run have opposite repairs, and the
combined question cannot tell them apart. Demote the ledger row only when **retrieval**
failed; a form failure is an error-log finding about the rule, not evidence against the word.

### What a review block costs — the model the hub and the size rule read (limba, 2026-08-12)

Every constant in this section: **default (measured on limba's learner — recalibrate).**

**Cost model (provisional):** recognition ~3 s per item, bare production ~10 s per item, the
full package ~20 s per item, plus ~6 minutes fixed per block. A lesson gives its review block
10 minutes.

`scripts/hub.mjs` parses those five numbers out of the paragraph above and throws if it cannot
find them — the arithmetic behind *"is today's queue still part of a lesson, or is it the whole
session"* is stated once, here, and never re-declared in code.

**The 6 minutes has now been re-fitted once, and it held (limba, 2026-08-15).** Solving
`T = a·blocks + 10 s·production + 3 s·recognition` against the three limba drills that carry a
recorded duration gives `a` = **5.7′**, **5.5′** and **15.4′**. Two independent sessions land
within 30 seconds of the assumed 6, so **the number does not move** — what changed is its
provenance, from assumed to measured, and the outlier now has a named mechanism.

- **Estimate with `a` = 6 minutes for a routine block.**
- **A session that expects to *discover* something should budget roughly triple.** The 15.4′
  outlier spent its time outside the block loop entirely: it opened two taxonomy codes, ran a
  mid-session dictionary check, and withdrew a broken item. That is diagnosis, which is the
  point of such a session rather than an overrun.

⚠️ **The fit rests on three points, all drills, all one learner.** No lesson has been fitted —
a lesson's teaching time sits outside this model entirely. The close-out captures a wall-clock
duration per session ([session_format.md](session_format.md)) precisely so the review playbook
can re-fit these constants against **this** instance's own record. Until an instance has its
own points, treat any estimate the hub prints as an order of magnitude, not a promise.

### "Due" when the row was already reviewed today (limba, 2026-08-12)

- **A row moves tier at most once per calendar day.** The first session of the day owns the
  measurement; later sessions cannot promote or demote what it already scored.
- **A second or later session on the same day runs its SRS block as re-exposure**: declared as
  such, no score, no tier movement, no retention claim, reported as a pattern instead of a
  number. The calibration band does not apply to it.
- `scripts/queue.mjs --counts` prints **`reviewed today`** alongside `due`, so a session sees
  the floor without computing it.
- **This keeps the interval data usable.** The rungs above are limba's learner's, not this
  one's, and re-fitting them needs clean recall data. A row looked at three times in one day
  and once more at its nominal interval would pollute exactly that dataset, so the log must
  say which look was a re-exposure.

### Carrier words — testing a rule with vocabulary the learner does not have (limba, 2026-08-12)

- **A carrier word is declared a carrier** when the set is posed, and carries its translation
  like any first appearance.
- **A carrier word does not enter the ledger.** It was used, not taught — no row, no tier, no
  due date. Writing it in would create exactly the half-formed entry the instance's
  lexical-gap error code describes (limba: `LEX-GAP`).
- If a carrier turns out to be worth keeping, the learner says so and the vocab playbook
  captures it deliberately, as a normal first exposure.
- The answer-leak rules cannot reach a carrier set (there is nothing to leak — the words are
  unknown), and the repair-vs-new-material line is about pending *systems*, not unfamiliar
  *vocabulary*. Both are why this needed saying explicitly.

### What "production" means for an item ahead of its unit (limba SES-007 / 2026-08-05)

A ledger row can enter at tier 1 — and climb into the production rungs above — long before
the grammar that inflects it is taught. Verbs were limba's acute case: *a locui*, *a lucra*,
*a vorbi* sat at tier 1 from the first units while
[../reference/topics.md](../reference/topics.md) scheduled the present tense four units out.
SES-007 read "production" as *the paradigm* and tested six forms the curriculum had never
delivered, scoring the learner against untaught material.

**Rule: production is bounded by the topic map.** For an item whose inflection is still
`pending` in topics.md, production means **the dictionary form and its meaning**, plus any
fixed chunk explicitly taught. Nothing else is scoreable, and nothing else may be marked as
an error. Check topics.md before scoring a form, not after.

The same trap exists for any inflecting class ahead of its unit — limba hit it again with
noun plurals, and with a taught address chunk whose prepositions were three units out: the
chunk is fair, the system is not.

### Why tier 5 exists (limba, 2026-08-03 recalibration)

## Capture and dedupe

- New items enter at tier 1 with `added = last = today`, via the lesson playbook (taught
  vocabulary) or the vocab playbook (ad-hoc capture). Their facts get verified at capture per
  [verification.md](verification.md).
- Before appending: NFC-normalize, then grep the ledger for the bare headword (without the
  parenthetical). A hit = duplicate → update the existing row's notes instead of adding.

## Queue discipline

- Session start: run `node scripts/queue.mjs` (or `--counts` for the summary line).
- The script caps output at 55 rows (oldest `last` first) — **default (measured on limba's
  learner — recalibrate)**. A backlog after a break gets eaten over several sessions, not in
  one crushing review. limba raised it from 40 on 2026-08-03, paired with the review-mode
  split above; raising it without that split would simply make the block longer.
- Playbooks never read whole ledgers into a session; they work from the queue output and
  edit only the rows they touched.
