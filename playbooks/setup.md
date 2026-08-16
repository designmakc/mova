<!-- mova:engine -->
---
verb: setup
summary: Generate a personalized workspace - interview, generate, verify. Runs once, before any study verb works.
triggers: set up my workspace, I want to start learning a language, any arrival when no profile exists and the human wants to learn
requires: nothing - this is the verb that creates what the other verbs require
scenarios: none
---

# setup — the onboarding driver

Purpose: turn the bare template into a personalized instance. Three acts, strictly in
order: **interview** ([setup/interview.md](../setup/interview.md)), **generation** (the
templates in [setup/templates/](../setup/templates/), per the scenario deltas in
[setup/scenarios/](../setup/scenarios/)), **verification**
([setup/smoke.md](../setup/smoke.md)).

**No adapter is generated for this verb** (`scenarios: none`). Setup runs exactly once,
from the bare template, routed by AGENTS.md's verb table — which is why it needs no shim;
a finished instance shipping an auto-invocable `setup` skill would advertise the one verb
whose first act is to refuse (§ 0 Gate).

**The human's total burden is answering the interview — nothing else.** Every command,
every fix, every re-run is yours. A generation failure routes back to the step that
generated the bad file, never to the human; ask them nothing after the interview except
what a template comment explicitly marks as a learner decision.

**Reads**: setup/interview.md, setup/scenarios/\*, setup/templates/\*, the chosen
`packs/<code>/` (pack.md, notes.md), VERSION, docs/mechanics/README.md (provenance
markers — every generated language-pair claim is born `(assumed)`),
docs/mechanics/verification.md, docs/visual/SPEC.md — **and `playbooks/`**: every
playbook's frontmatter `scenarios:` line (the authority on which verbs this focus mode
activates), plus the body of any playbook whose rules setup writes into a generated file:
[tutor-prep.md](tutor-prep.md) (it owns both tuition cadences — the Tuition clause must not
invent a third), [lesson.md](lesson.md) and [drill.md](drill.md) (the placement the handoff
promises), [update.md](update.md) (what § 0 Gate hands change over to). A clause generated
without reading the playbook that runs it contradicts that playbook, and nothing downstream
can see the contradiction. (Found generating a German-native level goal with a tutor,
2026-08-15.)

**Writes**: docs/reference/{profile,goal,transfer,topics,resources}.md,
docs/mechanics/error_taxonomy.md, docs/{concept,curriculum,plan}.md,
docs/projects/workspace_setup.md, docs/snapshots/<date>_intake.md,
work/visuals/README.md, docs/visual/tokens.css (theme values only),
agents/<agent>/ adapter output, git commits per step (when `mode: enforced`).

## Flow

### 0 · Gate

If `docs/reference/profile.md` exists, this is already an instance — stop and say so
(the update verb handles change). Otherwise greet in one warm paragraph: what this is, that
you'll ask questions and then build everything yourself, and that the first study session
afterwards is a gentle placement, not a test.

**The greeting also shows the shape of what is about to happen.** A learner who cannot see
the shape cannot size their answers, and gives the first topic the answer that belonged to
the fourth. Three things, briefly:

- **The ground the questions cover — six short phrases, not six questions**: your
  languages, what success would look like, where you're starting from, how much time you
  have, how wide you want this, and whether you work with a tutor. Name the areas and stop
  there. **No sub-questions, no options, no form** — a preview that enumerates *is* the
  questionnaire dump the interview forbids
  ([setup/interview.md](../setup/interview.md) § Conduct), and it also invites the learner
  to answer all six at once, which destroys the reflect-back that catches wrong guesses.
- **The two clocks**: a few minutes of questions — six numbered topics, so they can see the
  end from the start — then **5–15 minutes while you build alone**. Say the second number
  again at the close, when it actually starts (interview § Close).
- **That everything after the questions is yours**: every command, every file, every check.

(Found in the first real onboarding run, 2026-08-15: the greeting promised "a few
questions" and gave the learner no way to judge the size or the length of what they had
just agreed to.)

### 1 · Interview

Run [setup/interview.md](../setup/interview.md) in full — all seven topics, one at a
time, environment probe run silently. Close with the read-back and get one confirmation.
Do not begin generation with an unconfirmed picture.

### 2 · Generation — in order, validated per step

**Say the build has started, and repeat the 5–15 minute figure once**, before step 1.
The interview was turn-by-turn; the generation is a long silence, and a silence that was
not announced reads as a crash. From here to the handoff the learner has nothing to do —
which is the promise above, and it only lands if they know how long nothing lasts. The one
branch that breaks the estimate is step 4's pack build; that step warns again when it is
taken.

Each step: fill the template (drop its guidance comments, flip its marker to
`mova:instance`, leave no `{{PLACEHOLDER}}` behind), then run that step's validation.

**The placeholder rule stops at a fenced block.** "Leave no `{{PLACEHOLDER}}` behind" is
about **unfilled slots in prose** — never about **examples of slots**. Inside a fenced
block a template marks as kept verbatim, the tokens *are* the content: they show a format
the instance fills in later, once per entry, and stripping them leaves an example of
nothing. `error_taxonomy.template.md`'s log-entry-format block is the case in point —
`{{WRONG}}` / `{{RIGHT}}` / `{{CODE}}` ship as written. Prose outside the fences takes the
rule in full. (Both 2026-08-15 test instances hit this collision and resolved it
differently.)

**Marker placement — the one exception.** The `<!-- mova:instance -->` comment goes on
line 1 *except* in a file whose first line is load-bearing for a parser: YAML frontmatter
must open the file. In `docs/projects/*.md` the frontmatter starts at line 1 and the
marker follows it (`projects.index.test.ts` matches `^---` without the multiline flag, so
a comment above it makes `status:` and `kind:` parse as null and four tests fail). The
same rule already governs generated Claude Code skills — see
[agents/claude-code/README.md](../agents/claude-code/README.md).
**A failed validation routes back to the same step**; three failures on one step means
re-read the template's rules, not lower the bar. Commit after each green step
(`setup: <file>`), when git exists.

**`npm test` is not green until step 8, by construction.** The suites arm as their
subjects appear, and `agents.test.ts` arms at step 1 (the profile) while the adapters it
checks are written at step 8. So from step 1 to step 7 the *whole* suite is red on purpose.
Each step's "validate with `npm test`" means **the suites that step's file owns** — run
them by name (`npx vitest run docs/topics.test.ts`) and read the rest as expected-red.
Full green is step 8's gate and the smoke run's first line. A step-owned suite that fails
is a real failure; an unrelated red is the scaffold still being built.

1. **Profile** — `setup/templates/profile.template.md` → `docs/reference/profile.md`.
   Config keys from the interview; `template_version` copied from `VERSION`; omit
   `goal_date` when there is no deadline.
   **`template_source` is resolved here, never asked for later.** It is the URL this copy
   came from, and it is the only thing `/update` needs to find the template again. Work it
   out yourself, in order: `git remote get-url origin`; then the URL the human used to
   fetch this copy, if this conversation has it. Omit the line only when neither exists (an
   unpacked zip with no remote) — then `/update` asks once, and that is a question setup
   could not answer rather than one it forgot to ask. (Found in the first real onboarding
   run, 2026-08-15: the update path made the learner produce a URL the setup agent had had
   in hand all along.)
   *Validate*: `node -e "import('./scripts/profile.mjs').then(m => { const p = m.loadProfile(); for (const k of ['pack','target_language','meta_language','native_languages','contrast_ranking','goal_kind','goal_label','sections','units','mode','agent','audio','tts','publishing','template_version']) p.require(k); console.log('profile ok'); })"`
2. **Intake snapshot** — `docs/snapshots/<today>_intake.md`: the Topic 3 self-assessment
   verbatim, with `## Method` saying *self-report, nothing exercised* and
   `Not exercised: everything — the placement session measures`. This is the record the
   placement checks itself against, and the workspace's first dated artifact.
3. **Goal** — the variant `setup/templates/goal-<kind>.template.md` per the scenario
   ([setup/scenarios/](../setup/scenarios/)); tuition clause only when Topic 6 said yes.
   Research what the template marks researchable (exam format, descriptors); unverified
   facts go on the TO-CONFIRM list, never into silent prose.
   *Validate*: H1 + the H2 order + the bolded spec sentence are present (grep them);
   `sections` letters match the profile.
4. **Pack** — does `packs/<code>/` exist for the target? Use it. If not, **warn the
   learner this is the one long step** (a new language pack: tables, fixtures,
   dictionary adapter), then follow [packs/_template/GENERATE.md](../packs/_template/GENERATE.md)
   to completion. *Validate*: `node scripts/packcheck.mjs <code>` exits 0; one live
   dictionary lookup matches the probe's finding.
5. **The hard trio** — transfer, error taxonomy, topics; these three carry the
   language-pair knowledge and everything downstream leans on them.
   - `transfer.template.md` → `docs/reference/transfer.md` — all five mandated
     sections, every claim `(assumed)`, mined from `packs/<code>/notes.md` first, then
     your pair knowledge. False friends: ≥10 rows is the floor and there is no ceiling —
     the template's selection rule decides which rows come first.
   - `error_taxonomy.template.md` → `docs/mechanics/error_taxonomy.md` — starter codes
     `(assumed)`, re-ranked for this learner's blind zones, as many as earn a slot under
     the template's selection rule (6–10 is the usual count, not a cap); engine token
     blocks kept verbatim.
   - `topics.template.md` → `docs/reference/topics.md` — systems from the pack's
     inventory, T-NNNN ids from T-0001, unit joins consistent with the curriculum you
     are about to write (draft them together; topics binds in CI once the curriculum
     exists). **Aspect count follows the curriculum's detail, not the pack's inventory.**
     The rolling wave leaves most units as one orientation line; an aspect bound to such a
     unit is a guess CI then enforces. Detail the aspects for the units you actually
     detail, and give each coarse unit its handful of headline aspects — the rest accrete
     when that unit is written out (same wave discipline as the curriculum).
   - `resources.template.md` → `docs/reference/resources.md` — the registry seeded from
     the pack's resource notes, trimmed to what serves *this* goal and level. The
     curriculum's Sources lines and the lesson playbook both read it, so it cannot wait.
   *Validate*: `npx vitest run docs/topics.test.ts` (fully arms after step 6).
6. **Curriculum** — `curriculum.template.md` → `docs/curriculum.md`. Rolling wave:
   first 3 units in full, the rest coarse; unit count equals the profile's `units:`;
   every unit appears in topics.md.
   *Validate*: `npx vitest run docs/curriculum.test.ts docs/topics.test.ts`.
7. **Plan + concept + the seed project** —
   - `plan.template.md` → `docs/plan.md` — phases from goal + time budget; the seeded
     `[x]` generation milestone dated today; open milestones annotated on one line.
   - `concept.template.md` → `docs/concept.md`.
   - `docs/projects/workspace_setup.md` — the generation record, so the Projects Index
     starts truthful and CI-green. Frontmatter `status: done`, `kind: infra`,
     `phases: 0`, `summary: <one line>`; sections `## Status` (what was generated,
     from which template versions), `## Phased Plan` (done — this file is a record),
     `## Todo` (empty), `## Design` (the interview's load-bearing answers and every
     judgment call you made generating — the file a future "why is the workspace like
     this?" question greps).
   *Validate*: `npx vitest run docs/plan.annotations.test.ts docs/projects.index.test.ts
   docs/consequential.test.ts` (a failed SRS-ceiling check means the goal's volume target
   and the plan's pace disagree: fix the numbers, not the test).
8. **Agent adapters** — generate for the profile's `agent:` per
   `agents/<agent>/README.md` (adapter shims contain pointers to playbooks, never rule
   text). No shim for `setup` or any `maintainer: true` verb.
   *Validate*: the adapter files exist where that README says — **and now the whole
   suite: `npm test` must be green.** This is the first point where it can be.
9. **Visuals home + theme** — copy
   [setup/templates/visuals-readme.template.md](../setup/templates/visuals-readme.template.md)
   → `work/visuals/README.md` (it is already instance-marked; index empty). Then the
   theme, once: if this environment has the hallmark skill (or can
   `npx skills add nutlope/hallmark`), craft the instance theme per
   [docs/visual/SPEC.md](../docs/visual/SPEC.md) §Hallmark — take the learner's vibe
   from the interview, derive the palette, and pin the **values** into
   `docs/visual/tokens.css` (keys never change). Without Hallmark, keep the stock
   tokens untouched — **a stock theme is fine; an inconsistent one is not.** Never
   re-theme per page later. *Validate*: `node scripts/visualcheck.mjs --all`.

### 3 · Smoke

Run [setup/smoke.md](../setup/smoke.md) top to bottom. Every failure there names the
generation step to redo — go redo it and re-run the smoke from the top. Setup is not
done until the smoke is clean.

### 4 · Handoff — the orientation

**Setup's last act is a short tour, not a "you're all set."** What the learner has at this
moment is a workspace they have never seen, built while they were away, in a shape nobody
described to them: they know the questions they answered and nothing about what those
answers produced. "Ready — say lesson" hands them a verb and leaves them to discover the
rest by accident. Four parts, in this order, then stop. Keep the whole thing to about a
screen: this is orientation, not documentation, and each part below has a guide page
carrying the depth. (Found in the first real onboarding run, 2026-08-15.)

**1 · What you can say.** The verbs *this* instance answers to — one plain line each, from
the focus mode's live set
([setup/scenarios/focus_modes.md](../setup/scenarios/focus_modes.md)), never the README's
shortlist or the command guide's full list: both name verbs a narrow instance refuses. Say
that chat is the only thing they operate: they say a verb, you run every script and every
file behind it, and the hub and the deck are pages they read. Name
[docs/guide/commands.md](../docs/guide/commands.md) as the long version — every verb, what
it costs and what it leaves behind — and
[docs/guide/how-sessions-run.md](../docs/guide/how-sessions-run.md) for what happens inside
a session. Mention that `update` also answers "anything new?" — a read-only check against
the template that changes nothing ([update.md](update.md)) — because a workspace that
improves is a fact about this product, and nothing else in the tour would ever tell them.

**2 · Where things live.** The chat, plus two pages the smoke run has already built: **the
hub** (`work/visuals/index.html`) — their one bookmark, days-to-goal and what they hold,
regenerated at the end of every session — and **the deck** (`work/visuals/deck.html`), the
drillable view of everything they know. **Give the hub as a link they can click**, not as a
path to go find ([docs/mechanics/media.md](../docs/mechanics/media.md) → Delivering a
visual). One sentence that these pages are theirs, offline, and permanent.

**3 · The plan you just built.** What the goal contract counts as done, in the learner's own
words where the interview gave them; how many units there are and what the first one is
about; the pace those numbers assume; the deadline arithmetic, or the no-deadline rule when
there is no date. This is the part they cannot reconstruct alone, and the part they will
judge the whole build by — they have been answering questions for ten minutes with no idea
what was being made of the answers. Name `docs/plan.md` and `docs/reference/goal.md` once
as the files that hold it, and say plainly that all of it is theirs to change.

**4 · What happens next, and what only they can do.** The workspace is ready; **say the
starting verb when you're ready to begin — the first run of it is a placement**, a gentle
probe of where you actually are, and everything after it is built on what it finds. One
sentence on anything the environment can't do (no audio, no dictionary).

**The starting verb is whichever one carries placement in this instance's focus mode, and
you say the actual word** — `lesson` under `full`, `drill` under `drill` and `vocab`,
`write` under `writing`
([setup/scenarios/focus_modes.md](../setup/scenarios/focus_modes.md) § Placement and
assessment run in every mode is the rule). Never hand over a verb the instance refuses:
under `focus: vocab` a handoff that says "say lesson" is answered with "this workspace is
vocabulary-only", and that refusal is the first thing the learner ever sees this workspace
do. (Found generating an Italian-native vocabulary-only instance, 2026-08-15.)

**Then the short list of things only they can do.** Setup's promise is that the learner
answers questions and nothing else — but some work is theirs by nature, and burying it in
the plan means it never happens. Name each one in a sentence, with why it matters and by
when: material a site will not serve to a script (buy it, download it in a browser),
anything that costs money, anything requiring their identity (exam registration), and any
keyboard or input setup the target language needs before the first written work — on a
layout without the language's characters, look-alike codepoints enter the record and the
workspace cannot tell them from real spelling. Each item is also a `🔧` milestone in
`docs/plan.md`, but the plan is a file; this is the conversation. Keep it to what is
genuinely blocked on them — a list of five is a handoff, a list of fifteen is homework.

Then stop — the first session belongs to the starting verb, not to setup's momentum. **The
tour is the last thing setup says, so it does not compete with the placement**: four parts
and the human-only list, not a walkthrough of the mechanics, the SRS tiers or the file
layout. Everything left over is what the guides are for, and the learner will meet it when
a session needs them to.
