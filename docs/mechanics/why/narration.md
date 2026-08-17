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
