# Changelog

Every entry carries an `instance-impact:` line — what a personalized copy of this template
must do about the change: `none` (template-repo internals), `engine files auto-update`
(the instance `/update` playbook handles it), or a named regeneration step.

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
