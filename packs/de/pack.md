<!-- mova:pack -->
# packs/de — German

The language pack for German: the tag grammar and inflection endings the classifier reads,
the input normalizer, the fact-verification adapter, and the prose `setup/` mines.

**This pack replaces an earlier agent-generated one.** On 2026-08-15 a German pack was
generated during a setup run and printed `packs/de: ok` while shipping a normalizer whose
every entry mapped a letter to itself, `inflection: false` above a fixture file full of
*Bücher* and *Männer*, an empty `required_fact:` that silently switched off the ledger
guard, and four error-taxonomy rows whose wrong and corrected forms were the same string.
Every one of those was already forbidden in prose and enforced by nothing;
`scripts/packcheck.mjs` gained its behaviour checks because of it. This pack is written
against those checks, and where it turns a guard off it argues the case in the open.

**Where the facts come from.** A1–B1 material cross-checked against this pack's goldens;
verification runs against **en.wiktionary.org** through
[`../_shared/wiktionary.mjs`](../_shared/wiktionary.mjs), a citable source rather than an
authority. Standard German is the variety; the voices are `de-DE`.

```mova-config
language: German
code: de
genders: m f n
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: de-DE-AmalaNeural     # from `edge-tts --list-voices`; de-DE-ConradNeural is the male alternative
tts_say: Anna                   # from `say -v '?'` — the offline macOS fallback
stt_lang: de
required_fact:                  # EMPTY — and this was the closest call of the five packs
dictionary: wiktionary
```

## The one empty key — and why German is the hardest case

German's unpredictable per-lexeme facts are **gender and plural**, and they are the most
consequential in any of these five languages: three genders that sense does not predict
(`das Mädchen` is neuter), and five plural classes any of which may add an umlaut.
`state/ledgers.test.ts`'s guard exists for exactly this shape of fact, and German is the
language that most obviously deserves it.

**It is still empty, and the reason is mechanical.** The guard works in two halves:
`rowPattern` selects rows by matching the **target** cell, and `factPattern` then requires a
match in the **notes** cell. German gives the first half something excellent — every noun is
capitalised, so `/^[A-ZÄÖÜ]/` selects nouns cleanly, which is more than Spanish or French can
offer. The second half is where it fails: gender and plural already live in the target cell's
parenthetical (`Buch (n, Bücher)`), the same convention every other pack uses, and the guard
cannot look there. Declaring the key would force German noun rows to carry their plural
**twice** — once in the parenthetical the deck and the classifier read, and once in notes to
satisfy a test.

**What is lost:** a row may be saved as `Buch (n)` with no plural, and nothing fails. That is
a real gap and it is worth stating plainly rather than papering over with a duplicate
convention. The mitigations are honest ones: the classifier still requires the gender letter
for the row to be a noun at all, the dictionary adapter attests the plural on demand, and
`docs/mechanics/verification.md` requires the form to be verified before it is taught.

The alternative — declaring `required_fact: plural` and inventing a notes convention German
alone uses — is how conventions rot. The first agent-generated pack left this key blank in
silence; the difference here is the paragraph you are reading.

Every other manifest key is filled.

## The digraphs are NOT folded

The single most important line in [`normalize.mjs`](normalize.mjs), and the direct
correction of the earlier pack, which advertised `ae→ä, oe→ö, ue→ü` and implemented nothing.
Implementing it would have been **wrong**: `Steuer`, `Feuer`, `teuer`, `neue`, `Museum`,
`Aerobic` and `Michael` all spell those pairs as two ordinary letters. A blanket fold turns
`Steuer` into `Stüer`. The transcription convention is real, but it depends on knowing the
word, which a silent normalizer does not.

`ss` for `ß` is left alone for a second reason: `Maße` and `Masse` are different words, and
Swiss Standard German writes `ss` for every `ß` on purpose — folding it would grade a correct
Swiss spelling as an error.

**What is folded** is only true look-alike codepoints, letters from other alphabets that sit
in a ledger as invisible duplicates: Hungarian double acute `ő → ö` and `ű → ü`, macron
`ā → ä`, `ō → ö`, `ū → ü`, Greek `β → ß`, and `ı → i`. A **missing** umlaut is never
repaired — in German it is usually a different word (`schon`/`schön`, `Mutter`/`Mütter`).

## What the classifier does not do

`verbHeadword` is `null`: German infinitives end in `-en`, and so do plurals, dative plurals
and `oben`, `eben`, `gegen`, `neben`, `Damen`. Verb rows carry an explicit `(v)` tag.
