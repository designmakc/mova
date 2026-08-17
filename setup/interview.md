<!-- mova:engine -->
# setup/interview.md — the onboarding interview

> The script [playbooks/setup.md](../playbooks/setup.md) drives. The person answering is a
> **learner, not an operator**: plain language, one topic at a time, no jargon, no file
> paths or config keys in the questions themselves. The technical mapping under each topic
> is for you, the agent — never read it aloud. Ask follow-ups freely; the questions below
> are the floor, not a form to administer. Collect everything before generating anything —
> a half-interviewed profile generates a workspace that has to be interviewed again.
>
> [../docs/mechanics/narration.md](../docs/mechanics/narration.md) governs how all of this
> is said. This file is what the interview asks; that file is why it asks that way.
>
> Interview in whatever language the human opened with; that is also the language
> everything generated is written in — confirmed in Topic 1, not asked.

## Conduct

- **One topic per exchange.** Never a numbered questionnaire dump. Numbering the topics
  (next bullet) is the opposite of dumping them: it says how far along they are, not what
  is coming.
- **Number every topic you ask — `1/4`, `2/4`, `3/4`, `4/4`** — and open the topic with it.
  Four topics are asked; the open floor is one question and not a topic, and the
  environment probe is run silently, so the denominator is fixed at four in every interview
  and must not move. **Follow-ups inside a topic do not advance the counter**: it counts
  ground covered, not messages sent, and a number that climbs with every reply tells the
  learner the interview is growing. Without the counter the learner cannot tell a
  two-minute interview from a twenty-minute one, and answers the first topic at the size
  that belonged to the fourth. (Found in the first real onboarding run, 2026-08-15.)
- **Reflect back before moving on** — one sentence of what you understood, so a wrong
  guess dies in the interview, not in the generated workspace.
- **Confirm what you can resolve; ask only what only the learner knows**
  ([narration.md](../docs/mechanics/narration.md) § 5). Two answers this interview used to
  demand are now **proposals inside a reflect-back**: the explanation language (Topic 1)
  and the focus mode (Topic 4). Both were questions the agent could answer from evidence
  already in front of it, and both were being put to someone with less information than the
  asker. A proposal the learner can wave away costs them nothing; a question costs them a
  turn and invites a guess.
- **Record answers verbatim where they matter** (scenario lists, the goal in the
  learner's own words) — the templates want the learner's phrasing, not your summary.
- **The environment probe is run, not asked.** The learner is never asked whether node is
  installed; you check.

**Four asked topics, and why these four.** Everything here is load-bearing at generation
time and unknowable without them: who is talking and what they already hold (1), what
"done" means (2), what pace is real (3), and how wide the apparatus should be (4). Two
former topics were merged into these rather than dropped — the starting level rides Topic 2
because it is the one answer nothing downstream trusts, and tuition rides Topic 4 because
it is a yes/no that only shapes the program's edges. Nothing was deleted from what the
templates receive.

---

## Topic 1 — Languages · ask as `1/4`

*Why: every explanation in this workspace is built on contrasts with languages the
learner already holds; the ranking decides which language a contrast is drawn from.*

Ask, conversationally:

1. Which language do you want to learn?
2. What is your native language — or languages, if more than one?
3. What other languages do you know, even a little? For each: how comfortable are you —
   would you say beginner, comfortable, or fluent?

**The explanation language is confirmed, not asked.** They opened this conversation in a
language; that is the default, and everything generated is written in it. Put it in the
reflect-back as a line they can overturn — *"I'll explain everything in English, and
that's the language your whole workspace gets written in — say if you'd rather have
another."* Ask outright only when the opening language is genuinely ambiguous (a
one-word first message, or a native language that is not the one they typed in).

From the answers, build the **contrast ranking** yourself — do not ask the learner to
rank. Rules (limba's, earned): the language most structurally useful for the target ranks
first when the learner holds it natively; a weakly-held language ranks below a
strongly-held one even when it is closer to the target, and is **never a production
source** — the learner cannot trust their own output in a language they half-hold, so a
form recalled from it must never be offered as the model. It stays fully legitimate on the
**recognition side**, vocabulary included: school French earns its rung for a Romance
target the moment a word is readable through it, and ruling that out throws away the
learner's largest lexical bridge over a production risk that only exists in the other
direction. State per rung **what kind of anchor it is** — structural, lexical, or both —
because the profile's picking rule is written from exactly that. The meta-language earns a
slot when it carries a loan/cognate layer into the target. State the ranking back in plain
words ("I'll explain Romanian mostly through Ukrainian, reach for English for the
Latin-side words…") and let the learner correct it. (Recognition/production split found
generating a German-native level goal with a tutor, 2026-08-15.)

**Maps to:** config `target_language`, `meta_language`, `native_languages` (comma list),
`contrast_ranking` (ISO-ish codes, `uk > ru > en > de`), `pack` (the target's pack code —
resolved in the pack-selection step, not asked). The ranking's *why* — one line per
language — goes into the profile's languages section.

## Topic 2 — The goal, and where you're starting · ask as `2/4`

*Why: `docs/reference/goal.md` is the spec for every scope decision this workspace will
ever make; a workspace without one is mis-generated. Refusing to proceed goalless is a
design rule, not a preference.*

**One topic, two questions, in this order** — the goal first, then the starting point.
A learner describes where they are in the same breath as where they want to be, and the
starting point is the one answer in this interview that **nothing downstream trusts**: the
placement measures it, and this self-report only seeds the curriculum's starting shape and
gives the placement something to check itself against. It was a numbered topic of its own
until 2026-08-17, which priced it far above what it is worth.

### The goal

Open with: **"What would make this a success for you?"** Then branch:

- **An exam** ("I need a certificate…"): Which exam, who runs it? Is there a date — a
  registered sitting, a legal deadline, or just an intention? Which sections does it have
  (reading, writing, listening, speaking — whatever the learner knows; you research the
  rest in the goal step)? What happens if they fail once — is there time to retake?
- **A level** ("I want to reach B2 / conversational"): On what scale, if they know one —
  otherwise anchor it in ability terms ("hold a 15-minute conversation about your work"?)
  and map it to the pack's scale yourself. Any soft deadline ("before the wedding in
  June")?
- **No formal goal** ("I just want to speak it"): do **not** accept this as stated.
  Elicit **5–10 concrete scenarios** the learner actually wants to be able to do — press
  past the abstract: "order in a restaurant", "read my in-laws' messages", "follow the
  evening news", "small talk with my neighbour". Keep asking "what else — where does this
  language actually show up in your life?" until you have at least five. These scenarios
  ARE the goal; write them down in the learner's words.
- **A ledger target** (rare — the learner names a volume: "I want 2,000 words for
  reading"): take the number and what it's for; this becomes a ledger-kind goal.

If the learner resists all of it: explain, warmly, that the workspace needs a finish line
to point every session at, and that a scenario list is the lightest one there is. Do not
generate without a goal.

### Where they are starting

Then, in the same topic: Have you studied this language before? What can you already do
with it — understand some? say anything? read? Anything you know is already easy, or
already hard?

Say plainly that the first study session will be a **placement** — a gentle probe, not a
test to pass — and that today's answer just sets a starting guess.

**Promise the ritual, not a verb.** Topic 4 has not run yet, so you do not yet know which
verb carries placement here (`lesson` under `full`, `drill` under `drill` and `vocab`,
`write` under `writing` — [scenarios/focus_modes.md](scenarios/focus_modes.md) § Placement
and assessment run in every mode). Say "the first session"; never "the first lesson". The
handoff names the verb, once the focus mode is settled, and it is the only place that
should. (Found generating an Italian-native vocabulary-only instance, 2026-08-15.)

**Maps to:** config `goal_kind` (`exam` | `level` | `functional` | `ledger`),
`goal_label` (short display phrase, e.g. "B1 exam" or "10 scenarios"), `goal_date` (omit
the config line entirely when there is no deadline), `sections` (assessment section
letters, e.g. `R W L S` — for non-exam goals, the letters you assign to the skill areas
the goal exercises). The branch selects the goal template variant — see
[scenarios/](scenarios/). The starting-point half maps to the intake snapshot
(`docs/snapshots/`), which records the self-assessment **verbatim**; the curriculum step
uses it to place the starting units; nothing else trusts it, and it never sets a `covered`
status — only measurement does that.

## Topic 3 — Time budget · ask as `3/4`

*Why: the pacing table, the SRS throughput ceiling, and every deadline projection derive
from this number; an overstated budget generates a plan that fails by design.*

Ask: How many days a week can you realistically sit down for this? How long is a
comfortable sitting — 15 minutes, half an hour, an hour? Prefer the honest number over
the ambitious one — say so.

**Maps to:** the plan's pacing section (`~N study blocks` weekly — a load-bearing phrase,
tests read it), the `units` count arithmetic (goal gap ÷ pace → unit count and phase
dates; the curriculum step owns the final number and the profile's `units:` must equal
what the curriculum defines), and the SRS ceiling check that `npm test` enforces against
any vocabulary target.

## Topic 4 — The shape of the program · ask as `4/4`

*Why: the focus mode decides which verbs the workspace answers to, and a tutor is the
workspace's only source of confirmed language facts besides the dictionary.*

### The focus mode — propose it, do not offer a menu

**Derive it from Topics 2 and 3, state it in one sentence, and let the learner narrow it.**
The four shapes are apparatus, and until the handoff the learner has never seen the
apparatus; asked to choose between them cold, they are choosing a label. `full` is the
default and the only mode any real run has exercised
([scenarios/focus_modes.md](scenarios/focus_modes.md) — the narrow modes are *assumed*
shapes).

| What Topic 2 produced | Propose |
| --- | --- |
| an exam, a level, a scenario list | `full` — "the full program: lessons, drills, writing practice, mock tests" |
| a ledger target, or a goal stated purely as words to hold | `vocab` — "a vocabulary keeper: capture words, review them, nothing else" |
| a goal stated purely as writing ("stop making mistakes in my emails") | `writing` — "composition and correction, with timed pieces against your goal's rubric" |
| an explicit ask for upkeep only ("just keep me warm, no new material") | `drill` — "short daily practice on what is already in" |

Say what the proposal **includes**, name that a narrower shape exists, and stop:
*"That points at the full program — lessons, drills, writing practice and mock tests. Some
people want something narrower: only drills, only a vocabulary keeper, only writing
correction. Say the word and I'll build that instead."* One sentence, one exit. Ask the
open four-way question only when Topics 2 and 3 genuinely point nowhere.

**A narrowed answer changes what gets generated, not just a config key** — the per-mode
deltas in [scenarios/focus_modes.md](scenarios/focus_modes.md) apply in full, so take the
narrowing at the interview and never later in the build.

### The tutor

Ask: Do you work with a tutor or teacher, or plan to? How often do you meet? Would you be
willing to bring a short list of things for them to double-check now and then — it costs
them minutes and keeps this workspace honest?

**Maps to:** config `focus` (`full` | `drill` | `vocab` | `writing` — an extension key,
see profile template) and the active-verb table in
[scenarios/focus_modes.md](scenarios/focus_modes.md); and the goal contract's `## Tuition`
section (present only when the tutor answer is yes), the tutor-prep verb activation, and
the spot-check loop in `docs/mechanics/verification.md`. The **meeting** cadence — how
often the two of them actually sit down — is the one number this topic collects, and the
only one the Tuition clause states. The prep-pack and spot-check cadences belong to
[playbooks/tutor-prep.md](../playbooks/tutor-prep.md) and are never re-stated here as a
number. See [scenarios/tuition.md](scenarios/tuition.md).

## The open floor — one question, not a topic

*Why: the four topics collect what generation cannot run without. They do not collect what
only this learner knows and would never think to volunteer — and every such fact is
cheaper now than as a correction three sessions in.*

After Topic 4, ask **one** open question and mean it: **"Anything else I should know before
I build this?"** Give two or three examples of the kind of thing that helps, then stop —
this is an invitation, never a checklist:

- a deadline behind the deadline, or a stretch of weeks they already know they will lose;
- a keyboard that cannot type the target language's characters (**this one matters most**
  — on a layout without them, look-alike codepoints enter the record and no script can
  tell them from real spelling);
- the domain the language actually has to work in — their job, a partner's family, a
  specific set of documents;
- something that failed for them before, and what they think went wrong.

**Silence is a complete answer.** Do not press, do not enumerate further, do not turn it
into a fifth topic — it is not counted for exactly that reason.

**Maps to:** the profile's Operational profile (`{{FURTHER_INTERVIEW_FACTS}}` and
`{{KEYBOARD_NOTES}}`), each seeded `(assumed)` unless stated outright. An answer that
changes the goal or the pace goes back to its topic and is reflected back there — the
open floor collects context, and never silently overrides a numbered answer.

## The environment probe (RUN, don't ask) · not counted

*Why: capability flags gate audio, verification, and enforcement; guessing them generates
a workspace that lies about what it can do.*

Run these checks yourself, silently, and only surface what needs a human decision:

- **Agent kind**: which runtime are you? → `agent:` (`claude-code` | `opencode` | `codex`
  | `antigravity` | `other`).
- **OS**: `uname -s` (or equivalent).
- **Toolchain**: `node --version`, `git --version`. Both present → `mode: enforced`;
  either missing → `mode: unenforced` — the workspace still works, CI-style checks
  degrade to your own discipline, and you tell the learner one plain sentence about it.
- **Dependencies**: if `mode: enforced`, run `npm install` **now**, before any generation.
  The contract tests are the generation-quality gate and they need `vitest` on disk; a
  zip-download copy has no `node_modules/`, so the first `npm test` of the smoke run dies
  with `vitest: command not found` — a message the learner cannot act on, arriving right
  after you promised they were done. Verify with one `npx vitest run` on the bare template
  (everything skips; that green is the proof the toolchain works). Install failure ⇒
  `mode: unenforced`, and say so plainly. **This install is a build-estimate branch** —
  see [playbooks/setup.md](../playbooks/setup.md) § The build estimate.
- **Repository**: if `git status` reports no commits yet (the zip path — "Use this
  template" already gives you history), make ONE baseline commit of the untracked template
  files before generating. `visuals.index.test.ts` reads `git ls-files`; without a
  baseline, tracked-file checks pass vacuously and the learner's first pages go unindexed.
- **Audio**: can this machine play sound from your session (`afplay`/`say` on macOS, or
  the platform equivalent)? → `audio:`. TTS: is `edge-tts` available or installable, else
  the OS voice, else none → `tts:` (`edge` | `say` | `none`).
- **Dictionary**: does `packs/<code>/dictionary.mjs` exist for the chosen pack? Run one
  real lookup on a known common word: `node scripts/dictionary.mjs <word> --pack <code>`
  (exit 0 and a JSON hit = reachable; exit 1 = absent or unreachable).
  Reachable → verification runs attested;
  unreachable or absent → the null-adapter rules apply and the learner is told, once,
  what that means (facts get a visible "unverified" mark until a tutor or dictionary
  confirms them). **Whether `packs/<code>/` exists at all is the largest build-estimate
  branch there is** — a target with no pack adds a pack build to the generation.
- **Publishing**: can you publish pages the learner can open outside the repo (e.g.
  Claude artifacts)? → `publishing:` (`none` | `claude-artifacts`). Ask the learner only
  if both options genuinely work: "want your study pages as shareable links, or as local
  files?"

**Maps to:** config `mode`, `agent`, `audio`, `tts`, `publishing`. Findings that surprised
you (no audio, no dictionary) get one plain-language sentence to the learner each — not a
capability report.

---

## Close

**Read the whole picture back as a short list, one line per decision** — target language
and explanation language, the goal in their words, the deadline or its absence, the pace,
the program shape, the tutor, and anything the environment cannot do. **Then invite
correction by line**: *"Anything on that list wrong?"* A learner who disagrees with one
item should be able to point at it, not compose a rebuttal of a paragraph. Prose read-backs
were the rule until 2026-08-17 and they buried single wrong items inside sentences the
learner had to unpick. Get one confirmation before generating anything.

**Then say how long the build takes, before you start it, and give the real number for
*this* build.** [playbooks/setup.md](../playbooks/setup.md) § The build estimate is the
arithmetic — a base plus the branches this interview and the probe have just settled. It
is not a fixed figure: a target language with a pack, a working toolchain and a `full`
focus is the short end; a language with no pack is several times that.

State it as a range, say the learner can walk away and come back, and name the branch that
is stretching it when one is. Then generation starts
([playbooks/setup.md](../playbooks/setup.md) → Generation); the learner's part is done.
(Found in the first real onboarding run, 2026-08-15: the interview ended, the longest
silence in the product began, and nothing had predicted it.)
