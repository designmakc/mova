<!-- mova:engine -->
# packs/<code>/notes.md — <Language> language facts for setup

<!-- Flip the marker above to `mova:pack` when instantiating, and delete these guidance
comments. Reference for STRUCTURE: ../ro/notes.md. Reference for CONTENT: nothing here —
every row below is derived from a source for the target language.

This file exists because a setup session mines it to generate the instance's
docs/mechanics/error_taxonomy.md and docs/reference/transfer.md. Whatever is wrong here
propagates into a learner's workspace and is graded against for months: two self-
contradictory taxonomy rows in the first agent-generated pack landed verbatim in the
generated instance. (Found in the first agent-generated language pack, 2026-08-15.)

The failure mode this skeleton exists to prevent: copying ../ro/notes.md and translating
the parts you notice. Copy its SECTION LIST; retype its content from your own sources. -->

> Reference material a **setup session mines** when the learner's target is <Language> —
> raw input for generating the instance's `docs/reference/transfer.md` and error-taxonomy
> file from `setup/templates/`. Nothing here is instance state.
> Provenance: <where these codes and notes come from, and which learner profile they were
> ranked for — re-rank the interference notes for a different language pair>.

## Error taxonomy reference

<!-- The codes a tally pipeline reads, with examples in the target language. The instance
generator ports the ones relevant to ITS learner and drops the rest; codes are appended in
the session that first needs them, never invented ahead of data.

EVERY ROW SHOWS A CONTRAST — packcheck lints this table and fails the pack otherwise:
  - the ✗ marks the WRONG form,
  - the correction follows `→`,
  - the two are DIFFERENT STRINGS.
Rows that shipped and should not have:
  ✗ *Ich komme spät an* → Ich komme spät an     (identical — no contrast at all)
  ✗ *aktuell* (current) confused with *aktuell* (current)   (the same form twice)
  ✗ *mit dem Mann* (correct dative) vs *mit der Mann*       (✗ on the correct form)
A row you cannot write as a contrast is a row whose code you do not yet understand. Leave
it out; codes accrete when data earns them. -->

| Code | Zone | Example error |
| --- | --- | --- |
| <CODE> | <plain-language area> | ✗ *<wrong form>* → <corrected form> |

Scope rulings that keep the codes sharp (each earned by a misrouted drill):

- <the boundary between two neighbouring codes, one line — added when a mis-filed entry
  shows the boundary is unclear. Include the one every pack needs: which code owns a
  MISSING diacritic, and that input-method look-alikes are folded by normalize.mjs and
  never scored.>

## Resource registry

<!-- Vetted links, checked by visiting them. Per-word URL patterns first (derive, don't
search), then channels and sites. Note what blocks bots, what needs a browser UA, what is
paid. A dead link here becomes a dead link in the learner's reference file. -->

Per-word URL patterns — derive, don't search:

| Need | Pattern | Notes |
| --- | --- | --- |
| Native pronunciation | `https://forvo.com/word/<word>/#<code>` | real recordings; blocks bots |
| Definition (monolingual) | <the language's own dictionary> | |
| Full paradigm | <conjugation/declension source> | |

Channels & sites:

| Resource | Use it for |
| --- | --- |
| <resource> | <what it is good for, and from which level> |

TTS: <edge-tts voice ids, matching the manifest> / macOS `say` <voice>. STT: whisper `-l
<code>`. Native recordings outrank any TTS for prosody.

## Materials sources

<!-- Acquisition targets for the instance's untracked materials/ — textbooks, past papers,
free official samples. Copyright: cite by unit/page, never commit content. Say which are
free and which must be bought. -->

- <title, publisher, level range — what it is for>

## Grammar system inventory

<!-- The discrete systems a curriculum for this language tracks — the section headings the
instance's topics file will hold aspect rows under. Derived from a grammar of the target
language, not from the Romanian list. -->

- <system name (the aspects it holds)>
