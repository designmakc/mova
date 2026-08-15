# Changelog

Every entry carries an `instance-impact:` line — what a personalized copy of this template
must do about the change: `none` (template-repo internals), `engine files auto-update`
(the instance `/update` playbook handles it), or a named regeneration step.

## 0.4.0 — 2026-08-15

Fixes from the first two lesson pages ever generated in real instances — a German page
(opencode/MiMo) and a Romanian page (Antigravity/Gemini Flash 3.7). Both passed every gate
the workspace had. Both were broken in the same places, which makes them template defects,
not model defects.

- **Every guided attempt on both pages printed its own answer** — "3 of 3 items give their
  answer away" and "5 of 5". The detector that catches this shipped in the repo, had a mode
  built for exactly this page kind, and was named in none of the four documents an agent
  reads while building a page. `visualcheck` is now the single publish gate for a page and
  runs the leak check itself, failing on HIGH. The starter no longer prints the unverified
  promise "the answer appears nowhere else on this page" to the learner.
- **The starter scaffolded four sections; teaching requires eight beats** — in the same
  numbered typography, while the spec says to start from the starter and figure out nothing.
  Both pages were missing exactly the beats the scaffold had no slot for, and beat ⑥ (naming
  what was used but not taught) was missing from both. The starter now scaffolds all eight,
  each saying why it exists and when deleting it is legitimate.
- **A teach-page word list printed open is a drill surface** — the German page's ten-row
  open table was the direct cause of its leak. Now checked, with paradigm tables (the same
  word in several target forms) explicitly exempt as reference material.
- **~70 asserted language facts across the two pages carried no verification trail.** Pages
  now need visible `?` markers or a source note; a pack with no dictionary must say so on
  the page.
- **`formal场合` and a mojibake glyph reached learner-facing files** through every gate.
  Pages are now script-range checked against the instance's own languages.
- **The lesson playbook contradicted the mechanic it tells you not to re-derive**, running
  applied practice before the graded check — the pre-swap order, reversed in the mechanic
  with a warning that scores are not comparable across the change.
- **The placement gate could never fire**: it tested for any snapshot, and setup always
  writes one. It now tests for a *placement* snapshot. Declining the probe is a supported
  choice that records the level as `GUESSED` and leaves the plan milestone open — a guessed
  level is a debt, not a measurement.
- **"Built, not taught" is now a state.** Material prepared without a session gets an index
  row with no delivery date and a hub regeneration so the learner can open it — and writes
  no ledger rows, no scores, no session entry.
- **The visuals index header never matched the code reading it.** `hub.mjs` reads those
  cells positionally; the template declared a different order, so every instance dashboard
  has been rendering scrambled visual cards. Header fixed and the readers documented as
  positional.
- **The pack validator passed a hollow pack.** The first agent-generated pack (German) had
  a normaliser mapping every character to itself, six test fixtures that all pass against a
  function that does nothing, `inflection: false` on a language whose own word list is full
  of Buch/Bücher, a fabricated Duden citation over two endings that are not plural endings,
  and four taxonomy rows whose "wrong" form equalled its own correction — two of which
  reached the generated instance. That pack now fails with 13 named errors. Empty manifest
  keys must be justified in prose; fold claims are executed, not read; fixtures must
  exercise behaviour. `GENERATE.md` now ends each step in output the agent must show.
- Also: the reference Romanian pack gained the four uppercase normalisation fixtures its
  own spec asked for, and the taxonomy linter now runs against the generated instance file
  as well as the pack notes.
- instance-impact: **engine files auto-update, and one manual step.** Any instance created
  before today has the old column order in `work/visuals/README.md` — rewrite that header to
  `Date | Page | Teaches | Units | Kind` when updating, or the dashboard stays scrambled.
  Existing pages will now fail `visualcheck`; that is the point, and fixing them is the
  learner's call, not the updater's.

## 0.3.0 — 2026-08-15

Fixes from two generated instances: an Italian-native learner with no formal goal and a
vocabulary-only focus, and a German-native learner at B1 aiming for B2 with no date and a
weekly tutor. Both passed their own suites (112 and 130 tests); both friction logs traced
back to the same root — **the templates assumed a full-focus learner working toward an
exam**.

- **The handoff promised a verb the instance refuses.** Setup ended by telling every
  learner to say "lesson", which is switched off under a narrow focus — the first
  instruction a learner ever received would have failed. `focus_modes.md` now carries the
  rule everything cites: placement and assessment run in every mode, on whichever verb is
  live (placement rides lesson / drill / drill / write; assessment rides mock / drill /
  drill / mock). Five files defer to it. The interview now promises the ritual and never
  names a verb, because the focus mode is not known when it asks.
- **The pacing arithmetic check was inert on both no-deadline goal kinds.** It arms only
  when the goal states a volume target, and neither the level nor the functional template
  emitted one — so exactly the goals with no date to keep them honest also had no numbers
  check. Both templates now emit it, and smoke reads a skip as a defect for those kinds.
- **The tuition cadence contradicted itself** between the scenario file and the playbook
  that actually runs. Named both cadences, made the playbook the authority, and added
  `playbooks/` to setup's Reads list — the contradiction had been undiscoverable.
- Scenario files disagreed about which verbs are active; every goal template's Assessment
  section now names the verb that runs it, since a running instance never reads `setup/`.
- The curriculum is no longer described as optional under a narrow focus (everything
  downstream requires it; under a narrow focus it orders capture rather than being walked).
- **Two kinds of short contrast ladder.** The existing guidance covered a learner who holds
  little. A learner whose one language is a close relative has a short ladder for the
  opposite reason, and the risk inverts: they hold a confident opinion about every form,
  and it is sometimes wrong. Both cases now stand side by side.
- "The systems align" is a finding in every transfer section, not only register — an
  alignment the learner is never told about is an advantage they never use.
- With several anchors available, the rule that mattered daily was missing: which one to
  reach for. Added, plus a correction — a weakly-held language is barred as a *production*
  source, not as a recognition-side lexical bridge.
- Seed counts became selection rules rather than arithmetic a careful agent has to break.
- The hub called its topic-aspect total "grammar taught" on a page where many aspects are
  lexical; the snapshots README carried an index table an instance could not append to
  without diverging from the template at every update.
- Five further defects surfaced while wiring the above: the lesson playbook's placement
  trigger could never fire, the drill playbook had no placement clause to receive it, the
  mock playbook wrote to the removed index table, and both the README and the level
  scenario carried the same stale assumptions.
- instance-impact: engine files auto-update. Existing instances keep their generated
  files; the setup and template changes affect future generations only.

## 0.2.2 — 2026-08-15

- **README gained a free-path onboarding section** for people who have never installed a
  local AI tool. It names its audience, says plainly that the paid mainstream agents are
  easier and steadier, then gives the free route: opencode Desktop with two free engines
  connected at once — DeepSeek V4 Flash (Free), built into opencode, for driving the workspace's
  scripts, and Gemini 3.7 Flash on a free Google AI Studio key for the teaching-heavy
  sessions — so no single provider's promo ending can strand a learner mid-course. Carries
  the two warnings that decide the choice: free tiers may train on the learner's profile,
  error history and writing, and free tiers close without notice (four did between April
  and June 2026).
- instance-impact: none (README is template-facing; nothing in an instance changes).

## 0.2.1 — 2026-08-14

Fixes from the first full setup proof run (a fictional English-native learner, Romanian
exam scenario, generated from a bare template copy — 138 tests passed on the instance).

- **Setup could not install its own dependencies.** No file ran `npm install`, so the
  zip-download path met `vitest: command not found` at the first smoke step, right after
  the interview promised the learner was done. The environment probe now installs and
  verifies, and smoke names the failure as the agent's, not the generated files'.
- **The `mova:instance` marker broke project-file frontmatter** — an HTML comment above
  `---` makes `status:`/`kind:` parse as null and fails four tests. Marker placement now
  has its stated exception.
- **Focus-mode values disagreed** (`writing` in the profile, `write` in two playbooks), so
  a writing-focus instance would have refused its two core verbs.
- Per-step `npm test` validation was unsatisfiable at steps 5–7 (the adapters suite arms
  at step 1); steps now validate the suites they own, with full green as step 8's gate.
- `docs/reference/resources.md` had no generation step and would never have existed.
- `scripts/dictionary.mjs` gained the reachability CLI the probe and smoke both call for
  (a silent exit 0 read as a pass); `visualcheck --all` now covers the reference pages CI
  checks and stops calling a generated instance "template mode"; `setup` no longer ships
  an adapter for the one verb that refuses to run; deck's status line, and profile.mjs's
  documented key list, both fixed.
- Two pedagogy findings from the monolingual case, now in the templates: with one held
  language the "never stack anchors" rule inverts into *never manufacture an anchor to
  fill a silence*, and an error a language **failed to prevent** needs a different repair
  than one it **caused**.
- instance-impact: none (no instances exist yet); once they do, engine files auto-update
  and the setup/ templates only affect future generations.

## 0.2.0 — 2026-08-13

- Engine extracted from limba per `upstream/map.md`: mechanics docs (srs, session_format,
  teaching, media + new verification.md), all generic scripts (queue, tally, leakcheck,
  log-append, feedback, inline-md, deck, hub, tts-embed/warm, speak, pronounce), contract
  tests with template-mode skip guards, state/logs skeletons.
- Language-pack layer: `scripts/pos.mjs` generic driver (`createClassifier(tables)`),
  `packs/ro/` reference pack (behavior-identical to limba — 475 ledger comparisons, 0
  diffs), `packs/SPEC.md`, `packs/_template/` + GENERATE.md, `scripts/packcheck.mjs` with
  golden fixtures in CI.
- Visual system in `docs/visual/`: SPEC.md, Hallmark-informed tokens.css (OKLCH, spacing
  scale, type pairs; MIT attribution), starter.html, gallery.html, `scripts/visualcheck.mjs`.
  Consistency deliberately overrides Hallmark's layout variation.
- New engine seams: `scripts/profile.mjs` (the one reader of the profile config block),
  `scripts/pack.mjs` (active-pack loader), `scripts/dictionary.mjs` (adapter interface +
  null adapter), `scripts/factcheck.mjs`, `scripts/manifest.mjs` (engine-file hashes).
- Fixes found while porting, not yet upstreamed to limba: hub.mjs review tile printed
  `undefined to produce`; tts-embed re-run miscounted clips; teaching.md beat
  cross-reference (② precedes ④) and list numbering.
- instance-impact: none (no instances exist yet).

## 0.1.0 — 2026-08-13

- Bootstrap: repository skeleton, `upstream/map.md` (total map of limba → mova),
  `upstream/limba.lock` at PORT-001. limba adopted the porting convention
  (`docs/logs/porting_log.md`) in the same change.
- instance-impact: none (no instances exist yet).
