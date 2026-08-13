# Changelog

Every entry carries an `instance-impact:` line — what a personalized copy of this template
must do about the change: `none` (template-repo internals), `engine files auto-update`
(the instance `/update` playbook handles it), or a named regeneration step.

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
