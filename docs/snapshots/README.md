<!-- mova:engine -->
# docs/snapshots/ — frozen point-in-time assessments

**Conventions:**

- **Filename**: `YYYY-MM-DD_slug.md` (e.g. `2026-08-10_placement.md`,
  `2026-11-30_mock_full.md`).
- **Frozen once written** — never retro-edited. A later snapshot supersedes; it doesn't
  rewrite history.
- **Every snapshot has a `## Method` section** stating exactly what was exercised (tasks,
  timing, aids allowed) and, crucially, a **"Not exercised:"** list — so each finding's
  confidence is legible months later.
- **Findings feed the plan**: repair items land in `docs/plan.md` (the current phase or
  the Discovered bin) in the same session — a snapshot that changes nothing was a
  ceremony.
- Snapshots have no status and stay out of the Projects Index.
- **No index table lives in this file, and none may be added.** The filenames *are* the
  index — dated, slugged, chronologically sorted by any `ls` — and the plan's phase gates
  plus the hub link the ones that matter. This README is engine-owned: `upstream/manifest.json`
  hashes it and [../../playbooks/update.md](../../playbooks/update.md) §§ 6–7 treat any
  local change to a manifest file as a divergence to be talked through. One appended intake
  row would therefore buy a three-way conversation at every `/update`, forever, over a
  table that duplicates the directory listing. (Found generating the 2026-08-15 test
  instances, both of which had an intake row and nowhere honest to put it.)

| Kind | Written by | When |
| --- | --- | --- |
| Intake | [../../playbooks/setup.md](../../playbooks/setup.md) — self-reported starting point, "Not exercised: everything" | once, at setup |
| Placement | the first session, on whichever verb carries placement in this focus mode — [lesson](../../playbooks/lesson.md) under `full`, [drill](../../playbooks/drill.md) under `drill`/`vocab`, [write](../../playbooks/write.md) under `writing` (`setup/scenarios/focus_modes.md`) | once, Phase 0 |
| Level assessment | [../../playbooks/review.md](../../playbooks/review.md) | every ~4 weeks or phase boundary |
| Mock result | [../../playbooks/mock.md](../../playbooks/mock.md) | per the goal contract's assessment program |
