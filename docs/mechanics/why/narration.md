<!-- mova:engine -->
# Why — narration.md

> The provenance of [../narration.md](../narration.md): the incidents each rule was bought
> with. **A study session does not read this file.** `playbooks/retro.md` and the
> housekeeping pass read both, and new provenance is written here — not back into the rule
> file.
>
> The rule keeps its marker (*assumed* / *derived from …* / *measured*) where a session
> reads it; that tag is what tells a session whether it may question the rule. Only the
> story moves.

## Why narration is a noun at all

Until 2026-08-17 the rules for how the agent talks were spread across five files and one
**generated** one. The drill playbook owned "state the item count and the minutes it
implies"; the close-out ritual owned "say it plainly"; media owned the clickable link; the
setup playbook owned the two clocks; session_format owned "state position before content".
And `setup/templates/profile.template.md` carried *"plain language at the moments that
matter — decision questions and close-outs drop codes, tiers and file paths"* as a seeded
bullet in every instance's Operational profile, tagged "engine default; every learner so
far has wanted it" — an engine rule stored once per learner instead of once in the engine,
where no upstream change could ever reach it.

That is exactly the shape [README.md](../README.md) says a mechanic exists to prevent:
playbooks are verbs and stay thin, shared rules live once as nouns. Narration was a rule
every verb obeyed and no file owned. The scattering had a visible cost — the interview
counter fix of 0.5.0 was never applied to the generation phase or to the session, because
nothing connected them as one problem.

## Rule 1 — price it before you present it

**Derived from limba's drill (2026-08).** A drill under a "10–15′" heading ran a 56-slot
diagnostic, a 46-slot retest and 16 further items, and nothing in the flow noticed until
close-out. The size rule that produced went into `playbooks/drill.md` and stayed there,
so the same discipline never reached the lesson's five parts, the mock, or the setup build
— the longest unpriced stretch in the product.

## Rules 2 and 3 — the silence, and what fills it

**Derived from the first real onboarding run (2026-08-15).** Generation ran 5–15 minutes
with no warning after a turn-by-turn interview; the learner read the pause as a hang. 0.5.0
fixed the *announcement* and stopped there: the nine generation steps, each with its own
validation gate and commit, still passed in silence, and the estimate that opened the
silence was a single fixed figure for a build whose length varies with the pack, the
toolchain, the goal kind and the focus mode.

Rule 3's prohibition is the other half, and it had never been written anywhere. Every agent
running this workspace is a coding agent whose default register is the tool call — the
command, the output, the tick. The learner here is not a developer, and setup's own promise
is that they answer questions and nothing else. A stream of green ticks is not
transparency about that promise; it is the evidence that the promise is being kept, shown
to someone who was told they would not have to look.

## Rule 4 — the learner's vocabulary

**Derived from limba, 2026-08-03**: a close-out summary quoted "0.71× headroom" and the
learner asked twice for plain language. The rule already lived in the close-out ritual as
step 12 and in the generated profile as a bullet; what it lacked was a home that questions,
handoffs and refusals also read.

## Rule 5 — never ask what you can check

**Derived from the first real onboarding run (2026-08-15).** The update path asked the
learner to produce the template's URL — a URL the setup agent had had in hand all along in
`git remote get-url origin`. The environment probe had already been written as *run, don't
ask* for the same reason; nothing generalised it. The interview then kept asking two things
it could resolve: the explanation language (the learner had already opened in it) and the
focus mode (four apparatus shapes, offered to someone who had not yet seen the apparatus,
in an interview whose own goal topic implies the answer in most cases).

## Rules 6, 7 and 8 — assumed

**Rule 6** generalises the interview's conduct section, whose counter is the one narration
fix with a real run behind it. **Rule 7's clock half** was proposed in the same review that
produced this file: `session_format.md` § Placement had always meant position *in the
material*, and a learner inside a 60-minute session was never told which of five parts they
were in — the identical complaint the interview counter had already answered on the other
side of the product. **Rule 8** generalises the setup handoff's closing instruction ("then
stop — the first session belongs to the starting verb, not to setup's momentum") to
close-outs and refusals. None of the three has been tested on its own; they are marked
assumed and the first instance to run them is the evidence.

## Rules 1 and 7, corrected by limba the day they shipped

**Derived from limba, 2026-08-17 — the same day mova shipped both rules.** mova sent the
narration mechanic upstream as a back-port statement; limba took it as PORT-016 and answered
both of its open questions **narrower**, on data mova does not have.

**Rule 1 — the count, not the duration.** mova's version said a block states "a count and
the minutes that count implies", and its own § 7 told the lesson opener to say "about an
hour". limba checked its session log, which has carried wall-clock durations since the SRS
cost model was found unfittable: **its two recorded minute forecasts missed by roughly 2×
over and 5× under, while the item counts were close.** So limba's opener states a count and
the agreed budget and predicts no duration at all. A number a learner plans their evening
around, wrong by 5×, costs more than the silence it replaced — and the count, which is what
actually stops a 10–15′ drill becoming a 56-item marathon, was reliable the whole time.

mova kept one exception limba does not need: **the setup build estimate stays in minutes.**
limba has no setup verb, and the question is different — a learner deciding whether to walk
away from a build cannot use "nine steps". That estimate is still marked *assumed*, and
setup now records its own elapsed time so it can be re-fitted the way limba re-fit these.

**Rule 7 — the part counter.** mova shipped `"part 3 of 5"` at the top of every part, on the
strength of the interview counter (`2/4`), which a real onboarding run had validated. limba
declined it twice over, and the second reason applies to mova and was missed here: **the
denominator moves.** limba's part 1 is conditional and so is mova's — mova shipped that rule
itself in 0.7.0 — so on every day the review block stands down there are four parts, and
"part 3 of 5" is simply false. The counter now fires only on a departure from the known
shape, or on resumption.

The interview counter is untouched in both repos. It earned its place with a learner who
could not yet see the shape of what they had agreed to; a learner twenty sessions into a
five-part lesson is not that person.

## Rule 2's trigger did not work, and limba found out first (PORT-019, 2026-08-17)

**Derived from limba, 2026-08-17.** limba took this mechanic as a back-port at 12:22. At
about 17:00 one of its lessons built a 73-clip, 1.6 MB page — three commands and four
dictionary lookups, roughly fifteen minutes — and said nothing before it, during it, or
about how long. The learner read the silence as a crash. limba diagnosed three causes; two
of them were mova's wording, shipped unchanged.

### Cause 1 — a trigger an agent cannot evaluate is not a trigger

§ 2 said *"any stretch over ~2 minutes where the learner has nothing to do"*. The agent has
no clock and cannot feel two minutes pass, so that sentence was never a condition being
checked — it was a description of a situation, and it fired on nothing. Nothing in either
workspace recorded that 73 clips of speech synthesis is slow, so there was no way to reach
the number by reasoning either.

**The trigger is now the command, which the agent can always see itself about to run.**
mova's answer differs from limba's in shape, and the difference is real rather than drift:

- **limba named a chain** — `newvisual.mjs` → `tts-embed.mjs` → `visualcheck.mjs` — because
  it has exactly one long silence and that silence *is* the chain.
- **mova named the ingredient.** It has three such stretches, not one: the setup build, a
  page build inside a lesson, and close-out's regeneration. They do not share a chain, and
  two of them are owned by other files already. What they share is a network call per clip,
  which is `tts-embed.mjs` and `tts-warm.mjs`. Naming the two commands covers all three
  flows without pulling any flow's own steps into the noun.

`newvisual.mjs` and `visualcheck.mjs` are deliberately **not** on mova's list: they scaffold
and check a file locally, and neither is the reason a page build takes minutes. A trigger
list that grows past the things that are actually slow stops being read.

### Cause 2 — a rule that lands in a mechanic and not in the verb has not landed

This is the one that matters more here, and mova was carrying it live. `playbooks/lesson.md`
ran the entire page build — compose, verify, author, embed audio, check, index, rebuild the
hub — with **no announcement instruction anywhere in the step**, and its orient step opened
with a bare *"every step, silently"* and no pointer, the same word limba's skill widened into
a licence to disappear. mova has never run a lesson, so the defect had nowhere to fire yet;
it was not caught by being lucky, it was caught by limba.

**Fixed by putting the announcement at the step, not at the mechanic**: `lesson.md` part 2
step 5, `session_format.md` § Media moves and close-out step 9, `media.md` at both places
that invoke the command, `teaching.md` rule 10. `setup.md` § 2 already had it and is the one
flow that never broke.

Two sentences moved out of the rule file in the same pass and are kept here. § 2's closer
used to run *"An unannounced silence reads as a crash, not as work, and the longest silences
in this product arrive right after the agent has said the learner is done"* — the second half
is now operative text in close-out step 9, which is the silence it was describing, so the
rule file keeps only the first. § 3's *"That test is the difference between transparency and
noise"* went for the same reason: it argues the rule rather than stating it.

### The three questions limba left open (its FB-004), answered on mova's record

**1 · Narration is the only mechanic with no mechanism.** True in limba, and it was true here
until this sync. **mova's answer: gate the documents, not the speech.** Whether the agent
actually announced something is not recoverable from the repo afterwards — but *"the step
that runs the slow command carries the announcement"* is a static property of this repo, and
that is testable. `docs/narration.callsite.test.ts` asserts it, plus two supports: § 2 must
keep naming the slow commands, and § 2 must not regress to a duration trigger. It is crude in
the same way `agents.test.ts`'s leak heuristic is crude — a pointer sixteen lines away
satisfies it without being a good announcement. It catches the failure that actually
happened, which was no announcement within reach of the command at all. **This is new
machinery limba does not have**; a statement waits in `upstream/backports/`.

**2 · Should a verb be forbidden from paraphrasing a mechanic? No** — and the incident argues
against the ban, not for it. A verb that only pointed would put the rule out of reach at the
moment of action, which is the same failure one level further away. limba's skill did not
fail because it paraphrased; it failed because it paraphrased **one half of a two-default
section with no pointer back**. So the rule added to [../README.md](../README.md) is that a
restatement carries its `§ N`, and a section holding two opposite defaults is never cited by
one of them alone. Generated shims stay the stricter case — pointers only, no rules —
because a shim is not read beside the playbook the way a playbook is read beside the mechanic.

`docs/narration.callsite.test.ts` also asserts the general form: **every numbered rule in
narration.md is cited by at least one playbook or mechanic.** That is the weakest useful
version of "the noun reached a verb", and it immediately found § 6 (one thing at a time),
which the interview obeyed in full and cited nowhere — a rule the agent meets once, out of
context, and drops. The pointer went into `setup/interview.md` § Conduct.

**3 · Should the merged section be split? mova has nothing to split** — it never merged. § 2
(announce a silence) and § 3 (never show the work) have been separate rules with separate
headings since 0.8.0, and this incident is the evidence for that shape: limba's merged § 2
led with *never show the work*, the announcement sat last, and the skill that quoted the
section took the half it led with. **Do not adopt the merge on a later sync.** limba kept it
because its rule file is at 1,116 words against a 1,150 cap, which is a budget decision
standing in for a design decision, and limba says so.

**mova hit the same wall in the same sync and paid it differently.** `narration.md` finished
this change at 899 words against its 900 cap. The room came from moving provenance to this
file — where `docs/consequential.test.ts` says it should go, and where most of it was already
duplicated — and from one paragraph of story that left `session_format.md` close-out step 7
so step 9 could afford the announcement. **No rule was dropped to fit a number.** If the next
addition cannot be paid for that way, the answer is to split the topic, not to shorten a rule
until it stops being one.
