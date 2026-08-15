<!-- mova:engine -->
# Verification — no language fact enters the record on the agent's word alone

> **Why this file exists.** The operator of a mova instance is typically learning the target
> language — which means they *cannot* check the agent's claims about it. limba's operator
> could and did: the incidents behind `teaching.md`'s completeness rules were all caught by a
> learner reading the material critically. A template cannot assume that safety, so this file
> replaces it with a mechanical one: every language fact the workspace writes down is
> **dictionary-verified**, **tutor-confirmed**, or **visibly marked unverified**. Confidence
> is not a source. This is AGENTS.md hard invariant 6; the rules in force are below.

## The policy

Every language fact written into a ledger row or a visual — a gender, a plural, a
conjugation, the pack's required fact, a meaning — is in exactly one of three states:

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
held languages and follows the same three states — transfer.md's own convention that every
claim is born `(assumed)` is this policy applied to that file.

## The marker — a `?` suffix inside the existing cell, never a ninth column

An unverified fact takes a `?` immediately after it, inside the cell that carries it:

```
| V-0107 | perete (m, pereți?) | wall | 1 | … |
```

reads "noun, masculine attested, plural *pereți* unverified". A wholly unverified entry
suffixes the parenthetical itself: `borcan (n, borcane)?`.

**The 8-column ledger shape is a sync-stability commitment.** Instances update from this
template for years; a ninth column would strand every deployed ledger at the first `/update`.
The marker therefore lives *inside* cells the schema already has, and every ledger reader
either ignores it or (like `factcheck.mjs`) looks for it deliberately. The same marker works
in a visual: the `?` sits on the printed form, and the page's conventions
([../visual/SPEC.md](../visual/SPEC.md)) style it visibly — **an unverified fact the learner
cannot see is state 3 in the ledger and state 4 in reality.**

On a page the markup is named: `span.unv` carries the `?` on the form, and a `.src` note
carries the page's source trail (attested via the pack's adapter, tutor-confirmed, or the
banner saying this pack has no dictionary and every fact is a claim). `scripts/visualcheck.mjs`
fails a page that asserts language facts and carries neither. (Two first-ever generated
lesson pages asserted ~60 and ~10 facts with no trail at all, 2026-08-15.)

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
  the adapter before they ship — the authoring-time half of this policy. limba's audit found
  the claims that failed were exactly the unchecked ones.
- **Batch time**: `scripts/factcheck.mjs` sweeps the ledgers against the adapter — new `?`
  marks to chase, stored facts the source now contradicts, trails that name no source — and
  feeds the hub's **confidence panel**, so the learner sees one number for how much of their
  ledger is attested and how much is the agent's word.

## The null adapter — honest, never silent

A pack without a dictionary (`dictionary:` blank → the null adapter in
`scripts/dictionary.mjs`) makes state 1 unreachable: every fact is tutor-confirmed or marked
`?`. That is legal and must be *loud* — the hub's confidence panel says the instance runs
unattested, and `factcheck.mjs` reports "cannot verify" rather than pretending to a clean
sweep. What a null-adapter instance may never do is drop the markers because "nothing checks
them anyway" — there, the marker is the only safety left.

## The tutor loop — spot-checks flow back through the feedback intake

The tuition scenario gives the workspace its state-2 source, and the channel is the retro
intake (`work/feedback/`), which is already multi-writer safe:

- A session prepping a tutor visit (tutor-prep playbook) includes the current `?` list —
  the tutor is the one person who can clear it in bulk, and a spot-check costs them minutes.
- What the tutor confirms or corrects comes back as a feedback entry naming the rows; the
  next session applies it: clear the markers, write the trails, fix what was wrong — and
  when a correction retires a taught claim, run teaching.md's artifact sweep in the same
  session.

## Input-method artifacts are not language errors

The pack's `normalize.mjs` owns the folding table for the learner's input-method look-alikes
(limba's case: `ǎ ş ţ` produced by a legacy keyboard layout for `ă ș ț`). The engine
principle: **an artifact of how the learner types is never an error in what the learner
knows.** Fold before comparing — in marking, dedupe, leak-checking, and verification alike.
A folded match is a match; a *missing* required character is still an error. Only the
folding table is the pack's; the principle holds for every pack, including one whose
`normalize.mjs` folds nothing.

## Status

The policy above is the rule the workspace runs from day one; the marker discipline and
capture-time checks are carried by the playbooks. Enforcement tooling — `factcheck.mjs` and
the hub's confidence panel — ships in Phase 2.
