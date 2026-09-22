<!-- mova:instance -->
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
pack: en
target_language: English
meta_language: Russian
native_languages: uk, ru
contrast_ranking: ru > uk
goal_kind: functional
goal_label: Reading & writing English for UX/UI work
sections: R W L
units: 12
mode: enforced
agent: claude-code
audio: false
tts: none
publishing: none
focus: full
template_version: 0.19.0
template_source: https://github.com/designmakc/mova
```

## Languages held

| Language | Level | Role here |
| --- | --- | --- |
| Russian (ru) | Native | Production language — the conversation this instance was set up in ran in Russian, and this is the language the learner thinks in day to day. First anchor for both structural and lexical hooks: most vocabulary bridges and grammar explanations will run through Russian. |
| Ukrainian (uk) | Native | Equally native, held at the same strength as Russian — not a weaker second language. Sits right behind Russian on the ladder because Russian is the stronger *production* language in this working context, not because Ukrainian is held less well. Still a fully legitimate recognition and lexical anchor, and pulled forward whenever it offers an equally good or better hook than Russian (shared Slavic vocabulary, or a Ukrainian form that is a closer false-friend match to an English one than the Russian form is). |

English is the target ([goal.md](goal.md)).

## The contrast ladder — which language a hook comes from

1. **Russian first**, whenever a contrast exists and is meaningful — it is the language
   this learner produces in and thinks in during study sessions (this conversation's own
   working language), so an explanation in Russian, or a Russian-anchored vocabulary hook,
   costs the learner no translation step. Kind: both structural and lexical anchor.
2. **Ukrainian second**, not because it is held less well (it is equally native) but
   because Russian is the stronger production language for this learner in this context.
   Ukrainian is pulled to the front of a specific explanation whenever it gives a cleaner
   hook than Russian does — shared Slavic vocabulary, or a case where the Ukrainian
   cognate/false-friend is the closer match to the English form. Kind: lexical anchor,
   occasionally structural where Ukrainian happens to mark something more transparently.

**Never stack.** One anchor carries the point; a second is noise and a third is a
lecture. (limba, learner-confirmed.)

**Which anchor — the picking rule.** With two rungs the live question is *which one*, and
it arrives with most explanations, since Russian and Ukrainian overlap heavily as source
languages for contrast with English. Rule: **structure from the strongest structural
anchor, vocabulary from the strongest lexical one** — usually Russian for both here, since
neither language is weak, but check Ukrainian first whenever a specific word or form is a
closer match there (a false friend or shared root that lines up better with Ukrainian
spelling/sound than Russian's). Tie-breakers, in order: the anchor closest to the specific
form, then the one the learner holds most strongly (a genuine tie here — both are native),
then the meta-language. A weakly-held rung would never supply a production model, but
neither rung here is weakly held — this is a same-strength ranking based on the
conversation's working language, not a strength gap, so both remain fully legitimate
sources for either structure or vocabulary depending on which fits the specific point
better.

## Operational profile

Not linguistic facts — things about how the learner works that a session must not
re-derive. Seeded from the interview `(assumed)` unless the learner stated them
outright; new entries accrete here **dated, with the incident that earned them** (the
retro verb routes them here).

- **Time budget:** 3-4 study blocks weekly, ~20-30 min each (interview, 2026-09-12).
- **Focus:** `full` (lessons, drills, writing practice, mock tests) but weighted toward
  reading and writing over listening, per the learner's stated priority; speaking is out of
  scope entirely — no speaking scenario was named at any point in the interview (interview,
  2026-09-12).
- **Keyboard / input method:** Cyrillic-capable keyboard layout, already comfortable typing
  English on it — no keyboard blocker was raised (interview, 2026-09-12). Still watch for
  look-alike codepoints (Cyrillic/Latin homoglyphs); findings route to `packs/en/normalize.mjs`,
  never to the error tally — see that file's `LOOKALIKES` map, seeded `(assumed)` at pack
  generation from the general Cyrillic/Latin homoglyph risk, not yet measured against this
  learner's actual mis-keys.
- **How this workspace talks to you** is an engine rule, not a per-learner setting —
  `docs/mechanics/narration.md` owns it. No departure requested; the default applies.
- **Weak point, self-reported:** poor at memorising vocabulary and its spelling — see the
  intake snapshot (`docs/snapshots/2026-09-12_intake.md`) for the learner's own words. This
  is why `packs/en/notes.md` ranks SPELL-MEM as a high-traffic error code for this learner
  specifically, and why the goal's scenario list names "confidently writing and remembering
  word spelling" outright (interview, 2026-09-12).
- **No tutor.** No Tuition clause in `docs/reference/goal.md`, no tutor-prep activation
  (interview, 2026-09-12).

## Measured, not assumed

Nothing yet — this instance has not measured anything about its learner.

**The accretion convention:** bullets arrive **dated, with the incident attached**
(`SES-NNN` / `ERR-NNN` / snapshot), stating what was measured and how. The retro verb
routes findings here; the review verb re-fits engine defaults against them once ~10
sessions of data exist. A claim without a citation goes to the Operational profile as
`(assumed)`, not here — this section is what separates what the workspace *knows* about
this learner from what it guessed.
