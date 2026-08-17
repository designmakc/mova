<!-- mova:engine -->
# Back-port statement — narration becomes a mechanic

**Direction:** mova 0.8.0 → limba. **Status:** shipped in mova, unshipped in limba.
**Kind:** `generic`.

This is **context, not an implementation.** Decide the shape on limba's own record; mova's
version is one answer, and limba has data mova does not.

## What mova changed, and why it matters here

mova gave `docs/mechanics/` a new noun: **narration.md** — the rules for what the agent
*says* while it works. Eight rules, 760 words, with the provenance in `why/narration.md`.

**Most of those rules were earned in limba and are still scattered across it.** That is the
argument for the file, and limba is where the scattering is worst:

| The rule | Where it lives in limba today |
| --- | --- |
| Price a set before you present it | `.claude/skills/limba-drill/SKILL.md` § The size rule — **owned by one verb** |
| Say it plainly; no codes, tiers or paths | `docs/mechanics/session_format.md` close-out step 12 |
| Hand a page over as something clickable | `docs/mechanics/media.md` |
| State position before content | `session_format.md` § Placement |
| Plain language at decision points | **the learner profile**, as a seeded bullet |

Five files and one piece of *instance* content, and no file owns the subject. The visible
cost of that: limba's own drill once ran a 56-slot diagnostic under a "10–15′" heading, and
the size rule that produced stayed inside the drill skill — so the same discipline never
reached the lesson's five parts, the mock, or any other block that costs the learner time.

**The rule that had never been written down anywhere** is mova's § 3: *never show the work.*
No commands, no output, no green ticks, no paths — say it only when it changes what the
learner should do. Every agent running this workspace is a coding agent whose default
register is the tool call, and the learner is not a developer. limba has no statement of
this at all.

## Where it would land in limba

- **New:** `docs/mechanics/narration.md` and `docs/mechanics/why/narration.md`.
- **`docs/mechanics/session_format.md`** — § Placement gains the clock half (see below);
  close-out step 12 becomes a pointer, and its `0.71× headroom` provenance moves to
  `why/narration.md`, which is where that incident actually belongs now.
- **`.claude/skills/limba-drill/SKILL.md`** — the size rule stays where the rates are, and
  cites the noun as the general case rather than owning it.
- **`.claude/skills/limba-lesson/SKILL.md`** — price the session at the door, adjusted for
  what is actually due.
- **`docs/reference/profile.md`** — the "plain language at the moments that matter" bullet
  becomes a pointer to the mechanic, and keeps a bullet only for a way *this* learner
  differs from the default.

## ⚠️ One thing that will fail CI immediately

limba's `docs/consequential.test.ts` **fails on any unbudgeted mechanics file** — *"A file
nobody budgeted is a file that grows unwatched."* mova's version only budgets a named list,
so mova could add the file and choose a ceiling afterwards; limba cannot. **Add
`narration.md` to `BUDGETS` in the same commit.** mova set 900 against 760 actual words, on
the reasoning that a file about not over-talking should not run long.

## The new rule, and the one genuinely open question

The only rule with no limba ancestor is **§ 7's clock half**. `session_format.md` has said
"state position before content" since the scaffold and has always meant position *in the
material* — which unit, what it opens. A learner inside a sixty-minute session is never told
which of the five parts they are in, or roughly what is left.

mova's answer: the session opener prices the verb, and each part opens with `part 3 of 5,
the graded check, about ten minutes`. It is marked **assumed** — mova has no run behind it.
The evidence that the *shape* works is the interview counter (`2/4`), which a real
onboarding run validated on the other side of the product.

**limba can do better than assume, and mova cannot.** limba's session log has carried a
wall-clock `duration` field since the SRS cost model was found unfittable — so limba holds
real numbers for what a lesson actually costs *this* learner, against boxes that were
scaffold guesses. Two questions worth deciding on that record rather than on mova's:

1. **Is "about an hour" the right thing to say**, or should the opener quote limba's own
   measured median instead of the mechanic's box? mova has no data and had to quote the box.
2. **Does a learner who has run twenty sessions still want the part counter?** The counter
   earned its place with a learner who could not see the shape of something new. limba's
   learner knows the five parts by heart, and the rule may be worth less there — or worth
   keeping only for the parts whose length actually varies.

## Do not port

- **The setup half of mova 0.8.0** — the interview restructure, the resume gate, the build
  estimate, the greeting and the handoff tour. limba has no setup verb; it *is* an instance.
- **The `feedback` verb (mova 0.9.0).** It carries a defect from an instance up to the
  template it was copied from. limba has nothing above it — limba is where the template came
  from, and this porting log is already its channel in the other direction.
- **The language packs and the shared Wiktionary adapter (0.10.0–0.12.0).** limba is
  Romanian and talks to dexonline directly.
