<!-- mova:pack -->
# packs/fr — French

The language pack for French: the tag grammar and inflection endings the classifier reads,
the input normalizer, the fact-verification adapter, and the prose `setup/` mines when it
generates an instance's transfer notes and error taxonomy.

**Where the facts come from.** Grammar tables and the endings list are A1–B1 material,
cross-checked against this pack's own goldens. Fact verification runs against
**en.wiktionary.org** through the shared adapter in
[`../_shared/wiktionary.mjs`](../_shared/wiktionary.mjs) — a *citable* source rather than an
authority, which is exactly the standing `docs/mechanics/verification.md` gives a dictionary.
A claim it cannot attest stays marked unverified rather than becoming quiet prose.

**Metropolitan French is the default variety.** The voices are `fr-FR`. Québécois and other
varieties share this grammar; where they diverge is vocabulary and register, which belongs
to the generated curriculum rather than here.

```mova-config
language: French
code: fr
genders: m f
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: fr-FR-DeniseNeural    # from `edge-tts --list-voices`; fr-FR-EloiseNeural is the alternative
tts_say: Thomas                 # from `say -v '?'`; Jacques is the other fr_FR voice
stt_lang: fr
required_fact:                  # EMPTY — deliberately; the paragraph below says what that costs
dictionary: wiktionary
```

## The one empty key, and what it costs

**`required_fact:` is empty.** French's unpredictable per-lexeme fact is **noun gender** —
nothing in `table`, `problème` or `eau` predicts it, and getting it wrong propagates through
every article and adjective in the sentence.

It is not declared because the row already carries it. The guard in `state/ledgers.test.ts`
selects rows by matching a pattern against the target cell and then looks for a second
pattern in the **notes** cell; French gender lives in the target cell's parenthetical
(`maison (f, maisons)`), and it is what makes the row classify as a noun at all. Declaring
the key would demand a second copy of a fact the row cannot be a noun without.

**What is lost:** nothing. Unlike Spanish — whose verb stem-change class is genuinely
unguarded — French has no second unpredictable fact hiding outside the row shape.

Every other manifest key is filled.

## What the normalizer folds

Full reasoning in [`normalize.mjs`](normalize.mjs). French uses most of the Latin-1
accented range itself, so the fold list is deliberately short: only diacritics French never
uses at all, where a fold cannot hide an error because the input could never have been
correct French.

- **The acute on a, i, o, u** — French accents only `e` with an acute: `á → à`, `í → î`,
  `ó → ô`, `ú → ù`, each aimed at the accent the word actually wants.
- **c with acute or circumflex**: `ć → ç` and `ĉ → ç`, the cedilla being unreachable on
  most layouts.
- Plus `ı → i`, the Turkish dotless i.

**Not folded:** anything in the é/è/ê family — those are different letters distinguishing
real words. No digraph either: `œ` is a real ligature but `coexister` and `moelle` spell
`oe` as two letters, so a blanket fold would corrupt them. A **missing** accent
(`eleve` for `élève`) is a language error, never repaired here.

## What the classifier does not do

`verbHeadword` is `null`: French infinitives end in -er/-ir/-re and so do `mer`, `père`,
`livre`, `hiver`. Verb rows carry an explicit `(v)` tag.
