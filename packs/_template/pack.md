<!-- mova:engine -->
# packs/<code> — <Language>

<!-- Replace the marker above with `mova:pack` when instantiating. Prose header: what
this pack is, where its facts come from, what it deliberately leaves out. Then the
manifest block — uncomment and fill each key per packs/SPEC.md; leave a key empty (and
say so here in prose) rather than guessing its value.

TWO RULES THIS PROSE IS HELD TO, both enforced by packcheck:

1. EVERY EMPTY KEY IS NAMED HERE, with what the pack loses by it. "May be empty" is not
   "may be blank in silence" — the first agent-generated pack left `required_fact:` empty
   on a language whose noun plurals are the textbook unpredictable per-lexeme fact, wrote
   nothing about it, and state/ledgers.test.ts quietly stopped checking every ledger row.
   A `#` comment on the key's own line counts too.
2. EVERY FOLD THIS PROSE CLAIMS GETS RUN. packcheck executes each `x → y` written on a
   line about folding through normalize(); the same pack advertised "ae→ä, oe→ö, ue→ü"
   above a map that folded nothing. Advertise nothing you have not implemented.

Comparative claims about other languages need a source or deletion — "no article-based
case marking like Romanian" was backwards on both languages, and setup mines this file.
(Found in the first agent-generated language pack, 2026-08-15.) -->

```mova-config
# language: <human name, e.g. Romanian>
# code: <directory name — must match>
# genders: <gender labels, e.g. m f n — empty when the language has none>
# inflection: <true|false — false switches off all morpheme-marking machinery, and is the
#              ONE flag that deletes a required fixture (golden/pairs.json). packcheck
#              cross-examines it against your endings list and your golden form column.>
# level_scale: <proficiency rungs, e.g. A1 A2 B1 B2 C1 C2>
# tts_edge: <edge-tts voice id, from `edge-tts --list-voices`>
# tts_say: <macOS say voice, from `say -v '?'`>
# stt_lang: <whisper.cpp language flag>
# required_fact: <the one unpredictable per-lexeme fact a ledger row must carry, or empty.
#                 Ask it out loud: what must this learner memorise per word because no rule
#                 derives it? Empty only after asking and answering "nothing" — in prose.>
# dictionary: <adapter source name — EMPTY when no dictionary.mjs ships; be honest>
```
