<!-- mova:pack -->
# packs/el — Greek

The language pack for Modern Greek: the tag grammar and inflection endings the classifier
reads, the input normalizer, the fact-verification adapter, and the prose `setup/` mines.

**The first pack in a non-Latin script**, and the honest report on what that cost. The
engine held: the tag grammar, the ending-cut model, the article table and the deck all work
unchanged. One thing broke, in the *shared* adapter rather than here — it read a noun's
gender from the position of a token in the rendered dictionary line, and a Greek headword
renders as `βιβλίο • (vivlío) n (plural βιβλία)`, with a transliteration sitting exactly
where the gender was expected. Every Greek noun came back genderless while the rule looked
correct on five Latin-script packs. It now reads the gender markup instead
(`../_shared/wiktionary.mjs`, 2026-08-17), and the five existing packs' recorded fixtures
caught two regressions in that change before it shipped.

**Where the facts come from.** A1–B1 Modern Greek, cross-checked against this pack's own
goldens; verification runs against **en.wiktionary.org**, a citable source rather than an
authority. Demotic Modern Greek is the variety; Katharevousa and Ancient Greek are
different languages for this purpose and are not what this pack teaches.

```mova-config
language: Greek
code: el
genders: m f n
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: el-GR-AthinaNeural    # from `edge-tts --list-voices`; el-GR-NestorasNeural is the male alternative
tts_say: Melina                 # from `say -v '?'` — the only el_GR system voice
stt_lang: el
required_fact:                  # EMPTY — deliberately; see below
dictionary: wiktionary
```

## Greek recognises its own verbs — the one table that differs from every other pack

`verbHeadword` is **not null**, and Greek is only the second pack that can say that (the
Romanian reference pack is the other). Greek dictionaries cite a verb in the **first person
singular present** rather than an infinitive — `γράφω` "I write", `μιλάω` "I speak",
`έρχομαι` "I come" — and that form ends in `-ω`, `-ώ` or `-μαι`, which ordinary nouns
essentially never do. The exceptions (`ηχώ`, `πειθώ`) are a tiny closed feminine class and
are safe regardless, because the rule only ever sees an **untagged** headword and a noun row
carries its gender letter.

So Greek verb rows need no `(v)` tag. All five Romance and Germanic packs do, because their
infinitives are indistinguishable from ordinary nouns.

## The one empty key, and what it costs

**`required_fact:` is empty.** Greek's unpredictable per-lexeme facts are **gender** and
**which declension the plural follows**, and both already live in the row's target cell
(`βιβλίο (n, βιβλία)`) — gender is what makes the row a noun at all. The guard in
`state/ledgers.test.ts` matches its second pattern against the **notes** cell, so declaring
the key would demand a duplicate.

**What is lost:** a third fact that no pack's row shape can hold — **where the accent lands
in the plural**. `παιδί → παιδιά` moves it; `βιβλίο → βιβλία` does not; the neuter
`-μα` class moves it in the genitive (`το όνομα → του ονόματος`). Because the accent is
written and carries the stress, getting it wrong is both a spelling error and a
pronunciation error. Nothing mechanical catches it. The mitigation is that the pair marking
*shows* the accent moving whenever both forms are on a row, and the curriculum teaches the
stress rule explicitly ([`notes.md`](notes.md)).

Every other manifest key is filled.

## What the normalizer folds — the most load-bearing of the seven packs

Full reasoning in [`normalize.mjs`](normalize.mjs). Greek is the only pack whose look-alikes
are **identical glyphs** rather than near-misses: `Α` (Greek), `A` (Latin) and `А`
(Cyrillic) render the same in every font. A learner who types `Αθήνα` with a Latin capital
has produced a word nobody can tell from the right one and no ledger can match.

- **Latin capitals**, which is where a learner's shift key lands: `A B E H I K M N O P T X
  Y Z` → their Greek twins. Plus lowercase `o → ο`, the one total lowercase collision.
- **Cyrillic**, which is not hypothetical for this workspace — the engine came from a
  learner who types Ukrainian daily: `А Е О Р Т Х` and `а е о р х у` → their Greek twins.

**Not folded, each deliberately:** the **final sigma** (`ς` and `σ` are the same letter in
two positions; `κόσμος` correctly takes both, and `κόσμοσ` is a real orthographic error);
the **tonos**, because a missing accent is a language error that also changes the spoken
stress; and Latin lowercase beyond `o`, because `v` for `ν` is a transliteration habit
rather than a glyph collision and folding it would corrupt any Latin string a row contains.
