<!-- mova:engine -->
# packs/<code> — <Language>

<!-- Replace the marker above with `mova:pack` when instantiating. Prose header: what
this pack is, where its facts come from, what it deliberately leaves out. Then the
manifest block — uncomment and fill each key per packs/SPEC.md; leave a key empty (and
say so here in prose) rather than guessing its value. -->

```mova-config
# language: <human name, e.g. Romanian>
# code: <directory name — must match>
# genders: <gender labels, e.g. m f n — empty when the language has none>
# inflection: <true|false — false switches off all morpheme-marking machinery>
# level_scale: <proficiency rungs, e.g. A1 A2 B1 B2 C1 C2>
# tts_edge: <edge-tts voice id, from `edge-tts --list-voices`>
# tts_say: <macOS say voice, from `say -v '?'`>
# stt_lang: <whisper.cpp language flag>
# required_fact: <the one unpredictable per-lexeme fact a ledger row must carry, or empty>
# dictionary: <adapter source name — EMPTY when no dictionary.mjs ships; be honest>
```
