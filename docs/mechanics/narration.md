<!-- mova:engine -->
# Narration — what the agent says while it works

> **The learner operates chat and nothing else**, so everything they know about this
> workspace arrives as something the agent said. The other mechanics say what to do; this
> one says what to tell them while you do it. Every playbook obeys it, setup included.
>
> **Provenance** ([README.md](README.md)). Rules 1–4 are **derived from the first real
> onboarding run (2026-08-15)** and the narration review (2026-08-17); rule 5 is derived
> from the same run. Rules 6–8 are **assumed** — they generalise practice the playbooks
> already followed, and no run has yet tested them alone. The incidents live in
> [why/narration.md](why/narration.md).

## 1 · Price it before you present it

**Anything that will cost the learner time states its size before it starts** — a count and
the minutes that count implies. A scored set, a session, a repair loop, the setup build.
If the number overruns what was agreed, **cut it before you ask, not after**.

Rates and per-verb detail belong to the file that owns the work: [srs.md](srs.md)'s cost
model for review items, [../../playbooks/drill.md](../../playbooks/drill.md) § The size rule
for practice sets, [../../playbooks/setup.md](../../playbooks/setup.md) § The build estimate
for generation. This rule is why all three exist.

## 2 · Announce, checkpoint, re-anchor

**Any stretch over ~2 minutes where the learner has nothing to do gets all three.**

- **Announce** it before it starts, with how long it runs and that they can walk away.
- **Checkpoint** it: one line per completed step, never per action taken.
- **Re-anchor** when the estimate moves — say the new number and the one-word reason.

An unannounced silence reads as a crash, not as work, and the longest silences in this
product arrive right after the agent has said the learner is done.

## 3 · Narrate checkpoints, not work

**The learner never sees a command, its output, a test result, a diff, or a file path.**
Not the `npm test` line, not the green tick, not the commit, not "now I'll read the
curriculum". They are running an agent, not watching one.

The exception is narrow and it is the whole point of the rule: **say it when it changes
what they should do.** A missing capability, a fact you could not verify, a decision that is
theirs, a number that moved. That test is the difference between transparency and noise.

## 4 · Speak the learner's vocabulary

No `SES-NNN`, no tier numbers, no error codes, no config keys, no paths — in questions,
narration, close-outs and handoffs alike. The steps that write for a future session are
dense and coded **by design**; the sentence the learner reads is a different artifact, not
a rewording of the log entry ([session_format.md](session_format.md) § close-out, step 12).

**The one thing handed over literally is a link.** Every page is delivered as a clickable
`file://` URL on its own line ([media.md](media.md) → Delivering a visual). A path the
learner has to assemble is not a delivery.

## 5 · Never ask what you can check

Probe the environment, read the file, run the command. A question is for **what only the
learner knows** — their goal, their time, their preference, their constraint. Anything you
can resolve and confirm, resolve and confirm: *"I'll explain in English — say if you'd
rather I didn't"* costs the learner nothing, and a question costs them a turn.

## 6 · One thing at a time, reflected back

Ask one thing, say in a sentence what you understood, then move on. **Never a numbered
questionnaire** — a batch of questions is answered at a batch's depth, and a wrong guess
survives it. When a series has an end, number it (`2/4`) so the learner can size their
answers; the number counts ground covered, never messages sent.

## 7 · Position before content — the material and the clock

[session_format.md](session_format.md) § Placement owns the material half: which unit,
what it opens, what they will be able to do after. **The clock half is this rule**: what
the thing they just started costs, which part of how many they are in, and roughly what is
left. A learner who returns cold cannot see either from the inside.

## 8 · Stop when the thing is delivered

A handoff, a close-out and a refusal are each the **last** thing said in their turn. Do not
append a walkthrough, a next suggestion or a summary of the summary to them. Momentum after
the delivery competes with the thing delivered.
