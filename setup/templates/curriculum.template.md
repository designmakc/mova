<!-- mova:template -->
<!--
  GENERATES: docs/curriculum.md — the ordered unit map the lesson verb walks.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - HEADING CONTRACT (docs/curriculum.test.ts): every unit heading is exactly
    `## U{{NN}} — {{title}} ({{level}})` — two-plus digits, em dash, level from the
    pack's level_scale. Unit numbers unique, strictly ascending, NEVER renumbered.
    Exactly ONE `status:` line per unit: `status: pending` at generation (a covered
    date is a measurement, and setup measures nothing). Unit count MUST equal the
    profile's `units:` — change both together.
  - ROLLING WAVE: detail the first 3 units in full (all bullet rows); the rest get
    heading + status + one orientation line only. Detail is added at each phase entry,
    informed by the error log — detail written months ahead is guessed twice.
  - Build from the goal: every detailed unit names the assessment sections it serves
    (letters ⊆ profile `sections:`). Functional goals: units serve scenarios, name
    them. Sources are CITATIONS ONLY (unit/page) — never copied content.
  - Draw grammar sequencing from the pack's notes.md grammar-system inventory and the
    transfer file's trap list — front-load the systems the learner's held languages
    cannot see. Every sequencing judgment is `(assumed)` until the placement session.
-->
# Curriculum — U01–U{{NN}}, {{START_STATE}} to {{GOAL_LABEL}}

> The ordered unit map: {{ORGANIZING_LOGIC — level descriptors + assessment demands, or
> the scenario list}} arranged into ~{{UNITS}} themed units. **Rolling wave**: the first
> units are drafted in full; later ones are deliberately coarse and get detailed at each
> phase entry, informed by the error log.
>
> Conventions: each unit carries exactly one `status:` line — `pending` or
> `covered YYYY-MM-DD` (flipped by the lesson verb when the unit's last session closes;
> enforced by `curriculum.test.ts`). Sources are citations only. Assessment-section
> letters: {{LETTER_LEGEND — e.g. **R** Reading · **W** Writing · **L** Listening ·
> **S** Speaking}}.

---

## Phase 1 — {{PHASE_TITLE}}

## U01 — {{TITLE}} ({{LEVEL}})
status: pending
- **Grammar:** {{SYSTEMS_AND_FORMS}}
- **Vocab domain:** {{DOMAIN}} (~{{N}} items)
- **Can-do:** {{CAN_DO}}
- **Assessment sections:** {{LETTERS}}
- **Sources:** {{CITATIONS — from the pack's materials list, match by topic until owned}}
- **Transfer notes:** {{HOOKS_AND_TRAPS — from transfer.md, (assumed) until measured}}
- **Media:** {{AUDIO_OR_VISUAL_FIRST — honor the audio capability flag}}

## U02 — {{TITLE}} ({{LEVEL}})
status: pending
- {{FULL_DETAIL_AS_U01}}

## U03 — {{TITLE}} ({{LEVEL}})
status: pending
- {{FULL_DETAIL_AS_U01}}

---

## Phase 2 — {{PHASE_TITLE}} (coarse — detail at phase entry)

## U04 — {{TITLE}} ({{LEVEL}})
status: pending
- {{ONE_ORIENTATION_LINE — main systems; sections served}}

<!-- …continue: one coarse unit per heading through U{{NN}}. The final unit is normally
     the goal's gate — full mock / descriptor sweep / scenario-run day — so the
     curriculum ends where the goal contract says "done" begins. -->
