<!-- mova:pack -->
# packs/pt — Portuguese

The language pack for Portuguese: the tag grammar and inflection endings the classifier
reads, the input normalizer, the fact-verification adapter, and the prose `setup/` mines.

**Where the facts come from.** A1–B1 material cross-checked against this pack's goldens;
verification runs against **en.wiktionary.org** through
[`../_shared/wiktionary.mjs`](../_shared/wiktionary.mjs), a citable source rather than an
authority.

**European Portuguese is the default variety** — the voices are `pt-PT`. Brazilian
Portuguese shares this grammar and these endings; it differs in pronunciation, in the
second person (`tu`/`você`), and in a body of vocabulary. That is a curriculum decision, and
an instance aimed at Brazil should say so in its goal contract and swap the voice.

```mova-config
language: Portuguese
code: pt
genders: m f
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: pt-PT-DuarteNeural    # from `edge-tts --list-voices`; pt-PT-RaquelNeural is the female alternative
tts_say: Joana                  # from `say -v '?'` — the offline macOS fallback
stt_lang: pt
required_fact:                  # EMPTY — deliberately; see below
dictionary: wiktionary
```

## The one empty key, and what it costs

**`required_fact:` is empty.** Portuguese has TWO unpredictable per-lexeme facts, and they
sit differently:

- **Noun gender** — already in the target cell's parenthetical, and what makes the row a
  noun. Declaring the key would demand a duplicate in notes.
- **Which plural an `-ão` noun takes** — `mão → mãos`, `pão → pães`, `limão → limões`. One
  ending, three classes, and nothing but memory separates them. This one is *not*
  structurally guaranteed: a row may be saved as `limão (m)` with no plural at all.

**What is lost:** an `-ão` row without its plural passes CI. The guard could not be made to
catch it — `rowPattern` matches the target cell, so it can select `-ão` nouns, but
`factPattern` then looks in **notes**, which would force the plural to be written somewhere
other than the parenthetical every other noun uses. A convention that contradicts itself per
noun class is worse than a documented gap, so the pack states the gap and the vocab playbook
carries the rule. The dictionary adapter attests all three classes correctly, which is the
real mitigation.

Every other manifest key is filled.

## What the normalizer folds

Full reasoning in [`normalize.mjs`](normalize.mjs). Portuguese carries a heavy functional
load on its diacritics, so this map is narrower than the Spanish one even though the two
languages look alike on the page:

- **The grave on e, i, o, u** — Portuguese graves only `a`, and only as the crase:
  `è → é`, `ì → í`, `ò → ó`, `ù → ú`.
- **The circumflex on i and u**, which Portuguese does not use: `î → í`, `û → ú`.
- Plus `ı → i`, the Turkish dotless i.

**Not folded, each for a reason:** `à` is a real letter carrying the crase (`vou à praia`);
the tilde is the language's signature and `ã`/`õ` are never touched; and `â ê ô` distinguish
real pairs — `avô` and `avó` are different people.

## What the classifier does not do

`verbHeadword` is `null`: Portuguese infinitives end in -ar/-er/-ir and so do `mulher`,
`lugar`, `mar`, `prazer`. Verb rows carry an explicit `(v)` tag.
