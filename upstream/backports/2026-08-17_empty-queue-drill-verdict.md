<!-- mova:engine -->
# The verdict can name a drill that has nothing to run

**Owed to limba.** Found in mova 0.14.0 while verifying the PORT-018 panel against a seeded
instance — not in limba's own tree, but limba's `blockVerdict()` has the same shape and the
same gap.

## What happens

`blockVerdict()` picks the side of the week's mix that is further behind its share. When the
drill side is the one owed, it returns the drill — **without asking whether the queue has
anything in it.** With every due row already reviewed today, `unseen` is empty, and the panel
says *"Run drill — the queue is the whole session — repair only, no new material."* A drill
whose whole content is the queue is being recommended against an empty queue.

It is reachable on an ordinary day: a learner who did a drill this morning and comes back in
the evening has `unseen` empty and the mix unchanged. limba's own `queue.mjs` already declines
this case at orient ("all N due rows were reviewed today — the block does not run"), so the two
surfaces disagree about whether there is a session to run.

## The paths

- `scripts/hub.mjs` — `blockVerdict()`, the non-lesson return.
- `docs/mechanics/session_format.md` → *Which block to run* — signal 2 says the queue "breaks a
  tie only toward a drill" and is otherwise not a decider. That is the sentence in tension:
  the queue is not deciding here, but a drill without one has no content.

## What mova did, and what is left open

mova returns the lesson instead, with the reason stated in the verdict — *"2 drills short, but
nothing is due and a drill is only the queue"* — so the owed drill is still visible and the
learner is not sent to an empty block. **That is one answer, not necessarily limba's.** The
open question is whether the ranking rule should say this itself: a fourth clause under signal
2 (a drill needs a queue), or a precondition on the verdict, or something else that limba's own
record suggests. mova has no measured evidence either way, and the reference implementation is
where the sessions are.

Also unresolved and deliberately left alone: whether the *mix* should count a block that could
not run, which decides if the drill stays owed into next week or is written off.
