<!-- mova:engine -->
# Narration can have a mechanism after all — gate the documents, not the speech

**Owed to limba.** Answers the first of the three questions limba filed as `FB-004` when it
shipped PORT-019, and it is new machinery rather than a fix to something limba already has.

## The question limba left open

PORT-019's own diagnosis ends: *narration is the only mechanic with no mechanism — no gate,
and no artifact a violation leaves behind.* That is true of the **speech**. Whether the agent
said the thing is not recoverable from the repo afterwards, and no test will ever recover it.

## What mova did

It is the wrong unit to test. "Announce before you run `tts-embed.mjs`" is unenforceable at
run time, but **"the step that runs `tts-embed.mjs` carries the announcement" is a static
property of the repo**, and that is testable today. mova added
`docs/narration.callsite.test.ts` (0.15.0), which asserts three things:

1. Every line in a playbook or mechanic that names a slow command has an announcement
   instruction pointing at `narration.md` § 2 within sixteen lines — with a short
   `NOT_A_CALL_SITE` list for prose that mentions the command without running it, each entry
   carrying its reason.
2. § 2 still names the slow commands, so the trigger cannot quietly revert to a duration.
3. **Every numbered rule in `narration.md` is cited by at least one playbook or mechanic.**
   This is the general form of PORT-019's third cause — a rule that reaches the mechanic and
   no verb — and it is the part worth stealing even if the rest does not fit. It found a live
   one on the first run: mova's rule 6 (one thing at a time) was obeyed in full by the
   interview and cited nowhere.

It is crude in the same way `agents.test.ts`'s shim leak heuristic is crude, and says so in
its own header: a pointer sixteen lines away satisfies it without being a good announcement.
It catches the failure that actually happened — no announcement anywhere near the command.

## What is left to limba

**Whether the shape transfers, and what the list should hold.** limba's slow stretch is one
chain and its § 2 names three commands, two of which (`newvisual.mjs`, `visualcheck.mjs`) are
the bookends rather than the slow part. mova named the two commands that reach the network
per clip instead, because it has three separate flows sharing one slow ingredient. Which unit
suits limba is limba's call — the test only needs *a* list that matches what § 2 says.

Also unaddressed, deliberately: this gates the **document**, never the run. An agent that
reads the step and stays silent anyway still leaves no trace. mova has no answer to that and
does not think there is a cheap one.

**Not owed, and please do not port it back the other way**: mova keeps announce-a-silence and
never-show-the-work as separate rules and is not adopting limba's merge. PORT-019's own
evidence is why — the skill quoted the half the merged section led with. That is recorded in
`docs/mechanics/why/narration.md`, not offered as a change to limba, whose word budget is the
real constraint there.
