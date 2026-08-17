<!-- mova:pack -->
# packs/es — Spanish

The language pack for Spanish: the tag grammar and inflection endings the classifier reads,
the input normalizer, the fact-verification adapter, and the prose `setup/` mines when it
generates an instance's transfer notes and error taxonomy.

**Where the facts come from.** Grammar tables and the endings list are A1–B1 material and
are cross-checked against the pack's own goldens; every noun in `golden/words.json` carries
the gender and plural the dictionary adapter returns for it. Fact verification runs against
**en.wiktionary.org**, through the shared adapter in
[`../_shared/wiktionary.mjs`](../_shared/wiktionary.mjs). Wiktionary is crowd-sourced: it is
a *citable* source, not an authority — better than the agent's memory, weaker than a tutor,
which is exactly the standing `docs/mechanics/verification.md` gives a dictionary. A claim
it cannot attest stays marked unverified rather than becoming quiet prose.

**Peninsular Spanish is the default variety.** The voices are `es-ES`, and the endings and
articles are shared across varieties, so an instance aimed at Latin American Spanish needs
no change here — but `vosotros`, `vos` and the `-ís/-áis` forms are a real fork, and the
generated curriculum, not this pack, is where a variety choice belongs.

```mova-config
language: Spanish
code: es
genders: m f
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge: es-ES-AlvaroNeural    # from `edge-tts --list-voices`; es-ES-ElviraNeural is the female alternative
tts_say: Mónica                 # from `say -v '?'` — the offline macOS fallback
stt_lang: es
required_fact:                  # EMPTY — deliberately, and the paragraph below says what that costs
dictionary: wiktionary
```

## The one empty key, and what it costs

**`required_fact:` is empty.** Spanish does have an unpredictable per-lexeme fact — the
**verb stem-change class**: nothing in `pensar` predicts `pienso`, nothing in `poder`
predicts `puedo`, and a learner who has not memorised it per verb will produce `penso`
every time. It is the exact counterpart of Romanian's eu-form.

It is not declared, because it could not be enforced honestly. The guard in
`state/ledgers.test.ts` selects rows by matching a pattern against the **target string**,
and Spanish gives it nothing to match on: infinitives end in `-ar/-er/-ir` and so do
ordinary nouns — `mujer`, `mar`, `lugar`, `azúcar`, `deber`, `poder`. Any pattern wide
enough to catch `pensar` demands a yo-form on `mujer`.

**What is lost:** nothing stops a Spanish verb row from being saved without its yo-form, so
a stem-changing verb can enter the ledger looking regular and be drilled wrong. The
mitigation is a teaching rule rather than a mechanical one — the vocab and lesson playbooks
carry it, and `docs/mechanics/verification.md` still requires the form to be verified before
it is taught. Declaring the key and shipping a pattern that fires on nouns would be worse
than this paragraph: an unenforceable guard advertised as a guard is how the first
agent-generated pack silently switched its ledger check off.

Every other manifest key is filled.

## What the normalizer folds

Full reasoning in [`normalize.mjs`](normalize.mjs). In short, two classes:

- **ñ**, typed on a layout that has no ñ: `ń → ñ`, `ň → ñ`, `ǹ → ñ`, `ṅ → ñ`.
- **The wrong accent direction**, from layouts where the grave or circumflex is the easy
  key: `à → á`, `è → é`, `ì → í`, `ò → ó`, `ù → ú`, and `â → á`, `ê → é`, `î → í`,
  `ô → ó`, `û → ú`. Safe *because Spanish uses neither diacritic at all* — `à` is not a
  possible Spanish spelling, so folding it cannot hide a real error. The same fold would be
  destructive in French or Italian, which is why it lives in the pack and not the engine.
- Plus `ı → i`, the Turkish dotless i, a paste artefact that renders as a bare i.

**Not folded:** `ü` is a real Spanish letter (`pingüino`), and a **missing** accent
(`cancion` for `canción`) is a language error graded as `ORTH-ACC`, never repaired here.

## What the classifier does not do

`verbHeadword` is `null`: Spanish has no infinitive marker, so a verb row must carry an
explicit `(v)` tag. See the comment in [`pos-tables.mjs`](pos-tables.mjs) — a shape rule
here would classify `mujer` as a verb.
