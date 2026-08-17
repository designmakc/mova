<!-- mova:pack -->
# packs/it — Italian

The language pack for Italian: the tag grammar and inflection endings the classifier reads,
the input normalizer, the fact-verification adapter, and the prose `setup/` mines.

**Where the facts come from.** A1–B1 material cross-checked against this pack's goldens;
verification runs against **en.wiktionary.org** through
[`../_shared/wiktionary.mjs`](../_shared/wiktionary.mjs), a citable source rather than an
authority. Standard Italian is the variety; the voices are `it-IT`.

```mova-config
language: Italian
code: it
genders: m f
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: it-IT-DiegoNeural     # from `edge-tts --list-voices`; it-IT-ElsaNeural is the female alternative
tts_say: Alice                  # from `say -v '?'` — the offline macOS fallback
stt_lang: it
required_fact:                  # EMPTY — deliberately; see below
dictionary: wiktionary
```

## The one empty key, and what it costs

**`required_fact:` is empty**, for the same reason as French: Italian's unpredictable
per-lexeme fact is **noun gender**, and the row already carries it in the target cell's
parenthetical, which is what makes the row a noun. The ledger guard matches its second
pattern against the **notes** cell, so declaring the key would demand a duplicate.

**What is lost:** one thing, and it is worth naming. The **plural that changes gender** —
`uovo (m) → uova (f)`, `braccio (m) → braccia (f)`, the Latin neuter remnant — is a genuine
per-lexeme fact that the row's single gender letter cannot express. Nothing mechanical
catches a row that stores `uova` as masculine. It is handled as curriculum instead: the
class is small, closed, and taught explicitly ([`notes.md`](notes.md)).

Every other manifest key is filled.

## What the normalizer folds

Full reasoning in [`normalize.mjs`](normalize.mjs). Italian uses the grave on a, i, o, u and
both accents on e, so the folds are the diacritics it never uses:

- **The acute on a, i, u**: `á → à`, `í → ì`, `ú → ù`.
- **The circumflex**, which modern Italian does not use: `â → à`, `ê → è`, `î → ì`,
  `ô → ò`, `û → ù`.
- Plus `ı → i`, the Turkish dotless i.

**Not folded:** anything in the e family — `è` and `é` distinguish `caffè` from `perché` —
and `ò`/`ó`, where the open/closed distinction is live in dictionaries. A **missing** accent
(`citta` for `città`) is a language error and is never repaired: in Italian the final accent
is also the stress mark.

## What the classifier does not do

`verbHeadword` is `null`: Italian infinitives end in -are/-ere/-ire and collide head-on with
`mare`, `padre`, `piacere`. Verb rows carry an explicit `(v)` tag.
