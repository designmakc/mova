---
status: done
kind: infra
phases: 0
summary: Generated this instance from the bare template — English pack built from scratch, profile/goal/curriculum/topics/transfer/taxonomy written, agent adapters and visuals validated.
---
<!-- mova:instance -->
# Workspace setup — generation record

## Status

Generated 2026-09-12 from `templates/profile.template.md`, `goal-functional.template.md`,
`transfer.template.md`, `error_taxonomy.template.md`, `topics.template.md`,
`resources.template.md`, `curriculum.template.md`, `plan.template.md`,
`concept.template.md` — all `template_version: 0.19.0` (this repo's `VERSION` at
generation time). `packs/en/` did not exist and was built from scratch per
`packs/_template/GENERATE.md`, all 7 steps + sign-off.

`node scripts/packcheck.mjs en` — exit 0, 0 warnings.

Build: 65 min wall-clock (estimated 35-60 min per playbooks/setup.md §0b's "no pack"
branch; ran slightly over because the dictionary-reachability probe needed several
live retries before the pattern was clear enough to write up honestly, and the pack's
false-friend/taxonomy rows were mined and cross-checked rather than templated).
Branches taken: pack build. (No install branch — `npm install` was already run before
generation started; no goal-research branch — functional goal, no exam format to look
up; no theming branch — no Hallmark skill available in this environment.)

## Phased Plan

Done — this file is a record, not a plan. See `docs/plan.md` for what happens next.

## Todo

(empty — this project is done)

## Design

Interview answers this build rests on (settled before generation; not re-derived):

- **Target/meta/native:** English / Russian / Ukrainian+Russian (native, bilingual).
  `contrast_ranking: ru > uk` — a same-strength ranking by which language the learner
  produces in during study, not a strength gap between the two. Neither language is
  "weakly held"; see `docs/reference/profile.md` § The contrast ladder for the full
  reasoning, including why neither of the template's two special-case ladder paragraphs
  (one-language / close-pair) actually fit this learner and were both omitted rather than
  forced.
- **Goal shape:** functional (scenario list), not exam/level/ledger — the interview
  explicitly named reading and writing as the current priority, listening as secondary,
  and never raised speaking at all. `docs/reference/goal.md` § Non-goals states the
  speaking exclusion outright so a future session doesn't quietly drift into teaching it.
- **No deadline, no tutor** — both stated plainly at the interview's close; `goal.md`
  carries no `## Tuition` section and `profile.md` has no `goal_date` line.
- **Pack decision — `inflection: true`, sparse.** English is not remotely as
  inflection-rich as the reference Romanian pack; the endings list is 7 entries (vs
  Romanian's 10) and the manifest's `required_fact` was deliberately scoped to
  IRREGULAR verbs only (`irregular-verb-principal-parts`), not every verb — regular verb
  forms are 100% rule-derived from the base form, and requiring a memorised fact for them
  would be requiring what a rule already gives for free. This is a genuine per-language
  judgment call, not a default copied from Romanian's "eu-form for every verb".
- **Dictionary — left empty, not guessed.** `api.dictionaryapi.dev` was live-tested from
  this container across two rounds and five words: some 200s, some timeouts, and the
  not-found case (`xyzzynotaword`) returned HTTP 522 (a Cloudflare origin timeout) on
  every attempt rather than a clean 404 — meaning the one signal the adapter contract most
  needs (found:false vs unreachable) could not be told apart reliably from this
  container. `packs/en/pack.md` § Dictionary reachability records the actual attempts;
  `docs/reference/resources.md` names Merriam-Webster as the human-facing substitute.
- **Audio/TTS/publishing — all off, for stated reasons, not silently defaulted.**
  `afplay`, `say`, and `espeak` were all checked and none exists in this container
  (`audio: false`, `tts: none`). Publishing capability for this session was not
  confirmed reliable enough to advertise as a learner-facing feature, so
  `publishing: none`.
- **Cyrillic/Latin keyboard homoglyphs, not Romanian-style dead-key diacritics.**
  `packs/en/normalize.mjs` folds a different real risk than the reference pack: the
  learner's own reported keyboard is Cyrillic-capable, and several Cyrillic letters are
  visually identical to Latin ones (а/е/о/р/с/х and uppercase). This is `(assumed)` —
  general knowledge about confusable scripts, not measured against this learner's actual
  mis-keys — and is stated as such in `packs/en/normalize.mjs`'s docblock.
- **12 units, rolling wave.** Sized from the goal's 5 scenarios and the ~3-4×20-30min/week
  pace: reading/writing carry most of the unit count (U01-U09, U11-U12), one dedicated
  unit for the explicitly-secondary listening scenario (U10), and the sequence
  front-loads articles (U01) because `transfer.md` names them as the single highest-
  traffic, highest-cost trap for a Russian/Ukrainian-native learner (no article system in
  either held language at all).
- **Error taxonomy — 12 codes**, above the 6-10 "typical" count named in
  `error_taxonomy.template.md`, justified the way the template allows: a genuinely rich
  contrast (two held languages, both diverging from English the same structural ways)
  plus one learner-specific code (SPELL-MEM) earned by the intake snapshot's own stated
  weak point rather than templated in by default.
