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
  - template_source is where /update fetches the template from. Resolve it at setup —
    `git remote get-url origin`, else the URL this copy was fetched from — and OMIT the
    line only when neither exists. Do not ask the learner for it; a URL they have to
    produce is a question setup already had the answer to.
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
template_source: {{TEMPLATE_SOURCE}}   # OMIT THIS LINE when this copy has no discoverable origin
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
     per rung, and state each rung's KIND — structural anchor, lexical anchor, or both —
     because the picking rule below is written off exactly that. Close with the
     never-stack rule and the picking rule; both are engine doctrine, keep them.
     A SHORT LADDER COMES IN TWO KINDS and they invert each other — keep the paragraph
     that matches this learner, drop the other, keep both when both apply:
     ONE-LANGUAGE LEARNERS (short because they hold little) — write the inverted form
     below; the ladder has a single rung and the rule that matters flips. Do not pad the
     ladder to look complete. CLOSE-PAIR LEARNERS (short because one anchor covers nearly
     everything) — keep the close-pair paragraph. A long ladder keeps neither. -->

1. **{{FIRST_ANCHOR}} first**, whenever a contrast exists and is meaningful — {{WHY}}.
2. {{FURTHER_RUNGS}}

**Never stack.** One anchor carries the point; a second is noise and a third is a
lecture. (limba, learner-confirmed.)

**Which anchor — the picking rule.** Never-stack says *one*; with two or three rungs the
live question is *which one*, and it arrives with every explanation, because on a ladder
this long nearly every structure has a hook somewhere. Rule: **structure from the
strongest structural anchor, vocabulary from the strongest lexical one** — often not the
same language, which is why every rung above names its kind. Tie-breakers, in order: the
anchor closest to the specific form (a shared construction beats a family resemblance),
then the one the learner holds most strongly, then the meta-language — an explanation the
learner reads without translating is worth a slightly weaker parallel. A weakly-held rung
still never supplies a production model; it remains a legitimate recognition hook,
vocabulary included. (Found generating a German-native level goal with a tutor,
2026-08-15: with three rungs the instance had to invent this rule and shipped it
`(assumed)`.)

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

**When the ladder is short because the pair is close** — one anchor covers almost
everything (Italian for Romanian: same family, same categories, near-identical inventory)
— the shortness means the opposite of the case above and the risk inverts with it. There
the learner had no hook and knew it. Here the learner has a confident opinion about every
form, is right most of the time, and that is exactly what hides the times they are not:
transfer runs unbidden, and no silence marks the spot for either of you. So the transfer
map's centre of gravity moves off *hooks* — those are free — and onto **near-misses**, the
forms where the two systems diverge by one small step, and onto **alignments said out
loud**, because an advantage the learner is never told they hold is one they use only by
accident. Expect a long false-friends table and a short list of genuine absences: the
mirror image of the one-rung instance, and it needs the mirror-image effort. (Found
generating an Italian-native vocabulary-only instance, 2026-08-15.)

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
- **How this workspace talks to you** is an engine rule, not a per-learner setting —
  `docs/mechanics/narration.md` owns it: what gets priced before it starts, what gets
  announced, and the codes, tiers and paths you never have to read. Note a **departure**
  here if this learner wants one (more detail, less, a different language for corrections);
  the default needs no bullet. <!-- This line was a seeded engine default until 0.8.0, which
  meant an engine rule was stored once per instance where no template update could reach
  it. Keep it as a pointer; write a bullet only for what this learner asked to change. -->
- {{FURTHER_INTERVIEW_FACTS}} <!-- The open floor's home — whatever the learner
  volunteered when asked "anything else I should know before I build this?"
  (setup/interview.md § The open floor): a stretch of weeks they will lose, the domain the
  language has to work in, something that failed for them before. One bullet each, seeded
  `(assumed)`, dated. Nothing volunteered ⇒ drop this line entirely. -->

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
