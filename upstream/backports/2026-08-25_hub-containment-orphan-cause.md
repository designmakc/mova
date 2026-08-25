<!-- mova:engine -->
# The hub-containment failure has two causes, and the message names one

**Owed to limba.** Found porting PORT-029 into mova 0.18.0. The check itself is right and
mova took it as-is; what follows is about the sentence a session reads when it goes red.

## What is there

`docs/visuals.index.test.ts`'s new check fails when a file the index links to is absent from
`work/visuals/index.html`, and tells the session:

> Run `node scripts/hub.mjs` and commit the result.

That is the correct remedy for the incident the check was written from — a page indexed and
never followed by a regeneration.

## The second way a page goes missing from the board

PORT-028 gave the hub an orphan report: a visual whose `Units` cell names neither `U00` nor a
unit the curriculum defines **renders nowhere**, and the generator says so on stdout instead of
rendering it. That page is indexed, absent from the board, and no amount of regenerating will
put it there.

So a session that hits the new check with a mis-filed `Units` cell is told to run a command,
runs it, watches the test stay red, and runs it again. The generator has already printed the
real cause, one line above the summary — but the failing test is what the session is reading,
and it is pointing somewhere else.

This is not a rare shape. The two changes ship a fortnight apart and interact directly: the
orphan report exists precisely because such a page looks filed while rendering nowhere, which
is the same symptom the containment check now catches. The check is the first thing that turns
that symptom into a red build, so it is also the first thing that has to explain it.

## Where it lands in limba

- `docs/visuals.index.test.ts` — the message on the new containment check.
- Possibly `docs/mechanics/media.md` → "Delivering a visual", step 4, if the two-cause split is
  worth stating in the rule as well as in the failure.

## What mova did, and what is left open

mova's message names both branches in one sentence: the board is stale, **or** the row's
`Units` cell names no unit the curriculum defines and no `U00`, in which case the generator
renders the page nowhere and says so on stdout — fix the cell, then regenerate.

Two things are deliberately not decided here.

**Whether the message is the right place at all.** The alternative is for the check to
distinguish the causes itself — read the curriculum, classify each absent page, and report the
mis-filed ones separately from the merely stale ones. That is a better failure and a worse
test: it would make a containment check depend on the curriculum parser, and the reason this
check is trustworthy is that it depends on almost nothing. mova took the cheap half. limba may
judge the precise version worth its cost, and limba's curriculum is always present, which is
the condition that makes the expensive version viable there and not here.

**Whether an orphan should fail CI on its own.** Today it is a stdout line the reader can miss
entirely, and the containment check catches it only as a side effect of a rule about staleness.
A dedicated check would say the true thing directly. mova has not written one, in either repo's
name; the question belongs with whoever owns the orphan report.
