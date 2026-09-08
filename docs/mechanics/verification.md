<!-- mova:engine -->
# Verification — no language fact enters the record on the agent's word alone

> Every language fact the workspace writes down is **dictionary-verified**,
> **tutor-confirmed**, or **visibly marked unverified**. Confidence is not a source. This is
> AGENTS.md hard invariant 6; the story is in
> [why/verification.md](why/verification.md). **Provenance**: *assumed* at scaffold; § Marking
> time, § A dispute and the door line are **derived from the first completed study session
> (2026-08-24)**.

## The policy

Every language fact written into a ledger row, a visual or a marked sheet — a gender, a
plural, a conjugation, the pack's required fact, a meaning, **a mark that calls the learner's
answer wrong or half-right** — is in exactly one of three states:

1. **Dictionary-verified.** Attested via the dictionary adapter
   (`scripts/dictionary.mjs`; the pack supplies the implementation, e.g.
   `packs/ro/dictionary.mjs` → dexonline). The adapter names its source, and the source is
   recorded with the fact.
2. **Tutor-confirmed.** A human who has the language — the tuition scenario's tutor —
   confirmed it. Recorded like a dictionary source: who and when.
3. **Unverified.** Neither of the above happened. The fact carries the marker below, and the
   learner can see it is a claim, not a datum.

There is no fourth state. "The agent is sure" is state 3.

Interference claims ride along: every correction that names an interference source
([session_format.md](session_format.md) → Correction policy) is a claim about the learner's
held languages and follows the same three states — transfer.md's `(assumed)` convention is
this policy applied to that file.

## The marker — a `?` suffix inside the existing cell, never a ninth column

An unverified fact takes a `?` immediately after it, inside the cell that carries it:

```
| V-0107 | perete (m, pereți?) | wall | 1 | … |
```

reads "noun, masculine attested, plural *pereți* unverified". A wholly unverified entry
suffixes the parenthetical itself: `borcan (n, borcane)?`.

**The marker lives inside cells the schema already has** — a ninth column would strand every
deployed ledger ([why/verification.md](why/verification.md)) — and every ledger reader either
ignores it or (like `factcheck.mjs`) looks for it deliberately. The same marker works in a
visual: the `?` sits on the printed form, and the page's conventions
([../visual/SPEC.md](../visual/SPEC.md)) style it visibly — **an unverified fact the learner
cannot see is state 3 in the ledger and state 4 in reality.**

On a page the markup is named: `span.unv` carries the `?` on the form, and a `.src` note
carries the page's source trail (attested via the pack's adapter, tutor-confirmed, or the
banner saying this pack has no dictionary and every fact is a claim). `scripts/visualcheck.mjs`
fails a page that asserts language facts and carries neither.

**On a marked sheet** the `?` follows the glyph — `❌?`, `🟡?` — on every mark nothing
attested, and a `Source:` line at the foot says what attested the rest and when, or that the
marks are the agent's word. `work/sets/marked.test.ts` fails a sheet that scores something
wrong and carries neither.

**Promotion is explicit.** Unverified → verified means: remove the `?`, and append the trail
to `notes` — source + date (`pl. verified dexonline 2026-08-13`, or
`tutor-confirmed 2026-08-15`). A fact whose `?` disappears with no trail was not verified; it
was tidied. Demotion is the same move in reverse: a tutor or the adapter contradicting a
stored fact corrects the cell *and* leaves the trail saying what changed and on whose word.

## When checks run

- **Capture time** (vocab playbook, lesson close-out): every new row's facts are checked
  against the adapter *before the row is appended*. A confirming lookup writes the row clean
  with its trail; a miss or a contradiction is resolved now or written with `?`. A lookup
  failure never blocks capture — an unverified row today beats a lost word.
- **Teach time** (teaching.md): the `complete` label and every absolute are checked against
  the adapter before they ship — the authoring-time half of this policy.
- **Marking time** (every scored set, the placement included): a ❌ or 🟡 on what a word
  means or what form it takes goes through the adapter before the sheet is published. **What
  no adapter can check** — what a clause means, which reading a form allows — is the agent's
  reading: it wears `?`, and the sheet's last sentence invites the learner to dispute any `?`
  mark. A `?` mark counts in the score until it is disputed; it is not a soft ✅.
- **Batch time**: `scripts/factcheck.mjs` sweeps the ledgers against the adapter — new `?`
  marks to chase, stored facts the source now contradicts, trails that name no source — and
  feeds the hub's **confidence panel**, so the learner sees one number for how much of their
  ledger is attested and how much is the agent's word.

## A dispute is a check, not a concession

When the learner contradicts a mark or a taught claim:

1. **Say that you will check, then check** — the adapter for a word; the pack's tables and
   notes and [../reference/resources.md](../reference/resources.md) for a grammar claim. The
   first sentence back names the check, never the verdict: *"you were right"* before a source
   is read is a reversal, and after one the learner cannot trust the next mark either way.
2. **Report what the check found and where, then re-score.** A changed mark gets its trail —
   source and date — like a promoted ledger row; a changed claim runs
   [teaching.md](teaching.md)'s artifact sweep in the same session.
3. **Nothing could check it** — keep the `?`, put both readings in the sheet's Why cell,
   report the item as *disputed* in the score line, and add it to the `?` list tutor-prep
   carries. The learner's confidence is not a source either.

An agent that yields to pushback cannot tell a right learner from a wrong one.

## The null adapter — honest, never silent

A pack without a dictionary (`dictionary:` blank → the null adapter in
`scripts/dictionary.mjs`) makes state 1 unreachable: every fact is tutor-confirmed or marked
`?`. That is legal and must be *loud* — the hub's confidence panel says the instance runs
unattested, and `factcheck.mjs` reports "cannot verify". What a null-adapter instance may never do is drop the markers because "nothing checks
them anyway" — there, the marker is the only safety left.

**And the session says so at the door** — one line in the opener: every fact today is the
agent's word until a tutor confirms it ([session_format.md](session_format.md) § Placement).
A banner on a page opened later is not that line.

## The tutor loop — spot-checks flow back through the feedback intake

The tuition scenario gives the workspace its state-2 source, and the channel is the retro
intake (`work/feedback/`), which is already multi-writer safe:

- A session prepping a tutor visit (tutor-prep playbook) includes the current `?` list —
  the tutor can clear it in bulk.
- What the tutor confirms or corrects comes back as a feedback entry naming the rows; the
  next session applies it: clear the markers, write the trails, fix what was wrong — and
  when a correction retires a taught claim, run teaching.md's artifact sweep in the same
  session.

## Input-method artifacts are not language errors

The pack's `normalize.mjs` owns the folding table for the learner's input-method look-alikes
([why/verification.md](why/verification.md)). The engine principle: **an artifact of how the
learner types is never an error in what the learner knows.** Fold before comparing — in
marking, dedupe, leak-checking, and verification alike. A folded match is a match; a
*missing* required character is still an error. The principle holds for every pack, including
one whose `normalize.mjs` folds nothing.

## Status

Enforced: pages by `scripts/visualcheck.mjs`, marked sheets by `work/sets/marked.test.ts`,
ledgers by `scripts/factcheck.mjs` and the hub's confidence panel. The marker discipline and
the capture-time checks are carried by the playbooks.
