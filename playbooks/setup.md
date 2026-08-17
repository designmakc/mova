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
docs/mechanics/verification.md, **docs/mechanics/narration.md** (what setup says, when it
says it, and what the learner never sees — this playbook is its longest single obligation),
docs/visual/SPEC.md — **and `playbooks/`**: every
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

### 0 · Gate — three states, not two

**A tree with a profile in it is not necessarily a finished instance.** The profile is
written at generation step 1 of 9, so every state from "died at step 2" to "shipped and
studying" has one. Gating on that file alone answers a half-built workspace with *"this is
already an instance — use update"*, which throws away an interview the learner has just
spent ten minutes on and hands them a workspace that looks finished and is not. Decide
between three states before saying anything:

```
ls docs/reference/profile.md docs/reference/goal.md docs/reference/topics.md \
   docs/reference/transfer.md docs/reference/resources.md docs/mechanics/error_taxonomy.md \
   docs/curriculum.md docs/plan.md docs/concept.md docs/projects/workspace_setup.md \
   docs/snapshots/*_intake.md work/visuals/README.md 2>&1
git log --oneline | grep -c '^[0-9a-f]* setup:'      # how far the last attempt got
```

- **No profile** → the bare template. Greet, then run the interview.
- **Profile plus every file above, and `npm test` green** → a finished instance. Stop and
  say so; [update.md](update.md) handles change from here.
- **Profile and anything missing** → **an interrupted build. Resume it; do not re-interview
  and do not start over.** Say so in one line — *"your answers are all here; I stopped
  partway through building and I'm picking it up now"* — give the remaining estimate
  (§ The build estimate, counting only the steps left), then re-enter § 2 Generation at the
  **first missing artifact** and run forward to the smoke as normal.

**What a resume may and may not re-ask.** The profile holds every interview answer that
generation consumes, so the four topics are never asked twice. Two answers live somewhere
other than the profile, and if that file is the missing one they are genuinely gone: the
**goal in the learner's own words** (`docs/reference/goal.md`, and the scenario list with
it) and the **starting-level self-report** (the intake snapshot). Re-ask only the one whose
file is missing, name it as a re-ask — *"I lost your own wording of the goal; give it to me
once more"* — and never re-run a topic whose output survived.

Otherwise, greet in one warm paragraph: what this is, that you'll ask questions and then
build everything yourself, and that the first study session afterwards is a gentle
placement, not a test.

**The greeting shows the shape of what is about to happen** — four things, briefly. A
learner who cannot see the shape cannot size their answers, and gives the first topic the
answer that belonged to the fourth.

- **The ground the questions cover — four short phrases, not four questions**: your
  languages, what success looks like and where you're starting, how much time you have, and
  how wide you want this. Name the areas and stop there. **No sub-questions, no options, no
  form** — a preview that enumerates *is* the questionnaire dump the interview forbids
  ([setup/interview.md](../setup/interview.md) § Conduct), and it also invites the learner
  to answer all four at once, which destroys the reflect-back that catches wrong guesses.
- **What they will have at the end**, in their own terms and one sentence: a profile of how
  they learn, a written goal with a finish line, a curriculum, a study plan with dates, a
  map of what has been covered, the two records that hold every word and every mistake, and
  two pages — a dashboard and a deck of everything they know. This is the half the 0.5.0
  greeting never covered: the learner agreed to ten minutes of questions with no idea what
  was being made of the answers, and only met the answer in the handoff.
- **What you will do on their machine**, plainly, because this is where trust is decided
  and the learner is about to leave you alone with it: install this workspace's
  dependencies, write files inside this folder and nowhere else, make a commit after each
  finished step so nothing is lost, and run the checks yourself. Three things reach the
  network and you name them — one dictionary lookup and one text-to-speech check now, and a
  search for the exam's format if they named an exam. Nothing else leaves the machine.
- **The two clocks**: a few minutes of questions — four numbered topics, so they can see the
  end from the start — then **the build, which you do alone**. Give the range from
  § The build estimate, and say the number again at the close when it actually starts
  (interview § Close).
- **That everything after the questions is theirs to watch, not to do**: every command,
  every file, every check is yours.

(Found in the first real onboarding run, 2026-08-15: the greeting promised "a few
questions" and gave the learner no way to judge the size or the length of what they had
just agreed to.)

### 0b · The build estimate

**Compute it; never quote a fixed figure.** By the end of the interview every branch below
is settled, so the number is arithmetic, not a guess — and the branches move it by a factor
of four. Price it once at the interview's close, re-anchor it whenever a branch turns out
worse than estimated ([../docs/mechanics/narration.md](../docs/mechanics/narration.md) § 1
and § 2), and count only the remaining steps when resuming.

| Branch | Condition | Add |
| --- | --- | --- |
| **Base** — nine steps, templates filled and validated | always | **5–15 min** |
| **Pack build** | `packs/<code>/` does not exist for the target | **+20–40 min** — [packs/_template/GENERATE.md](../packs/_template/GENERATE.md) end to end, every step gated on a pasted result |
| **Dependency install** | zip copy, no `node_modules/` | +1–3 min |
| **Goal research** | `goal_kind: exam`, format or descriptors not known | +3–8 min |
| **Theming** | Hallmark available (step 9) | +2–5 min |
| **Narrow focus** | `focus:` is not `full` | −2–5 min — the curriculum and plan are generated coarse |

**Every number in that table is *assumed***
([../docs/mechanics/README.md](../docs/mechanics/README.md) — the provenance markers). The
base is inherited from the scaffold and has never been measured; the branches are sized from
the work each one names. What changed in 0.8.0 is not the accuracy of the base — it is that
a build with a pack build in it stops being quoted the base at all.

So a `full` instance in a language with a pack, on a machine with node and git, is the
short end of the base; a language with no pack is **35–60 minutes** and the learner must
hear that number before it starts, not when step 4 arrives. **State a range with a reason,
never a point estimate** — "about 10 minutes" and "closer to 45, because Georgian has no
language pack yet and I have to build one first" are both honest; "5–15 minutes" said to
the second learner is not.

**Record what it actually took.** Step 7's seed project carries the real elapsed time, so
this table can be re-fitted from instances instead of re-guessed — the same discipline the
session log's `duration` field exists for ([../docs/mechanics/srs.md](../docs/mechanics/srs.md),
the cost model, which was unfittable for exactly as long as nobody wrote the number down).

### 1 · Interview

Run [setup/interview.md](../setup/interview.md) in full — all seven topics, one at a
time, environment probe run silently. Close with the read-back and get one confirmation.
Do not begin generation with an unconfirmed picture.

### 2 · Generation — in order, validated per step

**Announce, checkpoint, re-anchor** — the three obligations of any long stretch the learner
sits out ([../docs/mechanics/narration.md](../docs/mechanics/narration.md) § 2). This is the
longest one in the product.

- **Announce**, before step 1: the build has started, it runs *this* long (§ 0b, the same
  number the interview's close gave), and they can walk away and come back.
- **Checkpoint**: **one short line per finished step**, in the learner's terms — *"your
  profile is written"*, *"the goal is down, with the exam's four sections in it"*, *"the
  curriculum is laid out: 14 units, the first one is greetings and the alphabet"*. Nine
  steps, nine lines, and each one lands only once the step's validation is green. Say what
  now exists, never what you are about to do.
- **Never show the work.** No commands, no test output, no green ticks, no file paths, no
  commit messages ([narration.md](../docs/mechanics/narration.md) § 3 and § 4). A failed
  validation that you fix by re-running the step is not a checkpoint and the learner never
  hears about it — the promise is that every fix is yours.
- **Re-anchor** the moment a branch runs longer than estimated: the new number and the
  one-word reason, once. Step 4's pack build is the branch that most often does this, and it
  warns again when it is taken.

From here to the handoff the learner has nothing to do — which is the promise above, and it
only lands if they can see it being kept. The interview was turn-by-turn; an unannounced
silence after it reads as a crash, and an announced silence with no checkpoints reads as
one too, about six minutes in.

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
2. **Intake snapshot** — `docs/snapshots/<today>_intake.md`: the Topic 2 self-assessment (the starting-point half)
   verbatim, with `## Method` saying *self-report, nothing exercised* and
   `Not exercised: everything — the placement session measures`. This is the record the
   placement checks itself against, and the workspace's first dated artifact.
3. **Goal** — the variant `setup/templates/goal-<kind>.template.md` per the scenario
   ([setup/scenarios/](../setup/scenarios/)); tuition clause only when Topic 4 found a tutor.
   Research what the template marks researchable (exam format, descriptors); unverified
   facts go on the TO-CONFIRM list, never into silent prose.
   *Validate*: H1 + the H2 order + the bolded spec sentence are present (grep them);
   `sections` letters match the profile.
4. **Pack** — does `packs/<code>/` exist for the target? Use it. If not, **re-anchor the
   estimate here with the real number** — a new language pack (tables, fixtures, dictionary
   adapter) is **+20–40 minutes** on top of everything else, it is the single largest branch
   in § 0b, and the learner has already been told at the interview's close that this build
   takes the long shape. Say it once, in one line, then follow
   [packs/_template/GENERATE.md](../packs/_template/GENERATE.md)
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
     **`## Status` also carries what this build actually cost**: one line —
     `Build: <N> min wall-clock (estimated <range>; branches taken: <pack build | install |
     goal research | theming | none>)`. It is the only record of it, and § 0b's table is a
     guess until instances report back. A number nobody writes down is a number nobody can
     re-fit — the session log's `duration` field exists because the SRS cost model spent
     weeks unfittable for exactly that reason.
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
rest by accident. **An opener, then four parts, in this order, then stop.** Keep the whole
thing to about a screen: this is orientation, not documentation, and each part below has a
guide page carrying the depth. (Found in the first real onboarding run, 2026-08-15.)

**Open with what this is and how a week with it works** — two or three sentences, before
any of the four parts. Not what setup built; **what the product is**. The loop, in the
learner's terms: *this workspace teaches you and keeps the record — the dashboard tells you
what is due, you open a fresh chat and say one word, the session teaches, tests you and
writes everything down, and the dashboard is current again by the time you close it. You
never touch a file; you talk to me and study.* The README says this, and the learner who
was handed a copy by a friend, or who came back to it three weeks later, has never read the
README — the tour is the only place the product ever explains itself to the person using
it. Name [../docs/guide/how-sessions-run.md](../docs/guide/how-sessions-run.md) once as
where the long version lives.

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
tour is the last thing setup says, so it does not compete with the placement**
([../docs/mechanics/narration.md](../docs/mechanics/narration.md) § 8): the opener, four
parts and the human-only list, not a walkthrough of the mechanics, the SRS tiers or the
file layout. Everything left over is what the guides are for, and the learner will meet it
when a session needs them to.
