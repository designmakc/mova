<!-- mova:engine -->
# setup/interview.md — the onboarding interview

> The script [playbooks/setup.md](../playbooks/setup.md) drives. The person answering is a
> **learner, not an operator**: plain language, one topic at a time, no jargon, no file
> paths or config keys in the questions themselves. The technical mapping under each topic
> is for you, the agent — never read it aloud. Ask follow-ups freely; the questions below
> are the floor, not a form to administer. Collect everything before generating anything —
> a half-interviewed profile generates a workspace that has to be interviewed again.
>
> Interview in whatever language the human opened with; their explanation language is
> asked in Topic 1, and everything generated uses that.

## Conduct

- **One topic per exchange.** Never a numbered questionnaire dump.
- **Reflect back before moving on** — one sentence of what you understood, so a wrong
  guess dies in the interview, not in the generated workspace.
- **Record answers verbatim where they matter** (scenario lists, the goal in the
  learner's own words) — the templates want the learner's phrasing, not your summary.
- **The environment probe (Topic 7) is run, not asked.** The learner is never asked
  whether node is installed; you check.

---

## Topic 1 — Languages

*Why: every explanation in this workspace is built on contrasts with languages the
learner already holds; the ranking decides which language a contrast is drawn from.*

Ask, conversationally:

1. Which language do you want to learn?
2. What language should I explain things in?
3. What is your native language — or languages, if more than one?
4. What other languages do you know, even a little? For each: how comfortable are you —
   would you say beginner, comfortable, or fluent?

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

## Topic 2 — The goal

*Why: `docs/reference/goal.md` is the spec for every scope decision this workspace will
ever make; a workspace without one is mis-generated. Refusing to proceed goalless is a
design rule, not a preference.*

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

**Maps to:** config `goal_kind` (`exam` | `level` | `functional` | `ledger`),
`goal_label` (short display phrase, e.g. "B1 exam" or "10 scenarios"), `goal_date` (omit
the config line entirely when there is no deadline), `sections` (assessment section
letters, e.g. `R W L S` — for non-exam goals, the letters you assign to the skill areas
the goal exercises). The branch selects the goal template variant — see
[scenarios/](scenarios/).

## Topic 3 — Starting level

*Why: the first session is the real placement (a measured snapshot, limba's pattern);
this self-assessment only seeds the curriculum's starting shape and gives the placement
something to check itself against.*

Ask: Have you studied this language before? What can you already do with it — understand
some? say anything? read? Anything you know is already easy, or already hard?

Say plainly that the first study session will be a **placement** — a gentle probe, not a
test to pass — and that today's answer just sets a starting guess.

**Promise the ritual, not a verb.** Topic 5 has not run yet, so you do not yet know which
verb carries placement here (`lesson` under `full`, `drill` under `drill` and `vocab`,
`write` under `writing` — [scenarios/focus_modes.md](scenarios/focus_modes.md) § Placement
and assessment run in every mode). Say "the first session"; never "the first lesson". The
handoff names the verb, once the focus mode is settled, and it is the only place that
should. (Found generating an Italian-native vocabulary-only instance, 2026-08-15.)

**Maps to:** the intake snapshot (`docs/snapshots/`) records the self-assessment
verbatim; the curriculum step uses it to place the starting units; nothing else trusts
it. It never sets a `covered` status — only measurement does that.

## Topic 4 — Time budget

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

## Topic 5 — Focus mode

*Why: not every learner wants the full apparatus; the focus mode decides which verbs the
workspace answers to.*

Ask: Do you want the full program — lessons, drills, writing practice, mock tests — or a
narrower one? Some people want only daily drills, or only a vocabulary keeper, or only
writing correction.

Offer the four shapes in plain words: **everything** · **just drills** (short practice on
what's already in) · **just vocabulary** (capture and review words) · **just writing**
(compose and get corrected).

**Maps to:** config `focus` (`full` | `drill` | `vocab` | `writing` — an extension key,
see profile template) and the active-verb table in
[scenarios/focus_modes.md](scenarios/focus_modes.md). A non-full focus prunes the
curriculum and plan accordingly.

## Topic 6 — Tuition

*Why: a human tutor is the workspace's only source of confirmed language facts besides
the dictionary; if one exists, the workspace routes its unverified-fact list through
them.*

Ask: Do you work with a tutor or teacher, or plan to? How often do you meet? Would you be
willing to bring a short list of things for them to double-check now and then — it costs
them minutes and keeps this workspace honest?

**Maps to:** the goal contract's `## Tuition` section (present only when the answer is
yes), the tutor-prep verb activation, and the spot-check loop in
`docs/mechanics/verification.md`. The **meeting** cadence — how often the two of them
actually sit down — is the one number this topic collects, and the only one the Tuition
clause states. The prep-pack and spot-check cadences belong to
[playbooks/tutor-prep.md](../playbooks/tutor-prep.md) and are never re-stated here as a
number. See [scenarios/tuition.md](scenarios/tuition.md).

## Topic 7 — Environment probe (RUN, don't ask)

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
  `mode: unenforced`, and say so plainly.
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
  confirms them).
- **Publishing**: can you publish pages the learner can open outside the repo (e.g.
  Claude artifacts)? → `publishing:` (`none` | `claude-artifacts`). Ask the learner only
  if both options genuinely work: "want your study pages as shareable links, or as local
  files?"

**Maps to:** config `mode`, `agent`, `audio`, `tts`, `publishing`. Findings that surprised
you (no audio, no dictionary) get one plain-language sentence to the learner each — not a
capability report.

---

## Close

Read back the whole picture in five sentences or fewer — target, goal, pace, focus, and
anything the environment can't do. Get one confirmation. Then generation starts
([playbooks/setup.md](../playbooks/setup.md) → Generation); the learner's part is done.
