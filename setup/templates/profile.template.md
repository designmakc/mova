<!-- mova:template -->
<!--
  GENERATES: docs/reference/profile.md — read every session at orient.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance` and delete every guidance comment,
    including this one. Fill every {{PLACEHOLDER}}; a placeholder that survives
    generation is a setup failure.
  - The ```mova-config block is the ONE machine-readable surface: keys UNINDENTED
    (shell scripts sed-read them), one `key: value` per line, `#` comments allowed,
    parsed by scripts/profile.mjs. Prose stays prose — no script may ever need a
    second block.
  - OMIT the goal_date line entirely when the goal has no deadline. Do not write an
    empty value.
  - template_version is copied from the VERSION file at generation time.
  - Write only what the interview established. Every claim about how this learner
    LEARNS is born `(assumed)` until measured — see the accretion section. Provenance
    markers per docs/mechanics/README.md.
-->
# The learner — languages held, how they work, what is already settled

> Who is on the other side of every session. **Read at orient.** limba added this file
> after a housekeeping audit found a *tooling preference* logged as a *language error* for
> five days: nothing recorded how the learner operates, so every session re-derived it
> from behaviour — and derivation from behaviour cannot tell "can't" from "chose not to".
>
> [concept.md](../concept.md) says why this workspace exists; this file says who it is
> for. Measured language-pair facts live in [transfer.md](transfer.md); this file owns
> the **ranking** that decides which language a contrast is drawn from.

```mova-config
pack: {{PACK_CODE}}
target_language: {{TARGET_LANGUAGE}}
meta_language: {{META_LANGUAGE}}
native_languages: {{NATIVE_LANGUAGES}}
contrast_ranking: {{CONTRAST_RANKING}}
goal_kind: {{GOAL_KIND}}           # exam | level | functional | ledger
goal_label: {{GOAL_LABEL}}         # short display phrase, e.g. "B1 exam"
goal_date: {{GOAL_DATE}}           # OMIT THIS LINE when the goal has no deadline
sections: {{SECTIONS}}             # assessment section letters, e.g. R W L S
units: {{UNITS}}                   # must equal what curriculum.md defines — tests enforce
mode: {{MODE}}                     # enforced | unenforced
agent: {{AGENT}}                   # claude-code | opencode | codex | antigravity | other
audio: {{AUDIO}}                   # true | false
tts: {{TTS}}                       # edge | say | none
publishing: {{PUBLISHING}}         # none | claude-artifacts
focus: {{FOCUS}}                   # full | drill | vocab | writing (extension key — see setup/scenarios/focus_modes.md)
template_version: {{TEMPLATE_VERSION}}
```

## Languages held

<!-- One row per language from interview Topic 1, target excluded. Role states WHY the
     language sits where it does in the ranking — one line each, in contrast terms
     ("first anchor for…", "concept-layer only, held too weakly for vocabulary"). -->

| Language | Level | Role here |
| --- | --- | --- |
| {{LANGUAGE}} | {{LEVEL}} | {{ROLE}} |

{{TARGET_LANGUAGE}} is the target ([goal.md](goal.md)).

## The contrast ladder — which language a hook comes from

<!-- Numbered, strongest anchor first, mirroring contrast_ranking above. State the why
     per rung. Close with the never-stack rule — it is engine doctrine, keep it.
     ONE-LANGUAGE LEARNERS: write the inverted form below instead; the ladder has a single
     rung and the rule that matters flips. Do not pad the ladder to look complete. -->

1. **{{FIRST_ANCHOR}} first**, whenever a contrast exists and is meaningful — {{WHY}}.
2. {{FURTHER_RUNGS}}

**Never stack.** One anchor carries the point; a second is noise and a third is a
lecture. (limba, learner-confirmed.)

**When the ladder has one rung** (the learner holds only their native language), the
never-stack rule is satisfied for free and stops being the useful discipline. Its live
form is the opposite: **never manufacture an anchor to fill a silence.** Where the one
language offers no hook, say so and teach the system on its own terms — an invented
half-parallel is worse than none, because the learner will trust it. Expect the transfer
map to come out *asymmetric*, not thin: long where the languages genuinely touch (sounds,
shared vocabulary layers, word order), and a list of **absences** where they do not. An
absence is a finding: the learner will not produce a form wrongly, they will not produce
it at all, because nothing in what they know opens that slot. (Found generating an
English-only instance, 2026-08-14.)

## Operational profile

Not linguistic facts — things about how the learner works that a session must not
re-derive. Seeded from the interview `(assumed)` unless the learner stated them
outright; new entries accrete here **dated, with the incident that earned them** (the
retro verb routes them here).

- **Time budget:** {{SESSIONS_PER_WEEK}} sessions/week, ~{{MINUTES_PER_SESSION}} min each
  (interview, {{DATE}}).
- **Focus:** {{FOCUS_DESCRIPTION}} (interview, {{DATE}}).
- **Keyboard / input method:** {{KEYBOARD_NOTES}}. <!-- If nothing was declared, write:
  "nothing declared yet — watch for look-alike codepoints; findings route to the pack's
  normalize.mjs, never to the error tally". -->
- **Plain language at the moments that matter** — decision questions and close-outs drop
  codes, tiers and file paths. (Engine default; every learner so far has wanted it.)
- {{FURTHER_INTERVIEW_FACTS}}

## Measured, not assumed

<!-- GENERATE THIS SECTION EMPTY — the convention paragraph below and nothing else.
     Setup never writes a bullet here: this section is the instance's slowest, most
     valuable accretion and it must contain only evidence. -->

Nothing yet — this instance has not measured anything about its learner.

**The accretion convention:** bullets arrive **dated, with the incident attached**
(`SES-NNN` / `ERR-NNN` / snapshot), stating what was measured and how. The retro verb
routes findings here; the review verb re-fits engine defaults against them once ~10
sessions of data exist. A claim without a citation goes to the Operational profile as
`(assumed)`, not here — this section is what separates what the workspace *knows* about
this learner from what it guessed.
